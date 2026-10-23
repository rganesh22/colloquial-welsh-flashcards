import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '30',
  intro:
    'Front one word for emphasis, say you dare not, and place the story of Y Trydydd Peth. Along the way: still, either, and never mind.',
  steps: [
    {
      id: 'wild',
      kicker: 'Phrase',
      title: 'Wild is what they call me',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Y Trydydd Peth',
            english: 'The Third Thing',
            note: 'The title of the novel this chapter reads.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Gwyllt maen nhw'n fy ngalw i",
            english: 'Wild is what they call me',
            note: "fy nasals the next word, so galw becomes ngalw. The short 'n is reduced fy, so o 'nhrwyn is from my nose.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'mae pobl yn ei ddweud',
            english: 'people say (it)',
            note: 'ei softens dweud to ddweud. Focused, the text has A nofio gwyllt mae pobl yn ei ddweud.',
          },
        },
        {
          type: 'tip',
          body: 'y peth penna is the main thing. penna is the spoken shape of pennaf.',
        },
      ],
    },
    {
      id: 'focus',
      kicker: 'Grammar',
      title: 'The stressed word comes first',
      blocks: [
        {
          type: 'rule',
          title: 'Front it, then mae',
          body: 'To make one piece the news, put it first and let the verb follow. The verb in that slot is mae, or oedd in the past. Save yw for a sentence that defines what something is.',
          examples: [
            {
              welsh: "Gwyllt maen nhw'n fy ngalw i",
              english: 'Wild is what they call me',
            },
            {
              welsh: 'Da oedd mynd ben bore',
              english:
                'It was good to be out and about first thing in the morning',
            },
            {
              welsh: 'Dyna roddodd y blas i mi ar',
              english: "That's what gave me the taste for",
            },
          ],
        },
        {
          type: 'tip',
          body: 'ben bore is first thing in the morning, with pen softened to ben. rhoi has two past stems: rois i shortens rhoiais i, and rhoddais i and rhoddodd use rhodd- (speech says roddodd). blas ar is a taste of something or a taste for it, as in nofio answyddogol, illicit swimming. answyddogol usually means unofficial.',
        },
      ],
    },
    {
      id: 'dare',
      kicker: 'Pattern',
      title: 'I dare not',
      blocks: [
        {
          type: 'rule',
          title: 'does fiw i',
          body: 'Does fiw i means someone dare not. Doedd fiw i moves the same idea into the past. A verb-noun after i softens, and speech may use wiw for fiw, or chware for chwarae.',
          examples: [
            { welsh: 'Does fiw i mi wrthod', english: "I daren't refuse" },
            { welsh: 'doedd fiw i ni chware', english: "we didn't dare play" },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Doeddwn i ddim am',
            english: "I didn't want to; I wasn't going to",
            note: 'bod plus am plus a verb-noun is what you intended. am softens: Doeddwn i ddim am ei guro fo.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'disgwyl i mi fod',
            english: 'expect me to be',
            note: 'disgwyl i, then the person, then the verb-noun. i softens bod to fod.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'nes nad oedd neb yn ei weld o',
            english: 'until nobody could see him',
            note: 'nes is until. nad is the negative link in front of oedd.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Peidio gorfod talu',
            english: 'Not having to pay',
            note: 'peidio negates a verb-noun. heb softens as well: heb orfod nofio.',
          },
        },
      ],
    },
    {
      id: 'still',
      kicker: 'Phrase',
      title: 'Still, serious, and either',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Mae'n siarad o hyd am ei blentyndod",
            english: "He's always going on about his childhood",
            note: 'o hyd is constantly, or over and over. ei softens plentyndod to blentyndod. Plain always is wastad.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Dan ni yma o hyd',
            english: "We're still here",
            note: 'Here o hyd means still. fel arfer is usually, or as usual, as the sentence decides.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'o ddifrif',
            english: 'serious(ly); in earnest',
            note: "Speech often says o ddifri. difrifol is serious in a bad sense, and after predicative yn it softens: Mae'r sefyllfa'n ddifrifol.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Dw i ddim eisiau mynd chwaith',
            english: "I don't want to go either",
            note: 'chwaith belongs in a negative. So does eto when it means yet: Dwi’m yn meddwl fod Marged o gwmpas, eto. Welon ni ddim byd chwaith softens the negative past.',
          },
        },
      ],
    },
    {
      id: 'place',
      kicker: 'Pattern',
      title: 'Behind you, and never mind',
      blocks: [
        {
          type: 'rule',
          title: 'tu, then i',
          body: 'tu is an old word for side. (y) tu ôl i is behind, tu cefn i is at the back of, tu allan i is outside, and tu hwnt i is beyond. Both i and rhy (too) soften the next word, so pell becomes bell in rhy bell.',
          examples: [
            { welsh: '(y) tu ôl i', english: 'behind' },
            { welsh: 'tu hwnt i', english: 'beyond' },
            {
              welsh: 'rhy bell y tu ôl iddo fo',
              english: 'too far behind him',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "ni'n dau",
            english: 'us two; the two of us',
            note: "ni'n dwy when both are female. chi'ch dau (chi'ch dwy) is you two, and ill dau (ill dwy) is the two of them. y lle i gyd i ni'n dau is the whole place to the two of us.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'waeth befo',
            english: 'never mind (+ noun)',
            note: "Use it before a noun: Waeth befo'r halen, or waeth befo'r canlyniadau. On its own, hitiwch befo — often hitsiwch befo — as in Hitiwch befo, awn ni yfory. About something: Hitiwch befo am y tywydd.",
          },
        },
        {
          type: 'tip',
          body: "go iawn follows the noun for genuine, as in y môr go iawn, and hen ddigon is quite enough, with hen softening digon. hallt is severe in beirniadu'n hallt, and salty in pwll sgwâr, hallt. clywed oglau means smell, because clywed is perceive.",
        },
      ],
    },
    {
      id: 'medal',
      kicker: 'Culture',
      title: 'A medal and the Red Bandits',
      blocks: [
        {
          type: 'culture',
          title: 'The Prose Medal',
          body: 'Y Trydydd Peth, by Siân Melangell Dafydd, won Y Fedal Ryddiaith at the National Eisteddfod in 2009. Medal is feminine, so you say y fedal, and rhyddiaith softens after it. The wild nickname echoes the Gwylliaid Cochion of Mawddwy, a sixteenth-century band in Meirionnydd, and the river here is Dyfrdwy, the Dee.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Y Fedal Ryddiaith',
            english: 'the Prose Medal (National Eisteddfod)',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Gwylliaid Cochion',
            english: 'Red Bandits',
          },
        },
        {
          type: 'say',
          line: { welsh: 'Dyfrdwy', english: 'the River Dee' },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which sentence fits?',
      blocks: [
        {
          type: 'check',
          prompt: "How do you say 'I daren't refuse'?",
          answer: 'Does fiw i mi wrthod',
          options: [
            'Does fiw i mi gwrthod',
            'Does fiw i mi wrthod',
            'Dw i fiw wrthod',
          ],
        },
        {
          type: 'check',
          prompt: "Which line means 'We're still here'?",
          answer: 'Dan ni yma o hyd',
          options: ['Dan ni yma wastad', 'Dan ni yma o hyd', 'Dan ni yma eto'],
        },
      ],
    },
  ],
}
