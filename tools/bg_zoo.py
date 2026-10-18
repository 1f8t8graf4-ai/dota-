# Фоны «как меню Planet Zoo» (13.9.19, Андрей: «лежали тигры, умывались, сзади ходили и плавали рыбки и черепахи — переделай все промты на этот лад»).
# Каждый фон — живая сцена без события: в центре крупно ЖИВОТНОЕ из фильма, которое спокойно живёт (умывается, дышит, водит ушами),
# сзади — второй слой жизни (рыбы, птицы, пар, дым), место — из сцены, 2–4 узнаваемых предмета. Камера стоит, 8 секунд, петля.
# Почему животные: видео-нейронки рисуют их живыми и правдоподобными, а «предмет сам двигается» — их главный брак (сыр у Клава, ручка у Волка).
# Запуск из корня dota-: python3 tools/bg_zoo.py  → фоны-промты-ЖИВЫЕ.txt + .json;  python3 tools/bg_zoo.py page <выход.html> — страница для телефона.
import html,json,sys

RULES=[
 ('Главный — живое животное','В центре, крупно и в фокусе — зверь или птица, связанные с фильмом. Он не уходит из кадра: лежит, сидит, плавает на месте и делает 2–3 мелких «живых» движения — умывается, водит ушами, моргает, дышит, вертит головой, чистит перья.'),
 ('Сзади — второй слой жизни','Как рыбы и черепахи за тиграми: за главным героем — ещё что-то живое или природное (рыбы, птицы, пар, дым, вода, листья), не в фокусе.'),
 ('Место и предметы — из сцены','2–4 предмета, по которым фанат узнаёт фильм. Предметы стоят на месте: двигаются только живые и природное.'),
 ('Без события','Как в меню игры: просто живёт. Ничего не взрывается, не гаснет, не падает. Поэтому петля сходится и смотреть можно бесконечно.'),
 ('Камера стоит','Без наездов и проездов: фон за кнопками не должен качать глаз. Малая глубина резкости — главное чётко, остальное мягко.'),
 ('Без людей и текста','Ни лиц, ни рук, ни надписей, ни логотипов, ни чёрных полос.'),
 ('Деньги — мелко или в тени','Крупные купюры у нейронок выходят игрушечными.'),
]

TAIL=('8 seconds, one continuous locked-off shot, vertical 9:16, photorealistic live-action, cinematic, natural motion, calm and unhurried — '
      'like a living background behind a game menu. Only the animals and natural elements move; every object stays still. '
      'The animal stays in the same spot the whole time and ends in the same pose it starts in, so the clip loops seamlessly. '
      'No people, no hands, no text, no logos, no letterbox bars, no film frame borders.')

# n, вид (main — главный фон за весь фильм, scene — фон сцены), название, файл, куда, животное (рус), почему (рус), промт по частям
Z=[
dict(n=1,kind='main',name='«Волк с Уолл-стрит» — главный',file='волк главный',where='wolf-of-wall-street/film-bg.mp4 (+ wolf-lunch-de)',
 hero='Серый волк лежит на ковре у стола, умывает лапу, водит ушами; сзади на столе плавает золотая рыбка, на экранах тикают зелёные котировки.',
 why='Волк — это сам Джордан, «Волк с Уолл-стрит». Рыбку ты похвалил — она осталась сзади. Countach, шампанское и котировки — узнаётся с первого взгляда.',
 set='the trading floor of a 1990s Long Island brokerage firm at night after a wild office party, nobody left',
 cam='low angle at carpet level, 35mm lens, shallow depth of field',
 hero_en='a large grey wolf with thick fur lies on the plush carpet in front of the nearest desk, head up, calm; it slowly licks one front paw, its ears turn toward a sound, it blinks and breathes',
 back='on the desk right behind the wolf, a round fishbowl with one orange goldfish swimming lazy circles, waving its fins; beyond, rows of empty desks with boxy beige monitors whose columns of small green numbers flicker as prices tick up',
 obj='a small white scale model of a 1980s Lamborghini Countach and an unlabeled champagne bottle with a half-full glass on the desk; confetti on the carpet',
 light='one warm brass desk lamp and the cold green glow of the screens',grade='gold and green; excess, after the party',
 sfx='soft breathing of the wolf, the hum of computers, a faint ticker click'),
dict(n=2,kind='scene',name='«Волк» — обед с Ханной (и DE «Ланч»)',file='волк ханна',where='wolf-of-wall-street/bg.mp4 (+ wolf-lunch-de)',
 hero='Аквариум с живыми омарами у столика: омары шевелят усами и клешнями; на столе мартини и дымит сигарета, в воде бегут пузырьки.',
 why='Дорогой ресторан 1987-го на Манхэттене, где Ханна учит «фугази». Аквариум с омарами — знак дорогого ресторана тех лет, а на столе мартини и сигарета, как у Ханны.',
 set='an expensive 1987 Manhattan restaurant high in a skyscraper at lunch, a table for two by the window, both chairs empty',
 cam='eye level just above the table, 50mm lens, shallow depth of field',
 hero_en='beside the table, a glass lobster tank lit from inside; two big dark-blue lobsters rest on the gravel, slowly waving their long antennae and opening and closing their claws; tiny bubbles rise from an air stone',
 back='on the table in front, a classic martini with three olives and a crystal ashtray with one burning cigarette, its smoke curling up in a thin ribbon; a glass of sparkling water with rising bubbles; the hazy Manhattan skyline soft through the window',
 obj='a starched white tablecloth, a low vase of yellow flowers, a silver cocktail shaker beaded with condensation',
 light='bright soft daylight from the window and the cool glow of the tank',grade='cream, silver and soft blue; rich, cynical lunch',
 sfx='bubbling tank, quiet restaurant murmur, clink of ice'),
dict(n=3,kind='scene',name='«Волк» — швейцарский банк',file='волк банк',where='wolf-swiss-bank/bg.mp4',
 hero='Морская черепаха медленно парит в стене-аквариуме за столом банкира, вокруг тропические рыбки; на столе ключ от ячейки и эспрессо.',
 why='Женева, где Джордан прячет деньги. Аквариум был и в старом фоне — теперь в нём черепаха, как в твоём Planet Zoo.',
 set='a private banker\'s office in Geneva on a sunny afternoon, empty, polite and quietly dangerous',
 cam='eye level from the client\'s armchair, 35mm lens, the aquarium in the center',
 hero_en='behind the desk, a huge backlit wall aquarium; a green sea turtle hovers in the middle, slowly beating its flippers, turning its head, gliding a little left and back',
 back='schools of small yellow and blue tropical fish drift around the turtle between coral; through a side window, the tall white plume of the Geneva lake fountain sways in the wind',
 obj='a polished dark wooden desk with a closed black leather folder, a small brass safe-deposit key and a white espresso cup with a thin wisp of steam',
 light='warm afternoon sun and the turquoise glow of the aquarium',grade='warm brown, brass and turquoise; discreet and expensive',
 sfx='soft aquarium bubbling, distant fountain'),
dict(n=4,kind='scene',name='DE «Первое свидание с Наоми»',file='волк наоми',where='wolf-naomi-de/bg.mp4',
 hero='Пара неразлучников в латунной клетке у окна ресторана чистит друг другу пёрышки; на столе свеча, розы и снятое обручальное кольцо.',
 why='Свидание, которое «точно не дружба», — неразлучники говорят то же самое. Кольцо на скатерти — Джордан ещё женат.',
 set='a dim cozy Italian restaurant in early 1990s New York at night, a table for two, empty',
 cam='eye level across the table, 50mm lens, shallow depth of field',
 hero_en='on a stand by the window, an antique brass birdcage with two green-and-peach lovebirds sitting close together on a perch, gently preening each other\'s feathers, shuffling, tilting their heads',
 back='in front, a small white candle flickers on the table, its light dancing on a glass of red wine and a low vase of pink roses; the dark night street beyond the window',
 obj='a white tablecloth with a plain gold wedding band lying flat between the glasses, a cream table lamp glowing warm',
 light='warm table lamps and candlelight, soft darkness around',grade='warm amber and dark red; flirty and a little guilty',
 sfx='soft chirps of the lovebirds, quiet piano far away'),
dict(n=5,kind='main',name='«Клан Сопрано» — главный',file='сопрано главный',where='sopranos-s01e01/film-bg.mp4 (+ sopranos-mahaffey-de)',
 hero='Утки в бассейне Тони на рассвете: селезень и утка плавают и чистят перья, за ними утята; на шезлонге — халат и сигара.',
 why='Утки — сердце сериала: Тони кормил их у бассейна, они улетели — и начались панические атаки (первая серия). Это и есть «тигры» Сопрано. Если всё же хочешь лавку Сатриале — ниже запасной вариант.',
 alt='Запасной (Сатриале): тротуар у мясной лавки на рассвете, голуби клюют крошки у столика в клетку, в витрине розовая неоновая свинья.',
 set='the backyard swimming pool of a big New Jersey suburban house at early dawn, nobody around',
 cam='low angle at the edge of the pool, 50mm lens, shallow depth of field',
 hero_en='a pair of wild mallard ducks float on the calm pool water in the center — the green-headed drake and the brown female — slowly paddling, dipping their beaks, preening their wings; three small ducklings paddle behind them',
 back='soft ripples spread across the blue water; a thin morning mist drifts over the surface; behind, the dark lawn, tall trees and the lit kitchen window of the house',
 obj='a white lounge chair with a folded white bathrobe, a cigar resting in a heavy glass ashtray with a thin line of smoke and a newspaper in a plastic bag',
 light='cold blue dawn and warm yellow light from the kitchen window',grade='cold blue-green and warm yellow; peaceful, fragile, family',
 sfx='soft quacking, water lapping, early birds'),
dict(n=6,kind='scene',name='«Сопрано» — первый приём у Мелфи',file='сопрано мелфи',where='sopranos-s01e01/bg.mp4',
 hero='На подоконнике снаружи сидит воробей, чистит перья и вертит головой; внутри — два кресла друг напротив друга, лампа, салфетки.',
 why='Первый приём Тони — тишина и неловкость. Птица за стеклом — тот самый взгляд в окно, когда не хочется говорить.',
 set='a psychiatrist\'s office in 1999 on a late afternoon, empty',
 cam='eye level, 35mm lens, the window and the two chairs in the center, shallow depth of field',
 hero_en='on the outside sill of the window, seen through half-open blinds, a small brown sparrow sits and preens its feathers, fluffs up, hops once and turns its head toward the room',
 back='green tree branches sway gently behind the sparrow; leaf shadows drift slowly across the two armchairs; dust motes float in the lamp light',
 obj='two armchairs facing each other with a low table holding a box of tissues and a glass of water; a floor lamp with a fabric shade; dark wood bookshelves',
 light='warm floor lamp and soft daylight through the blinds',grade='walnut brown and olive green; quiet and tense',
 sfx='faint birdsong outside, a clock ticking'),
dict(n=7,kind='scene',name='«Сопрано» — праздник святого (S06E09)',file='сопрано праздник',where='sopranos-s06e09/bg.mp4',
 hero='Голуби клюют сахарную пудру и крошки пончиков у постамента святого; ленты с приколотыми долларами колышутся, гирлянды мерцают.',
 why='Уличный праздник в Нью-Джерси из серии: статуя с деньгами на лентах, пончики, колесо обозрения. Голуби на празднике — живее не бывает. Текст места — твой похваленный.',
 set='an Italian-American church street festival in New Jersey at dusk, the street empty',
 cam='slightly low angle, 85mm lens, background in soft bokeh',
 hero_en='on the pavement in front of the decorated wooden platform, four grey pigeons peck at powdered sugar and pastry crumbs, bob their heads, puff their chests, one ruffles its wings',
 back='behind them, a life-size painted wooden statue of a robed saint with long white satin ribbons hanging from its shoulders, small folded dollar bills pinned along them; the ribbons sway gently in the evening breeze; strings of colored bulbs twinkle above; a Ferris wheel turns slowly far behind',
 obj='a closed food stand with a tray of powdered-sugar pastries, an old stone church',
 light='warm bulbs against a deep blue evening sky',grade='warm festive bokeh, nostalgic',
 sfx='pigeons cooing, distant festival music'),
dict(n=8,kind='scene',name='«Сопрано» — «Где моя арка?»',file='сопрано арка',where='sopranos-arc/bg.mp4',
 hero='Маленькая серая акула плавает в домашнем аквариуме Кристофера, вокруг рыбки; на столе печатная машинка, сигарета, кассеты.',
 why='Кристофер пишет сценарий о мафии и рассуждает про акул, которые «разбиваются». Акула в аквариуме — та самая пасхалка.',
 set='a small New Jersey apartment at night, late 1990s',
 cam='table-height medium shot, 35mm lens, shallow depth of field',
 hero_en='against the wall, a glowing home aquarium; one small grey reef shark glides slowly back and forth along the glass, its tail swaying, small tropical fish drifting around it',
 back='in front, on the wooden table, a lit cigarette in an ashtray sends up a thin curl of smoke; rain drips down the dark window at the side',
 obj='an electric typewriter with a sheet of paper, a short stack of typed pages with unreadable lines, a stack of unlabeled VHS tapes, an open can of beer',
 light='one warm desk lamp and the cold blue aquarium glow',grade='cold blue and warm amber; restless late-night dreaming',
 sfx='aquarium bubbling, rain on the window'),
dict(n=9,kind='scene',name='«Сопрано» — Ральф (S04E09)',file='сопрано ральф',where='sopranos-ralph/bg.mp4',
 hero='Гнедая скаковая лошадь Пай-О-Май в деннике ночью: жуёт сено, водит ушами, фыркает; на тюке сена дремлет кошка.',
 why='Вся серия — про Пай-О-Май: Тони любит эту лошадь, а Ральф её губит. Лошадь в деннике — самая живая и самая грустная картинка этой сцены.',
 set='a quiet wooden horse stable at night',
 cam='eye level at the open stall door, 50mm lens, shallow depth of field',
 hero_en='in the stall, a beautiful dark bay racehorse mare stands calmly, slowly chewing hay from a rack, flicking her ears, blinking, breathing out softly through her nostrils, shifting her weight once',
 back='on a hay bale in the corridor, a tabby barn cat dozes, its tail tip flicking; dust floats in the light; moths circle the lamp',
 obj='a leather halter on a hook, a metal water bucket, scattered straw',
 light='one warm caged bulb over the stall, deep shadows around',grade='warm amber and dark brown; tender and doomed',
 sfx='horse chewing and snorting softly, crickets'),
dict(n=10,kind='scene',name='DE «Тони, Мелфи и Махаффи» (S01E01)',file='сопрано махаффи',where='sopranos-mahaffey-de/bg.mp4',
 hero='Дрозды скачут по мокрому газону под поливалкой и тянут червяков; брошенная машина с открытой дверью, разлитый кофе.',
 why='Погоня за Махаффи заканчивается на газоне офисного парка. Утро после — машина на траве, кофе разлит, а птицам всё равно.',
 set='the grass lawn of a quiet New Jersey office park on a grey morning, empty',
 cam='low angle from the grass, 35mm lens, shallow depth of field',
 hero_en='in the foreground, two American robins hop across the wet lawn, stop, tilt their heads, and one pulls a worm from the grass',
 back='a lawn sprinkler sweeps a fan of water slowly back and forth behind them; weeping willow branches sway; water droplets sparkle',
 obj='a black 1999 luxury sedan stopped crooked on the lawn with the driver\'s door open; two spilled paper coffee cups on the path',
 light='flat grey overcast morning light',grade='muted green and grey; suburban morning with an edge',
 sfx='sprinkler ticking, robins chirping'),
dict(n=11,kind='scene',name='DE «Хасиды нанимают Тони» (S01E03)',file='сопрано хасиды',where='sopranos-hasid-de/bg.mp4',
 hero='Рыжий кот спит на стойке дешёвого мотеля рядом со звонком, дышит, дёргает ухом от вентилятора; от кофе пар.',
 why='Сделка в мотеле, половину которого хотят забрать. Кот на стойке — сразу видно, что мотель дешёвый и свой.',
 set='the small front office of a cheap 1990s New Jersey roadside motel on a bright afternoon, empty',
 cam='eye level across the front desk, 35mm lens, shallow depth of field',
 hero_en='on the worn front desk counter, a big ginger tabby cat sleeps curled up next to a silver service bell, its belly rising and falling, one ear twitching in the breeze, it half-opens its eyes and closes them again',
 back='a small electric desk fan turns its head slowly; tall vertical blinds sway in its breeze, stripes of daylight moving on the wall; steam rises from a paper cup of black coffee',
 obj='a black wide-brimmed felt hat lying on the counter, one old room key on a plastic tag, a board with key hooks',
 light='flat bright daylight through the blinds and a cold fluorescent light',grade='pale blue and cold white; polite but tense',
 sfx='fan whirring, soft cat purring'),
dict(n=12,kind='scene',name='DE «Фил решает» (S06E20)',file='сопрано фил',where='sopranos-phil-de/bg.mp4',
 hero='Канарейка в клетке у кружевной занавески прыгает с жёрдочки на жёрдочку и распушает перья; над эспрессо пар.',
 why='Старое бруклинское кафе — мир Фила. Канарейка в клетке — и уют, и «птичка в клетке» перед финалом.',
 set='a small old Brooklyn café on a winter afternoon, empty',
 cam='eye level close to the table, 50mm lens, shallow depth of field',
 hero_en='by the window, a small yellow canary in a white wire cage hops between two perches, fluffs its feathers, turns its head and chirps',
 back='white lace curtains with a floral pattern billow softly from the slightly open window; a thin wisp of steam rises from an espresso cup in front',
 obj='a small round grey marble table with a white espresso cup and saucer, a glass of water, a folded white silk pocket square',
 light='pale winter daylight through the lace, a brass sconce glowing',grade='dark brown and cold white; quiet and final',
 sfx='canary chirping, street noise muffled'),
dict(n=13,kind='main',name='«Американский психопат» — главный',file='психопат главный',where='american-psycho/film-bg.mp4',
 hero='Чёрная кошка сидит на белом кожаном диване в квартире Бейтмана и умывается; на стерео прыгают индикаторы, плащ на вешалке, топор.',
 why='Пасхалка: банкомат говорит Патрику «покорми меня бродячей кошкой». Кошка в стерильной белой квартире с топором — жутко и красиво.',
 set='a minimalist white 1987 Manhattan luxury apartment at night, empty',
 cam='symmetrical eye level shot, 35mm lens, shallow depth of field',
 hero_en='on a white leather sofa in the center, a sleek black cat sits upright and calmly washes its face with a paw, licks its shoulder, its tail curling slowly, its green eyes blinking',
 back='behind, a silver stereo system with green level meters bouncing to unheard music; the Manhattan skyline twinkles through a big window',
 obj='the white floor covered with spread newspapers with unreadable print; a transparent plastic raincoat on a chrome coat stand; a fire axe with a red head leaning against the sofa',
 light='cold white ceiling light and the blue night city',grade='sterile white perfection with something wrong underneath',
 sfx='a faint bassline from the stereo, a cat purring'),
dict(n=14,kind='scene',name='«Психопат» — офис',file='психопат офис',where='american-psycho/bg.mp4',
 hero='Голубь на карнизе за окном небоскрёба чистит перья и надувает зоб; на столе плеер с наушниками, в минералке пузырьки.',
 why='Утро Бейтмана в офисе Pierce & Pierce: всё идеально и пусто. Голубь — единственное живое существо в этом кабинете.',
 set='a 1987 Wall Street corner office on a sunny morning, empty',
 cam='three-quarter view over the desk toward the window, 35mm lens, shallow depth of field',
 hero_en='on the outside ledge of the tall window, beyond half-open venetian blinds, a grey pigeon walks a step, puffs its chest, preens its wing and bobs its head',
 back='in front, a tall glass of sparkling mineral water with a lime slice, thin streams of bubbles rising; sunlit office towers behind the pigeon',
 obj='a polished dark mahogany desk, a silver portable cassette player with orange foam headphones, an open black planner with a fountain pen laid perfectly parallel',
 light='cold morning sun through the blinds, striped shadows',grade='steel grey, mahogany and white; sterile 1980s perfection',
 sfx='pigeon cooing behind glass, quiet office hum'),
dict(n=15,kind='scene',name='«Психопат» — визитки',file='психопат визитки',where='american-psycho-cards/bg.mp4',
 hero='В аквариуме переговорной плавает белая рыба-ангел цвета «слоновой кости»; на столе веером пять визиток.',
 why='«Обрати внимание на этот благородный оттенок — цвет яичной скорлупы». Рыба того же белого, что визитки, — тихая шутка.',
 set='a 1987 Wall Street boardroom on a bright afternoon, empty',
 cam='low angle across the table, 85mm lens, very shallow focus',
 hero_en='at the end of the table, a small elegant aquarium; one bone-white angelfish with long trailing fins glides slowly in place, turning gracefully',
 back='thin stripes of daylight from venetian blinds lie across the table; tiny bubbles rise in the tank',
 obj='on a glossy dark mahogany table in front, five white business cards in a neat fan, each a slightly different white (bone, eggshell, ivory), embossed lettering too small to read; a glass of water with ice beaded with condensation',
 light='a dim room, stripes of daylight',grade='dark mahogany with creamy whites; petty envy',
 sfx='soft aquarium bubbling'),
dict(n=16,kind='main',name='«Таксист» — главный',file='таксист главный',where='taxi-driver-lonely/film-bg.mp4',
 hero='Бездомная кошка на пожарной лестнице за окном Трэвиса вылизывает лапу в красном неоне; внизу жёлтое такси в пару.',
 why='«Ночью выползают все твари» — слова Трэвиса. Кошка на мокрой лестнице — ночной Нью-Йорк его глазами. В комнате — куртка, револьвер, дневник.',
 set='a tiny cheap rented room in 1970s New York at night, empty, the open window in the center',
 cam='eye level from inside the room, 35mm lens, shallow depth of field',
 hero_en='just outside the open window, on a wet iron fire escape, a thin tabby stray cat sits and licks its paw, its fur lit by red neon, ears turning at street sounds, eyes glowing',
 back='below, a wet street with red neon and a yellow taxi parked in a cloud of white steam rising from a manhole; light rain falls',
 obj='inside on the windowsill and dresser: an open diary with blurred handwriting, a black revolver lying flat, an olive-green army jacket on a hook',
 light='one bare bulb inside and red neon from the street',grade='dirty yellow and red; lonely and tense',
 sfx='rain, distant traffic, a soft meow'),
dict(n=17,kind='scene',name='«Таксист» — «Одинокий человек Бога»',file='таксист одинокий',where='taxi-driver-lonely/bg.mp4',
 hero='Кошка свернулась на тёплом капоте такси под мелким дождём, моргает и поводит ушами; из люка валит пар, неон расплывается.',
 why='Ночная смена Трэвиса: пустая машина, дождь, пар. Коты правда греются на тёплых капотах — живое и одинокое, как он сам.',
 set='a 1970s New York yellow Checker cab parked on a dark street at night, seen from the empty back seat',
 cam='from the back seat looking through the windshield, 35mm lens, shallow depth of field',
 hero_en='on the warm hood of the cab, just beyond the wet windshield, a black-and-white stray cat lies curled up, slowly blinking, ears twitching as raindrops hit, its breath rising',
 back='raindrops run down the windshield; white steam rises from a manhole in the street; soft out-of-focus red, green and yellow neon',
 obj='the scratched plexiglass partition, an old mechanical taxi meter with a metal flag, an open diary on the front seat',
 light='only neon and street lights from outside',grade='red and green neon in darkness; insomnia and loneliness',
 sfx='rain on the roof, a distant siren'),
dict(n=18,kind='scene',name='«Таксист» — Бетси, «кофе и пирог»',file='таксист бетси',where='taxi-driver-betsy/bg.mp4',
 hero='Пара голубей на подоконнике штаба клюёт крошки пирога; внутри вентилятор треплет бумажные гирлянды, над кофе пар.',
 why='Трэвис зовёт Бетси на «кофе и пирог». Крошки пирога и голуби — смешная деталь из того же разговора.',
 set='a 1972 presidential campaign headquarters in New York on a sunny afternoon, empty',
 cam='eye level, 35mm lens, the front desk and the big window in the center, shallow depth of field',
 hero_en='on the outside windowsill of the big window, two grey pigeons peck at pie crumbs, bob their heads, one puffs up and turns around',
 back='inside, a small electric desk fan turns side to side and makes the red-white-and-blue paper bunting flutter; steam rises from a paper cup of coffee; green trees sway outside',
 obj='a slice of pie on a paper plate and a small vase of yellow flowers on the front desk, desks with typewriters and telephones; no posters and no writing',
 light='bright warm daylight',grade='warm red, white and blue; awkward 1970s hope',
 sfx='pigeons cooing, fan whirring'),
dict(n=19,kind='main',name='«Бункер» — главный',file='бункер главный',where='downfall-bunker/film-bg.mp4',
 hero='Овчарка Блонди лежит у входа в бункер, поднимает голову и водит ушами на далёкие разрывы; за ней — горящие руины Берлина.',
 why='Блонди — собака из «Бункера» и реальной истории. Живая собака на фоне руин — конец Рейха без единого символа и лица.',
 set='the ruined center of Berlin at dusk in April 1945, seen from the steps of an underground bunker exit, empty',
 cam='low angle from the bunker steps, 35mm lens, shallow depth of field',
 hero_en='on the concrete landing, a large German shepherd dog lies alert, head raised, ears turning toward distant sounds, breathing calmly, then lowering her head onto her paws',
 back='behind, burned shells of grand buildings under a red smoky sky; slow drifting smoke and floating ash; a distant orange glow pulses softly on the clouds',
 obj='on a wooden crate beside the dog, a paper map of Berlin with red and blue pencil arrows and round wire-rimmed glasses; no flags, symbols or insignia, no text',
 light='red-orange fire glow under a dark smoky sky',grade='red, black and ash grey; everything is lost',
 sfx='distant rumble, wind, the dog breathing'),
dict(n=20,kind='scene',name='«Бункер» — приказ Штайнера',file='бункер приказ',where='downfall-bunker/bg.mp4',
 hero='Щенки овчарки спят в плетёной корзине под столом с картами, один ворочается и зевает; лампа над столом чуть качается.',
 why='Правда: у Блонди в бункере родились щенки (одного назвали Вульф). Пока над картами кричат про Штайнера — внизу спят щенки.',
 set='a small concrete bunker conference room in April 1945, empty',
 cam='high angle over the table toward the floor beneath it, 35mm lens, shallow depth of field',
 hero_en='under the large map table, in a wicker basket with an old grey blanket, four German shepherd puppies sleep in a pile; one wakes, yawns, stretches a paw and snuggles back',
 back='a plain metal lamp hangs low above the table and sways very slightly, its light slowly sliding over the maps; fine dust drifts down in the light',
 obj='paper military maps of Berlin with red and blue pencil arrows, round wire-rimmed glasses on the map, grey-green concrete walls with a big wall map; no flags, symbols or insignia, no text',
 light='only the hanging lamp, grey darkness around',grade='grey concrete and sickly green light; the war is lost',
 sfx='puppies whimpering softly, distant thuds'),
dict(n=21,kind='main',name='«Титаник» — главный',file='титаник главный',where='titanic-boat/film-bg.mp4 (+ titanic-andrews-de)',
 hero='Дельфины выпрыгивают из воды у самого носа корабля на закате; на леере сидит чайка; далеко на горизонте айсберг.',
 why='Дельфины у носа — момент, когда Джек кричит «Я король мира!». Айсберг вдали — чем всё кончится.',
 set='the bow of a huge 1912 ocean liner on a calm sea at sunset, empty deck',
 cam='from the tip of the bow looking down and forward at the water, 35mm lens',
 hero_en='just below the bow, three dolphins swim alongside in the clear water, arcing up out of the waves one after another and diving back in, again and again',
 back='a white seagull sits on the railing, ruffles its feathers and turns its head; the sea glitters gold; far away on the horizon, a tall pale iceberg in thin mist',
 obj='white railings converging to the point of the bow, old wooden deck planks, black iron bollards',
 light='low golden sunset light',grade='golden-orange romance with a hint of icy blue',
 sfx='waves at the bow, dolphins splashing, a gull calling'),
dict(n=22,kind='scene',name='«Титаник» — шлюпка',file='титаник шлюпка',where='titanic-boat/bg.mp4',
 hero='Маленький пекинес, укутанный в плед, сидит в пустой шлюпке и дрожит, изо рта пар; лампы на палубе чуть мигают.',
 why='Правда: с «Титаника» в шлюпках спаслись три собачки — пекинес и два шпица. Пустая шлюпка с собачкой — прощание без единого лица.',
 set='the boat deck of a huge 1912 ocean liner at night during the sinking, empty',
 cam='eye level along the deck, 35mm lens, shallow depth of field',
 hero_en='in an empty wooden lifeboat hanging from its davits by the railing, a small Pekingese dog wrapped in a woollen blanket sits on the bench, shivering, its breath visible in the cold, ears twitching, looking around',
 back='frosty mist drifts low over the deck; round brass deck lamps glow warm against the black freezing night',
 obj='white steel walls, ropes and davits, a dropped white fur stole on the deck planks, a life jacket on the railing',
 light='warm deck lamps against the black night',grade='freezing blue night with warm failing lights',
 sfx='creaking ropes, cold wind, a small whimper'),
dict(n=23,kind='scene',name='DE «Эндрюс: корабль утонет»',file='титаник эндрюс',where='titanic-andrews-de/bg.mp4',
 hero='Корабельная кошка спит на чертеже лайнера, кончик хвоста подрагивает; лампа над столом медленно качается — корабль кренится.',
 why='По легенде на «Титанике» была корабельная кошка Дженни. Эндрюс знает, что корабль утонет, а кошка спит на его чертеже.',
 set='the chart room of a 1912 ocean liner at night, empty',
 cam='high angle over the table, 35mm lens, shallow depth of field',
 hero_en='on a large wooden table covered with a blue blueprint of the liner, a grey tabby ship\'s cat sleeps curled up, breathing slowly, the tip of its tail twitching, it lifts its head once and settles again',
 back='a brass lamp on a short chain hangs low and slowly swings, its warm light sliding across the blueprint; the water in a glass stands slightly tilted',
 obj='a gold pocket watch lying open on the blueprint, a brass ruler, a round porthole with the black night sea; no readable text',
 light='only the warm brass lamp',grade='deep blue and warm brass; calm and doomed',
 sfx='a clock ticking, the ship creaking'),
dict(n=24,kind='scene',name='DE «Мать и корсет»',file='титаник корсет',where='titanic-mother-de/bg.mp4',
 hero='Белый шпиц лежит на бархатной кушетке у иллюминатора, зевает и смотрит по сторонам; по потолку бегут блики моря.',
 why='Шпиц — из тех собачек, что спаслись с «Титаника». Роскошная каюта первого класса, корсет на ширме — сцена с матерью.',
 set='a luxurious first-class stateroom of a 1912 ocean liner on a bright morning, empty',
 cam='eye level, 50mm lens, shallow depth of field',
 hero_en='on a dark-red velvet chaise by the open porthole, a fluffy white Pomeranian lies with its head on its paws, yawns, lifts its head, looks around and wags its tail a little',
 back='rippling reflections of the sunlit sea play across the ceiling; heavy velvet curtains stir gently in the sea breeze',
 obj='a white corset with long loose laces hanging over a carved wooden screen, a dressing table with a silver hairbrush and yellow lilies',
 light='warm golden sconces and soft daylight from the porthole',grade='gold, cream and deep red; luxurious and suffocating',
 sfx='soft sea, a small dog sigh'),
dict(n=25,kind='main',name='«Во все тяжкие» — главный',file='бб главный',where='breaking-bad-pilot/film-bg.mp4 (+ bb-knocks-de)',
 hero='Пустынная черепаха жуёт цветок у ступеньки автодома, ящерица на ступеньке делает «отжимания», в небе кружат грифы.',
 why='Черепаха — из второго сезона, грифы кружат над пустыней весь сериал. Автодом, шляпа Хайзенберга, штаны на кусте — пилот.',
 set='the New Mexico desert at golden hour, nobody around',
 cam='low angle at ground level, 35mm lens, shallow depth of field, the motorhome behind',
 hero_en='in the foreground, a desert tortoise slowly chews a small yellow desert flower, lifts its head and blinks; on the metal step behind it, a small lizard does push-ups and turns its head',
 back='an old white 1980s motorhome with faded brown stripes and its door open; high above, two vultures circle slowly in the huge sky; dry grass trembles in the warm wind',
 obj='a black pork-pie hat resting on the step, a few sky-blue crystals glinting next to it, a pair of khaki pants caught on a desert shrub',
 light='low warm sun from the side, long shadows',grade='sun-baked yellow and crystal blue; ordinary on the surface, dangerous underneath',
 sfx='desert wind, insects buzzing'),
dict(n=26,kind='scene',name='«Во все тяжкие» — засада (S01E01)',file='бб засада',where='breaking-bad-pilot/bg.mp4',
 hero='Пёс лежит в тени у гаража на жаре, тяжело дышит и водит ушами; из окна второго этажа полощется занавеска — Джесси только что удрал.',
 why='Рейд Хэнка: тихая улица Альбукерке, из окна соседнего дома вылез Джесси. Сонный пёс — «ничего не случилось».',
 set='a quiet suburban Albuquerque street on a hot sunny day, nobody around',
 cam='eye level from the sidewalk, 35mm lens, shallow depth of field',
 hero_en='in the shade of a driveway in front of a one-story sage-green house, a big yellow mixed-breed dog lies panting, tongue out, ears twitching at flies, blinking slowly',
 back='next door, a two-story house with an upstairs window wide open and a curtain flapping out of it in the breeze; heat haze shimmers over the asphalt; blue mountains far away',
 obj='a parked dark car at the curb with aviator sunglasses on the dashboard',
 light='harsh midday sun',grade='bleached sun with a yellow-green tint; dull and hot',
 sfx='cicadas, the dog panting'),
dict(n=27,kind='scene',name='«Во все тяжкие» — Гас',file='бб гас',where='breaking-bad-gus/bg.mp4',
 hero='За стеклом закусочной воробьи клюют картошку фри на столике веранды; внутри крутятся потолочные вентиляторы, в коле пузырьки.',
 why='Закусочная с курицей Гаса: слишком чисто, слишком вежливо. Внутри ни души, снаружи птицы доедают за гостями.',
 set='an empty fast-food fried chicken restaurant in Albuquerque at closing time, nobody inside',
 cam='eye level from inside toward the big window, 35mm lens, shallow depth of field',
 hero_en='just outside the big window, on a patio table, three house sparrows hop around a spilled carton of fries, peck, flutter their wings and squabble',
 back='inside, ceiling fans turn slowly; on the nearest table a paper cup of diet cola with a straw, bubbles rising; red pendant lamps hang low',
 obj='blue-and-white walls, red vinyl booths, light wooden tables; no logos and no signs',
 light='bright flat fluorescent light and warm red pendants',grade='too clean, too polite, quietly menacing',
 sfx='fans humming, sparrows chirping behind glass'),
dict(n=28,kind='scene',name='«Во все тяжкие» — подпол, «Где деньги?»',file='бб подпол',where='breaking-bad-knocks/bg.mp4',
 hero='Мышь обнюхивает пачку денег в плёнке в подполе, шевелит усами и умывается; голая лампочка чуть качается.',
 why='«Где деньги?» — денег почти не осталось, кроме двух пачек, и их нюхает мышь. Уолт смеётся в этом подполе.',
 set='a crawl space under a suburban Albuquerque house at night',
 cam='looking down through an open square floor hatch, 35mm lens, shallow depth of field',
 hero_en='on the dirt floor next to a small bundle of cash wrapped tight in clear plastic, a small brown mouse sniffs around, sits up, twitches its whiskers and washes its face with its paws',
 back='one bare light bulb on a cord sways very slightly, shadows of wooden joists slowly shifting; dust floats in the light',
 obj='torn clear plastic sheeting, empty black plastic bags, pink insulation between the joists',
 light='only the bare bulb, deep black around',grade='harsh yellow and deep black; empty and unhinged',
 sfx='a faint mouse squeak, the bulb buzzing'),
dict(n=29,kind='scene',name='DE «Ich bin die Gefahr» (S04E06)',file='бб спальня',where='bb-knocks-de/bg.mp4',
 hero='Мотылёк кружит у ночника в спальне Уайтов, за окном на стекле сидит геккон; тюль колышется, над кружкой пар.',
 why='Спальня, где Уолт говорит «Я тот, кто стучит». Тихий ночник — и тревога. Гекконы на окнах — обычное дело в Нью-Мексико.',
 set='a suburban Albuquerque bedroom at night, empty',
 cam='eye level from a corner of the room, 35mm lens, shallow depth of field',
 hero_en='a pale moth flutters in slow circles around a bedside lamp with a pleated shade; on the outside of the dark window glass, a small gecko clings, slowly moving its head and licking its eye',
 back='sheer curtains sway gently in a night breeze; steam rises from a white coffee mug',
 obj='a closed white bedroom door with a brass knob, a wooden chest of drawers with a small picture frame turned away, a bed with floral pillows',
 light='the warm bedside lamp, everything else in shadow',grade='warm beige turning into menace',
 sfx='crickets outside, a soft moth flutter'),
dict(n=30,kind='scene',name='DE «Майк и ноутбук Гаса» (S05E01)',file='бб майк',where='bb-mike-de/bg.mp4',
 hero='Краснохвостый канюк сидит на столбе у пыльной машины, чистит перья и вертит головой; сухая трава гнётся на ветру.',
 why='Пустыня Майка: машина с открытой дверью, ключи и револьвер на капоте, ноутбук в пыли. Канюк — такой же спокойный охотник, как Майк.',
 set='the empty New Mexico desert at harsh midday, nobody around',
 cam='low angle from the dirt road, 35mm lens, shallow depth of field',
 hero_en='on a weathered wooden fence post in the foreground, a red-tailed hawk perches, preens its chest feathers, turns its head sharply and settles',
 back='a dusty dark-maroon 1980s sedan with its door open; dry grass bends in the hot wind; dust drifts low over the ground; heat haze over the road',
 obj='a ring of car keys and a black revolver on the car hood, a closed black laptop lying in the dust',
 light='harsh yellow midday sun',grade='dusty yellow and black; tired and dangerous',
 sfx='wind, a distant hawk cry'),
dict(n=31,kind='main',name='«Павел Дуров» — главный',file='дуров главный',where='durov-tucker/film-bg.mp4',
 hero='Два голубя на подоконнике над Невским среди бумажных самолётиков: воркуют, чистят перья; белые ночи, внизу огни.',
 why='Самолётик — логотип Telegram, а голуби — живая почта Петербурга. Из этого окна Дуров пускал самолётики из купюр.',
 set='a tall open window high up in an old Art Nouveau building in the center of St. Petersburg during the white nights, the room empty',
 cam='eye level at the windowsill, 35mm lens, shallow depth of field',
 hero_en='on the wide stone windowsill, two grey pigeons sit among paper airplanes; one coos and puffs its chest, the other preens its wing; they shuffle but stay',
 back='a sheer white curtain sways in the breeze; far below, a wide old avenue with tiny glowing street lamps and a cathedral with a long curved colonnade under a pale blue-pink sky',
 obj='a neat row of paper airplanes folded from orange-red banknotes, one plain white paper airplane in the center',
 light='the pale white-night sky and warm street lamps below',grade='pale blue, white and soft orange; young and free',
 sfx='pigeons cooing, distant city'),
dict(n=32,kind='scene',name='«Дуров» — у Такера Карлсона',file='дуров такер',where='durov-tucker/bg.mp4',
 hero='Сокол в клобучке на деревянной присаде в студии Дубая: поворачивает голову, переступает, распушает перья.',
 why='Интервью снимали в Дубае, а соколиная охота — символ Эмиратов. Два кресла и вода — разговор вот-вот начнётся.',
 set='an elegant interview room in a high-rise in Dubai on a bright day, empty, two chairs ready for a conversation',
 cam='wide symmetrical shot, 35mm lens, shallow depth of field, the falcon in the center',
 hero_en='on a wooden falconry perch between the two chairs, a peregrine falcon wearing a leather hood turns its head, shifts its feet, ruffles and smooths its feathers',
 back='soft daylight glows through closed light-wooden blinds; a large green plant sways slightly in the air-conditioning',
 obj='two black armchairs facing each other with a small round table holding two glasses of water and one folded white paper airplane',
 light='soft dim daylight through the blinds',grade='dark wood, black and white marble; calm and serious',
 sfx='quiet air-conditioning, feathers rustling'),
dict(n=33,kind='main',name='«Clavicular» — главный',file='клав главный',where='clavicular-impaulsive/film-bg.mp4',
 hero='Ара на жердочке у зеркала с лампочками в ванной Майами: чистит перья, кивает головой; на столе лёд, молоток, дермароллер.',
 why='Станция лукмаксинга: всё про внешность. Ара — самая яркая и самовлюблённая птица, и она тоже любуется в зеркало.',
 set='the bathroom of a Miami high-rise apartment at night, turned into a looksmaxxing station, empty',
 cam='eye level facing the vanity, 35mm lens, shallow depth of field',
 hero_en='on a perch beside the big mirror framed with round bulbs, a scarlet macaw preens its long red and blue feathers, bobs its head, and looks at its own reflection',
 back='a small window with Miami towers, palm trees swaying and pink-purple neon; the ring light glows softly',
 obj='on the white marble counter: a derma roller, a glass bowl of ice cubes, a small steel hammer, skincare bottles with no labels, a smartphone on a tripod; a black polo with black sunglasses on a hook',
 light='warm mirror bulbs and pink city glow',grade='clinical white and hot pink; obsession with the mirror',
 sfx='macaw clicks, distant city'),
dict(n=34,kind='scene',name='«Clavicular» — подкаст Impaulsive',file='клав подкаст',where='clavicular-impaulsive/bg.mp4',
 hero='Мини-пиг спит на кремовом диване студии подкаста, сопит и дёргает ухом; на столе цветные бутылки, микрофоны.',
 why='У Логана Пола, ведущего Impaulsive, была мини-свинка Перл — она появлялась в его видео. Студия после записи, свинья на диване.',
 set='a big podcast studio right after recording, empty',
 cam='wide shot from a corner, 35mm lens, shallow depth of field',
 hero_en='on one of the cream-colored couches, a small pink mini pig sleeps on a cushion, its side rising and falling, snout twitching, one ear flicking, it shifts and sighs',
 back='black microphones on boom arms; condensation beads slide down cold bottles; the warm studio lights glow on the wooden plank wall',
 obj='a low walnut coffee table with a row of unlabeled sports drink bottles (ice blue, orange, pink, purple) and a smartphone; no logos, no text',
 light='warm studio lights',grade='warm wood and cream; loud and confident',
 sfx='a soft piggy snore, studio hum'),
dict(n=35,kind='scene',name='«Clavicular» — 18+, клуб',file='клав клуб',where='clavicular-18/bg.mp4',
 hero='Медузы пульсируют в подсвеченном аквариуме-стене VIP-ложи в розовом неоне; на столике шампанское, вокруг дымка и диско-шар.',
 why='VIP-ложа клуба в Майами в 4 утра. Медузы в аквариуме — реальная фишка дорогих клубов и гипнотизируют на петле.',
 set='a VIP booth of a Miami nightclub at 4 a.m. at closing time, empty',
 cam='eye level from the low table, 35mm lens, shallow depth of field',
 hero_en='behind the curved black velvet booth, a tall cylindrical aquarium lit pink and violet; a dozen moon jellyfish pulse slowly up and drift down in the water',
 back='a mirrored disco ball turns slowly and its light spots crawl over the walls; light haze drifts; bubbles rise in two half-empty champagne glasses',
 obj='a silver ice bucket with an unlabeled champagne bottle, a smartphone glowing face up, scattered confetti',
 light='pink and red neon and the glowing tank',grade='hot pink and red in darkness; the party is over',
 sfx='muffled bass from another room, ice settling'),
dict(n=36,kind='scene',name='«Clavicular» — бургер без сыра',file='клав бургер',where='clavicular-burger/bg.mp4',
 hero='Французский бульдог сидит у столика и не сводит глаз с бургера без сыра, облизывается, наклоняет голову; от котлеты пар.',
 why='Клав объясняет, почему бургер без сыра. Бульдог, который смотрит на бургер, — смешно, живо и понятно без слов.',
 set='the low wooden coffee table of a podcast studio right after recording, empty',
 cam='close at table height, 50mm lens, shallow depth of field, the burger and the dog in the center',
 hero_en='on the floor beside the table, a fawn French bulldog sits and stares at the burger, licks its lips, tilts its head left and right, ears twitching, breathing',
 back='steam rises from the hot beef patty; out of focus behind, cream couches and black microphones',
 obj='a plain hamburger on an open paper wrapper — only bun, beef patty and bun, no cheese; one slice of yellow cheese pushed aside; a paper cup with a straw',
 light='warm studio lights',grade='warm brown, ketchup red and cream; a little absurd',
 sfx='dog snuffling, studio hum'),
dict(n=37,kind='scene',name='«Clavicular» — ставки',file='клав ставки',where='clavicular-bets/bg.mp4',
 hero='Чёрная кошка сидит у ноутбука и следит за линией графика, наклоняет голову и бьёт хвостом; рядом судейский молоток и фишки.',
 why='Интернет ставит, сядет ли Клав. Кошка, которая следит за графиком, — как зритель ставки.',
 set='the dark coffee table of a podcast studio late at night, empty',
 cam='eye level from the table edge, 35mm lens, shallow depth of field',
 hero_en='next to an open laptop, a sleek black cat sits and watches the screen, its head tilting as a glowing line chart slowly draws itself, its tail swishing, its eyes reflecting the green and red glow',
 back='out of focus behind, cream couches and black podcast microphones in dim warm light',
 obj='a small wooden judge\'s gavel lying on its side, a short stack of red and green poker chips; the chart has no numbers and no text',
 light='the cool glow of the laptop and dim warm studio lights',grade='green and red glow in a dark studio; tense and risky',
 sfx='laptop fan, a soft cat chirp'),
]
assert len(Z)==37 and [z['n'] for z in Z]==list(range(1,38))

def prompt(z):
    return (f"Setting: {z['set']}. Camera: locked-off static camera, {z['cam']}. "
            f"In the center, in sharp focus: {z['hero_en']}. Behind and around: {z['back']}. "
            f"Still objects: {z['obj']}. Light: {z['light']}. Grade: {z['grade']}. "
            f"{TAIL} SFX: {z['sfx']}.")

def build():
    out=[dict(n=z['n'],kind=z['kind'],name=z['name'],file=z['file'],where=z['where'],hero=z['hero'],why=z['why'],alt=z.get('alt',''),prompt=prompt(z)) for z in Z]
    json.dump(out,open('фоны-промты-ЖИВЫЕ.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
    t=['ФОНЫ «КАК В PLANET ZOO» — 37 промтов (Veo 3.1, 9:16, 8 с). Без событий: живое животное в центре + второй слой жизни сзади.','','ПРАВИЛА:']
    t+=[f'— {a}: {b}' for a,b in RULES]+['']
    for z,o in zip(Z,out):
        t+=['='*80,f"{z['n']}. {z['name']}  [{'главный' if z['kind']=='main' else 'сцена'}]",f"Файл: «{z['file']}.mp4» → {z['where']}",f"В кадре: {z['hero']}",f"Почему: {z['why']}"]
        if z.get('alt'):t.append(z['alt'])
        t+=['',o['prompt'],'']
    open('фоны-промты-ЖИВЫЕ.txt','w',encoding='utf-8').write('\n'.join(t))
    return out

FILM=[('Волк','волк'),('Сопрано','сопрано'),('Психопат','психопат'),('Таксист','таксист'),('Бункер','бункер'),('Титаник','титаник'),('Во все тяжкие','бб'),('Дуров','дуров'),('Клав','клав')]
def page(outp):
    import base64,io,os
    from PIL import Image
    e=html.escape
    def thumb(rel,w=420):
        pth=os.path.join('..','scenes',rel)
        if not os.path.exists(pth):return ''
        im=Image.open(pth).convert('RGB');im.thumbnail((w,w));b=io.BytesIO();im.save(b,'JPEG',quality=70,optimize=True)
        return 'data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()
    cards=[];films=[]
    for z in Z:
        f=next(a for a,b in FILM if z['file'].startswith(b))
        if f not in films:films.append(f)
        img=thumb(z['where'].split('/')[0]+'/cover.jpg');main=z['kind']=='main'
        cards.append(f'''<article class="mk" data-film="{e(f)}" data-kind="{z['kind']}" data-n="{z['n']}">
<div class="mk-top">{f'<img class="mk-im" src="{img}" alt="" loading="lazy">' if img else ''}<div class="mk-h"><span class="tag">{e(f)} · {'главный фон' if main else 'фон сцены'}</span><h3>{e(z['name'])}</h3><span class="fn">{e(z['file'])}.mp4</span></div></div>
<p class="in">{e(z['hero'])}</p><p class="why">{e(z['why'])}</p>{f'<p class="alt">{e(z["alt"])}</p>' if z.get('alt') else ''}
<div class="mk-act"><button type="button" class="b cp">Скопировать промт</button><button type="button" class="b ghost sh" aria-expanded="false">Показать</button><label class="done"><input type="checkbox"> Готово</label></div>
<pre class="pr" hidden>{e(prompt(z))}</pre></article>''')
    chips=''.join(f'<button type="button" class="chip" data-f="{e(f)}">{e(f)}</button>' for f in films)
    rules=''.join(f'<li><b>{e(a)}</b><span>{e(b)}</span></li>' for a,b in RULES)
    PAGE=f'''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Живые фоны</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Playfair+Display:wght@600;700&family=JetBrains+Mono&display=swap">
<style>
:root{{--bg:#f6f1e7;--panel:#fffaf1;--line:#e3d9c8;--fg:#211c15;--mute:#6f6556;--gold:#9a6b14;--gold2:#f3e6c8;--ok:#2f7a3d;--okbg:#e5f2e6;color-scheme:light}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#11100e;--panel:#191714;--line:#2c2823;--fg:#f0e8da;--mute:#a69c8e;--gold:#dcb56b;--gold2:#3a2f1c;--ok:#86c08f;--okbg:#1b2a1d;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#11100e;--panel:#191714;--line:#2c2823;--fg:#f0e8da;--mute:#a69c8e;--gold:#dcb56b;--gold2:#3a2f1c;--ok:#86c08f;--okbg:#1b2a1d;color-scheme:dark}}
.mk[hidden]{{display:none}}
*{{box-sizing:border-box}} body{{margin:0;background:var(--bg);color:var(--fg);font:15px/1.55 "Golos Text",system-ui,sans-serif}}
.w{{max-width:1100px;margin:0 auto;padding:28px 16px 64px}} h1,h2,h3{{font-family:"Playfair Display",Georgia,serif;margin:0;text-wrap:balance}}
h1{{font-size:clamp(30px,6vw,44px);line-height:1.1}} h2{{font-size:24px;margin:40px 0 10px}} h3{{font-size:18px;line-height:1.25}}
.eye{{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}} .lede{{color:var(--mute);max-width:64ch}}
.rules{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:10px 22px;list-style:none;margin:0;padding:0}}
.rules li{{border-top:1px solid var(--line);padding-top:8px}} .rules b{{display:block}} .rules span{{color:var(--mute);font-size:14px}}
.steps{{margin:0;padding-left:20px;color:var(--fg)}} .steps li{{margin:4px 0}} code{{font-family:"JetBrains Mono",monospace;font-size:12.5px;color:var(--gold)}}
.bar{{position:sticky;top:0;z-index:2;background:var(--bg);padding:10px 0;display:flex;gap:8px;align-items:center;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid var(--line);margin-bottom:12px}}
.chip{{flex:none;font:500 13px "Golos Text",sans-serif;color:var(--fg);background:transparent;border:1px solid var(--line);border-radius:999px;padding:6px 12px;cursor:pointer}}
.chip[aria-pressed="true"]{{background:var(--gold2);border-color:var(--gold);color:var(--gold)}} .prog{{flex:none;margin-left:auto;font-size:13px;color:var(--mute)}} .prog b{{color:var(--ok)}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:14px}}
.mk{{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px;min-width:0}}
.mk.is-done{{border-color:var(--ok);background:linear-gradient(var(--okbg),var(--panel) 60%)}}
.mk-top{{display:flex;gap:12px;align-items:flex-start}} .mk-im{{width:110px;aspect-ratio:16/10;object-fit:cover;border-radius:8px;flex:none;background:#000}}
.mk-h{{min-width:0;display:flex;flex-direction:column;gap:3px}} .tag{{font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}}
.fn{{font-family:"JetBrains Mono",monospace;font-size:12px;color:var(--gold);word-break:break-word}}
.in{{margin:0;background:var(--gold2);border-radius:8px;padding:7px 10px}} .why{{margin:0;color:var(--mute);font-size:14px}} .alt{{margin:0;font-size:13.5px;color:var(--gold)}}
.mk-act{{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:auto}}
.b{{font:600 13.5px "Golos Text",sans-serif;border-radius:10px;padding:9px 13px;border:1px solid var(--gold);background:var(--gold);color:#1b1408;cursor:pointer}}
.b.ghost{{background:transparent;color:var(--fg);border-color:var(--line)}} .b.ok{{background:var(--ok);border-color:var(--ok)}}
.done{{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:13.5px;color:var(--mute)}} .done input{{width:18px;height:18px;accent-color:var(--ok)}}
.pr{{margin:0;white-space:pre-wrap;word-break:break-word;font:12.5px/1.5 "JetBrains Mono",monospace;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:10px;max-height:300px;overflow:auto}}
button:focus-visible,input:focus-visible{{outline:2px solid var(--gold);outline-offset:2px}}
</style></head><body><div class="w">
<header><div class="eye">«Языки по кино» · фоны-награды</div><h1>Живые фоны, как в меню Planet Zoo</h1>
<p class="lede">Все 37 фонов в одном стиле: в центре живёт зверь или птица из фильма, сзади второй слой жизни, вокруг место и предметы из сцены. Событий нет — просто живая сцена по кругу.</p></header>
<h2>Правила</h2><ul class="rules">{rules}</ul>
<h2>Как делать</h2><ol class="steps"><li>«Скопировать промт» → Google Flow → Veo 3.1, вертикаль 9:16, 8 секунд.</li><li>Вышло криво — тот же промт ещё раз, не дописывай.</li><li>Назови файл как в карточке и положи в <code>scenes/claude/субтитры/фоны/</code> — петлю и установку делаю я.</li></ol>
<h2>37 фонов</h2>
<div class="bar" role="toolbar" aria-label="Фильтр"><button type="button" class="chip" data-f="" aria-pressed="true">Все</button><button type="button" class="chip" data-f="@main">Главные</button><button type="button" class="chip" data-f="@scene">Сцены</button>{chips}<span class="prog">готово <b id="pg">0</b> из 37</span></div>
<div class="grid">{''.join(cards)}</div></div>
<script>
(function(){{var K='bgzoo-done-v1',d={{}};try{{d=JSON.parse(localStorage.getItem(K)||'{{}}')||{{}}}}catch(_){{}}
function sv(){{try{{localStorage.setItem(K,JSON.stringify(d))}}catch(_){{}}}}
var C=[].slice.call(document.querySelectorAll('.mk'));function pg(){{document.getElementById('pg').textContent=C.filter(function(c){{return d[c.dataset.n]}}).length}}
C.forEach(function(c){{var n=c.dataset.n,cb=c.querySelector('.done input'),pr=c.querySelector('.pr'),sh=c.querySelector('.sh'),cp=c.querySelector('.cp');
 cb.checked=!!d[n];c.classList.toggle('is-done',cb.checked);
 cb.onchange=function(){{if(cb.checked)d[n]=1;else delete d[n];c.classList.toggle('is-done',cb.checked);sv();pg()}};
 sh.onclick=function(){{pr.hidden=!pr.hidden;sh.textContent=pr.hidden?'Показать':'Скрыть';sh.setAttribute('aria-expanded',String(!pr.hidden))}};
 cp.onclick=function(){{function ok(){{cp.textContent='Скопировано ✓';cp.classList.add('ok');setTimeout(function(){{cp.textContent='Скопировать промт';cp.classList.remove('ok')}},1800)}}
  function fb(){{pr.hidden=false;var r=document.createRange();r.selectNodeContents(pr);var s=getSelection();s.removeAllRanges();s.addRange(r);cp.textContent='Выделил — скопируй'}}
  try{{navigator.clipboard.writeText(pr.textContent).then(ok,fb)}}catch(_){{fb()}}}};}});
var H=[].slice.call(document.querySelectorAll('.chip'));H.forEach(function(h){{h.onclick=function(){{H.forEach(function(x){{x.setAttribute('aria-pressed',String(x===h))}});var f=h.dataset.f;
 C.forEach(function(c){{c.hidden=!!f&&(f[0]==='@'?c.dataset.kind!==f.slice(1):c.dataset.film!==f)}})}}}});pg();}})();
</script></body></html>'''
    open(outp,'w',encoding='utf-8').write(PAGE);print('страница:',outp,round(len(PAGE)/1024),'КБ')

if __name__=='__main__':
    out=build()
    if len(sys.argv)>2 and sys.argv[1]=='page':page(sys.argv[2])
    print('фоны-промты-ЖИВЫЕ.txt / .json:',len(out),'промтов; средняя длина',sum(len(o['prompt'].split()) for o in out)//len(out),'слов')
