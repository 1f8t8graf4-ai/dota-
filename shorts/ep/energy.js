// Энергетики — «бык в банке настоящий». Палитра: ночной синий, электрический жёлтый, красный, голубой, серебро.
(function () {
  const C = { bg: '#0F1626', bg2: '#1B2A44', ink: '#0A0F1A', paper: '#F4F1EA', line: '#F4F1EA', a1: '#FFD23F', a2: '#E63946', a3: '#3DA5FF', silver: '#C9D1DC', bull: '#8B4A35', bile: '#B5C944', skin: '#E9B48F' };
  P = C;
  const cam = (t, T, a = .05, cx = 540, cy = 820) => about(cx, cy, 1 + a * EZ.io(P01(t, T.a, T.b - T.a + .5)));
  const D = {};
  const BOLT = 'M20 -120L-60 10H0L-30 120L60 -20H0Z';
  function can(x, y, s, o = {}) {
    const h = o.big ? 560 : 400, w0 = 190;
    let q = ink(`M${-w0 / 2} ${-h / 2 + 30}C${-w0 / 2} ${-h / 2} ${w0 / 2} ${-h / 2} ${w0 / 2} ${-h / 2 + 30}V${h / 2 - 20}C${w0 / 2} ${h / 2} ${-w0 / 2} ${h / 2} ${-w0 / 2} ${h / 2 - 20}Z`, { f: o.f || C.a3, c: C.line, w: 7 });
    q += fill(D_.rr(-w0 / 2, -h / 2 + 50, w0, 60, 0), C.silver) + fill(D_.rr(-w0 / 2, h / 2 - 90, w0, 50, 0), C.silver);
    q += g(ink(BOLT, { f: C.a1, c: C.ink, w: 5, dx: 4, dy: 3 }), `translate(0 ${o.big ? 30 : 10}) scale(.9)`);
    q += tx(o.lab || 'ENERGY', 0, h / 2 - 120, { f: 'O', s: 40, w: 700, c: C.paper, ls: 3 });
    q += dots(`M${-w0 / 2} ${-h / 2}H${w0 / 2}V${h / 2}H${-w0 / 2}Z`, { c: C.ink, step: 12, x0: w0 / 2, y0: 0, x1: 0, y1: 0, op: .45 }) + shine(-w0 / 2 + 30, -h / 2 + 140, h * .45, 90, 9, '#FFFFFF', .5);
    q += ink(D_.ell(0, -h / 2 + 18, w0 / 2 - 6, 16), { f: C.silver, c: C.line, w: 5, dx: 0, dy: 0 });
    return g(q, at(x, y, s, o.r || 0), o.op ?? 1)
  }
  function bullHead(x, y, s, t, o = {}) {
    const c = C.line, f0 = o.f || C.bull, bl = (t % 3 < .12) ? 1 : 0;
    let q = ink('M-80 -170C-170 -190 -220 -260 -200 -330C-180 -280 -130 -250 -70 -232Z', { f: '#E8DCC4', c, w: 6 }) + ink('M80 -170C170 -190 220 -260 200 -330C180 -280 130 -250 70 -232Z', { f: '#E8DCC4', c, w: 6 });
    q += ink(D_.tf([[-60, -20], [60, -20], [40, 26], [-40, 26]], -170, -140, -25), { f: f0, c, w: 6 }) + ink(D_.tf([[-60, -20], [60, -20], [40, 26], [-40, 26]], 170, -140, 25), { f: f0, c, w: 6 });
    q += ink('M-100 -220C-130 -120 -120 10 -86 90C-64 150 64 150 86 90C120 10 130 -120 100 -220C56 -252 -56 -252 -100 -220Z', { f: f0, c, w: 8 }) + dots('M-100 -220C-130 -120 -120 10 -86 90C-64 150 64 150 86 90C120 10 130 -120 100 -220Z', { c: C.ink, step: 14, x0: 110, y0: 100, x1: -40, y1: -200, op: .4 });
    q += ink(D_.ell(0, 92, 92, 62), { f: '#C98C78', c, w: 7 }) + `<ellipse cx="-34" cy="96" rx="14" ry="18" fill="${C.ink}"/><ellipse cx="34" cy="96" rx="14" ry="18" fill="${C.ink}"/>`;
    if (o.ring !== false) q += `<path d="M-30 120A30 34 0 1 0 30 120" fill="none" stroke="${C.a1}" stroke-width="9"/>`;
    for (const sx of [-1, 1]) q += `<ellipse cx="${sx * 56}" cy="-80" rx="15" ry="${R(18 * (1 - bl) + 1)}" fill="${C.ink}"/>`;
    q += line('M-30 -230L-10 -200L10 -232L30 -204', 1, { c, w: 6 });
    return g(q, at(x, y, s, o.r || 0), o.op ?? 1)
  }

  D.title = (t, S, T) => {
    let s = bg(C.bg) + fill(D_.circ(540, 800, 420), C.bg2);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + t * .4; s += g(fill(BOLT, C.a1), at(540 + Math.cos(a) * 380, 800 + Math.sin(a) * 380, .45, a * 57)) }
    s += can(540, 820, 1.25 * E(t, 0, .6, 'back') + .02, { r: wob(t, .5, 3) });
    s += cap('What do you know about', 540, 300, { c: C.paper, op: E(t, 0, .4) });
    s += rise('ENERGY DRINKS?', 540, 1270, t, .15, { f: 'U', w: 800, s: 76, c: C.a1 });
    return g(s, cam(t, T, .06));
  };

  D.can = (t, S, T) => {
    let s = bg(C.bg2);
    const ts = T.c('sugar', 0, .2), tc = T.c('caffeine', 0, .9), t3 = T.c('three', 0, 2.8);
    s += can(540, 860, 1.1);
    for (let i = 0; i < 3; i++) { const k = E(t, ts + i * .12, .4, 'back'); s += g(ink(D_.rr(-50, -50, 100, 100, 12), { f: '#FFFFFF', c: C.ink, w: 5, dx: 4, dy: 4 }) + dots(D_.rr(-50, -50, 100, 100, 12), { c: '#B9B2A5', step: 9, op: .6 }), at(190 + i * 30, 1180 - i * 70, k, i * 12)) }
    const kc = E(t, tc, .4, 'back');
    s += g(ink('M-60 -50H60L50 60H-50Z', { f: '#FFFFFF', c: C.ink, w: 6 }) + ink('M56 -20C100 -20 100 30 52 30', { f: 'none', c: C.ink, w: 8, dx: 0, dy: 0 }) + fill(D_.ell(0, -44, 54, 10), '#6B4423'), at(880, 1150, kc));
    s += g(clock(0, 0, 120, 3, 0, { f: C.paper, c: C.line, hand: C.ink, hand2: C.a2 }), at(860, 470, E(t, t3 - .1, .4, 'back')));
    return g(s, cam(t, T, .05));
  };

  D.claim = (t, S, T) => {
    let s = bg(C.bg) + fill(D_.circ(540, 800, 430), C.bg2);
    const tr = T.c('real', 0, 2), kb = E(t, tr - .3, .6, 'back');
    s += can(540, 860, 1.1, { op: 1 - E(t, tr - .3, .3) });
    if (kb > 0) s += bullHead(540, 860, 1.25 * kb, t);
    s += ringWave(540, 800, t, tr, { c: C.a1, r1: 640 }) + burst(540, 760, t, tr, { c: C.a1, r0: 320, r1: 430, n: 12 });
    return g(s, cam(t, T, .05));
  };

  D.bile = (t, S, T) => {
    let s = bg('#2A2A1E') + fill(D_.circ(540, 760, 430), '#3A3A28');
    const tb = T.c('bile', 0, 2.4), ttau = T.c('taurine', 0, 6), kb = E(t, tb - .3, 1, 'io');
    let fl = ink('M-60 -300H60V-120L200 200C220 250 190 280 140 280H-140C-190 280 -220 250 -200 200L-60 -120Z', { f: '#E8F0F4', c: C.line, w: 8 });
    fl += fill(`M${-150} ${R(260 - 200 * kb)}H150L200 200C220 250 190 270 140 270H-140C-190 270 -220 250 -200 200Z`, C.bile, .95);
    for (let i = 0; i < 5; i++) { const ph = (t * .6 + i / 5) % 1; fl += `<circle cx="${R(-80 + i * 40)}" cy="${R(250 - ph * 180 * kb)}" r="${R(6 + i % 3 * 3)}" fill="#E8F4B0" opacity="${R((1 - ph) * kb * 100) / 100}"/>` }
    fl += ink(D_.rr(-80, -340, 160, 50, 10), { f: '#8A6A4A', c: C.line, w: 6 }) + shine(-30, -260, 120, 90, 8, '#FFFFFF', .6);
    s += g(fl, at(400, 820, E(t, T.a, .5, 'back')));
    s += tx('1827', 820, 520, { f: 'O', s: 110, w: 700, c: C.a1, op: E(t, T.c('1827', 0, .5), .4) }) + cap(L('Germany'), 820, 580, { c: C.paper, op: E(t, T.c('german', 0, 1.2), .4) });
    const kt = E(t, ttau - .5, .7, 'o5');
    if (kt > 0) { const A1 = 'TAURUS', B1 = ' → TAURINE', sz = 64, w1 = tw(A1, { f: 'U', w: 800, s: sz }), w2 = tw(B1, { f: 'U', w: 800, s: sz }), x0 = 540 - (w1 + w2) / 2; s += tx(A1, x0, 1250, { f: 'U', s: sz, w: 800, c: C.paper, a: 'start', op: kt }) + tx(B1, x0 + w1, 1250, { f: 'U', s: sz, w: 800, c: C.a1, a: 'start', op: E(t, ttau - .1, .5) }) + g(bullHead(0, 0, .35, t, { ring: false }), at(820, 920, kt)) }
    return g(s, cam(t, T, .04));
  };

  D.myth = (t, S, T) => {
    let s = bg(C.bg2);
    const tl = T.c('lab', 0, 3.5), ko = E(t, tl - .3, .5, 'io');
    s += g(phone(0, 0, { w: 420, scr: '#141B2C', content: (w0, h0) => fill(D_.rr(-w0 / 2 + 24, -h0 / 2 + 60, w0 - 48, 300, 20), '#25314D') + tx(L('BULL SEMEN?!'), 0, -h0 / 2 + 230, { f: 'O', s: 56, w: 700, c: C.a2 }) + line(`M${-w0 / 2 + 50} ${-h0 / 2 + 420}H${w0 / 2 - 80}M${-w0 / 2 + 50} ${-h0 / 2 + 470}H${w0 / 2 - 140}`, 1, { c: C.paper, w: 10, op: .35 }) + `<circle cx="${-w0 / 2 + 70}" cy="${-h0 / 2 + 560}" r="22" fill="${C.a2}"/>` + tx('2.3M', -w0 / 2 + 106, -h0 / 2 + 574, { f: 'O', s: 40, w: 500, c: C.paper, a: 'start' }) }), at(lerp(540, 300, ko), 830, lerp(1, .7, ko), -6));
    s += stamp(L('MYTH'), lerp(540, 300, ko), 760, t, T.v + 1.2, { c: C.a2, s: 90, r: -12 });
    if (ko > 0) { // лаборатория: колбы и «синтез»
      let lab = ''; for (let i = 0; i < 3; i++) lab += g(ink('M-40 -160H40V-60L110 110C120 140 100 160 70 160H-70C-100 160 -120 140 -110 110L-40 -60Z', { f: '#E8F0F4', c: C.line, w: 6 }) + fill('M-90 90H90L110 110C120 140 100 150 70 150H-70C-100 150 -120 140 -110 110Z', [C.a3, C.a1, '#7FD39C'][i]), at(i * 170, 0, .8));
      s += g(lab + tx(L('SYNTHETIC'), 170, 260, { f: 'O', s: 56, w: 700, c: C.a3, ls: 4 }), at(640, 840, ko));
    }
    return g(s, cam(t, T, .04));
  };

  D.thai = (t, S, T) => {
    let s = bg('#101830');
    for (let i = 0; i < 30; i++) s += `<circle cx="${R(rnd(i) * 1080)}" cy="${R(200 + rnd(i + 40) * 500)}" r="${R(2 + rnd(i + 3) * 3)}" fill="${C.paper}" opacity=".6"/>`;
    s += fill('M0 1040L540 760L1080 1040V1920H0Z', '#2A2F3E') + fill('M380 1920L520 780L560 780L700 1920Z', '#3A4052');
    for (let i = 0; i < 6; i++) { const ph = ((t * .5 + i / 6) % 1), y = 800 + ph * ph * 1100, w0 = 6 + ph * 30; s += fill(D_.rr(540 - w0 / 2, y, w0, 20 + ph * 80, 4), C.a1, .8) }
    const ktr = E(t, T.c('truck', 0, 3.2) - .4, 1.2, 'o');
    s += g(ink(D_.rr(-170, -150, 340, 240, 20), { f: C.a2, c: C.line, w: 7 }) + ink(D_.rr(-140, -120, 280, 100, 12), { f: '#9FD3F5', c: C.line, w: 6 }) + fill(D_.circ(-110, 60, 34), C.a1) + fill(D_.circ(110, 60, 34), C.a1) + `<path d="M-110 60L-400 700H180L110 60Z" fill="${C.a1}" opacity=".08"/>` + ink(D_.rr(-190, 90, 380, 40, 10), { f: C.ink, c: C.line, w: 6 }), at(540, lerp(820, 1120, ktr), lerp(.25, 1, ktr)));
    const kb = E(t, T.c('label', 0, 2.5) - .1, .5, 'back');
    s += g(ink('M-50 -150H50V-110C80 -90 90 -60 90 -20V170C90 190 70 200 50 200H-50C-70 200 -90 190 -90 170V-20C-90 -60 -80 -90 -50 -110Z', { f: '#6B3A1F', c: C.line, w: 6 }) + fill(D_.rr(-80, -10, 160, 130, 10), C.a1) + g(bullHead(0, 0, .2, t, { f: C.a2, ring: false }), at(0, 70)) + ink(D_.rr(-56, -190, 112, 46, 8), { f: C.silver, c: C.line, w: 5 }), at(840, 520, kb, 8));
    s += tx('1976', 220, 470, { f: 'O', s: 100, w: 700, c: C.a1, op: E(t, T.c('1976', 0, 1.5), .4) }) + cap(L('Thailand'), 220, 530, { c: C.paper, op: E(t, T.c('thailand', 0, .6), .4) });
    return g(s, cam(t, T, .04));
  };

  D.austria = (t, S, T) => {
    let s = bg('#BFD9EE');
    s += fill('M0 1040L200 760L330 900L520 640L720 920L860 780L1080 1000V1920H0Z', '#7D8FA8') + fill('M480 700L520 640L560 700L540 690L520 710L500 690Z', '#FFFFFF') + fill('M0 1120C300 1080 760 1110 1080 1090V1920H0Z', '#6FA87A');
    const kp = E(t, T.a, 2, 'io');
    s += g(ink('M-160 -16H120C160 -16 180 0 160 16H-160Z', { f: '#FFFFFF', c: C.ink, w: 6 }) + ink('M-20 -10L-90 -90H-50L40 -10Z', { f: '#E6ECF2', c: C.ink, w: 5 }) + ink('M-20 10L-90 90H-50L40 10Z', { f: '#E6ECF2', c: C.ink, w: 5 }) + ink('M-150 -14L-180 -60H-150L-120 -14Z', { f: C.a2, c: C.ink, w: 5 }), at(lerp(-200, 1300, kp), 420 - kp * 80, 1.1, -6));
    const kz = E(t, T.c('lag', 0, 1.5), .5, 'back');
    s += g(tx('Z', 0, 0, { f: 'U', s: 70, w: 800, c: C.ink }) + tx('z', 60, -50, { f: 'U', s: 50, w: 800, c: C.ink }) + tx('z', 100, -90, { f: 'U', s: 36, w: 800, c: C.ink }), at(200, 640, kz));
    const t87 = T.c('1987', 0, 3.5), kf = E(t, t87 - .2, .5, 'back');
    s += g(line('M0 0V-300', 1, { c: C.ink, w: 10 }) + ink('M0 -300H220V-160H0Z', { f: '#FFFFFF', c: C.ink, w: 6 }) + fill('M0 -300H220V-253H0Z', C.a2) + fill('M0 -207H220V-160H0Z', C.a2), at(700, 1110, kf));
    s += tx('1987', 540, 1260, { f: 'O', s: 100, w: 700, c: C.ink, op: kf }) + can(400, 1000, .6 * kf, { r: -8 });
    return g(s, cam(t, T, .04));
  };

  D.cans = (t, S, T) => {
    let s = bg(C.bg) + fill('M0 1220H1080V1920H0Z', C.bg2);
    const k = E(t, T.a + .2, 2.4, 'io');
    for (let r = 0; r < 7; r++) for (let i = 0; i < 7 - r; i++) { const id = r * 10 + i, kk = clamp(k * 9 - id * .3); if (kk <= 0) continue; s += can(540 + (i - (6 - r) / 2) * 120, 1150 - r * 160 - (1 - EZ.back(Math.min(1, kk))) * 300, .3, { op: Math.min(1, kk * 2) }) }
    s += odo(13969000000 * k, 540, 380, { s: 92, c: C.a1 }) + cap(L('cans in 2025'), 540, 440, { c: C.paper });
    return g(s, cam(t, T, .04));
  };

  D.caff = (t, S, T) => {
    let s = bg(C.bg2);
    const tb = T.c('big', 0, 2.8), mug = (x, y, k) => g(ink('M-70 -60H70L60 70H-60Z', { f: '#FFFFFF', c: C.ink, w: 6 }) + ink('M66 -30C120 -30 120 34 62 34', { f: 'none', c: C.ink, w: 8, dx: 0, dy: 0 }) + fill(D_.ell(0, -54, 64, 12), '#6B4423'), at(x, y, k));
    s += can(260, 660, .8 * E(t, T.a, .4, 'back')) + tx('=', 470, 690, { f: 'O', s: 110, w: 700, c: C.a1, op: E(t, T.a + .4, .3) }) + mug(700, 680, E(t, T.c('coffee', 0, 1.6), .4, 'back'));
    const kb = E(t, tb - .1, .4, 'back');
    s += can(260, 1100, .95 * kb, { big: true }) + tx('=', 470, 1130, { f: 'O', s: 110, w: 700, c: C.a1, op: kb }) + mug(660, 1120, E(t, tb + .25, .4, 'back')) + mug(860, 1120, E(t, tb + .45, .4, 'back'));
    s += cap('≈ 80 mg', 260, 900, { c: C.paper, op: E(t, T.a + .3, .4) }) + cap('≈ 160 mg', 260, 1420, { c: C.paper, op: 0 });
    return g(s, cam(t, T, .04));
  };

  D.sugar = (t, S, T) => {
    let s = bg('#F4F1EA');
    s += can(540, 960, 1.1, { f: C.a3 });
    for (let i = 0; i < 7; i++) { const kk = clamp((t - T.a - .2 - i * .22) / .55); if (kk <= 0) continue; const x = 300 + (i % 4) * 160 + (i > 3 ? 80 : 0), y = lerp(240, 620 + Math.floor(i / 4) * 120, EZ.i(Math.min(1, kk))); s += g(ink('M-60 -10C-60 -30 60 -30 60 -10C60 30 30 44 0 44C-30 44 -60 30 -60 -10Z', { f: C.silver, c: C.ink, w: 5 }) + line('M50 -20L170 -70', 1, { c: C.ink, w: 12 }) + fill(D_.ell(0, -14, 52, 14), '#FFFFFF'), at(x, y, .8, -10)) }
    s += odo(Math.min(7, Math.floor((t - T.a - .2) / .22) + 1) * (t > T.a + .2 ? 1 : 0), 540, 1290, { s: 110, c: C.a2, sep: '' }) + tx(L('tsp'), 610, 1290, { f: 'O', s: 70, w: 500, c: C.ink, a: 'start' });
    return g(s, cam(t, T, .04, 540, 900));
  };

  D.ban = (t, S, T) => {
    let s = bg(C.bg2);
    const t16 = T.c('sixteen', 0, 3.2);
    s += ink(D_.rr(90, 1060, 900, 80, 10), { f: '#8A6A4A', c: C.line, w: 7 });
    s += can(400, 900, .7) + can(620, 900, .7, { f: C.a2 });
    s += g(ink(D_.rr(-170, -110, 340, 220, 20), { f: '#FFFFFF', c: C.ink, w: 7 }) + ink(D_.rr(-140, -70, 110, 140, 10), { f: '#C9D1DC', c: C.ink, w: 5 }) + tx('16+', 70, 30, { f: 'U', s: 80, w: 800, c: C.a2 }), at(800, 600, E(t, T.v + .5, .5, 'back'), 8));
    s += stamp(L('UNDER 16 — NO'), 540, 900, t, t16, { c: C.a2, s: 76, r: -10 });
    s += tx(L('ENGLAND · APRIL 2027'), 540, 400, { f: 'O', s: 56, w: 500, c: C.a1, op: E(t, T.c('2027', 0, 1), .4), ls: 3 });
    return g(s, cam(t, T, .04));
  };

  D.end = (t, S, T) => {
    let s = bg(C.bg);
    const k1 = E(t, T.c('bile', 0, 1), .5, 'back'), k2 = E(t, T.c('truckers', 0, 3), .5, 'back'), k3 = E(t, T.c('fourteen', 0, 5), .5, 'back');
    s += g(bullHead(0, 0, .55, t), at(250, 560, k1)) + g(ink(D_.rr(-110, -70, 220, 140, 16), { f: C.a2, c: C.line, w: 6 }) + ink(D_.rr(-90, -50, 180, 60, 8), { f: '#9FD3F5', c: C.line, w: 5 }) + fill(D_.circ(-60, 70, 26), C.a1) + fill(D_.circ(60, 70, 26), C.a1), at(810, 560, k2));
    s += line('M330 600Q540 470 720 560', k2, { c: C.a1, w: 6, da: '2 16' }) + line('M810 680Q760 860 640 930', k3, { c: C.a1, w: 6, da: '2 16' });
    for (let i = 0; i < 5; i++) s += can(330 + i * 110, 1080 - (i % 2) * 40, .42 * k3, { r: (i - 2) * 6 });
    return g(s, cam(t, T, .04));
  };

  D.end2 = (t, S, T) => {
    let s = bg('#2A1E1A') + fill('M0 1180H1080V1920H0Z', '#3A2A22');
    s += bullHead(380, 900, .95, t, { r: wob(t, .4, 3) });
    s += ink(D_.rr(560, 980, 380, 200, 16), { f: '#6B4A35', c: C.line, w: 7 }) + line('M600 1180V1300M900 1180V1300', 1, { c: C.line, w: 12 });
    const ke = E(t, T.c('royalties', 0, 2.2) - .1, .5, 'back');
    s += g(ink(D_.rr(-140, -90, 280, 180, 10), { f: '#FFFFFF', c: C.ink, w: 6 }) + line('M-140 -90L0 10L140 -90', 1, { c: C.ink, w: 6 }) + `<circle cx="0" cy="12" r="20" fill="${C.a2}"/>` + tx(L('ROYALTIES'), 0, 80, { f: 'O', s: 30, w: 700, c: C.ink, ls: 2 }), at(760, 880, ke, -8));
    s += g(clock(0, 0, 80, 9 + (t - T.a) * 2, ((t - T.a) * 120) % 60, { f: C.paper, c: C.line, hand: C.ink, hand2: C.a2 }), at(860, 470));
    return g(s, cam(t, T, .05));
  };

  window.EP = {
    P: C, D,
    tr: { title: 'cut', can: 'zoom', claim: 'push', bile: 'push', myth: 'wipe', thai: 'push', austria: 'push', cans: 'push', caff: 'push', sugar: 'push', ban: 'push', end: 'fade' },
    trAt: { can: [540, 860] }, trCol: { myth: C.a1 },
    cap: { hi: C.a1, st: '#0A0F1A' },
  };
})();
