/**
 * Short model conversations for the listen and shadow blocks. “you” lines
 * are the learner’s; everyone else is a fictional local. Each dialogue
 * recycles the phrase book lessons of its week.
 */
export interface DialogueLine {
  who: string
  welsh: string
  english: string
  note?: string
}

export interface Dialogue {
  id: string
  titleCy: string
  title: string
  setting: string
  lines: DialogueLine[]
}

const you = 'you'

export const DIALOGUES: Dialogue[] = [
  {
    id: 'd1',
    titleCy: 'Prynhawn da!',
    title: 'Arriving at the tea house',
    setting: 'A tea house in Gaiman, mid-afternoon.',
    lines: [
      { who: 'Elena', welsh: 'Prynhawn da! Pasiwch i mewn!', english: 'Good afternoon! Come in!' },
      { who: you, welsh: 'Prynhawn da! Diolch yn fawr.', english: 'Good afternoon! Thanks very much.' },
      { who: 'Elena', welsh: 'Sut dych chi?', english: 'How are you?' },
      { who: you, welsh: 'Da iawn, diolch. A chi?', english: 'Very well, thanks. And you?' },
      { who: 'Elena', welsh: 'Iawn, diolch. Beth ydy’ch enw chi?', english: 'Fine, thanks. What’s your name?' },
      { who: you, welsh: 'Raj dw i. Dw i’n dod o India.', english: 'I’m Raj. I come from India.' },
      { who: 'Elena', welsh: 'O India! Croeso i’r Gaiman! Elena dw i.', english: 'From India! Welcome to Gaiman! I’m Elena.' },
      { who: you, welsh: 'Braf cwrdd â chi, Elena.', english: 'Lovely to meet you, Elena.' },
      { who: 'Elena', welsh: 'Eisteddwch, eisteddwch!', english: 'Sit down, sit down!' },
    ],
  },
  {
    id: 'd2',
    titleCy: 'Ar y bws',
    title: 'Who are you, then?',
    setting: 'On the bus from Gaiman to Trelew.',
    lines: [
      { who: 'Gwilym', welsh: 'Esgusodwch fi — dych chi’n siarad Cymraeg?', english: 'Excuse me — do you speak Welsh?' },
      { who: you, welsh: 'Ydw! Tipyn bach. Dw i’n dysgu.', english: 'Yes! A little. I’m learning.' },
      { who: 'Gwilym', welsh: 'Bendigedig! O ble dych chi’n dod?', english: 'Wonderful! Where are you from?' },
      { who: you, welsh: 'Dw i’n dod o India. Dw i’n byw yn Bangalore.', english: 'I come from India. I live in Bangalore.' },
      { who: 'Gwilym', welsh: 'A beth dych chi’n wneud?', english: 'And what do you do?' },
      { who: you, welsh: 'Dw i’n gweithio fel peiriannydd meddalwedd.', english: 'I work as a software engineer.' },
      { who: 'Gwilym', welsh: 'Ers pryd dych chi’n dysgu Cymraeg?', english: 'How long have you been learning Welsh?' },
      { who: you, welsh: 'Ers deufis. Dw i yma i wneud fideo am y Gymraeg.', english: 'For two months. I’m here to make a video about Welsh.' },
      { who: 'Gwilym', welsh: 'Deufis? Chwarae teg i chi!', english: 'Two months? Fair play to you!' },
    ],
  },
  {
    id: 'd3',
    titleCy: 'Sori, eto?',
    title: 'When you don’t understand',
    setting: 'At the guesthouse reception, first evening.',
    lines: [
      { who: 'Dafydd', welsh: 'Mae brecwast rhwng saith a hanner awr wedi naw.', english: 'Breakfast is between seven and half past nine.' },
      { who: you, welsh: 'Sori, dw i ddim yn deall. Allwch chi siarad yn arafach?', english: 'Sorry, I don’t understand. Could you speak more slowly?' },
      { who: 'Dafydd', welsh: 'Wrth gwrs. Brecwast… am saith o’r gloch.', english: 'Of course. Breakfast… at seven o’clock.' },
      { who: you, welsh: 'O, reit! Diolch. Beth ydy ystyr “rhwng”?', english: 'Oh, right! Thanks. What does “rhwng” mean?' },
      { who: 'Dafydd', welsh: '“Rhwng”… between. Rhwng saith a naw.', english: '“Rhwng”… between. Between seven and nine.' },
      { who: you, welsh: 'Dw i’n deall nawr. Sut mae dweud “key” yn Gymraeg?', english: 'I understand now. How do you say “key” in Welsh?' },
      { who: 'Dafydd', welsh: 'Goriad! Dyma’ch goriad chi.', english: 'Goriad! Here’s your key.', note: 'Older Wladfa speakers say goriad; learners from Wales say allwedd.' },
      { who: you, welsh: 'Goriad. Diolch yn fawr iawn!', english: 'Goriad. Thank you very much!' },
    ],
  },
  {
    id: 'd4',
    titleCy: 'Teulu',
    title: 'Family and languages',
    setting: 'A kitchen in Trelew, over a cup of mate.',
    lines: [
      { who: 'Marta', welsh: 'Oes teulu mawr gyda chi?', english: 'Have you got a big family?' },
      { who: you, welsh: 'Oes. Mae gen i frawd a dwy chwaer.', english: 'Yes. I’ve got a brother and two sisters.' },
      { who: 'Marta', welsh: 'Ydyn nhw’n byw yn India?', english: 'Do they live in India?' },
      { who: you, welsh: 'Ydyn. Mae fy rhieni’n byw yn Chennai.', english: 'Yes. My parents live in Chennai.' },
      { who: 'Marta', welsh: 'A pha ieithoedd dach chi’n siarad?', english: 'And which languages do you speak?', note: 'a (and) + p → ph: a pha. dach chi — the northern and Wladfa form of dych chi. Same meaning; you can keep saying dych.' },
      { who: you, welsh: 'Dw i’n siarad Tamil, Saesneg… a thipyn bach o Gymraeg!', english: 'I speak Tamil, English… and a little Welsh!' },
      { who: 'Marta', welsh: 'Da iawn! Roedd fy nain i’n siarad Cymraeg bob dydd.', english: 'Very good! My grandmother spoke Welsh every day.' },
      { who: you, welsh: 'Dych chi’n siarad Cymraeg gartre?', english: 'Do you speak Welsh at home?' },
      { who: 'Marta', welsh: 'Weithiau. Sbaeneg fel arfer, a dweud y gwir.', english: 'Sometimes. Spanish usually, to be honest.' },
    ],
  },
  {
    id: 'd5',
    titleCy: 'Beth dych chi’n hoffi?',
    title: 'Free time',
    setting: 'A café by the sea in Puerto Madryn. Few Welsh speakers live in Madryn itself — Huw is visiting from Trelew.',
    lines: [
      { who: 'Huw', welsh: 'Beth dych chi’n hoffi’i wneud yn eich amser sbâr?', english: 'What do you like doing in your spare time?' },
      { who: you, welsh: 'Dw i wrth fy modd yn teithio. A dw i’n hoffi coginio.', english: 'I love travelling. And I like cooking.' },
      { who: 'Huw', welsh: 'Dych chi’n hoffi pêl-droed?', english: 'Do you like football?' },
      { who: you, welsh: 'Ydw, ond mae’n well gen i griced!', english: 'Yes, but I prefer cricket!' },
      { who: 'Huw', welsh: 'Criced? Dw i ddim yn deall criced o gwbl!', english: 'Cricket? I don’t understand cricket at all!' },
      { who: you, welsh: 'Dim problem. Mae’n anodd, a dweud y gwir.', english: 'No problem. It’s hard, to be honest.' },
      { who: 'Huw', welsh: 'Dw i’n hoffi canu. Dw i’n canu yn y côr bob wythnos.', english: 'I like singing. I sing in the choir every week.' },
      { who: you, welsh: 'Wir? Diddorol iawn!', english: 'Really? Very interesting!' },
    ],
  },
  {
    id: 'd6',
    titleCy: 'Te Cymreig',
    title: 'Ordering Welsh tea',
    setting: 'Back at the tea house in Gaiman.',
    lines: [
      { who: 'Elena', welsh: 'Beth gymrwch chi?', english: 'What will you have?' },
      { who: you, welsh: 'Ga i de Cymreig i un, os gwelwch yn dda?', english: 'Can I have Welsh tea for one, please?' },
      { who: 'Elena', welsh: 'Wrth gwrs. Te gyda llaeth?', english: 'Of course. Tea with milk?' },
      { who: you, welsh: 'Ie, gyda llaeth, heb siwgr.', english: 'Yes, with milk, no sugar.' },
      { who: 'Elena', welsh: 'Dyma chi: bara menyn, sgons, a theisen ddu.', english: 'Here you are: bread and butter, scones, and black cake.' },
      { who: you, welsh: 'Mae hwn yn flasus! Mae’r deisen ddu’n fendigedig.', english: 'This is tasty! The black cake is wonderful.' },
      { who: you, welsh: 'Faint ydy hwnna, plîs?', english: 'How much is that, please?' },
      { who: 'Elena', welsh: 'Deg mil o besos, os gwelwch yn dda.', english: 'Ten thousand pesos, please.', note: 'An example number only: prices change fast with inflation, and they’re usually said in Spanish — check locally.' },
      { who: you, welsh: 'Deg mil? Dim problem. Diolch, roedd e’n hyfryd!', english: 'Ten thousand? No problem. Thanks, it was lovely!', note: 'Repeat the number back — it checks you heard it right.' },
    ],
  },
  {
    id: 'd7',
    titleCy: 'Ble mae’r amgueddfa?',
    title: 'Finding your way',
    setting: 'A street corner in Gaiman.',
    lines: [
      { who: you, welsh: 'Esgusodwch fi, ble mae’r amgueddfa?', english: 'Excuse me, where is the museum?' },
      { who: 'Ana', welsh: 'Ewch yn syth ymlaen, wedyn trowch i’r chwith.', english: 'Go straight on, then turn left.' },
      { who: you, welsh: 'Yn syth ymlaen, ac i’r chwith. Ydy hi’n bell?', english: 'Straight on, and left. Is it far?' },
      { who: 'Ana', welsh: 'Nac ydy, mae’n agos iawn. Mae hi yn yr hen orsaf.', english: 'No, it’s very close. It’s in the old station.', note: 'The Gaiman museum is in the old railway station building.' },
      { who: you, welsh: 'Diolch! A pha fws sy’n mynd i Drelew?', english: 'Thanks! And which bus goes to Trelew?' },
      { who: 'Ana', welsh: 'Mae bws bob awr, o’r sgwâr.', english: 'There’s a bus every hour, from the square.' },
      { who: you, welsh: 'Faint o amser mae’n gymryd?', english: 'How long does it take?' },
      { who: 'Ana', welsh: 'Rhyw hanner awr.', english: 'About half an hour.' },
    ],
  },
  {
    id: 'd8',
    titleCy: 'Mae’n wyntog!',
    title: 'Weather and plans',
    setting: 'A farm porch near Trevelin, with the Andes behind.',
    lines: [
      { who: 'Ifor', welsh: 'Mae’n braf heddiw, yn tydi?', english: 'It’s lovely today, isn’t it?', note: 'yn tydi? — the northern and Wladfa tag for “isn’t it?”. In the South: on’d yw hi?' },
      { who: you, welsh: 'Ydy, ond mae’n wyntog iawn!', english: 'Yes, but it’s very windy!' },
      { who: 'Ifor', welsh: 'Mae gwynt Patagonia’n gryf, ’machgen i!', english: 'The Patagonian wind is strong, my boy!' },
      { who: you, welsh: 'Yn India mae’n boeth, ond does dim gwynt fel hyn.', english: 'In India it’s hot, but there’s no wind like this.' },
      { who: 'Ifor', welsh: 'Beth dach chi’n mynd i wneud yfory?', english: 'What are you going to do tomorrow?', note: 'dach chi — the northern and Wladfa form of dych chi. Same meaning; you can keep saying dych.' },
      { who: you, welsh: 'Dw i’n mynd i weld y capel, ac wedyn dw i’n mynd i Esquel.', english: 'I’m going to see the chapel, and then I’m going to Esquel.' },
      { who: 'Ifor', welsh: 'Hoffech chi ddod am baned ddydd Sul?', english: 'Would you like to come for a cuppa on Sunday?' },
      { who: you, welsh: 'Hoffwn, diolch! Am faint o’r gloch?', english: 'I’d like to, thanks! At what time?' },
      { who: 'Ifor', welsh: 'Tua pedwar. Rhaid i mi fynd rŵan — wela i chi ddydd Sul!', english: 'About four. I have to go now — see you on Sunday!', note: 'rŵan — “now”, common among older Wladfa speakers (others say nawr).' },
    ],
  },
  {
    id: 'd9',
    titleCy: 'Ddoe',
    title: 'What did you do yesterday?',
    setting: 'Breakfast at the guesthouse.',
    lines: [
      { who: 'Dafydd', welsh: 'Bore da! Beth wnaethoch chi ddoe?', english: 'Good morning! What did you do yesterday?' },
      { who: you, welsh: 'Es i i Borth Madryn. Welais i’r môr.', english: 'I went to Puerto Madryn. I saw the sea.' },
      { who: 'Dafydd', welsh: 'Gawsoch chi amser da?', english: 'Did you have a good time?' },
      { who: you, welsh: 'Do! Ges i amser gwych. Bwytais i asado.', english: 'Yes! I had a great time. I ate asado.' },
      { who: 'Dafydd', welsh: 'Asado! Ond dych chi ddim yn llysieuwr?', english: 'Asado! But aren’t you a vegetarian?' },
      { who: you, welsh: 'Nac ydw — ddim yn yr Ariannin!', english: 'No — not in Argentina!' },
      { who: 'Dafydd', welsh: 'Ha! Siaradoch chi Gymraeg yno?', english: 'Ha! Did you speak Welsh there?' },
      { who: you, welsh: 'Do, tipyn bach. Wnes i ddim deall popeth, ond roedd e’n hwyl.', english: 'Yes, a little. I didn’t understand everything, but it was fun.' },
    ],
  },
  {
    id: 'd10',
    titleCy: 'Y daith',
    title: 'How I got here',
    setting: 'At the tea house; Elena asks about your journey.',
    lines: [
      { who: 'Elena', welsh: 'Pryd cyrhaeddoch chi?', english: 'When did you arrive?' },
      { who: you, welsh: 'Cyrhaeddais i ddydd Llun. Roedd y daith yn hir iawn!', english: 'I arrived on Monday. The journey was very long!' },
      { who: 'Elena', welsh: 'Wrth gwrs — o India!', english: 'Of course — from India!' },
      { who: you, welsh: 'Hedfanais i i Buenos Aires, ac wedyn i Drelew — dros dri deg awr! Ar ôl hynny, es i ar y bws i’r Gaiman.', english: 'I flew to Buenos Aires, and then to Trelew — over thirty hours! After that, I took the bus to Gaiman.', note: 'dros softens: tri → dri. From India it’s usually a long-haul flight to Buenos Aires, then a domestic flight to Trelew.' },
      { who: 'Elena', welsh: 'A pham dechreuoch chi ddysgu Cymraeg?', english: 'And why did you start learning Welsh?' },
      { who: you, welsh: 'Achos ro’n i eisiau gweld y Gymraeg yn y Wladfa. Dechreuais i ddeufis yn ôl.', english: 'Because I wanted to see Welsh in Patagonia. I started two months ago.' },
      { who: 'Elena', welsh: 'Dim ond deufis? Anhygoel!', english: 'Only two months? Amazing!' },
      { who: you, welsh: 'Diolch! Ro’n i’n nerfus, ond mae pawb mor garedig.', english: 'Thanks! I was nervous, but everyone is so kind.' },
    ],
  },
  {
    id: 'd11',
    titleCy: 'Beth dych chi’n feddwl?',
    title: 'Opinions about learning Welsh',
    setting: 'A café in Trelew with a young Welsh speaker.',
    lines: [
      { who: 'Lucía', welsh: 'Beth dych chi’n feddwl o’r Gymraeg? Ydy hi’n anodd?', english: 'What do you think of Welsh? Is it hard?' },
      { who: you, welsh: 'A dweud y gwir, mae’r treigladau’n anodd!', english: 'To be honest, the mutations are hard!' },
      { who: 'Lucía', welsh: 'Ha! Dw i’n cytuno. Ond mae hi’n werth chweil, on’d yw hi?', english: 'Ha! I agree. But it’s worth it, isn’t it?' },
      { who: you, welsh: 'Ydy, wrth gwrs. Yn fy marn i, mae’n iaith hyfryd.', english: 'Yes, of course. In my opinion, it’s a lovely language.' },
      { who: 'Lucía', welsh: 'Dw i’n meddwl ei bod hi’n bwysig cadw’r iaith yn fyw yma.', english: 'I think it’s important to keep the language alive here.' },
      { who: you, welsh: 'Pam?', english: 'Why?' },
      { who: 'Lucía', welsh: 'Achos mae’n rhan o’n hanes ni. Fy nain, fy nhaid…', english: 'Because it’s part of our history. My granny, my grandad…' },
      { who: you, welsh: 'Mae hynny’n bwysig iawn. Chwarae teg i chi.', english: 'That’s very important. Good for you.' },
    ],
  },
  {
    id: 'd12',
    titleCy: 'Ar ôl yr oedfa',
    title: 'After the chapel service',
    setting: 'Outside a chapel in the Chubut valley, Sunday morning.',
    lines: [
      { who: 'Marta', welsh: 'Welais i chi’n canu! Oeddech chi’n mwynhau?', english: 'I saw you singing! Were you enjoying it?' },
      { who: you, welsh: 'Oeddwn! Mae’r emynau’n hyfryd. Wnes i ddim deall popeth, ond…', english: 'Yes! The hymns are lovely. I didn’t understand everything, but…' },
      { who: 'Marta', welsh: 'Peidiwch â phoeni. Mae’r iaith yn hen iawn yn yr emynau.', english: 'Don’t worry. The language in the hymns is very old.' },
      { who: you, welsh: 'Pa mor hen ydy’r capel?', english: 'How old is the chapel?' },
      { who: 'Marta', welsh: 'Dros gan mlynedd. Adeiladodd yr ymfudwyr o.', english: 'Over a hundred years. The settlers built it.', note: 'o (it, him) — the northern and Wladfa form of e.' },
      { who: you, welsh: 'Anhygoel. Dych chi’n dod bob wythnos?', english: 'Amazing. Do you come every week?' },
      { who: 'Marta', welsh: 'Bob dydd Sul. Yn Sbaeneg mae’r oedfa fel arfer, ond weithiau mae hi yn Gymraeg — fel heddiw!', english: 'Every Sunday. The service is usually in Spanish, but sometimes it’s in Welsh — like today!', note: 'Many chapels hold a Welsh service only now and then; most are in Spanish or bilingual.' },
      { who: you, welsh: 'Diddorol iawn. Diolch am y croeso!', english: 'Very interesting. Thanks for the welcome!' },
    ],
  },
  {
    id: 'd13',
    titleCy: 'Hanes y teulu',
    title: 'Family history',
    setting: 'Back on the farm near Trevelin.',
    lines: [
      { who: you, welsh: 'O ble yng Nghymru daeth eich teulu chi?', english: 'Where in Wales did your family come from?' },
      { who: 'Ifor', welsh: 'O Feirionnydd. Daeth fy hen daid ar y Mimosa.', english: 'From Meirionnydd. My great-grandfather came on the Mimosa.' },
      { who: you, welsh: 'Ar y Mimosa? Yn 1865?', english: 'On the Mimosa? In 1865?' },
      { who: 'Ifor', welsh: 'Ia. Roedd bywyd yn galed iawn i’r ymfudwyr cynta.', english: 'Yes. Life was very hard for the first settlers.' },
      { who: you, welsh: 'Pa genhedlaeth dych chi?', english: 'Which generation are you?' },
      { who: 'Ifor', welsh: 'Fi ydy’r bedwaredd genhedlaeth. Ac mae fy wyrion yn dysgu yn yr ysgol rŵan.', english: 'I’m the fourth generation. And my grandchildren are learning at school now.' },
      { who: you, welsh: 'Mae’r hanes yn anhygoel. Ga i’ch ffilmio chi’n dweud hynny?', english: 'The history is amazing. May I film you saying that?' },
      { who: 'Ifor', welsh: 'Cewch, wrth gwrs!', english: 'You may, of course!' },
    ],
  },
  {
    id: 'd14',
    titleCy: 'Y cyfweliad',
    title: 'The interview',
    setting: 'Filming in a plaza in Gaiman.',
    lines: [
      { who: you, welsh: 'Ga i ofyn ychydig o gwestiynau i chi? Ydy hi’n iawn os dw i’n ffilmio?', english: 'Can I ask you a few questions? Is it OK if I film?' },
      { who: 'Lucía', welsh: 'Ydy, dim problem.', english: 'Yes, no problem.' },
      { who: you, welsh: 'Pryd oedd y tro diwetha i chi siarad Cymraeg heddiw? Gyda phwy?', english: 'When did you last speak Welsh today? Who with?', note: 'Story questions get real moments, not yes/no answers.' },
      { who: 'Lucía', welsh: 'Y bore ’ma, gyda ffrind o’r dosbarth Cymraeg, dros baned.', english: 'This morning, with a friend from Welsh class, over a cuppa.' },
      { who: you, welsh: 'Beth dych chi’n gofio am eich nain yn siarad Cymraeg?', english: 'What do you remember about your granny speaking Welsh?' },
      { who: 'Lucía', welsh: 'Roedd hi’n canu caneuon Cymraeg i fi. Ond roedd hi’n siarad Sbaeneg gyda fy mam.', english: 'She used to sing me Welsh songs. But she spoke Spanish with my mum.' },
      { who: you, welsh: 'Pam?', english: 'Why?' },
      { who: 'Lucía', welsh: 'Achos roedd Sbaeneg yn bwysicach bryd hynny — yn yr ysgol ac yn y gwaith.', english: 'Because Spanish mattered more back then — at school and at work.' },
      { who: you, welsh: 'Felly, roedd y Gymraeg bron â diflannu? Beth newidiodd?', english: 'So Welsh nearly disappeared? What changed?', note: 'Felly… — say back what you understood, then ask the next question.' },
      { who: 'Lucía', welsh: 'Yn 1965, ar y canmlwyddiant, daeth llawer o bobl o Gymru. Ac ers 1997, mae athrawon yn dod o Gymru bob blwyddyn. Nawr mae dosbarthiadau yn y Gaiman, yn Nhrelew, yn Nhrefelin…', english: 'In 1965, at the centenary, lots of people came from Wales. And since 1997, teachers have come from Wales every year. Now there are classes in Gaiman, in Trelew, in Trevelin…', note: 'The 1965 centenary renewed links with Wales; the Welsh Language Project has sent teachers since 1997.' },
      { who: you, welsh: 'Beth fyddech chi’n ddweud wrth rywun sy’n meddwl am ddysgu Cymraeg?', english: 'What would you say to someone thinking of learning Welsh?' },
      { who: 'Lucía', welsh: 'Ewch amdani! Sbaeneg ydy’r iaith bob dydd yma, ond mae’r Gymraeg yn fyw.', english: 'Go for it! Spanish is the everyday language here, but Welsh is alive.' },
      { who: you, welsh: 'Diolch yn fawr am eich amser!', english: 'Thank you very much for your time!' },
    ],
  },
]

export function getDialogue(id: string): Dialogue | undefined {
  return DIALOGUES.find((d) => d.id === id)
}
