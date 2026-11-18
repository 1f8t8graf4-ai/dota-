# Страница «три текста главы 3 + разбор Gemini» и её копия для следующего Claude.
#   python3 shorts/глава3/page.py  →  shorts/глава3/тексты-18.11.html и .md
import html, json, re, importlib.util, pathlib

HERE = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('d', HERE / 'data.py')
d = importlib.util.module_from_spec(spec); spec.loader.exec_module(d)
E = lambda s: html.escape(s, quote=True)

def words(t): return len(re.findall(r"[А-Яа-яЁёA-Za-z0-9-]+", ' '.join(t['lines'])))
def mmss(s): return f"{s // 60}:{s % 60:02d}"
for t in d.TEXTS:
    t['w'] = words(t); t['s'] = round(t['w'] / d.WPS); t['dur'] = mmss(t['s'])

SHORT = {'t1': 'ковбой', 't2': 'рекламщик', 't3': 'три жизни'}
BOARD = [  # глава фильма: год, имя, состояние, куда идёт
    ('1979', 'Боб', 'готово', 'TikTok · часть 1'),
    ('2020', 'Лёд', 'готово', 'TikTok · часть 2'),
    ('1924', 'Мальборо', 'сейчас', 'только в фильме'),
    ('2014', 'Айкос', 'дальше', 'TikTok · часть 3'),
    ('2022', 'Шайбы', 'дальше', 'TikTok · часть 4'),
    ('финал', 'Переворот доски', 'дальше', 'только в фильме'),
]

CSS = r"""
/* Лист диктора: сверху доска глав фильма и совет, ниже переключатель «Текст 1 · 2 · 3 · Gemini»,
   текст построчно с номерами строк (по ним удобно писать правки), сбоку на ПК — плюсы, минусы, факты. */
:root{
  --ground:#F1EFEE; --sheet:#FFFFFF; --ink:#1C1919; --muted:#6C6563; --line:#DCD6D3;
  --red:#B3141C; --kraft:#E6D6B8; --kraft-ink:#3B2F1E; --marker:rgba(255,206,48,.6); --ok:#1D7A4C;
  --f-disp:"Oswald","Arial Narrow","Roboto Condensed",sans-serif;
  --f-body:"Golos Text",-apple-system,"Segoe UI",Roboto,sans-serif;
  --f-mono:"IBM Plex Mono",ui-monospace,"SF Mono",Menlo,monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --ground:#151313; --sheet:#1F1C1B; --ink:#EEE9E6; --muted:#A39A96; --line:#36312F;
  --red:#EA5359; --kraft:#3B3226; --kraft-ink:#EADCC4; --marker:rgba(255,206,48,.3); --ok:#55C994; color-scheme:dark}}
:root[data-theme="dark"]{
  --ground:#151313; --sheet:#1F1C1B; --ink:#EEE9E6; --muted:#A39A96; --line:#36312F;
  --red:#EA5359; --kraft:#3B3226; --kraft-ink:#EADCC4; --marker:rgba(255,206,48,.3); --ok:#55C994; color-scheme:dark}

*{box-sizing:border-box}
body{background:var(--ground);color:var(--ink);font:16px/1.5 var(--f-body);
  padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:20px 56px}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--ground)}
.wrap{max-width:1100px;margin:0 auto;display:flex;flex-direction:column;gap:28px}
a{color:inherit;text-decoration-color:var(--muted);text-underline-offset:2px}
a:hover{text-decoration-color:var(--red)}
:focus-visible{outline:2px solid var(--red);outline-offset:2px;border-radius:4px}
.eb{font:500 12px/1.3 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:0}
h1,h2,h3{text-wrap:balance;margin:0}
h1{font:600 clamp(40px,9vw,68px)/1 var(--f-disp);letter-spacing:.01em;text-transform:uppercase}
h1 .yr{color:var(--red)}
h2{font:600 clamp(26px,5vw,34px)/1.1 var(--f-disp);letter-spacing:.01em}
h3{font:600 13px/1.3 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.lede{margin:0;max-width:60ch;font-size:17px}
header.top{display:flex;flex-direction:column;gap:12px}

/* доска глав */
.board{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;margin:0;padding:0;list-style:none}
.bc{background:var(--kraft);color:var(--kraft-ink);border-radius:3px;padding:10px 10px 9px;display:flex;flex-direction:column;gap:2px;min-width:0;position:relative}
.bc b{font:600 22px/1 var(--f-disp)}
.bc span{font-size:13px;line-height:1.25}
.bc small{font:500 10.5px/1.3 var(--f-mono);letter-spacing:.04em;text-transform:uppercase;opacity:.75;margin-top:4px}
.bc.film small{color:var(--red);opacity:1}
.bc.now{outline:2px solid var(--red);outline-offset:-2px}
.bc i{font:500 10.5px/1.2 var(--f-mono);font-style:normal;text-transform:uppercase;letter-spacing:.05em;opacity:.75;margin-bottom:4px}
.bc.now i{opacity:1}
.bc.now i{color:var(--red)}
@media (max-width:720px){.board{grid-template-columns:repeat(3,minmax(0,1fr))}}

/* совет */
.tip{background:var(--sheet);border:1px solid var(--line);border-radius:6px;padding:18px 18px 16px;display:grid;gap:10px}
.tip h2{font-size:24px}
.tip ul{margin:0;padding-left:20px;display:grid;gap:6px;max-width:70ch}
.chosen-line{margin:0;font-weight:600;color:var(--ok)}

/* вкладки */
.tabs{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--ground);padding-block:8px;
  display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
.tab{appearance:none;border:1px solid var(--line);background:var(--sheet);color:var(--ink);border-radius:6px;
  padding:8px 6px;font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;min-width:0}
.tab b{font:600 15px/1.2 var(--f-body);white-space:nowrap}
.tab span{font-size:12.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.tab[aria-selected="true"]{border-color:var(--ink);box-shadow:inset 0 -3px 0 var(--red)}
.tab .ck{display:none;color:var(--ok)}
.tab.chosen .ck{display:inline}

/* панель текста */
.panel{background:var(--sheet);border:1px solid var(--line);border-radius:6px;padding:22px 18px 22px}
.phead{display:grid;gap:10px;margin-bottom:22px;max-width:70ch}
.idea{margin:0;font-size:17px}
.acts{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.btn{appearance:none;font:600 15px/1 var(--f-body);border-radius:6px;padding:12px 16px;cursor:pointer;border:1px solid var(--ink);background:transparent;color:var(--ink)}
.btn.pick{background:var(--red);border-color:var(--red);color:#fff}
.btn.pick[aria-pressed="true"]{background:transparent;color:var(--ok);border-color:var(--ok)}
.msg{font-size:14px;color:var(--muted)}
p.msg{margin:0}
p.msg:empty{display:none}
.pbody{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:36px;align-items:start}
@media (max-width:860px){.pbody{grid-template-columns:minmax(0,1fr);gap:26px}}
.script{list-style:none;margin:0;padding:0;display:grid;gap:12px;max-width:64ch;counter-reset:l}
.script li{display:grid;grid-template-columns:2.2em minmax(0,1fr);gap:4px 10px;font-size:17.5px;line-height:1.55}
.script .n{font:500 13px/1.9 var(--f-mono);color:var(--muted);text-align:right;font-variant-numeric:tabular-nums}
.script mark{background:linear-gradient(transparent 52%,var(--marker) 52%);color:inherit;padding:0 1px}
.script .tag{grid-column:2;font:500 11px/1 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--red)}
aside{display:grid;gap:22px;min-width:0}
.pm{display:grid;gap:8px}
.pm ul{margin:0;padding:0;list-style:none;display:grid;gap:7px}
.pm li{display:grid;grid-template-columns:1.1em minmax(0,1fr);gap:6px;font-size:15px}
.pm li::before{font:600 15px/1.45 var(--f-mono)}
.plus li::before{content:"+";color:var(--ok)}
.minus li::before{content:"−";color:var(--red)}
details{border-top:1px solid var(--line);padding-top:12px}
summary{cursor:pointer;font:600 13px/1.3 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.facts ol{margin:12px 0 0;padding-left:20px;display:grid;gap:9px;font-size:14.5px}
.facts .src{display:block;font-size:13px;color:var(--muted)}
.note{display:grid;gap:6px}
.note label{font:600 13px/1.3 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
textarea{width:100%;min-height:96px;resize:vertical;font:15px/1.45 var(--f-body);color:var(--ink);background:var(--ground);
  border:1px solid var(--line);border-radius:6px;padding:10px 12px}
textarea:focus-visible{outline:2px solid var(--red);outline-offset:0}
.st{font-size:13px;color:var(--muted);min-height:1.2em}

/* Gemini */
.gem{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
@media (max-width:960px){.gem{grid-template-columns:minmax(0,1fr)}}
.g{border:1px solid var(--line);border-radius:6px;padding:16px;display:flex;flex-direction:column;gap:10px;min-width:0}
.g .gid{font:600 28px/1 var(--f-disp);color:var(--red)}
.g h3{color:var(--ink);font:600 18px/1.25 var(--f-body);letter-spacing:0;text-transform:none}
.g .meta{font:500 12px/1 var(--f-mono);color:var(--muted)}
.g p{margin:0;font-size:15px}
.g h4{margin:4px 0 0;font:600 12px/1.3 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--red)}
.g ul{margin:0;padding-left:18px;display:grid;gap:6px;font-size:14.5px}
.g .gnote{color:var(--muted);font-size:14px}

/* что дальше */
.next{display:grid;gap:12px}
.next ol{margin:0;padding-left:22px;display:grid;gap:8px;max-width:72ch}
footer{color:var(--muted);font-size:13px}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
"""

def li_script(t):
    out = []
    for i, l in enumerate(t['lines']):
        if i in t['key']:
            out.append(f'<li class="key"><span class="n">{i+1}</span><span><mark>{E(l)}</mark></span><span class="tag">сильное место</span></li>')
        else:
            out.append(f'<li><span class="n">{i+1}</span><span>{E(l)}</span></li>')
    return '\n'.join(out)

def facts(t):
    rows = []
    for f, ks in t['facts']:
        src = ' · '.join(f'<a href="{E(d.SRC[k][1])}" target="_blank" rel="noopener">{E(d.SRC[k][0])}</a>' for k in ks)
        rows.append(f'<li>{E(f)}<span class="src">{src}</span></li>')
    return '\n'.join(rows)

def panel(t):
    pl = ''.join(f'<li>{E(x)}</li>' for x in t['plus'])
    mi = ''.join(f'<li>{E(x)}</li>' for x in t['minus'])
    return f'''<section class="panel" id="p-{t['id']}" role="tabpanel" aria-labelledby="tab-{t['id']}">
<div class="phead">
<p class="eb">Текст {t['n']} · ≈ {t['dur']} · {t['w']} слов</p>
<h2>{E(t['name'])}</h2>
<p class="idea">{E(t['idea'])}</p>
<div class="acts">
<button class="btn pick" type="button" data-pick="{t['id']}" aria-pressed="false" hidden>Беру этот текст</button>
<button class="btn" type="button" data-copy="{t['id']}">Скопировать текст</button>
<span class="msg" aria-live="polite"></span>
</div>
</div>
<div class="pbody">
<ol class="script">
{li_script(t)}
</ol>
<aside>
<div class="pm plus"><h3>Плюсы</h3><ul>{pl}</ul></div>
<div class="pm minus"><h3>Минусы</h3><ul>{mi}</ul></div>
<details class="facts"><summary>Факты и источники · {len(t['facts'])}</summary><ol>
{facts(t)}
</ol></details>
<div class="note" hidden><label for="n-{t['id']}">Правки к тексту {t['n']}</label>
<textarea id="n-{t['id']}" data-note="{t['id']}" placeholder="Например: строка 5 — проще; концовку взять из текста 2"></textarea>
<span class="st" aria-live="polite"></span></div>
</aside>
</div>
</section>'''

def gem_panel():
    cards = []
    for g in d.GEM:
        bad = ''.join(f'<li>{E(x)}</li>' for x in g['bad'])
        cards.append(f'''<article class="g">
<span class="gid">{E(g['n'])}</span>
<h3>{E(g['name'])}</h3>
<span class="meta">{g['words']} слов · {g['dur']}</span>
<p><b>Что хорошего.</b> {E(g['take'])}</p>
<h4>Ошибки в фактах</h4>
<ul>{bad}</ul>
<p class="gnote">{E(g['note'])}</p>
</article>''')
    return f'''<section class="panel" id="p-gemini" role="tabpanel" aria-labelledby="tab-gemini" hidden>
<div class="phead">
<p class="eb">Gemini · ТЗ от 17.11 · три сценария</p>
<h2>Что у Gemini</h2>
<p class="idea">Все три сценария начинаются с картинки 1924 года, которую ты не берёшь, и не продолжают последнюю фразу «Льда». Удачные мысли я забрал в свои тексты, ошибки — ниже.</p>
</div>
<div class="gem">
{''.join(cards)}
</div>
<div class="note" hidden style="margin-top:22px"><label for="n-g">Что взять у Gemini</label>
<textarea id="n-g" data-note="g" placeholder="Например: из 3-Б — мостик «продавать страх под видом безопасности»"></textarea>
<span class="st" aria-live="polite"></span></div>
</section>'''

def board():
    out = []
    for y, n, st, where in BOARD:
        cls = 'bc' + (' now' if st == 'сейчас' else '') + (' film' if where.startswith('только') else '')
        mark = f'<i>{st}</i>'
        out.append(f'<li class="{cls}">{mark}<b>{E(y)}</b><span>{E(n)}</span><small>{E(where)}</small></li>')
    return '\n'.join(out)

tabs = ''.join(
    f'<button class="tab" type="button" role="tab" id="tab-{t["id"]}" data-p="{t["id"]}" aria-controls="p-{t["id"]}" aria-selected="false">'
    f'<b>Текст {t["n"]} <span class="ck">✓</span></b><span>{SHORT[t["id"]]}</span></button>' for t in d.TEXTS
) + '<button class="tab" type="button" role="tab" id="tab-gemini" data-p="gemini" aria-controls="p-gemini" aria-selected="false"><b>Gemini</b><span>3 сценария</span></button>'

TX = {t['id']: t['lines'] for t in d.TEXTS}
NAMES = {t['id']: f"текст {t['n']} · «{t['name']}»" for t in d.TEXTS}

JS = r"""
const TX = __TX__, NAMES = __NAMES__;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const IDS = ['t1', 't2', 't3', 'gemini'];
const tabs = $$('[role="tab"]');
function show(id, focus) {
  tabs.forEach(t => { const on = t.dataset.p === id; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
  $$('.panel').forEach(p => { p.hidden = p.id !== 'p-' + id; });
}
function go(id, focus) {
  show(id, focus);
  try { history.replaceState(null, '', '#' + id); } catch (e) { try { location.hash = id; } catch (e2) {} }
}
function fromHash() { const h = location.hash.slice(1); show(IDS.includes(h) ? h : 't1'); }
tabs.forEach((t, i) => {
  t.addEventListener('click', () => go(t.dataset.p));
  t.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault(); const j = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length; go(tabs[j].dataset.p, true);
  });
});
addEventListener('hashchange', fromHash); fromHash();
$$('[data-goto]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); go(a.dataset.goto); $('#tabs').scrollIntoView({ block: 'start' }); }));

function say(el, text) { if (!el) return; el.textContent = text; clearTimeout(el._t); el._t = setTimeout(() => { el.textContent = ''; }, 4000); }
$$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
  const id = b.dataset.copy, msg = $('.msg', b.parentElement), text = TX[id].join('\n');
  try { await navigator.clipboard.writeText(text); say(msg, 'Скопировано'); }
  catch (e) {
    const r = document.createRange(); r.selectNodeContents($('#p-' + id + ' .script'));
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    say(msg, 'Текст выделен — скопируй вручную');
  }
}));

// Выбор текста и правки — в базе страницы (их читает Claude). Без базы страница просто читается.
(async () => {
  let db = null;
  try { db = window.claude && window.claude.use ? await window.claude.use('db') : null; } catch (e) { db = null; }
  if (!db) return;
  const S = { pick: '', ready: false, ro: false }, last = {}, busy = {}, timers = {}, chain = {};
  const line = $('#chosen');
  const readOnly = () => { S.ro = true; $$('[data-pick]').forEach(b => { b.hidden = true; }); $$('.note').forEach(n => { n.hidden = true; }); };
  function renderPick() {
    $$('[data-pick]').forEach(b => {
      const on = S.pick === b.dataset.pick; b.setAttribute('aria-pressed', on);
      b.textContent = on ? '✓ Выбран · нажми, чтобы снять' : 'Беру этот текст';
    });
    tabs.forEach(t => t.classList.toggle('chosen', t.dataset.p === S.pick));
    line.hidden = !S.pick; line.textContent = S.pick ? 'Ты выбрал ' + NAMES[S.pick] : '';
  }
  $$('[data-pick]').forEach(b => { b.hidden = false; });
  $$('.note').forEach(n => { n.hidden = false; });
  const tm = setTimeout(() => { if (!S.ready) say($('#dbmsg'), 'Отметки пока не загрузились. Выбор можно написать в чат.'); }, 10000);
  db.collection('pick').onSnapshot(snap => {
    const doc = snap.docs.find(x => x.id === 'choice');
    S.pick = doc && doc.exists ? String((doc.data() || {}).t || '') : '';
    if (!TX[S.pick]) S.pick = '';
    renderPick();
    if (!snap.metadata.fromCache) { S.ready = true; clearTimeout(tm); }
  }, () => { clearTimeout(tm); });
  db.collection('notes').onSnapshot(snap => {
    snap.docs.forEach(x => {
      const ta = $('[data-note="' + x.id + '"]'); if (!ta) return;
      const v = String((x.data() || {}).text || '');
      last[x.id] = v;
      if (document.activeElement !== ta && !busy[x.id]) ta.value = v;
    });
  }, () => {});
  $$('[data-pick]').forEach(b => b.addEventListener('click', async () => {
    if (S.ro) return;
    const prev = S.pick, next = S.pick === b.dataset.pick ? '' : b.dataset.pick;
    S.pick = next; renderPick();
    try { await db.doc('pick/choice').set({ t: next, at: new Date().toISOString() }); say($('.msg', b.parentElement), next ? 'Сохранено' : 'Выбор снят'); }
    catch (e) {
      S.pick = prev; renderPick();
      if (e && e.code === 'invalid_argument') readOnly();
      say($('.msg', b.parentElement), 'Не сохранилось. Напиши выбор в чат.');
    }
  }));
  const st = id => $('.st', $('[data-note="' + id + '"]').parentElement);
  function flush(id) {
    clearTimeout(timers[id]);
    const ta = $('[data-note="' + id + '"]'), text = ta.value;
    if ((last[id] || '') === text) { busy[id] = false; return; }
    chain[id] = (chain[id] || Promise.resolve())
      .then(() => db.doc('notes/' + id).set({ text, at: new Date().toISOString() }))
      .then(() => { last[id] = text; busy[id] = false; st(id).textContent = 'Сохранено'; })
      .catch(e => { busy[id] = false; st(id).textContent = 'Не сохранилось. Скопируй текст и пришли в чат.'; if (e && e.code === 'invalid_argument') readOnly(); });
  }
  $$('[data-note]').forEach(ta => {
    const id = ta.dataset.note;
    ta.addEventListener('input', () => { if (S.ro) return; busy[id] = true; st(id).textContent = 'Сохраняю…'; clearTimeout(timers[id]); timers[id] = setTimeout(() => flush(id), 900); });
    ta.addEventListener('blur', () => { if (busy[id]) flush(id); });
  });
})();
"""
JS = JS.replace('__TX__', json.dumps(TX, ensure_ascii=False)).replace('__NAMES__', json.dumps(NAMES, ensure_ascii=False))

t1, t2, t3 = d.TEXTS
PAGE = f'''<title>Тексты главы «Мальборо»</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&family=Oswald:wght@600&display=swap">
<style>{CSS}</style>
<div class="wrap">
<header class="top">
<p class="eb">Фильм «Что вы знаете о никотине?» · глава 3</p>
<h1><span class="yr">1924</span> · «Мальборо»</h1>
<p class="lede">Три текста для голоса и разбор трёх сценариев Gemini. Выбери один текст или напиши, что взять из разных.</p>
<ol class="board" aria-label="Главы фильма">
{board()}
</ol>
</header>

<section class="tip" aria-labelledby="tip-h">
<h2 id="tip-h">Мой совет — текст 1</h2>
<ul>
<li>Самое сильное место главы — живой ковбой и его последние слова.</li>
<li>Первая же фраза отвечает на вопрос, которым кончается «Лёд».</li>
<li>Хочешь подачу, как в «Бобе» и «Льде», — бери текст 3. Связку через 12 млрд из него можно вставить в любой текст.</li>
<li>Длина у всех трёх — {t2['dur']}–{t3['dur']}, как у первых двух глав (1:48 и 1:36).</li>
</ul>
<p class="chosen-line" id="chosen" hidden></p>
<p class="msg" id="dbmsg" aria-live="polite"></p>
</section>

<nav class="tabs" id="tabs" role="tablist" aria-label="Тексты">{tabs}</nav>
{panel(t1)}
{panel(t2).replace('role="tabpanel"', 'role="tabpanel" hidden', 1)}
{panel(t3).replace('role="tabpanel"', 'role="tabpanel" hidden', 1)}
{gem_panel()}

<section class="next" aria-labelledby="next-h">
<h2 id="next-h">Что дальше</h2>
<ol>
<li>Ты выбираешь текст: кнопкой «Беру этот текст» или в чате. Правки — в поле под текстом, по номерам строк.</li>
<li>Голос. Совет — тот же «Макс» из ElevenLabs, что в «Бобе» и «Льде», чтобы весь фильм шёл одним голосом: около 750 кредитов за дубль (как в «Льде»: 0,48 кредита за символ), с переозвучкой — до 1 100. Трачу только после твоего «да». Или пишешь сам.</li>
<li>Первый кадр главы рисую заново: картинку 1924 года ты не берёшь.</li>
<li>Мостик «Лёд» → глава 3 — когда глава будет готова, в её настоящий первый кадр.</li>
</ol>
<div class="note" hidden><label for="n-all">Общее мнение</label>
<textarea id="n-all" data-note="all" placeholder="Что поменять во всех текстах сразу"></textarea>
<span class="st" aria-live="polite"></span></div>
</section>
<footer>Время — по скорости голоса «Льда», 2,4 слова в секунду. Claude, 18.11.</footer>
</div>
<script>{JS}</script>
'''
(HERE / 'тексты-18.11.html').write_text(PAGE, encoding='utf-8')

# копия для следующего Claude и для озвучки
md = ['# Глава 3 «1924 · Мальборо» — три текста (18.11)', '',
      'Страница с выбором — см. CLAUDE.md. Совет — текст 1; связка через 12 млрд — из текста 3.', '']
for t in d.TEXTS:
    md += [f"## Текст {t['n']} — {t['name']} (≈ {t['dur']}, {t['w']} слов)", '', t['idea'], '']
    md += [f"{i+1}. {l}" + (' **← сильное место**' if i in t['key'] else '') for i, l in enumerate(t['lines'])]
    md += ['', 'Факты:'] + [f"- {f} — " + ', '.join(f"[{d.SRC[k][0]}]({d.SRC[k][1]})" for k in ks) for f, ks in t['facts']] + ['']
md += ['## Gemini (ТЗ 17.11, `shorts/ref/ТЗ-gemini-17.11-v2.md`, раздел 4)', '']
for g in d.GEM:
    md += [f"### {g['n']} — {g['name']} ({g['words']} слов, {g['dur']})", '', f"Что хорошего: {g['take']}", '', 'Ошибки:'] + [f"- {x}" for x in g['bad']] + ['', g['note'], '']
(HERE / 'тексты-18.11.md').write_text('\n'.join(md), encoding='utf-8')
print('ok', [(t['n'], t['w'], t['dur']) for t in d.TEXTS], len(PAGE))
