import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '4',
  intro:
    'How to read about Glastonbury Festival: the Welsh names, when things happen, and the sentence patterns the chapter keeps using. gŵyl is feminine, and that choice shows up all the way through.',
  steps: [
    {
      id: 'places',
      kicker: 'Culture',
      title: 'Glastonbury already has a Welsh name',
      blocks: [
        {
          type: 'culture',
          title: 'Isle of Glass, land of summer',
          body: 'Welsh calls Glastonbury Ynys Wydryn, the Isle of Glass. The name is probably a misreading of the English, and legend ties the place to Ynys Afallon, the Arthurian isle of Avalon. The county around it is Gwlad yr Haf, the Land of the Summer, which is Somerset.',
        },
        {
          type: 'say',
          line: { welsh: 'Ynys Wydryn', english: 'Glastonbury' },
        },
        {
          type: 'say',
          line: { welsh: 'Ynys Afallon', english: 'Avalon' },
        },
        {
          type: 'say',
          line: {
            welsh: 'Gwlad yr Haf',
            english: 'Somerset',
            note: 'After yn the name changes: yng Ngwlad yr Haf. G becomes Ng.',
          },
        },
      ],
    },
    {
      id: 'festival',
      kicker: 'Phrase',
      title: 'Talking about the festival',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Bydd Gŵyl Gerddorol Glastonbury yn cychwyn ddydd Mercher',
            english: 'The Glastonbury music festival will start on Wednesday',
            note: 'gŵyl is feminine, so cerddorol softens to gerddorol. After y, g drops: mae’r ŵyl. The plural gwyliau also means holidays. i’r dorf is the same softening on torf, crowd.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'mae disgwyl i',
            english: 'is/are expected (to)',
            note: 'Soften the verb that i is aiming at: mae disgwyl i’r tywydd fod yn gymysgedd. You will also meet Mae disgwyl i 177,000 o bobl deithio yno. Formal disgwylir means the same “it is expected”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "mae modd i ti wylio'r cyfan",
            english: 'you can watch it all',
            note: 'mae modd i means it is possible for someone to. gwylio softens to wylio. ar-lein means online.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'papur tŷ bach',
            english: 'toilet paper (colloquial)',
            note: 'tŷ bach is a little house, the everyday word for a toilet. papur toiled is the other name. ar gael am ddim means available free of charge.',
          },
        },
        {
          type: 'tip',
          body: 'Bydd yr ŵyl yn dod i ben means the festival will end. drwy gydol yr ŵyl means throughout the festival. cymysgedd o heulwen a glaw is a mixture of sunshine and rain.',
        },
      ],
    },
    {
      id: 'time',
      kicker: 'Grammar',
      title: 'When softens the time word',
      blocks: [
        {
          type: 'rule',
          title: 'Soft mutation for “time when”',
          body: 'To say when something happens, soften the time word. dydd becomes ddydd, pob becomes bob, and blynyddoedd becomes flynyddoedd. Some time words are already one fixed piece, and they stay as they are.',
          examples: [
            { welsh: 'ddydd Mercher', english: 'on Wednesday' },
            { welsh: 'bob mis', english: 'every month' },
            { welsh: 'flynyddoedd yn ôl', english: 'years ago' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'eleni',
            english: 'this year',
            note: 'Learn these as whole words: (y) llynedd last year, heno tonight, neithiwr last night, yfory tomorrow, heddiw today, ddoe yesterday.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y flwyddyn nesa',
            english: 'next year',
            note: 'nesa and diwetha follow the noun: wythnos diwetha is last week. ’ma, short for yma, follows too: heno ’ma, yr wythnos ’ma. blwyddyn is feminine, so y softens it to flwyddyn.',
          },
        },
      ],
    },
    {
      id: 'held',
      kicker: 'Grammar',
      title: 'Held, chief, and supposed to',
      blocks: [
        {
          type: 'rule',
          title: 'cael ei, and a feminine festival',
          body: '“Is held” is cael, then ei, then the verb-noun. ei follows the noun. gŵyl is feminine, so you get ei chynnal, with ch, where a masculine noun would take ei gynnal.',
          examples: [
            { welsh: 'cael ei chynnal', english: 'be held (of something feminine)' },
            {
              welsh: "Mae'r ŵyl yn cael ei chynnal yng Ngwlad yr Haf",
              english: 'The festival is held in Somerset',
            },
          ],
        },
        {
          type: 'tip',
          body: 'cynnal is also “support” or “maintain”. Here it means hold an event.',
        },
        {
          type: 'say',
          line: {
            welsh: 'prif leisydd',
            english: 'lead vocalist',
            note: 'prif always comes before the noun and softens it: prif fandiau, prif leisydd. lleisydd comes from llais, voice. The plural is prif leiswyr.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Dan ni i fod i aros fan hyn',
            english: "We're supposed to wait here",
            note: 'i fod i means supposed to, and the verb-noun after the second i softens: Roedd y band i fod i berfformio. Beth mae hynny i fod i feddwl? is “What’s that supposed to mean?”',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn ofalus',
            english: 'carefully',
            note: 'yn turns an adjective into an adverb and softens it. gofalus becomes yn ofalus. yn anffodus is unfortunately; anffodus on its own is unfortunate.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'wedi anafu ei gefn',
            english: 'had injured his back',
            note: 'ei for “his” softens the next word, so cefn becomes gefn. This ei is not the passive one.',
          },
        },
      ],
    },
    {
      id: 'failed',
      kicker: 'Pattern',
      title: 'They failed, three ways',
      blocks: [
        {
          type: 'rule',
          title: 'fe, mi, and three pasts',
          body: 'fe in front of a verb with an ending marks a statement, and the verb softens. mi is the regional partner of fe. naethon and ddaru are two other ways to build the same past, each followed by a softened verb-noun.',
          examples: [
            { welsh: 'fe fethon nhw', english: "they failed; they didn't manage" },
            { welsh: 'naethon nhw fethu', english: 'they failed (with auxiliary gwneud)' },
            { welsh: 'ddaru nhw fethu', english: 'they failed (with auxiliary ddaru)' },
          ],
        },
        {
          type: 'tip',
          body: 'You can drop the particle and say methon nhw. methu â plus a verb-noun means fail to do it: fe fethon nhw â gwneud hynny.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Beth am hyn?',
            english: 'What about this?',
            note: 'hyn is this as an idea. A thing you can point at is hwn or hon: Beth am hwn/hon? That as an idea is hynny. That one is hwnnw or honno, and in speech hwnna or honna.',
          },
        },
      ],
    },
    {
      id: 'undecided',
      kicker: 'Grammar',
      title: 'The group haven’t decided',
      blocks: [
        {
          type: 'rule',
          title: 'heb stands in for “haven’t”',
          body: 'heb plus a softened verb-noun stands in for ddim wedi. Do not add ddim as well. Tydy, like dydy, is the negative of bod, and here heb carries the “not”.',
          examples: [
            {
              welsh: "Tydy'r grŵp heb benderfynu",
              english: "The group haven't decided",
            },
            { welsh: 'heb benderfynu', english: "haven't decided" },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'bydd rhaid ciwio',
            english: '(people) will have to queue',
            note: 'No person is named, so there is no i.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'bydd rhaid i bawb giwio',
            english: 'everyone will have to queue',
            note: 'Name someone and you need rhaid i, then a softened verb-noun. ciwio becomes giwio.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "os na fyddi di'n mynd",
            english: "if you're not going; if you won't be going",
            note: 'os prefers na, not ddim, and nad before a vowel: os nad ydych chi’n mynd. If-clauses often use the future.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'gan y bydd papur toiled ar gael',
            english: 'as toilet paper will be available',
            note: 'gan meaning since or because opens a that-clause. The future is gan y bydd…. The present is gan fod papur toiled ar gael. ar gael is available.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "ei fod e'n siomedig",
            english: 'that he was disappointed',
            note: 'When you report a sentence with bod, use fod. Dywedodd Bono ei fod yn siomedig comes from Roedd e’n siomedig. You may also hear ei fod e or fod e.',
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
          prompt: 'The festival is feminine. Which passive matches gŵyl?',
          answer: 'cael ei chynnal',
          options: ['cael ei gynnal', 'cael ei chynnal', 'cael ei cynnal'],
        },
        {
          type: 'check',
          prompt: 'How do you say “if you’re not going”?',
          answer: "os na fyddi di'n mynd",
          options: [
            "os ddim fyddi di'n mynd",
            "os na fyddi di'n mynd",
            "os nad fyddi di'n mynd",
          ],
        },
      ],
    },
  ],
}
