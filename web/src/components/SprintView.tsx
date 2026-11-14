import { useMemo, useState } from 'react'
import { getApiKey } from '../lib/gemini'
import {
  blockDone,
  calendarDay,
  currentSprintDay,
  dayDone,
  daysToFinish,
  isCatchUpDay,
  knownFromFlashcards,
  learnedSprintIds,
  SPRINT_DAY_CONTENT,
  SPRINT_VIDEOS,
  SPRINT_WORDS,
  videosReadyOn,
  markBlock,
  SPRINT_DAYS,
  sprintDay,
  unseenWordIds,
  videosFor,
  wordsByDay,
  type CyEn,
  type SprintBlock,
  type SprintDay,
  type SprintState,
} from '../lib/sprint'
import { playWelshSequence, speakWelsh } from '../lib/tts'
import type { DirectionMode, ProgressMap } from '../lib/types'

const STEPS: { id: SprintBlock; cy: string; en: string; minutes: number }[] = [
  { id: 'words', cy: 'Geiriau', en: 'Words', minutes: 30 },
  { id: 'pattern', cy: 'Patrwm', en: 'Build sentences', minutes: 10 },
  { id: 'story', cy: 'Stori', en: 'Read & listen', minutes: 10 },
  { id: 'speak', cy: 'Siarad', en: 'Speak & watch', minutes: 10 },
]

interface Props {
  state: SprintState
  onState: (s: SprintState) => void
  progress: ProgressMap
  direction: DirectionMode
  apiKeyStored: string
  /** Learn today's new words (with today's reviews). */
  onWords: (day: number, ids: string[]) => void
  /** Reviews only (catch-up days, or once the day's words are in). */
  onReview: (day: number) => void
  /** A free conversation with the AI partner. */
  onTalk: () => void
}

/**
 * The 50-day sprint, one screen: today's four steps in order, one tap each.
 */
export function SprintView(props: Props) {
  const { state, onState, progress, direction } = props
  const current = currentSprintDay(state, progress, direction)
  const [viewDay, setViewDay] = useState(current)
  const [open, setOpen] = useState<SprintBlock | 'lists' | null>(null)
  const content = sprintDay(viewDay)
  const apiKey = getApiKey(props.apiKeyStored)

  const cal = calendarDay(state)
  const gap = current - cal
  const left = Math.max(0, daysToFinish(state))
  const finishLabel = new Date(`${state.finishBy}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const finish = (block: SprintBlock) => {
    onState(markBlock(state, viewDay, block))
    setOpen(null)
  }

  if (!content) {
    return (
      <section className="sprint">
        <p className="muted-line">The sprint content isn’t built yet.</p>
      </section>
    )
  }

  if (open === 'lists') {
    return (
      <ListsPanel
        learned={learnedSprintIds(progress, direction)}
        current={current}
        apiKey={apiKey}
        onBack={() => setOpen(null)}
        onPickDay={(d) => {
          setViewDay(d)
          setOpen(null)
        }}
      />
    )
  }
  if (open === 'pattern') {
    return (
      <PatternPanel day={content} apiKey={apiKey} onBack={() => setOpen(null)} onDone={() => finish('pattern')} />
    )
  }
  if (open === 'story') {
    return <StoryPanel day={content} apiKey={apiKey} onBack={() => setOpen(null)} onDone={() => finish('story')} />
  }
  if (open === 'speak') {
    return (
      <SpeakPanel
        day={content}
        apiKey={apiKey}
        onBack={() => setOpen(null)}
        onDone={() => finish('speak')}
        onTalk={props.onTalk}
      />
    )
  }

  const catchUp = isCatchUpDay(viewDay)
  const unseen = unseenWordIds(progress, viewDay, direction)
  const alreadyKnown = catchUp ? 0 : knownFromFlashcards(progress, viewDay, direction)
  const nextStep = STEPS.find((s) => !blockDone(state, viewDay, s.id, progress, direction))

  const start = (step: SprintBlock) => {
    if (step === 'words') {
      if (!catchUp && unseen.length) props.onWords(viewDay, unseen)
      else props.onReview(viewDay)
      return
    }
    setOpen(step)
  }

  return (
    <section className="sprint">
      <header className="sprint-head">
        <p className="sprint-kicker">
          Diwrnod {viewDay} / {SPRINT_DAYS}
          {viewDay !== current && (
            <button type="button" className="talk-link" onClick={() => setViewDay(current)}>
              back to today
            </button>
          )}
        </p>
        <h1 className="sprint-title">{content.title}</h1>
        <p className="sprint-why">{content.why}</p>
        <div className="sprint-bar" aria-hidden>
          <span style={{ width: `${(Math.min(current - 1, SPRINT_DAYS) / SPRINT_DAYS) * 100}%` }} />
        </div>
        <p className="muted-line">
          {wordsByDay(current - 1)} words in · {left} day{left === 1 ? '' : 's'} to {finishLabel} ·{' '}
          {gap >= 0
            ? gap > 0
              ? `${gap} day${gap > 1 ? 's' : ''} ahead`
              : 'on track'
            : `${-gap} day${gap < -1 ? 's' : ''} behind: the next catch-up day absorbs it`}
        </p>
      </header>

      {viewDay > current ? (
        <div className="sprint-preview">
          <p className="sprint-preview-note">
            Preview: this day opens once you finish day {current}
            {viewDay - current > 1 ? ` and the ${viewDay - current - 1} after it` : ''}.
          </p>
          <DayPlan day={content} apiKey={apiKey} />
        </div>
      ) : (
      <ol className="sprint-steps">
        {STEPS.map((s, i) => {
          const done = blockDone(state, viewDay, s.id, progress, direction)
          const isNext = s === nextStep
          const detail =
            s.id === 'words'
              ? catchUp
                ? 'Catch-up day: reviews only'
                : unseen.length
                  ? `${unseen.length} new words + today’s reviews${alreadyKnown ? ` (${alreadyKnown} more you know from flashcards)` : ''}`
                  : alreadyKnown
                    ? `All in: ${alreadyKnown} you knew from flashcards. Tap for reviews.`
                    : 'All in. Tap for reviews.'
              : s.id === 'pattern'
                ? `${content.build.length} sentences to build`
                : s.id === 'story'
                  ? content.story.title
                  : catchUp
                    ? 'Say it out loud, then talk with a partner'
                    : 'Say it out loud, then watch Easy Welsh'
          return (
            <li key={s.id}>
              <button
                type="button"
                className={`sprint-step ${done ? 'done' : ''} ${isNext ? 'next' : ''}`}
                onClick={() => start(s.id)}
              >
                <span className="sprint-step-n" aria-hidden>
                  {done ? '✓' : i + 1}
                </span>
                <span className="sprint-step-body">
                  <span className="sprint-step-title">
                    <span className="cy">{s.cy}</span> · {s.en}
                  </span>
                  <span className="sprint-step-detail">{detail}</span>
                </span>
                <span className="sprint-step-min">{s.minutes}′</span>
              </button>
            </li>
          )
        })}
      </ol>
      )}

      {viewDay <= current && (
        <details className="sprint-plan">
          <summary>What day {viewDay} teaches</summary>
          <DayPlan day={content} apiKey={apiKey} />
        </details>
      )}

      {dayDone(state, viewDay, progress, direction) && viewDay === current - 1 && (
        <p className="sprint-done">Da iawn! Day {viewDay} done. Tomorrow: {sprintDay(current)?.title}</p>
      )}

      <DayStrip
        current={current}
        viewDay={viewDay}
        isDone={(d) => dayDone(state, d, progress, direction)}
        onPick={setViewDay}
      />
      <button type="button" className="secondary-btn sprint-lists-btn" onClick={() => setOpen('lists')}>
        All words, grammar and videos
      </button>
    </section>
  )
}

function DayStrip({
  current,
  viewDay,
  isDone,
  onPick,
}: {
  current: number
  viewDay: number
  isDone: (d: number) => boolean
  onPick: (d: number) => void
}) {
  return (
    <div className="sprint-strip" role="group" aria-label="Sprint days">
      {Array.from({ length: SPRINT_DAYS }, (_, i) => i + 1).map((d) => (
        <button
          key={d}
          type="button"
          className={`sprint-dot ${isDone(d) ? 'done' : ''} ${d === viewDay ? 'on' : ''} ${isCatchUpDay(d) ? 'catch' : ''} ${d > current ? 'later' : ''}`}
          onClick={() => onPick(d)}
          title={`Day ${d}${isCatchUpDay(d) ? ' (catch-up)' : ''}${d > current ? ' (preview)' : ''}`}
        >
          {d}
        </button>
      ))}
    </div>
  )
}

// ---------- What a day teaches, and the full lists ----------

const wordsOn = (day: number) => SPRINT_WORDS.filter((w) => w.day === day)

function WordRows({ words, learned }: { words: typeof SPRINT_WORDS; learned?: Set<string> }) {
  return (
    <ul className="sprint-words">
      {words.map((w) => (
        <li key={w.id} className={learned?.has(w.id) ? 'learned' : ''}>
          <span className="cy">{w.cy}</span>
          <span className="sprint-en">
            {w.en}
            {w.patagonia && <span className="sprint-tag">Y Wladfa</span>}
          </span>
        </li>
      ))}
    </ul>
  )
}

function DayPlan({ day, apiKey }: { day: SprintDay; apiKey: string | null }) {
  const words = wordsOn(day.day)
  const videos = videosReadyOn(day.day)
  return (
    <div className="sprint-plan-body">
      <h3 className="sprint-sub">Patrwm · {day.title}</h3>
      <p className="sprint-explain">{day.grammar.explain}</p>
      <div className="sprint-lines">
        {day.grammar.examples.slice(0, 4).map((e) => (
          <Line key={e.cy} line={e} apiKey={apiKey} />
        ))}
      </div>
      <h3 className="sprint-sub">{words.length ? `${words.length} new words` : 'No new words: catch-up day'}</h3>
      {words.length > 0 && <WordRows words={words} />}
      <h3 className="sprint-sub">Stori · {day.story.title}</h3>
      {videos.length > 0 && (
        <>
          <h3 className="sprint-sub">Ready to watch</h3>
          <ul className="sprint-words">
            {videos.map((v) => (
              <li key={v.id}>
                <span className="cy">{v.series}</span>
                <span className="sprint-en">{v.title}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

type ListTab = 'words' | 'grammar' | 'videos'
type WordFilter = 'all' | 'patagonia' | 'verbs' | 'phrases' | 'todo'

const WORD_FILTERS: { id: WordFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'patagonia', label: 'Y Wladfa' },
  { id: 'verbs', label: 'Verbs' },
  { id: 'phrases', label: 'Phrases & forms' },
  { id: 'todo', label: 'Not learned yet' },
]

function ListsPanel({
  learned,
  current,
  apiKey,
  onBack,
  onPickDay,
}: {
  learned: Set<string>
  current: number
  apiKey: string | null
  onBack: () => void
  onPickDay: (day: number) => void
}) {
  const [tab, setTab] = useState<ListTab>('words')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<WordFilter>('all')
  const q = query.trim().toLowerCase()
  const words = SPRINT_WORDS.filter((w) => {
    if (filter === 'patagonia' && !w.patagonia) return false
    if (filter === 'verbs' && w.pos !== 'verb') return false
    if (filter === 'phrases' && w.pos !== 'phrase' && w.pos !== 'verb-form') return false
    if (filter === 'todo' && learned.has(w.id)) return false
    return !q || w.cy.toLowerCase().includes(q) || w.en.toLowerCase().includes(q)
  })
  const byDay = new Map<number, typeof SPRINT_WORDS>()
  for (const w of words) byDay.set(w.day, [...(byDay.get(w.day) ?? []), w])

  return (
    <section className="sprint sprint-panel">
      <PanelHead
        title="Everything in the sprint"
        sub={`${SPRINT_WORDS.length} words · ${learned.size} learned · 50 patterns · ${SPRINT_VIDEOS.length} videos`}
        onBack={onBack}
      />
      <div className="sprint-tabs" role="tablist">
        {(['words', 'grammar', 'videos'] as ListTab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? 'on' : ''}
            onClick={() => setTab(t)}
          >
            {t === 'words' ? 'Words' : t === 'grammar' ? 'Grammar' : 'Videos'}
          </button>
        ))}
      </div>

      {tab === 'words' && (
        <>
          <input
            className="sprint-search"
            type="search"
            placeholder="Search Welsh or English"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="sprint-options">
            {WORD_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`sprint-chip ${filter === f.id ? 'on' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="muted-line">{words.length} words. Learned ones are ticked.</p>
          {[...byDay.entries()].map(([day, list]) => (
            <div key={day} className="sprint-list-day">
              <button type="button" className="sprint-list-head" onClick={() => onPickDay(day)}>
                Day {day} · {SPRINT_DAY_CONTENT.find((d) => d.day === day)?.title}
                {day === current && <span className="sprint-tag">today</span>}
              </button>
              <WordRows words={list} learned={learned} />
            </div>
          ))}
        </>
      )}

      {tab === 'grammar' &&
        SPRINT_DAY_CONTENT.filter((d) => !d.catchUp).map((d) => (
          <details key={d.day} className="sprint-plan" open={d.day === current}>
            <summary>
              Day {d.day} · {d.title}
            </summary>
            <div className="sprint-plan-body">
              <p className="sprint-why">{d.why}</p>
              <p className="sprint-explain">{d.grammar.explain}</p>
              <div className="sprint-lines">
                {d.grammar.examples.map((e) => (
                  <Line key={e.cy} line={e} apiKey={apiKey} />
                ))}
              </div>
            </div>
          </details>
        ))}

      {tab === 'videos' && (
        <ul className="sprint-words sprint-videos">
          {[...SPRINT_VIDEOS]
            .sort((a, b) => (a.readyDay ?? 99) - (b.readyDay ?? 99))
            .map((v) => (
              <li key={v.id}>
                <span className="cy">
                  <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer">
                    {v.series}: {v.title}
                  </a>
                </span>
                <span className="sprint-en">
                  Ready day {v.readyDay ?? '—'} · {Math.round((v.coverage[current - 1] ?? 0) * 100)}% of its words after today,{' '}
                  {Math.round((v.coverage.at(-1) ?? 0) * 100)}% by day 50
                </span>
              </li>
            ))}
        </ul>
      )}
    </section>
  )
}

function PanelHead({ title, sub, onBack }: { title: string; sub?: string; onBack: () => void }) {
  return (
    <header className="sprint-panel-head">
      <button type="button" className="talk-link" onClick={onBack}>
        ← Today
      </button>
      <h2>{title}</h2>
      {sub && <p className="muted-line">{sub}</p>}
    </header>
  )
}

function Line({ line, apiKey, showEn = true }: { line: CyEn; apiKey: string | null; showEn?: boolean }) {
  const [en, setEn] = useState(showEn)
  return (
    <div className="sprint-line">
      <button
        type="button"
        className="sprint-play"
        aria-label="Play"
        onClick={() => void speakWelsh({ text: line.cy, apiKey }).catch(() => {})}
      >
        ▶
      </button>
      <button type="button" className="sprint-line-text" onClick={() => setEn((v) => !v)}>
        <span className="cy">{line.cy}</span>
        {en && <span className="sprint-en">{line.en}</span>}
      </button>
    </div>
  )
}

// ---------- Patrwm: the pattern, then build sentences ----------

const clean = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?;:"“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

function shuffle<T>(xs: T[], seed: number): T[] {
  const out = [...xs]
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

function PatternPanel({
  day,
  apiKey,
  onBack,
  onDone,
}: {
  day: SprintDay
  apiKey: string | null
  onBack: () => void
  onDone: () => void
}) {
  const [i, setI] = useState(-1)
  if (i < 0) {
    return (
      <section className="sprint sprint-panel">
        <PanelHead title={day.title} sub="Read it, hear the examples, then build your own." onBack={onBack} />
        <p className="sprint-explain">{day.grammar.explain}</p>
        <div className="sprint-lines">
          {day.grammar.examples.map((e) => (
            <Line key={e.cy} line={e} apiKey={apiKey} />
          ))}
        </div>
        <button type="button" className="primary-btn" onClick={() => setI(0)}>
          Build {day.build.length} sentences
        </button>
      </section>
    )
  }
  const item = day.build[i]
  if (!item) {
    return (
      <section className="sprint sprint-panel">
        <PanelHead title="Wedi gorffen!" onBack={onBack} />
        <p>All {day.build.length} built. Say each one out loud once more on the way out.</p>
        <div className="sprint-lines">
          {day.build.map((b) => (
            <Line key={b.cy} line={b} apiKey={apiKey} />
          ))}
        </div>
        <button type="button" className="primary-btn" onClick={onDone}>
          Done
        </button>
      </section>
    )
  }
  return (
    <section className="sprint sprint-panel">
      <PanelHead title={`Build it · ${i + 1} / ${day.build.length}`} sub={day.title} onBack={onBack} />
      <BuildItem key={i} item={item} seed={day.day * 31 + i} apiKey={apiKey} onNext={() => setI(i + 1)} />
    </section>
  )
}

function BuildItem({
  item,
  seed,
  apiKey,
  onNext,
}: {
  item: CyEn
  seed: number
  apiKey: string | null
  onNext: () => void
}) {
  const words = useMemo(() => item.cy.replace(/[.,!?;:"“”]/g, '').split(/\s+/).filter(Boolean), [item.cy])
  const tiles = useMemo(() => shuffle(words.map((w, k) => ({ w, k })), seed), [words, seed])
  const [picked, setPicked] = useState<number[]>([])
  const [shown, setShown] = useState(false)
  const built = picked.map((k) => tiles.find((t) => t.k === k)!.w).join(' ')
  const complete = picked.length === words.length
  const right = complete && clean(built) === clean(item.cy)

  const reveal = () => {
    setShown(true)
    void speakWelsh({ text: item.cy, apiKey }).catch(() => {})
  }

  return (
    <div className="sprint-build">
      <p className="sprint-build-en">{item.en}</p>
      <p className="muted-line">Say it out loud first. Then tap the words in order.</p>
      <p className={`sprint-build-answer ${complete ? (right ? 'right' : 'wrong') : ''}`}>{built || '…'}</p>
      <div className="sprint-tiles">
        {tiles.map((t) => (
          <button
            key={t.k}
            type="button"
            className="sprint-tile"
            disabled={picked.includes(t.k) || shown}
            onClick={() => {
              const next = [...picked, t.k]
              setPicked(next)
              if (next.length === words.length) reveal()
            }}
          >
            {t.w}
          </button>
        ))}
      </div>
      {shown ? (
        <>
          <Line line={item} apiKey={apiKey} />
          <p className="muted-line">{right ? 'Cywir! ' : complete ? 'Close: compare with the answer. ' : ''}</p>
          <button type="button" className="primary-btn" onClick={onNext}>
            Next
          </button>
        </>
      ) : (
        <div className="sprint-row">
          <button type="button" className="ghost-btn small" disabled={!picked.length} onClick={() => setPicked(picked.slice(0, -1))}>
            Undo
          </button>
          <button type="button" className="ghost-btn small" onClick={reveal}>
            Show answer
          </button>
        </div>
      )}
    </div>
  )
}

// ---------- Stori: an episode, then questions ----------

function StoryPanel({
  day,
  apiKey,
  onBack,
  onDone,
}: {
  day: SprintDay
  apiKey: string | null
  onBack: () => void
  onDone: () => void
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showEn, setShowEn] = useState(false)
  const qs = day.story.questions
  const answered = Object.keys(answers).length
  return (
    <section className="sprint sprint-panel">
      <PanelHead
        title={day.story.title}
        sub="Listen first. Then read along. Tap a line for its English."
        onBack={onBack}
      />
      <div className="sprint-row">
        <button
          type="button"
          className="primary-btn"
          onClick={() => void playWelshSequence(day.story.lines.map((l) => l.cy), apiKey)}
        >
          ▶ Play the episode
        </button>
        <button type="button" className="ghost-btn small" onClick={() => setShowEn((v) => !v)}>
          {showEn ? 'Hide English' : 'Show all English'}
        </button>
      </div>
      <div className="sprint-lines sprint-story" key={String(showEn)}>
        {day.story.lines.map((l, k) => (
          <Line key={k} line={l} apiKey={apiKey} showEn={showEn} />
        ))}
      </div>
      <h3 className="sprint-sub">Cwestiynau</h3>
      {qs.map((q, k) => (
        <div key={k} className="sprint-q">
          <p>
            <span className="cy">{q.q}</span> <span className="sprint-en">{q.en}</span>
          </p>
          <div className="sprint-options">
            {q.options.map((o, j) => {
              const chosen = answers[k] === j
              const state = answers[k] == null ? '' : j === q.answer ? 'right' : chosen ? 'wrong' : ''
              return (
                <button
                  key={j}
                  type="button"
                  className={`sprint-option ${state}`}
                  disabled={answers[k] != null}
                  onClick={() => setAnswers({ ...answers, [k]: j })}
                >
                  {o}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <button type="button" className="primary-btn" disabled={answered < qs.length} onClick={onDone}>
        {answered < qs.length ? `Answer the questions (${answered}/${qs.length})` : 'Done'}
      </button>
    </section>
  )
}

// ---------- Siarad: say it, then watch ----------

function SpeakPanel({
  day,
  apiKey,
  onBack,
  onDone,
  onTalk,
}: {
  day: SprintDay
  apiKey: string | null
  onBack: () => void
  onDone: () => void
  onTalk: () => void
}) {
  const [shown, setShown] = useState<number[]>([])
  const { now, next } = videosFor(day.day)
  const known = (v: { coverage: number[] }) => Math.round((v.coverage[day.day - 1] ?? 0) * 100)
  return (
    <section className="sprint sprint-panel">
      <PanelHead title="Siarad" sub="Say each one out loud before you look. Then say the model answer twice." onBack={onBack} />
      {day.speak.map((s, k) => (
        <div key={k} className="sprint-speak">
          <p className="sprint-build-en">{s.prompt}</p>
          {shown.includes(k) ? (
            <Line line={s} apiKey={apiKey} />
          ) : (
            <button
              type="button"
              className="ghost-btn small"
              onClick={() => {
                setShown([...shown, k])
                void speakWelsh({ text: s.cy, apiKey }).catch(() => {})
              }}
            >
              I said it · show a model answer
            </button>
          )}
        </div>
      ))}

      {isCatchUpDay(day.day) ? (
        <div className="sprint-video">
          <h3 className="sprint-sub">Sgwrs · Talk</h3>
          <p className="muted-line">Ten minutes with the conversation partner. Use this week’s patterns.</p>
          <button type="button" className="ghost-btn" onClick={onTalk}>
            Start a conversation
          </button>
        </div>
      ) : null}

      {now ? (
        <div className="sprint-video">
          <h3 className="sprint-sub">
            Gwylio · {now.series}: {now.title}
          </h3>
          <p className="muted-line">
            After today you'll know {known(now)}% of its words. Watch it with the Welsh subtitles; pause and repeat lines you nearly
            got. Rewatching is the point.
          </p>
          <div className="sprint-embed">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${now.id}?rel=0`}
              title={now.title}
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <a className="sprint-yt" href={`https://www.youtube.com/watch?v=${now.id}`} target="_blank" rel="noreferrer">
            Open on YouTube ↗
          </a>
        </div>
      ) : (
        <p className="muted-line">Your first Easy Welsh video unlocks once you know most of its words.</p>
      )}
      {next && (
        <p className="muted-line">
          Next up: {next.series} ({next.title}), {known(next)}% of its words known
          {next.readyDay ? `, ready around day ${next.readyDay}` : ''}.
        </p>
      )}
      <button type="button" className="primary-btn" disabled={shown.length < day.speak.length} onClick={onDone}>
        {shown.length < day.speak.length ? `Say all ${day.speak.length} first` : 'Done'}
      </button>
    </section>
  )
}
