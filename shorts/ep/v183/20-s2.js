  // ================= СЦЕНА 2: электричка-шторка → зал FDA и гильотина =================
  // v18.1: вместо чёрной стены фуры — быстрый вагон монорельса во всю высоту (0,75 с), без щелей; гильотина пустая,
  // лезвие качается на верёвке; картриджи впрыгивают по одному; лезвие падает и остаётся внизу, половинки и сок — в замедлении.
  // шторка: граница splitX едет справа налево (9.0–10.2), по ней — ночной вагон метро шириной 260
  const splitX = t => lp(1180, -100, eio(at(t, K.train0, K.train1)));
  function train(c, x, t) {
    const L = x - 130, W = 260;
    beam(c, L + 10, 1240, L - 600, 1300, 26, 200, '#fde68a', .28);
    c.save(); c.beginPath(); c.rect(L, -80, W, 2100); c.clip();
    const g = c.createLinearGradient(L, 0, L + W, 0); g.addColorStop(0, '#64748b'); g.addColorStop(.18, '#cbd5e1'); g.addColorStop(.7, '#94a3b8'); g.addColorStop(1, '#334155');
    c.fillStyle = g; c.fillRect(L, -80, W, 2100);
    c.fillStyle = '#0f172a'; c.fillRect(L, -80, W, 150);   // крыша
    for (let k = 0; k < 2; k++) {   // два окна салона одно над другим, свет внутри
      const wy = 300 + k * 420; rr(c, L + 34, wy, W - 68, 330, 16); const gl = c.createLinearGradient(0, wy, 0, wy + 330); gl.addColorStop(0, '#fef3c7'); gl.addColorStop(1, '#fbbf24'); c.fillStyle = gl; c.fill();
      c.save(); rr(c, L + 34, wy, W - 68, 330, 16); c.clip(); c.fillStyle = '#b45309'; c.fillRect(L + 34, wy + 210, W - 68, 120); c.fillStyle = '#78716c'; c.fillRect(L + W / 2 - 4, wy, 8, 330);
      poly(c, [L + 60, wy, L + 100, wy, L + 20, wy + 330, L - 20, wy + 330]); fill(c, 'rgba(255,255,255,.25)'); c.restore();
      rr(c, L + 34, wy, W - 68, 330, 16); stroke(c, '#334155', 6);
    }
    c.fillStyle = '#1d4ed8'; c.fillRect(L, 1170, W, 90); c.fillStyle = '#ef4444'; c.fillRect(L, 1268, W, 14);
    circ(c, L + 30, 1225, 20, '#fef9c3'); glow(c, L + 30, 1225, 80, '#fde68a', .9);
    c.fillStyle = '#1e293b'; c.fillRect(L, 1520, W, 480); c.fillStyle = '#0f172a'; c.fillRect(L, 1640, W, 46);
    circ(c, L + W / 2, 1810, 100, '#0b0f19'); circ(c, L + W / 2, 1810, 52, '#475569'); c.save(); c.translate(L + W / 2, 1810); c.rotate(-t * 24); c.fillStyle = '#94a3b8'; c.fillRect(-50, -6, 100, 12); c.restore();
    c.fillStyle = 'rgba(15,23,42,.9)'; c.fillRect(L, -80, 10, 2100); c.fillRect(L + W - 10, -80, 10, 2100);
    for (let i = 0; i < 12; i++) { const yy = 120 + H1(i * 3.7) * 1700, w = 60 + H1(i * 5.1) * 160; c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(L + H1(i * 9.3) * (W - w), yy, w, 4) }
    c.restore();
  }
  function hallBg(c, t) {   // правительственный зал: стены, панели, пилястры, печать, софиты, помост
    vgrad(c, -200, -200, WW + 400, 1560, ['#1a1625', '#231d30', '#1a1625']);
    c.save(); c.globalAlpha = .08; ring(c, 540, 640, 380, '#e2e8f0', 10); ring(c, 540, 640, 320, '#e2e8f0', 4);
    c.translate(540, 640); c.rotate(t * .03); const SEAL = 'FDA · МИНЗДРАВ США · FDA · МИНЗДРАВ США ·';
    for (let i = 0; i < SEAL.length; i++) { const a = i * TAU / SEAL.length; c.save(); c.rotate(a); tx(c, SEAL[i], 0, -350, { f: 'O', w: 700, s: 30, c: '#e2e8f0' }); c.restore() }
    c.restore(); glow(c, 540, 640, 520, '#7c2d4a', .18 + .04 * Math.sin(t * 1.3));
    vgrad(c, -200, 900, WW + 400, 460, ['#2a1d22', '#22171c']);
    for (let i = 0; i < 9; i++) { c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 3; c.strokeRect(150 + i * 88, 940, 74, 380) }
    c.fillStyle = 'rgba(255,255,255,.05)'; c.fillRect(-200, 900, WW + 400, 6);
    [85, 995].forEach(px => {   // мраморные пилястры
      vgrad(c, px - 55, -200, 110, 1560, ['#cbd5e1', '#94a3b8']); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(px - 40, -200, 16, 1560);
      c.strokeStyle = 'rgba(71,85,105,.35)'; c.lineWidth = 2; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(px - 50, 200 + i * 230); c.bezierCurveTo(px - 10, 260 + i * 230, px + 10, 150 + i * 230, px + 50, 230 + i * 230); c.stroke() }
      c.fillStyle = '#e2e8f0'; c.fillRect(px - 70, 1300, 140, 60); c.fillRect(px - 70, -200, 140, 240);
    });
    const sw = Math.sin(t * .7) * 40; beam(c, 160, -40, 470 + sw, 1300, 30, 230, '#fde68a', .12); beam(c, 920, -40, 610 - sw, 1300, 30, 230, '#fde68a', .12);
    // помост со ступенями
    vgrad(c, -200, 1360, WW + 400, 800, ['#3a2416', '#2a1a10', '#1a100a']);
    c.fillStyle = '#4a2f1d'; c.fillRect(-200, 1360, WW + 400, 18); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(-200, 1450, WW + 400, 12);
    for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-160 + i * 100, 1378, 3, 760) }
    c.save(); c.translate(540, 1372); c.scale(1, .1); glow(c, 0, 0, 520, '#fde68a', .25); c.restore();
  }
  const CART = [{ x: 300, col: '#f97316', n: 'МАНГО' }, { x: 460, col: '#ec4899', n: 'ФРУКТЫ' }, { x: 620, col: '#eab308', n: 'ДЕСЕРТ' }, { x: 780, col: '#10b981', n: 'МЯТА' }];
  const cartT = i => K.jan + 1.35 + i * .8;   // когда впрыгивает картридж i
  const CUT = 1162;   // линия среза картриджей
  function cartridge(c, x, y, w, h, col, o = {}) {   // картридж: чёрный мундштук сверху, жидкость, светлое дно; y0, y1 — какой кусок рисовать
    const y0 = o.y0 ?? y - h / 2, y1 = o.y1 ?? y + h / 2;
    c.save(); c.beginPath(); c.rect(x - w, y0, w * 2, y1 - y0); c.clip();
    rr(c, x - w / 2, y - h / 2 + h * .24, w, h * .76, w * .2); fill(c, 'rgba(226,232,240,.92)');
    rr(c, x - w / 2 + 8, y - h / 2 + h * .3, w - 16, h * .62, w * .14); fill(c, col);
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x - w / 2 + 14, y - h / 2 + h * .32, 10, h * .55);
    poly(c, [x - w * .36, y - h / 2 + h * .26, x - w * .3, y - h / 2, x + w * .3, y - h / 2, x + w * .36, y - h / 2 + h * .26]); fill(c, '#111827');
    c.restore();
    if (o.cut === 'top' || o.cut === 'bot') { c.save(); c.beginPath(); const cy = o.cut === 'bot' ? y0 : y1; for (let i = 0; i <= 8; i++) c[i ? 'lineTo' : 'moveTo'](x - w / 2 + 4 + i * (w - 8) / 8, cy + (i % 2 ? 6 : -4)); c.strokeStyle = o.jc || col; c.lineWidth = 6; c.stroke(); c.restore() }
  }
  function stampOK(c, x, y, k, r) {   // зелёный штамп «РАЗРЕШЕНО ✔» — бьёт сверху
    if (k <= 0) return; const s = lp(2.3, 1, eo(k));
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    rr(c, -92, -26, 184, 52, 8); fill(c, 'rgba(240,253,244,.9)'); rr(c, -92, -26, 184, 52, 8); stroke(c, '#16a34a', 5);
    tx(c, 'РАЗРЕШЕНО ✔', 0, 2, { f: 'O', w: 700, s: 26, c: '#15803d', mw: 168 });
    c.restore();
  }
  function smallCart(c, x, y, lab, t) {   // серый «разрешённый» картридж (табак, ментол) — выпрыгивает на подставку, потом штамп
    const t0 = K.jan - .15, k = at(t, t0, t0 + .55); if (k <= 0) return;
    rr(c, x - 60, y + 80, 120, 78, 10); fill(c, '#3f2a1c'); tx(c, lab, x, y + 118, { f: 'O', w: 700, s: 22, c: '#e2e8f0', ls: 2 });
    const jy = y + 240 * (1 - k) - 220 * Math.sin(Math.PI * k), sq = 1 - .14 * Math.sin(Math.PI * at(t, t0 + .55, t0 + .8));
    c.save(); c.beginPath(); c.rect(x - 100, -500, 200, y + 80 - (-500)); c.clip();
    c.translate(x, jy + 80); c.scale(1 / sq, sq); cartridge(c, 0, -80, 80, 160, '#64748b'); c.restore();
    stampOK(c, x, y - 10, at(t, t0 + .45, t0 + .7), x < 540 ? -.2 : .2);
  }
  // лезвие: опускается на верёвке и качается; в «рубят» падает за 5 кадров и остаётся внизу
  const bladeY = t => K.chop <= t ? lp(470, 1010, Math.pow(at(t, K.chop, K.chop + 5 / 30), 2)) : 470;   // лезвие висит с самого начала, падает за 5 кадров
  const bladeR = t => t >= K.chop ? 0 : .045 * Math.sin(t * 2.1) * (1 - at(t, K.chop - .35, K.chop));
  function blade(c, y0, rot = 0, sh = 0) {   // лезвие 620 шириной: низ скошен (слева выше), белая заточка, надпись
    const L = 230, R = 850, hl = 160, hr = 280;
    c.save(); c.translate(540 + sh, 445); c.rotate(rot); c.translate(-540, -445);
    poly(c, [L, y0, R, y0, R, y0 + hr, L, y0 + hl]); const g = c.createLinearGradient(L, 0, R, 0); g.addColorStop(0, '#94a3b8'); g.addColorStop(.5, '#e2e8f0'); g.addColorStop(1, '#64748b'); c.fillStyle = g; c.fill();
    poly(c, [L, y0 + hl - 34, R, y0 + hr - 34, R, y0 + hr, L, y0 + hl]); fill(c, '#f8fafc');
    c.strokeStyle = 'rgba(15,23,42,.5)'; c.lineWidth = 3; poly(c, [L, y0, R, y0, R, y0 + hr, L, y0 + hl]); c.stroke();
    c.fillStyle = '#475569'; c.fillRect(L, y0, R - L, 26);
    c.save(); c.translate(540, y0 + 92); c.rotate(.19 * .5); tx(c, 'ЗАПРЕТ ВКУСОВ', 0, 0, { f: 'O', w: 700, s: 44, c: '#b91c1c', ls: 3 }); c.restore();
    c.restore();
  }
  function cartJump(c, t, i) {   // картридж выпрыгивает из колодки и садится в своё гнездо
    const p = CART[i], t0 = cartT(i), k = at(t, t0, t0 + .55); if (k <= 0) return;
    const y = lp(1430, 1165, k) - 330 * Math.sin(Math.PI * k), sq = 1 - .12 * Math.sin(Math.PI * at(t, t0 + .55, t0 + .8)), r = (1 - k) * (i % 2 ? .25 : -.25);
    c.save(); if (k < 1) { c.beginPath(); c.rect(p.x - 120, -600, 240, 1942); c.clip() } c.translate(p.x, y + 105); c.rotate(r); c.scale(1 / sq, sq); cartridge(c, 0, -105, 110, 210, p.col); c.restore();
    const fl = 1 - at(t, t0 + .5, t0 + .9); if (k >= 1 && fl > 0) glow(c, p.x, 1190, 120, p.col, .5 * fl);
  }
  function guillotine(c, t) {   // рама, бланк с заголовком, лезвие, колодка с картриджами
    c.save();   // рама, бланк и лезвие собраны сразу — за шторкой ничего не достраивается
    [200, 880].forEach(px => { vgrad(c, px - 26, 300, 52, 1060, ['#5b3a24', '#3d2616']); c.fillStyle = '#94a3b8'; c.fillRect(px + (px < 540 ? 22 : -30), 340, 8, 960) });
    rr(c, 150, 270, 780, 70, 12); fill(c, '#4a2f1d');
    c.save(); rr(c, 232, 345, 616, 100, 8); fill(c, '#f1ead8'); tx(c, 'FDA · 2 ЯНВАРЯ 2020', 540, 397, { f: 'O', w: 700, s: 46, c: '#1e293b', ls: 2 }); c.restore();
    circ(c, 540, 280, 58, '#d4a017'); circ(c, 540, 280, 46, '#f5d061'); tx(c, 'FDA', 540, 282, { f: 'U', w: 800, s: 26, c: '#7c5a07' });
    const by = bladeY(t), rot = bladeR(t), cutDone = t > K.chop + 5 / 30, sh = t > K.chop && t < K.chop + .6 ? Math.sin((t - K.chop) * 80) * 6 * (1 - at(t, K.chop, K.chop + .6)) : 0;
    c.strokeStyle = '#a8a29e'; c.lineWidth = 6; c.beginPath(); c.moveTo(540, 300); c.lineTo(540 + Math.sin(rot) * (by - 300), Math.max(300, by)); c.stroke();
    if (t < K.chop) CART.forEach((p, i) => cartJump(c, t, i));
    else {   // всё, что выше нижней кромки лезвия, срезано и исчезает
      const e = x => by + 160 + 120 * (x - 230) / 620;
      c.save(); poly(c, [200, e(200), 880, e(880), 880, 1400, 200, 1400]); c.clip(); CART.forEach(p => cartridge(c, p.x, 1165, 110, 210, p.col)); c.restore();
      if (cutDone) CART.forEach(p => { c.save(); c.strokeStyle = p.col; c.lineWidth = 6; c.beginPath(); c.moveTo(p.x - 51, e(p.x - 51)); c.lineTo(p.x + 51, e(p.x + 51)); c.stroke(); c.restore() });
    }
    // колодка с полукруглыми вырезами и подписями
    c.fillStyle = '#5b3a24'; c.beginPath(); c.moveTo(225, 1270); c.lineTo(225, 1192); CART.forEach(p => { c.lineTo(p.x - 64, 1192); c.arc(p.x, 1192, 64, Math.PI, 0, true) }); c.lineTo(855, 1192); c.lineTo(855, 1270); c.closePath(); c.fill();
    c.fillStyle = '#3d2616'; c.fillRect(225, 1270, 630, 72);
    if (cutDone) juiceRun(c, t);
    CART.forEach((p, i) => { const on = at(t, cartT(i) + .5, cartT(i) + .7), hl = Math.max(pulse2(t, [K.mango, K.fru, K.des, K.mint][i]), on * (1 - at(t, cartT(i) + .9, cartT(i) + 1.3)));
      tx(c, p.n, p.x, 1307, { f: 'O', w: 700, s: 26 + 6 * hl, c: on > 0 ? mixc('#f8fafc', p.col, hl) : '#a8a29e', ls: 2 }) });
    blade(c, by, rot, sh);
    c.restore();
  }
  const pulse2 = (t, a) => at(t, a - .1, a + .05) * (1 - at(t, a + .5, a + .8));
  const SLO = .42;   // замедление после удара
  function juiceRun(c, t) {   // сок стекает по колодке и капает на помост, лужицы растут
    const k = (t - K.chop) * SLO;
    CART.forEach((p, i) => {
      const L = Math.min(150, 40 + k * 120);
      [-26, 8, 30].forEach((dx, j) => { const l = L * (.6 + .4 * H1(i * 5 + j)); rr(c, p.x + dx - 5, 1194, 10, l, 5); fill(c, p.col); circ(c, p.x + dx, 1194 + l, 8, p.col) });
      for (let j = 0; j < 3; j++) { const ph = ((t - K.chop) * .9 + H1(i * 7 + j)) % 1, yy = 1345 + ph * ph * 60; if (L > 140) circ(c, p.x - 20 + j * 22, yy, 7, p.col) }
      c.save(); c.translate(p.x, 1400); c.scale(1, .22); circ(c, 0, 0, Math.min(90, 10 + k * 70), rgba(p.col, .85)); c.restore();
    });
  }
  function cutFX(c, t) {   // отрубленные верхушки падают по параболе вниз за кадр, сок — в замедлении
    const dt = t - K.chop - 5 / 30; if (dt < 0) return;
    CART.forEach((p, i) => {
      const dir = p.x < 540 ? -1 : 1, x = p.x + dir * (120 + (i % 2) * 90) * dt, y = 1100 + 1800 * dt * dt; if (y > 2150) return;
      c.save(); c.translate(x, y); c.rotate(dir * dt * (4 + i)); cartridge(c, 0, 55, 110, 210, p.col, { y0: -50, y1: CUT - 1165 + 55, cut: 'top' }); c.restore();
    });
    const k = dt * SLO;
    for (let i = 0; i < 28; i++) {   // капли и струи сока — вверх веером, медленно
      const p = CART[i % 4], ang = -Math.PI / 2 + (H1(i * 3.1) - .5) * 2.2, v = 700 + H1(i * 7) * 600, x = p.x + Math.cos(ang) * v * k, y = CUT + Math.sin(ang) * v * k + 1500 * k * k;
      if (y > 1420 || k > 1.6) continue; const r = 9 + H1(i) * 12, vyNow = Math.sin(ang) * v + 3000 * k, ln = Math.min(60, Math.hypot(Math.cos(ang) * v, vyNow) * .04);
      c.save(); c.translate(x, y); c.rotate(Math.atan2(vyNow, Math.cos(ang) * v) - Math.PI / 2);
      c.beginPath(); c.ellipse(0, -ln / 2, r, r + ln / 2, 0, 0, TAU); fill(c, p.col); circ(c, -r * .3, -ln / 2 - r * .3, r * .3, 'rgba(255,255,255,.55)'); c.restore();
    }
  }
  function hallShot(c, t) {
    const s = 1 + .06 * at(t, K.train1, K.s3);   // медленный наезд на гильотину
    c.save(); c.translate(540, 1000); c.scale(s, s); c.translate(-540, -1000);
    hallBg(c, t); smallCart(c, 115, 1200, 'ТАБАК', t); smallCart(c, 965, 1200, 'МЕНТОЛ', t); guillotine(c, t); cutFX(c, t);
    c.restore(); vignette(c, .5);
  }
  function shot2(c, t) {   // шторка: слева от splitX — магазин, справа — уже собранный зал FDA, по линии разреза — вагон
    if (t < K.train1) {
      const x = splitX(t);
      c.save(); c.beginPath(); c.rect(-200, -200, x + 200, HH + 400); c.clip(); shot1(c, t); c.restore();
      c.save(); c.beginPath(); c.rect(x, -200, WW + 400, HH + 400); c.clip(); hallShot(c, t); c.restore();
      train(c, x, t);
    } else hallShot(c, t);
  }
