import { useState } from 'react'
import { PLAN_SESSIONS } from '../data/trip/plan'
import {
  hoursSummary,
  levelForHours,
  OUTSIDE_KINDS,
  outsideByKind,
  weekStart,
} from '../lib/hours'
import { localCalendarDay } from '../lib/srs'
import { logOutside, removeOutside, type OutsideKind, type TripState } from '../lib/trip'

/** Grammar units in the plan, and the ones you've done (from finished or ticked sessions). */
function grammarProgress(trip: TripState): { done: number; total: number } {
  const all = new Set<string>()
  const done = new Set<string>()
  for (const s of PLAN_SESSIONS) {
    if (!s.pattern || s.pattern === 'mix') continue
    all.add(s.pattern)
    const key = String(s.n)
    if (trip.done[key] || trip.blocks[key]?.includes('pattern')) done.add(s.pattern)
  }
  return { done: done.size, total: all.size }
}

function latestLevel(trip: TripState): { week: string; level: string } | null {
  const weeks = Object.keys(trip.checkpoints)
    .filter((w) => trip.checkpoints[w]?.level)
    .sort((a, b) => Number(b) - Number(a))
  const w = weeks[0]
  return w ? { week: w, level: trip.checkpoints[w]!.level! } : null
}

const fmtH = (h: number) => (h < 10 ? h.toFixed(1) : String(Math.round(h)))

/**
 * The hybrid half of the plan: log time outside the app, see this week
 * against the targets, and where your hours are heading.
 */
export function HybridCard({
  trip,
  onTrip,
}: {
  trip: TripState
  onTrip: (t: TripState) => void
}) {
  const [open, setOpen] = useState<OutsideKind | null>(null)
  const week = outsideByKind(trip, weekStart())
  const hours = hoursSummary(trip)
  const grammar = grammarProgress(trip)
  const level = latestLevel(trip)
  const today = localCalendarDay()
  const lastToday = [...trip.outside].reverse().find((o) => o.date === today && o.minutes > 0)

  return (
    <section className="trip-session hybrid-card">
      <div className="talk-plan-head">
        <h2>Outside the app · this week</h2>
        <span className="muted-line">{fmtH(hours.total)} h so far</span>
      </div>
      <ul className="hybrid-kinds">
        {OUTSIDE_KINDS.map((k) => {
          const mins = week[k.id]
          const pct = Math.min(100, Math.round((mins / k.perWeek) * 100))
          return (
            <li key={k.id}>
              <button
                type="button"
                className="hybrid-kind-head"
                onClick={() => setOpen(open === k.id ? null : k.id)}
                aria-expanded={open === k.id}
              >
                <span>
                  <span className="cy">{k.titleCy}</span> {k.title}
                </span>
                <span className="muted-line">
                  {Math.round(mins)} / {k.perWeek} min {open === k.id ? '▴' : '▾'}
                </span>
              </button>
              <div className="hybrid-bar" aria-hidden>
                <span style={{ width: `${pct}%` }} />
              </div>
              {open === k.id && (
                <div className="hybrid-how">
                  <p className="muted-line">{k.how}</p>
                  <ul>
                    {k.use.map((u) => (
                      <li key={u.name}>
                        {u.url ? (
                          <a href={u.url} target="_blank" rel="noreferrer">
                            {u.name}
                          </a>
                        ) : (
                          <strong>{u.name}</strong>
                        )}{' '}
                        — {u.note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="hybrid-log">
                {[15, 30, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className="ghost-btn small"
                    onClick={() => onTrip(logOutside(trip, k.id, m))}
                  >
                    +{m} min
                  </button>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
      {lastToday && (
        <button
          type="button"
          className="talk-link"
          onClick={() => onTrip(removeOutside(trip, lastToday.id))}
        >
          Undo last: +{lastToday.minutes} min{' '}
          {OUTSIDE_KINDS.find((k) => k.id === lastToday.kind)?.title.toLowerCase()}
        </button>
      )}

      <div className="hybrid-level">
        <p>
          <strong>{fmtH(hours.total)} h</strong> so far ({fmtH(hours.app)} in the app,{' '}
          {fmtH(hours.outside)} outside) · grammar units {grammar.done} of {grammar.total}
          {level ? (
            <>
              {' '}
              · last checkpoint (week {level.week}): <strong>{level.level}</strong>
            </>
          ) : null}
        </p>
        {hours.daysLeft > 0 && (
          <p className="muted-line">
            At your pace: about {Math.round(hours.projected)} h by the flight (
            {levelForHours(hours.projected)}). On the full hybrid plan from today: about{' '}
            {Math.round(hours.projectedPlan)} h ({levelForHours(hours.projectedPlan)}). Your
            checkpoints are the real measure.
          </p>
        )}
      </div>
    </section>
  )
}
