// ===================== lg14 — 03.11, ночь: рейтинг героя — цель, билд игрока, эмблемы с подсказкой =====================
// Андрей: «рейтинг персонажа — #100 Rat King (2 EU)… Васяны должны бороться за шанс быть топ-1 Рэм, но справедливо — топ-1 не нищего ранга»;
// «зашёл на героя конкретного Васяна (топ-1 Рэм) — там его билд, если играет больше 20 игр, можно скопировать»;
// «наводишь на эмблему — пишет название: Ритуалист 5 и сколько MMR». Рейтинг считает heroRating (lg2): по рангу, 20+ игр на герое за 90 дней.
// MMR игра не отдаёт — на эмблеме честно: какой ранг и выше скольких игроков (распределение рангов за 30 дней).

// ---------- эмблема ранга: наведение — «Ritualist 5 · выше, чем у 72 % игроков» ----------
let RKD = null;
const rkDist = () => RKD || (RKD = api('players/rank/distribution').then(L => {
  const M = {}, tot = (L || []).reduce((a, x) => a + (x.players || 0), 0); let below = 0;
  (L || []).slice().sort((a, b) => a.badge - b.badge).forEach(x => { M[x.badge] = {below: below / Math.max(1, tot), p: x.players / Math.max(1, tot)}; below += x.players || 0; });
  return M;
}).catch(() => ({})));
// «очки ранга» — сколько у игрока прогресса ранга по Valve (последний ранговый матч). Это не MMR (его API больше не считает), но честная цифра
// той же природы: растёт с победами, падает с поражениями. Запросы — пачкой по всем, кого навели/показали за 60 мс.
const RKP = {}; let RKQ = null;
function rkPts(aid) {
  if (RKP[aid]) return RKP[aid];
  return (RKP[aid] = new Promise(res => {
    if (!RKQ) RKQ = {ids: [], cb: {}, t: setTimeout(async () => { const q = RKQ; RKQ = null;
      const L = await api('players/rank?account_ids=' + q.ids.join(',')).catch(() => []);
      q.ids.forEach(id => { const r = (L || []).find(z => z.account_id === id); q.cb[id](r && r.last_match && r.last_match.player_rank_final_flat_progress || null); }); }, 60)};
    RKQ.ids.push(aid); RKQ.cb[aid] = res;
  }));
}
let RKN = null;
function rkByName(nm) {
  if (!RKN) { RKN = {}; for (let t = 1; t <= 11; t++) for (let s = 1; s <= 6; s++) { const b = t * 10 + s; RKN[rankOf(b).name] = b; } }
  return RKN[nm] || 0;
}
document.addEventListener('mouseover', async e => {
  const im = e.target && e.target.tagName === 'IMG' && /\/assets\/ranks\/\d+\/\d+\/image/.test(e.target.src || '') ? e.target : null;
  if (!im || im.dataset.rkt) return;
  im.dataset.rkt = '1';
  const b = rkByName(im.alt || ''); if (!b) return;
  const host = im.closest('[data-aid]'), aid = host && +host.dataset.aid;
  const [M, fp] = await Promise.all([rkDist(), aid ? rkPts(aid) : null]), x = M[b], pts = fp ? ` · ${nf(fp)} очков ранга` : '';
  const nm = rankOf(b).name;
  // у верхних рангов «выше 100 %» и «0,0 %» ничего не говорят — там «топ 0,04 % игроков»
  const pc = v => (v >= 10 ? Math.round(v) : v >= 1 ? f1(v) : String(+v.toPrecision(1)).replace('.', ','));
  im.title = !x ? nm + pts : x.below >= .9 ? `${nm}${pts} · топ ${pc(100 * (1 - x.below))} % игроков · на этом ранге ${pc(100 * x.p)} %` : `${nm}${pts} · выше, чем у ${Math.round(100 * x.below)} % игроков · на этом ранге ${pc(100 * x.p)} %`;
}, {passive: true});

// ---------- страница героя: «Рейтинг героя · мир» (топ-10) и сборка конкретного игрока (#h/<герой>/p<id>) ----------
{ const VH14 = viewHero; viewHero = function (hid, mode) {
    const pm = /^p(\d+)$/.exec(mode || ''), r = VH14(hid, pm ? '' : mode), n = VQ;
    hid = +hid;
    if (D.heroes[hid]) { l14Ladder(n, hid); if (pm) l14Player(n, hid, +pm[1]); }
    return r;
  }; }
async function l14Ladder(n, hid) {
  // сразу под цифрами героя — это главная цель («бороться за топ-1 Рэм»), а не низ страницы
  const g = $('#hst'); if (!g || $('#l14lb')) return;
  g.insertAdjacentHTML('afterend', `<section class="l14-lad"><div class="q-sec"><b>Рейтинг героя · топ мира</b><small>честно: по рангу среди тех, кто сыграл на ${esc(hero(hid).n)} ${HL_MIN}+ игр за ${HL_DAYS} дней · нажми — его сборка</small></div>
    <div class="q-box l14-lb" id="l14lb"><div class="load" style="padding:14px">Считаю топ…</div></div></section>`);
  const L = (await SBQ(`${HLQ(hid)}&start=1&limit=10`).catch(() => [])) || []; if (n !== VQ) return;
  await steamNames(L.map(x => x.account_id)); if (n !== VQ) return;
  const row = (x, mine) => `<a data-aid="${x.account_id}" class="l14-r${mine ? ' mine' : ''}${x.rank <= 3 ? ' p' + x.rank : ''}${x.rank > 5 && !mine ? ' l14-x' : ''}" href="#h/${hid}/p${x.account_id}"><span class="l14-n">${x.rank <= 3 ? ['', '🥇', '🥈', '🥉'][x.rank] : '#' + nf(x.rank)}</span>${(SN[x.account_id] || {}).av ? `<img class="l14-av" src="${esc(SN[x.account_id].av)}" alt="" loading="lazy">` : '<i class="l14-av"></i>'}<b>${esc((SN[x.account_id] || {}).n || 'Скрытый игрок')}</b><span class="l14-rk">${rankImg(x.badge, 'rk')}<small>${esc(rankOf(x.badge).name)}</small></span><small class="l14-g">${nf(x.matches)} ${pl(x.matches, ['игра', 'игры', 'игр'])}</small><span class="l14-go">›</span></a>`;
  let html = L.length ? L.map(x => row(x, ME && x.account_id === ME.id)).join('') + (L.length > 5 ? '<button type="button" class="l14-more" id="l14more">Ещё 5 ›</button>' : '') : '<div class="empty">Пока никого: в рейтинг попадают с рангом и 20+ играми на герое за 90 дней.</div>';
  L.forEach(x => rkPts(x.account_id));
  put(n, '#l14lb', html + (ME ? '<div class="l14-me" id="l14me"><small>Ты · считаю место…</small></div>' : ''));
  { const mb = $('#l14more'); if (mb) mb.onclick = () => { $('#l14lb').classList.add('open'); mb.remove(); }; }
  if (!ME || L.some(x => x.account_id === ME.id)) { const m = $('#l14me'); if (m && L.some(x => x.account_id === ME.id)) m.remove(); return; }
  const o = await hrkGet(hid, ME.id, ME.name).catch(() => null); if (n !== VQ) return;
  const m = $('#l14me'); if (!m) return;
  m.innerHTML = o && o.w && o.w.pos ? `<b>Ты · #${nf(o.w.pos)} в мире</b><small>${o.tot ? pctTop(o.w.pos, o.tot) + ' · ' : ''}${o.r ? `${esc(RGS[o.rg] || o.rg)} #${o.r.pos}` : `${esc(RGS[o.rg] || o.rg)} — вне топ-1000`}${o.w.pos > 100 ? ` · до топ-100 — ${nf(o.w.pos - 100)} ${pl(o.w.pos - 100, ['место', 'места', 'мест'])}` : ''}</small>`
    : `<b>Ты · вне рейтинга</b><small>${esc(hrWhy(o && o.w))}</small>`;
}
async function l14Player(n, hid, id) {
  const st = $('#hst'); if (!st || $('#l14pl')) return;
  st.insertAdjacentHTML('beforebegin', '<div class="l14-pl" id="l14pl"><div class="load">Смотрю игрока…</div></div>');
  const t90 = now() - HL_DAYS * 86400 - (now() % 86400);
  await steamNames([id]); if (n !== VQ) return;
  const s = SN[id] || {}, nm = s.n || 'Игрок ' + id;
  const [o, HS, BS, RK] = await Promise.all([hrkGet(hid, id, nm).catch(() => null), api('players/hero-stats?account_ids=' + id).catch(() => []),
    api(`analytics/hero-build-stats/${hid}?min_unix_timestamp=${t90}&min_matches=1&account_id=${id}`).catch(() => []), api(`players/${id}/rank`).catch(() => null)]);
  if (n !== VQ) return;
  const h = (HS || []).find(x => x.hero_id === hid) || {}, g = h.matches_played || 0, w = h.wins || 0, g90 = o && o.w ? o.w.m || 0 : 0, badge = (RK && RK.badge) || (o && o.w && o.w.badge) || 0;
  const place = o && o.w && o.w.pos ? `<b class="l14-pl2${o.w.pos <= 100 ? ' top' : ''}">#${nf(o.w.pos)} ${esc(hero(hid).n)}</b><small>в мире${o.tot ? ' · ' + pctTop(o.w.pos, o.tot) : ''}${o.r ? ` · ${esc(RGS[o.rg] || o.rg)} #${o.r.pos}` : ''}</small>` : `<b class="l14-pl2 no">вне рейтинга</b><small>${esc(hrWhy(o && o.w))}</small>`;
  let bld = '';
  const top = (BS || []).slice().sort((a, b) => b.matches - a.matches)[0];
  if (g90 < HL_MIN) bld = `<div class="empty">Его сборку показываем от ${HL_MIN} игр на герое за ${HL_DAYS} дней — у него ${g90}. Меньше — это ещё не его стиль, а проба.</div>`;
  else if (!top) bld = '<div class="empty">Играет без сохранённой сборки — повторить по ID не выйдет.</div>';
  else {
    const b = await api(`builds?build_id=${top.hero_build_id}&only_latest=true`).then(r => r && r[0]).catch(() => null); if (n !== VQ) return;
    if (b && b.hero_build) {
      const x = {id: top.hero_build_id, b, name: b.hero_build.name || 'Сборка #' + top.hero_build_id, author: '', aid: b.hero_build.author_account_id, cat: bldCat(b), items: itemsOfBuild(b), sr: top, m: 0, wr: 100 * top.wins / Math.max(1, top.matches), pm: 0};
      if (x.aid) { await steamNames([x.aid]); x.author = (SN[x.aid] || {}).n || ''; }
      L14B[hid] = x;
      bld = `<div class="q-bcs l14-bcs">${bCard(x, 'cur').replace('играешь сейчас', 'играет сейчас').replace('ты начинал с ней за 30 дней', `сыграно с ней за ${HL_DAYS} дней:`)}</div><p class="l14-how">В игре: <b>Сборки</b> → поиск → вставь ID. Кнопка «ID …» на карточке копирует его.</p>`;
    } else bld = '<div class="empty">Сборка не нашлась — возможно, автор её удалил.</div>';
  }
  put(n, '#l14pl', `<div class="l14-ph" data-aid="${id}">${s.av ? `<img class="l14-av" src="${esc(s.av)}" alt="">` : '<i class="l14-av"></i>'}<div class="l14-nm"><small>Игрок на ${esc(hero(hid).n)}</small><b>${esc(nm)}</b><span class="l14-rk">${badge ? rankImg(badge, 'rk') : ''}<small>${esc(rankOf(badge).name)}</small></span></div>
      <div class="l14-pr">${place}</div><a class="btn s g" href="?id=${id}#home" target="_blank" rel="noopener">Профиль ↗</a></div>
    <div class="l14-ps"><span><small>Игр на герое</small><b>${nf(g)}</b></span><span><small>Побед</small><b class="${g ? (w / g >= .52 ? 'win' : w / g <= .47 ? 'loss' : '') : ''}">${g ? f1(100 * w / g) + '%' : '—'}</b></span><span><small>За ${HL_DAYS} дней</small><b>${nf(g90)}</b></span></div>
    <div class="q-sec" style="margin-top:12px"><b>Его сборка</b><small>на какой играет чаще всего за ${HL_DAYS} дней</small></div>${bld}`);
  const el = $('#l14pl'); if (!el) return;
  el.onclick = e => {
    const cp = e.target.closest('[data-cp]'); if (cp) { const v = cp.dataset.cp; (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => { cp.textContent = 'ID скопирован ✓'; }).catch(() => { cp.textContent = 'ID ' + v; }); return; }
    const d = e.target.closest('[data-bd]'); if (d) { const x = $('#bd2-' + d.dataset.bd); if (x) x.classList.toggle('hide'); return; }
    const sv = e.target.closest('[data-bx]'); if (!sv) return;
    if (!ME) { alertBox('Сначала найди себя в поиске сверху — сборка ляжет в твой профиль.'); return; }
    const x = L14B[hid]; if (x && bldSave(hid, {id: x.id, name: x.name, cat: x.cat, src: 'vas', wr: x.wr, mt: x.sr.matches, items: x.items.slice(0, 12)})) sv.textContent = 'в профиле ✓';
  };
}
const L14B = {};

// ---------- профиль: рейтинг героя — цель («лучшее место · до топ-100 / топ-1000») ----------
{ const P14 = p11Rk; p11Rk = async function (n, id, name) {
    await P14(n, id, name); if (n !== VQ) return;
    const hids = $$('#p11hl [data-hrk]').slice(0, 4).map(c => +c.dataset.hrk); if (!hids.length || $('#l14goal')) return;
    const L = (await Promise.all(hids.map(h => hrkGet(h, id, name).then(o => ({h, o})).catch(() => null)))).filter(x => x && x.o && x.o.w && x.o.w.pos);
    if (n !== VQ) return;
    const sec = $('#p11hl') && $('#p11hl').closest('section'); if (!sec) return;
    if (!L.length) {
      const o0 = await hrkGet(hids[0], id, name).catch(() => null); if (n !== VQ) return;
      sec.insertAdjacentHTML('beforebegin', `<div class="l14-goal no" id="l14goal"><div><small>Рейтинг героя</small><b>Пока вне рейтинга</b><span>${esc(hrWhy(o0 && o0.w) || 'нужен ранг и 20 игр на герое за 90 дней')}. Попадёшь — увидишь своё место в мире и в регионе.</span></div></div>`);
      return;
    }
    const b = L.sort((a, c) => a.o.w.pos - c.o.w.pos)[0], p = b.o.w.pos, nx = p > 1000 ? 1000 : p > 100 ? 100 : p > 10 ? 10 : 1;
    sec.insertAdjacentHTML('beforebegin', `<a class="l14-goal" id="l14goal" href="#h/${b.h}/me">${face(b.h, '', 'm')}<div><small>Рейтинг героя · лучшее место</small><b>#${nf(p)} ${esc(hero(b.h).n)}${b.o.r ? ` <em>${esc(RGS[b.o.rg] || b.o.rg)} #${b.o.r.pos}</em>` : ''}</b><span>${p === 1 ? 'Ты топ-1 мира на этом герое — держи место.' : `До топ-${nx} — ${nf(p - nx)} ${pl(p - nx, ['место', 'места', 'мест'])}`}${b.o.tot ? ` · ${pctTop(p, b.o.tot)}` : ''}</span></div><i class="l14-go">›</i></a>`);
  }; }
