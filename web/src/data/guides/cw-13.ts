import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '13',
  intro:
    'How to say what was done to something, what state it is in now, and who is doing it. A few adjectives still change shape, and North and South still split on “self”.',
  steps: [
    {
      id: 'headlines',
      kicker: 'Phrase',
      title: 'Here are the latest headlines',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Dyma'r penawdau diweddara",
            english: 'Here are the latest headlines',
            note: 'diweddara is the colloquial superlative of diweddar.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Ti 'di clywed am Eifion?",
            english: 'Have you heard about Eifion?',
            note: 'Naddo is “no” to a past question. Do is “yes”. Do? can also be a surprised “Did he?”',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "dw i newydd ddod yn ôl o Gaerfyrddin",
            english: "I've just come back from Carmarthen",
            note: 'newydd softens dod to ddod. o softens Caerfyrddin to Gaerfyrddin.',
          },
        },
        {
          type: 'tip',
          body: 'pigion o\'r newyddion is “news highlights”. meddai means “he said” or “she said”, and in this use it does not change for person or tense. Well i mi fynd is “I\'d better go”.',
        },
      ],
    },
    {
      id: 'passive',
      kicker: 'Grammar',
      title: 'The passive is “got its doing”',
      blocks: [
        {
          type: 'rule',
          title: 'cael + possessive + verb-noun',
          body: 'Colloquial Welsh makes a passive with cael, a possessive, and the verb-noun: the thing got its action. The possessive matches whatever was acted on, and it mutates the verb-noun, so ei “her” turns taflu into thaflu and fy turns talu into nhalu. Only cael changes for tense, and gan names who did it.',
          examples: [
            {
              welsh: "Fe gafodd y bêl eira ei thaflu",
              english: 'The snowball was thrown',
            },
            { welsh: 'ges i nhalu', english: 'I was paid' },
            {
              welsh: 'Gaeth ein bws ei stopio gan yr heddlu',
              english: 'Our bus was stopped by the police',
            },
          ],
        },
        {
          type: 'tip',
          body: 'dw i\'n cael nhalu is “I am paid”, fydda i\'n cael nhalu or ga i nhalu is “I\'ll be paid”, and dw i wedi cael nhalu is “I have been paid”. She is gaeth hi ei thalu. We and you do not mutate: gaethon ni\'n talu, gaethoch chi\'ch talu. Before a vowel, eu adds h: eu harestio.',
        },
      ],
    },
    {
      id: 'states',
      kicker: 'Pattern',
      title: 'A state drops cael',
      blocks: [
        {
          type: 'rule',
          title: 'wedi, heb, and newydd',
          body: 'When you mean the state rather than the event, drop cael and keep wedi plus the possessive, often written wedi\'i. Gender still picks the mutation: ffenest is feminine, so ei thorri, while a masculine bwrdd is ei dorri. heb copies that shape for what has not happened, and newydd replaces wedi for “just” or “recently”, with soft mutation.',
          examples: [
            {
              welsh: "Mae'r ffenest wedi ei thorri",
              english: 'The window is broken',
            },
            { welsh: 'llythyr heb ei agor', english: 'an unopened letter' },
            {
              welsh: "Mae'r trydanwr newydd fynd",
              english: 'The electrician has just gone',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Oedd bron iawn i mi syrthio',
            english: 'I very nearly fell',
            note: 'Oedd bron i + person + verb-noun. bron â is “almost …-ing”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Prin dw i'n cofio fe nawr",
            english: 'I hardly remember him now',
            note: 'With present bod you can skip the that-clause. Prin y gallen ni ganiatáu hynny keeps it.',
          },
        },
      ],
    },
    {
      id: 'sy',
      kicker: 'Grammar',
      title: 'Who is doing it takes sy',
      blocks: [
        {
          type: 'rule',
          title: 'sy for mae',
          body: 'Spoken sy, written sydd, stands where mae would stand once you need “who” or “which”. It follows Dyma and Dyna, and it is what you use when Pwy, Beth, or Faint is the subject. The same sy covers “has”, so sy wedi means “who has” or “which have”.',
          examples: [
            {
              welsh: "Dyma'r dyn sy'n trwsio'n ffôn ni",
              english: 'This is the man who is mending our phone',
            },
            {
              welsh: "Dyma'r parseli sy wedi cyrraedd",
              english: 'These are the parcels which have arrived',
            },
            { welsh: 'Beth sy wedi digwydd?', english: "What's happened?" },
          ],
        },
        {
          type: 'tip',
          body: 'am plus a verb-noun is another way to say “want to”, and it softens the next word. Wi am dalu â siec is “I want to pay by cheque”. Pwy sy am redeg y stondin deganau eleni? asks who wants to run the toy stall this year.',
        },
      ],
    },
    {
      id: 'adjectives',
      kicker: 'Pattern',
      title: 'A feminine noun changes the adjective',
      blocks: [
        {
          type: 'rule',
          title: 'Feminine shape, then soft mutation',
          body: 'A short list of adjectives still has a feminine form, and that form then softens after a feminine noun. byr becomes ber and then fer, so a short story is stori fer, while a masculine noun stays nodyn byr and crys gwyrdd. True plurals are scarce: eraill, ifainc, and bychain, plus the forecast phrase gwyntoedd cryfion.',
          examples: [
            { welsh: 'nodyn byr', english: 'a short note' },
            { welsh: 'stori fer', english: 'a short story' },
            { welsh: 'ffrog werdd', english: 'a green dress' },
          ],
        },
        {
          type: 'tip',
          body: 'yn plus an adjective makes an adverb, with soft mutation: yn gyflym is “quickly”, yn drwm is “heavily”. a- does not mutate, so “slowly” is yn araf, and “more slowly” is yn arafach.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Mae Sioned yn mynd yn grac',
            english: "Sioned's getting cross",
            note: 'There is no single verb “become”. Use mynd yn, or dod yn when you feel the change: Mi ddaw\'n amlwg cyn hir.',
          },
        },
      ],
    },
    {
      id: 'dialect',
      kicker: 'Culture',
      title: 'Myself splits North and South',
      blocks: [
        {
          type: 'culture',
          title: 'Self, and a few everyday pairs',
          body: 'The south says hunan for one person and hunain for several; the north says hun for both, so “on my own” is ar ben \'n hunan or ar ben \'n hun. A gog is a northerner and a hwntw or sioni a southerner: allan against mas, eisiau against moyn, crio against llefain, and mid-Wales speech often mixes them. Cymry Cymraeg are native Welsh speakers; di-Gymraeg means non-Welsh-speaking.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Gwnewch eich hunain yn gartrefol',
            english: 'Make yourselves at home',
            note: 'Southern plural. The north says eich hun.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Oedd hi bron â chrio',
            english: 'She was almost crying',
            note: 'Northern crio, with soft mutation after â. The south says Oedd hi bron â llefain.',
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
          prompt: 'How do you say “The window is broken”, meaning the state it is in?',
          answer: "Mae'r ffenest wedi ei thorri",
          options: [
            "Mae'r ffenest yn cael ei thorri",
            "Mae'r ffenest wedi ei thorri",
            'Gaeth y ffenest ei thorri',
          ],
        },
        {
          type: 'check',
          prompt: 'A northern speaker says she was almost crying. Which line is theirs?',
          answer: 'Oedd hi bron â chrio',
          options: [
            'Oedd hi bron â llefain',
            'Oedd hi bron â chrio',
            'Oedd hi newydd llefain',
          ],
        },
      ],
    },
  ],
}
