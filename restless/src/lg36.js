// ===================== lg36 (07.11) — «Линии» с ползунком времени и «Графики» одним экраном =====================
// Андрей: «в линиях — чтобы можно было мотать: 5:31, 4:11, 9:41»; «графики — без листания вниз, понятно сравнить урон, кто сколько впитал».
// Данные: снимки статистики игры (каждые 3 мин, потом 5) — между ними оцениваем линейно (≈); смерти, убийства, здоровье, место на карте
// и покупки — точные, по секундам (death_details, match_paths, items).
const Z36 = {raf: 0, play: 0, sp: 10, ch: {}, gk: 'dmg', gm: 'time', gt: 'pl', lt: 600};

// значение снимка в момент t: между снимками — по прямой, после последнего — итог
function z36I(p, t, f) {
  const S = p.stats || []; if (!S.length) return 0;
  let a = [0, 0];
  for (const s of S) { const v = f(s) || 0; if (s.time_stamp_s >= t) { const b = [s.time_stamp_s, v]; return b[0] === a[0] ? v : a[1] + (v - a[1]) * (t - a[0]) / (b[0] - a[0]); } a = [s.time_stamp_s, v]; }
  return a[1];
}
const z36Snap = (p, t) => (p.stats || []).some(s => Math.abs(s.time_stamp_s - t) < 1) || t >= MX.dur;
const z36K = (p, t) => { let k = 0; MX.P.forEach(q => (q.death_details || []).forEach(d => { if (d.killer_player_slot === p.player_slot && d.game_time_s <= t) k++; })); return k; };
const z36D = (p, t) => (p.death_details || []).filter(d => d.game_time_s <= t).length;
const z36Dead = (p, t) => (p.death_details || []).find(d => d.game_time_s <= t && t < d.game_time_s + (d.death_duration_s || 0));
function z36Items(p, t) {
  const h = hero(p.hero_id), ab = new Set((h.ab || []).map(x => +x.id));
  return (p.items || []).filter(x => item(x.item_id) && !ab.has(+x.item_id) && x.game_time_s <= t && !(x.sold_time_s && x.sold_time_s <= t)).sort((a, b) => a.game_time_s - b.game_time_s);
}
function z36Stop() { cancelAnimationFrame(Z36.raf); Z36.play = 0; }

// ---------------- Графики ----------------
const Z36M = [
  ['dmg', 'Урон по героям', 'Урон', s => s.player_damage],
  ['tak', 'Принял урона', 'Принял', s => s.player_damage_taken],
  ['mit', 'Отвёл урона', 'Отвёл', s => (s.damage_mitigated || 0) + (s.damage_absorbed || 0)],
  ['heal', 'Лечение', 'Лечение', s => (s.player_healing || 0) + (s.teammate_healing || 0)],
  ['nw', 'Души', 'Души', s => s.net_worth],
  ['obj', 'Урон по объектам', 'Объекты', s => s.boss_damage]];
const z36Mk = k => Z36M.find(x => x[0] === k) || Z36M[0];
const z36Fin = (p, k) => k === 'nw' ? (p.net_worth || mLS(p).net_worth || 0) : (z36Mk(k)[3](mLS(p)) || 0);
const z36Times = () => { const T = new Set([0, MX.dur]); MX.P.forEach(p => (p.stats || []).forEach(s => s.time_stamp_s <= MX.dur && T.add(s.time_stamp_s))); return [...T].sort((a, b) => a - b); };

function z36Table() {
  const X = MX, sel = mSel(), k = Z36.gk;
  const mx = Object.fromEntries(Z36M.map(([c]) => [c, Math.max(1, ...X.P.map(q => z36Fin(q, c)))]));
  const rk = Object.fromEntries(Z36M.map(([c]) => [c, X.P.slice().sort((a, b) => z36Fin(b, c) - z36Fin(a, c))]));
  const team = t => {
    const L = X.P.filter(q => teamOf(q.team) === t).sort((a, b) => z36Fin(b, k) - z36Fin(a, k)), sum = L.reduce((s, q) => s + z36Fin(q, k), 0);
    return `<div class="z36-th t${t}"><b>${TEAMN[t]}</b>${X.win === t ? '<em>победа</em>' : ''}<span>${kfm(sum)}</span></div>` + L.map(q => `<button type="button" class="z36-r t${t}${q === sel ? ' on' : ''}" data-sl="${q.player_slot}" data-ps="${q.player_slot}">
      <span class="z36-who">${face(q.hero_id, teamOf(q.team) === X.win ? 'g' : 'c', 's')}<span><b>${esc(pname(q))}</b><small>${esc(hero(q.hero_id).n)}</small></span></span>
      ${Z36M.map(([c]) => { const v = z36Fin(q, c), r = rk[c].indexOf(q) + 1; return `<span class="z36-c${c === k ? ' k' : ''}${r === 1 ? ' top' : ''}"><b>${kfm(v)}</b><i><u style="--w:${(v / mx[c]).toFixed(3)}"></u></i></span>`; }).join('')}
      <span class="z36-c kda"><b>${q.kills || 0}<s>/</s><i>${q.deaths || 0}</i><s>/</s>${q.assists || 0}</b></span></button>`).join('');
  };
  return `<section class="q-box z36-tb"><div class="z36-mch seg sm">${Z36M.map(([c, , sh]) => `<button type="button" data-z36k="${c}" class="${c === k ? 'on' : ''}">${sh}</button>`).join('')}</div><div class="z36-r z36-hd"><span>Игрок</span>${Z36M.map(([c, , sh]) => `<button type="button" data-z36k="${c}" class="${c === k ? 'on' : ''}">${sh}</button>`).join('')}<span>У/С/П</span></div>${team(0)}${team(1)}</section>`;
}
// линии по времени: 12 игроков (или 2 команды), курсор и подсказка
function z36Chart(id, S, o) {
  const W = 1000, H = o.h || 260, pl = 46, pr = 10, pt = 10, pb = o.nox ? 8 : 22, x1 = MX.dur || 1;
  let lo = o.mid ? -1 : 0, hi = 1; S.forEach(s => s.pts.forEach(q => { if (q[1] > hi) hi = q[1]; if (q[1] < lo) lo = q[1]; }));
  if (o.mid) { const m = Math.max(hi, -lo); hi = m; lo = -m; }
  const X2 = t => pl + (W - pl - pr) * t / x1, Y2 = v => pt + (H - pt - pb) * (hi - v) / (hi - lo || 1);
  Z36.ch[id] = {S, X2, Y2, W, H, pl, pr, x1, o};
  const GV = o.mid ? [hi, 0, lo] : [hi, hi / 2];
  const grid = GV.map(v => `<line class="g" x1="${pl}" x2="${W - pr}" y1="${Y2(v).toFixed(1)}" y2="${Y2(v).toFixed(1)}"/>`).join('');
  const ticks = '';
  const ax = GV.map(v => `<span class="y" style="top:${(100 * Y2(v) / H).toFixed(2)}%;width:${(100 * (pl - 6) / W).toFixed(2)}%">${o.mid && v ? (v > 0 ? '+' : '−') : ''}${kfm(Math.abs(v))}</span>`).join('')
    + (o.nox ? [] : [0, .25, .5, .75, 1]).map(f => `<span class="x${f === 0 ? ' s' : f === 1 ? ' e' : ''}" style="left:${(100 * X2(f * x1) / W).toFixed(2)}%">${mmss(f * x1)}</span>`).join('');
  const body = S.map(s => {
    const pts = s.pts.map(q => `${X2(q[0]).toFixed(1)},${Y2(q[1]).toFixed(1)}`).join(' ');
    if (o.mid) { const base = Y2(0).toFixed(1), up = s.pts.map(q => `${X2(q[0]).toFixed(1)},${Y2(Math.max(0, q[1])).toFixed(1)}`).join(' '), dn = s.pts.map(q => `${X2(q[0]).toFixed(1)},${Y2(Math.min(0, q[1])).toFixed(1)}`).join(' ');
      return `<polygon class="a0" points="${X2(0)},${base} ${up} ${X2(x1)},${base}"/><polygon class="a1" points="${X2(0)},${base} ${dn} ${X2(x1)},${base}"/><polyline class="l mid" pathLength="1" points="${pts}"/>`; }
    return `${s.area ? `<polygon class="ar t${s.t}" points="${X2(0)},${Y2(0)} ${pts} ${X2(x1)},${Y2(0)}"/>` : ''}<polyline class="l t${s.t}${s.on ? ' on' : ''}" data-ps="${s.id}" pathLength="1" points="${pts}"/>`; }).join('');
  return `<div class="z36-ch${o.mid ? ' mid' : ''}" data-z36c="${id}"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${grid}${body}${ticks}<line class="cur" x1="0" x2="0" y1="${pt}" y2="${H - pb}" visibility="hidden"/>${o.mark != null ? `<line class="mk" x1="${X2(o.mark)}" x2="${X2(o.mark)}" y1="${pt}" y2="${H - pb}"/>` : ''}</svg><div class="z36-ax">${ax}</div><div class="z36-tip" hidden></div></div>`;
}
const z36Val = (s, t) => { const P = s.pts; let a = P[0]; for (const b of P) { if (b[0] >= t) return b[0] === a[0] ? b[1] : a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]); a = b; } return a[1]; };
function z36ChartBind(root) {
  $$('[data-z36c]', root).forEach(el => {
    const C = Z36.ch[el.dataset.z36c], sv = $('svg', el), tip = $('.z36-tip', el), cur = $('.cur', sv); if (!C) return;
    const move = e => {
      const r = sv.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width * C.W, t = Math.max(0, Math.min(C.x1, (fx - C.pl) / (C.W - C.pl - C.pr) * C.x1));
      const x = C.X2(t); cur.setAttribute('x1', x); cur.setAttribute('x2', x); cur.setAttribute('visibility', 'visible');
      let h;
      if (C.o.mid) { const v = z36Val(C.S[0], t); h = `<b>${mmss(t)}</b><span class="t${v >= 0 ? 0 : 1}">${Math.abs(v) < 300 ? 'ровно' : `${TEAMN[v >= 0 ? 0 : 1]} +${kfm(Math.abs(v))}`}</span>`; }
      else { const L = C.S.map(s => [s, z36Val(s, t)]).sort((a, b) => b[1] - a[1]); h = `<b>${mmss(t)} · ${esc(C.o.name)}</b>` + L.map(([s, v]) => `<span class="t${s.t}${s.on ? ' on' : ''}"><i></i>${esc(s.n)}<em>${kfm(v)}</em></span>`).join(''); }
      tip.innerHTML = h; tip.hidden = false;
      const px = (x / C.W) * r.width; tip.style.left = Math.min(r.width - tip.offsetWidth - 4, Math.max(4, px + (px > r.width / 2 ? -tip.offsetWidth - 14 : 14))) + 'px';
    };
    el.addEventListener('pointermove', move); el.addEventListener('pointerdown', move);
    el.addEventListener('pointerleave', () => { tip.hidden = true; cur.setAttribute('visibility', 'hidden'); });
  });
}
function z36DmMat() {
  const dm = MX.mi.damage_matrix, M = {}; if (!dm || !dm.damage_dealers) return null;
  const st = dm.source_details.stat_type;
  dm.damage_dealers.forEach(dd => (dd.damage_sources || []).forEach(s => { if (st[s.source_details_index] !== 0) return;
    (s.damage_to_players || []).forEach(z => { const v = (z.damage || [])[z.damage.length - 1] || 0; const r = M[dd.dealer_player_slot] = M[dd.dealer_player_slot] || {}; r[z.target_player_slot] = (r[z.target_player_slot] || 0) + v; }); }));
  return M;
}
function z36Who() {
  const X = MX, M = z36DmMat(), p = mSel(); if (!M) return '<div class="empty">В этом матче игра не отдала, кто кого бил.</div>';
  const A = X.P.filter(q => teamOf(q.team) === 0), B = X.P.filter(q => teamOf(q.team) === 1);
  const grid = (R, C, t) => { const mx = Math.max(1, ...R.flatMap(a => C.map(b => (M[a.player_slot] || {})[b.player_slot] || 0)));
    return `<div class="z36-mx"><div class="z36-mh t${t}">${TEAMN[t]} → ${TEAMN[1 - t]}</div><div class="z36-mg" style="--n:${C.length}"><i></i>${C.map(b => `<i class="hd${b === p ? ' on' : ''}" title="${esc(pname(b))}">${face(b.hero_id, '', 's')}</i>`).join('')}
      ${R.map(a => `<i class="hd${a === p ? ' on' : ''}" title="${esc(pname(a))}">${face(a.hero_id, '', 's')}</i>${C.map(b => { const v = (M[a.player_slot] || {})[b.player_slot] || 0, k = v / mx;
        return `<span class="t${t}${a === p || b === p ? ' on' : ''}" style="--k:${k.toFixed(3)}" title="${esc(pname(a))} → ${esc(pname(b))}: ${nf(v)}">${v ? kfm(v) : ''}</span>`; }).join('')}`).join('')}</div></div>`; };
  const to = Object.entries(M[p.player_slot] || {}).map(([s, v]) => [X.P.find(q => q.player_slot === +s), v]).filter(x => x[0] && teamOf(x[0].team) !== teamOf(p.team)).sort((a, b) => b[1] - a[1]);
  const fr = X.P.filter(q => teamOf(q.team) !== teamOf(p.team)).map(q => [q, (M[q.player_slot] || {})[p.player_slot] || 0]).sort((a, b) => b[1] - a[1]);
  const bars = (L, t) => { const s = L.reduce((a, x) => a + x[1], 0) || 1, mx = Math.max(1, ...L.map(x => x[1])); return L.map(([q, v]) => `<div class="z36-wb t${t}">${face(q.hero_id, '', 's')}<span class="n"><span>${esc(pname(q))}</span><i><u style="--w:${(v / mx).toFixed(3)}"></u></i></span><b>${kfm(v)}</b><small>${Math.round(100 * v / s)}%</small></div>`).join(''); };
  return `<div class="z36-who2"><div><div class="z36-sh">${esc(pname(p))} бил</div>${bars(to, 1 - teamOf(p.team))}</div><div><div class="z36-sh">${esc(pname(p))} получил от</div>${bars(fr, 1 - teamOf(p.team))}</div></div><div class="z36-mxs">${grid(A, B, 0)}${grid(B, A, 1)}</div>`;
}
function z36Gr() {
  const X = MX, sel = mSel(), K = z36Mk(Z36.gk), T = z36Times(), f = K[3];
  const ser = q => ({id: q.player_slot, t: teamOf(q.team), n: pname(q), on: q === sel, pts: T.map(t => [t, t >= X.dur ? z36Fin(q, K[0]) : z36I(q, t, f)])});
  let S = X.P.map(ser); S.sort((a, b) => a.on - b.on);
  if (Z36.gt === 'tm') S = [0, 1].map(t => ({id: 't' + t, t, n: TEAMN[t], area: 1, pts: T.map(tt => [tt, X.P.filter(q => teamOf(q.team) === t).reduce((s, q) => s + (tt >= X.dur ? z36Fin(q, K[0]) : z36I(q, tt, f)), 0)])}));
  const LD = {id: 'ld', t: 0, n: 'Перевес', pts: T.map(t => [t, X.P.reduce((s, q) => s + (teamOf(q.team) === 0 ? 1 : -1) * (t >= X.dur ? (q.net_worth || 0) : z36I(q, t, s2 => s2.net_worth)), 0)])};
  const tabs = [['time', 'По ходу матча'], ['who', 'Кто кого бил'], ['src', 'Чем бил']];
  let right;
  if (Z36.gm === 'who') right = z36Who();
  else if (Z36.gm === 'src') { const h = mDm(), m = h.match(/<div class="qs-box"><div class="qs-bh"><b>Чем бил<\/b>[\s\S]*$/); right = m ? m[0].replace(/<\/div><\/div>\s*$/, '</div>') : '<div class="empty">Нет разбивки урона.</div>'; }
  else right = `<div class="z36-ct"><b>${K[1]}</b><div class="seg sm">${[['pl', 'Игроки'], ['tm', 'Команды']].map(([k, n]) => `<button type="button" data-z36g="${k}" class="${Z36.gt === k ? 'on' : ''}">${n}</button>`).join('')}</div></div>
    ${z36Chart('m', S, {h: 430, name: K[1]})}<div class="z36-ct sm"><b>Перевес по душам</b><span class="t0">${TEAMN[0]} ↑</span><span class="t1">${TEAMN[1]} ↓</span></div>${z36Chart('ld', [LD], {h: 150, mid: 1, nox: 1, name: 'Перевес'})}`;
  return `<div class="z36-gr">${z36Table()}<section class="q-box z36-rt"><nav class="z36-tabs">${tabs.map(([k, n]) => `<button type="button" data-z36m="${k}" class="${Z36.gm === k ? 'on' : ''}">${n}</button>`).join('')}</nav>${right}</section></div>`;
}
function z36GrBind(el) {
  z36ChartBind(el);
  $$('.z36-r[data-ps]', el).forEach(r => { const s = r.dataset.ps;
    r.addEventListener('mouseenter', () => { const l = $(`.z36-ch polyline[data-ps="${s}"]`, el); if (l) { l.classList.add('hl'); el.classList.add('z36-hv'); } });
    r.addEventListener('mouseleave', () => { $$('.z36-ch polyline.hl', el).forEach(l => l.classList.remove('hl')); el.classList.remove('z36-hv'); }); });
}

// ---------------- Линии ----------------
function z36LaneSer(A0, A1) {
  const T = []; for (let t = 0; t <= MX.dur; t += 15) T.push(t); if (T[T.length - 1] !== MX.dur) T.push(MX.dur);
  const nw = (q, t) => t >= MX.dur ? (q.net_worth || 0) : z36I(q, t, s => s.net_worth);
  return {id: 'lane', t: 0, n: 'Перевес', pts: T.map(t => [t, A0.reduce((s, q) => s + nw(q, t), 0) - A1.reduce((s, q) => s + nw(q, t), 0)])};
}
function z36Lane() {
  const X = MX, p = mSel(), lanes = [...new Set(X.P.map(q => q.assigned_lane))].filter(Boolean).sort((a, b) => a - b);
  const ln = MZ.lane && lanes.includes(MZ.lane) ? MZ.lane : p.assigned_lane, L2 = LANEN[ln] || ['Линия ' + ln, '#888'];
  const A0 = X.P.filter(q => q.assigned_lane === ln && teamOf(q.team) === 0), A1 = X.P.filter(q => q.assigned_lane === ln && teamOf(q.team) === 1), LP = new Set([...A0, ...A1]);
  Z36.lt = Math.max(0, Math.min(X.dur, Z36.lt));
  const ev = []; X.P.forEach(v => (v.death_details || []).forEach(d => { const k = X.P.find(q => q.player_slot === d.killer_player_slot); if (LP.has(v) || (k && LP.has(k))) ev.push({t: d.game_time_s, v, k}); }));
  ev.sort((a, b) => a.t - b.t); Z36.ev = ev; Z36.ln = {A0, A1, ln};
  const Q = [180, 300, 360, 540, 600, 720, 900].filter(t => t < X.dur);
  const marks = ev.map(e => `<i class="t${teamOf(e.v.team)}" style="left:${(100 * e.t / X.dur).toFixed(2)}%" title="${mmss(e.t)} · ${esc(pname(e.v))} погиб${e.k ? ' — ' + esc(pname(e.k)) : ''}"></i>`).join('');
  return `<div class="z36-ln" style="--lc:${L2[1]}">
    <div class="z36-lf"><div class="seg">${lanes.map(l => `<button data-lane="${l}" class="${l === ln ? 'on' : ''}"><i class="dot" style="background:${(LANEN[l] || [0, '#888'])[1]}"></i>${(LANEN[l] || ['Линия ' + l])[0]}</button>`).join('')}</div>
      <div class="seg sm z36-q">${Q.map(t => `<button type="button" data-z36t="${t}">${mmss(t)}</button>`).join('')}<button type="button" data-z36t="${X.dur}">Конец</button></div></div>
    <section class="q-box z36-tl"><div class="z36-tlh"><button type="button" class="z36-pl" id="z36pl" aria-label="Играть">▶</button><b id="z36tm">${mmss(Z36.lt)}</b><div class="z36-tlc">${z36Chart('ln', [z36LaneSer(A0, A1)], {h: 96, mid: 1, name: 'Перевес на линии'})}<div class="z36-ev">${marks}</div>
        <input type="range" id="z36sl" min="0" max="${X.dur}" step="1" value="${Z36.lt}" aria-label="Время матча"><div class="z36-tw"><i class="z36-tc" id="z36tc"></i></div></div></div></section>
    <div id="z36lv"></div></div>`;
}
function z36LaneView() {
  const X = MX, t = Z36.lt, {A0, A1} = Z36.ln, p = mSel(), R = (D.map && D.map.r) || 10752, PT = X.PT || {};
  const nw = q => t >= X.dur ? (q.net_worth || 0) : z36I(q, t, s => s.net_worth), est = z36Snap(X.P[0], t) ? '' : '≈';
  const v = (q, f) => t >= X.dur ? (f(mLS(q)) || 0) : z36I(q, t, f);
  const s0 = A0.reduce((s, q) => s + nw(q), 0), s1 = A1.reduce((s, q) => s + nw(q), 0), lead = s0 - s1;
  const card = q => { const d = z36Dead(q, t), pos = PT[q.player_slot] ? PT[q.player_slot](t) : null, hp = pos && !d ? pos.hp : 0, it = z36Items(q, t).slice(-6);
    return `<div class="z36-pc t${teamOf(q.team)}${q === p ? ' on' : ''}" data-sl="${q.player_slot}"><div class="z36-pch">${face(q.hero_id, '', 'm')}<span><b>${esc(pname(q))}</b><small>${esc(hero(q.hero_id).n)} · ур. ${Math.round(v(q, s => s.level)) || '—'}</small></span><em>${z36K(q, t)}<s>/</s><i>${z36D(q, t)}</i></em></div>
      ${d ? `<div class="z36-dead">мёртв · ещё ${Math.ceil(d.game_time_s + d.death_duration_s - t)} с</div>` : `<div class="z36-hp"><i style="--w:${(hp / 100).toFixed(2)}"></i><span>${hp}%</span></div>`}
      <div class="z36-ps"><span><small>Души</small><b>${est}${kfm(nw(q))}</b></span><span><small>Крипы</small><b>${est}${Math.round(v(q, s => s.creep_kills))}</b></span><span><small>Денаи</small><b>${est}${Math.round(v(q, s => s.denies))}</b></span><span><small>Урон</small><b>${est}${kfm(v(q, s => s.player_damage))}</b></span></div>
      <div class="z36-it">${it.map(x => `<img src="${esc(item(x.item_id).i)}" alt="" title="${esc(item(x.item_id).n)} · ${mmss(x.game_time_s)}" loading="lazy">`).join('') || '<span>без покупок</span>'}</div></div>`; };
  const ROWS = [['Души', q => nw(q)], ['Убийства', q => z36K(q, t)], ['Смерти', q => z36D(q, t), 1], ['Крипы', q => v(q, s => s.creep_kills)], ['Денаи', q => v(q, s => s.denies)], ['Урон по героям', q => v(q, s => s.player_damage)], ['Урон по объектам', q => v(q, s => s.boss_damage)]];
  const cmp = ROWS.map(([n, f, lo]) => { const a = A0.reduce((s, q) => s + f(q), 0), b = A1.reduce((s, q) => s + f(q), 0), sh = a + b ? 100 * a / (a + b) : 50, w0 = a === b ? '' : (lo ? a < b : a > b) ? ' w' : '';
    return `<div class="z36-cm"><b class="t0${w0}">${kfm(a)}</b><span><small>${n}</small><i><u class="a" style="width:${sh.toFixed(1)}%"></u><u class="b" style="width:${(100 - sh).toFixed(1)}%"></u></i></span><b class="t1${a !== b && !w0 ? ' w' : ''}">${kfm(b)}</b></div>`; }).join('');
  const dots = X.P.map(q => { const pos = PT[q.player_slot] ? PT[q.player_slot](t) : null; if (!pos) return '';
    const lane = A0.includes(q) || A1.includes(q), dead = z36Dead(q, t);
    return `<i class="t${teamOf(q.team)}${lane ? ' ln' : ''}${dead ? ' dead' : ''}${q === p ? ' on' : ''}" style="left:${(100 * (pos.x + R) / (2 * R)).toFixed(2)}%;top:${(100 * (1 - (pos.y + R) / (2 * R))).toFixed(2)}%">${lane ? `<img src="${esc(hero(q.hero_id).i)}" alt="">` : ''}</i>`; }).join('');
  const evs = Z36.ev.map(e => `<button type="button" class="z36-e${e.t <= t ? ' past' : ''}" data-z36t="${Math.max(0, e.t - 5)}"><em>${mmss(e.t)}</em>${e.k ? `${face(e.k.hero_id, '', 's')}<span class="t${teamOf(e.k.team)}">${esc(pname(e.k))}</span><i>⚔</i>` : ''}${face(e.v.hero_id, '', 's')}<span class="t${teamOf(e.v.team)}">${esc(pname(e.v))}</span></button>`).join('');
  return `<div class="z36-lg"><div class="z36-side">${A0.map(card).join('') || '<div class="empty">Никого</div>'}</div>
    <section class="q-box z36-mid"><div class="z36-lead"><small>перевес на ${mmss(t)}</small><b class="t${lead >= 0 ? 0 : 1}">${Math.abs(lead) < 150 ? 'ровно' : `${est}+${nf(Math.abs(Math.round(lead)))}`}</b><span>${Math.abs(lead) < 150 ? '' : TEAMN[lead >= 0 ? 0 : 1]}</span></div>
      <div class="z36-cmp">${cmp}</div><div class="z36-mp">${D.map && D.map.img ? `<img src="${esc(D.map.img)}" alt="" onerror="this.remove()">` : ''}${dots}</div></section>
    <div class="z36-side">${A1.map(card).join('') || '<div class="empty">Никого</div>'}</div></div>
    ${evs ? `<section class="q-box z36-evl"><b>Смерти на линии</b><div>${evs}</div></section>` : ''}`;
}
function z36LaneBind(el) {
  z36ChartBind(el);
  const sl = $('#z36sl', el), lv = $('#z36lv', el), tm = $('#z36tm', el), tc = $('#z36tc', el), pb = $('#z36pl', el); if (!sl) return;
  const paint = t => { Z36.lt = Math.round(t); sl.value = Z36.lt; tm.textContent = mmss(Z36.lt); tc.style.left = (100 * Z36.lt / Math.max(1, MX.dur)) + '%'; lv.innerHTML = z36LaneView();
    $$('.z36-q button', el).forEach(b => b.classList.toggle('on', +b.dataset.z36t === Z36.lt)); };
  Z36.lpaint = paint;
  sl.addEventListener('input', () => { z36Stop(); pb.textContent = '▶'; paint(+sl.value); });
  const lc = $('.z36-tlc .z36-ch', el); if (lc) lc.addEventListener('click', e => { const r = $('svg', lc).getBoundingClientRect(), C = Z36.ch.ln, fx = (e.clientX - r.left) / r.width * C.W; z36Stop(); pb.textContent = '▶'; paint(Math.max(0, Math.min(MX.dur, (fx - C.pl) / (C.W - C.pl - C.pr) * MX.dur))); });
  let last = 0;
  const loop = ts => { if (!Z36.play) return; const dt = last ? (ts - last) / 1000 : 0; last = ts; let t = Z36.lt + dt * Z36.sp; if (t >= MX.dur) { t = MX.dur; Z36.play = 0; pb.textContent = '▶'; } Z36.lt = t; if (Math.round(t) !== +sl.value) paint(t); if (Z36.play) Z36.raf = requestAnimationFrame(loop); };
  pb.addEventListener('click', () => { if (Z36.play) { z36Stop(); pb.textContent = '▶'; return; } if (Z36.lt >= MX.dur) Z36.lt = 0; Z36.play = 1; last = 0; pb.textContent = '❚❚'; Z36.raf = requestAnimationFrame(loop); });
  paint(Z36.lt);
}

// ---------------- подключение к вкладкам ----------------
{ const MB36 = mBody;
  mBody = function () {
    z36Stop();
    const el = $('#qmb');
    if (!el || !MX || (MZ.tab !== 'gr' && MZ.tab !== 'ln')) return MB36();
    cancelAnimationFrame(MZ.raf); MZ.play = 0;
    if (Z36.mid !== MX.mid) { Z36.mid = MX.mid; Z36.lt = Math.min(600, MX.dur); }
    el.innerHTML = MZ.tab === 'gr' ? z36Gr() : z36Lane();
    el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
    if (MZ.tab === 'gr') z36GrBind(el); else z36LaneBind(el);
    $$('.qm-tabs button').forEach(b => b.classList.toggle('on', b.dataset.mt === MZ.tab));
    const w = $('.r9-who'); if (w && typeof r9Who === 'function') w.outerHTML = r9Who();
  }; }
document.addEventListener('click', e => {
  if (!MX) return;
  const k = e.target.closest('[data-z36k]'); if (k) { Z36.gk = k.dataset.z36k; if (Z36.gm !== 'time') Z36.gm = 'time'; mBody(); return; }
  const m = e.target.closest('[data-z36m]'); if (m) { Z36.gm = m.dataset.z36m; mBody(); return; }
  const g = e.target.closest('[data-z36g]'); if (g) { Z36.gt = g.dataset.z36g; mBody(); return; }
  const t = e.target.closest('[data-z36t]'); if (t && Z36.lpaint && $('#z36sl')) { z36Stop(); const pb = $('#z36pl'); if (pb) pb.textContent = '▶'; Z36.lpaint(+t.dataset.z36t); }
});
