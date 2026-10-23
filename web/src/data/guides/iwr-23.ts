import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '23',
  intro:
    'A letter to the weekly Y Cymro looks for beauty in a bleak slate landscape. Watch the superlatives, the impersonal verbs, and the phrases a formal letter uses to concede a point and then go on.',
  steps: [
    {
      id: 'letter',
      kicker: 'Phrase',
      title: 'A letter about bleak beauty',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'harddwch yn y llymder',
            english: 'beauty in the bleakness',
            note: 'harddwch comes from hardd “beautiful”. llymder comes from llym “harsh, severe”, and can also mean austerity.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Annwyl Olygydd',
            english: 'Dear Editor',
            note: 'Annwyl softens golygydd, so the g is written O.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Ble mae'r lle hyllaf yng Nghymru?",
            english: 'Where is the ugliest place in Wales?',
            note: 'The question this letter is answering.',
          },
        },
        {
          type: 'tip',
          body: 'Two small phrases from the same letter: yn ddiweddar is “recently”, and gyda diddordeb is “with interest”. annisgwyl “unexpected” is the opposite of disgwyliedig “expected”.',
        },
      ],
    },
    {
      id: 'superlative',
      kicker: 'Grammar',
      title: 'Ugliest, and “in Wales”',
      blocks: [
        {
          type: 'rule',
          title: '-af, then a nasal',
          body: 'Hyll “ugly” makes its superlative with -af: hyllaf “ugliest”. Yn “in” nasals the next word, so Cymru becomes Nghymru and yn itself is written yng. Hawdd “easy” is irregular: the forms to learn are haws “easier” and hawsaf “easiest”.',
          examples: [
            {
              welsh: "Ble mae'r lle hyllaf yng Nghymru?",
              english: 'Where is the ugliest place in Wales?',
            },
            { welsh: 'haws', english: 'easier' },
            { welsh: 'y rhan hawsaf i weld', english: 'the easiest part to see' },
          ],
        },
        {
          type: 'tip',
          body: 'You will also hear the regular pair hawddach and hawdda. hawsaf is also spelt hawsa.',
        },
      ],
    },
    {
      id: 'impersonal',
      kicker: 'Pattern',
      title: 'There was, with no person named',
      blocks: [
        {
          type: 'rule',
          title: 'Cafwyd and gellir',
          body: 'Cafwyd is the past impersonal of cael. Use it for “there was” or “there were” when you are not naming who received or did it. Sawl “several” stays with a singular noun, so the noun is cynnig, and gellir is the impersonal of gallu: “one can” or “can be”.',
          examples: [
            { welsh: 'Cafwyd sawl cynnig', english: 'There were several suggestions' },
            { welsh: 'cafwyd ymateb da', english: 'there was a good response' },
            {
              welsh: 'Gellir gweld peiriannau rhydlyd yn hardd',
              english: 'Rusty machinery can be seen as beautiful',
            },
          ],
        },
        {
          type: 'tip',
          body: 'After efallai “perhaps”, a y “that” clause is the normal shape: Efallai y gellir disgrifio. A passive with cael looks like yn cael eu llyncu gan natur, a\'u trawsnewid. The second half simply carries that same cael over.',
        },
      ],
    },
    {
      id: 'links',
      kicker: 'Phrase',
      title: 'Concede, then go on',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'er hynny',
            english: 'despite this; nonetheless',
            note: 'Learn it as a set phrase. Before a noun, “despite” is er gwaetha.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "er gwaetha'r tywydd gwael",
            english: 'despite the bad weather',
            note: 'Also spelt er gwaethaf: er gwaethaf yr amgylchiadau “despite the circumstances”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ar ben hynny',
            english: 'furthermore',
            note: 'Ar softens pen.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yn ogystal â',
            english: 'as well as',
            note: 'Â causes an aspirate mutation. Before a vowel, use ag.',
          },
        },
      ],
    },
    {
      id: 'focus',
      kicker: 'Grammar',
      title: 'It was this place that deserved it',
      blocks: [
        {
          type: 'rule',
          title: 'Mai, such, and own',
          body: 'Mai introduces a focused clause, the “it was X that…” shape. The majority decided that Blaenau Ffestiniog was the place that deserved the title, so the name stands in front of oedd. Y fath “such” softens the noun after it, and hun (hunan for one, hunain for many) means “own” or “self”.',
          examples: [
            {
              welsh:
                'penderfynodd y mwyafrif mai Blaenau Ffestiniog oedd yn haeddu’r teitl',
              english:
                'the majority decided that it was Blaenau Ffestiniog that deserved the title',
            },
            { welsh: 'y fath leoedd', english: 'such places' },
            { welsh: 'harddwch eu hun', english: 'their own beauty' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'sef',
            english: 'namely',
            note: 'A small word for naming the thing you have just pointed at.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'medden nhw',
            english: 'they said',
            note: 'A quotative verb, used after the words being quoted. One person is meddai fe or meddai hi.',
          },
        },
        {
          type: 'tip',
          body: 'Formal style can leave the pronoun out: clywais is “I heard”, and speech puts it back as clywes i or clywais i. Literary ohonynt “of them” is spoken ohonyn nhw, as in un ohonynt “one of them”. Y chwareli eu hunain means “the quarries themselves”.',
        },
      ],
    },
    {
      id: 'slate',
      kicker: 'Culture',
      title: 'The heaps are the heritage',
      blocks: [
        {
          type: 'culture',
          title: 'A letter to Y Cymro',
          body: 'This is a reader’s letter to the weekly Y Cymro. People offered candidates for the ugliest place in Wales, and the majority chose Blaenau Ffestiniog. The reply treats the grey slate heaps, the quarries, and the rusty machinery as a chapter of industrial history: workers’ cottages, pride in the work, and the contribution of the ancestors.',
        },
        {
          type: 'say',
          line: {
            welsh: 'y tomenni llechi',
            english: 'the slate heaps',
            note: 'Tomen “heap”, plural tomenni. One slate is llechen; llechi is the slate itself. The waste can also be y mynyddoedd sbwriel o lechi.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'bythynnod gweithwyr',
            english: 'workers’ cottages',
            note: 'Bwthyn “cottage” has the irregular plural bythynnod.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'etifeddiaeth ddifesur',
            english: 'immeasurable heritage',
            note: 'Etifeddiaeth is feminine, so difesur softens. The same softening gives agwedd ddiystyriol “a deprecating attitude”.',
          },
        },
        {
          type: 'tip',
          body: 'Tystiolaethu i “bear witness to” softens the next word: tystiolaethu i bennod hanfodol. balchder yn y gwaith is “pride in the work”, and cyfraniad ein hynafiaid is “our ancestors’ contribution”. iselbrisio is “undervalue”.',
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
          prompt: 'The letter asks for the ugliest place in Wales. Which ending is right?',
          answer: 'yng Nghymru',
          options: ['yn Cymru', 'yng Nghymru', 'yn Nghymru'],
        },
        {
          type: 'check',
          prompt: 'You are going out in bad weather. Which phrase names that weather?',
          answer: "er gwaetha'r tywydd gwael",
          options: ['er hynny', "er gwaetha'r tywydd gwael", 'ar ben hynny'],
        },
      ],
    },
  ],
}
