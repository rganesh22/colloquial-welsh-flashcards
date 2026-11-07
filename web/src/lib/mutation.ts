/**
 * Initial mutations for slotting names into script templates.
 * Only Welsh-spelled initials change; English spellings like "Ch" or "K" stay.
 */

const SOFT: [string, string][] = [
  ['ll', 'l'],
  ['rh', 'r'],
  ['p', 'b'],
  ['t', 'd'],
  ['c', 'g'],
  ['b', 'f'],
  ['d', 'dd'],
  ['m', 'f'],
  ['g', ''],
]

const NASAL: [string, string][] = [
  ['p', 'mh'],
  ['t', 'nh'],
  ['c', 'ngh'],
  ['b', 'm'],
  ['d', 'n'],
  ['g', 'ng'],
]

const ASPIRATE: [string, string][] = [
  ['p', 'ph'],
  ['t', 'th'],
  ['c', 'ch'],
]

/**
 * Welsh place names mutate as normal (o Gaerdydd, ym Mangor, yn Nhrelew).
 * Foreign names (Bangalore, Pune, Delhi) are left as they are by default:
 * that's what most speakers do, and "ym Mangalore" for Bangalore names a
 * different city.
 */
const WELSH_PLACES = new Set([
  'bangor', 'bala', 'bethesda', 'caerdydd', 'caernarfon', 'caerfyrddin', 'casnewydd',
  'ceredigion', 'conwy', 'cymru', 'dinbych', 'dolgellau', 'gwynedd', 'gwent', 'gŵyr',
  'machynlleth', 'patagonia', 'penarth', 'pontypridd', 'porthmadog', 'powys',
  'tregaron', 'trelew', 'trefelin', 'dolavon',
])
const WELSH_PREFIX =
  /^(aber|bryn|blaen|caer|cwm|dol|glyn|llan|maes|nant|pen-|penr|pont|porth|rhyd|tre[fb]|ystrad)/

export function isWelshPlace(place: string): boolean {
  const lower = place.trim().toLowerCase()
  return WELSH_PLACES.has(lower) || WELSH_PREFIX.test(lower)
}

function applyTable(word: string, table: [string, string][]): string {
  const w = word.trim()
  if (!w) return w
  const lower = w.toLowerCase()
  // "Ch", "Th", "Ph" are their own letters, not c/t/p; Indian "Bh", "Dh"
  // (Bhopal, Dharamshala) aren't Welsh initials either, so they stay too.
  if (/^(ch|th|ph|bh|dh)/.test(lower)) return w
  for (const [from, to] of table) {
    if (!lower.startsWith(from)) continue
    const rest = w.slice(from.length)
    const capital = w[0] === w[0]!.toUpperCase()
    if (!to) return capital ? rest.charAt(0).toUpperCase() + rest.slice(1) : rest
    const head = capital ? to.charAt(0).toUpperCase() + to.slice(1) : to
    return head + rest
  }
  return w
}

export function softMutate(word: string): string {
  return applyTable(word, SOFT)
}

/** After "a" (and), "â" (with), "tri", "ei" (her): p/t/c → ph/th/ch. */
export function aspirateMutate(word: string): string {
  return applyTable(word, ASPIRATE)
}

function withYn(word: string): string {
  const lower = word.toLowerCase()
  if (lower.startsWith('ng')) return `yng ${word}`
  if (lower.startsWith('m')) return `ym ${word}`
  return `yn ${word}`
}

/**
 * "yn" + place. Welsh names take the nasal mutation (yng Nghaerdydd); foreign
 * names stay as they are, but yn still becomes ym before m (ym Mumbai).
 */
export function ynPlace(place: string): string {
  const p = place.trim()
  return withYn(isWelshPlace(p) ? applyTable(p, NASAL) : p)
}

/** "o" + place: soft mutation for Welsh names only (o Gaerdydd, o Mumbai). */
export function oPlace(place: string): string {
  const p = place.trim()
  return `o ${isWelshPlace(p) ? softMutate(p) : p}`
}

/**
 * The mutated form some speakers use with a foreign name, for a note
 * ("ym Mhune", "o Fumbai"), or null when there's none worth showing.
 * g- and b- names are never suggested: "o Oa" is unrecognisable, and
 * Bangalore → Fangalore / Mangalore collides with another city.
 */
export function mutatedAlternative(place: string, after: 'o' | 'yn'): string | null {
  const p = place.trim()
  if (!p || isWelshPlace(p) || /^g/i.test(p)) return null
  if (after === 'o') {
    if (/^b/i.test(p)) return null
    const soft = softMutate(p)
    return soft === p ? null : `o ${soft}`
  }
  if (!/^[ptc]/i.test(p)) return null
  const nasal = applyTable(p, NASAL)
  return nasal === p ? null : withYn(nasal)
}
