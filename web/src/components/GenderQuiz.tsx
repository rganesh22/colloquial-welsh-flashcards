import { useEffect, useMemo, useRef, useState } from 'react'
import type { VocabCard } from '../lib/types'
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

export function GenderQuiz({
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
    () => shuffle(cards.filter((c) => c.gender === 'm' || c.gender === 'f')),
    [cards],
  )
  const startedAt = useRef(Date.now())
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<'m' | 'f' | null>(null)
  const [correct, setCorrect] = useState(0)
  const [asked, setAsked] = useState(0)
  const indexRef = useRef(index)
  indexRef.current = index

  const card = pool.length ? pool[index % pool.length]! : null
  const answered = picked !== null
  const isRight = !!card && picked === card.gender

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
      if (pool.length === 0) return
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
            .querySelector<HTMLButtonElement>('.activity-gender .card-speak')
            ?.click()
          return
        }
        if (e.key === '1' || e.key === 'm' || e.key === 'M') {
          e.preventDefault()
          choose('m')
        } else if (e.key === '2' || e.key === 'f' || e.key === 'F') {
          e.preventDefault()
          choose('f')
        }
        return
      }
      if (!isRight && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault()
        next()
      }
    },
    [picked, pool.length, index, isRight],
  )

  if (pool.length === 0 || !card) {
    return (
      <p className="activity-empty">
        No gendered cards seen yet — learn some nouns first.
      </p>
    )
  }

  function choose(g: 'm' | 'f') {
    if (picked) return
    setPicked(g)
    setAsked((n) => n + 1)
    if (g === card!.gender) setCorrect((n) => n + 1)
  }

  return (
    <div className={`activity-gender ${compact ? 'compact' : ''}`}>
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
        <SpeakButton text={card.welsh} apiKeyStored={apiKey} className="card-speak" />
        <p className="activity-welsh">{card.welsh}</p>
        <p className="activity-en">{card.english}</p>
        <p className="activity-hint">
          What gender? <kbd>1</kbd>/<kbd>2</kbd> · <kbd>R</kbd> speak
          {index > 0 && (
            <>
              {' · '}
              <kbd>~</kbd> back
            </>
          )}
        </p>
      </div>

      <div className="gender-choice-row">
        <button
          type="button"
          className={`gender-choice ${picked === 'm' ? (isRight ? 'right' : 'wrong') : ''} ${answered && card.gender === 'm' ? 'reveal' : ''}`}
          data-gender="m"
          onClick={() => choose('m')}
          disabled={answered}
        >
          <kbd>1</kbd> m · masculine
        </button>
        <button
          type="button"
          className={`gender-choice ${picked === 'f' ? (isRight ? 'right' : 'wrong') : ''} ${answered && card.gender === 'f' ? 'reveal' : ''}`}
          data-gender="f"
          onClick={() => choose('f')}
          disabled={answered}
        >
          <kbd>2</kbd> f · feminine
        </button>
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
            {isRight ? 'Ie — correct' : `Nage — ${card.gender}`}
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
