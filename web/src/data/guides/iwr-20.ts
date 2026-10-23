import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '20',
  intro:
    'A letter to the paper about the 2011 Assembly referendum. Watch “quite a lot”, negative “that”, and a “which” that shows up as a mutation.',
  steps: [
    {
      id: 'letter',
      kicker: 'Phrase',
      title: 'A letter that asks for Yes',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Digon aeddfed i lunio ein dyfodol ni ein hunain',
            english: 'Grown up enough to shape our own future',
            note: 'The verb-noun is llunio. After i it softens to lunio. ein … ein hunain is “our own”. Here aeddfed means grown up.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Annwyl Olygydd',
            english: 'Dear Editor',
            note: 'annwyl softens golygydd to Olygydd. This is the usual opening of a letter to a paper.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Pan ddaw'r Refferendwm – pleidleisiwch 'Ie'",
            english: "When the Referendum comes – vote 'Yes'",
            note: 'pan means “when” and softens the verb. daw is the short future of dod, “come”. pleidleisiwch! tells people to vote. One vote, the noun, is pleidlais.',
          },
        },
        {
          type: 'tip',
          body: 'am before a verb-noun often means “want to”, and it softens: am weld is “want to see”, am ganiatáu is “want to allow”. After cyfrifol, am means “for”: yn gyfrifol am lunio is “responsible for shaping”.',
        },
      ],
    },
    {
      id: 'cryn',
      kicker: 'Grammar',
      title: 'Quite a lot softens the next word',
      blocks: [
        {
          type: 'rule',
          title: 'cryn, then a soft start',
          body: 'cryn means quite a large amount, and it sits right before a noun or a verb-noun. The next word takes a soft mutation: diflastod becomes ddiflastod, and dadlau becomes ddadlau. If there is nothing to soften, the word stays put, as with syndod and ymateb.',
          examples: [
            { welsh: 'cryn ddiflastod', english: 'quite some disgust' },
            {
              welsh: 'bu cryn ddadlau',
              english: 'there has been quite a bit of arguing',
            },
            { welsh: 'cryn syndod', english: 'quite a surprise' },
          ],
        },
        {
          type: 'tip',
          body: 'Gyda chryn ddiflastod stacks two changes. gyda aspirates cryn to chryn, and cryn softens diflastod to ddiflastod: “with quite some disgust”.',
        },
      ],
    },
    {
      id: 'na-nad',
      kicker: 'Pattern',
      title: 'That … not is na or nad',
      blocks: [
        {
          type: 'rule',
          title: 'Vowel or mutation',
          body: 'A negative “that” is either na or nad. Use nad when the next word begins with a vowel, as in nad oes and nad agorodd. Use na when the next word takes a soft mutation: gall becomes all, so “that … cannot” is na all, and “why do you not come round?” is Pam na ddewch chi draw?',
          examples: [
            { welsh: 'nad oes gan …', english: 'that … does not have' },
            { welsh: 'na all …', english: 'that … cannot' },
            {
              welsh: 'Pam na ddewch chi draw?',
              english: "Why don't you come round?",
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "lle na allai'r Cynulliad",
            english: 'where the Assembly was not able',
            note: 'na opens the negative clause, and English adds no “that”. lle is a very common alternative to ble.',
          },
        },
        {
          type: 'tip',
          body: 'The same split follows os and am: os nad ydyn nhw\'n barod is “if they are not ready”, and am nad yw … is “since … is not”. gellir means “one can”. cyn y gellir deddfu is “before legislation can be brought in”, and the negative is na ellir.',
        },
      ],
    },
    {
      id: 'which',
      kicker: 'Pattern',
      title: 'Which can hide in a mutation',
      blocks: [
        {
          type: 'rule',
          title: 'The missing a',
          body: 'Welsh can leave out the relative word a and still say “which”. The soft mutation on the verb does that job: byddai becomes fyddai, caiff becomes gaiff, and gallai becomes allai. You read that mutation as the missing “which”.',
          examples: [
            { welsh: "deddfau fyddai'n rhoi", english: 'laws which would give' },
            { welsh: 'gaiff ei gynnig', english: 'which is/gets proposed' },
            { welsh: 'allai fod', english: 'which could be' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'cael ei mygu',
            english: 'be stifled',
            note: 'ei matches feminine deddfwriaeth, so mygu does not soften. yn sicr o means “certain to”: certain to be stifled.',
          },
        },
        {
          type: 'tip',
          body: 'Front a word when you mean “it is this, not something else”: Gwyddeleg maen nhw\'n siarad, it is Irish that they are speaking. Ai turns that into a question, Ai Gwyddeleg maen nhw\'n siarad?, and Nid makes the negative, Nid Gwyddeleg maen nhw\'n siarad.',
        },
      ],
    },
    {
      id: 'these-those',
      kicker: 'Phrase',
      title: 'These, those, and how on earth',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'y rhain',
            english: 'these (ones)',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y rheiny',
            english: 'those (ones)',
            note: 'Also y rheini, and the variant y rheina. y rheini sy\'n means “those who”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Beth am y rhain?',
            english: 'What about these?',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Sut yn y byd …?',
            english: 'How on earth …? (native idiom)',
            note: 'Literally “how in the world”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Dych chi o ddifri?',
            english: 'Are you serious?',
            note: 'o ddifri is “serious”. mewn difri is “in all seriousness”.',
          },
        },
        {
          type: 'tip',
          body: 'Sut ar y ddaear …? follows the English picture, and daear softens after y because it is feminine. For real astonishment, stretch it to Sut ar wyneb y ddaear …?',
        },
      ],
    },
    {
      id: 'assembly',
      kicker: 'Culture',
      title: 'The Assembly vote of 2011',
      blocks: [
        {
          type: 'culture',
          title: 'A Yes for the Assembly',
          body: 'This letter is about the 2011 referendum on extra powers for Cynulliad Cenedlaethol Cymru, the National Assembly for Wales. The writer asks for Ie, and sets \'True Wales\' against that as the campaign for the present system. The page is newspaper Welsh: iddynt is the literary “to them”, and speech says iddyn nhw. “Him” is o in the north and e in the south.',
        },
        {
          type: 'say',
          line: {
            welsh:
              "Ai cadw at y drefn hon mae 'True Wales' am weld yn digwydd?",
            english:
              "Is it sticking to this system that 'True Wales' want to see happen?",
            note: 'The focus is cadw at, “stick to”. trefn is feminine, so “the present system” is y drefn bresennol.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'er ein lles ni',
            english: 'for our benefit',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "a'n bod ni â",
            english: 'and that we have',
            note: 'Literally “and that we are with”. â can mark an abstract possession, beside gan or gyda. ein bod ni on its own is “that we are”. yr un fath ag o is “the same as him”, with ag before the vowel; before a consonant it is yr un fath â.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which form is right?',
      blocks: [
        {
          type: 'check',
          prompt: 'You want “quite some disgust”. Which phrase is right?',
          answer: 'cryn ddiflastod',
          options: ['cryn diflastod', 'cryn ddiflastod', 'cryn syndod'],
        },
        {
          type: 'check',
          prompt: 'How does this chapter say “that she didn\'t open”?',
          answer: 'nad agorodd hi',
          options: ['na agorodd hi', 'nad agorodd hi', 'na all hi'],
        },
      ],
    },
  ],
}
