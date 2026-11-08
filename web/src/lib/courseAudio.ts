import { cardsForLesson } from '../data/deck'
import { DIALOGUES } from '../data/trip/dialogues'
import { getChapterGuide } from '../data/guides'
import { PLAN_SESSIONS } from '../data/trip/plan'
import { SCENARIOS } from '../data/trip/scenarios'
import { EXPECTED_QUESTIONS } from '../data/trip/story'
import { PATAGONIA_LESSONS } from './lessons'
import { B1_CORE_UNITS } from './grammar'
import { TTS_VOICES, type WelshLine } from './tts'

/** A voice per dialogue character, so you get used to more than one speaker. */
export const CHARACTER_VOICES: Record<string, string> = {
  Elena: TTS_VOICES.female,
  Marta: TTS_VOICES.female,
  Lucía: TTS_VOICES.femaleYoung,
  Ana: TTS_VOICES.femaleYoung,
  Ifor: TTS_VOICES.male,
  Dafydd: TTS_VOICES.male,
  Gwilym: TTS_VOICES.maleYoung,
  Huw: TTS_VOICES.maleYoung,
}

/** How a dialogue line is voiced: locals sound Patagonian; “you” is the default voice. */
export function lineVoice(l: { who: string; welsh: string }): WelshLine {
  const voice = CHARACTER_VOICES[l.who]
  return voice ? { text: l.welsh, voice, accent: 'wladfa' } : { text: l.welsh }
}

/** Grammar units the course plays examples from (single units, unit tests, the mix). */
function courseUnits(): string[] {
  const units = new Set<string>()
  for (const s of PLAN_SESSIONS) {
    if (!s.pattern) continue
    for (const u of s.pattern === 'mix' ? B1_CORE_UNITS : s.pattern.split('+')) units.add(u)
  }
  return [...units]
}

/**
 * Every fixed line the 8-week course plays, with the voice it's played in.
 * Lines built at runtime (your name, AI replies) can't be prepared here.
 */
export function courseAudioLines(): WelshLine[] {
  const lines: WelshLine[] = []
  const add = (text: string, v: Omit<WelshLine, 'text'> = {}) => {
    const t = text.trim()
    // {name}-style lines depend on your profile, so they're made at runtime.
    if (t && !t.includes('{')) lines.push({ text: t, ...v })
  }

  for (const lesson of PATAGONIA_LESSONS) {
    for (const card of cardsForLesson('patagonia', lesson.id)) add(card.welsh)
  }
  for (const d of DIALOGUES) {
    for (const l of d.lines) {
      lines.push(lineVoice(l))
      add(l.welsh)
    }
  }
  for (const s of SCENARIOS) for (const f of s.frames) add(f.welsh)
  for (const q of EXPECTED_QUESTIONS) add(q.welsh)
  for (const unit of courseUnits()) {
    const guide = getChapterGuide('colloquial', unit)
    for (const step of guide?.steps ?? []) {
      for (const b of step.blocks) {
        if (b.type === 'say') add(b.line.welsh)
        if (b.type === 'rule') for (const e of b.examples) add(e.welsh)
      }
    }
  }
  return lines
}
