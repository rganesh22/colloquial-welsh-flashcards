import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '1b',
  intro:
    'How to name a thing or a person, say what the job is, and use “the”. Watch North and South, and which word you pick for “this”.',
  steps: [
    {
      id: 'what-is-this',
      kicker: 'Phrase',
      title: 'What is this?',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Beth ydy hwn?',
            english: 'What is this?',
            note: 'Northern. hwn is “this” for an object. Southern often Beth yw hwn?',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Beth ydy hwn yn Gymraeg?',
            english: 'What is this in Welsh?',
            note: 'Point at the object. yn Gymraeg means “in Welsh”. For “that”, use hwnnw.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Beth yw hwnnw?',
            english: 'What is that?',
            note: 'Southern. Northern often Beth ydy hwnnw?',
          },
        },
        {
          type: 'tip',
          body: 'For a person, start with Pwy instead of Beth.',
        },
      ],
    },
    {
      id: 'ydy-yw',
      kicker: 'Pattern',
      title: '“Is” splits North and South',
      blocks: [
        {
          type: 'rule',
          title: 'Same “is”, two dialects',
          body: "When you name a thing or a person, “is” is ydy in the north and yw in the south. Beth asks what a thing is, and Pwy asks who a person is. The tag “isn't it?” follows the same split: on'd ydy? or 'tydy? in the north, and on'd yw hi? in the south.",
          examples: [
            { welsh: 'Beth ydy…?', english: 'What is…?' },
            {
              welsh: "Mae'n braf bore 'ma, 'tydy?",
              english: "It's fine this morning, isn't it?",
            },
            {
              welsh: "Mae'n oer heddiw, on'd yw hi?",
              english: "It's cold today, isn't it?",
            },
          ],
        },
        {
          type: 'tip',
          body: "Mae hi'n… means “it's…”. Quick speech shortens it to Mae'n…. After yn the next word softens, so diflas becomes ddiflas.",
        },
        {
          type: 'tip',
          body: 'boeth and dwym both mean hot. Answer the tag with Ydy, or Ydy, wir for “yes, it certainly is”.',
        },
      ],
    },
    {
      id: 'this-that',
      kicker: 'Grammar',
      title: 'This and that depend on who you mean',
      blocks: [
        {
          type: 'rule',
          title: 'hwn, hon, hwnnw, honno',
          body: 'For a thing or a man, “this” is hwn and “that” is hwnnw. For a woman, “this” is hon and “that” is honno. Ask who they are with Pwy ydy or Pwy yw.',
          examples: [
            { welsh: 'Pwy ydy hwn?', english: 'Who is this? (man)' },
            { welsh: 'Pwy ydy hon?', english: 'Who is this? (woman)' },
            { welsh: 'Pwy ydy honno?', english: 'Who is that? (woman)' },
          ],
        },
        {
          type: 'tip',
          body: 'Pwy ydy hwnnw? is “who is that?” for a man. The same four words point at things.',
        },
      ],
    },
    {
      id: 'jobs',
      kicker: 'Phrase',
      title: 'The job comes first',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Beth ydy'ch gwaith chi?",
            english: 'What is your job / work?',
            note: 'gwaith is work or a job.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: '… dw i',
            english: "I'm a…",
            note: 'Put the occupation first: Athro dw i.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Cyfieithydd ydy/yw hi',
            english: "She's a translator",
            note: 'Job first, then ydy in the north or yw in the south, then the pronoun.',
          },
        },
        {
          type: 'tip',
          body: 'A woman teacher is athrawes, and a woman student is myfyrwraig. e or o means “he”, and the job still comes first: Heddwas ydy/yw e, Myfyriwr ydy/yw hwnnw, Athrawes ydy/yw honno.',
        },
      ],
    },
    {
      id: 'the',
      kicker: 'Grammar',
      title: '“The” has three shapes',
      blocks: [
        {
          type: 'rule',
          title: 'y, yr, or ’r',
          body: 'Before a consonant, “the” is y, as in y bws, y tacsi, and y llong. Before a vowel it is yr, as in yr amgueddfa. After a vowel it joins on as ’r: i’r bws, i’r llong, i’r amgueddfa.',
          examples: [
            { welsh: 'y', english: 'the (before consonants)' },
            { welsh: 'yr', english: 'the (before vowels)' },
            { welsh: "'r", english: 'the (after a vowel)' },
          ],
        },
        {
          type: 'tip',
          body: "a means “and” and becomes ac before a vowel. 'n is “our”, a short form of ein, before a consonant.",
        },
        {
          type: 'tip',
          body: 'cyllyll is the plural of cyllell, and ffyrc is the plural of fforc. allwedd is the southern word for “key”.',
        },
      ],
    },
    {
      id: 'you',
      kicker: 'Culture',
      title: 'Chi until you know them',
      blocks: [
        {
          type: 'culture',
          title: 'Familiar ti, polite chi',
          body: 'Ti is for one person you know well: a friend, family, a child, or an animal. Chi is the default with strangers and older people, and it is also “you” for more than one person. If you are unsure, choose chi.',
        },
        {
          type: 'say',
          line: { welsh: 'ti', english: 'you (familiar singular)' },
        },
        {
          type: 'say',
          line: { welsh: 'chi', english: 'you (formal / plural)' },
        },
        {
          type: 'say',
          line: {
            welsh: 'os gwelwch yn dda',
            english: 'please',
            note: 'Literally “if you see well”.',
          },
        },
        {
          type: 'tip',
          body: "In a shop, Faint…? asks how much, and Gymera i… means “I'll take…”. The c of cymera has softened. You will also meet beth amdano fe? “what about it?” and symuda i “I'll move”.",
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
          prompt:
            'You are in the north and you point at an object. How do you ask what it is?',
          answer: 'Beth ydy hwn?',
          options: ['Beth yw hwnnw?', 'Beth ydy hwn?', 'Pwy ydy hon?'],
        },
        {
          type: 'check',
          prompt: 'A man says he is a teacher. Which line is his?',
          answer: 'Athro dw i',
          options: ['Dw i athro', 'Athro dw i', 'Athrawes dw i'],
        },
      ],
    },
  ],
}
