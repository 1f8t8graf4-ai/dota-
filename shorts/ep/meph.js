// Мефедрон — «продавали как удобрение для цветов». Палитра: фиолетово-чёрный, фиолетовый, мятный, розовый, кремовый.
(function () {
  const C = { bg: '#140F24', bg2: '#251B42', ink: '#0B0816', paper: '#F1ECF7', line: '#F1ECF7', a1: '#9D7BFF', a2: '#3EE6C1', a3: '#FF5A8A', gold: '#FFD166', green: '#6CC08B', green2: '#3E8E5E', pot: '#C8734A', skin: '#E9B48F' };
  P = C;
  const cam = (t, T, a = .05, cx = 540, cy = 820) => about(cx, cy, 1 + a * EZ.io(P01(t, T.a, T.b - T.a + .5)));
  const D = {};
  // кристаллы
  const SH = [[0, 0, 70, 300, -8], [-110, 40, 60, 220, -24], [110, 30, 64, 250, 18], [-200, 90, 46, 150, -40], [200, 80, 50, 170, 36], [-40, 70, 44, 160, 6]];
  const shard = (x, y, w0, h0, a) => D_.tf([[-w0 / 2, 0], [-w0 / 2, -h0 * .78], [0, -h0], [w0 / 2, -h0 * .78], [w0 / 2, 0]], x, y, a);
  function crystals(x, y, s, t, o = {}) {
    let q = '';
    SH.forEach(([dx, dy, w0, h0, a], i) => { const d = shard(dx, dy, w0, h0, a); q += ink(d, { f: i % 2 ? '#C9BBFF' : '#E3DBFF', c: C.line, w: 6 }) + dots(d, { c: C.a1, step: 12, op: .55, x0: dx + 40, y0: dy, x1: dx - 40, y1: dy - h0 }) + shine(dx - w0 * .18, dy - h0 * .55, h0 * .3, -88 + a, 6, '#fff', .8) });
    if (o.glow) q = `<circle cx="0" cy="-80" r="${R(300 * o.glow)}" fill="${C.a1}" opacity="${R(o.glow * 22) / 100}"/>` + q;
    return g(q, at(x, y, s, o.r || 0), o.op ?? 1)
  }
  const sparkles = (t, n, cx, cy, rr, col) => { let s = ''; for (let i = 0; i < n; i++) { const ph = (t * .7 + rnd(i)) % 1, a = rnd(i + 3) * Math.PI * 2, r0 = rr * (.5 + rnd(i + 9) * .6); s += `<path d="${D_.star(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, 16 * Math.sin(ph * Math.PI), 4, 4, 0)}" fill="${col || C.paper}"/>` } return s };
  const CAT = 'M-170 120C-200 40 -200 -60 -170 -120L-200 -280L-90 -190C-30 -210 30 -210 90 -190L200 -280L170 -120C200 -60 200 40 170 120C110 190 -110 190 -170 120Z';
  function catFace(o = {}) { return ink(CAT, { f: o.f || '#2E2452', c: C.line, w: 8 }) + `<ellipse cx="-70" cy="-30" rx="26" ry="34" fill="${C.a2}"/><ellipse cx="70" cy="-30" rx="26" ry="34" fill="${C.a2}"/><ellipse cx="-70" cy="-30" rx="8" ry="28" fill="${C.ink}"/><ellipse cx="70" cy="-30" rx="8" ry="28" fill="${C.ink}"/>` + fill('M-18 40L18 40L0 62Z', C.a3) + line('M0 62Q-30 90 -50 70M0 62Q30 90 50 70M-60 50L-180 30M-60 66L-180 80M60 50L180 30M60 66L180 80', 1, { c: C.line, w: 5 }) }
  // горшок с растением; mood: fine|glasses
  function plant(x, y, s, t, o = {}) {
    let q = '';
    const sw = wob(t, .35, 3);
    q += line(`M0 -150C${10 + sw} -260 ${-10 + sw} -340 ${sw * 2} -440`, 1, { c: C.line, w: 12 });
    [[0, -230, 170, 60, -20], [0, -290, 160, 56, -160], [0, -360, 130, 46, -35], [0, -390, 120, 42, -150]].forEach(([lx, ly, l, w0, a], i) => { const d = D_.leaf(lx + sw, ly, l, w0, a + sw, .15); q += ink(d, { f: i % 2 ? C.green : '#7FD39C', c: C.line, w: 6 }) + dots(d, { c: C.green2, step: 12, op: .5 }) });
    if (o.bloom) { const kb = clamp(o.bloom); for (let i = 0; i < 6; i++) { const a = i * 60 * Math.PI / 180; q += ink(D_.circ(sw * 2 + Math.cos(a) * 46 * kb, -470 + Math.sin(a) * 46 * kb, 36 * kb), { f: C.a3, c: C.line, w: 5, dx: 3, dy: 3 }) } q += ink(D_.circ(sw * 2, -470, 30 * kb), { f: C.gold, c: C.line, w: 5, dx: 2, dy: 2 }) }
    if (o.glasses) q += g(fill('M-80 0C-80 30 -30 40 -10 10H10C30 40 80 30 80 0Z', C.ink) + line('M-80 0H80', 1, { c: C.line, w: 4 }), at(sw * 2, -460, .8 * clamp(o.glasses)));
    q += ink('M-150 -150H150L120 70H-120Z', { f: C.pot, c: C.line, w: 8 }) + ink(D_.rr(-170, -190, 340, 60, 12), { f: '#D98A5E', c: C.line, w: 7 }) + dots('M-150 -150H150L120 70H-120Z', { c: '#8A4A2A', step: 13, op: .5 });
    return g(q, at(x, y, s, o.r || 0), o.op ?? 1)
  }
  function sachet(x, y, s, o = {}) {
    let q = ink('M-140 -200H140V180H-140Z', { f: '#F7F3E8', c: C.ink, w: 7 }) + fill('M-140 -200H140V-150H-140Z', C.green) + line('M-140 -175H140', 1, { c: C.ink, w: 4, da: '10 10' });
    q += g(ink(D_.leaf(0, 30, 120, 44, -90, .1), { f: C.green, c: C.ink, w: 5, dx: 3, dy: 3 }) + ink(D_.leaf(0, 30, 90, 34, -40, .1), { f: '#7FD39C', c: C.ink, w: 5, dx: 3, dy: 3 }), at(0, -10, .9));
    q += tx('PLANT FOOD', 0, 100, { f: 'O', s: 46, w: 700, c: C.ink, ls: 2 }) + tx(o.small ? 'NOT FOR HUMAN CONSUMPTION' : '', 0, 150, { f: 'M', s: 14, w: 800, c: C.ink, ls: 1 });
    if (LANG === 'ru' && o.ru !== false) q += tx('удобрение', 0, 136, { f: 'M', s: 22, w: 600, c: C.ink, op: .55 });
    return g(q, at(x, y, s, o.r || 0), o.op ?? 1)
  }

  D.title = (t, S, T) => {
    let s = bg(C.bg) + fill(D_.circ(540, 820, 440), C.bg2);
    s += crystals(540, 1040, 1.35 * E(t, 0, .7, 'back') + .02, t, { glow: .7 + Math.sin(t * 3) * .2 }) + sparkles(t, 9, 540, 800, 340, C.paper);
    s += cap(L('What do you know about', 'Что вы знаете о'), 540, 300, { c: C.paper, op: E(t, 0, .4) });
    s += rise(L('MEPHEDRONE?', 'МЕФЕДРОНЕ?'), 540, 1260, t, .15, { f: 'U', w: 800, s: L(84, 80), c: C.a2 });
    return g(s, cam(t, T, .06));
  };

  D.names = (t, S, T) => {
    const tm = T.c(L('meow', 'мяу-мяу.'), 0, .6), tp = T.c(L('party', 'клубный'), 0, 1.6);
    let s = bg(C.bg) + fill(D_.circ(540, 820, 440), C.bg2);
    const km = E(t, tm - .2, .5, 'io');
    if (km <= 0) s += crystals(540, 1040, 1.35, t, { glow: .7 });
    else s += g(km < 1 ? ink(morph(shard(0, 160, 280, 520, 0), CAT, km), { f: '#2E2452', c: C.line, w: 8 }) : catFace(), at(540, 800, 1.1));
    const tags = [[L('MEPH', 'МЕФ'), 250, 420, T.v - .05, -8], [L('MEOW MEOW', 'МЯУ-МЯУ'), 790, 470, tm, 7], ['4-MMC', 230, 1190, tm + .5, 5]];
    tags.forEach(([tt, x, y, t0, r]) => { const k = E(t, t0, .45, 'back'); if (k > 0) { const w0 = tw(tt, { f: 'O', w: 700, s: 56 }) + 60; s += g(ink(D_.rr(-w0 / 2, -46, w0, 92, 46), { f: C.a3, c: C.line, w: 6 }) + tx(tt, 0, 20, { f: 'O', s: 56, w: 700, c: C.paper }), at(x, y, k, r)) } });
    const kd = E(t, tp - .1, .5, 'back');
    if (kd > 0) { let ball = ink(D_.circ(0, 0, 90), { f: '#BFC3D9', c: C.line, w: 7 }); for (let i = -2; i <= 2; i++) ball += line(`M-90 ${i * 34}H90`, 1, { c: C.ink, w: 3, op: .4 }); for (let i = -2; i <= 2; i++) ball += line(`M${i * 34} -90V90`, 1, { c: C.ink, w: 3, op: .4 }); s += line('M860 230V340', 1, { c: C.line, w: 5 }) + g(ball, at(860, 430, kd, t * 40)); for (let i = 0; i < 5; i++) { const a = (200 + i * 30 + Math.sin(t * 2 + i) * 10) * Math.PI / 180; s += `<path d="M860 430L${R(860 + Math.cos(a) * 900)} ${R(430 + Math.sin(a) * 900 + 900)}L${R(860 + Math.cos(a + .08) * 900)} ${R(430 + Math.sin(a + .08) * 900 + 900)}Z" fill="${[C.a1, C.a2, C.a3][i % 3]}" opacity="${R(kd * 12) / 100}"/>` } }
    return g(s, cam(t, T, .05));
  };

  D.claim = (t, S, T) => {
    const tf = T.c(L('food', 'удобрение'), 0, 2), ks = E(t, tf - .25, .55, 'back');
    let s = bg(C.paper) + fill('M0 1180H1080V1920H0Z', '#E3D9C6');
    s += plant(400, 1180, 1.25, t);
    if (ks > 0) s += sachet(800, 1000 - (1 - ks) * 500, .95, { r: 12 });
    s += ringWave(800, 900, t, tf, { c: C.a1, r1: 520 }) + burst(800, 900, t, tf, { c: C.a3, r0: 220, r1: 330 });
    return g(s, cam(t, T, .05, 540, 900));
  };

  D.y1929 = (t, S, T) => {
    let s = bg('#2A2236');
    const tf = T.s(1), kf = E(t, tf, 1.2, 'io');
    let page = ink(D_.rr(-330, -420, 660, 840, 10), { f: '#EADFC6', c: C.ink, w: 7 }) + tx(L('CHEMISTRY JOURNAL', 'ХИМИЧЕСКИЙ ЖУРНАЛ'), 0, -340, { f: 'O', s: 40, w: 700, c: '#5A4A35', ls: 3 });
    for (let i = 0; i < 4; i++) page += line(`M-260 ${210 + i * 44}H${240 - (i % 2) * 80}`, 1, { c: '#5A4A35', w: 8, op: .3 });
    // структурная формула: кольцо + цепочка
    const km = E(t, T.a + .3, 1.6, 'io'), cx = -90, cy = -60;
    const hex = D_.poly([...Array(6)].map((_, i) => [cx + Math.cos((i * 60 + 30) * Math.PI / 180) * 80, cy + Math.sin((i * 60 + 30) * Math.PI / 180) * 80]));
    page += line(hex, km, { c: '#3A2E20', w: 8 }) + line(`M${cx - 40} ${cy - 46}L${cx + 40} ${cy - 46}M${cx - 64} ${cy + 20}L${cx - 24} ${cy + 66}`, km, { c: '#3A2E20', w: 6, op: .7 });
    page += line(`M${cx + 69} ${cy - 40}L${cx + 140} ${cy - 80}L${cx + 210} ${cy - 40}L${cx + 280} ${cy - 80}M${cx + 140} ${cy - 80}V${cy - 160}M${cx + 210} ${cy - 40}V${cy + 40}M${cx - 69} ${cy + 40}L${cx - 130} ${cy + 76}`, km, { c: '#3A2E20', w: 8 });
    page += tx('O', cx + 140, cy - 172, { f: 'O', s: 44, w: 700, c: '#3A2E20', op: km }) + tx('NH', cx + 296, cy - 64, { f: 'O', s: 40, w: 700, c: '#3A2E20', op: km, a: 'start' });
    page += g(stamp('1929', 0, 0, t, T.c('1929', 0, 1.2), { c: C.a3, s: 84, r: -10 }), 'translate(150 200)');
    s += g(page, at(540, 760, E(t, T.a, .5, 'back'), -2), 1 - kf * .55);
    if (kf > 0) { for (let i = 0; i < 40; i++) { const x = 220 + rnd(i) * 640, y = 360 + rnd(i + 40) * 820; s += `<circle cx="${R(x)}" cy="${R(y + (t * 20 * rnd(i + 2)) % 30)}" r="${R(3 + rnd(i + 5) * 5)}" fill="#BFB3A0" opacity="${R(kf * 70) / 100}"/>` } s += line('M200 330Q330 420 260 560M200 330Q420 380 470 330M200 330Q300 470 420 470', kf, { c: '#BFB3A0', w: 3, op: .7 }) }
    if (kf > 0) s += g(fill(D_.rr(290, 1150, 500, 120, 60), C.ink, .9) + odo(1929 + 74 * EZ.io(kf), 540, 1240, { s: 90, c: C.gold, sep: '' }), '', kf);
    return g(s, cam(t, T, .05));
  };

  D.shop = (t, S, T) => {
    let s = bg(C.bg2);
    const k = E(t, T.a, .5, 'back'), tl = T.c(L('label', 'этикетке'), 0, 3);
    let br = ink(D_.rr(-420, -400, 840, 800, 24), { f: '#FFFFFF', c: C.line, w: 7 }) + fill(D_.rr(-420, -400, 840, 70, 24), '#DDD6EE') + `<circle cx="-370" cy="-365" r="12" fill="${C.a3}"/><circle cx="-334" cy="-365" r="12" fill="${C.gold}"/><circle cx="-298" cy="-365" r="12" fill="${C.a2}"/>` + fill(D_.rr(-240, -385, 560, 40, 20), '#FFFFFF');
    br += tx('www.legal-high-shop.co.uk', 40, -357, { f: 'M', s: 22, w: 600, c: '#6B6480' });
    br += g(sachet(0, 0, .8, { ru: false }), 'translate(-170 20)');
    br += tx('£15', 210, -120, { f: 'O', s: 80, w: 700, c: C.ink }) + line('M120 -60H330M120 -20H300M120 20H320', 1, { c: C.ink, w: 9, op: .2 });
    const kb = E(t, T.a + 1, .3);
    br += ink(D_.rr(110, 120, 240, 80, 40), { f: C.a2, c: C.ink, w: 6, dx: 5, dy: 4 }) + tx(L('ADD TO CART', 'В КОРЗИНУ'), 230, 172, { f: 'O', s: 34, w: 700, c: C.ink });
    s += g(br, at(540, 800, k));
    const cx = lerp(900, 780, E(t, T.a + .6, .6, 'io')), cy = lerp(1300, 990, E(t, T.a + .6, .6, 'io')), press = E(t, T.a + 1.25, .12) * (1 - E(t, T.a + 1.4, .15));
    s += g(ink('M0 0L0 70L18 54L32 84L44 78L30 48L54 48Z', { f: C.paper, c: C.ink, w: 5, dx: 0, dy: 0 }), at(cx, cy, 1.4 - press * .2));
    const kl = E(t, tl, .4);
    if (kl > 0) s += line(D_.rr(-170 + 540 - 112, 800 + 20 + 50, 224, 50, 10), kl, { c: C.a3, w: 7 });
    s += tx('2009', 540, 330, { f: 'O', s: 80, w: 700, c: C.gold, op: E(t, T.a, .4) });
    return g(s, cam(t, T, .05));
  };

  D.small = (t, S, T) => {
    let s = bg(C.paper);
    s += sachet(540, 820, 2.2, { small: true, ru: false });
    const k = E(t, T.a + .1, .8, 'io'), kx = E(t, T.v + .2, Math.max(1, T.e - T.v), 'io'), mx = lerp(900, lerp(330, 750, kx), k), my = lerp(1300, 1150, k), id = uid();
    s += `<clipPath id="${id}"><circle cx="${R(mx)}" cy="${R(my)}" r="210"/></clipPath><g clip-path="url(#${id})">` + fill(D_.circ(mx, my, 210), '#FFFFFF') + g(sachet(540, 820, 2.2, { small: true, ru: false }), about(mx, my, 2.1)) + '</g>';
    s += line(D_.circ(mx, my, 210), 1, { c: C.ink, w: 14 }) + line(`M${R(mx + 150)} ${R(my + 150)}L${R(mx + 270)} ${R(my + 270)}`, 1, { c: C.ink, w: 34 });
    if (LANG === 'ru') s += tx('«не для употребления человеком»', 540, 1300, { f: 'M', s: 34, w: 800, c: C.ink, op: E(t, T.v + .6, .4) });
    return g(s, cam(t, T, .04, 540, 1000));
  };

  D.plants = (t, S, T) => {
    let s = bg(C.paper) + fill('M0 1180H1080V1920H0Z', '#E3D9C6');
    s += plant(380, 1180, 1.2, t) + sachet(800, 1100, .7, { r: -8 });
    for (let i = 0; i < 18; i++) s += `<circle cx="${R(720 + rnd(i) * 160)}" cy="${R(860 + rnd(i + 20) * 280)}" r="${R(2 + rnd(i + 3) * 4)}" fill="#A99B85" opacity=".7"/>`;
    s += line('M560 760Q620 700 690 740', E(t, T.v, .5), { c: C.ink, w: 6, da: '2 14' }) + tx('?', 700, 700, { f: 'O', s: 110, w: 700, c: C.a1, op: E(t, T.v + .4, .3) });
    return g(s, cam(t, T, .05, 540, 900));
  };

  D.survey = (t, S, T) => {
    let s = bg(C.bg);
    const tp = T.c('40%', 0, 2.5), kp = E(t, tp - .2, 1.2, 'o5');
    for (let i = 0; i < 10; i++) { const x = 200 + (i % 5) * 170, y = 640 + Math.floor(i / 5) * 270, hi = i < 4 || (i === 4 && kp > .9), k = E(t, T.a + i * .07, .4, 'back'); const col = hi && kp > i / 10 ? C.a3 : C.bg2; s += g(ink(D_.circ(0, -96, 44), { f: col, c: C.line, w: 6 }) + ink('M-74 30C-74 -36 -40 -44 0 -44C40 -44 74 -36 74 30Z', { f: col, c: C.line, w: 6 }), at(x, y + wob(t, 2, 6, i) * (hi ? 1 : .3), k)) }
    for (let i = 0; i < 6; i++) { const a0 = (62 + i * 11 + Math.sin(t * 1.6 + i) * 6) * Math.PI / 180, a1 = a0 + .07; s += `<path d="M540 150L${R(540 + Math.cos(a0) * 1700 * (i % 2 ? 1 : -1))} ${R(150 + Math.sin(a0) * 1700)}L${R(540 + Math.cos(a1) * 1700 * (i % 2 ? 1 : -1))} ${R(150 + Math.sin(a1) * 1700)}Z" fill="${[C.a1, C.a2, C.a3][i % 3]}" opacity=".08"/>` }
    s += odo(40 * kp, 470, 1260, { s: 120, c: C.a3, a: 'end', sep: '' }) + tx('%+', 480, 1260, { f: 'O', s: 120, w: 700, c: C.a3, a: 'start', op: kp });
    s += cap(L('clubbers survey', 'опрос клубной публики'), 540, 380, { c: C.a2, op: E(t, T.a, .4) });
    return g(s, cam(t, T, .04));
  };

  D.redose = (t, S, T) => {
    let s = bg(C.bg) + fill(D_.circ(540, 760, 400), C.bg2);
    const tf = T.c(L('fades', 'короткий'), 0, .8), tm = T.c(L('more', 'ещё'), 0, 3.2), lv = 1 - E(t, tf, 1.6, 'io');
    s += brain(470, 760, { s: 1.35, f: '#F2A7B5', glow: lv, gc: C.a1 });
    s += ink(D_.rr(830, 460, 100, 520, 50), { f: C.ink, c: C.line, w: 6 }) + fill(D_.rr(842, 470 + 496 * (1 - lv), 76, 496 * lv + 2, 38), C.a2);
    s += g(clock(0, 0, 110, 1 + E(t, tf, 2.4) * 1.5, (E(t, tf, 2.4) * 90) % 60, { f: C.paper, c: C.line, hand: C.ink, hand2: C.a3 }), at(250, 1180, E(t, tf + .4, .4, 'back')));
    const km = E(t, tm - .1, .4, 'back');
    if (km > 0) s += g(ink(D_.rr(-170, -60, 340, 120, 60), { f: C.a3, c: C.line, w: 7 }) + tx(L('MORE', 'ЕЩЁ'), 0, 26, { f: 'O', s: 72, w: 700, c: C.paper, ls: 6 }), at(640, 1180, km * (1 + Math.max(0, Math.sin((t - tm) * 9)) * .04), -4));
    return g(s, cam(t, T, .05));
  };

  D.body = (t, S, T) => {
    let s = bg(C.bg);
    const t1 = T.v, t2 = T.c(L('jaws', 'челюсть'), 0, 1.2), t3 = T.c(L('sleep', 'сна'), 0, 2.4);
    const panel = (y, t0, inner) => { const k = E(t, t0 - .15, .45, 'o5'); return k > 0 ? g(fill(D_.rr(90, -150, 900, 300, 40), C.bg2) + inner, `translate(${R((1 - k) * 900)} ${y})`, k) : '' };
    s += panel(470, t1, g(ink(HEART2, { f: C.a3, c: C.line, w: 8 }), at(250, 0, .7 * (1 + Math.max(0, Math.sin(t * 16)) * .08))) + `<g transform="translate(0 0)">${ecg(420, 940, 0, t, { sp: 2.6, amp: 80, per: 130, c: C.a2 })}</g>`);
    let jaw = ink(D_.rr(-170, -90, 340, 80, 30), { f: C.paper, c: C.line, w: 6 }) + ink(D_.rr(-170, 10, 340, 80, 30), { f: C.paper, c: C.line, w: 6 }); for (let i = -3; i <= 3; i++) jaw += line(`M${i * 46} -86V-14M${i * 46} 14V86`, 1, { c: C.ink, w: 4, op: .5 });
    s += panel(810, t2, g(jaw, at(330, 0, 1, wob(t, 9, 1.5))) + line('M560 -40L640 40M640 -40L560 40', 1, { c: C.a3, w: 10 }) + tx(L('clench', 'сводит'), 760, 22, { f: 'O', s: 60, w: 500, c: C.paper, ls: 3 }));
    const eyes = `<ellipse cx="-50" cy="0" rx="34" ry="34" fill="${C.paper}"/><ellipse cx="50" cy="0" rx="34" ry="34" fill="${C.paper}"/><circle cx="${R(-50 + wob(t, .7, 8))}" cy="0" r="16" fill="${C.ink}"/><circle cx="${R(50 + wob(t, .7, 8))}" cy="0" r="16" fill="${C.ink}"/>`;
    s += panel(1150, t3, g(eyes, at(330, -10)) + `<path d="M690 -60A70 70 0 1 0 760 50A56 56 0 1 1 690 -60Z" fill="${C.gold}"/>` + tx('03:47', 560, 22, { f: 'O', s: 60, w: 500, c: C.a2 }));
    return g(s, cam(t, T, .03));
  };

  D.drop = (t, S, T) => {
    let s = bg('#1C1830');
    const k = E(t, T.a, 2.2, 'io'), x0 = 140, x1 = 940, y0 = 760;
    s += line(`M${x0} ${y0}H${x1}`, 1, { c: C.line, w: 4, op: .4, da: '6 14' });
    let d = ''; for (let x = x0; x <= x0 + (x1 - x0) * k; x += 8) { const u = (x - x0) / (x1 - x0), y = u < .3 ? y0 - 200 - Math.sin(u * 20) * 20 : y0 - 200 + EZ.io(clamp((u - .3) / .35)) * 520; d += (d ? 'L' : 'M') + x + ' ' + R(y) }
    if (d) s += line(d, 1, { c: C.a3, w: 12 });
    const cl = (x, y, sc) => g(ink('M-120 40C-170 40 -170 -40 -110 -40C-110 -110 -10 -120 10 -60C40 -110 130 -90 120 -30C170 -30 170 40 120 40Z', { f: '#4A4466', c: C.line, w: 7 }) + line('M-40 60L-60 110M10 60L-10 110M60 60L40 110', 1, { c: '#7FB7D9', w: 7 }), at(x, y, sc));
    s += cl(330 + wob(t, .2, 20), 430, E(t, T.c(L('anxiety', 'тревога'), 0, 1), .5, 'back'));
    const tm = T.c(L('monday', 'понедельник'), 0, 3.2), km = clamp((t - tm + .2) / .5);
    if (km > 0) s += g(ink('M-140 -40H140L170 160H-170Z', { f: '#2B2540', c: C.line, w: 8 }) + ink(D_.rr(-50, -110, 100, 80, 30), { f: 'none', c: C.line, w: 10 }) + tx(L('MONDAY', 'ПОНЕДЕЛЬНИК'), 0, 80, { f: 'O', s: L(60, 40), w: 700, c: C.paper }), at(740, lerp(-200, 1050, EZ.i(Math.min(1, km))) + (km >= 1 ? Math.max(0, Math.sin((t - tm - .3) * 14)) * 8 * (1 - E(t, tm + .3, .6)) : 0)));
    return g(s, cam(t, T, .04));
  };

  D.ban = (t, S, T) => {
    let s = bg(C.bg2);
    const tb = T.c(L('banned', 'запретили'), 0, 1.2), te = T.c('EU', 0, 3.8);
    s += sachet(540, 800, 1.5, { r: -4 });
    s += stamp(L('BANNED', 'ЗАПРЕЩЁН'), 540, 820, t, tb - .05, { c: C.a3, s: 100, r: -12 });
    s += tx(L('UK · APRIL 2010', 'БРИТАНИЯ · АПРЕЛЬ 2010'), 540, 360, { f: 'O', s: 56, w: 500, c: C.paper, op: E(t, tb, .4), ls: 3 });
    const ke = E(t, te - .3, .8, 'back');
    for (let i = 0; i < 12; i++) { const a = (i / 12 * 360 - 90) * Math.PI / 180, r = 460 * ke; if (ke > 0) s += `<path d="${D_.star(540 + Math.cos(a) * r, 800 + Math.sin(a) * r, 34, 14)}" fill="${C.gold}"/>` }
    s += tx(L('EU · DEC 2010', 'ЕС · ДЕКАБРЬ 2010'), 540, 1300, { f: 'O', s: 56, w: 500, c: C.gold, op: E(t, te, .4), ls: 3 });
    return g(s, cam(t, T, .04));
  };

  D.russia = (t, S, T) => {
    let s = bg(C.bg);
    const tt = Math.min(T.c(L('tonnes', 'тонн'), 0, 2.4), T.v + .9), kd = clamp((t - tt + .45) / .45), land = kd >= 1;
    s += fill('M0 1180H1080V1920H0Z', C.bg2) + line('M0 1180H1080', 1, { c: C.line, w: 6, op: .5 });
    const y = land ? 1180 : lerp(-400, 1180, EZ.i(kd)), shake = land ? Math.max(0, 1 - (t - tt) * 3) : 0;
    if (kd > 0) s += g(ink('M-230 0L-180 -420H180L230 0Z', { f: '#3A3352', c: C.line, w: 9 }) + ink('M-110 -420C-110 -560 110 -560 110 -420', { f: 'none', c: C.line, w: 26, dx: 0, dy: 0 }) + tx(L('6 t', '6 т'), 0, -150, { f: 'O', s: 170, w: 700, c: C.gold }), at(540 + wob(t, 12, 8 * shake), y));
    if (land) for (let i = 0; i < 10; i++) { const k = clamp((t - tt) / .8), a = Math.PI + i / 9 * Math.PI; s += `<circle cx="${R(540 + Math.cos(a) * (240 + k * 260))}" cy="${R(1170 + Math.sin(a) * k * 120)}" r="${R(26 * (1 - k))}" fill="#6B6480"/>` }
    s += tx('2024', 540, 380, { f: 'O', s: 90, w: 700, c: C.paper, op: E(t, T.a, .4) }) + cap(L('seized in Russia', 'изъято в России'), 540, 450, { c: C.a1, op: E(t, T.a, .4) });
    return g(s, cam(t, T, .04, 540, 900));
  };

  D.end = (t, S, T) => {
    let s = bg(C.paper) + fill('M0 1180H1080V1920H0Z', '#E3D9C6');
    s += plant(330, 1180, 1.05, t) + sachet(780, 1080, .8, { r: 10 });
    s += g(ink(D_.rr(-110, -150, 220, 300, 8), { f: '#EADFC6', c: C.ink, w: 6 }) + tx('1929', 0, 20, { f: 'O', s: 60, w: 700, c: C.a3 }), at(760, 600, E(t, T.a + .2, .5, 'back'), -8));
    s += line('M760 760Q790 860 780 900', E(t, T.a + .6, .5), { c: C.ink, w: 6, da: '2 14' });
    return g(s, cam(t, T, .04, 540, 900));
  };

  D.end2 = (t, S, T) => {
    let s = bg('#BFE6D2') + fill('M0 1180H1080V1920H0Z', '#9FD3B6') + fill(D_.circ(840, 420, 110), C.gold, .9);
    s += plant(470, 1180, 1.3, t, { bloom: E(t, T.a + .2, .8, 'back'), glasses: E(t, T.c(L('fine', 'хорошо'), 0, .6), .4, 'back') });
    s += sachet(860, 1150, .55, { r: 80, op: .9 });
    return g(s, cam(t, T, .05, 540, 900));
  };

  window.EP = {
    P: C, D,
    tr: { title: 'cut', names: 'wipe', claim: 'push', y1929: 'push', shop: 'zoom', small: 'push', plants: 'push', survey: 'push', redose: 'iris', body: 'push', drop: 'push', ban: 'push', russia: 'fade', end: 'push' },
    trAt: { shop: [370, 820], redose: [470, 760] },
    trCol: { names: C.a3, redose: C.a1 },
    cap: { hi: C.a2, st: '#0B0816' },
  };
})();
