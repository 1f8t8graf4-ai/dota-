# Страница «Фоны: финал» (11.10): моё видение всех 37 фонов. Решение Андрея: все — одного типа (вертикаль 9:16, 4 с спокойно + событие),
# поэтому 12 стоящих делаем заново по их же удачным промтам + событие, 25 фонов сцен — новые.
# Берёт промты из фоны-промты-СРАВНЕНИЕ.json (tools/bg_cmp.py), кадры — из клона ../scenes.
# Запуск из корня dota-: python3 tools/bg_final_page.py <выход.html>
import base64,html,io,json,os,sys
from PIL import Image

SC='../scenes'
R={r['n']:r for r in json.load(open('фоны-промты-СРАВНЕНИЕ.json',encoding='utf-8'))}

# сейчас стоят — переделать в тот же тип по их же промтам (кадр — превью стоящего фона)
KEEP={
1:dict(img='wolf-of-wall-street/film-bgp.jpg',name='«Волк с Уолл-стрит» — главный',
  inn='Тот же торговый зал после вечеринки: золотая рыбка, белая Lamborghini Countach (модель), рассыпанные таблетки, шампанское, пачки денег, снятая трубка — плюс котировки на экранах и бегущая строка на стене.',
  why='Каждый предмет — из фильма: на Countach Джордан едет под кваалюдами, рыбку на вечеринке глотает Донни, трубка — холодные звонки. Промт — слово в слово тот, по которому вышел стоящий фон.'),
2:dict(img='wolf-of-wall-street/bgp.jpg',name='«Волк» — обед с Ханной',
  inn='Столик над Манхэттеном: мартини, шейкер, жёлтые цветы, пепельница, газированная вода, счёт с сотней, пейджер, газета с котировками; за окном — дымчатый город. Ролик с вертолётом у Андрея уже есть.',
  why='Тот самый обед, где Ханна учит Джордана «фугази». Ты его похвалил.'),
3:dict(img='wolf-swiss-bank/bgp.jpg',name='«Волк» — швейцарский банк',
  inn='Кабинет банкира: стена-аквариум, флажок Швейцарии, кофе; за окном — фонтан Же-До.',
  why='Джордан прячет деньги в Женеве, а Женева узнаётся по фонтану.'),
5:dict(img='sopranos-s01e01/film-bgp.jpg',name='«Клан Сопрано» — главный',
  inn='Тротуар у мясной лавки Сатриале на рассвете: столик в клетку, складные стулья, эспрессо, сигара, газета; в витрине колбасы и сыры, неоновая свинья.',
  why='Лавка Сатриале — штаб всей банды, а не только Тони (твоё решение). Свинья гаснет, и кадр резко уходит в чёрное — как финал сериала.',
  note='Сейчас стоит кухня Тони — она останется, пока не сделаешь Сатриале.'),
6:dict(img='sopranos-s01e01/bgp.jpg',name='«Сопрано» — первый приём у Мелфи',
  inn='Кабинет Мелфи: два кресла друг напротив друга, салфетки, чай, лампа, книги; в приёмной — бронзовая статуя.',
  why='Первый приём Тони. Статую он разглядывает в самом первом кадре сериала.'),
13:dict(img='american-psycho/film-bgp.jpg',name='«Американский психопат» — главный',
  inn='Та же белая квартира над ночным Манхэттеном: прозрачный плащ на вешалке, топор, газеты на полу, стереосистема.',
  why='Сцена с Полом Алленом: Патрик стелет газеты, надевает плащ, ставит Huey Lewis и берёт топор.'),
16:dict(img='taxi-driver-lonely/film-bgp.jpg',name='«Таксист» — главный',
  inn='Комната Трэвиса: армейская куртка, треснувшее зеркало, револьверы, дневник, телевизор с рябью; за окном неон и жёлтое такси.',
  why='«Ты мне это говоришь?» у зеркала, дневник, телевизор, который он опрокидывает ногой.'),
19:dict(img='downfall-bunker/film-bgp.jpg',name='«Бункер» — главный',
  inn='Горящие руины Берлина, Рейхстаг, колонны; на ящике — карта со стрелками и круглые очки.',
  why='Конец Рейха одним кадром; очки и карта — из сцены с приказом Штайнера.'),
21:dict(img='titanic-boat/film-bgp.jpg',name='«Титаник» — главный',
  inn='Нос корабля на закате, впереди айсберг.',
  why='Нос — «я король мира», айсберг — конец. Весь фильм одним кадром.'),
25:dict(img='breaking-bad-pilot/film-bgp.jpg',name='«Во все тяжкие» — главный',
  inn='Автодом в пустыне, жёлтый костюм химзащиты, штаны на кусте, голубые кристаллы, противогаз, шляпа.',
  why='Пилот: штаны Уолта, улетевшие в пустыню; шляпа Хайзенберга; синий мет.'),
31:dict(img='durov-tucker/film-bgp.jpg',name='«Павел Дуров» — главный',
  inn='Окно над Невским с видом на Казанский собор, самолётики на подоконнике (часть — из купюр), чёрная футболка.',
  why='Самолётик — логотип Telegram; из окна офиса ВКонтакте Дуров пускал самолётики из пятитысячных; чёрное — его стиль.'),
33:dict(img='clavicular-impaulsive/film-bgp.jpg',name='«Clavicular» — главный',
  inn='Ванная-«станция лукмаксинга»: зеркало с лампами, чёрное поло, телефон на штативе с зелёными сообщениями, дермароллер, лёд, молоток, тейп для рта; за окном неоновый Майами.',
  why='Всё, о чём он стримит: уход за лицом, лёд, «bone smashing» молотком, стрим с телефона.'),
}

# сделать: место, что в кадре, почему так (событие и промт — из json)
MAKE={
4:dict(name='Первое свидание с Наоми',place='Полутёмный итальянский ресторан ночью, столик на двоих.',
  inn='Розы, лампа на столе, коктейль с соломинкой, бокал красного и обручальное кольцо на скатерти.',
  why='Джордан женат, а свидание — «точно не дружба». Снятое кольцо на столе — вся сцена в одном предмете.'),
7:dict(name='Праздник святого (S06E09)',place='Уличный праздник в Нью-Джерси, сумерки.',
  inn='Статуя святого с лентами, к которым приколоты доллары; гирлянды лампочек; церковь; лоток с пончиками; колесо обозрения вдали.',
  why='В этой серии на празднике дёргается и ломается аттракцион, а «Поли так увлёкся, пока ему цепляли деньги». Текст — твой похваленный, добавлено только событие.'),
8:dict(name='Где моя арка?',place='Квартира Кристофера ночью, конец 90-х.',
  inn='Печатная машинка с листом, стопка страниц, кассеты с гангстерскими фильмами, пиво, сигарета, аквариум с маленькой акулой, дождь за окном.',
  why='Кристофер хочет «арку», как у героев кино, и пишет сценарий. Акула — из вопроса Тони «Знаете, почему акула всё время плывёт?».'),
9:dict(name='Ральф приходит к Тони',place='Задний офис «Бада Бинг» ночью.',
  inn='Арифмометр, виски, сигарета, зелёная лампа, телевизор со скачками; в двери — шест на пустой сцене в розовом свете.',
  why='В этой серии сгорает конюшня с лошадью Пай-О-Май, и Тони решает, что это Ральф. Текст — твой похваленный, добавлено только событие.'),
10:dict(name='Тони и Махаффи',place='Газон офисного парка серым утром.',
  inn='Чёрный седан криво на газоне с открытой дверью, разлитый кофе и смятая подставка, одинокий ботинок, ивы.',
  why='Тони гонит должника прямо по газону — тот роняет кофе и теряет ботинок. Мелфи он потом скажет, что они «пили кофе».'),
11:dict(name='Хасиды нанимают Тони',place='Стойка дешёвого мотеля днём.',
  inn='Звонок, ключ с биркой, чёрная шляпа хасида, стакан кофе, вертикальные жалюзи.',
  why='Хозяин мотеля нанимает Тони, а в разговоре всплывает голем — глиняный великан. Отсюда шаги великана.'),
12:dict(name='Фил решает',place='Старое бруклинское кафе зимой.',
  inn='Эспрессо, стакан воды, сложенный шёлковый платок, кружевные занавески, бра.',
  why='«Я принял решение»: Фил спокойно, за кофе, решает «обезглавить» семью Сопрано. Платок — его щегольство, бра гаснет — «выключают».'),
14:dict(name='Бейтман приходит в офис',place='Кабинет на Уолл-стрит солнечным утром, 1987.',
  inn='Стол красного дерева, газировка с лаймом, плеер с оранжевыми наушниками, ежедневник и ручка строго параллельно, жалюзи.',
  why='Патрик приходит в наушниках, у него всё идеально ровно — это маска. Одна красная капля в воде — что под ней.'),
15:dict(name='Визитки',place='Переговорная на Уолл-стрит, крупно.',
  inn='Пять визиток веером, все чуть разного белого; у последней — водяной знак; стакан воды.',
  why='«Посмотрите на этот благородный оттенок… Боже, там даже водяной знак». Свет на последнюю визитку — она «круче всех».'),
17:dict(name='Одинокий человек Бога',place='Салон жёлтого такси ночью, с заднего сиденья.',
  inn='Поцарапанная перегородка, пустое место водителя, дневник, счётчик, мокрое стекло, неон, пар из люка.',
  why='Монолог Трэвиса: изо дня в день одно и то же — «и вдруг перемена». Дворники ходят ровно, потом встают.'),
18:dict(name='Трэвис зовёт Бетси',place='Предвыборный штаб, 1972, солнечный день.',
  inn='Красно-бело-синие гирлянды, машинки, листовки; на столе — кофе и кусок пирога, вентилятор.',
  why='Трэвис зовёт Бетси «на кофе и пирог» — луч солнца ложится ровно на них.'),
20:dict(name='Приказ Штайнера',place='Бункер, комната совещаний, апрель 1945.',
  inn='Карты Берлина со стрелками, круглые очки, карандаши, низкая лампа на шнуре. Без флагов и символов.',
  why='Та самая сцена: он снимает очки и швыряет карандаш. Взрыв наверху — война проиграна.'),
22:dict(name='Джек сажает Роуз в шлюпку',place='Шлюпочная палуба ночью, во время крушения.',
  inn='Пустая шлюпка на шлюпбалках, брошенная меховая накидка, спасжилет, круглые лампы.',
  why='Роуз садится в шлюпку и прыгает обратно — остаются пустая шлюпка и её накидка. Свет гаснет — корабль умирает.'),
23:dict(name='Эндрюс: корабль утонет',place='Штурманская ночью.',
  inn='Синий чертёж корабля, карманные часы, линейка, карандаш, стакан воды, иллюминатор.',
  why='Эндрюс по чертежу показывает, что корабль утонет — «математически неизбежно». Крен — первое доказательство.'),
24:dict(name='Мать и корсет',place='Каюта первого класса вечером.',
  inn='Туалетный столик с овальным зеркалом, серебряная щётка, лилии, белый корсет на ширме, бархатные шторы.',
  why='Мать затягивает Роуз корсет и запрещает Джека — роскошь, которая душит.'),
26:dict(name='Учитель химии на рейде',place='Машина DEA на засаде, солнечный пригород.',
  inn='Очки-авиаторы, карта, бронежилет, рация; за стеклом — улица, у соседнего дома открыто окно на втором этаже.',
  why='Уолт сидит в машине и видит, как из этого окна удирает Джесси, — с этого всё начинается.'),
27:dict(name='Уолт приходит к Гасу',place='«Лос Поллос» на закрытии.',
  inn='Сине-белые стены, красные диванчики, поднос: диетическая кола и нетронутая курица. Без логотипов.',
  why='Днём Гас — вежливый хозяин закусочной, в темноте — наркобарон.'),
28:dict(name='«Где деньги?»',place='Подпол под домом Уайтов, вид сверху через люк.',
  inn='Рваная плёнка, пустые мешки, две пачки в тени, голая лампочка.',
  why='Уолт видит, что денег нет, и хохочет как безумный. Лампочка гаснет — у него гаснет всё.'),
29:dict(name='«Ich bin die Gefahr»',place='Спальня Уайтов ночью.',
  inn='Закрытая дверь, комод с рамкой, лампа, кружка кофе, кровать.',
  why='«Я тот, кто стучит» он говорит Скайлер именно здесь — и в дверь стучат.'),
30:dict(name='Майк и ноутбук Гаса',place='Пустыня в полдень.',
  inn='Бордовый седан Майка с открытой дверью, на капоте ключи и револьвер, в пыли закрытый ноутбук.',
  why='Майк чуть не застрелил Уолта в пустыне, а ноутбук Гаса — улика, которая всех утопит.'),
32:dict(name='Дуров у Такера Карлсона',place='Студия интервью в Дубае.',
  inn='Два чёрных кресла, столик с водой и белым бумажным самолётиком, деревянные рейки, мрамор, бюст, жалюзи.',
  why='Интервью записывали в Дубае, самолётик — логотип Telegram. Жалюзи поднимаются — а за окном Бурдж-Халифа.'),
34:dict(name='Подкаст Impaulsive',place='Студия подкаста после записи.',
  inn='Кремовые диваны, стол с цветными бутылками спортивного напитка, телефон.',
  why='В эпизоде ржут над «зелёными сообщениями» — телефон и заваливает зелёными.'),
35:dict(name='Clavicular · 18+',place='VIP-ложа клуба в Майами в 4 утра.',
  inn='Бархатный диван, ведёрко с шампанским, бокалы, телефон, неон, диско-шар.',
  why='Разговор про дофамин и удовольствие, которое быстро проходит: врубается белый свет — и праздник кончился.'),
36:dict(name='Бургер без сыра',place='Столик студии, крупно.',
  inn='Бургер «булка-котлета-булка», отодвинутый ломтик сыра, кетчуп, пакет, стакан.',
  why='Клав объясняет, почему бургер без сыра. Луч сверху, как в рекламе, — сыр остаётся в тени.'),
37:dict(name='Ставки на Клава',place='Тёмный стол студии ночью.',
  inn='Ноутбук с графиком, судейский молоток, фишки.',
  why='Интернет ставит на Клава: сядет ли он (молоток) и прочее. График взлетает — ставка зашла.'),
}
assert len(KEEP)+len(MAKE)==37 and not set(KEEP)&set(MAKE)

def thumb(rel,w=360):
    p=os.path.join(SC,rel)
    im=Image.open(p).convert('RGB');im.thumbnail((w,w))
    b=io.BytesIO();im.save(b,'JPEG',quality=72,optimize=True)
    return 'data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()

e=html.escape
FILM={'Волк с Уолл-стрит':'Волк','The Wolf of Wall Street':'Волк','Клан Сопрано':'Сопрано','Die Sopranos':'Сопрано',
      'Американский психопат':'Психопат','Таксист':'Таксист','Бункер':'Бункер','Титаник':'Титаник','Titanic':'Титаник',
      'Во все тяжкие':'Во все тяжкие','Breaking Bad':'Во все тяжкие','Павел Дуров':'Дуров','Clavicular':'Клав'}
def film(r):
    for k,v in FILM.items():
        if k in r['grp']:return v
    return r['grp']

films=[]
def card(n,m,img,redo):
    r=R[n];f=film(r)
    if f not in films:films.append(f)
    de=' · DE' if r['title'].startswith('DE') else ''
    kind=('главный фон' if 'главный' in m['name'] else 'фон сцены')+(' · заменить' if redo else '')
    rows=(f"<dt>Место</dt><dd>{e(m['place'])}</dd>" if m.get('place') else '')+f"<dt>В кадре</dt><dd>{e(m['inn'])}</dd><dt>Почему</dt><dd>{e(m['why'])}</dd>"
    return f'''<article class="mk{' redo' if redo else ''}" data-film="{e(f)}" data-kind="{'redo' if redo else 'new'}" data-n="{n}" id="f{n}">
<div class="mk-top"><figure class="mk-fig"><img class="mk-im{' tall' if redo else ''}" src="{img}" alt="Кадр: {e(m['name'])}" loading="lazy">{'<figcaption>сейчас стоит</figcaption>' if redo else ''}</figure>
<div class="mk-h"><span class="tag">{e(f)}{de} · {kind}</span><h3>{e(m['name'])}</h3><span class="fn">{e(r['file'])}.mp4</span></div></div>
<dl>{rows}<dt>Событие</dt><dd class="ev">{e(r['ev'])}</dd></dl>{f'<p class="note">{e(m["note"])}</p>' if m.get('note') else ''}
<div class="mk-act"><button type="button" class="b cp">Скопировать промт</button><button type="button" class="b ghost sh" aria-expanded="false">Показать промт</button>
<label class="done"><input type="checkbox" id="d{n}"> Готово</label></div>
<pre class="pr" hidden>{e(r['prompt'])}</pre></article>'''

make_html=[card(n,m,thumb(R[n]['where'].split('/')[0]+'/cover.jpg',320),False) for n,m in MAKE.items()]
redo_html=[card(n,k,thumb(k['img']),True) for n,k in KEEP.items()]
chips=''.join(f'<button type="button" class="chip" data-f="{e(f)}">{e(f)}</button>' for f in films)

PAGE=f'''<title>Фоны: финал</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Playfair+Display:wght@600;700&family=JetBrains+Mono:wght@400&display=swap">
<style>
/* Один тёмный «кинозал», как в самом приложении: слоновая кость по тёплому чёрному, латунь — только акцентом. Колонка ≤ 1100px, карточки сеткой. */
:root{{--bg:#11100e;--panel:#191714;--line:#2c2823;--fg:#f0e8da;--mute:#a69c8e;--gold:#dcb56b;--gold2:#3a2f1c;--ok:#86c08f;--okbg:#1b2a1d;
--disp:"Playfair Display",Georgia,"Times New Roman",serif;--body:"Golos Text",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;--mono:"JetBrains Mono",ui-monospace,Menlo,Consolas,monospace;color-scheme:dark}}
body{{background:var(--bg);color:var(--fg);font:15px/1.55 var(--body)}}
.w{{max-width:1100px;margin:0 auto;padding-inline:16px;padding-block:28px 64px}}
h1,h2,h3{{font-family:var(--disp);text-wrap:balance;margin:0}}
h1{{font-size:clamp(30px,6vw,46px);line-height:1.1}} h2{{font-size:clamp(22px,4vw,28px);margin-bottom:6px}} h3{{font-size:19px;line-height:1.25}}
.eye{{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}}
.lede{{color:var(--mute);max-width:62ch;margin:10px 0 0}}
.stats{{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}}
.st{{border:1px solid var(--line);border-radius:999px;padding:6px 12px;font-size:13px;color:var(--mute);font-variant-numeric:tabular-nums}}
.st b{{color:var(--fg);font-weight:600}}
section{{margin-top:44px}} .sub{{color:var(--mute);margin:0 0 16px;max-width:66ch}}
.pr-list{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:12px 22px;margin:0;padding:0;list-style:none}}
.pr-list li{{border-top:1px solid var(--line);padding-top:10px;min-width:0}}
.pr-list b{{display:block;font-weight:600}} .pr-list span{{color:var(--mute);font-size:14px}}
.honest{{margin-top:18px;border-left:2px solid var(--gold);padding:4px 0 4px 14px;color:var(--fg);max-width:70ch}}
.steps{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:12px;margin:0;padding:0;list-style:none;counter-reset:s}}
.steps li{{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 14px;counter-increment:s;min-width:0}}
.steps li::before{{content:counter(s);font-family:var(--disp);color:var(--gold);font-size:22px;display:block;line-height:1}}
.fn,code{{font-family:var(--mono);font-size:12.5px;color:var(--gold);word-break:break-word}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:14px}}
.kp{{display:flex;gap:12px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:10px;min-width:0}}
.kp-im{{width:108px;height:150px;object-fit:cover;border-radius:8px;flex:none;background:#000}}
.kp-b{{min-width:0}} .kp-b p{{margin:6px 0 0;font-size:14px}} .mute{{color:var(--mute)}}
.note{{color:var(--gold);font-size:13.5px!important}}
.tag{{font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}}
.bar{{position:sticky;top:env(safe-area-inset-top,0px);z-index:2;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(6px);
padding-block:10px;margin-bottom:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;border-bottom:1px solid var(--line)}}
.chip{{font:500 13px var(--body);color:var(--fg);background:transparent;border:1px solid var(--line);border-radius:999px;padding:6px 12px;cursor:pointer}}
.chip[aria-pressed="true"]{{background:var(--gold2);border-color:var(--gold);color:var(--gold)}}
.prog{{margin-left:auto;font-size:13px;color:var(--mute);font-variant-numeric:tabular-nums}} .prog b{{color:var(--ok)}}
.mk{{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}}
.mk.is-done{{border-color:color-mix(in srgb,var(--ok) 45%,var(--line));background:linear-gradient(var(--okbg),var(--panel) 60%)}}
.mk-top{{display:flex;gap:12px;align-items:flex-start}} .mk-im{{width:120px;aspect-ratio:16/9;object-fit:cover;border-radius:8px;flex:none;background:#000;max-width:40%}}
.mk-h{{min-width:0;display:flex;flex-direction:column;gap:3px}}
.mk-fig{{margin:0;flex:none;display:flex;flex-direction:column;gap:3px;max-width:40%}} .mk-fig .mk-im{{max-width:100%}}
.mk-im.tall{{width:96px;aspect-ratio:9/13}} .mk-fig figcaption{{font-size:11px;color:var(--mute);text-align:center}}
.mk .note{{margin:0;font-size:13.5px}}
dl{{margin:0;display:grid;grid-template-columns:auto 1fr;gap:6px 12px;font-size:14px}} dt{{color:var(--mute);font-size:12.5px;padding-top:2px}} dd{{margin:0;min-width:0}}
dd.ev{{color:var(--fg);background:var(--gold2);border-radius:8px;padding:6px 9px}}
.mk-act{{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:auto}}
.b{{font:600 13.5px var(--body);border-radius:10px;padding:9px 13px;border:1px solid var(--gold);background:var(--gold);color:#1b1408;cursor:pointer}}
.b.ghost{{background:transparent;color:var(--fg);border-color:var(--line)}}
.b.ok{{background:var(--ok);border-color:var(--ok)}}
.done{{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:13.5px;color:var(--mute);cursor:pointer}} .done input{{width:18px;height:18px;accent-color:var(--ok)}}
.pr{{margin:0;white-space:pre-wrap;word-break:break-word;font:12.5px/1.5 var(--mono);color:#d9cfbf;background:#0c0b0a;border:1px solid var(--line);border-radius:10px;padding:10px;max-height:320px;overflow:auto}}
.foot{{margin-top:40px;color:var(--mute);border-top:1px solid var(--line);padding-top:14px;font-size:14px}}
button:focus-visible,input:focus-visible{{outline:2px solid var(--gold);outline-offset:2px}}
@media (max-width:600px){{.bar{{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}} .bar::-webkit-scrollbar{{display:none}} .chip,.prog{{flex:none}}}}
@media (max-width:480px){{.kp-im{{width:92px;height:128px}} .mk-im{{width:104px}}}}
@media (prefers-reduced-motion:reduce){{*{{transition:none!important;animation:none!important}}}}
</style>
<div class="w">
<header><div class="eye">«Языки по кино» · фоны-награды</div><h1>Фоны: финал</h1>
<p class="lede">Как я вижу фоны и почему. Все 37 — одного типа: вертикаль, 4 секунды спокойно, потом событие из сцены. 25 фонов сцен делаем с нуля, 12 стоящих — заново по их же промтам, только с событием. По каждому: что в кадре, почему так, событие и готовый промт.</p>
<div class="stats"><span class="st"><b>25</b> новых</span><span class="st"><b>12</b> заменить</span><span class="st" id="stDone">готово <b>0</b> из 37</span></div></header>

<section><h2>Как я вижу фоны</h2><p class="sub">Фон — награда за сцену или весь фильм. Его смотрят на Главной по кругу, на телефоне, за кнопками. Отсюда правила:</p>
<ul class="pr-list">
<li><b>Один тип для всех</b><span>Вертикаль 9:16, 4 секунды спокойно, потом одно событие. Сейчас стоящие — вперемешку (8 горизонтальных, без событий), рядом с новыми это бросится в глаза, а в профиле и в дуэли — тем более.</span></li>
<li><b>Узнаётся с первого взгляда</b><span>Место из сцены и 3–5 предметов, по которым фанат узнаёт фильм. Все 12 стоящих фонов держатся на таких предметах (Ламба у Волка, топор и плащ у Бейтмана), поэтому их переделываем по тем же промтам. Неудачные — те, где я предметы убирал.</span></li>
<li><b>Без людей</b><span>Лица актёров нейронка рисует непохоже, а чужие лица — лишний юридический риск.</span></li>
<li><b>Камера стоит, движение мягкое</b><span>Фон живёт за кнопками и не должен дёргать глаз.</span></li>
<li><b>Одно событие на 4-й секунде</b><span>Светом, экраном, водой или дымом — это нейронка делает чисто. Брак — когда что-то катится или падает само, бьётся, летит роем или трясётся кадр (сыр у Клава).</span></li>
<li><b>Событие — пасхалка сцены</b><span>На петле его ждёшь, и оно напоминает момент из фильма: огонь на телике у Ральфа — сгоревшая конюшня, гаснет бра у Фила — «выключают» семью.</span></li>
<li><b>Деньги — мелко или в тени</b><span>Крупные купюры у видео-нейронок выходят фальшивыми.</span></li>
<li><b>Строка цвета — только цвет и настроение</b><span>Слова-предметы оттуда рисуются буквально: из «money-green» у Волка выросла пачка денег на кирпиче.</span></li>
<li><b>Богато — дорого и чисто</b><span>Потёртости и «зерно» — только где бедно по сюжету: мотель, квартира Трэвиса, подпол. У Волка они сделали офис нищим.</span></li>
</ul>
<p class="honest">Честно: генерация — лотерея. Правила снижают брак, но не убирают его. Если ролик вышел криво, перегенерируй тот же промт 2–3 раза, а не дописывай: дописки и сломали Волка.</p>
</section>

<section><h2>Как делать</h2>
<ol class="steps">
<li>Нажми «Скопировать промт» в карточке.</li>
<li>Google Flow → Veo 3.1, вертикаль 9:16, 8 секунд, промт целиком.</li>
<li>Вышло криво — тот же промт ещё раз. Лишний предмет или склейка — тоже.</li>
<li>Назови файл как в карточке и положи в <code>scenes/claude/субтитры/фоны/</code>. Петлю и установку сделаю я. Пока новый не готов — в приложении стоит старый.</li>
</ol></section>

<section id="make"><h2>Сделать — 37 фонов</h2><p class="sub">Сначала 25 новых (у этих сцен фона нет совсем), потом 12 замен. Порядок внутри — любой. Отметка «Готово» хранится только в этом браузере.</p>
<div class="bar" role="toolbar" aria-label="Фильтр по фильму"><button type="button" class="chip" data-f="" aria-pressed="true">Все</button><button type="button" class="chip" data-f="@new">Новые</button><button type="button" class="chip" data-f="@redo">Заменить</button>{chips}<span class="prog" id="prog">готово <b>0</b> из 37</span></div>
<div class="grid" id="mkGrid">{''.join(make_html+redo_html)}</div></section>

<p class="foot">Кидаешь ролики в папку — я делаю бесшовную петлю (событие раз в 10–12 секунд), проверяю шов по кадрам и ставлю в «Коллекцию». Промты — те же, что в <code>фоны-промты-СРАВНЕНИЕ.txt</code>.</p>
</div>
<script>
(function(){{
var KEY='bgfin-done-v1',done={{}};
try{{done=JSON.parse(localStorage.getItem(KEY)||'{{}}')||{{}}}}catch(_){{done={{}}}}
function save(){{try{{localStorage.setItem(KEY,JSON.stringify(done))}}catch(_){{}}}}
var cards=[].slice.call(document.querySelectorAll('.mk'));
function prog(){{var n=cards.filter(function(c){{return done[c.dataset.n]}}).length;
 document.querySelector('#prog b').textContent=n;document.querySelector('#stDone b').textContent=n;}}
cards.forEach(function(c){{
 var n=c.dataset.n,cb=c.querySelector('.done input'),pre=c.querySelector('.pr'),cp=c.querySelector('.cp'),sh=c.querySelector('.sh');
 cb.checked=!!done[n];c.classList.toggle('is-done',cb.checked);
 cb.addEventListener('change',function(){{if(cb.checked)done[n]=1;else delete done[n];c.classList.toggle('is-done',cb.checked);save();prog();}});
 sh.addEventListener('click',function(){{pre.hidden=!pre.hidden;sh.textContent=pre.hidden?'Показать промт':'Скрыть промт';sh.setAttribute('aria-expanded',String(!pre.hidden));}});
 cp.addEventListener('click',function(){{
  var t=pre.textContent;
  function ok(){{cp.textContent='Скопировано ✓';cp.classList.add('ok');setTimeout(function(){{cp.textContent='Скопировать промт';cp.classList.remove('ok')}},1800);}}
  function fallback(){{pre.hidden=false;sh.textContent='Скрыть промт';var r=document.createRange();r.selectNodeContents(pre);var s=getSelection();s.removeAllRanges();s.addRange(r);
   cp.textContent='Выделил — скопируй вручную';}}
  try{{navigator.clipboard.writeText(t).then(ok,fallback)}}catch(_){{fallback()}}
 }});
}});
var chips=[].slice.call(document.querySelectorAll('.chip'));
chips.forEach(function(ch){{ch.addEventListener('click',function(){{
 chips.forEach(function(x){{x.setAttribute('aria-pressed',String(x===ch))}});
 var f=ch.dataset.f;cards.forEach(function(c){{c.hidden=!!f&&(f.charAt(0)==='@'?c.dataset.kind!==f.slice(1):c.dataset.film!==f)}});
}})}});
prog();
}})();
</script>
'''
out=sys.argv[1] if len(sys.argv)>1 else 'фоны-финал.html'
open(out,'w',encoding='utf-8').write(PAGE)
print('готово:',out,round(len(PAGE)/1024),'КБ; фильмы:',films)
