import { blobToBase64 } from './recorder'
import { clampAskModel } from './gemini'
import type { Scenario } from '../data/trip/scenarios'

// JSON Schema (responseJsonSchema) keeps the Gemini SDK out of the main bundle.

/**
 * AI conversation partner. Feedback follows the corrective-feedback research
 * (Lyster & Saito 2010): prompt the learner to self-correct first, recast only
 * when they can't, and fix at most one or two forms per turn.
 */

export interface TalkHint {
  welsh: string
  english: string
}

/** Empty strings mean “nothing to say” (keeps the JSON schema simple). */
export interface TalkFeedback {
  /** Short prompt that nudges self-correction ("Mae hi… or Mae e?"). */
  prompt: string
  /** The corrected learner sentence, when there was something to fix. */
  better: string
  /** One-line explanation in English. */
  why: string
}

export interface TalkTurn {
  role: 'me' | 'them'
  welsh: string
  english?: string
  feedback?: TalkFeedback
  hints?: TalkHint[]
  /** Object URL of the learner's own recording. */
  audioUrl?: string
}

export interface TalkReply {
  heard: string
  reply: string
  english: string
  feedback: TalkFeedback
  hints: TalkHint[]
}

export interface TalkReport {
  summary: string
  wins: string[]
  fixes: { said: string; better: string; why: string }[]
  phrases: TalkHint[]
  scores: {
    fluency: number
    range: number
    accuracy: number
    interaction: number
    overall: number
  }
}

/** What the partner may use, by plan week. */
export function levelBrief(week: number): string {
  if (week <= 2) {
    return 'Absolute beginner (first two weeks). Use very short present-tense sentences: Dw i…, Wyt ti…?, Dych chi…?, Mae…, Ble…?, Beth…? Ask one simple question per turn. Speak slowly and repeat key words.'
  }
  if (week <= 4) {
    return 'Early beginner. Present tense, likes (Dw i’n hoffi…), numbers, places, simple plans with mynd i. One question per turn. Avoid idioms and long subordinate clauses.'
  }
  if (week <= 6) {
    return 'Beginner moving to A2. You may use short past tense (es i, ges i, wnes i, -ais / -odd), future with bydd, and opinions with dw i’n meddwl bod… Keep sentences under ~12 words.'
  }
  return 'A2 learner preparing for real conversations. Speak naturally but clearly, at a gentle pace. You may use everyday idioms and fillers (wel, chwarae teg, ti’n gwbod) and occasionally ask a follow-up the learner did not expect, to practise repair.'
}

const REPLY_SCHEMA = {
  type: 'object',
  properties: {
    heard: {
      type: 'string',
      description:
        'Exact transcript of what the learner said (from the audio if given, else their text). Keep their mistakes.',
    },
    reply: {
      type: 'string',
      description: 'Your in-character reply in Welsh only. 1–3 short sentences.',
    },
    english: { type: 'string', description: 'English gloss of your reply.' },
    feedback: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description:
            'If the learner made an error that blocks meaning or is a key target form: a short nudge so they can self-correct (e.g. "Dw i’n… or Dw i?"). Else empty string.',
        },
        better: {
          type: 'string',
          description:
            'The learner sentence rewritten correctly and naturally, or empty string if it was fine.',
        },
        why: {
          type: 'string',
          description: 'One short English explanation, or empty string.',
        },
      },
      required: ['prompt', 'better', 'why'],
    },
    hints: {
      type: 'array',
      description:
        'Two short things the learner could say next, at their level, in Welsh with English.',
      items: {
        type: 'object',
        properties: {
          welsh: { type: 'string' },
          english: { type: 'string' },
        },
        required: ['welsh', 'english'],
      },
    },
  },
  required: ['heard', 'reply', 'english', 'feedback', 'hints'],
}

const REPORT_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    wins: { type: 'array', items: { type: 'string' } },
    fixes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          said: { type: 'string' },
          better: { type: 'string' },
          why: { type: 'string' },
        },
        required: ['said', 'better', 'why'],
      },
    },
    phrases: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          welsh: { type: 'string' },
          english: { type: 'string' },
        },
        required: ['welsh', 'english'],
      },
    },
    scores: {
      type: 'object',
      properties: {
        fluency: { type: 'number' },
        range: { type: 'number' },
        accuracy: { type: 'number' },
        interaction: { type: 'number' },
        overall: { type: 'number' },
      },
      required: ['fluency', 'range', 'accuracy', 'interaction', 'overall'],
    },
  },
  required: ['summary', 'wins', 'fixes', 'phrases', 'scores'],
}

function partnerSystem(scenario: Scenario, week: number, learner: string): string {
  return `You are role-playing a conversation partner for a Welsh learner who is preparing to visit Y Wladfa (the Welsh settlements in Chubut, Patagonia, Argentina) and film a video talking with local Welsh speakers.

CHARACTER AND SETTING
${scenario.persona}
Setting: ${scenario.setting}
The learner's goal in this conversation: ${scenario.goal}

THE LEARNER
${learner || 'An English speaker from India learning Welsh in about two months.'}
Level: ${levelBrief(week)}

HOW TO TALK
- Stay in character and reply ONLY in Welsh in "reply". Be warm, patient and curious, like Patagonian Welsh speakers who are delighted to meet a learner.
- Keep each reply to 1–3 short sentences and usually end with one question so the learner has to speak.
- Speak as this character would. ${scenario.dialect}
- Use polite "chi" with the learner unless your character would obviously use "ti".
- Patagonian Welsh is not identical to Wales Welsh. Where natural for your character, you may use a few real Wladfa features: "Pasiwch i mewn" (come in), "nain/taid", "fo" for he, both "rŵan" and "nawr", and very occasionally Spanish fillers like "bueno" or "este". Don't overdo it, and never invent Patagonian words.
- Be sensitive like a real local: you are Argentine with Welsh heritage (not "British" or "English").
- If the learner writes or says an English word because they don't know the Welsh, give the Welsh word naturally in your reply.
- If the learner says something unclear, react as a real person would ("Sori? Beth?") and help them rephrase.

FEEDBACK (separate from your in-character reply)
- Correct at most one or two important forms per turn. Ignore small slips that don't matter.
- Prefer a prompt that lets them self-correct ("feedback.prompt"), and always give the corrected sentence in "feedback.better" when something was wrong.
- If the learner's sentence was fine, set prompt, better and why to empty strings.
- "hints": two short, useful things the learner could say next, at their level.`
}

function historyContents(history: TalkTurn[]) {
  return history.map((t) => ({
    role: t.role === 'me' ? ('user' as const) : ('model' as const),
    parts: [
      {
        text:
          t.role === 'me'
            ? `Learner said: ${t.welsh}`
            : JSON.stringify({ reply: t.welsh, english: t.english ?? '' }),
      },
    ],
  }))
}

async function client(apiKey: string) {
  const { GoogleGenAI } = await import('@google/genai')
  return new GoogleGenAI({ apiKey })
}

function parseJson<T>(text: string | undefined): T {
  const raw = (text ?? '').trim()
  if (!raw) throw new Error('Empty reply from Gemini')
  return JSON.parse(raw.replace(/^```json\s*|```$/g, '')) as T
}

/** Partner opens the conversation. */
export async function talkOpen(opts: {
  apiKey: string
  model?: string
  scenario: Scenario
  week: number
  learner: string
}): Promise<TalkReply> {
  const ai = await client(opts.apiKey)
  const res = await ai.models.generateContent({
    model: clampAskModel(opts.model),
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `(The learner has just walked up. Open the conversation in character with a greeting and one easy question. "heard" must be an empty string. Feedback fields empty strings.)\n\nOpening line idea: ${opts.scenario.opener}`,
          },
        ],
      },
    ],
    config: {
      systemInstruction: partnerSystem(opts.scenario, opts.week, opts.learner),
      temperature: 0.8,
      responseMimeType: 'application/json',
      responseJsonSchema: REPLY_SCHEMA,
    },
  })
  return parseJson<TalkReply>(res.text)
}

/** Learner speaks (audio) or types; partner replies with feedback. */
export async function talkTurn(opts: {
  apiKey: string
  model?: string
  scenario: Scenario
  week: number
  learner: string
  history: TalkTurn[]
  text?: string
  audio?: Blob
}): Promise<TalkReply> {
  const ai = await client(opts.apiKey)
  const parts: (
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  )[] = []
  if (opts.audio) {
    parts.push({
      inlineData: { mimeType: 'audio/wav', data: await blobToBase64(opts.audio) },
    })
    parts.push({
      text: 'The learner spoke the audio above (Welsh, maybe with some English). Transcribe it faithfully into "heard", then reply.',
    })
  } else {
    parts.push({ text: `Learner said: ${opts.text ?? ''}` })
  }
  const res = await ai.models.generateContent({
    model: clampAskModel(opts.model),
    contents: [...historyContents(opts.history), { role: 'user', parts }],
    config: {
      systemInstruction: partnerSystem(opts.scenario, opts.week, opts.learner),
      temperature: 0.8,
      responseMimeType: 'application/json',
      responseJsonSchema: REPLY_SCHEMA,
    },
  })
  return parseJson<TalkReply>(res.text)
}

/** End-of-conversation coaching report (and checkpoint scores). */
export async function talkReport(opts: {
  apiKey: string
  model?: string
  scenario: Scenario
  week: number
  history: TalkTurn[]
}): Promise<TalkReport> {
  const ai = await client(opts.apiKey)
  const transcript = opts.history
    .map((t) => `${t.role === 'me' ? 'LEARNER' : 'PARTNER'}: ${t.welsh}`)
    .join('\n')
  const res = await ai.models.generateContent({
    model: clampAskModel(opts.model),
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `You are a friendly, honest Welsh speaking coach. Review this practice conversation (scenario: ${opts.scenario.title}). The learner is in week ${opts.week} of an 8-week plan to chat with Welsh speakers in Patagonia.

${transcript}

Return:
- summary: 2–3 sentences in English, encouraging but honest.
- wins: up to 3 specific things they did well.
- fixes: up to 4 of the most useful corrections (said → better → why), prioritising patterns they'll reuse.
- phrases: up to 5 Welsh phrases that would have helped them in this conversation.
- scores: 1–5 each for fluency (keeping going, few long stalls), range (variety of words/patterns), accuracy, interaction (asking questions back, repairing misunderstandings) and overall, judged against the realistic target for a two-month learner (5 = could hold this conversation comfortably with a patient native speaker).`,
          },
        ],
      },
    ],
    config: {
      temperature: 0.3,
      responseMimeType: 'application/json',
      responseJsonSchema: REPORT_SCHEMA,
    },
  })
  return parseJson<TalkReport>(res.text)
}

/** Feedback on a recorded monologue (the 4/3/2 retell). */
export async function retellFeedback(opts: {
  apiKey: string
  model?: string
  topic: string
  audio: Blob
}): Promise<{ heard: string; tips: string[]; better: string }> {
  const ai = await client(opts.apiKey)
  const res = await ai.models.generateContent({
    model: clampAskModel(opts.model),
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'audio/wav',
              data: await blobToBase64(opts.audio),
            },
          },
          {
            text: `A Welsh learner (about two months in) just spoke on this topic: "${opts.topic}". Transcribe what they said in "heard" (keep their mistakes). Then give up to 3 short English tips in "tips" (fluency first, then the most useful grammar fix), and "better": a corrected, natural version of what they tried to say, in simple Welsh.`,
          },
        ],
      },
    ],
    config: {
      temperature: 0.3,
      responseMimeType: 'application/json',
      responseJsonSchema: {
        type: 'object',
        properties: {
          heard: { type: 'string' },
          tips: { type: 'array', items: { type: 'string' } },
          better: { type: 'string' },
        },
        required: ['heard', 'tips', 'better'],
      },
    },
  })
  return parseJson(res.text)
}
