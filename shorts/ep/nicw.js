// Никотин — «Что вы знаете о…» один в один (v5, RU). Палитра табака (как в v2 — её Андрей похвалил): тёмная зелень,
// крем, янтарь, красный. Чисто: без зерна, виньетки, свечения и дымки. Камера едет, предметы превращаются друг в друга.
(function () {
  const C = { bg: '#13241F', bg2: '#1D3B32', bg3: '#2A5244', ink: '#0C1814', paper: '#F2ECDD', paper2: '#E8DCC2', line: '#F2ECDD', a1: '#E9A23B', a2: '#E2574C', a3: '#7FC48A', leaf: '#5E9E5A', leaf2: '#3F7A45', mango: '#FFB238', eu: '#2F56A6', star: '#FFD23F', skin: '#E9B48F', wood: '#B57A45', wood2: '#8A5A33', brown: '#7A4A22', denim: '#3D5E8E', denim2: '#2E4A73' };
  P = C;
  const D = {};
  const MOT = [C.a1, C.paper, C.a3];
  // буквы падают сверху по одной
  function dropWord(str, x, y, t, t0, o = {}) {
    const sz = o.s || 110, f = o.f || 'U', w0 = o.w || 800, ws = [...str].map(ch => tw(ch, { f, w: w0, s: sz })), tot = ws.reduce((a, b) => a + b, 0);
    let cx = x - tot / 2, s = '';
    [...str].forEach((ch, i) => { const k = P01(t, t0 + i * (o.stag ?? .045), o.d ?? .42); if (k > 0) s += g(tx(ch, 0, 0, { f, w: w0, s: sz, c: o.c || C.ink, a: 'start' }), `translate(${R(cx)} ${R(y - (1 - EZ.back(k)) * 140)}) rotate(${R((1 - EZ.o(k)) * (i % 2 ? 14 : -14))})`, clamp(k * 3)); cx += ws[i] });
    return s
  }
  // строка капсом печатается по буквам
  const typeCap = (str, x, y, t, t0, o = {}) => { const n = Math.floor(clamp((t - t0) / (o.d ?? .5)) * str.length); return n > 0 ? cap(str.slice(0, n), x, y, o) : '' };
  // флакон-распылитель с черепом
  function spray(t, o = {}) {
    const c = o.c ?? C.ink;
    let s = sh('M-70 -120H70V170C70 196 50 210 30 210H-30C-50 210 -70 196 -70 170Z', o.f || C.a1, { c, w: 6 }) + sh('M20 -120H70V170C70 196 50 210 30 210H20Z', '#C9832C');
    s += sh(D_.rr(-34, -170, 68, 54, 8), '#2B2F3A', { c, w: 6 }) + sh('M-40 -230H40L52 -170H-52Z', '#2B2F3A', { c, w: 6 }) + sh('M40 -224H110V-200H40Z', '#2B2F3A', { c, w: 6 }) + sh('M-6 -170C-30 -140 -60 -150 -70 -120', 'none', { c, w: 6 });
    s += sh(D_.rr(-52, -40, 104, 140, 14), C.paper, { c, w: 5 });
    s += sh(D_.circ(0, 4, 26), C.ink) + `<circle cx="-9" cy="2" r="7" fill="${C.paper}"/><circle cx="9" cy="2" r="7" fill="${C.paper}"/>` + sh(D_.rr(-14, 22, 28, 18, 4), C.ink) + line('M-34 52L34 82M34 52L-34 82', 1, { c: C.ink, w: 8 });
    if (o.mist) { const k = clamp(o.mist); for (let i = 0; i < 7; i++) s += `<circle cx="${R(118 + k * (60 + i * 18))}" cy="${R(-212 + (i - 3) * 9 * k)}" r="${R(5 + i % 3 * 2)}" fill="${C.paper}" opacity="${R((1 - k) * 100) / 100}"/>` }
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // ведро
  function bucket(o = {}) {
    const c = o.c ?? C.ink, wl = o.water || '#5B8DEF';
    let s = line('M-150 -170C-150 -330 150 -330 150 -170', 1, { c, w: 9 });
    s += sh('M-170 -170L-140 170H140L170 -170Z', C.wood, { c, w: 7 }) + sh('M40 -170L60 170H140L170 -170Z', C.wood2);
    s += line('M-100 -170L-84 170M-34 -170L-28 170M34 -170L28 170M100 -170L84 170', 1, { c, w: 4, op: .6 });
    s += sh('M-168 -110H168L164 -76H-164Z', '#6B6F78', { c, w: 5 }) + sh('M-150 90H150L148 124H-148Z', '#6B6F78', { c, w: 5 });
    s += sh(D_.ell(0, -170, 170, 34), wl, { c, w: 7 });
    if (o.leaves) for (let i = 0; i < 3; i++) s += g(leafT({ len: 220, w: 80, c: C.ink, ow: 4, vw: 3, dots: false }), at(-60 + i * 60, -176, 1, -30 + i * 30), clamp(o.leaves * 3 - i));
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // рука с кружевной манжетой (XVII век): запястье (0,0), пальцы вправо
  function lace(o = {}) {
    const c = o.c ?? C.ink;
    let s = sh(D_.rr(-260, -52, 200, 104, 30), '#3B4A6B', { c, w: 6 });
    for (let i = 0; i < 6; i++) s += sh(D_.circ(-62, -50 + i * 20, 16), '#FFFFFF', { c, w: 4 });
    s += sh(D_.rr(-50, -46, 130, 92, 40), C.skin, { c, w: 6 }) + sh('M-10 -40C0 -84 52 -92 58 -60C60 -46 40 -40 24 -36Z', C.skin, { c, w: 6 });
    s += line('M78 -18L50 -18M78 6L52 6M74 28L50 28', 1, { c, w: 5, op: .7 });
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // лейка: носик вправо, наклон r
  function wcan(o = {}) {
    const c = o.c ?? C.ink;
    let s = line('M-120 -120C-130 -230 60 -240 70 -120', 1, { c, w: 12 }) + sh('M70 -40L250 -150L262 -132L96 0Z', '#5B6F86', { c, w: 6 }) + sh(D_.rr(236, -176, 70, 60, 14), '#5B6F86', { c, w: 6, tr: 'rotate(-30 270 -146)' });
    s += sh('M-140 -120H100L110 120H-150Z', '#6E86A3', { c, w: 7 }) + sh('M40 -120H100L110 120H50Z', '#5B6F86') + line('M-146 -50H104M-148 50H108', 1, { c, w: 4, op: .5 });
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // кочан капусты
  const cabbage = (x, y, s = 1) => g(sh(D_.ell(0, 0, 120, 88), '#8CC66A', { c: C.ink, w: 6 }) + sh(D_.ell(30, -10, 80, 64), '#A6D86B', { c: C.ink, w: 5 }) + sh(D_.ell(-40, 6, 70, 56), '#9ED073', { c: C.ink, w: 5 }) + line('M-60 -40C-20 -10 10 20 60 40M10 -60C20 -20 40 0 70 10', 1, { c: C.ink, w: 4, op: .5 }), at(x, y, s));
  // грядка: земля + 5 кочанов, жуки падают по kill[i]
  function bed(t, x0, killT, o = {}) {
    let s = sh(D_.rr(x0 - 200, 1010, 2600, 300, 40), '#7A5236') + sh(D_.rr(x0 - 200, 1010, 2600, 40, 20), '#8E6443');
    for (let i = 0; i < 6; i++) {
      const cx = x0 + i * 400, kt = killT[i] ?? 99, k = P01(t, kt, .55);
      s += cabbage(cx, 980, 1);
      if (k < 1) s += beetle(t, { x: cx + 30 + k * 50, y: 900 + EZ.i(k) * 260, s: .32, back: k > 0 ? 1 : 0, c: C.ink, stiff: k > 0 ? 1 : 0, op: 1 - clamp((k - .7) / .3) });
      if (o.aphid === i) s += aphid(t, { x: cx - 30, y: 905, s: .42, mood: 'calm', c: C.ink });
    }
    return s
  }
  // струя из лейки: капли от (x,y) вниз
  const drops = (x, y, t, on = 1, c = C.brown) => { if (on <= 0) return ''; let s = ''; for (let i = 0; i < 9; i++) { const ph = (t * 1.6 + i / 9) % 1; s += sh(D_.drop(x + 20 + ph * 60 + Math.sin(i) * 14, y + ph * 300, 14), c, { op: on }) } return s };
  // джинсы с карманом (верх кармана — y)
  function jeans(y, o = {}) {
    let s = sh(D_.rr(-100, y - 200, 1280, 1400, 0), C.denim) + dots(D_.rr(-100, y - 200, 1280, 1400, 0), { c: C.denim2, step: 18, r: 6, x0: 0, y0: y - 200, x1: 600, y1: y + 900, op: .5 });
    const pk = `M240 ${y}C240 ${y + 380} 300 ${y + 520} 540 ${y + 600}C780 ${y + 520} 840 ${y + 380} 840 ${y}`;
    s += sh(pk + 'Z', C.denim2) + line(pk, 1, { c: '#E9A23B', w: 6, da: '18 14' }) + line(`M210 ${y - 30}H870`, 1, { c: '#E9A23B', w: 6, da: '18 14' });
    s += sh(D_.circ(240, y + 6, 14), '#C9A04A', { c: C.ink, w: 4 }) + sh(D_.circ(840, y + 6, 14), '#C9A04A', { c: C.ink, w: 4 });
    return s
  }
  // ядовитая бутылка
  function poison(o = {}) {
    const c = o.c ?? C.line;
    let s = sh('M-90 -60C-90 -120 -50 -140 -40 -170V-230H40V-170C50 -140 90 -120 90 -60V220C90 250 70 266 40 266H-40C-70 266 -90 250 -90 220Z', '#6B3A1E', { c, w: 7 }) + sh(D_.rr(-48, -290, 96, 64, 12), C.ink, { c, w: 6 });
    s += sh(D_.rr(-74, -10, 148, 190, 12), C.paper, { c: C.ink, w: 5 }) + sh(D_.circ(0, 60, 34), C.ink) + `<circle cx="-12" cy="56" r="9" fill="${C.paper}"/><circle cx="12" cy="56" r="9" fill="${C.paper}"/>` + sh(D_.rr(-18, 82, 36, 22, 4), C.ink) + line('M-44 120L44 156M44 120L-44 156', 1, { c: C.ink, w: 9 });
    s += tx(L('POISON', 'ЯД'), 0, 30, { f: 'O', w: 700, s: 30, c: C.a2, ls: 3 }) + `<path d="M-60 -50V180" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".25"/>`;
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }

  // ===== 1. «Что вы знаете о никотине?» — полоса въезжает, буквы падают; в конце полоса становится фоном =====
  D.title = (t, S, T) => {
    const kb = E(t, 0, .38, 'o5'), gr = E(t, T.b - .36, .36, 'io');
    let s = bg(C.bg) + motes(t, MOT, 12) + corner(C.bg2, .9, 0, 0, 1080, 900);
    const bh = lerp(440, 2000, gr), by = lerp(CY - 230, -40, gr);
    s += sh(D_.rr(lerp(-1100, 0, kb), by, 1080, bh, 0), C.paper);
    s += sh(D_.rr(lerp(-1100, 0, kb), by + bh - 10, 1080, 10, 0), C.a1, { op: 1 - gr });
    const ty = CY - 70 - gr * 600;
    s += g(typeCap(L('What do you know about', 'Что вы знаете о'), 540, ty, t, .1, { c: C.ink, s: 34, ls: 9, d: .35 }) + dropWord(L('NICOTINE?', 'НИКОТИНЕ?'), 540, ty + 150, t, .3, { s: 104, c: C.bg }), '', 1 - gr);
    return g(s, drift(t, T, .035))
  };

  // ===== 2. в сигаретах → одноразка → ряд одноразок; наезд в диод =====
  const GY = 1110, CIGP = D_.tf(D_.rrp(800, 108, 46), 540, GY - 54, 0), VAPEP = D_.tf(D_.rrp(170 * 1.3, 440 * 1.3, 58 * 1.3), 540, GY - 286, 0);
  D.common = (t, S, T) => {
    const tc = T.c(L('cigarettes', 'сигарет')) - .25, tv = T.c(L('vapes', 'одноразк')) - .28;
    let s = bg(C.paper) + corner(C.paper2, 1, 1080, 0, 0, 900);
    s += line('M90 1110H990', E(t, T.a, .5, 'o5'), { c: C.ink, w: 7 }) + sh(D_.circ(540, 760, 330), C.paper2, { op: E(t, T.a, .6) });
    const kf = P01(t, tc, .38), km = E(t, tv, .45, 'io');
    if (kf > 0 && km <= 0) {
      const y = lerp(-300, GY - 54, EZ.i(kf)), sq = squash(t, tc + .38, .25);
      s += g(cigarette(t, { len: 800, h: 108, r: (1 - kf) * -20, c: C.ink }), `translate(540 ${R(y + 54)}) scale(${R(1 / sq * 1000) / 1000} ${R(sq * 1000) / 1000}) translate(0 -54)`);
      if (kf >= 1) s += curl(936, GY - 70, t, 200, C.ink, 6);
    }
    if (km > 0 && km < 1) { const col = km < .5 ? '#FFFFFF' : C.mango; s += sh(morph(CIGP, VAPEP, km), col, { c: C.ink, w: 7 }) }
    if (km >= 1) {
      const sideT = tv + .5;
      const cols = [['#7FC48A', '#5FA86C', L('MINT', 'МЯТА')], ['#E2574C', '#C2433A', L('BERRY', 'ЯГОДА')], ['#5B8DEF', '#3F6FD0', L('BLUE', 'ЧЕРНИКА')], ['#B98BEF', '#9466D6', L('GRAPE', 'ВИНОГРАД')]];
      [[150, 0], [330, 1], [750, 2], [930, 3]].forEach(([x, i], j) => { s += pop(vape(t, { f: cols[i][0], f2: cols[i][1], label: cols[i][2], fruit: false, c: C.ink, s: 1 }), x, GY - 220 * .72, t, sideT + j * .07, { s: .72, dy: 80, r0: (j % 2 ? 8 : -8) }) });
      s += g(vape(t, { c: C.ink }), at(540, GY - 286, 1.3 * squash(t, tv + .45, .12)));
    }
    return g(s, drift(t, T, .04, 540, 900))
  };

  // ===== 3. «в Евросоюзе никотином запрещено травить даже тлю» =====
  D.claim = (t, S, T) => {
    const te = T.c(L('EU', 'Евросоюз')) - .15, tn = T.c(L('nicotine', 'никотином')) - .15, tb = T.c(L('banned', 'запрещено')) - .1, ta = T.c(L('even', 'даже')) - .1;
    let s = bg(C.bg2) + motes(t, MOT, 10) + corner(C.bg3, .5);
    const up = E(t, ta, .6, 'io5'), gx = 540, gy = lerp(CY - 60, 420, up), gs = lerp(1, .55, up), sk = shake(t, tb + .25, 16);
    let grp = '';
    const ke = P01(t, te, .8);
    if (ke > 0) grp += g(euDisc(0, 0, 300, EZ.o(ke), { f: C.eu, sc: C.star }), at(0, 0, EZ.back(clamp(ke * 2.2))));
    grp += pop(spray(t, { c: C.ink, mist: P01(t, tn + .45, .8) }), 0, 30, t, tn, { s: .62, dy: 120, r0: 14 });
    const kb = P01(t, tb, .4);
    if (kb > 0) grp += banSign(0, 10, 170, { s: lerp(2.2, 1, EZ.back(kb)), op: clamp(kb * 3) });
    s += g(grp, at(gx + sk, gy, gs));
    // тля на листке
    const kA = P01(t, ta + .1, .55);
    if (kA > 0) {
      const ay = lerp(1500, 1060, EZ.o5(kA));
      s += g(leafT({ len: 620, w: 230, c: C.ink, ow: 6, vw: 5, dots: false }), at(180, ay + 120, 1, 80));
      s += aphid(t, { x: 520, y: ay, s: 1.9, mood: 'smile', c: C.ink });
      s += g(line('M760 900L850 820H950', E(t, ta + .4, .3, 'o5'), { c: C.paper, w: 5 }) + cap(L('APHID', 'ТЛЯ'), 955, 834, { c: C.paper, s: 38, a: 'start', op: E(t, ta + .5, .3) }), '', 1);
    }
    return g(s, drift(t, T, .03))
  };

  // ===== 4. «Никотин — это оружие табака»: лист становится мечом =====
  D.leaf = (t, S, T) => {
    const tw0 = T.c(L('weapon', 'оружие')) - .2, kw = E(t, tw0, .55, 'io5'), tt = T.c(L('tobacco', 'табака'));
    let s = bg(C.bg) + sh(D_.circ(560, CY - 60, 400), C.bg2) + motes(t, MOT, 10);
    const bx = lerp(400, 540, kw), by = lerp(1180, 1180, kw), rot = lerp(32, 0, kw);
    let L0 = leafT({ len: 860, w: 300, k: E(t, T.a, .9, 'o5'), c: C.line, vc: C.line });
    const kh = P01(t, tw0 + .3, .45);
    if (kh > 0) {
      let hilt = sh(D_.rr(-34, 0, 68, 190, 16), C.wood2, { c: C.line, w: 6 }) + line('M-34 40L34 70M-34 90L34 120M-34 140L34 170', 1, { c: C.line, w: 4, op: .6 });
      hilt += sh(D_.rr(-170, -26, 340, 52, 26), C.a1, { c: C.line, w: 6 }) + sh(D_.circ(0, 222, 38), C.a1, { c: C.line, w: 6 });
      L0 += g(hilt, at(0, 10, EZ.back(kh)));
      const ks = P01(t, tw0 + .55, .5);
      if (ks > 0 && ks < 1) L0 += clip(leafPath(860, 300), sh(D_.poly([[-400, 0], [-300, 0], [400, -900], [300, -900]]), '#FFFFFF', { op: .55, tr: `translate(0 ${R(lerp(300, -1000, ks))})` }));
    }
    s += g(L0, at(bx, by - (kh > 0 ? 180 * EZ.io(kh) : 0), 1, rot));
    s += cap('Nicotiana tabacum', 540, 300, { c: C.a1, s: 32, op: E(t, tt, .4) });
    return g(s, drift(t, T, .05))
  };

  // ===== 5. жук кусает лист → молнии по нервам → замирает → на спину =====
  D.bite = (t, S, T) => {
    const tb = T.c(L('bites', 'кусает')) - .1, tz = T.c(L('nerves', 'нервам')) - .2, tf = T.c(L('freezes', 'замирает')) - .1;
    let s = bg(C.bg3) + motes(t, MOT, 8);
    const edge = 'M-200 1000Q540 966 1280 1014L1280 2200L-200 2200Z';
    let leafS = sh(edge, C.leaf) + sh('M520 982Q900 970 1280 1014L1280 2200L700 2200Z', C.leaf2) + line('M-200 1300Q300 1150 1280 1240M200 930Q260 1100 120 1400M700 912Q760 1100 900 1500', 1, { c: C.ink, w: 5, op: .35 }) + line(edge, 1, { c: C.ink, w: 7 });
    const kb = P01(t, tb + .2, .35), nb = kb > 0 ? 58 * EZ.back(kb) : 0, nb2 = P01(t, tb + .6, .3) > 0 ? 40 * EZ.back(P01(t, tb + .6, .3)) : 0;
    if (nb > 0) leafS = cut(leafS, [[770, 984, nb * 1.4], [828, 982, nb2 * 1.4]]);
    s += leafS;
    // крошки
    for (let i = 0; i < 6; i++) { const k = P01(t, tb + .25 + (i % 2) * .4, .6); if (k > 0 && k < 1) s += sh(D_.circ(780 + (i - 3) * 30 * k + 60 * k, 950 - 220 * k + 420 * k * k, 13), C.leaf, { c: C.ink, w: 4, op: 1 - k }) }
    const walk = P01(t, T.a, tb - T.a + .05), bx = lerp(-400, 430, EZ.o(walk)), fr = P01(t, tf, .25), back = P01(t, T.e - .5, .45);
    const ch = t > tb && t < tb + 1 ? (Math.sin((t - tb) * 13) * .5 + .5) : 0, zp = t > tz && t < tf ? 1 : 0;
    s += beetle(t, { x: bx + shake(t, tz, 14, .9, 60), y: 958, s: 1.75, walk: walk < 1 && fr <= 0, chomp: ch, zap: zp, stiff: fr, c: C.ink, f: fr > 0 ? '#7E9A8D' : '#2E7D5B', f2: fr > 0 ? '#5E7A6D' : '#1F5A41', dead: back > .5, back: EZ.io(back) });
    if (fr > 0) s += pop(g(sh(D_.rr(-50, -64, 34, 128, 10), C.paper) + sh(D_.rr(16, -64, 34, 128, 10), C.paper)), bx + 30, 560, t, tf, { s: 1, out: T.e - .55 });
    return g(s, about(600, 900, 1 + .06 * EZ.io(P01(t, T.a, 2.4)) + .08 * E(t, tf, .3, 'o5')))
  };

  // ===== 6. «к 1690 году»: год откатывается назад, табачная вода =====
  const YR = (t, from, to, t0, d) => odo(lerp(from, to, E(t, t0, d, 'io')), 540, 400, { s: 150, c: C.ink, sep: '' });
  D.y1690 = (t, S, T) => {
    const ty = T.c('1690') - .2, tn = T.c(L('noticed', 'заметили')) - .2;
    let s = bg(C.paper) + corner(C.paper2, 1);
    s += YR(t, 2026, 1690, T.a + .1, ty - T.a + .5);
    s += line('M200 1180H880', 1, { c: C.ink, w: 7 });
    const kw = E(t, tn + .3, 1.0, 'io'), wcol = kw < 1 ? `rgb(${R(lerp(91, 138, kw))},${R(lerp(141, 92, kw))},${R(lerp(239, 46, kw))})` : '#8A5C2E';
    s += bucket({ x: 540, y: 1010, s: 1, water: wcol, leaves: E(t, tn + .25, .4, 'o5') });
    const kh = P01(t, tn - .1, .7);
    if (kh > 0 && kh < 1) s += lace({ x: lerp(-120, 360, Math.sin(EZ.io(kh) * Math.PI) ), y: lerp(780, 830, Math.sin(kh * Math.PI)), s: 1.1, r: 20 });
    for (let i = 0; i < 3; i++) s += ringWave(540 + (i - 1) * 60, 840, t, tn + .4 + i * .15, { c: C.ink, r0: 10, r1: 90, w: 5 });
    s += cap(L('tobacco water', 'табачная вода'), 540, 1260, { c: C.brown, s: 32, op: E(t, ty + .4, .4) });
    return g(s, drift(t, T, .04))
  };

  // ===== 7–8. грядки, 300 лет, потом 2009 и запрет =====
  const GX0 = 300;
  function garden(t, T, camx, yr, pour, kill, extra = '') {
    let s = bg(C.paper2) + corner('#D9C9A6', 1);
    let w = bed(t, GX0, kill, { aphid: 3 });
    w += extra;
    s += g(g(w, `translate(${R(-camx)} 0)`), about(540, 1000, 1.12));
    s += yr;
    return s
  }
  D.garden = (t, S, T) => {
    const t3 = T.c(L('three', 'триста')) - .2;
    const camx = lerp(0, 700, E(t, T.a, T.b - T.a + .8, 'io'));
    const pourX = GX0 + 160 + camx * .95, kill = [0, 1, 2, 3, 4, 5].map(i => T.a + .5 + i * .45);
    const can = wcan({ x: pourX - 200, y: 640, s: .9, r: 24 }) + drops(pourX + 90, 640 - 40, t, 1);
    let s = garden(t, T, camx, YR(t, 1690, 1990, t3, T.b - t3 + .6), 1, kill, can);
    s += pop(pill(L('+300 YEARS', '+300 ЛЕТ'), 0, 0, { f: C.a2, s: 44 }), 540, 560, t, T.c(L('years', 'лет')) - .1, { r0: 10 });
    return s
  };
  D.ban = (t, S, T) => {
    const tY = T.c('2009') - .2, tE = T.c(L('EU', 'Евросоюз')) - .25, tB = T.c(L('banned', 'запретил')) - .12;
    const camx = 700 + 120 * E(t, T.a, 2, 'io');
    const pourX = GX0 + 160 + 700 * .95, hit = P01(t, tE + .45, .7), kill = [0, 1, 2, 3, 4, 5].map(() => -5);
    const cy0 = 640 - Math.sin(hit * Math.PI) * 260 + EZ.i(clamp((hit - .5) * 2)) * 900;
    const can = wcan({ x: pourX - 200 + hit * 300, y: cy0, s: .9, r: 24 + hit * 220, op: 1 - clamp((hit - .8) * 5) }) + drops(pourX + 90, 600, t, 1 - clamp(hit * 4));
    const rollX = lerp(1500, pourX + 40, EZ.o(P01(t, tE, .5))) + hit * 120;
    const disc = P01(t, tE, .1) > 0 ? euDisc(rollX, 860, 150, 1, { f: C.eu, sc: C.star, rot: -lerp(0, 420, EZ.o(P01(t, tE, .5))) }) : '';
    let s = garden(t, T, camx, YR(t, 1990, 2009, tY - .3, .7), 1 - hit, kill, can + disc);
    s += stamp(L('BANNED', 'ЗАПРЕЩЕНО'), 540, 760, t, tB, { c: C.a2, s: 92, r: -12 });
    return g(s, `translate(${R(shake(t, tB + .1, 18))} 0)`)
  };

  // ===== 9. «Тля выдохнула» =====
  D.aphid = (t, S, T) => {
    const tx0 = T.c(L('exhaled', 'выдохнула')) - .1, kp = P01(t, tx0, .8);
    let s = bg('#CFE6B5') + sh(D_.circ(540, CY, 420), '#BEDDA0') + corner('#B3D48F', 1);
    s += g(leafT({ len: 900, w: 340, c: C.ink, ow: 6, vw: 5, f: '#8CC66A', f2: '#6FAF55', dots: false }), at(300, 1500, 1, 62));
    s += aphid(t, { x: 520, y: 980, s: 2.6, mood: kp > .05 ? 'relief' : 'calm', puff: kp > 0 && kp < 1 ? kp : 0, sweat: P01(t, tx0 + .2, .7), c: C.ink });
    return g(s, drift(t, T, .08, 560, 900))
  };

  // ===== 10. «А вы выдыхаете до сих пор. Облаком со вкусом манго» =====
  const CL = 'M-170 40C-210 40 -220 -20 -176 -34C-184 -94 -110 -118 -70 -84C-50 -140 40 -140 62 -84C110 -110 176 -70 160 -20C210 -10 206 40 160 40Z';
  const MG = 'M-90 10C-100 -60 -20 -96 40 -80C100 -64 120 0 90 40C60 84 -10 90 -50 70C-76 58 -86 38 -90 10Z';
  D.exhale = (t, S, T) => {
    const tc = T.c(L('cloud', 'облаком')) - .15, tm = T.c(L('mango', 'манго')) - .2;
    let s = bg(C.bg) + sh(D_.circ(760, 760, 360), C.bg2) + motes(t, MOT, 10);
    s += head({ x: 240, y: 960, s: 1.55, f: '#2C5A4C', c: C.line, w: 6 });
    const kc = P01(t, T.a + .1, 1.2), kg = E(t, tc, .5, 'back'), km = E(t, tm, .5, 'io');
    const cx = lerp(560, 740, EZ.o(kc)), cyy = lerp(1000, 760, EZ.o(kc)), cs = lerp(.3, 1.25, EZ.o(kc)) + kg * .35;
    if (km < 1) s += g(sh(km > 0 ? morph(CL, MG, km) : CL, km > .5 ? C.mango : '#FFFFFF', { c: C.ink, w: 6 / cs * 1.2 }), at(cx, cyy, cs + km * .9));
    else s += mango(cx, cyy, 2.4, { c: C.ink });
    if (km >= 1) s += burst(cx, cyy, t, tm + .5, { c: C.a1, r0: 260, r1: 420, n: 12 });
    return g(s, drift(t, T, .04))
  };

  // ===== 11. рецепторы: мембрана с «чашками», молекулы садятся; отъезд — это мозг; бирка «никотиновые» =====
  const RX = 640, RY = 520; // где на мозге рецепторы
  function membrane(t, tDock) {
    let s = sh('M-700 40Q-350 0 0 40T700 40V1500H-700Z', '#E89BB0') + line('M-700 40Q-350 0 0 40T700 40', 1, { c: C.ink, w: 8 });
    for (let i = 0; i < 3; i++) {
      const x = -300 + i * 300, k = P01(t, tDock + i * .25, .45);
      s += sh(`M${x - 70} 30C${x - 70} 150 ${x + 70} 150 ${x + 70} 30L${x + 40} 30C${x + 40} 100 ${x - 40} 100 ${x - 40} 30Z`, C.a1, { c: C.ink, w: 6 });
      const my = lerp(-420 - i * 60, 40, EZ.o5(k)), mr = (1 - k) * 220;
      s += molecule(t, { x: x - 10, y: my - 10 + Math.sin(t * 3 + i) * 6 * (1 - k), s: .55, f: C.a2, f2: '#B83A32', c: C.ink, face: false, rot: mr });
      if (k >= 1) s += ringWave(x, 40, t, tDock + i * .25 + .45, { c: C.paper, r0: 20, r1: 140, w: 6 });
    }
    return s
  }
  D.recep = (t, S, T) => {
    const tr0 = T.c(L('receptors', 'рецепторам')) - .2, tbr = T.c(L('brain', 'мозге')) - .3, tn = T.c(L('nicotinic', 'никотиновые')) - .15;
    const kz = E(t, tbr, 1.0, 'io5');
    let s = bg(C.bg2) + motes(t, MOT, 8);
    // мозг: камера отъезжает от точки рецепторов (RX,RY) к общему плану
    const bz = lerp(3.4, 1, kz), cx = lerp(RX, 540, kz), cyy = lerp(RY, 760, kz);
    let w = brainF(t, { x: 540, y: 760, s: 2.4, c: C.ink, k: clamp((kz - .55) / .45), face: kz > .9 ? { mood: 'calm', look: .3 } : null });
    [[RX, RY], [420, 640], [700, 800], [470, 860], [610, 670]].forEach((a, i) => { const kk = P01(t, tbr + .7 + i * .06, .35); if (kk > 0) w += g(sh(`M-20 0C-20 30 20 30 20 0L12 0C12 18 -12 18 -12 0Z`, C.a1, { c: C.ink, w: 3 }), at(a[0], a[1], 1.4 * EZ.back(kk))) });
    s += g(w, `translate(540 ${CY}) scale(${R(bz * 1000) / 1000}) translate(${R(-cx)} ${R(-cyy)})`);
    // крупный план мембраны в «линзе», которая сжимается в точку рецептора на мозге
    const rp = [540 + (RX - cx) * bz, CY + (RY - cyy) * bz], lens = lerp(1500, 30, EZ.io(kz));
    if (kz < .98) s += clip(D_.circ(rp[0], rp[1], lens), g(sh(D_.rr(-900, -1400, 1800, 2800, 0), '#F4C7D2') + membrane(t, tr0), `translate(${R(rp[0])} ${R(rp[1])}) scale(${R(lerp(1, .1, EZ.io(kz)) * 1000) / 1000})`)) + `<circle cx="${R(rp[0])}" cy="${R(rp[1])}" r="${R(lens)}" fill="none" stroke="${C.paper}" stroke-width="${R(10 * kz + 2)}"/>`;
    // бирка
    const kt = P01(t, tn, .6);
    if (kt > 0) {
      s += line('M640 600L640 430', E(t, tn, .3, 'o5'), { c: C.paper, w: 5 }) + sh(D_.circ(640, 604, 12), C.paper, { op: clamp(kt * 3) });
      s += g(sh(D_.rr(-250, -54, 500, 108, 54), C.a2, { c: C.paper, w: 5 }) + tx(L('NICOTINIC', 'НИКОТИНОВЫЕ'), 0, 20, { f: 'O', w: 700, s: 54, c: C.paper, ls: 3 }), at(640, 370, EZ.back(kt), Math.sin((t - tn) * 7) * 10 * (1 - EZ.o(kt))));
    }
    return s
  };

  // ===== 12. секундомер 0 → 10 с, точка бежит от одноразки к мозгу =====
  D.ten = (t, S, T) => {
    const tp = T.c(L('puff', 'затяжка')) - .15, t10 = T.c('10') - .1, tth = T.c(L('there', 'там')) - .1;
    let s = bg(C.paper) + corner(C.paper2, 1, 1080, 0, 0, 900);
    const run = E(t, tp + .2, tth - tp - .2, 'io');
    s += stopwatch(540, 640, 10 * run, { r: 250, c: C.ink, f: '#FFFFFF', face: C.paper, fill: C.a1, hand: C.a2, unit: ' с' });
    const path = 'M190 1120C260 900 420 1180 560 1050S860 960 890 1100';
    s += dotted(path, E(t, tp, .6, 'o5'), C.ink, 7, 22);
    const p = pts(path, 120)[Math.min(119, Math.floor(run * 119))];
    s += pop(vape(t, { c: C.ink }), 180, 1180, t, T.a, { s: .38 }) + (P01(t, tp, .6) > 0 && P01(t, tp, .6) < 1 ? g(cloud(0, 0, 1, { c: C.ink, w: 8 }), at(240, 1040 - 40 * P01(t, tp, .6), .32 * EZ.o(P01(t, tp, .6)))) : '');
    s += pop(brainF(t, { c: C.ink, face: { mood: run >= 1 ? 'happy' : 'calm' } }), 900, 1150, t, T.a + .1, { s: .5 });
    if (run > 0 && run < 1) s += sh(D_.circ(p[0], p[1], 16), C.a2, { c: C.ink, w: 5 });
    s += ringWave(900, 1150, t, tth, { c: C.a2, r1: 260 });
    return g(s, drift(t, T, .04))
  };

  // ===== 13. дофамин: капли падают в мозг, мозг рад; полароид с одноразкой прикалывается =====
  D.dopa = (t, S, T) => {
    const td = T.c(L('dopamine', 'дофамина')) - .2, tm = T.c(L('remembers', 'запоминает')) - .15;
    let s = bg(C.bg) + sh(D_.circ(540, CY, 430), C.bg2) + motes(t, MOT, 8);
    const kd = P01(t, td, 1.6);
    for (let i = 0; i < 9; i++) { const ph = clamp((t - td - i * .12) / .7); if (ph > 0 && ph < 1) s += sh(D_.drop(330 + (i % 5) * 100 + (i > 4 ? 50 : 0), lerp(220, 640, EZ.i(ph)), 30), C.star, { c: C.ink, w: 5 }) }
    const hap = kd > .25;
    s += g(brainF(t, { c: C.ink, face: { mood: hap ? 'happy' : 'calm' } }), at(540, 860 + bob(t, 6, .8), 2.3 * squash(t, td + .4, .1)));
    const kp = P01(t, tm, .55);
    if (kp > 0) {
      const pol = sh(D_.rr(-120, -140, 240, 280, 10), '#FFFFFF', { c: C.ink, w: 6 }) + sh(D_.rr(-96, -116, 192, 180, 4), C.bg2) + g(vape(t, { c: C.ink, label: false }), at(0, -26, .32)) + tx(L('mango = good', 'манго = хорошо'), 0, 112, { f: 'M', w: 800, s: 26, c: C.ink });
      s += g(pol, at(lerp(1200, 700, EZ.o5(kp)), lerp(300, 640, EZ.o5(kp)), 1, lerp(30, 9, EZ.back(kp))));
      s += pop(sh(D_.circ(0, 0, 18), C.a2, { c: C.ink, w: 5 }) + sh(D_.circ(-5, -5, 5), '#fff'), 690, 516, t, tm + .5, { s: 1 });
    }
    return g(s, drift(t, T, .04))
  };

  // ===== 14. два часа — и половины нет =====
  D.half = (t, S, T) => {
    const t2 = T.c(L('two', 'два')) - .2, th = T.c(L('half', 'половины')) - .2;
    let s = bg(C.paper2) + corner('#D9C9A6', 1);
    const kc = E(t, t2, 1.3, 'io'), mm = kc * 120;
    s += clockF(300, 600, 170, 0 + mm / 60, mm % 60, { c: C.ink, f: '#FFFFFF', arc: kc * 360 * .999, ac: C.a1, hand: C.a2 });
    s += cap(L('2 hours', '2 часа'), 300, 840, { c: C.ink, s: 36, op: E(t, t2 + .3, .3) });
    const lv = lerp(.9, .45, E(t, th, 1.1, 'io'));
    s += tube(760, 760, lv, { h: 620, w: 150, f: C.a1, c: C.ink, t });
    s += pop(tx('½', 0, 0, { f: 'O', w: 700, s: 170, c: C.a2 }), 760, 360, t, th + .8, { s: 1 });
    return g(s, drift(t, T, .05))
  };

  // ===== 15. «И мозг просит ещё» =====
  D.more = (t, S, T) => {
    const tm = T.c(L('more', 'ещё')) - .15;
    let s = bg(C.bg) + sh(D_.circ(540, CY, 420), C.bg2);
    s += g(brainF(t, { c: C.ink, face: { mood: 'want', look: -.3 } }), at(540 + shake(t, tm + .1, 10, .6), 900, 2.4));
    s += pop(bubble(L('MORE!', 'ЕЩЁ!'), 0, 0, { s: 80, c: C.ink }), 700, 480, t, tm, { r: -6 });
    return g(s, drift(t, T, .06))
  };

  // ===== 16. яд → одноразка → в карман =====
  const BOT = 'M-90 -60C-90 -120 -50 -140 -40 -170V-230H40V-170C50 -140 90 -120 90 -60V220C90 250 70 266 40 266H-40C-70 266 -90 250 -90 220Z';
  const VP2 = D_.tf(D_.rrp(170, 440, 58), 0, 0, 0);
  D.pocket = (t, S, T) => {
    const tm = T.c(L('moved', 'переехал')) - .2, tp = T.c(L('pocket', 'карман')) - .4;
    let s = bg(C.bg2) + motes(t, MOT, 8);
    const km = E(t, tm, .5, 'io'), kp = E(t, tm + .4, tp - tm + .2, 'io5');
    const jy = lerp(2100, 900, kp);
    s += jeans(jy);
    const vy = lerp(CY - 40, jy + 120, kp);
    let obj;
    if (km <= 0) obj = poison({ c: C.ink, s: 1.5 });
    else if (km < 1) obj = g(sh(morph(BOT, VP2, km), km < .5 ? '#6B3A1E' : C.mango, { c: C.ink, w: 7 }), at(0, 0, lerp(1.5, 1.3, km)));
    else obj = vape(t, { c: C.ink, s: 1.3 });
    const inPocket = clip(`M-400 -2000H1480V${jy}H-400Z`, g(obj, at(540, vy, 1)));
    s += kp > 0 ? inPocket : g(obj, at(540, vy, 1));
    s += sh(`M240 ${jy}C240 ${jy + 380} 300 ${jy + 520} 540 ${jy + 600}C780 ${jy + 520} 840 ${jy + 380} 840 ${jy}Z`, C.denim2) + line(`M240 ${jy}C240 ${jy + 380} 300 ${jy + 520} 540 ${jy + 600}C780 ${jy + 520} 840 ${jy + 380} 840 ${jy}`, 1, { c: C.a1, w: 6, da: '18 14' });
    return g(s, drift(t, T, .03))
  };

  // ===== 17. 7 миллионов в год =====
  D.toll = (t, S, T) => {
    const t7 = T.c('7') - .2;
    let s = bg('#0B1512');
    const cols = 9, rows = 8;
    for (let r = 0; r < rows; r++) for (let c0 = 0; c0 < cols; c0++) {
      const i = r * cols + c0, k = P01(t, T.a + r * .06 + c0 * .015, .35), dead = t > t7 + .4 + rnd(i) * 1.6 && rnd(i + 9) < .45;
      if (k > 0) s += g(person1(0, 0, 1, dead ? '#4A2A28' : C.paper), at(170 + c0 * 92, 300 + r * 104, .9 * EZ.back(k)));
    }
    s += g(odo(7000000 * E(t, t7, 1.1, 'o5'), 540, 1210, { s: 120, c: C.a2, post: '+', sep: ' ' }), '', E(t, t7 - .25, .3));
    return g(s, drift(t, T, .03))
  };

  // ===== 18. «Признайтесь…» + «Подписаться» (как в конце у «Боба») =====
  D.end = (t, S, T) => {
    const tz = T.c(L('smoke', 'затянуться')) - .1;
    let s = bg(C.bg) + motes(t, MOT, 10);
    s += typeCap(L('Admit it, you also', 'Признайтесь, вы ведь сейчас'), 540, 700, t, T.v - .05, { c: C.paper, s: 44, ls: 6, d: .7 });
    s += typeCap(L('want a puff right now', 'тоже захотели'), 540, 780, t, T.v + .7, { c: C.paper, s: 44, ls: 6, d: .45 });
    s += typeCap(L('', 'затянуться'), 540, 870, t, tz, { c: C.a2, s: 44, ls: 6, d: .4 });
    const kf = P01(t, tz + .9, .5);
    if (kf > 0) { const w0 = 470; s += g(sh(D_.rr(-w0 / 2, -56, w0, 112, 56), 'none', { c: C.a2, w: 5 }) + tx(L('SUBSCRIBE', 'ПОДПИСАТЬСЯ'), 0, 14, { f: 'M', w: 800, s: 38, c: C.paper, ls: 4 }), at(540, 1060, EZ.back(kf))) }
    return s
  };

  window.EP = {
    P: C, D, clean: true, lead: .2,
    tr: { title: 'cut', common: 'zc', claim: 'into', leaf: 'band', bite: 'slide', y1690: 'slide', garden: 'cut', ban: 'zc', aphid: 'out', exhale: 'zc', recep: 'slideU', ten: 'zc', dopa: 'slide', half: 'flip', more: 'band', pocket: 'zc', toll: 'fade' },
    trAt: { common: [540, 1110 - 286 + 572 * .34], claim: [560, 1030], ban: [650, 905], aphid: [660, 870], exhale: [300, 840], ten: [900, 1150], pocket: [540, 1010] },
    trTo: { claim: [640, 640], aphid: [560, 1000] },
    trBg: { claim: C.bg2 },
    trCol: { common: C.bg2, leaf: C.a1, ban: '#CFE6B5', exhale: C.bg2, ten: C.bg, more: C.a1, pocket: '#0B1512' },
    trCol2: { leaf: C.a2, more: C.a2 },
    cap: { hi: C.a1, st: C.ink },
  };
})();
