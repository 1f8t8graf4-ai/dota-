// Никотин — свой вариант: рассказывает сам никотин (молекула-злодей), гонка до мозга за 10 секунд с секундомером наверху.
// v5, RU, плоско и чисто: слива, малиновый, бирюза, жёлтый дофамин.
(function () {
  const C = { bg: '#1C0F2E', bg2: '#2B1747', bg3: '#3D2163', ink: '#12091F', paper: '#FFF1E6', line: '#FFF1E6', a1: '#FFD447', a2: '#FF4F8B', a3: '#3DE0D0',
    lung: '#FF9DB4', lung2: '#E8718F', blood: '#E23B5A', blood2: '#B32844', skin: '#F2C29B', mango: '#FFB238' };
  P = C;
  const D = {};
  const MOT = [C.a2, C.paper, C.a3];
  const me = (t, x, y, s, o = {}) => molecule(t, { x: x - 52 * s, y, s, f: C.a2, f2: '#D93370', c: C.ink, ...o });
  let T0 = 3.9, T10 = 14.1; // секундомер: «Засекай» → «Десять»

  // ===== поверх всего: секундомер гонки =====
  function over(t) {
    if (t < T0 - .3 || t > T10 + 1.6) return '';
    const v = clamp((t - T0) / (T10 - T0)) * 10, k = E(t, T0 - .3, .4, 'back') * (1 - E(t, T10 + 1.1, .4));
    const done = v >= 10;
    let s = sh(D_.rr(-190, -56, 380, 112, 56), C.ink, { c: done ? C.a3 : C.a1, w: 5 }) + sh(D_.circ(-128, 0, 30), 'none', { c: done ? C.a3 : C.a1, w: 6 }) + line(`M-128 0L${R(-128 + Math.sin(v * .628) * 22)} ${R(-Math.cos(v * .628) * 22)}`, 1, { c: done ? C.a3 : C.a1, w: 6 });
    s += tx(v.toFixed(1).replace('.', ',') + L(' s', ' с'), 40, 24, { f: 'O', w: 700, s: 66, c: done ? C.a3 : C.a1 });
    return g(s, at(540, 280, k))
  }

  // ===== 1. «Я — никотин. Мне нужно 10 секунд, чтобы залезть тебе в голову» =====
  D.hook = (t, S, T) => {
    const t10 = T.c('10') - .15, th = T.c(L('head', 'голову')) - .25;
    let s = bg(C.bg) + sh(D_.circ(540, 820, 440), C.bg2) + motes(t, MOT, 12);
    const kh = E(t, th, .6, 'io5');
    s += g(head({ f: C.bg3, c: C.paper, w: 6 }), at(lerp(1500, 860, kh), 900, 1.4), clamp(kh * 2));
    s += pop(me(t, 0, 0, 1, { mood: 'sly', look: kh > 0 ? .8 : 0 }), lerp(540, 380, kh), 820 + bob(t, 10, .6), t, .05, { s: lerp(3, 2.1, kh), r0: -20 });
    s += pop(pill(L('10 SEC', '10 СЕК'), 0, 0, { f: C.a1, tc: C.ink, s: 56 }), 540, 470, t, t10, { r0: 10, out: th + .3 });
    return g(s, drift(t, T, .04))
  };
  // ===== 2. «Засекай» — старт =====
  D.go = (t, S, T) => {
    let s = bg(C.bg) + sh(D_.circ(540, 820, 440), C.bg2);
    const k = P01(t, T.e - .2, .38), crouch = E(t, T.v, .3, 'o') * (1 - k);
    for (let i = 0; i < 7; i++) { const y = 560 + i * 70, x = 540 - 260 - k * 900 - i * 30; if (k > 0) s += line(`M${R(x)} ${y}h${R(-160 - i * 20)}`, 1, { c: C.paper, w: 8, op: .7 }) }
    s += g(me(t, 0, 0, 1, { mood: 'sly', rot: k * 20 }), `translate(${R(540 + EZ.i(k) * 900)} ${R(820 - k * 60 + crouch * 30)}) scale(${R((2.1 - k * .4) * (1 + crouch * .08) * 1000) / 1000} ${R((2.1 - k * .4) * (1 - crouch * .1) * 1000) / 1000})`);
    return s
  };
  // ===== 3. «Лёгкие. Сотни миллионов крошечных пузырьков. Есть где пройти» — бронхи и альвеолы, камера за молекулой =====
  const TRK = 'M540 -200C540 300 540 500 520 700C500 900 300 980 240 1180C200 1320 260 1500 360 1560';
  function lungs(t, kA) {
    let s = '';
    s += line('M540 -300V700', 1, { c: C.lung2, w: 120 }) + line('M540 -300V700', 1, { c: C.lung, w: 96 });
    s += line(TRK, 1, { c: C.lung2, w: 100 }) + line(TRK, 1, { c: C.lung, w: 78 });
    s += line('M520 700C600 900 820 980 860 1180C890 1320 820 1500 720 1560', 1, { c: C.lung2, w: 100 }) + line('M520 700C600 900 820 980 860 1180C890 1320 820 1500 720 1560', 1, { c: C.lung, w: 78 });
    for (let i = 0; i < 38; i++) {
      const cx = (i % 2 ? 360 : 720) + (rnd(i) - .5) * 360, cy = 1400 + (rnd(i + 5) - .3) * 420, k = clamp(kA * 38 - i);
      if (k > 0) s += sh(D_.circ(cx, cy, 44 * EZ.back(k)), C.lung, { c: C.lung2, w: 6 }) + sh(D_.circ(cx - 12, cy - 12, 10 * k), '#FFD3DE');
    }
    return s
  }
  D.lungs = (t, S, T) => {
    const ta = T.c(L('hundreds', 'сотни')) - .2;
    const u = E(t, T.a, T.b - T.a + .2, 'io'), kA = E(t, ta, 1.4, 'o');
    const p = pts(TRK, 160)[Math.min(159, Math.floor(u * 159))], p2 = pts(TRK, 160)[Math.min(159, Math.floor(u * 159) + 2)];
    const ang = Math.atan2(p2[1] - p[1], p2[0] - p[0]) * 180 / Math.PI - 90;
    let w = lungs(t, kA) + me(t, p[0], p[1], .55, { mood: 'happy', rot: ang * .3 });
    for (let i = 1; i < 5; i++) { const q = pts(TRK, 160)[Math.max(0, Math.floor(u * 159) - i * 3)]; w += sh(D_.circ(q[0], q[1], 12 - i * 2), C.paper, { op: .6 - i * .12 }) }
    const z = lerp(1.25, .62, E(t, ta, 1.6, 'io'));
    return bg('#3A1630') + g(w, `translate(540 ${CY}) scale(${R(z * 1000) / 1000}) translate(${R(-p[0])} ${R(-p[1] - 120 * (1 - z))})`)
  };
  // ===== 4. «Кровь. Сердце само толкает меня наверх» — сосуд, эритроциты, сердце качает =====
  D.blood = (t, S, T) => {
    const tp = T.c(L('pushes', 'толкает')) - .2, beat = 1 + .08 * Math.max(0, Math.sin((t - T.a) * 9));
    let s = bg('#2A0E1C');
    const path = 'M-100 1180C300 1180 520 1150 640 900C740 690 700 420 760 -100';
    s += line(path, 1, { c: C.blood2, w: 260 }) + line(path, 1, { c: C.blood, w: 220 });
    for (let i = 0; i < 14; i++) { const q = ((t - T.a) * .35 + i / 14) % 1, p = pts(path, 100)[Math.floor(q * 99)]; s += g(sh(D_.ell(0, 0, 34, 22), '#FF6B7E', { c: C.blood2, w: 5 }) + sh(D_.ell(0, 0, 14, 8), C.blood2), at(p[0] + (rnd(i) - .5) * 120, p[1] + (rnd(i + 3) - .5) * 60, 1, i * 30)) }
    s += g(sh(HEART2, '#E8455F', { c: C.ink, w: 7 }) + sh('M0 150C-90 100 -170 40 -160 -40C-150 20 -80 80 0 110Z', '#C23048') + `<path d="M-90 -60Q-60 -96 -20 -90" stroke="#fff" stroke-width="12" stroke-linecap="round" fill="none" opacity=".5"/>`, at(230, 900, 1.25 * beat * (1 + .12 * squash(t, tp + .1, .6) - .12)));
    const k = E(t, tp, .9, 'i'), p = pts(path, 100)[Math.floor(lerp(.15, .99, k) * 99)];
    s += me(t, p[0], p[1] - 40, .7, { mood: k > 0 ? 'happy' : 'sly', rot: -30 * k });
    if (k > 0) s += burst(300, 820, t, tp + .1, { c: C.paper, r0: 160, r1: 300 });
    return g(s, drift(t, T, .04))
  };
  // ===== 5. «Мозг. Восемь. Девять. Десять. Я на месте» — цифры крупно, приземление на мозг =====
  D.brain = (t, S, T) => {
    const W = T.S.words, tn = [1, 2, 3].map(i => (W[i] || W[W.length - 1]).a - .05);
    let s = bg(C.bg2) + sh(D_.circ(540, 900, 470), C.bg3) + motes(t, MOT, 10);
    s += pop(brainF(t, { c: C.ink, face: t > tn[2] + .4 ? { mood: 'happy' } : null }), 540, 1000, t, T.a, { s: 2.5, f: 'o5', from: .6, r0: 0 });
    for (let i = 0; i < 3; i++) { const k = P01(t, tn[i], .5); if (k > 0 && (i === 2 || t < tn[i + 1])) s += g(tx(String(8 + i), 0, 0, { f: 'O', w: 700, s: 300, c: i === 2 ? C.a1 : C.paper, st: C.ink, sw: 18 }), at(540, 640, lerp(1.6, 1, EZ.back(k))), clamp(k * 3) * (i === 2 ? 1 - E(t, tn[2] + .7, .3) : 1)) }
    const kl = E(t, tn[2] + .1, .5, 'o5');
    if (kl > 0) s += me(t, 560, lerp(200, 760, kl), .9, { mood: 'happy' }) + g(line('M0 0V-150', 1, { c: C.paper, w: 7 }) + sh('M0 -150L90 -120L0 -90Z', C.a3, { c: C.ink, w: 4 }), at(640, 760, EZ.back(clamp((kl - .7) * 3.3))));
    return g(s, drift(t, T, .04))
  };
  // ===== 6. «Тут есть замки, названные в мою честь. Никотиновые рецепторы» =====
  const lock = (x, y, s = 1, o = {}) => g(sh(D_.rr(-90, -40, 180, 200, 24), o.f || C.a1, { c: C.ink, w: 7 }) + line('M-56 -40V-90A56 56 0 0 1 56 -90V-40', 1, { c: C.ink, w: 26 }) + line('M-56 -40V-90A56 56 0 0 1 56 -90V-40', 1, { c: o.f2 || '#E0B532', w: 14 }) + sh(D_.circ(0, 40, 22), C.ink) + sh('M-10 50L-18 110H18L10 50Z', C.ink), at(x, y, s, o.r || 0), o.op ?? 1);
  D.locks = (t, S, T) => {
    const tn = T.c(L('named', 'названные')) - .2, tr = T.c(L('nicotinic', 'никотиновые')) - .2;
    let s = bg(C.bg) + sh(D_.rr(-20, 720, 1120, 1300, 0), '#4A2A70') + line('M-20 720H1100', 1, { c: C.paper, w: 6 });
    for (let i = 0; i < 4; i++) s += pop(lock(0, 0, 1), 150 + i * 260, 900, t, T.a + .1 + i * .1, { s: .9 });
    const kp = P01(t, tn, .5);
    if (kp > 0) for (let i = 0; i < 4; i++) s += g(sh(D_.rr(-100, -50, 200, 100, 14), C.paper, { c: C.ink, w: 5 }) + g(me(t, 0, 0, .32, { mood: 'sly', seed: i }), at(0, 6)), at(150 + i * 260, 640, EZ.back(clamp(kp * 2 - i * .2))));
    s += me(t, 540, 440 + bob(t, 8, .8), 1.15, { mood: 'happy', rot: Math.sin(t * 2) * 6 });
    s += pop(g(sh(D_.rr(-330, -54, 660, 108, 54), C.a2, { c: C.ink, w: 6 }) + tx(L('NICOTINIC RECEPTORS', 'НИКОТИНОВЫЕ РЕЦЕПТОРЫ'), 0, 18, { f: 'O', w: 700, s: 50, c: C.paper, ls: 2 })), 540, 1180, t, tr, { r0: 6 });
    return g(s, drift(t, T, .04))
  };
  // ===== 7. «Поворачиваю ключ — и мозг получает дофамин. Тебе хорошо. Ты думаешь, это манго» =====
  const MG2 = 'M-90 10C-100 -60 -20 -96 40 -80C100 -64 120 0 90 40C60 84 -10 90 -50 70C-76 58 -86 38 -90 10Z';
  D.dopa = (t, S, T) => {
    const tk = T.c(L('key', 'ключ')) - .3, td = T.c(L('dopamine', 'дофамин')) - .2, tg = T.c(L('good', 'хорошо')) - .2, tm = T.c(L('mango', 'манго')) - .3, tt = T.c(L('think', 'думаешь')) - .2;
    let s = bg(C.bg) + sh(D_.circ(540, 860, 450), C.bg2);
    const ph2 = t >= tt;
    if (!ph2) {
      const kt = E(t, tk, .6, 'io');
      s += lock(540, 900, 2.2) + me(t, 540, 990, .62, { mood: 'happy', rot: 90 * kt, face: true });
      const kd = P01(t, td, 1.8);
      for (let i = 0; i < 16; i++) { const q = clamp((t - td - i * .06) / .9); if (q > 0 && q < 1) { const a = (-90 + (rnd(i) - .5) * 120) * Math.PI / 180, r = 520 * EZ.o(q); s += sh(D_.drop(540 + Math.cos(a) * r, 800 + Math.sin(a) * r * .8 + q * q * 400, 34), C.a1, { c: C.ink, w: 5, op: 1 - q * .3 }) } }
      if (kd > 0) s += ringWave(540, 800, t, td, { c: C.a1, r1: 700, w: 14 });
      s += pop(brainF(t, { c: C.ink, face: { mood: 'happy' } }), 540, 450, t, tg, { s: 1.3 });
    } else {
      const km = E(t, tm, .6, 'io'), kr = E(t, tm + .25, .35, 'io');
      s += g(mango(0, 0, 1, { c: C.ink }), at(540, 860, 3 * (1 - kr * .6), -kr * 30), 1 - kr);
      if (kr > 0) s += me(t, 540, 860, 1.6 * kr, { mood: 'sly', look: 0 });
      if (km > 0 && kr <= 0) s += g(tx(L('MANGO?', 'МАНГО?'), 0, 0, { f: 'U', w: 800, s: 90, c: C.a1, st: C.ink, sw: 14 }), at(540, 420, EZ.back(km)));
    }
    return g(s, drift(t, T, .04))
  };
  // ===== 8. «Я быстро ухожу. Через два часа от меня остаётся половина» =====
  D.fade = (t, S, T) => {
    const t2 = T.c(L('two', 'два')) - .2, th = T.c(L('half', 'половина')) - .3;
    let s = bg(C.bg2) + motes(t, MOT, 8);
    s += clockF(540, 470, 150, 0, 120 * E(t, t2, 1.4, 'io') % 60 + 0, { c: C.ink, f: C.paper, arc: 359 * E(t, t2, 1.4, 'io'), ac: C.a2, hand: C.a2 });
    for (let i = 0; i < 8; i++) {
      const x = 200 + (i % 4) * 230, y = 900 + Math.floor(i / 4) * 260, gone = i % 2 === 1, kg = gone ? P01(t, th + (i >> 1) * .12, .35) : 0;
      if (kg < 1) s += me(t, x, y + bob(t, 6, .7, i * .2), .62 * (1 - kg * .6), { mood: gone && kg > 0 ? 'o' : 'sly', seed: i, op: 1 - kg });
      if (kg > 0 && kg < 1) s += g(cloud(0, 0, 1, { f: C.paper, c: C.ink, w: 8 }), at(x, y, .3 + kg * .3), 1 - kg);
    }
    s += pop(tx('½', 0, 0, { f: 'O', w: 700, s: 170, c: C.a1, st: C.ink, sw: 14 }), 840, 470, t, th + .4, { s: 1 });
    return g(s, drift(t, T, .04))
  };
  // ===== 9. «А мозг уже привык. И зовёт меня сам» — входящий звонок «Никотин» =====
  D.call = (t, S, T) => {
    const tc = T.c(L('calls', 'зовёт')) - .3;
    let s = bg(C.bg) + sh(D_.circ(540, 860, 440), C.bg2);
    const rg = t > tc ? Math.sin(t * 50) * 6 * (Math.floor((t - tc) * 2) % 2 ? 0 : 1) : 0;
    const scr = sh(D_.rr(-170, -360, 340, 720, 0), '#2A1A44') + g(sh(D_.circ(0, 0, 90), C.a2, { c: C.paper, w: 6 }) + me(t, 0, 0, .5, { mood: 'sly' }), at(0, -150)) + tx(L('NICOTINE', 'НИКОТИН'), 0, 20, { f: 'U', w: 800, s: 46, c: C.paper }) + tx(L('incoming…', 'входящий…'), 0, 70, { f: 'M', w: 600, s: 30, c: '#B9A8D8' }) + sh(D_.circ(-90, 240, 50), '#E2574C') + sh(D_.circ(90, 240, 50), '#3DDC84') + line('M70 230L90 250L112 222', 1, { c: '#fff', w: 8 });
    s += g(sh(D_.rr(-190, -380, 380, 760, 50), '#151023', { c: C.ink, w: 8 }) + clip(D_.rr(-170, -360, 340, 720, 34), scr), at(540 + rg, 860, 1));
    if (t > tc) for (let i = 0; i < 3; i++) s += ringWave(540, 860, t, tc + i * .5, { c: C.a3, r0: 300, r1: 600, d: 1 });
    s += pop(brainF(t, { c: C.ink, face: { mood: 'want' } }), 820, 1180, t, T.a + .2, { s: .9 });
    return g(s, drift(t, T, .04))
  };
  // ===== 10. «Ты затягиваешься. Я прихожу. Ухожу. Ты затягиваешься снова» — петля =====
  D.loop = (t, S, T) => {
    const tw = [L('puff', 'затягиваешься'), L('come', 'прихожу'), L('leave', 'ухожу')].map(w => T.c(w) - .2); tw.push(T.c(L('puff', 'затягиваешься'), 1) - .2);
    let s = bg(C.bg2) + motes(t, MOT, 8);
    const R0 = 300, cx = 540, cyy = 860;
    s += line(D_.circ(cx, cyy, R0), 1, { c: C.bg3, w: 26 });
    let cur = 0; for (let i = 0; i < 4; i++) if (t >= tw[i]) cur = i;
    const ang = lerp(-90 + Math.max(0, cur - 1) * 120, -90 + cur * 120, E(t, tw[cur], .6, 'io5'));
    s += line(D_.arc(cx, cyy, R0, -90, ang), 1, { c: C.a1, w: 26 });
    const icons = [g(vape(t, { c: C.ink }), at(0, 0, .28)), me(t, 0, 0, .55, { mood: 'happy' }), g(me(t, 0, 0, .55, { mood: 'tiny' }), '', .4), brainF(t, { c: C.ink, face: { mood: 'want' }, s: .5 })];
    for (let i = 0; i < 3; i++) { const a = (-90 + i * 120) * Math.PI / 180, on = (cur % 3) === i; s += g(sh(D_.circ(0, 0, 110), on ? C.a1 : C.bg3, { c: C.paper, w: 6 }) + icons[i], at(cx + Math.cos(a) * R0, cyy + Math.sin(a) * R0, on ? 1.12 : .9)) }
    s += g(brainF(t, { c: C.ink, face: { mood: 'want' } }), at(cx, cyy, .8));
    return g(s, drift(t, T, .03))
  };
  // ===== 11. «Мне даже просить не надо. Ты сам носишь меня в кармане» — лежак в окошке одноразки =====
  D.pocket = (t, S, T) => {
    const tp = T.c(L('pocket', 'кармане')) - .3;
    let s = bg('#33507F') + dots(D_.rr(0, 0, 1080, 1920, 0), { c: '#29436C', step: 20, r: 7, x0: 0, y0: 0, x1: 900, y1: 1600, op: .5 });
    const ky = E(t, T.a, .7, 'o5');
    s += g(vape(t, { c: C.ink, label: false, fruit: false }), at(540, lerp(1500, 860, ky), 2.2));
    s += g(sh('M-60 40L60 40L40 0H-40Z', '#3DE0D0', { c: C.ink, w: 4 }) + me(t, 0, -40, .3, { mood: 'happy', blink: 1 }) + sh(D_.rr(-34, -54, 30, 14, 6), C.ink) + sh(D_.rr(4, -54, 30, 14, 6), C.ink), at(540, lerp(1500, 860, ky) - 40, 1.5));
    const kj = E(t, tp, .6, 'io5');
    s += sh(`M140 ${R(lerp(2000, 1180, kj))}C140 ${R(lerp(2000, 1180, kj) + 400)} 300 ${R(lerp(2000, 1180, kj) + 600)} 540 ${R(lerp(2000, 1180, kj) + 640)}C780 ${R(lerp(2000, 1180, kj) + 600)} 940 ${R(lerp(2000, 1180, kj) + 400)} 940 ${R(lerp(2000, 1180, kj))}Z`, '#26406A') + line(`M140 ${R(lerp(2000, 1180, kj))}H940`, 1, { c: C.a1, w: 6, da: '18 14' });
    return g(s, drift(t, T, .03))
  };
  // ===== 12. «Решишь меня бросить — первые три дня я буду кричать громче всего» =====
  D.quit = (t, S, T) => {
    const ts = T.c(L('scream', 'кричать')) - .25, t3 = T.c(L('three', 'три')) - .2;
    let s = bg('#3A0F24') + sh(D_.circ(540, 860, 460), '#4E1530');
    const ks = P01(t, ts, .3);
    for (let i = 0; i < 4; i++) if (ks > 0) s += ringWave(540, 900, t, ts + i * .35, { c: C.a2, r0: 300, r1: 760, d: 1.1, w: 14 });
    s += g(me(t, 0, 0, 1, { mood: ks > 0 ? 'shout' : 'sly' }), at(540 + shake(t, ts, 20, 1.6, 60), 900, 2.3 * (1 + .1 * Math.sin(t * 30) * (ks > 0 ? 1 : 0))));
    s += pop(calPage(0, 0, L('DAYS', 'ДНИ'), '1–3', { s: .8, f: C.paper, c: C.ink, bs: 110 }), 830, 470, t, t3, { r: 8 });
    return g(s, drift(t, T, .03))
  };
  // ===== 13. «Но каждая тяга длится минуты три-пять. Потом я затихаю» =====
  D.wave = (t, S, T) => {
    const t35 = T.c(L('three', 'три')) - .2, tq = T.c(L('quiet', 'затихаю')) - .3;
    let s = bg(C.bg2) + motes(t, MOT, 8);
    const X0 = 140, X1 = 940, AY = 1100, mx = m => X0 + (X1 - X0) * m / 6, amp = 480 * E(t, T.a, .8, 'io') * (1 - .9 * E(t, tq - .4, 1.2, 'io'));
    const wy = x => AY - amp * Math.exp(-Math.pow((x - mx(2)) / 200, 2));
    let d = `M${X0} ${AY}`; for (let x = X0; x <= X1; x += 10) d += `L${x} ${R(wy(x))}`; d += `L${X1} ${AY}Z`;
    s += sh(d, C.a2, { c: C.ink, w: 6 }) + line(`M${X0 - 20} ${AY}H${X1 + 30}`, 1, { c: C.paper, w: 6 });
    for (let m = 0; m <= 6; m++) s += tx(String(m), mx(m), AY + 60, { f: 'O', w: 500, s: 40, c: m >= 3 && m <= 5 && t > t35 ? C.a1 : '#B9A8D8' });
    s += cap(L('minutes', 'минуты'), X1 - 30, AY + 116, { c: '#B9A8D8', s: 24 });
    const q = E(t, tq - .4, 1.2, 'io');
    s += me(t, mx(2), wy(mx(2)) - 90, lerp(1, .5, q), { mood: q > .5 ? 'tiny' : 'shout' });
    return g(s, drift(t, T, .03))
  };
  // ===== 14. «Через месяц меня почти не слышно» =====
  D.month = (t, S, T) => {
    let s = bg('#E9E1F4') + corner('#DCD0EC', 1);
    s += pop(calPage(0, 0, L('DAY', 'ДЕНЬ'), '30', { s: 1.4, f: '#FFFFFF', c: C.ink, hf: C.a3, bs: 170 }), 540, 760, t, T.a + .1, { s: 1 });
    s += me(t, 800, 1150, .45, { mood: 'tiny', op: .6, f: '#C9B8E0', f2: '#A897C4', c: '#6B5A88' });
    for (let i = 0; i < 3; i++) s += sh(D_.circ(880 + i * 26, 1080 - i * 10, 6), '#8E7DAA', { op: Math.max(0, Math.sin(t * 4 - i)) });
    return g(s, drift(t, T, .04))
  };
  // ===== 15. «Сколько раз ты позвал меня сегодня?» =====
  D.end = (t, S, T) => {
    const tt = T.c(L('today', 'сегодня')) - .3;
    let s = bg(C.bg) + sh(D_.circ(540, 820, 440), C.bg2) + motes(t, MOT, 12);
    s += me(t, 540, 760 + bob(t, 8, .5), 2.2, { mood: 'sly', look: 0 });
    const k = P01(t, tt, .5);
    if (k > 0) { let tl = ''; for (let i = 0; i < 5; i++) { const kk = clamp((t - tt) * 6 - i); if (kk > 0) tl += i < 4 ? line(`M${-90 + i * 40} -60V60`, kk, { c: C.paper, w: 12 }) : line('M-110 50L80 -50', kk, { c: C.a2, w: 12 }) } s += g(sh(D_.rr(-260, -100, 520, 200, 30), C.ink, { c: C.a1, w: 5 }) + g(tl, 'translate(-60 0)') + tx('+ ?', 170, 26, { f: 'U', w: 800, s: 64, c: C.a1 }), at(540, 1180, EZ.back(k))) }
    return g(s, drift(t, T, .04))
  };

  window.EP = {
    P: C, D, clean: true, lead: .2, over,
    init(tl, SC) { const go = SC.find(s => s.key === 'go'), br = SC.find(s => s.key === 'brain'); if (go) T0 = go.sents[0].words[0].a; if (br) T10 = (br.sents[0].words[3] || br.sents[0].words[0]).a },
    tr: { hook: 'cut', go: 'zc', lungs: 'zc', blood: 'out', brain: 'zc', locks: 'slideU', dopa: 'slide', fade: 'slide', call: 'zc', loop: 'slide', pocket: 'band', quit: 'slide', wave: 'slide', month: 'zc' },
    trAt: { go: [1300, 760], lungs: [540, 1400], blood: [700, 300], brain: [560, 760], call: [540, 860], month: [540, 760] },
    trCol: { go: '#3A1630', lungs: '#2A0E1C', blood: C.paper, brain: C.bg, call: C.bg2, pocket: C.a2, month: C.bg },
    trCol2: { pocket: C.a1 },
    cap: { hi: C.a1, st: C.ink },
  };
})();
