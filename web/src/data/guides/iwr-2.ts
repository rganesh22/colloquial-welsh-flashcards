import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '2',
  intro:
    'How a broadband offer is worded. Watch for who must apply, how the grant is processed, and the line that asks you to call.',
  steps: [
    {
      id: 'offer',
      kicker: 'Phrase',
      title: 'Take up the offer',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'band eang',
            english: 'broadband',
            note: 'The chapter title. This is the service on offer.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'manteisio ar',
            english: 'take advantage of',
            note: 'ar softens the next word.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'cynnig',
            english: 'offer',
            note: 'Also a masculine noun. The plural is cynigion.',
          },
        },
        {
          type: 'tip',
          body: 'A cynllun is the plan behind the offer. caledwedd is a mass noun for computer hardware, so you talk about installing it as a whole.',
        },
      ],
    },
    {
      id: 'must',
      kicker: 'Grammar',
      title: 'Saying you must',
      blocks: [
        {
          type: 'rule',
          title: 'Rhaid and does dim rhaid',
          body: 'Rhaid i chi fod means you must be something. does dim rhaid is that same rhaid with the obligation gone, so you need not. Use it when the offer is open and nothing is required of you.',
          examples: [
            { welsh: 'Rhaid i chi fod', english: 'You must be' },
            { welsh: 'does dim rhaid', english: "don't have to; needn't" },
          ],
        },
      ],
    },
    {
      id: 'passive',
      kicker: 'Pattern',
      title: 'How a grant is processed',
      blocks: [
        {
          type: 'rule',
          title: 'cael plus a possessive',
          body: 'The usual Welsh passive is cael, then a possessive, then the verb-noun. fod eich grant yn cael ei brosesu says that your grant gets processed. Read it as “gets its processing”: prosesu softens after ei because grant is masculine.',
          examples: [
            {
              welsh: 'cael + possessive + VN',
              english: 'passive (gets …ed)',
            },
            {
              welsh: 'fod eich grant yn cael ei brosesu',
              english: 'that your application/grant is processed',
            },
          ],
        },
      ],
    },
    {
      id: 'call',
      kicker: 'Phrase',
      title: 'Give them a call',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Rhowch alwad',
            english: 'Give (us) a call',
            note: 'The polite imperative, with chi understood. galwad softens to alwad.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ar frys',
            english: 'urgently; straight away; in a hurry',
            note: 'From brys, “haste”. brysio is “hurry”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Dim nawr, dw i ar frys!',
            english: 'Not now, I’m in a hurry!',
          },
        },
      ],
    },
    {
      id: 'language',
      kicker: 'Culture',
      title: 'Welsh their language',
      blocks: [
        {
          type: 'culture',
          title: 'A Welsh-speaking team',
          body: 'Cymraeg eu hiaith means “Welsh their language”. It sits after the noun and works as an adjective, so ein tîm Cymraeg eu hiaith is our Welsh-speaking team. That is how a service tells you the people on the line speak Welsh.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Cymraeg eu hiaith',
            english: 'Welsh-speaking (lit. Welsh their language)',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ein tîm Cymraeg eu hiaith',
            english: 'our Welsh-speaking team',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which line fits?',
      blocks: [
        {
          type: 'check',
          prompt: 'Nothing is required of you. Which phrase fits?',
          answer: 'does dim rhaid',
          options: ['Rhaid i chi fod', 'does dim rhaid', 'ar frys'],
        },
        {
          type: 'check',
          prompt: 'Which line means the grant is processed?',
          answer: 'fod eich grant yn cael ei brosesu',
          options: [
            'Rhowch alwad',
            'fod eich grant yn cael ei brosesu',
            'ein tîm Cymraeg eu hiaith',
          ],
        },
      ],
    },
  ],
}
