import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '3',
  intro:
    'How the charity-tour reading and the Bond reading handle time, purpose, and the word that matters. Linking i, er mwyn, and formal versus everyday wording do most of the work.',
  steps: [
    {
      id: 'singer',
      kicker: 'Phrase',
      title: 'The pop singer softens twice',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'y gantores bop',
            english: 'the pop singer',
            note: 'cantores is feminine, so y softens c to g, and pop softens to bop.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ei halbwm diweddaraf',
            english: 'her latest album',
            note: 'ei “her” puts h- on a vowel. diweddaraf is a superlative; speech often drops the final f.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn ystod y daith',
            english: 'during the tour',
            note: 'taith is feminine, so the article softens it to y daith.',
          },
        },
        {
          type: 'tip',
          body: 'ar gyfer covers most senses of “for”. ar gyfer cyngerdd is “for a concert”.',
        },
      ],
    },
    {
      id: 'time-i',
      kicker: 'Grammar',
      title: 'Since, before, and after need i',
      blocks: [
        {
          type: 'rule',
          title: 'Linking i, then a soft verb-noun',
          body: 'ers, cyn, ar ôl, nes, and wrth take a linking i when they have their own subject and verb. The subject softens after i, and the verb-noun softens after the subject. The verb-noun shows no tense; you take that from the sentence around it.',
          examples: [
            {
              welsh: "ers i ddaeargryn daro'r wlad",
              english: 'since an earthquake struck the country',
            },
            { welsh: 'cyn inni fynd', english: 'before we go; before we went' },
            {
              welsh: "ar ôl i'r siaradwr gyrraedd",
              english: 'after the speaker arrives',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'nes iddyn nhw gytuno',
            english: 'until they agree',
            note: 'cytuno softens to gytuno after nhw.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "wrth i'r sefyllfa waethygu",
            english: 'as the situation deteriorates',
            note: 'Here wrth means “as” or “while”.',
          },
        },
      ],
    },
    {
      id: 'er-mwyn',
      kicker: 'Pattern',
      title: 'For their sake, or so they can',
      blocks: [
        {
          type: 'rule',
          title: 'er mwyn',
          body: 'With a noun, er mwyn means “for the sake of”. With a verb-noun, or with i plus a subject and a verb-noun, it means “in order to”. A pronoun puts its possessive between er and mwyn.',
          examples: [
            { welsh: 'er mwyn y plant', english: 'for the sake of the children' },
            { welsh: 'er mwyn iddyn nhw', english: 'in order for them (to)' },
            { welsh: 'er ei mwyn hi', english: 'for her sake' },
          ],
        },
        {
          type: 'tip',
          body: 'Mae disgwyl i Lady Gaga fod means she is expected to be something, and Mae Lady Gaga am helpu pobol means she wants to help. Keen to do something works the same way: yn awyddus iawn i roi help.',
        },
      ],
    },
    {
      id: 'perfect',
      kicker: 'Grammar',
      title: 'Raised the money, or still raising it',
      blocks: [
        {
          type: 'rule',
          title: 'wedi, wedi bod yn, and cael',
          body: 'wedi plus a verb-noun is a finished result: the money has been raised. Put bod yn in between when the activity has been going on. cael plus a possessive plus a verb-noun says what was done to something, and the possessive matches that thing.',
          examples: [
            {
              welsh: 'Mae hi wedi bod yn codi arian',
              english: 'She has been raising money',
            },
            { welsh: 'Mae hi wedi codi arian', english: 'She has raised money' },
            {
              welsh: 'Cafodd trefi a phentrefi cyfan eu dinistrio',
              english: 'Whole towns and villages were destroyed',
            },
          ],
        },
        {
          type: 'tip',
          body: 'eu matches the plural towns and villages. A feminine film takes ei: cael ei rhyddhau is “be released”. The same pattern gives Fe gafodd y gwaith ffilmio ei ohirio, “the filming was postponed”.',
        },
      ],
    },
    {
      id: 'focus',
      kicker: 'Pattern',
      title: 'The channel goes first',
      blocks: [
        {
          type: 'rule',
          title: 'News first, then sy or fydd',
          body: "Put the new piece of information first, then sy or a softened bydd, instead of leading with mae. Sianel deledu MTV sy'n trefnu'r cyfan means the channel, not someone else, is organising the whole thing. Hon is feminine to agree with ffilm, and fydd is bydd after that opening word.",
          examples: [
            {
              welsh: "Sianel deledu MTV sy'n trefnu'r cyfan",
              english:
                'The whole thing is being organised by the MTV television channel',
            },
            { welsh: 'Hon fydd ffilm rhif 23', english: 'This will be film number 23' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "Sawl llyfr sy 'na?",
            english: 'How many books are there?',
            note: 'sawl always takes a singular noun. sawl ffordd wahanol is “a number of different ways”.',
          },
        },
      ],
    },
    {
      id: 'already',
      kicker: 'Culture',
      title: 'Already has a formal shape',
      blocks: [
        {
          type: 'culture',
          title: 'eisoes or yn barod',
          body: "eisoes is formal “already”, and the sy beside it is often the slightly more formal sydd: gŵr sydd eisoes wedi ennill Oscar. Everyday Welsh puts yn barod at the end of the clause, and yn barod also means “ready”. achos is the usual “because” before a clause; oherwydd y rhyfel means “because of the war”, and o'r herwydd means “because of that”.",
        },
        {
          type: 'say',
          line: {
            welsh: 'Mae Bond yn ei ôl',
            english: 'Bond is back',
            note: 'ei can drop once he is named. Dewch yn ôl yn fuan is “come back soon”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn ôl y wybodaeth ddiweddaraf',
            english: 'according to the latest information',
            note: 'gwybodaeth is feminine, so y wybodaeth, and diweddaraf softens after it.',
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which sentence fits?',
      blocks: [
        {
          type: 'check',
          prompt: 'You want “since an earthquake struck the country”. Which is right?',
          answer: "ers i ddaeargryn daro'r wlad",
          options: [
            "ers daeargryn taro'r wlad",
            "ers i ddaeargryn daro'r wlad",
            "ers i ddaeargryn taro'r wlad",
          ],
        },
        {
          type: 'check',
          prompt: 'She has been raising money, and it is still that activity. Which matches?',
          answer: 'Mae hi wedi bod yn codi arian',
          options: [
            'Mae hi wedi codi arian',
            'Mae hi wedi bod yn codi arian',
            'Mae hi wedi bod codi arian',
          ],
        },
      ],
    },
  ],
}
