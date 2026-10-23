import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '1',
  intro:
    'The language of small ads: ages, “this” and “that”, and a handful of phrases you learn whole. Watch where “all” sits, and how a polite command ends.',
  steps: [
    {
      id: 'age',
      kicker: 'Phrase',
      title: 'How old uses two words',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Beth ydy'ch oedran chi?",
            english: 'How old are you?',
            note: 'oedran is the ordinary word for “age”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'pump oed',
            english: 'five years old',
            note: 'The number comes first, then oed.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'pum mlwydd oed',
            english: 'five years old',
            note: 'blwydd is optional. pum and naw turn it into mlwydd; dwy softens it to flwydd; chwe leaves blwydd.',
          },
        },
        {
          type: 'tip',
          body: 'Ask the question with oedran. Save oed for the slot after the number.',
        },
      ],
    },
    {
      id: 'all',
      kicker: 'Grammar',
      title: 'All comes after the noun',
      blocks: [
        {
          type: 'rule',
          title: 'i gyd',
          body: 'i gyd is always those two words, and it follows what it covers: a noun or a pronoun. holl is the one that stands in front, and it softens the next word. It will not attach to chi, so reach for i gyd unless you specifically want holl before the noun.',
          examples: [
            { welsh: 'geiriau i gyd', english: 'all the words' },
            { welsh: 'y plant i gyd', english: 'all the children' },
            { welsh: 'yr holl blant', english: 'all the children' },
          ],
        },
        {
          type: 'tip',
          body: 'Two plurals in this chapter change shape: cân becomes caneuon, and gair becomes geiriau. Learn each plural with its singular.',
        },
      ],
    },
    {
      id: 'this-that',
      kicker: 'Pattern',
      title: 'This and that follow the noun',
      blocks: [
        {
          type: 'rule',
          title: 'Article, noun, then yma or yna',
          body: 'When the noun is there, “this” and “that” come after it, and the article stays. yma and yna often shrink to ’ma and ’na. With no noun to hang them on, switch to the pronouns.',
          examples: [
            { welsh: 'y CD yma', english: 'this CD' },
            { welsh: 'y CD yna', english: 'that CD' },
            { welsh: 'hwn', english: 'this (m, alone)' },
          ],
        },
        {
          type: 'tip',
          body: 'hon is feminine “this”; hwnnw and honno are the “that” pair. Another of the same thing is arall (CD arall); the plural adjective is eraill (CDs eraill).',
        },
      ],
    },
    {
      id: 'place',
      kicker: 'Phrase',
      title: 'Inside, outside, behind',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'tu fewn',
            english: 'inside; within',
            note: 'tu softens mewn to fewn. Link a noun with i: tu fewn i’r llyfr.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'tu allan',
            english: 'outside',
            note: 'tu fas is the other “outside”, and tu hwnt means “beyond”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'tu ôl',
            english: 'behind',
            note: 'tu ôl i’r adeilad — behind the building.',
          },
        },
        {
          type: 'tip',
          body: 'ochor is the ordinary word for “side”. Compounds such as ar draws, ar gyfer, yn lle, and ar ôl split around a pronoun: ar draws Cymru, but ar ei draws e.',
        },
      ],
    },
    {
      id: 'set-phrases',
      kicker: 'Pattern',
      title: 'Phrases you learn whole',
      blocks: [
        {
          type: 'rule',
          title: 'ar plus a softened noun',
          body: 'A few states are simply ar plus a softened noun: on sale, lost, on fire, locked. The usual “only” is dim ond, which speech shortens to ’mond. yn unig can do the same job when it follows what it limits, as in pum punt yn unig.',
          examples: [
            { welsh: 'ar werth', english: 'on sale' },
            { welsh: 'ar dân', english: 'on fire' },
            { welsh: "'mond", english: 'only (spoken)' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'newydd sbon',
            english: 'brand new',
            note: 'A set pair. Learn it as one piece.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'llond lle',
            english: 'packed (with); a placeful',
            note: 'llond plus a noun: llond llwy is a spoonful, llond ceg a mouthful.',
          },
        },
        {
          type: 'tip',
          body: 'bob mis is “every month”: pob softens to bob in time phrases. ar y we, “on the web”, softens gwe to we; a website is gwefan.',
        },
      ],
    },
    {
      id: 'advert-voice',
      kicker: 'Culture',
      title: 'How an advert addresses you',
      blocks: [
        {
          type: 'culture',
          title: 'Polite, and often shortened',
          body: 'These ads, hysbysebion, speak to you with the polite command ending -wch: gofynnwch, e-bostiwch. Not every word that ends in -wch is a command, but this pair is. Once the ending is clear, chi often drops, so gallwch on its own already means “you can”.',
        },
        {
          type: 'say',
          line: {
            welsh: 'gofynnwch',
            english: 'ask! (pl / polite)',
            note: 'e-bostiwch is the matching “email!”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Os na allwch ei weld',
            english: "If you can't see it",
            note: 'os na is “if not”. ei before the verb-noun marks the object “it”. gallwch archebu is “you can order”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Os nad oes siop',
            english: 'If there is no shop',
            note: 'A printed “Oes nad oes” is a slip for Os nad oes.',
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
          prompt: 'You are five, and you want blwydd in the phrase. Which form is right?',
          answer: 'pum mlwydd oed',
          options: ['pump blwydd oed', 'pum mlwydd oed', 'pump oedran'],
        },
        {
          type: 'check',
          prompt: 'How do you say “all the words”?',
          answer: 'geiriau i gyd',
          options: ['holl geiriau', 'geiriau i gyd', 'i gyd geiriau'],
        },
      ],
    },
  ],
}
