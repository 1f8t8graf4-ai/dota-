  // ================= СЦЕНА 8 (v18.4): монета → Луна, город поднимается снизу, общежитие в разрезе — как у World of Tanks #076 =================
  // Всё плоско: ровный тёмный фон, белая Луна без свечения, дома тремя оттенками с оранжевыми окнами, шпиль перечёркивает Луну.
  // Общежитие въезжает справа: верхний левый угол — фасад с сеткой окон, нижний правый — разрез с этажами; белые плиты и косая белая балка, как у WoT.
  // В комнатах — силуэты без лиц, голубые огоньки одноразок вспыхивают на затяжке, пар — контурными кружками; на окнах иней.
  const S8 = { bg: '#26223a', b1: '#332e4a', b2: '#3f3958', b3: '#4c4667', win: '#f4a261', ln: '#f1f5f9', slab: '#d6d1e0', inside: '#2b2638', room: '#38314c', sil: '#15121c' };
  const DM = { w: 640, top: 360, bot: 1400 };   // здание: 4 этажа по 260
  function cityRow(c, seed, base, hMin, hMax, col, winA, t) {   // ряд домов: прямоугольники, ступени крыш, окна полосками
    let x = WD ? -1700 : -60, i = 0;   // 24.11: в 16:9 город на всю ширину
    while (x < WW + (WD ? 1700 : 60)) {
      const w = 70 + H1(seed + i * 3.1) * 90, h = hMin + H1(seed + i * 5.7) * (hMax - hMin), top = base - h;
      c.fillStyle = col; c.fillRect(x, top, w + 1, h + 400);
      if (H1(seed + i * 8.3) > .6) { c.fillRect(x + w * .3, top - 40, w * .4, 42); if (H1(seed + i * 2.2) > .5) c.fillRect(x + w * .48, top - 90, 6, 52) }
      for (let r = 0; r < Math.floor(h / 46) - 1; r++) for (let q = 0; q < Math.floor((w - 20) / 26); q++) {
        const on = H1(seed * 7 + i * 13 + r * 5 + q) < winA; if (!on) continue;
        c.fillStyle = H1(seed + i + r * 3 + q * 7) > .3 ? S8.win : '#fde68a'; c.fillRect(x + 14 + q * 26, top + 28 + r * 46, 12, 18);
      }
      x += w + 6; i++;
    }
  }
  function spire(c, x, base) {   // шпиль, перечёркивает Луну
    c.fillStyle = S8.b2; c.fillRect(x - 46, base - 520, 92, 600); poly(c, [x - 46, base - 520, x, base - 700, x + 46, base - 520]); c.fill(); c.fillRect(x - 3, base - 860, 6, 170);
    for (let r = 0; r < 9; r++) { c.fillStyle = r % 3 ? S8.win : '#fde68a'; c.fillRect(x - 26, base - 480 + r * 52, 14, 22); c.fillRect(x + 12, base - 480 + r * 52, 14, 22) }
  }
  // v19.1: вместо общежития — неоновая витрина «ЛАЗЕЙКА» в инее (3 слоя: задняя стенка с инеем, подставки под софитами, стекло с бликами).
  // «Запретом хотели отнять вкус» — витрина пустая, крест-накрест красная лента ЗАПРЕТ ВКУСОВ; «а подарили» — лента рвётся, софиты зажигаются по одному:
  // ледяной кристалл WS-23 в замёрзшей колбе → прозрачный мега-бак 13 мл с двойной спиралью (Да Винчи #067) → пробирка с золотой каплей (Instagram #055).
  const VIT = { x0: 170, x1: 1030, y0: 470, y1: 1330 }, VC = [315, 600, 885];
  let W8 = null;
  function w8() { if (W8) return W8; const w = Wd; W8 = { vk: w('вкус'), pod: w('подарили'), led: w('ледяной'), gig: w('гигантские'), nik: w('никотин', 2) }; return W8 }
  function frostCorners(c, x, y, w, h, fr) { c.save(); rr(c, x, y, w, h, 8); c.clip(); [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([qx, qy], j) => { c.save(); c.translate(qx, qy); c.rotate(j === 1 ? Math.PI / 2 : j === 2 ? -Math.PI / 2 : j === 3 ? Math.PI : 0); poly(c, [0, 0, fr, 0, fr * .62, fr * .22, fr * .4, fr * .4, fr * .22, fr * .62, 0, fr]); fill(c, 'rgba(217,243,251,.85)'); c.restore() }); c.restore() }
  function item8(c, i, t, k) {   // три улики
    const cx = VC[i], g = 1130;
    c.save(); c.translate(cx, g); c.scale(k, k);
    if (i === 0) {   // замёрзшая колба, внутри ледяной кристалл
      poly(c, [-30, -330, 30, -330, 30, -230, 110, -20, -110, -20, -30, -230]); cel(c, -110, -330, 220, 310, 'rgba(124,196,224,.45)', { hw: .08, ha: .5 }); poly(c, [-30, -330, 30, -330, 30, -230, 110, -20, -110, -20, -30, -230]); lnB(c, 5, '#e0f2fe');
      c.save(); c.translate(0, -110); c.rotate(.12 * Math.sin(t * 1.4)); poly(c, [0, -80, 56, -18, 34, 64, -34, 64, -56, -18]); cel(c, -56, -80, 112, 144, '#dff6ff', { hw: .14 }); poly(c, [0, -80, 56, -18, 34, 64, -34, 64, -56, -18]); lnB(c, 4, '#ffffff'); poly(c, [0, -80, 56, -18, 0, 0]); fill(c, 'rgba(255,255,255,.7)'); c.restore();
      for (let j = 0; j < 7; j++) { const u = (t * .5 + j / 7) % 1; circ(c, -60 + H1(j) * 120, -40 - u * 260, 4 + 4 * H1(j * 3), rgba('#e0f2fe', .8 * (1 - u))) }   // ледяной пар
    } else if (i === 1) {   // мега-бак: прозрачный цилиндр, двухслойная жидкость, две спирали
      const x0 = -90, x1 = 90, yT = -420, yB = -20; rr(c, x0, yT, 180, yB - yT, 30); fill(c, 'rgba(124,196,224,.18)');
      c.save(); rr(c, x0, yT, 180, yB - yT, 30); c.clip(); liquid2(c, x0, x1, yT + 120, 9, t, yB + 10); c.restore();
      [-36, 36].forEach(xx => { c.beginPath(); for (let j = 0; j <= 18; j++) c.lineTo(xx + (j % 2 ? 16 : -16), yB - 200 + j * 9); lnB(c, 5, '#ff8a3d') });
      rr(c, x0, yT, 180, yB - yT, 30); lnB(c, 5, '#e0f2fe'); c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(x0 + 18, yT + 40, 14, yB - yT - 80);
      rr(c, -50, yT - 50, 100, 54, 12); cel(c, -50, yT - 50, 100, 54, '#2d3142', { hw: .14 }); rr(c, -50, yT - 50, 100, 54, 12); lnB(c, 4);
    } else {   // пробирка с золотой каплей
      c.save(); c.rotate(-.1); rr(c, -34, -380, 68, 360, 34); fill(c, 'rgba(124,196,224,.22)'); c.save(); rr(c, -34, -380, 68, 360, 34); c.clip(); c.fillStyle = '#f2b84b'; c.fillRect(-34, -150 + 6 * Math.sin(t * 5), 68, 200); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-24, -150, 10, 120); c.restore();
      rr(c, -34, -380, 68, 360, 34); lnB(c, 5, '#e0f2fe'); rr(c, -42, -396, 84, 26, 8); fill(c, '#9aa3b5'); lnB(c, 3); c.restore();
      const u = (t * .9) % 1; drop(c, 26, -560 + u * 380, 16 + 6 * (1 - u), '#f2b84b'); glow(c, 0, -170, 160, '#fde68a', .25);
    }
    c.restore();
  }
  function vitrine(c, t, kd) {
    const W = w8(), { x0, x1, y0, y1 } = VIT, w = x1 - x0, h = y1 - y0;
    c.save(); c.translate(0, 1400 * (1 - kd));
    castDots(c, x0, y0, w, h, 150, { st: 18 });
    rr(c, x0 - 24, y0 - 24, w + 48, h + 48, 26); cel(c, x0 - 24, y0 - 24, w + 48, h + 48, '#2c2742', { hw: .02, sw: .12 }); rr(c, x0 - 24, y0 - 24, w + 48, h + 48, 26); lnS(c, 5, S8.slab);
    // вывеска: неон загорается на «подарили»
    const on = at(t, W.pod - .1, W.pod + .15) * (t < W.pod + .5 ? (Math.sin(t * 70) > -.4 ? 1 : .35) : 1);
    rr(c, x0 + 150, y0 - 4, w - 300, 110, 16); fill(c, '#120f1f'); rr(c, x0 + 150, y0 - 4, w - 300, 110, 16); lnS(c, 4, S8.slab);
    if (on > 0) glow(c, 600, y0 + 52, 360, '#ff5d8a', .32 * on); tx(c, 'ЛАЗЕЙКА', 600, y0 + 56, { f: 'U', w: 800, s: 66, c: mixc('#4a2f3f', '#ff7aa0', on), ls: 8, mw: w - 360 });
    VC.forEach((cx, i) => {
      const L = cx - 125, T = y0 + 140, CWd = 250, CHt = h - 170, tl = [W.led, W.gig, W.nik][i], kl = at(t, tl - .3, tl - .05), ki = spr(at(t, tl - .15, tl + .45));
      // 1 слой: задняя стенка, рейки, иней
      rr(c, L, T, CWd, CHt, 10); fill(c, '#211d35'); for (let j = 1; j < 5; j++) { c.fillStyle = 'rgba(255,255,255,.04)'; c.fillRect(L + j * 52, T, 3, CHt) }
      frostCorners(c, L, T, CWd, CHt, 70 + 50 * at(t, K.s8, K.b0));
      // 2 слой: софит, подставка
      if (kl > 0) { beam(c, cx, T + 12, cx, 1140, 26, 150, '#fde68a', .22 * kl); circ(c, cx, T + 16, 14, mixc('#4b4560', '#fde68a', kl)) } else circ(c, cx, T + 16, 14, '#4b4560');
      c.beginPath(); c.ellipse(cx, 1150, 104, 22, 0, 0, TAU); fill(c, '#3d3757'); rr(c, cx - 104, 1150, 208, 70, 6); cel(c, cx - 104, 1150, 208, 70, '#3d3757', { hw: .05 }); c.beginPath(); c.ellipse(cx, 1150, 104, 22, 0, 0, TAU); fill(c, '#57507a'); lnS(c, 3, S8.slab);
      if (ki > 0) item8(c, i, t, ki);
      // 3 слой: стекло с бликами
      c.save(); rr(c, L, T, CWd, CHt, 10); c.clip(); c.fillStyle = 'rgba(255,255,255,.07)'; poly(c, [L + 20, T + CHt, L + 120, T, L + 160, T, L + 60, T + CHt]); c.fill(); poly(c, [L + 150, T + CHt, L + 250, T, L + 262, T, L + 162, T + CHt]); c.fill(); c.restore();
      rr(c, L, T, CWd, CHt, 10); lnS(c, 4, '#8f88a3');
    });
    // подписи улик
    const lab = [['WS-23', 'СИНТЕТИЧЕСКИЙ ЛЁД', W.led], ['13 МЛ', '5 000 ЗАТЯЖЕК', W.gig], ['НИКОТИН', 'БЕЗ ТАБАКА', W.nik]];   // подписи в две строки — внутри своей ячейки
    lab.forEach(([a1, a2, tl], i) => { const k = bo(at(t, tl + .1, tl + .45)); if (k <= 0) return; c.save(); c.translate(VC[i], 1262); c.scale(k, k);
      rr(c, -112, -34, 224, 68, 10); fill(c, i === 2 ? B2.gold : B2.ice); rr(c, -112, -34, 224, 68, 10); lnS(c, 3, B2.ink);
      tx(c, a1, 0, -12, { f: 'U', w: 800, s: 26, c: B2.ink, mw: 200 }); tx(c, a2, 0, 16, { f: 'M', w: 800, s: 17, c: B2.ink, mw: 200 }); c.restore() });
    // красная лента «ЗАПРЕТ ВКУСОВ» крест-накрест: на «подарили» рвётся и падает
    const kt = eo(at(t, K.s8 + .9, K.s8 + 1.3)), kf = at(t, W.pod - .2, W.pod + .7);
    if (kt > 0 && kf < 1) [[-.5, 1], [.5, -1]].forEach(([a, sd], j) => { c.save(); c.translate(600 + sd * 260 * kf * kf, 900 + 1300 * kf * kf); c.rotate(a + sd * 1.2 * kf); c.scale(kt, 1);
      rr(c, -560, -42, 1120, 84, 4); cel(c, -560, -42, 1120, 84, B2.red, { hw: .02, hi: false, sw: .0001 }); rr(c, -560, -42, 1120, 84, 4); lnS(c, 3, '#ffd5dc');
      for (let q = -1; q <= 1; q++) tx(c, 'ЗАПРЕТ ВКУСОВ', q * 370, 3, { f: 'U', w: 800, s: 30, c: '#fff', ls: 2, mw: 280 }); [-185, 185].forEach(x => circ(c, x, 0, 7, '#ffd5dc')); c.restore() });   // v19.3: надписи на ленте не слипаются (1:17)
    c.restore();
  }
  const MOON = { x: 210, y: 290, r: 86 };
  function moon8(c, x, y, r, col = '#f8fafc') { circ(c, x, y, r, col); circ(c, x - r * .3, y - r * .2, r * .18, '#e2e8f0'); circ(c, x + r * .3, y + r * .25, r * .13, '#e2e8f0') }
  function shot8(c, t) {
    // 75.5–76.5: касса уезжает вниз, монета летит по дуге и становится Луной; город поднимается снизу; общежитие въезжает справа
    const p = eio(at(t, K.s8 - .57, K.s8 + .43));
    const kp = 1 + .05 * eo(at(t, K.s8 + .5, K.b0 + 2));   // v18.5: наезд не встаёт к доске
    const kc = eo(at(t, K.s8 - .2, K.s8 + .8)), kc2 = eo(at(t, K.s8 + .05, K.s8 + 1));
    c.save(); c.translate(600, 900); c.scale(kp, kp); c.translate(-600, -900);
    c.fillStyle = S8.bg; c.fillRect(-500, -500, WW + 1000, HH + 1000);
    for (let i = 0; i < (WD ? 70 : 26); i++) circ(c, WD ? -1100 + H1(i * 4.4) * 3300 : H1(i * 4.4) * WW, H1(i * 6.6) * 900, 2 + H1(i) * 2, rgba('#e2e8f0', .35 + .25 * Math.sin(t * 1.7 + i)));
    if (p >= 1) moon8(c, MOON.x, MOON.y, MOON.r);
    c.save(); c.translate(0, 900 * (1 - kc)); cityRow(c, 21, 1420, 260, 640, S8.b1, .25, t); spire(c, 250, 1420); c.restore();
    c.save(); c.translate(0, 900 * (1 - kc2)); cityRow(c, 7, 1420, 160, 420, S8.b2, .35, t); c.restore();
    c.fillStyle = '#1d1a2b'; c.fillRect(WL, 1400, WR - WL, 900); c.beginPath(); c.moveTo(WL, 1400); c.lineTo(WR, 1400); lnS(c, 4, S8.slab);
    const kd = bo(at(t, K.s8 + .3, K.s8 + 1.1)); if (kd > 0) vitrine(c, t, kd);
    c.restore();
    if (p < 1) {   // касса уезжает вниз целиком (без растворения), монета летит в Луну
      c.save(); c.translate(0, 1950 * p); c.beginPath(); if (WD) c.rect(WIDE.X0 - 4, WIDE.Y0 - 4, WIDE.X1 - WIDE.X0 + 8, WIDE.Y1 - WIDE.Y0 + 8); else c.rect(0, 0, WW, HH); c.clip(); b6Shot(c, t); c.restore();   // v19.3: уезжает ровно кадр — без полосы сверху (1:16)
      const x = lp(540, MOON.x, p), y = lp(850, MOON.y, p) - Math.sin(Math.PI * p) * 140, r = lp(36, MOON.r, p);
      if (p > .6) moon8(c, x, y, r, mixc('#f59e0b', '#f8fafc', ss(.6, 1, p))); else { circ(c, x, y, r, mixc('#f59e0b', '#f8fafc', p)); ring(c, x, y, r * .76, rgba('#b45309', 1 - p), 4) }
    }
  }
