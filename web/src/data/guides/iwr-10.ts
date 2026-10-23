import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '10',
  intro:
    'Taith S4C is a tour of public meetings about the Welsh channel’s future. The Welsh is formal: watch “only”, a few mutations, and the written shapes of we, could, and must.',
  steps: [
    {
      id: 's4c',
      kicker: 'Culture',
      title: 'A tour about the Welsh channel',
      blocks: [
        {
          type: 'culture',
          title: 'S4C and Westminster',
          body: 'Sianel Pedwar Cymru is the Welsh-language television channel, launched in late 1982. Taith S4C is a tour of public meetings on its future, the cuts it faces, and the fear of being swallowed up by the BBC. San Steffan is the ordinary name for Westminster, and it means the UK parliament.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Sianel Pedwar Cymru',
            english: 'Channel Four Wales (S4C)',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Cymdeithas yr Iaith Gymraeg',
            english: 'the Welsh Language Society',
            note: 'iaith is feminine, so Cymraeg softens to Gymraeg.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'cyfres o gyfarfodydd cyhoeddus',
            english: 'a series of public meetings',
            note: 'o soft-mutates, so cyfarfodydd becomes gyfarfodydd.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Gweinidogion San Steffan',
            english: 'Westminster ministers',
          },
        },
      ],
    },
    {
      id: 'balance',
      kicker: 'Phrase',
      title: 'The future is in the balance',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Mae dyfodol S4C yn y fantol',
            english: 'The future of S4C is in the balance',
            note: 'Learn yn y fantol as a fixed phrase.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'toriadau i’w chyllid',
            english: 'cuts to its finances',
            note: 'i plus ei becomes i’w and keeps the mutation, so cyllid becomes chyllid. The same aspirate is in cael ei thraflyncu gan y BBC.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn nwylo',
            english: 'in the hands of',
            note: 'yn causes nasal mutation. dwylo, the plural of llaw, becomes nwylo.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'cael gwared â hi yn llwyr',
            english: 'get rid of it completely',
            note: 'yn llwyr is the adverb from llwyr, “complete”.',
          },
        },
        {
          type: 'tip',
          body: 'rhaglenni Cymraeg o safon is the idiomatic way to say quality Welsh programmes. â aspirates the next word, in cael gwared â, delio â, and ymgynghori â; cyfrannu at and erfyn ar take a soft mutation. Dros yr wythnosau nesaf means over the coming weeks, and speech usually shortens nesaf to nesa.',
        },
      ],
    },
    {
      id: 'unig',
      kicker: 'Grammar',
      title: 'Only stands in front of the noun',
      blocks: [
        {
          type: 'rule',
          title: 'unig before, lonely after',
          body: 'Before a noun, unig means “only”, and it soft-mutates the following word, as every adjective in front does. After the noun, the same word means “lonely”. After ein, unig takes an h, which is why the phrase is ein hunig sianel.',
          examples: [
            { welsh: 'ein hunig sianel', english: 'our only channel' },
            { welsh: 'yr unig dro', english: 'the only time' },
            { welsh: 'yr unig rai a ddaeth', english: 'the only ones who came' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'dyfodol ein hunig sianel deledu Gymraeg',
            english: 'the future of our only Welsh television channel',
            note: 'There is no word for “of”, and no article before dyfodol. Feminine sianel softens teledu to deledu and Cymraeg to Gymraeg.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'annibyniaeth olygyddol lwyr',
            english: 'complete editorial independence',
            note: 'annibyniaeth is feminine, so the adjectives after it are already softened.',
          },
        },
      ],
    },
    {
      id: 'rhaid',
      kicker: 'Pattern',
      title: 'Must, with nobody in the sentence',
      blocks: [
        {
          type: 'rule',
          title: 'rhaid reads as a passive',
          body: 'Rhaid with no person in front of it is best read as an English passive: something must be guaranteed. In the present, the mae of Mae rhaid is usually left out. Other tenses keep the verb, so roedd rhaid is the past and bydd rhaid is the future.',
          examples: [
            { welsh: 'Rhaid gwarantu …', english: '… must be guaranteed' },
            { welsh: 'roedd rhaid …', english: '… had to' },
            { welsh: 'bydd rhaid …', english: '… will have to' },
          ],
        },
        {
          type: 'tip',
          body: '“Used to” is arfer plus a verb-noun: o’n i’n arfer byw yma. oedden nhw’n arfer talu means they used to pay. Formal writing can put a in front of oedden; in speech you usually hear the mutation alone.',
        },
      ],
    },
    {
      id: 'written',
      kicker: 'Grammar',
      title: 'Could and should soften the verb',
      blocks: [
        {
          type: 'rule',
          title: 'Unreality forms',
          body: 'gallai, dylai, gallwn, medrwn, hoffwn, and dylwn are the could, should, and would-like forms. A verb-noun after them takes a soft mutation, so perfformio becomes berfformio. hoffwn and leiciwn can take a verb-noun or a noun; dylwn and dylai always take a verb-noun.',
          examples: [
            { welsh: 'gallai S4C berfformio', english: 'S4C could perform' },
            {
              welsh: 'y Cynulliad Cenedlaethol … ddylai ddelio â darlledu',
              english: 'it is the National Assembly that should deal with broadcasting',
            },
            { welsh: 'hoffwn', english: 'I would like' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'rydym',
            english: 'we are (formal)',
            note: 'Written Welsh for dyn ni or dan ni. credwn is “we believe” in the same style.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ni fydd hynny’n bosib',
            english: 'that will not be possible',
            note: 'ni before the verb is the literary negative, and it soft-mutates (aspirate before c, p, t). Speech says fydd hynny ddim yn bosib.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'penderfynwyd',
            english: 'was decided',
            note: 'The past impersonal ending -wyd is normal in writing.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Nadolig Llawen oddi wrth bawb yn y swyddfa',
            english: 'Happy Christmas from everyone in the office',
            note: 'oddi wrth is “from” a person, with soft mutation, and it is the usual choice in letters. na means “nor”: na’r Llywodraeth. A place uses o, as in dw i’n dod o Gymru.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Adran Ddiwylliant dan ofal Jeremy Hunt',
            english: 'the Department of Culture headed by Jeremy Hunt',
            note: 'dan soft-mutates, so gofal becomes ofal.',
          },
        },
        {
          type: 'tip',
          body: 'mai opens a focused that-clause, with the key phrase first: mai ar ysgwyddau pobol Cymru y mae’r cyfrifoldeb. y before a verb also means “that”. gwahoddwn ni chi yn daer is a formal “we earnestly invite you”, and taer yw’r gwir am y golau is a proverb: truth will out.',
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
          prompt: 'Which phrase means “the only time”?',
          answer: 'yr unig dro',
          options: ['yr unig tro', 'yr unig dro', 'y dro unig'],
        },
        {
          type: 'check',
          prompt: 'Rhaid gwarantu … names no person. What does it mean?',
          answer: '… must be guaranteed',
          options: [
            '… must guarantee',
            '… must be guaranteed',
            '… used to guarantee',
          ],
        },
      ],
    },
  ],
}
