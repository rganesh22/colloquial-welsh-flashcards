import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '8',
  intro:
    'Letters about the royal family, written in literary Welsh. Watch the written forms of “am”, sentences that lead with the point, and the northern and southern words for “self”.',
  steps: [
    {
      id: 'letter',
      kicker: 'Phrase',
      title: 'A letter opens with Annwyl',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Annwyl Olygydd',
            english: 'Dear Editor',
            note: 'Before the noun, annwyl softens it: golygydd becomes Olygydd.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'creaduriaid bach annwyl',
            english: 'dear little things',
            note: 'In an ordinary phrase, annwyl follows the noun.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Cwrteisi yn costio dim',
            english: 'Courtesy costs nothing',
            note: 'Title of the first letter.',
          },
        },
        {
          type: 'tip',
          body: 'y teulu brenhinol is “the royal family”. Feminine brenhines softens after y, so “the Queen” is y Frenhines, and “the royal wedding” is y briodas frenhinol. hen also comes first and softens: hen ddyn, “an old man”.',
        },
      ],
    },
    {
      id: 'literary-bod',
      kicker: 'Grammar',
      title: 'Literary Welsh says yr wyf',
      blocks: [
        {
          type: 'rule',
          title: 'Written forms of bod',
          body: 'These letters use the literary shapes of “to be”. yr wyf and rwyf both mean “I am”, where speech says dw i or rw i. nid yw is literary “is not”, where speech says dyw or dydy.',
          examples: [
            { welsh: 'yr wyf', english: 'I am (literary)' },
            { welsh: 'rwyf', english: 'I am (formal written)' },
            { welsh: 'nid yw', english: 'is not (literary)' },
          ],
        },
        {
          type: 'tip',
          body: 'derbyniaf, “I accept”, uses a literary present ending. Speech keeps the verb-noun: dw i’n derbyn, or more formally rwyf yn derbyn. nad oedd is “that … was not”.',
        },
      ],
    },
    {
      id: 'focus',
      kicker: 'Pattern',
      title: 'The important words come first',
      blocks: [
        {
          type: 'rule',
          title: 'Fronting drops yn',
          body: 'A focused sentence puts the point before the verb. Trist iawn oedd darllen… is “it was very sad to read…”, with the plain order Roedd hi’n drist iawn…. A verb-noun in front of bod loses the linking yn.',
          examples: [
            {
              welsh: 'Trist iawn oedd darllen…',
              english: 'It was very sad to read…',
            },
            {
              welsh: 'tristáu a digalonni rwyf',
              english: 'I am saddened and disheartened',
            },
            { welsh: 'Cyfeirio yr wyf at…', english: 'I refer to…' },
          ],
        },
        {
          type: 'tip',
          body: 'The plain partners are rwyf yn tristáu a digalonni and rwyf yn cyfeirio at…. cyfeirio at softens the word that follows at.',
        },
      ],
    },
    {
      id: 'to-her',
      kicker: 'Grammar',
      title: 'To her can stand alone',
      blocks: [
        {
          type: 'rule',
          title: 'iddi, iddo, and “to them”',
          body: 'iddi means “to her” and iddo means “to him”. Leaving off hi or fe is fine in every style of Welsh. Literary “to them” is iddynt on its own; spoken Welsh keeps the pronoun and says iddyn nhw.',
          examples: [
            { welsh: 'iddi', english: 'to her' },
            { welsh: 'iddynt', english: 'to them (literary)' },
            { welsh: 'iddyn nhw', english: 'to them' },
          ],
        },
        {
          type: 'tip',
          body: 'ef is literary “he”, so iddo ef ei hun is “to himself”. In i\'n cysuro, “to comfort us”, that ’n is ein “our/us”, the same ’n as in a’n cyfoethogi, “and enrich us”.',
        },
      ],
    },
    {
      id: 'self',
      kicker: 'Culture',
      title: '“Self” splits North and South',
      blocks: [
        {
          type: 'culture',
          title: 'hun in the north, hunan in writing',
          body: 'Northern Welsh keeps one shape, hun: ei hun is “himself” or “herself”, and ein hun is “ourselves”. The south and the written standard use hunan for one person and hunain when there is more than one. The letters follow that written pattern in cysylltu eu hunain, “associate themselves”.',
        },
        {
          type: 'say',
          line: {
            welsh: 'ei hun',
            english: 'himself; herself',
            note: 'More northern. The same hun gives dy hun, “yourself”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ei hunan',
            english: 'himself; herself',
            note: 'Southern and written standard. Familiar “yourself” is dy hunan.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'eu hunain',
            english: 'themselves',
            note: 'Written plural. Northern speech uses eu hun here too. “Ourselves” in writing is ein hunain.',
          },
        },
      ],
    },
    {
      id: 'idioms',
      kicker: 'Phrase',
      title: 'Phrases the letters keep using',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'yn hanes ein cenedl',
            english: 'in the history of our nation',
            note: 'Noun plus noun does the work of “of”, with no “the” on hanes. After a number the noun stays singular: saith canrif a mwy, “seven centuries and more”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn gyhoeddus',
            english: 'publicly',
            note: 'yn plus an adjective means “in that way”, and it softens: yn ddibaid, yn fawr. yn araf keeps a, because araf starts with a vowel.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y fath ffwlbri',
            english: 'such nonsense',
            note: 'y fath softens the next word: y fath beth, “such a thing”. Weloch chi erioed y fath beth? softens the verb. Some areas say ffasiwn beth.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "o'u gwirfodd",
            english: 'of their own free will',
            note: '“My” is nasal: o ngwirfodd. “His” softens to o\'i wirfodd; “her” stays o\'i gwirfodd. A phrase set in the middle still softens what follows, so gysylltu comes after o\'u gwirfodd.',
          },
        },
        {
          type: 'tip',
          body: 'er tegwch is “in fairness”. The same er builds er mwyn, “for the sake of”, er gwaetha, “despite”, and er glendid, “for reasons of hygiene”; ers is “since”. Fe fyddai is “it would be”, yn ôl y sôn is “by all accounts”, and Duw a helpo is “God help”.',
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
          prompt: 'How does a letter to the editor open?',
          answer: 'Annwyl Olygydd',
          options: ['Olygydd annwyl', 'Annwyl Olygydd', 'Annwyl golygydd'],
        },
        {
          type: 'check',
          prompt: 'Which is the spoken way to say “to them”?',
          answer: 'iddyn nhw',
          options: ['iddynt', 'iddyn', 'iddyn nhw'],
        },
      ],
    },
  ],
}
