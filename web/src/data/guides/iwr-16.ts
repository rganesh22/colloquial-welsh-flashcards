import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '16',
  intro:
    'How a weather forecast is worded: shorthand lines, “pretty hard”, and comparatives such as milder and wetter. Two days, three days, and tomorrow have their own short forms.',
  steps: [
    {
      id: 'forecast',
      kicker: 'Phrase',
      title: 'The forecast leaves the verb out',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'rhagolygon y tywydd',
            english: 'the weather forecast',
            note: 'rhagolygon is the plural of rhagolwg. North is gogledd, northerly is gogleddol (gwyntoedd gogleddol); south is de, southerly is deheuol. East is dwyrain and west is gorllewin.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ond hynny ddim yn para',
            english: 'but that (is) not lasting',
            note: 'mae and bydd are left out. ddim is the soft mutation of dim.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'rhywfaint o amheuaeth',
            english: 'some doubt',
            note: 'rhywfaint takes o, and o softens the next word.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ynglŷn â',
            english: 'about; concerning',
            note: 'â takes the aspirate mutation. Before the article it is â’r.',
          },
        },
        {
          type: 'tip',
          body: 'Forecasts use a shorthand. Once the time or the place is clear, the next line can start at ddim or at the verb-noun.',
        },
      ],
    },
    {
      id: 'pretty-hard',
      kicker: 'Grammar',
      title: 'Pretty hard is yn o galed',
      blocks: [
        {
          type: 'rule',
          title: 'go softens, then yn softens go',
          body: 'go means pretty or fairly, and it softens the word that follows, so caled becomes galed. When yn comes first, go itself softens to o. The adjective softens as well, which is why a forecast says yn o galed.',
          examples: [
            { welsh: 'go galed', english: 'pretty hard' },
            { welsh: 'yn o galed', english: 'pretty hard' },
            { welsh: 'yn rhewi’n o galed', english: 'freezing pretty hard' },
          ],
        },
        {
          type: 'tip',
          body: 'Adverbial yn softens too: yn raddol means gradually, and yn gymharol ysgafn means relatively light. The same soft mutation follows dan, as in dan ddylanwad, and o, as in rhagor o law.',
        },
      ],
    },
    {
      id: 'comparatives',
      kicker: 'Pattern',
      title: 'Milder and wetter take -ach',
      blocks: [
        {
          type: 'rule',
          title: 'Add -ach, and watch the last letter',
          body: 'These weather words form the comparative with -ach: mwynach from mwyn, oerach from oer, cryfach from cryf, and hwyrach from hwyr. A final b hardens to p, so gwlyb becomes gwlypach, and braf adds an i as well: brafiach. tipyn softens to dipyn before a comparative, and troi’n softens the adjective: troi’n fwynach.',
          examples: [
            { welsh: 'dipyn mwynach', english: 'a bit milder' },
            { welsh: 'gwlypach', english: 'wetter' },
            { welsh: 'sawl gradd yn oerach', english: 'several degrees colder' },
          ],
        },
        {
          type: 'tip',
          body: 'pella is the spoken superlative of pell: y gorllewin pella, the far west. Further from the coast is ymhellach o’r arfordir. A tiny bit is mymryn, and as an adverb it softens: troi fymryn yn wlypach.',
        },
      ],
    },
    {
      id: 'time-spans',
      kicker: 'Phrase',
      title: 'Two days, tomorrow, and next time',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'dros y deuddydd nesa',
            english: 'over the next two days',
            note: 'deuddydd is the set word for a two-day stretch. Two months is deufis.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Buon ni yno am dridiau',
            english: 'We were there for three days',
            note: 'am softens tridiau to dridiau, and deufis to ddeufis: trwydded am ddeufis. After am y, the noun stays: am y deufis nesa.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'bore fory',
            english: 'tomorrow morning',
            note: 'fory is the usual form of yfory here. nos fory is tomorrow night, and peth cynta is first thing.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'am y tro',
            english: 'for now; for the time being',
            note: 'bob tro is every time, because pob softens to bob. dro ar ôl tro is time and again, droeon is many times, y tro nesa is next time, y tro diwetha is last time, and y tro ’ma is this time.',
          },
        },
      ],
    },
    {
      id: 'there-will-be',
      kicker: 'Pattern',
      title: 'There will be pockets of fog',
      blocks: [
        {
          type: 'rule',
          title: '’na still softens the next word',
          body: 'In ordinary speech, ’na follows mae, roedd, and mi fydd. mi fydd ’na means there will be. Soft mutation comes after ’na, so pocedi becomes bocedi, llythyr becomes lythyr, and gormod becomes ormod.',
          examples: [
            {
              welsh: "mi fydd 'na bocedi o niwl",
              english: 'there will be pockets of fog',
            },
            {
              welsh: "Mae 'na lythyr i ti ar y bwrdd",
              english: "There's a letter for you on the table",
            },
            {
              welsh: "Roedd 'na ormod o bobol",
              english: 'There were too many people',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "Mae'n debyg y",
            english: 'It is likely that; probably',
            note: 'A future verb follows. mae’n debygol y bydd hi’n… says the same thing.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Tydyn nhw ddim yn mynd, a dan ni ddim yn mynd chwaith',
            english: "They're not going, and we're not going either",
            note: 'chwaith means either in a negative sentence. either … or … is naill ai … neu …, and neu softens the next word.',
          },
        },
        {
          type: 'tip',
          body: 'ambell means the occasional. It comes before a singular noun and softens it: ambell gawod. ambell i gawod says the same thing.',
        },
      ],
    },
    {
      id: 'spoken',
      kicker: 'Culture',
      title: 'Forecasts sound like speech',
      blocks: [
        {
          type: 'culture',
          title: 'para, fory, and the North',
          body: 'Spoken Welsh uses para for continue. The official written verb is parhau. Tomorrow and afternoon shorten the same way: fory for yfory, and pnawn for prynhawn. In the North, hwyrach means perhaps as well as later.',
        },
        {
          type: 'say',
          line: {
            welsh: 'para',
            english: 'continue; last (spoken)',
            note: 'parhau is the form you meet in official writing.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'pnawn',
            english: 'afternoon',
            note: 'The full form is prynhawn. erbyn y pnawn means by the afternoon.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn hwyrach gyda’r nos',
            english: 'later in the evening',
            note: 'gyda’r nos means in the evening. hwyrach is the comparative of hwyr.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Read the forecast',
      blocks: [
        {
          type: 'check',
          prompt: 'Which phrase means “pretty hard”?',
          answer: 'yn o galed',
          options: ['yn raddol', 'yn o galed', 'yn gymharol ysgafn'],
        },
        {
          type: 'check',
          prompt: 'Which word means “wetter”?',
          answer: 'gwlypach',
          options: ['mwynach', 'gwlypach', 'brafiach'],
        },
      ],
    },
  ],
}
