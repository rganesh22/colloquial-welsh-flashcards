import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '16',
  intro:
    'How formal Welsh writes “is”, “this”, and the verb, and where that register shows up in the Welsh media.',
  steps: [
    {
      id: 'formal-bod',
      kicker: 'Phrase',
      title: 'Formal Welsh marks “is” and “was”',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'y mae',
            english: 'is (formal)',
            note: 'A formal prefix y sits in front of mae. Speech is just mae.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yr oedd',
            english: 'was (formal)',
            note: 'Same prefix, this time yr, on the imperfect. Speech is roedd or oedd.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'bu (fu)',
            english: 'was (preterite of be)',
            note: 'In speech this tense of bod tends to mean “has been” or “have been”.',
          },
        },
      ],
    },
    {
      id: 'demonstratives',
      kicker: 'Grammar',
      title: 'This and that follow the noun',
      blocks: [
        {
          type: 'rule',
          title: 'hwn, hon, hwnnw, honno',
          body: 'Formal Welsh places the demonstrative after the noun, and gender chooses the word. Masculine nouns take hwn for “this” and hwnnw for “that”; feminine nouns take hon and honno. Spoken Welsh usually replaces the set with ’ma and ’na.',
          examples: [
            { welsh: 'y llyfr hwn', english: 'this book' },
            { welsh: 'y ddogfen ryfeddol honno', english: 'that wonderful document' },
            { welsh: 'y llenyddiaeth honno', english: 'that literature' },
          ],
        },
      ],
    },
    {
      id: 'endings',
      kicker: 'Pattern',
      title: 'The ending tells you who',
      blocks: [
        {
          type: 'rule',
          title: 'Person on the verb, no pronoun',
          body: 'Literary Welsh puts the person on the ending and drops the pronoun. A preterite like telais or rhedasant already says who did it. The future works the same way: byddant is “they will be”, where speech says byddan nhw.',
          examples: [
            { welsh: 'telais', english: 'I paid (literary)' },
            { welsh: 'rhedasant', english: 'they ran (literary)' },
            { welsh: 'byddant', english: 'they will be (literary)' },
          ],
        },
        {
          type: 'tip',
          body: 'cipiwyd means “was captured”, with nobody named as the subject. That autonomous past is normal in formal Welsh; speech prefers cafodd … ei chipio.',
        },
      ],
    },
    {
      id: 'not-and-they',
      kicker: 'Phrase',
      title: '“Not” and “they” change on the page',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'nid',
            english: 'not (formal)',
            note: 'The usual “not” in formal Welsh. In front of a verb it is ni, or nid before a vowel. Speech often uses dim.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Ni theithiasant',
            english: 'They did not travel (literary)',
            note: 'ni aspirates c, p, and t, and softens other consonants. Speech: Deithion nhw ddim.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'hwy',
            english: 'they; them (literary)',
            note: 'You will not hear this. Speech always uses nhw.',
          },
        },
        {
          type: 'tip',
          body: 'chwi is literary “you”, and ef is literary “he”. A line like Hwy a welsant is elevated word order, not emphasis. Speech says Welon nhw.',
        },
      ],
    },
    {
      id: 'on-screen',
      kicker: 'Phrase',
      title: 'Words you meet around the screen',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'cyfryngau torfol',
            english: 'mass media',
            note: 'cyfrwng is “medium”; cyfryngau is the plural.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'operâu sebon',
            english: 'soap operas',
            note: 'One soap is opera sebon.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'eto i gyd',
            english: 'then again; all the same',
          },
        },
        {
          type: 'tip',
          body: 'gyda llaw means “by the way”. mewn penbleth means “in a spin” or “perplexed”.',
        },
      ],
    },
    {
      id: 's4c',
      kicker: 'Culture',
      title: 'S4C still writes this way',
      blocks: [
        {
          type: 'culture',
          title: 'A channel and a register',
          body: 'Sianel Pedwar Cymru is Channel Four Wales, almost always called S4C. It launched on 1 November 1982. On air you hear colloquial Welsh; in listings, articles, and formal scripts you meet the literary forms from this chapter.',
        },
        {
          type: 'say',
          line: {
            welsh: 'a ddarlledir bob Nos Sul',
            english: 'which is broadcast every Sunday night',
            note: 'The -ir ending is formal and autonomous. Speech says sy’n cael ei ddarlledu.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'isdeitlau',
            english: 'subtitles',
            note: 'Plural of isdeitl. Useful while the commentary is still formal.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which form is the formal one?',
      blocks: [
        {
          type: 'check',
          prompt: 'Which is the formal way to say “that wonderful document”?',
          answer: 'y ddogfen ryfeddol honno',
          options: [
            'y ddogfen ryfeddol ’na',
            'y ddogfen ryfeddol honno',
            'honno ddogfen ryfeddol',
          ],
        },
        {
          type: 'check',
          prompt: 'Which is literary Welsh for “they ran”?',
          answer: 'rhedasant',
          options: ['redon nhw', 'rhedasant', 'rhedasent'],
        },
      ],
    },
  ],
}
