  // ================= СЦЕНА 1: колпачок во льду → крыша ночного магазина «ВЕЙПЫ 24/7» =================
  // v18.1 (отзыв Андрея): надписи по-русски; вейп уходит вниз под ледяной пол (без прозрачности); город открывается
  // «диафрагмой» — ледяная студия сжимается в круг, который становится Луной; витрина загорается волной, снег, неон мигает,
  // две машины с фарами, камера медленно наезжает.
  const VP = { x: 540, y: 860, w: 180, h: 460 };
  function iceBg(c, t, base) {   // ледяная студия (рисуется с запасом — её видно и на экране ноутбука во всю ширину)
    if (base !== false) { c.fillStyle = '#0f172a'; c.fillRect(-2500, -2500, WW + 5000, HH + 5000) }   // общий фон с ночным городом
    const g = c.createRadialGradient(540, 860, 0, 540, 860, 980); g.addColorStop(0, '#0ea5e9'); g.addColorStop(.36, '#1e293b'); g.addColorStop(1, 'rgba(15,23,42,0)');
    c.fillStyle = g; c.beginPath(); c.arc(540, 860, 980, 0, TAU); c.fill();
    for (let i = 0; i < 4; i++) { const x0 = 120 + i * 300 + Math.sin(t * .4 + i) * 8; beam(c, x0, -60, 540 + (x0 - 540) * .25, 980, 40, 150, '#bae6fd', .07) }
    [300, 430, 580].forEach((r, i) => ring(c, 540, 860, r + Math.sin(t * .9 + i) * 3, rgba('#7dd3fc', .16 - i * .035), 3));
    c.save(); c.translate(540, 1150); c.scale(1, .22); const fg = c.createRadialGradient(0, 0, 0, 0, 0, 520); fg.addColorStop(0, 'rgba(186,230,253,.30)'); fg.addColorStop(1, 'rgba(186,230,253,0)');
    c.fillStyle = fg; c.beginPath(); c.arc(0, 0, 520, 0, TAU); c.fill(); c.restore();
    const vg = c.createLinearGradient(0, 1150, 0, 1920); vg.addColorStop(0, 'rgba(15,23,42,0)'); vg.addColorStop(1, 'rgba(8,14,30,.75)'); c.fillStyle = vg; c.fillRect(-2500, 1150, WW + 5000, 3000);
    const corner = (sx, sy) => { c.save(); c.translate(sx ? WW : 0, sy ? HH : 0); c.scale(sx ? -1 : 1, sy ? -1 : 1);
      for (let i = 0; i < 7; i++) { const a = .12 + H1(i * 3 + sx * 7 + sy * 11) * 1.2, L = 140 + H1(i + sx + sy * 5) * 240, w = 22 + H1(i * 9) * 30;
        c.save(); c.rotate(a); poly(c, [0, -w * .3, L, 0, 0, w]); fill(c, rgba('#e0f2fe', .10 + H1(i * 5) * .07)); poly(c, [0, -w * .3, L, 0, L * .5, -w * .1]); fill(c, rgba('#ffffff', .06)); c.restore() }
      c.restore() };
    corner(0, 0); corner(1, 0); corner(0, 1); corner(1, 1);
  }
  function crystal6(c, x, y, r, a = 1, rot = 0) {
    c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha *= a; c.strokeStyle = '#fff'; c.lineWidth = Math.max(1.5, r * .16); c.lineCap = 'round';
    for (let i = 0; i < 3; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-r, 0); c.lineTo(r, 0); c.stroke() }
    c.restore();
  }
  function disposable(c, x, y, o = {}) {   // корпус одноразки «МАНГО-ЛЁД»
    const w = o.w || VP.w, h = o.h || VP.h, s = o.s || 1;
    c.save(); c.translate(x, y); c.scale(s, s);
    if (o.sh !== false) { c.save(); c.translate(0, h / 2 + 14); c.scale(1, .16); circ(c, 0, 0, w * .75, 'rgba(0,0,0,.35)'); c.restore() }
    const g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#f59e0b'); g.addColorStop(.45, '#fbbf24'); g.addColorStop(.62, '#22d3ee'); g.addColorStop(1, '#06b6d4');
    rr(c, -w / 2, -h / 2, w, h, 36); c.fillStyle = g; c.fill();
    c.save(); c.clip(); c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(-w / 2 + 16, -h / 2, 22, h); c.fillStyle = 'rgba(15,23,42,.18)'; c.fillRect(w / 2 - 34, -h / 2, 34, h); c.restore();
    rr(c, -w / 2, -h / 2, w, h, 36); stroke(c, 'rgba(255,255,255,.55)', 3);
    rr(c, -w / 2 + 12, -44, w - 24, 88, 14); fill(c, '#ffffff');
    tx(c, 'МАНГО-', 0, -16, { f: 'U', w: 800, s: 25, c: '#ea580c', mw: w - 36 }); tx(c, 'ЛЁД', 0, 18, { f: 'U', w: 800, s: 30, c: '#0891b2' });
    circ(c, 0, h / 2 - 34, 9, '#e0f2fe'); glow(c, 0, h / 2 - 34, 26, '#7dd3fc', .8);
    if (o.frost !== false) [[-w / 2, -h * .32, 18], [w / 2, -h * .18, 14], [-w / 2, h * .05, 15], [w / 2, h * .2, 20], [-w / 2, h * .34, 13], [w / 2, -h * .4, 12]]
      .forEach(([fx, fy, r], i) => crystal6(c, fx + (fx < 0 ? 6 : -6), fy, r, .9, i));
    c.restore();
  }
  function capShape(c, x, y, w, h, o = {}) {   // белый колпачок / заснеженная крыша (k — сколько снега и сосулек)
    const k = o.k || 0;
    c.save(); c.translate(x, y);
    c.beginPath(); c.moveTo(-w / 2, h / 2); c.lineTo(-w / 2 * .82, -h / 2 + 18); c.quadraticCurveTo(-w / 2 * .8, -h / 2, -w / 2 * .7, -h / 2); c.lineTo(w / 2 * .7, -h / 2);
    c.quadraticCurveTo(w / 2 * .8, -h / 2, w / 2 * .82, -h / 2 + 18); c.lineTo(w / 2, h / 2); c.closePath();
    c.save(); c.translate(0, 8); fill(c, rgba('#bae6fd', .55)); c.restore();
    c.fillStyle = mixc('#f8fafc', '#e2e8f0', k * .3); c.fill(); stroke(c, '#bae6fd', 3);
    if (k > 0) {
      for (let i = 0; i < 9; i++) { const sx = -w * .38 + i * w * .095; circ(c, sx, -h / 2 + 4, (16 + H1(i) * 14) * (w / 780) * k + 4 * k, '#ffffff') }
      for (let i = 0; i < 16; i++) { const sx = -w / 2 + 22 + i * (w - 44) / 15, L = (18 + H1(i * 7) * 44) * ss(.4, 1, k) * (.6 + .4 * w / 780);
        if (L > 2) { poly(c, [sx - 7, h / 2 - 2, sx + 7, h / 2 - 2, sx, h / 2 + L]); fill(c, 'rgba(224,242,254,.92)') } }
    } else { c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(-w * .22, -h / 2 + 10, w * .1, h * .7) }
    c.restore();
  }
  function confetti(c, t, t0, x, y) {
    const k = t - t0; if (k < 0 || k > 2.6) return;
    for (let i = 0; i < 18; i++) {
      const ang = -Math.PI / 2 + (H1(i * 3) - .5) * 2.6, v = 520 + H1(i * 5) * 520, px = x + Math.cos(ang) * v * k, py = y + Math.sin(ang) * v * k + 480 * k * k, sz = 14 + H1(i) * 8, r = k * (2 + H1(i * 7) * 5);
      if (py > 1460) continue;
      c.save(); c.translate(px, py); c.rotate(r); const col = i % 3 ? '#e0f2fe' : '#38bdf8';
      if (i % 3 === 0) { poly(c, [0, -sz, sz * .6, 0, 0, sz, -sz * .6, 0]); fill(c, col) }
      else if (i % 3 === 1) { c.beginPath(); for (let j = 0; j < 6; j++) { const aa = j * TAU / 6; c[j ? 'lineTo' : 'moveTo'](Math.cos(aa) * sz * .7, Math.sin(aa) * sz * .7) } c.closePath(); fill(c, col) }
      else crystal6(c, 0, 0, sz * .7, 1);
      c.restore();
    }
  }
  function qIce(c, x, y, s, r = 0) { if (s <= 0) return; c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s); tx(c, '?', 0, 0, { f: 'U', w: 800, s: 180, c: '#38bdf8', sw: 10, sc: '#ffffff' }); c.restore() }
  // ---------- ночной город (сцены 1 и 8) ----------
  function skylineLayer(c, seed, base, hmin, hmax, col, winA, wcol, t) {
    let x = -160, i = 0;
    while (x < WW + 160) {
      const w = 70 + H1(seed + i) * 110, h = hmin + H1(seed + i * 3) * (hmax - hmin); c.fillStyle = col; c.fillRect(x, base - h, w + 2, h + 2);
      if (H1(seed + i * 13) > .6) { c.fillRect(x + w * .4, base - h - 40, 6, 40) }
      if (winA > 0) for (let yy = base - h + 18; yy < base - 18; yy += 26) for (let xx = x + 10; xx < x + w - 12; xx += 20) {
        const r = H1(seed * 7 + xx * .13 + yy * .71); if (r > .58) { c.fillStyle = rgba(r > .86 ? '#7dd3fc' : wcol, winA * (.45 + .5 * H1(r * 99 + Math.floor(t * .7 + r * 5)))); c.fillRect(xx, yy, 9, 13) }
      }
      x += w + 6; i++;
    }
  }
  function nightSky(c, t, o = {}) {
    vgrad(c, -400, -400, WW + 800, HH + 800, o.base ? ['#0f172a', '#0f1d3d', '#1e2b4f'] : ['#070b1a', '#0f1d3d', '#1e2b4f']);
    for (let i = 0; i < 70; i++) { const sx = H1(i * 3.3) * WW, sy = H1(i * 7.7) * 900, tw2 = .4 + .6 * Math.abs(Math.sin(t * (1 + H1(i)) + i)); circ(c, sx, sy, 1.2 + H1(i * 2) * 1.8, rgba('#ffffff', .55 * tw2)) }
    if (o.moon) { const { x, y, r } = o.moon; glow(c, x, y, r * 3.2, '#e0f2fe', .35); circ(c, x, y, r, '#f8fafc'); circ(c, x - r * .3, y - r * .2, r * .18, 'rgba(148,163,184,.25)'); circ(c, x + r * .25, y + r * .3, r * .12, 'rgba(148,163,184,.2)') }
    if (o.clouds) for (let i = 0; i < 4; i++) { const cx = ((H1(i * 5) * 1400 + t * 26 * (1 + i * .3)) % 1500) - 200, cy = 220 + i * 150; c.save(); c.globalAlpha = .22; [0, 70, 140].forEach((dx, j) => circ(c, cx + dx, cy + (j === 1 ? -22 : 0), 60 + j * 4, '#334155')); c.restore() }
  }
  function lamp(c, x, base, h) {
    c.fillStyle = '#1f2937'; c.fillRect(x - 7, base - h, 14, h); c.fillRect(x - 7, base - h, 70 * (Math.sign(540 - x) || 1), 10);
    const lx = x + 62 * Math.sign(540 - x); rr(c, lx - 26, base - h + 6, 52, 22, 8); fill(c, '#111827'); circ(c, lx, base - h + 30, 12, '#fde68a');
    beam(c, lx, base - h + 30, lx, base, 14, 150, '#fde68a', .22); c.save(); c.translate(lx, base + 4); c.scale(1, .2); glow(c, 0, 0, 170, '#fde68a', .35); c.restore();
  }
  function stele24(c, x, base, t) {   // неоновая стела заправки «АЗС · 24 ЧАСА»
    c.fillStyle = '#0b1324'; c.fillRect(x - 12, base - 520, 24, 520); rr(c, x - 74, base - 690, 148, 200, 14); fill(c, '#111c34');
    rr(c, x - 74, base - 690, 148, 200, 14); stroke(c, '#22d3ee', 4); glow(c, x, base - 590, 140, '#22d3ee', .22 + .05 * Math.sin(t * 6));
    tx(c, 'АЗС', x, base - 615, { f: 'U', w: 800, s: 46, c: '#a5f3fc' }); tx(c, '24 ЧАСА', x, base - 548, { f: 'O', w: 700, s: 24, c: '#67e8f9', ls: 2 });
  }
  function street(c, t) {
    vgrad(c, -400, 1310, WW + 800, 40, ['#475569', '#334155']); c.fillStyle = '#64748b'; c.fillRect(-400, 1310, WW + 800, 6);
    vgrad(c, -400, 1350, WW + 800, 900, ['#1e293b', '#0f172a', '#0b1120']);
    c.save(); c.setLineDash([60, 46]); c.lineDashOffset = -t * 30; c.strokeStyle = 'rgba(248,250,252,.7)'; c.lineWidth = 8; c.beginPath(); c.moveTo(-400, 1500); c.lineTo(WW + 400, 1500); c.stroke(); c.restore();
    [['#22d3ee', 260], ['#f472b6', 720], ['#fde68a', 120], ['#fde68a', 980]].forEach(([col, x], i) => { c.save(); c.translate(x, 1420 + i * 18); c.scale(1, .12); glow(c, 0, 0, 160, col, .22); c.restore() });
  }
  function car(c, x, y, dir, col) {   // легковая машина: кузов, окна, фары вперёд, стопы назад
    c.save(); c.translate(x, y); c.scale(dir, 1);
    beam(c, 140, -30, 560, -10, 12, 90, '#fde68a', .35);
    c.beginPath(); c.moveTo(-150, 0); c.lineTo(-150, -46); c.quadraticCurveTo(-140, -60, -96, -64); c.lineTo(-60, -104); c.lineTo(56, -104); c.lineTo(100, -64); c.quadraticCurveTo(146, -60, 150, -40); c.lineTo(150, 0); c.closePath(); fill(c, col);
    poly(c, [-50, -96, -6, -96, -6, -66, -80, -66]); fill(c, 'rgba(186,230,253,.55)'); poly(c, [4, -96, 50, -96, 86, -66, 4, -66]); fill(c, 'rgba(186,230,253,.55)');
    circ(c, -88, 0, 26, '#0b0f19'); circ(c, 92, 0, 26, '#0b0f19'); circ(c, -88, 0, 10, '#64748b'); circ(c, 92, 0, 10, '#64748b');
    circ(c, 146, -36, 8, '#fef9c3'); glow(c, 146, -36, 40, '#fde68a', .8); c.fillStyle = '#ef4444'; c.fillRect(-152, -44, 8, 12); glow(c, -150, -38, 30, '#ef4444', .5);
    c.restore();
  }
  function snow(c, t) {
    for (let i = 0; i < 80; i++) {
      const sp = 70 + H1(i * 4.1) * 90, x = (H1(i * 1.7) * 1300 + Math.sin(t * .8 + i) * 30) - 110, y = ((H1(i * 2.9) * 2000 + t * sp) % 2000) - 80, r = 2 + H1(i * 6.3) * 3.5;
      circ(c, x, y, r, rgba('#f8fafc', .45 + .4 * H1(i * 9)));
    }
  }
  function bush(c, x, y, s) {
    if (s <= 0) return; c.save(); c.translate(x, y); c.scale(s, s);
    [[-50, 0, 52], [0, -26, 62], [52, 0, 50], [0, 10, 58]].forEach(([dx, dy, r], i) => circ(c, dx, dy, r, i % 2 ? '#0f766e' : '#115e59'));
    [[-40, -30, 22], [10, -64, 24], [52, -26, 20]].forEach(([dx, dy, r]) => circ(c, dx, dy, r, 'rgba(224,242,254,.85)'));
    for (let i = 0; i < 5; i++) crystal6(c, -60 + i * 30, -10 + H1(i) * 30, 8, .8, i);
    c.restore();
  }
  const BOXC = ['#ec4899', '#f97316', '#34d399', '#a78bfa', '#f59e0b', '#22d3ee', '#fb7185', '#84cc16'];
  function vapeBox(c, x, y, w, h, col, o = {}) {
    c.save(); c.translate(x, y); if (o.r) c.rotate(o.r);
    rr(c, -w / 2, -h / 2, w, h, Math.min(10, w * .14)); fill(c, col); c.save(); c.clip(); c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(-w / 2, -h / 2, w * .3, h); c.fillStyle = 'rgba(0,0,0,.16)'; c.fillRect(w * .28, -h / 2, w * .22, h); c.restore();
    const ki = o.inner ?? 1; if (ki <= 0) { c.restore(); return }
    if (ki < 1) { c.translate(0, h * .1); c.scale(ki, ki); c.translate(0, -h * .1) }
    rr(c, -w * .22, -h * .32, w * .44, h * .56, w * .12); fill(c, 'rgba(255,255,255,.85)'); rr(c, -w * .12, -h * .26, w * .24, h * .44, w * .08); fill(c, col);
    if (o.label) { rr(c, -w * .46, h * .3, w * .92, h * .15, 6); fill(c, 'rgba(15,23,42,.55)'); tx(c, o.label, 0, h * .375, { f: 'O', w: 700, s: Math.max(10, w * .17), c: '#fff', mw: w * .84 }) }
    c.restore();
  }
  function shop(c, t, kc, roofH, roofY) {   // фасад разворачивается вниз из-под кромки крыши; витрина загорается волной
    if (kc <= 0) return;
    const top = roofY + roofH / 2 - 4, H = 1310 - top;
    c.save(); c.beginPath(); c.rect(150, top, 780, lp(0, 700, kc)); c.clip();
    vgrad(c, 170, top, 740, H, ['#1e293b', '#172033']);
    for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(255,255,255,.035)'; c.fillRect(170, top + 30 + i * 40, 740, 2) }
    const t0 = K.shopSign, fl = t < t0 ? 0 : t < t0 + .35 ? (Math.sin(t * 90) > 0 ? 1 : .25) : ((t - t0) % 2.3 < .18 ? (Math.sin(t * 70) > 0 ? 1 : .35) : 1);
    rr(c, 280, top + 18, 520, 92, 18); fill(c, '#0b1220'); rr(c, 280, top + 18, 520, 92, 18); stroke(c, rgba('#2dd4bf', .35 + .65 * fl), 5);
    glow(c, 540, top + 64, 320, '#2dd4bf', .25 * fl); tx(c, 'ВЕЙПЫ 24/7', 540, top + 66, { f: 'U', w: 800, s: 50, c: mixc('#134e4a', '#99f6e4', fl), mw: 470 });
    const wy = top + 150; rr(c, 220, wy, 640, 340, 10); fill(c, '#0c1426');
    c.save(); rr(c, 220, wy, 640, 340, 10); c.clip();
    const lit = at(t, K.shopBox, K.shopBox + 3.4); glow(c, 220 + 640 * lit, wy + 170, 380, '#38bdf8', .22 * Math.min(1, lit * 4));
    for (let r = 0; r < 3; r++) { c.fillStyle = '#334155'; c.fillRect(220, wy + 105 + r * 110, 640, 8);
      for (let i = 0; i < 8; i++) { const ti = K.shopBox + i * .42 + r * .09, kk = bo(at(t, ti, ti + .38)); if (kk <= 0) continue;
        const fla = 1 - at(t, ti, ti + .5); c.save(); c.translate(262 + i * 79, wy + 102 + r * 110); c.scale(kk, kk); if (fla > 0) glow(c, 0, -48, 70, '#fde68a', .6 * fla); vapeBox(c, 0, -48, 55, 95, BOXC[(i + r * 3) % 8]); c.restore() } }
    c.globalAlpha = .16; c.fillStyle = '#fff'; [[-60, 120], [180, 70], [420, 150]].forEach(([dx, w]) => { poly(c, [220 + dx, wy + 340, 220 + dx + w, wy + 340, 220 + dx + w + 200, wy, 220 + dx + 200, wy]); c.fill() });
    c.restore();
    rr(c, 220, wy, 640, 340, 10); stroke(c, '#94a3b8', 6);
    rr(c, 180, 1290, 720, 20, 4); fill(c, '#475569');
    c.restore();
  }
  const ROOF = { y: 560, w: 760, h: 110 };
  function cityScene(c, t, off) {   // ночной город: небо того же цвета, что фон студии, дома, улица, фонарь, стела, машины, кусты, магазин
    c.save(); c.translate(0, off);
    nightSky(c, t, { moon: { x: 880, y: 300, r: 74 }, clouds: true, base: true });
    skylineLayer(c, 3, 1320, 380, 900, '#16213d', .45, '#fde68a', t);
    skylineLayer(c, 11, 1320, 220, 560, '#1d2a4a', .7, '#fde68a', t);
    street(c, t); lamp(c, 100, 1316, 560); stele24(c, 975, 1316, t);
    [[K.morph0 + 2.45, -1, '#be123c'], [K.morph0 + 4.45, 1, '#1d4ed8']].forEach(([t0, dir, col]) => { const k = at(t, t0, t0 + 1.7); if (k > 0 && k < 1) car(c, dir < 0 ? lp(1350, -350, k) : lp(-350, 1350, k), dir < 0 ? 1455 : 1470, dir, col) });
    bush(c, 140, 1250, .9 * bo(at(t, K.shopBox + .2, K.shopBox + .6))); bush(c, 940, 1250, .9 * bo(at(t, K.shopBox + .3, K.shopBox + .7)));
    shop(c, t, eoB(at(t, K.tr1b, K.tr1b + .5)), ROOF.h, ROOF.y);
    snow(c, t);
    c.restore();
  }
  const eoB = k => k <= 0 ? 0 : bo(k);
  function shot1Old(c, t) {
    // 2.4–3.2: фон тот же (#0f172a); город с дорогой выезжает снизу вверх, вейп со свечением студии уезжает вниз,
    // колпачок растёт в крышу; 3.2–3.7 — из-под кромки крыши вниз разворачивается фасад «ВЕЙПЫ 24/7»
    const pu = (t - K.tr1a) / .8, p = cl(pu), s = 1 + .12 * eio(at(t, K.morph0 + 1.0, K.train1));
    c.fillStyle = '#0f172a'; c.fillRect(-2500, -2500, WW + 5000, HH + 5000);
    c.save(); c.translate(540, 1000); c.scale(s, s); c.translate(-540, -1000);
    if (p > 0) cityScene(c, t, 1600 * (1 - eo(p)));
    const dy = 1090 * Math.max(0, pu);   // vapeY = lerp(860, 1950, p) — и дальше вниз за кадр
    if (dy < 2100) {
      c.save(); c.translate(0, dy); iceBg(c, t, false);
      disposable(c, VP.x, VP.y);
      const kq = bo(at(t, .7, 1.25)); qIce(c, 540, lp(640, 470, kq), lp(.2, 1, Math.min(1, kq)) * (t > .7 ? 1 : 0), Math.sin(t * 2.2) * .06);
      c.restore();
      confetti(c, t, .72, 540, 600);
    }
    const kp = bo(at(t, .5, 1.3)), cy = lp(lp(585, 340, kp), ROOF.y, p), cw = lp(140, ROOF.w, p), ch = lp(95, ROOF.h, p);
    capShape(c, 540, cy, cw, ch, { k: ss(0, .25, p) });
    c.restore();
    if (p > 0) vignette(c, .45 * p);
  }

  // ================= v18.3 (16.11, проба): сцена 1 по Starbucks 0:00–0:05 (#011 + #136 + #137) =================
  // Как у Боба: ровный тёмный фон, всё — белыми контурами, один цвет заливки. Вейп подпрыгивает, колпачок слетает,
  // из горлышка встаёт «?» с конфетти (тормозят в воздухе); колпачок садится назад, корпус сплющивается в коробку,
  // колпачок — в плоскую крышу; коробка растёт в магазин (вывеска, маркизы, витрины), сугробы выпрыгивают пружиной.
  const S1 = { bg: '#262a40', ln: '#f1f5f9', ac: '#3b5d9a', gr: 1200, dim: '#3d4262', z: 1.38 };
  let LWK = 1, LOD = 0;   // v18.4: LWK — толщина линий при наезде камеры (не толстеют), LOD — детали коробок в витрине при наезде
  function lnS(c, w = 6, col = S1.ln) { c.strokeStyle = col; c.lineWidth = w * LWK; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke() }
  function dashDraw(c, k, L) { if (k < 1) c.setLineDash([L * cl(k), L + 10]) }   // линия рисуется по длине L
  function bricksS1(c, k) {
    if (k <= 0) return;
    [[300, 760], [790, 700], [250, 1010], [820, 960], [720, 1120]].forEach(([x, y], i) => {
      c.save(); c.translate(x, y); c.scale(k, k); c.beginPath();
      c.moveTo(-46, 0); c.lineTo(46, 0); c.moveTo(-30, 26); c.lineTo(54, 26); c.moveTo(-8, 0); c.lineTo(-8, 26); c.moveTo(24, 26); c.lineTo(24, 52); c.moveTo(-14, 52); c.lineTo(52, 52);
      if (i % 2) { c.moveTo(-46, -26); c.lineTo(10, -26); c.moveTo(-20, -26); c.lineTo(-20, 0) }
      lnS(c, 4, S1.dim); c.restore();
    });
  }
  function snowS1(c, t) {
    for (let i = 0; i < 46; i++) {
      const sp = 40 + H1(i * 4.1) * 50, x = H1(i * 1.7) * 1180 - 50 + Math.sin(t * .7 + i) * 18, y = ((H1(i * 2.9) * 2000 + t * sp) % 2000) - 60, r = 2 + H1(i * 6.3) * 2.6;
      if (i % 5) circ(c, x, y, r, rgba('#e2e8f0', .55)); else crystal6(c, x, y, 7, .6, t * .5 + i);
    }
  }
  function moonS1(c, t, k) {
    if (k <= 0) return; c.save(); c.translate(860, 430); c.scale(k, k);
    circ(c, 0, 0, 62, '#f1f5f9'); circ(c, -18, -10, 11, rgba(S1.dim, .5)); circ(c, 20, 18, 8, rgba(S1.dim, .45));
    c.restore();
  }
  function cloudS1(c, x, y, s, k) {   // облако контуром, рисуется по линии
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(s, s); c.beginPath();
    c.moveTo(-150, 0); c.lineTo(-90, 0); c.arc(-62, -6, 30, Math.PI, 0); c.arc(0, -22, 42, Math.PI, -.15); c.arc(56, -4, 26, -Math.PI * .9, 0); c.lineTo(150, 0);
    c.moveTo(-200, 18); c.lineTo(-120, 18);
    dashDraw(c, k, 620); lnS(c, 4, '#5b6185'); c.restore();
  }
  function questionS1(c, x, y, s, r) {   // «?» контуром
    if (s <= 0) return; c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.font = '800 300px U'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.strokeStyle = S1.ln; c.lineWidth = 7; c.strokeText('?', 0, 0);
    c.restore();
  }
  function confettiS1(c, t, t0, x, y, k) {   // #136: треугольники, крестики, точки, дуги — разлетаются и тормозят в воздухе
    const u = t - t0; if (u < 0 || k <= 0) return;
    const cols = ['#fb923c', '#5eead4', '#f1f5f9', '#f472b6', '#38bdf8'];
    for (let i = 0; i < 24; i++) {
      const ang = -Math.PI / 2 + (H1(i * 3.1) - .5) * 3.2, D = 170 + H1(i * 5.3) * 300, e = 1 - Math.exp(-5.5 * u);
      const px = x + Math.cos(ang) * D * e + Math.sin(u * 1.6 + i) * 10, py = y + Math.sin(ang) * D * e + 14 * u, sz = (9 + H1(i) * 9) * k, col = cols[i % 5];
      c.save(); c.translate(px, py); c.rotate(u * (1 + H1(i * 7) * 3) * (i % 2 ? 1 : -1)); c.beginPath();
      const ty = i % 4;
      if (ty === 0) { poly(c, [0, -sz, sz * .9, sz * .6, -sz * .9, sz * .6]); lnS(c, 4, col) }
      else if (ty === 1) { c.moveTo(-sz, -sz); c.lineTo(sz, sz); c.moveTo(sz, -sz); c.lineTo(-sz, sz); lnS(c, 4, col) }
      else if (ty === 2) circ(c, 0, 0, sz * .55, col);
      else { c.arc(0, 0, sz, Math.PI * .1, Math.PI * .9); lnS(c, 4, col) }
      c.restore();
    }
  }
  function vapeS1(c, t, x, yb, w, h, o) {   // корпус: контур, косая заливка снизу, значок-снежинка; o.dr — заливка «стекает», o.em — значок
    const top = yb - h, r = o.r;
    rr(c, x - w / 2, top, w, h, r); fill(c, S1.bg);
    c.save(); rr(c, x - w / 2, top, w, h, r); c.clip();
    const dy = h * (o.dr || 0);
    c.beginPath(); c.moveTo(x - w / 2 - 4, top + h * .05 + dy); c.lineTo(x - w * .18, top + dy);
    c.bezierCurveTo(x - w * .05, top + h * .55 + dy, x + w * .35, top + h * .75 + dy, x + w / 2 + 4, top + h * .93 + dy);
    c.lineTo(x + w / 2 + 4, yb + 4); c.lineTo(x - w / 2 - 4, yb + 4); c.closePath(); fill(c, S1.ac);
    c.restore();
    rr(c, x - w / 2, top, w, h, r); lnS(c, 6);
    const em = o.em ?? 1;
    if (em > 0) {
      c.save(); c.translate(x, top + h * .4); c.scale(em, em);
      circ(c, 0, 0, 46, S1.bg); ring(c, 0, 0, 46, S1.ln, 5); crystal6(c, 0, 0, 26, 1, 0);
      c.restore();
      tx(c, 'МАНГО · ЛЁД', x, top + h * .62, { f: 'U', w: 800, s: 22 * em, c: '#fb923c', a: em });
      circ(c, x, yb - 34, 7 * em, '#5eead4');
    }
  }
  function capS1(c, x, cy, w, h, rot) {   // колпачок / крыша: трапеция с ободком, левая половина залита
    c.save(); c.translate(x, cy); c.rotate(rot);
    const tw2 = w * .84;
    poly(c, [-w / 2, h / 2, -tw2 / 2, -h / 2, tw2 / 2, -h / 2, w / 2, h / 2]); fill(c, S1.bg);
    c.save(); poly(c, [-w / 2, h / 2, -tw2 / 2, -h / 2, tw2 / 2, -h / 2, w / 2, h / 2]); c.clip(); c.fillStyle = S1.ac; c.fillRect(-w / 2, -h / 2, w * .42, h); c.restore();
    poly(c, [-w / 2, h / 2, -tw2 / 2, -h / 2, tw2 / 2, -h / 2, w / 2, h / 2]); lnS(c, 6);
    c.beginPath(); c.moveTo(-w / 2 - 8, h / 2); c.lineTo(w / 2 + 8, h / 2); lnS(c, 6);
    c.restore();
  }
  function shopS1(c, t, x, top, w, yb, kd) {   // магазин: вывеска, маркизы, витрины (линии рисуются по kd), товар волной
    if (kd <= 0) return;
    const L = x - w / 2, kS = bo(at(kd, 0, .45)), kW = at(kd, .2, .8);
    // вывеска
    if (kS > 0) { c.save(); c.translate(x, top + 72); c.scale(kS, kS); rr(c, -220, -40, 440, 80, 6); fill(c, S1.bg); rr(c, -220, -40, 440, 80, 6); lnS(c, 5);
      const t0 = K.shopSign + .5, fl = t < t0 ? 1 : ((t - t0) % 2.6 < .16 ? (Math.sin(t * 70) > 0 ? 1 : .35) : 1);
      tx(c, 'ВЕЙПЫ 24/7', 0, 3, { f: 'U', w: 800, s: 48, c: mixc('#1f6f5c', '#34e0b3', fl) }); c.restore() }
    // маркизы и витрины
    const ww = (w - 120) / 3, wy = top + 175, wh = yb - wy - 50;
    for (let i = 0; i < 3; i++) {
      const wx = L + 30 + i * (ww + 30), kk = at(kW, i * .15, .55 + i * .15);
      if (kk <= 0) continue;
      c.save(); c.beginPath(); c.moveTo(wx, wy - 40);
      for (let j = 0; j < 4; j++) { const a = wx + j * ww / 4; c.arc(a + ww / 8, wy - 40, ww / 8, Math.PI, 0, true) }
      c.lineTo(wx + ww, wy - 66); c.lineTo(wx, wy - 66); c.closePath(); dashDraw(c, kk, 900); lnS(c, 5); c.restore();
      const H2 = i === 2 ? yb - wy : wh;   // правая — дверь до земли
      c.save(); c.beginPath(); c.rect(wx, wy, ww, H2); dashDraw(c, kk, 2 * (ww + H2)); lnS(c, 5); c.restore();
      if (kk >= 1) {
        c.save(); c.beginPath(); c.rect(wx + 3, wy + 3, ww - 6, H2 - 6); c.clip();
        poly(c, [wx + ww * .55, wy, wx + ww, wy, wx + ww, wy + H2 * .35, wx + ww * .2, wy + H2]); fill(c, rgba(S1.ac, .45));
        if (i < 2) for (let r = 0; r < 2; r++) {
          c.beginPath(); c.moveTo(wx, wy + 84 + r * 78); c.lineTo(wx + ww, wy + 84 + r * 78); lnS(c, 4, '#5b6185');
          for (let j = 0; j < 4; j++) { const ti = K.shopBox + (i * 8 + r * 4 + j) * .14, kb = bo(at(t, ti, ti + .32)); if (kb <= 0) continue;
            c.save(); c.translate(wx + 22 + j * (ww - 44) / 3, wy + 82 + r * 78); c.scale(kb, kb); rr(c, -11, -50, 22, 50, 7); fill(c, BOXC[(i * 4 + r * 2 + j) % 8]); if (LOD > 0) boxLOD(c, LOD, i * 8 + r * 4 + j); rr(c, -11, -50, 22, 50, 7); lnS(c, 3); c.restore() }
        }
        else { circ(c, wx + ww - 22, wy + H2 * .55, 6, S1.ln) }
        c.restore();
      }
    }
  }
  function moundS1(c, x, y, s, flip) {   // сугроб вместо куста — выпрыгивает пружиной
    if (s <= 0) return; c.save(); c.translate(x, y); c.scale(s * (flip ? -1 : 1), s); c.beginPath();
    c.moveTo(-96, 0); c.arc(-56, 0, 40, Math.PI, Math.PI * 1.75); c.arc(-4, -10, 48, Math.PI * 1.15, Math.PI * 1.85); c.arc(48, 0, 38, Math.PI * 1.3, 0); c.closePath();
    fill(c, '#dbeafe'); c.beginPath(); c.moveTo(-96, 0); c.arc(-56, 0, 40, Math.PI, Math.PI * 1.75); c.arc(-4, -10, 48, Math.PI * 1.15, Math.PI * 1.85); c.arc(48, 0, 38, Math.PI * 1.3, 0); lnS(c, 5);
    c.restore();
  }
  function shot1(c, t) {
    const m0 = K.morph0, gr = S1.gr;
    c.fillStyle = S1.bg; c.fillRect(-2500, -2500, WW + 5000, HH + 5000);
    snowS1(c, t);
    const s = 1 + .06 * eio(at(t, m0 + 1.2, K.train1));
    c.save(); c.translate(540, 980); c.scale(s, s); c.translate(-540, -980);
    c.translate(540, 990); c.scale(S1.z, S1.z); c.translate(-540, -990);
    moonS1(c, t, bo(at(t, m0 + 1.0, m0 + 1.4)));
    const dc = t * 6; cloudS1(c, 250 + Math.sin(t * .2) * 12, 560, 1, at(t, m0 + .95, m0 + 1.6)); cloudS1(c, 760 + Math.sin(t * .25 + 1) * 12, 640, .8, at(t, m0 + 1.1, m0 + 1.75));
    bricksS1(c, 1 - eio(at(t, m0, m0 + .3)));
    const u1 = eio(at(t, m0, m0 + .4)), u2 = eio(at(t, m0 + .4, m0 + .85));
    // земля
    const gw = lp(lp(220, 340, u1), 440, u2); c.beginPath(); c.moveTo(540 - gw, gr); c.lineTo(540 + gw, gr); lnS(c, 5);
    // корпус → коробка → магазин
    let w = lp(lp(170, 520, u1), 600, u2), h = lp(lp(440, 230, u1), 460, u2), r = lp(46, 6, u1);
    let ox = 0, oy = 0, sx = 1, sy = 1;
    if (t > .12 && t < .62) oy = -140 * Math.sin(Math.PI * (t - .12) / .5);
    const ul = t - .62; if (ul > 0 && ul < 1.2) { sy = 1 - .1 * Math.exp(-7 * ul) * Math.cos(15 * ul) * Math.min(1, ul * 30); sx = 1 / sy }
    c.save(); c.translate(540 + ox, gr + oy); c.scale(sx, sy); c.translate(-540, -gr);
    const top = gr - h, mouth = top;
    // «?» встаёт из горлышка (за колпачком), потом уходит обратно
    const kq = bo(at(t, .95, 1.45)) * (1 - eio(at(t, m0 - .5, m0 - .12)));
    if (kq > 0.01) { c.save(); c.beginPath(); c.rect(-200, -400, 1480, mouth + 400); c.clip(); questionS1(c, 540, lp(mouth + 60, mouth - 190, kq) + Math.sin(t * 2.4) * 8, lp(.5, 1, kq), Math.sin(t * 1.7) * .07); c.restore() }
    vapeS1(c, t, 540, gr, w, h, { r, dr: eio(at(t, m0, m0 + .55)), em: 1 - eio(at(t, m0, m0 + .3)) });
    shopS1(c, t, 540, top, w, gr, at(t, m0 + .8, m0 + 1.6));
    // колпачок: слетает, висит, садится назад, растягивается в крышу
    const cw = lp(lp(150, 560, u1), 660, u2), ch = lp(70, 44, u1);
    const kup = bo(at(t, .85, 1.25)) * (1 - eio(at(t, m0 - .45, m0 - .08))), land = at(t, m0 - .08, m0 + .1);
    const cy = top - ch / 2 + 4 - 290 * kup + Math.sin(t * 2.1) * 10 * kup - 8 * Math.sin(Math.PI * land);
    capS1(c, 540, cy, cw, ch, (-.09 + Math.sin(t * 1.9) * .04) * kup);
    c.restore();
    confettiS1(c, t, .95, 540, mouth - 40, 1 - eio(at(t, m0 - .55, m0 - .2)));
    // сугробы — пружиной (#137)
    moundS1(c, 540 - 300 - 20, gr, spr(at(t, m0 + 1.0, m0 + 1.7)), false); moundS1(c, 540 + 300 + 30, gr, spr(at(t, m0 + 1.1, m0 + 1.8)), true);
    c.restore();
  }
