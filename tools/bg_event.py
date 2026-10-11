# Фоны с событием (после 13.8.4; идея Андрея: «4 секунды стейбл — потом меняется»). Все 37 фонов заново, и те, что уже стоят.
# Запуск из корня dota-: python3 tools/bg_event.py → фоны-промты-СОБЫТИЕ.txt (+ фоны-промты-СОБЫТИЕ.json для страницы с копированием)
#
# Почему так:
# • Veo 3.1 понимает разметку по секундам «[00:00-00:04] … [00:04-00:05] …» (timestamp prompting — гайд Google Cloud по Veo 3.1):
#   первые 4 с спокойно (1–2 «текстурных» движения), на 4-й секунде ОДНО резкое событие из сюжета, дальше — «после».
# • Событие — пасхалка сцены: стук в дверь у «Я тот, кто стучит», шлюпку спускают у «Титаника», «и вдруг — перемена» у «Таксиста».
#   Без людей и рук (правило всех фонов), поэтому события — свет, толчок, ветер, звук-удар, предмет сам падает/катится.
# • Петля (loop): 'сама' — к концу всё как в начале, шов — обычный наплыв; 'тьма' — новое состояние держится до конца,
#   шов — короткое затемнение (tools/loop_bg.py выберет сам); 'чёрный' — резко в чёрное (как финал «Сопрано»).
# • На Главной событие каждые 8 с мельтешило бы — loop_bg.py повторяет спокойную часть, событие раз в ~12 с.
# • Формула, что сработала у Ральфа, праздника и обеда Ханны, сохранена: место из сцены, 4–6 предметов со смыслом, один свет,
#   движения только от настоящих источников, «настоящие мятые купюры». Похваленные промты (обед Ханны, праздник, Ральф) —
#   слово в слово, к ним добавлено только событие.
import json,os,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from bg_veo import P

def base(sid):
    """Похваленный промт из bg_veo.py: «Setting … Light …» и «Grade» — слово в слово (без Motion и Rules)."""
    t=next(x[2] for x in P if x[1]==sid)
    body=t.split(' Motion:')[0].strip()
    grade=t.split('Grade:')[1].split(' Rules:')[0].strip()
    return body,grade

def tail(shake):
    return ("Rules: one continuous shot with no cuts and no zoom; the camera is locked off and never moves"
            +(" except for the short shake during the event" if shake else "")
            +"; apart from the event, the lighting stays the same. Photorealistic live-action footage with real materials and "
            "real-world sizes (banknotes look like real worn paper money, never toy money); every object stands or lies naturally "
            "where it belongs, no extra objects; no people, no faces, no hands, no text, letters or logos anywhere. "
            "Vertical 9:16, full-bleed, no black bars, borders or film frame.")

def prompt(e):
    body=e['body'] if 'body' in e else f"Setting: {e['set']} Camera: {e['cam']} Objects: {e['obj']} Light: {e['light']}"
    tl=' '.join(f'[{a}] {b}' for a,b in e['t'])
    return (f"{body} Grade: {e['grade']} Timeline — one continuous locked-off shot, the same framing for all 8 seconds: {tl} "
            f"{tail(e.get('shake'))}")

# склейка в tools/loop_bg.py: сама → --seam xfade, тьма → --seam dip, чёрный → --seam black=1.2
LOOP_SEAM={'сама':'xfade','тьма':'dip','чёрный':'black=1.2'}
LOOP_RU={'сама':'петля сама: к концу всё как в начале',
         'тьма':'новое состояние держится до конца — шов сделаю коротким затемнением',
         'чёрный':'в конце резко в чёрное, как финал сериала, — чёрное добавлю сам'}

# kind: main — главный фон фильма / сериала / интервью (за весь фильм); scene — фон сцены (за всю сцену)
# where: куда встанет файл (папка сцены в репо scenes и имя), file — как назвать ролик Андрею
EV=[]
def add(**e):EV.append(e)

# ============================== ВОЛК С УОЛЛ-СТРИТ ==============================
add(grp='Волк с Уолл-стрит',kind='main',file='волк главный',where='wolf-of-wall-street/film-bg.mp4 (+ копия wolf-lunch-de)',
 title='ГЛАВНЫЙ «Волк с Уолл-стрит» — весь фильм',
 ru='Зал брокеров «Стрэттон Окмонт» ночью после вечеринки: пачки сотен, трубка снята, шампанское, игрушечная «Ламборгини» (та самая, на кваалюдах), рыбка в аквариуме (её съест Донни). На ковре — рассыпанные купюры.',
 ev='Из вентиляции бьёт поток воздуха — сотни купюр взлетают метелью над столами и медленно оседают обратно. Деньги, которые не считают.',
 loop='сама',shake=False,
 set="the trading floor of a 1990s Long Island brokerage firm at night, the morning after a wild office party, nobody left.",
 cam="low angle across the nearest desk, 28mm lens, a long aisle of desks behind it.",
 obj="on the nearest desk, in the center: thick bricks of real hundred-dollar bills in paper bands, a beige office telephone with the handset off the hook, an unlabeled champagne bottle and a half-full champagne glass, a small white toy model of a 1980s Lamborghini Countach and a round fishbowl with one orange goldfish. Behind: rows of empty desks with boxy beige monitors glowing green; loose hundred-dollar bills and confetti scattered all over the carpet.",
 light="one warm brass desk lamp and the cold green glow of the monitors.",
 grade="saturated gold and money-green; greed, excess and endless partying on other people's money.",
 t=[('00:00-00:04',"Calm: the goldfish hovers in place waving its fins, bubbles rise in the champagne glass; nothing else moves."),
    ('00:04-00:06',"A strong blast of air from the ceiling vents sweeps down the aisle: hundreds of loose hundred-dollar bills lift off the carpet and the desks and swirl up into the air like a blizzard of money. SFX: a rush of air and fluttering paper."),
    ('00:06-00:08',"The bills flutter slowly back down onto the desks and the carpet and settle; the room is calm again, as at the start.")])
add(grp='Волк с Уолл-стрит',kind='scene',sid='wolf-of-wall-street',file='волк ханна',where='wolf-of-wall-street/bg.mp4 (+ копия wolf-lunch-de)',
 title='Сцена «Марк Ханна объясняет новичку правила Уолл-стрит» (и немецкий «Ланч»)',
 ru='Тот самый светлый ресторан над Манхэттеном, который тебе зашёл: мартини один за другим, вода новичка, флакон с кокаином, котировки, счёт с сотней. Промт — слово в слово прежний.',
 ev='Начинается ритмичный стук — как Ханна бьёт себя в грудь и мычит свою «песню»: стол дрожит в такт, мартини идёт кругами, оливки подпрыгивают, пустые бокалы звякают. Потом тишина — всё как было.',
 loop='сама',shake=False,body=base('wolf-of-wall-street')[0],grade=base('wolf-of-wall-street')[1],
 t=[('00:00-00:04',"Calm: a thin thread of smoke rises only from the cigarette, one drop of condensation slides down the shaker, faint haze drifts between the skyscrapers."),
    ('00:04-00:06',"A deep, steady thumping starts, like a man pounding his chest — thump, thump, thump: the whole table trembles to the beat, the martini surface ripples in rings, the olives bob on the pick, the empty glasses rattle against each other, ash drops from the cigarette. SFX: rhythmic chest thumps and a low humming chant."),
    ('00:06-00:08',"The thumping stops; the ripples fade and the table is calm again, exactly as at the start.")])
add(grp='Волк с Уолл-стрит',kind='scene',sid='wolf-swiss-bank',file='волк банк',where='wolf-swiss-bank/bg.mp4',
 title='Сцена «Швейцарский банк: Ça dépend»',
 ru='Кабинет банкира в Женеве, как в кадре: аквариум за спиной, фонтан над озером в окне, эспрессо, швейцарский флажок. На столе — закрытый кожаный кейс.',
 ev='Замки кейса сами щёлкают, крышка подскакивает — внутри плотные пачки долларов. Зачем Джордан и прилетел в Швейцарию.',
 loop='тьма',shake=False,
 set="a private banker's office in Geneva on a sunny afternoon, empty — polite, quiet and dangerous.",
 cam="eye level from the client's armchair, 35mm lens, the desk in the center.",
 obj="a polished dark wooden desk with a closed black leather briefcase lying flat in the center, a white espresso cup on a saucer and a small Swiss flag on a desk stand; behind the desk, a large backlit wall aquarium glowing turquoise with tropical fish and coral; on the right, a floor-to-ceiling window onto Lake Geneva with the tall lake fountain shooting a white plume of water into the sky.",
 light="warm afternoon sun from the window and the turquoise glow of the aquarium.",
 grade="warm brown, gold and turquoise; discreet old money — everything has a price.",
 t=[('00:00-00:04',"Calm: the tropical fish drift slowly, the fountain plume sways in the wind, a wisp of steam rises from the espresso."),
    ('00:04-00:05',"The two brass latches of the briefcase snap open by themselves and the lid springs up: inside, tight rows of real hundred-dollar bundles. SFX: two sharp metallic clicks."),
    ('00:05-00:08',"The lid rests half open with the money in view; the fish drift, the fountain sways, the steam rises.")])
add(grp='Волк с Уолл-стрит',kind='scene',sid='wolf-naomi-de',file='волк наоми',where='wolf-naomi-de/bg.mp4',
 title='DE «Первое свидание с Наоми»',
 ru='Полутёмный итальянский ресторан, как в кадре: лампы на столах, кирпич, коктейль с соломинкой («можно соломинку?»), вино, розы. У бокала — стоит на ребре обручальное кольцо.',
 ev='Кольцо качается, катится дугой по скатерти и со звоном ложится плашмя. «Ты же женат?» — «Ну и что, женатым нельзя дружить?»',
 loop='тьма',shake=False,
 set="a dim, cozy Italian restaurant in early 1990s New York at night, the table for two empty.",
 cam="eye level across the table, 50mm lens, shallow focus.",
 obj="a small round table with a white tablecloth; a short table lamp with a cream fabric shade glowing warm; a low vase of pink roses; a cocktail glass with a white bendy straw in it and a glass of red wine; a plain gold wedding band standing upright on its edge next to the wine glass. Behind, out of focus: dark red brick walls, more little glowing table lamps and dark wooden chairs.",
 light="the warm table lamps, everything else in soft darkness.",
 grade="warm amber and dark red; a married man on a first date that is obviously not \"just friends\".",
 t=[('00:00-00:04',"Calm: reflections shimmer softly in the glasses, a drop of condensation slides down the cocktail glass."),
    ('00:04-00:06',"The wedding band tips over its edge, rolls in a small arc across the white tablecloth, wobbles and spins down flat. SFX: a thin metallic ring."),
    ('00:06-00:08',"The ring lies flat and still on the tablecloth; the reflections keep shimmering in the glasses.")])

# ============================== КЛАН СОПРАНО ==============================
add(grp='Клан Сопрано',kind='main',file='сопрано главный',where='sopranos-s01e01/film-bg.mp4 (+ копия sopranos-mahaffey-de)',
 title='ГЛАВНЫЙ «Клан Сопрано» — весь сериал',
 ru='Вся банда: столик у мясной лавки Сатриале на рассвете — тут они сидят все 6 сезонов. Клетчатая скатерть, эспрессо, сигара, газета, неоновая свинья в витрине.',
 ev='Неоновая свинья мигает и гаснет вместе со светом в лавке — и сразу резко чёрный экран, как в последней секунде сериала. Потом всё снова.',
 loop='чёрный',shake=False,
 set="the sidewalk in front of an old Italian pork store in a gritty New Jersey town at dawn, nobody around.",
 cam="eye level from the curb, 35mm lens, the café table in the center.",
 obj="a small café table with a red-and-white checkered tablecloth and four mismatched folding chairs around it; on the table, two small espresso cups, a cigar resting in a heavy glass ashtray and a rolled newspaper in a clear plastic bag. Behind: a stone shop front with a red awning; in the big shop window hang salamis and round provolone cheeses, and a pink neon outline of a smiling cartoon pig's face glows among them.",
 light="cold blue dawn on the street, warm yellow light from inside the shop and the pink glow of the pig neon.",
 grade="cold blue-grey street against warm pink and yellow; loyalty, meat, money and quiet danger — the mob crew's daily hangout.",
 t=[('00:00-00:05',"Calm: a thin thread of smoke rises only from the tip of the cigar, steam rises from one espresso cup, the pig neon hums softly."),
    ('00:05-00:06',"The pig neon flickers twice and dies with a buzz, and at the same moment the lights inside the shop go out. SFX: an electric buzz, then silence."),
    ('00:06-00:08',"The shop front stays dark, only the cold blue dawn remains on the empty table; the cigar smoke keeps rising.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-s01e01',file='сопрано мелфи',where='sopranos-s01e01/bg.mp4',
 title='Сцена «Тони на первом приёме у психотерапевта» (S01E01)',
 ru='Кабинет Мелфи на первой сессии: два кресла напротив, салфетки, торшер, картина с утками (с уток всё и началось), в приёмной — бронзовая статуя, на которую Тони пялится в начале сериала.',
 ev='Паническая атака: картинка мутнеет, края темнеют, всё плывёт, свет торшера пульсирует как сердце — Тони так и упал у бассейна. Через пару секунд всё снова чёткое.',
 loop='сама',shake=False,
 set="a psychiatrist's office in 1999 on a late afternoon, empty.",
 cam="eye level, 35mm lens, centered on the two chairs.",
 obj="dark wood-paneled walls with a bookshelf; two armchairs facing each other with a small low table between them holding a box of tissues and a glass of water; a floor lamp with a fabric shade beside one chair; on the wall, a small framed painting of two wild mallard ducks on a pond; through a half-open door at the side, the dim waiting room with a bronze sculpture of a reclining female figure on a pedestal.",
 light="the warm floor lamp and soft daylight through half-closed blinds.",
 grade="walnut brown and olive green; heavy silence, a tough man's first confession.",
 t=[('00:00-00:04',"Calm: dust specks drift in the lamp light, tree leaves move gently behind the blinds."),
    ('00:04-00:06',"A panic attack: the whole picture slowly goes soft and out of focus, the edges darken, the room seems to sway, and the lamp light pulses like a heartbeat, as if someone is about to faint. SFX: a loud, slow heartbeat."),
    ('00:06-00:08',"Everything comes back into sharp focus; the room is calm and still again, exactly as at the start.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-s06e09',file='сопрано праздник',where='sopranos-s06e09/bg.mp4',
 title='Сцена «Тони у Мелфи: аттракционы и скука» (S06E09)',
 ru='Уличный праздник святого Эльзеара (эпизод «The Ride»): статуя в лентах с приколотыми долларами, гирлянды, церковь, колесо обозрения. Промт — слово в слово тот, что дал «нихуя себе».',
 ev='Карусель на заднем плане с грохотом дёргается вперёд и встаёт — «сломался болт», как в рассказе в этой сцене. Гирлянды над улицей мигают и раскачиваются, ленты с деньгами треплет. Потом всё снова тихо.',
 loop='сама',shake=False,body=base('sopranos-s06e09')[0],grade=base('sopranos-s06e09')[1],
 t=[('00:00-00:04',"Calm: the ribbons with the pinned bills sway only slightly in a light breeze, the bulbs twinkle softly, the distant Ferris wheel turns slowly."),
    ('00:04-00:05',"In the background the carnival ride lurches violently forward with a loud bang and jolts to a stop; the strings of colored bulbs above the street flicker and swing, the ribbons with the pinned bills flap hard. SFX: a metallic bang and distant screams."),
    ('00:05-00:08',"The bulbs steady and stop swinging, the ribbons hang still again, the ride slowly starts turning once more; everything is calm, as at the start.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-arc',file='сопрано арка',where='sopranos-arc/bg.mp4',
 title='Сцена «Где моя арка?» (S01–S02)',
 ru='Квартира Кристофера ночью: пишущая машинка и стопка страниц (он пишет сценарий и ищет свою «арку»), кассеты с гангстерским кино, дождь за окном. В аквариуме кругами ходит маленькая акула («знаешь, почему акула всё время двигается?» — эпизод «Акула»).',
 ev='Молния, порыв ветра распахивает окно — страницы сценария взлетают и разлетаются по комнате. Арки так и не будет.',
 loop='тьма',shake=False,
 set="a small New Jersey apartment at night, late 1990s.",
 cam="table-height medium shot, 35mm lens.",
 obj="in the center on a wooden table, an electric typewriter with a sheet of paper in it, a short stack of typed pages beside it, an ashtray with one lit cigarette and an open can of beer; next to them, a stack of unlabeled VHS tapes of old gangster movies. Behind the table, against the wall, a glowing home aquarium where one small grey shark keeps swimming in circles among a few tropical fish. A window with rain on the glass.",
 light="one warm desk lamp and the cold blue light of the aquarium.",
 grade="cold blue and warm amber; a small-time gangster who dreams of Hollywood and wants his life to have an arc.",
 t=[('00:00-00:04',"Calm: the little shark circles the aquarium, bubbles rise from the filter, smoke rises only from the tip of the cigarette, raindrops run down the window."),
    ('00:04-00:05',"Lightning flashes white outside and a gust of wind bursts the window open: the typed pages fly up off the table and swirl through the room. SFX: a crack of thunder and a howl of wind."),
    ('00:05-00:08',"The pages flutter down and scatter across the floor, the open window swings, rain blows in; the little shark keeps circling.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-ralph',file='сопрано ральф',where='sopranos-ralph/bg.mp4',
 title='Сцена «Ральф приходит к Тони» (S04E09)',
 ru='Задний офис «Бада Бинг» — тот промт, по которому вышел твой лучший ролик, слово в слово: зелёная лампа, арифмометр, виски, телик со скачками, в двери — шест на пустой сцене.',
 ev='На телике скачки сменяются огнём — экран заливает пламя, потом рябь. В этой серии сгорит конюшня с лошадью Пай-О-Май, и Тони решит, что это Ральф.',
 loop='тьма',shake=False,body=base('sopranos-ralph')[0],grade=base('sopranos-ralph')[1],
 t=[('00:00-00:04',"Calm: the TV image flickers with the blurry horse race, the pink neon light through the door pulses slowly, smoke rises only from the tip of the cigarette."),
    ('00:04-00:05',"On the small TV the horse race suddenly turns into bright orange fire — flames fill the whole little screen and light up the desk. SFX: the crackle of a fire."),
    ('00:05-00:08',"The TV burns orange for a moment more, then cuts to grey static snow; the green lamp and the pink neon stay as they were.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-mahaffey-de',file='сопрано махаффи',where='sopranos-mahaffey-de/bg.mp4',
 title='DE «Тони, Мелфи и Махаффи» (S01E01)',
 ru='Газон офисного парка: машина криво на траве с открытой дверью, рассыпанный кофе, одна туфля — Тони «пил кофе» с Махаффи.',
 ev='Фары мигают, машина рывком прыгает вперёд, буксуя и вырывая куски дёрна, и встаёт. Так Тони и сбил должника.',
 loop='тьма',shake=False,
 set="the grass lawn of a quiet New Jersey corporate office park on a grey morning, empty.",
 cam="low angle from the grass, 28mm lens.",
 obj="a black 1999 luxury sedan with dark tinted windows stopped crooked on the lawn, its driver's door open and its engine idling, thin exhaust drifting; on the path in front of it, two spilled paper coffee cups and a crushed cardboard cup tray in a small puddle of coffee; one brown leather office shoe lying alone on the grass. Behind: a low office building with dark glass and big weeping willow trees.",
 light="flat grey overcast morning light.",
 grade="muted green and grey; a pleasant suburban morning that just turned into a beating.",
 t=[('00:00-00:04',"Calm: thin steam rises from the spilled coffee, the long willow branches sway gently, exhaust drifts from the sedan."),
    ('00:04-00:05',"The sedan's headlights flash and it lurches forward a car length with spinning wheels, tearing up chunks of turf, then brakes hard; the open door swings. SFX: an engine roar and tires ripping the grass."),
    ('00:05-00:08',"The car stands still in its new spot, clods of grass settle around it; steam keeps rising from the coffee.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-hasid-de',file='сопрано мотель',where='sopranos-hasid-de/bg.mp4',
 title='DE «Хасиды нанимают Тони» (S01E03)',
 ru='Мотель зятя: стойка со звонком, ключ на бирке, голубые стены, жалюзи, на стойке — чёрная шляпа хасида.',
 ev='По стойке бьёт удар с той стороны: звонок подскакивает и звенит, ключ слетает на пол, шляпа кувыркается, ключи на доске раскачиваются. Поли и Сильвио «уговаривают» зятя.',
 loop='тьма',shake=False,
 set="the small front office of a cheap 1990s New Jersey roadside motel on a bright afternoon, empty.",
 cam="eye level across the front desk, 35mm lens.",
 obj="a worn front desk counter with a silver service bell and one old room key on a plastic tag; a black wide-brimmed felt hat lying on the counter; behind the desk, light blue walls, a board with key hooks and tall vertical blinds glowing with daylight. No text and no signs.",
 light="flat bright daylight through the blinds and a cold fluorescent ceiling light.",
 grade="pale blue and cold white; a polite business deal that ends with a man's head pressed to the counter.",
 t=[('00:00-00:04',"Calm: the vertical blinds sway very slightly in the air from a fan, fine dust floats in the daylight."),
    ('00:04-00:05',"A violent blow hits the counter from the other side: the bell jumps and rings, the room key slides off onto the floor, the black hat tumbles over, the keys on the board swing and jingle. SFX: a heavy thud and a bell ding."),
    ('00:05-00:08',"Everything comes to rest in its new place; the keys on the board slowly stop swinging, the blinds sway.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-phil-de',file='сопрано фил',where='sopranos-phil-de/bg.mp4',
 title='DE «Фил решает» (S06E20)',
 ru='Кафе в Бруклине: кружевные занавески, эспрессо, белый платок из нагрудного кармана Фила. На стене — старые фото, в центре — семейная фотография.',
 ev='Семейное фото срывается с гвоздя, падает, стекло трескается. Здесь Фил приказывает «обезглавить» семью Сопрано.',
 loop='тьма',shake=False,
 set="a small old Brooklyn café on a winter afternoon, empty.",
 cam="eye level, 50mm lens, shallow focus on the front table.",
 obj="a small round marble table with a white espresso cup on a saucer and a little spoon resting in it, a glass of water and a folded white pocket square; behind, dark wooden walls with old framed photos — in the center, one framed black-and-white photograph of a family group — bentwood chairs and big windows with glowing lace curtains.",
 light="pale wintry daylight through the lace curtains, dark interior.",
 grade="brown and pale cream; quiet coffee, cold decision — a whole family is ordered taken out here.",
 t=[('00:00-00:04',"Calm: a thin wisp of steam rises from the espresso, the lace curtains sway very slightly."),
    ('00:04-00:05',"The framed family photograph slips off its nail, drops to the floor and its glass cracks. SFX: a sharp crash of glass."),
    ('00:05-00:08',"The frame lies on the floor under a cracked glass, an empty nail and a pale rectangle remain on the wall; the steam keeps rising from the espresso.")])

# ============================== АМЕРИКАНСКИЙ ПСИХОПАТ ==============================
add(grp='Американский психопат',kind='main',file='психопат главный',where='american-psycho/film-bg.mp4',
 title='ГЛАВНЫЙ «Американский психопат» — весь фильм',
 ru='Белая квартира Бейтмана ночью: газеты на полу, прозрачный плащ на вешалке, топор у дивана, визитки, крем для лица, стереосистема — сцена «Hip to Be Square».',
 ev='Свет щёлкает и гаснет на секунду. Включается — вешалка пустая и топора нет: он оделся и взял его. В конце свет щёлкнет ещё раз (затемнение) — и всё снова на месте.',
 loop='тьма',shake=False,
 set="a minimalist white 1987 Manhattan luxury apartment at night, empty.",
 cam="symmetrical wide shot, 28mm lens.",
 obj="the white floor covered with neatly spread newspapers with blurred unreadable print; in the center, a transparent plastic raincoat hanging on a chrome coat stand; a fire axe with a red head leaning against a white leather sofa; on a glass coffee table, a neat row of bone-white business cards and an open jar of white face cream; a silver stereo system with glowing green level meters; a big window onto the Manhattan skyline at night.",
 light="cold white ceiling light and the blue night city.",
 grade="sterile white perfection with something horribly wrong; a polite yuppie who is a monster inside.",
 t=[('00:00-00:04',"Calm: the green level meters on the stereo bounce to the music; nothing else moves."),
    ('00:04-00:05',"The ceiling light clicks off: for one second the room is dark, lit only by the blue city and the green meters. SFX: a click, the bass of the music thumps."),
    ('00:05-00:08',"The light clicks back on — the coat stand is empty and the axe is gone; everything else is exactly as before, the meters bouncing.")])
add(grp='Американский психопат',kind='scene',sid='american-psycho',file='психопат офис',where='american-psycho/bg.mp4',
 title='Сцена «Патрик Бейтман приходит в офис»',
 ru='Офис Бейтмана утром: стеклянный стол, плеер с наушниками (он в них входит), минералка с лаймом («принеси минералку»), ежедневник для брони столиков, всё строго параллельно.',
 ev='Сверху в стакан минералки падает одна тёмно-красная капля и расплывается облаком. Всё остальное идеально ровно — «что-то не так под маской».',
 loop='тьма',shake=False,
 set="a minimalist 1987 Wall Street corner office in the morning, empty.",
 cam="three-quarter view from above a glass desk, 35mm lens.",
 obj="on the glass desk, a silver portable cassette player with foam headphones, a tall glass of sparkling mineral water with a lime slice, an open black leather planner and a fountain pen laid perfectly parallel to it. Behind: tall windows with metal venetian blinds half open onto hazy office towers.",
 light="cold morning daylight through the blinds, laying thin striped shadows across the desk.",
 grade="steel blue and white; a sterile, arrogant 1980s yuppie morning with something wrong underneath.",
 t=[('00:00-00:04',"Calm: bubbles rise in the sparkling water, haze drifts slowly between the towers."),
    ('00:04-00:05',"A single drop of dark red liquid falls from above into the glass of water and blooms into a slow red cloud. SFX: one soft drip."),
    ('00:05-00:08',"The red cloud slowly curls and spreads through the water around the lime slice; everything else on the desk stays perfectly neat and still.")])
add(grp='Американский психопат',kind='scene',sid='american-psycho-cards',file='психопат визитки',where='american-psycho-cards/bg.mp4',
 title='Сцена «Визитки: чья круче»',
 ru='Пять визиток веером под узким лучом, рядом стакан виски со льдом.',
 ev='Луч прыгает на последнюю визитку — она светится теплее всех, проступает водяной знак (визитка Пола Аллена: «у неё даже водяной знак!»), лёд в стакане трескается. Потом луч возвращается.',
 loop='сама',shake=False,
 set="a dark glossy boardroom table in 1987.",
 cam="low grazing angle, 100mm macro lens, very shallow focus.",
 obj="in the center, five white business cards laid in a neat fan, each a slightly different shade of white (bone, eggshell, ivory), with embossed lettering too small and blurred to read; beside them, a crystal tumbler of whiskey with ice.",
 light="one narrow soft spotlight from above in a dark room, resting on the middle card.",
 grade="near-black with creamy whites; petty envy and status games — \"it even has a watermark\".",
 t=[('00:00-00:04',"Calm: light glints on the ice; the spotlight rests on the middle card."),
    ('00:04-00:05',"The spotlight jumps to the last card on the right: its paper glows richer and warmer than all the others and a faint watermark appears in it; the ice in the glass cracks and shifts. SFX: a sharp crack of ice."),
    ('00:05-00:08',"The last card glows in the light for a moment, then the spotlight glides slowly back to the middle card, exactly as at the start.")])

# ============================== ТАКСИСТ ==============================
add(grp='Таксист',kind='main',file='таксист главный',where='taxi-driver-lonely/film-bg.mp4',
 title='ГЛАВНЫЙ «Таксист» — весь фильм',
 ru='Каморка Трэвиса ночью: треснутое зеркало («ты мне это говоришь?»), револьвер, дневник, армейская куртка, телик с рябью, за окном — неон и такси в пару.',
 ev='В окно резко обрушивается ливень — потоки воды по стеклу, неон и такси расплываются. «Однажды придёт настоящий дождь и смоет всю эту мразь с улиц».',
 loop='тьма',shake=False,
 set="a tiny cheap rented room in 1970s New York at night, empty.",
 cam="eye level, 28mm lens, the window in the center.",
 obj="a small cracked mirror on a dingy yellow wall above an old dresser; on the dresser, all at real size: a black revolver lying flat, an open diary with blurred handwriting, aviator sunglasses and a bottle of brandy with no label; an olive-green army field jacket hangs beside the mirror; an old portable TV with grey static on the floor; the window shows a wet street with red neon and a yellow taxi parked below in a cloud of steam.",
 light="one bare bulb, the TV glow and red neon from the street.",
 grade="dirty yellow and red; a lonely insomniac talking to his mirror, violence brewing.",
 t=[('00:00-00:04',"Calm, humid night: the TV static flickers, steam drifts past the taxi outside the window."),
    ('00:04-00:05',"A real rain comes: a sudden heavy downpour hits the window — sheets of water lash against the glass. SFX: the roar of rain."),
    ('00:05-00:08',"Rain streams down the window, the red neon and the taxi blur behind the running water; the TV static keeps flickering.")])
add(grp='Таксист',kind='scene',sid='taxi-driver-lonely',file='таксист одинокий',where='taxi-driver-lonely/bg.mp4',
 title='Сцена «Одинокий человек Бога»',
 ru='Ночная смена: такси изнутри с заднего сиденья, дневник Трэвиса, счётчик, неон в мокром стекле и пар из люка.',
 ev='Ровно по тексту сцены: «дни идут с регулярностью, один за другим… и вдруг — перемена». Дворники ходят туда-сюда, как метроном, — и вдруг встают посреди стекла, а улицу заливает яркий белый свет (так он видит Бетси в белом). Свет гаснет — дворники снова пошли.',
 loop='сама',shake=False,
 set="inside a 1970s New York yellow checker cab at night, parked, seen from the empty back seat.",
 cam="from the back seat, 28mm lens, looking forward through the windshield.",
 obj="the scratched plexiglass partition, the empty driver's seat, an open diary with blurred handwriting on the front passenger seat, an old mechanical taxi meter on the dashboard with no readable numbers; through the wet windshield, a dark street glowing with soft out-of-focus red, green and yellow neon, and white steam rising from a manhole in the street.",
 light="only the neon and the street lights from outside.",
 grade="red and green neon in darkness; insomnia and loneliness — \"and then suddenly, there is change\".",
 t=[('00:00-00:04',"Regularity: the windshield wipers sweep back and forth in a slow, steady rhythm, raindrops trickle down the glass, the steam drifts — over and over, the same."),
    ('00:04-00:05',"Then suddenly there is change: the wipers stop dead in the middle of the glass, and the street outside fills with a bright, soft white light. SFX: the wipers stop, a single high note."),
    ('00:05-00:07',"The white glow lingers on the wet glass, then slowly fades back into the neon night."),
    ('00:07-00:08',"The wipers start their slow, steady rhythm again, exactly as at the start.")])
add(grp='Таксист',kind='scene',sid='taxi-driver-betsy',file='таксист бетси',where='taxi-driver-betsy/bg.mp4',
 title='Сцена «Трэвис зовёт Бетси на кофе»',
 ru='Предвыборный штаб, как в кадре: флажки, машинки, телефоны, листовки, красный ковёр; на столе Бетси — кофе и кусок пирога («кофе и пирог»).',
 ev='Вентилятор поворачивается к столу — пачка листовок взрывается в воздух и разлетается по всему штабу. «Все эти телефоны и вся эта ерунда на твоём столе — ничего не значат». Кофе и пирог стоят посреди хаоса.',
 loop='тьма',shake=False,
 set="a 1972 presidential campaign headquarters in New York on a sunny afternoon, empty.",
 cam="eye level, 35mm lens, the front desk in the center.",
 obj="red-white-and-blue paper bunting along the walls; desks with typewriters, telephones and piles of leaflets; on the front desk, a small vase of yellow flowers, a paper cup of coffee and a slice of pie on a paper plate, and a small electric desk fan; a red carpet; big windows with daylight and green trees outside. No posters and no writing.",
 light="bright warm daylight from the windows.",
 grade="warm red, white and blue; bright 1970s optimism and an awkward, hopeful invitation for coffee and pie.",
 t=[('00:00-00:04',"Calm: the desk fan turns slowly from side to side, the bunting ripples gently, steam rises from the coffee."),
    ('00:04-00:05',"The fan swings toward a pile of leaflets and a strong gust bursts them into the air: they flutter all over the room, the bunting flaps hard. SFX: a whoosh of paper."),
    ('00:05-00:08',"The leaflets drift down onto the desks and the red carpet and settle; the coffee and the slice of pie stand untouched in the center.")])

# ============================== БУНКЕР ==============================
add(grp='Бункер',kind='main',file='бункер главный',where='downfall-bunker/film-bg.mp4',
 title='ГЛАВНЫЙ «Бункер» — весь фильм',
 ru='Руины Берлина в апреле 1945-го с лестницы бункера: на ящике карта с карандашными стрелками, очки и сломанный карандаш, вокруг — горящие остовы зданий.',
 ev='Где-то в руинах рвётся снаряд: оранжевая вспышка на всё небо, кадр трясёт, углы карты подпрыгивают, мимо летят пыль и искры. Потом дым снова тянется как в начале.',
 loop='сама',shake=True,
 set="the ruined center of Berlin at dusk in April 1945, seen from the steps of an underground bunker exit, empty.",
 cam="low angle from the bunker steps, 24mm lens.",
 obj="in the foreground on a wooden crate, a paper map of Berlin with red and blue pencil arrows, a pair of round wire-rimmed glasses and a broken pencil; behind, the burned shells of grand buildings, a damaged domed government building and broken stone columns under a red smoky sky. No flags, symbols or insignia, no text.",
 light="red-orange fire glow under a dark smoky sky.",
 grade="red, black and ash grey; the end of an empire, everything is lost.",
 t=[('00:00-00:04',"Calm: thick smoke drifts slowly across the ruins, a few orange embers float in the air."),
    ('00:04-00:05',"A heavy shell explodes in the ruins in the distance: a bright orange flash lights the whole sky, the frame shudders, the corners of the map jump, dust and a burst of embers fly past. SFX: a deep, heavy boom."),
    ('00:05-00:08',"The flash fades, the dust settles and the smoke drifts slowly across the ruins again; the last second looks like the first.")])
add(grp='Бункер',kind='scene',sid='downfall-bunker',file='бункер приказ',where='downfall-bunker/bg.mp4',
 title='Сцена «Приказ Штайнера»',
 ru='Бункер, та самая комната: карта Берлина, очки, цветные карандаши, лампа под зелёным абажуром.',
 ev='Удар по столу — тот самый срыв: карандаши подскакивают и разлетаются, красно-синий ломается и летит со стола, очки подпрыгивают, лампа раскачивается и мигает, с потолка сыплется пыль.',
 loop='тьма',shake=False,
 set="a concrete bunker meeting room in April 1945, empty.",
 cam="high angle looking down at the table, 35mm lens.",
 obj="on a large wooden table, a big paper map of Berlin with red and blue pencil arrows; a pair of round wire-rimmed glasses lying on the map; a long red-and-blue pencil and a few colored pencils. A green-shaded lamp hangs low above the table on a cord. No flags, symbols or insignia, no readable text.",
 light="only the hanging lamp, everything else in grey darkness.",
 grade="grey concrete and sickly green light; a furious outburst — the war is lost.",
 t=[('00:00-00:04',"Calm: fine dust floats in the lamp light; the lamp hangs still."),
    ('00:04-00:05',"A furious blow lands on the table: the colored pencils jump and scatter across the map, the red-and-blue pencil snaps and flies off the edge, the glasses bounce, the lamp swings hard and flickers. SFX: a fist slamming down on wood."),
    ('00:05-00:08',"The lamp keeps swinging, its pool of light sliding over the scattered pencils, dust drifting down from the ceiling; then it slowly calms.")])

# ============================== ТИТАНИК ==============================
add(grp='Титаник',kind='main',file='титаник главный',where='titanic-boat/film-bg.mp4 (+ копия titanic-andrews-de)',
 title='ГЛАВНЫЙ «Титаник» — весь фильм',
 ru='Нос «Титаника» ночью под звёздами, прямо у борта — айсберг. На досках палубы — кулон «Сердце океана». Любовь и катастрофа в одном кадре.',
 ev='Удар: корабль содрогается, кадр трясёт, от айсберга откалываются куски льда и с грохотом скользят по палубе, кулон подпрыгивает. Как в фильме — лёд на палубе после столкновения.',
 loop='тьма',shake=True,
 set="the bow deck of a huge 1912 ocean liner at night on a flat calm sea under a sky full of stars, empty; a towering pale iceberg rises right beside the starboard railing.",
 cam="low angle from the deck, 24mm lens, the railing and the iceberg in the center.",
 obj="white railings, old wooden deck planks, two black iron mooring bollards and a white canvas life jacket lying by the railing; on the planks in the foreground, a necklace with a heart-shaped deep-blue gemstone pendant on a fine chain, small, the size of a walnut.",
 light="cold starlight on the ice and the warm glow of the deck lamps.",
 grade="icy blue and warm gold; love and catastrophe in one frame.",
 t=[('00:00-00:04',"Calm: the blue gem sparkles softly, thin mist drifts around the iceberg, the sea is perfectly still."),
    ('00:04-00:05',"Impact: the whole ship shudders and the frame shakes; chunks of white ice break off the iceberg and crash onto the deck, skidding across the planks; the pendant jumps. SFX: a deep grinding of steel against ice."),
    ('00:05-00:08',"The shaking stops; chunks of ice lie scattered on the deck around the pendant, the iceberg slides slowly past the railing.")])
add(grp='Титаник',kind='scene',sid='titanic-boat',file='титаник шлюпка',where='titanic-boat/bg.mp4',
 title='Сцена «Джек сажает Роуз в шлюпку»',
 ru='Шлюпочная палуба ночью во время крушения: пустая шлюпка на талях, оброненное белое меховое боа, белый спасжилет, тёплые лампы.',
 ev='Тросы дёргаются в блоках — шлюпку рывками спускают за борт, она уходит вниз из кадра, лампы мигают. Остаются пустые шлюпбалки над чёрной водой. Как шлюпка Роуз — из которой она потом прыгнет обратно.',
 loop='тьма',shake=False,
 set="the boat deck of a huge 1912 ocean liner at night during the sinking, empty.",
 cam="eye level along the deck, 35mm lens.",
 obj="white-painted steel walls with round brass deck lamps; in the center, an empty wooden lifeboat hanging from two steel davits by ropes beside the railing, the black ocean far below; a dropped white fur stole on the deck planks; a white canvas life jacket hanging on the railing.",
 light="the round deck lamps and lit portholes, warm against the black freezing night.",
 grade="freezing blue night with warm failing lights; a tragic goodbye.",
 t=[('00:00-00:04',"Calm: the empty lifeboat sways slightly on its ropes, cold mist drifts over the water, the lamps glow steadily."),
    ('00:04-00:06',"The ropes run through the pulleys with a jerk and the lifeboat starts going down: it drops in short jolts below the railing and out of sight; the deck lamps flicker. SFX: creaking ropes and squealing pulleys."),
    ('00:06-00:08',"Only the empty davits and the slack ropes remain over the black water; the white fur stole lies on the deck; the lamps steady.")])
add(grp='Титаник',kind='scene',sid='titanic-andrews-de',file='титаник эндрюс',where='titanic-andrews-de/bg.mp4',
 title='DE «Эндрюс: корабль утонет»',
 ru='Штурманская: синий чертёж корабля, медная лампа, открытые золотые часы, карандаш и линейка, иллюминатор в чёрное море.',
 ev='Комната кренится на нос: карандаш скатывается со стола, часы ползут по чертежу, лампа клонится, из-под двери течёт вода. «Это математическая неизбежность».',
 loop='тьма',shake=False,
 set="the chart room of a 1912 ocean liner at night, empty.",
 cam="high angle over the table, 35mm lens.",
 obj="a large wooden table covered with a big blue blueprint of the liner seen from the side, its compartments drawn in white lines; a brass desk lamp; a gold pocket watch lying open on the blueprint; a pencil and a brass ruler; behind, dark wood paneling and a round porthole showing the black night sea.",
 light="only the warm brass lamp.",
 grade="deep blue and warm brass; calm numbers that mean death — a mathematical certainty.",
 t=[('00:00-00:04',"Calm: the pocket watch's second hand ticks, the lamp light is steady."),
    ('00:04-00:05',"The whole room lurches and lists toward the bow: the pencil rolls off the table, the pocket watch slides down across the blueprint, the lamp leans; water begins to trickle in under the door. SFX: a deep groan of steel."),
    ('00:05-00:08',"The room stays tilted; the watch rests at the edge of the blueprint, still ticking; a thin sheet of water spreads across the floor.")])
add(grp='Титаник',kind='scene',sid='titanic-mother-de',file='титаник корсет',where='titanic-mother-de/bg.mp4',
 title='DE «Мать и корсет»',
 ru='Каюта первого класса: туалетный столик с жемчугом и лилиями, корсет на ширме, красные бархатные шторы — роскошь как клетка.',
 ev='Жемчужное ожерелье рвётся — десятки жемчужин скачут по столику и сыплются на пол. «Денег больше нет» — осталось только имя.',
 loop='тьма',shake=False,
 set="a luxurious first-class stateroom of a 1912 ocean liner in the evening, empty.",
 cam="eye level, 50mm lens, shallow focus.",
 obj="a dressing table with a big oval mirror reflecting only the room; on it, a long pearl necklace, a silver hairbrush and a vase of yellow lilies; a white corset with long loose laces hanging over a carved wooden screen; heavy dark-red velvet curtains; warm wall sconces with small shades.",
 light="warm golden wall sconces.",
 grade="gold, cream and blood red; luxury that feels like a cage — the money is gone.",
 t=[('00:00-00:04',"Calm: the loose corset laces sway slightly, the velvet curtain moves very gently."),
    ('00:04-00:05',"The pearl necklace snaps: dozens of pearls burst loose, bounce across the dressing table and rain down onto the floor. SFX: a snap and the patter of pearls."),
    ('00:05-00:08',"The last pearls roll and come to rest on the carpet, the broken string hangs over the edge of the table; the laces sway.")])

# ============================== ВО ВСЕ ТЯЖКИЕ ==============================
add(grp='Во все тяжкие',kind='main',file='бб главный',where='breaking-bad-pilot/film-bg.mp4 (+ копия bb-knocks-de)',
 title='ГЛАВНЫЙ «Во все тяжкие» — весь сериал',
 ru='Весь сериал: фургон-лаборатория в пустыне, жёлтый костюм химзащиты, шляпа Хайзенберга, голубые кристаллы и штаны на кусте из первой серии.',
 ev='В фургоне что-то идёт не так: из двери и люка на крыше вырывается густое белое облако химии, костюм раскачивается. Как в пилоте, когда Уолт травит газом Эмилио и Крейзи-8.',
 loop='тьма',shake=False,
 set="the New Mexico desert at golden hour, nobody around.",
 cam="low wide angle, 24mm lens, the motorhome in the center.",
 obj="an old 1980s white motorhome with faded brown stripes, its side door open, a yellow hazmat suit hanging in the doorway; a black pork-pie hat resting on the metal step with a few sky-blue glass-like crystals glinting beside it; a pair of khaki pants caught on a desert shrub in the foreground. Red mesas behind under a huge sky.",
 light="low warm sun from the side, long shadows.",
 grade="sun-baked yellow and crystal blue; a chemistry teacher who became a kingpin.",
 t=[('00:00-00:04',"Calm: the khaki pants flap gently on the shrub in the hot wind, heat haze shimmers above the sand."),
    ('00:04-00:05',"Inside the motorhome something goes wrong: a thick cloud of white chemical smoke bursts out of the open door and the roof vent, the yellow suit swings. SFX: a sharp hiss and a muffled bang."),
    ('00:05-00:08',"The white smoke rolls out over the sand and drifts away in the wind; the motorhome stands in a thinning haze.")])
add(grp='Во все тяжкие',kind='scene',sid='breaking-bad-pilot',file='бб засада',where='breaking-bad-pilot/bg.mp4',
 title='Сцена «Учитель химии едет на рейд» (S01E01)',
 ru='Засада DEA: вид из машины на дом «цвета шалфея», рация, очки-авиаторы, жилет со значком. У соседнего дома из окна свисает занавеска.',
 ev='Рация трещит и мигает — и в тот же миг из окна соседнего дома вылетает скомканная рубашка и падает на газон, занавеска хлопает. Через это окно Джесси и сбежал, а Уолт его увидел.',
 loop='тьма',shake=False,body=base('breaking-bad-pilot')[0],grade=base('breaking-bad-pilot')[1],
 t=[('00:00-00:04',"Calm: heat haze shimmers above the asphalt, the curtain hangs out of the open upstairs window, the radio's small red light blinks."),
    ('00:04-00:05',"The police radio crackles and its light flashes, and at the same moment the curtain in the open upstairs window whips outward and a crumpled shirt tumbles out and falls onto the lawn below. SFX: a burst of radio static."),
    ('00:05-00:08',"The shirt lies on the lawn, the curtain flaps and slowly settles; heat haze shimmers above the asphalt.")])
add(grp='Во все тяжкие',kind='scene',sid='breaking-bad-gus',file='бб гас',where='breaking-bad-gus/bg.mp4',
 title='Сцена «Уолт приходит к Гасу» (S02E11)',
 ru='«Лос Поллос» ночью, как в кадре: синие стены, красные кабинки, вентиляторы; на столе — диетическая кола (её Уолт и заказал) и нетронутая курица.',
 ev='На пустую парковку заезжает машина: фары скользят по тёмным окнам, встают и бьют прямо в зал, по полу тянутся тени стульев. Потом гаснут. Гас всегда смотрит.',
 loop='сама',shake=False,body=base('breaking-bad-gus')[0],grade=base('breaking-bad-gus')[1],
 t=[('00:00-00:04',"Calm: the ceiling fans turn slowly, condensation drops slide down the cold cup."),
    ('00:04-00:06',"Outside, a car pulls into the empty parking lot: its headlights sweep across the dark windows and stop, shining straight into the restaurant and throwing long shadows of the chairs across the floor. SFX: tires on asphalt, an engine idling."),
    ('00:06-00:08',"The headlights switch off; the parking lot is dark again and the restaurant is calm, exactly as at the start.")])
add(grp='Во все тяжкие',kind='scene',sid='breaking-bad-knocks',file='бб подпол',where='breaking-bad-knocks/bg.mp4',
 title='Сцена «Я тот, кто стучит» и «Где деньги?» (S04E06 · S04E11)',
 ru='Пустой подпол: Скайлер отдала деньги Теду, остались две пачки и рваная плёнка — над этим Уолт и ржёт.',
 ev='Лампочка вспыхивает слишком ярко и лопается — подпол проваливается в темноту, только серый свет из люка и пыль. Срыв Уолта.',
 loop='тьма',shake=False,body=base('breaking-bad-knocks')[0],grade=base('breaking-bad-knocks')[1],
 t=[('00:00-00:04',"Calm: the bare bulb sways slowly on its cord, the shadows of the joists swing across the empty dirt, dust floats in the light."),
    ('00:04-00:05',"The bulb flares too bright and bursts with a small flash and a puff of glass dust; the crawl space drops into darkness, lit only by a faint grey light from the open hatch. SFX: a sharp pop."),
    ('00:05-00:08',"Darkness; the empty socket swings on its cord, dust drifts in the faint grey light, the torn empty wrappers barely visible.")])
add(grp='Во все тяжкие',kind='scene',sid='bb-knocks-de',file='бб дверь',where='bb-knocks-de/bg.mp4',
 title='DE «Ich bin die Gefahr» (S04E06)',
 ru='Прихожая ночью: дверь с жёлтым светом за матовым стеклом, цепочка, шляпа и очки Уолта на столике, семейное фото лицом вниз.',
 ev='Три тяжёлых удара в дверь — она вздрагивает в раме, цепочка прыгает, свет на крыльце мигает. Потом тишина. «Я тот, кто стучит».',
 loop='сама',shake=False,
 set="the dark front hallway of a suburban Albuquerque house at night, seen from inside, empty.",
 cam="eye level facing the front door, 35mm lens.",
 obj="a closed wooden front door with a small frosted glass window glowing yellow from the porch light outside; a brass door chain hanging loose; on a small side table by the door, a black pork-pie hat and a pair of glasses; a family photo frame turned face down.",
 light="only the yellow porch light through the frosted glass.",
 grade="black and sickly yellow — \"I am the one who knocks\".",
 t=[('00:00-00:04',"Calm: the porch light glows steadily behind the frosted glass, a moth's shadow flutters on the glass."),
    ('00:04-00:06',"Three heavy knocks: with each blow the door shudders in its frame, the brass chain jumps and rattles, the porch light flickers. SFX: three loud, slow knocks."),
    ('00:06-00:08',"Silence; the chain swings slowly and stops, the porch light glows steadily again, exactly as at the start.")])
add(grp='Во все тяжкие',kind='scene',sid='bb-mike-de',file='бб майк',where='bb-mike-de/bg.mp4',
 title='DE «Майк и ноутбук Гаса» (S05E01)',
 ru='Пустыня в жёлтый полдень, как в кадре: машина Майка с открытой дверью, ключи и револьвер на капоте, ноутбук Гаса в пыли.',
 ev='Невидимый гигантский магнит: ключи и револьвер дёргаются и ползут по капоту, машину качает, дверь захлопывается. В этой серии ноутбук Гаса уничтожат магнитом — «Yeah, bitch! Magnets!»',
 loop='тьма',shake=False,
 set="the empty New Mexico desert at harsh midday, nobody around.",
 cam="low angle from the dirt road, 28mm lens.",
 obj="a dusty dark-maroon 1980s sedan parked on a dirt track with the driver's door open; on its hood, a ring of car keys and a black revolver at its real size; a closed black laptop lying in the dust in front of the car. Behind, flat desert with dry grass and blue mountains under a huge hazy sky.",
 light="harsh yellow midday sun in a hazy white sky.",
 grade="dusty yellow and black — an old fixer who is done with these amateurs, and evidence that can sink them all.",
 t=[('00:00-00:04',"Calm: dry grass sways in the hot wind, heat haze shimmers above the road, thin dust blows low across the ground."),
    ('00:04-00:05',"A huge invisible magnetic pull: the keys and the revolver jerk and slide across the hood, the sedan rocks on its wheels and the open door swings shut with a slam. SFX: a deep electric hum and a metal clang."),
    ('00:05-00:08',"Everything stops; the keys and the revolver lie at the edge of the hood, the dust settles in the heat haze.")])

# ============================== ПАВЕЛ ДУРОВ ==============================
add(grp='Павел Дуров',kind='main',file='дуров главный',where='durov-tucker/film-bg.mp4',
 title='ГЛАВНЫЙ «Павел Дуров» — сам человек',
 ru='Окно в Питере, откуда в 2012-м летели в толпу самолётики из пятитысячных; внизу — Невский и колоннада Казанского собора, белые ночи.',
 ev='Порыв ветра — занавеска взлетает, и самолётики один за другим срываются с подоконника и улетают в окно, белый (как логотип Telegram) — первым.',
 loop='тьма',shake=False,
 set="a tall open window high up in an old Art Nouveau office building in the center of St. Petersburg during the white nights, the room empty.",
 cam="eye level at the windowsill, 35mm lens, looking out through the open window.",
 obj="a wide stone windowsill with a neat row of eight paper airplanes folded from real orange-red banknotes, their noses pointing out of the window; one plain white paper airplane in the very center, a little ahead of the others; a sheer white curtain at the side. Far below: a wide old avenue with tiny glowing street lamps and an old cathedral with a long curved stone colonnade, under a pale blue-pink sky that never gets dark.",
 light="the pale white-night sky and the warm street lamps below.",
 grade="pale blue, white and money-orange; youth, freedom and defiance — money is paper, freedom matters more.",
 t=[('00:00-00:04',"Calm: the sheer curtain sways slowly in the breeze, the paper wings tremble slightly, the street lamps far below twinkle."),
    ('00:04-00:06',"A gust of wind sweeps in: the curtain billows, and the paper airplanes lift off the sill one after another and glide out of the window into the pale sky, the white one first, leading the others. SFX: a gust of wind and rustling paper."),
    ('00:06-00:08',"The airplanes glide away and grow small over the avenue; the windowsill is empty, the curtain settles.")])
add(grp='Павел Дуров',kind='scene',sid='durov-tucker',file='дуров такер',where='durov-tucker/bg.mp4',
 title='Сцена «Такер Карлсон · 2024»',
 ru='Студия Такера, как в кадре: стена из реек, мраморные полки с белым бюстом, два чёрных кресла, камеры; на столике — бумажный самолётик, как на логотипе Telegram.',
 ev='Перед записью полутемно — и вдруг с громкими щелчками один за другим вспыхивают студийные прожекторы, заливают два кресла, на камерах загораются красные огоньки «запись». Разговор начинается.',
 loop='тьма',shake=False,
 set="a dark, elegant interview room just before filming, empty.",
 cam="wide symmetrical shot, 35mm lens.",
 obj="a wall of vertical dark wooden slats; dark marble shelves with a few white sculptural objects and a small white classical bust; in the center, two black armchairs facing each other with a small round black table between them holding two glasses of water and a single folded white paper airplane; a window with light wooden blinds; two professional video cameras on tripods at the left and right edges, pointed at the chairs.",
 light="at first only soft daylight through the blinds — the studio lights are off.",
 grade="dark wood, black and white marble; serious — a big conversation is about to start.",
 t=[('00:00-00:04',"Calm and dim before filming: soft daylight through the blinds, light ripples faintly in the water glasses."),
    ('00:04-00:05',"The studio lights switch on one after another with loud clicks, flooding the two armchairs with warm light, and the red recording lights on both cameras come on. SFX: heavy clicks of big lights."),
    ('00:05-00:08',"The set is fully lit and ready: the red lights glow, the paper airplane lies on the table between the glasses.")])

# ============================== CLAVICULAR ==============================
add(grp='Clavicular',kind='main',file='клав главный',where='clavicular-impaulsive/film-bg.mp4',
 title='ГЛАВНЫЙ «Clavicular» — сам человек (лукмаксинг)',
 ru='Ванная в Майами, превращённая в станцию лукмаксинга: зеркало с лампами, дерма-роллер, тейп для рта, тренажёр для челюсти, баночки, телефон на штативе с кольцевой лампой, чёрное поло с очками на крючке, за окном неон Майами.',
 ev='Он выходит в эфир: лампы вокруг зеркала включаются по кругу одна за другой, кольцевая лампа вспыхивает, экран телефона загорается зелёным — и по нему бегут сообщения и сердечки.',
 loop='тьма',shake=False,
 set="the bathroom of a Miami high-rise apartment at night, turned into a looksmaxxing station, empty.",
 cam="eye level facing the vanity, 35mm lens.",
 obj="a big mirror framed with round bulbs, reflecting only the dark room; on the white marble counter: a microneedling derma roller, a roll of mouth tape, a silicone jaw exerciser, a row of skincare bottles with no labels, and a smartphone on a small tripod with a ring light; a black knit polo shirt with black sunglasses hooked on its collar hangs on a hook; a small window with Miami towers, palm trees and pink-purple neon.",
 light="at first only the dim pink glow of the city — the mirror bulbs and the ring light are off.",
 grade="clinical white, neon green and hot pink; extreme self-improvement, obsession with the mirror, always on stream.",
 t=[('00:00-00:04',"Calm and dim: the palm trees sway outside the small window, the phone screen is dark."),
    ('00:04-00:05',"Going live: the bulbs around the mirror switch on one by one in a fast circle, the ring light flares on and the phone screen lights up neon green. SFX: a quick row of clicks and a chime."),
    ('00:05-00:08',"The vanity is brightly lit; on the phone screen green chat bubbles and hearts keep streaming upward.")])
add(grp='Clavicular',kind='scene',sid='clavicular-impaulsive',file='клав подкаст',where='clavicular-impaulsive/bg.mp4',
 title='Сцена «Подкаст Impaulsive»',
 ru='Студия Impaulsive, как в кадре: кремовые диваны, стена из досок, кубки, синие бутылки, микрофоны; на столике — телефон.',
 ev='Телефон на столе загорается и жужжит, ползёт по столу, экран заваливают зелёные сообщения — «зелёные сообщения» с Samsung, над которыми ржут в этом эпизоде. Потом гаснет.',
 loop='сама',shake=False,
 set="a big podcast studio right after recording, empty.",
 cam="wide shot from a high corner, 24mm lens.",
 obj="two large cream-colored couches facing each other; between them a low wooden coffee table with two plain unlabeled plastic bottles of blue sports drink and a smartphone lying face up with a dark screen; behind, a wall of warm wooden planks with shelves of small gold trophies; black podcast microphones on boom arms in front of the couches; a video camera on a tripod at the edge of the frame. No boxing ring, no ropes, no logos, no text.",
 light="warm studio lights.",
 grade="warm wood and cream; loud, confident, a little bit show-off.",
 t=[('00:00-00:04',"Calm: condensation drops slide down the cold bottles, a tiny red recording light blinks on the camera; the phone lies dark."),
    ('00:04-00:05',"The phone lights up and buzzes, vibrating across the table, and its screen fills with a flood of green message bubbles. SFX: rapid buzzing."),
    ('00:05-00:08',"The green bubbles keep stacking up on the screen for a moment, then the phone goes dark again and lies still, exactly as at the start.")])
add(grp='Clavicular',kind='scene',sid='clavicular-18',file='клав клуб',where='clavicular-18/bg.mp4',
 title='Сцена «Clavicular · 18+»',
 ru='VIP-ложа клуба в Майами в 4 утра (ты выбрал клуб): шампанское во льду, бокалы, рассыпанные синие таблетки, телефон с зелёным чатом, диско-шар.',
 ev='Пробка вылетает из бутылки, пена хлещет через горлышко на стол, диско-шар вспыхивает ярче. Дофамин — тема эпизода.',
 loop='тьма',shake=False,
 set="a VIP booth of a Miami nightclub at 4 a.m. after closing, empty.",
 cam="eye level from the low table, 28mm lens, the booth in the center.",
 obj="a curved black velvet booth; on the low black table in front of it, a silver ice bucket with a dark unlabeled champagne bottle, two half-empty champagne glasses, an open orange pharmacy pill bottle with a few small blue diamond-shaped pills spilled out, and a smartphone lying face up, its screen glowing neon green with chat bubbles and no letters; behind the booth, a dark wall with thin pink and red neon light strips with no words, and a mirrored disco ball hanging from the ceiling; light haze in the air.",
 light="pink and red neon, the green phone glow and slow light spots from the disco ball.",
 grade="hot pink, red and neon green in darkness; the after-party, no-filter talk about sex, pills, dopamine and money.",
 t=[('00:00-00:04',"Calm: the disco ball turns slowly and its light spots glide across the walls, a thin haze drifts."),
    ('00:04-00:05',"The cork pops out of the champagne bottle in the ice bucket and foam gushes over the neck and spills onto the table; the disco ball spots flash brighter for a moment. SFX: a loud pop and fizz."),
    ('00:05-00:08',"Foam runs down the bottle into the ice, the disco ball keeps turning, the haze drifts.")])
add(grp='Clavicular',kind='scene',sid='clavicular-burger',file='клав бургер',where='clavicular-burger/bg.mp4',
 title='Сцена «Clavicular · Бургер без сыра»',
 ru='Бургер на бумаге посреди столика студии: булка, котлета, сыр, булка; кетчуп, пакет из фастфуда.',
 ev='Сыр сам выскальзывает из бургера и шлёпается на стол рядом: «булка, котлета, булка — и всё». Сыр ему нельзя (лекарство).',
 loop='тьма',shake=False,
 set="the low wooden coffee table of a podcast studio right after recording, empty.",
 cam="close-up at table height, 50mm lens, shallow focus, the burger in the center.",
 obj="a plain hamburger on an open paper wrapper — bun, beef patty, one slice of yellow cheese and bun, nothing else; a small paper cup of ketchup; a plain paper fast-food bag with no logo and a paper cup with a straw. Behind, out of focus: cream couches and black podcast microphones.",
 light="warm studio lights.",
 grade="warm brown, ketchup red and cream; a looksmaxxer who refuses cheese — bun, patty, bun, that's it.",
 t=[('00:00-00:04',"Calm: thin steam rises from the hot patty, a drop of condensation slides down the paper cup."),
    ('00:04-00:05',"The slice of yellow cheese slides out from between the patty and the bun, as if pushed away, and flops flat onto the table beside the burger. SFX: a soft slap."),
    ('00:05-00:08',"The cheese lies apart on the table; the burger — bun, patty, bun — keeps steaming.")])
add(grp='Clavicular',kind='scene',sid='clavicular-bets',file='клав ставки',where='clavicular-bets/bg.mp4',
 title='Сцена «Clavicular · Ставки»',
 ru='Ставки на Клава: ноутбук с графиком ставок (как в кадре), судейский молоток («сядет ли»), стопка покерных фишек.',
 ev='График на ноутбуке обваливается вниз — фишки падают и раскатываются по столу, молоток катится. «Шанс тюрьмы резко упал» — потом линия снова ползёт вверх.',
 loop='тьма',shake=False,
 set="the dark coffee table of a podcast studio late at night, empty.",
 cam="eye level from the table edge, 35mm lens, the laptop in the center.",
 obj="an open laptop whose screen shows one glowing line chart with no numbers and no text; next to it a small wooden judge's gavel lying on its side; a tall stack of red and green poker chips. Behind, out of focus: cream couches and black podcast microphones.",
 light="the cool glow of the laptop screen and dim warm studio lights.",
 grade="market green and red in a dark studio; the internet betting on one guy's life — prison or not, \"no comment\".",
 t=[('00:00-00:04',"Calm: the line on the chart wiggles slightly, a soft glint slides across the poker chips."),
    ('00:04-00:05',"The line on the laptop crashes straight down in a steep red drop, the stack of poker chips topples and the chips roll across the table, the gavel rolls and stops. SFX: chips clattering."),
    ('00:05-00:08',"The chips lie scattered; on the screen the line slowly starts climbing back up in green.")])

HEAD_RU=[
'ФОНЫ С СОБЫТИЕМ — ВСЕ 37',
'',
'Идея: 4 секунды спокойно → на 4-й секунде одно резкое событие из сюжета → после. У каждого фона событие своё: пасхалка сцены (стук в дверь у «Я тот, кто стучит», спускают шлюпку у «Титаника», «и вдруг — перемена» у «Таксиста»).',
'',
'КАК ПРОГОНЯТЬ',
'• Google Flow → Veo 3.1 → «Text to Video», 9:16, 8 с. Каждый блок по-английски — один промт, копируй целиком.',
'• Разметка [00:00-00:04] … — это не ошибка: Veo 3.1 так понимает, что и в какую секунду происходит (так в гайде Google).',
'• Событие вышло не ровно на 4-й секунде — не страшно, найду сам.',
'• Вышла склейка (сменился кадр, камера уехала) — перегенерируй тот же промт, не дописывай.',
'• «I can\'t generate that video» — убери одну «острую» деталь (револьвер, таблетки, топор, сигарету) и прогони ещё раз.',
'• Горизонталь вместо 9:16 — не страшно, всё важное по центру.',
'• Запасной способ для тех, где «петля сама»: сделай картинку по первой части промта (до слова Timeline), потом Frames to Video — эту же картинку и в начало, и в конец, и весь промт. Тогда ролик точно вернётся к началу.',
'',
'КУДА КЛАСТЬ: репо scenes → claude/субтитры/фоны/, имя — после «назови:». Дальше я сам: петля, событие реже (на Главной раз в ~12 с, чтобы не мельтешило), в приложение.',
'Главные фоны немецких полок — те же, что у английских (копию сделаю сам). Немецкий «Ланч» — тот же фон, что у английского обеда Ханны.',
'Обед Ханны, праздник S06E09 и Ральф — промты слово в слово те, что зашли; добавлено только событие.',
'',]

def build():
    out=list(HEAD_RU);J=[];n=0;g=None
    for e in EV:
        if e['grp']!=g:
            g=e['grp'];out+=['','#'*12+f' {g.upper()} '+'#'*12,'']
        n+=1;p=prompt(e)
        out+=[f"=== {n}. {e['title']} → назови: {e['file']}.mp4 ===",
              f"Что в кадре: {e['ru']}",
              f"Событие: {e['ev']}",
              f"Петля: {LOOP_RU[e['loop']]}.",
              '',p,'','']
        J.append({'n':n,'grp':g,'kind':e['kind'],'title':e['title'],'file':e['file']+'.mp4','where':e['where'],'ru':e['ru'],'ev':e['ev'],'loop':e['loop'],'loopRu':LOOP_RU[e['loop']],'seam':LOOP_SEAM[e['loop']],'prompt':p})
    return out,J

if __name__=='__main__':
    out,J=build()
    open('фоны-промты-СОБЫТИЕ.txt','w',encoding='utf-8').write('\n'.join(out))
    json.dump({'head':HEAD_RU,'items':J},open('фоны-промты-СОБЫТИЕ.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
    m=sum(1 for e in EV if e['kind']=='main');print(f'фонов: {len(EV)} (главных {m}, сцен {len(EV)-m}); петля сама: {sum(1 for e in EV if e["loop"]=="сама")}')
