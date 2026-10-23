import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '28',
  intro:
    'Written turns from this chapter: a softened time phrase, literary “we know”, and two words for “as well”. Then the old names for Llywelyn and for Britain.',
  steps: [
    {
      id: 'know',
      kicker: 'Phrase',
      title: '“We know” has a written shape',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Fe wyddom bellach',
            english: 'We now know',
            note: 'gwyddom is literary Welsh for dan ni’n gwybod. fe softens the g, and bellach means now, or by now.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Pwy a ŵyr',
            english: 'Who knows (rhetorical)',
            note: 'A set phrase. You are not waiting for an answer.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Pwy sy'n gwybod?",
            english: 'Who knows? (genuine question)',
            note: 'Ask this when you really want to find out who knows.',
          },
        },
        {
          type: 'tip',
          body: 'mewn gwirionedd means actually, or really: literally, “in truth”.',
        },
      ],
    },
    {
      id: 'time-when',
      kicker: 'Grammar',
      title: 'Time-when softens the first word',
      blocks: [
        {
          type: 'rule',
          title: 'Soft mutation marks when',
          body: 'When a phrase says when something happened, Welsh softens the first word, even though nothing sits in front of it. You meet dwy as ddwy, pythefnos as bythefnos, and canol as ganol. Learn the phrase in that softened shape.',
          examples: [
            { welsh: 'ddwy flynedd yn ôl', english: 'two years ago' },
            { welsh: 'bythefnos i heddiw', english: 'a fortnight today' },
            { welsh: 'ganol yr wythdegau', english: 'in the mid-80s' },
          ],
        },
      ],
    },
    {
      id: 'as-well',
      kicker: 'Pattern',
      title: 'Two kinds of “as well”',
      blocks: [
        {
          type: 'rule',
          title: 'Also, or equally well',
          body: 'yn ogystal (â) means also, or as well in the sense of too. cystal (â) is built on da and compares: as good as, or as well as someone else. â aspirates the next consonant, and before a vowel the word is ag.',
          examples: [
            {
              welsh: "Maen nhw'n siarad Cymraeg yn ogystal",
              english: 'They speak Welsh as well (too)',
            },
            {
              welsh: "Maen nhw'n siarad Cymraeg cystal â chi",
              english: 'They speak Welsh as well as you (do)',
            },
            { welsh: 'yn ogystal â bod', english: 'as well as being' },
          ],
        },
      ],
    },
    {
      id: 'written-no',
      kicker: 'Phrase',
      title: 'Impersonals, and “this is no”',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'carcharwyd',
            english: 'was/were imprisoned',
            note: 'Past impersonal, ending in -wyd. This is the usual shape in written Welsh and in the news.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Gellir dychmygu',
            english: 'One can imagine',
            note: 'Gellir is the present or future impersonal of gallu. A verb-noun follows it.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Nid llenor amatur mo hwn',
            english: 'This is no amateur writer',
            note: 'Literary pattern: Nid X mo Y means Y is no X.',
          },
        },
      ],
    },
    {
      id: 'not-one',
      kicker: 'Grammar',
      title: 'Not a single one',
      blocks: [
        {
          type: 'rule',
          title: 'yr un takes the place of ddim',
          body: "With a negative verb, yr un means not a single, and it often fills the slot where ddim would sit. prin means scarcely and softens in this pattern, and 'run is simply yr un. When the noun is feminine, yr un softens it.",
          examples: [
            {
              welsh: "Weles i'r un foronen",
              english: "I didn't see a single carrot",
            },
            {
              welsh: "does brin 'run …",
              english: 'there is scarcely a single …',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'coeliwch neu beidio',
            english: 'believe it or not',
            note: 'Some say credwch neu beidio. neu softens peidio to beidio.',
          },
        },
        {
          type: 'tip',
          body: 'Choeliwch chi ddim! means you will never believe it: the negative aspirates c to ch, and dim softens to ddim.',
        },
      ],
    },
    {
      id: 'epithets',
      kicker: 'Culture',
      title: 'The last leader and the island',
      blocks: [
        {
          type: 'culture',
          title: 'Names the chapter expects',
          body: 'ein Llyw Olaf is the usual name for Llywelyn ap Gruffudd, Prince of Wales, who died in 1282, before the conquest by Edward I. The word llyw is a steersman, a leader, or the helm. Ynys y Cedyrn, the Island of the Strong, is an old name for Britain from the Mabinogi (Pedair Cainc y Mabinogi), and cedyrn, the plural of cadarn, hardly appears outside set phrases.',
        },
        {
          type: 'say',
          line: {
            welsh: 'ein Llyw Olaf',
            english: 'our Last Leader (lit. steersman)',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Ynys y Cedyrn',
            english: 'Island of the Strong/Steadfast (Britain)',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'am ladd Llywelyn',
            english: 'for the killing of Llywelyn',
            note: 'Here lladd is a noun, the killing. am softens ll to l.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which phrase is right?',
      blocks: [
        {
          type: 'check',
          prompt: 'Which phrase means “two years ago”?',
          answer: 'ddwy flynedd yn ôl',
          options: ['dwy flynedd yn ôl', 'ddwy flynedd yn ôl', 'bythefnos i heddiw'],
        },
        {
          type: 'check',
          prompt: 'They speak Welsh as well as you do. Which Welsh is that?',
          answer: "Maen nhw'n siarad Cymraeg cystal â chi",
          options: [
            "Maen nhw'n siarad Cymraeg yn ogystal",
            "Maen nhw'n siarad Cymraeg cystal â chi",
            'yn ogystal â bod',
          ],
        },
      ],
    },
  ],
}
