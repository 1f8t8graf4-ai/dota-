
// ==================== 31.10 (вечер) · Restless как League of Graphs ====================
// Вкладки: Профиль (Обзор · Герои · Статистика) · Лайв-матч · Мета · Лидеры · Про · Обновления. «Матчи» — внутри профиля.
// Лица героев — из файлов игры: hero_card_gloat (доволен, «в ударе») и hero_card_critical (на лоу хп).
// Портреты — арты героев с deadlock.wiki (art/<id>.webp), у Венатора и Крысиного короля — живые петли из R2.
const API2 = 'https://api.deadlock-api.com/v2/';
const CACHE2 = new Map();
function apiU(u) {
  if (CACHE2.has(u)) return CACHE2.get(u);
  const pr = fetch(u).then(async r => { if (!r.ok) throw new Error(r.status + ' ' + (await r.text().catch(() => '')).slice(0, 120)); return r.json(); });
  CACHE2.set(u, pr); pr.catch(() => CACHE2.delete(u)); return pr;
}
const f1 = v => (+v || 0).toFixed(1).replace('.', ','), f2 = v => (+v || 0).toFixed(2).replace('.', ',');
let VQ = 0;
const vNew = () => ++VQ;
function put(n, sel, html) { if (n !== VQ) return null; const el = typeof sel === 'string' ? $(sel) : sel; if (el) el.innerHTML = html; return el; }
const wil = (w, n) => { if (!n) return 0; const z = 1.64, p = w / n, z2 = z * z; return (p + z2 / (2 * n) - z * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n))) / (1 + z2 / n); };
const teamOf = t => (t === 'Team1' || t === 1 || t === '1') ? 1 : 0;
const t30 = () => now() - 30 * 86400 - (now() % 3600);
const dmy = t => new Date(t * 1000).toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'});
const wrC = (wr, n = 99) => n < 5 ? '' : wr >= 52 ? 'win' : wr <= 47 ? 'loss' : '';
const MODE = m => m.match_mode === 4 ? 'Ранговый' : m.match_mode === 1 ? 'Обычный' : m.match_mode === 2 ? 'Своё лобби' : 'Матч';

// ---------- лица героев из файлов игры ----------
const FACEP = {2: '50% 30%', 13: '50% 22%', 15: '50% 20%', 18: '50% 26%', 35: '50% 24%', 50: '50% 22%'};
const faceUrl = (id, mood) => { const c = hero(id).c || ''; if (!c) return hero(id).i || ''; return mood === 'g' ? c.replace(/_card\.(webp|png)/, '_card_gloat.$1') : mood === 'c' ? c.replace(/_card\.(webp|png)/, '_card_critical.$1') : c; };
function face(id, mood, cls, tip) {
  const h = hero(id);
  return `<span class="q-fc${cls ? ' ' + cls : ''}${mood === 'g' ? ' g' : mood === 'c' ? ' c' : ''}" data-h="${id}"${tip ? ` title="${esc(tip)}"` : ''}><img src="${esc(faceUrl(id, mood))}" alt="${esc(h.n)}" loading="lazy" decoding="async" style="object-position:${FACEP[id] || '50% 12%'}" onerror="this.onerror=null;this.src='${esc(h.i)}'"></span>`;
}
// старое имя — его зовут строки матчей: победа — доволен, поражение — на лоу хп
function heroFace(id, w) { return face(id, w ? 'g' : 'c', '', `${hero(id).n} — ${w ? 'доволен: победа' : 'на лоу хп: поражение'}`); }
const itIco = id => { const I = item(id); return I ? `<img class="q-it ${esc(I.s || '')}" src="${esc(I.i)}" alt="" title="${esc(I.n)}${I.p ? ' · ' + nf(I.p) + ' душ' : ''}" loading="lazy" decoding="async" onerror="${noimg}">` : ''; };
const phIco = id => { const I = item(id); return I ? `<img class="${esc(I.s || '')}" src="${esc(I.i)}" alt="" title="${esc(I.n)}${I.p ? ' · ' + nf(I.p) + ' душ' : ''}" onerror="${noimg}">` : ''; };

// ---------- оценка за матч с плюсами и минусами: S+ … D− ----------
const GRS = [[80, 'S+'], [74, 'S'], [69, 'S−'], [65, 'A+'], [61, 'A'], [57, 'A−'], [54, 'B+'], [50, 'B'], [47, 'B−'], [44, 'C+'], [40, 'C'], [36, 'C−'], [32, 'D+'], [27, 'D'], [-999, 'D−']];
const GCOL2 = {S: '#ff6a2b', A: '#ffb020', B: '#e8d36a', C: '#8cc4ff', D: '#ff6b81', E: '#8e897f'};
let GT = null, GD = 1800; // типичный игрок на герое твоего ранга (как во вкладке «Статистика») и твоя средняя длина матча
function mGrade(m) {
  const dur = Math.max(300, m.match_duration_s || 600);
  if (m.abandoned_time_s && m.abandoned_time_s < dur - 60) return ['E', 'вышел из матча до конца', GCOL2.E, 0];
  let s, how;
  const o = GT && typeof fmOne === 'function' ? fmOne(m, GT, GD) : null;
  if (o) { s = o.s; how = `против типичного игрока на ${hero(m.hero_id).n} твоего ранга: души ${fmPct(o.r.nw)}, убийства + помощь ${fmPct(o.r.ka)}, выживание ${fmPct(o.r.dt)}, добивания ${fmPct(o.r.lh)}`; }
  else {
    const kda = (m.player_kills + m.player_assists) / Math.max(1, m.player_deaths), spm = m.net_worth / (dur / 60), lhm = (m.last_hits || 0) / (dur / 60);
    s = Math.round(93 * (0.35 * Math.min(1, kda / 5) + 0.3 * Math.min(1, spm / 900) + 0.2 * Math.min(1, lhm / 11) + 0.15 * Math.max(0, 1 - m.player_deaths / 12)));
    how = 'по KDA, душам в минуту, добиваниям и смертям';
  }
  const g = GRS.find(x => s >= x[0])[1];
  return [g, `Оценка ${g}: ${s} из 100 (50 — как типичный игрок) — ${how}`, GCOL2[g[0]], s];
}
const grdHTML = m => { const [g, tip, col] = mGrade(m); return `<span class="grd q-grd" style="--gc:${col}" title="${esc(tip)}">${g}</span>`; };
async function gradeBase(badge) {
  const b = badge ? Math.floor(badge / 10) * 10 : 0;
  const S = await api(`analytics/hero-stats?min_unix_timestamp=${now() - 30 * 86400 - (now() % 3600)}${b ? `&min_average_badge=${Math.max(0, b - 10)}&max_average_badge=${b + 16}` : ''}`).catch(() => []);
  const T = {}; S.forEach(x => { const n = Math.max(1, x.matches); if (x.matches >= 30) T[x.hero_id] = {nw: x.total_net_worth / n, ka: (x.total_kills + x.total_assists) / n, d: x.total_deaths / n, lh: x.total_last_hits / n, wr: 100 * x.wins / n}; });
  return T;
}

// ---------- метаданные матчей пачкой (предметы, все 12 игроков, ранги) и ники ----------
const MD = new Map();
async function bulkMeta(ids) {
  const need = [...new Set(ids)].filter(id => !MD.has(id));
  for (let i = 0; i < need.length; i += 10) {
    const part = need.slice(i, i + 10);
    const L = await api(`matches/metadata?match_ids=${part.join(',')}&include_info=true&include_player_info=true&include_player_items=true&include_player_final_stats=true&limit=${part.length}`).catch(() => []);
    (L || []).forEach(m => MD.set(m.match_id, m));
    part.forEach(id => { if (!MD.has(id)) MD.set(id, null); });
  }
}
const SN = {};
async function steamNames(ids) {
  const need = [...new Set(ids)].filter(id => id && !SN[id]);
  for (let i = 0; i < need.length; i += 150) {
    const part = need.slice(i, i + 150);
    const L = await api('players/steam?account_ids=' + part.join(',')).catch(() => []);
    (L || []).forEach(s => SN[s.account_id] = {n: s.personaname, av: s.avatarmedium || s.avatar, cc: s.countrycode, m30: s.matches_played_last_30d});
    part.forEach(id => { if (!SN[id]) SN[id] = {n: ''}; });
  }
}
function finalItems(p) {
  const seen = new Set(), L = [];
  ((p && p.items) || []).forEach(x => { if (!item(x.item_id) || x.sold_time_s || seen.has(x.item_id)) return; seen.add(x.item_id); L.push(x.item_id); });
  const ord = {weapon: 0, vitality: 1, spirit: 2};
  return L.sort((a, b) => (ord[item(a).s] ?? 3) - (ord[item(b).s] ?? 3));
}

// ---------- профиль: шапка (на всех подвкладках) ----------
let PBAN = '', PBAN_ID = 0, PROF = null, HN = 20;
const PHF = {hero: 0, mode: '', id: 0, view: 'full'};
try { PHF.view = localStorage.getItem('rl-hv') || 'full'; } catch (e) {}
function banHTML(o) {
  const rk = rankOf(o.badge || 0);
  return `<section class="q-ban">${o.main ? `<i class="bg" style="background-image:url('art/${o.main}.webp')"></i>` : ''}<div class="q-bin">
    <div class="q-av">${o.av ? `<img src="${esc(o.av)}" alt="" onerror="${noimg}">` : '<i></i>'}${o.games ? `<em title="матчей в открытых данных">${nf(o.games)}</em>` : ''}</div>
    <div class="q-pn"><h1>${esc(o.name)}${o.cc ? `<small>${esc(o.cc)}</small>` : ''}</h1>
      <div class="q-chips" id="pchips"><span class="q-chip q-rkc" title="Ранг сейчас">${o.badge ? rankImg(o.badge, 'ri') : ''}${esc(rk.name)}</span>${o.ws >= 3 ? `<span class="q-chip" title="побед подряд в ранговых">🔥 серия ${o.ws}</span>` : ''}</div></div></div></section>`;
}
const banLite = () => ME ? banHTML({name: ME.name, av: ME.avatar, badge: ME.badge || 0}) : '';
const ptabsHTML = on => `${PBAN && PBAN_ID === (ME && ME.id) ? PBAN : banLite()}<div class="ptabs" role="tablist">${[['home', 'Обзор'], ['mine', 'Герои'], ['form', 'Статистика']].map(([k, n]) => `<a href="#${k}" role="tab" class="${on === k ? 'on' : ''}">${n}</a>`).join('')}</div>`;

// ---------- профиль: Обзор ----------
const TCOL = {marksman: '#ffb020', brawler: '#ff6b81', mystic: '#8a7cff', assassin: '#36d6c3', other: '#6a665e'};
function curSeason(SS) {
  const t = now(); let best = null;
  (SS || []).forEach(s => (s.intervals || []).forEach((iv, k) => { if (iv.start_timestamp <= t && (!iv.end_timestamp || t < iv.end_timestamp)) best = {start: iv.start_timestamp, end: iv.end_timestamp, name: (s.name || 'Сезон').replace('Beta Season', 'Бета-сезон') + ((s.intervals || []).length > 1 ? ', часть ' + (k + 1) : '')}; }));
  return best || {start: t - 90 * 86400, end: 0, name: 'последние 90 дней'};
}
function patterns2(H) {
  const won = m => m.player_team === m.match_result, L = H.slice(0, 400), all = L.filter(won).length / Math.max(1, L.length), P = [];
  const add = (n, f) => { const X = L.filter(f); if (X.length >= 12) { const wr = X.filter(won).length / X.length; P.push({n, d: 100 * (wr - all), wr: 100 * wr, c: X.length}); } };
  add('Винрейт в коротких играх (до 25 мин)', m => m.match_duration_s < 1500);
  add('Винрейт в играх 25–30 мин', m => m.match_duration_s >= 1500 && m.match_duration_s < 1800);
  add('Винрейт в играх 30–35 мин', m => m.match_duration_s >= 1800 && m.match_duration_s < 2100);
  add('Винрейт в долгих играх (35+ мин)', m => m.match_duration_s >= 2100);
  add('За Янтарную руку', m => m.player_team === 0);
  add('За Сапфировое пламя', m => m.player_team === 1);
  add('Ночью (с полуночи до 6 утра)', m => new Date(m.start_time * 1000).getHours() < 6);
  add('В ранговых', m => m.match_mode === 4);
  profPatterns(L).filter(x => !/длиннее 35/.test(x.n)).forEach(x => P.push(x));
  return P.sort((a, b) => Math.abs(b.d) - Math.abs(a.d)).slice(0, 6);
}
function moodOn(H, hid) { const L = H.filter(m => m.hero_id === hid).slice(0, 15); if (L.length < 5) return ''; const w = L.filter(m => m.player_team === m.match_result).length / L.length; return w >= .6 ? 'g' : w <= .4 ? 'c' : ''; }

async function viewHome() {
  if (!ME) return viewLanding();
  const n = vNew(), id = ME.id;
  if (PHF.id !== id) { PHF.hero = 0; PHF.mode = ''; PHF.id = id; HN = 20; }
  V('<div class="load">Собираю профиль…</div>');
  let H, HS, R, SS, HSt, ST;
  try {
    [H, HS, R, SS, HSt, ST] = await Promise.all([api('players/' + id + '/match-history'), api('players/hero-stats?account_ids=' + id).catch(() => []), api('players/' + id + '/rank').catch(() => null),
      api('assets/ranked-seasons').catch(() => []), api('analytics/hero-stats?' + fq()).catch(() => []), api('players/steam?account_ids=' + id).catch(() => [])]);
  } catch (e) { if (n === VQ) V(`<div class="err">Не вышло загрузить профиль: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  const won = m => m.player_team === m.match_result, badge = (R && R.badge) || 0, st = (ST || [])[0] || {};
  const c60 = {}; H.filter(m => m.start_time >= now() - 60 * 86400).forEach(m => c60[m.hero_id] = (c60[m.hero_id] || 0) + 1);
  const pool = HS.slice().sort((a, b) => b.matches_played - a.matches_played);
  const main = +((Object.entries(c60).sort((a, b) => b[1] - a[1])[0] || [])[0]) || (pool[0] || {}).hero_id || 0;
  const ws = R && R.last_match && R.last_match.start_time > now() - 3 * 86400 ? R.last_match.player_rank_initial_win_streak || 0 : 0;
  PBAN = banHTML({name: ME.name, av: ME.avatar, badge, main: D.heroes[main] ? main : 0, games: H.length, cc: st.countrycode, ws}); PBAN_ID = id;
  if (!H.length) { V(`${ptabsHTML('home')}<div class="empty">У этого игрока нет матчей в открытых данных.</div>`); return; }
  GD = (H.slice(0, 50).reduce((a, m) => a + Math.max(300, m.match_duration_s || 0), 0) / Math.max(1, Math.min(50, H.length))) || 1800;
  const HA = {}, HTOT = HSt.reduce((a, x) => a + x.matches, 0) / 12 || 1;
  HSt.forEach(x => { const k = Math.max(1, x.matches); HA[x.hero_id] = {spm: x.total_net_worth / k, dpm: x.total_deaths / k, kpm: x.total_kills / k, apm: x.total_assists / k, lhm: x.total_last_hits / k, den: (x.total_denies || 0) / k, pr: 100 * x.matches / HTOT}; });
  const CNT = {}; H.filter(m => m.start_time >= now() - 30 * 86400).forEach(m => CNT[m.hero_id] = (CNT[m.hero_id] || 0) + 1);
  { const L = H.slice(0, 50); CNT._avg = {spm: L.reduce((x, m) => x + m.net_worth / (Math.max(300, m.match_duration_s) / 60), 0) / Math.max(1, L.length), d: L.reduce((x, m) => x + m.player_deaths, 0) / Math.max(1, L.length)}; }
  const MS = {}; HS.forEach(x => { MS[x.hero_id] = {g: x.matches_played, wr: pc(x.wins, x.matches_played), sc: mstyScore(x)}; });
  PROF = {id, H, HS, CNT, MS, badge};
  // сезон и ранг
  const ses = curSeason(SS), SH = H.filter(m => m.match_mode === 4 && m.start_time >= ses.start), sw = SH.filter(won).length, rk = rankOf(badge);
  const dl = R && R.last_match ? R.last_match.player_rank_desired_progress_change : null;
  const rkBox = `<div class="q-box"><div class="q-bh"><b>Ранговый</b><small>${esc(ses.name)}${ses.end ? ' · до ' + esc(dmy(ses.end)) : ''}</small></div>
    ${badge ? `<div class="q-rkb">${rankImg(badge, 'rk')}<div style="min-width:0"><div class="q-rkn" style="color:${esc(rk.color)}">${esc(rk.name)}<small>${R && R.last_match ? 'последний ранговый — ' + esc(ago(R.last_match.start_time)) : ''}</small></div>
      ${dl ? `<div class="q-l">Последний матч: <b class="${dl > 0 ? 'win' : 'loss'}">${dl > 0 ? '+' : ''}${nf(dl)}</b> очков ранга</div>` : ''}
      <div class="q-l" id="rtop">Считаю место среди всех…</div>
      <div class="q-l">Победы: <b class="win">${sw}</b> — Поражения: <b class="loss">${SH.length - sw}</b></div>
      <div class="q-l">Винрейт: <b class="${wrC(100 * sw / Math.max(1, SH.length), SH.length)}">${SH.length ? f1(100 * sw / SH.length) + ' %' : '—'}</b></div></div></div>`
      : `<div class="q-rk0"><b>Без ранга</b><span>В этом сезоне ранговых матчей нет — ранг появится после калибровки.</span></div>`}
    <div class="q-cap">Средний ранг врагов</div><div class="q-en" id="enr"><span class="sub">Считаю по последним 10 матчам…</span></div></div>`;
  // герои: один блок, «за всё время» / «за 30 дней», рейтинг — место в мире по победам на герое
  const R30 = {}; H.filter(m => m.start_time >= now() - 30 * 86400).forEach(m => { const o = R30[m.hero_id] = R30[m.hero_id] || {m: 0, w: 0, k: 0, d: 0, a: 0}; o.m++; if (won(m)) o.w++; o.k += m.player_kills; o.d += m.player_deaths; o.a += m.player_assists; });
  const r30 = Object.entries(R30).filter(([h]) => D.heroes[h]).sort((a, b) => b[1].m - a[1].m).slice(0, 5).map(([h, o]) => ({hid: +h, g: o.m, w: o.w, k: o.k / o.m, d: o.d / o.m, a: o.a / o.m}));
  const rAll = pool.filter(x => D.heroes[x.hero_id]).slice(0, 5).map(x => ({hid: x.hero_id, g: x.matches_played, w: x.wins, k: x.kills / x.matches_played, d: x.deaths / x.matches_played, a: x.assists / x.matches_played, last: x.last_played}));
  const hRow = (x, cls) => { const wr = 100 * x.w / Math.max(1, x.g);
    return `<tr class="lk ${cls}" data-go="#h/${x.hid}/me"><td><div class="q-hn">${face(x.hid, moodOn(H, x.hid), 'm')}<span style="min-width:0"><b>${esc(hero(x.hid).n)}</b><small>${cls === 'ha' ? `<span data-hlb="${x.hid}">${x.last ? 'последняя ' + esc(ago(x.last)) : ''}</span>` : 'за 30 дней'}</small></span></div></td>
      <td class="q-num">${nf(x.g)}<small class="q-kd2">${f1(x.k)}/${f1(x.d)}/${f1(x.a)}</small></td>
      <td><b class="q-num ${wrC(wr, x.g)}">${f1(wr)}%</b></td>
      <td class="q-rt" data-rt="${x.hid}">${RTH[id + '|' + x.hid] || '<span class="sub">…</span>'}</td></tr>`; };
  const heroBox = `<div class="q-box q-hb" data-m="all"><div class="q-bh"><b>Герои</b><div class="seg q-hbs"><button data-hm="all" class="on">За всё время</button><button data-hm="30">30 дней</button></div><span class="sp"></span><a class="lnk" href="#mine">Все герои ›</a></div>
    <table class="q-tbl"><tr><th>Герой</th><th>Игр · KDA</th><th>Винрейт</th><th title="Место в мире среди всех игроков на герое по числу побед">Рейтинг</th></tr>
    ${rAll.map(x => hRow(x, 'ha')).join('') || '<tr class="ha"><td colspan="4"><div class="empty">Нет данных</div></td></tr>'}
    ${r30.map(x => hRow(x, 'h3')).join('') || '<tr class="h3"><td colspan="4"><div class="empty">За 30 дней матчей нет.</div></td></tr>'}</table></div>`;
  // метки и паттерны
  const T = profTags(H, HS, HA), P2 = patterns2(H);
  const tpBox = `<div class="q-box"><div class="q-tags">${tagsHTML(T) || '<span class="sub">Меток пока нет — нужно больше матчей.</span>'}</div>
    <div class="q-bh" style="border-top:1px solid var(--q-ln)"><b>Паттерны игрока</b><small>винрейт против твоего обычного (${f1(100 * H.slice(0, 400).filter(won).length / Math.max(1, Math.min(400, H.length)))} %)</small></div>
    ${P2.map(p => `<div class="q-pt"><span>${esc(p.n)}<small>${games(p.c)} · ${Math.round(p.wr)}% побед</small></span><div><div class="q-pbar"><i class="${p.d >= 0 ? 'up' : 'dn'}" style="width:${Math.min(50, Math.abs(p.d) * 2.5)}%"></i></div><span class="q-pv ${p.d >= 0 ? 'win' : 'loss'}">${p.d >= 0 ? '+' : '−'}${f1(Math.abs(p.d))} %</span></div></div>`).join('') || '<div class="empty">Для паттернов нужно больше матчей.</div>'}</div>`;
  // недавние игры
  const hlist = [...new Set(H.slice(0, 300).map(m => m.hero_id))].filter(h => D.heroes[h]).sort((a, b) => hero(a).n.localeCompare(hero(b).n));
  const histBox = `<div class="q-box" id="hist"><div class="q-hh"><b>Недавние игры</b><span id="hsum" style="display:contents"></span><span class="sp" style="flex:1"></span>
      <div class="seg" id="hvw"><button data-v="full" class="${PHF.view !== 'short' ? 'on' : ''}">Подробно</button><button data-v="short" class="${PHF.view === 'short' ? 'on' : ''}">Коротко</button></div></div>
    <div class="q-hf"><select class="q-sel" id="hfh" aria-label="Герой"><option value="0">Все герои</option>${hlist.map(h => `<option value="${h}"${PHF.hero === h ? ' selected' : ''}>${esc(hero(h).n)}</option>`).join('')}</select>
      <select class="q-sel" id="hfm" aria-label="Режим"><option value="">Все режимы</option><option value="r"${PHF.mode === 'r' ? ' selected' : ''}>Ранговые</option><option value="u"${PHF.mode === 'u' ? ' selected' : ''}>Обычные</option></select></div>
    <div id="hrows"></div><button class="btn g q-more" id="hmore" type="button">Показать ещё</button></div>
    <p class="note">Лицо героя — из файлов игры: доволен — победа, на лоу хп — поражение · оценка S+…D− — против типичного игрока на этом герое твоего ранга · нажми на матч — полный разбор.</p>`;
  V(`${ptabsHTML('home')}<div class="q-pl2"><aside>${rkBox}${heroBox}${typeof actBox === 'function' ? actBox(H) : ''}${tpBox}</aside><div class="q-plm">${histBox}
    <div class="q-row q-pb2"><a class="btn live" href="#live/${id}" style="margin-top:0">Лайв-матч этого игрока →</a><div id="mybw" hidden><div class="q-box"><div class="q-bh"><b>Сохранённые сборки</b><small>что ты отложил «в профиль» и автоподбор</small></div><div class="pad" id="myb"></div></div></div></div></div></div>`);
  $$('.q-hbs button').forEach(b => b.onclick = e => { e.stopPropagation(); const box = $('.q-hb'); box.dataset.m = b.dataset.hm; $$('.q-hbs button').forEach(x => x.classList.toggle('on', x === b)); });
  heroRatings(n, id, [...new Set([...rAll, ...r30].map(x => x.hid))], 'data-rt');
  if (typeof mateLoad === 'function') mateLoad(n, id);
  $('#v').onclick = e => { const tr = e.target.closest('[data-go]'); if (tr && !e.target.closest('a')) location.hash = tr.dataset.go; };
  $$('#hvw button').forEach(b => b.onclick = () => { PHF.view = b.dataset.v; try { localStorage.setItem('rl-hv', PHF.view); } catch (er) {} $$('#hvw button').forEach(x => x.classList.toggle('on', x === b)); drawHist(n); });
  $('#hfh').onchange = e => { PHF.hero = +e.target.value; HN = 20; drawHist(n); };
  $('#hfm').onchange = e => { PHF.mode = e.target.value; HN = 20; drawHist(n); };
  $('#hmore').onclick = () => { HN += 20; drawHist(n); };
  const rows = $('#hrows');
  rows.onclick = e => { if (e.target.closest('a')) return; const r = e.target.closest('[data-m]'); if (r) location.hash = '#m/' + r.dataset.m; };
  rows.onkeydown = e => { if (e.key !== 'Enter' || e.target.closest('a')) return; const r = e.target.closest('[data-m]'); if (r) location.hash = '#m/' + r.dataset.m; };
  drawHist(n);
  // оценки — против типичного игрока твоего ранга (как во вкладке «Статистика»)
  gradeBase(badge).then(T2 => { if (n !== VQ) return; GT = T2; drawRows(n); });
  // место среди всех игроков
  if (badge) api('players/rank/distribution').then(Dd => { if (n !== VQ) return; const tot = Dd.reduce((a, x) => a + (x.players || 0), 0), up = Dd.filter(x => x.badge >= badge).reduce((a, x) => a + (x.players || 0), 0); const el = $('#rtop'); if (el && tot) el.innerHTML = `Топ <b>${f1(Math.max(.1, 100 * up / tot))} %</b> игроков`; }).catch(() => { const el = $('#rtop'); if (el) el.textContent = ''; });
  // место в топе региона и на героях — только если аккаунт в лидерборде однозначный
  topPlaces(n, id, ME.name, st.countrycode, pool);
  renderMyBuilds().then(() => { const b = $('#myb'), w = $('#mybw'); if (n === VQ && b && w && b.querySelector('a,img,.bch,.myc')) w.hidden = false; }).catch(() => {});
}
function histList() { const P = PROF; return P ? P.H.filter(m => (!PHF.hero || m.hero_id === PHF.hero) && (!PHF.mode || (PHF.mode === 'r' ? m.match_mode === 4 : m.match_mode !== 4))) : []; }
function drawHist(n) {
  if (n !== VQ || !PROF) return;
  const L = histList(), S = L.slice(0, HN), w = S.filter(m => m.player_team === m.match_result).length;
  put(n, '#hsum', `<span class="q-hs"><b>${S.length}</b><small>сыграно</small></span><span class="q-hs"><b class="${wrC(100 * w / Math.max(1, S.length), S.length)}">${S.length ? f1(100 * w / S.length) : 0}%</b><small>винрейт</small></span><span class="q-hs"><b><span class="win">${w}В</span> <span class="loss">${S.length - w}П</span></b><small>последн. ${S.length}</small></span>`);
  drawRows(n);
  const mb = $('#hmore'); if (mb) mb.hidden = L.length <= HN || HN >= 200;
  enrich(n, S);
}
function drawRows(n) {
  if (n !== VQ || !PROF) return;
  const S = histList().slice(0, HN);
  put(n, '#hrows', S.map(m => PHF.view === 'short' ? mhRow(m, PROF.CNT, null, PROF.MS) : gmRow(m)).join('') || '<div class="empty">Под этот фильтр матчей нет.</div>');
}
async function enrich(n, S) {
  const ids = S.map(m => m.match_id).filter(id => !MD.has(id));
  for (let i = 0; i < ids.length; i += 10) { await bulkMeta(ids.slice(i, i + 10)); if (n !== VQ) return; if (i + 10 < ids.length) drawRows(n); }
  const acc = []; S.forEach(m => { const M = MD.get(m.match_id); if (M) M.players.forEach(p => acc.push(p.account_id)); });
  const need = acc.filter(a => !SN[a]);
  if (need.length) { await steamNames(need); if (n !== VQ) return; }
  if (ids.length || need.length) drawRows(n);
  // средний ранг врагов — последние 10 матчей
  const el = $('#enr'); if (!el || el.dataset.ok) return;
  const B = []; PROF.H.slice(0, 10).forEach(m => { const M = MD.get(m.match_id); if (!M) return; const me = M.players.find(p => p.account_id === PROF.id); if (!me) return;
    M.players.filter(p => teamOf(p.team) !== teamOf(me.team)).forEach(p => { if (p.player_rank_initial_display_rank) B.push(p.player_rank_initial_display_rank); }); });
  if (B.length < 6) { if (PROF.H.slice(0, 10).every(m => MD.has(m.match_id))) { el.dataset.ok = 1; el.innerHTML = '<span class="sub">В последних матчах у врагов нет ранга в данных — посчитать не из чего.</span>'; } return; }
  if (B.length >= 6) { el.dataset.ok = 1; const b = Math.round(B.reduce((a, x) => a + x, 0) / B.length), r = rankOf(b); el.innerHTML = `${rankImg(b, 'rk')}<span><b style="color:${esc(r.color)}">${esc(r.name)}</b><small>средний ранг врагов за последние 10 матчей</small></span>`; }
}
function teamsHTML(P, meId) {
  const tm = k => P.filter(p => teamOf(p.team) === k).sort((a, b) => (a.player_slot || 0) - (b.player_slot || 0));
  const pl = p => { const nm = (SN[p.account_id] || {}).n || 'Игрок', me = p.account_id === meId;
    return `<a class="q-pl${me ? ' q-me' : ''}" href="?id=${p.account_id}#home" title="${esc(nm)} · ${esc(hero(p.hero_id).n)} · ${p.kills}/${p.deaths}/${p.assists}"><img src="${esc(hero(p.hero_id).i)}" alt="" loading="lazy" onerror="${noimg}"><span>${esc(nm)}</span></a>`; };
  return `<span class="q-tm t0">${tm(0).map(pl).join('')}</span><span class="q-tm t1">${tm(1).map(pl).join('')}</span>`;
}
function gmRow(m) {
  const w = m.player_team === m.match_result, d = m.ranked_delta, dur = Math.max(60, m.match_duration_s || 0);
  const kda = (m.player_kills + m.player_assists) / Math.max(1, m.player_deaths), M = MD.get(m.match_id);
  const me = M ? M.players.find(p => p.account_id === PROF.id) : null;
  let kp = null, dmg = null, its = [];
  if (me) {
    const tk = M.players.filter(p => teamOf(p.team) === teamOf(me.team)).reduce((a, p) => a + (p.kills || 0), 0);
    kp = tk ? Math.round(100 * ((me.kills || 0) + (me.assists || 0)) / tk) : null;
    dmg = me.final_stats && me.final_stats.player_damage; its = finalItems(me);
  }
  const T = mMiniTags(m, PROF.CNT).slice();
  if (me) {
    const nwMax = Math.max(...M.players.map(p => p.net_worth || 0)), dmMax = Math.max(...M.players.map(p => (p.final_stats || {}).player_damage || 0));
    if (me.net_worth && me.net_worth >= nwMax) T.push(['Больше всех душ', 'a', 'самый богатый игрок матча']);
    if (dmg && dmg >= dmMax) T.push(['Больше всех урона', 'a', 'больше всех урона по героям в матче']);
    if (kp != null && kp >= 70) T.push(['В каждой драке', 'g', `участие в убийствах команды — ${kp}%`]);
  }
  const tags = T.slice(0, 3);
  return `<div class="q-gm ${w ? 'w' : 'l'}" data-m="${m.match_id}" tabindex="0" role="link" aria-label="${w ? 'Победа' : 'Поражение'}, ${esc(hero(m.hero_id).n)}, открыть разбор"><div class="q-gl">
    <div class="q-gt"><b>${w ? 'Победа' : 'Поражение'}</b><span>${MODE(m)}</span>${d ? `<span class="q-dl ${d > 0 ? '' : 'loss'}">${d > 0 ? '+' : ''}${d}</span>` : ''}<span>${mmss(dur)}</span><span>${esc(ago(m.start_time))}</span></div>
    <div class="q-gb"><span class="q-gh">${face(m.hero_id, w ? 'g' : 'c', 'l', `${hero(m.hero_id).n} — ${w ? 'доволен: победа' : 'на лоу хп: поражение'}`)}${m.hero_level ? `<i class="q-lv" title="уровень героя в конце матча">${m.hero_level}</i>` : ''}</span>
      <span class="q-gk"><b>${m.player_kills} / <i>${m.player_deaths}</i> / ${m.player_assists}</b><small>${f2(kda)} KDA</small></span>
      <span class="q-gs"><b>${nf(m.net_worth)}</b><small>${nf(m.net_worth / (dur / 60))} душ/мин</small></span>
      <span class="q-gs kp"><b>${kp != null ? kp + '%' : '—'}</b><small>участие</small></span>
      <span class="q-gs qh"><b>${dmg ? kFmt(dmg) : '—'}</b><small>урон</small></span>
      <span class="q-gi">${its.length ? its.slice(0, 12).map(itIco).join('') : (M === undefined ? '<i class="q-gi0"></i>'.repeat(6) : '')}</span>
      ${grdHTML(m)}</div>
    ${tags.length ? `<div class="q-gtg">${tags.map(([s, c2, h]) => `<span class="tag ${c2}" title="${esc(h)}">${esc(s)}</span>`).join('')}</div>` : ''}</div>
    <span class="q-gp">${me ? teamsHTML(M.players, PROF.id) : ''}</span></div>`;
}

// ---------- профиль: Герои ----------
const MINE = {k: 'm'};
async function viewMine() {
  if (!ME) return viewLanding();
  const n = vNew(), id = ME.id;
  V(`${ptabsHTML('mine')}<div class="load">Считаю героев…</div>`);
  try {
    const [HS, H] = await Promise.all([api('players/hero-stats?account_ids=' + id), api('players/' + id + '/match-history').catch(() => [])]);
    if (n !== VQ) return;
    if (!HS.length) { V(`${ptabsHTML('mine')}<div class="empty">Нет данных по героям.</div>`); return; }
    const COLS = [['m', 'Игр', x => x.matches_played], ['wr', 'Винрейт', x => x.wins / Math.max(1, x.matches_played)], ['kda', 'KDA', x => (x.kills + x.assists) / Math.max(1, x.deaths)],
      ['spm', 'Души / мин', x => x.networth_per_min || 0], ['dpm', 'Урон / мин', x => x.damage_per_min || 0], ['acc', 'Точность', x => x.accuracy || 0], ['last', 'Последняя', x => x.last_played || 0]];
    const draw = () => {
      const c = COLS.find(x => x[0] === MINE.k) || COLS[0], L = HS.filter(x => D.heroes[x.hero_id]).slice().sort((a, b) => c[2](b) - c[2](a));
      const tot = HS.reduce((a, x) => a + x.matches_played, 0), mx = Math.max(1, ...L.map(x => x.matches_played));
      put(n, '#mtw', `<div class="q-box"><div class="q-bh"><b>Герои игрока</b><small>${HS.length} ${pl(HS.length, ['герой', 'героя', 'героев'])} · ${nf(tot)} ${pl(tot, ['матч', 'матча', 'матчей'])} · нажми на заголовок — сортировка, на героя — его страница</small></div>
        <div style="overflow-x:auto"><table class="q-tbl"><tr><th>Герой</th>${COLS.map(([k, nm], i) => `<th class="s${MINE.k === k ? ' on' : ''}${i >= 3 ? ' qh' : ''}" data-k="${k}">${nm}${MINE.k === k ? ' ↓' : ''}</th>${k === 'wr' ? '<th title="Место в мире среди всех игроков на герое по числу побед">Рейтинг</th>' : ''}`).join('')}</tr>
        ${L.map(x => { const g = x.matches_played, wr = 100 * x.wins / Math.max(1, g), kda = (x.kills + x.assists) / Math.max(1, x.deaths);
          return `<tr class="lk" data-go="#h/${x.hero_id}/me"><td><div class="q-hn">${face(x.hero_id, moodOn(H, x.hero_id), 'm')}<span style="min-width:0"><b>${esc(hero(x.hero_id).n)}</b><small>${esc(TYPE_RU[hero(x.hero_id).ty] || '')}<span data-hlb2="${x.hero_id}"></span></small></span></div></td>
            <td><div class="q-bw"><span class="bar"><i style="width:${Math.round(100 * g / mx)}%;background:var(--q-am)"></i></span><b>${nf(g)}</b></div></td>
            <td><b class="q-num ${wrC(wr, g)}">${f1(wr)}%</b></td><td class="q-rt" data-rt2="${x.hero_id}">${RTH[id + '|' + x.hero_id] || '<span class="sub">…</span>'}</td>
            <td><span class="q-kda">${f2(kda)}</span><br><span class="q-kda"><em>${f1(x.kills / g)} / <i>${f1(x.deaths / g)}</i> / ${f1(x.assists / g)}</em></span></td>
                        <td class="qh q-num">${nf(x.networth_per_min)}</td><td class="qh q-num">${nf(x.damage_per_min)}</td><td class="qh q-num">${x.accuracy != null ? Math.round(100 * x.accuracy) + '%' : '—'}</td><td class="qh"><span class="sub">${x.last_played ? esc(ago(x.last_played)) : '—'}</span></td></tr>`; }).join('')}</table></div></div>
        <p class="note">Место в топе героя — под именем, если ты есть в официальном лидерборде: это место среди игроков топ-1000 региона, у которых этот герой — один из главных.</p>`);
      $$('#mtw th.s').forEach(th => th.onclick = () => { MINE.k = th.dataset.k; draw(); });
    };
    V(`${ptabsHTML('mine')}<div id="mtw" style="margin-top:14px"></div>`);
    $('#v').onclick = e => { const tr = e.target.closest('[data-go]'); if (tr && !e.target.closest('a,th')) location.hash = tr.dataset.go; };
    draw();
    heroPlaces(n, id, ME.name, HS.slice().sort((a, b) => b.matches_played - a.matches_played).slice(0, 8), 'data-hlb2');
    heroRatings(n, id, HS.slice().sort((a, b) => b.matches_played - a.matches_played).slice(0, 10).map(x => x.hero_id), 'data-rt2');
  } catch (e) { if (n === VQ) V(`${ptabsHTML('mine')}<div class="err">Не вышло: ${esc(e.message)}</div>`); }
}

// ---------- страница героя: портрет слева, сборки справа, переключатель «ты / все игроки» ----------
const LOOP = {65: ['venator-2', .6], 84: ['rat-king-2', .45]};
function artHTML(hid) {
  const L = LOOP[hid], img = `art/${hid}.webp`, h = hero(hid);
  return L ? `<video src="${MEDIA}scenes/games/deadlock/${L[0]}.mp4" poster="${img}" muted loop playsinline autoplay preload="auto" style="object-position:${Math.round(L[1] * 100)}% 50%" aria-label="${esc(h.n)}"></video>`
    : `<img src="${img}" alt="${esc(h.n)}" onerror="this.onerror=null;this.src='${esc(h.c || h.v || '')}'">`;
}
async function viewHero(hid, mode) {
  hid = +hid;
  if (!D.heroes[hid]) { vNew(); V('<div class="empty">Такого героя нет.</div>'); return; }
  const n = vNew(), h = hero(hid), me = !!ME && mode === 'me';
  const back = me ? ['#mine', 'Герои игрока'] : ['#heroes', 'Герои'];
  V(`<a class="q-back" href="${back[0]}">‹ ${back[1]}</a>
    <div class="q-hp"><div class="q-hcol" style="--hc:${esc(h.col || '#ffb020')}"><div class="q-art">${artHTML(hid)}<div class="q-say" id="hsay"></div><div class="q-artn"><small>${esc(TYPE_RU[h.ty] || 'Герой')}${h.cx ? ' · сложность ' + h.cx + ' из 3' : ''}</small><b>${esc(h.n)}</b></div></div></div>
      <div style="min-width:0"><div class="q-tog">${ME ? `<div class="seg q-sw" id="hsw"><button data-m="me" class="${me ? 'on' : ''}" title="Твоя статистика на герое">${ME.avatar ? `<img class="q-swa" src="${esc(ME.avatar)}" alt="" onerror="this.remove()">` : ''}<span>${esc(ME.name)}</span></button><button data-m="all" class="${me ? '' : 'on'}">Все игроки</button></div>` : ''}${me ? '' : fltHTML()}</div>
        <div class="q-hst" id="hst"><div class="load">Считаю…</div></div>
        <div class="q-sec"><b>Сборки</b><small>только те, что реально есть · сколько раз взяли и винрейт · за 30 дней${F.b ? ' · ' + esc((BADGES.find(x => x[1] === F.b) || BADGES[0])[0]) : ''}</small></div>
        <div id="hbl"><div class="load">Тяну сборки и их винрейты…</div></div></div></div>
    ${me ? `<div class="q-sec"><b>Твои матчи на ${esc(h.n)}</b><small>последние 10 · нажми — разбор</small></div><div class="q-box" id="hmm"><div class="load" style="padding:16px">…</div></div>` : ''}
    <div class="q-g2"><section><div class="q-sec"><b>Против него покупают</b><small>с этими предметами соперники чаще выигрывают</small></div><div class="q-box" id="hctr"><div class="load" style="padding:16px">…</div></div></section>
      <section><div class="q-sec"><b>Лучшие на герое</b><small>официальный топ</small></div><div class="q-box" id="hlb" style="padding:12px 14px"></div></section></div>
    <div class="q-sec"><b>Про-матчи на герое</b><small>последние игры топов Европы на ${esc(h.n)}</small></div><div class="q-box" id="hpro"><div class="load" style="padding:16px">…</div></div>`);
  if (!me) fltBind(() => viewHero(hid, mode));
  const sw = $('#hsw'); if (sw) $$('button', sw).forEach(b => b.onclick = () => { location.hash = '#h/' + hid + (b.dataset.m === 'me' ? '/me' : ''); });
  heroSay(n, h).catch(() => {});
  heroCounterItems(hid); heroTop(hid, 'Europe'); heroPro(hid);
  heroStatsStrip(n, hid, me);
  heroBuilds2(n, hid, me);
  if (me) heroMyMatches(n, hid);
}
async function heroStatsStrip(n, hid, me) {
  try {
    const M = await heroStats(); if (n !== VQ) return;
    const x = M[hid], arr = Object.values(M).sort((a, b) => b.wr - a.wr), place = arr.findIndex(y => y.id === hid) + 1;
    if (!me) { put(n, '#hst', x ? `<div><span>Винрейт</span><b class="${wrC(x.wr)}">${f1(x.wr)}%</b><small>${place ? `#${place} из ${arr.length} в мете` : ''}</small></div><div><span>Берут</span><b>${f1(x.pr)}%</b><small>матчей</small></div><div><span>Матчей</span><b>${nf(x.m)}</b><small>${esc(fName())}</small></div><div><span>KDA</span><b>${f2(x.kda)}</b><small>в среднем</small></div><div><span>Души за матч</span><b>${nf(x.spm)}</b><small>в среднем</small></div>` : '<div class="empty" style="grid-column:1/-1">Нет данных за период.</div>'); return; }
    const L = await api('players/hero-stats?account_ids=' + ME.id); if (n !== VQ) return;
    const y = L.find(r => r.hero_id === hid);
    if (!y || !y.matches_played) { put(n, '#hst', `<div style="grid-column:1/-1"><span>${esc(ME.name)} на этом герое</span><b>0 игр</b><small>Переключись на «Все игроки» — там мета и сборки.</small></div>`); return; }
    const g = y.matches_played, wr = 100 * y.wins / g, kda = (y.kills + y.assists) / Math.max(1, y.deaths), cmp = (a, f) => a != null ? `<small>у всех ${f(a)}</small>` : '';
    put(n, '#hst', `<div><span>Игр</span><b>${nf(g)}</b><small>последняя ${esc(ago(y.last_played))}</small></div>
      <div><span>Винрейт</span><b class="${wrC(wr, g)}">${f1(wr)}%</b>${x ? cmp(x.wr, v => f1(v) + '%') : ''}</div>
      <div><span>KDA</span><b>${f2(kda)}</b>${x ? cmp(x.kda, f2) : ''}</div>
      <div class="q-hrt" data-hrk2="${hid}" role="button" title="Нажми — таблица соседей"><span>Место на герое</span><b id="hstrt">…</b><small id="hstrs">считаю…</small></div>
      <div><span>Урон / мин</span><b>${nf(y.damage_per_min)}</b><small>души / мин ${nf(y.networth_per_min)}</small></div>
      ${y.accuracy != null ? `<div><span>Точность</span><b>${Math.round(100 * y.accuracy)}%</b><small>крит ${Math.round(100 * (y.crit_shot_rate || 0))}%</small></div>` : ''}`);
    hrkGet(hid, ME.id, ME.name).then(o => { if (n !== VQ) return; const v = $('#hstrt'), t = $('#hstrs'); if (v) v.textContent = o && o.w && o.w.pos ? '#' + nf(o.w.pos) : '—';
      if (t) t.innerHTML = o && o.w && o.w.pos ? `в мире${o.tot ? ' · ' + pctTop(o.w.pos, o.tot) : ''} · ${esc(REGN[o.rg] || o.rg)} ${o.r ? '#' + o.r.pos : '— вне топ-1000'} · <u>таблица ›</u>` : 'побед на этом герое пока нет'; }).catch(() => { const t = $('#hstrs'); if (t) t.textContent = 'не вышло посчитать'; });
  } catch (e) { put(n, '#hst', `<div class="err" style="grid-column:1/-1">${esc(e.message)}</div>`); }
}
async function heroMyMatches(n, hid) {
  const H = await api('players/' + ME.id + '/match-history').catch(() => []); if (n !== VQ) return;
  if (!PROF || PROF.id !== ME.id) { const CNT = {}; H.filter(m => m.start_time >= now() - 30 * 86400).forEach(m => CNT[m.hero_id] = (CNT[m.hero_id] || 0) + 1);
    const L = H.slice(0, 50); CNT._avg = {spm: L.reduce((x, m) => x + m.net_worth / (Math.max(300, m.match_duration_s) / 60), 0) / Math.max(1, L.length), d: L.reduce((x, m) => x + m.player_deaths, 0) / Math.max(1, L.length)};
    PROF = {id: ME.id, H, HS: [], CNT, MS: {}, badge: ME.badge || 0}; }
  const S = H.filter(m => m.hero_id === hid).slice(0, 10);
  const draw = () => put(n, '#hmm', S.length ? S.map(gmRow).join('') : '<div class="empty">Матчей на этом герое нет.</div>');
  draw();
  const box = $('#hmm'); if (box) box.onclick = e => { if (e.target.closest('a')) return; const r = e.target.closest('[data-m]'); if (r) location.hash = '#m/' + r.dataset.m; };
  if (!S.length) return;
  await bulkMeta(S.map(m => m.match_id)); if (n !== VQ) return; draw();
  const acc = []; S.forEach(m => { const M = MD.get(m.match_id); if (M) M.players.forEach(p => acc.push(p.account_id)); });
  await steamNames(acc); if (n !== VQ) return; draw();
}

// ---------- сборки: настоящие сборки с винрейтом + подбор Restless ----------
const CATI = {gun: 'Ган', spirit: 'Спирит', mix: 'Микс'};
function shelfName(c, k) {
  const s = String((c && c.name) || '').trim();
  if (s && s[0] !== '#') return s.slice(0, 26);
  const t = s.toLowerCase();
  return /early|laning/.test(t) ? 'Начало' : /mid/.test(t) ? 'Середина' : /late/.test(t) ? 'Конец' : /situational|flex/.test(t) ? 'По ситуации' : /core/.test(t) ? 'Основа' : 'Полка ' + (k + 1);
}
const HB2 = {}, RLC = {}, AR = {};
let HBC = '', HBS = 'pop';
async function restlessItems(hid) {
  const k = hid + '|' + F.b; if (RLC[k]) return RLC[k];
  RLC[k] = (async () => {
    const bq = F.b ? '&min_average_badge=' + F.b : '', t = t30();
    const PH = [[0, 600, 'Сначала', 'до 10 мин'], [600, 1500, 'Потом', '10–25 мин'], [1500, 0, 'В конце', '25+ мин']];
    const [HSx, ...PL] = await Promise.all([api(`analytics/hero-stats?min_unix_timestamp=${t}${bq}`), ...PH.map(([a, b]) => api(`analytics/item-stats?hero_id=${hid}&min_unix_timestamp=${t}${bq}&min_bought_at_s=${a}${b ? '&max_bought_at_s=' + b : ''}`))]);
    const hb = HSx.find(x => x.hero_id === hid); if (!hb || hb.matches < 300) return null;
    const bw = hb.wins / hb.matches, used = new Set();
    const ph = PL.map((L, i) => {
      const min = Math.max(120, hb.matches * .03);
      let C = L.filter(s => item(s.item_id) && s.matches >= min && !used.has(s.item_id)).map(s => ({id: s.item_id, m: s.matches, d: 100 * (s.wins / s.matches - bw)}));
      C = C.sort((a, b) => b.d * Math.log10(b.m) - a.d * Math.log10(a.m)).filter((x, j) => x.d > 0 || j < 3).slice(0, 8);
      C.forEach(x => used.add(x.id));
      return {n: PH[i][2], h: PH[i][3], L: C};
    });
    return {ph, wr: 100 * bw, m: hb.matches, rank: (BADGES.find(x => x[1] === F.b) || BADGES[0])[0]};
  })();
  RLC[k].catch(() => delete RLC[k]);
  return RLC[k];
}
async function heroBuilds2(n, hid, me) {
  try {
    const t = t30(), bq = F.b ? `&min_average_badge=${F.b}` : '', t180 = now() - 180 * 86400 - (now() % 3600);
    const [BS, BP, BM, BR, BA] = await Promise.all([
      api(`analytics/hero-build-stats/${hid}?min_unix_timestamp=${t}&min_matches=${F.b >= 100 ? 10 : 30}${bq}`).catch(() => []),
      api(`analytics/hero-build-stats/${hid}?min_unix_timestamp=${t}&min_matches=10&min_average_badge=105`).catch(() => []),
      me ? api(`analytics/hero-build-stats/${hid}?min_unix_timestamp=${t180}&min_matches=1&account_id=${ME.id}`).catch(() => []) : [],
      me ? api(`analytics/hero-build-stats/${hid}?min_unix_timestamp=${t}&min_matches=1&account_id=${ME.id}`).catch(() => []) : [],
      me ? api(`builds?author_id=${ME.id}&hero_id=${hid}&only_latest=true`).catch(() => []) : []]);
    if (n !== VQ) return;
    const top = (L, k) => L.slice().sort((a, b) => b.matches - a.matches).slice(0, k);
    const have = {}; (BA || []).forEach(b => { if (b && b.hero_build) have[b.hero_build.hero_build_id] = b; });
    const ids = [...new Set([...top(BS, 40), ...top(BP, 10), ...top(BM, 6), ...top(BR, 3)].map(x => x.hero_build_id))].filter(id => !have[id]);
    const raw = (await Promise.all(ids.map(id => api(`builds?build_id=${id}&only_latest=true`).then(r => r && r[0]).catch(() => null)))).concat(Object.values(have));
    if (n !== VQ) return;
    const by = L => { const o = {}; L.forEach(x => o[x.hero_build_id] = x); return o; }, S1 = by(BS), S2 = by(BP), S3 = by(BM), S4 = by(BR);
    const auth = raw.filter(Boolean).map(b => b.hero_build.author_account_id).filter(Boolean);
    await Promise.all([steamNames(auth), authRanks(auth)]); if (n !== VQ) return;
    const L = raw.filter(b => b && b.hero_build && b.hero_build.hero_id === hid).map(b => {
      const id = b.hero_build.hero_build_id, st = S1[id], sp = S2[id], sm = S3[id];
      return {id, b, name: b.hero_build.name || 'Сборка #' + id, author: (SN[b.hero_build.author_account_id] || {}).n || '', aid: b.hero_build.author_account_id, cat: bldCat(b), items: itemsOfBuild(b), st, sp, sm, sr: S4[id],
        made: me && b.hero_build.author_account_id === ME.id,
        m: st ? st.matches : 0, wr: st ? 100 * st.wins / st.matches : 0, wl: st ? wil(st.wins, st.matches) : 0, pm: sp ? sp.matches : 0, pwl: sp ? wil(sp.wins, sp.matches) : 0};
    }).filter(x => x.items.length >= 4);
    HB2[hid] = {L, RL: null, me};
    drawBuilds2(hid);
    const RL = await restlessItems(hid).catch(() => null); if (n !== VQ || !RL) return;
    HB2[hid].RL = RL; drawBuilds2(hid);
  } catch (e) { put(n, '#hbl', `<div class="err">${esc(e.message)}</div>`); }
}
function bCard(x, kind) {
  const st = kind === 'cur' ? (x.sr || x.sm) : kind === 'me' ? x.sm : kind === 'made' ? (x.sm || x.st || x.sp) : kind === 'pro' ? (x.sp || x.st) : (x.st || x.sp);
  const wr = st ? 100 * st.wins / st.matches : 0, mt = st ? st.matches : 0, pro = x.pm >= 10 && (kind === 'pro' || x.pm >= .2 * Math.max(1, x.m));
  const tg = kind === 'cur' ? '<span class="tag a">играешь сейчас</span>' : kind === 'made' ? '<span class="tag a">создал ты</span>' : kind === 'me' ? '<span class="tag a">играл с ней</span>' : pro ? '<span class="tag b" title="этой сборкой часто играют в матчах Eternus">про</span>' : '<span class="tag">игроки</span>';
  const cats = ((x.b.hero_build.details || {}).mod_categories || []).filter(c => (c.mods || []).some(y => item(y.ability_id)));
  const mine = ME ? ((BSP[String(ME.id)] || {})[x.b.hero_build.hero_id] || []).some(y => String(y.id) === String(x.id)) : false;
  const ab = AR[x.aid];
  return `<div class="q-bc c-${x.cat}"><div class="q-bct"><div style="min-width:0"><div class="q-btg"><span class="tag q-ct">${CATI[x.cat]}</span>${tg}</div><b title="${esc(x.name)}">${esc(x.name)}</b><small>${x.author ? `автор ${ab ? `<span class="q-ar" title="ранг автора сейчас: ${esc(rankOf(ab).name)}">${rankImg(ab, 'ri')}${esc(x.author)} · ${esc(rankOf(ab).name)}</span>` : esc(x.author)} · ` : ''}${kind === 'cur' ? 'ты начинал с ней за 30 дней' : kind === 'me' ? 'ты начинал с ней' : kind === 'made' ? (mt ? 'с ней сыграно' : 'опубликована тобой') : kind === 'pro' ? 'в матчах Eternus взяли' : 'взяли'}${mt || kind !== 'made' ? ' ' + nf(mt) + ' ' + pl(mt, ['раз', 'раза', 'раз']) : ''}</small></div><div class="q-bcw ${wr >= 52 ? 'win' : wr <= 46 ? 'loss' : ''}">${f1(wr)}%<small>побед</small></div></div>
    ${cats.slice(0, 3).map((c, k) => `<div class="q-ph"><span title="${esc(c.name || '')}">${esc(shelfName(c, k))}</span><div>${(c.mods || []).filter(y => item(y.ability_id)).slice(0, 8).map(y => phIco(y.ability_id)).join('')}</div></div>`).join('')}
    <div class="q-bcb"><button class="btn s" data-bx="${x.id}">${mine ? 'в профиле ✓' : 'В профиль →'}</button>${cats.length > 3 ? `<button class="btn s g" data-bd="${x.id}">Ещё ${cats.length - 3} ${pl(cats.length - 3, ['полка', 'полки', 'полок'])}</button>` : ''}<button class="sub mono" data-cp="${x.id}" title="Скопировать ID сборки — по нему её находят в игре">ID ${x.id}</button></div>
    ${cats.length > 3 ? `<div class="q-bcd hide" id="bd2-${x.id}">${cats.slice(3).map((c, k) => `<div class="q-ph"><span title="${esc(c.name || '')}">${esc(shelfName(c, k + 3))}</span><div>${(c.mods || []).filter(y => item(y.ability_id)).map(y => phIco(y.ability_id)).join('')}</div></div>`).join('')}</div>` : ''}</div>`;
}
function rlCard(hid, RL, cat) {
  const ok = id => { const s = (item(id) || {}).s; return !cat || cat === 'mix' || (cat === 'gun' ? s !== 'spirit' : s !== 'weapon'); };
  const rows = RL.ph.map(p => ({n: p.n, h: p.h, L: p.L.filter(x => ok(x.id)).slice(0, 6)})).filter(p => p.L.length);
  return `<div class="q-bc rl${cat ? ' c-' + cat : ''}"><div class="q-bct"><div style="min-width:0"><div class="q-btg">${cat ? `<span class="tag q-ct">${CATI[cat]}</span>` : ''}<span class="tag h">Restless</span></div><b>Подбор по победам${cat ? ' · ' + CATI[cat].toLowerCase() : ''}</b><small>что чаще берут победители · ${esc(RL.rank)} · 30 дней · ${nf(RL.m)} матчей на герое</small></div><div class="q-bcw">${f1(RL.wr)}%<small>у героя</small></div></div>
    ${rows.map(p => `<div class="q-ph"><span title="${esc(p.h)}">${p.n}<br><small style="text-transform:none;letter-spacing:0">${p.h}</small></span><div>${p.L.map(x => `<span class="q-pi" title="${esc(item(x.id).n)} · ${x.d >= 0 ? '+' : ''}${f1(x.d)}% к победам героя · ${nf(x.m)} матчей">${phIco(x.id)}<em>${x.d >= 0 ? '+' : ''}${Math.round(x.d)}</em></span>`).join('')}</div></div>`).join('') || '<div class="sub">Мало данных для подбора.</div>'}
    <div class="q-bcb"><button class="btn s" data-bx="rl-${hid}-${cat || 'all'}">В профиль →</button><span class="sub">в игре такой сборки нет — бери по иконкам</span></div></div>`;
}
function drawBuilds2(hid) {
  const el = $('#hbl'), X = HB2[hid]; if (!el || !X) return;
  const {L, RL, me} = X, withSt = L.filter(x => x.m >= 10 || x.pm >= 10);
  const cats = ['gun', 'spirit', 'mix'].map(c => ({c, L: withSt.filter(x => x.cat === c), m: withSt.filter(x => x.cat === c).reduce((a, x) => a + x.m, 0)})).filter(x => x.L.length);
  let html = '';
  if (me) {
    const cur = L.filter(x => x.sr).sort((a, b) => b.sr.matches - a.sr.matches)[0] || L.filter(x => x.sm).sort((a, b) => b.sm.matches - a.sm.matches)[0];
    const made = L.filter(x => x.made && x !== cur);
    html += `<div class="q-cp q-mine"><h4>Твои сборки<small>на какой играешь сейчас и какие создал сам</small></h4><div class="q-bcs" style="margin-top:0">${cur ? bCard(cur, cur.sr ? 'cur' : 'me') : '<div class="empty">За 180 дней ты не начинал матчи с сохранённой сборкой — собираешь сам.</div>'}${made.slice(0, 3).map(x => bCard(x, 'made')).join('')}</div>${!made.length ? '<p class="note" style="margin:6px 0 0">Своих опубликованных сборок на этом герое нет.</p>' : ''}</div>`;
  }
  if (!cats.length) {
    html += `<div class="empty">Сборок с нормальной выборкой за 30 дней нет${RL ? ' — ниже подбор Restless по победам игроков' : ''}.</div>${RL ? `<div class="q-bcs">${rlCard(hid, RL, '')}</div>` : ''}`;
    el.innerHTML = html; bindB(hid); return;
  }
  if (!HBC || !cats.some(x => x.c === HBC)) HBC = cats.slice().sort((a, b) => b.m - a.m)[0].c;
  const SRT = {pop: (a, b) => b.m - a.m || b.pm - a.pm, wr: (a, b) => (b.wl || b.pwl) - (a.wl || a.pwl), pro: (a, b) => b.pm - a.pm || b.pwl - a.pwl};
  const CL = withSt.filter(x => x.cat === HBC && (HBS !== 'pro' || x.pm >= 10)).sort(SRT[HBS] || SRT.pop);
  html += `<div class="q-btabs">${cats.map(({c, L: X}) => { const b0 = X.slice().sort((a, b) => (b.wl || b.pwl) - (a.wl || a.pwl))[0], w0 = b0.st ? b0.wr : (b0.sp ? 100 * b0.sp.wins / b0.sp.matches : 0);
      return `<button class="q-cat c-${c}${HBC === c ? ' on' : ''}" data-c="${c}" aria-pressed="${HBC === c}"><b>${CATI[c]}</b><small>${X.length} ${pl(X.length, ['сборка', 'сборки', 'сборок'])} · лучшая ${f1(w0)}%</small><span class="ic">${b0.items.slice(0, 6).map(id => `<img src="${esc(item(id).i)}" alt="" loading="lazy" onerror="${noimg}">`).join('')}</span></button>`; }).join('')}</div>
    <div class="q-bflt c-${HBC}"><span class="sub">Ранг игроков</span><div class="seg" id="hbr">${BADGES.map(([nm, b]) => `<button data-b="${b}" class="${F.b === b ? 'on' : ''}">${nm}</button>`).join('')}</div>
      <span class="sub">Сортировка</span><div class="seg" id="hbs">${[['pop', 'Популярные'], ['wr', 'Винрейт'], ['pro', 'У прошников']].map(([k, nm]) => `<button data-s="${k}" class="${HBS === k ? 'on' : ''}">${nm}</button>`).join('')}</div></div>
    <div class="q-cl c-${HBC}"><div class="q-clh"><b class="q-ctx">${CATI[HBC]}-сборки</b><span class="sub">${CL.length} ${pl(CL.length, ['сборка', 'сборки', 'сборок'])} · 30 дней · ${esc((BADGES.find(x => x[1] === F.b) || BADGES[0])[0])}</span></div>
      <div class="q-bcs">${CL.map(x => bCard(x, HBS === 'pro' ? 'pro' : '')).join('') || '<div class="empty">Таких сборок у прошников нет — выбери «Популярные».</div>'}${RL ? rlCard(hid, RL, HBC) : ''}</div></div>`;
  el.innerHTML = html; bindB(hid);
}
function bindB(hid) {
  const el = $('#hbl'); if (!el) return;
  el.onclick = e => {
    const c = e.target.closest('[data-c]'); if (c) { HBC = c.dataset.c; drawBuilds2(hid); return; }
    const so = e.target.closest('#hbs [data-s]'); if (so) { HBS = so.dataset.s; drawBuilds2(hid); return; }
    const rb = e.target.closest('#hbr [data-b]'); if (rb) { F.b = +rb.dataset.b; try { localStorage.setItem('rl-f', JSON.stringify(F)); } catch (er) {} put(VQ, '#hbl', '<div class="load">Пересчитываю сборки для ранга…</div>'); heroBuilds2(VQ, hid, HB2[hid] && HB2[hid].me); return; }
    const d = e.target.closest('[data-bd]'); if (d) { const x = $('#bd2-' + d.dataset.bd); if (x) x.classList.toggle('hide'); return; }
    const cp = e.target.closest('[data-cp]'); if (cp) { const v = cp.dataset.cp; (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => { cp.textContent = 'ID скопирован ✓'; }).catch(() => { cp.textContent = 'ID ' + v; }); return; }
    const sv = e.target.closest('[data-bx]'); if (!sv) return;
    if (!ME) { alertBox('Сначала найди себя в поиске сверху — сборка ляжет в твой профиль.'); return; }
    const X = HB2[hid]; if (!X) return; let rec = null;
    if (sv.dataset.bx.startsWith('rl-')) { const cat = sv.dataset.bx.split('-').pop(), cc = cat === 'all' ? '' : cat, ok = id => { const s = (item(id) || {}).s; return !cc || cc === 'mix' || (cc === 'gun' ? s !== 'spirit' : s !== 'weapon'); };
      if (X.RL) rec = {id: sv.dataset.bx, name: 'Restless · подбор по победам' + (cc ? ' · ' + CATI[cc].toLowerCase() : ''), cat: cc || 'mix', src: 'restless', wr: X.RL.wr, mt: X.RL.m, items: X.RL.ph.flatMap(p => p.L.filter(x => ok(x.id)).slice(0, 6).map(x => x.id)).slice(0, 12)}; }
    else { const x = X.L.find(y => String(y.id) === sv.dataset.bx); if (x) rec = {id: x.id, name: x.name, cat: x.cat, src: x.pm >= 10 ? 'pro' : 'vas', wr: x.wr, mt: x.m, items: x.items.slice(0, 12)}; }
    if (rec && bldSave(hid, rec)) { sv.textContent = 'в профиле ✓'; }
    else if (rec) sv.textContent = 'уже в профиле ✓';
  };
}

// ---------- лайв-матч как Porofessor ----------
let LVT = 0;
const PCOL = ['#ffb020', '#5aa9ff', '#36d6c3', '#ff6b81', '#b48cff', '#9ad35a'];
const live = p => fetch(API + p).then(async r => { if (!r.ok) throw new Error(r.status + ' ' + (await r.text().catch(() => '')).slice(0, 120)); return r.json(); });
async function scout2(players, ctx) {
  ctx = ctx || {};
  const ids = players.map(p => p.account_id).filter(Boolean), q = 'account_ids=' + ids.join(',');
  const t12 = now() - 12 * 3600 - (now() % 60), t30d = now() - 30 * 86400 - (now() % 3600), t7 = now() - 7 * 86400 - (now() % 3600);
  const [ranks, hs, MT, , H30, H12, REC] = await Promise.all([api('players/rank?' + q).catch(() => []), api('players/hero-stats?' + q).catch(() => []),
    Promise.all(ids.map(id => api(`players/${id}/mate-stats?same_party=true&min_matches_played=3&min_unix_timestamp=${now() - 90 * 86400 - (now() % 86400)}`).catch(() => []))), steamNames(ids),
    api(`players/hero-stats?${q}&min_unix_timestamp=${t30d}`).catch(() => []), api(`players/hero-stats?${q}&min_unix_timestamp=${t12}`).catch(() => []),
    api(`matches/metadata?${q}&only_filtered_players=true&include_info=true&include_player_kda=true&min_unix_timestamp=${t7}&order_by=match_id&order_direction=desc&limit=150`).catch(() => [])]);
  const per = L => { const o = {}; (L || []).forEach(h => { const x = o[h.account_id] = o[h.account_id] || {m: 0, w: 0, hs: []}; x.m += h.matches_played || 0; x.w += h.wins || 0; if (h.matches_played) x.hs.push({hid: h.hero_id, m: h.matches_played, w: h.wins || 0}); }); return o; };
  const P30 = per(H30), P12 = per(H12), RC = {};
  (REC || []).forEach(mm => (mm.players || []).forEach(pp => { const L = RC[pp.account_id] = RC[pp.account_id] || []; if (L.length < 6) L.push({mid: mm.match_id, hid: pp.hero_id, w: teamOf(pp.team) === teamOf(mm.winning_team), kda: `${pp.kills || 0}/${pp.deaths || 0}/${pp.assists || 0}`}); }));
  const R = {}, H = {}, T = {};
  (ranks || []).forEach(r => R[r.account_id] = r);
  (hs || []).forEach(h => { (H[h.account_id] = H[h.account_id] || {})[h.hero_id] = h; const t = T[h.account_id] = T[h.account_id] || {m: 0, w: 0}; t.m += h.matches_played || 0; t.w += h.wins || 0; });
  // пати: кто часто играл в одной пати с кем-то из этого лобби
  const par = {}, find = x => par[x] === undefined || par[x] === x ? (par[x] = x) : (par[x] = find(par[x])), uni = (a, b) => { par[find(a)] = find(b); };
  const inL = new Set(ids);
  const recent = x => { const L = Array.isArray(x.matches) ? x.matches : []; return ctx.last ? L.includes(ctx.mid) : ctx.mid ? L.some(z => z >= ctx.mid - 1400000) : false; };
  ids.forEach((id, i) => (MT[i] || []).forEach(x => { const mid = x.mate_id || x.account_id; if (mid && inL.has(mid) && recent(x)) uni(id, mid); }));
  const grp = {}; ids.forEach(id => { const r = find(id); (grp[r] = grp[r] || []).push(id); });
  const pid = {}; let k = 0; Object.values(grp).filter(g => g.length > 1).forEach(g => { g.forEach(id => pid[id] = {c: PCOL[k % PCOL.length], n: g.length}); k++; });
  return players.map(p => {
    const id = p.account_id, hid = p.hero_id, h = (H[id] || {})[hid] || {}, t = T[id] || {m: 0, w: 0}, r = R[id] || {};
    const hm = h.matches_played || 0, hw = h.wins || 0, badge = p.badge || r.badge || 0, sn = SN[id] || {};
    const ws = r.last_match && r.last_match.start_time > now() - 86400 * 2 ? r.last_match.player_rank_initial_win_streak || 0 : 0;
    const tags = [];
    if (hm >= 20 && t.m && hm / t.m >= .25) tags.push(['a', 'Мейн героя', `${pc(hm, t.m)}% всех его игр — на этом герое`]);
    else if (hm >= 150) tags.push(['b', 'Ветеран героя', `${nf(hm)} игр на герое`]);
    if (hm === 0 && t.m >= 30) tags.push(['r', 'Первый раз на герое', 'ни одной игры на этом герое в открытых данных']);
    else if (hm > 0 && hm <= 3 && t.m >= 30) tags.push(['r', 'Почти не играл', `всего ${games(hm)} на герое`]);
    if (t.m && t.m < 60) tags.push(['', 'Новичок', `всего ${games(t.m)}`]);
    const rc = RC[id] || [], p30 = P30[id] || {m: 0, w: 0, hs: []}, p12 = P12[id] || {m: 0, w: 0, hs: []};
    let st = 0; while (st < rc.length && rc[st].w === (rc[0] || {}).w) st++;
    if (rc.length && st >= 3) tags.push(rc[0].w ? ['g', `Выиграл ${st} подряд`, 'последние матчи — победы'] : ['r', `Проиграл ${st} подряд`, 'последние матчи — поражения, может тильтовать']);
    else if (ws >= 3) tags.push(['g', 'Серия побед · ' + ws, 'побед подряд в ранговых']);
    if (!p12.m && p30.m >= 5 && !ctx.last) tags.push(['b', 'Первая игра за день', 'не играл последние 12 часов — ещё не разогрелся']);
    if (hm >= 15 && hw / hm >= .6) tags.push(['g', 'Сильный на герое', `${pc(hw, hm)}% побед на герое`]);
    if (hm >= 15 && hw / hm <= .4) tags.push(['r', 'Слабый на герое', `${pc(hw, hm)}% побед на герое`]);
    if (sn.m30 >= 120) tags.push(['b', 'Много играет', `${sn.m30} матчей за 30 дней`]);
    if (t.m && t.m < 200 && badge >= 100) tags.push(['r', 'Мало игр для ранга', `${games(t.m)} — и уже ${rankOf(badge).name}`]);
    if (p30 && p30.m >= 20 && p30.w / p30.m >= .58) tags.push(['g', 'В форме', `${pc(p30.w, p30.m)}% побед за 30 дней`]);
    if (p30 && p30.m >= 20 && p30.w / p30.m <= .42) tags.push(['r', 'Не в форме', `${pc(p30.w, p30.m)}% побед за 30 дней`]);
    if (p12 && p12.m >= 6) tags.push(['b', 'Марафон', `${games(p12.m)} за 12 часов`]);
    if (p12 && p12.m >= 3 && !p12.w) tags.push(['r', 'Тильт сегодня', `0 побед в ${games(p12.m)} за 12 часов`]);
    if (!p30.m && t.m >= 50) tags.push(['b', 'Давно не играл', 'ни одной игры за 30 дней — может «заржаветь»']);
    if (rc.length >= 4 && rc.slice(0, 4).every(r => r.hid === hid)) tags.push(['a', 'Спамит героя', `последние ${Math.min(rc.length, rc.filter(r => r.hid === hid).length)} игр — на этом же герое`]);
    if (badge >= 100) tags.push(['a', 'Высокий ранг', rankOf(badge).name]);
    if (pid[id]) tags.push(['h', `Друзья · ${pid[id].n}`, ctx.last ? 'друзья в Steam и в одной команде в этом матче — возможно, пати' : 'друзья в Steam, недавно играли в одной команде — возможно, пати']);
    const threat = hm >= 10 ? (hw / hm - .5) * Math.min(1, hm / 60) + (ws >= 3 ? .05 : 0) + badge / 1000 : badge / 1000 - .1;
    const hot = rc.length && st >= 3 && rc[0].w, cold = rc.length && st >= 3 && !rc[0].w;
    const mood = hot || ws >= 3 || (hm >= 15 && hw / hm >= .58) ? 'g' : cold || (hm >= 15 && hw / hm <= .42) || (hm === 0 && t.m >= 30) ? 'c' : '';
    return {id, hid, team: teamOf(p.team), name: sn.n || 'Скрытый игрок', av: sn.av, badge, hm, hw, tm: t.m, tw: t.w, kda: hm ? (h.kills + h.assists) / Math.max(1, h.deaths) : 0, tags, threat, mood, party: pid[id], p30, p12, rc};
  });
}
function pCard(p, en, thr, meId) {
  const wr = pc(p.hw, p.hm);
  return `<div class="q-pc${p.id === meId ? ' mine' : ''}${thr ? ' thr' : ''}"><div class="top"><img class="f" src="${esc(faceUrl(p.hid, p.mood))}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${esc(hero(p.hid).i)}'"><span class="hn">${esc(hero(p.hid).n)}</span>${p.party ? `<i class="pty" style="background:${p.party.c}" title="друзья в Steam в одной команде — возможно, пати"></i>` : ''}</div>
    <div class="q-pb">${p.id ? `<a class="q-pc-n" href="?id=${p.id}#home" style="text-decoration:none"><span class="q-pnm">${esc(p.name)}</span></a>` : `<span class="q-pnm">${esc(p.name)}</span>`}
      <div class="rkl">${rankImg(p.badge, 'rk')}<span>${esc(rankOf(p.badge).name)}</span></div>
      <div class="ln">На герое: <b>${p.hm ? games(p.hm) : 'нет игр'}</b>${p.hm ? ` · <b class="${wrC(wr, p.hm)}">${wr}%</b> · KDA ${f1(p.kda)}` : ''}</div>
      <div class="ln">Всего: ${p.tm ? `<b>${nf(p.tm)}</b> · ${pc(p.tw, p.tm)}%` : 'нет данных'}</div>
      <div class="q-per">${[['12', '12 ч', p.p12], ['30', '30 дн.', p.p30]].map(([k, nm, o]) => { const wr = o && o.m ? Math.round(100 * o.w / o.m) : 0;
        return `<button class="q-pr" type="button" data-per="${k}" data-acc="${p.id}" title="${o && o.m ? `${games(o.m)}, ${o.w} ${pl(o.w, ['победа', 'победы', 'побед'])} — нажми, на каких героях` : 'игр нет'}"${o && o.m ? '' : ' disabled'}><i class="q-rg ${o && o.m ? (wr >= 50 ? 'w' : 'l') : ''}" style="--p:${wr}"><b>${o && o.m ? wr + '%' : '—'}</b></i><span><b>${nm}</b><small>${o && o.m ? games(o.m) : 'не играл'}</small></span></button>`; }).join('')}</div>
      ${p.rc && p.rc.length ? `<div class="q-rec"><span>Последние:</span>${p.rc.slice(0, 5).map(r => `<a href="#m/${r.mid}" class="${r.w ? 'w' : 'l'}" title="${esc(hero(r.hid).n)} · ${r.w ? 'победа' : 'поражение'} · ${r.kda} — разбор"><img src="${esc(hero(r.hid).i)}" alt="" loading="lazy" onerror="${noimg}"></a>`).join('')}${p.id ? `<a class="q-rm" href="?id=${p.id}#home" title="все матчи — профиль">все ›</a>` : ''}</div>` : ''}
      <div class="q-pbld" id="pb-${p.id}"></div>
      <div class="tg">${thr ? '<span class="tag h" title="самый опасный по рангу и игре на герое">Главная угроза</span>' : ''}${p.cn ? `<span class="tag r" title="твой герой против него на линии побеждает реже">Контрит тебя · ${p.cn}%</span>` : ''}${p.tags.map(t => `<span class="tag ${t[0]}" title="${esc(t[2])}">${esc(t[1])}</span>`).join('')}</div></div></div>`;
}
async function liveLobby(n, players, aid, head, ctx) {
  put(n, '#lvb', `${head || ''}<div class="load">Смотрю ранги, героев и пати всех 12 игроков…</div>`);
  const L = await scout2(players, ctx); if (n !== VQ) return;
  const mine = L.find(p => p.id === aid), myTeam = mine ? mine.team : 0, myHero = mine ? mine.hid : null;
  if (myHero) { const CS = await counterStats().catch(() => []), C = {}; CS.forEach(x => { if (x.hero_id === myHero) C[x.enemy_hero_id] = x; });
    L.forEach(p => { if (p.team === myTeam) return; const x = C[p.hid]; if (x && x.matches_played >= 200 && x.wins / x.matches_played < .47) p.cn = pc(x.wins, x.matches_played); }); }
  if (n !== VQ) return;
  const en = L.filter(p => p.team !== myTeam), us = L.filter(p => p.team === myTeam), thr = en.slice().sort((a, b) => b.threat - a.threat)[0];
  const avg = P => { const B = P.filter(p => p.badge); return B.length ? Math.round(B.reduce((a, p) => a + p.badge, 0) / B.length) : 0; };
  const team = (P, k, isEn) => `<div class="q-team"><div class="q-th"><i style="background:${k ? 'var(--q-sp)' : 'var(--q-am)'}"></i><b>${k ? 'Сапфировое пламя' : 'Янтарная рука'}</b><small>${mine ? (isEn ? 'противники' : 'команда игрока') + ' · ' : ''}средний ранг ${esc(rankOf(avg(P)).name)}</small></div>
    <div class="q-lob">${P.map(p => pCard(p, isEn, isEn && p === thr, aid)).join('')}</div></div>`;
  const first = mine ? [us, myTeam, false] : [L.filter(p => p.team === 0), 0, false], second = mine ? [en, 1 - myTeam, true] : [L.filter(p => p.team === 1), 1, true];
  put(n, '#lvb', `${head || ''}${team(first[0], first[1], !!mine && first[2])}${team(second[0], second[1], !!mine && second[2])}
    ${myHero ? `<div class="q-sec"><b>Сборка на ${esc(hero(myHero).n)}</b><small>сначала · потом · в конце — без лишнего</small></div><div class="q-box" id="lvbld" style="padding:12px 14px;display:flex;flex-direction:column;gap:8px"><div class="load" style="padding:6px 0">…</div></div>` : ''}
    ${myHero ? `<div class="q-sec"><b>Против их состава</b><small>${esc(hero(myHero).n)} · ${esc(fName())}</small></div><div class="card" id="vsall"><div class="load" style="padding:16px">Считаю предметы против каждого врага…</div></div>` : ''}`);
  LVL = L;
  if (myHero) vsAll(n, en, myHero);
  pBuilds(n, L);
  if (myHero) heroPhaseBuild(n, myHero);
}
// всплывашка: на каких героях играл за период, что в сборке
let LVL = [];
const PBD = {};
const SUP = new Set(['Rescue Beam', 'Healing Nova', 'Restorative Locket', 'Guardian Ward', 'Divine Barrier', 'Heroic Aura', 'Healing Rite']);
const PCAT = {gun: 'Ган', spirit: 'Спирит', sup: 'Саппорт', tank: 'Танк', mix: 'Микс'};
function qPopClose() { const d = $('.q-pop'); if (d) d.remove(); document.removeEventListener('click', qPopOut, true); }
function qPopOut(e) { if (!e.target.closest('.q-pop') && !e.target.closest('[data-per],[data-pb]')) qPopClose(); }
function qPop(anchor, html) {
  qPopClose();
  const d = document.createElement('div'); d.className = 'q-pop'; d.innerHTML = `<button class="q-px" type="button" aria-label="Закрыть">✕</button>${html}`; document.body.appendChild(d);
  const r = anchor.getBoundingClientRect(), w = d.offsetWidth, h = d.offsetHeight;
  const x = Math.min(innerWidth - w - 8, Math.max(8, r.left)), y = r.bottom + 6 + h > innerHeight - 8 ? Math.max(8, r.top - h - 6) : r.bottom + 6;
  d.style.left = x + 'px'; d.style.top = y + 'px';
  $('.q-px', d).onclick = qPopClose;
  setTimeout(() => document.addEventListener('click', qPopOut, true), 0);
}
addEventListener('keydown', e => { if (e.key === 'Escape') qPopClose(); });
addEventListener('hashchange', qPopClose);
addEventListener('scroll', () => { if ($('.q-pop') && innerWidth > 640) qPopClose(); }, {passive: true});
function perHTML(p, k) {
  const o = k === '12' ? p.p12 : p.p30; if (!o || !o.m) return '<div class="sub">Игр нет.</div>';
  const L = o.hs.slice().sort((a, b) => b.m - a.m).slice(0, 8), mx = Math.max(1, ...L.map(x => x.m));
  return `<div class="q-poh"><b>${esc(p.name)}</b><small>${k === '12' ? 'за 12 часов' : 'за 30 дней'} · ${games(o.m)} · ${Math.round(100 * o.w / o.m)}% побед</small></div>
    <table class="q-tbl q-ptb"><tr><th></th><th>игр</th><th>винрейт</th></tr>${L.map(x => { const wr = Math.round(100 * x.w / x.m); return `<tr><td>${face(x.hid, '', 's', hero(x.hid).n)}</td><td><div class="q-bw"><span class="bar"><i style="width:${Math.round(100 * x.m / mx)}%;background:var(--win)"></i></span><b>${x.m}</b></div></td><td><div class="q-bw"><span class="bar"><i style="width:${wr}%;background:${wr >= 50 ? 'var(--win)' : 'var(--loss)'}"></i></span><b class="${wrC(wr, x.m)}">${wr}%</b></div></td></tr>`; }).join('')}</table>`;
}
// его сборка на этом герое: предметы, которые он берёт чаще всего, по фазам (сначала / середина / конец)
async function pBuilds(n, L) {
  const t90 = now() - 90 * 86400 - (now() % 86400);
  await Promise.all(L.filter(p => p.id && p.hm > 5).map(async p => {
    const S = await api(`analytics/item-stats?hero_id=${p.hid}&account_id=${p.id}&min_unix_timestamp=${t90}`).catch(() => []); if (n !== VQ) return;
    const g = Math.max(0, ...S.map(s => s.matches || 0)); if (g < 3) return;
    const bt = s => s.avg_buy_time_s || 0;
    const early = S.filter(s => item(s.item_id) && bt(s) < 1500 && s.matches >= Math.max(2, .35 * g));
    const late = S.filter(s => item(s.item_id) && bt(s) >= 1500 && s.matches >= Math.max(2, .18 * g)).sort((a, b) => b.matches - a.matches).slice(0, 6);
    const core = early.concat(late).sort((a, b) => bt(a) - bt(b)).slice(0, 16);
    if (core.length < 4) return;
    let w = 0, sp = 0, v = 0, sup = 0; core.forEach(s => { const I = item(s.item_id), k = (I.p || 800) * s.matches / g; if (I.s === 'weapon') w += k; else if (I.s === 'spirit') sp += k; else v += k; if (SUP.has(I.n)) sup++; });
    const top = Math.max(w, sp, v), cat = sup >= 2 ? 'sup' : top < .45 * (w + sp + v) ? 'mix' : top === w ? 'gun' : top === sp ? 'spirit' : 'tank';
    const ph = [['Сначала', 0, 600], ['Середина', 600, 1500], ['Конец', 1500, 1e9]].map(([nm, a, b]) => ({nm, L: core.filter(s => (s.avg_buy_time_s || 0) >= a && (s.avg_buy_time_s || 0) < b)})).filter(x => x.L.length);
    PBD[p.id] = {p, g, cat, ph, core};
    put(n, '#pb-' + p.id, `<button class="q-pbb" type="button" data-pb="${p.id}" title="нажми — что в сборке"><span>Его сборка · <b class="q-ctx c-${cat}">${PCAT[cat]}</b> · ${g} ${pl(g, ['игра', 'игры', 'игр'])}</span><span class="ic">${core.slice(-6).map(s => `<img src="${esc(item(s.item_id).i)}" alt="" title="${esc(item(s.item_id).n)}" loading="lazy" onerror="${noimg}">`).join('')}</span></button>`);
  }));
}
function pbHTML(id) {
  const X = PBD[id]; if (!X) return '';
  return `<div class="q-poh"><b>${esc(X.p.name)} · ${esc(hero(X.p.hid).n)}</b><small><b class="q-ctx c-${X.cat}">${PCAT[X.cat]}</b> · что он берёт на этом герое за 90 дней · ${X.g} ${pl(X.g, ['игра', 'игры', 'игр'])}</small></div>
    ${X.ph.map(f => `<div class="q-ph"><span>${f.nm}</span><div>${f.L.map(s => `<span class="q-pi" title="${esc(item(s.item_id).n)} · берёт в ${Math.round(100 * s.matches / X.g)}% игр · с ним ${Math.round(100 * s.wins / Math.max(1, s.matches))}% побед · в среднем на ${Math.round((s.avg_buy_time_s || 0) / 60)}-й минуте">${phIco(s.item_id)}<em>${Math.round(100 * s.matches / X.g)}%</em></span>`).join('')}</div></div>`).join('')}
    <div class="q-pbn" id="pbn-${id}"><span class="sub">Ищу его сохранённую сборку…</span></div>
    <p class="note" style="margin-top:8px">Под иконкой — в скольких его играх на герое есть предмет. Наведи — винрейт с ним и на какой минуте берёт.</p>`;
}
async function pbNamed(id) {
  const X = PBD[id]; if (!X) return;
  const B = await api(`analytics/hero-build-stats/${X.p.hid}?account_id=${id}&min_matches=1&min_unix_timestamp=${now() - 180 * 86400 - (now() % 86400)}`).catch(() => []);
  const el = $('#pbn-' + id); if (!el) return;
  const b = (B || []).slice().sort((a, c) => c.matches - a.matches)[0];
  if (!b) { el.innerHTML = '<span class="sub">Сохранённой сборки в игре нет — собирает сам.</span>'; return; }
  const r = await api(`builds?build_id=${b.hero_build_id}&only_latest=true`).catch(() => []); const el2 = $('#pbn-' + id); if (!el2) return;
  const hb = r && r[0] && r[0].hero_build;
  el2.innerHTML = hb ? `<span class="sub">Начинает матчи со сборкой <b style="color:var(--tx)">«${esc(hb.name || 'без названия')}»</b> — ${b.matches} ${pl(b.matches, ['раз', 'раза', 'раз'])}, ${Math.round(100 * b.wins / Math.max(1, b.matches))}% побед · <a class="lnk" href="#h/${X.p.hid}" >сборки героя ›</a></span>` : '<span class="sub">Сохранённая сборка не нашлась.</span>';
}
// стандартная сборка на героя: что чаще берут победители — сначала, потом, в конце
async function heroPhaseBuild(n, hid) {
  const el = $('#lvbld'); if (!el) return;
  const RL = await restlessItems(hid).catch(() => null); if (n !== VQ) return;
  put(n, '#lvbld', RL ? `${RL.ph.map(p => `<div class="q-ph"><span>${p.n}<br><small style="text-transform:none;letter-spacing:0">${p.h}</small></span><div>${p.L.slice(0, 5).map(x => `<span class="q-pi" title="${esc(item(x.id).n)} · ${x.d >= 0 ? '+' : ''}${f1(x.d)}% к победам героя · ${nf(x.m)} матчей">${phIco(x.id)}<em>${x.d >= 0 ? '+' : ''}${Math.round(x.d)}</em></span>`).join('')}</div></div>`).join('')}<p class="note">Что чаще берут победители на ${esc(hero(hid).n)} · ${esc(RL.rank)} · 30 дней. Полностью — <a class="lnk" href="#h/${hid}">на странице героя ›</a></p>` : '<div class="empty">Мало данных для сборки.</div>');
}
async function vsAll(n, en, myHero) {
  const base = await api(`analytics/item-stats?hero_id=${myHero}&${fq()}`).catch(() => []); if (n !== VQ) return;
  const B = {}; base.forEach(s => B[s.item_id] = s);
  const rows = await Promise.all(en.map(async p => {
    const S = await api(`analytics/item-stats?hero_id=${myHero}&enemy_hero_ids=${p.hid}&${fq()}`).catch(() => []);
    return {p, L: S.filter(s => item(s.item_id) && s.matches >= 40 && B[s.item_id] && B[s.item_id].matches >= 150).map(s => ({id: s.item_id, d: 100 * (s.wins / s.matches - B[s.item_id].wins / B[s.item_id].matches)})).sort((a, b) => b.d - a.d).slice(0, 3)};
  }));
  put(n, '#vsall', `<div class="cnt">${rows.map(({p, L}) => `<div class="cr"><a href="#h/${p.hid}" title="${esc(hero(p.hid).n)}">${heroImg(p.hid)}</a><div class="its"><a class="crn" href="#h/${p.hid}">${esc(hero(p.hid).n)}</a>${L.filter(x => x.d > 1).map(x => `<span class="it">${itImg(x.id)}${esc(item(x.id).n)}<em>+${f1(x.d)}%</em></span>`).join('') || `<span class="sub">предметы почти ничего не меняют — играй от линии.</span>`}${TIPS[p.hid] ? `<span class="tag a" title="${esc(TIPS[p.hid][3])}">совет: ${esc(TIPS[p.hid][0])}</span>` : ''}</div></div>`).join('')}</div>
    <p class="note" style="padding:0 16px 14px">% — насколько чаще ${esc(hero(myHero).n)} выигрывает с предметом, когда против этот герой, чем обычно.</p>`);
}
async function liveList(n, title) {
  const el = $('#lvl'); if (!el) return;
  try {
    const A = await live('matches/active'); if (n !== VQ) return;
    const L = A.filter(m => (m.players || []).length >= 12 && /citadel|normal/i.test(m.game_mode_parsed || '') && !/street/i.test(m.game_mode_parsed || '')).sort((a, b) => (b.match_score || 0) - (a.match_score || 0)).slice(0, 12);
    put(n, '#lvl', `<div class="q-sec"><b>${title || 'Идут прямо сейчас'}</b><small>самые высокие по рангу матчи мира · нажми — лобби</small></div><div class="q-box q-lvl">${L.map(m => {
      const P = m.players, hs = k => `<span class="q-hs2 t${k}">${P.filter(p => teamOf(p.team) === k).map(p => `<img src="${esc(hero(p.hero_id).i)}" alt="" title="${esc(hero(p.hero_id).n)}" loading="lazy" onerror="${noimg}">`).join('')}</span>`;
      return `<a class="q-lvr" href="#live/m${m.match_id}"><span class="mt2"><b>${esc(m.match_mode_parsed === 'Ranked' ? 'Ранговый' : 'Обычный')} · ${esc(String(m.region_mode_parsed || '').replace('europe', 'Европа').replace('row', 'весь мир'))}</b><small>идёт ${mmss(now() - m.start_time)} · зрителей ${m.spectators || 0}</small></span>${hs(0)}${hs(1)}<span class="lnk">Лобби ›</span></a>`; }).join('') || '<div class="empty">Сейчас открытых топ-матчей нет.</div>'}</div>`);
  } catch (e) { put(n, '#lvl', `<div class="err">${esc(e.message)}</div>`); }
}
async function viewLive(arg) {
  const n = vNew(); clearInterval(LVT);
  const isM = !!arg && /^m\d+$/.test(arg), aid = isM ? 0 : (+arg || (ME ? ME.id : 0));
  V(`<div class="q-lvh"><h1 class="h1">Лайв-<em>матч</em></h1>
    <form class="q-lvf" id="lvf" autocomplete="off"><input id="lvq" placeholder="Ник, ссылка Steam или ID игрока" aria-label="Игрок" value="${aid && !(ME && aid === ME.id) ? esc(String(aid)) : ''}"><button class="btn" type="submit">Найти матч</button>${ME ? '<button class="btn g" type="button" id="lvme">Мой матч</button>' : ''}<div class="dd hide" id="lvd"></div></form></div>
    <p class="sub" style="margin:8px 0 0">Как в Porofessor: ранг, игры и винрейт на герое у всех 12, кто с кем дружит (возможная пати), кто на серии, кто первый раз на герое и кто главная угроза. Нажми на игрока — его профиль.</p>
    <div id="lvb"><div class="load">${isM ? 'Открываю лобби…' : aid ? 'Ищу живой матч…' : ''}</div></div><div id="lvl"></div>`);
  const go = id => { location.hash = '#live/' + id; };
  $('#lvf').onsubmit = async e => {
    e.preventDefault(); const q = $('#lvq').value.trim(); if (!q) return; const id = idFrom(q); if (id) return go(id);
    const dd = $('#lvd'); dd.classList.remove('hide'); dd.innerHTML = '<div class="load" style="padding:10px">Ищу игрока…</div>';
    try { const nm = (q.match(/steamcommunity\.com\/id\/([^\/?#]+)/) || [])[1] || q, L = await api('players/steam-search?limit=8&search_query=' + encodeURIComponent(nm));
      dd.innerHTML = L.length ? L.map(s => `<button type="button" data-id="${s.account_id}"><img src="${esc(s.avatarmedium || s.avatar)}" alt="" onerror="${noimg}"><span><b>${esc(s.personaname)}</b><small>${esc(s.countrycode || '')} · ID ${s.account_id}</small></span></button>`).join('') : '<div class="empty">Никого. Вставь ссылку на профиль Steam или ID.</div>';
    } catch (er) { dd.innerHTML = `<div class="err">${esc(er.message)}</div>`; }
  };
  $('#lvd').onclick = e => { const b = e.target.closest('[data-id]'); if (b) go(b.dataset.id); };
  const mb = $('#lvme'); if (mb) mb.onclick = () => go(ME.id);
  $('#lvb').onclick = e => {
    const pr = e.target.closest('[data-per]'); if (pr) { const p = LVL.find(x => String(x.id) === pr.dataset.acc); if (p) qPop(pr, perHTML(p, pr.dataset.per)); return; }
    const pb = e.target.closest('[data-pb]'); if (pb) { qPop(pb, pbHTML(pb.dataset.pb)); pbNamed(pb.dataset.pb); }
  };
  if (!isM && !aid) { put(n, '#lvb', '<div class="empty">Впиши ник или ID — найду его матч. Или открой любой из топ-матчей ниже.</div>'); liveList(n); return; }
  try {
    if (isM) {
      const A = await live('matches/active'); if (n !== VQ) return;
      const m = A.find(x => String(x.match_id) === arg.slice(1));
      if (!m) { put(n, '#lvb', '<div class="empty">Этот матч уже закончился — разбор появится в истории игроков.</div>'); liveList(n); return; }
      const head = liveHead(m);
      await liveLobby(n, m.players, 0, head, {mid: m.match_id}); tick(n, m.start_time); liveList(n, 'Другие матчи сейчас'); return;
    }
    const act = await live(`matches/active?account_id=${aid}`).catch(() => []); if (n !== VQ) return;
    if (act && act.length) { await liveLobby(n, act[0].players, aid, liveHead(act[0]), {mid: act[0].match_id}); tick(n, act[0].start_time); return; }
    const H = await api('players/' + aid + '/match-history').catch(() => []); if (n !== VQ) return;
    await steamNames([aid]); if (n !== VQ) return;
    const nm = (SN[aid] || {}).n || 'игрока';
    if (!H.length) { put(n, '#lvb', `<div class="empty">У ${esc(nm)} нет матчей в открытых данных.</div>`); liveList(n); return; }
    await bulkMeta([H[0].match_id]); if (n !== VQ) return;
    const md = MD.get(H[0].match_id);
    const P = md ? md.players.map(p => ({account_id: p.account_id, hero_id: p.hero_id, team: p.team, badge: p.player_rank_initial_display_rank || 0})) : [];
    const w = H[0].player_team === H[0].match_result;
    const head = `<div class="q-mh"><span class="tag">последний матч</span><span>${esc(nm)}</span><span>${esc(ago(H[0].start_time + H[0].match_duration_s))} · ${mmss(H[0].match_duration_s)}</span><span class="tag ${w ? 'g' : 'r'}">${w ? 'победа' : 'поражение'}</span><span class="sp" style="flex:1"></span><a class="btn s g" href="#m/${H[0].match_id}">Разбор матча →</a></div>
      <p class="note">Живого матча у ${esc(nm)} сейчас нет в открытом списке. Игра открывает живые матчи только из вкладки «Смотреть» — это около 200 самых высоких по рангу игр мира. Если матч ниже — живых данных нет ни у кого. Пока — его последний матч; во время игры лобби покажет мод Restless прямо в игре.</p>`;
    if (P.length) await liveLobby(n, P, aid, head, {mid: H[0].match_id, last: true}); else put(n, '#lvb', head);
    liveList(n, 'Идут прямо сейчас');
  } catch (e) { put(n, '#lvb', `<div class="err">Не вышло: ${esc(e.message)}</div>`); }
}
function liveHead(m) {
  return `<div class="q-mh"><span class="live">идёт матч</span><span id="lvtm">${mmss(now() - m.start_time)}</span><span>${m.match_mode_parsed === 'Ranked' ? 'Ранговый' : 'Обычный'}</span>${m.region_mode_parsed ? `<span>${esc(String(m.region_mode_parsed).replace('europe', 'Европа'))}</span>` : ''}<span>зрителей ${m.spectators || 0}</span>${m.net_worth_team_0 ? `<span title="души команд">души ${kFmt(m.net_worth_team_0)} : ${kFmt(m.net_worth_team_1)}</span>` : ''}<span class="mu">матч ${m.match_id}</span></div>`;
}
function tick(n, t0) { clearInterval(LVT); LVT = setInterval(() => { if (n !== VQ) { clearInterval(LVT); return; } const el = $('#lvtm'); if (el) el.textContent = mmss(now() - t0); }, 1000); }

// ---------- обновления: патчноуты — коротко для тебя и весь текст ----------
let HNM = null, INM = null;
const heroNames = () => HNM || (HNM = Object.entries(D.heroes).flatMap(([id, h]) => { const L = [[h.n, +id]]; if (/^The /.test(h.n)) L.push([h.n.slice(4), +id]); if (h.n.includes(' & ')) L.push([h.n.replace(' & ', ' and '), +id]); return L; }).sort((a, b) => b[0].length - a[0].length));
const itemNames = () => INM || (INM = Object.entries(D.items).map(([id, x]) => [x.n, +id]).filter(x => x[0] && x[0].length > 3).sort((a, b) => b[0].length - a[0].length));
function lineKind(s) {
  const t = s.toLowerCase();
  if (/\bfix(ed|es)?\b/.test(t)) return 'f';
  const inv = /(cooldown|cost|price|cast (time|delay)|delay|charge ?time|channel|reload time|wind ?up|windup|spread|recoil|falloff|respawn|downtime|lockout|time to|recovery time)/.test(t);
  const m = t.match(/from\s+([+-]?[\d.]+)[^\d+\-]{0,40}?\s+to\s+([+-]?[\d.]+)/);
  let up = null;
  if (m) { const a = parseFloat(m[1]), b = parseFloat(m[2]); if (!isNaN(a) && !isNaN(b) && a !== b) up = b > a; }
  if (up == null) { if (/\b(increased|increases|increase|raised|improved|buffed|now also)\b/.test(t)) up = true; else if (/\b(reduced|decreased|lowered|nerfed|no longer|removed)\b/.test(t)) up = false; }
  return up == null ? '' : (up !== inv ? 'u' : 'd');
}
function parsePatch(p) {
  if (p._pp) return p._pp;
  const doc = new DOMParser().parseFromString(String(p.content || ''), 'text/html');
  const imgs = [...doc.querySelectorAll('img')].map(i => i.getAttribute('src') || '').filter(u => /^https:\/\//.test(u));
  doc.querySelectorAll('img,script,style,iframe,video,object,embed').forEach(x => x.remove());
  doc.querySelectorAll('br').forEach(b => b.replaceWith('\n'));
  doc.querySelectorAll('li').forEach(li => { li.prepend('\n- '); li.append('\n'); });
  doc.querySelectorAll('[class*="bb_h"],h1,h2,h3,h4,h5').forEach(el => { el.prepend('\n## '); el.append('\n'); });
  doc.querySelectorAll('p,div,ul,ol,blockquote').forEach(el => el.append('\n'));
  const lines = (doc.body.textContent || '').split('\n').map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const out = [], HN = heroNames(), IN = itemNames(); let sub = '', subH = 0, subI = 0;
  const starts = (low, nm) => low.startsWith(nm.toLowerCase() + ':') || low.startsWith(nm.toLowerCase() + ' ');
  lines.forEach(s => {
    if (s.startsWith('## ') || /^\[.+\]$/.test(s)) { const t = s.replace(/^## /, '').replace(/^\[|\]$/g, '').replace(/:$/, '').trim(); if (t) out.push({t: 'h', s: t}); sub = ''; subH = 0; subI = 0; return; }
    const bul = /^[-•*–]\s+/.test(s), txt = bul ? s.replace(/^[-•*–]\s+/, '') : s;
    if (!bul && txt.length < 60 && /:$/.test(txt)) { sub = txt.slice(0, -1).trim(); const hh = HN.find(([nm]) => nm.toLowerCase() === sub.toLowerCase()), ii = IN.find(([nm]) => nm.toLowerCase() === sub.toLowerCase()); subH = hh ? hh[1] : 0; subI = !subH && ii ? ii[1] : 0; out.push({t: 's', s: sub, h: subH, i: subI}); return; }
    if (!bul) { out.push({t: 'p', s: txt}); return; }
    const low = txt.toLowerCase(); let hid = 0, iid = 0;
    const hh = HN.find(([nm]) => starts(low, nm)); let hnm = ''; if (hh) { hid = hh[1]; hnm = hh[0]; }
    if (!hid) { const ii = IN.find(([nm]) => starts(low, nm)); if (ii) iid = ii[1]; }
    if (!hid && !iid) { hid = subH; iid = subI; }
    out.push({t: 'l', s: txt, h: hid, hn: hnm, i: iid, k: hid || iid ? lineKind(txt) : (/\bfix/i.test(txt) ? 'f' : '')});
  });
  const nL = out.filter(x => x.t === 'l').length;
  return p._pp = {out, imgs, patch: nL >= 4 || p.source === 'forum', nL};
}
let MYST = null, MYST_ID = 0;
async function myStuff() {
  if (!ME) return null;
  if (MYST && MYST_ID === ME.id) return MYST;
  const [HS, H, IS] = await Promise.all([api('players/hero-stats?account_ids=' + ME.id).catch(() => []), api('players/' + ME.id + '/match-history').catch(() => []), api(`analytics/item-stats?account_id=${ME.id}&min_unix_timestamp=${now() - 45 * 86400 - (now() % 3600)}`).catch(() => [])]);
  const c = {}; H.filter(m => m.start_time >= now() - 45 * 86400).forEach(m => c[m.hero_id] = (c[m.hero_id] || 0) + 1);
  const heroes = new Set([...HS.slice().sort((a, b) => b.matches_played - a.matches_played).slice(0, 5).map(x => x.hero_id), ...Object.entries(c).filter(([, k]) => k >= 3).map(([h]) => +h)]);
  const items = new Set((IS || []).filter(s => item(s.item_id) && s.matches >= 3).map(s => s.item_id));
  MYST_ID = ME.id; return MYST = {heroes, items};
}
function lineHTML(x) {
  let s = esc(x.s);
  if (x.h) { const nm = x.hn || hero(x.h).n, re = new RegExp('^' + nm.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&').replace(/ /g, '\\s'), 'i'); s = s.replace(re, m => `<a class="q-hl" href="#h/${x.h}">${m}</a>`); }
  else if (x.i) { const nm = esc(item(x.i).n); if (s.toLowerCase().startsWith(nm.toLowerCase())) s = `<span class="q-hl">${s.slice(0, nm.length)}</span>${s.slice(nm.length)}`; }
  return `<div class="q-ln2 ${x.k || ''}">${s}</div>`;
}
const UPF = {q: '', mine: false, hero: 0};
async function viewUpd(sel) {
  const n = vNew();
  V(`<h1 class="h1">Обнов<em>ления</em></h1><p class="sub" style="margin:6px 0 12px">Патчноуты Deadlock — с форума разработчиков и из новостей Steam. Сверху — коротко, что поменяли твоим героям и предметам, ниже — весь текст.</p><div id="upw"><div class="load">Загружаю патчноуты…</div></div>`);
  let P;
  try { P = await apiU(API2 + 'patches'); } catch (e) { put(n, '#upw', `<div class="err">Не вышло: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  P = (P || []).slice().sort((a, b) => Date.parse(b.pub_date) - Date.parse(a.pub_date)).slice(0, 24);
  if (!P.length) { put(n, '#upw', '<div class="empty">Патчноутов нет.</div>'); return; }
  let i = sel != null && sel !== '' && P[+sel] ? +sel : P.findIndex(p => parsePatch(p).patch); if (i < 0) i = 0;
  UPF.hero = 0;
  const p = P[i], X = parsePatch(p), t = Math.floor(Date.parse(p.pub_date) / 1000);
  const lines = X.out.filter(x => x.t === 'l'), ch = {};
  lines.forEach(x => { if (!x.h) return; const o = ch[x.h] = ch[x.h] || {u: 0, d: 0, n: 0}; o.n++; if (x.k === 'u') o.u++; if (x.k === 'd') o.d++; });
  const heroesCh = Object.entries(ch).sort((a, b) => b[1].n - a[1].n);
  put(n, '#upw', `<div class="q-upl" id="upl">${P.map((x, k) => { const pp = parsePatch(x); return `<button class="${k === i ? 'on' : ''}" data-i="${k}"><em>${pp.patch ? 'Патч' : 'Новость'}</em><b>${esc(x.title || 'Без названия')}</b><small>${esc(dmy(Math.floor(Date.parse(x.pub_date) / 1000)))}</small></button>`; }).join('')}</div>
    <div class="q-uph"><h2>${esc(p.title || 'Обновление')}</h2><p>${esc(dmy(t))} · ${p.source === 'forum' ? 'форум разработчиков' : 'новости Steam'}${X.patch ? ` · ${X.nL} ${pl(X.nL, ['изменение', 'изменения', 'изменений'])}` : ''}${/^https:\/\//.test(p.link || '') ? ` · <a class="lnk" href="${esc(p.link)}" target="_blank" rel="noopener">оригинал ↗</a>` : ''}</p></div>
    ${X.patch ? `${heroesCh.length ? `<div class="q-sum" id="ush">${heroesCh.map(([h, o]) => `<button class="q-hc" data-h2="${h}" title="Показать только ${esc(hero(h).n)}"><img src="${esc(hero(h).i)}" alt="" loading="lazy" onerror="${noimg}">${esc(hero(h).n)}${o.u ? ` <span class="q-uu">▲${o.u}</span>` : ''}${o.d ? ` <span class="q-dd">▼${o.d}</span>` : ''}</button>`).join('')}</div>` : ''}
      <div class="q-box q-mine" id="umy">${ME ? '<div class="q-bh"><b>Для тебя</b><small>твои герои и предметы в этом патче</small></div><div class="load" style="padding:14px">Смотрю твоих героев и предметы…</div>' : '<div class="q-bh"><b>Для тебя</b></div><div class="empty">Найди себя в поиске сверху — покажу, что поменяли твоим героям и предметам.</div>'}</div>
      ${heroesCh.length && now() - t > 12 * 3600 ? '<div class="q-box" style="margin-top:14px" id="uwr"><div class="q-bh"><b>Винрейт до и после</b><small>неделя до патча и после, все ранги</small></div><div class="load" style="padding:14px">Считаю…</div></div>' : ''}
      <div class="q-box q-full"><div class="q-tools"><input id="uq" placeholder="Найти в патче: герой, предмет, слово" aria-label="Поиск по патчу" value="${esc(UPF.q)}">${ME ? `<label class="sub"><input type="checkbox" id="umn"${UPF.mine ? ' checked' : ''}> только мои</label>` : ''}<button class="btn s g hide" id="uclr" type="button">Сбросить героя</button></div><div id="ufull"></div>
        <div class="q-leg">▲ — похоже на усиление, ▼ — на ослабление, ✓ — исправление. Определяем по словам и цифрам «from … to …» — точный смысл в тексте.</div></div>`
    : `<div class="q-box" style="margin-top:14px"><div class="q-art2">${X.imgs[0] ? `<img src="${esc(X.imgs[0])}" alt="" loading="lazy">` : ''}${X.out.map(x => x.t === 'h' ? `<p><b>${esc(x.s)}</b></p>` : x.t === 'l' ? `<p>— ${esc(x.s)}</p>` : `<p>${esc(x.s)}</p>`).join('')}</div></div>`}`);
  $$('#upl button').forEach(b => b.onclick = () => { location.hash = '#upd/' + b.dataset.i; });
  if (!X.patch) return;
  let MY = null;
  const drawFull = () => {
    const q = UPF.q.toLowerCase(), my = UPF.mine && MY, filt = !!(q || UPF.hero || my), S = [];
    let cur = {h: '', it: []}; S.push(cur);
    X.out.forEach(x => {
      if (x.t === 'h') { cur = {h: x.s, it: []}; S.push(cur); return; }
      if (x.t === 's') { cur.it.push({t: 's', v: `<div class="q-ss">${x.h ? `<a class="q-hl" href="#h/${x.h}">${esc(x.s)}</a>` : esc(x.s)}</div>`}); return; }
      if (x.t === 'p') { if (!filt) cur.it.push({t: 'p', v: `<div class="q-pp">${esc(x.s)}</div>`}); return; }
      if (UPF.hero && x.h !== UPF.hero) return;
      if (my && !(MY.heroes.has(x.h) || MY.items.has(x.i))) return;
      if (q && !x.s.toLowerCase().includes(q)) return;
      cur.it.push({t: 'l', v: `<div class="q-lns">${lineHTML(x)}</div>`});
    });
    const html = S.map(sec => { let it = sec.it; if (filt) it = it.filter((y, k) => y.t !== 's' || (it[k + 1] && it[k + 1].t === 'l')); if (!it.some(y => y.t !== 's')) return ''; return (sec.h ? `<div class="q-sh">${esc(sec.h)}</div>` : '') + it.map(y => y.v).join(''); }).join('');
    put(n, '#ufull', html || '<div class="empty">Ничего не нашлось.</div>');
    const c = $('#uclr'); if (c) c.classList.toggle('hide', !UPF.hero);
    $$('#ush .q-hc').forEach(b => b.classList.toggle('on', +b.dataset.h2 === UPF.hero));
  };
  drawFull();
  const uq = $('#uq'); if (uq) uq.oninput = e => { UPF.q = e.target.value.trim(); drawFull(); };
  const um = $('#umn'); if (um) um.onchange = e => { UPF.mine = e.target.checked; drawFull(); };
  const uc = $('#uclr'); if (uc) uc.onclick = () => { UPF.hero = 0; drawFull(); };
  $$('#ush .q-hc').forEach(b => b.onclick = () => { UPF.hero = UPF.hero === +b.dataset.h2 ? 0 : +b.dataset.h2; drawFull(); const f = $('#ufull'); if (f) f.scrollIntoView({block: 'start', behavior: 'smooth'}); });
  if (ME) myStuff().then(M => {
    if (n !== VQ || !M) return; MY = M;
    const H = lines.filter(x => x.h && M.heroes.has(x.h)), I = lines.filter(x => x.i && M.items.has(x.i));
    const gH = {}, gI = {}; H.forEach(x => (gH[x.h] = gH[x.h] || []).push(x)); I.forEach(x => (gI[x.i] = gI[x.i] || []).push(x));
    const mood = L => { const u = L.filter(x => x.k === 'u').length, d = L.filter(x => x.k === 'd').length; return u > d ? 'g' : d > u ? 'c' : ''; };
    const sum = L => { const u = L.filter(x => x.k === 'u').length, d = L.filter(x => x.k === 'd').length; return [u ? `<span class="win">▲ ${u}</span>` : '', d ? `<span class="loss">▼ ${d}</span>` : ''].filter(Boolean).join(' · '); };
    put(n, '#umy', `<div class="q-bh"><b>Для тебя</b><small>${Object.keys(gH).length || Object.keys(gI).length ? 'твои герои и предметы в этом патче' : 'твоих героев и предметов этот патч не коснулся'}</small></div>
      ${Object.entries(gH).map(([h, L]) => `<div class="q-mc">${face(+h, mood(L), 'l')}<div style="min-width:0"><b><a class="q-hl" href="#h/${h}/me" style="color:inherit;text-decoration:none">${esc(hero(h).n)}</a> <small class="mu" style="font-weight:500">${sum(L)}</small></b>${L.map(lineHTML).join('')}</div></div>`).join('')}
      ${Object.entries(gI).map(([i2, L]) => `<div class="q-mc"><img class="q-it" src="${esc(item(i2).i)}" alt="" style="width:46px;height:46px"><div style="min-width:0"><b>${esc(item(i2).n)} <small class="mu" style="font-weight:500">твой предмет · ${sum(L)}</small></b>${L.map(lineHTML).join('')}</div></div>`).join('')}`);
    if (UPF.mine) drawFull();
  }).catch(() => put(n, '#umy', '<div class="empty">Не вышло посмотреть твоих героев.</div>'));
  if ($('#uwr')) {
    const h0 = t - (t % 3600), hb = h0 - 7 * 86400, ha = Math.min(now() - (now() % 3600), h0 + 7 * 86400);
    Promise.all([api(`analytics/hero-stats?min_unix_timestamp=${hb}&max_unix_timestamp=${h0}`), api(`analytics/hero-stats?min_unix_timestamp=${h0}&max_unix_timestamp=${ha}`)]).then(([B, A]) => {
      if (n !== VQ) return;
      const bb = {}, aa = {}; B.forEach(x => bb[x.hero_id] = x); A.forEach(x => aa[x.hero_id] = x);
      const R = heroesCh.map(([h]) => ({h: +h, b: bb[h], a: aa[h]})).filter(x => x.b && x.a && x.b.matches > 200 && x.a.matches > 200).map(x => ({h: x.h, wb: 100 * x.b.wins / x.b.matches, wa: 100 * x.a.wins / x.a.matches})).sort((a, b) => (b.wa - b.wb) - (a.wa - a.wb));
      put(n, '#uwr', `<div class="q-bh"><b>Винрейт до и после</b><small>неделя до патча и ${now() - h0 < 7 * 86400 ? 'с патча до сейчас' : 'неделя после'}, все ранги</small></div><div class="q-wr">${R.map(x => { const d = x.wa - x.wb; return `<div>${face(x.h, d >= 1 ? 'g' : d <= -1 ? 'c' : '', 's')}<span>${esc(hero(x.h).n)}${MY && MY.heroes.has(x.h) ? ' · твой' : ''}</span><em>${f1(x.wb)}% → <b class="${d >= .5 ? 'win' : d <= -.5 ? 'loss' : ''}">${f1(x.wa)}%</b></em></div>`; }).join('') || '<div class="empty" style="grid-column:1/-1">Мало матчей для сравнения.</div>'}</div>`);
    }).catch(() => put(n, '#uwr', '<div class="empty">Не вышло посчитать винрейт.</div>'));
  }
}

// ---------- про: турниры, новости и игры топов ----------
async function viewPro() {
  const n = vNew();
  V(`<h1 class="h1">Про-<em>сцена</em></h1>
    <p class="sub" style="margin:6px 0 14px">Игры верхушки официального топа, новости игры и турниры. Каждый матч открывается в полный разбор.</p>
    <div class="q-g2"><div class="q-box"><div class="q-bh"><b>Турниры</b><small>расписание, сетки, результаты</small></div><div class="pad"><p class="sub" style="margin:0 0 12px">Турниры по Deadlock собирает Liquipedia — открытая база киберспорта, её ведёт сообщество.</p><a class="btn s" href="https://liquipedia.net/deadlock/Main_Page" target="_blank" rel="noopener">Турниры на Liquipedia ↗</a></div></div>
      <div class="q-box"><div class="q-bh"><b>Новости игры</b><small>из Steam и с форума</small><span class="sp"></span><a class="lnk" href="#upd">Все обновления ›</a></div><div class="pad q-nw" id="pnews"><div class="load">…</div></div></div></div>
    <div class="q-sec"><b>Топ Европы</b><small>первые 10 официального лидерборда</small></div><div class="card pad" id="ptop"><div class="load">Загружаю…</div></div>
    <div class="q-sec"><b>Последние про-матчи</b><small>во что играют лучшие прямо сейчас · оценка — та же, что в профиле</small></div><div class="card" id="pmt"><div class="load">Смотрю истории матчей топов…</div></div>`);
  apiU(API2 + 'patches').then(P => { if (n !== VQ) return; const L = (P || []).slice().sort((a, b) => Date.parse(b.pub_date) - Date.parse(a.pub_date)).slice(0, 24);
    put(n, '#pnews', L.slice(0, 6).map((x, k) => `<a href="#upd/${k}"><b>${esc(x.title || 'Без названия')}</b><small>${esc(dmy(Math.floor(Date.parse(x.pub_date) / 1000)))}</small></a>`).join('') || '<div class="empty">Новостей нет.</div>'); }).catch(e => put(n, '#pnews', `<div class="err">${esc(e.message)}</div>`));
  try {
    const L = await api('leaderboard/Europe'); if (n !== VQ) return;
    const E = (L.entries || []).slice(0, 10);
    put(n, '#ptop', `<div class="pg">${E.map((e, i) => { const one = (e.possible_account_ids || []).length === 1 ? e.possible_account_ids[0] : null;
      return `<div class="pc${one ? ' lk' : ''}"${one ? ` role="link" tabindex="0" title="Открыть профиль" onclick="location.href='?id=${+one}#home'" onkeydown="if(event.key==='Enter')this.click()"` : ''}><b class="mono">#${i + 1}</b><span>${esc(e.account_name || 'Скрытый игрок')}<small class="rkc" data-acc="${one || ''}">${one ? '…' : 'аккаунт не определён'}</small></span><div class="his">${(e.top_hero_ids || []).slice(0, 3).map(h => `<a href="#h/${h}" title="${esc(hero(h).n)}" onclick="event.stopPropagation()">${heroImg(h, 's')}</a>`).join('')}</div></div>`; }).join('')}</div>`);
    lbRanks();
    const six = (L.entries || []).filter(e => (e.possible_account_ids || []).length === 1).slice(0, 6);
    const HS2 = await Promise.all(six.map(e => api('players/' + e.possible_account_ids[0] + '/match-history').catch(() => []))); if (n !== VQ) return;
    const rows = []; HS2.forEach((H, i) => (H || []).slice(0, 4).forEach(m => rows.push({p: six[i], m})));
    rows.sort((a, b) => b.m.start_time - a.m.start_time);
    const seen = new Set(), U = rows.filter(r => !seen.has(r.m.match_id) && seen.add(r.m.match_id)).slice(0, 12);
    const PRO = {}; (L.entries || []).slice(0, 100).forEach((e, k) => { if ((e.possible_account_ids || []).length === 1) PRO[e.possible_account_ids[0]] = {k: k + 1, nm: e.account_name}; });
    put(n, '#pmt', '<div class="load">Тяну составы обеих команд…</div>');
    await metaLite(U.map(r => r.m.match_id)); if (n !== VQ) return;
    const MM = U.map(r => ML.get(r.m.match_id)).filter(Boolean);
    await steamNames(MM.flatMap(m => m.players.map(p => p.account_id))); if (n !== VQ) return;
    PROM = {MM, PRO, h: 0}; drawProM(n);
  } catch (e) { put(n, '#ptop', `<div class="err">${esc(e.message)}</div>`); }
}

// ранги игроков топа — пачкой (в лидерборде самой игры ранга нет, только место)
async function lbRanks() {
  const ids = [...new Set($$('.rkc[data-acc]').map(c => +c.dataset.acc).filter(Boolean))];
  for (let i = 0; i < ids.length; i += 100) {
    const R = await api('players/rank?account_ids=' + ids.slice(i, i + 100).join(',')).catch(() => []), M = {};
    (R || []).forEach(r => M[r.account_id] = r.badge);
    $$('.rkc[data-acc]').forEach(c => { const b = M[+c.dataset.acc]; if (b != null && !c.dataset.ok) { c.dataset.ok = 1; c.innerHTML = `${rankImg(b)}<span>${esc(rankOf(b).name)}</span>`; } });
  }
}
// ---------- без игрока ----------
async function viewLanding() {
  const n = vNew();
  V(`<section class="land q-land">
      <h1 class="h1">Твой Deadlock — <em>как на ладони</em></h1>
      <p>Профиль игрока за минуту, разбор каждого матча, лайв-матч, сборки и патчи — по-русски. Входить в Steam не нужно.</p>
      <form id="lf"><input id="lq" placeholder="Ссылка на профиль Steam, ник или ID" autocomplete="off" aria-label="Игрок"><button class="btn" type="submit">Найти себя</button></form>
      <div class="ex">Или посмотри на примере: <button id="lx" type="button">топ-1 Европы</button></div>
      <div class="art">${[65, 84, 79].map(id => `<img src="art/${id}.webp" alt="" onerror="this.remove()">`).join('')}</div>
    </section>
    <div class="g4 feat" style="margin-top:14px">
      <a class="card" href="#live"><b>Лайв-матч</b><span>Найди игрока по нику — его матч: ранги, пати, мейны, серии, главная угроза.</span></a>
      <a class="card" href="#meta"><b>Герои</b><span>Кто сейчас сильный и с какой сборкой.</span></a>
      <a class="card" href="#lb"><b>Лидеры</b><span>Официальный топ по регионам — найдёшь себя, докрутит к твоей строке.</span></a>
      <a class="card" href="#upd"><b>Патчи</b><span>Кого усилили и ослабили — иконками.</span></a>
    </div>
    <div class="q-sec"><b>Сейчас сильнее всех</b><small>${esc(fName())}</small></div><div class="card" id="top5"><div class="load" style="padding:18px">Считаю мету…</div></div>`);
  $('#lf').onsubmit = async e => { e.preventDefault(); const q = $('#lq').value.trim(), id = idFrom(q); if (id) { await setMe(id); location.hash = '#home'; route(); } else { $('#sq').value = q; $('#sq').focus(); $('#sq').dispatchEvent(new Event('input')); } };
  $('#lx').onclick = exampleTop;
  try {
    const M = await heroStats(); if (n !== VQ) return;
    const L = Object.values(M).filter(x => x.pr >= 1.5).sort((a, b) => b.wr - a.wr).slice(0, 6);
    put(n, '#top5', `<div class="pool">${L.map(x => `<a href="#h/${x.id}">${face(x.id, 'g', 'm')}<span style="min-width:0"><b>${esc(hero(x.id).n)}</b><small>${esc(TYPE_RU[hero(x.id).ty] || '')} · в ${f1(x.pr)}% матчей</small></span><span class="bar"><i style="width:${x.wr}%;background:var(--win)"></i></span><span class="wr win">${f1(x.wr)}%</span></a>`).join('')}</div>`);
  } catch (e) { put(n, '#top5', `<div class="err">${esc(e.message)}</div>`); }
}

// имя игрока догрузилось — обновить переключатель «ты / все игроки»
{ const pm0 = paintMe; paintMe = function () { pm0(); if (ME) $$('.q-sw [data-m="me"] span').forEach(s => s.textContent = ME.name); }; }
// ---------- логотип: буквы по одной ----------
(() => { const w = $('.q-lw'); if (w) w.innerHTML = [...'RESTLESS'].map((c, i) => `<i style="--i:${i}" aria-hidden="true">${c}</i>`).join(''); })();

// ---------- навигация ----------
function route() {
  vNew(); clearInterval(LVT);
  const h = location.hash.replace(/^#/, '') || 'home';
  const [t, a, b] = h.split('/');
  if (t === 'matches') { location.replace('#home'); return; }
  const tab = {m: 'home', h: b === 'me' ? 'home' : 'meta', who: 'home', profile: 'home', form: 'home', mine: 'home', now: 'live', top: 'lb', leaderboard: 'lb', heroes: 'meta', builds: 'meta', b: 'meta'}[t] || t;
  $$('#tabs a').forEach(x => x.classList.toggle('on', x.dataset.t === tab));
  $('#v').onclick = null;
  window.scrollTo(0, 0);
  if (t === 'live' || t === 'now') return viewLive(a);
  if (t === 'form') return viewStats(a || '');
  if (t === 'mine') return viewMine();
  if (t === 'meta') return viewMeta();
  if (t === 'lb' || t === 'top' || t === 'leaderboard') return viewLb2();
  if (t === 'pro') return viewPro();
  if (t === 'upd') return viewUpd(a);
  if (t === 'heroes' || t === 'builds') return viewHeroes();
  if ((t === 'h' || t === 'b') && a) return viewHero(a, b);
  if (t === 'm' && a) return viewMatch2(a, b);
  return viewHome();
}
