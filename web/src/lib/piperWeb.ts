/**
 * Welsh speech made in the browser with Piper (open-source neural TTS), for
 * lines with no prepared clip: AI replies, lines with your name. Free, no key.
 * The voice (~60 MB) downloads once and is kept in browser storage.
 */

export const PIPER_VOICE = 'cy_GB-gwryw_gogleddol-medium'

type Session = { predict(text: string): Promise<Blob> }

let session: Promise<Session> | null = null
let failed = false

function load(): Promise<Session> {
  if (!session) {
    session = import('@mintplex-labs/piper-tts-web')
      .then(({ TtsSession }) => TtsSession.create({ voiceId: PIPER_VOICE }))
      .catch((err: unknown) => {
        session = null
        failed = true
        throw err
      })
  }
  return session
}

/** Start the download early (e.g. when a conversation opens) so the first reply isn't slow. */
export function warmPiper(): void {
  if (typeof window === 'undefined' || failed) return
  void load().catch((err: unknown) => console.warn('Piper voice failed to load', err))
}

/** Piper reads text literally: drop stage directions and tidy punctuation it would voice oddly. */
export function speakableWelsh(text: string): string {
  return text
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[“”«»]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s*\/\s*/g, ', ')
    .replace(/…/g, '...')
    .replace(/\s+/g, ' ')
    .trim()
}

/** WAV for a Welsh line, or null if the voice can't load (offline on first use, old browser). */
export async function piperWav(text: string): Promise<Blob | null> {
  const line = speakableWelsh(text)
  if (!line) return null
  try {
    return await (await load()).predict(line)
  } catch (err) {
    console.warn('Piper TTS failed', err)
    return null
  }
}
