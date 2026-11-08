import { getSession, PLAN_SESSIONS, sessionMinutes, WEEKS } from '../data/trip/plan'
import { daysBetween, type OutsideKind, type TripState } from './trip'
import { localCalendarDay } from './srs'

/**
 * The hybrid half of the plan: hours outside the app, mostly in time you'd
 * lose anyway (commute, gym, chores), plus real people every week.
 */
export const OUTSIDE_KINDS: {
  id: OutsideKind
  titleCy: string
  title: string
  /** Weekly target in minutes. */
  perWeek: number
  how: string
  /** Checked Nov 2026. */
  use: { name: string; url?: string; note: string }[]
}[] = [
  {
    id: 'audio',
    titleCy: 'Cwrs sain',
    title: 'Audio course',
    perWeek: 300,
    how: 'About 45 minutes a day on the commute, walking or at the gym. Speak every answer out loud before the voice does.',
    use: [
      {
        name: 'SaySomethingin Welsh',
        url: 'https://www.saysomethingin.com/',
        note: 'English prompt → you say it in Welsh → you hear it. Free to start, then about £15 a month. Pick the North Wales course: it’s closer to Patagonian Welsh.',
      },
    ],
  },
  {
    id: 'listen',
    titleCy: 'Gwrando',
    title: 'Radio, podcasts, TV',
    perWeek: 180,
    how: 'About 25 minutes a day of real Welsh while cooking or doing chores. Catching the gist is the goal; it trains your ear for real speed. (BBC Sounds and live Radio Cymru don’t play outside the UK since July 2025.)',
    use: [
      {
        name: 'Pigion: Highlights for Welsh Learners',
        note: 'BBC podcast of Radio Cymru highlights for learners, still publishing in 2026. Search “Pigion” in any podcast app. Free.',
      },
      {
        name: 'S4C Learners on YouTube',
        url: 'https://www.youtube.com/user/HwbTV',
        note: 'Short clips made for learners. Free.',
      },
      {
        name: 'S4C for learners (and Clic)',
        url: 'https://www.s4c.cymru/en/dysgu-cymraeg/',
        note: 'Welsh TV for learners; Clic on demand plays abroad where S4C has the rights. Free.',
      },
    ],
  },
  {
    id: 'tutor',
    titleCy: 'Tiwtor',
    title: 'Tutor or class',
    perWeek: 120,
    how: 'Two 1-hour online lessons a week. Ask your tutor to spend them talking, using this week’s grammar unit and topics.',
    use: [
      {
        name: 'italki Welsh teachers',
        url: 'https://www.italki.com/en/teachers/welsh',
        note: 'About 10 teachers; trial lessons about US$6.50–25.',
      },
      {
        name: 'Preply Welsh tutors',
        url: 'https://preply.com/en/online/welsh-tutors',
        note: 'A handful of tutors, about US$24–35 a lesson.',
      },
      {
        name: 'Learn Welsh online courses',
        url: 'https://learnwelsh.cymru/learning/learn-welsh-courses/',
        note: 'Official live online classes, about £100 a course. Email office@learnwelsh.cymru to check you can join from abroad.',
      },
    ],
  },
  {
    id: 'people',
    titleCy: 'Pobl go iawn',
    title: 'Real conversation',
    perWeek: 60,
    how: 'An online Welsh chat group, voice notes with a contact in Y Wladfa, or a video call with a learner friend.',
    use: [
      {
        name: 'Cymdeithas Madog',
        url: 'https://madog.org/',
        note: 'North American Welsh society with online “Siop Siarad” conversation sessions for learners.',
      },
      {
        name: 'Your Y Wladfa contacts',
        note: 'Ask Menter Patagonia or the Welsh Language Project teachers in Trelew, Gaiman and Trevelin (via Facebook) about an online paned a sgwrs before you go.',
      },
    ],
  },
]

/** Minutes logged per kind, from `since` (inclusive) to today. */
export function outsideByKind(trip: TripState, since?: string): Record<OutsideKind, number> {
  const out: Record<OutsideKind, number> = { audio: 0, listen: 0, tutor: 0, people: 0 }
  for (const o of trip.outside) {
    if (since && o.date < since) continue
    out[o.kind] = (out[o.kind] ?? 0) + (o.minutes || 0)
  }
  return out
}

/** Monday of this week (the weekly targets reset then). */
export function weekStart(today = localCalendarDay()): string {
  const [y, m, d] = today.split('-').map(Number)
  const date = new Date(y!, m! - 1, d!)
  const back = (date.getDay() + 6) % 7
  return localCalendarDay(new Date(y!, m! - 1, d! - back))
}

/** In-app minutes: finished sessions' core blocks, plus 10 for each busy-day minimum. */
export function appMinutes(trip: TripState): number {
  let total = 0
  for (const key of Object.keys(trip.done)) {
    const s = getSession(Number(key))
    if (s) total += sessionMinutes(s).core
  }
  return total + trip.light.length * 10
}

export interface HoursSummary {
  app: number
  outside: number
  total: number
  /** Hours by the trip date if you keep your pace so far. */
  projected: number
  /** Hours by the trip date on the full hybrid plan from today. */
  projectedPlan: number
  daysLeft: number
}

/** App minutes per week on the plan (the core blocks of a week's sessions). */
export const PLAN_APP_MINUTES_PER_WEEK = Math.round(
  PLAN_SESSIONS.reduce((n, s) => n + sessionMinutes(s).core, 0) / WEEKS,
)
export const PLAN_OUTSIDE_MINUTES_PER_WEEK = OUTSIDE_KINDS.reduce((n, k) => n + k.perWeek, 0)

export function hoursSummary(trip: TripState, today = localCalendarDay()): HoursSummary {
  const app = appMinutes(trip) / 60
  const outside = trip.outside.reduce((n, o) => n + (o.minutes || 0), 0) / 60
  const total = app + outside
  const daysLeft = Math.max(0, daysBetween(today, trip.tripDate))
  const daysIn = Math.max(1, daysBetween(trip.startedOn, today) + 1)
  // Pace needs a few days of data before it means anything.
  const pace = daysIn >= 5 ? total / daysIn : (PLAN_APP_MINUTES_PER_WEEK + PLAN_OUTSIDE_MINUTES_PER_WEEK) / 60 / 7
  const planPerDay = (PLAN_APP_MINUTES_PER_WEEK + PLAN_OUTSIDE_MINUTES_PER_WEEK) / 60 / 7
  return {
    app,
    outside,
    total,
    projected: total + pace * daysLeft,
    projectedPlan: total + planPerDay * daysLeft,
    daysLeft,
  }
}

/**
 * A rough speaking level for a total number of focused hours, for an English
 * speaker on a speaking-first plan. Only a guide: the checkpoints measure it.
 */
export function levelForHours(hours: number): string {
  // Cambridge guided hours: A1 ≈ 90–100, A2 ≈ 180–200, B1 ≈ 350–400. A
  // speaking-first plan on your own topics runs a little ahead of that there.
  if (hours < 50) return 'A1 on your topics'
  if (hours < 100) return 'A1+, A2 on your topics'
  if (hours < 180) return 'A2, strong on your topics'
  if (hours < 300) return 'A2+, B1 on familiar topics'
  return 'B1'
}
