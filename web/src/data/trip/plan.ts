import { cardsForLesson } from '../deck'
import {
  currentSession,
  daysBetween,
  isSessionDone,
  type BlockId,
  type TripState,
} from '../../lib/trip'
import { localCalendarDay } from '../../lib/srs'
import { CLIP_SCHEDULE } from './listening'

/**
 * The 8-week Patagonia plan. 48 sessions (6 a week) over ~60 calendar days,
 * so roughly one day a week is slack for work days. Sessions are numbered
 * study days: missing a day pushes content back, it never stacks up.
 *
 * Shape of a session (≈60 min, Nation's four strands tilted to speaking):
 *   reviews + new phrases → listen → shadow → plan + AI conversation → 4/3/2 retell
 *   (+ a 5-minute run-through of your story on some days)
 * Every 6th session is a checkpoint: no new phrases, a scored conversation,
 * and from week 3 a conversation with a real person.
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
  /** Grammar units mixed in the unit test (joined with +), or 'mix'. */
  review: string
  /** What each of lessons 1–5 is for, as a can-do. */
  lessons: string[]
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
    titleCy: 'Helo, … dw i',
    title: 'Sounds, greetings and you',
    focus:
      'Get the Welsh sounds into your mouth and nail a 30-second introduction you can say on autopilot.',
    canDo: [
      'Greet people at any time of day and say goodbye',
      'Say your name, that you’re from India, what you do and that you’re learning Welsh',
      'Ask someone their name and how they are',
    ],
    phraseLessons: ['p1', 'p2'],
    patterns: ['alphabet', '1a', '1b', '2a', '2a'],
    /** Unit test on the checkpoint day: these units, mixed. */
    review: '1a+1b+2a',
    lessons: [
      'Greet people at any time of day and get your mouth round Welsh sounds',
      'Say your name and ask someone theirs, and introduce family with “fy”',
      'Ask what things are and who people are (Beth ydy hwn? Pwy ydy hi?), and say your job',
      'Say where you live and work with the present tense (dw i, dych chi, mae)',
      'Introduce yourself in five full sentences without notes',
    ],
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
    patterns: ['2b', '2b', '4', '4', '6'],
    /** Unit test on the checkpoint day: these units, mixed. */
    review: '2b+4+6',
    lessons: [
      'Say what you don’t do or don’t understand (dw i ddim…)',
      'Answer yes and no the Welsh way (Ydw, Nac ydw, Oes, Nac oes)',
      'Talk about your family, with the mutations after “fy” and “a”',
      'Ask for a room and cope with words that change their first letter',
      'Say what you have: brothers, sisters, languages (mae gen i / mae gyda fi)',
    ],
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
    patterns: ['3', '3', '6', '5', '5'],
    /** Unit test on the checkpoint day: these units, mixed. */
    review: '3+5+6',
    lessons: [
      'Say what you like and describe things (mae’n flasus, mae’n hyfryd)',
      'Offer, accept and refuse: “Hoffech chi…?”',
      'Order at the tea house with “Ga i…?” and count what you order',
      'Ask politely (“Allwch chi…?”) and understand instructions',
      'Handle prices, change and requests at the counter',
    ],
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
    patterns: ['7', '7', '8', '10', '10'],
    /** Unit test on the checkpoint day: these units, mixed. */
    review: '7+8+10',
    lessons: [
      'Talk about the weather: what it was like and what it will be',
      'Talk about last year and next week (roedd, bydd), and answer by echoing the verb',
      'Say what you must and should do (rhaid i fi, dylwn i)',
      'Say what you’ll do with the short future (af i, gwna i)',
      'Make suggestions and plans together (Beth am…?, Well i ni…)',
    ],
    dialogues: ['d7', 'd7', 'd8', 'd8', 'd8'],
    scenarios: ['gwesty', 'gwesty', 'fferm-trevelin', 'ymwelydd', 'fferm-trevelin'],
    retell: {
      topic: 'Your plans for the trip',
      prompts: ['Where you’re going', 'When', 'Who you want to meet', 'What you want to see'],
    },
  },
  {
    week: 5,
    titleCy: 'Beth wnaethoch chi?',
    title: 'Telling what happened',
    focus:
      'The past tense unlocks stories: what you did yesterday, how you got here, why you started Welsh.',
    canDo: [
      'Say what you did yesterday or last weekend',
      'Tell the story of your journey to Patagonia',
      'Ask others what they did',
      'Tell a 2-minute story in order, linking it with wedyn, ar ôl, achos and felly (B1)',
    ],
    phraseLessons: ['p9', 'p14'],
    patterns: ['9', '9', '9', '12', '12'],
    /** Unit test on the checkpoint day: these units, mixed. */
    review: '9+12',
    lessons: [
      'Say what you did yesterday: es i, ges i, wnes i, ddes i',
      'Tell the story of your journey, in order (wedyn, ar ôl, achos)',
      'Ask other people what they did, and react',
      'Say what you’ve done and how long for (dw i wedi…, ers…)',
      'Ask and answer about experiences in an interview (Dych chi wedi…?)',
    ],
    dialogues: ['d9', 'd9', 'd10', 'd10', 'd10'],
    scenarios: ['dysgwr-lleol', 'stori-taith', 'ymwelydd', 'stori-taith', 'cyfweliad-iaith'],
    retell: {
      topic: 'What you did last weekend',
      prompts: ['Where you went', 'Who with', 'What you ate', 'How it was'],
    },
  },
  {
    week: 6,
    titleCy: 'Dw i’n meddwl bod…',
    title: 'Opinions, flow and Y Wladfa',
    focus:
      'Give opinions, react like a native speaker, and talk about Y Wladfa itself — the Mimosa, the chapels, the eisteddfod.',
    canDo: [
      'Say what you think and ask what others think',
      'React naturally: really?, of course, fair play',
      'Hold a 5-minute chat that doesn’t feel like a quiz',
      'Give an opinion with reasons, agree and disagree politely (B1)',
    ],
    phraseLessons: ['p10', 'p11'],
    patterns: ['11', '11', '13', '13', '14'],
    /** Unit test on the checkpoint day: these units, mixed. */
    review: '11+13+14',
    lessons: [
      'Give your opinion: “Dw i’n meddwl bod…”',
      'Back it up with reasons and comparisons (achos, mwy… na)',
      'Describe people with “sy” (the woman who teaches Welsh…)',
      'Tell history with the passive: cafodd y Wladfa ei sefydlu…',
      'Say what you would do if… (baswn i, taswn i)',
    ],
    dialogues: ['d11', 'd11', 'd12', 'd12', 'd12'],
    scenarios: ['barn', 'capel', 'sbaeneg', 'cyfweliad-iaith', 'pe-bai'],
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
      'Rehearse your on-camera interview, ask permission to film, and keep a conversation in Welsh when people switch to Spanish.',
    canDo: [
      'Ask locals about their family history and the settlers',
      'Run a short interview about the state of Welsh',
      'Ask permission to film, politely',
      'Say what you would do if… and talk about hopes and plans (B1)',
    ],
    phraseLessons: ['p12'],
    patterns: ['12', '14', '15', '15', '11'],
    /** Unit test on the checkpoint day: these units, mixed. */
    review: '12+14+15',
    lessons: [
      'Interview: ask how long and what someone has done (ers pryd, wedi)',
      'Talk about hopes and “if only” (baswn i’n hoffi…, taswn i…)',
      'Stress what matters: “Y bobl ifanc sy’n…”',
      'Say what you know and don\'t know (gwybod), talking with a descendant of the settlers',
      'Argue your case with someone who disagrees',
    ],
    dialogues: ['d13', 'd13', 'd14', 'd14', 'd14'],
    scenarios: ['cyfweliad-iaith', 'pe-bai', 'cyfweliad-iaith', 'disgynnydd', 'barn'],
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
      'Almost no new phrases — just Patagonian words to recognise. Lock in what you have with mock conversations, your interview and your story, so it all comes out under pressure.',
    canDo: [
      'Hold 5–10 minute conversations with strangers on familiar topics',
      'Recover when you don’t understand, without switching to English',
      'Tell your story and run your interview with confidence',
    ],
    // Only the Patagonian words to recognise (p13); everything else is rehearsal.
    phraseLessons: ['p13'],
    patterns: ['mix', 'mix', 'mix', 'mix', 'mix'],
    /** Unit test on the checkpoint day: these units, mixed. */
    review: 'mix',
    lessons: [
      'Full interview run-through, start to finish',
      'Your whole story, told to a stranger',
      'Keep going in Welsh when people switch to Spanish',
      'A long chat with a local learner, on any topic',
      'Final debate: the future of Welsh in Y Wladfa',
    ],
    dialogues: ['d14', 'd2', 'd10', 'd12', 'd13'],
    scenarios: ['cyfweliad-iaith', 'stori-taith', 'sbaeneg', 'dysgwr-lleol', 'barn'],
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
  /** The lesson's objective (what you can do by the end). */
  title: string
  dialogue: string | null
  /** Real-voice clip (weeks 4–8, days 2 and 5). */
  clip: string | null
  scenario: string
  retell: WeekPlan['retell']
  blocks: PlanBlock[]
  /** Set when a tough checkpoint means this session repeats last week’s partner. */
  repeatsWeek?: number
}

/** Week 5, day 1: confirm who you're meeting, where and when. */
export const OUTREACH_CONFIRM = 4 * SESSIONS_PER_WEEK + 1
/** Week 3, day 1: chase anyone who hasn't answered, and widen the net. */
export const OUTREACH_CHASE = 2 * SESSIONS_PER_WEEK + 1

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
      // A lesson is one hour with the same shape every day: review, new
      // language, grammar, listening, conversation, then a short fluency slot.
      // Real people from Y Wladfa replace the dialogue twice a week from week 2.
      const clip = day === 2 || day === 5 ? (CLIP_SCHEDULE[wk.week]?.[day === 2 ? 0 : 1] ?? null) : null
      // Your story on days 1 and 4 (and daily in week 8), the 4/3/2 retell
      // otherwise; on the three outreach days the message takes that slot.
      const outreach = n === 1 || n === OUTREACH_CHASE || n === OUTREACH_CONFIRM
      const story = wk.week === WEEKS || day === 1 || day === 4
      const slot: PlanBlock = outreach
        ? { id: 'outreach', minutes: 5, core: true }
        : story
          ? { id: 'story', minutes: 5, core: true }
          : { id: 'retell', minutes: 6, core: true }
      const blocks: PlanBlock[] = checkpoint
        ? [
            { id: 'review', minutes: 8, core: true },
            { id: 'pattern', minutes: 10, core: true },
            { id: 'story', minutes: 5, core: true },
            { id: 'checkpoint', minutes: 15, core: true },
            ...(wk.week >= 2
              ? [{ id: 'human' as const, minutes: 20, core: true }]
              : [
                  { id: 'retell' as const, minutes: 6, core: true },
                  { id: 'listen' as const, minutes: 7, core: true },
                ]),
          ]
        : [
            { id: 'review', minutes: 8, core: true },
            ...(phraseIds.length
              ? [{ id: 'phrases' as const, minutes: 8, core: true }]
              : []),
            // Grammar before the conversation, so you use it there.
            { id: 'pattern', minutes: 10, core: true },
            clip
              ? { id: 'clip' as const, minutes: 8, core: true }
              : { id: 'listen' as const, minutes: 7, core: true },
            { id: 'speak', minutes: 15, core: true },
            slot,
          ]
      sessions.push({
        n,
        week: wk.week,
        day,
        checkpoint,
        phraseIds,
        pattern: checkpoint ? wk.review : (wk.patterns[day - 1] ?? null),
        title: checkpoint
          ? `Unit ${wk.week} test: grammar review and a filmed conversation`
          : (wk.lessons[day - 1] ?? wk.title),
        dialogue: checkpoint ? (wk.week >= 2 ? null : wk.dialogues[0]!) : (wk.dialogues[day - 1] ?? null),
        clip: checkpoint ? null : clip,
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

/** First session of the interview week and of the rehearsal week. */
const PROTECTED_STARTS = [(WEEKS - 1) * SESSIONS_PER_WEEK + 1, (WEEKS - 2) * SESSIONS_PER_WEEK + 1]

/**
 * Today's session. Normally the lowest unfinished one, but when the flight is
 * close and you're behind, skip ahead so the rehearsal week (and before it the
 * interview week) always happens; skipped sessions stay open on the week map.
 */
export function nextPlanSession(
  trip: TripState,
  today = localCalendarDay(),
): { n: number; skipped: boolean } | null {
  const first = currentSession(trip, TOTAL_SESSIONS)
  if (first == null) return null
  const daysLeft = daysBetween(today, trip.tripDate)
  if (daysLeft > 0) {
    for (const start of PROTECTED_STARTS) {
      if (first >= start || daysLeft > TOTAL_SESSIONS - start + 1) continue
      for (let n = start; n <= TOTAL_SESSIONS; n++) {
        if (!isSessionDone(trip, n)) return { n, skipped: true }
      }
    }
  }
  return { n: first, skipped: false }
}

/**
 * Checkpoint scores are against the end-of-plan target, so the score that
 * counts as "on track" rises week by week.
 */
export const CHECKPOINT_ON_TRACK = [1.5, 2, 2, 2.5, 2.5, 3, 3, 3.5]

/** Most interview-critical first: if phrases get skipped, these come back first. */
const LESSON_PRIORITY = ['p11', 'p12', 'p3', 'p9', 'p10', 'p4', 'p2', 'p1', 'p8', 'p6', 'p5', 'p7', 'p13']

/**
 * A session adjusted to how things are going:
 * - after a tough checkpoint (below that week's on-track score), the week's
 *   first two sessions repeat last week's partners. Task repetition is how
 *   fluency catches up;
 * - in the rehearsal week, phrases from sessions you skipped come back, most
 *   interview-critical first.
 */
export function adaptSession(session: PlanSession, trip: TripState): PlanSession {
  if (session.week === WEEKS && !session.checkpoint) {
    const missed = PLAN_SESSIONS.filter(
      (s) => s.week < WEEKS && !s.checkpoint && !isSessionDone(trip, s.n),
    ).flatMap((s) => s.phraseIds)
    if (missed.length === 0) return session
    const rank = (id: string) => {
      const i = LESSON_PRIORITY.indexOf(id.split('-')[1] ?? '')
      return i < 0 ? LESSON_PRIORITY.length : i
    }
    const sorted = [...missed].sort((a, b) => rank(a) - rank(b))
    const phraseIds = splitEvenly(sorted, SESSIONS_PER_WEEK - 1)[session.day - 1] ?? []
    if (phraseIds.length === 0) return session
    const hasPhrases = session.blocks.some((b) => b.id === 'phrases')
    return {
      ...session,
      // Missed interview-critical phrases come before the recognition-only words.
      phraseIds: [...phraseIds, ...session.phraseIds].slice(0, 12),
      blocks: hasPhrases
        ? session.blocks
        : [session.blocks[0]!, { id: 'phrases', minutes: 8, core: true }, ...session.blocks.slice(1)],
    }
  }
  if (session.week === 1 || session.day > 2 || session.checkpoint) return session
  const last = trip.checkpoints[String(session.week - 1)]
  const bar = CHECKPOINT_ON_TRACK[session.week - 2] ?? 3
  if (!last || last.overall >= bar) return session
  const prev = weekPlan(session.week - 1)
  return {
    ...session,
    scenario: prev.scenarios[session.day + 2] ?? session.scenario,
    repeatsWeek: prev.week,
  }
}

/** Minutes for the core blocks, and for everything. */
export function sessionMinutes(session: PlanSession): { core: number; all: number } {
  let core = 0
  let all = 0
  for (const b of session.blocks) {
    all += b.minutes
    if (b.core) core += b.minutes
  }
  return { core, all }
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
  story: {
    titleCy: 'Fy stori',
    title: 'Your story & questions',
    why: 'Run your intro and the quick-fire questions out loud. These are the first two minutes of every conversation in Patagonia, so make them automatic.',
  },
  clip: {
    titleCy: 'Lleisiau go iawn',
    title: 'Real voices',
    why: 'Real people from Y Wladfa at real speed. Watch once with no subtitles and answer the gist questions, then again with subtitles. Catching half is normal — that’s the skill you’ll need there.',
  },
  outreach: {
    titleCy: 'Cysylltu',
    title: 'Contact Y Wladfa',
    why: 'January is quiet there, so line people up early: message three contacts (Menter Patagonia, Asociación San David, a chapel or tea house) on WhatsApp or Facebook, then confirm names, dates and filming in week 5. Ready-made messages are in “Before you go”.',
  },
  human: {
    titleCy: 'Person go iawn',
    title: 'Talk with a real person',
    why: 'An AI is patient and shows text; people interrupt, speed up and switch language. Book a Welsh tutor online, join an online Welsh chat group, video-call a contact in Y Wladfa — or, if none of that works this week, swap a few voice notes in Welsh with one of them.',
  },
  pattern: {
    titleCy: 'Gramadeg',
    title: 'Grammar',
    why: 'The grammar track: every Colloquial Welsh unit up to B1 (past, future, perfect, conditional, passive, “that” clauses), in order. Read the rules, then say six sentences of your own that need them — producing a pattern, with feedback, is what turns knowing a rule into using it.',
  },
  checkpoint: {
    titleCy: 'Sgwrs brawf',
    title: 'Checkpoint conversation',
    why: 'A scored 5–8 minute chat so you can see your progress week by week. Film it: week 1 vs week 8 makes great footage.',
  },
}
