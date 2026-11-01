// ==================== 01.11 (вечер) · профиль «быстрый взгляд», «Статистика» по вкладкам, патчи по-русски ====================
// Андрей: «зашёл на турнире почекать соперника — за минуту вижу главное: паттерны, герои; остальное — дальше, для глубокого изучения».

// ---------- профиль: быстрый взгляд (как Porofessor / League of Graphs) ----------
const QK_PART = [[0, 6, 'ночью'], [6, 12, 'утром'], [12, 18, 'днём'], [18, 24, 'вечером']];
function qkForm(H) {
  const won = m => m.player_team === m.match_result, L = H.slice(0, 20), w = L.filter(won).length;
  let st = 0; const r0 = L.length ? won(L[0]) : null; for (const m of L) { if (won(m) === r0) st++; else break; }
  const streak = !L.length ? '' : st >= 2 ? `${st} ${r0 ? pl(st, ['победа', 'победы', 'побед']) : pl(st, ['поражение', 'поражения', 'поражений'])} подряд` : r0 ? 'последний матч — победа' : 'последний матч — поражение';
  return {L, w, st, r0, streak};
}
function qkAct(H) {
  const t = now(), g7 = H.filter(m => m.start_time >= t - 7 * 86400).length, g30 = H.filter(m => m.start_time >= t - 30 * 86400).length;
  const P = [0, 0, 0, 0]; H.slice(0, 80).forEach(m => { const h = new Date(m.start_time * 1000).getHours(); P[Math.min(3, Math.floor(h / 6))]++; });
  const top = P.indexOf(Math.max(...P)), share = Math.round(100 * P[top] / Math.max(1, P.reduce((a, x) => a + x, 0)));
  return {g7, g30, last: H[0] ? H[0].start_time : 0, part: QK_PART[top], share};
}
function qkPool(H) {
  const C = {}; H.filter(m => m.start_time >= now() - 30 * 86400).forEach(m => C[m.hero_id] = (C[m.hero_id] || 0) + 1);
  const V2 = Object.values(C).sort((a, b) => b - a), tot = V2.reduce((a, x) => a + x, 0), top3 = V2.slice(0, 3).reduce((a, x) => a + x, 0);
  return {n: V2.length, share: tot ? Math.round(100 * top3 / tot) : 0, tot};
}

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

  // --- карточка 1: ранг, форма, когда играет ---
  const ses = curSeason(SS), SH = H.filter(m => m.match_mode === 4 && m.start_time >= ses.start), sw = SH.filter(won).length, rk = rankOf(badge);
  const F = qkForm(H), A = qkAct(H), wr20 = Math.round(100 * F.w / Math.max(1, F.L.length));
  const rkHTML = badge ? `<div class="qk-rk">${rankImg(badge, 'rk')}<div><b style="color:${esc(rk.color)}">${esc(rk.name)}</b><small id="rtop">считаю место…</small>${SH.length ? `<small>сезон: <span class="win">${sw}</span>–<span class="loss">${SH.length - sw}</span> · ${Math.round(100 * sw / SH.length)}%</small>` : ''}</div></div>`
    : `<div class="qk-rk none"><b>Без ранга</b><small>в этом сезоне ранговых нет</small></div>`;
  const cardA = `<div class="q-box qk-c qk-a"><div class="qk-h">Игрок сейчас</div>${rkHTML}
    <div class="qk-row"><span class="qk-k">Форма</span><span class="qk-v"><b class="${wrC(wr20, F.L.length)}">${wr20}%</b> за ${F.L.length} · <span class="win">${F.w}В</span> <span class="loss">${F.L.length - F.w}П</span></span></div>
    <div class="qk-dots" title="последние ${F.L.length} матчей, слева — свежие">${F.L.map(m => `<i class="${won(m) ? 'w' : 'l'}"></i>`).join('')}</div>
    <div class="qk-row"><span class="qk-k">Серия</span><span class="qk-v ${F.st >= 3 ? (F.r0 ? 'win' : 'loss') : ''}">${esc(F.streak)}</span></div>
    <div class="qk-row"><span class="qk-k">Играет</span><span class="qk-v">${A.g7} за неделю · ${A.g30} за месяц</span></div>
    <div class="qk-row"><span class="qk-k">Обычно</span><span class="qk-v">${esc(A.part[2])} (${A.part[0]}–${A.part[1]} ч) · ${A.share}% игр</span></div>
    <div class="qk-row"><span class="qk-k">Последний</span><span class="qk-v">${esc(ago(A.last))}</span></div>
    <div class="qk-row"><span class="qk-k">Средний матч</span><span class="qk-v">${f1(avg(F.L, m => m.player_kills))}/${f1(avg(F.L, m => m.player_deaths))}/${f1(avg(F.L, m => m.player_assists))} · ${nf(avg(F.L, m => m.net_worth / (Math.max(300, m.match_duration_s || 0) / 60)))} душ/мин</span></div>
    <div class="qk-row"><span class="qk-k">Длина игр</span><span class="qk-v">${mmss(avg(F.L, m => m.match_duration_s || 0))} в среднем</span></div>
    <div class="q-en qk-en" id="enr"><span class="sub">Средний ранг врагов — считаю…</span></div></div>`;

  // --- карточка 2: герои ---
  const R30 = {}; H.filter(m => m.start_time >= now() - 30 * 86400).forEach(m => { const o = R30[m.hero_id] = R30[m.hero_id] || {m: 0, w: 0, k: 0, d: 0, a: 0}; o.m++; if (won(m)) o.w++; o.k += m.player_kills; o.d += m.player_deaths; o.a += m.player_assists; });
  const r30 = Object.entries(R30).filter(([h]) => D.heroes[h]).sort((a, b) => b[1].m - a[1].m).slice(0, 5).map(([h, o]) => ({hid: +h, g: o.m, w: o.w, k: o.k / o.m, d: o.d / o.m, a: o.a / o.m}));
  const rAll = pool.filter(x => D.heroes[x.hero_id]).slice(0, 5).map(x => ({hid: x.hero_id, g: x.matches_played, w: x.wins, k: x.kills / x.matches_played, d: x.deaths / x.matches_played, a: x.assists / x.matches_played, last: x.last_played}));
  const def30 = r30.reduce((a, x) => a + x.g, 0) >= 8, PL = qkPool(H);
  const hRow = (x, cls) => { const wr = 100 * x.w / Math.max(1, x.g);
    return `<a class="qk-hr ${cls}" href="#h/${x.hid}/me">${face(x.hid, moodOn(H, x.hid), 'm')}<span class="qk-hn"><b>${esc(hero(x.hid).n)}</b><small>${nf(x.g)} ${pl(x.g, ['игра', 'игры', 'игр'])} · ${f1(x.k)}/${f1(x.d)}/${f1(x.a)}</small></span>
      <span class="qk-wr"><b class="${wrC(wr, x.g)}">${Math.round(wr)}%</b><i><i style="width:${Math.round(wr)}%"></i></i></span><span class="q-rt qk-rt" data-rt="${x.hid}">${RTH[id + '|' + x.hid] || ''}</span></a>`; };
  const cardB = `<div class="q-box qk-c qk-b" data-m="${def30 ? '30' : 'all'}"><div class="qk-h">Герои<div class="seg qk-hs"><button data-hm="30" class="${def30 ? 'on' : ''}">30 дней</button><button data-hm="all" class="${def30 ? '' : 'on'}">Всё время</button></div></div>
    ${PL.tot ? `<div class="qk-pool">Пул: <b>${PL.n}</b> ${pl(PL.n, ['герой', 'героя', 'героев'])} за месяц · три главных — <b>${PL.share}%</b> игр</div>` : ''}
    <div class="qk-hl h3">${r30.map(x => hRow(x, '')).join('') || '<div class="empty">За 30 дней матчей нет.</div>'}</div>
    <div class="qk-hl ha">${rAll.map(x => hRow(x, '')).join('') || '<div class="empty">Нет данных</div>'}</div>
    <a class="qk-more" href="#mine">Все герои ›</a></div>`;

  // --- карточка 3: что знать — метки, паттерны, с кем играет ---
  const T = profTags(H, HS, HA), P2 = patterns2(H), avgWr = 100 * H.slice(0, 400).filter(won).length / Math.max(1, Math.min(400, H.length));
  const cardC = `<div class="q-box qk-c qk-w"><div class="qk-h">Что знать</div>
    <div class="q-tags qk-tags">${tagsHTML(T) || '<span class="sub">Меток пока нет — мало матчей.</span>'}</div>
    <div class="qk-sub">Паттерны <small>против обычного винрейта ${f1(avgWr)}%</small></div>
    ${P2.slice(0, 4).map(p => `<div class="qk-pt"><span>${esc(p.n)}<small>${games(p.c)} · ${Math.round(p.wr)}% побед</small></span><b class="${p.d >= 0 ? 'win' : 'loss'}">${p.d >= 0 ? '+' : '−'}${f1(Math.abs(p.d))}%</b></div>`).join('') || '<div class="empty">Мало матчей для паттернов.</div>'}
    <div class="qk-sub">Играет с <small>чаще всего в одной команде</small></div><div id="qkmate"><span class="sub">Считаю…</span></div>
    <a class="qk-more" href="#form/habits">Все паттерны и привычки ›</a></div>`;

  // --- недавние игры (как было) ---
  const hlist = [...new Set(H.slice(0, 300).map(m => m.hero_id))].filter(h => D.heroes[h]).sort((a, b) => hero(a).n.localeCompare(hero(b).n));
  const histBox = `<div class="q-box" id="hist"><div class="q-hh"><b>Недавние игры</b><span id="hsum" style="display:contents"></span><span class="sp" style="flex:1"></span>
      <div class="seg" id="hvw"><button data-v="full" class="${PHF.view !== 'short' ? 'on' : ''}">Подробно</button><button data-v="short" class="${PHF.view === 'short' ? 'on' : ''}">Коротко</button></div></div>
    <div class="q-hf"><select class="q-sel" id="hfh" aria-label="Герой"><option value="0">Все герои</option>${hlist.map(h => `<option value="${h}"${PHF.hero === h ? ' selected' : ''}>${esc(hero(h).n)}</option>`).join('')}</select>
      <select class="q-sel" id="hfm" aria-label="Режим"><option value="">Все режимы</option><option value="r"${PHF.mode === 'r' ? ' selected' : ''}>Ранговые</option><option value="u"${PHF.mode === 'u' ? ' selected' : ''}>Обычные</option></select></div>
    <div id="hrows"></div><button class="btn g q-more" id="hmore" type="button">Показать ещё</button></div>`;
  V(`${ptabsHTML('home')}<section class="qk">${cardA}${cardB}${cardC}</section>
    <div class="qk-deep"><span>Глубже — во вкладке «Статистика»:</span>${[['', 'Итог'], ['form', 'Форма'], ['heroes', 'Герои'], ['lane', 'Линия'], ['deaths', 'Смерти'], ['eco', 'Экономика'], ['fight', 'Бой'], ['habits', 'Привычки']].map(([k, nm]) => `<a href="#form${k ? '/' + k : ''}">${nm}</a>`).join('')}<a class="live" href="#live/${id}">Лайв-матч ›</a></div>
    ${histBox}
    <p class="note">Лицо героя — из файлов игры: доволен — победа, на лоу хп — поражение · оценка S+…D− — против типичного игрока на этом герое твоего ранга · нажми на матч — полный разбор.</p>
    <div id="mybw" hidden><div class="q-box"><div class="q-bh"><b>Сохранённые сборки</b><small>что ты отложил «в профиль» и автоподбор</small></div><div class="pad" id="myb"></div></div></div>`);
  $$('.qk-hs button').forEach(b => b.onclick = e => { e.preventDefault(); const box = $('.qk-b'); box.dataset.m = b.dataset.hm; $$('.qk-hs button').forEach(x => x.classList.toggle('on', x === b)); });
  heroRatings(n, id, [...new Set([...rAll, ...r30].map(x => x.hid))], 'data-rt');
  qkMates(n, id);
  $$('#hvw button').forEach(b => b.onclick = () => { PHF.view = b.dataset.v; try { localStorage.setItem('rl-hv', PHF.view); } catch (er) {} $$('#hvw button').forEach(x => x.classList.toggle('on', x === b)); drawHist(n); });
  $('#hfh').onchange = e => { PHF.hero = +e.target.value; HN = 20; drawHist(n); };
  $('#hfm').onchange = e => { PHF.mode = e.target.value; HN = 20; drawHist(n); };
  $('#hmore').onclick = () => { HN += 20; drawHist(n); };
  const rows = $('#hrows');
  rows.onclick = e => { if (e.target.closest('a')) return; const r = e.target.closest('[data-m]'); if (r) location.hash = '#m/' + r.dataset.m; };
  rows.onkeydown = e => { if (e.key !== 'Enter' || e.target.closest('a')) return; const r = e.target.closest('[data-m]'); if (r) location.hash = '#m/' + r.dataset.m; };
  drawHist(n);
  gradeBase(badge).then(T2 => { if (n !== VQ) return; GT = T2; drawRows(n); });
  if (badge) api('players/rank/distribution').then(Dd => { if (n !== VQ) return; const tot = Dd.reduce((a, x) => a + (x.players || 0), 0), up = Dd.filter(x => x.badge >= badge).reduce((a, x) => a + (x.players || 0), 0); const el = $('#rtop'); if (el && tot) el.innerHTML = `топ <b>${f1(Math.max(.1, 100 * up / tot))}%</b> игроков`; }).catch(() => { const el = $('#rtop'); if (el) el.textContent = ''; });
  topPlaces(n, id, ME.name, st.countrycode, pool);
  renderMyBuilds().then(() => { const b = $('#myb'), w = $('#mybw'); if (n === VQ && b && w && b.querySelector('a,img,.bch,.myc')) w.hidden = false; }).catch(() => {});
}
// топ-3 напарника для карточки «Что знать»
async function qkMates(n, id) {
  const M = await api(`players/${id}/mate-stats?min_matches_played=3`).catch(() => []);
  if (n !== VQ || !$('#qkmate')) return;
  const L = (M || []).sort((a, b) => b.matches_played - a.matches_played).slice(0, 3);
  if (!L.length) { put(n, '#qkmate', '<div class="sub qk-none">Обычно играет один.</div>'); return; }
  await steamNames(L.map(x => x.mate_id)); if (n !== VQ) return;
  put(n, '#qkmate', L.map(x => { const sn = SN[x.mate_id] || {}, wr = 100 * x.wins / Math.max(1, x.matches_played);
    return `<a class="qk-mt" href="?id=${x.mate_id}#home">${sn.av ? `<img src="${esc(sn.av)}" alt="" loading="lazy">` : '<i></i>'}<span><b>${esc(sn.n || 'Игрок')}${x.matches_played >= 50 ? ' <em>ДУО</em>' : ''}</b><small>${nf(x.matches_played)} ${pl(x.matches_played, ['игра', 'игры', 'игр'])} вместе</small></span><b class="${wrC(wr, x.matches_played)}">${Math.round(wr)}%</b></a>`; }).join(''));
}

// ---------- «Статистика»: понятные вкладки, у каждой — одна строка «что тут» ----------
const ST2 = [['', 'Итог', 'Главное одним экраном: Restless Score, сильная сторона, слабое место, лучший герой.'],
  ['form', 'Форма', 'Как меняется игра: оценка каждого матча, по неделям и по длине матча.'],
  ['heroes', 'Герои', 'Оценка на каждом герое против типичного игрока на нём: что получается, что нет.'],
  ['lane', 'Линия', 'Первые 9 минут: твой дуэт против двух соперников, кто выигрывает линию.'],
  ['deaths', 'Смерти', 'Где, когда и от кого умираешь и сколько душ на этом теряешь.'],
  ['eco', 'Экономика', 'Откуда берутся души и как быстро ты богатеешь.'],
  ['fight', 'Бой', 'Урон, участие в драках, лечение и как ты бьёшь против лобби.'],
  ['habits', 'Привычки', 'Когда играет, с кем в команде и против кого, все паттерны винрейта.']];
const stTabs2 = on => { const t = ST2.find(x => x[0] === (on || '')) || ST2[0];
  return `<nav class="qs-tabs st2" aria-label="Статистика">${ST2.map(([k, v]) => `<a href="#form${k ? '/' + k : ''}" class="${(on || '') === k ? 'on' : ''}">${v}</a>`).join('')}</nav><p class="st2-what">${esc(t[2])}</p>`; };

async function viewStats(tab) {
  if (!ME) return viewLanding();
  tab = tab || '';
  if (tab === '' || tab === 'form' || tab === 'heroes') return stOverview(tab || 'sum');
  if (tab === 'habits') return stHabits();
  if (!STN[tab]) return stOverview('sum');
  const n = vNew();
  V(`${ptabsHTML('form')}${stTabs2(tab)}<div class="qs-top"><div class="seg" id="stn">${[20, 40].map(k => `<button data-n="${k}" class="${STN_N === k ? 'on' : ''}">Последние ${k}</button>`).join('')}</div><small class="sub">по поминутным данным матчей · сравнение — с другими игроками в тех же матчах</small></div>
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

async function stOverview(sec) {
  if (!ME) return viewLanding();
  sec = sec || 'sum';
  const n = vNew(), tab = sec === 'sum' ? '' : sec;
  V(`${ptabsHTML('form')}${stTabs2(tab)}<div class="qs-top"><div class="seg" id="fmn">${[20, 50, 100, 200].map(k => `<button data-n="${k}" class="${FMN === k ? 'on' : ''}">${k === 200 ? 'Все' : 'Последние ' + k}</button>`).join('')}</div><small class="sub" id="fmsub">оценка каждого матча против типичного игрока на том же герое твоего ранга</small></div><div id="stb"><div class="load">Считаю…</div></div>`);
  $$('#fmn button').forEach(b => b.onclick = () => { FMN = +b.dataset.n; stOverview(sec); });
  try {
    const R = await api('players/' + ME.id + '/rank').catch(() => null);
    const b = R && R.badge ? Math.floor(R.badge / 10) * 10 : 0;
    const [H, S] = await Promise.all([api('players/' + ME.id + '/match-history'), api(`analytics/hero-stats?min_unix_timestamp=${now() - 30 * 86400 - (now() % 3600)}${b ? `&min_average_badge=${Math.max(0, b - 10)}&max_average_badge=${b + 16}` : ''}`).catch(() => [])]);
    if (n !== VQ) return;
    { const bn = $('.q-ban'); if (bn && PBAN_ID !== ME.id) bn.outerHTML = banLite(); }
    const T = {}; S.forEach(x => { const k = Math.max(1, x.matches); if (x.matches >= 30) T[x.hero_id] = {nw: x.total_net_worth / k, ka: (x.total_kills + x.total_assists) / k, d: x.total_deaths / k, lh: x.total_last_hits / k, wr: 100 * x.wins / k}; });
    const W = H.slice(0, FMN), Dd = fmAvg(W, m => Math.max(300, m.match_duration_s || 0)) || 1800;
    const L = W.map(m => fmOne(m, T, Dd)).filter(Boolean);
    if (L.length < 5) { put(n, '#stb', '<div class="empty">Мало матчей для разбора — нужно хотя бы 5.</div>'); return; }
    put(n, '#fmsub', `${L.length} ${pl(L.length, ['матч', 'матча', 'матчей'])} · каждый матч против типичного игрока на том же герое ${b ? 'твоего ранга' : 'всех рангов'} за 30 дней`);
    const sc = Math.round(fmAvg(L, x => x.s)), L10 = L.slice(0, 10), Lr = L.slice(10), d10 = Lr.length ? fmAvg(L10, x => x.s) - fmAvg(Lr, x => x.s) : 0;
    const wins = L.filter(x => x.w), losses = L.filter(x => !x.w), best = L.reduce((a, x) => x.s > a.s ? x : a, L[0]);
    const RT = FM_K.map(([k, nm, h]) => ({k, nm, h, r: fmAvg(L, x => x.r[k]), rw: fmAvg(wins, x => x.r[k]), rl: fmAvg(losses, x => x.r[k])}));
    const sRT = RT.slice().sort((a, c) => c.r - a.r), str = sRT[0], weak = sRT[sRT.length - 1];
    const byH = {}; L.forEach(x => (byH[x.m.hero_id] = byH[x.m.hero_id] || []).push(x));
    const HL = Object.entries(byH).map(([id, X]) => ({id: +id, X, s: fmAvg(X, x => x.s), w: X.filter(x => x.w).length})).sort((a, c) => c.X.length - a.X.length || c.s - a.s);
    const bh = HL.filter(h => h.X.length >= 3).sort((a, c) => c.s - a.s)[0];
    const pp = v => Math.max(2, Math.min(98, 50 + 50 * fmL2(v)));
    let html = '';
    if (sec === 'sum') {
      html = `<div class="qs-g">
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
        </div></div>
        <div class="qs-box qs-paperbox"><div class="qs-bh"><b>Где ты силён</b><small>середина — типичный игрок на твоих героях · точки: зелёная — в победах, красная — в поражениях</small></div>
          ${RT.map(x => `<div class="qs-pr"><div><b>${esc(x.nm)}</b><small>${esc(x.h)}</small></div><div class="qs-pb"><i class="f" style="--w:${Math.round(pp(x.r))}%"></i>${wins.length ? `<i class="d w" style="left:${Math.round(pp(x.rw))}%"></i>` : ''}${losses.length ? `<i class="d l" style="left:${Math.round(pp(x.rl))}%"></i>` : ''}<i class="m"></i></div><div class="qs-pv"><b style="color:${x.r >= 1.03 ? '#14804f' : x.r <= .97 ? '#c02a3c' : '#6b5d3f'}">${fmPct(x.r)}</b><small>к типичному</small></div></div>`).join('')}</div>
        <div class="st2-next">${ST2.slice(1).map(([k, v, d]) => `<a href="#form/${k}"><b>${v} ›</b><small>${esc(d)}</small></a>`).join('')}</div>
        <details class="qs-box qs-how"><summary>Как считается Restless Score</summary><p>Каждый матч сравниваем с типичным игроком на том же герое ${b ? 'на твоём ранге ' : ''}за последние 30 дней: души, убийства + помощь, выживание и добивания (с поправкой на длину матча). 50 — ровно как типичный игрок, 60+ — заметно лучше, 40 и ниже — хуже.</p></details>`;
    } else if (sec === 'form') {
      const C = L.slice().reverse(), ma = C.map((x, i) => fmAvg(C.slice(Math.max(0, i - 4), i + 1), y => y.s)), bw = Math.max(6, Math.min(22, Math.floor(1000 / C.length) - 4)), gp = 4, cw = C.length * (bw + gp) + gp, ch = 160, y = v => ch - v * ch / 100;
      const curve = `<svg class="qs-fc" viewBox="0 0 ${cw} ${ch + 4}" preserveAspectRatio="none" role="img" aria-label="Оценка каждого матча">${[25, 50, 75].map(v => `<line x1="0" x2="${cw}" y1="${y(v)}" y2="${y(v)}" class="${v === 50 ? 'm' : ''}"/>`).join('')}
        ${C.map((x, i) => `<a href="#m/${x.m.match_id}"><rect x="${gp + i * (bw + gp)}" y="${y(x.s)}" width="${bw}" height="${Math.max(2, ch - y(x.s))}" rx="2" class="${x.w ? 'w' : 'l'}${x === best ? ' b' : ''}"><title>${esc(hero(x.m.hero_id).n)} · ${x.w ? 'победа' : 'поражение'} · оценка ${x.s} · ${esc(ago(x.m.start_time))}</title></rect></a>`).join('')}
        <polyline points="${ma.map((v, i) => `${gp + i * (bw + gp) + bw / 2},${y(v)}`).join(' ')}"/></svg>`;
      const BK = [['Короткие', 'до 25 мин', x => x.m.match_duration_s < 1500], ['Обычные', '25–35 мин', x => x.m.match_duration_s >= 1500 && x.m.match_duration_s < 2100], ['Долгие', '35+ мин', x => x.m.match_duration_s >= 2100]].map(([nm, h, f]) => { const X = L.filter(f); return {nm, h, X, s: X.length ? Math.round(fmAvg(X, x => x.s)) : null, w: X.filter(x => x.w).length}; });
      const wk = {}; L.forEach(x => { const k = Math.floor((x.m.start_time + 3 * 86400) / 604800); (wk[k] = wk[k] || []).push(x); });
      const WK = Object.entries(wk).sort((a, c) => a[0] - c[0]).slice(-6).map(([k, X]) => ({t: (+k) * 604800 - 3 * 86400, X, s: Math.round(fmAvg(X, x => x.s)), w: X.filter(x => x.w).length}));
      html = `<div class="qs-box qs-chalk"><div class="qs-bh"><b>Кривая формы</b><small>столбик — матч (нажми — разбор) · зелёный — победа, красный — поражение · линия — среднее за 5 матчей · пунктир — типичный игрок (50)</small></div>${curve}
          <div class="qs-fcl"><span>${esc(ago(C[0].m.start_time))}</span><span>лучшая — ${best.s} · ${esc(hero(best.m.hero_id).n)}</span><span>сейчас</span></div></div>
        <div class="qs-2">
          <div class="qs-box"><div class="qs-bh"><b>Когда получается</b><small>оценка по длине матча</small></div><div class="qs-tiles">${BK.map(x => `<div><b style="color:${x.s == null ? 'var(--mu2)' : fmCol(x.s)}">${x.s == null ? '—' : x.s}</b><span>${x.nm}</span><small>${x.h} · ${x.X.length ? games(x.X.length) + ' · ' + pc(x.w, x.X.length) + '% побед' : 'нет игр'}</small></div>`).join('')}</div></div>
          ${WK.length >= 2 ? `<div class="qs-box"><div class="qs-bh"><b>По неделям</b><small>средняя оценка за неделю</small></div><div class="qs-tiles wk">${WK.map((x, i) => `<div class="${i === WK.length - 1 ? 'cur' : ''}"><small>${esc(new Date(x.t * 1000).toLocaleDateString('ru-RU', {day: 'numeric', month: 'short'}))}</small><b style="color:${fmCol(x.s)}">${x.s}</b>${i ? `<em class="${x.s >= WK[i - 1].s ? 'win' : 'loss'}">${x.s >= WK[i - 1].s ? '+' : ''}${x.s - WK[i - 1].s}</em>` : ''}<span>${games(x.X.length)} · ${pc(x.w, x.X.length)}%</span></div>`).join('')}</div></div>` : '<div class="qs-box"><div class="empty">Нужно хотя бы две недели игр.</div></div>'}
        </div>`;
    } else {
      html = `<div class="qs-hl">${HL.slice(0, 12).map(h => { const rr = FM_K.map(([k, nm]) => ({nm, r: fmAvg(h.X, x => x.r[k])})).sort((a, c) => c.r - a.r), s2 = Math.round(h.s);
          return `<a class="qs-hr" href="#h/${h.id}/me">${face(h.id, s2 >= 50 ? 'g' : 'c', 'm')}<div class="qs-hn"><b>${esc(hero(h.id).n)}</b><small>${games(h.X.length)} · ${h.w}–${h.X.length - h.w}</small><div><span class="qs-tg g">▲ ${esc(rr[0].nm)}</span><span class="qs-tg r">▼ ${esc(rr[rr.length - 1].nm)}</span></div></div>
            <div class="qs-hs"><b style="color:${fmCol(s2)}">${s2}</b><small>${fmLbl(s2)[0]}</small></div><div class="qs-mb">${h.X.slice(0, 10).reverse().map(x => `<i class="${x.w ? 'w' : 'l'}" style="--h:${Math.max(8, x.s)}%" title="${x.s}"></i>`).join('')}</div></a>`; }).join('')}</div>
        <p class="note">▲ — что на герое получается лучше всего, ▼ — хуже всего · полоски — оценки последних матчей на нём · нажми на героя — его страница.</p>`;
    }
    put(n, '#stb', html);
  } catch (e) { put(n, '#stb', `<div class="err">Не вышло: ${esc(e.message)}</div>`); }
}

// «Привычки»: активность, последние 7 дней, с кем и против кого, все паттерны
async function stHabits() {
  if (!ME) return viewLanding();
  const n = vNew(), id = ME.id;
  V(`${ptabsHTML('form')}${stTabs2('habits')}<div id="stb"><div class="load">Считаю…</div></div>`);
  try {
    const H = await api('players/' + id + '/match-history'); if (n !== VQ) return;
    { const bn = $('.q-ban'); if (bn && PBAN_ID !== ME.id) bn.outerHTML = banLite(); }
    const won = m => m.player_team === m.match_result, P2 = patterns2(H), avgWr = 100 * H.slice(0, 400).filter(won).length / Math.max(1, Math.min(400, H.length));
    put(n, '#stb', `<div class="st2-hb">${actBox(H)}
      <div class="q-box"><div class="q-bh"><b>Паттерны игрока</b><small>винрейт против обычного (${f1(avgWr)}%)</small></div>
      ${P2.map(p => `<div class="q-pt"><span>${esc(p.n)}<small>${games(p.c)} · ${Math.round(p.wr)}% побед</small></span><div><div class="q-pbar"><i class="${p.d >= 0 ? 'up' : 'dn'}" style="width:${Math.min(50, Math.abs(p.d) * 2.5)}%"></i></div><span class="q-pv ${p.d >= 0 ? 'win' : 'loss'}">${p.d >= 0 ? '+' : '−'}${f1(Math.abs(p.d))} %</span></div></div>`).join('') || '<div class="empty">Мало матчей.</div>'}</div></div>`);
    mateLoad(n, id);
  } catch (e) { put(n, '#stb', `<div class="err">Не вышло: ${esc(e.message)}</div>`); }
}

// ---------- «Обновления» по-русски: перевод строки, под ним — оригинал; названия способностей и предметов — по-английски ----------
let UPRU = null, UPRU_P = null;
const upLang = () => { try { const v = localStorage.getItem('rl-plang'); if (v === 'ru' || v === 'en') return v; } catch (e) {} return /^(ru|uk|be|kk)/i.test(navigator.language || '') ? 'ru' : 'en'; };
const upNorm = s => String(s || '').replace(/\s+/g, ' ').trim();
function upLoad() {
  if (UPRU || upLang() !== 'ru') return Promise.resolve(UPRU);
  if (!UPRU_P) UPRU_P = fetch('upd-ru.json?v=2').then(r => r.ok ? r.json() : {ru: {}}).then(j => (UPRU = j.ru || {})).catch(() => (UPRU = {}));
  return UPRU_P;
}
const upTr = s => { if (upLang() !== 'ru' || !UPRU) return null; const t = UPRU[upNorm(s)]; return t && t !== upNorm(s) ? t : null; };
{
  const LH0 = lineHTML;
  lineHTML = function (x) {
    const t = upTr(x.s); if (!t) return LH0(x);
    const ru = LH0(Object.assign({}, x, {s: t})).replace(/^<div class="q-ln2([^"]*)">/, '<div class="q-ln2$1 q-tr">').replace(/<\/div>$/, `<span class="q-or">${esc(x.s)}</span></div>`);
    return ru;
  };
  const VU0 = viewUpd;
  viewUpd = async function (sel) { await upLoad(); await VU0(sel); upFix(); };
}
let UPMO = null;
function upFix() {
  const w = $('#upw'); if (!w) return;
  const run = () => {
    if (upLang() === 'ru' && UPRU) $$('#upw .q-pp, #upw .q-sh, #upw .q-ss, #upw .q-art2 p, #upw .q-upl b, #upw .q-uph h2', w).forEach(el => {
      if (el.dataset.tr) return; el.dataset.tr = 1;
      const src = el.textContent.replace(/^—\s*/, ''), t = upTr(src); if (!t) return;
      const a = el.querySelector('a.q-hl');
      if (el.matches('.q-upl b')) { el.textContent = t; el.title = src; return; }
      el.innerHTML = `${a ? `<a class="q-hl" href="${esc(a.getAttribute('href'))}">${esc(t)}</a>` : esc(t)}<span class="q-or">${esc(src)}</span>`;
      el.classList.add('q-tr');
    });
    const ph = $('#upw .q-uph p'); if (ph && !$('#uplang', ph)) ph.insertAdjacentHTML('beforeend', ` · <span class="q-ulg" id="uplang">язык: <button data-l="ru" class="${upLang() === 'ru' ? 'on' : ''}">русский</button><button data-l="en" class="${upLang() === 'en' ? 'on' : ''}">English</button></span>`);
  };
  run();
  if (UPMO) UPMO.disconnect();
  UPMO = new MutationObserver(() => { clearTimeout(UPMO._t); UPMO._t = setTimeout(run, 30); });
  UPMO.observe(w, {childList: true, subtree: true});
  w.onclick = e => { const b = e.target.closest('#uplang button'); if (!b) return; e.preventDefault(); try { localStorage.setItem('rl-plang', b.dataset.l); } catch (er) {} const m = location.hash.match(/^#upd\/?(\d*)/); viewUpd(m && m[1] !== '' ? m[1] : undefined); };
}
