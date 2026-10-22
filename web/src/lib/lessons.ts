import type { BookId, BookMeta, LessonMeta } from './types'

export const BOOKS: BookMeta[] = [
  {
    id: 'colloquial',
    short: 'CW',
    title: 'Colloquial Welsh',
    author: 'Gareth King',
  },
  {
    id: 'reader',
    short: 'IWR',
    title: 'Intermediate Welsh Reader',
    author: 'Gareth King',
  },
]

/** Full Colloquial Welsh course (Alphabet + lessons 1a–16). */
const COLLOQUIAL_LESSONS: Omit<LessonMeta, 'bookId'>[] = [
  { id: 'alphabet', titleCy: 'Yr Wyddor', titleEn: 'Alphabet', unit: 0 },
  {
    id: '1a',
    titleCy: 'Cwrdd â phobol',
    titleEn: 'Meeting people',
    unit: 1,
  },
  {
    id: '1b',
    titleCy: 'Enwi pobol a pethau',
    titleEn: 'Naming people and things',
    unit: 1,
  },
  {
    id: '2a',
    titleCy: 'Dod i nabod pobol',
    titleEn: 'Getting to know people',
    unit: 2,
  },
  {
    id: '2b',
    titleCy: 'Dw i ddim yn deall',
    titleEn: "I don't understand",
    unit: 2,
  },
  { id: '3', titleCy: 'Mynd allan', titleEn: 'Going out', unit: 3 },
  {
    id: '4',
    titleCy: 'Ellwch chi ddangos i mi…?',
    titleEn: 'Can you show me…?',
    unit: 4,
  },
  { id: '5', titleCy: "Holi'r ffordd", titleEn: 'Asking the way', unit: 5 },
  { id: '6', titleCy: 'Siopa', titleEn: 'Shopping', unit: 6 },
  { id: '7', titleCy: 'Y tywydd', titleEn: 'The weather', unit: 7 },
  {
    id: '8',
    titleCy: 'Gwneud trefniadau',
    titleEn: 'Making arrangements',
    unit: 8,
  },
  {
    id: '9',
    titleCy: "Be' ddigwyddodd?",
    titleEn: 'What happened?',
    unit: 9,
  },
  {
    id: '10',
    titleCy: 'Awgrymu pethau',
    titleEn: 'Making suggestions',
    unit: 10,
  },
  {
    id: '11',
    titleCy: "Beth wyt ti'n feddwl?",
    titleEn: 'What do you think?',
    unit: 11,
  },
  {
    id: '12',
    titleCy: 'Clywed y newyddion',
    titleEn: 'Hearing the news',
    unit: 12,
  },
  {
    id: '13',
    titleCy: "Dyma'r penawdau diweddara",
    titleEn: 'Here are the latest headlines',
    unit: 13,
  },
  {
    id: '14',
    titleCy: "Tasai'ch brawd fan'ma…",
    titleEn: 'If your brother were here…',
    unit: 14,
  },
  { id: '15', titleCy: 'Cefn gwlad', titleEn: 'The countryside', unit: 15 },
  {
    id: '16',
    titleCy: "Cymraeg ysgrifenedig a'r cyfryngau",
    titleEn: 'Written Welsh and the media',
    unit: 16,
  },
]

/** Intermediate Welsh Reader — 35 graded reading chapters. */
const READER_LESSONS: Omit<LessonMeta, 'bookId'>[] = [
  { id: '1', titleCy: 'Hysbysebion', titleEn: 'Advertisements' },
  { id: '2', titleCy: 'Band Eang', titleEn: 'Broadband' },
  { id: '3', titleCy: 'GagaBond', titleEn: 'Lady Gaga & Bond' },
  { id: '4', titleCy: 'Gŵyl Glastonbury', titleEn: 'Glastonbury Festival' },
  { id: '5', titleCy: "Caru Dysgu'r Gymraeg", titleEn: 'Loving learning Welsh' },
  { id: '6', titleCy: 'Gwefan heb Gymraeg', titleEn: 'A site without Welsh' },
  { id: '7', titleCy: 'Pendroni', titleEn: 'Pondering' },
  { id: '8', titleCy: 'Y Teulu Brenhinol', titleEn: 'The Royal Family' },
  {
    id: '9',
    titleCy: "Waldo'n Fardd Bro Kimbolton!",
    titleEn: 'Waldo, poet of Kimbolton',
  },
  { id: '10', titleCy: 'Taith S4C', titleEn: 'S4C journey' },
  { id: '11', titleCy: 'Betsan Powys', titleEn: 'Betsan Powys' },
  { id: '12', titleCy: 'Mynnu Etholiad Buan', titleEn: 'Demanding a quick election' },
  { id: '13', titleCy: 'Pencampwyr!', titleEn: 'Champions!' },
  { id: '14', titleCy: 'Mudiad Meithrin', titleEn: 'Mudiad Meithrin' },
  { id: '15', titleCy: 'Meinir Gwilym', titleEn: 'Meinir Gwilym' },
  { id: '16', titleCy: 'Rhagolygon', titleEn: 'Forecasts' },
  { id: '17', titleCy: 'Ras Yn Erbyn Amser', titleEn: 'Race against time' },
  {
    id: '18',
    titleCy: 'Bygwth Buddugoliaeth Gofiadwy',
    titleEn: 'Threatening a memorable win',
  },
  { id: '19', titleCy: 'Leanne Wood', titleEn: 'Leanne Wood' },
  { id: '20', titleCy: 'Refferendwm', titleEn: 'Referendum' },
  { id: '21', titleCy: 'Ergyd Ariannol', titleEn: 'Financial blow' },
  { id: '22', titleCy: 'Y Gweithdy', titleEn: 'The workshop' },
  { id: '23', titleCy: 'Harddwch yn y Llymder', titleEn: 'Beauty in austerity' },
  { id: '24', titleCy: 'Fy Hoff Le I', titleEn: 'My favourite place' },
  { id: '25', titleCy: 'Materion Meddygol', titleEn: 'Medical matters' },
  { id: '26', titleCy: 'Aros a Myned', titleEn: 'Staying and going' },
  { id: '27', titleCy: 'Un Nos Ola Leuad', titleEn: 'One Moonlit Night' },
  { id: '28', titleCy: 'Meic Stephens', titleEn: 'Meic Stephens' },
  { id: '29', titleCy: 'Llechi', titleEn: 'Slate' },
  { id: '30', titleCy: 'Y Trydydd Peth', titleEn: 'The Third Thing' },
  { id: '31', titleCy: 'Y Caeau Cochion', titleEn: 'The Red Fields' },
  { id: '32', titleCy: "Tolkien a'r Gymraeg", titleEn: 'Tolkien and Welsh' },
  { id: '33', titleCy: 'Y Rhyfel Fawr', titleEn: 'The Great War' },
  { id: '34', titleCy: 'Efrog Newydd Eto', titleEn: 'New York Again' },
  { id: '35', titleCy: 'Hen Niclas', titleEn: 'Old Niclas' },
]

function withBook(
  bookId: BookId,
  lessons: Omit<LessonMeta, 'bookId'>[],
): LessonMeta[] {
  return lessons.map((l) => ({ ...l, bookId }))
}

/** Ordered: Colloquial Welsh first, then Intermediate Welsh Reader. */
export const LESSONS: LessonMeta[] = [
  ...withBook('colloquial', COLLOQUIAL_LESSONS),
  ...withBook('reader', READER_LESSONS),
]

export function getBook(id: BookId): BookMeta {
  return BOOKS.find((b) => b.id === id) ?? BOOKS[0]!
}

export function lessonsForBook(bookId: BookId): LessonMeta[] {
  return LESSONS.filter((l) => l.bookId === bookId)
}

export function getLesson(
  bookId: BookId,
  lessonId: string,
): LessonMeta | undefined {
  return LESSONS.find((l) => l.bookId === bookId && l.id === lessonId)
}
