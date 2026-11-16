  // ================= СЦЕНА 6: синие чертежи и кран → корпус торцом = 16 картриджей =================
  function blueprintBg(c, t, dark = 0) {
    c.fillStyle = mixc('#1e3a8a', '#0f1d44', dark); c.fillRect(-200, -200, WW + 400, HH + 400);
    c.lineWidth = 1.5; c.strokeStyle = rgba('#93c5fd', .14); c.beginPath(); for (let x = 0; x <= WW; x += 30) { c.moveTo(x, 0); c.lineTo(x, HH) } for (let y = 0; y <= HH; y += 30) { c.moveTo(0, y); c.lineTo(WW, y) } c.stroke();
    c.lineWidth = 3; c.strokeStyle = rgba('#bfdbfe', .2); c.beginPath(); for (let x = 0; x <= WW; x += 150) { c.moveTo(x, 0); c.lineTo(x, HH) } for (let y = 0; y <= HH; y += 150) { c.moveTo(0, y); c.lineTo(WW, y) } c.stroke();
    c.fillStyle = rgba('#dbeafe', .5); for (let x = 0; x <= WW; x += 30) c.fillRect(x, 0, 2, x % 150 ? 10 : 22);   // засечки
    vignette(c, .45, '5,10,30');
  }
  function craneBeam(c, t) {   // жёлто-чёрная балка под потолком
    c.save(); rr(c, -40, 240, WW + 80, 50, 6); c.clip(); c.fillStyle = '#facc15'; c.fillRect(-40, 240, WW + 80, 50); c.fillStyle = '#111827';
    for (let i = -2; i < 30; i++) { poly(c, [i * 60, 240, i * 60 + 30, 240, i * 60 + 10, 290, i * 60 - 20, 290]); c.fill() } c.restore();
    c.fillStyle = '#334155'; c.fillRect(-40, 200, WW + 80, 40);
  }
  function trolley(c, x) { rr(c, x - 40, 286, 80, 34, 6); fill(c, '#475569'); circ(c, x - 22, 290, 9, '#1f2937'); circ(c, x + 22, 290, 9, '#1f2937') }
  function sheetDraw(c, i, t) {   // белый лист 760×680 с синей схемой (координаты листа: центр 0,0), всё на листе движется
    rr(c, -380, -340, 760, 680, 10); fill(c, '#f8fafc'); c.strokeStyle = rgba('#1e40af', .12); c.lineWidth = 1;
    c.beginPath(); for (let x = -380; x <= 380; x += 40) { c.moveTo(x, -340); c.lineTo(x, 340) } for (let y = -340; y <= 340; y += 40) { c.moveTo(-380, y); c.lineTo(380, y) } c.stroke();
    c.strokeStyle = '#1e40af'; c.lineWidth = 5; c.fillStyle = 'rgba(37,99,235,.12)';
    if (i === 0) {   // картридж 0,7 мл → бак растёт до 13 мл
      const kg = eio(at(t, K.grew - .1, K.grew + .8)), H = lp(120, 420, kg), Y0 = 190 - H;
      rr(c, -230, Y0, 200, H, lp(14, 40, kg)); c.fill(); c.stroke();
      const lv = lp(.2, .72, kg) * (H - 30); c.save(); rr(c, -222, Y0 + 8, 184, H - 16, lp(10, 32, kg)); c.clip(); c.fillStyle = 'rgba(14,165,233,.45)';
      c.beginPath(); c.moveTo(-240, 200); for (let x = -240; x <= -20; x += 10) c.lineTo(x, 182 - lv + Math.sin(x * .05 + t * 4) * 6); c.lineTo(-20, 200); c.closePath(); c.fill(); c.restore();
      const kj = lp(1.9, 1, eio(at(t, K.grew - .2, K.grew + .5))) * (1 + .12 * pulse2(t, w0('картридж'))), pxj = lp(60, 120, eio(at(t, K.grew - .2, K.grew + .5)));
      c.save(); c.translate(pxj, 130); c.scale(kj, kj); rr(c, -30, -60, 60, 120, 14); c.fillStyle = 'rgba(249,115,22,.4)'; c.fill(); c.stroke(); rr(c, -30, -60, 60, 26, 10); fill(c, '#1e40af');
      c.save(); rr(c, -24, -30, 48, 84, 10); c.clip(); c.fillStyle = 'rgba(249,115,22,.55)'; c.beginPath(); c.moveTo(-30, 60); for (let x = -30; x <= 30; x += 6) c.lineTo(x, -4 + Math.sin(x * .2 + t * 5) * 4); c.lineTo(30, 60); c.closePath(); c.fill(); c.restore(); c.restore();
      tx(c, 'JUUL: 0,7 МЛ', pxj, 230, { f: 'O', w: 700, s: 30, c: '#ea580c' });
      const kh = spr(at(t, K.s6 + .5, K.s6 + 1)); if (kh > 0) { c.save(); c.translate(0, -280); c.scale(kh, kh); tx(c, 'КАРТРИДЖ → БАК', 0, 0, { f: 'U', w: 800, s: 44, c: '#1e3a8a' }); c.restore() }
      const kn = at(t, K.grew, w0('тринадцать')), v = lp(.7, 13, eio(kn)), vs = kn >= 1 ? '13' : (v < 10 ? v.toFixed(1).replace('.', ',') : String(Math.round(v)));
      if (kn > 0) tx(c, 'БАК: ' + vs + ' МЛ', 170, -170, { f: 'U', w: 800, s: 40, c: '#1e3a8a', mw: 330 });
      const kx = spr(at(t, w0('тринадцать') + .05, w0('тринадцать') + .45)); if (kx > 0) { c.save(); c.translate(170, -110); c.scale(kx, kx); tx(c, 'В 18 РАЗ БОЛЬШЕ', 0, 0, { f: 'O', w: 700, s: 30, c: '#2563eb' }); c.restore() }
    } else if (i === 1) {   // двойная сетка: накаляется волной
      [-140, 140].forEach((cx, j) => { rr(c, cx - 90, -170, 180, 300, 30); c.stroke(); c.save(); rr(c, cx - 90, -170, 180, 300, 30); c.clip(); c.lineWidth = 3;
        for (let k = -400; k < 400; k += 22) { const hot = .5 + .5 * Math.sin(t * 5 - k * .02 - j); c.strokeStyle = mixc('#1e40af', '#f97316', hot * at(t, K.mesh - .1, K.mesh + .4)); c.beginPath(); c.moveTo(cx + k, -170); c.lineTo(cx + k + 300, 130); c.moveTo(cx + k, 130); c.lineTo(cx + k + 300, -170); c.stroke() } c.restore() });
      tx(c, 'ДВОЙНАЯ СЕТКА', 0, 210, { f: 'U', w: 800, s: 44, c: '#1e3a8a' }); tx(c, '2 СЕТКИ НАГРЕВА', 0, 266, { f: 'O', w: 700, s: 30, c: '#2563eb', ls: 3 });
    } else {   // затяжки и аккумулятор
      rr(c, -250, -200, 170, 330, 20); c.stroke(); rr(c, -200, -230, 70, 32, 8); c.stroke();
      const ch = (t * 1.5) % 5; for (let k = 0; k < 4; k++) { rr(c, -230, 70 - k * 70, 130, 54, 8); c.fillStyle = k < ch ? 'rgba(34,197,94,.6)' : 'rgba(34,197,94,.15)'; c.fill() }
      tx(c, '650 мА·ч', -165, 190, { f: 'O', w: 700, s: 32, c: '#1e3a8a' });
      const n = Math.round(5000 * eio(at(t, K.puffs - .2, K.puffs + .7)) / 50) * 50;
      num(c, String(n), 140, -60, { f: 'U', w: 800, s: 110, c: '#1e3a8a' }); tx(c, 'ЗАТЯЖЕК', 140, 50, { f: 'O', w: 700, s: 40, c: '#2563eb', ls: 3 });
    }
    rr(c, -380, -340, 760, 680, 10); stroke(c, '#93c5fd', 3);
  }
  const w0 = q => Wd(q);
  const SH = { x: 540, y: 1000 };
  function shiftX(t) {   // лента кранов: листы едут справа налево, стоят под голос, но всегда чуть плывут
    return lp(-1100, 0, eo(at(t, K.s6, K.s6 + .9))) + 1100 * eio(at(t, K.mesh - .45, K.mesh + .25)) + 1100 * eio(at(t, K.puffs - .45, K.puffs + .25)) + 90 * at(t, K.s6, K.nicot);
  }
  function sheets(c, t, kRoll, kUp) {   // листы на цепях кранов; третий лист сворачивается в корпус одноразки
    const X = shiftX(t), v = (shiftX(t + .03) - shiftX(t - .03)) / .06;
    for (let i = 0; i < 3; i++) {
      const roll = i === 2 ? kRoll : 0, sx = lp(SH.x + i * 1100 - X, 540, roll); if (sx < -600 || sx > WW + 600) continue;
      const sw = -v * 1.1e-4 + Math.sin(t * 1.7 + i * 2) * .012;
      const ty = -360 * kUp;
      c.save(); c.translate(0, ty); trolley(c, sx); c.restore();
      if (roll < 1) {
        c.save(); c.translate(sx, 320); c.rotate(sw * (1 - roll));
        const cy = lp(SH.y - 320, 860 - 320, roll), W = lp(760, 220, roll), H = lp(680, 520, roll);
        if (roll < .5) { c.strokeStyle = '#94a3b8'; c.lineWidth = 5; c.setLineDash([10, 6]); c.beginPath(); c.moveTo(-30, 0); c.lineTo(-W / 2 + 40, cy - H / 2 + 10 + ty * 0); c.moveTo(30, 0); c.lineTo(W / 2 - 40, cy - H / 2 + 10); c.stroke(); c.setLineDash([]) }
        c.translate(0, cy);
        if (roll <= 0) sheetDraw(c, i, t);
        else { const g = c.createLinearGradient(-W / 2, 0, W / 2, 0); g.addColorStop(0, mixc('#f8fafc', '#d97706', roll)); g.addColorStop(.4, mixc('#f8fafc', '#fbbf24', roll)); g.addColorStop(1, mixc('#dbeafe', '#0891b2', roll));
          rr(c, -W / 2, -H / 2, W, H, lp(10, 110, roll)); c.fillStyle = g; c.fill(); rr(c, -W / 2, -H / 2, W, H, lp(10, 110, roll)); stroke(c, '#93c5fd', 3 * (1 - roll)) }
        c.restore();
      }
    }
  }
  function pod(c, x, y, r, k) { c.save(); c.translate(x, y); c.rotate(r); c.scale(k, k); rr(c, -18, -36, 36, 72, 9); fill(c, '#f97316'); rr(c, -18, -36, 36, 22, 8); fill(c, '#111827'); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-12, -10, 6, 40); c.restore() }
  function capFace(c, R) {   // торец одноразки: золотой обод, тёмная решётка, голубое кольцо подсветки
    circ(c, 0, 0, R, '#f59e0b'); ring(c, 0, 0, R - 10, '#fde68a', 6); circ(c, 0, 0, R * .72, '#b45309'); circ(c, 0, 0, R * .6, '#111827');
    ring(c, 0, 0, R * .5, '#22d3ee', 5); for (let i = 0; i < 19; i++) { const a = i * 2.4, r = R * .38 * Math.sqrt((i + .5) / 19); circ(c, Math.cos(a) * r, Math.sin(a) * r, R * .035, '#334155') }
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-R * .45, -R * .5, R * .2, R * .07, -.6, 0, TAU); c.fill();
  }
  function cyl3d(c, t, th, R) {   // корпус честно поворачивается в 3D: ось наклоняется к нам, торец раскрывается в круг
    const x = 540, y = 860, h = 260 * Math.cos(th), e = Math.max(.001, Math.sin(th));
    if (th > .5) {   // растровая тень вправо-вниз
      const L = 520 * ss(.5, 1.57, th), ux = Math.cos(.61), uy = Math.sin(.61);
      for (let d = 0; d < L; d += 20) for (let w = -R; w <= R; w += 20) { const px = x + ux * (d + R * .2) - uy * w, py = y + uy * (d + R * .2) + ux * w, rr0 = 7 * (1 - d / L); if (rr0 > .5) circ(c, px, py, rr0, 'rgba(147,197,253,.30)') }
    }
    if (h > 1) { c.beginPath(); c.moveTo(x - R, y - h); c.lineTo(x - R, y + h); c.ellipse(x, y + h, R, R * e, 0, Math.PI, 0, true); c.lineTo(x + R, y - h); c.closePath();
      const g = c.createLinearGradient(x - R, 0, x + R, 0); g.addColorStop(0, '#d97706'); g.addColorStop(.4, '#fbbf24'); g.addColorStop(1, '#0891b2'); c.fillStyle = g; c.fill() }
    c.save(); c.translate(x, y - h); c.scale(1, e); capFace(c, R); c.restore();
  }
  function endFace(c, t, kd, kq = 0) {   // торец R 230: тёмный круг с надписью вырастает, 16 картриджей по орбите
    c.save(); c.translate(540, 860); capFace(c, 230); c.restore();
    const kk = kd * (1 - kq); if (kk > 0) { c.save(); c.translate(540, 860); c.scale(kk, kk); circ(c, 0, 0, 208, 'rgba(15,23,42,.96)');
      tx(c, '1 ОДНОРАЗКА', 0, -80, { f: 'U', w: 800, s: 38, c: '#fbbf24' }); tx(c, '=', 0, -22, { f: 'U', w: 800, s: 44, c: '#fff' }); tx(c, '16 КАРТРИДЖЕЙ', 0, 34, { f: 'U', w: 800, s: 34, c: '#fff' }); tx(c, 'JUUL · ПО НИКОТИНУ', 0, 90, { f: 'O', w: 700, s: 24, c: '#fdba74', ls: 2 }); c.restore() }
    for (let i = 0; i < 16; i++) { const a0 = -Math.PI / 2 + i * TAU / 16 + kq * 1.2, k = spr(at(t, K.n16 - .05 + i * .05, K.n16 + .3 + i * .05)) * (1 - kq), r = 310 * (1 - kq * .3); if (k > 0) pod(c, 540 + Math.cos(a0) * r, 860 + Math.sin(a0) * r, a0 + Math.PI / 2, k) }
  }
  function shot6(c, t) {
    // медальон-снежинка раскрывается в синюю миллиметровку
    const kx = eio(at(t, K.s6 - .1, K.s6 + .6));
    if (kx < 1) shot5(c, t);
    if (kx <= 0) return;
    c.save(); c.beginPath(); c.arc(540, 820, lp(224, 1400, kx), 0, TAU); c.clip();
    blueprintBg(c, t, eio(at(t, K.nicot - .2, K.nicot + .4)));
    const kRoll = eio(at(t, K.nicot - .25, K.nicot + .25)), kUp = eio(at(t, K.nicot - .1, K.nicot + .5));
    c.save(); c.translate(0, -360 * kUp); craneBeam(c, t); c.restore();
    c.save(); c.translate(0, 0); sheets(c, t, kRoll, kUp); c.restore();
    if (kRoll >= 1) {
      const kr = eio(at(t, K.nicot + .25, K.n16 - .05));
      if (kr < 1) cyl3d(c, t, lp(.18, Math.PI / 2, kr), lp(110, 230, kr));
      else endFace(c, t, spr(at(t, K.n16 + .45, K.n16 + .85)));
    }
    c.restore();
    if (kx < 1) { c.save(); c.beginPath(); c.arc(540, 820, lp(224, 1400, kx), 0, TAU); stroke(c, '#e0f2fe', 10 * (1 - kx)); c.restore() }
  }
