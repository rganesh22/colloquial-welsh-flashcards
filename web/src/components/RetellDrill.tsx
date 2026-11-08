import { useEffect, useRef, useState } from 'react'
import type { AiKeys } from '../lib/gemini'
import { liveTranscriptSupported, micSupported, startMic, type MicSession, type Recording } from '../lib/recorder'
import { retellFeedback, type RetellFeedback } from '../lib/talk'

/** Nation's 4/3/2, scaled for beginners: the same talk in 2:00, 1:30, 1:00. */
const ROUNDS = [120, 90, 60]

export function RetellDrill({
  topic,
  prompts,
  week,
  keys,
  model,
  short = false,
  onDone,
  onClose,
}: {
  topic: string
  prompts: string[]
  /** Plan week, so feedback matches the level. */
  week: number
  keys: AiKeys
  model: string
  /** 10-minute day: one 2-minute round only. */
  short?: boolean
  onDone: () => void
  onClose: () => void
}) {
  const rounds = short ? [ROUNDS[0]!] : ROUNDS
  /** Feedback needs a model for the coaching and a way to hear the takes. */
  const key = (keys.claude ?? keys.gemini) && (keys.gemini || liveTranscriptSupported())
  const [round, setRound] = useState(0)
  const [left, setLeft] = useState<number | null>(null)
  const [mic, setMic] = useState<MicSession | null>(null)
  const [takes, setTakes] = useState<(Recording & { url: string; round: number })[]>([])
  const [feedback, setFeedback] = useState<RetellFeedback | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const micRef = useRef<MicSession | null>(null)
  micRef.current = mic

  useEffect(() => () => micRef.current?.cancel(), [])

  useEffect(() => {
    if (left == null) return
    if (left <= 0) {
      void stopRound()
      return
    }
    const id = window.setTimeout(() => setLeft((s) => (s == null ? s : s - 1)), 1000)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left])

  async function startRound() {
    setError(null)
    if (micSupported()) {
      try {
        setMic(await startMic({ listen: !keys.gemini }))
      } catch {
        setError('Mic blocked — you can still speak along with the timer.')
      }
    }
    setLeft(rounds[round]!)
  }

  async function stopRound() {
    setLeft(null)
    const m = micRef.current
    setMic(null)
    if (m) {
      try {
        const rec = await m.stop()
        const n = round + 1
        setTakes((t) => [...t, { ...rec, url: URL.createObjectURL(rec.raw), round: n }])
      } catch {
        /* keep going without the take */
      }
    }
    setRound((r) => r + 1)
  }

  /** Round 1 and the final round, so the feedback can say what changed. */
  async function getFeedback() {
    const first = takes[0]
    const last = takes[takes.length - 1]
    if (!key || !first || !last) return
    const pick = first === last ? [first] : [first, last]
    setBusy(true)
    setError(null)
    try {
      setFeedback(
        await retellFeedback({
          keys,
          model,
          topic,
          week,
          takes: pick.map((t) => ({
            audio: t.wav,
            spoken: t.spoken,
            seconds: t.seconds,
            round: t.round,
          })),
        }),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Feedback failed')
    } finally {
      setBusy(false)
    }
  }

  const finished = round >= rounds.length
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="retell-page">
      <div className="talk-head">
        <button type="button" className="ghost-btn" onClick={onClose}>
          Back
        </button>
        <div className="talk-titles">
          <p className="book-kicker">{short ? 'Quick retell' : 'Retell 4/3/2'}</p>
          <h1 className="page-title">{topic}</h1>
          <p className="page-lead">
            {short
              ? 'Talk for two minutes using only Welsh you already know. Keep going — no stopping to look things up.'
              : 'Say the same thing three times, faster each round. Only use Welsh you already know. Same story, less time: it forces fluency.'}
          </p>
        </div>
      </div>

      <ul className="retell-prompts">
        {prompts.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <div className="retell-rounds">
        {rounds.map((secs, i) => {
          const take = takes.find((t) => t.round === i + 1)
          return (
            <div
              key={secs}
              className={`retell-round ${i < round ? 'done' : i === round ? 'current' : ''}`}
            >
              <span className="retell-round-n">Round {i + 1}</span>
              <span className="retell-round-t">
                {i === round && left != null ? fmt(left) : fmt(secs)}
              </span>
              {take && <audio controls src={take.url} />}
            </div>
          )
        })}
      </div>

      {error && <p className="talk-warning">{error}</p>}

      {!finished && (
        <div className="dialogue-actions">
          {left == null ? (
            <button type="button" className="primary-btn" onClick={() => void startRound()}>
              Start round {round + 1}
            </button>
          ) : (
            <button type="button" className="secondary-btn" onClick={() => void stopRound()}>
              Finish round early
            </button>
          )}
        </div>
      )}

      {finished && (
        <section className="retell-done">
          <p>
            Nice. Listen back to round 1 and your last round — the last one is usually
            smoother.
          </p>
          <div className="dialogue-actions">
            {key && takes.length > 0 && !feedback && (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => void getFeedback()}
                disabled={busy}
              >
                {busy
                  ? 'Listening…'
                  : takes.length > 1
                    ? 'Compare my first and last round'
                    : 'Get feedback on my round'}
              </button>
            )}
            <button type="button" className="primary-btn" onClick={onDone}>
              Done
            </button>
          </div>
          {feedback && (
            <div className="talk-report">
              {feedback.takes.map((t, i) => (
                <div key={i} className="retell-take">
                  <h3>
                    {feedback.takes.length > 1
                      ? i === 0
                        ? 'Round 1'
                        : 'Last round'
                      : 'What I heard'}
                    <span className="retell-wpm">
                      {t.wpm} words/min · {Math.round(t.seconds)} s
                    </span>
                  </h3>
                  <p className="cy">{t.heard}</p>
                </div>
              ))}
              {feedback.change && (
                <>
                  <h3>Between rounds</h3>
                  <p>{feedback.change}</p>
                </>
              )}
              <h3>Tips</h3>
              <ul>
                {feedback.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <h3>A smoother version</h3>
              <p className="cy">{feedback.better}</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
