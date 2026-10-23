import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '11',
  intro:
    'A chapter about Betsan Powys, the black chair, and Cardiff. The patterns are “long since” and a focused “it’s me”, plus phrases worth learning whole.',
  steps: [
    {
      id: 'footsteps',
      kicker: 'Phrase',
      title: 'Follow in someone’s footsteps',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'newyddiadurwraig',
            english: 'journalist (female)',
            note: 'The masculine is newyddiadurwr. -wraig is the feminine ending for the person who does the job, as in gwraig.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'dilyn yn ôl troed',
            english: "follow in (someone's) footsteps",
            note: 'The chapter says i ddilyn yn ôl troed John Humphrys. a ddewiswyd is “who was chosen”, the impersonal preterite of dewis.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'cyflwynydd',
            english: 'presenter',
            note: 'From cyflwyno. A gwyliwr watches (from gwylio); a gohebydd reports; a darlledwr broadcasts.',
          },
        },
        {
          type: 'tip',
          body: 'mae hi bellach means she is now, unlike before. The text is Mae hi bellach yn olygydd gwleidyddol, with soft mutation after predicative yn.',
        },
      ],
    },
    {
      id: 'wedi-hen',
      kicker: 'Grammar',
      title: 'Hen puts it long ago',
      blocks: [
        {
          type: 'rule',
          title: 'wedi hen + verb-noun',
          body: 'Slip hen in between wedi and the verb-noun and the action sits long in the past. wedi hen ennill ei blwyf means it has long since earned its place: plwyf is “parish”, and the phrase means it has become established. The same wedi, with no hen, is the everyday perfect and the word for telling the time.',
          examples: [
            {
              welsh: 'wedi hen ennill ei blwyf',
              english: 'has long since earned its place',
            },
            { welsh: 'maen nhw wedi diflannu', english: 'they have disappeared' },
            { welsh: 'hanner awr wedi tri', english: 'half past three' },
          ],
        },
        {
          type: 'tip',
          body: 'In wedi cyfnod o fyw, wedi means “after”, a formal partner of ar ôl. Day to day, keep wedi for the perfect and the clock.',
        },
      ],
    },
    {
      id: 'focus',
      kicker: 'Pattern',
      title: 'Why it is me',
      blocks: [
        {
          type: 'rule',
          title: 'mai, then the focused word',
          body: 'A focused “that” clause takes mai, with the spotlighted word straight after it. After pam, that word is the long pronoun y fi. The same y- forms are y fo, y ni, and y nhw, and in rapid speech the y often drops away.',
          examples: [
            {
              welsh: "pam mai y fi yw'r un sy'n …",
              english: 'why (it is) I (who) am the one who …',
            },
            { welsh: 'y fi', english: 'I; me (focused/emphatic)' },
            { welsh: 'yw fy mod …', english: '… is that I …' },
          ],
        },
        {
          type: 'tip',
          body: 'fy mod is the slightly more formal shape of mod i. fy brings nasal mutation: yr unig drafferth yw fy mod yn tueddu i anghofio. tueddu takes i plus a verb-noun.',
        },
      ],
    },
    {
      id: 'set-phrases',
      kicker: 'Phrase',
      title: 'Learn these lines whole',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'o bob cwr o Gymru',
            english: 'from every corner of Wales',
            note: 'o softens what follows: bob, Gymru, and o wledydd in o dros 20 o wledydd. cwr is the edge of a region. A corner of a room or street is cornel.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ar bob math o bynciau llosg',
            english: 'on all kinds of burning issues',
            note: 'pob math o stays singular. o softens pynciau to bynciau. pwnc llosg is the idiom for a burning issue.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'drwy gyfrwng y Gymraeg',
            english: 'through the medium of Welsh',
            note: 'drwy softens cyfrwng. y Gymraeg is feminine. The plural y cyfryngau also means the media.',
          },
        },
        {
          type: 'tip',
          body: "Two more lines to keep: a'ch bod chi'n gwybod eich stwff, and dim ond bod digon o swmp ynddo. ynddo is “in it”. The adjective swmpus, “hefty”, is the everyday word.",
        },
      ],
    },
    {
      id: 'gorau',
      kicker: 'Pattern',
      title: 'Your best follows the person',
      blocks: [
        {
          type: 'rule',
          title: 'gorau changes with the possessive',
          body: "“Do one’s best” lines up with English, and gorau changes with the possessive in front of it. After ei “his”, soft mutation makes ei orau. After fy “my”, nasal mutation makes 'ngorau, and the word to someone else is gwnewch eich gorau.",
          examples: [
            { welsh: 'i wneud eu gorau', english: 'to do their best' },
            { welsh: 'i wneud ei orau', english: 'to do his best' },
            { welsh: "mi wna i 'ngorau", english: "I'll do my best" },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Betsan ei hun',
            english: 'Betsan herself',
            note: 'ei hun is himself, herself, and itself, after a noun or a pronoun.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'fymryn yn wahanol',
            english: 'a little bit different',
            note: 'The soft mutation on mymryn is fixed in this idiom. ychydig yn wahanol is a little less slight.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Dw i'n bownd o fod",
            english: "I'm bound to be",
            note: 'The loanword usually stays bownd after yn. Some speakers do soften it. o takes a verb-noun: bownd o fod.',
          },
        },
        {
          type: 'tip',
          body: 'trwm has a feminine trom, but the plural trymion survives in the set phrase llyfrau trymion. Elsewhere you say llyfrau trwm, and a light topic is pwnc ysgafn. arall still has a living plural: pobl eraill.',
        },
      ],
    },
    {
      id: 'chair',
      kicker: 'Culture',
      title: 'The famous black chair',
      blocks: [
        {
          type: 'culture',
          title: 'Black chair and Cardiff Bay',
          body: 'y gadair ddu enwog is the famous black chair. cadair is feminine, so the article and the adjective both soften: y gadair, and du becomes ddu. The chapter pairs that chair with Cystadlwch, “compete”, and with annog mwy o ferched i eistedd yn y gadair.',
        },
        {
          type: 'say',
          line: {
            welsh: 'y gadair ddu enwog',
            english: 'the famous black chair',
            note: 'canolbwyntio ar means concentrate on: canolbwyntio ar y cystadleuwyr.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Cystadlwch!',
            english: 'Compete! (pl / polite)',
            note: 'The plural or polite command of cystadlu. dyna fy nghyngor i bawb uses nasal mutation after fy. cynghorion are pieces of advice; cynghorau are councils.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn ei thref enedigol, Caerdydd',
            english: 'in her home town, Cardiff',
            note: 'tref enedigol is a home town. ei “her” aspirates: thref, and gyda’i phrofiad helaeth. The Bay line is hynt a helynt gwleidyddiaeth Bae Caerdydd. a “and” aspirates too: a chefndiroedd.',
          },
        },
        {
          type: 'tip',
          body: 'ymunodd ag adran newyddion shows â turning into ag before a vowel, and â causes aspirate mutation. dan hyfforddiant means “as a trainee” and can follow a noun, mecanydd dan hyfforddiant. ymgartrefu yn “settle in” takes nasal mutation, and prin o “short of” softens pynciau to bynciau: fyddai Betsan ddim yn brin o bynciau.',
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
          prompt: 'Which phrase means “has long since earned its place”?',
          answer: 'wedi hen ennill ei blwyf',
          options: [
            'hen wedi ennill ei blwyf',
            'wedi hen ennill ei blwyf',
            'wedi ennill ei blwyf hen',
          ],
        },
        {
          type: 'check',
          prompt: 'cadair is feminine. Which is “the famous black chair”?',
          answer: 'y gadair ddu enwog',
          options: ['y cadair du enwog', 'y gadair ddu enwog', 'y nghadair ddu enwog'],
        },
      ],
    },
  ],
}
