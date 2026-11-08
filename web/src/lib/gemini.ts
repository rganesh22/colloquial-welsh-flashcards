import { cacheGetText, cacheSetText, hashKey } from './cache'
import {
  CLAUDE_MODELS,
  DEFAULT_CLAUDE_MODEL,
  clampClaudeModel,
  claudeGenerate,
  getClaudeKey,
} from './claude'

/** Text jobs run on Claude; this Gemini model is only the no-Claude-key fallback. */
export const GEMINI_TEXT_MODEL = 'gemini-3-flash-preview'

export const DEFAULT_ASK_MODEL = DEFAULT_CLAUDE_MODEL

export const ASK_MODELS = CLAUDE_MODELS

export type AskModelId = (typeof ASK_MODELS)[number]['id']

/** Keys for the two providers: Claude for text, Gemini (optional) for voice. */
export interface AiKeys {
  claude: string | null
  gemini: string | null
}

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
  return clampClaudeModel((model ?? '').trim())
}

export function clampAskTemperature(n: number): number {
  if (!Number.isFinite(n)) return 0.7
  return Math.min(1.2, Math.max(0, Math.round(n * 100) / 100))
}

export async function askChat(opts: {
  keys: AiKeys
  model?: string
  temperature?: number
  question: string
  context?: string
  history?: ChatTurn[]
}): Promise<{ text: string; cached: boolean }> {
  const q = opts.question.trim()
  if (!q) throw new Error('Empty question')

  const claudeKey = opts.keys.claude
  const geminiKey = opts.keys.gemini
  if (!claudeKey && !geminiKey) throw new Error('Add an Anthropic key in Settings.')
  const model = claudeKey ? clampAskModel(opts.model) : GEMINI_TEXT_MODEL
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

  const systemInstruction = [
    SYSTEM,
    context ? `\n\nCurrent card / study context:\n${context}` : '',
  ].join('')

  if (claudeKey) {
    const text = await claudeGenerate({
      apiKey: claudeKey,
      model,
      system: systemInstruction,
      effort: 'medium',
      messages: [
        ...history.map((t) => ({
          role: t.role === 'model' ? ('assistant' as const) : ('user' as const),
          text: t.text,
        })),
        { role: 'user' as const, text: q },
      ],
    })
    await cacheSetText(key, text)
    return { text, cached: false }
  }

  const { GoogleGenAI } = await import('@google/genai')
  const ai = new GoogleGenAI({ apiKey: geminiKey! })

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


/** Both keys from settings (or the build's env keys). */
export function aiKeys(s: { apiKey?: string; claudeKey?: string }): AiKeys {
  return { claude: getClaudeKey(s.claudeKey), gemini: getApiKey(s.apiKey) }
}
