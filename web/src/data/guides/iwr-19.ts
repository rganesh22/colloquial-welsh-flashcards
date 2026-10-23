import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '19',
  intro:
    'How a formal tribute talks about Leanne Wood: comparison, “whatever”, until, and the literary endings of a speech.',
  steps: [
    {
      id: 'while',
      kicker: 'Phrase',
      title: 'While she is saying it',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'gan ddweud ei bod hi',
            english: 'saying that she is',
            note: 'gan plus a verb-noun means “while …ing”. dweud softens to ddweud.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'wrth amddiffyn',
            english: 'in defending',
            note: 'wrth plus a verb-noun is the same “while / in …ing”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'mynd i’r afael â',
            english: 'get to grips with',
            note: 'â aspirates the next word, and becomes ag before a vowel. The same â follows cydsefyll and ochri.',
          },
        },
        {
          type: 'tip',
          body: 'An adjective can take a possessive: yn danbaid ei hamddiffyniad, “fervent in her defence”. ei “her”, ein, and eu add h- before a vowel, and dros softens: dros gyfiawnder ein hachos, ein haelodau.',
        },
      ],
    },
    {
      id: 'compare',
      kicker: 'Grammar',
      title: 'Most prominent, and higher',
      blocks: [
        {
          type: 'rule',
          title: 'Change the stem, then add the ending',
          body: 'amlwg “prominent” changes shape once you compare it. The stem is amlyc-, so “more prominent” is amlycach and “most prominent” is amlycaf. uchel “high” is irregular: the comparative is uwch, and uwch softens the next word, so rheolwyr becomes reolwyr in uwch reolwyr, “senior managers”.',
          examples: [
            { welsh: 'amlycaf', english: 'foremost; most prominent' },
            {
              welsh: 'un o’r gwleidyddion amlycaf',
              english: 'one of the most prominent politicians',
            },
            { welsh: 'uwch reolwyr', english: 'senior managers' },
          ],
        },
        {
          type: 'tip',
          body: 'bu is the preterite of bod for a state that lasted: Bu’r AC, “the AM has been”.',
        },
      ],
    },
    {
      id: 'bynnag',
      kicker: 'Pattern',
      title: 'Whatever way we can',
      blocks: [
        {
          type: 'rule',
          title: 'bynnag after the question word',
          body: 'pryd bynnag, pwy bynnag, lle bynnag or ble bynnag, and beth bynnag mean whenever, whoever, wherever, and whatever. With a noun, pa comes first and bynnag follows, and pa softens: pa fath bynnag o swydd, where amdani is feminine to match swydd. yn before p becomes ym, so “in whatever way we can” is ym mha ffordd bynnag y gallwn.',
          examples: [
            { welsh: 'pryd bynnag', english: 'whenever' },
            {
              welsh: 'ym mha ffordd bynnag y gallwn',
              english: 'in whatever way we can',
            },
            {
              welsh: 'pa ysgol bynnag sy well ’da chi',
              english: 'whichever school you prefer',
            },
          ],
        },
        {
          type: 'tip',
          body: 'fodd bynnag means “however” and joins two sentences. It is modd “way”, already softened.',
        },
      ],
    },
    {
      id: 'until',
      kicker: 'Grammar',
      title: 'Until Christmas, until it happens',
      blocks: [
        {
          type: 'rule',
          title: 'tan before a noun, nes before a clause',
          body: 'tan is the preposition, so a noun follows it: tan Nadolig, “until Christmas”. A clause takes nes, then i, the subject, and a soft-mutated verb-noun, as in nes i’r Nadolig ddod. For “until that happens”, nes i hynny ddigwydd is the usual wording; the chapter also lists tan i hynny ddigwydd.',
          examples: [
            { welsh: 'tan Nadolig', english: 'until Christmas' },
            { welsh: 'nes i’r Nadolig ddod', english: 'until Christmas comes' },
            {
              welsh: 'nes i hynny ddigwydd',
              english: 'until that happens (more usual)',
            },
          ],
        },
        {
          type: 'tip',
          body: 'tra bod means “while”. bellach means “now” once things have changed; nawr and rŵan are the plain “now”. Tra bod pleidiau eraill bellach yn celu rhag…',
        },
      ],
    },
    {
      id: 'focus',
      kicker: 'Grammar',
      title: 'The stressed word comes first',
      blocks: [
        {
          type: 'rule',
          title: 'mai and Dim ond front the point',
          body: 'A clause that stresses ni opens with mai: mai ni yw’r blaid a fydd…. Dim ond fronts “only”, and the long subject comes before all: Dim ond arweinyddiaeth wleidyddol gref … all wneud hynny. arweinyddiaeth is feminine, so the adjectives soften, and cryf shows up as feminine cref, then gref.',
          examples: [
            {
              welsh: 'mai ni yw’r blaid a fydd…',
              english: 'that we are the party who will…',
            },
            {
              welsh: 'Dim ond … all wneud hynny',
              english: 'Only … can do that',
            },
            {
              welsh: 'arweinyddiaeth wleidyddol gref',
              english: 'strong political leadership',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'y bydd Cymru’n well ei byd',
            english: 'that things will be better for Wales',
            note: 'Literally “better her world”. ei is “her” because Cymru is feminine, though byd is masculine.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Dyma’r hyn y gall Plaid Cymru…',
            english: 'This is what Plaid Cymru can…',
            note: 'yr hyn is “what, the thing that”. heb fod is “without being”: heb softens bod.',
          },
        },
      ],
    },
    {
      id: 'aberdare',
      kicker: 'Culture',
      title: 'An AM from Aberdare',
      blocks: [
        {
          type: 'culture',
          title: 'Assembly, Aberdare, and a formal voice',
          body: 'AC is Aelod Cynulliad, an Assembly Member. dros softens the region: AC dros Ganol De Cymru is the member for South Wales Central, and sy’n hanu o Aberdâr says she hails from Aberdare. The tribute is literary: credaf is “I believe” (you say dw i’n credu), ein bod yn is “that we are” (bod ni’n), sydd gennym is “which we have” (sy gynnon ni), and cyfaill is the formal word for friend.',
        },
        {
          type: 'say',
          line: {
            welsh: 'byddem',
            english: 'we would be; we used to be',
            note: 'Literary. Spoken bydden ni. “They would” is byddent, spoken bydden nhw.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Does arno ddim ofn',
            english: 'He is not afraid',
            note: 'Spoken. Literary: Nid oes arno ofn. Fear sits on the person: mae ofn arno.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which form fits?',
      blocks: [
        {
          type: 'check',
          prompt: 'You want “one of the most prominent politicians”. Which word is the superlative?',
          answer: 'amlycaf',
          options: ['amlwg', 'amlycach', 'amlycaf'],
        },
        {
          type: 'check',
          prompt: 'You are waiting for Christmas to arrive. Which phrase fits?',
          answer: 'nes i’r Nadolig ddod',
          options: [
            'tan Nadolig',
            'nes i’r Nadolig ddod',
            'nes i hynny ddigwydd',
          ],
        },
      ],
    },
  ],
}
