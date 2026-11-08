import { useEffect, useState } from 'react'
import {
  BLOCK_META,
  OUTREACH_CHASE,
  OUTREACH_CONFIRM,
  PLAN_SESSIONS,
  TOTAL_SESSIONS,
  WEEK_PLANS,
  adaptSession,
  getSession,
  nextPlanSession,
  sessionMinutes,
  weekPlan,
  type PlanSession,
} from '../data/trip/plan'
import { getDialogue } from '../data/trip/dialogues'
import { getScenario, SCENARIOS } from '../data/trip/scenarios'
import { getClip } from '../data/trip/listening'
import { getLesson } from '../lib/lessons'
import { UNIT_SKILLS } from '../lib/grammar'
import { HybridCard } from './HybridCard'
import { localCalendarDay } from '../lib/srs'
import {
  daysSinceStudy,
  finishSession,
  isSessionDone,
  removeGap,
  reopenSession,
  saveTrip,
  streak,
  studyDays,
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
  | { kind: 'story'; n: number }
  | { kind: 'clip'; n: number; clip: string }
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
  const nextUp = nextPlanSession(trip, today)
  const cur = nextUp?.n ?? null
  const base = cur ? getSession(cur) : undefined
  const session = base ? adaptSession(base, trip) : undefined
  const [merge, setMerge] = useState(false)
  const [keepGoing, setKeepGoing] = useState(false)
  // First run: offer setup until a study cue is set (closing it only hides it for now).
  const [showSetup, setShowSetup] = useState(!trip.cue)
  const [showWhy, setShowWhy] = useState(false)
  const [showGo, setShowGo] = useState(false)
  const [showPractice, setShowPractice] = useState(false)
  const away = daysSinceStudy(trip, today)
  const lightToday = trip.light.includes(today)
  const finishedToday = Object.entries(trip.done)
    .filter(([, d]) => d.date === today && d.mergedInto == null)
    .map(([k]) => Number(k))
  const doneForToday = finishedToday.length > 0 && !keepGoing
  const coreOnly = away != null && away >= 3 && finishedToday.length === 0
  const days = streak(trip, today)

  // Coming back from a block mid-session: land on the session, not the hero.
  const [resume] = useState(() => cur != null && (trip.blocks[String(cur)]?.length ?? 0) > 0)
  useEffect(() => {
    if (resume) document.querySelector('.trip-session')?.scrollIntoView({ block: 'start' })
  }, [resume])

  const next = session && merge ? getSession(session.n + 1) : undefined
  const canMerge =
    pace.slack < 4 &&
    session &&
    !session.checkpoint &&
    next != null &&
    !next.checkpoint &&
    session.phraseIds.length + next.phraseIds.length <= 16

  const coreNames = session
    ? session.blocks
        .filter((b) => b.core && !(b.id === 'review' && due === 0))
        .map((b) => BLOCK_META[b.id].title.toLowerCase().replace(/ \(.*\)$/, ''))
    : []

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
          {trip.cue && pace.daysLeft > 0 && (
            <p className="trip-cue">After {cueText(trip.cue)} → today’s session.</p>
          )}
        </div>
        <div className="stat-row trip-stats">
          <Stat label="Sessions" value={`${pace.completed}/${TOTAL_SESSIONS}`} />
          {days > 0 ? (
            <Stat label="Day streak" value={String(days)} />
          ) : (
            <Stat label="Study days" value={String(studyDays(trip).size)} />
          )}
          {due > 0 && <Stat label="Due cards" value={String(due)} />}
        </div>
        <p className="trip-stat-line">
          {pace.completed}/{TOTAL_SESSIONS} sessions
          {days > 1 ? ` · ${days}-day streak` : ''} · {due} cards due
        </p>
        <PaceLine pace={pace} />
      </section>

      {nextUp?.skipped && !doneForToday && (
        <div className="trip-banner">
          <strong>Jumped ahead.</strong> Your flight is close, so today’s session is from{' '}
          {session ? weekPlan(session.week).title.toLowerCase() : 'the last weeks'} — what
          you’ll need most on camera. The sessions you skipped stay open on the week map.
        </div>
      )}

      {!doneForToday && away != null && away >= 2 && finishedToday.length === 0 && (
        <div className="trip-banner">
          <strong>Croeso nôl!</strong>{' '}
          {away >= 3
            ? `It’s been ${away} days. Today is core blocks only — ${coreNames.join(', ')}. Your plan has already moved back; nothing is lost.`
            : 'Two days off — that’s fine. Start with your reviews to warm up; the plan picks up where you left off.'}{' '}
          Short on time? The busy-day retell takes 2 minutes and keeps the habit.
        </div>
      )}

      {doneForToday || (lightToday && !keepGoing) ? (
        <DoneToday
          trip={trip}
          finished={finishedToday.length ? Math.max(...finishedToday) : null}
          next={session}
          streakDays={days}
          onKeepGoing={() => setKeepGoing(true)}
        />
      ) : session ? (
        <SessionCard
          session={session}
          extra={canMerge && merge ? next : undefined}
          trip={trip}
          progress={progress}
          due={due}
          lightToday={lightToday}
          coreOnly={coreOnly || Boolean(canMerge && merge)}
          canMerge={Boolean(canMerge)}
          merge={merge}
          onMerge={setMerge}
          onTrip={onTrip}
          onLaunch={onLaunch}
          onDone={() => {
            setMerge(false)
            setKeepGoing(false)
          }}
        />
      ) : (
        <section className="trip-session">
          <h2>Plan complete — llongyfarchiadau!</h2>
          <p className="muted-line">
            Keep reviews ticking over and do a conversation a day until you fly.
          </p>
        </section>
      )}

      <HybridCard trip={trip} onTrip={onTrip} />

      <div className="trip-links">
        <button type="button" className="ghost-btn" onClick={onStory}>
          Your story & questions
        </button>
        <button type="button" className="ghost-btn" onClick={() => setShowGo((v) => !v)}>
          Before you go
        </button>
        <button type="button" className="ghost-btn" onClick={() => setShowWhy((v) => !v)}>
          How this plan works
        </button>
        <button type="button" className="ghost-btn" onClick={() => setShowSetup((v) => !v)}>
          Trip settings
        </button>
      </div>

      {showSetup && (
        <TripSetup
          trip={trip}
          onTrip={onTrip}
          onClose={() => setShowSetup(false)}
        />
      )}
      {showWhy && <PlanWhy />}
      {showGo && <BeforeYouGo />}

      <WeekMap trip={trip} current={cur} onReopen={(n) => onTrip(reopenSession(trip, n))} />

      <section className="trip-practice">
        <h2>Extra conversation practice</h2>
        <p className="muted-line">
          Any partner, any time. Repeating the same conversation over a few days is
          good for you — it’s how fluency builds.
        </p>
        {!showPractice ? (
          <button type="button" className="ghost-btn" onClick={() => setShowPractice(true)}>
            Choose a partner ({SCENARIOS.length - 1})
          </button>
        ) : (
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
        )}
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

/** "After dinner" and "dinner" both read as "after dinner". */
function cueText(cue: string): string {
  return cue.trim().replace(/^after\s+/i, '')
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
  coreOnly,
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
  /** After a break (or in a catch-up), fold the optional blocks away. */
  coreOnly: boolean
  canMerge: boolean
  merge: boolean
  onMerge: (on: boolean) => void
  onTrip: (t: TripState) => void
  onLaunch: (l: TripLaunch) => void
  onDone: () => void
}) {
  const wk = weekPlan(session.week)
  const n = session.n
  const [showOptional, setShowOptional] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  /** Off-app tasks open here and only tick when you say they're done. */
  const [task, setTask] = useState<'outreach' | 'human' | null>(null)
  const ticked = new Set(trip.blocks[String(n)] ?? [])
  const phraseIds = [...session.phraseIds, ...(extra?.phraseIds ?? [])]
  const isDone = (id: BlockId) => {
    if (id === 'phrases') return phrasesSeen(progress, phraseIds)
    if (id === 'review') return ticked.has('review') || due === 0
    return ticked.has(id)
  }
  // Nothing due and nothing done: the review block is just noise.
  const blocks = session.blocks.filter(
    (b) => !(b.id === 'review' && due === 0 && !ticked.has('review')),
  )
  const core = blocks.filter((b) => b.core)
  const coreLeft = core.filter((b) => !isDone(b.id))
  const coreDone = coreLeft.length === 0
  const minutes = sessionMinutes(session)
  const foldOptional = coreOnly && !showOptional
  const visible = foldOptional ? core : blocks
  const nextBlock =
    coreLeft[0] ?? (foldOptional ? undefined : blocks.find((b) => !isDone(b.id)))
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
      case 'story':
        return onLaunch({ kind: 'story', n })
      case 'clip':
        if (session.clip) onLaunch({ kind: 'clip', n, clip: session.clip })
        return
      case 'human':
      case 'outreach':
        return setTask(task === id ? null : id)
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
        if (session.pattern === 'mix') return UNIT_SKILLS.mix ?? ''
        if (!pattern) return ''
        return `${pattern.id === 'alphabet' ? 'Yr Wyddor' : `Unit ${pattern.id}`} · ${UNIT_SKILLS[pattern.id] ?? pattern.titleCy}`
      case 'story':
        return 'Your intro and the quick-fire questions, out loud'
      case 'clip': {
        const c = session.clip ? getClip(session.clip) : undefined
        return c ? `${c.title} — ${c.who}` : ''
      }
      case 'human':
        return 'A tutor, an online Welsh chat group, a video call with Y Wladfa — or voice notes. Tap when done.'
      case 'outreach':
        return n === OUTREACH_CONFIRM
          ? 'Confirm who you’ll meet, where, when, and that filming is OK.'
          : n === OUTREACH_CHASE
            ? 'No reply yet? Send the message to 3 more people. Aim for 3 confirmed by week 5.'
            : 'Send the ready-made message to 3 people or groups in Y Wladfa.'
    }
  }

  function finish() {
    onTrip(finishSession(trip, extra ? [n, extra.n] : [n]))
    onDone()
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
        <span className="trip-minutes">
          ~{foldOptional ? minutes.core : minutes.all} min
          {!foldOptional && minutes.all > minutes.core && (
            <span className="trip-minutes-core">{minutes.core} core</span>
          )}
        </span>
      </div>

      {session.repeatsWeek && (
        <p className="trip-note">
          Last week’s checkpoint was hard, so today you repeat a week {session.repeatsWeek}{' '}
          conversation first. Repeating a task is how fluency catches up.
        </p>
      )}

      <div className="trip-start-row">
        {nextBlock ? (
          <button
            type="button"
            className="primary-btn trip-start"
            onClick={() => launch(nextBlock.id)}
          >
            {isDone(nextBlock.id) || ticked.size > 0 ? 'Next' : 'Start'} ·{' '}
            {BLOCK_META[nextBlock.id].title} {nextBlock.minutes}′
            {!nextBlock.core && ' (optional)'}
          </button>
        ) : (
          coreDone && (
            <button type="button" className="primary-btn trip-start" onClick={finish}>
              Finish session ✓
            </button>
          )
        )}
        {!lightToday && ticked.size > 0 && !coreDone && (
          <span className="muted-line">Out of time? Stop here — today already counts.</span>
        )}
        {!lightToday && ticked.size === 0 && (
          <button
            type="button"
            className="secondary-btn"
            onClick={() => onLaunch({ kind: 'retell', n, short: true })}
            title="A 2-minute retell keeps the habit alive; the full session waits for tomorrow"
          >
            Busy day: 2-minute retell
          </button>
        )}
      </div>

      {task && (
        <div className="trip-task">
          {task === 'outreach' ? (
            <CopyMessage
              title={n === OUTREACH_CONFIRM ? 'Confirm your meetings' : 'Send this to 3 people or groups'}
              text={n === OUTREACH_CONFIRM ? OUTREACH_CHECK : OUTREACH_FIRST}
            />
          ) : (
            <p className="muted-line">
              20 minutes with a real person: a Welsh tutor online, an online Welsh chat
              group, a video call with one of your Y Wladfa contacts — or, if none of that
              works this week, a few voice notes in Welsh with one of them.
            </p>
          )}
          <div className="dialogue-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                onTrip(toggleBlock(trip, n, task, true))
                setTask(null)
              }}
            >
              {task === 'outreach' ? 'I’ve sent them ✓' : 'Done ✓'}
            </button>
            <button type="button" className="ghost-btn" onClick={() => setTask(null)}>
              Later
            </button>
          </div>
        </div>
      )}

      {canMerge && (
        <label className="settings-check trip-merge">
          <input type="checkbox" checked={merge} onChange={(e) => onMerge(e.target.checked)} />
          <span>
            Catch-up: learn the next session’s phrases too, skip the optional blocks, and
            count both
          </span>
        </label>
      )}

      <ol className="trip-blocks">
        {visible.map((b) => {
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
                {showWhy && <span className="trip-block-why">{meta.why}</span>}
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
        {coreDone ? (
          nextBlock && (
            <button type="button" className="secondary-btn" onClick={finish}>
              Finish session ✓
            </button>
          )
        ) : (
          <span className="muted-line">
            {core.length - coreLeft.length} of {core.length} core blocks done
          </span>
        )}
        {foldOptional && blocks.length > core.length && (
          <button type="button" className="ghost-btn" onClick={() => setShowOptional(true)}>
            Show optional (+{minutes.all - minutes.core} min)
          </button>
        )}
        <button type="button" className="ghost-btn small" onClick={() => setShowWhy((v) => !v)}>
          {showWhy ? 'Hide why' : 'Why these blocks?'}
        </button>
      </div>
    </section>
  )
}

function DoneToday({
  trip,
  finished,
  next,
  streakDays,
  onKeepGoing,
}: {
  trip: TripState
  /** Session finished today, or null on a busy day. */
  finished: number | null
  next?: PlanSession
  streakDays: number
  onKeepGoing: () => void
}) {
  const wk = weekPlan(getSession(finished ?? next?.n ?? 1)?.week ?? 1)
  const toCheckpoint = next ? next.week * 6 - next.n : 0
  return (
    <section className="trip-session trip-done">
      <p className="book-kicker">
        {finished ? `Session ${finished} done` : 'Busy day done'}
        {streakDays > 1 ? ` · ${streakDays}-day streak` : ''}
      </p>
      <h2>{finished ? 'Gwych! Da iawn.' : 'Habit kept. Da iawn.'}</h2>
      <p className="muted-line">
        {finished
          ? 'This week you’re working towards:'
          : 'Two minutes counts. The full session is waiting for you. This week’s goals:'}
      </p>
      <ul className="trip-week-cando">
        {wk.canDo.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      {next && (
        <p className="trip-cue">
          {trip.cue ? `Tomorrow, after ${cueText(trip.cue)}` : 'Next time'}: session {next.n} —{' '}
          {next.checkpoint ? 'checkpoint day ★' : weekPlan(next.week).title.toLowerCase()}
          {!next.checkpoint && toCheckpoint > 0
            ? ` (${toCheckpoint} more to the week ${next.week} checkpoint ★)`
            : ''}
          . Sleep is when today’s phrases settle in.
        </p>
      )}
      {next && (
        <button type="button" className="ghost-btn" onClick={onKeepGoing}>
          {finished ? 'Keep going (optional)' : 'Do the full session anyway'}
        </button>
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
  const [all, setAll] = useState(false)
  const currentWeek = current ? (getSession(current)?.week ?? 1) : WEEK_PLANS.length
  const weeks = all ? WEEK_PLANS : WEEK_PLANS.filter((wk) => wk.week === currentWeek)
  return (
    <section className="trip-weeks">
      <div className="talk-plan-head">
        <h2>{all ? 'The eight weeks' : `This week · ${currentWeek} of 8`}</h2>
        <button type="button" className="ghost-btn small" onClick={() => setAll((v) => !v)}>
          {all ? 'Just this week' : 'Show all weeks'}
        </button>
      </div>
      <ol>
        {weeks.map((wk) => {
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
                    Checkpoint {Math.round(score.overall * 10) / 10}/5
                    {score.level ? ` · ${score.level}` : ''}
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
  const [time, setTime] = useState('20:00')
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
        <button type="button" className="ghost-btn" onClick={onClose}>
          Not now
        </button>
        <button
          type="button"
          className="secondary-btn"
          onClick={() => downloadReminder(time, date || trip.tripDate, cue)}
        >
          Add a daily reminder to my calendar
        </button>
        <input
          type="time"
          aria-label="Reminder time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        {!trip.updatedAt && (
          <span className="muted-line">
            Then press Start on session 1 above. Today also includes messaging a few
            people in Y Wladfa, so you have someone to talk to by week 2.
          </span>
        )}
      </div>
    </section>
  )
}

/** A daily calendar event at cue time until the flight (an .ics file works on any phone). */
function downloadReminder(time: string, until: string, cue: string) {
  const [hh = '20', mm = '00'] = time.split(':')
  const today = localCalendarDay().replaceAll('-', '')
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Welsh Flashcards//Patagonia plan//EN',
    'BEGIN:VEVENT',
    `UID:patagonia-plan-${today}@welsh-flashcards`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${today}T${hh}${mm}00`,
    'DURATION:PT1H',
    `RRULE:FREQ=DAILY;UNTIL=${until.replaceAll('-', '')}T235959`,
    'SUMMARY:Cymraeg · Patagonia session',
    `DESCRIPTION:${cue ? `After ${cueText(cue)}: ` : ''}open the app for today’s session (busy day? the 2-minute retell).`,
    'BEGIN:VALARM',
    'TRIGGER:PT0M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Cymraeg time',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'cymraeg-patagonia.ics'
  a.click()
  URL.revokeObjectURL(url)
}

/** Ready-made outreach, in Welsh and Spanish (most people read Spanish faster). */
const OUTREACH_FIRST = `Helo! Fy enw i ydy … Dw i’n dod o India a dw i’n dysgu Cymraeg. Dw i’n dod i’r Wladfa ym mis Ionawr i wneud fideo am y Gymraeg yno. Fyddech chi’n hapus i gael sgwrs fach yn Gymraeg efo fi — ac efallai ymddangos yn y fideo? Diolch yn fawr!

¡Hola! Me llamo … Soy de la India y estoy aprendiendo galés. Viajo a Chubut en enero para hacer un video sobre el galés en la Patagonia. ¿Le gustaría charlar un rato en galés conmigo, y quizás aparecer en el video? ¡Muchas gracias!`

const OUTREACH_CHECK = `Helo eto! Dw i’n cyrraedd … ar … Ydy … yn dal yn iawn i chi? Ble hoffech chi gwrdd? Ydy hi’n iawn i mi ffilmio? Diolch!

¡Hola de nuevo! Llego a … el … ¿Le sigue viniendo bien el …? ¿Dónde le gustaría que nos encontremos? ¿Está bien si filmo? ¡Gracias!`

/** A ready-made message with a copy button. */
function CopyMessage({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="trip-copy">
      <div className="talk-plan-head">
        <strong>{title}</strong>
        <button
          type="button"
          className="ghost-btn small"
          onClick={() => {
            void navigator.clipboard?.writeText(text).then(() => setCopied(true))
          }}
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <p className="trip-copy-text">{text}</p>
    </div>
  )
}

function PlanWhy() {
  return (
    <section className="trip-why">
      <h2>How this plan works</h2>
      <ul>
        <li>
          <strong>Sessions, not dates.</strong> 48 sessions over ~60 days leaves about one
          free day a week. Miss a day and the plan simply waits; nothing piles up. One rest
          day never breaks your streak. If the flight gets close and you’re behind, the plan
          jumps ahead so the interview and rehearsal weeks always happen.
        </li>
        <li>
          <strong>Reviews first, new phrases second.</strong> Retrieval practice with
          spacing is the most robust memory effect in learning research (Rowland 2014;
          Cepeda et al. 2008). About 8–12 new phrases a session; week 8 only adds Patagonian
          words to recognise.
        </li>
        <li>
          <strong>Chunks first, grammar every day.</strong> Whole phrases like “Dw i’n dod
          o…” get you talking fastest (Boers et al. 2006), but B1 means building your own
          sentences: stories in the past, plans, opinions, “if I…”. So every session has a
          10-minute grammar block that walks through Colloquial Welsh units 1–15 in order
          (week 8 mixes the B1 core), and you <em>say</em> six sentences that need each
          pattern, with feedback. Explicit teaching plus practice that makes you produce the
          form is what works for grammar (Spada & Tomita 2010).
        </li>
        <li>
          <strong>Hybrid: the app is half of it.</strong> An hour a day in the app is about
          50 hours by January — not enough for B1 on its own. The rest comes from outside:
          an audio course on the commute, Welsh podcasts while you cook, two online lessons a
          week with a tutor, and real conversations. Log them on the dashboard; the plan
          adds up to about 2½ hours a day, most of it in time you’d otherwise lose. Tap
          each row on the dashboard for what to use.
        </li>
        <li>
          <strong>Listen without the text.</strong> Understanding people is harder than
          speaking your prepared lines, so listening is core from week 3, and from then on
          your conversation partner’s words are audio first, text only if you need it. From
          week 2, twice a week, you watch real people from Y Wladfa at real speed.
        </li>
        <li>
          <strong>Talk every session.</strong> Conversation with feedback has large, lasting
          effects (Mackey & Goo 2007). Your partner nudges you to fix errors yourself first,
          which works better than just being corrected (Lyster & Saito 2010).
        </li>
        <li>
          <strong>Plan, then repeat.</strong> A minute of planning improves fluency, and the
          same conversation repeated over a few days builds it (task-repetition research).
          The 4/3/2 retell (Nation; de Jong & Perfetti 2011) does the same for monologue. A
          tough checkpoint means the next week starts by repeating, not racing on.
        </li>
        <li>
          <strong>Real people, weekly.</strong> From week 3 each checkpoint day suggests a
          real conversation: an online tutor, a Welsh chat group, or a video call with your
          Y Wladfa contacts. An AI is patient; people interrupt, speed up and switch to
          Spanish.
        </li>
        <li>
          <strong>Habits.</strong> Habits take about two months to form, and missing a
          single day doesn’t hurt (Lally et al. 2010). The 2-minute busy-day retell keeps
          the streak; try not to miss two in a row.
        </li>
      </ul>
      <h3>Honest expectations</h3>
      <p>
        B1 from zero usually takes about 350–400 hours of study (Cambridge’s estimate;
        Welsh adult courses budget about 360 hours to reach Canolradd, which is B1). Two
        months can’t give anyone that, so nobody can promise you a solid B1 by January.
      </p>
      <ul>
        <li>App only (about 45–50 h): A1+, A2 on your own topics.</li>
        <li>
          Full hybrid plan (about 130–145 h): A2, strong on your topics, with B1 skills —
          telling a story in the past, giving reasons, plans and “if I…” — practised every
          week.
        </li>
        <li>
          Push the outside hours to about 3 hours a day in total (about 180 h): A2+, and B1
          speaking on familiar topics becomes realistic.
        </li>
      </ul>
      <p>
        Every weekly checkpoint gives a strict CEFR level for what you actually did in that
        conversation, so you’ll see whether B1 is happening rather than guessing. Your
        understanding will lag behind your speaking; in interviews you’ll catch part of each
        answer live and the rest from the footage later. After the trip, the same path
        continues: Canolradd courses take you to a full B1.
      </p>
      <p>
        That’s fine, and it’s what makes the video honest. The tactics: ask narrow
        questions, check what you heard (“Felly…?”), ask for an example (“Allwch chi roi
        enghraifft?”), ask for short answers, and film everything.
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
          October, the youth eisteddfod in September, Trevelin’s usually in April or May, and
          Landing Day (Gŵyl y Glaniad) on 28 July.
        </li>
        <li>
          The Welsh Language Project (Cynllun yr Iaith Gymraeg) has one or two teachers from
          Wales a year (about March–December, so they’ll have left by January) and 20+ local
          tutors; classes stop for the summer. Schools are on holiday from mid-December to late February, and many
          families go to the coast or the mountains in January.
        </li>
        <li>
          Write ahead using the messages below. Most people answer faster on WhatsApp or
          Facebook than email. Aim for three confirmed meetings by week 5; if nobody replies
          by week 3, message three more. Who to contact:
          <ul>
            <li>Menter Patagonia (one for the valley, one for the Andes)</li>
            <li>Asociación San David (Trelew) and the Welsh associations in Gaiman, Trevelin,
              Esquel and Puerto Madryn</li>
            <li>Schools: Ysgol yr Hendre (Trelew), Ysgol Gymraeg yr Andes (Esquel), Ysgol y
              Cwm (Trevelin), the bilingual school in Gaiman — and Coleg Camwy</li>
            <li>The Gaiman museum, the tea houses, the chapels, and the paper Y Drafod</li>
            <li>Cymdeithas Cymru-Ariannin in Wales, who can introduce you</li>
          </ul>
        </li>
        <li>
          Ask who would be happy to chat or be filmed, and try a video call with one of them
          before you fly — it counts as your real-person practice. If you arrive with
          nobody lined up: go on a weekday, start at the tea houses and the museum, and ask
          everyone “Pwy arall ddylwn i siarad â nhw?” — that’s how you find speakers.
        </li>
      </ul>
      <CopyMessage title="First message (session 1)" text={OUTREACH_FIRST} />
      <CopyMessage title="Confirming (week 5)" text={OUTREACH_CHECK} />
      <h3>When they switch to Spanish</h3>
      <ul>
        <li>
          It will happen a lot: staff greet you in Spanish, heritage speakers understand
          Welsh but answer in Spanish, and many people switch the moment you hesitate.
          Visitors from Wales and some young people switch to English instead — the same
          polite request works: “Mae’n well gen i siarad Cymraeg, os ydy hynny’n iawn.”
        </li>
        <li>
          Ask kindly: “Ga i ymarfer fy Nghymraeg efo chi?” and “Yn araf, os gwelwch yn dda.”
          Practise this with the “switch to Spanish” partner. Learn enough Spanish to
          explain your project and ask for consent.
        </li>
      </ul>
      <h3>Spanish survival kit</h3>
      <ul>
        <li>
          “Hablo un poco de galés, pero muy poco español.” — I speak a little Welsh but very
          little Spanish.
        </li>
        <li>
          “Estoy haciendo un video sobre el galés en la Patagonia.” — I’m making a video
          about Welsh in Patagonia.
        </li>
        <li>
          “¿Puedo filmarle? ¿Le parece bien si lo publico en internet?” — May I film you? Is
          it OK if I publish it online?
        </li>
        <li>
          “¿Alguien aquí habla galés?” — Does anyone here speak Welsh? · “¿Conoce a alguien
          que hable galés?” — Do you know anyone who speaks Welsh? · “Le mando el video.” —
          I’ll send you the video.
        </li>
      </ul>
      <h3>Getting around</h3>
      <ul>
        <li>
          Check entry rules for an Indian passport with the Argentine consulate before you
          book. Since 2025 some travellers holding a valid US visa are exempt; otherwise you
          need a visa, which takes time.
        </li>
        <li>
          From India it’s 30+ hours: an international flight into Ezeiza (Buenos Aires), a
          transfer across the city to Aeroparque, then a domestic flight to Trelew.
        </li>
        <li>
          The lower valley (Trelew, Gaiman, Dolavon) and Cwm Hyfryd (Trevelin, Esquel) are
          about 600 km apart — roughly 9 hours by bus, often overnight, or fly into Esquel.
          Plan them as two legs.
        </li>
        <li>
          January is peak holiday season in Argentina: book rooms in Gaiman and Trevelin
          early. Bring cash and check the current exchange situation before you go — it
          changes fast.
        </li>
        <li>
          Many places close for siesta (about 13:00–17:00); tea houses open mid-afternoon.
        </li>
      </ul>
      <h3>Places</h3>
      <ul>
        <li>
          <strong>Gaiman</strong> — tea houses (Plas y Coed, Tŷ Te Caerdydd, Tŷ Gwyn), the
          museum in the old railway station, Capel Bethel, Coleg Camwy, the bilingual
          school.
        </li>
        <li>
          <strong>Trelew</strong> — Capel Moriah (1880), Capel y Tabernacl and the town’s
          Welsh chapel route, Ysgol yr Hendre, Asociación San David.
        </li>
        <li>
          <strong>Puerto Madryn</strong> — where the Mimosa landed on 28 July 1865, and
          Punta Cuevas, where the settlers first sheltered. Fewer Welsh speakers today, but
          there is an active Welsh association.
        </li>
        <li>
          <strong>Dolavon</strong> — the small valley town with the old flour mill and
          irrigation canals the settlers dug.
        </li>
        <li>
          <strong>Trevelin & Esquel</strong> (Cwm Hyfryd) — Andes farms, Ysgol y Cwm (the
          bilingual school), Trevelin’s own tea houses, older first-language speakers, the
          story of the horse Malacara, and the 1902 vote that kept the valley in Argentina.
        </li>
      </ul>
      <h3>Filming</h3>
      <ul>
        <li>
          Argentine law requires consent to record and publish someone’s image and voice
          (Código Civil y Comercial, art. 53). Get a short recorded or written “yes”: name,
          that it’s for a public online video, and that they can say no at any time.
          “¿Me da permiso para filmar su imagen y su voz para un video público en internet?
          Puede decir que no en cualquier momento.”
        </li>
        <li>
          Children need a parent’s consent. In chapels ask the minister or elders first and
          don’t film during worship. In tea houses ask the owner before filming inside.
        </li>
        <li>
          Patagonian wind ruins audio: bring a lav mic with a windscreen. Midday January sun
          is harsh, so film late afternoon.
        </li>
        <li>
          Promise to send people the finished video, with Spanish subtitles so they can
          share it. Ask a local helper (or the speakers themselves) to check your
          translations and subtitles before you publish.
        </li>
        <li>
          B-roll: tea being poured, chapels, bilingual signs, the Moriah cemetery, the river
          and poplars. January light is softest from about 20:00 to sunset around 21:00.
        </li>
        <li>
          Film your weekly checkpoints. Week 1 next to week 8 tells the “two months” story
          better than anything you can say.
        </li>
      </ul>
      <h3>Filming the interview</h3>
      <ul>
        <li>
          Chat off camera first. Ask people to start their answer with your question (“Allwch
          chi ddechrau’ch ateb gyda’r cwestiwn?”) so each clip stands alone.
        </li>
        <li>
          Answers in Spanish are fine — subtitle them. For the main interview, bring a
          bilingual helper so your follow-up questions can go beyond what you caught.
        </li>
        <li>
          Stay quiet while they talk (no “ie, ie” over their words), and keep a short shot
          list: the greeting, the interview, a walk, tea, a goodbye.
        </li>
      </ul>
      <h3>Handle with care</h3>
      <ul>
        <li>
          People here are Argentine with Welsh heritage. Don’t call them English or British,
          and steer clear of the Malvinas/Falklands.
        </li>
        <li>
          The settlers’ friendship with the Tehuelche is a cherished local story; Indigenous
          communities and historians tell a more critical one about land. Don’t raise it on
          camera unless the person you’re talking to does, and then listen more than you
          talk.
        </li>
        <li>
          Spanish is everyone’s everyday language and nobody knows exactly how many speak
          Welsh (estimates range from about 1,500 to 6,000; about 1,100 were in classes in
          2024).
          Expect older “heritage” speakers and younger learners to sound different.
        </li>
        <li>
          Many chapels hold Welsh or bilingual services only now and then; check before
          planning a Sunday around one.
        </li>
        <li>
          Many older and heritage speakers feel their Welsh “isn’t proper” next to Wales
          Welsh. Never suggest Patagonian forms are wrong, accept a Welsh–Spanish
          conversation if they’re shy, and don’t film someone struggling without their OK.
        </li>
      </ul>
      <h3>Your India connection</h3>
      <p>
        Welsh missionaries worked in the Khasi Hills of north-east India from 1841. One of
        them, Thomas Jones, gave Khasi the Roman spelling it still uses, with Welsh-style
        rules (it had been written in Bengali script before). Locals will love the
        connection — tell it simply, as the missionary legacy is debated in Meghalaya.
      </p>
    </section>
  )
}
