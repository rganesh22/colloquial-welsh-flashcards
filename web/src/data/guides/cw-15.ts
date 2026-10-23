import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '15',
  intro:
    'How formal Welsh reports the countryside, and how speech stresses a person, admits it does not know, and guesses. Notices and a lost-keys argument sit in the same chapter.',
  steps: [
    {
      id: 'argument',
      kicker: 'Phrase',
      title: 'The keys are lost again',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Beth sy'n bod?",
            english: "What's the matter?",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Wi'n ffili ffeindio'r allweddi",
            english: "I can't find the keys",
            note: "Southern ffili is methu. General: Dw i'n methu ffeindio'r allweddi. Maen nhw ar goll fel arfer — they're lost as usual.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Gad lonydd i fi, nei di?',
            english: 'Leave me alone, will you?',
            note: 'gad is the imperative of gadael, and llonydd is peace. Gad i mi feddwl is “let me think”; Aros eiliad is “wait a moment”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Mae'n ddrwg 'da fi",
            english: "I'm sorry",
            note: "Popeth yn iawn means everything is fine. 'sdim eisiau bod yn bigog — there's no need to be touchy.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "yn 'y mhoced",
            english: 'in my pocket',
            note: "'y is fy, so poced takes nasal mutation: mhoced.",
          },
        },
        {
          type: 'tip',
          body: "Paid gorwneud pethau means don't overdo things. Os dewch chi ar draws… is the reading phrase for “if you come across…”. yn awyddus i glywed is “keen to hear”: awyddus i softens the verb-noun.",
        },
      ],
    },
    {
      id: 'passive',
      kicker: 'Grammar',
      title: 'The news hides who did it',
      blocks: [
        {
          type: 'rule',
          title: '-wyd and -ir',
          body: 'Formal news Welsh uses one ending and does not name the doer. -wyd is the past, and -ir covers the present or the future. Everyday speech uses cael instead: cafodd dyn ei anafu, and mae (or bydd) cyfarfodydd yn cael eu trefnu\'n gyson.',
          examples: [
            { welsh: 'anafwyd dyn', english: 'a man was injured' },
            { welsh: 'gwerthwyd y tŷ', english: 'the house was sold' },
            {
              welsh: 'trefnir cyfarfodydd yn gyson',
              english: 'meetings are (or will be) regularly organised',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Dywedir fod…',
            english: 'It is said that…',
            note: 'The same impersonal shape, with no subject: Honnir fod…, Drwgdybir fod…, Disgwylir fod…',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Cafwyd ymateb da',
            english: 'There has been a good response',
            note: 'Cafwyd is the -wyd of cael. Media Welsh uses it for “there has been” or “there has happened”, as in Cafwyd dirywiad mawr.',
          },
        },
        {
          type: 'tip',
          body: 'gellir, gellid, and dylid are formal for “one can”, “one could”, and “one ought to”. Keep them out of everyday talk. A written relative can wear the same passive: a gomisiynwyd, “which was commissioned”, beside spoken ardaloedd a gafodd eu dynodi.',
        },
      ],
    },
    {
      id: 'stem-e',
      kicker: 'Pattern',
      title: 'The last a becomes e',
      blocks: [
        {
          type: 'rule',
          title: 'Stem a before -ir',
          body: 'Before the formal ending -ir, the last a in the stem changes to e. darparu becomes darperir, siarad becomes siaredir, and talu becomes telir. Speech still uses cael, as in mae or bydd … yn cael ei ddarparu.',
          examples: [
            { welsh: 'Siaredir Cymraeg yma', english: 'Welsh (is) spoken here' },
            {
              welsh: 'Darperir lluniaeth ysgafn',
              english: 'Light refreshments will be provided',
            },
            {
              welsh: 'Fe gynhelir y cyfarfod nesaf wythnos i heddiw',
              english: 'The next meeting will be held a week today',
            },
          ],
        },
        {
          type: 'tip',
          body: 'The w in cadw is a consonant, so the a still becomes e: cedwir. cynnal becomes cynhelir the same way. Fe is an affirmative particle and softens the verb, as in Fe delir eich cyflog yn uniongyrchol i\'ch banc. Spoken, Fe gynhelir y gystadleuaeth bob blwyddyn is Mae\'r gystadleuaeth yn cael ei chynnal bob blwyddyn.',
        },
      ],
    },
    {
      id: 'focus',
      kicker: 'Grammar',
      title: 'Put the point in front',
      blocks: [
        {
          type: 'rule',
          title: 'Front the word you mean',
          body: 'Neutral Welsh starts with the verb, as in Mae Dylan gartre heno or Agores i\'r drws. Move the person, place, or time to the front when that is the point. A fronted subject of mae takes sy(dd); with any other tense the verb stays third-person singular and softens, which is why the focused line is Fi agorodd y drws.',
          examples: [
            {
              welsh: 'Dylan sy gartre heno',
              english: "It's Dylan who is home tonight (not someone else)",
            },
            {
              welsh: 'Gartre mae Dylan heno',
              english: 'Dylan is at home tonight (not out)',
            },
            {
              welsh: 'Fi agorodd y drws',
              english: 'I (and not you) opened the door',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "ti sy'n coginio heno",
            english: "it's you who's cooking tonight",
            note: 'The same sy marks the blame: ti sy ar fai. Heno mae Dylan gartre stresses tonight. You may put y before a focused pronoun: Y fi…, Y nhw…',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'efallai taw yn y gegin maen nhw',
            english: "perhaps they're in the kitchen (not somewhere else)",
            note: 'taw introduces the focused that-clause. With oedd, the person stays in front: ti oedd yn gofalu am yr allweddi.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Dyna'r dyn sy'n dysgu Cymraeg",
            english: "That's the man who's learning Welsh",
            note: 'sy(dd) is the present or perfect relative: Dyna\'r dyn sy wedi dysgu Cymraeg. Other tenses use a, often silent, with soft mutation: Dyna\'r dyn (a) oedd yn dysgu Cymraeg, Dyna\'r dyn (a) fydd yn dysgu Cymraeg, Dyna\'r dyn (a) ddysgith Gymraeg, Dyna\'r dyn (a) ddysgodd Gymraeg. Negative na: Dyna\'r dyn na ddysgodd Gymraeg. Formal passives use the same a: Mewn cyfarfod a gynhelir yfory, Ffigurau a gyhoeddwyd gan y llywodraeth.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Des sy biau fe',
            english: 'Des owns it',
            note: "No yn before biau. Northern pronunciation bia, southern bie. sy can drop: Pwy biau'r rhain? — Nhw biau nhw. “Whose is this?” is … pwy yw/ydy hwn?, answered Des yw/ydy e.",
          },
        },
        {
          type: 'tip',
          body: "Be' ddigwyddodd? wants a neutral verb-first answer, Agores i'r drws. Pwy agorodd y drws? wants the focused Fi agorodd y drws. A focused line need not start with a verb at all: Y pencampwyr Llanelli yn erbyn Pontypwl fydd yn dechrau'r tymor.",
        },
      ],
    },
    {
      id: 'know',
      kicker: 'Pattern',
      title: 'Know a fact, or admit you cannot',
      blocks: [
        {
          type: 'rule',
          title: 'gwybod has no finished past',
          body: 'gwybod means you know a fact (nabod is for a person), and Welsh treats it as a state, so it has no preterite. The past is the imperfect: O\'n i\'n gwybod hynny. Northern speech also keeps short forms such as gwn i and gwyddwn i, and the verb-noun is often pronounced gwbod.',
          examples: [
            { welsh: "O'n i'n gwybod hynny", english: 'I knew that' },
            { welsh: 'Dw i ddim yn gwybod', english: "I don't know" },
            { welsh: 'Hyd y gwn i', english: 'As far as I know' },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Dwn i ddim',
            english: "I don't know",
            note: "Northern, also Dwn 'im. South: Sa i'n gwybod or So fi'n gwybod. A northern question softens: Wyddech chi fod Alun yn sâl? Spoken everywhere: O'ch chi'n gwybod…?",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Pwy a ŵyr?',
            english: 'Who knows?',
            note: 'Am wn i means “for all I know”. Familiar “y\'know” is wyddost ti, often \'sti, in the north and timod in the south. Polite north is wyddoch chi (\'ddchi); polite south is chimod.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "'Sdim isio gweiddi, 'sti",
            english: "There's no need to shout, y'know",
            note: "'sti stands for wyddost ti. A southern line would use timod.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Dw i'n methu gweld y sgrin o fan hyn",
            english: "I can't see the screen from here",
            note: 'methu plus a verb-noun is physical inability, so the sentence stays affirmative. You can also negate gallu: Alla i ddim gweld y sgrin o fan hyn. South: Wi\'n ffili gweld y sgrin o fan hyn.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Rhaid fod e gartre erbyn hyn',
            english: 'He must be home by now',
            note: "rhaid plus a bod-clause is a guess, including rhaid bod nhw'n rhywle and Rhaid bod nhw wedi mynd allan yn barod. Obligation is rhaid i plus a verb-noun. Rhaid bod chi o'ch co' means you must be out of your mind.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Dw i ddim yn siwr (a) fyddan nhw'n barod mewn pryd",
            english: "I'm not sure if they'll be ready in time",
            note: 'An indirect question puts a in front of the direct question. a is often silent; the soft mutation stays, so byddan becomes fyddan. os with no mutation is common in speech. Purists keep os for open conditions.',
          },
        },
      ],
    },
    {
      id: 'places',
      kicker: 'Culture',
      title: 'Signs, forests, and the season',
      blocks: [
        {
          type: 'culture',
          title: 'Names off a notice or a broadcast',
          body: 'Cyngor Cefn Gwlad Cymru is the Countryside Council for Wales, and Adain y Ddraig, “Dragonwing”, is its newspaper: adain is a wing and draig is a dragon. Comisiwn Coedwigaeth is the Forestry Commission; the leaflet ychydig o lonydd asks for a little peace, and llonydd softens after o. Tocyn Tymor is the S4C sports programme, and the grounds in that world include Parc yr Arfau, the Arms Park, and y Maes Cenedlaethol.',
        },
        {
          type: 'say',
          line: {
            welsh: 'lle llonydd a thawel',
            english: 'a place of peace and quiet',
            note: 'a causes aspirate mutation, so tawel becomes thawel. Menter Goedwig is Forest Enterprise: feminine menter softens coedwig. Gwarchodfeydd Natur Cenedlaethol are National Nature Reserves.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'yr holl bysgod',
            english: 'all the fish',
            note: 'holl stands before the noun and softens it, so pysgod becomes bysgod and Gwarchodfeydd becomes Warchodfeydd in yr holl Warchodfeydd. hysbysrwydd is information on notices; gwybodaeth is information in general.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'ar garreg ein drws',
            english: 'on our doorstep',
            note: "Literally “on the stone of our door”. mae'r dyddiau'n byrhau — the days are getting shorter; mae 'na oerni yn yr awyr — there's a chill in the air.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Llongyfarchiadau ar eich dyrchafiad',
            english: 'Congratulations on your promotion',
            note: 'ar softens the next word. Penblwydd Hapus! is Happy Birthday. Familiar “remember me to…” is Cofia fi at…; polite is Cofiwch fi at…',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Yr eiddoch yn gywir',
            english: 'Yours truly',
            note: 'Other sign-offs are Yn gywir, Yn gywir iawn, Yn ddiffuant, and Cofion cynnes. Annwyl opens a letter and mutates an ordinary noun, not a personal name.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Edrychaf ymlaen at glywed gennych (cyn bo hir)',
            english: 'I look forward to hearing from you (in due course)',
            note: 'Literary 1sg. at softens clywed to glywed, and cyn bo hir means before long. Openers in the same style: Cyfeiriaf at eich llythyr…, Ymhellach i\'n sgwrs…, Diolch am eich llythyr dyddiedig y…',
          },
        },
        {
          type: 'tip',
          body: 'megis is formal “such as”; speech says fel. gennym is formal “we have”; speech says gynnon ni. After a, formal Welsh aspirates pêl-droed to a phêl-droed, and plenty of speakers still say a pêl-droed. Reading links you will meet: o ganlyniad i “as a result of”, ar y cyd “jointly”, and ar y gweill “in the pipeline”.',
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
          prompt: 'You are speaking, not writing a news line. How do you say “a man was injured”?',
          answer: 'cafodd dyn ei anafu',
          options: ['anafwyd dyn', 'cafodd dyn ei anafu', 'cafodd y tŷ ei werthu'],
        },
        {
          type: 'check',
          prompt: 'You mean Dylan, and not someone else, is home tonight. Which line focuses him?',
          answer: 'Dylan sy gartre heno',
          options: [
            'Mae Dylan gartre heno',
            'Gartre mae Dylan heno',
            'Dylan sy gartre heno',
          ],
        },
      ],
    },
  ],
}
