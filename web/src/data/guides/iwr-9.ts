import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '9',
  intro:
    'How a Pembrokeshire paper remembers Waldo, poet of Kimbolton. Watch the finished past, the news passive, and the little word mai.',
  steps: [
    {
      id: 'headline',
      kicker: 'Phrase',
      title: 'The paper calls him its poet',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Waldo'n fardd bro Kimbolton",
            english: 'Waldo, poet of Kimbolton',
            note: "After 'n, bardd softens to fardd. The plural is beirdd.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'papur bro',
            english: 'local (community) newspaper',
            note: 'bro is feminine, so “the area” is y fro.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Sir Benfro',
            english: 'Pembrokeshire',
            note: 'Penfro softens after sir. North of the county is gogledd Sir Benfro.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'cofio am',
            english: 'remember; commemorate',
            note: 'am softens the next word. i gofio amdano is “to remember him”; the pronoun after amdano is often left off.',
          },
        },
        {
          type: 'tip',
          body: 'Learn ym mherfeddion Lloegr as a set phrase: in the depths of England. yn has become ym, and perfeddion shows the nasal mutation.',
        },
      ],
    },
    {
      id: 'fe-fu',
      kicker: 'Grammar',
      title: 'fe fu is a past that ended',
      blocks: [
        {
          type: 'rule',
          title: 'Preterite of bod',
          body: 'fe fu is the preterite of bod, for a past state that came to an end. oedd would leave that same kind of state open in time. Visits often take this tense, because you went and then came back.',
          examples: [
            { welsh: 'fe fu', english: 'was (and it came to an end)' },
            {
              welsh: 'Fe fuon ni yn Iwerddon llynedd',
              english: 'We were in Ireland last year (and came back)',
            },
            {
              welsh: "Fe fu Waldo'n athro Lladin",
              english: 'Waldo was a Latin teacher',
            },
          ],
        },
      ],
    },
    {
      id: 'unveil',
      kicker: 'Pattern',
      title: 'Three ways to unveil a slate',
      blocks: [
        {
          type: 'rule',
          title: 'cael, or the ending -ir',
          body: 'News Welsh can name the slate first and let cael carry the verb-noun. bydd … yn cael is the long future, caiff is the short future, and colloquial speech also says ceith. The ending -ir is the formal impersonal, with no cael in the sentence.',
          examples: [
            {
              welsh: 'bydd llechen yn cael ei dadorchuddio',
              english: 'a slate will be unveiled',
            },
            {
              welsh: 'caiff llechen ei dadorchuddio',
              english: 'a slate will be unveiled (short future)',
            },
            {
              welsh: 'dadorchuddir llechen',
              english: 'a slate will be unveiled (formal impersonal)',
            },
          ],
        },
        {
          type: 'tip',
          body: 'llechen is feminine, so ei dadorchuddio keeps its d. plac is masculine, so cyn i\'r plac gael ei ddadorchuddio softens to dd. The same news style uses Disgwylir i rai…, ar y cyd for “jointly”, and a gynhelir for “which will be held” (the a of cynnal becomes e). cyd- means co-, as in cydweithio, cydymdeimlad, and cydamseru.',
        },
      ],
    },
    {
      id: 'mai',
      kicker: 'Grammar',
      title: 'mai fronts the part that matters',
      blocks: [
        {
          type: 'rule',
          title: 'that, when the verb is not next',
          body: 'lled means fairly or quite, and it softens the next adjective, so tebyg becomes debyg. mai means that when what follows is not the verb: the focused words come first, then y and the verb. In the south, taw can fill the same slot.',
          examples: [
            {
              welsh: "mae'n lled debyg mai",
              english: "it's quite likely that (focused)",
            },
            {
              welsh:
                "mai ar derfyn ei gyfnod yn Kimbolton y cyfansoddodd Waldo'r gerdd",
              english:
                'that it was at the end of his time in Kimbolton that Waldo composed the poem',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'ar fin',
            english: 'on the point of; about to',
            note: 'A verb-noun follows: pan oedd ar fin symud — when he was about to move.',
          },
        },
        {
          type: 'tip',
          body: 'hyn is this for an idea just stated: Mae hyn yn profi…. (y) tu hwnt i means beyond, and the i softens the next word: y tu hwnt i ffiniau Cymru.',
        },
      ],
    },
    {
      id: 'deeper',
      kicker: 'Pattern',
      title: 'Comparatives that change the word',
      blocks: [
        {
          type: 'rule',
          title: 'Inside the adjective',
          body: 'Some comparatives change the stem, not only the ending. dwfn turns w into y for dyfnach and dyfna (formal spelling dyfnaf); caled hardens d to t in caletach; tlawd becomes tlotach, or dlotach after a soft mutation. gymaint â hynny\'n means all the more, and that \'n softens the comparative.',
          examples: [
            { welsh: 'dyfnach', english: 'deeper' },
            { welsh: 'caletach', english: 'harder' },
            {
              welsh: "gymaint â hynny'n ddyfnach",
              english: 'that much deeper; all the deeper',
            },
          ],
        },
        {
          type: 'tip',
          body: 'A literary verb ending softens the next verb: a ddymuna deithio, and i bwy bynnag a ddymuna deithio is “to whoever wishes to travel”. After a verb-noun there is no soft mutation: sy\'n dymuno teithio. os am fwy o fanylion means if you want more details; Wyt ti am ddod \'da ni? is the same am for “want to”.',
        },
      ],
    },
    {
      id: 'places',
      kicker: 'Culture',
      title: 'A local paper, and English towns in Welsh',
      blocks: [
        {
          type: 'culture',
          title: 'papur bro',
          body: 'A papur bro is an independent Welsh-language community paper, usually monthly. Clebran is the one in the Preseli area, and this chapter speaks from gogledd Sir Benfro about a poet whose school stood ym mherfeddion Lloegr. Those English towns keep Welsh names: Caergrawnt is Cambridge, Llundain is London, Manceinion is Manchester, Caerwrangon is Worcester, Caerloyw is Gloucester, and Shrewsbury is yr Amwythig, with the article.',
        },
        {
          type: 'say',
          line: {
            welsh: "i'r gorllewin o",
            english: 'to the west of',
            note: 'o softens the place: i\'r gorllewin o Gaergrawnt. milltir stays singular after a number: 25 milltir.',
          },
        },
        {
          type: 'tip',
          body: 'ar ran means on behalf of, as in ar ran Cymdeithas Hanes Kimbolton. o ran means as regards. A notice says cysyllter â… for contact; speaking to someone, say cysylltwch. eisoes is the formal already, beside everyday yn barod. ma\' is a spoken spelling of mae, so write mae.',
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
          prompt: 'The visit to Ireland is over. Which sentence shows that?',
          answer: 'Fe fuon ni yn Iwerddon llynedd',
          options: [
            'Fe fuon ni yn Iwerddon llynedd',
            "mae'n lled debyg mai",
            'bydd llechen yn cael ei dadorchuddio',
          ],
        },
        {
          type: 'check',
          prompt: 'Which is the formal impersonal for “a slate will be unveiled”?',
          answer: 'dadorchuddir llechen',
          options: [
            'caiff llechen ei dadorchuddio',
            'dadorchuddir llechen',
            "cyn i'r plac gael ei ddadorchuddio",
          ],
        },
      ],
    },
  ],
}
