// ==================== 02.11 · Restless без перегруза — свой вид, не копия чужих сайтов ====================
// Андрей: «ебейшая перегрузка интерфейса; нажимаю на матч — че за хуйню мне даёт; непонятно, что клацать».
// Профиль: одна полоса «сводка», слева герои, справа коуч одной строкой и матчи в одну строку.
// Матч: первым — «лицом к лицу» (игроки двух команд парами по линиям) и коротко про выбранного игрока; разбор — вкладкой.

// ---------- матч: вкладки Обзор · Разбор · Сборка · Линии · Графики · Карта ----------
{
  const i = MTABS.findIndex(x => x[0] === 'co');
  if (i >= 0) { const c = MTABS.splice(i, 1)[0]; c[1] = 'Разбор'; MTABS.splice(MTABS.findIndex(x => x[0] === 'ov') + 1, 0, c); }
  const pl = MTABS.find(x => x[0] === 'pl'); if (pl) pl[1] = 'Сборка';
  const ec = MTABS.findIndex(x => x[0] === 'ec'); if (ec >= 0) MTABS.splice(ec, 1, ['gr', 'Графики']);
  const dm = MTABS.findIndex(x => x[0] === 'dm'); if (dm >= 0) MTABS.splice(dm, 1);
  const VM9 = viewMatch2;
  viewMatch2 = async function (mid, tab) { if (tab === 'ec' || tab === 'dm') tab = 'gr'; return VM9(mid, tab || 'ov'); };
  const MB9 = mBody;
  mBody = function () {
    const el = $('#qmb');
    if (el && MZ.tab === 'gr') { cancelAnimationFrame(MZ.raf); MZ.play = 0; el.innerHTML = `<div class="r9-gr">${mEc()}${mDm()}</div>`; el.classList.remove('in'); void el.offsetWidth; el.classList.add('in'); mAnim(el); }
    else MB9();
    $$('.qm-tabs button').forEach(b => b.classList.toggle('on', b.dataset.mt === MZ.tab));
    const w = $('.r9-who'); if (w && MX) w.outerHTML = r9Who();
  };
}
// шапка матча: счёт, вкладки и выбор игрока одной кнопкой (вместо ряда из 12 плиток)
function mHead() {
  const X = MX, mi = X.mi, k0 = X.P.filter(p => teamOf(p.team) === 0).reduce((a, p) => a + p.kills, 0), k1 = X.P.filter(p => teamOf(p.team) === 1).reduce((a, p) => a + p.kills, 0);
  const st = tsOf(mi.start_time), my = X.meP ? (teamOf(X.meP.team) === X.win ? ['Победа', 'win'] : ['Поражение', 'loss']) : [`Победа: ${TEAMN[X.win]}`, ''];
  return `<div class="qm-head r9-mh"><a class="q-back" href="#home">‹ Профиль</a>
    <div class="qm-sb"><div class="qm-tn t0"><b>${TEAMN[0]}</b>${X.win === 0 ? '<em>победа</em>' : ''}${mi.average_badge_team0 ? rankImg(mi.average_badge_team0, 'ri') : ''}</div>
      <div class="qm-sc"><span class="t0">${cu(k0)}</span><div><b class="${my[1]}">${my[0]}</b><small>${mmss(X.dur)} · ${st ? esc(ago(st)) : ''} · ${esc(MODE({match_mode: mi.match_mode}))}</small></div><span class="t1">${cu(k1)}</span></div>
      <div class="qm-tn t1">${mi.average_badge_team1 ? rankImg(mi.average_badge_team1, 'ri') : ''}${X.win === 1 ? '<em>победа</em>' : ''}<b>${TEAMN[1]}</b></div></div>
    <div class="r9-tb"><nav class="qm-tabs">${MTABS.map(([k, v]) => `<button data-mt="${k}" class="${MZ.tab === k ? 'on' : ''}">${v}</button>`).join('')}</nav>${r9Who()}</div></div>`;
}
function r9Who() {
  const X = MX, p = mSel();
  return `<div class="r9-who"><button type="button" class="r9-wb" aria-haspopup="true" title="Чей матч показывать">${face(p.hero_id, '', 's')}<span><small>${p === X.meP ? 'ты' : 'игрок'}</small><b>${esc(pname(p))}</b></span><i>▾</i></button>
    <div class="r9-wl" hidden>${[0, 1].map(t => `<div><em class="t${t}">${TEAMN[t]}</em>${X.P.filter(q => teamOf(q.team) === t).map(q => `<button type="button" data-sl="${q.player_slot}" class="${q === p ? 'on' : ''}">${face(q.hero_id, '', 's')}<span><b>${esc(pname(q))}</b><small>${esc(hero(q.hero_id).n)}</small></span></button>`).join('')}</div>`).join('')}</div></div>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('.r9-wb');
  if (b) { const l = b.nextElementSibling; if (l) l.hidden = !l.hidden; return; }
  if (!e.target.closest('.r9-wl')) $$('.r9-wl').forEach(l => l.hidden = true);
});

// «Обзор» матча: лицом к лицу по линиям + коротко про выбранного игрока
const R9_LO = {1: 0, 4: 1, 6: 2};
function r9Board(X) {
  const sel = mSel(), meId = X.meP ? X.meP.account_id : 0;
  const team = t => X.P.filter(p => teamOf(p.team) === t).sort((a, b) => ((R9_LO[a.assigned_lane] ?? 3) - (R9_LO[b.assigned_lane] ?? 3)) || ((b.net_worth || 0) - (a.net_worth || 0)));
  const A = team(0), B = team(1), n = Math.max(A.length, B.length);
  const cell = (p, s) => { if (!p) return '<span class="r9-pc e"></span>';
    const g = gradeOf((X.A.get(p) || {score: 50}).score);
    return `<button type="button" class="r9-pc s${s}${p === sel ? ' on' : ''}${meId && p.account_id === meId ? ' mine' : ''}" data-sl="${p.player_slot}" title="${esc(pname(p))} · ${esc(hero(p.hero_id).n)}">
      ${face(p.hero_id, teamOf(p.team) === X.win ? 'g' : 'c', 's')}<span class="r9-pn"><b>${esc(pname(p))}</b><small>${esc(hero(p.hero_id).n)}</small></span>
      <span class="r9-pk"><b>${p.kills || 0}/<i>${p.deaths || 0}</i>/${p.assists || 0}</b><small>${kFmt(p.net_worth || 0)}</small></span><span class="r9-pg" style="--gc:${gradeCol(g)}">${g}</span></button>`; };
  let prev = -1;
  const rows = Array.from({length: n}, (_, i) => { const a = A[i], b = B[i], same = a && b && a.assigned_lane === b.assigned_lane, L = same ? LANEN[a.assigned_lane] : null;
    const first = L && a.assigned_lane !== prev; if (L) prev = a.assigned_lane;
    return `<div class="r9-br${first && i ? ' gap' : ''}">${cell(a, 0)}<span class="r9-ln"${L ? ` style="--lc:${L[1]}"` : ''}>${L ? (first ? `<b>${L[0]}</b>` : '<i></i>') : ''}</span>${cell(b, 1)}</div>`; }).join('');
  const sum = T => `${T.reduce((s, p) => s + (p.kills || 0), 0)} убийств · ${kFmt(T.reduce((s, p) => s + (p.net_worth || 0), 0))} душ`;
  return `<section class="q-box r9-bd"><div class="r9-bh"><div class="t0${X.win === 0 ? ' w' : ''}"><b>${TEAMN[0]}</b>${X.win === 0 ? '<em>победа</em>' : ''}<small>${sum(A)}</small></div><span>линия</span>
    <div class="t1${X.win === 1 ? ' w' : ''}"><b>${TEAMN[1]}</b>${X.win === 1 ? '<em>победа</em>' : ''}<small>${sum(B)}</small></div></div>${rows}
    <p class="r9-bf">Пары — кто с кем стоял на линии. Убийства/смерти/помощь, души и оценка за матч. Нажми на игрока — справа его игра.</p></section>`;
}
function mOv() {
  const X = MX, p = mSel(), a = X.A.get(p) || {score: 50}, g = gradeOf(a.score), won = teamOf(p.team) === X.win, me = p === X.meP;
  const pts = mPts(p).map(s => s.replace(/ ?Почему — справа\./, ''));
  return `<div class="r9-ov">${r9Board(X)}
    <section class="q-box r9-pl"><div class="r9-plh">${face(p.hero_id, won ? 'g' : 'c', 'm')}<div><small>${me ? 'Твоя игра' : 'Игра игрока'} · <span class="${won ? 'win' : 'loss'}">${won ? 'победа' : 'поражение'}</span></small><b>${esc(pname(p))}</b><span>${esc(hero(p.hero_id).n)} · ${p.kills || 0}/${p.deaths || 0}/${p.assists || 0}</span></div>
      <span class="r9-pg big" style="--gc:${gradeCol(g)}" title="оценка ${a.score} из 100 против лобби">${g}</span></div>
      <ul class="r9-pts">${pts.map(s => `<li>${s}</li>`).join('')}<li id="qmlate" hidden></li></ul>
      <div class="r9-its">${finalItems(p).map(itIco).join('') || '<span class="sub">Предметов нет в данных.</span>'}</div>
      <div class="r9-pb"><button type="button" class="btn s" data-mt="co">Подробный разбор ›</button><button type="button" class="btn g" data-mt="pl">Сборка по минутам</button>${p.account_id && !me ? `<a class="btn g" href="?id=${p.account_id}#home">Профиль</a>` : ''}</div></section></div>`;
}

// ---------- профиль ----------
// коуч одной строкой: разбор последнего матча или задание с отметками игр
function coProfHTML(id, H) {
  const T = coTask(), mine = T && T.aid === id ? T : null, last = H[0];
  if (!mine) { if (!last) return ''; const w = last.player_team === last.match_result;
    return `<a class="r9-co" href="#m/${last.match_id}/co"><span class="r9-coi">${face(last.hero_id, w ? 'g' : 'c', 's')}</span><span><b>Коуч · разбор последнего матча</b><small>${esc(hero(last.hero_id).n)} · <span class="${w ? 'win' : 'loss'}">${w ? 'победа' : 'поражение'}</span> · ${last.player_kills}/${last.player_deaths}/${last.player_assists} · ${esc(ago(last.start_time))}</small></span><em>Открыть ›</em></a>`; }
  const g = Object.values(mine.g || {}).slice(0, 3), ok = g.filter(Boolean).length, done = g.length >= 3;
  const cells = [0, 1, 2].map(i => g[i] == null ? `<i class="${i === g.length && COP.busy ? 'run' : ''}" title="игра ${i + 1}">${i + 1}</i>` : `<i class="${g[i] ? 'ok' : 'no'}" title="игра ${i + 1}">${g[i] ? '✓' : '✗'}</i>`).join('');
  const v = done ? (ok >= 2 ? `получилось в ${ok} из 3 — можно брать новое` : `получилось в ${ok} из 3 — возьми его ещё раз`) : COP.busy ? 'проверяю новые матчи…' : `сыграно ${g.length} из 3 — проверю сам`;
  return `<div class="r9-co t"><span class="r9-cot"><small>Задание коуча</small><b>${esc(mine.n)}</b></span><span class="r9-cog">${cells}</span><small class="r9-cov">${v}</small>
    <button type="button" class="r9-cox" data-qkc="drop" title="${done ? 'Убрать задание' : 'Отказаться'}">✕</button></div>`;
}

// строка матча — одна линия: результат, герой, У/С/П, души в минуту, предметы, оценка
function gmRow(m) {
  const w = m.player_team === m.match_result, d = m.ranked_delta, dur = Math.max(60, m.match_duration_s || 0);
  const kda = (m.player_kills + m.player_assists) / Math.max(1, m.player_deaths), M = MD.get(m.match_id), me = M ? M.players.find(p => p.account_id === PROF.id) : null;
  const its = me ? finalItems(me).slice(0, 6) : [], tgs = mMiniTags(m, PROF.CNT).slice(0, 2);
  return `<div class="q-gm r9r ${w ? 'w' : 'l'}" data-m="${m.match_id}" tabindex="0" role="link" aria-label="${w ? 'Победа' : 'Поражение'}, ${esc(hero(m.hero_id).n)}, открыть матч">
    <span class="r9-rs"><b>${w ? 'Победа' : 'Поражение'}</b><small>${esc(MODE(m))}${d ? ` <span class="${d > 0 ? 'win' : 'loss'}">${d > 0 ? '+' : ''}${d}</span>` : ''} · ${mmss(dur)}</small></span>
    <span class="r9-rh">${face(m.hero_id, w ? 'g' : 'c', 's')}<span><b>${esc(hero(m.hero_id).n)}</b><small>${esc(ago(m.start_time))}${tgs.map(tg => ` · <span class="r9-tg ${tg[1]}" title="${esc(tg[2])}">${esc(tg[0])}</span>`).join('')}</small></span></span>
    <span class="r9-rk"><b>${m.player_kills} / <i>${m.player_deaths}</i> / ${m.player_assists}</b><small>${f2(kda)} KDA</small></span>
    <span class="r9-rn"><b>${nf(m.net_worth / (dur / 60))}</b><small>душ/мин</small></span>
    <span class="r9-ri">${its.length ? its.map(itIco).join('') : (M === undefined ? '<i></i>'.repeat(6) : '')}</span>
    ${grdHTML(m)}<span class="r9-go" aria-hidden="true">›</span></div>`;
}

async function viewHome() {
  if (!ME) return viewLanding();
  const n = vNew(), id = ME.id;
  if (PHF.id !== id) { PHF.hero = 0; PHF.mode = ''; PHF.id = id; HN = 20; }
  PHF.view = 'full';
  V('<div class="load">Собираю профиль…</div>');
  let H, HS, R, SS, HSt, ST;
  try {
    [H, HS, R, SS, HSt, ST] = await Promise.all([api('players/' + id + '/match-history'), api('players/hero-stats?account_ids=' + id).catch(() => []), api('players/' + id + '/rank').catch(() => null),
      api('assets/ranked-seasons').catch(() => []), api('analytics/hero-stats?' + fq()).catch(() => []), api('players/steam?account_ids=' + id).catch(() => [])]);
  } catch (e) { if (n === VQ) V(`<div class="err">Не вышло загрузить профиль: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  if (typeof xmMerge === 'function') H = xmMerge(id, H);
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

  // сводка одной полосой
  const ses = curSeason(SS), SH = H.filter(m => m.match_mode === 4 && m.start_time >= ses.start), sw = SH.filter(won).length, rk = rankOf(badge);
  const F = qkForm(H), A = qkAct(H), wr20 = Math.round(100 * F.w / Math.max(1, F.L.length));
  const cellRank = badge ? `<div class="r9-sc rk">${rankImg(badge, 'rk')}<span><small>Ранг</small><b style="color:${esc(rk.color)}">${esc(rk.name)}</b><em id="rtop">${SH.length ? `сезон ${sw}–${SH.length - sw}` : ''}</em></span></div>`
    : `<div class="r9-sc"><span><small>Ранг</small><b>Без ранга</b><em>ранговых в сезоне нет</em></span></div>`;
  const sum = `<section class="q-box r9-sum">${cellRank}
    <div class="r9-sc fm"><span><small>Форма · ${F.L.length} игр</small><b class="${wrC(wr20, F.L.length)}">${wr20}%</b><em><span class="win">${F.w}В</span> <span class="loss">${F.L.length - F.w}П</span></em></span><i class="r9-dots" title="последние ${F.L.length}, слева — свежие">${F.L.map(m => `<i class="${won(m) ? 'w' : 'l'}"></i>`).join('')}</i></div>
    <div class="r9-sc"><span><small>Серия</small><b class="${F.st >= 2 ? (F.r0 ? 'win' : 'loss') : ''}">${F.st} ${F.r0 ? pl(F.st, ['победа', 'победы', 'побед']) : pl(F.st, ['поражение', 'поражения', 'поражений'])}</b><em>${F.st >= 2 ? 'подряд' : 'последний матч'}</em></span></div>
    <div class="r9-sc"><span><small>Средний матч</small><b>${f1(avg(F.L, m => m.player_kills))}/${f1(avg(F.L, m => m.player_deaths))}/${f1(avg(F.L, m => m.player_assists))}</b><em>${nf(avg(F.L, m => m.net_worth / (Math.max(300, m.match_duration_s || 0) / 60)))} душ/мин</em></span></div>
    <div class="r9-sc"><span><small>Играет</small><b>${A.g7} за неделю</b><em>последний — ${esc(ago(A.last))} · <a href="#live/${id}">лайв ›</a></em></span></div></section>`;

  // герои — крупными карточками: топ-6 за 30 дней (мало игр — за всё время)
  const R30 = {}; H.filter(m => m.start_time >= now() - 30 * 86400).forEach(m => { const o = R30[m.hero_id] = R30[m.hero_id] || {m: 0, w: 0, k: 0, d: 0, a: 0}; o.m++; if (won(m)) o.w++; o.k += m.player_kills; o.d += m.player_deaths; o.a += m.player_assists; });
  let HL = Object.entries(R30).filter(([h]) => D.heroes[h]).sort((a, b) => b[1].m - a[1].m).slice(0, 6).map(([h, o]) => ({hid: +h, g: o.m, w: o.w, k: o.k / o.m, d: o.d / o.m, a: o.a / o.m})), per = '30 дней';
  if (HL.reduce((a, x) => a + x.g, 0) < 8) { HL = pool.filter(x => D.heroes[x.hero_id]).slice(0, 6).map(x => ({hid: x.hero_id, g: x.matches_played, w: x.wins, k: x.kills / x.matches_played, d: x.deaths / x.matches_played, a: x.assists / x.matches_played})); per = 'всё время'; }
  const totG = HL.reduce((a, x) => a + x.g, 0) || 1, allG = per === '30 дней' ? Object.values(R30).reduce((a, o) => a + o.m, 0) || 1 : totG;
  const heroes = HL.length ? `<section class="p10-hs"><div class="p10-h">Его герои<small>${per}</small><a href="#mine">все герои ›</a></div><div class="p10-hg">${HL.map((x, i) => { const wr = 100 * x.w / Math.max(1, x.g), sh = Math.round(100 * x.g / allG);
      return `<a class="p10-hc" href="#h/${x.hid}/me" style="--i:${i};--hc:${esc(hero(x.hid).col || '#ffb020')}"><span class="p10-hi"><img src="${esc(faceUrl(x.hid, wr >= 55 ? 'g' : wr <= 42 ? 'c' : ''))}" alt="" loading="lazy" style="object-position:${FACEP[x.hid] || '50% 12%'}" onerror="this.onerror=null;this.src='${esc(hero(x.hid).i)}'"><em>${sh}%</em></span>
        <b>${esc(hero(x.hid).n)}</b><span class="p10-hn"><span><i class="${wrC(wr, x.g)}">${Math.round(wr)}%</i><small>побед</small></span><span><i>${x.g}</i><small>${pl(x.g, ['игра', 'игры', 'игр'])}</small></span><span><i>${f1(x.k)}/${f1(x.d)}/${f1(x.a)}</i><small>У/С/П</small></span></span></a>`; }).join('')}</div></section>` : '';
  const side = `<div id="qkco"></div><section class="q-box r9-hs"><div class="r9-h2"><b>Чаще всего с</b><a href="#form/habits">привычки ›</a></div><div id="qkmate"><span class="sub">Считаю…</span></div></section>`;

  // что знать о нём — метки крупно: на ком играет, в чём силён, где сливает
  const T = profTags(H, HS, HA), P2x = patterns2(H), lg = P2x.find(x => /долгих/.test(x.n)), sh = P2x.find(x => /коротких/.test(x.n));
  if (lg && lg.d <= -8) T.splice(1, 0, ['Сливает долгие игры', 'r', `в играх 35+ мин побеждает в ${Math.round(lg.wr)}% — на ${f1(-lg.d)}% реже обычного`]);
  else if (lg && lg.d >= 8) T.splice(1, 0, ['Тащит долгие игры', 'g', `в играх 35+ мин побеждает в ${Math.round(lg.wr)}% — на ${f1(lg.d)}% чаще обычного`]);
  if (sh && sh.d <= -8) T.push(['Слабое начало', 'r', `короткие игры (до 25 мин) выигрывает в ${Math.round(sh.wr)}%`]);
  const know = T.length ? `<section class="p10-kn" id="p10kn">${T.slice(0, 8).map(([s, c, h], i) => `<div class="p10-t ${c || 'n'}" style="--i:${i}"><b>${esc(s)}</b><small>${esc(h)}</small></div>`).join('')}</section>` : '';

  // матчи
  const hlist = [...new Set(H.slice(0, 300).map(m => m.hero_id))].filter(h => D.heroes[h]).sort((a, b) => hero(a).n.localeCompare(hero(b).n));
  const hist = `<section class="q-box r9-hi" id="hist"><div class="r9-h2"><b>Матчи</b><span id="hsum" hidden></span><span class="sp" style="flex:1"></span>
      <div class="seg r9-md" id="hfm2">${[['', 'Все'], ['r', 'Ранговые'], ['u', 'Обычные']].map(([k, nm]) => `<button type="button" data-md="${k}" class="${(PHF.mode || '') === k ? 'on' : ''}">${nm}</button>`).join('')}</div>
      <select class="q-sel" id="hfh" aria-label="Герой"><option value="0">Все герои</option>${hlist.map(h => `<option value="${h}"${PHF.hero === h ? ' selected' : ''}>${esc(hero(h).n)}</option>`).join('')}</select></div>
    <div id="hrows"></div><button class="btn g q-more" id="hmore" type="button">Показать ещё</button></section>`;

  V(`${ptabsHTML('home')}${know}${sum}${heroes}<div class="r9-cols"><aside class="r9-side">${side}</aside><div class="r9-main">${hist}</div></div>
    <div id="mybw" hidden><div class="q-box"><div class="q-bh"><b>Сохранённые сборки</b></div><div class="pad" id="myb"></div></div></div>`);

  qkMates(n, id);
  coProfDraw(id, H); const co = $('#qkco');
  if (co) co.addEventListener('click', e => { const b = e.target.closest('[data-qkc]'); if (b && b.dataset.qkc === 'drop') { coTaskSave(null); coProfDraw(id, H); } });
  coProfCheck(id, H);
  $('#hfh').onchange = e => { PHF.hero = +e.target.value; HN = 20; drawHist(n); };
  $$('#hfm2 button').forEach(b => b.onclick = () => { PHF.mode = b.dataset.md; HN = 20; $$('#hfm2 button').forEach(x => x.classList.toggle('on', x === b)); drawHist(n); });
  $('#hmore').onclick = () => { HN += 20; drawHist(n); };
  const rows = $('#hrows');
  rows.onclick = e => { if (e.target.closest('a')) return; const r = e.target.closest('[data-m]'); if (r) location.hash = '#m/' + r.dataset.m; };
  rows.onkeydown = e => { if (e.key !== 'Enter' || e.target.closest('a')) return; const r = e.target.closest('[data-m]'); if (r) location.hash = '#m/' + r.dataset.m; };
  drawHist(n);
  gradeBase(badge).then(T2 => { if (n !== VQ) return; GT = T2; drawRows(n); });
  if (badge) api('players/rank/distribution').then(Dd => { if (n !== VQ) return; const tot = Dd.reduce((a, x) => a + (x.players || 0), 0), up = Dd.filter(x => x.badge >= badge).reduce((a, x) => a + (x.players || 0), 0); const el = $('#rtop'); if (el && tot) el.innerHTML = `топ ${f1(Math.max(.1, 100 * up / tot))}% игроков`; }).catch(() => {});
  topPlaces(n, id, ME.name, st.countrycode, pool);
  renderMyBuilds().then(() => { const b = $('#myb'), w = $('#mybw'); if (n === VQ && b && w && b.querySelector('a,img,.bch,.myc')) w.hidden = false; }).catch(() => {});
}
