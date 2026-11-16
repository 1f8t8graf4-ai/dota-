  // ================= СЦЕНА 4 (v18.4): конвейер → волна как у Coca-Cola #007 → лист отчёта как у Мадонны #109 =================
  // Волна плоская, как у Боба: красный гребень, белая пена, тёмно-синяя толща с пунктиром течений, ниже — второй вал светлее.
  // Небо — ровный тёмно-синий с точками звёзд. Кораблик контуром, контейнеры PUFF / HQD / ELF впрыгивают на названия.
  // Волна сжимается в шапку листа (те же три полосы), лист — светло-серый, второй белый лист лежит под ним, фон ровный, как у Мадонны.
  const S4 = { sky: '#151d3b', red: '#e8445a', foam: '#f1f5f9', sea: '#1d2b5c', sea2: '#26387a', ln: '#f1f5f9', desk: '#363a5e', brick: '#3f4469', sheet: '#e7e7ee' };
  function stormBg(c, t) {   // небо: ровный цвет, точки звёзд, контурные облака (как в сцене 1)
    c.fillStyle = S4.sky; c.fillRect(-300, -300, WW + 600, HH + 600);
    for (let i = 0; i < 40; i++) { const x = H1(i * 3.7) * WW, y = H1(i * 7.3) * 1100, r = 2 + H1(i * 1.9) * 2.5; circ(c, x, y, r, rgba('#e2e8f0', .35 + .3 * Math.sin(t * 2 + i))) }
    cloudS1(c, 230 + Math.sin(t * .2) * 14, 330, 1, 1); cloudS1(c, 820 + Math.sin(t * .25 + 1) * 14, 470, .8, 1);
  }
  const WV = { x0: 0, x1: WW };
  function waveY(t, x, A, base, cx) {   // поверхность: горб-гребень + рябь
    const d = (x - cx) / 330; return base - A * Math.exp(-d * d) * (1 + .12 * Math.sin(t * 2)) - A * .16 * Math.sin(x * .012 + t * 3) - 14 * Math.sin(x * .03 - t * 4);
  }
  function wave(c, t, A, base, cx, o = {}) {   // красный гребень, белая пена, синяя толща с пунктиром; второй вал ниже
    const pts = []; for (let x = -80; x <= WW + 80; x += 20) pts.push([x, waveY(t, x, A, base, cx)]);
    const rb = o.rb ?? 84, wb = o.wb ?? 26, da = o.da ?? 1;
    const band = (off, col) => { c.beginPath(); c.moveTo(-80, HH + 400); pts.forEach(p => c.lineTo(p[0], p[1] + off)); c.lineTo(WW + 80, HH + 400); c.closePath(); fill(c, col) };
    band(0, o.cc || S4.red); band(rb, o.cw || S4.foam); band(rb + wb, o.b0 || S4.sea);
    if (da > 0) {   // пунктир течений — вертикальные струйки, бегут вниз
      c.save(); c.beginPath(); c.moveTo(-80, HH + 400); pts.forEach(p => c.lineTo(p[0], p[1] + rb + wb + 24)); c.lineTo(WW + 80, HH + 400); c.closePath(); c.clip();
      c.setLineDash([16, 18]); c.lineDashOffset = -t * 40; c.strokeStyle = rgba('#e2e8f0', .3 * da); c.lineWidth = 4;
      for (let i = 0; i < 14; i++) { const x = 40 + i * 78; c.beginPath(); c.moveTo(x, 0); c.bezierCurveTo(x + 20, 700, x - 20, 1300, x + 10, HH + 300); c.stroke() }
      c.restore();
    }
    if (o.front !== false) {   // второй вал — светлее, качается в противофазе
      const fy = x => Math.max(waveY(t, x, A, base, cx) + rb + wb + 160, base + 280 + 60 * Math.sin(x * .006 - t * 1.6) + 30 * Math.sin(x * .017 + t * 2.2));
      c.beginPath(); c.moveTo(-80, HH + 400); for (let x = -80; x <= WW + 80; x += 20) c.lineTo(x, fy(x)); c.lineTo(WW + 80, HH + 400); c.closePath(); fill(c, o.b1 || S4.sea2);
    }
    c.save(); c.beginPath(); pts.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0], p[1])); c.globalAlpha *= o.hl ?? 1; lnS(c, 5, '#ffd6dc'); c.restore();
  }
  function ship(c, x, y, r, t) {   // контейнеровоз контуром: тёмный корпус, красная полоса, рубка, контейнеры впрыгивают
    c.save(); c.translate(x, y); c.rotate(r);
    poly(c, [-175, -40, 175, -40, 145, 34, -155, 34]); fill(c, '#1b2142'); c.fillStyle = S4.red; c.fillRect(-160, 10, 312, 14); poly(c, [-175, -40, 175, -40, 145, 34, -155, 34]); lnS(c, 5);
    rr(c, 94, -112, 54, 72, 6); fill(c, '#1b2142'); rr(c, 94, -112, 54, 72, 6); lnS(c, 5); c.fillStyle = '#5eead4'; c.fillRect(102, -98, 38, 10); c.beginPath(); c.moveTo(121, -112); c.lineTo(121, -140); lnS(c, 5);
    [['PUFF', '#ec4899', Math.max(K.puff, K.s4 + .75)], ['HQD', '#2563eb', Math.max(K.hqd, K.s4 + 1)], ['ELF', '#a855f7', K.elf]].forEach(([s, col, tt0], i) => {
      const k = spr(at(t, tt0 - .05, tt0 + .35)); if (k <= 0) return;
      c.save(); c.translate(-118 + i * 98, -73); c.translate(0, -(1 - k) * 120); rr(c, -47, -32, 95, 65, 5); fill(c, col);
      c.beginPath(); for (let j = 0; j < 5; j++) { c.moveTo(-34 + j * 17, -24); c.lineTo(-34 + j * 17, 24) } lnS(c, 3, 'rgba(0,0,0,.22)');
      rr(c, -47, -32, 95, 65, 5); lnS(c, 4); tx(c, s, 0, 2, { f: 'U', w: 800, s: 22, c: '#fff' }); c.restore();
    });
    c.restore();
  }
  function deskBg(c, t) {   // ровный фон, как у Мадонны: бледные кирпичи, контурные скрепки и ручка
    c.fillStyle = S4.desk; c.fillRect(-300, -300, WW + 600, HH + 600);
    [[120, 210], [190, 250], [860, 160], [930, 200], [80, 1500], [150, 1540], [900, 1430], [980, 1470], [960, 760], [70, 900]].forEach(([x, y], i) => { rr(c, x - 60, y - 16, 120, 32, 6); fill(c, S4.brick) });
    c.save(); c.translate(985, 520); c.rotate(.55); rr(c, -11, -170, 22, 340, 8); lnS(c, 4, rgba('#e2e8f0', .45)); c.beginPath(); c.moveTo(-11, 170); c.lineTo(0, 205); c.lineTo(11, 170); lnS(c, 4, rgba('#e2e8f0', .45)); c.restore();
    for (let i = 0; i < 2; i++) { c.save(); c.translate(95 + i * 40, 1290 - i * 24); c.rotate(.3 + i * .5); rr(c, -26, -9, 52, 18, 9); lnS(c, 4, rgba('#e2e8f0', .45)); c.restore() }
  }
  const RP = { x: 540, y: 830, w: 840, h: 980, r: -.0524 };   // шапка 260–340, лист 340–1320; лист отчёта: −3°
  function report(c, t, ku, o = {}) {   // ku — лист разворачивается вниз из шапки
    c.save(); c.translate(RP.x, RP.y); c.rotate(RP.r);
    const top = -RP.h / 2, hh = RP.h * ku;
    const k2 = eo(at(t, FL0() + .5, FL0() + 1.1));   // второй лист под низом — выезжает справа, как у Мадонны
    if (k2 > 0) { c.save(); c.translate(40 + 900 * (1 - k2), 26); c.rotate(.085); c.translate(10, 14); rr(c, -RP.w / 2, top - 60, RP.w, RP.h + 40, 8); fill(c, 'rgba(0,0,0,.25)'); c.translate(-10, -14); rr(c, -RP.w / 2, top - 60, RP.w, RP.h + 40, 8); fill(c, '#fbfbfd'); c.restore() }
    c.save(); c.translate(12, 16); rr(c, -RP.w / 2, top, RP.w, hh, 8); fill(c, 'rgba(0,0,0,.28)'); c.restore();
    rr(c, -RP.w / 2, top, RP.w, hh, 8); fill(c, S4.sheet);
    c.save(); rr(c, -RP.w / 2, top, RP.w, hh, 8); c.clip();
    tx(c, 'ДОЛЯ ОДНОРАЗОК У ПАРЯЩИХ СТАРШЕКЛАССНИКОВ', 0, top + RP.h - 92, { f: 'M', w: 800, s: 26, c: '#4b4f72', mw: RP.w - 80 });
    const BY = 1180 - RP.y, x19 = 360 - RP.x, x20 = 720 - RP.x;
    c.fillStyle = '#d4d4de'; for (let i = 1; i < 5; i++) c.fillRect(-RP.w / 2 + 60, BY - i * 160, RP.w - 120, 3);
    c.fillStyle = '#363a5e'; c.fillRect(-RP.w / 2 + 50, BY, RP.w - 100, 6);
    const k19 = bo(at(t, K.par - .1, K.par + .45)), k20 = bo(at(t, K.vyr - .15, K.vyr + .55));
    const bar = (x, hgt, col, k, yr, lab, labA) => {
      const h = hgt * k, R = 48; if (h > 1) { rr(c, x - 80, BY - h, 160, h, 10); fill(c, col) }
      circ(c, x, BY - h, R, col); circ(c, x, BY - h, R - 8, '#fff'); tx(c, yr, x, BY - h + 2, { f: 'O', w: 700, s: 30, c: col === '#ef4444' ? '#b91c1c' : '#363a5e' });
      if (labA > 0) tx(c, lab, x, BY - h - 80, { f: 'U', w: 800, s: 40, c: col === '#ef4444' ? '#dc2626' : '#4b4f72', a: labA });
      return BY - h;
    };
    if (ku > .9) {
      bar(x19, 75, '#7c80a3', Math.max(.02, k19), '2019', '2,4%', at(t, K.par + .2, K.par + .5));
      const ty = o.hideBar ? BY - 720 : bar(x20, 720, '#ef4444', Math.max(.02, k20), '2020', '', 0);
      const kl = spr(at(t, K.x11 - .1, K.x11 + .4));
      if (kl > 0) { c.save(); c.translate(x20 - 250, ty + 40); c.scale(kl, kl); rr(c, -150, -70, 300, 140, 16); fill(c, '#ef4444'); tx(c, '26,5%', 0, -20, { f: 'U', w: 800, s: 50, c: '#fff' }); tx(c, 'РОСТ ×11', 0, 34, { f: 'O', w: 700, s: 34, c: '#fee2e2', ls: 2 }); c.restore() }
    }
    tx(c, 'ОФИЦИАЛЬНЫЙ ОТЧЁТ США · CDC', 0, top + RP.h - 50, { f: 'O', w: 500, s: 24, c: '#8a8eb0', ls: 2, a: ku > .95 ? 1 : 0 });
    c.restore();
    // шапка — бывшая волна: красная полоса, белая нитка пены, синяя полоса
    if (!o.noHead) { rr(c, -RP.w / 2, top - 80, RP.w, 80, 10); fill(c, S4.sea); c.save(); rr(c, -RP.w / 2, top - 80, RP.w, 80, 10); c.clip(); c.fillStyle = S4.red; c.fillRect(-RP.w / 2, top - 80, RP.w, 34); c.fillStyle = S4.foam; c.fillRect(-RP.w / 2, top - 46, RP.w, 6); c.restore() }
    const kt = spr(at(t, K.vsego + .2, K.vsego + .6)); if (kt > 0) { c.save(); c.translate(0, top - 20); c.scale(kt, kt); tx(c, 'ОПРОС ШКОЛЬНИКОВ США', 0, 2, { f: 'O', w: 700, s: 28, c: '#fff', ls: 3 }); c.restore() }
    c.restore();
  }
  const FL0 = () => K.vsego - .39;   // 38.4: волна начинает сжиматься в шапку
  const kSheet = t => eo(at(t, FL0() + .15, FL0() + 1));
  const deskS = t => 1 + .05 * at(t, FL0() + 1, K.s5);
  function deskShot(c, t, o = {}) { const s = deskS(t); c.save(); c.translate(540, 830); c.scale(s, s); c.translate(-540, -830); deskBg(c, t); report(c, t, kSheet(t), o); c.restore() }
  function shot4(c, t) {
    const T0 = K.s4 - .49, pc = at(t, T0, T0 + 1);   // 33.5–34.5: лента конвейера поднимается и становится гребнем волны
    const kf = eio(at(t, FL0(), FL0() + 1));        // 38.4–39.4: волна сжимается в шапку листа
    const kd = eo(at(t, T0 + 1, T0 + 1.7)), cx = lp(300, 640, at(t, K.s4, K.vsego));
    const amp = (pc < 1 ? lp(0, 260, pc) : lp(260, 380, kd)) * (1 - kf), base = pc < 1 ? lp(1220, 650, pc) : lp(650, 1060, kd);
    if (kf >= 1) { deskShot(c, t); return }
    if (kf <= 0) {
      stormBg(c, t);
      if (pc < 1) { c.save(); c.translate(0, -1200 * pc); c.beginPath(); c.rect(-200, -400, WW + 400, 1620); c.clip(); factoryShot(c, t); c.restore() }   // цех и ряд одноразок уезжают вверх
      wave(c, t, amp, base, cx, pc < 1 ? { cc: mixc('#475569', S4.red, pc), cw: mixc('#1f2937', S4.foam, pc), b0: mixc('#1f2937', S4.sea, pc), b1: mixc('#0b0f19', S4.sea2, pc), rb: lp(12, 84, pc), wb: lp(0, 26, pc), da: pc, hl: pc } : {});
      const u = at(t, T0 + 1, K.vsego - .35), sx = -220 + 1570 * (1 - Math.pow(1 - u, 2.5));
      if (pc >= 1 && u < 1) { const sy = waveY(t, sx, amp, base, cx) - 46, d = waveY(t, sx + 10, amp, base, cx) - waveY(t, sx - 10, amp, base, cx); ship(c, sx, sy, Math.atan2(d, 20), t) }
      return;
    }
    // волна не исчезает: амплитуда в 0, ширина 1080 → 840, верх → 260, низ → 340 — это шапка «ОПРОС ШКОЛЬНИКОВ США» (те же полосы);
    // одновременно из-под неё разворачивается лист
    deskShot(c, t, { noHead: true });
    const yS = lp(base, 260, kf), yTop = lp(-300, 260, kf), yBot = lp(HH + 300, 340, kf), xL = lp(-200, 120, kf), xR = lp(WW + 200, 960, kf), s = deskS(t);
    c.save(); c.translate(540, 830); c.scale(s, s); c.translate(-540, -830); c.translate(540, 830); c.rotate(RP.r * kf); c.translate(-540, -830);
    c.beginPath(); c.roundRect(xL, yTop, xR - xL, yBot - yTop, 10 * kf); c.clip();
    stormBg(c, t);
    wave(c, t, amp, yS, cx, { rb: lp(84, 34, kf), wb: lp(26, 6, kf), hl: 1 - kf, da: 1 - kf, front: kf < .5 });
    c.restore();
  }
