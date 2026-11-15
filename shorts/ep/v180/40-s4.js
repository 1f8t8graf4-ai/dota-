  // ================= СЦЕНА 4: конвейер → океанская волна → лист отчёта со столбиками =================
  function stormBg(c, t) {   // грозовое небо, горизонт, берег США
    vgrad(c, -100, -100, WW + 200, 1200, ['#0b1530', '#1e3a5f', '#2b4c73']);
    for (let i = 0; i < 6; i++) { const cx = ((H1(i * 3) * 1300 + t * 22 * (1 + i * .2)) % 1500) - 200, cy = 140 + i * 110; c.save(); c.globalAlpha = .35; [0, 90, 180, 270].forEach((dx, j) => circ(c, cx + dx, cy + (j % 2 ? -26 : 0), 80 + j * 6, i % 2 ? '#1e293b' : '#334155')); c.restore() }
    // берег: город на горизонте и статуя с факелом
    c.fillStyle = '#0f1a30'; let x = 560; for (let i = 0; i < 9; i++) { const w = 40 + H1(i * 5) * 40, h = 40 + H1(i * 9) * 130; c.fillRect(x, 960 - h, w, h + 2); x += w + 4 }
    c.fillRect(170, 870, 18, 90); poly(c, [160, 960, 200, 960, 190, 890, 170, 890]); c.fill(); circ(c, 179, 868, 12, '#0f1a30'); c.fillRect(186, 820, 6, 46); glow(c, 189, 818, 30, '#fde68a', .6);
    vgrad(c, -100, 960, WW + 200, 1000, ['#16305a', '#0b1a36']);
  }
  const WV = { x0: 0, x1: WW };
  function waveY(t, x, A, base, cx) {   // поверхность: горб-гребень + рябь
    const d = (x - cx) / 330; return base - A * Math.exp(-d * d) * (1 + .12 * Math.sin(t * 2)) - A * .16 * Math.sin(x * .012 + t * 3) - 14 * Math.sin(x * .03 - t * 4);
  }
  function wave(c, t, A, base, cx, o = {}) {   // красно-синяя волна: гребень красный, толща синяя, пунктир течений
    const pts = []; for (let x = -60; x <= WW + 60; x += 20) pts.push([x, waveY(t, x, A, base, cx)]);
    c.save(); c.beginPath(); c.moveTo(-60, HH + 100); pts.forEach(p => c.lineTo(p[0], p[1])); c.lineTo(WW + 60, HH + 100); c.closePath();
    const g = c.createLinearGradient(0, base - A, 0, HH); g.addColorStop(0, '#1d4ed8'); g.addColorStop(1, '#1e3a8a'); c.fillStyle = g; c.fill(); c.clip();
    c.setLineDash([18, 14]); c.lineDashOffset = -t * 60; c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 5;
    [110, 230, 360, 500].forEach(off => { c.beginPath(); pts.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0], p[1] + off)); c.stroke() });
    c.restore();
    c.save(); c.beginPath(); pts.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0], p[1])); c.strokeStyle = '#ef4444'; c.lineWidth = o.cw || 48; c.lineJoin = 'round'; c.stroke();
    c.beginPath(); pts.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0], p[1] - (o.cw || 48) * .3)); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 6; c.stroke(); c.restore();
  }
  function ship(c, x, y, r, t) {   // контейнеровоз 340×160 с контейнерами PUFF / HQD / ELF
    c.save(); c.translate(x, y); c.rotate(r);
    poly(c, [-170, -40, 170, -40, 140, 30, -150, 30]); fill(c, '#1f2937'); c.fillStyle = '#b91c1c'; c.fillRect(-160, 8, 315, 20);
    rr(c, 92, -110, 52, 72, 6); fill(c, '#f8fafc'); c.fillStyle = '#0ea5e9'; c.fillRect(98, -98, 40, 12); c.fillStyle = '#334155'; c.fillRect(110, -136, 12, 28);
    [['PUFF', '#ec4899', K.puff], ['HQD', '#2563eb', K.hqd], ['ELF', '#a855f7', K.elf]].forEach(([s, col, tt0], i) => {
      const k = spr(at(t, tt0 - .05, tt0 + .35)); if (k <= 0) return;
      c.save(); c.translate(-118 + i * 98, -40 - 33); c.translate(0, -(1 - k) * 120); rr(c, -47, -32, 95, 65, 5); fill(c, col);
      for (let j = 0; j < 6; j++) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-40 + j * 15, -28, 4, 56) } tx(c, s, 0, 2, { f: 'U', w: 800, s: 22, c: '#fff' }); c.restore();
    });
    c.restore();
  }
  function deskBg(c, t) {   // тёмный деревянный стол с канцелярией
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#2b1a0f', '#3a2414', '#24150b']);
    c.save(); c.strokeStyle = 'rgba(0,0,0,.22)'; c.lineWidth = 3; for (let i = 0; i < 24; i++) { const y0 = i * 84; c.beginPath(); for (let x = -40; x <= WW + 40; x += 40) c.lineTo(x, y0 + Math.sin(x * .005 + i * 2.1) * 20); c.stroke() } c.restore();
    c.save(); c.translate(980, 300); c.rotate(.6); rr(c, -12, -190, 24, 380, 6); fill(c, '#1d4ed8'); poly(c, [-12, 190, 12, 190, 0, 226]); fill(c, '#e2e8f0'); c.restore();   // ручка
    for (let i = 0; i < 3; i++) { c.save(); c.translate(90 + i * 34, 1420 - i * 20); c.rotate(.3 + i * .4); rr(c, -24, -8, 48, 16, 8); stroke(c, '#cbd5e1', 4); c.restore() }   // скрепки
    c.save(); c.translate(80, 360); c.rotate(-.12); rr(c, -60, -60, 120, 120, 6); fill(c, '#fde047'); c.restore();   // стикер
    glow(c, 540, 820, 900, '#fde68a', .10); vignette(c, .55, '10,5,2');
  }
  const RP = { x: 540, y: 830, w: 840, h: 1020, r: -.0524 };   // лист отчёта: -3°
  function report(c, t, ku) {   // ku — лист разворачивается вниз из шапки
    c.save(); c.translate(RP.x, RP.y); c.rotate(RP.r);
    const top = -RP.h / 2, hh = RP.h * ku;
    c.save(); c.translate(10, 14); rr(c, -RP.w / 2, top, RP.w, hh, 8); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, -RP.w / 2, top, RP.w, hh, 8); fill(c, '#f8fafc');
    c.save(); rr(c, -RP.w / 2, top, RP.w, hh, 8); c.clip();
    tx(c, 'ДОЛЯ ОДНОРАЗОК У ПАРЯЩИХ СТАРШЕКЛАССНИКОВ', 0, top + RP.h - 92, { f: 'M', w: 800, s: 26, c: '#475569', mw: RP.w - 80 });
    const BY = 1180 - RP.y, x19 = 360 - RP.x, x20 = 720 - RP.x;
    c.fillStyle = '#cbd5e1'; for (let i = 1; i < 5; i++) c.fillRect(-RP.w / 2 + 60, BY - i * 160, RP.w - 120, 2);
    c.fillStyle = '#0f172a'; c.fillRect(-RP.w / 2 + 50, BY, RP.w - 100, 6);
    const k19 = bo(at(t, K.par - .1, K.par + .45)), k20 = bo(at(t, K.vyr - .15, K.vyr + .55));
    const bar = (x, hgt, col, k, yr, lab, labA) => {
      const h = hgt * k, R = 48; if (h > 1) { rr(c, x - 80, BY - h, 160, h, 10); fill(c, col) }
      circ(c, x, BY - h, R, col); circ(c, x, BY - h, R - 8, '#fff'); tx(c, yr, x, BY - h + 2, { f: 'O', w: 700, s: 30, c: col === '#ef4444' ? '#b91c1c' : '#334155' });
      if (labA > 0) tx(c, lab, x, BY - h - 80, { f: 'U', w: 800, s: 40, c: col === '#ef4444' ? '#dc2626' : '#475569', a: labA });
      return BY - h;
    };
    if (ku > .9) {
      bar(x19, 75, '#64748b', Math.max(.02, k19), '2019', '2,4%', at(t, K.par + .2, K.par + .5));
      const ty = bar(x20, 720, '#ef4444', Math.max(.02, k20), '2020', '', 0);
      const kl = spr(at(t, K.x11 - .1, K.x11 + .4));
      if (kl > 0) { c.save(); c.translate(x20 - 250, ty + 40); c.scale(kl, kl); rr(c, -150, -70, 300, 140, 16); fill(c, '#ef4444'); tx(c, '26,5%', 0, -20, { f: 'U', w: 800, s: 50, c: '#fff' }); tx(c, 'РОСТ ×11', 0, 34, { f: 'O', w: 700, s: 34, c: '#fee2e2', ls: 2 }); c.restore() }
    }
    tx(c, 'NYTS · CDC / FDA', 0, top + RP.h - 50, { f: 'O', w: 500, s: 24, c: '#94a3b8', ls: 2, a: ku > .95 ? 1 : 0 });
    c.restore();
    // шапка — бывшая волна: красно-синяя полоса 840×90
    rr(c, -RP.w / 2, top - 90, RP.w, 90, 10); fill(c, '#1d4ed8'); c.fillStyle = '#ef4444'; c.fillRect(-RP.w / 2, top - 90, RP.w, 34);
    tx(c, 'ОПРОС ШКОЛЬНИКОВ США · CDC', 0, top - 32, { f: 'O', w: 700, s: 30, c: '#fff', ls: 2 });
    c.restore();
  }
  function shot4(c, t) {
    const kf = eio(at(t, K.vsego - .05, K.vsego + .6));   // волна выпрямляется в шапку листа
    const ks = ss(K.s4 - .1, K.s4 + .5, t);
    if (kf < 1) {
      if (ks < 1) factoryShot(c, t);
      A(c, ks, () => stormBg(c, t));
      const amp = 380 * eo(at(t, K.s4, K.s4 + 1.2)) * (1 - kf), base = lp(lp(1220, 1060, eo(at(t, K.s4, K.s4 + 1.2))), 280, kf), cx = lp(300, 640, at(t, K.s4, K.vsego));
      if (ks < 1) A(c, 1 - ks, () => conveyor(c, t, 1));
      A(c, 1 - kf * kf, () => wave(c, t, amp, base, cx));
      const sx = lp(130, 950, at(t, K.s4 + .3, K.vsego)), sy = waveY(t, sx, amp, base, cx) - 46, d = waveY(t, sx + 10, amp, base, cx) - waveY(t, sx - 10, amp, base, cx);
      if (kf < .5) A(c, ks * (1 - kf * 2), () => ship(c, sx, sy, Math.atan2(d, 20), t));
    }
    if (kf > 0) {
      A(c, kf, () => deskBg(c, t));
      report(c, t, eo(at(t, K.vsego + .45, K.vsego + 1.05)));
    }
  }
