/**
 * Step 8: rewrite the twin notes on every word from the pair lists, so each
 * word says its pair once and cleanly:
 *   "From English. Welsh word: hoffi."      "Also heard: licio (from English)."
 *   "South Wales: nawr. Y Wladfa: both."    "North Wales: rŵan. Y Wladfa: both."
 * Safe to run again: earlier twin notes are stripped first.
 *
 *   node scripts/sprint/8-notes.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { here, privateDir } from './claude.mjs'
import { norm } from './6-twins.mjs'

const dataDir = join(here, '..', '..', 'src', 'data', 'sprint')
const json = async (p) => JSON.parse(await readFile(p, 'utf8'))

const OURS = [
  /Instead of “[^”]+” \(English loan\)\.?/g,
  /From English\. Welsh word: [^.]+\./g,
  /Also heard: [^()]+ \(from English\)\.( [^.]*\.)?/g,
  /(North|South) Wales: [^.]+\./g,
  /Y Wladfa: (both are used|both|mostly “[^”]+”)\./g,
]

function strip(note = '') {
  let s = note
  for (const re of OURS) s = s.replace(re, ' ')
  return s.replace(/\s+/g, ' ').trim()
}

async function main() {
  const words = await json(join(dataDir, 'words.json'))
  const swaps = await json(join(privateDir, 'native.json'))
  const twins = await json(join(privateDir, 'twins.json'))
  const { pairs } = await json(join(privateDir, 'dialect.json'))
  const byCy = (cy) => words.find((w) => norm(w.cy) === norm(cy))
  const byId = (id) => words.find((w) => w.id === id)

  const notes = new Map(words.map((w) => [w, []]))
  const say = (w, text) => {
    const list = notes.get(w)
    if (!list.includes(text)) list.push(text)
  }

  // English ↔ Welsh.
  const english = []
  for (const s of swaps) {
    const loan = byId(s.id)
    const native = byCy(s.native)
    if (loan && native) english.push([loan, native, ''])
  }
  for (const t of twins) {
    const loan = byId(t.id)
    const native = byCy(t.native)
    if (loan && native && loan !== native) english.push([loan, native, t.note ?? ''])
  }
  for (const [loan, native, extra] of english) {
    say(loan, `From English. Welsh word: ${native.cy}.`)
    say(native, `Also heard: ${loan.cy} (from English).${extra ? ` ${extra.replace(/\.?$/, '.')}` : ''}`)
  }

  // North ↔ South: one label per region, listing every twin.
  const other = new Map(words.map((w) => [w, { North: [], South: [], wladfa: '' }]))
  let used = 0
  for (const p of pairs) {
    const w = byCy(p.word) ?? byId(p.id)
    const t = byCy(p.twin)
    if (!w || !t || w === t || norm(w.cy) !== norm(p.word)) continue
    const tRegion = p.region === 'south' ? 'South' : 'North'
    const wRegion = tRegion === 'South' ? 'North' : 'South'
    const north = tRegion === 'North' ? t.cy : w.cy
    const south = tRegion === 'South' ? t.cy : w.cy
    const wladfa =
      p.wladfa === 'both' ? 'Y Wladfa: both.' : p.wladfa === 'north' ? `Y Wladfa: mostly “${north}”.` : p.wladfa === 'south' ? `Y Wladfa: mostly “${south}”.` : ''
    const a = other.get(w)
    const b = other.get(t)
    if (!a[tRegion].includes(t.cy)) a[tRegion].push(t.cy)
    if (!b[wRegion].includes(w.cy)) b[wRegion].push(w.cy)
    if (wladfa) a.wladfa ||= wladfa
    if (wladfa) b.wladfa ||= wladfa
    used++
  }
  for (const [w, o] of other) {
    for (const region of ['North', 'South']) if (o[region].length) say(w, `${region} Wales: ${o[region].join(', ')}.`)
    if (o.wladfa && (o.North.length || o.South.length)) say(w, o.wladfa)
  }

  let changed = 0
  for (const w of words) {
    const base = strip(w.note)
    const parts = [base && base.replace(/([^.!?)])$/, '$1.'), ...notes.get(w)].filter(Boolean)
    const note = parts.join(' ') || undefined
    if (note !== w.note) changed++
    if (note) w.note = note
    else delete w.note
  }
  await writeFile(join(dataDir, 'words.json'), JSON.stringify(words, null, 1) + '\n')
  console.log(`English pairs: ${english.length}. North/South pairs used: ${used}/${pairs.length}. Notes changed: ${changed}.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
