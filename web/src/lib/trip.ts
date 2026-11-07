import { localCalendarDay, notifyLocalChange } from './srs'

/**
 * Patagonia trip plan state. Sessions are numbered study days: a missed
 * calendar day pushes content back instead of stacking it up.
 */
const TRIP_KEY = 'colloquial-welsh-trip-v1'

export type BlockId =
  | 'review'
  | 'phrases'
  | 'listen'
  | 'shadow'
  | 'speak'
  | 'retell'
  | 'pattern'
  | 'story'
  | 'human'
  | 'outreach'
  | 'clip'
  | 'checkpoint'

export interface SessionLog {
  /** Calendar day the session was finished. */
  date: string
  /** Set when this session was folded into a catch-up double session. */
  mergedInto?: number
}

export interface CheckpointResult {
  date: string
  /** 1–5 overall from the AI examiner. */
  overall: number
  fluency: number
  range: number
  accuracy: number
  interaction: number
  summary: string
  /** Measured in the app, so weeks compare on numbers (absent on older results). */
  wordsPerTurn?: number
  /** Welsh words per recorded minute. */
  speechRate?: number
  /** Share of partner turns understood by ear, 0–1. */
  understoodByEar?: number
  welshShare?: number
  /** Scenario goal: 0 no, 1 partly, 2 yes. */
  taskDone?: number
}

export interface IntroProfile {
  name: string
  city: string
  region: string
  job: string
  livesIn: string
  languages: string
  why: string
}

export interface GapNote {
  date: string
  text: string
}

export interface TripState {
  /** Departure day, YYYY-MM-DD. */
  tripDate: string
  startedOn: string
  /** Implementation intention: "After ___, I open the app." */
  cue: string
  /** Finished sessions, keyed by session number. */
  done: Record<string, SessionLog>
  /** Blocks ticked inside a session that isn't finished yet. */
  blocks: Record<string, BlockId[]>
  /** Calendar days where only the 10-minute minimum was done. */
  light: string[]
  /** Calendar days where at least one block was done, finished session or not. */
  active: string[]
  /** Weekly speaking checkpoints, keyed by week number. */
  checkpoints: Record<string, CheckpointResult>
  profile: IntroProfile
  /** Things you wanted to say but couldn't — ask about these later. */
  gaps: GapNote[]
  updatedAt: string
  /** Latest conversation-report corrections (newest first, max 3) for the AI partner to target. */
  recentFixes?: string[]
}

export const EMPTY_PROFILE: IntroProfile = {
  name: '',
  city: '',
  region: '',
  job: '',
  livesIn: '',
  languages: '',
  why: '',
}

function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number)
  return localCalendarDay(new Date(y!, m! - 1, d! + n))
}

export function daysBetween(from: string, to: string): number {
  const [y1, m1, d1] = from.split('-').map(Number)
  const [y2, m2, d2] = to.split('-').map(Number)
  const a = Date.UTC(y1!, m1! - 1, d1!)
  const b = Date.UTC(y2!, m2! - 1, d2!)
  return Math.round((b - a) / 86_400_000)
}

function defaultTrip(): TripState {
  const today = localCalendarDay()
  return {
    tripDate: addDays(today, 60),
    startedOn: today,
    cue: '',
    done: {},
    blocks: {},
    light: [],
    active: [],
    checkpoints: {},
    profile: { ...EMPTY_PROFILE },
    gaps: [],
    updatedAt: '',
  }
}

export function tripFromRaw(raw: unknown): TripState {
  const base = defaultTrip()
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return base
  const r = raw as Partial<TripState>
  return {
    tripDate: typeof r.tripDate === 'string' ? r.tripDate : base.tripDate,
    startedOn: typeof r.startedOn === 'string' ? r.startedOn : base.startedOn,
    cue: typeof r.cue === 'string' ? r.cue : '',
    done: r.done && typeof r.done === 'object' ? r.done : {},
    blocks: r.blocks && typeof r.blocks === 'object' ? r.blocks : {},
    light: Array.isArray(r.light) ? r.light : [],
    active: Array.isArray(r.active) ? r.active : [],
    checkpoints:
      r.checkpoints && typeof r.checkpoints === 'object' ? r.checkpoints : {},
    profile: { ...EMPTY_PROFILE, ...(r.profile ?? {}) },
    gaps: Array.isArray(r.gaps) ? r.gaps : [],
    ...(Array.isArray(r.recentFixes)
      ? { recentFixes: r.recentFixes.filter((f) => typeof f === 'string').slice(0, 3) }
      : {}),
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : '',
  }
}

/** Raw stored trip JSON (for account sync), or null before first save. */
export function readTripRaw(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(TRIP_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

export function writeTripRaw(raw: Record<string, unknown>): void {
  localStorage.setItem(TRIP_KEY, JSON.stringify(raw))
}

export function loadTrip(): TripState {
  return tripFromRaw(readTripRaw())
}

export function saveTrip(trip: TripState): TripState {
  const next = { ...trip, updatedAt: new Date().toISOString() }
  writeTripRaw(next as unknown as Record<string, unknown>)
  notifyLocalChange()
  return next
}

export function isSessionDone(trip: TripState, n: number): boolean {
  return Boolean(trip.done[String(n)])
}

export function completedCount(trip: TripState): number {
  return Object.keys(trip.done).length
}

/** Lowest session number not finished yet, or null when the plan is done. */
export function currentSession(trip: TripState, total: number): number | null {
  for (let n = 1; n <= total; n++) {
    if (!isSessionDone(trip, n)) return n
  }
  return null
}

/** Calendar days with any study: a finished session, the busy-day minimum, or any block done. */
export function studyDays(trip: TripState): Set<string> {
  const days = new Set([...trip.light, ...trip.active])
  for (const log of Object.values(trip.done)) days.add(log.date)
  return days
}

/**
 * Study days in a row. The plan has a spare day most weeks, so one missed
 * day is a rest day and never breaks the streak; two in a row do.
 */
export function streak(trip: TripState, today = localCalendarDay()): number {
  const days = studyDays(trip)
  let n = 0
  let misses = 0
  // Today not done yet doesn't count as a miss.
  let cursor = days.has(today) ? today : addDays(today, -1)
  while (misses < 2) {
    if (days.has(cursor)) {
      n += 1
      misses = 0
    } else {
      misses += 1
    }
    cursor = addDays(cursor, -1)
  }
  return n
}

/** Whole calendar days since the last study day (0 = studied today). */
export function daysSinceStudy(
  trip: TripState,
  today = localCalendarDay(),
): number | null {
  const days = [...studyDays(trip)].sort()
  const last = days[days.length - 1]
  if (!last) return null
  return daysBetween(last, today)
}

export type PaceStatus = 'ahead' | 'on-track' | 'tight' | 'behind' | 'done'

export interface Pace {
  status: PaceStatus
  remaining: number
  daysLeft: number
  /** Spare calendar days after one session per remaining day. */
  slack: number
  /** Sessions you'd have done by now at an even pace. */
  expectedByNow: number
  completed: number
}

export function tripPace(
  trip: TripState,
  total: number,
  today = localCalendarDay(),
): Pace {
  const completed = completedCount(trip)
  const remaining = Math.max(0, total - completed)
  // Days you can still study before the flight, today included.
  const daysLeft = Math.max(0, daysBetween(today, trip.tripDate))
  const span = Math.max(1, daysBetween(trip.startedOn, trip.tripDate))
  const elapsed = Math.min(span, Math.max(0, daysBetween(trip.startedOn, today)))
  const expectedByNow = Math.floor((elapsed / span) * total)
  const slack = daysLeft - remaining
  let status: PaceStatus
  if (remaining === 0) status = 'done'
  else if (slack < 0) status = 'behind'
  else if (slack < Math.ceil(daysLeft / 10)) status = 'tight'
  else if (completed > expectedByNow) status = 'ahead'
  else status = 'on-track'
  return { status, remaining, daysLeft, slack, expectedByNow, completed }
}

export function toggleBlock(
  trip: TripState,
  n: number,
  block: BlockId,
  on: boolean,
): TripState {
  const key = String(n)
  const cur = new Set(trip.blocks[key] ?? [])
  if (on) cur.add(block)
  else cur.delete(block)
  // Any finished block makes it a study day, so a half session still counts.
  const today = localCalendarDay()
  const active = on && !trip.active.includes(today) ? [...trip.active, today] : trip.active
  return saveTrip({ ...trip, active, blocks: { ...trip.blocks, [key]: [...cur] } })
}

export function finishSession(
  trip: TripState,
  sessions: number[],
  today = localCalendarDay(),
): TripState {
  const done = { ...trip.done }
  const blocks = { ...trip.blocks }
  const [primary, ...rest] = sessions
  if (primary == null) return trip
  done[String(primary)] = { date: today }
  for (const n of rest) done[String(n)] = { date: today, mergedInto: primary }
  for (const n of sessions) delete blocks[String(n)]
  return saveTrip({ ...trip, done, blocks })
}

export function reopenSession(trip: TripState, n: number): TripState {
  const done = { ...trip.done }
  delete done[String(n)]
  for (const [k, log] of Object.entries(done)) {
    if (log.mergedInto === n) delete done[k]
  }
  return saveTrip({ ...trip, done })
}

export function markLightDay(
  trip: TripState,
  today = localCalendarDay(),
): TripState {
  if (trip.light.includes(today)) return trip
  return saveTrip({ ...trip, light: [...trip.light, today] })
}

export function addGap(trip: TripState, text: string): TripState {
  const t = text.trim()
  if (!t) return trip
  return saveTrip({
    ...trip,
    gaps: [{ date: localCalendarDay(), text: t }, ...trip.gaps].slice(0, 200),
  })
}

export function removeGap(trip: TripState, index: number): TripState {
  return saveTrip({ ...trip, gaps: trip.gaps.filter((_, i) => i !== index) })
}

export function saveCheckpoint(
  trip: TripState,
  week: number,
  result: CheckpointResult,
): TripState {
  return saveTrip({
    ...trip,
    checkpoints: { ...trip.checkpoints, [String(week)]: result },
  })
}
