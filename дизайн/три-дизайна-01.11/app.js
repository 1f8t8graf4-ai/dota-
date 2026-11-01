// Языки по кино — тестовое приложение: один код, три дизайна (data-d), тема (data-t)
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const A = f => f ? 'a/' + f : '';
const ICO = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1.2"/><rect x="14" y="4.5" width="4" height="15" rx="1.2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  rep: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 14-5.3L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-14 5.3L4 16"/><path d="M4 20v-4h4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  fire: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-2.2 1-3.8 2-5 .2 1.6 1 2.8 2.2 3.2C11 7.6 12 2 12 2zm0 20a7 7 0 0 0 7-7c0-1-.2-2-.5-2.9C18 15 16 17 13.5 17a3 3 0 0 0 3-3c-1.5 1.2-4.5.5-4.5-2 0 0-3 1.5-3 5a3 3 0 0 0 3 3z"/></svg>',
  spk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.6 1 2.5h6c0-.9.3-1.7 1-2.5A6 6 0 0 0 12 3z"/></svg>',
  feed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="2.5" width="14" height="19" rx="3"/><path d="M10 9.5l4 2.5-4 2.5z" fill="currentColor"/></svg>',
};
const LVW = ['', 'Начинающий', 'Базовый', 'Средний', 'Выше среднего', 'Продвинутый'];
const lvBars = n => `<span class="lv" aria-label="${LVW[n]}">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</span>`;
const SC = window.SC, HE = window.HE;
const scOf = id => SC.find(s => s.id === id);
const dur = p => Math.round(p.b - p.a);
const minOf = s => Math.max(1, Math.round(s.parts.reduce((x, p) => x + p.b - p.a, 0) / 60));
const phN = s => s.parts.reduce((x, p) => x + p.ph.length, 0);
const kindW = s => ({film: 'Фильм', series: 'Сериал', interview: 'Интервью'})[s.kind] || 'Сцена';
const yearOf = s => (s.ep.match(/\b(19|20)\d\d\b/) || [''])[0];

// ===== состояние (выдуманный прогресс, чтобы было что показать) =====
const ST = {d: 'studio', t: 'auto', lang: 'en', lv: 3, lvP: 62, streak: 6, goal: 14, goalOf: 20, learned: 132, pause: true, ss: 'm', snd: true, anim: true, storySeen: false,
  done: {'titanic-boat': [0], 'american-psycho-cards': [0, 1, 2], 'sopranos-s01e01': [0], 'durov-tucker': [0]},
  saved: [{w: 'hustle', r: 'суетиться ради денег', sid: 'wolf-of-wall-street'}, {w: 'stuck', r: 'застрял', sid: 'titanic-boat'}, {w: 'subtle', r: 'тонкий, едва заметный', sid: 'american-psycho-cards'}],
  pressed: [], quizOk: 0, quizN: 0, todo: [false, false, false], edit: false};
try { const o = JSON.parse(localStorage.getItem('lk3') || '{}'); ['d', 't', 'ss', 'pause'].forEach(k => { if (o[k] != null) ST[k] = o[k]; }); } catch (e) {}
const save = () => { try { localStorage.setItem('lk3', JSON.stringify({d: ST.d, t: ST.t, ss: ST.ss, pause: ST.pause})); } catch (e) {} };
const isDone = (sid, i) => (ST.done[sid] || []).includes(i);
const nextEp = s => { for (let i = 0; i < s.parts.length; i++) if (!isDone(s.id, i)) return i; return s.parts.length - 1; };
const CONT = 'wolf-of-wall-street';

// ===== каркас: дизайн, тема, навигация =====
const app = $('#app'), sw = $('#sw');
const DES = [
  {id: 'studio', n: 'Студия', d: 'Светлый и спокойный. Всё списками, крупный шрифт, один синий цвет.', c: 'linear-gradient(135deg,#F3F4F6 50%,#2F5BFF 50%)'},
  {id: 'night', n: 'Ночь', d: 'Тёмный, картинки на весь экран, ленты постеров, коралловый акцент.', c: 'linear-gradient(135deg,#08090C 50%,#FF5A4E 50%)'},
  {id: 'bright', n: 'Яркий', d: 'Дружелюбный: плитки, объёмные кнопки, путь как в игре.', c: 'linear-gradient(135deg,#6B4EFF 50%,#FFC83A 50%)'}];
function applyLook() {
  app.dataset.d = ST.d;
  const sys = matchMedia('(prefers-color-scheme: dark)').matches;
  app.dataset.t = ST.d === 'night' ? 'dark' : ST.t === 'auto' ? (sys ? 'dark' : 'light') : ST.t;
  $('#pickL').innerHTML = DES.map(x => `<button class="pick-o${x.id === ST.d ? ' on' : ''}" data-des="${x.id}"><i style="background:${x.c}"></i><span><b>${x.n}</b><small>${x.d}</small></span></button>`).join('');
  $('#dstrip').innerHTML = DES.map(x => `<button class="${x.id === ST.d ? 'on' : ''}" data-des="${x.id}" role="tab" aria-selected="${x.id === ST.d}">${x.n}</button>`).join('');
}
document.addEventListener('click', e => { const b = e.target.closest('[data-des]'); if (b) { ST.d = b.dataset.des; save(); applyLook(); rerender(); } });

let STACK = [{n: 'home'}], TAB = 'home';
const TABS = [['home', 'Меню', ICO.menu], ['dict', 'Словарь', ICO.book], ['prof', 'Профиль', ICO.user]];
function tabsHTML(show) {
  const t = $('#tabs'); t.classList.toggle('hide', !show);
  t.innerHTML = TABS.map(([k, n, ic]) => `<button class="${TAB === k ? 'on' : ''}" data-tab="${k}" aria-label="${n}">${ic}<span>${n}</span></button>`).join('');
}
const TOP = new Set(['home', 'dict', 'prof']);
function render(anim) {
  stopMedia();
  const cur = STACK[STACK.length - 1], f = SCREENS[cur.n];
  const el = document.createElement('div'); el.className = 'scr' + (anim ? ' ' + anim : '') + (TOP.has(cur.n) ? '' : ' full');
  el.innerHTML = f(cur.a || {});
  sw.innerHTML = ''; sw.appendChild(el);
  tabsHTML(TOP.has(cur.n));
  if (AFTER[cur.n]) AFTER[cur.n](el, cur.a || {});
}
const rerender = () => render('');
const go = (n, a) => { STACK.push({n, a}); render('in'); };
const back = () => { if (STACK.length > 1) { STACK.pop(); render('back'); } };
const tab = k => { TAB = k; STACK = [{n: k}]; render('tab'); };
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2200); }
function sheet(html) { $('#sheet').innerHTML = '<div class="grab"></div>' + html; $('#sheetW').classList.add('on'); }
function closeSheet() { $('#sheetW').classList.remove('on'); $$('.subs .w.tap').forEach(x => x.classList.remove('tap')); if (P.v && P.wasPlaying) { P.v.play().catch(() => {}); P.wasPlaying = false; } }
$('#sheetW').addEventListener('click', e => { if (e.target.id === 'sheetW') closeSheet(); });

// ===== Меню =====
const SCREENS = {}, AFTER = {};
function storyBtn() { const s = scOf('titanic-boat'); return `<button class="story${ST.storySeen ? ' seen' : ''}" data-act="story" aria-label="Сегодня"><img src="${A(s.parts[1].th)}" alt=""><span>Сегодня</span></button>`; }
const ava = () => `<button class="ava" data-tab="prof" aria-label="Профиль">А</button>`;
function contInfo() { const s = scOf(CONT), i = nextEp(s), p = s.parts[i]; return {s, i, p}; }
function listScenes() { return SC.filter(s => ST.lang === 'de' ? s.lang === 'de' : s.lang !== 'de'); }
SCREENS.home = () => {
  const {s, i, p} = contInfo(), due = 7, dl = HE[0];
  const L = listScenes();
  const langSeg = `<div class="seg" role="tablist"><button class="${ST.lang === 'en' ? 'on' : ''}" data-act="lang" data-v="en">English</button><button class="${ST.lang === 'de' ? 'on' : ''}" data-act="lang" data-v="de">Deutsch</button></div>`;
  if (ST.d === 'night') return `
    <div class="nh"><img src="${A(s.cover)}" alt="">
      <div class="nh-top">${storyBtn()}<h1 class="menu-t">Меню</h1>${ava()}</div>
      <div class="nh-b"><span class="cap">Продолжить</span><h2>${esc(s.t)}</h2><p>Эпизод ${i + 1} · ${esc(p.t)} · ${dur(p)} с</p>
        <button class="btn" data-act="ep" data-s="${s.id}" data-i="${i}">${ICO.play}Смотреть</button></div></div>
    <button class="npill" data-act="review"><span class="rico" style="background:none;color:var(--acc)">${ICO.rep}</span><b>Повторить</b><span class="due">${due}</span>${ICO.chev}</button>
    <div class="sec"><h2 class="h2">Игры</h2></div>
    <div class="rail"><button class="ngame" data-act="dl"><img src="${dl.img}" alt=""><div><b>Deadlock</b><small>Герои, комиксы, Versus с другом</small></div></button><div class="ngame soon">Скоро ещё</div></div>
    <div class="sec"><h2 class="h2">Что посмотреть</h2><button class="btn s g" data-act="feed">${ICO.feed}Лентой</button></div>
    <div class="pad" style="margin-bottom:12px">${langSeg}</div>
    <div class="rail">${L.map(x => `<button class="pst" data-act="scene" data-s="${x.id}"><img src="${A(x.poster)}" alt=""><b>${esc(x.t)}</b><small>${lvBars(x.lvl)} ${minOf(x)} мин</small></button>`).join('')}</div>`;
  if (ST.d === 'bright') return `
    <div class="st-head">${storyBtn()}<h1 class="menu-t" style="margin:0">Меню</h1>${ava()}</div>
    <div class="bc" style="margin-top:22px"><span class="cap">Продолжить</span><img src="${A(p.th)}" alt=""><b>${esc(s.t)}</b><span style="font-weight:700;opacity:.85">Эпизод ${i + 1} · ${esc(p.t)} · ${dur(p)} с</span>
      <button class="b3d w" data-act="ep" data-s="${s.id}" data-i="${i}">Смотреть</button></div>
    <div class="sec"><h2 class="h2">Сегодня</h2></div>
    <div class="tiles"><button class="tile y" data-act="review"><small>Повторить</small><span class="big">${due}</span><b>фраз</b></button>
      <button class="tile dk" data-act="dl"><img src="${dl.img}" alt=""><small>Игры</small><b style="position:relative">Deadlock</b></button></div>
    <div class="sec"><h2 class="h2">Что посмотреть</h2><button class="btn s g" data-act="feed">Лентой</button></div>
    <div class="pad" style="margin-bottom:12px">${langSeg}</div>
    <div class="cards2">${L.map(x => `<button class="c2" data-act="scene" data-s="${x.id}"><img src="${A(x.poster)}" alt=""><div><b>${esc(x.t)}</b><small>${lvBars(x.lvl)} ${esc(x.lw)} · ${minOf(x)} мин</small></div></button>`).join('')}</div>`;
  return `
    <div class="st-head">${storyBtn()}<span></span>${ava()}</div>
    <h1 class="menu-t">Меню</h1>
    <div class="cont"><div class="cont-r"><img src="${A(p.th)}" alt=""><div><span class="cap">Продолжить</span><b>${esc(s.t)}</b><small>Эпизод ${i + 1} · ${esc(p.t)} · ${dur(p)} с</small><div class="bar"><i style="--w:${Math.round(100 * (ST.done[s.id] || []).length / s.parts.length) || 4}%"></i></div></div></div>
      <button class="btn w" data-act="ep" data-s="${s.id}" data-i="${i}">${ICO.play}Смотреть</button></div>
    <div class="rows" style="margin-top:10px"><button class="row" data-act="review"><span class="rico">${ICO.rep}</span><span class="rt"><b>Повторить</b><small>Фразы, которые пора вспомнить</small></span><span class="due">${due}</span>${ICO.chev}</button></div>
    <div class="sec"><h2 class="h2">Игры</h2></div>
    <div class="rows"><button class="row" data-act="dl"><span class="rico"><img src="${dl.img}" alt="" style="object-fit:cover;object-position:top"></span><span class="rt"><b>Deadlock</b><small>Герои, комиксы, Versus с другом</small></span>${ICO.chev}</button></div>
    <div class="sec"><h2 class="h2">Что посмотреть</h2><button class="btn s g" data-act="feed">${ICO.feed}Лентой</button></div>
    <div class="pad" style="margin-bottom:10px">${langSeg}</div>
    <div class="rows">${L.map(x => `<button class="row" data-act="scene" data-s="${x.id}"><img class="rimg" src="${A(x.parts[0].th || x.cover)}" alt=""><span class="rt"><b>${esc(x.t)}</b><small>${lvBars(x.lvl)} ${esc(x.lw)} · ${minOf(x)} мин · ${phN(x)} фраз</small></span>${ICO.chev}</button>`).join('')}</div>`;
};

// ===== «Сегодня»: истории по очереди =====
function storyOpen() {
  const t = scOf('titanic-boat'), f = t.parts[0].ph[0], w = scOf('wolf-of-wall-street');
  const S = [
    `<img src="${A(t.parts[0].k)}" alt=""><span class="stv-k">Фраза дня · Титаник</span><div class="stv-big">${esc(f.en)}</div><div class="stv-ru">${esc(f.ru)}</div><button class="btn" data-act="ep" data-s="titanic-boat" data-i="0" style="justify-self:start">${ICO.play}Смотреть момент</button>`,
    `<span class="stv-k">Серия</span><div class="stv-big">${ST.streak} дней подряд</div><div class="week">${['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d, k) => `<i class="${k < 6 ? 'on' : ''}">${d}</i>`).join('')}</div><div class="stv-ru">Ответь хоть на одно задание сегодня — серия продолжится.</div>`,
    `<span class="stv-k">Цель дня</span><div class="ring" style="--p:${Math.round(100 * ST.goal / ST.goalOf)};--c:#7CF2B0"><div>${ST.goal}/${ST.goalOf}<small>ответов</small></div></div><div class="stv-ru">Ещё ${ST.goalOf - ST.goal} ответов — и цель выполнена.</div>`,
    `<span class="stv-k">Выучено</span><div class="stv-big">${ST.learned} фразы</div><div class="stv-ru">+8 за неделю. Больше всего — из «Американского психопата».</div>`,
    `<img src="${A(w.cover)}" alt=""><span class="stv-k">Новое от бота</span><div class="stv-big">Добавили «Волка» на немецком</div><div class="stv-ru">Ланч с Ханной и первое свидание с Наоми — в дубляже.</div>`];
  let k = 0, tm = 0;
  const ov = $('#ov'); ov.classList.add('on');
  const draw = () => {
    clearTimeout(tm);
    ov.innerHTML = `<div class="stv"><div class="stv-bars">${S.map((_, j) => `<i class="${j < k ? 'done' : j === k ? 'cur' : ''}"><b></b></i>`).join('')}</div><button class="stv-x" data-act="storyx" aria-label="Закрыть">${ICO.x}</button>
      <div class="stv-s">${S[k]}</div><button class="stv-hit l" data-act="sprev" aria-label="Назад"></button><button class="stv-hit r" data-act="snext" aria-label="Дальше"></button></div>`;
    tm = setTimeout(() => { if ($('.stv')) next(); }, 5000);
  };
  const next = () => { if (k < S.length - 1) { k++; draw(); } else close(); };
  const close = () => { clearTimeout(tm); ov.classList.remove('on'); ov.innerHTML = ''; ST.storySeen = true; rerender(); };
  storyOpen.next = next; storyOpen.prev = () => { if (k > 0) k--; draw(); }; storyOpen.close = close;
  draw();
}

// ===== лента =====
function feedOpen() {
  const ov = $('#ov'); ov.classList.add('on');
  const L = listScenes();
  ov.innerHTML = `<div class="feed">${L.map(s => { const f = s.parts[0].ph[0] || {}; return `<div class="fi"><img src="${A(s.parts[0].k || s.cover)}" alt="" loading="lazy"><span class="cap" style="color:#ddd">${kindW(s)} · ${esc(s.lw)} · ${minOf(s)} мин</span><h3>${esc(s.t)}</h3><span style="color:#ddd">${esc(s.sub)}</span>${f.en ? `<q>${esc(f.en)}</q>` : ''}<button class="btn" data-act="feedgo" data-s="${s.id}">${ICO.play}Смотреть</button></div>`; }).join('')}</div>
    <span class="feed-hint">Листай вверх</span><button class="feed-x" data-act="feedx" aria-label="Закрыть">${ICO.x}</button>`;
}

// ===== сцена: путь у каждого фильма свой =====
function vessel(s) {
  const n = s.parts.length, d = (ST.done[s.id] || []).length, p = d / n, id = s.id;
  let svg, name;
  if (/titanic/.test(id)) { name = 'Иллюминатор наполняется водой'; const y = 86 - 72 * p;
    svg = `<svg viewBox="0 0 96 96"><defs><clipPath id="cp1"><circle cx="48" cy="48" r="36"/></clipPath></defs><circle cx="48" cy="48" r="44" fill="none" stroke="var(--mut)" stroke-width="5"/>${[0, 1, 2, 3, 4, 5].map(k => `<circle cx="${48 + 40 * Math.cos(k * Math.PI / 3)}" cy="${48 + 40 * Math.sin(k * Math.PI / 3)}" r="2.6" fill="var(--mut)"/>`).join('')}<g clip-path="url(#cp1)"><rect x="0" y="0" width="96" height="96" fill="var(--sf2)"/><g style="animation:wave 3s linear infinite"><path d="M-96 ${y} q12 -6 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 V96 H-96Z" fill="#2E8BD8" opacity=".9"/></g></g></svg>`; }
  else if (/wolf/.test(id)) { name = 'График растёт с каждым эпизодом'; const pts = [[10, 80], [26, 70], [40, 74], [54, 56], [68, 48], [86, 22]], m = Math.max(1, Math.round(p * (pts.length - 1)));
    svg = `<svg viewBox="0 0 96 96"><rect x="4" y="4" width="88" height="88" rx="12" fill="var(--sf2)"/>${[30, 50, 70].map(y => `<line x1="10" x2="86" y1="${y}" y2="${y}" stroke="var(--line)"/>`).join('')}<polyline points="${pts.map(q => q.join(',')).join(' ')}" fill="none" stroke="var(--line)" stroke-width="3"/><polyline points="${pts.slice(0, m + 1).map(q => q.join(',')).join(' ')}" fill="none" stroke="#1FBF75" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${pts[m][0]}" cy="${pts[m][1]}" r="5" fill="#1FBF75"/></svg>`; }
  else if (/sopranos/.test(id)) { name = 'Блокнот Мелфи: эпизод — строчка'; svg = `<svg viewBox="0 0 96 96"><rect x="14" y="6" width="68" height="84" rx="6" fill="#FFF6D6"/><rect x="14" y="6" width="68" height="12" rx="6" fill="#E8C66A"/>${[0, 1, 2, 3, 4].map(k => `<line x1="24" x2="74" y1="${32 + k * 12}" y2="${32 + k * 12}" stroke="#D9C9A0"/>${k < Math.round(p * 5) ? `<path d="M24 ${30 + k * 12} l4 4 7 -8" fill="none" stroke="#C0392B" stroke-width="2.5" stroke-linecap="round"/><line x1="40" x2="${60 + (k % 2) * 10}" y1="${31 + k * 12}" y2="${31 + k * 12}" stroke="#3A3A3A" stroke-width="2"/>` : ''}`).join('')}</svg>`; }
  else if (/breaking/.test(id)) { name = 'Молекула собирается по атому'; const P = [[48, 16], [76, 32], [76, 64], [48, 80], [20, 64], [20, 32]], m = Math.round(p * 6);
    svg = `<svg viewBox="0 0 96 96">${P.map((q, k) => `<line x1="${q[0]}" y1="${q[1]}" x2="${P[(k + 1) % 6][0]}" y2="${P[(k + 1) % 6][1]}" stroke="${k < m ? '#3DDC84' : 'var(--line)'}" stroke-width="4"/>`).join('')}${P.map((q, k) => `<circle cx="${q[0]}" cy="${q[1]}" r="8" fill="${k < m ? '#3DDC84' : 'var(--sf2)'}" stroke="var(--line)" stroke-width="2"/>`).join('')}</svg>`; }
  else { name = 'Плёнка: каждый эпизод — кадр'; svg = `<svg viewBox="0 0 96 96"><rect x="8" y="10" width="80" height="76" rx="8" fill="var(--sf2)"/>${Array.from({length: n}, (_, k) => `<rect x="18" y="${18 + k * (60 / n)}" width="60" height="${60 / n - 4}" rx="3" fill="${k < d ? 'var(--acc)' : 'var(--line)'}"/>`).join('')}</svg>`; }
  return `<div class="vess">${svg}<div><b>Налито ${Math.round(p * 100)} %</b><small>${name}. Налей до края — получишь фон сцены.</small></div></div>`;
}
SCREENS.scene = a => {
  const s = scOf(a.s), cur = nextEp(s), mode = a.m || 'path';
  const H = 120, n = s.parts.length;
  const nodes = s.parts.map((p, i) => { const st = isDone(s.id, i) ? 'done' : i === cur ? 'cur' : 'lock'; return {i, st, x: i % 2 ? 68 : 32, y: 70 + i * H, p}; });
  nodes.push({fin: 1, x: 50, y: 70 + n * H});
  const pathD = nodes.map((q, k) => k ? `S ${q.x - (q.x > nodes[k - 1].x ? 18 : -18)} ${q.y - 60} ${q.x} ${q.y}` : `M ${q.x} ${q.y}`).join(' ');
  const path = `<div class="pathw"><div class="path" style="height:${70 + n * H + 80}px"><svg class="ln" viewBox="0 0 100 ${70 + n * H + 80}" preserveAspectRatio="none"><path d="${pathD}" fill="none" stroke="var(--line)" stroke-width="2.4" stroke-dasharray="0.1 5" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>
    ${nodes.map(q => q.fin ? `<div class="node fin" style="left:50%;top:${q.y}px"><button class="nb" data-act="toast" data-t="Финал сцены откроется после всех эпизодов">${ICO.star}</button><b>Финал и фон сцены</b></div>`
      : `<div class="node ${q.st}" style="left:${q.x}%;top:${q.y}px"><button class="nb" data-act="${q.st === 'lock' ? 'toast' : 'ep'}" data-t="Сначала пройди эпизод ${q.i}" data-s="${s.id}" data-i="${q.i}" aria-label="Эпизод ${q.i + 1}">${q.st === 'done' ? ICO.check : q.st === 'lock' ? ICO.lock : q.i + 1}</button><b>${esc(q.p.t)}</b><small>${dur(q.p)} с · ${q.p.ph.length} фраз</small></div>`).join('')}</div></div>`;
  const list = `<div class="plist">${s.parts.map((p, i) => `<button class="row" data-act="${isDone(s.id, i) || i === cur ? 'ep' : 'toast'}" data-t="Сначала пройди эпизод ${i}" data-s="${s.id}" data-i="${i}"><img class="rimg" src="${A(p.th)}" alt=""><span class="rt"><b>${i + 1}. ${esc(p.t)}</b><small>${dur(p)} с · ${p.ph.length} фраз${isDone(s.id, i) ? ' · пройден' : ''}</small></span>${isDone(s.id, i) ? `<span style="color:var(--good)">${ICO.check}</span>` : ICO.chev}</button>`).join('')}</div>`;
  return `<div class="sc-hero"><img src="${A(s.cover)}" alt=""><div class="top"><button class="ib" data-act="back" aria-label="Назад">${ICO.back}</button></div></div>
    <div class="sc-t"><h1>${esc(s.t)}</h1><p>${esc(s.sub)}</p><div class="metas"><span class="chip">${kindW(s)}${yearOf(s) ? ' · ' + yearOf(s) : ''}</span><span class="chip">${lvBars(s.lvl)} ${esc(s.lw)}</span><span class="chip">${n} эпизода · ${minOf(s)} мин</span></div></div>
    ${vessel(s)}
    <div class="sec"><h2 class="h2">Эпизоды</h2><div class="seg"><button class="${mode === 'path' ? 'on' : ''}" data-act="scmode" data-s="${s.id}" data-m="path">Путь</button><button class="${mode === 'list' ? 'on' : ''}" data-act="scmode" data-s="${s.id}" data-m="list">Список</button></div></div>
    ${mode === 'path' ? path : list}
    <div class="pad" style="margin-top:14px"><button class="btn w" data-act="ep" data-s="${s.id}" data-i="${cur}">${ICO.play}${isDone(s.id, 0) ? 'Продолжить · эпизод ' + (cur + 1) : 'Смотреть эпизод 1'}</button></div>
    <div style="height:30px"></div>`;
};

// ===== эпизод: видео, слова нажимаются, паузы на фразах =====
const P = {v: null, wasPlaying: false};
function stopMedia() { if (P.v) { try { P.v.pause(); } catch (e) {} } P.v = null; cancelAnimationFrame(P.raf); if (SONAR.raf) cancelAnimationFrame(SONAR.raf); SONAR.raf = 0; }
const normW = w => w.toLowerCase().replace(/[^a-zäöüß'’]/gi, '').replace(/’/g, "'");
SCREENS.ep = a => {
  const s = scOf(a.s), i = +a.i, p = s.parts[i];
  ST.pressed = []; ST.curEp = {s: s.id, i};
  const marks = p.video ? p.ph.map(f => `<i class="m" style="left:${(100 * (f.a - p.a) / (p.b - p.a)).toFixed(1)}%"></i>`).join('') : '';
  return `<div class="ep-top"><button class="ib" data-act="back" aria-label="Назад">${ICO.back}</button><b>Эпизод ${i + 1} · ${esc(p.t)}<small>${esc(s.t)}</small></b>
      <button class="chip${ST.pause ? ' on' : ''}" data-act="pz">${ST.pause ? 'С паузами' : 'Без пауз'}</button></div>
    <div class="player" id="pl">${p.video ? `<video id="vid" playsinline preload="auto" poster="${A(p.th)}"><source src="${p.video}" type="video/mp4"><source src="${p.video.replace(/\.mp4$/, '.webm')}" type="video/webm"></video><button class="bigplay" id="bp" data-act="vplay" aria-label="Смотреть">${'<span>' + ICO.play + '</span>'}</button><div class="subs" id="subs" style="--ss:${{s: '14px', m: '17px', l: '20px'}[ST.ss]}"></div>`
      : `<img src="${A(p.k || p.th)}" alt=""><div class="noV">В тесте видео есть только в двух эпизодах: «Титаник» и «Волк», эпизод 1. Тут — кадр и фразы эпизода.</div>`}</div>
    ${p.video ? `<div class="pctl"><button class="pp" id="ppb" data-act="vtog" aria-label="Пауза">${ICO.play}</button><div class="seek" id="seek"><i class="f" id="sf"></i>${marks}</div><time id="tm">0:00 / ${Math.floor(dur(p) / 60)}:${String(dur(p) % 60).padStart(2, '0')}</time></div>` : ''}
    <div class="ep-body">
      <div class="hint">${ICO.bulb}<span>${p.video ? 'Нажимай на любое слово в субтитрах — объясню, что оно значит именно тут. Жёлтые точки на шкале — фразы, на которых видео встанет.' : 'Посмотри фразы эпизода — потом три коротких задания.'}</span></div>
      ${p.video ? '' : `<div class="phl">${p.ph.map(f => `<div class="phr"><b>${esc(f.en)}</b><span>${esc(f.ru)}</span></div>`).join('')}</div>`}
      <button class="btn w" data-act="quiz" data-s="${s.id}" data-i="${i}" id="toQuiz">К заданиям · 3</button>
    </div>`;
};
AFTER.ep = (el, a) => {
  const s = scOf(a.s), p = s.parts[+a.i], v = $('#vid', el); if (!v) return;
  P.v = v; const subsEl = $('#subs', el), sf = $('#sf', el), tm = $('#tm', el), ppb = $('#ppb', el), bp = $('#bp', el);
  const subs = p.subs || [], wt = p.wt || [], phs = p.ph.map(f => ({...f, ra: f.a - p.a, rb: f.b - p.a, shown: false}));
  let curSub = -1, plateOn = false, hold = false;
  // слова строки → время каждого слова (по порядку, в окне строки)
  subs.forEach(sb => { const W = wt.filter(w => w[0] >= sb.a - 0.4 && w[0] <= sb.b + 0.4); let j = 0;
    sb.toks = sb.en.split(/(\s+)/).map(tk => { if (!tk.trim()) return {sp: tk}; const n = normW(tk); let t0 = null;
      for (let q = j; q < W.length; q++) if (normW(W[q][2]) === n) { t0 = W[q]; j = q + 1; break; }
      return {tk, n, t0: t0 ? t0[0] : null, t1: t0 ? t0[1] : null}; }); });
  const fmt = x => Math.floor(x / 60) + ':' + String(Math.floor(x % 60)).padStart(2, '0');
  const drawSub = k => { curSub = k; const sb = subs[k];
    subsEl.innerHTML = sb ? `<span class="l">${sb.toks.map((t, q) => t.sp != null ? t.sp : `<span class="w" data-wk="${k}" data-wq="${q}">${esc(t.tk)}</span>`).join('')}</span>${'<span class="ru">' + esc(sb.ru) + '</span>'}` : ''; };
  const tick = () => {
    const t = v.currentTime, k = subs.findIndex(sb => t >= sb.a && t < sb.b + 0.15);
    if (k !== curSub && !hold) drawSub(k);
    if (k >= 0) { const sb = subs[k]; $$('.w', subsEl).forEach(w => { const tk = sb.toks[+w.dataset.wq]; const on = tk.t0 == null ? t >= sb.a : t >= tk.t0; w.classList.toggle('on', on); w.classList.toggle('now', tk.t0 != null && t >= tk.t0 && t < (tk.t1 || tk.t0) + 0.12); }); }
    sf.style.width = (100 * t / (v.duration || dur(p))) + '%'; tm.textContent = fmt(t) + ' / ' + fmt(v.duration || dur(p));
    if (ST.pause && !plateOn) { const f = phs.find(f => !f.shown && t >= f.rb && t < f.rb + 1.2); if (f) { f.shown = true; plate(f); } }
    if (!v.paused) P.raf = requestAnimationFrame(tick);
  };
  const plate = f => { plateOn = true; v.pause();
    const d = document.createElement('div'); d.className = 'plate'; d.innerHTML = `<span class="cap">Фраза эпизода</span><b>${esc(f.en)}</b><span class="ru">${esc(f.ru)}</span>${f.use ? `<span class="use">${esc(f.use)}</span>` : ''}<button class="btn">Дальше ${ICO.play}</button>`;
    $('#pl', el).appendChild(d); $('button', d).onclick = () => { d.remove(); plateOn = false; v.play(); }; };
  v.addEventListener('play', () => { bp.classList.add('off'); ppb.innerHTML = ICO.pause; P.raf = requestAnimationFrame(tick); });
  v.addEventListener('pause', () => { ppb.innerHTML = ICO.play; tick(); });
  v.addEventListener('ended', () => { bp.classList.remove('off'); $('#toQuiz', el).classList.add('pulse'); toast('Эпизод досмотрен — теперь 3 задания'); });
  v.addEventListener('loadedmetadata', tick);
  $('#seek', el).addEventListener('click', e => { const r = e.currentTarget.getBoundingClientRect(); v.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * (v.duration || dur(p)); phs.forEach(f => f.shown = f.rb < v.currentTime - 0.2); tick(); });
  subsEl.addEventListener('pointerdown', e => { if (e.target.closest('.w')) { hold = true; setTimeout(() => hold = false, 1500); } });
  subsEl.addEventListener('click', e => { const w = e.target.closest('.w'); hold = false; if (!w) return; const sb = subs[+w.dataset.wk], tk = sb.toks[+w.dataset.wq];
    P.wasPlaying = !v.paused; v.pause(); w.classList.add('tap'); wordSheet(tk, sb, v); });
  P.play = () => v.play().catch(() => toast('Нажми ещё раз — браузер не дал включить звук'));
  P.tog = () => v.paused ? P.play() : v.pause();
};
function wordSheet(tk, sb, v) {
  const w = tk.n, here = sb.here[w], xp = (sb.xp || []).find(x => normW(x[0]).length && x[0].toLowerCase().split(/\s+/).map(normW).includes(w));
  const g = (sb.g || {})[w];
  const main = here && here !== '—' ? here : xp ? xp[1] : here === '—' ? 'тут не переводится' : '—';
  const saved = ST.pressed.some(x => x.w === w);
  sheet(`<p class="wd">${esc(tk.tk.replace(/[.,!?;:"]/g, ''))}</p><div class="wd-here">${esc(main)}</div><div class="cap">${here && here !== '—' ? 'так в этой реплике' : xp ? `в выражении «${esc(xp[0])}»` : ''}</div>
    ${xp && here && here !== '—' ? `<div class="wd-k">Выражение</div><div class="wd-x"><b>${esc(xp[0])}</b>${esc(xp[1])}</div>` : ''}
    ${g ? `<div class="wd-k">Грамматика</div><div class="wd-x">${esc(g)}</div>` : ''}
    <div class="wd-k">Вся реплика</div><div class="wd-x"><b>${esc(sb.en)}</b>${esc(sb.ru)}</div>
    <div class="wd-acts">${tk.t0 != null ? `<button class="btn g" id="wPlay">${ICO.spk}Слово</button>` : ''}<button class="btn${saved ? ' g' : ''}" id="wSave">${saved ? 'Уже в списке' : 'Запомнить'}</button></div>`);
  const wp = $('#wPlay'); if (wp) wp.onclick = () => { v.currentTime = Math.max(0, tk.t0 - 0.05); v.play(); const stop = () => { if (v.currentTime >= tk.t1 + 0.12) { v.pause(); v.removeEventListener('timeupdate', stop); } }; v.addEventListener('timeupdate', stop); P.wasPlaying = false; };
  $('#wSave').onclick = () => { if (!ST.pressed.some(x => x.w === w)) ST.pressed.push({w, r: main, line: sb.en}); toast('Слово попадёт в список после эпизода'); closeSheet(); };
}

// ===== задания: 3 штуки, потом «хватит или ещё» =====
const shuffle = L => L.map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
const words = t => t.replace(/[.,!?;:"«»—]/g, ' ').split(/\s+/).filter(Boolean);
function mkTasks(s, i, deep) {
  const p = s.parts[i], all = s.parts.flatMap(q => q.ph), L = deep ? p.ph.slice(3).concat(p.ph).slice(0, 3) : p.ph.slice(0, 3);
  const pool = [...new Set(all.flatMap(f => words(f.en)).map(w => w.toLowerCase()))];
  const types = deep ? ['mean', 'build', 'listen'] : ['build', 'mean', 'listen'];
  return L.map((f, k) => {
    let t = types[k % 3];
    if (t === 'listen' && !p.video) t = 'gap';
    if (t === 'build') { let target = f.en; if (words(target).length > 7 && f.x && words(f.x).length <= 7) target = f.x; if (words(target).length > 7) t = 'mean'; else {
      const W = words(target), extra = shuffle(pool.filter(w => !W.map(x => x.toLowerCase()).includes(w))).slice(0, 2);
      return {t, f, target, W, tiles: shuffle(W.map(w => w.replace(/^[A-Z]/, c => /^I\b/.test(w) ? c : c.toLowerCase())).concat(extra))}; } }
    if (t === 'mean') { const tr = (f.trap || []).slice(0, 2); shuffle(all.filter(x => x.ru !== f.ru).map(x => x.ru)).forEach(r => { if (tr.length < 2) tr.push(r); }); return {t, f, opts: shuffle([f.ru, ...tr]), right: f.ru}; }
    if (t === 'listen') { const W = words(f.en), cand = W.map((w, q) => [w, q]).filter(([w]) => w.length > 3);
      const mk = () => { const [w, q] = cand[Math.floor(Math.random() * cand.length)] || [W[0], 0]; const sub = shuffle(pool.filter(x => x.length >= w.length - 2 && x.length <= w.length + 2 && x !== w.toLowerCase()))[0] || 'there'; const C = W.slice(); C[q] = sub; return C.join(' '); };
      const o = new Set([f.en]); let g = 0; while (o.size < 3 && g++ < 20) o.add(mk());
      return {t, f, opts: shuffle([...o]), right: f.en, p}; }
    const W = words(f.en), gw = f.gap && W.find(w => w.toLowerCase() === f.gap.toLowerCase()) || W.slice().sort((a, b) => b.length - a.length)[0];
    return {t: 'gap', f, line: f.en.replace(new RegExp('\\b' + gw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b'), '_____'), opts: shuffle([gw, ...shuffle(pool.filter(x => x !== gw.toLowerCase() && x.length > 2)).slice(0, 2)]), right: gw};
  });
}
const Q = {};
SCREENS.quiz = a => {
  const s = scOf(a.s), i = +a.i;
  if (!a.k) { Q.T = mkTasks(s, i, a.deep); Q.k = 0; Q.res = []; Q.s = s; Q.i = i; Q.deep = a.deep; Q.try = 0; a.k = 1; }
  return `<div class="qz"><div class="qz-top"><button class="ib" data-act="back" aria-label="Выйти">${ICO.x}</button><div class="qsegs">${Q.T.map((_, k) => `<i class="${k < Q.k ? 'd ' + (Q.res[k] ? 'ok' : 'no') : ''}"><b></b></i>`).join('')}</div></div>
    <div class="qz-b" id="qb"></div><div id="qf"></div></div>`;
};
AFTER.quiz = el => { if (!Q.T.length) { $('#qb', el).innerHTML = '<p class="qq">В этом эпизоде нет фраз для заданий.</p>'; $('#qf', el).innerHTML = '<div class="qz-f"><button class="btn w" data-act="back">Назад</button></div>'; return; } drawTask(el); };
function drawTask(el) {
  const q = Q.T[Q.k], b = $('#qb', el), f = $('#qf', el); f.innerHTML = ''; Q.try = 0;
  const K = {build: 'Собери фразу', mean: 'Что значит?', listen: 'Что прозвучало?', gap: 'Какое слово пропущено?'}[q.t];
  if (q.t === 'build') {
    b.innerHTML = `<span class="qk">${K}</span><div class="qru">${esc(q.target === q.f.en ? q.f.ru : 'Выражение из фразы: ' + q.f.ru)}</div><div class="slots" id="sl"></div><div class="pool" id="po">${q.tiles.map((w, k) => `<button class="tl" data-k="${k}">${esc(w)}</button>`).join('')}</div>`;
    f.innerHTML = `<div class="qz-f"><button class="btn w" id="chk">Проверить</button></div>`;
    const sl = $('#sl', b), po = $('#po', b), picked = [];
    const redraw = () => { sl.innerHTML = picked.map((k, j) => `<button class="tl" data-j="${j}">${esc(q.tiles[k])}</button>`).join(''); $$('.tl', po).forEach(t => t.classList.toggle('used', picked.includes(+t.dataset.k))); };
    po.onclick = e => { const t = e.target.closest('.tl'); if (!t || t.classList.contains('used')) return; picked.push(+t.dataset.k); redraw(); };
    sl.onclick = e => { const t = e.target.closest('.tl'); if (!t) return; picked.splice(+t.dataset.j, 1); redraw(); };
    $('#chk', f).onclick = () => { const got = picked.map(k => q.tiles[k].toLowerCase()), want = q.W.map(w => w.toLowerCase()), ok = got.join(' ') === want.join(' ');
      if (ok) return answer(el, true);
      Q.try++; $$('.tl', sl).forEach((t, j) => t.classList.add(got[j] === want[j] ? 'ok' : 'no'));
      if (Q.try >= 2) return answer(el, false, q.target);
      toast('Почти. Зелёные — на месте, попробуй ещё раз'); setTimeout(() => { for (let j = picked.length - 1; j >= 0; j--) if (got[j] !== want[j]) picked.splice(j, 1); redraw(); $$('.tl', sl).forEach(t => t.classList.add('ok')); }, 700); };
  } else {
    const head = q.t === 'mean' ? `<p class="qq">${esc(q.f.en)}</p>` : q.t === 'gap' ? `<p class="qq">${esc(q.line)}</p><div class="qru">${esc(q.f.ru)}</div>` : `<button class="listen" id="lis" aria-label="Послушать">${ICO.spk}</button><div class="qru" style="text-align:center">Послушай момент из эпизода</div>`;
    b.innerHTML = `<span class="qk">${K}</span>${head}<div class="opts">${q.opts.map((o, k) => `<button class="opt" data-o="${k}"><i>${k + 1}</i><span>${esc(o)}</span></button>`).join('')}</div>`;
    if (q.t === 'listen') { const lv = document.createElement('video'); lv.src = lv.canPlayType('video/mp4; codecs="avc1.640028"') ? q.p.video : q.p.video.replace(/\.mp4$/, '.webm'); lv.preload = 'auto'; lv.playsInline = true; P.v = lv;
      const playSeg = () => { lv.currentTime = Math.max(0, q.f.a - q.p.a - 0.1); lv.play().catch(() => toast('Нажми ещё раз')); const st = () => { if (lv.currentTime >= q.f.b - q.p.a + 0.2) { lv.pause(); lv.removeEventListener('timeupdate', st); } }; lv.addEventListener('timeupdate', st); };
      $('#lis', b).onclick = playSeg; }
    $('.opts', b).onclick = e => { const o = e.target.closest('.opt'); if (!o || Q.lock) return; const v = q.opts[+o.dataset.o], ok = v === q.right;
      o.classList.add(ok ? 'ok' : 'no'); if (!ok) $$('.opt', b).forEach(x => { if (q.opts[+x.dataset.o] === q.right) x.classList.add('ok'); });
      answer(el, ok, q.right); };
  }
}
function answer(el, ok, right) {
  const q = Q.T[Q.k]; Q.res[Q.k] = ok; Q.lock = true;
  const segs = $$('.qsegs i', el); segs[Q.k].className = 'd ' + (ok ? 'ok' : 'no');
  $('#qf', el).innerHTML = `<div class="fb ${ok ? 'ok' : 'no'}"><b>${ok ? 'Верно!' : 'Не совсем'}</b>${ok ? '' : `<p>Правильно: <b style="font-size:inherit;color:var(--ink)">${esc(right)}</b></p>`}${q.f.use ? `<p><span class="mut">Когда пригодится:</span> ${esc(q.f.use)}</p>` : ''}<button class="btn w" id="nx">${Q.k < Q.T.length - 1 ? 'Дальше' : 'Готово'}</button></div>`;
  $('#nx', el).onclick = () => { Q.lock = false; Q.k++; if (Q.k < Q.T.length) drawTask(el); else { ST.quizOk = Q.res.filter(Boolean).length; ST.quizN = Q.T.length; STACK.pop(); go('more', {s: Q.s.id, i: Q.i}); } };
  if (ok) ST.goal = Math.min(ST.goalOf, ST.goal + 1);
}
SCREENS.more = a => {
  const pct = Math.round(100 * ST.quizOk / ST.quizN);
  return `<div class="top"><button class="ib" data-act="back" aria-label="Назад">${ICO.back}</button></div><div class="more">
    <div class="ringA" style="--p:${pct}"><div>${ST.quizOk}/${ST.quizN}<small>с первого раза</small></div></div>
    <h2>${ST.quizOk === ST.quizN ? 'Чисто! Хватит или ещё?' : 'Хватит или ещё?'}</h2><p>Можно закончить эпизод — или углубить: ещё 3 задания по этим же фразам, другими способами.</p>
    <div class="btns"><button class="btn w" data-act="result" data-s="${a.s}" data-i="${a.i}">Хватит — к итогу</button><button class="btn w g" data-act="deep" data-s="${a.s}" data-i="${a.i}">Ещё 3 — углубить эпизод</button></div></div>`;
};
SCREENS.result = a => {
  const s = scOf(a.s), i = +a.i, p = s.parts[i];
  if (!isDone(s.id, i)) (ST.done[s.id] = ST.done[s.id] || []).push(i);
  const und = Math.min(98, 70 + ST.quizOk * 7 + i * 2);
  const pw = ST.pressed.length ? ST.pressed : [{w: 'without', r: 'без', line: "I'm not going without you."}, {w: 'stuck', r: 'застрял', line: '—'}];
  ST.pwSel = pw.map(() => true);
  return `<div class="top"><button class="ib" data-act="back" aria-label="Назад">${ICO.back}</button></div><div class="res">
    <h1>Эпизод <em>пройден</em></h1>
    <div class="card und"><span class="cap">Понимаешь</span><br><b>${und} %</b><div class="bar" style="margin-top:10px"><i style="--w:${und}%"></i></div><small>По 50 ключевым словам эпизода: столько ты уже знаешь. Незнакомое — в следующих заданиях.</small></div>
    <div class="flip" id="flip" role="button" tabindex="0" aria-label="Перевернуть карточку"><div class="flip-in"><div class="flip-f"><div>Награда · кадр<small>нажми, чтобы перевернуть</small></div></div><div class="flip-b"><img src="${A(p.k || p.th)}" alt=""></div></div></div>
    ${p.fact ? `<button class="fact" id="fact"><b>Интересный факт · нажми</b><p>${esc(p.fact)}</p></button>` : ''}
    <div class="card"><span class="cap">Слова, которые ты нажимал${ST.pressed.length ? '' : ' (пример)'}</span><div class="pw" id="pw" style="margin-top:10px">
      <button class="pwr on" data-all="1"><i>${ICO.check}</i><span><b>Все</b></span></button>
      ${pw.map((x, k) => `<button class="pwr on" data-k="${k}"><i>${ICO.check}</i><span><b>${esc(x.w)}</b><small>${esc(x.r)}</small></span></button>`).join('')}</div>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn" style="flex:1" id="pwGo">В повторение · ${pw.length}</button><button class="btn g" id="pwNo">Не сейчас</button></div></div>
    ${i + 1 < s.parts.length ? `<button class="btn w" data-act="ep" data-s="${s.id}" data-i="${i + 1}">Следующий эпизод ${ICO.play}</button>` : ''}<button class="btn w g" data-act="scene" data-s="${s.id}">К сцене</button></div>`;
};
AFTER.result = el => {
  $('#flip', el).onclick = e => e.currentTarget.classList.toggle('on');
  const fc = $('#fact', el); if (fc) fc.onclick = () => fc.classList.toggle('on');
  const pw = $('#pw', el), upd = () => { const n = ST.pwSel.filter(Boolean).length; $('#pwGo', el).textContent = 'В повторение · ' + n; const all = $('[data-all]', pw); all.classList.toggle('on', n === ST.pwSel.length); };
  pw.onclick = e => { const r = e.target.closest('.pwr'); if (!r) return; if (r.dataset.all) { const on = !ST.pwSel.every(Boolean); ST.pwSel = ST.pwSel.map(() => on); $$('[data-k]', pw).forEach(x => x.classList.toggle('on', on)); } else { const k = +r.dataset.k; ST.pwSel[k] = !ST.pwSel[k]; r.classList.toggle('on', ST.pwSel[k]); } upd(); };
  $('#pwGo', el).onclick = () => { toast('Добавил в повторение: ' + ST.pwSel.filter(Boolean).length); };
  $('#pwNo', el).onclick = () => toast('Ок, слова не трогаю');
};

// ===== словарь: «Мои фразы и слова» (структура как в приложении) =====
function myPhrases() { const R = []; Object.entries(ST.done).forEach(([sid, L]) => { const s = scOf(sid); L.forEach(i => s.parts[i].ph.forEach((f, k) => R.push({s, i, f, st: (k * 7 + i) % 5}))); }); return R; }
SCREENS.dict = a => {
  const kind = a.k || 'ph', M = myPhrases(), q = (a.q || '').toLowerCase();
  const byFilm = {}; M.filter(x => !q || (x.f.en + x.f.ru).toLowerCase().includes(q)).forEach(x => (byFilm[x.s.id] = byFilm[x.s.id] || []).push(x));
  const dots = st => `<span class="dots">${[0, 1, 2].map(k => `<i class="${st === 4 ? 'dd' : k < st % 4 ? 'on' : ''}"></i>`).join('')}</span>`;
  const body = kind === 'ph' ? Object.entries(byFilm).map(([sid, L]) => { const s = scOf(sid), lrn = L.filter(x => x.st === 3).length;
    const eps = [...new Set(L.map(x => x.i))];
    return `<details class="dc"${a.open === sid ? ' open' : ''}><summary><img src="${A(s.cover)}" alt=""><span><small>${kindW(s)}</small><b>${esc(s.t)}</b><div class="bar"><i style="--w:${Math.max(6, Math.round(100 * lrn / L.length))}%"></i></div></span><span class="n">${L.length}</span></summary>
      <div class="dcb"><div class="dc-acts"><button class="btn s" data-act="review">Тренировать ${L.length}</button><button class="btn s g" data-act="toast" data-t="«Подряд» показывает моменты фраз один за другим">${ICO.play}подряд</button></div>
      ${eps.map(i => `<div class="epk">Эпизод ${i + 1} · ${esc(s.parts[i].t)}</div>${L.filter(x => x.i === i).map(x => `<button class="dr" data-act="phs" data-s="${sid}" data-i="${i}" data-j="${x.f.j}"><span><b>${esc(x.f.en)}</b><small>${esc(x.f.ru)}</small></span>${dots(x.st)}</button>`).join('')}`).join('')}</div></details>`; }).join('')
    : `<div class="pad" style="display:grid;gap:8px;margin-top:12px">${ST.saved.concat(ST.pressed.map(x => ({...x, sid: ST.curEp && ST.curEp.s}))).map(x => `<div class="dr"><span><b>${esc(x.w)}</b><small>${esc(x.r)}</small></span><span class="cap">${esc((scOf(x.sid) || {}).t || '')}</span></div>`).join('')}</div>`;
  return `<div class="top"><h1 class="h1" style="font-size:28px">Мои фразы и слова</h1></div>
    <div class="pad" style="margin:6px 0 4px"><div class="seg"><button class="${kind === 'ph' ? 'on' : ''}" data-act="dk" data-k="ph">Фразы ${M.length}</button><button class="${kind === 'w' ? 'on' : ''}" data-act="dk" data-k="w">Слова ${ST.saved.length + ST.pressed.length}</button></div></div>
    <label class="srch">${ICO.search}<input id="dq" placeholder="Поиск по фразам и словам" value="${esc(a.q || '')}" aria-label="Поиск"></label>
    <button class="dueb" data-act="review"><b>Повторить сегодня</b><span class="due" style="background:#fff;color:var(--acc)">7</span>${ICO.chev}</button>
    ${body || '<p class="pad mut">Ничего не нашлось.</p>'}`;
};
AFTER.dict = (el, a) => { const i = $('#dq', el); i.oninput = () => { clearTimeout(i.t); i.t = setTimeout(() => { STACK[STACK.length - 1].a = {...a, q: i.value}; rerender(); const n = $('#dq'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); }; };
function phSheet(sid, i, j) { const s = scOf(sid), f = s.parts[i].ph.find(x => x.j === +j);
  sheet(`<span class="cap">${esc(s.t)} · эпизод ${i + 1}</span><p class="wd" style="font-size:26px;margin-top:6px">${esc(f.en)}</p><div class="wd-here" style="color:var(--mut);font-weight:600;font-size:17px">${esc(f.ru)}</div>
    ${f.use ? `<div class="wd-k">Когда пригодится</div><div class="wd-x">${esc(f.use)}</div>` : ''}${f.kw ? `<div class="wd-k">Важное слово</div><div class="wd-x"><b>${esc(f.kw[0])}</b>${esc(f.kw[1])}</div>` : ''}
    <div class="wd-acts"><button class="btn g" data-act="sheetx">Закрыть</button><button class="btn" data-act="ep" data-s="${sid}" data-i="${i}">${ICO.play}Эпизод</button></div>`); }

// ===== повторение: по 3 =====
SCREENS.review = a => {
  const M = myPhrases(); if (!a.L) { a.L = shuffle(M).slice(0, 9); a.k = 0; a.ok = 0; }
  const part = a.L.slice(a.k, a.k + 3);
  if (!part.length || a.fin) return `<div class="top"><button class="ib" data-act="back" aria-label="Назад">${ICO.back}</button></div><div class="more"><div class="ringA" style="--p:${Math.round(100 * a.ok / Math.max(1, a.k))}"><div>${a.ok}/${a.k}<small>вспомнил</small></div></div><h2>Повторение готово</h2><p>Фразы, которые не вспомнил, вернутся завтра.</p><div class="btns"><button class="btn w" data-act="back">Готово</button></div></div>`;
  const x = part[a.j || 0] || part[0], opts = shuffle([x.f.ru, ...(x.f.trap || []).slice(0, 2)]);
  return `<div class="qz"><div class="qz-top"><button class="ib" data-act="back" aria-label="Выйти">${ICO.x}</button><div class="qsegs">${part.map((_, k) => `<i class="${k < (a.j || 0) ? 'd ok' : ''}"><b></b></i>`).join('')}</div></div>
    <div class="qz-b"><span class="qk">Повторение · по 3 за раз</span><div class="rv-card"><img src="${A(x.s.parts[x.i].th)}" alt=""><div><small>${esc(x.s.t)} · эпизод ${x.i + 1}</small><b>${esc(x.f.en)}</b></div></div>
    <div class="opts" id="ro">${opts.map((o, k) => `<button class="opt" data-o="${esc(o)}"><i>${k + 1}</i><span>${esc(o)}</span></button>`).join('')}</div></div><div id="rf"></div></div>`;
};
AFTER.review = (el, a) => { const ro = $('#ro', el); if (!ro) return; const part = a.L.slice(a.k, a.k + 3), x = part[a.j || 0];
  ro.onclick = e => { const o = e.target.closest('.opt'); if (!o || a.lock) return; a.lock = 1; const ok = o.dataset.o === x.f.ru; o.classList.add(ok ? 'ok' : 'no'); if (!ok) $$('.opt', ro).forEach(z => { if (z.dataset.o === x.f.ru) z.classList.add('ok'); }); if (ok) a.ok++;
    const last = (a.j || 0) >= part.length - 1;
    $('#rf', el).innerHTML = `<div class="fb ${ok ? 'ok' : 'no'}"><b>${ok ? 'Помнишь!' : 'Вернётся завтра'}</b>${last ? `<div style="display:flex;gap:8px"><button class="btn" style="flex:1" id="r3">Ещё 3</button><button class="btn g" id="rs">Хватит</button></div>` : `<button class="btn w" id="rn">Дальше</button>`}</div>`;
    const nx = () => { a.lock = 0; a.j = (a.j || 0) + 1; rerender(); };
    if ($('#rn', el)) $('#rn', el).onclick = nx;
    if ($('#r3', el)) $('#r3', el).onclick = () => { a.lock = 0; a.k += 3; a.j = 0; rerender(); };
    if ($('#rs', el)) $('#rs', el).onclick = () => { a.lock = 0; a.k += part.length; a.fin = 1; rerender(); }; }; };

// ===== профиль-бенто =====
SCREENS.prof = () => {
  const fav = scOf('titanic-boat').parts[0].ph[0], film = scOf('wolf-of-wall-street'), h = HE[0];
  const frames = Object.entries(ST.done).flatMap(([sid, L]) => L.map(i => scOf(sid).parts[i].k)).filter(Boolean).slice(0, 3);
  return `<div class="top"><h1 class="h1">Профиль</h1><span class="sp"></span><button class="btn s g" data-act="edit">${ST.edit ? 'Готово' : 'Изменить'}</button><button class="ib" data-act="settings" aria-label="Настройки">${ICO.gear}</button></div>
    <p class="pad mut" style="margin:0 0 12px;font-size:13.5px">Так тебя видят друзья в Versus и дуэлях.</p>
    <div class="bento${ST.edit ? ' edit' : ''}">
      <div class="bx w2 me"><div class="ava">А</div><div><b>Андрей</b><div class="lvb"><span>${lvBars(ST.lv)} ${LVW[ST.lv]}</span><div class="bar"><i style="--w:${ST.lvP}%"></i></div><small>До уровня «${LVW[ST.lv + 1]}» — ${ST.lvP} %</small></div></div></div>
      <div class="bx w2 ph"><span class="k">Любимая фраза · Титаник</span><q id="favq">${words(fav.en).map(w => `<span class="kw">${esc(w)}</span>`).join(' ')}</q><div style="display:flex;align-items:center;gap:10px"><button class="play" data-act="fav" aria-label="Послушать">${ICO.play}</button><span>${esc(fav.ru)}</span></div><button class="minus" aria-label="Убрать">−</button></div>
      <div class="bx"><span class="k">Серия</span><span class="v" style="color:#FF7A2F">${ST.streak}<small>дней</small></span><button class="minus" aria-label="Убрать">−</button></div>
      <div class="bx"><span class="k">Выучено</span><span class="v">${ST.learned}<small>фраз</small></span><button class="minus" aria-label="Убрать">−</button></div>
      <div class="bx film" style="min-height:170px"><img src="${A(film.poster)}" alt=""><span class="k">Любимый фильм</span><b>${esc(film.t)}</b><button class="minus" aria-label="Убрать">−</button></div>
      <div class="bx hero" style="min-height:170px"><img src="${h.img}" alt=""><span class="k">Герой в Deadlock</span><b>${esc(h.n)} · ур. 3</b><button class="minus" aria-label="Убрать">−</button></div>
      <div class="bx w2"><span class="k">Коллекция · кадры</span><div class="coll">${frames.map(f => `<img src="${A(f)}" alt="">`).join('')}</div><button class="minus" aria-label="Убрать">−</button></div>
      <button class="bx w2 add" data-act="toast" data-t="Тут выбираешь, что показать друзьям">＋ Виджет</button>
    </div>
    <div class="rows" style="margin-top:14px"><button class="row" data-act="settings"><span class="rico">${ICO.gear}</span><span class="rt"><b>Настройки</b><small>Тема, уровень, субтитры, звук</small></span>${ICO.chev}</button></div>`;
};
AFTER.prof = el => {};
function favPlay() { const q = $('#favq'), W = $$('#favq .kw'); q.classList.add('pl'); W.forEach(w => w.classList.remove('on')); W.forEach((w, k) => setTimeout(() => w.classList.add('on'), 260 * (k + 1))); setTimeout(() => q.classList.remove('pl'), 260 * (W.length + 3)); }

// ===== настройки (разгружены: игры настраиваются в самой игре) =====
SCREENS.settings = () => {
  const s = scOf('titanic-boat'), sb = s.parts[0].subs ? s.parts[0].subs[0] : {en: "I'm not going without you.", ru: 'Я без тебя не поеду.'};
  return `<div class="top"><button class="ib" data-act="back" aria-label="Назад">${ICO.back}</button><h1 class="h1" style="font-size:26px">Настройки</h1></div>
    <div class="grp"><div class="k">Вид</div><div class="gbox">
      <div class="srow"><span>Дизайн<small>${DES.find(x => x.id === ST.d).d}</small></span></div>
      <div class="srow" style="padding-top:0;border-top:0"><div class="seg" style="width:100%">${DES.map(x => `<button style="flex:1" class="${ST.d === x.id ? 'on' : ''}" data-des="${x.id}">${x.n}</button>`).join('')}</div></div>
      <div class="srow"><span>Тема${ST.d === 'night' ? '<small>В «Ночи» всегда тёмная</small>' : '<small>Как в Telegram — подстраивается сама</small>'}</span></div>
      <div class="srow" style="padding-top:0;border-top:0"><div class="seg" style="width:100%">${[['auto', 'Как в Telegram'], ['light', 'Светлая'], ['dark', 'Тёмная']].map(([k, n]) => `<button style="flex:1" class="${ST.t === k ? 'on' : ''}" data-act="theme" data-v="${k}">${n}</button>`).join('')}</div></div></div></div>
    <div class="grp"><div class="k">Обучение</div><div class="gbox">
      <div class="srow"><span>Уровень<small>Растёт сам по ответам. Можно поправить.</small></span></div>
      <div class="lvsel">${[1, 2, 3, 4, 5].map(n => `<button class="${ST.lv === n ? 'on' : ''}" data-act="lv" data-v="${n}">${lvBars(n)}${LVW[n]}</button>`).join('')}</div>
      <div class="srow"><span>Паузы на фразах<small>Видео встаёт после важной фразы и объясняет её</small></span><button class="sw2${ST.pause ? ' on' : ''}" data-act="pz2" aria-label="Паузы на фразах" role="switch" aria-checked="${ST.pause}"></button></div>
      ${ST.pause ? `<div class="prev"><img src="${A(s.parts[0].k)}" alt=""><div class="pl"><b>${esc(sb.en)}</b><br><span class="mut">${esc(sb.ru)}</span></div></div>` : ''}</div></div>
    <div class="grp"><div class="k">Субтитры</div><div class="gbox">
      <div class="srow"><span>Размер</span><div class="seg">${[['s', 'S'], ['m', 'M'], ['l', 'L']].map(([k, n]) => `<button class="${ST.ss === k ? 'on' : ''}" data-act="ss" data-v="${k}">${n}</button>`).join('')}</div></div>
      <div class="prev"><img src="${A(s.parts[0].th)}" alt=""><div class="subs" style="--ss:${{s: '14px', m: '17px', l: '20px'}[ST.ss]}"><span class="l"><span class="w on">${esc(sb.en)}</span></span><span class="ru">${esc(sb.ru)}</span></div></div></div></div>
    <div class="grp"><div class="k">Звук и движение</div><div class="gbox">
      <div class="srow"><span>Звуки</span><button class="sw2${ST.snd ? ' on' : ''}" data-act="snd" role="switch" aria-checked="${ST.snd}" aria-label="Звуки"></button></div>
      <div class="srow"><span>Анимации</span><button class="sw2${ST.anim ? ' on' : ''}" data-act="anim" role="switch" aria-checked="${ST.anim}" aria-label="Анимации"></button></div></div></div>
    <p class="pad mut" style="font-size:13px;margin-top:14px">Настройки игр — в самих играх: Deadlock → «Настройки».</p><div style="height:30px"></div>`;
};

// ===== игры → Deadlock =====
const SONAR = {raf: 0};
SCREENS.dl = () => {
  const h = HE[0], done = ST.todo.filter(Boolean).length;
  const TD = [['Прочитай главу комикса', 'Венатор против Крысиного короля · 6 реплик'], ['Перехвати разговор на радаре', '×2 опыта до вечера'], ['Сыграй Versus с другом', 'Собери · что значит · на слух']];
  return `<div class="dl-hero"><img src="${h.img}" alt=""><div class="top"><button class="ib" data-act="back" aria-label="Назад">${ICO.back}</button></div><div class="t"><h1>Deadlock</h1><p>Учи английский по репликам героев</p></div></div>
    <div class="sec"><h2 class="h2">На сегодня</h2><span class="cap">${done} из 3</span></div>
    <div class="pad todo">${TD.map((t, k) => `<button class="td${ST.todo[k] ? ' on' : ''}" data-act="todo" data-k="${k}"><i>${ICO.check}</i><span><b>${t[0]}</b><small>${t[1]}</small></span></button>`).join('')}</div>
    <div class="sec"><h2 class="h2">Герои</h2><span class="cap">нажми — дом героя</span></div>
    <div class="heroes">${HE.map((x, k) => `<button class="hc" data-act="hero" data-k="${k}" style="--hc:${esc(x.col || '#888')}"><div><img src="${x.img}" alt=""></div><b>${esc(x.n)}</b><small>ур. ${[3, 2, 1, 2, 1, 1, 1, 1][k]}</small></button>`).join('')}</div>
    <div class="sec"><h2 class="h2">Радар</h2><span class="cap">4 перехвата за 8 часов</span></div>
    <div class="sonar"><canvas id="son" width="680" height="544"></canvas><span class="cap">Точка — подслушанный разговор. Нажми, чтобы открыть комикс.</span></div>
    <div class="sec"><h2 class="h2">Versus с другом</h2></div>
    <button class="vsx" data-act="toast" data-t="Versus уже работает в приложении: герой, диалог, ставка — ссылка другу"><img src="${HE[0].img}" alt=""><b>VS</b><img class="r" src="${HE[1].img}" alt=""></button>
    <div style="height:30px"></div>`;
};
AFTER.dl = el => {
  const c = $('#son', el), g = c.getContext('2d'), W = c.width, H = c.height, cx = W / 2, cy = H / 2;
  const dots = [[.32, .38], [.7, .3], [.62, .7], [.25, .72]].map(([x, y], k) => ({x: x * W, y: y * H, k}));
  let a = 0, last = 0;
  const draw = t => { const dt = last ? (t - last) / 1000 : 0; last = t; a = (a + dt * 1.4) % (Math.PI * 2);
    g.fillStyle = '#07130F'; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(80,220,160,.18)'; g.lineWidth = 2; [80, 160, 240].forEach(r => { g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); });
    g.beginPath(); g.moveTo(0, cy); g.lineTo(W, cy); g.moveTo(cx, 0); g.lineTo(cx, H); g.stroke();
    const gr = g.createConicGradient ? g.createConicGradient(a - .9, cx, cy) : null;
    if (gr) { gr.addColorStop(0, 'rgba(80,230,160,0)'); gr.addColorStop(.14, 'rgba(80,230,160,.38)'); gr.addColorStop(.15, 'rgba(80,230,160,0)'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, 300, 0, 7); g.fill(); }
    dots.forEach(d => { const ang = (Math.atan2(d.y - cy, d.x - cx) + Math.PI * 2) % (Math.PI * 2), diff = (a - ang + Math.PI * 2) % (Math.PI * 2), glow = Math.max(.25, 1 - diff / 3);
      g.fillStyle = `rgba(120,255,190,${glow})`; g.beginPath(); g.arc(d.x, d.y, 9 + 6 * glow, 0, 7); g.fill(); });
    SONAR.raf = requestAnimationFrame(draw); };
  SONAR.raf = requestAnimationFrame(draw);
  c.onclick = e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height; const d = dots.find(d => Math.hypot(d.x - x, d.y - y) < 40);
    if (d) { ST.todo[1] = true; toast('Перехват! Откроется комикс-разговор · ×2 опыта'); } };
};
function heroSheet(k) { const h = HE[k];
  sheet(`<div style="display:grid;grid-template-columns:120px 1fr;gap:14px;align-items:end"><div style="aspect-ratio:1;border-radius:18px;overflow:hidden;background:radial-gradient(circle at 50% 30%,${esc(h.col)},transparent 70%);display:grid;place-items:end center"><img src="${h.img}" alt="" style="width:120%;max-width:none"></div><div><p class="wd">${esc(h.n)}</p><span class="cap">уровень ${[3, 2, 1, 2, 1, 1, 1, 1][k]} · 24 реплики</span></div></div>
    <div class="rows" style="padding:0;margin-top:14px"><button class="row" data-act="toast" data-t="Комикс: читать или слушать, в конце 3 задания"><span class="rt"><b>Комиксы</b><small>3 главы</small></span>${ICO.chev}</button><button class="row" data-act="toast" data-t="Реплики героя с голосом и переводом"><span class="rt"><b>Фразы героя</b><small>с голосом из игры</small></span>${ICO.chev}</button><button class="row" data-act="toast" data-t="Versus за этого героя — ссылка другу"><span class="rt"><b>Versus за ${esc(h.n)}</b><small>позвать друга</small></span>${ICO.chev}</button></div>`); }

// ===== действия =====
const ACT = {
  back, story: storyOpen, sprev: () => storyOpen.prev(), snext: () => storyOpen.next(), storyx: () => storyOpen.close(),
  feed: feedOpen, feedx: () => { const ov = $('#ov'); ov.classList.remove('on'); ov.innerHTML = ''; },
  feedgo: d => { ACT.feedx(); go('scene', {s: d.s}); },
  lang: d => { ST.lang = d.v; rerender(); },
  scene: d => go('scene', {s: d.s}), scmode: d => { STACK[STACK.length - 1].a = {s: d.s, m: d.m}; rerender(); },
  ep: d => { closeSheet(); if ($('#ov').classList.contains('on')) { const ov = $('#ov'); ov.classList.remove('on'); ov.innerHTML = ''; } go('ep', {s: d.s, i: d.i}); },
  vplay: () => P.play && P.play(), vtog: () => P.tog && P.tog(),
  pz: () => { ST.pause = !ST.pause; save(); const b = $('[data-act="pz"]'); b.classList.toggle('on', ST.pause); b.textContent = ST.pause ? 'С паузами' : 'Без пауз'; },
  quiz: d => go('quiz', {s: d.s, i: d.i}), deep: d => { STACK.pop(); go('quiz', {s: d.s, i: d.i, deep: 1}); },
  result: d => { STACK.pop(); go('result', {s: d.s, i: d.i}); },
  review: () => go('review', {}), dl: () => go('dl', {}), settings: () => go('settings', {}),
  toast: d => toast(d.t), todo: d => { ST.todo[+d.k] = !ST.todo[+d.k]; rerender(); }, hero: d => heroSheet(+d.k),
  dk: d => { STACK[STACK.length - 1].a = {k: d.k}; rerender(); }, phs: d => phSheet(d.s, +d.i, d.j), sheetx: closeSheet,
  edit: () => { ST.edit = !ST.edit; rerender(); }, fav: favPlay,
  theme: d => { ST.t = d.v; save(); applyLook(); rerender(); }, lv: d => { ST.lv = +d.v; rerender(); },
  pz2: () => { ST.pause = !ST.pause; save(); rerender(); }, ss: d => { ST.ss = d.v; save(); rerender(); },
  snd: () => { ST.snd = !ST.snd; rerender(); }, anim: () => { ST.anim = !ST.anim; rerender(); },
};
app.addEventListener('click', e => {
  const t = e.target.closest('[data-tab]'); if (t) { tab(t.dataset.tab); return; }
  const b = e.target.closest('[data-act]'); if (b && ACT[b.dataset.act]) { e.preventDefault(); ACT[b.dataset.act](b.dataset, b); }
});
addEventListener('keydown', e => { if (e.key === 'Escape') { if ($('#sheetW').classList.contains('on')) closeSheet(); else if ($('#ov').classList.contains('on')) { if (storyOpen.close && $('.stv')) storyOpen.close(); else ACT.feedx(); } else back(); } });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { applyLook(); });
applyLook(); render('');
