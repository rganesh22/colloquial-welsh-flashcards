/**
 * Step 5: swap the English loanwords in the sprint (rili, jyst, iwsio,
 * licio, grêt, eniwê…) for native Welsh. People in Y Wladfa speak Welsh and
 * Spanish, often not English, so the loanwords may not be understood there,
 * while an English speaker already understands them by ear in the videos.
 *
 *  1. Claude picks the loanwords and their native equivalents (cached in
 *     private/native.json; delete it to ask again).
 *  2. The word list is updated: a loanword becomes its native word, or is
 *     dropped when that word is already in the sprint (moved to this day if
 *     it was coming later).
 *  3. Every day whose Welsh used a loanword is rewritten with the native
 *     word (private/days/N.json), then checked for leftovers.
 * Then run step 3 to rebuild days.json and words.json from the days.
 *
 *   node scripts/sprint/5-native.mjs
 */
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { callJson, here, pool, privateDir } from './claude.mjs'
import { DAYS } from './syllabus.mjs'

const dataDir = join(here, '..', '..', 'src', 'data', 'sprint')
const dayDir = join(privateDir, 'days')

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?;:"“”()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const slug = (s) =>
  norm(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['/]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40)

const tokens = (text) =>
  text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .split(/[^a-zâêîôûŵŷäëïöüÿáéíóúẃýàèìòùẁỳ'-]+/)
    .flatMap((t) => t.split("'"))
    .filter(Boolean)

/** Soft / nasal / aspirate forms a loanword could appear in (sbio → sbio, ffeindio → ffeindio, trio → drio, licio → glicio…). */
function mutations(t) {
  const out = new Set([t])
  const map = [
    ['p', ['b', 'mh', 'ph']],
    ['t', ['d', 'nh', 'th']],
    ['c', ['g', 'ngh', 'ch']],
    ['b', ['f', 'm']],
    ['d', ['dd', 'n']],
    ['g', ['', 'ng']],
    ['m', ['f']],
    ['ll', ['l']],
    ['rh', ['r']],
  ]
  for (const [from, tos] of map) {
    if (t.startsWith(from)) for (const to of tos) out.add(to + t.slice(from.length))
  }
  return [...out].filter(Boolean)
}

// ---------- 1. which words are loanwords ----------

const PICK_SYSTEM = `You edit the vocabulary of a 50-day Welsh course for an English speaker going to Y Wladfa (Welsh Patagonia) to talk with locals. Patagonian Welsh speakers speak Welsh and Spanish; many know little English.

Find the words in the list that are English loanwords from casual Wales speech ("Wenglish") and have a common native Welsh equivalent, e.g. rili → wir / go iawn, jyst → dim ond, iwsio → defnyddio, licio → hoffi, ffeindio → dod o hyd i, trio → ceisio, grêt → gwych, lyfli → hyfryd, eniwê → beth bynnag, sortio → trefnu, watsiad → gwylio, sbeshial → arbennig, syportio → cefnogi, retirio → ymddeol, weitio → aros, mêt → ffrind, bys → bws.

Do NOT list: standard Welsh words that happen to come from English and have no everyday native rival (coffi, te, bws, siop, capel, banc, tocyn, ffilmio, fideo, camera, rygbi, golff, ffrind, problem, stopio, sêl); Spanish words used in Y Wladfa; names and places; words that are already native Welsh.

For each loanword give the native Welsh equivalent in dictionary form (verbs as verb-nouns), the kind a Patagonian Welsh speaker uses and understands, colloquial rather than literary. Prefer a word that is already in the list when it fits. "en": a short gloss (2–6 words).`

const pickSchema = {
  type: 'object',
  properties: {
    swaps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          loan: { type: 'string' },
          native: { type: 'string' },
          en: { type: 'string' },
          pos: { type: 'string' },
        },
      },
    },
  },
}

async function pickSwaps(words) {
  const path = join(privateDir, 'native.json')
  if (existsSync(path)) return JSON.parse(await readFile(path, 'utf8'))
  const res = await callJson({
    tag: 'loanwords',
    system: PICK_SYSTEM,
    user: `Words (id | Welsh | English | part of speech):\n${words.map((w) => `${w.id} | ${w.cy} | ${w.en} | ${w.pos}`).join('\n')}`,
    schema: pickSchema,
    effort: 'high',
  })
  const ids = new Set(words.map((w) => w.id))
  const swaps = res.swaps.filter((s) => ids.has(s.id) && norm(s.native) && norm(s.native) !== norm(s.loan))
  await writeFile(path, JSON.stringify(swaps, null, 1))
  return swaps
}

// ---------- 3. rewrite the days that use them ----------

const REWRITE_SYSTEM = `You edit one day of a Welsh learner's course (northern colloquial Welsh as understood in Y Wladfa). Some English loanwords are being replaced by native Welsh words. In every Welsh line, replace each loanword (in any mutated or inflected form) with its native equivalent, adjusting mutations, word order and verb forms so the Welsh stays correct and natural. Keep the English translations matching. Change nothing else: lines without a loanword stay exactly as they are.

Examples: return exactly one per NEW word, in the order given, each showing that word in its glossed sense. Keep the existing example for a word when it has no loanword; write a new short one (only KNOWN and NEW words) for a word that has none.

Do NOT introduce Welsh words the learner hasn't met: only KNOWN words, today's NEW words and their mutated or inflected forms.`

const cyEn = { type: 'object', properties: { cy: { type: 'string' }, en: { type: 'string' } } }
const daySchema = {
  type: 'object',
  properties: {
    examples: {
      type: 'array',
      items: { type: 'object', properties: { word: { type: 'string' }, cy: { type: 'string' }, en: { type: 'string' } } },
    },
    grammar: { type: 'object', properties: { explain: { type: 'string' }, examples: { type: 'array', items: cyEn } } },
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

function welshOf(d) {
  return [
    ...(d.examples ?? []).map((e) => e.cy),
    ...d.grammar.examples.map((e) => e.cy),
    ...d.build.map((e) => e.cy),
    ...d.story.lines.map((e) => e.cy),
    ...d.story.questions.flatMap((q) => [q.q, ...q.options]),
    ...d.speak.map((e) => e.cy),
  ]
}

async function main() {
  const words = JSON.parse(await readFile(join(dataDir, 'words.json'), 'utf8'))
  const swaps = await pickSwaps(words)
  console.log(`Loanwords: ${swaps.length}`)
  for (const s of swaps) console.log(`  ${s.loan} → ${s.native}`)

  // 2. Word list.
  const byId = new Map(words.map((w) => [w.id, w]))
  const loanTokens = new Map() // token → native (for finding and explaining)
  const touchedDays = new Set()
  const drop = new Set()
  for (const s of swaps) {
    const w = byId.get(s.id)
    if (!w || drop.has(w.id)) continue
    for (const f of [w.cy, ...(w.forms ?? [])]) {
      for (const t of tokens(f)) if (t.length > 1) for (const m of mutations(t)) loanTokens.set(m, s.native)
    }
    touchedDays.add(w.day)
    const twin = words.find((x) => x !== w && !drop.has(x.id) && norm(x.cy) === norm(s.native))
    if (twin) {
      // The native word is in the sprint already: keep one copy, on the earlier day.
      if (twin.day > w.day) {
        touchedDays.add(twin.day)
        twin.day = w.day
      }
      drop.add(w.id)
    } else {
      w.cy = s.native.trim()
      w.en = s.en.trim()
      w.id = `sp-${slug(s.native)}`
      w.forms = [norm(s.native)]
      w.note = `Instead of “${s.loan}” (English loan).`
      delete w.ex
    }
  }
  const next = words.filter((w) => !drop.has(w.id))
  const seen = new Set()
  for (const w of next) {
    if (seen.has(w.id)) w.id = `${w.id}-${w.day}`
    seen.add(w.id)
  }
  for (let d = 1; d <= DAYS; d++) next.filter((w) => w.day === d).forEach((w, i) => (w.n = i + 1))
  console.log(`Words: ${words.length} → ${next.length} (${drop.size} merged into a native word already in the sprint)`)

  // 3. Days that use a loanword, or whose word list changed.
  const hasLoan = (text) => tokens(text).some((t) => loanTokens.has(t))
  const days = []
  for (let d = 1; d <= DAYS; d++) {
    const day = JSON.parse(await readFile(join(dayDir, `${d}.json`), 'utf8'))
    if (touchedDays.has(d) || welshOf(day).some(hasLoan)) days.push(day)
  }
  console.log(`Days to rewrite: ${days.map((d) => d.day).join(', ')}`)
  const map = swaps.map((s) => `${s.loan} → ${s.native}`).join(', ')

  await pool(days, 6, async (day) => {
    const today = next.filter((w) => w.day === day.day)
    const before = next.filter((w) => w.day < day.day)
    const { day: _d, title, why, catchUp, reviewed, fixes, ...content } = day
    for (let attempt = 1; attempt <= 3; attempt++) {
      const res = await callJson({
        tag: `native ${day.day}`,
        system: REWRITE_SYSTEM,
        user: [
          `Day ${day.day}. Pattern: ${title} — ${why}`,
          `Replace: ${map}`,
          `NEW words (examples in this order): ${today.map((w) => `${w.cy} (${w.en})`).join(', ') || 'none'}`,
          `KNOWN words: ${before.map((w) => w.cy).join(', ')}`,
          '',
          'The day (JSON):',
          JSON.stringify(content, null, 1),
        ].join('\n'),
        schema: daySchema,
        effort: 'medium',
      })
      const out = { day: day.day, title, why, catchUp, ...res, reviewed, fixes }
      const left = welshOf(out).filter(hasLoan)
      const short =
        out.build.length < content.build.length ||
        out.story.lines.length < Math.ceil(content.story.lines.length * 0.7) ||
        out.story.questions.length < content.story.questions.length ||
        (!catchUp && out.examples.length < today.length)
      if ((left.length || short) && attempt < 3) {
        console.log(`  day ${day.day}: retry (${short ? 'sections shrank' : `still has: ${left.join(' / ')}`})`)
        continue
      }
      if (left.length) console.log(`  day ${day.day}: kept a loanword in: ${left.join(' / ')}`)
      await writeFile(join(dayDir, `${day.day}.json`), JSON.stringify(out, null, 1))
      return
    }
  })

  await writeFile(join(dataDir, 'words.json'), JSON.stringify(next, null, 1) + '\n')
  await writeFile(join(privateDir, 'native-applied.txt'), swaps.map((s) => `${s.loan} → ${s.native}`).join('\n') + '\n')
  console.log('Now run: node scripts/sprint/3-days.mjs')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
