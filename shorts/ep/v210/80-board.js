  // ================= мир J (только фильм): пробковая доска глав — отъезд один раз за главу =================
  // v21.1: хвоста про баночку больше нет (строки 16–17 переехали в начало главы 5). После «как и вы» кадр кофейни сжимается в фото карточки
  // «2014 · НАГРЕВАТЕЛИ» (на фото — тот же стол: айкос у карты США), камера отъезжает на всю доску: открыты 1979, 2020, 1924 и 2014;
  // красная нить тянется от 2014 к закрытой 2022 — под маркером виден только год. Белых кадров на стыке нет.
  const CARDS4 = [{ id: '1979', x: 340, y: 400, a: '1979', bk: 'card79b', open: true }, { id: '2020', x: 740, y: 400, a: '2020', bk: 'card20b', open: true },
    { id: '2014', x: 230, y: 790, a: '2014', bk: 'card14b', open: true }, { id: '1924', x: 540, y: 850, a: '1924', bk: 'card24b', open: true }, { id: '2022', x: 850, y: 790, a: '2022', bk: 'card22b' }];
  // 1924 — на 45 ниже, чем в главе 3: нить 2014 → 2022 идёт над её булавкой, а не впритык
  const CW4 = 270, CH4 = 330, PH4 = 240, photo4 = cd => [cd.x, cd.y - CH4 / 2 + 15 + PH4 / 2], pin4 = cd => [cd.x, cd.y - CH4 / 2 + 4], C2014 = CARDS4[2], C2022 = CARDS4[4];
  const PHC = { x: 610, y: 1340, s: 460 };   // фото 2014: квадрат кофейни с центром (610, 1340) стороной 460 — айкос у карты США на столе
  let KJ = null, CORK4 = null, CAFE_END = null;
  // v21.2: доска — та же, что в начале главы 5 (ep/v220/80-board.js): компактная, на тёмной стене, 1924 — две пачки без HeatSticks.
  // Хвост фильма — 2 с: кадр кофейни сжимается в фото 2014, нить тянется к закрытой 2022, камера едет по нити к карточке 2022.
  // Последний кадр = кадр главы 5 за 1/30 с до её начала: ключи KS — общие с KJ5 главы 5 (время τ: 0 — начало главы 5).
  // v22.4 (ФИНАЛЬНОЕ ТЗ мейн): хвост 1,4 с — кадр кофейни сжимается в фото 2014, камера отъезжает вправо; нить к 2022 в главе 4 не тянется:
  // её в реальном времени тянет начало главы 5 под голосовой мостик (ep/v220/80-board.js, KS5 — те же ключи).
  const BRD4 = { x0: -40, y0: 120, x1: 1120, y1: 1160 }, KS = [[-1.2, 230, 760, 860 / 240], [-.55, 290, 742, 2.05], [0, 360, 724, 1.62], [.6, 455, 716, 1.5]];
  function boardInit() {
    if (MODE !== 'y') return; const a = TM, j0 = a.jAJ, [px, py] = photo4(C2014), T0 = TLX.endT + 1 / 30;
    CAFE_END = camObj(camAt(KAE, j0));   // кадр кофейни, который станет фото
    KJ = [KY(j0, px, py, 860 / PH4), ...KS.slice(1).map(([t, x, y, z]) => KY(T0 + t, x, y, z))];   // первый ключ — фото на весь кадр (τ ≈ −1,2, как KS[0])
  }
  function corkImg4() { if (CORK4) return CORK4; CORK4 = mk(WW, 1400); const g = CORK4.getContext('2d'); g.fillStyle = '#b07a4a'; g.fillRect(0, 0, WW, 1400);
    for (let y = 10, r = 0; y < 1400; y += 22, r++) for (let x = (r % 2) * 11; x < WW; x += 22) { if (H1(x * .37 + y * 1.13) > .55) continue; g.fillStyle = 'rgba(120,72,35,.35)'; g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill() } return CORK4 }
  function boardWall4(c) {
    c.fillStyle = '#2a1d14'; c.fillRect(-4000, -4000, 9000, 9000); c.fillStyle = 'rgba(255,255,255,.03)'; for (let x = -4000; x < 5000; x += 140) c.fillRect(x, -4000, 4, 9000);
    const B = BRD4, im = corkImg4();
    c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(B.x0 + 18, B.y0 + 26, B.x1 - B.x0, B.y1 - B.y0);
    c.save(); rr(c, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 14); fill(c, '#5b3d26'); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); c.clip();
    for (let yy = B.y0; yy < B.y1; yy += 1400) for (let xx = B.x0; xx < B.x1; xx += 1080) c.drawImage(im, xx, yy); c.restore();
    rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); lnS(c, 3, 'rgba(241,230,214,.4)');
    c.save(); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); c.clip(); const g = c.createRadialGradient(540, 420, 120, 540, 700, 1100); g.addColorStop(0, 'rgba(255,236,190,.12)'); g.addColorStop(1, 'rgba(20,12,6,.38)'); c.fillStyle = g; c.fillRect(B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0); c.restore();
  }
  function marker4(c, x, y, s, seed) { c.save(); c.translate(x, y); c.lineCap = 'round';
    [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(seed + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke(); c.restore() }); c.restore() }
  function pin4d(c, x, y) { circ(c, x + 2, y + 4, 10, 'rgba(0,0,0,.35)'); circ(c, x, y, 10, '#dc2626'); circ(c, x - 3, y - 3, 3.6, '#fca5a5') }
  function thread4(c, a, b, k = 1) { if (k <= 0) return; const [x1, y1] = pin4(a), [x2, y2] = pin4(b), x = lp(x1, x2, k), y = lp(y1, y2, k);
    c.save(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(x + 3, y + 6); c.stroke(); c.strokeStyle = '#dc2626'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x, y); c.stroke(); c.restore() }
  function photo1979(c, x, y, s) { c.fillStyle = '#1b2142'; c.fillRect(x - s / 2, y - s / 2, s, s); c.save(); c.translate(x - s * .12, y + s * .08); c.scale(s / 240, s / 240);
    poly(c, [-38, 20, 38, 20, 56, 56, -56, 56]); fill(c, '#38bdf8'); poly(c, [-14, -80, 14, -80, 14, -30, 60, 60, -60, 60, -14, -30]); c.strokeStyle = '#e0f2fe'; c.lineWidth = 5; c.stroke();
    poly(c, [96, 30, 120, 8, 146, 26, 140, 58, 108, 60]); fill(c, '#F4F1EA'); poly(c, [120, 8, 146, 26, 128, 38]); fill(c, '#FFFFFF'); c.restore() }
  function photo2020(c, x, y, s) { c.fillStyle = '#1e2138'; c.fillRect(x - s / 2, y - s / 2, s, s); rr(c, x - s * .12, y - s * .32, s * .24, s * .64, s * .08); fill(c, B2.mango);
    poly(c, [x - s * .12, y + s * .02, x + s * .12, y - s * .1, x + s * .12, y + s * .32, x - s * .12, y + s * .32]); fill(c, B2.ice2); rr(c, x - s * .07, y - s * .42, s * .14, s * .12, 6); fill(c, '#2a2f55') }
  function photo1924(c, x, y, s) {   // v21.2: две пачки главы 3 — мягкая 1920-х и Flip-Top 1950-х, без HeatSticks (как в главе 5)
    c.fillStyle = '#1b1f3a'; c.fillRect(x - s / 2, y - s / 2, s, s); beam(c, x, y - s / 2, x, y + s * .3, 10, s * .5, '#FFE6B8', .14);
    c.fillStyle = 'rgba(200,230,255,.25)'; c.fillRect(x - s / 2, y + s * .3, s, 4); c.fillStyle = '#14172E'; c.fillRect(x - s / 2, y + s * .3 + 4, s, s);
    c.save(); c.translate(x, y); c.scale(s / 240, s / 240); softPack(c, -86, -16, 64, 96, 12, { shadow: false }); mPack(c, 10, -24, 64, 104, 12, { shadow: false }); c.restore();
  }
  function card4(c, t, cd) {
    const [px, py] = photo4(cd);
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW4 / 2, -CH4 / 2, CW4, CH4, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW4 / 2, cd.y - CH4 / 2, CW4, CH4, 6); fill(c, '#f5f0e6'); rr(c, cd.x - CW4 / 2, cd.y - CH4 / 2, CW4, CH4, 6); lnS(c, 3, '#2b2638');
    c.save(); c.beginPath(); c.rect(px - PH4 / 2, py - PH4 / 2, PH4, PH4); c.clip();
    if (cd.id === '1979') photo1979(c, px, py, PH4); else if (cd.id === '2020') photo2020(c, px, py, PH4); else if (cd.id === '1924') photo1924(c, px, py, PH4);
    else { c.fillStyle = '#1e293b'; c.fillRect(px - PH4 / 2, py - PH4 / 2, PH4, PH4) }   // 2014 — кадр кофейни рисует photoOver поверх
    if (!cd.open) { rr(c, px - PH4 / 2, py - PH4 / 2, PH4, PH4, 2); fill(c, '#17171c'); marker4(c, px, py, PH4, cd.x) }
    c.restore();
    tx(c, cd.a, cd.x, cd.y + CH4 / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' });
    tx(c, TEXT[cd.bk], cd.x, cd.y + CH4 / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW4 - 24 });   // v21.2: подпись у всех (у 2022 — «СНЮС», как в главе 5)
  }
  function boardWorld(c, t) {
    const a = TM; boardWall4(c);
    const [c79, c20, c14, c24, c22] = CARDS4; thread4(c, c79, c20); thread4(c, c20, c14); thread4(c, c20, c24); thread4(c, c20, c22); thread4(c, c24, c79); thread4(c, c24, c14);
    CARDS4.forEach(cd => card4(c, t, cd)); CARDS4.forEach(cd => pin4d(c, ...pin4(cd)));
  }
  function photoOver(c, t, q) {   // кадр кофейни сжимается в фото карточки 2014 (v21.2: за 0,7 с)
    const a = TM, e = eio(at(t, a.jAJ, a.jAJ + .7)), [px, py] = photo4(C2014), P = { x: (px - q.x) * q.z + 540, y: (py - q.y) * q.z + 960, s: PH4 * q.z };
    const S = { x: lp(540, P.x, e), y: lp(960, P.y, e), w: lp(WW, P.s, e), h: lp(HH, P.s, e) }, c0 = CAFE_END, Vh = lp(HH / c0.z, PHC.s, e), k = S.h / Vh;
    const V = { x: lp(c0.x, PHC.x, e), y: lp(c0.y, PHC.y, e) }, fw = 15 * q.z * Math.min(1, e * 3);
    if (e > 0 && e < 1) { c.save(); c.globalAlpha *= .35 * Math.min(1, e * 3) * (1 - at(e, .85, 1)); c.fillStyle = '#000'; c.fillRect(S.x - S.w / 2 - fw + 8 * q.z, S.y - S.h / 2 - fw + 12 * q.z, S.w + fw * 2, S.h + fw * 2); c.restore();
      c.fillStyle = '#f5f0e6'; c.fillRect(S.x - S.w / 2 - fw, S.y - S.h / 2 - fw, S.w + fw * 2, S.h + fw * 2) }   // v22.4: фото легло — дальше рамка и булавка карточки (как в главе 5)
    c.save(); c.beginPath(); c.rect(S.x - S.w / 2, S.y - S.h / 2, S.w, S.h); c.clip(); c.translate(S.x - 540, S.y - 960);
    cafeShot(c, t, { x: V.x, y: V.y, z: k, r: 0 }, t - TL0, cafe2St(t)); c.restore();
  }
  function boardShot(c, t) { const q = camObj(camAt(KJ, t)), kp = at(t, TM.jAJ + .62, TM.jAJ + .7); layer(c, q, 1, cc => boardWorld(cc, t)); photoOver(c, t, q); if (kp > 0) layer(c, q, 1, cc => { cc.globalAlpha *= kp; pin4d(cc, ...pin4(C2014)) }) }   // v22.4: булавка 2014 — поверх фото (из неё в главе 5 потянется нить)
  window.__ph14 = (t, N) => { const cv = mk(N, N), g = cv.getContext('2d'); g.translate(N / 2 - 540, N / 2 - 960); cafeShot(g, t, { x: PHC.x, y: PHC.y, z: N / PHC.s, r: 0 }, t - TL0, cafe2St(t)); return cv.toDataURL('image/png') };   // v22.2: фото карточки 2014 в конце главы 4 → ep/v210-ph2014.png (глава 5 рисует его же — стык 4 → 5 без подмены)
