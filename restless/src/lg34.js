// ===================== lg34 (07.11) — метки одни и те же в строке матча и в разборе; разбор матча плитками =====================
// Андрей: «метки в списке матчей не совпадают с метками в разборе», «не могу зачекать урон васяна, сколько втанковал — по плиткам».

// ---------- метки: одна функция mTags и для строки матча, и для разбора ----------
// Раньше: строка матча — mMiniTags (сравнение с твоей нормой по истории), разбор — mTags (с лобби по полным данным) — разные метки.
// Теперь везде mTags по итоговым цифрам матча (final_stats). Метки по минутам (линия к 10:00) убраны из меток — они во вкладке «Линии».
const z34Last = p => { const s = p.stats || []; return s.length ? [s[s.length - 1]] : p.final_stats ? [p.final_stats] : []; };
const z34X = M => ({P: (M.players || []).map(p => Object.assign({}, p, {stats: z34Last(p)})), win: teamOf(M.winning_team), dur: M.duration_s || 0});
{ const MT0 = mTags;
  mTags = function (X, p) {
    if (!X) return [];
    if (!X.P && X.players) X = z34X(X);
    const P = X.P.map(q => q.stats && q.stats.length > 1 ? Object.assign({}, q, {stats: z34Last(q)}) : q);
    const pp = P[X.P.indexOf(p)] || p;
    return MT0(Object.assign({}, X, {P}), pp).filter(t => t[0] !== 'Выиграл линию' && t[0] !== 'Проиграл линию');
  }; }
function z34RowTags(m) {
  const M = MD.get(m.match_id); if (!M) return null;
  const i = (M.players || []).findIndex(q => q.account_id === PROF.id); if (i < 0) return null;
  const X = z34X(M);
  return mTags(X, X.P[i]).map(t => [t[0], t[1], t[2]]);
}
{ const GR0 = gmRow;
  gmRow = function (m) {
    const T = z34RowTags(m);
    if (!T) return GR0(m);
    const MM0 = mMiniTags; mMiniTags = () => T;
    try { return GR0(m); } finally { mMiniTags = MM0; }
  }; }

// ---------- разбор матча: плитки с числами у любого из 12 и таблица всех ----------
const Z34K = [
  ['dmg', 'Урон по героям', q => mLS(q).player_damage || 0],
  ['tank', 'Принял урона', q => mLS(q).player_damage_taken || 0],
  ['heal', 'Лечение', q => (mLS(q).player_healing || 0) + (mLS(q).teammate_healing || 0)],
  ['nw', 'Души', q => q.net_worth || mLS(q).net_worth || 0],
  ['obj', 'Урон по объектам', q => mLS(q).boss_damage || 0],
  ['mit', 'Отвёл урона', q => (mLS(q).damage_mitigated || 0) + (mLS(q).damage_absorbed || 0)],
  ['cs', 'Крипы', q => q.last_hits || mLS(q).creep_kills || 0],
  ['acc', 'Точность', q => { const s = mLS(q), a = (s.shots_hit || 0), b = (s.shots_missed || 0); return a + b ? Math.round(100 * a / (a + b)) : 0; }]];
const Z34N = {dmg: 'по героям за матч', tank: 'втанковал за матч', heal: 'себе и своим', nw: 'за матч', obj: 'стражи, базы, босс', mit: 'смягчил и поглотил', cs: 'добил крипов', acc: 'попаданий из всех выстрелов'};
const z34Fmt = (k, v) => k === 'acc' ? v + '%' : nf(Math.round(v));
const z34Place = (X, p, f) => 1 + X.P.filter(q => f(q) > f(p)).length;
function z34Tiles(X, p) {
  const mine = q => teamOf(q.team) === teamOf(p.team), dur = Math.max(1, X.dur / 60);
  return `<div class="z34-tl">${Z34K.map(([k, name, f], i) => {
    const v = f(p), mx = Math.max(1, ...X.P.map(f)), pl = z34Place(X, p, f), tm = 1 + X.P.filter(q => mine(q) && f(q) > v).length;
    const cls = pl <= 3 ? 'g' : pl >= 10 ? 'r' : '', perMin = k === 'acc' ? '' : `${nf(Math.round(v / dur))} в мин · `;
    return `<div class="z34-t ${cls}" style="--i:${i}"><small>${name}</small><b data-z34n="${Math.round(v)}" data-z34s="${k === 'acc' ? '%' : ''}">${z34Fmt(k, v)}</b>
      <i class="z34-bar"><u style="--w:${(v / mx).toFixed(3)}"></u></i><span><em>${pl}-й из ${X.P.length}</em> · ${tm}-й в команде</span><span class="z34-n">${perMin}${Z34N[k]}</span></div>`; }).join('')}</div>`;
}
const Z34C = [['dmg', 'Урон'], ['tank', 'Принял'], ['heal', 'Лечение'], ['nw', 'Души'], ['obj', 'Объекты'], ['k', 'У/С/П']];
const Z34S = {k: 'dmg', d: 1};
function z34Table(X) {
  const sel = mSel(), F = Object.fromEntries(Z34K.map(x => [x[0], x[2]]));
  F.k = q => (q.kills || 0) * 3 + (q.assists || 0) - (q.deaths || 0);
  const L = X.P.slice().sort((a, b) => Z34S.d * (F[Z34S.k](b) - F[Z34S.k](a)));
  const mx = Object.fromEntries(Z34C.map(([k]) => [k, Math.max(1, ...X.P.map(F[k]))]));
  return `<section class="q-box z34-tb"><div class="z34-tbh"><b>Все игроки</b><small>нажми на столбец — сортировка, на игрока — его плитки</small></div>
    <div class="z34-tr z34-hd"><span>Игрок</span>${Z34C.map(([k, n]) => `<button type="button" data-z34o="${k}" class="${Z34S.k === k ? 'on' : ''}">${n}${Z34S.k === k ? (Z34S.d > 0 ? ' ▾' : ' ▴') : ''}</button>`).join('')}</div>
    ${L.map((q, i) => `<button type="button" class="z34-tr t${teamOf(q.team)}${q === sel ? ' on' : ''}${X.meP === q ? ' z34-me' : ''}" data-sl="${q.player_slot}" style="--i:${i}">
      <span class="z34-who">${face(q.hero_id, teamOf(q.team) === X.win ? 'g' : 'c', 's')}<span><b>${esc(pname(q))}</b><small>${esc(hero(q.hero_id).n)}</small></span></span>
      ${Z34C.map(([k]) => k === 'k' ? `<span class="z34-c"><b>${q.kills || 0}/<i>${q.deaths || 0}</i>/${q.assists || 0}</b></span>`
        : `<span class="z34-c"><b>${kfm(F[k](q))}</b><i class="z34-cb"><u style="--w:${(F[k](q) / mx[k]).toFixed(3)}"></u></i></span>`).join('')}</button>`).join('')}</section>`;
}
function z34Count(root) {
  if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = $$('[data-z34n]', root); if (!els.length) return;
  const t0 = performance.now(), D = 700;
  const step = t => { const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
    els.forEach(el => { el.textContent = nf(Math.round(+el.dataset.z34n * e)) + (el.dataset.z34s || ''); }); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
{ const MO34 = mOv;
  mOv = function () {
    const X = MX, p = mSel();
    let h = MO34();
    // плитки с числами — под шапкой игрока вместо мест без чисел («6-й в команде»); таблица всех 12 — над карточкой игрока
    h = h.replace(/<div class="r10-ts">[\s\S]*?<\/div>(?=<div class="r10-hl">|<p class="r10-late")/, '');
    h = h.replace('<p class="r10-late"', z34Tiles(X, p) + '<p class="r10-late"');
    h = h.replace('<section class="q-box r9-bd">', '<div class="z34-lc"><section class="q-box r9-bd">').replace('<section class="q-box r9-pl">', z34Table(X) + '</div><section class="q-box r9-pl">');
    return h;
  }; }
{ const MB34 = mBody;
  mBody = function () { MB34(); if (MZ.tab === 'ov') z34Count($('#qmb')); }; }
document.addEventListener('click', e => {
  const o = e.target.closest('[data-z34o]'); if (!o || !MX) return;
  const k = o.dataset.z34o; if (Z34S.k === k) Z34S.d = -Z34S.d; else { Z34S.k = k; Z34S.d = 1; }
  const tb = $('.z34-tb'); if (tb) { tb.outerHTML = z34Table(MX); const n = $('.z34-tb'); if (n) n.classList.add('z34-re'); }
});
