import type { ThinkingLevel } from '@google/genai'
import { blobToBase64 } from './recorder'
import { clampAskModel, DEFAULT_ASK_MODEL } from './gemini'
import type { Scenario } from '../data/trip/scenarios'
import { WEEK_PLANS, weekPlan } from '../data/trip/plan'
import { cardsForLesson } from '../data/deck'

// JSON Schema (responseJsonSchema) keeps the Gemini SDK out of the main bundle.
// Temperatures here are below Google's recommended 1.0 for Gemini 3 on purpose:
// we want steady, level-appropriate replies and repeatable scoring.

/**
 * AI conversation partner. Feedback follows the corrective-feedback research
 * (Lyster & Saito 2010): prompt the learner to self-correct first, recast only
 * slips you aren't prompting on, and fix at most one form per turn — only
 * forms that block meaning or are this week's targets.
 */

export interface TalkHint {
  welsh: string
  english: string
  /** First 2–3 Welsh words or a keyword: the first, smaller hint. */
  starter?: string
}

/** Empty strings mean “nothing to say” (keeps the JSON schema simple). */
export interface TalkFeedback {
  /** Short prompt that nudges self-correction ("Mae hi… or Mae e?"). */
  prompt: string
  /** The learner's own sentence with only the targeted error fixed. */
  better: string
  /** One-line explanation in English. */
  why: string
  /** Prompt withheld by the pacing rules: kept for the record, not shown. */
  held?: boolean
}

/** Result of a second try after a feedback prompt. */
export interface TalkRetry {
  /** 'unclear': the transcriber couldn't hear the targeted word, so no verdict. */
  outcome: 'fixed' | 'not-fixed' | 'unclear'
  fixed: boolean
  heard: string
  uncertain: string[]
  better: string
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
  /** Learner turn: typed rather than spoken. */
  typed?: boolean
  /** Learner turn: length of the recording. */
  seconds?: number
  /** Learner turn: words the transcriber couldn't hear clearly (mutations, 'n). */
  uncertain?: string[]
  /** Learner turn: "I can't say this" — what they wanted to say (English). */
  stuck?: string
  /** Learner turn: their second try after a feedback prompt. */
  retry?: TalkRetry
  /** Learner turn: they fixed the transcript by hand. */
  edited?: boolean
}

export interface TalkReply {
  /** Verbatim transcript (audio) or the typed text. Set in code. */
  heard: string
  /** Transcriber's unsure words (audio only). */
  uncertain: string[]
  reply: string
  english: string
  feedback: TalkFeedback
  hints: TalkHint[]
}

/** Measured in the browser, so fluency isn't guessed from a transcript. */
export interface TalkMetrics {
  learnerTurns: number
  spokenTurns: number
  typedTurns: number
  /** Mean Welsh words per spoken turn (no «English», no hesitations). */
  wordsPerTurn: number
  /** Welsh words per minute of recording, over spoken turns. */
  speechRate: number
  /** Share of learner words in Welsh (not inside «»), 0–1. */
  welshShare: number
  /** Mean recording length per spoken turn. */
  secondsPerTurn: number
  /** Hint lists opened (starters shown). */
  hintsOpened: number
  /** Hint lists revealed in full. */
  hintsFull: number
  cantSay: number
  selfCorrections: number
  /** Partner turns the learner answered. */
  partnerTurnsAnswered: number
  /** Answered without opening the text first; null when text was always shown. */
  understoodWithoutText: number | null
  textReveals: number
}

export interface TalkReport {
  summary: string
  wins: string[]
  fixes: { said: string; better: string; why: string }[]
  phrases: TalkHint[]
  scores: {
    /** Computed in code from the metrics (fluencyScore). */
    fluency: number
    range: number
    accuracy: number
    interaction: number
    /** Mean of the four, to one decimal. */
    overall: number
  }
  /** Did they achieve the scenario goal: 0 no, 1 partly, 2 yes. */
  taskDone: number
  metrics?: TalkMetrics
  /** Words the transcriber wasn't sure of, across the conversation. */
  uncertain: string[]
}

/** What the partner may use, by plan week. */
export function levelBrief(week: number): string {
  if (week <= 2) {
    return 'Absolute beginner (first two weeks). Use very short present-tense sentences: Dw i…, Wyt ti…?, Dych chi…?, Mae…, Ble…?, Beth…? At most one simple question per turn. Speak slowly and repeat key words.'
  }
  if (week <= 4) {
    return 'Early beginner. Present tense, likes (Dw i’n hoffi…), numbers, places, simple plans with mynd i. At most one question per turn. Avoid idioms and long subordinate clauses.'
  }
  if (week <= 6) {
    return 'Beginner moving to A2. You may use short past tense (es i, ges i, wnes i, -ais / -odd), future with bydd, and opinions with dw i’n meddwl bod… Keep sentences under ~12 words.'
  }
  return 'A2 learner preparing for real conversations. Speak naturally but clearly, at a gentle pace. You may use everyday idioms and fillers (wel, chwarae teg, ti’n gwbod) and occasionally ask a follow-up the learner did not expect, to practise repair. Sometimes (about one turn in three) give a longer answer of 3–5 sentences, like a real interviewee would, then stop and let the learner check they understood.'
}

/** Regional and register variants that are never errors. */
const VARIANTS =
  'gyda/efo, nawr/rŵan, e/fe/fo, dych chi/dach chi/ydych chi, dw i/rydw i/dwi, mae gen i / mae … gyda fi; does gen i ddim / sgen i ddim / does dim … gyda fi, moyn/isio/eisiau, mas/allan, ydy/yw, shwmae/sut mae, hefyd/’fyd, gwybod/gwbod, ia/ie, be/beth, dan ni/dyn ni, sgynnoch chi/mae gyda chi'

/** Interview answers from week 5; everyone gets longer turns from week 7. */
function longAnswers(scenario: Scenario, week: number): boolean {
  return (scenario.id === 'cyfweliad-iaith' && week >= 5) || week >= 7
}

/** Drift guard word cap: replies must stay short enough to follow by ear. */
function maxReplyWords(scenario: Scenario, week: number): number {
  if (longAnswers(scenario, week)) return 90
  if (week <= 2) return 20
  if (week <= 4) return 30
  return 40
}

/**
 * Phrase-card Welsh up to this week, current and previous week first, so the
 * partner speaks with language the learner has met.
 */
function knownPhrases(week: number, limit = 25): string[] {
  const quota = [12, 8] // current week, previous week; earlier weeks fill the rest
  const out: string[] = []
  for (let w = week, k = 0; w >= 1 && out.length < limit; w--, k++) {
    const cards = (WEEK_PLANS[w - 1]?.phraseLessons ?? [])
      .flatMap((id) => cardsForLesson('patagonia', id))
      .sort((a, b) => a.number - b.number)
    const take = Math.min(quota[k] ?? limit, limit - out.length)
    // Spread the picks across the week rather than taking its first cards.
    const step = Math.max(1, cards.length / take)
    for (let i = 0; i < cards.length && out.length < limit; i += step) {
      const welsh = cards[Math.floor(i)]!.welsh
      if (!out.includes(welsh)) out.push(welsh)
      if (out.length >= limit) break
    }
  }
  return out
}

/**
 * Two lists: TARGET FORMS (the only things feedback may correct) and KNOWN
 * LANGUAGE (what replies are built from; never a correction list).
 */
export function talkTargets(opts: {
  week: number
  frames: string[]
  /** "said → better (why)", newest first. */
  recentFixes?: string[]
}): string {
  const plan = weekPlan(opts.week)
  const frames = opts.frames.map((f) => `"${f}"`).join(', ')
  const fixes = (opts.recentFixes ?? []).slice(0, 3)
  const target = [
    'TARGET FORMS (the only forms you may correct, besides errors that block meaning)',
    `- This week's focus: ${plan.focus} (${plan.canDo.join('; ')})`,
    `- Planned frames: ${frames}`,
  ]
  if (fixes.length) {
    target.push(`- Recent fixes: ${fixes.map((f) => `"${f}"`).join('; ')}`)
  }
  const known = [
    'KNOWN LANGUAGE (build your replies from this; it is NOT a correction list)',
    [frames, ...knownPhrases(opts.week).map((p) => `"${p}"`)].join(', '),
  ]
  return [...target, '', ...known].join('\n')
}

const FEEDBACK_SCHEMA = {
  type: 'object',
  properties: {
    prompt: {
      type: 'string',
      description:
        'Only for a clear error that blocks meaning or is in a target form: a short nudge so they can self-correct (e.g. "Dw i’n… or Dw i?"). "Now say it" after [LEARNER_STUCK]. Else empty string.',
    },
    better: {
      type: 'string',
      description:
        'The learner’s own sentence with ONLY the targeted error fixed — keep their words and word order. After [LEARNER_STUCK]: the simplest natural Welsh for what they wanted to say. Else empty string.',
    },
    why: {
      type: 'string',
      description: 'One short English explanation, or empty string.',
    },
  },
  required: ['prompt', 'better', 'why'],
}

const REPLY_SCHEMA = {
  type: 'object',
  properties: {
    reply: {
      type: 'string',
      description:
        'Your in-character reply in Welsh only. Usually 1–3 short sentences (longer only where the system prompt allows).',
    },
    english: { type: 'string', description: 'English gloss of your reply.' },
    feedback: FEEDBACK_SCHEMA,
    hints: {
      type: 'array',
      description:
        'Two short things the learner could say next, in Welsh with English, using only KNOWN LANGUAGE plus at most one new word.',
      items: {
        type: 'object',
        properties: {
          starter: {
            type: 'string',
            description: 'The first 2–3 Welsh words of the hint, or one keyword.',
          },
          welsh: { type: 'string' },
          english: { type: 'string' },
        },
        required: ['starter', 'welsh', 'english'],
      },
    },
  },
  required: ['reply', 'english', 'feedback', 'hints'],
}

const SCORE = { type: 'integer', minimum: 1, maximum: 5 }

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
        range: SCORE,
        accuracy: SCORE,
        interaction: SCORE,
      },
      required: ['range', 'accuracy', 'interaction'],
    },
    taskDone: { type: 'integer', minimum: 0, maximum: 2 },
  },
  required: ['summary', 'wins', 'fixes', 'phrases', 'scores', 'taskDone'],
}

const RETRY_SCHEMA = {
  type: 'object',
  properties: {
    fixed: { type: 'boolean' },
    heard: { type: 'string' },
    better: { type: 'string' },
    why: { type: 'string' },
  },
  required: ['fixed', 'heard', 'better', 'why'],
}

const TRANSCRIBE_SCHEMA = {
  type: 'object',
  properties: {
    transcript: { type: 'string' },
    uncertain: {
      type: 'array',
      description:
        'Words, exactly as written in the transcript, whose mutation, ending or ’n/yn link you could not hear clearly. Empty if none.',
      items: { type: 'string' },
    },
  },
  required: ['transcript', 'uncertain'],
}

/** Meta turn sent by "I can't say this"; documented in partnerSystem. */
const STUCK_TAG = '[LEARNER_STUCK]'

/** Partners whose character notes allow Spanish replies (people who switch, or don't speak Welsh). */
const SPANISH_SCENARIOS = new Set(['sbaeneg', 'disgynnydd'])

/** Partners who aren't Wladfa locals (Rhian is visiting from Carmarthenshire). */
const LOCAL_EXCEPT = new Set(['ymwelydd'])

/** Whether this partner is a Patagonian local (Wladfa voice and features). */
export function isWladfaLocal(scenarioId: string): boolean {
  return !LOCAL_EXCEPT.has(scenarioId)
}

function partnerSystem(o: PartnerOpts): string {
  const { scenario, week, learner, targets, checkpoint } = o
  const length =
    scenario.id === 'cyfweliad-iaith' && longAnswers(scenario, week)
      ? 'When the learner asks you an interview question, always answer in 3–5 sentences, like a real interviewee, then stop and let them follow up. Otherwise keep to 1–3 short sentences.'
      : 'Keep each reply to 1–3 short sentences.'
  const recast = checkpoint
    ? ''
    : `
- Recast: when natural, echo once in your reply the correct form of a slip you are NOT prompting on (learner "Dw i mynd i Drelew" → you "O, dych chi’n mynd i Drelew?"), without pointing out the mistake. If you set feedback.prompt this turn, your reply must NOT contain the corrected form; let them find it.`
  const feedback = checkpoint
    ? `CHECKPOINT (this conversation is being measured)
- Don't correct or recast anything. Set feedback prompt, better and why to empty strings — except after ${STUCK_TAG}, where you still give the Welsh as described above.
- "hints": empty array.`
    : `FEEDBACK (separate from your in-character reply)
- Only give feedback for (a) an error that blocks meaning, or (b) an error in one of the TARGET FORMS above (never just because a form appears in KNOWN LANGUAGE). Ignore everything else, even if it isn't perfect.
- If you are not sure it is an error, give no feedback.
- At most one form per turn. Prefer a prompt that lets them self-correct (feedback.prompt), and put their own sentence with ONLY that error fixed in feedback.better — keep their words and word order.
- Never correct valid regional or register variants (${VARIANTS}) and never correct for style or "more natural" phrasing.
- Spoken turns come from speech recognition: never prompt on a word listed as [transcript unsure: …], and never prompt on the yn/’n link unless it is clearly absent.
- Typed turns: ignore spelling, apostrophes and circumflexes.
- If they were understandable and made no target-form error, set prompt, better and why to empty strings.
- Each earlier learner turn is annotated with the coach prompt it got and whether they self-corrected; don't repeat a prompt they already fixed.
- "hints": two short, useful things the learner could say next, using only KNOWN LANGUAGE plus at most one new word, each with a "starter" (first 2–3 words or a keyword).`
  return `You are role-playing a conversation partner for a Welsh learner who is preparing to visit Y Wladfa (the Welsh settlements in Chubut, Patagonia, Argentina) and film a video talking with local Welsh speakers.

CHARACTER AND SETTING
${scenario.persona}
Setting: ${scenario.setting}
The learner's goal in this conversation: ${scenario.goal}

THE LEARNER
${learner || 'An English speaker from India learning Welsh in about two months.'}
Level: ${levelBrief(week)}

TARGETS
${targets}

HOW TO TALK
- Stay in character and reply ONLY in Welsh in "reply"${SPANISH_SCENARIOS.has(scenario.id) ? ' (except where your character notes below say you use Spanish)' : ''}. Be warm, patient and curious, like Patagonian Welsh speakers who are delighted to meet a learner.
- ${length}
- Build your replies mainly from the KNOWN LANGUAGE above. Use at most one new word per turn, and repeat it.
- About one turn in three, react or share something about yourself without a question and wait, so the learner can ask you something. If they ask, answer and follow their topic. Otherwise end with one question.
- Create natural chances for the learner to use the planned frames (ask things whose natural answer uses them).
- Speak as this character would. ${scenario.dialect}
- Use polite "chi" with the learner unless your character would obviously use "ti".
${
    isWladfaLocal(scenario.id)
      ? `- Patagonian Welsh is not identical to Wales Welsh. Where natural for your character, you may use a few real Wladfa features: "Pasiwch i mewn" (come in), "nain/taid", "fo" for he, both "rŵan" and "nawr", and very occasionally Spanish fillers like "bueno" or "este". Don't overdo it, and never invent Patagonian words.
- Be sensitive like a real local: you are Argentine with Welsh heritage (not "British" or "English").`
      : '- You are visiting from Wales; speak clear standard Welsh. You may mention how Patagonian Welsh differs from yours.'
  }${recast}
- Learner text comes from a verbatim transcript: «…» marks words they said in English or Spanish, (?) marks words that were unclear. If they used an English word because they don't know the Welsh, give the Welsh word naturally in your reply.
- If the learner says something unclear, react as a real person would ("Sori? Beth?") and help them rephrase.
- REPAIR: if the learner says they don't understand (Sori?, Eto?, Pardwn?, Dw i ddim yn deall, Beth?, or English "what?"/"sorry?"), say the same thing again more slowly in simpler Welsh: shorter words, repeat the key word, or turn it into a choice question ("Te neu goffi?"). Never switch to English.
- If the learner sums up what you said to check ("Felly…?", "Dych chi’n dweud bod…?"), confirm it ("Ia, yn union!") or gently correct it in Welsh, then carry on.
- ${STUCK_TAG}: a learner turn like ${STUCK_TAG} wants to say: "…" means they tried and couldn't say that in Welsh. Put the simplest natural Welsh for it (at their level) in feedback.better, set feedback.prompt to "Now say it", give a short English note in feedback.why, and make your reply WAIT for them to say it ("Ia? Dwedwch o…" / "Ie? Dwedwch e…") — don't move the conversation on or ask a new question.

${feedback}`
}

/** What the model sees for one learner turn. */
function learnerText(t: TalkTurn): string {
  let s = t.stuck
    ? `${STUCK_TAG} wants to say: "${t.stuck}"`
    : `${t.typed ? 'Learner typed' : 'Learner said'}: ${t.welsh}`
  if (t.uncertain?.length) s += ` [transcript unsure: ${t.uncertain.join(', ')}]`
  if (t.stuck && t.feedback?.better) {
    s += ` [coach gave: "${t.feedback.better}"; their attempt is the next learner turn]`
  } else if (t.feedback?.prompt && !t.feedback.held) {
    const took = !t.retry
      ? 'not tried'
      : t.retry.outcome === 'fixed'
        ? 'yes'
        : t.retry.outcome === 'unclear'
          ? 'unclear audio'
          : 'no'
    s += ` [coach prompted: ${t.feedback.prompt}; self-corrected: ${took}]`
  }
  return s
}

function historyContents(history: TalkTurn[]): Content[] {
  return history.map((t) => ({
    role: t.role === 'me' ? ('user' as const) : ('model' as const),
    parts: [
      {
        text:
          t.role === 'me'
            ? learnerText(t)
            : JSON.stringify({ reply: t.welsh, english: t.english ?? '' }),
      },
    ],
  }))
}

type Part = { text: string } | { inlineData: { mimeType: string; data: string } }
type Content = { role: 'user' | 'model'; parts: Part[] }

/**
 * Talk needs Gemini 3 (thinking levels, audio, JSON schema): any older Ask
 * model, or an alias we can't date, falls back to the default 3 Flash.
 */
function talkModel(model: string | undefined): string {
  const m = clampAskModel(model)
  return m.startsWith('gemini-3') ? m : DEFAULT_ASK_MODEL
}

/** Gemini 3 takes a thinking level; older models ignore this helper. */
function thinkingFor(model: string, level: 'MINIMAL' | 'LOW') {
  if (!model.startsWith('gemini-3')) return undefined
  return { thinkingLevel: level as unknown as ThinkingLevel }
}

async function generate(opts: {
  apiKey: string
  model?: string
  contents: Content[]
  system?: string
  temperature: number
  thinking: 'MINIMAL' | 'LOW'
  schema?: object
}): Promise<string> {
  const { GoogleGenAI } = await import('@google/genai')
  const ai = new GoogleGenAI({ apiKey: opts.apiKey })
  const model = talkModel(opts.model)
  const res = await ai.models.generateContent({
    model,
    contents: opts.contents,
    config: {
      systemInstruction: opts.system,
      temperature: opts.temperature,
      thinkingConfig: thinkingFor(model, opts.thinking),
      ...(opts.schema
        ? { responseMimeType: 'application/json', responseJsonSchema: opts.schema }
        : {}),
    },
  })
  return res.text ?? ''
}

function parseJson<T>(text: string | undefined): T {
  const raw = (text ?? '').trim()
  if (!raw) throw new Error('Empty reply from Gemini')
  return JSON.parse(raw.replace(/^```json\s*|```$/g, '')) as T
}

function wordsOf(text: string): string[] {
  return text.replace(/\(\?\)/g, ' ').match(/\p{L}[\p{L}\p{N}’'-]*|\p{N}+/gu) ?? []
}

export function countWords(text: string): number {
  return wordsOf(text).length
}

/** Filled pauses: ym, ymm, er, erm, hmm. "ym" before an m-word is the preposition. */
const HESITATION = /^(y+m+|e+r+m*|e+m+|h?m{2,}|a+h+)$/i

/**
 * Welsh words actually said: no «English/Spanish», no (?) and no hesitations
 * (ym, y…, e…). Used for fluency, so fillers don't inflate it.
 */
export function welshWords(text: string): string[] {
  const words = wordsOf(
    text.replace(/«[^»]*»/g, ' ').replace(/(^|\s)[ye]+\s*(…|\.{2,})/gi, ' '),
  )
  return words.filter(
    (w, i) =>
      !HESITATION.test(w) ||
      // "ym Mangor", "ym mhob": the preposition, not a filler.
      (w.toLowerCase() === 'ym' && /^m/i.test(words[i + 1] ?? '')),
  )
}

/** Lowercase, no punctuation, apostrophes or circumflexes: compares Welsh loosely. */
function looseCy(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[’'`]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const ENGLISH_STOPWORDS = new Set(['the', 'and', 'you', 'is', 'are', 'what'])
/** Not y, a or es: those are everyday Welsh ("es i" = I went). */
const SPANISH_STOPWORDS = new Set([
  'que', 'el', 'pero', 'con', 'por', 'muy', 'está', 'una', 'los',
])
/** Wider list, for deciding a whole line is Spanish (TTS accent). */
const SPANISH_WORDS = new Set([
  ...SPANISH_STOPWORDS, 'la', 'las', 'del', 'para', 'qué', 'cómo', 'yo', 'usted',
  'sí', 'soy', 'estoy', 'tengo', 'hola', 'bueno', 'gracias', 'es', 'y', 'de', 'no',
])

function stopwordShare(words: string[], set: Set<string>): number {
  if (!words.length) return 0
  return words.filter((w) => set.has(w.toLowerCase())).length / words.length
}

/** A line that is mostly Spanish (so it should be voiced as Spanish). */
export function mostlySpanish(text: string): boolean {
  const words = wordsOf(text)
  return words.length >= 2 && stopwordShare(words, SPANISH_WORDS) >= 0.3
}

/** Rules a reply broke, phrased as the nudge for the rerun. Empty when fine. */
function driftProblems(
  reply: string,
  o: { scenario: Scenario; week: number },
): string[] {
  const words = wordsOf(reply)
  const problems: string[] = []
  const max = maxReplyWords(o.scenario, o.week)
  if (words.length > max) {
    problems.push(
      longAnswers(o.scenario, o.week)
        ? 'Too long: max 5 short sentences.'
        : `Too long: max 2 short sentences (under ${max} words).`,
    )
  }
  // Capital "I" only: lowercase "i" is everyday Welsh.
  const english = words.filter((w) => w === 'I' || ENGLISH_STOPWORDS.has(w.toLowerCase()))
  if (words.length >= 3 && english.length / words.length >= 0.2) {
    problems.push('You slipped into English: reply in Welsh only.')
  }
  if (!SPANISH_SCENARIOS.has(o.scenario.id)) {
    const spanish = words.filter((w) => SPANISH_STOPWORDS.has(w.toLowerCase()))
    if (spanish.length >= 2) problems.push('You slipped into Spanish: reply in Welsh only.')
  }
  if (o.week <= 4 && (reply.match(/\?/g) ?? []).length > 1) {
    problems.push('Ask at most one question.')
  }
  return problems
}

/**
 * The reply gives away the form we're prompting for: it contains the whole
 * corrected sentence, or a two-word stretch around a word the learner didn't say.
 */
function givesAway(reply: string, fb: TalkFeedback, heard: string): boolean {
  if (!fb.prompt || !fb.better || !heard) return false
  const r = ` ${looseCy(reply)} `
  const better = looseCy(fb.better)
  if (r.includes(` ${better} `)) return true
  const said = new Set(looseCy(heard).split(' '))
  const words = better.split(' ')
  return words.some((w, i) => {
    if (said.has(w)) return false
    const pairs = [i > 0 ? `${words[i - 1]} ${w}` : '', words[i + 1] ? `${w} ${words[i + 1]}` : '']
    return pairs.some((p) => p && r.includes(` ${p} `))
  })
}

const NO_FEEDBACK: TalkFeedback = { prompt: '', better: '', why: '' }

/**
 * False-positive guard: drop feedback that changes nothing (once case,
 * punctuation, apostrophes and circumflexes are ignored), prompts with no
 * correction, and prompts on words the transcriber wasn't sure of.
 */
function cleanFeedback(
  fb: Partial<TalkFeedback> | undefined,
  heard: string,
  uncertain: string[],
): TalkFeedback {
  const f = { prompt: fb?.prompt ?? '', better: fb?.better ?? '', why: fb?.why ?? '' }
  if (f.prompt && !f.better.trim()) return NO_FEEDBACK
  if (f.better && heard && looseCy(f.better) === looseCy(heard)) return NO_FEEDBACK
  if (f.prompt && heard && uncertain.length) {
    const kept = new Set(looseCy(f.better).split(' '))
    const unsure = new Set(uncertain.map(looseCy))
    if (looseCy(heard).split(' ').some((w) => unsure.has(w) && !kept.has(w))) {
      return NO_FEEDBACK
    }
  }
  return f
}

function normalizeReply(
  r: Partial<TalkReply>,
  heard: string,
  uncertain: string[],
): TalkReply {
  return {
    heard,
    uncertain,
    reply: r.reply ?? '',
    english: r.english ?? '',
    feedback: cleanFeedback(r.feedback, heard, uncertain),
    hints: r.hints ?? [],
  }
}

interface PartnerOpts {
  apiKey: string
  model?: string
  scenario: Scenario
  week: number
  learner: string
  /** From talkTargets(). */
  targets: string
  /** Measured conversation: no corrections or recasts. */
  checkpoint?: boolean
}

/**
 * One partner reply, rerun once if it drifts into English, rambles past the
 * week's cap, or says the corrected form we're prompting the learner to find.
 */
async function partnerReply(
  o: PartnerOpts,
  contents: Content[],
  temperature: number,
  heard: string,
  uncertain: string[] = [],
): Promise<TalkReply> {
  const run = async (extra?: string) => {
    const last = contents[contents.length - 1]!
    const withExtra = extra
      ? [...contents.slice(0, -1), { ...last, parts: [...last.parts, { text: extra }] }]
      : contents
    const text = await generate({
      apiKey: o.apiKey,
      model: o.model,
      contents: withExtra,
      system: partnerSystem(o),
      temperature,
      thinking: 'LOW',
      schema: REPLY_SCHEMA,
    })
    return normalizeReply(parseJson<Partial<TalkReply>>(text), heard, uncertain)
  }
  // A broken JSON reply gets one more try rather than failing the turn.
  const first = await run().catch(() =>
    run('(Return only valid JSON matching the schema.)'),
  )
  const nudges = driftProblems(first.reply, o)
  if (givesAway(first.reply, first.feedback, heard)) {
    nudges.push('Don’t say the corrected form in your reply.')
  }
  if (!nudges.length) return first
  try {
    return await run(`(Your last draft broke a rule. ${nudges.join(' ')})`)
  } catch {
    return first
  }
}

/** Partner opens the conversation. */
export async function talkOpen(opts: PartnerOpts): Promise<TalkReply> {
  return partnerReply(
    opts,
    [
      {
        role: 'user',
        parts: [
          {
            text: `(The learner has just walked up. Open the conversation in character with a greeting and one easy question. Feedback fields empty strings.)\n\nOpening line idea: ${opts.scenario.opener}`,
          },
        ],
      },
    ],
    0.7,
    '',
  )
}

/**
 * Verbatim transcript of a learner recording: mistakes and English kept.
 * `context` (what they were answering, or trying to say) only helps hearing.
 */
export async function talkTranscribe(opts: {
  apiKey: string
  model?: string
  audio: Blob
  context?: string
}): Promise<{ transcript: string; uncertain: string[] }> {
  const text = await generate({
    apiKey: opts.apiKey,
    model: opts.model,
    temperature: 0,
    thinking: 'MINIMAL',
    schema: TRANSCRIBE_SCHEMA,
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: { mimeType: 'audio/wav', data: await blobToBase64(opts.audio) },
          },
          {
            text: `Transcribe this recording of a beginner learner speaking Welsh, verbatim.${opts.context ? `\nContext (only to help you hear unclear words — never change what they said to match it): ${opts.context}` : ''}
- Write exactly what they said. Do NOT fix mutations, word order or grammar, and do not finish sentences they didn't finish.
- Write any English or Spanish words as spoken, inside «» (e.g. Dw i'n «engineer»).
- Mark words you can't make out with (?).
- Keep hesitations like "ym" or "y…" only if clearly spoken.
- "uncertain": the words where you couldn't clearly hear the mutation, the ending or the ’n/yn link (e.g. whether it was "fynd" or "mynd", "Dw i’n" or "Dw i").`,
          },
        ],
      },
    ],
  })
  const r = parseJson<{ transcript?: string; uncertain?: string[] }>(text)
  return {
    transcript: (r.transcript ?? '').trim().replace(/^"|"$/g, '') || '(?)',
    uncertain: (r.uncertain ?? []).filter(Boolean),
  }
}

/** Partner's last line, for transcription context. */
function lastPartnerLine(history: TalkTurn[]): string | undefined {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i]!.role === 'them') return history[i]!.welsh
  }
  return undefined
}

/**
 * Learner speaks (audio) or types, or says they're stuck; partner replies with
 * feedback. Audio is transcribed verbatim first, then answered as text.
 */
export async function talkTurn(
  opts: PartnerOpts & {
    history: TalkTurn[]
    text?: string
    audio?: Blob
    /** "I can't say this": what they wanted to say. */
    stuck?: string
  },
): Promise<TalkReply> {
  const before = lastPartnerLine(opts.history)
  const heard = opts.audio
    ? await talkTranscribe({
        apiKey: opts.apiKey,
        model: opts.model,
        audio: opts.audio,
        context: before ? `they were answering: "${before}"` : undefined,
      })
    : { transcript: opts.text ?? '', uncertain: [] }
  const turn: TalkTurn = {
    role: 'me',
    welsh: heard.transcript,
    typed: !opts.audio,
    uncertain: heard.uncertain,
    stuck: opts.stuck,
  }
  const r = await partnerReply(
    opts,
    [...historyContents(opts.history), { role: 'user', parts: [{ text: learnerText(turn) }] }],
    0.6,
    heard.transcript,
    heard.uncertain,
  )
  if (!opts.stuck && r.feedback.prompt && promptTooSoon(opts.history, opts.week)) {
    r.feedback = { ...r.feedback, held: true }
  }
  return r
}

/**
 * Pacing for prompts: none while the previous prompt is still open (not
 * retried), and in weeks 1–2 at most one every two learner turns.
 * "I can't say this" turns don't count.
 */
function promptTooSoon(history: TalkTurn[], week: number): boolean {
  const prev = [...history].reverse().find((t) => t.role === 'me' && !t.stuck)
  const fb = prev?.feedback
  if (!fb?.prompt || fb.held) return false
  return !prev?.retry || week <= 2
}

/** Uncertain-word check: does this text mention a word the transcriber doubted? */
export function mentionsUncertain(text: string, uncertain: string[]): boolean {
  if (!uncertain.length) return false
  const words = new Set(looseCy(text).split(' '))
  return uncertain.some((u) => looseCy(u).split(' ').some((w) => w && words.has(w)))
}

/** Feedback only, e.g. after the learner fixes a misheard transcript. */
export async function talkFeedback(
  opts: PartnerOpts & { history: TalkTurn[]; text: string; typed?: boolean },
): Promise<TalkFeedback> {
  if (opts.checkpoint) return NO_FEEDBACK
  const turn: TalkTurn = { role: 'me', welsh: opts.text, typed: opts.typed }
  const text = await generate({
    apiKey: opts.apiKey,
    model: opts.model,
    system: partnerSystem(opts),
    temperature: 0.2,
    thinking: 'LOW',
    schema: FEEDBACK_SCHEMA,
    contents: [
      ...historyContents(opts.history),
      {
        role: 'user',
        parts: [
          {
            text: `${learnerText(turn)}\n(The learner corrected the transcript of this turn. Return only the feedback for it, following the FEEDBACK rules.)`,
          },
        ],
      },
    ],
  })
  return cleanFeedback(parseJson<Partial<TalkFeedback>>(text), opts.text, [])
}

/** Second try after a feedback prompt: did they fix the targeted form? */
export async function talkRetry(opts: {
  apiKey: string
  model?: string
  original: string
  prompt: string
  /**
   * The coach's corrected sentence. Only used in code, to find the targeted
   * words — never shown to the transcriber, so it can't bias what it hears.
   */
  target?: string
  text?: string
  audio?: Blob
}): Promise<TalkRetry> {
  const { transcript: heard, uncertain } = opts.audio
    ? await talkTranscribe({
        apiKey: opts.apiKey,
        model: opts.model,
        audio: opts.audio,
        context: `they are repeating: "${opts.original}"`,
      })
    : { transcript: opts.text ?? '', uncertain: [] as string[] }
  const text = await generate({
    apiKey: opts.apiKey,
    model: opts.model,
    temperature: 0.2,
    thinking: 'LOW',
    schema: RETRY_SCHEMA,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `A beginner Welsh learner said: "${opts.original}"
Their coach nudged them: "${opts.prompt}"
They tried again (verbatim transcript; «» = English/Spanish words, (?) = unclear): "${heard}"

Did the new attempt fix the error the nudge pointed at?
- fixed: true if that form is now right. Ignore other small slips, spelling, apostrophes and circumflexes, and never count valid regional variants (${VARIANTS}) as errors.
- heard: the new attempt exactly as given above.
- better: if not fixed, their sentence with ONLY that error fixed (keep their words and order); if fixed, empty string.
- why: one short, encouraging English line.`,
          },
        ],
      },
    ],
  })
  const r = parseJson<Partial<TalkRetry>>(text)
  const unclear = targetUnclear(opts.original, opts.target ?? '', uncertain)
  const fixed = Boolean(r.fixed) && !unclear
  return {
    outcome: unclear ? 'unclear' : fixed ? 'fixed' : 'not-fixed',
    fixed,
    heard,
    uncertain,
    better: unclear ? '' : (r.better ?? ''),
    why: r.why ?? '',
  }
}

/** The transcriber doubted one of the words the correction is about. */
function targetUnclear(original: string, target: string, uncertain: string[]): boolean {
  if (!uncertain.length || !target) return false
  const said = looseCy(original).split(' ')
  const fixed = looseCy(target).split(' ')
  const changed = new Set([
    ...fixed.filter((w) => !said.includes(w)),
    ...said.filter((w) => !fixed.includes(w)),
  ])
  return uncertain.some((u) => looseCy(u).split(' ').some((w) => changed.has(w)))
}

/** Client-side measures for the report (fluency isn't visible in a transcript). */
export function talkMetrics(
  turns: TalkTurn[],
  ui: {
    hintsOpened: number
    hintsFull: number
    /** Partner turn indices whose text was opened before replying; null = text always shown. */
    revealed: Set<number> | null
  },
): TalkMetrics {
  const mine = turns.filter((t) => t.role === 'me' && !t.stuck)
  const spoken = mine.filter((t) => !t.typed)
  // Hand-edited transcripts don't count towards fluency numbers (unless every turn was edited).
  const unedited = spoken.filter((t) => !t.edited)
  const measured = unedited.length ? unedited : spoken
  const spokenWelsh = measured.reduce((n, t) => n + welshWords(t.welsh).length, 0)
  const allWords = mine.reduce((n, t) => n + countWords(t.welsh), 0)
  const welsh = mine.reduce((n, t) => n + welshWords(t.welsh).length, 0)
  const seconds = measured.reduce((n, t) => n + (t.seconds ?? 0), 0)
  const answered = turns
    .map((t, i) => (t.role === 'them' && turns[i + 1]?.role === 'me' ? i : -1))
    .filter((i) => i >= 0)
  const round1 = (n: number) => Math.round(n * 10) / 10
  return {
    learnerTurns: mine.length,
    spokenTurns: spoken.length,
    typedTurns: mine.length - spoken.length,
    wordsPerTurn: measured.length ? round1(spokenWelsh / measured.length) : 0,
    speechRate: seconds > 0 ? Math.round((spokenWelsh / seconds) * 60) : 0,
    welshShare: allWords ? Math.min(1, Math.round((welsh / allWords) * 100) / 100) : 0,
    secondsPerTurn: measured.length ? round1(seconds / measured.length) : 0,
    hintsOpened: ui.hintsOpened,
    hintsFull: ui.hintsFull,
    cantSay: turns.filter((t) => t.stuck).length,
    selfCorrections: turns.filter((t) => t.retry?.fixed).length,
    partnerTurnsAnswered: answered.length,
    understoodWithoutText: ui.revealed
      ? answered.filter((i) => !ui.revealed!.has(i)).length
      : null,
    textReveals: ui.revealed?.size ?? 0,
  }
}

/**
 * Fluency 1–5 from measured numbers, anchored to the week-8 target of about
 * 6+ Welsh words per spoken turn, 50+ Welsh words per recorded minute, and
 * little help. Half the score is words/turn (÷6), half speech rate (÷50),
 * each capped at the target: 1 + 4 × that. Then minus up to 1.5 for help:
 * 2 × help per learner turn, where a hint starter counts ½, a full hint 1 and
 * "can't say" 1. Typed and hand-edited turns don't count; no spoken turns
 * scores 1. One decimal.
 */
export function fluencyScore(m: TalkMetrics): number {
  if (!m.spokenTurns) return 1
  const words = Math.min(1, m.wordsPerTurn / 6)
  const rate = Math.min(1, m.speechRate / 50)
  const helped = 0.5 * m.hintsOpened + 0.5 * m.hintsFull + m.cantSay
  const help = helped / Math.max(1, m.learnerTurns + m.cantSay)
  const score = 1 + 4 * (0.5 * words + 0.5 * rate) - Math.min(1.5, 2 * help)
  return Math.round(Math.min(5, Math.max(1, score)) * 10) / 10
}

function metricsText(m: TalkMetrics): string {
  return [
    `Learner turns: ${m.learnerTurns} (${m.spokenTurns} spoken, ${m.typedTurns} typed)`,
    `Mean Welsh words per spoken turn: ${m.wordsPerTurn}`,
    `Welsh words per recorded minute: ${m.speechRate}`,
    `Mean recording seconds per spoken turn: ${m.secondsPerTurn}`,
    `Welsh share of learner words: ${Math.round(m.welshShare * 100)}%`,
    `Hint lists opened: ${m.hintsOpened} (revealed in full: ${m.hintsFull})`,
    `"I can't say this" used: ${m.cantSay}`,
    `Self-corrections after a coach prompt: ${m.selfCorrections}`,
    m.understoodWithoutText == null
      ? `Partner turns answered: ${m.partnerTurnsAnswered} (text was visible)`
      : `Partner turns answered: ${m.partnerTurnsAnswered}, of which understood by ear without opening the text: ${m.understoodWithoutText}`,
    `Fluency (computed from the numbers above): ${fluencyScore(m)}/5`,
  ].join('\n')
}

function transcriptLine(t: TalkTurn): string {
  if (t.role === 'them') return `PARTNER: ${t.welsh}`
  if (t.stuck) return `LEARNER (couldn't say it, asked for help): "${t.stuck}"`
  const how = t.typed ? 'typed' : `spoken${t.seconds ? `, ${Math.round(t.seconds)} s` : ''}`
  let s = `LEARNER (${how}): ${t.welsh}`
  if (t.uncertain?.length) s += ` [transcript unsure: ${t.uncertain.join(', ')}]`
  if (t.edited) s += ' (learner edited the transcript)'
  if (t.retry) {
    const verdict =
      t.retry.outcome === 'fixed' ? 'fixed' : t.retry.outcome === 'unclear' ? 'audio unclear' : 'not fixed'
    s += `\n  (second try after a coach prompt: ${t.retry.heard} → ${verdict})`
  }
  return s
}

const RUBRIC = `You are an honest examiner: do not inflate. Score each criterion 1–5 against the END-OF-PLAN target (a two-month learner about to visit Patagonia), not against what is good for this week. Anchors: 5 = could comfortably hold this conversation with a patient native speaker in Patagonia; 3 = gets through with frequent pauses and help; 1 = single words, mostly stuck. Fluency is already computed from the metrics; don't score it, but you may mention it.

RANGE
5: varied patterns (present, past, likes, plans, questions) and topic words beyond the planned frames.
4: the planned frames plus some of their own variations.
3: a handful of memorised frames, reused.
2: one or two fixed phrases.
1: single words.
ACCURACY (never count regional variants: ${VARIANTS}; ignore spelling in typed turns; don't judge accuracy on turns marked "(learner edited the transcript)"; never count a word marked [transcript unsure])
5: errors rare and never block meaning.
4: some errors in mutations or endings; meaning always clear.
3: frequent errors; meaning usually clear.
2: errors often make meaning hard to follow.
1: meaning mostly lost.
INTERACTION (asking back, following up, repairing in Welsh, understanding by ear)
5: asks questions back, follows up on answers, repairs misunderstandings in Welsh, understands the partner by ear.
4: asks back sometimes; asks for repeats in Welsh when needed.
3: answers but rarely asks back; needs repeats or the text; some English.
2: struggles to respond without help or English.
1: can't respond without English or help.
TASK (taskDone)
2: achieved the goal of the scenario. 1: partly. 0: not achieved.

CALIBRATION
Example A (a week-1-like learner):
PARTNER: Prynhawn da! Croeso! Dych chi eisiau paned?
LEARNER (spoken, 4 s): Ym… ie. Te.
PARTNER: Te, iawn. O ble dych chi’n dod?
LEARNER (spoken, 6 s): «India». Dw i… India.
→ range 1, accuracy 2, interaction 1, taskDone 1.
Example B (a week-8-like learner):
PARTNER: Sut dysgoch chi Gymraeg, ’te?
LEARNER (spoken, 9 s): Dw i wedi bod yn dysgu ers deufis, bob dydd. Dw i eisiau siarad efo pobl yn y Wladfa.
PARTNER: Da iawn! A be dach chi’n feddwl o’r Gaiman?
LEARNER (spoken, 8 s): Mae’n hyfryd. Mae’r te yn flasus iawn! Ers pryd dych chi’n byw yma?
→ range 4, accuracy 4, interaction 5, taskDone 2.`

/** End-of-conversation coaching report (and checkpoint scores). */
export async function talkReport(opts: {
  apiKey: string
  model?: string
  scenario: Scenario
  week: number
  history: TalkTurn[]
  metrics: TalkMetrics
  checkpoint?: boolean
}): Promise<TalkReport> {
  const transcript = opts.history.map(transcriptLine).join('\n')
  const text = await generate({
    apiKey: opts.apiKey,
    model: opts.model,
    temperature: 0,
    thinking: 'LOW',
    schema: REPORT_SCHEMA,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `You are a Welsh speaking examiner and coach: honest, specific and kind. Review this ${opts.checkpoint ? 'checkpoint (no hints shown, no corrections during the talk)' : 'practice'} conversation (scenario: ${opts.scenario.title}; the learner's goal: ${opts.scenario.goal}). The learner is in week ${opts.week} of an 8-week plan to chat with Welsh speakers in Patagonia. Learner lines are verbatim transcripts: «…» = said in English/Spanish, (?) = unclear.

TRANSCRIPT
${transcript}

METRICS (measured in the app)
${metricsText(opts.metrics)}

${RUBRIC}

Return:
- summary: 2–3 sentences in English, encouraging but honest; mention one metric.
- wins: up to 3 specific things they did well.
- fixes: up to 4 of the most useful corrections (said → better → why), prioritising patterns they'll reuse. "better" is their sentence with only that error fixed. Never "fix" regional variants or style, and never list a fix on a word marked [transcript unsure].
- phrases: up to 5 Welsh phrases that would have helped them in this conversation.
- scores: integers 1–5 for range, accuracy and interaction, using the rubric.
- taskDone: 0, 1 or 2.`,
          },
        ],
      },
    ],
  })
  const r = parseJson<
    Omit<TalkReport, 'metrics' | 'scores' | 'uncertain'> & {
      scores?: Partial<TalkReport['scores']>
    }
  >(text)
  const clamp = (n: unknown) => Math.min(5, Math.max(1, Math.round(Number(n) || 1)))
  const s = r.scores ?? {}
  const fluency = fluencyScore(opts.metrics)
  const range = clamp(s.range)
  const accuracy = clamp(s.accuracy)
  const interaction = clamp(s.interaction)
  return {
    summary: r.summary ?? '',
    wins: r.wins ?? [],
    fixes: r.fixes ?? [],
    phrases: r.phrases ?? [],
    scores: {
      fluency,
      range,
      accuracy,
      interaction,
      overall: Math.round(((fluency + range + accuracy + interaction) / 4) * 10) / 10,
    },
    taskDone: Math.min(2, Math.max(0, Math.round(Number(r.taskDone) || 0))),
    metrics: opts.metrics,
    uncertain: [...new Set(opts.history.flatMap((t) => t.uncertain ?? []))],
  }
}

export interface RetellTake {
  heard: string
  seconds: number
  /** Welsh words per minute of trimmed recording. */
  wpm: number
}

export interface RetellFeedback {
  takes: RetellTake[]
  /** What changed between the first and last round. */
  change: string
  tips: string[]
  better: string
}

/** Feedback on the 4/3/2 retell: round 1 and the final round, side by side. */
export async function retellFeedback(opts: {
  apiKey: string
  model?: string
  topic: string
  week: number
  /** Round 1 and the final round (or just one take). */
  takes: { audio: Blob; seconds: number; round: number }[]
}): Promise<RetellFeedback> {
  const parts: Part[] = []
  for (const t of opts.takes) {
    parts.push({ text: `Take from round ${t.round} (${Math.round(t.seconds)} s):` })
    parts.push({ inlineData: { mimeType: 'audio/wav', data: await blobToBase64(t.audio) } })
  }
  const two = opts.takes.length > 1
  parts.push({
    text: `A Welsh learner in week ${opts.week} of an 8-week plan just talked about "${opts.topic}"${two ? ', first in a longer round and then again with less time' : ''}.
- heard: one verbatim transcript per take, in order. Do NOT fix mutations, word order or grammar; write English/Spanish words inside «»; mark unclear words with (?).
- change: ${two ? 'one short English tip on what changed between the first and last take (more fluent? dropped content? new mistakes?) and what to keep doing.' : 'empty string.'}
- tips: up to 3 short English tips (fluency first, then the single most useful grammar fix). Never correct valid regional variants (${VARIANTS}) or style.
- better: a corrected, natural version of what they tried to say in the last take, in simple Welsh, keeping their content.`,
  })
  const text = await generate({
    apiKey: opts.apiKey,
    model: opts.model,
    temperature: 0.3,
    thinking: 'LOW',
    contents: [{ role: 'user', parts }],
    schema: {
      type: 'object',
      properties: {
        heard: { type: 'array', items: { type: 'string' } },
        change: { type: 'string' },
        tips: { type: 'array', items: { type: 'string' } },
        better: { type: 'string' },
      },
      required: ['heard', 'change', 'tips', 'better'],
    },
  })
  const r = parseJson<{ heard?: string[]; change?: string; tips?: string[]; better?: string }>(
    text,
  )
  return {
    takes: opts.takes.map((t, i) => {
      const heard = r.heard?.[i] ?? ''
      return {
        heard,
        seconds: t.seconds,
        // Welsh words only: no «English», no ym/y… fillers.
        wpm: t.seconds > 0 ? Math.round((welshWords(heard).length / t.seconds) * 60) : 0,
      }
    }),
    change: r.change ?? '',
    tips: r.tips ?? [],
    better: r.better ?? '',
  }
}
