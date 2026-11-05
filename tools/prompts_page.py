# -*- coding: utf-8 -*-
# Промты одним красивым HTML-файлом (стиль приложения: камень+золото, aurora, Playfair/Golos).
# Данные: tools/bg-prompts.json (44 героя + фоны), русские имена — из pult.html.
# Выход: C:\Users\1f8t8\Downloads\промты.html — самодостаточный файл, открыл где угодно.
import json, re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = r'C:\Users\1f8t8\Downloads\промты.html'

data = json.load(open(os.path.join(HERE, 'bg-prompts.json'), encoding='utf-8'))
items = data['items']

# русские имена героев — из пульта (DATA там JSON)
pult = open(os.path.join(HERE, '..', 'pult.html'), encoding='utf-8').read()
RU = {m.group(1): m.group(3) for m in re.finditer(
    r'"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"ru":\s*"([^"]+)"', pult)}
if not RU:
    sys.exit('не нашёл русских имён в pult.html')

# 5 снятых по этому промту + victor по старым правилам
DONE5 = {'venator', 'rat-king', 'rem', 'grey-talon', 'doorman'}

heroes, bgs = [], []
for it in items:
    if it['kind'] == 'hero':
        heroes.append(dict(
            slug=it['hero'], title=it['title'], ru=RU.get(it['hero'], ''),
            ok=it['hero'] in DONE5, old=it['hero'] == 'victor',
            animate=it['animate'], alt=it.get('animate_alt', '')))
    else:
        bgs.append(dict(key=it['key'], kind=it['kind'], title=it['title'], shows=it.get('shows', []),
                        test=it.get('test', ''), what=it.get('what', ''), moves=it.get('moves', ''),
                        photo=it.get('photo', ''), animate=it.get('animate', ''), video=it.get('video', ''),
                        draft=it.get('draft', True)))
NEG = next(it['neg'] for it in items if it['kind'] == 'hero')
print(f'героев {len(heroes)}, фонов {len(bgs)}, ru-имён {len(RU)}')

DATA = dict(updated=data.get('updated'), neg=NEG, heroes=heroes, bgs=bgs)

HTML = r'''<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Промты героев и фонов — Языки по кино</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Golos+Text:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#0A0A0B;--stone:#161618;--stone2:#1D1D21;--line:#26262B;--ink:#F3F0E8;--muted:#A3A09A;
--dim:#6E6C68;--gold:#F5C451;--gold2:#FFD978;--green:#6FC24D;--red:#DC4B34}
*{box-sizing:border-box}
html{background:var(--bg)}
body{margin:0;color:var(--ink);font:15px/1.55 'Golos Text',system-ui,-apple-system,'Segoe UI',sans-serif;
background:
 radial-gradient(1100px 750px at 12% -6%, rgba(245,196,81,.11), transparent 60%),
 radial-gradient(950px 700px at 88% 106%, rgba(64,84,164,.11), transparent 62%),
 var(--bg);
 min-height:100vh}
body::after{content:'';position:fixed;inset:0;pointer-events:none;opacity:.15;z-index:50;
 background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E")}
.aurora{position:fixed;border-radius:50%;filter:blur(70px);pointer-events:none;z-index:0}
.a1{width:480px;height:480px;background:#6FC24D;opacity:.17;top:-140px;left:-120px;animation:au1 24s ease-in-out infinite alternate}
.a2{width:430px;height:430px;background:#DC4B34;opacity:.11;top:32%;right:-150px;animation:au2 30s ease-in-out infinite alternate}
.a3{width:460px;height:460px;background:#F2C35B;opacity:.10;bottom:-160px;left:16%;animation:au3 26s ease-in-out infinite alternate}
@keyframes au1{to{transform:translate(90px,60px) scale(1.15)}}
@keyframes au2{to{transform:translate(-70px,-90px) scale(1.1)}}
@keyframes au3{to{transform:translate(60px,-70px) scale(1.18)}}
.wrap{position:relative;z-index:1;max-width:1180px;margin:0 auto;padding:0 14px 60px}
header{padding:26px 0 14px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:14px}
h1{font:600 30px/1.15 'Playfair Display',Georgia,serif;margin:0 0 6px;letter-spacing:.01em}
h1 em{font-style:normal;color:var(--gold2)}
.sub{color:var(--muted);font-size:13.5px}
.sub b{color:var(--gold2)}
.lbl{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin:0 0 8px}
.lbl:after{content:'';display:block;height:1px;background:linear-gradient(90deg,rgba(245,196,81,.55),transparent 70%);margin-top:6px}
.bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;position:sticky;top:0;z-index:20;
 background:linear-gradient(var(--bg) 78%,rgba(10,10,11,0));padding:10px 0 12px}
#q{flex:1;min-width:220px;background:var(--stone);border:1px solid var(--line);border-radius:12px;color:var(--ink);
 padding:12px 14px;font:15px 'Golos Text',sans-serif;box-shadow:inset 0 2px 6px rgba(0,0,0,.45)}
#q:focus{outline:none;border-color:rgba(245,196,81,.45)}
#tabs{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch;
 scrollbar-width:none;-ms-overflow-style:none}
#tabs::-webkit-scrollbar{display:none}
.tab{background:var(--stone);border:1px solid var(--line);color:var(--muted);border-radius:999px;padding:9px 16px;
 font:500 13.5px 'Golos Text',sans-serif;cursor:pointer;white-space:nowrap}
.tab.on{color:var(--gold2);border-color:rgba(245,196,81,.5);background:#1E1B12;
 box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 0 18px rgba(245,196,81,.08)}
.grid{display:grid;grid-template-columns:1fr;gap:16px;padding-top:8px}
@media(min-width:700px){.grid{grid-template-columns:1fr 1fr}}
@media(min-width:1060px){.grid{grid-template-columns:1fr 1fr 1fr}}
.card{background:linear-gradient(180deg,#191A1D,#131315);border:1px solid var(--line);border-radius:16px;padding:16px;
 box-shadow:inset 0 1px 0 rgba(255,255,255,.05),inset 0 -1px 0 rgba(0,0,0,.4),0 12px 34px rgba(0,0,0,.35);
 transition:border-color .25s}
.card.done{border-color:rgba(111,194,77,.55)}
.card.done h3:after{content:' ✓';color:var(--green);font-size:.8em}
.hart{display:block;width:100%;max-width:300px;height:auto;border-radius:12px;margin:2px auto 12px;
 background:radial-gradient(circle at 50% 30%,#232327,#131315);border:1px solid rgba(255,255,255,.07);
 box-shadow:0 8px 26px rgba(0,0,0,.45)}
h3{font:600 21px/1.25 'Playfair Display',Georgia,serif;margin:0 0 3px;overflow-wrap:anywhere}
h3 .en{color:var(--ink)} h3 .q{color:var(--dim);font-size:.62em;font-weight:500}
.ru{color:var(--muted);font-size:13.5px;margin:0 0 8px}
.badge{display:inline-block;font-size:11px;letter-spacing:.06em;border-radius:999px;padding:3px 10px;margin:2px 6px 10px 0;
 border:1px solid var(--line);color:var(--dim)}
.badge.ok{color:var(--green);border-color:rgba(111,194,77,.5)}
.badge.gold{color:var(--gold2);border-color:rgba(245,196,81,.5)}
.badge.test{color:#7FB4E8;border-color:rgba(127,180,232,.45)}
.fld{font-size:14px;margin:7px 0;overflow-wrap:anywhere}
.fld b{color:var(--gold2);font-weight:600}
.note{background:#241C10;border:1px solid rgba(245,196,81,.35);border-radius:10px;padding:9px 12px;font-size:13px;
 margin:10px 0;color:#FFD28A}
.pts{margin-top:10px;display:flex;flex-direction:column;gap:8px}
.btnrow{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.btn{background:linear-gradient(180deg,#82D75F,#5FA83F);color:#0C130A;border:none;border-radius:11px;
 padding:11px 16px;font:700 13px/1 'Golos Text',sans-serif;text-transform:uppercase;letter-spacing:.05em;cursor:pointer;
 min-height:44px;box-shadow:0 2px 0 rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.3);transition:transform .12s}
.btn:active{transform:translateY(1px)}
.btn.ghost{background:linear-gradient(180deg,#242428,#1A1A1E);color:var(--ink);border:1px solid var(--line);
 box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}
.btn.okb{background:linear-gradient(180deg,#82D75F,#5FA83F)}
.btn.tgl{background:none;box-shadow:none;border:1px dashed rgba(245,196,81,.4);color:var(--gold2);text-transform:none;font-weight:500}
.ptext{display:none;background:rgba(0,0,0,.35);border:1px solid var(--line);border-radius:10px;padding:11px 12px;
 font-size:12.5px;line-height:1.5;color:var(--muted);white-space:pre-wrap;max-height:170px;overflow:auto}
.ptext.open{display:block}
.links{font-size:13px;margin-top:10px;display:flex;gap:16px;flex-wrap:wrap}
.links a{color:#8FB8E8;text-decoration:none;border-bottom:1px dotted rgba(143,184,232,.4)}
.donerow{display:flex;align-items:center;gap:8px;margin-top:12px;color:var(--muted);font-size:14px;cursor:pointer;user-select:none}
.donerow input{width:18px;height:18px;accent-color:var(--green)}
.rules{max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:16px}
.rules h2{font:600 20px/1.2 'Playfair Display',Georgia,serif;margin:0 0 10px;color:var(--gold2)}
.rules li{margin:9px 0}
.rules b{color:var(--gold2);font-weight:600}
#toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);background:#221E12;
 border:1px solid rgba(245,196,81,.5);color:var(--gold2);padding:11px 20px;border-radius:12px;font-size:14px;
 opacity:0;pointer-events:none;transition:.25s;z-index:99;box-shadow:0 10px 30px rgba(0,0,0,.5)}
#toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
footer{color:var(--dim);font-size:12.5px;text-align:center;margin-top:26px}
</style></head><body>
<div class="aurora a1"></div><div class="aurora a2"></div><div class="aurora a3"></div>
<div class="wrap">
<header>
 <div class="lbl">Языки по кино · Deadlock</div>
 <h1>Промты <em>героев и фонов</em></h1>
 <div class="sub" id="subline"></div>
</header>
<div class="bar"><input id="q" placeholder="Поиск: герой, фильм…"><div id="tabs"></div></div>
<div class="grid" id="grid"></div>
<footer id="ftr"></footer>
</div>
<div id="toast"></div>
<script>
var D = window.DATA = __DATA__;
var tab = 'hero', LS = 'bgp-done-v1', done = {};
try { done = JSON.parse(localStorage.getItem(LS) || '{}') || {}; } catch(e){ done = {}; }
function saveDone(){ try{ localStorage.setItem(LS, JSON.stringify(done)); }catch(e){} }
function isDone(k){ return !!done[k]; }
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function toast(msg){ var t = $('toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 1400); }
function copyText(txt, btn){
  if (!txt) { toast('Пусто'); return; }
  function ok(){ toast('Скопировано ✓'); if (btn){ var o = btn.getAttribute('data-l') || btn.textContent;
    btn.classList.add('okb'); btn.textContent = 'Скопировано ✓';
    setTimeout(function(){ btn.classList.remove('okb'); btn.textContent = o; }, 1300); } }
  function fallback(){ var ta = document.createElement('textarea'); ta.value = txt;
    ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); ok(); } catch(e){ toast('Не вышло — выдели текст руками'); }
    document.body.removeChild(ta); }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, fallback);
  else fallback();
}
function cdnURL(title, file){
  return 'https://cdn.deadlock.wiki/' + encodeURIComponent(title).replace(/%20/g, '_') + file;
}
document.addEventListener('error', function(ev){
  var el = ev.target;
  if (el && el.tagName === 'IMG' && el.classList.contains('hart')) {
    var rest = (el.dataset.fb || '').split('|').filter(Boolean);
    if (rest.length) { el.src = rest[0]; el.dataset.fb = rest.slice(1).join('|'); }
    else el.style.display = 'none';
  }
}, true);
function heroImg(h){
  var c = cdnURL(h.title, '_card.png'), v = cdnURL(h.title, '_vertical.png'), p = cdnURL(h.title, '.png');
  return '<img class="hart" loading="lazy" alt="' + esc(h.title) + '" src="' + c + '" data-fb="' + v + '|' + p + '">';
}
function copyBtn(text, label, ghost){
  return '<button class="btn' + (ghost ? ' ghost' : '') + '" data-l="' + esc(label) + '" data-txt="' + esc(text) + '">' + esc(label) + '</button>';
}
function tglBtn(i){ return '<button class="btn tgl" data-tgl="' + i + '">текст ▾</button>'; }
function doneRow(key){
  return '<label class="donerow"><input type="checkbox" data-key="' + esc(key) + '"' +
    (isDone(key) ? ' checked' : '') + '> Готово</label>';
}
var PT = 0;
function ptext(txt){
  PT++;
  return '<div class="ptext" id="pt' + PT + '">' + esc(txt) + '</div>';
}
function heroCard(h){
  var key = 'hero:deadlock:' + h.slug;
  var st = h.ok ? '<span class="badge ok">готов — снят по этому промту</span>'
        : h.old ? '<span class="badge ok">готов (по старым правилам)</span>'
        : '<span class="badge gold">переписан 27.10 · полный + короткий</span>';
  var s = '<div class="card' + (isDone(key) ? ' done' : '') + '" data-key="' + esc(key) + '">';
  s += heroImg(h);
  s += '<h3><span class="en">' + esc(h.title) + '</span></h3><div class="ru">' + esc(h.ru) + '</div>';
  s += '<div>' + st + '</div><div class="pts">';
  var i1 = PT + 1; s += '<div class="btnrow">' + copyBtn(h.animate, 'Полный') + tglBtn(i1) + '</div>' + ptext(h.animate);
  if (h.alt) { var i2 = PT; s += '<div class="btnrow">' + copyBtn(h.alt, 'Короткий · если отказал', 1) + tglBtn(i2) + '</div>' + ptext(h.alt); }
  var i3 = PT; s += '<div class="btnrow">' + copyBtn(D.neg, 'Негатив' + (h.slug === 'rem' ? ' (обязателен!)' : ''), 1) + tglBtn(i3) + '</div>' + ptext(D.neg);
  s += '</div>';
  s += '<div class="links">' +
    '<a href="' + cdnURL(h.title, '_Render.png') + '" target="_blank" rel="noopener">арт (вики, оригинал)</a></div>';
  s += doneRow(key) + '</div>';
  return s;
}
function bgCard(b){
  var s = '<div class="card' + (isDone(b.key) ? ' done' : '') + '" data-key="' + esc(b.key) + '">';
  s += '<h3><span class="en">' + esc(b.title) + '</span></h3>';
  var bd = '';
  if (b.test) bd += '<span class="badge test">тест: ' + esc(b.test) + '</span>';
  if (b.draft) bd += '<span class="badge">черновик</span>'; else bd += '<span class="badge ok">готов</span>';
  s += '<div>' + bd + '</div>';
  if (b.what) s += '<div class="fld"><b>Что в кадре:</b> ' + esc(b.what) + '</div>';
  if (b.moves) s += '<div class="fld"><b>Что движется:</b> ' + esc(b.moves) + '</div>';
  s += '<div class="pts">';
  if (b.photo) { var a1 = PT + 1; s += '<div class="btnrow">' + copyBtn(b.photo, 'Фото 9:16') + tglBtn(a1) + '</div>' + ptext(b.photo); }
  if (b.animate) { var a2 = PT + 1; s += '<div class="btnrow">' + copyBtn(b.animate, 'Оживление') + tglBtn(a2) + '</div>' + ptext(b.animate); }
  if (b.video) { var a3 = PT + 1; s += '<div class="btnrow">' + copyBtn(b.video, 'Видео · сразу текстом', 1) + tglBtn(a3) + '</div>' + ptext(b.video); }
  s += '</div>' + doneRow(b.key) + '</div>';
  return s;
}
function rulesPage(){
  var s = '<div class="rules">';
  s += '<div class="card"><h2>Как делать (коротко)</h2><ol>' +
    '<li><b>Фото:</b> Gemini или Google Flow (labs.google/flow), формат <b>9:16</b>, 3–4 варианта — выбери один, где всё на месте и нет пластмассы. У героев фото не генерим — берём арт с вики (кнопка «арт» на карточке).</li>' +
    '<li><b>⚠ Петля — только через Flow «Кадры в видео»</b>, где первый И последний кадр — одна и та же картинка. Gemini «текст в видео» последний кадр не вернёт (Талон развернулся в камеру и остался так) — такой ролик в петлю не склеить.</li>' +
    '<li><b>Оживить:</b> Flow → «Кадры в видео»: первый кадр = последний кадр = это фото (у героя — арт), 8 секунд. Промт оживления — кнопкой с карточки. Сервис отказал на полном — жми «Короткий».</li>' +
    '<li>Ролик скинуть мне (ZAI) — я склею петлю, залью и отмечу «залит».</li></ol></div>';
  s += '<div class="card"><h2>Правило петли (главное)</h2><ul>' +
    '<li>Движение идёт <b>полным кругом</b>: последний кадр = первому. Никакого ping-pong (туда-обратно) — из-за него дёргается Крысиный король.</li>' +
    '<li><b>Герой немного двигается — НОРМА и желательна</b>: дыхание, покачивание, поворот головы, ткань. Не бороться с микродвижкой.</li>' +
    '<li>Ломают генерацию только: <b>перемещение по кадру, резкие крупные действия, кисти крупным планом</b>.</li>' +
    '<li>Слова-настроения не должны противоречить действию: «sleepy» валит героя в сон, даже если написать «staying awake».</li></ul></div>';
  s += '<div class="card"><h2>Негатив (общий)</h2><div class="fld">Вставлять в поле Negative, если сервис позволяет.</div>' +
    '<div class="btnrow">' + copyBtn(D.neg, 'Скопировать негатив') + '</div>' + ptext(D.neg) + '</div>';
  s += '<div class="card"><h2>Если вышло плохо</h2><ul>' +
    '<li>Не дописывай промт — скинь кадр и скажи одним словом, что не так (пластмасса, лишнее, не то место, кривые предметы).</li>' +
    '<li>Нормальный промт — целым куском, без правок на ходу. Отметил «Готово» — карточка подсветится.</li></ul></div>';
  s += '</div>';
  return s;
}
var TABS = [['hero','Герои'],['film','Фильмы'],['season','Сезоны'],['person','Интервью'],['moment','Момент'],['rules','Правила']];
function render(){
  var q = $('q').value.trim().toLowerCase();
  $('tabs').innerHTML = TABS.map(function(t){
    var n = '';
    if (t[0] === 'hero') n = ' ' + D.heroes.length;
    else if (t[0] !== 'rules') n = ' ' + D.bgs.filter(function(b){ return b.kind === t[0]; }).length;
    return '<button class="tab' + (tab === t[0] ? ' on' : '') + '" data-tab="' + t[0] + '">' + t[1] + n + '</button>';
  }).join('');
  if (tab === 'rules') { $('grid').innerHTML = rulesPage(); return; }
  var list = tab === 'hero' ? D.heroes : D.bgs.filter(function(b){ return b.kind === tab; });
  if (q) list = list.filter(function(x){
    var hay = (x.title || '') + ' ' + (x.ru || '') + ' ' + (x.slug || '') + ' ' + ((x.shows || []).join(' '));
    return hay.toLowerCase().indexOf(q) >= 0;
  });
  var out = list.map(function(x){ return x.slug !== undefined ? heroCard(x) : bgCard(x); });
  if (!out.length) out = ['<div class="card">Ничего не нашлось.</div>'];
  $('grid').innerHTML = out.join('');
}
function counters(){
  var all = D.heroes.map(function(h){ return 'hero:deadlock:' + h.slug; })
    .concat(D.bgs.map(function(b){ return b.key; }));
  var dn = all.filter(isDone).length;
  $('subline').innerHTML = 'Готово: <b>' + dn + '</b> из <b>' + all.length + '</b>' +
    (D.updated ? ' · промты: ' + esc(D.updated) : '') + ' · галочки общие с пультом';
}
document.addEventListener('click', function(ev){
  var tb = ev.target.closest ? ev.target.closest('[data-tab]') : null;
  if (tb) { tab = tb.getAttribute('data-tab'); render(); window.scrollTo(0, 0); return; }
  var tg = ev.target.closest ? ev.target.closest('[data-tgl]') : null;
  if (tg) { var p = $('pt' + tg.getAttribute('data-tgl'));
    if (p) { p.classList.toggle('open'); tg.textContent = p.classList.contains('open') ? 'текст ▴' : 'текст ▾'; }
    return; }
  var btn = ev.target.closest ? ev.target.closest('[data-txt]') : null;
  if (btn) { copyText(btn.getAttribute('data-txt'), btn); return; }
});
document.addEventListener('change', function(ev){
  var inp = ev.target;
  if (inp.getAttribute && inp.getAttribute('data-key') && inp.type === 'checkbox') {
    var key = inp.getAttribute('data-key');
    if (inp.checked) done[key] = 1; else delete done[key];
    saveDone();
    var cards = document.querySelectorAll('.card[data-key="' + key + '"]');
    Array.prototype.forEach.call(cards, function(c){ c.classList.toggle('done', inp.checked); });
    counters();
  }
});
$('q').addEventListener('input', render);
$('ftr').innerHTML = 'Фото героев — CDN deadlock.wiki · файл самодостаточный: opened anywhere · ' + esc(D.updated || '');
render(); counters();
</script></body></html>
'''

html = HTML.replace('__DATA__', json.dumps(DATA, ensure_ascii=False))
open(OUT, 'w', encoding='utf-8').write(html)
print('готово:', OUT, f'{len(html)//1024} КБ')
