import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '25',
  intro:
    'How a magazine health feature talks about depression, a GP, and getting help. Several patterns belong to written Welsh.',
  steps: [
    {
      id: 'names',
      kicker: 'Phrase',
      title: 'The illness and the doctor',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'iselder ysbryd',
            english: 'depression (lit. lowness of spirit)',
            note: 'Often just iselder. The word can be used too readily.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'meddyg teulu',
            english: 'GP; family doctor',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'syrjeri',
            english: "surgery (doctor's)",
            note: 'A common loanword. The Welsh term is meddygfa.',
          },
        },
        {
          type: 'tip',
          body: 'gwir iselder ysbryd means real depression. In front of a noun, gwir means real or true, and it soft-mutates the next word.',
        },
      ],
    },
    {
      id: 'depressed',
      kicker: 'Grammar',
      title: 'Depressed is low in spirit',
      blocks: [
        {
          type: 'rule',
          title: 'isel + possessive + ysbryd',
          body: 'iselder names the condition. To say that someone is depressed, use isel, then a possessive that matches the person, then ysbryd. His and her both use ei, but her adds h- before the vowel, and speech often shortens fy “my” to ’n.',
          examples: [
            { welsh: "Mae e'n isel ei ysbryd", english: "He's depressed" },
            { welsh: "Mae hi'n isel ei hysbryd", english: "She's depressed" },
            {
              welsh: "O'n i'n teimlo braidd yn isel 'n ysbryd",
              english: 'I was feeling a bit down',
            },
          ],
        },
      ],
    },
    {
      id: 'cause',
      kicker: 'Pattern',
      title: 'Cause someone, or persuade them',
      blocks: [
        {
          type: 'rule',
          title: 'peri i + person + verb-noun',
          body: 'peri means you cause a person to do something. Put i after it, then the person, then a soft-mutated verb-noun. achosi is the plain verb “cause”, and it does not take that person-plus-verb chain.',
          examples: [
            {
              welsh: 'yn peri i berson deimlo’n isel',
              english: 'causes a person to feel low',
            },
            { welsh: 'achosi', english: 'cause (v)' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'dwyn perswâd ar',
            english: 'persuade (lit. bring persuasion on)',
            note: 'ar soft-mutates. This is preferred to the loan perswadio. darbwyllo is the native verb, and argyhoeddi means convince.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'nes bod cyfaill yn dwyn perswâd arnynt',
            english: 'until a friend persuades them',
            note: 'nes bod means until plus a clause. arnynt is literary for arnyn nhw. cyfaill is a more formal friend than ffrind.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Fe ddygodd e gar',
            english: 'He stole a car',
            note: 'On its own, dwyn means steal. The past stem is dyg-, fe soft-mutates it, and the object car is soft-mutated too.',
          },
        },
      ],
    },
    {
      id: 'frames',
      kicker: 'Pattern',
      title: 'Small words that change the next word',
      blocks: [
        {
          type: 'rule',
          title: 'Soft mutation, and one aspirate',
          body: 'hynod soft-mutates the adjective it strengthens, so common becomes gyffredin. gwir in front of a noun means real and soft-mutates as well, though you cannot see a change on iselder. o soft-mutates after y rhan fwyaf o and tueddol o, while na in yn hytrach na takes the aspirate mutation.',
          examples: [
            { welsh: 'yn hynod gyffredin', english: 'awfully common' },
            { welsh: 'gwir iselder ysbryd', english: 'real depression' },
            {
              welsh: 'yn hytrach na’i anwybyddu',
              english: 'rather than ignore it',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'y neges a ganlyn',
            english: 'the following message',
            note: 'a ganlyn is a verb, “which follows”, and a soft-mutates. The true adjective is canlynol: y neges ganlynol after feminine neges.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn dueddol o fod yn waeth',
            english: 'tend to be worse',
            note: 'tueddol o plus a soft-mutated verb-noun is the usual shape here, more than the verb tueddu.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y rhan fwyaf o',
            english: 'most (+ noun)',
            note: 'Literally the greater part of. o soft-mutates: y rhan fwyaf o bobl. Speech often says y rhan fwya.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Gall fod yn anodd',
            english: 'It can be difficult',
            note: 'No word for “it”. gall soft-mutates bod to fod.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'i ryw raddau',
            english: 'to some degree; to some extent',
            note: 'graddau is plural, from gradd. The same plural is in i raddau helaeth, to a great extent.',
          },
        },
        {
          type: 'tip',
          body: 'A long phrase can be the subject, and the soft mutation on the next verb-noun marks the join: Gall mynd am dro bob diwrnod liniaru…. am has already turned tro into dro. hunan- and ail- soft-mutate too (hunan-ddisgyblu, ailddechrau), wrth soft-mutates (ynghlwm wrth gyflyrau iechyd meddwl), and â takes the aspirate mutation, spelled ag before a vowel.',
        },
      ],
    },
    {
      id: 'advise',
      kicker: 'Phrase',
      title: 'What you ask, and what you advise',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Beth sy'n bod?",
            english: "What's wrong?; What's the matter?",
            note: "Milder than o'i le, which means something has actually gone wrong.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "bod rhywbeth o'i le",
            english: 'that something is wrong',
            note: 'ei soft-mutates lle to le. Literally, out of its place.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Os nad yw'r symptomau'n ddifrifol",
            english: "If the symptoms aren't serious",
            note: "After os, use nad and leave ddim out. On its own, Dyw'r symptomau ddim… is the ordinary negative. Some regions say os nad ydy’r….",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'dylid',
            english: 'one should',
            note: 'dylid gweld meddyg teulu. gellid is one could. Other -id forms are for writing: a ddefnyddid means that used to be used. defnyddiwyd, in -wyd, is common in print and some speech.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ceisiwch drafod y mater yn agored',
            english: 'try and discuss the matter openly',
            note: 'The command soft-mutates trafod to drafod.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Peidiwch â dioddef mewn distawrwydd',
            english: 'Don’t suffer in silence',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'gan ei sicrhau',
            english: 'while assuring him/her',
            note: 'gan plus a verb-noun is an action alongside. ei marks the object. gan obeithio y byddant yn diflannu uses the same gan, and y means that.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'mynd am dro',
            english: 'go for a walk',
            note: 'Pair it with ymarfer corff, physical exercise, and erbyn hyn, these days. ar ffurf cwnsela uses the verb-noun as a noun, in the form of counselling.',
          },
        },
        {
          type: 'tip',
          body: "amau usually means doubt. Here it means suspect: Os ydych yn amau…. er mai introduces although before something placed at the front: er mai'r tueddiad cyffredinol ydy bod….",
        },
      ],
    },
    {
      id: 'wawr',
      kicker: 'Culture',
      title: 'The magazine behind the feature',
      blocks: [
        {
          type: 'culture',
          title: 'Y Wawr and Merched y Wawr',
          body: 'materion meddygol is a regular feature in Y Wawr, the magazine of Merched y Wawr, the Mudiad Cenedlaethol i Ferched Cymru. The same pages carry current affairs, literature, tasty recipes, fashion and fitness, and competitions with prizes. The article’s Welsh is written: byddant stands where speech says byddan nhw.',
        },
        {
          type: 'say',
          line: {
            welsh: 'byddant',
            english: 'they will be (literary)',
            note: 'Literary for byddan nhw, just as arnynt is literary for arnyn nhw.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Therapi Ymddygiad Gwybyddol',
            english: 'Cognitive Behavioural Therapy',
            note: 'yn debyg i soft-mutates: yn debyg i driniaeth cwnsela, similar to counselling treatment.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'anarferol o drist',
            english: 'unusually sad',
            note: 'o soft-mutates the adjective. diffyg egni, lack of energy, needs no word for of. The plural of anhawster drops the h: anawsterau.',
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
          prompt: 'How do you say “She’s depressed”?',
          answer: "Mae hi'n isel ei hysbryd",
          options: [
            "Mae hi'n isel ei ysbryd",
            "Mae hi'n isel ei hysbryd",
            "Mae hi'n iselder ysbryd",
          ],
        },
        {
          type: 'check',
          prompt: 'You need “if the symptoms aren’t serious”. Which shape is the one to use?',
          answer: "Os nad yw'r symptomau'n ddifrifol",
          options: [
            "Os nad yw'r symptomau'n ddifrifol",
            "Dyw'r symptomau ddim…",
            'Os dyw’r… ddim',
          ],
        },
      ],
    },
  ],
}
