// ===================== lg16 — 03.11, ночь: рейтинг героя как в League of Graphs (не только по рангу) =====================
// Правила — с их же страницы «How are players ranked?» (скрин Андрея 03.11):
//   два счёта — за сезон и за 30 дней, сезон весит 3/4;
//   +1 тир → ×5 (тир игры — средний тир врагов, каждая игра отдельно);
//   винрейт в 1,5 раза выше среднего по чемпиону → ×2; KDA вдвое выше среднего → ×3;
//   винрейт и KDA, набранные тиром ниже, весят меньше: каждый тир вниз — ×0,6;
//   флекс (у нас — обычные, не ранговые игры) = 0,4 игры;
//   минимум 20 игр; от 20 до 80 — счёт снижается на число недостающих до 80 (у нас: на столько же процентов);
//   нужна ранговая игра за 30 дней; меньше 5 игр за 30 дней → ×0,5 за каждую недостающую.
// Что у нас иначе (данных нет — честно):
//   сезон в Deadlock перезапустился 02.11 → вместо сезона 90 дней;
//   средний тир врагов по играм открыто не отдают → тир = ранг игрока за период (очки ранга Valve, ≈7000 на тир; подбор по рангу — близко);
//   «тир вниз» считаем от Eternus; KDA за 30 дней — тот же, что за 90 (третий набор запросов не тянем).
// Очки на экране — в «тысячах на тир»: тир выше = +1000, винрейт ×1,5 = +431 (на Eternus), KDA ×2 = +683.
// Пул — топ-1500 по рангу среди 20+ игр на герое; ниже место по рангу (`ap`) — бонусы не перетянут через тир.
const HL_POOL = 1500, HL_TOP = 300, HL_TIER = 7000, HL_EM = 11, HL_LN5 = Math.log(5);
const HLP = {}, HRL = {}; // HLP[герой] = {n, p} — пул считается до n по рангу; больше не нужно — не тянем
let HAVG = null;
const hlT90 = () => now() - HL_DAYS * 86400 - (now() % 86400), hlT30 = () => now() - 30 * 86400 - (now() % 86400);
// средний винрейт и KDA героя за 90 дней (все ранги) — с ним сравниваем, как LoG со средним по чемпиону
const heroAvg = () => HAVG || (HAVG = api('analytics/hero-stats?min_unix_timestamp=' + hlT90()).then(L => {
  const M = {}; (L || []).forEach(h => { if (h.matches) M[h.hero_id] = {wr: 100 * h.wins / h.matches, kda: (h.total_kills + h.total_assists) / Math.max(1, h.total_deaths)}; }); return M;
}).catch(() => ({})));
// счёт одного окна (натуральный логарифм): тир ×5, винрейт 1,5× → ×2, KDA 2× → ×3; бонусы весят 0,6 за каждый тир ниже Eternus
function hlS(V, wr, kda, A) {
  const T = V / HL_TIER + 1, sc = Math.pow(.6, Math.max(0, HL_EM - T));
  const rw = Math.max(.5, Math.min(2, wr / Math.max(1, A.wr))), rk = Math.max(.25, Math.min(4, kda / Math.max(.1, A.kda)));
  return T * HL_LN5 + sc * (Math.log(2) * Math.log(rw) / Math.log(1.5) + Math.log(3) * Math.log(rk) / Math.log(2));
}
function hlPool(hid, n) {
  n = n || HL_TOP; const c = HLP[hid]; if (c && c.n >= n) return c.p;
  const p = (async () => {
    const L = (await SBQ(`${HLQ(hid)}&start=1&limit=${n}`)) || []; if (!L.length) return [];
    // account_ids — пачками по 300 (длина адреса), ответы складываем в одну карту
    const parts = []; for (let i = 0; i < L.length; i += 300) parts.push(L.slice(i, i + 300).map(x => x.account_id).join(','));
    const one = async (s, t, rk) => { const M = new Map(); for (const ids of parts) { const R = await SBQ(`hero_id=${hid}&sort_by=${s}&min_matches=1&min_unix_timestamp=${t}${rk ? '&match_mode=ranked' : ''}&account_ids=${ids}&limit=300`).catch(() => []); (R || []).forEach(x => M.set(x.account_id, x)); } return M; };
    const [WR, K, De, As, R30, W30, G90r, G30r, AV] = await Promise.all([one('winrate', hlT90()), one('avg_kills_per_match', hlT90()), one('avg_deaths_per_match', hlT90()), one('avg_assists_per_match', hlT90()),
      one('rank', hlT30()), one('winrate', hlT30()), one('matches', hlT90(), 1), one('matches', hlT30(), 1), heroAvg()]);
    const A = AV[hid] || {wr: 50, kda: 3}, noR = !G90r.size && !G30r.size;   // ранговые не отдались — считаем все игры ранговыми, чем выкинуть всех
    const P = L.map(x => {
      const id = x.account_id, g = x.matches || 0, r30 = R30.get(id), g30 = r30 ? r30.matches || 0 : 0;
      const gr = noR ? g : (G90r.get(id) || {}).matches || 0, gr30 = noR ? g30 : (G30r.get(id) || {}).matches || 0;
      const gw = gr + .4 * Math.max(0, g - gr), gw30 = gr30 + .4 * Math.max(0, g30 - gr30);   // обычная игра = 0,4 ранговой
      const wr = 100 * ((WR.get(id) || {}).value || 0), k = (K.get(id) || {}).value || 0, d = (De.get(id) || {}).value || 0, a = (As.get(id) || {}).value || 0, kda = (k + a) / Math.max(1, d);
      const e = {aid: id, V: x.value, g, gw, wr, kda, g30, gw30, gr30, badge: x.badge};
      if (!gr30) { e.idle = 1; return e; }              // нет ранговой игры за 30 дней
      if (gw < HL_MIN) { e.few = 1; return e; }         // меньше 20 игр с учётом 0,4 за обычные
      const wr30 = 100 * ((W30.get(id) || {}).value || 0);
      const s90 = hlS(x.value, wr, kda, A), s30 = hlS(r30.value || x.value, wr30 || wr, kda, A);
      let S = .75 * s90 + .25 * s30;
      if (gw < 80) S += Math.log(Math.max(.2, 1 - (80 - gw) / 100));          // от 20 до 80 игр — минус столько же процентов
      if (gw30 < 5) S += Math.log(.5) * (5 - gw30);                             // меньше 5 игр за 30 дней — ×0,5 за каждую
      e.S = S; e.R = Math.round(1000 * S / HL_LN5); e.wr30 = wr30;
      return e;
    });
    const live = P.filter(e => !e.idle && !e.few).sort((p, q) => q.S - p.S); live.forEach((e, i) => { e.pos = i + 1; });
    P.avg = A; return P;
  })().catch(() => []);
  HLP[hid] = {n, p}; return p;
}
// строки топа по очкам (start — с 1), пул кончился — дальше по рангу, как раньше
async function hlRows(hid, start, n) {
  const c = HLP[hid], P = await hlPool(hid, Math.max(c ? c.n : 0, start + n - 1 > HL_TOP ? HL_POOL : HL_TOP)), live = P.filter(e => e.pos).sort((p, q) => p.pos - q.pos);
  if (start + n - 1 <= live.length) return live.slice(start - 1, start - 1 + n).map(e => ({rank: e.pos, account_id: e.aid, matches: e.g, badge: e.badge, R: e.R, wr: e.wr, kda: e.kda}));
  const L = (await SBQ(`${HLQ(hid)}&start=${start}&limit=${n}`).catch(() => [])) || [];
  return L.map(x => ({rank: Math.max(x.rank, live.length + 1), account_id: x.account_id, matches: x.matches, badge: x.badge, ap: 1}));
}
{ const HR0 = heroRating; heroRating = function (hid, id) {
    const k = hid + '|' + id; if (HRL[k]) return HRL[k];
    return (HRL[k] = (async () => {
      const r0 = await HR0(hid, id).catch(() => null); let w = r0;
      // по рангу в топ-1500 — считаем очки и точное место; ниже — место по рангу (оно и так за топ-1000)
      if (r0 && r0.pos && r0.pos <= HL_POOL) {
        const P = await hlPool(hid, HL_POOL), e = P.find(x => x.aid === id);
        if (e) w = e.idle ? {pos: 0, why: 'idle', m: e.g} : e.few ? {pos: 0, why: 'few', m: Math.floor(e.gw)} : {pos: e.pos, v: e.R, m: e.g, badge: e.badge, sc: e, lg: 1};
        else w = Object.assign({}, r0, {pos: Math.max(r0.pos, P.filter(x => x.pos).length + 1), ap: 1});
      } else if (r0 && r0.pos) w = Object.assign({}, r0, {ap: 1});
      if (w && w.pos) w.tot = await heroTotal(hid).catch(() => 0);
      // мало игр и при этом нет ранга — сказать обе вещи сразу
      if (w && w.why === 'few') { const rk = await api('players/rank?account_ids=' + id).then(L => L && L[0]).catch(() => null); if (rk && !rk.badge) w.nr = 1; }
      return w;
    })());
  }; }
// как считаем — раскрывашкой, по правилам League of Graphs
function hlHow(hid) {
  return `<details class="l16-how"><summary>Как считаем — как League of Graphs</summary><ul>
    <li><b>Ранг</b> — главное: тир выше = ×5 к очкам</li>
    <li><b>Винрейт</b> на ${esc(hero(hid).n)} в 1,5 раза выше среднего = ×2</li>
    <li><b>KDA</b> вдвое выше среднего = ×3</li>
    <li>Чем ниже ранг, тем меньше весят винрейт и KDA: каждый тир ниже Eternus — ×0,6</li>
    <li>Обычная игра = 0,4 ранговой</li>
    <li>Нужно 20+ игр за ${HL_DAYS} дней и ранговая за 30 дней. До 80 игр — небольшой штраф; меньше 5 за 30 дней — ×0,5 за каждую</li>
    <li>Два счёта — за ${HL_DAYS} дней (вместо сезона: он перезапустился 2 ноября) и за 30 дней, 90 дней весят 3/4</li></ul></details>`;
}

// ---------- топ мира на странице героя: по очкам рейтинга, с винрейтом и KDA ----------
l14Ladder = async function (n, hid) {
    const g = $('#hst'); if (!g || $('#l14lb')) return;
    g.insertAdjacentHTML('afterend', `<section class="l14-lad"><div class="q-sec"><b>Рейтинг героя · топ мира</b></div>
      <div class="q-box l14-lb" id="l14lb"><div class="load" style="padding:14px">Считаю топ…</div></div></section>`);
    const L = await hlRows(hid, 1, 10).catch(() => []); if (n !== VQ) return;
    await steamNames(L.map(x => x.account_id)); if (n !== VQ) return;
    L.forEach(x => rkPts(x.account_id));
    const row = (x, mine) => `<a data-aid="${x.account_id}" class="l14-r l16-r${mine ? ' mine' : ''}${x.rank <= 3 ? ' p' + x.rank : ''}${x.rank > 5 && !mine ? ' l14-x' : ''}" href="#h/${hid}/p${x.account_id}"><span class="l14-n">${x.rank <= 3 ? ['', '🥇', '🥈', '🥉'][x.rank] : '#' + nf(x.rank)}</span>${(SN[x.account_id] || {}).av ? `<img class="l14-av" src="${esc(SN[x.account_id].av)}" alt="" loading="lazy">` : '<i class="l14-av"></i>'}<b>${esc((SN[x.account_id] || {}).n || 'Скрытый игрок')}</b><span class="l14-rk">${rankImg(x.badge, 'rk')}<small>${esc(rankOf(x.badge).name)}</small></span><span class="l16-st"><b class="${x.wr >= 55 ? 'win' : x.wr <= 47 ? 'loss' : ''}">${x.wr != null ? f1(x.wr) + '%' : '—'}</b><small>KDA ${x.kda != null ? f1(x.kda) : '—'} · ${nf(x.matches)} ${pl(x.matches, ['игра', 'игры', 'игр'])}</small></span><span class="l16-pt" title="Очки рейтинга: ранг + бонусы за винрейт и KDA − штрафы">${x.R ? nf(x.R) : ''}</span><span class="l14-go">›</span></a>`;
    const html = L.length ? L.map(x => row(x, ME && x.account_id === ME.id)).join('') + (L.length > 5 ? '<button type="button" class="l14-more" id="l14more">Ещё 5 ›</button>' : '') : '<div class="empty">Пока никого: нужны ранг, 20+ игр на герое за 90 дней и игра за последние 30.</div>';
    put(n, '#l14lb', html + (ME ? '<div class="l14-me" id="l14me"><small>Ты · считаю место…</small></div>' : ''));
    { const mb = $('#l14more'); if (mb) mb.onclick = () => { $('#l14lb').classList.add('open'); mb.remove(); }; }
    if (!ME || L.some(x => x.account_id === ME.id)) { const m = $('#l14me'); if (m && L.some(x => x.account_id === ME.id)) m.remove(); return; }
    const o = await hrkGet(hid, ME.id, ME.name).catch(() => null); if (n !== VQ) return;
    const m = $('#l14me'); if (!m) return;
    const e = o && o.w && o.w.sc;
    const hb = o && hrBig(o.w, o.tot);
    m.innerHTML = hb ? `<b>Ты · ${hb.t} ${hb.ex ? 'в мире' : 'на герое'}</b><small>${e ? `${nf(e.R)} очков · ${f1(e.wr)}% побед · KDA ${f1(e.kda)} · ` : ''}${esc(hrNext(o.w))} · ${o.r ? `${esc(RGS[o.rg] || o.rg)} #${o.r.pos}` : `${esc(RGS[o.rg] || o.rg)} — вне топ-1000`}</small>`
      : `<b>Ты · вне рейтинга</b><small>${esc(hrWhy(o && o.w))}</small>`;
};
