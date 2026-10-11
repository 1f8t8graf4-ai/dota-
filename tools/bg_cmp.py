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

def tail3(body):
    money=any(w in body for w in ('bill','banknote','cash'))
    return ("Rules: the camera is locked off and never moves, no cuts, no zoom; apart from the event, the light stays the same. "
            "Photorealistic live-action footage with real materials and real-world sizes"+(" (banknotes look like real worn paper money)" if money else "")+
            "; every object stands or lies naturally where it belongs, no extra objects; no people, no faces, no hands, no text, letters or logos anywhere. "
            "Vertical 9:16, full-bleed, no black bars, borders or film frame.")

# take='his' — его промт как есть; take='mix' — текст (base: mine/his, ключ mk) + правки + новое событие (ev: [время, текст])
V={
1:dict(take='mix',base='his',edits=[("; a small white toy model of a 1980s Lamborghini Countach","")],
  calm="Calm: the goldfish hovers in place, waving its fins; the rows of monitors glow dim green; a thin haze hangs in the lamp light.",
  ev=('00:04-00:05',"All the monitors across the whole trading floor flare bright green at once and flicker with rising green bars, with no numbers and no text — the market just exploded; the whole floor glows green."),
  after="The monitors stay bright green across the floor; the goldfish keeps hovering in the green light.",loop='тьма',
  why="Сотни летящих купюр нейронка не тянет — выходят пластиковые (ты это и увидел). И слово toy («игрушечная Ламборгини») делает игрушечным весь кадр. Беру его стол (он чище: без таблеток и шампанского), машинку убираю. Событие — светом: все мониторы зала разом вспыхивают зелёным, рынок взлетел. (Сначала было «ручка сама катится к краю» — убрал после сыра у Клава: предмет, который двигается без причины, выглядит тупо.)",
  ru="Все мониторы в зале разом вспыхивают ярко-зелёным — рынок взлетел, весь зал светится зелёным."),
2:dict(take='his',why="Текст — мой похваленный, слово в слово. Событие из этой же сцены (Ханна бьёт себя в грудь): стол дрожит, мартини идёт кругами — дрожь и рябь нейронка рисует хорошо."),
3:dict(take='mix',base='mine',mk='wolf-swiss-bank',
  calm="Calm: the tropical fish drift slowly in the aquarium, the fountain plume sways in the wind, a wisp of steam rises from the espresso.",
  ev=('00:04-00:06',"Out in the window the lake fountain surges: its white plume shoots much higher into the sky, a wide veil of spray drifts in the wind and a bright rainbow appears in the mist."),
  after="The plume slowly sinks back to its usual height and the rainbow fades; the office is calm again, exactly as at the start.",loop='сама',
  why="Он убрал аквариум и стол банкира — а аквариум реально в сцене, и твой ролик с ним уже вышел хорошо (стоит в приложении). Событие у него хорошее — фонтан и радуга («с финансовой точки зрения вы в раю»): вода и свет. Беру мой кабинет + его событие.",
  ru="Фонтан за окном бьёт выше, в брызгах встаёт радуга, потом опадает."),
4:dict(take='mix',base='mine',mk='wolf-naomi-de',edits=[("a folded white napkin.","a folded white napkin and a plain gold wedding band lying flat on the white tablecloth between the glasses."),
  ("dark red brick walls, more little","dark red brick walls with a small window onto the dark night street, more little")],
  calm="Calm: reflections shimmer softly in the glasses, a drop of condensation slides down the cocktail glass.",
  ev=('00:04-00:05',"The headlights of a passing car sweep through the window across the table: the gold wedding band flashes brightly for a moment in the middle of the white cloth."),
  after="The light moves on and the restaurant is dim again, exactly as at the start; the ring lies in the soft lamp light.",loop='сама',
  why="Кольцо стоит на ребре, потом катится дугой и крутится — физику мелкой монетки нейронки рисуют криво. Беру мой стол + кольцо просто лежит, его выхватывает свет фар — «ты же женат?» светом.",
  ru="Свет фар проезжающей машины проходит по столу — обручальное кольцо ярко вспыхивает."),
5:dict(take='mix',base='mine',mk='film-sopranos-b',
  calm="Calm: a thin thread of smoke rises only from the tip of the cigar, steam rises from one espresso cup, the pink pig neon hums softly.",
  ev=('00:04-00:05',"The pink neon pig in the shop window flickers, buzzes, sputters and goes dark."),
  after="The shop window is dark without the pink glow; the cigar smoke keeps rising in the cold dawn.",loop='чёрный',
  why="Ты просил главный фон про весь сериал, а не только про Тони, — а он вернул кухню. Беру мою лавку Сатриале (тут сидит вся банда все 6 сезонов) + его же прошлую идею: неоновая свинья гаснет, и в конце — резко чёрный экран, как в финале сериала (чёрное добавлю сам). Кухня с утками у тебя уже стоит; если оставить её — его №5 тоже норм: утки улетают, птиц Veo рисует нормально.",
  ru="Неоновая свинья в витрине мигает, трещит и гаснет — потом резко чёрный экран."),
6:dict(take='mix',base='mine',mk='sopranos-s01e01',
  calm="Calm: dust specks drift in the lamp light, tree leaves move gently behind the blinds.",
  ev=('00:04-00:06',"The floor lamp slowly dims almost to darkness, as if someone in the room is fainting; the office sinks into brown shadow."),
  after="The lamp slowly comes back to full warm light; the room is calm again, exactly as at the start.",loop='сама',
  why="«Картинка темнеет от краёв и плывёт» — это эффект камеры, Veo делает его непредсказуемо. Беру мой кабинет (по нему у тебя уже стоит ролик) + торшер гаснет почти до темноты и возвращается — тот же обморок Тони, но светом.",
  ru="Торшер медленно гаснет почти до темноты (обморок Тони) и снова разгорается."),
7:dict(take='mix',base='mine',mk='sopranos-s06e09',
  calm="Calm: the ribbons with the pinned bills sway only slightly in a light breeze, the bulbs twinkle softly, the distant Ferris wheel turns slowly.",
  ev=('00:04-00:05',"In the far background the carnival ride jolts to a sudden stop, and all the strings of colored bulbs above the street flicker off for a moment."),
  after="The bulbs flicker back on one string after another; everything is calm again, as at the start.",loop='сама',
  why="Текст — мой, тот, что дал «нихуя себе». Его событие почти норм, но ленты с деньгами «треплет» — опять летающие деньги. Беру: аттракцион в глубине встаёт, гирлянды на секунду гаснут.",
  ru="Аттракцион в глубине резко встаёт, гирлянды над улицей на секунду гаснут и загораются."),
8:dict(take='mix',base='mine',mk='sopranos-arc',edits=[("a glowing home aquarium with a few tropical fish.","a glowing home aquarium with a few tropical fish and one small grey reef shark.")],
  calm="Calm: the fish and the little shark swim slowly, bubbles rise from the aquarium filter, smoke rises only from the tip of the cigarette, raindrops run down the window.",
  ev=('00:04-00:05',"A flash of lightning outside the rainy window lights up the whole room bright white for an instant; the aquarium light flickers."),
  after="The room is dim again, the rain keeps running down the window, the little shark keeps circling.",loop='сама',
  why="Акула с разгона бьётся в стекло, поднимается облако песка — физика удара, выйдет фальшь. Беру мой стол с машинкой (сценарий — его «арка»), в аквариум — акулку (как у него, из фразы Мелфи), событие — вспышка молнии за дождливым окном.",
  ru="За дождливым окном сверкает молния — комната на миг белая, в аквариуме кружит акулка."),
9:dict(take='his',why="Мой лучший промт, слово в слово + на телике скачки сменяются огнём (сгорит конюшня Пай-О-Май). Смена картинки на экране — это у Veo выходит чисто."),
10:dict(take='mix',base='mine',mk='sopranos-mahaffey-de',
  calm="Calm: thin steam rises from the spilled coffee, the long willow branches sway gently in the wind.",
  ev=('00:04-00:05',"The sedan's headlights flash on bright and its engine revs hard: a thick puff of grey exhaust bursts from the tailpipe; the car stays where it is."),
  after="The engine settles back to idle, the headlights switch off, the exhaust drifts away across the lawn, as at the start.",loop='сама',
  why="Машина едет и давит стаканы — движение машины и лопающиеся стаканы нейронка ломает. Беру мой кадр: машина стоит, фары вспыхивают, мотор рычит, клуб выхлопа.",
  ru="У машины на газоне вспыхивают фары, рычит мотор, вылетает клуб выхлопа."),
11:dict(take='mix',base='mine',mk='sopranos-hasid-de',edits=[("a black wide-brimmed felt hat left lying on the counter;","a black wide-brimmed felt hat left lying on the counter; a paper cup of black coffee;")],
  calm="Calm: the vertical blinds sway very slightly in the air from a fan, fine dust floats in the daylight.",
  ev=('00:04-00:06',"Three slow, heavy, ground-shaking thuds, like the footsteps of a giant coming closer: with each one, rings jump across the coffee in the cup, the service bell trembles and rings once, the black hat twitches on the counter."),
  after="The thuds stop; the rings in the coffee fade and everything is calm again, exactly as at the start.",loop='сама',
  why="Он перенёс сюда лавку Сатриале — а она у главного фона «Сопрано», будет повтор. Беру мой мотель (3-й эпизод: тут «договариваются» с зятем) + его «голема»: три тяжёлых удара, кофе кругами, звонок дзынькает — дрожь и рябь.",
  ru="Три тяжёлых удара, как шаги великана (голем): кофе в стакане кругами, звонок на стойке дзынькает."),
12:dict(take='mix',base='his',
  calm="Calm: a thin wisp of steam rises from the espresso, the lace curtains glow softly.",
  ev=('00:04-00:06',"A single dark drop of coffee runs down the outside of the cup, drips off the saucer onto the white pocket square, and a dark brown stain slowly blooms through the white silk."),
  after="The dark stain keeps spreading through the white cloth; the steam keeps rising from the espresso.",loop='тьма',
  why="Чашка трескается пополам — разрушение у нейронок выходит пластилином. Беру его кафе (точнее моего, по кадру) + капля кофе падает на белый платок и расползается тёмным пятном — «обезглавить» без крови.",
  ru="Капля кофе стекает с чашки на белый платок — по шёлку расползается тёмное пятно."),
13:dict(take='his',why="Чище моего (убрал визитки и крем — у них своя сцена). Событие — свет щёлкнул, и вешалка пустая, топора нет: простой трюк, всю работу делает темнота. Если плащ не пропал — перегенерь тот же промт."),
14:dict(take='his',why="Он прав: у Бейтмана стол из тёмного дерева, не стекло. Одна красная капля в минералку — одна капля и вода, выходит хорошо, и сразу «психопат» без крови."),
15:dict(take='his',why="Переговорная как в кадре (у меня был стол под софитом и виски, которого в сцене нет). Событие светом: полоска солнца переползает на визитку."),
16:dict(take='his',why="Та же комната, что у тебя уже стоит. Ливень по стеклу — то, что нейронки рисуют лучше всего, и это самая известная реплика Трэвиса («придёт настоящий дождь»)."),
17:dict(take='his',why="Мой текст + дворники встают и улицу заливает белый свет — механика простая, событие прямо из текста сцены («и вдруг — перемена»)."),
18:dict(take='mix',base='mine',mk='taxi-driver-betsy',
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
  ev=('00:04-00:06',"The sun disappears below the horizon: the warm orange glow drains from the sky and the whole scene turns cold icy blue; the round deck lamps along the railing switch on one after another."),
  after="Cold blue night; the deck lamps glow and the pale iceberg ahead looks closer in the mist.",loop='тьма',
  why="Корабль трясёт, глыбы льда с грохотом катятся по палубе — тряска и куча обломков. Беру мой нос корабля на закате (по нему у тебя стоит ролик) + солнце садится, всё становится ледяным синим, зажигаются лампы: любовь → катастрофа, светом.",
  ru="Солнце садится — всё за секунду становится ледяным синим, вдоль борта зажигаются лампы."),
22:dict(take='mix',base='mine',mk='titanic-boat',
  calm="Calm: the empty lifeboat sways slightly on its ropes, cold mist drifts over the water far below.",
  ev=('00:04-00:06',"The power fails: the round deck lamps and the lit portholes flicker and go out one after another along the deck, until only the cold blue night is left."),
  after="Almost dark; the empty lifeboat keeps swaying on its ropes against the black sea.",loop='тьма',
  why="Шлюпку рывками спускают вдоль борта, камера смотрит отвесно вниз — большой механизм в движении, нейронка запутается. Беру мою палубу + корабль обесточивается: лампы гаснут одна за другой.",
  ru="Корабль обесточивается: лампы и иллюминаторы гаснут один за другим, шлюпка качается в темноте."),
23:dict(take='mix',base='mine',mk='titanic-andrews-de',edits=[("a pencil and a brass ruler;","a pencil, a brass ruler and a glass of water;"),("a brass desk lamp;","a brass lamp hanging low above the table on a short chain;")],
  calm="Calm: the pocket watch's second hand ticks, the water in the glass is perfectly still.",
  ev=('00:04-00:05',"The ship lurches toward the bow: the brass lamp swings hard, its pool of light sliding over the blueprint; the water in the glass tilts and slops over the rim; the pencil rolls off the table."),
  after="The lamp keeps swinging slowly; the water in the glass settles at a slant; the watch keeps ticking.",loop='тьма',
  why="Вся комната кренится и всё едет — по сути двигается весь кадр. Беру мою каюту + толчок: лампа качается, вода в стакане встаёт наискось, один карандаш укатывается.",
  ru="Корабль кренится: лампа качается, вода в стакане встаёт наискось, карандаш укатывается."),
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
28:dict(take='his',why="Мой текст + лампочка вспыхивает и лопается, подпол уходит в темноту — светом."),
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
32:dict(take='his',why="Без камер на штативах (у меня были — лишнее). Жалюзи поднимаются, комнату заливает солнце, за окном Дубай — событие светом."),
33:dict(take='his',why="Чище моего (убрал молоток, шприцы, лёд — лишнее и «острое»). Выход в эфир: лампы вокруг зеркала включаются по кругу — светом."),
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
            body,grade=mine_body(v['mk']) if v['base']=='mine' else his_body(e)
            for a,b in v.get('edits',[]):
                assert a in body,(n,a);body=body.replace(a,b)
            t0,t1=v['ev'];t2='00:05-00:08' if t0.endswith('05') else '00:06-00:08'
            seg=[('00:00-00:04',v['calm']),(t0,t1),(t2,v['after'])]
            take=('мой текст' if v['base']=='mine' else 'его текст')+' + другое событие';ev_ru=v['ru'];loop=v['loop']
            if n in (3,25):take='мой текст + его событие'
        tl=' '.join(f'[{a}] {b}' for a,b in seg)
        p=f"{body} Grade: {grade} Timeline — one continuous shot, the same framing for all 8 seconds: {tl} {tail3(body)}"
        out.append(dict(n=n,grp=e['grp'],kind=e['kind'],title=e['title'],file=e['file'],where=e['where'],take=take,why=v['why'],ev=ev_ru,loop=loop,
                        seam=be.LOOP_SEAM[loop],prompt=p))
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
