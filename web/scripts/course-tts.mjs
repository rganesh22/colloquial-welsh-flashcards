/**
 * Gemini Batch TTS for every fixed line of the 8-week Patagonia course, in
 * the voice each screen plays it in (dialogue characters, Patagonian accent).
 * Writes compact MP3s to public/tts/course/ and their keys to
 * public/tts/course.json, which the app checks before anything else.
 *
 * Usage:
 *   npm run course-tts -- --dry       count lines, call nothing
 *   npm run course-tts                generate what's missing (needs GEMINI_API_KEY)
 *   npm run course-tts -- --resume <batches/…>   pick up a job that's still running
 *
 * The line list, prompt and cache key come from the app's own modules, so
 * the files are exactly what the app asks for.
 */

import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { createServer } from 'vite'
import {
  apiKey,
  audioFromResultLine,
  createBatchJob,
  downloadResults,
  jobResultFile,
  pollBatchJob,
  uploadJsonl,
} from './batch-tts.mjs'

const run = promisify(execFile)
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'tts', 'course')
const manifestPath = join(root, 'public', 'tts', 'course.json')
const jobsDir = join(root, 'scripts', 'batch-jobs')

const args = process.argv.slice(2)
const dry = args.includes('--dry')
const resumeIdx = args.indexOf('--resume')
const resumeJob = resumeIdx >= 0 ? args[resumeIdx + 1] : null

async function loadCourse() {
  const server = await createServer({
    root,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false },
  })
  try {
    const { courseAudioLines } = await server.ssrLoadModule('/src/lib/courseAudio.ts')
    const tts = await server.ssrLoadModule('/src/lib/tts.ts')
    const byKey = new Map()
    for (const line of courseAudioLines()) {
      const key = await tts.ttsAudioKey(line.text, line)
      if (!byKey.has(key)) {
        byKey.set(key, {
          key,
          text: line.text,
          voice: line.voice || tts.TTS_VOICE,
          prompt: tts.ttsSpeakPrompt(line.text, line),
        })
      }
    }
    return { lines: [...byKey.values()], model: tts.TTS_MODEL }
  } finally {
    await server.close()
  }
}

async function loadManifest(model) {
  try {
    const m = JSON.parse(await readFile(manifestPath, 'utf8'))
    if (m.model === model) return m
  } catch {
    /* first run */
  }
  return { model, keys: [] }
}

/** WAV → mono 64 kbps MP3: about a tenth of the size, still clear speech. */
async function toMp3(wav, key) {
  const tmp = join(outDir, `${key}.tmp.wav`)
  await writeFile(tmp, wav)
  try {
    await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-ac', '1', '-b:a', '64k', join(outDir, `${key}.mp3`)])
  } finally {
    await rm(tmp, { force: true })
  }
}

async function main() {
  const { lines, model } = await loadCourse()
  const manifest = await loadManifest(model)
  const have = new Set(manifest.keys.filter((k) => existsSync(join(outDir, `${k}.mp3`))))
  // Default-voice lines already in the older WAV bundle share its key: skip them.
  const inOldBundle = (k) => existsSync(join(root, 'public', 'tts', `${k}.wav`))
  const todo = lines.filter((l) => !have.has(l.key) && !inOldBundle(l.key))
  const voices = {}
  for (const l of todo) voices[l.voice] = (voices[l.voice] ?? 0) + 1
  console.log(`Course lines: ${lines.length} · already done: ${have.size} · to generate: ${todo.length}`)
  console.log(`  by voice: ${JSON.stringify(voices)}`)
  if (dry) {
    for (const l of todo.slice(0, 5)) console.log(`  e.g. [${l.voice}] ${l.text}`)
    return
  }
  if (!todo.length && !resumeJob) return

  const key = apiKey()
  await mkdir(outDir, { recursive: true })
  await mkdir(jobsDir, { recursive: true })

  let jobName = resumeJob
  let metaPath
  let resultsPath
  if (jobName) {
    const stamp = jobName.split('/').pop()
    metaPath = join(jobsDir, `course-tts-resume-${stamp}.job.json`)
    resultsPath = join(jobsDir, `course-tts-resume-${stamp}.results.jsonl`)
    await writeFile(metaPath, JSON.stringify({ job_name: jobName }, null, 2))
  } else {
    const displayName = `course-tts-${Date.now()}`
    const jsonlPath = join(jobsDir, `${displayName}.jsonl`)
    metaPath = join(jobsDir, `${displayName}.job.json`)
    resultsPath = join(jobsDir, `${displayName}.results.jsonl`)
    const requests = todo.map((l) =>
      JSON.stringify({
        key: l.key,
        request: {
          contents: [{ parts: [{ text: l.prompt }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: l.voice } } },
          },
        },
      }),
    )
    await writeFile(jsonlPath, requests.join('\n') + '\n')
    console.log(`Uploading ${requests.length} requests…`)
    const fileName = await uploadJsonl(jsonlPath, key, displayName)
    jobName = await createBatchJob(fileName, key, displayName)
    console.log(`  job: ${jobName}  (resume with: npm run course-tts -- --resume ${jobName})`)
    await writeFile(
      metaPath,
      JSON.stringify(
        { job_name: jobName, file_name: fileName, model, request_count: requests.length, created_at: new Date().toISOString() },
        null,
        2,
      ),
    )
  }

  console.log('Polling (batch jobs can take a while)…')
  const payload = await pollBatchJob(jobName, key, metaPath)
  const resultFile = jobResultFile(payload)
  if (!resultFile) throw new Error('No result file on the finished job')
  await downloadResults(resultFile, resultsPath, key)

  const keys = new Set(have)
  let ok = 0
  let failed = 0
  for (const raw of (await readFile(resultsPath, 'utf8')).split('\n')) {
    if (!raw.trim()) continue
    const row = JSON.parse(raw)
    const k = row.key || row.metadata?.key
    const wav = k ? audioFromResultLine(row) : null
    if (!wav) {
      failed++
      continue
    }
    await toMp3(wav, k)
    keys.add(k)
    ok++
  }
  manifest.keys = [...keys].sort()
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`Done. ok=${ok} failed=${failed}. Re-run to retry any failures.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
