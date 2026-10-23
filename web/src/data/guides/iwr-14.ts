import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '14',
  intro:
    'Names for Welsh nursery groups, and the patterns for fluency, because, and within. The chapter follows a voluntary nursery movement in Pembrokeshire.',
  steps: [
    {
      id: 'groups',
      kicker: 'Phrase',
      title: 'Nursery, group, and you-and-me',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Mudiad Meithrin',
            english: 'the Welsh nursery schools movement',
            note: 'Founded in 1971 as Mudiad Ysgolion Meithrin. Gynt means formerly: Mudiad Ysgolion Meithrin gynt.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ysgol feithrin',
            english: 'nursery school',
            note: 'Ysgol is feminine, so meithrin softens to feithrin. The plural is ysgolion meithrin.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'cylch Ti a Fi',
            english: 'parent-and-toddler group (lit. You and Me group)',
            note: 'Parents and carers use Welsh with each other and the children. A cylch meithrin is a nursery group; plural cylchoedd.',
          },
        },
        {
          type: 'tip',
          body: 'The same softening gives ysgol gynradd, a primary school. Uwchradd means secondary.',
        },
      ],
    },
    {
      id: 'fluent',
      kicker: 'Grammar',
      title: 'Fluent in Welsh uses a possessive',
      blocks: [
        {
          type: 'rule',
          title: 'rhugl plus eu or ei',
          body: 'Rhugl sits with a possessive, so someone is fluent as to their Welsh, and the possessive matches the person. His ei softens Cymraeg to Gymraeg. Her ei aspirates it to Chymraeg.',
          examples: [
            {
              welsh: "maen nhw'n rhugl eu Cymraeg",
              english: 'they are fluent in Welsh',
            },
            {
              welsh: "Mae e'n rhugl ei Gymraeg",
              english: "He's fluent in Welsh",
            },
            {
              welsh: "Mae hi'n rhugl ei Chymraeg",
              english: "She's fluent in Welsh",
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'o fewn dim o dro',
            english: 'in no time',
            note: 'Rhugl eu Cymraeg o fewn dim o dro — fluent in Welsh in no time.',
          },
        },
      ],
    },
    {
      id: 'because',
      kicker: 'Pattern',
      title: 'Because a clause, or because of a noun',
      blocks: [
        {
          type: 'rule',
          title: 'achos, o achos, oherwydd',
          body: 'Achos takes a that-clause, and bod softens to fod after it. A noun reason takes o achos. Oherwydd is slightly more formal and works with a clause or a noun.',
          examples: [
            {
              welsh: 'achos fod e wedi cael damwain',
              english: 'because he had an accident',
            },
            { welsh: 'o achos y ddamwain', english: 'because of the accident' },
            { welsh: 'o achos hyn', english: 'because of this' },
          ],
        },
        {
          type: 'tip',
          body: 'You can also say oherwydd fod e wedi cael damwain or oherwydd y ddamwain. Damwain, cyfraith, and trefn are feminine, so y softens them: y ddamwain, o dan y gyfraith, y drefn bresennol.',
        },
      ],
    },
    {
      id: 'find',
      kicker: 'Phrase',
      title: 'Find it, for now, in accordance',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'dod o hyd i',
            english: 'find',
            note: "I softens the next word: mi fyddai'n rhaid i ni ddod o hyd i dir, we'd have to find land. Canfod is more formal.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Lle ddaethoch chi o hyd iddyn nhw?',
            english: 'Where did you find them?',
            note: 'I becomes iddyn nhw with a pronoun. Lle softens daethoch to ddaethoch.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'swyddi dros dro a swyddi parhaol',
            english: 'temporary jobs and permanent jobs',
            note: 'Dros softens tro to dro. Often an adjective: ystafell dros dro, a temporary room. Parhaol is permanent.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn unol â',
            english: 'in accordance with',
            note: "Â aspirates the next word, and ag is used before a vowel: yn unol â rheolau'r Cynulliad. Gyda aspirates too: gyda chanlyniadau rhagorol.",
          },
        },
      ],
    },
    {
      id: 'within',
      kicker: 'Pattern',
      title: 'Time, number, and a grasp',
      blocks: [
        {
          type: 'rule',
          title: 'o fewn or tu fewn i',
          body: 'O fewn is for time, for how soon something happens. Tu fewn i is for a physical place, and i softens the next word. O fewn dim o dro means in no time.',
          examples: [
            { welsh: 'o fewn wythnos', english: 'within a week' },
            { welsh: "tu fewn i'r tŷ", english: 'within the house' },
            { welsh: 'o fewn dim o dro', english: 'in no time' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'sawl awgrym',
            english: 'various suggestions; a number of suggestions',
            note: 'Sawl means several or a number of, and the noun stays singular.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'cael crap ar',
            english: 'get a grasp of',
            note: "Ar softens the next word: maen nhw'n cael crap ar y Gymraeg. The same ar is in manteisio ar wasanaethau, yn dal i ddibynnu ar wirfoddolwyr, and ar droed.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'i feddwl eu bod nhw…',
            english: 'when you think that they…',
            note: 'Also o feddwl bod nhw…, with softening after o, and o ystyried bod nhw…, considering that they… The chapter pairs them with mor ifanc, so young.',
          },
        },
      ],
    },
    {
      id: 'movement',
      kicker: 'Culture',
      title: 'A voluntary nursery movement',
      blocks: [
        {
          type: 'culture',
          title: 'Mudiad Meithrin',
          body: 'Founded in 1971 as Mudiad Ysgolion Meithrin, Mudiad Meithrin is a voluntary organisation of Welsh-medium nursery schools and parent-and-toddler groups. Estyn is the government-funded agency that inspects schools in Wales. Y Cyfnod Sylfaenol is the Foundation Phase, the early-years curriculum.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Sir Benfro',
            english: 'Pembrokeshire',
            note: 'Penfro softens to Benfro after sir: Cyngor Sir Benfro, Pembrokeshire County Council. Abergwaun is Fishguard and Wdig is Goodwick.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn y bôn',
            english: 'basically',
            note: 'A filler, in the same way English uses basically.',
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
          prompt: 'How do you say “She’s fluent in Welsh”?',
          answer: "Mae hi'n rhugl ei Chymraeg",
          options: [
            "Mae hi'n rhugl ei Chymraeg",
            "Mae hi'n rhugl ei Gymraeg",
            "Mae hi'n rhugl eu Cymraeg",
          ],
        },
        {
          type: 'check',
          prompt: 'Which phrase means “within a week”?',
          answer: 'o fewn wythnos',
          options: ['o fewn wythnos', "tu fewn i'r tŷ", 'o fewn dim o dro'],
        },
      ],
    },
  ],
}
