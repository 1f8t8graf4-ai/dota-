# Сравнение промтов фонов (11.10): мои (tools/bg_veo.py, до событий) и второго Claude (tools/bg_event.py, v2 с событием).
# Андрей: «Волк — деньги нереалистичные», «его промты все в 100 раз хуже», «но и мои не все получились — сравни».
# Вывод: его промты — почти дословно мои тексты + событие на 4-й секунде. Портят только рискованные события:
# рой мелочи в воздухе (деньги, листовки, фишки, лёд), «само двигается» (шнурки, магнит, сыр), тряска кадра, разрушение.
# Здесь по каждому из 37: что брать (его как есть / текст + безопасное событие: свет, экран, вода, дым, один предмет), почему,
# и готовый промт. Запуск из корня dota-: python3 tools/bg_cmp.py → фоны-промты-СРАВНЕНИЕ.txt (+ .json)
import json,os,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import bg_veo as bv
import bg_event as be

MINE={}
for L in (bv.P,bv.PH,bv.PDE):
    for x in L:MINE[x[1]]=bv.prompt(*x[2:])

def mine_body(k):
    t=MINE[k];assert ' Motion:' in t and 'Grade:' in t,k
    return t.split(' Motion:')[0].strip(),t.split('Grade:')[1].split(' Rules:')[0].strip()

def his_body(e):
    body=e['body'] if 'body' in e else f"Setting: {e['set']} Camera: {e['cam']} Objects: {e['obj']} Light: {e['light']}"
    return body,e['grade']

def tail3(body,txt=None,ev=True):
    money=any(w in body for w in ('bill','banknote','cash'))
    return ("Rules: the camera is locked off and never moves, no cuts, no zoom; "+("apart from the event, the light stays the same. " if ev else "the light stays the same. ")+
            "Photorealistic live-action footage with real materials and real-world sizes"+(" (banknotes look like real worn paper money)" if money else "")+
            "; every object stands or lies naturally where it belongs, no extra objects; "+(txt or "no people, no faces, no hands, no text, letters or logos anywhere.")+" "
            "Vertical 9:16, full-bleed, no black bars, borders or film frame.")

# take='his' — его промт как есть; take='mix' — текст (base: mine/his, ключ mk) + правки + новое событие (ev: [время, текст])
V={
1:dict(take='mix',base='own',
  body="Setting: the trading floor of a 1990s Long Island brokerage firm at night, the morning after a wild office party, nobody left. Camera: low angle across the nearest desk, 28mm lens, a long aisle of desks behind. Objects: on the nearest desk, in the center: a round fishbowl with one orange goldfish, a small white scale model of a 1980s Lamborghini Countach, an unlabeled champagne bottle with a half-full champagne glass, a tipped-over pharmacy pill bottle with a few round white pills spilled out, a beige office telephone with the handset off the hook and, at the edge of the desk, a few thick bricks of hundred-dollar bills in paper bands; one warm brass desk lamp. Behind: rows of empty desks with boxy beige computer monitors; every screen shows columns of small glowing green numbers with up arrows — stock prices; across the far wall, a long electronic stock ticker band with glowing green numbers scrolling from right to left; confetti and loose bills on the carpet. Light: one warm brass desk lamp and the cold green glow of the screens and the ticker.",
  grade="gold and money-green; greed, excess, drugs and endless partying on other people's money.",
  txt="no people, no faces, no hands; no words, letters or logos anywhere — only small blurred numbers and arrows on the screens.",
  calm="Calm: the goldfish hovers in place waving its fins; bubbles rise in the glass of champagne; the green numbers on the screens flicker as the prices tick up; the green numbers on the wall ticker scroll slowly.",
  ev=('00:04-00:05',"Every screen across the trading floor and the wall ticker flip from green to bright red at once, all the arrows turn down — stock prices plunge; red light washes over the desks and glints on the champagne glass and the white car."),
  after="The screens stay red, the red numbers keep falling and the ticker scrolls faster; the goldfish keeps hovering in the red glow.",loop='тьма',
  why="Это слово в слово тот промт, по которому вышел стоящий фон (Ламба, таблетки, шампанское, рыбка, деньги, снятая трубка), — добавлены только котировки на экранах и бегущая строка на стене. Событие, как ты сказал: в начале всё зелёное, на 4-й секунде разом красное, стрелки вниз — в конце всё рушится. Версии v4–v5 (без Ламбы и таблеток) — в мусор.",
  ru="Котировки на всех экранах и бегущая строка разом из зелёных становятся красными, стрелки вниз — крах, как у Белфорта в конце."),
2:dict(take='mix',base='his',edits=[("a crystal ashtray with one burning cigarette and beside it a tiny brown glass vial with a tiny silver spoon, no bigger than a lipstick;","a crystal ashtray with one burning cigarette;"),
    ("a tall glass of plain water with a lemon slice;","a tall glass of sparkling mineral water with a lemon slice, thin streams of tiny bubbles rising in it;"),
    ("the hazy Manhattan skyscrapers far below,","the hazy Manhattan skyscrapers far below under a soft white overcast sky,")],
  grade="white linen, gin and money; smug, seductive and rotten — money is not real (fugazi).",
  calm="Calm: a slow ribbon of smoke curls up from the cigarette and drifts sideways, thin streams of bubbles rise in the glass of sparkling water, drops of condensation slide down the shaker.",
  ev=('00:04-00:06',"A dark helicopter flies past close outside the window, crossing the skyline from left to right; its dark reflection glides across the curved silver shaker and the full martini glass. Nothing on the table moves."),
  after="The helicopter disappears behind the towers; the smoke and the bubbles carry on, and the table is calm, exactly as at the start.",loop='сама',
  why="Андрей оставил ролик с вертолётом (11.10). Чему научил «Ланч»: бокалы от «гула винта» дёргаются как глюк; далёкие облака за 8 секунд стоят, низкие у стекла — «слишком низко»; флажок вышел двумя флагами — чем больше пишешь про вид за окном, тем больше нейронка выдумывает; радужные блики хрусталя — уродливо (преломление нейронки рисуют плохо); пузырёк с ложечкой без руки читается как лекарство. Здесь — лучшее из попыток: окно просто дымчатый фон, движение близко и на столе (дым, пузырьки, капли), вертолёт только отражается в шейкере и бокале, на столе ничего не двигается. Вертолёт — пасхалка: Джордан потом под кваалюдами сажает свой вертолёт у дома.",
  ru="За окном пролетает вертолёт — его отражение скользит по шейкеру и бокалу, на столе ничего не двигается. До и после — дым, пузырьки в воде, капли по шейкеру."),
3:dict(take='mix',base='mine',mk='wolf-swiss-bank',edits=[("a small stack of real hundred-dollar bills under a silver money clip","a small brass safe-deposit key lying on the folder")],
  calm="Calm: the tropical fish drift slowly in the aquarium, the fountain plume sways in the wind, a wisp of steam rises from the espresso.",
  ev=('00:04-00:06',"Out in the window the lake fountain surges: its white plume shoots much higher into the sky, a wide veil of spray drifts in the wind and a bright rainbow appears in the mist."),
  after="The plume slowly sinks back to its usual height and the rainbow fades; the office is calm again, exactly as at the start.",loop='сама',
  why="Он убрал аквариум и стол банкира — а аквариум реально в сцене, и твой ролик с ним уже вышел хорошо (стоит в приложении). Событие у него хорошее — фонтан и радуга («с финансовой точки зрения вы в раю»): вода и свет. Беру мой кабинет + его событие. Пачку долларов со стола убрал (крупно купюры у нейронок фальшивые) — вместо неё ключик от банковской ячейки.",
  ru="Фонтан за окном бьёт выше, в брызгах встаёт радуга, потом опадает."),
4:dict(take='mix',base='mine',mk='wolf-naomi-de',edits=[("a folded white napkin.","a folded white napkin and a plain gold wedding band lying flat on the white tablecloth between the glasses."),
  ("dark red brick walls, more little","dark red brick walls with a small window onto the dark night street, more little")],
  calm="Calm: reflections shimmer softly in the glasses, a drop of condensation slides down the cocktail glass.",
  ev=('00:04-00:05',"The headlights of a passing car sweep through the window across the table: the gold wedding band flashes brightly for a moment in the middle of the white cloth."),
  after="The light moves on and the restaurant is dim again, exactly as at the start; the ring lies in the soft lamp light.",loop='сама',
  why="Кольцо стоит на ребре, потом катится дугой и крутится — физику мелкой монетки нейронки рисуют криво. Беру мой стол + кольцо просто лежит, его выхватывает свет фар — «ты же женат?» светом.",
  ru="Свет фар проезжающей машины проходит по столу — обручальное кольцо ярко вспыхивает."),
5:dict(take='mix',base='mine',mk='film-sopranos-b',edits=[("a pink neon outline of a smiling cartoon pig's face glows among them","a pink neon sign shaped like a smiling pig's face, with no letters, glows among them")],
  calm="Calm: a thin thread of smoke rises only from the tip of the cigar, steam rises from one espresso cup, the pink pig neon hums softly.",
  ev=('00:04-00:05',"The pink neon pig in the shop window flickers, buzzes, sputters and goes dark."),
  after="The shop window is dark without the pink glow; the cigar smoke keeps rising in the cold dawn.",loop='чёрный',
  why="Ты просил главный фон про весь сериал, а не только про Тони, — а он вернул кухню. Беру мою лавку Сатриале (тут сидит вся банда все 6 сезонов) + его же прошлую идею: неоновая свинья гаснет, и в конце — резко чёрный экран, как в финале сериала (чёрное добавлю сам). Кухня с утками у тебя уже стоит; если оставить её — его №5 тоже норм: утки улетают, птиц Veo рисует нормально.",
  ru="Неоновая свинья в витрине мигает, трещит и гаснет — потом резко чёрный экран."),
6:dict(take='mix',base='mine',mk='sopranos-s01e01',
  calm="Calm: dust specks drift in the lamp light, tree leaves move gently behind the blinds.",
  ev=('00:04-00:06',"A heavy cloud passes over the sun: the green daylight behind the blinds fades and the office sinks into brown dusk, only the floor lamp still glowing."),
  after="The cloud passes and the daylight slowly returns; the room is calm again, exactly as at the start.",loop='сама',
  why="«Картинка темнеет от краёв и плывёт» — эффект камеры, Veo делает его непредсказуемо. Беру мой кабинет (по нему у тебя уже стоит ролик). Обморок Тони — светом, и с понятной причиной: на солнце набегает туча, кабинет тонет в сумраке, светит только торшер, потом солнце возвращается.",
  ru="На солнце набегает туча — кабинет тонет в сумраке (обморок Тони), светит только торшер, потом светлеет."),
7:dict(take='mix',base='mine',mk='sopranos-s06e09',edits=[("with real US one-dollar bills pinned flat along them with small safety pins — real, worn and creased bills with dull grey-green paper texture, each bill no bigger than the saint's hand","with real US one-dollar bills folded in half lengthwise and pinned along them with small safety pins — worn, creased and faded, small at this distance")],
  calm="Calm: the ribbons with the pinned bills sway only slightly in a light breeze, the bulbs twinkle softly, the distant Ferris wheel turns slowly.",
  ev=('00:04-00:05',"A power glitch: in the far background the carnival ride jolts to a stop, and all the strings of colored bulbs above the street flicker off for a moment."),
  after="The power comes back: the bulbs flicker on again one string after another; everything is calm again, as at the start.",loop='сама',
  why="Текст — мой, тот, что дал «нихуя себе». Его событие почти норм, но ленты с деньгами «треплет» — опять летающие деньги. Беру: скачок напряжения — аттракцион в глубине встаёт, гирлянды на секунду гаснут (в этой серии на аттракционе и случается авария).",
  ru="Скачок напряжения: аттракцион в глубине встаёт, гирлянды над улицей на секунду гаснут и загораются."),
8:dict(take='mix',base='mine',mk='sopranos-arc',edits=[("a short stack of typed pages beside it","a short stack of typed pages with blurred unreadable lines beside it"),("a glowing home aquarium with a few tropical fish.","a glowing home aquarium with a few tropical fish and one small grey reef shark.")],
  calm="Calm: the fish and the little shark swim slowly, bubbles rise from the aquarium filter, smoke rises only from the tip of the cigarette, raindrops run down the window.",
  ev=('00:04-00:05',"A flash of lightning outside the rainy window lights up the whole room bright white for an instant; the aquarium light flickers."),
  after="The room is dim again, the rain keeps running down the window, the little shark keeps circling.",loop='сама',
  why="Акула с разгона бьётся в стекло, поднимается облако песка — физика удара, выйдет фальшь. Беру мой стол с машинкой (сценарий — его «арка»), в аквариум — акулку (как у него, из фразы Мелфи), событие — вспышка молнии за дождливым окном.",
  ru="За дождливым окном сверкает молния — комната на миг белая, в аквариуме кружит акулка."),
9:dict(take='his',why="Мой лучший промт, слово в слово + на телике скачки сменяются огнём (сгорит конюшня Пай-О-Май). Смена картинки на экране — это у Veo выходит чисто."),
10:dict(take='mix',base='mine',mk='sopranos-mahaffey-de',edits=[("one brown leather office shoe lying alone on the grass.","one brown leather office shoe lying alone on the grass; small pop-up lawn sprinkler heads hidden in the grass.")],
  calm="Calm: thin steam rises from the spilled coffee, the long willow branches sway gently in the wind.",
  ev=('00:04-00:06',"The lawn sprinklers pop up out of the grass and switch on: arcs of water spray across the lawn and patter against the black sedan and the spilled coffee cups."),
  after="The sprinklers keep turning in the grey morning, water beads and runs down the black car, the willows sway.",loop='тьма',
  why="У него машина едет и давит стаканы — движение машины и лопающиеся стаканы нейронка ломает. У меня потом в пустой машине сами вспыхивали фары и рычал мотор — тоже «само». Теперь то, что в офисном парке бывает каждое утро: включаются поливалки — вода бьёт по газону, по брошенной машине и разлитому кофе.",
  ru="На газоне включаются поливалки — вода бьёт по траве, по брошенной машине и разлитому кофе."),
11:dict(take='mix',base='mine',mk='sopranos-hasid-de',edits=[("a black wide-brimmed felt hat left lying on the counter;","a black wide-brimmed felt hat left lying on the counter; a paper cup of black coffee;")],
  calm="Calm: the vertical blinds sway very slightly in the air from a fan, fine dust floats in the daylight.",
  ev=('00:04-00:06',"Three slow, heavy, ground-shaking thuds, like the footsteps of a giant coming closer: with each one, perfect rings jump across the black coffee in the paper cup and the silver service bell trembles."),
  after="The thuds stop; the rings in the coffee fade and everything is calm again, exactly as at the start.",loop='сама',
  why="Он перенёс сюда лавку Сатриале — а она у главного фона «Сопрано», будет повтор. Беру мой мотель (3-й эпизод: тут «договариваются» с зятем) + его «голема»: три тяжёлых удара, как шаги великана, — круги в кофе, как в «Парке юрского периода», звонок на стойке дрожит. Ничего не катится и не падает.",
  ru="Три тяжёлых удара, как шаги великана (голем): по кофе в стакане бегут круги, звонок на стойке дрожит."),
12:dict(take='mix',base='his',
  calm="Calm: a thin wisp of steam rises from the espresso, the lace curtains glow softly.",
  ev=('00:04-00:05',"The brass wall sconce flickers twice and goes out: the dark café drops into cold grey winter light from the lace curtains."),
  after="Without the sconce the café stays cold and grey; the steam keeps rising from the espresso.",loop='тьма',
  why="Чашка трескалась пополам — разрушение у нейронок выходит пластилином. У меня потом капля кофе сама бежала по чашке на платок — тоже «само». Теперь просто светом: бра мигает и гаснет, кафе остаётся в холодном сером свете — семью Сопрано «выключают» за чашкой кофе.",
  ru="Бра на стене мигает и гаснет — кафе остаётся в холодном сером зимнем свете."),
13:dict(take='mix',base='his',
  calm="Calm: the green level meters on the stereo bounce softly to the music, the city lights twinkle; nothing else moves.",
  ev=('00:04-00:05',"The music gets loud: the level meters on the stereo jump up to the very top and flash red and green, and the small lights on the stereo glow brighter."),
  after="The meters keep bouncing high to the loud music; the raincoat, the axe and the newspapers wait in the cold white light.",loop='тьма',
  why="Было: свет щёлкает — и вешалка пустая, топора нет. Предметы, которые исчезают сами, у нейронок выходят глюком. Теперь — музыка на полную: перед топором Патрик ставит Huey Lewis «Hip to Be Square», индикаторы прыгают до красного. Комната — та же, что у стоящего фона.",
  ru="Музыка на полную: индикаторы на стерео прыгают до красного — Патрик ставит Huey Lewis перед топором."),
14:dict(take='his',why="Он прав: у Бейтмана стол из тёмного дерева, не стекло. Одна красная капля в минералку — одна капля и вода, выходит хорошо, и сразу «психопат» без крови."),
15:dict(take='mix',base='his',edits=[("with embossed lettering too small and blurred to read;","with embossed lettering too small and blurred to read; the last card on the right has a faint watermark in its thick paper;")],
  calm="Calm: a drop of condensation slides down the glass; thin stripes of daylight from the blinds rest beside the cards.",
  ev=('00:04-00:05',"The sun comes out from behind a cloud: the stripes of daylight on the table turn bright, and the last card on the right catches the light — its thick paper glows warmer than all the others and its faint watermark shines."),
  after="A cloud covers the sun again and the light softens back, exactly as at the start.",loop='сама',
  why="Переговорная как в кадре — его (у меня был стол под софитом и виски, которого в сцене нет). Но у него полоска солнца сама ползла по столу (солнце так быстро не ходит) и водяной знак «проявлялся» — картинка менялась бы на ходу. Теперь солнце выходит из-за облака, полоски света ярче, последняя визитка ловит свет — водяной знак на ней был всегда, просто блестит.",
  ru="Из-за облака выходит солнце — полоски света ярче, последняя визитка ловит свет, блестит её водяной знак."),
16:dict(take='his',why="Та же комната, что у тебя уже стоит. Ливень по стеклу — то, что нейронки рисуют лучше всего, и это самая известная реплика Трэвиса («придёт настоящий дождь»)."),
17:dict(take='mix',base='his',
  calm="Regularity: the windshield wipers sweep back and forth in a slow, steady rhythm, raindrops trickle down the glass, the steam drifts — over and over, the same.",
  ev=('00:04-00:05',"Then suddenly there is change: the wipers stop dead in the middle of the glass, and the headlights of a car coming toward the cab flood the wet windshield with bright white light."),
  after="The white light glides across the wet glass and fades back into the neon night; the wipers start their slow, steady rhythm again, exactly as at the start.",loop='сама',
  why="Мой текст + его событие из текста сцены («и вдруг — перемена»): дворники встают. Но белый свет у него заливал улицу непонятно откуда. Теперь понятно: навстречу едет машина, фары заливают мокрое стекло.",
  ru="«И вдруг — перемена»: дворники встают, навстречу едет машина — фары заливают мокрое стекло белым светом."),
18:dict(take='mix',base='mine',mk='taxi-driver-betsy',edits=[("a slice of pie on a paper plate;","a slice of pie on a paper plate and a small electric desk fan;")],
  calm="Calm: the bunting ripples gently in the breeze of a small desk fan, the fan blades turn, steam rises from the coffee.",
  ev=('00:04-00:05',"The sun comes out from behind a cloud: a bright warm beam sweeps through the windows across the front desk and lights up the coffee and the slice of pie."),
  after="The warm light slowly softens back to normal daylight, as at the start.",loop='сама',
  why="Листовки взрываются по всему штабу — куча мелкой бумаги в воздухе, как деньги у «Волка». Беру мой кадр + солнце выходит из-за облака: тёплый луч на кофе и пирог — надежда Трэвиса.",
  ru="Из-за облака выходит солнце — тёплый луч ложится на кофе и кусок пирога."),
19:dict(take='mix',base='his',
  calm="Calm: thick smoke drifts slowly across the ruins, a few orange embers float in the air.",
  ev=('00:04-00:05',"A heavy shell explodes far away among the ruins: a bright orange flash lights up the whole sky and a slow wave of dust and smoke rolls toward the camera; the corners of the map lift in the hot wind."),
  after="The flash fades, the dust settles and the smoke drifts slowly across the ruins again, as at the start.",loop='сама',
  why="Текст — мой (по нему у тебя стоит ролик). Взрыв — норм, но у него «кадр трясётся» — тряска ломает картинку. Беру его взрыв без тряски: вспышка на всё небо, волна пыли.",
  ru="Вдали рвётся снаряд: оранжевая вспышка на всё небо, катится волна пыли, углы карты приподнимает."),
20:dict(take='mix',base='his',
  calm="Calm: fine dust floats in the lamp light; the lamp hangs still.",
  ev=('00:04-00:05',"A heavy explosion booms somewhere above the bunker: the hanging lamp swings hard and flickers, the round glasses rattle on the map, fine dust trickles down from the ceiling."),
  after="The lamp keeps swinging, its light sliding back and forth over the map, then slowly calms.",loop='сама',
  why="У него невидимый удар по столу: карандаш кувыркается, карандаши разлетаются, очки скачут — слишком много всего, и всё подпрыгивает без видимой причины. Беру понятную причину — взрыв где-то сверху: лампа качается и мигает, очки дребезжат, с потолка сыплется пыль.",
  ru="Где-то сверху бахает взрыв: лампа над картой качается и мигает, очки дребезжат, с потолка сыплется пыль."),
21:dict(take='mix',base='mine',mk='film-titanic-b2',edits=[("a white canvas life jacket lying beside the railing;","a white canvas life jacket lying beside the railing; a row of round deck lamps along the railing, still dark;")],
  calm="Calm: the tiny blue sparkle twinkles, the sea slides past the bow, thin mist drifts around the iceberg.",
  ev=('00:04-00:06',"The round deck lamps along the railing switch on one after another, from the camera toward the tip of the bow, and the tiny blue sparkle on the deck flashes in their light."),
  after="The deck lamps glow warm in the dusk; the pale iceberg waits on the horizon in the mist.",loop='тьма',
  why="У него корабль трясёт и глыбы льда катятся по палубе — тряска и куча обломков. У меня потом было «солнце садится за 2 секунды» — это ускоренная съёмка посреди обычного кадра, выйдет фальшиво. Беру мой нос корабля на закате (по нему у тебя стоит ролик): вдоль борта одна за другой зажигаются лампы, и в их свете вспыхивает искорка кулона.",
  ru="Вдоль борта одна за другой зажигаются лампы — в их свете вспыхивает искорка кулона на палубе."),
22:dict(take='mix',base='mine',mk='titanic-boat',
  calm="Calm: the empty lifeboat sways slightly on its ropes, cold mist drifts over the water far below.",
  ev=('00:04-00:06',"The power fails: the round deck lamps and the lit portholes flicker and go out one after another along the deck, until only the cold blue night is left."),
  after="Almost dark; the empty lifeboat keeps swaying on its ropes against the black sea.",loop='тьма',
  why="Шлюпку рывками спускают вдоль борта, камера смотрит отвесно вниз — большой механизм в движении, нейронка запутается. Беру мою палубу + корабль обесточивается: лампы гаснут одна за другой.",
  ru="Корабль обесточивается: лампы и иллюминаторы гаснут один за другим, шлюпка качается в темноте."),
23:dict(take='mix',base='mine',mk='titanic-andrews-de',edits=[("a pencil and a brass ruler;","a pencil, a brass ruler and a glass of water;"),("its compartments drawn in white lines;","its compartments drawn in white lines, no readable text;"),("a brass desk lamp;","a brass lamp hanging low above the table on a short chain;")],
  calm="Calm: the pocket watch's second hand ticks, the water in the glass is perfectly still.",
  ev=('00:04-00:05',"The ship lurches toward the bow: the brass lamp swings hard, its pool of light sliding over the blueprint, and the surface of the water in the glass tilts."),
  after="The lamp keeps swinging slowly; the water in the glass settles at a slant; the watch keeps ticking.",loop='тьма',
  why="Вся комната кренится и всё едет — по сути двигается весь кадр. Беру мою каюту + толчок: лампа качается, вода в стакане встаёт наискось (карандаш больше не катится — чем меньше движущихся предметов, тем меньше брака).",
  ru="Корабль кренится: лампа качается, вода в стакане встаёт наискось."),
24:dict(take='mix',base='mine',mk='titanic-mother-de',edits=[("a pearl necklace, a silver hairbrush","a silver hairbrush")],
  calm="Calm: the loose corset laces sway slightly, the velvet curtain moves very gently.",
  ev=('00:04-00:05',"The golden wall sconces dim almost to darkness; the room sinks into deep crimson shadow and the white corset glows faintly in the dark mirror."),
  after="The sconces slowly come back to warm gold, as at the start.",loop='сама',
  why="Шнурки корсета сами затягиваются — «само двигается», нейронки так не умеют. Беру мою каюту (без жемчуга — он прав, его в сцене нет) + бра гаснут до тёмно-красного: роскошь как клетка.",
  ru="Бра гаснут — каюта тонет в тёмно-красном, белый корсет едва светится в зеркале."),
25:dict(take='mix',base='mine',mk='film-bb-b',
  calm="Calm: the khaki pants flap gently on the shrub in the hot wind, heat haze shimmers above the sand.",
  ev=('00:04-00:05',"Inside the motorhome something goes wrong: a thick cloud of white smoke bursts out of the open side door and the roof vent; the yellow suit swings in the doorway."),
  after="The white smoke rolls out over the sand and drifts away in the wind; the motorhome stands in a thinning haze.",loop='сама',
  why="Текст — мой (по нему у тебя стоит ролик). Его событие хорошее: белое облако из фургона — дым у нейронок выходит отлично, и это пилот. Плюшевого мишку не беру — лишний предмет.",
  ru="Из двери и люка фургона вырывается густое белое облако и уходит по ветру."),
26:dict(take='mix',base='mine',mk='breaking-bad-pilot',
  calm="Calm: heat haze shimmers above the asphalt, the radio's small red light blinks.",
  ev=('00:04-00:05',"The police radio crackles and its light flashes red; at the same moment a gust of wind blows the curtain far out of the open upstairs window of the two-story house."),
  after="The curtain flutters out of the window and slowly falls back; heat haze shimmers above the asphalt.",loop='сама',
  why="Из окна вылетают джинсы, рубашка, кроссовки — а кто их бросает? Летящая одежда без человека выйдет странно. Беру мой кадр + рация вспыхивает, ветер выдувает занавеску из того самого окна, через которое сбежал Джесси.",
  ru="Рация трещит и мигает, ветер выдувает занавеску из того самого окна."),
27:dict(take='his',why="Мой текст + закрытие: ряды ламп гаснут один за другим, остаётся красная над столом — светом, безопасно."),
28:dict(take='mix',base='his',edits=[("only two small bundles of real cash in clear plastic wrap are left in the dirt","only two small bundles of cash wrapped tight in clear plastic, half in shadow, are left in the dirt")],
  calm="Calm: the bare bulb sways slowly on its cord, the shadows of the joists swing across the dirt, dust floats in the light.",
  ev=('00:04-00:05',"The bare bulb flickers hard a few times and goes out; the crawl space drops into darkness, lit only by a faint grey light from the open hatch."),
  after="Darkness; the dead bulb swings on its cord, dust drifts in the faint grey light, the torn plastic barely visible.",loop='тьма',ru='Лампочка мигает и гаснет — подпол уходит в темноту.',
  why="Мой текст + лампочка мигает и гаснет, подпол уходит в темноту — светом (было «лопается» — это поломка, правило 2). Две пачки денег — плотно в плёнке и наполовину в тени: крупно купюры у нейронок фальшивые."),
29:dict(take='his',why="Он прав: «Я тот, кто стучит» говорится в спальне, не в прихожей. Три удара: дверь вздрагивает, кофе кругами, лампа мигает, рамка падает — один предмет, остальное дрожь."),
30:dict(take='mix',base='mine',mk='bb-mike-de',
  calm="Calm: dry grass sways in the hot wind, heat haze shimmers above the road, thin dust blows low across the ground.",
  ev=('00:04-00:06',"A small dust devil spins up on the dirt track behind the car: a tall twisting column of dust whirls past, the dry grass flattens around it, the open car door rocks slightly."),
  after="The dust devil drifts away and falls apart; the dust settles in the heat haze.",loop='сама',
  why="«Невидимый магнит» тащит ключи, револьвер и ноутбук — само двигается, выйдет фальшь. Беру мой кадр + за машиной проходит пылевой вихрь.",
  ru="За машиной проходит пылевой вихрь, трава ложится, дверь машины покачивается."),
31:dict(take='mix',base='mine',mk='film-durov-b',
  calm="Calm: the sheer curtain sways slowly in the breeze, the paper wings tremble slightly, the street lamps far below twinkle.",
  ev=('00:04-00:06',"A gust of wind sweeps in: the curtain billows, and only the single white paper airplane lifts off the sill and glides out of the window into the pale sky; the money airplanes just tremble."),
  after="The white airplane glides away and grows small over the avenue; the curtain settles.",loop='тьма',
  why="Девять самолётиков взлетают по очереди — много мелких предметов в воздухе. Беру мой кадр (по нему у тебя стоит ролик) + улетает только белый, как на логотипе Telegram; денежные лишь дрожат.",
  ru="Порыв ветра — улетает только белый самолётик (как логотип Telegram), денежные остаются."),
32:dict(take='mix',base='his',
  calm="Calm: soft light glows through the closed blinds, light ripples faintly in the water glasses, the plant's leaves barely move.",
  ev=('00:04-00:06',"The motorized wooden blinds roll up smoothly: blinding sunlight floods the room, and the Dubai skyline appears in the heat haze with the needle of the world's tallest skyscraper."),
  after="The room is full of warm sunlight, long shadows of the chairs lie on the carpet, the paper airplane glows white on the table.",loop='тьма',
  why="Его промт: без камер на штативах (у меня были — лишнее); жалюзи поднимаются, комнату заливает солнце, за окном Дубай. Поправил одно: жалюзи «сами» → моторизованные, чтобы не выглядело как фокус.",
  ru="Электрожалюзи поднимаются — комнату заливает солнце, за окном Дубай с самой высокой башней мира."),
33:dict(take='mix',base='his',edits=[("a silicone jaw exerciser,","a silicone jaw exerciser, a glass bowl of ice cubes, a small steel hammer,")],
  calm="Calm and dim: the palm trees sway outside the small window, the phone screen is dark.",
  ev=('00:04-00:05',"Going live: the bulbs around the mirror switch on one by one in a fast circle, the ring light flares on and the phone screen lights up neon green."),
  after="The vanity is brightly lit; on the phone screen green chat bubbles and hearts keep streaming upward.",loop='тьма',
  why="Чище моего (убрал молоток, шприцы, лёд — лишнее и «острое»). Выход в эфир: лампы вокруг зеркала включаются по кругу — светом. Но лёд и молоток вернул: они есть в стоящем фоне и сразу узнаются (лицо в лёд, «bone smashing»).",
  ru="Выход в эфир: лампы вокруг зеркала включаются по кругу, кольцевая лампа вспыхивает, на телефоне — зелёные сообщения."),
34:dict(take='his',why="Мой текст + телефон жужжит, экран заваливают зелёные сообщения — экран и одна вибрация."),
35:dict(take='his',why="Убрал таблетки. Закрытие: врубается белый дежурный свет, неон гаснет — светом."),
36:dict(take='mix',base='mine',mk='clavicular-burger',
  calm="Calm: thin steam rises from the hot patty, a drop of condensation slides down the paper cup.",
  ev=('00:04-00:06',"The warm studio lights dim and one bright spotlight snaps on straight above the burger: bun, patty, bun glow like a hero shot in a fast-food commercial, the steam curling in the beam; the slice of cheese pushed aside stays in the shadow."),
  after="The spotlight slowly fades and the warm studio lights come back, exactly as at the start.",loop='сама',
  why="Сначала было «сыр сам соскальзывает со стола» — вышло тупо: предмет падает без причины. Теперь событие светом, как в рекламе фастфуда (он же нахваливает «Бургер Кинг»): студия гаснет, сверху бьёт луч на бургер — «булка, котлета, булка», а отодвинутый сыр остаётся в тени.",
  ru="Студия гаснет, сверху бьёт луч на бургер, как в рекламе: «булка, котлета, булка» сияет, отодвинутый сыр — в тени."),
37:dict(take='mix',base='mine',mk='clavicular-bets',
  calm="Calm: the line on the chart wiggles slightly, a soft glint slides across the poker chips.",
  ev=('00:04-00:05',"The line on the laptop chart shoots straight up to the very top and the whole screen flashes bright green, lighting up the table."),
  after="The line stays at the top of the chart, glowing green; the chips glint in the green light.",loop='тьма',
  why="Стопка фишек валится и раскатывается — куча мелких предметов. Беру только экран: линия взлетает в самый верх, экран вспыхивает зелёным.",
  ru="Линия на графике взлетает в самый верх, экран вспыхивает зелёным."),
}


# Grade — только цвет, свет и настроение прилагательными. Предметы, люди, цитаты, насилие в Grade нейронка рисует буквально
# (у «Волка» из «money-green; greed» жёлтый блокнот стал пачкой денег на кирпиче). Похваленные (2, 7, 9) не трогаю.
G={
3:"warm brown, brass and turquoise; discreet, expensive and quietly dangerous.",
4:"warm amber and dark red; intimate, flirty and a little guilty.",
5:"cold blue-grey street against warm pink and yellow; familiar, loyal and quietly dangerous.",
6:"walnut brown and olive green; heavy silence, private and tense.",
8:"cold blue and warm amber; restless late-night dreaming.",
10:"muted green and grey; a pleasant suburban morning with a sudden edge.",
11:"pale blue and cold white; polite on the surface, tense underneath.",
12:"dark brown and cold white; quiet, cold and final.",
13:"sterile white perfection with something horribly wrong underneath.",
14:"steel grey, mahogany and white; sterile, arrogant 1980s perfection with something wrong underneath.",
15:"dark mahogany with creamy whites; petty envy and status games.",
16:"dirty yellow and red; lonely, sleepless and tense.",
17:"red and green neon in darkness; insomnia and loneliness.",
18:"warm red, white and blue; bright 1970s optimism, awkward and hopeful.",
19:"red, black and ash grey; ruin and defeat, everything is lost.",
23:"deep blue and warm brass; calm, precise and doomed.",
24:"gold, cream and deep red; luxurious, tight and suffocating.",
25:"sun-baked yellow and crystal blue; ordinary on the surface, dangerous underneath.",
26:"bleached sun with a yellow-green tint; dull and hot, right before everything changes.",
28:"harsh yellow and deep black; empty, hopeless and unhinged.",
29:"warm beige turning into black and sickly yellow; calm turning into menace.",
30:"dusty yellow and black; tired, tough and dangerous.",
31:"pale blue, white and soft orange; young, free and defiant.",
32:"dark wood, black and white marble, then blinding desert sunlight; calm, careful and serious.",
35:"hot pink and red in darkness, then harsh flat white; hedonistic and empty — the party is over.",
36:"warm brown, ketchup red and cream; strict and simple, a little absurd.",
37:"green and red glow in a dark studio; tense and risky.",
}

def build():
    assert len(V)==len(be.EV)==37
    out=[];cnt={'his':0,'mix':0}
    for n,e in enumerate(be.EV,1):
        v=V[n];cnt[v['take']]+=1
        if v['take']=='his':
            body,grade=his_body(e)
            seg=[(a,b.split(' SFX:')[0].strip()) for a,b in e['t']]   # звук не нужен: фоны без звука, а лишние слова отвлекают модель
            take='его промт (без строк про звук и с коротким хвостом)';ev_ru=e['ev'];loop=e['loop']
        else:
            body,grade=(v['body'],v['grade']) if v['base']=='own' else mine_body(v['mk']) if v['base']=='mine' else his_body(e)
            for a,b in v.get('edits',[]):
                assert a in body,(n,a);body=body.replace(a,b)
            if v['base']!='own' and v.get('grade'):grade=v['grade']
            t0,t1=v['ev'];t2='00:05-00:08' if t0.endswith('05') else '00:06-00:08'
            seg=[('00:00-00:04',v['calm']),(t0,t1),(t2,v['after'])]
            take={'mine':'мой текст','his':'его текст','own':'новый текст'}[v['base']]+' + другое событие';ev_ru=v['ru'];loop=v['loop']
            if n in (3,25):take='мой текст + его событие'
        why=v['why']
        if n in G:
            assert n not in (2,7,9),n
            why+=f" Строка цвета почищена — было «{grade}»: предметы, людей и цитаты из этой строки нейронка рисует буквально.";grade=G[n];take+=' · строка цвета почищена'
        tl=' '.join(f'[{a}] {b}' for a,b in seg)
        p=f"{body} Grade: {grade} Timeline — one continuous shot, the same framing for all 8 seconds: {tl} {tail3(body,v.get('txt'))}"
        # 13.9.6: запасной — тот же фон без события (событие не вышло за 2 попытки): спокойная часть на все 8 секунд
        pc=f"{body} Grade: {grade} Timeline — one continuous shot, the same framing for all 8 seconds: [00:00-00:08] {seg[0][1].strip()} This calm motion simply continues for all 8 seconds; nothing sudden happens and nothing new appears. {tail3(body,v.get('txt'),ev=False)}"
        out.append(dict(n=n,grp=e['grp'],kind=e['kind'],title=e['title'],file=e['file'],where=e['where'],take=take,why=why,ev=ev_ru,loop=loop,
                        seam=be.LOOP_SEAM[loop],prompt=p,calm=pc))
    return out,cnt

if __name__=='__main__':
    R,cnt=build()
    L=['СРАВНЕНИЕ ПРОМТОВ ФОНОВ — мои и второго Claude (v2 «с событием»), 11.10','',
       'КОРОТКО',
       '• Его промты — почти дословно мои тексты (место, предметы, свет, цвет) + событие на 4-й секунде. Хуже стало из-за событий.',
       '• Где событие — свет, экран, вода, дым, дрожь — всё нормально. Где летит куча мелочи (деньги, листовки, фишки, лёд), что-то двигается «само» (шнурки, магнит, сыр), кадр трясётся или что-то ломается — нейронка рисует фальшь. Так и вышли пластиковые деньги у «Волка».',
       '• В нескольких местах он поменял само место — где-то по делу (по реальным кадрам: стол Бейтмана, спальня «Я тот, кто стучит», переговорная с визитками), где-то зря (главный «Сопрано»: ты просил всю банду, а он вернул кухню; убрал аквариум из Женевы).',
       f'• Итог: {cnt["his"]} — его промт (событие безопасное), {cnt["mix"]} — текст + другое, безопасное событие. Ниже по каждому: что брать, почему, событие и готовый промт.',
       '• Ещё одна общая ошибка — и у него, и у меня в 13.8.2: в хвосте каждого промта «never toy money», даже где денег нет. Слово toy тянет картинку в игрушечность. Здесь хвост короче, про деньги — только где они есть, и без строк про звук (фоны всё равно без звука).',
       '• Фоны, которые уже стоят, никуда не деваются — новые с событием просто заменят их, когда сделаешь.','',
       'КАК ПРОВЕРЕНО (все 37, по одному списку, после «сыра»):',
       '1) Ничего не двигается без видимой причины: если предмет катится, падает, дрожит — в кадре видно отчего (ветер по занавеске, поливалка, взрыв с пылью, удары с кругами на воде, крен корабля). Иначе событие — светом.',
       '2) Нет роя мелочи в воздухе (деньги, бумага, фишки, лёд), нет тряски кадра и эффектов камеры, ничего не ломается и не бьётся.',
       '3) Всё, что участвует в событии, есть в списке предметов с первой секунды (лампы, окно, вентилятор, поливалки) — иначе модель дорисует новое.',
       '4) Нет слов, которые тянут в мультик или игрушку: toy, cartoon, model, miniature; нет «someone» и прочих намёков на людей.',
       '5) Всё, где бывают буквы (газета, карта, чертёж, экран, вывеска), — с пометкой «без текста». Котировки на экранах — только мелкие размытые цифры и стрелки, без букв.',
       '6) «Петля сама» — к концу как в начале; «тьма» — новое состояние держится до конца.',
       '7) Купюры — только мелко, сложенными или в тени. Крупно в кадре — никогда: у видео-нейронок крупные купюры выходят фальшивыми (так вышел «Волк»).',
       '8) Строка цвета (Grade) — только цвет, свет и настроение прилагательными. Предметы, люди, цитаты, насилие оттуда рисуются буквально: у «Волка» из «money-green; greed» жёлтый блокнот стал пачкой денег на кирпиче, конфетти — купюрами. Почищено в 27 промтах. Не тронуты похваленные (Ханна, праздник, Ральф) и главный «Волк» — у него слово в слово текст стоящего фона, где деньги и таблетки и должны быть.',
       '9) Богатое место — дорогие материалы и чистота (полированное дерево, стекло, латунь, кожа). Потёртости, пятна, «приглушённые цвета и зерно» — только где по сюжету бедно (мотель, квартира Трэвиса, подпол): у «Волка» они сделали офис нищим. Проверил все 37 — такие слова остались только там, где бедно по сюжету.','',
       'КАК ПРОГОНЯТЬ — как раньше: Google Flow → Veo 3.1, 9:16, 8 с, каждый английский блок — один промт целиком. Событие не ровно на 4-й секунде — не страшно, найду сам. Склейка или лишний предмет — перегенерь тот же промт, не дописывай.',
       'КУДА КЛАСТЬ: репо scenes → claude/субтитры/фоны/, имя — после «назови:» (те же, что в его файле). Дальше я: петля, событие реже, в приложение.','']
    g=None
    for r in R:
        if r['grp']!=g:g=r['grp'];L+=['',f'############ {g.upper()} ############','']
        L+=[f"=== {r['n']}. {r['title']} → назови: {r['file']}.mp4 ===",
            f"Брать: {r['take']}.",f"Почему: {r['why']}",f"Событие: {r['ev']}",f"Петля: {be.LOOP_RU[r['loop']]}.",'',r['prompt'],'','']
    open('фоны-промты-СРАВНЕНИЕ.txt','w',encoding='utf-8').write('\n'.join(L))
    json.dump(R,open('фоны-промты-СРАВНЕНИЕ.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
    print('готово:',cnt,'промтов',len(R))
