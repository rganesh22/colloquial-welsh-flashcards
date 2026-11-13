/**
 * Step 3: each sprint day's content, written only with words you know by then
 * (plus that day's new words), checked in code and regenerated if it slips:
 *  - an example sentence for every new word
 *  - the day's pattern: a short explanation and examples
 *  - 6 "build the sentence" drills (English → Welsh)
 *  - an episode of a story about a trip to Y Wladfa, with 3 questions
 *  - 4 speaking prompts with a model answer
 * Writes src/data/sprint/days.json and adds `ex` to src/data/sprint/words.json.
 *
 *   node scripts/sprint/3-days.mjs            all days not yet made
 *   node scripts/sprint/3-days.mjs --redo 4   remake day 4
 */
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { callJson, here, pool, privateDir } from './claude.mjs'
import { DAYS, isCatchUp, SYLLABUS } from './syllabus.mjs'

const dataDir = join(here, '..', '..', 'src', 'data', 'sprint')
const dayDir = join(privateDir, 'days')
const args = process.argv.slice(2)
const redo = args.includes('--redo') ? Number(args[args.indexOf('--redo') + 1]) : null
/** --days 1,16: only these (for trying prompts). */
const only = args.includes('--days') ? args[args.indexOf('--days') + 1].split(',').map(Number) : null

// ---------- known-word check ----------

const ALWAYS = new Set(['n', 'r', 'y', 'yr', 'a', 'ac', 'i', 'o', 'na', 'ma', 'di', 'm', 's', 'w'])

export function tokens(text) {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\([^)]*\)/g, ' ')
    .split(/[^a-zâêîôûŵŷäëïöüÿáéíóúẃýàèìòùẁỳ'-]+/)
    .flatMap((t) => t.split("'"))
    .flatMap((t) => t.split('-'))
    .filter(Boolean)
}

/** Every unmutated spelling a token could come from. */
function unmutate(t) {
  const out = [t]
  const add = (s) => out.push(s)
  if (/^ngh/.test(t)) add('c' + t.slice(3))
  if (/^mh/.test(t)) add('p' + t.slice(2))
  if (/^nh/.test(t)) add('t' + t.slice(2))
  if (/^ng/.test(t)) add('g' + t.slice(2))
  if (/^ph/.test(t)) add('p' + t.slice(2))
  if (/^th/.test(t)) add('t' + t.slice(2))
  if (/^ch/.test(t)) add('c' + t.slice(2))
  if (/^dd/.test(t)) add('d' + t.slice(2))
  if (/^b/.test(t)) add('p' + t.slice(1))
  if (/^d(?!d)/.test(t)) add('t' + t.slice(1))
  if (/^g(?!h)/.test(t)) add('c' + t.slice(1))
  if (/^f(?!f)/.test(t)) {
    add('b' + t.slice(1))
    add('m' + t.slice(1))
  }
  if (/^l(?!l)/.test(t)) add('ll' + t.slice(1))
  if (/^r(?!h)/.test(t)) add('rh' + t.slice(1))
  if (/^m/.test(t)) add('b' + t.slice(1))
  if (/^n(?!g|h)/.test(t)) add('d' + t.slice(1))
  if (/^h[aeiouwyâêîôûŵŷ]/.test(t)) add(t.slice(1))
  if (/^[aeiouwylrâêîôûŵŷ]/.test(t)) add('g' + t)
  return out
}

function knownTokens(words) {
  const set = new Set(ALWAYS)
  for (const w of words) for (const f of [w.cy, ...(w.forms ?? [])]) for (const t of tokens(f)) set.add(t)
  return set
}

function unknownIn(text, known) {
  return tokens(text).filter((t) => !/^\d+$/.test(t) && !unmutate(t).some((c) => known.has(c)))
}

// ---------- prompts ----------

const OUTLINE_SYSTEM = `You write the outline of a 50-episode serialised story for a Welsh learner's 50-day sprint. The learner (call them "Alex", no gender needed: write in first person) is going to Y Wladfa (Welsh Patagonia) to film themself speaking Welsh with locals. Each day's episode is 8–12 very simple Welsh sentences, so each beat must be small and concrete.

Arc: getting ready at home and learning Welsh (days 1–12), the journey and arriving in Trelew/Gaiman (13–22), tea houses, the chapel, the school, a family with Mimosa roots, the Eisteddfod, Trevelin and the Andes (23–44), filming street interviews and saying goodbye (45–50). Catch-up days (7, 14, 21, 28, 35, 42, 49) are short recaps of the week. Each beat should naturally use that day's grammar pattern.`

const outlineSchema = {
  type: 'object',
  properties: {
    episodes: {
      type: 'array',
      items: { type: 'object', properties: { day: { type: 'integer' }, beat: { type: 'string' } } },
    },
  },
}

const DAY_SYSTEM = `You write one day of a 50-day Welsh sprint for an English speaker going to Y Wladfa (Welsh Patagonia). They study 1 hour a day and need to speak, listen and read.

Fill every section, every day. On the first days the learner knows very few words: very short sentences that reuse the same words are fine (that repetition is how they learn).

THE ONE HARD RULE: every Welsh sentence may use ONLY (a) words from the KNOWN list, (b) today's NEW words, and (c) their normal mutated forms (soft, nasal, aspirate, h-) and the inflected forms listed. No other Welsh words. No English words in Welsh sentences. If you can't say something with those words, say something simpler. Names from the story are fine.

Welsh: northern colloquial, as spoken: dw i'n, dach chi, isio, efo, gen i, 'na, wnes i. Mutations correct. Short sentences (4–10 words). Natural, not textbook.

English: natural and short. Grammar explanations: plain English, no jargon beyond "soft mutation", under 70 words.`

const dayContentSchema = {
  type: 'object',
  properties: {
    examples: {
      type: 'array',
      description: 'One per NEW word, same order, using that word.',
      items: { type: 'object', properties: { word: { type: 'string' }, cy: { type: 'string' }, en: { type: 'string' } } },
    },
    grammar: {
      type: 'object',
      properties: {
        explain: { type: 'string' },
        examples: {
          type: 'array',
          items: { type: 'object', properties: { cy: { type: 'string' }, en: { type: 'string' } } },
        },
      },
    },
    build: {
      type: 'array',
      description: '6 English sentences for the learner to say in Welsh, using today’s pattern.',
      items: { type: 'object', properties: { en: { type: 'string' }, cy: { type: 'string' } } },
    },
    story: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        lines: {
          type: 'array',
          items: { type: 'object', properties: { cy: { type: 'string' }, en: { type: 'string' } } },
        },
        questions: {
          type: 'array',
          description: '3 questions in Welsh about the episode, 3 Welsh options each.',
          items: {
            type: 'object',
            properties: {
              q: { type: 'string' },
              en: { type: 'string' },
              options: { type: 'array', items: { type: 'string' } },
              answer: { type: 'integer' },
            },
          },
        },
      },
    },
    speak: {
      type: 'array',
      description: '4 things to say out loud about yourself, with a model answer.',
      items: {
        type: 'object',
        properties: { prompt: { type: 'string' }, cy: { type: 'string' }, en: { type: 'string' } },
      },
    },
  },
}

function allWelsh(c) {
  return [
    ...c.examples.map((e) => e.cy),
    ...c.grammar.examples.map((e) => e.cy),
    ...c.build.map((b) => b.cy),
    ...c.story.lines.map((l) => l.cy),
    ...c.story.questions.flatMap((q) => [q.q, ...q.options]),
    ...c.speak.map((s) => s.cy),
  ]
}

async function makeDay(day, words, outline) {
  const path = join(dayDir, `${day}.json`)
  if (existsSync(path) && day !== redo) return JSON.parse(await readFile(path, 'utf8'))
  const [, title, why] = SYLLABUS[day - 1]
  const today = words.filter((w) => w.day === day)
  const before = words.filter((w) => w.day < day)
  const known = knownTokens([...before, ...today])
  const catchUp = isCatchUp(day)
  const beat = outline.find((e) => e.day === day)?.beat ?? ''
  const prevBeat = outline.find((e) => e.day === day - 1)?.beat ?? ''
  const base = [
    `Day ${day} of 50.${catchUp ? ' CATCH-UP DAY: no new words; review this week’s patterns.' : ''}`,
    `Pattern: ${title} — ${why}`,
    `Story so far (yesterday): ${prevBeat}`,
    `Today's episode: ${beat}`,
    '',
    `NEW words (${today.length}):`,
    ...today.map((w) => `- ${w.cy} — ${w.en}${w.forms?.length > 1 ? ` (forms: ${w.forms.filter((f) => f !== w.cy.toLowerCase()).join(', ')})` : ''}`),
    '',
    `KNOWN words (${before.length}): ${before.map((w) => w.cy).join(', ')}`,
    '',
    catchUp
      ? 'Return examples as an empty list.'
      : `Return exactly ${today.length} examples, one per NEW word, in order.`,
    'Story: 8–12 lines. Questions: 3. Build: 6. Speak: 4. Grammar examples: 4.',
  ].join('\n')

  let user = base
  let content
  for (let attempt = 0; attempt < 3; attempt++) {
    content = await callJson({ tag: `day ${day}${attempt ? ` retry ${attempt}` : ''}`, system: DAY_SYSTEM, user, schema: dayContentSchema, effort: 'medium' })
    const gaps = [
      !content.grammar.explain.trim() && 'the grammar explanation',
      content.grammar.examples.length < 3 && 'grammar examples',
      content.build.length < 5 && 'build sentences',
      content.story.lines.length < 6 && 'the story',
      content.story.questions.length < 2 && 'story questions',
      content.speak.length < 3 && 'speaking prompts',
      !catchUp && content.examples.length < today.length && 'an example for every new word',
    ].filter(Boolean)
    if (gaps.length) {
      console.log(`    day ${day}: missing ${gaps.join(', ')}`)
      user = `${base}

Your last attempt left out ${gaps.join(', ')}. Fill every section. With few known words, very short sentences that repeat the same words are fine.`
      continue
    }
    const bad = new Map()
    for (const s of allWelsh(content)) for (const t of unknownIn(s, known)) bad.set(t, (bad.get(t) ?? 0) + 1)
    if (bad.size <= 3) {
      if (bad.size) console.log(`    day ${day}: accepted with ${[...bad.keys()].join(', ')}`)
      break
    }
    console.log(`    day ${day}: unknown words ${[...bad.keys()].join(', ')}`)
    user = `${base}\n\nYour last attempt used words the learner doesn't know yet: ${[...bad.keys()].join(', ')}. Rewrite everything without them.`
  }
  const out = { day, title, why, catchUp, ...content }
  await writeFile(path, JSON.stringify(out, null, 1))
  return out
}

async function main() {
  const words = JSON.parse(await readFile(join(dataDir, 'words.json'), 'utf8'))
  await mkdir(dayDir, { recursive: true })

  const outlinePath = join(privateDir, 'outline.json')
  let outline
  if (existsSync(outlinePath)) outline = JSON.parse(await readFile(outlinePath, 'utf8'))
  else {
    const res = await callJson({
      tag: 'story outline',
      system: OUTLINE_SYSTEM,
      user: SYLLABUS.map(([d, t]) => `Day ${d}: ${t}`).join('\n'),
      schema: outlineSchema,
      effort: 'medium',
    })
    outline = res.episodes
    await writeFile(outlinePath, JSON.stringify(outline, null, 1))
  }

  const dayList = only ?? Array.from({ length: DAYS }, (_, i) => i + 1)
  const days = await pool(dayList, 6, (d) => makeDay(d, words, outline))

  // Example sentences onto the word list.
  for (const d of days) {
    const today = words.filter((w) => w.day === d.day)
    d.examples.forEach((e, i) => {
      const w = today.find((x) => x.cy.toLowerCase() === e.word.toLowerCase()) ?? today[i]
      if (w) w.ex = { cy: e.cy, en: e.en }
    })
  }
  const missing = words.filter((w) => !w.ex).length
  if (missing) console.log(`${missing} words have no example sentence.`)
  await writeFile(join(dataDir, 'words.json'), JSON.stringify(words, null, 1) + '\n')
  await writeFile(
    join(dataDir, 'days.json'),
    JSON.stringify(
      days.map(({ examples: _e, reviewed: _r, fixes: _f, ...d }) => d),
      null,
      1,
    ) + '\n',
  )
  console.log(`Wrote ${days.length} days.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
