import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '10',
  intro:
    'How to suggest a plan, say what you would rather do, and fix a time. North and South split “I would rather”, and “I could” is a different shape from “I can”.',
  steps: [
    {
      id: 'phone',
      kicker: 'Phrase',
      title: 'Hold on, I’ll fetch her',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Ydy Pippa 'na?",
            english: 'Is Pippa there?',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Daliwch eiliad',
            english: 'Hold on a second',
            note: 'On the phone: wait a moment. dal is “hold”, and also “catch” or “keep on”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'a i i moyn hi',
            english: "I'll go and fetch her",
            note: 'Southern moyn is “fetch” here, and it is also the southern word for “want”. a i is the irregular future of mynd.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "sy 'ma",
            english: "speaking; it's … here",
            note: "Pippa, sy 'ma — Pippa speaking. Jeni sy 'ma — it's Jeni here.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Elli di ddod i dorri ngwallt i pnawn yfory, tybed?",
            english: 'Could you come and cut my hair tomorrow afternoon, I wonder?',
            note: 'tybed softens the request. elli di is familiar “can you”. i softens torri, and ngwallt is fy ngwallt.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Hwyl nawr',
            english: 'Bye now',
            note: 'hwyl is also the noun “fun”.',
          },
        },
        {
          type: 'tip',
          body: "If four o’clock suits, ask Ydy pedwar yn gyfleus? and answer i'r dim, “exactly right”. yn softens cyfleus to gyfleus, and Aros funud, “wait a minute”, softens munud to funud.",
        },
      ],
    },
    {
      id: 'suggest',
      kicker: 'Pattern',
      title: 'How about …-ing?',
      blocks: [
        {
          type: 'rule',
          title: 'From a hint to a nudge',
          body: 'Beth am plus a verb-noun is the easy informal suggestion, “how about …-ing”, and the verb-noun softens. Oes awydd \'da ti, or \'da chi, asks if someone feels like doing it, again with a soft mutation. Hoffech chi is the more formal “would you like to”, and Pam na with a second-person future, soft or aspirate, is a gentle push, “why don’t you”.',
          examples: [
            {
              welsh: 'Beth am wisgo fel anghenfilod a dychryn y plant?',
              english:
                'How about dressing up as monsters and frightening the kids?',
            },
            {
              welsh: "Oes awydd 'da ti fynd mas rhywle heno?",
              english: 'Do you feel like going out somewhere tonight?',
            },
            {
              welsh: "Pam na ddoi di â'r teulu?",
              english: "Why don't you bring the family?",
              note: 'na softens doi to ddoi. Same nudge: Pam na sgwenni di lythyr ato fo?, and Pam na ohiriwch chi fe tan yfory?',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "Be' sy 'da ti mewn golwg?",
            english: 'What have you got in mind?',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "'Na syniad",
            english: "That's an idea",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "O ba ran o Gymru dach chi'n dod yn wreiddiol?",
            english: 'What part of Wales do you come from originally?',
            note: 'ba is pa after o, and o softens Cymru to Gymru. With yn, pa becomes mha: Ym mha ddosbarth mae dy chwaer yn dysgu Cymraeg?',
          },
        },
        {
          type: 'tip',
          body: "Pa means “which” and softens the next word, and many southern areas say Pwy instead. Pa mor with an adjective asks about extent: Pa mor fawr yw 'ch estyniad? is “How big is your extension?”. 'Na with an adjective is the exclamation, and the adjective softens: 'Na neis! is “How nice!”, and 'Na ddrud (i ti/chi)! is “How expensive!”.",
        },
      ],
    },
    {
      id: 'rather',
      kicker: 'Grammar',
      title: 'I’d rather and I’d better',
      blocks: [
        {
          type: 'rule',
          title: 'The word after well',
          body: "Well 'da fi in the south and Well gen i in the north mean “I’d rather”, and a verb-noun can follow. Well i mi, and Well i fi, mean “I’d better”: the word after well changes the meaning. A choice of two uses P'un sy'n well (P'un is spoken Pa un, and the plural is Pa rai), and more than two uses orau, as in P'un sy orau 'da chi?",
          examples: [
            {
              welsh: "Well 'da fi aros fan hyn gyda'n ffrindiau",
              english: "I'd rather stay here with my friends",
            },
            {
              welsh: "Well gen i'r Golau Asia",
              english: "I'd rather the Light of Asia",
            },
            {
              welsh: "Well i fi aros fan hyn gyda'n ffrindiau",
              english: "I'd better stay here with my friends",
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "P'un sy'n well 'da ti, mynd i'r dre neu aros fan hyn?",
            english: 'Would you rather go to town or stay here?',
            note: 'neu softens a following verb-noun when that verb-noun can mutate.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Lle mae'r llall?",
            english: "Where's the other one?",
            note: "The others are y lleill: Mae'r lleill draw fan 'na. After a noun, singular arall (y dyn arall) and plural eraill, pronounced erill (y dynion eraill).",
          },
        },
        {
          type: 'tip',
          body: "Liking is Dw i'n hoffi or leicio, and Dw i wrth 'y modd yn… is stronger, “I love …-ing”. Gas gen i with a soft mutation is “I hate”, as in Gas gen i fynd i'r Tandoori dyddiau 'ma, and Alla i ddim diodde is “I can’t stand”, with the verb-noun left alone after ddim. Dim ots gen i (north) and Dim ots 'da fi (south) mean “I don’t mind”, Fyddai dim ots gen i and Fyddai dim ots 'da fi mean “I wouldn’t mind”, Fyddwn i ddim yn malio means the same, Well gen i beidio or Well 'da fi beidio means “I’d rather not”, and Dw i ddim yn orhoff o…, with a soft mutation after o, means “I’m not too keen”.",
        },
      ],
    },
    {
      id: 'could',
      kicker: 'Grammar',
      title: 'I could, I can, I’ll go',
      blocks: [
        {
          type: 'rule',
          title: 'gallwn and galla',
          body: "gallwn i means “I could”, galla i means “I can” (another way to say dw i'n gallu), and gallwn ni means “we can”. The verb-noun after them takes a soft mutation, after ddim it stays unmutated, questions and negatives soften the opening g, and in speech the g of galla i often drops as well. In the north the verb is medru: medrwn i for “I could” (and medret ti, medrai fe/hi, medren ni, medrech chi, medren nhw), medra i for “I can”, medr o for “he can”, Fedra i for “can I”, and Fedr hi ddim for “she can’t”.",
          examples: [
            {
              welsh: 'Allai fe ddod yfory?',
              english: 'Could he come tomorrow?',
            },
            {
              welsh: 'Allwn i ddim derbyn hynny',
              english: "I couldn't accept that",
            },
            {
              welsh: 'Alla i ddod yfory?',
              english: 'Can I come tomorrow?',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Gwela i',
            english: 'I see (I understand)',
            note: 'Familiar “you can” is galli di or gelli di, plural gallwch chi or gellwch chi, he or she gall e/hi (gallith or gellith in many areas), and they gallan nhw. ellith fod means “it may be (true)”.',
          },
        },
        {
          type: 'rule',
          title: 'The short future',
          body: 'mynd, gwneud, dod, and cael keep a future of their own: a i and ân nhw, na i and nân nhw, do i and dôn nhw, ca i and cân nhw, with af i, naf i, dof i, caf i and ewn ni, newn ni, dewn ni, cewn ni also heard in some areas. na i softens the next verb-noun, and awn ni means both “we’ll go” and “let’s go”. Other verbs take -a i, -i di, -ith e/hi (the south also uses -iff), -wn ni, -wch chi, and -an nhw, often interchangeable with bydda i, and the familiar pronoun with these endings is di.',
          examples: [
            {
              welsh: "Na i alw heibio tua pedwar o'r gloch yfory, 'te",
              english: "I'll call round about four o'clock tomorrow, then",
            },
            { welsh: "Awn ni, 'te", english: "Let's go, then" },
            {
              welsh: 'Fe ffonith Elinor yfory',
              english: 'Elinor will phone tomorrow',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Welwn ni ti yfory',
            english: "We'll see you tomorrow",
            note: 'Inflected future of gweld. A dropped affirmative particle still leaves the soft mutation.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Mi geith pob plentyn anrheg oddiwrth Siôn Corn',
            english: 'Every child will get a present from Father Christmas',
            note: 'Mi softens ceith to geith. Siôn Corn is Father Christmas.',
          },
        },
        {
          type: 'tip',
          body: "“We” is awn ni, nawn ni, down ni, and cawn ni, familiar “you” is ei di, nei di, doi di, and cei di, plural ewch chi, newch chi, dewch chi, and cewch chi, and he or she is eith, neith, daw (deith in some areas), and ceith. After os, where English uses a present, Welsh uses a future, and the radical of the verb is common: Os gweli di fo wedyn, dwed wrtho means “If you see him later, tell him”, and Os collan nhw'r gêm 'ma hefyd, bydd hi ar ben 'da ni means “If they lose this game as well, we’re finished”. Os na takes a soft or aspirate mutation: Os na gollan (or chollan) nhw'r gêm 'ma, bydda i'n synnu means “If they don’t lose this game, I’ll be surprised”, and Os na weli di fo… is “If you don't (will not) see him…”.",
        },
      ],
    },
    {
      id: 'years',
      kicker: 'Grammar',
      title: 'A year, an age, a date',
      blocks: [
        {
          type: 'rule',
          title: 'blwyddyn, blynedd, blwydd',
          body: 'Use blwyddyn when the year stands alone, and for “one year” say un flwyddyn. After any other number the form is blynedd: dwy flynedd, tair blynedd, pedair blynedd, pum mlynedd, chwe blynedd (also chwe mlynedd), saith mlynedd, wyth mlynedd (also wyth blynedd), naw mlynedd, and deng mlynedd. Age uses blwydd, often with oed after it, and the mutations match, as in dwy flwydd oed and deng mlwydd oed.',
          examples: [
            {
              welsh: 'Blwyddyn Newydd Dda!',
              english: 'Happy New Year!',
              note: 'blwyddyn is feminine, so da softens to dda.',
            },
            { welsh: 'pum mlynedd', english: 'five years' },
            { welsh: 'deng mlwydd oed', english: 'ten years old' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "Beth ydy/yw 'r dyddiad heddiw?",
            english: 'What date is it today?',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Ar y chweched ar hugain o fis Tachwedd',
            english: 'On the 26th of November',
            note: 'o softens mis to fis. Ordinals run cynta, ail, trydydd, pedwerydd, pumed, chweched, seithfed, wythfed, nawfed, degfed, then by twenties: yr unfed ar ddeg is the 11th, yr unfed ar hugain the 21st, and yr unfed ar ddeg ar hugain the 31st. cynta is the ordinal “1st”; the adverb “first” is gynta.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn Nolgellau ges i ngeni, ym mil naw dim wyth',
            english: 'I was born in Dolgellau, in 1908',
            note: 'yn turns Dolgellau into Nolgellau, and ngeni is fy ngeni. Read a year as mil plus the digits: mil naw saith pump is 1975, and “in 1993” is ym mil naw naw tri. 1970 is mil naw saith dim or mil naw saithdeg, and y saithdegau is the 70s.',
          },
        },
        {
          type: 'tip',
          body: "Months after o fis are Ionawr, Chwefror, Mawrth, Ebrill, Mai, Mehefin, Gorffennaf, Awst, Medi, Hydref, Tachwedd, and Rhagfyr. Hydref is also “autumn”. For age, an adult hears Beth ydy/yw 'ch oed chi? or Faint yw 'ch oed?, a child hears Faint yw dy oed? or Beth ydy/yw dy oed?, and “when were you born?” is Pryd gaethoch chi'ch geni? or, to a child, Pryd gest ti dy eni?",
        },
      ],
    },
    {
      id: 'celtic',
      kicker: 'Culture',
      title: 'The six Celtic languages',
      blocks: [
        {
          type: 'culture',
          title: 'Brythonic and Goidelic',
          body: 'Cymraeg, Cernyweg, and Llydaweg are the Brythonic languages. Cornish stands closer to Breton than to Welsh, and Breton is the only Celtic language still spoken on the European continent. Gwyddeleg, Gaeleg yr Alban, and Manaweg are the Goidelic group, and both Scots Gaelic and Manx come from Irish taken to Scotland and the Isle of Man.',
        },
        {
          type: 'say',
          line: {
            welsh: "â'u gwreiddiau yn yr Ynysoedd Prydeinig",
            english: 'with roots in the British Isles',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Pobol y Cwm',
            english: 'Welsh TV soap opera',
            note: 'mae Pobol y Cwm ar fin dechrau — it is about to start. ar fin plus a verb-noun means “about to”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'rŵan',
            english: 'now',
            note: 'Northern. General and southern Welsh say nawr.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Byw ar 'y mhen 'n hun ydw i nawr",
            english: 'I live on my own now',
            note: "Northern 'n hun is “myself”. Bu farw is “died”: Bu farw ngŵr, “my husband died”, with ngŵr for fy ngŵr.",
          },
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
          prompt:
            'You would rather stay here with your friends. Which sentence says that?',
          answer: "Well 'da fi aros fan hyn gyda'n ffrindiau",
          options: [
            "Well i fi aros fan hyn gyda'n ffrindiau",
            "Well 'da fi aros fan hyn gyda'n ffrindiau",
            "Well gen i'r Golau Asia",
          ],
        },
        {
          type: 'check',
          prompt: 'You want to know if he could come tomorrow. Which question fits?',
          answer: 'Allai fe ddod yfory?',
          options: [
            'Alla i ddim dod yfory',
            'Alla i ddod yfory?',
            'Allai fe ddod yfory?',
          ],
        },
      ],
    },
  ],
}
