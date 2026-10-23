import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '32',
  intro:
    'How a review describes Tolkien’s dealings with Welsh, from Middle Welsh to the languages he invented. Literary verbs, peth without o, and the impersonal endings of formal writing.',
  steps: [
    {
      id: 'languages',
      kicker: 'Phrase',
      title: 'Welsh sits behind the invented languages',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Tolkien a'r Gymraeg",
            english: 'Tolkien and Welsh',
            note: 'The chapter title: his dealings with Wales and with Welsh.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Cymraeg Canol',
            english: 'Middle Welsh',
            note: 'gafael Tolkien ar Gymraeg Canol is his grasp of it. ar softens Cymraeg to Gymraeg.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Sindarin',
            english: 'Sindarin',
            note: 'The elvish language of Middle Earth. Welsh is the main inspiration behind it.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Quenya',
            english: 'Quenya',
            note: 'Modelled i raddau helaeth on Finnish (Ffinneg), then later became Sindarin. i ba raddau is “to what extent”; both phrases soften graddau.',
          },
        },
        {
          type: 'tip',
          body: 'gafael is a verb-noun used as a real noun. gafael Tolkien means “Tolkien’s grasp”.',
        },
      ],
    },
    {
      id: 'literary',
      kicker: 'Grammar',
      title: 'Written verbs are the short forms',
      blocks: [
        {
          type: 'rule',
          title: 'Literary present and imperfect',
          body: 'This review is formal Welsh, so the verbs arrive in their short written shapes. dengys is “shows”, where speech says mae … yn dangos, and Daw\'n eglur treats daw, the short future of dod, as a present. Imperfects follow the same habit: mynnai means “insisted”, carai means “he liked”, and ef is the literary “he”.',
          examples: [
            { welsh: 'dengys', english: 'shows (literary)' },
            { welsh: "Daw'n eglur", english: 'It becomes clear' },
            { welsh: 'yn ei dyb ef', english: 'in his estimation' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'ac y gallai',
            english: 'and that he could',
            note: 'In this style, y opens a “that” clause: ac y gallai ddeall.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "yng ngeni 'Middle Earth' ei nofelau",
            english: 'in the birth of the Middle Earth of his novels',
            note: 'Two genitives stacked. yng nasalises geni to ngeni.',
          },
        },
      ],
    },
    {
      id: 'peth',
      kicker: 'Pattern',
      title: 'peth skips o',
      blocks: [
        {
          type: 'rule',
          title: 'No o, and no mutation',
          body: 'Most words for an amount need o, and that o softens the noun. You say ychydig o laeth, llawer o laeth, and digon o laeth. peth means “a certain amount” and stands straight against the noun, with no o and no mutation.',
          examples: [
            { welsh: 'peth Cymraeg', english: 'a certain amount of Welsh' },
            { welsh: 'ychydig o laeth', english: 'a little milk' },
            { welsh: 'digon o laeth', english: 'enough milk' },
          ],
        },
      ],
    },
    {
      id: 'impersonal',
      kicker: 'Grammar',
      title: 'Impersonal endings change the vowel',
      blocks: [
        {
          type: 'rule',
          title: '-ir and -id, but not -wyd',
          body: 'When nobody is named as the doer, written Welsh uses an impersonal ending. Present -ir and imperfect -id both turn an a in the stem into e, so siarad gives siaredir “is spoken” and siaredid “was spoken”. The past ending -wyd leaves that vowel alone: siaradwyd.',
          examples: [
            { welsh: 'siaredir', english: 'is/are spoken' },
            { welsh: 'lle siaredid', english: 'where … was/were spoken' },
            { welsh: 'siaradwyd', english: 'was/were spoken (past impersonal)' },
          ],
        },
        {
          type: 'tip',
          body: 'Imperfect -id stays on the page. dylid “one should” is the exception you can say aloud.',
        },
        {
          type: 'say',
          line: {
            welsh: 'fe geir y teimlad',
            english: 'one gets the feeling',
            note: 'ceir is the impersonal of cael, and fe softens it to geir. Lle ymdrinnir â is the formal “as regards”.',
          },
        },
      ],
    },
    {
      id: 'mutation',
      kicker: 'Pattern',
      title: 'A missing word still leaves a mutation',
      blocks: [
        {
          type: 'rule',
          title: 'Soft mutation does the marking',
          body: 'A relative a “who” is often left out, but its soft mutation remains. unrhyw un all agor means “anyone who can open”, because gall has become all. After bu i “was to”, the verb-noun softens too, so troi becomes droi, and a focused sentence leads with the word that matters: amwys oedd agwedd Tolkien.',
          examples: [
            { welsh: 'unrhyw un all agor', english: 'anyone who can open' },
            {
              welsh: "Bu i Quenya droi'n Sindarin",
              english: 'Quenya was to turn to Sindarin',
            },
            {
              welsh: 'amwys oedd agwedd Tolkien',
              english: "Tolkien's attitude was ambiguous",
            },
          ],
        },
        {
          type: 'tip',
          body: 'Comparatives in -ach turn a final b, d, or g voiceless: gwlypach “wetter”, rhatach “cheaper”, tebycach “more likely”. pwysicach o dipyn is “quite a bit more important”, and o softens tipyn.',
        },
        {
          type: 'say',
          line: {
            welsh: 'echblyg Gristnogol',
            english: 'explicitly Christian',
            note: 'The mutation on Cristnogol shows echblyg is an adverb here.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'union ddyled Tolkien',
            english: "Tolkien's exact debt",
            note: 'An adjective before its noun softens it: dyled becomes ddyled.',
          },
        },
      ],
    },
    {
      id: 'pattern-not-words',
      kicker: 'Culture',
      title: 'The feat was the pattern',
      blocks: [
        {
          type: 'culture',
          title: 'Sindarin follows Welsh, not a word list',
          body: 'Welsh is the main inspiration behind Sindarin, and Quenya, modelled largely on Finnish, was later to become Sindarin, beside trawsffurfiad y Frythoneg yn Gymraeg. Camp Tolkien oedd nid dwyn geiriau Cymraeg: he sensed the inherent traits, liked the mutations, and built new words on that pattern. The language fired his imagination more than the literature, and the deeper debt was to English and Norse texts.',
        },
        {
          type: 'say',
          line: {
            welsh: 'amon',
            english: 'mountain (Sindarin)',
            note: 'Plural emyn. The Welsh parallel is agor / egyr. This emyn is not the hymn.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn y bôn',
            english: 'basically',
            note: 'A useful pause, and overused. The Arthurian romances are yn y bôn literature of France and England, and their Christian tone was a maen tramgwydd.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'fodd bynnag',
            english: 'however',
            note: 'Same meaning as serch hynny. ond eto is “but then again”, and at ei gilydd is “on the whole”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'gydol ei fywyd',
            english: 'all his life',
            note: 'Also gydol ei oes. gydol shortens drwy gydol “throughout”, and ei softens bywyd to fywyd.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which form is right?',
      blocks: [
        {
          type: 'check',
          prompt: 'Which phrase means “a certain amount of Welsh”?',
          answer: 'peth Cymraeg',
          options: ['peth o Gymraeg', 'peth Cymraeg', 'ychydig o Gymraeg'],
        },
        {
          type: 'check',
          prompt: 'Which verb fits “Norse was spoken”, in this written style?',
          answer: 'Siaredid Norseg',
          options: ['Siaradwyd Norseg', 'Siaredid Norseg', 'Siaredir Norseg'],
        },
      ],
    },
  ],
}
