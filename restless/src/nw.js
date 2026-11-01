// ==================== Restless · новый сайт с нуля (02.11) ====================
// Андрей: «переделай сайт от А до Я, с нуля — ты понял, как я хочу». Образец — Deadlock Labs и League of Graphs:
// одна строка разделов, профиль = слева ранг/цифры/герои, справа история, матч раскрывается прямо в списке;
// матч = таблица двух команд, разбор коуча — отдельной вкладкой. Под капотом — проверенный движок старого сайта
// (загрузка с кэшем и своим сервером, разбор матча, коуч, перевод патчей). Всё, что видно, — отсюда.

const NW = {hist: {mode: '', hero: 0, n: 20}, open: 0, openHTML: '', openTab: 'sb', X: null, lw: 'full', mt: 'ov', ml: 0, mw: 'full', dk: 'dmg', ps: 'm', sn: 50, hs: 'wr', hr: '', lb: 'Europe', uh: 0};
const NW_NAV = [['home', 'Игрок'], ['heroes', 'Герои'], ['lb', 'Лидеры'], ['live', 'Лайв-матч'], ['upd', 'Патчи']];
const nwWon = m => m.player_team === m.match_result;
const nwCard = id => hero(id).c || hero(id).i || '';
const nwWr = (w, n) => { const v = pc(w, n); return `<b class="${n >= 5 ? (v >= 52 ? 'win' : v <= 47 ? 'loss' : '') : ''}">${v}%</b>`; };
const nwKda = x => (x.kills + x.assists) / Math.max(1, x.deaths);
const nwSeg = (id, L, cur, attr) => `<div class="seg"${id ? ` id="${id}"` : ''}>${L.map(([k, v]) => `<button type="button" data-${attr}="${esc(k)}" class="${String(cur) === String(k) ? 'on' : ''}">${esc(v)}</button>`).join('')}</div>`;

// ---------- шапка: поиск игрока ----------
function nwFind(inp, box, go) {
  let t = 0;
  inp.addEventListener('input', () => {
    clearTimeout(t); const v = inp.value.trim();
    if (v.length < 2 || idFrom(v)) { box.classList.add('hide'); return; }
    t = setTimeout(async () => {
      box.classList.remove('hide'); box.innerHTML = '<div class="em">Ищу…</div>';
      try {
        const nm = (v.match(/steamcommunity\.com\/id\/([^\/?#]+)/) || [])[1] || v, L = await api('players/steam-search?limit=8&search_query=' + encodeURIComponent(nm));
        if (inp.value.trim() !== v) return;
        box.innerHTML = L.length ? L.map(s => `<button type="button" data-id="${s.account_id}"><img src="${esc(s.avatarmedium || s.avatar)}" alt="" onerror="${noimg}"><span><b>${esc(s.personaname)}</b><small>${esc(s.countrycode || '')} · ID ${s.account_id}</small></span></button>`).join('') : '<div class="em">Никого не нашёл</div>';
      } catch (e) { box.innerHTML = `<div class="em">${esc(e.message)}</div>`; }
    }, 300);
  });
  box.addEventListener('click', e => { const b = e.target.closest('[data-id]'); if (b) { box.classList.add('hide'); inp.value = ''; go(+b.dataset.id); } });
  inp.form && inp.form.addEventListener('submit', e => { e.preventDefault(); const id = idFrom(inp.value); if (id) { inp.value = ''; box.classList.add('hide'); go(id); } else { const b = box.querySelector('[data-id]'); if (b) b.click(); } });
}
function nwGoPlayer(id) { setMe(id); NW.open = 0; NW.hist = {mode: '', hero: 0, n: 20}; if (location.hash === '#home' || !location.hash) route(); else location.hash = '#home'; }
(function nwHead() {
  const q = $('#nsq'), dd = $('#nsd'); if (!q) return;
  if (matchMedia('(max-width:760px)').matches) q.placeholder = 'Ник или ID';
  nwFind(q, dd, nwGoPlayer);
  document.addEventListener('click', e => { if (!e.target.closest('.nh-s')) dd.classList.add('hide'); });
})();
function paintMe() {
  const b = $('#nme'); if (!b) return;
  if (!ME) { b.classList.add('hide'); return; }
  b.classList.remove('hide'); b.innerHTML = `${ME.avatar ? `<img src="${esc(ME.avatar)}" alt="" onerror="${noimg}">` : ''}<b>${esc(ME.name)}</b>`;
}
function nwNav(t) {
  const k = /^(heroes|h)$/.test(t) ? 'heroes' : t === 'lb' ? 'lb' : t === 'live' ? 'live' : t === 'upd' ? 'upd' : 'home';
  $$('#nnav a').forEach(a => a.classList.toggle('on', a.dataset.k === k));
}

// ---------- маршруты ----------
function route() {
  const h = location.hash.replace(/^#/, '') || 'home', [t, a, b] = h.split('/');
  nwNav(t); window.scrollTo(0, 0);
  try { MZ.play = 0; cancelAnimationFrame(MZ.raf); } catch (e) {}
  if (t === 'heroes' || t === 'meta' || t === 'builds') return nvHeroes();
  if ((t === 'h' || t === 'b') && a) return nvHero(+a);
  if (t === 'lb' || t === 'top' || t === 'pro') return nvLb(a);
  if (t === 'live' || t === 'now') return nvLive(a);
  if (t === 'upd') return nvUpd(a);
  if (t === 'm' && a) return nvMatch(+a, b);
  if (t === 'mine') return nvPlayer('heroes');
  if (t === 'form') return nvPlayer('stats');
  return nvPlayer('ov');
}

// ---------- старт без игрока ----------
function nvLanding() {
  vNew();
  V(`<section class="lnd"><h1>RESTLESS</h1><p>Статистика Deadlock: профиль игрока, разбор каждого матча, герои, сборки и патчи.</p>
    <form id="lf" autocomplete="off"><input id="lq" placeholder="Ник, ссылка Steam или ID" aria-label="Найти игрока"><button class="btn p" type="submit">Найти</button></form>
    <div class="nh-dd lnd-dd hide" id="ldd" style="position:static"></div>
    <div class="lnd-g"><a href="#heroes"><b>Герои</b><small>винрейт, сборки, против кого играть</small></a><a href="#live"><b>Лайв-матч</b><small>все 12 игроков текущего матча</small></a><a href="#upd"><b>Патчи</b><small>что поменяли — по-русски</small></a></div></section>`);
  nwFind($('#lq'), $('#ldd'), nwGoPlayer);
}

// ---------- игрок ----------
async function nvPlayer(tab) {
  if (!ME) return nvLanding();
  const n = vNew(), id = ME.id;
  V('<div class="ld">Загружаю профиль…</div>');
  let H, HS, R, ST;
  try {
    [H, HS, R, ST] = await Promise.all([api('players/' + id + '/match-history'), api('players/hero-stats?account_ids=' + id).catch(() => []),
      api('players/' + id + '/rank').catch(() => null), api('players/steam?account_ids=' + id).catch(() => [])]);
  } catch (e) { if (n === VQ) V(`<div class="er">Не вышло загрузить профиль: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  const st = (ST || [])[0] || {}, badge = (R && R.badge) || 0;
  PROF = {id, H, HS, CNT: {}, MS: {}, badge};
  const pool = HS.filter(x => D.heroes[x.hero_id]).sort((a, b) => b.matches_played - a.matches_played);
  const head = nwBanner(id, st, badge, H, (pool[0] || {}).hero_id || 0) + `<nav class="tabs">${[['home', 'Обзор', 'ov'], ['mine', 'Герои', 'heroes'], ['form', 'Статистика', 'stats']].map(([k, v, t]) => `<a href="#${k}" class="${tab === t ? 'on' : ''}">${v}</a>`).join('')}</nav>`;
  if (!H.length) { V(head + '<div class="em">У этого игрока нет матчей в открытых данных.</div>'); return; }
  if (tab === 'heroes') return nvPHeroes(n, head, pool);
  if (tab === 'stats') return nvPStats(n, head, H);
  nvPOverview(n, head, H, pool, badge);
}
function nwBanner(id, st, badge, H, main) {
  const rk = rankOf(badge), L = H.slice(0, 20), w = L.filter(nwWon).length;
  let s = 0; const r0 = L.length ? nwWon(L[0]) : null; for (const m of L) { if (nwWon(m) === r0) s++; else break; }
  const bg = main ? '../art/' + main + '.webp' : '';
  return `<section class="pb">${bg ? `<i class="pb-bg" style="background-image:url('${esc(bg)}')"></i>` : ''}
    <img class="pb-av" src="${esc(st.avatarfull || st.avatarmedium || ME.avatar || '')}" alt="" onerror="${noimg}">
    <div class="pb-n"><h1>${esc(st.personaname || ME.name)}</h1>
      <p>${badge ? `${rankImg(badge, 'rk')}<b style="color:${esc(rk.color)}">${esc(rk.name)}</b>` : '<span class="chip">Без ранга</span>'}
      <span class="chip ${w * 2 >= L.length ? 'w' : 'l'}">${w}В ${L.length - w}П за ${L.length}</span>
      ${s >= 2 ? `<span class="chip ${r0 ? 'w' : 'l'}">${s} ${r0 ? pl(s, ['победа', 'победы', 'побед']) : pl(s, ['поражение', 'поражения', 'поражений'])} подряд</span>` : ''}
      <span>${nf(H.length)} ${pl(H.length, ['матч', 'матча', 'матчей'])} · последний ${esc(ago(H[0].start_time))}</span></p></div>
    <div class="pb-r"><a class="btn" href="#live/${id}">Лайв-матч</a></div></section>`;
}
function nvPOverview(n, head, H, pool, badge) {
  const rk = rankOf(badge), R30 = H.filter(m => m.match_mode === 4 && m.start_time >= now() - 30 * 86400), rw = R30.filter(nwWon).length;
  const rankC = `<div class="cd"><div class="cd-h">Ранг</div><div class="rkc">${badge ? rankImg(badge, 'rk') : ''}<div><b${badge ? ` style="color:${esc(rk.color)}"` : ''}>${esc(badge ? rk.name : 'Без ранга')}</b>
    <small>${R30.length ? `ранговые за 30 дней: <span class="win">${rw}В</span> · <span class="loss">${R30.length - rw}П</span>` : 'ранговых за 30 дней нет'}</small><small id="nrtop"></small></div></div></div>`;
  const L = H.slice(0, 50), av = f => L.reduce((a, m) => a + (+f(m) || 0), 0) / Math.max(1, L.length), mn = m => Math.max(300, m.match_duration_s || 600) / 60, wr = pc(H.filter(nwWon).length, H.length);
  const kpi = `<div class="cd"><div class="cd-h">Показатели<span class="sp"></span><span>${L.length} последних</span></div><div class="kpi">
    <span><small>Убийства</small><b>${f1(av(m => m.player_kills))}</b></span><span><small>Смерти</small><b>${f1(av(m => m.player_deaths))}</b></span><span><small>Помощь</small><b>${f1(av(m => m.player_assists))}</b></span>
    <span><small>Души</small><b>${kFmt(av(m => m.net_worth))}</b></span><span><small>Души / мин</small><b>${nf(av(m => m.net_worth / mn(m)))}</b></span><span><small>Винрейт</small><b class="big">${wr}%</b></span></div></div>`;
  const top = pool.slice(0, 8), h3 = top.slice(0, 3), hr = top.slice(3);
  const heroesC = `<div class="cd"><div class="cd-h">Главные герои<span class="sp"></span><a href="#mine">Все ›</a></div>
    <div class="th3">${h3.map(x => { const v = pc(x.wins, x.matches_played); return `<a href="#h/${x.hero_id}"><img src="${esc(nwCard(x.hero_id))}" alt="" loading="lazy" onerror="${noimg}"><em class="${v >= 52 ? 'win' : v <= 47 ? 'loss' : ''}">${v}%</em><span><b>${esc(hero(x.hero_id).n)}</b><small>${games(x.matches_played)} · ${f2(nwKda(x))} KDA</small></span></a>`; }).join('')}</div>
    <div class="thl">${hr.map(x => `<a href="#h/${x.hero_id}">${heroImg(x.hero_id)}<span><b>${esc(hero(x.hero_id).n)}</b><small>${games(x.matches_played)} · ${f2(nwKda(x))} KDA</small></span><em>${nwWr(x.wins, x.matches_played)}</em></a>`).join('')}</div></div>`;
  const D40 = H.slice(0, 40).reverse(), WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'], d0 = new Date(); d0.setHours(0, 0, 0, 0);
  let ww = 0, wl = 0; const wk = [];
  for (let i = 6; i >= 0; i--) { const a = d0.getTime() / 1000 - i * 86400, b = a + 86400, M = H.filter(m => m.start_time >= a && m.start_time < b), w = M.filter(nwWon).length; ww += w; wl += M.length - w;
    wk.push(`<span><i class="${!M.length ? '' : w === M.length ? 'w' : !w ? 'l' : 'm'}"></i>${WD[new Date(a * 1000).getDay()]}<small>${M.length ? `${w}–${M.length - w}` : '·'}</small></span>`); }
  const actC = `<div class="cd"><div class="cd-h">Активность<span class="sp"></span><span>7 дней: <b class="win">${ww}В</b> <b class="loss">${wl}П</b></span></div>
    <div class="act">${D40.map(m => `<i class="${nwWon(m) ? 'w' : 'l'}" title="${esc(hero(m.hero_id).n)} · ${nwWon(m) ? 'победа' : 'поражение'} · ${esc(ago(m.start_time))}"></i>`).join('')}</div><div class="wk">${wk.join('')}</div></div>`;
  const hl = [...new Set(H.slice(0, 300).map(m => m.hero_id))].filter(h => D.heroes[h]).sort((a, b) => hero(a).n.localeCompare(hero(b).n));
  const hist = `<div class="cd"><div class="cd-h hs"><b>История матчей</b><span class="sp"></span>${nwSeg('nhm', [['', 'Все'], ['r', 'Ранговые'], ['u', 'Обычные']], NW.hist.mode, 'md')}
    <select class="sel" id="nhh" aria-label="Герой"><option value="0">Все герои</option>${hl.map(h => `<option value="${h}"${NW.hist.hero === h ? ' selected' : ''}>${esc(hero(h).n)}</option>`).join('')}</select></div>
    <div class="mrs" id="nhr"></div><div class="mrm"><button class="btn" id="nhmore" type="button">Показать ещё</button></div></div>`;
  V(head + `<div class="pov"><aside class="pov-l">${rankC}${kpi}${heroesC}${actC}<div id="qkco"></div></aside><div class="pov-r">${hist}</div></div>`);
  $$('#nhm button').forEach(b => b.onclick = () => { NW.hist.mode = b.dataset.md; NW.hist.n = 20; NW.open = 0; $$('#nhm button').forEach(x => x.classList.toggle('on', x === b)); nwDrawRows(n); nwEnrich(n); });
  $('#nhh').onchange = e => { NW.hist.hero = +e.target.value; NW.hist.n = 20; NW.open = 0; nwDrawRows(n); nwEnrich(n); };
  $('#nhmore').onclick = () => { NW.hist.n += 20; nwDrawRows(n); nwEnrich(n); };
  const rows = $('#nhr');
  rows.onclick = e => { if (e.target.closest('a') || e.target.closest('#mrx')) return; const r = e.target.closest('.mr[data-m]'); if (r) nwToggle(r); };
  rows.onkeydown = e => { if (e.key !== 'Enter' || e.target.closest('#mrx')) return; const r = e.target.closest('.mr[data-m]'); if (r) nwToggle(r); };
  nwDrawRows(n); nwEnrich(n);
  gradeBase(badge).then(T2 => { if (n !== VQ) return; GT = T2; nwDrawRows(n); }).catch(() => {});
  if (badge) api('players/rank/distribution').then(Dd => { if (n !== VQ) return; const tot = Dd.reduce((a, x) => a + (x.players || 0), 0), up = Dd.filter(x => x.badge >= badge).reduce((a, x) => a + (x.players || 0), 0); const el = $('#nrtop'); if (el && tot) el.innerHTML = `выше, чем у ${f1(Math.max(0, 100 - 100 * up / tot))}% игроков`; }).catch(() => {});
  if (typeof coProfDraw === 'function') { coProfDraw(PROF.id, H); const b = $('#qkco'); if (b) b.addEventListener('click', e => { const x = e.target.closest('[data-qkc]'); if (x) { coTaskSave(null); coProfDraw(PROF.id, H); } }); coProfCheck(PROF.id, H); }
}
function nwHistList() { const P = PROF; return P ? P.H.filter(m => (!NW.hist.hero || m.hero_id === NW.hist.hero) && (!NW.hist.mode || (NW.hist.mode === 'r' ? m.match_mode === 4 : m.match_mode !== 4))) : []; }
function nwDrawRows(n) {
  if (n !== VQ || !$('#nhr')) return;
  const A = nwHistList(), S = A.slice(0, NW.hist.n);
  put(n, '#nhr', S.map(nwRow).join('') || '<div class="em">Под этот фильтр матчей нет.</div>');
  const mb = $('#nhmore'); if (mb) mb.hidden = A.length <= NW.hist.n;
  if (NW.open) { const r = $(`.mr[data-m="${NW.open}"]`); if (r) { r.classList.add('open'); r.setAttribute('aria-expanded', 'true'); r.insertAdjacentHTML('afterend', `<div class="mrx" id="mrx">${NW.openHTML || '<div class="ld">Загружаю матч…</div>'}</div>`); nwMrxBind(); } }
}
async function nwEnrich(n) {
  const S = nwHistList().slice(0, NW.hist.n), ids = S.map(m => m.match_id).filter(id => !MD.has(id));
  const names = async L => { const acc = []; L.forEach(m => { const M = MD.get(m.match_id); if (M) M.players.forEach(p => acc.push(p.account_id)); }); const need = [...new Set(acc)].filter(a => !SN[a]); if (need.length) await steamNames(need); };
  for (let i = 0; i < ids.length; i += 10) { await bulkMeta(ids.slice(i, i + 10)); if (n !== VQ) return; await names(S.filter(m => ids.slice(i, i + 10).includes(m.match_id))); if (n !== VQ) return; nwDrawRows(n); }
  const before = Object.keys(SN).length; await names(S); if (n !== VQ) return; if (Object.keys(SN).length !== before) nwDrawRows(n);
}
const nwTp = p => `<span class="${p.account_id === PROF.id ? 'me' : ''}"><img src="${esc(hero(p.hero_id).i)}" alt="" loading="lazy" onerror="${noimg}"><em>${esc((SN[p.account_id] || {}).n || 'Игрок')}</em></span>`;
function nwRow(m) {
  const w = nwWon(m), dur = Math.max(60, m.match_duration_s || 0), kda = (m.player_kills + m.player_assists) / Math.max(1, m.player_deaths), M = MD.get(m.match_id), me = M ? M.players.find(p => p.account_id === PROF.id) : null;
  const its = me ? finalItems(me).slice(0, 12) : [], dmg = me && me.final_stats ? me.final_stats.player_damage : 0, g = mGrade(m)[0];
  const tm = k => M ? M.players.filter(p => teamOf(p.team) === k).map(nwTp).join('') : '';
  return `<div class="mr ${w ? 'w' : 'l'}${NW.open === m.match_id ? ' open' : ''}" data-m="${m.match_id}" tabindex="0" role="button" aria-expanded="false" aria-label="${w ? 'Победа' : 'Поражение'}, ${esc(hero(m.hero_id).n)}, раскрыть матч">
    <div class="mr-pt"><img src="${esc(nwCard(m.hero_id))}" alt="" loading="lazy" onerror="${noimg}"><em>${w ? 'ПОБЕДА' : 'ПОРАЖ.'}</em></div>
    <div class="mr-h"><b>${esc(hero(m.hero_id).n)}</b><small>${mmss(dur)} · ${esc(ago(m.start_time))}</small><span class="chip">${MODE(m)}</span><span class="gr ${g[0]}" title="оценка за матч">${g}</span></div>
    <div class="mr-k"><b>${m.player_kills} / <i>${m.player_deaths}</i> / ${m.player_assists}</b><small>${f2(kda)} KDA${dmg ? ` · ${kFmt(dmg)} урона` : ''}</small></div>
    <div class="mr-s"><b>${kFmt(m.net_worth)}</b><small>${nf(m.net_worth / (dur / 60))} душ/мин</small></div>
    <div class="mr-it">${its.map(itIco).join('')}${'<i></i>'.repeat(12 - its.length)}</div>
    <div class="mr-tm">${me ? `<div>${tm(teamOf(me.team))}</div><div>${tm(1 - teamOf(me.team))}</div>` : ''}</div><span class="mr-ar" aria-hidden="true">▾</span></div>`;
}
async function nwToggle(r) {
  const mid = +r.dataset.m;
  if (NW.open === mid) { NW.open = 0; NW.openHTML = ''; const b = $('#mrx'); if (b) b.remove(); r.classList.remove('open'); r.setAttribute('aria-expanded', 'false'); return; }
  const b0 = $('#mrx'); if (b0) b0.remove(); $$('.mr.open').forEach(x => { x.classList.remove('open'); x.setAttribute('aria-expanded', 'false'); });
  NW.open = mid; NW.openHTML = ''; NW.openTab = 'sb'; NW.X = null;
  r.classList.add('open'); r.setAttribute('aria-expanded', 'true'); r.insertAdjacentHTML('afterend', '<div class="mrx" id="mrx"><div class="ld">Загружаю матч…</div></div>');
  let md; try { md = await api('matches/' + mid + '/metadata'); } catch (e) { if (NW.open === mid) { NW.openHTML = `<div class="er">Матч не загрузился: ${esc(e.message)}</div>`; const b = $('#mrx'); if (b) b.innerHTML = NW.openHTML; } return; }
  const X = coBuildX(md, mid); X.meP = X.P.find(p => p.account_id === PROF.id) || null;
  await steamNames(X.P.map(p => p.account_id));
  if (NW.open !== mid) return;
  NW.X = X; nwMrxRender();
}
function nwMrxRender() {
  const X = NW.X; if (!X) return;
  const me = X.meP || X.P[0], t = NW.openTab;
  const body = t === 'co' ? nwCoShort(X, me) : t === 'ln' ? nwLaneHTML(X, me.assigned_lane, NW.lw, me) : sbHTML2(X, me.player_slot);
  NW.openHTML = `<div class="tabs mrx-t">${[['sb', 'Таблица'], ['co', 'Разбор'], ['ln', 'Линия']].map(([k, v]) => `<button type="button" data-xt="${k}" class="${t === k ? 'on' : ''}">${v}</button>`).join('')}</div>${body}
    <div class="mrx-ft"><a class="btn" href="#m/${X.mid}/co">Полный разбор ›</a><a class="btn p" href="#m/${X.mid}">Весь матч ›</a></div>`;
  const b = $('#mrx'); if (b) { b.innerHTML = NW.openHTML; nwMrxBind(); }
}
function nwMrxBind() {
  const b = $('#mrx'); if (!b) return;
  b.onclick = e => { const x = e.target.closest('[data-xt]'); if (x) { NW.openTab = x.dataset.xt; nwMrxRender(); return; }
    const w = e.target.closest('[data-lw]'); if (w) { NW.lw = w.dataset.lw; nwMrxRender(); } };
}

// ---------- таблица матча: две команды ----------
function sbHTML2(X, sel) {
  const M = p => X.M.get(p), all = X.P, mx = f => Math.max(...all.map(f)), meId = X.meP ? X.meP.account_id : 0;
  const tS = mx(p => p.net_worth || 0), tK = mx(p => p.kills || 0), tA = mx(p => p.assists || 0), tD = mx(p => M(p).dmg), tO = mx(p => M(p).obj), tH = mx(p => M(p).heal);
  const c = (v, t) => v && v >= t ? ' class="mx"' : '';
  const row = p => { const m = M(p), a = X.A.get(p) || {score: 50}, g = gradeOf(a.score);
    return `<tr data-sl="${p.player_slot}" class="${p.account_id === meId ? 'me' : ''}${sel === p.player_slot ? ' on' : ''}"><td class="p">${face(p.hero_id, '', 's')}<span><b>${esc(pname(p))}</b><small>${esc(hero(p.hero_id).n)}</small></span></td>
      <td${c(p.net_worth, tS)}>${kFmt(p.net_worth || 0)}</td><td${c(p.kills, tK)}>${p.kills || 0}</td><td class="d">${p.deaths || 0}</td><td${c(p.assists, tA)}>${p.assists || 0}</td>
      <td${c(m.dmg, tD)}>${kFmt(m.dmg)}</td><td${c(m.obj, tO)}>${kFmt(m.obj)}</td><td${c(m.heal, tH)}>${kFmt(m.heal)}</td>
      <td class="it">${finalItems(p).slice(0, 12).map(itIco).join('')}</td><td><span class="gr ${g[0]}">${g}</span></td></tr>`; };
  return `<div class="sb">${[0, 1].map(k => { const T = all.filter(p => teamOf(p.team) === k).sort((a, b) => (b.net_worth || 0) - (a.net_worth || 0));
    return `<div class="sb-team t${k}"><div class="sb-h"><b>${TEAMN[k]}</b>${X.win === k ? '<em>Победа</em>' : ''}<span>${T.reduce((s, p) => s + (p.kills || 0), 0)} убийств · ${kFmt(T.reduce((s, p) => s + (p.net_worth || 0), 0))} душ</span></div>
      <div class="sb-tw"><table class="sb-t"><thead><tr><th class="p">Игрок</th><th>Души</th><th>У</th><th>С</th><th>П</th><th>Урон</th><th>Объекты</th><th>Лечение</th><th>Предметы</th><th>Оценка</th></tr></thead><tbody>${T.map(row).join('')}</tbody></table></div></div>`; }).join('')}</div>`;
}
// короткий разбор для раскрытого матча
function nwCoShort(X, p) {
  return coWith(X, () => {
    const F = coFacts(p), PR = coProblems(F), main = PR[0], g10 = Math.max(1, Math.min(10, Math.round(F.score / 10)));
    const C = coDeathCtx(X, p, F).sort((a, b) => ((b.fo && b.fo.first && b.fo.n >= 3) * 2 + (b.mates === 0) + (b.objs.length > 0)) - ((a.fo && a.fo.first && a.fo.n >= 3) * 2 + (a.mates === 0) + (a.objs.length > 0)) || a.t - b.t).slice(0, 3).sort((a, b) => a.t - b.t);
    return `<div class="nco"><div class="nco-g"><b>${g10}</b><small>из 10</small></div><div class="nco-t">
      <small class="nco-k">${F.won ? 'Победа' : 'Поражение'} · ${esc(hero(p.hero_id).n)} · ${p.kills}/${p.deaths}/${p.assists}</small>
      <p>${main ? main.t : 'Явной ошибки в цифрах нет: смерти, души, урон и драки в норме для этого матча.'}</p>
      ${C.length ? `<ul>${C.map(c => `<li><time>${coT(c.t)}</time><span>${coMoText(c)}</span></li>`).join('')}</ul>` : ''}
      ${main ? `<p class="nco-tk"><b>Задание на 3 игры:</b> ${esc(main.task.n)} — ${esc(main.task.rule.toLowerCase())}.</p>` : ''}</div></div>`;
  });
}

// ---------- матч ----------
async function nvMatch(mid, tab) {
  const n = vNew(); V('<div class="ld">Загружаю матч…</div>');
  let md; try { md = await api('matches/' + mid + '/metadata'); } catch (e) { if (n === VQ) V(`<div class="er">Матч не загрузился: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  const X = coBuildX(md, mid); X.n = n; X.meP = ME ? X.P.find(p => p.account_id === ME.id) || null : null;
  await steamNames(X.P.map(p => p.account_id)); if (n !== VQ) return;
  MX = X;
  if (MZ.mid !== mid) { MZ.mid = mid; MZ.slot = (X.meP || X.P[0]).player_slot; MZ.coAlt = 0; NW.ml = (X.meP || X.P[0]).assigned_lane; NW.mw = 'full'; }
  NW.mt = ['ov', 'co', 'ln', 'dm'].includes(tab) ? tab : 'ov';
  const mi = X.mi, st = tsOf(mi.start_time), k0 = X.P.filter(p => teamOf(p.team) === 0).reduce((s, p) => s + (p.kills || 0), 0), k1 = X.P.filter(p => teamOf(p.team) === 1).reduce((s, p) => s + (p.kills || 0), 0);
  const my = X.meP ? (teamOf(X.meP.team) === X.win ? ['Победа', 'win'] : ['Поражение', 'loss']) : null;
  V(`<a class="bk" href="#home">‹ ${ME ? esc(ME.name) : 'Профиль'}</a>
    <section class="mh"><div class="mh-t t0"><b>${TEAMN[0]}</b>${X.win === 0 ? '<em>Победа</em>' : ''}${mi.average_badge_team0 ? rankImg(mi.average_badge_team0, 'rk') : ''}</div>
      <div class="mh-c">${my ? `<span class="res ${my[1]}">${my[0]}</span>` : ''}<div class="sc"><span class="a">${k0}</span><i>:</i><span class="b">${k1}</span></div><small>${mmss(X.dur)} · ${esc(MODE({match_mode: mi.match_mode}))}${st ? ' · ' + esc(ago(st)) : ''}</small></div>
      <div class="mh-t t1">${mi.average_badge_team1 ? rankImg(mi.average_badge_team1, 'rk') : ''}${X.win === 1 ? '<em>Победа</em>' : ''}<b>${TEAMN[1]}</b></div></section>
    <nav class="tabs" id="mtabs">${[['ov', 'Обзор'], ['co', 'Разбор'], ['ln', 'Линии'], ['dm', 'Урон']].map(([k, v]) => `<button type="button" data-mt="${k}" class="${NW.mt === k ? 'on' : ''}">${v}</button>`).join('')}</nav>
    <div id="mb"></div><div class="ftr"><span>Матч ${X.mid}</span><span>данные — api.deadlock-api.com</span></div>`);
  nvMatchBody();
  $('#v').onclick = e => {
    const tb = e.target.closest('[data-mt]'); if (tb) { NW.mt = tb.dataset.mt; try { history.replaceState(null, '', '#m/' + X.mid + '/' + NW.mt); } catch (er) {} nvMatchBody(); return; }
    const ct = e.target.closest('[data-cotask]'); if (ct) { if (ct.dataset.cotask === 'off') coTaskSave(null); else { const p = mSel(), F = coFacts(p), P = coProblems(F).find(x => x.k === ct.dataset.cotask); if (P) coTaskSave({k: P.k, h: P.h || 0, n: P.task.n, aid: p.account_id, since: tsOf(MX.mi.start_time) || now(), g: {}}); } nvMatchBody(); return; }
    const ca = e.target.closest('[data-coalt]'); if (ca) { MZ.coAlt = (MZ.coAlt || 0) + 1; nvMatchBody(); return; }
    const sl = e.target.closest('[data-sl]'); if (sl) { MZ.slot = +sl.dataset.sl; MZ.coAlt = 0; const p = mSel(); if (NW.mt === 'ln') NW.ml = p.assigned_lane; nvMatchBody(); return; }
    const ln = e.target.closest('[data-lane]'); if (ln) { NW.ml = +ln.dataset.lane; nvMatchBody(); return; }
    const lw = e.target.closest('[data-lw]'); if (lw) { NW.mw = lw.dataset.lw; nvMatchBody(); return; }
    const dk = e.target.closest('[data-dmk]'); if (dk) { NW.dk = dk.dataset.dmk; nvMatchBody(); }
  };
}
function nvMatchBody() {
  const X = MX, el = $('#mb'); if (!X || !el) return;
  const p = mSel(); MZ.tab = NW.mt === 'co' ? 'co' : 'nw';
  let h = '';
  if (NW.mt === 'ov') h = sbHTML2(X, p.player_slot) + nwLeadHTML(X) + `<div class="ftr"><span>Нажми на игрока — выберешь его для «Разбора».</span><button class="btn p" type="button" data-mt="co">Разбор: ${esc(pname(p))} ›</button></div>`;
  else if (NW.mt === 'co') h = nwPick(X, p) + mCo();
  else if (NW.mt === 'ln') h = `<div class="cd">${nwLaneHTML(X, NW.ml, NW.mw, X.meP)}</div>`;
  else h = nwDmgHTML(X, p);
  el.innerHTML = h;
  if (NW.mt === 'co') coLate(p);
  $$('#mtabs button').forEach(b => b.classList.toggle('on', b.dataset.mt === NW.mt));
}
const nwPick = (X, p) => `<div class="pk">${[0, 1].map(k => `<div class="pk-t t${k}">${X.P.filter(q => teamOf(q.team) === k).map(q => `<button type="button" data-sl="${q.player_slot}" class="${q === p ? 'on' : ''}" title="${esc(pname(q))} · ${esc(hero(q.hero_id).n)}">${face(q.hero_id, '', 's')}<span>${esc(pname(q))}</span></button>`).join('')}</div>`).join('<i>vs</i>')}</div>`;
function nwLeadHTML(X) {
  const T = []; for (let t = 0; t < X.dur; t += 60) T.push(t); T.push(X.dur);
  const D2 = T.map(t => X.P.reduce((s, p) => s + (teamOf(p.team) === 0 ? 1 : -1) * mAt(p, t), 0)), mx = Math.max(1000, ...D2.map(Math.abs)), W = 1000, Hh = 120;
  const y = v => Hh / 2 - v / mx * (Hh / 2 - 6), x = i => i / Math.max(1, T.length - 1) * W, pts = D2.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const best0 = Math.max(0, ...D2), best1 = Math.max(0, ...D2.map(v => -v));
  return `<div class="cd lead-c"><div class="cd-h">Перевес по душам<span class="sp"></span><span style="color:var(--t0)">${TEAMN[0]} до +${kFmt(best0)}</span>&nbsp;·&nbsp;<span style="color:var(--t1)">${TEAMN[1]} до +${kFmt(best1)}</span></div>
    <svg class="lead" viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none" role="img" aria-label="Перевес по душам по ходу матча"><defs><clipPath id="nlt"><rect x="0" y="0" width="${W}" height="${Hh / 2}"/></clipPath><clipPath id="nlb"><rect x="0" y="${Hh / 2}" width="${W}" height="${Hh / 2}"/></clipPath></defs>
    <polygon points="0,${Hh / 2} ${pts} ${W},${Hh / 2}" fill="rgba(245,165,36,.35)" clip-path="url(#nlt)"/><polygon points="0,${Hh / 2} ${pts} ${W},${Hh / 2}" fill="rgba(79,157,255,.35)" clip-path="url(#nlb)"/>
    <line x1="0" y1="${Hh / 2}" x2="${W}" y2="${Hh / 2}" stroke="#323743" stroke-width="1" vector-effect="non-scaling-stroke"/><polyline points="${pts}" fill="none" stroke="#eceae4" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>
    <div class="ftr lead-x"><span>0:00</span><span>${mmss(X.dur / 2)}</span><span>${mmss(X.dur)}</span></div></div>`;
}
const NW_LW = [['full', 'Вся игра', 0, 1e9], ['0', '0–5', 0, 300], ['5', '5–10', 300, 600], ['10', '10–15', 600, 900], ['15', '15–20', 900, 1200], ['20', '20–25', 1200, 1500], ['25', '25–30', 1500, 1800], ['30', '30+', 1800, 1e9]];
function nwLaneHTML(X, lane, w, focus) {
  const lanes = [...new Set(X.P.map(p => p.assigned_lane))].filter(l => LANEN[l]).sort((a, b) => a - b);
  if (!lanes.includes(lane)) lane = lanes[0];
  const W = NW_LW.find(x => x[0] === w) || NW_LW[0], t0 = Math.min(W[2], X.dur), t1 = Math.min(W[3], X.dur);
  const L = X.P.filter(p => p.assigned_lane === lane), A = L.filter(p => teamOf(p.team) === 0), B = L.filter(p => teamOf(p.team) === 1);
  const mine = focus && focus.assigned_lane === lane ? focus : null, left = mine && teamOf(mine.team) === 1 ? B : A, right = left === A ? B : A;
  const v = (P, k) => P.reduce((s, p) => s + mAt(p, t1, k) - (t0 ? mAt(p, t0, k) : 0), 0);
  const R = [['Души', 'net_worth'], ['Убийства', 'kills'], ['Смерти', 'deaths'], ['Помощь', 'assists'], ['Добито крипов', 'creep_kills'], ['Денаи', 'denies'], ['Урон по героям', 'player_damage'], ['Лечение', 'player_healing'], ['Получено урона', 'player_damage_taken']];
  const lv = P => P.length ? Math.max(...P.map(p => mAt(p, t1, 'level'))) : 0, dS = v(left, 'net_worth') - v(right, 'net_worth');
  const side = P => `<div class="pr">${P.map(p => `<span>${face(p.hero_id, '', '')}<b>${esc(pname(p))}</b>${esc(hero(p.hero_id).n)}</span>`).join('')}</div>`;
  const fmt = (k, x) => /net_worth|player_/.test(k) ? kFmt(x) : nf(x);
  return `<div class="lc"><div class="lc-top">${nwSeg('', lanes.map(l => [l, LANEN[l][0] + ' линия']), lane, 'lane')}<span class="sp" style="flex:1"></span>${nwSeg('', NW_LW.map(x => [x[0], x[1]]), W[0], 'lw')}</div>
    <div class="lc-vs">${side(left)}<i>VS</i>${side(right)}</div>
    <div class="lc-res"><span class="chip ${dS >= 0 ? 'w' : 'l'}">${dS >= 0 ? 'Линия выиграна' : 'Линия проиграна'} ${dS >= 0 ? '+' : '−'}${kFmt(Math.abs(dS))} душ</span></div>
    ${R.map(([nm, k]) => { const a = Math.max(0, v(left, k)), b = Math.max(0, v(right, k)), s = a + b || 1; return `<div class="lc-row"><b>${fmt(k, a)}</b><div class="lc-bar"><small>${nm}</small><div><i class="a" style="width:${(100 * a / s).toFixed(1)}%"></i><i class="b" style="width:${(100 * b / s).toFixed(1)}%"></i></div></div><b>${fmt(k, b)}</b></div>`; }).join('')}
    <div class="lc-row"><b>${lv(left)}</b><div class="lc-bar"><small>Уровень</small><div><i class="a" style="width:${(100 * lv(left) / Math.max(1, lv(left) + lv(right))).toFixed(1)}%"></i><i class="b" style="width:${(100 * lv(right) / Math.max(1, lv(left) + lv(right))).toFixed(1)}%"></i></div></div><b>${lv(right)}</b></div></div>`;
}
const NW_DMK = [['dmg', 'Урон по героям'], ['obj', 'По объектам'], ['heal', 'Лечение'], ['tak', 'Получено урона']];
function nwDmgHTML(X, p) {
  const k = NW.dk, val = q => X.M.get(q)[k] || 0, L = X.P.slice().sort((a, b) => val(b) - val(a)), mx = Math.max(1, ...L.map(val));
  const IN = typeof coDmgIn === 'function' ? coDmgIn(X, p) : null;
  const who = IN && IN.L.length ? `<div class="cd"><div class="cd-h">Кто бил ${esc(pname(p))}<span class="sp"></span><span>${kFmt(IN.tot)} урона</span></div><div class="db">${IN.L.slice(0, 6).map((o, i) => `<div class="r t${teamOf(o.q.team)}"><em>${i + 1}</em>${face(o.q.hero_id, '', 's')}<b>${esc(hero(o.q.hero_id).n)}</b><div class="bar"><i style="width:${(100 * o.v / IN.L[0].v).toFixed(1)}%"></i></div><span class="v">${Math.round(100 * o.v / IN.tot)}%</span></div>`).join('')}</div></div>` : '';
  return `<div class="dm2"><div class="cd"><div class="hgf">${nwSeg('', NW_DMK, k, 'dmk')}</div><div class="db">${L.map((q, i) => `<div class="r t${teamOf(q.team)}${q === p ? ' on' : ''}" data-sl="${q.player_slot}"><em>${i + 1}</em>${face(q.hero_id, '', 's')}<b>${esc(pname(q))}</b><div class="bar"><i style="width:${(100 * val(q) / mx).toFixed(1)}%"></i></div><span class="v">${kFmt(val(q))}</span></div>`).join('')}</div></div>${who}</div>`;
}

// ---------- игрок: герои ----------
const NW_PS = [['m', 'Игр', x => x.matches_played], ['wr', 'Винрейт', x => x.wins / Math.max(1, x.matches_played)], ['kda', 'KDA', nwKda], ['spm', 'Души/мин', x => x.networth_per_min || 0], ['dpm', 'Урон/мин', x => x.damage_per_min || 0], ['last', 'Последняя', x => x.last_played || 0]];
function nvPHeroes(n, head, pool) {
  const draw = () => {
    const c = NW_PS.find(x => x[0] === NW.ps) || NW_PS[0], L = pool.slice().sort((a, b) => c[2](b) - c[2](a));
    put(n, '#phw', `<div class="tw"><table class="tb2"><thead><tr><th class="l">Герой</th>${NW_PS.map(([k, v]) => `<th><button type="button" data-ps="${k}" class="${k === c[0] ? 'on' : ''}">${v}</button></th>`).join('')}</tr></thead>
      <tbody>${L.map(x => `<tr><td class="l"><a href="#h/${x.hero_id}">${heroImg(x.hero_id)}<b>${esc(hero(x.hero_id).n)}</b></a></td><td>${nf(x.matches_played)}</td><td>${nwWr(x.wins, x.matches_played)}</td><td>${f2(nwKda(x))}</td><td>${nf(x.networth_per_min || 0)}</td><td>${nf(x.damage_per_min || 0)}</td><td class="mu">${x.last_played ? esc(ago(x.last_played)) : '—'}</td></tr>`).join('')}</tbody></table></div>`);
  };
  V(head + `<div class="cd" id="phw"></div>`); draw();
  $('#phw').onclick = e => { const b = e.target.closest('[data-ps]'); if (b) { NW.ps = b.dataset.ps; draw(); } };
}

// ---------- игрок: статистика ----------
function nvPStats(n, head, H) {
  const draw = () => {
    const L = H.slice(0, NW.sn), wr = pc(L.filter(nwWon).length, L.length);
    // форма: винрейт скользящим окном по 10
    const R = L.slice().reverse(), roll = R.map((m, i) => { const S = R.slice(Math.max(0, i - 9), i + 1); return 100 * S.filter(nwWon).length / S.length; });
    const W = 1000, Hh = 140, x = i => i / Math.max(1, roll.length - 1) * W, y = v => Hh - 8 - v / 100 * (Hh - 16), pts = roll.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const form = `<div class="cd"><div class="cd-h">Форма<span class="sp"></span><span>винрейт за ${L.length}: <b>${wr}%</b></span></div>
      <svg class="spark" viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none" role="img" aria-label="Винрейт по 10 матчей"><line x1="0" y1="${y(50)}" x2="${W}" y2="${y(50)}" stroke="#323743" stroke-dasharray="6 6" vector-effect="non-scaling-stroke"/>
      <polygon points="0,${Hh} ${pts} ${W},${Hh}" fill="rgba(245,165,36,.16)"/><polyline points="${pts}" fill="none" stroke="#f5a524" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>
      <div class="ftr lead-x"><span>${L.length} матчей назад</span><span>пунктир — 50%</span><span>сейчас</span></div></div>`;
    const bars = (title, G) => `<div class="cd"><div class="cd-h">${title}</div><div class="brs">${G.filter(g => g.n).map(g => { const v = pc(g.w, g.n); return `<div><span>${esc(g.t)}</span><div class="bar"><i style="width:${v}%;background:${v >= 52 ? 'var(--win)' : v <= 47 ? 'var(--loss)' : 'var(--am)'}"></i></div><em><b>${v}%</b>${g.n} ${pl(g.n, ['игра', 'игры', 'игр'])}</em></div>`; }).join('') || '<div class="em">Мало матчей.</div>'}</div></div>`;
    const grp = (f, keys) => keys.map(([k, t]) => { const S = L.filter(m => f(m) === k); return {t, n: S.length, w: S.filter(nwWon).length}; });
    const HC = {}; L.forEach(m => { const o = HC[m.hero_id] = HC[m.hero_id] || {t: hero(m.hero_id).n, n: 0, w: 0}; o.n++; if (nwWon(m)) o.w++; });
    const byLen = grp(m => { const d = (m.match_duration_s || 0) / 60; return d < 25 ? 0 : d < 32 ? 1 : d < 40 ? 2 : 3; }, [[0, 'до 25 мин'], [1, '25–32 мин'], [2, '32–40 мин'], [3, '40+ мин']]);
    const byTime = grp(m => Math.floor(new Date(m.start_time * 1000).getHours() / 6), [[0, 'ночью'], [1, 'утром'], [2, 'днём'], [3, 'вечером']]);
    const byMode = grp(m => m.match_mode === 4 ? 0 : 1, [[0, 'ранговые'], [1, 'обычные']]);
    const half = k => { const a = L.slice(0, Math.floor(L.length / 2)), b = L.slice(Math.floor(L.length / 2)); const av = (S, f) => S.reduce((s, m) => s + f(m), 0) / Math.max(1, S.length); return [av(a, k), av(b, k)]; };
    const tr = [['KDA', m => (m.player_kills + m.player_assists) / Math.max(1, m.player_deaths), f2, 0], ['Смерти', m => m.player_deaths, f1, 1], ['Души/мин', m => m.net_worth / Math.max(5, (m.match_duration_s || 600) / 60), nf, 0], ['Добито за игру', m => m.last_hits || 0, nf, 0]];
    const trend = `<div class="cd"><div class="cd-h">Сейчас против раньше<span class="sp"></span><span>свежая половина · старая</span></div><div class="kpi">${tr.map(([nm, f, fm, low]) => { const [a, b] = half(f), up = low ? a < b : a > b; return `<span><small>${nm}</small><b class="${Math.abs(a - b) / Math.max(.01, b) < .05 ? '' : up ? 'win' : 'loss'}">${fm(a)}</b><em class="mu">было ${fm(b)}</em></span>`; }).join('')}</div></div>`;
    put(n, '#psw', `<div class="hgf">${nwSeg('pss', [[20, '20 матчей'], [50, '50 матчей'], [100, '100 матчей']], NW.sn, 'sn')}</div>${form}<div class="stg">${trend}${bars('По героям', Object.values(HC).filter(g => g.n >= 2).sort((a, b) => b.n - a.n).slice(0, 8))}${bars('По длине матча', byLen)}${bars('По времени суток', byTime)}${bars('Режим', byMode)}</div>`);
  };
  V(head + '<div id="psw"></div>'); draw();
  $('#psw').onclick = e => { const b = e.target.closest('[data-sn]'); if (b) { NW.sn = +b.dataset.sn; draw(); } };
}

// ---------- герои ----------
const NW_ROLES = [['', 'Все'], ['marksman', 'Стрелки'], ['brawler', 'Бойцы'], ['mystic', 'Мистики'], ['assassin', 'Убийцы']];
const nwTier = v => v >= 54 ? 'S' : v >= 52 ? 'A' : v >= 50 ? 'B' : v >= 48 ? 'C' : 'D';
async function nvHeroes() {
  const n = vNew();
  V(`<h1 class="pt">Все <em>герои</em></h1><div class="hgf">${fltHTML()}${nwSeg('hsr', [['wr', 'По винрейту'], ['pr', 'По популярности'], ['az', 'А–Я']], NW.hs, 'hs')}${nwSeg('hro', NW_ROLES, NW.hr, 'hr')}</div><div id="hgw"><div class="ld">Считаю героев…</div></div>`);
  fltBind(() => nvHeroes());
  $$('#hsr button').forEach(b => b.onclick = () => { NW.hs = b.dataset.hs; nvHeroes(); });
  $$('#hro button').forEach(b => b.onclick = () => { NW.hr = b.dataset.hr; nvHeroes(); });
  let S; try { S = await api('analytics/hero-stats?' + fq()); } catch (e) { put(n, '#hgw', `<div class="er">Не вышло: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  const tot = S.reduce((a, x) => a + x.matches, 0) / 12 || 1;
  let L = S.filter(x => D.heroes[x.hero_id] && (!NW.hr || hero(x.hero_id).ty === NW.hr)).map(x => ({id: x.hero_id, wr: 100 * x.wins / Math.max(1, x.matches), pr: 100 * x.matches / tot, m: x.matches}));
  L.sort(NW.hs === 'pr' ? (a, b) => b.pr - a.pr : NW.hs === 'az' ? (a, b) => hero(a.id).n.localeCompare(hero(b.id).n) : (a, b) => b.wr - a.wr);
  put(n, '#hgw', `<div class="hg">${L.map(x => { const t = nwTier(x.wr); return `<a class="hc" href="#h/${x.id}"><div class="im"><img src="${esc(nwCard(x.id))}" alt="" loading="lazy" onerror="${noimg}"></div><span class="tr ${t}">${t}</span>
    <div class="bt"><b>${esc(hero(x.id).n)}</b><span><b class="${x.wr >= 52 ? 'win' : x.wr <= 47 ? 'loss' : ''}">${f1(x.wr)}%</b><span>${f1(x.pr)}% игр</span></span></div></a>`; }).join('')}</div>
    <p class="ftr"><span>${esc(fName())} · ${nf(tot)} матчей</span><span>S — винрейт 54%+, A — 52%+, B — 50%+</span></p>`);
}
async function nvHero(hid) {
  const n = vNew(), h = hero(hid);
  if (!D.heroes[hid]) { V('<div class="em">Нет такого героя.</div>'); return; }
  V(`<a class="bk" href="#heroes">‹ Все герои</a><section class="hb"><i class="hb-bg" style="background-image:url('${esc(h.bg || '')}')"></i>
    <div class="hb-l"><div class="tg"><span class="chip a">${esc(TYPE_RU[h.ty] || 'Герой')}</span>${h.cx ? `<span class="chip">сложность ${h.cx} из 3</span>` : ''}<span class="chip" id="hbt">…</span></div><h1>${esc(h.n)}</h1>
      <div class="hb-ab">${(h.ab || []).slice(0, 4).map((a, i) => `<span>${a.i ? `<img src="${esc(a.i)}" alt="" loading="lazy" onerror="${noimg}">` : ''}${i + 1}. ${esc(a.n)}</span>`).join('')}</div></div>
    <div class="hb-r"><img src="../art/${hid}.webp" alt="" onerror="this.src='${esc(h.v || h.c || '')}';this.onerror=null"></div></section>
    <div class="hgf">${fltHTML()}</div><div id="hpw"><div class="ld">Считаю…</div></div>`);
  fltBind(() => nvHero(hid));
  let S, IS, CS, SY;
  try { [S, IS, CS, SY] = await Promise.all([api('analytics/hero-stats?' + fq()), api(`analytics/item-stats?hero_id=${hid}&${fq()}`).catch(() => []), api('analytics/hero-counter-stats?' + fq() + '&min_matches=30').catch(() => []), api('analytics/hero-synergy-stats?' + fq()).catch(() => [])]); }
  catch (e) { put(n, '#hpw', `<div class="er">Не вышло: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  const x = S.find(z => z.hero_id === hid); if (!x) { put(n, '#hpw', '<div class="em">По этому герою нет матчей за выбранный период.</div>'); return; }
  const tot = S.reduce((a, z) => a + z.matches, 0) / 12 || 1, wr = 100 * x.wins / Math.max(1, x.matches), place = 1 + S.filter(z => D.heroes[z.hero_id] && z.wins / Math.max(1, z.matches) > x.wins / Math.max(1, x.matches)).length;
  const tEl = $('#hbt'); if (tEl) tEl.textContent = `${nwTier(wr)} · №${place} из ${S.filter(z => D.heroes[z.hero_id]).length} по винрейту`;
  const strip = `<div class="hst"><div class="cd"><small>Винрейт</small><b class="${wr >= 52 ? 'win' : wr <= 47 ? 'loss' : ''}">${f1(wr)}%</b><em>№${place} по винрейту</em></div><div class="cd"><small>Популярность</small><b>${f1(100 * x.matches / tot)}%</b><em>доля матчей</em></div>
    <div class="cd"><small>KDA</small><b>${f2((x.total_kills + x.total_assists) / Math.max(1, x.total_deaths))}</b><em>${f1(x.total_kills / x.matches)} / ${f1(x.total_deaths / x.matches)} / ${f1(x.total_assists / x.matches)}</em></div>
    <div class="cd"><small>Урон</small><b>${kFmt(x.total_player_damage / Math.max(1, x.matches))}</b><em>за матч</em></div><div class="cd"><small>Матчей</small><b>${kFmt(x.matches)}</b><em>${esc(fName())}</em></div></div>`;
  // сборка: по фазам, в порядке покупки
  const min = Math.max(30, x.matches * 0.03), ok = IS.filter(z => item(z.item_id) && z.matches >= min);
  const PH = [['Линия', '0–10 мин', 0, 600], ['Середина', '10–22 мин', 600, 1320], ['Поздняя игра', '22+ мин', 1320, 1e9]];
  const used = new Set(), phase = PH.map(([t, sub, a, b]) => { const L = ok.filter(z => z.avg_buy_time_s >= a && z.avg_buy_time_s < b && !used.has(z.item_id)).sort((p, q) => q.matches - p.matches).slice(0, 6).sort((p, q) => p.avg_buy_time_s - q.avg_buy_time_s); L.forEach(z => used.add(z.item_id)); return {t, sub, L}; });
  let k = 0;
  const build = `<div class="cd"><div class="cd-h">Сборка ${esc(h.n)}<span class="sp"></span><span>что берут чаще всего, в порядке покупки</span></div><div class="bp">${phase.map(P => `<div class="bp-c"><h4>${P.t}<span>${P.sub}</span></h4>${P.L.map(z => { k++; const I = item(z.item_id), v = 100 * z.wins / Math.max(1, z.matches); return `<div class="bp-r"><em>${k}</em><img src="${esc(I.i)}" alt="" loading="lazy" onerror="${noimg}"><b>${esc(I.n)}</b><span><strong>~${Math.max(1, Math.round(z.avg_buy_time_s / 60))} мин</strong><span class="${v >= 52 ? 'win' : v <= 47 ? 'loss' : 'mu'}">${f1(v)}%</span></span></div>`; }).join('') || '<div class="em">Мало данных</div>'}</div>`).join('')}</div></div>`;
  // против кого и с кем
  const vs = CS.filter(z => z.hero_id === hid && D.heroes[z.enemy_hero_id] && z.matches_played >= 50).map(z => ({id: z.enemy_hero_id, wr: 100 * z.wins / z.matches_played, m: z.matches_played})).sort((a, b) => a.wr - b.wr);
  const syn = SY.filter(z => (z.hero_id1 === hid || z.hero_id2 === hid) && z.matches_played >= 50).map(z => ({id: z.hero_id1 === hid ? z.hero_id2 : z.hero_id1, wr: 100 * z.wins / z.matches_played, m: z.matches_played})).filter(z => D.heroes[z.id]).sort((a, b) => b.wr - a.wr);
  const mu = (L, cls) => L.length ? `<div class="mu3 ${cls}">${L.map(z => `<a href="#h/${z.id}"><img src="${esc(nwCard(z.id))}" alt="" loading="lazy" onerror="${noimg}"><span><b>${f1(z.wr)}%</b><small>${esc(hero(z.id).n)}</small></span></a>`).join('')}</div>` : '<div class="em">Мало данных</div>';
  const best = ok.slice().sort((p, q) => q.wins / q.matches - p.wins / p.matches), tiers = [['S+', best.slice(0, 5)], ['S', best.slice(5, 10)], ['A', best.slice(10, 15)]];
  const grid = `<div class="hgr"><div class="cd"><div class="cd-h">Тяжело против</div>${mu(vs.slice(0, 3), 'bad')}</div><div class="cd"><div class="cd-h">Легко против</div>${mu(vs.slice(-3).reverse(), 'good')}</div><div class="cd"><div class="cd-h">Лучшие напарники</div>${mu(syn.slice(0, 3), 'good')}</div></div>
    <div class="hgr"><div class="cd" style="grid-column:span 2"><div class="cd-h">Лучшие предметы<span class="sp"></span><span>по винрейту</span></div><div class="it3">${tiers.map(([t, L]) => L.length ? `<div><b>${t}</b><span>${L.map(z => { const I = item(z.item_id); return `<i title="${esc(I.n)}"><img src="${esc(I.i)}" alt="" loading="lazy" onerror="${noimg}">${f1(100 * z.wins / z.matches)}%</i>`; }).join('')}</span></div>` : '').join('')}</div></div>
    <div class="cd" id="hmy"><div class="cd-h">Ты на ${esc(h.n)}</div><div class="em">${ME ? 'Считаю…' : 'Найди себя в поиске — покажу твою игру на герое.'}</div></div></div>`;
  put(n, '#hpw', strip + build + grid);
  if (ME) {
    const [HS, H] = await Promise.all([api('players/hero-stats?account_ids=' + ME.id).catch(() => []), api('players/' + ME.id + '/match-history').catch(() => [])]);
    if (n !== VQ) return;
    const r = HS.find(z => z.hero_id === hid), M = H.filter(m => m.hero_id === hid).slice(0, 5);
    put(n, '#hmy', `<div class="cd-h">Ты на ${esc(h.n)}</div>${r ? `<div class="kpi"><span><small>Игр</small><b>${nf(r.matches_played)}</b></span><span><small>Винрейт</small>${nwWr(r.wins, r.matches_played)}</span><span><small>KDA</small><b>${f2(nwKda(r))}</b></span></div>
      <div class="thl" style="margin-top:10px">${M.map(m => `<a href="#m/${m.match_id}">${heroImg(m.hero_id)}<span><b class="${nwWon(m) ? 'win' : 'loss'}">${nwWon(m) ? 'Победа' : 'Поражение'}</b><small>${m.player_kills}/${m.player_deaths}/${m.player_assists} · ${esc(ago(m.start_time))}</small></span><em>›</em></a>`).join('')}</div>` : '<div class="em">Ты ещё не играл на этом герое.</div>'}`);
  }
}

// ---------- лидеры ----------
const NW_RG = [['Europe', 'Европа'], ['NAmerica', 'Сев. Америка'], ['SAmerica', 'Юж. Америка'], ['Asia', 'Азия'], ['Oceania', 'Океания']];
async function nvLb(rg) {
  rg = NW_RG.some(x => x[0] === rg) ? rg : NW.lb; NW.lb = rg; const n = vNew();
  V(`<h1 class="pt">Лиде<em>ры</em></h1><div class="hgf">${nwSeg('lbr', NW_RG, rg, 'rg')}<input class="sel" id="lbq" placeholder="Найти ник" aria-label="Найти ник" style="flex:1;max-width:260px"></div><div id="lbw"><div class="ld">Загружаю топ…</div></div>`);
  $$('#lbr button').forEach(b => b.onclick = () => { location.hash = '#lb/' + b.dataset.rg; });
  let R; try { R = await api('leaderboard/' + rg); } catch (e) { put(n, '#lbw', `<div class="er">Не вышло: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  const E = (R.entries || []).slice(0, 500);
  const draw = q => { const L = (q ? E.filter(e => String(e.account_name || '').toLowerCase().includes(q)) : E).slice(0, q ? 100 : 200);
    put(n, '#lbw', `<div class="lb">${L.map(e => { const one = (e.possible_account_ids || []).length === 1 ? e.possible_account_ids[0] : 0, tag = one ? 'a' : 'div';
      return `<${tag} class="r${e.rank <= 3 ? ' t3' : ''}"${one ? ` href="?id=${one}#home"` : ''}><span class="pl">${e.rank}</span><span><b>${esc(e.account_name || '—')}</b></span><span class="hs3">${(e.top_hero_ids || []).slice(0, 3).map(h => `<img src="${esc(hero(h).i)}" alt="" title="${esc(hero(h).n)}" loading="lazy" onerror="${noimg}">`).join('')}</span></${tag}>`; }).join('') || '<div class="em">Никого не нашёл</div>'}</div>`); };
  draw(''); $('#lbq').oninput = e => draw(e.target.value.trim().toLowerCase());
}

// ---------- лайв-матч ----------
async function nvLive(arg) {
  const n = vNew(), aid = +arg || (ME ? ME.id : 0);
  V(`<h1 class="pt">Лайв-<em>матч</em></h1><div class="lv"><form id="lvf" autocomplete="off"><input id="lvq" placeholder="Ник, ссылка Steam или ID" aria-label="Игрок"><button class="btn p" type="submit">Найти</button></form>
    <div class="nh-dd hide" id="lvd" style="position:static;max-width:560px;margin:-8px 0 16px"></div></div>
    <div id="lvb">${aid ? '<div class="ld">Ищу живой матч…</div>' : '<div class="cd em">Введи ник или ID — покажу всех 12 игроков его текущего матча: ранг, игры и винрейт на герое.</div>'}</div>`);
  nwFind($('#lvq'), $('#lvd'), id => { location.hash = '#live/' + id; });
  if (!aid) return;
  let A; try { A = await live(`matches/active?account_id=${aid}`); } catch (e) { put(n, '#lvb', `<div class="er">Не вышло: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  const m = (A || [])[0];
  if (!m) { await steamNames([aid]); if (n !== VQ) return; put(n, '#lvb', `<div class="cd em">${esc((SN[aid] || {}).n || 'Игрок')} сейчас не в матче. <a class="am" href="?id=${aid}#home">Открыть профиль ›</a></div>`); return; }
  const P = m.players || [], ids = P.map(p => p.account_id).filter(Boolean), q = 'account_ids=' + ids.join(',');
  const [, RK, HS] = await Promise.all([steamNames(ids), api('players/rank?' + q).catch(() => []), api('players/hero-stats?' + q).catch(() => [])]);
  if (n !== VQ) return;
  const rk = {}; (RK || []).forEach(r => rk[r.account_id] = r.badge || 0);
  const row = p => { const s = (HS || []).find(z => z.account_id === p.account_id && z.hero_id === p.hero_id), sn = SN[p.account_id] || {};
    return `<a class="lvp${p.account_id === aid ? ' me' : ''}" href="?id=${p.account_id}#home">${face(p.hero_id, '', '')}<span><b>${esc(sn.n || 'Игрок')}</b><small>${esc(hero(p.hero_id).n)}${rk[p.account_id] ? ' · ' + esc(rankOf(rk[p.account_id]).name) : ''}</small></span>
      <span class="r">${s ? `<strong>${games(s.matches_played)}</strong>на герое · ${pc(s.wins, s.matches_played)}%` : '<strong>первая игра</strong>на герое'}</span></a>`; };
  const st = m.start_time ? Math.max(0, now() - m.start_time) : 0;
  put(n, '#lvb', `<div class="cd" style="margin-bottom:14px"><div class="cd-h">Идёт матч<span class="sp"></span><span>${esc(m.match_mode_parsed === 'Ranked' ? 'Ранговый' : m.match_mode_parsed === 'Unranked' ? 'Обычный' : (m.match_mode_parsed || ''))}${st ? ' · идёт ' + mmss(st) : ''}</span></div></div>
    <div class="lvt">${[0, 1].map(k => `<div class="cd"><div class="cd-h" style="color:var(--t${k})">${TEAMN[k]}</div>${P.filter(p => teamOf(p.team) === k).map(row).join('')}</div>`).join('')}</div>`);
}

// ---------- патчи ----------
async function nvUpd(sel) {
  const n = vNew();
  V(`<h1 class="pt">Пат<em>чи</em></h1><div id="upw"><div class="ld">Загружаю патчноуты…</div></div>`);
  let P; try { P = await apiU(API2 + 'patches'); if (typeof upLoad === 'function') await upLoad().catch(() => null); } catch (e) { put(n, '#upw', `<div class="er">Не вышло: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  P = (P || []).slice().sort((a, b) => Date.parse(b.pub_date) - Date.parse(a.pub_date)).slice(0, 24);
  if (!P.length) { put(n, '#upw', '<div class="em">Патчноутов нет.</div>'); return; }
  let i = sel != null && sel !== '' && P[+sel] ? +sel : P.findIndex(p => parsePatch(p).patch); if (i < 0) i = 0;
  const p = P[i], X = parsePatch(p), lines = X.out.filter(x => x.t === 'l'), ch = {};
  lines.forEach(x => { if (!x.h) return; const o = ch[x.h] = ch[x.h] || {u: 0, d: 0, n: 0}; o.n++; if (x.k === 'u') o.u++; if (x.k === 'd') o.d++; });
  const G = {d: [], m: [], u: []}; Object.entries(ch).forEach(([h, o]) => { (o.d > o.u && !o.u ? G.d : o.u > o.d && !o.d ? G.u : G.m).push([+h, o]); });
  const tr = s => { const t = typeof upTr === 'function' ? upTr(s) : null; return t ? `${esc(t)}<small>${esc(s)}</small>` : esc(s); };
  const ln = x => `<div class="${x.k === 'u' ? 'u' : x.k === 'd' ? 'd' : ''}"><i>${x.k === 'u' ? '▲' : x.k === 'd' ? '▼' : '•'}</i><span>${tr(x.s)}</span></div>`;
  const grp = (k, t) => G[k].length ? `<div class="ugrp ${k}"><h3>${t} · ${G[k].length}</h3><div class="uhg">${G[k].sort((a, b) => b[1].n - a[1].n).map(([h, o]) => `<button type="button" data-uh="${h}" class="${NW.uh === h ? 'on' : ''}"><img src="${esc(nwCard(h))}" alt="" loading="lazy" onerror="${noimg}"><span>${esc(hero(h).n)}</span><em>${o.u ? `<i class="u">+${o.u}</i>` : ''}${o.d ? `<i class="d">−${o.d}</i>` : ''}</em></button>`).join('')}</div></div>` : '';
  const heroLines = () => { const hs = NW.uh && ch[NW.uh] ? [NW.uh] : Object.keys(ch).map(Number).sort((a, b) => ch[b].n - ch[a].n);
    return hs.map(h => `<h4>${esc(hero(h).n)}</h4>${lines.filter(x => x.h === h).map(ln).join('')}`).join(''); };
  const items = lines.filter(x => !x.h && x.i), gen = lines.filter(x => !x.h && !x.i);
  const t = Math.floor(Date.parse(p.pub_date) / 1000);
  put(n, '#upw', `<div class="up"><div class="upl">${P.map((x, k) => `<button type="button" data-i="${k}" class="${k === i ? 'on' : ''}"><b>${esc(x.title || 'Без названия')}</b><small>${esc(new Date(Date.parse(x.pub_date)).toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'}))}</small></button>`).join('')}</div>
    <div><div class="uph"><h2>${esc(p.title || 'Патч')}</h2><p>${t ? esc(ago(t)) + ' · ' : ''}${nf(lines.length)} ${pl(lines.length, ['изменение', 'изменения', 'изменений'])}${Object.keys(ch).length ? ` · ${Object.keys(ch).length} ${pl(Object.keys(ch).length, ['герой', 'героя', 'героев'])}` : ''}</p></div>
      ${grp('d', 'Ослаблены')}${grp('m', 'Изменены')}${grp('u', 'Усилены')}
      ${Object.keys(ch).length ? `<div class="cd" style="margin-bottom:14px"><div class="cd-h">Герои${NW.uh ? `<span class="sp"></span><a href="javascript:void 0" data-uh="0">Показать всех</a>` : ''}</div><div class="uln">${heroLines()}</div></div>` : ''}
      ${items.length ? `<div class="cd" style="margin-bottom:14px"><div class="cd-h">Предметы</div><div class="uln">${items.map(ln).join('')}</div></div>` : ''}
      ${gen.length ? `<div class="cd"><div class="cd-h">Общее</div><div class="uln">${gen.slice(0, 80).map(ln).join('')}</div></div>` : ''}
      ${!lines.length ? `<div class="cd uln">${X.out.filter(x => x.t === 'p').slice(0, 40).map(x => `<div><i></i><span>${tr(x.s)}</span></div>`).join('') || '<div class="em">Пусто</div>'}</div>` : ''}</div></div>`);
  $('#upw').onclick = e => { const b = e.target.closest('[data-i]'); if (b) { NW.uh = 0; location.hash = '#upd/' + b.dataset.i; return; }
    const h = e.target.closest('[data-uh]'); if (h) { NW.uh = +h.dataset.uh === NW.uh ? 0 : +h.dataset.uh; nvUpd(String(i)); } };
}
