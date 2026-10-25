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
PHOTO_WIDE = ('Vertical 9:16. Looks like a frame from a 1990s film shot on 35mm: natural uneven light, deep shadows, slightly faded colors, '
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
              'No people, no hands, no faces, no text, letters or logos anywhere. No smoke, fog or mist. No music, no voices.')
def video(ph, an, wide=False):
    sc = ph.split(' Vertical 9:16.')[0].strip()
    mv = an[len(ANIM_HEAD):] if an.startswith(ANIM_HEAD) else an
    mv = mv[:-len(ANIM_TAIL)].strip() if mv.endswith(ANIM_TAIL) else mv.strip()
    tail = VIDEO_TAIL
    if wide:
        tail = tail.replace('Shallow depth of field: the foreground is sharp, the background is softly out of focus.',
                            'Like a frame from a 1990s film: natural uneven light, deep shadows, slightly faded colors, deep focus, real-world scale; '
                            'not a miniature, not a stock photo, not an interior-design render; nothing arranged for display; no perfect symmetry.')
    if 'only small blurry green digits' in ph:
        tail = tail.replace('no text, letters or logos anywhere', 'no text or logos; only small blurry green digits on the screens')
    return VIDEO_HEAD + sc + ' Only these things move, gently and continuously the whole time: ' + mv + ' ' + tail
def anim(t): return ANIM_HEAD + t.strip() + ' ' + ANIM_TAIL

ITEMS = [
 # ---------- фильмы: один фон на фильм (и на его немецкий дубляж) ----------
 # 25.10, v3. Андрей: «масштабнее» → общий план вышел нейрослопом (Психопат: всё из списка расставлено как в шоуруме,
 # «дождь» снегом внутри комнаты, ровный синий свет). Правила v3: масштаб — от самого места (улица, океан, пустыня, зал в глубине),
 # а не от списка предметов; в кадре максимум одна вещь из сюжета, лежит как попало, не напоказ; камера на уровне человека,
 # кадр не по центру; свет — только настоящие источники, тёмные углы; без слов epic / luxury / minimalist / perfect.
 dict(key='film:wolf', kind='film', title='Волк с Уолл-стрит', shows=['Волк с Уолл-стрит', 'The Wolf of Wall Street'], test='сложный', wide=1,
  what='Аквариум с рыбкой на ближнем столе, а за ним в глубину — огромный тёмный торговый зал: ряды столов и сотни зелёных мониторов, бегущая строка на дальней стене.',
  moves='Рыбка плавает, мигают зелёные цифры, по дальней стене ползёт бегущая строка.',
  photo=photo('A round glass fishbowl with one orange goldfish on the nearest desk, on the left of the frame, sharp. Behind it the camera '
   'looks deep into a huge dark trading floor of a 1990s brokerage firm at night after a party, nobody there: long rows of desks going far '
   'back, hundreds of boxy monitors glowing with small green digits, a long green ticker band on the far wall, some confetti and empty '
   'bottles left on the desks. Camera at seated eye level. Light: only the green glow of the screens and one desk lamp; the room is mostly dark.',
   tail=PHOTO_WIDE.replace('no text, letters, numbers or logos anywhere', 'no text or logos; only small blurry green digits on the screens')),
  animate=anim('the goldfish swims slowly in its bowl; the small green digits on the screens flicker; the ticker band on the far wall '
   'scrolls slowly from right to left.')),
 dict(key='film:psycho', kind='film', title='Американский психопат', shows=['Американский психопат'], test='простой', wide=1,
  what='Тёмная белая квартира ночью, смотрим из глубины комнаты на стену окон: за ними весь Манхэттен под дождём; у края кадра угол белого дивана и газеты на полу.',
  moves='По стеклу снаружи текут капли, мерцают огни города.',
  photo=photo('Inside a dark white apartment high above Manhattan in 1987 at night, nobody there. The camera stands low in the back of the '
   'room and looks toward a wall of tall windows; through them, the whole night skyline of Manhattan with thousands of small lit windows. '
   'In the lower right corner, close: the edge of a white leather sofa in shadow and a few newspapers spread on the floor. The lights in the '
   'room are off; the only light comes from the city outside, so the room is dark blue-grey with deep shadows. Rain is outside only, on '
   'the outer side of the glass; nothing falls inside the room. Mood: cold, empty and silent.'),
  animate=anim('raindrops run slowly down the outside of the window glass; the city lights twinkle far away.')),
 dict(key='film:taxi', kind='film', title='Таксист', shows=['Таксист'], wide=1,
  what='Ночная улица Нью-Йорка 70-х под дождём с уровня тротуара: неон кинотеатров, мокрый асфальт, пар из люка, у бордюра жёлтое такси.',
  moves='Из люка поднимается пар, неон мигает, моросит дождь, в лужах дрожат отражения.',
  photo=photo('A street in 1970s New York at night in the rain, seen from the sidewalk at eye level, nobody around. On the left, a yellow '
   '1970s taxi cab stands at the curb with its lights on. The street goes far into the distance between old buildings with glowing red and '
   'pink neon signs of movie theaters and bars, all unreadable and blurry. Steam rises from a manhole in the middle of the street. The wet '
   'asphalt reflects the neon. Light: neon and old street lamps only, deep shadows between them. Mood: dirty, lonely and feverish.'),
  animate=anim('steam rises slowly from the manhole; the neon signs glow and blink softly; light rain falls; the reflections in the '
   'puddles ripple. The taxi stays parked.')),
 dict(key='film:titanic', kind='film', title='Титаник', shows=['Титаник', 'Titanic'], wide=1,
  what='Огромный лайнер 1912 года ночью с уровня воды: чёрный борт уходит вверх и вдаль, ряды золотых иллюминаторов, четыре трубы на фоне звёзд; спокойное чёрное море.',
  moves='Вода бежит вдоль борта и пенится у носа, в воде дрожат отражения огней, мерцают звёзды.',
  photo=photo('A huge 1912 ocean liner at night on a calm black sea, seen from the water close to the side of the ship, the camera low near '
   'the waterline. The black hull rises high and runs far into the distance like a wall, with long rows of small warm round portholes; '
   'high above, the lit decks and four tall funnels against a dark starry sky. Light: only the warm portholes and the starlight; the sea is '
   'black. Shot like a frame from a 1990s film, nothing glossy. Mood: enormous, quiet, doomed.'),
  animate=anim('the dark water flows along the hull and foams softly at the waterline; the reflections of the portholes shimmer on the '
   'water; the stars twinkle. The ship stays in the same place in the frame. No smoke from the funnels.')),
 dict(key='film:bunker', kind='film', title='Бункер', shows=['Бункер'], wide=1,
  what='Разрушенная улица Берлина весной 1945-го в сумерках с уровня земли: выгоревшие каменные дома по обе стороны до самого горизонта, пожары, красное небо.',
  moves='Огни пожаров дрожат на стенах, вверх летят редкие искры.',
  photo=photo('A wide street in the center of Berlin at dusk in April 1945, seen at eye level from the rubble, nobody around. On both sides, '
   'the burned-out shells of big old stone buildings with empty window holes run far into the distance; broken bricks and twisted metal '
   'lie on the street; fires glow orange inside some of the ruins. A dark red sky above. No flags, symbols or insignia. Light: fire glow '
   'only, deep shadows. Mood: red, black and ash grey; the end of everything.'),
  animate=anim('the fire glow flickers on the broken walls; a few orange embers float up from the fires.')),
 # ---------- сериалы: по фону на сезон ----------
 dict(key='season:sopranos:S01', kind='season', title='Клан Сопрано', season='S01', shows=['Клан Сопрано', 'Die Sopranos'], wide=1,
  what='Задний двор большого дома в Нью-Джерси утром: в бассейне на переднем плане утка с утятами, за ним газон, деревья и большой белый дом.',
  moves='Утки плавают по кругу, по воде рябь и блики, деревья качаются.',
  note='Утки — из самой сцены. Если утята выйдут кривыми — оставь одну утку.',
  photo=photo('The backyard of a big suburban New Jersey house on a spring morning, nobody around, seen from the edge of the swimming pool '
   'at eye level. In the foreground: the pool with a wild mallard duck and three ducklings on the water. Behind: a wide green lawn, tall '
   'old trees and the big white two-storey house with many windows. Light: soft morning sun through the trees. Mood: a calm family morning '
   'that feels fragile.'),
  animate=anim('the ducks paddle slowly in a small circle; ripples and sun glints move on the water; the tall trees sway in a light breeze.')),
 dict(key='season:sopranos:S04', kind='season', title='Клан Сопрано', season='S04', shows=['Клан Сопрано', 'Die Sopranos'], wide=1,
  what='Стрип-клуб у трассы в Нью-Джерси ночью через мокрую парковку: низкое здание в розовом неоне, пара больших седанов; за ним эстакада и далёкие огни заводов.',
  moves='Розовый неон пульсирует, моросит, в лужах рябь, мигают красные огни на трубах.',
  photo=photo('A low roadside strip club in industrial New Jersey at night, seen at eye level across a wet empty parking lot, nobody around. '
   'The flat building glows with pink neon, its signs unreadable. Two big dark 2000s sedans are parked in front. Behind it: a highway '
   'overpass on concrete pillars and, far away, the lights of factory chimneys and tanks. Light: pink neon and orange street lamps, deep '
   'shadows. Mood: sickly pink and orange; grief, guilt and dirty money.'),
  animate=anim('the pink neon pulses slowly; light drizzle makes small ripples in the puddles; the small red lights on the far chimneys blink.')),
 dict(key='season:sopranos:S06', kind='season', title='Клан Сопрано', season='S06', shows=['Клан Сопрано', 'Die Sopranos'], wide=1,
  what='Маленькая закусочная на углу ночью через улицу: тёплые окна, пустые кабинки, красный неон, пустая парковка, светофор.',
  moves='Неон мерцает, моросит дождь, светофор переключается и возвращается.',
  photo=photo('A small old corner diner in a New Jersey town at night, seen at eye level from across the street, nobody inside or outside. '
   'Its big windows glow warm, showing empty booths and the counter with round stools; a red neon glow above the door. A wet empty parking '
   'lot, an old street lamp and a traffic light on the corner, dark small houses around. Light: the warm diner windows in the cold blue '
   'night. Mood: an ordinary evening that feels like the last one.'),
  animate=anim('the red neon shimmers softly; light rain falls through the lamp light; the traffic light changes from green to yellow to '
   'red and back to green.')),
 dict(key='season:bb:S01', kind='season', title='Во все тяжкие', season='S01', shows=['Во все тяжкие', 'Breaking Bad'], wide=1,
  what='Бескрайняя пустыня Нью-Мексико на закате: столовые горы, огромное небо, на грунтовке маленький старый автодом.',
  moves='Медленно плывут облака, над песком дрожит марево, качается сухая трава.',
  photo=photo('The New Mexico desert at golden hour, nobody around, seen at eye level from a dirt road. Far away in the middle of the '
   'frame, small: an old 1980s white motorhome with faded brown stripes parked on the dirt road. Around it, endless flat desert with dry '
   'shrubs, red mesas on the horizon and a huge sky with tall clouds. Light: low warm sun, long shadows. Mood: sun-baked yellow; a small '
   'man in a huge dangerous land.'),
  animate=anim('the clouds drift very slowly; heat haze shimmers above the sand; the dry grass in the foreground sways in the hot wind.')),
 dict(key='season:bb:S02', kind='season', title='Во все тяжкие', season='S02', shows=['Во все тяжкие', 'Breaking Bad'], wide=1,
  what='Бассейн на заднем дворе в Альбукерке на рассвете: в воде плавает обгоревший розовый медведь; за забором крыши пригорода и горы.',
  moves='Медведь медленно дрейфует, рябь, по стенкам бассейна бегут блики.',
  photo=photo('A backyard swimming pool in Albuquerque at dawn, nobody around, seen at eye level from the patio. On the water, a little off '
   'center: a pink plush teddy bear, half burned and missing one eye, floating face up. Behind the pool: a low stucco wall, the flat roofs '
   'of the suburb and the long Sandia mountains glowing pink in the distance. Light: cold pale dawn, the pool glowing softly. Mood: quiet; '
   'something terrible has happened.'),
  animate=anim('the teddy bear drifts very slowly in a small circle; ripples spread from it; light patterns move on the pool walls.')),
 dict(key='season:bb:S04', kind='season', title='Во все тяжкие', season='S04', shows=['Во все тяжкие', 'Breaking Bad'], wide=1,
  what='Огромная подземная лаборатория ночью, почти тёмная: ряды стальных баков уходят вглубь, трубы, галереи; на крюках жёлтые защитные костюмы.',
  moves='Из клапана идёт пар, мигают лампочки на пульте, костюмы чуть качаются от вентиляции.',
  photo=photo('A huge underground industrial lab at night with most of the lights off, nobody there, seen at eye level from the entrance. '
   'Rows of tall stainless-steel tanks and pipes go far back into the darkness, with metal catwalks above. On the left, close: a few yellow '
   'protective suits hanging on hooks on the wall. Light: a few work lamps and small green and red indicator lights; deep shadows. '
   'Mood: cold, enormous and secret.'),
  animate=anim('thin steam rises from one valve on a tank; the small indicator lights on a control panel blink; the yellow suits sway '
   'slightly in the air from a ventilation fan.')),
 dict(key='season:bb:S05', kind='season', title='Во все тяжкие', season='S05', shows=['Во все тяжкие', 'Breaking Bad'], wide=1,
  what='Огромная свалка в пустыне в сумерках: ряды сплющенных машин уходят к горам, фургон с большим электромагнитом, розовое небо.',
  moves='Метёт пыль, качается сухая трава, мигает огонёк на далёкой вышке.',
  photo=photo('A big junkyard in the New Mexico desert at dusk, nobody around, seen at eye level. Rows and stacks of rusty crushed cars '
   'go far back toward blue mountains under a pink sky. In the middle: an open box truck with a big round industrial electromagnet inside '
   'and a tall work light on a pole. A radio tower with a red light far away. Light: the last pink daylight and one cold work light. '
   'Mood: tired, tough and dangerous.'),
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
