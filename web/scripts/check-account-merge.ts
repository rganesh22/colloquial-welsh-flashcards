import assert from 'node:assert/strict'
import {
  chunkProgress,
  mergeDaily,
  mergeIntroHistory,
  mergePayloads,
  mergeProgress,
  unchunkProgress,
} from '../src/lib/accountMerge.ts'

const older = { last_review: '2026-01-01T00:00:00.000Z', reps: 1, stability: 1 }
const newer = { last_review: '2026-06-01T00:00:00.000Z', reps: 4, stability: 9 }

const merged = mergeProgress(
  { a: older, onlyLocal: { reps: 2, last_review: '2026-02-01T00:00:00.000Z' } },
  { a: newer, onlyRemote: { reps: 1, last_review: '2026-03-01T00:00:00.000Z' } },
)
assert.equal((merged.a as { stability: number }).stability, 9)
assert.ok(merged.onlyLocal)
assert.ok(merged.onlyRemote)

const tied = mergeProgress(
  { a: { last_review: '2026-01-01T00:00:00.000Z', reps: 1 } },
  { a: { last_review: '2026-01-01T00:00:00.000Z', reps: 3 } },
)
assert.equal((tied.a as { reps: number }).reps, 3)

const today = '2026-10-22'
assert.deepEqual(
  mergeDaily(
    { date: today, ids: ['a'], reviews: 2 },
    { date: today, ids: ['b', 'a'], reviews: 5 },
    today,
  ),
  { date: today, ids: ['a', 'b'], reviews: 5 },
)
assert.equal(
  mergeDaily(
    { date: '2026-10-21', ids: ['old'], reviews: 9 },
    null,
    today,
  ),
  null,
)

const history = mergeIntroHistory(
  { '2026-10-01': 4, '2026-10-02': { count: 1, ids: ['a'] } },
  { '2026-10-02': { count: 2, ids: ['b'] } },
) as Record<string, { count: number; ids: string[] }>
assert.equal(history['2026-10-01'].count, 4)
assert.deepEqual(history['2026-10-02'].ids.sort(), ['a', 'b'])
assert.equal(history['2026-10-02'].count, 2)

const payload = mergePayloads(
  {
    progress: { a: older },
    settings: { theme: 'dark' },
    settingsUpdatedAt: null,
    daily: { date: today, ids: ['a'], reviews: 1 },
    introHistory: {},
  },
  {
    progress: { a: newer },
    settings: { theme: 'light' },
    settingsUpdatedAt: '2026-10-22T12:00:00.000Z',
    daily: { date: today, ids: ['b'], reviews: 3 },
    introHistory: { '2026-10-22': { count: 1, ids: ['b'] } },
  },
  today,
  true,
)
assert.equal((payload.progress.a as { stability: number }).stability, 9)
assert.equal(payload.settings.theme, 'light')
assert.deepEqual(payload.daily?.ids, ['a', 'b'])

const keptLocal = mergePayloads(
  {
    progress: {},
    settings: { theme: 'light' },
    settingsUpdatedAt: null,
    daily: null,
    introHistory: {},
  },
  {
    progress: {},
    settings: { theme: 'dark' },
    settingsUpdatedAt: '2026-10-22T12:00:00.000Z',
    daily: null,
    introHistory: {},
  },
  today,
  false,
)
assert.equal(keptLocal.settings.theme, 'light')

const fat: Record<string, unknown> = {}
for (let i = 0; i < 5; i++) fat[`c${i}`] = { note: 'ŵ'.repeat(40) }
const parts = chunkProgress(fat, 80)
assert.ok(parts.length > 1)
assert.deepEqual(unchunkProgress(parts), fat)

console.log('account merge ok')
