# Фоны «как меню Planet Zoo» (13.9.19, Андрей: «лежали тигры, умывались, сзади ходили и плавали рыбки и черепахи — переделай все промты на этот лад»).
# Каждый фон — живая сцена без события: в центре крупно ЖИВОТНОЕ из фильма, которое спокойно живёт (умывается, дышит, водит ушами),
# сзади — второй слой жизни (рыбы, птицы, пар, дым), место — из сцены, 2–4 узнаваемых предмета. Камера стоит, 8 секунд, петля.
# Почему животные: видео-нейронки рисуют их живыми и правдоподобными, а «предмет сам двигается» — их главный брак (сыр у Клава, ручка у Волка).
# Запуск из корня dota-: python3 tools/bg_zoo.py  → фоны-промты-ЖИВЫЕ.txt + .json;  python3 tools/bg_zoo.py page <выход.html> — страница для телефона.
import html,json,re,sys

# Живые фоны «как меню Planet Zoo» (13.9.19, v2). Андрей: Planet Zoo — пример того, ЧЕМ хорош фон
# («лежали тигры, умывались, сзади плавали рыбки»): сцена живёт спокойно и по кругу, движение в два слоя — спереди и сзади,
# без событий. Животные — не обязательны («нахуя ты везде животных добавил? я просто как пример привёл»): только там, где они есть в фильме
# (рыбка у Волка, рыбы в аквариуме в Женеве и у Кристофера), больше никаких зверей.
# Тексты — живые промты из фоны-промты-СРАВНЕНИЕ.json (поле calm, уже по всем правилам 1–11) + правки ниже: без брендов
# (Gemini/Veo отказывает «due to interests of third-party content providers» на марки и узнаваемое чужое), у главных — второй слой движения.
# Запуск из корня dota-: python3 tools/bg_zoo.py  → фоны-промты-ЖИВЫЕ.txt + .json;  python3 tools/bg_zoo.py page <выход.html>
import html,json,sys

RULES=[
 ('Сцена живёт, а не «происходит»','Как меню Planet Zoo: ничего не взрывается, не гаснет, не падает. Петля сходится — смотреть можно бесконечно.'),
 ('Два слоя движения','Спереди — главное движение крупно и близко (дым, пар, пузырьки, рыбка, свеча); сзади — второй слой мягко (дождь, город, деревья, неон, море).'),
 ('Двигается только то, у чего есть причина','Огонь, вода, ветер, экраны, живые рыбы. Предметы сами не катятся и не падают.'),
 ('Место и предметы — из сцены','3–6 предметов, по которым фанат узнаёт фильм. Животных нет, если их нет в самом фильме.'),
 ('Камера стоит','Без наездов и проездов: фон за кнопками не должен качать глаз.'),
 ('Без дыма','Дым нейронки рисуют криво (шёл из бокала мартини): ни сигарет, ни сигар, ни дымки. Пар, пыль и марево — можно, это не дым.'),
 ('Без людей, текста и марок','Ни лиц, ни рук, ни надписей, ни логотипов, ни названий брендов и фильмов — иначе Gemini отказывает.'),
]

NAMES={1:'«Волк с Уолл-стрит» — главный',2:'«Волк» — обед с Ханной (и DE «Ланч»)',3:'«Волк» — швейцарский банк',4:'DE «Первое свидание с Наоми»',
 5:'«Клан Сопрано» — главный',6:'«Сопрано» — первый приём у Мелфи',7:'«Сопрано» — праздник святого (S06E09)',8:'«Сопрано» — «Где моя арка?»',
 9:'«Сопрано» — Ральф (S04E09)',10:'DE «Тони, Мелфи и Махаффи» (S01E01)',11:'DE «Хасиды нанимают Тони» (S01E03)',12:'DE «Фил решает» (S06E20)',
 13:'«Американский психопат» — главный',14:'«Психопат» — офис',15:'«Психопат» — визитки',16:'«Таксист» — главный',17:'«Таксист» — «Одинокий человек Бога»',
 18:'«Таксист» — Бетси, «кофе и пирог»',19:'«Бункер» — главный',20:'«Бункер» — приказ Штайнера',21:'«Титаник» — главный',22:'«Титаник» — шлюпка',
 23:'DE «Эндрюс: корабль утонет»',24:'DE «Мать и корсет»',25:'«Во все тяжкие» — главный',26:'«Во все тяжкие» — засада (S01E01)',27:'«Во все тяжкие» — Гас',
 28:'«Во все тяжкие» — подпол, «Где деньги?»',29:'DE «Ich bin die Gefahr» (S04E06)',30:'DE «Майк и ноутбук Гаса» (S05E01)',31:'«Павел Дуров» — главный',
 32:'«Дуров» — у Такера Карлсона',33:'«Clavicular» — главный',34:'«Clavicular» — подкаст Impaulsive',35:'«Clavicular» — 18+, клуб',36:'«Clavicular» — бургер без сыра',37:'«Clavicular» — ставки'}

# что движется — у главных (у сцен берётся поле live из СРАВНЕНИЯ)
LIVE_MAIN={
 1:'Рыбка в аквариуме шевелит плавниками, в шампанском бегут пузырьки, на экранах тикают зелёные котировки, по стене ползёт бегущая строка.',
 5:'От сигары вьётся дымок, над эспрессо пар, розовая неоновая свинья в витрине тихо гудит, красный навес чуть колышется от утреннего ветра.',
 13:'Индикаторы на стерео прыгают в такт музыке, по большому окну текут капли дождя, за ним мерцает ночной Манхэттен.',
 16:'Помехи на телевизоре мерцают, по стеклу текут капли, за окном мимо такси тянется пар, красный неон тихо гудит.',
 19:'Дым медленно ползёт над руинами, в воздухе плывут оранжевые искры, уголок карты на ящике дрожит от горячего ветра.',
 21:'Море скользит мимо носа корабля, вокруг айсберга плывёт дымка, у кнехта мерцает синяя искорка — колье.',
 31:'Занавеска качается на ветру, крылья самолётиков дрожат, далеко внизу мерцают фонари проспекта.',
 8:'В аквариуме плавают рыбки и бегут пузырьки, дымит сигарета, по окну текут капли дождя.',
 33:'Лампы вокруг зеркала тепло горят, в миске тает лёд и по стеклу сползают капли, за окном качаются пальмы и мягко пульсирует неон.',
}
# (старое, новое) — точечные правки текстов из СРАВНЕНИЯ
FIX={
 1:[('a small white scale model of a 1980s Lamborghini Countach','a small white scale model of a 1980s wedge-shaped Italian supercar')],
 5:[('the pink pig neon hums softly.','the pink pig neon hums softly; the red awning above the window flutters slightly in the morning breeze.')],
 8:[(' and one small grey reef shark',''),('The tropical fish and the small grey shark swim','The tropical fish swim')],
 13:[('the city lights twinkle; nothing else moves.','rain streaks run slowly down the big window, the city lights twinkle behind them.')],
 16:[('the TV static flickers, steam drifts past the taxi outside the window.','the TV static flickers, raindrops run down the window glass, steam drifts past the taxi outside, the red neon glows and hums.')],
 19:[('a few orange embers float in the air.','a few orange embers float in the air, a corner of the paper map trembles in the hot wind.')],
 25:[('heat haze shimmers above the sand.','the yellow hazmat suit in the doorway sways slightly in the same wind, heat haze shimmers above the sand.')],
 33:[('Light: at first only the dim pink glow of the city — the mirror bulbs and the ring light are off.','Light: the round mirror bulbs glow warm and soft, the ring light is on, pink-purple city neon through the window.'),
     ('Calm and dim: the palm trees sway outside the small window, the phone screen is dark.','Calm: the ice cubes in the glass bowl slowly melt and droplets slide down the bowl, the palm trees sway outside the small window, the pink-purple neon outside pulses softly.')],
}

# 13.9.19: без дыма (Андрей: «с бокала мартини синий дым идёт», «дым и пар — это разное»): сигарет, сигар, дыма, тумана и дымки нет; пар, пыль, марево — можно
NOSMOKE={
 2:[('; a crystal ashtray with one burning cigarette',''),('the hazy Manhattan skyscrapers','the pale Manhattan skyscrapers'),
    ('A long ribbon of blue-grey smoke rises from the cigarette and curls slowly through the soft daylight; thin streams','Thin streams'),
    ('drops of condensation slide down the silver shaker.','drops of condensation slide slowly down the silver shaker and the cold martini glass.'),
    ('; a black 1980s pager; a black leather check folder slightly open with a real hundred-dollar bill sticking out',''),
    ('Grade: white linen, gin and money; smug, seductive and rotten — money is not real (fugazi).','Grade: crisp white linen, cool silver and pale daylight with warm yellow accents; smug, seductive and cold.'),
    ('sparkling mineral water with a lemon slice,','sparkling mineral water with a lemon slice resting still on the rim,'),
    ('real-world sizes (banknotes look like real worn paper money)','real-world sizes; no money or banknotes anywhere')],
 5:[(', a cigar resting in a heavy glass ashtray and',' and'),(' a thin thread of smoke rises only from the tip of the cigar, steam rises from one espresso cup,',' thin steam rises from one espresso cup,')],
 8:[('an ashtray with one lit cigarette and an open can of beer','an open can of beer'),('; a ribbon of smoke rises from the cigarette','')],
 9:[(', an ashtray with a lit cigarette',' with slowly melting ice cubes'),('; a ribbon of smoke rises from the cigarette in the ashtray','; the ice cubes in the whiskey glass slowly melt and glint')],
 19:[('under a red smoky sky','under a red evening sky'),('under a dark smoky sky','under a dark sky'),('thick smoke drifts slowly across the ruins','the fire glow flickers softly on the broken walls')],
 21:[(' in thin mist',''),('thin mist drifts around the iceberg','soft light glints on the water around the iceberg')],
 22:[('thin freezing mist drifts across the deck and over the black water far below','the black water far below glints with reflections of the lamps')],
 36:[('Thin steam rises from the hot beef patty and its juices glisten','The juices of the beef patty glisten in the warm light')],
 35:[('; light haze in the air',''),('thin haze drifts through the pink neon; ','')],
}
for k,v in NOSMOKE.items():FIX.setdefault(k,[]).extend(v)
LIVE_MAIN.update({
 2:'В газированной воде бегут пузырьки, по шейкеру и холодному бокалу мартини сползают капли.',
 5:'Над эспрессо пар, розовая неоновая свинья в витрине тихо гудит, красный навес чуть колышется от утреннего ветра.',
 8:'В аквариуме плавают рыбки и бегут пузырьки, по окну текут капли дождя.',
 9:'На телике скачут лошади, розовый неон из клуба пульсирует, в виски тает лёд.',
 19:'Отсветы пожара дрожат на стенах руин, в воздухе плывут оранжевые искры, уголок карты дрожит от горячего ветра.',
 21:'Море скользит мимо носа корабля, у айсберга блестит вода, у кнехта мерцает синяя искорка — колье.',
 22:'Пустая шлюпка покачивается на канатах, внизу блестит чёрная вода, лампы чуть мигают.',
 36:'Сок на котлете блестит в тёплом свете, по стаканчику сползают капли.',
 35:'Крутится диско-шар, по стенам ползут зайчики, в бокалах пузырьки.',
})
BAN=['Lamborghini','Countach','Checker','Telegram','Gatorade','Huey','Pollos','Impaulsive','Satriale','Bada','shark']

def load():
    src=json.load(open('фоны-промты-СРАВНЕНИЕ.json',encoding='utf-8'));Z=[]
    for x in src:
        n=x['n'];p=x['calm']
        for a,b in FIX.get(n,[]):
            assert a in p,(n,a);p=p.replace(a,b)
        p=p.replace('Checker cab','yellow 1970s taxi').replace('yellow yellow','yellow')
        p=p.replace('Rules: ','Rules: no smoke, fog or mist anywhere (steam, dust and heat shimmer only where described above); ',1)
        assert not re.search(r'\b(smok\w*|cigar\w*|mist|fog)\b|(?<!heat )\bhaze',p.split('Rules:')[0],re.I),(n,'дым')
        bad=[w for w in BAN if re.search(r'\b'+w+r'\b',p,re.I)]
        assert not bad,(n,bad)
        Z.append(dict(n=n,kind=x['kind'],name=NAMES[n],file=x['file'],where=x['where'],hero=LIVE_MAIN.get(n) or x['live'],prompt=p))
    return Z
Z=load()

def build():
    json.dump(Z,open('фоны-промты-ЖИВЫЕ.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
    t=['ЖИВЫЕ ФОНЫ «КАК МЕНЮ PLANET ZOO» — 37 промтов (Veo 3.1, 9:16, 8 с). Без событий и без лишних животных.','','ПРАВИЛА:']
    t+=[f'— {a}: {b}' for a,b in RULES]+['']
    for z in Z:
        t+=['='*80,f"{z['n']}. {z['name']}  [{'главный' if z['kind']=='main' else 'сцена'}]",f"Файл: «{z['file']}.mp4» → {z['where']}",f"Что движется: {z['hero']}",'',z['prompt'],'']
    open('фоны-промты-ЖИВЫЕ.txt','w',encoding='utf-8').write('\n'.join(t))
    return Z

FILM=[('Волк','волк'),('Сопрано','сопрано'),('Психопат','психопат'),('Таксист','таксист'),('Бункер','бункер'),('Титаник','титаник'),('Во все тяжкие','бб'),('Дуров','дуров'),('Клав','клав')]
def page(outp):
    import base64,io,os
    from PIL import Image
    e=html.escape
    def thumb(rel,w=420):
        pth=os.path.join('..','scenes',rel)
        if not os.path.exists(pth):return ''
        im=Image.open(pth).convert('RGB');im.thumbnail((w,w));b=io.BytesIO();im.save(b,'JPEG',quality=70,optimize=True)
        return 'data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()
    cards=[];films=[]
    for z in Z:
        f=next(a for a,b in FILM if z['file'].startswith(b))
        if f not in films:films.append(f)
        img=thumb(z['where'].split('/')[0]+'/cover.jpg');main=z['kind']=='main'
        cards.append(f'''<article class="mk" data-film="{e(f)}" data-kind="{z['kind']}" data-n="{z['n']}">
<div class="mk-top">{f'<img class="mk-im" src="{img}" alt="" loading="lazy">' if img else ''}<div class="mk-h"><span class="tag">{e(f)} · {'главный фон' if main else 'фон сцены'}</span><h3>{e(z['name'])}</h3><span class="fn">{e(z['file'])}.mp4</span></div></div>
<p class="in"><b>Что движется:</b> {e(z['hero'])}</p>
<div class="mk-act"><button type="button" class="b cp">Скопировать промт</button><button type="button" class="b ghost sh" aria-expanded="false">Показать</button><label class="done"><input type="checkbox"> Готово</label></div>
<pre class="pr" hidden>{e(z['prompt'])}</pre></article>''')
    chips=''.join(f'<button type="button" class="chip" data-f="{e(f)}">{e(f)}</button>' for f in films)
    rules=''.join(f'<li><b>{e(a)}</b><span>{e(b)}</span></li>' for a,b in RULES)
    PAGE=f'''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Живые фоны</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Playfair+Display:wght@600;700&family=JetBrains+Mono&display=swap">
<style>
:root{{--bg:#f6f1e7;--panel:#fffaf1;--line:#e3d9c8;--fg:#211c15;--mute:#6f6556;--gold:#9a6b14;--gold2:#f3e6c8;--ok:#2f7a3d;--okbg:#e5f2e6;color-scheme:light}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#11100e;--panel:#191714;--line:#2c2823;--fg:#f0e8da;--mute:#a69c8e;--gold:#dcb56b;--gold2:#3a2f1c;--ok:#86c08f;--okbg:#1b2a1d;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#11100e;--panel:#191714;--line:#2c2823;--fg:#f0e8da;--mute:#a69c8e;--gold:#dcb56b;--gold2:#3a2f1c;--ok:#86c08f;--okbg:#1b2a1d;color-scheme:dark}}
.mk[hidden]{{display:none}}
*{{box-sizing:border-box}} body{{margin:0;background:var(--bg);color:var(--fg);font:15px/1.55 "Golos Text",system-ui,sans-serif}}
.w{{max-width:1100px;margin:0 auto;padding:28px 16px 64px}} h1,h2,h3{{font-family:"Playfair Display",Georgia,serif;margin:0;text-wrap:balance}}
h1{{font-size:clamp(30px,6vw,44px);line-height:1.1}} h2{{font-size:24px;margin:40px 0 10px}} h3{{font-size:18px;line-height:1.25}}
.eye{{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}} .lede{{color:var(--mute);max-width:64ch}}
.rules{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:10px 22px;list-style:none;margin:0;padding:0}}
.rules li{{border-top:1px solid var(--line);padding-top:8px}} .rules b{{display:block}} .rules span{{color:var(--mute);font-size:14px}}
.steps{{margin:0;padding-left:20px;color:var(--fg)}} .steps li{{margin:4px 0}} code{{font-family:"JetBrains Mono",monospace;font-size:12.5px;color:var(--gold)}}
.bar{{position:sticky;top:0;z-index:2;background:var(--bg);padding:10px 0;display:flex;gap:8px;align-items:center;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid var(--line);margin-bottom:12px}}
.chip{{flex:none;font:500 13px "Golos Text",sans-serif;color:var(--fg);background:transparent;border:1px solid var(--line);border-radius:999px;padding:6px 12px;cursor:pointer}}
.chip[aria-pressed="true"]{{background:var(--gold2);border-color:var(--gold);color:var(--gold)}} .prog{{flex:none;margin-left:auto;font-size:13px;color:var(--mute)}} .prog b{{color:var(--ok)}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:14px}}
.mk{{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px;min-width:0}}
.mk.is-done{{border-color:var(--ok);background:linear-gradient(var(--okbg),var(--panel) 60%)}}
.mk-top{{display:flex;gap:12px;align-items:flex-start}} .mk-im{{width:110px;aspect-ratio:16/10;object-fit:cover;border-radius:8px;flex:none;background:#000}}
.mk-h{{min-width:0;display:flex;flex-direction:column;gap:3px}} .tag{{font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}}
.fn{{font-family:"JetBrains Mono",monospace;font-size:12px;color:var(--gold);word-break:break-word}}
.in{{margin:0;background:var(--gold2);border-radius:8px;padding:7px 10px}} .why{{margin:0;color:var(--mute);font-size:14px}} .alt{{margin:0;font-size:13.5px;color:var(--gold)}}
.mk-act{{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:auto}}
.b{{font:600 13.5px "Golos Text",sans-serif;border-radius:10px;padding:9px 13px;border:1px solid var(--gold);background:var(--gold);color:#1b1408;cursor:pointer}}
.b.ghost{{background:transparent;color:var(--fg);border-color:var(--line)}} .b.ok{{background:var(--ok);border-color:var(--ok)}}
.done{{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:13.5px;color:var(--mute)}} .done input{{width:18px;height:18px;accent-color:var(--ok)}}
.pr{{margin:0;white-space:pre-wrap;word-break:break-word;font:12.5px/1.5 "JetBrains Mono",monospace;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:10px;max-height:300px;overflow:auto}}
button:focus-visible,input:focus-visible{{outline:2px solid var(--gold);outline-offset:2px}}
</style></head><body><div class="w">
<header><div class="eye">«Языки по кино» · фоны-награды</div><h1>Живые фоны, как в меню Planet Zoo</h1>
<p class="lede">Planet Zoo — пример того, чем хорош фон: сцена спокойно живёт по кругу, движение спереди и сзади, ничего не «случается». Животных нет — только место и предметы из фильма (рыбки — там, где аквариум есть в самой сцене). Названий брендов нет — на них Gemini отказывает.</p></header>
<h2>Правила</h2><ul class="rules">{rules}</ul>
<h2>Как делать</h2><ol class="steps"><li>«Скопировать промт» → Google Flow → Veo 3.1, вертикаль 9:16, 8 секунд.</li><li>Вышло криво — тот же промт ещё раз, не дописывай.</li><li>Gemini пишет «third-party content providers» — не прикладывай кадры из фильма и фото актёров, только текст. Если отказ на чистом тексте — нажми ещё раз или скинь мне, какой фон: уберу слово, на которое он ругается.</li><li>Назови файл как в карточке и положи в <code>scenes/claude/субтитры/фоны/</code> — петлю и установку делаю я.</li></ol>
<h2>37 фонов</h2>
<div class="bar" role="toolbar" aria-label="Фильтр"><button type="button" class="chip" data-f="" aria-pressed="true">Все</button><button type="button" class="chip" data-f="@main">Главные</button><button type="button" class="chip" data-f="@scene">Сцены</button>{chips}<span class="prog">готово <b id="pg">0</b> из 37</span></div>
<div class="grid">{''.join(cards)}</div></div>
<script>
(function(){{var K='bglive-done-v2',d={{}};try{{d=JSON.parse(localStorage.getItem(K)||'{{}}')||{{}}}}catch(_){{}}
function sv(){{try{{localStorage.setItem(K,JSON.stringify(d))}}catch(_){{}}}}
var C=[].slice.call(document.querySelectorAll('.mk'));function pg(){{document.getElementById('pg').textContent=C.filter(function(c){{return d[c.dataset.n]}}).length}}
C.forEach(function(c){{var n=c.dataset.n,cb=c.querySelector('.done input'),pr=c.querySelector('.pr'),sh=c.querySelector('.sh'),cp=c.querySelector('.cp');
 cb.checked=!!d[n];c.classList.toggle('is-done',cb.checked);
 cb.onchange=function(){{if(cb.checked)d[n]=1;else delete d[n];c.classList.toggle('is-done',cb.checked);sv();pg()}};
 sh.onclick=function(){{pr.hidden=!pr.hidden;sh.textContent=pr.hidden?'Показать':'Скрыть';sh.setAttribute('aria-expanded',String(!pr.hidden))}};
 cp.onclick=function(){{function ok(){{cp.textContent='Скопировано ✓';cp.classList.add('ok');setTimeout(function(){{cp.textContent='Скопировать промт';cp.classList.remove('ok')}},1800)}}
  function fb(){{pr.hidden=false;var r=document.createRange();r.selectNodeContents(pr);var s=getSelection();s.removeAllRanges();s.addRange(r);cp.textContent='Выделил — скопируй'}}
  try{{navigator.clipboard.writeText(pr.textContent).then(ok,fb)}}catch(_){{fb()}}}};}});
var H=[].slice.call(document.querySelectorAll('.chip'));H.forEach(function(h){{h.onclick=function(){{H.forEach(function(x){{x.setAttribute('aria-pressed',String(x===h))}});var f=h.dataset.f;
 C.forEach(function(c){{c.hidden=!!f&&(f[0]==='@'?c.dataset.kind!==f.slice(1):c.dataset.film!==f)}})}}}});pg();}})();
</script></body></html>'''
    open(outp,'w',encoding='utf-8').write(PAGE);print('страница:',outp,round(len(PAGE)/1024),'КБ')

if __name__=='__main__':
    out=build()
    if len(sys.argv)>2 and sys.argv[1]=='page':page(sys.argv[2])
    print('фоны-промты-ЖИВЫЕ.txt / .json:',len(out),'промтов; средняя длина',sum(len(o['prompt'].split()) for o in out)//len(out),'слов')
