/**
 * Prefetch Gemini TTS for Welsh terms.
 *
 *   npm run prefetch-tts          # all unique deck terms
 *   npm run prefetch-tts -- --demo  # 20-word Welsh-sound coverage set
 *
 * Requires GEMINI_API_KEY (or VITE_GEMINI_API_KEY / GOOGLE_API_KEY).
 */

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile, access, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { GoogleGenAI } from '@google/genai'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'tts')

const TTS_MODEL = 'gemini-3.1-flash-tts-preview'
const TTS_VOICE = 'Algenib'
const TTS_LANGUAGE = 'cy-GB'

function speakPrompt(text) {
  return `Read the following Welsh (Cymraeg) clearly:\n${text.trim()}`
}

/**
 * Twenty deck words chosen to hit the main Welsh sound inventory:
 * ll, ch/chw, dd, ff, th, rh, ng/ngŵ, w-vowel, y/ŷ, â/ê/î/ô/ŵ,
 * si /ʃ/, j, and core diphthongs (ae, ew, iw, oe, wy, yw).
 */
const DEMO_TERMS = [
  'llan', // ll
  'Chwefror', // ch + chw
  'diwedd', // dd
  'ffôn', // ff + ô
  'cath', // th
  'rhedeg', // rh
  'hongian', // ng
  'ngŵr', // ngŵ + ŵ
  'cwm', // w as vowel
  'ynys', // y
  'tŷ', // ŷ
  'tân', // â
  'clêr', // ê
  'tîm', // î
  'sŵn', // ŵ
  'siarad', // si /ʃ/
  'jwg', // j
  'cae', // ae
  'gwylio', // wy
  'bywyd', // yw
]

const LESSON_FILES = [
  join(root, 'src/data/lesson-alphabet.ts'),
  join(root, 'src/data/lesson-1a.ts'),
]

function cachePayloadFor(text) {
  return JSON.stringify({
    model: TTS_MODEL,
    voice: TTS_VOICE,
    language: TTS_LANGUAGE,
    text: text.trim(),
  })
}

function audioKey(text) {
  return createHash('sha256')
    .update(cachePayloadFor(text))
    .digest('hex')
    .slice(0, 32)
}

function pcmToWav(pcm, sampleRate = 24000, numChannels = 1, bitDepth = 16) {
  const blockAlign = (numChannels * bitDepth) / 8
  const byteRate = sampleRate * blockAlign
  const dataSize = pcm.length
  const buffer = Buffer.alloc(44 + dataSize)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataSize, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(numChannels, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(byteRate, 28)
  buffer.writeUInt16LE(blockAlign, 32)
  buffer.writeUInt16LE(bitDepth, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataSize, 40)
  Buffer.from(pcm).copy(buffer, 44)
  return buffer
}

function extractWelshTerms(src) {
  const terms = []
  const re =
    /welsh:\s*'((?:\\'|[^'])*)'|welsh:\s*"((?:\\"|[^"])*)"/g
  let m
  while ((m = re.exec(src))) {
    const raw = m[1] ?? m[2]
    const text = raw
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .trim()
    if (text) terms.push(text)
  }
  return terms
}

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function generateOne(ai, text, attempt = 1) {
  try {
    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: [{ parts: [{ text: speakPrompt(text) }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          languageCode: TTS_LANGUAGE,
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: TTS_VOICE },
          },
        },
      },
    })
    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
    if (!data) {
      throw Object.assign(new Error('No audio data'), { retryable: true })
    }
    return pcmToWav(Buffer.from(data, 'base64'))
  } catch (err) {
    const msg = String(err?.message ?? err)
    const isDaily =
      /per_day|per day|GenerateRequestsPerDay/i.test(msg)
    if (isDaily) throw err
    const retryable =
      err?.retryable ||
      /429|503|RESOURCE_EXHAUSTED|unavailable|No audio data/i.test(msg)
    if (retryable && attempt < 4) {
      const wait = /429|RESOURCE_EXHAUSTED/i.test(msg)
        ? 15_000
        : Math.min(12_000, 1000 * 2 ** (attempt - 1))
      console.warn(`\n  retry ${attempt} after ${wait}ms: ${text}`)
      await sleep(wait)
      return generateOne(ai, text, attempt + 1)
    }
    throw err
  }
}

async function collectAllTerms() {
  const unique = []
  const seen = new Set()
  for (const file of LESSON_FILES) {
    const src = await readFile(file, 'utf8')
    for (const t of extractWelshTerms(src)) {
      if (!seen.has(t)) {
        seen.add(t)
        unique.push(t)
      }
    }
  }
  return unique
}

async function main() {
  const demo = process.argv.includes('--demo')
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY
  if (!apiKey) {
    console.error('Set GEMINI_API_KEY before running.')
    process.exit(1)
  }

  const unique = demo ? [...DEMO_TERMS] : await collectAllTerms()

  // New model/language pack — drop old clips.
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const manifest = {
    model: TTS_MODEL,
    voice: TTS_VOICE,
    language: TTS_LANGUAGE,
    demo: demo || undefined,
    entries: {},
  }
  const manifestPath = join(outDir, 'manifest.json')

  const ai = new GoogleGenAI({ apiKey })
  let generated = 0
  let failed = 0

  console.log(
    `Prefetching ${unique.length} terms · voice=${TTS_VOICE} · lang=${TTS_LANGUAGE}${demo ? ' · DEMO' : ''}…`,
  )

  for (let i = 0; i < unique.length; i++) {
    const text = unique[i]
    const hash = audioKey(text)
    const wavPath = join(outDir, `${hash}.wav`)
    const label = `[${i + 1}/${unique.length}] ${text}`

    if ((await exists(wavPath)) && manifest.entries[text] === hash) {
      console.log(`${label} — cached`)
      continue
    }

    try {
      process.stdout.write(`${label} — generating… `)
      const wav = await generateOne(ai, text)
      await writeFile(wavPath, wav)
      manifest.entries[text] = hash
      generated++
      console.log(`ok (${wav.length} bytes)`)
      await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
      // Flash TTS free tier is ~10 req/min for this model.
      await sleep(6500)
    } catch (err) {
      failed++
      console.log('FAILED')
      console.error(`  ${err?.message ?? err}`)
    }
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(
    `\nDone. generated=${generated} failed=${failed} total=${unique.length}`,
  )
  console.log(`Manifest: ${manifestPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
