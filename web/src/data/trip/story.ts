import { aspirateMutate, isWelshPlace, mutatedAlternative, oPlace, ynPlace } from '../../lib/mutation'
import type { IntroProfile } from '../../lib/trip'

export interface Line {
  welsh: string
  english: string
  note?: string
}

/**
 * cy slots into “Dw i’n gweithio fel …”; say replaces that whole sentence
 * (for things that aren't jobs, like being a student). fem, when given, is
 * shown as a note: the form a woman uses.
 */
export const JOBS: {
  en: string
  cy: string
  say?: { welsh: string; english: string }
  fem?: string
}[] = [
  { en: 'software engineer', cy: 'peiriannydd meddalwedd' },
  { en: 'engineer', cy: 'peiriannydd' },
  {
    en: 'student',
    cy: 'myfyriwr',
    say: { welsh: 'Dw i’n fyfyriwr.', english: 'I’m a student.' },
    fem: 'Dw i’n fyfyrwraig.',
  },
  { en: 'teacher', cy: 'athro', fem: 'Dw i’n gweithio fel athrawes.' },
  { en: 'doctor', cy: 'meddyg' },
  { en: 'nurse', cy: 'nyrs' },
  { en: 'designer', cy: 'dylunydd' },
  {
    en: 'video maker',
    cy: 'gwneud fideos',
    say: { welsh: 'Dw i’n gwneud fideos.', english: 'I make videos.' },
  },
  { en: 'writer', cy: 'awdur' },
  { en: 'researcher', cy: 'ymchwilydd' },
  { en: 'accountant', cy: 'cyfrifydd' },
  { en: 'manager', cy: 'rheolwr', fem: 'Dw i’n gweithio fel rheolwraig.' },
  { en: 'lawyer', cy: 'cyfreithiwr', fem: 'Dw i’n gweithio fel cyfreithwraig.' },
  { en: 'scientist', cy: 'gwyddonydd' },
  {
    en: 'retired',
    cy: 'wedi ymddeol',
    say: { welsh: 'Dw i wedi ymddeol.', english: 'I’m retired.' },
  },
]

/** Language names in Welsh (Welsh uses -eg for many language names). */
export const LANGUAGES: { en: string; cy: string }[] = [
  { en: 'English', cy: 'Saesneg' },
  { en: 'Hindi', cy: 'Hindi' },
  { en: 'Tamil', cy: 'Tamileg' },
  { en: 'Telugu', cy: 'Telugu' },
  { en: 'Kannada', cy: 'Kannada' },
  { en: 'Malayalam', cy: 'Malayalam' },
  { en: 'Marathi', cy: 'Marathi' },
  { en: 'Bengali', cy: 'Bengaleg' },
  { en: 'Gujarati', cy: 'Gwjarati' },
  { en: 'Punjabi', cy: 'Pwnjabeg' },
  { en: 'Urdu', cy: 'Wrdw' },
  { en: 'Spanish', cy: 'Sbaeneg' },
  { en: 'French', cy: 'Ffrangeg' },
  { en: 'German', cy: 'Almaeneg' },
]

export const REASONS: Line[] = [
  {
    welsh: 'Dw i wrth fy modd ag ieithoedd.',
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

/** Welsh list: “a” takes the aspirate (a Thamil); “ac” before a vowel (ac Wrdw). */
function list(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  const last = items[items.length - 1]!
  const joined = /^[aeiouwyâêîôûŵŷ]/i.test(last) ? `ac ${last}` : `a ${aspirateMutate(last)}`
  return `${items.slice(0, -1).join(', ')} ${joined}`
}

function listEnglish(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

function jobWelsh(job: string): string {
  const hit = JOBS.find((j) => j.en === job.trim().toLowerCase())
  return hit ? hit.cy : job.trim()
}

/** “Dw i’n gweithio fel …”, or the job’s own natural sentence. */
function jobLine(job: string): Line {
  const hit = JOBS.find((j) => j.en === job.trim().toLowerCase())
  const fem = hit?.fem ? { note: `A woman says: ${hit.fem}` } : {}
  if (hit?.say) return { ...hit.say, ...fem }
  return {
    welsh: `Dw i’n gweithio fel ${job ? jobWelsh(job) : '…'}.`,
    english: `I work as ${/^[aeiou]/i.test(job) ? 'an' : 'a'} ${job || '…'}.`,
    ...fem,
  }
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
    const city = p.city.trim()
    const from = oPlace(city)
    const alt = mutatedAlternative(city, 'o')
    lines.push({
      welsh: `Dw i’n dod o India, ${from}.`,
      english: `I come from India, from ${city}.`,
      note: isWelshPlace(city) && from !== `o ${city}`
        ? `“o” softens the next word: ${city} → ${from.slice(2)}.`
        : alt
          ? `Foreign names usually stay as they are after “o”; ${alt} is also heard.`
          : undefined,
    })
  } else {
    lines.push({ welsh: 'Dw i’n dod o India.', english: 'I come from India.' })
  }
  if (p.livesIn) {
    const place = p.livesIn.trim()
    const placed = ynPlace(place)
    const mutated = placed.replace(/^y(n|m|ng) /, '') !== place
    const alt = mutatedAlternative(place, 'yn')
    lines.push({
      welsh: `Dw i’n byw ${placed}.`,
      english: `I live in ${place}.`,
      note: mutated
        ? '“yn” + a Welsh place name triggers the nasal mutation (yng Nghaerdydd, ym Mangor).'
        : alt
          ? `Foreign names usually stay as they are. Some speakers mutate: ${alt}.`
          : placed !== `yn ${place}`
            ? '“yn” becomes “ym” before m.'
            : undefined,
    })
  }
  if (p.job) lines.push(jobLine(p.job))
  const langs = p.languages
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean)
  if (langs.length) {
    const cy = langs.map(
      (l) => LANGUAGES.find((x) => x.en.toLowerCase() === l.toLowerCase())?.cy ?? l,
    )
    const last = cy[cy.length - 1]!
    lines.push({
      welsh: `Dw i’n siarad ${list(cy)}.`,
      english: `I speak ${listEnglish(langs)}.`,
      note:
        cy.length > 1 && aspirateMutate(last) !== last
          ? `After “a” (and), p/t/c become ph/th/ch: a ${aspirateMutate(last)}. With foreign names it’s optional — many speakers say “a ${last}”.`
          : undefined,
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
      welsh: 'Dw i ddim yn nabod llawer o bobl o India sy’n siarad Cymraeg!',
      english: 'I don’t know many Indians who speak Welsh!',
      note: 'nabod = to know (a person). A modest, true line that usually gets a smile on camera.',
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
    answer: (p) => jobLine(p.job),
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
      welsh: 'Nac ydw, ddim eto. Ond dw i eisiau mynd!',
      english: 'No, not yet. But I want to go!',
      note: '“wedi” questions take the present-tense verb: Ydw (yes) / Nac ydw (no).',
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
      note: 'Welsh missionaries worked in the Khasi Hills from 1841. One of them, Thomas Jones, gave Khasi the Roman spelling it still uses, with Welsh-influenced rules (it had been written in Bengali script before).',
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
