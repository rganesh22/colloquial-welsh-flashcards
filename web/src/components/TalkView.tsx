import { useEffect, useRef, useState } from 'react'
import type { Scenario } from '../data/trip/scenarios'
import type { AiKeys } from '../lib/gemini'
import {
  liveTranscriptSupported,
  micSupported,
  startMic,
  type MicSession,
} from '../lib/recorder'
import {
  isWladfaLocal,
  mostlySpanish,
  talkFeedback,
  talkMetrics,
  talkOpen,
  talkReport,
  talkRetry,
  talkTargets,
  talkTurn,
  type TalkReply,
  type TalkReport,
  type TalkTurn,
} from '../lib/talk'
import { speakWelsh, TTS_CLEAR_STYLE, TTS_SLOW_STYLE, TTS_VOICES } from '../lib/tts'
import { SpeakButton } from './SpeakButton'

const PLAN_SECONDS = 60

/** Partner voices by scenario id; anyone not listed gets the male voice. */
const PARTNER_VOICES: Record<string, string> = {
  'te-gaiman': TTS_VOICES.female, // Elena
  'ysgol-athrawes': TTS_VOICES.female, // Sara
  capel: TTS_VOICES.female, // Marta
  'cyfweliad-iaith': TTS_VOICES.femaleYoung, // Lucía
  'bws-trelew': TTS_VOICES.maleYoung, // Gwilym
  'sgwrs-rydd': TTS_VOICES.maleYoung, // Huw
  sbaeneg: TTS_VOICES.femaleYoung, // Sofía
  disgynnydd: TTS_VOICES.female,
  'dysgwr-lleol': TTS_VOICES.femaleYoung, // Valeria
  ymwelydd: TTS_VOICES.female, // Rhian
  'stori-taith': TTS_VOICES.male, // Dafydd
  barn: TTS_VOICES.female, // Luned
  'pe-bai': TTS_VOICES.maleYoung, // Tomás
}

type SendInput = {
  text?: string
  audio?: Blob
  audioUrl?: string
  seconds?: number
  /** The browser's transcript of `audio` (no Gemini key). */
  spoken?: string
  /** "I can't say this": what they wanted to say. */
  stuck?: string
}

/**
 * Speaking block: one minute to plan with target frames, then a spoken
 * conversation with an AI local, then a coaching report. From week 3 (and in
 * checkpoints) the partner's text starts hidden, so you listen first.
 */
export function TalkView({
  scenario,
  week,
  learner,
  name,
  keys,
  model,
  checkpoint = false,
  recentFixes,
  lesson,
  onGap,
  onFinished,
  onClose,
}: {
  scenario: Scenario
  week: number
  /** Short profile line for the partner. */
  learner: string
  name: string
  /** Claude for the partner; Gemini (optional) to hear you and to speak. */
  keys: AiKeys
  model: string
  checkpoint?: boolean
  /** Corrections from recent reports, for the partner to watch for. */
  recentFixes?: string[]
  /** Today's lesson objective and grammar, for the partner to steer towards. */
  lesson?: { objective: string; grammar: string }
  onGap: (text: string) => void
  onFinished: (report: TalkReport | null) => void
  onClose: () => void
}) {
  /** The partner can run: Claude, or Gemini as the fallback. */
  const key = keys.claude ?? keys.gemini
  const voiceKey = keys.gemini
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
  /** Learner turn being retried after a feedback prompt. */
  const [retryIdx, setRetryIdx] = useState<number | null>(null)
  const [editing, setEditing] = useState<{ i: number; text: string } | null>(null)
  /** Partner turns whose text was opened before replying. */
  const [shownText, setShownText] = useState<Set<number>>(new Set())
  /** Partner turns whose hint list was opened (starters shown). */
  const [hintsOpened, setHintsOpened] = useState<Set<number>>(new Set())
  /** Partner turns whose hints were revealed in full. */
  const [hintsFull, setHintsFull] = useState<Set<number>>(new Set())
  const [report, setReport] = useState<TalkReport | null>(null)
  const [startedAt] = useState(() => Date.now())
  const logRef = useRef<HTMLDivElement>(null)
  /** Voice needs Gemini to transcribe, or the browser's own recognition. */
  const canRecord = micSupported() && (Boolean(voiceKey) || liveTranscriptSupported())

  /** Checkpoints measure: no hints or corrections on screen. */
  const quiet = checkpoint
  const hideText = checkpoint || week >= 3
  const voice = {
    voice: PARTNER_VOICES[scenario.id] ?? TTS_VOICES.male,
    style: week <= 4 ? TTS_CLEAR_STYLE : undefined,
  }
  /** Patagonian locals sound Patagonian; Spanish lines get a Rioplatense accent. */
  const accentFor = (text: string) =>
    mostlySpanish(text)
      ? ('spanish' as const)
      : isWladfaLocal(scenario.id)
        ? ('wladfa' as const)
        : undefined

  const fill = (s: string) => s.replaceAll('{name}', name || '…')
  const partner = {
    keys,
    model,
    scenario,
    week,
    learner,
    checkpoint,
    targets: talkTargets({
      week,
      frames: scenario.frames.map((f) => fill(f.welsh)),
      recentFixes,
      lesson,
    }),
  }

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
    void speakWelsh({ text, apiKey: voiceKey, ...voice, accent: accentFor(text) }).catch(() => {})
  }

  function replay(text: string, slow = false) {
    void speakWelsh({
      text,
      apiKey: voiceKey,
      voice: voice.voice,
      style: slow ? TTS_SLOW_STYLE : voice.style,
      accent: accentFor(text),
    }).catch(() => {})
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
      const r = await talkOpen(partner)
      setTurns([themTurn(r)])
      say(r.reply)
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  async function send(input: SendInput) {
    if (!key || busy) return
    setBusy(true)
    setError(null)
    setRetryIdx(null)
    const pending: TalkTurn = {
      role: 'me',
      welsh: input.stuck ?? input.text ?? '…',
      audioUrl: input.audioUrl,
      typed: input.text != null && !input.stuck ? true : undefined,
      seconds: input.seconds,
      stuck: input.stuck,
    }
    const before = turns
    setTurns([...before, pending])
    try {
      const r = await talkTurn({
        ...partner,
        history: before,
        text: input.text,
        audio: input.audio,
        spoken: input.spoken,
        stuck: input.stuck,
      })
      const mine: TalkTurn = {
        ...pending,
        welsh: input.stuck || input.text || r.heard || '…',
        uncertain: r.uncertain.length ? r.uncertain : undefined,
        feedback: r.feedback,
      }
      setTurns([...before, mine, themTurn(r)])
      if (input.stuck) {
        const welsh = r.feedback.better.trim()
        onGap(welsh ? `${input.stuck} → ${welsh}` : input.stuck)
      }
      say(r.reply)
    } catch (err) {
      setTurns(before)
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  /** Second try at the turn in retry mode. */
  async function sendRetry(input: SendInput) {
    const i = retryIdx
    const t = i == null ? undefined : turns[i]
    if (!key || busy || i == null || !t?.feedback) return
    setBusy(true)
    setError(null)
    try {
      const r = await talkRetry({
        keys,
        model,
        original: t.stuck ? `(in English) ${t.stuck}` : t.welsh,
        prompt: t.feedback.prompt,
        target: t.feedback.better,
        text: input.text,
        audio: input.audio,
        spoken: input.spoken,
      })
      setTurns((all) => all.map((x, j) => (j === i ? { ...x, retry: r } : x)))
      // An unclear take gets no verdict, so the correction stays hidden for another go.
      if (r.outcome === 'not-fixed') setRevealed((s) => new Set(s).add(i))
      setRetryIdx(null)
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  /**
   * Retry mode sends to talkRetry — except after "I can't say this", where the
   * attempt is a normal turn so the partner hears it and carries on.
   */
  function route(input: SendInput) {
    const t = retryIdx == null ? undefined : turns[retryIdx]
    return t && !t.stuck ? sendRetry(input) : send(input)
  }

  async function toggleMic() {
    if (mic) {
      setMic(null)
      try {
        const rec = await mic.stop()
        if (rec.seconds < 0.6) return
        await route({
          audio: rec.wav,
          audioUrl: URL.createObjectURL(rec.raw),
          seconds: rec.seconds,
          spoken: rec.spoken,
        })
      } catch (err) {
        setError(errorText(err))
      }
      return
    }
    try {
      setMic(await startMic({ listen: !voiceKey }))
    } catch {
      setError('Microphone blocked. Allow mic access in the browser, or type instead.')
    }
  }

  function sendTyped() {
    const t = typed.trim()
    if (!t) return
    setTyped('')
    void route({ text: t })
  }

  function stuck() {
    const t = typed.trim()
    if (!t) return
    setTyped('')
    void send({ stuck: t })
  }

  /** Save a fixed transcript; its feedback was about the mishearing, so redo it. */
  function saveEdit() {
    if (!editing) return
    const { i } = editing
    const text = editing.text.trim()
    setEditing(null)
    const t = turns[i]
    if (!t || !text || text === t.welsh) return
    const cleared: TalkTurn = {
      ...t,
      welsh: text,
      feedback: undefined,
      retry: undefined,
      uncertain: undefined,
      edited: true,
    }
    setTurns((all) => all.map((x, j) => (j === i ? cleared : x)))
    if (retryIdx === i) setRetryIdx(null)
    if (!key || checkpoint) return
    void talkFeedback({ ...partner, history: turns.slice(0, i), text, typed: t.typed })
      .then((feedback) => {
        // Only if the learner hasn't edited it again meanwhile.
        setTurns((all) =>
          all.map((x, j) => (j === i && x.welsh === text ? { ...x, feedback } : x)),
        )
      })
      .catch(() => {})
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
      const metrics = talkMetrics(turns, {
        hintsOpened: hintsOpened.size,
        hintsFull: hintsFull.size,
        revealed: hideText ? shownText : null,
      })
      const r = await talkReport({
        keys,
        model,
        scenario,
        week,
        history: turns,
        metrics,
        checkpoint,
      })
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
  const lastMe = turns.map((t) => t.role).lastIndexOf('me')
  const retryTurn = retryIdx == null ? undefined : turns[retryIdx]
  const m = report?.metrics

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
          The conversation partner needs an Anthropic key. Add one under Settings →
          Anthropic key, then come back.
        </p>
      )}
      {key && !voiceKey && (
        <p className="muted-line">
          {canRecord
            ? 'Your voice is turned into text by the browser, which can tidy up small mistakes. Add a Gemini key in Settings for exact transcripts and natural voices.'
            : 'Type your replies here: this browser can’t turn Welsh speech into text. Add a Gemini key in Settings to speak instead.'}
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
          {hideText && (
            <p className="muted-line">
              Listen first: the partner’s words stay hidden until you reply. Tap{' '}
              <em>Slower</em> or ask “Sori, eto?” before you reach for the text.
            </p>
          )}
          <ul className="talk-frames">
            {scenario.frames.map((f) => (
              <li key={f.welsh}>
                <SpeakButton text={fill(f.welsh)} apiKeyStored={voiceKey ?? ''} />
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
          {checkpoint && phase === 'talk' && (
            <p className="talk-checkpoint-note">
              Checkpoint: no hints — speak, don’t type. Typed turns are marked and don’t
              count for fluency.
            </p>
          )}
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
            {turns.map((t, i) => {
              if (t.role === 'them') {
                const answered = turns[i + 1]?.role === 'me'
                const textVisible = !hideText || answered || shownText.has(i)
                return (
                  <div key={i} className="talk-bubble them">
                    <div className="talk-line">
                      <span className="talk-play">
                        <button
                          type="button"
                          className="ghost-btn small"
                          onClick={() => replay(t.welsh)}
                          aria-label="Play again"
                        >
                          ▶ Play
                        </button>
                        <button
                          type="button"
                          className="ghost-btn small"
                          onClick={() => replay(t.welsh, true)}
                        >
                          Slower
                        </button>
                      </span>
                      {textVisible ? (
                        <span className="cy">{t.welsh}</span>
                      ) : (
                        <button
                          type="button"
                          className="ghost-btn small talk-show-text"
                          onClick={() => setShownText((s) => new Set(s).add(i))}
                        >
                          Show text
                        </button>
                      )}
                    </div>
                    {textVisible && t.english && (
                      <details className="talk-en" open={showEnglish}>
                        <summary>English</summary>
                        {t.english}
                      </details>
                    )}
                    {!quiet &&
                      i === turns.length - 1 &&
                      t.hints &&
                      t.hints.length > 0 && (
                        <details
                          className="talk-hints"
                          onToggle={(e) => {
                            if (e.currentTarget.open) {
                              setHintsOpened((s) => new Set(s).add(i))
                            }
                          }}
                        >
                          <summary>Stuck? Ideas for what to say</summary>
                          {/* Graded: starters first, the full sentence on a second tap. */}
                          <ul>
                            {t.hints.map((h) => (
                              <li key={h.welsh}>
                                {hintsFull.has(i) ? (
                                  <>
                                    <span className="cy">{h.welsh}</span>
                                    <span className="en">{h.english}</span>
                                  </>
                                ) : (
                                  <span className="cy">
                                    {h.starter || h.welsh.split(/\s+/).slice(0, 2).join(' ')}…
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                          {!hintsFull.has(i) && (
                            <button
                              type="button"
                              className="talk-link"
                              onClick={() => setHintsFull((s) => new Set(s).add(i))}
                            >
                              Show the full sentences
                            </button>
                          )}
                        </details>
                      )}
                  </div>
                )
              }
              const fb = t.feedback
              // Checkpoints keep feedback silent, except the Welsh you asked for.
              // Held prompts (pacing rules) stay off screen.
              const showFb = Boolean(
                fb && !fb.held && (fb.better || fb.prompt) && (!quiet || t.stuck),
              )
              const canRetry =
                !quiet &&
                phase === 'talk' &&
                i === lastMe &&
                Boolean(fb?.prompt) &&
                !fb?.held &&
                (!t.retry || t.retry.outcome === 'unclear') &&
                retryIdx !== i &&
                !busy
              const better = t.retry?.better || fb?.better
              return (
                <div key={i} className="talk-bubble me">
                  <div className="talk-line">
                    {t.audioUrl && <audio controls src={t.audioUrl} className="talk-audio" />}
                    {t.stuck ? (
                      <span className="en">I can’t say: “{t.stuck}”</span>
                    ) : editing?.i === i ? (
                      <input
                        className="talk-edit-input"
                        value={editing.text}
                        autoFocus
                        onChange={(e) => setEditing({ i, text: e.target.value })}
                        onBlur={saveEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit()
                          if (e.key === 'Escape') setEditing(null)
                        }}
                        aria-label="Fix what you said"
                      />
                    ) : t.audioUrl && !busy && !checkpoint ? (
                      <button
                        type="button"
                        className="talk-edit cy"
                        title="Misheard? Tap to fix the transcript"
                        onClick={() => setEditing({ i, text: t.welsh })}
                      >
                        {t.welsh}
                      </button>
                    ) : (
                      <span className="cy">{t.welsh}</span>
                    )}
                    {checkpoint && t.typed && <span className="talk-tag">typed</span>}
                    {t.edited && <span className="talk-tag">edited</span>}
                  </div>
                  {showFb && fb && (
                    <div className="talk-feedback">
                      {t.retry?.outcome === 'fixed' ? (
                        <p className="talk-fixed">
                          ✓ Fixed — <span className="cy">{t.retry.heard}</span>
                        </p>
                      ) : t.retry?.outcome === 'unclear' ? (
                        <>
                          <p>Couldn’t hear that ending clearly — try once more.</p>
                          {canRetry && (
                            <button
                              type="button"
                              className="ghost-btn small is-on"
                              onClick={() => setRetryIdx(i)}
                            >
                              Try again
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {fb.prompt && !t.stuck && (
                            <p>
                              <span className="talk-fb-label">Try again?</span> {fb.prompt}
                            </p>
                          )}
                          {t.retry && (
                            <p>
                              <span className="talk-fb-label">Second try</span>{' '}
                              <span className="cy">{t.retry.heard}</span>
                            </p>
                          )}
                          {better &&
                            (revealed.has(i) || !fb.prompt || t.stuck ? (
                              <p>
                                <span className="talk-fb-label">
                                  {t.stuck ? 'In Welsh' : 'Better'}
                                </span>{' '}
                                <span className="cy">{better}</span>
                                {(t.retry?.why || fb.why) && (
                                  <span className="en"> — {t.retry?.why || fb.why}</span>
                                )}
                              </p>
                            ) : (
                              retryIdx !== i && (
                                <button
                                  type="button"
                                  className="ghost-btn small"
                                  onClick={() => setRevealed(new Set(revealed).add(i))}
                                >
                                  Show correction
                                </button>
                              )
                            ))}
                          {canRetry && (
                            <button
                              type="button"
                              className="ghost-btn small is-on"
                              onClick={() => setRetryIdx(i)}
                            >
                              Try again
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            {busy && <div className="talk-bubble them typing">…</div>}
          </div>

          {error && <p className="talk-warning">{error}</p>}

          {phase === 'talk' && retryTurn && retryIdx != null && (
            <div className="talk-retry-banner">
              {retryTurn.stuck ? (
                <span>Now say it in Welsh — speak or type it.</span>
              ) : (
                <>
                  <span>Say it again, fixed — or</span>
                  <button
                    type="button"
                    className="ghost-btn small"
                    onClick={() => {
                      setRevealed(new Set(revealed).add(retryIdx))
                      setRetryIdx(null)
                    }}
                  >
                    Show correction
                  </button>
                </>
              )}
              <button
                type="button"
                className="talk-link"
                onClick={() => setRetryIdx(null)}
              >
                Cancel
              </button>
            </div>
          )}

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
                  {mic ? 'Stop & send' : retryIdx != null ? 'Tap to say it again' : 'Tap to speak'}
                </button>
              )}
              <input
                type="text"
                placeholder={
                  checkpoint
                    ? 'Speak if you can — typed turns are marked'
                    : canRecord
                      ? 'or type in Welsh…'
                      : 'Type in Welsh…'
                }
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
              {retryIdx == null && (
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={stuck}
                  disabled={busy || !typed.trim()}
                  title="Type it in English: the partner gives you the Welsh, and it goes to your gap list"
                >
                  I can’t say this
                </button>
              )}
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
                ['Fluency (measured)', report.scores.fluency],
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
          <p className="talk-level">
            <span className="talk-level-badge">{report.level}</span>
            <span>
              <strong>Level shown in this conversation</strong>
              {report.levelWhy ? ` — ${report.levelWhy}` : ''}
            </span>
          </p>
          <p className="talk-task">
            <strong>Goal:</strong> {scenario.goal}{' '}
            <span className={`talk-task-badge done-${report.taskDone}`}>
              {report.taskDone >= 2 ? 'Done' : report.taskDone === 1 ? 'Partly' : 'Not yet'}
            </span>
          </p>
          {m && (
            <ul className="talk-metrics">
              <li>
                <strong>{m.wordsPerTurn}</strong> Welsh words per spoken turn
              </li>
              <li>
                <strong>{m.speechRate}</strong> Welsh words/min
              </li>
              <li>
                <strong>{m.secondsPerTurn} s</strong> per spoken turn
              </li>
              <li>
                <strong>
                  {m.spokenTurns}/{m.learnerTurns}
                </strong>{' '}
                turns spoken
              </li>
              <li>
                <strong>{Math.round(m.welshShare * 100)}%</strong> Welsh
              </li>
              {m.understoodWithoutText != null && (
                <li>
                  <strong>
                    {m.understoodWithoutText}/{m.partnerTurnsAnswered}
                  </strong>{' '}
                  understood by ear
                </li>
              )}
              {!quiet && (
                <li>
                  <strong>{m.hintsOpened}</strong> hints opened
                </li>
              )}
              <li>
                <strong>{m.cantSay}</strong> “can’t say”
              </li>
              {!quiet && (
                <li>
                  <strong>{m.selfCorrections}</strong> self-corrections
                </li>
              )}
            </ul>
          )}
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
                    <SpeakButton text={p.welsh} apiKeyStored={voiceKey ?? ''} />
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
  if (/api.?key|API_KEY|permission|authentication|401/i.test(msg)) {
    return 'The AI refused the key. Check your keys under Settings.'
  }
  return `Something went wrong: ${msg.slice(0, 160)}`
}
