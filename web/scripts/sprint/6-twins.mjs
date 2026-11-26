/**
 * Step 6: learn both. Every English-derived word in the sprint (jyst, licio,
 * helpu, ffonio…) is paired with a native Welsh twin, so you understand the
 * loanword when you hear it and can say it without English if you want.
 *
 *  1. The loanwords step 5 swapped out come back (with their old ids, so any
 *     progress on them returns), next to their native word.
 *  2. Claude lists the other English-derived words and a native twin for each
 *     (cached in private/twins.json; delete it to ask again).
 *  3. A twin that isn't in the sprint is added on the loanword's day. Days you
 *     may already have done (up to OPEN_FROM - 1) aren't changed: their twins
 *     go a few at a time onto the next days instead.
 *  4. Each added or moved word gets an example sentence that uses only words
 *     known by its day (written into private/days/N.json).
 * Then run step 3 to rebuild days.json and words.json from the days.
 *
 *   node scripts/sprint/6-twins.mjs
 */
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { callJson, here, pool, privateDir } from './claude.mjs'
import { DAYS, isCatchUp } from './syllabus.mjs'
import { knownTokens, unknownIn } from './3-days.mjs'

const dataDir = join(here, '..', '..', 'src', 'data', 'sprint')
const dayDir = join(privateDir, 'days')
/** The first day that may not have been started yet. Earlier days keep their words. */
const OPEN_FROM = 13
/** At most this many extra words on a day that takes twins from earlier days. */
const SPILL_PER_DAY = 4
/** Step 5 swaps not worth restoring: "bys" is Welsh for finger. */
const SKIP_LOANS = new Set(['bys'])

export const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?;:"“”()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

export const slug = (s) =>
  norm(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['/]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40)

// ---------- 2. which words come from English ----------

const PICK_SYSTEM = `You edit the vocabulary of a 50-day Welsh course for an English speaker going to Y Wladfa (Welsh Patagonia). Many Patagonian Welsh speakers know Welsh and Spanish but little English, and the learner wants to be able to speak without any English-derived words if they choose. They will still learn the English-derived word too (it is common in Wales and in the course's videos); you are finding its native partner.

From the list, find every word or phrase borrowed from English — recent ("Wenglish": rili, jyst, ffeindio) or long established (helpu, ffonio, iawn is NOT English, ffrind, problem, stopio, mynd am dro is native) — that has a native Welsh equivalent a Welsh speaker in Y Wladfa would understand and could use in conversation. Examples: helpu → cynorthwyo, ffrind → cyfaill, stopio → aros, problem → anhawster, ffonio → galw (ar y ffôn), parcio → (none good: skip), dreifio → gyrru, mwynhau is native (skip).

Rules:
- Prefer colloquial native words. A somewhat formal native word is fine when it is the only native option, as long as people would understand it in speech (say so in "note").
- Prefer a native word that is already in the list when it fits.
- Skip words with no everyday native rival (te, coffi, bws, siop, capel, banc, tocyn, fideo, camera, rygbi, golff), Latin/Greek-era borrowings that are simply Welsh (ffenest, eglwys, llyfr, pont, cyfaill), Spanish words, names and places, and words already native.
- Give the native word in dictionary form (verbs as verb-nouns). "en": short gloss (2–6 words). "note": under 15 words, only if useful (e.g. "a bit formal but understood everywhere").`

const pickSchema = {
  type: 'object',
  properties: {
    twins: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          loan: { type: 'string' },
          native: { type: 'string' },
          en: { type: 'string' },
          pos: { type: 'string' },
          note: { type: 'string' },
        },
      },
    },
  },
}

async function pickTwins(words, paired) {
  const path = join(privateDir, 'twins.json')
  if (existsSync(path)) return JSON.parse(await readFile(path, 'utf8'))
  const list = words.filter((w) => !paired.has(w.id))
  const res = await callJson({
    tag: 'english-derived',
    system: PICK_SYSTEM,
    user: `Words (id | Welsh | English | part of speech):\n${list.map((w) => `${w.id} | ${w.cy} | ${w.en} | ${w.pos}`).join('\n')}`,
    schema: pickSchema,
    effort: 'high',
  })
  const ids = new Set(list.map((w) => w.id))
  const twins = res.twins.filter((t) => ids.has(t.id) && norm(t.native) && norm(t.native) !== norm(t.loan))
  await writeFile(path, JSON.stringify(twins, null, 1))
  return twins
}

// ---------- 4. example sentences ----------

const EX_SYSTEM = `You write example sentences for a Welsh learner's flashcards (northern colloquial Welsh as understood in Y Wladfa: dw i'n, dach chi, isio, efo, gen i).

One short, natural sentence (4–9 words) per word, using that word in its glossed sense, with an English translation. THE ONE HARD RULE: use only KNOWN words, the listed words themselves, and their normal mutated and inflected forms. Names from Y Wladfa are fine.`

const exSchema = {
  type: 'object',
  properties: {
    examples: {
      type: 'array',
      items: { type: 'object', properties: { word: { type: 'string' }, cy: { type: 'string' }, en: { type: 'string' } } },
    },
  },
}

export async function writeExamples(day, need, words) {
  const known = knownTokens(words.filter((w) => w.day <= day))
  const before = words.filter((w) => w.day < day || (w.day === day && !need.includes(w)))
  let user = [
    `Words (${need.length}), one example each, in this order:`,
    ...need.map((w) => `- ${w.cy} — ${w.en}${w.note ? ` (${w.note})` : ''}`),
    '',
    `KNOWN words: ${before.map((w) => w.cy).join(', ')}`,
  ].join('\n')
  let out = []
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await callJson({ tag: `twin examples ${day}`, system: EX_SYSTEM, user, schema: exSchema, effort: 'medium' })
    out = need.map((w, i) => {
      const e = res.examples.find((x) => norm(x.word) === norm(w.cy)) ?? res.examples[i]
      return e && { word: w.cy, cy: e.cy, en: e.en }
    })
    const bad = new Set(out.flatMap((e) => (e ? unknownIn(e.cy, known) : [])))
    if (out.every(Boolean) && bad.size === 0) break
    if (attempt < 3) {
      console.log(`  day ${day}: retry (${bad.size ? `unknown: ${[...bad].join(', ')}` : 'missing examples'})`)
      user += `\n\nYour last attempt ${bad.size ? `used words the learner doesn't know: ${[...bad].join(', ')}` : 'left a word out'}. Try again.`
    } else if (bad.size) console.log(`  day ${day}: kept with ${[...bad].join(', ')}`)
  }
  return out.filter(Boolean)
}

// ---------- main ----------

export function addNote(w, text) {
  if (!w.note?.includes(text)) w.note = w.note ? `${w.note} ${text}` : text
}

async function main() {
  const words = JSON.parse(await readFile(join(dataDir, 'words.json'), 'utf8'))
  const old = JSON.parse(await readFile(join(privateDir, 'backup-before-native', 'words.json'), 'utf8'))
  const swaps = JSON.parse(await readFile(join(privateDir, 'native.json'), 'utf8'))
  const find = (cy) => words.find((w) => norm(w.cy) === norm(cy) || (w.forms ?? []).some((f) => norm(f) === norm(cy)))

  /** Words that need a (new) example sentence. */
  const needEx = new Set()
  /** Words that must go on a day you may not have done yet, but come from one you have. */
  const spill = []
  const paired = new Set()

  const place = (w, day) => {
    if (day < OPEN_FROM) spill.push(w)
    else w.day = isCatchUp(day) ? day + 1 : day
  }

  // 1. Restore step 5's loanwords, one per native word (licio, not also lico).
  const restored = new Map()
  for (const s of swaps) {
    if (SKIP_LOANS.has(s.loan)) continue
    const native = find(s.native)
    const was = old.find((w) => w.id === s.id)
    if (!native || !was) continue
    const twin = restored.get(native.id)
    if (twin) {
      twin.forms = [...new Set([...(twin.forms ?? []), ...(was.forms ?? [norm(was.cy)])])]
      continue
    }
    const { ex: _ex, n: _n, ...back } = was
    const w = { ...back }
    restored.set(native.id, w)
    words.push(w)
    needEx.add(w)
    paired.add(w.id).add(native.id)
    addNote(w, `From English. Welsh word: ${native.cy}.`)
    addNote(native, `Also heard: ${w.cy} (from English).`)
    // Kept where it was if you could already have learned it; otherwise next to its native word.
    if (was.day < OPEN_FROM) w.day = was.day
    else place(w, native.day)
  }
  console.log(`Restored ${restored.size} loanwords.`)

  // 2–3. Every other English-derived word gets a native twin.
  const twins = await pickTwins(words, paired)
  let added = 0
  let moved = 0
  for (const t of twins) {
    const loan = words.find((w) => w.id === t.id)
    if (!loan) continue
    let native = find(t.native)
    if (native) {
      // Already in the sprint: make sure it isn't much later than its loanword.
      if (native.day > Math.max(loan.day, OPEN_FROM - 1) + 7) {
        place(native, loan.day)
        needEx.add(native)
        moved++
      }
    } else {
      native = {
        id: `sp-${slug(t.native)}`,
        day: loan.day,
        cy: t.native.trim(),
        en: t.en.trim(),
        pos: t.pos,
        forms: [norm(t.native)],
      }
      words.push(native)
      needEx.add(native)
      place(native, loan.day)
      added++
    }
    addNote(loan, `From English. Welsh word: ${native.cy}.`)
    addNote(native, `Also heard: ${loan.cy} (from English).${t.note ? ` ${t.note}` : ''}`)
  }
  console.log(`English-derived words: ${twins.length} (${added} native twins added, ${moved} moved earlier).`)

  // Twins of words on days you may have done go a few at a time onto the next days.
  let d = OPEN_FROM
  let onDay = 0
  for (const w of spill) {
    while (isCatchUp(d) || onDay >= SPILL_PER_DAY) {
      d++
      onDay = 0
    }
    w.day = d
    onDay++
  }
  if (spill.length) console.log(`${spill.length} twins of earlier words go on days ${OPEN_FROM}–${d}.`)

  // Unique ids, numbered within each day.
  const seen = new Set()
  for (const w of words) {
    if (seen.has(w.id)) w.id = `${w.id}-${w.day}`
    seen.add(w.id)
  }
  words.sort((a, b) => a.day - b.day || (a.n ?? 999) - (b.n ?? 999))
  for (let day = 1; day <= DAYS; day++) words.filter((w) => w.day === day).forEach((w, i) => (w.n = i + 1))

  // 4. Example sentences, written into each day's file (step 3 copies them onto the words).
  const days = [...new Set([...needEx].map((w) => w.day))].sort((a, b) => a - b)
  await pool(days, 6, async (day) => {
    const need = [...needEx].filter((w) => w.day === day)
    const examples = await writeExamples(day, need, words)
    const path = join(dayDir, `${day}.json`)
    const file = JSON.parse(await readFile(path, 'utf8'))
    const names = new Set(need.map((w) => norm(w.cy)))
    file.examples = [...(file.examples ?? []).filter((e) => !names.has(norm(e.word))), ...examples]
    await writeFile(path, JSON.stringify(file, null, 1))
  })
  // A moved word's old example stays behind on its old day; drop it there.
  for (let day = 1; day <= DAYS; day++) {
    const path = join(dayDir, `${day}.json`)
    const file = JSON.parse(await readFile(path, 'utf8'))
    const here = new Set(words.filter((w) => w.day === day).map((w) => norm(w.cy)))
    const kept = (file.examples ?? []).filter((e) => here.has(norm(e.word)))
    if (kept.length !== (file.examples ?? []).length) {
      file.examples = kept
      await writeFile(path, JSON.stringify(file, null, 1))
    }
  }

  await writeFile(join(dataDir, 'words.json'), JSON.stringify(words, null, 1) + '\n')
  const pairs = words.filter((w) => w.note?.includes('From English. Welsh word:'))
  await writeFile(
    join(privateDir, 'twins-applied.txt'),
    pairs.map((w) => `day ${w.day}  ${w.cy} → ${w.note.match(/Welsh word: ([^.]+)/)[1]}`).join('\n') + '\n',
  )
  console.log(`Words: ${words.length}. Now run: node scripts/sprint/3-days.mjs`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
