import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '6',
  intro:
    'A news piece about a university website with no Welsh. You need the call to explain, the passive with wedi, and the patterns for “why not” and “perhaps”.',
  steps: [
    {
      id: 'no-welsh',
      kicker: 'Phrase',
      title: 'A website without Welsh',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'gwefan heb Gymraeg',
            english: 'a website without Welsh',
            note: 'heb softens the next word, so Cymraeg becomes Gymraeg. heb gefnogaeth leol is without local support: heb softens cefnogaeth, and leol sits after that feminine noun.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y wefan gyhoeddus',
            english: 'the public website',
            note: 'gwefan is feminine, so the adjective softens: cyhoeddus becomes gyhoeddus. The same softening gives natur ddwyieithog and mewn ffordd weladwy. gweladwy is gweld plus -adwy, “-able”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y diffyg Cymraeg',
            english: 'the lack of Welsh',
            note: 'mynegi’r pryderon hyn means express these concerns. gwefan … yn achosi pryder is a website causing concern.',
          },
        },
        {
          type: 'tip',
          body: 'heblaw am y Gymraeg means apart from Welsh. am softens the next word, and you can leave am out. Mae’n rhyfedd iawn bod … means it is very strange that …. anghywir, incorrect, is an- plus cywir, with a nasal mutation.',
        },
      ],
    },
    {
      id: 'call-to-explain',
      kicker: 'Grammar',
      title: 'There is a call for them to explain',
      blocks: [
        {
          type: 'rule',
          title: 'mae galw ar i …',
          body: 'Galw is a noun here, so the line means there is a call on someone. The people stand after i, and that i softens the next word, so Prifysgol becomes Brifysgol. What they should do is a verb-noun, the same i plus verb-noun shape you use for encouraging someone to act.',
          examples: [
            {
              welsh: 'Mae galw ar i Brifysgol Bangor esbonio',
              english: 'There is a call for Bangor University to explain',
            },
            {
              welsh: 'mae galw ar i … + VN',
              english: 'there is a call for … to …',
            },
            {
              welsh: 'annog plant i fwyta’n iach',
              english: 'encourage children to eat healthily',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'pam nad yw',
            english: 'why … is/are not',
            note: 'pam, especially in the negative, takes a that-clause. nad stands before a vowel, as in nad yw and nad oes. pam nad yw un o’i gwefannau ar gael asks why one of its websites is not available.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "pam na fyddwch chi'n dod",
            english: "why you won't be coming",
            note: "na softens byddwch to fyddwch, and daethon to ddaethon in pam na ddaethon nhw'n ôl, why they didn't come back. na aspirates c, p, and t.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Pam na ffoniwch chi?',
            english: "Why don't you phone?",
            note: 'ff stays ff. This shape is a common way to suggest something.',
          },
        },
      ],
    },
    {
      id: 'passive',
      kicker: 'Pattern',
      title: '“Has been” needs a possessive',
      blocks: [
        {
          type: 'rule',
          title: 'wedi plus a possessive',
          body: 'Wedi straight before a verb-noun is active: the subject has done something. A possessive between them turns the phrase passive, close to an English past participle. That possessive matches the thing that underwent the action, and it changes the start of the verb-noun.',
          examples: [
            {
              welsh: "sydd wedi'i ddatblygu",
              english: 'which has been developed',
            },
            {
              welsh: 'sydd wedi datblygu',
              english: 'which has developed (active)',
            },
            { welsh: "ffenest wedi'i chau", english: 'a closed window' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'wedi’i dargedu at blant ysgol',
            english: 'targeted at schoolchildren',
            note: 'at softens the next word, so plant becomes blant.',
          },
        },
        {
          type: 'tip',
          body: "Feminine ei aspirates c, p, and t, so cau becomes chau. In tai wedi'u hailadeiladu, 'u stands for eu “their” and adds h before a vowel. ei for her, ein, and eu do the same: ei hymrwymiad, ein hymrwymiad, eu hymrwymiad, and here “its” is the feminine university.",
        },
      ],
    },
    {
      id: 'how',
      kicker: 'Phrase',
      title: 'Three ways to say how',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'pa mor bwysig',
            english: 'how important',
            note: 'pa mor asks to what extent, and mor softens pwysig to bwysig. pa mor bwysig ydi hi means how important it is.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'sut?',
            english: 'how? (in what way)',
            note: 'sut? asks about the manner. For how plus an adjective, use pa mor.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "'na bert!",
            english: 'how pretty!',
            note: "'na is the exclamation “how …!”, and it softens pert to bert. n stays n in 'na neis!",
          },
        },
        {
          type: 'tip',
          body: "mor fuan ag sy'n bosib means as soon as possible. mor softens buan to fuan and posib to bosib. yn fuan means soon, and cyn bo hir is another way to say it.",
        },
      ],
    },
    {
      id: 'perhaps',
      kicker: 'Phrase',
      title: 'Perhaps they won’t get far',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "efallai 'mod i wedi gwneud camgymeriad",
            english: 'perhaps I have made a mistake',
            note: 'Perhaps at the start of a sentence takes a that-clause, and you can also hang the word on at the end. ’mod i means that I: bod shows the nasal mutation of fy, which is often left unsaid.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ella bod nhw ar goll',
            english: "perhaps they're lost",
            note: 'falle and ella are the spoken shortenings of efallai. hwyrach is another word for perhaps, often pronounced hwrach, and it is also the comparative of hwyr, late. hwyrach na ddôn nhw means perhaps they won’t come.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ân nhw ddim yn bell iawn',
            english: "they won't get very far",
            note: 'ân nhw is the short future of mynd, irregular along with gwneud, dod, and cael. fyddan nhw ddim yn mynd is the long future. heb gefnogaeth leol ân nhw ddim yn bell iawn means without local support they won’t get very far.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'er i ni holi',
            english: 'although we asked',
            note: 'For a past event, use er plus i plus a person plus a verb-noun. er bod ni wedi holi says the same thing with bod and wedi. er ei bod ar gael mewn chwech o ieithoedd eraill means although it is available in six other languages. dewis eang o ieithoedd is a wide choice of languages. holi cwestiynau is ask questions; holi am is ask about.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ni chafwyd ymateb',
            english: 'no response was received (formal)',
            note: 'cafwyd is the past impersonal of cael, and ni aspirates it to chafwyd. The media uses this a lot. chafwyd dim ymateb is the everyday wording.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "mae'n bryd i … + VN",
            english: "it's time for … to …",
            note: 'This bryd is pryd, time, after soft mutation. Mae’n bryd i’r Brifysgol brofi … means it is time for the University to prove something. bod eu bryd ar means have their heart set on something: Efallai bod eu bryd ar statws rhyngwladol. rhyngwladol is rhwng plus gwlad plus -ol. ateb y disgwyliadau means meet the expectations.',
          },
        },
        {
          type: 'tip',
          body: 'holl stands before the noun and softens it: yr holl blant, with plant becoming blant. A short English loan in g- keeps the g, as in yr holl grantiau, dau garej, and dwy gôl. Dwedwch wrtho fo! means tell him: wrth plus o becomes wrtho, dweud wrth means say to, and derbyn wrth means receive from.',
        },
      ],
    },
    {
      id: 'bangor',
      kicker: 'Culture',
      title: 'Bangor and a bilingual area',
      blocks: [
        {
          type: 'culture',
          title: 'A public site in Gwynedd',
          body: 'The reading argues with Prifysgol Bangor over a public website that has no Welsh, though it is aimed at schoolchildren in a bilingual area. Cyngor Gwynedd is Gwynedd Council and Llywodraeth Cymru is the Welsh Government. Menna Machreth, a woman, is called myfyriwr ymchwil: that word is used for either sex. cyngor meaning a council has the plural cynghorau; cyngor meaning advice has the plural cynghorion.',
        },
        {
          type: 'say',
          line: {
            welsh: 'adlewyrchu natur ddwyieithog yr ardal',
            english: 'reflect the bilingual nature of the area',
            note: 'dwyieithog is dwy plus iaith plus -og, and feminine natur softens d to dd. cyn- means ex- and softens: cyn-gadeirydd, former chair.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Does a wnelo hynny ddim â gwleidyddiaeth',
            english: 'This has nothing to do with politics',
            note: 'wnelo is an old subjunctive that survives in this idiom. â aspirates the next word. yn ymwneud â means concerning or to do with, as in hanesion yn ymwneud â’r Gymraeg.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'eu hymrwymiad tuag at y Gymraeg',
            english: 'their commitment towards the Welsh language',
            note: 'tuag at means towards and softens, like at. ymrwymiad i is the same “commitment to”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'iddyn nhw',
            english: 'to them',
            note: 'This is the spoken form. Literary Welsh writes iddynt. gofyn iddyn nhw means ask them.',
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
          prompt: 'Which phrase means “which has been developed”?',
          answer: "sydd wedi'i ddatblygu",
          options: [
            'sydd wedi datblygu',
            "sydd wedi'i ddatblygu",
            "tai wedi'u hailadeiladu",
          ],
        },
        {
          type: 'check',
          prompt: 'How do you say “a website without Welsh”?',
          answer: 'gwefan heb Gymraeg',
          options: [
            'gwefan heb Cymraeg',
            'gwefan heb Gymraeg',
            'heblaw am y Gymraeg',
          ],
        },
      ],
    },
  ],
}
