/**
 * Submit Gemini Batch TTS for all unique Welsh deck terms, poll until done,
 * download results, write WAV + manifest under public/tts/.
 *
 * Usage: npm run batch-tts
 *
 * Same voice/prompt stack as wiktionary_web_scraper (Enceladus + Welsh accent).
 */

import { createHash } from 'node:crypto'
import {
  mkdir,
  readFile,
  writeFile,
  readdir,
} from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'tts')
const jobsDir = join(root, 'scripts', 'batch-jobs')

const TTS_MODEL = 'gemini-3.1-flash-tts-preview'
const TTS_VOICE = 'Enceladus'
const TTS_LANGUAGE = 'cy-GB'
const TTS_ACCENT_PROMPT =
  'Speak in Welsh as spoken in Wales, with a calm deep male voice.'

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const UPLOAD_BASE = 'https://generativelanguage.googleapis.com/upload/v1beta'
const DOWNLOAD_BASE =
  'https://generativelanguage.googleapis.com/download/v1beta'

async function lessonFiles() {
  const dir = join(root, 'src/data')
  const names = await readdir(dir)
  return names
    .filter((n) => /^(lesson-|reader-).+\.ts$/.test(n))
    .map((n) => join(dir, n))
}

const POLL_SEC = 20
const TERMINAL = new Set([
  'JOB_STATE_SUCCEEDED',
  'JOB_STATE_FAILED',
  'JOB_STATE_CANCELLED',
  'JOB_STATE_EXPIRED',
  'BATCH_STATE_SUCCEEDED',
  'BATCH_STATE_FAILED',
  'BATCH_STATE_CANCELLED',
  'BATCH_STATE_EXPIRED',
])

function apiKey() {
  const key =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY
  if (!key) throw new Error('Set GEMINI_API_KEY')
  return key
}

function speakPrompt(text) {
  return `${TTS_ACCENT_PROMPT}\n\nRead aloud exactly the following text:\n${text.trim()}`
}

function cachePayloadFor(text) {
  return JSON.stringify({
    model: TTS_MODEL,
    voice: TTS_VOICE,
    language: TTS_LANGUAGE,
    accent: TTS_ACCENT_PROMPT,
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

function sampleRateFromMime(mime) {
  const m = /rate=(\d+)/i.exec(mime || '')
  return m ? Number(m[1]) : 24000
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

async function loadManifest() {
  try {
    return JSON.parse(await readFile(join(outDir, 'manifest.json'), 'utf8'))
  } catch {
    return {
      model: TTS_MODEL,
      voice: TTS_VOICE,
      language: TTS_LANGUAGE,
      accent: TTS_ACCENT_PROMPT,
      entries: {},
    }
  }
}

async function collectTerms(skip = new Set()) {
  const unique = []
  const seen = new Set()
  for (const file of await lessonFiles()) {
    const src = await readFile(file, 'utf8')
    for (const t of extractWelshTerms(src)) {
      if (!seen.has(t) && !skip.has(t)) {
        seen.add(t)
        unique.push(t)
      }
    }
  }
  return unique
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function normalizeState(state) {
  const raw = (state || '').trim()
  if (raw.startsWith('BATCH_STATE_')) return 'JOB_STATE_' + raw.slice('BATCH_STATE_'.length)
  return raw
}

async function uploadJsonl(path, key, displayName) {
  const data = await readFile(path)
  const start = await fetch(`${UPLOAD_BASE}/files`, {
    method: 'POST',
    headers: {
      'x-goog-api-key': key,
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': String(data.length),
      'X-Goog-Upload-Header-Content-Type': 'application/jsonl',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file: { display_name: displayName } }),
  })
  if (!start.ok) {
    throw new Error(`Upload start failed (${start.status}): ${await start.text()}`)
  }
  const uploadUrl =
    start.headers.get('x-goog-upload-url') ||
    start.headers.get('X-Goog-Upload-Url')
  if (!uploadUrl) throw new Error('Missing resumable upload URL')

  const finish = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Length': String(data.length),
      'X-Goog-Upload-Offset': '0',
      'X-Goog-Upload-Command': 'upload, finalize',
    },
    body: data,
  })
  if (!finish.ok) {
    throw new Error(`Upload failed (${finish.status}): ${await finish.text()}`)
  }
  const fileName = (await finish.json())?.file?.name
  if (!fileName) throw new Error('Upload missing file name')
  return fileName
}

async function createBatchJob(fileName, key, displayName) {
  const url = `${API_BASE}/models/${TTS_MODEL}:batchGenerateContent`
  for (let attempt = 0; attempt < 8; attempt++) {
    const resp = await fetch(`${url}?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batch: {
          display_name: displayName,
          input_config: { file_name: fileName },
        },
      }),
    })
    if (resp.ok) {
      const jobName = (await resp.json())?.name
      if (!jobName) throw new Error('Batch create missing job name')
      return jobName
    }
    const body = await resp.text()
    if (![429, 500, 503].includes(resp.status) || attempt === 7) {
      throw new Error(`Batch create failed (${resp.status}): ${body.slice(0, 400)}`)
    }
    console.warn(`  create retry ${attempt + 1}/8 (${resp.status})…`)
    await sleep(Math.min(120_000, 10_000 * 2 ** attempt))
  }
  throw new Error('Batch create failed')
}

function jobState(payload) {
  const meta = payload.metadata || {}
  return normalizeState(meta.state || payload.state || '')
}

function jobResultFile(payload) {
  const meta = payload.metadata || {}
  const output = meta.output || {}
  const response = payload.response || {}
  return (
    output.responsesFile ||
    output.fileName ||
    response.responsesFile ||
    payload.dest?.fileName ||
    payload.dest?.file_name ||
    null
  )
}

async function pollBatchJob(jobName, key, metaPath) {
  const url = `${API_BASE}/${jobName}?key=${encodeURIComponent(key)}`
  while (true) {
    const resp = await fetch(url)
    if (!resp.ok) {
      throw new Error(`Batch poll failed (${resp.status}): ${(await resp.text()).slice(0, 400)}`)
    }
    const payload = await resp.json()
    const state = jobState(payload)
    const label = state || (payload.done ? 'done' : 'pending')
    console.log(`  batch state: ${label}`)
    await writeFile(
      metaPath,
      JSON.stringify(
        {
          ...(JSON.parse(await readFile(metaPath, 'utf8'))),
          state: state || label,
          polled_at: new Date().toISOString(),
          batch_stats: payload.metadata?.batchStats,
        },
        null,
        2,
      ),
    )
    if (payload.done || TERMINAL.has(state)) {
      if (state === 'JOB_STATE_SUCCEEDED') return payload
      const stats = payload.metadata?.batchStats || {}
      if (payload.done && Number(stats.successfulRequestCount || 0) > 0) {
        return payload
      }
      if (TERMINAL.has(state) && state !== 'JOB_STATE_SUCCEEDED') {
        throw new Error(`Batch ended ${state}: ${JSON.stringify(payload.error || payload).slice(0, 500)}`)
      }
      if (payload.done) return payload
    }
    await sleep(POLL_SEC * 1000)
  }
}

async function downloadResults(resultFile, destPath, key) {
  const url = `${DOWNLOAD_BASE}/${resultFile}:download?key=${encodeURIComponent(key)}&alt=media`
  for (let attempt = 0; attempt < 8; attempt++) {
    const resp = await fetch(url)
    if (resp.ok) {
      const buf = Buffer.from(await resp.arrayBuffer())
      await writeFile(destPath, buf)
      return
    }
    const body = await resp.text()
    if (![429, 500, 503].includes(resp.status) || attempt === 7) {
      throw new Error(`Download failed (${resp.status}): ${body.slice(0, 400)}`)
    }
    console.warn(`  download retry ${attempt + 1}/8…`)
    await sleep(Math.min(120_000, 10_000 * 2 ** attempt))
  }
}

function audioFromResultLine(line) {
  if (line.error) return null
  const response = line.response || {}
  const candidates = response.candidates || []
  if (!candidates.length) return null
  const parts = candidates[0]?.content?.parts || []
  for (const part of parts) {
    const inline = part.inlineData || part.inline_data
    if (!inline?.data) continue
    const raw = Buffer.from(inline.data, 'base64')
    const mime = inline.mimeType || inline.mime_type || 'audio/l16'
    if (mime.includes('wav') || raw.slice(0, 4).toString() === 'RIFF') {
      return raw
    }
    return pcmToWav(raw, sampleRateFromMime(mime))
  }
  return null
}

async function main() {
  const key = apiKey()
  const existingManifest = await loadManifest()
  const already = new Set(Object.keys(existingManifest.entries || {}))
  const terms = await collectTerms(already)
  console.log(
    `Collecting ${terms.length} new Welsh terms (${already.size} already on disk)…`,
  )
  if (terms.length === 0) {
    console.log('Nothing new to generate.')
    return
  }

  await mkdir(jobsDir, { recursive: true })
  await mkdir(outDir, { recursive: true })

  const stamp = Date.now()
  const displayName = `cw-welsh-tts-${stamp}`
  const jsonlPath = join(jobsDir, `${displayName}.jsonl`)
  const metaPath = join(jobsDir, `${displayName}.job.json`)
  const resultsPath = join(jobsDir, `${displayName}.results.jsonl`)

  const lines = terms.map((text) =>
    JSON.stringify({
      key: text,
      request: {
        contents: [{ parts: [{ text: speakPrompt(text) }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: TTS_VOICE },
            },
          },
        },
      },
    }),
  )
  await writeFile(jsonlPath, lines.join('\n') + '\n')
  console.log(`Wrote ${lines.length} requests → ${jsonlPath}`)

  console.log('Uploading JSONL…')
  const fileName = await uploadJsonl(jsonlPath, key, displayName)
  console.log(`  file: ${fileName}`)

  console.log('Creating batch job…')
  const jobName = await createBatchJob(fileName, key, displayName)
  console.log(`  job: ${jobName}`)

  await writeFile(
    metaPath,
    JSON.stringify(
      {
        job_name: jobName,
        file_name: fileName,
        model: TTS_MODEL,
        voice: TTS_VOICE,
        language: TTS_LANGUAGE,
        request_count: terms.length,
        jsonl_file: jsonlPath,
        created_at: new Date().toISOString(),
        state: 'JOB_STATE_PENDING',
      },
      null,
      2,
    ),
  )

  console.log('Polling…')
  const payload = await pollBatchJob(jobName, key, metaPath)
  const destFile = jobResultFile(payload)
  if (!destFile) throw new Error('No result file on succeeded job')
  console.log(`Downloading results: ${destFile}`)
  await downloadResults(destFile, resultsPath, key)

  await mkdir(outDir, { recursive: true })

  const manifest = {
    model: TTS_MODEL,
    voice: TTS_VOICE,
    language: TTS_LANGUAGE,
    accent: TTS_ACCENT_PROMPT,
    entries: { ...(existingManifest.entries || {}) },
  }

  let ok = 0
  let failed = 0
  const resultText = await readFile(resultsPath, 'utf8')
  for (const line of resultText.split('\n')) {
    if (!line.trim()) continue
    let row
    try {
      row = JSON.parse(line)
    } catch {
      failed++
      continue
    }
    const text = row.key || row.metadata?.key
    if (!text) {
      failed++
      continue
    }
    const wav = audioFromResultLine(row)
    if (!wav) {
      failed++
      console.warn(`  ! no audio: ${text}`)
      continue
    }
    const hash = audioKey(text)
    await writeFile(join(outDir, `${hash}.wav`), wav)
    manifest.entries[text] = hash
    ok++
  }

  await writeFile(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
  await writeFile(
    metaPath,
    JSON.stringify(
      {
        ...JSON.parse(await readFile(metaPath, 'utf8')),
        state: 'JOB_STATE_SUCCEEDED',
        completed_at: new Date().toISOString(),
        result_file: destFile,
        local_results_path: resultsPath,
        applied_ok: ok,
        applied_failed: failed,
      },
      null,
      2,
    ),
  )

  console.log(`\nDone. ok=${ok} failed=${failed} total=${terms.length}`)
  console.log(`Audio → ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
