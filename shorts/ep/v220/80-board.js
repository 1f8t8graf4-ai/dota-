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
  const JCAM = [540, 640, .88];   // v22.2: камера стыка 4 → 5 — вся доска целиком (без обрезанных карточек у краёв кадра); последний кадр главы 4 = кадр главы 5 за 1/30 с до начала
  let T7 = null, K7 = null, KJ5 = null, CORK5 = null, COVER = null, IMG14 = null;
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
  function oceanIn(c, x, y, s, tO, noTin) {   // кадр океана (камера (540, 960, 1), без параллакса) в квадрате со стороной s
    const k = s / PHC5.s; c.save(); c.beginPath(); c.rect(x - s / 2, y - s / 2, s, s); c.clip(); c.translate(x, y); c.scale(k, k); c.translate(-PHC5.x, -PHC5.y); oceanWorld(c, tO, Q0, { noTin }); c.restore();
  }
  function card5(c, t, cd, o = {}) {
    const [px, py] = photo5(cd);
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW5 / 2, -CH5 / 2, CW5, CH5, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW5 / 2, cd.y - CH5 / 2, CW5, CH5, 6); fill(c, '#f5f0e6'); rr(c, cd.x - CW5 / 2, cd.y - CH5 / 2, CW5, CH5, 6); lnS(c, 3, '#2b2638');
    c.save(); c.beginPath(); c.rect(px - PS5 / 2, py - PS5 / 2, PS5, PS5); c.clip();
    if (cd.id === '1979') photo1979(c, px, py, PS5); else if (cd.id === '2020') photo2020(c, px, py, PS5); else if (cd.id === '1924') photo1924(c, px, py, PS5);
    else if (cd.id === '2014') { if (IMG14 && IMG14.complete && IMG14.naturalWidth) c.drawImage(IMG14, px - PS5 / 2, py - PS5 / 2, PS5, PS5); else photo2014(c, px, py, PS5) } else oceanIn(c, px, py, PS5, o.tO ?? -50, o.noTin);   // v22.2: 2014 — то же фото кофейни, что в конце главы 4 (ep/v210-ph2014.png)
    if (o.flash > 0) { c.fillStyle = `rgba(255,246,218,${.55 * o.flash})`; c.fillRect(px - PS5 / 2, py - PS5 / 2, PS5, PS5) }
    c.restore();
    if (cd.id === '2022' && o.cover !== undefined) coverDraw(c, t, px, py, o.cover);
    tx(c, cd.a, cd.x, cd.y + CH5 / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' });
    if (o.label !== false) tx(c, TEXT[cd.bk], cd.x, cd.y + CH5 / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW5 - 24, a: o.label ?? 1 });
  }
  // маркер на фото 2022 (как в конце главы 4) — осыпается кусками: k 0 — целый, 1 — осыпался
  function coverImg() { if (COVER) return COVER; COVER = mk(PS5 * 3, PS5 * 3); const g = COVER.getContext('2d'); g.scale(3, 3); rr(g, 0, 0, PS5, PS5, 2); fill(g, '#17171c'); marker5(g, PS5 / 2, PS5 / 2, PS5, C22.x); return COVER }   // v22.1: в 3 раза чётче — на стыке камера близко
  function coverDraw(c, t, px, py, k) {
    if (k <= 0) { c.save(); c.beginPath(); c.rect(px - PS5 / 2, py - PS5 / 2, PS5, PS5); c.clip(); rr(c, px - PS5 / 2, py - PS5 / 2, PS5, PS5, 2); fill(c, '#17171c'); marker5(c, px, py, PS5, C22.x); c.restore(); return }   // целый — вектором, как в главе 4 (стык 4 → 5)
    if (k >= 1) return;
    const im = coverImg(), n = 6, d = PS5 / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const s0 = .05 + .5 * H1(i * 7.1 + j * 3.3) * (1 - j / n * .5), u = cl((k - s0) / .45); if (u >= 1) continue;
      const x = px - PS5 / 2 + i * d, y = py - PS5 / 2 + j * d; c.save(); c.translate(x + d / 2 + (H1(i + j * 9) - .5) * 90 * u, y + d / 2 + 520 * u * u); c.rotate((H1(i * 3 + j) - .5) * 4 * u); c.globalAlpha *= 1 - at(u, .7, 1);
      c.drawImage(im, i * d * 3, j * d * 3, d * 3, d * 3, -d / 2 - .5, -d / 2 - .5, d + 1, d + 1); c.restore() }
  }
  function boardWorld5(c, t, o = {}) {
    boardWall5(c, o.noWall);
    if (o.titleStrip) o.titleStrip(c);
    if (o.threads !== false) THR5.forEach(([i, j], n) => { const kk = o.thrK ? o.thrK(n) : 1; thread5(c, CARDS5[i], CARDS5[j], kk, { pulse: o.pulse ? o.pulse(n) : undefined }) });
    CARDS5.forEach((cd, i) => card5(c, t, cd, { tO: o.tO, cover: cd.id === '2022' ? o.cover : undefined, flash: o.flash ? o.flash(i) : 0, noTin: o.noTin }));
    CARDS5.forEach(cd => pin5d(c, ...pin5(cd)));
  }
  // ---------- кадр океана поверх доски: фото 2022 ↔ весь экран ----------
  function photoOver5(c, q, e, tO) {   // e: 0 — океан на весь экран (камера (540, 960, 1)), 1 — океан в фото 2022 на доске (камера доски q)
    const [px, py] = photo5(C22), P = { x: (px - q.x) * q.z + 540, y: (py - q.y) * q.z + 960, s: PS5 * q.z };
    const S = { x: lp(540, P.x, e), y: lp(960, P.y, e), w: lp(WW, P.s, e), h: lp(HH, P.s, e) }, Vh = lp(HH, PHC5.s, e), k = S.h / Vh, V = { x: lp(540, PHC5.x, e), y: lp(960, PHC5.y, e) };
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); c.rect(S.x - S.w / 2, S.y - S.h / 2, S.w, S.h); c.clip(); c.translate(S.x, S.y); c.scale(k, k); c.translate(-V.x, -V.y); oceanWorld(c, tO, Q0); c.restore();
  }
  // ---------- фильм: начало главы (v22.4, ФИНАЛЬНОЕ ТЗ мейн — стык 4 → 5) ----------
  // Голосовой мостик b0 «Но после провала с айкосом они сделали ход ещё хитрее.»: из булавки 2014 в реальном времени натягивается красная нить
  // к закрытой 2022 · СНЮС (провисает, у булавки 2022 дрожит и замирает), камера едет вдоль нити и встаёт на карточке 2022 (короткая выдержка — без
  // размытия). На «ход» из левого нижнего угла поднимается тёмно-синяя волна в 3 тона с белой пеной, на гребне качается белая баночка; гребень
  // срывает заглушку с фото 2022 (кувырком улетает вправо), вода растёт и накрывает кадр; вода уходит вниз — над ней тот же ночной океан, баночка
  // всплывает, линия воды ложится на передний вал кадра 0. b1 «А в Америку…» — на входе в океан (T0.j0, 20-ocean.js).
  // Ключи KS5 до τ = 0,6 — общие с концом главы 4 (ep/v210/80-board.js, KS): последний кадр главы 4 = кадр главы 5 за 1/30 с до начала.
  const KS5 = [[-1.2, 230, 760, 860 / 240], [-.55, 290, 742, 2.05], [0, 360, 724, 1.62], [.6, 455, 716, 1.5]];
  let J5 = null;
  function boardStartInit() {
    const w = q => Ws('b0', q), J = J5 = { no: w('но'), hod: w('ход'), e: SB('b0'), j0: T0.j0 };
    J.th0 = J.no - .06; J.th1 = Math.max(1.25, WsB('b0', 'айкосом')); J.fix = J.th1 + .42;   // нить 2014 → 2022; камера встала на 2022
    J.w0 = Math.max(J.fix + .12, J.hod - .05); J.cov = Math.min(J.j0 - .3, Math.max(J.e + .08, J.w0 + 1.35)); J.hitT = J.w0 + .445 * (J.cov - J.w0);   // волна: подъём → накрыла кадр; гребень у заглушки
    KJ5 = [...KS5.map(k => KY(...k)), KY(J.th1 - .36, 712, 731, 1.64), KY(J.fix, 850, 765, 2.35)];
  }
  function pullThread5(c, t, J) {   // нить тянется от булавки 2014: провисает, у булавки 2022 дрожит и замирает
    const k = eio(at(t, J.th0, J.th1)); if (k <= 0) return;
    const [x1, y1] = pin5(CARDS5[2]), [x2, y2] = pin5(C22), x = lp(x1, x2, k), y = lp(y1, y2, k);
    const tw = t > J.th1 ? 20 * Math.exp(-5 * (t - J.th1)) * Math.sin(24 * (t - J.th1)) : 0, sag = 52 * Math.sin(Math.PI * k) + tw, mx = (x1 + x) / 2, my = (y1 + y) / 2 + sag;
    c.save(); c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.quadraticCurveTo(mx + 3, my + 6, x + 3, y + 6); lnB(c, 4, 'rgba(0,0,0,.28)');
    c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(mx, my, x, y); lnB(c, 4, '#dc2626');
    if (k < 1) { glow(c, x, y, 24, '#FFB0B0', .55); circ(c, x, y, 4.5, '#FFE0E0') }
    c.restore();
  }
  // ---------- волна (экранные координаты): три слоя — дальние светлее и выше-левее, ближний тёмный с пеной, губой и баночкой;
  // гребень идёт по кривой из левого нижнего угла вверх-вправо, позади гребня вода поднимается до его высоты — к J.cov весь кадр под водой ----------
  const WV = [[-240, 1680], [140, 1080], [640, 760], [1360, -280]], WCOL = [C5.sea2, C5.sea1, C5.sea0];
  function waveCrest(ue) { const a = 1 - ue; return [0, 1].map(i => a * a * a * WV[0][i] + 3 * a * a * ue * WV[1][i] + 3 * a * ue * ue * WV[2][i] + ue * ue * ue * WV[3][i]) }
  function waveSurf(x, cx, cy, s, ue, t) {
    if (x >= cx) { const d = (x - cx) / (290 * s); return cy + 940 * s * d * d }   // передний склон — вогнутый, книзу круче
    const d = (cx - x) / (1000 * s), hb = lp(430, 0, ss(.3, 1, ue)) * s;   // задний склон — пологий: вода за гребнем поднимается до его высоты
    return cy + hb * Math.pow(d, 1.15) + 10 * s * Math.sin(x / 64 + t * 6) * Math.min(1, d * 4);
  }
  function lip5(c, cx, cy, s) {   // губа гребня загибается вперёд: светлая, под ней тёмная «трубка», по кромке — пена
    c.save(); c.translate(cx, cy); c.scale(s, s);
    c.beginPath(); c.moveTo(-70, 10); c.bezierCurveTo(-24, -46, 96, -52, 156, 4); c.bezierCurveTo(184, 32, 174, 84, 136, 102); c.bezierCurveTo(152, 64, 128, 40, 94, 44);
    c.bezierCurveTo(58, 48, 34, 76, 20, 120); c.lineTo(-30, 130); c.closePath(); fill(c, C5.sea2);
    c.beginPath(); c.moveTo(20, 120); c.bezierCurveTo(34, 76, 58, 48, 94, 44); c.bezierCurveTo(128, 40, 152, 64, 136, 102); c.bezierCurveTo(112, 118, 86, 132, 70, 170); c.closePath(); fill(c, '#0A1838');
    c.beginPath(); c.moveTo(-70, 10); c.bezierCurveTo(-24, -46, 96, -52, 156, 4); c.bezierCurveTo(184, 32, 174, 84, 136, 102); lnB(c, 16, C5.foam);
    c.beginPath(); c.moveTo(-50, -2); c.bezierCurveTo(-10, -38, 80, -44, 136, -8); lnB(c, 6, '#FFFFFF');
    for (let i = 0; i < 7; i++) circ(c, 172 - i * 6 + (i % 2) * 10, 30 + i * 12, 9 - i * .8, C5.foam);   // пена срывается с кончика губы
    c.restore();
  }
  function crestTin(c, t, cx, cy, s, sink) {   // белая баночка на гребне: качается, потом гребень уходит вперёд и её затягивает под воду
    const R = 112 * s, x = cx - 34 * s - sink * 90 * s, y = cy - 76 * s + sink * 360 * s, r = .22 * Math.sin(t * 7.4) - .1;
    c.save(); c.translate(x, y); c.rotate(r); tin5(c, 0, 0, R, .48 + .07 * Math.sin(t * 5.1), 0, { shc: 'rgba(4,8,26,.35)' }); c.restore();
  }
  function foamCap(c, S, x0, x1, w, t, ph) {   // сплошная пенная шапка вдоль поверхности S на [x0, x1]: толщина w(x), неровный верх, белая кромка
    if (x1 <= x0) return; const n = Math.max(8, Math.ceil((x1 - x0) / 7)), top = [], bot = [];
    for (let i = 0; i <= n; i++) { const x = lp(x0, x1, i / n), r = w(x), y = S(x); top.push([x, y - r * (1 + .3 * Math.sin(x / 9 + t * 8 + ph * 1.7))]); bot.push([x, y + r * .45]) }
    c.beginPath(); top.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); for (let i = bot.length - 1; i >= 0; i--) c.lineTo(bot[i][0], bot[i][1]); c.closePath(); fill(c, C5.foam);
    c.beginPath(); top.forEach(([x, y], i) => i ? c.lineTo(x, y + 2) : c.moveTo(x, y + 2)); lnB(c, 3, '#FFFFFF');
  }
  function waveIn5(c, t, J, q) {
    const u = at(t, J.w0, J.cov); if (u <= 0) return; const ue = u * u * (3 - 2 * u), [cx, cy] = waveCrest(ue), s = lp(1, 1.7, ue), sink = at(ue, .6, .8);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    if (sink > 0) crestTin(c, t, cx, cy, s, sink);   // уже под водой
    for (let L = 0; L < 3; L++) {   // слои: 0 — дальний (светлее, выше-левее), 2 — ближний
      const ox = (L - 2) * 58 * s * (1 - at(ue, .8, 1)), oy = (L - 2) * 50 * s * (1 - at(ue, .8, 1)), S = x => waveSurf(x - ox, cx, cy, s, ue, t + L * .7) + oy;
      const path = () => { c.beginPath(); c.moveTo(-140, 2300); for (let x = -140; x <= 1220; x += 8) c.lineTo(x, S(x)); c.lineTo(1220, 2300); c.closePath() };
      const surf = () => { c.beginPath(); for (let x = -140; x <= 1220; x += 8) { const y = S(x); x === -140 ? c.moveTo(x, y) : c.lineTo(x, y) } };
      path(); fill(c, WCOL[L]);
      if (L === 2) { c.save(); path(); c.clip(); surf(); lnB(c, 150 * s, C5.sea1); surf(); lnB(c, 52 * s, C5.sea2);
        for (let i = 0; i < 14; i++) { const bx = -40 + 1160 * H1(i * 5.3), by = S(bx) + 60 * s + lp(900, 0, (t * .8 + H1(i * 2.1)) % 1) * s; circ(c, bx + 6 * Math.sin(t * 5 + i), by, (4 + 7 * H1(i + 6)) * s, 'rgba(201,220,242,.18)') }   // пузыри в толще воды
        c.restore() }
      const fx0 = cx + ox, nF = L === 2 ? 1 : .55;   // пена на гребне слоя
      foamCap(c, S, fx0 - 380 * s * nF, fx0 + 8 * s, x => (2 + 13 * Math.pow(cl(1 - (fx0 - x) / (380 * s * nF)), .8)) * s * nF, t, L);
    }
    lip5(c, cx, cy, s);
    if (sink <= 0) crestTin(c, t, cx, cy, s, 0);
    for (let i = 0; i < 24; i++) { const f = (t * 1.9 + H1(i * 3.3)) % 1, bx = cx + (50 + 180 * H1(i)) * s, by = cy - (10 + 130 * H1(i + 4)) * s;   // брызги впереди гребня
      circ(c, bx + 80 * s * f, by - 130 * s * f + 100 * s * f * f, (3 + 5 * H1(i + 9)) * s, rgba('#E6F0FF', .85 * (1 - f))) }
    coverFly5(c, t, J, q);
    c.restore();
  }
  function coverFly5(c, t, J, q) {   // заглушка с фото 2022 сорвана гребнем — кувырком улетает вправо-вверх, брызги веером
    const tau = t - J.hitT; if (tau < 0 || tau > .9) return; const [px, py] = photo5(C22), X = (px - q.x) * q.z + 540, Y = (py - q.y) * q.z + 960, S0 = PS5 * q.z;
    for (let i = 0; i < 26; i++) { const an = -Math.PI * .1 - Math.PI * .75 * H1(i * 5.1), v = (500 + 900 * H1(i * 2.7)) * tau, x = X - S0 * .45 + Math.cos(an) * v, y = Y + Math.sin(an) * v + 1400 * tau * tau;
      circ(c, x, y, (4 + 7 * H1(i + 3)) * (1 - at(tau, .2, .7)), rgba('#E6F0FF', .9 * (1 - at(tau, .25, .7)))) }
    const a = 1 - at(tau, .42, .62); if (a <= 0) return;
    c.save(); c.globalAlpha *= a; c.translate(X + 1150 * tau + 500 * tau * tau, Y - 980 * tau + 420 * tau * tau); c.rotate(2.4 * tau); const k = 1 - .3 * at(tau, 0, .7), fy = .62 + .38 * Math.cos(5.2 * tau);   // v23.5: кувырок без ребра — не сжимается в чёрную полоску
    c.scale(1, fy); c.drawImage(coverImg(), -S0 * k / 2, -S0 * k / 2, S0 * k, S0 * k); c.restore();
  }
  function surface5(c, t, J) {   // вода уходит вниз: над ней ночной океан (кадр 0), баночка всплывает; линия воды ложится на передний вал кадра 0
    const k = at(t, J.cov, J.j0); if (k <= 0) return; const e = eo(k), base = lp(-170, 1330, e), L = x => base + 30 * Math.sin(x / 160 + t * 1.7);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    c.save(); c.beginPath(); c.moveTo(-100, -100); c.lineTo(1180, -100); for (let x = 1180; x >= -100; x -= 20) c.lineTo(x, L(x)); c.closePath(); c.clip(); oceanWorld(c, t, Q0); c.restore();
    c.beginPath(); c.moveTo(-700, 2400); for (let x = -700; x <= 1800; x += 20) c.lineTo(x, L(x)); c.lineTo(1800, 2400); c.closePath(); fill(c, C5.sea0);
    for (let i = 0; i < 16; i++) { const bx = 60 + 960 * H1(i * 7.7), by = lp(1900, base + 40, (t * .9 + H1(i * 1.9)) % 1); if (by > L(bx) + 20) circ(c, bx + 8 * Math.sin(t * 6 + i), by, (5 + 9 * H1(i + 2)) * (1 - k * .6), 'rgba(201,220,242,.22)') }   // пузыри
    c.beginPath(); for (let x = -700; x <= 1800; x += 20) { const y = L(x); x === -700 ? c.moveTo(x, y) : c.lineTo(x, y) } lnB(c, 5, 'rgba(201,220,242,.55)');
    const fo = 1 - at(k, .5, 1); if (fo > 0) foamCap(c, x => L(x) - 2, -40, 1120, x => (5 + 5 * Math.sin(x / 37 + 1.3)) * fo + 2 * fo, t, 3);   // пена на кромке тает к кадру 0
    c.restore();
  }
  function boardStartShot(c, t) {
    const J = J5, q = camObj(camAt(KJ5, t)), off = t >= J.hitT;
    layer(c, q, 1, cc => { boardWorld5(cc, t, { tO: t, cover: off ? 1 : 0, thrK: n => n === 6 ? 0 : 1, noTin: true }); pullThread5(cc, t, J); CARDS5.forEach(cd => pin5d(cc, ...pin5(cd))) });   // нить 14 → 22 тянется отдельно, булавки — поверх неё
    waveIn5(c, t, J, q); surface5(c, t, J);
  }
  function boardStartCues(Q) {
    const J = J5; Q(J.th0, 'whip', .28, -.4); Q(J.th1 - .05, 'plop', .3, .3); Q(J.th1, 'whip', .22, .3);
    Q(J.w0 - .15, 'wave', .55, -.5); Q(J.hitT, 'splash', .55, .1); Q(J.hitT + .02, 'papers', .3, .4); Q(J.cov - .25, 'wave', .45); Q(J.cov, 'deep', .4); Q(J.j0 - .2, 'splash', .35);
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
    // v22.4: строки 12 в фильме больше нет — после строки 11 вода, фото 2022, плавный отъезд на всю доску, дальше финал (90-final.js)
    if (MODE !== 'y') { const w = q => Ws('q', q); Object.assign(a, { ugad: w('угадаете'), obor: w('стоит'), dos: w('снюсом'), vEnd: TLX.vEnd, end: TLX.endT + 1 / 30 }) }   // v22.4: вопрос «Угадаете, кто на самом деле стоит за…» — доска на ребро на «стоит»
    if (MODE === 'y') K7 = [KY(a.fl1, 850, 760, 3.0), KY(a.sh1, 700, 690, 1.25), KY(Math.min(a.sh1 + .7, Ws('f1', 'так') - .25), 556, 664, .93)];
    else K7 = [KY(a.fl1, 850, 760, 3.0), KY(a.sh1, 700, 690, 1.25), KY(a.sh1 + .7, 560, 690, .92), KY(a.vEnd + .15, 560, 680, .9), KY(a.end - .62, 760, 730, 1.6), KY(a.end, 850, 760, 4.6)];
  }
  function turnK(t) { const a = T7; if (MODE === 'y') return 0; const u = at(t, Math.max(a.obor - .3, a.sh1 + .05), a.obor + 1.0); return u > 0 && u < 1 ? 1.92 * Math.sin(Math.PI * u) : 0 }   // шортс: поворот доски на ребро и обратно (рад); v22.2 — когда фото уже легло в карточку
  function boardShot5(c, t) {
    const a = T7, tO = t - a.tOff;
    if (t < a.fl1) { schoolShot(c, t); flood5(c, t, at(t, a.j, a.fl1), tO); return }
    const q = camObj(camAt(K7, Math.min(t, K7[K7.length - 1][0])));
    const pulse = undefined;   // v22.4: импульс по нитям был на строке 12 — её нет
    const flash = MODE === 'y' ? undefined : (i => Math.sin(Math.PI * at(t, a.fl1 + .15 + i * .08, a.fl1 + .5 + i * .08)));   // шортс: пока кадр сжимается в фото — значки вспыхивают, нити уходят за доску
    const thrK = MODE === 'y' ? undefined : (n => 1 - eio(at(t, a.fl1 + .35 + n * .03, a.obor - .35)));
    const ang = turnK(t), sx = Math.cos(ang);
    c.save(); layer(c, q, 1, cc => {
      if (Math.abs(sx) < .999) { wallBg5(cc); flipBoard(cc, ang, g => boardWorld5(g, t, { tO, threads: false, noWall: true }), g => boardBack5(g, t, { teaser: 1 })) }   // v22.2: настоящий 3D-поворот, на изнанке — уроборос с натянутыми нитями
      else boardWorld5(cc, t, { tO, pulse, flash, thrK });
    }); c.restore();
    const e = eio(at(t, a.fl1, a.sh1)); if (e < 1) photoOver5(c, q, e, tO);
    if (MODE !== 'y') {   // шортс: штамп и нырок в фото 2022 = кадр 0
      const ks = at(t, a.vEnd - .05, a.vEnd + .25) * (1 - at(t, a.end - .75, a.end - .5)); if (ks > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); stamp5(c, TEXT.yt, 540, 330, ks, '#D6334D', -.08); c.restore() }
      const ed = eio(at(t, a.end - .62, TLX.endT)); if (ed > 0) photoOver5(c, q, 1 - ed, tO);   // в последнем кадре океан — ровно на весь экран (шов петли)
    }
  }
  // ---------- v22.2: изнанка доски — фанера с волокнами, рамка, светлые контуры-отпечатки пяти карточек, острия пяти булавок ----------
  const BPIN = () => CARDS5.map(cd => { const [x, y] = pin5(cd); return [1080 - x, y] });   // на изнанке всё зеркально
  function boardBack5(c, t, o = {}) {
    const B = BRD5; c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(B.x0 + 18, B.y0 + 26, B.x1 - B.x0, B.y1 - B.y0);
    rr(c, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 14); fill(c, '#3A2A1E'); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); fill(c, '#2A1E15');
    c.save(); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); c.clip();
    for (let k = 0; k < 34; k++) { const y0 = B.y0 + 30 + k * 30 + H1(k) * 10; c.beginPath(); for (let x = B.x0; x <= B.x1; x += 30) { const yy = y0 + 6 * Math.sin(x / (90 + H1(k * 3) * 70) + k) + 3 * Math.sin(x / 23 + k * 2); x === B.x0 ? c.moveTo(x, yy) : c.lineTo(x, yy) }
      lnB(c, 1.2 + H1(k * 7) * 1.2, `rgba(255,220,180,${.035 + H1(k * 5) * .05})`) }   // волокна фанеры
    for (let k = 0; k < 4; k++) { const cx = B.x0 + 140 + H1(k * 9.1) * 860, cy = B.y0 + 120 + H1(k * 4.4) * 780; c.beginPath(); c.ellipse(cx, cy, 26, 12, H1(k) * 2, 0, TAU); lnB(c, 1.4, 'rgba(255,220,180,.08)') }   // сучки
    const g = c.createRadialGradient(540, 560, 120, 540, 640, 900); g.addColorStop(0, 'rgba(255,236,190,.06)'); g.addColorStop(1, 'rgba(0,0,0,.35)'); c.fillStyle = g; c.fillRect(B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0);
    CARDS5.forEach(cd => { const x = 1080 - cd.x, y = cd.y; c.save(); c.setLineDash([10, 7]); rr(c, x - CW5 / 2, y - CH5 / 2, CW5, CH5, 6); lnB(c, 2, 'rgba(255,236,200,.16)');
      c.setLineDash([]); c.strokeStyle = 'rgba(255,236,200,.1)'; c.lineWidth = 1.5; c.strokeRect(x - PS5 / 2, y - CH5 / 2 + 15, PS5, PS5); c.restore() });   // отпечатки карточек
    c.restore();
    rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); lnS(c, 3, 'rgba(241,230,214,.22)');
    BPIN().forEach(([x, y]) => { circ(c, x, y, 13, 'rgba(0,0,0,.4)'); circ(c, x, y, 7, '#1A120C'); c.save(); c.translate(x, y); c.rotate(-.7);   // остриё булавки сквозь доску
      const gg = c.createLinearGradient(-4, 0, 4, 0); gg.addColorStop(0, '#E6EAF0'); gg.addColorStop(1, '#7A8096'); c.fillStyle = gg; poly(c, [-3.5, 0, 3.5, 0, 0, -26]); c.fill(); c.restore(); circ(c, x - 4, y - 9, 2, 'rgba(255,255,255,.85)') });
    if (o.teaser) backTeaser(c, t, o.teaser);
  }
  // ---------- v22.2: строгий графичный уроборос — алое тело с бордовой тенью и светлыми гранями-ромбами, сужается к хвосту;
  // угловатая голова с белыми клыками и прищуром намертво смыкается на кончике хвоста (кольцо без разрыва) ----------
  const OUR = { red: '#B8122C', redL: '#E0344B', redD: '#5E0A18', facet: '#CC1E37', ln: 'rgba(255,226,226,.6)' };
  function ouroBody(c, x, y, R, o = {}) {   // o.w — толщина у шеи, o.a0 — кончик хвоста (угол), o.gap — зазор под голову, o.kw 0..1 — толщина растёт
    const a0 = o.a0 ?? (-Math.PI / 2 + .06), span = TAU - (o.gap ?? .13), n = 180, W = (o.w ?? 46) * (o.kw ?? 1), tail = u => lp(.14, 1, Math.pow(u, .5)) * (u > .97 ? lp(1, .86, (u - .97) / .03) : 1);
    const pt = (u, d) => { const a = a0 + span * u, r = R + d + (o.wv ? o.wv * Math.sin(TAU * (u * 7 - (o.ph || 0))) : 0); return [x + Math.cos(a) * r, y + Math.sin(a) * r] };   // v22.3: o.wv — волна вдоль тела (ползёт)
    const band = (d0, d1) => { c.beginPath(); for (let i = 0; i <= n; i++) { const u = i / n, w = W * tail(u) / 2, [px, py] = pt(u, w * d1); i ? c.lineTo(px, py) : c.moveTo(px, py) }
      for (let i = n; i >= 0; i--) { const u = i / n, w = W * tail(u) / 2, [px, py] = pt(u, w * d0); c.lineTo(px, py) } c.closePath() };
    band(-1, 1); fill(c, OUR.red); band(-1, -.15); fill(c, OUR.redD); band(.72, 1); fill(c, OUR.redL);   // 3 тона: алый, бордовая тень внутри, свет по внешнему краю
    if ((o.kw ?? 1) > .55) {   // грани-ромбы (чешуя): по одной на толщину тела, через одну — чуть светлее
      let u = .03, k = 0; while (u < .975) { const w = W * tail(u) / 2; if (w > 7) { const du = w * 1.7 / (R * span), [p0x, p0y] = pt(u - du / 2, 0), [p1x, p1y] = pt(u, w * .7), [p2x, p2y] = pt(u + du / 2, 0), [p3x, p3y] = pt(u, -w * .7);
          c.beginPath(); c.moveTo(p0x, p0y); c.lineTo(p1x, p1y); c.lineTo(p2x, p2y); c.lineTo(p3x, p3y); c.closePath();
          const gw = o.gl == null ? 0 : Math.exp(-Math.pow((((u - o.gl) % 1 + 1.5) % 1 - .5) / .06, 2));   // v22.3: перелив чешуек — светлая волна бежит по телу
          if (k % 2 || gw > .05) { c.fillStyle = `rgba(255,${120 + 90 * gw | 0},${130 + 80 * gw | 0},${.16 + .5 * gw})`; c.fill() } lnB(c, 1.3, OUR.ln);
          u += du * 1.02 } else u += .01; k++ } }
    band(-1, 1); lnB(c, 2, 'rgba(255,226,226,.4)');
    return { head: pt(1, 0), ang: a0 + span + Math.PI / 2, tailTip: pt(0, 0) };
  }
  function ouroHead(c, x, y, ang, s, jaw = 0) {   // угловатая ромбовидная голова, нос — по ходу кольца (к хвосту); jaw 0 — челюсти сомкнуты на хвосте, 1 — раскрыты
    c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
    const op = jaw * .35;
    const up = [[-70, -22], [-44, -46], [6, -44], [48, -22], [80, -2 - 18 * op], [18, 1 - 12 * op], [-40, 1]], lo = [[-70, 22], [-44, 44], [10, 38], [52, 16], [76, 3 + 18 * op], [18, -1 + 12 * op], [-40, -1]];   // сомкнуты: щели нет
    poly(c, lo.flat()); fill(c, OUR.redD); poly(c, up.flat()); fill(c, OUR.red);
    poly(c, [-44, -46, 6, -44, 48, -22, -2, -26]); fill(c, OUR.redL); poly(c, [-70, -22, -44, -46, -2, -26, -40, -8]); fill(c, OUR.facet);   // светлые грани сверху
    c.beginPath(); c.moveTo(-34, 0); c.lineTo(78, 0); lnB(c, 2.2, 'rgba(40,4,12,.85)');   // линия пасти
    c.fillStyle = '#FFF6F0'; poly(c, [40, -3 - 11 * op, 49, -3 - 11 * op, 44.5, 9]); c.fill(); poly(c, [22, -3 - 9 * op, 30, -3 - 9 * op, 26, 8]); c.fill();   // клыки впиваются в хвост
    poly(c, [32, 3 + 11 * op, 40, 3 + 11 * op, 36, -8]); c.fill();
    c.beginPath(); c.moveTo(-18, -26); c.lineTo(14, -32); lnB(c, 5, '#FFD9A0'); c.beginPath(); c.moveTo(-12, -26.5); c.lineTo(8, -30); lnB(c, 2, '#2A0A10');   // узкий прищур
    poly(c, up.flat()); lnB(c, 2, OUR.ln); poly(c, lo.flat()); lnB(c, 2, OUR.ln); c.beginPath(); c.moveTo(-60, -14); c.lineTo(-10, -22); c.lineTo(40, -14); lnB(c, 1.2, 'rgba(255,226,226,.45)');
    c.restore();
  }
  function ouro5(c, t, x, y, R, o = {}) {   // целиком: тело, голова на кончике хвоста
    const r = ouroBody(c, x, y, R, o); if ((o.kh ?? 1) <= 0) return r;
    const s = (o.hs ?? R / 330) * bo(Math.min(1, o.kh ?? 1)); ouroHead(c, r.head[0], r.head[1], r.ang, s, o.jaw ?? 0); return r;
  }
  function backTeaser(c, t, k) {   // шортс: на изнанке — прямые нити от булавок к центру и строгий уроборос вокруг
    const C = { x: 540, y: 660 }, P = BPIN(); c.save(); c.globalAlpha *= k;
    P.forEach(([px, py]) => { c.beginPath(); c.moveTo(px, py); c.lineTo(C.x, C.y); lnB(c, 5, '#D6334D'); c.beginPath(); c.moveTo(px + 2, py + 3); c.lineTo(C.x + 2, C.y + 3); lnB(c, 2, 'rgba(0,0,0,.25)') });
    ouro5(c, t, C.x, C.y, 230, { w: 40, hs: .8, gap: .14 }); c.restore();
  }
  // ---------- v22.2: 3D-поворот доски вокруг вертикали (полосками, с перспективой); изнанка — зеркально ----------
  let BFC = null, BBC = null; const FLR = { x0: -80, y0: 90, w: 1240, h: 1110, ax: 540, cy: 640 };
  function flipBoard(c, ang, drawFront, drawBack) {
    const R = FLR, ca = Math.cos(ang), sa = Math.sin(ang), front = ca >= 0;
    if (front && !BFC) BFC = mk(R.w, R.h); if (!front && !BBC) BBC = mk(R.w, R.h);
    const src = front ? BFC : BBC, g = src.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, R.w, R.h); g.translate(-R.x0, -R.y0); (front ? drawFront : drawBack)(g);
    const n = 96, D = 2600, prj = xs => { const X = xs * ca, Z = xs * sa, f = D / (D + Z); return [R.ax + X * f, f] };
    for (let i = 0; i < n; i++) {
      const u0 = i / n, u1 = (i + 1) / n, [x0, f0] = prj(R.x0 + u0 * R.w - R.ax), [x1, f1] = prj(R.x0 + u1 * R.w - R.ax), dw = Math.abs(x1 - x0); if (dw < .05) continue;
      const f = (f0 + f1) / 2, sx = front ? u0 * R.w : (1 - u1) * R.w;
      c.drawImage(src, sx, 0, R.w / n + .5, R.h, Math.min(x0, x1) - .3, R.cy - (R.cy - R.y0) * f, dw + .6, R.h * f);
    }
    const sh = (1 - Math.abs(ca)) * .55; if (sh > .01) { const [xl, fl] = prj(R.x0 - R.ax), [xr, fr] = prj(R.x0 + R.w - R.ax);   // свет уходит, когда доска поворачивается ребром
      c.save(); c.globalAlpha *= sh; poly(c, [xl, R.cy - (R.cy - R.y0) * fl, xr, R.cy - (R.cy - R.y0) * fr, xr, R.cy + (R.y0 + R.h - R.cy) * fr, xl, R.cy + (R.y0 + R.h - R.cy) * fl]); fill(c, '#050407'); c.restore() }
    if (Math.abs(ca) < .14) { const e = 1 - Math.abs(ca) / .14; c.save(); c.globalAlpha *= e; rr(c, R.ax - 10, R.y0 + 30, 20, R.h - 60, 6); fill(c, '#3A2A1E'); c.fillStyle = 'rgba(255,230,200,.25)'; c.fillRect(R.ax - 10, R.y0 + 30, 4, R.h - 60); c.restore() }   // ребро доски
  }
  // ---------- фильм: «Осталось перевернуть саму доску» — правый нижний угол загибается ----------
  function curlK(t) { const a = T7; return a.per === undefined ? 0 : eio(at(t, a.per - .1, a.dosk2 + .35)) * .55 }   // v22.4: угол загибался на строке 12 — её нет, доска переворачивается молча
  function curlCorner(c, t) {
    const k = curlK(t); if (k <= 0) return; const B = BRD5, L = lp(0, 340, k), x = B.x1, y = B.y1;
    c.save(); poly(c, [x - L, y, x, y, x, y - L]); fill(c, '#2a1d14');   // под загибом — стена
    poly(c, [x - L, y, x - L * 1.02, y - L * 1.02, x, y - L]); fill(c, '#3a2a1e'); c.save(); poly(c, [x - L, y, x - L * 1.02, y - L * 1.02, x, y - L]); c.clip();
    c.fillStyle = 'rgba(255,220,180,.08)'; for (let i = 0; i < 6; i++) c.fillRect(x - L * 1.1 + i * 50, y - L * 1.1, 2, L * 1.2); c.restore();
    poly(c, [x - L, y, x - L * 1.02, y - L * 1.02, x, y - L]); lnB(c, 3, 'rgba(255,236,190,.35)'); c.restore();
  }
  function boardCues5(Q) {
    const a = T7; Q(a.j + .05, 'wave', .5); Q(a.j + .3, 'splash', .45); Q(a.fl1 + .1, 'whoosh', .4); Q(a.sh1 - .1, 'papers', .3); Q(a.sh1, 'plop', .3);
    if (MODE === 'y') Q(a.sh1 + .1, 'whoosh', .3);
    else { for (let i = 0; i < 5; i++) Q(a.ugad - .1 + i * .12, 'plop', .25, -.4 + i * .2); Q(a.ugad + .8, 'chain', .35); Q(a.obor - .3, 'whoosh', .45); Q(a.obor + .2, 'deep', .35); Q(a.obor + .8, 'whoosh', .35); Q(a.vEnd, 'stamp', .55); Q(a.end - .6, 'dive', .5); Q(a.end - .2, 'wave', .35) }
  }
