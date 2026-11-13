/**
 * Step 1: Easy Welsh subtitles (OCR'd from the videos' burned-in captions,
 * in private/lines/) → cleaned lines + every word each video uses.
 * Output stays in private/ (the transcripts are Easy Languages' work: kept
 * for study tooling, never shipped in the app).
 *
 *   node scripts/sprint/1-transcripts.mjs
 */
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { callJson, pool, privateDir } from './claude.mjs'

const POS = [
  'noun',
  'verb',
  'verb-form',
  'adjective',
  'adverb',
  'preposition',
  'conjunction',
  'pronoun',
  'particle',
  'numeral',
  'interjection',
  'phrase',
  'name',
  'place',
  'english',
]

const SYSTEM = `You clean OCR'd subtitles from "Easy Welsh" street-interview videos (northern colloquial Welsh) and list the vocabulary a learner needs to understand them.

Cleaning:
- Each line has the Welsh subtitle and its English translation. OCR mangled some characters: "dw in" → "dw i'n", "Iwcus" → "lwcus", "Ile" → "lle", "vfed" → "yfed", missing circumflexes (ŵ ŷ â ê î ô û), stray background text from shop signs ("BREWING CO", "WILD") glued onto the line. Fix only OCR damage, using the English as a guide. Keep the speaker's colloquial wording, English loanwords and the subtitler's (bracketed) corrections exactly.
- Some "lines" are junk read from on-screen logos and title cards ("EASY WELSH", "WELSH FROM THE STREETS", garbled symbols). Return those with cy and en both "".
- Return every line, same order and index, even if unchanged.

Vocabulary (from the cleaned Welsh):
- One entry per dictionary word, unmutated, in the form a learner would look up: verbs as the verb-noun ("yfed"), nouns singular, adjectives masculine/base form.
- ALSO give the high-value inflected forms their own entry with pos "verb-form": personal forms of bod (dw i, wyt ti, mae, ydy, dan ni, dach chi, maen nhw, oes, roedd, bydd, ...) and short-form past / future / conditional of common verbs (es i, ges i, wnes i, gest ti, bydda i, baswn i / faswn i, hoffwn i, ...).
- "forms": the exact spellings that appear in the video (mutated, inflected), lower-case.
- "count": how many times the word occurs in the video.
- "en": a short learner gloss (2–6 words) for the sense used in the video.
- "gender": "m" or "f" for nouns, otherwise "".
- "note": very short and only if useful (e.g. "north: isio; south: eisiau", "soft-mutates after"), otherwise "".
- English words used mid-sentence ("definitely", "coffee machine") → pos "english". People's names → "name". Place names → "place". Fillers (ym, yy, ww) → "interjection".`

const schema = {
  type: 'object',
  properties: {
    lines: {
      type: 'array',
      items: {
        type: 'object',
        properties: { i: { type: 'integer' }, cy: { type: 'string' }, en: { type: 'string' } },
      },
    },
    words: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          lemma: { type: 'string' },
          en: { type: 'string' },
          pos: { type: 'string', enum: POS },
          gender: { type: 'string', enum: ['m', 'f', ''] },
          forms: { type: 'array', items: { type: 'string' } },
          count: { type: 'integer' },
          note: { type: 'string' },
        },
      },
    },
  },
}

async function main() {
  const inDir = join(privateDir, 'lines')
  const outDir = join(privateDir, 'transcripts')
  await mkdir(outDir, { recursive: true })
  const titles = Object.fromEntries(
    (await readFile(join(privateDir, 'playlists.txt'), 'utf8'))
      .split('\n')
      .filter(Boolean)
      .map((l) => l.split('|'))
      .map(([id, title]) => [id, title]),
  )
  const files = (await readdir(inDir)).filter((f) => f.endsWith('.json'))
  const todo = files.filter((f) => !existsSync(join(outDir, f)))
  console.log(`Videos: ${files.length} · to clean: ${todo.length}`)
  await pool(todo, 4, async (f) => {
    const id = f.replace('.json', '')
    const lines = JSON.parse(await readFile(join(inDir, f), 'utf8'))
    const user = `Video: ${titles[id] ?? id}\n\nLines (index | Welsh | English):\n${lines
      .map((l, i) => `${i} | ${l.cy} | ${l.en}`)
      .join('\n')}`
    const res = await callJson({ tag: `transcript ${id}`, system: SYSTEM, user, schema, effort: 'medium' })
    const cleaned = lines
      .map((l, i) => {
        const fixed = res.lines.find((x) => x.i === i)
        return { start: l.start, end: l.end, cy: fixed?.cy ?? l.cy, en: fixed?.en ?? l.en }
      })
      .filter((l) => l.cy.trim())
    await writeFile(
      join(outDir, f),
      JSON.stringify({ id, title: titles[id] ?? id, lines: cleaned, words: res.words }, null, 1),
    )
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
