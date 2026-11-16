  // ================= СЦЕНА 8: ноль с табло → Луна, общежитие в диагональном разрезе =================
  const DM = { w: 640, top: 360, bot: 1400 };   // здание: 4 этажа по 260
  function dorm(c, t, cx, roomsA = 1) {
    const L = cx - DM.w / 2, R = cx + DM.w / 2, T = DM.top, B = DM.bot, FH = (B - T) / 4;
    c.save(); c.translate(14, 18); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(L, T, DM.w, B - T); c.restore();
    // интерьер (виден в разрезе): 4 этажа, комнаты, лестница справа
    vgrad(c, L, T, DM.w, B - T, ['#2a1f3a', '#231a30']);
    for (let f = 0; f < 4; f++) {
      const fy = T + f * FH, lit = f > 0;
      c.fillStyle = lit ? '#3b2f4f' : '#261d33'; c.fillRect(L + 10, fy + 10, DM.w - 20, FH - 26);
      c.fillStyle = '#5b4a6e'; c.fillRect(L, fy + FH - 16, DM.w, 16);   // перекрытие
      // лестница
      c.strokeStyle = '#6b5a7e'; c.lineWidth = 6; c.beginPath(); c.moveTo(R - 150, fy + FH - 16); c.lineTo(R - 30, fy + 20); c.stroke(); for (let s2 = 0; s2 < 8; s2++) { c.fillStyle = '#6b5a7e'; c.fillRect(R - 150 + s2 * 15, fy + FH - 30 - s2 * 28, 16, 6) }
      if (!lit) continue;
      // окно на задней стене с инеем по углам
      const wx = L + 60, wy = fy + 34; rr(c, wx, wy, 130, 110, 6); fill(c, '#0f1d3d'); circ(c, wx + 100, wy + 30, 6, '#f8fafc');
      const fr = 22 + 46 * at(t, K.s8, K.b0); c.save(); rr(c, wx, wy, 130, 110, 6); c.clip();
      [[wx, wy], [wx + 130, wy], [wx, wy + 110], [wx + 130, wy + 110]].forEach(([qx, qy], j) => { c.save(); c.translate(qx, qy); c.rotate(j * Math.PI / 2); poly(c, [0, 0, fr, 0, fr * .55, fr * .3, fr * .3, fr * .55, 0, fr]); fill(c, 'rgba(224,242,254,.75)'); for (let q = 0; q < 3; q++) crystal6(c, fr * (.25 + q * .2), fr * (.6 - q * .2), 5, .9, q); c.restore() }); c.restore();
      rr(c, wx, wy, 130, 110, 6); stroke(c, '#8b7aa0', 5);
      // стол, лампа, силуэт в профиль (без лица)
      const dx = L + 250 + (f % 2) * 60, dy = fy + FH - 16;
      c.fillStyle = '#4a3a5e'; c.fillRect(dx, dy - 90, 170, 12); c.fillRect(dx + 10, dy - 80, 10, 80); c.fillRect(dx + 150, dy - 80, 10, 80);
      glow(c, dx + 140, dy - 120, 90, '#fde68a', .25); c.fillStyle = '#a78bfa'; c.fillRect(dx + 134, dy - 150, 8, 60);
      const sx = dx - 40; c.fillStyle = '#0b0714'; rr(c, sx - 34, dy - 150, 68, 110, 26); c.fill(); circ(c, sx, dy - 182, 32, '#0b0714'); rr(c, sx - 34, dy - 214, 60, 40, 18); c.fill();   // капюшон и плечи
      c.fillRect(sx - 30, dy - 50, 22, 50); c.fillRect(sx + 6, dy - 50, 22, 50);
      // огонёк одноразки на столе: вспыхивает на затяжке и красит комнату синим; пар всё время поднимается и тает
      const cyc = (t * .42 + f * .31) % 1, inh = Math.pow(Math.max(0, Math.sin(cyc * Math.PI * 2)), 3);
      if (inh > .02) { c.save(); c.beginPath(); c.rect(L + 10, fy + 10, DM.w - 20, FH - 26); c.clip(); glow(c, dx + 60, dy - 100, 300, '#38bdf8', .35 * inh); c.restore() }
      const vx = dx + 60, vy = dy - 104; rr(c, vx - 7, vy - 26, 14, 30, 5); fill(c, '#0ea5e9'); glow(c, vx, vy - 20, 34 + 30 * inh, '#38bdf8', .4 + .6 * inh); circ(c, vx, vy - 20, 4 + 3 * inh, '#e0f2fe');
      c.save(); c.beginPath(); c.rect(L + 10, fy + 10, DM.w - 20, FH - 26); c.clip();
      for (let j = 0; j < 5; j++) { const ph = (t * .35 + j / 5 + f * .13) % 1; circ(c, vx + 4 + Math.sin(ph * 6 + j) * 16 + ph * 50, vy - 40 - ph * 150, 10 + ph * 34, rgba('#e0f2fe', .5 * (1 - ph) * Math.min(1, ph * 6))) }
      c.restore();
    }
    // фасад: кирпичная стена, срезанная по диагонали (остаётся верхний левый угол)
    c.save(); poly(c, [L, T, R, T, L, B]); c.clip();
    vgrad(c, L, T, DM.w, B - T, ['#7c2d12', '#5b2210']);
    c.strokeStyle = 'rgba(0,0,0,.2)'; c.lineWidth = 2; for (let y = T; y < B; y += 26) { c.beginPath(); c.moveTo(L, y); c.lineTo(R, y); c.stroke(); for (let x = L + ((y - T) / 26 % 2) * 30; x < R; x += 60) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 26); c.stroke() } }
    for (let f = 0; f < 4; f++) for (let i = 0; i < 4; i++) { const wx = L + 40 + i * 150, wy = T + f * (B - T) / 4 + 60; rr(c, wx, wy, 90, 120, 6); fill(c, H1(i + f * 4) > .5 ? '#fde68a' : '#1e293b'); rr(c, wx, wy, 90, 120, 6); stroke(c, '#e7e5e4', 5) }
    c.restore();
    c.save(); c.beginPath(); c.moveTo(R, T); c.lineTo(L, B); c.strokeStyle = '#9a3412'; c.lineWidth = 22; c.stroke(); c.strokeStyle = '#c2410c'; c.lineWidth = 8; c.stroke(); c.restore();   // срез стены
    c.fillStyle = '#44403c'; c.fillRect(L - 20, T - 30, DM.w + 40, 34);   // крыша
  }
  const MOON = { x: 220, y: 340, r: 95 };
  function shot8(c, t) {
    // 75.5–76.5: касса с чеком, деньгами и полками уезжает вниз и гаснет, а золотая монета с кассы летит по дуге и становится Луной
    const p = eio(at(t, K.s8 - .57, K.s8 + .43));
    const kp = 1 + .18 * eio(at(t, K.s8 + .5, K.b0));   // медленный наезд на разрез общежития
    c.save(); c.translate(620, 1010); c.scale(kp, kp); c.translate(-620, -1010);
    nightSky(c, t, { clouds: true }); skylineLayer(c, 21, 1420, 260, 700, '#141c35', .45, '#fde68a', t);
    vgrad(c, -400, 1400, WW + 800, 900, ['#1e293b', '#0f172a']); c.fillStyle = '#334155'; c.fillRect(-400, 1400, WW + 800, 12); lamp(c, 980, 1406, 520);
    if (p >= 1) { const mm = MOON; glow(c, mm.x, mm.y, mm.r * 3, '#e0f2fe', .35); circ(c, mm.x, mm.y, mm.r, '#f8fafc'); circ(c, mm.x - mm.r * .3, mm.y - mm.r * .2, mm.r * .2, 'rgba(148,163,184,.3)'); circ(c, mm.x + mm.r * .3, mm.y + mm.r * .25, mm.r * .14, 'rgba(148,163,184,.25)') }
    const kd = bo(at(t, K.s8 + .43, K.s8 + 1.3)); if (kd > 0) dorm(c, t, lp(1460, 600, kd));
    c.restore();
    if (p < 1) {
      c.save(); c.globalAlpha = 1 - p; c.translate(0, 1400 * p); shot7(c, t); c.restore();
      const x = lp(540, MOON.x, p), y = lp(850, MOON.y, p) - Math.sin(Math.PI * p) * 140, r = lp(36, MOON.r, p);
      glow(c, x, y, r * 3, mixc('#f59e0b', '#e0f2fe', p), .45); circ(c, x, y, r, mixc('#f59e0b', '#f8fafc', p)); ring(c, x, y, r * .76, rgba('#b45309', 1 - p), 4);
      if (p > .7) { circ(c, x - r * .3, y - r * .2, r * .2, rgba('#94a3b8', .3 * ss(.7, 1, p))); circ(c, x + r * .3, y + r * .25, r * .14, rgba('#94a3b8', .25 * ss(.7, 1, p))) }
    }
    vignette(c, .45);
  }
