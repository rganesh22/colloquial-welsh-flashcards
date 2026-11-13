import assert from 'node:assert/strict'
import {
  chunkProgress,
  mergeDaily,
  mergeIntroHistory,
  mergePayloads,
  mergeProgress,
  mergeTrip,
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

// Trip plan: newer settings win, finished sessions and ticks are unioned.
const tripLocal = {
  tripDate: '2027-01-06',
  cue: 'dinner',
  updatedAt: '2026-11-10T10:00:00.000Z',
  done: { '1': { date: '2026-11-08' } },
  blocks: { '2': ['review'] },
  light: ['2026-11-09'],
  active: ['2026-11-10'],
  checkpoints: {},
  outside: [
    { id: 'a', date: '2026-11-10', kind: 'audio', minutes: 30 },
    { id: 'b', date: '2026-11-10', kind: 'tutor', minutes: 60 },
  ],
}
const tripRemote = {
  tripDate: '2027-01-10',
  cue: 'work',
  updatedAt: '2026-11-11T10:00:00.000Z',
  done: { '2': { date: '2026-11-11' } },
  blocks: { '2': ['speak'] },
  light: ['2026-11-07'],
  active: ['2026-11-07'],
  checkpoints: { '1': { overall: 3 } },
  // Newer device deleted "b" and logged "c".
  outside: [
    { id: 'b', date: '2026-11-10', kind: 'tutor', minutes: 0 },
    { id: 'c', date: '2026-11-11', kind: 'listen', minutes: 20 },
  ],
}
const tripMerged = mergeTrip(tripLocal, tripRemote)!
assert.equal(tripMerged.tripDate, '2027-01-10')
assert.deepEqual(Object.keys(tripMerged.done as object).sort(), ['1', '2'])
assert.deepEqual(
  ((tripMerged.blocks as Record<string, string[]>)['2'] ?? []).sort(),
  ['review', 'speak'],
)
assert.deepEqual(tripMerged.light, ['2026-11-07', '2026-11-09'])
assert.deepEqual(tripMerged.active, ['2026-11-07', '2026-11-10'])
assert.ok((tripMerged.checkpoints as Record<string, unknown>)['1'])
const outsideMerged = tripMerged.outside as { id: string; minutes: number }[]
assert.deepEqual(
  outsideMerged.map((o) => `${o.id}:${o.minutes}`).sort(),
  ['a:30', 'b:0', 'c:20'],
)
assert.equal(mergeTrip(null, tripRemote), tripRemote)
assert.equal(mergeTrip(tripLocal, undefined), tripLocal)

// Sprint: steps finished on either device are kept; the newer deadline wins.
const sprintMerged = mergeTrip(
  { updatedAt: '2026-11-13T08:00:00.000Z', sprint: { finishBy: '2027-01-01', done: { '1': ['words', 'story'] } } },
  { updatedAt: '2026-11-13T09:00:00.000Z', sprint: { finishBy: '2027-01-05', done: { '1': ['pattern'], '2': ['words'] } } },
)!.sprint as { finishBy: string; done: Record<string, string[]> }
assert.equal(sprintMerged.finishBy, '2027-01-05')
assert.deepEqual(sprintMerged.done['1'].sort(), ['pattern', 'story', 'words'])
assert.deepEqual(sprintMerged.done['2'], ['words'])
const oneSided = mergeTrip({ updatedAt: '2026-11-13T09:00:00.000Z' }, { updatedAt: '2026-11-13T08:00:00.000Z', sprint: { finishBy: '2027-01-01', done: { '3': ['speak'] } } })!
assert.deepEqual((oneSided.sprint as { done: Record<string, string[]> }).done['3'], ['speak'])

console.log('trip merge ok')
