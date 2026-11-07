import { useState } from 'react'
import {
  EXPECTED_QUESTIONS,
  JOBS,
  LANGUAGES,
  REASONS,
  buildIntro,
} from '../data/trip/story'
import { getApiKey } from '../lib/gemini'
import { playWelshSequence, speakWelsh } from '../lib/tts'
import type { IntroProfile } from '../lib/trip'
import { SpeakButton } from './SpeakButton'

/** Your introduction script and the questions locals will ask you. */
export function StoryView({
  profile,
  apiKey,
  onProfile,
  onDone,
}: {
  profile: IntroProfile
  apiKey: string
  onProfile: (p: IntroProfile) => void
  /** Back to today's session. */
  onDone?: () => void
}) {
  const key = getApiKey(apiKey)
  const [draft, setDraft] = useState(profile)
  const intro = buildIntro(draft)
  const [drill, setDrill] = useState<number[] | null>(null)
  const [drillIdx, setDrillIdx] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  function update(patch: Partial<IntroProfile>) {
    const next = { ...draft, ...patch }
    setDraft(next)
    onProfile(next)
  }

  function startDrill() {
    const order = EXPECTED_QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5)
    setDrill(order)
    setDrillIdx(0)
    setShowAnswer(false)
    void speakWelsh({ text: EXPECTED_QUESTIONS[order[0]!]!.welsh, apiKey: key })
  }

  function nextQuestion() {
    if (!drill) return
    const i = drillIdx + 1
    if (i >= drill.length) {
      setDrill(null)
      return
    }
    setDrillIdx(i)
    setShowAnswer(false)
    void speakWelsh({ text: EXPECTED_QUESTIONS[drill[i]!]!.welsh, apiKey: key })
  }

  const q = drill ? EXPECTED_QUESTIONS[drill[drillIdx]!]! : null
  const langs = draft.languages
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean)

  return (
    <div className="story-page">
      <p className="book-kicker">Fy stori i</p>
      <h1 className="page-title">Your story</h1>
      <p className="page-lead">
        The first two minutes of every conversation in Patagonia will be the same: who
        you are, where you’re from, why on earth you speak Welsh. Make those answers
        automatic and you’ll have energy left for the real conversation.
      </p>

      <section className="story-form">
        <label>
          Name
          <input value={draft.name} onChange={(e) => update({ name: e.target.value })} />
        </label>
        <label>
          Home city in India
          <input
            value={draft.city}
            placeholder="e.g. Chennai"
            onChange={(e) => update({ city: e.target.value })}
          />
        </label>
        <label>
          Where you live now
          <input
            value={draft.livesIn}
            placeholder="e.g. Bangalore"
            onChange={(e) => update({ livesIn: e.target.value })}
          />
        </label>
        <label>
          Job
          <input
            list="story-jobs"
            value={draft.job}
            placeholder="pick or type (in Welsh if not listed)"
            onChange={(e) => update({ job: e.target.value })}
          />
          <datalist id="story-jobs">
            {JOBS.map((j) => (
              <option key={j.en} value={j.en} />
            ))}
          </datalist>
        </label>
        <fieldset className="story-langs">
          <legend>Languages you speak</legend>
          {LANGUAGES.map((l) => {
            const on = langs.some((x) => x.toLowerCase() === l.en.toLowerCase())
            return (
              <button
                key={l.en}
                type="button"
                className={`session-pill ${on ? 'on' : ''}`}
                aria-pressed={on}
                onClick={() =>
                  update({
                    languages: (on
                      ? langs.filter((x) => x.toLowerCase() !== l.en.toLowerCase())
                      : [...langs, l.en]
                    ).join(', '),
                  })
                }
              >
                {l.en}
              </button>
            )
          })}
        </fieldset>
        <label>
          Why Welsh?
          <select value={draft.why} onChange={(e) => update({ why: e.target.value })}>
            <option value="">—</option>
            {REASONS.map((r) => (
              <option key={r.english} value={r.english}>
                {r.english}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="story-script">
        <div className="talk-plan-head">
          <h2>Your introduction</h2>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => void playWelshSequence(intro.map((l) => l.welsh), key)}
          >
            Play it all
          </button>
        </div>
        <ol className="dialogue-script">
          {intro.map((l) => (
            <li key={l.welsh} className="you">
              <SpeakButton text={l.welsh} apiKeyStored={apiKey} />
              <span>
                <span className="cy">{l.welsh}</span>
                <span className="en">{l.english}</span>
                {l.note && <span className="dialogue-note">{l.note}</span>}
              </span>
            </li>
          ))}
        </ol>
        <p className="muted-line">
          Say it out loud every day until you can do it without looking. It’s also your
          retell topic in week 1.
        </p>
      </section>

      <section className="story-questions">
        <div className="talk-plan-head">
          <h2>Questions you’ll be asked</h2>
          {!drill && (
            <button type="button" className="primary-btn" onClick={startDrill}>
              Quick-fire drill
            </button>
          )}
        </div>

        {drill && q && (
          <div className="shadow-card">
            <span className="shadow-count">
              {drillIdx + 1} / {drill.length}
            </span>
            <p className="muted-line">Listen and answer out loud before you look.</p>
            <div className="dialogue-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => void speakWelsh({ text: q.welsh, apiKey: key })}
              >
                Hear the question again
              </button>
            </div>
            {showAnswer ? (
              <>
                <p className="shadow-cy">{q.welsh}</p>
                <p className="shadow-en">{q.english}</p>
                <p className="shadow-cy answer">{q.answer(draft).welsh}</p>
                <p className="shadow-en">{q.answer(draft).english}</p>
                {q.answer(draft).note && (
                  <p className="dialogue-note">{q.answer(draft).note}</p>
                )}
                <button type="button" className="primary-btn" onClick={nextQuestion}>
                  {drillIdx + 1 < drill.length ? 'Next question' : 'Finish'}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="primary-btn"
                onClick={() => setShowAnswer(true)}
              >
                Show question & model answer
              </button>
            )}
          </div>
        )}

        <ul className="story-qa">
          {EXPECTED_QUESTIONS.map((item) => {
            const a = item.answer(draft)
            return (
              <li key={item.welsh}>
                <div className="talk-line">
                  <SpeakButton text={item.welsh} apiKeyStored={apiKey} />
                  <span>
                    <span className="cy">{item.welsh}</span>
                    <span className="en">{item.english}</span>
                  </span>
                </div>
                <div className="talk-line story-answer">
                  <SpeakButton text={a.welsh} apiKeyStored={apiKey} />
                  <span>
                    <span className="cy">{a.welsh}</span>
                    <span className="en">{a.english}</span>
                    {a.note && <span className="dialogue-note">{a.note}</span>}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
      {onDone && (
        <button type="button" className="primary-btn" onClick={onDone}>
          Done — back to today
        </button>
      )}
    </div>
  )
}
