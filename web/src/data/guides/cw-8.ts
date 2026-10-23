import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '8',
  intro:
    'How to make an appointment, say what is wrong, and fix a time. The same chapter covers must and should, the clock, and the Eisteddfod.',
  steps: [
    {
      id: 'appointment',
      kicker: 'Phrase',
      title: 'Asking for an appointment',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Alla i wneud apwyntiad i weld rhywun heddiw?',
            english: 'Can I make an appointment to see someone today?',
            note: 'Alla i is “can I?”. i plus gweld gives i weld.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Ga i ofyn beth yw'r broblem?",
            english: 'May I ask what the problem is?',
            note: 'Ga i is “may I?”, from cael. gofyn softens after it.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Mae Dr Davies yn rhydd am bedwar',
            english: 'Dr Davies is free at four',
            note: 'am softens the hour: pedwar becomes bedwar.',
          },
        },
        {
          type: 'tip',
          body: "Echo Alla i with Galla, siwr o fod, answer Ydy hynny'n gyfleus? with dim o gwbwl, and close with Hwyl nawr.",
        },
      ],
    },
    {
      id: 'illness',
      kicker: 'Grammar',
      title: 'The cold is on you',
      blocks: [
        {
          type: 'rule',
          title: 'Illnesses take ar',
          body: "A cold, a fever, a cough, thirst, and hunger sit on the person with ar. The personal forms are arna i, arnat ti, arno fe, arni hi, arnon ni, arnoch chi, and arnyn nhw, and the he and she forms often drop the pronoun. A sore body part takes 'da or gan, and a feminine noun turns tost into dost.",
          examples: [
            { welsh: 'Mae annwyd arna i', english: "I've got a cold" },
            { welsh: "Mae pen tost 'da fi", english: "I've got a headache" },
            { welsh: "Oedd stumog dost 'da hi", english: 'She had stomach-ache' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "Beth sy'n bod arnoch chi?",
            english: "What's wrong with you?",
            note: "beth as the subject takes sy, and Ers pryd dych chi'n sâl? asks how long you have been ill.",
          },
        },
      ],
    },
    {
      id: 'rhaid',
      kicker: 'Pattern',
      title: 'Must, no need, and must not',
      blocks: [
        {
          type: 'rule',
          title: 'Rhaid i + person',
          body: "Rhaid means necessity: put i and a person after it, then a verb-noun that softens. 'Sdim rhaid means there is no need. When the person must not act, keep rhaid, add beidio, and leave the next verb-noun in its dictionary form.",
          examples: [
            { welsh: 'Rhaid i mi fynd', english: 'I must go' },
            {
              welsh: "'Sdim rhaid i ti fynd",
              english: "You needn't go (familiar)",
            },
            {
              welsh: 'Rhaid i ti beidio mynd',
              english: "You mustn't go (familiar)",
            },
          ],
        },
        {
          type: 'tip',
          body: 'A question starts with Oes rhaid, as in Oes rhaid i chi fynd mor gynnar?',
        },
      ],
    },
    {
      id: 'dylwn',
      kicker: 'Phrase',
      title: 'Ought to, and ought not',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Mi ddylwn i gysylltu â nhw',
            english: 'I ought to get in touch with them',
            note: 'mi softens dylwn to ddylwn, and cysylltu softens to gysylltu.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Ddylwn i gysylltu â nhw?',
            english: 'Should I get in touch with them?',
            note: 'The question softens the verb-noun as well.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Ddylwn i ddim cysylltu â nhw',
            english: 'I ought not get in touch with them',
            note: 'After ddim the verb-noun stays cysylltu.',
          },
        },
        {
          type: 'tip',
          body: 'Some areas use an s after the l, with the same meaning: dylswn i, dylset ti, dylsai fe, dylsai hi, dylsen ni, dylsech chi, and dylsen nhw.',
        },
      ],
    },
    {
      id: 'time',
      kicker: 'Phrase',
      title: 'Time sits on the clock face',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Faint o'r gloch yw/ydy hi?",
            english: 'What time is it?',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'hanner awr wedi tri',
            english: 'half past three',
            note: 'wedi is past the hour.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'chwarter i bedwar',
            english: 'quarter to four',
            note: 'i softens pedwar to bedwar.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Mae'n ddrwg gen i",
            english: "I'm sorry",
            note: "Southern Welsh says Mae'n ddrwg 'da fi.",
          },
        },
        {
          type: 'tip',
          body: 'Build clock-face times from pum munud, deng munud, chwarter, ugain munud, pum munud ar hugain, and hanner awr, and treat a digital watch as hollol ddisteil.',
        },
      ],
    },
    {
      id: 'eisteddfod',
      kicker: 'Culture',
      title: 'The festival changes town',
      blocks: [
        {
          type: 'culture',
          title: 'North one year, south the next',
          body: 'The Eisteddfod Genedlaethol is a competitive festival that changes town each August, north one year and south the next. The Cadair goes to a poem in cynghanedd, the strict pattern of internal rhyme and alliteration, and the coron goes to a different kind of poem. Learners have their own corner of the Maes: CYD, Cymdeithas y Dysgwyr, Pabell y Dysgwyr, and the award Dysgwr y Flwyddyn.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Gŵyl y Faenol',
            english: 'the Faenol Festival',
            note: 'Near Caernarfon around the August bank holiday, founded in 2000 by the hogyn lleol Bryn Terfel.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y Sesiwn Fawr',
            english: 'the Big Session',
            note: 'A modern-band festival in Dolgellau. sesiwn is feminine, so mawr softens to fawr.',
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
          prompt: 'How do you say “I’ve got a cold”?',
          answer: 'Mae annwyd arna i',
          options: ["Mae annwyd 'da fi", 'Mae annwyd arna i', "Dw i'n annwyd"],
        },
        {
          type: 'check',
          prompt: 'Which sentence means “you mustn’t go”?',
          answer: 'Rhaid i ti beidio mynd',
          options: [
            "'Sdim rhaid i ti fynd",
            'Rhaid i ti beidio mynd',
            'Rhaid i ti fynd',
          ],
        },
      ],
    },
  ],
}
