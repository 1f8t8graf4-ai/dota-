# Страница «три текста главы 5 + финал фильма + концовка шортса главы 3» и её копия для следующего Claude.
#   python3 shorts/глава5/page.py  →  shorts/глава5/тексты-20.11.html и .md
# Вид — как у страницы главы 4 (её CSS берётся из глава4/page.py), выбор и правки — в базе страницы:
#   pick/choice {t: 't1'…}, pick/final {t: 'f1'…}, pick/ch3 {t: 'loop'|'q'}, notes/<id> {text}
import html, json, re, importlib.util, pathlib

HERE = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('d5', HERE / 'data.py')
d = importlib.util.module_from_spec(spec); spec.loader.exec_module(d)
E = lambda s: html.escape(s, quote=True)

def W(s): return len(re.findall(r"[А-Яа-яЁёA-Za-z0-9-]+", s))
def mmss(s): return f"{s // 60}:{s % 60:02d}"
for t in d.TEXTS:
    film = d.BRIDGE + [l for l, f in t['lines'] if f != 'S']; short = d.BRIDGE + [l for l, f in t['lines'] if f != 'F'] + [t['q']]   # BRIDGE — уже записан, в кредиты не входит
    t['w'] = sum(W(l) for l in film); t['dur'] = mmss(round(t['w'] / d.WPS))
    t['ws'] = sum(W(l) for l in short); t['sdur'] = mmss(round(t['ws'] / d.WPS))
    t['cr'] = round((sum(len(l) for l, _ in t['lines']) + len(t['q'])) * d.CR)
for f in d.FINALS:
    f['w'] = sum(W(l) for l in f['lines']); f['s'] = round(f['w'] / d.WPS); f['cr'] = round(sum(len(l) for l in f['lines']) * d.CR)
CR3 = round(len(d.CH3_Q) * d.CR)
T1, FB = d.TEXTS[0], d.FINALS[1]
TOTAL = T1['cr'] + FB['cr'] + CR3

BOARD = [  # глава фильма: год, имя, состояние, куда идёт
    ('1979', 'Боб', 'готово', 'TikTok · часть 1'),
    ('2020', 'Лёд', 'готово', 'TikTok · часть 2'),
    ('1924', 'Мальборо', 'готово', 'TikTok · часть 3'),
    ('2014', 'Нагреватели', 'готово', 'TikTok · часть 4'),
    ('2022', 'Снюс', 'сейчас', 'TikTok · часть 5'),
    ('финал', 'Переворот доски', 'сейчас', 'только в фильме · ≈ 30 с'),
]

src = (HERE.parent / 'глава4' / 'page.py').read_text(encoding='utf-8')
a = src.index('CSS = r"""') + len('CSS = r"""'); CSS = src[a:src.index('"""', a)]
CSS += r"""
/* глава 5: пять вкладок, строки «только в шортсе», финалы и концовка главы 3 карточками с выбором */
@media (min-width:900px){.tabs{grid-template-columns:repeat(5,minmax(0,1fr))}}
.script li.short{border-left:2px dotted var(--red);margin-left:-12px;padding-left:10px}
.script li.short>span:nth-child(2){color:var(--muted)}
.g ol.fl{margin:0;padding-left:20px;display:grid;gap:7px;font-size:15.5px;line-height:1.5}
.g ol.fl li.warn{text-decoration:underline wavy var(--red);text-decoration-thickness:1px;text-underline-offset:5px}
.g .gw{margin:0;color:var(--red);font-size:13.5px}
.g .acts{margin-top:auto;padding-top:6px}
.g details{margin-top:2px}
.g.on{border-color:var(--ok);box-shadow:inset 0 0 0 1px var(--ok)}
.c3{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
@media (max-width:760px){.c3{grid-template-columns:minmax(0,1fr)}}
.cost{font:500 13px/1.4 var(--f-mono);color:var(--muted);font-variant-numeric:tabular-nums}
.script li.rec>span:nth-child(2){color:var(--muted)}
"""

def li_script(t):
    out = [f'<li class="rec"><span class="n">{c}</span><span>{E(l)}</span><span class="tag">уже записано · было в конце главы 4</span></li>' for c, l in zip('АБ', d.BRIDGE)]
    for i, (l, f) in enumerate(t['lines']):
        key = i in t['key']
        cls = ' '.join(c for c, on in (('key', key), ('film', f == 'F'), ('short', f == 'S')) if on)
        body = f'<mark>{E(l)}</mark>' if key else E(l)
        tag = ' · '.join(x for x, on in (('сильное место', key), ('только в фильме', f == 'F'), ('только в шортсе', f == 'S')) if on)
        out.append(f'<li{f" class=\"{cls}\"" if cls else ""}><span class="n">{i+1}</span><span>{body}</span>' + (f'<span class="tag">{tag}</span>' if tag else '') + '</li>')
    out.append(f'<li class="shortq"><span class="n">TT</span><span>Конец шортса: «{E(t["q"])}» → доска переворачивается наполовину → «Целиком — на YouTube»</span></li>')
    return '\n'.join(out)

def facts(keys):
    rows = []
    for k in keys:
        f, ss = d.FACTS[k]
        s = ' · '.join(f'<a href="{E(d.SRC[x][1])}" target="_blank" rel="noopener">{E(d.SRC[x][0])}</a>' for x in ss)
        rows.append(f'<li>{E(f)}<span class="src">{s}</span></li>')
    return '\n'.join(rows)

def panel(t, hidden):
    pl = ''.join(f'<li>{E(x)}</li>' for x in t['plus']); mi = ''.join(f'<li>{E(x)}</li>' for x in t['minus'])
    return f'''<section class="panel" id="p-{t['id']}" role="tabpanel" aria-labelledby="tab-{t['id']}"{' hidden' if hidden else ''}>
<div class="phead">
<p class="eb">Текст {t['n']} · фильм ≈ {t['dur']} без финала · шортс ≈ {t['sdur']} · голос ≈ {t['cr']} кредитов</p>
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
{facts(t['facts'])}
</ol></details>
<div class="note" hidden><label for="n-{t['id']}">Правки · текст {t['n']}</label>
<textarea id="n-{t['id']}" data-note="{t['id']}" placeholder="Например: строка 2 — короче; строку про Германию взять из текста 3"></textarea>
<span class="st" aria-live="polite"></span></div>
</aside>
</div>
</section>'''

def fin_card(f):
    ls = ''.join(f'<li{" class=\"warn\"" if i in f["warn"] else ""}>{E(l)}</li>' for i, l in enumerate(f['lines']))
    ws = ''.join(f'<p class="gw">⚠ строка {i+1}: {E(w)}</p>' for i, w in f['warn'].items())
    return f'''<article class="g" data-card="{f['id']}">
<span class="gid">{f['n']}</span>
<h3>{E(f['name'])}</h3>
<span class="meta">голос ≈ {f['s']} с · ≈ {f['cr']} кредитов</span>
<p>{E(f['idea'])}</p>
<ol class="fl">{ls}</ol>{ws}
<details class="facts"><summary>Факты · {len(f['facts'])}</summary><ol>
{facts(f['facts'])}
</ol></details>
<div class="acts"><button class="btn pick" type="button" data-pickf="{f['id']}" aria-pressed="false" hidden>Беру этот финал</button><span class="msg" aria-live="polite"></span></div>
</article>'''

def fin_panel():
    return f'''<section class="panel fin" id="p-fin" role="tabpanel" aria-labelledby="tab-fin" hidden>
<div class="phead">
<p class="eb">Финал фильма · только YouTube · ≈ 30 с</p>
<h2>Переворот доски</h2>
<p class="idea">После главы 5 камера отъезжает на всю доску, доска переворачивается, на изнанке нити сходятся в змею, которая кусает свой хвост. Голос финала запишу вместе с главой 5. В TikTok вместо финала — полупереворот и «Целиком — на YouTube».</p>
</div>
<div class="gem">
{''.join(fin_card(f) for f in d.FINALS)}
</div>
<article class="g" style="margin-top:16px">
<span class="gid">кадр</span>
<h3>Как выглядит финал</h3>
<ol class="beats">
<li><b>0–5 с</b><span>Отъезд: вся доска, все пять карточек открыты, нити.</span></li>
<li><b>5–12 с</b><span>Доска переворачивается на 180°. На чёрной изнанке нити сходятся в змею, которая кусает свой хвост.</span></li>
<li><b>12–25 с</b><span>Голос финала. Змея делает круг через все пять карточек.</span></li>
<li><b>25–30 с</b><span>Название фильма: «Что вы знаете о никотине?»</span></li>
</ol>
</article>
<div class="note" hidden style="margin-top:22px"><label for="n-fin">Правки финала</label>
<textarea id="n-fin" data-note="fin" placeholder="Например: финал Б, но последнюю строку из А"></textarea>
<span class="st" aria-live="polite"></span></div>
</section>'''

def ch3_panel():
    return f'''<section class="panel" id="p-ch3" role="tabpanel" aria-labelledby="tab-ch3" hidden>
<div class="phead">
<p class="eb">Глава 3 «Мальборо» · конец шортса</p>
<h2>Петля или вопрос</h2>
<p class="idea">Айкос из конца главы 3 уходит: он теперь целиком в главе 4. Шортс главы 3 кончится на «…четверо ковбоев «Мальборо»». Продолжение будет в любом случае: в TikTok — «Часть 4 →», на YouTube — ссылка на целый фильм. Выбираешь только последние секунды. Выбор концовки — это и «го» на переделку конца главы 3: в фильме уходят нагреватель и плашка «2014», голос уже записан.</p>
</div>
<div class="c3">
<article class="g" data-card="loop">
<span class="gid">1</span>
<h3>Петля</h3>
<span class="meta">бесплатно</span>
<p>От четырёх столбов камера возвращается к щиту с ковбоем — это первый кадр, ролик идёт по кругу. «Часть 4 →» — надписью, без голоса.</p>
<div class="acts"><button class="btn pick" type="button" data-pick3="loop" aria-pressed="false" hidden>Беру петлю</button><span class="msg" aria-live="polite"></span></div>
</article>
<article class="g" data-card="q">
<span class="gid">2</span>
<h3>Вопрос · мой совет</h3>
<span class="meta">≈ {CR3} кредитов, запишу вместе с главой 5</span>
<p>Голосом: «{E(d.CH3_Q)}». Часть 4 открывается ответом: «Производитель «Мальборо» однажды пообещал бросить сигареты». Вопрос держит до следующей части лучше, чем петля.</p>
<div class="acts"><button class="btn pick" type="button" data-pick3="q" aria-pressed="false" hidden>Беру вопрос</button><span class="msg" aria-live="polite"></span></div>
</article>
</div>
</section>'''

def board():
    out = []
    for y, n, st, where in BOARD:
        cls = 'bc' + (' now' if st == 'сейчас' else '') + (' film' if where.startswith('только') else '')
        out.append(f'<li class="{cls}"><i>{st}</i><b>{E(y)}</b><span>{E(n)}</span><small>{E(where)}</small></li>')
    return '\n'.join(out)

tabs = ''.join(
    f'<button class="tab" type="button" role="tab" id="tab-{t["id"]}" data-p="{t["id"]}" aria-controls="p-{t["id"]}" aria-selected="false">'
    f'<b>Текст {t["n"]} <span class="ck">✓</span></b><span>{E(t["short"])}</span></button>' for t in d.TEXTS
) + ('<button class="tab grp" type="button" role="tab" id="tab-fin" data-p="fin" aria-controls="p-fin" aria-selected="false"><b>Финал <span class="ck">✓</span></b><span>переворот доски</span></button>'
     '<button class="tab" type="button" role="tab" id="tab-ch3" data-p="ch3" aria-controls="p-ch3" aria-selected="false"><b>Глава 3 <span class="ck">✓</span></b><span>петля или вопрос</span></button>')

def copy_text(t):
    return [f'{c}. {l} (уже записано)' for c, l in zip('АБ', d.BRIDGE)] + [f"{i+1}. {l}" + (' (только фильм)' if f == 'F' else ' (только шортс)' if f == 'S' else '') for i, (l, f) in enumerate(t['lines'])] + [f"Шортс в конце: {t['q']}"]
TX = {t['id']: copy_text(t) for t in d.TEXTS}
NAMES = {t['id']: f"текст {t['n']} «{t['name']}»" for t in d.TEXTS}
FN = {f['id']: f"финал {f['n']} «{f['name']}»" for f in d.FINALS}
C3 = {'loop': 'глава 3 — петля', 'q': 'глава 3 — вопрос'}

JS = r"""
const TX = __TX__, NAMES = __NAMES__, FN = __FN__, C3 = __C3__;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const IDS = Object.keys(TX).concat('fin', 'ch3');
const tabs = $$('[role="tab"]');
function show(id, focus) {
  tabs.forEach(t => { const on = t.dataset.p === id; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
  $$('.panel').forEach(p => { p.hidden = p.id !== 'p-' + id; });
}
function go(id, focus) {
  show(id, focus);
  try { history.replaceState(null, '', '#' + id); } catch (e) { try { location.hash = id; } catch (e2) {} }
}
function fromHash() { const h = location.hash.slice(1); show(IDS.includes(h) ? h : IDS[0]); }
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

// Выбор и правки — в базе страницы (их читает Claude). Без базы страница просто читается.
(async () => {
  let db = null;
  try { db = window.claude && window.claude.use ? await window.claude.use('db') : null; } catch (e) { db = null; }
  if (!db) return;
  const K = { choice: { attr: 'pick', names: NAMES, on: 'Беру этот текст', tab: id => id },
              final: { attr: 'pickf', names: FN, on: 'Беру этот финал', tab: () => 'fin' },
              ch3: { attr: 'pick3', names: C3, on: null, tab: () => 'ch3' } };
  const S = { choice: '', final: '', ch3: '' }, last = {}, busy = {}, timers = {}, chain = {};
  let ready = false, ro = false;
  const line = $('#chosen');
  const btns = k => $$('[data-' + K[k].attr + ']');
  const val = (k, b) => b.dataset[K[k].attr];
  const readOnly = () => { ro = true; Object.keys(K).forEach(k => btns(k).forEach(b => { b.hidden = true; })); $$('.note').forEach(n => { n.hidden = true; }); };
  function render() {
    Object.keys(K).forEach(k => btns(k).forEach(b => {
      const on = S[k] === val(k, b); b.setAttribute('aria-pressed', on);
      if (!b._lab) b._lab = b.textContent;
      b.textContent = on ? '✓ Выбрано · нажми, чтобы снять' : b._lab;
      const card = b.closest('[data-card]'); if (card) card.classList.toggle('on', on);
    }));
    tabs.forEach(t => t.classList.toggle('chosen', t.dataset.p === S.choice || (t.dataset.p === 'fin' && !!S.final) || (t.dataset.p === 'ch3' && !!S.ch3)));
    const parts = [S.choice && NAMES[S.choice], S.final && FN[S.final], S.ch3 && C3[S.ch3]].filter(Boolean);
    line.hidden = !parts.length; line.textContent = parts.length ? 'Ты выбрал: ' + parts.join(' · ') : '';
  }
  Object.keys(K).forEach(k => btns(k).forEach(b => { b.hidden = false; }));
  $$('.note').forEach(n => { n.hidden = false; });
  const tm = setTimeout(() => { if (!ready) say($('#dbmsg'), 'Отметки пока не загрузились. Выбор можно написать в чат.'); }, 10000);
  db.collection('pick').onSnapshot(snap => {
    Object.keys(K).forEach(k => {
      const doc = snap.docs.find(x => x.id === k);
      const v = doc && doc.exists ? String((doc.data() || {}).t || '') : '';
      S[k] = K[k].names[v] ? v : '';
    });
    render();
    if (!snap.metadata.fromCache) { ready = true; clearTimeout(tm); }
  }, () => { clearTimeout(tm); });
  db.collection('notes').onSnapshot(snap => {
    snap.docs.forEach(x => {
      const ta = $('[data-note="' + x.id + '"]'); if (!ta) return;
      const v = String((x.data() || {}).text || '');
      last[x.id] = v;
      if (document.activeElement !== ta && !busy[x.id]) ta.value = v;
    });
  }, () => {});
  Object.keys(K).forEach(k => btns(k).forEach(b => b.addEventListener('click', async () => {
    if (ro) return;
    const prev = S[k], next = S[k] === val(k, b) ? '' : val(k, b);
    S[k] = next; render();
    try { await db.doc('pick/' + k).set({ t: next, at: new Date().toISOString() }); say($('.msg', b.parentElement), next ? 'Сохранено' : 'Выбор снят'); }
    catch (e) {
      S[k] = prev; render();
      if (e && e.code === 'invalid_argument') readOnly();
      say($('.msg', b.parentElement), 'Не сохранилось. Напиши выбор в чат.');
    }
  })));
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
    ta.addEventListener('input', () => { if (ro) return; busy[id] = true; st(id).textContent = 'Сохраняю…'; clearTimeout(timers[id]); timers[id] = setTimeout(() => flush(id), 900); });
    ta.addEventListener('blur', () => { if (busy[id]) flush(id); });
  });
})();
"""
for k, v in (('__TX__', TX), ('__NAMES__', NAMES), ('__FN__', FN), ('__C3__', C3)):
    JS = JS.replace(k, json.dumps(v, ensure_ascii=False))

PAGE = f'''<title>Тексты главы «Снюс»</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&family=Oswald:wght@600&display=swap">
<style>{CSS}</style>
<div class="wrap">
<header class="top">
<p class="eb">Фильм «Что вы знаете о никотине?» · глава 5 и финал</p>
<h1><span class="yr">2022</span> · Снюс</h1>
<p class="lede">Три текста про Zyn — белые пакетики под губу, которые у нас зовут снюсом и которые «Филип Моррис» купил за 16 миллиардов, — три финала фильма и концовка шортса главы 3. Глава и её шортс начинаются строками «А в Америку… табака» — они уже записаны, из конца главы 4 их убрали. Выбери кнопками или напиши в чат, правки — в поле под текстом.</p>
<ol class="board" aria-label="Главы фильма">
{board()}
</ol>
</header>

<section class="tip" aria-labelledby="tip-h">
<h2 id="tip-h">Мой совет — текст 1 «Невидимка» и финал Б</h2>
<ul>
<li>Начало у всех текстов одно — уже записанные строки «А в Америку «Филип Моррис» всё-таки вернулся… В ней нет даже… табака». В шортсе это ответ на вопрос из конца части 4.</li>
<li>Текст 1: дальше крючок — снюс не видно, не слышно, и он не пахнет. Годы только вперёд: 2022 → 2024 → 2025 → 2026.</li>
<li>Главный поворот главы — свежий: 30 июня 2026-го американский регулятор разрешил Зину писать «Zyn вместо сигарет — ниже риск рака, болезней сердца и инсульта». Айкосу в главе 4 так и не разрешили сказать «вреда меньше».</li>
<li>Ещё два эха прошлых глав: снюс смели с полок, как айкосы в Японии, а вкусы, которые в 2020-м отняли у «Джула», Зину разрешили сразу.</li>
<li>Конец главы: «вместо сигарет» — а американские школьники сигарет почти не курят, снюс у них уже обогнал сигареты. И через два месяца — снюс крепче: 9 и 11 мг вместо 3 и 6.</li>
<li>Финал Б кончается названием фильма: «Так что вы знаете о никотине?» — и без натяжек. В финале А последняя строка — натяжка из главы 1, В — новый факт про первую электронную сигарету.</li>
<li>Текст 3 — если важнее Европа: в нём строка про Германию, где такие пакетики продавать нельзя совсем. Её можно взять и в текст 1 для немецкой версии.</li>
</ul>
<p class="chosen-line" id="chosen" hidden></p>
<p class="msg" id="dbmsg" aria-live="polite"></p>
</section>

<nav class="tabs" id="tabs" role="tablist" aria-label="Тексты">{tabs}</nav>
{''.join(panel(t, i > 0) for i, t in enumerate(d.TEXTS))}
{fin_panel()}
{ch3_panel()}

<section class="next" aria-labelledby="next-h">
<h2 id="next-h">Что дальше</h2>
<ol>
<li>Ты выбираешь текст, финал и концовку главы 3 — кнопками здесь или в чате.</li>
<li>Голос — тот же «Макс» из ElevenLabs, одним заходом: глава 5, финал и вопрос главы 3. По совету это около {TOTAL} кредитов (полкредита за знак, как у главы 4), с переозвучкой — до {round(TOTAL * 1.35 / 10) * 10}. Трачу только после твоего «да» в чате.</li>
<li>Шортс главы 5 — последняя часть в TikTok: в конце вопрос, доска переворачивается наполовину и «Целиком — на YouTube». Целиком фильм с финалом — только на YouTube.</li>
<li>Потом рисовка главы 5 — страница с таймингом, как у главы 4. Первые кадры — под уже записанные строки «А в Америку… табака».</li>
</ol>
<div class="note" hidden><label for="n-all">Общее мнение</label>
<textarea id="n-all" data-note="all" placeholder="Что поменять во всех текстах сразу"></textarea>
<span class="st" aria-live="polite"></span></div>
</section>
<footer>Время — по темпу голоса глав 3–4, 2,57 слова в секунду. Факты Зетки сверены, свежие (2025–2026) добавлены. Claude, 20.11.</footer>
</div>
<script>{JS}</script>
'''
(HERE / 'тексты-20.11.html').write_text(PAGE, encoding='utf-8')

# копия для следующего Claude и для озвучки
md = ['# Глава 5 «2022 · Снюс» — три текста, три финала, концовка шортса главы 3 (20.11)', '',
      'Страница с выбором — см. CLAUDE.md. Совет — текст 1 «Невидимка» и финал Б. (F) — только фильм, (S) — только шортс.',
      'Все тексты (и фильм, и шортс) начинаются уже записанными строками из конца главы 4 (А, Б):', ''] + [f'{c}. {l}' for c, l in zip('АБ', d.BRIDGE)] + ['']
for t in d.TEXTS:
    md += [f"## Текст {t['n']} — {t['name']} (фильм ≈ {t['dur']} без финала, шортс ≈ {t['sdur']}, голос ≈ {t['cr']} кредитов)", '', t['idea'], '']
    md += [f"{i+1}. {l}" + (' **← сильное место**' if i in t['key'] else '') + (' *(F)*' if f == 'F' else ' *(S)*' if f == 'S' else '') for i, (l, f) in enumerate(t['lines'])]
    md += ['', f"Конец шортса: «{t['q']}» → полупереворот доски → «Целиком — на YouTube».", '', 'Факты:']
    md += [f"- {d.FACTS[k][0]} — " + ', '.join(f"[{d.SRC[x][0]}]({d.SRC[x][1]})" for x in d.FACTS[k][1]) for k in t['facts']] + ['']
md += ['## Финалы (только фильм, ≈ 30 с с картинкой)', '']
for f in d.FINALS:
    md += [f"### {f['n']} — {f['name']} (голос ≈ {f['s']} с, ≈ {f['cr']} кредитов)", '', f['idea'], '']
    md += [f"{i+1}. {l}" + (f" ⚠ {f['warn'][i]}" if i in f['warn'] else '') for i, l in enumerate(f['lines'])] + ['']
md += ['## Глава 3 — конец шортса', '', '- Айкос уходит из конца главы 3 (он целиком в главе 4); выбор концовки — это и «го» на переделку конца главы 3.',
       '- 1 — петля: от четырёх столбов камера возвращается к щиту, «Часть 4 →» надписью. Бесплатно.',
       f"- 2 — вопрос: «{d.CH3_Q}» — ≈ {CR3} кредитов, записать вместе с главой 5.", '']
(HERE / 'тексты-20.11.md').write_text('\n'.join(md), encoding='utf-8')
print('ok', [(t['id'], t['w'], t['dur'], t['sdur'], t['cr']) for t in d.TEXTS], [(f['id'], f['s'], f['cr']) for f in d.FINALS], 'total', TOTAL, len(PAGE))
