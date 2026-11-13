/**
 * Step 4: a fresh reviewer checks each generated day and fixes mistakes:
 * Welsh grammar, mutations and spelling, translations, examples that don't
 * show their word, story questions with no single right answer, build
 * sentences whose English allows a different Welsh word order.
 * Rewrites private/days/N.json (marked reviewed); then re-run step 3 to
 * rebuild days.json and words.json from them.
 *
 *   node scripts/sprint/4-review.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { callJson, here, pool, privateDir } from './claude.mjs'
import { DAYS } from './syllabus.mjs'

const dataDir = join(here, '..', '..', 'src', 'data', 'sprint')

const SYSTEM = `You are a careful native-speaker editor of Welsh learning material (northern colloquial Welsh, as spoken in Gwynedd and widely understood in Y Wladfa). You check one day of a learner's course and return it corrected.

Check and fix:
1. Welsh errors: mutations (soft, nasal, aspirate, h-), spelling, word order, verb forms, gender agreement, "yn" before nouns/adjectives, unnatural phrasing. Keep it colloquial (dw i'n, dach chi, isio, efo, gen i, 'na, wnes i); don't make it literary.
2. English: each translation must match its Welsh exactly in meaning and tense.
3. Examples: each must use its word in the sense given in its gloss.
4. Build sentences: the learner rebuilds the Welsh from shuffled word tiles, so the English must point to ONE natural Welsh word order. Rephrase the English (or the Welsh) where another order would be just as right.
5. Story: lines consistent with each other. Each question must have exactly one correct option, answerable from the story, and "answer" must be its 0-based index.
6. Speaking prompts: the model answer must answer the prompt.

Do NOT add Welsh words the learner hasn't met: only words from the KNOWN list, today's NEW words, and their mutated or inflected forms. Change as little as needed; if something is fine, keep it exactly. List each change briefly in "fixes" (empty if none).`

const cyEn = { type: 'object', properties: { cy: { type: 'string' }, en: { type: 'string' } } }
const schema = {
  type: 'object',
  properties: {
    fixes: { type: 'array', items: { type: 'string' } },
    examples: {
      type: 'array',
      items: { type: 'object', properties: { word: { type: 'string' }, cy: { type: 'string' }, en: { type: 'string' } } },
    },
    grammar: {
      type: 'object',
      properties: { explain: { type: 'string' }, examples: { type: 'array', items: cyEn } },
    },
    build: { type: 'array', items: cyEn },
    story: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        lines: { type: 'array', items: cyEn },
        questions: {
          type: 'array',
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
      items: { type: 'object', properties: { prompt: { type: 'string' }, cy: { type: 'string' }, en: { type: 'string' } } },
    },
  },
}

async function review(day, words) {
  const path = join(privateDir, 'days', `${day}.json`)
  const d = JSON.parse(await readFile(path, 'utf8'))
  if (d.reviewed) return { day, fixes: d.fixes ?? [] }
  const today = words.filter((w) => w.day === day)
  const before = words.filter((w) => w.day < day)
  const { day: _d, title, why, catchUp, reviewed: _r, fixes: _f, ...content } = d
  const user = [
    `Day ${day}. Pattern: ${title} — ${why}${catchUp ? ' (catch-up day: no new words)' : ''}`,
    `NEW words: ${today.map((w) => `${w.cy} (${w.en})`).join(', ') || 'none'}`,
    `KNOWN words: ${before.map((w) => w.cy).join(', ')}`,
    '',
    'The day (JSON):',
    JSON.stringify(content, null, 1),
  ].join('\n')
  const res = await callJson({ tag: `review ${day}`, system: SYSTEM, user, schema, effort: 'high' })
  const { fixes, ...fixed } = res
  // Keep the original section only if the reviewer dropped a lot of it
  // (cutting a contradictory line or two is a legitimate fix).
  const keep = (a, b) => (Array.isArray(a) && Array.isArray(b) && b.length < Math.ceil(a.length * 0.7) ? a : b)
  const out = {
    day,
    title,
    why,
    catchUp,
    examples: keep(content.examples, fixed.examples),
    grammar: { explain: fixed.grammar.explain || content.grammar.explain, examples: keep(content.grammar.examples, fixed.grammar.examples) },
    build: keep(content.build, fixed.build),
    story: {
      title: fixed.story.title || content.story.title,
      lines: keep(content.story.lines, fixed.story.lines),
      questions: keep(content.story.questions, fixed.story.questions),
    },
    speak: keep(content.speak, fixed.speak),
    reviewed: true,
    fixes,
  }
  await writeFile(path, JSON.stringify(out, null, 1))
  return { day, fixes }
}

async function main() {
  const words = JSON.parse(await readFile(join(dataDir, 'words.json'), 'utf8'))
  const days = Array.from({ length: DAYS }, (_, i) => i + 1)
  const results = await pool(days, 6, (d) => review(d, words))
  const all = results.flatMap((r) => r.fixes.map((f) => `day ${r.day}: ${f}`))
  await writeFile(join(privateDir, 'review-fixes.txt'), all.join('\n') + '\n')
  console.log(`Reviewed ${results.length} days, ${all.length} fixes (private/review-fixes.txt).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
