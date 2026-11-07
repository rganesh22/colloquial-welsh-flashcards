import { useState } from 'react'
import type { Clip } from '../data/trip/listening'

const SUBTITLES: Record<Clip['subtitles'], string> = {
  welsh: 'Welsh subtitles: turn on CC → Cymraeg',
  english: 'English subtitles only — try covering them the first time',
  'burned-in': 'Subtitles may be in the picture — cover the bottom of the screen the first time',
  auto: 'Only automatic captions — treat them as rough',
  none: 'No subtitles — listen for names, places and greetings',
}

/**
 * Real-voices block: real people from Y Wladfa at real speed. Gist first
 * (who, where, one fact), then a second pass with subtitles.
 */
export function ClipView({
  clip,
  onDone,
  onClose,
}: {
  clip: Clip
  onDone: () => void
  onClose: () => void
}) {
  const [pass, setPass] = useState<1 | 2>(1)
  return (
    <div className="talk-page">
      <div className="talk-head">
        <button type="button" className="ghost-btn" onClick={onClose}>
          Back
        </button>
        <div className="talk-titles">
          <p className="book-kicker">
            Real voices · {clip.level} · {clip.minutes} min
          </p>
          <h1 className="page-title">{clip.title}</h1>
          <p className="page-lead">
            {clip.who} — {clip.source}
          </p>
        </div>
      </div>

      <div className="clip-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${clip.video}?rel=0&cc_load_policy=0`}
          title={clip.title}
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <section className="talk-plan">
        {pass === 1 ? (
          <>
            <h2>First time: no subtitles</h2>
            <p className="muted-line">
              Don’t try to catch every word. Listen for these, and answer out loud in Welsh
              if you can:
            </p>
            <ol className="clip-gist">
              {clip.gist.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
            <button type="button" className="primary-btn" onClick={() => setPass(2)}>
              Done — watch again with subtitles
            </button>
          </>
        ) : (
          <>
            <h2>Second time: with subtitles</h2>
            <p className="muted-line">{SUBTITLES[clip.subtitles]}.</p>
            <p className="muted-line">
              Note two or three words you heard but didn’t know, and save them to your gap
              list or ask about them. Catching half of it is normal — that’s the skill
              you’re building.
            </p>
            <button type="button" className="primary-btn" onClick={onDone}>
              Done ✓
            </button>
          </>
        )}
        <p className="muted-line">
          Can’t play here?{' '}
          <a href={`https://www.youtube.com/watch?v=${clip.video}`} target="_blank" rel="noreferrer">
            Open on YouTube
          </a>
        </p>
      </section>
    </div>
  )
}
