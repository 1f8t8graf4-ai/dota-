// Никотин — как популярные TikTok-ролики (klin_situation, thebanger475): герой Макс, над головой таймер
// «сколько продержится без никотина», плашка «ДЕНЬ N · время» сверху. v5, RU, чисто и плоско.
(function () {
  const C = { bg: '#0E1A30', bg2: '#16264A', bg3: '#22385F', ink: '#0A1224', paper: '#EEF2FF', line: '#0A1224', a1: '#FFD23F', a2: '#FF4D5A', a3: '#3DDC84',
    sky: '#2A4677', wall: '#2B3E66', wall2: '#22335A', floor: '#1B2A4A', door: '#5D6F96', door2: '#4A5B80', skin: '#F2C29B', red2: '#3A1830', mango: '#FFB238' };
  P = C;
  const D = {};
  const MOT = [C.a1, C.paper, C.bg3];
  // плашка «ДЕНЬ N · время» сверху
  function dayPlate(str, t, t0, col = C.a1) {
    const k = E(t, t0, .45, 'back'), w0 = tw(str, { f: 'O', w: 700, s: 46, ls: 3 }) + 80;
    return g(sh(D_.rr(-w0 / 2, -40, w0, 80, 40), C.ink, { c: col, w: 4 }) + tx(str, 0, 16, { f: 'O', w: 700, s: 46, c: col, ls: 3 }), at(540, lerp(150, 275, k), 1), clamp(k * 3))
  }
  // таймер над головой, покачивается
  const timer = (t, x, y, label, value, col = C.a1, s = 1, o = {}) => timerPlate(x + (o.sx || 0), y + bob(t, 6, .5), label, value, { col, s, f: C.ink, c: C.ink, minW: o.minW || 360, op: o.op ?? 1 });
  let L1 = 'БЕЗ НИКОТИНА', L2 = 'ДЕРЖИТСЯ', MON = [];
  // Макс в полный рост: стопы (x, y), масштаб s
  const MAX = { f: '#F2994A', f2: '#D97A2B', hairC: '#3B2A20', pants: '#2E3B5E', c: C.ink };
  const max = (t, x, y, s, o = {}) => teen(t, { ...MAX, x, y, s, ...o });
  // фон: круг-«прожектор» за героем (плоский)
  const spot = (x, y, r, c = C.bg2) => sh(D_.circ(x, y, r), c);
  // гаражи
  function garages(t) {
    let s = bg(C.sky) + sh(D_.rr(-20, 980, 1120, 1000, 0), C.floor) + motes(t, MOT, 8, 200, 700);
    for (let i = 0; i < 4; i++) { const x = -40 + i * 290; s += sh(D_.rr(x, 560, 270, 420, 6), C.door2, { c: C.ink, w: 5 }) + sh(D_.rr(x + 22, 600, 226, 380, 4), C.door, { c: C.ink, w: 4 }); for (let j = 0; j < 9; j++) s += line(`M${x + 30} ${640 + j * 38}H${x + 240}`, 1, { c: C.door2, w: 4 }) }
    s += sh(D_.rr(-40, 530, 1160, 40, 0), C.wall2, { c: C.ink, w: 5 });
    return s
  }
  // комната: стена, окно (ночь/утро), пол
  function room(t, night, o = {}) {
    let s = bg(night ? '#121B33' : '#3A5A8C') + sh(D_.rr(-20, 1120, 1120, 900, 0), night ? '#0C1428' : '#2B4370');
    const sky = night ? '#0A1022' : '#8FC3F2';
    s += sh(D_.rr(620, 330, 340, 400, 18), sky, { c: C.ink, w: 8 });
    s += night ? sh(D_.circ(860, 430, 46), '#F7F0C6') + sh(D_.circ(884, 418, 40), sky) + stars(t, 10, 0).replace(/cx="(\d+(\.\d+)?)"/g, (m, a) => `cx="${R(640 + (+a) * .29)}"`).replace(/cy="(\d+(\.\d+)?)"/g, (m, a) => `cy="${R(350 + (+a) * .4)}"`) : sh(D_.circ(880, 420, 50), '#FFE38A');
    s += line('M790 330V730M620 530H960', 1, { c: C.ink, w: 8 });
    return s
  }
  // кровать с лежащим Максом (голова на подушке): x — центр, mood, eyes
  function bed(t, x, y, o = {}) {
    let s = sh(D_.rr(x - 470, y - 40, 940, 230, 30), '#6B4A2E', { c: C.ink, w: 7 }) + sh(D_.rr(x - 450, y - 120, 900, 120, 40), '#DDE4F5', { c: C.ink, w: 6 });
    s += sh(D_.rr(x - 430, y - 210, 260, 120, 50), '#FFFFFF', { c: C.ink, w: 6 });
    s += g(teen(t, { ...MAX, mood: o.mood || 'sleep', bags: o.bags, blink: o.blink, look: o.look, legs: 'none', hideHands: true }), at(x + 230, y - 150, .52, -88));
    s += sh(`M${x - 210} ${y - 140}C${x - 100} ${y - 230} ${x + 300} ${y - 210} ${x + 450} ${y - 140}V${y}H${x - 210}Z`, o.blanket || '#4B6CB7', { c: C.ink, w: 6 }) + line(`M${x - 200} ${y - 150}C${x - 60} ${y - 200} ${x + 200} ${y - 190} ${x + 380} ${y - 150}`, 1, { c: C.ink, w: 4, op: .4 });
    return s
  }
  // тумбочка с телефоном и одноразкой
  function nightstand(t, x, y, buzz) {
    let s = sh(D_.rr(x - 130, y, 260, 260, 16), '#7A5536', { c: C.ink, w: 6 }) + line(`M${x - 110} ${y + 130}H${x + 110}`, 1, { c: C.ink, w: 5 }) + sh(D_.circ(x, y + 70, 9), C.ink);
    const bz = buzz ? Math.sin(t * 60) * 5 : 0;
    s += g(sh(D_.rr(-70, -16, 140, 32, 10), '#22283A', { c: C.ink, w: 5 }) + sh(D_.rr(-58, -10, 116, 20, 6), buzz ? '#FFD23F' : '#5B8DEF'), at(x - 70 + bz, y - 16, 1, -6));
    if (buzz) s += line(`M${x - 160} ${y - 40}l-20 -14M${x - 160} ${y - 10}l-26 0M${x + 20} ${y - 40}l20 -14`, 1, { c: C.a1, w: 5 });
    return s
  }

  // ===== 1. «Над головой у Макса таймер…» =====
  D.hook = (t, S, T) => {
    const tt = T.c(L('timer', 'таймер')) - .15, tl = T.c(L('without', 'без')) - .1;
    let s = bg(C.bg) + spot(540, 820, 420) + motes(t, MOT, 12);
    s += max(t, 540, 1290, .8, { mood: 'calm', look: bob(t, .3, .3) });
    s += pop(timer(t, 0, 0, L1, '∞', C.a1, 1), 540, 420, t, .15, { s: 1.15 * (1 + .1 * squash(t, tt, .6) - .1) });
    s += ringWave(540, 420, t, tt, { c: C.a1, r0: 160, r1: 420 });
    return g(s, drift(t, T, .06, 540, 700))
  };
  // ===== 2. «Сейчас там бесконечность. Через полгода будет сорок минут» — заглядываем в будущее =====
  D.hook2 = (t, S, T) => {
    const tp = T.c(L('months', 'полгода')) - .2, t40 = T.c(L('forty', 'сорок')) - .15, tinf = T.c(L('infinity', 'бесконечность')) - .1;
    const kf = E(t, tp, .7, 'io'), red = E(t, t40 - .1, .3);
    let s = bg(red > 0 ? (red > .5 ? C.red2 : C.bg) : C.bg) + spot(540, 820, 420, red > .5 ? '#4A1E3A' : C.bg2) + motes(t, MOT, 12);
    // листки календаря летят
    if (kf > 0 && kf < 1) for (let i = 0; i < 7; i++) { const q = clamp(kf * 7 - i); if (q > 0 && q < 1) s += calPage(lerp(220, -200, EZ.i(q)), lerp(560, 300, EZ.o(q)) + i * 6, MON[i], String(15 + i), { s: .55, rot: -30 * q, f: C.paper, c: C.ink, bs: 120 }) }
    const tired = red;
    s += max(t, 540, 1290, .8, { mood: tired > .5 ? 'tired' : 'calm', bags: tired, headR: tired * 8, headY: tired * 14, item: tired > .5 ? 'vape' : null, pose: tired > .5 ? 'mouth' : 'stand' });
    const pulse = 1 + .08 * Math.sin(Math.max(0, t - tinf) * 9) * (1 - clamp((t - tinf) / 1.2));
    const val = red > .5 ? '0:40:00' : '∞', col = red > .5 ? C.a2 : C.a1;
    s += g(timer(t, 0, 0, L1, val, col, 1), at(540 + shake(t, t40 + .1, 16), 420, 1.1 * (red > .5 ? 1 + .1 * squash(t, t40 + .1, .5) - .1 : pulse)));
    return g(s, drift(t, T, .05, 540, 700))
  };
  // ===== 3. День 1: за гаражами друг протягивает одноразку =====
  D.d1 = (t, S, T) => {
    const tg = T.c(L('hands', 'протягивает')) - .15, tm = T.c(L('mango', 'манго')) - .15;
    let s = garages(t) + dayPlate(L('DAY 1 · 16:40', 'ДЕНЬ 1 · 16:40'), t, T.a + .1);
    const kg = E(t, tg, .5, 'io5');
    const fpose = { L: [[-132, -600], [-138, -462]], R: [[lerp(132, 214, kg), lerp(-600, -690, kg)], [lerp(138, 318, kg), lerp(-462, -672, kg)]] };
    s += teen(t, { x: 330, y: 1300, s: .66, f: '#3E9E6B', f2: '#2E7A52', hair: 'cap', capC: '#E2574C', pants: '#3B3B4A', c: C.ink, pose: fpose, item: 'vape', mood: 'smirk', seed: 9 });
    s += max(t, 760, 1300, .66, { mood: 'o', look: -.6, flip: true });
    if (kg >= 1) s += pop(pill(L('MANGO ICE', 'МАНГО-ЛЁД'), 0, 0, { f: C.a1, tc: C.ink, s: 38 }), 560, 640, t, tm, { r0: 10 }) + pop(mango(0, 0, .45, { c: C.ink }), 690, 560, t, tm + .15) + pop(sh(D_.rr(-34, -34, 68, 68, 12), '#BFE6FF', { c: C.ink, w: 5 }) + `<path d="M-18 -12L4 -22" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`, 760, 600, t, tm + .25, { r0: 20 });
    s += timer(t, 760, 470, L1, '∞', C.a1, .6, { op: .9 });
    return g(s, drift(t, T, .04, 560, 860))
  };
  // ===== 4. кашляет, голова кружится, все ржут =====
  D.cough = (t, S, T) => {
    const th = T.c(L('head', 'голова')) - .1, tl = T.c(L('laugh', 'ржут')) - .25;
    let s = garages(t);
    s += teen(t, { x: 120, y: 1520, s: .9, f: '#3E9E6B', f2: '#2E7A52', hair: 'cap', capC: '#E2574C', pants: '#3B3B4A', c: C.ink, mood: P01(t, tl, .1) > 0 ? 'laugh' : 'smirk', seed: 9 });
    s += teen(t, { x: 980, y: 1540, s: .9, f: '#8E6BD6', f2: '#6E4FB2', hair: 'curly', pants: '#3B3B4A', c: C.ink, mood: P01(t, tl, .1) > 0 ? 'laugh' : 'calm', seed: 4, flip: true });
    const cg = Math.max(0, Math.sin((t - T.a) * 9)) * (t < th + .6 ? 1 : .4);
    s += max(t, 560 + shake(t, T.a, 8, 1.2, 50), 1500, 1.02, { pose: 'cough', mood: 'cough', headR: 6 + cg * 6, headY: cg * 10, item: null });
    for (let i = 0; i < 4; i++) { const q = ((t - T.a) * 1.4 + i / 4) % 1; if (t > T.a + .1) s += g(cloud(0, 0, 1, { f: '#FFFFFF', c: C.ink, w: 7 }), at(600 + q * 260 + i * 10, 650 - q * 160, .3 + q * .35), Math.min(1, (1 - q) * 2)) }
    const kh = P01(t, th, .4);
    if (kh > 0) for (let i = 0; i < 5; i++) { const a = (t * 220 + i * 72) * Math.PI / 180; s += g(sh(D_.star(0, 0, 26, 11), C.a1, { c: C.ink, w: 4 }), at(560 + Math.cos(a) * 150, 420 + Math.sin(a) * 40, EZ.back(kh))) }
    if (P01(t, tl, .1) > 0) s += pop(tx(L('HA-HA', 'ХА-ХА'), 0, 0, { f: 'U', w: 800, s: 64, c: C.a1, st: C.ink, sw: 12 }), 230, 560, t, tl, { r: -12 }) + pop(tx(L('HA!', 'ХА!'), 0, 0, { f: 'U', w: 800, s: 72, c: C.a1, st: C.ink, sw: 12 }), 880, 520, t, tl + .15, { r: 10 });
    return g(s, drift(t, T, .05, 560, 700))
  };
  // ===== 5. рентген: никотин до мозга за 10 секунд, дофамин, пометка =====
  D.brain = (t, S, T) => {
    const t10 = T.c('10') - .15, tbr = T.c(L('brain', 'мозга')) - .1, td = T.c(L('dopamine', 'дофамин')) - .15, tn = T.c(L('note', 'пометку')) - .2;
    let s = bg('#0B1630') + sh(D_.circ(540, 760, 460), '#122247');
    s += g(sh(HEAD, '#1B3560', { c: '#7FB2FF', w: 4 }), at(470, 860, 2.1));
    s += g(brainF(t, { c: C.ink, face: { mood: P01(t, td, .3) > .5 ? 'happy' : 'calm' } }), at(480, 680, 1.15));
    const path = 'M900 990C860 1200 520 1260 360 1140C200 1020 260 820 420 740';
    const run = E(t, t10, tbr - t10 + .1, 'io');
    s += dotted(path, E(t, T.a, .6, 'o5'), C.a1, 7, 22);
    if (run > 0 && run < 1) { const p = pts(path, 120)[Math.floor(run * 119)]; s += sh(D_.circ(p[0], p[1], 18), C.a2, { c: C.ink, w: 5 }) }
    s += stopwatch(860, 420, 10 * run, { r: 120, c: C.ink, f: '#FFFFFF', face: C.paper, fill: C.a1, unit: L(' s', ' с') });
    s += ringWave(440, 720, t, tbr, { c: C.a1, r1: 300 });
    for (let i = 0; i < 10; i++) { const ph = clamp((t - td - i * .07) / .7); if (ph > 0 && ph < 1) { const a = i * 36 * Math.PI / 180; s += sh(D_.drop(480 + Math.cos(a) * 260 * EZ.o(ph), 680 + Math.sin(a) * 200 * EZ.o(ph), 26), C.a1, { c: C.ink, w: 4, op: 1 - ph }) } }
    s += pop(g(sh(D_.rr(-130, -70, 260, 140, 6), C.a1, { c: C.ink, w: 5 }) + tx(L('REMEMBER ✓', 'ЗАПОМНИЛ ✓'), 0, 14, { f: 'O', w: 700, s: 40, c: C.ink })), 650, 520, t, tn, { r: 8 });
    return g(s, drift(t, T, .04, 540, 760))
  };
  // ===== 6. День 14: покупает свою =====
  D.d14 = (t, S, T) => {
    const tb = T.c(L('buys', 'покупает')) - .15;
    let s = bg('#24365C') + sh(D_.rr(-20, 1130, 1120, 900, 0), C.floor) + dayPlate(L('DAY 14 · 18:05', 'ДЕНЬ 14 · 18:05'), t, T.a + .1);
    s += sh(D_.rr(40, 420, 520, 720, 20), '#3C5487', { c: C.ink, w: 7 }) + sh(D_.rr(90, 470, 420, 330, 12), '#FFE38A', { c: C.ink, w: 6 });
    for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) s += sh(D_.rr(110 + i * 66, 490 + r * 100, 44, 80, 10), ['#FFB238', '#7FC48A', '#E2574C', '#5B8DEF', '#B98BEF', '#FF7FB0'][(i + r) % 6], { c: C.ink, w: 3 });
    s += sh(D_.rr(70, 800, 460, 40, 8), '#7A5536', { c: C.ink, w: 6 });
    const kb = E(t, tb, .6, 'io5');
    s += g(sh(D_.rr(-260, -50, 200, 100, 30), '#3C5487', { c: C.ink, w: 5 }) + sh(D_.rr(-70, -46, 120, 92, 40), C.skin, { c: C.ink, w: 5 }), at(lerp(300, 380, kb), 760));
    s += g(vape(t, { c: C.ink, label: false, fruit: false }), at(lerp(400, 720, kb), lerp(745, 820, kb), .3, 90 - kb * 80));
    s += max(t, 800, 1330, .74, { flip: true, pose: { L: [[-132, -600], [-138, -462]], R: [[lerp(132, 214, kb), lerp(-600, -690, kb)], [lerp(138, 300, kb), lerp(-462, -660, kb)]] }, mood: 'smirk', look: -.5 });
    s += pop(bill(0, 0, { w: 150, c: C.ink }), 560, 770, t, T.a + .3, { s: 1, out: tb + .1 });
    s += timer(t, 800, 500, L1, '∞', C.a1, .6, { op: .9 });
    return g(s, drift(t, T, .04, 600, 860))
  };
  // ===== 7, 9. таймер крупно: дёргается и меняется =====
  function timerShot(t, T, from, to, tch, col0 = C.a1, col1 = C.a1, label = L1) {
    let s = bg(C.bg) + spot(540, 1300, 520) + motes(t, MOT, 10);
    s += max(t, 540, 2250, 1.5, { mood: 'tired', bags: .6, look: 0 });
    const gl = P01(t, tch - .5, .5), ch = t >= tch, sk = shake(t, tch - .5, 22, .5, 70) + shake(t, tch, 12, .3, 60);
    let pl = timer(t, 0, 0, label, ch ? to : from, ch ? col1 : col0, 1.9, { minW: 420 });
    if (gl > 0 && gl < 1) { for (let i = 0; i < 4; i++) { const y0 = -160 + i * 80 + rnd(Math.floor(t * 20) + i) * 40; pl += clip(D_.rr(-600, y0, 1200, 30, 0), g(pl, `translate(${R((rnd(Math.floor(t * 24) + i * 7) - .5) * 60)} 0)`)) } }
    s += g(pl, at(540 + sk, 640, 1 + .08 * squash(t, tch, .6) - .08));
    return g(s, drift(t, T, .05, 540, 700))
  }
  D.t3d = (t, S, T) => timerShot(t, T, '∞', L('3 DAYS', '3 ДНЯ'), T.c(L('three', 'три')) - .1);
  D.t6h = (t, S, T) => timerShot(t, T, L('3 DAYS', '3 ДНЯ'), L('6 HOURS', '6 ЧАСОВ'), T.c(L('six', 'шесть')) - .1);
  // ===== 8. День 30, 07:02: рука тянется мимо телефона к одноразке =====
  D.d30 = (t, S, T) => {
    const tr = T.c(L('reaches', 'тянется')) - .2, tv = T.c(L('vape', 'одноразке')) - .1;
    let s = room(t, false) + dayPlate(L('DAY 30 · 07:02', 'ДЕНЬ 30 · 07:02'), t, T.a + .1);
    s += bed(t, 470, 1030, { mood: P01(t, tr, .1) > 0 ? 'tired' : 'sleep', bags: .5, blanket: '#4B6CB7' });
    s += nightstand(t, 960, 960, true);
    const kr = E(t, tr, tv - tr + .25, 'io5'), kv = E(t, tv + .2, .5, 'io5');
    const hx = lerp(650, 1000, kr), hy = lerp(980, 930, kr) - kv * 80;
    s += line(`M560 990Q${R(hx - 120)} ${R(hy - 20)} ${R(hx)} ${R(hy)}`, 1, { c: C.ink, w: 64 }) + line(`M560 990Q${R(hx - 120)} ${R(hy - 20)} ${R(hx)} ${R(hy)}`, 1, { c: '#4B6CB7', w: 52 });
    if (kr < .98) s += g(vape(t, { c: C.ink, label: false, fruit: false }), at(1010, 905, .26, 0));
    else s += g(vape(t, { c: C.ink, label: false, fruit: false }), at(hx + 4, hy - 20, .26, -10));
    s += sh(D_.circ(hx, hy, 30), C.skin, { c: C.ink, w: 6 });
    s += timer(t, 300, 560, L1, L('3 DAYS', '3 ДНЯ'), C.a1, .62, { op: .9 });
    return g(s, drift(t, T, .04, 600, 900))
  };
  // ===== 10. график: никотин в крови — через 2 часа половина =====
  D.half = (t, S, T) => {
    const t2 = T.c(L('two', 'два')) - .2, th = T.c(L('half', 'половина')) - .2;
    let s = bg(C.bg) + motes(t, MOT, 8);
    const X0 = 140, X1 = 960, Y0 = 1100, Y1 = 420, hx = h => X0 + (X1 - X0) * h / 8, ly = v => Y0 - (Y0 - Y1) * v;
    s += line(`M${X0} ${Y1 - 40}V${Y0}H${X1 + 30}`, E(t, T.a, .5, 'o5'), { c: C.paper, w: 6 });
    for (let h = 0; h <= 8; h += 2) s += tx(String(h), hx(h), Y0 + 56, { f: 'O', w: 500, s: 38, c: '#A9B6D6', op: E(t, T.a + .2, .4) });
    s += cap(L('hours', 'часы'), X1 - 10, Y0 + 110, { c: '#A9B6D6', s: 26, op: E(t, T.a + .3, .4) });
    s += cap(L('nicotine in blood', 'никотин в крови'), X0 + 160, Y1 - 60, { c: C.a1, s: 26, op: E(t, T.a + .3, .4) });
    let d = `M${hx(0)} ${ly(0)}L${hx(.1)} ${ly(1)}`; for (let i = 1; i <= 80; i++) { const h = .1 + i * .099; d += `L${R(hx(h))} ${R(ly(Math.pow(.5, (h - .1) / 2)))}` }
    s += line(d, E(t, T.a + .3, th - T.a + .4, 'l'), { c: C.a2, w: 10 });
    const k2 = E(t, t2, .5, 'o5');
    if (k2 > 0) s += line(`M${hx(2.1)} ${ly(0)}V${ly(.5)}H${hx(0)}`, k2, { c: C.a1, w: 5, da: '14 12' });
    s += pop(tx('½', 0, 0, { f: 'O', w: 700, s: 120, c: C.a1 }), hx(2.1) + 110, ly(.5) - 50, t, th, { s: 1 });
    s += pop(g(sh(D_.circ(0, 0, 70), C.bg3, { c: C.paper, w: 5 }) + g(vape(t, { c: C.ink, label: false, fruit: false }), at(0, 4, .2, 20))), hx(0) + 130, ly(1) + 40, t, T.a + .2, { s: 1 });
    return g(s, drift(t, T, .04))
  };
  // ===== 11. День 90: класс, сдвоенный урок, таймер 1:30:00 =====
  function classroom(t, spin = 0) {
    let s = bg('#3A5A8C') + sh(D_.rr(-20, 1120, 1120, 900, 0), '#2B4370');
    s += sh(D_.rr(90, 300, 620, 380, 16), '#1F4A3A', { c: '#7A5536', w: 18 }) + line('M150 380Q260 360 380 390M150 450L420 440M160 520Q300 500 460 530', 1, { c: '#E6EFE9', w: 5, op: .6 });
    s += clockF(860, 400, 100, 10 + spin * 1.5, (15 + spin * 90) % 60, { c: C.ink, f: '#FFFFFF', hand: C.a2 });
    return s
  }
  D.d90 = (t, S, T) => {
    const tt = T.c(L('one', 'полтора')) - .15, tl = T.c(L('double', 'сдвоенный')) - .15;
    const spin = E(t, tl, 1.6, 'io');
    let s = classroom(t, spin) + dayPlate(L('DAY 90 · 10:15', 'ДЕНЬ 90 · 10:15'), t, T.a + .1);
    const jig = t > tl ? Math.sin(t * 40) * 4 : 0;
    s += max(t, 540, 1420, .78, { legs: 'sit', mood: t > tl ? 'tired' : 'calm', bags: .7, sweat: t > tl ? (t - tl) : 0, look: .4, headY: jig });
    s += sh(D_.rr(170, 1000, 740, 60, 12), '#B07A4A', { c: C.ink, w: 6 }) + sh(D_.rr(220, 1060, 40, 260, 8), '#7A5536', { c: C.ink, w: 5 }) + sh(D_.rr(820, 1060, 40, 260, 8), '#7A5536', { c: C.ink, w: 5 });
    s += g(sh(D_.rr(-110, -16, 220, 32, 6), '#FFFFFF', { c: C.ink, w: 4 }) + line('M-90 -4H70', 1, { c: C.ink, w: 3, op: .5 }), at(420, 985, 1, -4));
    s += pop(timer(t, 0, 0, L1, '1:30:00', C.a1, .72), 540 + jig, 560, t, tt, { s: 1 });
    return g(s, drift(t, T, .04, 540, 860))
  };
  // ===== 12. Полгода: 0:40:00, туалет посреди урока =====
  D.d180 = (t, S, T) => {
    const t40 = T.c(L('forty', 'сорок')) - .15, tv = T.c(L('vapes', 'парит')) - .15;
    let s = bg('#A9C7DE');
    for (let y = 0; y < 1200; y += 80) for (let x = (y / 80) % 2 ? -40 : 0; x < 1100; x += 80) s += line(D_.rr(x, y, 80, 80, 0), 1, { c: '#8FB0CB', w: 4 });
    s += sh(D_.rr(-20, 1180, 1120, 900, 0), '#7C98B3') + dayPlate(L('6 MONTHS · 11:40', '180 ДНЕЙ · 11:40'), t, T.a + .1, C.a2);
    s += sh(D_.rr(240, 520, 600, 760, 10), '#5D6F96', { c: C.ink, w: 7 }) + sh(D_.rr(260, 540, 560, 700, 6), '#6E82AA') + sh(D_.circ(320, 900, 14), C.ink);
    s += sh(D_.rr(330, 1240, 110, 50, 20), '#F4F4F4', { c: C.ink, w: 5 }) + sh(D_.rr(560, 1240, 110, 50, 20), '#F4F4F4', { c: C.ink, w: 5 });
    for (let i = 0; i < 4; i++) { const q = ((t - tv) * .7 + i / 4) % 1; if (t > tv) s += g(cloud(0, 0, 1, { f: '#FFFFFF', c: C.ink, w: 7 }), at(720 + Math.sin(q * 5 + i) * 40, 540 - q * 200, .3 + q * .4), Math.min(1, (1 - q) * 2)) }
    const kp = P01(t, t40, .4);
    s += g(timer(t, 0, 0, L1, kp > 0 ? '0:40:00' : '1:30:00', kp > 0 ? C.a2 : C.a1, .9), at(330 + shake(t, t40, 14), 450, 1 + .12 * squash(t, t40 + .05, .5) - .12));
    return g(s, drift(t, T, .04, 540, 860))
  };
  // ===== 13. 03:12 — просыпается ночью =====
  D.night = (t, S, T) => {
    const tz = T.c(L('puff', 'затянуться')) - .2;
    let s = room(t, true) + dayPlate('03:12', t, T.a + .1, C.a2);
    s += sh(D_.rr(60, 1020, 960, 230, 30), '#4A3420', { c: C.ink, w: 7 });
    s += max(t, 470, 1500, .9, { mood: 'tired', bags: 1, pose: P01(t, tz, .2) > 0 ? 'mouth' : 'stand', item: 'vape', legs: 'none', look: .2 });
    s += sh('M60 1080C200 1000 700 1010 1020 1080V1260H60Z', '#2F477D', { c: C.ink, w: 6 });
    if (t > tz + .3) { const q = clamp((t - tz - .3) / 1.2); s += g(cloud(0, 0, 1, { f: '#E8EEFF', c: C.ink, w: 7 }), at(620 + q * 120, 560 - q * 140, .3 + q * .4), 1 - q) }
    s += timer(t, 470, 440, L1, '0:40:00', C.a2, .62, { op: .95 });
    return g(s, drift(t, T, .05, 520, 760))
  };
  // ===== 14. «Однажды утром Макс решает бросить» — одноразка летит в ведро =====
  D.quit = (t, S, T) => {
    const tq = T.c(L('quit', 'бросить')) - .3;
    let s = room(t, false) + sh(D_.circ(880, 420, 140), '#FFE38A', { op: .25 });
    const kt = P01(t, tq, .8), thr = kt > 0;
    s += max(t, 380, 1330, .82, { pose: thr && kt < .25 ? 'throw' : thr ? 'stand' : 'mouth', item: thr ? null : 'vape', mood: thr ? 'angry' : 'tired', bags: .6, look: .5 });
    s += sh('M760 1060H960L930 1300H790Z', '#7C8BA5', { c: C.ink, w: 7 }) + sh(D_.rr(740, 1030, 240, 40, 12), '#5D6B85', { c: C.ink, w: 6, tr: `rotate(${R(-20 * Math.sin(clamp((kt - .85) / .15) * Math.PI))} 740 1050)` });
    if (thr && kt < 1) { const u = EZ.io(kt); s += g(vape(t, { c: C.ink, label: false, fruit: false }), at(lerp(560, 860, u), lerp(520, 1060, u) - Math.sin(u * Math.PI) * 300, .26, u * 540)) }
    s += timer(t, 380, 470, L1, '0:40:00', C.a2, .6, { op: .9 });
    return g(s, drift(t, T, .04, 560, 860))
  };
  // ===== 15. таймер переворачивается и считает «держится» =====
  D.flip = (t, S, T) => {
    const tf = T.c(L('flips', 'переворачивается')) - .1, tc = T.c(L('counts', 'считает')) - .2;
    const kf = clamp((t - tf) / .6), half = kf < .5;
    let s = bg(kf >= .5 ? '#0F2A22' : C.bg) + spot(540, 1300, 520, kf >= .5 ? '#164A3A' : C.bg2) + motes(t, MOT, 10);
    s += max(t, 540, 2250, 1.5, { mood: kf >= .5 ? 'smile' : 'tired', bags: kf >= .5 ? .3 : .7 });
    const run = Math.max(0, t - tc);
    const sec = Math.floor(run * 47), v = `00:${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
    const pl = half ? timer(t, 0, 0, L1, '0:40:00', C.a2, 1.9, { minW: 420 }) : timer(t, 0, 0, L2, v, C.a3, 1.9, { minW: 420 });
    const sy = kf > 0 && kf < 1 ? Math.abs(Math.cos(kf * Math.PI)) : 1;
    s += g(g(pl, at(540, 640)), `translate(540 640) scale(1 ${R(Math.max(.02, sy) * 1000) / 1000}) translate(-540 -640)`);
    if (kf >= .5) s += burst(540, 640, t, tf + .3, { c: C.a3, r0: 300, r1: 470, n: 14 });
    return g(s, drift(t, T, .05, 540, 700))
  };
  // ===== 16. «Первый день. Бесят все» =====
  D.q1 = (t, S, T) => {
    const ta = T.c(L('annoying', 'бесят')) - .15;
    let s = bg('#2A2F55') + spot(540, 820, 430, '#363C6B') + dayPlate(L('WITHOUT · DAY 1', 'БЕЗ · ДЕНЬ 1'), t, T.a + .1, C.a3);
    s += teen(t, { x: 150, y: 1360, s: .62, f: '#8E6BD6', f2: '#6E4FB2', hair: 'curly', pants: '#3B3B4A', c: C.ink, mood: 'smile', talk: Math.abs(Math.sin(t * 14)), seed: 4 });
    s += teen(t, { x: 930, y: 1360, s: .62, f: '#3E9E6B', f2: '#2E7A52', hair: 'cap', capC: '#E2574C', pants: '#3B3B4A', c: C.ink, mood: 'smile', talk: Math.abs(Math.sin(t * 12 + 1)), seed: 9, flip: true });
    s += max(t, 540, 1330, .78, { pose: 'cross', mood: 'angry', look: 0 });
    const ka = P01(t, ta, .3);
    if (ka > 0) for (let i = 0; i < 3; i++) s += pop(line('M-30 -10Q0 -40 30 -10M-30 10Q0 40 30 10', 1, { c: C.a2, w: 9 }), [400, 700, 560][i], [520, 540, 440][i], t, ta + i * .12, { r: i * 30 });
    s += pop(bubble(L('blah', 'бла-бла'), 0, 0, { s: 40, c: C.ink }), 230, 620, t, T.a + .2, { s: .9 }) + pop(bubble('?!', 0, 0, { s: 48, c: C.ink }), 860, 640, t, T.a + .45, { s: .9 });
    s += timer(t, 540, 420, L2, L('1 DAY', '1 ДЕНЬ'), C.a3, .62);
    return g(s, drift(t, T, .05, 540, 860))
  };
  // ===== 17. «Третий день. Самый тяжёлый» =====
  D.q3 = (t, S, T) => {
    const th = T.c(L('hardest', 'тяжёлый')) - .2;
    let s = bg('#1E2347') + spot(540, 820, 430, '#2A2F5E') + dayPlate(L('WITHOUT · DAY 3', 'БЕЗ · ДЕНЬ 3'), t, T.a + .1, C.a3);
    s += max(t, 540, 1330, .8, { pose: { L: [[-170, -760], [-80, -880]], R: [[170, -760], [80, -880]] }, mood: 'tired', bags: 1, headY: 16, sweat: (t - T.a) * .8 });
    const kc = E(t, T.a + .2, .5, 'back');
    s += g(cloud(0, 0, 1, { f: '#5A6285', c: C.ink, w: 7 }) + (kc >= 1 ? line('M-90 60l-20 60M-20 60l-20 60M50 60l-20 60M120 60l-20 60'.replace(/l-20 60/g, `l-20 ${R(40 + 20 * Math.sin(t * 20))}`), 1, { c: '#8FB0FF', w: 6 }) : ''), at(540, 430, .62 * kc));
    // шкала тяги
    const kv = E(t, th, .6, 'back');
    s += g(sh(D_.rr(-34, -230, 68, 460, 34), C.ink, { c: C.paper, w: 5 }) + sh(D_.rr(-22, 218 - 436 * clamp(.4 + .6 * kv), 44, 436 * clamp(.4 + .6 * kv), 22), C.a2) + cap(L('craving', 'тяга'), 0, 280, { c: C.paper, s: 26 }), at(940, 820));
    return g(s, drift(t, T, .05, 540, 860))
  };
  // ===== 18. волна тяги: Макс на доске — 3–5 минут =====
  D.wave = (t, S, T) => {
    const tb = T.c(L('endless', 'бесконечной')) - .3, tp = T.c(L('passes', 'проходит')) - .2, t35 = T.c('3–5') - .15;
    let s = bg('#14305A') + motes(t, MOT, 8);
    const X0 = 120, X1 = 960, Y0 = 1120, minX = m => X0 + (X1 - X0) * m / 6;
    const amp = 560 * (E(t, T.a, tb - T.a + .3, 'io') - E(t, tp, 1.4, 'io') * .9), peak = lerp(minX(1.2), minX(2.2), E(t, tp - .5, 1.6, 'io'));
    const wy = x => Y0 - amp * Math.exp(-Math.pow((x - peak) / 220, 2)) + Math.sin(x / 40 + t * 4) * 8;
    let d = `M${X0 - 60} ${Y0 + 200}`; for (let x = X0 - 60; x <= X1 + 60; x += 12) d += `L${x} ${R(wy(x))}`; d += `L${X1 + 60} ${Y0 + 200}Z`;
    s += sh(d, '#2E6FB5', { c: C.ink, w: 6 }) + sh(D_.rr(-20, Y0 + 40, 1120, 800, 0), '#1E4F86');
    s += line(`M${X0} ${Y0 + 70}H${X1}`, 1, { c: C.paper, w: 5 });
    for (let m = 0; m <= 5; m++) s += tx(String(m), minX(m), Y0 + 130, { f: 'O', w: 500, s: 38, c: m >= 3 && t > t35 ? C.a3 : '#A9B6D6' });
    s += cap(L('minutes', 'минуты'), X1 - 30, Y0 + 186, { c: '#A9B6D6', s: 24 });
    if (t > t35) s += sh(D_.rr(minX(3) - 20, Y0 + 84, minX(5) - minX(3) + 40, 64, 32), C.a3, { op: .25 });
    const sx = peak + 60, sy = wy(sx), ang = Math.atan2(wy(sx + 20) - wy(sx - 20), 40) * 180 / Math.PI;
    s += g(sh(D_.rr(-150, -18, 300, 36, 18), C.a1, { c: C.ink, w: 5 }) + g(teen(t, { ...MAX, pose: 'shrug', mood: t > tp ? 'smile' : 'o', legs: 'stand' }), at(0, -10, .44)), at(sx, sy - 18, 1, ang));
    s += cap(L('craving', 'тяга'), peak, wy(peak) - 60 - 20, { c: C.paper, s: 28, op: E(t, T.a, .4) * (1 - E(t, tp + 1, .4)) });
    return g(s, drift(t, T, .03))
  };
  // ===== 19. «Две недели. Тянет всё реже» — идёт в наушниках =====
  D.q14 = (t, S, T) => {
    let s = bg('#3A6FA8') + sh(D_.rr(-20, 1140, 1120, 900, 0), '#2B4F7A') + dayPlate(L('WITHOUT · DAY 14', 'БЕЗ · ДЕНЬ 14'), t, T.a + .1, C.a3);
    for (let i = 0; i < 5; i++) { const x = ((i * 300 - (t - T.a) * 260) % 1500 + 1500) % 1500 - 200; s += sh(D_.rr(x, 640, 160, 500, 8), '#2F5A8C', { c: C.ink, w: 5 }) + sh(D_.rr(x + 30, 680, 40, 60, 4), '#FFE38A') + sh(D_.rr(x + 90, 780, 40, 60, 4), '#FFE38A') }
    const hp = line('M-78 -900C-78 -1010 78 -1010 78 -900', 1, { c: C.ink, w: 16 }) + sh(D_.rr(-100, -930, 40, 80, 16), C.a2, { c: C.ink, w: 5 }) + sh(D_.rr(60, -930, 40, 80, 16), C.a2, { c: C.ink, w: 5 });
    s += max(t, 540, 1330 - Math.abs(Math.sin(t * 8)) * 10, .78, { pose: 'pocket', hideHands: true, mood: 'smile', walk: true, headExtra: hp, look: .3 });
    for (let i = 0; i < 3; i++) { const q = ((t - T.a) * .8 + i / 3) % 1; s += g(tx('♪', 0, 0, { f: 'M', w: 800, s: 70, c: C.a1 }), at(700 + q * 120, 560 - q * 200), 1 - q) }
    s += timer(t, 540, 450, L2, L('14 DAYS', '14 ДНЕЙ'), C.a3, .6);
    return g(s, drift(t, T, .04, 540, 860))
  };
  // ===== 20. «Месяц. Макс спит до утра» =====
  D.q30 = (t, S, T) => {
    let s = room(t, true) + dayPlate(L('WITHOUT · DAY 30', 'БЕЗ · ДЕНЬ 30'), t, T.a + .1, C.a3);
    s += bed(t, 520, 1100, { mood: 'sleep', blanket: '#4B6CB7' });
    for (let i = 0; i < 3; i++) { const q = ((t - T.a) * .6 + i / 3) % 1; s += g(tx('Z', 0, 0, { f: 'U', w: 800, s: 50 + i * 12, c: C.paper }), at(330 + q * 160, 820 - q * 200), Math.sin(q * Math.PI)) }
    s += timer(t, 460, 520, L2, L('30 DAYS', '30 ДНЕЙ'), C.a3, .62);
    return g(s, drift(t, T, .05, 540, 900))
  };
  // ===== 21. «А сколько продержался бы ты?» =====
  D.end = (t, S, T) => {
    const tw0 = T.c(L('write', 'пиши')) - .1;
    let s = bg(C.bg) + spot(540, 820, 440) + motes(t, MOT, 12);
    s += max(t, 540, 1700, 1.15, { mood: 'smirk', look: 0, pose: 'stand' });
    s += pop(timer(t, 0, 0, L('YOU', 'ТЫ'), '?', C.a1, 1.3), 540, 380, t, T.a + .2, { s: 1 });
    const kc = P01(t, tw0, .5);
    if (kc > 0) {
      const dots3 = [0, 1, 2].map(i => sh(D_.circ(330 + i * 30, 0, 10), '#A9B6D6', { op: .4 + .6 * Math.max(0, Math.sin(t * 8 - i)) })).join('');
      s += g(sh(D_.rr(-420, -60, 840, 120, 60), '#FFFFFF', { c: C.ink, w: 5 }) + tx(L('Add comment…', 'Добавить комментарий…'), -360, 14, { f: 'M', w: 600, s: 38, c: '#7A849C', a: 'start' }) + dots3, at(540, 1180 + (1 - EZ.o5(kc)) * 200), clamp(kc * 2));
    }
    return g(s, drift(t, T, .05, 540, 700))
  };

  window.EP = {
    P: C, D, clean: true, lead: .2,
    init() { L1 = L('WITHOUT NICOTINE', 'БЕЗ НИКОТИНА'); L2 = L('HOLDING ON', 'ДЕРЖИТСЯ'); MON = L(['NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY'], ['НОЯ', 'ДЕК', 'ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ']) },
    tr: { hook: 'cut', hook2: 'band', d1: 'slide', cough: 'zc', brain: 'zc', d14: 'slide', t3d: 'zc', d30: 'slide', t6h: 'slide', half: 'slideU', d90: 'slide', d180: 'slide', night: 'flip', quit: 'zc', flip: 'cut', q1: 'slide', q3: 'slide', wave: 'slideU', q14: 'slide', q30: 'slide' },
    trAt: { cough: [560, 520], brain: [480, 680], t3d: [540, 640], quit: [380, 470] },
    trCol: { hook2: C.a1, cough: '#0B1630', brain: '#24365C', t3d: '#3A5A8C', quit: C.bg },
    trCol2: { hook2: C.a2 },
    cap: { hi: C.a1, st: C.ink },
  };
})();
