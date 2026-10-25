# Промты фонов «фото → оживить» (25.10, Андрей: «фильмам — 1 фон, сериалам — по фону на сезон, героям — арт с вики»).
# python3 tools/bg_prompts2.py  →  tools/bg-prompts.json (его читает страница prompts.html — см. ДЛЯ-ZAI-задание-25.10.md, часть В)
# Ключи: film:<код>, season:<код>:Sxx, person:<код>, hero:deadlock:<id>. К какому фону какие сцены — страница считает сама
# по полям shows (show сцены) и season (Sxx из начала поля ep у сцены): новая сцена встаёт в свой фильм или сезон без правок тут.
# Правила промтов: одна главная вещь крупно и резко, 2–4 предмета рядом, фон размыт; без людей, рук, лиц, надписей, логотипов,
# марок и кадров из фильма; без дыма и тумана (пар, пыль, марево — можно); деньги — только мелко, свёрнутыми или в тени;
# в оживлении двигается только перечисленное, у каждого движения видимая причина (ветер, вода, огонь, экран), конец = начало.
import json, os

PHOTO_TAIL = ('Vertical 9:16. A real 35mm film photograph: natural light, soft film grain, real materials with small imperfections, '
              'real-world sizes; not CGI, not a 3D render, not glossy. Shallow depth of field: the foreground is sharp, the background '
              'is softly out of focus. No people, no hands, no faces, no text, letters, numbers or logos anywhere.')
PHOTO_WIDE = ('Vertical 9:16. Looks like a frame from a 1990s film shot on 35mm: light from real lamps and the sky, rich contrast, slightly faded colors, '
              'visible film grain, deep focus, real-world scale. Not CGI, not a 3D render, not a miniature, not a stock photo, not an interior-design '
              'render; nothing is arranged for display; no perfect symmetry. No people, no hands, no faces, no text, letters, numbers or logos anywhere.')
ANIM_HEAD = 'Animate this exact image for 8 seconds. The camera is locked off: no zoom, no pan, no cuts. Only these things move, gently and continuously the whole time: '
ANIM_TAIL = ('Everything else stays perfectly still. The light does not change. Nothing new appears and nothing disappears; no people. '
             'The last frame is identical to the first frame, so the video loops seamlessly. No smoke, fog or mist.')
HERO = ('Animate this exact image of {name}. Keep the character 100% identical: same face, clothes, colors, pose and painted art style; '
        'any lettering on the image stays perfectly static. Locked camera: no zoom, no pan, no cuts; the background does not change. '
        '{act} The motion never stops and never freezes, and it ends in exactly the same pose as the first frame, so the video loops '
        'seamlessly; never play the motion backwards. On top: slow breathing and natural blinking. No morphing, no extra limbs, '
        'no new characters, no text.')

def photo(t, tail=PHOTO_TAIL): return t.strip() + ' ' + tail
# 25.10, Андрей: «с фото ебал — давай без»: один текст сразу в видео (Veo / Flow «Текст в видео»), без шага с картинкой
VIDEO_HEAD = 'An 8-second vertical 9:16 video, one continuous shot. The camera is locked off: no zoom, no pan, no cuts. The scene: '
VIDEO_TAIL = ('Everything else stays perfectly still. The light does not change. Nothing new appears and nothing disappears. '
              'The last frame is identical to the first frame, so the video loops seamlessly. '
              'Look: real 35mm film footage, natural light, soft film grain, real materials with small imperfections, real-world sizes; '
              'not CGI, not a 3D render, not glossy. Shallow depth of field: the foreground is sharp, the background is softly out of focus. '
              'No people, no hands, no faces, no text, letters or logos anywhere. No smoke, fog or mist. No rain streaks or water drops on any window glass. No music, no voices.')
def video(ph, an, wide=False):
    sc = ph.split(' Vertical 9:16.')[0].strip()
    mv = an[len(ANIM_HEAD):] if an.startswith(ANIM_HEAD) else an
    mv = mv[:-len(ANIM_TAIL)].strip() if mv.endswith(ANIM_TAIL) else mv.strip()
    tail = VIDEO_TAIL
    if wide:
        tail = tail.replace('Shallow depth of field: the foreground is sharp, the background is softly out of focus.',
                            'Like a frame from a 1990s film: light from real lamps and the sky, rich contrast, slightly faded colors, deep focus, real-world scale; '
                            'not a miniature, not a stock photo, not an interior-design render; nothing arranged for display; no perfect symmetry.')
    if 'only small blurry green digits' in ph:
        tail = tail.replace('no text, letters or logos anywhere', 'no text or logos; only small blurry green digits on the screens')
    return VIDEO_HEAD + sc + ' Only these things move, gently and continuously the whole time: ' + mv + ' ' + tail
def anim(t): return ANIM_HEAD + t.strip() + ' ' + ANIM_TAIL

ITEMS = [
 # ---------- фильмы: один фон на фильм (и на его немецкий дубляж) ----------
 # 25.10, v4. Андрей на v3 («Психопат»): «теперь вообще непонятно, что это Патрик — не под ноль же убирать»; «дождь, стекающий по окнам,
 # не делай — всегда хуйня». Правила v4: масштаб — от места (как v3) + 2–3 узнаваемые вещи из самых известных кадров фильма, но не напоказ:
 # лежат там, где им и место (газеты застилают пол, топор прислонён к стене в полутени); свет — живая лампа + город, а не тёмно-синяя муть;
 # никакого дождя и капель на стёклах (у улиц — мокрый асфальт после дождя).
 # v4.1: топор «прислонён к стене» вышел мутантом с двумя лезвиями и висел на стене → лежит на газетах, «одно лезвие»; + дождевик на подлокотнике.
 dict(key='film:wolf', kind='film', title='Волк с Уолл-стрит', shows=['Волк с Уолл-стрит', 'The Wolf of Wall Street'], test='сложный', wide=1,
  what='Аквариум с рыбкой и бутылка шампанского на ближнем столе, а за ними в глубину — огромный торговый зал после вечеринки: сотни зелёных мониторов, конфетти, бегущая строка на дальней стене.',
  moves='Рыбка плавает, мигают зелёные цифры, по дальней стене ползёт бегущая строка, в бокале бегут пузырьки.',
  photo=photo('A round glass fishbowl with one orange goldfish and an open champagne bottle with a half-full glass on the nearest desk, on '
   'the left of the frame. Behind them the camera looks deep into a huge trading floor of a 1990s brokerage firm at night right after a '
   'wild office party, nobody there: long rows of desks going far back, hundreds of boxy monitors glowing with small green digits, '
   'confetti and streamers on the desks and the carpet, loosened ties and suit jackets thrown over chairs, a long green ticker band on the '
   'far wall. Camera at seated eye level. Light: warm brass desk lamps and the green glow of the screens. Mood: money, excess and a hangover.',
   tail=PHOTO_WIDE.replace('no text, letters, numbers or logos anywhere', 'no text or logos; only small blurry green digits on the screens')),
  animate=anim('the goldfish swims slowly in its bowl; bubbles rise in the champagne glass; the small green digits on the screens '
   'flicker; the ticker band on the far wall scrolls slowly from right to left.')),
 dict(key='film:psycho', kind='film', title='Американский психопат', shows=['Американский психопат'], test='простой', wide=1,
  what='Белая квартира-пентхаус 1987 года ночью: пол и белый кожаный диван застелены газетами, на стерео крутится пластинка, на подлокотнике прозрачный дождевик, на газетах у дивана лежит топор; за огромными окнами — весь Манхэттен.',
  moves='Пластинка крутится, на стерео прыгают зелёные индикаторы, мерцают огни города за окном.',
  photo=photo('A white Manhattan penthouse apartment in 1987 at night, nobody there, seen at eye level from the back of the living room. '
   'The whole white floor and the long white leather sofa are carefully covered with spread newspapers, as if someone prepared the room '
   'for something messy. On a low white cabinet on the left: a silver stereo with glowing green level meters and a record turntable with '
   'a vinyl record on it. A transparent plastic raincoat is thrown over the arm of the sofa. On the newspapers on the floor in front of the '
   'sofa lies one ordinary fire axe: a single red steel head with one blade and a long plain wooden handle, lying flat. Behind the sofa, '
   'tall windows show the Manhattan skyline at night. Light: one warm floor lamp in the room and the cool city glow; clean dry glass. '
   'Mood: perfect, sterile, expensive, and something horrible is about to happen.'),
  animate=anim('the vinyl record spins on the turntable; the green level meters on the stereo bounce; the lights of the '
   'city twinkle far away. The axe, the raincoat and the newspapers do not move.')),
 dict(key='film:taxi', kind='film', title='Таксист', shows=['Таксист'], wide=1,
  what='Ночная улица Нью-Йорка 70-х после дождя с уровня тротуара: неон кинотеатров, мокрый асфальт в отражениях, пар из люка, у бордюра жёлтое такси с включёнными фарами.',
  moves='Из люка поднимается пар, неон мигает, в мокром асфальте дрожат отражения.',
  photo=photo('A street in 1970s New York at night right after the rain, seen from the sidewalk at eye level, nobody around. On the left, a '
   'yellow 1970s taxi cab stands at the curb with its headlights on. The street goes far into the distance between old buildings with '
   'glowing red and pink neon signs of movie theaters and bars, all unreadable and blurry. Thick steam rises from a manhole in the middle '
   'of the street. The wet asphalt mirrors all the neon. Light: neon and old street lamps. Mood: dirty, lonely and feverish.'),
  animate=anim('steam rises slowly from the manhole; the neon signs glow and blink softly; the neon reflections shimmer on the wet asphalt. '
   'No rain falls. The taxi stays parked.')),
 dict(key='film:titanic', kind='film', title='Титаник', shows=['Титаник', 'Titanic'], wide=1,
  what='Нос огромного лайнера 1912 года на закате с воды: острый нос режет волну, за ним весь корабль с четырьмя трубами на фоне золотого неба.',
  moves='У носа пенится волна, по воде бегут золотые блики, медленно плывут облака.',
  photo=photo('The bow of a huge 1912 four-funnel ocean liner at sunset, seen from the water slightly ahead and to the side, the camera low '
   'near the waves. The sharp black bow with its white railing at the very tip cuts through the sea toward the camera; behind it the long '
   'black hull and white superstructure stretch back, with the four tall buff funnels with black tops against a golden-orange sky. The '
   'decks are empty. Light: low golden sunset light from behind the ship, the sea glittering. Shot like a frame from a 1990s film, nothing '
   'glossy. Mood: grandeur and romance, the most famous moment on the ship.'),
  animate=anim('white foam curls at the bow where it cuts the water; golden glints run over the waves; the clouds drift very slowly. '
   'The ship stays in the same place in the frame. No smoke from the funnels.')),
 dict(key='film:bunker', kind='film', title='Бункер', shows=['Бункер'], wide=1,
  what='Разрушенная главная улица Берлина в апреле 1945-го в сумерках: выгоревшие дома по обе стороны, пожары, в конце улицы повреждённые Бранденбургские ворота, красное небо.',
  moves='Огни пожаров дрожат на стенах, вверх летят редкие искры.',
  photo=photo('The wide main avenue in the center of Berlin at dusk in April 1945, seen at eye level from the rubble, nobody around. On both '
   'sides, the burned-out shells of big old stone buildings with empty window holes; broken bricks and twisted metal on the road; fires '
   'glow orange inside some of the ruins. At the far end of the avenue stands the damaged Brandenburg Gate with its columns. A dark red sky '
   'above. No flags, symbols or insignia. Light: fire glow only. Mood: red, black and ash grey; the end of everything.'),
  animate=anim('the fire glow flickers on the broken walls; a few orange embers float up from the fires.')),
 # ---------- сериалы: по фону на сезон ----------
 dict(key='season:sopranos:S01', kind='season', title='Клан Сопрано', season='S01', shows=['Клан Сопрано', 'Die Sopranos'], wide=1,
  what='Задний двор большого дома в Нью-Джерси утром: в бассейне утка с утятами, на краю шезлонг с халатом и газетой, тарелка с хлебом; за ними газон, деревья и большой белый дом.',
  moves='Утки плавают по кругу, по воде рябь и блики, деревья качаются.',
  note='Утки — из самой сцены. Если утята выйдут кривыми — оставь одну утку.',
  photo=photo('The backyard of a big suburban New Jersey house on a spring morning, nobody around, seen from the edge of the swimming pool '
   'at eye level. On the water: a wild mallard duck and three ducklings. On the stone edge of the pool: a lounge chair with a white '
   'bathrobe and a folded newspaper, and a plate with slices of white bread for the ducks. Behind: a wide green lawn, tall old trees and the '
   'big white two-storey house. Light: soft morning sun through the trees. Mood: a calm family morning that feels fragile.'),
  animate=anim('the ducks paddle slowly in a small circle; ripples and sun glints move on the water; the tall trees sway in a light breeze.')),
 # 25.10, Андрей: «а мб про скачки?» — S04E09: сгорает Пай-О-Май, Тони убивает Ральфа. Сезон — конюшня (пасхалка — обогреватель у сена), кухня Ральфа — «момент» ниже
 dict(key='season:sopranos:S04', kind='season', title='Клан Сопрано', season='S04', shows=['Клан Сопрано', 'Die Sopranos'], wide=1,
  what='Конюшня Пай-О-Май ночью: гнедая скаковая кобыла в деревянном стойле, лампа над дверцей, тюки сена; в углу у сена светится старый электрообогреватель; на гвозде попона и уздечка.',
  moves='Лошадь дышит, прядёт ушами и машет хвостом, в луче лампы плавает пыль от сена, спирали обогревателя мерцают.',
  note='Обогреватель — намёк на пожар, огня в кадре нет. Лошадь вышла кривой — пусть просто стоит и дышит.',
  photo=photo('A small old wooden horse barn in the New Jersey countryside at night, nobody around, seen at eye level down the aisle. '
   'In the foreground stall, sharp: a beautiful bay racehorse mare with a white blaze, standing calmly with her head over the half-door. '
   'A single bulb in a metal cage hangs above the stall door. Stacked hay bales along the wooden wall, and in the corner next to the hay '
   'an old electric space heater with glowing orange coils. A horse blanket and a bridle hang on nails. Behind, out of focus: the dark '
   'aisle and an open barn door with the night outside. Light: the warm bulb and the orange glow of the heater. Mood: warm and quiet, '
   'loved and fragile, as if something bad will happen tonight.'),
  animate=anim('the mare breathes slowly, flicks one ear and swishes her tail; fine hay dust drifts slowly in the light of the bulb; '
   'the orange coils of the heater shimmer. Nothing catches fire.')),
 dict(key='season:sopranos:S06', kind='season', title='Клан Сопрано', season='S06', shows=['Клан Сопрано', 'Die Sopranos'], wide=1,
  what='Кабинка закусочной ночью: на столе корзинка луковых колец и настольный музыкальный автомат, за ней стойка, пустые табуреты и стеклянная дверь с колокольчиком.',
  moves='Огоньки автомата мигают, над кофе вьётся пар, за дверью мерцает красный неон.',
  photo=photo('Inside a small old New Jersey diner at night, nobody there, seen from a booth at seated eye level. On the table in the '
   'foreground: a basket of onion rings, a white mug of coffee and a small chrome tabletop jukebox selector with glowing song cards that '
   'cannot be read. Behind: the long counter with round chrome stools and, at the far end, the glass entrance door with a small bell '
   'above it and red neon outside in the dark. Light: warm diner lamps. Mood: an ordinary family evening that feels like the last one.'),
  animate=anim('the lights on the tabletop jukebox selector glow and blink softly; thin steam rises from the coffee; the red neon outside '
   'the door shimmers.')),
 dict(key='season:bb:S01', kind='season', title='Во все тяжкие', season='S01', shows=['Во все тяжкие', 'Breaking Bad'], wide=1,
  what='Бескрайняя пустыня Нью-Мексико на закате: на грунтовке старый автодом с открытой дверью, на ступеньке жёлтый защитный костюм; на кусте у края кадра — брюки; столовые горы, огромное небо.',
  moves='Брюки и сухая трава качаются от ветра, медленно плывут облака, над песком дрожит марево.',
  photo=photo('The New Mexico desert at golden hour, nobody around, seen at eye level from a dirt road. In the middle distance: an old 1980s '
   'white motorhome with faded brown stripes parked on the dirt road, its side door open, a yellow protective suit thrown on the metal '
   'step. In the near right corner: a pair of khaki trousers caught on a dry desert shrub. Around: endless flat desert, red mesas on the '
   'horizon and a huge sky with tall clouds. Light: low warm sun, long shadows. Mood: sun-baked yellow; a small man in a huge dangerous land.'),
  animate=anim('the khaki trousers and the dry grass sway in the hot wind; the clouds drift very slowly; heat haze shimmers above the sand.')),
 dict(key='season:bb:S02', kind='season', title='Во все тяжкие', season='S02', shows=['Во все тяжкие', 'Breaking Bad'], wide=1,
  what='Бассейн на заднем дворе в Альбукерке на рассвете: в воде плавает обгоревший розовый медведь без глаза; за забором крыши пригорода и горы.',
  moves='Медведь медленно дрейфует, рябь, по стенкам бассейна бегут блики.',
  photo=photo('A backyard swimming pool in Albuquerque at dawn, nobody around, seen at eye level from the patio. On the water, a little off '
   'center: a pink plush teddy bear, half burned and missing one eye, floating face up. Behind the pool: a low stucco wall, the flat roofs '
   'of the suburb and the long Sandia mountains glowing pink in the distance. Light: cold pale dawn, the pool glowing softly. Mood: quiet; '
   'something terrible has happened.'),
  animate=anim('the teddy bear drifts very slowly in a small circle; ripples spread from it; light patterns move on the pool walls.')),
 dict(key='season:bb:S04', kind='season', title='Во все тяжкие', season='S04', shows=['Во все тяжкие', 'Breaking Bad'], wide=1,
  what='Огромная подземная суперлаборатория: ряды стальных баков уходят вглубь, галереи, жёлтые защитные костюмы с противогазами на крюках, на столе подносы с голубыми кристаллами.',
  moves='Из клапана идёт пар, мигают лампочки на пульте, костюмы чуть качаются от вентиляции.',
  photo=photo('A huge underground industrial lab, nobody there, seen at eye level from the entrance. Rows of tall polished stainless-steel '
   'tanks and pipes go far back, with metal catwalks above. On the left, close: yellow protective suits with gas masks hanging on hooks. '
   'On a steel table in the middle: shallow metal trays filled with broken sky-blue crystal. Light: bright cold work lamps and small green '
   'and red indicator lights. Mood: clean, cold, enormous and secret.'),
  animate=anim('thin steam rises from one valve on a tank; the small indicator lights on a control panel blink; the yellow suits sway '
   'slightly in the air from a ventilation fan.')),
 dict(key='season:bb:S05', kind='season', title='Во все тяжкие', season='S05', shows=['Во все тяжкие', 'Breaking Bad'], wide=1,
  what='Огромная свалка в пустыне в сумерках: ряды сплющенных машин уходят к горам, открытый фургон с огромным круглым электромагнитом, розовое небо.',
  moves='Метёт пыль, качается сухая трава, мигает огонёк на далёкой вышке.',
  photo=photo('A big junkyard in the New Mexico desert at dusk, nobody around, seen at eye level. In the middle: an open box truck with a '
   'huge round industrial electromagnet inside, cables hanging from it, and a tall work light on a pole. Rows and stacks of rusty crushed '
   'cars go far back toward blue mountains under a pink sky; a radio tower with a red light far away. Light: the last pink daylight and '
   'one cold work light. Mood: tired, tough and dangerous.'),
  animate=anim('thin dust blows low across the ground; dry grass waves in the wind; the red light on the far radio tower blinks.')),
 # ---------- интервью: фон на человека ----------
 dict(key='person:durov', kind='person', title='Павел Дуров', shows=['Павел Дуров'],
  what='Открытое окно в старом доме Петербурга белой ночью: на подоконнике самолётики из купюр и один белый впереди; внизу проспект и колоннада собора.',
  moves='Занавеска качается на ветру, крылья самолётиков чуть дрожат, далеко внизу мерцают фонари.',
  photo=photo('A tall open window high up in an old building in the center of St. Petersburg during the white nights, the room empty. '
   'In the foreground, sharp, on the wide stone windowsill: a row of small paper airplanes folded from worn orange-red banknotes, their '
   'noses pointing out of the window, and one plain white paper airplane in the center, a little ahead of the others; a sheer white curtain '
   'at the side. Far below, out of focus: a wide old avenue with tiny glowing street lamps and a cathedral with a curved stone colonnade '
   'under a pale blue-pink sky. Light: the pale white-night sky and warm lamps below. Mood: young, free and defiant.'),
  animate=anim('the sheer curtain sways slowly in the breeze; the paper wings tremble slightly in the same breeze; the street lamps far '
   'below twinkle.')),
 dict(key='person:clavicular', kind='person', title='Clavicular', shows=['Clavicular'],
  what='Ванная в майамской высотке ночью: зеркало с лампами, на мраморе миска со льдом, дермароллер, тренажёр для челюсти, телефон с кольцевой лампой; в окне пальмы и неон.',
  moves='Лёд в миске тает и по стеклу сползают капли, за окном качаются пальмы, неон мягко пульсирует.',
  photo=photo('The bathroom of a Miami high-rise apartment at night, turned into a looksmaxxing station, empty. In the foreground, '
   'sharp, on a white marble counter: a glass bowl of ice cubes, a microneedling derma roller, a silicone jaw exerciser and a few skincare '
   'bottles with no labels; a smartphone on a small tripod with a glowing ring light. Behind, out of focus: a big mirror framed with round '
   'bulbs reflecting only the dark room and a small window with Miami towers, palm trees and pink-purple neon. Light: warm mirror bulbs, the '
   'ring light and pink-purple neon. Mood: clinical white and hot pink; obsession with the mirror.'),
  animate=anim('the ice cubes slowly melt and droplets slide down the glass bowl; the palm trees outside the small window sway; the '
   'pink-purple neon outside pulses softly.')),
 # ---------- моменты: культовые кадры не за прохождение (как выдавать — решает Андрей) ----------
 dict(key='moment:sopranos:ralph-kitchen', kind='moment', title='Клан Сопрано · кухня Ральфа', season='S04', shows=['Клан Сопрано', 'Die Sopranos'], wide=1,
  what='Кухня Ральфа ночью сразу после драки: опрокинутый стул, на кафеле сковородка и жёлтый баллончик от тараканов, рядом лежит парик; на плите кастрюля, из неё идёт пар.',
  moves='Пар из кастрюли, капает кран, секундная стрелка часов на стене идёт.',
  note='Тони брызгает Ральфу в глаза средством от насекомых, у Ральфа слетает парик. Людей и крови в кадре нет. Veo откажет из-за насилия — убрать парик и баллончик.',
  photo=photo('A suburban New Jersey kitchen in 2002 at night, right after a fight, nobody there, seen at eye level from the doorway. '
   'On the beige tile floor, sharp: a kitchen chair knocked over on its side, a frying pan upside down, a yellow spray can of bug spray with '
   'no label, and a man\'s dark hairpiece lying on the tiles. On the stove behind: a pot of pasta sauce simmering with a little steam. '
   'A round clock on the wall, a dripping faucet over the sink, cabinets of light wood. Light: the cold ceiling light of the kitchen and '
   'the dark window. Mood: sudden silence after something terrible; ordinary home, wrong at once.'),
  animate=anim('a thin wisp of steam rises from the pot on the stove; a drop of water falls from the faucet now and then; the second hand '
   'of the wall clock ticks around. The chair, the pan, the can and the hairpiece do not move.')),
]

for it in ITEMS:
    if it.get('wide') and it.get('photo','').endswith(PHOTO_TAIL): it['photo'] = it['photo'][:-len(PHOTO_TAIL)] + PHOTO_WIDE
    if it.get('photo') and it.get('animate'): it['video'] = video(it['photo'], it['animate'], it.get('wide'))

# ---------- герои Deadlock: картинка — арт с вики (полный рост), промт — только «оживить» ----------
HEROES = [
 ('venator', 'Venator', 'He stands in his pose chewing his cigar, thin smoke curling from it. Halfway through he fires the grenade launcher once: a bright muzzle flash and a short puff of smoke from the barrel, his shoulders take the heavy recoil, the rosary swings — then he settles back into exactly the starting pose while thin smoke drifts from the barrel.', True),
 ('rat-king', 'Rat King', 'He sits on his scrap-metal throne with a smug smirk. The rats around him keep moving the whole time in their places — scurrying, twitching whiskers, lashing tails. He slowly turns his head to look over his rats and back to the camera and taps the armrest with his claws; his crown and gold chains glint, the red moon glows behind him.', True),
 ('rem', 'Rem', 'The sleepy cat spirit floats in place. It slowly lifts the teal candle, the flame flickers and grows brighter, then lowers it back while its heavy eyelids close halfway and open again; stars twinkle and clouds drift slowly across the big moon.', True),
 ('grey-talon', 'Grey Talon', 'The old archer slowly raises his bow and half-draws the string, aims for one breath, then eases the string and lowers the bow back to exactly the starting pose; his braided white hair and beard sway in the breeze, leaves drift behind him.', True),
 ('celeste', 'Celeste', 'She twirls her glowing star-tipped wand in one slow circle, a trail of sparkles follows it and glowing tarot cards drift around her; she gives a slow playful wink, and the wand comes back to exactly the starting position; strands of her purple hair sway.', True),
]
# черновики Z.ai (tools/dd-prompts.html) — действие одной строкой; перед генерацией переписать полным кругом, как у пяти выше
DRAFT = {
 'abrams': 'he cracks his knuckles, cape drifts, ember particles, vampire smirk', 'apollo': 'golden light rays behind him, confident grin, laurel dust',
 'baba': 'gentle floating fabric, soft mystic glow, slow hover', 'bebop': 'robotic servos whir, antenna light blinks, hook arm swings, friendly eye glow',
 'billy': 'bat shadow flutters behind, fanged grin, dramatic cape flick', 'calico': 'cat rubs against her leg, ribbon sways, playful paw sparkle',
 'doorman': 'he slides a golden key across, chandelier light flickers, polished grin', 'drifter': 'cigarette smoke curls, red eyes glow, long coat sways',
 'dynamo': 'gravity orb hums above his palm, coat flaps, faint equations glow', 'graves': 'lich hand glows violet, ghost wisps curl, silver hair drifts',
 'haze': 'blades glint, eyes shine, coat sways', 'holliday': 'sheriff badge glints, lasso spins at her side, desert dust drifts',
 'infernus': 'flames rise from his shoulders, embers swirl, fire crackles', 'ivy': 'stone wings spread slightly, dust falls, kind smile, city lights behind',
 'kelvin': 'frost sparkles drift, ice crystals grow on his shoulders, frosty breath', 'lady-geist': 'blood-red crystal pulses, surgical glow, elegant gown sways',
 'lash': 'spectral purple energy crackles around his fists, taunting grin', 'mcginnis': 'spanner spins in her hand, turret light blinks, sparks fly',
 'mina': 'bat wings flutter behind, candlelight flickers, aristocratic smirk', 'mirage': 'sand spirals around him, golden light, jewels glint',
 'mo-krill': 'sand puffs as they half-dive underground, helmet light glints', 'paige': 'magic runes circle her hand, book pages flutter, warm glow',
 'paradox': 'time particles spiral, clock hands blur behind, teal vortex glow', 'pocket': 'suitcase glows green, a single crow feather drifts, hidden face tilts',
 'seven': 'electric arcs crackle between his fingers, storm glow, hair sparks', 'shiv': 'toxic green drips from his blade, restless fidget',
 'silver': 'silver bullets spin in her palm, moonlight glints on the revolver', 'sinclair': 'stage-light glow, showman card flourish',
 'victor': 'steam hisses from armor vents, iron plating glows', 'vindicta': 'crows circle behind her, spirit ravens glow blue, hair floats',
 'viscous': 'goo body wobbles softly, bubbles pop inside, cheerful bounce', 'vyper': 'venom drips, snake eyes glow, coils shift',
 'warden': 'mystic flask glows teal, trench coat sways, cold light', 'wraith': 'tarot cards fan out and glow purple',
 'yamato': 'katana shimmers with power aura, petals drift, sword stance',
}
for hid, name, act, ok in HEROES:
    ITEMS.append(dict(key=f'hero:deadlock:{hid}', kind='hero', game='deadlock', hero=hid, title=name, draft=not ok,
        art=f'deadlock.wiki → {name} → Gallery: арт в полный рост, без надписей', animate=HERO.format(name=name, act=act)))
for hid, act in DRAFT.items():
    name = ' '.join(w.capitalize() for w in hid.replace('-', ' ').split()).replace('Mcginnis', 'McGinnis').replace('Mo Krill', 'Mo & Krill')
    ITEMS.append(dict(key=f'hero:deadlock:{hid}', kind='hero', game='deadlock', hero=hid, title=name, draft=True, act_draft=act,
        art=f'deadlock.wiki → {name} → Gallery: арт в полный рост, без надписей',
        animate=HERO.format(name=name, act='Action: ' + act + '.')))

OUT = dict(v=1, updated='2026-10-24',
  how=['Без фото (25.10): поле video — один текст сразу в видео (Flow → «Текст в видео» / Veo, 9:16, 8 с). Поля photo и animate — запасной путь «фото → оживить».',
       'Фото (не для героев): Gemini или Google Flow (labs.google/flow), формат 9:16, 3–4 варианта — выбери один, где всё на месте и нет пластмассы.',
       'Оживить: Flow → «Кадры в видео»; первый кадр и последний кадр — это же фото (у героя — арт с вики), 8 секунд.',
       'Нет поля «последний кадр» — только первый; петлю склеит Z.ai или Claude (tools/loop_bg.py).',
       'Готовый ролик отдай Z.ai: он склеит петлю, зальёт в R2 и отметит «залит». В приложение ставит Claude.',
       'Плохо вышло — не дописывай промт: скинь кадр Claude, скажи, что не так.'],
  rules=['Фильму — один фон (немецкий дубляж берёт тот же). Сериалу — один фон на сезон. Интервью — один фон на человека. Героям — арт с вики.',
         'Начни с теста: «простой» (Психопат) и «сложный» (Волк). Выйдут нормально — делай остальные.',
         'Без людей, рук, лиц, надписей, логотипов и марок; без дыма и тумана; деньги — только мелко.'],
  photo_tail=PHOTO_TAIL, video_head=VIDEO_HEAD, video_tail=VIDEO_TAIL, anim_head=ANIM_HEAD, anim_tail=ANIM_TAIL, hero_template=HERO,
  items=ITEMS)
p = os.path.join(os.path.dirname(__file__), 'bg-prompts.json')
open(p, 'w', encoding='utf-8').write(json.dumps(OUT, ensure_ascii=False, indent=1) + '\n')
print(p, len(ITEMS), 'фонов/героев:', sum(1 for x in ITEMS if x['kind'] != 'hero'), '+', sum(1 for x in ITEMS if x['kind'] == 'hero'))
