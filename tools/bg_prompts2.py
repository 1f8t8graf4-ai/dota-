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
PHOTO_WIDE = ('Vertical 9:16. A real 35mm film still from a big-budget movie: an epic wide establishing shot, deep focus, everything sharp, '
              'natural light, soft film grain, real materials and true real-world scale; not CGI, not a 3D render, not a miniature or a model, not glossy. '
              'No people, no hands, no faces, no text, letters, numbers or logos anywhere.')
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
                            'An epic wide establishing shot from a big-budget movie: deep focus, everything sharp, true real-world scale, not a miniature.')
    if 'only small blurry green digits' in ph:
        tail = tail.replace('no text, letters or logos anywhere', 'no text or logos; only small blurry green digits on the screens')
    return VIDEO_HEAD + sc + ' Only these things move, gently and continuously the whole time: ' + mv + ' ' + tail
def anim(t): return ANIM_HEAD + t.strip() + ' ' + ANIM_TAIL

ITEMS = [
 # ---------- фильмы: один фон на фильм (и на его немецкий дубляж) ----------
 # 25.10, Андрей: «сделай промты по фильмам и сериалам масштабнее — Титаник там не ощущался»: общий план, весь мир фильма,
 # глубокий фокус, мелкая пасхалка у края кадра. Старые крупные натюрморты — в git (c5f6310).
 dict(key='film:wolf', kind='film', title='Волк с Уолл-стрит', shows=['Волк с Уолл-стрит', 'The Wolf of Wall Street'], test='сложный', wide=1,
  what='Огромный двухсветный торговый зал брокерской фирмы ночью после вечеринки: сотни столов, море зелёных мониторов, бегущая строка во всю стену, конфетти и бутылки шампанского; у края — рыбка в аквариуме.',
  moves='По стене ползёт бегущая строка, мигают зелёные цифры на сотнях экранов, рыбка плавает, в шампанском бегут пузырьки.',
  photo=photo('An epic wide shot from a high balcony over an enormous double-height trading floor of a 1990s brokerage firm at night, '
   'right after a wild office party, nobody left. Hundreds of desks in long rows stretch into the distance, every desk with a boxy beige '
   'monitor glowing with small green digits, a sea of green light. A giant ticker band runs across the whole far wall, glowing green. '
   'Confetti, streamers and empty champagne bottles cover the desks and the carpet. In the near corner of the frame, small: a round glass '
   'fishbowl with one orange goldfish next to a champagne glass. Light: the green glow of hundreds of screens and a few warm brass lamps. '
   'Mood: gold and money-green; greed and excess on a huge scale.', tail=PHOTO_WIDE.replace('no text, letters, numbers or logos anywhere',
   'no text or logos; only small blurry green digits on the screens')),
  animate=anim('the ticker band on the far wall scrolls slowly from right to left; the small green digits on the hundreds of screens '
   'flicker; the goldfish swims slowly in its bowl; bubbles rise in the champagne glass.')),
 dict(key='film:psycho', kind='film', title='Американский психопат', shows=['Американский психопат'], test='простой', wide=1,
  what='Огромная белая квартира-пентхаус 1987 года ночью: стена из окон во весь Манхэттен под дождём, белый диван, газеты на полу, прозрачный дождевик на вешалке, топор у дивана.',
  moves='По огромным окнам текут капли, мерцают огни небоскрёбов, на стерео прыгают зелёные индикаторы.',
  photo=photo('An epic wide shot of a huge minimalist white penthouse in Manhattan in 1987 at night, empty. A whole wall of floor-to-ceiling '
   'windows shows the entire Manhattan skyline at night in the rain, hundreds of lit skyscraper windows. In the vast white room: a long '
   'white leather sofa, a glass coffee table, a silver hi-fi stereo with glowing green level meters, the floor in front of the sofa neatly '
   'covered with spread newspapers with blurry unreadable print, a transparent plastic raincoat on a chrome coat stand and a fire axe with a '
   'red head leaning against the sofa. Light: cold white ceiling light and the blue glow of the city. Mood: sterile white perfection above '
   'the whole city, with something horribly wrong in it.'),
  animate=anim('raindrops run slowly down the giant windows; the lights of the skyscrapers twinkle; the green level meters on the stereo '
   'bounce softly to music. The raincoat, the newspapers and the axe do not move.')),
 dict(key='film:taxi', kind='film', title='Таксист', shows=['Таксист'], wide=1,
  what='Ночная улица Нью-Йорка 70-х под дождём сверху: ряды неоновых вывесок кинотеатров, мокрый асфальт в отражениях, пар из люков; посередине одно жёлтое такси.',
  moves='Из люков поднимается пар, неон мигает, идёт дождь, по лужам бегут отражения.',
  photo=photo('An epic wide high-angle shot down a long avenue in 1970s New York at night in the rain, completely empty of people. Both sides '
   'of the street are lined with old movie theater marquees and glowing neon signs in red, pink and yellow, all unreadable. The wet asphalt '
   'reflects all the neon. Steam rises from several manholes along the street. In the middle of the street, one yellow 1970s taxi cab '
   'stands at the curb with its lights on. Light: neon, street lamps and the taxi headlights. Mood: dirty, lonely and feverish; the city as '
   'a sleepless nightmare.'),
  animate=anim('steam rises slowly from the manholes; the neon signs glow and blink softly; light rain falls; the neon reflections ripple '
   'in the puddles. The taxi stays parked.')),
 dict(key='film:titanic', kind='film', title='Титаник', shows=['Титаник', 'Titanic'], wide=1,
  what='Весь огромный лайнер 1912 года ночью в открытом океане: четыре трубы, тысячи золотых иллюминаторов, небо в звёздах, след за кормой; далеко впереди бледный айсберг.',
  moves='Вдоль борта бежит вода и пенится след, в чёрной воде дрожат отражения огней, мерцают звёзды.',
  photo=photo('An epic wide shot of an enormous 1912 four-funnel ocean liner sailing at night on a perfectly calm black ocean, seen from '
   'high above and to the side, the whole ship in frame. Thousands of portholes and deck lights glow warm gold along the black hull; the four '
   'tall funnels are buff with black tops. A long white wake trails behind the ship. Above, a vast moonless sky full of stars and the Milky '
   'Way. Far ahead of the bow, small and pale on the dark water: an iceberg. The decks are empty. Light: the golden lights of the ship and '
   'the cold starlight. Mood: grandeur and golden luxury sailing toward icy doom.'),
  animate=anim('the ship stays in the same place in the frame while the black water flows along its hull and the white wake foams and '
   'spreads behind it; the golden reflections of the ship lights shimmer on the water; the stars twinkle. No smoke from the funnels.')),
 dict(key='film:bunker', kind='film', title='Бункер', shows=['Бункер'], wide=1,
  what='Весь разрушенный центр Берлина в апреле 1945-го сверху на закате: километры выгоревших домов, пожары по всему городу, красное небо, лучи прожекторов; у края — карта со стрелками на ящике.',
  moves='Огни пожаров дрожат, вверх летят искры, по небу медленно ходят лучи прожекторов.',
  photo=photo('An epic wide shot from a high ruined rooftop over the whole center of Berlin at dusk in April 1945: kilometers of burned-out '
   'grand stone buildings, empty window holes, broken columns and collapsed roofs to the horizon, fires glowing in many places across the '
   'city under a deep red sky. A few searchlight beams stand in the sky. In the near corner of the frame, small, on a wooden crate: a paper '
   'map of the city with red and blue pencil arrows and a pair of round wire-rimmed glasses. No flags, symbols or insignia. Light: red-orange '
   'fire glow under a dark red sky. Mood: red, black and ash grey; the end of everything.'),
  animate=anim('the fires across the city flicker; a few orange embers float up from the nearest ruins; the searchlight beams sweep slowly '
   'across the sky and come back to where they started.')),
 # ---------- сериалы: по фону на сезон ----------
 dict(key='season:sopranos:S01', kind='season', title='Клан Сопрано', season='S01', shows=['Клан Сопрано', 'Die Sopranos'], wide=1,
  what='Большой дом в пригороде Нью-Джерси утром с высоты: газон, бассейн с утками, высокие деревья, вдали дымка Нью-Йорка и мосты.',
  moves='Утки плавают по кругу в бассейне, по воде рябь и блики, деревья качаются, работает поливалка на газоне.',
  note='Утки — из самой сцены. Если утята выйдут кривыми — оставь одну утку.',
  photo=photo('An epic wide shot from high above a big suburban New Jersey house on a fresh spring morning, nobody around. A large white '
   'house with a long green lawn, tall trees and a hedge; in the backyard a swimming pool where a wild mallard duck with three ducklings '
   'floats; a white lounge chair beside it. Beyond the trees, a calm suburban street, and far on the horizon the distant Manhattan skyline '
   'and a big steel bridge. Light: soft morning sun. Mood: a calm family morning that feels fragile, with the big city always close.'),
  animate=anim('the ducks paddle slowly in a small circle on the pool; ripples and sun glints move on the water; the tall trees sway in a '
   'light breeze; a lawn sprinkler sprays water in a slow arc and swings back.')),
 dict(key='season:sopranos:S04', kind='season', title='Клан Сопрано', season='S04', shows=['Клан Сопрано', 'Die Sopranos'], wide=1,
  what='Стрип-клуб у трассы в Нью-Джерси ночью: низкое здание с розовым неоном, пустая парковка с большими седанами, мокрый асфальт; вдали огни нефтезаводов и эстакада.',
  moves='Розовый неон пульсирует, по лужам бежит рябь от мороси, мигают огни нефтезаводов.',
  photo=photo('An epic wide shot of a low roadside strip club next to a highway in industrial New Jersey at night, nobody around. The flat '
   'building glows with pink and purple neon shapes and unreadable signs. A big empty parking lot of wet asphalt with three big dark 2000s '
   'sedans reflects the neon. Behind: a highway overpass on concrete pillars and, far away, the endless lights of oil refineries and tanks '
   'and the distant Manhattan glow on the low clouds. Light: pink neon, orange sodium street lamps, the refinery lights. Mood: sickly pink '
   'and orange; grief, guilt and dirty money.'),
  animate=anim('the pink neon pulses slowly; light drizzle makes small ripples in the puddles on the parking lot; the small red lights on '
   'the refinery towers blink.')),
 dict(key='season:sopranos:S06', kind='season', title='Клан Сопрано', season='S06', shows=['Клан Сопрано', 'Die Sopranos'], wide=1,
  what='Маленькая закусочная на углу городка ночью через улицу: светятся окна, пустые кабинки, красный неон, пустая парковка, светофор; вдали зарево Нью-Йорка.',
  moves='Неон мягко мерцает, моросит дождь, светофор переключается и возвращается.',
  photo=photo('An epic wide shot from across the street of a small old corner diner in a New Jersey town at night, nobody inside or '
   'outside. Its big windows glow warm, showing empty booths and the counter with round stools; a red neon glow above the door with a small '
   'bell. An empty wet parking lot, a quiet street with old street lamps and a traffic light, small houses, and far away the orange glow of '
   'New York on the clouds. Light: warm diner light in the cold blue night. Mood: an ordinary evening that feels like the last one.'),
  animate=anim('the red neon shimmers softly; a light rain falls through the lamp light; the traffic light changes from green to yellow to '
   'red and back to green.')),
 dict(key='season:bb:S01', kind='season', title='Во все тяжкие', season='S01', shows=['Во все тяжкие', 'Breaking Bad'], wide=1,
  what='Бескрайняя пустыня Нью-Мексико на закате: столовые горы, огромное небо с облаками, на грунтовке крошечный старый автодом; у края кадра — брюки на кусте.',
  moves='Облака медленно плывут, над песком дрожит марево, брюки на кусте и сухая трава качаются от ветра.',
  photo=photo('An epic wide shot of the endless New Mexico desert at golden hour, nobody around. Red mesas on the horizon, a huge sky with '
   'tall golden clouds. Far in the middle, small on a dirt road: an old 1980s white motorhome with faded brown stripes, its door open, a '
   'yellow hazmat suit hanging in the doorway. In the near corner of the frame: a pair of khaki trousers caught on a dry desert shrub. '
   'Light: low warm sun, long shadows. Mood: sun-baked yellow; a small ordinary man in a huge dangerous land.'),
  animate=anim('the clouds drift very slowly; heat haze shimmers above the sand; the khaki trousers and the dry grass sway in the hot wind.')),
 dict(key='season:bb:S02', kind='season', title='Во все тяжкие', season='S02', shows=['Во все тяжкие', 'Breaking Bad'], wide=1,
  what='Пригород Альбукерке на рассвете с высоты: ряды домов с голубыми бассейнами, горы Сандия; в ближнем бассейне плавает обгоревший розовый медведь.',
  moves='Медведь медленно дрейфует, по бассейнам бегут блики, дрожит вода.',
  photo=photo('An epic wide shot from high above the suburbs of Albuquerque at dawn, nobody around: rows of beige stucco houses with blue '
   'backyard swimming pools stretch to the big Sandia mountains glowing pink. In the nearest pool, in the foreground: a pink plush teddy '
   'bear, half burned and missing one eye, floating face up on the clear blue water. Light: cold pale dawn, the pools glowing. Mood: quiet; '
   'something terrible has happened over the whole city.'),
  animate=anim('the teddy bear drifts very slowly in a small circle; ripples spread from it; light patterns move on the walls of the pools.')),
 dict(key='season:bb:S04', kind='season', title='Во все тяжкие', season='S04', shows=['Во все тяжкие', 'Breaking Bad'], wide=1,
  what='Огромная подземная суперлаборатория под прачечной: блестящие стальные баки, трубы, галереи, жёлтые защитные костюмы на крюках, белый свет.',
  moves='Из клапанов идёт пар, мигают лампочки на пультах, жёлтые костюмы чуть качаются от вентиляции.',
  photo=photo('An epic wide shot of a vast secret underground industrial lab under a laundry, empty: huge polished stainless-steel tanks '
   'and reactors, bundles of pipes, metal catwalks and stairs, a clean concrete floor with yellow safety lines, a row of yellow hazmat suits '
   'with gas masks hanging on hooks along the wall. Light: bright cold white industrial lights and small green and red indicator lamps. '
   'Mood: clinical, enormous and dangerous; an empire built in secret.'),
  animate=anim('thin steam rises from a few valves on the tanks; the small indicator lamps on the control panels blink; the yellow suits '
   'sway slightly in the air from a ventilation fan.')),
 dict(key='season:bb:S05', kind='season', title='Во все тяжкие', season='S05', shows=['Во все тяжкие', 'Breaking Bad'], wide=1,
  what='Гигантская свалка в пустыне в сумерках: ряды сплющенных машин до горизонта, фургон с огромным электромагнитом, горы, розовое небо; у края — ноутбук и ключи на капоте.',
  moves='Метёт пыль, качается сухая трава, мигает огонёк на вышке, медленно плывут облака.',
  photo=photo('An epic wide shot of a giant junkyard in the New Mexico desert at dusk, nobody around: rows and stacks of crushed cars '
   'stretch toward blue mountains under a huge pink sky. In the middle: an open box truck with a huge round industrial electromagnet inside, '
   'a tall work light on a pole and a radio tower with a red light far away. In the near corner, small, on the hood of a dusty dark-maroon '
   '1980s sedan: a closed black laptop and a ring of car keys. Light: the last pink sunlight and the cold white work light. '
   'Mood: tired, tough and dangerous; the end game.'),
  animate=anim('thin dust blows low across the ground; dry grass waves in the wind; the red light on the far radio tower blinks; the pink '
   'clouds drift very slowly.')),
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
