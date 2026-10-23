import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '12',
  intro:
    'How a headline demands an early election, and how Welsh reports, times, and identifies what happens next.',
  steps: [
    {
      id: 'headline',
      kicker: 'Phrase',
      title: 'A headline can be just the verb-noun',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Mynnu etholiad buan',
            english: 'Demanding a quick election',
            note: 'With nobody named, the verb-noun itself carries the headline.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'mynnu',
            english: 'demand; insist',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'buan',
            english: 'quick; early; soon',
            note: 'Compare with cynt or cynharach, as in yn gynharach. “As soon as possible” is cyn gynted ag y bo modd (also cyn gynted a bo modd). bo is the old subjunctive of bod.',
          },
        },
        {
          type: 'tip',
          body: 'English often turns the same headline into a passive: “Early election demanded.” Welsh leaves the verb-noun standing on its own.',
        },
      ],
    },
    {
      id: 'reported',
      kicker: 'Grammar',
      title: 'y means “that” before a verb with an ending',
      blocks: [
        {
          type: 'rule',
          title: 'The reporting particle',
          body: 'y, or yr before a vowel, means “that” in front of a verb that already has an ending. The following verb does not mutate. Present and imperfect of bod do not take y; report those with bod or fod.',
          examples: [
            { welsh: 'y bydd rhaid cynnal', english: 'that … will have to be held' },
            { welsh: "y byddai'n cymryd", english: 'that he would take' },
            { welsh: "y byddan nhw'n derbyn", english: 'that they will accept' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'ei fod eisiau',
            english: 'that he wants',
            note: 'A formal way to report mae e or roedd e, beside the plainer fod e.',
          },
        },
        {
          type: 'tip',
          body: "Wanting someone else to act is eisiau, then i, then the person, then a verb-noun. The verb-noun softens: eisiau i'r wlad bleidleisio.",
        },
      ],
    },
    {
      id: 'verb-noun-subject',
      kicker: 'Pattern',
      title: 'Drop yn and the verb-noun becomes the subject',
      blocks: [
        {
          type: 'rule',
          title: "fyddai gadael or fyddai'n gadael",
          body: 'A linking yn means someone would do the action. Leave it out and the verb-noun is the subject of fyddai, so the adjective says what that action would be.',
          examples: [
            {
              welsh: 'fe fyddai gadael iddo lithro … yn annerbyniol',
              english: 'letting it slip … would be unacceptable',
            },
            { welsh: "fe fyddai'n gadael", english: 'would let; would be letting' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Mae angen etholiad arnom ni',
            english: 'We need an election',
            note: 'The need sits on someone: angen ar. arnom ni is the formal partner of arnon ni.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'does dim dewis arall',
            english: 'there is no other choice',
          },
        },
      ],
    },
    {
      id: 'time',
      kicker: 'Grammar',
      title: 'After, before, and when each take their own shape',
      blocks: [
        {
          type: 'rule',
          title: 'i, then the subject, then the verb-noun',
          body: 'ar ôl, cyn, nes, and wrth become conjunctions when i follows. Soft mutation falls on the word after i. In speech, cyn and nes often take bod instead, which some people still call non-standard.',
          examples: [
            {
              welsh: "ar ôl i'r gweinidog ymddiswyddo",
              english: 'after the minister resigns',
            },
            { welsh: "cyn bod nhw'n mynd", english: 'before they go' },
            { welsh: 'nes bod y lleill yn cyrraedd', english: 'until the others arrive' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "pan ddaw'r etholiad",
            english: 'when the election comes',
            note: 'pan softens the verb and likes a short-form past or future. mae never changes: pan mae.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'pryd daw hi?',
            english: 'when will she come?',
            note: 'pryd asks. pan only joins the clause. Some spoken Welsh uses pryd for both.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Roedd … wedi cyfarfod',
            english: '… had met',
            note: 'Past of bod, then wedi, then the verb-noun. The usual pluperfect outside the most formal Welsh. cyfarfod as a noun means “meeting”.',
          },
        },
      ],
    },
    {
      id: 'what-matters',
      kicker: 'Pattern',
      title: '“What is important” uses two kinds of is',
      blocks: [
        {
          type: 'rule',
          title: 'sy first, then ydi',
          body: 'When beth or yr hyn is the subject, the present “is” is sy or sydd. A second “is”, the one that names the thing, is ydi or ydy. Relative a softens the next verb and covers other inflected forms, including a oedd, but not the present of bod.',
          examples: [
            { welsh: "Beth sy'n bwysig ydi …", english: 'What is important is …' },
            { welsh: 'a fydd yn rhoi grym', english: 'which will give power' },
            { welsh: "sy'n mynd", english: 'who is going' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh:
              "Beth sy'n bwysig ydi gwneud y peth cywir, nid gwneud beth sy'n boblogaidd",
            english:
              "What's important is doing the right thing, not doing what's popular",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'oedd wedi herio',
            english: 'who had challenged',
            note: 'The same clause as a oedd wedi herio. Leaving a out is common in speech and in ordinary writing.',
          },
        },
      ],
    },
    {
      id: 'ireland',
      kicker: 'Culture',
      title: 'Ireland, and a party name that softens',
      blocks: [
        {
          type: 'culture',
          title: 'The Republic and the Greens',
          body: 'Iwerddon is Ireland, and Gweriniaeth Iwerddon is the Irish Republic. After yn the name takes nasal mutation: yng Ngweriniaeth Iwerddon. plaid is feminine, so y softens the noun and the adjective together: y Blaid Werdd, the Green Party, uses gwerdd, the feminine of gwyrdd.',
        },
        {
          type: 'say',
          line: {
            welsh: 'y Blaid Werdd',
            english: 'the Green Party',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'gweinidog',
            english: 'minister',
            note: 'A government minister, and also a nonconformist church minister.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which shape fits?',
      blocks: [
        {
          type: 'check',
          prompt: 'You are reporting “they will accept”. Which clause is right?',
          answer: "y byddan nhw'n derbyn",
          options: [
            "y byddan nhw'n derbyn",
            "bod byddan nhw'n derbyn",
            "a byddan nhw'n derbyn",
          ],
        },
        {
          type: 'check',
          prompt: 'How do you say “after the minister resigned”?',
          answer: "ar ôl i'r gweinidog ymddiswyddo",
          options: [
            "ar ôl i'r gweinidog ymddiswyddo",
            "ar ôl y gweinidog ymddiswyddo",
            "pan i'r gweinidog ymddiswyddo",
          ],
        },
      ],
    },
  ],
}
