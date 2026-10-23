import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'reader',
  lessonId: '15',
  intro:
    'A singer from Anglesey: where she was born, what her records did, and the written verbs you meet in a short biography.',
  steps: [
    {
      id: 'from-anglesey',
      kicker: 'Phrase',
      title: 'Born in the parish',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: 'Yn enedigol o blwyf Llangristiolus',
            english: 'born in the parish of Llangristiolus',
            note: 'Yn softens genedigol. O softens plwyf to blwyf.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yng nghalon Ynys Môn',
            english: 'in the heart of Anglesey',
            note: 'Before c, yn becomes yng and calon becomes nghalon.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'y gantores',
            english: 'the (female) singer',
            note: 'Cantores is feminine, so it softens after y. A female composer is cyfansoddwraig.',
          },
        },
        {
          type: 'tip',
          body: 'A feminine noun softens the next adjective. Llenyddiaeth Gymraeg is “Welsh literature”.',
        },
      ],
    },
    {
      id: 'impersonal',
      kicker: 'Grammar',
      title: 'Sold, with nobody named',
      blocks: [
        {
          type: 'rule',
          title: 'Stem plus -wyd',
          body: 'Written Welsh can say what happened and leave the doer out. Add -wyd to the stem: gwerthu becomes gwerthwyd, darlledu becomes darlledwyd, and rhyddhau becomes rhyddhawyd. A few common verbs keep an older shape: gwnaed or gwnaethpwyd “was made”, aed or aethpwyd “one went”, daethpwyd “one came”, and cafwyd “was had”.',
          examples: [
            {
              welsh: 'Gwerthwyd miloedd o gopïau',
              english: 'Thousands of copies were sold',
            },
            { welsh: 'darlledwyd', english: 'was broadcast' },
            { welsh: 'rhyddhawyd', english: 'was released' },
          ],
        },
        {
          type: 'tip',
          body: 'Speech often uses cael instead: cafodd ei chofleidio is “it was embraced”, with c turned to ch after ei “her”. Mae\'n cael ei hysbrydoli gan is “she is inspired by”. Literary style can park the pronoun on fe: fe\'i gwnaed “it was made”, fe\'u collwyd “they were lost”.',
        },
      ],
    },
    {
      id: 'years',
      kicker: 'Pattern',
      title: 'For years, back or ahead',
      blocks: [
        {
          type: 'rule',
          title: 'Ers looks back, am looks forward',
          body: 'Both lines mean “for years”, and the direction is the difference. Ers blynyddoedd looks back over time already gone. Am flynyddoedd looks ahead, and am softens the next word, so blynyddoedd becomes flynyddoedd.',
          examples: [
            { welsh: 'ers blynyddoedd', english: 'for years (looking back)' },
            { welsh: 'am flynyddoedd', english: 'for years (looking ahead)' },
            {
              welsh: 'Byddan nhw fan hyn am flynyddoedd',
              english: "They'll be here for years",
            },
          ],
        },
      ],
    },
    {
      id: 'action-first',
      kicker: 'Grammar',
      title: 'The doing is the subject',
      blocks: [
        {
          type: 'rule',
          title: 'A verb-noun can do the verb’s job',
          body: 'The verb still comes first, as usual. What changes is the subject: it can be a whole action, not a person. English turns that around and starts with the action, “the release provoked” or “finishing her degree meant”.',
          examples: [
            {
              welsh: 'Ysgogodd rhyddhau ei CD gyntaf ymateb ysgubol',
              english: 'The release of her first CD provoked a massive response',
            },
            {
              welsh: 'Golygodd cwblhau ei gradd y gallai Meinir ganolbwyntio',
              english: 'Finishing her degree meant that Meinir could concentrate',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "Mae cael crwydro'r wlad yn bleser",
            english: 'Getting to roam the country is a pleasure',
            note: 'Cael plus a verb-noun means “get to” or “be allowed to”. Ga i fynd? is “May I go?” Yn softens pleser to bleser.',
          },
        },
        {
          type: 'tip',
          body: 'Gallai is “could”, either “was able” or “would be able”. Canolbwyntio ar “concentrate on” softens what follows. To stress the verb, front it: parhau mae\'r canu is “the singing continues”, beside neutral mae\'r canu\'n parhau.',
        },
      ],
    },
    {
      id: 'prif',
      kicker: 'Pattern',
      title: 'Prif cannot stand alone',
      blocks: [
        {
          type: 'rule',
          title: 'Main sits in front and softens',
          body: 'Prif means “main” or “chief”, and it cannot stand by itself. It comes before the noun and softens it, so gwyliau becomes wyliau, and prif plus dinas makes prifddinas “capital”. O softens as well, which is why you see brif in pob un o brif wyliau Cymru.',
          examples: [
            { welsh: 'prif wyliau', english: 'main festivals' },
            {
              welsh: 'pob un o brif wyliau Cymru',
              english: 'every one of the main festivals in Wales',
            },
            { welsh: 'prifddinas', english: 'capital city' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'aml-ddiwylliannol',
            english: 'multicultural',
            note: 'Aml softens the next part. Di-lol “no-nonsense” softens lol the same way.',
          },
        },
        {
          type: 'tip',
          body: 'Few adjectives change for a plural noun. Speech says lleoliadau mawr; mawrion is an old plural kept in set phrases. Eraill is the form you must use, as in pobol eraill. Llai is “smaller”, in digwyddiadau llai, and a feminine noun softens mwy: stafell fwy “a bigger room”.',
        },
      ],
    },
    {
      id: 'northern-lies',
      kicker: 'Culture',
      title: 'Lies, the northern way',
      blocks: [
        {
          type: 'culture',
          title: 'Clwydda is celwyddau',
          body: 'The album Dim ond Clwydda means “Nothing but Lies”. Clwydda is the northern word for celwyddau, the plural of celwydd “a lie”. The same pages use a literary register: perfformia for “she performs”, where speech says Mae hi\'n perfformio, and rhyngddynt for “between them”, where speech says rhyngddyn nhw. In a\'r cydweithio agos fu rhyngddynt, fu is bu softened by a hidden “which”.',
        },
        {
          type: 'say',
          line: {
            welsh: 'torri cwys',
            english: 'make one’s mark',
            note: 'Literally “cut a furrow”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ar y gweill',
            english: 'in the pipeline; planned',
            note: 'Literally “on the knitting needles”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "y llon a'r lleddf",
            english: 'the happy and the sad',
          },
        },
        {
          type: 'tip',
          body: 'Ar ei phen ei hun is “on her own”: ei “her” turns pen into phen. Iddi ei hun is “for herself”. Ar hyn o bryd is “at the moment”, and hyd yn hyn is “so far”. Bara menyn blasus, “tasty bread and butter”, means a decent living.',
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which shape fits?',
      blocks: [
        {
          type: 'check',
          prompt: 'You mean years still to come. Which phrase fits?',
          answer: 'am flynyddoedd',
          options: ['ers blynyddoedd', 'am flynyddoedd', 'ers flynyddoedd'],
        },
        {
          type: 'check',
          prompt: 'How does this chapter say “thousands of copies were sold”?',
          answer: 'Gwerthwyd miloedd o gopïau',
          options: [
            'Gwerthwyd miloedd o gopïau',
            'Gwerthu miloedd o copïau',
            'Mae miloedd yn gwerthu',
          ],
        },
      ],
    },
  ],
}
