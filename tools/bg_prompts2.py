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
ANIM_HEAD = 'Animate this exact image for 8 seconds. The camera is locked off: no zoom, no pan, no cuts. Only these things move, gently and continuously the whole time: '
ANIM_TAIL = ('Everything else stays perfectly still. The light does not change. Nothing new appears and nothing disappears; no people. '
             'The last frame is identical to the first frame, so the video loops seamlessly. No smoke, fog or mist.')
HERO = ('Animate this exact image of {name}. Keep the character 100% identical: same face, clothes, colors, pose and painted art style; '
        'any lettering on the image stays perfectly static. Locked camera: no zoom, no pan, no cuts; the background does not change. '
        '{act} The motion never stops and never freezes, and it ends in exactly the same pose as the first frame, so the video loops '
        'seamlessly; never play the motion backwards. On top: slow breathing and natural blinking. No morphing, no extra limbs, '
        'no new characters, no text.')

def photo(t, tail=PHOTO_TAIL): return t.strip() + ' ' + tail
def anim(t): return ANIM_HEAD + t.strip() + ' ' + ANIM_TAIL

ITEMS = [
 # ---------- фильмы: один фон на фильм (и на его немецкий дубляж) ----------
 dict(key='film:wolf', kind='film', title='Волк с Уолл-стрит', shows=['Волк с Уолл-стрит', 'The Wolf of Wall Street'], test='сложный',
  what='Торговый зал брокерской фирмы ночью после вечеринки: рыбка в аквариуме, шампанское, снятая трубка, модель суперкара; за ними зелёные котировки.',
  moves='Рыбка шевелит плавниками и медленно поворачивается, в шампанском бегут пузырьки, мигают зелёные цифры, по дальней стене ползёт бегущая строка.',
  photo=photo('The trading floor of a 1990s Long Island brokerage firm at night, the morning after a wild office party, nobody left. '
   'In the foreground, sharp, on the nearest desk: a round glass fishbowl with one orange goldfish, a half-full champagne glass, '
   'a beige office telephone with the handset off the hook and a small white scale model of a wedge-shaped 1980s Italian supercar. '
   'Behind, out of focus: long rows of desks with boxy beige computer monitors showing small glowing green digits, a long ticker band '
   'glowing green across the far wall, confetti on the carpet. Light: one warm brass desk lamp and the cold green glow of the screens. '
   'Mood: gold and money-green; greed and excess after the party.',
   tail=PHOTO_TAIL.replace('no text, letters, numbers or logos anywhere', 'no text or logos; only small blurry green digits on the screens')),
  animate=anim('the goldfish hovers in place waving its fins and slowly turns around in the bowl; bubbles rise in the champagne glass; '
   'the small green digits on the screens flicker; the ticker band on the far wall scrolls slowly from right to left.')),
 dict(key='film:psycho', kind='film', title='Американский психопат', shows=['Американский психопат'], test='простой',
  what='Белая стерильная квартира 1987 года ночью: прозрачный дождевик на вешалке, газеты на полу, топор у дивана, стерео, окно на Манхэттен.',
  moves='На стерео прыгают зелёные индикаторы, по окну текут капли дождя, за ним мерцает ночной город.',
  photo=photo('A minimalist white Manhattan luxury apartment in 1987 at night, empty. In the foreground, sharp: a transparent plastic '
   'raincoat hanging on a chrome coat stand, the white floor around it neatly covered with spread newspapers with blurry unreadable print. '
   'Beside it: a fire axe with a red head leaning against a white leather sofa and a silver hi-fi stereo with glowing green level meters. '
   'Behind, out of focus: a big window with rain on the glass and the Manhattan skyline at night. Light: cold white ceiling light and the '
   'blue night city. Mood: sterile white perfection with something horribly wrong underneath.'),
  animate=anim('the green level meters on the stereo bounce softly to music; raindrops run slowly down the big window; '
   'the city lights twinkle behind the glass. The raincoat, the newspapers and the axe do not move.')),
 dict(key='film:taxi', kind='film', title='Таксист', shows=['Таксист'],
  what='Дешёвая комната в Нью-Йорке 70-х ночью: револьвер, дневник и бутылка на комоде, треснувшее зеркало, армейская куртка; за окном жёлтое такси в пару и красный неон.',
  moves='По стеклу текут капли, мимо такси из люка тянется пар, красный неон мягко светится и чуть пульсирует.',
  photo=photo('A tiny cheap rented room in 1970s New York at night, empty. In the foreground, sharp, on an old wooden dresser: a black '
   'revolver lying flat, an open diary with blurry handwriting and a bottle of brandy with no label. Above it, a small cracked mirror on a '
   'dingy yellow wall; an olive-green army field jacket hangs on a hook beside it. Behind, out of focus: a window with rain on the glass, '
   'a wet street below with red neon and a yellow 1970s taxi parked next to steam rising from a manhole. Light: one bare bulb and red neon '
   'from the street. Mood: dirty yellow and red; lonely, sleepless and tense.'),
  animate=anim('raindrops run down the window glass; steam rises slowly from the manhole past the parked taxi; the red neon outside '
   'glows and pulses very softly.')),
 dict(key='film:titanic', kind='film', title='Титаник', shows=['Титаник', 'Titanic'],
  what='Нос огромного лайнера 1912 года после заката: белые поручни сходятся к острию, кнехты, спасательный жилет; далеко на горизонте айсберг.',
  moves='Море скользит мимо носа, по воде бегут блики, ремешки жилета чуть треплет морской ветер.',
  photo=photo('The bow of a huge 1912 ocean liner on a calm sea just after sunset, the deck empty. Camera at chest height a few meters '
   'behind the tip of the bow, looking forward. In the foreground, sharp: old wooden deck planks, two black iron mooring bollards and a '
   'white canvas life jacket lying by the railing; white railings converge to the point of the bow. Far ahead on the horizon, out of focus: '
   'a tall pale iceberg. Light: the last deep-orange glow of sunset at the horizon and the first cold blue of night above. '
   'Mood: golden romance turning into icy blue doom.'),
  animate=anim('the sea slides past the bow with small waves; soft light glints on the water around the iceberg; the straps of the life '
   'jacket flutter slightly in the sea wind.')),
 dict(key='film:bunker', kind='film', title='Бункер', shows=['Бункер'],
  what='Руины Берлина в апреле 1945-го со ступеней бункера: на ящике карта со стрелками, круглые очки, сломанный карандаш; за ними горящие здания.',
  moves='Отсветы пожара дрожат на стенах, вверх летят редкие искры, уголок карты дрожит от горячего ветра.',
  photo=photo('The ruined center of Berlin at dusk in April 1945, seen from the steps of an underground bunker exit, empty. In the '
   'foreground, sharp, on a wooden crate: a paper map of the city with red and blue pencil arrows, a pair of round wire-rimmed glasses and a '
   'broken pencil. Behind, out of focus: the burned shells of grand stone buildings and broken columns under a red evening sky. No flags, '
   'symbols or insignia. Light: red-orange fire glow under a dark sky. Mood: red, black and ash grey; everything is lost.'),
  animate=anim('the fire glow flickers softly on the broken walls; a few orange embers float up from the fires; one corner of the paper '
   'map trembles in the hot wind.')),
 # ---------- сериалы: по фону на сезон ----------
 dict(key='season:sopranos:S01', kind='season', title='Клан Сопрано', season='S01', shows=['Клан Сопрано', 'Die Sopranos'],
  what='Бассейн Тони утром: на воде утка с утятами, у края шезлонг с халатом и хлеб на тарелке; за ними большой дом в Нью-Джерси.',
  moves='Утки медленно плавают по кругу, от них расходится рябь, по воде плывут листья, деревья качаются от ветерка.',
  note='Утки — из самой сцены (эпизод «Утки»). Если утята выйдут кривыми — оставь одну утку.',
  photo=photo('The backyard of a big suburban New Jersey house on a fresh spring morning, nobody around. In the foreground, sharp: the '
   'edge of a swimming pool with a few floating leaves, and on the water a wild mallard duck with three small ducklings. On the stone edge '
   'of the pool: a white lounge chair with a folded bathrobe and a paper plate with a few slices of white bread. Behind, out of focus: a big '
   'white house, a hedge and tall trees. Light: soft morning sun. Mood: a calm family morning that feels fragile.'),
  animate=anim('the mallard duck and the ducklings paddle slowly in a small circle and stay on the water; small ripples spread from them; '
   'the floating leaves drift; the tall trees behind sway in a light breeze.')),
 dict(key='season:sopranos:S04', kind='season', title='Клан Сопрано', season='S04', shows=['Клан Сопрано', 'Die Sopranos'],
  what='Задний кабинет стрип-клуба ночью: стол, арифмометр, виски со льдом; на телике скачки; в щель двери — розовый неон пустой сцены.',
  moves='На телике скачут лошади, розовый свет из клуба медленно пульсирует, лёд в виски тает и блестит.',
  photo=photo('The small back office of a New Jersey strip club at night, empty. In the foreground, sharp, on a cluttered metal desk: an '
   'old adding machine and a glass of whiskey with ice cubes. Behind, out of focus: dark green wood-paneled walls, steel beer kegs in the '
   'corner, a small old television on a shelf showing a blurry horse race, and a half-open door to the dark club with pink light and a '
   'chrome pole on an empty stage. Light: one green-shaded desk lamp, pink neon spill through the door gap, the TV glow. '
   'Mood: sickly green and pink; grief, guilt and dirty money.'),
  animate=anim('on the small TV, blurry horses gallop around the track; the pink light through the half-open door pulses slowly; the '
   'ice cubes in the whiskey glass slowly melt and glint.')),
 dict(key='season:sopranos:S06', kind='season', title='Клан Сопрано', season='S06', shows=['Клан Сопрано', 'Die Sopranos'],
  what='Кабинка в маленькой закусочной ночью: луковые кольца, кофе, настольный музыкальный автомат; за ними стойка и стеклянная дверь с колокольчиком.',
  moves='Над кофе вьётся пар, огоньки музыкального автомата мягко мигают, за окном тихо мерцает неон.',
  photo=photo('A booth in a small old New Jersey diner at night, nobody there. In the foreground, sharp, on the table: a basket of onion '
   'rings, a white mug of coffee and a small chrome tabletop jukebox selector with glowing song cards that cannot be read. Behind, out of '
   'focus: the counter with round stools, a glass entrance door with a small bell above it and a dark parking lot with a red neon glow. '
   'Light: warm diner lamps inside, cold night outside. Mood: an ordinary evening that feels like the last one.'),
  animate=anim('thin steam rises from the coffee; the lights on the tabletop jukebox selector glow and blink softly; the red neon outside '
   'shimmers faintly in the dark.')),
 dict(key='season:bb:S01', kind='season', title='Во все тяжкие', season='S01', shows=['Во все тяжкие', 'Breaking Bad'],
  what='Старый автодом в пустыне на закате: в двери висит жёлтый защитный костюм, на ступеньке шляпа; на кусте в кадре — брюки.',
  moves='Брюки на кусте и костюм в двери чуть треплет горячий ветер, над песком дрожит марево.',
  photo=photo('The New Mexico desert at golden hour, nobody around. In the foreground, sharp: a pair of khaki trousers caught on a dry '
   'desert shrub. In the middle: an old 1980s white motorhome with faded brown stripes, its side door open, a yellow hazmat suit hanging '
   'in the doorway and a black pork-pie hat resting on the metal step. Behind, out of focus: red mesas under a huge sky. Light: low warm sun '
   'from the side, long shadows. Mood: sun-baked yellow; ordinary on the surface, dangerous underneath.'),
  animate=anim('the khaki trousers flap gently on the shrub in the hot wind; the yellow hazmat suit in the doorway sways slightly in the '
   'same wind; heat haze shimmers above the sand.')),
 dict(key='season:bb:S02', kind='season', title='Во все тяжкие', season='S02', shows=['Во все тяжкие', 'Breaking Bad'],
  what='Бассейн на заднем дворе на рассвете: в воде плавает розовый плюшевый медведь, обгоревший, без глаза; у края сачок.',
  moves='Медведь медленно дрейфует по кругу, расходится рябь, по стенкам бассейна бегут блики воды.',
  photo=photo('A suburban backyard swimming pool in Albuquerque at dawn, nobody around. In the foreground, sharp, floating on the water: '
   'a pink plush teddy bear, half burned, with one eye missing, floating face up. Around it: clear blue water and the tiled edge of the pool '
   'with a pool skimmer net lying on the deck. Behind, out of focus: a beige stucco house with a sliding glass door and desert plants. '
   'Light: cold pale dawn, the pool glowing softly. Mood: quiet; something terrible has happened.'),
  animate=anim('the teddy bear drifts very slowly in a small circle on the water; small ripples spread from it; light patterns from the '
   'water move across the pool walls.')),
 dict(key='season:bb:S04', kind='season', title='Во все тяжкие', season='S04', shows=['Во все тяжкие', 'Breaking Bad'],
  what='Подпол под домом ночью: одна голая лампочка, на земле пачки денег в плёнке в тени, фонарик; балки и трубы.',
  moves='В свете лампочки плывут пылинки, с трубы капает вода, от капель расходятся круги в лужице.',
  photo=photo('A low dirt crawlspace under a suburban house at night, lit by one bare light bulb hanging from a cord. In the foreground, '
   'sharp: a few bundles of cash wrapped tightly in clear plastic, lying on the dirt half in shadow, and an old flashlight. Behind, out of '
   'focus: wooden floor joists, pipes and insulation, a small open hatch above with dim light. Light: one warm bare bulb and deep shadows. '
   'Mood: desperate; the money is gone.'),
  animate=anim('fine dust specks drift slowly through the light of the bare bulb; water drips from a pipe into a small puddle on the dirt '
   'and rings spread across it. The bulb hangs still and burns steadily.')),
 dict(key='season:bb:S05', kind='season', title='Во все тяжкие', season='S05', shows=['Во все тяжкие', 'Breaking Bad'],
  what='Свалка в пустыне в сумерках: на капоте бордового седана ноутбук и ключи; за ними фургон с огромным электромагнитом и сплющенные машины.',
  moves='Сухая трава у края качается на ветру, низко над землёй метёт пыль, над капотом дрожит марево.',
  photo=photo('A junkyard in the New Mexico desert at dusk, nobody around. In the foreground, sharp, on the hood of a dusty dark-maroon '
   '1980s sedan: a closed black laptop and a ring of car keys. Behind, out of focus: an open box truck with a huge round industrial '
   'electromagnet inside, rows of crushed cars, a tall work light on a pole and blue mountains under a pink sky. Light: the last pink '
   'sunlight and the cold white work light. Mood: tired, tough and dangerous.'),
  animate=anim('dry grass at the edge of the frame waves in the wind; thin dust blows low across the ground; heat haze shimmers above the '
   'hood of the car.')),
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
  how=['Фото (не для героев): Gemini или Google Flow (labs.google/flow), формат 9:16, 3–4 варианта — выбери один, где всё на месте и нет пластмассы.',
       'Оживить: Flow → «Кадры в видео»; первый кадр и последний кадр — это же фото (у героя — арт с вики), 8 секунд.',
       'Нет поля «последний кадр» — только первый; петлю склеит Z.ai или Claude (tools/loop_bg.py).',
       'Готовый ролик отдай Z.ai: он склеит петлю, зальёт в R2 и отметит «залит». В приложение ставит Claude.',
       'Плохо вышло — не дописывай промт: скинь кадр Claude, скажи, что не так.'],
  rules=['Фильму — один фон (немецкий дубляж берёт тот же). Сериалу — один фон на сезон. Интервью — один фон на человека. Героям — арт с вики.',
         'Начни с теста: «простой» (Психопат) и «сложный» (Волк). Выйдут нормально — делай остальные.',
         'Без людей, рук, лиц, надписей, логотипов и марок; без дыма и тумана; деньги — только мелко.'],
  photo_tail=PHOTO_TAIL, anim_head=ANIM_HEAD, anim_tail=ANIM_TAIL, hero_template=HERO,
  items=ITEMS)
p = os.path.join(os.path.dirname(__file__), 'bg-prompts.json')
open(p, 'w', encoding='utf-8').write(json.dumps(OUT, ensure_ascii=False, indent=1) + '\n')
print(p, len(ITEMS), 'фонов/героев:', sum(1 for x in ITEMS if x['kind'] != 'hero'), '+', sum(1 for x in ITEMS if x['kind'] == 'hero'))
