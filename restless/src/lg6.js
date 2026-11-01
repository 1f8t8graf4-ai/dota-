// ==================== 01.11 (ночь) · «Коуч» в разборе матча: как ResoAI, но без нейросети ====================
// Андрей: «не хочу, чтобы тикеты жрало». Коуч считает всё сам по цифрам матча (смерти, линия, души, драки, урон),
// выбирает одну главную ошибку, показывает доказательства, план на 3 игры и задание — бесплатно и сразу.
// Нейросеть не используется и так не называется (правило: никаких фальшивых «проверок ИИ»).

MTABS.unshift(['co', 'Коуч']);
const CO_TASK_K = 'rl-task';
const coTask = () => { try { return JSON.parse(localStorage.getItem(CO_TASK_K) || 'null'); } catch (e) { return null; } };
const coTaskSave = t => { try { t ? localStorage.setItem(CO_TASK_K, JSON.stringify(t)) : localStorage.removeItem(CO_TASK_K); } catch (e) {} };
const coT = s => mmss(Math.max(0, s || 0));
const coHn = id => esc(hero(id).n);

// все факты об игроке в этом матче — одним объектом (из них и разбор, и проверка задания)
function coFacts(p) {
  const X = MX, M = X.M.get(p), T = X.P.filter(q => teamOf(q.team) === teamOf(p.team)), E = X.P.filter(q => teamOf(q.team) !== teamOf(p.team));
  const DD = typeof mDeaths === 'function' ? mDeaths(X.mi, p, X.PT) : [];
  DD.forEach(d => { if (d.ttk != null && d.ttk < 0) { d.ttk = null; d.why = d.why.filter(w => !/врасплох/.test(w)); } }); // в данных бывает «−1 с»
  const n = DD.length, alone = DD.filter(d => d.mates === 0).length, fast = DD.filter(d => d.ttk != null && d.ttk < 3).length, low = DD.filter(d => d.hp != null && d.hp < 45).length, lane = DD.filter(d => d.t < 600).length;
  const K = {}; DD.forEach(d => { if (d.k && teamOf(d.k.team) !== teamOf(p.team)) K[d.k.hero_id] = (K[d.k.hero_id] || 0) + 1; });
  const killers = Object.entries(K).map(([h, c]) => ({h: +h, c})).sort((a, b) => b.c - a.c);
  const opp = mOpp(p), lane10 = opp ? mAt(p, 600) - mAt(opp, 600) : null;
  const tAvg = f => mAvg(T, q => f(X.M.get(q))), lAvg = f => mAvg(X.P, q => f(X.M.get(q)));
  const tk = T.reduce((a, q) => a + (q.kills || 0), 0);
  return {p, M, DD, n, alone, fast, low, lane, killers, opp, lane10, tk, won: teamOf(p.team) === X.win,
    spmT: tAvg(m => m.spm), dpmL: lAvg(m => m.dpm), dAvg: mAvg(X.P, q => q.deaths || 0), opmL: lAvg(m => m.opm), score: (X.A.get(p) || {}).score || 50,
    spmPl: mPlace(X.P, q => X.M.get(q).spm, p), big: DD.filter(d => d.foes >= 3 && d.mates >= 2).length,
    long: DD.filter(d => d.mates === 0 && d.ttk > 12).map(d => d.ttk), dmg9: mAt(p, 540, 'player_damage'), dmg9T: mAvg(T, q => mAt(q, 540, 'player_damage')),
    csT: mAvg(T, q => X.M.get(q).cs || 0), T};
}

// возможные главные ошибки: насколько сильно (0…1+), что сказать, что делать, задание и как его проверить
function coProblems(F) {
  const P = [], {p, M, n} = F, k0 = F.killers[0], hn = coHn(p.hero_id);
  const LG = F.long.length >= Math.max(2, F.alone * .6), lmin = Math.round(Math.min(...F.long, 99)), lmax = Math.round(Math.max(...F.long, 0));
  if (n >= 3 && F.alone >= Math.max(2, n / 2)) P.push({k: 'alone', w: .55 + .35 * F.alone / n,
    t: `Умираешь один: <b>${F.alone} из ${n}</b> смертей — рядом не было ни одного союзника.${LG ? ` И это не «поймали за секунду»: бои шли <b>${lmin}–${lmax} секунд</b> — ты видел, что дерёшься один, и не уходил.` : ''}`,
    plan: ['Перед тем как идти по карте, глянь на миникарту: где свои, где враги, кого не видно.', 'В середине игры ходи за союзником или в паре — один вне линии ты лёгкая цель.',
      LG ? 'Дерёшься один дольше 10 секунд и бой не кончается — уходи. Затяжная дуэль в одиночку — лотерея, и чаще проигрышная.' : 'Фармишь один далеко от своих — уходи, как только на миникарте пропали 2+ врага.'],
    task: LG ? {n: 'Короткие бои в одиночку', rule: 'Дерусь один дольше 10 секунд — отхожу к своим', done: 'за игру не больше одной смерти, когда рядом нет своих'}
      : {n: 'Не умирать в одиночку', rule: 'Ухожу с линии, только если рядом свой или видно, где враги', done: 'за игру не больше одной смерти, когда рядом нет своих'}, chk: G => G.alone <= 1});
  if (n >= 3 && F.fast >= Math.max(2, n / 3)) P.push({k: 'fast', w: .5 + .35 * F.fast / n,
    t: `Тебя ловят врасплох: <b>${F.fast} из ${n}</b> раз убили быстрее чем за 3 секунды — без шанса ответить.`,
    plan: ['Каждые несколько секунд — взгляд на миникарту. Пропали враги с карты — значит, идут к кому-то, возможно к тебе.', 'Не стой в открытую: двигайся от укрытия к укрытию, особенно когда у врага есть контроль.', 'Держи кнопку побега (рывок, предмет на мобильность) на случай, если прыгнули.'],
    task: {n: 'Без смертей «врасплох»', rule: 'Пропали двое врагов с миникарты — отхожу к своим', done: 'не больше одной смерти быстрее 3 секунд'}, chk: G => G.fast <= 1});
  if (n >= 3 && F.low >= Math.max(2, n / 3)) P.push({k: 'low', w: .45 + .35 * F.low / n,
    t: `Идёшь дальше без здоровья: <b>${F.low} из ${n}</b> раз за 8 секунд до смерти у тебя было меньше половины HP.`,
    plan: ['Меньше половины здоровья — отходи подлечиться, а не догоняй. Смерть стоит дороже, чем пара секунд.', 'Возьми предмет на выживание пораньше, если тебя часто добивают.', 'Перед дракой проверь своё здоровье и кнопки — не начинай её на половине HP.'],
    task: {n: 'Отходить на половине HP', rule: 'Меньше половины здоровья — отхожу лечиться', done: 'не больше одной смерти, начатой с половиной здоровья'}, chk: G => G.low <= 1});
  if (n >= 4 && k0 && k0.c >= Math.max(3, Math.ceil(n * .4))) P.push({k: 'killer', h: k0.h, w: .5 + .4 * k0.c / n,
    t: `Тебя раз за разом убивает <b>${coHn(k0.h)}</b>: ${k0.c} из ${n} смертей.${TIPS && TIPS[k0.h] ? ` Совет против него: ${TIPS[k0.h][2]}` : ''}`,
    plan: [`Перед каждой дракой найди ${coHn(k0.h)} на карте — не видно его, значит, он ждёт тебя.`, `Держись дальше от ${coHn(k0.h)}, пока он не потратил главную кнопку.`, 'Купи предмет против его урона, если он уже второй раз тебя убивает.'],
    task: {n: `Не умирать от ${hero(k0.h).n}`, rule: `Пока ${hero(k0.h).n} не потратил главную кнопку — держусь от него на расстоянии`, done: 'он убивает тебя не больше одного раза за игру'}, chk: G => (G.killers.find(x => x.h === k0.h) || {c: 0}).c <= 1});
  if (F.opp && F.lane10 <= -1500) P.push({k: 'lane', w: .4 + Math.min(.5, -F.lane10 / 8000),
    t: `Линию проиграл: к 10-й минуте <b class="loss">−${nf(-F.lane10)}</b> душ против ${coHn(F.opp.hero_id)}${F.lane ? `, и ${F.lane} ${pl(F.lane, ['смерть', 'смерти', 'смертей'])} на линии` : ''}.`,
    plan: [`На линии против ${coHn(F.opp.hero_id)} не размениваемся впустую — добивай крипов, а не героя.`, 'Ушёл на линии в минус — не лезь, играй от башни и забирай свои души.', TIPS && TIPS[F.opp.hero_id] ? `Против ${coHn(F.opp.hero_id)}: ${TIPS[F.opp.hero_id][2]}` : 'Следи за кнопками соперника: потратил — твоя очередь давить.'],
    task: {n: 'Линия в ноль к 10-й', rule: 'До 10-й минуты не умираю и добиваю каждого своего крипа', done: 'к 10-й минуте души не хуже, чем у соперника по линии (до −500)'}, chk: G => G.lane10 == null || G.lane10 >= -500});
  if (M.spm <= F.spmT * .8 && n < 6) P.push({k: 'farm', w: .35 + Math.min(.45, (1 - M.spm / Math.max(1, F.spmT)) * 1.5),
    t: `Мало душ: <b>${nf(M.spm)}</b> в минуту против ${nf(F.spmT)} в среднем у твоей команды.`,
    plan: ['Между драками не стой без дела — забирай лагеря нейтралов и крипов на пустых линиях.', 'После драки сразу иди фармить ближайшую линию или лагерь, а не обратно на базу.', 'Добивай урны и ящики по пути — это быстрые души.'],
    task: {n: 'Больше душ', rule: 'Между драками всегда что-то фармлю', done: 'души в минуту не ниже среднего по твоей команде'}, chk: G => G.M.spm >= G.spmT * .95});
  if (F.tk >= 10 && M.kp < .4) P.push({k: 'kp', w: .35 + (.4 - M.kp) * 1.5,
    t: `Мало участвуешь в драках: <b>${Math.round(100 * M.kp)}%</b> убийств команды прошли с тобой.`,
    plan: ['Смотри на миникарту: собрались трое своих — иди к ним.', 'Перед мид-боссом и защитой башен будь со своими заранее.', 'Фармишь далеко — заканчивай, когда команда начинает драку.'],
    task: {n: 'Быть в драках', rule: 'Команда собирается — иду к ним', done: 'участие в убийствах команды 50% и больше'}, chk: G => G.M.kp >= .5});
  if (M.dpm <= F.dpmL * .7 && M.hpm < 120) P.push({k: 'dmg', w: .3 + Math.min(.4, (1 - M.dpm / Math.max(1, F.dpmL))),
    t: `Мало урона по героям: <b>${nf(M.dpm)}</b> в минуту против ${nf(F.dpmL)} в среднем в матче.`,
    plan: ['В драке стреляй всё время — каждая секунда без урона на счету.', 'Выбирай ближнюю безопасную цель, а не гоняйся за дальней.', 'Посмотри сборку топов на этом герое — может, не хватает предметов на урон.'],
    task: {n: 'Больше урона', rule: 'В драке стреляю без остановки по ближней цели', done: 'урон в минуту не ниже среднего в матче'}, chk: G => G.M.dpm >= G.dpmL});
  if (n >= 3 && p.deaths > F.dAvg * 1.4 && !P.some(x => ['alone', 'fast', 'low', 'killer'].includes(x.k))) P.push({k: 'deaths', w: .4 + Math.min(.4, (p.deaths - F.dAvg) / 8),
    t: `Много смертей: <b>${p.deaths}</b> против ${f1(F.dAvg)} в среднем в матче.`,
    plan: ['Перед каждой дракой — путь отхода: куда побежишь, если пойдёт плохо.', 'Не догоняй на чужой половине карты, если не видно врагов.', 'Меньше половины здоровья — отходи.'],
    task: {n: 'Меньше смертей', rule: 'Не догоняю на чужой половине, если не вижу врагов', done: 'смертей не больше среднего в матче'}, chk: G => G.p.deaths <= G.dAvg});
  return P.sort((a, b) => b.w - a.w);
}
// сильная сторона — где игрок лучший в лобби
function coGood(F) {
  const X = MX, p = F.p, L = [];
  const place = (f, low) => mPlace(X.P, q => f(X.M.get(q)), p, low);
  const add = (pl0, txt) => { if (pl0 <= 3) L.push([pl0, txt]); };
  add(place(m => m.spm), `души — <b>${place(m => m.spm)}-й</b> из 12 (${nf(F.M.spm)} в минуту)`);
  add(place(m => m.dpm), `урон по героям — <b>${place(m => m.dpm)}-й</b> из 12`);
  add(place(m => m.kp), `участие в драках — <b>${place(m => m.kp)}-й</b> (${Math.round(100 * F.M.kp)}%)`);
  if (F.M.cs != null && F.M.cs >= .8 && F.M.cs >= F.csT + .06) L.push([1, `крипы на линии — <b>${Math.round(100 * F.M.cs)}%</b> из возможных (в команде ${Math.round(100 * F.csT)}%)`]);
  if (p.deaths <= 2) L.push([1, `всего <b>${p.deaths}</b> ${pl(p.deaths, ['смерть', 'смерти', 'смертей'])} за игру`]);
  if (F.lane10 != null && F.lane10 >= 1000) L.push([1, `линию выиграл: <b class="win">+${nf(F.lane10)}</b> душ к 10-й минуте`]);
  add(place(m => m.opm), `урон по объектам — <b>${place(m => m.opm)}-й</b>`);
  return L.sort((a, b) => a[0] - b[0]).slice(0, 2).map(x => x[1]);
}

const CO_HEAD = {alone: () => 'Проблема — где ты умираешь: без своих рядом.', fast: () => 'Проблема — тебя ловят врасплох.', low: () => 'Проблема — ты не отходишь, когда мало здоровья.',
  killer: P => `Проблема — один и тот же враг: ${coHn(P.h)}.`, lane: () => 'Проблема началась ещё на линии.', farm: () => 'Проблема — мало душ.', kp: () => 'Проблема — тебя нет в драках.',
  dmg: () => 'Проблема — мало урона в драках.', deaths: () => 'Проблема — слишком много смертей.'};
function coIntro(F, g10, main) {
  const p = F.p, M = F.M, L = [`${F.won ? 'Победа' : 'Поражение'}, ${g10}/10.`];
  if (F.opp && F.lane10 != null) { const o = coHn(F.opp.hero_id), d = Math.abs(F.lane10);
    L.push(F.lane10 >= 500 ? `Линию против ${o} ты выиграл: +${nf(d)} душ к 10-й минуте${F.lane ? '' : ', без смертей'}.` : F.lane10 <= -500 ? `Линию против ${o} проиграл: −${nf(d)} душ к 10-й минуте.` : `Линия против ${o} — примерно ровно к 10-й минуте.`); }
  if (F.dmg9T >= 1000 && F.dmg9 < F.dmg9T * .5) L.push(`На линии почти не стрелял по героям: ${nf(F.dmg9)} урона до 9-й минуты против ${nf(F.dmg9T)} в среднем по команде.`);
  L.push(`Души — ${nf(M.spm)} в минуту, ${F.spmPl}-й из 12.${M.spm >= F.spmT && !(main && main.k === 'farm') ? ' Фарм не проблема.' : ''}`);
  if (F.tk >= 6) L.push(`В драках: ${Math.round(100 * M.kp)}% убийств команды прошли с тобой.`);
  L.push(main ? CO_HEAD[main.k](main) : 'Явной проблемы в цифрах нет.');
  return L.join(' ');
}
function coFair(F) {
  const L = [];
  if (!F.won && F.score >= 58) L.push('Команда проиграла, но твои цифры выше средних в этом матче — дело не только в тебе.');
  const top = F.T.filter(q => q !== F.p && ((MX.A.get(q) || {}).score || 0) >= 70).sort((a, b) => (MX.A.get(b) || {}).score - (MX.A.get(a) || {}).score).slice(0, 2);
  if (F.won && top.length && F.score < 70) L.push(`Больше всех для победы сделал${top.length > 1 ? 'и' : ''} ${top.map(q => `${coHn(q.hero_id)} (${q.kills}/${q.deaths}/${q.assists})`).join(' и ')}.`);
  if (F.won && F.score < 45) L.push('Победили, но твои цифры ниже средних — игру вытянула команда. Повод разобраться, а не расслабиться.');
  if (F.big >= 2) L.push(`${F.big} ${pl(F.big, ['смерть пришлась', 'смерти пришлись', 'смертей пришлись'])} на большие драки, где умирают все, — это меньше на тебе.`);
  return L;
}
function coMoEm(d) {
  if (d.mates == null) return '';
  if (d.mates > 0) return ` <em>своих рядом ${d.mates}, врагов ${d.foes}</em>`;
  return d.foes === 0 ? ' <em>врагов рядом не было — достали издалека или способностью</em>' : '';
}
function mCo() {
  const X = MX, p = mSel(), F = coFacts(p), PR = coProblems(F), main = PR[0], sec = PR[1], good = coGood(F);
  const g10 = Math.max(1, Math.min(10, Math.round(F.score / 10))), me = X.meP && p === X.meP;
  const intro = coIntro(F, g10, main), fair = coFair(F);
  const moments = F.DD.slice().sort((a, b) => (b.mates === 0) + (b.foes >= 3) + (b.ttk < 3) - ((a.mates === 0) + (a.foes >= 3) + (a.ttk < 3)) || a.t - b.t).slice(0, 5).sort((a, b) => a.t - b.t);
  const TK = coTask(), myTask = TK && TK.aid === p.account_id ? TK : null;
  const tr = myTask ? coTaskTrack(myTask, F) : null;
  return `<div class="co">
    <div class="co-hd"><div class="co-g" style="--g:${g10}"><b>${g10}</b><small>из 10</small></div>
      <div class="co-ht"><small>КОУЧ RESTLESS · РАЗБОР ПО ЦИФРАМ МАТЧА</small><h3>${coHn(p.hero_id)} · ${p.kills}/${p.deaths}/${p.assists}</h3><p>${intro}</p></div></div>
    <div class="co-cols"><div class="co-l">
    ${main ? `<div class="co-main"><span class="co-k">Главная ошибка</span><p>${main.t}</p>${sec ? `<p class="co-sec">И ещё: ${sec.t}</p>` : ''}</div>`
      : `<div class="co-main ok"><span class="co-k">Главное</span><p>Явной ошибки в цифрах не видно — смерти, души, урон и драки в норме для этого матча. Держи этот уровень.</p></div>`}
    ${fair.length ? `<div class="co-box co-fair"><span class="co-k">Честно о картине</span><p>${fair.join(' ')}</p></div>` : ''}
    ${good.length ? `<div class="co-box keep"><span class="co-k">Это сохрани</span><p>${good.map(x => x[0].toUpperCase() + x.slice(1)).join('. ')}.</p></div>` : ''}
    </div><div class="co-r">
    ${moments.length ? `<div class="co-box co-mob"><span class="co-k">Моменты · смерти, которые стоило не отдать</span><ul class="co-mo">${moments.map(d => `<li><time>${coT(d.t)}</time><span>${d.k ? `убил <b>${coHn(d.k.hero_id)}</b>` : 'умер'}${d.why.length ? ' — ' + esc(d.why.join(', ')) : ''}${coMoEm(d)}</span></li>`).join('')}</ul></div>` : ''}
    ${main ? `<div class="co-box co-plb"><span class="co-k">План на 3 игры</span><ol class="co-pl">${main.plan.slice(0, 3).map(x => `<li>${x}</li>`).join('')}</ol></div>` : ''}
    </div></div>
    ${main ? `
    <div class="co-task"><div><span class="co-k">Задание на 3 игры</span><b>${esc(main.task.n)}</b><p><em>Правило:</em> ${esc(main.task.rule)}.</p><p><em>Получилось, когда:</em> ${esc(main.task.done)}.</p></div>
      ${me ? (myTask && myTask.k === main.k ? `<button class="co-tb on" data-cotask="off">Задание взято ✓</button>` : `<button class="co-tb" data-cotask="${esc(main.k)}">Беру задание</button>`) : '<small class="sub">задание берёт сам игрок — в своём профиле</small>'}</div>` : ''}
    ${tr ? `<div class="co-box co-trk"><span class="co-k">Твоё задание: ${esc(myTask.n)}</span><div class="co-gs">${tr.map((x, i) => `<span class="${x == null ? '' : x ? 'ok' : 'no'}">игра ${i + 1}${x == null ? '' : x ? ' ✓' : ' ✗'}</span>`).join('')}</div><small>Проверяется само по следующим матчам, которые ты откроешь.</small></div>` : ''}
    <p class="co-nt">Коуч считает по данным матча: позиции всех 12 игроков в момент смерти, души по минутам, урон и участие в убийствах. Без нейросети — бесплатно и сразу. Смотри и вкладки «Игрок», «Линии», «Карта» — там те же цифры подробно.</p>
  </div>`;
}
// задание: в следующих матчах игрока (новее, чем тот, где взял) — проверка по правилу
function coTaskTrack(T, F) {
  const X = MX, st = tsOf(X.mi.start_time) || 0;
  T.g = T.g || {};
  if (st > T.since && !(X.mid in T.g) && Object.keys(T.g).length < 3) { const P = coProblems({...F}).find(x => x.k === T.k), chk = P ? P.chk : null;
    const def = coTaskChk(T.k, F, T.h); T.g[X.mid] = chk ? !!chk(F) : def; coTaskSave(T); }
  const R = Object.values(T.g).slice(0, 3); while (R.length < 3) R.push(null); return R;
}
function coTaskChk(k, F, h) {
  return ({alone: F.alone <= 1, fast: F.fast <= 1, low: F.low <= 1, killer: (F.killers.find(x => x.h === h) || {c: 0}).c <= 1, lane: F.lane10 == null || F.lane10 >= -500,
    farm: F.M.spm >= F.spmT * .95, kp: F.M.kp >= .5, dmg: F.M.dpm >= F.dpmL, deaths: F.p.deaths <= F.dAvg})[k] ?? true;
}
{
  const MB0 = mBody;
  mBody = function () {
    if (MZ.tab !== 'co') return MB0();
    const el = $('#qmb'); if (!el) return; cancelAnimationFrame(MZ.raf); MZ.play = 0;
    el.innerHTML = mCo(); el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
    el.onclick = e => { const b = e.target.closest('[data-cotask]'); if (!b) return; e.stopPropagation();
      if (b.dataset.cotask === 'off') { coTaskSave(null); mBody(); return; }
      const p = mSel(), F = coFacts(p), P = coProblems(F).find(x => x.k === b.dataset.cotask); if (!P) return;
      coTaskSave({k: P.k, h: P.h || 0, n: P.task.n, aid: p.account_id, since: tsOf(MX.mi.start_time) || now(), g: {}}); mBody(); };
  };
  // коуч — первая вкладка; по своему матчу открывается сразу на нём
  const VM0 = viewMatch2;
  viewMatch2 = async function (mid, tab) { if (!tab && +mid !== MZ.mid) MZ.tab = 'co'; return VM0(mid, tab); };
}
