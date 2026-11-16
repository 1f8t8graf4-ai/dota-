  // ================= v18.5 (16.11): МИР 1 — 0…21 с выпуска 2 одной камерой =================
  // Ледяная одноразка на подиуме в витрине → отъезд: ночной магазин «ВЕЙПЫ 24/7» → камера едет по улице к Капитолию
  // (вкусы на полке гаснут на «запретили») → нырок в окно Капитолия → лист закона: пустая клетка на «одного слова»,
  // печать FDA на «закон» → календарь «январь 2020» → вырезка «Джул» → рама с лезвием FDA: «рубят», вкусы вспыхивают
  // каждый на своём слове, на «нож» лезвие падает. Камера — одна кривая (camAt), слои с параллаксом, всё внахлёст.
  const W1 = { bg: '#262a40', ln: '#eef2f7', dim: '#3a3f5e', fac: '#2f3454', fac2: '#3a4066', ac: '#3b5d9a', ac2: '#26406c', ice: '#9fdcf7',
    red: '#e8445a', mint: '#5eead4', paper: '#f4efe4', ink: '#1e2340', inBg: '#2a2c47', warm: '#ffd479', road: '#20243a', walk: '#343a5c' };
  const CWIN = { x: 2700, y: -575, w: 160, h: 260 }, SHS = 0.1;   // окно Капитолия = центр листа закона; лист 1000×1500 в масштабе 0.1
  const LU = (u, v) => [CWIN.x + (u - 500) * SHS, CWIN.y + (v - 750) * SHS];
  let WK = null, KEYS1 = null, TIN = 99;
  function w1Init() {
    const w = Wd; WK = {
      ice: w('ледяная'), i: w('и'), prod: w('продают'), vk: w('вкусами'), am: w('америке'), zap: w('запретили'), y20: w('2020'), vse: w('всё'),
      odn: w('одного'), zab: w('забыли'), zak: w('закон'), jan: w('январь'), y20b: w('2020', 1), sk: w('скандала'), juul: w('джулом'), vl: w('власти'),
      usa: w('сша'), rub: w('рубят'), vk2: w('вкусами', 1), fl: [w('манго'), w('фрукты'), w('десерты'), w('мята')], pod: w('под'), nozh: w('нож'),
    };
    const k = WK, ln = Math.log, L = (t, u, v, z, r) => { const p = LU(u, v); return [t, p[0], p[1], ln(z), r] };
    KEYS1 = [
      [0, 0, -730, ln(2.05), -0.016], [k.ice, 4, -760, ln(2.26), -0.004], [k.i + .25, 16, -805, ln(1.22), 0.008], [k.prod + .2, 40, -850, ln(0.62), 0.012],
      [k.vk, 150, -880, ln(0.5), 0.01], [k.zap - .05, 700, -890, ln(0.45), 0.002], [k.y20 + .1, 2350, -860, ln(0.42), -0.008], [k.y20 + .75, 2650, -800, ln(0.5), -0.012],
      [k.vse - .05, 2694, -650, ln(0.98), -0.006], L(k.odn + .12, 560, 560, 11.5, 0),
      L(k.zab + .45, 520, 590, 13.4, -0.004), L(k.zak + .45, 420, 640, 12.6, 0.004), L(k.jan + .55, 300, 880, 12.0, 0.01),
      L(k.y20b + 1.3, 340, 900, 11.6, 0.006), L(k.juul - .02, 700, 915, 11.0, 0.0), L(k.vl + .4, 520, 1100, 9.5, 0.006), L(k.rub + .12, 500, 1220, 10.8, 0.002),
      L(k.fl[0] - .05, 470, 1258, 11.4, -0.004), L(k.fl[3] + .1, 530, 1272, 11.8, 0.003), L(k.pod, 505, 1284, 12.0, 0.0), L(k.nozh + .8, 500, 1300, 12.8, 0.004),
    ];
    TIN = 99;   // с этого кадра камера внутри окна: рисуем только интерьер (окно уже закрыло весь экран — шва нет)
    for (let f = Math.floor(k.vse * 30); f < (k.odn + 1) * 30; f++) {
      const cm = camObj(camAt(KEYS1, f / 30)), v = viewRect(cm);
      if (v.x0 > CWIN.x - CWIN.w / 2 + 2 && v.x1 < CWIN.x + CWIN.w / 2 - 2 && v.y0 > CWIN.y - CWIN.h / 2 + 2 && v.y1 < CWIN.y + CWIN.h / 2 - 2) { TIN = f / 30; break }
    }
    if (TIN > 98) throw new Error('v185: камера не заходит в окно целиком');
  }
  const W1END = () => K.scr0 + .45;
  // ---------- мелочи ----------
  function lnW(c, w, col = W1.ln) { c.strokeStyle = col; c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke() }
  function star4(c, x, y, r, a) { if (a <= 0 || r <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.beginPath(); c.moveTo(0, -r); c.quadraticCurveTo(r * .12, -r * .12, r, 0); c.quadraticCurveTo(r * .12, r * .12, 0, r); c.quadraticCurveTo(-r * .12, r * .12, -r, 0); c.quadraticCurveTo(-r * .12, -r * .12, 0, -r); fill(c, '#fff'); c.restore() }
  function snowCap(c, x0, x1, y, h, seed) {   // шапка снега кривыми по верху предмета
    c.beginPath(); c.moveTo(x0 - 6, y + 4); const n = Math.max(2, Math.round((x1 - x0) / 60));
    for (let i = 0; i < n; i++) { const xa = lp(x0, x1, i / n), xb = lp(x0, x1, (i + 1) / n), hh = h * (.6 + H1(seed + i) * .6); c.bezierCurveTo(xa + (xb - xa) * .2, y - hh, xb - (xb - xa) * .2, y - hh, xb, y) }
    c.lineTo(x1 + 6, y + 4); c.closePath(); fill(c, '#f8fbff');
  }
  function mound(c, x, y, w, h) { c.beginPath(); c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w * .32, y - h, x + w * .3, y - h * 1.1, x + w / 2, y); c.closePath(); fill(c, '#f1f6fc') }
  // ---------- одноразка-героиня: поворот в объёме, иней ползёт снизу ----------
  function vapeHero(c, t, x, y, th, frost) {
    const w = 180, h = 460, d = 64, cw = Math.cos(th), sw = d * Math.abs(Math.sin(th)), sd = th >= 0 ? 1 : -1, fw = w * cw, tot = fw + sw;
    const fx0 = sd > 0 ? -tot / 2 : -tot / 2 + sw, sx0 = sd > 0 ? fx0 + fw : -tot / 2;
    c.save(); c.translate(x, y);
    c.save(); c.translate(0, h / 2 + 6); c.scale(1, .2); circ(c, 0, 0, tot * .78, 'rgba(10,12,30,.45)'); c.restore();
    const body = () => { c.beginPath(); c.roundRect(-tot / 2, -h / 2, tot, h, 34) };
    body(); fill(c, W1.ac);
    c.save(); body(); c.clip();
    c.fillStyle = W1.ac2; c.fillRect(sx0, -h / 2, sw, h); dotsRect(c, sx0, -h / 2, sw, h, 12, 2.6, 'rgba(120,160,220,.45)');
    poly(c, [fx0, h / 2, fx0, h * .18, fx0 + fw, -h * .02, fx0 + fw, h / 2]); fill(c, '#4a6fb0');   // косая заливка
    poly(c, [fx0 + fw * .12, -h / 2, fx0 + fw * .26, -h / 2, fx0 + fw * .26, h / 2, fx0 + fw * .12, h / 2]); fill(c, 'rgba(255,255,255,.13)');   // блик
    if (frost > 0) {   // иней: светлая шапка снизу с зубчатым краем + кристаллы
      const fy = h / 2 - h * 1.05 * frost; c.beginPath(); c.moveTo(-tot, h / 2 + 4); c.lineTo(-tot, fy);
      for (let i = 0; i <= 14; i++) { const xx = lp(-tot / 2, tot / 2, i / 14), yy = fy + (i % 2 ? -18 : 10) * (.6 + H1(i * 3) * .6) + Math.sin(t * 2 + i) * 3; c.lineTo(xx, yy) }
      c.lineTo(tot, fy); c.lineTo(tot, h / 2 + 4); c.closePath(); c.fillStyle = 'rgba(205,236,255,.42)'; c.fill(); lnW(c, 3, 'rgba(255,255,255,.9)');
      for (let i = 0; i < 16; i++) { const yy = h / 2 - H1(i * 7.7) * h * .98; if (yy < fy) continue; const k = spr(cl((h / 2 - yy) / (h * 1.05) < frost ? (frost - (h / 2 - yy) / (h * 1.05)) * 6 : 0));
        crystal6(c, lp(-tot / 2 + 18, tot / 2 - 18, H1(i * 3.1)), yy, (9 + H1(i) * 9) * k, .95, i + t * .3) }
    }
    c.restore();
    body(); lnW(c, 5); c.beginPath(); c.moveTo(sx0 + (sd > 0 ? 0 : sw), -h / 2 + 30); c.lineTo(sx0 + (sd > 0 ? 0 : sw), h / 2 - 30); lnW(c, 3, 'rgba(238,242,247,.55)');
    // эмблема-снежинка и надпись — на лицевой грани (сжаты по cos)
    c.save(); c.translate(fx0 + fw / 2, -40); c.scale(cw, 1); circ(c, 0, 0, 50, W1.ink); ring(c, 0, 0, 50, W1.ln, 4); crystal6(c, 0, 0, 30, 1, t * .5);
    tx(c, 'МАНГО-ЛЁД', 0, 92, { f: 'U', w: 800, s: 27, c: '#f59e0b' }); c.restore();
    circ(c, fx0 + fw / 2, h / 2 - 34, 8, '#e0f2fe'); glow(c, fx0 + fw / 2, h / 2 - 34, 26, W1.ice, .8);
    // мундштук-колпачок: трапеция кривыми, видна верхняя грань эллипсом (объём)
    const mw = 112 * cw + sw * .6, mt = -h / 2 - 76, mx = (fx0 + fw / 2) * .7;
    c.beginPath(); c.moveTo(-mw / 2 + mx, -h / 2 + 6); c.lineTo(-mw * .36 + mx, mt + 10); c.quadraticCurveTo(mx, mt - 4, mw * .36 + mx, mt + 10); c.lineTo(mw / 2 + mx, -h / 2 + 6); c.closePath(); fill(c, W1.ln);
    c.save(); c.clip(); c.fillStyle = 'rgba(30,35,64,.16)'; c.fillRect(mx + (sd > 0 ? mw * .18 : -mw / 2), mt - 10, mw * .32, 100); c.restore();
    c.beginPath(); c.ellipse(mx, mt + 10, mw * .36, 9 * Math.abs(Math.sin(th)) + 3, 0, 0, TAU); fill(c, '#cfd8e6');
    c.restore();
  }
  function vapeSmall(c, x, yb, col, kf, g) {   // одноразка на полке
    const w = 56, h = 150; c.save(); c.translate(x, yb);
    c.beginPath(); c.roundRect(-w / 2, -h, w, h, 14); fill(c, kf > 0 ? mixc(mixc('#2b3050', col, kf), '#555a73', g) : '#2b3050');
    c.save(); c.clip(); poly(c, [-w / 2, 0, -w / 2, -h * .35, w / 2, -h * .55, w / 2, 0]); fill(c, 'rgba(255,255,255,' + (.18 * kf * (1 - g)) + ')'); c.restore();
    c.beginPath(); c.roundRect(-w / 2, -h, w, h, 14); lnW(c, 3);
    poly(c, [-18, -h, -11, -h - 24, 11, -h - 24, 18, -h]); fill(c, W1.ln);
    c.restore();
  }
  // ---------- дальние слои ----------
  function farLayer(c, t) {
    for (let i = 0; i < 60; i++) { const x = -1600 + H1(i * 5.1) * 4200, y = -1650 + H1(i * 2.7) * 900; circ(c, x, y, 2 + H1(i) * 2.5, rgba('#ffffff', .25 + .25 * Math.sin(t * 2 + i))) }
    circ(c, 260, -1120, 92, '#e9edf5'); ring(c, 260, -1120, 92, W1.ln, 4); circ(c, 230, -1140, 16, '#cdd5e3'); circ(c, 290, -1095, 11, '#cdd5e3'); glow(c, 260, -1120, 260, '#cfe3ff', .12);
    c.fillStyle = '#2d3250'; let x = -1700;
    for (let i = 0; x < 2700; i++) { const w = 120 + H1(i * 9.1) * 160, h = 380 + H1(i * 4.3) * 520; c.fillRect(x, -h, w + 2, h + 400);
      for (let j = 0; j < 6; j++) if (H1(i * 13 + j) > .55) { c.fillStyle = H1(i + j * 3) > .5 ? 'rgba(255,212,121,.35)' : 'rgba(120,140,200,.35)'; c.fillRect(x + 20 + (j % 2) * (w / 2 - 10), -h + 40 + Math.floor(j / 2) * 80, 18, 26); c.fillStyle = '#2d3250' }
      x += w + 26 + H1(i * 2.2) * 50 }
  }
  function midLayer(c, t) {
    let x = -1400;
    for (let i = 0; x < 4800; i++) {
      const w = 220 + H1(i * 3.3 + 1) * 260, h = 560 + H1(i * 6.1) * 640;
      c.beginPath(); c.rect(x, -h, w, h + 600); fill(c, '#31375a'); c.beginPath(); c.moveTo(x, 0); c.lineTo(x, -h); c.lineTo(x + w, -h); c.lineTo(x + w, 0); lnW(c, 3, 'rgba(238,242,247,.32)');
      snowCap(c, x, x + w, -h, 16, i * 11);
      for (let r = 0; r < 6; r++) for (let q = 0; q < 3; q++) if (H1(i * 31 + r * 7 + q) > .58) { c.beginPath(); c.roundRect(x + 30 + q * (w - 60) / 2.6, -h + 60 + r * 90, 30, 44, 4); fill(c, H1(i + r + q) > .6 ? 'rgba(255,212,121,.55)' : 'rgba(110,130,190,.4)') }
      x += w + 70 + H1(i * 8.8) * 120;
    }
  }
  // ---------- улица, магазин, фонари, машина ----------
  function streetW(c, t, v) {
    const x0 = v.x0 - 50, x1 = v.x1 + 50;
    c.fillStyle = W1.walk; c.fillRect(x0, 0, x1 - x0, 90); c.fillStyle = W1.road; c.fillRect(x0, 90, x1 - x0, 900);
    c.beginPath(); c.moveTo(x0, 0); c.lineTo(x1, 0); c.moveTo(x0, 90); c.lineTo(x1, 90); lnW(c, 4, 'rgba(238,242,247,.6)');
    for (let x = Math.floor(x0 / 260) * 260; x < x1; x += 260) { c.beginPath(); c.roundRect(x, 318, 130, 12, 6); fill(c, 'rgba(238,242,247,.5)') }
    for (let x = Math.floor(x0 / 420) * 420; x < x1; x += 420) mound(c, x + 140 + H1(x) * 80, 4, 150 + H1(x * 3) * 90, 34);
  }
  function lampW(c, x, t) {
    c.beginPath(); c.moveTo(x, 0); c.lineTo(x, -760); c.quadraticCurveTo(x, -820, x + 60, -820); c.lineTo(x + 110, -820); lnW(c, 9, W1.ln);
    beam(c, x + 110, -800, x + 110, 0, 18, 170, W1.warm, .1); poly(c, [x + 80, -830, x + 140, -830, x + 128, -800, x + 92, -800]); fill(c, W1.ln); glow(c, x + 110, -795, 90, W1.warm, .55);
    snowCap(c, x + 76, x + 144, -830, 12, x);
  }
  function carW(c, t) {
    const k = at(t, 3.4, 8.9); if (k <= 0 || k >= 1) return; const x = lp(-1500, 5200, k), y = 300, bob = Math.sin(t * 22) * 1.5;
    beam(c, x + 250, y - 40, x + 900, y - 30, 14, 120, W1.warm, .16);
    c.save(); c.translate(x, y + bob);
    c.beginPath(); c.moveTo(-240, 0); c.lineTo(-240, -70); c.quadraticCurveTo(-232, -96, -190, -100); c.lineTo(-120, -104); c.bezierCurveTo(-90, -170, 70, -172, 110, -104); c.lineTo(214, -96); c.quadraticCurveTo(250, -90, 252, -58); c.lineTo(252, 0); c.closePath();
    fill(c, W1.red); c.save(); c.clip(); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-260, -40, 520, 60); c.restore(); lnW(c, 5);
    c.beginPath(); c.moveTo(-96, -108); c.bezierCurveTo(-70, -156, 60, -158, 90, -108); c.closePath(); fill(c, '#9fb7e0'); lnW(c, 4);
    c.beginPath(); c.moveTo(0, -152); c.lineTo(0, -106); lnW(c, 4);
    [-140, 150].forEach(wx => { circ(c, wx, 0, 40, W1.ink); ring(c, wx, 0, 40, W1.ln, 5); circ(c, wx, 0, 14, W1.ln) });
    circ(c, 240, -60, 10, '#fff7d6'); glow(c, 240, -60, 40, W1.warm, .9); c.beginPath(); c.roundRect(-246, -66, 14, 16, 3); fill(c, '#ff6b6b');
    c.restore();
  }
  function shopW(c, t, v) {
    const k = WK, neonOn = t < k.prod - .4 ? 0 : t < k.prod ? (Math.sin((t - k.prod) * 70) > -.2 ? 1 : .2) : 1;
    c.beginPath(); c.rect(-950, -1700, 1900, 1700); fill(c, W1.fac); lnW(c, 5);
    c.beginPath(); c.rect(-980, -1760, 1960, 70); fill(c, W1.fac2); lnW(c, 5); snowCap(c, -985, 985, -1760, 26, 3);
    for (let i = 0; i < 26; i++) { const bx = -920 + H1(i * 4.4) * 1820, by = -1660 + H1(i * 2.9) * 1500; if (Math.abs(bx) < 540 && by > -1350) continue; if (bx > 560 && by > -1080) continue; if (bx < -560 && by > -1180 && by < -420) continue;
      c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + 60, by); c.moveTo(bx + 24, by + 22); c.lineTo(bx + 84, by + 22); lnW(c, 3, 'rgba(238,242,247,.22)') }
    // вывеска «ВЕЙПЫ 24/7»
    c.beginPath(); c.roundRect(-640, -1610, 1280, 190, 28); fill(c, '#1e2238'); lnW(c, 5);
    if (neonOn > .5) glow(c, 0, -1515, 640, W1.mint, .16 * neonOn);
    tx(c, 'ВЕЙПЫ 24/7', 0, -1512, { f: 'U', w: 800, s: 104, c: neonOn > .5 ? W1.mint : '#33485a', sw: neonOn > .5 ? 10 : 0, sc: rgba(W1.mint, .25) });
    // витрина: подиум под лучом, полки по бокам
    c.save(); c.beginPath(); c.rect(-500, -1330, 1000, 1110); c.fillStyle = '#22263d'; c.fill(); c.clip();
    for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(-500, -1330 + i * 128); c.lineTo(500, -1330 + i * 128); lnW(c, 2, 'rgba(238,242,247,.07)') }
    beam(c, 0, -1340, 0, -470, 40, 230, '#cfe8ff', .16); glow(c, 0, -720, 420, W1.ice, .22);
    const ord = (x, yy) => Math.abs(x) / 480 + (yy + 1100) / 2400;
    [-1, 1].forEach(sd => [-1040, -800, -560].forEach((yb, r) => {
      c.beginPath(); c.moveTo(sd * 270, yb); c.lineTo(sd * 495, yb); lnW(c, 6);
      [330, 430].forEach((ax, q) => { const xx = sd * ax, col = BOXC[(r * 4 + q * 2 + (sd > 0 ? 1 : 0)) % BOXC.length];
        const kf = eo(at(t, k.prod - .25 + ord(xx, yb) * .5, k.prod + .1 + ord(xx, yb) * .5)), g = eo(at(t, k.zap - .1 + (1 - (xx + 500) / 1000) * .45, k.zap + .25 + (1 - (xx + 500) / 1000) * .45));
        const pop = 1 + .14 * Math.sin(Math.PI * cl(at(t, k.vk - .3 + ord(xx, yb) * .4, k.vk + ord(xx, yb) * .4)));
        c.save(); c.translate(xx, yb); c.scale(pop, pop); vapeSmall(c, 0, 0, col, kf, g); c.restore() }) }));
    // подиум
    c.beginPath(); c.moveTo(-170, -470); c.lineTo(-170, -230); c.lineTo(170, -230); c.lineTo(170, -470); fill(c, W1.fac2); lnW(c, 5);
    c.save(); c.beginPath(); c.rect(-170, -470, 340, 240); c.clip(); for (let i = 0; i < 6; i++) { poly(c, [-170 + i * 80, -230, -140 + i * 80, -230, -10 + i * 80, -470, -40 + i * 80, -470]); fill(c, 'rgba(255,255,255,.06)') } c.restore();
    c.beginPath(); c.ellipse(0, -470, 170, 32, 0, 0, TAU); fill(c, '#4a5180'); lnW(c, 5);
    const th = -.42 + .8 * ss(0, 3.2, t) + .05 * Math.sin(t * 1.3), fr = eo(at(t, .15, k.ice + .35));
    vapeHero(c, t, 0, -700 + Math.sin(t * 1.6) * 4, th, fr);
    // холод: короткие черты летят мимо, как у банки Колы
    const kc = at(t, .9, k.i + .6) * (1 - at(t, k.i + .6, k.prod)); if (kc > 0) for (let i = 0; i < 14; i++) {
      const yy = -1000 + H1(i * 3.3) * 620, sp = 260 + H1(i) * 280, ph = (t * sp + H1(i * 5) * 900) % 900, xx = (i % 2 ? 1 : -1) * (130 + ph * .4);
      A(c, kc * (1 - ph / 900), () => { c.beginPath(); c.moveTo(xx, yy); c.lineTo(xx + (i % 2 ? 1 : -1) * (40 + H1(i * 7) * 50), yy); lnW(c, 4, W1.ice) }) }
    [[-96, -900, .2], [100, -780, .45], [-70, -560, .7], [90, -980, 1.0]].forEach(([sx, sy, d0], i) => { const kk = at(t, k.ice - .25 + d0 * .4, k.ice + .25 + d0 * .4); star4(c, sx, sy, 34 * Math.sin(Math.PI * kk), 1) });
    // стекло витрины: блики едут быстрее камеры
    const gx = (v.x0 + v.x1) * .5 * .18;
    [[-560, 150], [-160, 70], [260, 120]].forEach(([bx, bw]) => { poly(c, [bx - gx, -1330, bx + bw - gx, -1330, bx + bw - 520 - gx, -220, bx - 520 - gx, -220]); fill(c, 'rgba(255,255,255,.05)') });
    c.restore();
    c.beginPath(); c.rect(-500, -1330, 1000, 1110); lnW(c, 12); c.beginPath(); c.moveTo(-510, -220); c.lineTo(510, -220); lnW(c, 14, W1.fac2);
    // боковая витрина с коробками и дверь
    c.beginPath(); c.rect(-900, -1180, 330, 760); fill(c, '#262a42'); lnW(c, 8);
    for (let r = 0; r < 4; r++) for (let q = 0; q < 3; q++) { const bx = -870 + q * 104, by = -1140 + r * 180, col = BOXC[(r * 3 + q) % BOXC.length];
      const kf = eo(at(t, k.prod - .1 + (r + q) * .07, k.prod + .25 + (r + q) * .07)), g = eo(at(t, k.zap + .3 + (2 - q) * .06, k.zap + .6 + (2 - q) * .06));
      c.beginPath(); c.roundRect(bx, by, 84, 130, 10); fill(c, kf > 0 ? mixc(mixc('#2b3050', col, kf), '#555a73', g) : '#2b3050'); lnW(c, 3) }
    c.beginPath(); c.rect(590, -1080, 280, 1080); fill(c, '#3a3550'); lnW(c, 8); circ(c, 620, -520, 12, W1.ln);
    c.beginPath(); c.roundRect(640, -980, 180, 70, 12); fill(c, '#1e2238'); tx(c, 'ОТКРЫТО', 730, -944, { f: 'U', w: 800, s: 30, c: neonOn > .5 ? '#ff6b81' : '#4a3a4a' });
    snowCap(c, -910, -560, -1180, 14, 7); mound(c, -760, 0, 380, 60); mound(c, 300, 0, 300, 44); mound(c, 900, 0, 260, 40);
  }
  // ---------- Капитолий, флаг, окно в интерьер ----------
  function flagW(c, x, y, t) {
    const W = 230, H = 150, n = 26; c.beginPath(); c.moveTo(x, y + 360); c.lineTo(x, y - 20); lnW(c, 7); circ(c, x, y - 26, 9, W1.warm);
    for (let i = 0; i < n; i++) {
      const u0 = i / n, u1 = (i + 1) / n, o0 = Math.sin(t * 5 - u0 * 6) * 14 * u0, o1 = Math.sin(t * 5 - u1 * 6) * 14 * u1, xa = x + u0 * W, xb = x + u1 * W + .6;
      for (let s = 0; s < 7; s++) { poly(c, [xa, y + o0 + s * H / 7, xb, y + o1 + s * H / 7, xb, y + o1 + (s + 1) * H / 7, xa, y + o0 + (s + 1) * H / 7]); fill(c, s % 2 ? '#f4f1ea' : W1.red) }
      if (u0 < .42) { poly(c, [xa, y + o0, xb, y + o1, xb, y + o1 + H * .57, xa, y + o0 + H * .57]); fill(c, '#2d3e7a') }
    }
    for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) { const u = (q + .7) / 4.6 * .42, o = Math.sin(t * 5 - u * 6) * 14 * u; circ(c, x + u * W, y + o + (r + .7) / 4.6 * H * .57, 3.4, '#fff') }
  }
  function capitolW(c, t) {
    const X = CWIN.x;
    c.beginPath(); c.ellipse(X, -1150, 330, 370, 0, Math.PI, TAU); c.closePath(); fill(c, '#3a4066');
    c.save(); c.clip(); c.beginPath(); c.rect(X + 60, -1530, 300, 400); c.clip(); dotsRect(c, X + 60, -1530, 300, 400, 16, 3.2, 'rgba(20,24,44,.55)'); c.restore();
    for (let i = 1; i < 6; i++) { const a = Math.PI + i * Math.PI / 6; c.beginPath(); c.moveTo(X + Math.cos(a) * 330, -1150); c.quadraticCurveTo(X + Math.cos(a) * 200, -1150 - 300, X, -1520); lnW(c, 3, 'rgba(238,242,247,.4)') }
    c.beginPath(); c.ellipse(X, -1150, 330, 370, 0, Math.PI, TAU); lnW(c, 6); snowCap(c, X - 120, X + 120, -1500, 20, 41);
    c.beginPath(); c.rect(X - 46, -1600, 92, 80); fill(c, W1.fac2); lnW(c, 5); c.beginPath(); c.ellipse(X, -1600, 46, 30, 0, Math.PI, TAU); fill(c, W1.ln);
    flagW(c, X, -1960, t);
    c.beginPath(); c.rect(X - 330, -1150, 660, 200); fill(c, '#343a5e'); lnW(c, 5);
    for (let i = 0; i < 8; i++) { c.beginPath(); c.roundRect(X - 290 + i * 76, -1120, 36, 120, 18); fill(c, 'rgba(255,212,121,.45)'); lnW(c, 3) }
    poly(c, [X - 660, -800, X, -960, X + 660, -800]); fill(c, '#3a4066'); lnW(c, 6); snowCap(c, X - 600, X + 600, -800, 0, 5);
    circ(c, X, -860, 40, W1.fac2); ring(c, X, -860, 40, W1.ln, 4);
    c.beginPath(); c.rect(X - 660, -800, 1320, 80); fill(c, W1.fac2); lnW(c, 6); snowCap(c, X - 670, X + 670, -800, 18, 9);
    c.beginPath(); c.rect(X - 620, -720, 1240, 560); fill(c, '#30365a'); lnW(c, 5);
    glow(c, CWIN.x, CWIN.y, 330, W1.warm, .2);
    [-570, -420, -270, -120, 120, 270, 420, 570].forEach(o => { c.beginPath(); c.rect(X + o - 26, -712, 52, 548); fill(c, '#e3e7f0'); c.save(); c.clip(); c.fillStyle = 'rgba(30,35,64,.22)'; c.fillRect(X + o + 6, -712, 20, 548); c.restore(); lnW(c, 4, W1.ink);
      c.beginPath(); c.rect(X + o - 36, -730, 72, 22); fill(c, W1.ln); lnW(c, 3, W1.ink); c.beginPath(); c.rect(X + o - 36, -176, 72, 18); fill(c, W1.ln); lnW(c, 3, W1.ink) });
    for (let s = 0; s < 4; s++) { c.beginPath(); c.rect(X - 640 - s * 40, -160 + s * 40, 1280 + s * 80, 40); fill(c, s % 2 ? '#3a4066' : '#434a74'); lnW(c, 3); snowCap(c, X - 640 - s * 40, X + 640 + s * 40, -160 + s * 40, 8, s * 3) }
    // окно — в нём уже виден лист закона на столе
    c.save(); c.beginPath(); c.rect(CWIN.x - CWIN.w / 2, CWIN.y - CWIN.h / 2, CWIN.w, CWIN.h); c.clip(); interiorW(c, t, null); c.restore();
    c.beginPath(); c.rect(CWIN.x - CWIN.w / 2, CWIN.y - CWIN.h / 2, CWIN.w, CWIN.h); lnW(c, 10);
    mound(c, X - 820, 0, 300, 70); mound(c, X + 820, 0, 320, 64);
  }
  // ---------- интерьер: стол и лист закона (координаты листа 1000×1500) ----------
  function interiorW(c, t, v) {
    const r = v || { x0: CWIN.x - 200, x1: CWIN.x + 200, y0: CWIN.y - 260, y1: CWIN.y + 260 };
    c.fillStyle = W1.inBg; c.fillRect(r.x0 - 10, r.y0 - 10, r.x1 - r.x0 + 20, r.y1 - r.y0 + 20);
    glow(c, CWIN.x, CWIN.y - 40, 220, W1.warm, .16);
    c.save(); c.translate(CWIN.x, CWIN.y); c.scale(SHS, SHS); c.translate(-500, -750); sheetW(c, t); c.restore();
  }
  const CAL = { x: 60, y: 680, w: 400, h: 370 }, JU = { x: 745, y: 850, w: 360, h: 300 }, RIG = { l: 230, r: 770, top: 990, base: 1405 };
  const CARTS = [{ u: 105, n: 'ТАБАК', c: '#a8835a', side: 1 }, { u: 290, n: 'МАНГО', c: '#f97316' }, { u: 430, n: 'ФРУКТЫ', c: '#ec4899' }, { u: 570, n: 'ДЕСЕРТЫ', c: '#eab308' }, { u: 710, n: 'МЯТА', c: '#22c55e' }, { u: 895, n: 'МЕНТОЛ', c: '#67c7d9', side: 1 }];
  function sheetW(c, t) {
    const k = WK, I = W1.ink;
    c.beginPath(); c.rect(22, 30, 1000, 1500); fill(c, 'rgba(8,10,24,.35)');
    c.beginPath(); c.rect(0, 0, 1000, 1500); fill(c, W1.paper); lnW(c, 5, I);
    c.save(); c.beginPath(); c.rect(0, 0, 1000, 1500); c.clip(); dotsRect(c, 930, 0, 70, 1500, 14, 2.4, 'rgba(30,35,64,.10)'); c.restore();
    // шапка и строки — пишутся на подлёте
    const kH = eo(at(t, k.vse + .1, k.odn + .1));
    tx(c, 'FDA · США', 80, 60, { f: 'M', w: 800, s: 30, c: '#7b8098', al: 'left', a: kH });
    c.save(); c.beginPath(); c.rect(70, 70, 920 * kH, 120); c.clip(); tx(c, 'ЗАКОН О ВКУСАХ', 80, 125, { f: 'U', w: 800, s: 66, c: I, al: 'left' }); c.restore();
    c.beginPath(); c.moveTo(80, 182); c.lineTo(80 + 560 * kH, 182); lnW(c, 7, W1.red);
    for (let i = 0; i < 8; i++) {
      const v = 250 + i * 50, kl = eo(at(t, k.vse + .25 + i * .06, k.vse + .6 + i * .06)); if (kl <= 0) continue;
      if (i === 3) { c.beginPath(); c.roundRect(80, v - 9, 360 * kl, 18, 9); fill(c, '#c9ccd8'); c.beginPath(); c.roundRect(780, v - 9, 140 * kl, 18, 9); fill(c, '#c9ccd8'); continue }
      const L = 840 * (.55 + .45 * H1(i * 4.1)); c.beginPath(); c.roundRect(80, v - 9, L * kl, 18, 9); fill(c, '#c9ccd8');
    }
    // пустая клетка: «одного слова» — мигает, «забыли вписать» — знак вопроса
    const kb = eo(at(t, k.odn - .3, k.odn + .1)); if (kb > 0) {
      const pul = 1 + .08 * Math.sin(Math.PI * cl(at(t, k.odn, k.odn + .35))) + .03 * Math.sin(t * 6) * at(t, k.odn, k.odn + .5) * (1 - at(t, k.zak, k.zak + .3));
      c.save(); c.translate(610, 400); c.scale(pul * kb, pul * kb); c.beginPath(); c.roundRect(-150, -34, 300, 68, 12); fill(c, 'rgba(232,68,90,.08)'); c.setLineDash([16, 12]); c.lineDashOffset = -t * 40; lnW(c, 5, W1.red); c.setLineDash([]);
      const kq = spr(at(t, k.zab - .05, k.zab + .45));
      if (kq <= .02) { const bl = .5 + .5 * Math.sin(t * 9); A(c, bl, () => { c.beginPath(); c.moveTo(-110, -22); c.lineTo(-110, 22); lnW(c, 6, I) }) }
      else { c.save(); c.scale(kq, kq); tx(c, '?', 0, 4, { f: 'U', w: 800, s: 64, c: W1.red }); c.restore() }
      c.restore();
    }
    // печать FDA на «закон»
    const kS = at(t, k.zak - .2, k.zak); if (kS > 0) {
      const sc = kS < 1 ? lp(2.3, 1, ei(kS)) : 1 + .06 * Math.exp(-(t - k.zak) * 9) * Math.sin((t - k.zak) * 40);
      c.save(); c.translate(330, 530); c.rotate(-.18 + (1 - eo(kS)) * .5); c.scale(sc, sc); c.globalAlpha *= cl(kS * 3);
      ring(c, 0, 0, 92, W1.ac, 7); ring(c, 0, 0, 74, W1.ac, 3); tx(c, 'FDA', 0, 4, { f: 'U', w: 800, s: 46, c: W1.ac });
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; circ(c, Math.cos(a) * 83, Math.sin(a) * 83, 4, W1.ac) }
      c.restore();
      const kr = at(t, k.zak, k.zak + .45); if (kr > 0 && kr < 1) ring(c, 330, 530, 92 + 110 * eo(kr), rgba(W1.ac, 1 - kr), 6 * (1 - kr));
    }
    calendarW(c, t); juulW(c, t); rigW(c, t);
  }
  function calendarW(c, t) {
    const k = WK, I = W1.ink, { x, y, w, h } = CAL;
    c.beginPath(); c.rect(x + 10, y + 14, w, h); fill(c, 'rgba(30,35,64,.18)');
    const page = (mon, yr, off, nd) => {
      c.beginPath(); c.rect(x, y, w, h); fill(c, '#ffffff'); lnW(c, 4, I);
      c.beginPath(); c.rect(x, y, w, 76); fill(c, W1.red); lnW(c, 4, I); tx(c, mon + ' ' + yr, x + w / 2, y + 40, { f: 'U', w: 800, s: 34, c: '#fff' });
      ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'].forEach((d, i) => tx(c, d, x + 34 + i * 54, y + 102, { f: 'M', w: 800, s: 20, c: '#8a8fa6' }));
      for (let d = 1; d <= nd; d++) { const p = d - 1 + off, cx = x + 34 + (p % 7) * 54, cy = y + 140 + Math.floor(p / 7) * 46; if (cy > y + h - 14) continue; tx(c, String(d), cx, cy, { f: 'M', w: 700, s: 22, c: I }) }
    };
    page('ЯНВАРЬ', '2020', 2, 31);
    const kc = at(t, k.y20b - .05, k.y20b + .35); if (kc > 0) { c.beginPath(); c.arc(x + 34 + 3 * 54, y + 140, 24, -Math.PI / 2, -Math.PI / 2 + TAU * eo(kc)); lnW(c, 5, W1.red) }
    const kf = at(t, k.jan - .2, k.jan + .2);   // декабрьский лист улетает вверх — под ним январь
    if (kf < 1) { c.save(); c.beginPath(); c.rect(x - 40, y - 400, w + 80, h + 400); c.clip(); c.translate(0, y); c.scale(1, 1 - ei(kf) * 1.05); c.translate(0, -y); page('ДЕКАБРЬ', '2019', 6, 31); c.restore() }
    for (let i = 0; i < 4; i++) { c.beginPath(); c.roundRect(x + 52 + i * 98, y - 20, 16, 40, 8); fill(c, '#9aa1b8'); lnW(c, 3, I) }
  }
  function juulW(c, t) {
    const k = WK, I = W1.ink, ki = at(t, k.sk - .55, k.sk - .1); if (ki <= 0) return;
    const e = bo(ki), j = 1 + .22 * Math.sin(Math.PI * cl(at(t, k.juul - .05, k.juul + .3)));
    c.save(); c.translate(JU.x + (1 - e) * 520, JU.y); c.rotate(.06 + (1 - e) * .5);
    c.beginPath(); c.rect(-JU.w / 2 + 10, -JU.h / 2 + 14, JU.w, JU.h); fill(c, 'rgba(30,35,64,.18)');
    c.beginPath(); c.rect(-JU.w / 2, -JU.h / 2, JU.w, JU.h); fill(c, '#fffaf0'); lnW(c, 4, I);
    [[-150, -110, 300], [-150, -80, 220], [-150, 100, 260], [-150, 124, 190]].forEach(([bx, by, bw]) => { c.beginPath(); c.roundRect(bx, by - 7, bw, 14, 7); fill(c, '#cfd2dc') });
    c.save(); c.translate(0, 10); c.scale(j, j); c.rotate(-.08);
    c.beginPath(); c.roundRect(-130, -22, 210, 44, 12); fill(c, '#a9b0c4'); lnW(c, 4, I);
    c.beginPath(); c.roundRect(76, -22, 58, 44, 10); fill(c, I); lnW(c, 4, I); circ(c, -100, 0, 6, '#7dd3fc');
    c.restore();
    const ks = spr(at(t, k.sk - .05, k.sk + .45)); if (ks > 0) { c.save(); c.translate(36, -40); c.rotate(-.16); c.scale(ks, ks); c.beginPath(); c.roundRect(-118, -30, 236, 60, 10); lnW(c, 6, W1.red); tx(c, 'СКАНДАЛ', 0, 3, { f: 'U', w: 800, s: 36, c: W1.red }); c.restore() }
    c.restore();
  }
  function bladeV(t) {   // нижний край лезвия (координаты листа)
    const k = WK; let v = 1060;
    v = lp(v, 1160, ei(at(t, k.rub - .14, k.rub + .02))); if (t > k.rub + .02) v += 12 * Math.exp(-(t - k.rub) * 7) * Math.sin((t - k.rub) * 26);
    v = lp(v, 1335, ei(at(t, k.pod + .0, k.pod + .11))); if (t > k.pod + .11) v += 10 * Math.exp(-(t - k.pod) * 8) * Math.sin((t - k.pod) * 30);
    return v;
  }
  function rigW(c, t) {
    const k = WK, I = W1.ink, tc = k.pod + .07, vb = bladeV(t);
    c.beginPath(); c.rect(60, RIG.base, 880, 26); fill(c, '#3a4066'); lnW(c, 4, I);
    // картриджи: стоят на базе, вкус вспыхивает на своём слове
    CARTS.forEach((ct, i) => {
      const fi = ct.side ? -1 : i - 1, tw = fi >= 0 ? k.fl[fi] : k.vk2, kf = ct.side ? 1 : eo(at(t, tw - .08, tw + .25)), cutV = 1300 - (ct.u - RIG.l) / (RIG.r - RIG.l) * 30;
      const draw = (part) => cartW(c, t, ct, kf, part, cutV);
      if (ct.side || t < tc) draw(0);
      else {
        draw(1); const dt = t - tc, dir = ct.u < 500 ? -1 : 1;
        c.save(); c.translate(dir * (140 + fi * 30) * dt * 3, -560 * dt + 1500 * dt * dt); c.translate(ct.u, cutV); c.rotate(dir * (2.4 + fi * .4) * dt); c.translate(-ct.u, -cutV); draw(2); c.restore();
        for (let d = 0; d < 9; d++) { const a = -Math.PI / 2 + (H1(i * 9 + d) - .5) * 2.4, sp = 300 + H1(d * 3 + i) * 520, dx = Math.cos(a) * sp * dt, dy = Math.sin(a) * sp * dt + 1300 * dt * dt;
          if (dt < 1.2) circ(c, ct.u + dx, cutV + dy, (6 + H1(d + i * 4) * 8) * (1 - dt / 1.2), ct.c) }
        const kr = at(t, tc, tc + .35); if (kr < 1) { c.save(); c.translate(ct.u, cutV); c.scale(1, .35); ring(c, 0, 0, 30 + 90 * eo(kr), rgba(ct.c, 1 - kr), 8 * (1 - kr)); c.restore() }
      }
      const kl = ct.side ? 1 : spr(at(t, tw - .08, tw + .4)), lc = ct.side ? '#7b8098' : (kf > .5 ? ct.c : '#9aa0b5');
      c.save(); c.translate(ct.u, 1470); c.scale(.85 + .15 * kl, .85 + .15 * kl); tx(c, ct.n, 0, 0, { f: 'U', w: 800, s: 19, c: lc }); c.restore();
      if (!ct.side && kf > 0) { const kr = at(t, tw - .05, tw + .45); if (kr < 1) ring(c, ct.u, 1300, 50 + 90 * eo(kr), rgba(ct.c, (1 - kr) * .9), 7 * (1 - kr)) }
      if (ct.side) { const kc = spr(at(t, k.vk2 + .2 + (i ? .15 : 0), k.vk2 + .7 + (i ? .15 : 0))); if (kc > 0) { c.save(); c.translate(ct.u, 1150); c.scale(kc, kc); circ(c, 0, 0, 26, '#22c55e'); c.beginPath(); c.moveTo(-11, 1); c.lineTo(-3, 9); c.lineTo(12, -8); lnW(c, 6, '#fff'); c.restore() } }
    });
    // рама и лезвие
    [RIG.l, RIG.r].forEach(u => { c.beginPath(); c.rect(u - 14, RIG.top, 28, RIG.base - RIG.top); fill(c, '#8f98b3'); lnW(c, 4, I) });
    c.save(); c.beginPath(); c.rect(RIG.l + 14, RIG.top + 40, RIG.r - RIG.l - 28, 600); c.clip();
    c.save(); c.translate(0, vb); poly(c, [RIG.l + 14, -150, RIG.r - 14, -150, RIG.r - 14, -30, RIG.l + 14, 0]); fill(c, '#d5dbe8');
    c.save(); c.clip(); poly(c, [RIG.l, -42, RIG.r, -72, RIG.r, -30, RIG.l, 0]); fill(c, '#f6f8fc'); dotsRect(c, RIG.l, -150, 540, 70, 14, 2.4, 'rgba(30,35,64,.14)'); c.restore();
    poly(c, [RIG.l + 14, -150, RIG.r - 14, -150, RIG.r - 14, -30, RIG.l + 14, 0]); lnW(c, 4, I);
    [RIG.l + 60, RIG.r - 60].forEach(u => circ(c, u, -112, 8, '#8f98b3'));
    c.restore(); c.restore();
    const ku = 1 + .1 * Math.sin(Math.PI * cl(at(t, k.usa - .05, k.usa + .35)));
    c.beginPath(); c.rect(RIG.l - 40, RIG.top - 20, RIG.r - RIG.l + 80, 64); fill(c, W1.ac); lnW(c, 4, I);
    c.save(); c.translate(500, RIG.top + 12); c.scale(ku, ku); tx(c, 'FDA · США', 0, 0, { f: 'U', w: 800, s: 32, c: '#fff' }); c.restore();
    const kv = at(t, k.vl - .2, k.vl + .3); if (kv > 0 && kv < 1) ring(c, 500, RIG.top + 12, 40 + 200 * eo(kv), rgba(W1.ac, 1 - kv), 6 * (1 - kv));
  }
  function cartW(c, t, ct, kf, part, cutV) {   // part: 0 — целиком, 1 — низ после среза, 2 — отрубленный верх
    const I = W1.ink, u = ct.u, w = 86, top = 1190, bot = RIG.base;
    c.save();
    if (part) { c.beginPath(); if (part === 1) c.rect(u - 80, cutV, 160, 400); else c.rect(u - 80, top - 80, 160, cutV - top + 80); c.clip() }
    poly(c, [u - 30, top + 40, u - 22, top, u + 22, top, u + 30, top + 40]); fill(c, I);
    c.beginPath(); c.roundRect(u - w / 2, top + 40, w, bot - top - 40, 14); fill(c, '#fbfaf6');
    c.save(); c.clip(); const lh = (bot - top - 70) * kf; c.fillStyle = ct.side ? mixc('#d9dde8', ct.c, .55) : ct.c; c.fillRect(u - w / 2, bot - 14 - lh, w, lh + 14);
    poly(c, [u - w / 2, bot, u - w / 2, bot - 70, u + w / 2, bot - 110, u + w / 2, bot]); fill(c, 'rgba(255,255,255,.22)'); c.fillStyle = 'rgba(30,35,64,.12)'; c.fillRect(u + w / 2 - 18, top + 40, 18, bot - top); c.restore();
    c.beginPath(); c.roundRect(u - w / 2, top + 40, w, bot - top - 40, 14); lnW(c, 4, I);
    c.restore();
    if (part === 1) { c.beginPath(); c.moveTo(u - w / 2, cutV); c.lineTo(u + w / 2, cutV); lnW(c, 5, ct.c) }
  }
  // ---------- передний план ----------
  function snowFg(c, cam, t, a) {
    if (a <= 0) return;
    [[1.55, 20, 11, 1400, 7], [1.2, 26, 23, 1200, 4.5]].forEach(([p, n, seed, T, r0]) => fieldLayer(c, cam, p, n, seed, T, (c, X, Y, s, i) => {
      const r = Math.min(26, r0 * Math.pow(s, .35)); A(c, a * (.55 + .45 * H1(i)) * (r > 18 ? 1 - (r - 18) / 8 : 1), () => circ(c, X, Y, r, '#f8fbff')) }, t));
  }
  function dustFg(c, cam, t, a) {
    if (a <= 0) return;
    fieldLayer(c, cam, 1.3, 30, 77, 1300, (c, X, Y, s, i) => A(c, a * .28, () => circ(c, X, Y + Math.sin(t + i) * 10, 2 + H1(i) * 3.5, '#ffeec2')), t * .15);
  }
  function speedLines(c, cam, t) {   // черты скорости: сколько и какие — по настоящей скорости камеры
    const c2 = camObj(camAt(KEYS1, t + 1 / 30)), vx = (c2.x - cam.x) * cam.z, dz = Math.log(c2.z / cam.z);
    const kp = cl((Math.abs(vx) - 18) / 50), kz = cl((Math.abs(dz) - .05) / .1) * (cam.z < 6 ? 1 : 0);
    c.save();
    if (kp > 0) for (let i = 0; i < 16; i++) { const y = 140 + H1(i * 3.7) * 1500, L = 80 + H1(i) * 160, x = ((H1(i * 5.5) * 1300 - t * 2400 * Math.sign(vx)) % 1300 + 1300) % 1300 - 110;
      A(c, kp * .55, () => { c.beginPath(); c.moveTo(x, y); c.lineTo(x + L, y); lnW(c, 4, i % 3 ? '#1a1e33' : 'rgba(238,242,247,.6)') }) }
    if (kz > 0) for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + H1(i) * .2, r0 = 380 + ((t * 1600 + H1(i * 7) * 700) % 700);
      A(c, kz * .5, () => { c.beginPath(); c.moveTo(540 + Math.cos(a) * r0, 960 + Math.sin(a) * r0 * 1.4); c.lineTo(540 + Math.cos(a) * (r0 + 140), 960 + Math.sin(a) * (r0 + 140) * 1.4); lnW(c, 4, 'rgba(238,242,247,.55)') }) }
    c.restore();
  }
  // ---------- кадр мира ----------
  function shot1(c, t) {
    if (!KEYS1) w1Init();
    const cam = camObj(camAt(KEYS1, t));
    c.save(); c.fillStyle = W1.bg; c.fillRect(0, 0, WW, HH);
    if (t < TIN) {
      const v = viewRect(cam);
      layer(c, cam, .3, c => farLayer(c, t));
      layer(c, cam, .62, c => midLayer(c, t));
      layer(c, cam, 1, c => {
        streetW(c, t, v);
        [1250, 1720].forEach(x => { if (x > v.x0 - 400 && x < v.x1 + 200) lampW(c, x, t) });
        if (v.x0 < 1000) shopW(c, t, v);
        if (v.x1 > 1900) capitolW(c, t);
        carW(c, t);
      });
      snowFg(c, cam, t, 1 - at(cam.z, 2.5, 6));
      speedLines(c, cam, t);
    } else {
      layer(c, cam, 1, c => interiorW(c, t, viewRect(cam)));
      dustFg(c, cam, t, at(t, TIN, TIN + .6));
      speedLines(c, cam, t);
    }
    c.restore();
  }
