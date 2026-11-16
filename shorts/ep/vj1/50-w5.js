  // ================= мир 5: школа в разрезе → стол с уликами → клешня → бак → счётчик доли → волна одноразок =================
  let W5K = null, T5 = {}, TSW = 0, SHARD = null, SHC = null;
  const BIN = { x: 1500, y: 2760 }, CNT = { x: 1500, y: 2140 }, BAG = { x: 760, y: 2520 };
  function w5Init() {
    const p = PH; T5 = { par: Wd('парят'), pyat: Wd('пять'), shk: Wd('школьников'), zap: Wd('запрещают'), dir: Wd('директор'), uh: Wd('уходит'), isk: Wd('исков'), tys: Wd('тысячи', 1),
      prik: Wd('приказывают'), ubr: Wd('убрать'), ryn: Wd('рынка', 1), dz: Wd('двенадцать', 1), tep: Wd('теперь'), pol: Wd('полумиллиарда'), mesto: Wd('место'), zan: Wd('занимают'), odn: Wd('одноразки') };
    TSW = T5.odn + .55;
    W5K = [KY(TC1, 540, 920, .86), KY(p[17].b, 540, 900, 1.0), KY(p[18].a - .05, 545, 1150, .98), KY(p[18].a + .55, 560, 2250, 1.0), KY(p[18].b, 600, 2350, 1.02), KY(p[19].a + .3, 740, 2330, 1.0),
      KY(p[19].a + 1.3, 1050, 2300, .92), KY(p[19].b, 1480, 2450, .9), KY(p[20].a + .3, 1500, 2190, 1.15), KY(p[20].b, 1500, 2170, 1.25), KY(p[21].a + .35, 1500, 2520, .9), KY(TSW, 1500, 2560, .86)];
  }
  function schoolW5(c, t) {
    const g = c.createLinearGradient(0, -900, 0, 1500); g.addColorStop(0, '#0b1124'); g.addColorStop(1, '#1e2650'); c.fillStyle = g; c.fillRect(-1200, -900, 4000, 2400);
    glow(c, 880, 170, 220, '#cfe8ff', .18); circ(c, 880, 170, 62, '#eef2f7');
    for (let i = 0; i < 9; i++) { const x = -700 + i * 330, h = 300 + H1(i * 4) * 380; c.fillStyle = '#161b38'; c.fillRect(x, 1450 - h, 260, h + 10); for (let j = 0; j < 8; j++) { if (H1(i * 9 + j) < .5) continue; c.fillStyle = 'rgba(255,212,121,.25)'; c.fillRect(x + 30 + (j % 3) * 70, 1450 - h + 40 + Math.floor(j / 3) * 80, 30, 40) } }
    // здание школы, разрез по диагонали (#076)
    const X0 = 170, X1 = 910, Y0 = 560, FL = 222, cut = y => lp(380, 910, (1450 - y) / (1450 - Y0));
    c.fillStyle = '#2a2f55'; c.fillRect(X0, Y0, X1 - X0, 1450 - Y0); tx(c, 'ШКОЛА', 540, Y0 - 44, { f: 'U', w: 800, s: 54, c: PJ.ln, ls: 8 }); c.fillStyle = '#3a4066'; c.fillRect(X0 - 20, Y0 - 12, X1 - X0 + 40, 24);
    const red = at(t, T5.par - .2, T5.par + .9);
    for (let f = 0; f < 4; f++) { const yb = 1450 - f * FL, yt = yb - FL;
      c.fillStyle = '#ece4d2'; c.fillRect(X0 + 10, yt + 14, X1 - X0 - 20, FL - 28);
      for (let d = 0; d < 3; d++) { const dx = X0 + 70 + d * 200; rr(c, dx, yb - 70, 120, 16, 4); fill(c, '#8a6b4a'); c.fillStyle = '#1b1f36'; circ(c, dx + 60, yb - 128, 22, '#1b1f36'); rr(c, dx + 36, yb - 108, 48, 46, 14); c.fill();
        const on = H1(f * 7 + d) < .8 ? cl(red * 3 - H1(f * 3 + d * 5) * 2) : 0; if (on > 0) { glow(c, dx + 92, yb - 118, 40, '#ef4444', .7 * on); circ(c, dx + 92, yb - 118, 7, '#ef4444') } }
      c.fillStyle = '#2a2f55'; c.fillRect(X0, yb - 14, X1 - X0, 14) }
    // фасад справа от разреза
    c.beginPath(); c.moveTo(cut(1450), 1450); c.lineTo(X1, 1450); c.lineTo(X1, Y0); c.lineTo(cut(Y0), Y0); c.closePath(); fill(c, '#323864');
    c.save(); c.clip(); for (let f = 0; f < 4; f++) for (let j = 0; j < 7; j++) { const x = X0 + 30 + j * 100, y = 1450 - f * FL - 170; c.fillStyle = H1(f * 5 + j) > .5 ? 'rgba(255,212,121,.55)' : '#1b1f36'; rr(c, x, y, 64, 100, 6); c.fill() } c.restore();
    c.beginPath(); c.moveTo(cut(1450), 1450); c.lineTo(cut(Y0), Y0); lnW(c, 8, PJ.ln);
    c.fillStyle = '#10121f'; c.fillRect(-1200, 1450, 4000, 260);
    // счётчик над школой
    const kc = at(t, T5.pyat - .15, T5.shk + .2); if (kc > 0) { const ka = bo(at(t, T5.pyat - .3, T5.pyat)); c.save(); c.translate(540, 300); c.scale(ka, ka);
      rr(c, -330, -80, 660, 160, 24); fill(c, '#0b1020'); rr(c, -330, -80, 660, 160, 24); lnW(c, 6, '#ef4444'); num(c, fmt(5e6 * eo(kc)), 0, -6, { f: 'J', w: 700, s: 84, c: '#ef4444' }); tx(c, 'ШКОЛЬНИКОВ · 2019', 0, 58, { f: 'M', w: 800, s: 22, c: 'rgba(239,68,68,.85)', ls: 3 }); c.restore() }
  }
  function tableW5(c, t) {
    c.fillStyle = '#2a1c15'; c.fillRect(-1200, 1710, 4000, 2400);
    for (let i = 0; i < 18; i++) { const y = 1760 + i * 120 + H1(i) * 40; c.beginPath(); c.moveTo(-1200, y); c.bezierCurveTo(0, y + 25, 1400, y - 20, 2800, y + 10); lnW(c, 3, 'rgba(12,8,5,.35)') }
    glow(c, 640, 2300, 700, '#ffd479', .1);
    // рельс клешни
    c.fillStyle = '#4b5165'; c.fillRect(300, 1790, 1500, 22); c.fillRect(300, 1790, 22, 60); c.fillRect(1778, 1790, 22, 60);
    // вкусы — под запретом
    [['МАНГО', '#f97316'], ['КРЕМ-БРЮЛЕ', '#d4a373'], ['МЯТА', '#22c55e']].forEach(([lab, col], i) => podJ(c, 230 + i * 170, 2150, .95, col, { lab, lc: PJ.ln, x: at(t, T5.zap - .15 + i * .12, T5.zap + .2 + i * .12) }));
    // табличка «ДИРЕКТОР» падает и уезжает
    const kd = eio(at(t, T5.dir + .1, T5.dir + .45)), ku = ei(at(t, T5.uh - .05, T5.uh + .55));
    c.save(); c.translate(820 + 900 * ku, 2170 + 60 * ku); c.rotate(-Math.PI / 2 * kd * .9 + ku * 1.5); poly(c, [-130, 40, 130, 40, 110, -40, -110, -40]); fill(c, '#3b2a22'); rr(c, -100, -32, 200, 56, 8); fill(c, '#d4b26a'); tx(c, 'ДИРЕКТОР', 0, -2, { f: 'U', w: 800, s: 26, c: PJ.ink }); c.restore();
    // иски — стопка растёт
    const n = Math.floor(28 * eo(at(t, T5.isk - .1, T5.tys + .5)));
    for (let i = 0; i < n; i++) { const y = 2700 - i * 13, dx = (H1(i * 3) - .5) * 30; c.save(); c.translate(380 + dx, y); c.rotate((H1(i) - .5) * .12); rr(c, -150, -10, 300, 20, 3); fill(c, i % 2 ? '#f4f1ea' : '#e8e3d6'); lnW(c, 2, PJ.ink); c.restore() }
    if (n > 0) { const y = 2700 - n * 13 - 40; c.save(); c.translate(380, y); c.rotate(-.04); rr(c, -150, -46, 300, 92, 6); fill(c, '#f4f1ea'); lnW(c, 4, PJ.ink); tx(c, 'ИСК', -60, 0, { f: 'U', w: 800, s: 40, c: PJ.red }); tx(c, '×' + fmt(Math.min(n, 28) * 180), 66, 0, { f: 'J', w: 700, s: 28, c: PJ.ink }); c.restore() }
  }
  function clawPos(t) {   // где клешня и пакет
    const d0 = T5.prik - .1, g0 = d0 + .55, u0 = g0 + .35, m0 = u0 + .45, m1 = T5.ryn + .15, dr = m1 + .05;
    const yl = 1812, yd = BAG.y - 150, kx = eio(at(t, m0, m1)), x = lp(BAG.x, BIN.x, kx);
    let y = yl + (yd - yl) * eo(at(t, d0, g0)) * (1 - eio(at(t, u0, m0)));
    const grip = at(t, g0 - .05, g0 + .15), drop = t > dr; return { x, y, grip, drop, dr, kx };
  }
  function bagW5(c, t, P) {   // «Джул» падает в пакет-улику, пакет едет в клешне
    const kin = eo(at(t, T5.tys + .2, T5.tys + .55)), zip = at(t, T5.tys + .55, T5.tys + .8);
    let x = BAG.x, y = BAG.y; if (P.grip >= 1 && !P.drop) { x = P.x; y = P.y + 150 } else if (P.drop) { const dt = t - P.dr; x = BIN.x; y = Math.min(BIN.y - 40, P.y + 150 + .5 * 3000 * dt * dt) }
    if (P.drop && y >= BIN.y - 40) return;
    c.save(); c.translate(x, y); c.rotate(P.grip >= 1 ? Math.sin(t * 8) * .06 : 0);
    juulDev(c, 0, lp(-420, 10, kin), 230, { ang: lp(-.6, -.12, kin) });
    rr(c, -150, -110, 300, 230, 18); fill(c, 'rgba(220,235,255,.22)'); rr(c, -150, -110, 300, 230, 18); lnW(c, 5, 'rgba(238,242,247,.8)');
    c.fillStyle = mixc('#94a3b8', '#ef4444', zip); c.fillRect(-150, -110, 300 * Math.max(.05, zip), 14);
    rr(c, -120, 54, 150, 40, 6); fill(c, '#fde047'); tx(c, 'УЛИКА', -45, 75, { f: 'U', w: 800, s: 22, c: PJ.ink });
    c.restore();
  }
  function clawW5(c, t, P) {
    c.save(); c.translate(P.x, 1800); rr(c, -60, -20, 120, 50, 10); fill(c, '#5d6479'); lnW(c, 4, PJ.ln);
    c.beginPath(); c.moveTo(0, 30); c.lineTo(0, P.y - 1800 + 40); lnW(c, 8, '#94a3b8'); c.translate(0, P.y - 1800 + 40);
    rr(c, -46, 0, 92, 40, 10); fill(c, '#5d6479'); lnW(c, 4, PJ.ln);
    const op = P.drop ? 1 : 1 - P.grip; [-1, 1].forEach(d => { c.beginPath(); c.moveTo(d * 36, 36); c.lineTo(d * (60 + 40 * op), 100); c.lineTo(d * (30 + 30 * op), 150); lnW(c, 14, '#cbd5e1') });
    c.restore();
  }
  function binW5(c, t) {
    const shk = bump(t, T5.mesto - .1, .9) * Math.sin(t * 60) * 8, burst = at(t, T5.zan - .1, T5.zan + .2);
    c.save(); c.translate(BIN.x + shk, BIN.y);
    poly(c, [-210, -260, 210, -260, 170, 260, -170, 260]); fill(c, '#4b5563'); for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(i * 52, -230); c.lineTo(i * 42, 230); lnW(c, 6, 'rgba(15,23,42,.4)') }
    poly(c, [-210, -260, 210, -260, 170, 260, -170, 260]); lnW(c, 6, PJ.ln);
    c.save(); c.translate(-230, -270); c.rotate(-burst * 1.9); rr(c, 0, -26, 460, 34, 12); fill(c, '#6b7280'); lnW(c, 6, PJ.ln); rr(c, 190, -52, 80, 30, 10); fill(c, '#6b7280'); lnW(c, 5, PJ.ln); c.restore();
    c.restore();
  }
  function counterW5(c, t) {   // барабанный счётчик (#089): 12 800 000 000 → 450 000 000
    const k = bo(at(t, PH[20].a - .2, PH[20].a + .25)); if (k <= 0) return; const u = eio(at(t, T5.tep - .1, T5.pol + .3));
    c.save(); c.translate(CNT.x, CNT.y); c.scale(k, k);
    tx(c, 'ДОЛЯ «МАЛЬБОРО» В «ДЖУЛЕ»', 0, -150, { f: 'U', w: 800, s: 34, c: PJ.ln });
    rr(c, -440, -90, 880, 180, 24); fill(c, '#0b1020'); rr(c, -440, -90, 880, 180, 24); lnW(c, 7, mixc(PJ.ln, '#ef4444', u));
    const v0 = 12.8e9, v1 = .45e9, s0 = '$' + fmt(v0), s1 = ('$' + fmt(v1)).padStart(s0.length, ' ');
    c.save(); rr(c, -430, -80, 860, 160, 20); c.clip(); const fs = 76, dw = 48;
    for (let i = 0; i < s0.length; i++) { const a = s0[i], b = s1[i], x = -((s0.length - 1) * dw) / 2 + i * dw, kk = cl(u * 1.6 - i * .04);
      if (a === b || a === ' ' && b === ' ') { tx(c, a, x, 4, { f: 'J', w: 700, s: fs, c: mixc('#7ee787', '#ef4444', u) }); continue }
      const y = -170 * eio(kk); tx(c, a, x, 4 + y, { f: 'J', w: 700, s: fs, c: '#7ee787' }); tx(c, b, x, 4 + y + 170, { f: 'J', w: 700, s: fs, c: '#ef4444' }) }
    c.restore(); c.restore();
  }
  function waveScr(c, t, yC, seed) {   // волна одноразок в экранных координатах: гребень на yC, ниже — вода с одноразками
    if (yC > 2050) return; const crest = x => yC + 34 * Math.sin(x / 150 + t * 6) + 18 * Math.sin(x / 61 - t * 9);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    c.beginPath(); c.moveTo(-20, 2100); for (let x = -20; x <= 1100; x += 20) c.lineTo(x, crest(x)); c.lineTo(1100, 2100); c.closePath(); fill(c, '#3466ad'); c.save(); c.clip();
    c.fillStyle = '#4a86cf'; c.beginPath(); for (let x = -20; x <= 1100; x += 20) c.lineTo(x, crest(x) + 260); c.lineTo(1100, 2100); c.lineTo(-20, 2100); c.closePath(); c.fill();
    const cols = ['#f97316', '#ec4899', '#eab308', '#84cc16', '#22c55e', '#a855f7', '#38bdf8'];
    for (let i = 0; i < 60; i++) { const x = H1(i * 2.3 + seed) * 1100, y = crest(x) + 60 + H1(i * 5.1) * 1900; if (y > 2050) continue;
      c.save(); c.translate(x + Math.sin(t * 3 + i) * 20, y); c.rotate(t * (2 + H1(i) * 3) * (i % 2 ? 1 : -1)); rr(c, -22, -60, 44, 120, 14); fill(c, cols[i % 7]); lnW(c, 5, PJ.ink); rr(c, -14, -82, 28, 26, 8); fill(c, PJ.ln); c.restore() }
    c.restore();
    c.beginPath(); for (let x = -20; x <= 1100; x += 20) { const y = crest(x); if (x === -20) c.moveTo(x, y); else c.lineTo(x, y) } lnW(c, 26, '#f4f8ff');
    for (let i = 0; i < 7; i++) { const x = -60 + i * 190 + ((t * 120) % 190), y = crest(x); c.beginPath(); c.arc(x + 40, y - 36, 62, Math.PI * .1, Math.PI * 1.15); lnW(c, 14, '#f4f8ff'); circ(c, x - 18, y - 20, 14, '#f4f8ff') }
    c.restore();
  }
  function drawW5(c, t, q) {
    c.fillStyle = '#0b1124'; c.fillRect(0, 0, WW, HH); c.save(); applyCam(c, q); const v = viewRect(q);
    if (v.y0 < 1710) schoolW5(c, t); if (v.y1 > 1710) { tableW5(c, t); const P = clawPos(t); binW5(c, t); bagW5(c, t, P); clawW5(c, t, P); counterW5(c, t) }
    c.restore();
  }
  function shotW5(c, t) {
    if (!W5K) w5Init(); const q = camOf(W5K, t); drawW5(c, t, q);
    if (t >= T5.zan - .3) waveScr(c, t, lp(2150, -260, eio(at(t, T5.zan - .2, TSW))), 0);
  }
  // осколки табло: кадр мира 4 на TC1 бьётся на куски и падает, под ним — мир 5
  function shards(c, t) {
    if (!SHC) { SHC = mk(WW, HH); const g = SHC.getContext('2d'); const q = camOf(W4K, TC1); drawW4(g, TC1, q); hud(g, TC1 - .01) }
    if (!SHARD) { const q = camOf(W4K, TC1), [cx, cy] = toScr(q, BIG.x + 180, BIG.y - 40); SHARD = []; const n = 9;
      for (let i = 0; i < n; i++) { const a0 = i * TAU / n + .3 + (H1(i) - .5) * .3, a1 = (i + 1) * TAU / n + .3 + (H1(i + 1) - .5) * .3, r1 = 260 + H1(i * 3) * 160, R = 3000;
        const p1 = [cx, cy, cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1, cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1];
        const p2 = [cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1, cx + Math.cos(a0) * R, cy + Math.sin(a0) * R, cx + Math.cos(a1) * R, cy + Math.sin(a1) * R, cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1];
        [p1, p2].forEach((P, j) => { let mx = 0, my = 0; const m = P.length / 2; for (let k = 0; k < P.length; k += 2) { mx += P[k] / m; my += P[k + 1] / m }
          SHARD.push({ P, mx, my, d: Math.hypot(mx - cx, my - cy) * .00025 + j * .05, vx: (mx - cx) * .6, rot: (H1(i * 5 + j) - .5) * 4 }) }) } }
    const dt = t - TC1; c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    SHARD.forEach(s => { const u = Math.max(0, dt - s.d); if (u > 1.4) return; const dy = .5 * 5200 * u * u, dx = s.vx * u;
      c.save(); c.translate(s.mx + dx, s.my + dy); c.rotate(s.rot * u); c.translate(-s.mx, -s.my); poly(c, s.P); c.save(); c.clip(); c.drawImage(SHC, 0, 0); c.restore(); poly(c, s.P); lnW(c, 3, 'rgba(255,255,255,.7)'); c.restore() });
    c.restore();
  }
