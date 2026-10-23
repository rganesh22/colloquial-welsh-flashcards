import type { BookId } from './types'

/** One tappable line: Welsh on top, English underneath. */
export interface GuideLine {
  welsh: string
  english: string
  note?: string
}

export type GuideBlock =
  | { type: 'say'; line: GuideLine }
  | {
      type: 'rule'
      title: string
      body: string
      examples: GuideLine[]
    }
  | { type: 'culture'; title: string; body: string }
  | { type: 'tip'; body: string }
  | {
      type: 'check'
      prompt: string
      /** The correct option, or the short answer when there are no options. */
      answer: string
      options?: string[]
    }

export interface GuideStep {
  /** Unique within the chapter. */
  id: string
  /** Phrase, Grammar, Pattern, Culture, or Check. */
  kicker: string
  title: string
  blocks: GuideBlock[]
}

/** A Duolingo-style lesson that sits in front of the chapter drills. */
export interface ChapterGuide {
  bookId: BookId
  lessonId: string
  /** One or two sentences. What this chapter is for. */
  intro: string
  steps: GuideStep[]
}
