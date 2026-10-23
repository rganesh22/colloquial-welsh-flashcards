import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '2b',
  intro:
    'How to say you are not doing something, and how to answer yes or no. One present pattern covers both “I understand” and “I am understanding”.',
  steps: [
    {
      id: 'ddim',
      kicker: 'Grammar',
      title: '“Not” comes after the person',
      blocks: [
        {
          type: 'rule',
          title: 'ddim after the pronoun',
          body: 'In the negative, ddim follows the pronoun: dw i ddim. The verb is already the negative form, and ddim is the word that means “not”. With ti, dwyt is often left out, so you hear ti ddim.',
          examples: [
            { welsh: 'dw i ddim', english: 'I am not' },
            { welsh: '(dwyt) ti ddim', english: 'you are not (familiar)' },
            { welsh: 'dydy e ddim', english: 'he is not' },
          ],
        },
        {
          type: 'tip',
          body: 'In the south, “I am not” is wi ddim. The general and northern form is dw i ddim.',
        },
      ],
    },
    {
      id: 'verb-noun',
      kicker: 'Pattern',
      title: 'Doing something takes yn',
      blocks: [
        {
          type: 'rule',
          title: 'bod, then yn, then the verb-noun',
          body: 'Say what someone does with bod, then yn, then a verb-noun. After a vowel, yn shrinks to ’n, as in dw i’n dysgu. The same Welsh line covers the English simple present and the English continuous.',
          examples: [
            { welsh: 'Mae Ron yn deall Cymraeg', english: 'Ron understands Welsh' },
            { welsh: "dw i'n meddwl", english: 'I think' },
            {
              welsh: "Dyn ni'n mynd i Lundain dros y Sul",
              english: "We're going to London for the weekend",
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Dydy/Dyw hi ddim yn mynd',
            english: "She isn't going / doesn't go",
            note: 'A negative action keeps ddim, then yn, then the verb-noun.',
          },
        },
        {
          type: 'tip',
          body: 'gwybod is “know a fact”. nabod is “know a person”.',
        },
      ],
    },
    {
      id: 'ask',
      kicker: 'Phrase',
      title: 'Questions you can use today',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Ydy e'n siarad Cymraeg?",
            english: 'Does / Is he speak(ing) Welsh?',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Sut dych chi'n sillafu 'ny?",
            english: 'How do you spell that?',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Ydy hi'n bwrw glaw?",
            english: 'Is it raining?',
            note: 'bwrw glaw is rain, literally “cast rain”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Ydy'ch gŵr yn dod 'da ni heno?",
            english: 'Is your husband coming with us tonight?',
            note: "gyda is “with”. In speech it often shrinks to 'da.",
          },
        },
      ],
    },
    {
      id: 'yes-no',
      kicker: 'Pattern',
      title: 'Yes copies the verb',
      blocks: [
        {
          type: 'rule',
          title: 'Echo the question',
          body: 'A bod question is answered by repeating its verb: Ydw, Wyt, Ydych, Ydy, or Ydyn. No is Nag in front of that same verb, and some areas say Nac. When the question starts with a noun, the answers are Ie and Nage.',
          examples: [
            {
              welsh: "Ydych chi'n siarad Cymraeg? — Ydw",
              english: 'Do you speak Welsh? — Yes (I do)',
            },
            {
              welsh: "Ydw i'n hwyr? — Ydych",
              english: 'Am I late? — Yes (you are)',
            },
            {
              welsh: "Ydyn nhw'n barod nawr? — Ydyn",
              english: 'Are they ready now? — Yes',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Nag ydw',
            english: "No (I'm not)",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Cymro dach chi?',
            english: 'Are you a Welshman?',
            note: 'This starts with a noun, so you answer Ie or Nage.',
          },
        },
      ],
    },
    {
      id: 'dialect',
      kicker: 'Culture',
      title: 'North and South shape “is not”',
      blocks: [
        {
          type: 'culture',
          title: 'Two maps for the same negative',
          body: 'The negative of bod is where north and south sound most different. For “he is not”, the north says dydy e ddim or tydy o ddim, and the south says dyw e ddim. You, we, and they follow the same split.',
        },
        {
          type: 'say',
          line: {
            welsh: 'ŷn ni ddim',
            english: 'we are not',
            note: 'Southern. Northern: dyn ni ddim or (ty)dan ni ddim.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ŷch chi ddim',
            english: 'you are not',
            note: 'Southern. Northern: dych chi ddim or dach chi ddim.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ŷn nhw ddim',
            english: 'they are not',
            note: 'Southern. Northern: (dy)dyn nhw ddim or tydyn nhw ddim.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which answer fits?',
      blocks: [
        {
          type: 'check',
          prompt: 'Which phrase means “I am not”?',
          answer: 'dw i ddim',
          options: ['dw i ddim', 'ddim dw i', 'Nag ydw'],
        },
        {
          type: 'check',
          prompt:
            "They ask “Ydych chi'n siarad Cymraeg?” You do speak Welsh. What do you answer?",
          answer: 'Ydw',
          options: ['Ie', 'Ydw', 'Ydych'],
        },
      ],
    },
  ],
}
