# Страница «Метки Restless — Да / Нет / Потом» (03.11, Андрей: «добавь ещё меток в каждой категории и пришли HTML, как QoL»).
# Берёт метки, что уже на сайте (restless/metki.html, массив T), добавляет лайв-матч (из кода сайта) и новые,
# собирает дизайн/restless/metki-pick.html в стиле дизайн/restless/qol-pick.html. Ответы — в базе страницы, коллекция `metki`.
#   python3 tools/restless_metki_pick.py
import json, os, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(R, 'restless/metki.html'), encoding='utf8').read()
qol = open(os.path.join(R, 'дизайн/restless/qol-pick.html'), encoding='utf8').read()

js = re.search(r'const T=\[(.*?)\n\];', src, re.S).group(1)
OLD = []
for m in re.finditer(r"^\['([phmx])',(.*)\],?\s*$", js, re.M):
    a = json.loads('[' + m.group(2).replace("'", '"') + ']')
    OLD.append([m.group(1)] + a)

# лайв-матч: метки на карточке игрока (restless/src/lg.js → tags.push)
LIVE = [
    ['Высокий ранг', 'a', 'ранг выше среднего в лобби', '«Eternus 2 — выше всех в лобби»'],
    ['Мейн героя', 'a', '100+ игр на герое этого матча', '«Мейн Венатор — 140 игр»'],
    ['Спамит героя', 'a', 'последние 4+ игры подряд — на этом же герое', '«последние 6 игр подряд — на Рэм»'],
    ['Ветеран героя', 'b', '300+ игр на герое', '«412 игр на Мо и Крилле»'],
    ['Давно не играл', 'b', 'перерыв 14+ дней перед этой игрой', '«перерыв 23 дня»'],
    ['Марафон', 'b', '8+ игр сегодня', '«это его 9-я игра за день»'],
    ['Много играет', 'b', '5+ игр в день в среднем за неделю', ''],
    ['Первая игра за день', 'b', 'до этой — ни одной игры сегодня', ''],
    ['В форме', 'g', '7+ побед из последних 10', '«8 побед из 10»'],
    ['Серия побед', 'g', '3+ победы подряд', '«4 победы подряд»'],
    ['Сильный на герое', 'g', 'на этом герое 58%+ побед (20+ игр)', '«61% побед на Хейзе, 45 игр»'],
    ['Мало игр для ранга', 'r', 'ранг высокий, а игр на аккаунте мало — может быть смурф', '«Phantom, всего 40 матчей»'],
    ['Не в форме', 'r', '3 и меньше побед из последних 10', ''],
    ['Первый раз на герое', 'r', 'на этом герое 0–2 игры', '«впервые на Селесте»'],
    ['Почти не играл', 'r', 'на герое меньше 10 игр', ''],
    ['Слабый на герое', 'r', 'на этом герое 42% побед и меньше (20+ игр)', ''],
    ['Тильт сегодня', 'r', '3+ поражения подряд сегодня', '«3 поражения подряд за вечер»'],
]
# 04.11, Андрей в ответах: «Вытащили» → «Протащили», «Первым в драку» → «Лёгкая цель», «Урны и ящики» → «Мусорщик», «Стражник» → «Осадник».
# Страницу заново не собирать: id меток — из имён, ответы в базе привязаны к старым id.
# новые — по одной строке: категория, имя, цвет, когда давать, пример, заметка
NEW = [
    # профиль
    ['p', 'Разогревается', 'b', 'первая игра за день — на 10%+ побед хуже, дальше лучше', '«первая игра дня — 38% побед, потом 55%»', ''],
    ['p', 'Устаёт', 'r', 'после 4-й игры за день побед на 10%+ меньше', '«после 4-й игры — 39% побед»', ''],
    ['p', 'Ранняя пташка', 'b', '40%+ игр с 6 до 12 утра', '«47% игр утром»', 'Пара к «Полуночнику»'],
    ['p', 'Растёт', 'g', 'KDA за последние 20 игр на 25%+ выше, чем за 20 до них', '«KDA 3,8 — было 2,9»', ''],
    ['p', 'Новый мейн', 'a', 'главный герой за 30 дней — не тот, что за всё время', '«раньше Венатор, теперь Рэм»', ''],
    ['p', 'Агрессор', 'b', 'и убийств, и смертей на 25%+ больше среднего на тех же героях', '«убивает и умирает чаще всех»', ''],
    ['p', 'Осторожный', 'b', 'и убийств, и смертей на 25%+ меньше среднего', '«не лезет — и не умирает»', ''],
    ['p', 'Дуэт', 'a', '30%+ игр — с одним и тем же другом', '«чаще всего с Крыса-LOVE: 41 игра»', 'По «С кем играешь»'],
    ['p', 'Счастливый друг', 'g', 'с одним другом побед на 12%+ больше, чем без него (15+ игр вместе)', '«с Ice — 64%, без — 49%»', ''],
    ['p', 'Соло', 'b', '80%+ игр без друзей в группе', '', ''],
    ['p', 'Новичок', 'n', 'меньше 50 матчей на аккаунте', '«всего 31 матч»', ''],
    ['p', 'Быстрые матчи', 'g', 'его победы на 15%+ короче обычных для ранга', '«закрывает за 26 минут»', ''],
    ['p', 'Затяжные матчи', 'b', 'его матчи на 15%+ длиннее обычных для ранга', '', ''],
    ['p', 'Топ героя', 'h', 'в рейтинге героя — топ-100 мира (20+ игр за 90 дней, по рангу)', '«#37 Rat King · EU #9»', 'Новый честный рейтинг'],
    ['p', 'Охотник за рейтингом', 'g', 'за неделю поднялся в рейтинге героя на 50+ мест', '«+84 места на Рэм за неделю»', ''],
    # лайв-матч
    ['l', 'Топ героя', 'h', 'в рейтинге героя топ-100 мира', '«#12 Рэм в мире»', ''],
    ['l', 'Серия поражений', 'r', '3+ поражения подряд (не обязательно сегодня)', '«4 поражения подряд»', ''],
    ['l', 'Пати', 'a', 'в одной команде с другом из Steam / 3+ общих матча', '«с Ice — 12 игр вместе»', 'Уже есть «Друзья · N» на карточке'],
    ['l', 'Выигрывает линию', 'g', 'выиграл линию к 10-й в 60%+ последних игр', '«линия: 7 из 10 в плюс»', 'Нужны подробности матчей — дольше грузится'],
    ['l', 'Проигрывает линию', 'r', 'проиграл линию в 60%+ последних игр', '', 'То же'],
    ['l', 'Новый аккаунт', 'n', 'меньше 50 матчей', '«31 матч»', ''],
    ['l', 'Ночной марафон', 'b', '5+ игр подряд после полуночи', '«5-я игра с полуночи»', ''],
    ['l', 'Ливает', 'r', 'ливал из матча за 30 дней', '«ливал 2 раза»', ''],
    ['l', 'Против своего мейна', 'b', 'играет против героя, на котором у него 100+ игр — знает его как свои пять', '«100 игр на Венаторе — играет против Венатора»', ''],
    ['l', 'Знает тебя', 'b', 'вы встречались 3+ раза за 30 дней', '«уже играли: 4 раза, 3 победы его»', 'По «С кем играешь»'],
    # герой
    ['h', 'Усилили', 'g', 'в последнем патче — усиления героя', '«усилили 31.10»', 'Из «Патчей»'],
    ['h', 'Ослабили', 'r', 'в последнем патче — ослабления', '', ''],
    ['h', 'Растёт после патча', 'g', 'винрейт за неделю после патча на 1,5%+ выше, чем до', '«+2,1% после патча»', ''],
    ['h', 'Поздний', 'b', 'в матчах дольше 35 минут побеждает на 3%+ чаще', '«к концу сильнее»', ''],
    ['h', 'Ранний', 'b', 'в матчах до 25 минут побеждает на 3%+ чаще', '', ''],
    ['h', 'Выбор топов', 'h', 'в Eternus берут в 1,5 раза чаще, чем в среднем', '«в Eternus — 18% матчей»', ''],
    ['h', 'Ловушка', 'r', 'в низких рангах побеждает на 3%+ реже, чем у топов', '«новичкам сложно»', ''],
    ['h', 'Ганнер / Спиритер', 'b', 'ветка, которую берут в 60%+ сборок', '«Спирит — 72% сборок»', ''],
    ['h', 'Для линии', 'g', 'выигрывает линию у 60%+ героев', '', 'По «Тяжело / легко против»'],
    # матч
    ['m', 'MVP', 'h', 'лучшая оценка в матче', '«оценка S — лучшая из 12»', ''],
    ['m', 'Тащил', 'g', '35%+ убийств команды — его', '«14 из 37 убийств команды»', ''],
    ['m', 'Протащили', 'b', 'выиграли, а у него худшая оценка в команде', '«команда протащила»', ''],
    ['m', 'Долго лежал', 'r', 'мёртвым 20%+ матча', '«мёртвым 7:40 — 22% матча»', ''],
    ['m', 'Лёгкая цель', 'r', 'в 3+ драках умер первым', '', 'Из разбора «почему умирал»'],
    ['m', 'Сноубол', 'g', 'к 15-й на 5000+ душ больше соперника по линии', '', ''],
    ['m', 'Мусорщик', 'b', '10%+ душ — с урн, ящиков и статуй', '«2 урны, 9 ящиков»', ''],
    ['m', 'Охотник за головами', 'g', '3+ убийства самого богатого врага', '', ''],
    ['m', 'Поздний предмет', 'r', 'ключевой предмет на 5+ минут позже, чем у топов', '«Spirit Resilience на 8 минут позже»', 'Уже есть в коуче'],
    ['m', 'Ровная игра', 'g', 'оценка B и выше и на линии, и в середине, и в конце', '', ''],
    ['m', 'Осадник', 'g', 'больше всех урона по стражам и объектам', '', 'Пара к «Таран»'],
]
G = {'p': ('Профиль игрока', 'метки в шапке профиля и «Что знать»'), 'l': ('Лайв-матч', 'на карточке каждого из 12 игроков'),
     'h': ('Герой', 'вкладка «Герои» и страница героя'), 'm': ('За матч', 'строка матча и разбор'), 'x': ('Новые с прошлого раза', 'обсуждали, не решили')}
TR = dict(zip('абвгдеёжзийклмнопрстуфхцчшщъыьэюя', ['a','b','v','g','d','e','e','zh','z','i','i','k','l','m','n','o','p','r','s','t','u','f','h','c','ch','sh','sh','','y','','e','yu','ya']))
def slug(c, nm):
    s = ''.join(TR.get(ch, ch) for ch in nm.lower())
    return c + '-' + (re.sub(r'[^a-z0-9]+', '-', s).strip('-') or 'x')
ALL, seen = [], set()
def add(c, nm, col, cond, ex, note, new):
    i = slug(c, nm); k = 2
    while i in seen: i = slug(c, nm) + '-' + str(k); k += 1
    seen.add(i); ALL.append({'id': i, 'c': c, 'nm': nm, 'col': col, 'cond': cond, 'ex': ex, 'note': note, 'new': new})
for t in OLD:
    c, nm, col, cond = t[0], t[1], t[2], t[3]
    add(c, nm, col, cond, t[4] if len(t) > 4 else '', t[5] if len(t) > 5 else '', c == 'x')
for nm, col, cond, ex in LIVE: add('l', nm, col, cond, ex, '', False)
for c, nm, col, cond, ex, note in NEW: add(c, nm, col, cond, ex, note, True)
ORDER = ['p', 'l', 'h', 'm', 'x']
ALL.sort(key=lambda x: ORDER.index(x['c']))

css = re.search(r'<style>(.*?)</style>', qol, re.S).group(1)
css += '''
.lbl{display:inline-flex;align-items:center;gap:6px;font:600 13.5px/1 var(--f-body);border-radius:999px;padding:6px 11px;border:1px solid color-mix(in srgb,var(--c) 55%,transparent);color:var(--c);background:color-mix(in srgb,var(--c) 12%,transparent);white-space:nowrap}
.tag.nw{color:var(--amber);border-color:color-mix(in srgb,var(--amber) 55%,transparent)}
.ex{margin:0;font-size:13px;color:var(--mut)}
.nt{margin:0;font-size:13px;color:var(--later)}
.cs{--g:#33d6a6;--r:#ff5d7a;--a:#ffb630;--b:#9aa4b8;--n:#7aa7ff;--h:#f7d154}
'''
COLN = {'g': 'хорошая', 'r': 'плохая', 'a': 'герой / мейн', 'b': 'нейтральная', 'n': 'новичок', 'h': 'топ'}
data = json.dumps(ALL, ensure_ascii=False, separators=(',', ':'))
secs = json.dumps([[k, G[k][0], G[k][1]] for k in ORDER], ensure_ascii=False)
nn = sum(1 for x in ALL if x['new'])
page = f'''<title>Метки Restless</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>{css}</style>
<div class="wrap cs">
  <h1>Метки <b>Restless</b></h1>
  <p class="lead">Все <span id="tot">{len(ALL)}</span> меток: что уже на сайте и <b style="color:var(--amber)">{nn} новых</b> — в каждой категории. На каждую жми «Да», «Нет» или «Потом». Ответы сохраняются сами — я их прочитаю.</p>
  <div class="how">
    <div><h3>Как отвечать</h3>
      <ul><li><span class="k yes">Да</span>оставить / сделать</li><li><span class="k later">Потом</span>не сейчас</li><li><span class="k no">Нет</span>убрать / не делать</li></ul>
      <p style="color:var(--mut)">Другое имя или условие — напиши в комментарий.</p></div>
    <div><h3>Цвет метки</h3>
      <ul><li><span class="lbl" style="--c:var(--g)">хорошая</span><span class="lbl" style="--c:var(--r)">плохая</span></li><li><span class="lbl" style="--c:var(--a)">герой</span><span class="lbl" style="--c:var(--h)">топ</span><span class="lbl" style="--c:var(--b)">нейтральная</span></li></ul></div>
    <div><h3>Пометки</h3>
      <ul><li><span class="tag nw">новая</span>предлагаю добавить</li><li><span class="tag us-yes">на сайте</span>уже показывается</li></ul>
      <p style="color:var(--mut)">Наведи на метку — увидишь, когда её дают.</p></div>
  </div>
  <p class="warn" id="warn" hidden></p>
  <div class="bar">
    <div class="prog"><b id="cnt">0/0</b><div class="track" aria-hidden="true"><i id="bar"></i></div><small id="sum"></small></div>
    <div class="flt" role="group" aria-label="Показать" id="fa">
      <button class="chip" data-f="all" aria-pressed="true">Все</button><button class="chip" data-f="none" aria-pressed="false">Без ответа</button>
      <button class="chip" data-f="yes" aria-pressed="false">Да</button><button class="chip" data-f="later" aria-pressed="false">Потом</button><button class="chip" data-f="no" aria-pressed="false">Нет</button>
    </div>
    <div class="flt" role="group" aria-label="Какие" id="fm">
      <button class="chip" data-m="all" aria-pressed="true">Все метки</button><button class="chip" data-m="new" aria-pressed="false">Только новые</button><button class="chip" data-m="old" aria-pressed="false">Что на сайте</button>
    </div>
    <button class="copy" id="copy" type="button">Скопировать ответы</button>
    <span class="save" id="save" aria-live="polite"></span>
  </div>
  <div id="list"></div>
</div>
<script>
const ALL={data}, SECS={secs}, COLN={json.dumps(COLN, ensure_ascii=False)};
let ANS={{}}, FIL="all", FM="all", db=null, local=false;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}}[c]));
function card(f){{
  const a=(ANS[f.id]||{{}}).a||"", n=(ANS[f.id]||{{}}).note||"";
  return `<article class="card" data-id="${{f.id}}" data-a="${{a}}">
   <div class="top"><span class="lbl" style="--c:var(--${{f.col}})" title="${{esc(f.cond)}}">${{esc(f.nm)}}</span><div class="tags">${{f.new?'<span class="tag nw">новая</span>':'<span class="tag us-yes">на сайте</span>'}}<span class="tag">${{COLN[f.col]||""}}</span></div></div>
   <p class="ds"><b>Когда:</b> ${{esc(f.cond)}}</p>${{f.ex?`<p class="ex">Подсказка: ${{esc(f.ex)}}</p>`:""}}${{f.note?`<p class="nt">${{esc(f.note)}}</p>`:""}}
   <div class="row"><div class="ans" role="group" aria-label="Ответ">${{[["yes","Да"],["no","Нет"],["later","Потом"]].map(([v,t])=>`<button type="button" data-v="${{v}}" aria-pressed="${{a===v}}">${{t}}</button>`).join("")}}</div>
   <input class="note" id="n-${{f.id}}" placeholder="Комментарий: имя, условие…" value="${{esc(n)}}" aria-label="Комментарий: ${{esc(f.nm)}}"></div>
  </article>`;
}}
function show(f){{const a=(ANS[f.id]||{{}}).a||"";return (FM==="all"||(FM==="new"?f.new:!f.new))&&(FIL==="all"||(FIL==="none"?!a:a===FIL))}}
function render(){{
  const act=document.activeElement, keep=act&&act.classList.contains("note")?act.id:null, cur=keep?act.value:null;
  let h="";
  for(const [s,nm,wh] of SECS){{const L=ALL.filter(f=>f.c===s&&show(f)); if(!L.length)continue;
    const done=ALL.filter(f=>f.c===s&&(ANS[f.id]||{{}}).a).length, tot=ALL.filter(f=>f.c===s).length, nw=ALL.filter(f=>f.c===s&&f.new).length;
    h+=`<section class="sec"><h2>${{esc(nm)}}<span class="wh">${{esc(wh)}}${{nw&&s!=="x"?" · новых "+nw:""}}</span><small>${{done}} из ${{tot}}</small></h2><div class="grid">${{L.map(card).join("")}}</div></section>`;}}
  $("#list").innerHTML=h||'<p class="empty">Тут пусто — выбери другой фильтр.</p>';
  if(keep){{const el=document.getElementById(keep); if(el){{el.value=cur; el.focus();}}}}
  counts();
}}
function counts(){{
  const c={{yes:0,no:0,later:0}}; ALL.forEach(f=>{{const a=(ANS[f.id]||{{}}).a; if(c[a]!=null)c[a]++;}});
  const d=c.yes+c.no+c.later; $("#cnt").textContent=d+"/"+ALL.length; $("#bar").style.width=(100*d/ALL.length)+"%";
  $("#sum").textContent=`да ${{c.yes}} · потом ${{c.later}} · нет ${{c.no}}`;
}}
const Q={{}};
function save(id){{
  const body=Object.assign({{a:"",note:""}},ANS[id],{{t:Date.now()}});
  $("#save").textContent="сохраняю…";
  if(local||!db){{try{{localStorage.setItem("metki-pick",JSON.stringify(ANS))}}catch(e){{}} $("#save").textContent=local?"на этом устройстве":"сохранено"; return;}}
  Q[id]=(Q[id]||Promise.resolve()).then(()=>db.collection("metki").doc(id).set(body)).then(()=>{{$("#save").textContent="сохранено"}},e=>{{$("#save").textContent="не сохранилось";$("#warn").hidden=false;$("#warn").textContent="Ответ не сохранился: "+(e&&e.message||"нет связи")+". Нажми «Скопировать ответы» и пришли текст."}});
}}
$("#list").addEventListener("click",e=>{{
  const b=e.target.closest(".ans button"); if(!b)return;
  const id=b.closest(".card").dataset.id, v=b.dataset.v, o=ANS[id]||{{}};
  ANS[id]=Object.assign({{}},o,{{a:o.a===v?"":v}}); render(); save(id);
}});
let NT={{}};
$("#list").addEventListener("input",e=>{{
  if(!e.target.classList.contains("note"))return;
  const id=e.target.closest(".card").dataset.id; ANS[id]=Object.assign({{}},ANS[id],{{note:e.target.value}});
  clearTimeout(NT[id]); NT[id]=setTimeout(()=>{{delete NT[id];save(id)}},900);
}});
for(const [g,k,set] of [["#fa","f",v=>FIL=v],["#fm","m",v=>FM=v]])$(g).addEventListener("click",e=>{{
  const b=e.target.closest(".chip"); if(!b)return; set(b.dataset[k]);
  document.querySelectorAll(g+" .chip").forEach(x=>x.setAttribute("aria-pressed",x===b)); render();
}});
$("#copy").addEventListener("click",()=>{{
  const T={{yes:"ДА",no:"НЕТ",later:"ПОТОМ"}}, G=Object.fromEntries(SECS.map(s=>[s[0],s[1]]));
  const txt=ALL.filter(f=>(ANS[f.id]||{{}}).a||(ANS[f.id]||{{}}).note).map(f=>`${{T[(ANS[f.id]||{{}}).a]||"—"}} · ${{f.nm}} (${{G[f.c]}}${{f.new?", новая":""}})${{(ANS[f.id]||{{}}).note?" — "+ANS[f.id].note:""}}`).join("\\n")||"Пока нет ответов";
  const b=$("#copy"), done=()=>{{b.textContent="Скопировано ✓";setTimeout(()=>b.textContent="Скопировать ответы",1600)}};
  const fb=t=>{{const ta=document.createElement("textarea");ta.value=t;ta.style.cssText="position:fixed;left:-9999px";document.body.appendChild(ta);ta.select();try{{document.execCommand("copy");done()}}catch(e){{}}ta.remove();}};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,()=>fb(txt));else fb(txt);
}});
render();
(async()=>{{
  try{{db=window.claude&&window.claude.use?await window.claude.use("db"):null}}catch(e){{db=null}}
  if(!db){{local=true; try{{ANS=JSON.parse(localStorage.getItem("metki-pick")||"{{}}")||{{}}}}catch(e){{}}
    $("#warn").hidden=false; $("#warn").textContent="Ответы сохраняются только на этом устройстве. Когда закончишь — «Скопировать ответы» и пришли текстом."; render(); return;}}
  let got=false; const tm=setTimeout(()=>{{if(!got)$("#save").textContent="жду базу…"}},10000);
  db.collection("metki").onSnapshot(s=>{{
    if(!s.metadata.fromCache){{got=true;clearTimeout(tm);if($("#save").textContent==="жду базу…")$("#save").textContent="";}}
    const m={{}}; s.docs.forEach(d=>{{const x=d.data()||{{}}; m[d.id]={{a:x.a||"",note:x.note||""}};}});
    for(const k in ANS){{if(NT[k])m[k]=ANS[k];}}
    ANS=m; render();
  }},e=>{{clearTimeout(tm);$("#warn").hidden=false;$("#warn").textContent="База ответов недоступна. Нажми «Скопировать ответы» и пришли текстом.";}});
}})();
</script>
'''
out = os.path.join(R, 'дизайн/restless/metki-pick.html')
open(out, 'w', encoding='utf8').write(page)
from collections import Counter
print(out, len(ALL), 'новых', nn, dict(Counter(x['c'] for x in ALL)), dict(Counter(x['c'] for x in ALL if x['new'])))
