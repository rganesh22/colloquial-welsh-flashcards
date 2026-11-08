/**
 * Free, offline Welsh audio for every fixed line of the 8-week course, made
 * with Piper (open-source neural TTS, Welsh voices from Bangor University's
 * data). The app plays these when there's no Gemini clip for a line.
 *
 * Writes MP3s to public/tts/local/ and their keys to public/tts/local.json.
 * Keys match the Gemini ones (same text, voice and accent), so a Gemini clip,
 * once made, simply wins.
 *
 * Setup (once):
 *   uv venv scripts/.piper && uv pip install --python scripts/.piper/bin/python piper-tts
 * Then:
 *   npm run local-tts            render what's missing (voices download on first run)
 *   npm run local-tts -- --all   re-render everything
 */

import { execFile, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { loadCourse } from './course-tts.mjs'

const run = promisify(execFile)
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'tts', 'local')
const manifestPath = join(root, 'public', 'tts', 'local.json')
const piperDir = join(root, 'scripts', '.piper')
const python = process.env.PIPER_PYTHON || join(piperDir, 'bin', 'python')
const all = process.argv.includes('--all')

const HF = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/cy/cy_GB'
/** Northern voices (closest to Patagonian Welsh). bu_tts has several speakers. */
const MODELS = {
  gogledd: 'gwryw_gogleddol/medium/cy_GB-gwryw_gogleddol-medium',
  bu: 'bu_tts/medium/cy_GB-bu_tts-medium',
}
/** Gemini voice → Piper voice. Enceladus (the course's main voice) matches the in-browser one. */
const VOICE_MAP = {
  Enceladus: { model: 'gogledd' },
  Charon: { model: 'bu', speaker: 2 }, // gwryw-gogledd-pro
  Puck: { model: 'bu', speaker: 5 }, // gwryw-gogledd-1
  Kore: { model: 'bu', speaker: 0 }, // benyw-de-pro: the clearest female speaker
  Leda: { model: 'bu', speaker: 0 },
}
const CREDIT =
  'Piper voices cy_GB gwryw_gogleddol and bu_tts, trained on Bangor University Language Technologies Unit (techiaith) data; bu_tts CC-BY.'
/** A touch slower than natural: still real speech, easier to catch. */
const LENGTH_SCALE = 1.08

async function ensureModels() {
  const dir = join(piperDir, 'models')
  await mkdir(dir, { recursive: true })
  const paths = {}
  for (const [id, path] of Object.entries(MODELS)) {
    const name = path.split('/').pop()
    for (const ext of ['.onnx', '.onnx.json']) {
      const file = join(dir, name + ext)
      if (existsSync(file)) continue
      console.log(`Downloading ${name}${ext}…`)
      const res = await fetch(`${HF}/${path}${ext}`)
      if (!res.ok) throw new Error(`Download failed (${res.status}): ${name}${ext}`)
      await writeFile(file, Buffer.from(await res.arrayBuffer()))
    }
    paths[id] = join(dir, name + '.onnx')
  }
  return paths
}

/** espeak-ng can't open data paths over ~160 characters, so point it at a short link. */
async function espeakDataDir() {
  const { stdout } = await run(python, ['-c', 'import piper,os;print(os.path.dirname(piper.__file__))'])
  const real = join(stdout.trim(), 'espeak-ng-data')
  const short = join(tmpdir(), 'cw-espeak-ng-data')
  await rm(short, { force: true })
  await symlink(real, short)
  return short
}

/** Piper reads text literally: drop stage directions and tidy punctuation it would voice oddly. */
function speakable(text) {
  return text
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[“”«»]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s*\/\s*/g, ', ')
    .replace(/…/g, '...')
    .replace(/\s+/g, ' ')
    .trim()
}

async function main() {
  if (!existsSync(python)) {
    throw new Error(
      `Piper isn't set up. Run:\n  uv venv scripts/.piper && uv pip install --python scripts/.piper/bin/python piper-tts`,
    )
  }
  const { lines } = await loadCourse()
  const have = new Set()
  if (!all) {
    try {
      const m = JSON.parse(await readFile(manifestPath, 'utf8'))
      for (const k of m.keys ?? []) if (existsSync(join(outDir, `${k}.mp3`))) have.add(k)
    } catch {
      /* first run */
    }
  }
  const todo = lines.filter((l) => !have.has(l.key))
  console.log(`Course lines: ${lines.length} · already done: ${have.size} · to render: ${todo.length}`)
  if (!todo.length) return

  const models = await ensureModels()
  const espeak = await espeakDataDir()
  const wavDir = join(tmpdir(), `cw-piper-${Date.now()}`)
  await mkdir(wavDir, { recursive: true })
  await mkdir(outDir, { recursive: true })

  const jobs = todo.map((l) => {
    const v = VOICE_MAP[l.voice] ?? VOICE_MAP.Enceladus
    return JSON.stringify({ key: l.key, text: speakable(l.text), model: models[v.model], speaker: v.speaker ?? null })
  })
  await new Promise((resolve, reject) => {
    const child = spawn(python, [join(root, 'scripts', 'piper_render.py'), wavDir, espeak, String(LENGTH_SCALE)], {
      stdio: ['pipe', 'pipe', 'inherit'],
    })
    let n = 0
    child.stdout.on('data', (d) => {
      const before = Math.floor(n / 100)
      n += String(d).split('\n').filter(Boolean).length
      if (Math.floor(n / 100) > before || n === jobs.length) process.stdout.write(`\r  rendered ${n}/${jobs.length}`)
    })
    child.on('error', reject)
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`piper exited ${code}`))))
    child.stdin.end(jobs.join('\n') + '\n')
  })
  console.log('\nConverting to MP3…')

  const keys = new Set(have)
  const wavs = (await readdir(wavDir)).filter((f) => f.endsWith('.wav'))
  const queue = [...wavs]
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) {
        const f = queue.shift()
        const key = f.slice(0, -4)
        // Mono 48 kbps MP3, loudness-levelled so every voice plays at the same volume.
        await run('ffmpeg', [
          '-y',
          '-loglevel',
          'error',
          '-i',
          join(wavDir, f),
          '-af',
          'loudnorm=I=-18:TP=-1.5:LRA=11',
          '-ar',
          '22050',
          '-ac',
          '1',
          '-b:a',
          '48k',
          join(outDir, `${key}.mp3`),
        ])
        keys.add(key)
      }
    }),
  )
  await rm(wavDir, { recursive: true, force: true })
  const lineKeys = new Set(lines.map((l) => l.key))
  // Drop clips for lines the course no longer has.
  for (const f of await readdir(outDir)) {
    const k = f.replace(/\.mp3$/, '')
    if (!lineKeys.has(k)) {
      await rm(join(outDir, f), { force: true })
      keys.delete(k)
    }
  }
  await writeFile(
    manifestPath,
    JSON.stringify({ engine: 'piper', credit: CREDIT, voices: VOICE_MAP, keys: [...keys].sort() }, null, 2) + '\n',
  )
  console.log(`Done: ${keys.size} clips in public/tts/local/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
