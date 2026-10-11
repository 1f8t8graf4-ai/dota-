# Фоны с событием (после 13.8.4; идея Андрея: «4 секунды стейбл — потом меняется»). Все 37 фонов, и те, что уже стоят.
# Версия 2 (после 13.8.5): Андрей — «пройтись по ВСЕМ промтам». Каждый переписан заново по реальным кадрам клипа
# (контактные листы cover/poster/NN-k/NN.jpg каждой сцены) и по уже стоящим фонам; у каждого — поле why «что поменял и почему».
# Запуск из корня dota-: python3 tools/bg_event.py → фоны-промты-СОБЫТИЕ.txt (+ фоны-промты-СОБЫТИЕ.json для страницы с копированием)
#
# Почему так:
# • Veo 3.1 понимает разметку по секундам «[00:00-00:04] … [00:04-00:05] …» (timestamp prompting — гайд Google Cloud по Veo 3.1):
#   первые 4 с спокойно (1–2 «текстурных» движения), на 4-й секунде ОДНО резкое событие из сюжета, дальше — «после».
# • Событие — пасхалка сцены, лучше всего — из её же реплик или эпизодов (голем у хасидов, «и они разбиваются» у акулы,
#   «вы в раю» у швейцарского банка). Без людей и рук (правило всех фонов): свет, толчок, ветер, звук-удар, предмет сам падает/катится.
# • Место — то, что реально в кадре клипа (стол Бейтмана из тёмного дерева, а не стекло; спальня Уайтов, а не прихожая).
#   Выдуманное (картина с утками у Мелфи, кейс в Женеве, жемчуг у Роуз) убрано; лица на фото — нельзя (фото повёрнуто/убрано).
# • Петля (loop): 'сама' — к концу всё как в начале, шов — обычный наплыв; 'тьма' — новое состояние держится до конца,
#   шов — короткое затемнение; 'чёрный' — резко в чёрное (как финал «Сопрано»). loop_bg.py получает это через --seam.
# • На Главной событие каждые 8 с мельтешило бы — loop_bg.py повторяет спокойную часть, событие раз в ~12 с.
# • Формула, что сработала у Ральфа, праздника и обеда Ханны: место из сцены, 4–6 предметов со смыслом, один свет,
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
# ru — что в кадре, ev — событие, why — что поменял по сравнению с прошлой версией и почему (всё по-русски, для Андрея)
EV=[]
def add(**e):EV.append(e)

# ============================== ВОЛК С УОЛЛ-СТРИТ ==============================
add(grp='Волк с Уолл-стрит',kind='main',file='волк главный',where='wolf-of-wall-street/film-bg.mp4 (+ копия wolf-lunch-de)',
 title='ГЛАВНЫЙ «Волк с Уолл-стрит» — весь фильм',
 ru='Стол Джордана в зале «Стрэттон Окмонт» ночью после вечеринки: ручка «продай мне эту ручку» на пачке сотен, снятая трубка, рыбка в круглом аквариуме (её проглотит Донни), белая игрушечная «Ламборгини» (поездка на кваалюдах). Сзади — ряды столов с зелёными мониторами, конфетти на ковре.',
 ev='Сверху сыплется густой дождь из сотен — купюры кружатся в свете лампы и ложатся на стол, телефон и вокруг рыбки. Как на вечеринках «Стрэттона».',
 why='Было: ветер из вентиляции поднимает купюры с пола — вентиляция ничего не значит. Стало: тот же стол, что у тебя уже вышел, но чище — в центре ручка «Продай мне эту ручку», шампанское и таблетки убрал (хлам). Событие — денежный дождь сверху: это и есть фильм.',
 loop='тьма',shake=False,
 set="the trading floor of a 1990s Long Island brokerage firm late at night, after a wild office party, nobody left.",
 cam="low angle just above the nearest desk, 28mm lens, the desk in the center and a long aisle of desks behind it.",
 obj="on the nearest desk, in the center: a heavy black-and-gold fountain pen lying across a thick brick of real hundred-dollar bills in a paper band; a beige office telephone with the handset off the hook; a round glass fishbowl with one orange goldfish; a small white toy model of a 1980s Lamborghini Countach. Behind: rows of empty desks with boxy beige monitors glowing green; confetti and a few loose hundred-dollar bills on the carpet.",
 light="one warm brass desk lamp and the cold green glow of the monitors.",
 grade="gold and money-green; greed and excess — \"sell me this pen\".",
 t=[('00:00-00:04',"Calm: the goldfish hovers in place, waving its fins; the monitors glow; nothing else moves."),
    ('00:04-00:06',"A thick shower of real hundred-dollar bills suddenly rains down from above over the whole trading floor: hundreds of bills flutter and spin down through the lamp light onto the desks and the carpet. SFX: a rush of fluttering paper."),
    ('00:06-00:08',"The last bills drift down and settle on the desk, on the telephone and around the fishbowl; the goldfish keeps hovering.")])
add(grp='Волк с Уолл-стрит',kind='scene',sid='wolf-of-wall-street',file='волк ханна',where='wolf-of-wall-street/bg.mp4 (+ копия wolf-lunch-de)',
 title='Сцена «Марк Ханна объясняет новичку правила Уолл-стрит» (и немецкий «Ланч»)',
 ru='Тот самый светлый ресторан над Манхэттеном, который тебе зашёл: мартини один за другим, вода новичка, флакончик, котировки, счёт с сотней. Промт — слово в слово прежний.',
 ev='Начинается ритмичный стук — Ханна бьёт себя в грудь и мычит свою «песню»: стол дрожит в такт, мартини идёт кругами, оливки качаются, пустые бокалы звякают. Потом тишина — всё как было.',
 why='Ничего не трогал — этот промт ты похвалил (ролик уже стоит). Добавил только событие из этой же сцены: удары в грудь и напев Ханны (это разминка Макконахи перед дублями — факт эпизода 1).',
 loop='сама',shake=False,body=base('wolf-of-wall-street')[0],grade=base('wolf-of-wall-street')[1],
 t=[('00:00-00:04',"Calm: a thin thread of smoke rises only from the cigarette, one drop of condensation slides down the shaker, faint haze drifts between the skyscrapers."),
    ('00:04-00:06',"A deep, steady thumping starts, like a man pounding his chest — thump, thump, thump: the whole table trembles to the beat, the martini ripples in rings, the olives bob on the pick, the empty martini glasses rattle against each other. SFX: rhythmic chest thumps and a low humming chant."),
    ('00:06-00:08',"The thumping stops; the ripples fade and the table is calm again, exactly as at the start.")])
add(grp='Волк с Уолл-стрит',kind='scene',sid='wolf-swiss-bank',file='волк банк',where='wolf-swiss-bank/bg.mp4',
 title='Сцена «Швейцарский банк: Ça dépend»',
 ru='Где сидит Джордан: чёрное кожаное кресло у окна во всю стену, столик с эспрессо, чёрная папка счёта и латунный ключик на бархате, коричневые шторы, торшер. За окном — Женевское озеро и фонтан Же-До (он в каждом кадре сцены).',
 ev='Фонтан с рёвом бьёт выше, ветер несёт брызги — и в них встаёт яркая радуга. «С финансовой точки зрения вы теперь в раю». Потом струя опадает, радуга гаснет.',
 why='Было: кабинет банкира и кейс с деньгами, который сам открывается, — кейса в сцене нет. Стало: место из кадра — кресло Джордана у окна с фонтаном. Событие — из эпизода 3 «Рай для денег»: фонтан и радуга. Петля сама — к концу всё как в начале.',
 loop='сама',shake=False,
 set="the private client lounge of a Geneva bank on a sunny afternoon, empty — polite, quiet and discreet.",
 cam="eye level, 35mm lens, facing a floor-to-ceiling window; the window and the lake fountain in the center.",
 obj="in the foreground, a black leather lounge armchair turned toward the window and a small round side table with a white espresso cup on a saucer, a slim black leather account folder and a small brass key on a dark velvet tray; heavy brown curtains at the window edges and a tall floor lamp with a white shade. Through the window: the blue water of Lake Geneva, the old town on the far shore, mountains in haze, and in the middle of the lake a tall white fountain shooting a plume of water high into the sky.",
 light="warm afternoon sun from the window.",
 grade="warm gold, brown and lake blue; discreet old money — everything has a price, it depends.",
 t=[('00:00-00:04',"Calm: the fountain plume sways slightly in the wind, small waves glitter on the lake, a wisp of steam rises from the espresso."),
    ('00:04-00:06',"The fountain surges: its white plume shoots much higher into the sky with a roar, a wide veil of spray drifts in the wind, and a bright rainbow appears in the mist. SFX: a deep roar of rushing water."),
    ('00:06-00:08',"The plume slowly sinks back to its usual height and the rainbow fades; the lounge is calm again, exactly as at the start.")])
add(grp='Волк с Уолл-стрит',kind='scene',sid='wolf-naomi-de',file='волк наоми',where='wolf-naomi-de/bg.mp4',
 title='DE «Первое свидание с Наоми»',
 ru='Полутёмный итальянский ресторан из клипа: кирпичные стены и арки, белая статуя в нише, картина с подсветкой, лампы с кремовыми абажурами, розовые розы, коктейль с соломинкой («можно соломинку?»), красное вино. Посреди скатерти на ребре стоит обручальное кольцо.',
 ev='Кольцо падает, катится дугой по скатерти, крутится всё быстрее и со звоном ложится плашмя. «Ты же женат?» — «Женатым что, нельзя дружить?»',
 why='Было: общий «итальянский ресторан». Стало: тот самый зал из клипа — арки, статуя в нише, кремовые лампы, розы, соломинка. Кольцо поставил в центр кадра и крупнее — на телефоне видно, как оно катится.',
 loop='тьма',shake=False,
 set="a dim, cozy old Italian restaurant in early 1990s New York at night, the table for two empty.",
 cam="eye level across the table, 50mm lens, shallow focus, the ring in the center.",
 obj="a small round table with a white tablecloth; a short table lamp with a pleated cream shade glowing warm; a low vase of pink roses; a cocktail glass with a white straw in it and a glass of red wine; in the middle of the white cloth, a plain gold wedding band standing upright on its edge. Behind, out of focus: dark red brick walls with round brick arches, a small white marble statue in a lit wall niche, a framed landscape painting with a picture light, more little glowing table lamps.",
 light="the warm table lamps and wall sconces, everything else in soft darkness.",
 grade="warm amber and brick red; a married man on a first date that is obviously not \"just friends\".",
 t=[('00:00-00:04',"Calm: reflections shimmer in the glasses, a drop of condensation slides down the cocktail glass; the ring stands still on its edge."),
    ('00:04-00:06',"The wedding band tips over, rolls in a wide arc across the white tablecloth, wobbles faster and faster and spins down flat with a ringing rattle. SFX: a thin metallic rolling, then a rattle."),
    ('00:06-00:08',"The ring lies flat and still on the tablecloth; the reflections keep shimmering in the glasses.")])

# ============================== КЛАН СОПРАНО ==============================
add(grp='Клан Сопрано',kind='main',file='сопрано главный',where='sopranos-s01e01/film-bg.mp4 (+ копия sopranos-mahaffey-de)',
 title='ГЛАВНЫЙ «Клан Сопрано» — весь сериал',
 ru='Кухня Тони ночью (как в твоём ролике): открытый холодильник светит на всю кухню, на острове — нарезка в бумаге из деликатесной, сигара в пепельнице, газета в пакете; на табурете — белый махровый халат. За открытой стеклянной дверью — бассейн, на нём две дикие утки.',
 ev='Утки срываются, бегут по воде и улетают в темноту, по бассейну расходятся круги. А в конце — резко чёрный экран (его добавлю сам). С уток сериал начинается, чёрным заканчивается — начало и конец в одном ролике.',
 why='Было: столик у лавки Сатриале и неоновая свинья — лавку отдал сцене «Хасиды» (там два эпизода из трёх у неё). Стало: кухня с бассейном — та, что у тебя уже вышла, только собранная под событие: улетающие утки (паника Тони из первой серии) и чёрный экран финала.',
 loop='чёрный',shake=False,
 set="the big kitchen of a wealthy suburban New Jersey house late at night, with an open glass sliding door to the backyard pool, empty.",
 cam="eye level from behind the kitchen island, 28mm lens, looking out through the open sliding door; the pool in the center of the frame.",
 obj="on the kitchen island in the foreground: thin slices of cured Italian ham on white deli paper, a heavy glass ashtray with a cigar and a rolled newspaper in a clear plastic bag; a white terry-cloth bathrobe thrown over a stool; at the side, the tall refrigerator stands open and its light spills across the kitchen. Through the open door: a lit turquoise swimming pool at night with two wild mallard ducks floating on it, dark trees behind.",
 light="the cold white glow of the open refrigerator and the turquoise glow of the pool lights.",
 grade="turquoise pool light against warm dark wood; family, food and the fear of losing it all — a mob boss at home.",
 t=[('00:00-00:04',"Calm: the two ducks float slowly on the pool, small ripples glitter, smoke rises only from the tip of the cigar."),
    ('00:04-00:06',"The two ducks suddenly flap their wings, run across the water and take off, flying up and away over the dark trees; water splashes and rings spread across the pool. SFX: loud flapping wings and splashing."),
    ('00:06-00:08',"The pool is empty and the rings slowly fade; the refrigerator hums, the cigar smoke keeps rising.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-s01e01',file='сопрано мелфи',where='sopranos-s01e01/bg.mp4',
 title='Сцена «Тони на первом приёме у психотерапевта» (S01E01)',
 ru='Кабинет Мелфи из клипа: стены в тёплых деревянных панелях, пустое кресло Тони, на стеклянном столике — торшер с белым абажуром-цилиндром и салфетки, высоко — узкое окно с жалюзи и зелёными деревьями, бежевая картина в раме. В приоткрытую дверь видна приёмная с бронзовой статуей женщины (на неё Тони смотрит в самом первом кадре сериала).',
 ev='«Вырубился»: картинка быстро темнеет от краёв, плывёт и почти уходит в чёрное, торшер пульсирует, как сердце, — потом всё медленно возвращается в фокус. Мелфи: «Есть мысли, почему вы потеряли сознание?»',
 why='Было: картина с утками на стене — такой в кабинете нет, я её придумал. Стало: кабинет как в кадре. Событие — паническая атака, с которой Тони и пришёл (эпизод 1). Уток отдал главному фону, чтобы не повторяться.',
 loop='сама',shake=False,
 set="a psychiatrist's office in 1999 on a summer afternoon, empty.",
 cam="eye level, 35mm lens, the patient's empty armchair in the center.",
 obj="warm brown wood-paneled walls; a modern armchair with grey-green fabric and light wooden armrests; next to it a small glass side table with a slim floor lamp with a tall white cylindrical shade and a box of tissues; high on the wall, a long narrow horizontal window with vertical blinds and green trees outside; a framed beige artwork on the paneling. Through a half-open door at the side, the dim waiting room with a bronze sculpture of a reclining woman on a pedestal.",
 light="the warm lamp and soft green daylight from the high window.",
 grade="walnut brown and leaf green; heavy silence — a tough man's first confession.",
 t=[('00:00-00:04',"Calm: the leaves move gently behind the blinds, dust specks drift in the lamp light."),
    ('00:04-00:06',"A blackout: the whole picture quickly darkens from the edges inward and goes soft and blurry, almost to black, as if someone is fainting; the lamp light pulses like a heartbeat. SFX: a loud, slow heartbeat and a ringing in the ears."),
    ('00:06-00:08',"The picture slowly comes back into sharp focus and full light; the room is calm, exactly as at the start.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-s06e09',file='сопрано праздник',where='sopranos-s06e09/bg.mp4',
 title='Сцена «Тони у Мелфи: аттракционы и скука» (S06E09)',
 ru='Уличный праздник святого Эльзеара (серия «The Ride»): статуя в лентах с приколотыми долларами, гирлянды, церковь, колесо обозрения. Промт — слово в слово тот, что дал «нихуя себе».',
 ev='В глубине кадра с грохотом дёргается и встаёт аттракцион с зелёными чашками — в этой серии на нём случается авария («Кто-то пострадал?»). Гирлянды мигают и качаются, ленты с деньгами треплет. Потом всё снова тихо.',
 why='Ничего не трогал — этот промт ты похвалил. Добавил только событие: тот самый аттракцион-«чашки» (в клипе он зелёный), из-за которого в серии весь сыр-бор.',
 loop='сама',shake=False,body=base('sopranos-s06e09')[0],grade=base('sopranos-s06e09')[1],
 t=[('00:00-00:04',"Calm: the ribbons with the pinned bills sway only slightly in a light breeze, the bulbs twinkle softly, the distant Ferris wheel turns slowly."),
    ('00:04-00:05',"In the background the carnival ride with green teacup cars lurches violently with a loud metallic bang and jolts to a stop; the strings of colored bulbs above the street flicker and swing, the ribbons with the pinned bills flap hard. SFX: a metallic bang and distant screams."),
    ('00:05-00:08',"The bulbs steady and stop swinging, the ribbons hang still again, the teacups slowly start turning once more; everything is calm, as at the start.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-arc',file='сопрано арка',where='sopranos-arc/bg.mp4',
 title='Сцена «Где моя арка?» (S01–S02)',
 ru='Тёмная квартира Кристофера из клипа: светящийся аквариум с маленькой серой акулой и рыбками, перед ним стеклянный столик — электрическая машинка с недопечатанным листом сценария, стопка страниц, пепельница с сигаретой, кассеты.',
 ev='Акула кружит всё быстрее — и с глухим ударом врезается в переднее стекло: рыбки врассыпную, поднимается облако песка, листы сценария вздрагивают. Потом песок оседает, акула снова кружит. Мелфи: «Знаете, почему акула всё время плывёт? …и они разбиваются».',
 why='Было: молния, окно распахивается, страницы разлетаются — грозы в сцене нет. Стало: аквариум, который реально стоит у Кристофера в кадре, и событие из эпизода «Акула». Машинка со сценарием осталась — это его «где моя арка?».',
 loop='сама',shake=False,
 set="a small New Jersey apartment at night, late 1990s, empty.",
 cam="eye level from a black leather couch, 35mm lens, the aquarium in the center.",
 obj="in the center, a big glowing home aquarium on a low black cabinet, with sand, a few rocks and small tropical fish, and one small grey reef shark swimming in circles; in front of it, a low glass coffee table with an electric typewriter holding a half-typed sheet, a short stack of typed pages, an ashtray with one lit cigarette and a few unlabeled VHS tapes. Dark walls.",
 light="only the cold blue glow of the aquarium and the orange tip of the cigarette.",
 grade="cold aquarium blue in darkness; a small-time gangster who dreams of Hollywood and wants his life to have an arc.",
 t=[('00:00-00:04',"Calm: the little shark circles the aquarium, bubbles rise from the filter, smoke rises only from the cigarette."),
    ('00:04-00:05',"The shark speeds up, faster and faster, and crashes head-on into the front glass with a heavy thud: the glass shudders, the small fish scatter in all directions, a cloud of sand swirls up, the typed pages on the table quiver. SFX: a heavy underwater thud."),
    ('00:05-00:08',"The sand settles, the fish calm down, and the little shark slowly starts circling again, as at the start.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-ralph',file='сопрано ральф',where='sopranos-ralph/bg.mp4',
 title='Сцена «Ральф приходит к Тони» (S04E09)',
 ru='Задний офис «Бада Бинг» — тот промт, по которому вышел твой лучший ролик, слово в слово: зелёная лампа, арифмометр, виски, телик со скачками, в двери — шест на пустой сцене.',
 ev='На телике скачки сменяются огнём — экран заливает пламя, потом рябь. В этой серии сгорит конюшня с лошадью Пай-О-Май, и Тони решит, что это Ральф.',
 why='Ничего не трогал — это твой лучший ролик. Добавил только событие: огонь на телике со скачками (пожар в конюшне — главное в этой серии).',
 loop='тьма',shake=False,body=base('sopranos-ralph')[0],grade=base('sopranos-ralph')[1],
 t=[('00:00-00:04',"Calm: the TV image flickers with the blurry horse race, the pink neon light through the door pulses slowly, smoke rises only from the tip of the cigarette."),
    ('00:04-00:05',"On the small TV the horse race suddenly turns into bright orange fire — flames fill the whole little screen and light up the desk. SFX: the crackle of a fire."),
    ('00:05-00:08',"The TV burns orange for a moment more, then cuts to grey static snow; the green lamp and the pink neon stay as they were.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-mahaffey-de',file='сопрано махаффи',where='sopranos-mahaffey-de/bg.mp4',
 title='DE «Тони, Мелфи и Махаффи» (S01E01)',
 ru='Офисный парк из клипа: газон, плакучие ивы, низкое здание с тёмными окнами. На асфальте — выбитый картонный поднос и три стакана кофе в луже, рядом одна мужская туфля; прямо за ними — чёрный седан с тонировкой криво на газоне, дверь открыта, фары смотрят в камеру.',
 ev='Фары мигают, седан рывком едет вперёд и колесом давит поднос — стаканы лопаются, кофе брызгает по асфальту; резкое торможение, машина качается. Так Тони и «пил кофе» с Махаффи.',
 why='Было: машина на газоне просто дёргается вперёд. Стало: кофе на переднем плане, машина прямо за ним — событие сразу читается: седан давит стаканы. Всё — из клипа (газон, ивы, разлитый кофе).',
 loop='тьма',shake=False,
 set="the grass lawn and parking lot of a quiet New Jersey corporate office park on a grey morning, empty.",
 cam="very low angle from the asphalt, 24mm lens; the spilled coffee in the foreground and the car right behind it, both in the center.",
 obj="in the foreground on the asphalt: a crushed cardboard cup tray and three spilled paper coffee cups in a puddle of coffee, one brown leather office shoe lying alone beside them; a few meters behind, a black 1999 luxury sedan with dark tinted windows stopped crooked half on the lawn, its driver's door open, its engine idling, its headlights facing the camera. Behind: a low office building with dark glass and big weeping willow trees.",
 light="flat grey overcast morning light.",
 grade="muted green and grey; a pleasant suburban morning that just turned into a beating.",
 t=[('00:00-00:04',"Calm: thin steam rises from the spilled coffee, the long willow branches sway gently, exhaust drifts from the idling sedan."),
    ('00:04-00:05',"The sedan's headlights flash and it lurches forward with a roar, its front wheel rolling right over the cup tray: the paper cups burst and coffee splashes across the asphalt; then it brakes hard and rocks to a stop, the open door swinging. SFX: an engine roar, a crunch and squealing brakes."),
    ('00:05-00:08',"The car stands still over the flattened cups, exhaust drifting; the coffee spreads on the asphalt; the willows sway.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-hasid-de',file='сопрано хасиды',where='sopranos-hasid-de/bg.mp4',
 title='DE «Хасиды нанимают Тони» (S01E03)',
 ru='Лавка Сатриале летом — сюда хасиды и приходят нанять Тони (эпизоды 1–2): каменная стена, длинная красная маркиза, в витрине колбасы и сыры и нарисованная улыбающаяся свинья, у двери итальянский флаг. Перед лавкой — столик с красно-белой клетчатой скатертью, два эспрессо и чёрная широкополая шляпа хасида.',
 ev='Три медленных тяжёлых удара, как шаги великана: в чашках с каждым шагом прыгают ровные круги, чашки дребезжат, шляпа вздрагивает, маркиза трясётся. Потом тишина. «Ты создаёшь себе голема — чудовище для грязной работы» (эпизод 2).',
 why='Было: стойка мотеля — это только 3-й эпизод. Стало: лавка Сатриале, где идут два эпизода из трёх, — её все узнают. Событие — голем из реплики на идише в эпизоде 2: нанятые громилы идут «уговаривать» зятя. Файл переименовал: «сопрано хасиды».',
 loop='сама',shake=False,
 set="the sidewalk in front of an old Italian pork store in a New Jersey town on a sunny summer afternoon, nobody around.",
 cam="eye level from the curb, 35mm lens, the café table in the center.",
 obj="a small café table with a red-and-white checkered tablecloth and two green metal folding chairs; on the table, two small white espresso cups on saucers and a black wide-brimmed felt hat lying on its crown. Behind: a stone shop front with a long red awning; in the big shop window hang salamis and round provolone cheeses, and a smiling cartoon pig's face is painted on the glass; an Italian flag hangs by the door. No letters, no signs and no text anywhere.",
 light="bright summer sun and the deep shade under the awning.",
 grade="warm stone, checkered red and summer green; a polite business lunch where they hire muscle — a golem to do the dirty work.",
 t=[('00:00-00:04',"Calm: the awning flutters slightly in the breeze, a thin wisp of steam rises from one espresso cup."),
    ('00:04-00:06',"Three slow, heavy, ground-shaking thuds, like the footsteps of a giant coming closer: with each one, perfect rings jump across the coffee in the cups, the cups rattle on their saucers, the black hat trembles and the awning shivers. SFX: three deep, heavy booms."),
    ('00:06-00:08',"The thuds stop; the rings in the cups fade and everything is calm again, exactly as at the start.")])
add(grp='Клан Сопрано',kind='scene',sid='sopranos-phil-de',file='сопрано фил',where='sopranos-phil-de/bg.mp4',
 title='DE «Фил решает» (S06E20)',
 ru='Старое бруклинское кафе зимой (как в клипе): кружевные шторы в цветочек светятся, тёмное дерево, латунное бра, гнутые стулья. На мраморном столике — белая чашка эспрессо с ложечкой, стакан воды и сложенный белый платок Фила.',
 ev='Чашка с резким треском раскалывается на блюдце пополам, кофе растекается по мрамору и пропитывает белый платок тёмным пятном. «Проще говоря: рубим им голову и ведём дела с теми, кто останется».',
 why='Было: со стены падает семейное фото — на фото были бы лица, а их нельзя. Стало: всё из кадра (крупно эспрессо с ложечкой, белый платок в кармане Фила). Событие — «обезглавить» без крови и людей: белое пропитывается тёмным.',
 loop='тьма',shake=False,
 set="a small old Brooklyn café on a winter afternoon, empty.",
 cam="eye level close to the table, 50mm lens, shallow focus, the cup in the center.",
 obj="a small round grey marble table; on it a white espresso cup with a little spoon resting in it, on a white saucer; a glass of water; a neatly folded white silk pocket square lying beside the saucer. Behind, slightly out of focus: dark wooden wainscoting, a brass wall sconce with a frosted glass shade, bentwood chairs and a big window with glowing white lace curtains with a floral pattern.",
 light="pale wintry daylight through the lace curtains; the dark interior lit only by the sconce.",
 grade="dark brown and cold white; quiet coffee, cold decision — a whole family is ordered decapitated over an espresso.",
 t=[('00:00-00:04',"Calm: a thin wisp of steam rises from the espresso, the lace curtains glow softly."),
    ('00:04-00:05',"With a sharp crack the espresso cup splits in two on its saucer; the dark coffee floods out across the marble and runs into the folded white pocket square. SFX: a sharp crack of porcelain."),
    ('00:05-00:08',"A dark stain slowly spreads through the white cloth; the little spoon lies between the two halves of the cup; the curtains glow.")])

# ============================== АМЕРИКАНСКИЙ ПСИХОПАТ ==============================
add(grp='Американский психопат',kind='main',file='психопат главный',where='american-psycho/film-bg.mp4',
 title='ГЛАВНЫЙ «Американский психопат» — весь фильм',
 ru='Белая квартира Бейтмана ночью (как в твоём ролике): пол застелен газетами, в центре на хромовой вешалке прозрачный плащ, топор с красным обухом у белого дивана, стереосистема с зелёными индикаторами, за окном — ночной Манхэттен.',
 ev='Свет щёлкает и гаснет на секунду. Включается — вешалка пустая и топора нет: он оделся и пошёл к Полу Аллену («Hip to Be Square»). В конце свет моргнёт ещё раз (затемнение) — и всё снова на месте.',
 why='Идея та же — у тебя она уже вышла. Убрал визитки и крем (у них своя сцена) — кадр чище, плащ с топором в центре. Добавил событие: в темноте плащ и топор исчезают.',
 loop='тьма',shake=False,
 set="a minimalist white 1987 Manhattan luxury apartment at night, empty.",
 cam="symmetrical wide shot, 28mm lens, the coat stand in the center.",
 obj="the white floor neatly covered with spread newspapers with blurred unreadable print; in the center, a transparent plastic raincoat hanging on a chrome coat stand; a fire axe with a red head leaning against a white leather sofa; a silver stereo system with glowing green level meters; a big window onto the Manhattan skyline at night.",
 light="cold white ceiling light and the blue night city.",
 grade="sterile white perfection with something horribly wrong; a polite yuppie who is a monster inside.",
 t=[('00:00-00:04',"Calm: the green level meters on the stereo bounce to the music, the city lights twinkle; nothing else moves."),
    ('00:04-00:05',"The ceiling light clicks off: for one second the room is dark, lit only by the blue city and the green meters. SFX: a click; the bass of an upbeat 1980s pop song thumps."),
    ('00:05-00:08',"The light clicks back on — the coat stand is empty and the axe is gone; everything else is exactly as before, the meters bouncing.")])
add(grp='Американский психопат',kind='scene',sid='american-psycho',file='психопат офис',where='american-psycho/bg.mp4',
 title='Сцена «Патрик Бейтман приходит в офис»',
 ru='Угловой кабинет Бейтмана из клипа: стол из тёмного красного дерева и чёрное кожаное кресло, жалюзи с полосками солнца на башни Уолл-стрит, маленький телевизор на тумбе. На столе — минералка с лаймом («принеси минералку»), плеер с оранжевыми наушниками (он в них входит), ежедневник для брони и ручка строго параллельно.',
 ev='Сверху в стакан минералки падает одна тёмно-красная капля и расплывается облаком. Всё остальное — идеально ровно: под маской что-то не так.',
 why='Было: стеклянный стол — у Бейтмана в кадре стол из тёмного дерева. Стало: кабинет как в клипе (дерево, жалюзи, телевизор на тумбе). Событие оставил — красная капля в минералку лучше всего говорит «психопат», не показывая крови.',
 loop='тьма',shake=False,
 set="a 1987 Wall Street corner office on a sunny morning, empty.",
 cam="three-quarter view from above the desk, 35mm lens, the glass of water in the center.",
 obj="a polished dark mahogany desk with a black leather executive chair behind it; on the desk, a tall glass of sparkling mineral water with a lime slice, a silver portable cassette player with orange foam headphones, an open black leather planner with a fountain pen laid perfectly parallel to it. Behind: tall windows with horizontal metal venetian blinds half open onto sunlit office towers, grey walls, a small black television on a wooden credenza.",
 light="cold morning sun through the blinds, laying thin striped shadows across the desk.",
 grade="steel grey, mahogany and white; a sterile, arrogant 1980s yuppie morning with something wrong underneath.",
 t=[('00:00-00:04',"Calm: bubbles rise in the sparkling water, haze drifts slowly between the towers."),
    ('00:04-00:05',"A single drop of dark red liquid falls from above into the glass of water and blooms into a slow red cloud. SFX: one soft drip."),
    ('00:05-00:08',"The red cloud slowly curls and spreads through the water around the lime slice; everything else on the desk stays perfectly neat and still.")])
add(grp='Американский психопат',kind='scene',sid='american-psycho-cards',file='психопат визитки',where='american-psycho-cards/bg.mp4',
 title='Сцена «Визитки: чья круче»',
 ru='Переговорная Pierce & Pierce из клипа: тёмное красное дерево, чёрные кожаные кресла, жалюзи. На столе — пять белых визиток веером (кость, яичная скорлупа, слоновая кость) и стакан воды со льдом.',
 ev='Полоска солнца из жалюзи переползает на последнюю визитку — она светится теплее всех, и в ней проступает водяной знак («у неё даже водяной знак!»), лёд в стакане трескается. Потом свет уходит обратно.',
 why='Было: «тёмный стол под софитом» и виски — виски в сцене нет, а комнату не узнать. Стало: переговорная из кадра, вместо софита — солнце из жалюзи (так свет может двигаться сам). Петля сама.',
 loop='сама',shake=False,
 set="a 1987 Wall Street boardroom on a bright afternoon, empty.",
 cam="low grazing angle across the table, 100mm macro lens, very shallow focus, the cards in the center.",
 obj="on a glossy dark mahogany table, five white business cards laid in a neat fan, each a slightly different shade of white (bone, eggshell, ivory), with embossed lettering too small and blurred to read; beside them, a glass of water with ice beaded with condensation. Behind, out of focus: dark wood paneling, black leather chairs and a window with horizontal venetian blinds.",
 light="a dim room; thin stripes of daylight from the blinds lie across the table beside the cards.",
 grade="dark mahogany with creamy whites; petty envy and status games — \"it even has a watermark\".",
 t=[('00:00-00:04',"Calm: a drop of condensation slides down the glass; the light stripes rest beside the cards."),
    ('00:04-00:05',"A stripe of sunlight slides across the table onto the last card on the right: its thick paper glows richer and warmer than all the others and a faint watermark appears in it; the ice in the glass cracks and shifts. SFX: a sharp crack of ice and a low swell."),
    ('00:05-00:08',"The last card glows for a moment, then the sunlight slowly slides back off the cards, exactly as at the start.")])

# ============================== ТАКСИСТ ==============================
add(grp='Таксист',kind='main',file='таксист главный',where='taxi-driver-lonely/film-bg.mp4',
 title='ГЛАВНЫЙ «Таксист» — весь фильм',
 ru='Каморка Трэвиса ночью (как в твоём ролике): треснутое зеркало («ты мне это говоришь?»), армейская куртка, на комоде — револьвер, дневник, белый хлеб и бутылка бренди, телик с рябью; за окном — красный неон и такси в пару.',
 ev='В окно обрушивается настоящий ливень — потоки воды по стеклу, неон и такси расплываются. «Однажды придёт настоящий дождь и смоет всю эту мразь с улиц».',
 why='Комната та же, что у тебя вышла: убрал очки (лишнее), добавил хлеб с бренди — его еду из фильма. Событие — из самой известной реплики Трэвиса: настоящий дождь.',
 loop='тьма',shake=False,
 set="a tiny cheap rented room in 1970s New York at night, empty.",
 cam="eye level, 28mm lens, the window in the center.",
 obj="a small cracked mirror on a dingy yellow wall above an old dresser; on the dresser, all at real size: a black revolver lying flat, an open diary with blurred handwriting, a loaf of white bread and a bottle of brandy with no label; an olive-green army field jacket hangs beside the mirror; an old portable TV with grey static on the floor; the window shows a wet street with red neon and a yellow taxi parked below in a cloud of steam.",
 light="one bare bulb, the TV glow and red neon from the street.",
 grade="dirty yellow and red; a lonely insomniac talking to his mirror, violence brewing.",
 t=[('00:00-00:04',"Calm, humid night: the TV static flickers, steam drifts past the taxi outside the window."),
    ('00:04-00:05',"A real rain comes: a sudden heavy downpour hits the window — sheets of water lash against the glass and flood the street below. SFX: the roar of rain and a rumble of thunder."),
    ('00:05-00:08',"Rain streams down the window, the red neon and the taxi blur behind the running water; the TV static keeps flickering.")])
add(grp='Таксист',kind='scene',sid='taxi-driver-lonely',file='таксист одинокий',where='taxi-driver-lonely/bg.mp4',
 title='Сцена «Одинокий человек Бога»',
 ru='Ночная смена, как в начальных титрах фильма: такси Checker изнутри с заднего сиденья — исцарапанная перегородка, пустое место водителя, дневник на переднем сиденье, старый счётчик с флажком; за мокрым стеклом — размытый неон и пар из люка.',
 ev='«Дни идут с регулярностью, один за другим… и вдруг — перемена»: дворники ходят как метроном — и вдруг встают посреди стекла, а улицу заливает яркий белый свет (так он увидит Бетси в белом). Свет гаснет — дворники снова пошли.',
 why='Идею оставил — она прямо из текста сцены. Уточнил по фильму: такси Checker, счётчик с флажком, неон и пар из люка — как в начальных титрах, их все помнят.',
 loop='сама',shake=False,
 set="inside a 1970s New York yellow Checker cab at night, parked, seen from the empty back seat.",
 cam="from the back seat, 28mm lens, looking forward through the windshield.",
 obj="the scratched plexiglass partition, the empty driver's seat, an open diary with blurred handwriting on the front passenger seat, an old mechanical taxi meter with a metal flag on the dashboard, no readable numbers; through the wet windshield, a dark street glowing with soft out-of-focus red, green and yellow neon, and white steam rising from a manhole in the street.",
 light="only the neon and the street lights from outside.",
 grade="red and green neon in darkness; insomnia and loneliness — \"and then suddenly, there is change\".",
 t=[('00:00-00:04',"Regularity: the windshield wipers sweep back and forth in a slow, steady rhythm, raindrops trickle down the glass, the steam drifts — over and over, the same."),
    ('00:04-00:05',"Then suddenly there is change: the wipers stop dead in the middle of the glass, and the street outside fills with a bright, soft white light. SFX: the wipers stop, a single high note."),
    ('00:05-00:07',"The white glow lingers on the wet glass, then slowly fades back into the neon night."),
    ('00:07-00:08',"The wipers start their slow, steady rhythm again, exactly as at the start.")])
add(grp='Таксист',kind='scene',sid='taxi-driver-betsy',file='таксист бетси',where='taxi-driver-betsy/bg.mp4',
 title='Сцена «Трэвис зовёт Бетси на кофе»',
 ru='Предвыборный штаб из клипа: красный ковёр, красно-бело-синие флажки, столы с машинками, телефонами и пачками листовок, большие окна с деревьями. На столе Бетси — жёлтые ромашки в вазочке, кофе, кусок пирога и маленький вентилятор.',
 ev='Вентилятор разворачивается к пачке листовок — она взрывается в воздух, бумага летит по всему штабу, флажки бьются. «Кофе и пирог» стоят посреди хаоса.',
 why='Кадр уточнил по клипу: жёлтые ромашки (они реально на её столе), красный ковёр. Событие оставил — оно лучшее для этой сцены: вся суета штаба против простого «кофе и пирог?».',
 loop='тьма',shake=False,
 set="a 1972 presidential campaign headquarters in New York on a sunny afternoon, empty.",
 cam="eye level, 35mm lens, the front desk in the center.",
 obj="a red carpet; red-white-and-blue paper bunting along the walls; desks with typewriters, telephones and piles of leaflets; on the front desk, a small vase of yellow daisies, a paper cup of coffee, a slice of pie on a paper plate and a small electric desk fan; big windows with daylight and green trees outside. No posters and no writing.",
 light="bright warm daylight from the windows.",
 grade="warm red, white and blue; bright 1970s optimism and an awkward, hopeful invitation for coffee and pie.",
 t=[('00:00-00:04',"Calm: the desk fan turns slowly from side to side, the bunting ripples gently, steam rises from the coffee."),
    ('00:04-00:05',"The fan swings toward a pile of leaflets and a strong gust bursts them into the air: they flutter all over the room, the bunting flaps hard. SFX: a whoosh of paper."),
    ('00:05-00:08',"The leaflets drift down onto the desks and the red carpet and settle; the coffee and the slice of pie stand untouched in the center.")])

# ============================== БУНКЕР ==============================
add(grp='Бункер',kind='main',file='бункер главный',where='downfall-bunker/film-bg.mp4',
 title='ГЛАВНЫЙ «Бункер» — весь фильм',
 ru='Руины Берлина в апреле 1945-го с лестницы бункера (как в твоём ролике): на ящике — карта с карандашными стрелками, круглые очки и сломанный карандаш; вокруг — горящие остовы зданий, купол, колонны, красное дымное небо.',
 ev='В руинах рвётся снаряд: оранжевая вспышка на всё небо, кадр вздрагивает, углы карты подпрыгивают, мимо летят пыль и искры. Потом дым снова тянется, как в начале.',
 why='Кадр тот же — он у тебя вышел. Добавил событие: разрыв снаряда — так звучат все последние дни в бункере. Петля сама: к концу всё как в начале.',
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
 ru='Та самая серо-зелёная бетонная комната из клипа: на стене большая цветная карта Европы, на столе — военные карты Берлина с красными и синими стрелками, круглые очки и красно-синий карандаш (тот, что он вертит в руках), над столом — железная лампа на шнуре.',
 ev='Яростный удар по столу: карандаш подлетает, кувыркается и падает со стола, цветные карандаши разлетаются по карте, очки подпрыгивают, лампа раскачивается и мигает, с потолка сыплется пыль. «Это был приказ!»',
 why='Было: стол и зелёная лампа «в пустоте» — комнату не узнать. Стало: комната из кадра с картой Европы на стене и тем самым красно-синим карандашом. Событие — главный срыв фильма.',
 loop='тьма',shake=False,
 set="a small concrete bunker conference room in April 1945, empty.",
 cam="high angle looking down at the table, 35mm lens; the table and the wall map behind it.",
 obj="grey-green painted concrete walls with a big colored wall map of Europe; a large wooden table covered with paper military maps of Berlin with red and blue pencil arrows; a pair of round wire-rimmed glasses lying on the map; a long red-and-blue pencil and a few colored pencils; a plain metal lamp hangs low above the table on a cord. No flags, symbols or insignia, no readable text.",
 light="only the hanging lamp, everything else in grey darkness.",
 grade="grey concrete and sickly green light; a furious outburst — the war is lost.",
 t=[('00:00-00:04',"Calm: fine dust floats in the lamp light; the lamp hangs still."),
    ('00:04-00:05',"A furious blow hits the table from above: the red-and-blue pencil jumps, flips through the air and flies off the edge, the colored pencils scatter across the map, the glasses bounce, the lamp swings hard and flickers, dust trickles from the ceiling. SFX: a loud bang on wood and a furious shout."),
    ('00:05-00:08',"The lamp keeps swinging, its light sliding over the scattered pencils; dust drifts down; then it slowly calms.")])

# ============================== ТИТАНИК ==============================
add(grp='Титаник',kind='main',file='титаник главный',where='titanic-boat/film-bg.mp4 (+ копия titanic-andrews-de)',
 title='ГЛАВНЫЙ «Титаник» — весь фильм',
 ru='Нос «Титаника» ночью под звёздами, айсберг уже вплотную у правого борта. Белые поручни, доски палубы, кнехты, спасжилет; на досках — кулон «Сердце океана».',
 ev='Удар: корабль содрогается, кадр трясёт, с айсберга откалываются глыбы льда и с грохотом катятся по палубе, кулон подпрыгивает. Как в фильме — лёд на палубе после столкновения.',
 why='Было в твоём ролике: нос и айсберг далеко на закате — красиво, но ничего не происходит. Стало: ночь, айсберг вплотную, и событие — само столкновение. Кулон остался: любовь и катастрофа в одном кадре.',
 loop='тьма',shake=True,
 set="the bow deck of a huge 1912 ocean liner at night on a flat calm sea under a sky full of stars, empty; a towering pale iceberg is sliding past right beside the starboard railing.",
 cam="low angle from the deck, 24mm lens, the railing and the iceberg in the center.",
 obj="white railings, old wooden deck planks, two black iron mooring bollards and a white canvas life jacket by the railing; on the planks in the foreground, a necklace with a heart-shaped deep-blue gemstone pendant on a fine chain, small, the size of a walnut.",
 light="cold starlight on the ice and the warm glow of the deck lamps.",
 grade="icy blue and warm gold; love and catastrophe in one frame.",
 t=[('00:00-00:04',"Calm: the blue gem sparkles softly, thin mist drifts around the iceberg as it slides slowly past, the sea is perfectly still."),
    ('00:04-00:05',"Impact: the whole ship shudders and the frame shakes; chunks of white ice break off the iceberg and crash onto the deck, skidding across the planks; the pendant jumps. SFX: a deep grinding of steel against ice."),
    ('00:05-00:08',"The shaking stops; chunks of ice lie scattered on the deck around the pendant, the iceberg slides away into the dark.")])
add(grp='Титаник',kind='scene',sid='titanic-boat',file='титаник шлюпка',where='titanic-boat/bg.mp4',
 title='Сцена «Джек сажает Роуз в шлюпку»',
 ru='Вертикальный кадр сверху вдоль борта — как Роуз смотрит на Джека из спускаемой шлюпки: белый поручень со спасжилетом, чуть ниже — пустая деревянная шлюпка на тросах, вниз уходит чёрный борт с рядами горящих иллюминаторов, далеко внизу — ледяная чёрная вода.',
 ev='Тросы дёргаются в блоках — шлюпку рывками спускают вниз вдоль борта, мимо горящих иллюминаторов; она становится маленькой над чёрной водой. «Садись в лодку, Роуз».',
 why='Было: шлюпка у пустой стены сбоку — плоско. Стало: высота борта и спуск вниз — для вертикального экрана это лучший ракурс, и это суть сцены: её спускают, а она потом прыгнет обратно.',
 loop='тьма',shake=False,
 set="the side of a huge 1912 ocean liner at night during the sinking, seen from the boat deck railing, empty.",
 cam="looking straight down over the railing along the black hull, 24mm lens; the lifeboat just below, in the center.",
 obj="the white railing in the foreground with a white canvas life jacket hanging on it; just below, an empty wooden lifeboat hanging from two ropes, swaying; the tall black hull goes down and down with rows of glowing round portholes; the black freezing sea far below.",
 light="the warm glowing portholes and deck lamps against the black night.",
 grade="freezing blue-black night with warm failing lights; a tragic goodbye.",
 t=[('00:00-00:04',"Calm: the empty lifeboat sways slightly on its ropes just below the railing, the portholes glow, thin mist drifts over the water far below."),
    ('00:04-00:06',"The ropes run through the pulleys with a jerk and the lifeboat starts going down: it drops in short jolts along the hull, past the rows of glowing portholes, getting smaller and smaller. SFX: creaking ropes and squealing pulleys."),
    ('00:06-00:08',"The lifeboat is a small shape near the black water far below, the slack ropes swing against the hull; the portholes keep glowing.")])
add(grp='Титаник',kind='scene',sid='titanic-andrews-de',file='титаник эндрюс',where='titanic-andrews-de/bg.mp4',
 title='DE «Эндрюс: корабль утонет»',
 ru='Крупно чертёж «Титаника» из клипа: большой синий лист с белыми линиями отсеков (по нему Эндрюс показывает «пять отсеков»), латунная линейка и тяжёлая чернильница прижимают углы, открытые золотые часы, карандаш, стакан воды; тёплая латунная лампа.',
 ev='Комната кренится на нос: карандаш скатывается со стола, часы ползут по чертежу, вода в стакане встаёт наискось и плещет через край. «Это математически неизбежно».',
 why='Было: штурманская с иллюминатором — общий вид. Стало: крупно чертёж из кадра. Событие то же, но крен теперь видно по воде в стакане — самый наглядный знак, что корабль тонет.',
 loop='тьма',shake=False,
 set="the chart room of a 1912 ocean liner at night, empty.",
 cam="high angle over the table, 35mm lens, the blueprint in the center.",
 obj="a large wooden table covered with a big blue blueprint of the liner seen from the side, its watertight compartments drawn in thin white lines; it is held flat by a brass ruler and a heavy glass inkwell; a gold pocket watch lying open on the blueprint; a pencil; a glass of water. Dark wood paneling around the table.",
 light="only a warm brass desk lamp.",
 grade="deep blue and warm brass; calm numbers that mean death — a mathematical certainty.",
 t=[('00:00-00:04',"Calm: the pocket watch's second hand ticks, the water in the glass is perfectly still."),
    ('00:04-00:05',"The whole room lurches and lists toward the bow: the pencil rolls off the table, the pocket watch slides down across the blueprint, the water in the glass tilts and slops over the rim. SFX: a deep groan of steel."),
    ('00:05-00:08',"The room stays tilted: the water in the glass sits at a slant, the watch rests at the edge of the blueprint, still ticking.")])
add(grp='Титаник',kind='scene',sid='titanic-mother-de',file='титаник корсет',where='titanic-mother-de/bg.mp4',
 title='DE «Мать и корсет»',
 ru='Каюта первого класса из клипа: белый атласный корсет с длинными шнурками на портновском манекене у зеркала, тёмно-красные бархатные шторы, резные панели, золотые бра, жёлтые лилии на туалетном столике.',
 ev='Шнурки корсета сами затягиваются тремя резкими рывками — корсет туже, манекен качается. Мать затягивает Роуз и запрещает ей видеться с Джеком: «Это не игра».',
 why='Было: рвётся жемчужное ожерелье — в сцене его нет. Стало: то, что в сцене и происходит, — корсет. Лилии и бархат — из кадра.',
 loop='тьма',shake=False,
 set="a luxurious first-class stateroom of a 1912 ocean liner in the evening, empty.",
 cam="eye level, 50mm lens, shallow focus, the corset in the center.",
 obj="a white satin corset with long loose laces on a dressmaker's form standing in front of a tall mirror that reflects only the room; a dressing table with a vase of yellow lilies and a silver hairbrush; heavy dark-red velvet curtains; carved wooden wall panels and golden wall sconces with small shades.",
 light="warm golden sconces.",
 grade="gold, cream and deep crimson; luxury that feels like a cage — the money is gone, she must marry well.",
 t=[('00:00-00:04',"Calm: the loose corset laces sway slightly, the velvet curtain moves very gently."),
    ('00:04-00:05',"The laces suddenly yank tight by themselves in three sharp jerks, cinching the corset narrower around the form; the form rocks on its stand. SFX: three sharp tugs of cord and a creak."),
    ('00:05-00:08',"The corset stays laced painfully tight; the form slowly stops rocking; the lilies glow.")])

# ============================== ВО ВСЕ ТЯЖКИЕ ==============================
add(grp='Во все тяжкие',kind='main',file='бб главный',where='breaking-bad-pilot/film-bg.mp4 (+ копия bb-knocks-de)',
 title='ГЛАВНЫЙ «Во все тяжкие» — весь сериал',
 ru='Весь сериал (как в твоём ролике): фургон в пустыне на закате, в двери — жёлтый костюм химзащиты, на ступеньке — шляпа Хайзенберга и голубые кристаллы, на кусте — штаны из первой серии. Плюс пасхалка 2-го сезона: обгоревший розовый мишка без глаза в песке.',
 ev='В фургоне что-то идёт не так: из двери и люка на крыше вырывается густое белое облако, костюм раскачивается. Как в пилоте, когда Уолт травит газом Эмилио и Крейзи-8. Облако уносит ветром.',
 why='Кадр тот же — он у тебя вышел. Добавил одну деталь на весь сериал — мишку из 2-го сезона. Событие — главное, что происходит в этом фургоне: варка, которая идёт не так.',
 loop='тьма',shake=False,
 set="the New Mexico desert at golden hour, nobody around.",
 cam="low wide angle, 24mm lens, the motorhome in the center.",
 obj="an old 1980s white motorhome with faded brown stripes, its side door open, a yellow hazmat suit hanging in the doorway; a black pork-pie hat resting on the metal step with a few sky-blue glass-like crystals glinting beside it; a pair of khaki pants caught on a desert shrub in the foreground; half-buried in the sand nearby, a small burned pink teddy bear missing one eye. Red mesas behind under a huge sky.",
 light="low warm sun from the side, long shadows.",
 grade="sun-baked yellow and crystal blue; a chemistry teacher who became a kingpin.",
 t=[('00:00-00:04',"Calm: the khaki pants flap gently on the shrub in the hot wind, heat haze shimmers above the sand."),
    ('00:04-00:05',"Inside the motorhome something goes wrong: a thick cloud of white chemical smoke bursts out of the open door and the roof vent, the yellow suit swings. SFX: a sharp hiss and a muffled bang."),
    ('00:05-00:08',"The white smoke rolls out over the sand and drifts away in the wind; the motorhome stands in a thinning haze.")])
add(grp='Во все тяжкие',kind='scene',sid='breaking-bad-pilot',file='бб засада',where='breaking-bad-pilot/bg.mp4',
 title='Сцена «Учитель химии едет на рейд» (S01E01)',
 ru='Засада DEA из клипа: вид из машины через лобовое — тихая улица, одноэтажный дом «цвета шалфея» (из реплики Хэнка), рядом бежевый двухэтажный с черепицей, красный джип у дома, жёлтый пожарный гидрант. В машине — авиаторы, карта, жилет со значком, рация.',
 ev='Рация трещит и мигает — и в тот же миг распахивается окно второго этажа: вылетают джинсы, рубашка и кроссовки и катятся по крыше на газон. Так Джесси и сбежал с рейда, а Уолт его узнал.',
 why='Было: из окна вылетала одна рубашка, дома — общие. Стало: дома как в клипе (шалфейный, бежевый двухэтажный, гидрант, джип) и побег нагляднее — вся одежда летит по крыше.',
 loop='тьма',shake=False,
 set="inside a parked car on a DEA stakeout on a sunny Albuquerque suburban street, nobody inside.",
 cam="from the back seat between the front seats, 28mm lens, looking through the windshield; the two houses in the center.",
 obj="on the dashboard, aviator sunglasses and a folded paper map; on the passenger seat, a black tactical vest with a gold badge patch and no text; a police radio with a handset on a coiled cord. Through the windshield: a quiet street of stucco houses under blue mountains; the last house on the right is one-story and painted sage green; next to it, a beige two-story stucco house with a sloping tiled roof and an upstairs window; a dark red SUV in its driveway and a yellow fire hydrant by the curb.",
 light="harsh midday sun.",
 grade="bleached sun with a yellow-green tint; a boring stakeout about to change a teacher's life.",
 t=[('00:00-00:04',"Calm: heat haze shimmers above the asphalt, the radio's small red light blinks."),
    ('00:04-00:05',"The police radio crackles and its light flashes; at the same moment the upstairs window of the two-story house bursts open and a bundle of clothes — jeans, a shirt and a pair of sneakers — is thrown out and tumbles down the sloping roof onto the lawn. SFX: a burst of radio static."),
    ('00:05-00:08',"The clothes lie on the lawn below the open window, its curtain flutters; heat haze shimmers above the asphalt.")])
add(grp='Во все тяжкие',kind='scene',sid='breaking-bad-gus',file='бб гас',where='breaking-bad-gus/bg.mp4',
 title='Сцена «Уолт приходит к Гасу» (S02E11)',
 ru='Зал «Лос Поллос» из клипа: синие стены снизу и белые сверху, красные кабинки, светлые деревянные столы и стулья, белая плитка с синими ромбами, вентиляторы, красные лампы низко над столами. На ближнем столе — диетическая кола с трубочкой (её Уолт и заказал) и нетронутая курица.',
 ev='Закрытие: ряды ламп на потолке с тяжёлым щелчком гаснут один за другим — от дальней стены к камере, пока не остаётся одна красная лампа над столом. Днём Гас — хозяин закусочной, в темноте — наркобарон.',
 why='Было: ночь и фары с парковки — а сцена днём, при полном свете. Стало: зал как в кадре, и свет гаснет сам — после закрытия здесь говорят о деле.',
 loop='тьма',shake=False,
 set="an empty fast-food fried chicken restaurant in Albuquerque at closing time, nobody inside.",
 cam="eye level, 28mm lens, the nearest table in the center.",
 obj="walls painted blue on the lower half and white above, red vinyl booths, light wooden tables and chairs, white floor tiles with small blue diamond inlays, ceiling fans and red pendant lamps hanging low over the tables; on the nearest table, a red plastic tray with a paper cup of diet cola with a straw and an untouched basket of fried chicken. No logos and no signs.",
 light="bright flat fluorescent ceiling panels and the warm red pendant lamps.",
 grade="flat bright fluorescent turning into red darkness; too clean, too polite, quietly menacing.",
 t=[('00:00-00:04',"Calm: the ceiling fans turn slowly, condensation drops slide down the cold cup."),
    ('00:04-00:06',"Closing time: the rows of fluorescent ceiling panels switch off one after another with heavy clunks, from the back of the room toward the camera, until only the red pendant lamp above the nearest table is still lit. SFX: a row of heavy electrical clunks."),
    ('00:06-00:08',"The restaurant is dark; the red lamp glows over the cup and the chicken; the fans keep turning slowly in the darkness.")])
add(grp='Во все тяжкие',kind='scene',sid='breaking-bad-knocks',file='бб подпол',where='breaking-bad-knocks/bg.mp4',
 title='Сцена «Я тот, кто стучит» и «Где деньги?» (S04E06 · S04E11)',
 ru='Подпол под домом Уайтов («Где деньги?»), вид сверху в открытый люк: земля между балками, розовый утеплитель, рваная прозрачная плёнка и пустые чёрные мешки — там лежала гора денег; осталось две пачки в плёнке. Одна голая лампочка на шнуре.',
 ev='Лампочка вспыхивает слишком ярко и лопается — подпол проваливается в темноту, остаётся серый свет из люка. Срыв Уолта (его безумный смех — только звуком).',
 why='Подпол оставил, но уточнил по кадру: плёнка и мешки, где лежали деньги, — без них было непонятно, что это за яма. Событие — срыв: лампочка лопается.',
 loop='тьма',shake=False,
 set="a crawl space under a suburban Albuquerque house at night.",
 cam="looking straight down through an open square floor hatch, 24mm lens.",
 obj="a dirt floor between wooden floor joists and pink insulation, lined with torn clear plastic sheeting and a few empty black plastic bags — where a huge pile of money used to be; only two small bundles of real cash in clear plastic wrap are left in the dirt; one bare light bulb hanging on a cord.",
 light="only the bare bulb, deep black around.",
 grade="harsh yellow and deep black; the money is gone — despair turning into mad laughter.",
 t=[('00:00-00:04',"Calm: the bare bulb sways slowly on its cord, the shadows of the joists swing across the dirt, dust floats in the light."),
    ('00:04-00:05',"The bulb flares too bright and bursts with a small flash and a puff of glass dust; the crawl space drops into darkness, lit only by a faint grey light from the open hatch. SFX: a sharp pop and an echo of hysterical laughter."),
    ('00:05-00:08',"Darkness; the empty socket swings on its cord, dust drifts in the faint grey light, the torn plastic barely visible.")])
add(grp='Во все тяжкие',kind='scene',sid='bb-knocks-de',file='бб спальня',where='bb-knocks-de/bg.mp4',
 title='DE «Ich bin die Gefahr» (S04E06)',
 ru='Спальня Уайтов из клипа (весь разговор — тут): закрытая белая дверь, деревянный комод с фоторамкой, тумбочка с лампой и белой кружкой, сбоку кровать с изголовьем из светлой сосны и подушками в цветочек, бежевые обои, окно с тюлем.',
 ev='Три тяжёлых удара в закрытую дверь спальни: дверь вздрагивает в раме, кофе в кружке идёт кругами, лампа мигает, фоторамка на комоде падает лицом вниз. «Я тот, кто стучит».',
 why='Было: прихожая с входной дверью — в сцене её нет, весь разговор в спальне. Стало: спальня из кадра; рамка повёрнута боком — лиц нет, а падение «лицом вниз» читается. Файл переименовал: «бб спальня».',
 loop='тьма',shake=False,
 set="a suburban Albuquerque bedroom at night, empty.",
 cam="eye level from a corner of the room, 35mm lens, the closed bedroom door in the center.",
 obj="a closed white bedroom door with a brass knob; beside it a wooden chest of drawers with a small standing picture frame turned away from the camera; a bedside table with a lamp with a pleated shade and a white coffee mug; at the side, a bed with a light pine headboard and floral pillows; beige patterned wallpaper; a window with sheer curtains.",
 light="the warm bedside lamp, everything else in shadow.",
 grade="warm beige turning into black and sickly yellow — \"I am the one who knocks\".",
 t=[('00:00-00:04',"Calm: the lamp glows steadily, the sheer curtain moves slightly, a thin wisp of steam rises from the mug."),
    ('00:04-00:06',"Three heavy knocks hit the bedroom door: with each blow the door shudders in its frame, the coffee in the mug ripples, the lamp flickers, and on the last knock the picture frame falls flat on its face. SFX: three loud, slow knocks."),
    ('00:06-00:08',"Silence; the frame lies face down on the dresser, the lamp glows steadily again.")])
add(grp='Во все тяжкие',kind='scene',sid='bb-mike-de',file='бб майк',where='bb-mike-de/bg.mp4',
 title='DE «Майк и ноутбук Гаса» (S05E01)',
 ru='Жёлтая степь в пыльном мареве (как в клипе): на переднем плане — пыльный белый капот машины Уолта, на нём закрытый ноутбук Гаса, связка ключей и револьвер Майка; сзади на грунтовке — тёмно-серый седан Майка с открытой дверью.',
 ev='Невидимый гигантский магнит: ключи, револьвер и ноутбук рывком едут по капоту и прилипают к краю, седан сзади качается, его дверь захлопывается. Через полсерии ноутбук так и уничтожат («Yeah, bitch! Magnets!» — факт эпизода 4).',
 why='Было: машина Майка и ноутбук в пыли — не по кадру. Стало: как в клипе — белый капот на переднем плане, седан Майка сзади, жёлтая степь. Событие — главная пасхалка серии: магнит.',
 loop='тьма',shake=False,
 set="the flat empty New Mexico grassland under a hazy yellow sky at midday, nobody around.",
 cam="low angle just above the hood of a white car, 28mm lens, looking across it; the objects on the hood in the center.",
 obj="in the foreground, the dusty white hood of a 1990s car; on it, a closed black laptop, a ring of car keys and a black revolver at its real size; behind, on a dirt track, a dark grey 1990s sedan with its driver's door open; endless dry yellow grass to the flat horizon, distant blue hills in haze.",
 light="harsh yellow sun through a dusty haze.",
 grade="dusty yellow and black — an old fixer done with these amateurs, and evidence that can sink them all.",
 t=[('00:00-00:04',"Calm: the dry grass sways in the hot wind, heat haze shimmers above the track, thin dust blows low across the ground."),
    ('00:04-00:05',"A huge invisible magnetic pull from the right: the keys, the revolver and the laptop jerk and slide across the hood and slam against its edge; behind, the grey sedan rocks on its wheels and its open door swings shut with a slam. SFX: a deep electric hum and a metal clang."),
    ('00:05-00:08',"Everything stops; the objects lie pressed to the edge of the hood, the dust settles in the heat haze.")])

# ============================== ПАВЕЛ ДУРОВ ==============================
add(grp='Павел Дуров',kind='main',file='дуров главный',where='durov-tucker/film-bg.mp4',
 title='ГЛАВНЫЙ «Павел Дуров» — сам человек',
 ru='Окно над Невским в белую ночь (как в твоём ролике): на подоконнике ряд самолётиков из оранжевых купюр носами в окно, белый самолётик — в центре и чуть впереди, сбоку тюль. Внизу — проспект и колоннада Казанского собора.',
 ev='Порыв ветра — тюль взлетает, и самолётики один за другим срываются с подоконника и улетают в бледное небо, белый (как логотип Telegram) — первым. 2012-й: Дуров запускал из окна офиса «ВКонтакте» самолётики из пятитысячных.',
 why='Кадр тот же — он у тебя вышел. Убрал футболку с подоконника (лишнее). Событие — сам случай 2012 года: самолётики улетают.',
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
 ru='Студия интервью из клипа (Дубай): стена из тёмных реек, мраморные полки с белым бюстом и белыми фигурками, большое растение, два чёрных кресла, между ними столик с двумя стаканами воды и белым бумажным самолётиком (Telegram), за креслами — окно с закрытыми светлыми жалюзи.',
 ev='Жалюзи сами поднимаются — комнату заливает слепящее солнце, за окном в мареве Дубай с иглой самой высокой башни мира. «Штаб-квартира — в Дубае, где мы сейчас и находимся».',
 why='Было: включаются студийные прожекторы — а интервью снято при дневном свете. Стало: студия из кадра и событие из реплики про Дубай. Самолётик на столе — тихая пасхалка Telegram.',
 loop='тьма',shake=False,
 set="an elegant interview room in a high-rise in Dubai on a bright day, empty — two chairs ready for a big conversation.",
 cam="wide symmetrical shot, 35mm lens; the two chairs and the window in the center.",
 obj="two black armchairs facing each other with a small round black table between them holding two glasses of water and a single folded white paper airplane; on one side, a wall of vertical dark wooden slats; on the other, dark marble shelves with a small white classical bust and a few white sculptural objects; a large green plant; behind the chairs, a big window covered with closed light-wooden blinds.",
 light="soft dim daylight glowing through the closed blinds.",
 grade="dark wood, black and white marble, then blinding desert sunlight; a calm, careful man who talks about freedom.",
 t=[('00:00-00:04',"Calm: soft light glows through the closed blinds, light ripples faintly in the water glasses, the plant's leaves barely move."),
    ('00:04-00:06',"The wooden blinds roll up by themselves in one smooth motion: blinding sunlight floods the room, and the Dubai skyline appears in the heat haze with the needle of the world's tallest skyscraper. SFX: a soft motor whir and a rush of air."),
    ('00:06-00:08',"The room is full of warm sunlight, long shadows of the chairs lie on the carpet, the paper airplane glows white on the table.")])

# ============================== CLAVICULAR ==============================
add(grp='Clavicular',kind='main',file='клав главный',where='clavicular-impaulsive/film-bg.mp4',
 title='ГЛАВНЫЙ «Clavicular» — сам человек (лукмаксинг)',
 ru='Станция лукмаксинга в Майами (как в твоём ролике): зеркало с лампами по кругу, на мраморе — дерма-роллер, тейп для рта, тренажёр для челюсти, баночки без этикеток, телефон на штативе с кольцевой лампой; на крючке — чёрное поло с очками; в окне — неон Майами.',
 ev='Он выходит в эфир: лампы вокруг зеркала включаются по кругу одна за другой, вспыхивает кольцевая лампа, экран телефона загорается — по нему бегут зелёные сообщения и сердечки.',
 why='Кадр тот же — он у тебя вышел. Событие — главное про него: эфир (он стример с Kick), всё включается разом.',
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
 ru='Студия Impaulsive из клипа: кремовые диваны, стена из старых досок, большой квадратный столик из ореха с рядом цветных бутылок без этикеток (голубые, оранжевые, розовые, фиолетовые), чёрные микрофоны на штангах и наушники; на столике — телефон экраном вверх. Ринга нет (модель строила целый ринг).',
 ev='Телефон загорается и жужжит, ползёт по столу, экран заваливают зелёные сообщения — «зелёные сообщения» с Samsung, над которыми ржут в этом эпизоде. Потом гаснет.',
 why='Студию уточнил по клипу: ореховый столик и ряд разноцветных бутылок — главное, что видно в кадре. Событие оставил — оно из эпизода «Зелёные сообщения». Петля сама.',
 loop='сама',shake=False,
 set="a big podcast studio right after recording, empty.",
 cam="wide shot from a high corner, 24mm lens, the coffee table in the center.",
 obj="two large cream-colored couches at an angle; in front of them a big square low walnut coffee table with a row of plain unlabeled plastic bottles of brightly colored sports drinks — ice blue, orange, pink and purple — and a smartphone lying face up with a dark screen; behind, a wall of warm reclaimed wooden planks; black podcast microphones on boom arms and black headphones in front of the couches. No boxing ring, no ropes, no logos, no text.",
 light="warm studio lights.",
 grade="warm wood and cream; loud, confident, a little bit show-off.",
 t=[('00:00-00:04',"Calm: condensation drops slide down the cold bottles; the phone lies dark."),
    ('00:04-00:05',"The phone lights up and buzzes, vibrating across the table, and its screen fills with a flood of green message bubbles. SFX: rapid buzzing."),
    ('00:05-00:08',"The green bubbles keep stacking up on the screen for a moment, then the phone goes dark again and lies still, exactly as at the start.")])
add(grp='Clavicular',kind='scene',sid='clavicular-18',file='клав клуб',where='clavicular-18/bg.mp4',
 title='Сцена «Clavicular · 18+»',
 ru='VIP-ложа клуба в Майами в 4 утра (ты выбрал клуб): чёрный бархатный диван, шампанское во льду, бокалы, телефон с зелёным чатом, конфетти, розовый и красный неон, диско-шар, лёгкая дымка.',
 ev='Закрытие: над ложей с громким щелчком врубается яркий белый «дежурный» свет — неон гаснет, музыка обрывается, видно лужи шампанского, конфетти и пустые бокалы. Кайф проходит — «but it\'s fleeting» (эпизод 4).',
 why='Клуб оставил — ты его выбрал. Событие новое: было — пробка вылетает (просто вечеринка), стало — белый свет закрытия, это и есть тема эпизодов про дофамин. Таблетки и «секс» из текста промта убрал — меньше шанс, что Veo откажет.',
 loop='тьма',shake=False,
 set="a VIP booth of a Miami nightclub at 4 a.m. at closing time, empty.",
 cam="eye level from the low table, 28mm lens, the booth in the center.",
 obj="a curved black velvet booth; on the low black table in front of it, a silver ice bucket with a dark unlabeled champagne bottle, two half-empty champagne glasses, a smartphone lying face up with its screen glowing neon green with chat bubbles and no letters, scattered confetti and a small spill of champagne; behind the booth, a dark wall with thin pink and red neon light strips with no words, and a mirrored disco ball hanging from the ceiling; light haze in the air.",
 light="pink and red neon, the green phone glow and slow light spots from the disco ball.",
 grade="hot pink and red in darkness, then harsh flat white; after-party talk about dopamine, money and pleasure that never lasts.",
 t=[('00:00-00:04',"Calm: the disco ball turns slowly and its light spots glide across the walls, a thin haze drifts."),
    ('00:04-00:05',"Closing time: harsh white house lights slam on overhead with a loud clunk, killing the neon mood — the booth, the table and the floor are suddenly flat and bright, showing the spilled champagne, the confetti and the empty glasses; the disco ball stops turning. SFX: a heavy electrical clunk, the music cuts out."),
    ('00:05-00:08',"Everything stays in the harsh white light; a little haze still hangs in the air.")])
add(grp='Clavicular',kind='scene',sid='clavicular-burger',file='клав бургер',where='clavicular-burger/bg.mp4',
 title='Сцена «Clavicular · Бургер без сыра»',
 ru='Бургер на бумаге посреди того самого орехового столика студии Impaulsive: булка, котлета, сыр, булка; кетчуп в бумажном стаканчике, пакет из фастфуда без логотипа, стакан с трубочкой. Сзади размыто — ряд цветных бутылок и кремовый диван.',
 ev='Сыр сам выскальзывает из бургера и шлёпается рядом: «булка, котлета, булка — и всё». С его лекарством сыр нельзя (факт эпизода 1).',
 why='Стол — тот самый ореховый из студии, сзади бутылки и диван, как в клипе. Событие оставил — лучше пасхалки для «Бургера без сыра» нет.',
 loop='тьма',shake=False,
 set="the low walnut coffee table of a podcast studio right after recording, empty.",
 cam="close-up at table height, 50mm lens, shallow focus, the burger in the center.",
 obj="a plain hamburger on an open paper wrapper — bun, beef patty, one slice of yellow cheese and bun, nothing else; a small paper cup of ketchup; a plain paper fast-food bag with no logo and a paper cup with a straw. Behind, out of focus: a row of brightly colored unlabeled sports drink bottles, cream couches and black podcast microphones.",
 light="warm studio lights.",
 grade="warm brown, ketchup red and cream; a looksmaxxer who refuses cheese — bun, patty, bun, that's it.",
 t=[('00:00-00:04',"Calm: thin steam rises from the hot patty, a drop of condensation slides down the paper cup."),
    ('00:04-00:05',"The slice of yellow cheese slides out from between the patty and the bun, as if pushed away, and flops flat onto the table beside the burger. SFX: a soft slap."),
    ('00:05-00:08',"The cheese lies apart on the table; the burger — bun, patty, bun — keeps steaming.")])
add(grp='Clavicular',kind='scene',sid='clavicular-bets',file='клав ставки',where='clavicular-bets/bg.mp4',
 title='Сцена «Clavicular · Ставки»',
 ru='Ставки на Клава: ноутбук на ореховом столике студии с графиком, как на Polymarket в клипе (линия без цифр), рядом судейский молоток («сядет ли») и стопка красных и зелёных фишек; сзади размыто — диваны и микрофоны.',
 ev='Линия на графике взлетает вертикально в самый верх, экран вспыхивает зелёным, стопка фишек валится и фишки раскатываются по столу. «Это же больше 90?» — «Это самый высокий» (эпизод 2).',
 why='Было: график обваливается. Стало: взлетает — так и в эпизоде 2 («Самый сексуальный»: «это самый высокий процент»). Падающие фишки оставил — это и есть «ставки».',
 loop='тьма',shake=False,
 set="the low walnut coffee table of a podcast studio late at night, empty.",
 cam="eye level from the table edge, 35mm lens, the laptop in the center.",
 obj="an open laptop whose screen shows one glowing line chart with no numbers and no text; next to it a small wooden judge's gavel lying on its side; a tall stack of red and green poker chips. Behind, out of focus: cream couches and black podcast microphones.",
 light="the cool glow of the laptop screen and dim warm studio lights.",
 grade="market green and red in a dark studio; the internet betting on one guy's life — prison or not, \"no comment\".",
 t=[('00:00-00:04',"Calm: the line on the chart wiggles slightly, a soft glint slides across the poker chips."),
    ('00:04-00:05',"The line on the laptop shoots straight up to the very top of the chart and the screen flashes bright green; the tall stack of poker chips topples and the chips roll across the table. SFX: a rising whoosh and chips clattering."),
    ('00:05-00:08',"The chips lie scattered on the table; the green line stays at the top of the chart, glowing.")])

HEAD_RU=[
'ФОНЫ С СОБЫТИЕМ — ВСЕ 37 · ВЕРСИЯ 2',
'',
'Все 37 переписаны заново по реальным кадрам сцен: пересмотрел каждый клип и фоны, что уже стоят. В каждом блоке — «Что поменял и почему».',
'Идея та же: 4 секунды спокойно → на 4-й секунде одно резкое событие из сюжета → после.',
'Переименованы два файла: «сопрано мотель» → «сопрано хасиды», «бб дверь» → «бб спальня» (поменялось место).',
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
              f"Что поменял: {e['why']}",
              f"Петля: {LOOP_RU[e['loop']]}.",
              '',p,'','']
        J.append({'n':n,'grp':g,'kind':e['kind'],'title':e['title'],'file':e['file']+'.mp4','where':e['where'],'ru':e['ru'],'ev':e['ev'],'why':e['why'],'loop':e['loop'],'loopRu':LOOP_RU[e['loop']],'seam':LOOP_SEAM[e['loop']],'prompt':p})
    return out,J

if __name__=='__main__':
    out,J=build()
    open('фоны-промты-СОБЫТИЕ.txt','w',encoding='utf-8').write('\n'.join(out))
    json.dump({'head':HEAD_RU,'items':J},open('фоны-промты-СОБЫТИЕ.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
    m=sum(1 for e in EV if e['kind']=='main');print(f'фонов: {len(EV)} (главных {m}, сцен {len(EV)-m}); петля сама: {sum(1 for e in EV if e["loop"]=="сама")}')
