import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '29',
  intro:
    'Formal Welsh on the slate industry in the north. Learn the trade words, then how this history says died, only had, and because.',
  steps: [
    {
      id: 'slate',
      kicker: 'Phrase',
      title: 'One slate, the slate trade',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'llechen',
            english: 'slate (a single slate)',
            note: 'Feminine singulative of llechi. After the article it softens: y lechen.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'llechi',
            english: 'slates; slate (material)',
            note: 'Y diwydiant llechi is the slate industry. Diwydiant is masculine, so llechi stays.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y fasnach lechi',
            english: 'the slate trade',
            note: "Masnach is feminine, so the article softens it and llechi softens to lechi. To serve the slate trade is i wasanaethu'r fasnach lechi.",
          },
        },
        {
          type: 'tip',
          body: 'A quarry is chwarel (chwareli). In the parish of Llandygai is ym mhlwyf Llandygai: yn before p becomes ym, and plwyf takes nasal mutation.',
        },
      ],
    },
    {
      id: 'died',
      kicker: 'Grammar',
      title: 'Died is bu farw',
      blocks: [
        {
          type: 'rule',
          title: 'Marw softens after bu',
          body: 'Bu farw is the normal way to say that someone died, in speech and in writing. Marw takes soft mutation after bu, which is why the phrase has farw. After pan, bu softens too, and ef is the literary form of e or fe.',
          examples: [
            { welsh: 'bu farw', english: 'died (he/she)' },
            { welsh: 'Pan fu ef farw', english: 'When he died' },
            { welsh: 'buon nhw farw', english: 'they died' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'marwodd',
            english: 'died (regular preterite, some areas)',
            note: 'Heard in some areas of Wales instead of bu farw.',
          },
        },
      ],
    },
    {
      id: 'only-had',
      kicker: 'Pattern',
      title: 'Only one industry had prospects',
      blocks: [
        {
          type: 'rule',
          title: 'Possessor first, with gan',
          body: 'To say that only someone had something, Welsh puts the possessor first. The pattern dim ond gan ... yr oedd is literally "only with ... was there". What they had comes after yr oedd.',
          examples: [
            { welsh: 'dim ond gan ... yr oedd', english: 'only ... had' },
            {
              welsh:
                "dim ond gan un o ddiwydiannau'r gogledd yr oedd rhagolygon disglair",
              english:
                'only one of the industries of the north had bright prospects',
            },
            {
              welsh: "diwydiannau'r gogledd",
              english: 'the industries of the north',
            },
          ],
        },
        {
          type: 'tip',
          body: 'Rhagolwg, a prospect or an outlook, has an irregular plural. The w turns into y: rhagolygon. Rhagolygon disglair are bright prospects.',
        },
      ],
    },
    {
      id: 'because',
      kicker: 'Phrase',
      title: 'Because splits formal and spoken',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'canys yr oedd angen',
            english: 'since there was a need',
            note: 'Canys is since or because, and it is largely formal.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'gan fod angen',
            english: 'since there was a need',
            note: 'The usual spoken swap for canys. Am fod is another equivalent you will meet.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'gwneud iawn am esgeuluso buddsoddi',
            english: 'make up for neglecting to invest',
            note: 'Gwneud iawn am means make up for. Am softens the next word.',
          },
        },
      ],
    },
    {
      id: 'only-during',
      kicker: 'Grammar',
      title: 'Only comes before the noun',
      blocks: [
        {
          type: 'rule',
          title: 'Unig in front means only',
          body: 'Unig before a noun means only, and it softens that noun. Yr unig ferch is the only girl, with merch softened to ferch. After the noun, unig means lonely, and yr unig ardal, with unig in front, is the only region.',
          examples: [
            { welsh: 'yr unig ardal', english: 'the only region' },
            { welsh: 'yr unig ferch', english: 'the only girl' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "i'w datblygiad",
            english: 'to its development',
            note: "The preposition i plus ei or eu is always i'w, in every style. Ei here is its, for the region, which is feminine.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "o'r tu allan i Wynedd",
            english: 'from outside Gwynedd',
            note: "O'r tu allan i means from outside. The i softens the next word, so Gwynedd becomes Wynedd.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'adeg y rhyfel',
            english: 'at the time of the war; during the war',
            note: 'Adeg before a named event means during that time. Streic is feminine, so adeg y Streic Gyffredinol. At that time is adeg hynny, or bryd hynny.',
          },
        },
        {
          type: 'tip',
          body: 'Pwys softens after o: unrhyw gystadleuwyr o bwys means any competitors of note, and pobol o bwys is often heavy irony. In contrast with is mewn gwrthgyferbyniad â, and â (ag before a vowel) causes aspirate mutation. The plural gweddillion usually means remains or leftovers.',
        },
      ],
    },
    {
      id: 'north',
      kicker: 'Culture',
      title: 'A formal history of slate',
      blocks: [
        {
          type: 'culture',
          title: 'Quarries, peace, and book Welsh',
          body: "Slate sits among diwydiannau'r gogledd in degawd cynta'r ganrif, and the Welsh is formal. You meet ffrwyth ymdrechion Richard Pennant, ym mhlwyf Llandygai, dyfodiad heddwch yn 1815, and yn hwb i'r diwydiant for a boost to the industry.",
        },
        {
          type: 'say',
          line: {
            welsh: 'deuai incwm o £7,000',
            english: 'an income of £7,000 was coming',
            note: 'Deuai is the literary imperfect of dod, "was coming" or "used to come". Spoken Welsh says roedd yn dod.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Datrysid rhai o'r problemau",
            english: 'some of the problems were solved',
            note: 'Literary imperfect impersonal of datrys.',
          },
        },
        {
          type: 'tip',
          body: 'Cyfalaf on these cards is money for investment. A capital city is prifddinas.',
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
          prompt: 'The history says when he died. Which phrase is right?',
          answer: 'Pan fu ef farw',
          options: ['Pan bu ef marw', 'Pan fu ef farw', 'Pan fu ef marw'],
        },
        {
          type: 'check',
          prompt: 'You mean the only region. Which phrase is right?',
          answer: 'yr unig ardal',
          options: ['yr ardal unig', 'yr unig ardal', 'unig yr ardal'],
        },
      ],
    },
  ],
}
