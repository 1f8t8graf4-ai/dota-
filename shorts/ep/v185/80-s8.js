  // ================= СЦЕНА 8 (v18.4): монета → Луна, город поднимается снизу, общежитие в разрезе — как у World of Tanks #076 =================
  // Всё плоско: ровный тёмный фон, белая Луна без свечения, дома тремя оттенками с оранжевыми окнами, шпиль перечёркивает Луну.
  // Общежитие въезжает справа: верхний левый угол — фасад с сеткой окон, нижний правый — разрез с этажами; белые плиты и косая белая балка, как у WoT.
  // В комнатах — силуэты без лиц, голубые огоньки одноразок вспыхивают на затяжке, пар — контурными кружками; на окнах иней.
  const S8 = { bg: '#26223a', b1: '#332e4a', b2: '#3f3958', b3: '#4c4667', win: '#f4a261', ln: '#f1f5f9', slab: '#d6d1e0', inside: '#2b2638', room: '#38314c', sil: '#15121c' };
  const DM = { w: 640, top: 360, bot: 1400 };   // здание: 4 этажа по 260
  function cityRow(c, seed, base, hMin, hMax, col, winA, t) {   // ряд домов: прямоугольники, ступени крыш, окна полосками
    let x = -60, i = 0;
    while (x < WW + 60) {
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
  function dorm(c, t, cx) {
    const L = cx - DM.w / 2, R = cx + DM.w / 2, T = DM.top, B = DM.bot, FH = (B - T) / 4;
    c.save(); c.translate(16, 18); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(L, T, DM.w, B - T); c.restore();
    c.fillStyle = S8.inside; c.fillRect(L, T, DM.w, B - T);
    for (let f = 0; f < 4; f++) {
      const fy = T + f * FH, lit = f > 0;
      c.fillStyle = lit ? S8.room : S8.inside; c.fillRect(L + 10, fy + 10, DM.w - 20, FH - 30);
      c.fillStyle = S8.slab; c.fillRect(L, fy + FH - 20, DM.w, 20);   // белая плита перекрытия
      c.beginPath(); c.moveTo(R - 170, fy + FH - 20); c.lineTo(R - 30, fy + 18); lnS(c, 5, '#8f88a3');   // лестница
      for (let s2 = 0; s2 < 8; s2++) { c.fillStyle = '#8f88a3'; c.fillRect(R - 170 + s2 * 17, fy + FH - 34 - s2 * 28, 18, 6) }
      if (!lit) continue;
      const wx = L + 60, wy = fy + 34;   // окно с инеем по углам
      rr(c, wx, wy, 130, 110, 6); fill(c, '#1b2142'); circ(c, wx + 100, wy + 30, 6, '#f8fafc');
      const fr = 22 + 46 * at(t, K.s8, K.b0); c.save(); rr(c, wx, wy, 130, 110, 6); c.clip();
      [[wx, wy], [wx + 130, wy], [wx, wy + 110], [wx + 130, wy + 110]].forEach(([qx, qy], j) => { c.save(); c.translate(qx, qy); c.rotate(j * Math.PI / 2); poly(c, [0, 0, fr, 0, fr * .55, fr * .3, fr * .3, fr * .55, 0, fr]); fill(c, '#d9f3fb'); c.restore() }); c.restore();
      rr(c, wx, wy, 130, 110, 6); lnS(c, 5, S8.slab);
      const dx = L + 250 + (f % 2) * 60, dy = fy + FH - 20;   // стол, лампа, силуэт в профиль
      c.fillStyle = '#5a5272'; c.fillRect(dx, dy - 90, 170, 12); c.fillRect(dx + 10, dy - 80, 10, 80); c.fillRect(dx + 150, dy - 80, 10, 80);
      poly(c, [dx + 128, dy - 150, dx + 150, dy - 150, dx + 200, dy - 92, dx + 80, dy - 92]); fill(c, 'rgba(253,230,138,.14)'); c.fillStyle = '#a78bfa'; c.fillRect(dx + 134, dy - 160, 8, 70);
      const sx = dx - 40; c.fillStyle = S8.sil; rr(c, sx - 34, dy - 150, 68, 110, 26); c.fill(); circ(c, sx, dy - 182, 32, S8.sil); rr(c, sx - 34, dy - 214, 60, 40, 18); c.fill();
      c.fillRect(sx - 30, dy - 50, 22, 50); c.fillRect(sx + 6, dy - 50, 22, 50);
      const cyc = (t * .42 + f * .31) % 1, inh = Math.pow(Math.max(0, Math.sin(cyc * Math.PI * 2)), 3);   // затяжка: огонёк вспыхивает, комнату красит голубым
      if (inh > .02) { c.save(); c.beginPath(); c.rect(L + 10, fy + 10, DM.w - 20, FH - 30); c.clip(); circ(c, dx + 60, dy - 100, 150 + 60 * inh, rgba('#38bdf8', .12 * inh)); c.restore() }
      const vx = dx + 60, vy = dy - 104; rr(c, vx - 7, vy - 26, 14, 30, 5); fill(c, '#0ea5e9'); circ(c, vx, vy - 20, 16 + 12 * inh, rgba('#38bdf8', .35 + .3 * inh)); circ(c, vx, vy - 20, 4 + 3 * inh, '#e0f2fe');
      c.save(); c.beginPath(); c.rect(L + 10, fy + 10, DM.w - 20, FH - 30); c.clip();   // пар — контурные кружки
      for (let j = 0; j < 5; j++) { const ph = (t * .35 + j / 5 + f * .13) % 1, r0 = 10 + ph * 30; if (ph < .9) { c.beginPath(); c.arc(vx + 4 + Math.sin(ph * 6 + j) * 16 + ph * 50, vy - 40 - ph * 150, r0, 0, TAU); lnS(c, 4, rgba('#e0f2fe', .8 * (1 - ph))) } }
      c.restore();
    }
    c.save(); poly(c, [L, T, R, T, L, B]); c.clip();   // фасад: верхний левый угол, сетка окон
    c.fillStyle = '#5f5876'; c.fillRect(L, T, DM.w, B - T);
    for (let f = 0; f < 4; f++) for (let i = 0; i < 4; i++) { const wx = L + 40 + i * 150, wy = T + f * FH + 60; rr(c, wx, wy, 90, 120, 6); fill(c, H1(i + f * 4) > .5 ? S8.win : '#2b2638'); rr(c, wx, wy, 90, 120, 6); lnS(c, 5, S8.slab) }
    c.restore();
    c.beginPath(); c.moveTo(R, T); c.lineTo(L, B); lnS(c, 18, S8.slab);   // косая белая балка по срезу
    c.fillStyle = '#1d1a2b'; c.fillRect(L - 20, T - 34, DM.w + 40, 36); c.beginPath(); c.rect(L - 20, T - 34, DM.w + 40, 36); lnS(c, 4, S8.slab);
    c.beginPath(); c.rect(L, T, DM.w, B - T); lnS(c, 5, S8.slab);
  }
  const MOON = { x: 220, y: 340, r: 95 };
  function moon8(c, x, y, r, col = '#f8fafc') { circ(c, x, y, r, col); circ(c, x - r * .3, y - r * .2, r * .18, '#e2e8f0'); circ(c, x + r * .3, y + r * .25, r * .13, '#e2e8f0') }
  function shot8(c, t) {
    // 75.5–76.5: касса уезжает вниз, монета летит по дуге и становится Луной; город поднимается снизу; общежитие въезжает справа
    const p = eio(at(t, K.s8 - .57, K.s8 + .43));
    const kp = 1 + .2 * eo(at(t, K.s8 + .5, K.b0 + 2));   // v18.5: наезд не встаёт к доске
    const kc = eo(at(t, K.s8 - .2, K.s8 + .8)), kc2 = eo(at(t, K.s8 + .05, K.s8 + 1));
    c.save(); c.translate(620, 1010); c.scale(kp, kp); c.translate(-620, -1010);
    c.fillStyle = S8.bg; c.fillRect(-500, -500, WW + 1000, HH + 1000);
    for (let i = 0; i < 26; i++) circ(c, H1(i * 4.4) * WW, H1(i * 6.6) * 900, 2 + H1(i) * 2, rgba('#e2e8f0', .35 + .25 * Math.sin(t * 1.7 + i)));
    if (p >= 1) moon8(c, MOON.x, MOON.y, MOON.r);
    c.save(); c.translate(0, 900 * (1 - kc)); cityRow(c, 21, 1420, 260, 640, S8.b1, .25, t); spire(c, 250, 1420); c.restore();
    c.save(); c.translate(0, 900 * (1 - kc2)); cityRow(c, 7, 1420, 160, 420, S8.b2, .35, t); c.restore();
    c.fillStyle = '#1d1a2b'; c.fillRect(-500, 1400, WW + 1000, 900); c.beginPath(); c.moveTo(-500, 1400); c.lineTo(WW + 500, 1400); lnS(c, 4, S8.slab);
    const kd = bo(at(t, K.s8 + .43, K.s8 + 1.3)); if (kd > 0) dorm(c, t, lp(1460, 600, kd));
    c.restore();
    if (p < 1) {   // касса уезжает вниз целиком (без растворения), монета летит в Луну
      c.save(); c.translate(0, 1950 * p); c.beginPath(); c.rect(-200, -200, WW + 400, HH + 400); c.clip(); shotD(c, t); c.restore();
      const x = lp(540, MOON.x, p), y = lp(850, MOON.y, p) - Math.sin(Math.PI * p) * 140, r = lp(36, MOON.r, p);
      if (p > .6) moon8(c, x, y, r, mixc('#f59e0b', '#f8fafc', ss(.6, 1, p))); else { circ(c, x, y, r, mixc('#f59e0b', '#f8fafc', p)); ring(c, x, y, r * .76, rgba('#b45309', 1 - p), 4) }
    }
  }
