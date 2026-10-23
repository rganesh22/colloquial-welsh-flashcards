import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: 'alphabet',
  intro:
    'How the letters on these cards sound, and which marks change the word. Circumflex, y, and the double letters do the real work.',
  steps: [
    {
      id: 'short-vowels',
      kicker: 'Phrase',
      title: 'The plain vowels stay short',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'afal',
            english: 'apple',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'heno',
            english: 'tonight',
            note: 'Short e, then short o.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'cwm',
            english: 'valley',
            note: 'w is the vowel, as in pwll and hwn.',
          },
        },
        {
          type: 'tip',
          body: 'denu ends on a short u, and esgid keeps a short e and i.',
        },
      ],
    },
    {
      id: 'circumflex',
      kicker: 'Pattern',
      title: 'A hat makes a different word',
      blocks: [
        {
          type: 'rule',
          title: 'The circumflex marks a long vowel',
          body: 'A circumflex (â, ê, î, ô, ŵ, ŷ) means you hold that vowel. It keeps lookalikes apart: tan and tân, man and mân, ffon and ffôn, gem and gêm. da, cig, and nos are long already, so they are written with no circumflex.',
          examples: [
            { welsh: 'tan', english: 'under; until' },
            { welsh: 'tân', english: 'fire' },
            { welsh: 'tŷ', english: 'house' },
          ],
        },
        {
          type: 'tip',
          body: 'Stress falls on the penultimate syllable and moves as the word grows: gáir, géiriau, geiriádur, geiriadúron.',
        },
      ],
    },
    {
      id: 'letter-y',
      kicker: 'Grammar',
      title: 'Y is “ee” only in the last syllable',
      blocks: [
        {
          type: 'rule',
          title: 'Two sounds, by position',
          body: 'In the final syllable, y sounds like the “ee” of dyn and mynd. In an earlier syllable it sounds like “uh”, so dynion, sychu, and the first y of ynys use that dull vowel. Inside wy, keep the “wi” sound: tywyll and bywyd.',
          examples: [
            { welsh: 'dyn', english: 'man' },
            { welsh: 'dynion', english: 'men' },
            { welsh: 'ynys', english: 'island' },
          ],
        },
        {
          type: 'tip',
          body: 'y, yr, yn, dy, and fy are exceptions to the final-syllable rule. After fy, gŵr appears as ngŵr, “my husband”.',
        },
      ],
    },
    {
      id: 'diphthongs',
      kicker: 'Phrase',
      title: 'A diphthong is one beat',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'tew',
            english: 'fat',
            note: 'ew ≈ “eh-oo”, as in llew and mewn.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'drwy',
            english: 'through',
            note: 'wy is “wi”, as in llwy. gwy- at the start of Gwynedd is “gwi-”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'croeso',
            english: 'welcome',
            note: 'oe is one beat, as in troed and croen.',
          },
        },
        {
          type: 'tip',
          body: 'ae, ai, ei, eu, and iw work the same way: cae, nai, tei, neu, ffliw. An unstressed -ai, as in dylai, sounds closer to -a in the north and -e in the south.',
        },
      ],
    },
    {
      id: 'consonants',
      kicker: 'Phrase',
      title: 'Ch, dd, ff, and ll are single sounds',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'chwech',
            english: 'six',
            note: 'ch is the scrape in “loch”, the same ch as in alarch.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'rhaff',
            english: 'rope',
            note: 'ff is an English “f”. A single f, as in tyfu, is “v”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'llenni',
            english: 'curtains',
            note: 'll is an l with a hiss of air. rh in rhosyn is an r with a puff before it.',
          },
        },
        {
          type: 'tip',
          body: 'th in cath is the th of “thin”, and dd in gardd is the th of “this”. si in siop is “sh”, and ph in phan is “f”.',
        },
      ],
    },
    {
      id: 'places',
      kicker: 'Culture',
      title: 'Names on the map, and a northern -e',
      blocks: [
        {
          type: 'culture',
          title: 'Say the place, then the vowel',
          body: 'Llan on a sign is the word llan, a church or a parish, and it often starts a place-name. Aberystwyth is worth saying slowly: the first y is “uh”, and the last y is “ee”. In the north, the final e of bore and rhedeg may sound like a.',
        },
        {
          type: 'say',
          line: {
            welsh: 'llan',
            english: 'church / parish',
            note: 'On a sign it usually shows up as Llan-.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'bore',
            english: 'morning',
            note: 'In the north, this final -e may sound like -a.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which spelling fits?',
      blocks: [
        {
          type: 'check',
          prompt: 'Which word means “fire”?',
          answer: 'tân',
          options: ['tan', 'tân', 'tîm'],
        },
        {
          type: 'check',
          prompt: 'Which y sounds like “ee”?',
          answer: 'dyn',
          options: ['dynion', 'dyn', 'sychu'],
        },
      ],
    },
  ],
}
