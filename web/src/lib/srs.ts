import {
  Rating,
  State,
  createEmptyCard,
  fsrs,
  generatorParameters,
} from 'ts-fsrs'
import type { Card as FSRSCard, Grade } from 'ts-fsrs'
import type {
  CardDirection,
  Dialect,
  DirectionMode,
  ProgressMap,
  SessionFilter,
  StudyItem,
  StudyMode,
  ThemeMode,
  VocabCard,
} from './types'
import { directionsForMode, progressIdFor } from './types'
import { ALL_CARDS, cardsForLesson } from '../data/deck'
import { LESSONS } from './lessons'
import {
  clampAskModel,
  clampAskTemperature,
  DEFAULT_ASK_MODEL,
} from './gemini'

const STORAGE_KEY = 'colloquial-welsh-fsrs-v1'
const SETTINGS_KEY = 'colloquial-welsh-settings-v4'
const DAILY_KEY = 'colloquial-welsh-daily-v1'
const INTRO_HISTORY_KEY = 'colloquial-welsh-intro-history-v1'

/** Default how many brand-new headwords per learn wave (shown gradually). */
export const DEFAULT_LEARN_BATCH_SIZE = 5

/** How many brand-new headwords to put in the active Learn queue at once. */
export const LEARN_NEW_DRIP = 2

/** Default daily new-word goal (headwords) — ~30 min at a steady pace. */
export const DEFAULT_DAILY_WORD_GOAL = 30

/** Reviews capped at this × daily word goal when unset (30 → 300). */
export const DEFAULT_REVIEW_MULTIPLIER = 10

export function clampLearnBatchSize(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_LEARN_BATCH_SIZE
  return Math.min(50, Math.max(1, Math.round(n)))
}

export function clampDailyWordGoal(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_DAILY_WORD_GOAL
  return Math.min(200, Math.max(5, Math.round(n)))
}

/** How many Learn sessions to split the daily word goal across. */
export function clampDailySessions(n: number): number {
  if (!Number.isFinite(n)) return 1
  return Math.min(20, Math.max(1, Math.round(n)))
}

/**
 * Words to introduce for a specific day segment (0-based index).
 * Each segment owns ceil(goal/sessions) of the daily goal in order.
 */
export function sessionWordQuota(
  dailyWordGoal: number,
  dailySessions: number,
  remaining: number,
  segmentIndex = 0,
): number {
  const goal = clampDailyWordGoal(dailyWordGoal)
  const sessions = clampDailySessions(dailySessions)
  const introduced = Math.max(0, goal - remaining)
  const chunk = Math.ceil(goal / sessions)
  const start = segmentIndex * chunk
  const end = Math.min(goal, (segmentIndex + 1) * chunk)
  if (introduced >= end) return 0
  if (introduced < start) return 0 // locked until prior segments fill
  return Math.min(remaining, end - introduced)
}

/** Review slots for one segment: equal share of the daily review cap. */
export function sessionReviewQuota(
  maxDailyReviews: number,
  dailySessions: number,
  reviewsDoneToday: number,
  segmentIndex = 0,
): number {
  const max = clampMaxDailyReviews(maxDailyReviews)
  const sessions = clampDailySessions(dailySessions)
  const chunk = Math.ceil(max / sessions)
  const start = segmentIndex * chunk
  const end = Math.min(max, (segmentIndex + 1) * chunk)
  const usedInSegment = Math.max(
    0,
    Math.min(reviewsDoneToday, end) - Math.min(reviewsDoneToday, start),
  )
  return Math.max(0, end - start - usedInSegment)
}

export type DaySegment = {
  index: number
  label: string
  /** 1-based inclusive word range within the daily goal. */
  wordStart: number
  wordEnd: number
  wordTarget: number
  wordsLeft: number
  status: 'done' | 'current' | 'upcoming'
}

export function segmentLabels(count: number): string[] {
  const n = clampDailySessions(count)
  if (n === 1) return ['Today']
  if (n === 2) return ['Morning', 'Evening']
  if (n === 3) return ['Morning', 'Afternoon', 'Evening']
  if (n === 4) return ['Morning', 'Midday', 'Afternoon', 'Evening']
  return Array.from({ length: n }, (_, i) => `Part ${i + 1}`)
}

export function buildDaySegments(
  dailyWordGoal: number,
  dailySessions: number,
  introduced: number,
): DaySegment[] {
  const goal = clampDailyWordGoal(dailyWordGoal)
  const sessions = clampDailySessions(dailySessions)
  const chunk = Math.ceil(goal / sessions)
  const labels = segmentLabels(sessions)
  const segs: DaySegment[] = []
  for (let i = 0; i < sessions; i++) {
    const start = i * chunk
    const end = Math.min(goal, (i + 1) * chunk)
    const wordTarget = Math.max(0, end - start)
    let status: DaySegment['status']
    if (introduced >= end || wordTarget === 0) status = 'done'
    else if (introduced >= start) status = 'current'
    else status = 'upcoming'
    segs.push({
      index: i,
      label: labels[i]!,
      wordStart: start + 1,
      wordEnd: end,
      wordTarget,
      wordsLeft: Math.max(0, end - introduced),
      status,
    })
  }
  return segs
}

/**
 * Effective daily-review "max" so remainingDailyReviews() yields this
 * segment's remaining allotment (without exceeding the true day remaining).
 */
export function effectiveSessionReviewMax(
  maxDailyReviews: number,
  dailySessions: number,
  reviewsDoneToday: number,
  segmentIndex: number,
): number {
  const quota = sessionReviewQuota(
    maxDailyReviews,
    dailySessions,
    reviewsDoneToday,
    segmentIndex,
  )
  return reviewsDoneToday + quota
}

export function clampMaxDailyReviews(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_DAILY_WORD_GOAL * DEFAULT_REVIEW_MULTIPLIER
  return Math.min(2000, Math.max(0, Math.round(n)))
}

export function defaultMaxDailyReviews(dailyWordGoal: number): number {
  return clampMaxDailyReviews(
    clampDailyWordGoal(dailyWordGoal) * DEFAULT_REVIEW_MULTIPLIER,
  )
}

/**
 * Balanced early schedule for ~30-minute daily goals: two short learning
 * steps so new words get real reinforcement (Good → Good → graduate) without
 * looping for ages. Easy can still skip ahead. Sessions are never hard-stopped.
 */
export const scheduler = fsrs(
  generatorParameters({
    enable_fuzz: true,
    enable_short_term: true,
    request_retention: 0.92,
    maximum_interval: 120,
    // 2m then 8m — both fit inside a typical study block.
    learning_steps: ['2m', '8m'],
    relearning_steps: ['2m', '6m'],
  }),
)

export const RATING_META: {
  rating: Grade
  key: string
  label: string
}[] = [
  { rating: Rating.Again, key: '1', label: 'Again' },
  { rating: Rating.Hard, key: '2', label: 'Hard' },
  { rating: Rating.Good, key: '3', label: 'Good' },
  { rating: Rating.Easy, key: '4', label: 'Easy' },
]

export interface AppSettings {
  /** cy→en, en→cy, or both (separate FSRS schedules). */
  direction: DirectionMode
  theme: ThemeMode
  /** Gemini API key (optional if env key is set). */
  apiKey: string
  /** New cards introduced per learn wave. */
  learnBatchSize: number
  /** New headwords to introduce per calendar day (curriculum order). */
  dailyWordGoal: number
  /** Split the daily word goal across this many Learn sessions. */
  dailySessions: number
  /** Max due-card reviews per calendar day (spread into learn/review). */
  maxDailyReviews: number
  /** Insert gender/match/listen/plural breaks during Learn sessions. */
  learnActivities: boolean
  /** Include listen & choose (TTS) in Learn breaks and lesson practice. */
  listenActivities: boolean
  /** Gemini model for Ask chat. */
  askModel: string
  /** Sampling temperature for Ask chat (0–1.2). */
  askTemperature: number
}

const DEFAULT_SETTINGS: AppSettings = {
  direction: 'both',
  theme: 'dark',
  apiKey: '',
  learnBatchSize: DEFAULT_LEARN_BATCH_SIZE,
  dailyWordGoal: DEFAULT_DAILY_WORD_GOAL,
  dailySessions: 1,
  maxDailyReviews: defaultMaxDailyReviews(DEFAULT_DAILY_WORD_GOAL),
  learnActivities: true,
  listenActivities: true,
  askModel: DEFAULT_ASK_MODEL,
  askTemperature: 0.7,
}

function reviveCard(raw: FSRSCard): FSRSCard {
  return {
    ...raw,
    due: new Date(raw.due),
    last_review: raw.last_review ? new Date(raw.last_review) : undefined,
  }
}

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as ProgressMap
    const out: ProgressMap = {}
    for (const [id, card] of Object.entries(parsed)) {
      try {
        out[id] = reviveCard(card)
      } catch {
        // Skip one bad card rather than wiping the whole deck.
      }
    }
    return out
  } catch {
    return {}
  }
}

/**
 * Persist FSRS state. Refuses to overwrite a larger existing save with an
 * empty/near-empty map (guards against accidental wipe on a bad remount).
 */
export function saveProgress(progress: ProgressMap): void {
  const nextCount = Object.keys(progress).length
  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing) {
      const prev = JSON.parse(existing) as ProgressMap
      const prevCount = Object.keys(prev).length
      if (nextCount === 0 && prevCount > 0) {
        console.warn(
          'Refusing to overwrite saved progress with an empty map',
          { prevCount },
        )
        return
      }
    }
  } catch {
    /* fall through and write */
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function progressCardCount(progress: ProgressMap): number {
  return Object.keys(progress).length
}

/** Downloadable backup of SRS progress (+ daily counters). */
export function exportProgressBackup(): string {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      progress: JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'),
      daily: JSON.parse(localStorage.getItem(DAILY_KEY) ?? 'null'),
      introHistory: JSON.parse(
        localStorage.getItem(INTRO_HISTORY_KEY) ?? '{}',
      ),
    },
    null,
    2,
  )
}

export function importProgressBackup(json: string): {
  progress: ProgressMap
  cards: number
} {
  const parsed = JSON.parse(json) as {
    progress?: ProgressMap
    daily?: unknown
    introHistory?: unknown
  }
  const raw = parsed.progress ?? (parsed as unknown as ProgressMap)
  if (!raw || typeof raw !== 'object') {
    throw new Error('Backup has no progress map')
  }
  const progress: ProgressMap = {}
  for (const [id, card] of Object.entries(raw)) {
    try {
      progress[id] = reviveCard(card as FSRSCard)
    } catch {
      /* skip */
    }
  }
  const cards = Object.keys(progress).length
  if (cards === 0) throw new Error('Backup contained no usable cards')
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  if (parsed.daily != null) {
    localStorage.setItem(DAILY_KEY, JSON.stringify(parsed.daily))
  }
  if (parsed.introHistory != null) {
    localStorage.setItem(
      INTRO_HISTORY_KEY,
      JSON.stringify(parsed.introHistory),
    )
  }
  return { progress, cards }
}

export function loadSettings(): AppSettings {
  try {
    const raw =
      localStorage.getItem(SETTINGS_KEY) ??
      localStorage.getItem('colloquial-welsh-settings-v3')
    if (!raw) {
      return { ...DEFAULT_SETTINGS }
    }
    const parsed = JSON.parse(raw) as Partial<AppSettings> & {
      welshFront?: boolean
      newCardsPerDay?: number
    }
    const direction: DirectionMode =
      parsed.direction ??
      (parsed.welshFront === false ? 'en-cy' : DEFAULT_SETTINGS.direction)
    const dailyWordGoal = clampDailyWordGoal(
      parsed.dailyWordGoal ??
        parsed.newCardsPerDay ??
        DEFAULT_DAILY_WORD_GOAL,
    )
    return {
      direction,
      theme: parsed.theme ?? DEFAULT_SETTINGS.theme,
      apiKey: parsed.apiKey ?? '',
      learnBatchSize: clampLearnBatchSize(
        // Migrate the old too-large default (15) down to a gentler set size.
        parsed.learnBatchSize === 15 || parsed.learnBatchSize == null
          ? DEFAULT_LEARN_BATCH_SIZE
          : parsed.learnBatchSize,
      ),
      dailyWordGoal,
      dailySessions: clampDailySessions(parsed.dailySessions ?? 1),
      maxDailyReviews: clampMaxDailyReviews(
        parsed.maxDailyReviews ?? defaultMaxDailyReviews(dailyWordGoal),
      ),
      learnActivities: parsed.learnActivities ?? true,
      listenActivities: parsed.listenActivities ?? true,
      askModel: clampAskModel(
        !parsed.askModel || parsed.askModel === 'gemini-2.5-flash'
          ? DEFAULT_ASK_MODEL
          : parsed.askModel,
      ),
      askTemperature: clampAskTemperature(
        parsed.askTemperature ?? DEFAULT_SETTINGS.askTemperature,
      ),
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function applyTheme(theme: ThemeMode): void {
  document.documentElement.dataset.theme = theme
}

function todayKey(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

interface DailyIntroState {
  date: string
  ids: string[]
  /** Due/review ratings applied today (not brand-new introductions). */
  reviews: number
}

function loadDailyState(): DailyIntroState {
  try {
    const raw = localStorage.getItem(DAILY_KEY)
    if (!raw) return { date: todayKey(), ids: [], reviews: 0 }
    const parsed = JSON.parse(raw) as DailyIntroState
    if (parsed.date !== todayKey()) return { date: todayKey(), ids: [], reviews: 0 }
    return {
      date: parsed.date,
      ids: Array.isArray(parsed.ids) ? parsed.ids : [],
      reviews: typeof parsed.reviews === 'number' ? parsed.reviews : 0,
    }
  } catch {
    return { date: todayKey(), ids: [], reviews: 0 }
  }
}

/** Vocab ids first introduced today (local calendar day). */
export function loadDailyIntroduced(): string[] {
  return loadDailyState().ids
}

export function dailyIntroCount(): number {
  return loadDailyIntroduced().length
}

export function remainingDailyGoal(goal: number): number {
  return Math.max(0, clampDailyWordGoal(goal) - dailyIntroCount())
}

/** Record a headword toward today's goal (idempotent per id / day). */
export function recordDailyIntroduced(cardId: string): void {
  const state = loadDailyState()
  if (state.ids.includes(cardId)) return
  state.ids.push(cardId)
  localStorage.setItem(DAILY_KEY, JSON.stringify(state))
  bumpIntroHistory(state.date, cardId)
}

export function dailyReviewCount(): number {
  return loadDailyState().reviews
}

export function remainingDailyReviews(max: number): number {
  return Math.max(0, clampMaxDailyReviews(max) - dailyReviewCount())
}

/** Count a due/review rating toward today's review cap. */
export function recordDailyReview(): void {
  const state = loadDailyState()
  state.reviews += 1
  localStorage.setItem(DAILY_KEY, JSON.stringify(state))
}

export type IntroDayDetail = {
  date: string
  count: number
  ids: string[]
  level: 0 | 1 | 2 | 3 | 4
}

type IntroDayStore = { count: number; ids: string[] }

function loadIntroDayMap(): Record<string, IntroDayStore> {
  try {
    const raw = localStorage.getItem(INTRO_HISTORY_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<
      string,
      number | string[] | IntroDayStore
    >
    if (!parsed || typeof parsed !== 'object') return {}
    const out: Record<string, IntroDayStore> = {}
    for (const [date, val] of Object.entries(parsed)) {
      if (typeof val === 'number') {
        out[date] = { count: val, ids: [] }
      } else if (Array.isArray(val)) {
        out[date] = { count: val.length, ids: val }
      } else if (val && typeof val === 'object') {
        const ids = Array.isArray(val.ids) ? val.ids : []
        const count =
          typeof val.count === 'number' ? val.count : ids.length
        out[date] = { count: Math.max(count, ids.length), ids }
      }
    }
    return out
  } catch {
    return {}
  }
}

function saveIntroDayMap(map: Record<string, IntroDayStore>): void {
  localStorage.setItem(INTRO_HISTORY_KEY, JSON.stringify(map))
}

function bumpIntroHistory(date: string, cardId?: string): void {
  const map = loadIntroDayMap()
  const cur = map[date] ?? { count: 0, ids: [] }
  if (cardId && !cur.ids.includes(cardId)) {
    cur.ids.push(cardId)
    cur.count = Math.max(cur.count + 1, cur.ids.length)
  } else if (!cardId) {
    cur.count += 1
  }
  map[date] = cur
  saveIntroDayMap(map)
}

/** Ensure today's live ids/count are reflected in history (migration-safe). */
export function syncIntroHistoryFromToday(): Record<string, number> {
  const map = loadIntroDayMap()
  const today = todayKey()
  const ids = loadDailyIntroduced()
  const cur = map[today] ?? { count: 0, ids: [] }
  const merged = [...new Set([...cur.ids, ...ids])]
  const count = Math.max(cur.count, ids.length, merged.length)
  if (
    count !== cur.count ||
    merged.length !== cur.ids.length ||
    ids.some((id) => !cur.ids.includes(id))
  ) {
    map[today] = { count, ids: merged }
    saveIntroDayMap(map)
  }
  return Object.fromEntries(
    Object.entries(map).map(([k, v]) => [k, v.count]),
  )
}

export function introLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0
  if (count >= 40) return 4
  if (count >= 20) return 3
  if (count >= 8) return 2
  return 1
}

export function getIntroDayDetail(date: string): IntroDayDetail {
  syncIntroHistoryFromToday()
  const entry = loadIntroDayMap()[date]
  const count = entry?.count ?? 0
  const ids = entry?.ids ?? []
  return { date, count, ids, level: introLevel(count) }
}

export type IntroDayCell = {
  date: string
  count: number
  /** 0 empty … 4 hottest (GitHub-style). */
  level: 0 | 1 | 2 | 3 | 4
  /** Outside the focused month / range (padding). */
  outside?: boolean
}

function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}

function shiftDay(date: Date, delta: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + delta)
  return next
}

export function formatIntroDate(dateKey: string): string {
  const d = parseDayKey(dateKey)
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function monthLabel(year: number, monthIndex: number): string {
  return new Date(year, monthIndex, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

/** Calendar cells for a month (Sun–Sat rows, padded). */
export function getMonthIntroCells(
  year: number,
  monthIndex: number,
): IntroDayCell[] {
  const map = syncIntroHistoryFromToday()
  const first = new Date(year, monthIndex, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells: IntroDayCell[] = []
  for (let i = 0; i < startPad; i++) {
    const d = shiftDay(first, i - startPad)
    const key = todayKey(d)
    const count = map[key] ?? 0
    cells.push({ date: key, count, level: introLevel(count), outside: true })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthIndex, day)
    const key = todayKey(d)
    const count = map[key] ?? 0
    cells.push({ date: key, count, level: introLevel(count), outside: false })
  }
  while (cells.length % 7 !== 0) {
    const last = parseDayKey(cells[cells.length - 1]!.date)
    const d = shiftDay(last, 1)
    const key = todayKey(d)
    const count = map[key] ?? 0
    cells.push({ date: key, count, level: introLevel(count), outside: true })
  }
  return cells
}

/** One week ending on `anchor` (or containing it), Sunday-start. */
export function getWeekIntroCells(anchor = new Date()): IntroDayCell[] {
  const map = syncIntroHistoryFromToday()
  const a = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate())
  const start = shiftDay(a, -a.getDay())
  const cells: IntroDayCell[] = []
  for (let i = 0; i < 7; i++) {
    const d = shiftDay(start, i)
    const key = todayKey(d)
    const count = map[key] ?? 0
    cells.push({ date: key, count, level: introLevel(count) })
  }
  return cells
}

/** Heatmap for a calendar year (Sun-aligned). */
export function getYearIntroCells(year: number): IntroDayCell[] {
  const map = syncIntroHistoryFromToday()
  const today = parseDayKey(todayKey())
  const yearEnd = new Date(year, 11, 31)
  const end =
    year === today.getFullYear() && today < yearEnd ? today : yearEnd
  const start = new Date(year, 0, 1)
  const startPad = start.getDay()
  const cells: IntroDayCell[] = []
  const msPerDay = 86_400_000
  const dayCount =
    Math.round((end.getTime() - start.getTime()) / msPerDay) + 1
  for (let i = -startPad; i < dayCount; i++) {
    const d = shiftDay(start, i)
    const key = todayKey(d)
    const inYear = i >= 0
    const count = inYear ? (map[key] ?? 0) : 0
    cells.push({
      date: key,
      count,
      level: inYear ? introLevel(count) : 0,
      outside: !inYear,
    })
  }
  while (cells.length % 7 !== 0) {
    const last = parseDayKey(cells[cells.length - 1]!.date)
    const d = shiftDay(last, 1)
    cells.push({
      date: todayKey(d),
      count: 0,
      level: 0,
      outside: true,
    })
  }
  return cells
}

export function introHistoryTotals(dayCount = 365): {
  total: number
  thisWeek: number
  streak: number
  bestDay: number
} {
  const map = syncIntroHistoryFromToday()
  const today = parseDayKey(todayKey())
  let total = 0
  let thisWeek = 0
  let bestDay = 0
  for (let i = 0; i < dayCount; i++) {
    const d = shiftDay(today, -(dayCount - 1 - i))
    const key = todayKey(d)
    const n = map[key] ?? 0
    total += n
    bestDay = Math.max(bestDay, n)
    if (i >= dayCount - 7) thisWeek += n
  }
  let streak = 0
  for (let i = 0; ; i++) {
    const key = todayKey(shiftDay(today, -i))
    const n = map[key] ?? 0
    if (n <= 0) break
    streak++
  }
  return { total, thisWeek, streak, bestDay }
}

/** Sum of counts for a calendar month. */
export function monthIntroTotal(year: number, monthIndex: number): number {
  const map = syncIntroHistoryFromToday()
  const days = new Date(year, monthIndex + 1, 0).getDate()
  let total = 0
  for (let d = 1; d <= days; d++) {
    total += map[todayKey(new Date(year, monthIndex, d))] ?? 0
  }
  return total
}

export type HardVocabRow = {
  card: VocabCard
  strength: number
  lapses: number
  againBias: number
}

/** Seen cards that are struggling (lapses / low strength), hardest first. */
export function getHardVocab(
  progress: ProgressMap,
  directionMode: DirectionMode,
): HardVocabRow[] {
  const dirs = directionsForMode(directionMode)
  const rows: HardVocabRow[] = []
  for (const card of ALL_CARDS) {
    if (isVocabUnseen(progress, card, directionMode)) continue
    let lapses = 0
    for (const d of dirs) {
      const s = progress[progressIdFor(card.id, d)]
      if (s) lapses += s.lapses ?? 0
    }
    const strength = strengthForVocab(progress, card.id, directionMode)
    const againBias = lapses * 2 + (1 - strength) * 3
    if (lapses === 0 && strength >= 0.55) continue
    rows.push({ card, strength, lapses, againBias })
  }
  return rows.sort((a, b) => b.againBias - a.againBias)
}

/** True when every scheduled direction for this vocab is still New. */
export function isVocabUnseen(
  progress: ProgressMap,
  card: VocabCard,
  directionMode: DirectionMode,
): boolean {
  return directionsForMode(directionMode).every((d) =>
    isNew(progress[progressIdFor(card.id, d)]),
  )
}

/**
 * True when rating this item will be the first introduction of its headword
 * (all directions still New before the rating).
 */
export function isFirstVocabIntroduction(
  progress: ProgressMap,
  item: StudyItem,
  directionMode: DirectionMode,
): boolean {
  if (!isNew(progress[item.progressId])) return false
  return isVocabUnseen(progress, item.card, directionMode)
}

/**
 * Unseen headwords in curriculum order: alphabet → 1a → 1b → … then Reader.
 */
export function getOrderedNewVocab(
  progress: ProgressMap,
  directionMode: DirectionMode,
  limit?: number,
): VocabCard[] {
  const out: VocabCard[] = []
  for (const lesson of LESSONS) {
    const cards = [...cardsForLesson(lesson.bookId, lesson.id)].sort(
      (a, b) => a.number - b.number,
    )
    for (const card of cards) {
      if (!isVocabUnseen(progress, card, directionMode)) continue
      out.push(card)
      if (limit != null && out.length >= limit) return out
    }
  }
  return out
}

const LESSON_ORDER = new Map(
  LESSONS.map((l, i) => [`${l.bookId}:${l.id}`, i] as const),
)

function lessonSortKey(card: VocabCard): number {
  return LESSON_ORDER.get(`${card.bookId}:${card.lessonId}`) ?? 9999
}

function allowCard(cardId: string, allowCardIds?: string[]): boolean {
  if (allowCardIds === undefined) return true
  return allowCardIds.includes(cardId)
}

export function ensureCardState(
  progress: ProgressMap,
  progressId: string,
  now = new Date(),
): FSRSCard {
  if (!progress[progressId]) {
    progress[progressId] = createEmptyCard(now)
  }
  return progress[progressId]
}

export function isDue(card: FSRSCard, now = new Date()): boolean {
  return card.due.getTime() <= now.getTime()
}

export function isNew(card: FSRSCard | undefined): boolean {
  return !card || card.state === State.New
}

export function isLearningState(card: FSRSCard | undefined): boolean {
  return (
    !!card &&
    (card.state === State.Learning || card.state === State.Relearning)
  )
}

function filterVocab(filter: SessionFilter): VocabCard[] {
  if (filter.kind === 'all') return ALL_CARDS
  if (filter.kind === 'book') {
    return ALL_CARDS.filter((c) => c.bookId === filter.bookId)
  }
  return ALL_CARDS.filter(
    (c) => c.bookId === filter.bookId && c.lessonId === filter.lessonId,
  )
}

function expandItems(
  cards: VocabCard[],
  directionMode: DirectionMode,
): StudyItem[] {
  const dirs = directionsForMode(directionMode)
  const items: StudyItem[] = []
  for (const card of cards) {
    for (const direction of dirs) {
      items.push({
        card,
        direction,
        progressId: progressIdFor(card.id, direction),
      })
    }
  }
  return items
}

/** Stable order for introducing news (curriculum lesson order, then number). */
function sortStudyItems(items: StudyItem[]): StudyItem[] {
  return [...items].sort((a, b) => {
    const lo = lessonSortKey(a.card) - lessonSortKey(b.card)
    if (lo !== 0) return lo
    if (a.card.number !== b.card.number) return a.card.number - b.card.number
    return a.direction.localeCompare(b.direction)
  })
}

export function getDueItems(
  progress: ProgressMap,
  filter: SessionFilter,
  directionMode: DirectionMode,
  now = new Date(),
): StudyItem[] {
  return expandItems(filterVocab(filter), directionMode).filter((item) => {
    const state = progress[item.progressId]
    if (!state || state.state === State.New) return false
    return isDue(state, now)
  })
}

export function getNewItems(
  progress: ProgressMap,
  filter: SessionFilter,
  directionMode: DirectionMode,
  allowCardIds?: string[],
): StudyItem[] {
  return sortStudyItems(
    expandItems(filterVocab(filter), directionMode).filter(
      (item) =>
        isNew(progress[item.progressId]) &&
        allowCard(item.card.id, allowCardIds),
    ),
  )
}

export function countNewItems(
  progress: ProgressMap,
  filter: SessionFilter,
  directionMode: DirectionMode,
  allowCardIds?: string[],
): number {
  return getNewItems(progress, filter, directionMode, allowCardIds).length
}

export function getLearningItems(
  progress: ProgressMap,
  filter: SessionFilter,
  directionMode: DirectionMode,
  allowCardIds?: string[],
): StudyItem[] {
  return expandItems(filterVocab(filter), directionMode).filter(
    (item) =>
      isLearningState(progress[item.progressId]) &&
      allowCard(item.card.id, allowCardIds),
  )
}

/** Vocab headwords the learner has already introduced (≥1 direction not New). */
export function getSeenVocab(
  progress: ProgressMap,
  filter: SessionFilter,
  directionMode: DirectionMode,
): VocabCard[] {
  const dirs = directionsForMode(directionMode)
  return filterVocab(filter).filter((card) =>
    dirs.some((d) => !isNew(progress[progressIdFor(card.id, d)])),
  )
}

export function getSeenGenderedVocab(
  progress: ProgressMap,
  filter: SessionFilter,
  directionMode: DirectionMode,
): VocabCard[] {
  return getSeenVocab(progress, filter, directionMode).filter(
    (c) => c.gender === 'm' || c.gender === 'f',
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function dedupeByProgressId(items: StudyItem[]): StudyItem[] {
  const seen = new Set<string>()
  const out: StudyItem[] = []
  for (const item of items) {
    if (seen.has(item.progressId)) continue
    seen.add(item.progressId)
    out.push(item)
  }
  return out
}

/**
 * Spread two lists so they aren't clumped (new vs review).
 * Places the smaller list evenly through the combined timeline.
 */
export function interleaveSpread<T>(a: T[], b: T[]): T[] {
  if (a.length === 0) return [...b]
  if (b.length === 0) return [...a]
  const out: T[] = []
  const total = a.length + b.length
  let ai = 0
  let bi = 0
  // Bresenham-style: emit from b at even intervals
  let err = 0
  for (let i = 0; i < total; i++) {
    err += b.length
    if (err >= total && bi < b.length) {
      out.push(b[bi++]!)
      err -= total
    } else if (ai < a.length) {
      out.push(a[ai++]!)
    } else if (bi < b.length) {
      out.push(b[bi++]!)
    }
  }
  while (ai < a.length) out.push(a[ai++]!)
  while (bi < b.length) out.push(b[bi++]!)
  return out
}

/** Wave still has brand-new cards left to introduce (learning dues do not lock it). */
export function waveIsActive(
  progress: ProgressMap,
  waveIds: string[],
): boolean {
  return waveIds.some((id) => isNew(progress[id]))
}

/**
 * Sticky learn wave by headword: keep the set until every direction in it
 * has been introduced; then open the next batch of new headwords.
 * Learning-step dues no longer block progressing to new words.
 */
export function advanceLearnWave(
  progress: ProgressMap,
  filter: SessionFilter,
  directionMode: DirectionMode,
  currentWave: string[],
  learnBatchSize: number = DEFAULT_LEARN_BATCH_SIZE,
  opts?: { forceNew?: boolean; allowCardIds?: string[] },
): string[] {
  const batchSize = clampLearnBatchSize(learnBatchSize)
  const news = getNewItems(
    progress,
    filter,
    directionMode,
    opts?.allowCardIds,
  )

  if (!opts?.forceNew && currentWave.length > 0 && waveIsActive(progress, currentWave)) {
    return currentWave
  }

  // Batch by unique headword so "set of N" means N words (both dirs included).
  const headwordOrder: string[] = []
  for (const item of news) {
    if (!headwordOrder.includes(item.card.id)) {
      headwordOrder.push(item.card.id)
    }
    if (headwordOrder.length >= batchSize) break
  }
  const headSet = new Set(headwordOrder)
  return news
    .filter((i) => headSet.has(i.card.id))
    .map((i) => i.progressId)
}

/** First `limit` unique headwords from a study-item list (order preserved). */
function takeHeadwords(items: StudyItem[], limit: number): StudyItem[] {
  if (limit <= 0 || items.length === 0) return []
  const heads: string[] = []
  for (const item of items) {
    if (!heads.includes(item.card.id)) {
      if (heads.length >= limit) continue
      heads.push(item.card.id)
    }
  }
  const allow = new Set(heads)
  return items.filter((i) => allow.has(i.card.id))
}

/**
 * Learn/Review queue of cards that are actually due (or brand-new in the wave).
 * Never injects not-yet-due learning steps — that caused the same card to loop.
 */
export function buildQueue(
  progress: ProgressMap,
  mode: StudyMode,
  filter: SessionFilter,
  directionMode: DirectionMode,
  now = new Date(),
  /** Card just rated — never show it next if something else is available. */
  justSeenId?: string,
  learnBatchSize: number = DEFAULT_LEARN_BATCH_SIZE,
  waveIds: string[] = [],
  allowCardIds?: string[],
  maxDailyReviews: number = defaultMaxDailyReviews(DEFAULT_DAILY_WORD_GOAL),
): StudyItem[] {
  const batchSize = clampLearnBatchSize(learnBatchSize)
  const reviewBudget = remainingDailyReviews(maxDailyReviews)
  const allDue = getDueItems(progress, filter, directionMode, now)
  // In Learn: drip new words slowly, reinforce the current wave's learning
  // steps, and mix a few graduated reviews so you aren't flooded with news.
  const reviewDue = allDue.filter(
    (i) => !isLearningState(progress[i.progressId]),
  )
  const learningDue = allDue.filter((i) =>
    isLearningState(progress[i.progressId]),
  )
  const waveSet = new Set(waveIds)
  const learningForWave =
    waveSet.size > 0
      ? learningDue.filter((i) => waveSet.has(i.progressId))
      : learningDue
  const learnReviewCap = Math.min(
    reviewBudget,
    Math.max(3, Math.ceil(batchSize)),
  )
  const due =
    mode === 'learn'
      ? [
          ...shuffle(learningForWave).slice(0, Math.min(6, reviewBudget)),
          ...shuffle(reviewDue).slice(0, learnReviewCap),
        ]
      : [...shuffle(reviewDue), ...shuffle(learningDue)].slice(0, reviewBudget)
  const news = getNewItems(progress, filter, directionMode, allowCardIds)

  let introductions: StudyItem[]
  if (mode === 'learn') {
    const wave =
      waveIds.length > 0
        ? waveIds
        : (() => {
            const heads: string[] = []
            for (const item of news) {
              if (!heads.includes(item.card.id)) heads.push(item.card.id)
              if (heads.length >= batchSize) break
            }
            const set = new Set(heads)
            return news
              .filter((i) => set.has(i.card.id))
              .map((i) => i.progressId)
          })()
    const activeWave = new Set(wave)
    const pendingInWave = news.filter((i) => activeWave.has(i.progressId))
    // Only drip a couple of headwords into the queue at a time.
    introductions = takeHeadwords(pendingInWave, LEARN_NEW_DRIP)
  } else {
    introductions =
      due.length === 0 &&
      getLearningItems(progress, filter, directionMode).length === 0
        ? takeHeadwords(news, LEARN_NEW_DRIP)
        : []
  }

  // Learn: mix reinforcement/reviews around the few new cards (don't dump news first).
  let queue = dedupeByProgressId(
    mode === 'learn'
      ? due.length > 0
        ? interleaveSpread(shuffle(due), shuffle(introductions))
        : shuffle(introductions)
      : interleaveSpread(shuffle(due), shuffle(introductions)),
  )

  // Don't show the same study item immediately again.
  if (justSeenId && queue.length > 1) {
    const seen = queue.find((i) => i.progressId === justSeenId)
    const rest = queue.filter((i) => i.progressId !== justSeenId)
    if (seen) {
      const stillDue = due.some((d) => d.progressId === justSeenId)
      if (stillDue) {
        const insertAt = Math.min(
          Math.max(3, Math.ceil(rest.length * 0.5)),
          rest.length,
        )
        rest.splice(insertAt, 0, seen)
      }
      queue = rest
    }
  }

  // Avoid the same Welsh headword twice in a row when another card exists.
  if (justSeenId && queue.length > 1) {
    const justCardId = justSeenId.replace(/::en$/, '')
    if (queue[0]!.card.id === justCardId) {
      const swapAt = queue.findIndex((i) => i.card.id !== justCardId)
      if (swapAt > 0) {
        const next = [...queue]
        ;[next[0], next[swapAt]] = [next[swapAt]!, next[0]!]
        queue = next
      }
    }
  }

  return queue
}

/** Soonest due time among learning/relearning cards (for wait UI). */
export function nextLearningDueAt(
  progress: ProgressMap,
  filter: SessionFilter,
  directionMode: DirectionMode,
  allowCardIds?: string[],
): Date | null {
  const learning = getLearningItems(
    progress,
    filter,
    directionMode,
    allowCardIds,
  )
  if (learning.length === 0) return null
  let soonest: Date | null = null
  for (const item of learning) {
    const due = progress[item.progressId]?.due
    if (!due) continue
    if (!soonest || due.getTime() < soonest.getTime()) soonest = due
  }
  return soonest
}

export function applyRating(
  progress: ProgressMap,
  progressId: string,
  rating: Grade,
  now = new Date(),
): ProgressMap {
  const next = { ...progress }
  const current = ensureCardState(next, progressId, now)
  const { card } = scheduler.next(current, now, rating)
  next[progressId] = card
  saveProgress(next)
  return next
}

export function previewIntervals(
  progress: ProgressMap,
  progressId: string,
  now = new Date(),
): Record<Grade, string> {
  try {
    const current = ensureCardState({ ...progress }, progressId, now)
    const preview = scheduler.repeat(current, now)
    const fmt = (c: FSRSCard) => formatInterval(c.due, now)
    return {
      [Rating.Again]: fmt(preview[Rating.Again].card),
      [Rating.Hard]: fmt(preview[Rating.Hard].card),
      [Rating.Good]: fmt(preview[Rating.Good].card),
      [Rating.Easy]: fmt(preview[Rating.Easy].card),
    } as Record<Grade, string>
  } catch (err) {
    console.warn('previewIntervals failed', err)
    return {
      [Rating.Again]: '—',
      [Rating.Hard]: '—',
      [Rating.Good]: '—',
      [Rating.Easy]: '—',
    } as Record<Grade, string>
  }
}

export function formatInterval(due: Date, now = new Date()): string {
  const ms = due.getTime() - now.getTime()
  const mins = Math.round(ms / 60_000)
  if (mins < 1) return '<1m'
  if (mins < 60) return `${mins}m`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d`
  const months = Math.round(days / 30)
  return `${months}mo`
}

/** 0–1 strength for UI bars (per progress id). */
export function strengthForCard(card: FSRSCard | undefined): number {
  if (!card || card.state === State.New) return 0
  if (card.state === State.Learning || card.state === State.Relearning) {
    const step = Math.min(card.reps, 4) / 4
    return 0.12 + step * 0.28
  }
  const stab = Math.max(0, card.stability || 0)
  return Math.min(1, 0.42 + Math.log2(1 + stab) / 8)
}

/** Weakest direction when studying both ways. */
export function strengthForVocab(
  progress: ProgressMap,
  cardId: string,
  directionMode: DirectionMode,
): number {
  const dirs = directionsForMode(directionMode)
  const scores = dirs.map((d) =>
    strengthForCard(progress[progressIdFor(cardId, d)]),
  )
  return Math.min(...scores)
}

export function strengthLabel(score: number): string {
  if (score <= 0) return 'New'
  if (score < 0.35) return 'Learning'
  if (score < 0.55) return 'Young'
  if (score < 0.75) return 'Good'
  return 'Strong'
}

/**
 * Most actionable study status for a vocab headword across enabled directions.
 * Priority: due → learning → new → review (scheduled, not due).
 */
export type VocabStudyStatus = 'due' | 'learning' | 'new' | 'review'

export function vocabStudyStatus(
  progress: ProgressMap,
  cardId: string,
  directionMode: DirectionMode,
  now = new Date(),
): VocabStudyStatus {
  const dirs = directionsForMode(directionMode)
  let anyLearning = false
  let anyNew = false
  let anyReview = false
  for (const d of dirs) {
    const s = progress[progressIdFor(cardId, d)]
    if (isNew(s)) {
      anyNew = true
      continue
    }
    if (!s) continue
    if (isDue(s, now)) return 'due'
    if (isLearningState(s)) anyLearning = true
    else anyReview = true
  }
  if (anyLearning) return 'learning'
  if (anyNew && !anyReview) return 'new'
  if (anyNew) return 'new'
  return 'review'
}

export function vocabStatusLabel(status: VocabStudyStatus): string {
  switch (status) {
    case 'due':
      return 'Due'
    case 'learning':
      return 'Learning'
    case 'new':
      return 'New'
    case 'review':
      return 'Review'
  }
}

export function countStats(
  progress: ProgressMap,
  filter: SessionFilter,
  directionMode: DirectionMode = 'both',
) {
  const items = expandItems(filterVocab(filter), directionMode)
  const now = new Date()
  let due = 0
  let learning = 0
  let review = 0
  let news = 0
  for (const item of items) {
    const s = progress[item.progressId]
    if (!s || s.state === State.New) {
      news++
      continue
    }
    if (s.state === State.Learning || s.state === State.Relearning) learning++
    else review++
    if (isDue(s, now)) due++
  }
  const vocabCount = filterVocab(filter).length
  return {
    total: items.length,
    vocab: vocabCount,
    due,
    learning,
    review,
    new: news,
  }
}

/** Headword-level home stats (seen / known well / learning). */
export function countHeadwordStats(
  progress: ProgressMap,
  filter: SessionFilter,
  directionMode: DirectionMode = 'both',
) {
  const cards = filterVocab(filter)
  let seen = 0
  let known = 0
  let learning = 0
  let fresh = 0
  for (const card of cards) {
    if (isVocabUnseen(progress, card, directionMode)) {
      fresh++
      continue
    }
    seen++
    const strength = strengthForVocab(progress, card.id, directionMode)
    if (strength >= 0.75) known++
    else learning++
  }
  return {
    total: cards.length,
    seen,
    known,
    learning,
    new: fresh,
  }
}

export function promptFor(item: StudyItem): string {
  return item.direction === 'cy-en' ? item.card.welsh : item.card.english
}

export function answerFor(item: StudyItem): string {
  return item.direction === 'cy-en' ? item.card.english : item.card.welsh
}

/** Extra cue when cards share a side (dialect pair, synonym, etc.). */
export function senseFor(item: StudyItem): string | undefined {
  return item.card.sense
}

export function welshTextFor(item: StudyItem): string {
  return item.card.welsh
}

export function directionLabel(d: CardDirection): string {
  return d === 'cy-en' ? 'CY→EN' : 'EN→CY'
}

export function dialectLabel(d: Dialect | null | undefined): string | null {
  if (d === 'N') return 'North'
  if (d === 'S') return 'South'
  return null
}
