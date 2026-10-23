import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '7',
  intro:
    'How to talk about the weather, what it was like, and what it will do. Weather is hi, and the short forms of was and will be do the rest.',
  steps: [
    {
      id: 'weather',
      kicker: 'Phrase',
      title: 'Ask about the weather',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Sut oedd y tywydd?',
            english: 'How was the weather?',
            note: 'oedd is was.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Mae'n braf heddiw, on'd yw hi?",
            english: "It's fine today, isn't it?",
            note: 'braf does not mutate.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Wi ddim yn mynd 'to",
            english: "I'm not going again",
            note: "Southern wi. 'to is eto, again.",
          },
        },
        {
          type: 'tip',
          body: 'Weather takes hi. After yn, poeth softens to boeth, and braf stays braf. Rain is bwrw glaw, literally cast rain, and glawio means the same.',
        },
      ],
    },
    {
      id: 'imperfect',
      kicker: 'Grammar',
      title: 'Was is short in speech',
      blocks: [
        {
          type: 'rule',
          title: "o'n i, oedd hi",
          body: "Spoken Welsh shortens the written imperfect. o'n i is I was, o't ti is you were, and oedd e or oedd hi is he, she, or it was. A question is that same form, told apart by intonation, and was not adds ddim after the person, with an optional d in front: (d)o'n i ddim.",
          examples: [
            {
              welsh: "O't ti yn y dre neithiwr?",
              english: 'Were you in town last night?',
            },
            { welsh: "O'n i'n gwybod", english: 'I knew' },
            { welsh: "Do'n nhw ddim gartre", english: 'They were not at home' },
          ],
        },
        {
          type: 'tip',
          body: "Writing puts the longer start back: roeddwn i, roedd e/hi, and roedden chi. Knowing and thinking use this was-shape too: O'n i'n meddwl hynny is I thought so, and O'n i'n nabod e flynyddoedd yn ôl is I knew him years ago.",
        },
      ],
    },
    {
      id: 'answers',
      kicker: 'Pattern',
      title: 'Yes and no repeat the verb',
      blocks: [
        {
          type: 'rule',
          title: 'Echo the question',
          body: "Answer by saying the verb again and leaving the pronoun off. Oedd Julie'n grac? comes back as Oedd, and a question to you comes back as Oeddwn. No puts Nag in front, Nag oedd (hi) or Nag o'n (i), and a wasn't-it tag is on'd oedd (hi).",
          examples: [
            {
              welsh: "O'ch chi yn y dre neithiwr? — Oeddwn",
              english: 'Were you in town last night? — Yes, I was',
            },
            {
              welsh: "Oedd Julie'n grac? — Oedd",
              english: 'Was Julie cross? — Yes, she was',
            },
            { welsh: 'Nag oedd (hi)', english: "No (she/he/it wasn't)" },
          ],
        },
      ],
    },
    {
      id: 'future',
      kicker: 'Grammar',
      title: 'Will be softens the b',
      blocks: [
        {
          type: 'rule',
          title: 'bydd and fydd',
          body: 'The future of bod is bydd: bydda i, bydd hi, byddan nhw. In speech the b often softens to f even in a statement, and a question uses that soft form, fydd hi?, told apart by intonation. Negatives are fydd hi ddim; yes answers drop the soft mutation, so it will be comes back as Bydd, and no is Na fydd.',
          examples: [
            {
              welsh: "Bydd hi'n bwrw glaw erbyn amser cinio",
              english: 'It will be raining by lunchtime',
            },
            {
              welsh: "Bydd hi'n oer yfory, ond yn sych",
              english: 'It will be cold tomorrow, but dry',
            },
            {
              welsh: "Fydd hi'n oer heno, on' bydd (hi)?",
              english: "It will be cold tonight, won't it?",
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Fe fydd Sioned yn mynd',
            english: 'Sioned will go / be going',
            note: "fe marks a positive statement in the south and centre. The north uses mi: Mi fydd hi'n parhau'n sych ac yn heulog heddiw. Questions and negatives leave it out.",
          },
        },
        {
          type: 'tip',
          body: "Na i plus a verb-noun is a promise: Na i sgrifennu atat ti ar ôl y Nadolig. Bydda i'n sgrifennu atat ti ar ôl y Nadolig only says the writing will happen.",
        },
      ],
    },
    {
      id: 'times',
      kicker: 'Pattern',
      title: 'Last year is its own word',
      blocks: [
        {
          type: 'rule',
          title: "diwetha, 'ma, nesa",
          body: "Weeks and months put the time-word after the noun: wythnos diwetha, mis nesa, mis 'ma. Years stand apart: llynedd is last year, eleni is this year, and next year is flwyddyn nesa, already softened. On a weekday Dydd softens to Ddydd Mawrth, and at night you drop Dydd and soften the name: Nos Fawrth, Nos Lun.",
          examples: [
            { welsh: 'llynedd', english: 'last year' },
            { welsh: 'eleni', english: 'this year' },
            { welsh: 'flwyddyn nesa', english: 'next year' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'bore fory',
            english: 'tomorrow morning',
            note: "fory is yfory after bore. This morning is bore 'ma, and yesterday morning is bore ddoe.",
          },
        },
      ],
    },
    {
      id: 'places',
      kicker: 'Culture',
      title: 'The names still mean something',
      blocks: [
        {
          type: 'culture',
          title: 'Reading the map',
          body: 'Welsh place names in this chapter still say what the place is. Caergybi, Holyhead, is Cybi’s fortress: caer is a fortified settlement, originally Roman, and the same element as English -chester, and Abergwaun is Fishguard. Aberteifi and Abertawe have their own English names, Cardigan and Swansea, and Caerdydd is Cardiff taken from the Welsh.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Caergybi',
            english: 'Holyhead',
            note: 'On Anglesey. After yn the name takes a nasal: yng Nghaergybi.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Betws-y-Coed',
            english: 'Betws-y-Coed',
            note: 'betws, a prayer-house, plus y coed, the woods.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Noson Guto Ffowc',
            english: 'Bonfire Night',
            note: 'Guy Fawkes Night.',
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
          prompt: 'O\'ch chi yn y dre neithiwr? How do you say "Yes, I was"?',
          answer: 'Oeddwn',
          options: ['Oeddwn', 'Oedd', 'Bydda(f)'],
        },
        {
          type: 'check',
          prompt: 'Which line means "It will be cold tonight, won\'t it?"',
          answer: "Fydd hi'n oer heno, on' bydd (hi)?",
          options: [
            "Fydd hi'n oer heno, on' bydd (hi)?",
            "Oedd hi'n oer iawn bore 'ma, on'd oedd (hi)?",
            "Bydd hi'n oer yfory, ond yn sych",
          ],
        },
      ],
    },
  ],
}
