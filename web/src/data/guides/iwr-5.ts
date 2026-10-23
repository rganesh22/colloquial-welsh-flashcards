import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '5',
  intro:
    'A week of loving Welsh, whether you are learning it or teaching it. Read yn against mewn, “who” and “which” before a verb, and the forms that belong on the page.',
  steps: [
    {
      id: 'dysgu',
      kicker: 'Phrase',
      title: 'Learn and teach are the same verb',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Caru dysgu'r Gymraeg",
            english: 'Loving learning Welsh; loving teaching Welsh',
            note: 'The title is a deliberate double meaning.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'dysgu',
            english: 'learn; teach',
            note: 'Context decides which sense you mean.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'edrych ymlaen at',
            english: 'look forward to',
            note: 'at softens the next word. yn arw means “greatly, awfully”.',
          },
        },
        {
          type: 'tip',
          body: 'treulio is for spending time, as in a week at camp. Spending money is gwario. A challenge is her on the formal page, and sialens in everyday speech.',
        },
      ],
    },
    {
      id: 'yn-mewn',
      kicker: 'Grammar',
      title: 'In the place, or in a place',
      blocks: [
        {
          type: 'rule',
          title: 'yn when you know which one',
          body: 'yn goes with a specific place: a noun with y or yr, or a proper name. mewn goes with a non-specific noun, and it never stands in front of y. After yn the next word can take nasal mutation, so gwersyll becomes yng ngwersyll.',
          examples: [
            { welsh: 'yn yr ysbyty', english: 'in the hospital' },
            { welsh: 'mewn ysbyty', english: 'in a hospital' },
            { welsh: 'yn Sir Benfro', english: 'in Pembrokeshire' },
          ],
        },
        {
          type: 'tip',
          body: 'Place names are specific, so they take yn. Sir Benfro keeps a fixed soft mutation: Penfro becomes Benfro after Sir.',
        },
      ],
    },
    {
      id: 'who-which',
      kicker: 'Pattern',
      title: 'Who and which sit before the verb',
      blocks: [
        {
          type: 'rule',
          title: 'a softens; mae becomes sy',
          body: 'Before a verb, “who” or “which” is a, and the verb softens. Present mae is the exception: it becomes sy or sydd, and sy\'n when yn follows. In speech a often drops out, but the softening stays, so daeth still appears as ddaeth.',
          examples: [
            { welsh: 'a fydd', english: 'who will be; which will be' },
            { welsh: "sy'n dechrau", english: 'which starts' },
            {
              welsh: 'y dynion (a) ddaeth i mewn',
              english: 'the men who came in',
            },
          ],
        },
      ],
    },
    {
      id: 'pryd',
      kicker: 'Phrase',
      title: 'pryd hides inside set phrases',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'ar hyn o bryd',
            english: 'at the moment',
            note: 'Learn it whole. The same bryd is in ar brydiau, “at times”, and bryd hynny, “at that time”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "o bryd i'w gilydd",
            english: 'from time to time',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'mwy trawiadol fyth',
            english: 'even more striking',
            note: 'fyth after a comparative means “even”, as in oerach fyth.',
          },
        },
        {
          type: 'tip',
          body: 'o dan means “under” and softens the next word: o dan arweiniad is “under the leadership of”. tan means “until”. Before a vowel, ag is “with” and ac is “and”. camerâu keeps a circumflex, so -âu is pronounced as written.',
        },
      ],
    },
    {
      id: 'on-the-page',
      kicker: 'Culture',
      title: 'The page keeps forms you will not say',
      blocks: [
        {
          type: 'culture',
          title: 'Literary Welsh, and the channel that uses it',
          body: 'ni is the literary “not”; speech uses ddim, as in allwn ni ddim for “we cannot”. Endings in -nt stay in print too: maent is “they are”, and wrth iddynt is “as they”, where speech says maen nhw and wrth iddyn nhw. The story sits in that public world: y Sianel is S4C, and Cynulliad is the Welsh Assembly, literally a gathering.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Ni all y Sianel ddatgelu',
            english: 'The Channel cannot reveal (literary)',
            note: 'Speech says All y Sianel ddim datgelu.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'a ddarlledir',
            english: 'which will be broadcast',
            note: 'darlledwyd is the past. -ir often turns a into e, so talu becomes telir. Common in print and on the news.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'meddai',
            english: 'says; said (quoting)',
            note: 'For quoting someone’s actual words. Also spelt medde; also medd.',
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
          prompt: 'You mean a particular hospital. Which phrase is right?',
          answer: 'yn yr ysbyty',
          options: ['mewn yr ysbyty', 'yn yr ysbyty', 'mewn ysbyty'],
        },
        {
          type: 'check',
          prompt: 'How do you say “we cannot” in speech?',
          answer: 'allwn ni ddim',
          options: ['ni allwn', 'allwn ni ddim', 'gallaf'],
        },
      ],
    },
  ],
}
