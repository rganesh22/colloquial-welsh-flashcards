import { useEffect, useMemo, useState } from 'react'
import { getChapterGuide } from '../data/guides'
import type { AiKeys } from '../lib/gemini'
import {
  B1_CORE_UNITS,
  checkDrill,
  drillItems,
  guideRules,
  UNIT_SKILLS,
  type DrillCheck,
  type DrillItem,
  type GrammarRule,
} from '../lib/grammar'
import { getLesson } from '../lib/lessons'
import {
  liveTranscriptSupported,
  micSupported,
  startMic,
  type MicSession,
} from '../lib/recorder'
import { NEED_VOICE, talkTranscribe } from '../lib/talk'
import { SpeakButton } from './SpeakButton'

/** Rules for a 'mix' day: two rules from each B1 core unit. */
function mixRules(): { title: string; rules: GrammarRule[] } {
  const rules = B1_CORE_UNITS.flatMap((u) =>
    guideRules(getChapterGuide('colloquial', u)).slice(0, 2),
  )
  return { title: 'Mixed B1 review: past, future, perfect, if, passive, “that”', rules }
}

/**
 * Today's grammar: read the unit's rules, then say six sentences in Welsh
 * that need them. Claude checks each answer; it never shows the model answer
 * until you've tried.
 */
export function GrammarBlock({
  unit,
  keys,
  model,
  week,
  learner,
  onOpenChapter,
  onDone,
  onClose,
}: {
  /** Colloquial Welsh unit id, or 'mix'. */
  unit: string
  keys: AiKeys
  model: string
  week: number
  learner: string
  onOpenChapter: (unit: string) => void
  onDone: () => void
  onClose: () => void
}) {
  const lesson = unit === 'mix' ? undefined : getLesson('colloquial', unit)
  const { title, rules } = useMemo(() => {
    if (unit === 'mix') return mixRules()
    return {
      title: lesson ? `${lesson.titleCy} — ${lesson.titleEn}` : `Unit ${unit}`,
      rules: guideRules(getChapterGuide('colloquial', unit)),
    }
  }, [unit, lesson])
  const aiReady = Boolean(keys.claude || keys.gemini)
  // The alphabet unit is about sounds: read it and say it, no sentence drill.
  const canDrill = aiReady && rules.length > 0 && unit !== 'alphabet'
  const canRecord = micSupported() && (Boolean(keys.gemini) || liveTranscriptSupported())

  const [phase, setPhase] = useState<'rules' | 'drill' | 'done'>('rules')
  const [items, setItems] = useState<DrillItem[]>([])
  const [i, setI] = useState(0)
  const [attempt, setAttempt] = useState('')
  const [check, setCheck] = useState<DrillCheck | null>(null)
  const [right, setRight] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mic, setMic] = useState<MicSession | null>(null)

  useEffect(() => () => mic?.cancel(), [mic])

  async function startDrill() {
    setPhase('drill')
    setBusy(true)
    setError(null)
    setI(0)
    setRight(0)
    setCheck(null)
    setAttempt('')
    try {
      setItems(await drillItems({ keys, model, unitTitle: title, rules, week, learner }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Couldn’t make the drill')
    } finally {
      setBusy(false)
    }
  }

  async function submit(text: string) {
    const item = items[i]
    const said = text.trim()
    if (!item || !said || busy) return
    setAttempt(said)
    setBusy(true)
    setError(null)
    try {
      const r = await checkDrill({ keys, model, item, attempt: said, rules })
      setCheck(r)
      if (r.correct) setRight((n) => n + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Couldn’t check that')
    } finally {
      setBusy(false)
    }
  }

  async function toggleMic() {
    if (mic) {
      setMic(null)
      try {
        const rec = await mic.stop()
        if (rec.seconds < 0.4) return
        let said = rec.spoken?.trim() ?? ''
        if (keys.gemini) {
          setBusy(true)
          said = (
            await talkTranscribe({
              keys,
              audio: rec.wav,
              context: `they are saying in Welsh: "${items[i]?.english ?? ''}"`,
            })
          ).transcript
          setBusy(false)
        }
        if (!said) throw new Error(NEED_VOICE)
        await submit(said)
      } catch (err) {
        setBusy(false)
        setError(err instanceof Error ? err.message : 'Recording failed')
      }
      return
    }
    try {
      setMic(await startMic({ listen: !keys.gemini }))
    } catch {
      setError('Microphone blocked. Type your answer instead.')
    }
  }

  function next() {
    setCheck(null)
    setAttempt('')
    if (i + 1 >= items.length) setPhase('done')
    else setI(i + 1)
  }

  const item = items[i]

  return (
    <div className="talk-page">
      <div className="talk-head">
        <button type="button" className="ghost-btn" onClick={onClose}>
          Back
        </button>
        <div className="talk-titles">
          <p className="book-kicker">
            Gramadeg · {unit === 'mix' ? 'review' : `Colloquial Welsh ${unit}`}
          </p>
          <h1 className="page-title">{title}</h1>
          <p className="page-lead">{UNIT_SKILLS[unit] ?? ''}</p>
        </div>
      </div>

      {phase === 'rules' && (
        <section className="talk-plan">
          <p className="muted-line">
            Read each rule and say the examples out loud.
            {canDrill &&
              ' Then say six sentences of your own that need them: producing the pattern is what makes it stick.'}
          </p>
          <ol className="grammar-rules">
            {rules.map((r) => (
              <li key={r.title}>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
                <ul className="talk-frames">
                  {r.examples.slice(0, 3).map((e) => (
                    <li key={e.welsh}>
                      <SpeakButton text={e.welsh} apiKeyStored={keys.gemini ?? ''} />
                      <span>
                        <span className="cy">{e.welsh}</span>
                        <span className="en">{e.english}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          {!rules.length && (
            <p className="muted-line">This unit is mostly sounds and phrases: open the chapter.</p>
          )}
          <div className="dialogue-actions">
            {canDrill ? (
              <button type="button" className="primary-btn" onClick={() => void startDrill()}>
                Start the drill
              </button>
            ) : (
              <button type="button" className="primary-btn" onClick={onDone}>
                Done
              </button>
            )}
            {unit !== 'mix' && (
              <button type="button" className="secondary-btn" onClick={() => onOpenChapter(unit)}>
                Open the full chapter
              </button>
            )}
          </div>
          {!aiReady && rules.length > 0 && (
            <p className="muted-line">
              Add an Anthropic key in Settings to get a speaking drill on these rules.
            </p>
          )}
        </section>
      )}

      {phase === 'drill' && (
        <section className="talk-plan grammar-drill">
          {busy && !item && <p className="muted-line">Writing your sentences…</p>}
          {item && (
            <>
              <p className="book-kicker">
                {i + 1} of {items.length} · {item.focus}
              </p>
              <p className="grammar-prompt">{item.english}</p>
              {!check ? (
                <div className="talk-input">
                  {canRecord && (
                    <button
                      type="button"
                      className={`talk-mic ${mic ? 'on' : ''}`}
                      onClick={() => void toggleMic()}
                      disabled={busy}
                      aria-pressed={Boolean(mic)}
                    >
                      {mic ? 'Stop & check' : 'Say it'}
                    </button>
                  )}
                  <input
                    type="text"
                    placeholder={canRecord ? 'or type it in Welsh…' : 'Type it in Welsh…'}
                    value={attempt}
                    onChange={(e) => setAttempt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void submit(attempt)
                    }}
                    disabled={busy}
                  />
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => void submit(attempt)}
                    disabled={busy || !attempt.trim()}
                  >
                    {busy ? 'Checking…' : 'Check'}
                  </button>
                </div>
              ) : (
                <div className={`talk-feedback ${check.correct ? 'ok' : ''}`}>
                  <p>
                    <span className="talk-fb-label">You said</span> {attempt}
                  </p>
                  {check.correct ? (
                    <p>✓ Cywir — correct.</p>
                  ) : (
                    <p>
                      <span className="talk-fb-label">Better</span> {check.better}
                    </p>
                  )}
                  {check.why && <p className="muted-line">{check.why}</p>}
                  <p>
                    <span className="talk-fb-label">Model</span>{' '}
                    <SpeakButton text={item.welsh} apiKeyStored={keys.gemini ?? ''} /> {item.welsh}
                  </p>
                  {!check.correct && (
                    <p className="muted-line">Say the better version out loud once before moving on.</p>
                  )}
                  <button type="button" className="primary-btn" onClick={next}>
                    {i + 1 >= items.length ? 'Finish' : 'Next'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {phase === 'done' && (
        <section className="retell-done">
          <p>
            {right} of {items.length} right first time.{' '}
            {right >= items.length - 1
              ? 'Solid — this pattern is landing.'
              : 'Worth one more round: new sentences, same rules.'}
          </p>
          <div className="dialogue-actions">
            <button type="button" className="secondary-btn" onClick={() => void startDrill()}>
              Another round
            </button>
            <button type="button" className="primary-btn" onClick={onDone}>
              Done
            </button>
          </div>
        </section>
      )}

      {error && <p className="talk-warning">{error}</p>}
    </div>
  )
}
