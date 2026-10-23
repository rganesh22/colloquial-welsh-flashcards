import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '2a',
  intro:
    'Who people are, where they are, and what they are doing. The present of bod, “to be”, splits between north and south.',
  steps: [
    {
      id: 'nationalities',
      kicker: 'Phrase',
      title: 'Nationality words come in pairs',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Ffrancwr',
            english: 'Frenchman',
            note: 'Feminine: Ffrances.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Sais',
            english: 'Englishman',
            note: 'Feminine: Saesnes.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Gwyddel',
            english: 'Irishman',
            note: 'Feminine: Gwyddeles.',
          },
        },
        {
          type: 'tip',
          body: 'The same split runs through the rest. A man is Americanwr, Almaenwr, or Albanwr; a woman is Americanes, Almaenes, or Albanes.',
        },
      ],
    },
    {
      id: 'bod-present',
      kicker: 'Grammar',
      title: '“To be” is verb plus person',
      blocks: [
        {
          type: 'rule',
          title: 'bod in the present',
          body: 'bod means “to be”, and Welsh builds nearly every tense from it. The present is a short verb plus a pronoun: dw i is “I am”, and mae hi is “she is”. Use maen nhw for “they are” only with nhw; when you name the people, keep singular mae, as in Mae … ac ….',
          examples: [
            { welsh: 'dw i', english: 'I am' },
            { welsh: 'mae hi', english: 'she is' },
            { welsh: 'maen nhw', english: 'they are' },
          ],
        },
        {
          type: 'tip',
          body: 'Familiar “you are” is (wyt) ti. In speech wyt often drops, so you just hear ti….',
        },
      ],
    },
    {
      id: 'yn-verb',
      kicker: 'Pattern',
      title: 'What someone does uses yn',
      blocks: [
        {
          type: 'rule',
          title: 'bod + yn + verb-noun',
          body: "Actions and habits use the present of bod, then yn, then a verb-noun. In speech yn joins the pronoun, which is why the cards show 'n. dych chi'n siarad is both “you speak” and “you are speaking”.",
          examples: [
            { welsh: "dych chi'n siarad", english: 'you speak / are speaking' },
            { welsh: "dych chi'n mynd", english: 'you are going / do you go' },
            { welsh: "dw i'n deall", english: 'I understand' },
          ],
        },
      ],
    },
    {
      id: 'places',
      kicker: 'Phrase',
      title: 'Here, away, and at home',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Maen nhw fan hyn',
            english: 'They are here',
            note: 'fan hyn is “here”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "draw fan'na",
            english: 'over there',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Wyt ti gartre heno?',
            english: 'Are you at home tonight?',
            note: 'Also Ti gartre heno? Writing often has gartref.',
          },
        },
        {
          type: 'tip',
          body: 'tu allan is outside, lan y grisiau is upstairs, and o dan is under (bwrdd is a table). yfory is tomorrow, mewn pryd is in time, and i ffwrdd is away.',
        },
      ],
    },
    {
      id: 'questions',
      kicker: 'Pattern',
      title: 'Questions change the little verb',
      blocks: [
        {
          type: 'rule',
          title: 'Statement, then a different verb',
          body: 'A question of bod changes the little verb. You do not keep the statement form and only add a question mark. ydy hi? means “is she?”, and the tag after a sentence about her is the same Ydy hi?.',
          examples: [
            { welsh: 'ydy hi?', english: 'is she?' },
            { welsh: 'ydyn nhw?', english: 'are they?' },
            { welsh: 'ydw i?', english: 'am I?' },
          ],
        },
        {
          type: 'tip',
          body: 'Familiar “are you?” is (wyt) ti?, heard as wyt ti? or just ti?. The tag in the notes is Mae Gwenllian i ffwrdd heddiw. Ydy hi?',
        },
      ],
    },
    {
      id: 'north-south',
      kicker: 'Culture',
      title: 'North and South keep different shapes',
      blocks: [
        {
          type: 'culture',
          title: 'Learn the pair you will hear',
          body: 'Several persons of bod have a northern shape and a southern one. “He is” is mae o in the north and mae e in the south. “We are” is dyn ni or dan ni in the north and ŷn ni in the south; “you are” is dych chi or dach chi in the north and ŷch chi in the south.',
        },
        {
          type: 'say',
          line: {
            welsh: 'wi',
            english: 'I am',
            note: 'Southern. Northern and general: dw i.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yw e?',
            english: 'is he?',
            note: 'Southern. Northern: ydy e? or ydy o?.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ŷn nhw?',
            english: 'are they?',
            note: 'Reduced southern form of ydyn nhw?.',
          },
        },
        {
          type: 'tip',
          body: '“Are we?” is ydan ni? in the north and (yd)yn ni? in the south. “Are you?” is (y)dach chi? in the north and (yd)ych chi? in the south.',
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
          prompt: 'The subject is nhw. How do you say “they are”?',
          answer: 'maen nhw',
          options: ['Mae … ac …', 'maen nhw', 'ydyn nhw?'],
        },
        {
          type: 'check',
          prompt: 'Which form is the southern “I am”?',
          answer: 'wi',
          options: ['dw i', 'wi', 'ŷn ni'],
        },
      ],
    },
  ],
}
