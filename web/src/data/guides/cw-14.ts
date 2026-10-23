import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '14',
  intro:
    'How to say what would happen if it were so, in northern and southern Welsh. Along the way: two words for “never”, two helpers for the past, and the sound of a dialect.',
  steps: [
    {
      id: 'if-and-me-too',
      kicker: 'Phrase',
      title: 'If he were here, and me too',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Tasai'ch brawd fan'ma…",
            english: 'If your brother were here…',
            note: "A closed “if”. pe is often dropped. fan'ma is colloquial “here”, often in the north.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'welest ti mono innau, a weles i monot tithau',
            english: "you didn't see me, and I didn't see you",
            note: 'mo plus an inflected preposition marks the object of a negative verb. innau and tithau set the two people in contrast.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'a finnau (hefyd)',
            english: 'me too',
            note: 'innau is also finnau or minnau. The partners are tithau, yntau, hithau, ninnau, chithau, and nhwthau. na finnau (chwaith) is “me neither”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'A chithau',
            english: 'And (the same to) you too',
            note: 'The set reply to Nadolig Llawen.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "'sdim clem 'da fi",
            english: "I haven't a clue",
            note: "'sdim is does dim. clem, “clue”, mostly lives in this phrase.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Dan ni isio bod efo'n gilydd",
            english: 'We want to be together',
            note: "ein gilydd is “each other” for we; after a vowel it shrinks to 'n gilydd. The south says gyda'n gilydd. For they, spell it ei gilydd, with singular ei. a hithau heb nosi uses hithau for impersonal “it”: “and it’s not even dark yet”.",
          },
        },
        {
          type: 'tip',
          body: "cau dy ben is “shut up”, literally “shut your head”. y bore glas is the crack of dawn, 'na beth od is “how strange”, and gwneud y tro is “do the trick” (neith hi mo'r tro when it will not).",
        },
      ],
    },
    {
      id: 'would-be',
      kicker: 'Grammar',
      title: '“Would be” is bydd- or bas-',
      blocks: [
        {
          type: 'rule',
          title: 'Same endings, two stems',
          body: "The conditional of bod takes the same endings as dylwn i and gallwn i. The south builds it on bydd-: byddwn i, byddet ti, byddai fe. The north builds it on bas-, and often drops ba-, so baswn i is heard as 'swn i and basech chi as 'sech chi.",
          examples: [
            { welsh: 'byddwn i', english: 'I would be (South)' },
            { welsh: 'baswn i', english: 'I would be (North)' },
            { welsh: "'swn i", english: 'I would be (short, North)' },
          ],
        },
        {
          type: 'tip',
          body: "To say what someone would do, add 'n and a verb-noun: Byddwn i'n mynd, or Baswn i'n mynd in the north. “Would have” uses wedi instead: Byddwn i wedi mynd. A question softens the first letter, Fyddai hi'n cytuno?, a negative uses ddim, and a tag places on' before the full conditional, with the pronoun optional.",
        },
        {
          type: 'say',
          line: {
            welsh: "Fydden nhw gartre erbyn hyn, on' bydden (nhw)?",
            english: "They would be home by now, wouldn't they?",
            note: "A northern tag keeps bas-: 'Sai fe o blaid, on' basai (fe)? o blaid is “in favour”.",
          },
        },
        {
          type: 'say',
          line: {
            welsh:
              "Wedodd Sioned y byddai hi'n prynu ffôn symudol y diwrnod wedyn",
            english: 'Sioned said she would buy a mobile phone the next day',
            note: 'Report a spoken future with bydd-. She had said Bydda i\'n prynu ffôn symudol yfory, and “tomorrow” becomes y diwrnod wedyn.',
          },
        },
      ],
    },
    {
      id: 'open-and-closed-if',
      kicker: 'Pattern',
      title: 'os may still happen; tas- imagines',
      blocks: [
        {
          type: 'rule',
          title: 'Open if, closed if',
          body: 'os is for an open condition, something that may still happen, and it takes the present or the future. After os, Welsh uses the future where English often uses a present. pe marks a closed condition and takes the conditional; in the north bas- becomes tas- after pe, and pe is often dropped, so tasai alone means “if he or she were”.',
          examples: [
            {
              welsh: 'Os bydd Ron yno heno, weda i wrtho fe',
              english: "If Ron is there tonight, I'll tell him",
            },
            {
              welsh: "Pe byddai Ron fan hyn, fyddwn i'n dweud wrtho",
              english: 'If Ron were here, I would tell him (South)',
            },
            {
              welsh: "Tasai Ron fan'ma, 'swn i'n dweud wrtho",
              english: 'If Ron were here, I would tell him (North)',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'fel petai',
            english: 'as it were',
            note: 'petai is a closed-condition form of bod: “as if it were”.',
          },
        },
        {
          type: 'tip',
          body: 'You will also hear os with a conditional, especially in the south: os byddai fe\'n mynd. In print, os hoffech chi ddod is common, beside the closed form pe hoffech chi ddod.',
        },
      ],
    },
    {
      id: 'byth-erioed',
      kicker: 'Grammar',
      title: 'byth and erioed are different nevers',
      blocks: [
        {
          type: 'rule',
          title: 'Match the tense',
          body: 'byth is the “ever / never” that goes with yn plus a verb-noun, and with the future. erioed goes with wedi plus a verb-noun, and with the preterite, including nes i and ddaru. Answer a present or future question with Byth, and a perfect or past question with Erioed.',
          examples: [
            {
              welsh: "Dw i byth yn siarad Saesneg â hi",
              english: 'I never speak English to her',
            },
            {
              welsh: 'Dw i erioed wedi siarad Saesneg â hi',
              english: 'I have never spoken English to her',
            },
            {
              welsh: "Welwn ni byth monyn nhw 'to",
              english: "We'll never see them again",
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Weles i erioed y fath lanast',
            english: 'I never saw such a mess',
            note: 'erioed with the preterite. y fath softens the following noun: llanast becomes lanast.',
          },
        },
        {
          type: 'tip',
          body: "After a superlative, erioed means “ever”: Dyma'r gaea gwaetha erioed is “the worst winter ever”, with gaeaf shortened to gaea in speech. am byth means “for ever”.",
        },
      ],
    },
    {
      id: 'did-and-probably',
      kicker: 'Pattern',
      title: '“I did” and “probably” have set places',
      blocks: [
        {
          type: 'rule',
          title: 'nes i, or ddaru in the north',
          body: 'The past of gwneud plus a soft-mutated verb-noun is another preterite: nes i weld means the same as gweles i. A question uses those same words with a rising tune, and a negative keeps the verb-noun in dictionary form after ddim, as in Nes i ddim gweld. In the north, ddaru stays the same for every person, and mi stands in for i: ddaru mi weld.',
          examples: [
            { welsh: 'nes i weld', english: 'I saw' },
            { welsh: 'Nes i ddim gweld', english: "I didn't see" },
            { welsh: 'ddaru mi weld', english: 'I saw (North)' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "Be' ddaru ti brynu?",
            english: 'What did you buy?',
            note: 'Southern and general Welsh: Beth nest ti brynu?',
          },
        },
        {
          type: 'tip',
          body: "mae'n debyg, mae'n ymddangos, efallai, gobeithio, and northern hwyrach stand at the start of the sentence or tag the end. Mae'n debyg bod hi'n mynd i fwrw pnawn 'ma. In formal writing, mae'n ymddangos becomes ymddengys.",
        },
      ],
    },
    {
      id: 'dialects',
      kicker: 'Culture',
      title: 'Dialects are ordinary Welsh',
      blocks: [
        {
          type: 'culture',
          title: 'North, south, and Sir Benfro',
          body: 'A tafodiaith can differ in ynganu, goslef, geirfa, gramadeg, and cystrawen, and that variety is ordinary Welsh. In the south, chw- often shrinks, so chwech is heard as wech and chwarae as warae; in Sir Benfro (Pembrokeshire), oe becomes wê, so oedd hi is wêdd hi and oes is wês. In the north, an unstressed e in a final syllable often sounds like a, so rhedeg sounds like rhedag and halen like halan.',
        },
        {
          type: 'say',
          line: {
            welsh: 'wech',
            english: 'six (South)',
            note: 'Standard spelling is chwech. chwarae likewise becomes warae.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'wêdd hi',
            english: 'she/it was (Pembrokeshire)',
            note: 'Standard spelling is oedd hi. The local “there is” is wês, for oes.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'shwd',
            english: 'how (South)',
            note: 'General and northern Welsh uses sut. In the south, “up” is lan and “want” is moyn.',
          },
        },
        {
          type: 'tip',
          body: 'Welsh names you will meet on the map: Caergaint is Canterbury, Caerliwelydd is Carlisle, and Caeredin is Edinburgh. Y Barri is Barry, and Aberteifi is Cardigan.',
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which if, and which never?',
      blocks: [
        {
          type: 'check',
          prompt:
            'Ron is not here. Which northern sentence means “If Ron were here, I would tell him”?',
          answer: "Tasai Ron fan'ma, 'swn i'n dweud wrtho",
          options: [
            'Os bydd Ron yno heno, weda i wrtho fe',
            "Tasai Ron fan'ma, 'swn i'n dweud wrtho",
            'Os ydy Ron fan hyn rhwyle, ga i air ag e',
          ],
        },
        {
          type: 'check',
          prompt: 'Which sentence means “I have never spoken English to her”?',
          answer: 'Dw i erioed wedi siarad Saesneg â hi',
          options: [
            "Dw i byth yn siarad Saesneg â hi",
            'Dw i erioed wedi siarad Saesneg â hi',
            "Welwn ni byth monyn nhw 'to",
          ],
        },
      ],
    },
  ],
}
