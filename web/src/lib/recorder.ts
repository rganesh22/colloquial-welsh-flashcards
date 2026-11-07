import { pcmToWav } from './tts'

/** Gemini reads WAV everywhere; browsers record webm/mp4. Re-encode to 16 kHz mono. */
const TARGET_RATE = 16000

export interface Recording {
  wav: Blob
  /** Original browser recording, for instant playback. */
  raw: Blob
  /** Speech length, with leading/trailing silence trimmed (0 if silent). */
  seconds: number
}

export interface MicSession {
  stop: () => Promise<Recording>
  cancel: () => void
}

export function micSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined'
  )
}

export async function startMic(): Promise<MicSession> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const recorder = new MediaRecorder(stream)
  const chunks: Blob[] = []
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }
  recorder.start()

  const release = () => stream.getTracks().forEach((t) => t.stop())

  return {
    cancel() {
      if (recorder.state !== 'inactive') recorder.stop()
      release()
    },
    stop() {
      return new Promise<Recording>((resolve, reject) => {
        recorder.onstop = async () => {
          release()
          try {
            const raw = new Blob(chunks, {
              type: recorder.mimeType || 'audio/webm',
            })
            const { wav, seconds } = await toWav(raw)
            // Speech length without the silence before and after.
            resolve({ wav, raw, seconds })
          } catch (err) {
            reject(err)
          }
        }
        if (recorder.state !== 'inactive') recorder.stop()
      })
    },
  }
}

/** Trimmed 16 kHz WAV plus its speech length (0 if it was all silence). */
async function toWav(blob: Blob): Promise<{ wav: Blob; seconds: number }> {
  const buf = await blob.arrayBuffer()
  const ctx = new AudioContext()
  try {
    const decoded = await ctx.decodeAudioData(buf)
    const mono = mixDown(decoded)
    const full = resample(mono, decoded.sampleRate, TARGET_RATE)
    const trimmed = trimSilence(full, TARGET_RATE)
    const resampled = trimmed ?? full
    const pcm = new Uint8Array(resampled.length * 2)
    const view = new DataView(pcm.buffer)
    for (let i = 0; i < resampled.length; i++) {
      const s = Math.max(-1, Math.min(1, resampled[i]!))
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
    return {
      wav: pcmToWav(pcm, TARGET_RATE),
      seconds: trimmed ? trimmed.length / TARGET_RATE : 0,
    }
  } finally {
    void ctx.close()
  }
}

/**
 * Cut leading and trailing silence: 20 ms frames whose RMS is under 4% of the
 * loudest frame (floor 0.01) count as silence. Keeps 150 ms either side.
 * Null when nothing is above the threshold.
 */
function trimSilence(data: Float32Array, rate: number): Float32Array | null {
  const frame = Math.max(1, Math.round(rate * 0.02))
  const frames = Math.ceil(data.length / frame)
  const rms = new Float32Array(frames)
  let peak = 0
  for (let f = 0; f < frames; f++) {
    let sum = 0
    const end = Math.min(data.length, (f + 1) * frame)
    for (let i = f * frame; i < end; i++) sum += data[i]! * data[i]!
    rms[f] = Math.sqrt(sum / Math.max(1, end - f * frame))
    peak = Math.max(peak, rms[f]!)
  }
  const threshold = Math.max(0.01, peak * 0.04)
  let first = 0
  while (first < frames && rms[first]! < threshold) first++
  if (first >= frames) return null
  let last = frames - 1
  while (last > first && rms[last]! < threshold) last--
  const pad = Math.round(rate * 0.15)
  const start = Math.max(0, first * frame - pad)
  const stop = Math.min(data.length, (last + 1) * frame + pad)
  return data.subarray(start, stop)
}

function mixDown(buffer: AudioBuffer): Float32Array {
  if (buffer.numberOfChannels === 1) return buffer.getChannelData(0)
  const out = new Float32Array(buffer.length)
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c)
    for (let i = 0; i < data.length; i++) out[i]! += data[i]! / buffer.numberOfChannels
  }
  return out
}

function resample(data: Float32Array, from: number, to: number): Float32Array {
  if (from === to) return data
  const ratio = from / to
  const out = new Float32Array(Math.floor(data.length / ratio))
  for (let i = 0; i < out.length; i++) {
    const pos = i * ratio
    const lo = Math.floor(pos)
    const hi = Math.min(lo + 1, data.length - 1)
    const t = pos - lo
    out[i] = data[lo]! * (1 - t) + data[hi]! * t
  }
  return out
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer())
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]!)
  return btoa(s)
}
