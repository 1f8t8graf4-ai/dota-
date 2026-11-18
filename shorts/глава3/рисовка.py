# Рисовка главы 3 (текст 3 «Три жизни одной марки») для Gemini: что на экране на каждой фразе,
# на каком слове, номер приёма Боба (ролик и секунда из pult/pult130/bob195.json).
#   python3 shorts/глава3/рисовка.py  →  shorts/глава3/рисовка-18.11.html и .md
# Тайминг черновой: 2,4 слова в секунду (data.WPS). После записи голоса события ставим на слова через Wd().
import html, json, re, math, importlib.util, pathlib

HERE = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('d', HERE / 'data.py')
d = importlib.util.module_from_spec(spec); spec.loader.exec_module(d)
E = lambda s: html.escape(s, quote=True)
WPS = d.WPS
T3 = next(t for t in d.TEXTS if t['id'] == 't3')
BOB = {int(x['id']): x for x in json.load(open(HERE.parent / 'pult' / 'pult130' / 'bob195.json'))}
VID = {'cola': 'Coca-Cola', 'starbucks': 'Starbucks', 'santa': 'Сатана Клаус', 'google': 'Google', 'apple': 'Apple',
       'insta': 'Instagram', 'davinci': 'Да Винчи', 'wot': 'World of Tanks', 'mdk': 'MDK', 'tinder': 'Tinder',
       'madonna': 'Мадонна', 'sobolev': 'Соболев', 'hovan': 'Хованский'}
WRE = r"[А-Яа-яЁёA-Za-z0-9-]+"
norm = lambda w: w.lower().replace('ё', 'е')

# Крючок шортса — последняя фраза «Льда» без «Ведь» (уже записана: tl/v191y-ru.json, 87,40–93,64 с)
HOOK = 'Главный символ мужской брутальности век назад выводили на рынок... как нежные сигареты для леди.'
HOOK_AT = {'главный': 0.0, 'брутальности': 1.28, 'рынок': 3.36, 'леди': 5.52}
HOOK_LEN = 6.5          # 6,24 с голоса + пауза

LIVES = {  # куски главы на ленте времени
    'cow': 'Слава ковбоя', 'lady': 'Первая жизнь · дамская', 'fear': 'Страх',
    'second': 'Вторая жизнь · ковбой', 'price': 'Цена', 'money': 'Миллиарды', 'third': 'Третья жизнь · без огня',
}

FRAME0 = [
    'Щит у трассы на закате: всадник-ковбой силуэтом и красно-белая пачка «МАЛЬБОРО».',
    'Плоское солнце за щитом, пустыня в 3 тона, от щита на песок — растровая тень под 35°.',
    'Щит — от Y 260 до Y 1150, горизонт — Y 1350; всё важное выше Y 1480, субтитры — Y ≈ 1720.',
    'Ветер шевелит правый нижний угол плаката: под ним уже виден розовый край.',
    'Почему так: это то, что все знают про «Мальборо», — слава ковбоя. Через 3 секунды плакат рвётся, '
    'а под ним дамская реклама: поворот главы виден с первого кадра.',
    'Картинку 1924 из мостика «Льда» (белая сигарета с красным кончиком на синем ар-деко) не берём.',
    'Фильм: камера ныряет в этот щит из карточки 1924 на доске; мостик «Льда» потом переделаем под этот кадр. '
    'Шортс: это кадр 0, в конце ролик возвращается в него.',
]

# Кадры. shots: (слово-якорь или None, что на экране). fx: (номер приёма, как у нас).
BEATS = [
 dict(i=0, only='short', life='cow', plate='нет',
  big=['— (на щите: «МАЛЬБОРО»)'],
  shots=[('Главный', 'кадр 0: щит у трассы на закате, камера медленно наезжает.'),
         ('брутальности', 'порыв ветра, по песку катится перекати-поле, угол плаката дрожит.'),
         ('леди', 'правый нижний угол отгибается: под ковбоем — розовый слой с тонкими золотыми линиями.')],
  fx=[(88, 'отгибается угол плаката на щите')],
  snd='ветер, хлопок бумаги'),
 dict(i=1, life='cow', plate='нет (как в кадре 0 «Льда»)',
  big=['— (на щите: «МАЛЬБОРО»)'],
  shots=[(None, 'Фильм: камера ныряет в щит из карточки 1924 на доске. Шортс: продолжаем после крючка.'),
         ('Мальборо', 'камера проезжает по щиту: пачка крупно, «МАЛЬБОРО» читается.'),
         ('до', 'ветер рвёт плакат с угла, он отгибается по диагонали.'),
         ('жизнь', 'под ковбоем — старая дамская реклама 1920-х; камера ныряет в неё, как в дыру в бумаге во «Льде».')],
  fx=[(88, 'плакат на щите отгибается, как страница; под ним — свой мир (дыра в бумаге, как во «Льде»)')],
  snd='ветер, рвётся бумага'),
 dict(i=2, life='lady', plate='1924 — появляется на «Первые»',
  big=['МЯГКИЕ, КАК МАЙ (надпись на рекламе)'],
  shots=[('Первые', 'мир журнала: розовый и слоновая кость, тонкие золотые линии ар-деко, силуэт дамы в шляпке-колоколе.'),
         ('мягкие', 'на странице проявляется слоган «МЯГКИЕ, КАК МАЙ».'),
         ('журналах', 'страница — обложка журнала; журналы разлетаются веером, камера едет вдоль них.'),
         ('кончик', 'снизу поднимается тюбик помады: красный столбик выкручивается и скругляется в кончик сигареты.'),
         ('помады', 'красный след помады ложится на красный кончик — и пропадает в нём.')],
  fx=[(65, 'журналы разлетаются веером'), (48, 'помада скругляется в кончик сигареты')],
  snd='шелест страниц, щелчок тюбика'),
 dict(i=3, life='lady', plate='1924 → 1954, барабаном на «пятьдесят»',
  big=['0,25 % РЫНКА'],
  shots=[('пятьдесят', 'плашка крутится барабаном: 1924 → 1954.'),
         ('горстка', 'камера отъезжает от кончика: сигарета лежит на огромном белом круге — рынке сигарет США; у её края — 5 маленьких фигурок-женщин.'),
         ('процента', 'круг делится на серые доли других марок без названий; доля «Мальборо» — тонкий красный волосок, это сама сигарета.'),
         ('умерла', 'огонёк на кончике тускнеет, вверх вьётся тонкая струйка дыма.')],
  fx=[(120, 'круг рынка, наша доля — волосок 0,25 %')],
  snd='тиканье, огонёк гаснет'),
 dict(i=4, life='fear', plate='1954 (не меняется)',
  big=['КУРЯТ МЕНЬШЕ ↓'],
  shots=[('Спас', 'струйка дыма загибается и становится хвостом белой мыши; камера идёт по хвосту в лабораторию, холодный бирюзовый.'),
         ('намазали', 'пять мышей на лотке, на спинах — бритые квадратики; кисть в лабораторном держателе (без рук) мажет чёрную смолу.'),
         ('опухоли', 'на квадратиках набухают тёмные бугорки — просто, без крови; вокруг плавают шестигранники молекул.'),
         ('Америка', 'мазок кисти тянется через весь кадр и становится осью графика; кружки на оси (торцы сигарет) подпрыгивают и вытягивают столбики продаж.'),
         ('меньше', 'столбики растут год за годом, последний впервые проседает — красная стрелка вниз.')],
  fx=[(9, 'струйка дыма становится хвостом мыши'), (116, 'шестигранники молекул смолы'), (109, 'кружки на оси вырастают в столбики продаж')],
  snd='тихий писк, скрип кисти, «тук» столбиков',
  det='Опыт 1953 года: смолу из сигарет наносили на спины мышей три раза в неделю, у части мышей вырос рак кожи (Cancer Research, 1953).'),
 dict(i=5, life='fear', plate='1954',
  big=['ДЛЯ НЕЖЕНОК'],
  shots=[('бросились', 'столбики становятся пачками на полке магазина; к полке бежит толпа белых фигурок.'),
         ('фильтром', 'у сигарет на полке — белые фильтры; с краю стоит одна старая светлая пачка «Мальборо», к ней никто не идёт.'),
         ('мужчины', 'фигурки-мужчины (широкие плечи) тормозят и отворачиваются от фильтров.'),
         ('неженок', 'фильтр одной сигареты распушается в розовую пуховку для пудры.')],
  fx=[(103, 'толпа одинаковых белых фигурок')],
  snd='топот толпы, «пуф» пуховки'),
 dict(i=6, life='second', plate='1954',
  big=['ЛЕО БЁРНЕТТ (плашка с именем)'],
  shots=[('Филип', 'пуховка сдувается обратно в фильтр; на старую светлую пачку сверху падает подарочная коробка с красной лентой, бирка «ФИЛИП МОРРИС».'),
         ('фильтр', 'лента развязывается, из коробки выпрыгивает сигарета с фильтром.'),
         ('жёсткую', 'стенки коробки твердеют: это новая жёсткая пачка, по верху ложится красная «крыша» марки.'),
         ('щелчком', 'крышка откидывается со щелчком; фигурки-мужчины оборачиваются и смотрят.'),
         ('чикагского', 'сигареты в открытой пачке поднимаются на разную высоту — это небоскрёбы ночного Чикаго.'),
         ('Бёрнетта', 'рядом с Луной выезжает дом с косым разрезом: в светлом окне стол, ваза красных яблок, стакан толстых чёрных карандашей. Плашка «ЛЕО БЁРНЕТТ · РЕКЛАМЩИК, ЧИКАГО».')],
  fx=[(77, 'крышка, только наоборот: пачка открывается со щелчком'), (76, 'офис Бёрнетта в разрезе небоскрёба')],
  snd='шорох ленты, «щёлк», гул ночного города',
  det='Ваза красных яблок стоит в приёмной агентства Бёрнетта с открытия в 1935 году; толстые чёрные карандаши — его фирменные.'),
 dict(i=7, life='second', plate='1954',
  big=['СИМВОЛ МУЖЧИНЫ'],
  shots=[('ставит', 'толстый чёрный карандаш сам рисует на белом листе: шляпа, конь, всадник.'),
         ('словам', 'набросок заливается цветом — 3 тона, растровая тень.'),
         ('символ', 'камера отъезжает ступенями: лист → плакат → щит у трассы. Это щит из кадра 0 — круг замкнулся.')],
  fx=[(91, 'карандаш сам рисует ковбоя'), (41, 'лист отъездом в 3 шага становится щитом')],
  snd='скрип карандаша, ветер пустыни'),
 dict(i=8, life='second', plate='1954 → 1972 на «семьдесят»',
  big=['№ 4 В США', '№ 1 В МИРЕ'],
  shots=[('Через', 'камера летит вдоль трассы: щит за щитом, черты скорости.'),
         ('четвёртая', 'камера поднимается: сверху щиты стоят как столбики графика — серые (другие марки) и наш красный; он вырастает до 4-го места.'),
         ('семьдесят', 'плашка: 1954 → 1972. Красный столбик растёт за верх кадра, камера летит за ним в ночное небо.'),
         ('мире', 'камера вылетает в космос: столбик становится лучом над Землёй — он обходит её, как радар, и зажигает красные пачки на материках.')],
  fx=[(109, 'щиты-столбики, наш растёт до 4-го места'), (39, 'луч обходит Землю и зажигает пачки')],
  snd='проезд машин, «пиу» радара'),
 dict(i=9, life='price', plate='1972',
  big=['ПО-НАСТОЯЩЕМУ'],
  shots=[('Вот', 'камера спускается с ночной стороны Земли к одному щиту ночью, его освещает лампа.'),
         ('курили', 'нарисованная сигарета у ковбоя на плакате (мелко, силуэтом) начинает дымить: огонёк с плаката становится живым.'),
         ('по-настоящему', 'дым выходит из плаката и тает в ночном небе.')],
  fx=[(92, 'нарисованный огонёк становится настоящим'), (141, 'дым тает в ночном небе')],
  snd='музыка тише, но не пропадает; треск огонька'),
 dict(i=10, life='price', plate='1972 → 1990 на «девяностом» → 1992 на «умер»',
  big=['1,5 ПАЧКИ', '51'],
  shots=[('Уэйн', 'плашка «УЭЙН МАКЛАРЕН · КОВБОЙ С РЕКЛАМЫ».'),
         ('полторы', 'на столбе щита — отрывной календарь: листки слетают, за каждый день падают пачка и половинка пачки, стопка растёт.'),
         ('девяностом', 'плашка: 1972 → 1990. По ковбою на щите едет светлая планка рентгена: за ней лёгкие контуром и тёмное пятно.'),
         ('рекламе', 'щит делится на трёхгранные планки, они поворачиваются: реклама против курения — ковбойская шляпа на больничной койке.'),
         ('умер', 'плашка: 1990 → 1992. Рамка щита сжимается и становится надгробием под Луной, шляпа висит на камне.')],
  fx=[(189, 'листки календаря — дни'), (37, 'рентген по силуэту ковбоя'), (105, 'планки щита поворачиваются'), (65, 'рамка щита становится надгробием')],
  snd='шелест календаря, гул рентгена, стук планок'),
 dict(i=11, life='price', plate='уходит (дальше нельзя назад во времени)',
  big=['КАК МИНИМУМ 4'],
  shots=[('Всего', 'камера отъезжает вдоль ночной дороги: столбы забора.'),
         ('четверо', 'на четырёх столбах по очереди появляются шляпы — раз, два, три, четыре.'),
         ('Мальборо', 'ветер несёт пыль косыми штрихами, камера медленно едет дальше.')],
  fx=[(163, 'косые штрихи пыли')],
  snd='ветер, глухой стук шляп'),
 dict(i=12, only='film', life='money', plate='нет: сделка — 2018–2022, а дальше 2014',
  big=['$12,8 МЛРД', '$0,45 МЛРД'],
  shots=[('Помните', 'проволока забора краснеет — это красная нить; камера отъезжает из карточки 1924 на доску, нить ведёт к карточке «1979 · СОЛЬ» из главы 1.'),
         ('миллиардов', 'на карточке оживает картинка из главы 1: круг «Джула», красная доля 35 % и «$12,8 МЛРД».'),
         ('Почти', 'под кругом барабанный счётчик крутится вниз: 12,8 → 0,45 млрд; красная доля бледнеет.'),
         ('спокойно', 'из карточки 1924 выезжает пачка «Мальборо» и спокойно покачивается на доске.'),
         ('кормит', 'крышка пачки откидывается тем же щелчком, что в 1954-м, как ящик кассы; из неё волной ползёт бесконечный чек.')],
  fx=[(126, 'проволока становится нитью доски'), (89, 'счётчик 12,8 → 0,45'), (12, 'пачка как касса с чеком'), (138, 'чек ложится волной')],
  snd='треск барабанов, «дзынь» кассы',
  det='12,8 млрд $ за 35 % «Джула» — декабрь 2018. На 30 июня 2022 доля стоила 450 млн $ (отчёт Altria за 2-й квартал 2022).'),
 dict(i=13, life='third', plate='2014',
  big=['БЕЗ ОГНЯ'],
  shots=[('когда', 'плашка: 2014. Фильм: лента чека закручивается в серую ленту дыма, камера ныряет за ней обратно в карточку 1924. Шортс: ветер с забора несёт пыль, она становится дымом.'),
         ('испугались', 'те же белые фигурки из 1954-го пятятся от дыма.'),
         ('третья', 'огонь на кончике сигареты сжимается в маленький квадрат — это пластинка нагревателя.'),
         ('табак', 'разрез тонкими светлыми линиями поверх настоящей вещи: стик в белом держателе.'),
         ('нагреватель', 'пластинка внутри табака светится оранжевым, вверх идут волны тепла вместо дыма.')],
  fx=[(141, 'лента становится дымом'), (114, 'огонь сжимается в нагреватель'), (67, 'чертёж поверх настоящего держателя')],
  snd='шипение, тихий гул нагрева'),
 dict(i=14, life='third', plate='2014',
  big=['— (на пачках: «МАЛЬБОРО»)'],
  shots=[('стики', 'стик выезжает из держателя, камера отъезжает: пачка стиков, на ней — «МАЛЬБОРО».'),
         ('назывались', 'ещё отъезд: витрина за стеклом, на полке три пачки — дамская 1920-х, ковбойская 1950-х, стики 2014. В стекле отражаются четыре шляпы с забора.'),
         ('Мальборо', 'в паузе перед словом камера доезжает до витрины; на «Мальборо» имена на трёх пачках загораются по очереди, потом вместе.')],
  fx=[(151, 'витрина за стеклом')],
  snd='«дзынь» на каждое имя'),
]

END_FILM = [
    'Витрина сжимается в карточку 1924 на доске; от неё красная нить бежит к закрытой карточке «2014 · НАГРЕВАТЕЛИ» — под маркером виден только год.',
    'Мостик в главу «Айкос» доделаем, когда будет глава 4: переход — когда готовы обе главы.',
    '«Части N» в фильме нет.',
]
END_SHORT = [
    'Фразы 12 (про миллиарды за «Джул») нет: от забора со шляпами — сразу к дыму.',
    'После «Мальборо» — вопрос надписью: «Без огня — значит, без вреда?» (голосом — если допишем строку в запись), и «Часть 4 →».',
    'Последний кадр = кадр 0: камера ныряет в среднюю пачку, её рисунок становится щитом у трассы — петля.',
]
RULES = [
    'Стиль — ролики «Знакомьтесь, Боб» (14 штук). Номера приёмов — из пульта Боба, 195 приёмов.',
    'Ровный фон, 3 тона на предмет, растровая тень под 35°, тонкие светлые линии, косые разрезы фона, черты скорости.',
    'Без толстой чёрной обводки, градиентов, свечения, виньетки, зерна.',
    'Без лиц крупно, без рук, без крови, без предметов во рту. Люди — силуэтами или белыми фигурками.',
    'Один мир и камера: камера не стоит; переход — предмет становится другим или камера ныряет внутрь.',
    'Без растворения картинки в картинке, шторок на весь экран, чёрных и белых вспышек, пауз дольше 1 с и пустых фонов.',
    'Кадр 9:16 (1080×1920): важное выше Y ≈ 1480, субтитры — Y ≈ 1720.',
    'Плашка года — слева сверху, годы только вперёд.',
    'Крупные надписи — по-русски, 1–3 слова; плашки с именами — отдельно.',
]
ASK = [
    'Пройди по каждой фразе. Где картинка скучная или непонятная — предложи свою.',
    'Номер приёма — только из пульта Боба, с роликом и секундой. В прошлый раз часть номеров не совпала с роликами, поэтому сначала проверь, что номер показывает то, что ты описываешь.',
    'Голос не меняй: текст уже выбран.',
    'Новых цифр и фактов на экран без ссылки не добавляй.',
    'Ответ — таблицей: тайминг · голос · на экране · крупная надпись · приём. Сначала 5 самых важных правок, потом остальное.',
]
SOURCES = [
    ('Опыт с мышами 1953 года — Cancer Research Institute', 'https://www.cancerresearch.org/blog/searching-for-the-causes-of-lung-cancer'),
    ('Яблоки и карандаши Бёрнетта — Leo Burnett Company, Encyclopedia.com', 'https://encyclopedia.com/books/politics-and-business-magazines/leo-burnett-company-inc'),
    ('Доля в «Джуле» — 450 млн $ — CNBC, 28.07.2022', 'https://www.cnbc.com/2022/07/28/altrias-13b-juul-investment-has-lost-95percent-of-its-value.html'),
    ('Отчёт Altria за 2-й квартал 2022', 'https://www.businesswire.com/news/home/20220727005497/en/Altria-Reports-2022-Second-Quarter-and-First-Half-Results-Reaffirms-2022-Full-Year-Earnings-Guidance'),
]
PULT = 'https://claude.ai/artifact/6zC9afRinD6tGydLhVQetA'
TEXTS_URL = 'https://claude.ai/artifact/A69HVk4cZmAE2dJoKESJYY'

# ---------- время ----------
LINES = T3['lines']
words = lambda s: re.findall(WRE, s)
starts, t = [], 0.0
for ln in LINES:
    starts.append(t); t += len(words(ln)) / WPS
FILM_END = t
DUR12 = len(words(LINES[11])) / WPS

def mm(s, up=False):
    s = math.ceil(s - 1e-6) if up else int(s + 1e-6)
    return f'{s // 60}:{s % 60:02d}'

def short_t(i, s):              # время в шортсе для фразы i (1..14) по времени фильма s
    if i == 12: return None
    return s + HOOK_LEN - (DUR12 if i > 12 else 0)

for b in BEATS:
    i = b['i']
    b['text'] = HOOK if i == 0 else LINES[i - 1]
    W = words(b['text'])
    if i == 0:
        b['a'], b['b'] = 0.0, HOOK_LEN
    else:
        b['a'] = starts[i - 1]; b['b'] = starts[i] if i < len(LINES) else FILM_END
    sh = []
    for anc, txt in b['shots']:
        if anc is None:
            sh.append((None, b['a'], txt)); continue
        k = next((j for j, w in enumerate(W) if norm(w).startswith(norm(anc))), None)
        assert k is not None, (i, anc)
        at = HOOK_AT[norm(W[k])] if i == 0 else b['a'] + k / WPS
        sh.append((W[k], at, txt))
    b['sh'] = sh
    for n, _ in b['fx']: assert n in BOB, n
    if i == 0: b['sa'], b['sb'] = 0.0, HOOK_LEN
    elif b.get('only') == 'film': b['sa'] = b['sb'] = None
    else: b['sa'], b['sb'] = short_t(i, b['a']), short_t(i, b['b'])
SHORT_END = short_t(14, FILM_END)
SHORT_ALL = SHORT_END + 3.0

def fxline(n):
    x = BOB[n]
    return f"#{n:03d} · {VID[x['v']]} {mm(float(x['a']))}–{mm(float(x['b']), True)}", x['n']

def head(b):
    if b['i'] == 0: return 'Крючок — только шортс'
    return f"Фраза {b['i']}"

def mm1(s):
    m = int(s // 60); return f'{m}:{s - 60 * m:04.1f}'.replace('.', ',')

def anchor_label(w, at, i):
    return (f'на «{w}» ' if w else 'с начала ') + f'({mm1(at)})'

# ---------- текст для Gemini ----------
def md():
    o = []
    A = o.append
    A('# Глава 3 «1924 · «Мальборо»» — рисовка для Gemini (от Claude, 18.11)')
    A('')
    A('Фильм «Что вы знаете о никотине?», глава 3. Текст — вариант 3 «Три жизни одной марки», его выбрал Андрей: '
      f'{sum(len(words(l)) for l in LINES)} слов, ≈ {mm(FILM_END)}.')
    A('Тайминг черновой: 2,4 слова в секунду. Когда запишем голос, Claude подгонит каждое событие к своему слову.')
    A('')
    A('## Что прошу'); A('')
    for k, s in enumerate(ASK, 1): A(f'{k}. {s}')
    A(''); A('## Как рисуем'); A('')
    for s in RULES: A(f'- {s}')
    A(''); A('## Кадр 0 — новый'); A('')
    for s in FRAME0: A(f'- {s}')
    A(''); A(f'## Раскадровка — фильм, 0:00–{mm(FILM_END)}'); A('')
    for b in BEATS:
        if b['i'] == 0: continue
        A(f"### {b['i']} · {mm(b['a'])}–{mm(b['b'])} · {LIVES[b['life']]}" + (' · только в фильме' if b.get('only') == 'film' else ''))
        A(f"Голос: «{b['text']}»")
        A('На экране:')
        for w, at, txt in b['sh']: A(f'- {anchor_label(w, at, b["i"])} — {txt}')
        A('Крупно: ' + ' → '.join(b['big']))
        A(f"Плашка года: {b['plate']}")
        A('Приёмы:')
        for n, ours in b['fx']:
            ref, bob = fxline(n); A(f'- {ref} — у Боба: {bob}. У нас: {ours}.')
        A(f"Звук: {b['snd']}")
        if b.get('det'): A(f"Деталь (проверено): {b['det']}")
        if b['sa'] is not None: A(f"В шортсе: {mm(b['sa'])}–{mm(b['sb'])}")
        A('')
    A('## Концовка'); A('')
    A('Фильм:')
    for s in END_FILM: A(f'- {s}')
    A('')
    A('Шортс (если Андрей скажет «да» шортсу «Мальборо»):')
    for s in END_SHORT: A(f'- {s}')
    A('')
    h = BEATS[0]
    A(f"## Шортс — крючок, 0:00–{mm(HOOK_LEN)}"); A('')
    A(f"Голос (уже записан, последняя фраза «Льда» без «Ведь»): «{HOOK}»")
    A('На экране:')
    for w, at, txt in h['sh']: A(f'- {anchor_label(w, at, 0)} — {txt}')
    ref, bob = fxline(88); A(f'Приём: {ref} — у Боба: {bob}.')
    A('')
    A('Тайминг шортса:')
    A(f'- 0:00–{mm(HOOK_LEN)} — крючок;')
    A(f'- {mm(HOOK_LEN)}–{mm(short_t(11, starts[11]))} — фразы 1–11;')
    A(f'- {mm(short_t(13, starts[12]))}–{mm(SHORT_END)} — фразы 13–14;')
    A(f'- {mm(SHORT_END)}–{mm(SHORT_ALL)} — вопрос, «Часть 4 →», петля в кадр 0.')
    A('')
    A('## Приёмы из пульта Боба, которые я взял'); A('')
    used = sorted({n for b in BEATS for n, _ in b['fx']})
    for n in used:
        ref, bob = fxline(n); A(f'- {ref} — {bob}')
    A('')
    A('## Источники деталей'); A('')
    for s, u in SOURCES: A(f'- {s}: {u}')
    A(f'- Факты самого текста — на странице текстов: {TEXTS_URL}')
    return '\n'.join(o) + '\n'

TZ = md()

# ---------- страница ----------
LCOL = {'cow': 'l-cow', 'lady': 'l-lady', 'fear': 'l-fear', 'second': 'l-cow', 'price': 'l-price', 'money': 'l-money', 'third': 'l-third'}

def mark_voice(b):
    hits = {norm(w) for w, _, _ in b['sh'] if w}
    out, last = [], 0
    for m in re.finditer(WRE, b['text']):
        out.append(E(b['text'][last:m.start()]))
        w = m.group(0)
        out.append(f'<mark>{E(w)}</mark>' if norm(w) in hits else E(w)); last = m.end()
    out.append(E(b['text'][last:]))
    return ''.join(out)

def beat_html(b):
    i = b['i']; cid = 'b0' if i == 0 else f'b{i}'
    tag = ''
    if b.get('only') == 'film': tag = '<span class="only">только в фильме</span>'
    if b.get('only') == 'short': tag = '<span class="only">только в шортсе</span>'
    tm = f"{mm(b['a'])}–{mm(b['b'])}"
    st = '' if b['sa'] is None or i == 0 else f"<span class='sht'>в шортсе {mm(b['sa'])}–{mm(b['sb'])}</span>"
    shots = ''.join(
        f"<li><span class='at'>{('«' + E(w) + '»') if w else 'с начала'}<small>{mm1(at)}</small></span><span>{E(txt)}</span></li>"
        for w, at, txt in b['sh'])
    fx = ''.join(
        f"<li><b>{E(fxline(n)[0])}</b><span class='bob'>у Боба: {E(BOB[n]['n'])}</span><span>у нас: {E(ours)}</span></li>"
        for n, ours in b['fx'])
    big = ''.join(f"<span class='cap'>{E(c)}</span>" for c in b['big'])
    det = f"<p class='det'><span aria-hidden='true'>✓</span> {E(b['det'])}</p>" if b.get('det') else ''
    num = 'крючок' if i == 0 else f'{i:02d}'
    return f"""<article class="beat {LCOL[b['life']]}" id="{cid}">
<header class="bh"><span class="bn">{num}</span><span class="tm">{tm}</span>{st}<span class="life">{E(LIVES[b['life']])}</span>{tag}</header>
<p class="voice">{mark_voice(b)}</p>
<h3>На экране</h3><ol class="shots">{shots}</ol>
<div class="meta"><div><h3>Крупно</h3><div class="caps">{big}</div></div><div><h3>Плашка года</h3><p class="plate">{E(b['plate'])}</p></div></div>
<h3>Приёмы Боба</h3><ul class="fx">{fx}</ul>
<p class="snd"><b>Звук:</b> {E(b['snd'])}</p>{det}
</article>"""

def timeline():
    segs, cur = [], None
    for b in BEATS:
        if b['i'] == 0: continue
        if cur and cur['life'] == b['life']:
            cur['b'] = b['b']
        else:
            cur = dict(life=b['life'], a=b['a'], b=b['b'], first=b['i']); segs.append(cur)
    bar = ''.join(
        f"<a class='seg {LCOL[s['life']]}' href='#b{s['first']}' tabindex='-1' aria-hidden='true' style='flex:{s['b'] - s['a']:.2f}' title='{E(LIVES[s['life']])} · {mm(s['a'])}–{mm(s['b'])}'></a>"
        for s in segs)
    ticks = ''.join(f"<span style='left:{x / FILM_END * 100:.2f}%'>{mm(x)}</span>" for x in range(0, int(FILM_END) + 1, 20))
    leg = ''.join(
        f"<li><a class='{LCOL[s['life']]}' href='#b{s['first']}'><i></i><b>{E(LIVES[s['life']])}</b><small>{mm(s['a'])}–{mm(s['b'])}</small></a></li>"
        for s in segs)
    return f"<div class='bar'>{bar}</div><div class='ticks'>{ticks}</div><ul class='legend'>{leg}</ul>"

def ul(items): return '<ul>' + ''.join(f'<li>{E(s)}</li>' for s in items) + '</ul>'
def ol(items): return '<ol>' + ''.join(f'<li>{E(s)}</li>' for s in items) + '</ol>'

CSS = r"""
/* Лист раскадровки: сверху лента главы по кускам (как монтажный таймлайн), набросок кадра 0,
   дальше карточки фраз по порядку; цвет полосы карточки — кусок главы. Кнопка копирования — в липкой шапке. */
:root{
  --ground:#F1EFEE; --sheet:#FFFFFF; --ink:#1C1919; --muted:#6C6563; --line:#DCD6D3;
  --red:#B3141C; --on-red:#FFFFFF; --marker:rgba(255,206,48,.6); --ok:#1D7A4C;
  --l-cow:#B3141C; --l-lady:#C2697F; --l-fear:#237B80; --l-price:#34457A; --l-money:#9A7413; --l-third:#C85F16;
  --f-disp:"Oswald","Arial Narrow","Roboto Condensed",sans-serif;
  --f-body:"Golos Text",-apple-system,"Segoe UI",Roboto,sans-serif;
  --f-mono:"IBM Plex Mono",ui-monospace,"SF Mono",Menlo,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --ground:#151313; --sheet:#1F1C1B; --ink:#EEE9E6; --muted:#A39A96; --line:#36312F;
  --red:#EA5359; --on-red:#1C0B0B; --marker:rgba(255,206,48,.3); --ok:#55C994;
  --l-cow:#EA5359; --l-lady:#E58FA5; --l-fear:#4FB7B9; --l-price:#8E9DDA; --l-money:#D8AE4A; --l-third:#F08A3E; color-scheme:dark}}
:root[data-theme="dark"]{
  --ground:#151313; --sheet:#1F1C1B; --ink:#EEE9E6; --muted:#A39A96; --line:#36312F;
  --red:#EA5359; --on-red:#1C0B0B; --marker:rgba(255,206,48,.3); --ok:#55C994;
  --l-cow:#EA5359; --l-lady:#E58FA5; --l-fear:#4FB7B9; --l-price:#8E9DDA; --l-money:#D8AE4A; --l-third:#F08A3E; color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--ground);color:var(--ink);font:16px/1.5 var(--f-body);
  padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:0 56px}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--ground)}
a{color:inherit;text-decoration-color:var(--muted);text-underline-offset:2px}
:focus-visible{outline:2px solid var(--red);outline-offset:2px;border-radius:4px}
h1,h2,h3{text-wrap:balance;margin:0}
.wrap{max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:30px}
.eb{font:500 12px/1.3 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:0}
h1{font:600 clamp(36px,8vw,60px)/1.02 var(--f-disp);letter-spacing:.01em;text-transform:uppercase}
h1 .yr{color:var(--red)}
h2{font:600 clamp(24px,5vw,30px)/1.1 var(--f-disp);letter-spacing:.01em}
h3{font:600 12px/1.3 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.lede{margin:0;max-width:62ch;font-size:17px}
header.top{display:flex;flex-direction:column;gap:12px;padding-top:6px}
.sum{display:flex;flex-wrap:wrap;gap:6px 14px;margin:0;padding:0;list-style:none;font:500 13.5px/1.4 var(--f-mono);color:var(--muted)}
.sum b{color:var(--ink);font-weight:600}

/* липкая шапка с кнопкой */
.topbar{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--ground);border-bottom:1px solid var(--line);
  margin-inline:calc(-1 * max(16px,env(safe-area-inset-left,0px))) calc(-1 * max(16px,env(safe-area-inset-right,0px)));
  padding:10px max(16px,env(safe-area-inset-right,0px)) 10px max(16px,env(safe-area-inset-left,0px));margin-bottom:22px}
.topbar .in{max-width:900px;margin:0 auto;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.topbar .tt{font:600 18px/1.1 var(--f-disp);letter-spacing:.02em;text-transform:uppercase;margin-right:auto}
.btn{appearance:none;font:600 15px/1 var(--f-body);border-radius:6px;padding:12px 16px;cursor:pointer;border:1px solid var(--red);background:var(--red);color:var(--on-red)}
.btn:active{transform:translateY(1px)}
.st{font-size:13.5px;color:var(--ok);min-height:1.2em}
.st.err{color:var(--red)}

/* лента главы */
.tl{display:grid;gap:8px}
.bar{display:flex;gap:2px;height:30px;border-radius:4px;overflow:hidden}
.seg{display:block;min-width:4px;background:var(--c)}
.seg:hover{filter:brightness(1.1)}
.ticks{position:relative;height:16px;font:500 11px/1 var(--f-mono);color:var(--muted);font-variant-numeric:tabular-nums}
.ticks span{position:absolute;transform:translateX(-50%);white-space:nowrap}
.ticks span:first-child{transform:none}
.ticks span:last-child{transform:translateX(-100%)}
.legend{list-style:none;margin:6px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px 16px}
.legend a{display:grid;grid-template-columns:12px minmax(0,1fr) auto;gap:8px;align-items:center;text-decoration:none;font-size:14.5px}
.legend i{width:12px;height:12px;border-radius:2px;background:var(--c)}
.legend small{font:500 12px/1 var(--f-mono);color:var(--muted);font-variant-numeric:tabular-nums}
.l-cow{--c:var(--l-cow)} .l-lady{--c:var(--l-lady)} .l-fear{--c:var(--l-fear)} .l-price{--c:var(--l-price)} .l-money{--c:var(--l-money)} .l-third{--c:var(--l-third)}

/* кадр 0 */
.f0{display:grid;grid-template-columns:240px minmax(0,1fr);gap:22px;align-items:start;background:var(--sheet);border:1px solid var(--line);border-radius:6px;padding:18px}
.f0 figure{margin:0;display:grid;gap:6px}
.f0 canvas{width:100%;max-width:240px;aspect-ratio:9/16;border-radius:4px;display:block;background:#6E1E2B}
.f0 figcaption{font:500 11.5px/1.35 var(--f-mono);color:var(--muted)}
.f0 .txt{display:grid;gap:10px;min-width:0}
.f0 ul{margin:0;padding-left:18px;display:grid;gap:7px;max-width:62ch}
@media (max-width:620px){.f0{grid-template-columns:minmax(0,1fr)}.f0 figure{justify-items:center}}

/* карточки фраз */
.beats{display:grid;gap:16px}
.beat{background:var(--sheet);border:1px solid var(--line);border-left:5px solid var(--c);border-radius:6px;padding:16px 18px 16px;display:grid;gap:10px;min-width:0;scroll-margin-top:124px}
.bh{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px}
.bn{font:600 26px/1 var(--f-disp);color:var(--c)}
.tm{font:600 15px/1 var(--f-mono);font-variant-numeric:tabular-nums}
.sht{font:500 12.5px/1 var(--f-mono);color:var(--muted);font-variant-numeric:tabular-nums}
.life{font:500 12px/1.2 var(--f-mono);letter-spacing:.05em;text-transform:uppercase;color:var(--c);margin-left:auto}
.only{font:600 11px/1 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ground);background:var(--ink);border-radius:3px;padding:4px 6px}
.voice{margin:0;font-size:18px;line-height:1.5;max-width:62ch}
.voice mark{background:linear-gradient(transparent 55%,var(--marker) 55%);color:inherit;padding:0 1px}
.shots{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.shots li{display:grid;grid-template-columns:8.6em minmax(0,1fr);gap:4px 12px;font-size:15.5px}
.shots .at{font:600 13.5px/1.45 var(--f-body);display:flex;flex-direction:column}
.shots .at small{font:500 12px/1.3 var(--f-mono);color:var(--muted);font-variant-numeric:tabular-nums}
@media (max-width:520px){.shots li{grid-template-columns:minmax(0,1fr)}.shots .at{flex-direction:row;gap:8px;align-items:baseline}}
.meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;border-top:1px solid var(--line);padding-top:10px}
@media (max-width:520px){.meta{grid-template-columns:minmax(0,1fr)}}
.meta > div{display:grid;gap:5px;align-content:start;min-width:0}
.caps{display:flex;flex-wrap:wrap;gap:6px}
.cap{font:600 15px/1.2 var(--f-disp);letter-spacing:.03em;border:1px solid var(--line);border-radius:4px;padding:5px 8px}
.plate{margin:0;font:500 14px/1.4 var(--f-mono)}
.fx{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.fx li{display:grid;gap:1px;font-size:14.5px}
.fx b{font:600 13.5px/1.35 var(--f-mono)}
.fx .bob{color:var(--muted)}
.snd{margin:0;font-size:14px;color:var(--muted)}
.snd b{color:var(--ink);font-weight:600}
.det{margin:0;font-size:14px;border-top:1px dashed var(--line);padding-top:8px}
.det span{color:var(--ok);font-weight:700}

/* концовки, правила */
.two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
@media (max-width:760px){.two{grid-template-columns:minmax(0,1fr)}}
.box{background:var(--sheet);border:1px solid var(--line);border-radius:6px;padding:16px 18px;display:grid;gap:10px;align-content:start;min-width:0}
.box ul,.box ol{margin:0;padding-left:20px;display:grid;gap:7px}
.refs ul{list-style:none;margin:0;padding:0;display:grid;gap:7px}
.refs li{display:grid;grid-template-columns:minmax(0,15em) minmax(0,1fr);gap:2px 14px;font-size:14.5px}
.refs b{font:600 13px/1.45 var(--f-mono)}
@media (max-width:620px){.refs li{grid-template-columns:minmax(0,1fr)}}
details.raw{border-top:1px solid var(--line);padding-top:12px}
summary{cursor:pointer;font:600 13px/1.3 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
textarea{width:100%;min-height:340px;margin-top:12px;resize:vertical;font:13px/1.5 var(--f-mono);color:var(--ink);background:var(--sheet);border:1px solid var(--line);border-radius:6px;padding:12px}
footer{color:var(--muted);font-size:13.5px;display:grid;gap:6px}
footer ul{margin:0;padding-left:18px;display:grid;gap:4px}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
html{scroll-behavior:smooth}
"""

JS = r"""
(function(){
  var ta = document.getElementById('tz'), TZ = ta.value;
  var st = document.getElementById('cpst');
  function fallback(){
    var d = document.getElementById('rawbox'); d.open = true; ta.focus(); ta.select();
    st.className = 'st err'; st.textContent = 'Не скопировалось само — текст выделен внизу, скопируй вручную.';
  }
  document.getElementById('cp').addEventListener('click', function(){
    try{
      navigator.clipboard.writeText(TZ).then(function(){
        st.className = 'st'; st.textContent = 'Скопировано — вставляй в Gemini.';
      }, fallback);
    }catch(e){ fallback(); }
  });

  // набросок кадра 0: 1080×1920, как в ролике
  var cv = document.getElementById('f0c'); if(!cv || !cv.getContext) return;
  var W = 1080, H = 1920; cv.width = 540; cv.height = 960;
  var c = cv.getContext('2d'); c.scale(.5, .5);
  function rect(x,y,w,h,f){ c.fillStyle=f; c.fillRect(x,y,w,h); }
  function poly(p,f){ c.beginPath(); c.moveTo(p[0],p[1]); for(var i=2;i<p.length;i+=2) c.lineTo(p[i],p[i+1]); c.closePath(); c.fillStyle=f; c.fill(); }
  // небо полосами, без градиента
  rect(0,0,W,520,'#5B1A26'); rect(0,520,W,420,'#8E2A26'); rect(0,940,W,410,'#C8472B');
  // солнце
  c.beginPath(); c.arc(540,1290,360,Math.PI,0); c.fillStyle='#F2B45A'; c.fill();
  // столовые горы
  poly([0,1350, 0,1190, 120,1190, 170,1250, 330,1250, 380,1350],'#4A2418');
  poly([700,1350, 760,1215, 900,1215, 940,1160, 1080,1160, 1080,1350],'#4A2418');
  // земля
  rect(0,1350,W,H-1350,'#2E1610'); rect(0,1350,W,8,'#6B3220');
  // растровая тень щита под 35°
  c.fillStyle='rgba(12,5,3,.55)';
  for(var y=1362;y<1600;y+=18){ var dx=(y-1350)*0.7; for(var x=170+dx;x<930+dx;x+=18){ c.beginPath(); c.arc(x,y,5.2,0,7); c.fill(); } }
  // ноги щита
  rect(300,1150,26,210,'#1F0E0A'); rect(754,1150,26,210,'#1F0E0A');
  // щит
  rect(130,250,820,910,'#1F0E0A'); rect(144,264,792,882,'#F2E9DA');
  // плакат: закат слева, всадник
  rect(144,264,430,882,'#B3141C');
  c.beginPath(); c.arc(360,860,150,Math.PI,0); c.fillStyle='#F2B45A'; c.fill();
  rect(144,860,430,286,'#7A0E14');
  // всадник силуэтом
  c.fillStyle='#1F0E0A';
  poly([250,860, 270,820, 330,800, 420,805, 455,830, 470,860, 455,860, 440,900, 425,900, 430,860, 300,862, 290,900, 275,900, 280,862],'#1F0E0A');
  poly([455,830, 485,800, 500,808, 480,840],'#1F0E0A');
  rect(345,720,30,90,'#1F0E0A');
  c.beginPath(); c.arc(360,708,18,0,7); c.fill();
  poly([318,700, 402,700, 392,690, 376,690, 372,672, 348,672, 344,690, 328,690],'#1F0E0A');
  // пачка справа
  rect(612,380,280,420,'#FFFFFF');
  poly([612,380, 892,380, 892,520, 752,450, 612,520],'#B3141C');
  c.fillStyle='#1F0E0A'; c.font='700 40px "Oswald","Arial Narrow",sans-serif'; c.textAlign='center'; c.fillText('МАЛЬБОРО',752,640);
  c.fillStyle='rgba(31,14,10,.35)'; rect(632,670,240,6,'rgba(31,14,10,.25)');
  // надпись на плакате
  c.fillStyle='#F2E9DA'; c.font='600 54px "Oswald","Arial Narrow",sans-serif'; c.textAlign='left'; c.fillText('СТРАНА',188,370); c.fillText('МАЛЬБОРО',188,430);
  // отогнутый угол: под ним розовый слой ар-деко
  poly([936,1146, 936,930, 720,1146],'#E7A9B6');
  c.strokeStyle='#C9A24A'; c.lineWidth=3;
  for(var k=0;k<4;k++){ c.beginPath(); c.arc(936,1146,60+k*42,Math.PI,Math.PI*1.5); c.stroke(); }
  poly([936,930, 720,1146, 770,1000],'#E5D7BF');
  poly([936,930, 770,1000, 800,985],'rgba(0,0,0,.18)');
  // разметка кадра
  c.setLineDash([18,14]); c.lineWidth=3; c.strokeStyle='rgba(255,255,255,.75)';
  c.beginPath(); c.moveTo(0,1480); c.lineTo(W,1480); c.stroke();
  c.beginPath(); c.moveTo(0,1720); c.lineTo(W,1720); c.stroke(); c.setLineDash([]);
  c.fillStyle='rgba(255,255,255,.85)'; c.font='500 30px "IBM Plex Mono",monospace'; c.textAlign='left';
  c.fillText('Y 1480 · важное выше',24,1466); c.fillText('Y 1720 · субтитры',24,1706);
  c.textAlign='center'; c.font='700 50px "Golos Text",sans-serif'; c.lineWidth=10; c.strokeStyle='#120806';
  c.strokeText('Это «Мальборо», и до',540,1800); c.fillStyle='#FFFFFF'; c.fillText('Это «Мальборо», и до',540,1800);
  // плашки года нет — как в кадре 0 «Льда»
})();
"""

def page():
    beats = ''.join(beat_html(b) for b in BEATS if b['i'] != 0)
    hook = beat_html(BEATS[0])
    used = sorted({n for b in BEATS for n, _ in b['fx']})
    refs = ''.join(f"<li><b>{E(fxline(n)[0])}</b><span>{E(BOB[n]['n'])}</span></li>" for n in used)
    src = ''.join(f"<li><a href='{E(u)}'>{E(s)}</a></li>" for s, u in SOURCES)
    nw = sum(len(words(l)) for l in LINES)
    return f"""<title>Рисовка главы «Мальборо»</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&family=Oswald:wght@600;700&display=swap">
<style>{CSS}</style>
<div class="topbar"><div class="in"><span class="tt">Глава 3 · рисовка</span>
<button class="btn" id="cp" type="button">Скопировать для Gemini</button><span class="st" id="cpst" role="status" aria-live="polite"></span></div></div>
<main class="wrap">
<header class="top">
<p class="eb">Фильм «Что вы знаете о никотине?» · глава 3 · текст 3 «Три жизни одной марки»</p>
<h1>Рисовка главы <span class="yr">«Мальборо»</span></h1>
<p class="lede">На каждую фразу — что на экране и на каком слове, крупная надпись, плашка года, номер приёма Боба с роликом и секундой. Кнопка сверху копирует всё одним текстом для Gemini.</p>
<ul class="sum"><li>фильм <b>{mm(FILM_END)}</b> + отъезд на доску</li><li>шортс <b>{mm(SHORT_ALL)}</b>, если скажешь «да»</li><li><b>{nw}</b> слов, 2,4 в секунду</li><li><b>{len(used)}</b> приёмов Боба</li></ul>
</header>
<section class="tl" aria-labelledby="h-tl"><h2 id="h-tl">Лента главы</h2>{timeline()}</section>
<section class="f0" aria-labelledby="h-f0">
<figure><canvas id="f0c" width="540" height="960" aria-label="Набросок кадра 0: щит с ковбоем на закате, угол плаката отогнут"></canvas><figcaption>набросок · 1080×1920</figcaption></figure>
<div class="txt"><h2 id="h-f0">Кадр 0 — новый</h2>{ul(FRAME0)}</div>
</section>
<section class="beats" aria-labelledby="h-b"><h2 id="h-b">Раскадровка</h2>{beats}</section>
<section class="two" aria-labelledby="h-end"><h2 id="h-end" style="grid-column:1/-1">Концовка</h2>
<div class="box"><h3>Фильм</h3>{ul(END_FILM)}</div>
<div class="box"><h3>Шортс — если скажешь «да»</h3>{ul(END_SHORT)}</div>
</section>
<section class="beats" aria-labelledby="h-h"><h2 id="h-h">Крючок шортса</h2>
<p class="lede">Голос уже есть — последняя фраза «Льда» без «Ведь». Тратить кредиты не нужно.</p>{hook}</section>
<section class="two" aria-labelledby="h-r"><h2 id="h-r" style="grid-column:1/-1">Для Gemini</h2>
<div class="box"><h3>Что прошу</h3>{ol(ASK)}</div>
<div class="box"><h3>Как рисуем</h3>{ul(RULES)}</div>
</section>
<section class="box refs" aria-labelledby="h-fx"><h2 id="h-fx">Приёмы из пульта Боба</h2>
<p class="lede">Клипы — в <a href="{PULT}">пульте</a>, по номеру.</p><ul>{refs}</ul></section>
<details class="raw" id="rawbox"><summary>Текст для Gemini целиком</summary><textarea id="tz" readonly aria-label="Текст для Gemini">{E(TZ)}</textarea></details>
<footer><p style="margin:0">Тайминг черновой: 2,4 слова в секунду. После записи голоса каждое событие встанет на своё слово.</p>
<p style="margin:0">Детали в кадре проверены:</p><ul>{src}</ul>
<p style="margin:0">Факты самого текста — на <a href="{TEXTS_URL}">странице текстов</a>.</p></footer>
</main>
<script>{JS}</script>
"""

(HERE / 'рисовка-18.11.md').write_text(TZ, encoding='utf-8')
(HERE / 'рисовка-18.11.html').write_text(page(), encoding='utf-8')
print('фильм', mm(FILM_END), '· шортс', mm(SHORT_ALL), '· приёмов', len({n for b in BEATS for n, _ in b['fx']}),
      '· текст для Gemini', len(TZ), 'знаков')
