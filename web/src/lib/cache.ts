/** IndexedDB cache for Gemini text + TTS audio so we don't regenerate. */

const DB_NAME = 'cw-cache-v1'
const DB_VERSION = 1
const STORE = 'entries'

type CacheKind = 'text' | 'audio'

interface CacheRecord {
  key: string
  kind: CacheKind
  /** UTF-8 text or base64 audio payload */
  value: string
  mimeType?: string
  createdAt: number
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'key' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('idb open failed'))
  })
}

async function getRecord(key: string): Promise<CacheRecord | null> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(key)
    req.onsuccess = () => resolve((req.result as CacheRecord | undefined) ?? null)
    req.onerror = () => reject(req.error)
  })
}

async function putRecord(record: CacheRecord): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(record)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function cacheGetText(key: string): Promise<string | null> {
  const rec = await getRecord(`text:${key}`)
  return rec?.kind === 'text' ? rec.value : null
}

export async function cacheSetText(key: string, value: string): Promise<void> {
  await putRecord({
    key: `text:${key}`,
    kind: 'text',
    value,
    createdAt: Date.now(),
  })
}

export async function cacheGetAudio(
  key: string,
): Promise<{ base64: string; mimeType: string } | null> {
  const rec = await getRecord(`audio:${key}`)
  if (!rec || rec.kind !== 'audio') return null
  return { base64: rec.value, mimeType: rec.mimeType ?? 'audio/wav' }
}

export async function cacheSetAudio(
  key: string,
  base64: string,
  mimeType: string,
): Promise<void> {
  await putRecord({
    key: `audio:${key}`,
    kind: 'audio',
    value: base64,
    mimeType,
    createdAt: Date.now(),
  })
}

/** Stable short hash for cache keys */
export async function hashKey(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}
