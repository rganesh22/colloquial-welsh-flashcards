import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '33',
  intro:
    'Literary Welsh on the start of the Great War, from Hanes Cymru. You will learn the written verb endings, and the phrases that hold this narrative together.',
  steps: [
    {
      id: 'war-lines',
      kicker: 'Phrase',
      title: 'The Great War, in the book’s lines',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Y Rhyfel Fawr',
            english: 'The Great War',
            note: 'The chapter title, from the account of 1914 in Hanes Cymru.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Nid felly y bu',
            english: 'But it was not to be',
            note: 'Also “this was not how it turned out”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Pan ddaeth yr ymladd i ben',
            english: 'When the fighting came to an end',
            note: 'ymladd is a verb-noun used as “the fighting”. i softens pen to ben. brwydro does the same job in Yn sgil y brwydro.',
          },
        },
        {
          type: 'tip',
          body: 'Serch hynny means “however”. Doedd fawr o frwdfrydedd means “there wasn’t much enthusiasm”: this negative needs no ddim, and o softens the following word.',
        },
      ],
    },
    {
      id: 'impersonal',
      kicker: 'Grammar',
      title: 'Written passives end in -wyd and -id',
      blocks: [
        {
          type: 'rule',
          title: '-ir, -wyd, and -id',
          body: 'In this written narrative the passive is an ending on the verb. -ir is present or future, -wyd is the simple past, and -id is the imperfect. Spoken Welsh uses cael plus a possessive plus the verb-noun, so keep these endings for the page.',
          examples: [
            {
              welsh: 'Llofruddiwyd Franz Ferdinand',
              english: 'Franz Ferdinand was murdered',
            },
            {
              welsh: 'tanseiliwyd y gyfundrefn',
              english: 'the system was undermined',
            },
            { welsh: 'clodforid', english: 'was praised' },
          ],
        },
        {
          type: 'tip',
          body: 'For “was murdered” in speech, say cafodd … ei lofruddio. rhaid oedd is the literary “it was necessary”; speech says roedd rhaid. The same -id ending gives anrhydeddid, “was honoured”, and ymserchid yn Heine, “Heine was cherished”.',
        },
      ],
    },
    {
      id: 'imperfect',
      kicker: 'Grammar',
      title: '-ai is the literary “was doing”',
      blocks: [
        {
          type: 'rule',
          title: 'Third person, one ending',
          body: 'For “was doing” in the third person, this prose uses the ending -ai, not roedd plus yn plus a verb-noun. A plural noun still takes that singular ending. Only the pronoun nhw takes a plural verb.',
          examples: [
            { welsh: 'a wynebai Ewrop', english: 'which faced Europe' },
            { welsh: 'gorweddai', english: 'were lying' },
            { welsh: 'fe wyddai fe', english: 'he knew' },
          ],
        },
        {
          type: 'tip',
          body: 'gwybod is the ending you still say: fe wyddai fe, “he knew”, fe ŵyr hi, “she knows”, and pwy a ŵyr?, “who knows?”. pe na lwyddent, dylent wneud is the written “if they did not succeed, they ought to make”.',
        },
      ],
    },
    {
      id: 'among',
      kicker: 'Pattern',
      title: 'Among and in the wake of split',
      blocks: [
        {
          type: 'rule',
          title: 'yn plus a possessive',
          body: 'ymhlith is yn plus plith, and it stays one word in front of a noun. With a pronoun it splits into yn, a possessive, and plith. yn sgil, “in the wake of”, splits the same way.',
          examples: [
            { welsh: 'ymhlith y myfyrwyr', english: 'among the students' },
            { welsh: 'yn eu plith', english: 'among them' },
            { welsh: 'Yn sgil y brwydro', english: 'In the wake of the fighting' },
          ],
        },
        {
          type: 'tip',
          body: 'The pronoun after plith is optional: yn eu plith (nhw), yn ein plith (ni), yn eich plith (chi). yn eu sgil is “in their wake”.',
        },
      ],
    },
    {
      id: 'dyma',
      kicker: 'Pattern',
      title: 'dyma and dyna have no tense',
      blocks: [
        {
          type: 'rule',
          title: 'Supply “was” from the story',
          body: 'dyma and dyna are not verbs, so they carry no tense of their own. You choose “is”, “was”, or “will be” from the story. They soften the next word, and sometimes bod does join them, as in dyna oedd and dyna fydd.',
          examples: [
            { welsh: 'Dyma gred a oedd', english: 'This was a belief that was' },
            {
              welsh: 'dyna oedd yr ymateb gawson ni',
              english: 'that was the response we got',
            },
            { welsh: 'dyna ddigwyddodd', english: "that's what happened" },
          ],
        },
      ],
    },
    {
      id: 'chwedl',
      kicker: 'Culture',
      title: 'chwedl means “as they put it”',
      blocks: [
        {
          type: 'culture',
          title: 'Legend, or someone’s words',
          body: 'The noun chwedl usually means “legend”, but here it means “as someone put it”. chwedl Churchill is “in Churchill’s words”. In the north that idiom is pronounced chadal, and only in this use: chadal nhwtha means “so they say”.',
        },
        {
          type: 'say',
          line: {
            welsh: 'chwedl Churchill',
            english: 'as Churchill put it',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'chadal nhwtha',
            english: 'so they say',
            note: 'Northern spoken form of chwedl nhwthau. nhwtha is nhwthau, “them too”.',
          },
        },
        {
          type: 'tip',
          body: 'llynges, “navy” or “fleet”, is the Lingus of Aer Lingus, an “air fleet”. yr Almaen is feminine, so “its socialist party” is ei phlaid sosialaidd.',
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which form fits the page?',
      blocks: [
        {
          type: 'check',
          prompt: 'Franz Ferdinand was murdered. Which form belongs in this written chapter?',
          answer: 'llofruddiwyd',
          options: ['llofruddiwyd', 'cafodd ei lofruddio', 'llofruddio'],
        },
        {
          type: 'check',
          prompt: 'How do you say “among them”?',
          answer: 'yn eu plith',
          options: ['ymhlith nhw', 'yn eu plith', 'yn eu sgil'],
        },
      ],
    },
  ],
}
