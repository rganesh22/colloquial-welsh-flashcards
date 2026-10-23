import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '12',
  intro:
    'How to say what you have done, and what you had already done. Then the news, how often something happens, and where Welsh is everyday speech.',
  steps: [
    {
      id: 'news',
      kicker: 'Phrase',
      title: 'Ask if they heard the news',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Glywest ti'r newyddion?",
            english: 'Did you hear the news?',
            note: 'Preterite of clywed. The question form softens the verb.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Naddo',
            english: 'No (past-tense answer)',
            note: 'The yes that matches a preterite question is Do.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Be' sy wedi digwydd?",
            english: "What's happened?",
          },
        },
        {
          type: 'tip',
          body: 'newydd means “have just”, and the verb-noun softens after it: Dw i newydd weud.',
        },
      ],
    },
    {
      id: 'perfect',
      kicker: 'Grammar',
      title: 'wedi means you have done it',
      blocks: [
        {
          type: 'rule',
          title: 'Swap yn for wedi',
          body: 'The present uses yn plus a verb-noun, so Dw i\'n gweld means “I see”. Put wedi in that slot and the sentence means “have done”; the verb-noun stays in its basic form. In speech, wedi often shortens to \'di.',
          examples: [
            { welsh: 'Dw i wedi gweld', english: 'I have seen' },
            { welsh: 'Mae Lloegr wedi colli', english: 'England have lost' },
            {
              welsh: "Dw i 'di deud 'that ti unwaith yn barod",
              english: "I've told you once already",
            },
          ],
        },
        {
          type: 'tip',
          body: 'heb plus a verb-noun, with a soft mutation, is the “not yet” form of the perfect and the pluperfect. Maen nhw heb dalu matches Dydyn nhw ddim wedi talu, and Oedd hi heb llofnodi\'r siec matches Doedd hi ddim wedi llofnodi\'r siec.',
        },
      ],
    },
    {
      id: 'had-been',
      kicker: 'Pattern',
      title: 'Had done, and have been',
      blocks: [
        {
          type: 'rule',
          title: 'Imperfect of bod, plus wedi',
          body: 'The pluperfect is the imperfect of bod with wedi in place of yn. Dw i wedi bod yn sâl is “I have been ill”, and O\'n i wedi bod yn sâl is “I had been ill”. To say you have been doing something, add yn and a verb-noun after bod.',
          examples: [
            {
              welsh: "O'n i wedi rhedeg lawr y stryd",
              english: 'I had run down the road',
            },
            { welsh: "O'n i wedi bod yn sâl", english: 'I had been ill' },
            {
              welsh: "Dan ni wedi bod yn ymweld â fo'n fwy cyson yn ddiweddar",
              english: 'We have been visiting him more regularly of late',
            },
          ],
        },
      ],
    },
    {
      id: 'preps',
      kicker: 'Pattern',
      title: 'The pronoun sits in the middle',
      blocks: [
        {
          type: 'rule',
          title: 'Compound prepositions',
          body: 'ar gyfer, o flaen, and ar ôl are two-part prepositions. A following noun keeps its basic form, as in ar gyfer y parti. With a pronoun, the possessive sits between the two parts and mutates the second word.',
          examples: [
            { welsh: 'ar ei chyfer hi', english: 'for her' },
            { welsh: "o'i flaen e", english: 'in front of him' },
            { welsh: 'ar ei hôl hi', english: 'after her' },
          ],
        },
        {
          type: 'tip',
          body: 'heb, dros, and drwy take an ending instead: hebdda i is “without me”, drostat ti is “for you”, and drwyddoch chi is “through you”.',
        },
      ],
    },
    {
      id: 'still',
      kicker: 'Phrase',
      title: 'Still, and how many times',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Mae Siân yn dal i aros am dacsi',
            english: 'Siân is still waiting for a taxi',
            note: 'The longer form is yn dal i fod yn aros. After i, the verb softens: yn dal i redeg.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Mae'r sefyllfa (yn) dal yn ddifrifol",
            english: 'The situation is still serious',
            note: 'With an adjective, the short pattern is (yn) dal yn. yn softens the adjective.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Dw i wedi bod fan hyn ddwywaith yn barod heddiw",
            english: "I've been here twice already today",
            note: 'unwaith is once. gwaith is feminine in this sense, so “twice” is dwywaith, usually softened to ddwywaith. yn barod here is “already”.',
          },
        },
        {
          type: 'tip',
          body: 'With a present of bod, yn arfer means “usually”: Mae\'r ddwy \'na\'n arfer aros yn hwyrach na\'r lleill. With the imperfect, the same pattern means “used to”.',
        },
      ],
    },
    {
      id: 'heartlands',
      kicker: 'Culture',
      title: 'The Welsh-speaking heartlands',
      blocks: [
        {
          type: 'culture',
          title: 'Schools, centres, and the balance',
          body: 'y Fro Gymraeg is the Welsh-speaking heartlands. twf yr iaith goes with schools that teach trwy gyfrwng y Gymraeg, and with centres that hybu\'r Gymraeg fel ail iaith i oedolion. That future is still yn y fantol.',
        },
        {
          type: 'say',
          line: {
            welsh: 'ysgol feithrin',
            english: 'Welsh-language nursery school',
            note: 'ysgol is feminine, so meithrin softens to feithrin. The plural ysgolion meithrin stays unmutated. ysgol gynradd works the same way.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Well i ti sefyll ar bwys mamgu',
            english: "You'd better stand by grandma",
            note: 'ar bwys is southern for “by; near”. mamgu is the southern word for grandmother; the north says nain.',
          },
        },
        {
          type: 'tip',
          body: 'Nadolig is often Dolig in speech. teisen is the southern word for cake; the north says cacen.',
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Have you got it?',
      blocks: [
        {
          type: 'check',
          prompt: 'Which sentence means “I have seen”?',
          answer: 'Dw i wedi gweld',
          options: ["Dw i'n gweld", 'Dw i wedi gweld', "O'n i wedi gweld"],
        },
        {
          type: 'check',
          prompt: 'How do you say “for her”?',
          answer: 'ar ei chyfer hi',
          options: ['ar ei gyfer e', 'ar ei chyfer hi', 'ar gyfer hi'],
        },
      ],
    },
  ],
}
