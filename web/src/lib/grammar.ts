import type { AiKeys } from './gemini'
import type { ChapterGuide, GuideLine } from './chapterGuide'
import { generate, parseJson, VARIANTS } from './talk'

/**
 * The grammar track: Colloquial Welsh units 1a–15 spread over the 8 weeks,
 * each with a short read of the rules and a production drill (English in,
 * your Welsh out, Claude checks it). 'mix' days drill the B1 core together.
 */

/** Units whose patterns carry B1 speaking: past, future, perfect, if, passive, that-clauses. */
export const B1_CORE_UNITS = ['9', '10', '11', '12', '13', '14', '15']

/** What each unit adds, in plain words, for the level checklist. */
export const UNIT_SKILLS: Record<string, string> = {
  alphabet: 'Welsh sounds and spelling',
  '1a': 'Greetings, “I’m …”, my + family (fy + nasal mutation)',
  '1b': '“This is”, the three forms of “the”, ti and chi',
  '2a': 'Present tense of bod: dw i, wyt ti, mae e/hi…',
  '2b': 'Negatives (dw i ddim) and yes/no answers',
  '3': 'yn + description, “would you like”',
  '4': 'Aspirate and nasal mutation, “of” with two nouns',
  '5': 'Commands (-wch, peidiwch) and polite requests',
  '6': '“Can I have”, numbers with nouns, “I have” (gen i / gyda fi)',
  '7': 'Was (roedd), will be (bydd), echo answers',
  '8': 'Must (rhaid i), ought to (dylwn i), times',
  '9': 'Past tense: es i, ges i, wnes i, ddes i, -ais i',
  '10': 'Short future, suggestions, “I’d rather / I’d better”',
  '11': '“That” clauses (bod / y / mai), reasons, comparisons',
  '12': 'Perfect (dw i wedi) and pluperfect (ro’n i wedi)',
  '13': 'Passive with cael, “who” with sy, wedi/heb/newydd',
  '14': 'Conditional (baswn i / byddwn i), “if” (os / taswn i)',
  '15': 'Fronting for emphasis, gwybod vs nabod, impersonal -wyd',
  mix: 'Mixed B1 review',
}

export interface GrammarRule {
  title: string
  body: string
  examples: GuideLine[]
}

/** The rule blocks of a chapter guide (its grammar and pattern steps). */
export function guideRules(guide: ChapterGuide | undefined): GrammarRule[] {
  if (!guide) return []
  return guide.steps.flatMap((s) =>
    s.blocks.flatMap((b) =>
      b.type === 'rule' ? [{ title: b.title, body: b.body, examples: b.examples }] : [],
    ),
  )
}

export interface DrillItem {
  english: string
  /** A natural model answer. */
  welsh: string
  /** Which rule this practises, in a few words. */
  focus: string
}

export interface DrillCheck {
  correct: boolean
  /** The learner's sentence with the errors fixed, keeping their words. */
  better: string
  why: string
}

function rulesText(rules: GrammarRule[]): string {
  return rules
    .map(
      (r) =>
        `- ${r.title}: ${r.body}\n  e.g. ${r.examples
          .slice(0, 3)
          .map((e) => `${e.welsh} (${e.english})`)
          .join('; ')}`,
    )
    .join('\n')
}

const ITEMS_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          english: { type: 'string' },
          welsh: { type: 'string' },
          focus: { type: 'string' },
        },
        required: ['english', 'welsh', 'focus'],
      },
    },
  },
  required: ['items'],
}

const CHECK_SCHEMA = {
  type: 'object',
  properties: {
    correct: { type: 'boolean' },
    better: { type: 'string' },
    why: { type: 'string' },
  },
  required: ['correct', 'better', 'why'],
}

/** Six sentences to say in Welsh, each needing one of today's rules. */
export async function drillItems(opts: {
  keys: AiKeys
  model?: string
  unitTitle: string
  rules: GrammarRule[]
  week: number
  learner: string
  count?: number
}): Promise<DrillItem[]> {
  const n = opts.count ?? 6
  const text = await generate({
    keys: opts.keys,
    model: opts.model,
    temperature: 0.7,
    thinking: 'LOW',
    schema: ITEMS_SCHEMA,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `You write speaking drills for an adult learner of spoken Welsh (week ${opts.week} of an 8-week plan, aiming at B1 speaking for a trip to Y Wladfa, Patagonia). About them: ${opts.learner}

Today's grammar: ${opts.unitTitle}
${rulesText(opts.rules)}

Write ${n} short English sentences for them to SAY in Welsh. Each one must need one of the rules above (word the English so the target structure is the natural translation, e.g. "If I were rich, I'd…" for the conditional); cover every rule at least once, easy first, harder last. Make them about their real life and trip (work, family, India, learning Welsh, travelling to Gaiman, Trelew and Trevelin, meeting people), not textbook filler. Use only everyday words a learner at this stage knows, plus at most one new word per sentence.
- english: the sentence to translate.
- welsh: a natural spoken-Welsh answer in the same forms the rules teach (southern/standard learner forms; correct mutations).
- focus: the rule it practises, 2–5 words.`,
          },
        ],
      },
    ],
  })
  const r = parseJson<{ items?: Partial<DrillItem>[] }>(text)
  return (r.items ?? [])
    .filter((i) => i.english?.trim() && i.welsh?.trim())
    .slice(0, n)
    .map((i) => ({ english: i.english!.trim(), welsh: i.welsh!.trim(), focus: i.focus?.trim() ?? '' }))
}

/** Is the learner's Welsh right for this item? Variants and other good wordings count. */
export async function checkDrill(opts: {
  keys: AiKeys
  model?: string
  item: DrillItem
  attempt: string
  rules: GrammarRule[]
}): Promise<DrillCheck> {
  const text = await generate({
    keys: opts.keys,
    model: opts.model,
    temperature: 0,
    thinking: 'LOW',
    schema: CHECK_SCHEMA,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `A Welsh learner is practising this grammar: ${opts.item.focus}
Rules:
${rulesText(opts.rules)}

They had to say: "${opts.item.english}"
Model answer: "${opts.item.welsh}"
They said: "${opts.attempt}"

- correct: true if their Welsh is grammatical spoken Welsh that means the same thing, even if worded differently from the model. Ignore spelling slips, missing apostrophes or circumflexes, and capitals. Valid regional or register variants (${VARIANTS}) are correct. A wrong mutation, wrong verb form or wrong word order is not correct.
- better: if not correct, their sentence with only the errors fixed (keep their words); if correct, empty string.
- If it's correct but avoids the target rule (e.g. active voice for a passive item, os for taswn), set correct true and use why to show the target form.
- why: one short English line naming the rule (e.g. "Past tense: es i, not dw i'n mynd"); if correct, a short note only if a more natural option exists, else empty string.`,
          },
        ],
      },
    ],
  })
  const r = parseJson<Partial<DrillCheck>>(text)
  return { correct: Boolean(r.correct), better: r.better?.trim() ?? '', why: r.why?.trim() ?? '' }
}
