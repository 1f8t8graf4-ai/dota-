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
# 25.10, Андрей: Venator в Veo развернулся лицом в камеру («хочу, чтобы он просто дорисовывал фон, не разворачивая персонажа»).
# Причины: 1) «the background does not change» — а кадр видео шире арта (арт ~1.15:1, видео 16:9, по краям прозрачное/чёрное),
# модель всё равно рисует края и заодно «перерисовывает» героя по центру; 2) не сказано, куда смотрит голова — модель ставит фронтально;
# 3) крупное действие (жуёт сигару + отдача на плечи) = смена позы. Теперь: голова и взгляд — как на арте, герой стоит на том же месте
# и того же размера, пустые/чёрные края — продолжение фона арта; двигается только то, что УЖЕ нарисовано (без новых птиц, лепестков и т. п.).
HERO = ('Animate this exact image of {name} from the game Deadlock. It is a finished 16:9 frame: the painted artwork in the middle and a soft '
        'blurred fill at the sides. Keep the whole frame exactly as it is: same framing, same size and position of the character, nothing '
        'is cropped, zoomed, extended or repainted; the blurred sides stay soft and still and no creature ever appears in them. Keep the character exactly as drawn: same face, '
        'same head angle and gaze direction, same pose, same clothes, colors and painted art style. {who} never turns toward the camera and '
        'never turns away. Locked camera: no zoom, no pan, no tilt, no cuts. Below, every creature and every moving thing is '
        'named separately with its place in the picture: each one stays in exactly that place for the whole clip, keeps its own look and '
        'does only its own action; nothing disappears, nothing merges with another thing, nothing multiplies. {act} Spread these actions over the whole clip: one small '
        'action about every two seconds, never all at once and never a still pause; keep these actions between second 1 and second 7, the first and the last second have only the gentle idle motion. Anything that moves to another spot moves there continuously along its way and is visible every moment: nothing vanishes and pops up somewhere else. On top, small living idle motion the whole time: the '
        'chest rises and falls clearly with slow breathing, the shoulders shift slightly, the fingers flex a little, the weight shifts '
        'slightly, the eyes glance a little to the side and back, the head makes one small nod or tilt and returns, hair and clothing '
        'move a little, natural blinking. In the last second everything eases back into exactly the first-frame pose. Everything moves slowly and continuously and the last frame is identical to the first, '
        'so the video loops seamlessly; never play the motion backwards. No morphing, no new characters, creatures or objects, no extra '
        'limbs or fingers, no text; any lettering in the art stays perfectly static.')
# 25.10, Андрей: Венатор с размытыми боками вышел «ахуенно», но бока — докрасить нейронкой (потом такие кадры можно давать игрокам).
# Шаг 1 — картинка (Gemini / Flow «картинка»): дорисовать размытые бока. Шаг 2 — оживить уже готовый кадр (HERO2).
HERO_EXT = ('Edit this image of {name} from the game Deadlock. Keep the sharp painted artwork in the middle exactly as it is: the same '
            'character, pose, face, colors and every detail, at the same size and position; do not redraw, move or crop it. Repaint only '
            'the soft blurred areas on the left and right and any blurred patches around the character as a sharp continuation of the '
            "artwork's own background: the same painted style, colors, brushstrokes, shapes, halftone dots and light, so it looks like one "
            'complete 16:9 illustration. No new characters, creatures, objects, text or logos. Keep the 16:9 format.')
HERO2 = (HERO.replace('It is a finished 16:9 frame: the painted artwork in the middle and a soft blurred fill at the sides.', 'It is a finished 16:9 painted frame.')
         .replace('; the blurred sides stay soft and still', '; the background stays in place'))
HERO_NEG = ('Avoid: turning to the camera, front view, camera pan up or down, tilt, crop, new pose, character redraw, re-centering, zoom, camera movement, '
            'cuts, morphing, warping, face change, extra limbs, extra fingers, melting, style change, 3D render look, new objects, '
            'new animals, teleporting, a creature popping up in another place, a creature or object disappearing, two creatures merging into one, creatures multiplying, a creature turning into a picture, '
            'text, watermark, flicker, glitch, blur, sudden movement, reversed motion, a held object turning into a pillow or cushion, a sad face.')

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

# ---------- герои Deadlock: картинка — полный арт (ветка zai/hero-arts, heroes-arts/NN-Имя/<id>-full.png), промт — только «оживить» ----------
# Действие — только то, что уже нарисовано на арте (смотрел все 44 арта 25.10). he/she/it — для слова «{who}».
# 25.10, Андрей: «на спине у него крыса сидит — тупо как картинка», «не смешивай их в кучу».
# ПРАВИЛО для act: каждое существо и каждая движущаяся вещь — ОТДЕЛЬНЫМ предложением: что это (цвет, размер),
# где именно на арте («на спине у плаща», «над краем куска пиццы справа»), «stays there» и своё маленькое действие.
# Никогда «the rats / the birds / the bats around him» одной фразой — модель сливает их, теряет или застывает картинкой.
# Ходить можно (в первом промте крысы ходили — было норм), но вернуться на своё место; первым — сам герой.
HEROES = [
 ('venator', 'Venator', 'He', 'Venator himself: his head stays turned to the right with the same smirk; the cigar ember glows and a thin wisp of smoke curls up from it. The grenade launcher in his raised hand: the candle-like flame on its top flickers; once, halfway through, it gives one short recoil with a bright flash at its muzzle, only his arm takes the kick and returns, his head and body stay as they are. The rosary hanging from the launcher: sways slightly. The censer hanging on a chain at the bottom left: swings a little and a thin wisp of incense rises from it. The gray halo behind his head: its rays shimmer slowly.'),
 ('rat-king', 'Rat King', 'He', "Timeline, every action small and returning to the start: Around second 1, Ronnie pops up for the first time: Ronnie is the small white-faced rat behind the pizza slice on the right pipe; at the start only its ears and eyes show over the top edge of the slice; it rises behind the slice until its head and shoulders show, looks to the left, and sinks back down to exactly the starting peek. Around second 2, the beige rat on top of his back turns its head and sniffs the air: it is the light brown rat sitting high on top of his back behind his white mane, and it stays sitting right there. Around second 3, the Rat King slowly grins wider so his long yellow front teeth show more, then relaxes his mouth, and blinks his eye slowly. Around second 4, Ronnie pops up a second time, looks to the right, and sinks back down. Around second 5, the beige rat on top of his back turns its head the other way and twitches its ears, still sitting in its place. Around second 6, Ronnie pops up a third time, sniffs the top of the pizza slice and sinks back to the starting peek; at the same moment the King's clawed fingers on the pipe drum once. From second 7 to the end it is calm and everything settles back exactly as in the first frame. The whole time the Rat King is clearly alive: his chest and big belly rise and fall with slow heavy breathing, his shoulders lift a little with every breath, his whiskers twitch, his big ears twitch now and then, his red cape sways and billows in a slow draft, swinging out and back, the light on his crown flickers; he keeps looking where he looks in the art and does not turn. Ronnie only moves up and down behind the slice and never leaves it. The beige rat never crawls, never leaves the top of his back and keeps its warm light brown color and its size the whole time. The two rats never swap places and never swap colors: the white-faced Ronnie is always behind the pizza slice on the right, the light brown rat is always on top of his back. Things that stay put: his long tail stays where it is on the left, only its tip curls slowly, no other tail appears. The brown rat lying on his left wrist stays the same small size and only lifts its head once. The gray rat in the round hole of the pipe under the pizza stays inside the hole and only twitches its nose. The small rat peeking from behind the pipe at the bottom left and the dark rat at the bottom front stay where they are and only twitch their noses. The number of rats never changes: exactly the six small rats of the art, no new rat appears at any moment, not even at the end."),
 ('rem', 'Rem', 'He', "Timeline, every action small and returning to the start. What Rem holds: the dark-blue cloth at the very top edge of the frame is the lower part of his open umbrella: thin rain-umbrella fabric gathered around the umbrella's curved handle, and his raised arm at the upper right of his body grips that handle. It stays a thin umbrella the whole clip: it is never a pillow, cushion, blanket, bag or balloon, it never grows, never comes lower into the picture and never covers him. Around second 1, the umbrella fabric flutters in a light breeze and Rem drifts a little to the right under it, then back. Around second 2, the candle flame on the small dish in his other paw at the left flickers and leans, and its teal glow brightens on his face and sleeve. Around second 3, Rem blinks his big round white eyes slowly. Around second 4, the small dark bat-like companion with the little pointed hat, floating at the right of Rem, flaps its tiny wings in place and blinks; it stays exactly at the right of Rem. Around second 5, Rem's long tail with the furry tip swings slowly. Around second 6, the umbrella fabric flutters again and Rem sways back. From second 7 to the end it is calm and everything settles exactly as in the first frame. The whole time: he hangs from the umbrella and sways a few pixels like a slow pendulum, the tip of his nightcap and his pajama sleeve sway, the chain at his belt swings a little, the teal sparks around him twinkle in place, the clouds at the bottom billow slowly in place; the city spires and the crescent moon behind stay still."),
 ('grey-talon', 'Grey Talon', 'He', "Timeline, every action small and returning to the start. His face keeps exactly the same stern, focused hunter's expression as drawn: furrowed brow, firm mouth, eyes looking to the right; it is never sad, never tired, never smiling. The green spirit owl is a glowing green ghostly owl floating in the air behind his right shoulder, at the upper right of his head; it never touches him, never lands or sits on his shoulder, and stays in that place in the air. Around second 1, the owl turns its head a little and its yellow eyes glow brighter. From second 2 to second 4, the owl spreads its glowing green wings wide to both sides, beats them two times slowly and strongly, rising a little, then glides back down to exactly its place and folds its wings. Around second 5, Grey Talon's eyes narrow slightly as if he is aiming, then relax. Around second 6, the owl ruffles its feathers once. From second 7 to the end it is calm and everything settles exactly as in the first frame. The whole time: his white braid and the cloth at his waist sway in the wind, he breathes calmly, he keeps the bow lowered exactly as drawn with the arrow in it, the shapes of the background stay still."),
 ('celeste', 'Celeste', 'She', 'Celeste herself: her purple curls sway, the glowing horn on her head pulses softly. The star on top of the wand in her raised right hand: twinkles and glints. The blue glowing flame at the end of the stick in her left hand: flickers and its blue sparks drift upward. The tiny sparkles on her jacket: twinkle.'),
 ('abrams', 'Abrams', 'He', 'Abrams himself: he keeps the revolver aimed exactly as drawn, steady; the tails of his long coat and his tie stir; light glints on his glasses. The revolver: light glints along its barrel. The red case on his back: stays still. The chain at his side: sways slightly. The background shards: shimmer in place.'),
 ('apollo', 'Apollo', 'He', 'Apollo himself: he holds his lunging pose; his coat tails flutter, his hair stirs. The rapier in his hand: the blade glints. The red slash trails around him: flow and shimmer along their own paths.'),
 ('baba', 'Baba', 'She', 'Baba herself: she stays seated on the green bench; she lifts the teacup a little closer and lowers it back. The teacup in her hand: thin steam rises from it. The green ghostly scarf: flows in the air. The pink pigeon flying at the top left: stays at the top left and flaps its wings in place. The pink pigeon flying at the top right: stays at the top right and flaps its wings in place. The big pink pigeon at the bottom left: stays there and slowly beats its spread wings. The small dark green bird on her right shoulder: stays perched there, turns its head and opens its beak once. The few pink feathers already in the air: float gently in place. The plate on the bench: stays still.'),
 ('bebop', 'Bebop', 'He', 'Bebop himself: the green lights of his eyes blink, small lights on his body glow and fade. The rope wrapped around his body: sways slightly. The gatling arm at the left: its barrels spin briefly and stop. The big orange arm on his back at the right: stays in place, a small light on it glows.'),
 ('billy', 'Billy', 'He', 'Billy himself: he keeps the spiked bat on his shoulder; his glowing eyes flicker; his ears twitch. The padlock on the chain around his neck: sways. The spikes on the bat: glint. The pink shapes behind him: pulse softly.'),
 ('calico', 'Calico', 'She', 'Calico herself: light glints on her round goggles, purple lightning flickers along her arm. The sphinx cat sitting on her right shoulder: stays sitting there; its ears twitch, it blinks its glowing yellow eyes, its tail sways. The pink circle behind her: glows softly.'),
 ('deadmandanny', 'Dead Man Danny', 'He', 'Danny himself: he keeps reaching forward exactly as drawn; his goggles glow and pulse. The orange explosion behind him: churns in place with flickering fire. The smoke clouds around him: roll slowly in place. The small shells and bolts in the air: stay where they are and rock slightly.'),
 ('doorman', 'Doorman', 'He', 'The Doorman himself: he holds his leaping pose with the raised open hand; the tails of his uniform flutter, light gleams on the brass buttons. The ring of brass keys in his left hand: jingles and swings. The yellow light behind him: pulses softly.'),
 ('drifter', 'Drifter', 'He', 'Drifter himself: his red eyes glow, his grin widens a little and settles, his red coat sways. His reaching red claw-hand: its red glow pulses. The dark wisps around him: drift in place.'),
 ('dynamo', 'Dynamo', 'He', 'The floating glass-dome head above his body: stays floating in its place, bobs gently, the lights inside it twinkle. The big round body: the golden light in its vent glows and pulses; the green bow tie and the straps stir. The mechanical arm raised at the top left: the device in its hand sparks a little.'),
 ('graves', 'Graves', 'She', 'Graves herself: her white hair and coat move slightly. The green flame on her raised hand: flickers. The green ghost with a skull face at the bottom left: stays there, sways and slowly waves its arms. The dark ghost with a skull face at the right: stays there and sways. The small skull shapes in the background: pulse softly.'),
 ('haze', 'Haze', 'She', 'Haze herself: she is seen from behind and stays seen from behind, she never turns around; her braids sway. The gun she holds up: light glints on it. The knives at her belt: glint. The warm light behind her: flickers softly.'),
 ('holliday', 'Holliday', 'She', 'Holliday herself: she keeps the pistol aimed exactly as drawn; her scarf and coat flutter in the wind. The pistol: light glints on its barrel. The lasso at her hip: sways. Dust specks: float gently in place.'),
 ('infernus', 'Infernus', 'He', 'Infernus himself: he keeps pointing his pistol exactly as drawn; flames on his body and arms flicker and lick upward. The orange fire shards behind him: flicker. Embers: fly around him.'),
 ('ivy', 'Ivy', 'She', 'Ivy herself: her stone wings flex slightly and settle, her cap stirs. The vines around her arms: sway. The gun in her hands: stays still. The leaves in the air: flutter gently in place.'),
 ('kelvin', 'Kelvin', 'He', 'Kelvin himself: the fur of his collar stirs. The ice gun in his hands: cold vapor drifts from its muzzle, light glints on the frost. Snowflakes: float gently around him.'),
 ('lady-geist', 'Lady Geist', 'She', 'Lady Geist herself: wisps of her pale hair move slightly, the fur of her stole stirs. The green energy in her raised palm: swirls and pulses. The device on her arm: a small light on it glows.'),
 ('lash', 'Lash', 'He', 'Lash himself: he holds his lunging pose; the straps of his overalls and the cloth at his belt sway. The red thing in his raised hand: stays in his hand, its glow pulses. Dust: drifts in the orange light.'),
 ('mcginnis', 'McGinnis', 'She', 'McGinnis herself: she keeps her two-finger salute; the ends of her red bandana flutter. The big turret gun in front of her: a small light on it blinks, a few sparks fly from the machinery. The wrench on her back: stays still.'),
 ('mina', 'Mina', 'She', 'Mina herself: her dress and hair sway. The red umbrella: its fabric ripples slightly. The handbag on her arm: sways a little. The pistol in her hand: stays steady. The big red bat at the left: stays at the left and flaps its wings in place. The red bat at the top right: stays there and flaps its wings in place. The red bat at the right middle: stays there and flaps its wings in place.'),
 ('mirage', 'Mirage', 'He', 'Mirage himself: he holds his flintlock pistol up exactly as drawn; his coat and sash stir. The big brass vessel under his left arm: stays there, light glints on it. Fine sand: drifts through the air.'),
 ('mo-krill', 'Mo & Krill', 'They', 'Mo, the big armored creature in front: holds its pose, breathes, its claws flex. Krill, the small rider at the top left holding the chain: stays at the top left, sways slightly and keeps holding the chain. The heavy chain between them: sways. Small puffs of dust: drift around them.'),
 ('nurseharrow', 'Nurse Harrow', 'She', 'Nurse Harrow herself: her apron and cap stir. The glowing syringe in her raised hand: its orange liquid glows and pulses. The orange flame ribbon around her: flows along its own path. The glowing orange eye on her bag: pulses.'),
 ('paige', 'Paige', 'She', 'Paige herself: she keeps holding the books exactly as drawn; her curls sway. The open book: its pages flutter gently. The green magic above the book: swirls, the crystals shimmer. The key on her necklace and the tassel bookmark: sway.'),
 ('paradox', 'Paradox', 'She', 'Paradox herself: she keeps her reaching hand and her rifle exactly as drawn; her coat sways. The pink hourglass on her helmet: glows and pulses. The rose on her chest: stays still. The clock numerals behind her: stay in place and glow softly.'),
 ('pocket', 'Pocket', 'He', 'Pocket himself: his long scarf and coat sway slightly. The shotgun in his hand: stays still. The green ghostly flame at the suitcase on the right: flickers and pulses.'),
 ('seven', 'Seven', 'He', 'Seven himself: the glow in his mouth flickers, small arcs jump along his arms. The coils on top of his dome: electric sparks crackle between them. The orange light behind him: flickers.'),
 ('shiv', 'Shiv', 'He', 'Shiv himself: he holds his lunging pose; his coat flutters, his hair stirs. The big cleaver in his hand: light glints along its blade. The red glow: pulses.'),
 ('silver', 'Silver', 'She', 'Silver herself: her long white hair sways. The big wolf behind her at the left: stays there; it breathes, snarls slightly, blinks its glowing eyes, its fur ruffles. The white tail at the bottom left: sways. The red moon: glows softly.'),
 ('sinclair', 'Sinclair', 'He', 'Sinclair himself: the tails of his coat stir. The wand in his raised hand: its tip sparkles. The big moon behind him: glows softly.'),
 ('solomon', 'Solomon', 'He', 'Solomon himself: he stays seated behind the chessboard; his scarf stirs, the halo of light behind his head pulses softly. The white chess piece between his fingers: stays in his fingers and glints. The chess pieces on the board: stay exactly where they are and only glint. The ring of white chess-piece symbols around his head: glows softly. The green ribbons around him: flow.'),
 ('victor', 'Victor', 'He', 'Victor himself: his long hair sways slightly. The lamp on his shoulder: its green light flickers. The wire wrapped around his hands: small sparks run along it.'),
 ('vindicta', 'Vindicta', 'She', 'Vindicta herself: her long pale-blue hair flows slowly like water. The rifle in her hands: stays still. The blue wisps at the bottom: drift. The moon behind her: glows softly.'),
 ('violet', 'Violet', 'She', 'Violet herself: her hair, beret and sleeves sway. The brush in her raised hand: the pink-purple paint stroke trailing from it flows along its own path. The sheet of paper in her lower hand: stays in her hand. The sheet of paper at the top right: stays there and flutters in place. The sheet of paper at the right: stays there and flutters in place.'),
 ('viscous', 'Viscous', 'He', 'Viscous himself: his green goo body jiggles softly, bubbles rise and pop inside him. The gun in his hands: stays still. The green dots around him: float gently in place.'),
 ('vyper', 'Vyper', 'She', 'Vyper herself: her tongue flicks, her long tail sways slowly. The gun in her hands: stays still, light glints on it.'),
 ('warden', 'Warden', 'He', 'Warden himself: he stands still. The thick rope across his chest: sways slightly. The badge on his helmet: glints. The box on his shoulder: stays still.'),
 ('wraith', 'Wraith', 'She', 'Wraith herself: her coat sways, the purple glow flickers. The glowing playing card above her hand: pulses and tilts slightly back and forth in place. The tommy gun in her other hand: stays still, light glints on the drum.'),
 ('yamato', 'Yamato', 'She', 'Yamato herself: the fabric of her tall hood stirs, the blue glow at its edge pulses. The sword on her shoulder: light glints along the blade. The red light behind her: pulses softly.'),
]
for hid, name, who, act in HEROES:
    ITEMS.append(dict(key=f'hero:deadlock:{hid}', kind='hero', game='deadlock', hero=hid, title=name, draft=False,
        art=f'кадр 16:9: ветка claude/hero-16x9 → heroes-16x9/{hid}.jpg (полный арт по центру, по бокам — размытое продолжение)',
        animate=HERO.format(name=name, who=who, act=act), neg=HERO_NEG,
        extend=HERO_EXT.format(name=name), animate2=HERO2.format(name=name, who=who, act=act)))

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
