/**
 * Real Welsh from real people in Y Wladfa. Every clip here was checked to be
 * public on YouTube worldwide (Nov 2026); most are from S4C Dysgu Cymraeg's
 * "Gwladfa" series, labelled intermediate. Easy clips first.
 */

export interface Clip {
  id: string
  /** YouTube video id. */
  video: string
  title: string
  source: string
  /** Length in minutes (rounded up). */
  minutes: number
  who: string
  /** Welsh subtitles: a real track, burned in, or none. */
  subtitles: 'welsh' | 'english' | 'burned-in' | 'auto' | 'none'
  level: 'easy' | 'medium' | 'hard'
  /** Answer these before reading any subtitles. */
  gist: string[]
}

export const CLIPS: Clip[] = [
  {
    id: 'shwmae-trelew',
    video: 'foo0ukBBJss',
    title: 'Shwmae Su’mae',
    source: 'Menter Patagonia Y Dyffryn',
    minutes: 1,
    who: 'People in Trelew greeting you',
    subtitles: 'none',
    level: 'easy',
    gist: ['How many different people greet you?', 'Which greeting do you hear most?'],
  },
  {
    id: 'plant-yr-andes',
    video: 'ibxFVMpbMeg',
    title: 'Shwmae Su’mae — Plant yr Andes',
    source: 'Llais yr Andes',
    minutes: 2,
    who: 'Children from Trevelin and Esquel',
    subtitles: 'auto',
    level: 'easy',
    gist: ['Which two towns are the children from?', 'What day are they celebrating?'],
  },
  {
    id: 'cymraeg-yn-yr-andes',
    video: 'ivzITrQ2UYA',
    title: 'Cymraeg yn yr Andes',
    source: 'S4C Dysgu Cymraeg',
    minutes: 4,
    who: 'Noe Jenkins, a teacher at Ysgol y Cwm, Trevelin, who learned Welsh as an adult',
    subtitles: 'welsh',
    level: 'medium',
    gist: ['What’s the teacher’s name?', 'Did she grow up with Welsh, or learn it?'],
  },
  {
    id: 'dawnsio-gwerin',
    video: 'txej7B-n2W4',
    title: 'Dawnsio Gwerin',
    source: 'S4C Dysgu Cymraeg',
    minutes: 3,
    who: 'Celeste and Astrid of the Gwanwyn folk-dance group, Trelew',
    subtitles: 'burned-in',
    level: 'medium',
    gist: ['Which town is the dance group from?', 'What do people ask about their clothes?'],
  },
  {
    id: 'cadwr-gymraeg',
    video: '7IZxrSTnEtE',
    title: 'Cadw’r Gymraeg yn Fyw',
    source: 'S4C Dysgu Cymraeg',
    minutes: 3,
    who: 'Pupils and teachers in schools across Y Wladfa',
    subtitles: 'welsh',
    level: 'medium',
    gist: ['Where does the presenter go?', 'Which tradition gets a mention?'],
  },
  {
    id: 'steddfod-y-wladfa',
    video: '-E-PoFWeoMY',
    title: 'Steddfod y Wladfa',
    source: 'S4C Dysgu Cymraeg',
    minutes: 3,
    who: 'Marli Pugh de Villoria',
    subtitles: 'welsh',
    level: 'medium',
    gist: ['What event is she explaining?', 'What’s different about the anthem?'],
  },
  {
    id: 'gaucho-cymreig',
    video: '06D_m3tn3lk',
    title: 'Gaucho Cymreig',
    source: 'S4C Dysgu Cymraeg',
    minutes: 3,
    who: 'Aidel Griffiths, a gaucho of Welsh descent',
    subtitles: 'burned-in',
    level: 'medium',
    gist: ['Where are they?', 'What do they do at the end?'],
  },
  {
    id: 'esyllt-nest-roberts',
    video: 'lCIML5-lU70',
    title: 'Cyfarchion gan Esyllt Nest Roberts',
    source: 'Menter Patagonia',
    minutes: 3,
    who: 'Esyllt Nest Roberts, a fluent speaker near Gaiman',
    subtitles: 'auto',
    level: 'medium',
    gist: ['Where does she live?', 'Name one thing she talks about.'],
  },
  {
    id: 'ysgol-y-cwm',
    video: 'U4oI4Sgxcq0',
    title: 'Ysgol y Cwm',
    source: 'Gwion Elis-Williams',
    minutes: 6,
    who: 'The school community in Trevelin',
    subtitles: 'english',
    level: 'medium',
    gist: ['Which town is the school in?', 'What does the film ask viewers to do?'],
  },
  {
    id: 'pa-fath-o-bobl',
    video: 'YkhkZ_EoJtE',
    title: 'Pa Fath o Bobl… Patagonia',
    source: 'Hansh (S4C)',
    minutes: 26,
    who: 'A presenter from Cardiff meeting people in Y Wladfa — fast, informal Welsh',
    subtitles: 'english',
    level: 'hard',
    gist: [
      'Watch 8 minutes. Where is the presenter from?',
      'Pick one person: where do they live, and how did they get their Welsh?',
    ],
  },
]

export function getClip(id: string): Clip | undefined {
  return CLIPS.find((c) => c.id === id)
}

/**
 * Real-voice clips for days 2 and 5 of weeks 2–8, easy to hard. Week 7 goes
 * back to two earlier clips on purpose: you'll catch far more the second time.
 */
export const CLIP_SCHEDULE: Record<number, [string, string]> = {
  2: ['shwmae-trelew', 'plant-yr-andes'],
  3: ['cymraeg-yn-yr-andes', 'dawnsio-gwerin'],
  4: ['cadwr-gymraeg', 'steddfod-y-wladfa'],
  5: ['gaucho-cymreig', 'esyllt-nest-roberts'],
  6: ['ysgol-y-cwm', 'pa-fath-o-bobl'],
  7: ['cymraeg-yn-yr-andes', 'steddfod-y-wladfa'],
  8: ['pa-fath-o-bobl', 'cadwr-gymraeg'],
}
