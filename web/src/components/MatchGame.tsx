import { useEffect, useMemo, useRef, useState } from 'react'
import type { VocabCard } from '../lib/types'
import { dialectLabel } from '../lib/srs'
import { digitIndex, useKeydown } from '../lib/keys'
import { ActivityTimer } from './ActivityTimer'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

/** Sense cues that embed Welsh (legacy) would leak on the English column. */
function safeEnSense(card: VocabCard): string | undefined {
  if (!card.sense) return undefined
  const cy = card.welsh.toLowerCase()
  if (cy && card.sense.toLowerCase().includes(cy)) return undefined
  return card.sense
}

type Side = 'cy' | 'en'

/**
 * Match with resetting number pads:
 * 1–N picks Welsh first; then 1–N picks English for the pair.
 */
export function MatchGame({
  cards,
  onComplete,
  compact,
}: {
  cards: VocabCard[]
  onComplete?: () => void
  compact?: boolean
}) {
  const dealSize = Math.min(4, cards.length)
  const startedAt = useRef(Date.now())
  // Stable key so a new array with the same ids doesn't reshuffle mid-round.
  const cardsKey = cards.map((c) => c.id).join('\0')

  const [round, setRound] = useState(0)
  const deal = useMemo(() => {
    void round
    void cardsKey
    if (cards.length < 4) return []
    return shuffle(cards).slice(0, Math.max(4, Math.min(dealSize, 4)))
    // cardsKey captures identity; cards is read for the shuffle payload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsKey, dealSize, round])

  const [cyOrder, setCyOrder] = useState<string[]>([])
  const [enOrder, setEnOrder] = useState<string[]>([])
  const [selected, setSelected] = useState<{ side: Side; id: string } | null>(
    null,
  )
  const selectedRef = useRef(selected)
  selectedRef.current = selected
  const [matched, setMatched] = useState<Set<string>>(() => new Set())
  const matchedRef = useRef(matched)
  matchedRef.current = matched
  const [miss, setMiss] = useState<string | null>(null)

  useEffect(() => {
    const ids = deal.map((c) => c.id)
    setCyOrder(shuffle(ids))
    setEnOrder(shuffle(ids))
    setMatched(new Set())
    setSelected(null)
    setMiss(null)
  }, [deal])

  const done = deal.length > 0 && matched.size === deal.length
  /** After picking Welsh, numbers apply to the English column. */
  const pickingEn = selected?.side === 'cy'

  useEffect(() => {
    if (!done) return
    const id = window.setTimeout(() => {
      if (onComplete) onComplete()
      else setRound((r) => r + 1)
    }, 450)
    return () => window.clearTimeout(id)
  }, [done, onComplete])

  function tap(side: Side, id: string) {
    const curMatched = matchedRef.current
    if (
      curMatched.has(id) ||
      (deal.length > 0 && curMatched.size === deal.length)
    )
      return
    const prev = selectedRef.current
    if (!prev) {
      setSelected({ side, id })
      setMiss(null)
      return
    }
    if (prev.side === side) {
      setSelected({ side, id })
      return
    }
    if (prev.id === id) {
      setMatched((m) => new Set(m).add(id))
      setSelected(null)
      setMiss(null)
      return
    }
    setMiss(id)
    window.setTimeout(() => {
      setSelected(null)
      setMiss(null)
    }, 450)
  }

  useKeydown(
    (e) => {
      if (deal.length === 0 || done) return
      const idx = digitIndex(e.key)
      if (idx === null) return

      if (!pickingEn) {
        if (idx >= cyOrder.length) return
        const id = cyOrder[idx]!
        if (matchedRef.current.has(id)) return
        e.preventDefault()
        tap('cy', id)
        return
      }

      if (idx >= enOrder.length) return
      const id = enOrder[idx]!
      if (matchedRef.current.has(id)) return
      e.preventDefault()
      tap('en', id)
    },
    [deal, done, cyOrder, enOrder, pickingEn],
  )

  if (cards.length < 4) {
    return (
      <p className="activity-empty">
        Need at least 4 seen cards for matching — keep learning.
      </p>
    )
  }

  const byId = new Map(deal.map((c) => [c.id, c]))

  return (
    <div className={`activity-match ${compact ? 'compact' : ''}`}>
      <div className="activity-score">
        <span>
          {matched.size}/{deal.length} pairs
        </span>
        <ActivityTimer startedAt={startedAt.current} />
        <span>Round {round + 1}</span>
      </div>
      <p className="activity-key-hint muted-line">
        {pickingEn ? (
          <>
            Pick English <kbd>1</kbd>–<kbd>{enOrder.length}</kbd>
          </>
        ) : (
          <>
            Pick Welsh <kbd>1</kbd>–<kbd>{cyOrder.length}</kbd>
          </>
        )}
      </p>

      <div className="match-board">
        <div className={`match-col ${pickingEn ? 'dimmed' : 'active-col'}`}>
          {cyOrder.map((id, i) => {
            const c = byId.get(id)
            if (!c) return null
            const on = selected?.side === 'cy' && selected.id === id
            const bad = miss === id && selected?.side === 'en'
            return (
              <button
                key={`cy-${id}`}
                type="button"
                className={`match-tile ${matched.has(id) ? 'matched' : ''} ${on ? 'selected' : ''} ${bad ? 'miss' : ''}`}
                disabled={matched.has(id)}
                onClick={() => tap('cy', id)}
              >
                <span className="match-tile-row">
                  {!pickingEn && !matched.has(id) ? (
                    <kbd className="tile-key">{i + 1}</kbd>
                  ) : (
                    <span className="tile-key-spacer" aria-hidden />
                  )}
                  <span className="match-tile-body">
                    <span className="match-main">{c.welsh}</span>
                    {dialectLabel(c.dialect) && (
                      <span className="dialect" data-dialect={c.dialect!}>
                        {dialectLabel(c.dialect)}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
        <div className={`match-col ${pickingEn ? 'active-col' : 'dimmed'}`}>
          {enOrder.map((id, i) => {
            const c = byId.get(id)
            if (!c) return null
            const on = selected?.side === 'en' && selected.id === id
            const bad = miss === id && selected?.side === 'cy'
            const sense = safeEnSense(c)
            return (
              <button
                key={`en-${id}`}
                type="button"
                className={`match-tile ${matched.has(id) ? 'matched' : ''} ${on ? 'selected' : ''} ${bad ? 'miss' : ''}`}
                disabled={matched.has(id)}
                onClick={() => tap('en', id)}
              >
                <span className="match-tile-row">
                  {pickingEn && !matched.has(id) ? (
                    <kbd className="tile-key">{i + 1}</kbd>
                  ) : (
                    <span className="tile-key-spacer" aria-hidden />
                  )}
                  <span className="match-tile-body">
                    <span className="match-main">{c.english}</span>
                    {sense && <span className="match-sense">{sense}</span>}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {done && (
        <div className="activity-feedback">
          <p className="ok">All matched</p>
        </div>
      )}
    </div>
  )
}
