import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '5',
  intro:
    'How to ask the way, give directions, and make a polite request. Soft mutation follows “can you”, and “up” is i fyny in the north and lan in the south.',
  steps: [
    {
      id: 'ask-way',
      kicker: 'Phrase',
      title: 'Excuse me, which way?',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Esgusodwch fi',
            english: 'Excuse me',
            note: 'The polite opener before you ask a stranger the way.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Ellwch chi ddeud 'tha i sut mae cyrraedd…?",
            english: 'Can you tell me how to get to…?',
            note: "'tha i is spoken wrtha i, “to me”. Ellwch chi softens the verb-noun.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Ydy hi'n bell?",
            english: 'Is it far?',
            note: 'hi agrees with a feminine place, such as the street.',
          },
        },
        {
          type: 'tip',
          body: 'If it is close, answer Ddim yn bell o gwbwl. Thank them with Diolch am eich cymorth, and Dim o gwbwl comes back as “you’re welcome”.',
        },
      ],
    },
    {
      id: 'directions',
      kicker: 'Pattern',
      title: 'Go straight, then turn',
      blocks: [
        {
          type: 'rule',
          title: 'Polite directions are commands',
          body: 'To a stranger, directions use the polite command: Ewch for go, Trowch for turn, Cymerwch for take. Link the next move with yna, “then”. After feminine stryd, “first” and “third” soften: y stryd gynta, y drydedd stryd.',
          examples: [
            { welsh: 'ewch yn syth i lawr y stryd', english: 'go straight down the street' },
            { welsh: "trowch i'r chwith", english: 'turn left' },
            {
              welsh: 'cymerwch yr ail stryd ar y dde',
              english: 'take the second street on the right',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "Trowch i'r dde, yna i'r chwith",
            english: 'Turn right, then left',
          },
        },
        {
          type: 'tip',
          body: "rhyw before a number means “about”, and it softens what follows: rhyw ddau neu dri munud o waith cerdded. Past the flower shop is mynd heibio i'r siop flodau, with blodau softened to flodau after feminine siop.",
        },
      ],
    },
    {
      id: 'where',
      kicker: 'Grammar',
      title: 'The place comes first',
      blocks: [
        {
          type: 'rule',
          title: 'Answer in the same order as the question',
          body: "Ask where something is with Lle mae…? in the north, and Ble mae…? or Le mae…? in the south. A spoken answer puts the place first: Fan'na mae e. Use hi when the place is feminine, such as swyddfa.",
          examples: [
            { welsh: 'Lle mae…?', english: 'Where is…?' },
            { welsh: "Fan'na mae e", english: "It's there" },
            {
              welsh: "Draw fan'na ar y dde mae hi",
              english: "It's over there on the right",
            },
          ],
        },
        {
          type: 'tip',
          body: "fan hyn, or fan'ma, and fan'na are the usual spoken “here” and “there”; yma and yna are the older set. Far off is fan'cw, the spoken partner of acw.",
        },
      ],
    },
    {
      id: 'requests',
      kicker: 'Grammar',
      title: 'Can you, will you, could you',
      blocks: [
        {
          type: 'rule',
          title: 'Three requests, one mutation',
          body: 'Ellwch chi…? means “can you?”, Newch chi…? means “will you?”, and Allech chi…? means “could you?”, often the politest. Each one softens the verb-noun that follows, so dangos becomes ddangos. In some areas the first pattern is Allwch chi…?.',
          examples: [
            {
              welsh: 'Allech chi ddangos i mi ar y map?',
              english: 'Could you show me on the map?',
            },
            {
              welsh: "Newch chi ddeud hynny 'to?",
              english: 'Will you say that again?',
            },
            {
              welsh: 'Allech chi ddod yn ôl wedyn?',
              english: 'Could you come back later?',
            },
          ],
        },
        {
          type: 'tip',
          body: "Please is os gwelwch yn dda with a stranger, os gweli di'n dda with someone you know, and the loanword plîs is common too. In Newch chi ddeud hynny 'to?, 'to is eto, “again”.",
        },
      ],
    },
    {
      id: 'commands',
      kicker: 'Grammar',
      title: 'Do this, and don’t',
      blocks: [
        {
          type: 'rule',
          title: 'Stem plus -wch',
          body: 'Build a polite command by adding -wch to the stem. If the verb-noun ends in a vowel, drop only that final vowel, so talu becomes talwch! and ffonio becomes ffoniwch!; a consonant ending stays, so eistedd becomes eisteddwch!. For “don’t”, put Peidiwch, or familiar Paid, in front of the ordinary verb-noun.',
          examples: [
            { welsh: 'talwch!', english: 'pay! (polite)' },
            { welsh: 'eisteddwch!', english: 'sit! (polite)' },
            {
              welsh: "Peidiwch croesi'r stryd fan hyn",
              english: "Don't cross the street here",
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Dos yn ôl a gofyn iddo!',
            english: 'Go back and ask him!',
            note: 'Northern familiar “go”, then a plain verb-noun. Southern familiar “go” is cer!.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Paid â cholli'r arian",
            english: "Don't lose the money (â + AM)",
            note: "After â, c, p, and t may aspirate. You will also hear Paid colli'r arian.",
          },
        },
        {
          type: 'tip',
          body: 'Mynd, dod, and gadael keep their own commands: polite Ewch, dewch!, and gadewch!. Familiar “come” is ty(r)d! in the north and dere! in the south.',
        },
      ],
    },
    {
      id: 'north-south',
      kicker: 'Culture',
      title: 'North and south of the same road',
      blocks: [
        {
          type: 'culture',
          title: 'One country, two sets of words',
          body: "Rhodfa'r Gogledd in the dialogue is a street in Aberystwyth, and the words for that road still depend on where the speaker is from. Grandparents split the same way: taid and nain in the north, tad-cu and mam-gu in the south. The reading names y Cynulliad Cenedlaethol, the Welsh Assembly, also called the Senedd, which likewise means Parliament at Westminster, and Plaid Cymru, the nationalist party that campaigned for datganoli.",
        },
        {
          type: 'say',
          line: {
            welsh: "i fyny'r ffordd",
            english: 'up the road',
            note: 'Northern. Southern: lan y ffordd.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Mae A yn … i B',
            english: "A is B's …",
            note: 'yn softens the relationship word, as in Mae Liam yn nai i Eddie.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which way is it?',
      blocks: [
        {
          type: 'check',
          prompt: 'Which request means “Could you show me on the map?”',
          answer: 'Allech chi ddangos i mi ar y map?',
          options: [
            'Allech chi dangos i mi ar y map?',
            'Allech chi ddangos i mi ar y map?',
            'Dangoswch i mi ar y map?',
          ],
        },
        {
          type: 'check',
          prompt:
            'The post office (swyddfa) is feminine. Which sentence points to it?',
          answer: "Draw fan'na ar y dde mae hi",
          options: [
            "Draw fan'na ar y dde mae e",
            "Draw fan'na ar y dde mae hi",
            "Mae hi draw fan'na ar y dde",
          ],
        },
      ],
    },
  ],
}
