import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '34',
  intro:
    'Gerwyn Wiliams’s poem Efrog Newydd eto, a return to New York. Prefixes, “still” and “want to”, and the literary shapes the notes lift out of the lines.',
  steps: [
    {
      id: 'still-revving',
      kicker: 'Phrase',
      title: 'The city is still revving',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Efrog Newydd eto',
            english: 'New York again',
            note: 'Poem title. Efrog is York. The traffic is ger y mannau croesi, near the crossings.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn dal i refio',
            english: 'still revving',
            note: 'dal i plus a verb-noun means still doing it, still at it since the last visit. i softens the verb: yn dal i gysgodi, still sheltering.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ddau damaid yn brin',
            english: 'two pieces short',
            note: 'An adverb phrase, so dau softens and the words follow mae directly: mae jig-so Manhattan ddau damaid yn brin.',
          },
        },
        {
          type: 'tip',
          body: 'er mwyn takes a verb-noun straight after it: er mwyn cynnal ei ffitrwydd, in order to keep up her fitness. ei is the feminine polar bear, so ffitrwydd stays as it is.',
        },
      ],
    },
    {
      id: 'di-prefix',
      kicker: 'Grammar',
      title: 'di- means un- and softens',
      blocks: [
        {
          type: 'rule',
          title: 'A prefix that undoes the word',
          body: 'di- means un- or -less, and it softens the consonant that follows. So ildio, yield, becomes di-ildio, unyielding, and syched, thirst, becomes disychedu, quench thirst. anorffen, unending, is the same kind of build, from an- and gorffen, finish.',
          examples: [
            { welsh: 'rhesi di-ildio', english: 'unyielding rows' },
            { welsh: 'disychedu', english: 'quench thirst' },
            { welsh: 'cofeb anorffen', english: 'unending memorial' },
          ],
        },
      ],
    },
    {
      id: 'want-to',
      kicker: 'Pattern',
      title: 'am means want to',
      blocks: [
        {
          type: 'rule',
          title: 'The object stands in front',
          body: 'Put am before a verb-noun and the phrase means want to. am softens that verb-noun, and the object is a possessive standing in front of it, so ein disychedu is quench our thirst, literally our quenching. The cameras use that same object: y camerâu sy’n ein canlyn, the cameras that follow us, with canlyn the literary partner of dilyn.',
          examples: [
            { welsh: 'am ein disychedu', english: 'want to quench our thirst' },
            {
              welsh: 'mae gwerthwyr y strydoedd am ein disychedu',
              english: 'the street sellers want to quench our thirst',
            },
            {
              welsh: 'y camerâu sy’n ein canlyn',
              english: 'the cameras that follow us',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'sy’n troi chwistrellwr hufen haul yn arf terfysgol',
            english: 'which turn a sun-cream spray into a terrorist weapon',
            note: 'troi X yn Y means turn X into Y. am yn ail â means alternately with, and â aspirates: am yn ail â photeli dŵr.',
          },
        },
        {
          type: 'tip',
          body: "wrthi'n plus a verb-noun means busy doing it: maen nhw wrthi'n ailgynllunio, they are busy redesigning. ail-, re-, softens cynllunio.",
        },
      ],
    },
    {
      id: 'glimpse',
      kicker: 'Phrase',
      title: 'A glimpse as it goes by',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'cawn gip',
            english: 'we get a glimpse',
            note: 'cawn is cawn ni, the same as dan ni’n cael. The object cip softens. Speech usually says cipolwg. The line is cawn gip o’r haul wrth iddo taro.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'wrth iddo taro',
            english: 'as it strikes',
            note: 'wrth plus i plus a subject plus a verb-noun means as that happens. The verb-noun softens, so taro becomes daro. wrth fynd heibio is the shorter in passing, and wrth softens there too.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'bob hyn a hyn',
            english: 'every now and then',
            note: 'A useful idiom. After a, the line is A phob hyn a hyn, with the aspirate mutation.',
          },
        },
        {
          type: 'tip',
          body: 'Fifteen years ago is bymtheng mlynedd yn ôl. Time-when softens pymtheng to bymtheng, and that number then puts a nasal mutation on blynedd.',
        },
      ],
    },
    {
      id: 'hold-back',
      kicker: 'Phrase',
      title: 'This city will not hold back',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'nid dinas i ymbwyllo mo hon',
            english: 'this is no city to hold itself back',
            note: 'ymbwyllo is hold oneself back, from ym- and pwyll, caution. In plain terms, the city does not hang back. It is yn sglyfaeth i gystadleuaeth, prey to competition, and i softens.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ar gyfer dydd ei goruchafiaeth hithau',
            english: 'for the day of her own supremacy',
            note: 'hithau is contrastive hi, she herself or she too, set against the taxis and the pedestrians. The feminine city claims a title iddi hi ei hun, for itself.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ni allwn ddianc rhag',
            english: 'we cannot escape from',
            note: 'Literary ni softens gallwn, then the verb-noun dianc softens to ddianc. dianc rhag is escape from. er bod means although: er bod y sgrin sy’n dal ein llun yn adloniant, although the screen that holds our picture is entertainment.',
          },
        },
      ],
    },
    {
      id: 'crown',
      kicker: 'Culture',
      title: 'A Crown poem back in New York',
      blocks: [
        {
          type: 'culture',
          title: 'Gerwyn Wiliams and the literary page',
          body: 'Efrog Newydd eto is by Gerwyn Wiliams; Efrog is York. Tynnu gwaed, drawing blood, and Colli cyswllt, losing touch, are early prize-winning titles, and Dolenni, “Links”, won the Crown in 1994. On the page, uwch and cip are the literary words; speech prefers uwchben and cipolwg, and tu hwnt i, beyond, softens the word after i.',
        },
        {
          type: 'say',
          line: {
            welsh: 'arth wen',
            english: 'polar bear',
            note: 'Literally a white bear. arth is feminine, so gwyn softens to wen, plural eirth gwynion, and she swims nofio’n ddefodol, ritualistically. y creaduriaid call are the sensible creatures; hirben is shrewd, literally long-headed.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'tir neb',
            english: "no man's land",
            note: 'Literally nobody’s land. y Rhyfel Byd Cyntaf keeps cyntaf after the noun, and Rhyddiaith Gymraeg, Welsh prose, softens the adjective after feminine rhyddiaith.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ym mhair y peirianwyr',
            english: "in the engineers' melting pot",
            note: 'yn nasals the p of pair, a cauldron or melting pot, and the phrase is written ym mhair. The same nasal gives yng nghrochan yr adeiladwyr, in the builders’ pot. Nearby, cerfluniau rhyddid, colofnau rhyfyg: statues of freedom, columns of arrogance.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which line fits?',
      blocks: [
        {
          type: 'check',
          prompt: 'What does yn dal i refio mean?',
          answer: 'still revving',
          options: ['still revving', 'in order to rev', 'every now and then'],
        },
        {
          type: 'check',
          prompt: 'Why does the polar bear appear as arth wen?',
          answer: 'arth is feminine, so gwyn softens to wen',
          options: [
            'arth is feminine, so gwyn softens to wen',
            'wen is the dictionary word for bear',
            'hithau softens the noun',
          ],
        },
      ],
    },
  ],
}
