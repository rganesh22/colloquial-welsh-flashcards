/**
 * Step 7: fill the gaps, using the room that 30 words a day gives.
 *
 *  1. Verbs: Claude lists the ~220 most useful verbs for conversation; any the
 *     sprint doesn't teach (darllen, ysgrifennu…) are added, most useful first.
 *  2. North and South: the course is in northern colloquial Welsh. Words with a
 *     different southern form (rŵan/nawr, efo/gyda, isio/moyn, llefrith/llaeth…)
 *     get their southern twin, with a note on what Y Wladfa says. Y Wladfa's
 *     Welsh mixes both (Iwan Wyn Rees, Gwerddon 36, 2024).
 *  Both are cached in private/verbs.json and private/dialect.json.
 *  New words go on the first day from OPEN_FROM with room (30 a day, not on
 *  catch-up days), dialect twins next to their word when it's still to come.
 *  Each gets an example sentence that only uses words known by its day.
 * Then run step 3 to rebuild days.json and words.json from the days.
 *
 *   node scripts/sprint/7-more.mjs
 */
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { callJson, here, pool, privateDir } from './claude.mjs'
import { DAYS, isCatchUp, NEW_PER_DAY } from './syllabus.mjs'
import { addNote, norm, slug, writeExamples } from './6-twins.mjs'

const dataDir = join(here, '..', '..', 'src', 'data', 'sprint')
const dayDir = join(privateDir, 'days')
const OPEN_FROM = 13
/** Words a day (CAP=32 to squeeze in the last verbs). */
const CAP = Number(process.env.CAP ?? NEW_PER_DAY)

const VERB_SYSTEM = `You help plan a Welsh course for an English speaker going to Y Wladfa (Welsh Patagonia) to talk with locals and film street interviews. They need everyday conversation: talking about themselves, their day, travel, food, family, work, feelings and plans, and asking people about theirs.

List the 220 most useful Welsh verbs for that, most useful first, as verb-nouns in the form used in speech (deud is fine alongside dweud; give one main form). Include the basics everyone needs (bod, mynd, dod, gwneud, cael, gweld, darllen, ysgrifennu, bwyta, yfed, cysgu, gweithio, prynu, talu, agor, cau, eistedd, sefyll, cerdded, rhedeg…) and the common verbs of feeling, thinking, talking, moving, home life and travel. Phrasal ones count when they are the normal way to say it (dod o hyd i, gwrando ar, edrych ar, aros am). "en": "to …" (2–5 words).`

const verbSchema = {
  type: 'object',
  properties: {
    verbs: { type: 'array', items: { type: 'object', properties: { cy: { type: 'string' }, en: { type: 'string' } } } },
  },
}

const DIALECT_SYSTEM = `You edit a Welsh course written in northern colloquial Welsh for a learner going to Y Wladfa (Welsh Patagonia). They want to know the southern equivalents too, and which one people in Y Wladfa use.

What research says about Y Wladfa (Iwan Wyn Rees, Gwerddon 36, 2024, building on R. O. Jones):
- Fixed in Y Wladfa, northern: allan, brifo, budr, cur pen, fo, nain, taid, i fyny, prysur, llwynog, dolur gwddw.
- Fixed in Y Wladfa, southern: llaeth (not llefrith), ffwrn, march, ffein, ffroes, and "mae gyda fi / mae gyda fo" for possession.
- Both, even from the same speaker: rŵan ~ nawr, efo ~ gyda, goriad ~ allwedd, nionod ~ winwns, dodrefn ~ celfi, ffisig ~ moddion, cadach ~ clwtyn.
- Overall a mix, a bit more northern in vocabulary; younger learners there now hear more southern forms from teachers from Wales.
For words not covered above, say "unknown" unless you are confident.

From the list, find each word or phrase whose everyday southern form is different (rŵan → nawr, isio → moyn / eisiau, efo → gyda, gen i → gyda fi, dach chi → dych chi, hogyn → bachgen, allan → mas, i fyny → lan, llefrith → llaeth, be → beth, lle (where) → ble, sut → shwt, deud → dweud, pres → arian…), and also any southern word in the list with a different northern form. Skip pairs that only differ by a tiny pronunciation not shown in spelling.

For each: "id" of the word in the list, "word" as in the list, "twin" (the other region's form, as people say and write it colloquially), "en" (2–6 words), "region" of the twin ("south" or "north"), "wladfa": "north", "south", "both" or "unknown" (which form Y Wladfa uses).`

const dialectSchema = {
  type: 'object',
  properties: {
    pairs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          word: { type: 'string' },
          twin: { type: 'string' },
          en: { type: 'string' },
          region: { type: 'string', enum: ['south', 'north'] },
          wladfa: { type: 'string', enum: ['north', 'south', 'both', 'unknown'] },
        },
      },
    },
  },
}

async function cached(name, make) {
  const path = join(privateDir, name)
  if (existsSync(path)) return JSON.parse(await readFile(path, 'utf8'))
  const out = await make()
  await writeFile(path, JSON.stringify(out, null, 1))
  return out
}

function wladfaNote(wladfa, north, south) {
  if (wladfa === 'both') return 'Y Wladfa: both are used.'
  if (wladfa === 'north') return `Y Wladfa: mostly “${north}”.`
  if (wladfa === 'south') return `Y Wladfa: mostly “${south}”.`
  return ''
}

async function main() {
  const words = JSON.parse(await readFile(join(dataDir, 'words.json'), 'utf8'))
  const has = (cy) => words.find((w) => norm(w.cy) === norm(cy) || (w.forms ?? []).some((f) => norm(f) === norm(cy)))

  const count = new Map()
  for (const w of words) count.set(w.day, (count.get(w.day) ?? 0) + 1)
  /** The first open day from `from` with room. */
  const roomFrom = (from) => {
    for (let d = Math.max(from, OPEN_FROM); d <= DAYS; d++) {
      if (!isCatchUp(d) && (count.get(d) ?? 0) < CAP) return d
    }
    return null
  }
  const added = []
  const add = (w, from) => {
    const day = roomFrom(from)
    if (!day) return false
    w.day = day
    count.set(day, (count.get(day) ?? 0) + 1)
    words.push(w)
    added.push(w)
    return true
  }

  // 2 first (twins sit next to their word), then 1 (verbs fill the room left, earliest first).
  const { pairs } = await cached('dialect.json', () =>
    callJson({
      tag: 'north-south',
      system: DIALECT_SYSTEM,
      user: `Words (id | Welsh | English):\n${words.map((w) => `${w.id} | ${w.cy} | ${w.en}`).join('\n')}`,
      schema: dialectSchema,
      effort: 'high',
    }),
  )
  let twins = 0
  for (const p of pairs) {
    const w = words.find((x) => x.id === p.id)
    if (!w || norm(p.twin) === norm(w.cy)) continue
    const [north, south] = p.region === 'south' ? [w.cy, p.twin] : [p.twin, w.cy]
    const where = wladfaNote(p.wladfa, north, south)
    let twin = has(p.twin)
    if (!twin) {
      twin = { id: `sp-${slug(p.twin)}`, cy: p.twin.trim(), en: p.en.trim(), pos: w.pos, forms: [norm(p.twin)] }
      if (!add(twin, w.day)) continue
      twins++
    }
    const other = p.region === 'south' ? 'South Wales' : 'North Wales'
    const mine = p.region === 'south' ? 'North Wales' : 'South Wales'
    addNote(w, `${other}: ${twin.cy}. ${where}`.trim())
    addNote(twin, `${mine}: ${w.cy}. ${where}`.trim())
  }
  console.log(`North/South pairs: ${pairs.length} (${twins} twins added).`)

  const { verbs } = await cached('verbs.json', () =>
    callJson({ tag: 'top verbs', system: VERB_SYSTEM, user: 'List them.', schema: verbSchema, effort: 'high' }),
  )
  const missing = verbs.filter((v) => !has(v.cy))
  let verbsAdded = 0
  for (const v of missing) {
    if (has(v.cy)) continue
    if (add({ id: `sp-${slug(v.cy)}`, cy: v.cy.trim(), en: v.en.trim(), pos: 'verb', forms: [norm(v.cy)] }, OPEN_FROM)) verbsAdded++
  }
  console.log(`Top verbs: ${verbs.length}, ${verbs.length - missing.length} already taught, ${verbsAdded} added.`)
  const left = missing.length - verbsAdded
  if (left > 0) console.log(`  ${left} didn't fit: ${missing.filter((v) => !has(v.cy)).map((v) => v.cy).join(', ')}`)

  // Unique ids, numbered within each day.
  const seen = new Set()
  for (const w of words) {
    if (seen.has(w.id)) w.id = `${w.id}-${w.day}`
    seen.add(w.id)
  }
  words.sort((a, b) => a.day - b.day || (a.n ?? 999) - (b.n ?? 999))
  for (let d = 1; d <= DAYS; d++) words.filter((w) => w.day === d).forEach((w, i) => (w.n = i + 1))

  const days = [...new Set(added.map((w) => w.day))].sort((a, b) => a - b)
  await pool(days, 6, async (day) => {
    const need = added.filter((w) => w.day === day)
    const examples = await writeExamples(day, need, words)
    const path = join(dayDir, `${day}.json`)
    const file = JSON.parse(await readFile(path, 'utf8'))
    const names = new Set(need.map((w) => norm(w.cy)))
    file.examples = [...(file.examples ?? []).filter((e) => !names.has(norm(e.word))), ...examples]
    await writeFile(path, JSON.stringify(file, null, 1))
  })

  await writeFile(join(dataDir, 'words.json'), JSON.stringify(words, null, 1) + '\n')
  await writeFile(
    join(privateDir, 'more-applied.txt'),
    added.map((w) => `day ${w.day}  ${w.cy} — ${w.en}${w.note ? `  [${w.note}]` : ''}`).join('\n') + '\n',
  )
  console.log(`Words: ${words.length}. Now run: node scripts/sprint/3-days.mjs`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
