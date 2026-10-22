import { useEffect, useMemo, useRef, useState } from 'react'
import type { VocabCard } from '../lib/types'
import { inventPluralDistractors } from '../lib/pluralDistractors'
import { SpeakButton } from './SpeakButton'
import { ActivityTimer } from './ActivityTimer'
import { useKeydown } from '../lib/keys'

const AUTO_MS = 400

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function PluralQuiz({
  cards,
  apiKey,
  onComplete,
  compact,
}: {
  cards: VocabCard[]
  apiKey: string
  onComplete?: () => void
  compact?: boolean
}) {
  const pool = useMemo(
    () => shuffle(cards.filter((c) => Boolean(c.plural))),
    [cards],
  )
  const bannedPlurals = useMemo(
    () => new Set(pool.map((c) => c.plural!).filter(Boolean)),
    [pool],
  )
  const startedAt = useRef(Date.now())
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [asked, setAsked] = useState(0)
  const indexRef = useRef(index)
  indexRef.current = index

  const target = pool.length ? pool[index % pool.length]! : null

  const options = useMemo(() => {
    if (!target?.plural) return []
    const fakes = inventPluralDistractors(
      target.welsh,
      target.plural,
      3,
      bannedPlurals,
    )
    return shuffle([target.plural, ...fakes])
  }, [target, bannedPlurals, index])

  const answered = picked !== null
  const isRight = !!target?.plural && picked === target.plural

  function next() {
    const nextIndex = indexRef.current + 1
    setPicked(null)
    if (nextIndex >= pool.length) {
      if (onComplete) {
        onComplete()
        return
      }
    }
    setIndex(nextIndex)
  }

  function prev() {
    if (indexRef.current <= 0) return
    setPicked(null)
    setIndex((i) => Math.max(0, i - 1))
  }

  useEffect(() => {
    if (!answered || !isRight) return
    const id = window.setTimeout(() => next(), AUTO_MS)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, isRight, index])

  useKeydown(
    (e) => {
      if (!target || options.length === 0) return
      if (
        (e.key === '`' || e.key === '~' || e.key === 'Backspace') &&
        indexRef.current > 0
      ) {
        e.preventDefault()
        prev()
        return
      }
      if (!picked) {
        if (e.key === 'r' || e.key === 'R') {
          e.preventDefault()
          document
            .querySelector<HTMLButtonElement>('.activity-plural .card-speak')
            ?.click()
          return
        }
        const n = Number(e.key)
        if (n >= 1 && n <= options.length) {
          e.preventDefault()
          choose(options[n - 1]!)
        }
        return
      }
      if (!isRight && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault()
        next()
      }
    },
    [picked, target, options, isRight, index],
  )

  if (pool.length === 0 || !target?.plural) {
    return (
      <p className="activity-empty">
        No plural nouns seen yet — learn some nouns with plurals first.
      </p>
    )
  }

  function choose(pl: string) {
    if (picked) return
    setPicked(pl)
    setAsked((n) => n + 1)
    if (pl === target!.plural) setCorrect((n) => n + 1)
  }

  return (
    <div className={`activity-plural ${compact ? 'compact' : ''}`}>
      <div className="activity-score">
        <span>
          {correct}/{asked || 0} right
        </span>
        <ActivityTimer startedAt={startedAt.current} />
        <span>
          {(index % pool.length) + 1}/{pool.length}
        </span>
      </div>

      <div className="activity-prompt-card">
        <SpeakButton
          text={target.welsh}
          apiKeyStored={apiKey}
          className="card-speak"
        />
        <p className="activity-welsh">{target.welsh}</p>
        <p className="activity-en">{target.english}</p>
        <p className="activity-hint">
          What’s the plural? <kbd>1</kbd>–<kbd>{options.length}</kbd> ·{' '}
          <kbd>R</kbd> speak
          {index > 0 && (
            <>
              {' · '}
              <kbd>~</kbd> back
            </>
          )}
        </p>
      </div>

      <div className="listen-options">
        {options.map((pl, i) => {
          const showRight = answered && pl === target.plural
          const showWrong = answered && picked === pl && pl !== target.plural
          return (
            <button
              key={`${pl}-${i}`}
              type="button"
              className={`listen-option ${showRight ? 'right' : ''} ${showWrong ? 'wrong' : ''}`}
              onClick={() => choose(pl)}
              disabled={answered}
            >
              <kbd>{i + 1}</kbd>
              <span>{pl}</span>
            </button>
          )
        })}
      </div>

      <div className="activity-nav-row">
        <button
          type="button"
          className="ghost-btn"
          onClick={prev}
          disabled={index <= 0}
        >
          ← Back
        </button>
      </div>

      {answered && (
        <div className="activity-feedback">
          <p className={isRight ? 'ok' : 'no'}>
            {isRight ? 'Ie — correct' : `Nage — ${target.plural}`}
          </p>
          {!isRight && (
            <button type="button" className="primary-btn" onClick={next}>
              Next <kbd>E</kbd>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
