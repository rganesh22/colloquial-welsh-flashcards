import {
  chunkProgress,
  mergePayloads,
  stableJson,
  unchunkProgress,
  asDaily,
  asRecord,
  type AccountPayload,
} from './accountMerge'
import {
  applyAccountPayload,
  loadSettings,
  localCalendarDay,
  readAccountPayload,
  setLocalChangeHook,
  settingsLookDefault,
  type AppSettings,
} from './srs'
import type { ProgressMap } from './types'

export type AccountPhase =
  | 'off'
  | 'checking'
  | 'signed-out'
  | 'saving'
  | 'saved'
  | 'error'

export interface AccountUser {
  email: string | null
  name: string | null
}

type StatusListener = (phase: AccountPhase, detail: string) => void
type AppliedListener = (progress: ProgressMap, settings: AppSettings) => void

const SIGNED_OUT =
  'Saved in this browser. Sign in to keep this schedule on your other devices.'

let statusListener: StatusListener | null = null
let appliedListener: AppliedListener | null = null
let timer: number | null = null
let running = false
let queued = false
let visibleSync = false

export function accountSyncEnabled(): boolean {
  const env = import.meta.env
  return Boolean(
    env.VITE_FIREBASE_API_KEY &&
      env.VITE_FIREBASE_AUTH_DOMAIN &&
      env.VITE_FIREBASE_PROJECT_ID &&
      env.VITE_FIREBASE_APP_ID,
  )
}

function firebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
}

async function loadServices() {
  const { getApp, getApps, initializeApp } = await import('firebase/app')
  const { getAuth } = await import('firebase/auth')
  const { getFirestore } = await import('firebase/firestore')
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig())
  return { auth: getAuth(app), db: getFirestore(app) }
}

function firebaseCode(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    return String((err as { code: unknown }).code)
  }
  return ''
}

function authMessage(err: unknown): string {
  const code = firebaseCode(err)
  if (code === 'auth/unauthorized-domain') {
    return 'This site isn’t allowed to use Google sign-in yet.'
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Google sign-in isn’t enabled for this project yet.'
  }
  if (code === 'permission-denied') {
    return 'The account database refused the save. This browser copy is still here.'
  }
  if (err instanceof Error && err.message) return err.message
  return 'Could not reach your account. This browser copy is still here.'
}

function savedLabel(user: AccountUser | null): string {
  const who = user?.email || user?.name
  return who ? `Saved to your account · ${who}` : 'Saved to your account'
}

function payloadFromCloud(
  data: Record<string, unknown>,
  bodies: string[],
): AccountPayload {
  return {
    progress: unchunkProgress(bodies),
    settings: asRecord(data.settings),
    settingsUpdatedAt:
      typeof data.settingsUpdatedAt === 'string' ? data.settingsUpdatedAt : null,
    daily: asDaily(data.daily),
    introHistory: asRecord(data.introHistory),
  }
}

async function syncOnce(quiet: boolean): Promise<void> {
  if (!accountSyncEnabled()) return
  const { auth, db } = await loadServices()
  const user = auth.currentUser
  if (!user) return
  const accountUser: AccountUser = {
    email: user.email,
    name: user.displayName,
  }
  if (!quiet) statusListener?.('saving', 'Saving to your account…')
  const fs = await import('firebase/firestore')
  const uid = user.uid
  const result = await fs.runTransaction(db, async (tx) => {
    const userRef = fs.doc(db, 'users', uid)
    const userSnap = await tx.get(userRef)
    const data = userSnap.exists() ? asRecord(userSnap.data()) : null
    const rawCount = data?.chunkCount
    const chunkCount =
      typeof rawCount === 'number' && Number.isFinite(rawCount)
        ? Math.min(100, Math.max(0, Math.floor(rawCount)))
        : 0
    const bodies: string[] = []
    for (let i = 0; i < chunkCount; i++) {
      const chunkSnap = await tx.get(fs.doc(db, 'users', uid, 'chunks', `p${i}`))
      const body = chunkSnap.exists() ? chunkSnap.data().body : '{}'
      bodies.push(typeof body === 'string' ? body : '{}')
    }
    const cloud = data ? payloadFromCloud(data, bodies) : null
    const local = readAccountPayload()
    let merged = mergePayloads(
      local,
      cloud,
      localCalendarDay(),
      settingsLookDefault(loadSettings()),
    )
    if (!merged.settingsUpdatedAt) {
      merged = { ...merged, settingsUpdatedAt: new Date().toISOString() }
    }
    const cloudComparable = cloud ?? {
      progress: {},
      settings: {},
      settingsUpdatedAt: null,
      daily: null,
      introHistory: {},
    }
    const localChanged = stableJson(local) !== stableJson(merged)
    const cloudChanged = stableJson(cloudComparable) !== stableJson(merged)
    if (cloudChanged) {
      const settings = { ...merged.settings }
      delete settings.apiKey
      const chunks = chunkProgress(merged.progress)
      tx.set(userRef, {
        settings,
        settingsUpdatedAt: merged.settingsUpdatedAt,
        daily: merged.daily,
        introHistory: merged.introHistory,
        chunkCount: chunks.length,
        updatedAt: fs.serverTimestamp(),
      })
      for (let i = 0; i < chunks.length; i++) {
        tx.set(fs.doc(db, 'users', uid, 'chunks', `p${i}`), { body: chunks[i] })
      }
      for (let i = chunks.length; i < chunkCount; i++) {
        tx.delete(fs.doc(db, 'users', uid, 'chunks', `p${i}`))
      }
    }
    return { localChanged, merged }
  })
  if (result.localChanged) {
    const applied = applyAccountPayload(result.merged)
    appliedListener?.(applied.progress, applied.settings)
  }
  statusListener?.('saved', savedLabel(accountUser))
}

async function kick(quiet: boolean): Promise<void> {
  if (running) {
    queued = true
    if (!quiet) visibleSync = true
    return
  }
  running = true
  try {
    await syncOnce(quiet)
  } catch (err) {
    console.error('Account sync failed', err)
    statusListener?.('error', authMessage(err))
  } finally {
    running = false
    if (queued) {
      queued = false
      const show = visibleSync
      visibleSync = false
      void kick(!show)
    }
  }
}

function schedule(visible: boolean): void {
  if (!accountSyncEnabled()) return
  if (visible) visibleSync = true
  if (timer != null) window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    timer = null
    const show = visibleSync
    visibleSync = false
    void kick(!show)
  }, 1200)
}

export function flushAccountSync(): void {
  if (!accountSyncEnabled()) return
  if (timer != null) {
    window.clearTimeout(timer)
    timer = null
  }
  void kick(true)
}

export function subscribeAccount(handlers: {
  onSession: (user: AccountUser | null) => void
  onStatus: StatusListener
  onApplied: AppliedListener
}): () => void {
  if (!accountSyncEnabled()) {
    handlers.onStatus('off', 'Saved in this browser')
    return () => {}
  }
  statusListener = handlers.onStatus
  appliedListener = handlers.onApplied
  setLocalChangeHook(() => schedule(false))
  handlers.onStatus('checking', 'Checking your account…')
  let unsub = () => {}
  let cancelled = false
  void (async () => {
    const { auth } = await loadServices()
    const { getRedirectResult, onAuthStateChanged } = await import('firebase/auth')
    if (cancelled) return
    try {
      await getRedirectResult(auth)
    } catch (err) {
      if (!cancelled && firebaseCode(err) !== 'auth/popup-closed-by-user') {
        handlers.onStatus('error', authMessage(err))
      }
    }
    if (cancelled) return
    unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        handlers.onSession(null)
        handlers.onStatus('signed-out', SIGNED_OUT)
        return
      }
      handlers.onSession({ email: user.email, name: user.displayName })
      void kick(false)
    })
  })().catch((err) => {
    console.error(err)
    handlers.onStatus('error', authMessage(err))
  })
  return () => {
    cancelled = true
    unsub()
    setLocalChangeHook(null)
    statusListener = null
    appliedListener = null
  }
}

export async function signInWithGoogle(): Promise<void> {
  if (!accountSyncEnabled()) return
  statusListener?.('saving', 'Opening Google sign-in…')
  try {
    const { auth } = await loadServices()
    const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } =
      await import('firebase/auth')
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      if (firebaseCode(err) === 'auth/popup-blocked') {
        await signInWithRedirect(auth, provider)
        return
      }
      throw err
    }
  } catch (err) {
    if (firebaseCode(err) === 'auth/popup-closed-by-user') {
      statusListener?.('signed-out', SIGNED_OUT)
      return
    }
    console.error(err)
    statusListener?.('error', authMessage(err))
  }
}

export async function signOutAccount(): Promise<void> {
  if (!accountSyncEnabled()) return
  const { auth } = await loadServices()
  const { signOut } = await import('firebase/auth')
  await signOut(auth)
}
