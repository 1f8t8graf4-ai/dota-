# Ролики v2 (08.11.2026): 4 темы × 2 формата, EN + RU.
#   WDYK («What do you know about…», как «Что вы знаете о…» 2016): mrbeast, nicotine, aids, meph.
#   Второй формат: nicstory (герой и счётчик, как klin_situation), aidsmyth (проверка мифов, как касатки),
#                  mephnight («Представь…» по часам).
#   RU — nicotine, nicstory, meph, mephnight.
# Разметка: {ПОКАЗ|как говорить}; *слово — жёлтым; !слово — красным. Ключ = сцена (картинка).
# Писать БЕЗ «не X, а Y», «he's not just…», «here's the catch», «turns out», «in other words» —
#   Андрей: «первый легчайший детект нейронки». Короткие утверждения, сухо, как в оригинале.
#
# Источники (проверено 08.11.2026):
# MrBeast — «I Counted to 100,000!» 8.01.2017, ~40 ч; родился 7.05.1998 (в 2017-м — 18 лет). #TeamTrees 2019 — 20 млн
#   деревьев. «$456,000 Squid Game» — ноябрь 2021, 456 игроков. ~522 млн подписчиков (Tubefilter 10/2026).
#   Остров — видео «I Gave My 100,000,000th Subscriber A Private Island», 4.08.2022. «I Built 100 Wells In Africa» — 2023.
#   Beast Games (Prime Video, дек. 2024): 1000 участников, приз $5 млн.
#   США ~342 млн, Россия ~146 млн; Индия ~1,46 млрд, Китай ~1,41 млрд; Земля 8,24 млрд (PRB 2026) → 1 из 16.
# Nicotine — см. ../wdyk/scripts.py (инсектицид с 1690, Black Leaf 40 до 1992, Жан Нико ~1560, неоникотиноиды,
#   мозг за ~10 с — NIDA, под JUUL 5 % ≈ пачка — Truth Initiative, > 7 млн смертей в год — ВОЗ 2025).
#   Период полувыведения никотина ~2 ч (NIDA/Benowitz). DiFranza 2007: у части подростков зависимость за 2 дня.
#   ЕС 2018 — запрет трёх неоникотиноидов (имидаклоприд, клотианидин, тиаметоксам) на открытых полях из-за пчёл.
#   Отмена: пик в первые 3 дня (NHS, NCI), спадает за 2–4 недели; тяга длится минуты, пик 3–5 мин (JHAH).
# AIDS — ВИЧ-1 от шимпанзе (юго-восток Камеруна), «охотник и кровь» — основная гипотеза; Киншаса ~1920 (Faria et al.,
#   Science 2014: железные дороги, река); самый старый образец — 1959, Киншаса; MMWR 5.06.1981 — 5 молодых мужчин,
#   Лос-Анджелес, пневмоцистная пневмония. «Patient O» = Outside of California, прочли как ноль (NPR 2016, Darrow);
#   в США ~1970–71 через Карибы (Worobey et al., Nature 2016). U=U; PEP — в первые 72 ч (CDC). Yeztugo (ленакапавир)
#   — FDA 18.06.2025, укол 2 раза в год. UNAIDS 2026: 41,0 млн с ВИЧ в 2025, 88 % знают статус (→ >1 из 10 не знает).
#   Комары не переносят ВИЧ; слюна, пот, слёзы, объятия, туалет, посуда — нет (CDC). Почти нормальная жизнь при раннем
#   лечении (Trickey et al., Lancet HIV).
# Meph — 1929, Saem de Burnaga Sanchez, «гомолог эфедрина»; заново ~2003; продавали как «plant food», «not for human
#   consumption»; опрос Mixmag 2009 — > 40 % пробовали (CMAJ 2010); Великобритания — класс B 16.04.2010; ЕС — дек. 2010;
#   короткий эффект и тяга добрать (T½ ~2 ч); пульс, челюсть, потливость, бессонница, откат; Winstock et al., Addiction
#   2011 — «сравнимый с кокаином потенциал зависимости»; Россия — > 6 т изъято в 2024 (МВД, постановление 2025).
import re

S = {}

S['mrbeast'] = {'en': [
    ("title",   "What do you know about {MrBeast|Mister Beast}?"),
    ("money",   "That he's the guy who gives away *money on YouTube?"),
    ("claim",   "But did you know that {MrBeast|Mister Beast} is quietly building his own *country?"),
    ("census",  "Every country starts with a census. In {2017|twenty seventeen}, an {18|eighteen} year old named *Jimmy sat in front of a camera and counted to {100,000|one hundred thousand}."),
    ("census",  "It took him about {40|forty} *hours. A strange hobby for a teenager. Perfect training for a *census."),
    ("people",  "Today his channel counts {522 million|five hundred twenty two million} people. That's more than the United States and Russia *combined."),
    ("land",    "A country needs land. In {2022|twenty twenty two}, he gave away a private *island."),
    ("forest",  "It needs forests. His fans paid to plant {20 million|twenty million} *trees."),
    ("water",   "It needs water. He built a hundred *wells in Africa."),
    ("army",    "And it needs an army. In {2024|twenty twenty four}, a *thousand people fought on his show for {five million dollars|five million dollars}."),
    ("anthem",  "Even the anthem is ready. It sounds like a cash *register."),
    ("button",  "Now look at the red button under every video. One press turns a viewer into a *citizen."),
    ("you",     "Be honest. You pressed it *too."),
]}

S['nicotine'] = {
'en': [
    ("title",  "What do you know about *nicotine?"),
    ("vape",   "That it's the stuff in cigarettes and vapes?"),
    ("claim",  "But did you know that nicotine is a *weapon, and the tobacco plant built it long before people existed?"),
    ("bite",   "When an insect bites a tobacco leaf, nicotine hits its nerves, and the insect *freezes."),
    ("farm",   "People noticed. By {1690|sixteen ninety}, gardeners were killing pests with tobacco water."),
    ("bottle", "In America, a nicotine poison called Black Leaf {40|forty} was sold until {1992|nineteen ninety two}."),
    ("neo",    "Some of the most used insecticides on Earth still copy that molecule. They're called *neonicotinoids."),
    ("neo",    "In {2018|twenty eighteen}, the EU banned three of them on open fields to protect *bees."),
    ("brain",  "And this is where it gets personal. Your brain has the same kind of receptors as that insect."),
    ("brain",  "One puff, and nicotine reaches them in *seconds. Then it fades, and the brain asks for *more."),
    ("pod",    "One vape pod can hold as much nicotine as a *pack of cigarettes."),
    ("toll",   "Tobacco kills more than seven million people a year. One every five *seconds."),
    ("end",    "The plant made a poison so bugs would stop eating it."),
    ("end2",   "We gave it a mango flavor so we'd never *stop."),
],
'ru': [
    ("title",  "Что вы знаете о *никотине?"),
    ("vape",   "Что он в сигаретах и одноразках?"),
    ("claim",  "А знаете ли вы, что никотин — это *оружие, и табак придумал его задолго до появления людей?"),
    ("bite",   "Когда насекомое кусает лист табака, никотин бьёт ему по нервам, и жук *замирает."),
    ("farm",   "Люди это заметили. Уже к {1690|тысяча шестьсот девяностому} году огородники травили вредителей табачной водой."),
    ("bottle", "В Америке никотиновый яд «Блэк Лиф {40|сорок}» продавали до {1992|тысяча девятьсот девяносто второго} года."),
    ("neo",    "Самые ходовые инсектициды на планете до сих пор копируют эту молекулу. Они так и называются: *неоникотиноиды."),
    ("neo",    "В {2018|две тысячи восемнадцатом} году Евросоюз запретил три из них на открытых полях, чтобы спасти *пчёл."),
    ("brain",  "А теперь про нас. В мозге человека такие же рецепторы, как у этого жука."),
    ("brain",  "Одна затяжка, и никотин доходит до них за *секунды. Потом отпускает, и мозг просит *ещё."),
    ("pod",    "В одном поде может быть столько же никотина, сколько в *пачке сигарет."),
    ("toll",   "Табак убивает больше семи миллионов человек в год. Одного каждые *пять *секунд."),
    ("end",    "Табак сделал яд, чтобы его перестали есть."),
    ("end2",   "А мы добавили вкус *манго, чтобы никогда не *бросать."),
]}

S['aids'] = {'en': [
    ("title",    "What do you know about *AIDS?"),
    ("eighties", "A disease from the eighties?"),
    ("claim",    "But did you know that the virus behind it is about a *hundred years old, and for years the world blamed the wrong *man?"),
    ("forest",   "It started in the forests of Cameroon, in *chimpanzees."),
    ("hunter",   "Most likely a hunter, a cut, and a drop of *blood."),
    ("kin",      "Around {1920|nineteen twenty}, it reached *Kinshasa. A fast growing city, with railways and river boats going everywhere."),
    ("sample",   "The oldest blood sample with the virus was taken there in {1959|nineteen fifty nine}."),
    ("la",       "In {1981|nineteen eighty one}, doctors in Los Angeles reported five young men with a rare pneumonia. That's when the world noticed."),
    ("zero",     "For years, one man was blamed as *Patient *Zero."),
    ("o",        "The study had called him Patient *O. O for Outside California. Somebody read it as a *zero."),
    ("dna",      "Genetic tests later showed the virus reached the United States around {1971|nineteen seventy one}. Years before him."),
    ("pill",     "In the early nineties it was a death sentence. Today one pill a day can make the virus *undetectable."),
    ("uu",       "And undetectable means it can't be passed on through sex."),
    ("shot",     "In {2025|twenty twenty five}, a shot you get *twice *a *year was approved to prevent it."),
    ("count",    "Still, about {41 million|forty one million} people live with HIV."),
    ("end",      "So AIDS is older than your grandma."),
    ("end2",     "If you've never been tested, take this as your *sign."),
]}

S['meph'] = {
'en': [
    ("title",  "What do you know about *mephedrone?"),
    ("names",  "Meph. Meow meow. A party drug?"),
    ("claim",  "But did you know that it was sold as *plant *food?"),
    ("y1929",  "It was first described in {1929|nineteen twenty nine}, in a chemistry journal, as a cousin of ephedrine."),
    ("y1929",  "Then everybody forgot about it for seventy years."),
    ("shop",   "By {2009|two thousand nine}, it was sold in British online shops. The label said *plant *food."),
    ("small",  "Under it, in small letters: not for human consumption. That one line kept it *legal."),
    ("plants", "No plant ever got any."),
    ("survey", "That year, in a big survey of clubbers, more than {40%|forty percent} said they had tried it."),
    ("redose", "The high fades fast, and within an hour or two the brain starts begging for *more."),
    ("body",   "Hearts race. Jaws clench. Sleep disappears for a night or two."),
    ("drop",   "Then comes the crash. Anxiety, emptiness, and a very heavy *Monday."),
    ("ban",    "In April {2010|twenty ten}, Britain *banned it. By the end of that year, so did the whole EU."),
    ("russia", "In Russia, police seized more than *six *tonnes of it in {2024|twenty twenty four} alone."),
    ("end",    "So a molecule from {1929|nineteen twenty nine} got a second life as plant food."),
    ("end2",   "The plants are fine, by the way. They never touched it."),
],
'ru': [
    ("title",  "Что вы знаете о *мефедроне?"),
    ("names",  "Меф. Мяу-мяу. Клубный наркотик?"),
    ("claim",  "А знаете ли вы, что его продавали как *удобрение для цветов?"),
    ("y1929",  "Впервые его описали в {1929|тысяча девятьсот двадцать девятом} году, в химическом журнале, как родственника эфедрина."),
    ("y1929",  "А потом о нём забыли на семьдесят лет."),
    ("shop",   "К {2009|две тысячи девятому} году его продавали в британских интернет-магазинах. На этикетке — *«удобрение *для *растений»."),
    ("small",  "А ниже мелко: «не для употребления человеком». Эта строчка и делала его *легальным."),
    ("plants", "Ни одно растение его так и не получило."),
    ("survey", "В том же году в большом опросе клубной публики больше {40%|сорока процентов} сказали, что пробовали его."),
    ("redose", "Эффект короткий: через час-два мозг уже требует *ещё."),
    ("body",   "Сердце колотится. Челюсть сводит. Сна нет сутки, а то и двое."),
    ("drop",   "А потом откат. Тревога, пустота и очень тяжёлый *понедельник."),
    ("ban",    "В апреле {2010|две тысячи десятого} года его *запретили в Британии, а к концу года — во всём Евросоюзе."),
    ("russia", "В России только за {2024|две тысячи двадцать четвёртый} год изъяли больше *шести *тонн мефедрона."),
    ("end",    "Так вещество из {1929|тысяча девятьсот двадцать девятого} года получило вторую жизнь под видом удобрения."),
    ("end2",   "С растениями, кстати, всё хорошо. Они его так и не тронули."),
]}

S['nicstory'] = {
'en': [
    ("intro",  "This is Max. He's fifteen, and this number shows how long he can go without *nicotine."),
    ("intro",  "Right now, it says *forever."),
    ("d1",     "Day one. Behind the gym, a friend passes him a vape. Mango ice."),
    ("d1",     "He coughs. His head spins. Everybody laughs."),
    ("brain",  "Nicotine reaches his brain in seconds. The brain gets a hit of *dopamine and makes a note."),
    ("d10",    "Day ten. He buys his own. Studies of teenagers show the first signs of addiction can appear within *days."),
    ("d30",    "Day thirty. He grabs the vape before his phone in the morning."),
    ("d30",    "Six hours without it, and he's *on *edge."),
    ("half",   "Nicotine leaves the blood fast. Every two hours, half of it is gone."),
    ("d90",    "Day ninety. *Ninety *minutes. A double lesson feels like a prison sentence."),
    ("d120",   "Day one hundred twenty. He vapes in the school toilet between classes."),
    ("quit",   "Then one morning, Max decides he's done."),
    ("flip",   "The counter *flips."),
    ("q1",     "Day one. Everyone is annoying."),
    ("q3",     "Day three. The worst of it."),
    ("wave",   "Each craving feels endless, and it's gone in a few *minutes."),
    ("q14",    "Day fourteen. The cravings come less often."),
    ("q30",    "Day thirty. He sleeps through the night."),
    ("end",    "That's the only counter worth *growing."),
],
'ru': [
    ("intro",  "Это Макс. Ему пятнадцать. А эта цифра — сколько он может прожить без *никотина."),
    ("intro",  "Пока что — *сколько *угодно."),
    ("d1",     "День первый. За спортзалом друг даёт ему вейп. Манго со льдом."),
    ("d1",     "Макс кашляет. Голова кружится. Все ржут."),
    ("brain",  "Никотин доходит до мозга за секунды. Мозг получает порцию *дофамина и делает пометку."),
    ("d10",    "День десятый. Он покупает свою одноразку. Исследования подростков показывают: первые признаки зависимости бывают уже через *несколько *дней."),
    ("d30",    "День тридцатый. Утром он хватает вейп раньше телефона."),
    ("d30",    "Шесть часов без него, и он уже на *нервах."),
    ("half",   "Никотин быстро уходит из крови. Каждые два часа его становится вдвое меньше."),
    ("d90",    "День девяностый. *Полтора *часа. Два урока подряд — как срок."),
    ("d120",   "День сто двадцатый. Он парит в школьном туалете на перемене."),
    ("quit",   "А потом однажды утром Макс решает: хватит."),
    ("flip",   "Счётчик *переворачивается."),
    ("q1",     "День первый. Бесят все."),
    ("q3",     "День третий. Тяжелее всего."),
    ("wave",   "Каждая тяга кажется бесконечной, и проходит за несколько *минут."),
    ("q14",    "День четырнадцатый. Тянет всё реже."),
    ("q30",    "День тридцатый. Макс спит всю ночь."),
    ("end",    "Вот этот счётчик и стоит *растить."),
]}

S['aidsmyth'] = {'en': [
    ("hook",  "Four things everyone believes about HIV. And one thing almost nobody *knows."),
    ("m1",    "One. Mosquitoes can spread it."),
    ("m1f",   "!False. A mosquito doesn't inject the last person's blood into you, and HIV can't multiply inside it."),
    ("m2",    "Two. You can catch it from a kiss, a hug, or a toilet seat."),
    ("m2f",   "!False. Saliva, sweat and tears don't pass HIV. Neither do shared cups."),
    ("m3",    "Three. You can tell by looking."),
    ("m3f",   "!False. People can feel fine for years. More than one in ten people with HIV don't know they have it."),
    ("m4",    "Four. It's a death sentence."),
    ("m4f",   "!False, for decades now. With treatment started early, people with HIV can live about as long as everyone else."),
    ("uu",    "On treatment, the virus can drop so low that it can't be passed on through sex. Doctors call it U equals U."),
    ("true",  "Now the thing almost nobody knows."),
    ("pep",   "If you think you were exposed, there are emergency pills called *PEP."),
    ("pep",   "They work if you start within {72|seventy two} *hours. The sooner, the better."),
    ("end",   "Save this. One day, you or a friend might need it."),
]}

S['mephnight'] = {
'en': [
    ("hook",  "Picture this. Saturday, eleven PM. You try meph for the first time."),
    ("t1115", "Eleven fifteen. Your heart speeds up. You love everyone in the room, and every joke you make is *gold."),
    ("t0000", "Midnight. Your jaw clenches. Your pupils are huge. Your shirt is wet."),
    ("t0040", "Twelve forty. It's already *fading. The high is short, and your brain wants it back right *now."),
    ("t0300", "Three AM. You've said 'last one' four *times."),
    ("t0500", "Five AM. Birds outside. Your heart is still racing, and your bed feels like a *trampoline."),
    ("t0700", "Seven AM. You lie there, listening to your own *heartbeat."),
    ("t0900", "Nine AM. Your phone is full of messages you don't remember *sending."),
    ("sun",   "Sunday. No appetite. No sleep. A heavy chest."),
    ("mon",   "Monday. Everything is grey. Some people get anxiety, some get paranoia, and some just want *more."),
    ("tue",   "Tuesday. You promise yourself: never *again."),
    ("study", "In a big UK survey, many users rated meph as addictive as *cocaine."),
    ("next",  "And next Saturday, your brain will only remember eleven *fifteen."),
    ("help",  "If this sounds like your weekends, help is free and anonymous. Link in the description."),
],
'ru': [
    ("hook",  "Представь: суббота, одиннадцать вечера. Ты впервые пробуешь меф."),
    ("t1115", "Двадцать три пятнадцать. Сердце разгоняется. Ты любишь всех вокруг, и каждая твоя шутка — *огонь."),
    ("t0000", "Полночь. Челюсть сводит. Зрачки огромные. Футболка мокрая."),
    ("t0040", "Ноль сорок. Уже *отпускает. Эффект короткий, и мозг хочет вернуть его прямо *сейчас."),
    ("t0300", "Три часа ночи. «Последний раз» звучало уже четыре *раза."),
    ("t0500", "Пять утра. За окном птицы. Сердце всё ещё колотится, а кровать — как *батут."),
    ("t0700", "Семь утра. Ты лежишь и слушаешь, как стучит *сердце."),
    ("t0900", "Девять утра. В телефоне куча сообщений, и ни одного ты не *помнишь."),
    ("sun",   "Воскресенье. Ни аппетита, ни сна. Тяжесть в груди."),
    ("mon",   "Понедельник. Всё серое. У кого-то тревога, у кого-то паранойя, а кто-то просто хочет *ещё."),
    ("tue",   "Вторник. Ты обещаешь себе: больше *никогда."),
    ("study", "В большом британском опросе многие называли тягу к мефу такой же, как к *кокаину."),
    ("study", "А в России меф — один из самых распространённых *наркотиков."),
    ("next",  "А в следующую субботу мозг вспомнит только двадцать три *пятнадцать."),
    ("help",  "Если это про твои выходные — помощь бесплатная и анонимная. Ссылка в описании."),
]}

# Energy (свой выбор темы, 08.11): таурин впервые выделили из бычьей жёлчи в 1827 (Tiedemann, Gmelin), название —
#   от лат. taurus (1838); в банках — синтетический (Red Bull FAQ, Full Fact — «бычья сперма» — миф). Krating Daeng —
#   Таиланд 1976 (Chaleo Yoovidhya), пили водители грузовиков; Матешиц пробовал от джетлага; Red Bull — Австрия
#   1.04.1987; 2025 — 13,969 млрд банок (Red Bull Company profile, Bloomberg 21.01.2026). 250 мл: ~80 мг кофеина
#   (≈ чашка кофе), ~27 г сахара (≈ 7 ч. л.); 500 мл банки — вдвое. Англия: запрет продажи до 16 лет с апреля 2027
#   (> 150 мг/л, правительство 16.07.2026).
S['energy'] = {'en': [
    ("title",   "What do you know about *energy *drinks?"),
    ("can",     "Sugar, caffeine, and a can that keeps you up until three?"),
    ("claim",   "But did you know that the bull in them is *real?"),
    ("bile",    "In {1827|eighteen twenty seven}, two German scientists found a new substance in ox *bile."),
    ("bile",    "They named it after the Latin word for bull. *Taurine."),
    ("myth",    "The internet says it comes from bull semen. The taurine in your can is made in a *lab."),
    ("thai",    "The drink came from Thailand. In {1976|nineteen seventy six}, a Thai drink with a red bull on the label was sold to truck drivers on night shifts."),
    ("austria", "An Austrian marketing man tried it to fight jet lag. In {1987|nineteen eighty seven}, he launched his own version in Austria."),
    ("cans",    "Last year his company sold almost *fourteen *billion cans."),
    ("caff",    "A small can has about as much caffeine as a cup of coffee. A big one has two."),
    ("sugar",   "Plus almost *seven teaspoons of sugar."),
    ("ban",     "From April {2027|twenty twenty seven}, England will ban selling them to anyone under *sixteen."),
    ("end",     "So a molecule named after bull bile, from a drink for Thai truckers, now sells fourteen billion cans a year."),
    ("end2",    "Somewhere, a bull is still waiting for his *royalties."),
]}

# Табак приручил людей (пилот v4, RU, 08.11 ночь): Родриго де Херес — первый европейский курильщик, по легенде инквизиция
#   посадила его на 7 лет, а когда вышел, курили уже повсюду (Wikipedia; сроки в источниках разные — «по легенде»).
#   Жан Нико, посол в Лиссабоне, 1560 — табачный порошок Екатерине Медичи от мигрени (её или сына — по-разному), мода
#   на нюхательный табак при дворе. Россия: при Михаиле Фёдоровиче табак — «чёртово зелье», Соборное уложение 1649 —
#   батоги, рвать ноздри, ссылка; указ Петра I от февраля 1697 разрешил продажу, с торговли брали пошлину.
#   Табак выращивают больше чем в 100 странах (ФАО, > 120); пользователей табака ~1,2 млрд (ВОЗ); > 7 млн смертей в год.
S['tabak'] = {'ru': [
    ("title",    "Что вы знаете о *табаке?"),
    ("leaf",     "Что это растение, из которого делают сигареты?"),
    ("claim",    "А знаете ли вы, что пятьсот лет назад табак *приручил людей?"),
    ("poison",   "Сначала он научился делать яд. Никотин парализует насекомых, и листья табака остаются *целыми."),
    ("columbus", "В {1492|тысяча четыреста девяносто втором} году моряки Колумба увидели на Кубе, как местные вдыхают дым из свёрнутых *листьев."),
    ("jerez",    "Один моряк, Родриго де Херес, привёз эту привычку домой. По легенде, соседи испугались дыма изо рта, и инквизиция посадила его на *семь *лет."),
    ("jerez",    "Когда он вышел, курила уже вся *Испания."),
    ("queen",    "В {1560|тысяча пятьсот шестидесятом} году посол Жан Нико отправил табак французской королеве Екатерине Медичи. Как лекарство от *мигрени."),
    ("queen",    "И нюхать табак стало *модно при дворе."),
    ("russia",   "В России табак назвали «чёртовым зельем». По Соборному уложению {1649|тысяча шестьсот сорок девятого} года курильщикам рвали *ноздри."),
    ("peter",    "А Пётр Первый в {1697|тысяча шестьсот девяносто седьмом} году разрешил табак, и казна получила новый *доход."),
    ("farms",    "Сегодня люди сажают табак больше чем в ста странах. Поливают, удобряют и травят ради него насекомых. Тех самых, от которых он защищался *сам."),
    ("users",    "Больше миллиарда человек каждый день платят ему *дань."),
    ("toll",     "А он забирает больше семи миллионов жизней в год."),
    ("end",      "Насекомых табак отпугнул. А людей *приручил."),
    ("end2",     "Признайтесь, вам сейчас тоже захотелось *затянуться."),
]}

EPISODES = {f'{ep}-{lang}': lines for ep, by in S.items() for lang, lines in by.items()}


def parse(s):
    """→ (spoken_text, [ {d: показ, sp: [озвученные слова], c: ''|'y'|'r'} ])"""
    out, spoken = [], []
    for m in re.finditer(r'\{([^|}]*)\|([^}]*)\}([.,?!…»]*)|(\S+)', s):
        if m.group(4) is not None:
            w = m.group(4)
            c, lead = '', ''
            if w[:1] in "'\"“«" and len(w) > 1 and w[1] in '*!':
                lead, w = w[0], w[1:]
            if w.startswith('*'):
                c, w = 'y', w[1:]
            elif w.startswith('!'):
                c, w = 'r', w[1:]
            w = lead + w
            if w in ('—', '–'):
                spoken.append(w)
                continue
            out.append({'d': w, 'sp': [w], 'c': c})
            spoken.append(w)
        else:
            d, sp, pu = m.group(1), m.group(2).split(), m.group(3)
            sp[-1] += pu
            out.append({'d': d + pu, 'sp': sp, 'c': 'y'})
            spoken += sp
    text = ' '.join(spoken)
    text = re.sub(r'\s+([.,?!])', r'\1', text)
    return text, out


def shown(s):
    """Текст для ElevenLabs и описания: как на экране, без разметки (тире и кавычки на месте)."""
    s = re.sub(r'\{([^|}]*)\|[^}]*\}', r'\1', s)
    return re.sub(r'(^|\s|[«"\'“])[*!](?=\S)', r'\1', s)


BAD = [r"\bnot just\b", r"\bnot only\b", r"\bisn't (just )?about\b", r"\bhere's the\b", r"\bturns out\b",
       r"\bin other words\b", r"\blet that sink\b", r"\bplot twist\b", r"\bthe real\b", r"\bне просто\b",
       r"\bне только\b", r"\bна самом деле\b", r"\bвот в чём\b"]

if __name__ == '__main__':
    import sys
    for ep in (sys.argv[1:] or EPISODES):
        n = 0
        for k, s in EPISODES[ep]:
            t, o = parse(s)
            n += len(t.split())
            for b in BAD:
                if re.search(b, t, re.I):
                    print('!! ШАБЛОН НЕЙРОНКИ', ep, k, b, '|', t)
        print(f'{ep:14s} слов: {n:3d}  ≈ {n / 2.45:4.0f} с')
