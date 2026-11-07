import { useEffect, useRef, useState } from 'react'
import type { Dialogue } from '../data/trip/dialogues'
import { getApiKey } from '../lib/gemini'
import { micSupported, startMic, type MicSession } from '../lib/recorder'
import { playWelshSequence, speakWelsh, TTS_VOICES, type WelshLine } from '../lib/tts'

/** A voice per character, so you get used to more than one speaker. */
const CHARACTER_VOICES: Record<string, string> = {
  Elena: TTS_VOICES.female,
  Marta: TTS_VOICES.female,
  Lucía: TTS_VOICES.femaleYoung,
  Ana: TTS_VOICES.femaleYoung,
  Ifor: TTS_VOICES.male,
  Dafydd: TTS_VOICES.male,
  Gwilym: TTS_VOICES.maleYoung,
  Huw: TTS_VOICES.maleYoung,
}

function lineVoice(l: { who: string; welsh: string }): WelshLine {
  const voice = CHARACTER_VOICES[l.who]
  return voice ? { text: l.welsh, voice } : { text: l.welsh }
}
import { SpeakButton } from './SpeakButton'

/**
 * Listen: hear the whole exchange (first without text, then with it).
 * Shadow: line by line, play the model then repeat — optionally record
 * yourself and compare.
 */
export function DialogueView({
  dialogue,
  mode,
  apiKey,
  onDone,
  onClose,
}: {
  dialogue: Dialogue
  mode: 'listen' | 'shadow'
  apiKey: string
  onDone: () => void
  onClose: () => void
}) {
  const key = getApiKey(apiKey)
  const [showText, setShowText] = useState(mode === 'shadow')
  const [plays, setPlays] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [lineIdx, setLineIdx] = useState(0)
  const [onlyMine, setOnlyMine] = useState(true)
  const [mic, setMic] = useState<MicSession | null>(null)
  const [mine, setMine] = useState<Record<number, string>>({})
  const myAudio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => () => mic?.cancel(), [mic])

  async function playAll() {
    setPlaying(true)
    try {
      await playWelshSequence(
        dialogue.lines.map(lineVoice),
        key,
      )
      setPlays((n) => n + 1)
    } finally {
      setPlaying(false)
    }
  }

  const shadowLines = dialogue.lines
    .map((l, i) => ({ ...l, i }))
    .filter((l) => !onlyMine || l.who === 'you')
  const current = shadowLines[Math.min(lineIdx, shadowLines.length - 1)]

  async function recordToggle(i: number) {
    if (mic) {
      setMic(null)
      const rec = await mic.stop()
      setMine((m) => ({ ...m, [i]: URL.createObjectURL(rec.raw) }))
      return
    }
    try {
      setMic(await startMic())
    } catch {
      /* mic blocked: shadowing still works without recording */
    }
  }

  function playMine(i: number) {
    const url = mine[i]
    if (!url) return
    myAudio.current?.pause()
    myAudio.current = new Audio(url)
    void myAudio.current.play()
  }

  return (
    <div className="dialogue-page">
      <div className="talk-head">
        <button type="button" className="ghost-btn" onClick={onClose}>
          Back
        </button>
        <div className="talk-titles">
          <p className="book-kicker">{mode === 'listen' ? 'Listen' : 'Shadow'}</p>
          <h1 className="page-title">{dialogue.titleCy}</h1>
          <p className="page-lead">
            {dialogue.title} — {dialogue.setting}
          </p>
        </div>
      </div>

      {mode === 'listen' && (
        <section className="dialogue-listen">
          <p className="muted-line">
            {plays === 0
              ? 'First listen with the text hidden. Catch what you can — the gist is enough.'
              : plays === 1
                ? 'Now listen again with the text showing. Notice the phrases you know.'
                : 'One more time, eyes closed. Then you’re done.'}
          </p>
          <div className="dialogue-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => void playAll()}
              disabled={playing}
            >
              {playing ? 'Playing…' : plays === 0 ? 'Play' : 'Play again'}
            </button>
            <label className="settings-check">
              <input
                type="checkbox"
                checked={showText}
                onChange={(e) => setShowText(e.target.checked)}
              />
              <span>Show text</span>
            </label>
          </div>
          {showText && <Script dialogue={dialogue} apiKey={apiKey} />}
          <button
            type="button"
            className="secondary-btn"
            onClick={onDone}
            disabled={plays < 1}
          >
            Done listening
          </button>
        </section>
      )}

      {mode === 'shadow' && current && (
        <section className="dialogue-shadow">
          <p className="muted-line">
            Play the line, then say it straight away, copying the rhythm and tune. Do each
            line 2–3 times. Record yourself if you want to compare.
          </p>
          <label className="settings-check">
            <input
              type="checkbox"
              checked={onlyMine}
              onChange={(e) => {
                setOnlyMine(e.target.checked)
                setLineIdx(0)
              }}
            />
            <span>Only my lines</span>
          </label>
          <div className="shadow-card">
            <span className="shadow-count">
              {Math.min(lineIdx, shadowLines.length - 1) + 1} / {shadowLines.length}
            </span>
            <p className="shadow-who">{current.who === 'you' ? 'You' : current.who}</p>
            <p className="shadow-cy">{current.welsh}</p>
            <p className="shadow-en">{current.english}</p>
            <div className="dialogue-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => void speakWelsh({ ...lineVoice(current), apiKey: key })}
              >
                Play model
              </button>
              {micSupported() && (
                <button
                  type="button"
                  className={`secondary-btn ${mic ? 'recording' : ''}`}
                  onClick={() => void recordToggle(current.i)}
                >
                  {mic ? 'Stop' : 'Record me'}
                </button>
              )}
              {mine[current.i] && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => playMine(current.i)}
                >
                  Play me
                </button>
              )}
            </div>
          </div>
          <div className="dialogue-actions">
            <button
              type="button"
              className="ghost-btn"
              onClick={() => setLineIdx((i) => Math.max(0, i - 1))}
              disabled={lineIdx === 0}
            >
              Previous
            </button>
            {lineIdx < shadowLines.length - 1 ? (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setLineIdx((i) => i + 1)}
              >
                Next line
              </button>
            ) : (
              <button type="button" className="primary-btn" onClick={onDone}>
                Done shadowing
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

function Script({ dialogue, apiKey }: { dialogue: Dialogue; apiKey: string }) {
  return (
    <ol className="dialogue-script">
      {dialogue.lines.map((l, i) => (
        <li key={i} className={l.who === 'you' ? 'you' : ''}>
          <span className="dialogue-who">{l.who === 'you' ? 'You' : l.who}</span>
          <SpeakButton text={l.welsh} apiKeyStored={apiKey} />
          <span>
            <span className="cy">{l.welsh}</span>
            <span className="en">{l.english}</span>
            {l.note && <span className="dialogue-note">{l.note}</span>}
          </span>
        </li>
      ))}
    </ol>
  )
}
