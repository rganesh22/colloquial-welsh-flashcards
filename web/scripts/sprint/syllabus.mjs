/**
 * The 50-day sprint's grammar track: one speaking pattern a day, northern
 * colloquial forms (what Easy Welsh and most of Y Wladfa use). Every 7th day
 * is a catch-up day: no new words, so a missed day costs nothing.
 */
export const DAYS = 50
export const NEW_PER_DAY = 25
export const isCatchUp = (day) => day % 7 === 0

/** [day, pattern title, what it lets you say] */
export const SYLLABUS = [
  [1, "Dw i'n … / Wyt ti'n …?", "Say what you do: Dw i'n dysgu Cymraeg. Ask: Wyt ti'n siarad Cymraeg?"],
  [2, 'Ydw / Nac ydw · Dw i ddim yn …', 'Answer yes/no questions and say what you don’t do.'],
  [3, 'Every person: dan ni, dach chi, mae o/hi, maen nhw', 'Talk about other people, and use polite "dach chi".'],
  [4, 'Question words: be, lle, pryd, pam, sut, pwy, faint', 'Ask the questions every conversation needs.'],
  [5, "Mae'n braf: describing with yn + soft mutation", 'Describe things and people: mae hi’n dda, mae o’n fawr.'],
  [6, 'Dw i’n licio / Dw i isio / Dw i angen', 'Say what you like, want and need.'],
  [7, 'Catch-up', 'Review, reread, rewatch.'],
  [8, 'Mae gen i … / Oes gen ti …? / Does gen i ddim …', 'Say what you have (northern "gen i").'],
  [9, 'Fy / dy / ei: my, your, his/her (with mutations)', 'Talk about your family: fy nhad, dy fam, ei chwaer.'],
  [10, 'Numbers, prices and the time', 'Faint ydy o? Mae’n bump o’r gloch. Count to a hundred.'],
  [11, 'Ga i …? · Dw i’n gallu / medru …', 'Ask for things politely and say what you can do.'],
  [12, 'Dw i’n mynd i … (going to)', 'Talk about plans: Dw i’n mynd i Batagonia.'],
  [13, 'Dw i’n byw yn … / Dw i’n dod o … (place mutations)', 'Where you live and come from: ym Mangor, yng Nghaerdydd.'],
  [14, 'Catch-up', 'Review, reread, rewatch.'],
  [15, 'Dw i wedi … (have done)', 'Say what you have done: Dw i wedi bod yn Gaiman.'],
  [16, 'Es i, ges i, wnes i (went, had, did)', 'Tell people what you did yesterday.'],
  [17, 'Wnes i weld / Nes i …: past of any verb', 'Past tense of any verb, with the soft mutation.'],
  [18, "Ro'n i / Roedd o (was, used to be)", 'Describe the past: Roedd hi’n braf. Ro’n i’n byw yn …'],
  [19, 'Past questions and negatives: Est ti? Wnest ti? Wnes i ddim', 'Ask about someone’s day and say what you didn’t do.'],
  [20, 'Requests and instructions: dewch, steddwch, cofiwch', 'Understand hosts and give simple instructions.'],
  [21, 'Catch-up', 'Review, reread, rewatch.'],
  [22, 'Bydda i / Fyddi di? / Bydd hi (will be)', 'Talk about the future: Bydda i yn y Wladfa ym mis Ionawr.'],
  [23, 'Wna i … / Wnei di …? (I’ll do, will you?)', 'Offer and promise: Wna i helpu. Wnei di ddod?'],
  [24, 'Baswn i’n licio / Hoffwn i (I would)', 'Polite wishes: Baswn i’n licio paned. Hoffwn i weld y capel.'],
  [25, 'Dw i’n meddwl bod … (that-clauses)', 'Give opinions: Dw i’n meddwl bod y Gymraeg yn bwysig.'],
  [26, 'Achos, pan, os, ond: joining ideas', 'Make longer sentences and give reasons.'],
  [27, 'Mwy … na, gorau, gwell (comparing)', 'Compare: Mae te yn well na coffi. Y lle gorau.'],
  [28, 'Catch-up', 'Review, reread, rewatch.'],
  [29, 'Gen i, i fi, efo fi, amdana i: prepositions with people', 'Me, you, him, her after prepositions.'],
  [30, 'Wedyn, ar ôl, cyn: telling a story in order', 'Tell a short story about your trip.'],
  [31, 'Fel arfer / bob dydd: habits', 'Say what you usually do.'],
  [32, 'Rhaid i fi / Dylwn i (must, should)', 'Say what you have to or should do.'],
  [33, 'Dw i ddim yn gwybod os / be / lle …', 'Indirect questions: Dw i ddim yn siŵr lle mae o.'],
  [34, 'Cymraeg y Wladfa: Spanish words and local ways', 'Recognise Patagonian Welsh: Spanish loans, greetings, places.'],
  [35, 'Catch-up', 'Review, reread, rewatch.'],
  [36, 'Sy / sydd: the person who …', 'Describe people: y dyn sy’n byw yn Gaiman.'],
  [37, 'Ers, am, yn ôl: how long, ago', 'Dw i’n dysgu Cymraeg ers dau fis. Dau ddiwrnod yn ôl.'],
  [38, 'Family and heritage: all the persons', 'Talk about families and where people’s families came from.'],
  [39, 'Conversation glue: wel, ia, ynde, chwarae teg, wir?', 'Sound natural and react while others talk.'],
  [40, 'Keeping it going: Sut dach chi’n deud …? Arafach, plîs', 'Repair a conversation when you get stuck.'],
  [41, 'Taswn i / Pe bawn i (if I were)', 'Imagine: Taswn i’n byw yn Gaiman, baswn i’n …'],
  [42, 'Catch-up', 'Review, reread, rewatch.'],
  [43, 'Yesterday, today, tomorrow in one story', 'Switch tenses smoothly in one story.'],
  [44, 'Interviewing people (like Easy Welsh)', 'Ask a stranger questions and follow up on the answers.'],
  [45, 'Your story: why Welsh, why Patagonia', 'Tell your own story for a minute.'],
  [46, 'Asking about their story and their family', 'Ask locals about their families and the Mimosa.'],
  [47, 'Opinions and plans together', 'Mix opinions, plans and reasons.'],
  [48, 'On camera: street-interview questions', 'The questions you’ll ask on camera, and how to react.'],
  [49, 'Catch-up', 'Review, reread, rewatch.'],
  [50, 'The final: introduce yourself and interview someone', 'Five minutes of Welsh, start to finish.'],
]

/**
 * Easy Welsh videos in the order the sprint works through them (easiest
 * first). Each becomes "ready to watch" once you know nearly all its words.
 */
export const VIDEO_ORDER = [
  'a1dZ_wZdl_A', // Basic Phrases 1
  'KQ7VNicE-lY', // Basic Phrases 2
  'RmGLWMJpZLM', // Super Easy 1: ordering drinks
  'f3bUF4CWX50', // Easy Welsh 1: Dolgellau 1
  'JZC_q1ZuDik', // 2: Cletwr shop 1
  'ZROR48_kCsE', // 3: Machynlleth 1
  'VHe9XPFHb8E', // 4: Cletwr shop 2
  'A6lwu29UIRc', // 5: Dolgellau 2
  '9EHbcemdpd8', // 6: Corris
  '2wx65QIg65Q', // 10: tea or coffee
  'ufKf4eORcKA', // 7: what's typical Welsh
  'KC1zIuBKkdY', // 9: nicknames
  'FtAjyCUDCmQ', // 8: worst job
  'PvhE4k2h4p0', // Super Easy 2: the alphabet
]
