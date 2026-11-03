// ===================== lg16 — 03.11, ночь: рейтинг героя как в League of Graphs (не только по рангу) =====================
// Андрей: «суди не только по рангу — как в League of Graphs». У них очки игрока на чемпионе:
//   ранг (средний тир игр) — ×4 за каждый тир выше; винрейт на 12 % выше среднего по чемпиону — ×2; KDA вдвое выше среднего — ×1,33;
//   правила экспоненциальные; меньше 50 игр — штраф; нужна хоть одна игра за 30 дней, меньше 5 за 30 дней — штраф;
//   считают два счёта — за сезон и за 30 дней — и берут среднее геометрическое.
// У нас то же в очках ранга Valve (≈1000 очков на ступень, 7000 на тир): ×4 = +1 тир = +7000, ×2 = +3500, ×1,33 = +1440.
//   Окна: 90 дней (вместо сезона) и 30 дней. Пул — топ-300 по рангу среди 20+ игр на герое: выше в рейтинг никто из-за пределов не попадёт
//   (бонусы стоят меньше тира). За пределами пула место — по рангу (`ap`), как раньше.
const HL_POOL = 300, HL_TIER = 7000, HL_K = HL_TIER * Math.log(1.33) / Math.log(4);
const HLP = {}, HRL = {};
let HAVG = null;
const hlT90 = () => now() - HL_DAYS * 86400 - (now() % 86400), hlT30 = () => now() - 30 * 86400 - (now() % 86400);
// средний винрейт и KDA героя за 90 дней (все ранги) — с ним сравниваем, как LoG со средним по чемпиону
const heroAvg = () => HAVG || (HAVG = api('analytics/hero-stats?min_unix_timestamp=' + hlT90()).then(L => {
  const M = {}; (L || []).forEach(h => { if (h.matches) M[h.hero_id] = {wr: 100 * h.wins / h.matches, kda: (h.total_kills + h.total_assists) / Math.max(1, h.total_deaths)}; }); return M;
}).catch(() => ({})));
// очки рейтинга: ранг + бонусы и штрафы (всё в очках ранга)
function hlScore(V, wr, kda, A, pen) {
  const dwr = Math.max(-30, Math.min(30, wr - A.wr)), dk = Math.max(-1, Math.min(2, kda / Math.max(.1, A.kda) - 1));
  return V + (HL_TIER / 2) * dwr / 12 + HL_K * dk - pen;
}
function hlPool(hid) {
  if (HLP[hid]) return HLP[hid];
  return (HLP[hid] = (async () => {
    const L = (await SBQ(`${HLQ(hid)}&start=1&limit=${HL_POOL}`)) || []; if (!L.length) return [];
    const ids = L.map(x => x.account_id).join(',');
    const one = (s, t) => SBQ(`hero_id=${hid}&sort_by=${s}&min_matches=1&min_unix_timestamp=${t}&account_ids=${ids}&limit=${HL_POOL}`).then(R => new Map((R || []).map(x => [x.account_id, x]))).catch(() => new Map());
    const [WR, K, De, As, R30, W30, AV] = await Promise.all([one('winrate', hlT90()), one('avg_kills_per_match', hlT90()), one('avg_deaths_per_match', hlT90()), one('avg_assists_per_match', hlT90()), one('rank', hlT30()), one('winrate', hlT30()), heroAvg()]);
    const A = AV[hid] || {wr: 50, kda: 3};
    const P = L.map(x => {
      const id = x.account_id, g = x.matches || 0, r30 = R30.get(id), g30 = r30 ? r30.matches || 0 : 0;
      const wr = 100 * ((WR.get(id) || {}).value || 0), k = (K.get(id) || {}).value || 0, d = (De.get(id) || {}).value || 0, a = (As.get(id) || {}).value || 0, kda = (k + a) / Math.max(1, d);
      const e = {aid: id, V: x.value, g, wr, kda, g30, badge: x.badge, idle: !g30};
      if (e.idle) return e;
      const s90 = hlScore(x.value, wr, kda, A, (HL_TIER / 2) * Math.max(0, 50 - g) / 15);
      const s30 = hlScore(r30.value || x.value, 100 * ((W30.get(id) || {}).value || 0), kda, A, (HL_TIER / 2) * Math.max(0, 5 - g30));
      e.R = Math.round((s90 + s30) / 2); e.s90 = Math.round(s90); e.s30 = Math.round(s30); e.wr30 = 100 * ((W30.get(id) || {}).value || 0);
      return e;
    });
    const live = P.filter(e => !e.idle).sort((p, q) => q.R - p.R); live.forEach((e, i) => { e.pos = i + 1; });
    P.avg = A; return P;
  })().catch(() => []));
}
// строки топа по очкам (start — с 1), пул кончился — дальше по рангу, как раньше
async function hlRows(hid, start, n) {
  const P = await hlPool(hid), live = P.filter(e => !e.idle).sort((p, q) => p.pos - q.pos);
  if (start + n - 1 <= live.length) return live.slice(start - 1, start - 1 + n).map(e => ({rank: e.pos, account_id: e.aid, matches: e.g, badge: e.badge, R: e.R, wr: e.wr, kda: e.kda}));
  const L = (await SBQ(`${HLQ(hid)}&start=${start}&limit=${n}`).catch(() => [])) || [];
  return L.map(x => ({rank: Math.max(x.rank, live.length + 1), account_id: x.account_id, matches: x.matches, badge: x.badge, ap: 1}));
}
{ const HR0 = heroRating; heroRating = function (hid, id) {
    const k = hid + '|' + id; if (HRL[k]) return HRL[k];
    return (HRL[k] = Promise.all([HR0(hid, id), hlPool(hid)]).then(([r0, P]) => {
      const e = P.find(x => x.aid === id);
      if (e) return e.idle ? {pos: 0, why: 'idle', m: e.g} : {pos: e.pos, v: e.R, m: e.g, badge: e.badge, sc: e, lg: 1};
      if (r0 && r0.pos) return Object.assign({}, r0, {pos: Math.max(r0.pos, P.filter(x => !x.idle).length + 1), ap: 1});
      return r0;
    }));
  }; }
// как считаем — одной строкой и раскрывашкой
function hlHow(hid) {
  return `<details class="l16-how"><summary>Как считаем — как League of Graphs</summary><ul>
    <li><b>Ранг</b> на ${esc(hero(hid).n)} — главное: тир выше = ×4 к очкам</li>
    <li><b>Винрейт</b> на 12 % выше среднего по герою = ×2</li>
    <li><b>KDA</b> вдвое выше среднего по герою = ×1,33</li>
    <li>Нужно ${HL_MIN}+ игр за ${HL_DAYS} дней и хоть одна за 30 дней. Меньше 50 игр и меньше 5 за 30 дней — штраф</li>
    <li>Два счёта — за ${HL_DAYS} и за 30 дней, берём средний</li></ul></details>`;
}

// ---------- топ мира на странице героя: по очкам рейтинга, с винрейтом и KDA ----------
l14Ladder = async function (n, hid) {
    const g = $('#hst'); if (!g || $('#l14lb')) return;
    g.insertAdjacentHTML('afterend', `<section class="l14-lad"><div class="q-sec"><b>Рейтинг героя · топ мира</b><small>ранг, винрейт и KDA на ${esc(hero(hid).n)} — нажми на игрока, увидишь его сборку</small></div>${hlHow(hid)}
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
    m.innerHTML = o && o.w && o.w.pos ? `<b>Ты · #${nf(o.w.pos)} в мире</b><small>${e ? `${nf(e.R)} очков · ${f1(e.wr)}% побед · KDA ${f1(e.kda)} · ` : o.w.ap ? 'за топ-300 место по рангу · ' : ''}${o.tot ? pctTop(o.w.pos, o.tot) + ' · ' : ''}${o.r ? `${esc(RGS[o.rg] || o.rg)} #${o.r.pos}` : `${esc(RGS[o.rg] || o.rg)} — вне топ-1000`}${o.w.pos > 100 ? ` · до топ-100 — ${nf(o.w.pos - 100)} ${pl(o.w.pos - 100, ['место', 'места', 'мест'])}` : ''}</small>`
      : `<b>Ты · вне рейтинга</b><small>${esc(hrWhy(o && o.w))}</small>`;
};
