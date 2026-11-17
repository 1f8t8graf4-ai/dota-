  // ================= блок 1 (0–7,5 с): глыба льда → лёд разлетается → мундштук становится крышей (Starbucks #011) → ночной город → неоновая снежинка → эмблема на 180° в купол Капитолия (#019) =================
  const VB = { x0: 425, x1: 655, y0: 520, y1: 1240 }, VM = { x0: 470, x1: 610, y0: 430, y1: 520 }, ICE = { x: 280, y: 380, w: 520, h: 920 }, GR1 = 1300;
  const SIGN = { x: 540, y: 432, r: 95 }, EM = { x: 540, y: 960, r: 360 };   // неоновая вывеска (мир) и эмблема (экран)
  let T1 = null, K1 = null, SH1 = null, CR1 = null, CF1 = null;
  function b1Init() {
    T1 = { cr: .5, sh: 1.8, up: 1.86, hang: 2.27, back: 2.64, land: 3.0, sq: 3.4, grow: 3.95, sign: Wd('продают') - .05, neon: Wd('вейпы') - .15, dive: 5.25,
      sw0: 6.05, peak: 6.42, rot0: 6.3, rot1: 7.05, sw1: 7.45, end: 7.5 };
    K1 = [KY(0, 540, 900, 1), KY(1.7, 540, 880, 1.06), KY(2.25, 540, 790, 1.02), KY(3.05, 540, 880, 1), KY(3.6, 545, 900, .94), KY(4.5, 565, 860, .82),
      KY(5.15, 548, 700, 1.0), KY(5.6, 541, 470, 2.3), KY(6.15, 540, 436, 3.7), KY(7.5, 540, 432, 3.84)];
    // осколки: сетка 4×6 с неровными узлами
    const nx = 4, ny = 6, P = [];
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) { const e = i === 0 || i === nx, f = j === 0 || j === ny; P.push([ICE.x + ICE.w * i / nx + (e ? 0 : (H1(i * 7 + j) - .5) * 70), ICE.y + ICE.h * j / ny + (f ? 0 : (H1(i + j * 9) - .5) * 80)]) }
    SH1 = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const p = [P[j * (nx + 1) + i], P[j * (nx + 1) + i + 1], P[(j + 1) * (nx + 1) + i + 1], P[(j + 1) * (nx + 1) + i]], cx = p.reduce((s, q) => s + q[0], 0) / 4, cy = p.reduce((s, q) => s + q[1], 0) / 4;
      const dx = cx - 540, dy = cy - 860, d = Math.hypot(dx, dy) || 1, sp = 900 + H1(i * 3 + j) * 700;
      SH1.push({ cx, cy, pts: p.flatMap(q => [q[0] - cx, q[1] - cy]), vx: dx / d * sp, vy: dy / d * sp - 500 - H1(j + i * 5) * 400, w: (H1(i + j * 2) - .5) * 9 });
    }
    // трещины: 7 веток от точки удара
    CR1 = []; for (let b = 0; b < 7; b++) { let x = 660, y = 610, a = b * TAU / 7 + .3; const seg = [[x, y]]; for (let s = 0; s < 6; s++) { a += (H1(b * 11 + s) - .5) * .9; x += Math.cos(a) * (60 + H1(b + s * 3) * 50); y += Math.sin(a) * (60 + H1(b * 5 + s) * 50); seg.push([cl(x, ICE.x + 8, ICE.x + ICE.w - 8), cl(y, ICE.y + 8, ICE.y + ICE.h - 8)]) } CR1.push(seg) }
    CF1 = []; for (let i = 0; i < 22; i++) { const a = -Math.PI / 2 + (H1(i * 4.1) - .5) * 2.6, v = 600 + H1(i * 2.3) * 700; CF1.push({ vx: Math.cos(a) * v, vy: Math.sin(a) * v, col: [B2.ice, B2.mango, B2.teal, B2.ln, B2.coral][i % 5], s: 10 + H1(i) * 12, w: (H1(i * 9) - .5) * 14 }) }
  }
  // корпус одноразки (x0..x1, y0..y1): манго с косой голубой заливкой (как фиолетовая заливка стакана у Боба), полоса МАНГО-ЛЁД
  function vapeBody(c, x0, x1, y0, y1, k = 0) {   // k — сплющивание в коробку (надпись уходит)
    const w = x1 - x0, h = y1 - y0, r = lp(46, 10, k);
    rr(c, x0, y0, w, h, r); c.save(); c.fillStyle = B2.mango; c.fill(); c.clip();
    poly(c, [x0 - 10, y0 + h * .48, x1 + 10, y0 + h * .26, x1 + 10, y1 + 10, x0 - 10, y1 + 10]); fill(c, B2.ice2);
    c.fillStyle = 'rgba(20,23,51,.28)'; c.fillRect(x0 + w * .75, y0 - 4, w * .25 + 8, h + 8);
    rr(c, x0 + w * .08, y0 + h * .08, Math.max(6, w * .1), h * .8, 20); fill(c, 'rgba(255,255,255,.35)');
    if (k < .6) A(c, 1 - k / .6, () => { c.fillStyle = B2.navy; c.fillRect(x0, y0 + h * .4, w, h * .14); tx(c, 'МАНГО-ЛЁД', (x0 + x1) / 2, y0 + h * .47, { f: 'U', w: 800, s: 34, c: B2.cream, mw: w - 24 }) });
    c.restore(); rr(c, x0, y0, w, h, r); lnB(c, 4);
  }
  function mouth(c, b) {   // мундштук-трапеция → плоская крыша (b — рамка)
    const w = b.x1 - b.x0, nar = Math.max(0, (b.nar ?? .18)) * w;
    poly(c, [b.x0, b.y1, b.x1, b.y1, b.x1 - nar, b.y0, b.x0 + nar, b.y0]); cel(c, b.x0, b.y0, w, b.y1 - b.y0, '#2a2f55', { hw: .08 });
    poly(c, [b.x0, b.y1, b.x1, b.y1, b.x1 - nar, b.y0, b.x0 + nar, b.y0]); lnB(c, 4);
    if (b.snow > 0) { c.beginPath(); c.moveTo(b.x0 - 6, b.y0 + 4); for (let i = 0; i <= 14; i++) { const x = lp(b.x0 - 6, b.x1 + 6, i / 14); c.lineTo(x, b.y0 - 6 - b.snow * (16 + 12 * Math.sin(i * 1.9))) } c.lineTo(b.x1 + 6, b.y0 + 4); c.closePath(); fill(c, B2.cream); lnB(c, 3) }
  }
  function iceBlock(c, t) {
    const { x, y, w, h } = ICE; rr(c, x, y, w, h, 18); c.save(); c.fillStyle = 'rgba(189,231,246,.42)'; c.fill(); c.clip();
    c.fillStyle = 'rgba(124,196,224,.42)'; c.fillRect(x + w * .75, y, w * .25, h);
    rr(c, x + w * .06, y + 40, 46, h - 80, 23); fill(c, 'rgba(255,255,255,.28)');
    glint(c, x, y, w, h, .14);
    for (let i = 0; i < 26; i++) ring(c, x + 40 + H1(i * 3.3) * (w - 80), y + 60 + H1(i * 7.7) * (h - 120) - (t * 14 * (1 + H1(i))) % 80, 3 + H1(i) * 6, 'rgba(255,255,255,.55)', 2);
    c.beginPath(); c.moveTo(x, y + 140); c.lineTo(x + 140, y); c.moveTo(x + w, y + h - 160); c.lineTo(x + w - 160, y + h); lnB(c, 3, 'rgba(255,255,255,.6)');
    const kc = at(t, T1.cr, T1.sh - .05);   // трещины растут
    if (kc > 0) CR1.forEach((seg, b) => { const n = (seg.length - 1) * eo(cl(kc * 1.25 - b * .05)); if (n <= 0) return; c.beginPath(); c.moveTo(seg[0][0], seg[0][1]); for (let s = 1; s <= Math.ceil(n); s++) { const u = Math.min(1, n - s + 1); c.lineTo(lp(seg[s - 1][0], seg[s][0], u), lp(seg[s - 1][1], seg[s][1], u)) } lnB(c, 4, '#ffffff') });
    c.restore(); rr(c, x, y, w, h, 18); lnB(c, 5, '#e8f7fd');
    c.beginPath(); for (let i = 0; i < 9; i++) { const xx = x + 20 + i * (w - 40) / 8; c.moveTo(xx, y); c.lineTo(xx + 6, y + 18 + H1(i) * 26) } lnB(c, 3, '#ffffff');   // сосульки инея сверху
  }
  // ночной город: 3 слоя (дальние силуэты, средние дома, передние фонари) — поднимаются снизу
  function city1(c, q, t) {
    const k0 = eo(at(t, T1.sq + .1, T1.grow + .45)), k1 = eo(at(t, T1.sq + .25, T1.grow + .6)), k2 = eo(at(t, T1.sq, T1.grow + .2));
    if (k0 > 0) layer(c, q, .45, cc => { cc.translate(540 * .45 - 540, 960 * .45 - 960); cc.translate(0, 700 * (1 - k0));
      let x = -700, i = 0; while (x < 1800) { const w = 90 + H1(i * 3.1) * 120, h = 380 + H1(i * 5.3) * 520; cc.fillStyle = B2.bg2; cc.fillRect(x, 1300 - h, w + 2, h + 400); if (H1(i * 2.7) > .55) cc.fillRect(x + w * .42, 1300 - h - 70, 8, 72); x += w; i++ } });
    if (k1 > 0) layer(c, q, .72, cc => { cc.translate(540 * .72 - 540, 960 * .72 - 960); cc.translate(0, 700 * (1 - k1));
      let x = -500, i = 0; while (x < 1600) { const w = 120 + H1(i * 4.7) * 110, h = 250 + H1(i * 6.1) * 330; if (x > 150 && x < 820) { x += w; i++; continue }
        rr(cc, x, 1300 - h, w, h + 300, 4); cel(cc, x, 1300 - h, w, h, B2.bg3, { hi: false, sw: .3 });
        for (let r = 0; r < Math.floor(h / 60); r++) for (let s = 0; s < Math.floor((w - 24) / 34); s++) if (H1(i * 13 + r * 5 + s) < .3) { cc.fillStyle = H1(i + r + s * 7) > .4 ? '#f4a261' : '#fde68a'; cc.fillRect(x + 16 + s * 34, 1300 - h + 30 + r * 60, 16, 22) }
        x += w + 10; i++ } });
    // дорога и машины (основной план)
    if (k2 > 0) { c.save(); c.translate(0, 300 * (1 - k2)); c.fillStyle = '#191c33'; c.fillRect(-900, GR1, 2900, 900); c.fillStyle = '#2a2e4f'; c.fillRect(-900, GR1, 2900, 26);
      c.beginPath(); c.moveTo(-900, GR1); c.lineTo(2000, GR1); lnB(c, 4);
      for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(238,241,248,.5)'; c.fillRect(-900 + i * 220 - (t * 60) % 220, 1420, 110, 8) }
      [[0, 1, B2.red], [.45, -1, B2.teal], [.8, 1, B2.ind]].forEach(([ph, dir, col], i) => { const u = ((t - T1.grow) * .16 + ph) % 1, x = dir > 0 ? lp(-500, 1600, u) : lp(1600, -500, u), y = dir > 0 ? 1460 : 1380; car1(c, x, y, dir, col) });
      c.restore() }
  }
  function car1(c, x, y, dir, col) {
    c.save(); c.translate(x, y); c.scale(dir, 1);
    beam(c, 120, -14, 420, 0, 8, 60, '#fde68a', .22);
    rr(c, -120, -50, 240, 52, 16); cel(c, -120, -50, 240, 52, col, { hw: .06 }); rr(c, -70, -88, 130, 44, 14); cel(c, -70, -88, 130, 44, shd(col, .1), { hi: false });
    c.fillStyle = '#9fd7ef'; c.fillRect(-56, -80, 50, 28); c.fillRect(4, -80, 46, 28);
    circ(c, -70, 4, 22, B2.ink); circ(c, 70, 4, 22, B2.ink); circ(c, -70, 4, 9, B2.steel); circ(c, 70, 4, 9, B2.steel); circ(c, 116, -30, 8, '#fde68a');
    c.restore();
  }
  function drifts(c, t) {   // сугробы выпрыгивают пружиной, как кусты у Боба
    [[200, 1, 0], [880, -1, .12]].forEach(([x, s, d]) => { const k = spr(at(t, T1.grow - .1 + d, T1.grow + .65 + d)); if (k <= 0) return;
      c.save(); c.translate(x, GR1); c.scale(k * s, k); [[-70, -20, 46], [-20, -38, 58], [42, -24, 44], [90, -12, 30]].forEach(([dx, dy, r]) => { c.beginPath(); c.arc(dx, dy, r, Math.PI, 0); c.closePath(); cel(c, dx - r, dy - r, r * 2, r, B2.cream, { sw: .3, hi: false }) });
      c.beginPath(); c.moveTo(-130, 0); c.lineTo(130, 0); lnB(c, 4); c.restore() });
  }
  function store1(c, t, b, kg) {   // магазин растёт из коробки b; kg — 0…1
    const w = b.x1 - b.x0, h = b.y1 - b.y0;
    rr(c, b.x0, b.y0, w, h, 6); cel(c, b.x0, b.y0, w, h, '#33386a', { hw: .05, gr: .08 }); rr(c, b.x0, b.y0, w, h, 6); lnB(c, 4);
    if (kg <= 0) return; c.save(); c.beginPath(); c.rect(b.x0, b.y0, w, h); c.clip();
    const top = b.y0, ws = [[b.x0 + 40, 250], [b.x0 + 330, 250]];
    ws.forEach(([wx, ww], i) => { const wy = GR1 - 330; rr(c, wx, wy, ww, 230, 6); fill(c, '#1b1f3d');
      for (let s = 0; s < 4; s++) for (let r = 0; r < 2; r++) { rr(c, wx + 22 + s * 56, wy + 50 + r * 86, 30, 62, 9); fill(c, [B2.mango, B2.ice2, B2.teal, B2.coral][(s + r + i) % 4]) }
      c.save(); rr(c, wx, wy, ww, 230, 6); c.clip(); glint(c, wx, wy, ww, 230, .16); c.restore(); rr(c, wx, wy, ww, 230, 6); lnB(c, 4);
      for (let s = 0; s < 5; s++) { c.beginPath(); c.moveTo(wx - 6 + s * (ww + 12) / 5, wy - 50); c.lineTo(wx - 6 + (s + 1) * (ww + 12) / 5, wy - 50); c.arc(wx - 6 + (s + .5) * (ww + 12) / 5, wy - 50, (ww + 12) / 10, 0, Math.PI); c.closePath(); fill(c, s % 2 ? B2.cream : B2.red); lnB(c, 3) } });
    rr(c, b.x0 + 590 - 4, GR1 - 300, 4, 300, 2); fill(c, B2.ln);
    c.restore();
    const ks = spr(at(t, T1.sign - .1, T1.sign + .55)); if (ks > 0) { c.save(); c.translate(540, top + 70); c.scale(ks, ks); rr(c, -230, -46, 460, 92, 10); fill(c, B2.ink); rr(c, -230, -46, 460, 92, 10); lnB(c, 4);
      tx(c, 'ВЕЙПЫ 24/7', 0, 3, { f: 'U', w: 800, s: 54, c: B2.teal, ls: 2 }); c.restore() }
  }
  const neonOn = t => at(t, T1.neon, T1.neon + .08) * (t < T1.neon + .35 ? (Math.sin(t * 90) > -.2 ? 1 : .35) : 1);
  function neonSign(c, t, x, y, r, roof) {   // круглая неоновая вывеска на крыше (рисунок — тот же, что у эмблемы при k = 0)
    c.fillStyle = '#2a2f55'; c.fillRect(x - 6, y + r - 4, 12, roof - y - r + 8); c.fillRect(x - 50, roof - 10, 100, 10);
    emblem(c, t, 0, x, y, r);
  }
  function b1World(c, q, t) {
    c.fillStyle = B2.bg; c.fillRect(-2000, -2000, 5000, 5000);
    const kStore = at(t, T1.land, T1.land + .05);
    if (kStore <= 0) { [[150, 300], [800, 420], [120, 1080], [860, 960], [770, 1160], [210, 640]].forEach(([x, y]) => bricks(c, x, y, 1)); c.beginPath(); c.moveTo(250, GR1 + 4); c.lineTo(830, GR1 + 4); lnB(c, 4) }
    city1(c, q, t);
    const hop = t < T1.sh ? 0 : t < T1.sh + .22 ? -70 * Math.sin(Math.PI * at(t, T1.sh, T1.sh + .22)) : 60 * eo(at(t, T1.sh + .22, T1.sh + .42)) - (t > T1.sh + .42 && t < T1.sh + .6 ? 14 * Math.sin(Math.PI * at(t, T1.sh + .42, T1.sh + .6)) : 0);
    const ksq = bo(at(t, T1.land, T1.sq)), kg = eo(at(t, T1.sq, T1.grow));
    // корпус → коробка → магазин
    const bx0 = lp(VB.x0, 230, ksq), bx1 = lp(VB.x1, 850, ksq), by0 = lp(lp(VB.y0 + 60, 1010, ksq), 640, kg);
    const yb = t < T1.sh ? 0 : hop;
    // мундштук: подлетает, висит, падает назад, сплющивается в крышу
    let mo = 0, mr = 0; if (t >= T1.up && t < T1.land) { const u = at(t, T1.up, T1.hang), d = at(t, T1.back, T1.land); mo = -330 * eo(u) + 330 * ei(d) + (t > T1.hang && t < T1.back ? 10 * Math.sin((t - T1.hang) * 14) : 0); mr = .32 * Math.sin(Math.PI * cl(u * .9 + d * .1)) * (1 - d) }
    if (t < T1.land) {
      if (t >= T1.up) { const kq = bo(at(t, T1.up + .1, T1.hang + .05)) * (1 - ei(at(t, T1.back, T1.back + .25))); if (kq > 0) { c.save(); c.translate(540, VB.y0 + 60 + yb - 40 - 200 * kq); c.scale(kq, kq); tx(c, '?', 0, 0, { f: 'M', w: 800, s: 300, c: B2.bg, sw: 9, sc: B2.ln }); c.restore() } }
      vapeBody(c, VB.x0, VB.x1, VB.y0 + yb, VB.y1 + yb, 0);
      c.save(); c.translate(540, VM.y1 + yb + mo); c.rotate(mr); mouth(c, { x0: VM.x0 - 540, x1: VM.x1 - 540, y0: VM.y0 - VM.y1, y1: 0 }); c.restore();
    } else {
      if (kg <= 0) vapeBody(c, bx0, bx1, by0, GR1, ksq); else store1(c, t, { x0: bx0, x1: bx1, y0: by0, y1: GR1 }, kg);
      const rb = { x0: lp(VM.x0, 190, ksq), x1: lp(VM.x1, 890, ksq), y0: by0 - lp(VM.y1 - VM.y0, 44, ksq), y1: by0, nar: lp(.18, .02, ksq), snow: ksq };
      mouth(c, rb);
      const kn = spr(at(t, T1.grow - .05, T1.grow + .5)); if (kn > 0) { c.save(); c.translate(SIGN.x, rb.y0); c.scale(kn, kn); c.translate(-SIGN.x, -rb.y0); neonSign(c, t, SIGN.x, SIGN.y, SIGN.r, rb.y0); c.restore() }
    }
    drifts(c, t);
    if (t < T1.sh + .9) iceOrShards(c, t);
    // конфетти из горлышка (тормозят в воздухе)
    if (t > T1.up + .05 && t < T1.land + .6) CF1.forEach((p, i) => { const u = t - T1.up - .05, d = 4, f = (1 - Math.exp(-d * u)) / d, x = 540 + p.vx * f, y = VB.y0 + p.vy * f + 90 * u * u, a = 1 - at(t, T1.land, T1.land + .6);
      c.save(); c.translate(x, y); c.rotate(p.w * u); c.globalAlpha *= a; c.fillStyle = p.col; c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore() });
  }
  function iceOrShards(c, t) {
    if (t < T1.sh) { iceBlock(c, t); return }
    const u = t - T1.sh; SH1.forEach(s => { const x = s.cx + s.vx * u, y = s.cy + s.vy * u + 1500 * u * u; if (y > 2600) return;
      c.save(); c.translate(x, y); c.rotate(s.w * u); c.scale(1 - .3 * cl(u), 1 - .3 * cl(u)); shard(c, s.pts, 'rgba(189,231,246,.75)', '#ffffff'); c.restore() });
    if (u < .12) { c.save(); c.globalAlpha = 1 - u / .12; flake(c, 660, 610, 160 * (1 + u * 6), '#ffffff', 5); c.restore() }
  }
  // вихрь колец (#019): три толстых дуги вокруг эмблемы; на пике закрывают весь экран
  function swirl(c, t) {   // вихрь колец (#019): три толстых кольца вокруг эмблемы; на пике закрывают весь экран, потом улетают наружу
    const kin = eio(at(t, T1.sw0, T1.peak)), kout = eio(at(t, T1.peak + .55, T1.sw1)); if (kin <= 0 || kout >= 1) return;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    [[B2.teal, 0, 1], [B2.red, 2.1, -1], [B2.navy, 4.2, 1]].forEach(([col, ph, dir], i) => {
      const ri = EM.r + 6 + i * 365 + 1300 * kout, ro = ri + 372, span = TAU * Math.min(1, kin * 1.15 + .02), a0 = ph + dir * t * 3.2;
      c.beginPath(); if (span >= TAU) { c.arc(EM.x, EM.y, ro, 0, TAU); c.arc(EM.x, EM.y, ri, TAU, 0, true) } else { c.arc(EM.x, EM.y, ro, a0, a0 + span); c.arc(EM.x, EM.y, ri, a0 + span, a0, true) } c.closePath(); fill(c, col);
    });
    c.restore();
  }
  function emblem(c, t, k, x, y, R) {   // k: 0 — неоновая снежинка, 1 — купол со звездой; поворот в плоскости на 180° (#019)
    const on = neonOn(t), kf = 1 - ss(.3, .55, k), kd = ss(.45, .7, k), col = mixc(mixc('#3b5b7a', '#bfefff', on), B2.red, ss(.35, .65, k));
    c.save(); c.translate(x, y); c.rotate(Math.PI * k); c.scale(R / 95, R / 95);
    circ(c, 0, 0, 95, B2.ink); if (on > 0 && k < .5) glow(c, 0, 0, 190, '#7dd3fc', .35 * on * (1 - 2 * k));
    ring(c, 0, 0, 87, col, 7); if (k > 0) ring(c, 0, 0, 78, col, 2.5 * ss(.4, .7, k));
    if (kf > 0) flake(c, 0, 0, 95 * .62 * kf, mixc('#3b5b7a', '#e0f7ff', on), 6 * kf + .5);
    if (kd > 0) { c.save(); c.rotate(Math.PI); c.scale(kd, kd); domePath(c, 0, 34, .16); lnB(c, 3.2, B2.red); star(c, 0, -36, 9, B2.gold); c.restore() }
    ring(c, 0, 0, 95, B2.ln, 3); c.restore();
  }
  function b1Shot(c, t) {
    if (!T1) b1Init(); const q = camObj(camAt(K1, t));
    if (t > T1.sh && t < T1.sh + .5) { const s = 18 * (1 - at(t, T1.sh, T1.sh + .5)); q.x += Math.sin(t * 97) * s; q.y += Math.cos(t * 83) * s }
    if (t < T1.peak + .05) { c.save(); c.translate(540, 960); c.rotate(q.r); c.scale(q.z, q.z); c.translate(-q.x, -q.y); b1World(c, q, t); c.restore(); snow3(c, q, t, 1 - at(t, T1.dive, T1.dive + .6)) }
    else bgSplit(c, B2.bg, B2.bg2, 540, 960, -1.05);
    if (t > T1.sw0 - .02) { const ex = 540 + (SIGN.x - q.x) * q.z, ey = 960 + (SIGN.y - q.y) * q.z, er = SIGN.r * q.z; EM.x = ex; EM.y = ey; EM.r = er; swirl(c, t); emblem(c, t, eio(at(t, T1.rot0, T1.rot1)), ex, ey, er) }
  }
