import type { ChapterGuide } from '../../lib/chapterGuide'

/** Lesson for Intermediate Welsh Reader chapter 17, Ras yn erbyn amser. */
export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '17',
  intro:
    'Phrases for a race against time: fed up, the same, and a personal challenge. You also meet the cael passive and the southern way of saying not.',
  steps: [
    {
      id: 'fed-up',
      kicker: 'Phrase',
      title: 'Fed up, and a race against time',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'ras yn erbyn amser',
            english: 'race against time',
            note: 'ras is feminine, so an adjective after it softens: ras gystadleuol.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Mae hi’n cael llond bol',
            english: 'She gets fed up',
            note: 'cael llond bol is the ordinary way to say fed up.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Dw i wedi cael llond bol ar hyn',
            english: "I'm fed up with this",
            note: 'cael llond bol ar, and ar softens the next word.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "o bryd i'w gilydd",
            english: 'from time to time',
            note: 'pryd softens after o.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Mae hi wastad yn chwilio am sialens newydd',
            english: 'She’s always looking for a new challenge',
            note: 'wastad means always.',
          },
        },
        {
          type: 'tip',
          body: 'yn erbyn is one compound preposition. Its yn is separate from the yn that ends a long subject. In Mae cystadlu yn erbyn ei hun a gwthio ei hun yn rhan o\'i natur hi, the verb-noun phrase is the subject, and the yn before rhan closes it.',
        },
      ],
    },
    {
      id: 'same',
      kicker: 'Grammar',
      title: '“The same” is yr un',
      blocks: [
        {
          type: 'rule',
          title: 'yr un in front of the noun',
          body: 'Welsh has no separate word that means “same”. yr un goes in front of the noun, for one thing or for many. A feminine singular noun soft-mutates after un, so cath becomes gath.',
          examples: [
            { welsh: 'yr un pwnc', english: 'the same subject' },
            { welsh: 'yr un pynciau', english: 'the same subjects' },
            { welsh: 'yr un gath', english: 'the same cat' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'yn yr un lle',
            english: 'in the same place',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y rhan fwya o gystadleuwyr',
            english: 'most competitors',
            note: 'y rhan fwya o is most of, literally the biggest part of. rhan is feminine, so the adjective appears as fwya.',
          },
        },
        {
          type: 'tip',
          body: 'A word that sits in front of the noun can soften it. unig does this in Yr unig fwriad sydd gen i ydi …, the only intention I have is …, literally the intention which is with me. prif does the same: prif bwrpas is main purpose.',
        },
      ],
    },
    {
      id: 'nid',
      kicker: 'Grammar',
      title: '“This is not” starts with Nid',
      blocks: [
        {
          type: 'rule',
          title: 'Nid … ydi hon',
          body: 'Nid … ydi hon is how you say “this is not …”. This identification pattern is the ordinary modern use of nid, and nid stands at the start of the sentence. ras is feminine, so the adjective softens to gystadleuol.',
          examples: [
            { welsh: 'Nid … ydi hon', english: 'This is not …' },
            {
              welsh: 'Nid ras gystadleuol ydi hon ond ras bersonol',
              english: "This isn't a competitive race but a personal race",
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "nad ydw i'n mynd i",
            english: "that I'm not going to",
            note: 'nad is “that … not”. The verb-noun after i softens: nad ydw i’n mynd i dorri unrhyw record.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Rwy’n poeni na fydd y corff yn gallu dygymod',
            english: "I worry that the body won't be able to cope",
            note: 'na fydd is “that … will not”. dygymod â means cope with: â aspirates the next word, and it is ag before a vowel.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Does dim o'i le ar fethu",
            english: "There's nothing wrong with failing",
            note: 'does dim o’i le ar means there is nothing wrong with. ar softens the next word, so methu appears as fethu.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'anodda',
            english: 'most difficult; hardest',
            note: 'The superlative of anodd, written as it is said, so the final -f of anoddaf is left off. un o’r anodda yn y byd is one of the hardest in the world.',
          },
        },
      ],
    },
    {
      id: 'cael-passive',
      kicker: 'Pattern',
      title: '“I was brought up” uses cael',
      blocks: [
        {
          type: 'rule',
          title: 'cael plus a possessive plus a verb-noun',
          body: 'Welsh builds this passive with cael, a possessive, and a verb-noun. Fe ges i fy magu is “I was brought up”, literally “I got my bringing-up”, and Fe ges i fy annog is “I was encouraged”. The same fy mutates the next word nasally, so disgwyl appears as nisgwyl in sy\'n fy nisgwyl, “which awaits me”.',
          examples: [
            { welsh: 'Fe ges i fy magu', english: 'I was brought up' },
            { welsh: 'Fe ges i fy annog', english: 'I was encouraged' },
            { welsh: "sy'n fy nisgwyl", english: 'which awaits me' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Mae Lowri wedi bod yn hyfforddi',
            english: 'Lowri has been training',
            note: 'wedi bod yn plus a verb-noun means has been doing it.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'wedi llwyddo i’w chwblhau',
            english: 'have managed to complete it',
            note: 'llwyddo i is followed by a soft-mutated verb-noun.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'be allwn i gyflawni',
            english: 'what I could achieve',
            note: 'be, from beth, softens gallwn to allwn, and the verb-noun after i softens too.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: '120 milltir yr wythnos',
            english: '120 miles a week',
            note: 'milltir stays singular after a number. “Per week” is yr wythnos, the week.',
          },
        },
      ],
    },
    {
      id: 'purpose',
      kicker: 'Pattern',
      title: 'In order to, while, and compared with',
      blocks: [
        {
          type: 'rule',
          title: 'A person, then a softened verb-noun',
          body: 'er mwyn i plus a person plus a verb-noun means “in order for” that person to do something. wrth i plus a person plus a verb-noun means “as” or “while” they do it. The verb-noun takes a soft mutation: gweld becomes weld, while rhedeg begins with r, which stays as it is.',
          examples: [
            {
              welsh: 'er mwyn i mi weld',
              english: 'in order for me to see; so that I can see',
            },
            { welsh: 'wrth iddi redeg', english: 'as she runs' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "Mae'r canlyniadau'n dda o'u cymharu â llynedd",
            english: 'The results are good compared with last year',
            note: 'The possessive matches what you compare: o\'i gymharu â (him or it), o\'i chymharu â (her, with aspirate mutation), o\'u cymharu â (them), o\'n cymharu â (us).',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "am yr hyn sy'n ei hwynebu",
            english: 'about what faces her',
            note: 'yr hyn means what, or that which. Feminine ei adds h before a vowel: ei hwynebu.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yr eira mawr gawson ni',
            english: 'the heavy snow we got',
            note: 'The relative clause has no linking a. The verb still softens, so cawson appears as gawson.',
          },
        },
        {
          type: 'say',
          line: {
            welsh:
              'Fe all hyd yn oed gollwng maneg yn yr eira arwain at ganlyniadau erchyll',
            english:
              'Even dropping a glove in the snow can lead to horrible consequences',
            note: 'hyd yn oed gollwng maneg yn yr eira is the whole subject of Fe all. arwain at means lead to.',
          },
        },
        {
          type: 'tip',
          body: 'am softens the next word, as in rwy’n ysu am gael clywed, I’m dying to hear. am can also mean around: am dy ben di is around your head, with pen softened after dy. After a, a word can aspirate: colli bysedd a thraed, lose fingers and toes. bys troed is a toe when you need to be specific, and traed is the plural of troed.',
        },
      ],
    },
    {
      id: 'south',
      kicker: 'Culture',
      title: 'The south says “not” with sa, so, and smo',
      blocks: [
        {
          type: 'culture',
          title: 'No ddim in these southern forms',
          body: 'Southern speech forms the negative of bod as sa, so, and smo, and these forms do not take ddim. Sa i matches dw i ddim, and so ti matches dwyt ti ddim. In the south-west, smo is the form for every person.',
        },
        {
          type: 'say',
          line: {
            welsh: "Sa i'n credu",
            english: "I don't think",
            note: 'The text writes this Sai’n, as one word.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'so ti',
            english: "you're not (familiar)",
            note: 'The southern match for dwyt ti ddim.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Smo fi'n mynd",
            english: "I'm not going",
            note: 'South-western. Smo nhw\'n siarad Cymraeg is they don’t speak Welsh.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'mas',
            english: 'out',
            note: 'Southern, corresponding to allan. cysgu mas means sleep out.',
          },
        },
        {
          type: 'tip',
          body: 'Spoken spelling follows the sound. cyfadde is spoken cyfaddef, admit, and gneud is spoken gwneud, do or make.',
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
          prompt: 'Which phrase means “the same cat”?',
          answer: 'yr un gath',
          options: ['yr un cath', 'yr un gath', 'yr un pynciau'],
        },
        {
          type: 'check',
          prompt: 'She says this is not a competitive race, but a personal one. Which sentence matches?',
          answer: 'Nid ras gystadleuol ydi hon ond ras bersonol',
          options: [
            'Nid ras gystadleuol ydi hon ond ras bersonol',
            'Nid ras cystadleuol ydi hon ond ras bersonol',
            'Ddim ras gystadleuol ydi hon ond ras bersonol',
          ],
        },
      ],
    },
  ],
}
