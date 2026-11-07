import { useEffect, useRef, useState } from 'react'
import type { Scenario } from '../data/trip/scenarios'
import { getApiKey } from '../lib/gemini'
import { micSupported, startMic, type MicSession } from '../lib/recorder'
import {
  talkOpen,
  talkReport,
  talkTurn,
  type TalkReply,
  type TalkReport,
  type TalkTurn,
} from '../lib/talk'
import { speakWelsh } from '../lib/tts'
import { SpeakButton } from './SpeakButton'

const PLAN_SECONDS = 60

/**
 * Speaking block: one minute to plan with target frames, then a spoken
 * conversation with an AI local, then a coaching report.
 */
export function TalkView({
  scenario,
  week,
  learner,
  name,
  apiKey,
  model,
  checkpoint = false,
  onGap,
  onFinished,
  onClose,
}: {
  scenario: Scenario
  week: number
  /** Short profile line for the partner. */
  learner: string
  name: string
  apiKey: string
  model: string
  checkpoint?: boolean
  onGap: (text: string) => void
  onFinished: (report: TalkReport | null) => void
  onClose: () => void
}) {
  const key = getApiKey(apiKey)
  const [phase, setPhase] = useState<'plan' | 'talk' | 'report'>('plan')
  const [planLeft, setPlanLeft] = useState(PLAN_SECONDS)
  const [turns, setTurns] = useState<TalkTurn[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mic, setMic] = useState<MicSession | null>(null)
  const [typed, setTyped] = useState('')
  const [autoPlay, setAutoPlay] = useState(true)
  const [showEnglish, setShowEnglish] = useState(false)
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [report, setReport] = useState<TalkReport | null>(null)
  const [startedAt] = useState(() => Date.now())
  const logRef = useRef<HTMLDivElement>(null)
  const canRecord = micSupported()

  const fill = (s: string) => s.replaceAll('{name}', name || '…')

  useEffect(() => {
    if (phase !== 'plan') return
    if (planLeft <= 0) return
    const id = window.setTimeout(() => setPlanLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
  }, [phase, planLeft])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, busy])

  useEffect(() => () => mic?.cancel(), [mic])

  function say(text: string) {
    if (!autoPlay) return
    void speakWelsh({ text, apiKey: key }).catch(() => {})
  }

  function themTurn(r: TalkReply): TalkTurn {
    return { role: 'them', welsh: r.reply, english: r.english, hints: r.hints }
  }

  async function begin() {
    setPhase('talk')
    if (!key) return
    setBusy(true)
    setError(null)
    try {
      const r = await talkOpen({ apiKey: key, model, scenario, week, learner })
      setTurns([themTurn(r)])
      say(r.reply)
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  async function send(input: { text?: string; audio?: Blob; audioUrl?: string }) {
    if (!key || busy) return
    setBusy(true)
    setError(null)
    const pending: TalkTurn = {
      role: 'me',
      welsh: input.text ?? '…',
      audioUrl: input.audioUrl,
    }
    const before = turns
    setTurns([...before, pending])
    try {
      const r = await talkTurn({
        apiKey: key,
        model,
        scenario,
        week,
        learner,
        history: before,
        text: input.text,
        audio: input.audio,
      })
      const mine: TalkTurn = {
        ...pending,
        welsh: r.heard || input.text || '…',
        feedback: r.feedback,
      }
      setTurns([...before, mine, themTurn(r)])
      say(r.reply)
    } catch (err) {
      setTurns(before)
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  async function toggleMic() {
    if (mic) {
      setMic(null)
      try {
        const rec = await mic.stop()
        if (rec.seconds < 0.6) return
        await send({ audio: rec.wav, audioUrl: URL.createObjectURL(rec.raw) })
      } catch (err) {
        setError(errorText(err))
      }
      return
    }
    try {
      setMic(await startMic())
    } catch {
      setError('Microphone blocked. Allow mic access in the browser, or type instead.')
    }
  }

  function sendTyped() {
    const t = typed.trim()
    if (!t) return
    setTyped('')
    void send({ text: t })
  }

  function stuck() {
    const t = typed.trim()
    if (!t) return
    onGap(t)
    setTyped('')
    void send({
      text: `(I don't know how to say this in Welsh: "${t}")`,
    })
  }

  async function finish() {
    const spoke = turns.filter((t) => t.role === 'me').length
    if (!key || spoke === 0) {
      onFinished(null)
      return
    }
    setBusy(true)
    setError(null)
    try {
      const r = await talkReport({ apiKey: key, model, scenario, week, history: turns })
      setReport(r)
      setPhase('report')
      onFinished(r)
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  const minutes = Math.floor((Date.now() - startedAt) / 60000)

  return (
    <div className="talk-page">
      <div className="talk-head">
        <button type="button" className="ghost-btn" onClick={onClose}>
          Back
        </button>
        <div className="talk-titles">
          <p className="book-kicker">
            {checkpoint ? 'Checkpoint · film this one' : `Conversation · week ${week}`}
          </p>
          <h1 className="page-title">{scenario.titleCy}</h1>
          <p className="page-lead">
            {scenario.title} — {scenario.setting}
          </p>
        </div>
      </div>

      {!key && (
        <p className="talk-warning">
          The conversation partner needs a Gemini key. Add one under Settings → Gemini
          key, then come back.
        </p>
      )}

      {phase === 'plan' && (
        <section className="talk-plan">
          <div className="talk-plan-head">
            <h2>Plan for a minute</h2>
            <span className={`talk-clock ${planLeft <= 0 ? 'done' : ''}`}>
              {planLeft > 0
                ? `${Math.floor(planLeft / 60)}:${String(planLeft % 60).padStart(2, '0')}`
                : 'Ready'}
            </span>
          </div>
          <p className="muted-line">
            <strong>Your goal:</strong> {scenario.goal} Read the lines below out loud, and
            think about what you’ll say. Planning before you speak makes you more fluent.
          </p>
          <ul className="talk-frames">
            {scenario.frames.map((f) => (
              <li key={f.welsh}>
                <SpeakButton text={fill(f.welsh)} apiKeyStored={apiKey} />
                <span>
                  <span className="cy">{fill(f.welsh)}</span>
                  <span className="en">{fill(f.english)}</span>
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="primary-btn"
            onClick={() => void begin()}
            disabled={!key}
          >
            Start the conversation
          </button>
        </section>
      )}

      {phase !== 'plan' && (
        <section className="talk-chat">
          <div className="talk-toolbar">
            <label className="settings-check">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
              />
              <span>Speak replies aloud</span>
            </label>
            <label className="settings-check">
              <input
                type="checkbox"
                checked={showEnglish}
                onChange={(e) => setShowEnglish(e.target.checked)}
              />
              <span>Show English</span>
            </label>
            <span className="muted-line">{minutes} min</span>
          </div>

          <div className="talk-log" ref={logRef}>
            {turns.map((t, i) =>
              t.role === 'them' ? (
                <div key={i} className="talk-bubble them">
                  <div className="talk-line">
                    <SpeakButton text={t.welsh} apiKeyStored={apiKey} />
                    <span className="cy">{t.welsh}</span>
                  </div>
                  {t.english && (
                    <details className="talk-en" open={showEnglish}>
                      <summary>English</summary>
                      {t.english}
                    </details>
                  )}
                  {i === turns.length - 1 && t.hints && t.hints.length > 0 && (
                    <details className="talk-hints">
                      <summary>Stuck? Ideas for what to say</summary>
                      <ul>
                        {t.hints.map((h) => (
                          <li key={h.welsh}>
                            <span className="cy">{h.welsh}</span>
                            <span className="en">{h.english}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              ) : (
                <div key={i} className="talk-bubble me">
                  <div className="talk-line">
                    {t.audioUrl && <audio controls src={t.audioUrl} className="talk-audio" />}
                    <span className="cy">{t.welsh}</span>
                  </div>
                  {t.feedback && (t.feedback.better || t.feedback.prompt) && (
                    <div className="talk-feedback">
                      {t.feedback.prompt && (
                        <p>
                          <span className="talk-fb-label">Try again?</span> {t.feedback.prompt}
                        </p>
                      )}
                      {t.feedback.better &&
                        (revealed.has(i) || !t.feedback.prompt ? (
                          <p>
                            <span className="talk-fb-label">Better</span>{' '}
                            <span className="cy">{t.feedback.better}</span>
                            {t.feedback.why && <span className="en"> — {t.feedback.why}</span>}
                          </p>
                        ) : (
                          <button
                            type="button"
                            className="ghost-btn small"
                            onClick={() => setRevealed(new Set(revealed).add(i))}
                          >
                            Show correction
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              ),
            )}
            {busy && <div className="talk-bubble them typing">…</div>}
          </div>

          {error && <p className="talk-warning">{error}</p>}

          {phase === 'talk' && (
            <div className="talk-input">
              {canRecord && (
                <button
                  type="button"
                  className={`talk-mic ${mic ? 'on' : ''}`}
                  onClick={() => void toggleMic()}
                  disabled={busy || !key}
                  aria-pressed={Boolean(mic)}
                >
                  {mic ? 'Stop & send' : 'Tap to speak'}
                </button>
              )}
              <input
                type="text"
                placeholder={canRecord ? 'or type in Welsh…' : 'Type in Welsh…'}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendTyped()
                }}
                disabled={busy || !key}
              />
              <button
                type="button"
                className="secondary-btn"
                onClick={sendTyped}
                disabled={busy || !typed.trim()}
              >
                Send
              </button>
              <button
                type="button"
                className="ghost-btn"
                onClick={stuck}
                disabled={busy || !typed.trim()}
                title="Type it in English: it goes to your gap list and the partner gives you the Welsh"
              >
                I can’t say this
              </button>
            </div>
          )}

          {phase === 'talk' && (
            <div className="talk-end">
              <span className="muted-line">
                Aim for {checkpoint ? '5–8' : '10–15'} minutes. Answer, then ask something
                back.
              </span>
              <button
                type="button"
                className="primary-btn"
                onClick={() => void finish()}
                disabled={busy}
              >
                Finish & get feedback
              </button>
            </div>
          )}
        </section>
      )}

      {phase === 'report' && report && (
        <section className="talk-report">
          <h2>How it went</h2>
          <p>{report.summary}</p>
          <div className="talk-scores">
            {(
              [
                ['Fluency', report.scores.fluency],
                ['Range', report.scores.range],
                ['Accuracy', report.scores.accuracy],
                ['Interaction', report.scores.interaction],
                ['Overall', report.scores.overall],
              ] as const
            ).map(([label, v]) => (
              <div key={label} className="talk-score">
                <span className="talk-score-val">{Math.round(v * 10) / 10}</span>
                <span className="talk-score-label">{label}</span>
              </div>
            ))}
          </div>
          {report.wins.length > 0 && (
            <>
              <h3>What went well</h3>
              <ul>
                {report.wins.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </>
          )}
          {report.fixes.length > 0 && (
            <>
              <h3>Fix these</h3>
              <ul className="talk-fixes">
                {report.fixes.map((f) => (
                  <li key={f.said}>
                    <s>{f.said}</s> → <span className="cy">{f.better}</span>
                    <span className="en"> — {f.why}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {report.phrases.length > 0 && (
            <>
              <h3>Phrases that would have helped</h3>
              <ul className="talk-frames">
                {report.phrases.map((p) => (
                  <li key={p.welsh}>
                    <SpeakButton text={p.welsh} apiKeyStored={apiKey} />
                    <span>
                      <span className="cy">{p.welsh}</span>
                      <span className="en">{p.english}</span>
                    </span>
                    <button
                      type="button"
                      className="ghost-btn small"
                      onClick={() => onGap(`${p.welsh} — ${p.english}`)}
                    >
                      Save
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button type="button" className="primary-btn" onClick={onClose}>
            Done
          </button>
        </section>
      )}
    </div>
  )
}

function errorText(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (/api key|API_KEY|permission/i.test(msg)) {
    return 'Gemini refused the key. Check it under Settings.'
  }
  return `Something went wrong talking to Gemini: ${msg.slice(0, 160)}`
}
