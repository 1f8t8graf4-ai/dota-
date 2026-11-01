/* ===== «Языки по кино» — приложение из одобренных макетов (01.11) =====
   Экраны — те самые варианты из макетов (Меню, путь сцены, Deadlock, радар, комикс, Versus, профиль, настройки),
   связанные переходами. Плеер эпизода, задания и итог — на настоящих данных (5 эпизодов с видео). */
(() => {
const D = window.APPD || {};
const FN = {titanic: 'Титаник', wolf: 'Волк с Уолл-стрит', sopranos: 'Клан Сопрано', bb: 'Во все тяжкие'};
const BD = {titanic: 'bd_titanic', wolf: 'bd_wolf', sopranos: 'bd_sopranos', bb: 'bd_bb'};
const SC4K = ['titanic', 'wolf', null, 'sopranos', null, 'bb']; // порядок SC4 → путь
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
const normW = w => String(w).toLowerCase().replace(/[’`]/g, "'").replace(/^[^a-z0-9äöüß']+|[^a-z0-9äöüß']+$/g, '');
const words = t => String(t).replace(/[.,!?;:"«»—…]/g, ' ').split(/\s+/).filter(Boolean);
const shuffle = L => L.map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
const mmss = x => Math.floor(x / 60) + ':' + String(Math.floor(x % 60)).padStart(2, '0');

/* ---------- состояние (прогресс живёт в браузере) ---------- */
const ST = (() => { let s = null; try { s = JSON.parse(localStorage.getItem('ap01') || 'null') } catch (e) {}
  return Object.assign({prog: {titanic: 1, wolf: 2, sopranos: 1, bb: 1}, dict: 128, saved: [], pz: true}, s || {}) })();
const save = () => { try { localStorage.setItem('ap01', JSON.stringify(ST)) } catch (e) {} };

/* ---------- оболочка: телефон на весь экран (телефон) или по центру (ПК) ---------- */
document.body.classList.add('ap');
const ROOT = document.createElement('div'); ROOT.id = 'apRoot';
const JUMP = [
  ['Главная', [['home', 'Меню'], ['scenes', 'Что посмотреть'], ['profile', 'Профиль-бенто'], ['settings', 'Настройки']]],
  ['Сцена и обучение', [['path:titanic', 'Путь · Титаник'], ['path:wolf', 'Путь · Волк'], ['path:sopranos', 'Путь · Сопрано'], ['path:bb', 'Путь · Во все тяжкие'],
    ['play:titanic:1', 'Эпизод с видео'], ['tasks:titanic:1', '3 задания'], ['after:titanic:1', 'Хватит или ещё'], ['deep', 'Углубить эпизод'], ['pct', 'Понимаешь %'], ['card', '100 % эпизода'], ['rev', 'Повторение']]],
  ['Deadlock', [['dl', 'На сегодня'], ['heroes', 'Герои'], ['hero', 'Карточка героя'], ['level', 'Уровень героя'], ['radar', 'Радар'], ['comic', 'Комикс'], ['chapter', 'Выбор главы'], ['ccheck', 'Проверка главы'], ['lines', 'Реплики · кто про кого'], ['ult', 'Реплики · как в TikTok'], ['versus', 'Versus с другом']]]];
const jumpHTML = () => JUMP.map(([g, L]) => `<div class="ap-jg"><small>${g}</small>${L.map(([k, n]) => `<button data-jump="${k}">${n}</button>`).join('')}</div>`).join('');
ROOT.innerHTML = `<aside id="apSide"><div class="ap-sh"><b>Языки по кино</b><span>приложение из одобренных макетов</span></div>
  <p class="ap-sn">Всё нажимается и ведёт куда надо: Меню → путь сцены → эпизод → 3 задания → «хватит или ещё»; Игры → Deadlock → радар, комикс, герои, Versus; аватарка → профиль → настройки. Видео настоящее в 5 эпизодах: Титаник 1–2, Волк 3, Сопрано 2, Во все тяжкие 2.</p>
  <nav class="ap-jl">${jumpHTML()}</nav><button class="ap-rs">Сбросить прогресс</button></aside>
  <div id="apPh"></div><button id="apJb" aria-label="Все экраны"><i></i>все экраны</button>
  <div id="apJm" hidden><div class="ap-jmb"><div class="ap-jmh"><b>Все экраны</b><button aria-label="Закрыть">✕</button></div><nav class="ap-jl">${jumpHTML()}</nav><button class="ap-rs">Сбросить прогресс</button></div></div>`;
document.body.appendChild(ROOT);
const DEVW = $('#devw'), DEV = $('#dev'); $('#apPh').appendChild(DEVW);
try { removeEventListener('resize', fit) } catch (e) {}
const MOB = () => innerWidth < 640 || (matchMedia('(pointer:coarse)').matches && innerWidth < 900);
function apFit() {
  const m = MOB(); document.documentElement.classList.toggle('apm', m);
  let s;
  if (m) { const top = 34; s = Math.min(innerWidth / 344, innerHeight / (754 - top)); DEV.style.transform = `translateY(${-top * s}px) scale(${s})`; DEVW.style.width = 344 * s + 'px'; DEVW.style.height = (754 - top) * s + 'px' }
  else { s = Math.min(1.12, (innerHeight - 36) / 770); DEV.style.transform = `scale(${s})`; DEVW.style.width = 360 * s + 'px'; DEVW.style.height = 770 * s + 'px' }
  SCALE = s;
}
addEventListener('resize', apFit); apFit();
const jm = $('#apJm');
$('#apJb').onclick = () => { jm.hidden = false };
jm.onclick = e => { if (e.target === jm || e.target.closest('.ap-jmh button')) jm.hidden = true };
ROOT.addEventListener('click', e => {
  const b = e.target.closest('[data-jump]'); if (b) { jm.hidden = true; jump(b.dataset.jump); return }
  if (e.target.closest('.ap-rs')) { localStorage.removeItem('ap01'); Object.assign(ST, {prog: {titanic: 1, wolf: 2, sopranos: 1, bb: 1}, dict: 128, saved: []}); save(); jm.hidden = true; tab('home'); toast($('#scr'), 'Прогресс сброшен') }
});
// не даём телефону прокручивать страницу целиком (только экраны внутри)
document.addEventListener('touchmove', e => { if (!e.target.closest('#scr') && !e.target.closest('#apJm')) e.preventDefault() }, {passive: false});

/* ---------- роутер ---------- */
const APP = {stack: []};
const VM = id => (R, ctx) => V.find(v => v.id === id).mount(R, ctx);
const SCR = {
  home: {tab: 'home', m: VM('z22m')},
  scenes: {tab: 'film', m: mScenes},
  dl: {tab: 'game', m: VM('z21d')},
  dict: {tab: 'dict', m: mDict},
  path: {m: mPath}, play: {m: mPlay, dark: 1}, tasks: {m: mTasks}, words: {m: mWords}, after: {m: mAfter},
  deep: {m: VM('l11d')}, pct: {m: VM('l15p')}, card: {m: VM('l15c')}, rev: {m: mTasks},
  profile: {m: mProfile}, settings: {m: VM('s13u')},
  heroes: {m: VM('d15f')}, hero: {m: VM('k15h')}, level: {m: VM('l15k')}, radar: {m: VM('g8r')}, comic: {m: VM('kb')}, chapter: {m: VM('k13a')},
  ccheck: {m: VM('g9k')}, lines: {m: VM('g12b')}, ult: {m: VM('g12a')}, versus: {m: VM('g10v')}
};
const TABS = ['home', 'film', 'game', 'dict'], TAB_SCR = {home: 'home', film: 'scenes', game: 'dl', dict: 'dict'};
const cur = () => APP.stack[APP.stack.length - 1];
function go(id, a, how) { APP.stack.push({id, a: a || {}}); render(how || 'push') }
function replace(id, a) { APP.stack.pop(); APP.stack.push({id, a: a || {}}); render('push') }
function back() { if (APP.stack.length > 1) { APP.stack.pop(); render('back') } else if (cur().id !== 'home') tab('home') }
function tab(k) { APP.stack = [{id: TAB_SCR[k] || 'home', a: {root: 1}}]; render('tab') }
function backTo(id, a) { const i = APP.stack.map(e => e.id).lastIndexOf(id); if (i >= 0) { APP.stack = APP.stack.slice(0, i + 1); if (a) APP.stack[i].a = Object.assign(APP.stack[i].a, a); render('back') } else go(id, a) }
function jump(k) { const [id, x, y] = k.split(':'); const a = {}; if (x) a.k = x; if (y != null) a.i = +y;
  if (TAB_SCR[Object.keys(TAB_SCR).find(t => TAB_SCR[t] === id)] && ['home', 'scenes', 'dl', 'dict'].includes(id)) { tab(Object.keys(TAB_SCR).find(t => TAB_SCR[t] === id)); return }
  APP.stack = [{id: 'home', a: {root: 1}}, {id, a}]; render('push') }
function render(how) {
  const e = cur(), S = SCR[e.id];
  if (CTX) CTX.kill(); try { hush(); if (AUcur) { AUcur.pause(); AUcur = null } } catch (x) {}
  const old = $('#scr'), R = old.cloneNode(false); old.replaceWith(R); R.removeAttribute('style'); R.className = 'scr';
  CTX = mkCtx(); R._remount = () => render('none');
  const root = APP.stack.length === 1 && !!S.tab;
  DEV.classList.toggle('ap-root', root); DEV.classList.toggle('ap-push', !root); DEV.dataset.scr = e.id;
  try { S.m(R, CTX, e.a) } catch (x) { console.error(x); R.innerHTML = `<p style="padding:90px 24px;color:#fff">Ошибка: ${esc(x.message)}</p>` }
  if (root && !$('.q7-tb', R)) { R.insertAdjacentHTML('beforeend', q7TB(TABS.indexOf(S.tab))); R.classList.add('ap-tbpad') }
  if (root) $$('.q7-tb a', R).forEach(a => a.classList.toggle('on', a.dataset.tb === S.tab));
  (HOOK[e.id] || (() => {}))(R, CTX, e.a);
  const kf = how === 'push' ? [{opacity: 0, transform: 'translateX(28px)'}, {opacity: 1, transform: 'none'}] : how === 'back' ? [{opacity: 0, transform: 'translateX(-28px)'}, {opacity: 1, transform: 'none'}] : how === 'tab' ? [{opacity: 0}, {opacity: 1}] : null;
  if (kf) an(R, kf, {d: how === 'tab' ? 200 : 280, e: EO});
}

/* ---------- перехваты: кнопки-заглушки макетов ведут на настоящие экраны ---------- */
const OV = '.g11-ov,.w4t,.m7-pv,.p8-all,.q9-tip,.h1-sv';
const BACKS = '.y5bk,.bk,.x,.z22p-x,.ap-bk';
// [селектор, действие, можно ли внутри шторки/оверлея]
const CAP = {
  home: [['.q7m-i[data-j="0"]', () => go('play', {k: 'titanic', i: 1})],
    ['.q7m-mi button[data-j="3"]', () => go('rev', {rev: 1})],
    ['.q7m-mi button[data-j="4"]', () => go('versus')],
    ['.q8-gm .q7m-i[data-g="0"]', () => go('dl')],
    ['.q7-av', () => go('profile')],
    ['.z22p-r', el => openScene(+el.dataset.j, el), 1],
    ['.w4t .go', el => { const s = el.closest('[data-s]'); openScene(s ? +s.dataset.s : 0, el, 1) }, 1]],
  scenes: [['.z22p-r', el => openScene(+el.dataset.j, el)], ['.w4t .go', el => { const s = el.closest('[data-s]'); openScene(s ? +s.dataset.s : 0, el, 1) }, 1]],
  path: [['.p8-go', () => { const a = cur().a; go('play', {k: a.k, i: Math.min(ST.prog[a.k], D[a.k].parts.length - 1)}) }],
    ['.p8-sh .sg', el => { const a = cur().a, m = /ЭПИЗОД (\d+)/.exec(($('.p8-sh .hh small', DEV) || {}).textContent || ''), j = m ? +m[1] - 1 : 0;
      if (j > ST.prog[a.k]) { toast($('#scr'), 'Сначала эпизод ' + (j)); return } $('.p8-sh', DEV).classList.remove('on'); go('play', {k: a.k, i: j}) }, 1],
    ['.p8-rw', () => toast($('#scr'), 'Фон сцены — в «Коллекции», когда пройдёшь все эпизоды')]],
  dl: [['.y5bk', () => APP.stack.length > 1 ? back() : tab('home')], ['[data-go="radar"]', () => go('radar')]],
  profile: [['.ap-gear', () => go('settings')]],
  pct: [['.y5pc-go', () => go('play', {k: 'titanic', i: Math.min(ST.prog.titanic, 1)})]],
};
DEV.addEventListener('click', e => {
  const e0 = cur(); if (!e0) return; const R = $('#scr'); if (!R.contains(e.target)) return;
  const hit = (sel, ov) => { const el = e.target.closest(sel); if (!el || !R.contains(el)) return null; if (!ov && el.closest(OV)) return null; return el };
  for (const [sel, fn, ov] of (CAP[e0.id] || [])) { const el = hit(sel, ov); if (el) { e.stopPropagation(); e.preventDefault(); an(el, [{transform: 'scale(.96)'}, {transform: 'none'}], {d: 220}); fn(el, e); return } }
  const t = hit('.q7-tb a[data-tb]'); if (t) { e.stopPropagation(); e.preventDefault(); const k = t.dataset.tb; if (k === 'user') { go('profile'); return } tab(k); return }
  const b = hit(BACKS); if (b && !DEV.classList.contains('ap-root')) { const r = rel(b, R); if (r.y < 130 && r.x < 90) { e.stopPropagation(); e.preventDefault(); back() } }
}, true);
function openScene(j, el, fromFeed) { const k = SC4K[j]; if (k) { go('path', {k}); return }
  if (!fromFeed) return w4Feed($('#scr'), CTX, j, el);
  toast($('#scr'), 'В этом тесте путь есть у Титаника, Волка, Сопрано и «Во все тяжкие»') }

/* ---------- экраны после монтирования: мелкие правки макетов ---------- */
const HOOK = {
  profile: R => {},
  settings: R => {},
};

/* ---------- Сцены: «Что посмотреть» списком (как в Меню), лента — кнопкой ---------- */
function mScenes(R, ctx) { R.className = 'scr g11-ov z22p ap-scenes';
  R.innerHTML = `${SB(0)}<div class="z22p-h"><b>Сцены</b><button class="z22p-feed">${ic('play')}Лентой</button></div>
   <div class="z22p-seg">${['Все', 'Фильмы', 'Сериалы', 'Интервью'].map((n, i) => `<button class="${i ? '' : 'on'}" data-c="${i}">${n}</button>`).join('')}</div>
   <div class="z22p-l">${SC4.map((s, j) => `<button class="z22p-r" data-j="${j}"><i class="img" style="background-image:url(${IMG[s.img]})"></i><span><b>${s.t}</b><small>${s.yr}</small><em>${LV22[s.lv] || ''} · ≈ ${sc22Min(s)} мин · ${sc22Ph(s)} фраз${SC4K[j] ? '' : ' · путь — в приложении'}</em></span><i class="go">${ic('play')}</i></button>`).join('')}</div><i class="hb"></i>`;
  R.classList.remove('g11-ov');
  ctx.on($('.z22p-feed', R), 'click', e => w4Feed(R, ctx, 0, e.currentTarget));
  ctx.on($('.z22p-seg', R), 'click', e => { const b = e.target.closest('button'); if (!b) return; const c = +b.dataset.c; $$('.z22p-seg button', R).forEach(x => x.classList.toggle('on', x === b));
    $$('.z22p-r', R).forEach(r => { const s = SC4[+r.dataset.j]; r.hidden = c === 1 ? /^S\d/.test(s.yr) : c === 2 ? !/^S\d/.test(s.yr) : c === 3 }); if (c === 3) toast(R, 'Интервью — Дуров и Клавикуляр — в приложении') });
  $$('.z22p-r', R).forEach((x, i) => an(x, [{opacity: 0, transform: 'translateY(14px)'}, {opacity: 1, transform: 'none'}], {sp: SPs, dl: 60 + i * 45}));
}

/* ---------- Путь сцены: вариант макета + твой прогресс ---------- */
function mPath(R, ctx, a) { const k = a.k || 'titanic'; PT8[k].done = Math.min(ST.prog[k], D[k] ? D[k].parts.length : 9);
  V.find(v => v.id === 'p11' + k[0]).mount(R, ctx);
  const go = $('.p8-go', R); if (go && ST.prog[k] >= (D[k] ? D[k].parts.length : 9)) go.innerHTML = `${ic('play')}Смотреть сцену заново`;
}

/* ---------- Словарь: твои слова (что нажимал в эпизодах) + выученные ---------- */
const DICT0 = [['survive', 'выжить', "I'll survive.", 'titanic'], ['fugazi', 'фальшивка', "It's a fugazi.", 'wolf'], ['nice tan', 'хороший загар', 'Nice tan.', 'psycho'], ['stress', 'стресс', 'Stress, maybe.', 'sopranos'], ['careful', 'осторожный', "I'm a careful man.", 'bb'], ['hold on', 'держись', 'Hold on to me.', 'titanic'], ['have a seat', 'присаживайтесь', 'Have a seat, please.', 'bb']];
function mDict(R, ctx) { R.className = 'scr y5 ap-dict';
  const L = ST.saved.map(x => [x.w, x.r, x.line, x.k]).concat(DICT0.filter(d => !ST.saved.some(s => s.w === d[0])));
  R.innerHTML = `${SB(0)}<div class="y5sc"><div class="ap-dh"><b>Словарь</b><small>${ST.dict} фраз и слов · ${L.length} в «Моих словах»</small></div>
   <button class="ap-due"><span><b>Повторить сегодня</b><small>3 за раз — потом «ещё 3» или хватит</small></span><em>${Math.min(17, L.length + 10)}</em></button>
   <div class="ap-seg"><button class="on">Мои слова</button><button>Фразы из сцен</button></div>
   <div class="ap-wl">${L.map(([w, r, line, k]) => `<button class="ap-wr"><span class="ap-lv">${bars(w.length > 6 ? 3 : 2)}</span><span class="t"><b>${esc(w)}</b><em>${esc(r)}</em><small>${esc(line)} · ${FN[k] || (k === 'psycho' ? 'Американский психопат' : '')}</small></span><i class="pl">${ic('play')}</i></button>`).join('')}</div>
   <p class="ap-nt">Слова попадают сюда, когда нажимаешь их в субтитрах и отмечаешь после эпизода. Сам словарь «Мои фразы и слова» — как в приложении сейчас.</p></div><i class="hb"></i>`;
  ctx.on($('.ap-due', R), 'click', () => go('rev', {rev: 1}));
  ctx.on($('.ap-seg', R), 'click', e => { const b = e.target.closest('button'); if (!b) return; $$('.ap-seg button', R).forEach(x => x.classList.toggle('on', x === b)); if (b !== $('.ap-seg button', R)) toast(R, 'Фразы из сцен — «Мои фразы и слова», как в приложении') });
  ctx.on($('.ap-wl', R), 'click', e => { const r = e.target.closest('.ap-wr'); if (!r) return; an(r, [{transform: 'scale(.97)'}, {transform: 'none'}], {sp: SPb}); speak($('b', r).textContent) });
  $$('.ap-wr', R).forEach((x, i) => an(x, [{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'none'}], {sp: SPs, dl: 80 + i * 40}));
}
function speak(t) { try { const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .9; speechSynthesis.cancel(); speechSynthesis.speak(u) } catch (e) {} }

/* ---------- Профиль: бенто из макета + «назад» и настройки ---------- */
function mProfile(R, ctx) { V.find(v => v.id === 'z21p').mount(R, ctx);
  R.insertAdjacentHTML('beforeend', `<button class="ap-bk ap-tl" aria-label="Назад">${ic('back')}</button><button class="ap-gear" aria-label="Настройки">${ic('gear')}<span>Настройки</span></button>`) }

/* ---------- Плеер эпизода: настоящее видео, слова в субтитрах нажимаются, паузы на фразах ---------- */
const P = {};
function epOf(a) { const f = D[a.k] || D.titanic, i = Math.max(0, Math.min(f.parts.length - 1, a.i | 0)); return {f, i, p: f.parts[i], k: D[a.k] ? a.k : 'titanic'} }
function mPlay(R, ctx, a) { const {f, i, p, k} = epOf(a); R.className = 'scr ap-pl';
  P.pressed = []; P.ep = {k, i};
  const dur = p.d, marks = p.video ? p.ph.map(x => `<i class="m" style="left:${(100 * x.a / dur).toFixed(1)}%"></i>`).join('') : '';
  const img = IMG[(k === 'titanic' ? 'tk' : k === 'wolf' ? 'wk' : '') + (i + 1)] || IMG[BD[k]];
  R.innerHTML = `${SB(0)}<div class="ap-pt"><button class="ap-bk" aria-label="Закрыть">${ic('x')}</button><span><small>${esc(FN[k].toUpperCase())} · ЭПИЗОД ${i + 1} ИЗ ${f.parts.length}</small><b>${esc(p.t)}</b></span>${p.video ? `<button class="ap-pz${ST.pz ? ' on' : ''}">${ST.pz ? 'С паузами' : 'Без пауз'}</button>` : ''}</div>
   <div class="ap-v">${p.video ? `<video playsinline preload="auto" poster="${p.poster}"><source src="${p.video}" type="video/mp4"><source src="${p.video.replace(/\.mp4$/, '.webm')}" type="video/webm"></video>
     <button class="ap-big" aria-label="Смотреть">${ic('play')}</button><div class="ap-subs"></div>` : `<i class="img" style="background-image:url(${img})"></i><div class="ap-nov">Видео в этом тесте — в 5 эпизодах. Тут фразы эпизода, задания — как обычно.</div>`}</div>
   ${p.video ? `<div class="ap-ctl"><button class="ap-pp" aria-label="Пауза">${ic('play')}</button><div class="ap-sk"><i class="f"></i>${marks}</div><time>0:00 / ${mmss(dur)}</time></div>` : ''}
   <div class="ap-bd">
    ${p.video ? `<p class="ap-hint">${ic('info')}<span>Нажми любое слово в субтитрах — объясню, что оно значит именно тут. Жёлтые точки — полезные фразы: на них видео встанет.</span></p>` : ''}
    <div class="ap-plate" hidden></div>
    <div class="ap-phs"><small>ФРАЗЫ ЭПИЗОДА · <b>${p.video ? 0 : p.ph.length}</b> из ${p.ph.length}</small><div class="ap-phl">${p.video ? '' : p.ph.map(phRow).join('')}</div></div>
    <div class="ap-prs" hidden><small>ТЫ НАЖАЛ</small><div></div></div>
   </div>
   <div class="ap-ft"><button class="ap-go${p.video ? '' : ' on'}">${p.video ? 'Сначала посмотри · или сразу к заданиям' : 'К заданиям · 3'}</button></div><i class="hb"></i>`;
  ctx.on($('.ap-go', R), 'click', () => { if (P.v) P.v.pause(); replace('tasks', {k, i, pressed: P.pressed.slice()}) });
  const pz = $('.ap-pz', R); if (pz) ctx.on(pz, 'click', () => { ST.pz = !ST.pz; save(); pz.classList.toggle('on', ST.pz); pz.textContent = ST.pz ? 'С паузами' : 'Без пауз'; toast(R, ST.pz ? 'Видео встанет на полезных фразах' : 'Фразы — плашкой, без остановки') });
  if (!p.video) { P.v = null; return }
  const v = $('video', R), subsEl = $('.ap-subs', R), sf = $('.ap-sk .f', R), tm = $('.ap-ctl time', R), pp = $('.ap-pp', R), big = $('.ap-big', R), plate = $('.ap-plate', R), phl = $('.ap-phl', R), phN = $('.ap-phs b', R);
  P.v = v; ctx.on(v, 'error', () => toast(R, 'Видео не загрузилось — проверь интернет'), {capture: true});
  const subs = p.subs.map(sb => Object.assign({}, sb)), wt = p.wt || [], phs = p.ph.map(x => Object.assign({}, x, {shown: false, seen: false}));
  subs.forEach(sb => { const W = wt.filter(w => w[0] >= sb.a - .4 && w[0] <= sb.b + .4); let j = 0;
    sb.toks = sb.en.split(/(\s+)/).map(tk => { if (!tk.trim()) return {sp: tk}; const n = normW(tk); let t0 = null;
      for (let q = j; q < W.length; q++) if (normW(W[q][2]) === n) { t0 = W[q]; j = q + 1; break }
      return {tk, n, t0: t0 ? t0[0] : null, t1: t0 ? t0[1] : null} }) });
  let curSub = -2, hold = false, plateOn = false, raf = 0;
  const drawSub = k => { curSub = k; const sb = subs[k];
    subsEl.innerHTML = sb ? `<span class="l">${sb.toks.map((t, q) => t.sp != null ? t.sp : `<span class="w" data-wk="${k}" data-wq="${q}">${esc(t.tk)}</span>`).join('')}</span><span class="ru">${esc(sb.ru)}</span>` : '' };
  const seen = x => { if (x.seen) return; x.seen = true; phl.insertAdjacentHTML('beforeend', phRow(x)); phN.textContent = phs.filter(y => y.seen).length; an(phl.lastElementChild, [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], {sp: SPs}) };
  const tick = () => { const t = v.currentTime, k = subs.findIndex(sb => t >= sb.a && t < sb.b + .15);
    if (k !== curSub && !hold) drawSub(k);
    if (k >= 0 && k === curSub) { const sb = subs[k]; $$('.w', subsEl).forEach(w => { const tk = sb.toks[+w.dataset.wq]; w.classList.toggle('on', tk.t0 == null ? true : t >= tk.t0); w.classList.toggle('now', tk.t0 != null && t >= tk.t0 && t < (tk.t1 || tk.t0) + .12) }) }
    sf.style.transform = `scaleX(${Math.min(1, t / (v.duration || dur))})`; tm.textContent = mmss(t) + ' / ' + mmss(v.duration || dur);
    phs.forEach(x => { if (t >= x.b) seen(x) });
    if (ST.pz && !plateOn) { const x = phs.find(x => !x.shown && t >= x.b && t < x.b + 1.2); if (x) { x.shown = true; showPlate(x) } }
    if (!v.paused) raf = requestAnimationFrame(tick) };
  const showPlate = x => { plateOn = true; v.pause();
    plate.hidden = false; plate.innerHTML = `<small>${ic('pause5')}ПАУЗА · ПОЛЕЗНАЯ ФРАЗА</small><b>${esc(x.en)}</b><span>${esc(x.ru)}</span>${x.use ? `<p>${esc(x.use)}</p>` : ''}<button>Дальше ${ic('play')}</button>`;
    an(plate, [{opacity: 0, transform: 'translateY(12px) scale(.98)'}, {opacity: 1, transform: 'none'}], {sp: SPs});
    ctx.on($('button', plate), 'click', () => { plate.hidden = true; plateOn = false; v.play() }) };
  ctx.on(v, 'play', () => { big.classList.add('off'); pp.innerHTML = ic('pause5'); plate.hidden = true; plateOn = false; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick) });
  ctx.on(v, 'pause', () => { pp.innerHTML = ic('play'); tick() });
  ctx.on(v, 'ended', () => { big.classList.remove('off'); phs.forEach(seen); const g = $('.ap-go', R); g.textContent = 'К заданиям · 3'; g.classList.add('on'); toast(R, 'Эпизод досмотрен — теперь 3 задания') });
  ctx.on(v, 'loadedmetadata', tick);
  const playV = () => { const q = v.play(); if (q && q.catch) q.catch(() => toast(R, 'Нажми ещё раз — браузер не дал включить звук')) };
  ctx.on(big, 'click', playV); ctx.on(pp, 'click', () => v.paused ? playV() : v.pause());
  ctx.on($('.ap-v', R), 'click', e => { if (e.target === v) v.paused ? playV() : v.pause() });
  ctx.on($('.ap-sk', R), 'click', e => { const r = e.currentTarget.getBoundingClientRect(); v.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * (v.duration || dur); phs.forEach(x => x.shown = x.b < v.currentTime - .2); tick() });
  ctx.on(subsEl, 'pointerdown', e => { if (e.target.closest('.w')) { hold = true; ctx.t(() => hold = false, 1500) } });
  ctx.on(subsEl, 'click', e => { const w = e.target.closest('.w'); hold = false; if (!w) return; e.stopPropagation(); const sb = subs[+w.dataset.wk], tk = sb.toks[+w.dataset.wq];
    const was = !v.paused; v.pause(); w.classList.add('tap'); wordSheet(R, ctx, tk, sb, v, k, () => { w.classList.remove('tap'); if (was) playV() }) });
  ctx.t(() => { if (v.paused && !v.currentTime) an(big, [{transform: 'scale(1)'}, {transform: 'scale(1.1)'}, {transform: 'scale(1)'}], {d: 700, it: 2}) }, 900);
}
const phRow = x => `<div class="ap-ph"><b>${esc(x.en)}</b><span>${esc(x.ru)}</span></div>`;
function wordSheet(R, ctx, tk, sb, v, k, done) {
  const w = tk.n, here = sb.here[w] != null ? sb.here[w] : sb.here[tk.tk.toLowerCase()];
  const xp = (sb.xp || []).find(x => words(x[0]).map(normW).includes(w)), g = (sb.g || {})[w];
  const main = here && here !== '—' ? here : xp ? xp[1] : here === '—' ? (g || 'тут не переводится') : (window.GLOSS_EN && GLOSS_EN[w]) || '—';
  const cap = here && here !== '—' ? 'так в этой реплике' : xp ? `в выражении «${esc(xp[0])}»` : '';
  const saved = P.pressed.some(x => x.w === w) || ST.saved.some(x => x.w === w);
  const s = document.createElement('div'); s.className = 'q9-tip ap-ws';
  s.innerHTML = `<i class="dm"></i><div class="sh"><i class="gr"></i><div class="hd"><div><small>СЛОВО${lvOf(w)}</small><b>${esc(tk.tk.replace(/[.,!?;:"«»]/g, ''))}</b></div></div>
   <div class="ab"><b>${esc(main)}</b><span>${cap}</span></div>
   ${xp && here && here !== '—' ? `<div class="wd"><small>ВЫРАЖЕНИЕ</small><span><b>${esc(xp[0])}</b></span><span class="tr">${esc(xp[1])}</span></div>` : ''}
   <details class="ap-more"><summary>Подробнее</summary>${g ? `<p><b>Грамматика.</b> ${esc(g)}</p>` : ''}<p><b>${esc(sb.en)}</b><br>${esc(sb.ru)}</p></details>
   <div class="ap-wa">${tk.t0 != null ? `<button class="ap-wp">${ic('snd')}Слово</button>` : ''}<button class="ap-wsv${saved ? ' on' : ''}">${saved ? '★ В твоих словах' : '☆ В мои слова'}</button></div>
   <button class="ok">Понятно</button></div>`;
  R.appendChild(s); const sh = $('.sh', s); an(sh, [{transform: 'translateY(100%)'}, {transform: 'none'}], {sp: SPs}); an($('.dm', s), [{opacity: 0}, {opacity: 1}], {d: 200});
  const close = () => { const z = an(sh, [{transform: 'none'}, {transform: 'translateY(100%)'}], {d: 200, e: EI, f: 'forwards'}); an($('.dm', s), [{opacity: 1}, {opacity: 0}], {d: 200, f: 'forwards'}); const f = () => { s.remove(); done && done() }; if (z) z.onfinish = f; else f() };
  ctx.on($('.dm', s), 'click', close); ctx.on($('.ok', s), 'click', close);
  const wp = $('.ap-wp', s); if (wp) ctx.on(wp, 'click', () => { v.currentTime = Math.max(0, tk.t0 - .05); v.play(); const stop = () => { if (v.currentTime >= tk.t1 + .12) { v.pause(); v.removeEventListener('timeupdate', stop) } }; v.addEventListener('timeupdate', stop) });
  ctx.on($('.ap-wsv', s), 'click', e => { const b = e.currentTarget; if (!P.pressed.some(x => x.w === w)) P.pressed.push({w, r: main, line: sb.en, ru: sb.ru, k}); b.classList.add('on'); b.textContent = '★ В твоих словах';
    const pr = $('.ap-prs', R); pr.hidden = false; $('div', pr).innerHTML = P.pressed.map(x => `<span>${esc(x.w)}</span>`).join(''); toast(R, 'После эпизода выберешь, что учить') });
}
const LVN = ['', 'начинающий', 'базовый', 'средний', 'выше среднего', 'продвинутый'];
function lvOf(w) { const W = window.WLV_EN; if (!W) return ''; for (let i = 1; i <= 5; i++) if ((' ' + (W[i] || '') + ' ').includes(' ' + w + ' ')) return ' · ' + LVN[i]; return '' }

/* ---------- 3 задания после эпизода (и повторение — по 3 за раз) ---------- */
function mkTasks(k, i, rev) {
  let L;
  if (rev) { const pool = []; Object.keys(D).forEach(fk => D[fk].parts.slice(0, Math.max(1, ST.prog[fk])).forEach((p, pi) => p.ph.forEach(f => pool.push({f, k: fk, i: pi, p})))); L = shuffle(pool).slice(0, 3) }
  else { const p = D[k].parts[i]; L = p.ph.slice().sort((a, b) => words(a.en).length - words(b.en).length).slice(0, 3).map(f => ({f, k, i, p})) }
  const all = Object.values(D).flatMap(x => x.parts.flatMap(p => p.ph)), pool = [...new Set(all.flatMap(f => words(f.en)).map(w => w.toLowerCase()))];
  const types = ['build', 'mean', 'listen'];
  return L.map(({f, k: fk, i: pi, p}, n) => {
    let t = types[n % 3]; const src = `${FN[fk]} · эпизод ${pi + 1}`, base = {f, k: fk, i: pi, p, src};
    if (t === 'listen' && !p.video) t = 'mean';
    if (t === 'build') { let target = f.en; if (words(target).length > 7 && f.x && words(f.x).length <= 7 && words(f.x).length >= 2) target = f.x;
      if (words(target).length <= 7) { const W = words(target), low = W.map(x => x.toLowerCase()), extra = shuffle(pool.filter(w => !low.includes(w) && w.length > 1)).slice(0, 2);
        return Object.assign(base, {t, target, W, tiles: shuffle(W.map(w => /^I\b|^I'/.test(w) ? w : w.replace(/^[A-Z]/, c => c.toLowerCase())).concat(extra))}) } t = 'mean' }
    if (t === 'mean') { const tr = (f.trap || []).filter(x => x && x !== f.ru).slice(0, 2); shuffle(all.filter(x => x.ru !== f.ru).map(x => x.ru)).forEach(r => { if (tr.length < 2 && !tr.includes(r)) tr.push(r) });
      return Object.assign(base, {t, opts: shuffle([[f.ru, ''], ...tr.map(r => [r, (f.trap || []).includes(r) ? 'похоже по словам — но тут смысл другой' : 'это из другой реплики'])]), right: f.ru}) }
    const W = words(f.en), cand = W.map((w, q) => [w, q]).filter(([w]) => w.length > 3);
    const mk = () => { const [w, q] = cand[Math.floor(Math.random() * cand.length)] || [W[0], 0]; const sub = shuffle(pool.filter(x => x.length >= w.length - 2 && x.length <= w.length + 2 && x !== w.toLowerCase()))[0] || 'there'; const C = W.slice(); C[q] = sub; return C.join(' ') };
    const o = new Set([W.join(' ')]); let g = 0; while (o.size < 3 && g++ < 30) o.add(mk());
    return Object.assign(base, {t: 'listen', opts: shuffle([...o].map((x, q) => [x, x === W.join(' ') ? '' : 'одно слово подменено — похоже на звук'])), right: W.join(' ')});
  });
}
const KD = {build: 'СОБЕРИ ФРАЗУ', mean: 'ЧТО ЗНАЧИТ', listen: 'НА СЛУХ'};
function mTasks(R, ctx, a) {
  const rev = !!a.rev, T = mkTasks(a.k || 'titanic', a.i | 0, rev); let n = 0, got = 0, first = true;
  R.className = 'scr v8 l8 l11 ap-tk';
  R.innerHTML = `${SB(0)}<div class="l8-hd"><button class="x ap-bk" aria-label="Выйти">${ic('x')}</button><span class="sg">${T.map(() => '<i></i>').join('')}</span><span class="dc">${ic('dict')}<b>${ST.dict}</b></span></div><div class="l8-bd"></div><canvas class="fx"></canvas><video class="ap-hv" playsinline preload="none"></video><i class="hb"></i>`;
  const fx = FX(ctx, $('.fx', R)), bd = $('.l8-bd', R), SG = $$('.l8-hd .sg i', R), dc = $('.l8-hd .dc b', R), hv = $('.ap-hv', R);
  const clip = q => { if (!q.p.video) { speak(q.f.en); return } if (!hv.src.endsWith(q.p.video)) { hv.innerHTML = `<source src="${q.p.video}" type="video/mp4"><source src="${q.p.video.replace(/\.mp4$/, '.webm')}" type="video/webm">`; hv.load() }
    const go = () => { hv.currentTime = Math.max(0, q.f.a - .1); const z = hv.play(); if (z && z.catch) z.catch(() => {}); const stop = () => { if (hv.currentTime >= q.f.b + .15) { hv.pause(); hv.removeEventListener('timeupdate', stop) } }; hv.addEventListener('timeupdate', stop) };
    if (hv.readyState >= 1) go(); else hv.addEventListener('loadedmetadata', go, {once: true}) };
  window.APPX && (APPX.tk = {T, n: () => n});
  function show() { const q = T[n]; first = true; SG.forEach((s, j) => { s.className = j < n ? 'f' : j === n ? 'c' : '' });
    if (q.t === 'build') {
      bd.innerHTML = `<small class="src">${esc(q.src)}</small><small class="kd">${KD.build}</small><b class="q">${esc(q.target === q.f.en ? q.f.ru : 'Выражение из фразы «' + q.f.ru + '»')}</b>
       <div class="ap-cells">${q.W.map(() => '<i></i>').join('')}</div><div class="ap-tiles">${q.tiles.map((w, j) => `<button data-k="${j}">${esc(w)}</button>`).join('')}</div>
       <p class="ap-fix" hidden></p><button class="nx ap-chk">Проверить</button>`;
      const cells = $('.ap-cells', bd), pk = []; let tries = 0, keep = [];
      const draw = () => { cells.innerHTML = q.W.map((_, j) => pk[j] != null ? `<button data-j="${j}" class="${keep.includes(j) ? 'kp' : ''}">${esc(q.tiles[pk[j]])}</button>` : '<i></i>').join(''); $$('.ap-tiles button', bd).forEach(b => b.classList.toggle('used', pk.includes(+b.dataset.k))) };
      ctx.on($('.ap-tiles', bd), 'click', e => { const b = e.target.closest('button'); if (!b || b.classList.contains('used')) return; const j = pk.findIndex((x, i) => x == null && i < q.W.length); const at = j < 0 ? (pk.length < q.W.length ? pk.length : -1) : j; if (at < 0) return; pk[at] = +b.dataset.k; draw(); an(cells.children[at], [{transform: 'translateY(16px) scale(.8)', opacity: .3}, {transform: 'none', opacity: 1}], {sp: SPb}) });
      ctx.on(cells, 'click', e => { const b = e.target.closest('button'); if (!b || b.classList.contains('kp')) return; pk[+b.dataset.j] = null; draw() });
      ctx.on($('.ap-chk', bd), 'click', e => { const chk = e.currentTarget; if (chk.dataset.done) { next(); return }
        const ans = q.W.map((_, j) => pk[j] != null ? q.tiles[pk[j]] : '').map(x => x.toLowerCase().replace(/[^a-z']/g, '')), ok = q.W.map(x => x.toLowerCase().replace(/[^a-z']/g, ''));
        if (ans.some(x => !x)) { toast(R, 'Заполни все клетки'); return }
        const good = ans.every((x, j) => x === ok[j]);
        if (good) { done(true, chk); cells.classList.add('ok'); return }
        tries++; an(cells, [{transform: 'translateX(-6px)'}, {transform: 'translateX(6px)'}, {transform: 'none'}], {d: 260});
        if (tries < 2) { keep = ans.map((x, j) => x === ok[j] ? j : -1).filter(j => j >= 0); pk.forEach((x, j) => { if (!keep.includes(j)) pk[j] = null }); draw();
          const h = q.W.findIndex((_, j) => !keep.includes(j)); if (h >= 0) { const c = cells.children[h]; c.classList.add('hl'); c.textContent = q.W[h][0] } toast(R, 'Верные остались — последняя попытка'); first = false; return }
        const fix = $('.ap-fix', bd); fix.hidden = false; fix.innerHTML = `Вот как правильно: <b>${q.W.map((w, j) => ans[j] === ok[j] ? esc(w) : `<mark>${esc(w)}</mark>`).join(' ')}</b>`; done(false, chk) });
    } else {
      bd.innerHTML = `<small class="src">${esc(q.src)}</small><div class="cx"><button class="pl">${ic('snd')}</button><p class="en">${q.t === 'listen' ? '<u class="hid">· · · послушай · · ·</u>' : esc(q.f.en)}</p><p class="ru hid">перевод — после ответа</p></div>
       <small class="kd">${KD[q.t]}</small><b class="q">${q.t === 'listen' ? 'Что прозвучало?' : 'Что значит эта фраза?'}</b>
       <div class="op">${q.opts.map(([o, why], j) => `<button data-j="${j}"><b>${esc(o)}</b><small>${esc(why)}</small></button>`).join('')}</div><button class="nx" hidden>Дальше ${ic('chev')}</button>`;
      ctx.on($('.pl', bd), 'click', () => { an($('.pl', bd), [{transform: 'scale(.85)'}, {transform: 'none'}], {sp: SPb}); clip(q) });
      if (q.t === 'listen') ctx.t(() => clip(q), 450);
      $$('.op button', bd).forEach(b => ctx.on(b, 'click', () => { const o = q.opts[+b.dataset.j][0], good = o === q.right;
        $$('.op button', bd).forEach(x => { x.disabled = true; const oo = q.opts[+x.dataset.j][0]; x.classList.toggle('ok', oo === q.right); x.classList.toggle('bad', x === b && !good); x.classList.add('sh') });
        const en = $('.en', bd); en.textContent = q.f.en; done(good, b) }));
      ctx.on($('.nx', bd), 'click', next);
    }
    $$('.l8-bd>*', R).forEach((x, j) => an(x, [{opacity: 0, transform: 'translateX(30px)'}, {opacity: 1, transform: 'none'}], {sp: SPs, dl: j * 40}));
  }
  function done(good, el) { const q = T[n]; if (good && first) { got++; ST.dict++; save(); dc.textContent = ST.dict; const r = rel(el, R); fx.burst(r.x + r.w / 2, r.y + r.h / 2, {n: 30, c: ['#4FD18B', '#F6D488', '#fff'], v: 5, g: .1, s: 3, l: 40}) }
    const ru = $('.ru', bd); if (ru) { ru.textContent = q.f.ru; ru.classList.remove('hid') }
    const nx = $('.nx', bd);
    if (q.f.use) nx.insertAdjacentHTML('beforebegin', `<p class="ap-use"><b>Когда пригодится.</b> ${esc(q.f.use)}</p>`);
    if (q.p.video) clip(q); nx.hidden = false; nx.dataset.done = 1; nx.innerHTML = `Дальше ${ic('chev')}`; an(nx, [{opacity: 0, transform: 'translateY(8px)'}, {opacity: 1, transform: 'none'}], {sp: SPs}) }
  function next() { n++; if (n < T.length) { show(); return } hv.pause();
    if (rev) { SG.forEach(s => s.className = 'f'); bd.innerHTML = `<div class="l8-end"><b>${got === T.length ? 'Все три — с первого раза' : `${got} из ${T.length} с первого раза`}</b><p>Ошибки вернутся первыми в следующей порции</p><span class="ad">${T.map(q => `<span><b>${esc(words(q.f.en).slice(0, 4).join(' '))}${words(q.f.en).length > 4 ? '…' : ''}</b><small>${esc(FN[q.k])}</small></span>`).join('')}</span><button class="nx2 ap-more3">Ещё 3 →</button><button class="ap-enough">Хватит на сегодня</button></div>`;
      an($('.l8-end', bd), [{opacity: 0, transform: 'scale(.96)'}, {opacity: 1, transform: 'none'}], {sp: SPs}); ctx.on($('.ap-more3', bd), 'click', () => replace('rev', {rev: 1})); ctx.on($('.ap-enough', bd), 'click', back); return }
    const sv = a.pressed || []; if (sv.length) replace('words', {k: a.k, i: a.i, got, pressed: sv}); else replace('after', {k: a.k, i: a.i, got}) }
  show();
}

/* ---------- Слова, которые ты нажимал: что в повторение (макет «нажатые слова») ---------- */
function mWords(R, ctx, a) { const L = a.pressed || [], {f, i} = epOf(a); R.className = 'scr z22w';
  R.innerHTML = `${SB(0)}<div class="z22w-h"><small>${esc(FN[a.k].toUpperCase())} · ЭПИЗОД ${i + 1} ПРОЙДЕН</small><b>Слова, которые ты нажимал</b><p>Отметь, какие учить, — они придут в повторение завтра.</p></div>
   <div class="z22w-bar"><label class="z22w-all"><input type="checkbox" checked><i></i>Все</label><span class="z22w-n"></span></div>
   <div class="z22w-l">${L.map((x, j) => `<label class="z22w-r" data-i="${j}"><input type="checkbox" checked><i class="cb"></i><span><b>${esc(x.w)}</b><em>${esc(x.r)}</em><small>${esc(x.line)} — ${esc(x.ru)}</small></span><button class="pl" aria-label="Послушать">${ic('play')}</button></label>`).join('')}</div>
   <div class="z22w-ft"><button class="z22w-go">В повторение</button><button class="z22w-sk">Не сейчас</button></div><i class="hb"></i>`;
  const I = $$('.z22w-r input', R), A = $('.z22w-all input', R), N = $('.z22w-n', R), G = $('.z22w-go', R);
  const upd = () => { const c = I.filter(x => x.checked).length; N.textContent = `${c} из ${I.length}`; A.checked = c === I.length; A.indeterminate = c > 0 && c < I.length; G.textContent = c ? `В повторение · ${c}` : 'Ничего не учить' };
  I.forEach(x => ctx.on(x, 'change', upd)); ctx.on(A, 'change', () => { I.forEach(x => x.checked = A.checked); upd() });
  ctx.on($('.z22w-l', R), 'click', e => { const b = e.target.closest('.pl'); if (!b) return; e.preventDefault(); speak(L[+b.closest('.z22w-r').dataset.i].w) });
  const fin = c => { L.forEach((x, j) => { if (I[j].checked && c && !ST.saved.some(s => s.w === x.w)) ST.saved.push(x) }); save(); replace('after', {k: a.k, i: a.i, got: a.got}) };
  ctx.on(G, 'click', () => { const S = $$('.z22w-r', R).filter(r => $('input', r).checked); S.forEach((r, j) => an(r, [{opacity: 1}, {opacity: 0, transform: 'translateY(30px) scale(.9)'}], {d: 300, dl: j * 60, e: EI, f: 'forwards'})); toast(R, S.length ? 'В повторении — первое завтра' : 'Ок, без повторения'); ctx.t(() => fin(1), S.length * 60 + 700) });
  ctx.on($('.z22w-sk', R), 'click', () => fin(0));
  $$('.z22w-r', R).forEach((x, j) => an(x, [{opacity: 0, transform: 'translateX(-16px)'}, {opacity: 1, transform: 'none'}], {sp: SPs, dl: 120 + j * 60})); upd() }

/* ---------- Хватит или ещё (макет «после эпизода»): прогресс сцены, дальше — по желанию ---------- */
function mAfter(R, ctx, a) { const {f, i, k} = epOf(a), N = f.parts.length;
  if (ST.prog[k] <= i) { ST.prog[k] = i + 1; save() }
  const all = new Set(f.parts.flatMap(p => p.ph.flatMap(x => words(x.en).map(normW)))), Y = Math.max(40, Math.round(all.size / 10) * 10);
  const kn = new Set(f.parts.slice(0, ST.prog[k]).flatMap(p => p.ph.flatMap(x => words(x.en).map(normW)))), X = Math.min(Y, Math.round(kn.size * Y / Math.max(1, all.size)));
  const last = i + 1 >= N, deep = Math.min(30, Y - X), pct = Math.round(100 * ST.prog[k] / N);
  R.className = 'scr v8 dp12 dp13 dp13-scene';
  R.innerHTML = `${SB(0)}<div class="dp12-top"><i class="img" style="background-image:url(${IMG[BD[k]]})"></i><i class="sh"></i><small>${esc(FN[k].toUpperCase())} · ЭП. ${i + 1} ПРОЙДЕН · ${a.got == null ? '' : a.got + ' ИЗ 3 С ПЕРВОГО РАЗА'}</small><b>Ты знаешь <em class="n">${X}</em> из ${Y} слов сцены</b></div>
   <div class="dp12-grid">${dots12(Y, X, 0)}</div>
   <p class="dp12-q">Хватит — норм. Хочешь ещё — без проблем.</p>
   <div class="dp12-ch"><button class="dc0" data-a="0"><b>${last ? 'Сцена пройдена' : 'Дальше смотреть'}</b><small>${last ? 'фон сцены — в «Коллекции»' : `эпизод ${i + 2} · «${esc(f.parts[i + 1].t)}» · прогресс останется`}</small></button>
    <button class="dc1" data-a="${deep}"><span class="tg">УГЛУБЛЁННОЕ</span><b>Ещё ${deep} слов</b><small>≈ ${Math.max(2, Math.round(deep / 5))} мин · двумя подходами</small><span class="rw">${card13(SC4[SC4K.indexOf(k)] ? 'p_' + k : 'p_titanic', 'c')}<em>карточка сцены</em></span></button>
    <button class="dc2" data-a="${Y - X}"><span class="tg">ПОЛНОЕ</span><b>Все ${Y}</b><small>≈ ${Math.max(5, Math.round((Y - X) / 4))} мин · частями, когда хочешь</small><span class="rw">${card13('p_' + k, 'g')}<em>золотая карточка + «Знаток сцены»</em></span></button></div>
   <div class="dp13-rw"><small>ЕЩЁ НАГРАДЫ</small>
    <span class="f">${ic('film11')}<span><b>Живой фон фильма</b><small>когда весь «${esc(FN[k])}» на 100 %</small><i class="pb"><i style="--p:${(pct / 100).toFixed(2)}"></i></i></span><em>${pct} %</em></span></div>
   <p class="dp12-nt">Никто не заставляет. Ушёл — вернёшься с того же места.</p><canvas class="fx"></canvas><i class="hb"></i>`;
  const G = $$('.dp12-grid i', R), Nn = $('.dp12-top .n', R), F = FX(ctx, $('.fx', R));
  G.forEach((d, j) => an(d, [{opacity: 0, transform: 'scale(.2)'}, {opacity: 1, transform: 'none'}], {d: 300, dl: 200 + j * 6, e: EO})); countUp(ctx, Nn, X, 1100);
  $$('.dp12-ch button,.dp13-rw>*', R).forEach((b, j) => an(b, [{opacity: 0, transform: 'translateY(18px)'}, {opacity: 1, transform: 'none'}], {sp: SPs, dl: 800 + j * 70}));
  an($('.dp13-rw .pb i', R), [{transform: 'scaleX(0)'}, {transform: 'scaleX(var(--p))'}], {d: 1000, e: EO, f: 'forwards', dl: 1400});
  const prev = n => { G.forEach((d, j) => d.classList.toggle('a', j >= X && j < X + n)); Nn.textContent = X + n; Nn.classList.toggle('up', n > 0) };
  $$('.dp12-ch button', R).forEach(b => { ctx.on(b, 'pointerenter', () => prev(+b.dataset.a)); ctx.on(b, 'pointerleave', () => prev(0)) });
  ctx.on($('.dc0', R), 'click', () => { const S = APP.stack; S.pop(); if (!S.some(e => e.id === 'path' && e.a.k === k)) S.push({id: 'path', a: {k}}); else while (cur().id !== 'path') S.pop();
    if (!last) S.push({id: 'play', a: {k, i: i + 1}}); render('push') });
  ctx.on($('.dc1', R), 'click', e => { prev(deep); const r = rel($('.dp12-grid', R), R); F.burst(r.x + r.w / 2, r.y + r.h / 2, {n: 36, c: ['#2EE6C5', '#fff'], v: 5, g: .05, s: 2.2, l: 44}); ctx.t(() => go('deep'), 450) });
  ctx.on($('.dc2', R), 'click', () => { prev(Y - X); const r = rel($('.dp12-grid', R), R); F.burst(r.x + r.w / 2, r.y + r.h / 2, {n: 44, c: ['#F6D488', '#fff', '#E8B34B'], v: 5, g: .05, s: 2.2, l: 44}); ctx.t(() => go('card'), 450) });
  if (!$('.dp12-top .img', R)) {}
}

/* ---------- старт ---------- */
window.APPX = {go, back, tab, jump, ST, APP};
const h0 = (location.hash || '').slice(1);
if (h0) jump(h0); else tab('home');
addEventListener('hashchange', () => { const h = (location.hash || '').slice(1); if (h) jump(h) });
})();
