import { lesson1aCards } from './lesson-1a'
import { lesson1bCards } from './lesson-1b'
import { lesson2aCards } from './lesson-2a'
import { lesson2bCards } from './lesson-2b'
import { alphabetCards } from './lesson-alphabet'
import { lesson3AlreadyPlural, lesson3Cards, lesson3NoPlural } from './lesson-3'
import { lesson4AlreadyPlural, lesson4Cards, lesson4NoPlural } from './lesson-4'
import { lesson5AlreadyPlural, lesson5Cards, lesson5NoPlural } from './lesson-5'
import { lesson6AlreadyPlural, lesson6Cards, lesson6NoPlural } from './lesson-6'
import { lesson7AlreadyPlural, lesson7Cards, lesson7NoPlural } from './lesson-7'
import { lesson8AlreadyPlural, lesson8Cards, lesson8NoPlural } from './lesson-8'
import { lesson9AlreadyPlural, lesson9Cards, lesson9NoPlural } from './lesson-9'
import { lesson10AlreadyPlural, lesson10Cards, lesson10NoPlural } from './lesson-10'
import { lesson11AlreadyPlural, lesson11Cards, lesson11NoPlural } from './lesson-11'
import { lesson12AlreadyPlural, lesson12Cards, lesson12NoPlural } from './lesson-12'
import { lesson13AlreadyPlural, lesson13Cards, lesson13NoPlural } from './lesson-13'
import { lesson14AlreadyPlural, lesson14Cards, lesson14NoPlural } from './lesson-14'
import { lesson15AlreadyPlural, lesson15Cards, lesson15NoPlural } from './lesson-15'
import { lesson16AlreadyPlural, lesson16Cards, lesson16NoPlural } from './lesson-16'
import { reader1Cards } from './reader-1'
import { reader2Cards } from './reader-2'
import { reader3AlreadyPlural, reader3Cards, reader3NoPlural } from './reader-3'
import { reader4AlreadyPlural, reader4Cards, reader4NoPlural } from './reader-4'
import { reader5AlreadyPlural, reader5Cards, reader5NoPlural } from './reader-5'
import { reader6AlreadyPlural, reader6Cards, reader6NoPlural } from './reader-6'
import { reader7AlreadyPlural, reader7Cards, reader7NoPlural } from './reader-7'
import { reader8AlreadyPlural, reader8Cards, reader8NoPlural } from './reader-8'
import { reader9AlreadyPlural, reader9Cards, reader9NoPlural } from './reader-9'
import { reader10AlreadyPlural, reader10Cards, reader10NoPlural } from './reader-10'
import { reader11AlreadyPlural, reader11Cards, reader11NoPlural } from './reader-11'
import { reader12AlreadyPlural, reader12Cards, reader12NoPlural } from './reader-12'
import { reader13AlreadyPlural, reader13Cards, reader13NoPlural } from './reader-13'
import { reader14AlreadyPlural, reader14Cards, reader14NoPlural } from './reader-14'
import { reader15AlreadyPlural, reader15Cards, reader15NoPlural } from './reader-15'
import { reader16AlreadyPlural, reader16Cards, reader16NoPlural } from './reader-16'
import { reader17AlreadyPlural, reader17Cards, reader17NoPlural } from './reader-17'
import { reader18AlreadyPlural, reader18Cards, reader18NoPlural } from './reader-18'
import { reader19AlreadyPlural, reader19Cards, reader19NoPlural } from './reader-19'
import { reader20AlreadyPlural, reader20Cards, reader20NoPlural } from './reader-20'
import { reader21AlreadyPlural, reader21Cards, reader21NoPlural } from './reader-21'
import { reader22AlreadyPlural, reader22Cards, reader22NoPlural } from './reader-22'
import { reader23AlreadyPlural, reader23Cards, reader23NoPlural } from './reader-23'
import { reader24AlreadyPlural, reader24Cards, reader24NoPlural } from './reader-24'
import { reader25AlreadyPlural, reader25Cards, reader25NoPlural } from './reader-25'
import { reader26AlreadyPlural, reader26Cards, reader26NoPlural } from './reader-26'
import { reader27AlreadyPlural, reader27Cards, reader27NoPlural } from './reader-27'
import { reader28AlreadyPlural, reader28Cards, reader28NoPlural } from './reader-28'
import { reader29AlreadyPlural, reader29Cards, reader29NoPlural } from './reader-29'
import { reader30AlreadyPlural, reader30Cards, reader30NoPlural } from './reader-30'
import { reader31AlreadyPlural, reader31Cards, reader31NoPlural } from './reader-31'
import { reader32AlreadyPlural, reader32Cards, reader32NoPlural } from './reader-32'
import { reader33AlreadyPlural, reader33Cards, reader33NoPlural } from './reader-33'
import { reader34AlreadyPlural, reader34Cards, reader34NoPlural } from './reader-34'
import { reader35AlreadyPlural, reader35Cards, reader35NoPlural } from './reader-35'
import {
  ALREADY_PLURAL,
  NOUN_PLURALS,
  NO_PLURAL,
} from './plurals'
import { cleanPosNotes, hasNounPos, inferPos } from '../lib/pos'
import type { BookId, LessonId, PartOfSpeech, VocabCard } from '../lib/types'

/** Manual overrides for cards tags alone cannot classify. */
const POS_OVERRIDE: Record<string, PartOfSpeech | PartOfSpeech[]> = {
  'alphabet-dwli': 'verb-noun',
  'alphabet-cyhyd': 'conjunction',
  'alphabet-phan': 'conjunction',
  'alphabet-achos': ['conjunction', 'noun'],
  'alphabet-rhyw': 'noun',
  'alphabet-mwyn': 'noun',
}

const CHAPTER_NO_PLURAL = new Set<string>([
  ...NO_PLURAL,
  ...lesson3NoPlural,
  ...lesson4NoPlural,
  ...lesson5NoPlural,
  ...lesson6NoPlural,
  ...lesson7NoPlural,
  ...lesson8NoPlural,
  ...lesson9NoPlural,
  ...lesson10NoPlural,
  ...lesson11NoPlural,
  ...lesson12NoPlural,
  ...lesson13NoPlural,
  ...lesson14NoPlural,
  ...lesson15NoPlural,
  ...lesson16NoPlural,
  ...reader3NoPlural,
  ...reader4NoPlural,
  ...reader5NoPlural,
  ...reader6NoPlural,
  ...reader7NoPlural,
  ...reader8NoPlural,
  ...reader9NoPlural,
  ...reader10NoPlural,
  ...reader11NoPlural,
  ...reader12NoPlural,
  ...reader13NoPlural,
  ...reader14NoPlural,
  ...reader15NoPlural,
  ...reader16NoPlural,
  ...reader17NoPlural,
  ...reader18NoPlural,
  ...reader19NoPlural,
  ...reader20NoPlural,
  ...reader21NoPlural,
  ...reader22NoPlural,
  ...reader23NoPlural,
  ...reader24NoPlural,
  ...reader25NoPlural,
  ...reader26NoPlural,
  ...reader27NoPlural,
  ...reader28NoPlural,
  ...reader29NoPlural,
  ...reader30NoPlural,
  ...reader31NoPlural,
  ...reader32NoPlural,
  ...reader33NoPlural,
  ...reader34NoPlural,
  ...reader35NoPlural,
])

const CHAPTER_ALREADY_PLURAL = new Set<string>([
  ...ALREADY_PLURAL,
  ...lesson3AlreadyPlural,
  ...lesson4AlreadyPlural,
  ...lesson5AlreadyPlural,
  ...lesson6AlreadyPlural,
  ...lesson7AlreadyPlural,
  ...lesson8AlreadyPlural,
  ...lesson9AlreadyPlural,
  ...lesson10AlreadyPlural,
  ...lesson11AlreadyPlural,
  ...lesson12AlreadyPlural,
  ...lesson13AlreadyPlural,
  ...lesson14AlreadyPlural,
  ...lesson15AlreadyPlural,
  ...lesson16AlreadyPlural,
  ...reader3AlreadyPlural,
  ...reader4AlreadyPlural,
  ...reader5AlreadyPlural,
  ...reader6AlreadyPlural,
  ...reader7AlreadyPlural,
  ...reader8AlreadyPlural,
  ...reader9AlreadyPlural,
  ...reader10AlreadyPlural,
  ...reader11AlreadyPlural,
  ...reader12AlreadyPlural,
  ...reader13AlreadyPlural,
  ...reader14AlreadyPlural,
  ...reader15AlreadyPlural,
  ...reader16AlreadyPlural,
  ...reader17AlreadyPlural,
  ...reader18AlreadyPlural,
  ...reader19AlreadyPlural,
  ...reader20AlreadyPlural,
  ...reader21AlreadyPlural,
  ...reader22AlreadyPlural,
  ...reader23AlreadyPlural,
  ...reader24AlreadyPlural,
  ...reader25AlreadyPlural,
  ...reader26AlreadyPlural,
  ...reader27AlreadyPlural,
  ...reader28AlreadyPlural,
  ...reader29AlreadyPlural,
  ...reader30AlreadyPlural,
  ...reader31AlreadyPlural,
  ...reader32AlreadyPlural,
  ...reader33AlreadyPlural,
  ...reader34AlreadyPlural,
  ...reader35AlreadyPlural,
])

type RawCard = Omit<VocabCard, 'bookId' | 'number' | 'sense'>

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[…!.?,''']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Pull “Plural: foo.” out of legacy notes into a dedicated field. */
function pluralFromNotes(notes: string | undefined): string | undefined {
  if (!notes) return undefined
  const m = notes.match(/Plural:\s*([^.(]+?)(?:\s*\.|$)/i)
  if (!m) return undefined
  const pl = m[1]!.trim().replace(/\.$/, '')
  if (!pl || /^of\b/i.test(pl)) return undefined
  return pl
}

function stripPluralNotes(notes: string | undefined): string | undefined {
  if (!notes) return undefined
  let n = notes
    .replace(/\s*Plural:\s*[^.]+\.\s*/gi, ' ')
    .replace(/\s*Plural:\s*[^.]+$/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return n || undefined
}

function resolvePlural(
  card: Pick<VocabCard, 'id' | 'pos' | 'plural' | 'notes'>,
): string | undefined {
  if (card.plural) return card.plural
  if (CHAPTER_ALREADY_PLURAL.has(card.id) || CHAPTER_NO_PLURAL.has(card.id))
    return undefined
  if (!hasNounPos(card.pos)) return undefined
  return NOUN_PLURALS[card.id] ?? pluralFromNotes(card.notes)
}

function senseLabel(card: RawCard & { bookId: BookId }, peers: VocabCard[]): string | undefined {
  const sameEn = peers.filter(
    (p) => p.id !== card.id && norm(p.english) === norm(card.english),
  )
  const sameCy = peers.filter(
    (p) => p.id !== card.id && norm(p.welsh) === norm(card.welsh),
  )
  if (sameEn.length === 0 && sameCy.length === 0) return undefined

  const parts: string[] = []
  if (sameEn.length > 0) {
    // Dialect pairs use the North/South tag alone — don't duplicate in sense text.
    // Never put Welsh on the sense line: it leaks the answer on EN→CY / Match.
    if (card.dialect === 'N' || card.dialect === 'S') {
      /* tag only */
    } else {
      const genders = new Set(
        [card.gender, ...sameEn.map((p) => p.gender)].filter(Boolean),
      )
      if (card.gender && genders.size > 1) {
        parts.push(card.gender === 'm' ? 'masc.' : 'fem.')
      } else if (card.tags?.[0]) {
        parts.push(card.tags[0])
      } else if (card.pos && !Array.isArray(card.pos)) {
        parts.push(String(card.pos))
      } else if (Array.isArray(card.pos) && card.pos[0]) {
        parts.push(String(card.pos[0]))
      }
    }
  }
  if (sameCy.length > 0) {
    parts.push(card.english)
  }
  if (parts.length === 0 && card.tags?.[0]) parts.push(card.tags[0])
  return parts.join(' · ') || undefined
}

function enrichChapter(
  bookId: BookId,
  raw: RawCard[],
): VocabCard[] {
  const withBook = raw.map((c) => {
    const pos =
      c.pos ?? POS_OVERRIDE[c.id] ?? inferPos(c) ?? ('phrase' as PartOfSpeech)
    const plural = resolvePlural({ ...c, pos })
    const notes = cleanPosNotes(stripPluralNotes(c.notes))
    return { ...c, bookId, pos, plural, notes }
  })
  // First pass: numbers
  const numbered: VocabCard[] = withBook.map((c, i) => ({
    ...c,
    number: i + 1,
  }))
  // Second pass: sense labels for collisions within the chapter
  return numbered.map((c) => {
    const sense = senseLabel(c, numbered)
    return sense ? { ...c, sense } : c
  })
}

/** All deck cards. Register new lesson files here when pasting content. */
export const ALL_CARDS: VocabCard[] = [
  ...enrichChapter('colloquial', alphabetCards as RawCard[]),
  ...enrichChapter('colloquial', lesson1aCards as RawCard[]),
  ...enrichChapter('colloquial', lesson1bCards as RawCard[]),
  ...enrichChapter('colloquial', lesson2aCards as RawCard[]),
  ...enrichChapter('colloquial', lesson2bCards as RawCard[]),
  ...enrichChapter('colloquial', lesson3Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson4Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson5Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson6Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson7Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson8Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson9Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson10Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson11Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson12Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson13Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson14Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson15Cards as RawCard[]),
  ...enrichChapter('colloquial', lesson16Cards as RawCard[]),
  ...enrichChapter('reader', reader1Cards as RawCard[]),
  ...enrichChapter('reader', reader2Cards as RawCard[]),
  ...enrichChapter('reader', reader3Cards as RawCard[]),
  ...enrichChapter('reader', reader4Cards as RawCard[]),
  ...enrichChapter('reader', reader5Cards as RawCard[]),
  ...enrichChapter('reader', reader6Cards as RawCard[]),
  ...enrichChapter('reader', reader7Cards as RawCard[]),
  ...enrichChapter('reader', reader8Cards as RawCard[]),
  ...enrichChapter('reader', reader9Cards as RawCard[]),
  ...enrichChapter('reader', reader10Cards as RawCard[]),
  ...enrichChapter('reader', reader11Cards as RawCard[]),
  ...enrichChapter('reader', reader12Cards as RawCard[]),
  ...enrichChapter('reader', reader13Cards as RawCard[]),
  ...enrichChapter('reader', reader14Cards as RawCard[]),
  ...enrichChapter('reader', reader15Cards as RawCard[]),
  ...enrichChapter('reader', reader16Cards as RawCard[]),
  ...enrichChapter('reader', reader17Cards as RawCard[]),
  ...enrichChapter('reader', reader18Cards as RawCard[]),
  ...enrichChapter('reader', reader19Cards as RawCard[]),
  ...enrichChapter('reader', reader20Cards as RawCard[]),
  ...enrichChapter('reader', reader21Cards as RawCard[]),
  ...enrichChapter('reader', reader22Cards as RawCard[]),
  ...enrichChapter('reader', reader23Cards as RawCard[]),
  ...enrichChapter('reader', reader24Cards as RawCard[]),
  ...enrichChapter('reader', reader25Cards as RawCard[]),
  ...enrichChapter('reader', reader26Cards as RawCard[]),
  ...enrichChapter('reader', reader27Cards as RawCard[]),
  ...enrichChapter('reader', reader28Cards as RawCard[]),
  ...enrichChapter('reader', reader29Cards as RawCard[]),
  ...enrichChapter('reader', reader30Cards as RawCard[]),
  ...enrichChapter('reader', reader31Cards as RawCard[]),
  ...enrichChapter('reader', reader32Cards as RawCard[]),
  ...enrichChapter('reader', reader33Cards as RawCard[]),
  ...enrichChapter('reader', reader34Cards as RawCard[]),
  ...enrichChapter('reader', reader35Cards as RawCard[]),
]

export function cardsForBook(bookId: BookId): VocabCard[] {
  return ALL_CARDS.filter((c) => c.bookId === bookId)
}

export function cardsForLesson(
  bookId: BookId,
  lessonId: LessonId,
): VocabCard[] {
  return ALL_CARDS.filter(
    (c) => c.bookId === bookId && c.lessonId === lessonId,
  )
}

export function getCardById(id: string): VocabCard | undefined {
  return ALL_CARDS.find((c) => c.id === id)
}

/** Nouns that still lack a plural after enrichment (for audits). */
export function nounsMissingPlural(): VocabCard[] {
  return ALL_CARDS.filter(
    (c) =>
      hasNounPos(c.pos) &&
      !c.plural &&
      !CHAPTER_ALREADY_PLURAL.has(c.id) &&
      !CHAPTER_NO_PLURAL.has(c.id),
  )
}
