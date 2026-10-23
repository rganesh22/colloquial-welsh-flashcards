import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '27',
  intro:
    'How northern speech tells Un Nos Ola Leuad: shifted vowels, a past that feels present, and the words the characters actually say.',
  steps: [
    {
      id: 'voice',
      kicker: 'Phrase',
      title: 'A moonlit night, and who is speaking',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Un Nos Ola Leuad',
            english: 'One Moonlit Night',
            note: 'Novel by Caradog Prichard. ola is northern olau, “light”: one night of moonlight.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Pnawn da',
            english: 'Good afternoon',
            note: 'Spoken shortening of prynhawn da.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'medda hi',
            english: 'she said',
            note: 'meddwn i is “I said”, and meddwn inna uses the extended pronoun. The novel leaves quotation marks out.',
          },
        },
        {
          type: 'tip',
          body: 'Rargian fawr is “Good gracious!”, with mawr softened to fawr. You can also shout Rargian! on its own. Esgob, literally “bishop”, is a mild expletive. Use both sparingly.',
        },
      ],
    },
    {
      id: 'vowels',
      kicker: 'Grammar',
      title: 'The vowel after the stress',
      blocks: [
        {
          type: 'rule',
          title: 'Northern -e- and -au become -a',
          body: 'In this northern writing, the syllable after the stress is spelled with a. dynes is dynas, rhywle is rhywla, and adre is adra. Unstressed -au and -ai shrink the same way: hithau is hitha, finnau is finna, and basai, “would”, is basa.',
          examples: [
            { welsh: 'dynas', english: 'woman' },
            { welsh: 'yn rhywla', english: 'somewhere' },
            { welsh: 'adra', english: 'home; homewards' },
          ],
        },
        {
          type: 'tip',
          body: 'The same a turns up all through the chapter: gwynab for gwyneb, gorffan for gorffen, llechan for llechen, and fel fflamia, “like a rocket”, from fflamiau, “flames”.',
        },
      ],
    },
    {
      id: 'dyma',
      kicker: 'Pattern',
      title: 'The past walks in with dyma',
      blocks: [
        {
          type: 'rule',
          title: 'dyma + subject + yn + verb-noun',
          body: 'This is a historic present. It tells something already done, with the immediacy of “here is this happening”. Dyma fi’n gneud is the same event as Nes i, “I made”, and dyma finna’n agor y giat is the same event as agorais i’r giat, “I opened the gate”.',
          examples: [
            { welsh: "Dyma fi'n gneud", english: 'I made; I did (historic present)' },
            {
              welsh: "dyma finna'n agor y giat",
              english: 'I opened the gate (historic present)',
            },
            {
              welsh: "dyma Toss yn stopio'n stond",
              english: 'Toss stopped dead',
            },
          ],
        },
        {
          type: 'tip',
          body: 'finna is the northern spelling of finnau, the extended form of fi. gneud is gwneud spelled the way it is said.',
        },
      ],
    },
    {
      id: 'spoken',
      kicker: 'Grammar',
      title: 'While, did, and I fear',
      blocks: [
        {
          type: 'rule',
          title: 'a + extended pronoun + yn + verb-noun',
          body: 'Spoken “while” is a plus an extended pronoun plus yn plus a verb-noun. Use the long pronoun: hitha for “she”, finna for “me”. a hitha’n siarad is literally “and she speaking”, which means “while she spoke”.',
          examples: [
            {
              welsh: "a hitha'n siarad",
              english: 'while she spoke; with her speaking',
            },
            {
              welsh:
                "A hithau'n tynnu at hanner awr wedi saith, dyma'r penawdau",
              english:
                'With it approaching half past seven, here are the headlines',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Mi ddaru chwrnu dipyn bach',
            english: 'He snarled a little bit',
            note: 'ddaru never changes for person. It is the northern “did”, and the verb-noun takes soft mutation.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'dw i ofn',
            english: 'I fear; I am afraid',
            note: 'ofn is a noun, and ofni is the ordinary verb. Here ofn works like angen, with no linking yn.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "a finna ofn basa fo'n brathu",
            english: 'and me fearing he would bite',
            note: 'basa is northern basai, “would”. fo is independent “he” (standard fe); as a subject you hear o.',
          },
        },
      ],
    },
    {
      id: 'offers',
      kicker: 'Phrase',
      title: 'Come, go home, say thanks',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'tyrd',
            english: 'come! (sg)',
            note: 'Northern “come!”, usually pronounced tyd. The south says dere.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Dos di adra ar dy union rwan',
            english: 'You go home straight away now',
            note: 'di softens a singular command, as in yfa di, “you drink”. The south says cer for “go!”',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "O lle'r wyt ti'n dwad?",
            english: 'Where do you come from?',
            note: 'lle “where” stays unmutated after o. dwad is dod. ble, from pa le, is already mutated, so leave it as ble.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'mae golwg wedi blino arnat ti',
            english: 'you look tired',
            note: 'Take golwg wedi blino as one subject: a tired look is on you.',
          },
        },
        {
          type: 'tip',
          body: 'Diolch yn fowr iawn ichi is “thank you very much”: fowr is how fawr is said, and ichi is i chi. Gymi di frechdan efo fo? offers a slice of bread and butter — still the northern sense of brechdan. Answer Cymera, “I will”.',
        },
      ],
    },
    {
      id: 'north',
      kicker: 'Culture',
      title: 'The words the north says',
      blocks: [
        {
          type: 'culture',
          title: 'A novel in spoken northern Welsh',
          body: 'Caradog Prichard writes Un Nos Ola Leuad as northern speech. hogyn is “boy”, dynas is “woman”, rwan is “now” (also written rŵan; circumflexes are often left off), dwad is “come”, and efo is “with”, where the south says gyda. When “you” stands on its own, many northern speakers say chdi.',
        },
        {
          type: 'say',
          line: {
            welsh: 'hogyn',
            english: 'boy',
            note: 'The usual northern word; standard bachgen. Spoken plural often hogia. machgan i, “my boy”, is a fixed nasal mutation of bachgen.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Dyma chdi',
            english: 'Here you are',
            note: 'chdi stands in for ti on its own. efo chdi is the northern match of gyda ti.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'O Pentra',
            english: 'from (the) Village',
            note: 'Pentra is pentre, treated as a name both speakers know, so o leaves it unmutated. Lôn Bost is Post Lane.',
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
          prompt:
            'The boy tells a past action as if it is happening now. Which line means “I made”?',
          answer: "Dyma fi'n gneud",
          options: [
            'meddwn i',
            "Dyma fi'n gneud",
            'Mi ddaru chwrnu dipyn bach',
          ],
        },
        {
          type: 'check',
          prompt: 'Which line means “I am afraid”?',
          answer: 'dw i ofn',
          options: ["dw i'n ofn", 'dw i ofni', 'dw i ofn'],
        },
      ],
    },
  ],
}
