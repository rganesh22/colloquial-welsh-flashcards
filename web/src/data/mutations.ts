/** Welsh initial consonant mutations — Colloquial Welsh (Lesson 3–4). */

export type MutationCell = string // mutated form, '—' (unaffected), or '∅'

export interface MutationRow {
  radical: string
  soft: MutationCell
  aspirate: MutationCell
  nasal: MutationCell
  example?: string
}

/** Full chart: radical → Soft / Aspirate / Nasal */
export const MUTATION_ROWS: MutationRow[] = [
  {
    radical: 'c',
    soft: 'g',
    aspirate: 'ch',
    nasal: 'ngh',
    example: 'cariad → gariad / chariad / nghariad',
  },
  {
    radical: 'p',
    soft: 'b',
    aspirate: 'ph',
    nasal: 'mh',
    example: 'plant → blant / phlant / mhlant',
  },
  {
    radical: 't',
    soft: 'd',
    aspirate: 'th',
    nasal: 'nh',
    example: 'tad → dad / thad / nhad',
  },
  {
    radical: 'g',
    soft: '∅',
    aspirate: '—',
    nasal: 'ng',
    example: 'gardd → ardd / — / ngardd',
  },
  {
    radical: 'b',
    soft: 'f',
    aspirate: '—',
    nasal: 'm',
    example: 'bara → fara / — / mara',
  },
  {
    radical: 'd',
    soft: 'dd',
    aspirate: '—',
    nasal: 'n',
    example: 'dyn → ddyn / — / nyn',
  },
  {
    radical: 'll',
    soft: 'l',
    aspirate: '—',
    nasal: '—',
    example: 'llan → lan',
  },
  {
    radical: 'm',
    soft: 'f',
    aspirate: '—',
    nasal: '—',
    example: 'mam → fam',
  },
  {
    radical: 'rh',
    soft: 'r',
    aspirate: '—',
    nasal: '—',
    example: 'rhosyn → rosyn',
  },
]

export const MUTATION_TYPES = [
  {
    id: 'soft' as const,
    short: 'SM',
    cy: 'Treiglad meddal',
    en: 'Soft mutation',
    note: 'Most common (~90% of spoken mutations). Marked ° in early lessons.',
  },
  {
    id: 'aspirate' as const,
    short: 'AM',
    cy: 'Treiglad llaes',
    en: 'Aspirate mutation',
    note: 'Only c → ch, p → ph, t → th. After a, â, gyda, ei (her), chwe, tri, tua.',
  },
  {
    id: 'nasal' as const,
    short: 'NM',
    cy: 'Treiglad trwynol',
    en: 'Nasal mutation',
    note: 'Mainly after fy (my) and yn (in) + place. Less consistent in speech.',
  },
]

/** Soft mutation alone — useful quick reference (Lesson 3 reminder). */
export const SOFT_ONLY: { from: string; to: string }[] = [
  { from: 'b', to: 'f' },
  { from: 'c', to: 'g' },
  { from: 'd', to: 'dd' },
  { from: 'g', to: '∅' },
  { from: 'll', to: 'l' },
  { from: 'm', to: 'f' },
  { from: 'p', to: 'b' },
  { from: 'rh', to: 'r' },
  { from: 't', to: 'd' },
]
