  // ================= СЦЕНА 6: синие чертежи и кран → корпус торцом = 16 картриджей =================
  function blueprintBg(c, t, dark = 0) {
    c.fillStyle = mixc('#1e3a8a', '#0f1d44', dark); c.fillRect(-200, -200, WW + 400, HH + 400);
    c.lineWidth = 1.5; c.strokeStyle = rgba('#93c5fd', .14); c.beginPath(); for (let x = 0; x <= WW; x += 30) { c.moveTo(x, 0); c.lineTo(x, HH) } for (let y = 0; y <= HH; y += 30) { c.moveTo(0, y); c.lineTo(WW, y) } c.stroke();
    c.lineWidth = 3; c.strokeStyle = rgba('#bfdbfe', .2); c.beginPath(); for (let x = 0; x <= WW; x += 150) { c.moveTo(x, 0); c.lineTo(x, HH) } for (let y = 0; y <= HH; y += 150) { c.moveTo(0, y); c.lineTo(WW, y) } c.stroke();
    c.fillStyle = rgba('#dbeafe', .5); for (let x = 0; x <= WW; x += 30) c.fillRect(x, 0, 2, x % 150 ? 10 : 22);   // засечки
    vignette(c, .45, '5,10,30');
  }
  function crane(c, t, a = 1) {   // жёлто-чёрная балка под потолком, 3 лебёдки на цепях с паллетами
    if (a <= 0) return; c.save(); c.globalAlpha *= a;
    c.save(); rr(c, -40, 240, WW + 80, 50, 6); c.clip(); c.fillStyle = '#facc15'; c.fillRect(-40, 240, WW + 80, 50); c.fillStyle = '#111827';
    for (let i = -2; i < 30; i++) { poly(c, [i * 60, 240, i * 60 + 30, 240, i * 60 + 10, 290, i * 60 - 20, 290]); c.fill() } c.restore();
    for (let i = 0; i < 3; i++) {
      const x = ((t - K.grew) * 110 + i * 400 + 1200) % 1400 - 160, sw = Math.sin(t * 2.2 + i) * .04;
      rr(c, x - 40, 286, 80, 34, 6); fill(c, '#475569'); circ(c, x - 22, 290, 9, '#1f2937'); circ(c, x + 22, 290, 9, '#1f2937');
      c.save(); c.translate(x, 320); c.rotate(sw); c.strokeStyle = '#94a3b8'; c.lineWidth = 5; c.setLineDash([10, 6]); c.beginPath(); c.moveTo(-30, 0); c.lineTo(-70, 150); c.moveTo(30, 0); c.lineTo(70, 150); c.stroke(); c.setLineDash([]);
      rr(c, -100, 150, 200, 96, 8); fill(c, '#2563eb'); for (let j = 0; j < 5; j++) { rr(c, -86 + j * 36, 162, 26, 56, 6); fill(c, BOXC[(j + i) % 8]) }
      tx(c, 'ЭКСПОРТ', 0, 232, { f: 'O', w: 700, s: 16, c: '#fff', ls: 2 }); c.restore();
    }
    c.restore();
  }
  function sheetDraw(c, i, t) {   // белый лист 760×680 с синей схемой (координаты листа: центр 0,0)
    rr(c, -380, -340, 760, 680, 10); fill(c, '#f8fafc'); c.strokeStyle = rgba('#1e40af', .12); c.lineWidth = 1;
    c.beginPath(); for (let x = -380; x <= 380; x += 40) { c.moveTo(x, -340); c.lineTo(x, 340) } for (let y = -340; y <= 340; y += 40) { c.moveTo(-380, y); c.lineTo(380, y) } c.stroke();
    c.strokeStyle = '#1e40af'; c.lineWidth = 5; c.fillStyle = 'rgba(37,99,235,.12)';
    if (i === 0) {   // бак 13 мл против картриджа 0,7 мл
      rr(c, -230, -230, 200, 420, 40); c.fill(); c.stroke(); c.fillStyle = 'rgba(14,165,233,.45)'; rr(c, -214, -120, 168, 294, 30); c.fill();
      rr(c, 90, 70, 60, 120, 14); c.fillStyle = 'rgba(249,115,22,.4)'; c.fill(); c.stroke();
      tx(c, 'БАК: 13 МЛ', 170, -150, { f: 'U', w: 800, s: 40, c: '#1e3a8a', mw: 330 }); tx(c, 'JUUL: 0,7 МЛ', 120, 230, { f: 'O', w: 700, s: 30, c: '#ea580c' });
      tx(c, 'В 18 РАЗ БОЛЬШЕ', 170, -86, { f: 'O', w: 700, s: 30, c: '#2563eb' });
    } else if (i === 1) {   // двойная сетка
      [-140, 140].forEach(cx => { rr(c, cx - 90, -170, 180, 300, 30); c.stroke(); c.save(); rr(c, cx - 90, -170, 180, 300, 30); c.clip(); c.lineWidth = 2; c.beginPath(); for (let k = -400; k < 400; k += 22) { c.moveTo(cx + k, -170); c.lineTo(cx + k + 300, 130); c.moveTo(cx + k, 130); c.lineTo(cx + k + 300, -170) } c.stroke(); c.restore() });
      tx(c, 'ДВОЙНАЯ СЕТКА', 0, 210, { f: 'U', w: 800, s: 44, c: '#1e3a8a' }); tx(c, 'MESH COIL × 2', 0, 266, { f: 'O', w: 700, s: 30, c: '#2563eb', ls: 3 });
    } else {   // затяжки и аккумулятор
      rr(c, -250, -200, 170, 330, 20); c.stroke(); rr(c, -200, -230, 70, 32, 8); c.stroke(); for (let k = 0; k < 4; k++) { rr(c, -230, 70 - k * 70, 130, 54, 8); c.fillStyle = k < 3 ? 'rgba(34,197,94,.55)' : 'rgba(34,197,94,.2)'; c.fill() }
      tx(c, '650 mAh', -165, 190, { f: 'O', w: 700, s: 32, c: '#1e3a8a' });
      tx(c, '5000', 140, -60, { f: 'U', w: 800, s: 110, c: '#1e3a8a' }); tx(c, 'ЗАТЯЖЕК', 140, 50, { f: 'O', w: 700, s: 40, c: '#2563eb', ls: 3 });
    }
    rr(c, -380, -340, 760, 680, 10); stroke(c, '#93c5fd', 3);
  }
  const SH = { x: 540, y: 1000 };
  function sheets(c, t) {   // три листа веером; верхний перелистывается справа налево вокруг левого края
    const flips = [K.mesh - .25, K.puffs - .25];
    const kin = eo(at(t, K.grew - .1, K.grew + .6));
    for (let i = 2; i >= 0; i--) {
      const kfl = i < 2 ? eio(at(t, flips[i], flips[i] + .55)) : 0; if (kfl >= 1) continue;
      c.save(); c.translate(SH.x + (1 - kin) * 900 + (i - 0) * 18 * (1 - (i === 0 ? 0 : 0)), SH.y + i * 14); c.rotate(-.02 + i * .03 * (1 - kfl));
      const sx = Math.cos(kfl * Math.PI); c.translate(-380, 0); c.scale(sx, 1); c.translate(380, 0);
      if (sx > 0) sheetDraw(c, i, t); else { rr(c, -380, -340, 760, 680, 10); fill(c, '#dbeafe'); rr(c, -380, -340, 760, 680, 10); stroke(c, '#93c5fd', 3) }
      c.restore();
    }
  }
  function pod(c, x, y, r, k) { c.save(); c.translate(x, y); c.rotate(r); c.scale(k, k); rr(c, -18, -36, 36, 72, 9); fill(c, '#f97316'); rr(c, -18, -36, 36, 22, 8); fill(c, '#111827'); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-12, -10, 6, 40); c.restore() }
  function cylEnd(c, t, kr, kd) {   // корпус 220×520 поворачивается торцом (R 230), растровая тень, 16 картриджей по орбите
    const x = 540, y = 860, R = lp(110, 230, kr), hgt = 520 * (1 - kr);
    if (kr > .2) {   // растровая тень вправо-вниз под 35°
      const L = 520 * ss(.2, 1, kr), ux = Math.cos(.61), uy = Math.sin(.61);
      c.save(); c.fillStyle = 'rgba(2,6,23,.55)'; for (let d = 0; d < L; d += 20) for (let w = -R; w <= R; w += 20) { const px = x + ux * (d + R * .2) - uy * w, py = y + uy * (d + R * .2) + ux * w, rr0 = 7 * (1 - d / L); if (rr0 > .5) circ(c, px, py, rr0, 'rgba(147,197,253,.30)') } c.restore();
    }
    if (hgt > 2) { const g = c.createLinearGradient(x - 110, 0, x + 110, 0); g.addColorStop(0, '#d97706'); g.addColorStop(.4, '#fbbf24'); g.addColorStop(1, '#0891b2'); c.fillStyle = g; c.fillRect(x - 110 * lp(1, R / 110, kr), y - hgt / 2, 220 * lp(1, R / 110, kr), hgt) }
    c.save(); c.translate(x, y - hgt / 2); c.scale(1, lp(.18, 1, kr)); circ(c, 0, 0, R, '#fbbf24'); ring(c, 0, 0, R - 12, '#fde68a', 6); circ(c, 0, 0, R * .32, '#111827'); c.restore();
    if (kd > 0) {   // надпись в круге
      A(c, kd, () => { circ(c, x, y, R - 22, 'rgba(15,23,42,.92)');
        tx(c, '1 ОДНОРАЗКА', x, y - 80, { f: 'U', w: 800, s: 38, c: '#fbbf24' }); tx(c, '=', x, y - 22, { f: 'U', w: 800, s: 44, c: '#fff' }); tx(c, '16 КАРТРИДЖЕЙ', x, y + 34, { f: 'U', w: 800, s: 34, c: '#fff' }); tx(c, 'JUUL · ПО НИКОТИНУ', x, y + 90, { f: 'O', w: 700, s: 24, c: '#fdba74', ls: 2 }) });
    }
  }
  function shot6(c, t) {
    // медальон-снежинка раскрывается в синюю миллиметровку
    const kx = eio(at(t, K.s6 - .1, K.s6 + .6));
    if (kx < 1) shot5(c, t);
    if (kx > 0) { c.save(); c.beginPath(); c.arc(540, 820, lp(230, 1400, kx), 0, TAU); c.clip(); blueprintBg(c, t, eio(at(t, K.nicot - .2, K.nicot + .4)));
      crane(c, t, at(t, K.grew - .4, K.grew + .2) * (1 - at(t, K.nicot - .2, K.nicot + .3)));
      // «один картридж = пачка»: эскиз белыми линиями
      const kp = at(t, K.s6 + .4, K.s6 + .9) * (1 - at(t, K.grew - .3, K.grew + .1));
      if (kp > 0) A(c, kp, () => { c.strokeStyle = '#e0f2fe'; c.lineWidth = 6; rr(c, 300, 760, 90, 220, 20); c.stroke(); rr(c, 300, 760, 90, 60, 16); c.stroke(); tx(c, '≈', 540, 870, { f: 'U', w: 800, s: 90, c: '#e0f2fe' });
        rr(c, 640, 740, 170, 250, 12); c.stroke(); c.beginPath(); c.moveTo(640, 820); c.lineTo(810, 820); c.stroke(); for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(668 + i * 29, 790, 11, 0, TAU); c.stroke() }
        tx(c, '1 КАРТРИДЖ ≈ 1 ПАЧКА', 540, 1100, { f: 'U', w: 800, s: 40, c: '#e0f2fe' }) });
      const kroll = eio(at(t, K.nicot - .2, K.nicot + .35));
      if (kroll < 1) A(c, 1 - kroll, () => { c.save(); c.translate(540, 1000); c.scale(lp(1, .3, kroll), lp(1, .7, kroll)); c.translate(-540, -1000); sheets(c, t); c.restore() });
      if (kroll > 0) A(c, kroll, () => cylEnd(c, t, eio(at(t, K.nicot + .2, K.n16 - .05)), at(t, K.n16 + .5, K.n16 + .9)));
      // 16 картриджей зажигаются по часовой
      for (let i = 0; i < 16; i++) { const a0 = -Math.PI / 2 + i * TAU / 16, k = spr(at(t, K.n16 - .05 + i * .05, K.n16 + .3 + i * .05)); if (k > 0) pod(c, 540 + Math.cos(a0) * 310, 860 + Math.sin(a0) * 310, a0 + Math.PI / 2, k) }
      c.restore();
      if (kx < 1) { c.save(); c.beginPath(); c.arc(540, 820, lp(230, 1400, kx), 0, TAU); stroke(c, '#e0f2fe', 10 * (1 - kx)); c.restore() }
    }
  }
