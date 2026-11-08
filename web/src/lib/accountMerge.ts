/** Pure merge helpers for account sync. No Firebase imports. */

export interface DailyRecord {
  date: string
  ids: string[]
  reviews: number
}

export interface AccountPayload {
  progress: Record<string, unknown>
  settings: Record<string, unknown>
  settingsUpdatedAt: string | null
  daily: DailyRecord | null
  introHistory: Record<string, unknown>
  /** Patagonia trip plan; absent on accounts saved before it existed. */
  trip?: Record<string, unknown> | null
}

const DEFAULT_CHUNK_BYTES = 700_000

export function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(',')}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(
      ([a], [b]) => (a < b ? -1 : a > b ? 1 : 0),
    )
    return `{${entries
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(',')}}`
  }
  return JSON.stringify(value) ?? 'null'
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function asDaily(value: unknown): DailyRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const row = value as { date?: unknown; ids?: unknown; reviews?: unknown }
  if (typeof row.date !== 'string' || !row.date) return null
  const ids = Array.isArray(row.ids)
    ? row.ids.filter((id): id is string => typeof id === 'string')
    : []
  const reviews =
    typeof row.reviews === 'number' && Number.isFinite(row.reviews)
      ? row.reviews
      : 0
  return { date: row.date, ids, reviews }
}

function reviewStamp(card: unknown): number {
  if (!card || typeof card !== 'object') return 0
  const review = (card as { last_review?: unknown }).last_review
  if (review instanceof Date) {
    const time = review.getTime()
    return Number.isFinite(time) ? time : 0
  }
  if (typeof review === 'string' || typeof review === 'number') {
    const time = new Date(review).getTime()
    return Number.isFinite(time) ? time : 0
  }
  return 0
}

function reviewReps(card: unknown): number {
  if (!card || typeof card !== 'object') return 0
  const reps = (card as { reps?: unknown }).reps
  return typeof reps === 'number' && Number.isFinite(reps) ? reps : 0
}

/** Keep the copy reviewed most recently. Fill in cards the other side lacks. */
export function mergeProgress(
  local: Record<string, unknown>,
  remote: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...local }
  for (const [id, card] of Object.entries(remote ?? {})) {
    if (!card || typeof card !== 'object' || Array.isArray(card)) continue
    const current = out[id]
    if (!current || typeof current !== 'object') {
      out[id] = card
      continue
    }
    const localStamp = reviewStamp(current)
    const remoteStamp = reviewStamp(card)
    if (remoteStamp > localStamp) out[id] = card
    else if (remoteStamp === localStamp && reviewReps(card) > reviewReps(current)) {
      out[id] = card
    }
  }
  return out
}

/** Union today's introduced ids. Ignore counters from other calendar days. */
export function mergeDaily(
  local: DailyRecord | null,
  remote: DailyRecord | null,
  today: string,
): DailyRecord | null {
  const rows = [local, remote].filter(
    (row): row is DailyRecord => !!row && row.date === today,
  )
  if (rows.length === 0) return null
  const ids = [...new Set(rows.flatMap((row) => row.ids))]
  const reviews = Math.max(...rows.map((row) => row.reviews))
  return { date: today, ids, reviews }
}

function introEntry(value: unknown): { count: number; ids: string[] } {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return { count: value, ids: [] }
  }
  if (Array.isArray(value)) {
    const ids = value.filter((id): id is string => typeof id === 'string')
    return { count: ids.length, ids }
  }
  if (value && typeof value === 'object') {
    const row = value as { count?: unknown; ids?: unknown }
    const ids = Array.isArray(row.ids)
      ? row.ids.filter((id): id is string => typeof id === 'string')
      : []
    const count =
      typeof row.count === 'number' && Number.isFinite(row.count)
        ? row.count
        : ids.length
    return { count: Math.max(count, ids.length), ids }
  }
  return { count: 0, ids: [] }
}

export function mergeIntroHistory(
  local: Record<string, unknown>,
  remote: Record<string, unknown>,
): Record<string, unknown> {
  const dates = new Set([...Object.keys(local), ...Object.keys(remote)])
  const out: Record<string, unknown> = {}
  for (const date of dates) {
    const left = introEntry(local[date])
    const right = introEntry(remote[date])
    const ids = [...new Set([...left.ids, ...right.ids])]
    out[date] = {
      count: Math.max(left.count, right.count, ids.length),
      ids,
    }
  }
  return out
}

function stamp(value: unknown): number {
  const t = Date.parse(typeof value === 'string' ? value : '')
  return Number.isFinite(t) ? t : 0
}

/**
 * Trip plan: settings-like fields follow the newer copy; finished sessions,
 * ticked blocks, light and active days and checkpoints are unioned so no device loses work.
 */
export function mergeTrip(
  local: Record<string, unknown> | null | undefined,
  remote: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!local) return remote ?? null
  if (!remote) return local
  const remoteNewer = stamp(remote.updatedAt) > stamp(local.updatedAt)
  const base = remoteNewer ? remote : local
  const other = remoteNewer ? local : remote
  const blocks: Record<string, unknown> = {}
  const baseBlocks = asRecord(base.blocks)
  const otherBlocks = asRecord(other.blocks)
  for (const key of new Set([
    ...Object.keys(baseBlocks),
    ...Object.keys(otherBlocks),
  ])) {
    const a = Array.isArray(baseBlocks[key]) ? (baseBlocks[key] as unknown[]) : []
    const b = Array.isArray(otherBlocks[key]) ? (otherBlocks[key] as unknown[]) : []
    blocks[key] = [...new Set([...a, ...b])]
  }
  const light = [
    ...new Set([
      ...(Array.isArray(base.light) ? base.light : []),
      ...(Array.isArray(other.light) ? other.light : []),
    ]),
  ].sort()
  const active = [
    ...new Set([
      ...(Array.isArray(base.active) ? base.active : []),
      ...(Array.isArray(other.active) ? other.active : []),
    ]),
  ].sort()
  // Outside-the-app logs: union by id; the newer copy wins (a 0 is a delete).
  const outside = new Map<string, unknown>()
  for (const list of [other.outside, base.outside]) {
    if (!Array.isArray(list)) continue
    for (const o of list) {
      const id = asRecord(o).id
      if (typeof id === 'string') outside.set(id, o)
    }
  }
  return {
    ...base,
    outside: [...outside.values()],
    done: { ...asRecord(other.done), ...asRecord(base.done) },
    blocks,
    light,
    active,
    checkpoints: {
      ...asRecord(other.checkpoints),
      ...asRecord(base.checkpoints),
    },
  }
}

export function chooseNewer<T>(args: {
  local: T
  localAt: string | null
  localIsDefault: boolean
  remote: T | null
  remoteAt: string | null
}): { value: T; updatedAt: string | null; from: 'local' | 'remote' } {
  const { local, localAt, localIsDefault, remote, remoteAt } = args
  if (remote == null) {
    return { value: local, updatedAt: localAt, from: 'local' }
  }
  const localTime = Date.parse(localAt ?? '')
  const remoteTime = Date.parse(remoteAt ?? '')
  const localOk = Number.isFinite(localTime)
  const remoteOk = Number.isFinite(remoteTime)
  if (localOk && remoteOk) {
    if (remoteTime > localTime) {
      return { value: remote, updatedAt: remoteAt, from: 'remote' }
    }
    return { value: local, updatedAt: localAt, from: 'local' }
  }
  if (!localOk && remoteOk && localIsDefault) {
    return { value: remote, updatedAt: remoteAt, from: 'remote' }
  }
  return { value: local, updatedAt: localAt, from: 'local' }
}

export function mergePayloads(
  local: AccountPayload,
  remote: AccountPayload | null,
  today: string,
  localSettingsAreDefault: boolean,
): AccountPayload {
  const choice = chooseNewer({
    local: local.settings,
    localAt: local.settingsUpdatedAt,
    localIsDefault: localSettingsAreDefault,
    remote: remote?.settings ?? null,
    remoteAt: remote?.settingsUpdatedAt ?? null,
  })
  return {
    progress: mergeProgress(local.progress, remote?.progress),
    settings: asRecord(choice.value),
    settingsUpdatedAt: choice.updatedAt,
    daily: mergeDaily(local.daily, remote?.daily ?? null, today),
    introHistory: mergeIntroHistory(
      local.introHistory,
      remote?.introHistory ?? {},
    ),
    trip: mergeTrip(local.trip, remote?.trip),
  }
}

function textBytes(value: string): number {
  return new TextEncoder().encode(value).length
}

/** Split a progress map into JSON blobs that fit in a Firestore document. */
export function chunkProgress(
  progress: Record<string, unknown>,
  maxBytes = DEFAULT_CHUNK_BYTES,
): string[] {
  const chunks: string[] = []
  let current: Record<string, unknown> = {}
  let size = 2
  for (const key of Object.keys(progress).sort()) {
    const piece = JSON.stringify(progress[key])
    const bytes = textBytes(JSON.stringify(key)) + textBytes(piece) + 4
    if (Object.keys(current).length > 0 && size + bytes > maxBytes) {
      chunks.push(JSON.stringify(current))
      current = {}
      size = 2
    }
    current[key] = progress[key]
    size += bytes
  }
  chunks.push(JSON.stringify(current))
  return chunks
}

export function unchunkProgress(parts: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const part of parts) {
    Object.assign(out, asRecord(JSON.parse(part) as unknown))
  }
  return out
}
