  // ================= СЦЕНА 6 (v18.4): чертежи и кран как у Да Винчи #067 → корпус торцом как банка Coca-Cola #003 =================
  // Фон — ровный тёмно-синий с тонкими светлыми штрихами (как у Да Винчи). Медальон растёт в фон, золотая линия раскрывается в лист чертежа;
  // листы висят на цепях под фермой с жёлто-чёрной полосой и едут влево, между ними на крюках — синие одноразки «5000 ЗАТЯЖЕК».
  // Третий лист сворачивается в корпус: янтарный, синяя полоса, белый торец с голубой дугой и щелью мундштука; растровая тень точками; 16 картриджей по орбите.
  const S6 = { bg: '#161c3d', bg2: '#121735', ln: '#f1f5f9', ink: '#2348b8', paper: '#f4f6fb', amber: '#f59e0b', navy: '#1b2a6b', cap: '#f1f5f9' };
  function blueprintBg(c, t, dark = 0, o = {}) {   // ровный фон и штрихи света (имя прежнее: им же пользуется сцена 7)
    const ga = o.ga ?? 1;
    c.fillStyle = o.col || mixc(S6.bg, S6.bg2, dark); c.fillRect(-300, -300, WW + 600, HH + 600);
    c.save(); c.globalAlpha *= ga; c.lineCap = 'round';
    for (let i = 0; i < 26; i++) { const x = H1(i * 2.9) * WW, L = 120 + H1(i * 6.1) * 420, y = ((H1(i * 4.3) * (HH + 600) - t * (14 + 26 * H1(i))) % (HH + 600) + HH + 600) % (HH + 600) - 300;
      c.strokeStyle = rgba('#93a4e8', .07 + .07 * H1(i * 8.8)); c.lineWidth = 4 + 6 * H1(i * 3.3); c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + L); c.stroke() }
    c.restore();
  }
  function craneBeam(c, t) {   // ферма: жёлто-чёрная полоса сверху, серая решётка
    c.save(); c.beginPath(); c.rect(-60, 186, WW + 120, 26); c.clip(); c.fillStyle = '#facc15'; c.fillRect(-60, 186, WW + 120, 26); c.fillStyle = '#1f2937';
    for (let i = -2; i < 34; i++) { poly(c, [i * 44, 186, i * 44 + 22, 186, i * 44 + 4, 212, i * 44 - 18, 212]); c.fill() } c.restore();
    c.fillStyle = '#2a3156'; c.fillRect(-60, 212, WW + 120, 78);
    c.beginPath(); c.moveTo(-60, 216); c.lineTo(WW + 60, 216); c.moveTo(-60, 286); c.lineTo(WW + 60, 286);
    for (let x = -60; x < WW + 60; x += 70) { c.moveTo(x, 216); c.lineTo(x + 70, 286); c.moveTo(x + 70, 216); c.lineTo(x, 286) } lnS(c, 4, '#94a3b8');
  }
  function trolley(c, x) { rr(c, x - 40, 280, 80, 36, 6); fill(c, '#facc15'); rr(c, x - 40, 280, 80, 36, 6); lnS(c, 4, '#1f2937'); circ(c, x - 22, 284, 9, '#1f2937'); circ(c, x + 22, 284, 9, '#1f2937') }
  function sheetDraw(c, i, t) {   // белый лист 760×680 с синей схемой (координаты листа: центр 0,0), всё на листе движется
    rr(c, -380, -340, 760, 680, 10); fill(c, S6.paper); c.strokeStyle = rgba('#2348b8', .1); c.lineWidth = 1.5;
    c.beginPath(); for (let x = -380; x <= 380; x += 40) { c.moveTo(x, -340); c.lineTo(x, 340) } for (let y = -340; y <= 340; y += 40) { c.moveTo(-380, y); c.lineTo(380, y) } c.stroke();
    c.save(); c.setLineDash([14, 10]); rr(c, -352, -312, 704, 624, 6); stroke(c, rgba('#2348b8', .55), 3); c.restore();
    c.strokeStyle = '#1e40af'; c.lineWidth = 5; c.fillStyle = 'rgba(37,99,235,.12)';
    if (i === 0) {   // картридж 0,7 мл → бак растёт до 13 мл
      const kg = eio(at(t, K.grew - .1, K.grew + .8)), H = lp(120, 420, kg), Y0 = 190 - H;
      rr(c, -230, Y0, 200, H, lp(14, 40, kg)); c.fill(); c.stroke();
      const lv = lp(.2, .72, kg) * (H - 30); c.save(); rr(c, -222, Y0 + 8, 184, H - 16, lp(10, 32, kg)); c.clip(); c.fillStyle = 'rgba(14,165,233,.45)';
      c.beginPath(); c.moveTo(-240, 200); for (let x = -240; x <= -20; x += 10) c.lineTo(x, 182 - lv + Math.sin(x * .05 + t * 4) * 6); c.lineTo(-20, 200); c.closePath(); c.fill(); c.restore();
      const kj = lp(1.9, 1, eio(at(t, K.grew - .2, K.grew + .5))) * (1 + .12 * pulse2(t, w0('картридж'))), pxj = lp(60, 120, eio(at(t, K.grew - .2, K.grew + .5)));
      c.save(); c.translate(pxj, 130); c.scale(kj, kj); rr(c, -30, -60, 60, 120, 14); c.fillStyle = 'rgba(249,115,22,.4)'; c.fill(); c.stroke(); rr(c, -30, -60, 60, 26, 10); fill(c, '#1e40af');
      c.save(); rr(c, -24, -30, 48, 84, 10); c.clip(); c.fillStyle = 'rgba(249,115,22,.55)'; c.beginPath(); c.moveTo(-30, 60); for (let x = -30; x <= 30; x += 6) c.lineTo(x, -4 + Math.sin(x * .2 + t * 5) * 4); c.lineTo(30, 60); c.closePath(); c.fill(); c.restore(); c.restore();
      tx(c, 'JUUL: 0,7 МЛ', pxj, 130 + 60 * kj + 35, { f: 'O', w: 700, s: 30, c: '#ea580c' });
      const kh = spr(at(t, K.s6 + .5, K.s6 + 1)); if (kh > 0) { c.save(); c.translate(0, -255); c.scale(kh, kh); tx(c, 'КАРТРИДЖ → БАК', 0, 0, { f: 'U', w: 800, s: 44, c: '#1e3a8a' }); c.restore() }
      const kn = at(t, K.grew, w0('тринадцать')), v = lp(.7, 13, eio(kn)), vs = kn >= 1 ? '13' : (v < 10 ? v.toFixed(1).replace('.', ',') : String(Math.round(v)));
      if (kn > 0) tx(c, 'БАК: ' + vs + ' МЛ', 170, -170, { f: 'U', w: 800, s: 40, c: '#1e3a8a', mw: 330 });
      const kx = spr(at(t, w0('тринадцать') + .05, w0('тринадцать') + .45)); if (kx > 0) { c.save(); c.translate(170, -110); c.scale(kx, kx); tx(c, 'В 18 РАЗ БОЛЬШЕ', 0, 0, { f: 'O', w: 700, s: 30, c: '#2563eb' }); c.restore() }
    } else if (i === 1) {   // двойная сетка: накаляется волной
      [-140, 140].forEach((cx, j) => { rr(c, cx - 90, -170, 180, 300, 30); c.stroke(); c.save(); rr(c, cx - 90, -170, 180, 300, 30); c.clip(); c.lineWidth = 3;
        for (let k = -400; k < 400; k += 22) { const hot = .5 + .5 * Math.sin(t * 5 - k * .02 - j); c.strokeStyle = mixc('#1e40af', '#f97316', hot * at(t, K.mesh - .1, K.mesh + .4)); c.beginPath(); c.moveTo(cx + k, -170); c.lineTo(cx + k + 300, 130); c.moveTo(cx + k, 130); c.lineTo(cx + k + 300, -170); c.stroke() } c.restore() });
      tx(c, 'ДВОЙНАЯ СЕТКА', 0, 210, { f: 'U', w: 800, s: 44, c: '#1e3a8a' }); tx(c, '2 СЕТКИ НАГРЕВА', 0, 262, { f: 'O', w: 700, s: 30, c: '#2563eb', ls: 3 });
    } else {   // затяжки и аккумулятор
      rr(c, -250, -200, 170, 330, 20); c.stroke(); rr(c, -200, -230, 70, 32, 8); c.stroke();
      const ch = (t * 1.5) % 5; for (let k = 0; k < 4; k++) { rr(c, -230, 70 - k * 70, 130, 54, 8); c.fillStyle = k < ch ? 'rgba(34,197,94,.6)' : 'rgba(34,197,94,.15)'; c.fill() }
      tx(c, '650 мА·ч', -165, 190, { f: 'O', w: 700, s: 32, c: '#1e3a8a' });
      const n = Math.round(5000 * eio(at(t, K.puffs - .2, K.puffs + .7)) / 50) * 50;
      num(c, String(n), 140, -60, { f: 'U', w: 800, s: 110, c: '#1e3a8a' }); tx(c, 'ЗАТЯЖЕК', 140, 50, { f: 'O', w: 700, s: 40, c: '#2563eb', ls: 3 });
    }
    rr(c, -380, -340, 760, 680, 10); lnS(c, 4, '#c7d2fe');
  }
  const w0 = q => Wd(q);
  const SH = { x: 540, y: 1000 };
  function shiftX(t) {   // листы едут справа налево на «двойная» и «тысячи», всё время чуть плывут
    return 1100 * eio(at(t, K.mesh - .45, K.mesh + .25)) + 1100 * eio(at(t, K.puffs - .45, K.puffs + .25)) + 90 * at(t, K.s6, K.nicot);
  }
  function hookVape(c, t, x, sw, i) {   // на крюке — синяя одноразка с биркой «5000 ЗАТЯЖЕК» (вместо танков Да Винчи)
    c.save(); c.translate(x, 316); c.rotate(sw);
    c.save(); c.setLineDash([12, 7]); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 130); lnS(c, 5, '#94a3b8'); c.restore();
    c.beginPath(); c.arc(0, 146, 16, -Math.PI / 2, Math.PI * .8); lnS(c, 6, '#facc15');
    const top = 180, w = 150, h = 420;
    poly(c, [-38, top + 50, -30, top, 30, top, 38, top + 50]); fill(c, '#111827'); poly(c, [-38, top + 50, -30, top, 30, top, 38, top + 50]); lnS(c, 5);
    rr(c, -w / 2, top + 50, w, h, 36); fill(c, S6.bg);
    c.save(); rr(c, -w / 2, top + 50, w, h, 36); c.clip(); c.beginPath(); c.moveTo(-w / 2 - 4, top + 50 + h * .4); c.bezierCurveTo(-20, top + 50 + h * .32, 20, top + 50 + h * .2, w / 2 + 4, top + 50 + h * .08); c.lineTo(w / 2 + 4, top + h + 60); c.lineTo(-w / 2 - 4, top + h + 60); c.closePath(); fill(c, '#3b6fd8'); c.restore();
    rr(c, -w / 2, top + 50, w, h, 36); lnS(c, 5);
    c.save(); c.translate(0, top + 160); circ(c, 0, 0, 30, S6.bg); c.beginPath(); c.arc(0, 0, 30, 0, TAU); lnS(c, 4); c.beginPath(); for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; c.moveTo(Math.cos(a) * 16, Math.sin(a) * 16); c.lineTo(-Math.cos(a) * 16, -Math.sin(a) * 16) } lnS(c, 3, '#5eead4'); c.restore();
    c.save(); c.translate(52, top + 330); c.rotate(-.12); rr(c, -78, -24, 156, 48, 8); fill(c, '#facc15'); tx(c, '5000 ЗАТЯЖЕК', 0, 2, { f: 'O', w: 700, s: 22, c: '#1f2937' }); c.restore();
    c.restore();
  }
  function sheets(c, t, kRoll, kUp, ku) {   // листы на цепях кранов; третий лист сворачивается в корпус одноразки
    const X = shiftX(t), v = (shiftX(t + .03) - shiftX(t - .03)) / .06;
    const kb = eo(at(t, K.s6 + .5, K.s6 + 1.1));
    c.save(); c.translate(0, -1150 * kUp - 1000 * (1 - kb)); for (let i = -1; i < 3; i++) { const px = SH.x + i * 1100 + 550 - X; if (px < -300 || px > WW + 300) continue; trolley(c, px); hookVape(c, t, px, -v * 1.2e-4 + Math.sin(t * 1.9 + i) * .02, i) } c.restore();
    for (let i = 0; i < 3; i++) {
      const roll = i === 2 ? kRoll : 0, sx = lp(SH.x + i * 1100 - X, 540, roll); if (sx < -600 || sx > WW + 600) continue;
      const sw = -v * 1.1e-4 + Math.sin(t * 1.7 + i * 2) * .012, ty = -420 * kUp;
      c.save(); c.translate(0, ty - 360 * (1 - kb)); trolley(c, sx); c.restore();
      if (roll < 1) {
        c.save(); c.translate(sx, 316); c.rotate(sw * (1 - roll));
        const cy = lp(SH.y - 316, 860 - 316, roll), W = lp(760, 220, roll), H = lp(680, 520, roll), ch = i > 0 ? 1 : at(t, K.s6 + .95, K.s6 + 1.35);
        if (roll < .5 && ch > 0) { c.save(); c.setLineDash([12, 7]); dashDraw(c, ch, 400); c.beginPath(); c.moveTo(-30, 0); c.lineTo(-W / 2 + 40, cy - H / 2 + 10); c.moveTo(30, 0); c.lineTo(W / 2 - 40, cy - H / 2 + 10); lnS(c, 5, '#94a3b8'); c.restore() }
        c.translate(0, cy);
        if (roll <= 0) {
          if (i === 0 && ku < 1) { const kh = eo(at(ku, .35, 1)); if (kh > 0) { c.save(); c.scale(1, kh); sheetDraw(c, i, t); c.restore() } const lw = 760 * eo(at(ku, 0, .4)); c.fillStyle = '#fbbf24'; c.fillRect(-lw / 2, -340 * kh - 3, lw, 6); c.fillRect(-lw / 2, 340 * kh - 3, lw, 6) }
          else { c.save(); c.translate(14, 18); c.rotate(.035); rr(c, -380, -340, 760, 680, 10); fill(c, '#dfe5f5'); c.restore(); sheetDraw(c, i, t) }
        } else {   // лист скатывается справа налево в рулон: под рулоном — янтарь с синей полосой, углы скругляются
          const rad = lp(10, 110, roll);
          c.save(); rr(c, -W / 2, -H / 2, W, H, rad); c.clip();
          c.save(); c.scale(W / 760, H / 680); sheetDraw(c, i, t); c.restore();
          const xr = lp(W / 2, -W / 2, ss(0, .85, roll)); c.fillStyle = S6.amber; c.fillRect(xr, -H / 2, W, H);
          c.fillStyle = S6.navy; c.fillRect(Math.max(xr, W / 2 - W * .3), -H / 2, Math.max(0, W / 2 - W * .1 - Math.max(xr, W / 2 - W * .3)), H);
          c.beginPath(); c.moveTo(xr, -H / 2); c.lineTo(xr, H / 2); lnS(c, 5); c.restore();
          rr(c, -W / 2, -H / 2, W, H, rad); lnS(c, 5, mixc('#c7d2fe', S6.ln, roll));
        }
        c.restore();
      }
    }
  }
  function pod(c, x, y, r, k) { c.save(); c.translate(x, y); c.rotate(r); c.scale(k, k); rr(c, -18, -36, 36, 72, 9); fill(c, '#f97316'); rr(c, -18, -36, 36, 22, 8); fill(c, '#111827'); rr(c, -18, -36, 36, 72, 9); lnS(c, 3.5); c.restore() }
  function capFace(c, R) {   // торец как крышка банки: белый круг, тёмное кольцо, голубая дуга, щель мундштука, снежинка
    circ(c, 0, 0, R, S6.cap); c.beginPath(); c.arc(0, 0, R, 0, TAU); lnS(c, 6, '#0e1432');
    c.beginPath(); c.arc(0, 0, R * .8, 0, TAU); lnS(c, 5, '#0e1432');
    c.beginPath(); c.arc(0, 0, R * .8, -1.35, .25); lnS(c, 14, '#22d3ee');
    rr(c, -R * .26, -R * .12, R * .52, R * .24, R * .12); fill(c, '#0e1432');
    c.beginPath(); for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; c.moveTo(Math.cos(a) * R * .09, R * .42 + Math.sin(a) * R * .09); c.lineTo(-Math.cos(a) * R * .09, R * .42 - Math.sin(a) * R * .09) } lnS(c, 4, '#22d3ee');
  }
  function cyl3d(c, t, th, R) {   // корпус честно поворачивается в 3D: ось наклоняется к нам, торец раскрывается в круг; растровая тень точками
    const x = 540, y = 860, h = 260 * Math.cos(th), e = Math.max(.001, Math.sin(th));
    if (th > .5) {
      const L = 560 * ss(.5, 1.57, th), ux = Math.cos(.61), uy = Math.sin(.61);
      for (let d = 0; d < L; d += 22) for (let w = -R; w <= R; w += 22) { const px = x + ux * (d + R * .25) - uy * w, py = y + uy * (d + R * .25) + ux * w, rr0 = 6.5 * (1 - d / L); if (rr0 > .5) circ(c, px, py, rr0, 'rgba(241,245,249,.28)') }
    }
    if (h > 1) {
      c.beginPath(); c.moveTo(x - R, y - h); c.lineTo(x - R, y + h); c.ellipse(x, y + h, R, R * e, 0, Math.PI, 0, true); c.lineTo(x + R, y - h); c.closePath(); fill(c, S6.amber);
      c.save(); c.clip(); c.fillStyle = S6.navy; c.fillRect(x + R * .25, y - h - R, R * .4, 2 * h + 2 * R); c.restore();
      c.beginPath(); c.moveTo(x - R, y - h); c.lineTo(x - R, y + h); c.ellipse(x, y + h, R, R * e, 0, Math.PI, 0, true); c.lineTo(x + R, y - h); lnS(c, 5);
    }
    c.save(); c.translate(x, y - h); c.scale(1, e); capFace(c, R); c.restore();
  }
  function endFace(c, t, kd, kq = 0, cy = 860, noCap = false) {   // торец R 230: тёмный круг с надписью, 16 картриджей по орбите
    if (!noCap) { c.save(); c.translate(540, cy); capFace(c, 230); c.restore() }
    const kk = kd * (1 - kq); if (kk > 0) { c.save(); c.translate(540, cy); c.scale(kk, kk); circ(c, 0, 0, 208, '#0e1432'); c.beginPath(); c.arc(0, 0, 208, 0, TAU); lnS(c, 5);
      tx(c, '1 ОДНОРАЗКА', 0, -80, { f: 'U', w: 800, s: 38, c: '#fbbf24' }); tx(c, '=', 0, -22, { f: 'U', w: 800, s: 44, c: '#fff' }); tx(c, '16 КАРТРИДЖЕЙ', 0, 34, { f: 'U', w: 800, s: 34, c: '#fff' }); tx(c, 'JUUL · ПО НИКОТИНУ', 0, 90, { f: 'O', w: 700, s: 24, c: '#fdba74', ls: 2 }); c.restore() }
    for (let i = 0; i < 16; i++) { const a0 = -Math.PI / 2 + i * TAU / 16 + kq * 1.2, k = spr(at(t, K.n16 - .05 + i * .05, K.n16 + .3 + i * .05)) * (1 - kq), r = 310 * (1 - kq * .3); if (k > 0) pod(c, 540 + Math.cos(a0) * r, cy + Math.sin(a0) * r, a0 + Math.PI / 2, k) }
  }
  function shot6(c, t) {
    // 53.2–54.0: сам синий круг медальона растёт на весь экран; в нём — ровный фон со штрихами, снежинка уменьшается в центре
    const kx = at(t, K.s6 - .23, K.s6 + .57), R = lp(224, 1260, ei(kx));
    if (kx < 1) shot5(c, t);
    if (kx <= 0) return;
    c.save(); if (kx < 1) { c.beginPath(); c.arc(540, 820, R, 0, TAU); c.clip() }
    const dark = eio(at(t, K.nicot - .2, K.nicot + .4));
    blueprintBg(c, t, dark);
    if (kx < 1) medallion(c, t, 540, 820, 224 * (1 - ss(0, .6, kx)), 1);
    const ku = at(t, K.s6 + .05, K.s6 + .75);   // золотая линия → лист раскрывается сверху вниз (Да Винчи 0:29.8)
    const kRoll = eio(at(t, K.nicot - .25, K.nicot + .25)), kUp = eio(at(t, K.nicot - .1, K.nicot + .5));
    const kb = eo(at(t, K.s6 + .5, K.s6 + 1.1));   // ферма въезжает сверху
    c.save(); c.translate(0, -420 * kUp - 360 * (1 - kb)); craneBeam(c, t); c.restore();
    if (ku > 0) sheets(c, t, kRoll, kUp, ku);
    if (kRoll >= 1) {
      const kr = eio(at(t, K.nicot + .25, K.n16 - .05));
      if (kr < 1) cyl3d(c, t, lp(.18, Math.PI / 2, kr), lp(110, 230, kr));
      else endFace(c, t, spr(at(t, K.n16 + .45, K.n16 + .85)));
    }
    c.restore();
  }
