// ==================== 02.11 · «Коуч» подробно, как у ResoAI — тем же шаблоном, без нейросети ====================
// Андрей: «у него прям дохуя написано и по делу — сделай так же». Добавлено: драки (счёт, кто умер первым, был ли рядом),
// сколько лежал мёртвым, что команда потеряла сразу после смерти, кто больше всего бил и чем (damage_matrix),
// падение здоровья перед смертью, удачный момент «ушёл живым на N%», предметы против топов на герое, «Что делать», «Почему это задание».

const CO_OBJN = id => id >= 1 && id <= 4 ? 'Стража' : id >= 5 && id <= 8 ? 'Ходока' : id >= 12 && id <= 15 ? 'Стража базы' : id === 10 || id === 11 ? 'Святилище' : id === 9 || id === 0 ? 'Покровителя' : 'объект';
const coS = n => `${n} ${pl(n, ['секунду', 'секунды', 'секунд'])}`;
const coAt = (PT, q, t) => PT[q.player_slot] ? PT[q.player_slot](Math.max(0, t)) : null;

// базы команд — где стояли игроки в начале матча
function coBases(X) {
  const B = {};
  for (const tm of [0, 1]) { const L = X.P.filter(q => teamOf(q.team) === tm).map(q => coAt(X.PT, q, 3)).filter(Boolean); if (L.length) B[tm] = {x: mAvg(L, a => a.x), y: mAvg(L, a => a.y)}; }
  return B;
}
function coZone(X, p, pos) {
  const B = coBases(X), me = B[teamOf(p.team)], th = B[1 - teamOf(p.team)];
  if (!me || !th || !pos) return '';
  const a = mDist(pos, me), b = mDist(pos, th), D = mDist(me, th) || 1;
  if (b < D * .22) return 'у их базы'; if (a < D * .22) return 'у своей базы';
  if (Math.abs(a - b) < D * .12) return 'в центре карты'; return b < a ? 'на их половине' : 'на своей половине';
}
// драки: смерти всех 12 игроков, близкие по времени и месту
function coFights(X) {
  if (X._cof) return X._cof;
  const A = []; X.P.forEach(q => (q.death_details || []).forEach(d => A.push({t: d.game_time_s, v: q, k: X.P.find(z => z.player_slot === d.killer_player_slot), pos: d.death_pos, dur: d.death_duration_s || 0})));
  A.sort((a, b) => a.t - b.t);
  const F = []; let cur = null;
  for (const d of A) {
    if (cur && d.t - cur.t1 <= 15 && d.pos && cur.c && mDist(d.pos, cur.c) < 4500) { cur.D.push(d); cur.t1 = d.t; const n = cur.D.length; cur.c = {x: cur.c.x + (d.pos.x - cur.c.x) / n, y: cur.c.y + (d.pos.y - cur.c.y) / n}; }
    else { cur = {t0: d.t, t1: d.t, c: d.pos, D: [d]}; F.push(cur); }
  }
  return (X._cof = F);
}
function coFightOf(X, p, f) {
  const my = teamOf(p.team), died = f.D.some(d => d.v === p), killed = f.D.some(d => d.k === p);
  let near = died || killed;
  if (!near && f.c) for (const t of [f.t0 - 3, f.t1]) { const a = coAt(X.PT, p, t); if (a && mDist(a, f.c) < 3200) { near = true; break; } }
  const lost = f.D.filter(d => teamOf(d.v.team) === my).length, got = f.D.length - lost;
  return {near, died, first: f.D[0].v === p, idx: f.D.findIndex(d => d.v === p), lost, got, n: f.D.length, t: f.t0, f};
}
// название источника урона по-человечески: способность героя, предмет, оружие
function coSrcName(q, raw) {
  const t = String(raw || ''), [n, kind] = srcNice(t);
  if (kind === 'w') return /crit/i.test(t) ? 'в голову' : 'оружие'; if (kind === 'm') return 'ближний бой'; if (kind === 'i') return n;
  const tail = t.toLowerCase().replace(/^(citadel_ability_|ability_|citadel_)/, '').replace(/_(amp|flatdamage)$/, ''), tl = tail.replace(/[^a-z]/g, ''), toks = tail.split('_').filter(x => x.length > 3);
  const ab = ((hero(q.hero_id) || {}).ab) || [];
  for (const a of ab) { const k = String(a.n || '').toLowerCase().replace(/[^a-z]/g, ''); if (k.length > 3 && tl.length > 3 && (tl.includes(k) || k.includes(tl))) return a.n; }
  for (const a of ab) { const w = String(a.n || '').toLowerCase().split(/[^a-z]+/).filter(x => x.length > 3); if (w.some(x => toks.includes(x))) return a.n; }
  return 'умения';
}
// кто бил игрока и чем: по данным игры (damage_matrix)
function coDmgIn(X, p) {
  const dm = X.mi.damage_matrix; if (!dm || !dm.damage_dealers || !dm.source_details) return null;
  const st = dm.source_details.stat_type || [], nm = dm.source_details.source_name || [], R = {}; let gun = 0, sp = 0;
  dm.damage_dealers.forEach(dd => { const q = X.P.find(z => z.player_slot === dd.dealer_player_slot); if (!q || teamOf(q.team) === teamOf(p.team)) return;
    (dd.damage_sources || []).forEach(s => { if (st[s.source_details_index] !== 0) return; const z = (s.damage_to_players || []).find(z => z.target_player_slot === p.player_slot); if (!z || !z.damage) return;
      const v = z.damage[z.damage.length - 1] || 0; if (!v) return; const kind = srcNice(nm[s.source_details_index])[1], n2 = coSrcName(q, nm[s.source_details_index]);
      const o = R[q.player_slot] = R[q.player_slot] || {q, v: 0, src: {}}; o.v += v; o.src[n2] = (o.src[n2] || 0) + v; if (kind === 'w' || kind === 'm') gun += v; else sp += v; }); });
  const L = Object.values(R).sort((a, b) => b.v - a.v); L.forEach(o => o.top = Object.entries(o.src).sort((a, b) => b[1] - a[1]).slice(0, 2).map(x => x[0]));
  return {L, tot: gun + sp, gun, sp};
}
// чем бил сам игрок: доля оружия и умений
function coDmgOut(X, p) {
  const dm = X.mi.damage_matrix; if (!dm || !dm.damage_dealers || !dm.source_details) return null;
  const st = dm.source_details.stat_type || [], nm = dm.source_details.source_name || [], foes = new Set(X.P.filter(q => teamOf(q.team) !== teamOf(p.team)).map(q => q.player_slot));
  const dd = dm.damage_dealers.find(x => x.dealer_player_slot === p.player_slot); if (!dd) return null; let gun = 0, sp = 0;
  dd.damage_sources.forEach(s => { if (st[s.source_details_index] !== 0) return; const v = (s.damage_to_players || []).filter(z => foes.has(z.target_player_slot)).reduce((a, z) => a + ((z.damage || [])[z.damage.length - 1] || 0), 0);
    const kind = srcNice(nm[s.source_details_index])[1]; if (kind === 'w' || kind === 'm') gun += v; else sp += v; });
  return gun + sp ? {gun, sp, gs: gun / (gun + sp)} : null;
}
// удачный момент: мало здоровья, враг рядом — и ушёл живым
function coEscape(X, p) {
  const P0 = X.PT[p.player_slot]; if (!P0) return null;
  const dts = (p.death_details || []).map(d => d.game_time_s), foes = X.P.filter(q => teamOf(q.team) !== teamOf(p.team)), R = [];
  for (let t = 150; t < X.dur - 20; t += 2) {
    const a = P0(t); if (a.hp == null || a.hp > 25 || a.hp <= 0) continue;
    if (dts.some(x => x >= t - 2 && x <= t + 20)) continue;
    const nf0 = foes.map(q => [q, coAt(X.PT, q, t)]).filter(([, b]) => b && mDist(a, b) < 2000);
    if (!nf0.length) continue;
    if (R.length && t - R[R.length - 1].t < 40) { if (a.hp < R[R.length - 1].hp) R[R.length - 1] = {t, hp: a.hp, q: nf0[0][0], n: nf0.length}; continue; }
    R.push({t, hp: a.hp, q: nf0[0][0], n: nf0.length});
  }
  return R.sort((a, b) => b.n - a.n || a.hp - b.hp)[0] || null;
}
// линия: души, уровень, крипы и смерти к 10-й минуте
function coLane(X, p, opp) {
  const at = (q, k) => mAt(q, 600, k), cs = (q) => { const pc = at(q, 'possible_creeps'); return pc ? at(q, 'creep_kills') / pc : null; };
  return {nw: at(p, 'net_worth'), onw: opp ? at(opp, 'net_worth') : null, lv: at(p, 'level'), olv: opp ? at(opp, 'level') : null, cs: cs(p), d: (p.death_details || []).filter(d => d.game_time_s < 600).length,
    nw20: mAt(p, 1200, 'net_worth'), nw20pl: X.dur > 1300 ? mPlace(X.P.filter(q => teamOf(q.team) === teamOf(p.team)), q => mAt(q, 1200, 'net_worth'), p) : null};
}

// отрезок, где игрок дольше всего лежал мёртвым: 3+ смерти подряд в пределах 10 минут
function coDeadRun(p) {
  const D = (p.death_details || []).map(d => ({t: d.game_time_s, u: d.death_duration_s || 0})).sort((a, b) => a.t - b.t); let best = null;
  for (let i = 0; i < D.length; i++) for (let j = i + 2; j < D.length && D[j].t - D[i].t <= 600; j++) {
    const sum = D.slice(i, j + 1).reduce((a, d) => a + d.u, 0), end = D[j].t + D[j].u;
    if (sum >= 150 && (!best || sum > best.sum)) best = {t0: D[i].t, t1: end, sum, n: j - i + 1};
  }
  return best;
}
// подробности по каждой смерти
function coDeathCtx(X, p, F) {
  const FT = coFights(X), my = teamOf(p.team);
  return F.DD.map(d => {
    const f = FT.find(f => f.D.some(z => z.v === p && z.t === d.t)) || null, raw = (p.death_details || []).find(z => z.game_time_s === d.t) || {};
    const fo = f ? coFightOf(X, p, f) : null;
    const objs = (X.mi.objectives || []).filter(o => o.destroyed_time_s > d.t && o.destroyed_time_s <= d.t + 90 && teamOf(o.team) === my);
    const hp3 = coAt(X.PT, p, d.t - 3), zone = coZone(X, p, d.pos);
    return {...d, fo, dur: raw.death_duration_s || 0, objs, hp3: hp3 ? hp3.hp : null, zone};
  });
}
function coMoText(c) {
  const L = [], kn = c.k ? coHn(c.k.hero_id) : null;
  let s = `${c.zone ? c.zone[0].toUpperCase() + c.zone.slice(1) : 'Смерть'}.${kn ? ` Убийца — ${kn}.` : ''}`;
  if (c.fo && c.fo.n >= 3) s += c.fo.first ? ` Ты умер первым из ${c.fo.n} погибших.` : ` В драке погибли ${c.fo.n}.`;
  if (c.fo && c.fo.n >= 3) s += ` Драка ${c.fo.got > c.fo.lost ? 'выиграна' : c.fo.got < c.fo.lost ? 'проиграна' : 'вничью'} ${c.fo.got}:${c.fo.lost}.`;
  else if (c.mates === 0) s += ' Своих рядом не было.';
  L.push(s);
  if (c.hp != null && c.hp3 != null && c.hp > c.hp3 + 25) L.push(`Здоровье упало с ${c.hp}% до ${c.hp3}% за 5 секунд.`);
  else if (c.hp != null && c.hp < 45) L.push(`За 8 секунд до смерти у тебя было ${c.hp}% здоровья.`);
  if (c.ttk != null && c.ttk > 15 && c.mates === 0) L.push(`Бой шёл ${coS(Math.round(c.ttk))}.`);
  else if (c.ttk != null && c.ttk < 3) L.push(`Убили за ${f1(c.ttk)} с — без шанса ответить.`);
  if (c.dur >= 25) L.push(`${coS(c.dur)} мёртвым.`);
  if (c.objs.length) { const o = c.objs[0], dt = o.destroyed_time_s - c.t; L.push(`Через ${dt < 60 ? coS(dt) : 'минуту'} команда потеряла ${CO_OBJN(o.team_objective_id)}.`); }
  return L.join(' ');
}
// что из ошибки следует для героя этого игрока
function coWhy(F, main, out) {
  if (!main) return '';
  const hn = coHn(F.p.hero_id), g = out ? Math.round(100 * out.gs) : null;
  const prof = g == null ? '' : g >= 60 ? `${g}% урона ты нанёс оружием — твоя сила в долгой стрельбе, а не в том, чтобы влететь первым.` : g <= 40 ? `${100 - g}% урона ты нанёс умениями — они бьют с дистанции, стоять впереди не обязательно.` : '';
  const M = {alone: `${hn} не обязан ходить один. ${prof} Одиночный бой против героя, который пришёл за тобой специально, ты проигрываешь чаще, чем выигрываешь: он выбрал момент, а ты нет. Твоё место — там, где до тебя может дойти хотя бы один союзник за пару секунд.`,
    fast: `Смерть за 1–2 секунды значит, что ты стоял там, куда враг уже целился. ${prof} Держи укрытие между собой и местом, откуда может прийти враг, и смотри на миникарту чаще, когда кого-то не видно.`,
    low: `Каждый раз, когда ты остаёшься с половиной здоровья, ты играешь в лотерею. ${prof} Отойти на 15 секунд дешевле, чем лежать мёртвым и отдавать души.`,
    killer: `Один и тот же враг находит тебя раз за разом — значит, он знает, где ты ходишь и когда ты один. ${prof} Пока не видно, где он, считай, что он рядом.`,
    lane: `Проигранная линия тянется всю игру: соперник раньше покупает предметы и раньше приходит драться. ${prof} На линии главное — не умирать и забирать свои души, а не размен.`,
    farm: `Души — это предметы, предметы — это сила в драке. ${prof} Каждую минуту без фарма ты отдаёшь сопернику.`,
    kp: `Драки решают матч, а тебя в них нет. ${prof} Даже если ты фармишь, к большой драке нужно успеть.`,
    dmg: `В драке ты наносишь мало урона. ${prof} Смотри, по кому стреляешь: ближняя цель, по которой попадаешь, лучше дальней.`,
    deaths: `Каждая смерть — это души сопернику и время без тебя на карте. ${prof} Думай об отходе до того, как он понадобится.`};
  return M[main.k] || '';
}
const CO_TODO = {alone: 'Перед тем как идти фармить или догонять, посмотри на миникарту: где ближайший свой. Если дальше пары секунд бега — не иди. После игры глянь «Моменты» в разборе: был ли кто-то рядом.',
  fast: 'Перед каждой дракой найди на миникарте всех пятерых врагов. Кого не видно — значит, он идёт к тебе: стой за укрытием, пока не покажется.',
  low: 'Следи за полоской здоровья. Упала ниже половины — разворачивайся и лечись, даже если кажется, что добьёшь.',
  killer: 'В начале каждой драки найди на экране героя, который убивает тебя чаще всех. Пока он не потратил главную кнопку — держи расстояние.',
  lane: 'До 10-й минуты: добивай своих крипов, не разменивайся и не умирай. Соперник ушёл с линии — дави башню.',
  farm: 'Между драками всегда фарми: ближайшая пустая линия, лагерь, ящики по пути. На базу — только когда нужно лечиться или покупать.',
  kp: 'Видишь на миникарте, что трое своих собрались, — иди к ним, даже если не дофармил.',
  dmg: 'В драке не прекращай стрелять. Выбирай цель, по которой попадаешь, а не самую вкусную.',
  deaths: 'Перед каждой дракой реши, куда побежишь, если пойдёт плохо. Не догоняй на чужой половине.'};

function coSide(X, p, F, IN, FS, LN) {
  const side = [];
  if (IN && IN.tot) {
    const top = IN.L.slice(0, 4), mx = Math.max(1, ...top.map(o => o.v)), g = Math.round(100 * IN.gun / IN.tot);
    side.push(`<div class="co-box co2-sb"><span class="co-k">Кто тебя бил · ${kfm(IN.tot)} урона</span>
      ${top.map(o => `<div class="co2-dr">${face(o.q.hero_id, '', 's')}<span><b>${coHn(o.q.hero_id)}</b><small>${esc(o.top.join(', '))}</small></span><i><i style="width:${(100 * o.v / mx).toFixed(0)}%"></i></i><em>${Math.round(100 * o.v / IN.tot)}%</em></div>`).join('')}
      <div class="co2-split"><i style="width:${g}%"></i></div><div class="co2-sl"><span>оружие ${g}%</span><span>умения и предметы ${100 - g}%</span></div></div>`);
  }
  if (FS.length) {
    const near = FS.filter(f => f.near), won = near.filter(f => f.got > f.lost).length;
    side.push(`<div class="co-box co2-sb"><span class="co-k">Драки · был рядом в ${near.length} из ${FS.length}</span>
      <div class="co2-fs">${FS.map(f => `<span class="${f.near ? (f.got > f.lost ? 'w' : f.got < f.lost ? 'l' : 'd') : 'off'}" title="${coT(f.t)} · ${f.got}:${f.lost}${f.died ? ' · ты погиб' : ''}"><time>${coT(f.t)}</time><b>${f.got}:${f.lost}</b>${f.died ? `<i>${f.first ? '1-й' : '✕'}</i>` : ''}</span>`).join('')}</div>
      <small class="co2-lg">зелёная — выиграли, красная — проиграли, бледная — тебя не было рядом; ✕ — ты погиб, «1-й» — погиб первым. Выиграли ${won} из ${near.length}, где ты был.</small></div>`);
  }
  if (F.opp && LN.onw != null) {
    side.push(`<div class="co-box co2-sb"><span class="co-k">Линия к 10:00 · против ${coHn(F.opp.hero_id)}</span>
      <div class="co2-ln"><span><small>души</small><b>${nf(LN.nw)}</b><em>${nf(LN.onw)}</em></span><span><small>уровень</small><b>${LN.lv || '—'}</b><em>${LN.olv || '—'}</em></span><span><small>крипы</small><b>${LN.cs != null ? Math.round(100 * LN.cs) + '%' : '—'}</b><em>&nbsp;</em></span><span><small>смерти</small><b>${LN.d}</b><em>&nbsp;</em></span></div>
      <small class="co2-lg">крупно — ты, мелко — соперник</small></div>`);
  }
  return side.join('');
}

function mCo() {
  const X = MX, p = mSel(), F = coFacts(p), PR = coProblems(F), me = X.meP && p === X.meP;
  const alt = Math.min(PR.length - 1, Math.max(0, (MZ.coAlt || 0) % Math.max(1, PR.length))), main = PR[0], tk = PR[alt];
  const g10 = Math.max(1, Math.min(10, Math.round(F.score / 10)));
  const C = coDeathCtx(X, p, F), IN = coDmgIn(X, p), OUT = coDmgOut(X, p), FS0 = coFights(X).filter(f => f.D.length >= 3).map(f => coFightOf(X, p, f)), LN = coLane(X, p, F.opp), ESC = coEscape(X, p);
  const hn = coHn(p.hero_id), won = F.won;
  // 1. картина игры
  const P1 = [`${won ? 'Победа' : 'Поражение'}, ${g10}/10.`];
  if (F.opp && LN.onw != null) { const d = LN.nw - LN.onw, o = coHn(F.opp.hero_id);
    P1.push(`${d >= 500 ? `Линию против ${o} ты выиграл` : d <= -500 ? `Линию против ${o} ты проиграл` : `Линию против ${o} ты отстоял почти в ноль`}: ${nf(LN.nw)} душ к 10-й минуте против ${nf(LN.onw)}${LN.lv && LN.olv ? `, ${LN.lv} уровень против ${LN.olv}` : ''}, ${LN.d ? `${LN.d} ${pl(LN.d, ['смерть', 'смерти', 'смертей'])} на линии` : 'ни одной смерти'}.`); }
  if (F.dmg9T >= 1000 && F.dmg9 < F.dmg9T * .5) P1.push(`Но по героям на линии ты почти не стрелял: ${nf(F.dmg9)} урона до 9-й минуты при ${nf(F.dmg9T)} в среднем у команды.`);
  if (LN.nw20pl) P1.push(`К 20-й минуте у тебя ${nf(LN.nw20)} душ — ${LN.nw20pl}-й результат в команде.`);
  if (F.M.cs != null && F.M.cs >= F.csT + .06) P1.push(`Крипов добил ${Math.round(100 * F.M.cs)}% из возможных — лучше, чем в среднем у команды (${Math.round(100 * F.csT)}%).`);
  P1.push(F.M.spm >= F.spmT && !(main && main.k === 'farm') ? 'Фарм не проблема.' : `Душ в минуту — ${nf(F.M.spm)}, ${F.spmPl}-й из 12.`);
  if (main) P1.push(CO_HEAD[main.k](main));
  // 2. как это происходит + кто бил
  const P2 = main ? [main.t] : ['Явной ошибки в цифрах нет: смерти, души, урон и драки в норме для этого матча.'];
  if (IN && IN.L.length && IN.tot > 3000) { const a = IN.L[0], b = IN.L[1], g = Math.round(100 * IN.gun / IN.tot);
    P2.push(`Больше всего урона по тебе — от ${coHn(a.q.hero_id)}: ${nf(a.v)}${a.top.length ? `, в основном ${esc(a.top.join(' и '))}` : ''}${b ? `; дальше ${coHn(b.q.hero_id)} — ${nf(b.v)}` : ''}. ${g >= 60 ? `${g}% урона по тебе — оружие.` : g <= 40 ? `${100 - g}% урона по тебе — умения и предметы.` : ''}`); }
  // 3. моменты
  const moments = C.slice().sort((a, b) => ((b.fo && b.fo.first && b.fo.n >= 3) * 2 + (b.mates === 0) + (b.objs.length > 0) + (b.dur >= 30)) - ((a.fo && a.fo.first && a.fo.n >= 3) * 2 + (a.mates === 0) + (a.objs.length > 0) + (a.dur >= 30)) || a.t - b.t).slice(0, 5).sort((a, b) => a.t - b.t);
  // 4. честно о картине
  const near = FS0.filter(f => f.near), lostAlive = near.filter(f => !f.died && f.lost > f.got), fair = [];
  if (FS0.length >= 3) fair.push(near.length >= FS0.length * .7 ? `В ${near.length} из ${FS0.length} драк ты был рядом — это хорошо, не теряй это.` : `Ты был рядом только в ${near.length} из ${FS0.length} драк.`);
  if (lostAlive.length) fair.push(`Часть драк, где ты выжил (${lostAlive.slice(0, 2).map(f => coT(f.t)).join(', ')}), команда тоже проиграла, так что дело не только в тебе.`);
  const top = F.T.filter(q => q !== p && ((X.A.get(q) || {}).score || 0) >= 70).sort((a, b) => (X.A.get(b) || {}).score - (X.A.get(a) || {}).score).slice(0, 2);
  if (won && top.length && F.score < 70) fair.push(`Лучшая игра в команде — у ${top.map(q => `${coHn(q.hero_id)} (${q.kills}/${q.deaths}/${q.assists})`).join(' и ')}: победа во многом на ${top.length > 1 ? 'них' : 'этом игроке'}.`);
  if (!won && F.score >= 58) fair.push('Команда проиграла, но твои цифры выше средних в этом матче.');
  if (ESC) fair.push(`А на ${coT(ESC.t)} ты сделал ровно то, что нужно: у тебя оставалось ${ESC.hp}% здоровья, рядом ${ESC.n > 1 ? `${ESC.n} врага, в том числе ${coHn(ESC.q.hero_id)}` : coHn(ESC.q.hero_id)}, — и ты ушёл живым. Увидел угрозу — вышел. Это сохрани.`);
  else { const good = coGood(F).filter(x => !(F.M.cs != null && F.M.cs >= F.csT + .06 && /крипы/.test(x))); if (good.length) fair.push(`Это сохрани: ${good.join('; ')}.`); }
  // 5. план
  const plan = tk ? tk.plan.slice(0, 3) : [];
  if (IN && IN.L[0] && typeof TIPS !== 'undefined' && TIPS[IN.L[0].q.hero_id] && !(tk && tk.k === 'killer')) plan[2] = `Против ${coHn(IN.L[0].q.hero_id)}, который бил тебя больше всех: ${TIPS[IN.L[0].q.hero_id][2]}`;
  const TK = coTask(), myTask = TK && TK.aid === p.account_id ? TK : null, tr = myTask ? coTaskTrack(myTask, F) : null;
  const whyTask = tk ? (tk.k === main.k ? `Это главная ошибка этого матча. ${tk.k === 'alone' ? `${F.alone} из ${F.n} смертей — без своих рядом.` : tk.k === 'killer' ? `${(F.killers[0] || {}).c} из ${F.n} смертей — от одного героя.` : tk.k === 'low' ? `${F.low} из ${F.n} смертей начались с половиной здоровья.` : tk.k === 'fast' ? `${F.fast} из ${F.n} раз тебя убили быстрее 3 секунд.` : ''} Исправишь её — сразу меньше смертей и больше времени на карте.` : 'Другой вариант задания — тоже из цифр этого матча.') : '';
  return `<div class="co co2">
    <div class="co-hd"><div class="co-g" style="--g:${g10}"><b>${g10}</b><small>из 10</small></div>
      <div class="co-ht"><small>КОУЧ RESTLESS · РАЗБОР МАТЧА</small><h3>Главное в этой игре</h3><p class="co2-who">${hn} · ${p.kills}/${p.deaths}/${p.assists} · ${coT(X.dur)} · ${won ? 'победа' : 'поражение'}</p></div></div>
    <div class="co2-g"><article class="co2-txt">
      <p>${P1.join(' ')}</p>
      <p>${P2.join(' ')}</p>
      ${moments.length ? `<ul class="co2-mo">${moments.map(c => `<li><time>${coT(c.t)}</time><span>${coMoText(c)}</span></li>`).join('')}</ul>` : ''}
      ${(() => { const R = coDeadRun(p); if (!R) return ''; const span = R.t1 - R.t0, pc = Math.round(100 * R.sum / span);
        return `<p>Посчитай время: с ${coT(R.t0)} по ${coT(R.t1)} ты пролежал мёртвым <b>${coS(R.sum)}</b> — ${pc >= 45 ? 'почти половину' : pc >= 30 ? 'треть' : `${pc}%`} этого отрезка, ${R.n} ${pl(R.n, ['смерть', 'смерти', 'смертей'])} подряд. Каждая такая минута — минус души и минус ты в драке.</p>`; })()}
      ${main ? `<p>${coWhy(F, main, OUT)}</p>` : ''}
      <p id="colate" class="co2-late">Сравниваю твои предметы с топами на ${hn}…</p>
      ${fair.length ? `<h4>Честно о картине</h4><p>${fair.join(' ')}</p>` : ''}
      ${plan.length ? `<h4>План на 3 игры</h4><ul class="co2-pl">${plan.map(x => `<li>${x}</li>`).join('')}<li id="coplit" hidden></li></ul>` : ''}
      ${tk ? `<div class="co-task co2-task"><div class="co2-tt"><span class="co-k">Задание на следующие 3 игры</span><b>${esc(tk.task.n)}</b>
        <div class="co2-td"><span class="co-k">Что делать</span><p>${CO_TODO[tk.k] || ''}</p></div>
        <div class="co2-tr"><span><em>Правило</em>${esc(tk.task.rule)}</span><span><em>Поймёшь, что получилось, когда</em>${esc(tk.task.done)}</span></div>
        <div class="co-gs">${(tr && myTask.k === tk.k ? tr : [null, null, null]).map((x, i) => `<span class="${x == null ? '' : x ? 'ok' : 'no'}">игра ${i + 1}${x == null ? '' : x ? ' ✓' : ' ✗'}</span>`).join('')}</div>
        <details class="co2-why"><summary>Почему это задание</summary><p>${whyTask}</p></details>
        <div class="co2-tb">${me ? (myTask && myTask.k === tk.k ? `<button class="co-tb on" data-cotask="off">Задание взято ✓</button>` : `<button class="co-tb" data-cotask="${esc(tk.k)}">Беру это задание</button>`) : ''}${PR.length > 1 ? `<button class="co-tb alt" data-coalt="1">Другие варианты</button>` : ''}</div>
        <small class="co2-nb">${me ? 'Проверю сам по трём следующим матчам — итог увидишь в профиле, в карточке «Коуч Restless».' : 'Задание берёт сам игрок — в разборе своего матча.'}</small></div></div>` : ''}
      ${myTask && tr && (!tk || myTask.k !== tk.k) ? `<div class="co-box co-trk"><span class="co-k">Твоё задание: ${esc(myTask.n)}</span><div class="co-gs">${tr.map((x, i) => `<span class="${x == null ? '' : x ? 'ok' : 'no'}">игра ${i + 1}${x == null ? '' : x ? ' ✓' : ' ✗'}</span>`).join('')}</div></div>` : ''}
    </article><aside class="co2-side">${coSide(X, p, F, IN, FS0, LN)}</aside></div>
    <p class="co-nt">Разбор собран по данным матча: позиции всех 12 игроков по секундам, здоровье, урон и кто чем бил, души по минутам, драки и объекты; предметы — против топов на этом герое за 30 дней. Без нейросети: бесплатно и сразу.</p>
  </div>`;
}
// предметы против топов на этом герое (как «эталон» у ResoAI): подгружается после разбора
function coLate(p) {
  const X = MX, k = p.hero_id;
  const go = IS => {
    if (MX !== X || mSel() !== p || MZ.tab !== 'co') return;
    const el = $('#colate'), pli = $('#coplit'); if (!el) return;
    const seen = new Set(), late = [], early = [];
    for (const it of p.items || []) { const I = item(it.item_id), a = IS[it.item_id]; if (!I || seen.has(it.item_id) || !a || a.matches < 30 || (I.t || 0) < 3 || it.sold_time_s) continue; seen.add(it.item_id);
      const d = it.game_time_s - a.avg_buy_time_s; if (d > 150) late.push([I, it.game_time_s, a.avg_buy_time_s, d]); else if (d < -120) early.push([I, it.game_time_s, a.avg_buy_time_s, d]); }
    late.sort((a, b) => b[3] - a[3]); early.sort((a, b) => a[3] - b[3]);
    if (late.length) {
      const [I, t, a] = late[0];
      const dw = it2 => (p.death_details || []).map(d => d.game_time_s).filter(x => x > it2[2] && x < it2[1]), d0 = dw(late[0]), d1 = late[1] ? dw(late[1]) : [];
      const dj = L => L.slice(0, 3).map(coT).join(L.length === 2 ? ' и ' : ', '), why = d0.length ? ` Смерти на ${dj(d0)} случились ещё без ${esc(I.n)}.` : d1.length ? ` Смерти на ${dj(d1)} случились ещё без ${esc(late[1][0].n)}.` : '';
      el.innerHTML = `Вторая вещь — предметы. <b>${esc(I.n)}</b> у топов на ${coHn(k)} в среднем выходит на <b>${coT(a)}</b>, у тебя — на <b class="loss">${coT(t)}</b>.${late[1] ? ` ${esc(late[1][0].n)} — тоже позже: ${coT(late[1][1])} против ${coT(late[1][2])}.` : ''}${why} ${early.length ? `Зато ${esc(early[0][0].n)} ты взял раньше топов (${coT(early[0][1])}).` : ''} Сравнение — с игроками высокого ранга за последние 30 дней.`;
      if (pli) { pli.hidden = false; pli.innerHTML = `${esc(I.n)} бери раньше: у топов на этом герое он выходит к ${coT(a)}. Посмотри порядок их покупок на странице героя.`; }
    } else el.innerHTML = early.length ? `По предметам ты не опаздываешь против топов на ${coHn(k)}, а ${esc(early[0][0].n)} взял даже раньше (${coT(early[0][1])} против ${coT(early[0][2])}).` : `По предметам ты идёшь в темпе топов на ${coHn(k)} — тут проблем нет.`;
  };
  if (X.IS[k]) return go(X.IS[k]);
  api(`analytics/item-stats?hero_id=${k}&min_average_badge=100&min_unix_timestamp=${now() - 30 * 86400 - now() % 3600}`).then(L => { const o = {}; (L || []).forEach(x => o[x.item_id] = x); X.IS[k] = o; go(o); })
    .catch(() => { const el = $('#colate'); if (el) el.remove(); });
}
{
  const MB1 = mBody;
  mBody = function () {
    MB1();
    if (MZ.tab !== 'co') return;
    const el = $('#qmb'); if (!el) return;
    const on0 = el.onclick;
    el.onclick = e => { const a = e.target.closest('[data-coalt]'); if (a) { e.stopPropagation(); MZ.coAlt = (MZ.coAlt || 0) + 1; mBody(); return; } on0 && on0(e); };
    coLate(mSel());
  };
  // другой игрок или другой матч — задание снова с главной ошибки
  const VM1 = viewMatch2;
  viewMatch2 = async function (mid, tab) { if (+mid !== MZ.mid) MZ.coAlt = 0; return VM1(mid, tab); };
}
