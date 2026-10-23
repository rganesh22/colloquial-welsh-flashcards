import type { Card as FSRSCard } from 'ts-fsrs'

export type BookId = 'colloquial' | 'reader'

/** Lesson id unique within a book (e.g. "1a", "7", "12"). */
export type LessonId = string

export type Dialect = 'N' | 'S' | 'both' | null

/** Noun gender when the headword is a noun. */
export type NounGender = 'm' | 'f'

/**
 * Part of speech. Welsh verbs are stored as verb-nouns (berfenwau),
 * the dictionary form used in Colloquial Welsh.
 */
export type PartOfSpeech =
  | 'noun'
  | 'verb-noun'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'pronoun'
  | 'article'
  | 'possessive'
  | 'particle'
  | 'numeral'
  | 'name'
  | 'place'
  | 'phrase'

export interface VocabCard {
  id: string
  bookId: BookId
  lessonId: LessonId
  /** 1-based index within the chapter */
  number: number
  welsh: string
  english: string
  /**
   * Grammatical category — one or more. Always set after deck enrichment.
   * Use an array when a headword spans categories (e.g. conjunction + noun).
   */
  pos?: PartOfSpeech | PartOfSpeech[]
  /** Set when the headword is (or includes) a noun / noun-like form. */
  gender?: NounGender
  /** Plural form of a noun headword (Welsh). Omitted for mass nouns / already-plural entries. */
  plural?: string
  /**
   * Short label when another card shares the same Welsh or English
   * (e.g. North / South, or the other side of the pair).
   */
  sense?: string
  notes?: string
  tags?: string[]
  dialect?: Dialect
}

export interface BookMeta {
  id: BookId
  short: string
  title: string
  author: string
}

export interface LessonMeta {
  id: LessonId
  bookId: BookId
  titleCy: string
  titleEn: string
  unit?: number
}

export type ProgressMap = Record<string, FSRSCard>

export type StudyMode = 'review' | 'learn'

export type ActivityKind = 'gender' | 'match' | 'listen' | 'plurals'

export type CardDirection = 'cy-en' | 'en-cy'

export type DirectionMode = 'cy-en' | 'en-cy' | 'both'

export type ThemeMode = 'dark' | 'light'

export type SessionFilter =
  | { kind: 'all' }
  | { kind: 'book'; bookId: BookId }
  | { kind: 'lesson'; bookId: BookId; lessonId: LessonId }

export interface StudyItem {
  card: VocabCard
  direction: CardDirection
  progressId: string
}

export type AppView =
  | { name: 'home' }
  | { name: 'lesson'; bookId: BookId; lessonId: LessonId }
  | { name: 'mutations' }
  | {
      name: 'study'
      mode: StudyMode
      filter: SessionFilter
      /** When set, Learn only introduces these vocab ids (daily goal pool). */
      quotaCardIds?: string[]
      /** Cap reviews for this Learn segment (absolute FSRS "max" watermark). */
      sessionReviewMax?: number
      /** 0-based day segment when studying a split goal. */
      segmentIndex?: number
      segmentLabel?: string
    }
  | {
      name: 'activity'
      activity: ActivityKind
      bookId: BookId
      lessonId: LessonId
    }
  | { name: 'guide'; bookId: BookId; lessonId: LessonId }

export function progressIdFor(
  cardId: string,
  direction: CardDirection,
): string {
  return direction === 'cy-en' ? cardId : `${cardId}::en`
}

export function directionsForMode(mode: DirectionMode): CardDirection[] {
  if (mode === 'both') return ['cy-en', 'en-cy']
  return [mode]
}
