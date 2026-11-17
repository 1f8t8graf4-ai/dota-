  // ================= мир 6: волна уходит → патент плывёт к доске → карточка «1979 · СОЛЬ» → нити → фильм =================
  let W6K = null, T6 = {};
  const CARD6 = [
    { id: '1979', x: 340, y: 420, a: '1979', b: 'СОЛЬ', open: 1 },
    { id: '2020', x: 740, y: 420, a: '2020', b: 'ЛАЗЕЙКА ОДНОРАЗОК', open: 1 },
    { id: '2014', x: 230, y: 810, a: '2014', b: 'НАГРЕВАТЕЛИ' },
    { id: '1924', x: 540, y: 825, a: '1924', b: '«МАЛЬБОРО»' },
    { id: '2022', x: 850, y: 810, a: '2022', b: 'ШАЙБЫ' }];
  const CW6 = 270, CH6 = 330, PH6 = 240;
  let CORK6 = null;
  function w6Init() {
    const p = PH; T6 = { sol: Wd('соль'), pat: Wd('патент', 1), perv: Wd('первая'), ul: Wd('улика'), film: Wd('фильме'), end: TLX.endT };
    W6K = [KY(TSW, 540, 760, 1.0), KY(p[22].a + .6, 470, 640, 1.06), KY(T6.pat + .25, 380, 500, 1.28), KY(p[23].b - .25, 540, 660, .98), KY(p[24].a + .45, 540, 1240, .79), KY(T6.end, 540, 1305, .74)];   // v2: все 5 карточек в кадре, название и ▶ YouTube выше субтитра (▶ на y 1150)
  }
  function cork6() { if (CORK6) return CORK6; CORK6 = mk(WW, 1100); const g = CORK6.getContext('2d'); g.fillStyle = '#b07a4a'; g.fillRect(0, 0, WW, 1100);
    for (let y = 10, r = 0; y < 1100; y += 22, r++) for (let x = (r % 2) * 11; x < WW; x += 22) { if (H1(x * .37 + y * 1.13) > .55) continue; g.fillStyle = 'rgba(120,72,35,.35)'; g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill() } return CORK6 }
  function photo79(c, x, y, s) {
    c.fillStyle = '#1b2142'; c.fillRect(x - s / 2, y - s / 2, s, s); c.save(); c.translate(x - s * .12, y + s * .08); c.scale(s / 240, s / 240);
    poly(c, [-38, 20, 38, 20, 56, 56, -56, 56]); fill(c, '#38bdf8'); poly(c, [-14, -80, 14, -80, 14, -30, 60, 60, -60, 60, -14, -30]); lnW(c, 5, '#e0f2fe'); c.restore();
    c.save(); c.translate(x + s * .24, y + s * .2); c.scale(s / 240, s / 240); poly(c, [0, -34, 26, -10, 18, 26, -18, 26, -26, -10]); fill(c, '#7dd3fc'); poly(c, [0, -34, 26, -10, 0, 0]); fill(c, '#e0f2fe'); c.restore();
  }
  function photo20(c, x, y, s, t) {
    c.fillStyle = '#1f3563'; c.fillRect(x - s / 2, y - s / 2, s, s); c.save(); c.beginPath(); c.rect(x - s / 2, y - s / 2, s, s); c.clip();
    c.fillStyle = '#4a86cf'; c.beginPath(); c.moveTo(x - s / 2, y + s / 2); for (let i = 0; i <= 12; i++) c.lineTo(x - s / 2 + i * s / 12, y + s * .12 + 12 * Math.sin(i + t * 3)); c.lineTo(x + s / 2, y + s / 2); c.closePath(); c.fill();
    ['#f97316', '#ec4899', '#22c55e'].forEach((col, i) => { c.save(); c.translate(x - 60 + i * 60, y + 10 + (i % 2) * 18); c.rotate((i - 1) * .4); rr(c, -14, -36, 28, 72, 9); fill(c, col); lnW(c, 4, PJ.ink); c.restore() }); c.restore();
  }
  function closed6(c, x, y, s, id) {
    c.fillStyle = '#1e293b'; c.fillRect(x - s / 2, y - s / 2, s, s); c.save(); c.translate(x, y); c.fillStyle = '#334155';
    if (id === '2014') { rr(c, -22, -90, 44, 180, 14); c.fill() } else if (id === '1924') { rr(c, -14, -100, 28, 200, 6); c.fill() } else { c.beginPath(); c.ellipse(0, 0, 80, 34, 0, 0, TAU); c.fill() }
    c.lineCap = 'round'; [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(x + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke(); c.restore() });
    c.restore();
  }
  const pin6 = cd => [cd.x, cd.y - CH6 / 2 + 4];
  function card6(c, t, cd, a = 1) {
    if (a <= 0) return; c.save(); c.globalAlpha *= a; const px = cd.x, py = cd.y - CH6 / 2 + 15 + PH6 / 2;
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW6 / 2, -CH6 / 2, CW6, CH6, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW6 / 2, cd.y - CH6 / 2, CW6, CH6, 6); fill(c, '#f5f0e6'); rr(c, cd.x - CW6 / 2, cd.y - CH6 / 2, CW6, CH6, 6); lnW(c, 3, '#2b2638');
    c.save(); c.beginPath(); c.rect(px - PH6 / 2, py - PH6 / 2, PH6, PH6); c.clip();
    if (cd.id === '1979') photo79(c, px, py, PH6); else if (cd.id === '2020') photo20(c, px, py, PH6, t); else closed6(c, px, py, PH6, cd.id);
    c.restore();
    tx(c, cd.a, cd.x, cd.y + CH6 / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' }); tx(c, cd.b, cd.x, cd.y + CH6 / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW6 - 24 });
    const [qx, qy] = pin6(cd); circ(c, qx + 3, qy + 5, 14, 'rgba(0,0,0,.35)'); circ(c, qx, qy, 14, '#dc2626'); circ(c, qx - 4, qy - 4, 5, '#fca5a5');
    c.restore();
  }
  function thread6(c, A0, B0, k) { if (k <= 0) return; const [x1, y1] = pin6(A0), [x2, y2] = pin6(B0); c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(lp(x1, x2, k) + 3, lp(y1, y2, k) + 6); lnW(c, 4, 'rgba(0,0,0,.25)'); c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, k), lp(y1, y2, k)); lnW(c, 4, '#dc2626') }
  function sheetSmall(c, t, x, y, s, r) {   // тот же патент, что в мире 2 — маленький
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.save(); c.translate(10, 14); rr(c, -130, -170, 260, 340, 6); fill(c, 'rgba(0,0,0,.3)'); c.restore();
    rr(c, -130, -170, 260, 340, 6); fill(c, PJ.paper); tx(c, 'ПАТЕНТ', 0, -128, { f: 'U', w: 800, s: 30, c: PJ.inkP }); tx(c, 'НИКОТИНОВЫЕ СОЛИ', 0, -90, { f: 'O', w: 700, s: 18, c: PJ.inkP });
    nicMol(c, 0, 10, .62, PJ.inkP, 5); for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(42,47,74,.25)'; c.fillRect(-100, 90 + i * 18, 200 - i * 40, 7) }
    stampC(c, 72, -48, 34, 1, '', '1979'); c.restore();
  }
  function drawW6(c, t, q) {
    c.fillStyle = '#1f1b2b'; c.fillRect(0, 0, WW, HH); c.save(); applyCam(c, q);
    c.fillStyle = '#1f1b2b'; c.fillRect(-1200, -1200, 3480, 4400);
    c.save(); rr(c, 30, 170, WW - 60, 1050, 14); fill(c, '#5b3d26'); rr(c, 52, 192, WW - 104, 1006, 8); c.clip(); c.drawImage(cork6(), 0, 150); c.restore();
    rr(c, 30, 170, WW - 60, 1050, 14); lnW(c, 5, '#f1e6d6');
    tx(c, 'ДЕЛО: НИКОТИН', 540, 110, { f: 'U', w: 800, s: 46, c: '#f1e6d6', ls: 6 });
    const ka = at(t, T6.pat - .1, T6.pat + .3), C = CARD6;
    thread6(c, C[0], C[1], eo(at(t, T6.perv - .2, T6.perv + .3)));
    [[C[0], C[3], 0], [C[1], C[2], 1], [C[1], C[4], 2]].forEach(([a0, b0, i]) => thread6(c, a0, b0, eo(at(t, T6.ul - .1 + i * .22, T6.ul + .35 + i * .22))));
    C.forEach((cd, i) => { if (i === 0) card6(c, t, cd, ka); else card6(c, t, cd, 1) });
    // название фильма и плашка YouTube
    const kt = bo(at(t, T6.film - .5, T6.film - .1)); if (kt > 0) { c.save(); c.translate(540, 1345); c.scale(kt, kt); c.rotate(-.02);
      rr(c, -470, -100, 940, 200, 22); fill(c, '#0f172a'); rr(c, -470, -100, 940, 200, 22); lnW(c, 6, '#fbbf24');
      tx(c, 'ЧТО ВЫ ЗНАЕТЕ', 0, -36, { f: 'U', w: 800, s: 56, c: '#fff' }); tx(c, 'О НИКОТИНЕ?', 0, 40, { f: 'U', w: 800, s: 64, c: '#fbbf24' }); c.restore() }
    const ky = at(t, T6.film + .45, T6.film + .75); if (ky > 0) { const s = lp(2.4, 1, ei(ky)); c.save(); c.translate(540, 1562); c.rotate(-.03); c.scale(s, s); c.globalAlpha *= cl(ky * 3);
      rr(c, -330, -50, 660, 100, 14); fill(c, 'rgba(153,27,27,.95)'); rr(c, -330, -50, 660, 100, 14); lnW(c, 5, '#ef4444'); tx(c, '▶ ФИЛЬМ НА YOUTUBE', 0, 3, { f: 'U', w: 800, s: 44, c: '#fff' }); c.restore() }
    c.restore();
  }
  function shotW6(c, t) {
    if (!W6K) w6Init(); const q = camOf(W6K, t); drawW6(c, t, q);
    const kr = eio(at(t, TSW + .25, TSW + 1.25)); if (kr < 1) waveScr(c, t, lp(-260, 2160, kr), 3);
    // патент всплывает на волне и летит на место карточки 1979
    const ka = at(t, T6.pat - .1, T6.pat + .3), kf = eio(at(t, TSW + .5, T6.pat)), C0 = CARD6[0]; if (ka < 1) {
      const x = lp(540, C0.x, kf), y = lp(1350, C0.y, kf) - Math.sin(Math.PI * kf) * 160, s = lp(1.35, 1.0, kf);
      c.save(); applyCam(c, q); c.globalAlpha *= 1 - ka; sheetSmall(c, t, x, y, s, Math.sin(t * 2.4) * .12 * (1 - kf) - .05); c.restore() }
  }
