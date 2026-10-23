import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '18',
  intro:
    'A formal rugby report: literary endings, the pattern for “after they beat”, and the south Wales towns on the fixture list.',
  steps: [
    {
      id: 'headline',
      kicker: 'Phrase',
      title: 'A memorable win is built from small words',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Bygwth buddugoliaeth gofiadwy',
            english: 'Threatening a memorable win',
            note: 'buddugoliaeth is feminine, so the adjective after it softens to gofiadwy.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'cofiadwy',
            english: 'memorable',
            note: 'From cofio, remember. -adwy works like English -able. haeddu, deserve, gives haeddiannol, deserved.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'anlwcus',
            english: 'unlucky',
            note: 'an- plus lwcus, lucky. Mae’r Crusaders wedi bod yn anlwcus.',
          },
        },
        {
          type: 'tip',
          body: 'The person takes -wr: dyfarnwr from dyfarnu, referee, and llumanwr from lluman, flag, the linesman. uchaf and pwynt join as uchafbwynt, a highlight, and uchel and man join as uchelfannau, the heights.',
        },
      ],
    },
    {
      id: 'literary',
      kicker: 'Grammar',
      title: 'Formal writing keeps the old endings',
      blocks: [
        {
          type: 'rule',
          title: 'Literary endings, and y before bod',
          body: 'Formal writing keeps diwethaf for last, as in ddydd Gwener diwethaf, where speech has diwetha, and iddynt for to them, where speech has iddyn nhw. The same style puts y or yr in front of the present and imperfect of bod. Living Welsh says Mae; the literary line says Y mae.',
          examples: [
            { welsh: 'diwethaf', english: 'last (formal spelling)' },
            { welsh: 'iddynt', english: 'to them; for them (literary)' },
            { welsh: 'Y mae', english: 'is; there is (literary)' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'yr ydych',
            english: 'you are (literary)',
            note: 'Spoken dych chi.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yr oeddem',
            english: 'we were (literary)',
            note: 'Spoken (r)oedden ni.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'megis',
            english: 'like; such as',
            note: 'Formal. Everyday Welsh uses fel.',
          },
        },
      ],
    },
    {
      id: 'after',
      kicker: 'Pattern',
      title: 'After they beat',
      blocks: [
        {
          type: 'rule',
          title: 'ar ôl i, then who, then a softened verb-noun',
          body: 'ar ôl i, then the subject, then a soft-mutated verb-noun, means after someone did something. The literary subject is iddynt, and the spoken subject is iddyn nhw. trechu softens to drechu in both.',
          examples: [
            { welsh: 'ar ôl iddynt drechu', english: 'after they beat (literary)' },
            { welsh: 'ar ôl iddyn nhw drechu', english: 'after they beat' },
          ],
        },
        {
          type: 'tip',
          body: 'hynod o means extremely and softens the next word, so hynod o agos is awfully close (and hynod o dda, remarkably good), as in yn hynod o agos i drechu Leeds Rhinos.',
        },
      ],
    },
    {
      id: 'negatives',
      kicker: 'Grammar',
      title: 'nid on the page, dim in speech',
      blocks: [
        {
          type: 'rule',
          title: 'The same “have not”, two shapes',
          body: 'Written Welsh builds these negatives with nid: nid oedd beside spoken doedd dim, and nid oes gennyf beside does gen i ddim. Ordinary conversation stays with the dim patterns. When the subject is a noun, dim itself softens to ddim.',
          examples: [
            {
              welsh: 'nid oedd gan y South Wales Scorpions gêm',
              english: "the South Wales Scorpions didn't have a game (literary)",
            },
            {
              welsh: 'doedd gan y South Wales Scorpions ddim gêm',
              english: "the South Wales Scorpions didn't have a game",
            },
            {
              welsh: 'nid oes gennyf gar',
              english: "I haven't got a car (literary)",
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'does gen i ddim car',
            english: "I haven't got a car",
            note: 'This is the spoken shape of nid oes gennyf gar.',
          },
        },
        {
          type: 'tip',
          body: 'gêm keeps its g after dwy and ail, so you say dwy gêm and yr ail gêm.',
        },
      ],
    },
    {
      id: 'impersonal',
      kicker: 'Pattern',
      title: 'The impersonal leaves the doer out',
      blocks: [
        {
          type: 'rule',
          title: 'cynnal with no one named',
          body: 'An impersonal says that something is done and leaves the doer unnamed. cynhelir covers “is held” and “will be held”; the past of that verb is cynhaliwyd, and sefydlwyd means “was founded”. The marker fe is optional, and the verb after it takes soft mutation, as in fe gynhaliwyd.',
          examples: [
            { welsh: 'cynhelir', english: 'is held; will be held' },
            { welsh: 'fe gynhaliwyd', english: 'was held' },
            { welsh: 'sefydlwyd', english: 'was established; was founded' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh:
              "Mae hyfforddi dyfarnwyr a swyddogion eraill yng Nghymru yn datblygu'n gyflym",
            english:
              'Training referees and other officials in Wales is developing quickly',
            note: 'Everything from hyfforddi through yng Nghymru is the subject; yn datblygu comes after.',
          },
        },
      ],
    },
    {
      id: 'places',
      kicker: 'Culture',
      title: 'South Wales on the fixture list',
      blocks: [
        {
          type: 'culture',
          title: 'League towns, written formally',
          body: 'This formal report follows the Crusaders, unlucky and extremely close to beating Leeds Rhinos; trechu’r Cewri means beating the Huddersfield Giants. Sir Fynwy softens Mynwy after sir, a Chaerffili aspirates Caerffili after and, yng Nghaerffili nasals it after yn, and Castell Nedd is Neath. Cymdeithas y Dyfarnwyr was founded about six years before the piece, and mynd â rygbi xiii o gwmpas y wlad takes the game around the country, with aspirate mutation after â, as in ymweld â.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Sir Fynwy',
            english: 'Monmouthshire',
            note: 'Mynwy softens after sir.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Castell Nedd',
            english: 'Neath',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Caerffili',
            english: 'Caerphilly',
            note: 'a Chaerffili after and; yng Nghaerffili after yn.',
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
          prompt: 'In ordinary speech, how do you say “I haven’t got a car”?',
          answer: 'does gen i ddim car',
          options: ['nid oes gennyf gar', 'does gen i ddim car', 'nid oes gen i gar'],
        },
        {
          type: 'check',
          prompt: 'Which phrase means “two games”?',
          answer: 'dwy gêm',
          options: ['dwy gem', 'dwy gêm', 'yr ail gêm'],
        },
      ],
    },
  ],
}
