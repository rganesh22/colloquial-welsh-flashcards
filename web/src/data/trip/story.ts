import { softMutate, ynPlace } from '../../lib/mutation'
import type { IntroProfile } from '../../lib/trip'

export interface Line {
  welsh: string
  english: string
  note?: string
}

export const JOBS: { en: string; cy: string }[] = [
  { en: 'software engineer', cy: 'peiriannydd meddalwedd' },
  { en: 'engineer', cy: 'peiriannydd' },
  { en: 'student', cy: 'myfyriwr' },
  { en: 'teacher', cy: 'athro' },
  { en: 'doctor', cy: 'meddyg' },
  { en: 'nurse', cy: 'nyrs' },
  { en: 'designer', cy: 'dylunydd' },
  { en: 'video maker', cy: 'gwneuthurwr fideos' },
  { en: 'writer', cy: 'awdur' },
  { en: 'researcher', cy: 'ymchwilydd' },
  { en: 'accountant', cy: 'cyfrifydd' },
  { en: 'manager', cy: 'rheolwr' },
  { en: 'lawyer', cy: 'cyfreithiwr' },
  { en: 'scientist', cy: 'gwyddonydd' },
]

/** Language names in Welsh (Welsh uses -eg for many language names). */
export const LANGUAGES: { en: string; cy: string }[] = [
  { en: 'English', cy: 'Saesneg' },
  { en: 'Hindi', cy: 'Hindi' },
  { en: 'Tamil', cy: 'Tamil' },
  { en: 'Telugu', cy: 'Telugu' },
  { en: 'Kannada', cy: 'Kannada' },
  { en: 'Malayalam', cy: 'Malayalam' },
  { en: 'Marathi', cy: 'Marathi' },
  { en: 'Bengali', cy: 'Bengaleg' },
  { en: 'Gujarati', cy: 'Gwjarati' },
  { en: 'Punjabi', cy: 'Pwnjabi' },
  { en: 'Urdu', cy: 'Wrdw' },
  { en: 'Spanish', cy: 'Sbaeneg' },
  { en: 'French', cy: 'Ffrangeg' },
  { en: 'German', cy: 'Almaeneg' },
]

export const REASONS: Line[] = [
  {
    welsh: 'Dw i’n caru ieithoedd.',
    english: 'I love languages.',
  },
  {
    welsh: 'Mae’r Gymraeg yn iaith hyfryd.',
    english: 'Welsh is a lovely language.',
  },
  {
    welsh: 'Dw i eisiau gweld y Gymraeg yn y Wladfa.',
    english: 'I want to see Welsh in Patagonia.',
  },
  {
    welsh: 'Dw i’n gwneud fideo am y Gymraeg ym Mhatagonia.',
    english: 'I’m making a video about Welsh in Patagonia.',
  },
  {
    welsh: 'Dw i eisiau dangos bod pawb yn gallu dysgu Cymraeg.',
    english: 'I want to show that everyone can learn Welsh.',
  },
]

function list(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} a ${items[items.length - 1]}`
}

function jobWelsh(job: string): string {
  const hit = JOBS.find((j) => j.en === job.trim().toLowerCase())
  return hit ? hit.cy : job.trim()
}

/** Your 30–45 second introduction, built from the profile. */
export function buildIntro(p: IntroProfile): Line[] {
  const lines: Line[] = [
    {
      welsh: `Shwmae! ${p.name || '…'} dw i.`,
      english: `Hi! I’m ${p.name || '…'}.`,
      note: 'Name first, then “dw i” — the most natural way to say it.',
    },
  ]
  if (p.city) {
    lines.push({
      welsh: `Dw i’n dod o India, o ${softMutate(p.city)}.`,
      english: `I come from India, from ${p.city}.`,
      note:
        softMutate(p.city) !== p.city.trim()
          ? `“o” softens the next word: ${p.city} → ${softMutate(p.city)}. Plenty of speakers leave foreign names unmutated, so either is fine.`
          : undefined,
    })
  } else {
    lines.push({ welsh: 'Dw i’n dod o India.', english: 'I come from India.' })
  }
  if (p.livesIn) {
    lines.push({
      welsh: `Dw i’n byw ${ynPlace(p.livesIn)}.`,
      english: `I live in ${p.livesIn}.`,
      note:
        ynPlace(p.livesIn) !== `yn ${p.livesIn.trim()}`
          ? '“yn” + a place triggers the nasal mutation (yng Nghaerdydd, ym Mangor).'
          : undefined,
    })
  }
  if (p.job) {
    lines.push({
      welsh: `Dw i’n gweithio fel ${jobWelsh(p.job)}.`,
      english: `I work as a ${p.job}.`,
    })
  }
  const langs = p.languages
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean)
  if (langs.length) {
    const cy = langs.map(
      (l) => LANGUAGES.find((x) => x.en.toLowerCase() === l.toLowerCase())?.cy ?? l,
    )
    lines.push({
      welsh: `Dw i’n siarad ${list(cy)}.`,
      english: `I speak ${list(langs).replace(/ a /, ' and ')}.`,
    })
  }
  lines.push({
    welsh: 'Dw i wedi bod yn dysgu Cymraeg ers deufis.',
    english: 'I’ve been learning Welsh for two months.',
  })
  const reason = REASONS.find((r) => r.english === p.why)
  if (reason) lines.push(reason)
  lines.push(
    {
      welsh: 'Efallai mai fi ydy’r person cynta o India i siarad Cymraeg yma!',
      english: 'Maybe I’m the first person from India to speak Welsh here!',
      note: '“mai” puts the focus on “fi” — a nice line for the camera.',
    },
    {
      welsh: 'Braf cwrdd â chi!',
      english: 'Lovely to meet you!',
    },
  )
  return lines
}

export interface ExpectedQuestion {
  welsh: string
  english: string
  /** A model answer; {placeholders} come from the profile. */
  answer: (p: IntroProfile) => Line
}

/** Questions you will almost certainly be asked, with model answers. */
export const EXPECTED_QUESTIONS: ExpectedQuestion[] = [
  {
    welsh: 'Beth ydy’ch enw chi?',
    english: 'What’s your name?',
    answer: (p) => ({ welsh: `${p.name || '…'} dw i.`, english: `I’m ${p.name || '…'}.` }),
  },
  {
    welsh: 'O ble dych chi’n dod?',
    english: 'Where are you from?',
    answer: () => ({ welsh: 'Dw i’n dod o India.', english: 'I come from India.' }),
  },
  {
    welsh: 'Ble dych chi’n byw?',
    english: 'Where do you live?',
    answer: (p) =>
      p.livesIn
        ? { welsh: `Dw i’n byw ${ynPlace(p.livesIn)}.`, english: `I live in ${p.livesIn}.` }
        : { welsh: 'Dw i’n byw yn India.', english: 'I live in India.' },
  },
  {
    welsh: 'Beth dych chi’n wneud?',
    english: 'What do you do (for work)?',
    answer: (p) => ({
      welsh: `Dw i’n gweithio fel ${p.job ? jobWelsh(p.job) : '…'}.`,
      english: `I work as a ${p.job || '…'}.`,
    }),
  },
  {
    welsh: 'Pam dych chi’n dysgu Cymraeg?',
    english: 'Why are you learning Welsh?',
    answer: (p) =>
      REASONS.find((r) => r.english === p.why) ?? REASONS[0]!,
  },
  {
    welsh: 'Ers pryd dych chi’n dysgu Cymraeg?',
    english: 'How long have you been learning Welsh?',
    answer: () => ({
      welsh: 'Ers deufis. Dim ond deufis!',
      english: 'For two months. Only two months!',
    }),
  },
  {
    welsh: 'Sut dysgoch chi Gymraeg?',
    english: 'How did you learn Welsh?',
    answer: () => ({
      welsh: 'Ar fy mhen fy hun, gydag ap a llyfr — a siarad bob dydd.',
      english: 'On my own, with an app and a book — and speaking every day.',
    }),
  },
  {
    welsh: 'Dych chi wedi bod yng Nghymru?',
    english: 'Have you been to Wales?',
    answer: () => ({
      welsh: 'Naddo, dim eto. Ond dw i eisiau mynd!',
      english: 'No, not yet. But I want to go!',
      note: 'Past-tense question (“wedi bod”) → answer Do (yes) / Naddo (no).',
    }),
  },
  {
    welsh: 'Am faint dych chi yma?',
    english: 'How long are you here for?',
    answer: () => ({
      welsh: 'Am bythefnos.',
      english: 'For a fortnight.',
      note: 'Swap in: am wythnos (a week), am ddeg diwrnod (ten days).',
    }),
  },
  {
    welsh: 'Dych chi’n hoffi Patagonia?',
    english: 'Do you like Patagonia?',
    answer: () => ({
      welsh: 'Ydw, yn fawr iawn! Mae’n hyfryd yma.',
      english: 'Yes, very much! It’s lovely here.',
    }),
  },
  {
    welsh: 'Ble dych chi’n aros?',
    english: 'Where are you staying?',
    answer: () => ({
      welsh: 'Dw i’n aros mewn gwesty yn y Gaiman.',
      english: 'I’m staying in a hotel in Gaiman.',
      note: 'Locals often say “y Gaiman” with the article.',
    }),
  },
  {
    welsh: 'Dych chi’n siarad Sbaeneg?',
    english: 'Do you speak Spanish?',
    answer: () => ({
      welsh: 'Nac ydw, dim ond tipyn bach. Mae’n well gen i siarad Cymraeg!',
      english: 'No, only a little. I prefer speaking Welsh!',
    }),
  },
  {
    welsh: 'Beth dych chi’n feddwl o’r Wladfa?',
    english: 'What do you think of Y Wladfa?',
    answer: () => ({
      welsh: 'Dw i’n meddwl ei bod hi’n anhygoel bod y Gymraeg yn fyw yma.',
      english: 'I think it’s amazing that Welsh is alive here.',
    }),
  },
  {
    welsh: 'Oes Cymry yn India?',
    english: 'Are there Welsh people in India?',
    answer: () => ({
      welsh: 'Oes, ychydig. Roedd cenhadon o Gymru ym Mryniau Khasi, yng ngogledd-ddwyrain India.',
      english: 'Yes, a few. There were missionaries from Wales in the Khasi Hills, in north-east India.',
      note: 'Welsh missionaries worked in the Khasi Hills from 1841 — a great connection to mention.',
    }),
  },
  {
    welsh: 'Dych chi’n hoffi’r bwyd?',
    english: 'Do you like the food?',
    answer: () => ({
      welsh: 'Ydw! Mae’r deisen ddu yn fendigedig.',
      english: 'Yes! The black cake is wonderful.',
    }),
  },
  {
    welsh: 'Beth dych chi’n mynd i wneud yfory?',
    english: 'What are you going to do tomorrow?',
    answer: () => ({
      welsh: 'Dw i’n mynd i Drefelin i weld y mynyddoedd.',
      english: 'I’m going to Trevelin (Trefelin) to see the mountains.',
    }),
  },
]
