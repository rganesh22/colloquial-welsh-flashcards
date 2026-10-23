import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '21',
  intro:
    'A funding cut hits the Chair of Celtic at Oxford. Watch the cael-passive, the relative “who”, and how Welsh says “because”.',
  steps: [
    {
      id: 'headline',
      kicker: 'Phrase',
      title: 'A blow to the Chair',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'ergyd ariannol',
            english: 'financial blow',
            note: 'The headline softens the feminine noun after i: Ergyd ariannol i Gadair Geltaidd.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y Gadair Geltaidd',
            english: 'the Chair of Celtic (professorship)',
            note: 'cadair is feminine, so y softens it and the adjective softens too: Gadair, Geltaidd.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yr Athro Celteg',
            english: 'the Professor of Celtic',
            note: 'Athro as a title means Professor. Celteg is the languages as a subject; the adjective is Celtaidd, as in diwylliant Celtaidd.',
          },
        },
        {
          type: 'tip',
          body: 'er mwyn sits straight on a verb-noun: er mwyn sicrhau, in order to ensure. er mwyn sicrhau parhad y Gadair is “in order to ensure the continuation of the Chair”.',
        },
      ],
    },
    {
      id: 'passive',
      kicker: 'Grammar',
      title: 'Has been funded',
      blocks: [
        {
          type: 'rule',
          title: 'The cael-passive',
          body: 'To say that something is done to a person or thing, Welsh uses cael plus a possessive plus a verb-noun. The possessive agrees with the subject, and it mutates the verb. Feminine ei takes the aspirate mutation, masculine ei takes soft mutation, and a plural subject takes eu.',
          examples: [
            {
              welsh: 'wedi cael ei chyllido',
              english: 'has been funded (feminine subject)',
            },
            {
              welsh: 'Bydd olynydd yn cael ei benodi',
              english: 'A successor will be appointed',
            },
            {
              welsh: "gwaddolion sy'n cael eu dal gan Goleg Iesu",
              english: 'endowments that are held by Jesus College',
            },
          ],
        },
        {
          type: 'tip',
          body: 'The same ei before a verb-noun means “fund it” when the thing is feminine: ei chyllido. Literary Welsh says ni fydd for “will not be”; speech says fydd … ddim.',
        },
      ],
    },
    {
      id: 'relative',
      kicker: 'Pattern',
      title: 'Who studied, who studies',
      blocks: [
        {
          type: 'rule',
          title: 'Relative a, except with bod now',
          body: 'a means “who” or “which” before a verb that has an ending, and it softens the next word. The present of bod does not take a: it uses sy or sydd instead. In speech and informal writing, a is often dropped, so you hear only the verb.',
          examples: [
            { welsh: 'a astudiodd', english: 'who studied' },
            { welsh: 'a fydd yn astudio', english: 'who will study' },
            { welsh: "sy'n astudio", english: 'who studies; who is studying' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'sy wedi astudio',
            english: 'who has studied',
            note: 'bod is still present, so the relative stays sy. For the imperfect, a oedd yn astudio often loses the a.',
          },
        },
      ],
    },
    {
      id: 'because',
      kicker: 'Phrase',
      title: 'Because, need, and surprise',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'gan fod angen',
            english: 'since one needs',
            note: 'gan, achos, oherwydd, and am mean “because” before a that-clause. gan and am soften bod to fod; gan before a noun means “by”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'mae angen',
            english: 'is needed; are needed',
            note: 'Literally “there is need of”: mae angen ffynonellau newydd o arian.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Dw i'n synnu",
            english: "I'm surprised",
            note: 'synnu is active. Mae llawer o bobl yn synnu, and llawer o softens pobl to bobl.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Mae'r toriad yn ganlyniad i'r argyfwng",
            english: 'the cut is a result of the crisis',
            note: 'yn before canlyniad is the predicative “is a”.',
          },
        },
        {
          type: 'tip',
          body: "Past surprise is O'n i'n synnu, or (Fe) ges i'n synnu. “That it is possible” is bod modd: Mae llawer o bobl yn synnu bod modd astudio'r Gymraeg yn Rhydychen.",
        },
      ],
    },
    {
      id: 'oxford',
      kicker: 'Culture',
      title: 'Oxford and the Chair',
      blocks: [
        {
          type: 'culture',
          title: 'Rhydychen',
          body: 'Rhydychen is Oxford, literally the oxen’s ford, from rhyd and ychen. The university is Prifysgol Rhydychen, and the blow in this chapter falls on its Chair of Celtic, with endowments held by Jesus College and Welsh manuscripts that were at Christ Church. When the place is out of sight, “there” is yno; yna is “there” in view.',
        },
        {
          type: 'say',
          line: {
            welsh: 'yn ymddeol yn swyddogol',
            english: 'officially retire; be officially retiring',
            note: 'The first yn links the verb-noun to the auxiliary. The second yn makes an adverb and softens: yn barhaol. On s, that softening does not show, so yn swyddogol looks unchanged.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'fe fydd yn parhau',
            english: 'he will continue',
            note: 'The pronoun e is left out when it is clear who is meant, and fe softens bydd to fydd. parhau i plus a verb-noun means continue to do: parhau i gyfarwyddo.',
          },
        },
        {
          type: 'tip',
          body: 'cyn- means “ex-” or “former”, with a hyphen and soft mutation: cyn-fyfyrwyr. ôl- means “post-” and softens too: ôl-raddedig. Formal “I got” is cefais i; speech says ces i.',
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
          prompt: 'The Chair is feminine, and it has been funded. Which phrase agrees?',
          answer: 'wedi cael ei chyllido',
          options: [
            'Bydd olynydd yn cael ei benodi',
            'wedi cael ei chyllido',
            "gwaddolion sy'n cael eu dal gan Goleg Iesu",
          ],
        },
        {
          type: 'check',
          prompt: 'You mean “who is studying” now. Which relative is right?',
          answer: "sy'n astudio",
          options: ['a astudiodd', "sy'n astudio", 'a fydd yn astudio'],
        },
      ],
    },
  ],
}
