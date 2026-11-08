// «Табак приручил людей» — пилот v4 (RU): рисовка кодом, целые сцены с глубиной и светом, всё время что-то движется.
(function () {
  const C = { bg: '#0E1B24', bg2: '#1E3A33', ink: '#0B1612', paper: '#F3EBD9', line: '#F3EBD9', a1: '#E9A23B', a2: '#D9483B', a3: '#F2C14E', leaf: '#5E9E5A', leaf2: '#3F7A45', leaf3: '#7DBB6E', smoke: '#D6DDD8', skin: '#E9B48F', sea: '#2C6E8A' };
  P = C;
  const cam = (t, T, a = .05, cx = 540, cy = 860) => about(cx, cy, 1 + a * EZ.io(P01(t, T.a, T.b - T.a + .5)));
  const D = {};
  const LEAF = D_.leaf(250, 1240, 980, 310, -62, .1);
  const CIG = D_.tf(D_.rrp(860, 96, 40), 560, 880, -28);
  const veins = (k = 1) => { const a = -62 * Math.PI / 180, cx = Math.cos(a), sy = Math.sin(a), bx = 250, by = 1240; let d = `M${bx} ${by}Q${R(bx + cx * 490 + 30)} ${R(by + sy * 490)} ${R(bx + cx * 980)} ${R(by + sy * 980)}`; for (let i = 1; i < 7; i++) { const u = i / 7.5, px = bx + cx * 980 * u + 10, py = by + sy * 980 * u, l = 230 * Math.sin(u * Math.PI) + 40; d += `M${R(px)} ${R(py)}Q${R(px + 60)} ${R(py - 10)} ${R(px + l * .9)} ${R(py + l * .25)}M${R(px)} ${R(py)}Q${R(px - 50)} ${R(py - 40)} ${R(px - l * .55)} ${R(py - l * .6)}` } return line(d, k, { c: C.line, w: 6, op: .7 }) };
  const bigLeaf = (t, k = 1, glowK = 0) => g((glowK ? glow(560, 760, 520, C.a3, .18 * glowK) : '') + gfill(LEAF, C.leaf3, C.leaf2, 1, 0, 0, 1) + ink(LEAF, { f: null, c: C.line, w: 8, k }) + dots(LEAF, { c: C.leaf2, step: 16, x0: 900, y0: 400, x1: 300, y1: 1100, op: .55 }) + veins(clamp(k * 1.2 - .2)), about(250, 1240, 1, wob(t, .22, 1.6)));
  // табачный куст: стебель, листья, розовые цветы; sw — покачивание
  function plant(x, y, s, t, o = {}) {
    let q = ''; const sw = wob(t, .3, 3, x * .01);
    q += line(`M0 0C6 -120 ${-6 + sw} -260 ${sw * 2} -420`, 1, { c: o.c || C.ink, w: 12 });
    [[0, -60, 230, 80, -14], [0, -100, 230, 78, -166], [2, -190, 200, 70, -24], [0, -230, 190, 66, -156], [4, -320, 150, 52, -36], [2, -350, 140, 48, -146]].forEach(([lx, ly, l, w0, a], i) => { const d = D_.leaf(lx + sw * (i / 6), ly, l, w0, a + sw * .6, .15); q += gfill(d, i % 2 ? C.leaf3 : C.leaf, C.leaf2, 0, 0, 1, 1) + line(d, 1, { c: o.c || C.ink, w: 5 }) });
    for (let i = 0; i < 4; i++) q += g(ink('M0 0L-14 -46L14 -46Z', { f: '#F49AB5', c: o.c || C.ink, w: 4, dx: 2, dy: 2 }) + fill(D_.star(0, -54, 22, 10, 5), '#F7B8CB'), at(sw * 2 - 30 + i * 20, -420 + (i % 2) * 14, 1, -24 + i * 16));
    return g(q, at(x, y, s), o.op ?? 1)
  }
  const smokeP = (x, y, t, n = 6, sc = 1, col = C.smoke, sp = .45) => { let s = ''; for (let i = 0; i < n; i++) { const ph = (t * sp + i / n) % 1, yy = y - ph * 340 * sc, xx = x + Math.sin(ph * 6 + i * 2) * 36 * sc; s += `<circle cx="${R(xx)}" cy="${R(yy)}" r="${R((14 + ph * 46) * sc)}" fill="${col}" opacity="${R((1 - ph) * .55 * 100) / 100}"/>` } return s };
  const fireflies = (t, n = 14) => { let s = ''; for (let i = 0; i < n; i++) { const x = (rnd(i) * 1080 + Math.sin(t * .6 + i) * 60) % 1080, y = 700 + rnd(i + 20) * 600 + Math.cos(t * .8 + i * 2) * 40; s += glow(x, y, 26, C.a3, .5 * (.5 + .5 * Math.sin(t * 3 + i))) } return s };
  // человечек-силуэт идёт (шаг ногами)
  function walker(x, y, s, t, col, ph = 0) { const st = Math.sin(t * 7 + ph) * 18; return g(fill(D_.circ(0, -150, 24), col) + fill('M-26 -124H26L30 -50H-30Z', col) + line(`M-12 -52L${R(-12 + st)} 0M12 -52L${R(12 - st)} 0`, 1, { c: col, w: 14 }) + line(`M-26 -110L${R(-40 - st * .6)} -64M26 -110L${R(40 + st * .6)} -64`, 1, { c: col, w: 11 }), at(x, y, s)) }

  D.title = (t, S, T) => {
    let s = sky('#0B1620', '#1E3A33', 0, 1500) + stars(t, 40, 800) + glow(800, 400, 260, '#FFF3C9', .25) + fill(D_.circ(800, 400, 110), '#F6EBC8') + dots(D_.circ(800, 400, 110), { c: '#D9C79B', step: 12, x0: 900, y0: 480, x1: 760, y1: 330, op: .6 });
    s += fill('M0 900C200 830 420 870 620 820C800 780 960 830 1080 800V1920H0Z', '#16302A') + fill('M0 1000C260 950 520 990 760 950C900 930 1000 950 1080 940V1920H0Z', '#1C3C33');
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9 - r * 2; i++) s += plant(60 + i * (1080 / (9 - r * 2)) + r * 30, 960 + r * 90, .22 + r * .1, t, { op: .55 + r * .15 });
    s += bigLeaf(t, clamp(.3 + t / .9), 1) + fireflies(t);
    s += cap('Что вы знаете о', 540, 300, { c: C.paper, st: C.ink, op: E(t, 0, .4) });
    s += rise('ТАБАКЕ?', 540, 1300, t, .12, { f: 'U', w: 800, s: 110, c: C.a3, st: C.ink, sw: 16 });
    return g(s, cam(t, T, .06, 540, 760));
  };

  D.leaf = (t, S, T) => {
    const tc = T.c('сигареты?', 0, 1.2), k1 = E(t, tc - .35, .55, 'io');
    let s = sky('#0B1620', '#1E3A33', 0, 1500) + stars(t, 40, 800) + glow(800, 400, 260, '#FFF3C9', .25) + fill(D_.circ(800, 400, 110), '#F6EBC8');
    s += fill('M0 900C200 830 420 870 620 820C800 780 960 830 1080 800V1920H0Z', '#16302A') + fill('M0 1000C260 950 520 990 760 950C900 930 1000 950 1080 940V1920H0Z', '#1C3C33');
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9 - r * 2; i++) s += plant(60 + i * (1080 / (9 - r * 2)) + r * 30, 960 + r * 90, .22 + r * .1, t, { op: .55 + r * .15 });
    if (k1 <= 0) s += bigLeaf(t, 1, 1);
    else if (k1 < 1) s += ink(morph(LEAF, CIG, k1), { f: k1 > .5 ? C.paper : C.leaf, c: C.line, w: 8 });
    else {
      s += g(fill(D_.rr(-430, -48, 860, 96, 40), C.paper) + fill(D_.rr(-430, -48, 250, 96, 30), C.a1) + dots(D_.rr(-430, -48, 250, 96, 30), { c: '#B26F1F', step: 12, op: .6 }) + line('M-180 -48V48', 1, { c: C.ink, w: 5 }) + fill(D_.rr(380, -48, 50, 96, 22), '#8A8F96') + line(D_.rr(-430, -48, 860, 96, 40), 1, { c: C.line, w: 8 }) + shine(-100, -30, 300, 0, 7, '#FFFFFF', .7), 'translate(560 880) rotate(-28)');
      const ex = 560 + Math.cos(-28 * Math.PI / 180) * 430, ey = 880 + Math.sin(-28 * Math.PI / 180) * 430, kl = E(t, tc + .2, .3);
      s += glow(ex, ey, 90 * kl, '#FF7A2A', .8) + `<circle cx="${R(ex)}" cy="${R(ey)}" r="${R(26 * kl)}" fill="#FF5A1F" opacity="${R((.7 + .3 * Math.sin(t * 12)) * kl * 100) / 100}"/>` + smokeP(ex, ey - 20, t, 8, 1.3);
    }
    s += fireflies(t);
    return g(s, cam(t, T, .05, 540, 760));
  };

  D.claim = (t, S, T) => {
    const tp = T.c('приручил', 0, 1.6);
    let s = sky('#2A1E3A', '#E08A5A', 0, 1300) + glow(540, 1050, 520, '#FFD39A', .45);
    s += fill('M0 1180C300 1150 760 1170 1080 1140V1920H0Z', '#2B2A22') + fill('M0 1260H1080V1920H0Z', '#1E1D18');
    const kp = E(t, T.a, 1.2, 'o5');
    s += plant(300, 1220, 2.1 * (.6 + .4 * kp), t, { c: C.ink });
    const hx = 300 + 2.1 * 200, hy = 1220 - 2.1 * 230;
    for (let i = 0; i < 5; i++) { const px = 560 + i * 105 + wob(t, .5, 6, i), py = 1250; s += line(`M${R(hx)} ${R(hy)}Q${R((hx + px) / 2)} ${R(hy + 260 + i * 20)} ${R(px)} ${R(py - 110)}`, 1, { c: C.ink, w: 4, op: .9 }) + walker(px, py, .9, t, C.ink, i) }
    s += stamp('ПРИРУЧИЛ', 560, 560, t, tp - .1, { c: C.a2, s: 96, r: -8 });
    return g(s, cam(t, T, .06, 520, 900));
  };

  D.poison = (t, S, T) => {
    const tn = T.c('парализует', 0, 1.6), tw = T.c('целыми.', 0, 4.5);
    let s = sky('#0F2620', '#1E3A33') + glow(540, 800, 600, C.leaf3, .12);
    const id = uid(), bites = t > tn - .6 ? D_.circ(700, 560, 60) + D_.circ(660, 520, 46) : '';
    s += `<mask id="${id}"><rect width="1080" height="1920" fill="#fff"/><path d="${bites}" fill="#000"/></mask><g mask="url(#${id})">${bigLeaf(t, 1, E(t, tw - .3, .5))}</g>`;
    // гусеница: цепочка сегментов
    const walk = clamp((t - T.a) / Math.max(.4, tn - .7 - T.a)), fr = t > tn, fall = E(t, tn + .6, 1, 'i');
    const hx = lerp(1120, 760, EZ.o(walk)), hy = lerp(380, 520, EZ.o(walk)) + fall * 900;
    let cat = ''; for (let i = 7; i >= 0; i--) { const wv = fr ? 0 : Math.sin(t * 9 - i * .8) * 10; cat += ink(D_.circ(i * 34, wv - (i === 0 ? 4 : 0), i === 0 ? 34 : 30), { f: i === 0 ? '#9BCB6B' : (i % 2 ? '#7DB35A' : '#8CC266'), c: C.line, w: 5, dx: 4, dy: 3 }) }
    cat += `<circle cx="-12" cy="-12" r="7" fill="${C.ink}"/>` + (fr ? line('M-22 -22L-4 -4M-4 -22L-22 -4', 1, { c: C.ink, w: 4 }) : '');
    s += g(cat, at(hx, hy, 1.2, -18 + fall * 120));
    if (t > tn - .1 && t < tn + .9) { for (let i = 0; i < 6; i++) { const a = rnd(Math.floor(t * 14) + i) * Math.PI * 2; let d = `M${R(hx + Math.cos(a) * 40)} ${R(hy + Math.sin(a) * 40)}`; for (let j = 1; j < 5; j++) d += `L${R(hx + Math.cos(a) * (40 + j * 34) + (rnd(i * 9 + j + Math.floor(t * 14)) - .5) * 40)} ${R(hy + Math.sin(a) * (40 + j * 34) + (rnd(i * 7 + j) - .5) * 40)}`; s += line(d, 1, { c: C.a3, w: 7 }) } }
    s += cap('никотин', 820, 1180, { c: C.a3, st: C.ink, op: E(t, tn, .4) * (1 - E(t, tw, .4)) });
    if (t > tw - .3) s += stamp('ЦЕЛЫЕ', 560, 1150, t, tw - .2, { c: C.a3, s: 84, r: -6 });
    return g(s, cam(t, T, .07, 700, 600));
  };

  D.columbus = (t, S, T) => {
    const pan = E(t, T.a + .6, Math.max(1, T.c('листьев.', 0, 5) - T.a - .4), 'io'), ox = -560 * pan;
    let s = sky('#F2C8A0', '#7FB7D0', 0, 900) + glow(300 + ox * .3, 600, 300, '#FFF1CF', .6) + fill(D_.circ(300 + ox * .3, 640, 90), '#FFF1CF');
    let w = '';
    // остров справа
    w += fill('M1000 980C1080 900 1400 880 1600 950L1640 1000H980Z', '#E9D3A2') + fill('M1060 960C1160 880 1360 860 1520 930C1420 950 1200 960 1060 960Z', '#5E9E5A');
    const palm = (x, y, sc) => { let q = line(`M0 0C10 -120 -10 -230 20 -330`, 1, { c: '#5A3A22', w: 16 }); for (let i = 0; i < 6; i++) q += gfill(D_.leaf(20, -330, 170, 44, -170 + i * 34 + wob(t, .4, 4, i), .25), '#5E9E5A', '#2F6B45', 0, 0, 1, 1); return g(q, at(x, y, sc)) };
    w += palm(1180, 960, 1) + palm(1440, 950, .85);
    // костёр и двое у огня
    w += fill('M1310 945L1330 905L1350 945Z', '#FF7A2A') + glow(1330, 925, 60, '#FF9A3A', .7) + smokeP(1330, 900, t, 7, 1.2, '#E8E2D6', .35);
    w += g(fill(D_.circ(0, -110, 22), '#7A4A2C') + fill('M-26 -86C-30 -40 -22 -10 -16 0H16C22 -10 30 -40 26 -86Z', '#7A4A2C') + line('M20 -96L52 -110', 1, { c: '#7A4A2C', w: 9 }) + smokeP(58, -116, t, 4, .5, '#EDE6D9', .6), at(1250, 958)) + g(fill(D_.circ(0, -100, 20), '#6B4026') + fill('M-24 -78C-28 -36 -20 -8 -14 0H14C20 -8 28 -36 24 -78Z', '#6B4026'), at(1410, 958));
    // море — полосы волн
    for (let i = 0; i < 6; i++) { const y = 980 + i * 70; let d = `M-40 ${y}`; for (let x = -40; x <= 1700; x += 40) d += `L${x} ${R(y + Math.sin(x / 70 + t * 2 + i) * 8)}`; d += `L1700 1920L-40 1920Z`; w += fill(d, ['#2C6E8A', '#2A6680', '#265D75', '#22546A', '#1F4B60', '#1B4255'][i]) }
    // каравелла
    const sx = lerp(-200, 420, E(t, T.a, 2.4, 'o')), bob = wob(t, .5, 3);
    let ship = gfill('M-220 0C-200 70 200 70 240 0L190 -40H-170Z', '#7A4A2C', '#4A2C18', 0, 0, 0, 1) + line('M-220 0C-200 70 200 70 240 0', 1, { c: C.ink, w: 6 }) + fill(D_.rr(-190, -100, 110, 64, 8), '#6B4026') + line('M-130 -40V-430M10 -40V-470M150 -40V-360', 1, { c: '#4A2C18', w: 10 });
    for (const [mx, top, h0] of [[-130, -410, 200], [10, -450, 230], [150, -340, 160]]) ship += gfill(`M${mx - 90} ${top}Q${mx} ${top - 26} ${mx + 90} ${top}L${mx + 80} ${top + h0}Q${mx} ${top + h0 + 30} ${mx - 80} ${top + h0}Z`, '#FBF4E4', '#E3D6B8', 0, 0, 1, 1) + line(`M${mx} ${top + 30}V${top + h0 - 10}M${mx - 50} ${top + h0 / 2}H${mx + 50}`, 1, { c: C.a2, w: 12 });
    ship += line('M10 -470L60 -470', 1, { c: C.a2, w: 8 });
    w += g(ship, at(sx, 1000, .8, bob));
    s += g(w, `translate(${R(ox)} 0)`);
    s += tx('1492', 540, 330, { f: 'O', s: 130, w: 700, c: C.paper, st: C.ink, sw: 16, op: E(t, T.c('1492', 0, .3), .4) });
    return g(s, cam(t, T, .04, 540, 900));
  };

  D.jerez = (t, S, T) => {
    const tn = T.c('соседи', 0, 3.4), ti = T.c('инквизиция', 0, 5.3), t7 = T.c('семь', 0, 6.9), tout = T.s(1), kOut = E(t, tout - .1, .6);
    let s = sky('#0C1230', '#2A2350', 0, 1200) + stars(t, 30, 700) + fill(D_.circ(860, 330, 70), '#F6EBC8');
    // улица: два ряда домов
    const house = (x, y, w0, h0, col, k) => { let q = gfill(D_.rr(x, y - h0, w0, h0, 4), col, '#3A2E40', 0, 0, 0, 1) + fill(D_.poly([[x - 16, y - h0], [x + w0 / 2, y - h0 - 70], [x + w0 + 16, y - h0]]), '#8A3B2C'); for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) { const wx = x + 30 + i * (w0 - 100) / 1, wy = y - h0 + 50 + j * 140; q += fill(D_.rr(wx, wy, 60, 80, 30), '#FFC56B', .9) + line(D_.rr(wx, wy, 60, 80, 30), 1, { c: C.ink, w: 4 }); if (kOut > 0) q += smokeP(wx + 30, wy - 4, t + i + j, 4, .55, '#D8D2C8', .5) } return q };
    s += house(-20, 1080, 260, 420, '#6B5A7A') + house(250, 1060, 220, 360, '#7A6A8A') + house(840, 1080, 260, 440, '#6B5A7A') + house(620, 1070, 230, 330, '#7A6A8A');
    s += fill('M0 1080H1080V1920H0Z', '#2A2438') + line('M540 1080L-200 1920M540 1080L1280 1920', 1, { c: '#3C3450', w: 4 });
    // соседи в окнах
    for (let i = 0; i < 3; i++) { const k = E(t, tn + i * .15, .35, 'back'); if (k > 0 && kOut < 1) s += g(bust(0, 0, { s: .2, f: ['#8A5A9A', '#5A7A9A', '#9A6A5A'][i], mood: 'o', plain: true, hair: i === 1 ? 'long' : 'short', hairC: '#2B1E16' }), at([110, 900, 680][i], [790, 800, 830][i], k)) }
    // Херес с дымом
    const rod = bust(0, 0, { s: .95, f: '#7A3B2C', plain: true, mood: t > ti ? 'sad' : 'calm', hairC: '#2B1E16', extra: line('M-40 -372Q0 -350 40 -372', 1, { c: '#2B1E16', w: 12 }) + fill('M-150 -560C-120 -660 120 -670 150 -560C80 -585 -80 -585 -150 -560Z', '#2B1E16') });
    s += g(rod, at(540, 1500 + E(t, tout, .5) * 0));
    if (t < ti) s += smokeP(560, 1150, t, 9, 1.5, '#E8E2D6', .5);
    // решётка инквизиции
    const kb = E(t, ti - .1, .35, 'o5') * (1 - kOut);
    if (kb > 0) { s += `<rect width="1080" height="1920" fill="#5A0E14" opacity="${R(kb * .35 * 100) / 100}"/>`; for (let i = 0; i < 8; i++) s += fill(D_.rr(70 + i * 130, -60 + (1 - kb) * -1900, 34, 1700, 17), '#1A1418') + shine(78 + i * 130, 200, 900, 90, 5, '#5A5060', .6) }
    const k7 = E(t, t7 - .25, .45, 'back');
    if (k7 > 0 && kOut < 1) s += g(fill(D_.rr(-170, -80, 340, 160, 30), C.paper) + fill(D_.rr(-170, -80, 340, 50, 30), C.a2) + tx('7 ЛЕТ', 0, 52, { f: 'O', s: 80, w: 700, c: C.ink }), at(780, 420, k7, 6), 1 - kOut);
    s += cap('по легенде', 540, 300, { c: C.a3, st: C.ink, op: E(t, T.c('легенде,', 0, 2.6), .4) * (1 - kOut) });
    if (kOut > 0) s += tx('ВСЯ ИСПАНИЯ', 540, 330, { f: 'O', s: 84, w: 700, c: C.paper, st: C.ink, sw: 14, op: kOut });
    return g(s, cam(t, T, .05, 540, 900));
  };

  D.queen = (t, S, T) => {
    const tl = T.c('отправил', 0, 2.4), tm = T.c('мигрени.', 0, 6), tf = T.s(1);
    let s = sky('#3A1420', '#1C0E16', 0, 1600);
    for (let i = 0; i < 3; i++) { const x = 140 + i * 400; s += gfill(`M${x} 1000V560A120 120 0 0 1 ${x + 240} 560V1000Z`, '#F6D9A0', '#9A6A40', 0, 0, 0, 1, .5) + line(`M${x} 1000V560A120 120 0 0 1 ${x + 240} 560V1000Z`, 1, { c: C.a3, w: 6, op: .6 }) + cone(x + 120, 480, 100, 40, 1100, '#FFE9B0', .14) }
    s += fill('M0 1080H1080V1920H0Z', '#2A1218');
    for (let j = 0; j < 6; j++) for (let i = 0; i < 9; i++) if ((i + j) % 2) s += fill(D_.poly([[i * 120 + (j * 40 - 100), 1080 + j * 70], [i * 120 + 120 + (j * 40 - 100), 1080 + j * 70], [i * 120 + 120 + ((j + 1) * 40 - 100), 1150 + j * 70], [i * 120 + ((j + 1) * 40 - 100), 1150 + j * 70]]), '#3A1C24');
    const ruff = (() => { let q = ''; for (let i = 0; i < 18; i++) { const a = Math.PI * (i / 17), x = Math.cos(a) * 170, y = -260 - Math.sin(a) * 40; q += fill(D_.circ(x, y, 36), '#FBF7EE') + line(D_.circ(x, y, 36), 1, { c: '#CFC6B4', w: 3 }) } return q })();
    const pain = t > tm - 1.2 && t < tf ? (Math.sin(t * 18) > 0 ? 'tense' : 'sad') : 'calm';
    s += g(bust(0, 0, { s: 1, f: '#1E1A22', plain: true, skin: '#F2D3C2', hair: 'buzz', hairC: '#3A2418', mood: pain, under: ruff, extra: fill('M-110 -560C-80 -640 80 -640 110 -560L90 -600L60 -580L30 -610L0 -585L-30 -610L-60 -580L-90 -600Z', C.a3) + line('M-110 -560H110', 1, { c: '#B0862E', w: 6 }) }), at(560, 1520));
    if (pain !== 'calm') for (let i = 0; i < 3; i++) s += line(`M${700 + i * 30} ${600 - i * 40}l20 -20l-14 -10l24 -24`, 1, { c: C.a2, w: 7 });
    const ke = clamp((t - tl + .2) / 1.2), ex = lerp(-150, 330, EZ.o(ke)), ey = lerp(500, 980, EZ.o(ke));
    if (ke > 0) s += g(ink(D_.rr(-110, -70, 220, 140, 10), { f: '#FBF4E4', c: C.ink, w: 6 }) + line('M-110 -70L0 10L110 -70', 1, { c: C.ink, w: 6 }) + fill(D_.circ(0, 12, 22), C.a2), at(ex, ey, 1, (1 - ke) * 40));
    s += tx('1560', 540, 330, { f: 'O', s: 120, w: 700, c: C.a3, st: C.ink, sw: 14, op: E(t, T.c('1560', 0, .3), .4) * (1 - E(t, tf, .4)) });
    if (t > tf - .2) { for (let i = 0; i < 3; i++) { const k = E(t, tf + i * .15, .4, 'back'); s += g(bust(0, 0, { s: .32, f: ['#4A2A6A', '#2A4A6A', '#6A2A3A'][i], plain: true, mood: 'smile', hair: i === 1 ? 'long' : 'short', hairC: '#2B1E16', extra: fill('M-150 -560C-120 -640 120 -650 150 -560Z', '#1A1418') + fill('M120 -600C180 -680 200 -640 170 -590Z', '#F2E6C8') }), at([150, 930, 820][i], [1260, 1300, 1150][i], k)) } s += cap('мода при дворе', 540, 330, { c: C.a3, st: C.ink, op: E(t, tf + .3, .4) }) }
    return g(s, cam(t, T, .05, 560, 900));
  };

  D.russia = (t, S, T) => {
    const tz = T.c('«чёртовым', 0, 1.2), t49 = T.c('1649', 0, 3.4), tn = T.c('ноздри.', 0, 5.8);
    let s = sky('#B9C6D6', '#E8E4DC', 0, 1100);
    // купола и стена
    const dome = (x, y, sc, col) => g(fill('M-40 0V-200H40V0Z', '#F2E9D8') + gfill('M-60 -200C-70 -260 -10 -300 0 -360C10 -300 70 -260 60 -200Z', col, '#B07A1E', 0, 0, 1, 1) + line('M0 -360V-420M-18 -400H18', 1, { c: '#B07A1E', w: 6 }), at(x, y, sc));
    s += dome(150, 940, 1.0, '#F2C14E') + dome(940, 900, 1.25, '#F2C14E') + dome(330, 960, .75, '#5EA36A') + dome(770, 960, .7, '#5EA36A');
    let wall = gfill('M0 960H1080V1250H0Z', '#B0473A', '#7A2A22', 0, 0, 0, 1); for (let i = 0; i < 14; i++) wall += fill(`M${i * 80} 960V920H${i * 80 + 14}L${i * 80 + 26} 940L${i * 80 + 38} 920H${i * 80 + 52}V960Z`, '#B0473A');
    for (let j = 0; j < 5; j++) for (let i = 0; i < 14; i++) wall += line(`M${i * 80 + (j % 2) * 40} ${990 + j * 50}h60`, 1, { c: '#7A2A22', w: 3, op: .6 });
    s += wall + fill('M0 1250H1080V1920H0Z', '#EDEAE4');
    for (let i = 0; i < 40; i++) { const x = (rnd(i) * 1100 + Math.sin(t + i) * 30) % 1100, y = (rnd(i + 9) * 1900 + t * 120 * (.6 + rnd(i + 3) * .6)) % 1900; s += `<circle cx="${R(x)}" cy="${R(y)}" r="${R(3 + rnd(i) * 4)}" fill="#FFFFFF" opacity=".85"/>` }
    // указ-свиток
    const ku = E(t, tz - .3, .8, 'io');
    if (ku > 0) s += g(ink(D_.rr(-300, -40, 600, 80 + 400 * ku, 10), { f: '#F4E6C2', c: C.ink, w: 6 }) + (ku > .6 ? tx('ЧЁРТОВО', 0, 120, { f: 'O', s: 78, w: 700, c: C.a2 }) + tx('ЗЕЛЬЕ', 0, 210, { f: 'O', s: 78, w: 700, c: C.a2 }) + line('M-220 280H220M-220 330H160M-220 380H200', 1, { c: C.ink, w: 8, op: .3 }) : '') + ink(D_.rr(-330, -60, 660, 50, 25), { f: '#D9C08A', c: C.ink, w: 6 }) + ink(D_.rr(-330, 20 + 400 * ku, 660, 50, 25), { f: '#D9C08A', c: C.ink, w: 6 }), at(540, 250, .78, -2));
    s += tx('1649', 820, 1180, { f: 'O', s: 90, w: 700, c: C.paper, st: C.ink, sw: 14, op: E(t, t49, .4) });
    s += stamp('ЗАПРЕТ', 540, 1120, t, tn - .2, { c: C.a2, s: 100, r: -8 });
    return g(s, cam(t, T, .05, 540, 800));
  };

  D.peter = (t, S, T) => {
    const t97 = T.c('1697', 0, 1.2), td = T.c('доход.', 0, 4.5);
    let s = sky('#1C2A3A', '#3A4A5A', 0, 1500) + glow(540, 700, 600, '#F2C14E', .12);
    s += fill('M0 1250H1080V1920H0Z', '#2A2218');
    const hat = fill('M-190 -560C-120 -640 120 -640 190 -560C120 -590 -120 -590 -190 -560Z', '#1A1418') + fill('M-130 -575C-90 -680 90 -680 130 -575Z', '#1A1418') + line('M-190 -560C-120 -590 120 -590 190 -560', 1, { c: C.a3, w: 6 });
    const must = line('M-44 -374C-20 -360 -6 -366 0 -374C6 -366 20 -360 44 -374', 1, { c: '#2B1E16', w: 9 });
    s += g(bust(0, 0, { s: 1, f: '#2F5A3A', plain: true, mood: t > td - .4 ? 'smile' : 'calm', hairC: '#2B1E16', hair: 'curly', extra: hat + must, under: line('M0 -230V0', 1, { c: C.a3, w: 6 }) + [0, 1, 2, 3].map(i => fill(D_.circ(18, -200 + i * 50, 9), C.a3)).join('') }), at(330, 1560));
    const kd = E(t, t97 - .2, .6, 'back');
    s += g(ink(D_.rr(-170, -110, 340, 220, 12), { f: '#F4E6C2', c: C.ink, w: 6 }) + tx('УКАЗ', 0, -30, { f: 'O', s: 58, w: 700, c: C.ink }) + tx('1697', 0, 60, { f: 'O', s: 70, w: 700, c: C.a2 }), at(760, 480, kd, 6));
    // сундук и монеты
    const kc = E(t, td - .6, .4);
    s += g(gfill(D_.rr(-170, -100, 340, 200, 16), '#8A5A2C', '#5A3A1C', 0, 0, 0, 1) + line(D_.rr(-170, -100, 340, 200, 16), 1, { c: C.ink, w: 6 }) + fill(D_.rr(-20, -30, 40, 50, 6), C.a3) + glow(0, -110, 180, C.a3, .4 * kc), at(790, 1180));
    for (let i = 0; i < 9; i++) { const lt = t - td + .8 - i * .12; if (lt < 0) continue; const k = clamp(lt / .8); s += g(ink(D_.circ(0, 0, 26), { f: C.a3, c: C.ink, w: 5, dx: 3, dy: 3 }), at(lerp(760 + (rnd(i) - .5) * 300, 790, k), lerp(700, 1090, EZ.i(k)) - Math.sin(k * Math.PI) * 60, 1, k * 300), 1 - clamp((k - .9) * 10)) }
    return g(s, cam(t, T, .05, 540, 900));
  };

  D.farms = (t, S, T) => {
    const t100 = T.c('ста', 0, 2), tw = T.c('поливают,', 0, 2.6), tk = T.c('травят', 0, 3.9), ts = T.c('тех', 0, 5.4);
    let s;
    if (t < tw - .3) { // планета в табачных полях
      s = sky('#0C1626', '#13243A') + stars(t, 50, 1900) + glow(540, 860, 520, '#7DBB6E', .18);
      s += globe(540, 860, 380, t, { f: '#2C6E8A', c: C.line, dc: C.ink, sp: 10 });
      for (let i = 0; i < 26; i++) { const k = E(t, t100 - .8 + i * .05, .3, 'back'); if (k <= 0) continue; const a = rnd(i) * Math.PI * 2, r0 = Math.sqrt(rnd(i + 30)) * 330; s += g(fill(D_.leaf(0, 12, 46, 18, -90, .1), C.leaf3) + line(D_.leaf(0, 12, 46, 18, -90, .1), 1, { c: C.ink, w: 3 }), at(540 + Math.cos(a) * r0, 860 + Math.sin(a) * r0, k)) }
      s += g(fill(D_.rr(-180, -64, 360, 128, 64), C.ink, .88) + tx('100+', 0, 22, { f: 'O', s: 72, w: 700, c: C.a3 }), at(540, 330, E(t, t100 - .2, .4, 'back')));
    } else { // поле: ряды, лейка-дождеватель, опрыскиватель
      s = sky('#9FD0E8', '#F2E8C8', 0, 900) + fill(D_.circ(860, 300, 80), '#FFF4C8');
      s += fill('M0 820H1080V1920H0Z', '#5E8E4A');
      for (let r = 0; r < 12; r++) { const y = 840 + r * r * 8 + r * 30, sc = .12 + r * .07, n = Math.max(3, 14 - r); for (let i = 0; i < n; i++) s += plant(540 + (i - (n - 1) / 2) * (1080 / n) * (.4 + r * .08), y, sc, t + r) }
      if (t > tw - .3) for (let i = 0; i < 30; i++) { const ph = (t * 1.6 + i / 30) % 1; s += `<circle cx="${R(200 + (i % 10) * 70 + ph * 40)}" cy="${R(700 + ph * 300)}" r="4" fill="#BFE4F5" opacity="${R((1 - ph) * 80) / 100}"/>` }
      const kp = E(t, tk - .3, 1.8, 'io');
      if (kp > 0) { const px = lerp(-200, 1300, kp); s += g(ink('M-90 -14H80L100 0L80 14H-90Z', { f: C.a2, c: C.ink, w: 5 }) + ink('M-20 -60L20 -60L30 60L-30 60Z', { f: '#C9D1DC', c: C.ink, w: 5 }) + ink('M-90 -30L-70 -30L-60 30L-90 30Z', { f: C.a2, c: C.ink, w: 4 }), at(px, 520, 1.2)) + `<path d="M${R(px - 60)} 560L${R(px - 400)} 900L${R(px + 40)} 900Z" fill="#E6F0E0" opacity=".45"/>`; for (let i = 0; i < 8; i++) { const ph = clamp((t - tk - i * .1) / 1.2); if (ph > 0) s += g(ink(D_.ell(0, 0, 18, 24), { f: '#4A3A2A', c: C.ink, w: 3, dx: 2, dy: 2 }), at(300 + i * 70 + ph * 200, 900 - ph * 600, 1, ph * 200), 1 - ph) } }
      if (t > ts - .3) s += g(glow(540, 1100, 400, C.a3, .3) + stamp('САМ', 540, 1150, t, ts, { c: C.a3, s: 90 }));
    }
    return g(s, cam(t, T, .04, 540, 860));
  };

  D.users = (t, S, T) => {
    const td = T.c('дань.', 0, 2);
    let s = sky('#1C1A26', '#3A2A2A') + fill('M0 1150H1080V1920H0Z', '#2A2226');
    s += g(plant(540, 1150, 3.2, t, { c: '#0E0C10' }), '', .35);
    for (let r = 0; r < 6; r++) for (let i = 0; i < 9 + r; i++) { const n = 9 + r, x = (i + .5) * 1080 / n, y = 1000 + r * 70, sc = .45 + r * .08; s += g(fill(D_.circ(0, -50, 20), '#E9DCC8') + fill('M-30 0C-30 -24 -16 -28 0 -28C16 -28 30 -24 30 0Z', '#E9DCC8'), at(x, y, sc)) + smokeP(x + 10 * sc, y - 60 * sc, t + i * .3 + r, 2, .35 * sc + .1, '#C8C2B8', .5) }
    s += g(fill(D_.rr(-360, -80, 720, 160, 80), C.ink, .9) + odo(1000000000 * E(t, T.a, 1.6, 'o5'), 0, 34, { s: 92, c: C.a3, post: '+' }), at(540, 330));
    if (t > td - .4) for (let i = 0; i < 10; i++) { const k = clamp((t - td + .4 - i * .08) / 1); if (k > 0) s += g(ink(D_.circ(0, 0, 18), { f: C.a3, c: C.ink, w: 4, dx: 2, dy: 2 }), at(lerp(100 + i * 90, 540, k), lerp(1050, 700, k), 1 - k * .3), 1 - clamp((k - .85) * 6)) }
    return g(s, cam(t, T, .04));
  };

  D.toll = (t, S, T) => {
    let s = sky('#0A1418', '#14242A') + glow(540, 860, 520, '#7FB0C8', .14);
    const k = E(t, T.a, 2.4, 'l');
    let hg = ink('M-200 -380H200L40 0L200 380H-200L-40 0Z', { f: '#CFE3EA', c: C.line, w: 8, op: .9 }) + fill(`M${R(-170 * (1 - k))} ${R(-350 + 330 * k)}H${R(170 * (1 - k))}L30 -10H-30Z`, '#E8D6A8') + fill(`M-160 360H160L${R(30 + 130 * k)} ${R(360 - 200 * k)}H${R(-30 - 130 * k)}Z`, '#E8D6A8') + line('M0 -10V340', 1, { c: '#E8D6A8', w: 6, da: '6 14' }) + ink(D_.rr(-240, -420, 480, 40, 12), { f: '#5A3A22', c: C.line, w: 6 }) + ink(D_.rr(-240, 380, 480, 40, 12), { f: '#5A3A22', c: C.line, w: 6 });
    s += g(hg, at(540, 860));
    s += g(fill(D_.rr(-340, -80, 680, 160, 80), C.ink, .9) + odo(7000000 * E(t, T.a, 1.6, 'o5'), 0, 34, { s: 92, c: C.a2, post: '+' }), at(540, 330)) + cap('жизней в год', 540, 440, { c: C.paper, st: C.ink });
    return g(s, cam(t, T, .04));
  };

  D.end = (t, S, T) => {
    const tp = T.c('приручил.', 0, 2);
    let s = sky('#0B1620', '#1E3A33') + stars(t, 50, 1900);
    const kz = E(t, T.a, 2.6, 'io');
    let world = globe(0, 0, 420, t, { f: '#2C6E8A', c: C.line, dc: C.ink, sp: 6 }) + plant(0, -400, 2.2, t, { c: C.ink });
    for (let i = 0; i < 8; i++) { const k = (t * .25 + i / 8) % 1, a = (-60 - k * 60) * Math.PI / 180, r = 520 + k * 300; world += g(ink(D_.ell(0, 0, 16, 22), { f: '#4A3A2A', c: C.line, w: 3, dx: 2, dy: 2 }), at(Math.cos(a) * r + 200, Math.sin(a) * r - 300, 1, k * 200), 1 - k) }
    for (let i = 0; i < 5; i++) { const a = (200 + i * 12) * Math.PI / 180, px = Math.cos(a) * 430, py = Math.sin(a) * 430; world += line(`M140 -800Q${R(px * .5)} ${R(py - 300)} ${R(px)} ${R(py - 70)}`, 1, { c: C.ink, w: 4 }) + walker(px, py, .6, t, C.paper, i) }
    s += g(world, `translate(540 ${R(lerp(1150, 1000, kz))}) scale(${R(lerp(1, .78, kz) * 1000) / 1000})`);
    s += stamp('ПРИРУЧИЛ', 540, 330, t, tp - .1, { c: C.a3, s: 96, r: -6 });
    return g(s, cam(t, T, .03));
  };

  D.end2 = (t, S, T) => {
    let s = sky('#120E0C', '#2A1E18') + glow(540, 1000, 500, '#FF7A2A', .12);
    const kq = E(t, T.a + .4, 2.2, 'io'), q = 'M440 560C440 400 640 400 640 540C640 640 540 650 540 760V840';
    s += g(fill(D_.rr(-300, -36, 600, 72, 30), C.paper) + fill(D_.rr(-300, -36, 170, 72, 26), C.a1) + fill(D_.rr(270, -36, 30, 72, 14), '#8A8F96') + glow(306, 0, 50, '#FF6A1F', .8), 'translate(540 1160) rotate(-8)');
    s += `<path d="${q}" fill="none" stroke="${C.smoke}" stroke-width="${R(46 + Math.sin(t * 2) * 4)}" stroke-linecap="round" opacity=".55" stroke-dasharray="${R(plen(q))}" stroke-dashoffset="${R(plen(q) * (1 - kq))}"/>` + `<circle cx="540" cy="930" r="${R(26 * kq)}" fill="${C.smoke}" opacity=".6"/>`;
    s += smokeP(830, 1100, t, 6, 1, C.smoke, .35);
    return g(s, cam(t, T, .05));
  };

  window.EP = {
    P: C, D, lead: .25,
    tr: { title: 'cut', leaf: 'zoom', claim: 'push', poison: 'wipe', columbus: 'push', jerez: 'iris', queen: 'push', russia: 'push', peter: 'zoom', farms: 'push', users: 'fade', toll: 'zoom', end: 'push' },
    trAt: { leaf: [760, 650], peter: [790, 1180], toll: [540, 860], jerez: [540, 1000] },
    trCol: { poison: C.a3, jerez: C.a2 },
    cap: { hi: C.a3, st: '#0B1612' },
  };
})();
