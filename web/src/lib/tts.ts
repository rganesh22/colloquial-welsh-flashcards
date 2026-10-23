import { cacheGetAudio, cacheSetAudio, hashKey } from './cache'

export const TTS_MODEL = 'gemini-3.1-flash-tts-preview'
/** Calm deep male voice — same as wiktionary_web_scraper. */
export const TTS_VOICE = 'Enceladus'
export const TTS_LANGUAGE = 'cy-GB'
export const TTS_ACCENT_PROMPT =
  'Speak in Welsh as spoken in Wales, with a calm deep male voice.'

export function ttsSpeakPrompt(text: string): string {
  const spoken = text.trim()
  return `${TTS_ACCENT_PROMPT}\n\nRead aloud exactly the following text:\n${spoken}`
}

function base64ToBytes(base64: string): Uint8Array {
  const bin = atob(base64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const out = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(out).set(bytes)
  return out
}

function bytesToBase64(bytes: Uint8Array): string {
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]!)
  return btoa(s)
}

/** Wrap raw PCM (16-bit LE mono 24kHz) in a WAV container. */
export function pcmToWav(
  pcm: Uint8Array,
  sampleRate = 24000,
  numChannels = 1,
  bitDepth = 16,
): Blob {
  const blockAlign = (numChannels * bitDepth) / 8
  const byteRate = sampleRate * blockAlign
  const dataSize = pcm.length
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitDepth, true)
  writeStr(36, 'data')
  view.setUint32(40, dataSize, true)
  new Uint8Array(buffer, 44).set(pcm)
  return new Blob([buffer], { type: 'audio/wav' })
}

function speakBrowser(text: string): void {
  if (!('speechSynthesis' in window)) {
    throw new Error('Speech not available')
  }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const voices = window.speechSynthesis.getVoices()
  const cy =
    voices.find((v) => v.lang.toLowerCase().startsWith('cy')) ??
    voices.find((v) => /welsh|cymraeg/i.test(v.name))
  if (cy) {
    u.voice = cy
    u.lang = cy.lang
  } else {
    u.lang = 'cy-GB'
  }
  u.rate = 0.9
  window.speechSynthesis.speak(u)
}

let currentAudio: HTMLAudioElement | null = null
let playToken = 0
let currentStop: (() => void) | null = null

function haltPlayback(): number {
  playToken += 1
  window.speechSynthesis?.cancel()
  currentStop?.()
  currentStop = null
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  return playToken
}

const TTS_CACHE_EVENT = 'cw-tts-cache'

export function cachePayloadFor(text: string): string {
  return JSON.stringify({
    model: TTS_MODEL,
    voice: TTS_VOICE,
    language: TTS_LANGUAGE,
    accent: TTS_ACCENT_PROMPT,
    text: text.trim(),
  })
}

export async function ttsAudioKey(text: string): Promise<string> {
  return hashKey(cachePayloadFor(text))
}

type Manifest = {
  model: string
  voice: string
  language?: string
  accent?: string
  /** text → audio hash */
  entries: Record<string, string>
}

let manifestPromise: Promise<Manifest | null> | null = null

function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || './'
  return `${base}${path.replace(/^\//, '')}`
}

async function loadManifest(): Promise<Manifest | null> {
  if (!manifestPromise) {
    manifestPromise = fetch(assetUrl('tts/manifest.json'))
      .then(async (r) => (r.ok ? ((await r.json()) as Manifest) : null))
      .catch(() => null)
  }
  return manifestPromise
}

function bundledUrl(hash: string): string {
  return assetUrl(`tts/${hash}.wav`)
}

async function fetchBundledWav(
  text: string,
): Promise<{ blob: Blob; hash: string } | null> {
  const trimmed = text.trim()
  const manifest = await loadManifest()
  if (
    !manifest ||
    manifest.model !== TTS_MODEL ||
    manifest.voice !== TTS_VOICE ||
    (manifest.accent != null && manifest.accent !== TTS_ACCENT_PROMPT)
  ) {
    return null
  }
  const hash = manifest.entries[trimmed]
  if (!hash) return null
  try {
    const res = await fetch(bundledUrl(hash))
    if (!res.ok) return null
    const blob = await res.blob()
    return { blob, hash }
  } catch {
    return null
  }
}

/** Whether Gemini TTS audio for this phrase is already available (IDB or bundle). */
export async function hasCachedTts(text: string): Promise<boolean> {
  const trimmed = text.trim()
  if (!trimmed) return false
  const key = await ttsAudioKey(trimmed)
  const hit = await cacheGetAudio(key)
  if (hit) return true
  const manifest = await loadManifest()
  if (
    manifest &&
    manifest.model === TTS_MODEL &&
    manifest.voice === TTS_VOICE &&
    (manifest.accent == null || manifest.accent === TTS_ACCENT_PROMPT) &&
    manifest.entries[trimmed]
  ) {
    return true
  }
  return false
}

function notifyTtsCached(text: string): void {
  window.dispatchEvent(
    new CustomEvent(TTS_CACHE_EVENT, { detail: { text: text.trim() } }),
  )
}

export function onTtsCached(
  listener: (text: string) => void,
): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<{ text: string }>).detail
    if (detail?.text) listener(detail.text)
  }
  window.addEventListener(TTS_CACHE_EVENT, handler)
  return () => window.removeEventListener(TTS_CACHE_EVENT, handler)
}

async function generateGeminiWav(
  text: string,
  apiKey: string,
): Promise<Blob> {
  const { GoogleGenAI } = await import('@google/genai')
  const ai = new GoogleGenAI({ apiKey })
  const response = await ai.models.generateContent({
    model: TTS_MODEL,
    contents: [{ parts: [{ text: ttsSpeakPrompt(text) }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: TTS_VOICE },
        },
      },
    },
  })

  const part = response.candidates?.[0]?.content?.parts?.[0]
  const data = part?.inlineData?.data
  if (!data) throw new Error('No audio from Gemini TTS')
  return pcmToWav(base64ToBytes(data))
}

/** Generate (or load) WAV without playing — used for prefetch / warm cache. */
export async function ensureWelshAudio(opts: {
  text: string
  apiKey: string | null
}): Promise<{ cached: boolean; source: 'gemini' | 'bundle' | 'browser' }> {
  const text = opts.text.trim()
  if (!text) throw new Error('Nothing to speak')

  const bundled = await fetchBundledWav(text)
  if (bundled) {
    if (opts.apiKey) {
      const key = await ttsAudioKey(text)
      const wavBytes = new Uint8Array(await bundled.blob.arrayBuffer())
      await cacheSetAudio(key, bytesToBase64(wavBytes), 'audio/wav')
      notifyTtsCached(text)
    }
    return { cached: true, source: 'bundle' }
  }

  if (!opts.apiKey) {
    return { cached: false, source: 'browser' }
  }

  const key = await ttsAudioKey(text)
  const hit = await cacheGetAudio(key)
  if (hit) return { cached: true, source: 'gemini' }

  const wavBlob = await generateGeminiWav(text, opts.apiKey)
  const wavBytes = new Uint8Array(await wavBlob.arrayBuffer())
  await cacheSetAudio(key, bytesToBase64(wavBytes), 'audio/wav')
  notifyTtsCached(text)
  return { cached: false, source: 'gemini' }
}

async function audioBlobFor(
  text: string,
  apiKey: string | null,
): Promise<{ blob: Blob; cached: boolean; source: 'bundle' | 'gemini' } | null> {
  const key = await ttsAudioKey(text)
  const hit = await cacheGetAudio(key)
  if (hit) {
    const bytes = base64ToBytes(hit.base64)
    const blob = hit.mimeType.includes('wav')
      ? new Blob([toArrayBuffer(bytes)], { type: 'audio/wav' })
      : pcmToWav(bytes)
    return { blob, cached: true, source: 'gemini' }
  }

  const bundled = await fetchBundledWav(text)
  if (bundled) {
    const wavBytes = new Uint8Array(await bundled.blob.arrayBuffer())
    await cacheSetAudio(key, bytesToBase64(wavBytes), 'audio/wav')
    notifyTtsCached(text)
    return { blob: bundled.blob, cached: true, source: 'bundle' }
  }

  if (!apiKey) return null
  try {
    const blob = await generateGeminiWav(text, apiKey)
    const wavBytes = new Uint8Array(await blob.arrayBuffer())
    await cacheSetAudio(key, bytesToBase64(wavBytes), 'audio/wav')
    notifyTtsCached(text)
    return { blob, cached: false, source: 'gemini' }
  } catch (err) {
    console.warn('Gemini TTS failed, falling back to browser', err)
    return null
  }
}

function playBlob(blob: Blob, token: number): Promise<void> {
  return new Promise((resolve) => {
    if (token !== playToken) {
      resolve()
      return
    }
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    currentAudio = audio
    const finish = () => {
      URL.revokeObjectURL(url)
      if (currentStop === finish) currentStop = null
      if (currentAudio === audio) currentAudio = null
      resolve()
    }
    currentStop = finish
    audio.onended = finish
    audio.onerror = finish
    void audio.play().catch(finish)
  })
}

function speakBrowserWait(text: string, token: number): Promise<void> {
  return new Promise((resolve) => {
    if (token !== playToken || !('speechSynthesis' in window)) {
      resolve()
      return
    }
    const u = new SpeechSynthesisUtterance(text)
    const voices = window.speechSynthesis.getVoices()
    const cy =
      voices.find((v) => v.lang.toLowerCase().startsWith('cy')) ??
      voices.find((v) => /welsh|cymraeg/i.test(v.name))
    if (cy) {
      u.voice = cy
      u.lang = cy.lang
    } else {
      u.lang = 'cy-GB'
    }
    u.rate = 0.9
    const finish = () => {
      if (currentStop === finish) currentStop = null
      resolve()
    }
    currentStop = finish
    u.onend = finish
    u.onerror = finish
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  })
}

export async function speakWelsh(opts: {
  text: string
  apiKey: string | null
}): Promise<{ cached: boolean; source: 'gemini' | 'bundle' | 'browser' }> {
  const text = opts.text.trim()
  if (!text) throw new Error('Nothing to speak')

  const token = haltPlayback()
  const loaded = await audioBlobFor(text, opts.apiKey)
  if (token !== playToken) return { cached: false, source: 'browser' }
  if (!loaded) {
    speakBrowser(text)
    return { cached: false, source: 'browser' }
  }
  await playBlob(loaded.blob, token)
  return { cached: loaded.cached, source: loaded.source }
}

/** Play Welsh lines in order. A new call, or speakWelsh, stops the previous run. */
export async function playWelshSequence(
  texts: string[],
  apiKey: string | null,
): Promise<void> {
  const token = haltPlayback()
  for (const raw of texts) {
    const text = raw.trim()
    if (!text) continue
    if (token !== playToken) return
    const loaded = await audioBlobFor(text, apiKey)
    if (token !== playToken) return
    if (!loaded) await speakBrowserWait(text, token)
    else await playBlob(loaded.blob, token)
  }
}
