/**
 * Shared Claude call for the sprint content scripts: structured JSON out,
 * streamed (long outputs), with a running cost tally in private/usage.json.
 * Needs ANTHROPIC_API_KEY in the shell.
 */
import Anthropic from '@anthropic-ai/sdk'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const here = dirname(fileURLToPath(import.meta.url))
export const privateDir = join(here, 'private')
export const MODEL = 'claude-opus-5-5'
// $ per million tokens (Opus 5.5).
const PRICE = { in: 4, out: 20, cacheRead: 0.2, cacheWrite: 5 }

const client = new Anthropic()

/** Objects need additionalProperties: false for structured outputs. */
export function strict(schema) {
  if (Array.isArray(schema)) return schema.map(strict)
  if (!schema || typeof schema !== 'object') return schema
  const out = {}
  for (const [k, v] of Object.entries(schema)) {
    out[k] = k === 'properties' ? Object.fromEntries(Object.entries(v).map(([p, s]) => [p, strict(s)])) : strict(v)
  }
  if (out.type === 'object') {
    out.additionalProperties = false
    out.required = Object.keys(out.properties ?? {})
  }
  return out
}

let usageLock = Promise.resolve()
async function logUsage(tag, u) {
  const cost =
    ((u.input_tokens ?? 0) * PRICE.in +
      (u.output_tokens ?? 0) * PRICE.out +
      (u.cache_read_input_tokens ?? 0) * PRICE.cacheRead +
      (u.cache_creation_input_tokens ?? 0) * PRICE.cacheWrite) /
    1e6
  usageLock = usageLock.then(async () => {
    const path = join(privateDir, 'usage.json')
    let log = { total: 0, calls: [] }
    try {
      log = JSON.parse(await readFile(path, 'utf8'))
    } catch {
      /* first call */
    }
    log.total = +(log.total + cost).toFixed(4)
    log.calls.push({ tag, cost: +cost.toFixed(4), at: new Date().toISOString() })
    await writeFile(path, JSON.stringify(log, null, 1))
  })
  await usageLock
  return cost
}

/**
 * One structured call. `system` is cached (put the stable, shared part there).
 * Retries transient failures; throws on refusal or bad JSON after retries.
 */
export async function callJson({ tag, system, user, schema, effort = 'medium', maxTokens = 64000 }) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const stream = client.messages.stream({
        model: MODEL,
        max_tokens: maxTokens,
        system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: user }],
        output_config: { effort, format: { type: 'json_schema', schema: strict(schema) } },
      })
      const msg = await stream.finalMessage()
      const cost = await logUsage(tag, msg.usage)
      if (msg.stop_reason === 'refusal') throw new Error(`refused: ${tag}`)
      if (msg.stop_reason === 'max_tokens') throw new Error(`hit max_tokens: ${tag}`)
      const text = msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('')
      const json = JSON.parse(text)
      console.log(`  ✓ ${tag} ($${cost.toFixed(3)})`)
      return json
    } catch (err) {
      const retryable =
        err instanceof Anthropic.RateLimitError ||
        err instanceof Anthropic.InternalServerError ||
        err instanceof Anthropic.APIConnectionError ||
        err instanceof SyntaxError ||
        /max_tokens/.test(String(err?.message))
      if (!retryable || attempt === 3) throw err
      console.warn(`  … ${tag}: ${err.message?.slice(0, 120)}; retrying`)
      await new Promise((r) => setTimeout(r, 5000 * (attempt + 1)))
    }
  }
}

/** Run jobs with limited concurrency. */
export async function pool(items, n, fn) {
  const out = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (next < items.length) {
        const i = next++
        out[i] = await fn(items[i], i)
      }
    }),
  )
  return out
}
