import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '13',
  intro:
    'How a community paper reports a championship season. Watch feminine softening, the odd forms of “young”, and â in “as well as”.',
  steps: [
    {
      id: 'season',
      kicker: 'Phrase',
      title: 'What a season',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Pencampwyr!',
            english: 'Champions!',
            note: 'One pencampwr, many pencampwyr.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Am dymor!',
            english: 'What a season!',
            note: 'am plus a noun means “What a …!”, and the noun soft-mutates. tymor becomes dymor.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Mawr fu'r dathlu",
            english: 'Great was the celebrating; there were great celebrations',
            note: 'mawr is pulled forward for emphasis. The verb-noun dathlu stands as a noun, with the article.',
          },
        },
        {
          type: 'tip',
          body: 'Hufen ar y gacen is the icing on the cake, literally the cream on the cake. i sicrhau record cant y cant is to secure a hundred-per-cent record. curo is “beat”, and also “knock”: curo ar y drws.',
        },
      ],
    },
    {
      id: 'feminine',
      kicker: 'Grammar',
      title: 'Feminine nouns soften after the article',
      blocks: [
        {
          type: 'rule',
          title: 'hon and honno, not hwn',
          body: 'After the article, a feminine singular soft-mutates, and so does an adjective that follows it. gêm keeps its g, but cenedlaethol still softens. Point at these nouns with hon or honno, not hwn or hwnnw.',
          examples: [
            { welsh: 'y gêm genedlaethol', english: 'the national game' },
            { welsh: 'Wedi ennill y gynghrair', english: 'having won the league' },
            { welsh: 'y gamp honno', english: 'that feat' },
          ],
        },
        {
          type: 'tip',
          body: 'The same softening shows in pump o’r garfan (five of the squad), yr holl fro (the whole area), and ar y raddfa hon (on this scale).',
        },
      ],
    },
    {
      id: 'younger',
      kicker: 'Pattern',
      title: 'Standard younger is iau',
      blocks: [
        {
          type: 'rule',
          title: 'ifanc, iau, ieuaf',
          body: 'In the standard language the comparative of ifanc is iau, and the superlative is ieuaf. Speech often drops the final -f, so ieuaf sounds like ieua. You will also hear regular rebuilds: ifancach or fengach for younger, and ifancaf (spoken ifanca) or fenga for youngest.',
          examples: [
            { welsh: 'iau', english: 'younger; junior' },
            { welsh: 'ieuaf', english: 'youngest (standard)' },
            {
              welsh: 'o’r tîm cyntaf i’r tîm ifancaf',
              english: 'from the first team to the youngest',
            },
          ],
        },
        {
          type: 'tip',
          body: 'Adran Iau is the junior division; Adran 2 is Division 2. y tîm ieuenctid is the youth team. to ifanc o chwaraewyr dawnus is a young generation of gifted players — to is also the word for roof, and dawnus comes from dawn, a gift.',
        },
      ],
    },
    {
      id: 'whole',
      kicker: 'Pattern',
      title: 'Whole follows the noun',
      blocks: [
        {
          type: 'rule',
          title: 'cyfan, then y cyfan',
          body: 'cyfan follows its noun and soft-mutates after a feminine one. drwy soft-mutates too, so “throughout Wales” is drwy Gymru gyfan, and “for a whole year” is am flwyddyn gyfan. On its own, y cyfan means the lot, the same as y cwbl (also spelt y cwbwl).',
          examples: [
            { welsh: 'drwy Gymru gyfan', english: 'throughout the whole of Wales' },
            { welsh: 'am flwyddyn gyfan', english: 'for a whole year' },
            { welsh: "mae'r cyfan wedi mynd", english: "it's all gone" },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "wedi'r cyfan",
            english: 'after all',
            note: "Same as wedi'r cwbl. Also anghofies i'r cyfan (I forgot the lot) and rho'r cyfan mewn fan hyn (put it all in here). yn gyfangwbl, also spelt yn gyfangwbwl, means completely.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'gemau cyfeillgar yn unig',
            english: 'friendly games only',
            note: 'yn unig follows the noun it limits. dalwyr tocynnau tymor yn unig is season ticket holders only. Before the noun, unig soft-mutates: yr unig gemau, the only games.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'diwrnod y gêm olaf',
            english: 'the day of the last game',
            note: 'olaf is last in a sequence, often ola in speech. diwetha, written diwethaf, is the most recent.',
          },
        },
      ],
    },
    {
      id: 'as-well',
      kicker: 'Grammar',
      title: 'As well as takes â',
      blocks: [
        {
          type: 'rule',
          title: 'â aspirates; ag before a vowel',
          body: 'yn ogystal on its own is “as well”. Before a noun, use yn ogystal â, and that â aspirates p, t, and c, so creision becomes chreision. Before a vowel, â switches to ag.',
          examples: [
            {
              welsh: 'selsig yn ogystal â chreision',
              english: 'sausages as well as crisps',
            },
            {
              welsh: 'bu canu yn ogystal ag yfed',
              english: 'there was singing as well as drinking',
            },
            {
              welsh: 'gan gynnwys',
              english: 'including',
              note: 'Learn it as a unit, with the soft mutation already in place. The opposite is ac eithrio, apart from.',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'ynghyd â tho ifanc',
            english: 'together with a young generation',
            note: 'â turns to into tho. With no â, to stays to. a aspirates as well: cyfuniad o gryfder a phrofiad, a combination of strength and experience.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "mae'r gamp wedi'i chyflawni",
            english: 'the feat has been achieved',
            note: "wedi does not mutate the verb-noun, so the active line is sydd wedi cyflawni'r gamp. A printed wedi chyflawni mixes that up with this passive. Passive wedi plus ei uses ei “her” for feminine camp, and that ei aspirates: chyflawni.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Pwy fuasai wedi meddwl',
            english: 'Who would have thought',
            note: 'buasai is the literary spelling of basai, the conditional of bod, the same as byddai. The u is not pronounced. wedi plus a verb-noun makes “would have”.',
          },
        },
        {
          type: 'tip',
          body: 'Learn these as units: o ystyried fod (considering that; bod becomes fod), ychydig dros chwarter canrif (a little over a quarter of a century; dros soft-mutates), yn ystod (during), o amgylch and o gwmpas (around), and mewn cyn lleied o amser (in so little time; also spelt cynlleied).',
        },
      ],
    },
    {
      id: 'paper',
      kicker: 'Culture',
      title: 'The national game has a local paper',
      blocks: [
        {
          type: 'culture',
          title: 'Papur bro',
          body: 'In Wales the national game, y gêm genedlaethol, is rugby. A papur bro is that district’s Welsh-language monthly — Clebran is the one for the Preseli area. The cup in a report like this is Cwpan Her Sir Benfro, the Pembrokeshire Challenge Cup.',
        },
        {
          type: 'say',
          line: {
            welsh: 'papur bro',
            english: 'community newspaper',
            note: 'Plural papurau bro. bro is a region or locality.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'cyfleusterau heb eu hail',
            english: 'facilities second to none',
            note: 'Literally “without their second”. One masculine thing is heb ei ail; a feminine one is heb ei hail, with h- after ei “her”.',
          },
        },
        {
          type: 'tip',
          body: 'caredigion, the plural of caredig, is the friends and supporters. diflino is tireless: di- “without” plus blino “tire”, with soft mutation. A pwyllgorwr is a committee member, from pwyllgor. yn destun llawenydd is a cause of rejoicing, mae pethau yn argoeli’n dda means things bode well, and yn gymwys i chwarae means eligible to play.',
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
          prompt: 'Which is “throughout the whole of Wales”?',
          answer: 'drwy Gymru gyfan',
          options: ['drwy Gymru cyfan', 'drwy Gymru gyfan', 'drwy Cymru gyfan'],
        },
        {
          type: 'check',
          prompt: 'Which is “that feat”?',
          answer: 'y gamp honno',
          options: ['y camp hwnnw', 'y gamp honno', 'y camp honno'],
        },
      ],
    },
  ],
}
