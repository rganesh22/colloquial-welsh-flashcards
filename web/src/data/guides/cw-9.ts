import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '9',
  intro:
    'How to say what already happened. You build the past tense, answer with Do or Naddo, and join events with when, before, and after.',
  steps: [
    {
      id: 'what-happened',
      kicker: 'Phrase',
      title: 'Ask what happened',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Be' ddigwyddodd?",
            english: 'What happened?',
            note: "be' is spoken beth, and the verb softens: digwyddodd becomes ddigwyddodd.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Be' nest ti?",
            english: 'What did you do? (familiar)',
            note: "With chi, ask Be' naethoch chi? Be' naeth hithau? turns the question to her.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Sa i'n gwybod",
            english: "I don't know",
            note: 'The colloquial shape of Dw i ddim yn gwybod. Gwela i means you understand.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Dos i ddweud wrth Gwilym am ddod â'r bisgedi fan hyn",
            english: 'Go and tell Gwilym to bring the biscuits here',
            note: "Tell someone with dweud wrth, and use am plus a verb-noun for the task. Wedes i 'thyn nhw ddoe uses the short form of wrthyn nhw.",
          },
        },
        {
          type: 'tip',
          body: "A person takes at and a place takes i: Dw i'n mynd at y meddyg, but Dw i'n mynd i'r feddygfa. A letter follows the same split, at a person and i a country.",
        },
      ],
    },
    {
      id: 'preterite',
      kicker: 'Grammar',
      title: 'The ending sits on the stem',
      blocks: [
        {
          type: 'rule',
          title: 'Stem, ending, pronoun',
          body: 'Add an ending to the stem, then the pronoun. The endings run -es, -est, -odd, -on, -och, -on, so gweld gives gweles i, gwelest ti, gwelodd e/hi, gwelon ni, gweloch chi, and gwelon nhw. After a stem in -l- or -d-, an extra -s- is common, and gwelsoch chi means the same as gweloch chi.',
          examples: [
            { welsh: 'gweles i', english: 'I saw' },
            { welsh: 'gwelodd e/hi', english: 'he/she saw' },
            { welsh: 'gwelsoch chi', english: 'you saw (with -s-)' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "Welest ti'r ffilm neithiwr? — Do",
            english: 'Did you see the film last night? — Yes',
            note: 'Do is yes after any past yes/no question, for every person.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Glywsoch chi'r sŵn 'na? — Naddo",
            english: 'Did you hear that noise? — No',
            note: 'Naddo is the past no. The question softens clywed to Glywsoch.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Ddaethoch chi ddim yn ôl gyda'ch gilydd",
            english: "You didn't come back together",
            note: 'A negative past softens the verb and adds ddim.',
          },
        },
        {
          type: 'tip',
          body: "fe marks a plain past statement and softens the verb: Fe fwydes i'r gath am hanner awr wedi wyth. On'do? tags a past statement for any person, and yntefê? is a general isn’t it?",
        },
      ],
    },
    {
      id: 'irregular',
      kicker: 'Pattern',
      title: 'Go, do, come, and get',
      blocks: [
        {
          type: 'rule',
          title: 'One outline, four verbs',
          body: 'mynd, gwneud, dod, and cael do not take the regular endings. They share one outline: a short form for i and familiar ti, a separate word for e and hi, then -on ni, -och chi, and -on nhw. Only the opening changes: es i is I went, nes i is I did, des i is I came, and ces i is I got.',
          examples: [
            { welsh: 'Aethon ni i Ffrainc', english: 'We went to France' },
            { welsh: 'naeth e/hi', english: 'he/she did' },
            { welsh: 'daeth e/hi', english: 'he/she came' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Fuoch chi yn Harlech erioed?',
            english: 'Have you ever been to Harlech?',
            note: 'This is bod for a visit you have come back from. erioed here means ever.',
          },
        },
        {
          type: 'tip',
          body: "This lesson’s cael is caeth e/hi and caethon ni; cafodd e/hi and cawson ni are regional. Had not uses heb plus a verb-noun: O'n i heb gael hi yn ôl.",
        },
      ],
    },
    {
      id: 'when',
      kicker: 'Grammar',
      title: 'Pryd asks, pan tells',
      blocks: [
        {
          type: 'rule',
          title: 'No past tense after before or after',
          body: "Pryd is only a question word, as in Pryd mae'r bws nesa'n dod? Inside a statement, when is pan, and the verb after it softens, so when the bus came is Pan ddaeth y bws. Before, after, and as take no preterite: cyn, ar ôl, and wrth are followed by i, a person, and a soft-mutated verb-noun, and the other clause carries the past tense.",
          examples: [
            { welsh: 'Pan ddaeth y bws…', english: 'When the bus came…' },
            {
              welsh: 'ar ôl i Gwenith gyrraedd',
              english: 'after Gwenith arrived',
            },
            {
              welsh: "Lapies i'r anrheg cyn i Lisa ddod adre",
              english: 'I wrapped the present before Lisa came home',
            },
          ],
        },
        {
          type: 'tip',
          body: "The other clause keeps the past tense: O'n i mas pan ffoniest ti. Wrth i Fifi fynd allan, ddaeth Katy i mewn is as Fifi went out, Katy came in.",
        },
      ],
    },
    {
      id: 'mo',
      kicker: 'Pattern',
      title: 'A particular thing takes mo',
      blocks: [
        {
          type: 'rule',
          title: 'ddim o contracts to mo',
          body: 'ddim is for an object that is not a particular one: Weles i ddim rhaglen deledu neithiwr means you did not see a programme. When the object is specific, with the definite article, a name, a pronoun, or a possessive, ddim o contracts to mo. A name is specific, so Weles i mo Dylan means you did not see Dylan, while ddim Dylan would mean you did not see anyone of that name.',
          examples: [
            {
              welsh: "Weles i mo'r rhaglen deledu neithiwr",
              english: "I didn't see the television programme last night",
            },
            { welsh: 'Weles i mo Dylan', english: "I didn't see Dylan" },
            { welsh: "Weles i mo'ch brawd", english: "I didn't see your brother" },
          ],
        },
        {
          type: 'tip',
          body: "Personal mo often drops -ho-: Naddo, weles i moni means no, I didn’t see it. ar plus a soft mutation names a state: ar agor, ar gau, ar gael, ar frys, ar glo, ar dân, ar goll, and ar werth.",
        },
      ],
    },
    {
      id: 'papers',
      kicker: 'Culture',
      title: 'A paper for a small patch',
      blocks: [
        {
          type: 'culture',
          title: 'Monthly, and written by volunteers',
          body: 'A papur bro is a monthly paper written by volunteers for a very small local readership. Y Dinesydd, The Citizen, was the first, for Cardiff in 1973. Golwg is a weekly magazine of Welsh current affairs, and Y Byd is presented here as the first daily newspaper in Welsh.',
        },
        {
          type: 'say',
          line: {
            welsh: 'San Steffan',
            english: 'Westminster',
            note: "The Houses of Parliament. Tŷ'r Cyffredin is the House of Commons.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "t'wel",
            english: "y'see (familiar)",
            note: "Southern. The chi-form is ch'wel.",
          },
        },
        {
          type: 'tip',
          body: "A key is allwedd in the south and agoriad in the north. Southern say is gweud; elsewhere it is dweud, often pronounced deud, and the past is still wedes i: Be' wedsoch chi?",
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which sentence fits?',
      blocks: [
        {
          type: 'check',
          prompt: "Welest ti'r ffilm neithiwr? You did see it. What do you answer?",
          answer: 'Do',
          options: ['Do', 'Naddo', 'Nag oedd'],
        },
        {
          type: 'check',
          prompt: 'Which phrase means “after Gwenith arrived”?',
          answer: 'ar ôl i Gwenith gyrraedd',
          options: [
            'Pan ddaeth y bws…',
            'ar ôl i Gwenith gyrraedd',
            "Pryd mae'r bws nesa'n dod?",
          ],
        },
      ],
    },
  ],
}
