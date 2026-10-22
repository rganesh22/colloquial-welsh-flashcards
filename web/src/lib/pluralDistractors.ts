/** Common Welsh plural endings used to invent plausible distractors. */
const SUFFIXES = [
  'au',
  'iau',
  'ion',
  'od',
  'edd',
  'oedd',
  'ydd',
  'on',
  'aint',
  'iaid',
  'oedd',
  'ydd',
] as const

function norm(s: string): string {
  return s.toLowerCase().normalize('NFC').trim()
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

/**
 * Invent fake but Welsh-looking plurals for a singular.
 * Never returns the real plural, the singular, or any banned real plurals
 * (so distractors aren't obviously "the plural of another word").
 */
export function inventPluralDistractors(
  singular: string,
  realPlural: string,
  count: number,
  bannedRealPlurals: Iterable<string> = [],
): string[] {
  if (count <= 0) return []
  const ban = new Set<string>()
  ban.add(norm(realPlural))
  ban.add(norm(singular))
  for (const p of bannedRealPlurals) ban.add(norm(p))

  const base = singular.replace(/^(y|yr)\s+/i, '').trim()
  if (!base) return []

  const stems = [
    base,
    base.replace(/[aeiouwyâêîôûŵŷ]+$/i, ''),
    base.length > 3 ? base.slice(0, -1) : base,
    base.endsWith('yn') ? base.slice(0, -2) : `${base}yn`,
    base.endsWith('a') ? `${base.slice(0, -1)}e` : base,
  ].filter((s) => s.length >= 2)

  const candidates: string[] = []
  for (const stem of stems) {
    for (const suf of SUFFIXES) {
      candidates.push(stem + suf)
      const head = stem.charAt(0).toLowerCase()
      if (head === 'c') candidates.push(`g${stem.slice(1)}${suf}`)
      if (head === 'p') candidates.push(`b${stem.slice(1)}${suf}`)
      if (head === 't') candidates.push(`d${stem.slice(1)}${suf}`)
      if (head === 'b') candidates.push(`f${stem.slice(1)}${suf}`)
      if (head === 'g') candidates.push(`${stem.slice(1)}${suf}`)
    }
  }

  const rp = realPlural.trim()
  if (rp.endsWith('au')) {
    const stem = rp.slice(0, -2)
    candidates.push(`${stem}od`, `${stem}ion`, `${stem}ydd`, `${stem}iau`)
  } else if (rp.endsWith('od')) {
    const stem = rp.slice(0, -2)
    candidates.push(`${stem}au`, `${stem}edd`, `${stem}ion`)
  } else if (rp.endsWith('ion')) {
    const stem = rp.slice(0, -3)
    candidates.push(`${stem}au`, `${stem}iaid`, `${stem}od`)
  } else if (rp.endsWith('edd') || rp.endsWith('oedd')) {
    const stem = rp.replace(/o?edd$/i, '')
    candidates.push(`${stem}au`, `${stem}od`, `${stem}ion`)
  } else {
    candidates.push(`${rp}au`, `${base}au`, `${base}od`, `${base}ion`)
  }

  const out: string[] = []
  for (const c of shuffle(candidates)) {
    const n = norm(c)
    if (ban.has(n)) continue
    if (c.length < 2 || c.length > 22) continue
    if (!/^[A-Za-zÂÊÎÔÛŴŶâêîôûŵŷ'-]+$/u.test(c)) continue
    out.push(c)
    ban.add(n)
    if (out.length >= count) return out
  }

  let i = 0
  while (out.length < count && i < SUFFIXES.length * 3) {
    const c = `${base}${SUFFIXES[i % SUFFIXES.length]}`
    i++
    const n = norm(c)
    if (ban.has(n)) continue
    out.push(c)
    ban.add(n)
  }
  return out
}
