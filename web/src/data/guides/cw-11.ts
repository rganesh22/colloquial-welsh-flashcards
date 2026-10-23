import type { ChapterGuide } from '../../lib/chapterGuide'

export const guide: ChapterGuide = {
  bookId: 'colloquial',
  lessonId: '11',
  intro:
    'How to ask what someone thinks, report it in a that-clause, and compare two things. The same chapter puts you on a narrow-gauge railway.',
  steps: [
    {
      id: 'opinions',
      kicker: 'Phrase',
      title: 'Ask what someone thinks',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "Beth wyt ti'n feddwl?",
            english: 'What do you think?',
            note: 'meddwl softens after yn: yn feddwl. In many southern areas the verb is credu.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Beth yw/ydy'ch barn am…?",
            english: 'What is your opinion of…?',
            note: 'am softens the next word. barn is “opinion”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Efallai bod chi'n iawn, ond…",
            english: "Perhaps you're right, but…",
            note: 'General efallai. South: falle. North: ella or hwyrach.',
          },
        },
        {
          type: 'tip',
          body: "Answer with Dw i'n meddwl bod…, Dw i ddim yn meddwl fod…, or Dw i'n eitha siwr fod…. siwr is often spelled sicr. You can also ask Dych chi o blaid…? “in favour” or Dych chi yn erbyn…? “against”.",
        },
      ],
    },
    {
      id: 'that-clauses',
      kicker: 'Grammar',
      title: '“That” is fod, y, or mai',
      blocks: [
        {
          type: 'rule',
          title: 'Match the clause to the original verb',
          body: 'If the clause you are reporting starts with present bod, swap that verb for mod i, fod ti, fod e, bod hi, bod ni, bod chi, or bod nhw. “That” and “is” both sit in that first word; a noun can take either bod or fod, and the bo-set (bo fi, bo ti, bo fe) means the same thing. If the original is not present bod, put y in front of the verb; if it is an identification, with the named thing first and then yw or ydy, use mai and leave the rest unchanged.',
          examples: [
            {
              welsh: "Dw i'n meddwl bod hi'n siarad Cymraeg yn rhugl",
              english: 'I think that she speaks Welsh fluently',
            },
            {
              welsh: '(y) dylen nhw fod yn ofalus',
              english: 'that they ought to be careful',
            },
            {
              welsh: "Dw i'n meddwl mai'r Wyddfa yw'r mynydd ucha yng Nghymru",
              english: 'I think that Snowdon is the highest mountain in Wales',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: "O't ti'n gwybod fod e'n siarad Cymraeg?",
            english: 'Did you know that he spoke Welsh?',
            note: "The original is Mae'n siarad Cymraeg, so the clause is fod, not y. O'n i'n meddwl… works the same way.",
          },
        },
        {
          type: 'tip',
          body: "y is often left out in speech, and future bod still takes y, as in (y) bydda i yn ôl erbyn saith. A negative replaces y with na and a soft mutation, while a fod-clause keeps ddim: fod Siôn ddim yn hoffi gweithio. In the south mai is taw (Wi'n credu taw'r Wyddfa yw'r mynydd ucha yng Nghymru); some northern areas use na.",
        },
      ],
    },
    {
      id: 'reasons',
      kicker: 'Phrase',
      title: 'Hang a reason on achos',
      blocks: [
        {
          type: 'say',
          line: {
            welsh: "achos bod hi'n rhy hwyr i ymgeisio am y swydd 'ma",
            english: "because it's too late to apply for this job",
            note: 'achos is the usual “because”, and it takes a that-clause. Literally “because that…”.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: "Er fod y sefyllfa'n un anodd, fe nawn ni 'n gorau",
            english: "Although the situation is a difficult one, we'll do our best",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Yn anffodus, alla i ddim…',
            english: "Unfortunately I can't…",
            note: "Add achos and the reason. A stronger frame is Gwaetha'r modd, 'sdim modd i mi….",
          },
        },
        {
          type: 'tip',
          body: "oherwydd is a more formal because, and am fod or gan fod means because or since: Mae'n amhosib ar hyn o bryd am fod hanner y dosbarth yn absennol. Unless, in case, while, and so that — onibai, rhag ofn, tra, and fel — take a that-clause too. Until is (hyd) nes, often with a future: Arhoswch fan hyn nes (y) bydd rhywun yn dod.",
        },
      ],
    },
    {
      id: 'compare',
      kicker: 'Pattern',
      title: 'Short adjectives take -ach and -a',
      blocks: [
        {
          type: 'rule',
          title: 'More, most, and than',
          body: 'Short adjectives add -ach to mean “more” and -a to mean “most”. Formal writing spells that superlative -af, as in agosaf, uchaf, and mwyaf, and a final b, d, or g hardens to p, t, or c, so gwlyb becomes gwlypach and teg becomes tecach. Longer adjectives use mwy and mwya, and “than” is na, with an aspirate mutation, or nag before a vowel.',
          examples: [
            {
              welsh: 'Mae Ioan yn dalach na Rhys',
              english: 'Ioan is taller than Rhys',
              note: 'tal softens after yn: dalach.',
            },
            {
              welsh: "Mae'r crys coch yn ddrutach na'r crys gwyn",
              english: 'The red shirt is dearer than the white shirt',
              note: 'drud hardens to drutach, then yn softens it to ddrutach.',
            },
            {
              welsh: "Yr Wyddfa ydy'r mynydd ucha yng Nghymru",
              english: 'Snowdon is the highest mountain in Wales',
            },
          ],
        },
        {
          type: 'say',
          line: {
            welsh: 'Mor gyflym â cheffyl',
            english: 'As fast as a horse',
            note: 'mor softens, except ll- and rh-. â can aspirate ceffyl to cheffyl. Before a vowel, use ag: Mor werthfawr ag arian.',
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Alli di siarad yn arafach?',
            english: 'Can you speak more slowly?',
            note: "arafach is the comparative of araf. Na i drio arafu, 'te — I'll try to slow down, then.",
          },
        },
        {
          type: 'tip',
          body: "A comparative stays in an ordinary mae sentence. A superlative names the winner first, then ydy or yw, not mae: Y crys glas yw'r druta ohonyn nhw i gyd. Irregular sets: da gwell gorau, drwg gwaeth gwaetha, mawr mwy mwya, bach llai lleia, uchel uwch ucha, isel is isa; some areas use iau “younger” and hŷn, hyna “older, oldest”.",
        },
      ],
    },
    {
      id: 'railways',
      kicker: 'Culture',
      title: 'Little lines out of the quarries',
      blocks: [
        {
          type: 'culture',
          title: 'Narrow-gauge railways',
          body: 'A lein fach, literally a “little line”, is a narrow-gauge railway built to cludo slate from the chwareli and mwyngloddau. The engine is an injan ager, also called an injan stêm. Today the lines are atyniadau twrist: a ffordd fendigedig o edmygu the scenery, and a cipolwg into the industrial past.',
        },
        {
          type: 'say',
          line: {
            welsh: 'Croeso i Reilffordd Ffestiniog',
            english: 'Welcome to the Ffestiniog Railway',
            note: "i softens Rheilffordd to Reilffordd. Chi ydy cwsmer cynta'r dydd means you are the first customer of the day.",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Ga i tocyn unffordd i Borthmadog os gwelwch yn dda?',
            english: 'Can I have a one-way ticket to Porthmadog please?',
            note: "Ga i softens tocyn to docyn, and i softens Porthmadog to Borthmadog. The clerk asks Tocyn unffordd neu tocyn dychwelyd? You can also ask Faint ydy hwnna? and Ga i dalu â cherdyn?",
          },
        },
        {
          type: 'say',
          line: {
            welsh: 'Rheilffordd yr Wyddfa',
            english: 'Snowdon Mountain Railway',
            note: "It runs o Lanberis i gopa'r mynydd. rhy flinedig is too tired. rhy ddiogel i gerdded uses diogel, usually “safe”, as a joke for “lazy”.",
          },
        },
      ],
    },
    {
      id: 'check',
      kicker: 'Check',
      title: 'Which pattern fits?',
      blocks: [
        {
          type: 'check',
          prompt: 'Which line means “I think that she speaks Welsh fluently”?',
          answer: "Dw i'n meddwl bod hi'n siarad Cymraeg yn rhugl",
          options: [
            "Dw i'n meddwl y mae hi'n siarad Cymraeg yn rhugl",
            "Dw i'n meddwl bod hi'n siarad Cymraeg yn rhugl",
            "Dw i'n meddwl mai hi'n siarad Cymraeg yn rhugl",
          ],
        },
        {
          type: 'check',
          prompt: 'Which line says Ioan is taller than Rhys?',
          answer: 'Mae Ioan yn dalach na Rhys',
          options: [
            'Mae Ioan yn dalach nag Rhys',
            'Mae Ioan yn dalach na Rhys',
            'Ioan ydy dalach na Rhys',
          ],
        },
      ],
    },
  ],
}
