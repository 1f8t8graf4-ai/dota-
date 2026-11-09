// Никотин v8 · «Что вы знаете о…» с нуля — история, немного шизы. Палитра «вино»: бордо/пергамент + золото, красный — «опасно».
//   Сюжет: в Лондоне никотином откачивали утопленников (дымовые клизмы, наборы у Темзы) → Броди: никотин — яд → Нико, 1560 →
//   Яков I: трактат и налог ×40 → в России рвали ноздри → Пётр разрешил и продал англичанину → «Совпадение? Не думаю» (красные глаза) →
//   ВОЗ: убивает до половины → «проверили ноздри» → в профиле два соседних ролика.
(function () {
  pal8(PAL8.wine);
  const C = K8;
  P = { bg: C.night, paper: C.paper, ink: C.night, line: C.paper, a1: C.amber, a2: C.red };
  const D = {};
  const PAR = '#EBDDC2', PAR2 = '#DFCDAB';
  const bgPar = () => bgPaper(PAR, PAR2, 'b', .25);
  const wax = (r) => D_.poly([...Array(36)].map((_, i) => { const a = i / 36 * 2 * PI, rr = r + Math.sin(i * 5.3) * 7 + Math.sin(i * 2.1) * 4; return [Math.cos(a) * rr, Math.sin(a) * rr] }));

  // 1. «Что вы знаете о никотине?» — сургучная печать падает с оттиском N, текст золотом; влёт в печать
  const SEAL = [540, 520];
  D.title = (t, S, T) => {
    let s = bgDiag({ off: -t * 20 });
    const ks = P01(t, T.a + .02, .4);
    if (ks > 0) {
      const sc = lerp(2.6, 1, EZ.i(ks)) * (ks >= 1 ? 1 + .06 * Math.sin(P01(t, T.a + .42, .3) * PI) : 1);
      s += g(SH(wax(118), { op: .5 }) + F(wax(118), C.red) + F(D_.circ(0, 0, 84), '#B92B30') + Ln(D_.circ(0, 0, 84), 1, { c: '#FF6B6B', w: 3, op: .5 }) + tx('N', 0, 36, { f: 'M', w: 800, s: 104, c: C.amber3 }), at(SEAL[0], SEAL[1], sc), clamp(ks * 3));
      if (ks >= 1) cue(T.a + .42, 'seal', .9);
    }
    { const k = E(t, T.a + .2, .6, 'o5'), id = uid(); s += `<clipPath id="${id}"><rect x="0" y="752" width="1080" height="62"/></clipPath>` + g(cap8('что вы знаете о', 540, 800 + (1 - k) * 60, { s: 38, c: C.line, ls: 12 }), '', 1, `clip-path="url(#${id})"`) }
    s += rise('НИКОТИНЕ?', 540, 940, t, T.c('никотине') - .12, { f: 'M', w: 800, s: 124, c: C.amber3, ls: 2, dur: .6 });
    s += Ln('M300 990H780', E(t, T.c('никотине') + .1, .5, 'o5'), { c: C.red, w: 5 });
    return g(s, push8(t, T, .05, 540, 700))
  };

  // 2. «Что на нём сидит больше миллиарда человек?» — глобус, на нём загораются точки-люди; счётчик до 1 000 000 000+
  const GLB = [540, 640];
  const GD = []; for (let i = 0; i < 140; i++) { const a = rnd(i * 7) * 2 * PI, r = Math.sqrt(rnd(i * 7 + 1)) * 238; GD.push([GLB[0] + Math.cos(a) * r, GLB[1] + Math.sin(a) * r, rnd(i * 7 + 2)]) }
  D.known = (t, S, T) => {
    const tm = T.c('миллиарда') - .4;
    let s = bgDiag({ off: -t * 15 });
    s += F(D_.circ(GLB[0], GLB[1], 250), C.navy2) + ht(D_.circ(GLB[0], GLB[1], 250), 'n', 'd', .5);
    for (let i = -2; i <= 2; i++) s += Ln(D_.ell(GLB[0], GLB[1], Math.abs(Math.cos((i * 30 + t * 12) * PI / 180)) * 250 + .1, 250), 1, { c: C.line, w: 2, op: .3 });
    for (let j = -2; j <= 2; j++) { const y = GLB[1] + j * 90, w = Math.sqrt(250 * 250 - (j * 90) ** 2); s += Ln(`M${R(GLB[0] - w)} ${y}H${R(GLB[0] + w)}`, 1, { c: C.line, w: 2, op: .3 }) }
    const kd = E(t, tm, 1.5, 'io');
    GD.forEach(([x, y, r]) => { if (r < kd) s += F(D_.circ(x, y, 6), C.amber, { op: clamp((kd - r) * 8) }) });
    if (t > tm) { const v = Math.round(1e9 * E(t, tm, 1.4, 'o')); s += tx(v.toLocaleString('ru-RU').replace(/ /g, ' ') + (v >= 1e9 ? '+' : ''), 540, 1060, { f: 'M', w: 800, s: 88, c: C.amber3 }) }
    s += Ln(D_.circ(GLB[0], GLB[1], 250), 1, { c: C.paper, w: 3, op: .5 });
    return g(s, push8(t, T, .05, 540, 640))
  };

  // 3. «А знаете ли вы, что в Лондоне никотином откачивали утопленников?» — ночной Лондон XVIII века, Темза, на берегу — утопленник
  function nightBank(t, o = {}) {
    let s = BG(C.night) + F(D_.circ(840, 300, 110), C.paper, { op: .92 }) + ht(D_.circ(840, 300, 110), 'n', 'x', .35);
    for (let i = 0; i < 18; i++) s += F(D_.circ(60 + rnd(i) * 960, 80 + rnd(i + 9) * 480, 2 + rnd(i + 3) * 2.5), C.paper, { op: .3 + .4 * Math.abs(Math.sin(t * .7 + i)) });
    s += london8(880, { c: C.navy2, win: true, t });
    s += F(D_.rr(-300, 880, 1700, 1200, 0), C.navy);
    for (let i = 0; i < 6; i++) s += Ln(D_.wave(-200, 1300, 920 + i * 46, 6, 260, t * 1.6 + i), 1, { c: C.line, w: 2.5, op: .3 - i * .03 });
    s += F(`M-300 1100C200 1060 700 1080 1400 1060V2400H-300Z`, C.navy3) + ht('M-300 1100C200 1060 700 1080 1400 1060V2400H-300Z', 'n', 'v', .5);
    return s
  }
  D.claim = (t, S, T) => {
    if (t > T.a) cue(T.a + .05, 'impact', 1);
    const tu = T.c('утопленников') - .25;
    let s = nightBank(t);
    s += rise8(lying8(0, 0, 1, { f: C.paper2 }), 560, 1090, t, tu, { dy: 40, s: 1.1 });
    for (let i = 0; i < 4; i++) { const q = ((t - tu) * .7 + i / 4) % 1; if (t > tu + .3) s += F(D_.drop(300 + i * 160, 1110 + q * 50, 9), C.line, { op: (1 - q) * .8 }) }
    return g(s, push8(t, T, .08, 560, 1000))
  };

  // 4. «Табачный дым вдували им в задницу.» — крупно: меха качают дым по трубке; в месте «контакта» — цензура со звёздочкой
  D.smoke = (t, S, T) => {
    const td = T.c('дым') - .2, tz = T.c('задницу') - .15;
    let s = nightBank(t);
    s = g(s, `translate(540 1000) scale(1.5) translate(-560 -1060)`);
    const pump = t > td ? .5 + .5 * Math.sin((t - td) * 7) : 0;
    s += g(lying8(0, 0, 1, { f: C.paper2 }), at(620, 930, 1.65));
    s += bellows8(t, { x: 210, y: 1180, s: 1, pump, tube: 300, tdy: -170 });
    if (t > td) { const tube = 'M360 1180C480 1180 560 1050 660 1010'; for (let i = 0; i < 5; i++) { const p = ((t - td) * 1.1 + i / 5) % 1, P0 = pts(tube, 60)[Math.min(59, Math.floor(p * 59))]; s += F(D_.circ(P0[0], P0[1] - 16, 12 + p * 14), C.paper, { op: .7 * (1 - p) }) } cue(td + .1, 'bellows', .7) }
    const kz = P01(t, tz, .3);
    if (kz > 0) { s += g(F(D_.rr(-110, -40, 220, 80, 14), C.night) + F(D_.star(0, 0, 30, 13), C.amber), at(670, 990, EZ.back(kz), -8)); cue(tz, 'stamp', .7) }
    return g(s, push8(t, T, .05, 600, 1000))
  };

  // 5. «Наборы для этого висели прямо на берегу Темзы.» — камера едет вдоль берега: шкафчики на столбах, фонари
  function kitBox(x, y, t, k) {
    let s = F(D_.rr(x - 10, y, 20, 520, 6), C.navy2) + SH(D_.rr(x - 90, y - 150, 180, 170, 12), { op: .45 }) + F(D_.rr(x - 90, y - 150, 180, 170, 12), C.navy3) + F(D_.rr(x - 74, y - 134, 148, 138, 8), C.night, { op: .35 }) + Ln(D_.rr(x - 74, y - 134, 148, 138, 8), 1, { c: C.amber, w: 3, op: .7 });
    s += bellows8(t, { x: x - 8, y: y - 66, s: .32, pump: .5, tube: 120, tdy: 0 }) + F(D_.rr(x + 40, y - 126, 34, 10, 3), C.red) + F(D_.rr(x + 52, y - 138, 10, 34, 3), C.red);
    s += F(D_.rr(x - 18, y - 236, 36, 54, 8), C.navy3) + F(D_.circ(x, y - 210, 13), C.amber, { op: .85 + .15 * Math.sin(t * 9 + x) });
    return g(s, at(0, 0), k)
  }
  D.kits = (t, S, T) => {
    const X = (t - T.a) * 140;
    let s = BG(C.night) + F(D_.circ(840, 300, 110), C.paper, { op: .92 }) + ht(D_.circ(840, 300, 110), 'n', 'x', .35);
    let w = london8(820, { c: C.navy2, win: true, t }) + F(D_.rr(-400, 820, 3000, 300, 0), C.navy);
    for (let i = 0; i < 4; i++) w += Ln(D_.wave(-400, 2600, 860 + i * 50, 6, 260, t * 1.6 + i), 1, { c: C.line, w: 2.5, op: .3 - i * .05 });
    w += F('M-400 1060C400 1030 1200 1050 2600 1030V2400H-400Z', C.navy3) + ht('M-400 1060C400 1030 1200 1050 2600 1030V2400H-400Z', 'n', 'v', .5);
    [220, 640, 1060, 1480].forEach((x, i) => { w += kitBox(x, 1060, t, E(t, T.a + .1 + i * .3, .5, 'o5')) });
    s += g(w, `translate(${R(-X)} 0)`);
    s += lab8('1780-е', 540, 300, { s: 44, c: C.amber, ls: 10, op: E(t, T.c('Темзы') - .3, .5) });
    return s
  };

  // 6. «Перестали, только когда врач Бенджамин Броди доказал на животных: никотин — яд.» — колба, мышь, на «яд» — череп; 1811
  const mouse8 = (x, y, s = 1, o = {}) => g(F(D_.ell(0, 0, 70, 44), C.paper2) + F(D_.circ(66, -16, 30), C.paper2) + F(D_.circ(58, -46, 16), C.paper2) + F(D_.circ(58, -46, 8), '#E9A0A0') + Ln('M-70 10C-120 20 -140 -20 -180 -10', 1, { c: C.paper2, w: 5 }) + F(D_.circ(86, -20, 4), C.night), at(x, y, s, o.r || 0), o.op ?? 1);
  D.brodie = (t, S, T) => {
    const tb = T.c('Броди') - .3, ta = T.c('животных') - .3, ty = T.c('яд') - .2;
    let s = bgDiag({ off: -t * 15 });
    s += num8('1811', 540, 360, t, tb, { s: 130, c: C.amber3 });
    const kr = P01(t, ty, .5);
    s += flask8({ x: 540, y: 820, s: 1.25, t, liquid: kr > .5 ? C.red : C.amber, ly: lerp(40, 20, kr) });
    if (kr > 0) { s += rise8(skull8(0, 0, 1, { c: C.paper, bg: C.night }), 540, 860, t, ty, { back: true, from: .4 }); cue(ty, 'thud', .7) }
    s += rise8(mouse8(0, 0, 1), 820, 1150, t, ta, { dy: 30 });
    return g(s, push8(t, T, .05, 540, 820))
  };

  // 7. «А начал всё француз Жан Нико. В 1560 году он прислал табак в Париж как лекарство.» — пергамент: профиль Нико, путь Лиссабон → Париж, посылка с крестом
  const ROUTE = 'M220 1180C300 900 500 760 840 520';
  D.nicot = (t, S, T) => {
    const tn = T.c('Нико') - .4, ty = T.c('1560') - .3, tp = T.c('Париж') - .5, tl = T.c('лекарство') - .2;
    let s = bgPar();
    s += rise8(bust8({ who: 'nicot', f: C.navy3 }), 300, 640, t, tn, { s: .72, dy: 50 });
    s += num8('1560', 760, 1040, t, ty, { s: 120, c: C.navy3 });
    s += dotted(ROUTE, E(t, ty + .2, 1.2, 'io'), C.navy2, 6, 20);
    s += pin8(220, 1180, .8, { c: C.navy3, op: E(t, ty, .3) }) + lab8('лиссабон', 220, 1250, { c: C.navy3, s: 26, op: E(t, ty, .3) });
    s += pin8(840, 520, .8, { c: C.red, op: E(t, tp, .3) }) + lab8('париж', 840, 440, { c: C.red, s: 26, op: E(t, tp, .3) });
    const kp = clamp((t - ty - .2) / 1.4);
    if (kp > 0) { const P0 = pts(ROUTE, 80)[Math.min(79, Math.floor(EZ.io(kp) * 79))]; let box = SH(D_.rr(-60, -50, 120, 100, 10), { op: .3 }) + F(D_.rr(-60, -50, 120, 100, 10), C.amber) + Ln('M0 -50V50M-60 0H60', 1, { c: C.amber2, w: 5 }); if (t > tl) box += g(F(D_.rr(-34, -10, 68, 20, 4), C.red) + F(D_.rr(-10, -34, 20, 68, 4), C.red), at(0, 0, EZ.back(P01(t, tl, .4)))); s += g(box, at(P0[0], P0[1] - 60, .9)) }
    return g(s, push8(t, T, .04))
  };
  // 8. «Табаком лечили почти всё — даже чуму.» — полка аптечных банок; на «чуму» — маска чумного доктора
  D.plague = (t, S, T) => {
    const tc = T.c('чуму') - .3;
    let s = bgPar() + F(D_.rr(-100, 1170, 1300, 26, 6), C.navy3) + F(D_.rr(-100, 1196, 1300, 700, 0), PAR2);
    [['ГОЛОВА', 220], ['ЗУБЫ', 540], ['ЖИВОТ', 860]].forEach(([l, x], i) => { s += rise8(apo8(0, 0, l), x, 1040, t, T.a + .1 + i * .25, { dy: 60 }) });
    const kp = P01(t, tc, .55);
    if (kp > 0) { s += g(plague8(0, 0, 1.05), at(lerp(1500, 520, EZ.o5(kp)), 560, 1, lerp(12, 0, EZ.o(kp)))); cue(tc, 'whoosh', .6) }
    return g(s, push8(t, T, .04))
  };
  // 9. «В честь Нико и назвали никотин.» — NICOT + INE = NICOTINE, ниже — «никотин»
  D.name = (t, S, T) => {
    const ti = T.c('назвали') - .3, tr = T.c('никотин') - .2;
    let s = bgPar();
    const wN = tw('NICOT', { f: 'M', w: 800, s: 170 }), wI = tw('INE', { f: 'M', w: 800, s: 170 }), ki = E(t, ti, .6, 'io');
    const x0 = 540 - lerp(wN / 2, (wN + wI) / 2, ki);
    s += tx('NICOT', x0, 800, { f: 'M', w: 800, s: 170, c: C.navy3, a: 'start' });
    if (ki > 0) s += tx('INE', x0 + wN, 800, { f: 'M', w: 800, s: 170, c: C.red, a: 'start', op: clamp(ki * 2) });
    s += Ln(`M${R(x0)} 840H${R(x0 + wN)}`, E(t, T.a + .2, .5, 'o5'), { c: C.navy3, w: 6 });
    s += rise('НИКОТИН', 540, 1010, t, tr, { f: 'M', w: 800, s: 96, c: C.amber2, ls: 6, dur: .55 });
    return g(s, push8(t, T, .05, 540, 860))
  };

  // 10. «Английский король Яков Первый написал против табака целый трактат.» — корона опускается, книга «A Counterblaste to Tobacco», 1604
  const BOOK = [540, 860];
  D.james = (t, S, T) => {
    const tk = T.c('король') - .3, tt = T.c('трактат') - .3;
    let s = bgDiag({ off: -t * 12 });
    const kb = P01(t, tt, .5);
    s += g(book8({ title: ['A COUNTER-', 'BLASTE TO', 'TOBACCO'], ts: 34 }) + lab8('1604', 14, 190, { c: C.amber, s: 30 }), at(BOOK[0], BOOK[1], 1.1 * (kb > 0 ? 1 + .08 * Math.sin(kb * PI) : 1)));
    s += rise8(crown8(0, 0, 1), 540, 420, t, tk, { dy: -120, back: true, s: 1.1 });
    if (t > tt) cue(tt, 'thud', .6);
    return g(s, push8(t, T, .04, 540, 800))
  };
  // 11. «А потом поднял налог на него в сорок раз.» — книга уходит влево, справа растёт столбик монет до 40, «×40»
  D.tax = (t, S, T) => {
    const tn = T.c('налог') - .3, k40 = E(t, tn, T.c('сорок') - tn + .3, 'io'), mv = E(t, T.a, .5, 'io');
    let s = bgDiag({ off: -t * 12 });
    s += g(book8({ title: ['A COUNTER-', 'BLASTE TO', 'TOBACCO'], ts: 34 }) + lab8('1604', 14, 190, { c: C.amber, s: 30 }), at(lerp(BOOK[0], 280, mv), lerp(BOOK[1], 900, mv), lerp(1.1, .62, mv)));
    s += g(crown8(0, 0, 1), at(lerp(540, 280, mv), lerp(420, 640, mv), lerp(1.1, .6, mv)));
    const n = Math.max(1, Math.round(k40 * 40));
    s += coins8(760, 1180, n);
    if (t > tn) { s += rise8(tx('×' + n, 0, 0, { f: 'M', w: 800, s: 120, c: C.amber3 }), 760, 1180 - n * 16 - 90, t, tn, { d: .3 }); if (n > 2) cue(tn + .2, 'coins', .7) }
    return s
  };

  // 12. «В России за табак пороли и рвали ноздри.» — шапка Мономаха; свист плети; профиль — красные метки у ноздри
  D.russia = (t, S, T) => {
    const tp = T.c('пороли') - .2, tn = T.c('ноздри') - .3;
    let s = bgDiag({ c1: C.navy2, off: -t * 12 });
    s += rise8(monomakh8(0, 0, 1), 540, 400, t, T.a + .05, { back: true, s: .95 });
    s += g(bust8({ who: 'plain', f: C.navy3 }), at(470, 940, 1.25));
    const kw = P01(t, tp, .35);
    if (kw > 0 && kw < 1) s += Ln('M120 620C400 700 700 640 980 760', kw, { c: C.paper, w: 8, op: 1 - kw * .5 });
    if (kw > 0) cue(tp + .1, 'whip', .7);
    const kn = P01(t, tn, .4);
    if (kn > 0) { const nx = 470 + 236 * 1.25, ny = 940 + 34 * 1.25; s += g(Ln('M-26 -26L26 26M26 -26L-26 26', E(kn, 0, 1), { c: C.red, w: 10 }), at(nx + 24, ny + 10, 1)) + Ln(D_.circ(nx + 24, ny + 10, lerp(30, 90, EZ.o(kn))), 1, { c: C.red, w: 5 * (1 - kn) + 1, op: 1 - kn }) }
    return g(s, push8(t, T, .05, 600, 900))
  };
  // 13. «Пока Пётр Первый его не разрешил и не продал право на табак англичанину.» — Пётр и английский лорд, свиток с печатью переходит; корабль; 1698
  D.peter = (t, S, T) => {
    const tr = T.c('разрешил') - .3, tp = T.c('продал') - .3, te = T.c('англичанину') - .4;
    let s = bgDiag({ off: -t * 12 });
    s += g(ship8(0, 0, 1, { c: C.navy2 }), at(lerp(-200, 540, E(t, T.a, T.e - T.a, 'l')), 560, .8));
    s += F(D_.rr(-200, 600, 1480, 40, 0), C.navy) ;
    s += rise8(bust8({ who: 'peter', f: C.navy3 }), 250, 900, t, T.a, { s: .78 });
    s += g(rise8(bust8({ who: 'lord', f: C.navy3 }), 0, 0, t, te - .2, { s: .78 }), 'translate(830 900) scale(-1 1)');
    if (t > tr) s += check8(250, 560, 1, P01(t, tr, .4), C.amber);
    const ks = E(t, tp, 1.0, 'io');
    if (t > tp - .3) s += scroll8(lerp(330, 760, ks), 1190, .7, { r: lerp(-6, 6, ks) });
    s += lab8('1698', 540, 300, { c: C.amber, s: 40, op: E(t, tp, .5) });
    return s
  };

  // 14. «Сначала запретить. Потом продать. Совпадение? Не думаю.» — запрет и монеты связаны красной ниткой; всё гаснет, в темноте — красные глаза
  D.coinc = (t, S, T) => {
    const tb = T.c('запретить') - .3, ts = T.c('продать') - .3, tc = T.c('Совпадение') - .2, td = T.c('думаю') - .3;
    const dim = 1 - E(t, tc, .4) * .8;
    let s = BG(C.night);
    let w = rise8(leaf8({ len: 260, w: 100, f: C.amber, f2: C.amber2, vo: .5 }), 300, 760, t, tb, { s: 1 }) + ban8(300, 640, 150, P01(t, tb + .2, .5));
    w += rise8(coins8(0, 0, 6), 780, 740, t, ts, {});
    w += thread8(300, 490, 780, 560, E(t, ts + .3, .5, 'io'));
    s += g(w, '', dim);
    if (t > tc) { s += eyes8(540, 1040, 1.2, E(t, tc + .15, .35, 'o5'), E(t, td, .3, 'io')); cue(tc + .1, 'eyes', .9) }
    return s
  };

  // 15. «Сегодня табак убивает до половины тех, кто его не бросил.» — десять фигур, половина гаснет до контура; «ВОЗ»
  const PPL = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) PPL.push([200 + c * 170, 700 + r * 260]);
  D.now = (t, S, T) => {
    const th = T.c('половины') - .3;
    let s = BG(C.night);
    PPL.forEach(([x, y], i) => {
      const off = i % 2 === 1 && t > th + i * .07, k = off ? E(t, th + i * .07, .5) : 0;
      s += rise8(man8(0, 0, 2.6, C.paper, 1 - k * .85) + (k > 0 ? Ln(D_.circ(0, -78, 44), 1, { c: C.paper, w: 3, op: k * .6 }) : ''), x, y, t, T.a + i * .05, { dy: 30 });
    });
    s += lab8('ВОЗ', 540, 1180, { c: C.line, s: 30, op: E(t, th + .6, .4) });
    return g(s, push8(t, T, .04))
  };
  // 16. «Признайтесь, вы ведь сейчас проверили, на месте ли ноздри.» — профиль, палец касается носа, галочка
  D.turn = (t, S, T) => {
    const tp = T.c('проверили') - .4, tn = T.c('ноздри') - .2;
    let s = bgDiag({ off: -t * 12 });
    s += g(bust8({ who: 'plain', f: C.navy3 }), at(420, 900, 1.35));
    const nx = 420 + 236 * 1.35, ny = 900 + 34 * 1.35, kf = E(t, tp, .7, 'io'), tap = Math.max(0, Math.sin(clamp((t - tp - .7) * 2) * PI * 2)) * 10;
    s += finger8(lerp(1400, nx + 196 + tap, kf), ny + 20, 1, { r: 180, sl: C.navy2 });
    if (t > tn) { s += check8(800, 560, 1.2, P01(t, tn, .5), C.amber); cue(tn, 'ding', .5) }
    return g(s, push8(t, T, .05, 600, 880))
  };
  // 17. «В профиле — как табак воюет с жуками и почему гусеница парит.»
  D.cta = (t, S, T) => cta8(t, T, [{ k: 'bugs', t: ['Табак', 'против жуков'] }, { k: 'cat', t: ['Гусеница,', 'которая парит'] }]);

  window.EP = {
    P, D, clean: true, lead: .2, defs: V8DEFS,
    cap: { size: 58, top: 1360, hi: C.amber, st: C.night },
    tr: { title: 'dive', known: 'dive', claim: 'cut', smoke: 'panL', kits: 'wave', brodie: 'zc', nicot: 'panL', plague: 'panL', name: 'into', james: 'cut', tax: 'wave', russia: 'panL', peter: 'zc', coinc: 'cut', now: 'dive', turn: 'wave' },
    trAt: { title: SEAL, known: [470, 560], brodie: [540, 820], name: [540, 760], peter: [540, 700], now: [370, 642] },
    trR: { title: 80, known: 40, now: 34 },
    trTo: { name: BOOK },
    trCol: { brodie: PAR, peter: C.night, name: C.amber },
    trCols: { kits: [C.amber, C.paper, C.navy3], tax: [C.red, C.paper, C.navy3], turn: [C.amber, C.paper, C.navy3] },
    trBg: { title: C.night, known: C.night, now: C.night, name: PAR },
    init() {
      const st = document.createElement('style');
      st.textContent = `#cap{font-weight:800!important;letter-spacing:0!important;text-shadow:0 0 2px ${C.night},0 3px 0 ${C.night},0 0 14px rgba(23,10,17,.85),2px 2px 0 ${C.night},-2px 2px 0 ${C.night},2px -2px 0 ${C.night},-2px -2px 0 ${C.night}!important}#cap .u{color:#F2E6CF!important;opacity:.55}`;
      document.head.appendChild(st);
    }
  };
})();
