import { useEffect, useMemo, useRef } from 'react'
import type {
  ActivityKind,
  DirectionMode,
  ProgressMap,
  SessionFilter,
  VocabCard,
} from '../lib/types'
import {
  getSeenGenderedVocab,
  getSeenVocab,
} from '../lib/srs'
import { GenderQuiz } from './GenderQuiz'
import { MatchGame } from './MatchGame'
import { ListenChoose } from './ListenChoose'
import { PluralQuiz } from './PluralQuiz'
import { ActivityTimer } from './ActivityTimer'
import { useKeydown } from '../lib/keys'

const TITLES: Record<ActivityKind, string> = {
  gender: 'Gender check',
  match: 'Quick match',
  listen: 'Listen & choose',
  plurals: 'Plurals',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

/** Prefer recent session cards, then shuffle the rest — never a fixed prefix. */
function sampleCards(
  pool: VocabCard[],
  n: number,
  preferIds?: string[],
): VocabCard[] {
  if (pool.length === 0) return []
  const prefer = new Set(preferIds ?? [])
  const hot = shuffle(pool.filter((c) => prefer.has(c.id)))
  const cold = shuffle(pool.filter((c) => !prefer.has(c.id)))
  return [...hot, ...cold].slice(0, Math.min(n, pool.length))
}

export function pickLearnActivity(
  progress: ProgressMap,
  direction: DirectionMode,
  opts?: {
    preferIds?: string[]
    filter?: SessionFilter
    avoidKind?: ActivityKind
    /** When false, omit listen & choose. */
    allowListen?: boolean
  },
): { kind: ActivityKind; cards: VocabCard[] } | null {
  const filter = opts?.filter ?? { kind: 'all' as const }
  const seen = getSeenVocab(progress, filter, direction)
  const gendered = getSeenGenderedVocab(progress, filter, direction)
  const plurals = seen.filter((c) => Boolean(c.plural))
  const prefer = opts?.preferIds
  const allowListen = opts?.allowListen !== false

  const options: { kind: ActivityKind; cards: VocabCard[] }[] = []
  if (gendered.length >= 1) {
    options.push({
      kind: 'gender',
      cards: sampleCards(gendered, 3, prefer),
    })
  }
  if (seen.length >= 4) {
    options.push({
      kind: 'match',
      cards: sampleCards(seen, 8, prefer),
    })
  }
  if (allowListen && seen.length >= 4) {
    options.push({
      kind: 'listen',
      cards: sampleCards(seen, 6, prefer),
    })
  }
  if (plurals.length >= 2) {
    options.push({
      kind: 'plurals',
      cards: sampleCards(plurals, 4, prefer),
    })
  }
  if (options.length === 0) return null
  const filtered = opts?.avoidKind
    ? options.filter((o) => o.kind !== opts.avoidKind)
    : options
  const pool = filtered.length > 0 ? filtered : options
  return pool[Math.floor(Math.random() * pool.length)]!
}

function activityReady(activity: ActivityKind, cards: VocabCard[]): boolean {
  if (activity === 'match' || activity === 'listen') return cards.length >= 4
  if (activity === 'plurals') return cards.length >= 2
  return cards.length >= 1
}

export function StudyActivityBreak({
  activity,
  cards,
  apiKey,
  onDone,
  onSkip,
  onBack,
  canBack,
}: {
  activity: ActivityKind
  cards: VocabCard[]
  apiKey: string
  onDone: () => void
  onSkip: () => void
  onBack?: () => void
  canBack?: boolean
}) {
  const startedAt = useRef(Date.now())
  const skippedRef = useRef(false)

  useKeydown((e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onSkip()
      return
    }
    if (
      canBack &&
      onBack &&
      (e.key === '`' || e.key === '~' || e.key === 'Backspace')
    ) {
      e.preventDefault()
      onBack()
    }
  }, [onSkip, onBack, canBack])

  // Freeze the deal for this break — parent re-renders must not reshuffle.
  const cardsKey = cards.map((c) => c.id).join('\0')
  const pool = useMemo(() => {
    // Match & listen need ≥4; keep other breaks short.
    const size =
      activity === 'match' || activity === 'listen'
        ? 4
        : activity === 'plurals'
          ? 3
          : 2
    return shuffle(cards).slice(0, Math.min(size, cards.length))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity, cardsKey])

  const canRun = activityReady(activity, pool)

  // Never leave the learner stuck on an empty “need more cards” screen.
  useEffect(() => {
    if (canRun || skippedRef.current) return
    skippedRef.current = true
    onSkip()
  }, [canRun, onSkip])

  if (!canRun) {
    return (
      <div className="study-activity-break">
        <p className="muted-line">Skipping practice break…</p>
      </div>
    )
  }

  return (
    <div className="study-activity-break">
      <div className="study-activity-head">
        {canBack && onBack && (
          <button
            type="button"
            className="study-back-btn"
            onClick={onBack}
            title="Previous card (~ / ← / Backspace)"
          >
            ← Back
          </button>
        )}
        <h2>{TITLES[activity]}</h2>
        <ActivityTimer startedAt={startedAt.current} />
        <p className="muted-line">
          Practice break · <kbd>Esc</kbd> skip
        </p>
        <button type="button" className="ghost-btn" onClick={onSkip}>
          Skip
        </button>
      </div>
      <div className="activity-stage">
        {activity === 'gender' && (
          <GenderQuiz
            cards={pool}
            apiKey={apiKey}
            compact
            onComplete={onDone}
          />
        )}
        {activity === 'match' && (
          <MatchGame cards={pool} compact onComplete={onDone} />
        )}
        {activity === 'listen' && (
          <ListenChoose
            cards={pool}
            apiKey={apiKey}
            compact
            onComplete={onDone}
          />
        )}
        {activity === 'plurals' && (
          <PluralQuiz
            cards={pool}
            apiKey={apiKey}
            compact
            onComplete={onDone}
          />
        )}
      </div>
    </div>
  )
}
