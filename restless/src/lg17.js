// ===================== lg17 — 04.11: рейтинг героя из готовых таблиц (как League of Graphs) =====================
// Считает конвейер раз в сутки (tools/hr_build.py, GitHub Actions → ветка hr-data): тир каждой игры — средний ранг ВРАГОВ
// (ранговая — по рангам в матче, обычная — по рангам врагов на их аккаунтах), обычная игра = 0,4, 20+ игр, игра за 14 дней.
// Сайт только читает таблицу героя: место у всех в рейтинге, без «считаю…». Таблицы нет (GitHub недоступен) — старый расчёт (lg16).
const HRD_URL = 'https://raw.githubusercontent.com/1f8t8graf4-ai/dota-/hr-data/hr/', HRD = {};
const HR_LD = 45, HR_SD = 14;        // окна конвейера: «всё, что есть в базе» (около месяца) и последние 14 дней
function hrData(hid) {
  if (HRD[hid]) return HRD[hid];
  return (HRD[hid] = fetch(HRD_URL + hid + '.json').then(r => r.ok ? r.json() : null).then(d => {
    if (!d || !Array.isArray(d.id) || !d.id.length) return null;
    d.at = new Map(d.id.map((a, i) => [a, i])); HRD[hid].v = d; return d;
  }).catch(() => null));
}
const hrRow = (d, i) => ({pos: i + 1, v: d.p[i], m: Math.round(d.g[i]), badge: d.b[i], lg: 1, tot: d.n, dt: d.t,
  sc: {R: d.p[i], wr: d.wr[i], kda: d.kda[i], et: d.et[i], r: d.r[i], g: d.g[i]}});
// не в таблице (меньше 20 игр) — 04.11, Андрей: «убери ограничение в 20 игр, если вошёл в топ-100 тысяч мира».
// Один SQL на все герои игрока (~10 с, ответ помним 6 ч): те же правила, недостающие до 20 игры считаем средними,
// место — по гистограмме очков всех, кто играл героя за 14 дней (`hk`/`hn` в таблице героя). Показываем «~#N», если N ≤ 100 000.
const HR_TOPALL = 100000, HRQC = {};
const hrQSql = id => `WITH R AS (SELECT account_id, arg_max(player_rank_initial_display_rank, start_time) rk FROM match_player WHERE start_time > now() - INTERVAL ${HR_LD} DAY AND match_mode='Ranked' AND player_rank_initial_display_rank > 0 GROUP BY 1),
m AS (SELECT match_id, hero_id, team, match_mode='Ranked' AS r, (team=winning_team)::INT w, kills k, deaths d, assists a, start_time > now() - INTERVAL ${HR_SD} DAY AS s, CASE WHEN match_mode='Ranked' THEN 1.0 ELSE 0.4 END wt FROM match_player WHERE start_time > now() - INTERVAL ${HR_LD} DAY AND account_id=${+id} AND match_mode IN ('Ranked','Unranked')),
er AS (SELECT match_id, team, avg(floor(player_rank_initial_display_rank/10) + (player_rank_initial_display_rank%10 - 1)/6.0) t FROM match_player WHERE start_time > now() - INTERVAL ${HR_LD} DAY AND match_mode='Ranked' AND player_rank_initial_display_rank > 0 AND match_id IN (SELECT match_id FROM m WHERE r) GROUP BY 1,2),
eu AS (SELECT p.match_id, p.team, avg(floor(R.rk/10) + (R.rk%10 - 1)/6.0) t FROM match_player p JOIN R ON R.account_id = p.account_id WHERE p.start_time > now() - INTERVAL ${HR_LD} DAY AND p.match_mode='Unranked' AND p.match_id IN (SELECT match_id FROM m WHERE NOT r) GROUP BY 1,2),
g AS (SELECT m.*, coalesce(er.t, eu.t) et FROM m LEFT JOIN er ON er.match_id = m.match_id AND er.team <> m.team LEFT JOIN eu ON eu.match_id = m.match_id AND eu.team <> m.team)
SELECT hero_id h, sum(wt) gw, sum(wt*w) ww, sum(wt*k) kw, sum(wt*d) dw, sum(wt*a) aw, sum(wt*et) FILTER (WHERE et IS NOT NULL) tw, sum(wt) FILTER (WHERE et IS NOT NULL) tc,
 coalesce(sum(wt) FILTER (WHERE s), 0) gs, coalesce(sum(wt*w) FILTER (WHERE s), 0) ws, sum(wt*et) FILTER (WHERE s AND et IS NOT NULL) ts, sum(wt) FILTER (WHERE s AND et IS NOT NULL) tcs, count(*) FILTER (WHERE s) ns FROM g GROUP BY 1`;
function hrQuick(id) {
  if (HRQC[id]) return HRQC[id];
  const K = 'rl-hrq-' + id;
  try { const c = JSON.parse(localStorage.getItem(K) || 'null'); if (c && c.t > Date.now() - 6 * 3600e3) return (HRQC[id] = Promise.resolve(c.L)); } catch (e) {}
  return (HRQC[id] = (async () => {
    for (let i = 0; i < 3; i++) {
      try { const r = await fetch('https://api.deadlock-api.com/v1/sql?query=' + encodeURIComponent(hrQSql(id))); if (r.ok) { const L = await r.json(); if (Array.isArray(L)) { try { localStorage.setItem(K, JSON.stringify({t: Date.now(), L})); } catch (e) {} return L; } } } catch (e) {}
      await new Promise(f => setTimeout(f, 4000 * (i + 1)));
    }
    delete HRQC[id]; return null;
  })());
}
// счёт как в tools/hr_build.py (HIST): окно — тир ×5, винрейт 1,5× → ×2, KDA 2× → ×3, ×0,6 за тир ниже Eternus
const hrWin = (T, wr, kda, A) => T * Math.log(5) + Math.pow(.6, Math.max(0, 11 - T)) * (Math.log(2) * Math.log(Math.min(2, Math.max(.5, wr / A.wr))) / Math.log(1.5) + Math.log(3) * Math.log(Math.min(4, Math.max(.25, kda / A.kda))) / Math.log(2));
function hrPts(x, d) {
  const A = {wr: d.avg.wr / 100, kda: d.avg.kda}, MG = HL_MIN, gw = x.gw, f = Math.max(0, MG - gw), T = x.tw / x.tc, Ts = x.tcs ? x.ts / x.tcs : T;
  const wr = (x.ww + f * A.wr) / Math.max(gw, MG), kda = ((x.kw + x.aw) / Math.max(1, x.dw) * Math.min(gw, MG) + f * A.kda) / Math.max(gw, MG);
  const wrs = x.gs > 0 ? (x.ws + f * A.wr) / (x.gs + f) : wr;
  let S = .75 * hrWin(T, wr, kda, A) + .25 * hrWin(Ts, wrs, kda, A);
  if (gw < 80) S += Math.log(Math.max(.2, 1 - (80 - gw) / 100));
  if (x.gs < 5) S += Math.log(.5) * (5 - x.gs);
  return Math.round(1000 * S / Math.log(5));
}
// место среди всех по гистограмме: выше — все корзины старше, плюс часть своей
function hrAllPos(d, p) {
  const k0 = Math.floor(p / 10); let up = 0;
  for (let i = 0; i < d.hk.length; i++) { if (d.hk[i] > k0) up += d.hn[i]; else if (d.hk[i] === k0) up += d.hn[i] * (1 - (p - k0 * 10) / 10); }
  return Math.max(1, Math.round(up) + 1);
}
async function hrMiss(hid, id, d) {
  const L = await hrQuick(id), x = L && L.find(r => r.h === hid);
  if (!L) {    // SQL не ответил — как раньше, по scoreboard
    const day = now() - (now() % 86400), q = (t, rk) => SBQ(`hero_id=${hid}&sort_by=matches&min_matches=1&min_unix_timestamp=${t}&account_ids=${id}${rk ? '&match_mode=ranked' : ''}`).then(R => ((R || [])[0] || {}).matches || 0).catch(() => 0);
    const [g, r, s] = await Promise.all([q(day - HR_LD * 86400), q(day - HR_LD * 86400, 1), q(day - HR_SD * 86400)]), gw = r + .4 * Math.max(0, g - r);
    return !g ? {pos: 0, why: 'few', m: 0, ld: 1} : !s ? {pos: 0, why: 'idle', m: g, sd: HR_SD} : gw < HL_MIN ? {pos: 0, why: 'few', m: Math.floor(gw), ld: 1} : {pos: 0, why: 'soon', m: Math.floor(gw)};
  }
  if (!x) return {pos: 0, why: 'few', m: 0, ld: 1};
  if (!x.ns) return {pos: 0, why: 'idle', m: Math.round(x.gw), sd: HR_SD};
  if (x.gw >= HL_MIN) return {pos: 0, why: 'soon', m: Math.floor(x.gw)};
  if (!x.tc || !d.hk) return {pos: 0, why: 'few', m: Math.floor(x.gw), ld: 1};
  const p = hrPts(x, d), pos = hrAllPos(d, p);
  if (pos > HR_TOPALL) return {pos: 0, why: 'few', m: Math.floor(x.gw), ld: 1, ap: pos};
  return {pos, apx: 1, v: p, m: Math.floor(x.gw), tot: d.all, lg: 0, sc: {R: p, wr: 100 * x.ww / x.gw, kda: (x.kw + x.aw) / Math.max(1, x.dw), et: x.tw / x.tc, g: x.gw}};
}
{ const HR1 = heroRating; heroRating = function (hid, id) {
    const k = 'd' + hid + '|' + id; if (HRL[k]) return HRL[k];
    return (HRL[k] = (async () => {
      const d = await hrData(hid); if (!d) return HR1(hid, id);
      const i = d.at.get(+id);
      return i != null ? hrRow(d, i) : hrMiss(hid, id, d);
    })());
  }; }
{ const HL1 = hlRows; hlRows = async function (hid, start, n) {
    const d = await hrData(hid); if (!d) return HL1(hid, start, n);
    const L = []; for (let i = start - 1; i < Math.min(d.n, start - 1 + n); i++) L.push({rank: i + 1, account_id: d.id[i], matches: Math.round(d.g[i]), badge: d.b[i], R: d.p[i], wr: d.wr[i], kda: d.kda[i]});
    return L;
  }; }
{ const HT1 = heroTotal; heroTotal = hid => hrData(hid).then(d => d ? d.n : HT1(hid)); }
// «Как считаем» убрано (Андрей, 04.11: «убери всякие объяснения и впредь не добавляй»)
hlHow = () => '';
function hrDate(hid) { const d = HRD[hid] && HRD[hid].v; return d && d.t ? ' · последний — ' + new Date(d.t * 1000).toLocaleString('ru-RU', {day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'}) : ''; }
