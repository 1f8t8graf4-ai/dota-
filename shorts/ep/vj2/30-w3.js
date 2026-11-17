  // ================= мир 3: Таймс-сквер ночью — реклама «Джула» и три четверти рынка =================
  let W3K = null, T3 = {}, TH = 0;
  const BA = { cx: 540, cy: 940, w: 720, h: 1060 }, BB = { cx: 1520, cy: 760, w: 700, h: 760 }, DON = { ro: 250, ri: 150 };
  function w3Init() {
    const p = PH; T3 = { mol: Wd('молодыми'), mod: Wd('моделями'), ts: Wd('таймс-сквер'), goda: Wd('года', 1), tri: Wd('три', 1), chet: Wd('четверти'), am: Wd('америки') };
    TH = p[13].a + .45;
    W3K = [KY(TW, 540 - 900, 950, 1.0), KY(TW + .32, 540, 950, 1.0), KY(TW + .6, 545, 960, .98), KY(p[11].b, 600, 1060, .74), KY(p[12].a + .3, 1300, 900, .9), KY(p[12].a + .9, 1520, 765, 1.18),
      KY(p[12].b, 1520, 760, 1.3), KY(p[13].a, 1520, 760, 1.5), KY(TH, 1520, 760, 9.6)];
  }
  function bldg(c, x0, x1, top, col, win, seed, t) {
    c.fillStyle = col; c.fillRect(x0, top, x1 - x0, 2600 - top);
    for (let y = top + 40; y < 1650; y += 56) for (let x = x0 + 24; x < x1 - 30; x += 46) { const h = H1(x * .13 + y * .07 + seed); if (h < .45) continue; c.fillStyle = rgba(win, .25 + .35 * h); c.fillRect(x, y, 22, 30) }
  }
  function frameB(c, cx, cy, w, h) { rr(c, cx - w / 2 - 26, cy - h / 2 - 26, w + 52, h + 52, 10); fill(c, '#07080f'); }
  function adA(c, t, w, h) {   // реклама: градиент, «ДЖУЛ», устройство, силуэты моделей (без лиц)
    const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#ec4899'); g.addColorStop(1, '#f97316'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(w * .5, h * .42, 120 + i * 90 + (t * 60) % 90, 0, TAU); lnW(c, 6, 'rgba(255,255,255,.08)') }
    tx(c, 'ДЖУЛ', w / 2, 120, { f: 'U', w: 800, s: 128, c: '#fff', ls: 10 });
    juulDev(c, w / 2, 330, 470, { ang: -.12, lc: '#fff', liq: '#22c55e' });
    [[150, 0, -.05], [w / 2, 1, .04], [w - 150, 2, -.03]].forEach(([x, i, r]) => { const k = bo(at(t, (i < 2 ? T3.mol : T3.mod) - .2 + (i === 1 ? .28 : 0), (i < 2 ? T3.mol : T3.mod) + .15 + (i === 1 ? .28 : 0))); if (k <= 0) return;
      c.save(); c.translate(x, h + 10); c.rotate(r); c.scale(k, k); c.fillStyle = 'rgba(46,16,101,.88)';
      c.beginPath(); c.ellipse(0, -430, 52, 62, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-60, -366); c.quadraticCurveTo(-110, -200, -92, 0); c.lineTo(92, 0); c.quadraticCurveTo(110, -200, 60, -366); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(-80, -320); c.quadraticCurveTo(-140, -230, i === 1 ? -150 : -120, i === 1 ? -330 : -150); lnW(c, 34, 'rgba(46,16,101,.88)'); c.restore() });
  }
  function adB(c, t, w, h) {   // три четверти рынка: бублик
    c.fillStyle = PJ.hole; c.fillRect(0, 0, w, h);
    tx(c, 'РЫНОК США', w / 2, 110, { f: 'U', w: 800, s: 46, c: '#fff' }); tx(c, 'ЭЛЕКТРОННЫЕ СИГАРЕТЫ', w / 2, h - 90, { f: 'M', w: 800, s: 28, c: 'rgba(238,242,247,.7)', ls: 2 });
    const cx = w / 2, cy = h / 2, k = eio(at(t, T3.tri - .15, T3.chet + .35)) * .75;
    c.beginPath(); c.arc(cx, cy, (DON.ro + DON.ri) / 2, 0, TAU); lnW(c, DON.ro - DON.ri, '#3a3f5e');
    if (k > 0) { c.beginPath(); c.arc(cx, cy, (DON.ro + DON.ri) / 2, -Math.PI / 2, -Math.PI / 2 + TAU * k); c.lineCap = 'butt'; c.strokeStyle = PJ.orange; c.lineWidth = DON.ro - DON.ri; c.stroke() }
    circ(c, cx, cy, DON.ri, PJ.hole);
    const a = at(t, T3.chet, T3.chet + .2) * (1 - at(t, PH[13].a - .1, PH[13].a + .12)); A(c, a, () => tx(c, Math.round(k / .75 * 75) + ' %', cx, cy + 4, { f: 'U', w: 800, s: 92, c: '#fff' }));
  }
  function streetW3(c, t) {
    c.fillStyle = '#10121f'; c.fillRect(-1200, 1720, 4200, 1200);
    for (let i = 0; i < 14; i++) { const x = ((t * (520 + i * 30) + i * 300) % 3600) - 1000, y = 1790 + (i % 3) * 52; c.fillStyle = i % 2 ? '#facc15' : '#fde68a'; rr(c, x, y, 110, 26, 10); c.fill(); glow(c, x + 110, y + 13, 60, '#fff7cc', .35) }
    // бегущая строка
    c.fillStyle = '#0b0d18'; c.fillRect(-1200, 1560, 4200, 92); c.save(); c.beginPath(); c.rect(-1200, 1560, 4200, 92); c.clip();
    const s = 'ТАЙМС-СКВЕР · НЬЮ-ЙОРК · 2015 · ', w = tw(c, s, { f: 'U', w: 800, s: 50, ls: 4 }), x0 = -1200 - ((t * 220) % w);
    for (let x = x0; x < 3000; x += w) tx(c, s, x, 1607, { f: 'U', w: 800, s: 50, c: '#fbbf24', al: 'left', ls: 4 }); c.restore();
  }
  function drawW3(c, t, q) {
    const g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#120b2a'); g.addColorStop(1, '#2a1640'); c.fillStyle = g; c.fillRect(0, 0, WW, HH);
    lay(c, q, .55, 540, 950, c => { bldg(c, -900, -320, 120, '#1a1838', '#fde68a', 1, t); bldg(c, 1960, 2700, 60, '#1a1838', '#a5f3fc', 2, t); bldg(c, 900, 1150, 260, '#201c40', '#fde68a', 3, t) });
    applyCam(c, q);
    bldg(c, 120, 960, 240, '#252244', '#fde68a', 4, t); bldg(c, 1120, 1920, 200, '#2a2550', '#c4b5fd', 5, t);
    // декоративные экраны
    [[-200, 760, 420, 640, ['#22d3ee', '#6366f1']], [2230, 900, 460, 760, ['#f43f5e', '#facc15']], [1520, 1400, 640, 200, ['#10b981', '#0ea5e9']]].forEach(([x, y, w, h, cs], i) => {
      frameB(c, x, y, w, h); const gg = c.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2); gg.addColorStop(0, cs[0]); gg.addColorStop(1, cs[1]); c.fillStyle = gg; c.fillRect(x - w / 2, y - h / 2, w, h);
      for (let j = 0; j < 4; j++) { circ(c, x - w / 2 + (H1(i * 7 + j) * w), y - h / 2 + ((H1(i * 3 + j) * h + t * 90 * (j + 1)) % h), 22 + j * 10, 'rgba(255,255,255,.18)') } });
    frameB(c, BA.cx, BA.cy, BA.w, BA.h); c.save(); c.translate(BA.cx - BA.w / 2, BA.cy - BA.h / 2); c.beginPath(); c.rect(0, 0, BA.w, BA.h); c.clip(); adA(c, t, BA.w, BA.h); c.restore();
    glow(c, BA.cx, BA.cy, 700, '#f472b6', .12);
    frameB(c, BB.cx, BB.cy, BB.w, BB.h); c.save(); c.translate(BB.cx - BB.w / 2, BB.cy - BB.h / 2); c.beginPath(); c.rect(0, 0, BB.w, BB.h); c.clip(); adB(c, t, BB.w, BB.h); c.restore();
    streetW3(c, t);
    const ks = bo(at(t, T3.ts - .15, T3.ts + .25)); if (ks > 0) { c.save(); c.translate(540, 1500); c.scale(ks, ks); rr(c, -250, -50, 500, 100, 12); fill(c, '#15803d'); rr(c, -238, -38, 476, 76, 8); lnW(c, 4, '#fff'); tx(c, 'ТАЙМС-СКВЕР', 0, 3, { f: 'U', w: 800, s: 44, c: '#fff' }); c.restore() }
  }
  function shotW3(c, t) { if (!W3K) w3Init(); const q = camOf(W3K, t); c.save(); drawW3(c, t, q); c.restore(); speedTrail(c, camOf(W3K, t - 1 / 30), q, 1 - at(t, TW + .15, TW + .35)) }
