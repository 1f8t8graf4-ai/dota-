// ==================== 01.11 · разбор матча по вкладкам: визуал и подробность — как Deadlock Labs, понятность — как LoG, прямые слова — как Porofessor ====================
const MZ = {mid: 0, slot: 0, tab: 'ov', win: 'all', lane: 0, dm: 'dmg', t: 0, play: 0};
let MX = null;
const MTABS = [['ov', 'Обзор'], ['pl', 'Игрок'], ['ln', 'Линии'], ['ec', 'Экономика'], ['dm', 'Урон'], ['map', 'Карта']];
const LANEN = {1: ['Жёлтая', '#f5c542'], 4: ['Синяя', '#4f8dff'], 6: ['Зелёная', '#3fd17f']};
const TEAMN = ['Янтарная рука', 'Сапфировое пламя'];
const mLS = p => (p.stats || [])[(p.stats || []).length - 1] || {};
const mAvg = (L, f) => L.reduce((a, x) => a + (+f(x) || 0), 0) / Math.max(1, L.length);
const mPlace = (L, f, p, low) => 1 + L.filter(q => q !== p && (low ? f(q) < f(p) : f(q) > f(p))).length;
const pname = p => (SN[p.account_id] || {}).n || 'Игрок';
const kfm = v => Math.abs(v) >= 1000 ? (v / 1000).toFixed(Math.abs(v) >= 1e5 ? 0 : 1).replace('.', ',') + 'k' : String(Math.round(v));
const gradeOf = s => GRS.find(x => s >= x[0])[1];
const gradeCol = g => GCOL2[g[0]] || '#8e897f';
// числа набегают, линии рисуются — один раз при показе
function mAnim(root) {
  if (!root || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const els = $$('[data-cu]', root); if (!els.length) return;
  const t0 = performance.now(), D2 = 650;
  const fmt = (el, v) => { const d = +el.dataset.cd || 0, sfx = el.dataset.cs || ''; el.textContent = (d ? v.toFixed(d).replace('.', ',') : nf(Math.round(v))) + sfx; };
  const step = t => { const k = Math.min(1, (t - t0) / D2), e = 1 - Math.pow(1 - k, 3); els.forEach(el => fmt(el, (+el.dataset.cu) * e)); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
const cu = (v, d, sfx) => `<b data-cu="${v}"${d ? ` data-cd="${d}"` : ''}${sfx ? ` data-cs="${sfx}"` : ''}>${d ? (+v).toFixed(d).replace('.', ',') : nf(Math.round(v))}${sfx || ''}</b>`;

// метрики игрока в матче
function mMet(X, p) {
  const s = mLS(p), dur = Math.max(60, X.dur), mn = dur / 60, T = X.P.filter(q => teamOf(q.team) === teamOf(p.team)), tk = T.reduce((a, q) => a + (q.kills || 0), 0);
  const shots = (s.shots_hit || 0) + (s.shots_missed || 0);
  return {k: p.kills || 0, d: p.deaths || 0, a: p.assists || 0, kda: ((p.kills || 0) + (p.assists || 0)) / Math.max(1, p.deaths || 0), nw: p.net_worth || 0, spm: (p.net_worth || 0) / mn,
    dmg: s.player_damage || 0, dpm: (s.player_damage || 0) / mn, tak: s.player_damage_taken || 0, tpm: (s.player_damage_taken || 0) / mn, heal: s.player_healing || 0, theal: s.teammate_healing || 0, hpm: (s.player_healing || 0) / mn,
    obj: s.boss_damage || 0, opm: (s.boss_damage || 0) / mn, acc: shots >= 150 ? (s.shots_hit || 0) / shots : null, crit: s.hero_bullets_hit ? (s.hero_bullets_hit_crit || 0) / s.hero_bullets_hit : null, hs: s.hero_bullets_hit_crit || 0,
    lh: p.last_hits || 0, den: p.denies || 0, cs: s.possible_creeps ? (s.creep_kills || 0) / s.possible_creeps : null, kp: tk ? ((p.kills || 0) + (p.assists || 0)) / tk : 0, mit: s.damage_mitigated || 0, dmin: (p.deaths || 0) / mn,
    hp: s.heal_prevented || 0, lvl: p.level || s.level || 0};
}

async function viewMatch2(mid, tab) {
  mid = +mid; const n = vNew();
  if (MZ.mid !== mid) { MZ.mid = mid; MZ.slot = 0; MZ.win = 'lane'; MZ.lane = 0; MZ.t = 0; }
  if (tab && MTABS.some(x => x[0] === tab)) MZ.tab = tab;
  V('<div class="load">Разбираю матч — все 12 игроков, линии, экономику и карту…</div>');
  let md; try { md = await api('matches/' + mid + '/metadata'); } catch (e) { if (n === VQ) V(`<div class="err">Матч не загрузился: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  const mi = md.match_info, P = mi.players.slice().sort((a, b) => teamOf(a.team) - teamOf(b.team) || a.player_slot - b.player_slot);
  await steamNames(P.map(p => p.account_id)); if (n !== VQ) return;
  const meP = ME ? P.find(p => p.account_id === ME.id) : null;
  if (!MZ.slot || !P.some(p => p.player_slot === MZ.slot)) MZ.slot = (meP || P[0]).player_slot;
  const GSN = {1: 'players', 2: 'lane_creeps', 3: 'neutrals', 4: 'bosses', 5: 'treasure', 6: 'assists', 7: 'denies', 8: 'team_bonus', 9: 'ability_assassinate', 10: 'item_trophy_collector', 11: 'item_cultist_sacrifice', 12: 'breakable', 13: 'item_goose_egg'};
  P.forEach(p => (p.stats || []).forEach(st => (st.gold_sources || []).forEach(g => { const k = 'gold_source_' + (GSN[g.source] || 'src' + g.source); st[k + '_gold'] = g.gold || 0; st[k + '_gold_orbs'] = g.gold_orbs || 0; })));
  const A = mAnalyze(mi);
  MX = {n, mid, mi, P, A, dur: mi.duration_s || 0, win: teamOf(mi.winning_team), meP, M: new Map(P.map(p => [p, null])), PT: mPaths(mi), IS: {}};
  P.forEach(p => MX.M.set(p, mMet(MX, p)));
  mDraw();
}
const mSel = () => MX.P.find(p => p.player_slot === MZ.slot) || MX.P[0];
function mHead() {
  const X = MX, mi = X.mi, k0 = X.P.filter(p => teamOf(p.team) === 0).reduce((a, p) => a + p.kills, 0), k1 = X.P.filter(p => teamOf(p.team) === 1).reduce((a, p) => a + p.kills, 0);
  const st = tsOf(mi.start_time), my = X.meP ? (teamOf(X.meP.team) === X.win ? ['Победа', 'win'] : ['Поражение', 'loss']) : [`Победа: ${TEAMN[X.win]}`, ''];
  const side = t => `<div class="qm-side t${t}${X.win === t ? ' w' : ''}">${X.P.filter(p => teamOf(p.team) === t).map(p => `<button class="qm-pf${p.player_slot === MZ.slot ? ' on' : ''}" data-sl="${p.player_slot}" title="${esc(pname(p))} · ${esc(hero(p.hero_id).n)}">${face(p.hero_id, teamOf(p.team) === X.win ? 'g' : 'c', '')}<span>${esc(pname(p))}</span></button>`).join('')}</div>`;
  return `<div class="qm-head"><a class="q-back" href="#home">‹ Профиль</a>
    <div class="qm-sb"><div class="qm-tn t0"><b>${TEAMN[0]}</b>${X.win === 0 ? '<em>победа</em>' : ''}${mi.average_badge_team0 ? rankImg(mi.average_badge_team0, 'ri') : ''}</div>
      <div class="qm-sc"><span class="t0">${cu(k0)}</span><div><b class="${my[1]}">${my[0]}</b><small>${mmss(X.dur)} · ${st ? esc(ago(st)) : ''} · ${esc(MODE({match_mode: mi.match_mode}))}</small></div><span class="t1">${cu(k1)}</span></div>
      <div class="qm-tn t1">${mi.average_badge_team1 ? rankImg(mi.average_badge_team1, 'ri') : ''}${X.win === 1 ? '<em>победа</em>' : ''}<b>${TEAMN[1]}</b></div></div>
    <div class="qm-pp">${side(0)}<i class="qm-vs">VS</i>${side(1)}</div>
    <nav class="qm-tabs">${MTABS.map(([k, v]) => `<button data-mt="${k}" class="${MZ.tab === k ? 'on' : ''}">${v}</button>`).join('')}</nav></div>`;
}
function mDraw() {
  const X = MX; if (!X || X.n !== VQ) return;
  V(`${mHead()}<div id="qmb" class="qm-b"></div><p class="note">Матч ${X.mid} · данные игры через api.deadlock-api.com · нажми на любого игрока сверху — разбор переключится на него.</p>`);
  mBody();
  $('#v').onclick = e => {
    const sl = e.target.closest('[data-sl]'); if (sl) { MZ.slot = +sl.dataset.sl; MZ.lane = 0; $$('.qm-pf').forEach(b => b.classList.toggle('on', +b.dataset.sl === MZ.slot)); mBody(); return; }
    const tb = e.target.closest('[data-mt]'); if (tb) { MZ.tab = tb.dataset.mt; $$('.qm-tabs button').forEach(b => b.classList.toggle('on', b === tb)); try { history.replaceState(null, '', '#m/' + X.mid + '/' + MZ.tab); } catch (er) {} mBody(); return; }
    const w = e.target.closest('[data-win]'); if (w) { MZ.win = w.dataset.win; mBody(); return; }
    const ln = e.target.closest('[data-lane]'); if (ln) { MZ.lane = +ln.dataset.lane; mBody(); return; }
    const dm = e.target.closest('[data-dmk]'); if (dm) { MZ.dm = dm.dataset.dmk; mBody(); return; }
    const go = e.target.closest('[data-goacc]'); if (go) { location.href = '?id=' + go.dataset.goacc + '#home'; }
  };
  mAnim($('.qm-head'));
}
function mBody() {
  const el = $('#qmb'); if (!el) return; cancelAnimationFrame(MZ.raf); MZ.play = 0;
  el.innerHTML = ({ov: mOv, pl: mPl, ln: mLn, ec: mEc, dm: mDm, map: mMap})[MZ.tab]();
  el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
  mAnim(el);
  if (MZ.tab === 'map') mMapBind();
  if (MZ.tab === 'pl') mPlLoad();
  if (MZ.tab === 'ov') mLate(mSel());
}

const mOpp = p => { const E = MX.P.filter(q => teamOf(q.team) !== teamOf(p.team)); return E.filter(q => q.assigned_lane === p.assigned_lane).sort((a, b) => b.net_worth - a.net_worth)[0] || E.slice().sort((a, b) => b.net_worth - a.net_worth)[0]; };
// главное словами — как Porofessor: прямо, без цифр ради цифр
function mPts(p) {
  const X = MX, T = X.P.filter(q => teamOf(q.team) === teamOf(p.team)), opp = mOpp(p), rk = f => 1 + T.filter(q => f(q) > f(p)).length, dmg = q => mLS(q).player_damage || 0, R = [];
  if (opp) { const a = mAt(p, 600), b = mAt(opp, 600); R.push(a >= b ? `Линию выиграл: к 10-й минуте <b class="win">+${nf(a - b)}</b> душ против ${esc(hero(opp.hero_id).n)}.` : `Линию проиграл: к 10-й минуте <b class="loss">−${nf(b - a)}</b> душ против ${esc(hero(opp.hero_id).n)}.`); }
  R.push(`Души — <b>${rk(q => q.net_worth)}-й</b> в команде, урон по героям — <b>${rk(dmg)}-й</b>.`);
  const avgD = mAvg(X.P, q => q.deaths); R.push(p.deaths > avgD * 1.3 ? `Смертей <b class="loss">${p.deaths}</b> — больше, чем в среднем в матче (${f1(avgD)}). Почему — справа.` : `Смертей ${p.deaths} — ${p.deaths <= avgD ? 'не больше' : 'чуть больше'} среднего в матче (${f1(avgD)}).`);
  if (opp && typeof TIPS !== 'undefined' && TIPS[opp.hero_id]) R.push(`Против ${esc(hero(opp.hero_id).n)}: ${TIPS[opp.hero_id][2]}`);
  return R;
}
// какие предметы купил позже, чем топы на этом герое — подгружаем
function mLate(p) {
  const X = MX, k = p.hero_id, el = () => $('#qmlate');
  const go = IS => { const seen = new Set(), L = []; for (const it of p.items || []) { const I = item(it.item_id), a = IS[it.item_id]; if (!I || seen.has(it.item_id)) continue; seen.add(it.item_id); if (a && a.matches >= 30 && I.t >= 3 && it.game_time_s - a.avg_buy_time_s > 150) L.push([I, it.game_time_s - a.avg_buy_time_s]); }
    L.sort((a, b) => b[1] - a[1]); const e = el(); if (e && L.length) { e.hidden = false; e.innerHTML = `${esc(L[0][0].n)} — на <b class="loss">${mmss(L[0][1])}</b> позже, чем покупают топы на этом герое${L[1] ? `; ${esc(L[1][0].n)} — на ${mmss(L[1][1])}` : ''}.`; } };
  if (X.IS[k]) return go(X.IS[k]);
  api(`analytics/item-stats?hero_id=${k}&min_average_badge=100&min_unix_timestamp=${now() - 30 * 86400 - now() % 3600}`).then(L => { const o = {}; (L || []).forEach(x => o[x.item_id] = x); X.IS[k] = o; if (MX === X && mSel() === p) go(o); }).catch(() => {});
}
// ----- Обзор: оценка, сильное и слабое против лобби, сравнения, все 12 игроков -----
const MCMP = [
  ['dmin', 'Редко умираешь', 'Часто умираешь', 'смертей в минуту', 1, v => v.toFixed(2).replace('.', ',')],
  ['cs', 'Хорошо добиваешь крипов', 'Мало добиваешь крипов', 'добито крипов из возможных', 0, v => Math.round(100 * v) + '%'],
  ['acc', 'Точная стрельба', 'Стрельба мимо', 'точность', 0, v => Math.round(100 * v) + '%'],
  ['dpm', 'Много урона по героям', 'Мало урона по героям', 'урона в минуту', 0, v => nf(Math.round(v))],
  ['spm', 'Отличный фарм', 'Слабый фарм', 'душ в минуту', 0, v => nf(Math.round(v))],
  ['kp', 'В каждой драке', 'Мало участвуешь в драках', 'участие в убийствах команды', 0, v => Math.round(100 * v) + '%'],
  ['opm', 'Ломаешь объекты', 'Мало урона по объектам', 'урона по объектам в минуту', 0, v => nf(Math.round(v))],
  ['hpm', 'Много лечения', '', 'лечения в минуту', 0, v => nf(Math.round(v))],
  ['den', 'Денаишь души', '', 'денаев', 0, v => nf(v)]];
function mOv() {
  const X = MX, p = mSel(), m = X.M.get(p), a = X.A.get(p), g = gradeOf(a.score), won = teamOf(p.team) === X.win;
  const L = X.P.map(q => X.M.get(q));
  const R = MCMP.map(([k, gd, bd, h, low, fmt]) => { const v = m[k]; if (v == null) return null; const vals = L.map(x => x[k]).filter(x => x != null), av = mAvg(vals, x => x); if (!av && !v) return null;
    const pl = 1 + vals.filter(x => low ? x < v : x > v).length, pct = Math.round(100 * (pl - 1) / Math.max(1, vals.length - 1)), r = low ? (av + .01) / (v + .01) : (v + .01) / (av + .01);
    return {k, gd, bd, h, v, av, pl, pct, r, fmt}; }).filter(Boolean);
  const good = R.filter(x => x.r >= 1.15 && x.pl <= 4).sort((a2, b) => b.r - a2.r).slice(0, 3), bad = R.filter(x => x.bd && x.r <= .87 && x.pl >= 7).sort((a2, b) => a2.r - b.r).slice(0, 3);
  const TG = typeof mTags === 'function' ? mTags(X.mi, p, X.A, X.PT, mOpp(p)) : [], DD = typeof mDeaths === 'function' ? mDeaths(X.mi, p, X.PT) : [];
  const lbl = a.score >= 70 ? 'Тащил матч' : a.score >= 58 ? 'Выше среднего' : a.score >= 45 ? 'Средне' : a.score >= 35 ? 'Ниже среднего' : 'Тяжёлый матч';
  const say = bad.length && !good.length ? 'Отстаёшь в ключевых местах — ниже по пунктам, что подтянуть.' : good.length && !bad.length ? 'Сыграл сильнее лобби — держи этот уровень.' : good.length ? `Сильнее всего: ${good[0].gd.toLowerCase()}. Слабее всего: ${bad[0].bd.toLowerCase()}.` : 'Ровный матч — ни сильно лучше, ни сильно хуже лобби.';
  const cmp = [['Убийства', 'k'], ['Смерти', 'd', 1], ['Помощь', 'a'], ['KDA', 'kda'], ['Урон по героям', 'dmg'], ['Души', 'nw']].map(([nm, k, low]) => { const v = m[k], av = mAvg(L, x => x[k]), mx = Math.max(1e-9, ...L.map(x => x[k])), dd = av ? Math.round(100 * (v - av) / av) : 0, ok = low ? v <= av : v >= av;
    return `<div class="qm-cr"><div><span>${nm}</span><b>${k === 'kda' ? f1(v) : kfm(v)}</b><small>в среднем ${k === 'kda' ? f1(av) : kfm(av)} · <em class="${ok ? 'win' : 'loss'}">${dd >= 0 ? '+' : ''}${dd}%</em></small></div><div class="qm-bar ${ok ? 'g' : 'r'}"><i style="--w:${Math.round(100 * v / mx)}%"></i><s style="left:${Math.round(100 * av / mx)}%"></s></div></div>`; }).join('');
  const tsum = (t, f) => X.P.filter(q => teamOf(q.team) === t).reduce((s2, q) => s2 + f(q), 0);
  const TR = [['Всего душ', q => q.net_worth || 0], ['Убийства', q => q.kills || 0], ['Смерти', q => q.deaths || 0], ['Крипы', q => mLS(q).creep_kills || 0], ['Денаи', q => q.denies || 0], ['Урон по героям', q => mLS(q).player_damage || 0], ['Урон по объектам', q => mLS(q).boss_damage || 0], ['Потеряно на смертях', q => mLS(q).gold_death_loss || 0]];
  return `<div class="qm-g2">
    <div class="qm-grade" style="--gc:${gradeCol(g)}"><div class="qm-gl">${g}</div><div class="qm-gi"><small class="${a.score >= 50 ? 'win' : 'loss'}">${lbl} · ${a.score} из 100</small>
      <div class="qm-who">${face(p.hero_id, won ? 'g' : 'c', 'm')}<span><b>${esc(pname(p))}</b><small>${esc(hero(p.hero_id).n)}</small></span></div>
      <div class="qm-chips"><span class="qm-res ${won ? 'w' : 'l'}">${won ? 'Победа' : 'Поражение'}</span><span class="qm-kda"><i class="win">${m.k}</i> / <i class="loss">${m.d}</i> / ${m.a}</span><span>${kfm(m.nw)} душ</span></div>
      <p>${esc(say)}</p>${TG.length ? `<div class="ptags qm-tags">${tagsHTML(TG)}</div>` : ''}</div></div>
    <div class="qm-sw"><div class="qm-swh g"><b>Сильные стороны</b><small>лучше лобби</small></div>${good.map(x => `<div class="qm-si g"><b>${x.gd}</b><span>${x.h}: ${x.fmt(x.v)} · в матче в среднем ${x.fmt(x.av)} · ${x.pl}-е место из 12</span></div>`).join('') || '<div class="empty">Ничего не выделяется сильно — ровно.</div>'}
      <div class="qm-swh r"><b>Что подтянуть</b><small>хуже лобби</small></div>${bad.map(x => `<div class="qm-si r"><b>${x.bd}</b><span>${x.h}: ${x.fmt(x.v)} · в матче в среднем ${x.fmt(x.av)} · ${x.pl}-е место из 12</span></div>`).join('') || '<div class="empty">Слабых мест нет — хороший матч.</div>'}</div></div>
    <div class="qm-g2b"><div class="qs-box"><div class="qs-bh"><b>Главное</b><small>коротко, что решило матч для тебя</small></div><ul class="pts qm-pts">${mPts(p).map(x => `<li>${x}</li>`).join('')}<li id="qmlate" hidden></li></ul></div>
      <div class="qs-box"><div class="qs-bh"><b>Почему умирал · ${p.deaths}</b><small>по позициям всех 12 в момент смерти</small></div><ul class="pts qm-pts">${typeof mDeathSum === 'function' ? mDeathSum(DD, X.dur) : ''}</ul>
        ${DD.length ? `<div class="qm-dls">${DD.map((d, i) => `<div class="qm-dtr"><em>${i + 1}</em><span class="q-num">${mmss(d.t)}</span>${d.k ? face(d.k.hero_id, '', 's') : ''}<span><b>${esc(d.k ? hero(d.k.hero_id).n : 'не герой')}</b><small>${esc(d.why.join(' · ') || 'обычная смерть в драке')}</small></span></div>`).join('')}</div>` : ''}</div></div>
    <div class="qs-box"><div class="qs-bh"><b>Против лобби</b><small>чёрточка — среднее по 12 игрокам этого матча</small></div><div class="qm-crs">${cmp}</div></div>
    <div class="qs-box"><div class="qs-bh"><b>Команды</b><small>${TEAMN[0]} против ${TEAMN[1]}</small></div>
      <div class="qm-tr">${TR.map(([nm, f]) => { const a0 = tsum(0, f), a1 = tsum(1, f), s2 = Math.max(1, a0 + a1); return `<div><b class="t0">${kfm(a0)}</b><span>${nm}</span><b class="t1">${kfm(a1)}</b><div class="qm-tb"><i class="t0" style="--w:${(100 * a0 / s2).toFixed(1)}%"></i><i class="t1" style="--w:${(100 * a1 / s2).toFixed(1)}%"></i></div></div>`; }).join('')}</div></div>
    <div class="qs-box"><div class="qs-bh"><b>Все 12 игроков</b><small>оценка 0–100 против лобби · нажми — разбор игрока</small></div>${mTable()}</div>`;
}
function mTable() {
  const X = MX, MDL = typeof mMedals === 'function' ? mMedals(X.mi.players, X.A) : new Map();
  return [0, 1].map(t => `<div class="qm-tt t${t}"><div class="qm-tth"><b>${TEAMN[t]}</b>${X.win === t ? '<em>победа</em>' : ''}</div><table class="q-tbl qm-tbl"><tr><th>Игрок</th><th>K / D / A</th><th class="qh">Души</th><th class="qh">Урон</th><th>Оценка</th></tr>
    ${X.P.filter(p => teamOf(p.team) === t).map(p => { const m = X.M.get(p), a = X.A.get(p), g = gradeOf(a.score), md = MDL.get(p) || [];
      return `<tr class="lk${p.player_slot === MZ.slot ? ' on' : ''}" data-sl="${p.player_slot}"><td><div class="q-hn">${face(p.hero_id, t === X.win ? 'g' : 'c', 's')}<span style="min-width:0"><b>${esc(pname(p))}</b><small>${esc(hero(p.hero_id).n)}${md.length ? ' · ' + md.map(x => esc(x[0])).join(', ') : ''}</small></span></div></td>
        <td><span class="q-kda">${m.k} / <i>${m.d}</i> / ${m.a}</span></td><td class="qh q-num">${kfm(m.nw)}</td><td class="qh q-num">${kfm(m.dmg)}</td><td><span class="grd q-grd sm" style="--gc:${gradeCol(g)}" title="${a.score} из 100">${g}</span></td></tr>`; }).join('')}</table></div>`).join('');
}

// ----- Игрок: досье, K/D/A, сборка (умения по порядку, предметы по минутам и фазам), карточки -----
function mPl() {
  const X = MX, p = mSel(), m = X.M.get(p), a = X.A.get(p), g = gradeOf(a.score), T = X.P.filter(q => teamOf(q.team) === teamOf(p.team)), TM = T.map(q => X.M.get(q));
  const h = hero(p.hero_id), rk = (p.player_rank_data || {}).initial_display_rank || 0;
  const abIds = new Set((h.ab || []).map(x => +x.id)), abN = {}; (h.ab || []).forEach((x, i) => abN[x.id] = {n: x.n, i: x.i, k: i});
  const its = (p.items || []).slice().sort((x, y) => x.game_time_s - y.game_time_s);
  const sk = its.filter(x => abIds.has(+x.item_id)), shop = its.filter(x => item(x.item_id) && !abIds.has(+x.item_id));
  const cnt = {}, cols = sk.map(x => { cnt[x.item_id] = (cnt[x.item_id] || 0) + 1; return {id: +x.item_id, c: cnt[x.item_id], t: x.game_time_s}; });
  const skill = (h.ab || []).slice(0, 4).map(ab => `<div class="qm-skr"><span>${ab.i ? `<img src="${esc(ab.i)}" alt="" loading="lazy">` : ''}${esc(ab.n)}</span><div class="qm-skc" style="--n:${Math.max(16, cols.length)}">${cols.map((c, i) => c.id === +ab.id ? `<i class="${c.c === 1 ? 'u' : ''}" style="grid-column:${i + 1}" title="${c.c === 1 ? 'открыл' : 'улучшение ' + (c.c - 1)} · ${mmss(c.t)}">${c.c === 1 ? '◆' : c.c - 1}</i>` : '').join('')}</div></div>`).join('');
  const fin = shop.filter(x => !x.sold_time_s), PH = [['Начало', 0, 600, 'до 10 мин'], ['Середина', 600, 1500, '10–25 мин'], ['Конец', 1500, 1e9, '25+ мин']];
  const ico = (x, cls) => { const I = item(x.item_id); return `<span class="qm-it ${cls || ''} ${esc(I.s || '')}" title="${esc(I.n)} · ${mmss(x.game_time_s)}${x.sold_time_s ? ' · продан на ' + mmss(x.sold_time_s) : ''}"><img src="${esc(I.i)}" alt="" loading="lazy"><em>${Math.round(x.game_time_s / 60)}'</em></span>`; };
  const card = (nm, main, vs, sub) => { const v = main[1], av = main[2], pl = main[3], up = main[4] ? v <= av : v >= av;
    return `<div class="qm-card"><div class="qm-cdh"><b>${nm}</b><em class="${pl === 1 ? 'top' : ''}">#${pl} из ${T.length}</em></div><span class="qm-cdk">${main[0]}</span><div class="qm-cdv">${cu(v)}</div>
      <small class="${up ? 'win' : 'loss'}">${v >= av ? '↑' : '↓'} ${nf(Math.abs(Math.round(v - av)))} ${v >= av ? 'выше' : 'ниже'} среднего по команде (${nf(Math.round(av))})</small><div class="qm-bar ${up ? 'g' : 'r'}"><i style="--w:${Math.min(100, Math.round(100 * v / Math.max(1, ...vs)))}%"></i><s style="left:${Math.min(100, Math.round(100 * av / Math.max(1, ...vs)))}%"></s></div>
      ${sub.map(([k, val, tav, isTop]) => `<div class="qm-cdr"><span>${k}${isTop ? ' <i class="top">лучший</i>' : ''}</span><b>${val}<small>в команде ${tav}</small></b></div>`).join('')}</div>`; };
  const top = (f, low) => mPlace(T, q => f(X.M.get(q)), p, low) === 1;
  const at9 = (q, k) => mAt(q, 540, k), late = q => (mLS(q).player_damage || 0) - mAt(q, 1200, 'player_damage');
  const cards = [
    card('Урон', ['по героям за матч', m.dmg, mAvg(TM, x => x.dmg), mPlace(T, q => X.M.get(q).dmg, p)], TM.map(x => x.dmg), [['В минуту', nf(Math.round(m.dpm)), nf(Math.round(mAvg(TM, x => x.dpm))), top(x => x.dpm)], ['За одну жизнь', nf(Math.round(m.dmg / (m.d + 1))), nf(Math.round(mAvg(TM, x => x.dmg / (x.d + 1)))), top(x => x.dmg / (x.d + 1))], ['После 20 мин', nf(late(p)), nf(Math.round(mAvg(T, late))), mPlace(T, late, p) === 1], ['На 1 душу', f2(m.dmg / Math.max(1, m.nw)), f2(mAvg(TM, x => x.dmg / Math.max(1, x.nw))), top(x => x.dmg / Math.max(1, x.nw))]]),
    card('Живучесть', ['получено урона', m.tak, mAvg(TM, x => x.tak), mPlace(T, q => X.M.get(q).tak, p, 1), 1], TM.map(x => x.tak), [['Смерти', nf(m.d), f1(mAvg(TM, x => x.d)), top(x => x.d, 1)], ['Смягчено урона', nf(m.mit), nf(Math.round(mAvg(TM, x => x.mit))), top(x => x.mit)], ['Получено в минуту', nf(Math.round(m.tpm)), nf(Math.round(mAvg(TM, x => x.tpm))), top(x => x.tpm, 1)]]),
    card('Командная игра', ['участие в убийствах, %', Math.round(100 * m.kp), Math.round(100 * mAvg(TM, x => x.kp)), mPlace(T, q => X.M.get(q).kp, p)], TM.map(x => 100 * x.kp), [['Помощь', nf(m.a), f1(mAvg(TM, x => x.a)), top(x => x.a)], ['Лечение союзников', nf(m.theal), nf(Math.round(mAvg(TM, x => x.theal))), top(x => x.theal)], ['Срезано лечения врагам', nf(m.hp), nf(Math.round(mAvg(TM, x => x.hp))), top(x => x.hp)]]),
    card('Экономика', ['душ в минуту', m.spm, mAvg(TM, x => x.spm), mPlace(T, q => X.M.get(q).spm, p)], TM.map(x => x.spm), [['Всего душ', nf(m.nw), nf(Math.round(mAvg(TM, x => x.nw))), top(x => x.nw)], ['Добивания', nf(m.lh), nf(Math.round(mAvg(TM, x => x.lh))), top(x => x.lh)], ['Денаи', nf(m.den), f1(mAvg(TM, x => x.den)), top(x => x.den)], ['Крипы из возможных', m.cs != null ? Math.round(100 * m.cs) + '%' : '—', Math.round(100 * mAvg(TM.filter(x => x.cs != null), x => x.cs)) + '%', top(x => x.cs || 0)]]),
    card('Начало игры', ['урон по героям до 9:00', at9(p, 'player_damage'), mAvg(T, q => at9(q, 'player_damage')), mPlace(T, q => at9(q, 'player_damage'), p)], T.map(q => at9(q, 'player_damage')), [['Убийства до 9:00', nf(at9(p, 'kills')), f1(mAvg(T, q => at9(q, 'kills'))), mPlace(T, q => at9(q, 'kills'), p) === 1], ['Смерти до 9:00', nf(at9(p, 'deaths')), f1(mAvg(T, q => at9(q, 'deaths'))), mPlace(T, q => at9(q, 'deaths'), p, 1) === 1], ['Души к 9:00', nf(at9(p, 'net_worth')), nf(Math.round(mAvg(T, q => at9(q, 'net_worth')))), mPlace(T, q => at9(q, 'net_worth'), p) === 1]]),
    card('Объекты', ['урон по стражам и боссам', m.obj, mAvg(TM, x => x.obj), mPlace(T, q => X.M.get(q).obj, p)], TM.map(x => x.obj), [['В минуту', nf(Math.round(m.opm)), nf(Math.round(mAvg(TM, x => x.opm))), top(x => x.opm)]])];
  return `<div class="qm-dos" style="--hc:${esc(h.col || '#ffb630')}"><i class="bg" style="background-image:url('art/${p.hero_id}.webp')"></i>
      <div class="qm-dl">${face(p.hero_id, teamOf(p.team) === X.win ? 'g' : 'c', 'l')}<div><small>${esc(TEAMN[teamOf(p.team)])} · уровень ${m.lvl}</small><h2>${esc(pname(p))}</h2><b class="qm-dh">${esc(h.n)}</b>
        <div class="qm-dc">${rk ? `<span>${rankImg(rk, 'ri')}${esc(rankOf(rk).name)}</span>` : ''}<span id="qmhs">на герое: …</span>${p.account_id ? `<a class="lnk" href="?id=${p.account_id}#home">профиль ›</a>` : ''}</div></div></div>
      <div class="qm-dg" style="--gc:${gradeCol(g)}"><b>${g}</b><small>оценка ${a.score}</small></div></div>
    <div class="qm-kda3"><div><span>Убийства</span>${cu(m.k)}<i class="g" style="--w:${Math.min(100, 100 * m.k / Math.max(1, ...X.P.map(q => q.kills)))}%"></i></div><div><span>Смерти</span>${cu(m.d)}<i class="r" style="--w:${Math.min(100, 100 * m.d / Math.max(1, ...X.P.map(q => q.deaths)))}%"></i></div><div><span>Помощь</span>${cu(m.a)}<i class="v" style="--w:${Math.min(100, 100 * m.a / Math.max(1, ...X.P.map(q => q.assists)))}%"></i></div></div>
    <div class="qm-kdr"><span>KDA <b>${f2(m.kda)}</b></span><span>Участие <b>${Math.round(100 * m.kp)}%</b></span><span>Точность <b>${m.acc != null ? Math.round(100 * m.acc) + '%' : '—'}</b></span><span>В голову <b>${nf(m.hs)}</b></span></div>
    <div class="qs-box"><div class="qs-bh"><b>Сборка за матч</b><small>${shop.length} ${pl(shop.length, ['покупка', 'покупки', 'покупок'])} · ${sk.length} ${pl(sk.length, ['очко умений', 'очка умений', 'очков умений'])}</small></div>
      ${sk.length ? `<div class="qm-sk"><div class="qm-skh">Порядок умений <small>◆ — открыл, цифра — улучшение; наведи — минута</small></div>${skill}</div>` : ''}
      <div class="qm-skh">Финальная сборка <small>цифра — на какой минуте купил</small></div><div class="qm-fin">${fin.map(x => ico(x)).join('') || '<span class="sub">Нет данных о предметах.</span>'}</div>
      <div class="qm-skh">Покупки по времени <small>каждая метка — предмет; бледные — потом продал</small></div>
      <div class="qm-tl">${shop.map(x => `<span class="qm-tlm${x.sold_time_s ? ' sold' : ''}" style="left:${(100 * x.game_time_s / Math.max(1, X.dur)).toFixed(1)}%" title="${esc(item(x.item_id).n)} · ${mmss(x.game_time_s)}"><img src="${esc(item(x.item_id).i)}" alt="" loading="lazy"></span>`).join('')}<div class="qm-tla">${[0, .25, .5, .75, 1].map(f => `<i style="left:${f * 100}%">${mmss(f * X.dur)}</i>`).join('')}</div></div>
      <div class="qm-skh">По фазам</div><div class="qm-ph">${PH.map(([nm, a0, b0, hh]) => { const L = shop.filter(x => x.game_time_s >= a0 && x.game_time_s < b0); return `<div><b>${nm}</b><small>${hh} · ${L.length}</small><div>${L.map(x => ico(x, 's')).join('') || '<span class="sub">—</span>'}</div></div>`; }).join('')}</div></div>
    <div class="qm-cards">${cards.join('')}</div>`;
}
function mPlLoad() {
  const p = mSel(); if (!p || !p.account_id) return;
  api('players/hero-stats?account_ids=' + p.account_id).then(L => { const x = (L || []).find(r => r.hero_id === p.hero_id), el = $('#qmhs'); if (el) el.textContent = x ? `на герое: ${nf(x.matches_played)} ${pl(x.matches_played, ['игра', 'игры', 'игр'])} · ${Math.round(100 * x.wins / Math.max(1, x.matches_played))}% побед` : 'на герое: первая игра'; }).catch(() => {});
}

// ----- Линии: дуэт против дуэта по окнам времени -----
const MWIN = [['lane', 'Линия · до 10 мин', 0, 600], ['all', 'Весь матч', 0, 1e9], ['0', '0–3 мин', 0, 180], ['3', '3–6', 180, 360], ['6', '6–9', 360, 540], ['9', '9–12', 540, 720], ['12', '12–15', 720, 900], ['15', '15–20', 900, 1200], ['20', '20+', 1200, 1e9]];
function mLn() {
  const X = MX, p = mSel(), lanes = [...new Set(X.P.map(q => q.assigned_lane))].filter(Boolean).sort((a, b) => a - b);
  const ln = MZ.lane && lanes.includes(MZ.lane) ? MZ.lane : p.assigned_lane, W = MWIN.find(w => w[0] === MZ.win) || MWIN[0];
  const t0 = W[2], t1 = Math.min(W[3], X.dur), d = (q, k) => (t1 >= X.dur ? (k === 'net_worth' ? q.net_worth : (mLS(q)[k] || 0)) : mAt(q, t1, k)) - (t0 ? mAt(q, t0, k) : 0);
  const A0 = X.P.filter(q => q.assigned_lane === ln && teamOf(q.team) === 0), A1 = X.P.filter(q => q.assigned_lane === ln && teamOf(q.team) === 1);
  const S = (L, k) => L.reduce((s, q) => s + d(q, k), 0), s0 = S(A0, 'net_worth'), s1 = S(A1, 'net_worth'), lead = s0 - s1;
  const ROWS = [['Убийства', 'kills'], ['Смерти', 'deaths'], ['Урон по объектам', 'boss_damage'], ['Крипы', 'creep_kills'], ['Денаи', 'denies'], ['Урон по героям', 'player_damage'], ['Получено урона', 'player_damage_taken']];
  const mine = teamOf(p.team) === 0 ? lead : -lead, ln2 = LANEN[ln] || ['Линия ' + ln, '#888'];
  const who = X.meP && teamOf(X.meP.team) === teamOf(p.team) ? 'Твоя сторона' : 'Сторона ' + pname(p), verdict = (Math.abs(mine) < 600 ? `Ровно: разница ${nf(Math.abs(Math.round(mine)))} душ` : mine > 0 ? `Твоя сторона выиграла линию: +${nf(Math.round(mine))} душ` : `Твоя сторона проиграла линию: −${nf(Math.round(-mine))} душ`).replace('Твоя сторона', who);
  const pc2 = (q, ks) => ks.map(([nm, k]) => { const v = d(q, k), L = [...A0, ...A1].map(z => d(z, k)), mx = Math.max(1, ...L), best = v === Math.max(...L) && v > 0;
    return `<div class="qm-pcm"><span>${nm}${best ? '<em>макс.</em>' : ''}</span><b>${kfm(v)}</b><i style="--w:${Math.round(100 * v / mx)}%"></i></div>`; }).join('');
  return `<div class="qm-lnf"><div class="seg">${lanes.map(l => `<button data-lane="${l}" class="${l === ln ? 'on' : ''}"><i class="dot" style="background:${(LANEN[l] || [0, '#888'])[1]}"></i>${(LANEN[l] || ['Линия ' + l])[0]}</button>`).join('')}</div>
      <div class="seg">${MWIN.map(w => `<button data-win="${w[0]}" class="${w[0] === W[0] ? 'on' : ''}">${w[1]}</button>`).join('')}</div></div>
    <div class="qs-box qm-duel" style="--lc:${ln2[1]}"><div class="qs-bh"><b>Дуэль на линии · ${ln2[0]}</b><small>${W[0] === 'all' ? 'за весь матч' : 'с ' + mmss(t0) + ' по ' + mmss(t1)}</small></div>
      <div class="qm-dt"><div class="t0"><small>${TEAMN[0]}</small>${cu(s0)}</div><div class="qm-lead"><small>перевес</small><b class="${lead >= 0 ? 't0' : 't1'}">+${nf(Math.abs(Math.round(lead)))}</b><span>${TEAMN[lead >= 0 ? 0 : 1]}</span></div><div class="t1"><small>${TEAMN[1]}</small>${cu(s1)}</div></div>
      <div class="qm-db"><i style="--w:${(100 * s0 / Math.max(1, s0 + s1)).toFixed(1)}%"></i></div><p class="qm-verd ${Math.abs(mine) < 600 ? '' : mine > 0 ? 'win' : 'loss'}">${esc(verdict)}</p>
      <div class="qm-drs">${ROWS.map(([nm, k]) => { const a0 = S(A0, k), a1 = S(A1, k), mx = Math.max(1, a0, a1); return `<div class="qm-dr"><div class="l"><b>${kfm(a0)}</b><i style="--k:${(a0 / mx).toFixed(3)}"></i></div><span>${nm}</span><div class="r"><i style="--k:${(a1 / mx).toFixed(3)}"></i><b>${kfm(a1)}</b></div></div>`; }).join('')}</div></div>
    <div class="qs-box"><div class="qs-bh"><b>Каждый на линии</b><small>макс. — лучший из четырёх</small></div>
      ${[[A0, 0], [A1, 1]].map(([L, t]) => `<div class="qm-pg t${t}"><div class="qm-tth"><b>${TEAMN[t]}</b></div>${L.map(q => `<div class="qm-pc t${t}${q === p ? ' on' : ''}" data-sl="${q.player_slot}">${face(q.hero_id, '', 'm')}<div class="qm-pcn"><b>${esc(pname(q))}</b><small>${esc(hero(q.hero_id).n)} · ${d(q, 'kills')}/${d(q, 'deaths')}/${d(q, 'assists')}</small></div>
        <div class="qm-pcs">${pc2(q, [['Души', 'net_worth'], ['Убийства', 'kills'], ['Объекты', 'boss_damage'], ['Крипы', 'creep_kills'], ['Денаи', 'denies'], ['Урон', 'player_damage'], ['Получено', 'player_damage_taken']])}</div></div>`).join('') || '<div class="empty">Никого на этой линии.</div>'}</div>`).join('')}</div>`;
}

// ----- Экономика: перевес команд по времени, души в минуту по источникам, доходы всех 12 -----
function mTimes(X) { const T = new Set([0]); X.P.forEach(p => (p.stats || []).forEach(s => T.add(s.time_stamp_s))); return [...T].sort((a, b) => a - b).filter(t => t <= X.dur + 1); }
function mChart(pts, o) {
  o = o || {}; const W = 1000, Hh = o.h || 220, pad = 30, xs = pts.map(q => q[0]), x0 = Math.min(...xs), x1 = Math.max(...xs, x0 + 1), ys = pts.map(q => q[1]), mx = Math.max(1, ...ys.map(Math.abs));
  const X2 = t => pad + (W - 2 * pad) * (t - x0) / (x1 - x0), Y2 = v => o.mid ? Hh / 2 - (Hh / 2 - 14) * v / mx : Hh - 14 - (Hh - 28) * v / mx;
  const line = pts.map(q => `${X2(q[0]).toFixed(1)},${Y2(q[1]).toFixed(1)}`).join(' ');
  const base = o.mid ? Hh / 2 : Hh - 14;
  return `<svg class="qm-ch" viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none" role="img">${o.mid ? `<line class="z" x1="${pad}" x2="${W - pad}" y1="${base}" y2="${base}"/>` : ''}
    <defs><linearGradient id="${o.id || 'g1'}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${o.c1 || '#ffb630'}" stop-opacity=".5"/><stop offset="1" stop-color="${o.c2 || o.c1 || '#ffb630'}" stop-opacity=".02"/></linearGradient></defs>
    ${o.split ? `<polygon class="ar" fill="rgba(255,182,48,.34)" points="${X2(x0)},${base} ${pts.map(q => `${X2(q[0]).toFixed(1)},${Y2(Math.max(0, q[1])).toFixed(1)}`).join(' ')} ${X2(x1)},${base}"/><polygon class="ar" fill="rgba(91,140,255,.34)" points="${X2(x0)},${base} ${pts.map(q => `${X2(q[0]).toFixed(1)},${Y2(Math.min(0, q[1])).toFixed(1)}`).join(' ')} ${X2(x1)},${base}"/><polyline class="ln" pathLength="1" points="${line}" stroke="#eef0f4"/><text x="${pad + 6}" y="16" text-anchor="start" class="t0l">${TEAMN[0]} впереди ↑</text><text x="${pad + 6}" y="${Hh - 22}" text-anchor="start" class="t1l">${TEAMN[1]} впереди ↓</text>` : `<polygon class="ar" fill="url(#${o.id || 'g1'})" points="${X2(x0)},${base} ${line} ${X2(x1)},${base}"/><polyline class="ln" pathLength="1" points="${line}" stroke="${o.c1 || '#ffb630'}"/>`}
    ${(o.ticks || []).map(t => `<text x="${X2(t)}" y="${Hh - 1}" text-anchor="middle">${mmss(t)}</text>`).join('')}</svg>`;
}
function mEc() {
  const X = MX, p = mSel(), T = mTimes(X), nw = (q, t) => t >= X.dur ? q.net_worth : (t ? mAt(q, t) : 0);
  const team = (t, k) => X.P.filter(q => teamOf(q.team) === k).reduce((s, q) => s + nw(q, t), 0);
  const LD = T.map(t => [t, team(t, 0) - team(t, 1)]), s0 = team(X.dur, 0), s1 = team(X.dur, 1), mn = Math.max(1, X.dur / 60);
  const pk = LD.reduce((a, q) => Math.abs(q[1]) > Math.abs(a[1]) ? q : a, [0, 0]); let sw = 0; for (let i = 1; i < LD.length; i++) if (Math.sign(LD[i][1]) && Math.sign(LD[i - 1][1]) && Math.sign(LD[i][1]) !== Math.sign(LD[i - 1][1])) sw++;
  const fin = s0 - s1, lead = fin >= 0 ? 0 : 1;
  const ticks = [0, .25, .5, .75, 1].map(f => Math.round(f * X.dur));
  // души в минуту выбранного игрока по источникам
  const SR = [...SRC, ['tb', 'Командный бонус', '#e8d36a', ['team_bonus']], ['oth', 'Прочее', '#8b93a4', null]], sv = (st, keys) => keys ? srcOf(st, keys) : Math.max(0, srcOther(st) - srcOf(st, ['team_bonus']));
  const PS = (p.stats || []).filter((x, i, L) => !(i === L.length - 2 && L.length > 2 && L[i + 1].time_stamp_s - x.time_stamp_s < 90)), SS = SR.map(x => x[0]), seg = []; let prev = {};
  PS.forEach(s => { const dt = Math.max(1, s.time_stamp_s - (prev.time_stamp_s || 0)) / 60; const row = {t: s.time_stamp_s}; SR.forEach(([k, , , keys]) => { row[k] = Math.max(0, sv(s, keys) - (prev.time_stamp_s != null ? sv(prev, keys) : 0)) / dt; }); seg.push(row); prev = s; });
  if (seg.length) seg.unshift(Object.assign({}, seg[0], {t: 0}));
  const smx = Math.max(1, ...seg.map(r => SS.reduce((a, k) => a + r[k], 0)));
  const stackW = 1000, stackH = 220, xs = t => 30 + (stackW - 60) * t / Math.max(1, X.dur), ys = v => stackH - 16 - (stackH - 30) * v / smx;
  let acc = seg.map(() => 0); const layers = SR.map(([k, nm, col]) => { const lo = acc.slice(); acc = acc.map((v, i) => v + seg[i][k]); const up = acc.slice();
    const top = seg.map((r, i) => `${xs(r.t).toFixed(1)},${ys(up[i]).toFixed(1)}`), bot = seg.map((r, i) => `${xs(r.t).toFixed(1)},${ys(lo[i]).toFixed(1)}`).reverse();
    return `<polygon class="lay" fill="${col}" points="${top.concat(bot).join(' ')}"><title>${nm}</title></polygon>`; }).join('');
  const tot = SR.map(([k, nm, col, keys]) => ({k, nm, col, v: sv(mLS(p), keys)})), tt = tot.reduce((a, x) => a + x.v, 0) || 1;
  const spm = seg.map(r => SS.reduce((a, k) => a + r[k], 0)), peak = Math.max(...spm, 0);
  return `<div class="qs-box qm-eh"><div class="qm-et"><div class="t0"><small>${TEAMN[0]}</small>${cu(s0)}<span>${nf(Math.round(s0 / mn))} душ/мин</span></div>
      <div class="qm-lead"><small>итог</small><b class="${lead ? 't1' : 't0'}">+${nf(Math.abs(Math.round(fin)))}</b><span>${TEAMN[lead]}</span></div>
      <div class="t1"><small>${TEAMN[1]}</small>${cu(s1)}<span>${nf(Math.round(s1 / mn))} душ/мин</span></div></div>
      <div class="qm-db"><i style="--w:${(100 * s0 / Math.max(1, s0 + s1)).toFixed(1)}%"></i></div>
      <div class="qm-ef"><span>Пик перевеса <b class="${pk[1] >= 0 ? 't0' : 't1'}">${TEAMN[pk[1] >= 0 ? 0 : 1]} +${kfm(Math.abs(pk[1]))}</b> на ${mmss(pk[0])}</span><span>Перевес менялся <b>${sw}</b> ${pl(sw, ['раз', 'раза', 'раз'])}</span><span>Итог <b class="${lead ? 't1' : 't0'}">${TEAMN[lead]} +${kfm(Math.abs(fin))}</b></span></div></div>
    <div class="qs-box"><div class="qs-bh"><b>Перевес по душам</b><small>выше середины — ведёт ${TEAMN[0]}, ниже — ${TEAMN[1]}</small></div>${mChart(LD, {mid: true, id: 'gld', split: true, ticks})}</div>
    <div class="qs-box"><div class="qs-bh"><b>Души в минуту · ${esc(pname(p))}</b><small>${esc(hero(p.hero_id).n)} · откуда приходили души · выбери другого игрока сверху</small></div>
      <div class="qm-src">${tot.filter(x => x.v > 0).map(x => `<i style="flex:${x.v};background:${x.col}" title="${x.nm}: ${nf(x.v)}">${x.v / tt >= .07 ? `${x.nm} ${Math.round(100 * x.v / tt)}%` : ''}</i>`).join('')}</div>
      <div class="qm-srl">${tot.filter(x => x.v > 0).map(x => `<span><i style="background:${x.col}"></i>${x.nm} ${kfm(x.v)}</span>`).join('')}</div>
      <div class="qm-spm"><div class="qm-spc"><b>${nf(Math.round(m2(p).spm))}</b><small>душ в минуту в среднем</small><span>пик ${nf(Math.round(peak))} · всего ${kfm(p.net_worth)}</span></div>
        <svg class="qm-ch st" viewBox="0 0 ${stackW} ${stackH}" preserveAspectRatio="none">${layers}${ticks.map(t => `<text x="${xs(t)}" y="${stackH - 2}" text-anchor="middle">${mmss(t)}</text>`).join('')}</svg></div></div>
    <div class="qs-box"><div class="qs-bh"><b>Доходы всех 12</b><small>откуда пришли души у каждого · красным — потеряно на смертях</small></div>
      ${[0, 1].map(t => `<div class="qm-inc"><div class="qm-tth"><b>${TEAMN[t]}</b><small>${kfm(team(X.dur, t))} всего</small></div><div class="qm-ig">${X.P.filter(q => teamOf(q.team) === t).sort((a, b) => b.net_worth - a.net_worth).map(q => { const S2 = SR.map(([k, nm, col, keys]) => ({nm, col, v: sv(mLS(q), keys)})).filter(x => x.v > 0).sort((a, b) => b.v - a.v), s3 = S2.reduce((a, x) => a + x.v, 0) || 1;
        return `<div class="qm-ic${q === p ? ' on' : ''}" data-sl="${q.player_slot}"><div class="qm-ich">${face(q.hero_id, '', 's')}<b>${esc(pname(q))}</b><span>${kfm(q.net_worth)}</span></div>${S2.map(x => `<div class="qm-icr"><i style="background:${x.col}"></i><span>${x.nm}</span><b>${kfm(x.v)}</b><small>${Math.round(100 * x.v / s3)}%</small></div>`).join('')}${mLS(q).gold_death_loss ? `<div class="qm-icr loss"><i></i><span>Потеряно на смертях</span><b>−${kfm(mLS(q).gold_death_loss)}</b><small></small></div>` : ''}</div>`; }).join('')}</div></div>`).join('')}</div>`;
}
const m2 = p => MX.M.get(p);

// ----- Урон: рейтинг 12 игроков по виду урона, у игрока — урон по времени и доли по источникам -----
const DMK = [['dmg', 'Урон по героям', q => mLS(q).player_damage || 0, '#ff5d7a'], ['obj', 'Урон по объектам', q => mLS(q).boss_damage || 0, '#5b8cff'], ['heal', 'Лечение', q => mLS(q).player_healing || 0, '#33d6a6'], ['tak', 'Получено урона', q => mLS(q).player_damage_taken || 0, '#b07cff']];
const srcNice = s => { const t = String(s || ''); if (/_crit$/.test(t)) return ['Попадания в голову', 'w']; if (/weapon|^Bullet$/i.test(t)) return ['Оружие', 'w']; if (/^Melee$|melee/i.test(t)) return ['Ближний бой', 'm'];
  const nm = t.replace(/^(citadel_ability_|ability_|upgrade_|citadel_)/, '').replace(/_/g, ' ').trim(); const key = nm.replace(/\s/g, '').toLowerCase();
  const it = Object.values(D.items).find(x => x.n && x.n.replace(/[^a-z]/gi, '').toLowerCase() === key); if (it) return [it.n, 'i', it.i];
  return [nm ? nm[0].toUpperCase() + nm.slice(1) : 'Другое', /^upgrade_/.test(t) ? 'i' : 'a']; };
function mDm() {
  const X = MX, p = mSel(), K = DMK.find(x => x[0] === MZ.dm) || DMK[0], f = K[2];
  const L = X.P.slice().sort((a, b) => f(b) - f(a)), mx = Math.max(1, ...L.map(f)), t0 = X.P.filter(q => teamOf(q.team) === 0).reduce((s, q) => s + f(q), 0), t1 = X.P.filter(q => teamOf(q.team) === 1).reduce((s, q) => s + f(q), 0);
  const dm = X.mi.damage_matrix, src = {};
  if (dm && dm.damage_dealers) { const st = dm.source_details.stat_type, nm = dm.source_details.source_name, dd = dm.damage_dealers.find(x => x.dealer_player_slot === p.player_slot), foes = new Set(X.P.filter(q => teamOf(q.team) !== teamOf(p.team)).map(q => q.player_slot));
    (dd ? dd.damage_sources : []).forEach(s => { if (st[s.source_details_index] !== 0) return; const v = (s.damage_to_players || []).filter(z => foes.has(z.target_player_slot)).reduce((a, z) => a + ((z.damage || [])[z.damage.length - 1] || 0), 0); if (!v) return;
      const [n2, kind, ic] = srcNice(nm[s.source_details_index]); const o = src[n2] = src[n2] || {n: n2, kind, ic, v: 0}; o.v += v; }); }
  const SL = Object.values(src).sort((a, b) => b.v - a.v), ssum = SL.reduce((a, x) => a + x.v, 0) || 1;
  const T = mTimes(X), DT = T.map(t => [t, t >= X.dur ? (mLS(p).player_damage || 0) : (t ? mAt(p, t, 'player_damage') : 0)]);
  const KC = {w: 'Оружие', a: 'Умение', i: 'Предмет', m: 'Ближний'};
  return `<div class="qs-box"><div class="qs-bh"><b>Команды · ${K[1].toLowerCase()}</b><div class="seg">${DMK.map(x => `<button data-dmk="${x[0]}" class="${x[0] === K[0] ? 'on' : ''}">${x[1]}</button>`).join('')}</div></div>
      <div class="qm-dmt"><div class="t0"><small>${TEAMN[0]}</small>${cu(t0)}</div><i>vs</i><div class="t1"><small>${TEAMN[1]}</small>${cu(t1)}</div></div>
      <div class="qm-rl">${L.map((q, i) => `<div class="qm-rr t${teamOf(q.team)}${q === p ? ' on' : ''}" data-sl="${q.player_slot}"><em>${i + 1}</em>${face(q.hero_id, '', 's')}<span><b>${esc(pname(q))}</b><small>${esc(hero(q.hero_id).n)}</small></span><div class="qm-bar"><i style="--w:${Math.round(100 * f(q) / mx)}%;background:var(--tc)"></i></div><b>${kfm(f(q))}</b></div>`).join('')}</div></div>
    <div class="qm-g2b"><div class="qs-box"><div class="qs-bh"><b>Урон по героям по ходу матча · ${esc(pname(p))}</b><small>накопительно</small></div>${mChart(DT, {id: 'gdm', c1: '#ff5d7a', ticks: [0, .25, .5, .75, 1].map(x => Math.round(x * X.dur))})}
        <div class="qm-kdr"><span>Всего <b>${kfm(m2(p).dmg)}</b></span><span>В минуту <b>${nf(Math.round(m2(p).dpm))}</b></span><span>Точность <b>${m2(p).acc != null ? Math.round(100 * m2(p).acc) + '%' : '—'}</b></span><span>Криты <b>${m2(p).crit != null ? Math.round(100 * m2(p).crit) + '%' : '—'}</b></span></div></div>
      <div class="qs-box"><div class="qs-bh"><b>Чем бил</b><small>доли урона по источникам — по данным игры</small></div>${SL.slice(0, 7).map((x, i) => `<div class="qm-srcr"><em>${i + 1}</em>${x.ic ? `<img src="${esc(x.ic)}" alt="">` : `<i class="k ${x.kind}"></i>`}<span><b>${esc(x.n)}</b><small>${KC[x.kind] || ''}</small><i class="qm-sb2" style="--w:${Math.round(100 * x.v / SL[0].v)}%"></i></span><b>${Math.round(100 * x.v / ssum)}%</b></div>`).join('') || '<div class="empty">В этом матче игра не отдала разбивку урона.</div>'}</div></div>`;
}

// ----- Карта: повтор матча — где был каждый, смерти, с ползунком и «Играть» -----
function mMap() {
  const X = MX, PT = typeof mPaths === 'function' ? mPaths(X.mi) : {};
  if (!Object.keys(PT).length) return '<div class="empty">Для этого матча игра не отдала позиции игроков — повтора нет.</div>';
  MX.PT = PT; MZ.t = Math.min(MZ.t || 0, X.dur);
  return `<div class="qm-rp"><div class="qm-rs t0">${X.P.filter(p => teamOf(p.team) === 0).map(mRow).join('')}</div>
      <div class="qm-rm"><div class="qm-rmh"><b class="t0" id="rk0">0</b><div><b id="rtm">0:00</b><small id="rld">ровно</small></div><b class="t1" id="rk1">0</b></div>
        <div class="qm-map" id="rmap">${D.map && D.map.img ? `<img src="${esc(D.map.img)}" alt="Карта" onerror="this.remove()">` : ''}${X.P.map(p => `<i class="qm-dot t${teamOf(p.team)}${p.player_slot === MZ.slot ? ' me' : ''}" data-ds="${p.player_slot}"><img src="${esc(hero(p.hero_id).i)}" alt="" loading="lazy"></i>`).join('')}<div id="rdx"></div></div>
        <div class="qm-ctl"><button class="btn s" id="rpl" type="button">▶ Играть</button><input type="range" id="rsl" min="0" max="${X.dur}" step="1" value="${MZ.t}" aria-label="Время матча"><div class="seg" id="rsp"><button data-sp="8" class="on">×8</button><button data-sp="20">×20</button><button data-sp="40">×40</button></div></div>
        <div class="qm-obj">${(X.mi.objectives || []).filter(o => o.destroyed_time_s).map(o => `<i class="t${teamOf(o.team) === 0 ? 1 : 0}" style="left:${(100 * o.destroyed_time_s / X.dur).toFixed(1)}%" title="${mmss(o.destroyed_time_s)} · пал объект ${TEAMN[teamOf(o.team)]}"></i>`).join('')}${(X.mi.mid_boss || []).map(o => `<i class="b" style="left:${(100 * o.destroyed_time_s / X.dur).toFixed(1)}%" title="${mmss(o.destroyed_time_s)} · Средний босс — ${TEAMN[teamOf(o.team_claimed)] || ''}"></i>`).join('')}</div></div>
      <div class="qm-rs t1">${X.P.filter(p => teamOf(p.team) === 1).map(mRow).join('')}</div></div>`;
}
const mRow = p => `<div class="qm-rr2${p.player_slot === MZ.slot ? ' on' : ''}" data-sl="${p.player_slot}">${face(p.hero_id, '', 's')}<span><b>${esc(pname(p))}</b><small id="rkd${p.player_slot}">0/0/0 · 0</small></span></div>`;
function mMapBind() {
  const X = MX, map = $('#rmap'), sl = $('#rsl'); if (!map || !sl) return;
  const R = (D.map && D.map.r) || 10752, dots = {}; $$('.qm-dot', map).forEach(d => dots[d.dataset.ds] = d);
  const deaths = []; X.P.forEach(p => (p.death_details || []).forEach(dd => deaths.push({t: dd.game_time_s, p, k: X.P.find(q => q.player_slot === dd.killer_player_slot), pos: dd.death_pos})));
  let sp = 8, last = 0;
  const at = (p, t, k) => { let v = 0; for (const s of p.stats || []) { if (s.time_stamp_s <= t) v = s[k] || 0; else break; } return v; };
  const paint = t => {
    MZ.t = t; $('#rtm').textContent = mmss(t);
    X.P.forEach(p => { const f = X.PT[p.player_slot], d = dots[p.player_slot]; if (!f || !d) return; const q = f(t), dead = !q.hp;
      d.style.transform = `translate(${(100 * (q.x + R) / (2 * R)).toFixed(2)}cqw, ${(100 * (1 - (q.y + R) / (2 * R))).toFixed(2)}cqh)`; d.classList.toggle('dead', dead); });
    const kd = p => { const k = deaths.filter(x => x.k === p && x.t <= t).length, dth = deaths.filter(x => x.p === p && x.t <= t).length; return [k, dth]; };
    let k0 = 0, k1 = 0; X.P.forEach(p => { const [k, dth] = kd(p); if (teamOf(p.team) === 0) k0 += k; else k1 += k; const el = $('#rkd' + p.player_slot); if (el) el.textContent = `${k}/${dth} · ${kfm(at(p, t, 'net_worth'))}`; });
    $('#rk0').textContent = k0; $('#rk1').textContent = k1;
    const lead = X.P.reduce((s, p) => s + (teamOf(p.team) === 0 ? 1 : -1) * at(p, t, 'net_worth'), 0), el = $('#rld'); if (el) el.textContent = Math.abs(lead) < 500 ? 'ровно по душам' : `${lead > 0 ? TEAMN[0] : TEAMN[1]} +${kfm(Math.abs(lead))}`;
    $('#rdx').innerHTML = deaths.filter(x => x.t <= t && x.t > t - 12 && x.pos).map(x => `<i class="qm-dd2" style="left:${(100 * (x.pos.x + R) / (2 * R)).toFixed(1)}%;top:${(100 * (1 - (x.pos.y + R) / (2 * R))).toFixed(1)}%" title="${esc(hero(x.p.hero_id).n)} убит ${x.k ? esc(hero(x.k.hero_id).n) : ''}">✕</i>`).join('');
    sl.value = t;
  };
  const loop = ts => { if (!MZ.play) return; const dt = last ? (ts - last) / 1000 : 0; last = ts; let t = MZ.t + dt * sp; if (t >= X.dur) { t = X.dur; MZ.play = 0; $('#rpl').textContent = '▶ Играть'; } paint(t); if (MZ.play) MZ.raf = requestAnimationFrame(loop); };
  $('#rpl').onclick = () => { MZ.play = !MZ.play; $('#rpl').textContent = MZ.play ? '❚❚ Пауза' : '▶ Играть'; if (MZ.play) { if (MZ.t >= X.dur) MZ.t = 0; last = 0; MZ.raf = requestAnimationFrame(loop); } };
  sl.oninput = () => { paint(+sl.value); };
  $$('#rsp button').forEach(b => b.onclick = () => { sp = +b.dataset.sp; $$('#rsp button').forEach(x => x.classList.toggle('on', x === b)); });
  paint(MZ.t || 0);
}
addEventListener('hashchange', () => { MZ.play = 0; cancelAnimationFrame(MZ.raf); });

// ==================== 01.11 · профиль: активность за 12 недель, винрейт по дням, с кем играешь ====================
const DAYN = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
function actBox(H) {
  const won = m => m.player_team === m.match_result, dk = t => { const d = new Date(t * 1000); return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); };
  const C = {}; H.forEach(m => { const k = dk(m.start_time), o = C[k] = C[k] || {g: 0, w: 0}; o.g++; if (won(m)) o.w++; });
  const today = new Date(); today.setHours(12, 0, 0, 0);
  // 12 колонок-недель с понедельника, последняя — текущая
  const end = new Date(today), dow = (today.getDay() + 6) % 7; end.setDate(end.getDate() + (6 - dow));
  const first = new Date(end); first.setDate(first.getDate() - 83);
  const cells = [], mx = Math.max(1, ...Object.values(C).map(o => o.g));
  let tg = 0, tw = 0, days = 0, best = null;
  for (let i = 0; i < 84; i++) { const d = new Date(first); d.setDate(first.getDate() + i); const k = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(), o = C[k] || {g: 0, w: 0}, fut = d > today;
    if (!fut && o.g) { tg += o.g; tw += o.w; days++; if (!best || o.g > best.o.g) best = {d, o}; }
    const lv = !o.g ? 0 : Math.min(4, 1 + Math.floor(3.99 * o.g / mx)), c = !o.g ? '' : o.w * 2 > o.g ? 'w' : o.w * 2 < o.g ? 'l' : 'e';
    cells.push(`<i class="lv${lv} ${c}${fut ? ' fu' : ''}" style="--i:${i}" title="${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')} · ${o.g ? `${o.g} ${pl(o.g, ['игра', 'игры', 'игр'])}, ${o.w} ${pl(o.w, ['победа', 'победы', 'побед'])}` : 'не играл'}"></i>`); }
  const W7 = []; for (let i = 6; i >= 0; i--) { const d = new Date(today); d.setDate(d.getDate() - i); const k = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); W7.push({d, o: C[k] || {g: 0, w: 0}}); }
  const m7 = Math.max(1, ...W7.map(x => Math.max(x.o.w, x.o.g - x.o.w))), g7 = W7.reduce((a, x) => a + x.o.g, 0), w7 = W7.reduce((a, x) => a + x.o.w, 0);
  return `<div class="q-box qa-box"><div class="q-bh"><b>Активность</b><small>12 недель · ${tg} ${pl(tg, ['игра', 'игры', 'игр'])} · ${days} ${pl(days, ['день', 'дня', 'дней'])} в игре${tg ? ` · ${Math.round(100 * tw / tg)}% побед` : ''}</small></div>
    <div class="qa-hm"><div class="qa-dn">${['Пн', '', 'Ср', '', 'Пт', '', 'Вс'].map(x => `<span>${x}</span>`).join('')}</div><div class="qa-g">${cells.join('')}</div></div>
    <div class="qa-lg"><span><i class="lv3 w"></i>больше побед</span><span><i class="lv3 l"></i>больше поражений</span><span><i class="lv1"></i><i class="lv2"></i><i class="lv4"></i>чем ярче — тем больше игр</span></div>
    ${best ? `<p class="qa-best">Самый плотный день — ${best.d.getDate()}.${String(best.d.getMonth() + 1).padStart(2, '0')}: ${best.o.g} ${pl(best.o.g, ['игра', 'игры', 'игр'])}, ${best.o.w} ${pl(best.o.w, ['победа', 'победы', 'побед'])}.</p>` : ''}
    <div class="q-bh qa-sep"><b>Последние 7 дней</b><small>${g7 ? `${w7}–${g7 - w7} · ${Math.round(100 * w7 / g7)}% побед` : 'не играл'}</small></div>
    ${!g7 ? `<p class="qa-best">За неделю ни одного матча${H[0] ? ` — последний был ${esc(ago(H[0].start_time))}` : ''}.</p>` : `<div class="qa-7">${W7.map(x => { const l = x.o.g - x.o.w; return `<div title="${x.o.g ? `${x.o.w} побед, ${l} поражений` : 'не играл'}"><div class="qa-up"><i style="--k:${(x.o.w / m7).toFixed(3)}"></i></div><div class="qa-dw"><i style="--k:${(l / m7).toFixed(3)}"></i></div><b class="${!x.o.g ? '' : x.o.w * 2 >= x.o.g ? 'win' : 'loss'}">${x.o.g ? Math.round(100 * x.o.w / x.o.g) + '%' : '—'}</b><span>${DAYN[x.d.getDay()]}</span></div>`; }).join('')}</div>`}
    <div class="q-bh qa-sep"><b>С кем играешь</b><div class="seg qa-ms"><button data-mw="m" class="on">Вместе</button><button data-mw="e">Против</button></div></div>
    <div id="qamate"><span class="sub">Считаю…</span></div></div>`;
}
async function mateLoad(n, id) {
  const el = () => $('#qamate'); let mode = 'm';
  const [M, E] = await Promise.all([api(`players/${id}/mate-stats?min_matches_played=3`).catch(() => []), api(`players/${id}/enemy-stats?min_matches_played=3`).catch(() => [])]);
  if (n !== VQ || !el()) return;
  const TM = (M || []).sort((a, b) => b.matches_played - a.matches_played).slice(0, 6), TE = (E || []).sort((a, b) => b.matches_played - a.matches_played).slice(0, 6);
  await steamNames([...TM.map(x => x.mate_id), ...TE.map(x => x.enemy_id)]); if (n !== VQ || !el()) return;
  const draw = () => { const L = mode === 'm' ? TM : TE, k = mode === 'm' ? 'mate_id' : 'enemy_id', mx = Math.max(1, ...L.map(x => x.matches_played));
    el().innerHTML = L.length ? L.map(x => { const sn = SN[x[k]] || {}, wr = 100 * x.wins / Math.max(1, x.matches_played), duo = mode === 'm' && x.matches_played >= 50;
      return `<a class="qa-mr" href="?id=${x[k]}#home">${sn.av ? `<img src="${esc(sn.av)}" alt="" loading="lazy">` : '<i class="qa-av"></i>'}<span><b>${esc(sn.n || 'Игрок ' + x[k])}${duo ? ' <em>ДУО</em>' : ''}</b><small>${nf(x.matches_played)} ${pl(x.matches_played, ['игра', 'игры', 'игр'])} ${mode === 'm' ? 'вместе' : 'против'}</small><i class="qa-mb" style="--k:${(x.matches_played / mx).toFixed(3)}"></i></span><b class="${wrC(wr, x.matches_played)}">${Math.round(wr)}%</b></a>`; }).join('')
      : `<div class="empty">${mode === 'm' ? 'Нет игроков, с кем было 3+ матча вместе.' : 'Нет игроков, против кого было 3+ матча.'}</div>`; };
  draw();
  $$('.qa-ms button').forEach(b => b.onclick = e => { e.stopPropagation(); mode = b.dataset.mw; $$('.qa-ms button').forEach(x => x.classList.toggle('on', x === b)); draw(); });
}

// лидеры: у тройки — матчи, винрейт и KDA за всё время (по героям игрока)
async function lbPod(n) {
  const els = $$('[data-pda]'), ids = els.map(e => e.dataset.pda).filter(Boolean); if (!ids.length) return;
  const L = await api('players/hero-stats?account_ids=' + ids.join(',')).catch(() => []); if (n !== VQ) return;
  const A = {}; (L || []).forEach(x => { const o = A[x.account_id] = A[x.account_id] || {m: 0, w: 0, k: 0, d: 0, a: 0}; o.m += x.matches_played; o.w += x.wins; o.k += x.kills; o.d += x.deaths; o.a += x.assists; });
  els.forEach(e => { const o = A[e.dataset.pda]; if (!o || !o.m) return; const wr = 100 * o.w / o.m;
    e.innerHTML = `<span><b data-cu="${o.m}">${nf(o.m)}</b><small>матчей</small></span><span><b class="${wrC(wr, o.m)}" data-cu="${wr.toFixed(1)}" data-cd="1" data-cs="%">${f1(wr)}%</b><small>побед</small></span><span><b>${f2((o.k + o.a) / Math.max(1, o.d))}</b><small>KDA</small></span>`; });
  mAnim($('.q-pod'));
}

// долгая загрузка: через 2,5 с объясняем, почему ждём (честно — это API, не сайт)
{ const V0 = V; let LDT = 0;
  V = function (h) { V0(h); clearTimeout(LDT);
    if (/class="load"/.test(h)) LDT = setTimeout(() => { const el = document.querySelector('#v .load'); if (el && !el.querySelector('.ld-why')) el.insertAdjacentHTML('beforeend', '<span class="ld-why">Ждём открытый API Deadlock: первый раз он собирает данные игрока из Steam — бывает 10–20 секунд. Дальше этот профиль будет открываться сразу, а свежее подтянется в фоне.</span>'); }, 2500); };
}
