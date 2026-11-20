  // ================= мир 7: пробковая доска глав (начало фильма, строка 12, концовка шортса) =================
  // Доска та же, что в конце главы 4 (v21.2: компактная, на тёмной стене): 1979 — колба, 2020 — одноразка, 1924 — две пачки (мягкая 1920-х
  // и Flip-Top 1950-х, без HeatSticks), 2014 — айкос у карты США на столе кофейни, 2022 — ночной океан с баночкой (кадр 0 главы 5).
  // Фильм, начало: камера та же, что в последнем кадре главы 4 (карточка 2022 под маркером), маркер осыпается кусками, фото раскрывается
  // на весь экран — это кадр океана. Конец строки 11: вода поднимается снизу (за ней — тот же ночной океан), кадр сжимается в фото
  // карточки 2022, отъезд на всю доску. Фильм: импульс света по нитям, на «Осталось перевернуть» — угол доски загибается (финал — 90-final.js).
  // Шортс: значки карточек вспыхивают, нити натягиваются и уходят за доску, на «обороте» доска поворачивается на ребро (видна тёмная изнанка
  // с красным кольцом змеи) и возвращается, штамп «ЦЕЛИКОМ — НА YOUTUBE», нырок в фото 2022 — кадр 0 (петля).
  const CARDS5 = [{ id: '1979', x: 340, y: 400, a: '1979', bk: 'card79b' }, { id: '2020', x: 740, y: 400, a: '2020', bk: 'card20b' },
    { id: '2014', x: 230, y: 790, a: '2014', bk: 'card14b' }, { id: '1924', x: 540, y: 850, a: '1924', bk: 'card24b' }, { id: '2022', x: 850, y: 790, a: '2022', bk: 'card22b' }];
  const CW5 = 270, CH5 = 330, PS5 = 240, BRD5 = { x0: -40, y0: 120, x1: 1120, y1: 1160 }, C22 = CARDS5[4];
  const THR5 = [[0, 1], [1, 2], [1, 3], [1, 4], [3, 0], [3, 2], [2, 4]];   // как в главе 4: 79–20, 20–14, 20–24, 20–22, 24–79, 24–14, 14–22
  const photo5 = cd => [cd.x, cd.y - CH5 / 2 + 15 + PS5 / 2], pin5 = cd => [cd.x, cd.y - CH5 / 2 + 4];
  const PHC5 = { x: 560, y: 860, s: 1200 }, Q0 = { x: 540, y: 960, z: 1, r: 0 };   // какой квадрат кадра океана видно в фото 2022
  const JCAM = [850, 770, 1.9];   // камера стыка 4 → 5: последний кадр главы 4 = кадр главы 5 за 1/30 с до начала
  let T7 = null, K7 = null, KJ5 = null, CORK5 = null, COVER = null;
  // ---------- доска ----------
  function corkImg5() { if (CORK5) return CORK5; CORK5 = mk(WW, 1400); const g = CORK5.getContext('2d'); g.fillStyle = '#b07a4a'; g.fillRect(0, 0, WW, 1400);
    for (let y = 10, r = 0; y < 1400; y += 22, r++) for (let x = (r % 2) * 11; x < WW; x += 22) { if (H1(x * .37 + y * 1.13) > .55) continue; g.fillStyle = 'rgba(120,72,35,.35)'; g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill() } return CORK5 }
  function wallBg5(c) { c.fillStyle = '#2a1d14'; c.fillRect(-4000, -4000, 9000, 9000); c.fillStyle = 'rgba(255,255,255,.03)'; for (let x = -4000; x < 5000; x += 140) c.fillRect(x, -4000, 4, 9000) }
  function boardWall5(c, noWall) {
    if (!noWall) wallBg5(c);
    const B = BRD5, im = corkImg5();
    c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(B.x0 + 18, B.y0 + 26, B.x1 - B.x0, B.y1 - B.y0);
    c.save(); rr(c, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 14); fill(c, '#5b3d26'); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); c.clip();
    for (let yy = B.y0; yy < B.y1; yy += 1400) for (let xx = B.x0; xx < B.x1; xx += 1080) c.drawImage(im, xx, yy); c.restore();
    rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); lnS(c, 3, 'rgba(241,230,214,.4)');
    c.save(); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); c.clip(); const g = c.createRadialGradient(540, 420, 120, 540, 700, 1100); g.addColorStop(0, 'rgba(255,236,190,.12)'); g.addColorStop(1, 'rgba(20,12,6,.38)'); c.fillStyle = g; c.fillRect(B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0); c.restore();
  }
  function marker5(c, x, y, s, seed) { c.save(); c.translate(x, y); c.lineCap = 'round';
    [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(seed + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke(); c.restore() }); c.restore() }
  function pin5d(c, x, y) { circ(c, x + 2, y + 4, 10, 'rgba(0,0,0,.35)'); circ(c, x, y, 10, '#dc2626'); circ(c, x - 3, y - 3, 3.6, '#fca5a5') }
  function thread5(c, a, b, k = 1, o = {}) { if (k <= 0) return; const [x1, y1] = pin5(a), [x2, y2] = pin5(b), x = lp(x1, x2, k), y = lp(y1, y2, k);
    c.save(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(x + 3, y + 6); c.stroke(); c.strokeStyle = o.col || '#dc2626'; c.lineWidth = o.w || 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x, y); c.stroke();
    if (o.pulse !== undefined && o.pulse > 0 && o.pulse < 1) { const u = o.pulse, px = lp(x1, x2, u), py = lp(y1, y2, u); glow(c, px, py, 46, '#FFE7B0', .9); circ(c, px, py, 7, '#FFF6DA') } c.restore() }
  function photo1979(c, x, y, s) { c.fillStyle = '#1b2142'; c.fillRect(x - s / 2, y - s / 2, s, s); c.save(); c.translate(x - s * .12, y + s * .08); c.scale(s / 240, s / 240);
    poly(c, [-38, 20, 38, 20, 56, 56, -56, 56]); fill(c, '#38bdf8'); poly(c, [-14, -80, 14, -80, 14, -30, 60, 60, -60, 60, -14, -30]); c.strokeStyle = '#e0f2fe'; c.lineWidth = 5; c.stroke();
    poly(c, [96, 30, 120, 8, 146, 26, 140, 58, 108, 60]); fill(c, '#F4F1EA'); poly(c, [120, 8, 146, 26, 128, 38]); fill(c, '#FFFFFF'); c.restore() }
  function photo2020(c, x, y, s) { c.fillStyle = '#1e2138'; c.fillRect(x - s / 2, y - s / 2, s, s); rr(c, x - s * .12, y - s * .32, s * .24, s * .64, s * .08); fill(c, B2.mango);
    poly(c, [x - s * .12, y + s * .02, x + s * .12, y - s * .1, x + s * .12, y + s * .32, x - s * .12, y + s * .32]); fill(c, B2.ice2); rr(c, x - s * .07, y - s * .42, s * .14, s * .12, 6); fill(c, '#2a2f55') }
  function photo1924(c, x, y, s) {   // v21.2: две пачки главы 3 — мягкая 1920-х и Flip-Top 1950-х, без HeatSticks
    c.fillStyle = '#1b1f3a'; c.fillRect(x - s / 2, y - s / 2, s, s); beam(c, x, y - s / 2, x, y + s * .3, 10, s * .5, '#FFE6B8', .14);
    c.fillStyle = 'rgba(200,230,255,.25)'; c.fillRect(x - s / 2, y + s * .3, s, 4); c.fillStyle = '#14172E'; c.fillRect(x - s / 2, y + s * .3 + 4, s, s);
    c.save(); c.translate(x, y); c.scale(s / 240, s / 240); softPack(c, -86, -16, 64, 96, 12, { shadow: false }); mPack(c, 10, -24, 64, 104, 12, { shadow: false }); c.restore();
  }
  function photo2014(c, x, y, s) {   // кофейня главы 4: айкос у карты США на столе
    c.fillStyle = '#6B4A34'; c.fillRect(x - s / 2, y - s / 2, s, s); c.save(); c.translate(x, y); c.scale(s / 240, s / 240);
    c.save(); c.rotate(-.08); rr(c, -100, -74, 196, 128, 4); fill(c, '#EDE3CC'); c.translate(-90, -62); c.scale(1, .95);   // контур США
    const US = [0, 10, 2, 40, 8, 70, 20, 92, 40, 100, 60, 98, 75, 106, 90, 120, 100, 108, 110, 96, 125, 98, 138, 96, 146, 118, 150, 96, 156, 80, 166, 62, 172, 44, 180, 30, 176, 22, 160, 30, 150, 34, 140, 26, 128, 30, 118, 20, 100, 16, 60, 12, 20, 8];
    poly(c, US); fill(c, '#C9B892'); poly(c, US); lnB(c, 1.8, '#7A6A4A'); c.restore();
    iqos4(c, 10, 72, 130, { shadow: false, ang: -.12 }); c.restore();
  }
  function oceanIn(c, x, y, s, tO) {   // кадр океана (камера (540, 960, 1), без параллакса) в квадрате со стороной s
    const k = s / PHC5.s; c.save(); c.beginPath(); c.rect(x - s / 2, y - s / 2, s, s); c.clip(); c.translate(x, y); c.scale(k, k); c.translate(-PHC5.x, -PHC5.y); oceanWorld(c, tO, Q0); c.restore();
  }
  function card5(c, t, cd, o = {}) {
    const [px, py] = photo5(cd);
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW5 / 2, -CH5 / 2, CW5, CH5, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW5 / 2, cd.y - CH5 / 2, CW5, CH5, 6); fill(c, '#f5f0e6'); rr(c, cd.x - CW5 / 2, cd.y - CH5 / 2, CW5, CH5, 6); lnS(c, 3, '#2b2638');
    c.save(); c.beginPath(); c.rect(px - PS5 / 2, py - PS5 / 2, PS5, PS5); c.clip();
    if (cd.id === '1979') photo1979(c, px, py, PS5); else if (cd.id === '2020') photo2020(c, px, py, PS5); else if (cd.id === '1924') photo1924(c, px, py, PS5);
    else if (cd.id === '2014') photo2014(c, px, py, PS5); else oceanIn(c, px, py, PS5, o.tO ?? -50);
    if (o.flash > 0) { c.fillStyle = `rgba(255,246,218,${.55 * o.flash})`; c.fillRect(px - PS5 / 2, py - PS5 / 2, PS5, PS5) }
    c.restore();
    if (cd.id === '2022' && o.cover !== undefined) coverDraw(c, t, px, py, o.cover);
    tx(c, cd.a, cd.x, cd.y + CH5 / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' });
    if (o.label !== false) tx(c, TEXT[cd.bk], cd.x, cd.y + CH5 / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW5 - 24, a: o.label ?? 1 });
  }
  // маркер на фото 2022 (как в конце главы 4) — осыпается кусками: k 0 — целый, 1 — осыпался
  function coverImg() { if (COVER) return COVER; COVER = mk(PS5, PS5); const g = COVER.getContext('2d'); rr(g, 0, 0, PS5, PS5, 2); fill(g, '#17171c'); marker5(g, PS5 / 2, PS5 / 2, PS5, C22.x); return COVER }
  function coverDraw(c, t, px, py, k) {
    if (k <= 0) { c.drawImage(coverImg(), px - PS5 / 2, py - PS5 / 2); return } if (k >= 1) return;
    const im = coverImg(), n = 6, d = PS5 / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const s0 = .05 + .5 * H1(i * 7.1 + j * 3.3) * (1 - j / n * .5), u = cl((k - s0) / .45); if (u >= 1) continue;
      const x = px - PS5 / 2 + i * d, y = py - PS5 / 2 + j * d; c.save(); c.translate(x + d / 2 + (H1(i + j * 9) - .5) * 90 * u, y + d / 2 + 520 * u * u); c.rotate((H1(i * 3 + j) - .5) * 4 * u); c.globalAlpha *= 1 - at(u, .7, 1);
      c.drawImage(im, i * d, j * d, d, d, -d / 2 - .5, -d / 2 - .5, d + 1, d + 1); c.restore() }
  }
  function boardWorld5(c, t, o = {}) {
    boardWall5(c, o.noWall);
    if (o.titleStrip) o.titleStrip(c);
    if (o.threads !== false) THR5.forEach(([i, j], n) => { const kk = o.thrK ? o.thrK(n) : 1; thread5(c, CARDS5[i], CARDS5[j], kk, { pulse: o.pulse ? o.pulse(n) : undefined }) });
    CARDS5.forEach((cd, i) => card5(c, t, cd, { tO: o.tO, cover: cd.id === '2022' ? o.cover : undefined, flash: o.flash ? o.flash(i) : 0 }));
    CARDS5.forEach(cd => pin5d(c, ...pin5(cd)));
  }
  // ---------- кадр океана поверх доски: фото 2022 ↔ весь экран ----------
  function photoOver5(c, q, e, tO) {   // e: 0 — океан на весь экран (камера (540, 960, 1)), 1 — океан в фото 2022 на доске (камера доски q)
    const [px, py] = photo5(C22), P = { x: (px - q.x) * q.z + 540, y: (py - q.y) * q.z + 960, s: PS5 * q.z };
    const S = { x: lp(540, P.x, e), y: lp(960, P.y, e), w: lp(WW, P.s, e), h: lp(HH, P.s, e) }, Vh = lp(HH, PHC5.s, e), k = S.h / Vh, V = { x: lp(540, PHC5.x, e), y: lp(960, PHC5.y, e) };
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); c.rect(S.x - S.w / 2, S.y - S.h / 2, S.w, S.h); c.clip(); c.translate(S.x, S.y); c.scale(k, k); c.translate(-V.x, -V.y); oceanWorld(c, tO, Q0); c.restore();
  }
  // ---------- фильм: начало главы ----------
  function boardStartInit() { KJ5 = [KY(-2.0, 562, 668, .965), KY(0, ...JCAM), KY(.55, 850, 762, 2.6), KY(1.15, 850, 760, 4.6)]; T0.j0 = 1.15 }
  function boardStartShot(c, t) {
    const q = camObj(camAt(KJ5, t)), cov = at(t, 0, .62);
    layer(c, q, 1, cc => boardWorld5(cc, t, { tO: t, cover: cov }));
    const e = eio(at(t, .5, 1.15)); if (e > 0) photoOver5(c, q, 1 - e, t);
  }
  // ---------- вода поднимается (конец строки 11): за ней — тот же ночной океан ----------
  function flood5(c, t, k, tO) {
    if (k <= 0) return; const e = eio(k), fy = lp(HH + 80, -120, e), wv = x => fy + 26 * Math.sin(x / 120 + t * 4) + 14 * Math.sin(x / 47 - t * 3);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); c.moveTo(0, HH + 200); for (let x = 0; x <= WW; x += 20) c.lineTo(x, wv(x)); c.lineTo(WW, HH + 200); c.closePath(); c.clip();
    oceanWorld(c, tO, Q0); c.restore();
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); for (let x = 0; x <= WW; x += 20) { const y = wv(x); x ? c.lineTo(x, y) : c.moveTo(x, y) } lnB(c, 10, 'rgba(201,220,242,.85)'); c.restore();
  }
  // ---------- строка 12 (фильм) и концовка шортса ----------
  function boardInit5() {
    const a = { j: T6.jout }; T7 = a; a.fl1 = a.j + .62; a.sh1 = a.fl1 + .75; a.tOff = MODE === 'y' ? 200 : TLX.endT + 1 / 30;
    if (MODE === 'y') { const w = q => Ws('s12', q); Object.assign(a, { kazh: w('каждая'), dosk: w('доске'), nov: w('новый'), bros: w('бросить'), ost: w('осталось'), per: w('перевернуть'), dosk2: w('доску'), sB: SB('s12') }) }
    else { const w = q => Ws('q', q); Object.assign(a, { ugad: w('угадаете'), obor: w('обороте'), dos: w('доски'), vEnd: TLX.vEnd, end: TLX.endT + 1 / 30 }) }
    if (MODE === 'y') K7 = [KY(a.fl1, 850, 760, 3.0), KY(a.sh1, 700, 690, 1.25), KY(a.dosk + .2, 560, 680, .94), KY(a.ost, 548, 660, .92), KY(a.dosk2 + .4, 540, 610, .86)];
    else K7 = [KY(a.fl1, 850, 760, 3.0), KY(a.sh1, 700, 690, 1.25), KY(a.sh1 + .7, 560, 690, .92), KY(a.vEnd + .15, 560, 680, .9), KY(a.end - .62, 760, 730, 1.6), KY(a.end, 850, 760, 4.6)];
  }
  function turnK(t) { const a = T7; if (MODE === 'y') return 0; const u = at(t, a.obor - .3, a.obor + 1.0); return u > 0 && u < 1 ? 1.92 * Math.sin(Math.PI * u) : 0 }   // шортс: поворот доски на ребро и обратно (рад)
  function boardShot5(c, t) {
    const a = T7, tO = t - a.tOff;
    if (t < a.fl1) { schoolShot(c, t); flood5(c, t, at(t, a.j, a.fl1), tO); return }
    const q = camObj(camAt(K7, Math.min(t, K7[K7.length - 1][0])));
    const pulse = MODE === 'y' ? (n => at(t, a.nov - .1 + n * .05, a.bros + .2 + n * .05)) : undefined;
    const flash = MODE === 'y' ? undefined : (i => Math.sin(Math.PI * at(t, a.fl1 + .15 + i * .08, a.fl1 + .5 + i * .08)));   // шортс: пока кадр сжимается в фото — значки вспыхивают, нити уходят за доску
    const thrK = MODE === 'y' ? undefined : (n => 1 - eio(at(t, a.fl1 + .35 + n * .03, a.obor - .35)));
    const ang = turnK(t), sx = Math.cos(ang);
    c.save(); layer(c, q, 1, cc => {
      if (Math.abs(sx) < .999) { wallBg5(cc); cc.save(); cc.translate(540, 0); cc.scale(sx, 1); cc.translate(-540, 0); if (sx < 0) boardBack5(cc, t, { ring: 1 }); else boardWorld5(cc, t, { tO, threads: false, noWall: true }); cc.restore() }
      else boardWorld5(cc, t, { tO, pulse, flash, thrK });
      if (MODE === 'y' && t > a.ost) curlCorner(cc, t);
    }); c.restore();
    const e = eio(at(t, a.fl1, a.sh1)); if (e < 1) photoOver5(c, q, e, tO);
    if (MODE !== 'y') {   // шортс: штамп и нырок в фото 2022 = кадр 0
      const ks = at(t, a.vEnd - .05, a.vEnd + .25) * (1 - at(t, a.end - .75, a.end - .5)); if (ks > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); stamp5(c, TEXT.yt, 540, 330, ks, '#D6334D', -.08); c.restore() }
      const ed = eio(at(t, a.end - .62, TLX.endT)); if (ed > 0) photoOver5(c, q, 1 - ed, tO);   // в последнем кадре океан — ровно на весь экран (шов петли)
    }
  }
  // ---------- изнанка доски (шортс — мельком; фильм — финал) ----------
  function boardBack5(c, t, o = {}) {
    const B = BRD5; c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(B.x0 + 18, B.y0 + 26, B.x1 - B.x0, B.y1 - B.y0);
    rr(c, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 14); fill(c, '#3a2a1e'); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); fill(c, '#241912');
    c.fillStyle = 'rgba(255,255,255,.04)'; for (let x = B.x0 + 40; x < B.x1 - 40; x += 60) c.fillRect(x, B.y0 + 22, 2, B.y1 - B.y0 - 44);
    CARDS5.forEach(cd => { const [x, y] = pin5(cd); circ(c, 1080 - x, y, 7, '#0e0a07'); ring(c, 1080 - x, y, 8, 'rgba(255,220,180,.25)', 2) });
    if (o.ring) snakeRing(c, t, 540, 640, 300, o.ring, {});
  }
  // красное кольцо змеи, кусающей свой хвост: центр (x, y), радиус R, k — сколько кольца нарисовано (0..1)
  function snakeRing(c, t, x, y, R, k, o) {
    if (k <= 0) return; const a0 = -Math.PI / 2 + .22, a1 = a0 + (TAU - .44) * eo(k), n = 90;
    c.save(); c.lineCap = 'round';
    for (let i = 0; i < n; i++) { const u0 = i / n, u1 = (i + 1) / n, b0 = lp(a0, a1, u0), b1 = lp(a0, a1, u1), w = lp(10, 30, Math.min(1, u0 * 3)) * (1 - .3 * Math.pow(u0, 6));
      c.strokeStyle = i % 6 < 3 ? '#D6334D' : '#B8263D'; c.lineWidth = w; c.beginPath(); c.arc(x, y, R, b0, b1 + .01); c.stroke() }
    if (k > .9) { const hx = x + Math.cos(a1) * R, hy = y + Math.sin(a1) * R; c.save(); c.translate(hx, hy); c.rotate(a1 + Math.PI / 2);   // голова кусает хвост
      c.beginPath(); c.ellipse(0, 0, 30, 22, 0, 0, TAU); fill(c, '#D6334D'); circ(c, 8, -10, 5, '#FFE7B0'); circ(c, 9, -10, 2.4, '#141010');
      c.beginPath(); c.moveTo(24, -4); c.lineTo(40, -14); c.moveTo(24, 6); c.lineTo(40, 14); lnB(c, 4, '#D6334D'); c.restore() }
    c.restore();
  }
  // ---------- фильм: «Осталось перевернуть саму доску» — правый нижний угол загибается ----------
  function curlK(t) { const a = T7; return eio(at(t, a.per - .1, a.dosk2 + .35)) * .55 }
  function curlCorner(c, t) {
    const k = curlK(t); if (k <= 0) return; const B = BRD5, L = lp(0, 340, k), x = B.x1, y = B.y1;
    c.save(); poly(c, [x - L, y, x, y, x, y - L]); fill(c, '#2a1d14');   // под загибом — стена
    poly(c, [x - L, y, x - L * 1.02, y - L * 1.02, x, y - L]); fill(c, '#3a2a1e'); c.save(); poly(c, [x - L, y, x - L * 1.02, y - L * 1.02, x, y - L]); c.clip();
    c.fillStyle = 'rgba(255,220,180,.08)'; for (let i = 0; i < 6; i++) c.fillRect(x - L * 1.1 + i * 50, y - L * 1.1, 2, L * 1.2); c.restore();
    poly(c, [x - L, y, x - L * 1.02, y - L * 1.02, x, y - L]); lnB(c, 3, 'rgba(255,236,190,.35)'); c.restore();
  }
  function boardCues5(Q) {
    const a = T7; Q(a.j + .05, 'wave', .5); Q(a.j + .3, 'splash', .45); Q(a.fl1 + .1, 'whoosh', .4); Q(a.sh1 - .1, 'papers', .3); Q(a.sh1, 'plop', .3);
    if (MODE === 'y') { Q(a.nov - .1, 'shimmer', .35); Q(a.per, 'pageflip', .4); Q(a.per + .3, 'papers', .3) }
    else { for (let i = 0; i < 5; i++) Q(a.ugad - .1 + i * .12, 'plop', .25, -.4 + i * .2); Q(a.ugad + .8, 'chain', .35); Q(a.obor - .3, 'whoosh', .45); Q(a.obor + .2, 'deep', .35); Q(a.obor + .8, 'whoosh', .35); Q(a.vEnd, 'stamp', .55); Q(a.end - .6, 'dive', .5); Q(a.end - .2, 'wave', .35) }
  }
