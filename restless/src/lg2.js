// ==================== 31.10 (ночь) · места в топе честно, сборки по типу, про-матчи составами, статистика как в Deadlock Labs ====================
// время в метаданных матча — строкой «2026-10-17 10:58:15» (UTC), в истории — числом
const tsOf = v => typeof v === 'number' ? v : Math.floor(Date.parse(String(v || '').replace(' ', 'T') + 'Z') / 1000) || 0;
// ---------- регион и место в официальном лидерборде ----------
// Лидерборд героя в игре — это общий топ-1000 региона, отфильтрованный по главным героям игрока.
// Поэтому «#1 Рэм» = самый высокий ранг среди мейнов Рэм в топ-1000, а не лучший Рэм из всех.
const REGC = {NAmerica: 'US CA MX PR', SAmerica: 'BR AR CL PE CO UY PY BO EC VE', Asia: 'CN JP KR TW HK MO SG TH VN PH ID MY IN PK BD MN', Oceania: 'AU NZ'};
const REGN = {Europe: 'Европа', NAmerica: 'Сев. Америка', SAmerica: 'Юж. Америка', Asia: 'Азия', Oceania: 'Океания'};
const regOf = cc => { cc = String(cc || '').toUpperCase(); for (const [r, L] of Object.entries(REGC)) if (L.split(' ').includes(cc)) return r; return 'Europe'; };
const REGM = {};
async function myReg(id) { if (REGM[id]) return REGM[id]; const S = await api('players/steam?account_ids=' + id).catch(() => []); return (REGM[id] = regOf(((S || [])[0] || {}).countrycode)); }
// в строке лидерборда бывает несколько возможных аккаунтов — засчитываем, только если аккаунт один или совпал ник
const lbHit = (e, id, name) => { const ids = e.possible_account_ids || []; return ids.includes(id) && (ids.length === 1 || (!!name && e.account_name === name)); };
function topPlaces(n, id, name, cc, pool) {
  const rg = regOf(cc); REGM[id] = rg;
  api('leaderboard/' + rg).then(L => { if (n !== VQ) return; const E = L.entries || [], i = E.findIndex(e => lbHit(e, id, name)); if (i < 0) return;
    const c = $('#pchips'); if (c) { c.insertAdjacentHTML('beforeend', `<a class="q-chip q-top" href="#lb" id="eub" title="Место в официальном топ-1000 (${REGN[rg]}) — нажми, покажу строку">#${i + 1} в топе · ${REGN[rg]}</a>`); PBAN = $('.q-ban').outerHTML; }
    const el = $('#rtop'); if (el) el.insertAdjacentHTML('beforeend', ` · <a class="lnk" href="#lb" id="eub2">#${i + 1} в топе: ${REGN[rg]}</a>`);
    ['#eub', '#eub2'].forEach(s => { const a = $(s); if (a) a.onclick = () => { try { sessionStorage.setItem('lb-seek', '1'); } catch (er) {} }; }); }).catch(() => {});
  heroPlaces(n, id, name, pool.slice(0, 5), 'data-hlb', rg, true);
}
async function heroPlaces(n, id, name, L, attr, rg, chips) {
  rg = rg || await myReg(id); if (n !== VQ) return;
  L.filter(x => x.matches_played >= 20).forEach(x => api(`leaderboard/${rg}/${x.hero_id}`).then(Lb => { if (n !== VQ) return; const E = Lb.entries || [], e = E.find(z => lbHit(z, id, name)); if (!e) return;
    const tip = `Место среди ${E.length} игроков топ-1000 (${REGN[rg]}), у которых ${hero(x.hero_id).n} — один из главных героев. Лидерборд героя в игре — общий топ региона, отфильтрованный по героям.`;
    const s = $(`[${attr}="${x.hero_id}"]`); if (s) { s.textContent = `${attr === 'data-hlb2' ? ' · ' : ''}#${e.rank} из ${E.length} · топ ${REGN[rg] === 'Европа' ? 'Европы' : REGN[rg]}`; s.title = tip; s.className = 'q-hlb'; }
    if (chips && e.rank <= 10) { const c = $('#pchips'); if (c) { c.insertAdjacentHTML('beforeend', `<a class="q-chip" href="#h/${x.hero_id}/me" title="${esc(tip)}">${face(x.hero_id, '', '')}#${e.rank} из ${E.length} · ${esc(hero(x.hero_id).n)}</a>`); PBAN = $('.q-ban').outerHTML; } } }).catch(() => {}));
}

// ---------- ранги авторов сборок — пачкой ----------
async function authRanks(ids) {
  const need = [...new Set(ids)].filter(i => i && AR[i] == null);
  for (let i = 0; i < need.length; i += 100) {
    const part = need.slice(i, i + 100), R = await api('players/rank?account_ids=' + part.join(',')).catch(() => []);
    (R || []).forEach(r => { if (r.badge) AR[r.account_id] = r.badge; }); part.forEach(x => { if (AR[x] == null) AR[x] = 0; });
  }
}

// ---------- реплика героя: говорит сама при открытии (если уже было нажатие на странице) ----------
const VOK = () => { try { return localStorage.getItem('rl-vo') !== 'off'; } catch (e) { return true; } };
function voiceAuto(n) {
  const el = $('#hln'); if (n !== VQ || !el || !el.firstChild) return;
  if (!$('.q-vo')) el.insertAdjacentHTML('afterend', `<button class="q-vo${VOK() ? ' on' : ''}" type="button" title="Говорить реплику, когда открываешь героя">${VOK() ? 'Говорит сам ✓' : 'Говорит сам — выкл'}</button>`);
  const b = $('.q-vo'); if (b) b.onclick = () => { const on = !VOK(); try { localStorage.setItem('rl-vo', on ? 'on' : 'off'); } catch (e) {} b.classList.toggle('on', on); b.textContent = on ? 'Говорит сам ✓' : 'Говорит сам — выкл'; };
  const ua = navigator.userActivation; if (VOK() && (!ua || ua.hasBeenActive)) { const p = $('.pl', el); if (p) p.click(); }
}

// ---------- про-матчи: составы обеих команд ----------
const ML = new Map();
async function metaLite(ids) {
  const need = [...new Set(ids)].filter(id => !ML.has(id) && !(MD.get(id)));
  ids.forEach(id => { if (MD.get(id)) ML.set(id, MD.get(id)); });
  for (let i = 0; i < need.length; i += 12) {
    const part = need.slice(i, i + 12);
    const L = await api(`matches/metadata?match_ids=${part.join(',')}&include_info=true&include_player_info=true&limit=${part.length}`).catch(() => []);
    (L || []).forEach(m => ML.set(m.match_id, m)); part.forEach(id => { if (!ML.has(id)) ML.set(id, null); });
  }
}
let PROM = null;
function drawProM(n) {
  const X = PROM; if (!X || n !== VQ) return;
  const hs = [...new Set(X.MM.flatMap(m => m.players.map(p => p.hero_id)))].filter(h => D.heroes[h]).sort((a, b) => hero(a).n.localeCompare(hero(b).n));
  const L = X.MM.filter(m => !X.h || m.players.some(p => p.hero_id === X.h));
  const side = (m, k) => {
    const w = teamOf(m.winning_team) === k, P = m.players.filter(p => teamOf(p.team) === k).sort((a, b) => (a.player_slot || 0) - (b.player_slot || 0)), ab = m['average_badge_team' + k];
    return `<div class="q-pt2 ${w ? 'w' : 'l'}"><div class="q-pth"><b class="${w ? 'win' : 'loss'}">${w ? 'Победа' : 'Поражение'}</b><span>${k ? 'Сапфировое пламя' : 'Янтарная рука'}</span>${ab ? `<span class="q-pab" title="средний ранг команды: ${esc(rankOf(ab).name)}">${rankImg(ab, 'ri')}</span>` : ''}</div>
      <div class="q-pps">${P.map(p => { const pr = X.PRO[p.account_id], nm = (pr && pr.nm) || (SN[p.account_id] || {}).n || 'Игрок', hl = X.h && p.hero_id === X.h;
        return `<a class="q-pp${pr ? ' pro' : ''}${hl ? ' hl' : ''}" href="?id=${p.account_id}#home" title="${esc(nm)} · ${esc(hero(p.hero_id).n)} · ${p.kills || 0}/${p.deaths || 0}/${p.assists || 0}${pr ? ' · #' + pr.k + ' в топе Европы' : ''}">${face(p.hero_id, w ? 'g' : 'c', 's')}<span>${pr ? `<em>#${pr.k}</em>` : ''}${esc(nm)}</span><small>${p.kills || 0}/${p.deaths || 0}/${p.assists || 0}</small></a>`; }).join('')}</div></div>`;
  };
  put(n, '#pmt', `<div class="q-pmf"><select class="q-sel" id="pmh" aria-label="Герой"><option value="0">Все герои</option>${hs.map(h => `<option value="${h}"${X.h === h ? ' selected' : ''}>${esc(hero(h).n)}</option>`).join('')}</select><span class="sub">${L.length} ${pl(L.length, ['матч', 'матча', 'матчей'])} · жёлтым — игроки из топа · нажми на игрока — его профиль</span></div>
    ${L.map(m => `<div class="q-pm"><div class="q-pmh"><span>${esc(ago(tsOf(m.start_time)))}</span><span>${mmss(m.duration_s || 0)}</span>${m.average_badge ? `<span class="q-pab">${rankImg(m.average_badge, 'ri')}${esc(rankOf(m.average_badge).name)}</span>` : ''}<span class="sp" style="flex:1"></span><a class="lnk" href="#m/${m.match_id}">Разбор матча ›</a></div><div class="q-pmb">${side(m, 0)}<i class="q-vs">VS</i>${side(m, 1)}</div></div>`).join('') || '<div class="empty">С этим героем матчей нет.</div>'}`);
  const sel = $('#pmh'); if (sel) sel.onchange = e => { X.h = +e.target.value; drawProM(n); };
}

// ---------- статистика: Обзор · Линия · Смерти · Экономика · Бой (по поминутным данным последних матчей) ----------
const STN = {lane: 'Линия', deaths: 'Смерти', eco: 'Экономика', fight: 'Бой'};
let STN_N = 20; try { STN_N = +localStorage.getItem('rl-stn') === 40 ? 40 : 20; } catch (e) {}
const stTabs = on => `<nav class="qs-tabs" aria-label="Статистика">${[['', 'Обзор'], ...Object.entries(STN)].map(([k, v]) => `<a href="#form${k ? '/' + k : ''}" class="${(on || '') === k ? 'on' : ''}">${v}</a>`).join('')}</nav>`;
const SX = new Map();
async function statMeta(ids, prog) {
  const need = ids.filter(id => !SX.has(id));
  for (let i = 0; i < need.length; i += 10) {
    const part = need.slice(i, i + 10);
    const L = await api(`matches/metadata?match_ids=${part.join(',')}&include_info=true&include_player_info=true&include_player_stats=true&include_player_death_details=true&limit=${part.length}`).catch(() => []);
    (L || []).forEach(m => SX.set(m.match_id, m)); part.forEach(id => { if (!SX.has(id)) SX.set(id, null); });
    if (prog) prog(ids.length - need.length + Math.min(need.length, i + 10), ids.length);
  }
}
const snap = (p, t) => { let r = null; for (const s of p.stats || []) { if (s.time_stamp_s <= t) r = s; else break; } return r; };
const fin = p => { const S = p.stats || []; return S[S.length - 1] || {}; };
const inG = n => n + ' ' + pl(n, ['игре', 'играх', 'играх']);
const avg = (L, f) => L.length ? L.reduce((a, x) => a + (+f(x) || 0), 0) / L.length : 0;
const sgn = v => (v >= 0 ? '+' : '−') + nf(Math.abs(Math.round(v)));
const sCol = v => typeof fmCol === 'function' ? fmCol(v) : (v >= 60 ? 'var(--win)' : v <= 40 ? 'var(--loss)' : '#e8d36a');
function stOne(m, id) {
  const P = m.players || [], me = P.find(p => p.account_id === id); if (!me || !(me.stats || []).length) return null;
  const tm = teamOf(me.team), dur = Math.max(60, m.duration_s || 0), won = teamOf(m.winning_team) === tm;
  const mates = P.filter(p => teamOf(p.team) === tm), foes = P.filter(p => teamOf(p.team) !== tm);
  return {m, P, me, tm, dur, won, mates, foes, mate: mates.find(p => p !== me && p.assigned_lane === me.assigned_lane), lf: foes.filter(p => p.assigned_lane === me.assigned_lane)};
}
async function viewStats(tab) {
  if (!ME) return viewLanding();
  if (!tab) return stOverview();
  if (!STN[tab]) return viewForm();
  const n = vNew();
  V(`${ptabsHTML('form')}${stTabs(tab)}<div class="qs-top"><div class="seg" id="stn">${[20, 40].map(k => `<button data-n="${k}" class="${STN_N === k ? 'on' : ''}">Последние ${k}</button>`).join('')}</div><small class="sub">по поминутным данным матчей · сравнение — с другими игроками в тех же матчах</small></div>
    <div id="stb"><div class="load">Беру ${STN_N} последних матчей с поминутной статистикой — в первый раз до 20–40 секунд…</div></div>`);
  $$('#stn button').forEach(b => b.onclick = () => { STN_N = +b.dataset.n; try { localStorage.setItem('rl-stn', STN_N); } catch (e) {} viewStats(tab); });
  try {
    const H = await api('players/' + ME.id + '/match-history'); if (n !== VQ) return;
    const ids = H.slice(0, STN_N).map(m => m.match_id);
    await statMeta(ids, (k, t) => put(n, '#stb', `<div class="load">Загружено ${k} из ${t} матчей…</div>`)); if (n !== VQ) return;
    { const bn = $('.q-ban'); if (bn && PBAN_ID !== ME.id) bn.outerHTML = banLite(); }
    const G = ids.map(id => SX.get(id)).filter(Boolean).map(m => stOne(m, ME.id)).filter(Boolean);
    if (G.length < 3) { put(n, '#stb', '<div class="empty">Мало матчей с поминутными данными — нужно хотя бы 3.</div>'); return; }
    put(n, '#stb', ({lane: stLane, deaths: stDeaths, eco: stEco, fight: stFight})[tab](G));
    stBind(tab);
  } catch (e) { put(n, '#stb', `<div class="err">Не вышло: ${esc(e.message)}</div>`); }
}
function stBind(tab) {
  const b = $('#stb'); if (!b) return;
  b.onclick = e => {
    const f = e.target.closest('[data-lf]'); if (f) { $$('[data-lf]', b).forEach(x => x.classList.toggle('on', x === f)); const v = f.dataset.lf; $$('.qs-lc', b).forEach(c => c.hidden = v !== 'all' && c.dataset.r !== v); return; }
    const mb = e.target.closest('[data-mb]'); if (mb) { $$('[data-mb]', b).forEach(x => x.classList.toggle('on', x === mb)); const m = $('.qs-map', b); if (m) m.dataset.b = mb.dataset.mb; return; }
  };
}
const card = (k, v, sub, cls) => `<div class="qs-c${cls ? ' ' + cls : ''}"><span class="qs-k">${k}</span><b class="qs-v">${v}</b>${sub ? `<small>${sub}</small>` : ''}</div>`;
const paper = (k, sc, lbl, note) => `<div class="qs-paper"><span class="qs-pk">${k}</span><div class="qs-pn"><b>${sc}</b><small>/ 100</small></div><div class="qs-pl" style="color:${sCol(sc)}">${lbl}</div><div class="qs-gg"><i style="left:${Math.max(2, Math.min(98, sc))}%"></i><span>0</span><span>как в среднем · 50</span><span>100</span></div>${note ? `<p>${note}</p>` : ''}</div>`;
const lblOf = sc => sc >= 70 ? 'Сильно лучше лобби' : sc >= 58 ? 'Лучше среднего' : sc >= 45 ? 'Как в среднем' : sc >= 35 ? 'Чуть ниже среднего' : 'Слабое место';
const ins = (k, cls, txt, w) => `<div class="qs-i ${cls}"><b>${k}</b><span>${txt}</span>${w != null ? `<div class="qs-ib"><i style="width:${Math.max(4, Math.min(100, w))}%"></i></div>` : ''}</div>`;

// ----- Линия: дуэт против дуэта на 9:00 -----
function laneOf(g) {
  if (!g.mate || g.lf.length !== 2 || g.dur < 560) return null;
  const nw = (p, t) => (snap(p, t) || {}).net_worth || 0, d = t => nw(g.me, t) + nw(g.mate, t) - nw(g.lf[0], t) - nw(g.lf[1], t), D9 = d(540);
  return {g, d: D9, curve: [0, d(180), d(360), D9], res: D9 >= 1000 ? 'w' : D9 <= -1000 ? 'l' : 'e', sc: Math.round(50 + 50 * Math.tanh(D9 / 4000))};
}
function stLane(G) {
  const L = G.map(laneOf).filter(Boolean); if (L.length < 3) return '<div class="empty">Мало матчей с данными линии (нужен напарник и двое соперников на линии до 9-й минуты).</div>';
  const W = L.filter(x => x.res === 'w'), E = L.filter(x => x.res === 'e'), Ls = L.filter(x => x.res === 'l');
  const sc = Math.round(avg(L, x => x.sc)), dAvg = avg(L, x => x.d), wrIf = X => X.length >= 2 ? Math.round(100 * X.filter(x => x.g.won).length / X.length) : null;
  const vs = {}; L.forEach(x => x.g.lf.forEach(p => { const o = vs[p.hero_id] = vs[p.hero_id] || {n: 0, d: 0}; o.n++; o.d += x.d; }));
  const VS = Object.entries(vs).filter(([h, o]) => o.n >= 2 && D.heroes[h]).map(([h, o]) => ({h: +h, n: o.n, d: o.d / o.n})).sort((a, b) => a.d - b.d);
  const seq = L.map(x => x.res); let cur = 0; for (const r of seq) { if (r === 'w') cur++; else break; }
  let bw = 0, bl = 0, rw = 0, rl = 0; seq.slice().reverse().forEach(r => { rw = r === 'w' ? rw + 1 : 0; rl = r === 'l' ? rl + 1 : 0; bw = Math.max(bw, rw); bl = Math.max(bl, rl); });
  const ww = wrIf(W), wl = wrIf(Ls), hard = VS[0], easy = VS[VS.length - 1];
  const lc = x => { const g = x.g, nw = p => (snap(p, 540) || {}).net_worth || 0, k = p => { const s = snap(p, 540) || {}; return `${s.kills || 0}/${s.deaths || 0}/${s.assists || 0}`; };
    const duo = A => A.map(p => `<div class="qs-lp">${face(p.hero_id, '', 's')}<span><b>${esc(hero(p.hero_id).n)}</b><small>${k(p)} · ${kFmt(nw(p))}</small></span></div>`).join('');
    const C = x.curve, mx = Math.max(1500, ...C.map(Math.abs)), pts = C.map((v, i) => `${(i * 40).toFixed(0)},${(30 - 25 * v / mx).toFixed(1)}`).join(' ');
    return `<a class="qs-lc ${x.res}" href="#m/${g.m.match_id}" data-r="${x.res}"><div class="qs-lch"><span>${esc(dmy(tsOf(g.m.start_time)))} · ${mmss(g.dur)}</span><b class="qs-res ${x.res}">${{w: 'Выиграл', e: 'Ровно', l: 'Проиграл'}[x.res]}</b></div>
      <div class="qs-lcb"><div class="qs-duo">${duo([g.me, g.mate])}</div><div class="qs-mid"><svg viewBox="-4 0 128 60" aria-hidden="true"><line x1="0" x2="120" y1="30" y2="30"/><polyline points="${pts}"/><circle cx="120" cy="${(30 - 25 * C[3] / mx).toFixed(1)}" r="3.5"/></svg><b class="${x.d >= 0 ? 'win' : 'loss'}">${sgn(x.d)}</b><small>душ дуэта на 9:00</small></div><div class="qs-duo r">${duo(g.lf)}</div></div>
      <div class="qs-lcf"><span>Оценка линии <b style="color:${sCol(x.sc)}">${x.sc}</b></span><b class="${g.won ? 'win' : 'loss'}">${g.won ? 'Игра выиграна' : 'Игра проиграна'}</b></div></a>`; };
  return `<div class="qs-g">
      ${paper('Оценка линии', sc, lblOf(sc), `50 — линия в ноль на 9:00. Среднее по ${L.length} ${pl(L.length, ['линии', 'линиям', 'линиям'])}.`)}
      <div class="qs-cs">
        ${card('Линий выиграно', `<span class="${W.length >= Ls.length ? 'win' : 'loss'}">${Math.round(100 * W.length / L.length)}%</span>`, `${W.length} выиграл · ${E.length} ровно · ${Ls.length} проиграл<span class="qs-wel"><i class="w" style="flex:${W.length}"></i><i class="e" style="flex:${E.length}"></i><i class="l" style="flex:${Ls.length}"></i></span>`)}
        ${card('Перевес на 9:00', `<span class="${dAvg >= 0 ? 'win' : 'loss'}">${sgn(dAvg)}</span>`, 'душ у твоего дуэта против соперников, в среднем')}
        ${(() => { const ck = p => (snap(p, 540) || {}).creep_kills || 0, me = avg(L, x => ck(x.g.me)), op = avg(L, x => avg(x.g.lf, ck)); return card('Крипы к 9:00', `<span class="${me >= op ? 'win' : 'loss'}">${Math.round(me)}</span>`, `у соперников по линии ${Math.round(op)}`); })()}
        ${card('Линия → игра', ww != null || wl != null ? `<span class="win">${ww != null ? ww + '%' : '—'}</span> / <span class="loss">${wl != null ? wl + '%' : '—'}</span>` : '—', 'побед, когда линия выиграна / проиграна')}
      </div>
      <div class="qs-is">
        ${hard && hard.d < 0 ? ins('Тяжелее всего', 'r', `${face(hard.h, 'c', 's')} ${esc(hero(hard.h).n)}: ${sgn(hard.d)} душ на 9:00 в ${inG(hard.n)}`, 50 + 50 * Math.tanh(-hard.d / 4000)) : ''}
        ${easy && easy.d > 0 ? ins('Легче всего', 'g', `${face(easy.h, 'g', 's')} ${esc(hero(easy.h).n)}: ${sgn(easy.d)} душ на 9:00 в ${inG(easy.n)}`, 50 + 50 * Math.tanh(easy.d / 4000)) : ''}
        ${ins('Главное', 'a', ww != null && wl != null && ww - wl >= 15 ? `Линия решает: выиграв её, побеждаешь в ${ww}% игр, проиграв — в ${wl}%. Держи линию до 9-й минуты.` : dAvg < -500 ? 'Чаще проигрываешь линию по душам — меньше размена, больше крипов и сфер.' : 'Линия в порядке — игры решаются позже, смотри «Смерти» и «Экономику».')}
      </div>
    </div>
    <div class="qs-box qs-str"><div class="qs-sk"><b>${cur}</b><span>выигранных линий подряд</span></div><div class="qs-sk"><b class="win">${bw}</b><span>самая длинная серия побед на линии</span></div><div class="qs-sk"><b class="loss">${bl}</b><span>самая длинная серия поражений</span></div>
      <div class="qs-dots" title="последние линии: слева — свежие">${seq.slice(0, 40).map(r => `<i class="${r}"></i>`).join('')}</div></div>
    <div class="qs-h"><b>Журнал линий</b><small>каждая карточка — матч: твой дуэт против двух соперников на линии · кривая — разница душ на 3:00, 6:00 и 9:00 · нажми — разбор</small></div>
    <div class="qs-lf seg">${[['all', 'Все', L.length], ['w', 'Выиграл', W.length], ['e', 'Ровно', E.length], ['l', 'Проиграл', Ls.length]].map(([k, nm, c], i) => `<button data-lf="${k}" class="${i ? '' : 'on'}">${nm} <small>${c}</small></button>`).join('')}</div>
    <div class="qs-lj">${L.map(lc).join('')}</div>`;
}

// ----- Смерти: где, когда, от кого -----
function stDeaths(G) {
  const R = (D.map && D.map.r) || 10752, pos = q => ({l: 100 * (q[0] + R) / (2 * R), t: 100 * (1 - (q[1] + R) / (2 * R))});
  const DL = []; G.forEach(g => { const slot = {}; g.P.forEach(p => slot[p.player_slot] = p); (g.me.death_details || []).forEach(d => DL.push({g, t: d.game_time_s || 0, k: slot[d.killer_player_slot], pos: d.death_pos, ttk: d.time_to_kill_s || 0, dd: d.death_duration_s || 0})); });
  const n = G.length, dpg = DL.length / n, lob = avg(G, g => avg(g.P, p => p.deaths)), lane = DL.filter(x => x.t < 600).length / n;
  const lost = avg(G, g => fin(g.me).gold_death_loss), share = 100 * avg(G, g => (fin(g.me).gold_death_loss || 0) / Math.max(1, (g.me.net_worth || 0) + (fin(g.me).gold_death_loss || 0)));
  const deadPct = 100 * avg(G, g => (g.me.death_details || []).reduce((a, d) => a + (d.death_duration_s || 0), 0) / g.dur);
  const fast = DL.filter(x => x.ttk > 0 && x.ttk < 3).length, slow = DL.filter(x => x.ttk >= 8).length, mid = DL.length - fast - slow;
  const K = {}; DL.forEach(x => { if (!x.k || teamOf(x.k.team) === x.g.tm) return; (K[x.k.hero_id] = K[x.k.hero_id] || {k: 0}).k++; });
  const KL = Object.entries(K).map(([h, o]) => ({h: +h, k: o.k, n: G.filter(g => g.foes.some(p => p.hero_id === +h)).length})).filter(x => D.heroes[x.h] && x.n).map(x => ({...x, r: x.k / x.n})).sort((a, b) => (b.n >= 2) - (a.n >= 2) || b.r - a.r || b.k - a.k).slice(0, 5);
  const kmx = Math.max(1, ...KL.map(x => x.r));
  const Wg = G.filter(g => g.won), Lg = G.filter(g => !g.won), blk = t => Math.min(7, Math.floor(t / 300));
  const per = (X, b) => X.length ? DL.filter(x => X.includes(x.g) && blk(x.t) === b).length / X.length : 0;
  const BW = [0, 1, 2, 3, 4, 5, 6, 7].map(b => [per(Wg, b), per(Lg, b)]), bmx = Math.max(.5, ...BW.flat());
  const gap = BW.map((v, i) => ({i, d: v[1] - v[0]})).sort((a, b) => b.d - a.d)[0];
  const bk = t => Math.min(3, Math.floor(t / 600)), BN = ['0–10 мин', '10–20 мин', '20–30 мин', '30+ мин'];
  const map = D.map && D.map.img ? `<div class="qs-map" data-b="all"><img src="${esc(D.map.img)}" alt="Карта" loading="lazy" onerror="this.remove()">${DL.filter(x => x.pos).map(x => { const q = pos(x.pos); return `<i class="qs-dd b${bk(x.t)}${x.g.won ? '' : ' l'}" style="left:${q.l.toFixed(1)}%;top:${q.t.toFixed(1)}%" title="${mmss(x.t)} · ${x.k ? 'убил ' + esc(hero(x.k.hero_id).n) : 'не герой'} · ${x.g.won ? 'победа' : 'поражение'}"></i>`; }).join('')}</div>` : '';
  const dd = dpg - lob;
  return `<div class="qs-g">
      ${paper('Выживание', Math.round(Math.max(0, Math.min(100, 50 - 12 * dd))), dd <= -1 ? 'Умираешь реже лобби' : dd >= 1 ? 'Умираешь чаще лобби' : 'Как в среднем', `${f1(dpg)} смерти за игру, у остальных в тех же матчах — ${f1(lob)}.`)}
      <div class="qs-cs">
        ${card('Смертей за игру', `<span class="${dd <= 0 ? 'win' : 'loss'}">${f1(dpg)}</span>`, `у других игроков в тех же матчах ${f1(lob)}`)}
        ${card('На линии', `<span class="${lane <= .8 ? 'win' : 'loss'}">${f1(lane)}</span>`, 'смертей до 10-й минуты за игру')}
        ${card('Потеряно душ', nf(Math.round(lost)), `за игру на смертях · ${f1(share)}% твоих душ`)}
        ${card('Мёртвым', `${f1(deadPct)}%`, 'времени матча ждёшь возрождения')}
      </div>
      <div class="qs-is">
        ${KL[0] ? ins('Твой кошмар', 'r', `${face(KL[0].h, 'g', 's')} ${esc(hero(KL[0].h).n)}: ${KL[0].k} ${pl(KL[0].k, ['убийство', 'убийства', 'убийств'])} тебя в ${inG(KL[0].n)}`, 100 * KL[0].r / kmx) : ''}
        ${ins('Как убивают', 'a', DL.length ? `${Math.round(100 * fast / DL.length)}% смертей — быстрее 3 секунд (поймали и взорвали), ${Math.round(100 * slow / DL.length)}% — долгие, 8+ секунд (не ушёл из драки).` : 'Смертей нет.', DL.length ? 100 * fast / DL.length : 0)}
        ${gap && gap.d > .15 ? ins('Где проигрываешь', 'r', `Больше всего разница на ${gap.i * 5}–${gap.i * 5 + 5}${gap.i === 7 ? '+' : ''} минуте: ${f1(BW[gap.i][1])} смерти в поражениях против ${f1(BW[gap.i][0])} в победах.`) : ins('Где проигрываешь', 'g', 'Смерти в победах и поражениях распределены одинаково — не они решают игру.')}
      </div>
    </div>
    <div class="qs-2">
      <div class="qs-box"><div class="qs-bh"><b>Где ты умираешь</b><small>${DL.length} ${pl(DL.length, ['смерть', 'смерти', 'смертей'])} · ${games(n)} · кольцо — смерть в поражении</small></div>
        <div class="qs-mf seg"><button data-mb="all" class="on">Все</button>${BN.map((x, i) => `<button data-mb="${i}"><i class="qs-dd b${i}"></i>${x}</button>`).join('')}</div>${map || '<div class="empty">Карты нет.</div>'}</div>
      <div>
        <div class="qs-box qs-chalk"><div class="qs-bh"><b>Кто тебя убивает</b><small>убийств тебя за игру против этого героя</small></div>
          ${KL.map(x => `<div class="qs-kr">${face(x.h, 'g', 's')}<span><b>${esc(hero(x.h).n)}</b><small>${x.k} ${pl(x.k, ['убийство', 'убийства', 'убийств'])} в ${inG(x.n)}</small><i class="qs-bar r" style="--w:${Math.round(100 * x.r / kmx)}%"></i></span><em>${f1(x.r)}</em></div>`).join('') || '<div class="empty">Нет данных.</div>'}</div>
        <div class="qs-box qs-chalk"><div class="qs-bh"><b>Когда ты умираешь</b><small>смертей за игру по 5 минут · зелёный — победы, красный — поражения</small></div>
          <div class="qs-bars">${BW.map((v, i) => `<div><span class="w" style="--h:${Math.round(100 * v[0] / bmx)}%" title="в победах: ${f1(v[0])}"></span><span class="l" style="--h:${Math.round(100 * v[1] / bmx)}%" title="в поражениях: ${f1(v[1])}"></span><small>${i * 5}${i === 7 ? '+' : ''}</small></div>`).join('')}</div></div>
      </div>
    </div>`;
}

// ----- Экономика: откуда души и куда уходят -----
const SRC = [['lane', 'Крипы на линии', '#3fbf8f', ['lane_creeps']], ['jg', 'Лес', '#a3d34a', ['neutrals']], ['kill', 'Убийства', '#ff6b81', ['players']], ['ast', 'Помощь', '#ff9eb0', ['assists']],
  ['obj', 'Боссы и объекты', '#5aa9ff', ['bosses']], ['box', 'Ящики, урны, сокровища', '#b48cff', ['breakable', 'treasure']], ['den', 'Денаи', '#36d6c3', ['denies']]];
const SRCK = new Set(SRC.flatMap(x => x[3]));
const srcOf = (s, keys) => keys.reduce((a, k) => a + (s['gold_source_' + k + '_gold'] || 0) + (s['gold_source_' + k + '_gold_orbs'] || 0), 0);
const srcOther = s => Object.keys(s).filter(k => /^gold_source_.+_gold(_orbs)?$/.test(k) && !SRCK.has(k.replace(/^gold_source_/, '').replace(/_gold(_orbs)?$/, ''))).reduce((a, k) => a + (s[k] || 0), 0);
function stEco(G) {
  const spm = (g, p) => (p.net_worth || 0) / (g.dur / 60);
  const me = avg(G, g => spm(g, g.me)), lob = avg(G, g => avg(g.P, p => spm(g, p))), share = 100 * avg(G, g => (g.me.net_worth || 0) / Math.max(1, g.mates.reduce((a, p) => a + (p.net_worth || 0), 0)));
  const place = avg(G, g => 1 + g.mates.filter(p => (p.net_worth || 0) > (g.me.net_worth || 0)).length);
  const lost = avg(G, g => fin(g.me).gold_death_loss);
  const S = SRC.map(([k, nm, col, keys]) => ({k, nm, col, me: avg(G, g => srcOf(fin(g.me), keys)), lob: avg(G, g => avg(g.P, p => srcOf(fin(p), keys)))}));
  S.push({k: 'oth', nm: 'Прочее (предметы, бонусы)', col: '#8e897f', me: avg(G, g => srcOther(fin(g.me))), lob: avg(G, g => avg(g.P, p => srcOther(fin(p))))});
  const tot = S.reduce((a, x) => a + x.me, 0) || 1, smx = Math.max(1, ...S.map(x => x.me));
  const T = [180, 360, 540, 720, 900, 1200, 1500], nwAt = (p, t) => (snap(p, t) || {}).net_worth || 0;
  const cur = X => T.map(t => { const Y = X.filter(g => g.dur >= t + 20); return Y.length ? avg(Y, g => nwAt(g.me, t) - avg(g.P, p => nwAt(p, t))) : null; });
  const CA = cur(G), CW = cur(G.filter(g => g.won)), CL = cur(G.filter(g => !g.won));
  const cmx = Math.max(500, ...[...CA, ...CW, ...CL].filter(v => v != null).map(Math.abs)), X0 = 60, XW = 910, Y0 = 120, YH = 96;
  const px = i => X0 + i * XW / (T.length - 1), py = v => Y0 - YH * v / cmx;
  const line = (C, cls) => { const P2 = C.map((v, i) => v == null ? null : `${px(i).toFixed(0)},${py(v).toFixed(1)}`).filter(Boolean); return P2.length > 1 ? `<polyline class="${cls}" points="${P2.join(' ')}"/>` : ''; };
  const curve = `<svg class="qs-cv" viewBox="0 0 1000 250" role="img" aria-label="Души против лобби по минутам">
    <line class="z" x1="${X0}" x2="${X0 + XW}" y1="${Y0}" y2="${Y0}"/><text x="4" y="${Y0 + 4}">0</text><text x="4" y="${py(cmx) + 10}">+${kFmt(cmx)}</text><text x="4" y="${py(-cmx) - 2}">−${kFmt(cmx)}</text>
    ${T.map((t, i) => `<text x="${px(i)}" y="244" text-anchor="middle">${t / 60}:00</text>`).join('')}
    ${line(CL, 'l')}${line(CW, 'w')}${line(CA, 'a')}${CA.map((v, i) => v == null ? '' : `<circle cx="${px(i)}" cy="${py(v).toFixed(1)}" r="4"><title>${T[i] / 60}:00 — ${sgn(v)} душ к среднему в матче</title></circle>`).join('')}</svg>`;
  const BH = {}; G.forEach(g => { const o = BH[g.me.hero_id] = BH[g.me.hero_id] || {n: 0, r: 0}; o.n++; o.r += spm(g, g.me) / Math.max(1, avg(g.P, p => spm(g, p))); });
  const bf = Object.entries(BH).filter(([h, o]) => o.n >= 2 && D.heroes[h]).map(([h, o]) => ({h: +h, n: o.n, r: o.r / o.n})).sort((a, b) => b.r - a.r)[0];
  const i20 = T.indexOf(1200), lev = CW[i20] != null && CL[i20] != null ? CW[i20] - CL[i20] : null;
  const sc = Math.round(Math.max(0, Math.min(100, 50 + 50 * Math.tanh(2.2 * (me / Math.max(1, lob) - 1)))));
  return `<div class="qs-g">
      ${paper('Экономика', sc, lblOf(sc), `${nf(Math.round(me))} душ в минуту против ${nf(Math.round(lob))} у остальных в тех же матчах.`)}
      <div class="qs-cs">
        ${card('Души / мин', `<span class="${me >= lob ? 'win' : 'loss'}">${nf(Math.round(me))}</span>`, `в среднем в твоих матчах ${nf(Math.round(lob))}`)}
        ${card('Доля команды', `${f1(share)}%`, `душ команды у тебя · в среднем ${f1(place)}-й из 6`)}
        ${card('Теряешь на смертях', `<span class="loss">${nf(Math.round(lost))}</span>`, 'душ за игру')}
        ${card('Фарм к 20:00', CA[i20] != null ? `<span class="${CA[i20] >= 0 ? 'win' : 'loss'}">${sgn(CA[i20])}</span>` : '—', 'душ к среднему игроку матча')}
      </div>
      <div class="qs-is">
        ${lev != null ? ins('Главный рычаг', lev > 1500 ? 'r' : 'a', `К 20-й минуте в победах у тебя ${sgn(CW[i20])} к лобби, в поражениях ${sgn(CL[i20])}. ${lev > 1500 ? 'Фарм к 20-й решает твои игры.' : 'Фарм почти одинаковый — игры решает другое.'}`) : ''}
        ${bf ? ins('Лучший фарм', 'g', `${face(bf.h, 'g', 's')} ${esc(hero(bf.h).n)}: ${Math.round(100 * bf.r)}% от среднего фарма матча в ${inG(bf.n)}`, 50 * bf.r) : ''}
        ${(() => { const big = S.filter(x => x.lob > 200).map(x => ({...x, d: x.me / Math.max(1, x.lob)})).sort((a, b) => a.d - b.d)[0]; return big ? ins('Недобираешь', 'r', `${big.nm}: ${nf(Math.round(big.me))} за игру против ${nf(Math.round(big.lob))} у других — ${Math.round(100 * big.d)}%.`, 100 * big.d) : ''; })()}
      </div>
    </div>
    <div class="qs-box"><div class="qs-bh"><b>Откуда души</b><small>в среднем за игру · справа — разница с другими игроками в тех же матчах</small></div>
      <div class="qs-src">${S.map(x => `<div class="qs-sr"><span class="qs-sn"><i style="background:${x.col}"></i>${x.nm}</span><span class="qs-sb"><i style="--w:${Math.round(100 * x.me / smx)}%;background:${x.col}"></i></span><b>${nf(Math.round(x.me))}</b><small>${Math.round(100 * x.me / tot)}%</small><em class="${x.me >= x.lob ? 'win' : 'loss'}">${sgn(x.me - x.lob)}</em></div>`).join('')}
        <div class="qs-sr qs-loss"><span class="qs-sn"><i style="background:var(--loss)"></i>Потеряно на смертях</span><span class="qs-sb"><i style="--w:${Math.round(100 * lost / smx)}%;background:var(--loss)"></i></span><b class="loss">−${nf(Math.round(lost))}</b><small></small><em></em></div></div></div>
    <div class="qs-box qs-chalk"><div class="qs-bh"><b>Кривая фарма</b><small>души против среднего игрока в тех же матчах · белая — все игры, зелёная — победы, красная — поражения</small></div>${curve}</div>`;
}

// ----- Бой: урон, точность, участие — против остальных 11 игроков матча -----
const FT = [
  ['dmg', 'Урон по героям', 'в минуту', (g, p) => (fin(p).player_damage || 0) / (g.dur / 60), v => nf(Math.round(v))],
  ['kp', 'Участие в убийствах', 'убийства + помощь от убийств команды', (g, p) => { const t = g.P.filter(q => teamOf(q.team) === teamOf(p.team)).reduce((a, q) => a + (q.kills || 0), 0); return t ? ((p.kills || 0) + (p.assists || 0)) / t : 0; }, v => Math.round(100 * v) + '%'],
  ['acc', 'Точность', 'попадания из всех выстрелов', (g, p) => { const s = fin(p), a = (s.shots_hit || 0) + (s.shots_missed || 0); return a ? (s.shots_hit || 0) / a : 0; }, v => Math.round(100 * v) + '%'],
  ['crit', 'Криты', 'доля критов в попаданиях по героям', (g, p) => { const s = fin(p); return s.hero_bullets_hit ? (s.hero_bullets_hit_crit || 0) / s.hero_bullets_hit : 0; }, v => Math.round(100 * v) + '%'],
  ['heal', 'Лечение', 'себя и союзников, в минуту', (g, p) => (fin(p).player_healing || 0) / (g.dur / 60), v => nf(Math.round(v))],
  ['obj', 'Урон по объектам', 'боссы и стражи, в минуту', (g, p) => (fin(p).boss_damage || 0) / (g.dur / 60), v => nf(Math.round(v))],
  ['tak', 'Получено урона', 'в минуту · меньше — лучше', (g, p) => (fin(p).player_damage_taken || 0) / (g.dur / 60), v => nf(Math.round(v)), 1],
];
function stFight(G) {
  const R = FT.map(([k, nm, h, f, fmt, low]) => {
    const one = g => { const v = f(g, g.me), all = g.P.map(p => f(g, p)), pl2 = 1 + all.filter(x => low ? x < v : x > v).length; return {v, lob: avg(all, x => x), pl: pl2, w: g.won}; };
    const X = G.map(one), pct = X2 => X2.length ? avg(X2, x => (12 - x.pl) / 11) : null;
    return {k, nm, h, fmt, me: avg(X, x => x.v), lob: avg(X, x => x.lob), pl: avg(X, x => x.pl), p: pct(X), pw: pct(X.filter(x => x.w)), pL: pct(X.filter(x => !x.w))};
  });
  const RS = R.filter(x => x.k !== 'tak'), sR = RS.slice().sort((a, b) => b.p - a.p), str = sR[0], weak = sR[sR.length - 1];
  const kt = {b: 0, a: 0, m: 0}; G.forEach(g => { const s = fin(g.me); kt.b += s.bullet_kills || 0; kt.a += s.ability_kills || 0; kt.m += s.melee_kills || 0; });
  const ktt = kt.b + kt.a + kt.m || 1, dm = R.find(x => x.k === 'dmg'), kp = R.find(x => x.k === 'kp');
  const sc = Math.round(100 * avg(RS, x => x.p));
  return `<div class="qs-g">
      ${paper('Бой', sc, lblOf(sc), `Среднее место по ${RS.length} показателям среди 12 игроков матча: ${f1(avg(RS, x => x.pl))}-е.`)}
      <div class="qs-cs">
        ${card('Урон по героям', `<span class="${dm.me >= dm.lob ? 'win' : 'loss'}">${nf(Math.round(dm.me))}</span>`, `в минуту · у других ${nf(Math.round(dm.lob))}`)}
        ${card('Участие', `<span class="${kp.me >= kp.lob ? 'win' : 'loss'}">${Math.round(100 * kp.me)}%</span>`, `в убийствах команды · у других ${Math.round(100 * kp.lob)}%`)}
        ${(() => { const ac = R.find(x => x.k === 'acc'); return card('Точность', `<span class="${ac.me >= ac.lob ? 'win' : 'loss'}">${Math.round(100 * ac.me)}%</span>`, `у других ${Math.round(100 * ac.lob)}% · ${f1(ac.pl)}-е место из 12`); })()}
        ${(() => { const he = R.find(x => x.k === 'heal'); return card('Лечение', nf(Math.round(he.me)), `в минуту · у других ${nf(Math.round(he.lob))}`); })()}
      </div>
      <div class="qs-is">
        ${ins('Сильная сторона', 'g', `${str.nm}: в среднем ${f1(str.pl)}-е место из 12 — ${str.fmt(str.me)} против ${str.fmt(str.lob)} у остальных.`, 100 * str.p)}
        ${ins('Слабое место', 'r', `${weak.nm}: в среднем ${f1(weak.pl)}-е место из 12 — ${weak.fmt(weak.me)} против ${weak.fmt(weak.lob)} у остальных.`, 100 * weak.p)}
        <div class="qs-i a"><b>Как ты убиваешь</b><span>${kt.b + kt.a + kt.m ? `<span class="q-ctx c-gun">Пулями ${Math.round(100 * kt.b / ktt)}%</span> · <span class="q-ctx c-spirit">способностями ${Math.round(100 * kt.a / ktt)}%</span> · в ближнем бою ${Math.round(100 * kt.m / ktt)}%` : 'Убийств пока нет.'}</span><div class="qs-kt"><i class="c-gun" style="flex:${kt.b}"></i><i class="c-spirit" style="flex:${kt.a}"></i><i class="m" style="flex:${kt.m}"></i></div></div>
      </div>
    </div>
    <div class="qs-box qs-paperbox"><div class="qs-bh"><b>Столпы боя</b><small>место среди 12 игроков матча: середина — как все, правее — лучше · точки: зелёная — в победах, красная — в поражениях</small></div>
      ${R.map(x => `<div class="qs-pr"><div><b>${x.nm}</b><small>${x.h}</small></div><div class="qs-pb"><i class="f" style="--w:${Math.round(100 * x.p)}%"></i>${x.pw != null ? `<i class="d w" style="left:${Math.round(100 * x.pw)}%"></i>` : ''}${x.pL != null ? `<i class="d l" style="left:${Math.round(100 * x.pL)}%"></i>` : ''}<i class="m"></i></div><div class="qs-pv"><b>${f1(x.pl)}-е</b><small>${x.fmt(x.me)} · у других ${x.fmt(x.lob)}</small></div></div>`).join('')}</div>`;
}

// ---------- рейтинг на герое: точное место в мире среди всех игроков на герое (по победам на нём) ----------
// analytics/scoreboards/players отдаёт игроков героя по убыванию побед; своё значение берём фильтром account_ids,
// место ищем вилкой (несколько точечных запросов limit=1), потом одной страницей до 10 000 строк. При равенстве — лучшее место из равных.
const HRC = {}, RTH = {};
const SBQ = q => api('analytics/scoreboards/players?' + q);
function heroRating(hid, id) {
  const k = hid + '|' + id; if (HRC[k]) return HRC[k];
  HRC[k] = (async () => {
    const base = `hero_id=${hid}&sort_by=wins&min_matches=1`, me = ((await SBQ(`${base}&account_ids=${id}`).catch(() => [])) || [])[0];
    if (!me || !me.value) return {pos: 0, v: me ? me.value : 0, m: me ? me.matches : 0};
    const v = me.value, probe = async s => { const r = await SBQ(`${base}&start=${s}&limit=1`).catch(() => null); return r ? (r[0] ? {r: r[0].rank, v: r[0].value} : {r: s, v: -1}) : null; };
    let lo = {r: 0, v: Infinity}, hi = null, pts = [1000, 10000, 50000, 150000, 400000];
    for (let d = 0; d < 5; d++) {
      (await Promise.all(pts.map(probe))).filter(Boolean).forEach(p => { if (p.v > v && p.r > lo.r) lo = p; if (p.v <= v && (!hi || p.r < hi.r)) hi = p; });
      if (!hi) hi = {r: lo.r + 10000};
      if (hi.r - lo.r <= 10000) break;
      const step = (hi.r - lo.r) / 7; pts = [1, 2, 3, 4, 5, 6].map(i => Math.round(lo.r + step * i));
    }
    const L = await SBQ(`${base}&start=${lo.r}&limit=${Math.max(1, Math.min(10000, hi.r - lo.r + 1))}`).catch(() => []);
    const f = (L || []).find(x => x.value <= v);
    return {pos: f ? f.rank : hi.r, v, m: me.matches};
  })();
  HRC[k].catch(() => delete HRC[k]);
  return HRC[k];
}
const rtCell = r => r && r.pos ? `<b class="q-rtn${r.pos <= 100 ? ' top' : r.pos <= 1000 ? ' hi' : ''}" title="Место в мире среди всех игроков на герое по числу побед: ${nf(r.v)} ${pl(r.v, ['победа', 'победы', 'побед'])} за ${nf(r.m)} ${pl(r.m, ['игру', 'игры', 'игр'])}">#${nf(r.pos)}</b><small>в мире</small>` : '<span class="sub" title="побед на герое пока нет">—</span>';
async function heroRatings(n, id, hids, attr) {
  for (const hid of hids) {
    const r = await heroRating(hid, id).catch(() => null); if (n !== VQ) return;
    RTH[id + '|' + hid] = rtCell(r);
    $$(`[${attr}="${hid}"]`).forEach(c => { c.innerHTML = RTH[id + '|' + hid]; });
  }
}

// ---------- герой говорит — как в макете «Реплики · кто про кого»: слова крупно по одному поверх портрета, волна голоса, потом вся фраза с переводом ----------
let SAY = null;
async function heroSay(n, h) {
  const box = $('#hsay'); if (!box) return;
  const U = await ultLines(); if (n !== VQ || !box.isConnected) return;
  const L = U[hSlug(h)] || []; if (!L.length) { box.remove(); return; }
  let k = Math.floor(Math.random() * L.length), au = null, tm = [];
  const stop = () => { tm.forEach(clearTimeout); tm = []; if (au) { au.pause(); au = null; } box.classList.remove('say'); };
  if (SAY) SAY(); SAY = stop;
  const kwOf = x => (x.kw || []).map(z => z[0].toLowerCase());
  const word = (w, x) => { const c = w.toLowerCase().replace(/[^a-z']/g, ''), kw = (x.kw || []).find(z => z[0].toLowerCase().split(/\s+/).includes(c)); return kw ? `<u title="${esc(kw[0])} — ${esc(kw[1])}">${esc(w)}</u>` : esc(w); };
  const wave = () => `<span class="q-wv" aria-hidden="true">${Array.from({length: 16}, (_, j) => `<i style="--h:${(.3 + .7 * Math.abs(Math.sin(j * 1.7 + k))).toFixed(2)};animation-delay:${(j % 6) * 70}ms"></i>`).join('')}</span>`;
  const show = play => {
    stop(); SAY = stop; const x = L[k], W = x.en.split(/\s+/);
    box.innerHTML = `<div class="q-sy-hd">${wave()}<small>${esc(x.tag || 'реплика')} · ${esc(h.n)}</small></div><div class="q-sy-cap" aria-live="polite"></div><div class="q-sy-ru"></div>
      <div class="q-sy-bt"><button class="q-sy-pl" type="button" aria-label="Послушать">▶</button><button class="q-sy-nx" type="button" title="Другая реплика">↻</button><button class="q-sy-vo${VOK() ? ' on' : ''}" type="button" title="Говорить, когда открываешь героя">${VOK() ? 'говорит сам ✓' : 'говорит сам — выкл'}</button><a class="q-sy-lb" href="https://t.me/languagegamesbot" target="_blank" rel="noopener">учить английский по репликам →</a></div>`;
    const cap = $('.q-sy-cap', box), ru = $('.q-sy-ru', box);
    const full = () => { cap.innerHTML = `<span class="all">${W.map(w => word(w, x)).join(' ')}</span>`; ru.textContent = x.ru; box.classList.add('done'); };
    $('.q-sy-pl', box).onclick = () => show(true);
    $('.q-sy-nx', box).onclick = () => { k = (k + 1) % L.length; show(true); };
    $('.q-sy-vo', box).onclick = e => { const on = !VOK(); try { localStorage.setItem('rl-vo', on ? 'on' : 'off'); } catch (er) {} e.target.classList.toggle('on', on); e.target.textContent = on ? 'говорит сам ✓' : 'говорит сам — выкл'; };
    box.classList.remove('done');
    if (!play) { full(); box.classList.add('hint'); return; }
    box.classList.remove('hint');
    au = new Audio(x.a); const a0 = au; let started = false;
    const run = () => { if (started || au !== a0) return; started = true; box.classList.add('say');
      const d = (au.duration && isFinite(au.duration) ? au.duration : 2.4) * 1000, len = W.reduce((s2, w) => s2 + w.length + 2, 0); let t = 120;
      W.forEach(w => { tm.push(setTimeout(() => { cap.innerHTML = `<b class="w1">${word(w, x)}</b>`; }, t)); t += d * (w.length + 2) / len; });
      tm.push(setTimeout(() => { full(); box.classList.remove('say'); }, t + 300)); };
    au.addEventListener('loadedmetadata', run, {once: true});
    au.play().then(() => setTimeout(run, 350)).catch(() => { if (au === a0) { au = null; full(); box.classList.add('hint'); } });
  };
  const ua = navigator.userActivation;
  show(VOK() && (!ua || ua.hasBeenActive));
}
addEventListener('hashchange', () => { if (SAY) { SAY(); SAY = null; } });

// ---------- кэш ответов API в браузере (Cache Storage): второй заход и переходы — без ожидания ----------
// матчи не меняются — неделя; сборки — сутки; аналитика — 3 часа; лидерборд — 30 минут; история и ранг — 2 минуты
const PC_TTL = p => /^matches\/(metadata|\d+\/metadata)/.test(p) ? 7 * 86400 : /^builds\?/.test(p) ? 86400 : /^assets\//.test(p) ? 86400 : /^analytics\//.test(p) ? 3 * 3600 : /^leaderboard/.test(p) ? 1800 : /match-history|\/rank$|^players\/rank\?/.test(p) ? 120 : /^players\//.test(p) ? 900 : 0;
let PCC = null;
// свой сервер Restless (bot/restless-worker.js): ответы по игрокам — из его базы сразу, свежие он тянет сам
const RLP = 'https://restless.1f8t8graf4.workers.dev/v1/';
const RLP_RX = /^players\/\d+\/(match-history|rank)$|^players\/(hero-stats|rank|steam)\?account_ids=[\d,]+$|^players\/\d+\/(mate|enemy)-stats\?min_matches_played=\d+$/;
let RLP_ON = null;
function rlpProbe() {
  if (RLP_ON) return RLP_ON;
  let c = null; try { c = JSON.parse(localStorage.getItem('rl-srv') || 'null'); } catch (e) {}
  if (c && Date.now() - c.t < (c.ok ? 6 * 3600e3 : 600e3)) return (RLP_ON = Promise.resolve(c.ok));
  RLP_ON = Promise.race([fetch(RLP.replace('/v1/', '/health'), {cache: 'no-store'}).then(r => r.ok ? r.json() : null).then(j => !!(j && j.ok && j.db)).catch(() => false), new Promise(r => setTimeout(() => r(false), 2500))])
    .then(ok => { try { localStorage.setItem('rl-srv', JSON.stringify({ok, t: Date.now()})); } catch (e) {} return ok; });
  return RLP_ON;
}
// что можно показать устаревшим, пока тянется свежее: всё про игроков, аналитика, лидеры — до 3 суток
const SWR_MAX = 3 * 86400, SWR_OK = p => /^players\/|^analytics\/|^leaderboard/.test(p);
let SWR_N = 0, SWR_T = 0, SWR_CH = false;
function swrBusy(d) { SWR_N = Math.max(0, SWR_N + d); let el = document.getElementById('swr');
  if (SWR_N && !el) { el = document.createElement('div'); el.id = 'swr'; el.className = 'q-swr'; document.body.appendChild(el); }
  if (!el) return; if (SWR_N) { el.className = 'q-swr on'; el.textContent = 'Подтягиваю свежие данные…'; }
  else if (!SWR_CH) { el.className = 'q-swr'; } }
// свежие данные отличаются: история/ранг/герои этого игрока — тихо перерисовать текущий экран профиля, не сбивая прокрутку
function swrChanged(p) {
  const h = location.hash.replace(/^#/, '') || 'home', t = h.split('/')[0];
  if (!ME || !/match-history|\/rank$|hero-stats\?account_ids=\d+$/.test(p) || !p.includes(String(ME.id)) || !/^(home|mine|form)$/.test(t)) return;
  SWR_CH = true; clearTimeout(SWR_T);
  SWR_T = setTimeout(() => { const ae = document.activeElement; if (ae && /^(INPUT|SELECT|TEXTAREA)$/.test(ae.tagName)) return;
    const y = window.scrollY; Promise.resolve(route()).then(() => setTimeout(() => window.scrollTo(0, y), 60));
    const el = document.getElementById('swr'); if (el) { el.className = 'q-swr on ok'; el.textContent = 'Обновлено — свежие матчи подтянулись'; setTimeout(() => { SWR_CH = false; el.className = 'q-swr'; }, 2600); } }, 350);
}
try { if (window.caches && /^https?:$/.test(location.protocol)) PCC = caches.open('rl-api-1').catch(() => null); } catch (e) {}
{ const api0 = api;
  api = function (p) {
    if (CACHE.has(p)) return CACHE.get(p);
    const ttl = PC_TTL(p); if (!ttl || !PCC) return api0(p);
    const key = 'https://rl-cache.local/' + encodeURIComponent(p);
    const net = async c => {
      let res = null, srv = false;
      // 01.11: свой сервер Restless держит ответы по игрокам — если он есть, сначала к нему
      if (RLP_RX.test(p) && await rlpProbe()) { res = await fetch(RLP + p).catch(() => null); if (res && res.ok) srv = true; else res = null; }
      if (!res) res = await fetch(API + p);
      if (!res.ok) { const tx = await res.text().catch(() => ''); throw new Error(res.status + ' ' + (tx || res.statusText).slice(0, 140)); }
      const body = await res.text(), age = srv ? (+res.headers.get('x-rl-age') || 0) : 0;
      if (c && body.length < 8e6) c.put(key, new Response(body, {headers: {'content-type': 'application/json', 'x-t': String(now() - age)}})).catch(() => {});
      return {body, j: JSON.parse(body), stale: srv && res.headers.get('x-rl') === 'stale'};
    };
    // сервер отдал старое и сам пошёл за свежим — спросим ещё раз чуть позже
    const recheck = (c, old, n) => setTimeout(() => net(c).then(x => { if (x.body !== old) { CACHE.set(p, Promise.resolve(x.j)); swrChanged(p); } else if (x.stale && n < 2) recheck(c, old, n + 1); }).catch(() => {}), n ? 14000 : 7000);
    const pr = PCC.then(async c => {
      const r = c ? await c.match(key).catch(() => null) : null;
      if (r) { const age = now() - (+r.headers.get('x-t') || 0);
        if (age < ttl) return r.json();
        // 01.11: устаревшее — показываем сразу, свежее тянем в фоне (API Deadlock на первом запросе отвечает 10–20 с)
        if (age < SWR_MAX && SWR_OK(p)) { const old = await r.text(); swrBusy(1);
          net(c).then(x => { CACHE.set(p, Promise.resolve(x.j)); if (x.body !== old) swrChanged(p); else if (x.stale) recheck(c, old, 0); }).catch(() => {}).finally(() => swrBusy(-1));
          return JSON.parse(old); } }
      const x = await net(c); if (x.stale) recheck(c, x.body, 0); return x.j;
    });
    CACHE.set(p, pr); pr.catch(() => CACHE.delete(p)); return pr;
  };
  // раз за заход — выкинуть просроченное (на неделю старше), не мешая странице
  setTimeout(() => { if (PCC) PCC.then(async c => { if (!c) return; for (const k of await c.keys()) { const r = await c.match(k); if (!r || now() - (+r.headers.get('x-t') || 0) > 8 * 86400) await c.delete(k); } }).catch(() => {}); }, 15000);
}

// ---------- Статистика · Обзор — в том же виде, что Линия / Смерти / Экономика / Бой ----------
async function stOverview() {
  if (!ME) return viewLanding();
  const n = vNew();
  V(`${ptabsHTML('form')}${stTabs('')}<div class="qs-top"><div class="seg" id="fmn">${[20, 50, 100, 200].map(k => `<button data-n="${k}" class="${FMN === k ? 'on' : ''}">${k === 200 ? 'Все' : 'Последние ' + k}</button>`).join('')}</div><small class="sub" id="fmsub">оценка каждого матча против типичного игрока на том же герое твоего ранга</small></div><div id="stb"><div class="load">Считаю форму…</div></div>`);
  $$('#fmn button').forEach(b => b.onclick = () => { FMN = +b.dataset.n; stOverview(); });
  try {
    const R = await api('players/' + ME.id + '/rank').catch(() => null);
    const b = R && R.badge ? Math.floor(R.badge / 10) * 10 : 0;
    const [H, S] = await Promise.all([api('players/' + ME.id + '/match-history'), api(`analytics/hero-stats?min_unix_timestamp=${now() - 30 * 86400 - (now() % 3600)}${b ? `&min_average_badge=${Math.max(0, b - 10)}&max_average_badge=${b + 16}` : ''}`).catch(() => [])]);
    if (n !== VQ) return;
    { const bn = $('.q-ban'); if (bn && PBAN_ID !== ME.id) bn.outerHTML = banLite(); }
    const T = {}; S.forEach(x => { const k = Math.max(1, x.matches); if (x.matches >= 30) T[x.hero_id] = {nw: x.total_net_worth / k, ka: (x.total_kills + x.total_assists) / k, d: x.total_deaths / k, lh: x.total_last_hits / k, wr: 100 * x.wins / k}; });
    const W = H.slice(0, FMN), Dd = fmAvg(W, m => Math.max(300, m.match_duration_s || 0)) || 1800;
    const L = W.map(m => fmOne(m, T, Dd)).filter(Boolean);
    if (L.length < 5) { put(n, '#stb', '<div class="empty">Мало матчей для разбора формы — нужно хотя бы 5.</div>'); return; }
    put(n, '#fmsub', `${L.length} ${pl(L.length, ['матч', 'матча', 'матчей'])} · оценка каждого матча против типичного игрока на том же герое ${b ? 'твоего ранга' : 'всех рангов'} за 30 дней`);
    const sc = Math.round(fmAvg(L, x => x.s)), L10 = L.slice(0, 10), Lr = L.slice(10), d10 = Lr.length ? fmAvg(L10, x => x.s) - fmAvg(Lr, x => x.s) : 0;
    const wins = L.filter(x => x.w), losses = L.filter(x => !x.w), best = L.reduce((a, x) => x.s > a.s ? x : a, L[0]);
    const RT = FM_K.map(([k, nm, h]) => ({k, nm, h, r: fmAvg(L, x => x.r[k]), rw: fmAvg(wins, x => x.r[k]), rl: fmAvg(losses, x => x.r[k])}));
    const sRT = RT.slice().sort((a, c) => c.r - a.r), str = sRT[0], weak = sRT[sRT.length - 1];
    const byH = {}; L.forEach(x => (byH[x.m.hero_id] = byH[x.m.hero_id] || []).push(x));
    const HL = Object.entries(byH).map(([id, X]) => ({id: +id, X, s: fmAvg(X, x => x.s), w: X.filter(x => x.w).length})).sort((a, c) => c.X.length - a.X.length || c.s - a.s);
    const bh = HL.filter(h => h.X.length >= 3).sort((a, c) => c.s - a.s)[0];
    const C = L.slice().reverse(), ma = C.map((x, i) => fmAvg(C.slice(Math.max(0, i - 4), i + 1), y => y.s)), bw = Math.max(6, Math.min(22, Math.floor(1000 / C.length) - 4)), gp = 4, cw = C.length * (bw + gp) + gp, ch = 160, y = v => ch - v * ch / 100;
    const curve = `<svg class="qs-fc" viewBox="0 0 ${cw} ${ch + 4}" preserveAspectRatio="none" role="img" aria-label="Оценка каждого матча">${[25, 50, 75].map(v => `<line x1="0" x2="${cw}" y1="${y(v)}" y2="${y(v)}" class="${v === 50 ? 'm' : ''}"/>`).join('')}
      ${C.map((x, i) => `<a href="#m/${x.m.match_id}"><rect x="${gp + i * (bw + gp)}" y="${y(x.s)}" width="${bw}" height="${Math.max(2, ch - y(x.s))}" rx="2" class="${x.w ? 'w' : 'l'}${x === best ? ' b' : ''}"><title>${esc(hero(x.m.hero_id).n)} · ${x.w ? 'победа' : 'поражение'} · оценка ${x.s} · ${esc(ago(x.m.start_time))}</title></rect></a>`).join('')}
      <polyline points="${ma.map((v, i) => `${gp + i * (bw + gp) + bw / 2},${y(v)}`).join(' ')}"/></svg>`;
    const BK = [['Короткие', 'до 25 мин', x => x.m.match_duration_s < 1500], ['Обычные', '25–35 мин', x => x.m.match_duration_s >= 1500 && x.m.match_duration_s < 2100], ['Долгие', '35+ мин', x => x.m.match_duration_s >= 2100]].map(([nm, h, f]) => { const X = L.filter(f); return {nm, h, X, s: X.length ? Math.round(fmAvg(X, x => x.s)) : null, w: X.filter(x => x.w).length}; });
    const wk = {}; L.forEach(x => { const k = Math.floor((x.m.start_time + 3 * 86400) / 604800); (wk[k] = wk[k] || []).push(x); });
    const WK = Object.entries(wk).sort((a, c) => a[0] - c[0]).slice(-6).map(([k, X]) => ({t: (+k) * 604800 - 3 * 86400, X, s: Math.round(fmAvg(X, x => x.s)), w: X.filter(x => x.w).length}));
    const pp = v => Math.max(2, Math.min(98, 50 + 50 * fmL2(v)));
    put(n, '#stb', `<div class="qs-g">
        ${paper('Restless Score', sc, fmLbl(sc)[0], Lr.length ? `Последние 10 матчей: <b style="color:${d10 >= 0 ? '#14804f' : '#c02a3c'}">${d10 >= 0 ? '+' : ''}${f1(d10)}</b> к прошлым. 50 — как типичный игрок.` : '50 — как типичный игрок на тех же героях.')}
        <div class="qs-cs">
          ${card('Победы', `<span class="${wins.length >= losses.length ? 'win' : 'loss'}">${pc(wins.length, L.length)}%</span>`, `${wins.length} побед · ${losses.length} поражений<span class="qs-wel"><i class="w" style="flex:${wins.length}"></i><i class="l" style="flex:${losses.length}"></i></span>`)}
          <a class="qs-c qs-ca" href="#m/${best.m.match_id}"><span class="qs-k">Лучшая игра</span><b class="qs-v" style="color:${fmCol(best.s)}">${best.s}</b><small>${face(best.m.hero_id, 'g', 's')} ${esc(hero(best.m.hero_id).n)} · ${best.m.player_kills}/${best.m.player_deaths}/${best.m.player_assists} · ${esc(ago(best.m.start_time))}</small></a>
          ${card('Форма', `<span class="${d10 >= 0 ? 'win' : 'loss'}">${d10 >= 0 ? '↗' : '↘'} ${d10 >= 0 ? '+' : ''}${f1(d10)}</span>`, 'последние 10 матчей против прошлых')}
          ${card('Матчей', L.length, `средняя длина ${mmss(Dd)}`)}
        </div>
        <div class="qs-is">
          ${ins('Сильная сторона', 'g', `${esc(str.nm)}: ${fmPct(str.r)} к типичному игроку`, pp(str.r))}
          ${ins('Слабое место', 'r', `${esc(weak.nm)}: ${fmPct(weak.r)} к типичному игроку`, pp(weak.r))}
          ${bh ? ins('Лучший герой', 'a', `${face(bh.id, 'g', 's')} ${esc(hero(bh.id).n)} — оценка ${Math.round(bh.s)} в ${inG(bh.X.length)}`, bh.s) : ''}
        </div>
      </div>
      <div class="qs-box qs-chalk"><div class="qs-bh"><b>Кривая формы</b><small>столбик — матч (нажми — разбор) · зелёный — победа, красный — поражение · линия — среднее за 5 матчей · пунктир — типичный игрок (50)</small></div>${curve}
        <div class="qs-fcl"><span>${esc(ago(C[0].m.start_time))}</span><span>лучшая — ${best.s} · ${esc(hero(best.m.hero_id).n)}</span><span>сейчас</span></div></div>
      <div class="qs-2">
        <div class="qs-box qs-paperbox"><div class="qs-bh"><b>Где ты силён</b><small>середина — типичный игрок на твоих героях · точки: зелёная — в победах, красная — в поражениях</small></div>
          ${RT.map(x => `<div class="qs-pr"><div><b>${esc(x.nm)}</b><small>${esc(x.h)}</small></div><div class="qs-pb"><i class="f" style="--w:${Math.round(pp(x.r))}%"></i>${wins.length ? `<i class="d w" style="left:${Math.round(pp(x.rw))}%"></i>` : ''}${losses.length ? `<i class="d l" style="left:${Math.round(pp(x.rl))}%"></i>` : ''}<i class="m"></i></div><div class="qs-pv"><b style="color:${x.r >= 1.03 ? '#14804f' : x.r <= .97 ? '#c02a3c' : '#16130f'}">${fmPct(x.r)}</b><small>к типичному</small></div></div>`).join('')}</div>
        <div>
          <div class="qs-box"><div class="qs-bh"><b>Когда получается</b><small>оценка по длине матча</small></div><div class="qs-tiles">${BK.map(x => `<div><b style="color:${x.s == null ? 'var(--mu2)' : fmCol(x.s)}">${x.s == null ? '—' : x.s}</b><span>${x.nm}</span><small>${x.h} · ${x.X.length ? games(x.X.length) + ' · ' + pc(x.w, x.X.length) + '% побед' : 'нет игр'}</small></div>`).join('')}</div></div>
          ${WK.length >= 2 ? `<div class="qs-box"><div class="qs-bh"><b>По неделям</b><small>средняя оценка за неделю</small></div><div class="qs-tiles wk">${WK.map((x, i) => `<div class="${i === WK.length - 1 ? 'cur' : ''}"><small>${esc(new Date(x.t * 1000).toLocaleDateString('ru-RU', {day: 'numeric', month: 'short'}))}</small><b style="color:${fmCol(x.s)}">${x.s}</b>${i ? `<em class="${x.s >= WK[i - 1].s ? 'win' : 'loss'}">${x.s >= WK[i - 1].s ? '+' : ''}${x.s - WK[i - 1].s}</em>` : '<em></em>'}<small>${games(x.X.length)} · ${pc(x.w, x.X.length)}%</small></div>`).join('')}</div></div>` : ''}
        </div>
      </div>
      <div class="qs-h"><b>Форма на героях</b><small>оценка на каждом герое против типичного игрока на нём · ▲ сильнее всего · ▼ слабее всего · нажми — герой</small></div>
      <div class="qs-hl">${HL.slice(0, 8).map(h => { const rr = FM_K.map(([k, nm]) => ({nm, r: fmAvg(h.X, x => x.r[k])})).sort((a, c) => c.r - a.r), s2 = Math.round(h.s);
        return `<a class="qs-hr" href="#h/${h.id}/me">${face(h.id, s2 >= 50 ? 'g' : 'c', 'm')}<div class="qs-hn"><b>${esc(hero(h.id).n)}</b><small>${games(h.X.length)} · ${h.w}–${h.X.length - h.w}</small><div><span class="qs-tg g">▲ ${esc(rr[0].nm)}</span><span class="qs-tg r">▼ ${esc(rr[rr.length - 1].nm)}</span></div></div>
          <div class="qs-hs"><b style="color:${fmCol(s2)}">${s2}</b><small>${fmLbl(s2)[0]}</small></div><div class="qs-mb">${h.X.slice(0, 10).reverse().map(x => `<i class="${x.w ? 'w' : 'l'}" style="--h:${Math.max(8, x.s)}%" title="${x.s}"></i>`).join('')}</div></a>`; }).join('')}</div>
      <details class="qs-box qs-how"><summary>Как считается Restless Score</summary><p>Каждый матч сравниваем с типичным игроком на том же герое ${b ? 'на твоём ранге ' : ''}за последние 30 дней: души, убийства + помощь, выживание и добивания (с поправкой на длину матча). 50 — ровно как типичный игрок, выше — лучше.</p></details>`);
  } catch (e) { put(n, '#stb', `<div class="err">Не вышло: ${esc(e.message)}</div>`); }
}

// ---------- Лидеры: подиум топ-3 с артами героев, таблица с рангами, фильтр по герою ----------
const LB2 = {rg: 'Europe', h: 0, q: '', n: 100};
async function viewLb2() {
  const n = vNew();
  const opts = Object.entries(D.heroes).map(([id, h]) => [+id, h.n]).sort((a, b) => a[1].localeCompare(b[1]));
  V(`<div class="q-lbh"><div><h1 class="h1">Лиде<em>ры</em></h1><p class="sub">Официальный топ-1000 по регионам. По герою — те, у кого он среди главных героев.</p></div>
    <div class="q-lbf"><div class="seg" id="lbrg">${Object.entries(REGN).map(([k, v]) => `<button data-r="${k}" class="${LB2.rg === k ? 'on' : ''}">${v}</button>`).join('')}</div>
      <select class="q-sel" id="lbh" aria-label="Герой"><option value="0">Все герои</option>${opts.map(([id, nm]) => `<option value="${id}"${LB2.h === id ? ' selected' : ''}>${esc(nm)}</option>`).join('')}</select>
      <input id="lbf2" class="inp q-lbq" placeholder="Найти по нику…" aria-label="Фильтр по нику" value="${esc(LB2.q)}"><button class="btn s" id="lbme2" type="button">Найти меня</button></div></div>
    <div id="lbb"><div class="load">Загружаю…</div></div>`);
  const draw = async () => {
    put(n, '#lbb', '<div class="load">Загружаю…</div>');
    try {
      const E = ((await api('leaderboard/' + LB2.rg + (LB2.h ? '/' + LB2.h : ''))).entries || []).map((e, i) => ({e, i, one: (e.possible_account_ids || []).length === 1 ? e.possible_account_ids[0] : null})); if (n !== VQ) return;
      const myI = ME ? E.findIndex(x => lbHit(x.e, ME.id, ME.name)) : -1;
      const q = LB2.q.toLowerCase(), F2 = E.filter(x => !q || String(x.e.account_name || '').toLowerCase().includes(q));
      const art = x => { const h = (x.e.top_hero_ids || [])[0] || LB2.h; return h ? `art/${h}.webp` : ''; };
      const medal = ['#ffcf4a', '#c9d3df', '#e09b5e'];
      const pod = !q && E.length >= 3 ? `<div class="q-pod">${[1, 0, 2].map(k => { const x = E[k], a = art(x);
        return `<div class="q-pd p${k + 1}" style="--md:${medal[k]}">${a ? `<i class="bg" style="background-image:url('${a}')"></i>` : ''}<span class="pl">${k + 1}</span>
          <div class="q-pdi"><b>${esc(x.e.account_name || 'Скрытый игрок')}</b><span class="rkc q-pdr" data-acc="${x.one || ''}">${x.one ? '…' : ''}</span>
          <div class="his">${(x.e.top_hero_ids || []).slice(0, 3).map(h => face(h, 'g', 's', hero(h).n)).join('')}</div>${x.one ? `<div class="q-pds" data-pda="${x.one}"></div>` : ''}${x.one ? `<a class="btn s" href="?id=${x.one}#home">Профиль ›</a>` : ''}</div></div>`; }).join('')}</div>` : '';
      const rows = (q ? F2 : F2.slice(3)).slice(0, LB2.n);
      put(n, '#lbb', `${pod}<div class="q-box q-lbt"><table class="q-tbl"><tr><th>#</th><th>Игрок</th><th>Ранг</th><th class="qh">Главные герои</th><th></th></tr>
        ${rows.map(x => `<tr id="lb2-${x.i}" class="${x.i === myI ? 'mine' : ''}${x.one ? ' lk' : ''}" ${x.one ? `data-go="?id=${x.one}#home"` : ''}><td class="q-lbn">${x.i + 1}</td>
          <td><div class="q-lbp"><b>${esc(x.e.account_name || 'Скрытый игрок')}</b>${x.i === myI ? '<small>это ты</small>' : ''}</div></td>
          <td><div class="rkc" data-acc="${x.one || ''}"><span class="sub">${x.one ? '…' : '—'}</span></div></td>
          <td class="qh"><div class="his">${(x.e.top_hero_ids || []).slice(0, 4).map(h => face(h, '', 's', hero(h).n)).join('')}</div></td>
          <td>${x.one ? '<span class="lnk">профиль ›</span>' : ''}</td></tr>`).join('') || '<tr><td colspan="5"><div class="empty">Никого не нашлось.</div></td></tr>'}</table>
        ${(q ? F2 : F2.slice(3)).length > LB2.n ? `<button class="btn g q-more" id="lbmore" type="button">Показать ещё</button>` : ''}</div>
        <p class="note">${E.length} в топе · ранг — сейчас, из профиля игрока · ${LB2.h ? `топ героя = общий топ-1000 региона, где ${esc(hero(LB2.h).n)} среди главных героев игрока` : 'нажми на строку — профиль'}</p>`);
      lbRanks(); if (typeof lbPod === 'function') lbPod(n);
      $('#lbb').onclick = e => { const t = e.target.closest('[data-go]'); if (t && !e.target.closest('a')) location.href = t.dataset.go; };
      const mb = $('#lbmore'); if (mb) mb.onclick = () => { LB2.n += 200; draw(); };
      $('#lbme2').onclick = () => { if (myI < 0) { alertBox(`Тебя нет в топе: ${esc(REGN[LB2.rg])}${LB2.h ? ' на этом герое' : ''}.`); return; } if (myI >= LB2.n + 3) { LB2.n = myI + 20; draw().then(() => { const r = $('#lb2-' + myI); if (r) r.scrollIntoView({block: 'center', behavior: 'smooth'}); }); return; } const r = $('#lb2-' + myI); if (r) r.scrollIntoView({block: 'center', behavior: 'smooth'}); else window.scrollTo({top: 0, behavior: 'smooth'}); };
      try { if (sessionStorage.getItem('lb-seek')) { sessionStorage.removeItem('lb-seek'); setTimeout(() => $('#lbme2').click(), 150); } } catch (er) {}
    } catch (err) { put(n, '#lbb', `<div class="err">${esc(err.message)}</div>`); }
  };
  $$('#lbrg button').forEach(b => b.onclick = () => { $$('#lbrg button').forEach(x => x.classList.toggle('on', x === b)); LB2.rg = b.dataset.r; LB2.n = 100; draw(); });
  $('#lbh').onchange = e => { LB2.h = +e.target.value; LB2.n = 100; draw(); };
  $('#lbf2').oninput = e => { LB2.q = e.target.value.trim(); clearTimeout(LB2.t); LB2.t = setTimeout(draw, 250); };
  draw();
}
