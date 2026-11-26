/**
 * Step 9: step 7's words went wherever there was room, so a key verb could land
 * on day 31. This keeps the same days-with-room but hands them out by
 * usefulness: forms Y Wladfa prefers (llaeth, gyda fi) and the top verbs
 * first, then southern twins of the commonest words, then the rest. Words that
 * move get a new example sentence for their new day.
 *
 *   node scripts/sprint/9-order.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { here, pool, privateDir } from './claude.mjs'
import { DAYS } from './syllabus.mjs'
import { norm, writeExamples } from './6-twins.mjs'

const dataDir = join(here, '..', '..', 'src', 'data', 'sprint')
const dayDir = join(privateDir, 'days')
const json = async (p) => JSON.parse(await readFile(p, 'utf8'))

async function main() {
  const words = await json(join(dataDir, 'words.json'))
  const before = new Set((await json(join(privateDir, 'backup-before-more', 'words.json'))).map((w) => w.id))
  const { verbs } = await json(join(privateDir, 'verbs.json'))
  const { pairs } = await json(join(privateDir, 'dialect.json'))
  const rank = new Map(verbs.map((v, i) => [norm(v.cy), i]))

  const dayOf = (cy) => words.find((x) => norm(x.cy) === norm(cy))?.day ?? 50
  /** Y Wladfa's form, and the word it pairs with. */
  const wladfaForm = (w) =>
    pairs.find(
      (p) =>
        (norm(p.twin) === norm(w.cy) && p.wladfa === p.region) ||
        (norm(p.word) === norm(w.cy) && p.wladfa !== 'both' && p.wladfa !== 'unknown' && p.wladfa !== p.region),
    )
  // Step 7's words, plus older words that are Y Wladfa's form but come after their pair (llaeth after llefrith).
  const added = words.filter((w) => {
    if (!before.has(w.id)) return true
    // Top verbs that were planned late.
    if ((rank.get(norm(w.cy)) ?? 999) < 80 && w.day >= 21) return true
    const p = wladfaForm(w)
    return p && w.day >= 13 && dayOf(norm(p.twin) === norm(w.cy) ? p.word : p.twin) < w.day
  })
  const score = (w) => {
    const r = rank.get(norm(w.cy))
    if (r != null) return r * 0.25
    const p = wladfaForm(w)
    if (p) return 5 + dayOf(norm(p.twin) === norm(w.cy) ? p.word : p.twin)
    const q = pairs.find((x) => norm(x.twin) === norm(w.cy))
    if (!q) return 200
    return 30 + dayOf(q.word) * 2
  }
  const slots = added.map((w) => w.day).sort((a, b) => a - b)
  const order = [...added].sort((a, b) => score(a) - score(b) || a.day - b.day)
  const moved = []
  order.forEach((w, i) => {
    if (w.day !== slots[i]) {
      w.day = slots[i]
      moved.push(w)
    }
  })
  console.log(`${added.length} words, ${moved.length} moved.`)
  const was = new Map((await json(join(privateDir, 'backup-before-more', 'words.json'))).map((w) => [w.id, w.day]))
  const later = moved.filter((w) => was.has(w.id) && w.day > was.get(w.id))
  if (later.length) console.log(`  WARNING: planned words moved later: ${later.map((w) => `${w.cy} ${was.get(w.id)}→${w.day}`).join(', ')}`)
  for (const w of order.slice(0, 40)) console.log(`  day ${w.day}: ${w.cy}`)

  words.sort((a, b) => a.day - b.day || (a.n ?? 999) - (b.n ?? 999))
  for (let d = 1; d <= DAYS; d++) words.filter((w) => w.day === d).forEach((w, i) => (w.n = i + 1))

  // New examples for moved words; drop each moved word's old one.
  const movedNames = new Set(moved.map((w) => norm(w.cy)))
  for (let d = 1; d <= DAYS; d++) {
    const path = join(dayDir, `${d}.json`)
    const file = await json(path)
    const kept = (file.examples ?? []).filter((e) => !movedNames.has(norm(e.word)))
    if (kept.length !== (file.examples ?? []).length) {
      file.examples = kept
      await writeFile(path, JSON.stringify(file, null, 1))
    }
  }
  const days = [...new Set(moved.map((w) => w.day))].sort((a, b) => a - b)
  await pool(days, 6, async (day) => {
    const need = moved.filter((w) => w.day === day)
    const examples = await writeExamples(day, need, words)
    const path = join(dayDir, `${day}.json`)
    const file = await json(path)
    file.examples = [...(file.examples ?? []), ...examples]
    await writeFile(path, JSON.stringify(file, null, 1))
  })
  await writeFile(join(dataDir, 'words.json'), JSON.stringify(words, null, 1) + '\n')
  console.log('Now run: node scripts/sprint/3-days.mjs')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
