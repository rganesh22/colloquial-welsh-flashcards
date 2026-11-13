/**
 * Step 2: the sprint's word list, in order, 25 a day.
 *  - every word the Easy Welsh videos use (from step 1), video by video
 *  - plus what the grammar track needs early, everyday core words and
 *    Patagonia words (one Claude call, cached in private/core.json)
 * Writes src/data/sprint/words.json and src/data/sprint/videos.json.
 *
 *   node scripts/sprint/2-plan.mjs
 */
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { callJson, here, privateDir } from './claude.mjs'
import { DAYS, isCatchUp, NEW_PER_DAY, SYLLABUS, VIDEO_ORDER } from './syllabus.mjs'

const outDir = join(here, '..', '..', 'src', 'data', 'sprint')
const SKIP_POS = new Set(['english', 'name', 'place', 'interjection'])
/** How many core / Patagonia words to mix into a day once the grammar's needs are met. */
const CORE_PER_DAY = 6

export const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?;:"“”()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

export function slug(s) {
  return norm(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['/]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40)
}

async function loadVideos() {
  const dir = join(privateDir, 'transcripts')
  const videos = []
  for (const f of await readdir(dir)) {
    if (f.endsWith('.json')) videos.push(JSON.parse(await readFile(join(dir, f), 'utf8')))
  }
  // Titles contain "|", so take everything between the id and the duration.
  const titles = Object.fromEntries(
    (await readFile(join(privateDir, 'playlists.txt'), 'utf8'))
      .split('\n')
      .filter(Boolean)
      .map((l) => l.split('|'))
      .map((parts) => [parts[0], parts.slice(1, -1).join('|').trim()]),
  )
  for (const v of videos) v.title = titles[v.id] || v.title
  const rank = (id) => (VIDEO_ORDER.includes(id) ? VIDEO_ORDER.indexOf(id) : 99)
  return videos.sort((a, b) => rank(a.id) - rank(b.id))
}

/** Merge the videos' word lists by lemma. */
function mergeWords(videos) {
  const byKey = new Map()
  for (const v of videos) {
    for (const w of v.words) {
      if (SKIP_POS.has(w.pos)) continue
      const key = norm(w.lemma)
      if (!key) continue
      const cur = byKey.get(key)
      if (cur) {
        cur.count += w.count
        cur.videos.push(v.id)
        for (const f of w.forms) if (!cur.forms.includes(norm(f))) cur.forms.push(norm(f))
      } else {
        byKey.set(key, {
          key,
          cy: w.lemma.trim(),
          en: w.en.trim(),
          pos: w.pos,
          gender: w.gender,
          note: w.note,
          count: w.count,
          videos: [v.id],
          forms: [...new Set([key, ...w.forms.map(norm)])],
        })
      }
    }
  }
  return byKey
}

const CORE_SYSTEM = `You plan vocabulary for a 50-day Welsh sprint (1 hour a day, 25 new words a day max) for an English speaker travelling to Y Wladfa (Welsh Patagonia) to film themself talking with locals. They learn northern colloquial Welsh (dw i'n, dach chi, isio, efo, gen i), the kind used in Easy Welsh videos and widely understood in Y Wladfa.

Return the words the learner needs that a video-word list alone won't schedule in time:
1. GRAMMAR NEEDS: every word or form each day's pattern needs, by the day it's needed ("needBy" = that day, or earlier). Include them even if they're already in the video list (use the same spelling as the list). E.g. day 1 needs dw i, wyt ti, yn ('n), dysgu, siarad, Cymraeg…; day 9 needs fy, dy, ei, tad, mam…; day 16 needs es i, ges i, wnes i, ddoe…
2. CORE: everyday words a traveller uses constantly that the videos may lack: numbers, days, months, family, food and drink, travel, directions, feelings, weather, common verbs and adjectives, question words. needBy = when it's sensible to learn it (1–48).
3. PATAGONIA: words for Y Wladfa: places and things (capel, Eisteddfod, te Cymreig, cacen ddu/torta negra, Gaiman, Trelew, Trevelin, Dyffryn Camwy, Y Mimosa, Porth Madryn, Ariannin, Sbaeneg, ysgol, hiraeth…), Spanish words heard in Patagonian Welsh, and what you need to talk about your trip and heritage. Set patagonia true.

Spelling: dictionary form, unmutated (verbs as verb-nouns), except inflected forms like "es i" or "mae gen i" which are their own entries. "en": a short gloss (2–6 words). Aim for roughly 350–450 entries in total. No duplicates.`

const coreSchema = {
  type: 'object',
  properties: {
    words: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          cy: { type: 'string' },
          en: { type: 'string' },
          pos: {
            type: 'string',
            enum: ['noun', 'verb', 'verb-form', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'particle', 'numeral', 'phrase'],
          },
          gender: { type: 'string', enum: ['m', 'f', ''] },
          note: { type: 'string' },
          needBy: { type: 'integer' },
          patagonia: { type: 'boolean' },
        },
      },
    },
  },
}

async function coreWords(merged) {
  const path = join(privateDir, 'core.json')
  if (existsSync(path)) return JSON.parse(await readFile(path, 'utf8'))
  const syllabus = SYLLABUS.map(([d, t, why]) => `Day ${d}: ${t} — ${why}`).join('\n')
  const list = [...merged.values()]
    .sort((a, b) => b.count - a.count)
    .map((w) => `${w.cy} (${w.pos}) ${w.en} ×${w.count}`)
    .join('\n')
  const res = await callJson({
    tag: 'core words',
    system: CORE_SYSTEM,
    user: `Grammar track:\n${syllabus}\n\nWords already in the Easy Welsh videos (lemma, pos, gloss, count):\n${list}`,
    schema: coreSchema,
    effort: 'high',
  })
  await writeFile(path, JSON.stringify(res.words, null, 1))
  return res.words
}

async function main() {
  const videos = await loadVideos()
  const merged = mergeWords(videos)
  console.log(`Video words: ${merged.size} (from ${videos.length} videos)`)
  const core = await coreWords(merged)
  console.log(`Core / grammar / Patagonia entries: ${core.length}`)

  // Attach the core plan to video words, or add new entries.
  for (const c of core) {
    const key = norm(c.cy)
    const cur = merged.get(key)
    if (cur) {
      cur.needBy = Math.min(cur.needBy ?? 99, c.needBy)
      cur.patagonia ||= c.patagonia
    } else {
      merged.set(key, {
        key,
        cy: c.cy.trim(),
        en: c.en.trim(),
        pos: c.pos,
        gender: c.gender,
        note: c.note,
        count: 0,
        videos: [],
        forms: [key],
        needBy: c.needBy,
        patagonia: c.patagonia,
        core: true,
      })
    }
  }

  const all = [...merged.values()]
  const scheduled = new Set()
  const days = []
  const firstVideo = (w) => {
    const ranks = w.videos.map((id) => VIDEO_ORDER.indexOf(id)).filter((r) => r >= 0)
    return ranks.length ? Math.min(...ranks) : 99
  }
  // Video words: words used a lot across all the videos come early (they're
  // everywhere); rarer ones wait for their video, easiest video first.
  const freqRank = (w) => (w.count >= 30 ? 0 : w.count >= 15 ? 2 : w.count >= 8 ? 4 : w.count >= 4 ? 6 : 99)
  const rank = (w) => Math.min(firstVideo(w), freqRank(w))
  const videoQueue = all
    .filter((w) => w.videos.length)
    .sort((a, b) => rank(a) - rank(b) || b.count - a.count)
  const coreQueue = all
    .filter((w) => !w.videos.length)
    .sort((a, b) => (a.needBy ?? 99) - (b.needBy ?? 99) || Number(b.patagonia) - Number(a.patagonia))

  for (let day = 1; day <= DAYS; day++) {
    const picked = []
    if (!isCatchUp(day)) {
      const take = (w) => {
        if (picked.length >= NEW_PER_DAY || scheduled.has(w.key)) return
        scheduled.add(w.key)
        picked.push(w)
      }
      // 1. What the grammar needs within the next two days.
      all
        .filter((w) => !scheduled.has(w.key) && (w.needBy ?? 99) <= day + 2)
        .sort((a, b) => (a.needBy ?? 99) - (b.needBy ?? 99) || b.count - a.count)
        .forEach(take)
      // 2. A few core / Patagonia words.
      let core = 0
      for (const w of coreQueue) {
        if (core >= CORE_PER_DAY || picked.length >= NEW_PER_DAY) break
        if (!scheduled.has(w.key)) {
          take(w)
          core++
        }
      }
      // 3. The rest from the videos, in order.
      for (const w of videoQueue) {
        if (picked.length >= NEW_PER_DAY) break
        take(w)
      }
    }
    days.push(picked)
  }

  const words = []
  days.forEach((picked, i) =>
    picked.forEach((w, j) =>
      words.push({
        id: `sp-${slug(w.cy)}`,
        day: i + 1,
        n: j + 1,
        cy: w.cy,
        en: w.en,
        pos: w.pos,
        gender: w.gender || undefined,
        note: w.note || undefined,
        patagonia: w.patagonia || undefined,
        videos: w.videos.length ? w.videos : undefined,
        forms: w.forms,
      }),
    ),
  )
  const later = all.filter((w) => !scheduled.has(w.key))
  console.log(`Scheduled ${words.length} words over ${DAYS} days; ${later.length} left for after the sprint.`)

  // How much of each video you can follow by each day (by word tokens).
  const dayOf = new Map(words.map((w) => [norm(w.cy), w.day]))
  const videoInfo = videos.map((v) => {
    const counts = v.words.filter((w) => !SKIP_POS.has(w.pos))
    const total = counts.reduce((n, w) => n + w.count, 0)
    const coverage = []
    for (let d = 1; d <= DAYS; d++) {
      const known = counts.reduce((n, w) => n + ((dayOf.get(norm(w.lemma)) ?? 99) <= d ? w.count : 0), 0)
      coverage.push(+(known / Math.max(1, total)).toFixed(3))
    }
    const lines = v.lines
    return {
      id: v.id,
      title: v.title.replace(/\s*\|\s*Easy Welsh.*$/i, '').replace(/ - Easy Welsh.*$/i, '').trim(),
      series: v.title.match(/(Super Easy Welsh \d+|Easy Welsh \d+|Basic Phrases \(\d\))/i)?.[0] ?? 'Easy Welsh',
      minutes: Math.round((lines.at(-1)?.end ?? 60) / 60),
      words: counts.length,
      coverage,
      // Basic Phrases are made for day-one beginners: watch them from the start.
      readyDay: /Basic Phrases/i.test(v.title) ? 1 : coverage.findIndex((c) => c >= 0.8) + 1 || null,
    }
  })

  await mkdir(outDir, { recursive: true })
  await writeFile(join(outDir, 'words.json'), JSON.stringify(words, null, 1) + '\n')
  await writeFile(join(outDir, 'videos.json'), JSON.stringify(videoInfo, null, 1) + '\n')
  await writeFile(
    join(privateDir, 'later.json'),
    JSON.stringify(later.map((w) => `${w.cy} — ${w.en} ×${w.count}`), null, 1),
  )
  for (const v of videoInfo) {
    console.log(`  ${v.series.padEnd(20)} ${v.words} words · 80% by day ${v.readyDay ?? '—'} · day 50: ${Math.round(v.coverage.at(-1) * 100)}%`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
