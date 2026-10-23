import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '22',
  intro:
    'How to talk about a workshop at the bottom of the garden. You will meet the passive, the focused sentence, and the traditional word for twenty.',
  steps: [
    {
      id: 'workshop',
      kicker: 'Phrase',
      title: 'The office is a wooden cabin',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'gweithdy',
            english: 'workshop',
            note: 'Y Gweithdy, from gwaith + tŷ. The commute is cymudo i waelod yr ardd gefn, to the bottom of the back garden.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Sied neu gaban pren yw fy swyddfa i',
            english: 'my office is a wooden shed or cabin',
            note: 'pren after a noun means wooden: caban pren.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "mae'r lle 'ma'n llanast",
            english: 'this place is a tip',
          },
        },
        {
          type: 'tip',
          body: 'anialwch usually means a desert or wilderness. In this chapter it means chaos, the same idea as llanast. mae\'n debyg means probably or apparently, either at the start or tagged on the end.',
        },
      ],
    },
    {
      id: 'passive',
      kicker: 'Grammar',
      title: 'Moved, or just closed',
      blocks: [
        {
          type: 'rule',
          title: "wedi'i, with cael or without",
          body: "To say something has been done, use wedi with ei and a verb-noun. cael can stay, as in wedi cael ei, or drop out, as in wedi'i, but a pure state such as a closed window drops cael. ffenest is feminine, so ei brings the aspirate and cau becomes chau.",
          examples: [
            { welsh: "wedi'i symud", english: 'has been moved' },
            {
              welsh: "mae'r ffenest wedi (cael) ei chau",
              english: 'the window has been closed',
            },
            { welsh: "ffenest wedi'i chau", english: 'a closed window' },
          ],
        },
        {
          type: 'tip',
          body: "ar fin means about to, and it takes the same passive: ar fin cael eu darllen. cael plus a verb-noun means get to, and the whole phrase can be the subject: mae cael siarad â nhw yn ysbrydoliaeth.",
        },
      ],
    },
    {
      id: 'focus',
      kicker: 'Pattern',
      title: 'The person comes first',
      blocks: [
        {
          type: 'rule',
          title: 'Focus softens the verb',
          body: 'A focused sentence puts the important person first, and the verb after them softens. gwnaeth becomes wnaeth, and peintiodd becomes beintiodd. Blame works the same way: the guilty party starts the sentence.',
          examples: [
            {
              welsh: "a'r gŵr wnaeth y gwaith adeiladu",
              english: 'and (it was) my husband (who) did the building',
            },
            {
              welsh: 'fy llysfab beintiodd',
              english: 'it was my stepson who painted',
              note: 'llys- means step-: llysferch stepdaughter, llysfam stepmother.',
            },
            { welsh: 'fi sydd ar fai', english: "I'm to blame" },
          ],
        },
        {
          type: 'tip',
          body: "nid in front of a focused sentence denies it: nid Elwyn enillodd, nid fi sy ar fai. wrth i plus a person plus a soft-mutated verb-noun means as or while: wrth i fi baratoi. The relative a softens too: y llyfrau a luniodd fy nghymeriad.",
        },
      ],
    },
    {
      id: 'quantity',
      kicker: 'Grammar',
      title: 'Quite a bit, and not much',
      blocks: [
        {
          type: 'rule',
          title: 'cryn, fawr, and cynifer',
          body: "cryn, “quite”, softens the next word, so tipyn becomes dipyn, though nifer resists and you still say cryn nifer. does fawr o, “there’s not much”, softens mawr and the noun after o. cynifer is “so many” and cymaint is “so much”, and both link to the noun with o.",
          examples: [
            { welsh: 'cryn dipyn', english: 'quite a bit; quite a lot' },
            { welsh: 'does fawr o olygfa', english: "there's not much of a view" },
            { welsh: 'cynifer o bobol', english: 'so many people' },
          ],
        },
        {
          type: 'tip',
          body: "lu after a plural means loads of: lluniau lu. Posters say Dewch yn llu, come in droves, and here yn means “as”. gwirioneddol before an adjective softens it (gwirioneddol greadigol), and yn hytrach na takes the aspirate: yn hytrach na chau'r drws.",
        },
      ],
    },
    {
      id: 'ugain',
      kicker: 'Culture',
      title: 'Twenty is still ugain',
      blocks: [
        {
          type: 'culture',
          title: 'Years, minutes, and pounds',
          body: 'Dauddeg is the decimal twenty, the form that was promoted as simpler. Years, minutes, and pounds still take traditional ugain, and blynedd nasalises after it, giving ugain mlynedd. The same traditional run keeps deunaw for eighteen, literally two nines, deuddeg for twelve, and pymtheg for fifteen.',
        },
        {
          type: 'say',
          line: { welsh: 'ugain mlynedd', english: '20 years' },
        },
        {
          type: 'say',
          line: {
            welsh: 'ugain munud',
            english: '20 minutes',
            note: 'The traditional form used in telling the time.',
          },
        },
        {
          type: 'say',
          line: { welsh: 'ugain punt', english: '£20' },
        },
      ],
    },
    {
      id: 'states',
      kicker: 'Phrase',
      title: 'Open, owned, and delighted',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'ar agor led y pen',
            english: 'wide open',
            note: 'ar marks a temporary state and softens the next word: ar gau closed, ar goll lost, ar ddihun awake, ar fai to blame.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'fy ngŵr piau',
            english: "my husband owns; ... are my husband's",
            note: 'Also fy ngŵr biau and fy ngŵr sy biau. There is no linking yn before piau.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'wrth fy modd',
            english: 'delighted (me)',
            note: "His is wrth ei fodd (soft mutation). Hers is wrth ei bodd. A room of your own is i chi'ch hun. byddwn wrth fy modd — I’d love to.",
          },
        },
        {
          type: 'tip',
          body: "wn i ddim, dwn i ddim, sa i'n gwybod, and smo fi'n gwybod all mean “I don't know”. Use the one you hear. byddai'n means “would” and also “used to”: byddai'n ymweld â'r dafarn leol, and tafarn is feminine, so y dafarn leol.",
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which form is it?',
      blocks: [
        {
          type: 'check',
          prompt: 'Which one means “the window has been closed”?',
          answer: "mae'r ffenest wedi (cael) ei chau",
          options: [
            "mae'r ffenest wedi (cael) ei chau",
            "ffenest wedi'i chau",
            "mae'r ffenest wedi cael ei cau",
          ],
        },
        {
          type: 'check',
          prompt: 'How do you say “20 years”?',
          answer: 'ugain mlynedd',
          options: ['dauddeg mlynedd', 'ugain mlynedd', 'ugain blynedd'],
        },
      ],
    },
  ],
}
