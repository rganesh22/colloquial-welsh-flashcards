import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '6',
  intro:
    'How to shop: ask for caws Caerffili, hear the price, and say what you want. Watch the softening after Ga i, and the North and South ways of saying you have something.',
  steps: [
    {
      id: 'counter',
      kicker: 'Phrase',
      title: 'Can I help you both?',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Alla i'ch helpu chi'ch dwy?",
            english: 'Can I help you both?',
            note: "chi'ch dwy means you two, both women. This is the shopkeeper's opener.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Faint yw e?',
            english: 'How much is it?',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Ga i hanner pwys, 'te?",
            english: 'Can I have half a pound, then?',
            note: "'te means then, or so. When they hand it over, they say 'Na ni.",
          },
        },
        {
          type: 'tip',
          body: "Cewch means yes, you may, and Na chewch means no, you may not. If they ask Unrhywbeth arall? (anything else?), close with 'Na'r cwbwl am y tro.",
        },
      ],
    },
    {
      id: 'ga-i',
      kicker: 'Grammar',
      title: 'Ga i softens what follows',
      blocks: [
        {
          type: 'rule',
          title: 'The thing you ask for changes',
          body: 'Ga i …? means “can I have …?”, and the thing you name softens: tri becomes dri. Alla i gael …? means the same, but the object stays as it is, because gael has already taken the softening. Gawn ni …? means “can we have …?”, and it softens the object in the same way.',
          examples: [
            {
              welsh: 'Ga i dri pwys o foron?',
              english: 'Can I have three pounds of carrots?',
            },
            {
              welsh: 'Alla i gael tri pwys o foron?',
              english: 'Can I get three pounds of carrots?',
            },
            { welsh: 'Ga i dorth wen', english: 'Can I have a white loaf' },
          ],
        },
        {
          type: 'tip',
          body: 'A feminine noun softens the adjective after it. A white loaf is torth wen, and a local shop is siop leol.',
        },
      ],
    },
    {
      id: 'numbers',
      kicker: 'Pattern',
      title: 'Two boys, two girls',
      blocks: [
        {
          type: 'rule',
          title: 'Two and three match the noun',
          body: 'Dau is “two” before a masculine noun, and dwy is “two” before a feminine one. Both soften that noun, so bachgen becomes fachgen and merch becomes ferch. Feminine “three” is tair, as in tair coeden, while masculine tri sometimes aspirates, as in tri cheffyl.',
          examples: [
            { welsh: 'dau fachgen', english: 'two boys' },
            { welsh: 'dwy ferch', english: 'two girls' },
            { welsh: 'tair coeden', english: 'three trees' },
          ],
        },
        {
          type: 'tip',
          body: 'From one to ten the noun stays singular (pedwar llyfr), and o after a quantity softens the next word (digon o fara). Punt is money and feminine (dwy bunt, tair punt); pwys is weight and stays singular. The older fifteen, pymtheg, is still used in punt a pymtheg ceiniog y pwys, beside the school form undeg pump.',
        },
      ],
    },
    {
      id: 'eisiau',
      kicker: 'Phrase',
      title: 'I want it, with no yn',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Dw i eisiau',
            english: 'I want',
            note: "No linking yn. A verb takes yn, as in Dw i'n mynd.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'dyn ni ddim angen',
            english: "we don't need",
            note: 'angen works the same way. dim byd heddi is nothing today, and heddi is spoken heddiw.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Dyn ni eisiau mynd adre',
            english: 'We want to go home',
          },
        },
        {
          type: 'tip',
          body: "In the south, moyn takes yn: Dyn ni'n moyn mynd adre. Spoken eisiau is isio in the north, ise in mid Wales, and also isie.",
        },
      ],
    },
    {
      id: 'north-south',
      kicker: 'Culture',
      title: '“I have it” splits North and South',
      blocks: [
        {
          type: 'culture',
          title: 'Gan in the north',
          body: "Northern Welsh uses gan for “have”, and softens the thing you have. Southern Welsh uses 'da and puts that thing first. Onions follow the same split, nionod in the north and wynwyn in the south, and for “can” the north says medru where other regions say gallu.",
        },
        {
          type: 'say',
          line: {
            welsh: 'Mae gan John gar newydd',
            english: "John's got a new car",
            note: 'Northern. car softens to gar.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Mae car newydd 'da John",
            english: "John's got a new car",
            note: 'Southern and general.',
          },
        },
        {
          type: 'tip',
          body: "At the till, the north says Does gen i ddim newid and the south says Does dim newid 'da fi. Mae Susan yn medru Cymraeg means Susan can speak Welsh: medru can stand with a language name on its own.",
        },
      ],
    },
    {
      id: 'this-that',
      kicker: 'Phrase',
      title: 'This one, or just this',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Mae hwn yn drwm',
            english: 'This one is heavy',
            note: 'One particular thing, such as a parcel. Feminine is hon.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Mae hyn yn anodd',
            english: 'This is difficult',
            note: 'A situation, such as a task.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Faint yw hynny?',
            english: 'How much is that?',
            note: 'The whole lot. One item is Faint yw hwnnw/honno? (hwnnw masculine, honno feminine).',
          },
        },
        {
          type: 'tip',
          body: "Mae hynny'n rhy ddrud means that is too expensive. rhy softens the adjective, so drud becomes ddrud.",
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
          prompt: 'You want three pounds of carrots. Which question is right?',
          answer: 'Ga i dri pwys o foron?',
          options: [
            'Ga i tri pwys o foron?',
            'Ga i dri pwys o foron?',
            'Alla i gael dri pwys o foron?',
          ],
        },
        {
          type: 'check',
          prompt: 'How do you say “three pounds” in money?',
          answer: 'tair punt',
          options: ['tri punt', 'tair punt', 'tair bunt'],
        },
      ],
    },
  ],
}
