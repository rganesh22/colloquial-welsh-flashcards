import { cardsForLesson } from '../deck'
import type { BlockId } from '../../lib/trip'

/**
 * The 8-week Patagonia plan. 48 sessions (6 a week) over ~60 calendar days,
 * so roughly one day a week is slack for work days. Sessions are numbered
 * study days: missing a day pushes content back, it never stacks up.
 *
 * Shape of a session (≈60 min, Nation's four strands tilted to speaking):
 *   reviews + new phrases → listen → shadow → plan + AI conversation → 4/3/2 retell
 * Every 6th session is a checkpoint: no new phrases, a scored conversation.
 */

export const SESSIONS_PER_WEEK = 6
export const WEEKS = 8
export const TOTAL_SESSIONS = SESSIONS_PER_WEEK * WEEKS

export interface WeekPlan {
  week: number
  titleCy: string
  title: string
  /** What you can do by the end of the week. */
  canDo: string[]
  /** Phrase lessons (book "patagonia") introduced this week, in order. */
  phraseLessons: string[]
  /** Colloquial Welsh chapter guide per regular session (1–5). */
  patterns: (string | null)[]
  /** Model dialogue per regular session (1–5). */
  dialogues: string[]
  /** AI partner per regular session (1–5); repeats are deliberate. */
  scenarios: string[]
  /** 4/3/2 retell topic for the week. */
  retell: { topic: string; prompts: string[] }
  /** One-line focus for the week. */
  focus: string
}

export const WEEK_PLANS: WeekPlan[] = [
  {
    week: 1,
    titleCy: 'Helo, fi ydy…',
    title: 'Sounds, greetings and you',
    focus:
      'Get the Welsh sounds into your mouth and nail a 30-second introduction you can say on autopilot.',
    canDo: [
      'Greet people at any time of day and say goodbye',
      'Say your name, that you’re from India, what you do and that you’re learning Welsh',
      'Ask someone their name and how they are',
    ],
    phraseLessons: ['p1', 'p2'],
    patterns: ['alphabet', '1a', '1a', '1b', '1b'],
    dialogues: ['d1', 'd1', 'd2', 'd2', 'd2'],
    scenarios: ['te-gaiman', 'te-gaiman', 'bws-trelew', 'te-gaiman', 'bws-trelew'],
    retell: {
      topic: 'Introduce yourself',
      prompts: ['Your name', 'Where you’re from', 'Where you live', 'Your work', 'Learning Welsh'],
    },
  },
  {
    week: 2,
    titleCy: 'Sori, eto?',
    title: 'Keeping a conversation alive',
    focus:
      'Learn the repair phrases that let you survive any conversation, plus family and languages — the first things people ask.',
    canDo: [
      'Ask people to repeat, slow down or explain a word — in Welsh',
      'Talk about your family and the languages you speak',
      'Ask “and you?” questions to keep things going',
    ],
    phraseLessons: ['p3', 'p4'],
    patterns: ['2a', '2a', '2b', '2b', '2b'],
    dialogues: ['d3', 'd3', 'd4', 'd4', 'd4'],
    scenarios: ['bws-trelew', 'gwesty', 'bws-trelew', 'gwesty', 'sgwrs-rydd'],
    retell: {
      topic: 'Your family and your languages',
      prompts: ['Who is in your family', 'Where they live', 'Languages you speak', 'Why Welsh'],
    },
  },
  {
    week: 3,
    titleCy: 'Paned a theisen',
    title: 'Likes, food and the tea house',
    focus:
      'Say what you like and don’t like, order in a tea house, and handle numbers and prices.',
    canDo: [
      'Say what you like doing and ask others',
      'Order tea and cake and ask the price',
      'Use numbers 1–100 for prices, ages and times',
    ],
    phraseLessons: ['p5', 'p6'],
    patterns: ['3', '3', '6', '6', '4'],
    dialogues: ['d5', 'd5', 'd6', 'd6', 'd6'],
    scenarios: ['sgwrs-rydd', 'te-gaiman', 'te-gaiman', 'sgwrs-rydd', 'te-gaiman'],
    retell: {
      topic: 'What you like doing',
      prompts: ['Free time', 'Food you love', 'What you don’t like', 'Indian food vs Welsh tea'],
    },
  },
  {
    week: 4,
    titleCy: 'Ble mae…?',
    title: 'Getting around, weather and plans',
    focus:
      'Find your way around Chubut, talk about the weather like a local, and say what you’re going to do.',
    canDo: [
      'Ask where places are and understand simple directions',
      'Talk about the weather (a guaranteed conversation starter)',
      'Say what you’re going to do tomorrow and this week',
    ],
    phraseLessons: ['p7', 'p8'],
    patterns: ['5', '5', '7', '8', '8'],
    dialogues: ['d7', 'd7', 'd8', 'd8', 'd8'],
    scenarios: ['gwesty', 'gwesty', 'fferm-trevelin', 'gwesty', 'fferm-trevelin'],
    retell: {
      topic: 'Your plans for the trip',
      prompts: ['Where you’re going', 'When', 'Who you want to meet', 'What you want to see'],
    },
  },
  {
    week: 5,
    titleCy: 'Beth wnest ti?',
    title: 'Telling what happened',
    focus:
      'The past tense unlocks stories: what you did yesterday, how you got here, why you started Welsh.',
    canDo: [
      'Say what you did yesterday or last weekend',
      'Tell the story of your journey to Patagonia',
      'Ask others what they did',
    ],
    phraseLessons: ['p9'],
    patterns: ['9', '9', '9', '9', '9'],
    dialogues: ['d9', 'd9', 'd10', 'd10', 'd10'],
    scenarios: ['sgwrs-rydd', 'bws-trelew', 'sgwrs-rydd', 'fferm-trevelin', 'sgwrs-rydd'],
    retell: {
      topic: 'What you did last weekend',
      prompts: ['Where you went', 'Who with', 'What you ate', 'How it was'],
    },
  },
  {
    week: 6,
    titleCy: 'Dw i’n meddwl bod…',
    title: 'Opinions and natural flow',
    focus:
      'Give opinions, react like a native speaker and use the little words (wel, ’te, chwarae teg) that make you sound fluent.',
    canDo: [
      'Say what you think and ask what others think',
      'React naturally: really?, of course, fair play',
      'Hold a 5-minute chat that doesn’t feel like a quiz',
    ],
    phraseLessons: ['p10'],
    patterns: ['10', '10', '11', '11', '11'],
    dialogues: ['d11', 'd11', 'd12', 'd12', 'd12'],
    scenarios: ['sgwrs-rydd', 'capel', 'sgwrs-rydd', 'capel', 'ysgol-athrawes'],
    retell: {
      topic: 'Why you’re learning Welsh — and what you think of it',
      prompts: ['How you started', 'What’s hard', 'What you love', 'What you hope to find in Patagonia'],
    },
  },
  {
    week: 7,
    titleCy: 'Y Wladfa',
    title: 'Patagonia, history and your interview',
    focus:
      'Talk about Y Wladfa itself — the Mimosa, the chapels, the eisteddfod — and rehearse your on-camera interview questions.',
    canDo: [
      'Ask locals about their family history and the settlers',
      'Run a short interview about the state of Welsh',
      'Ask permission to film, politely',
    ],
    phraseLessons: ['p11', 'p12', 'p13'],
    patterns: [null, null, null, null, null],
    dialogues: ['d13', 'd13', 'd14', 'd14', 'd14'],
    scenarios: ['cyfweliad-iaith', 'fferm-trevelin', 'cyfweliad-iaith', 'capel', 'cyfweliad-iaith'],
    retell: {
      topic: 'What you know about Y Wladfa',
      prompts: ['1865 and the Mimosa', 'Where the Welsh live now', 'Chapels and tea houses', 'Why you’re visiting'],
    },
  },
  {
    week: 8,
    titleCy: 'Barod!',
    title: 'Rehearsal week',
    focus:
      'No new phrases. Lock in what you have with mock conversations, your interview and your story — so it all comes out under pressure.',
    canDo: [
      'Hold 5–10 minute conversations with strangers on familiar topics',
      'Recover when you don’t understand, without switching to English',
      'Tell your story and run your interview with confidence',
    ],
    phraseLessons: [],
    patterns: [null, null, null, null, null],
    dialogues: ['d14', 'd2', 'd10', 'd12', 'd13'],
    scenarios: ['cyfweliad-iaith', 'fferm-trevelin', 'sgwrs-rydd', 'te-gaiman', 'cyfweliad-iaith'],
    retell: {
      topic: 'Your whole story',
      prompts: ['Who you are', 'Why Welsh', 'Your two months', 'Why Patagonia', 'What’s next'],
    },
  },
]

export interface PlanBlock {
  id: BlockId
  minutes: number
  /** Core blocks make a session count; the rest can go on a short day. */
  core: boolean
}

export interface PlanSession {
  n: number
  week: number
  /** 1–6 within the week; 6 is the checkpoint. */
  day: number
  checkpoint: boolean
  phraseIds: string[]
  pattern: string | null
  dialogue: string | null
  scenario: string
  retell: WeekPlan['retell']
  blocks: PlanBlock[]
}

function splitEvenly<T>(items: T[], parts: number): T[][] {
  const out: T[][] = Array.from({ length: parts }, () => [])
  items.forEach((item, i) => {
    out[Math.floor((i * parts) / items.length)]!.push(item)
  })
  return out
}

function buildSessions(): PlanSession[] {
  const sessions: PlanSession[] = []
  for (const wk of WEEK_PLANS) {
    const ids = wk.phraseLessons.flatMap((lessonId) =>
      [...cardsForLesson('patagonia', lessonId)]
        .sort((a, b) => a.number - b.number)
        .map((c) => c.id),
    )
    const slices = splitEvenly(ids, SESSIONS_PER_WEEK - 1)
    for (let day = 1; day <= SESSIONS_PER_WEEK; day++) {
      const n = (wk.week - 1) * SESSIONS_PER_WEEK + day
      const checkpoint = day === SESSIONS_PER_WEEK
      const phraseIds = checkpoint ? [] : (slices[day - 1] ?? [])
      const blocks: PlanBlock[] = checkpoint
        ? [
            { id: 'review', minutes: 15, core: true },
            { id: 'retell', minutes: 10, core: false },
            { id: 'checkpoint', minutes: 15, core: true },
            { id: 'listen', minutes: 10, core: false },
          ]
        : [
            { id: 'review', minutes: 12, core: true },
            ...(phraseIds.length
              ? [{ id: 'phrases' as const, minutes: 8, core: true }]
              : []),
            { id: 'listen', minutes: 8, core: false },
            { id: 'shadow', minutes: 7, core: false },
            { id: 'speak', minutes: 15, core: true },
            { id: 'retell', minutes: 6, core: false },
            ...(wk.patterns[day - 1]
              ? [{ id: 'pattern' as const, minutes: 8, core: false }]
              : []),
          ]
      sessions.push({
        n,
        week: wk.week,
        day,
        checkpoint,
        phraseIds,
        pattern: checkpoint ? null : (wk.patterns[day - 1] ?? null),
        dialogue: checkpoint ? null : (wk.dialogues[day - 1] ?? null),
        scenario: checkpoint ? 'prawf' : wk.scenarios[day - 1]!,
        retell: wk.retell,
        blocks,
      })
    }
  }
  return sessions
}

export const PLAN_SESSIONS: PlanSession[] = buildSessions()

export function getSession(n: number): PlanSession | undefined {
  return PLAN_SESSIONS[n - 1]
}

export function weekPlan(week: number): WeekPlan {
  return WEEK_PLANS[week - 1] ?? WEEK_PLANS[0]!
}

export const BLOCK_META: Record<
  BlockId,
  { title: string; titleCy: string; why: string }
> = {
  review: {
    titleCy: 'Adolygu',
    title: 'Reviews',
    why: 'Retrieval practice with spacing is the most reliable memory effect in the research. Reviews come first so the backlog never grows.',
  },
  phrases: {
    titleCy: 'Ymadroddion newydd',
    title: 'New phrases',
    why: 'Whole chunks (“Dw i’n dod o…”) get you speaking faster than single words. Say each one out loud before you flip.',
  },
  listen: {
    titleCy: 'Gwrando',
    title: 'Listen',
    why: 'Hear today’s language in a real exchange. Listen once without the text, then once with it.',
  },
  shadow: {
    titleCy: 'Cysgodi',
    title: 'Shadow',
    why: 'Repeat right after the speaker, copying the rhythm. Shadowing mainly helps fluency and intonation.',
  },
  speak: {
    titleCy: 'Siarad',
    title: 'Conversation',
    why: 'Talking, getting stuck and being corrected is where speaking ability grows. Take one minute to plan first; it measurably helps fluency.',
  },
  retell: {
    titleCy: 'Adrodd 4/3/2',
    title: 'Retell (2 · 1½ · 1 min)',
    why: 'Tell the same short story three times with less time each round. Repetition under time pressure builds fluency that carries over to new topics.',
  },
  pattern: {
    titleCy: 'Patrwm',
    title: 'Grammar pattern',
    why: 'A short guided look at the pattern behind today’s phrases, from Colloquial Welsh.',
  },
  checkpoint: {
    titleCy: 'Sgwrs brawf',
    title: 'Checkpoint conversation',
    why: 'A scored 5–8 minute chat so you can see your progress week by week. Film it: week 1 vs week 8 makes great footage.',
  },
}
