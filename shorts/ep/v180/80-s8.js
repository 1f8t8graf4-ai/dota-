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
      [[wx, wy], [wx + 130, wy], [wx, wy + 110], [wx + 130, wy + 110]].forEach(([qx, qy], j) => { c.save(); c.translate(qx, qy); c.rotate(j * Math.PI / 2); poly(c, [0, 0, 34, 0, 0, 34]); fill(c, 'rgba(224,242,254,.7)'); c.restore() });
      rr(c, wx, wy, 130, 110, 6); stroke(c, '#8b7aa0', 5);
      // стол, лампа, силуэт в профиль (без лица)
      const dx = L + 250 + (f % 2) * 60, dy = fy + FH - 16;
      c.fillStyle = '#4a3a5e'; c.fillRect(dx, dy - 90, 170, 12); c.fillRect(dx + 10, dy - 80, 10, 80); c.fillRect(dx + 150, dy - 80, 10, 80);
      glow(c, dx + 140, dy - 120, 90, '#fde68a', .25); c.fillStyle = '#a78bfa'; c.fillRect(dx + 134, dy - 150, 8, 60);
      const sx = dx - 40; c.fillStyle = '#0b0714'; rr(c, sx - 34, dy - 150, 68, 110, 26); c.fill(); circ(c, sx, dy - 182, 32, '#0b0714'); rr(c, sx - 34, dy - 214, 60, 40, 18); c.fill();   // капюшон и плечи
      c.fillRect(sx - 30, dy - 50, 22, 50); c.fillRect(sx + 6, dy - 50, 22, 50);
      // огонёк одноразки на столе и облачко пара
      const ph = (t * .55 + f * .37) % 1, on = .5 + .5 * Math.sin(t * 5 + f * 2);
      const vx = dx + 60, vy = dy - 104; rr(c, vx - 7, vy - 26, 14, 30, 5); fill(c, '#0ea5e9'); glow(c, vx, vy - 20, 34, '#38bdf8', .5 + .4 * on); circ(c, vx, vy - 20, 4, '#e0f2fe');
      A(c, Math.sin(ph * Math.PI) * .6, () => [0, 1, 2].forEach(j => circ(c, vx + 6 + j * 14 + ph * 40, vy - 50 - ph * 70 - j * 12, 14 + ph * 22, 'rgba(224,242,254,.55)')));
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
  function shot8(c, t) {
    const kin = ss(K.s8 - .25, K.s8 + .4, t);
    if (kin < 1) shot7(c, t);
    if (kin <= 0) return;
    A(c, kin, () => { nightSky(c, t, { clouds: true }); c.save(); skylineLayer(c, 21, 1420, 260, 700, '#141c35', .45, '#fde68a', t); c.restore(); vgrad(c, -100, 1400, WW + 200, 600, ['#1e293b', '#0f172a']); c.fillStyle = '#334155'; c.fillRect(-100, 1400, WW + 200, 12); lamp(c, 980, 1406, 520) });
    // Луна — последний ноль табло поднимается в небо
    const km = eio(at(t, K.s8 - .25, K.s8 + .55));
    const mx = lp(780, 230, km), my = lp(830, 340, km), mr = lp(30, 95, km);
    glow(c, mx, my, mr * 3, '#e0f2fe', .35 * km); circ(c, mx, my, mr, mixc('#fb923c', '#f8fafc', km)); if (km > .6) { circ(c, mx - mr * .3, my - mr * .2, mr * .2, 'rgba(148,163,184,.3)'); circ(c, mx + mr * .3, my + mr * .25, mr * .14, 'rgba(148,163,184,.25)') }
    const kd = bo(at(t, K.s8 + .2, K.s8 + 1.2)); if (kd > 0) dorm(c, t, lp(1460, 620, kd));
    vignette(c, .45);
  }
