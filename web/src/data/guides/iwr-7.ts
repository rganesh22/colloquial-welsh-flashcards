import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '7',
  intro:
    'Heledd Fychan’s blog Pendroni, spelt as the north speaks, in the middle of an election. Compare, set a deadline, and grade how much you mean.',
  steps: [
    {
      id: 'than',
      kicker: 'Grammar',
      title: 'Than aspirates the next word',
      blocks: [
        {
          type: 'rule',
          title: 'na after a comparative',
          body: 'After a comparative, na means “than” and aspirates the next consonant. Before a vowel, that word is nag. mwy, llai, gwell, gwaeth, uwch, and is are irregular, so you learn them whole.',
          examples: [
            { welsh: 'Llai na wythnos i fynd!', english: 'Less than a week to go!' },
            { welsh: 'yn hytrach na chroes', english: 'rather than a cross' },
            { welsh: 'Cymru well', english: 'a better Wales' },
          ],
        },
        {
          type: 'tip',
          body: 'Before a vowel, write nag, as in nag wythnos. The same aspirate follows â, which becomes ag before a vowel: ynghyd ag un sedd rhestr. croes is feminine, so two crosses is dwy groes.',
        },
      ],
    },
    {
      id: 'erbyn',
      kicker: 'Pattern',
      title: 'erbyn sets the deadline',
      blocks: [
        {
          type: 'rule',
          title: 'erbyn and yn erbyn',
          body: 'erbyn marks a deadline: a clock time, a date, or the moment someone arrives. For that last shape, use erbyn i, then the person, then a soft-mutated verb-noun. yn erbyn means “against”, and a pronoun splits it, with h before the vowel after ei, “her”.',
          examples: [
            { welsh: 'erbyn canol dydd', english: 'by midday' },
            { welsh: 'erbyn iddyn nhw gyrraedd', english: 'by the time they arrive' },
            { welsh: 'yn ei herbyn (hi)', english: 'against her' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'yn erbyn y llywodraeth',
            english: 'against the government',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Peidiwch torri ar 'nhraws i!",
            english: "Don't interrupt me!",
            note: 'ar draws splits the same way: ar eich traws chi. ’nhraws is fy nhraws, with fy dropped.',
          },
        },
      ],
    },
    {
      id: 'this-that',
      kicker: 'Grammar',
      title: 'This and that with no noun',
      blocks: [
        {
          type: 'rule',
          title: 'Gender, or the situation',
          body: 'When “this” or “that” has no noun beside it, gender picks the word. A thing is hwn or hon for “this”, and hwnnw or honno for “that”. An idea or a situation is hyn or hynny.',
          examples: [
            { welsh: 'mae hon wedi bod', english: 'this has been' },
            { welsh: 'Mae hyn yn ormod!', english: 'This is too much!' },
            { welsh: "Mae hynny'n anhygoel!", english: "That's unbelievable!" },
          ],
        },
        {
          type: 'tip',
          body: 'hon is feminine here because it points to ymgyrch, “campaign”. Spoken Welsh also uses hwnna, honna, and hynna.',
        },
      ],
    },
    {
      id: 'how-far',
      kicker: 'Pattern',
      title: 'How far you push an adjective',
      blocks: [
        {
          type: 'rule',
          title: 'In front with o, or after the word',
          body: 'Some graders stand in front of an adjective and link with o, which softens what follows. hynod can soften the next word directly, or take that same o. dros ben and tu hwnt come after the adjective, and both mean “extremely”.',
          examples: [
            { welsh: 'eithriadol o lwcus', english: 'extraordinarily lucky' },
            { welsh: 'hynod ddiolchgar', english: 'awfully grateful' },
            { welsh: 'difyr dros ben', english: 'great fun' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'cymaint o etholwyr â phosib',
            english: 'as many voters as possible',
            note: 'cymaint and cynlleied take o. â aspirates, so posib becomes phosib.',
          },
        },
        {
          type: 'tip',
          body: 'unrhyw softens the noun that follows: unrhyw gymorth. Almost every house is ym mron i bob un tŷ: ym mron is yn with a nasal mutation, bron i softens the quantity, and pob un means every single.',
        },
      ],
    },
    {
      id: 'fixed-phrases',
      kicker: 'Phrase',
      title: 'Need, appear, and two times',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Da ni hefyd angen pobl',
            english: 'We also need people',
            note: 'angen and eisiau take no linking yn: Dw i angen …. A full yn is spoken emphasis: Dwi yn meddwl fod ….',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Dydi'r mwyafrif ddim i'w gweld yn deall",
            english: 'The majority do not appear to understand',
            note: 'Literally, they are not to be seen understanding. This is the natural “appear to”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y tro nesa',
            english: 'the next time',
            note: 'tro is one turn in a series: y tro cynta, y tro ola. gwaith counts: dwywaith, Faint o weithiau?',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "o'r herwydd",
            english: 'because of that; consequently',
            note: 'A fixed phrase, like o ran, “as regards”, and o gwbwl, “at all”. y cwbwl and y cyfan mean “the whole lot”.',
          },
        },
      ],
    },
    {
      id: 'northern-blog',
      kicker: 'Culture',
      title: 'A northern blog about the Assembly',
      blocks: [
        {
          type: 'culture',
          title: 'Pendroni',
          body: 'Pendroni, “ponder”, is the name of Heledd Fychan’s blog. She writes north Wales speech, with a final n dropped and unstressed e written as a: da ni, mi ddyla ni, mi fedra ni from medru, and mi fysa ni, “we would”. Cynulliad is the Welsh Assembly in one word, and an Aelod Cynulliad may stand in an etholaeth or hold a sedd rhestr, a list seat.',
        },
        {
          type: 'say',
          line: {
            welsh: 'ella wir y bydda i',
            english: 'perhaps indeed I will be',
            note: 'Northern ella, or hwyrach; standard efallai. It can take a that-clause. The text’s byddai is bydda i, and bo nhw is bod nhw spelt as said.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'be ddigwyddith',
            english: 'what will happen',
            note: 'be is beth. The verb softens because be is the subject. In the south you often hear digwyddiff.',
          },
        },
        {
          type: 'tip',
          body: 'hefo is northern “with”, and deud gwir means “actually”, short for a dweud y gwir. plis can stand before the verb, and os gwelwch yn dda stays at the end. The tag yn dydi? is the spoken form of on’d ydy?',
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
          prompt: 'You mean “by midday”. Which phrase is the deadline?',
          answer: 'erbyn canol dydd',
          options: ['yn erbyn y llywodraeth', 'erbyn canol dydd', 'yn ei herbyn (hi)'],
        },
        {
          type: 'check',
          prompt: 'You want “rather than a cross”. Which wording follows na?',
          answer: 'yn hytrach na chroes',
          options: ['yn hytrach na croes', 'yn hytrach na groes', 'yn hytrach na chroes'],
        },
      ],
    },
  ],
}
