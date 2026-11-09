// Никотин v8 — текст nicw2, рисовка заново «как у оригиналов» (v8.js): 3 цвета + янтарь, без лиц и обводок,
//   полутон и косой свет, переходы — камера: влёт в предмет (dive), отъезд из него (into), волна (wave), сдвиг (pan).
//   Раскадровка — ниже у каждой сцены. Сюжет тот же: табак отвечает на укусы → мозг отвечает на затяжки.
(function () {
  const C = K8;
  P = { bg: C.night, paper: C.paper, ink: C.night, line: C.paper, a1: C.amber, a2: C.red };
  const D = {};
  const LIGHT = '#EFE8DA', LIGHT2 = '#E3DACA'; // «бумажные» сцены истории (как белые сцены у Coca-Cola)
  const bgLight = () => BG(LIGHT) + F(D_.poly([[620, -400], [1380, -400], [-120, 2400], [-880, 2400]]), LIGHT2) + ht(D_.poly([[620, -400], [1380, -400], [-120, 2400], [-880, 2400]]), 'l', 'r', .35);

  // ===== 1. «Что вы знаете о никотине?» — янтарная капля падает, круги; текст выезжает из-под маски; влёт в каплю =====
  const DROP = [540, 560];
  D.title = (t, S, T) => {
    const t0 = T.a + .05, k = P01(t, t0, .42), land = t0 + .42;
    let s = bgDiag({ off: -t * 20 });
    if (k < 1) s += F(D_.drop(DROP[0], lerp(-120, DROP[1], EZ.i(k)), 44), C.amber);
    else {
      cue(land, 'drip', .9);
      for (let i = 0; i < 4; i++) { const q = P01(t, land + i * .14, 1.2); if (q > 0 && q < 1) s += Ln(D_.circ(DROP[0], DROP[1], lerp(50, 230, EZ.o(q))), 1, { c: i % 2 ? C.amber : C.paper, w: 5 * (1 - q) + 1, op: (1 - q) * .9 }) }
      s += F(D_.circ(DROP[0], DROP[1], 46 * EZ.back(P01(t, land, .35))), C.amber) + F(D_.circ(DROP[0] - 14, DROP[1] - 14, 12), C.amber3, { op: .8 });
    }
    { const k = E(t, T.a + .15, .6, 'o5'), id = uid(); s += `<clipPath id="${id}"><rect x="0" y="752" width="1080" height="62"/></clipPath>` + g(cap8('что вы знаете о', 540, 800 + (1 - k) * 60, { s: 38, c: C.line, ls: 12 }), '', 1, `clip-path="url(#${id})"`) }
    s += rise('НИКОТИНЕ?', 540, 940, t, T.c('никотине') - .12, { f: 'M', w: 800, s: 124, c: C.paper, ls: 2, dur: .6 });
    s += Ln('M300 990H780', E(t, T.c('никотине') + .1, .5, 'o5'), { c: C.amber, w: 5 });
    return g(s, push8(t, T, .05, 540, 700))
  };

  // ===== 2. «…в сигаретах и в каждой одноразке?» — фон янтарь; сигарета въезжает, превращается в одноразку, ряд одноразок; влёт в диод =====
  const CIGD = D_.rr(-380, -48, 760, 96, 10), VAPED = VAPE_P(200, 520), VC = [540, 800], LED = [540, 800 + 206];
  D.common = (t, S, T) => {
    const tc = T.a + .15, tv = T.c('больше') - .3, tm = T.c('миллиарда') - .4, km = E(t, tv, .5, 'io');
    let s = bgDiag({ c0: C.amber, c1: '#E99A33', dc: 'n', off: t * 25 });
    s += disc(540, 780, 330, '#EC9E36');
    if (km <= 0) {
      const kx = E(t, tc, .7, 'o5');
      s += cig8(t, { x: lerp(-500, 540, kx), y: VC[1], r: lerp(-8, 0, kx), fc: C.amber2, shc: C.amber2, shOp: .6 });
    } else if (km < 1) {
      s += g(F(morph(CIGD, VAPED, km), km < .5 ? C.paper : C.night), at(VC[0], VC[1], 1, lerp(0, 0, km)));
      if (km < .2) cue(tv, 'swish', .6);
    } else {
      const side = [[-360, .62, .18], [-190, .78, .1], [190, .78, .14], [360, .62, .22]];
      side.forEach(([dx, sc, dl], i) => { s += rise8(vape8(t, { f: C.navy, led: P01(t, tv + .75 + dl, .2), shadow: false }), VC[0] + dx, VC[1] + 70 - sc * 40, t, tv + .35 + dl, { s: sc, dy: 140 }) });
      s += vape8(t, { x: VC[0], y: VC[1], f: C.night, led: P01(t, tv + .5, .25) });
    }
    if (t > tm) { const v = Math.round(1e9 * E(t, tm, 1.2, 'o')); s += g(tx(v.toLocaleString('ru-RU').replace(/\u00a0/g, ' ') + (v >= 1e9 ? '+' : ''), 540, 330, { f: 'M', w: 800, s: 92, c: C.night }), '', E(t, tm, .3)) }
    return g(s, push8(t, T, .05, LED[0], LED[1]))
  };

  // ===== 3. «А знаете ли вы, что в Евросоюзе никотином запрещено травить даже тлю?» — звёзды ЕС, распылитель, красный запрет;
  //     камера опускается к листу, на нём тля под лупой =====
  const APH3 = [560, 1150];
  D.claim = (t, S, T) => {
    const te = T.c('Евросоюзе') - .2, tn = T.c('никотином') - .2, tb = T.c('запрещено') - .1, tl = T.c('даже') - .2;
    const down = E(t, tl, .8, 'io');
    if (t > T.a) cue(T.a + .05, 'impact', 1);
    let s = bgDiag({ off: -t * 15 - down * 200 });
    let top = euRing8(540, 560, 250, P01(t, te, .9));
    top += rise8(spray8(t, { mist: P01(t, tn + .4, .9) }), 540, 600, t, tn, { s: .72, dy: 90 });
    top += ban8(540, 560, 175, P01(t, tb, .55));
    if (t > tb) cue(tb + .05, 'thud', .7);
    s += g(top, `translate(0 ${R(-down * 230)}) ` + about(540, 560, 1 - down * .3));
    // лист снизу и тля
    const ly = lerp(1700, 1240, down);
    const lp = `M-200 ${ly}Q300 ${ly - 60} 1280 ${ly + 40}L1280 3000L-200 3000Z`;
    s += F(lp, C.navy3) + ht(lp, 'n', 'v', .5) + Ln(`M-200 ${ly + 120}Q500 ${ly + 60} 1280 ${ly + 200}M300 ${ly - 20}Q340 ${ly + 200} 260 ${ly + 500}M800 ${ly - 10}Q860 ${ly + 220} 980 ${ly + 520}`, 1, { c: C.paper, w: 3, op: .4 });
    const ka = P01(t, tl + .25, .6);
    s += aphid8(t, { x: APH3[0], y: ly - 70, s: .9 * EZ.o(ka), op: clamp(ka * 3) });
    // лупа
    const km = E(t, T.c('тлю') - .05, .5, 'o5');
    if (km > 0) s += g(Ln(D_.circ(0, 0, 190), km, { c: C.paper, w: 8 }) + Ln('M134 134L250 250', km, { c: C.paper, w: 22 }), at(APH3[0], ly - 80, 1));
    return g(s, push8(t, T, .04))
  };

  // ===== 4. «Никотин — оружие табака. Его делают корни и гонят вверх, в листья.» — куст в разрезе; чертёж меча поверх стебля;
  //     камера к корням, янтарные точки бегут вверх, листья наливаются =====
  const PL = [540, 1180], APH4 = [790, 650];
  D.leaf = (t, S, T) => {
    const tw = T.c('оружие') - .15, tr = T.c('корни') - .3, tu = T.c('вверх') - .3;
    const cam1 = E(t, tr, .9, 'io'), cam2 = E(t, tu + .2, 1.1, 'io');
    const cy = lerp(lerp(840, 1130, cam1), 760, cam2), z = lerp(lerp(1, 1.25, cam1), .96, cam2);
    let w = soil8(PL[1]) + plant8(t, { x: PL[0], y: PL[1], h: 900, roots: E(t, tr, .9, 'o5'), flow: t > tr + .5 ? (t - tr - .5) * .55 : null, charge: E(t, tu + .3, 1.6, 'io') * .55 });
    w += aphid8(t, { x: APH4[0], y: APH4[1], s: .32, r: -30 });
    // чертёж меча: клинок по стеблю, гарда — по нижним листьям, рукоять ниже
    const ks = P01(t, tw, 1.1), ko = 1 - E(t, tr - .2, .4);
    if (ks > 0 && ko > 0) {
      const X = PL[0];
      w += g(Ln(`M${X} 280L${X + 34} 380V860H${X - 34}V380Z`, E(ks, 0, .6), { c: C.amber, w: 5 }) + Ln(`M${X - 190} 860H${X + 190}M${X - 190} 860V896H${X + 190}V860`, E(ks, .3, .5), { c: C.amber, w: 5 }) + Ln(`M${X - 22} 896V1060H${X + 22}V896M${X} 1060V1100`, E(ks, .5, .5), { c: C.amber, w: 5 }), '', ko);
      w += g(cap8('ОРУЖИЕ', X + 230, 520, { s: 30, c: C.amber, a: 'start', ls: 8 }) + Ln(`M${X + 40} 540H${X + 220}`, 1, { c: C.amber, w: 3 }), '', E(ks, .4, .4) * ko);
    }
    let s = bgDiag({ off: -cy * .3 });
    s += g(w, `translate(540 ${CY}) scale(${R(z * 1000) / 1000}) translate(-540 ${R(-cy)})`);
    return s
  };

  // ===== 5. «Жук кусает лист — никотин бьёт ему по нервам, и жук замирает.» — лист крупно, жук-силуэт, укус, янтарные нервы, жук остаётся контуром =====
  D.bite = (t, S, T) => {
    const tb = T.c('кусает') - .1, tn = T.c('нервам') - .35, tf = T.c('замирает') - .1;
    let s = bgDiag({ off: -t * 15 });
    const edge = 'M-200 1020Q520 960 1280 1030L1280 2400L-200 2400Z';
    let lf = F(edge, C.navy3) + F('M520 990Q900 980 1280 1030L1280 2400L700 2400Z', C.navy2) + ht(edge, 'n', 'v', .5);
    lf += Ln('M-200 1320Q300 1160 1280 1260M200 960Q260 1120 120 1420M700 980Q760 1140 900 1520', 1, { c: C.paper, w: 3, op: .4 });
    lf += Ln('M-200 1320Q300 1160 1280 1260', E(t, tb + .3, .8), { c: C.amber, w: 4 });
    const k1 = P01(t, tb + .2, .3), k2 = P01(t, tb + .55, .3);
    if (k1 > 0) { lf = cut(lf, [[800, 990, 60 * EZ.back(k1)], [866, 995, 44 * EZ.back(k2)]]); cue(tb + .2, 'chomp', .5) }
    s += lf;
    const walk = P01(t, T.a, tb - T.a), bx = lerp(-380, 520, EZ.o(walk)), st = P01(t, tf, .25);
    const ghost = E(t, tf + .35, .6), drop = E(t, T.e + .1, .5, 'i');
    s += beetle8(t, { x: bx + shake(t, tn + .3, 10, .7, 70), y: 950 + drop * 500, s: 1.7, walk: walk < 1 && st <= 0, nerve: E(t, tn, .7, 'o5'), zap: t < tf, stiff: st, ghost, op: 1 - drop });
    if (t > tn) cue(tn + .1, 'zap', .5);
    return g(s, push8(t, T, .05, 640, 900))
  };

  // ===== 6. «А табак в ответ делает никотина ещё больше.» — снова куст; корни качают быстрее, листья полностью янтарные; шкала справа =====
  D.reply = (t, S, T) => {
    const tm = T.c('больше') - .5, ch = lerp(.55, 1, E(t, T.v, T.e - T.v + .3, 'io'));
    let w = soil8(PL[1]) + plant8(t, { x: PL[0], y: PL[1], h: 900, roots: 1, flow: (t - T.a) * 1.4, speed: 1, charge: ch });
    let s = bgDiag({ off: -228 });
    s += g(w, `translate(540 ${CY}) scale(.96) translate(-540 -760)`);
    // шкала
    const gx = 960, y0 = 1080, y1 = 380, lv = lerp(.45, .95, E(t, T.v, T.e - T.v, 'io'));
    s += F(D_.rr(gx - 18, y1, 36, y0 - y1, 18), C.navy2) + F(D_.rr(gx - 18, lerp(y0, y1, lv), 36, (y0 - y1) * lv, 18), C.amber);
    for (let i = 0; i <= 8; i++) s += Ln(`M${gx - 40} ${R(lerp(y0, y1, i / 8))}H${gx - 26}`, 1, { c: C.line, w: 3, op: .6 });
    s += tx('НИКОТИН', gx - 70, (y0 + y1) / 2, { f: 'M', w: 800, s: 26, c: C.line, ls: 8, tr: `rotate(-90 ${gx - 70} ${(y0 + y1) / 2})` });
    if (t > tm) s += rise8(tx('×2', 0, 0, { f: 'M', w: 800, s: 64, c: C.amber }), gx - 10, y1 - 40, t, tm, { back: true });
    return s
  };

  // ===== 7–9. История — светлые сцены; год сверху едет 1690 → 2009 (EP.over) =====
  // 7. «Люди заметили это ещё к 1690 году.» — банка с табачной водой: листья падают, вода желтеет
  D.y1690 = (t, S, T) => {
    let s = bgLight();
    s += F(D_.rr(-200, 1110, 1480, 900, 0), C.navy) + Ln('M-200 1110H1280', 1, { c: C.navy3, w: 4 });
    const kl = E(t, T.c('заметили') - .2, 1.2, 'io');
    s += jar8(t, { x: 540, y: 880, s: 1.05, level: lerp(.15, .8, kl), lc: C.navy, bf: C.paper2, lid: C.navy3, shc: C.navy2 });
    for (let i = 0; i < 3; i++) { const q = P01(t, T.c('заметили') - .5 + i * .18, .6); if (q > 0 && q < 1) s += leaf8({ len: 200, w: 80, x: 460 + i * 80, y: lerp(380, 820, EZ.i(q)), r: -30 + i * 30 + q * 90, op: 1 - clamp((q - .8) * 5) }) }
    return g(s, push8(t, T, .04))
  };
  // 8–9. «И триста лет травили им вредителей на грядках. Пока в 2009 Евросоюз его не запретил.» — грядка, лейка поливает, жуки падают;
  //      камера едет вдоль грядки; на «Евросоюз» — кольцо звёзд, на «запретил» — красный запрет, лейка падает
  const cab8b = (x, y, s = 1) => { let q = ''; [[-1, 0], [1, 0], [-.5, -.5], [.5, -.5], [0, -.8]].forEach(([dx, dy], i) => { const d = D_.ell(dx * 70, dy * 70, 90, 66); q += F(d, i < 2 ? C.navy3 : i < 4 ? '#3E55A0' : '#5068B6') + Ln(`M${dx * 70} ${dy * 70 + 40}Q${dx * 70 + 10} ${dy * 70} ${dx * 70 + dx * 40} ${dy * 70 - 40}`, 1, { c: C.paper, w: 3, op: .5 }) }); return g(SH(D_.ell(0, 10, 160, 80), { op: .3 }) + q, at(x, y, s)) };
  function garden(t, T, tBan, tStop) {
    const X = (t - T.a) * 170; // камера едет вправо
    let w = '';
    w += F(D_.rr(-400, 1080, 4400, 1000, 0), C.navy) + Ln('M-400 1080H4000', 1, { c: C.navy3, w: 4 });
    for (let i = 0; i < 9; i++) {
      const cx = 140 + i * 360; w += cab8b(cx, 1030, 1.1);
      const kd = P01(t, T.a + .5 + i * .32, .6);
      if (kd < 1) w += beetle8(t, { x: cx + 20, y: 930 + EZ.i(kd) * 240, s: .55, f: C.navy, r: kd * 140, op: 1 - clamp((kd - .6) * 2.5) });
    }
    // лейка идёт вместе с камерой
    const fall = E(t, tStop + .2, .6, 'i'), cxw = 540 + X - 120, cyw = 640 + fall * 900;
    w += can8({ x: cxw, y: cyw, r: 18 + fall * 60, f: C.navy3, f2: C.navy2, lc: C.paper, shc: C.navy, shOp: .25 });
    if (fall < .2) for (let i = 0; i < 10; i++) { const ph = (t * 1.8 + i / 10) % 1; w += F(D_.drop(cxw + 300 + ph * 50 + Math.sin(i) * 10, cyw - 50 + ph * 330, 12), C.amber) }
    if (tBan) {
      const ke = P01(t, tBan, .9);
      if (ke > 0) w += euRing8(cxw + 60, cyw - 60, 300, ke, { c: C.amber });
      w += ban8(cxw + 60, cyw - 60, 210, P01(t, tStop, .5), { w: 20 });
      if (t > tStop) cue(tStop + .05, 'stamp', .8);
    }
    return bgLight() + g(w, `translate(${R(-X)} 0)`)
  }
  D.garden = (t, S, T) => garden(t, T, 0, 99);
  D.ban = (t, S, T) => garden(t, SC.find(x => x.key === 'garden').T, T.c('Евросоюз') - .2, T.c('запретил') - .1);

  // ===== 10. «Тля выдохнула.» — тишина: крупно лист и тля, она «выдыхает» колечком =====
  const PUFF = [740, 760];
  D.aphid = (t, S, T) => {
    let s = bgDiag({ off: 40 });
    const lp = 'M-200 1000Q520 930 1280 1000L1280 2400L-200 2400Z';
    s += F(lp, C.navy3) + ht(lp, 'n', 'v', .5) + Ln('M-200 1200Q500 1120 1280 1180', 1, { c: C.paper, w: 3, op: .35 });
    const br = 1 + Math.sin(P01(t, T.v, 1.2) * PI) * .05;
    s += g(aphid8(t, { puff: P01(t, T.c('выдохнула'), 1.3) }), `translate(540 900) scale(${R(1.6 * br * 1000) / 1000} ${R(1.6 / br * 1000) / 1000})`);
    return g(s, push8(t, T, .06, 600, 860))
  };

  // ===== 11. «А вы выдыхаете до сих пор. Облаком со вкусом манго.» — облако из выдоха тли растёт → профиль человека, облако у рта; манго внутри =====
  const HEAD = [300, 900], MOUTH = [300 + 236 * 1.3, 900 + 40 * 1.3];
  D.exhale = (t, S, T) => {
    const z = lerp(4, 1, E(t, T.a, 1.4, 'io')), tm = T.c('манго') - .2;
    let s = bgDiag({ off: -t * 10 });
    let w = head8({ x: HEAD[0], y: HEAD[1], s: 1.3 });
    const kc = E(t, T.a, 1.2, 'o5');
    w += cloud8(lerp(560, 770, kc), lerp(820, 760, kc), lerp(1.6, 1.0, kc) + fl(t, .02, .3), { inner: t > tm ? mango8(0, 20, .55 * EZ.back(P01(t, tm, .5)), { r: -12 }) : '' });
    s += g(w, `translate(770 760) scale(${R(z * 1000) / 1000}) translate(-770 -760)`);
    return s
  };

  // ===== 12. «В мозге у вас такие же рецепторы, как у жука. Они так и называются — никотиновые.» — мозг крупно, рецепторы;
  //      жук внизу — те же чашечки, пунктир между ними; подпись «никотиновые» =====
  const BRC = [540, 600], RECS = [[-120, -60], [-60, -120], [20, -110], [90, -80], [140, -20], [-140, 20], [-60, 30], [40, 10], [100, 40], [-10, -40]];
  D.recep = (t, S, T) => {
    const tr = T.c('рецепторы') - .25, tj = T.c('жука') - .3, tn = T.c('никотиновые') - .3;
    let s = bgDiag({ off: -t * 12 });
    const kb = E(t, T.a, .9, 'o5');
    let br = brain8(t, { lines: kb, edge: kb });
    RECS.forEach(([x, y], i) => { br += rise8(rec8(0, 0, 1), x, y, t, tr + i * .05, { dy: 10, d: .35 }) });
    s += g(br, at(BRC[0], BRC[1], 2.2));
    const kj = P01(t, tj, .6);
    if (kj > 0) {
      s += rise8(beetle8(t, { s: 1 }) + rec8(-10, -50, 1.4), 300, 1110, t, tj, { s: .9 });
      const L = `M330 1030C380 920 400 820 ${BRC[0] - 132} ${BRC[1] + 44}`;
      s += Ln(L, E(t, tj + .3, .7, 'io'), { c: C.paper, w: 4, da: '2 14' });
      s += F(D_.circ(BRC[0] - 132, BRC[1] + 44, 34), 'none') + Ln(D_.circ(BRC[0] - 132, BRC[1] + 44, 34), E(t, tj + .8, .4), { c: C.amber, w: 4 }) + Ln(D_.circ(290, 1060, 40), E(t, tj + .8, .4), { c: C.amber, w: 4 });
    }
    if (t > tn) s += g(Ln('M690 1030H1010', E(t, tn, .5, 'o5'), { c: C.amber, w: 4 }) + cap8('никотиновые', 850, 1000, { s: 30, c: C.amber, ls: 6, op: E(t, tn + .1, .4) }), '');
    return g(s, push8(t, T, .04, 540, 700))
  };

  // ===== 13. «Одна затяжка — и примерно через 10 секунд никотин уже там.» — мозг уходит вверх-вправо, одноразка внизу;
  //      пунктирный путь, янтарная точка летит, кольцо-таймер 0 → 10 =====
  D.ten = (t, S, T) => {
    const tp = T.c('затяжка') - .2, tt = T.c('секунд') - .6, tth = T.c('там') - .15;
    const mv = E(t, T.a, .9, 'io'), bx = lerp(BRC[0], 720, mv), by = lerp(BRC[1], 460, mv), bs = lerp(2.2, 1.3, mv);
    let s = bgDiag({ off: -t * 12 });
    s += brain8(t, { x: bx, y: by, s: bs }) + g(RECS.map(([x, y]) => rec8(x, y, 1, { full: t > tth + .1 })).join(''), at(bx, by, bs));
    const kv = E(t, T.a + .3, .7, 'o5');
    s += vape8(t, { x: 260, y: lerp(1500, 1000, kv), s: .62, f: C.navy3, led: t > tp ? 1 : .2 });
    const path = `M300 820C300 600 420 560 ${bx - 120} ${by + 60}`;
    s += Ln(path, E(t, tp + .1, .6, 'io'), { c: C.paper, w: 4, da: '2 14' });
    const kd = clamp((t - tt) / (tth - tt));
    if (kd > 0 && kd < 1) { const p = pts(path, 120)[Math.floor(kd * 119)]; s += F(D_.circ(p[0], p[1], 16), C.amber) + F(D_.circ(p[0], p[1], 30), C.amber, { op: .25 }) }
    if (t > tth) { cue(tth, 'ding', .5); const q = P01(t, tth, .7); if (q < 1) s += Ln(D_.circ(bx, by, lerp(60, 380, EZ.o(q))), 1, { c: C.amber, w: 6 * (1 - q), op: 1 - q }) }
    const secs = Math.min(10, Math.floor(clamp(kd) * 10));
    if (t > tt - .3) s += ring8(780, 1040, 120, clamp(kd), { val: secs + ' с', vs: 64, op: E(t, tt - .3, .3) });
    return s
  };

  // ===== 14. «Мозг получает дофамин и запоминает, откуда он взялся.» — вспышка частиц дофамина; линия-«маршрут» от мозга вниз к одноразке, красная метка =====
  D.dopa = (t, S, T) => {
    const td = T.c('дофамин') - .25, tz = T.c('запоминает') - .2;
    let s = bgDiag({ off: -t * 12 });
    const mv = E(t, tz, .8, 'io'), by = lerp(640, 520, mv), bs = lerp(2.0, 1.55, mv);
    s += brain8(t, { x: 540, y: by, s: bs }) + g(RECS.map(([x, y]) => rec8(x, y, 1, { full: true })).join(''), at(540, by, bs));
    for (let i = 0; i < 26; i++) {
      const q = P01(t, td + (i % 5) * .06, 1.3); if (q <= 0 || q >= 1) continue;
      const a = rnd(i) * 2 * PI, d = 140 + EZ.o(q) * (220 + rnd(i + 4) * 260);
      s += F(D_.circ(540 + Math.cos(a) * d, by + Math.sin(a) * d * .8, (4 + rnd(i + 9) * 8) * (1 - q * .6)), i % 3 ? C.amber : C.paper, { op: 1 - q });
    }
    if (t > td) cue(td, 'shimmer', .6);
    const path = `M540 ${by + 180}C540 900 300 900 300 1110`;
    s += Ln(path, E(t, tz + .2, .8, 'io'), { c: C.paper, w: 4, da: '2 14' });
    s += rise8(vape8(t, { s: .42, f: C.navy3 }), 300, 1170, t, tz + .5, { dy: 60 });
    const kp = P01(t, tz + 1, .45);
    if (kp > 0) { s += pin8(300, lerp(860, 1040, EZ.back(kp)), 1, { op: clamp(kp * 3) }); cue(tz + 1.3, 'pin', .6) }
    return s
  };

  // ===== 15. «А дальше как с табаком: чем чаще затяжки, тем больше в мозге рецепторов.» — экран по диагонали: слева куст наливается,
  //      справа мозг — на каждую «затяжку» рецепторов становится больше =====
  const MANY = []; for (let i = 0; i < 46; i++) { const a = rnd(i * 3) * 2 * PI, r = Math.sqrt(rnd(i * 3 + 1)); const x = Math.cos(a) * r * 150, y = Math.sin(a) * r * 100 - 30; MANY.push([x, y]) }
  D.grow = (t, S, T) => {
    const ts = T.c('чаще') - .2, te = T.e;
    const puffs = [0, .25, .5, .75].map(u => lerp(ts, te - .4, u));
    const n = puffs.filter(p => t > p).length;
    let s = bgDiag({ off: -t * 12 });
    s += F(D_.poly([[-200, 1500], [1280, 260], [1280, 2400], [-200, 2400]]), C.navy, { op: .55 });
    s += Ln('M-200 1500L1280 260', E(t, T.a, .8), { c: C.line, w: 3, op: .5 });
    // куст сверху-слева
    s += g(plant8(t, { roots: 0, charge: lerp(.4, 1, n / 4), h: 900 }), at(300, 1040, .62));
    // мозг снизу-справа
    let br = brain8(t, {}); const cnt = 10 + n * 9;
    MANY.slice(0, cnt).forEach(([x, y], i) => { br += rise8(rec8(0, 0, .8), x, y, t, i < 10 ? T.a : puffs[Math.floor((i - 10) / 9)] + (i % 9) * .03, { dy: 6, d: .3 }) });
    s += g(br, at(720, 1040, 1.45));
    puffs.forEach((p, i) => { if (t > p) { cue(p, 'tick', .5); const q = P01(t, p, .5); if (q < 1) s += Ln(D_.circ(720, 1000, lerp(120, 330, EZ.o(q))), 1, { c: C.amber, w: 5 * (1 - q), op: 1 - q }) } });
    return s
  };

  // ===== 16. «И каждый просит ещё.» — крупно поверхность мозга: пустые рецепторы пульсируют всё чаще =====
  const BADGE = []; for (let i = 0; i < 26; i++) { const a = rnd(i * 5 + 2) * 2 * PI, r = Math.sqrt(rnd(i * 5 + 3)); BADGE.push([Math.cos(a) * r * 150, Math.sin(a) * r * 95 - 30]) }
  D.more = (t, S, T) => {
    let s = bgDiag({ c1: C.navy2, off: -t * 30 });
    const tq = T.c('ещё') - .2;
    let br = brain8(t, {}) + g(RECS.map(([x, y]) => rec8(x, y, 1, { full: true })).join(''), '');
    s += g(br, at(540, 780, 2.3 + E(t, T.a, T.b - T.a, 'io') * .3));
    // уведомления: появляются всё чаще (как на телефоне), числа растут; на «ещё» — 99+
    BADGE.forEach(([x, y], i) => {
      const ta = T.a + .05 + Math.pow(i / BADGE.length, .6) * (tq - T.a + .3), k = P01(t, ta, .3); if (k <= 0) return;
      const n = t > tq + .1 ? '99+' : String(1 + Math.floor((t - ta) * (3 + i))), w = n.length > 2 ? 86 : n.length > 1 ? 66 : 50;
      s += g(F(D_.rr(-w / 2, -25, w, 50, 25), C.red) + tx(n, 0, 11, { f: 'M', w: 800, s: 30, c: '#fff' }), at(540 + x * 2.5, 780 + y * 2.5, EZ.back(k) * (1 + .1 * Math.sin((t - ta) * 9))));
      if (i % 5 === 0) cue(ta, 'tick', .35);
    });
    if (t > tq) cue(tq, 'heart', .7);
    return g(s, push8(t, T, .1, 540, 780))
  };

  // ===== 17. «Так оружие табака переехало к вам в карман.» — лист-оружие превращается в одноразку и уходит в карман джинсов =====
  D.pocket = (t, S, T) => {
    const tw = T.c('переехало') - .3, tk = T.c('карман') - .3;
    let s = BG(C.navy2) + pocket8(1000);
    const km = E(t, tw, .6, 'io'), kin = E(t, tk, .7, 'io');
    const y = lerp(560, 1180, kin), clipY = 1000;
    const id = uid();
    let obj = km < 1 ? g(F(morph(leafPathC, VAPE_P(200, 520), km), km < .5 ? C.amber : C.night) + (km < .3 ? Ln('M0 270L0 -270M0 120L90 40M0 120L-90 40M0 -20L80 -100M0 -20L-80 -100', 1, { c: C.night, w: 5, op: .5 * (1 - km * 3) }) : ''), at(540, y, lerp(1.25, 1, km))) : vape8(t, { x: 540, y, f: C.night, led: .6 + .4 * Math.sin(t * 5), shadow: false });
    s += `<clipPath id="${id}"><path d="M-200 -400H1280V${clipY + 6}H-200Z"/></clipPath><g clip-path="url(#${id})">${obj}</g>`;
    return g(s, push8(t, T, .05, 540, 1000))
  };
  const leafPathC = (() => { const len = 560, w = 210; return `M0 ${len / 2}C${R(w * .95)} ${R(len / 2 - len * .12)} ${R(w * .9)} ${R(len / 2 - len * .7)} 0 ${-len / 2}C${R(-w * .9)} ${R(len / 2 - len * .7)} ${R(-w * .95)} ${R(len / 2 - len * .12)} 0 ${len / 2}Z` })();

  // ===== 18. «Каждый год табак убивает больше 7 миллионов человек.» — камера отъезжает от одного человечка: толпа, огоньки гаснут; число растёт =====
  const CROWD = []; for (let r = -14; r <= 14; r++) for (let c = -9; c <= 9; c++) CROWD.push([540 + c * 92 + (r % 2 ? 46 : 0), 760 + r * 104, rnd(r * 31 + c * 7)]);
  D.toll = (t, S, T) => {
    const z = lerp(3.2, .55, E(t, T.a, T.e - T.a + .4, 'io')), tn = T.c('миллионов') - .6;
    let s = bgDiag({ off: -t * 10 });
    let w = '';
    CROWD.forEach(([x, y, r]) => { const off = t > tn + r * 1.4; w += man8(x, y, 1, off ? C.navy3 : C.paper, off ? .7 : 1) });
    s += g(w, `translate(540 ${CY}) scale(${R(z * 1000) / 1000}) translate(-540 -760)`);
    const v = Math.round(7e6 * E(t, tn, 1.4, 'o'));
    if (t > tn) s += tx(v.toLocaleString('ru-RU').replace(/\u00a0/g, ' ') + (v >= 7e6 ? '+' : ''), 540, 385, { f: 'M', w: 800, s: 112, c: C.night, st: C.night, sw: 30 }) + tx(v.toLocaleString('ru-RU').replace(/ /g, ' ') + (v >= 7e6 ? '+' : ''), 540, 385, { f: 'M', w: 800, s: 112, c: C.red });
    return s
  };

  // ===== 19. «Признайтесь, вы ведь сейчас тоже захотели затянуться.» — темно, только огонёк одноразки из кармана =====
  D.end = (t, S, T) => {
    const tz = T.c('затянуться') - .2;
    let s = BG(C.night);
    s += g(pocket8(1000), '', .25 + .1 * E(t, tz, .6));
    const id = uid();
    const lv = .45 + .55 * (t > tz ? 1 : .5 + .5 * Math.sin(t * 3));
    s += F(D_.circ(540, 974, 90), C.amber, { op: .08 * lv }) + F(D_.circ(540, 974, 50), C.amber, { op: .12 * lv });
    s += `<clipPath id="${id}"><path d="M-200 -400H1280V1006H-200Z"/></clipPath><g clip-path="url(#${id})">${vape8(t, { x: 540, y: 1180, f: C.navy, led: lv, shadow: false })}</g>`;
    if (t > tz) { const q = P01(t, tz, 1.2); s += Ln(D_.circ(540, 974, lerp(30, 260, EZ.o(q))), 1, { c: C.amber, w: 4 * (1 - q), op: 1 - q }) }
    return g(s, push8(t, T, .08, 540, 974))
  };

  // ===== 20. «В профиле — как никотином откачивали утопленников и почему гусеница парит.» =====
  D.cta = (t, S, T) => cta8(t, T, [{ k: 'thames', t: ['Как откачивали', 'утопленников'] }, { k: 'cat', t: ['Гусеница,', 'которая парит'] }]);

  // год 1690 → 2009 поверх сцен истории
  function over(t) {
    const a = SC.find(x => x.key === 'y1690'), b = SC.find(x => x.key === 'ban'); if (!a || !b) return '';
    if (t < a.a || t > b.b) return '';
    const t9 = b.T.c('2009') - .3, tg = SC.find(x => x.key === 'garden').T.c('триста') - .2;
    const v = t < tg ? 1690 : lerp(1690, 2009, E(t, tg, t9 - tg + .2, 'io'));
    const kin = E(t, a.a + .1, .6, 'o5'), kout = E(t, b.b - .5, .4, 'i');
    return g(yearRoll(v, 540, 430, { s: 190, c: C.navy }) + Ln('M330 470H750', kin, { c: C.amber, w: 6 }), `translate(0 ${R(-kout * 300)})`, kin * (1 - kout))
  }

  window.EP = {
    P, D, clean: true, lead: .2, defs: V8DEFS, over,
    cap: { size: 58, top: 1360, hi: C.amber, st: '#0B1028' },
    tr: { title: 'zc', common: 'dive', claim: 'into', leaf: 'dive', bite: 'into', reply: 'wave', y1690: 'cut', garden: 'cut', ban: 'dive', aphid: 'zc', exhale: 'dive', recep: 'cut', ten: 'out', dopa: 'out', grow: 'dive', more: 'wave', pocket: 'into', toll: 'zc', end: 'wave' },
    trCols: { more: [C.navy3, C.amber, C.navy], end: [C.amber, C.paper, C.navy3] },
    trAt: { dopa: [540, 520], title: DROP, common: LED, claim: [APH3[0], 1170], leaf: [700, 520], bite: [700, 990], ban: [1040, 1030], aphid: PUFF, exhale: [330, 760], ten: [720, 460], grow: [720, 1010], pocket: [540, 1000], toll: [540, 760] },
    trR: { common: 15, leaf: 90, ban: 70, exhale: 120, grow: 110 },
    trTo: { claim: APH4, bite: [700, 520], pocket: [540, 760] },
    trCol: { title: C.amber, aphid: C.paper, toll: C.night, claim: C.paper, bite: C.paper, pocket: C.paper },
    trBg: { common: C.night, leaf: C.night, ban: C.night, exhale: C.night, grow: C.navy2 },
    trDur: { title: .7, reply: .95, toll: .8 },
    init() {
      const st = document.createElement('style');
      st.textContent = '#cap{font-weight:800!important;letter-spacing:0!important;text-shadow:0 0 2px #0B1028,0 3px 0 #0B1028,0 0 14px rgba(11,16,40,.85),2px 2px 0 #0B1028,-2px 2px 0 #0B1028,2px -2px 0 #0B1028,-2px -2px 0 #0B1028!important}#cap .u{color:#F4EFE6!important;opacity:.55}';
      document.head.appendChild(st);
    }
  };
})();
