import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '26',
  intro:
    'Ceiriog’s poem on staying and going. Read the literary line, then the spoken form beside it.',
  steps: [
    {
      id: 'stay-go',
      kicker: 'Phrase',
      title: 'Stay and go, in literary Welsh',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'aros a myned',
            english: 'staying and going',
            note: 'Poem title (Ceiriog). In speech, myned is mynd: aros a mynd.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'myned',
            english: 'go (literary form)',
            note: 'Literary verb-noun. Spoken Welsh uses mynd.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'aros',
            english: 'stay; remain; wait',
          },
        },
        {
          type: 'tip',
          body: 'Cards marked literary are for reading the poem. The note beside each one is the form you say.',
        },
      ],
    },
    {
      id: 'vn-front',
      kicker: 'Grammar',
      title: 'The verb-noun moves to the front',
      blocks: [
        {
          type: 'rule',
          title: 'Leave yn behind',
          body: 'The plain line is Mae’r mynyddau mawr yn aros, “the great mountains remain”. For emphasis, the verb-noun leads, then mae, then the subject. The linking yn drops out of that fronted pattern.',
          examples: [
            {
              welsh: "Aros mae'r mynyddau mawr",
              english: 'The great mountains remain',
            },
            {
              welsh: 'Rhuo trostynt mae y gwynt',
              english: 'The wind roars over them',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'mynyddau',
            english: 'mountains (regional plural)',
            note: 'Plural of mynydd in many regions, and in the poem. The usual plural now is mynyddoedd.',
          },
        },
        {
          type: 'tip',
          body: 'In Rhuo trostynt mae y gwynt, mae y is mae’r opened by one syllable so the line scans.',
        },
      ],
    },
    {
      id: 'spoken-twin',
      kicker: 'Pattern',
      title: 'Say the spoken twin',
      blocks: [
        {
          type: 'rule',
          title: 'Over them, and grows',
          body: 'trostynt is literary “over them”; speech has drostyn nhw. The preposition was tros, and dros — already softly mutated — is the ordinary shape now, still followed by a soft mutation. A literary present such as tyf is mae’n tyfu when you are speaking.',
          examples: [
            { welsh: 'trostynt', english: 'over them (literary)' },
            { welsh: 'drostyn nhw', english: 'over them' },
            { welsh: "mae'n tyfu", english: 'grows; is growing' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'wedi',
            english: 'after (literary sense)',
            note: 'ar ôl is the everyday word. oes is feminine, so the adjective softens: oes dymhestlog hir, a long stormy age. wedi oes dymhestlog hir — after a long stormy age.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'o gylch',
            english: 'around (poetic)',
            note: 'Built on cylch, “circle”. The usual phrase today is o amgylch.',
          },
        },
      ],
    },
    {
      id: 'sangiad',
      kicker: 'Grammar',
      title: 'A sangiad splits the phrase',
      blocks: [
        {
          type: 'rule',
          title: 'The displaced word softens',
          body: 'A sangiad is a short run of words set into the middle of a phrase. The word pushed to the far side of that insert takes a soft mutation. clywir cân, split by eto gyda’r wawr, is written with gân, and clywir is the formal impersonal of clywed, “is heard”.',
          examples: [
            {
              welsh: "Clywir eto gyda'r wawr gân bugeiliaid",
              english: "The shepherds' song is heard again at dawn",
            },
            { welsh: 'clywir', english: 'is heard; one will hear' },
            { welsh: 'gwawr', english: 'dawn' },
          ],
        },
        {
          type: 'tip',
          body: 'gwawr is feminine, so gyda’r wawr — at dawn — softens it after the article.',
        },
      ],
    },
    {
      id: 'sydd-focus',
      kicker: 'Pattern',
      title: 'sydd follows a fronted subject',
      blocks: [
        {
          type: 'rule',
          title: 'mae steps aside',
          body: 'Front the subject, and sydd replaces mae. The line says that new shepherds are the ones on these old mountains. A fronted noun also softens the verb after it: newid ddaeth, from daeth newid.',
          examples: [
            {
              welsh: 'Ond bugeiliaid newydd sydd ar yr hen fynyddoedd hyn',
              english: 'But it is new shepherds who are on these old mountains',
            },
            { welsh: 'sydd', english: 'who is; which is (relative)' },
            { welsh: 'newid ddaeth', english: 'change has come (focused)' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Daeth newid ar arferion Cymru gynt',
            english: 'Change came upon the customs of Wales of old',
            note: 'Plain order of the poem’s Ar arferion Cymru gynt newid ddaeth. cynt is often gynt, “of old”. arfer is a custom; fel arfer means “usually”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'megis',
            english: 'like; as',
            note: 'Literary and formal. Speech usually has fel. megis cynt — as before.',
          },
        },
      ],
    },
    {
      id: 'what-remains',
      kicker: 'Culture',
      title: 'Mountains stay, language lives',
      blocks: [
        {
          type: 'culture',
          title: 'Ceiriog’s staying and going',
          body: 'The poem, from Alun Mabon, holds the mountains still while shepherds and customs change, cenhedlaeth ar ôl cenhedlaeth. Time turns o rod i rod: rhod is the old word for a wheel or a cycle of the seasons, olwyn is the wheel you say now, and both o and i soften the noun. The daisy is llygad y dydd, “day’s eye” — the poem writes y llygad dydd — the same image behind the English word.',
        },
        {
          type: 'say',
          line: {
            welsh: 'mwy nid yw',
            english: 'is no more',
            note: 'Literary negative nid yw. In speech, dyw e ddim mwy. Alun Mabon mwy nid yw — Alun Mabon is no more.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yr heniaith',
            english: 'the old language (Welsh)',
            note: 'hen plus iaith. Mae’r heniaith yn dal i fyw — the old language still lives.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn fyw',
            english: 'alive',
            note: 'A soft mutation after yn marks the adjective “alive”. yn byw is the verb-noun “living”.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which line is focused?',
      blocks: [
        {
          type: 'check',
          prompt: 'Which wording puts the verb-noun first?',
          answer: "Aros mae'r mynyddau mawr",
          options: [
            "Mae'r mynyddau mawr yn aros",
            "Aros mae'r mynyddau mawr",
            "Yn aros mae'r mynyddau mawr",
          ],
        },
        {
          type: 'check',
          prompt: "Why is cân written gân in Clywir eto gyda'r wawr gân?",
          answer: 'A sangiad has split the phrase',
          options: [
            'gwawr is masculine',
            'A sangiad has split the phrase',
            'gân is the plural of cân',
          ],
        },
      ],
    },
  ],
}
