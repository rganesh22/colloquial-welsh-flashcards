import type { NounGender, PartOfSpeech, VocabCard } from '../lib/types'
import days from './sprint/days.json'
import words from './sprint/words.json'

/** The 50-day sprint's words as flashcards: lesson "dN" is day N's 25 words. */

type RawCard = Omit<VocabCard, 'bookId' | 'number' | 'sense'>

interface Row {
  id: string
  day: number
  cy: string
  en: string
  pos: string
  gender?: string
  note?: string
  patagonia?: boolean
  ex?: { cy: string; en: string }
}

const POS: Record<string, PartOfSpeech> = {
  noun: 'noun',
  verb: 'verb-noun',
  'verb-form': 'phrase',
  adjective: 'adjective',
  adverb: 'adverb',
  preposition: 'preposition',
  conjunction: 'conjunction',
  pronoun: 'pronoun',
  particle: 'particle',
  numeral: 'numeral',
  phrase: 'phrase',
}

export const sprintLessons: Record<string, RawCard[]> = {}
for (const w of words as Row[]) {
  const lessonId = `d${w.day}`
  ;(sprintLessons[lessonId] ??= []).push({
    id: w.id,
    lessonId,
    welsh: w.cy,
    english: w.en,
    pos: POS[w.pos] ?? 'phrase',
    gender: w.gender === 'm' || w.gender === 'f' ? (w.gender as NounGender) : undefined,
    notes: w.note,
    tags: w.patagonia ? ['patagonia'] : undefined,
    example: w.ex,
  })
}

/** Day titles for the lesson list (the day's speaking pattern). */
export const sprintDayTitles: Record<number, string> = Object.fromEntries(
  (days as { day: number; title: string }[]).map((d) => [d.day, d.title]),
)
