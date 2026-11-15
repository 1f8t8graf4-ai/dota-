  // ================= СЦЕНА 1: колпачок во льду → крыша ночного вейп-шопа =================
  const VP = { x: 540, y: 860, w: 180, h: 460 };   // одноразка кадра 0
  function iceBg(c, t) {   // ледяная студия: гало, кольца, лучи сверху, иней по углам, ледяной пол
    c.fillStyle = '#0f172a'; c.fillRect(-200, -200, WW + 400, HH + 400);
    const g = c.createRadialGradient(540, 860, 0, 540, 860, 980); g.addColorStop(0, '#0ea5e9'); g.addColorStop(.36, '#1e293b'); g.addColorStop(1, '#0f172a');
    c.fillStyle = g; c.fillRect(-200, -200, WW + 400, HH + 400);
    for (let i = 0; i < 4; i++) { const x0 = 120 + i * 300 + Math.sin(t * .4 + i) * 8; beam(c, x0, -60, 540 + (x0 - 540) * .25, 980, 40, 150, '#bae6fd', .07) }   // контровые лучи
    [300, 430, 580].forEach((r, i) => ring(c, 540, 860, r + Math.sin(t * .9 + i) * 3, rgba('#7dd3fc', .16 - i * .035), 3));
    // ледяной пол: эллипс-платформа и отражение
    c.save(); c.translate(540, 1150); c.scale(1, .22); const fg = c.createRadialGradient(0, 0, 0, 0, 0, 520); fg.addColorStop(0, 'rgba(186,230,253,.30)'); fg.addColorStop(1, 'rgba(186,230,253,0)');
    c.fillStyle = fg; c.beginPath(); c.arc(0, 0, 520, 0, TAU); c.fill(); c.restore();
    vgrad(c, 0, 1150, WW, 770, ['rgba(15,23,42,0)', 'rgba(8,14,30,.75)']);
    // иней по углам — грани кристаллов
    const corner = (sx, sy) => { c.save(); c.translate(sx ? WW : 0, sy ? HH : 0); c.scale(sx ? -1 : 1, sy ? -1 : 1);
      for (let i = 0; i < 7; i++) { const a = .12 + H1(i * 3 + sx * 7 + sy * 11) * 1.2, L = 140 + H1(i + sx + sy * 5) * 240, w = 22 + H1(i * 9) * 30;
        c.save(); c.rotate(a); poly(c, [0, -w * .3, L, 0, 0, w]); fill(c, rgba('#e0f2fe', .10 + H1(i * 5) * .07)); poly(c, [0, -w * .3, L, 0, L * .5, -w * .1]); fill(c, rgba('#ffffff', .06)); c.restore() }
      c.restore() };
    corner(0, 0); corner(1, 0); corner(0, 1); corner(1, 1);
  }
  function crystal6(c, x, y, r, a = 1, rot = 0) {   // маленький кристалл инея
    c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha *= a; c.strokeStyle = '#fff'; c.lineWidth = Math.max(1.5, r * .16); c.lineCap = 'round';
    for (let i = 0; i < 3; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-r, 0); c.lineTo(r, 0); c.stroke() }
    c.restore();
  }
  function disposable(c, x, y, o = {}) {   // корпус одноразки «МАНГО-ЛЁД» (без колпачка), центр (x, y)
    const w = o.w || VP.w, h = o.h || VP.h, s = o.s || 1;
    c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= o.a ?? 1;
    if (o.sh !== false) { c.save(); c.translate(0, h / 2 + 14); c.scale(1, .16); circ(c, 0, 0, w * .75, 'rgba(0,0,0,.35)'); c.restore() }
    const g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#f59e0b'); g.addColorStop(.45, '#fbbf24'); g.addColorStop(.62, '#22d3ee'); g.addColorStop(1, '#06b6d4');
    rr(c, -w / 2, -h / 2, w, h, 36); c.fillStyle = g; c.fill();
    c.save(); c.clip(); c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(-w / 2 + 16, -h / 2, 22, h); c.fillStyle = 'rgba(15,23,42,.18)'; c.fillRect(w / 2 - 34, -h / 2, 34, h); c.restore();
    rr(c, -w / 2, -h / 2, w, h, 36); stroke(c, 'rgba(255,255,255,.55)', 3);
    rr(c, -w / 2 + 14, -38, w - 28, 76, 14); fill(c, '#ffffff');
    tx(c, 'MANGO', 0, -14, { f: 'U', w: 800, s: 26, c: '#f59e0b', mw: w - 44 }); tx(c, 'ICE', 0, 18, { f: 'U', w: 800, s: 26, c: '#0891b2' });
    circ(c, 0, h / 2 - 34, 9, '#e0f2fe'); glow(c, 0, h / 2 - 34, 26, '#7dd3fc', .8);
    if (o.frost !== false) [[-w / 2, -h * .32, 18], [w / 2, -h * .18, 14], [-w / 2, h * .05, 15], [w / 2, h * .2, 20], [-w / 2, h * .34, 13], [w / 2, -h * .4, 12]]
      .forEach(([fx, fy, r], i) => crystal6(c, fx + (fx < 0 ? 6 : -6), fy, r, .9, i));
    c.restore();
  }
  function capShape(c, x, y, w, h, o = {}) {   // белый силиконовый колпачок / заснеженная крыша (k — сколько снега и сосулек)
    const k = o.k || 0;
    c.save(); c.translate(x, y);
    c.beginPath(); c.moveTo(-w / 2, h / 2); c.lineTo(-w / 2 * .82, -h / 2 + 18); c.quadraticCurveTo(-w / 2 * .8, -h / 2, -w / 2 * .7, -h / 2); c.lineTo(w / 2 * .7, -h / 2);
    c.quadraticCurveTo(w / 2 * .8, -h / 2, w / 2 * .82, -h / 2 + 18); c.lineTo(w / 2, h / 2); c.closePath();
    c.save(); c.translate(0, 8); fill(c, rgba('#bae6fd', .55)); c.restore();
    c.fillStyle = mixc('#f8fafc', '#e2e8f0', k * .3); c.fill(); stroke(c, '#bae6fd', 3);
    if (k > 0) {   // снег шапками и сосульки
      for (let i = 0; i < 9; i++) { const sx = -w * .38 + i * w * .095; circ(c, sx, -h / 2 + 4, (16 + H1(i) * 14) * k, '#ffffff') }
      for (let i = 0; i < 16; i++) { const sx = -w / 2 + 22 + i * (w - 44) / 15, L = (18 + H1(i * 7) * 44) * ss(.4, 1, k);
        if (L > 2) { poly(c, [sx - 7, h / 2 - 2, sx + 7, h / 2 - 2, sx, h / 2 + L]); fill(c, 'rgba(224,242,254,.92)') } }
    } else { c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(-w * .22, -h / 2 + 10, w * .1, h * .7) }
    c.restore();
  }
  function confetti(c, t, t0, x, y) {   // 18 снежинок-конфетти: ромбы, шестигранники, крестики
    const k = t - t0; if (k < 0 || k > 2.6) return;
    for (let i = 0; i < 18; i++) {
      const ang = -Math.PI / 2 + (H1(i * 3) - .5) * 2.6, v = 520 + H1(i * 5) * 520, px = x + Math.cos(ang) * v * k, py = y + Math.sin(ang) * v * k + 480 * k * k, a = 1 - at(k, 1.6, 2.6), sz = 14 + H1(i) * 8, r = k * (2 + H1(i * 7) * 5);
      c.save(); c.translate(px, py); c.rotate(r); c.globalAlpha *= a; const col = i % 3 ? '#e0f2fe' : '#38bdf8';
      if (i % 3 === 0) { poly(c, [0, -sz, sz * .6, 0, 0, sz, -sz * .6, 0]); fill(c, col) }
      else if (i % 3 === 1) { c.beginPath(); for (let j = 0; j < 6; j++) { const aa = j * TAU / 6; c[j ? 'lineTo' : 'moveTo'](Math.cos(aa) * sz * .7, Math.sin(aa) * sz * .7) } c.closePath(); fill(c, col) }
      else crystal6(c, 0, 0, sz * .7, 1);
      c.restore();
    }
  }
  function qIce(c, x, y, s, a, r = 0) { if (a <= 0) return; c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s); tx(c, '?', 0, 0, { f: 'U', w: 800, s: 180, c: '#38bdf8', sw: 10, sc: '#ffffff', a }); c.restore() }
  // ---------- ночной город (сцены 1 и 8) ----------
  function skylineLayer(c, seed, base, hmin, hmax, col, winA, wcol, t) {
    let x = -60, i = 0;
    while (x < WW + 60) {
      const w = 70 + H1(seed + i) * 110, h = hmin + H1(seed + i * 3) * (hmax - hmin); c.fillStyle = col; c.fillRect(x, base - h, w + 2, h + 2);
      if (H1(seed + i * 13) > .6) { c.fillRect(x + w * .4, base - h - 40, 6, 40) }
      if (winA > 0) for (let yy = base - h + 18; yy < base - 18; yy += 26) for (let xx = x + 10; xx < x + w - 12; xx += 20) {
        const r = H1(seed * 7 + xx * .13 + yy * .71); if (r > .58) { c.fillStyle = rgba(r > .86 ? '#7dd3fc' : wcol, winA * (.45 + .5 * H1(r * 99 + Math.floor(t * .5)))); c.fillRect(xx, yy, 9, 13) }
      }
      x += w + 6; i++;
    }
  }
  function nightSky(c, t, o = {}) {
    vgrad(c, -200, -200, WW + 400, HH + 400, ['#070b1a', '#0f1d3d', '#1e2b4f']);
    for (let i = 0; i < 70; i++) { const sx = H1(i * 3.3) * WW, sy = H1(i * 7.7) * 900, tw2 = .4 + .6 * Math.abs(Math.sin(t * (1 + H1(i)) + i)); circ(c, sx, sy, 1.2 + H1(i * 2) * 1.8, rgba('#ffffff', .55 * tw2)) }
    if (o.moon) { const { x, y, r } = o.moon; glow(c, x, y, r * 3.2, '#e0f2fe', .35); circ(c, x, y, r, '#f8fafc'); circ(c, x - r * .3, y - r * .2, r * .18, 'rgba(148,163,184,.25)'); circ(c, x + r * .25, y + r * .3, r * .12, 'rgba(148,163,184,.2)') }
    if (o.clouds) for (let i = 0; i < 4; i++) { const cx = ((H1(i * 5) * 1400 + t * 14 * (1 + i * .3)) % 1500) - 200, cy = 220 + i * 150; c.save(); c.globalAlpha = .22; [0, 70, 140].forEach((dx, j) => circ(c, cx + dx, cy + (j === 1 ? -22 : 0), 60 + j * 4, '#334155')); c.restore() }
  }
  function lamp(c, x, base, h, a = 1) {
    c.save(); c.globalAlpha *= a; c.fillStyle = '#1f2937'; c.fillRect(x - 7, base - h, 14, h); c.fillRect(x - 7, base - h, 70 * Math.sign(540 - x) || 70, 10);
    const lx = x + 62 * Math.sign(540 - x); rr(c, lx - 26, base - h + 6, 52, 22, 8); fill(c, '#111827'); circ(c, lx, base - h + 30, 12, '#fde68a');
    beam(c, lx, base - h + 30, lx, base, 14, 150, '#fde68a', .22); c.save(); c.translate(lx, base + 4); c.scale(1, .2); glow(c, 0, 0, 170, '#fde68a', .35); c.restore();
    c.restore();
  }
  function stele24(c, x, base, t, a = 1) {   // неоновая стела заправки «24H»
    c.save(); c.globalAlpha *= a; c.fillStyle = '#0b1324'; c.fillRect(x - 12, base - 520, 24, 520); rr(c, x - 70, base - 680, 140, 190, 14); fill(c, '#111c34');
    rr(c, x - 70, base - 680, 140, 190, 14); stroke(c, '#22d3ee', 4); glow(c, x, base - 585, 140, '#22d3ee', .22 + .05 * Math.sin(t * 6));
    tx(c, '24H', x, base - 600, { f: 'U', w: 800, s: 44, c: '#a5f3fc' }); tx(c, 'FUEL · SHOP', x, base - 540, { f: 'O', w: 500, s: 18, c: '#67e8f9', ls: 2 }); c.restore();
  }
  function street(c, t, a = 1) {   // бордюр, тротуар, асфальт с пунктиром и неоновыми бликами
    c.save(); c.globalAlpha *= a;
    vgrad(c, 0, 1310, WW, 40, ['#475569', '#334155']); c.fillStyle = '#64748b'; c.fillRect(0, 1310, WW, 6);
    vgrad(c, 0, 1350, WW, 600, ['#1e293b', '#0f172a', '#0b1120']);
    c.save(); c.setLineDash([60, 46]); c.lineDashOffset = -t * 30; c.strokeStyle = 'rgba(248,250,252,.7)'; c.lineWidth = 8; c.beginPath(); c.moveTo(-40, 1500); c.lineTo(WW + 40, 1500); c.stroke(); c.restore();
    [['#22d3ee', 260], ['#f472b6', 720], ['#fde68a', 120], ['#fde68a', 980]].forEach(([col, x], i) => { c.save(); c.translate(x, 1420 + i * 18); c.scale(1, .12); glow(c, 0, 0, 160, col, .22); c.restore() });
    c.restore();
  }
  function bush(c, x, y, s, a = 1) {
    if (a <= 0) return; c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= Math.min(1, a);
    [[-50, 0, 52], [0, -26, 62], [52, 0, 50], [0, 10, 58]].forEach(([dx, dy, r], i) => circ(c, dx, dy, r, i % 2 ? '#0f766e' : '#115e59'));
    [[-40, -30, 22], [10, -64, 24], [52, -26, 20]].forEach(([dx, dy, r]) => circ(c, dx, dy, r, 'rgba(224,242,254,.85)'));
    for (let i = 0; i < 5; i++) crystal6(c, -60 + i * 30, -10 + H1(i) * 30, 8, .8, i);
    c.restore();
  }
  const BOXC = ['#ec4899', '#f97316', '#34d399', '#a78bfa', '#f59e0b', '#22d3ee', '#fb7185', '#84cc16'];
  function vapeBox(c, x, y, w, h, col, o = {}) {   // коробка одноразки: цветная, с окошком-силуэтом вейпа
    c.save(); c.translate(x, y); if (o.r) c.rotate(o.r);
    rr(c, -w / 2, -h / 2, w, h, Math.min(10, w * .14)); fill(c, col); c.save(); c.clip(); c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(-w / 2, -h / 2, w * .3, h); c.fillStyle = 'rgba(0,0,0,.16)'; c.fillRect(w * .28, -h / 2, w * .22, h); c.restore();
    rr(c, -w * .22, -h * .32, w * .44, h * .56, w * .12); fill(c, 'rgba(255,255,255,.85)'); rr(c, -w * .12, -h * .26, w * .24, h * .44, w * .08); fill(c, col);
    if (o.label) tx(c, o.label, 0, h * .38, { f: 'O', w: 700, s: Math.max(10, w * .16), c: '#fff', mw: w * .86 });
    c.restore();
  }
  function shop(c, t, k, roofW, roofH, roofY) {   // фасад «VAPE 24/7» растёт из-под крыши (k — 0…1, с пружиной)
    if (k <= 0) return;
    const top = roofY + roofH / 2 - 4, H = 1310 - top, h = H * k;
    c.save(); c.beginPath(); c.rect(150, top, 780, h); c.clip();
    c.translate(0, -(1 - k) * H * .25);
    vgrad(c, 170, top, 740, H, ['#1e293b', '#172033']);
    for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(255,255,255,.035)'; c.fillRect(170, top + 30 + i * 40, 740, 2) }
    // неоновая вывеска
    const on = t > K.shopSign ? (t < K.shopSign + .35 ? (Math.sin(t * 90) > 0 ? 1 : .25) : 1) : 0;
    rr(c, 300, top + 18, 480, 92, 18); fill(c, '#0b1220'); rr(c, 300, top + 18, 480, 92, 18); stroke(c, rgba('#2dd4bf', .35 + .65 * on), 5);
    glow(c, 540, top + 64, 300, '#2dd4bf', .25 * on); tx(c, 'VAPE 24/7', 540, top + 66, { f: 'U', w: 800, s: 52, c: mixc('#134e4a', '#99f6e4', on) });
    // витрина 640×340
    const wy = top + 150; rr(c, 220, wy, 640, 340, 10); fill(c, '#0c1426');
    c.save(); rr(c, 220, wy, 640, 340, 10); c.clip(); glow(c, 540, wy + 170, 420, '#38bdf8', .18);
    for (let r = 0; r < 3; r++) { c.fillStyle = '#334155'; c.fillRect(220, wy + 105 + r * 110, 640, 8);
      for (let i = 0; i < 8; i++) { const kk = spr(at(t, K.shopBox + (r * 8 + i) * .028, K.shopBox + .45 + (r * 8 + i) * .028)); if (kk <= 0) continue;
        c.save(); c.translate(262 + i * 79, wy + 102 + r * 110); c.scale(kk, kk); vapeBox(c, 0, -48, 55, 95, BOXC[(i + r * 3) % 8]); c.restore() } }
    c.globalAlpha = .16; c.fillStyle = '#fff'; [[-60, 120], [180, 70], [420, 150]].forEach(([dx, w]) => poly(c, [220 + dx, wy + 340, 220 + dx + w, wy + 340, 220 + dx + w + 200, wy, 220 + dx + 200, wy])); c.fill();
    c.restore();
    rr(c, 220, wy, 640, 340, 10); stroke(c, '#94a3b8', 6);
    rr(c, 180, 1290, 720, 20, 4); fill(c, '#475569');
    c.restore();
  }
  function shot1(c, t) {
    const kA = ss(K.morph0 + .1, K.morph0 + .7, t);   // ледяная студия → ночной город
    if (kA < 1) iceBg(c, t);
    if (kA > 0) A(c, kA, () => {
      const rise = 260 * (1 - eo(at(t, K.morph0 + .15, K.morph0 + .95)));
      const mx = lp(540, 860, eio(at(t, K.morph0 + .05, K.morph0 + .85))), my = lp(860, 300, eio(at(t, K.morph0 + .05, K.morph0 + .85))), mr = lp(240, 74, eio(at(t, K.morph0 + .05, K.morph0 + .85)));
      nightSky(c, t, { moon: { x: mx, y: my, r: mr }, clouds: true });
      c.save(); c.translate(0, rise); skylineLayer(c, 3, 1320, 380, 900, '#16213d', .45, '#fde68a', t); c.restore();
      c.save(); c.translate(0, rise * 1.4); skylineLayer(c, 11, 1320, 220, 560, '#1d2a4a', .7, '#fde68a', t); c.restore();
      street(c, t); lamp(c, 100, 1316, 560); stele24(c, 975, 1316, t);
    });
    // одноразка и «?» гаснут прямо на месте
    const kv = 1 - ss(K.morph0 + .05, K.morph0 + .5, t);
    if (kv > 0) {
      disposable(c, VP.x, VP.y, { a: kv });
      const kq = bo(at(t, .7, 1.25)); qIce(c, 540, lp(640, 470, kq), lp(.2, 1, kq), Math.min(kq, 1) * kv, Math.sin(t * 2.2) * .06);
    }
    confetti(c, t, .72, 540, 600);
    // колпачок: подлёт (бо) → падение и рост в крышу
    const kp = bo(at(t, .5, 1.3)), kf = eio(at(t, K.morph0 + .1, K.morph0 + .75));
    const cy = lp(lp(585, 340, kp), 680, kf), cw = lp(140, 780, kf), ch = lp(95, 110, kf);
    const kr = spr(at(t, K.morph0 + .65, K.morph0 + 1.3));
    if (kA > .2) { bush(c, 140, 1250, .9, bo(at(t, K.shopBox + .2, K.shopBox + .6))); bush(c, 940, 1250, .9, bo(at(t, K.shopBox + .3, K.shopBox + .7))) }
    shop(c, t, kr, cw, ch, cy);
    capShape(c, 540, cy, cw, ch, { k: ss(.3, 1, kf) });
    if (kA > 0) vignette(c, .45 * kA);
  }
