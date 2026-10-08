# Генерирует фоны-промты.md (13.0): главный фон на фильм/сериал/интервью + фон на каждую сцену. Петля на 2 кадрах.
import os,json
OUT='фоны-промты.md'   # запуск из корня dota-: python3 tools/bg_prompts.py
R='../scenes'   # клон репо scenes рядом — для отметок ✅/❌
IMG="Vertical 9:16, photorealistic cinematic film still, shot on 35mm film, subtle film grain, low-key moody lighting, deep shadows, the main subject in the center of the frame, calm darker areas at the top and bottom, no people, no faces, no hands, no text, no letters, no numbers, no logos, no watermark."
EDIT="Edit this exact image. Keep the camera angle, framing, composition, every object and its position, the colors and the lighting exactly the same. Change only this: "
MOVE="Locked-off static camera: no camera movement, no zoom, no pan. Only this gentle natural motion, slow and realistic. Nothing enters or leaves the frame, no new objects, no people, no cuts. Start and end exactly on the given first and last frames."

# (код файла, заголовок, про что, идея, кадр1, кадр2-изменение, движение, есть ли старый файл)
F=[]
def show(code,emoji,title,vis,items):F.append((code,emoji,title,vis,items))

show('wolf','🎬','Волк с Уолл-стрит (2013, Мартин Скорсезе)',
 'Золото, шампанское, пачки денег, конец 80-х — 90-е. Торговый зал Stratton Oakmont, жадность, кокаин, экстаз и хаос. Цвета: тёплое золото и янтарь против холодного зелёного света мониторов.',
 [('film-wolf','Главный фон «Волк с Уолл-стрит»','h:Волк с Уолл-стрит',
   'Весь фильм: Джордан Белфорт поднимается от новичка-брокера до хозяина Stratton Oakmont — деньги, вечеринки прямо в офисе, наркотики, ФБР.',
   'Торговый зал Stratton Oakmont ночью, сразу после безумного дня: столы пустые, трубка висит на шнуре, веер стодолларовых купюр, шампанское, конфетти. Это и есть «Волк» — праздник жадности, после которого никого не осталось.',
   "Night inside an empty 1990s Long Island stock brokerage trading floor right after a wild celebration. In the center foreground, a cluttered desk: a beige office telephone with its receiver hanging off the edge on a long coiled cord, a fan of hundred-dollar bills, a champagne coupe with rising bubbles, a gold wristwatch. Behind it, rows of empty desks and old CRT monitors recede into darkness, their screens glowing with abstract green lines. Confetti and torn order tickets scattered on the carpet. Warm gold desk-lamp light mixed with cold green monitor glow, smoky haze.",
   "the hanging telephone receiver has swung a little to the other side, a few pieces of confetti have settled lower, the haze has drifted, the green monitors glow slightly brighter.",
   "The telephone receiver slowly sways on its coiled cord like a pendulum, champagne bubbles rise in the glass, a few pieces of confetti drift down through the warm haze, the green monitors softly flicker.",
   'wolf-of-wall-street/film-bg.mp4'),
  ('wolf-of-wall-street','Фон сцены «Марк Ханна объясняет новичку правила Уолл-стрит»','wolf-of-wall-street',
   'Первый день Джордана на Уолл-стрит, обед с боссом Марком Ханной в ресторане высоко над Манхэттеном (1987). Ханна учит: клиенты — никто, всё это «фугази», держи клиента на «колесе обозрения», расслабляйся — и бьёт себя в грудь, напевая.',
   'Их столик: два сухих мартини, дым сигареты, за окном — небоскрёбы. Обед, на котором новичка учат жадности.',
   "A luxurious 1987 Manhattan restaurant on a high floor of a skyscraper at lunchtime. In the center, a small round table with crisp white linen: two dry martini glasses with green olives on picks, a heavy crystal ashtray with a burning cigarette sending up a thin ribbon of smoke, a gold lighter, a folded financial newspaper. Behind the table, a tall floor-to-ceiling window showing a hazy forest of Manhattan skyscrapers. Warm amber interior light against cool city daylight.",
   "the cigarette smoke ribbon curls in a different shape and rises a little higher, a few more condensation droplets on the martini glasses, a soft sun glint has moved along the skyscrapers.",
   "A thin ribbon of cigarette smoke slowly curls and rises above the ashtray, tiny condensation droplets glisten on the martini glasses, soft sunlight glints drift across the distant skyscraper windows, faint haze moves over the city.",
   'wolf-of-wall-street/bg.mp4'),
  ('wolf-swiss-bank','Фон сцены «Швейцарский банк: Ça dépend»','wolf-swiss-bank',
   'Джордан в Женеве прячет деньги у банкира Жан-Жака Сореля. Банковская тайна — «ça dépend», смотря что; повестки Минюста здесь — туалетная бумага; счёт нужно открыть на родственника с европейским паспортом.',
   'Тихий кабинет частного банка: кожаная папка, веер купюр, эспрессо и шоколад, а за окном — Женевское озеро и фонтан Же-До. Деньги, спрятанные в роскоши.',
   "A discreet private bank office in Geneva on a grey winter afternoon. In the center foreground, a polished walnut desk with an unmarked dark leather folder, a fan of crisp banknotes held by a silver clip, a tiny porcelain cup of espresso with a wisp of steam, a small plate of Swiss chocolates. Behind the desk, a tall window framing Lake Geneva with the giant lake fountain shooting a white plume of water into the sky, light snow falling outside. Cold soft daylight, dark wood, brass details, quiet luxury.",
   "the fountain plume is bent a little more by the wind, the falling snowflakes are in different positions, the espresso steam has a different curl.",
   "The tall plume of the lake fountain sways gently in the wind, soft snow drifts down outside the window, a delicate wisp of steam rises from the espresso cup, everything inside the office stays perfectly still.",
   None)])

show('sopranos','📺','Клан Сопрано (HBO, 1999–2007)',
 'Пригород Нью-Джерси, итальянская семья, мафия и психотерапия. Бассейн с утками, кабинет доктора Мелфи, клуб «Бада Бинг», праздники с едой. Цвета: тёмное дерево, глубокий зелёный, тёплый вольфрамовый свет.',
 [('film-sopranos','Главный фон «Клан Сопрано»','h:Клан Сопрано',
   'Весь сериал: босс мафии Тони Сопрано ходит к психотерапевту, разрывается между «семьёй» и семьёй, теряет друзей и себя.',
   'Бассейн во дворе дома Тони на рассвете и две дикие утки на воде — главный символ сериала: в пилоте Тони теряет сознание, когда утки улетают («я боюсь потерять семью»). Халат на шезлонге, утренний туман.',
   "Early morning in the backyard of a large suburban New Jersey house. In the center, a rectangular swimming pool with calm blue-green water and two wild mallard ducks, a male and a female, floating peacefully in the middle of the pool. Thin morning mist rises from the water. At the edge of the pool, a white terry bathrobe tossed over a lounge chair and a rolled-up newspaper in a plastic sleeve. Behind, the back of the house with one warm lit kitchen window and tall green trees. Soft pale-gold dawn light, quiet melancholy mood.",
   "the two ducks have drifted slightly closer to each other and one has turned its head, the mist over the water has shifted, the light is a touch warmer.",
   "The two ducks paddle slowly in place on the pool, making small soft ripples, thin mist drifts across the water surface, the leaves on the trees barely move in the breeze.",
   'sopranos-s01e01/film-bg.mp4'),
  ('sopranos-s01e01','Фон сцены «Тони на первом приёме у психотерапевта» (S01E01 · Pilot)','sopranos-s01e01',
   'Пилот. Тони после панической атаки впервые у доктора Мелфи: «консультант по утилизации отходов», «я пришёл под самый конец», утки в бассейне, утро на кухне в день рождения сына.',
   'Пустой кабинет психотерапевта: кресло Тони, коробка салфеток, полосы света сквозь жалюзи, бронзовая статуэтка женщины (с неё начинается сериал). Место, где мафиози впервые говорит о чувствах.',
   "An empty psychiatrist's office in the late 1990s, calm and tasteful. In the center, a large brown leather armchair, slightly turned, with a small side table holding a box of tissues and a glass of water; on the edge of the frame, the corner of a second armchair facing it. Behind, a window with half-open wooden blinds casting soft stripes of afternoon light across the room, a bookshelf, a small abstract bronze sculpture of a woman on a pedestal. Warm muted beige and brown tones, quiet and intimate.",
   "the stripes of light from the blinds have slid slightly across the armchair and the floor, the floating dust particles are in different places.",
   "Stripes of afternoon light through the blinds slowly slide across the empty armchair, dust particles float in the sunbeams, the water in the glass stays still, total silence and calm.",
   'sopranos-s01e01/bg.mp4'),
  ('sopranos-s06e09','Фон сцены «Тони у Мелфи: аттракционы и скука» (S06E09 · The Ride)','sopranos-s06e09',
   'Тони рассказывает Мелфи про праздник святого Эльзеара: тысячи людей молятся или едят, сломался аттракцион. «Мне прострелили поджелудочную, а я выкарабкался», «каждый день — подарок… обязательно этот подарок — пара носков?».',
   'Итальянский уличный праздник вечером: статуя святого с лентами, к которым приколоты доллары, арки из цветных лампочек, пончики в сахарной пудре и крутящийся аттракцион вдали.',
   "An Italian-American church street feast in New Jersey at dusk. In the center, a decorated wooden platform with a statue of a saint in robes, long satin ribbons hanging from it covered with pinned dollar bills. Above the street, arches of colored light bulbs glowing red, green and white. On the side, a food stand with a tray of zeppole heaped with powdered sugar. In the blurred background, a spinning fairground ride glowing with lights. Warm festive bokeh, deep blue evening sky, nostalgic mood.",
   "the bulbs on the light arches have a different twinkling pattern, the ribbons with dollar bills have fluttered to a slightly different position, the background ride has turned a little.",
   "The ribbons with pinned dollar bills flutter softly in the evening breeze, the bulbs on the light arches gently twinkle, the fairground ride in the background spins slowly as a blur of lights, a little powdered sugar dust floats in the air.",
   None),
  ('sopranos-arc','Фон сцены «Где моя арка? Кристофер, Тони и доктор Мелфи о счастье» (S01–S02)','sopranos-arc',
   'Нарезка первых сезонов. Кристофер пишет сценарий и не понимает, где «арка» его жизни; Тони — «грустный клоун», злится непонятно на кого и ищет своё счастье («гарантировано стремление, а не счастье»); Мелфи — про акулу, которая всё время должна плыть.',
   'Ночная квартира Кристофера: печатная машинка с недописанным сценарием, пепельница, пиво — и аквариум, где кругами плавает маленькая акула. Метафора Мелфи: остановишься — задумаешься о том, что творишь.',
   "A cramped New Jersey apartment late at night, late 1990s. In the center, a glowing aquarium on a cabinet where a small shark swims in circles among bubbles, filling the room with cold blue light. In front of it, a cluttered table: a typewriter with a half-typed page of blurred unreadable lines, scattered screenplay pages, a dog-eared paperback, an overflowing ashtray with a burning cigarette, an open can of beer. Rain streaks on the dark window behind. Cold blue aquarium light mixed with a warm desk lamp, lonely mood.",
   "the small shark is now on the other side of the aquarium, the bubbles and the cigarette smoke are in different positions.",
   "The small shark glides slowly in circles inside the glowing aquarium, bubbles rise, a thin thread of cigarette smoke curls up, raindrops trickle down the dark window.",
   None),
  ('sopranos-ralph','Фон сцены «Ральф приходит к Тони после беды с сыном» (S04E09 · Whoever Did This)','sopranos-ralph',
   'Сын Ральфа Джастин в больнице. Ночью Ральф приходит в подсобку «Бада Бинг», отдаёт Тони конверт «с того дела» и ломается: на седьмой день рождения сына он сидел во Флориде под коксом. Тони утешает, обещает оплатить лечение — и признаётся, что встречается с бывшей Ральфа, Валентиной. «Держись», «съезди к Пай, отвлечёшься» (Пай — скаковая лошадь).',
   'Подсобка «Бада Бинг» ночью: зелёные стены, розовые ромбы-светильники, кеги, арифмометр и коричневый конверт с деньгами под лампой, а на маленьком телевизоре без звука — скачки (лошадь Пай-О-Май). Тяжёлая ночь, когда деньги ничего не решают.',
   "The cramped back office of a New Jersey strip club late at night. In the center, a cluttered metal desk under a single desk lamp: a thick plain brown envelope stuffed with cash, an old adding machine with a long curling paper tape, a half-empty glass of whiskey, an ashtray. Behind the desk, dark green wood-paneled walls with three small pink diamond-shaped lamps, steel beer kegs stacked in the corner, and a small old television on a shelf silently showing a blurry horse race. Through the half-open door, a colorful stained-glass light panel glows over a pool table. Warm tungsten light against cold green, heavy sad mood.",
   "the horse race on the small TV shows a different moment with the blurry horses further along the track, the paper tape of the adding machine curls slightly differently, the pink glow from the door is a little brighter.",
   "The small television flickers with a silent blurry horse race, pink and red light from the club pulses softly through the half-open door, a thin line of smoke rises from the ashtray, the curling paper tape of the adding machine barely trembles.",
   None)])

show('psycho','🎬','Американский психопат (2000, Мэри Хэррон)',
 'Стерильный белый минимализм, хром, оттенки кости и яичной скорлупы, Манхэттен 1987 года, яппи, визитки, утренний ритуал ухода за собой. Холодный свет, идеальный порядок — и пустота за ним.',
 [('film-psycho','Главный фон «Американский психопат»','h:Американский психопат',
   'Весь фильм: Патрик Бейтман — идеальный яппи с Уолл-стрит, одержимый внешностью, визитками и ресторанами, а по ночам — убийца. «Есть идея Патрика Бейтмана… но меня нет».',
   'Его ванная из утреннего ритуала: мрамор, идеальный строй дорогих кремов, хром — и запотевающее зеркало, в котором никого нет. Совершенство снаружи, пустота внутри.',
   "A pristine white marble bathroom of a 1987 Manhattan luxury apartment in the morning. In the center, a large mirror above a marble sink; the mirror is partly fogged with steam and reflects nobody, only the cold empty room. On the counter, a perfectly aligned row of expensive skincare bottles, jars and tubes in white and chrome, a folded white towel, a chrome razor. Cold clean bluish-white light, sterile obsessive order, unsettling calm.",
   "the mirror is now almost completely fogged with steam, a drop of water hangs on the chrome faucet.",
   "Steam slowly fogs the mirror and then gently clears, a single drop of water forms on the chrome faucet and falls into the sink, all the bottles stay perfectly still in their ideal row.",
   'american-psycho/film-bg.mp4'),
  ('american-psycho','Фон сцены «Патрик Бейтман приходит в офис»','american-psycho',
   'Утро на Уолл-стрит: Бейтман в наушниках приходит в офис, велит секретарше Джин отменить встречи, забронировать столики («Камолс», «Аркадия»), принести минералки — и «больше так не одеваться».',
   'Его стеклянный стол: кассетный плеер с наушниками, стакан минералки с лаймом, ежедневник для броней, полосы света сквозь жалюзи. Утро человека, у которого расписан каждый столик.',
   "A sleek 1987 Wall Street corner office in the morning. In the center, a minimalist glass desk: a silver portable cassette player with foam headphones, a tall glass of sparkling mineral water with a slice of lime and tiny rising bubbles, a black leather planner, a fountain pen, a desk card file. Behind, tall windows with thin metal blinds half open onto hazy Manhattan towers. Cold white and steel-blue light, sharp shadows, corporate and sterile.",
   "the stripes of light from the blinds have moved slightly across the desk, the bubbles in the glass are in different places.",
   "Tiny bubbles stream up in the glass of sparkling mineral water, thin stripes of morning light from the blinds slowly slide across the glass desk, distant city haze drifts, nothing else moves.",
   None),
  ('american-psycho-cards','Фон сцены «Визитки: чья круче»','american-psycho-cards',
   'Яппи меряются визитками: «кость», «яичная скорлупа», шрифт Silian Rail, а у Пола Аллена — ещё и водяной знак; Бейтман бледнеет от зависти. Плюс бронь в «Дорсии» и Маркус Хальберстрам, с которым его все путают.',
   'Веер почти одинаковых белых визиток на тёмном столе, и луч света медленно проявляет рельеф букв и водяной знак. Война за оттенок белого.',
   "Extreme close-up on a dark glossy boardroom table in 1987. In the center, five premium business cards fanned out in a neat arc, each a slightly different shade of white — bone, eggshell, off-white — with raised embossed lettering too small and blurred to read. One card shows a faint elegant watermark catching the light. A crystal glass with ice and a gold pen at the edge. A narrow soft spotlight from above, deep black background, luxurious and tense.",
   "the soft spotlight has moved slightly to the right, now catching the watermark and the embossed relief of the next card.",
   "A narrow soft beam of light slowly glides across the fanned business cards, revealing the embossed relief and the subtle watermark, the ice in the glass glints.",
   'american-psycho-cards/bg.mp4')])

show('taxi','🎬','Таксист (1976, Мартин Скорсезе)',
 'Ночной Нью-Йорк 70-х: пар из люков, мокрый асфальт, неон, жёлтое такси, грязь и одиночество. Цвета: красный и синий неон, грязно-жёлтый, глубокая чёрная ночь.',
 [('film-taxi','Главный фон «Таксист»','h:Таксист',
   'Весь фильм: ветеран Трэвис Бикл работает в ночную смену, не может уснуть и видит город как помойку. Одиночество медленно превращает его в бомбу.',
   'Пустое жёлтое такси ночью в клубах пара из люка, неон на мокром асфальте. Город, по которому Трэвис ездит каждую ночь.',
   "A rain-soaked 1970s New York street at night. In the center, an empty yellow Checker taxi cab parked at the curb with its rooftop light glowing, engine idling. White steam billows from a manhole cover in front of it. Wet asphalt reflects red and blue neon from blurred shop signs without readable letters. Grimy, lonely, hypnotic, grainy 1970s film look.",
   "the steam cloud has rolled into a different shape and is thicker on the left, one neon reflection has switched from red to blue.",
   "Thick white steam slowly billows from the manhole and drifts across the taxi, red and blue neon reflections shimmer on the wet asphalt, light rain falls, the taxi stays still with its rooftop light glowing.",
   'taxi-driver-lonely/film-bg.mp4'),
  ('taxi-driver-lonely','Фон сцены «Одинокий человек Бога»','taxi-driver-lonely',
   'Монолог Трэвиса: «одиночество преследовало меня всю жизнь», «я — одинокий человек Бога», «один день не отличить от другого». Ночная смена и встреча со Спортом.',
   'Каморка Трэвиса ночью: открытый дневник, где он пишет свои монологи, старый телевизор с рябью, неон мигает сквозь жалюзи. Комната, в которой человек совсем один.',
   "A small shabby 1970s New York rented room at night. In the center, a cheap wooden table under a bare desk lamp: an open spiral notebook diary with handwriting too blurred to read, a ballpoint pen, a bottle of peach brandy, a slice of white bread. Behind, an old black-and-white TV on a stand glowing with static, and a window with cheap blinds through which red neon from the street blinks. Peeling wallpaper, dirty yellow and red tones, profound loneliness.",
   "the neon light through the blinds is now off and the room is darker, the TV static shows a different pattern.",
   "Red neon from the street blinks slowly on and off through the blinds, the old TV flickers with grey static, a faint draft barely moves the blinds, nothing else moves.",
   None),
  ('taxi-driver-betsy','Фон сцены «Трэвис приходит в предвыборный штаб и зовёт Бетси на кофе»','taxi-driver-betsy',
   'Трэвис записывается волонтёром в штаб Палантайна — «лучше к ней», говорит Бетси, что она самая красивая женщина, которую он видел, и зовёт на кофе с пирогом: «вы несчастливы».',
   'Столик в закусочной 70-х: две чашки кофе и кусок яблочного пирога, за окном дождь и огни такси. Неловкое первое свидание.',
   "A 1970s New York diner booth by the window on a rainy evening. In the center, a red vinyl booth and a formica table with two white mugs of black coffee with rising steam and a slice of apple pie on a small plate with a fork. Through the rain-streaked window behind, blurred yellow taxis and city lights. Warm diner light inside, cool blue rain outside, shy romantic mood.",
   "the steam over the coffee mugs has a different shape, the raindrops on the window are in different places, the blurred car lights outside have moved.",
   "Gentle steam rises from the two coffee mugs, raindrops slowly trickle down the window, blurred headlights glide past outside, the inside of the diner stays still and warm.",
   None)])

show('bunker','🎬','Бункер / Der Untergang (2004) — на немецком',
 'Апрель 1945, бункер под Берлином: серый бетон, голые лампочки, карты, пыль от обстрелов, теснота и обречённость. **Никакой символики, флагов и свастик** — генераторы откажут, да и не нужно.',
 [('film-bunker','Главный фон «Бункер»','h:Бункер',
   'Весь фильм: последние дни Гитлера в бункере глазами секретарши Траудль Юнге — приказы армиям, которых уже нет, и конец Третьего рейха.',
   'Бетонный коридор бункера: лампочки на проводах мигают от разрывов, с потолка сыплется пыль, полевой телефон, бумаги на полу. Мир, который рушится над головой.',
   "A narrow underground concrete bunker corridor in Berlin, April 1945. In the center, the corridor stretches into darkness, lit by a row of bare light bulbs on cables along the ceiling. In the foreground, a wooden chair and a field telephone on a small table, scattered papers on the floor, a heavy steel door half open. Fine dust hangs in the air. Grey concrete, sickly yellow light, claustrophobic and tense. No flags, no symbols, no insignia.",
   "the bulbs are dimmer and one has flickered almost off, more dust is falling from the ceiling.",
   "The bare bulbs flicker and dim from distant explosions and then recover, fine dust trickles from the ceiling and drifts in the light, the hanging cables tremble slightly.",
   None),
  ('downfall-bunker','Фон сцены «Приказ Штайнера»','downfall-bunker',
   'Гитлеру докладывают: фронт прорван, атаки Штайнера не будет. Он выгоняет всех, кроме генералов, и срывается: «Это был приказ!», «вы трусы», «я никогда не учился в академии», «война проиграна». Та самая сцена-мем.',
   'Стол с огромной картой Берлина, цветные карандаши, сломанный красный карандаш (его бросают в сцене), круглые очки на карте, низкая лампа. Приказы, которые уже некому выполнять.',
   "A military map table in a concrete bunker room, 1945. In the center, a large paper map of a city with hand-drawn red and blue arrows and pins, a pair of round wire-rimmed reading glasses lying on it, a snapped red pencil and several colored pencils scattered across the map. A green-shaded lamp hangs low above the table on a cord. Grey concrete walls in shadow, cigarette smoke haze, heavy oppressive mood. No flags, no symbols, no insignia, no readable text.",
   "the hanging lamp has swung a little to the side, so the pool of light and the shadows on the map have shifted.",
   "The low hanging lamp sways gently on its cord as if from a distant explosion, the pool of light slides back and forth across the map and the broken pencil, fine dust and smoke drift in the light.",
   'downfall-bunker/bg.mp4')])

show('titanic','🎬','Титаник (1997, Джеймс Кэмерон)',
 'Роскошь 1912 года и ледяная ночь катастрофы: золото салонов, поручни на носу, шлюпки, чёрный океан. Цвета: тёплый закат и холодный синий.',
 [('film-titanic','Главный фон «Титаник»','h:Титаник',
   'Весь фильм: бедный художник Джек и аристократка Роуз влюбляются на самом большом лайнере в мире — за несколько дней до того, как он утонет.',
   'Пустой нос лайнера на закате — то самое место, где «я лечу!». Поручни сходятся к носу, впереди бесконечный океан.',
   "The empty bow of a giant 1912 ocean liner at sunset, seen from the deck looking forward. In the center, the white railings converge to the very tip of the bow; beyond it, a calm endless ocean and a glowing golden-pink sky with soft clouds. Polished wooden deck, coiled ropes and a ship lantern. Warm romantic golden light, gentle sea breeze, epic and calm.",
   "the sun is slightly lower and the sky a little more pink, the sparkles on the water are in different places.",
   "The ocean gently rolls and sparkles in the setting sun, soft clouds drift slowly, a loose rope sways in the breeze.",
   'titanic-boat/film-bg.mp4'),
  ('titanic-boat','Фон сцены «Джек сажает Роуз в шлюпку — а она прыгает обратно»','titanic-boat',
   'Ночь крушения. Джек и Кэл уговаривают Роуз сесть в шлюпку («я выживу», «я всегда выигрываю»), шлюпку спускают — и Роуз прыгает обратно на тонущий корабль: «ты прыгнешь — я прыгну».',
   'Пустая шлюпка висит на талях у борта, огни корабля мигают, внизу чёрная ледяная вода, на палубе забыта шуба. Шлюпка, в которой Роуз так и не уплыла.',
   "Night of the sinking, 1912. In the center, an empty wooden lifeboat hangs from steel davits along the side of a huge ocean liner, its ropes taut. The ship's portholes and deck lights blaze warm yellow against the black sky; far below, the dark icy sea. A woman's fur coat lies forgotten on the deck by the railing. Freezing mist, cold blue night with warm ship lights, tense and tragic.",
   "the deck lights are flickering dimmer, the lifeboat has swung slightly on its ropes, the mist has drifted.",
   "The empty lifeboat sways slowly on its creaking ropes, the ship's lights flicker as the power struggles, cold mist drifts over the black water.",
   'titanic-boat/bg.mp4')])

show('bb','📺','Во все тяжкие (2008–2013)',
 'Пустыня Нью-Мексико и Альбукерке: выжженное солнце, жёлто-зелёный фильтр, старый фургон, шляпа Хайзенберга, «Лос Поллос Херманос», пачки денег.',
 [('film-bb','Главный фон «Во все тяжкие»','h:Во все тяжкие',
   'Весь сериал: учитель химии Уолтер Уайт узнаёт, что смертельно болен, и превращается в наркобарона Хайзенберга.',
   'Чёрная шляпа «пирожок» (знак Хайзенберга) на столбе забора посреди пустыни, пустое шоссе к столовым горам, марево. Тихо и угрожающе.',
   "The empty New Mexico desert at golden hour. In the center foreground, a black pork-pie hat resting on a weathered wooden fence post. Behind it, a straight two-lane highway disappears toward red mesas under an enormous sky. Dry yellow grass, heat haze, long shadows, warm saturated yellow-green tint, lonely and ominous.",
   "the cloud shadows have moved across the mesas, the dry grass leans the other way in the wind.",
   "Heat haze shimmers over the empty highway, cloud shadows glide slowly across the distant mesas, dry grass sways in the warm wind, the hat on the fence post stays perfectly still.",
   None),
  ('breaking-bad-pilot','Фон сцены «Учитель химии едет на рейд — и встречает бывшего ученика» (S01E01 · Pilot)','breaking-bad-pilot',
   'Пилот. Уолт едет с шурином Хэнком на облаву, узнаёт в сбежавшем бывшего ученика Джесси — и предлагает ему варить вместе: «Покупай фургон. Начинаем завтра».',
   'Старый белый фургон с выцветшими полосами один посреди пустыни, дверь открыта, на зеркале висит противогаз. С этого фургона всё начинается.',
   "An old 1980s white motorhome with faded brown stripes parked alone in the New Mexico desert under a vast blue sky with white clouds. In the center, the motorhome with its side door open, a gas mask hanging from the side mirror, a folding camp chair and a plastic crate on the sand next to it. Desert scrub, red rocks, harsh midday sun, yellow-green tint, absurd and dangerous.",
   "the cloud shadows have moved across the sand, a small swirl of dust has risen near the wheels.",
   "Wind blows small swirls of dust across the sand, desert scrub sways, cloud shadows drift over the motorhome, the gas mask barely swings on the mirror.",
   None),
  ('breaking-bad-gus','Фон сцены «Уолт приходит к Гасу Фрингу в „Лос Поллос Херманос“» (S02E11 · Mandala)','breaking-bad-gus',
   'Уолт приходит в закусочную к вежливому управляющему Гасу Фрингу и предлагает свой товар. Гас отказывается: «вы плохо разбираетесь в людях», «я осторожный человек» — но потом соглашается.',
   'Пустая жёлтая кабинка закусочной ночью: поднос, стакан газировки в каплях, нетронутая курица. Слишком чисто и слишком вежливо — от этого страшно.',
   "Inside an empty fast-food chicken restaurant in Albuquerque at night. In the center, a yellow booth with a red plastic tray holding a paper cup of soda with a straw, beaded with condensation, and an untouched basket of fried chicken. Bright warm yellow interior lights, clean tiles, large windows showing the dark empty parking lot. Spotless, polite, quietly menacing atmosphere. No logos, no signs with text.",
   "a few condensation drops have slid down the cup, the fluorescent light over the booth is slightly dimmer.",
   "Condensation drops slowly slide down the paper cup, the fluorescent light above the booth hums and flickers very slightly, a neon glow outside the window pulses softly.",
   None),
  ('breaking-bad-knocks','Фон сцены «„Я тот, кто стучит“ — и „Где деньги, Скайлер?“» (S04E06 · S04E11)','breaking-bad-knocks',
   'Скайлер умоляет Уолта пойти в полицию — «ты в опасности». Уолт: «Я не в опасности. Опасность — это я. Я тот, кто стучит». Позже он лезет в подпол за деньгами — а их нет: «Скайлер, где деньги?».',
   'Подпол под домом, забитый пачками наличных в плёнке, одна голая лампочка на проводе. Деньги, ради которых всё — и которых вдруг не хватило.',
   "A cramped crawl space under a suburban house, lit by a single bare light bulb hanging from a cord. In the center, tightly packed stacks of cash bundles wrapped in clear plastic fill the space between dusty wooden beams and pink insulation. Dust in the air, dirt floor, harsh yellow light and deep shadows, surreal and claustrophobic.",
   "the hanging bulb has swung slightly to the side, the shadows of the beams have shifted.",
   "The bare light bulb sways slowly on its cord, the shadows of the beams swing across the stacks of wrapped cash, dust floats in the light, the plastic wrap glints.",
   None)])

show('durov','🎙','Павел Дуров',
 'Основатель Telegram: минимализм, чёрное и синее, свобода общения, Дубай. Символ — бумажный самолётик (без логотипа, просто бумажный).',
 [('film-durov','Главный фон «Павел Дуров»','h:Павел Дуров',
   'Всё про Дурова: создал «ВКонтакте» и Telegram, уехал из России, держит Telegram в Дубае и рассказывает, почему не сдаёт пользователей правительствам.',
   'Белый бумажный самолётик парит у окна небоскрёба на фоне ночного Дубая. Свобода, лёгкость, синий и чёрный.',
   "Night view from a high glass tower in Dubai. In the center, a single white paper airplane hangs in mid-air in front of the window, softly lit, as if gliding. Behind it, the glittering night skyline of Dubai under a dark-blue sky. Minimalist, calm, deep black and electric-blue palette, a sense of freedom.",
   "the paper airplane is a little higher and slightly tilted, some city lights twinkle differently.",
   "The white paper airplane floats and gently bobs in the air as if on a soft current, the city lights of the skyline twinkle, a faint reflection moves on the glass.",
   None),
  ('durov-tucker','Фон сцены «Такер Карлсон · 2024»','durov-tucker',
   'Интервью Такеру Карлсону в Дубае (2024): как Дуров начинал, почему уехал, «красные линии» для правительств, каналы и почему Telegram держится в стороне от политики.',
   'Пустая интервью-студия на закате: два кожаных кресла друг напротив друга, два стакана воды, камеры на штативах с красным огоньком, за окном — Дубай. Разговор вот-вот начнётся.',
   "An elegant interview set in Dubai at dusk. In the center, two dark leather armchairs facing each other with a small round table between them holding two glasses of water. Behind them, a tall window with the Dubai skyline at blue hour, warm practical lamps, dark wood. At the edges of the frame, professional cameras on tripods with small red lights. Quiet, serious, cinematic, warm amber and deep blue.",
   "the small red recording light on the camera is now on, the city lights behind are brighter as the sky gets darker.",
   "The sky behind the window slowly darkens as the city lights come on, the small red recording light on a camera blinks, faint light ripples tremble in the glasses of water, the empty chairs stay still.",
   None)])

show('clavicular','🎙','Clavicular',
 'Стример: прямые эфиры с улицы (IRL), знакомства и отказы «в прямом эфире», подкасты, зумерский сленг. Неон, телефон, чат.',
 [('film-clavicular','Главный фон «Clavicular»','h:Clavicular',
   'Всё про Clavicular: стример, который снимает себя на улице — подходит к девушкам, получает отказы прямо в эфире и не боится этого.',
   'Телефон на штативе-стабилизаторе ночью на мокрой улице, на экране — прямой эфир: цветные пузырьки чата и сердечки без букв, вокруг неон.',
   "A night city street after rain. In the center, a smartphone mounted on a small tripod on an outdoor café table, its screen glowing with a live-stream interface made of abstract colorful chat bubbles and little hearts with no letters. Behind, blurred neon lights and the bokeh of passing cars, wet pavement reflections. Modern, energetic, purple-pink-cyan neon palette.",
   "new abstract chat bubbles and floating hearts have appeared on the phone screen, the neon bokeh has shifted.",
   "Abstract colorful chat bubbles and little hearts float up the glowing phone screen, neon city bokeh shimmers in the background, reflections ripple on the wet pavement, the phone stays still.",
   None),
  ('clavicular-impaulsive','Фон сцены «Подкаст Impaulsive»','clavicular-impaulsive',
   'Clavicular в подкасте Impaulsive: про отказы («меня отшивали тысячи раз»), «зелёные сообщения» (Android вместо iPhone) и родителей, которые отключили ему сим-карту.',
   'Студия подкаста после записи: стол с тремя микрофонами, банки энергетиков без этикеток, телефон с зелёным пузырём сообщения, неон на деревянной стене.',
   "A colorful podcast studio after the show. In the center, a wooden table with three professional podcast microphones on boom arms, a few unlabeled energy-drink bottles and cans, and a smartphone lying face up with a green message bubble glowing on its screen. Behind, a wall of wooden planks with neon light strips, white couches and boxing-ring ropes along the back wall. Playful warm light with pink and cyan neon accents. No logos, no text.",
   "the neon strips have shifted color from pink to cyan, the phone screen now shows a second green message bubble.",
   "Neon strips on the wall slowly shift color, the phone screen lights up with a new green message bubble, a faint haze drifts through the studio, the microphones stay still.",
   None)])

o=[]
A=o.append
A('# Фоны: промты (13.0)')
A('')
A('**Что это.** Фоны — награды, они лежат в **Главная → Коллекция → Фоны** (там их смотришь на весь экран по кругу). Внутри сцен видеофонов больше нет.')
A('- **Главный фон** — за весь фильм / сериал / интервью целиком (все сцены пройдены).')
A('- **Фон сцены** — за одну сцену целиком. У сериала сцена = серия (например, Ральф — S04E09), у интервью — конкретное интервью.')
A('- На мелкие эпизоды внутри сцены фонов **нет**.')
A('')
A('Итого: 9 главных фонов + 17 фонов сцен. ✅ — старый фон уже есть (горизонтальный, можно заменить новым по промту ниже), ❌ — фона нет.')
A('')
A('## Как сделать фон — петля на 2 кадрах')
A('')
A('1. **Кадр 1** — картинка. Любой генератор картинок (Midjourney `--ar 9:16 --style raw`, Flux, ChatGPT, Nano Banana, Ideogram). Формат **9:16** (1080×1920). Блок «Кадр 1» копируй целиком — хвост с правилами уже внутри.')
A('2. **Кадр 2** — та же картинка с мелким изменением. Загрузи Кадр 1 в редактор (Nano Banana, ChatGPT «измени картинку», Flux Kontext, Midjourney Vary Subtle) и вставь блок «Кадр 2». Всё остальное должно остаться пиксель в пиксель — иначе петля дёрнется.')
A('3. **Видео** — генератор с первым и последним кадром (Kling — Start & End Frame, Veo 3.1 / Flow — Frames to Video, Hailuo — First & Last Frame, Runway, Luma Keyframes). Два ролика по 5 секунд, 9:16, звук не нужен:')
A('   - ролик **А**: первый кадр = Кадр 1, последний = Кадр 2, промт «Движение»;')
A('   - ролик **Б**: первый кадр = Кадр 2, последний = Кадр 1, тот же промт.')
A('4. Если генератор умеет только первый кадр — сделай один ролик 8–10 с из Кадра 1 с тем же промтом, я закольцую сам (конец плавно перетекает в начало).')
A('5. Клади в репо `scenes` → папка `claude/фоны/` с именами из блока «Файлы». Я склею А+Б в бесшовную петлю (~10 с), сожму (~1–2 МБ, без звука) и выдам в Коллекцию.')
A('')
A('**Правила кадра** (уже вшиты в промты): вертикально 9:16; главный предмет — в центре (на ПК виден средний пояс кадра); верх и низ спокойные и темнее; без людей, лиц, рук, текста, букв, цифр, логотипов. Вместо людей — **вещи из сцены**: генераторы делают лица «пластиковыми» и отказывают из-за актёров. Камера стоит на месте — двигается только мир (дым, свет, вода, ветер): так петля получается гладкой.')
A('')
A('**Негатив** (если у генератора есть поле negative prompt):')
A('```')
A('people, person, face, hands, crowd, silhouette, text, letters, numbers, subtitles, logo, brand, watermark, signature, flag, swastika, insignia, cartoon, anime, illustration, CGI, plastic look, oversaturated, camera shake, zoom, pan, fast motion, flicker, morphing, warping, cuts, scene change')
A('```')
A('')
for code,emoji,title,vis,items in F:
    A('---');A('');A(f'## {emoji} {title}');A('');A(f'Визуальный код: {vis}');A('')
    for fid,head,key,about,idea,k1,k2,mv,old in items:
        st='✅ есть старый — можно заменить' if old and os.path.exists(f'{R}/{old}') else '❌ нужен'
        A(f'### {head} — {st}');A('')
        A(f'**Про что:** {about}  ');A(f'**Идея фона:** {idea}');A('')
        A('**Кадр 1** (картинка 9:16):');A('```');A(k1+' '+IMG);A('```')
        A('**Кадр 2** (правка Кадра 1):');A('```');A(EDIT+k2);A('```')
        A('**Движение** (видео 5 с: ролик А — Кадр 1 → Кадр 2, ролик Б — Кадр 2 → Кадр 1):');A('```');A(mv+' '+MOVE);A('```')
        A(f'Файлы: `{fid}-1.mp4` (ролик А), `{fid}-2.mp4` (ролик Б), `{fid}.jpg` (Кадр 1)  ');A(f'В приложении: `{key}`');A('')
open(OUT,'w').write('\n'.join(o)+'\n')
n=sum(len(x[4]) for x in F);print('ok',n,'фонов',len(F),'фильмов',os.path.getsize(OUT),'байт')

