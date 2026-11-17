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
  // ---------- v2 (ТЗ 3А, блок 6): суд и биржа — гильотина рубит вкусы, кресло ГЕНДИРЕКТОР катапультируется, башня исков, штамп ЗАПРЕТ FDA, небоскрёб 12,8 млрд рушится до 450 млн ----------
  const GU = { x: 560, cut: 2330, top: 2250, st: 2450 }, CHR = { x: 980, y: 2700 }, SUIT = { x: 1170, y: 2700 }, SKY = { x: 1500, y: 2700, w: 360, h: 1050 };
  function floorW5(c, t, v) {
    c.fillStyle = '#20243f'; c.fillRect(v.x0 - 10, 1710, v.x1 - v.x0 + 20, 1000); for (let i = 0; i < 12; i++) { c.fillStyle = i % 2 ? '#262b4a' : '#232744'; c.fillRect(-400 + i * 260, 1710, 260, 990) }
    poly(c, [-400, 2400, 300, 1710, 700, 1710, 0, 2400]); fill(c, 'rgba(255,255,255,.035)');
    c.fillStyle = '#3a2a22'; c.fillRect(v.x0 - 10, CHR.y, v.x1 - v.x0 + 20, 600); c.beginPath(); c.moveTo(-400, CHR.y); c.lineTo(2600, CHR.y); lnB(c, 4, '#c9a27e');
  }
  function guillotineW5(c, t) {
    const dk = ei(at(t, T5.zap - .15, T5.zap + .02)), cut = t >= T5.zap + .02;
    [[GU.x - 260], [GU.x + 260]].forEach(([x]) => { rr(c, x - 22, 1820, 44, 880, 6); cel(c, x - 22, 1820, 44, 880, B2.wood, { hw: .15 }); rr(c, x - 22, 1820, 44, 880, 6); lnB(c, 3) });
    rr(c, GU.x - 300, 1790, 600, 50, 8); cel(c, GU.x - 300, 1790, 600, 50, B2.wood, { hw: .04 }); rr(c, GU.x - 300, 1790, 600, 50, 8); lnB(c, 3);
    const by = lp(0, GU.cut - 2060, dk); poly(c, [GU.x - 238, 1880 + by, GU.x + 238, 1880 + by, GU.x + 238, 2020 + by, GU.x - 238, 2080 + by]); cel(c, GU.x - 238, 1880 + by, 476, 200, B2.steel, { hw: .05 });
    poly(c, [GU.x - 238, 2080 + by, GU.x + 238, 2020 + by, GU.x + 238, 2000 + by, GU.x - 238, 2060 + by]); fill(c, '#ffffff'); poly(c, [GU.x - 238, 1880 + by, GU.x + 238, 1880 + by, GU.x + 238, 2020 + by, GU.x - 238, 2080 + by]); lnB(c, 3);
    [['МАНГО', B2.mango], ['КРЕМ-БРЮЛЕ', '#e9c38b'], ['МЯТА', B2.mint]].forEach(([lab, col], i) => { const x = GU.x - 140 + i * 140, top = cut ? GU.cut : GU.top;
      rr(c, x - 50, top, 100, GU.st - top, cut ? 4 : 20); cel(c, x - 50, top, 100, GU.st - top, col, { hw: .12 }); if (!cut) { rr(c, x - 50, top, 100, 50, 20); fill(c, '#2d3142') } rr(c, x - 50, top, 100, GU.st - top, cut ? 4 : 20); lnB(c, 3);
      if (cut) { const u = t - T5.zap - .02, d = i - 1; c.save(); c.translate(x + d * 260 * u, GU.cut - 300 * u + 1500 * u * u); c.rotate(d * 3 * u + .4 * u); rr(c, -50, GU.top - GU.cut, 100, GU.cut - GU.top, 20); fill(c, col); rr(c, -50, GU.top - GU.cut, 100, 50, 20); fill(c, '#2d3142'); c.restore();
        for (let j = 0; j < 6; j++) { const a = -Math.PI / 2 + (j - 2.5) * .35; drop(c, x + Math.cos(a) * 520 * u, GU.cut + Math.sin(a) * 620 * u + 1500 * u * u, 10, col, a + Math.PI / 2) } } });
    rr(c, GU.x - 300, GU.st, 600, 70, 8); cel(c, GU.x - 300, GU.st, 600, 70, B2.wood, { hw: .04 }); rr(c, GU.x - 300, GU.st, 600, 70, 8); lnB(c, 3);
    ['МАНГО', 'КРЕМ-БРЮЛЕ', 'МЯТА'].forEach((l, i) => tx(c, l, GU.x - 140 + i * 140, GU.st + 36, { f: 'M', w: 800, s: 20, c: B2.cream, mw: 130 }));
    const kz = bo(at(t, T5.zap + .05, T5.zap + .35)); if (kz > 0) plate(c, 'ВКУСЫ ЗАПРЕЩЕНЫ', GU.x, 1720, kz, { s: 34, bg: B2.red, c: '#fff' });
  }
  function chairW5(c, t) {   // кресло ГЕНДИРЕКТОР: на «уходит» — катапульта
    const u = Math.max(0, t - T5.uh + .05), y = CHR.y - 1400 * u - 0 * u * u, r = u * 5, kp = bo(at(t, T5.dir - .2, T5.dir + .2)); if (kp <= 0 || y < 900) return;
    if (u > 0) for (let i = 0; i < 6; i++) ring(c, CHR.x + (H1(i) - .5) * 140, CHR.y - 20 - u * 200 * H1(i * 3), 20 + 60 * u, rgba('#eef1f8', .7 * (1 - cl(u * 2))), 4);
    c.save(); c.translate(CHR.x, y); c.rotate(r); c.scale(kp, kp);
    rr(c, -90, -330, 180, 210, 30); cel(c, -90, -330, 180, 210, '#3b3f6e', { hw: .1 }); rr(c, -90, -330, 180, 210, 30); lnB(c, 3);
    rr(c, -110, -130, 220, 50, 16); cel(c, -110, -130, 220, 50, '#3b3f6e', { hw: .06 }); rr(c, -110, -130, 220, 50, 16); lnB(c, 3);
    c.fillStyle = '#2c3048'; c.fillRect(-10, -80, 20, 60); c.beginPath(); c.moveTo(-80, -10); c.lineTo(80, -10); lnB(c, 10, '#2c3048'); circ(c, -80, -6, 12, B2.ink); circ(c, 80, -6, 12, B2.ink);
    plate(c, 'ГЕНДИРЕКТОР', 0, -230, 1, { s: 22, bg: B2.gold, c: B2.ink }); c.restore();
  }
  function suitsW5(c, t) {   // башня исков: листы ложатся стопкой
    const k = eio(at(t, T5.isk - .3, T5.tys + .7)), n = Math.floor(22 * k); if (k <= 0) return;
    for (let i = 0; i < n; i++) { const y = SUIT.y - i * 32, dx = (H1(i * 3.3) - .5) * 26; rr(c, SUIT.x - 120 + dx, y - 30, 240, 30, 3); cel(c, SUIT.x - 120 + dx, y - 30, 240, 30, B2.cream, { hw: .03, sw: .15 }); rr(c, SUIT.x - 120 + dx, y - 30, 240, 30, 3); lnB(c, 2, '#c9c1ae') }
    const kp = bo(at(t, T5.tys - .1, T5.tys + .25)); if (kp > 0) { c.save(); c.translate(SUIT.x, SUIT.y - n * 32 - 90); c.scale(kp, kp); rr(c, -190, -58, 380, 116, 14); fill(c, B2.ink); rr(c, -190, -58, 380, 116, 14); lnB(c, 4);
      tx(c, '5 000', 0, -16, { f: 'U', w: 800, s: 50, c: B2.gold }); tx(c, 'СУДЕБНЫХ ИСКОВ', 0, 32, { f: 'M', w: 800, s: 24, c: B2.cream }); c.restore() }
  }
  function skyW5(c, t) {   // небоскрёб «Джула»: 12,8 млрд → рушится до красного обломка 450 млн
    const kc = eio(at(t, T5.tep - .1, T5.pol + .5)), h = lp(SKY.h, 150, kc), sh = kc > 0 && kc < 1 ? Math.sin(t * 70) * 8 : 0, col = mixc('#1fb98a', '#d6334d', ss(.4, 1, kc)), x0 = SKY.x - SKY.w / 2 + sh, top = SKY.y - h;
    castDots(c, x0, top, SKY.w, h, 220, { st: 16 });
    rr(c, x0, top, SKY.w, h, 6); cel(c, x0, top, SKY.w, h, col, { hw: .06 }); c.save(); rr(c, x0, top, SKY.w, h, 6); c.clip();
    for (let r = 0; r < 30; r++) for (let q = 0; q < 5; q++) { c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(x0 + 24 + q * 66, top + 30 + r * 70, 40, 44) } glint(c, x0, top, SKY.w, h, .14); c.restore(); rr(c, x0, top, SKY.w, h, 6); lnB(c, 4);
    if (kc > 0 && kc < 1) for (let i = 0; i < 10; i++) { const u = ((t * 1.6 + i / 10) % 1); circ(c, x0 + H1(i) * SKY.w, SKY.y - 40 * u, 30 + 50 * u, rgba('#c9cde0', .5 * (1 - u))) }
    const ks = at(t, T5.ubr - .12, T5.ubr); if (ks > 0) { const s = lp(2.4, 1, eo(ks)); c.save(); c.translate(SKY.x + sh, top + Math.min(h - 120, 520)); c.rotate(-.12); c.scale(s, s); c.globalAlpha *= cl(ks * 3);
      rr(c, -200, -64, 400, 128, 12); lnB(c, 10, B2.red); tx(c, 'ЗАПРЕТ FDA', 0, -14, { f: 'U', w: 800, s: 50, c: B2.red }); tx(c, '2022', 0, 36, { f: 'U', w: 800, s: 34, c: B2.red }); c.restore() }
    const v = lp(12.8e9, 4.5e8, eio(at(t, T5.tep, T5.pol + .3))), red = ss(.4, 1, kc), kp = bo(at(t, T5.dz - .3, T5.dz + .1));
    if (kp > 0) { c.save(); c.translate(SKY.x + sh, top - 120); c.scale(kp, kp); rr(c, -250, -70, 500, 140, 16); fill(c, B2.ink); rr(c, -250, -70, 500, 140, 16); lnB(c, 4, mixc('#7ee787', '#ef4444', red));
      tx(c, 'ДОЛЯ «МАЛЬБОРО» В «ДЖУЛЕ»', 0, -40, { f: 'M', w: 800, s: 20, c: B2.cream }); num(c, '$' + fmt(Math.round(v / 1e7) * 1e7), 0, 16, { f: 'J', w: 700, s: 46, c: mixc('#7ee787', '#ef4444', red) }); c.restore() }
    const km = bo(at(t, T5.pol + .2, T5.pol + .5)); if (km > 0) plate(c, '−96 %', SKY.x + 250, top - 260, km, { s: 50, bg: B2.red, c: '#fff' });
  }
  function waveScr(c, t, yC, seed) {   // волна одноразок в экранных координатах: гребень на yC, ниже — вода с одноразками
    if (yC > 2050) return; const crest = x => yC + 34 * Math.sin(x / 150 + t * 6) + 18 * Math.sin(x / 61 - t * 9);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    const band = (dy, col) => { c.beginPath(); c.moveTo(-20, 2100); for (let x = -20; x <= 1100; x += 20) c.lineTo(x, crest(x) + dy); c.lineTo(1100, 2100); c.closePath(); fill(c, col) };   // v2: слои волны как у Боба (#007)
    band(-40, B2.red); band(-8, B2.cream);
    c.beginPath(); c.moveTo(-20, 2100); for (let x = -20; x <= 1100; x += 20) c.lineTo(x, crest(x) + 22); c.lineTo(1100, 2100); c.closePath(); fill(c, '#3466ad'); c.save(); c.clip();
    for (let i = 0; i < 18; i++) { const x = H1(i * 4.7 + seed) * 1100, y = crest(x) + 90 + H1(i * 6.3) * 1800; if (y > 2050) continue; c.save(); c.translate(x + Math.sin(t * 2 + i) * 16, y); c.rotate(t * (1 + H1(i)) * (i % 2 ? 1 : -1));
      rr(c, -40, -40, 80, 80, 14); fill(c, 'rgba(223,246,255,.85)'); rr(c, -30, -30, 18, 50, 8); fill(c, 'rgba(255,255,255,.8)'); rr(c, -40, -40, 80, 80, 14); lnW(c, 4, '#ffffff'); c.restore() }   // кубики льда
    c.fillStyle = '#4a86cf'; c.beginPath(); for (let x = -20; x <= 1100; x += 20) c.lineTo(x, crest(x) + 260); c.lineTo(1100, 2100); c.lineTo(-20, 2100); c.closePath(); c.fill();
    const cols = ['#f97316', '#ec4899', '#eab308', '#84cc16', '#22c55e', '#a855f7', '#38bdf8'];
    for (let i = 0; i < 60; i++) { const x = H1(i * 2.3 + seed) * 1100, y = crest(x) + 60 + H1(i * 5.1) * 1900; if (y > 2050) continue;
      c.save(); c.translate(x + Math.sin(t * 3 + i) * 20, y); c.rotate(t * (2 + H1(i) * 3) * (i % 2 ? 1 : -1)); rr(c, -22, -60, 44, 120, 14); fill(c, cols[i % 7]); lnW(c, 5, PJ.ink); rr(c, -14, -82, 28, 26, 8); fill(c, PJ.ln); c.restore() }
    c.restore();
    for (let i = 0; i < 7; i++) { const x = -60 + i * 190 + ((t * 120) % 190), y = crest(x); c.beginPath(); c.arc(x + 40, y - 36, 62, Math.PI * .1, Math.PI * 1.15); lnW(c, 14, '#f4f8ff'); circ(c, x - 18, y - 20, 14, '#f4f8ff') }
    c.restore();
  }
  function drawW5(c, t, q) {
    c.fillStyle = '#0b1124'; c.fillRect(0, 0, WW, HH); c.save(); applyCam(c, q); const v = viewRect(q);
    if (v.y0 < 1710) schoolW5(c, t); if (v.y1 > 1710) { floorW5(c, t, v); guillotineW5(c, t); suitsW5(c, t); skyW5(c, t); chairW5(c, t) }
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
