import type { NounGender, PartOfSpeech, VocabCard } from './types'

/** Display labels — lowercase, hyphenated where conventional for Welsh. */
export const POS_LABEL: Record<PartOfSpeech, string> = {
  noun: 'noun',
  'verb-noun': 'verb-noun',
  adjective: 'adjective',
  adverb: 'adverb',
  preposition: 'preposition',
  conjunction: 'conjunction',
  pronoun: 'pronoun',
  article: 'article',
  possessive: 'possessive',
  particle: 'particle',
  numeral: 'numeral',
  name: 'name',
  place: 'place',
  phrase: 'phrase',
}

/** Normalize single-or-array POS to a deduped list. */
export function posList(
  pos: PartOfSpeech | PartOfSpeech[] | undefined,
): PartOfSpeech[] {
  if (!pos) return []
  return [...new Set(Array.isArray(pos) ? pos : [pos])]
}

export function formatPos(pos: PartOfSpeech | undefined): string | null {
  if (!pos) return null
  return POS_LABEL[pos] ?? pos
}

export function formatPosList(
  pos: PartOfSpeech | PartOfSpeech[] | undefined,
): string[] {
  return posList(pos).map((p) => POS_LABEL[p] ?? p)
}

export function hasNounPos(
  pos: PartOfSpeech | PartOfSpeech[] | undefined,
): boolean {
  return posList(pos).includes('noun')
}

/**
 * Whether gender should be shown with the POS chips.
 * Shown when gender is set and the card is (or includes) a noun —
 * or when gender is set on a gendered pronoun/demonstrative.
 */
export function showsGender(card: Pick<VocabCard, 'pos' | 'gender'>): boolean {
  if (card.gender !== 'm' && card.gender !== 'f') return false
  const list = posList(card.pos)
  if (list.includes('noun') || list.includes('pronoun')) return true
  // Phrases that carry gender on a head noun still expose it
  if (list.includes('phrase') && card.gender) return true
  return list.length === 0
}

export function genderOf(
  card: Pick<VocabCard, 'gender'>,
): NounGender | undefined {
  return card.gender === 'm' || card.gender === 'f' ? card.gender : undefined
}

const PHRASE_TAGS = new Set([
  'greeting',
  'goodbye',
  'how-are-you',
  'reply',
  'filler',
  'polite',
  'formal',
  'intro',
])

/** Infer POS from tags / gender / notes when `pos` is not set on a card. */
export function inferPos(
  card: Pick<VocabCard, 'tags' | 'gender' | 'notes'>,
): PartOfSpeech | PartOfSpeech[] | undefined {
  const tags = card.tags ?? []
  const notes = card.notes ?? ''

  // Dual categories mentioned in notes
  if (/conjunction or noun/i.test(notes)) return ['conjunction', 'noun']

  if (tags.includes('verb') || /verbnoun|irregular vn/i.test(notes)) {
    return 'verb-noun'
  }
  if (tags.includes('noun')) return 'noun'
  if (tags.includes('adj')) return 'adjective'
  if (tags.includes('adv')) return 'adverb'
  if (tags.includes('prep')) return 'preposition'
  if (tags.includes('conj')) return 'conjunction'
  if (tags.includes('pron')) return 'pronoun'
  if (tags.includes('name')) return 'name'
  if (tags.includes('num')) return 'numeral'
  if (tags.includes('article')) return 'article'
  if (tags.includes('particle')) return 'particle'
  if (tags.includes('poss')) return 'possessive'
  if (tags.includes('place')) return 'place'
  if (tags.some((t) => PHRASE_TAGS.has(t))) return 'phrase'
  if (tags.includes('month') || tags.includes('season')) return 'noun'
  if (tags.includes('family') || tags.includes('people')) return 'noun'
  if (card.gender) return 'noun'
  if (/demonstrative/i.test(notes)) return 'pronoun'
  if (/place-name/i.test(notes)) return 'place'
  if (/personal name/i.test(notes)) return 'name'
  if (/conjunction/i.test(notes)) return 'conjunction'
  if (/imperative/i.test(notes)) return 'verb-noun'
  return undefined
}

/** Strip notes that only repeated POS (e.g. "Verbnoun."). */
export function cleanPosNotes(notes: string | undefined): string | undefined {
  if (!notes) return undefined
  let n = notes.trim()
  if (/^verbnoun\.?$/i.test(n)) return undefined
  n = n.replace(/^Irregular VN\.\s*/i, 'Irregular verb-noun. ')
  n = n.replace(/\bVerbnoun\b/gi, 'verb-noun')
  return n.trim() || undefined
}
