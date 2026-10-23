import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '4',
  intro:
    'How to ask someone to show you something, take a room, and handle the mutations after “and”, “her”, “my”, and “in”.',
  steps: [
    {
      id: 'can-you',
      kicker: 'Phrase',
      title: 'Can you show me?',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Ellwch chi ddangos i mi…?',
            english: 'Can you show me…?',
            note: 'Ellwch chi softens the verb-noun: dangos becomes ddangos. i mi is “to me” or “for me”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Allech chi lofnodi fan hyn?',
            english: 'Could you sign here?',
            note: 'Allech chi is the polite “could you”. llofnodi softens to lofnodi.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Ellwch chi gywiro hwn i mi?',
            english: 'Can you correct this for me?',
          },
        },
        {
          type: 'tip',
          body: 'Gallu is ability and cael is permission, and both soften the verb-noun that follows. Answer with Galla(f) or Gallwn, or with wrth gwrs.',
        },
      ],
    },
    {
      id: 'reception',
      kicker: 'Phrase',
      title: 'Have you got a room?',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Oes stafelloedd rhydd 'da chi?",
            english: 'Have you got any rooms free?',
            note: "Oes … 'da …? asks whether someone has something. Yes is Oes. No is Nag oes.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Am faint hoffech chi aros?',
            english: 'How long would you like to stay?',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Ddo i â'ch bagiau lan mewn munud",
            english: "I'll bring your bags up in a minute",
            note: 'dod â means “bring”, literally “come with”. mynd â means “take”.',
          },
        },
        {
          type: 'tip',
          body: 'dau is “two” before a masculine noun and dwy before a feminine one. Both soften the next word: y ddau fag, y ddwy stafell wely. peidiwch poeni is “don’t worry”, and the verb-noun after peidiwch stays as it is.',
        },
      ],
    },
    {
      id: 'aspirate',
      kicker: 'Grammar',
      title: '“And” and “her” aspirate c, p, t',
      blocks: [
        {
          type: 'rule',
          title: 'c → ch, p → ph, t → th',
          body: 'After a “and”, â “with”, and ei “her”, the letters c, p, and t aspirate. cyllell becomes chyllell, car becomes char, and tad becomes thad. Aspirating t to th is uncommon in speech, so bws a thacsi is not the usual phrase.',
          examples: [
            { welsh: 'llwy a chyllell', english: 'spoon and knife' },
            { welsh: 'bws a char', english: 'a bus and a car' },
            { welsh: 'ei thad hi', english: 'her father' },
          ],
        },
        {
          type: 'tip',
          body: 'chwech, chwaer, and chwythu already begin with chw. Leave that spelling as it is when you aspirate c, p, and t. Set phrases keep the aspirate after tri and chwe: tri chant, chwe chant.',
        },
      ],
    },
    {
      id: 'nasal',
      kicker: 'Pattern',
      title: '“In” and “my” shift the first letter',
      blocks: [
        {
          type: 'rule',
          title: 'Nasal mutation',
          body: 'The preposition yn “in” nasalises the place after it, and yn changes shape to match: ym before b or p, yng before c or g, and yn before t or d. Fy “my” nasalises a noun in the same way, and people often drop fy, leaving nhad for “my father”. Where you come from uses o plus a soft mutation: o Gaerdydd.',
          examples: [
            { welsh: 'yng Nghaerdydd', english: 'in Cardiff' },
            { welsh: 'ym Mangor', english: 'in Bangor' },
            { welsh: 'nhad', english: 'my father' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "dw i'n dod o Gaerdydd",
            english: 'I come from Cardiff',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "dw i'n byw yng Nghaerdydd",
            english: 'I live in Cardiff',
          },
        },
        {
          type: 'tip',
          body: "dy “your” and ei “his” soften the noun: dy fraich di, ei gar e. ein, eich, and eu leave it alone, though before a vowel they sometimes add h-: ein harian ni. When “my” cannot nasalise, you hear 'n: 'n sgidiau i.",
        },
      ],
    },
    {
      id: 'genitive',
      kicker: 'Pattern',
      title: 'The second noun means “of”',
      blocks: [
        {
          type: 'rule',
          title: 'Two nouns, nothing between',
          body: "Put the main noun first and the second noun straight after it. canol y dre means “the centre of the town”, and beic y ferch means “the girl's bike”. A preposition at the front can replace the article and soften the first noun, which gives ar gopa'r mynydd.",
          examples: [
            { welsh: 'beic y ferch', english: "the girl's bike" },
            { welsh: 'canol y dre', english: 'the centre of the town' },
            { welsh: "ar gopa'r mynydd", english: 'on the top of the mountain' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'yng nghanol y dre',
            english: 'in the town centre',
            note: 'yn nasalises canol inside this phrase.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'tan ddiwedd yr wythnos',
            english: 'till the end of the week',
            note: 'tan softens diwedd. diwedd yr wythnos is “the end of the week”.',
          },
        },
      ],
    },
    {
      id: 'places',
      kicker: 'Culture',
      title: 'Town names hide a river, a church, or a ford',
      blocks: [
        {
          type: 'culture',
          title: 'aber, llan, and rhyd',
          body: 'Aber is an estuary, so Abertawe is the mouth of the Tawe and Aberystwyth is the mouth of the meandering Ystwyth. Llan is a church, usually of a saint: Llanfair is the church of Mair, Mary. Rhyd is a ford, which is why Rhydaman is Ammanford, the ford of the Aman.',
        },
        {
          type: 'say',
          line: {
            welsh: 'tŷ bach',
            english: 'toilet',
            note: 'Literally “little house”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Dyma'ch allwedd chi, 'te",
            english: "Here's your key, then",
            note: 'allwedd is southern. In the north you hear agoriad.',
          },
        },
        {
          type: 'tip',
          body: "Southern lan means “up” (also i fyny). Northern nain is “grandmother”, and the southern word is mam-gu. Southern timod means “y'know”; the northern phrase is wyddost ti.",
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
          prompt: 'You want someone to show you. Which question is right?',
          answer: 'Ellwch chi ddangos i mi…?',
          options: [
            'Ellwch chi dangos i mi…?',
            'Ellwch chi ddangos i mi…?',
            'Ellwch chi ddangos mi…?',
          ],
        },
        {
          type: 'check',
          prompt: 'Which phrase means “in the town centre”?',
          answer: 'yng nghanol y dre',
          options: ['yn y canol y dre', 'yng nghanol y dre', 'yn canol y dre'],
        },
      ],
    },
  ],
}
