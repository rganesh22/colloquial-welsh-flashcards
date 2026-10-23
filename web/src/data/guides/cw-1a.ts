import type { ChapterGuide } from '../../lib/chapterGuide'

/** Gold-standard chapter lesson. Other chapters follow this shape and tone. */
export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '1a',
  intro:
    'How to greet someone, say who you are, and introduce a person. Watch North and South, and the little change on “good”.',
  steps: [
    {
      id: 'greetings',
      kicker: 'Phrase',
      title: 'Hello depends on the time of day',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Bore da',
            english: 'Good morning',
            note: 'bore is masculine, so da stays da.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Prynhawn da',
            english: 'Good afternoon',
            note: 'Often shortened to P’nawn da.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Noswaith dda',
            english: 'Good evening',
            note: 'noswaith is feminine, so da softens to dda.',
          },
        },
        {
          type: 'tip',
          body: 'Nos da is “good night”, and only when you are leaving. It is not a hello.',
        },
      ],
    },
    {
      id: 'how-are-you',
      kicker: 'Pattern',
      title: 'How are you? splits North and South',
      blocks: [
        {
          type: 'rule',
          title: 'Same question, two shapes',
          body: 'Sut mae? is the full “how is it?”. In the north it collapses to S’mae?. In the south you hear Shwmae?. Answer with the same phrase, then add how you are.',
          examples: [
            { welsh: "S'mae?", english: 'How are you? (North)' },
            { welsh: 'Shwmae?', english: 'How are you? (South)' },
            { welsh: 'Da iawn, diolch', english: 'Very well, thanks' },
          ],
        },
      ],
    },
    {
      id: 'names',
      kicker: 'Grammar',
      title: 'Your name comes first',
      blocks: [
        {
          type: 'rule',
          title: '… dw i',
          body: 'Put the name before dw i. You do not start with “I am” the way English does.',
          examples: [
            { welsh: 'Dafydd Jones dw i', english: 'I am Dafydd Jones' },
            {
              welsh: "Be(th) ydy'ch enw chi?",
              english: "What's your name? (North)",
            },
            {
              welsh: "Beth yw'ch enw chi?",
              english: "What's your name? (South)",
            },
          ],
        },
        {
          type: 'tip',
          body: 'Chi is the polite “you”. Use it with people you have just met.',
        },
      ],
    },
    {
      id: 'introduce',
      kicker: 'Phrase',
      title: 'Pointing someone out',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Dyma Sioned',
            english: 'This is Sioned',
            note: 'In fast speech, Dyma shrinks to ’Ma.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Dyna’r plant',
            english: 'Those are the children / There are the children',
            note: 'Dyna is the “that / there” partner of Dyma.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Neis cwrdd â chi',
            english: 'Nice to meet you',
          },
        },
      ],
    },
    {
      id: 'family',
      kicker: 'Culture',
      title: '“My father” does not look like “father”',
      blocks: [
        {
          type: 'culture',
          title: 'Family words after fy',
          body: 'Fy “my” changes the start of the next word. You will meet the family already in that changed shape: nhad is “my father”, not the dictionary word tad. Learn the phrase you will actually say.',
        },
        {
          type: 'say',
          line: { welsh: 'nhad', english: 'my father' },
        },
        {
          type: 'say',
          line: { welsh: 'mam', english: 'my mother' },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which greeting fits?',
      blocks: [
        {
          type: 'check',
          prompt: 'You meet someone in the evening. Which hello is right?',
          answer: 'Noswaith dda',
          options: ['Nos da', 'Noswaith dda', 'Bore da'],
        },
        {
          type: 'check',
          prompt: 'How do you say “I am Elen Hughes”?',
          answer: 'Elen Hughes dw i',
          options: ['Dw i Elen Hughes', 'Elen Hughes dw i', "S'mae Elen Hughes"],
        },
      ],
    },
  ],
}
