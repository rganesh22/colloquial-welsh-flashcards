import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '35',
  intro:
    'A literary evening walk, and the old verb forms that tell it. Learn the imperfect, the book’s negative, and which phrases you still say.',
  steps: [
    {
      id: 'imperfect',
      kicker: 'Grammar',
      title: 'The ending -wn already means “I”',
      blocks: [
        {
          type: 'rule',
          title: 'Literary imperfect, first person',
          body: 'The ending -wn is the literary imperfect for “I”: I was doing something, I could, or I used to. The pronoun is usually left out, so gwelwn, meddyliwn, teimlwn, and gallwn already contain “I”. Speech uses another pattern, such as o’n i’n gweld, and the pluperfect Hoffaswn means “I had wanted”.',
          examples: [
            { welsh: 'gwelwn', english: 'I saw; I could see' },
            { welsh: 'meddyliwn', english: 'I thought; I was thinking' },
            {
              welsh: 'Meddyliwn mor ynfyd oeddwn',
              english: 'I thought how foolish I was',
            },
          ],
        },
        {
          type: 'tip',
          body: 'Literary Welsh negates the verb with ni, or with nid before a vowel, and ddim does not appear. p, t, and c take aspirate mutation under ni, just as â does after peidio (ag before a vowel). Ni allwn beidio â sefyll means “I couldn’t help stopping”; speech says allwn i ddim peidio â sefyll.',
        },
      ],
    },
    {
      id: 'that-clause',
      kicker: 'Pattern',
      title: 'A past “that” is i plus a verb-noun',
      blocks: [
        {
          type: 'rule',
          title: 'i + subject + verb-noun',
          body: 'Literary Welsh often builds a past “that” with i, then the subject, then a verb-noun. The verb-noun takes soft mutation. imi is i plus fi, so imi fyned means “that I had gone”.',
          examples: [
            { welsh: 'imi fyned', english: 'that I had gone' },
            {
              welsh: 'Pan dybiais imi fyned',
              english: 'When I reckoned (that) I had gone',
            },
            {
              welsh: 'i gryndod gerdded dros',
              english: 'that a shiver walked/went across',
            },
          ],
        },
        {
          type: 'tip',
          body: 'myned, dyfod, and gweled are literary, and the spoken verb-nouns are mynd, dod, and gweld. euthum means “I went” and deuthum means “I came”; in speech those are es i and des i. canfûm mai’r Hen Niclas ydoedd means “I saw it was Old Niclas”, from canfod, which is rare in speech.',
        },
      ],
    },
    {
      id: 'wonder',
      kicker: 'Phrase',
      title: 'I wonder, closer, onward',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Tybed ydyn nhw fan hyn yn barod?',
            english: 'I wonder if they’re here already?',
            note: 'tybed is very common. It comes from tybio, “think, suppose”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Dybiwn i',
            english: 'I suppose so; I imagine so',
            note: 'A reply. Ydyn nhw wedi mynd? – Dybiwn i.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'dipyn yn nes at ein gilydd',
            english: 'a bit closer to each other',
            note: 'nes is “nearer”, from agos. ein gilydd is “each other”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn ei flaen',
            english: 'forward; onward',
            note: 'The possessive changes with the person: yn fy mlaen, and yn ei blaen for “her”.',
          },
        },
        {
          type: 'tip',
          body: 'ymron yn gwbl is literary for “almost completely”. Speech says bron yn gyfangwbl. For “because”, the book’s oblegid is formal; oherwydd and achos are the ones you say.',
        },
      ],
    },
    {
      id: 'and-which',
      kicker: 'Grammar',
      title: 'And, which, and while',
      blocks: [
        {
          type: 'rule',
          title: 'Two small words spelled a',
          body: 'a meaning “and” puts aspirate mutation on the next word, so p, t, and c can become ph, th, and ch. a meaning “which” puts soft mutation on the verb. gan plus a verb-noun means “while doing”, with soft mutation on the verb-noun, and after a it becomes a chan.',
          examples: [
            { welsh: 'a chyrhaeddais ato', english: 'and I reached it' },
            { welsh: 'a orchuddiai', english: 'which covered' },
            { welsh: 'a chan gofio', english: 'and remembering' },
          ],
        },
        {
          type: 'tip',
          body: 'gan gerdded yn araf means “walking slowly”. In i’m cyfarfod the ’m is an infixed “me”; speech prefers i ngweld (i), with nasal mutation and the pronoun after the verb. fy causes that same nasal mutation: fy nghôb, “my coat”, and yn fy ngholer, “my collar”.',
        },
      ],
    },
    {
      id: 'soften',
      kicker: 'Pattern',
      title: 'Little words that soften the next one',
      blocks: [
        {
          type: 'rule',
          title: 'Soft mutation in the phrase',
          body: 'neilltuol o and mor both soften the adjective that follows. mor … ag y gallwn means “as … as I could”, and gallwn is that same literary imperfect. After a proper name the adjective takes soft mutation, so truan shows up as druan.',
          examples: [
            {
              welsh: 'neilltuol o glir a hyfryd',
              english: 'particularly clear and fine',
            },
            { welsh: 'mor wrol ag y gallwn', english: 'as bravely as I could' },
            { welsh: 'yr hen Niclas druan', english: 'poor old Niclas' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'y fath shegfa, na allaf ei gymharu i ddim',
            english: 'such a shaking as I cannot compare to anything',
            note: 'y fath softens the noun, and na is “that … not” (nad before a vowel). shegfa is English “shake” plus the suffix -fa, and ei here is the masculine “it”.',
          },
        },
        {
          type: 'tip',
          body: 'A feminine noun softens the word after it: llaw gref, where cref is the feminine of cryf, and y briffordd and y fan lle, where man is feminine. amryw comes before a plural and softens it: amryw glercod. yr oedd cymaint o sôn amdani uses feminine amdani because the talk is about yr ardd.',
        },
      ],
    },
    {
      id: 'nos-dawch',
      kicker: 'Culture',
      title: 'Good night in the North still says dawch',
      blocks: [
        {
          type: 'culture',
          title: 'An old “you” that stayed',
          body: 'This chapter’s evening is hwyrnos, where everyday Welsh says noswaith. Nos dawch, “good night to you”, is still ordinary all over the North. It keeps an old iwch, which is i plus chi.',
        },
        {
          type: 'say',
          line: { welsh: 'Nos dawch', english: 'Good night to you' },
        },
        {
          type: 'say',
          line: {
            welsh: 'ebe fi',
            english: 'I said (quoting)',
            note: 'With direct speech, the spoken phrase is meddwn i.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'llygoden Ffrengig',
            english: 'rat',
            note: 'Literally “French mouse”. llygoden is “mouse”.',
          },
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
          prompt: 'Which is the literary form of “I couldn’t help stopping”?',
          answer: 'Ni allwn beidio â sefyll',
          options: [
            'Ni allwn beidio â sefyll',
            'allwn i ddim peidio â sefyll',
            'ebe fi',
          ],
        },
        {
          type: 'check',
          prompt: 'Which phrase means “that I had gone”?',
          answer: 'imi fyned',
          options: ['imi fyned', 'i ngweld (i)', 'a chan gofio'],
        },
      ],
    },
  ],
}
