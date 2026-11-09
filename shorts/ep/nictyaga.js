// Никотин — смесь: крючок и механика вирусных роликов («не закрывай», таймер тяги наверху, пересмотри 3 раза)
// + «А знаешь ли ты» и плоская рисовка как у «Знакомьтесь, Боб» (палитра Coca-Cola: коралл, синий, крем). v5, RU.
(function () {
  const C = { bg: '#141B3D', bg2: '#24346B', bg3: '#33488C', ink: '#101634', paper: '#F4EEE3', paper2: '#E9DFCD', line: '#F4EEE3', a1: '#F2C33D', a2: '#E4525C', a3: '#5BA6A0', a4: '#8FD3C9', leaf: '#5E9E5A', leaf2: '#3F7A45', skin: '#EBB993', water: '#7FC6F2', mango: '#FFB238' };
  P = C;
  const D = {};
  const MOT = [C.a1, C.paper, C.a3];
  // номер шага в кружке + подпись
  const step = (n, label, t, t0, col = C.a2) => pop(sh(D_.circ(0, 0, 70), col, { c: C.ink, w: 6 }) + tx(String(n), 0, 30, { f: 'U', w: 800, s: 84, c: C.paper }), 250, 470, t, t0, { s: 1 }) + g(rise(label, 350, 498, t, t0 + .12, { f: 'U', w: 800, s: 78, c: C.paper, a: 'start' }), '');
  const stepD = (n, label, t, t0, col = C.a2) => pop(sh(D_.circ(0, 0, 70), col, { c: C.paper, w: 6 }) + tx(String(n), 0, 30, { f: 'U', w: 800, s: 84, c: C.paper }), 250, 470, t, t0, { s: 1 }) + rise(label, 350, 498, t, t0 + .12, { f: 'U', w: 800, s: 78, c: C.ink, a: 'start' });
  // рука-«варежка» (запястье в 0,0, пальцы вправо)
  const hand2 = (o = {}) => g(sh(D_.rr(-220, -54, 200, 108, 34), o.sleeve || C.bg3, { c: C.ink, w: 6 }) + sh(D_.rr(-40, -50, 150, 100, 44), C.skin, { c: C.ink, w: 6 }) + sh('M0 -44C10 -96 66 -104 72 -70C74 -54 52 -46 36 -40Z', C.skin, { c: C.ink, w: 6 }) + line('M104 -20L74 -20M104 6L76 6M100 30L74 30', 1, { c: C.ink, w: 5, op: .6 }), at(o.x || 0, o.y || 0, o.s || 1, o.r || 0) + (o.flip ? ' scale(1 -1)' : ''));

  // ===== поверх всего: таймер тяги сверху (идёт с первого кадра) и «просмотр 1 из 3» =====
  function over(t) {
    const left = Math.max(0, 180 - t), mm = Math.floor(left / 60), ss = Math.floor(left % 60);
    const k = E(t, .05, .4, 'back'), y = lerp(150, 262, k);
    let s = sh(D_.rr(-300, -50, 600, 100, 50), C.ink, { c: C.a1, w: 5, op: .96 }) + cap(L('craving passes in', 'тяга пройдёт через'), -60, 11, { c: '#C9D0EE', s: 27, ls: 3 });
    s += tx(`${mm}:${String(ss).padStart(2, '0')}`, 220, 22, { f: 'O', w: 700, s: 64, c: C.a1 });
    const pr = clamp(t / (TL ? TL.dur : 60));
    let v = '';
    for (let i = 0; i < 3; i++) { const x = -60 + i * 60, f = i === 0 ? pr : 0; v += sh(D_.circ(x, 86, 16), C.ink, { c: C.a1, w: 3 }) + (f > 0 ? sh(`M${x} 86L${x} 70A16 16 0 ${f > .5 ? 1 : 0} 1 ${R(x + Math.sin(f * 6.283) * 16)} ${R(86 - Math.cos(f * 6.283) * 16)}Z`, C.a1) : '') }
    s += g(v, '', E(t, 7.7, .4));
    return g(s, at(540, y, 1), clamp(k * 3))
  }

  // ===== 1. «Хочешь затянуться прямо сейчас? Тогда не закрывай» =====
  D.hook = (t, S, T) => {
    const tn = T.c(L("don't", 'не')) - .15;
    let s = bg(C.paper) + sh(D_.circ(540, 900, 380), C.paper2) + corner(C.paper2, 1, 1080, 0, 0, 900);
    const reach = E(t, .1, 1.3, 'io');
    s += g(vape(t, { c: C.ink }), at(560, 900 + bob(t, 6, .7), 1.25, -8));
    s += hand2({ x: lerp(-300, 330, reach), y: 1060, s: 1.6, r: -20 });
    const ks = P01(t, tn, .4);
    if (ks > 0) {
      s += g(sh(D_.rr(-440, -100, 880, 200, 40), C.a2, { c: C.ink, w: 8 }) + tx(L("DON'T CLOSE", 'НЕ ЗАКРЫВАЙ'), 0, 28, { f: 'U', w: 800, s: 76, c: C.paper }), at(540 + shake(t, tn + .3, 14), 640, lerp(1.9, 1, EZ.back(ks)), -6), clamp(ks * 3));
    }
    return g(s, drift(t, T, .05))
  };

  // ===== 2. «Тяга проходит за 3–5 минут. Этот ролик идёт минуту» — волна на шкале минут =====
  const X0 = 140, X1 = 940, AY = 1080, mx = m => X0 + (X1 - X0) * m / 6;
  function waveChart(t, amp, peak, o = {}) {
    const wy = x => AY - amp * Math.exp(-Math.pow((x - peak) / (o.wid || 190), 2));
    let d = `M${X0} ${AY}`; for (let x = X0; x <= X1; x += 10) d += `L${x} ${R(wy(x))}`; d += `L${X1} ${AY}Z`;
    let s = sh(d, o.f || C.a2, { c: C.ink, w: 6 }) + line(`M${X0 - 20} ${AY}H${X1 + 30}`, 1, { c: C.paper, w: 6 });
    for (let m = 0; m <= 6; m++) s += tx(String(m), mx(m), AY + 60, { f: 'O', w: 500, s: 40, c: o.hl && m >= 3 && m <= 5 ? C.a1 : '#B9C2E6' });
    s += cap(L('minutes', 'минуты'), X1 - 30, AY + 116, { c: '#B9C2E6', s: 24 });
    return s
  }
  D.rule = (t, S, T) => {
    const t35 = T.c('3–5') - .15, tv = T.c(L('video', 'ролик')) - .2;
    let s = bg(C.bg) + motes(t, MOT, 10);
    const amp = 520 * E(t, T.a, 1.2, 'io') * (1 - .85 * E(t, t35 + .3, 1.4, 'io'));
    s += waveChart(t, amp, lerp(mx(1.5), mx(3.4), E(t, t35, 1.5, 'io')), { hl: t > t35 });
    if (t > t35) s += sh(D_.rr(mx(3) - 26, AY + 14, mx(5) - mx(3) + 52, 64, 32), C.a1, { op: .22 * E(t, t35, .3) });
    s += cap(L('craving', 'тяга'), mx(1.5), AY - 560, { c: C.paper, s: 30, op: E(t, T.a + .3, .3) * (1 - E(t, t35 + .4, .3)) });
    const kv = E(t, tv, .45, 'o5');
    if (kv > 0) s += line(`M${mx(0)} ${AY - 120}V${AY - 160}H${mx(1)}V${AY - 120}`, kv, { c: C.a1, w: 8 }) + pop(pill(L('THIS VIDEO · 1 MIN', 'ЭТОТ РОЛИК · 1 МИН'), 0, 0, { f: C.a1, tc: C.ink, s: 36 }), mx(1.2) + 120, AY - 230, t, tv + .2, { r0: 6 });
    return g(s, drift(t, T, .03))
  };

  // ===== 3. «Посмотри его три раза. Таймер наверху» =====
  D.three = (t, S, T) => {
    const t3 = T.c(L('three', 'три')) - .2, tt = T.c(L('timer', 'таймер')) - .15;
    let s = bg(C.bg2) + motes(t, MOT, 10) + corner(C.bg3, .6);
    for (let i = 0; i < 3; i++) s += pop(g(sh(D_.circ(0, 0, 120), C.a2, { c: C.paper, w: 7 }) + sh('M-36 -56L60 0L-36 56Z', C.paper)), 230 + i * 310, 820, t, t3 + i * .12, { s: 1, r0: 20 });
    s += pop(tx('×3', 0, 0, { f: 'U', w: 800, s: 110, c: C.a1 }), 540, 1110, t, t3 + .45, { s: 1 });
    const ka = P01(t, tt, .4);
    if (ka > 0) { const yy = 520 + Math.sin((t - tt) * 9) * 18; s += g(sh('M-50 60L0 -10L50 60H22V150H-22V60Z', C.a1, { c: C.ink, w: 6 }), at(540, yy - 60, EZ.back(ka))) }
    return g(s, drift(t, T, .03))
  };

  // ===== 4. «Поехали» — три огонька старта =====
  D.go = (t, S, T) => {
    let s = bg(C.bg) + motes(t, MOT, 10);
    s += sh(D_.rr(240, 640, 600, 240, 120), C.ink, { c: C.paper, w: 7 });
    for (let i = 0; i < 3; i++) { const on = t > T.v - .5 + i * .3; s += sh(D_.circ(360 + i * 180, 760, 70), on ? (i < 2 ? C.a2 : C.a3) : '#2A3366', { c: C.paper, w: 5 }) }
    s += ringWave(540, 760, t, T.v + .1, { c: C.a3, r1: 600 });
    return g(s, drift(t, T, .05))
  };

  // ===== 5. «Первое: отложи. Скажи себе: через пять минут» =====
  D.delay = (t, S, T) => {
    const t5 = T.c(L('five', 'пять')) - .2;
    let s = bg(C.paper) + corner(C.paper2, 1, 1080, 0, 0, 900);
    s += stepD(1, L('DELAY', 'ОТЛОЖИ'), t, T.a + .1);
    const kd = E(t, T.a + .3, .7, 'io5');
    s += line('M140 1150H940', 1, { c: C.ink, w: 7 });
    s += g(vape(t, { c: C.ink }), at(lerp(560, 330, kd), lerp(700, 1150 - 286, kd), lerp(1, 1.3, kd), lerp(-20, 0, kd)));
    s += clockF(760, 860, 190, 0, 0, { c: C.ink, f: '#FFFFFF', arc: 30 * E(t, t5, 1.6, 'io'), ac: C.a2, hand: C.a2 });
    s += pop(pill(L('+5 MIN', '+5 МИН'), 0, 0, { f: C.a2, s: 44 }), 760, 600, t, t5 + .2, { r0: 10 });
    return g(s, drift(t, T, .04))
  };

  // ===== 6. «Второе: займи руки. Телефон уже в руках. Отлично» — в телефоне этот же ролик =====
  D.hands = (t, S, T) => {
    const tp = T.c(L('phone', 'телефон')) - .2, tg = T.c(L('great', 'отлично')) - .1;
    let s = bg(C.bg2) + motes(t, MOT, 8);
    s += step(2, L('HANDS', 'ЗАЙМИ РУКИ'), t, T.a + .1, C.a3);
    const kp = E(t, tp - .3, .7, 'o5');
    const ph = g(sh(D_.rr(-190, -380, 380, 760, 50), '#1B2035', { c: C.ink, w: 8 }) + clip(D_.rr(-166, -354, 332, 708, 34), sh(D_.rr(-170, -360, 340, 720, 0), C.paper) + g(vape(t, { c: C.ink }), at(0, 40, .55)) + g(sh(D_.rr(-140, -30, 280, 60, 30), C.ink) + tx('2:4' + (Math.floor(t) % 10), 70, 18, { f: 'O', w: 700, s: 40, c: C.a1 }), at(0, -270)) + g(sh(D_.rr(-150, -40, 300, 80, 20), C.a2) + tx(L("DON'T CLOSE", 'НЕ ЗАКРЫВАЙ'), 0, 14, { f: 'U', w: 800, s: 34, c: C.paper }), at(0, 260, 1, -4))) + sh(D_.rr(-40, -362, 80, 16, 8), '#3A4160'), '');
    s += g(ph + hand2({ x: -300, y: 260, s: 1.2, r: -40 }) + hand2({ x: 300, y: 260, s: 1.2, r: 220, flip: true }), at(540, lerp(1600, 940, kp), 1, lerp(10, -3, kp)));
    const ks = P01(t, tg, .45);
    if (ks > 0) s += g(sh(D_.star(0, 0, 120, 52), C.a1, { c: C.ink, w: 7 }) + tx('5+', 0, 20, { f: 'U', w: 800, s: 54, c: C.ink }), at(800, 640, EZ.back(ks), lerp(-60, 12, EZ.o(ks))));
    return g(s, drift(t, T, .03))
  };

  // ===== 7. «Третье: дыши» — круг растёт на вдохе и сжимается на выдохе, счёт по секундам =====
  D.breath = (t, S, T) => {
    const tin = T.s(1), tout = T.s(2);
    let s = bg('#173E47') + motes(t, [C.a4, C.paper], 10);
    s += step(3, L('BREATHE', 'ДЫШИ'), t, T.a + .1, C.a3);
    const kin = E(t, tin, 4.4, 'io'), kout = E(t, tout, 4.4, 'io'), r = 150 + 220 * (kin - kout);
    s += sh(D_.circ(540, 900, r + 60), C.a3, { op: .25 }) + sh(D_.circ(540, 900, r), C.a4, { c: C.paper, w: 8 });
    const lab = t < tin ? '' : t < tout ? L('IN', 'ВДОХ') : L('OUT', 'ВЫДОХ');
    s += tx(lab, 540, 870, { f: 'U', w: 800, s: 70, c: C.ink });
    const W = T.S.words, cnt = W.filter(w => /^(раз|два|три|четыре|one|two|three|four)/i.test(w.d) && t >= w.a - .05).length, n = cnt > 4 ? cnt - 4 : cnt;
    if (n > 0) s += g(tx(String(n), 540, 990, { f: 'O', w: 700, s: 110, c: C.ink }), '', 1);
    for (let i = 0; i < 4; i++) s += sh(D_.circ(450 + i * 60, 1260, 14), i < n ? C.a1 : '#2E6670', { c: C.paper, w: 3 });
    return s
  };

  // ===== 8. «Четвёртое: вода. Маленькими глотками» — уровень воды опускается по глотку =====
  D.water = (t, S, T) => {
    const ts = T.c(L('sips', 'глотками')) - .2;
    let s = bg(C.paper) + corner(C.paper2, 1, 1080, 0, 0, 900);
    s += stepD(4, L('WATER', 'ВОДА'), t, T.a + .1, C.a3);
    const sips = [0, 1, 2, 3].reduce((a, i) => a + E(t, ts + i * .75, .35, 'io'), 0), lv = .86 - sips * .12;
    const gl = 'M-170 -300L-140 300H140L170 -300Z', ly = -300 + 600 * (1 - lv);
    s += g(clip(gl, sh(D_.rr(-300, ly, 600, 700, 0), C.water) + sh(D_.wave(-300, 300, ly, 10, 120, t * 3, 8) + `L300 ${ly + 30}L-300 ${ly + 30}Z`, C.water) + [...Array(6)].map((_, i) => { const q = (t * .5 + rnd(i)) % 1; return sh(D_.circ(-90 + rnd(i + 3) * 180, 290 - q * (590 - 600 * (1 - lv)), 9), '#FFFFFF', { op: .7 * (1 - q) }) }).join('')) + line(gl, 1, { c: C.ink, w: 8 }) + `<path d="M-120 -250L-96 240" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".5"/>`, at(540, 920));
    return g(s, drift(t, T, .04))
  };

  // ===== 9. «А пока пьёшь. А знаешь ли ты, что табак придумал никотин, чтобы убивать жуков?» — как у «Боба» =====
  D.fact = (t, S, T) => {
    const tk = T.c(L('know', 'знаешь')) - .3, tl = T.c(L('tobacco', 'табак')) - .2, tb = T.c(L('bugs', 'жуков')) - .25;
    let s = bg(C.bg) + motes(t, MOT, 10);
    const kb = E(t, tk, .45, 'o5');
    s += sh(D_.rr(lerp(-1100, 0, kb), 420, 1080, 180, 0), C.a2);
    if (kb > 0) { const str = L('DID YOU KNOW', 'А ЗНАЕШЬ ЛИ ТЫ'), n = Math.floor(clamp((t - tk - .1) / .5) * str.length); s += cap(str.slice(0, n), 540, 526, { c: C.paper, s: 46, ls: 10 }) }
    const kl = E(t, tl, .8, 'o5');
    s += g(leafT({ len: 820, w: 290, k: kl, c: C.paper, vc: C.paper }), at(540, 1300, kl, 0));
    if (P01(t, tb, .1) > 0) s += beetle(t, { x: lerp(1300, 700, E(t, tb, .7, 'o5')), y: 820, s: 1.1, walk: true, c: C.ink, flipX: true, r: -20 });
    return g(s, drift(t, T, .04))
  };

  // ===== 10. «Жук откусил лист — и замер. Ты затянулся — и мозг просит ещё» — экран пополам =====
  D.bug = (t, S, T) => {
    const tz = T.c(L('froze', 'замер')) - .15, tp = T.c(L('puffed', 'затянулся')) - .15, tm = T.c(L('more', 'ещё')) - .15;
    let s = bg(C.bg2) + sh(D_.rr(0, 0, 1080, 760, 0), '#2E5E46') + line('M0 760H1080', 1, { c: C.paper, w: 6 });
    // верх: жук на листе
    s += g(sh('M-100 640Q540 600 1180 650V760H-100Z', C.leaf) + line('M-100 640Q540 600 1180 650', 1, { c: C.ink, w: 6 }), '');
    const fz = P01(t, tz, .25);
    s += beetle(t, { x: lerp(-200, 420, E(t, T.a, tz - T.a, 'o')), y: 640, s: 1.2, walk: fz <= 0, chomp: fz <= 0 && t > tz - .5 ? Math.abs(Math.sin(t * 12)) : 0, stiff: fz, f: fz > 0 ? '#7E9A8D' : '#2E7D5B', c: C.ink });
    if (fz > 0) s += pop(g(sh(D_.rr(-34, -40, 24, 80, 8), C.paper) + sh(D_.rr(10, -40, 24, 80, 8), C.paper)), 700, 480, t, tz, { s: 1 });
    // низ: затяжка → мозг «ещё»
    const kp = P01(t, tp, .6);
    s += g(vape(t, { c: C.ink }), at(280, 1130, .75, -10));
    if (kp > 0 && kp < 1) s += g(cloud(0, 0, 1, { c: C.ink, w: 8 }), at(400 + kp * 160, 1000 - kp * 60, .35 + kp * .4), 1 - kp);
    s += pop(brainF(t, { c: C.ink, face: { mood: t > tm ? 'want' : 'happy' } }), 760, 1080, t, tp, { s: 1.2 });
    s += pop(bubble(L('MORE!', 'ЕЩЁ!'), 0, 0, { s: 56, c: C.ink }), 830, 880, t, tm, { r: -6 });
    return g(s, drift(t, T, .03, 540, 760))
  };

  // ===== 11. «Тяга может прийти уже через полчаса после последней затяжки» =====
  D.thirty = (t, S, T) => {
    const th = T.c(L('half', 'полчаса')) - .2;
    let s = bg(C.paper) + corner(C.paper2, 1);
    const k = E(t, T.a + .3, th - T.a + .2, 'io');
    s += clockF(540, 820, 300, 0, k * 30, { c: C.ink, f: '#FFFFFF', arc: k * 180 * .999, ac: C.a2, hand: C.a2 });
    s += pop(g(sh(D_.circ(0, 0, 70), C.ink) + g(vape(t, { c: C.ink, label: false, fruit: false }), at(0, 0, .2, 15))), 540, 470, t, T.a + .2, { s: 1 });
    s += pop(pill(L('30 MIN', '30 МИН'), 0, 0, { f: C.a2, s: 50 }), 540, 1240, t, th, { r0: 8 });
    s += pop(g(sh(D_.wave(-80, 80, 0, 26, 80, t * 4, 8), 'none', { c: C.a2, w: 12 })), 540, 1135, t, th + .2, { s: 1 });
    return g(s, drift(t, T, .04))
  };

  // ===== 12. «Тяжелее всего первые три дня. Потом каждая волна ниже» =====
  D.days = (t, S, T) => {
    const t3 = T.c(L('three', 'три')) - .2, tl = T.c(L('lower', 'ниже')) - .3;
    let s = bg(C.bg) + motes(t, MOT, 8);
    const days = [1, 2, 3, 5, 7, 14, 30], H0 = [500, 540, 560, 360, 260, 160, 90];
    for (let i = 0; i < days.length; i++) {
      const x = 150 + i * 130, k = E(t, i < 3 ? T.a + .2 + i * .15 : tl - .2 + (i - 3) * .15, .5, 'back'), h = H0[i] * k;
      s += sh(`M${x - 56} 1060Q${x} ${R(1060 - h * 2)} ${x + 56} 1060Z`, i < 3 ? C.a2 : C.a3, { c: C.paper, w: 5, op: k > 0 ? 1 : 0 });
      s += tx(String(days[i]), x, 1124, { f: 'O', w: 500, s: 40, c: i < 3 && t > t3 ? C.a1 : '#B9C2E6' });
    }
    s += line('M80 1060H1000', 1, { c: C.paper, w: 6 }) + cap(L('days without', 'дни без никотина'), 540, 1190, { c: '#B9C2E6', s: 26 });
    if (t > t3) s += sh(D_.rr(86, 1084, 360, 60, 30), C.a1, { op: .2 });
    return g(s, drift(t, T, .03))
  };

  // ===== 13. «Прошла почти минута. Тяга ещё здесь?» — таймер крупно, кнопки =====
  D.check = (t, S, T) => {
    const tq = T.c(L('still', 'ещё')) - .25;
    let s = bg(C.bg2) + motes(t, MOT, 10) + corner(C.bg3, .6);
    const left = Math.max(0, 180 - t), str = `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, '0')}`;
    s += pop(tx(str, 0, 0, { f: 'O', w: 700, s: 260, c: C.a1 }), 540, 780, t, T.a + .1, { s: 1 });
    s += pop(g(sh(D_.rr(-200, -60, 400, 120, 60), C.a2, { c: C.ink, w: 6 }) + tx(L('STILL HERE', 'ЕЩЁ ТУТ'), 0, 18, { f: 'U', w: 800, s: 44, c: C.paper })), 300, 1080, t, tq, { r0: -8 });
    s += pop(g(sh(D_.rr(-200, -60, 400, 120, 60), C.a3, { c: C.ink, w: 6 }) + tx(L('GONE', 'ОТПУСТИЛО'), 0, 18, { f: 'U', w: 800, s: 44, c: C.paper })), 780, 1080, t, tq + .15, { r0: 8 });
    return g(s, drift(t, T, .04))
  };

  // ===== 14. «Тогда смотри ещё раз. И напиши, на каком просмотре отпустило» =====
  D.again = (t, S, T) => {
    const tw0 = T.c(L('write', 'напиши')) - .15;
    let s = bg(C.bg) + motes(t, MOT, 12);
    const ka = E(t, T.a, .5, 'back');
    s += g(line(D_.arc(0, 0, 200, -60, 250), 1, { c: C.a1, w: 34 }) + sh('M120 -230L230 -150L100 -90Z', C.a1), at(540, 700, ka, (t - T.a) * -160));
    s += tx('×2', 540, 735, { f: 'U', w: 800, s: 100, c: C.paper, op: ka });
    const kc = P01(t, tw0, .5);
    if (kc > 0) s += g(sh(D_.rr(-420, -60, 840, 120, 60), '#FFFFFF', { c: C.ink, w: 5 }) + tx(L('On the 2nd…', 'На втором…'), -360, 14, { f: 'M', w: 700, s: 40, c: '#5A6385', a: 'start' }) + sh(D_.rr(-140 + Math.floor(t * 2) % 2 * 4000, -26, 6, 52, 3), C.ink), at(540, 1140 + (1 - EZ.o5(kc)) * 200), clamp(kc * 2));
    return g(s, drift(t, T, .04))
  };

  window.EP = {
    P: C, D, clean: true, lead: .2, over,
    tr: { hook: 'band', rule: 'slide', three: 'zc', go: 'zc', delay: 'slide', hands: 'slideU', breath: 'zc', water: 'band', fact: 'slide', bug: 'slideU', thirty: 'zc', days: 'slide', check: 'zc' },
    trAt: { three: [540, 820], go: [540, 760], breath: [540, 900], thirty: [540, 820], check: [540, 780] },
    trCol: { hook: C.a2, three: C.bg, go: C.paper, breath: C.paper, water: C.a2, thirty: C.bg, check: C.bg },
    trCol2: { hook: C.a1, water: C.a1 },
    cap: { hi: C.a1, st: C.ink },
  };
})();
