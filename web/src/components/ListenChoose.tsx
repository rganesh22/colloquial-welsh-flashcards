import { useEffect, useMemo, useRef, useState } from 'react'
import type { VocabCard } from '../lib/types'
import { getApiKey } from '../lib/gemini'
import { speakWelsh } from '../lib/tts'
import { SpeakButton } from './SpeakButton'
import { ActivityTimer } from './ActivityTimer'
import { digitIndex, useKeydown } from '../lib/keys'

const AUTO_MS = 400

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

/** Hide sense lines that embed the Welsh headword (answer leak). */
function safeEnSense(card: VocabCard): string | undefined {
  if (!card.sense) return undefined
  const cy = card.welsh.toLowerCase()
  if (cy && card.sense.toLowerCase().includes(cy)) return undefined
  return card.sense
}

export function ListenChoose({
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
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [asked, setAsked] = useState(0)
  const [playing, setPlaying] = useState(false)
  const startedAt = useRef(Date.now())
  const indexRef = useRef(index)
  indexRef.current = index

  const pool = useMemo(() => shuffle(cards), [cards])
  const target = pool.length ? pool[index % pool.length]! : null

  const options = useMemo(() => {
    if (!target || pool.length < 2) return []
    // Always aim for 4 choices (target + 3 distractors) when the pool allows.
    const want = Math.min(3, pool.length - 1)
    const distractors = shuffle(pool.filter((c) => c.id !== target.id)).slice(
      0,
      want,
    )
    return shuffle([target, ...distractors])
  }, [target, pool, index])

  const answered = picked !== null
  const isRight = !!target && picked === target.id

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

  function replay() {
    if (!target) return
    setPlaying(true)
    void speakWelsh({
      text: target.welsh,
      apiKey: getApiKey(apiKey),
    })
      .catch(() => {})
      .finally(() => setPlaying(false))
  }

  useEffect(() => {
    if (!target) return
    let cancelled = false
    setPlaying(true)
    void speakWelsh({
      text: target.welsh,
      apiKey: getApiKey(apiKey),
    })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setPlaying(false)
      })
    return () => {
      cancelled = true
    }
  }, [target?.id, apiKey])

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
          replay()
          return
        }
        const idx = digitIndex(e.key)
        if (idx !== null && idx < options.length) {
          e.preventDefault()
          choose(options[idx]!.id)
        }
        return
      }
      if (!isRight && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault()
        next()
      }
    },
    [picked, target, options, apiKey, index, isRight],
  )

  if (cards.length < 2) {
    return (
      <p className="activity-empty">
        Need at least 2 seen cards for listen & choose.
      </p>
    )
  }

  if (!target) return null

  function choose(id: string) {
    if (picked) return
    setPicked(id)
    setAsked((n) => n + 1)
    if (id === target!.id) setCorrect((n) => n + 1)
  }

  return (
    <div className={`activity-listen ${compact ? 'compact' : ''}`}>
      <div className="activity-score">
        <span>
          {correct}/{asked || 0} right
        </span>
        <ActivityTimer startedAt={startedAt.current} />
        <span>
          {(index % pool.length) + 1}/{pool.length}
        </span>
      </div>

      <div className="activity-prompt-card listen-prompt">
        <SpeakButton
          text={target.welsh}
          apiKeyStored={apiKey}
          className="card-speak"
        />
        <p className="activity-hint">
          {playing ? 'Playing…' : 'What did you hear?'}{' '}
          <kbd>1</kbd>–<kbd>{options.length}</kbd>
          {' · '}
          <kbd>R</kbd> speak
          {index > 0 && (
            <>
              {' · '}
              <kbd>~</kbd> back
            </>
          )}
        </p>
        <p className="listen-hidden" aria-hidden>
          ···
        </p>
      </div>

      <div className="listen-options">
        {options.map((c, i) => {
          const showRight = answered && c.id === target.id
          const showWrong = answered && picked === c.id && c.id !== target.id
          const sense = safeEnSense(c)
          return (
            <button
              key={c.id}
              type="button"
              className={`listen-option ${showRight ? 'right' : ''} ${showWrong ? 'wrong' : ''}`}
              onClick={() => choose(c.id)}
              disabled={answered}
            >
              <kbd>{i + 1}</kbd>
              <span>
                {c.english}
                {sense ? ` · ${sense}` : ''}
              </span>
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
            {isRight ? 'Ie — correct' : `Nage — ${target.welsh}`}
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
