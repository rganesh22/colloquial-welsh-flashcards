/**
 * Claude (Anthropic) for every text job: the conversation partner, feedback,
 * reports, retell coaching and Ask. Claude can't hear or speak, so audio stays
 * on Gemini (optional) or the browser.
 */

export const DEFAULT_CLAUDE_MODEL = 'claude-opus-5-5'

export const CLAUDE_MODELS = [
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5 · best' },
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5 · balanced' },
  { id: 'claude-haiku-5-5', label: 'Claude Haiku 5.5 · fastest' },
] as const

export type ClaudeEffort = 'low' | 'medium' | 'high'

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  text: string
}

export function getClaudeKey(stored?: string | null): string | null {
  const fromEnv = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
  const key = stored?.trim() || fromEnv?.trim() || ''
  return key || null
}

export function isClaudeModel(model: string | undefined | null): boolean {
  return CLAUDE_MODELS.some((m) => m.id === model)
}

export function clampClaudeModel(model: string | undefined | null): string {
  return isClaudeModel(model) ? model! : DEFAULT_CLAUDE_MODEL
}

const RANGE_KEYS = ['minimum', 'maximum', 'minItems', 'maxItems', 'minLength', 'maxLength']

/**
 * Structured outputs need `additionalProperties: false` on every object and
 * don't take numeric ranges, so ranges move into the description (the app
 * clamps those numbers itself anyway).
 */
export function strictSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(strictSchema)
  if (!schema || typeof schema !== 'object') return schema
  const out: Record<string, unknown> = {}
  const ranges: string[] = []
  for (const [k, v] of Object.entries(schema)) {
    if (RANGE_KEYS.includes(k)) ranges.push(`${k} ${String(v)}`)
    else out[k] = k === 'properties' || k === 'items' ? strictSchema(v) : v
  }
  if (out.properties && typeof out.properties === 'object') {
    out.properties = Object.fromEntries(
      Object.entries(out.properties).map(([k, v]) => [k, strictSchema(v)]),
    )
  }
  if (out.type === 'object') out.additionalProperties = false
  if (ranges.length) {
    out.description = [out.description, `(${ranges.join(', ')})`].filter(Boolean).join(' ')
  }
  return out
}

/** Claude wants user/assistant turns that alternate and start with the user. */
function toMessages(messages: ClaudeMessage[]): { role: 'user' | 'assistant'; content: string }[] {
  const out: { role: 'user' | 'assistant'; content: string }[] = []
  for (const m of messages) {
    const text = m.text.trim()
    if (!text) continue
    const last = out[out.length - 1]
    if (last?.role === m.role) last.content += `\n\n${text}`
    else out.push({ role: m.role, content: text })
  }
  if (out[0]?.role === 'assistant') out.unshift({ role: 'user', content: '(Start.)' })
  return out
}

export async function claudeGenerate(opts: {
  apiKey: string
  model?: string
  system?: string
  messages: ClaudeMessage[]
  effort?: ClaudeEffort
  /** JSON Schema for structured output; the reply text is then JSON. */
  schema?: object
  maxTokens?: number
}): Promise<string> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  // The key is the learner's own, kept in this browser only.
  const client = new Anthropic({ apiKey: opts.apiKey, dangerouslyAllowBrowser: true })
  const res = await client.messages.create({
    model: clampClaudeModel(opts.model),
    max_tokens: opts.maxTokens ?? 8000,
    ...(opts.system ? { system: opts.system } : {}),
    messages: toMessages(opts.messages),
    output_config: {
      effort: opts.effort ?? 'low',
      ...(opts.schema
        ? {
            format: {
              type: 'json_schema' as const,
              schema: strictSchema(opts.schema) as Record<string, unknown>,
            },
          }
        : {}),
    },
  })
  if (res.stop_reason === 'refusal') throw new Error('Claude declined to answer that.')
  const text = res.content
    .map((b) => (b.type === 'text' ? b.text : ''))
    .join('')
    .trim()
  if (!text) throw new Error('Empty reply from Claude')
  return text
}
