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

function applyTable(word: string, table: [string, string][]): string {
  const w = word.trim()
  if (!w) return w
  const lower = w.toLowerCase()
  // "Ch", "Th", "Ph" are their own letters, not c/t/p.
  if (/^(ch|th|ph)/.test(lower)) return w
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

/** "yn" + place: nasal mutation, and yn → ym / yng before the result. */
export function ynPlace(place: string): string {
  const mutated = applyTable(place, NASAL)
  const lower = mutated.toLowerCase()
  if (lower.startsWith('m') && mutated !== place.trim()) return `ym ${mutated}`
  if (lower.startsWith('ng') && mutated !== place.trim()) return `yng ${mutated}`
  return `yn ${mutated}`
}
