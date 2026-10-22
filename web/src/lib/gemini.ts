import { cacheGetText, cacheSetText, hashKey } from './cache'

export const DEFAULT_ASK_MODEL = 'gemini-3-flash-preview'

export const ASK_MODELS = [
  { id: 'gemini-3-flash-preview', label: '3 Flash · default' },
  { id: 'gemini-3.8-flash', label: '3.8 Flash · latest' },
  { id: 'gemini-2.5-flash', label: '2.5 Flash · fast' },
  { id: 'gemini-2.5-pro', label: '2.5 Pro · deeper' },
  { id: 'gemini-2.0-flash', label: '2.0 Flash' },
  { id: 'gemini-flash-latest', label: 'Flash latest' },
] as const

export type AskModelId = (typeof ASK_MODELS)[number]['id']

export type ChatTurn = {
  role: 'user' | 'model'
  text: string
}

const SYSTEM = `You are a concise Welsh tutor for learners using Colloquial Welsh and Intermediate Welsh Reader (Gareth King).
Answer briefly and clearly. Prefer Welsh examples with short English glosses.
Use Markdown for readability: short headings, bullet lists, and **bold** for key forms.
Note North/South variants when relevant. No fluff.`

export function getApiKey(stored?: string | null): string | null {
  const fromEnv =
    (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ||
    (import.meta.env.GEMINI_API_KEY as string | undefined)
  const key = stored?.trim() || fromEnv?.trim() || ''
  return key || null
}

export function clampAskModel(model: string | undefined | null): string {
  const m = (model ?? '').trim()
  if (ASK_MODELS.some((x) => x.id === m)) return m
  return DEFAULT_ASK_MODEL
}

export function clampAskTemperature(n: number): number {
  if (!Number.isFinite(n)) return 0.7
  return Math.min(1.2, Math.max(0, Math.round(n * 100) / 100))
}

export async function askGeminiChat(opts: {
  apiKey: string
  model?: string
  temperature?: number
  question: string
  context?: string
  history?: ChatTurn[]
}): Promise<{ text: string; cached: boolean }> {
  const q = opts.question.trim()
  if (!q) throw new Error('Empty question')

  const model = clampAskModel(opts.model)
  const temperature = clampAskTemperature(opts.temperature ?? 0.7)
  const history = (opts.history ?? []).filter((t) => t.text.trim())
  const context = opts.context?.trim() || ''

  const cachePayload = JSON.stringify({
    model,
    temperature,
    q,
    context,
    history,
  })
  const key = await hashKey(cachePayload)
  const hit = await cacheGetText(key)
  if (hit) return { text: hit, cached: true }

  const { GoogleGenAI } = await import('@google/genai')
  const ai = new GoogleGenAI({ apiKey: opts.apiKey })

  const systemInstruction = [
    SYSTEM,
    context ? `\n\nCurrent card / study context:\n${context}` : '',
  ].join('')

  const contents = [
    ...history.map((t) => ({
      role: t.role,
      parts: [{ text: t.text }],
    })),
    { role: 'user' as const, parts: [{ text: q }] },
  ]

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      temperature,
    },
  })

  const text = (response.text ?? '').trim()
  if (!text) throw new Error('Empty Gemini response')

  await cacheSetText(key, text)
  return { text, cached: false }
}

/** @deprecated Prefer askGeminiChat for multi-turn. */
export async function askGemini(opts: {
  apiKey: string
  question: string
  context?: string
  model?: string
}): Promise<{ text: string; cached: boolean }> {
  return askGeminiChat(opts)
}
