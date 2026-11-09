// Никотин v10 · ролик B (nicsb, голос Макс): анимация v9 (ep/nics.js), улучшенная по отзыву Андрея 09.11 («анимации местами сомнительные,
//   видно, где рисовал Fable, а где Opus»): одноразка перетекает в сигарету (вместо раскола), горло — царапины вместо зубчиков, руки у колб
//   и штампа, в школе возвращается записка 1973 с «молодёжным рынком» (расплата сюжета), рука с одноразкой живее. Общие предметы — ep/n9lib.js.
(function () {
  'use strict';
  const { C, MONO, FY, G2, sh, BIG, bgG, dotBg, cam, pop9, T9, mono, wipeTx, year, stamp9, VW, VH, VBODY, VMOUTH, vape, vapeLine, CLB, cloud, curl9, cig, folder, sheet, hex, crystal, lerp2, PROF, HAIR70, THROAT, teen70, throat, chemist, backPerson, handVape, calendar, typewriter, REPORT, report, FLASK, BEAKER, glassFill, glass, vial, flashDrive, juulDev, pack, mango, apple, pin, thread, QUOTE, QN, LIT, TEEN_C, SKINS, teenBust, SHELF_C } = N9;
  P = { bg: C.night, paper: C.paper, ink: C.night, line: C.paper, a1: C.mango, a2: C.red };
  const D = {};

  // =================== 1. ЗАСТАВКА: «Что вы знаете о никотине? Что на нём сидит больше миллиарда человек?» ===================
  // одноразка в центре; на «миллиарда» камера отъезжает — вокруг зажигаются огоньки (люди), счётчик
  const PEOPLE = [...Array(420)].map((_, i) => { const a = i * 2.39996, r = 150 + Math.sqrt(i) * 34; return [Math.cos(a) * r, Math.sin(a) * r * 1.02, i] });
  const PCOL = [C.mango, C.line, C.red, C.paper, '#7EA6FF', '#C58BFF', C.apple];
  D.title = (t, S, T) => {
    const t1 = T.s(1), kz = E(t, t1 - .15, 1.1, 'io');        // отъезд
    let s = bgG('#16233F', C.night, [540, 760, 760, '#3C5FA8', .32]) + dotBg(.35);
    // люди-огоньки
    let pp = '';
    if (kz > 0) for (const [x, y, i] of PEOPLE) {
      const q = clamp((t - t1 + .1) * 3.2 - i / 80); if (q <= 0) break;
      const tw2 = .75 + .25 * Math.sin(t * 3 + i);
      pp += `<circle cx="${R(x)}" cy="${R(y)}" r="${R((5 + (i % 3)) * EZ.back(clamp(q)))}" fill="${PCOL[i % PCOL.length]}" opacity="${R(tw2 * 100) / 100}"/>`
    }
    const vs = lerp(1.12, .56, kz), vy = lerp(900, 800, kz);
    s += g(pp, at(540, vy, lerp(1.6, 1, kz)));
    s += glow(540, vy, lerp(420, 230, kz), C.mango, .22);
    // облако из мундштука
    const kc = E(t, .25, 1.4, 'o');
    s += curl9(540 + 40 * vs, vy - 300 * vs, t, 200 * vs, C.smoke, 8 * vs, .55 * kc * (1 - E(t, t1 + .2, .6)));
    s += vape({ x: 540, y: vy + fl(t, 7, .3), s: vs, r: -7 + fl(t, 1.2, .22, .3) });
    // заголовок
    const ky = lerp(0, -70, kz);
    s += wipeTx('ЧТО ВЫ ЗНАЕТЕ О', 540, 300 + ky, t, -.5, { f: 'M', w: 800, s: 40, c: C.fog, ls: 9 });
    s += rise('НИКОТИНЕ?', 540, 440 + ky, t, -.42, { f: 'U', w: 800, s: 124, c: C.paper });
    // счётчик
    if (t > t1) {
      const kn = E(t, t1 + .1, 1.5, 'o');
      s += g(odo(1e9 * kn + 2.5e8 * E(t, t1 + 1.2, .8, 'o'), 0, 0, { f: 'O', w: 700, s: 104, c: C.paper, sep: ' ' }), at(540, 1226), clamp((t - t1) * 4));
    }
    return g(s, cam(t, T, .03))
  };

  // =================== 2. ТЕЗИС: одноразка просвечивается (соль в баке), год назад 2026 → 1973, одноразка перетекает в сигарету ===================
  const VSIL = 'M-30 -348H30C34 -320 38 -290 40 -252H47C73 -252 95 -230 95 -204V202C95 228 73 250 47 250H-47C-73 250 -95 228 -95 202V-204C-95 -230 -73 -252 -47 -252H-40C-38 -290 -34 -320 -30 -348Z';
  const CSIL = D_.rr(-34, -270, 68, 540, 10);
  D.claim = (t, S, T) => {
    const tx0 = T.c('солевой') - .15, ty = T.c('пятьдесят') - .2, t2 = T.s(1), km = E(t, t2 - .15, .8, 'io5');
    const kx = E(t, tx0, .8, 'io');
    let s = bgG('#16233F', C.night, [540, 760, 700, lerp2('#3C5FA8', '#E9474F', km), .28]) + dotBg(.3);
    if (kx > 0 && km < 1) { let gr = ''; for (let i = 0; i <= 12; i++) gr += `<path d="M${i * 90} 0V1920M0 ${i * 160}H1080" stroke="${C.line}" stroke-width="1.5" opacity="${R(.1 * kx * (1 - km))}"/>`; s += gr }
    const vy = 830, vs = lerp(.56, 1.42, E(t, T.a, 1.0, 'io5'));
    let v = '';
    if (km <= 0) {
      v += vape({ op: 1 - kx }) + vapeLine(clamp(kx * 1.15));
      if (kx > .3) { const kq = clamp((kx - .3) / .7); v += F(D_.rr(-50, -VH / 2 + 104 + 170 * (1 - .78), 100, 170 * .78 - 6, 14), C.mango, { op: .28 * kq }); for (let i = 0; i < 7; i++) { const q = clamp(kq * 7 - i * .7); if (q > 0) v += crystal(-32 + (i % 3) * 32 + rnd(i) * 6, -VH / 2 + 250 - Math.floor(i / 3) * 34 + fl(t, 3, .5, i * .3), 15 * EZ.back(q), { r: i * 20 }) } }
    } else {
      const d = morph(VSIL, CSIL, km);
      v += sh(d, { op: .4 }) + F(d, lerp2('#22345E', '#FBF7EE', km)) + Ln(d, 1, { c: C.line, w: 5, op: 1 - km });
      if (km > .55) { const q = clamp((km - .55) / .45); v += g(cig({ len: 540, h: 68, r: -90, shadow: false }), '', q) + curl9(0, -292, t, 240, C.smoke, 7, .65 * q) }
    }
    s += g(v, at(540, vy + fl(t, 5, .3) * (1 - km), vs, -7 * (1 - kx) * (1 - km)));
    const kl = E(t, tx0 + .55, .5) * (1 - E(t, ty - .1, .35));
    if (kl > 0) s += Ln(`M${540 + 70 * vs} ${vy - 40 * vs}L840 560H1000`, kl, { c: C.mango, w: 4 }) + tx('СОЛЕВОЙ', 842, 520, { f: 'O', w: 700, s: 46, c: C.mango, a: 'start', op: kl }) + tx('НИКОТИН', 842, 612, { f: 'O', w: 500, s: 40, c: C.paper, a: 'start', op: kl });
    if (t > ty) {
      const kr = E(t, ty, 1.25, 'io5'), yv = Math.round(lerp(2026, 1973, kr));
      s += g(year(String(yv), 0, 0, t, ty - .25, { s: 190, c: kr >= 1 ? C.red : C.paper, d: .35, stag: .04 }), at(540, 330, 1 + .08 * Math.sin(P01(t, ty + 1.25, .3) * PI)));
      if (kr >= 1) cue(ty + 1.25, 'thud', .7);
    }
    if (km > 0) cue(t2 - .15, 'whoosh', .5);
    return g(s, cam(t, T, .04))
  };

  // =================== 3. ЗАПИСКА 1973: «В 1973 году в компании «Рейнольдс» написали секретную записку. «Чтобы выжить…»» ===================
  D.memo = (t, S, T) => {
    const tc = T.c('компании') - .2, tz = T.c('записку'), tq = T.s(1), te = T.se(1), tm = T.c('молодёжного');
    const pan = E(t, tc, .95, 'io'), zq = E(t, tq - .5, .85, 'io5');
    // мир: календарь вверху, стол с машинкой внизу; камера едет вниз, потом наезд на лист
    let w = '';
    let wall = ''; for (let i = 0; i < 10; i++) wall += F(D_.rr(i * 120 - 60, -600, 112, 3400, 0), i % 2 ? '#24304C' : '#202A44');
    w += wall + F(D_.rr(-200, 2210, 1480, 1200, 0), '#0B0F1A', { op: .5 });
    // календарь
    const drop = E(t, T.a - .1, .55, 'back');
    w += g(calendar('1973', 'ФЕВРАЛЬ'), at(540, lerp(-320, 640, drop), 1, lerp(-6, 2, drop)));
    // стол
    w += F(D_.poly([[-300, 2280], [1380, 2280], [1700, 3300], [-620, 3300]]), C.wood2) + F(D_.rr(-300, 2270, 1680, 26, 0), '#6B4A35');
    for (let i = 0; i < 6; i++) w += Ln(`M${-200 + i * 260} 2330C${-100 + i * 260} 2600 ${-180 + i * 300} 2900 ${-260 + i * 330} 3300`, 1, { c: '#000', w: 4, op: .14 });
    // досье и пепельница на столе
    w += folder({ x: 150, y: 2420, s: .62, r: -12, label: 'R.J.R.' });
    w += F(D_.ell(900, 2440, 110, 40), '#1E222B') + F(D_.ell(900, 2428, 86, 26), '#3A3F4A') + cig({ x: 960, y: 2414, len: 200, h: 24, r: -8, shadow: false }) + curl9(1060, 2400, t, 300, C.smoke, 6, .45);
    // лист в машинке: печатается и подаётся вверх
    const kp = clamp((t - (tc + .5)) / (tz - tc - .3)), kq = clamp((t - tq) / (te - tq - .25));
    const feed = 40 * kp + 150 * kq;
    let pg = sheet(440, 520, { n: 0, shadow: false });
    pg += mono('R.J. REYNOLDS TOBACCO CO.', -190, -200, { s: 17, c: C.ink2 }) + mono('2 ФЕВРАЛЯ 1973', -190, -174, { s: 17, c: C.ink2 });
    const hdr = 'ЗАПИСКА О МОЛОДЁЖНОМ РЫНКЕ';
    pg += mono(hdr.slice(0, Math.ceil(hdr.length * kp)), -190, -126, { s: 18, c: C.ink });
    let n = Math.round(QN * kq), yy = -60;
    for (const l of QUOTE) { const m = Math.min(n, l.length); if (m > 0) pg += mono(l.slice(0, m), -190, yy, { s: 25, c: C.ink }); n -= m; yy += 46 }
    const km = E(t, tm - .05, .6, 'io');
    if (km > 0) pg += Ln('M-206 92C-120 108 110 106 150 92C190 78 200 54 130 48C40 40 -170 42 -216 66C-236 78 -226 92 -196 96', km, { c: C.red, w: 6 });
    pg += stamp9('СЕКРЕТНО', 128, -224, t, tz - .1, { s: 27, sc: 1, r: -9 });
    w += g(clip(D_.rr(-260, -400, 520, 620, 0), g(pg, `translate(0 ${R(-120 - feed)})`)), at(540, 1990));
    w += g(typewriter(), at(540, 2010));
    // табличка на стене
    w += F(D_.rr(90, 1330, 320, 70, 8), '#C9A24A') + F(D_.rr(100, 1340, 300, 50, 6), '#8C6A26') + tx('R.J. REYNOLDS', 250, 1376, { f: 'O', w: 700, s: 32, c: '#F6E3A8', ls: 4 });
    const camY = -1180 * pan, z = lerp(1, 2.3, zq), y0 = 1880 - feed, shift = zq * (640 - (y0 + camY));
    const [gid, gd] = lgrad([[0, '#05070C', 0], [1, '#05070C', .75]], 0, 900, 0, 1500, true);
    const s = BG('#0B1020') + g(g(w, `translate(0 ${R(camY)})`), about(540, y0 + camY, z) + ` translate(0 ${R(shift / z)})`) + gd + `<rect x="0" y="900" width="1080" height="1020" fill="url(#${gid})" opacity="${R(zq * 100) / 100}"/>`;
    if (t > T.a) cue(T.a + .02, 'impact', .7);
    for (let i = 0; i < 5; i++) cue(tc + .6 + i * .32, 'tick', .45, -.2 + i * .1);
    cue(tz - .1, 'stamp', .8);
    return s
  };

  // =================== 4. «Но молодым курить противно: дым дерёт горло.» ===================
  // горло: три царапины-полосы и красное свечение (вместо зубчиков — Андрей: «анимации сомнительные»)
  function throatS(k, hot, t) {
    let s = Ln(THROAT, 1, { c: '#000', w: 34, op: .22 }) + Ln(THROAT, k, { c: lerp2('#9FD4E8', '#FF5A3C', hot), w: 18, op: .95 });
    if (hot > .05) {
      const P0 = pts(THROAT, 20);
      [6, 10, 14].forEach((i, j) => { const q = clamp(hot * 3 - j * .6); if (q <= 0) return; const [x, y] = P0[i], d = `M${R(x - 30)} ${R(y - 12)}L${R(x + 30)} ${R(y + 12)}`; s += Ln(d, q, { c: '#FFF1E8', w: 9 }) + Ln(d, q, { c: C.red, w: 5 }) });
      s += glow(40, 140, 170, C.red, .3 * hot * (.8 + .2 * Math.sin(t * 12)));
    }
    return s
  }
  D.harsh = (t, S, T) => {
    const td = T.c('дерёт') - .15, cough = P01(t, td + .55, .9);
    let s = bgG('#3A2230', '#140C16', [760, 520, 700, '#E0703A', .2]) + dotBg(.22);
    s += F(D_.rr(-100, 1180, 1300, 900, 0), '#0E0910', { op: .4 });
    const sk = shake(t, td + .45, 9, .9, 32), hot = E(t, td, .35);
    const kin = E(t, T.a + .15, 1.0, 'o');
    const th = throatS(kin, hot, t);
    s += teen70({ x: 470 + sk, y: 760, s: 1.55, squint: hot > .5 ? 1 : 0, open: cough > 0 && cough < 1 ? Math.sin(cough * PI * 3) * .5 + .5 : 0, throat: th, r: hot * -4 });
    // сигарета в губах
    s += g(cig({ len: 230, h: 28, shadow: false }) + curl9(115, -14, t, 220, C.smoke, 6, .55), at(470 + 136 * 1.55 + 115 * 1.55 + sk, 760 + 48 * 1.55, 1.55, -6 + hot * 8), 1 - E(t, td + .5, .3));
    // затяжка: дым по горлу
    // кашель — облака изо рта
    for (let i = 0; i < 3; i++) { const q = P01(t, td + .5 + i * .22, 1.1); if (q <= 0 || q >= 1) continue; s += cloud(470 + 230 * 1.55 + q * 260 + i * 30, 760 + 70 - q * 160 - i * 40, (.35 + q * .5), { op: (1 - q) * .9 }) }
    cue(td + .5, 'puff', .9);
    return g(s, cam(t, T, .05, 600, 760))
  };

  // =================== 5. ЛАБОРАТОРИЯ: смешали с кислотой → соль не дерёт → 30 вариантов, зелёное яблоко ===================
  D.lab = (t, S, T) => {
    const t1 = T.s(1), t2 = T.s(2), tk = T.c('кислотой'), t30 = T.c('тридцать'), tap = T.c('яблоком') - .1;
    const p1 = E(t, t1 - .35, .8, 'io'), p2 = E(t, t2 - .35, .8, 'io'), camX = -1080 * (p1 + p2);
    let w = '';
    // стена с плиткой и стол на всю ширину мира
    let tiles = ''; for (let x = -200; x < 3500; x += 120) for (let y = -100; y < 1150; y += 120) tiles += F(D_.rr(x + 3, y + 3, 114, 114, 6), '#22324A');
    w += F(D_.rr(-200, -200, 3700, 1400, 0), '#1A2638') + tiles + F(D_.rr(-200, 1080, 3700, 1000, 0), '#2B3242') + F(D_.rr(-200, 1080, 3700, 22, 0), '#55607A');
    // --- A: смешивание
    const pa = E(t, T.a + .25, .7, 'io'), pour = clamp((t - T.a - .7) / 1.6), kc = E(t, tk + .25, .9, 'o');
    const lvl = .12 + .55 * pour;
    w += Ln('M540 1080V560M440 560H640', 1, { c: '#6B7690', w: 12 }) + F(D_.rr(380, 1060, 320, 26, 10), '#55607A');
    w += g(glassFill(FLASK, lvl, lerp2('#F2B35A', '#F5E6B8', kc), [-160, -250, 320, 460]) + glass(FLASK), at(540, 840));
    if (kc > 0) for (let i = 0; i < 14; i++) { const q = clamp(kc * 14 - i * .8); if (q > 0) w += crystal(540 - 90 + (i % 5) * 45 + rnd(i) * 14, 980 - Math.floor(i / 5) * 42 + fl(t, 3, .4, i), 18 * EZ.back(q), { r: i * 23 }) }
    if (kc > 0) w += burst(540, 900, t, tk + .3, { c: C.paper, r0: 120, r1: 230, n: 12, w: 6 });
    const bk = (x, dir, c, lab, k) => {
      const tilt = dir * 62 * k, bx = 540 + dir * lerp(330, 150, k), by = lerp(760, 540, k);
      let b = F(D_.rr(dir < 0 ? -760 : 110, -46, 650, 92, 40), '#ECE8DF') + F(D_.rr(dir < 0 ? -150 : 110, -50, 40, 100, 12), '#C9D4E0') + glassFill(BEAKER, .7 - .5 * pour, c, [-80, -110, 166, 240]) + glass(BEAKER) + F(D_.rr(-56, -20, 112, 58, 6), C.paper) + tx(lab, 0, 20, { f: 'O', w: 700, s: 26, c: C.ink })
        + F(D_.ell(dir * 92, 6, 40, 56), '#9FD0EA') + Ln(`M${dir * 70} -20H${dir * 100}M${dir * 70} 4H${dir * 104}M${dir * 70} 28H${dir * 100}`, 1, { c: '#6FA9C7', w: 4 });
      let str = '';
      if (k > .9 && pour > 0 && pour < 1) str = Ln(`M${540 + dir * 70} ${by - 60}C${540 + dir * 40} ${by - 40} ${540 + dir * 12} ${by + 20} ${540 + dir * 4} 600`, 1, { c, w: 12 });
      return str + g(b, at(bx, by, .9, tilt))
    };
    w += bk(540, -1, '#F2A93A', 'НИКОТИН', pa) + bk(540, 1, '#9FE3D6', 'КИСЛОТА', pa);
    w += g(F(D_.rr(-110, -32, 220, 64, 12), C.paper) + tx('СОЛЬ', 0, 20, { f: 'O', w: 700, s: 44, c: C.red2, ls: 6 }), at(540, 300, 1), kc);
    // --- B: та же соль — горло спокойно, доза растёт
    const kb = clamp((t - t1 + .2) / (t2 - t1 - .1));
    w += teen70({ x: 1080 + 470, y: 760, s: 1.5, throat: throat(1, 0, t) + (kb > 0 ? [...Array(5)].map((_, i) => { const P0 = pts(THROAT, 30), q = ((t * .9 + i / 5) % 1), p = P0[Math.floor(q * 29)]; return crystal(p[0], p[1], 9, { r: i * 30 }) }).join('') : '') });
    w += g(cig({ len: 230, h: 28, shadow: false }), at(1080 + 470 + 136 * 1.5 + 115 * 1.5, 760 + 48 * 1.5, 1.5, -6));
    const dose = EZ.io(clamp(kb * 1.25));
    w += F(D_.rr(1080 + 900, 420, 70, 640, 35), '#0E1422') + clip(D_.rr(1080 + 900, 420, 70, 640, 35), gfill(D_.rr(1080 + 900, 420 + 640 * (1 - dose), 70, 640 * dose, 0), C.red, C.mango));
    w += tx('ДОЗА', 1080 + 935, 380, { f: 'O', w: 700, s: 34, c: C.fog, ls: 6 });
    // --- C: молодой химик и 30 пробирок
    const X0 = 2160;
    const nv = Math.floor(clamp((t - t30 + .25) / 1.0) * 30);
    for (let i = 0; i < 30; i++) {
      const r = Math.floor(i / 6), c = i % 6, x = X0 + 520 + c * 82, y = 560 + r * 140;
      if (i >= nv) continue;
      const green = i === 15, kg = green ? E(t, tap - .4, .4) : 0;
      w += g(vial(.62, green ? lerp2('#F2B35A', C.apple, kg) : ['#F2B35A', '#E8C27A', '#F5D27E', '#E9A65A', '#F0BE6A'][i % 5], { cap: green && kg > .5 ? '#3E9152' : '#8A93A6' }), at(x, y, .9 + .1 * EZ.back(clamp((t - t30 + .25 - i / 30) * 4))));
      if (green && kg > 0) { for (let j = 0; j < 3; j++) { const q = ((t - tap) * .7 + j / 3) % 1; if (t > tap) w += curl9(x + (j - 1) * 8, y - 90, t + j, 120 + q * 60, C.apple, 6, (1 - q) * .8) } }
    }
    w += F(D_.rr(X0 + 470, 1250, 520, 20, 6), '#55607A');
    if (nv > 0) w += g(odo(nv, 0, 0, { f: 'O', w: 700, s: 70, c: C.paper }), at(X0 + 610, 470));
    const ka = E(t, tap, .5, 'back');
    if (ka > 0) w += g(apple(0, 0, 1), at(X0 + 870, 330, ka * .85, 8 * Math.sin(t * 2)));
    w += chemist(t, { x: X0 + 250, y: 1300, s: 1.3, look: t > tap ? 1 : 0, brow: E(t, tap, .3), smile: E(t, tap + .3, .4) });
    let s = BG('#121A2A') + g(w, `translate(${R(camX)} 0)`);
    cue(T.a + .7, 'drip', .7); cue(tk + .3, 'shimmer', .8); cue(t30 - .2, 'tick', .4); cue(tap, 'pin', .8);
    return g(s, cam(t, T, .03, 540, 800))
  };

  // =================== 6. «В 79-м на отчёт поставили штамп «Конфиденциально».» ===================
  D.stamp = (t, S, T) => {
    const ty = T.a, ts = T.c('засекретили'), tk = T.c('Конфиденциально') - .05;
    let s = BG(C.wood2);
    for (let i = 0; i < 12; i++) s += Ln(`M${-100 + i * 110} -100C${-60 + i * 110} 600 ${-140 + i * 110} 1300 ${-80 + i * 110} 2100`, 1, { c: '#000', w: 5, op: .12 });
    s += glow(540, 760, 900, '#F2C277', .14);
    // год
    const kr = E(t, ty, .9, 'io5'), yv = Math.round(lerp(1973, 1979, kr));
    s += g(year(String(yv), 0, 0, t, ty - .3, { s: 180, c: C.paper, d: .3, stag: .03 }), at(540, 330));
    // досье: лист отчёта ложится, папка закрывается
    const kin = E(t, ty + .1, .7, 'o5'), kcl = E(t, ts - .55, .45, 'io');
    let f = F(D_.rr(-300, -230, 600, 460, 18), C.folder2) + sh(D_.rr(-300, -230, 600, 460, 18), { op: .35 });
    f += g(report(500, 400, clamp((t - ty) / 1.4)), `translate(0 ${R(lerp(-700, 0, kin))})`, kin);
    // крышка папки (сворачивается сверху вниз)
    if (kcl > 0) f += g(G2(D_.rr(-300, -230, 600, 460, 18), C.folder, C.folder2) + F(D_.rr(-260, -190, 200, 70, 8), C.paper) + tx('№ 1979', -160, -140, { f: 'O', w: 700, s: 40, c: C.ink }), `translate(0 -230) scale(1 ${R(kcl)}) translate(0 230)`);
    f += stamp9('КОНФИДЕНЦИАЛЬНО', 20, 90, t, tk, { s: 60, r: -8 });
    const hit = shake(t, tk + .05, 10, .35, 40);
    s += g(f, at(540, 830 + hit, 1.15, -2));
    // штемпель сверху
    const kd = P01(t, tk - .45, .5), up = kd < .9 ? EZ.i(kd / .9) : 1 - EZ.o((kd - .9) / .1 * .4);
    const sy = lerp(-500, 930, t < tk ? EZ.i(clamp(kd * 1.0)) : 1 - E(t, tk + .15, .5, 'io'));
    if (t > tk - .6 && t < tk + .8) s += g(F(D_.rr(-70, -1500, 140, 1080, 50), '#2B3550') + F(D_.rr(-74, -440, 148, 40, 14), '#3A4766') + F(D_.rr(-70, -360, 140, 260, 50), '#3B2A20') + F(D_.ell(0, -380, 110, 60), '#4A3528') + G2(D_.ell(0, -404, 92, 70), C.skin, C.skin2) + F(D_.rr(-170, -110, 340, 90, 14), '#2A2E37') + F(D_.rr(-160, -26, 320, 26, 6), C.red2), at(560, sy));
    if (t > tk) s += ringWave(560, 920, t, tk + .02, { c: C.red, r0: 60, r1: 520, w: 10, d: .5 });
    cue(tk, 'stamp', 1.1); cue(tk + .02, 'thud', .7);
    return g(s, cam(t, T, .05, 540, 830))
  };

  // =================== 7. АРХИВ: «Но потом табачным компаниям пришлось открыть архивы. И записи «Рейнольдс» изучили два студента Стэнфорда.» ===================
  D.archive = (t, S, T) => {
    const to = T.c('пришлось') - .35, t1 = T.s(1), ts = T.c('Стэнфорда');
    const ko = E(t, to, .9, 'io'), kz = E(t, to + .5, 1.3, 'io5'), kb = E(t, t1 - .15, .6, 'io');
    let s = '';
    // --- A: хранилище
    let a = bgG('#1B2638', '#0A0F18') + dotBg(.25);
    // полки внутри (в перспективе), видны когда дверь открыта
    let sh0 = glow(540, 780, 520, '#F2E2B0', .5 * ko);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 9; c++) { const x = 290 + c * 56, y = 560 + r * 74; sh0 += F(D_.rr(x, y, 44, 60, 4), ['#E6BC6E', '#D9A85A', '#EFD08E', '#C99B4B'][(r * 3 + c) % 4]) + F(D_.rr(x, y, 44, 10, 2), C.paper, { op: .7 }) }
    for (let r = 0; r <= 6; r++) sh0 += F(D_.rr(270, 548 + r * 74, 540, 12, 3), '#5A4A3A');
    const our = E(t, to + .7, .6, 'back');
    sh0 += g(folder({ s: .5, label: '1979', stamp: 'КОНФ.' }), at(540, lerp(780, 760, our), lerp(.3, 1, our)), our);
    a += g(clip(D_.circ(540, 780, 400), BG('#2A2216') + sh0), about(540, 780, 1 + kz * .5));
    // дверь: поворачивается на петле влево
    const door = (() => {
      let d = sh(D_.circ(0, 0, 400), { op: .5 }) + G2(D_.circ(0, 0, 400), '#AEB7C6', '#5E6878') + F(D_.circ(0, 0, 340), '#8C96A8') + F(D_.circ(0, 0, 330), '#6E788A');
      for (let i = 0; i < 12; i++) { const an = i * PI / 6; d += F(D_.circ(Math.cos(an) * 370, Math.sin(an) * 370, 14), '#4A5262') }
      const wh = t * 40 * (1 - ko) + E(t, to - .6, .6) * 120;
      let spokes = F(D_.circ(0, 0, 60), '#3A4150'); for (let i = 0; i < 3; i++) spokes += F(D_.rr(-170, -12, 340, 24, 12), '#3A4150', { tr: `rotate(${R(wh + i * 60)})` });
      d += spokes + F(D_.circ(0, 0, 30), '#B9C1CE');
      return d
    })();
    a += g(door, `translate(${R(540 - 400 * ko)} 780) scale(${R(Math.cos(ko * 1.35))} 1) translate(${R(400 * ko)} 0)`, 1 - clamp((ko - .8) * 5));
    a += g(F(D_.circ(540, 780, 420), 'none') + `<circle cx="540" cy="780" r="410" fill="none" stroke="#3A4150" stroke-width="22"/>`, '', 1);
    // --- B: два студента ночью у ноутбука
    let b = bgG('#101830', '#070B16', [540, 600, 700, '#5FB4E8', .25]) + dotBg(.2);
    b += F(D_.rr(120, 120, 300, 400, 10), '#0B1226') + F(D_.rr(130, 130, 280, 380, 6), '#16244A') + [...Array(14)].map((_, i) => F(D_.circ(140 + rnd(i) * 260, 140 + rnd(i + 7) * 340, 2 + rnd(i + 3) * 3), '#C9D6FF', { op: .7 })).join('');
    // стол
    b += F(D_.poly([[-60, 1120], [1140, 1120], [1300, 1600], [-220, 1600]]), '#3A2F2A') + F(D_.rr(-60, 1110, 1200, 16, 0), '#5A4A40');
    // лампа
    b += Ln('M900 1110L960 820L860 700', 1, { c: '#2A2E37', w: 14 }) + F('M800 640L930 700L880 780L760 720Z', '#2A2E37') + glow(830, 760, 300, '#FFD08A', .35);
    // ноутбук: экран с запиской и графиками
    const lx = 540, ly = 720;
    b += F(D_.poly([[lx - 330, ly + 230], [lx + 330, ly + 230], [lx + 380, ly + 290], [lx - 380, ly + 290]]), '#8A93A6') + F(D_.rr(lx - 320, ly - 230, 640, 460, 18), '#2A2E37');
    let scr = BG('#E9EEF5');
    scr += g(sheet(260, 340, { n: 7, shadow: false, top: 90, dy: 30 }) + stamp9('СЕКРЕТНО', 40, -120, t, t1 + .3, { s: 22, sc: 1 }) + mono('R.J.R. · 1979', -100, -130, { s: 13, c: C.ink2 }), at(lx - 140, ly));
    const kg = clamp((t - t1 - .4) / 1.5);
    scr += Ln(`M${lx + 20} ${ly + 130}V${ly - 140}M${lx + 20} ${ly + 130}H${lx + 280}`, 1, { c: '#5A6478', w: 4 });
    scr += Ln(`M${lx + 30} ${ly + 110}C${lx + 80} ${ly + 100} ${lx + 120} ${ly - 40} ${lx + 160} ${ly - 60}S${lx + 230} ${ly + 40} ${lx + 270} ${ly - 100}`, kg, { c: C.red, w: 6 });
    scr += Ln(`M${lx + 30} ${ly + 120}C${lx + 100} ${ly + 110} ${lx + 160} ${ly + 40} ${lx + 270} ${ly + 30}`, kg, { c: C.line2, w: 6 });
    b += clip(D_.rr(lx - 300, ly - 210, 600, 420, 8), scr);
    b += glow(lx, ly, 600, '#BFE3FF', .12);
    // студенты со спины
    b += backPerson({ x: 250, y: 1500, s: 1.25, c1: '#5C6B8C', c2: '#3B4763', light: '#BFE3FF' }) + backPerson({ x: 840, y: 1520, s: 1.3, c1: '#9A4B3C', c2: '#6B3328', hair: '#C9A26A', hairD: 'M-104 -340C-130 -540 130 -540 104 -340C120 -300 110 -260 96 -250C90 -330 -90 -330 -96 -250C-110 -260 -120 -300 -104 -340Z', light: '#BFE3FF' });
    // рука показывает на график
    // курсор подходит к графику
    const kp = E(t, ts - .9, .7, 'io');
    b += g(F('M0 0L0 46L12 34L22 56L30 52L20 32L36 32Z', '#fff') + Ln('M0 0L0 46L12 34L22 56L30 52L20 32L36 32Z', 1, { c: '#1E2230', w: 3 }), at(lerp(lx - 60, lx + 170, kp), lerp(ly + 150, ly - 50, kp), 1.3));
    s = b;
    if (kb < 1) { const id = uid(); s = (kb > 0 ? b : '') + g(a, `translate(${R(-1080 * kb)} 0)`) }
    if (kb > 0 && kb < 1) s = g(a, `translate(${R(-1080 * kb)} 0)`) + g(b, `translate(${R(1080 * (1 - kb))} 0)`);
    cue(to, 'whirr', .7); cue(to + .5, 'impact', .5);
    return g(s, cam(t, T, .05, 540, 780))
  };

  // =================== 8. «Джул»: флешка → сигарета; соль и патент; картридж = пачка; манго ===================
  D.juul = (t, S, T) => {
    const t1 = T.s(1), t2 = T.s(2), tf = T.c('флешку') - .25, tp = T.c('патенте') - .1, tm = T.c('манго') - .1, tpk = T.c('пачке') - .25;
    const p1 = E(t, t1 - .3, .7, 'io'), p2 = E(t, t2 - .3, .7, 'io');
    let s = bgG('#173A4A', '#0B1A26', [540, 700, 760, '#7FF0DA', .2]) + dotBg(.28);
    // --- A: 2015, флешка превращается в сигарету
    let a = g(year('2015', 0, 0, t, T.a - .1, { s: 210, c: C.paper, d: .45 }), at(540, 380));
    const tj = T.c('Джул') - .25, kj = E(t, tj, .6, 'back'), km = E(t, tf, .6, 'o5'), spin = fl(t, 3, .25);
    a += g(juulDev({ led: .5 + .5 * Math.sin(t * 3) }), at(540, lerp(820, 740, km), lerp(.6, 1.55, kj), -8 + spin), clamp(kj * 2));
    if (kj > 0 && kj < 1) a += burst(540, 820, t, tj + .1, { c: C.line, r0: 200, r1: 360, n: 14, w: 7 });
    a += g(flashDrive(), at(lerp(1500, 600, km), 1020, 1.25, -8 + spin), km);
    a += tx('≈', 540, 935, { f: 'U', w: 800, s: 90, c: C.line, op: E(t, tf + .35, .3) });
    const sw = P01(t, tj + .5, .8); if (sw > 0 && sw < 1) a += clip(D_.rr(-260 * 1.55 + 540, 820 - 46 * 1.55, 540 * 1.55, 92 * 1.55, 30), F(D_.poly([[lerp(-200, 1300, sw), 600], [lerp(-120, 1380, sw), 600], [lerp(-260, 1240, sw), 1040], [lerp(-340, 1160, sw), 1040]]), '#fff', { op: .35 }));
    // --- B: внутри соль; патент со ссылкой на «Рейнольдс»
    let b = g(juulDev({ salt: E(t, t1, .8), p1: '#E8F4F2', p2: '#BFD8D4', liq: '#F5D27E' }) + Ln(D_.rr(100, -60, 190, 120, 26), E(t, t1 - .1, .5), { c: C.line, w: 5 }), at(lerp(540, 300, E(t, tp - .2, .6)), lerp(820, 1130, E(t, tp - .2, .6)), lerp(1.55, 1, E(t, tp - .2, .6)), -8));
    const kpt = E(t, tp - .2, .6, 'o5');
    let pt = sheet(520, 660, { n: 10, top: 150, dy: 34, shadow: true });
    pt += tx('ПАТЕНТ США', 0, -260, { f: 'O', w: 700, s: 40, c: C.ink, ls: 4 }) + mono('2015 · ПАТЕНТ НА СОЛЬ', -200, -218, { s: 18, c: C.ink2 });
    pt += Ln(D_.rr(-110, -200, 220, 54, 14), 1, { c: C.ink2, w: 3 }) + Ln('M-60 -173H40', 1, { c: C.ink2, w: 3 });
    const kh = E(t, tp + .45, .45);
    pt += F(D_.rr(-226, 190, 452, 70, 8), C.mango, { op: .45 * kh }) + mono('R.J. REYNOLDS · 1989', -206, 236, { s: 25, c: C.ink }) + Ln(D_.rr(-230, 186, 460, 78, 10), kh, { c: C.red, w: 6 });
    b += g(pt, at(lerp(1500, 690, kpt), 760, 1, 4 * (1 - kpt)));
    // нить к папке 1979
    const kt = E(t, tp + .8, .8, 'io');
    b += g(folder({ s: .42, label: '1979', stamp: 'КОНФ.' }) + pin(0, -70), at(230, 330, 1, -6), E(t, tp + .6, .4));
    if (kt > 0) b += thread([[460, 1030], [380, 700], [230, 280]], kt) + pin(460, 1030);
    // --- C: картридж = пачка; манго
    const kc = clamp((t - t2) / .1);
    const tilt = t < tpk ? 14 : 14 * Math.exp(-(t - tpk) * 3.2) * Math.cos((t - tpk) * 9);
    let c = '';
    c += F('M540 1240V700', 'none') + Ln('M540 1250V660', 1, { c: '#8C96A8', w: 16 }) + F(D_.rr(400, 1240, 280, 30, 12), '#6E788A') + F(D_.circ(540, 650, 22), '#B9C1CE');
    const bx = (sg) => [540 + Math.cos(tilt * PI / 180) * 300 * sg, 650 + Math.sin(tilt * PI / 180) * 300 * sg];
    c += Ln(`M${R(bx(-1)[0])} ${R(bx(-1)[1])}L${R(bx(1)[0])} ${R(bx(1)[1])}`, 1, { c: '#B9C1CE', w: 14 });
    const panAt = (sg, inner) => { const [x, y] = bx(sg); return Ln(`M${R(x)} ${R(y)}L${R(x - 90)} ${R(y + 200)}M${R(x)} ${R(y)}L${R(x + 90)} ${R(y + 200)}`, 1, { c: '#8C96A8', w: 4 }) + F(`M${R(x - 130)} ${R(y + 200)}H${R(x + 130)}C${R(x + 110)} ${R(y + 250)} ${R(x - 110)} ${R(y + 250)} ${R(x - 130)} ${R(y + 200)}Z`, '#6E788A') + g(inner, at(x, y + 196)) };
    const kmg = E(t, tm, .45);
    c += panAt(-1, g(F(D_.rr(-70, -44, 140, 64, 18), lerp2('#D7DEE6', C.mango, kmg)) + F(D_.rr(-56, -34, 90, 40, 10), C.mango, { op: .4 + .4 * kmg }) + F(D_.rr(50, -38, 14, 52, 5), '#2A2E37'), at(0, 0, 1.15)));
    c += panAt(1, pack({ n: 1, s: .55, y: -78 }));
    const kmn = E(t, tm + .1, .5, 'back');
    if (kmn > 0) c += g(mango(0, 0), at(250, 520, kmn * 1.25, -10));
    // сборка с камерой: A → B (вниз), B → C (вбок)
    s += g(a, `translate(0 ${R(-1920 * p1)})`) + g(b, `translate(${R(-1080 * p2)} ${R(1920 * (1 - p1))})`) + g(c, `translate(${R(1080 * (1 - p2))} 0)`, p2 > 0 ? 1 : 0);
    cue(tj + .1, 'shimmer', .9); cue(tf + .1, 'swish', .5); cue(t1 + .1, 'zap', .5); cue(tp + .5, 'pin', .7); cue(tpk + .2, 'ding', .7); cue(tm + .1, 'pin', .7);
    return g(s, cam(t, T, .03, 540, 800))
  };

  // =================== 9. «По странному стечению обстоятельств, вскоре в США парил каждый четвёртый старшеклассник.» ===================
  D.teens = (t, S, T) => {
    const tl = T.c('четвёртый') - .2;
    let s = bgG('#2A3A55', '#121A2A') + dotBg(.18);
    // шкафчики
    for (let i = 0; i < 11; i++) { const x = i * 104 - 30; s += F(D_.rr(x, 260, 96, 760, 6), i % 2 ? '#3B5A86' : '#36557F') + F(D_.rr(x + 14, 300, 68, 8, 3), '#24385A') + F(D_.rr(x + 14, 320, 68, 8, 3), '#24385A') + F(D_.rr(x + 74, 560, 10, 60, 5), '#C9D3E6') }
    s += F(D_.rr(-50, 1000, 1180, 1000, 0), '#1E2638') + F(D_.rr(-50, 1000, 1180, 14, 0), '#5A6A8A');
    s += cap('США · 2019', 540, 200, { s: 34, c: C.fog, ls: 10 }) ;
    // 4 ряда по 4, задние меньше
    const rows = [[640, .78], [820, .9], [1010, 1.02], [1220, 1.16]];
    const LITP = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const i = r * 4 + c, [y, sc] = rows[r], x = 540 + (c - 1.5) * 250 * sc + (r % 2 ? 40 : -40);
      const kin = E(t, T.a + .05 + i * .035, .45, 'back'), lit = LIT.has(i), kl = E(t, tl + (lit ? [...LIT].indexOf(i) * .12 : 0), .4, 'back');
      if (lit) LITP.push([x, y - 232 * sc]);
      s += g(teenBust(i, lit, t, kl), at(x, y + (1 - kin) * 80, sc * kin), clamp(kin * 2) * (lit || kl <= 0 ? 1 : 1 - .45 * kl));
    }
    // расплата: возвращается записка 1973 года, красные нити — к закурившим
    const tp = T.s(1), kp = E(t, tp - .25, .6, 'o5');
    if (kp > 0) {
      let pg = sheet(620, 400, { n: 0 });
      QUOTE.forEach((l, i) => pg += mono(l, -270, -112 + i * 52, { s: 31, c: C.ink }));
      pg += Ln('M-292 66C-150 92 220 92 280 66C322 46 312 14 228 10C86 4 -230 6 -300 36C-322 48 -312 66 -282 72', E(t, tp + .25, .6), { c: C.red, w: 7 });
      pg += stamp9('1973', 214, -150, t, tp + .05, { s: 34 });
      s += `${BIG} fill="#05070C" opacity="${R(.35 * kp)}"/>`;
      const kt = E(t, tp + .5, .7, 'io');
      LITP.forEach(([x, y], i) => { if (kt > 0) s += thread([[520, 420], [x, y]], clamp(kt * 1.4 - i * .12), { w: 5 }) + pin(x, y) });
      s += g(pg, at(lerp(1600, 540, kp), 290, .95, -3));
    }
    cue(tl, 'puff', .6); cue(tp + .1, 'stamp', .5);
    return g(s, cam(t, T, .05, 540, 900))
  };

  // =================== 10. «А треть компании купил производитель «Мальборо». Почти за 13 млрд $. Формула вернулась домой.» ===================
  D.deal = (t, S, T) => {
    const t1 = T.s(1), th = T.c('домой') - .1, tb = T.c('тринадцать') - .3;
    const kb = E(t, t1 - .5, .5, 'io');
    // --- A: доля компании уходит к табачной пачке
    let a = bgG('#2A1F2A', '#0F0B12', [540, 760, 700, '#E9474F', .16]) + dotBg(.2);
    const kp = E(t, T.a + .2, .7, 'o5'), ks = E(t, T.a + 1.0, 1.0, 'io');
    let pie = F(D_.circ(0, 0, 330), '#1E2633') + F(D_.circ(0, 0, 320), '#2C3646');
    const sl = (a0, a1) => `M0 0L${R(Math.cos(a0) * 300)} ${R(Math.sin(a0) * 300)}A300 300 0 ${a1 - a0 > PI ? 1 : 0} 1 ${R(Math.cos(a1) * 300)} ${R(Math.sin(a1) * 300)}Z`;
    pie += F(sl(-PI / 2 + 2 * PI / 3, 3 * PI / 2), '#3E4B63');
    pie += g(juulDev({ led: 1 }), at(0, 0, .8, -20));
    const off = ks * 260;
    pie += g(F(sl(-PI / 2, -PI / 2 + 2 * PI / 3), C.red) + tx('1/3', 130, -70, { f: 'U', w: 800, s: 64, c: C.paper }), `translate(${R(off * .87)} ${R(-off * .5)})`);
    a += g(pie, at(460, 860, kp));
    a += g(pack({ n: 1, s: 1.1 }), at(lerp(1300, 860, kp), 520, 1, 10));
    a += g(odo(12.8e9 * E(t, tb, 1.3, 'o'), 0, 0, { f: 'O', w: 700, s: 92, c: C.mango, pre: '$', sep: ' ' }), at(540, 1290), E(t, tb - .1, .3));
    // --- B: доска с нитками — круг замыкается
    let b = BG('#5A3E2B') + `${BIG} fill="url(#d9w)"/>` + glow(540, 800, 700, '#F2C277', .2);
    const IT = [
      [540, 380, () => g(sheet(220, 280, { n: 6, top: 80, dy: 28, shadow: true }) + mono('1973', -90, -100, { s: 26, c: C.red }), at(0, 0, 1, -4))],
      [880, 640, () => folder({ s: .5, label: '1979', stamp: 'КОНФ.' })],
      [800, 1080, () => g(F(D_.rr(-150, -100, 300, 200, 12), '#2A2E37') + F(D_.rr(-134, -86, 268, 172, 6), '#E9EEF5') + mono('2005', -60, 10, { s: 30, c: C.ink }), at(0, 0, 1, 5))],
      [300, 1080, () => juulDev({ s: .55, r: -10 })],
      [210, 640, () => pack({ n: 1, s: .7, r: -6 })],
    ];
    IT.forEach(([x, y, f], i) => { const q = E(t, t1 - .3 + i * .1, .4, 'back'); if (q > 0) b += g(f() + pin(0, -100), at(x, y, q)) });
    const path = [...IT.map(([x, y]) => [x, y - 100]), [IT[0][0], IT[0][1] - 100]];
    const kt = clamp((t - (t1 + .25)) / (th - t1 - .15));
    if (kt > 0) { let L0 = 0; const seg = []; for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); seg.push(d); L0 += d } let rem = EZ.io(kt) * L0, pp = [path[0]]; for (let i = 1; i < path.length && rem > 0; i++) { const q = Math.min(1, rem / seg[i - 1]); pp.push([lerp(path[i - 1][0], path[i][0], q), lerp(path[i - 1][1], path[i][1], q)]); rem -= seg[i - 1] } b += thread(pp, 1, { w: 7 }) }
    const kc = E(t, th, .5, 'o');
    if (kc > 0) b += ringWave(540, 760, t, th, { c: C.red, r0: 100, r1: 700, w: 14, d: .8 }) + g(stamp9('ДОМОЙ', 0, 0, t, th + .05, { s: 70 }), at(540, 760));
    let s = kb < 1 ? g(a, '', 1 - kb) : '';
    if (kb > 0) s += g(b, about(540, 800, lerp(1.3, 1, EZ.o(kb))), kb);
    cue(tb, 'coins', .7); cue(t1 - .2, 'whoosh', .6); cue(th, 'impact', .75);
    return g(s, cam(t, T, .04, 540, 800))
  };

  // =================== 11. ВЫ: «Сегодня эта соль — в большинстве одноразок. Вам кажется… А вас выбрали раньше… Она ведь и сейчас у вас в руке?» ===================
  D.you = (t, S, T) => {
    const t1 = T.s(1), t2 = T.s(2), t3 = T.s(3), tsl = T.c('соль') - .3, t73 = T.c('семьдесят') - .1;
    const kh = E(t, t1 + .55, 1.4, 'io'), kq = E(t, t2 - .3, .8, 'io'), kf = E(t, t3 - .4, .9, 'io5');
    let s = bgG('#1A2232', '#0A0E16', [540, 700, 760, '#FFE3B0', .12 * (1 - kq)]) + dotBg(.2 * (1 - kq));
    // полка с одноразками
    let sh0 = '';
    for (let r = 0; r < 3; r++) {
      const y = 470 + r * 330;
      sh0 += F(D_.rr(30, y + 120, 1020, 26, 6), '#C9CFDA') + F(D_.rr(30, y + 146, 1020, 18, 0), '#000', { op: .25 });
      for (let c = 0; c < 6; c++) {
        const i = r * 6 + c, [c1, c2] = SHELF_C[(i * 4) % SHELF_C.length], x = 120 + c * 168, mango1 = i === 9;
        const picked = mango1 ? kh : 0;
        if (mango1 && kh > .02) continue;
        const sc = t > tsl ? clamp((t - tsl) * 2.2 - c * .15 - r * .1) : 0, hasSalt = i !== 4 && i !== 13;
        let v = vape({ s: .42, c1: mango1 ? C.mango : c1, c2: mango1 ? C.mango2 : c2, led: 0, shadow: false });
        if (sc > 0 && hasSalt) v += g(crystal(0, -10, 26 * EZ.back(clamp(sc * 2)), { r: i * 20 }), '', 1);
        sh0 += g(v, at(x, y, 1), 1 - .55 * kh * (mango1 ? 0 : 1));
      }
    }
    const scan = P01(t, tsl, 1.3);
    if (scan > 0 && scan < 1) sh0 += F(D_.rr(lerp(-40, 1080, scan), 300, 14, 1200, 7), C.line, { op: .8 }) + glow(lerp(-40, 1080, scan), 900, 260, C.line, .25);
    s += g(sh0, `translate(0 ${R(-240 * kh)})`, 1 - .85 * kq);
    // записка 1973 за спиной
    if (kq > 0) {
      let pg = sheet(820, 1000, { n: 0, shadow: false });
      pg += mono('R.J. REYNOLDS TOBACCO CO. · 1973', -360, -400, { s: 26, c: C.ink2 });
      QUOTE.forEach((l, i) => pg += mono(l, -360, -250 + i * 72, { s: 46, c: C.ink }));
      pg += Ln('M-380 -20C-200 6 280 4 360 -20C420 -40 420 -84 320 -90C140 -100 -300 -96 -390 -60C-420 -44 -410 -20 -360 -12', E(t, t2 + .2, .7), { c: C.red, w: 9 });
      pg += stamp9('СЕКРЕТНО', 230, -330, t, t2 + .1, { s: 46 });
      s += g(pg, at(540, 660, lerp(1.15, 1, kq), -3), kq * .9);
      s += g(year('1973', 0, 0, t, t73, { s: 150, c: C.red, d: .4 }), at(540, 1250), 1 - kf);
    }
    // рука с манго
    const hs = lerp(.68, 1.25, kh) * lerp(1, 1.12, kf), hx = lerp(120 + 3 * 168, 540, kh), hy = lerp(800 + 80 * .68 - 240 * kh, 980, kh) + fl(t, 6, .3) * kh;
    s += g(handVape({ c1: C.mango, c2: C.mango2, led: t > t3 ? .5 + .5 * Math.sin((t - t3) * 5) : 1 }), at(hx, lerp(2000, hy, E(t, t1 - .2, .7, 'o5')), hs, lerp(6, -4, kh)));
    // прицел
    const kx = E(t, t2 + .5, .7, 'o5');
    if (kx > 0) { const r = lerp(520, 230, kx) * lerp(1, .85, kf); s += g(Ln(D_.circ(0, 0, r), 1, { c: C.red, w: 6, op: .9 }) + Ln(`M${-r - 40} 0H${-r + 50}M${r - 50} 0H${r + 40}M0 ${-r - 40}V${-r + 50}M0 ${r - 50}V${r + 40}`, 1, { c: C.red, w: 6 }) + F(D_.circ(0, 0, 8), C.red), at(540, 860, 1, kx * 30), kx) }
    if (kf > 0) s += `${BIG} fill="#000" opacity="${R(kf * .35)}"/>`;
    cue(tsl + .1, 'zap', .45); cue(t2 + .1, 'stamp', .55); cue(t2 + .5, 'heart', .9); cue(t3 + .2, 'heart', .9);
    return g(s, cam(t, T, .05, 540, 900))
  };

  // переходы-сдвиги: у фонов этого ролика запас за край кадра (для наездов) — на сдвиге обрезаем каждую сцену по кадру, иначе новая закрывает старую
  const _trV8 = transition;
  transition = function (kind, k, A, B, SA, SB) {
    if (/^pan/.test(kind)) { const fr = 'M0 0H1080V1920H0Z'; return _trV8(kind, k, clip(fr, A), clip(fr, B), SA, SB) }
    return _trV8(kind, k, A, B, SA, SB)
  };

  window.EP = {
    P, D, clean: true, lead: .12,
    cap: { size: 60, top: 1372, hi: C.mango, st: '#070B14' },
    defs: () => V8DEFS() + `<pattern id="d9" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="18" cy="18" r="2.2" fill="#9DB4E0" opacity=".35"/></pattern>`
      + `<pattern id="d9w" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="2" fill="#000" opacity=".16"/></pattern>`,
    tr: { title: 'cut', claim: 'cut', memo: 'panL', harsh: 'panU', lab: 'panD', stamp: 'zoom', archive: 'dive', juul: 'panL', teens: 'cut', deal: 'zoom' }, trDef: 'cut',
    trAt: { stamp: [540, 830], archive: [540, 720], deal: [540, 760] }, trR: { archive: 200 }, trBg: { archive: '#E9EEF5' },
    init() {
      const st = document.createElement('style'), c = '#070B14';
      st.textContent = `#cap{font-weight:800!important;letter-spacing:0!important;text-shadow:${[...Array(16)].map((_, i) => `${(Math.cos(i * PI / 8) * 6).toFixed(1)}px ${(Math.sin(i * PI / 8) * 6).toFixed(1)}px 0 ${c}`).join(',')},0 8px 22px rgba(0,0,0,.5)!important}#cap .u{color:#E9E4D8!important;opacity:1!important}`;
      document.head.appendChild(st);
    }
  };
})();
