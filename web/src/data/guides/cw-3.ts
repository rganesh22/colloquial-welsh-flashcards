import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '3',
  intro:
    'How to invite someone out, say who has what, and order in the pub. Watch the toast, and the small change after yn and “the”.',
  steps: [
    {
      id: 'going-out',
      kicker: 'Phrase',
      title: 'Would you like to go out?',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'mynd allan',
            english: 'go out',
            note: 'The lesson title: heading out for the evening.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Hoffech chi ddiod?',
            english: 'Would you like a drink?',
            note: 'Polite. diod softens to ddiod after Hoffech chi.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Awn ni',
            english: "Let's go",
            note: "i'r dafarn is to the pub. tafarn softens after 'r.",
          },
        },
        {
          type: 'tip',
          body: 'Hoffet ti is the same offer to a friend, and it softens the next word too. Accept with Pam lai? or Hoffwn. Dim byd i mi, diolch turns the drink down.',
        },
      ],
    },
    {
      id: 'have',
      kicker: 'Grammar',
      title: 'The owner comes last',
      blocks: [
        {
          type: 'rule',
          title: "Mae X 'da Y",
          body: "Welsh has no verb for “have”. You put the thing first and the owner last: Mae X 'da Y means Y has X, and 'da is spoken gyda. Ask with Oes instead of Mae, and use Does dim when they have not got it.",
          examples: [
            { welsh: "Mae car 'da John", english: 'John has a car' },
            { welsh: "Oes car 'da John?", english: 'Has John got a car?' },
            {
              welsh: "Does dim car 'da John",
              english: "John hasn't got a car",
            },
          ],
        },
        {
          type: 'tip',
          body: "Answer Oes…? with Oes, or Nag oes if not. Oes amser 'da chi? is the same pattern: have you got time?",
        },
      ],
    },
    {
      id: 'order',
      kicker: 'Phrase',
      title: 'Order, then ask the price',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Gwin coch a hanner o chwerw, os gwelwch yn dda',
            english: 'A red wine and a half of bitter, please',
            note: 'os gwelwch yn dda is please. It means “if you see well”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Unrhywbeth arall?',
            english: 'Anything else?',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Faint sy arna i i chi?',
            english: 'How much do I owe you?',
            note: 'Literally, how much is on me.',
          },
        },
        {
          type: 'tip',
          body: 'punt is feminine, so three is tair, not tri. Tair punt a deg ceiniog is three pounds and ten pence.',
        },
      ],
    },
    {
      id: 'toast',
      kicker: 'Culture',
      title: 'Cheers means good health',
      blocks: [
        {
          type: 'culture',
          title: 'Iechyd da',
          body: "You say Iechyd da when the drinks arrive: good health, the toast for a round. The night out in this chapter is in Aberystwyth, from the station to the pub. Northern Welsh uses gan for “have”; here you say gyda, usually 'da.",
        },
        {
          type: 'say',
          line: {
            welsh: 'Iechyd da',
            english: 'Cheers; good health',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Hwyl nawr',
            english: 'Goodbye now',
            note: 'Hwyl on its own is goodbye. As a noun it means fun.',
          },
        },
      ],
    },
    {
      id: 'describe',
      kicker: 'Pattern',
      title: 'yn sits before the description',
      blocks: [
        {
          type: 'rule',
          title: 'bod + yn',
          body: "To say what someone or something is like, put yn between them and the adjective. After a vowel it shrinks to 'n, and it softens the next word, except ll- and rh-. The same yn softens a noun when you say what a place is.",
          examples: [
            { welsh: "Mae'n oer", english: "It's cold" },
            { welsh: 'Mae Aled yn dal', english: 'Aled is tall' },
            {
              welsh: 'Mae Aberystwyth yn dre fach',
              english: 'Aberystwyth is a small town',
            },
          ],
        },
        {
          type: 'tip',
          body: "y or 'r softens a feminine singular noun: i'r dafarn, y ferch, y ddesg. A following adjective softens too, so desg fawr, but masculine bwrdd mawr stays plain. i softens a verb-noun as well: i fwyta, and Well i mi fynd.",
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which phrase fits?',
      blocks: [
        {
          type: 'check',
          prompt: 'How do you say “John has a car”?',
          answer: "Mae car 'da John",
          options: ["Mae John 'da car", "Mae car 'da John", "Oes car 'da John?"],
        },
        {
          type: 'check',
          prompt: 'The drinks have just arrived. What do you say?',
          answer: 'Iechyd da',
          options: ['Hwyl nawr', 'Iechyd da', 'os gwelwch yn dda'],
        },
      ],
    },
  ],
}
