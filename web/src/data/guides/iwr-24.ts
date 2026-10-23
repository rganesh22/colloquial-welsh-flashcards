import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '24',
  intro:
    'How to name a favourite place, and how northern speech says “now”, “here”, and “home”. Watch the mutations hiding inside those phrases.',
  steps: [
    {
      id: 'favourite',
      kicker: 'Phrase',
      title: 'The favourite word sits in front',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'fy hoff le i',
            english: 'my favourite place',
            note: 'Hoff comes before the noun and softens it: lle → le.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'hogan o Ben Llŷn ydw i',
            english: "I'm a girl from the Llŷn Peninsula",
            note: 'The phrase you mean comes first, then ydw i. O softens Pen to Ben.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'wrth fy modd',
            english: 'happy as can be; in my element',
            note: 'Fy turns bodd into modd. Dwi wrth fy modd yn loetran means “I love wandering.”',
          },
        },
        {
          type: 'tip',
          body: 'Places are llefydd in the north. In the south, and in writing, the plural is lleoedd.',
        },
      ],
    },
    {
      id: 'bellach',
      kicker: 'Grammar',
      title: 'Now, because something changed',
      blocks: [
        {
          type: 'rule',
          title: 'bellach',
          body: 'Bellach means “now” when the situation has changed, as when someone has moved. It is a fixed soft mutation, like wastad “always”, so you do not mutate it again. After yn “in”, use the nasal mutation: Caerdydd becomes Nghaerdydd.',
          examples: [
            {
              welsh: "Bellach, dwi'n byw yng Nghaerdydd",
              english: 'I live in Cardiff now',
            },
            { welsh: 'wastad', english: 'always' },
          ],
        },
        {
          type: 'tip',
          body: 'Dwi is the informal spelling of dw i. Mond is spoken dim ond, “only”, and dros dro is “temporarily”: tro softens after dros.',
        },
      ],
    },
    {
      id: 'here-there',
      kicker: 'Pattern',
      title: 'Here and there join up',
      blocks: [
        {
          type: 'rule',
          title: 'fan plus the place',
          body: 'Man “spot” softens to fan, then joins yma, yna, yno, or acw. Fanma, also spelt famma, and fan hyn mean “here”. Fanna is “there” in sight, fanno is “there” out of sight, and fancw is “yonder”.',
          examples: [
            { welsh: 'fanma', english: 'here' },
            { welsh: 'fanna', english: 'there (in sight)' },
            { welsh: 'fanno', english: 'there (out of sight)' },
          ],
        },
        {
          type: 'tip',
          body: 'You can add yn, as in yn fanna and yn fanno. O flaen is “in front of”, tuag at “towards” softens the next word, and ar draws “across” is traws after ar. Uwchben is “above” and islaw is “below”.',
        },
      ],
    },
    {
      id: 'as-still',
      kicker: 'Grammar',
      title: 'As someone does it',
      blocks: [
        {
          type: 'rule',
          title: 'Soften the verb-noun',
          body: 'Wrth i means “as” someone does something: name them, then soften the verb-noun, so cymysgu becomes gymysgu. Dal i is the usual “still”, and it softens the verb-noun in the same way. Nes means “until”, and the verb-noun shows no tense, so you take the time from the rest of the sentence.',
          examples: [
            {
              welsh: "wrth i'r darllenwyr gymysgu",
              english: 'as the readers mix',
            },
            { welsh: 'dal i fynd', english: 'still go' },
            { welsh: 'nes gweld', english: 'until (you) saw / see' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "i weld os 'di Nain adra",
            english: 'to see if Granny is home',
            note: "Here 'di is ydi, “is”. The same short form can be wedi, so read the next word.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'dewch i tŷ ni',
            english: 'come to our house',
            note: 'Tŷ ni is ein tŷ ni with ein dropped. The missing ein still blocks soft mutation, so tŷ stays tŷ.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'rhyw bleser',
            english: 'a certain pleasure',
            note: 'Rhyw “a certain” sits in front and softens pleser to bleser.',
          },
        },
        {
          type: 'tip',
          body: 'Tada counts as a name, so i Tada does not soften. Uchaf, from uchel, is usually said ucha, and i gael edrych means you get to look.',
        },
      ],
    },
    {
      id: 'pen-llyn',
      kicker: 'Culture',
      title: 'A voice from Pen Llŷn',
      blocks: [
        {
          type: 'culture',
          title: 'Northern speech on the page',
          body: 'The speaker is a hogan, a girl, from Pen Llŷn, the peninsula in north-west Wales, also called Penrhyn Llŷn. In that accent the vowel after the stress slips from -e- to -a-, and a plural -au is said -a, so you meet cyfadda, adra, oeddan ni, hogia, and cloddia. Adra means both “to home” and “at home”; southern speech tends to use gartre for both.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Mi af i ar fy mhen fy hun',
            english: 'I will go on my own',
            note: 'Mi is the northern particle before the verb, and it softens. Hun is northern; elsewhere you hear hunan. Fy turns pen into mhen.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'mi fedrwch chi',
            english: 'you can',
            note: 'Medru is the northern word for gallu. Mi softens it to fedrwch.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'i fyny',
            english: 'up',
            note: 'Northern “up”. The south says lan. Lawr “down” is used in both.',
          },
        },
        {
          type: 'tip',
          body: 'Lobsgows, a hotchpotch, began as the name of a stew. Giami “wonky” comes from English “gammy”, and dow-dow means “in a leisurely fashion”.',
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which shape is right?',
      blocks: [
        {
          type: 'check',
          prompt: 'Which phrase is “my favourite place”?',
          answer: 'fy hoff le i',
          options: ['fy hoff lle i', 'fy hoff le i', 'fy le hoff i'],
        },
        {
          type: 'check',
          prompt: 'How does this chapter say “I will go on my own”?',
          answer: 'Mi af i ar fy mhen fy hun',
          options: [
            'Mi af i ar fy pen fy hun',
            'Mi af i ar fy mhen fy hun',
            'Mi af i ar fy mhen fy hunan',
          ],
        },
      ],
    },
  ],
}
