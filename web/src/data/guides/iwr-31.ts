import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '31',
  intro:
    'How this chapter talks about the works, the neighbourhood, and the deacon who settled disputes. Literary Welsh, and the pronoun that stays on the preposition.',
  steps: [
    {
      id: 'neighbourhood',
      kicker: 'Phrase',
      title: 'The neighbourhood I was brought up in',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'y Caeau Cochion',
            english: 'the Red Fields',
            note: 'cochion is the plural of coch, used with a plural noun in a literary or set name.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y gymdogaeth y magwyd fi ynddi',
            english: 'the neighbourhood I was brought up in',
            note: 'cymdogaeth is feminine, so the article softens it to y gymdogaeth.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y tŷ y magwyd nhw ynddo',
            english: 'the house they were brought up in',
            note: 'tŷ is masculine, so “in it” is ynddo. magwyd is “was brought up”.',
          },
        },
      ],
    },
    {
      id: 'preposition',
      kicker: 'Grammar',
      title: 'The preposition keeps a pronoun',
      blocks: [
        {
          type: 'rule',
          title: 'ynddi and ynddo',
          body: 'When a relative clause ends in a preposition, Welsh puts a pronoun on that preposition and points it back at the noun. The pronoun matches gender: ynddi after a feminine noun, ynddo after a masculine one. magwyd is the impersonal preterite of magu, “was brought up”.',
          examples: [
            {
              welsh: 'y gymdogaeth y magwyd fi ynddi',
              english: 'the neighbourhood I was brought up in',
            },
            {
              welsh: 'y tŷ y magwyd nhw ynddo',
              english: 'the house they were brought up in',
            },
          ],
        },
        {
          type: 'tip',
          body: 'dan and ei both soften the next word. a oedd dan ei ofal is “who were under his care”, with gofal as ofal.',
        },
      ],
    },
    {
      id: 'whatever',
      kicker: 'Pattern',
      title: 'Whatever dispute arose',
      blocks: [
        {
          type: 'rule',
          title: 'pa … bynnag',
          body: 'Put the noun between pa and bynnag, so Pa anghydwelediad bynnag a godai is “whatever dispute arose”. The relative a softens the verb, so the literary imperfect of codi is godai. nid oedd eisiau ond i Abraham Jones gyflafareddu means he had only to arbitrate, and a thawelai popeth shows tawelu aspirated after a, “and”.',
          examples: [
            {
              welsh: 'Pa anghydwelediad bynnag a godai',
              english: 'Whatever dispute arose',
            },
            {
              welsh: 'nid oedd eisiau ond i Abraham Jones gyflafareddu',
              english: 'Abraham Jones had only to arbitrate',
            },
            {
              welsh: 'a thawelai popeth',
              english: 'and everything would calm down',
            },
          ],
        },
        {
          type: 'tip',
          body: 'trigle\'r bai is “the root of the problem”, literally “the dwelling-place of the fault”.',
        },
      ],
    },
    {
      id: 'literary',
      kicker: 'Phrase',
      title: 'Older endings on the verb',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'os wyf yn cofio',
            english: 'if I remember',
            note: 'wyf is literary “am”. In speech: os dw i’n cofio.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'goruchwylid',
            english: 'was/were supervised',
            note: 'Imperfect impersonal, ending -id. The same ending gives awgrymid, “it was suggested”, and dywedid, “it was said”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'profasai',
            english: 'he had proved',
            note: 'The -as- infix is the literary pluperfect, the same idea as oedd wedi profi. ydoedd is literary oedd.',
          },
        },
      ],
    },
    {
      id: 'plainly',
      kicker: 'Grammar',
      title: 'Pretty plainly, and as he wished',
      blocks: [
        {
          type: 'rule',
          title: 'lled, mor … â, and mai',
          body: 'lled sits in front of an adjective and softens it, so croyw becomes groyw in yn lled groyw, “pretty plainly”. mor … â is “as … as”, and â becomes ag before a vowel, so “as he had wished” is ag y dymunasai. mai opens a focused that-clause and nad is its negative: ond mai eisiau oedd ar rai ohonynt means “but that some of them wanted”, with eisiau ar for “want”.',
          examples: [
            { welsh: 'yn lled groyw', english: 'pretty plainly' },
            { welsh: 'ag y dymunasai', english: 'as he had wished' },
            {
              welsh: 'ond mai eisiau oedd ar rai ohonynt',
              english: 'but that some of them wanted',
            },
          ],
        },
        {
          type: 'tip',
          body: 'Pa un ai cam ai cymwys is “whether rightly or wrongly”, in the order “wrong or right”. cam here means “wrong”; the noun cam is “step”. The prefix cam- means mis-, as in camgymeriad, “mistake”.',
        },
      ],
    },
    {
      id: 'chapel',
      kicker: 'Culture',
      title: 'A deacon with the Independents',
      blocks: [
        {
          type: 'culture',
          title: 'Annibynwyr, and a formal friend',
          body: 'Annibynwyr names the Independents, the Congregationalist denomination. A diacon gyda’r Annibynwyr is a deacon with that chapel. The same formal register uses cyfaill for friend, where everyday Welsh says ffrind, and rhoddi and gweled where speech says rhoi and gweld.',
        },
        {
          type: 'say',
          line: {
            welsh: 'diacon gyda’r Annibynwyr',
            english: 'a deacon with the Independents',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'gŵr pwyllog',
            english: 'a sensible man',
            note: 'pwyllog comes from pwyll, “sense, caution”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'gan fod ganddynt ŵr o Sais',
            english: 'since they had an Englishman',
            note: 'gan fod is “since”. ganddynt is literary for ganddyn nhw. gŵr o Sais is literally “a man of an Englishman”.',
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
            'cymdogaeth is feminine. Which phrase is “the neighbourhood I was brought up in”?',
          answer: 'y gymdogaeth y magwyd fi ynddi',
          options: [
            'y gymdogaeth y magwyd fi ynddo',
            'y gymdogaeth y magwyd fi ynddi',
            'y cymdogaeth y magwyd fi ynddi',
          ],
        },
        {
          type: 'check',
          prompt: 'Which wording is “whatever dispute arose”?',
          answer: 'Pa anghydwelediad bynnag a godai',
          options: [
            'Pa bynnag anghydwelediad a godai',
            'Pa anghydwelediad bynnag a godai',
            'Anghydwelediad pa bynnag a godai',
          ],
        },
      ],
    },
  ],
}
