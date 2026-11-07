import { pcmToWav } from './tts'

/** Gemini reads WAV everywhere; browsers record webm/mp4. Re-encode to 16 kHz mono. */
const TARGET_RATE = 16000

export interface Recording {
  wav: Blob
  /** Original browser recording, for instant playback. */
  raw: Blob
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
  const startedAt = Date.now()

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
            const wav = await toWav(raw)
            resolve({ wav, raw, seconds: (Date.now() - startedAt) / 1000 })
          } catch (err) {
            reject(err)
          }
        }
        if (recorder.state !== 'inactive') recorder.stop()
      })
    },
  }
}

async function toWav(blob: Blob): Promise<Blob> {
  const buf = await blob.arrayBuffer()
  const ctx = new AudioContext()
  try {
    const decoded = await ctx.decodeAudioData(buf)
    const mono = mixDown(decoded)
    const resampled = resample(mono, decoded.sampleRate, TARGET_RATE)
    const pcm = new Uint8Array(resampled.length * 2)
    const view = new DataView(pcm.buffer)
    for (let i = 0; i < resampled.length; i++) {
      const s = Math.max(-1, Math.min(1, resampled[i]!))
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
    return pcmToWav(pcm, TARGET_RATE)
  } finally {
    void ctx.close()
  }
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
