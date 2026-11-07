import { useState } from 'react'
import {
  BLOCK_META,
  PLAN_SESSIONS,
  TOTAL_SESSIONS,
  WEEK_PLANS,
  getSession,
  weekPlan,
  type PlanSession,
} from '../data/trip/plan'
import { getDialogue } from '../data/trip/dialogues'
import { getScenario, SCENARIOS } from '../data/trip/scenarios'
import { getLesson } from '../lib/lessons'
import { localCalendarDay } from '../lib/srs'
import {
  currentSession,
  daysSinceStudy,
  finishSession,
  isSessionDone,
  markLightDay,
  removeGap,
  reopenSession,
  saveTrip,
  streak,
  toggleBlock,
  tripPace,
  type BlockId,
  type TripState,
} from '../lib/trip'
import { progressIdFor, type ProgressMap } from '../lib/types'
import { isNew } from '../lib/srs'

export type TripLaunch =
  | { kind: 'review'; n: number }
  | { kind: 'phrases'; n: number; ids: string[] }
  | { kind: 'listen' | 'shadow'; n: number; dialogue: string }
  | { kind: 'speak' | 'checkpoint'; n: number; scenario: string }
  | { kind: 'retell'; n: number; short?: boolean }
  | { kind: 'pattern'; n: number; lessonId: string }
  | { kind: 'practice'; scenario: string }

export function phrasesSeen(progress: ProgressMap, ids: string[]): boolean {
  return ids.every(
    (id) =>
      !isNew(progress[progressIdFor(id, 'cy-en')]) ||
      !isNew(progress[progressIdFor(id, 'en-cy')]),
  )
}

export function TripView({
  trip,
  progress,
  due,
  onTrip,
  onLaunch,
  onStory,
  onAsk,
}: {
  trip: TripState
  progress: ProgressMap
  due: number
  onTrip: (t: TripState) => void
  onLaunch: (l: TripLaunch) => void
  onStory: () => void
  onAsk: (context: string) => void
}) {
  const today = localCalendarDay()
  const pace = tripPace(trip, TOTAL_SESSIONS, today)
  const cur = currentSession(trip, TOTAL_SESSIONS)
  const session = cur ? getSession(cur) : undefined
  const [merge, setMerge] = useState(false)
  const [showSetup, setShowSetup] = useState(!trip.updatedAt)
  const [showWhy, setShowWhy] = useState(false)
  const [showGo, setShowGo] = useState(false)
  const away = daysSinceStudy(trip, today)
  const lightToday = trip.light.includes(today)
  const sessionsToday = Object.values(trip.done).filter((d) => d.date === today).length

  const next = session && merge ? getSession(session.n + 1) : undefined
  const canMerge =
    pace.status === 'behind' &&
    session &&
    !session.checkpoint &&
    next != null &&
    !next.checkpoint

  return (
    <div className="trip-page">
      <section className="trip-hero">
        <div>
          <p className="book-kicker">Taith i’r Wladfa</p>
          <h1 className="hero-title">
            {pace.daysLeft > 0 ? (
              <>
                {pace.daysLeft} <span className="trip-hero-unit">diwrnod</span>
              </>
            ) : (
              'Amser mynd!'
            )}
          </h1>
          <p className="page-lead">
            {pace.daysLeft > 0
              ? `days until Patagonia · ${trip.tripDate}`
              : 'You’re there. Pob lwc — and keep talking.'}
          </p>
        </div>
        <div className="stat-row trip-stats">
          <Stat label="Sessions" value={`${pace.completed}/${TOTAL_SESSIONS}`} />
          <Stat label="Streak" value={String(streak(trip, today))} />
          <Stat label="Due cards" value={String(due)} />
        </div>
        <PaceLine pace={pace} />
        <div className="trip-links">
          <button type="button" className="ghost-btn" onClick={onStory}>
            Your story & questions
          </button>
          <button type="button" className="ghost-btn" onClick={() => setShowSetup((v) => !v)}>
            Trip settings
          </button>
          <button type="button" className="ghost-btn" onClick={() => setShowGo((v) => !v)}>
            Before you go
          </button>
          <button type="button" className="ghost-btn" onClick={() => setShowWhy((v) => !v)}>
            How this plan works
          </button>
        </div>
      </section>

      {showSetup && (
        <TripSetup
          trip={trip}
          onTrip={onTrip}
          onClose={() => setShowSetup(false)}
        />
      )}
      {showWhy && <PlanWhy />}
      {showGo && <BeforeYouGo />}

      {away != null && away >= 2 && sessionsToday === 0 && (
        <div className="trip-banner">
          <strong>Croeso nôl!</strong>{' '}
          {away >= 3
            ? `It’s been ${away} days. Today, just do reviews, the conversation and the retell — skip the optional blocks. Your plan has already moved back; nothing is lost.`
            : 'Two days off. Start with your reviews and the retell to warm up; the plan picks up where you left off.'}
        </div>
      )}

      {session ? (
        <SessionCard
          session={session}
          extra={canMerge && merge ? next : undefined}
          trip={trip}
          progress={progress}
          due={due}
          lightToday={lightToday}
          canMerge={Boolean(canMerge)}
          merge={merge}
          onMerge={setMerge}
          onTrip={onTrip}
          onLaunch={onLaunch}
          onDone={() => setMerge(false)}
        />
      ) : (
        <section className="trip-session">
          <h2>Plan complete — llongyfarchiadau!</h2>
          <p className="muted-line">
            Keep reviews ticking over and do a conversation a day until you fly.
          </p>
        </section>
      )}

      <WeekMap trip={trip} current={cur} onReopen={(n) => onTrip(reopenSession(trip, n))} />

      <section className="trip-practice">
        <h2>Extra conversation practice</h2>
        <p className="muted-line">
          Any partner, any time. Repeating the same conversation over a few days is
          good for you — it’s how fluency builds.
        </p>
        <div className="trip-scenarios">
          {SCENARIOS.filter((s) => s.id !== 'prawf').map((s) => (
            <button
              key={s.id}
              type="button"
              className="lesson-row"
              onClick={() => onLaunch({ kind: 'practice', scenario: s.id })}
            >
              <span className="lesson-titles">
                <span className="cy">{s.titleCy}</span>
                <span className="en">{s.title}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {trip.gaps.length > 0 && (
        <section className="trip-gaps">
          <h2>Things you wanted to say</h2>
          <p className="muted-line">
            Your gap list. Ask about one, then delete it once it’s in your head.
          </p>
          <ul>
            {trip.gaps.map((g, i) => (
              <li key={`${g.date}-${i}`}>
                <span>{g.text}</span>
                <span className="trip-gap-actions">
                  <button
                    type="button"
                    className="ghost-btn small"
                    onClick={() =>
                      onAsk(
                        `I'm preparing to talk with Welsh speakers in Patagonia. How do I say this naturally in colloquial Welsh, with a short example? "${g.text}"`,
                      )
                    }
                  >
                    Ask
                  </button>
                  <button
                    type="button"
                    className="ghost-btn small"
                    onClick={() => onTrip(removeGap(trip, i))}
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function PaceLine({ pace }: { pace: ReturnType<typeof tripPace> }) {
  const text: Record<typeof pace.status, string> = {
    done: 'All 48 sessions done.',
    ahead: `Ahead of schedule · ${pace.slack} spare days before the flight.`,
    'on-track': `On track · ${pace.remaining} sessions in ${pace.daysLeft} days (${pace.slack} spare).`,
    tight: `Tight · ${pace.remaining} sessions in ${pace.daysLeft} days. Try not to miss two in a row.`,
    behind: `Behind by ${-pace.slack} · use a double session to catch up (the plan offers one below).`,
  }
  return <p className={`trip-pace ${pace.status}`}>{text[pace.status]}</p>
}

function SessionCard({
  session,
  extra,
  trip,
  progress,
  due,
  lightToday,
  canMerge,
  merge,
  onMerge,
  onTrip,
  onLaunch,
  onDone,
}: {
  session: PlanSession
  extra?: PlanSession
  trip: TripState
  progress: ProgressMap
  due: number
  lightToday: boolean
  canMerge: boolean
  merge: boolean
  onMerge: (on: boolean) => void
  onTrip: (t: TripState) => void
  onLaunch: (l: TripLaunch) => void
  onDone: () => void
}) {
  const wk = weekPlan(session.week)
  const n = session.n
  const ticked = new Set(trip.blocks[String(n)] ?? [])
  const phraseIds = [...session.phraseIds, ...(extra?.phraseIds ?? [])]
  const isDone = (id: BlockId) => {
    if (id === 'phrases') return phrasesSeen(progress, phraseIds)
    if (id === 'review') return ticked.has('review') || due === 0
    return ticked.has(id)
  }
  const coreDone = session.blocks.filter((b) => b.core).every((b) => isDone(b.id))
  const minutes = session.blocks.reduce((m, b) => m + b.minutes, 0)
  const dialogue = session.dialogue ? getDialogue(session.dialogue) : undefined
  const scenario = getScenario(session.scenario)
  const pattern = session.pattern ? getLesson('colloquial', session.pattern) : undefined

  function launch(id: BlockId) {
    switch (id) {
      case 'review':
        return onLaunch({ kind: 'review', n })
      case 'phrases':
        return onLaunch({ kind: 'phrases', n, ids: phraseIds })
      case 'listen':
      case 'shadow':
        if (dialogue) onLaunch({ kind: id, n, dialogue: dialogue.id })
        return
      case 'speak':
      case 'checkpoint':
        return onLaunch({ kind: id, n, scenario: session.scenario })
      case 'retell':
        return onLaunch({ kind: 'retell', n })
      case 'pattern':
        if (session.pattern) onLaunch({ kind: 'pattern', n, lessonId: session.pattern })
        return
    }
  }

  function detail(id: BlockId): string {
    switch (id) {
      case 'review':
        return due === 0 ? 'Nothing due — done' : `${due} cards due`
      case 'phrases':
        return `${phraseIds.length} new phrases`
      case 'listen':
      case 'shadow':
        return dialogue ? `${dialogue.titleCy} — ${dialogue.title}` : ''
      case 'speak':
      case 'checkpoint':
        return `${scenario.titleCy} — ${scenario.title}`
      case 'retell':
        return session.retell.topic
      case 'pattern':
        return pattern ? `Colloquial Welsh ${pattern.id}: ${pattern.titleCy}` : ''
    }
  }

  return (
    <section className="trip-session">
      <div className="trip-session-head">
        <div>
          <p className="book-kicker">
            Week {session.week} · {wk.titleCy} · session {n}
            {extra ? ` + ${extra.n}` : ''} of {TOTAL_SESSIONS}
          </p>
          <h2>{session.checkpoint ? 'Checkpoint day' : wk.title}</h2>
          <p className="muted-line">{session.checkpoint ? wk.canDo.join(' · ') : wk.focus}</p>
        </div>
        <span className="trip-minutes">~{minutes} min</span>
      </div>

      {canMerge && (
        <label className="settings-check trip-merge">
          <input type="checkbox" checked={merge} onChange={(e) => onMerge(e.target.checked)} />
          <span>
            Double session: learn the next session’s phrases too and count both (catch-up)
          </span>
        </label>
      )}

      <ol className="trip-blocks">
        {session.blocks.map((b) => {
          const done = isDone(b.id)
          const meta = BLOCK_META[b.id]
          const manual = b.id !== 'phrases' && !(b.id === 'review' && due === 0)
          return (
            <li key={b.id} className={`trip-block ${done ? 'done' : ''}`}>
              <button
                type="button"
                className="trip-block-main"
                onClick={() => launch(b.id)}
                disabled={b.id === 'review' && due === 0}
              >
                <span className="trip-block-title">
                  {meta.titleCy}
                  <span className="en"> · {meta.title}</span>
                  {!b.core && <span className="trip-optional">optional</span>}
                </span>
                <span className="trip-block-detail">{detail(b.id)}</span>
                <span className="trip-block-why">{meta.why}</span>
              </button>
              <span className="trip-block-side">
                <span className="trip-block-min">{b.minutes}′</span>
                {manual ? (
                  <input
                    type="checkbox"
                    aria-label={`Mark ${meta.title} done`}
                    checked={done}
                    onChange={(e) => onTrip(toggleBlock(trip, n, b.id, e.target.checked))}
                  />
                ) : (
                  <span className="trip-block-check" aria-hidden>
                    {done ? '✓' : ''}
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="trip-session-foot">
        <button
          type="button"
          className="primary-btn"
          disabled={!coreDone}
          onClick={() => {
            onTrip(finishSession(trip, extra ? [n, extra.n] : [n]))
            onDone()
          }}
        >
          {coreDone ? 'Finish session ✓' : 'Finish session (do the core blocks first)'}
        </button>
        {!lightToday && (
          <button
            type="button"
            className="ghost-btn"
            onClick={() => {
              onTrip(markLightDay(trip))
              onLaunch({ kind: 'retell', n, short: true })
            }}
            title="Busy day? Reviews + a 2-minute retell keeps the habit alive"
          >
            Busy day: 10-minute version
          </button>
        )}
      </div>
      {lightToday && (
        <p className="muted-line">
          Busy day logged — your streak is safe. Do your reviews too if you can. The full
          session will be waiting tomorrow.
        </p>
      )}
    </section>
  )
}

function WeekMap({
  trip,
  current,
  onReopen,
}: {
  trip: TripState
  current: number | null
  onReopen: (n: number) => void
}) {
  return (
    <section className="trip-weeks">
      <h2>The eight weeks</h2>
      <ol>
        {WEEK_PLANS.map((wk) => {
          const sessions = PLAN_SESSIONS.filter((s) => s.week === wk.week)
          const score = trip.checkpoints[String(wk.week)]
          return (
            <li key={wk.week} className="trip-week">
              <div className="trip-week-head">
                <span className="trip-week-n">{wk.week}</span>
                <span className="lesson-titles">
                  <span className="cy">{wk.titleCy}</span>
                  <span className="en">{wk.title}</span>
                </span>
                {score && (
                  <span className="trip-week-score" title={score.summary}>
                    {Math.round(score.overall * 10) / 10}/5
                  </span>
                )}
              </div>
              <div className="trip-week-dots">
                {sessions.map((s) => {
                  const done = isSessionDone(trip, s.n)
                  return (
                    <button
                      key={s.n}
                      type="button"
                      className={`trip-dot ${done ? 'done' : ''} ${s.n === current ? 'current' : ''} ${s.checkpoint ? 'check' : ''}`}
                      title={`Session ${s.n}${s.checkpoint ? ' · checkpoint' : ''}${done ? ` · done ${trip.done[String(s.n)]!.date} (click to reopen)` : ''}`}
                      onClick={() => {
                        if (done && window.confirm(`Reopen session ${s.n}?`)) onReopen(s.n)
                      }}
                    >
                      {s.checkpoint ? '★' : s.n}
                    </button>
                  )
                })}
              </div>
              <ul className="trip-week-cando">
                {wk.canDo.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function TripSetup({
  trip,
  onTrip,
  onClose,
}: {
  trip: TripState
  onTrip: (t: TripState) => void
  onClose: () => void
}) {
  const [date, setDate] = useState(trip.tripDate)
  const [cue, setCue] = useState(trip.cue)
  return (
    <section className="trip-setup">
      <h2>Trip settings</h2>
      <label>
        Flight date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label>
        Your study cue — “After ___, I open the app.”
        <input
          value={cue}
          placeholder="e.g. dinner"
          onChange={(e) => setCue(e.target.value)}
        />
        <span className="muted-line">
          Tying study to something you already do daily (an “if–then” plan) makes you
          more likely to show up. Evening is best: sleep helps new words stick.
        </span>
      </label>
      <div className="dialogue-actions">
        <button
          type="button"
          className="primary-btn"
          onClick={() => {
            onTrip(saveTrip({ ...trip, tripDate: date || trip.tripDate, cue }))
            onClose()
          }}
        >
          Save
        </button>
      </div>
    </section>
  )
}

function PlanWhy() {
  return (
    <section className="trip-why">
      <h2>How this plan works</h2>
      <ul>
        <li>
          <strong>Sessions, not dates.</strong> 48 sessions over ~60 days leaves about one
          free day a week. Miss a day and the plan simply waits; nothing piles up.
        </li>
        <li>
          <strong>Reviews first, new phrases second.</strong> Retrieval practice with
          spacing is the most robust memory effect in learning research (Rowland 2014;
          Cepeda et al. 2008). About 8–10 new phrases a session keeps reviews near 15
          minutes, and new phrases stop in week 8.
        </li>
        <li>
          <strong>Chunks before grammar.</strong> Whole phrases like “Dw i’n dod o…” get you
          talking fastest; learners trained to notice chunks are rated more fluent (Boers et
          al. 2006). Grammar guides are optional extras.
        </li>
        <li>
          <strong>Talk every session.</strong> Conversation with feedback has large, lasting
          effects (Mackey & Goo 2007). Your partner nudges you to fix errors yourself first,
          which works better than just being corrected (Lyster & Saito 2010).
        </li>
        <li>
          <strong>Plan, then repeat.</strong> A minute of planning improves fluency, and the
          same conversation repeated over a few days builds it (task-repetition research).
          The 4/3/2 retell (Nation; de Jong & Perfetti 2011) does the same for monologue.
        </li>
        <li>
          <strong>Shadowing</strong> mainly helps rhythm, intonation and fluency, so it’s
          short and optional.
        </li>
        <li>
          <strong>Habits.</strong> Habits take about two months to form, and missing a
          single day doesn’t hurt (Lally et al. 2010). The 10-minute busy-day version keeps
          the streak; try not to miss two in a row.
        </li>
      </ul>
      <h3>Honest expectations</h3>
      <p>
        Around 50–60 hours gets most learners to roughly A1 level (Welsh courses budget
        about 120 hours for Mynediad/A1). This plan aims higher for <em>speaking</em> by
        leaning on rehearsed chunks, your story, expected questions and repair phrases. It
        aims for slow, real conversations on familiar topics with patient speakers — and
        Patagonian Welsh speakers are famously patient with learners. Expect to get lost
        sometimes; the repair phrases are what keep you in Welsh when you do.
      </p>
    </section>
  )
}

function BeforeYouGo() {
  return (
    <section className="trip-why">
      <h2>Before you go</h2>
      <h3>January is quiet — arrange your conversations now</h3>
      <ul>
        <li>
          None of the big Welsh events fall in January: Eisteddfod y Wladfa (Trelew) is in
          October, the youth eisteddfod in September, Trevelin’s in May, and Landing Day
          (Gŵyl y Glaniad) on 28 July.
        </li>
        <li>
          Teachers from Wales on the Welsh Language Project (Cynllun yr Iaith Gymraeg) work
          February–December, so classes are probably on summer break when you arrive.
        </li>
        <li>
          Write ahead (in Welsh!) to Menter Patagonia, the Asociación San David in Trelew,
          the Welsh society in Esquel and the chapels. Ask who would be happy to chat or be
          filmed.
        </li>
      </ul>
      <h3>Places</h3>
      <ul>
        <li>
          <strong>Gaiman</strong> — tea houses (Plas y Coed, Tŷ Te Caerdydd, Tŷ Gwyn), the
          museum, Capel Bethel, the bilingual school.
        </li>
        <li>
          <strong>Trelew</strong> — Capel Moriah (1880) and the town’s Welsh chapel route,
          Ysgol yr Hendre, Asociación San David.
        </li>
        <li>
          <strong>Puerto Madryn</strong> — where the Mimosa landed on 28 July 1865.
        </li>
        <li>
          <strong>Trevelin & Esquel</strong> (Cwm Hyfryd) — Andes farms, the Welsh school in
          Trevelin, and older first-language speakers.
        </li>
      </ul>
      <h3>Filming</h3>
      <ul>
        <li>
          Ask in Welsh first (“Ga i’ch ffilmio chi?”), and get clear permission to publish —
          in Spanish too if needed.
        </li>
        <li>
          Film your weekly checkpoints. Week 1 next to week 8 tells the “two months” story
          better than anything you can say.
        </li>
      </ul>
      <h3>Handle with care</h3>
      <ul>
        <li>
          People here are Argentine with Welsh heritage. Don’t call them English or British,
          and steer clear of the Malvinas/Falklands.
        </li>
        <li>
          The settlers’ part in taking Indigenous (Tehuelche, Mapuche) land is being openly
          discussed after the 160th anniversary. Listen more than you talk.
        </li>
        <li>
          Spanish is everyone’s everyday language and nobody knows exactly how many speak
          Welsh (estimates run to about 5,000; over 1,000 were in classes in 2024–25).
          Expect older “heritage” speakers and younger learners to sound different.
        </li>
      </ul>
      <h3>Your India connection</h3>
      <p>
        Welsh missionaries worked in the Khasi Hills of north-east India from 1841 — the
        Khasi language was first written down in a Welsh-based alphabet. Locals will love
        that story, and it fits your video.
      </p>
    </section>
  )
}
