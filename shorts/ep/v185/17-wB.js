  // ================= v18.5: МИР B (≈30…43 с) — «Пока «Джул» убирал вкусы с полок…» → океан → Шэньчжэнь → волна → ×11 =================
  // Карта-игрушка вертикально: внизу берег США с магазином (в его окне — полка «Джула»), посередине океан, вверху — Китай и завод.
  // Камера выходит из дыры в листе прямо к полке, отъезжает до всей карты, наезжает на завод, едет вниз вместе с волной одноразок,
  // на берегу США из воды встают два столбика-колбы (2019 · 2,4 % и 2020 · 26,5 %), камера ныряет в жидкость большого.
  const WB = { sea: '#1f3563', sea2: '#2c4f8a', land: '#3a4066', land2: '#2f3454', ln: '#eef2f7', ink: '#1e2340', red: '#e8445a', warm: '#ffd479',
    wood: '#c9a27a', wood2: '#9a7350', crate: '#b98a5e', liq: '#3fb7e3', liq2: '#1f8fc4' };
  const POD_TOP = [['МАНГО', '#f97316'], ['ФРУКТЫ', '#ec4899'], ['КРЕМ', '#eab308'], ['ОГУРЕЦ', '#84cc16'], ['МЯТА', '#22c55e']];
  const POD_BOT = [['ТАБАК', '#a8835a', 1], ['МЕНТОЛ', '#67c7d9', 1], ['МАНГО', '#f97316'], ['МЯТА', '#22c55e']];
  const COAST_US = 1000, COAST_CN = -2250, FAC = { y: -2480 }, COL = { x0: 20, x1: 280, base: 1150, h: 1150, sx0: -330, sx1: -170, sh: 105 };
  const coastY = (x, y0, a, ph) => y0 + a * Math.sin(x / 260 + ph) + a * .5 * Math.sin(x / 97 + ph * 2);
  function seaB(c, t, v) {
    const r = v || { x0: -3000, x1: 3000, y0: -6000, y1: 3000 };
    c.fillStyle = WB.sea; c.fillRect(r.x0 - 50, r.y0 - 50, r.x1 - r.x0 + 100, r.y1 - r.y0 + 100);
    // волнышки на воде: короткие дуги, качаются на месте
    for (let i = 0; i < 90; i++) {
      const x = -1400 + H1(i * 3.1) * 2800, y = COAST_CN + 80 + H1(i * 7.7) * (COAST_US - COAST_CN - 160); if (v && (x < r.x0 - 80 || x > r.x1 + 80 || y < r.y0 - 80 || y > r.y1 + 80)) continue;
      const b = Math.sin(t * 1.6 + i) * 8; c.beginPath(); c.arc(x, y + b, 26, Math.PI * 1.15, Math.PI * 1.85); lnW(c, 5, rgba(WB.ln, .28));
    }
  }
  function landB(c, t, y0, dir, label, lx, ly) {   // берег: волнистая линия, земля в сторону dir (+1 вниз, −1 вверх)
    c.beginPath(); c.moveTo(-3200, y0); for (let x = -3200; x <= 3200; x += 40) c.lineTo(x, coastY(x, y0, 26, y0)); c.lineTo(3200, y0 + dir * 4000); c.lineTo(-3200, y0 + dir * 4000); c.closePath(); fill(c, WB.land);
    c.save(); c.clip(); dotsRect(c, -3200, y0 + (dir > 0 ? 60 : -1460), 6400, 1400, 22, 3, 'rgba(10,12,30,.18)'); c.restore();
    c.beginPath(); for (let x = -3200; x <= 3200; x += 40) { const y = coastY(x, y0, 26, y0); if (x === -3200) c.moveTo(x, y); else c.lineTo(x, y) } lnW(c, 7, WB.ln);
    c.beginPath(); for (let x = -3200; x <= 3200; x += 40) { const y = coastY(x, y0, 26, y0) - dir * (34 + 6 * Math.sin(t * 2 + x / 80)); if (x === -3200) c.moveTo(x, y); else c.lineTo(x, y) } lnW(c, 4, rgba(WB.ln, .45));
    tx(c, label, lx, ly, { f: 'U', w: 800, s: 92, c: rgba(WB.ln, .5), ls: 8 });
  }
  function podB(c, x, yb, col, s = 1) {   // картридж «Джула» стоя: корпус и цветной верх
    c.save(); c.translate(x, yb); c.scale(s, s);
    c.beginPath(); c.roundRect(-24 + 6, -150 + 8, 48, 150, 12); fill(c, 'rgba(8,10,24,.3)');
    c.beginPath(); c.roundRect(-24, -150, 48, 150, 12); fill(c, '#a9b0c4'); lnW(c, 4, WB.ink);
    c.beginPath(); c.roundRect(-24, -150, 48, 48, [12, 12, 4, 4]); fill(c, col); lnW(c, 4, WB.ink);
    c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-16, -142, 8, 32); circ(c, 0, -30, 5, '#7dd3fc'); c.restore();
  }
  function shelfB(c, t) {   // окно магазина изнутри: стена, вывеска JUUL, две полки
    const k = W2;
    c.fillStyle = '#3a4066'; c.fillRect(-420, -900, 840, 1800);
    c.save(); c.beginPath(); c.rect(-420, -900, 840, 1800); c.clip(); dotsRect(c, 230, -900, 190, 1800, 18, 2.6, 'rgba(10,12,30,.18)'); c.restore();
    c.beginPath(); c.roundRect(-190, -720, 380, 120, 16); fill(c, '#f4efe4'); lnW(c, 5, WB.ink); tx(c, 'JUUL', 0, -656, { f: 'U', w: 800, s: 84, c: WB.ink, ls: 10 });
    glow(c, 0, -660, 330, WB.warm, .1);
    let n = 0;
    [[-250, POD_TOP, [-260, -130, 0, 130, 260]], [220, POD_BOT, [-210, -70, 70, 210]]].forEach(([yb, L, xs]) => {
      L.forEach(([nm, col, keep], i) => {
        let x = xs[i], y = yb, r = 0;
        if (!keep) { const tr = k.ubir - .15 + n * .12, e = at(t, tr, tr + .55); n++;
          if (e > 0) { x += 60 * ei(e) + 380 * Math.pow(e, 3); y += -26 * Math.sin(Math.PI * cl(e * 2)) + 900 * Math.pow(cl(e * 1.4 - .4), 2); r = 1.6 * ei(e) } }
        if (y < 900) { c.save(); c.translate(x, y); c.rotate(r); podB(c, 0, 0, col); c.restore() }
        tx(c, nm, xs[i], yb + 52, { f: 'M', w: 800, s: 20, c: keep ? '#e5e7eb' : rgba('#e5e7eb', 1 - at(t, k.ubir, k.polok)), ls: 1 });
      });
      c.beginPath(); c.rect(-370, yb, 740, 26); fill(c, WB.wood); lnW(c, 4, WB.ink); c.fillStyle = WB.red; c.fillRect(-370, yb + 18, 740, 8);
    });
    // блики стекла
    c.save(); c.globalAlpha = .07; poly(c, [-420, -200, -200, -900, -110, -900, -330, -200]); fill(c, '#fff'); poly(c, [80, 900, 330, 200, 380, 200, 130, 900]); fill(c, '#fff'); c.restore();
  }
  function storeB(c, t) {   // магазин на берегу США (стоящая «фишка» на карте)
    c.beginPath(); c.rect(-620 + 24, -1250 + 30, 1240, 2300); fill(c, 'rgba(8,10,24,.35)');
    c.beginPath(); c.rect(-620, -1250, 1240, 2300); fill(c, '#2f3454'); lnW(c, 6, WB.ln);
    c.save(); c.beginPath(); c.rect(-420, -900, 840, 1800); c.clip(); shelfB(c, t); c.restore();
    c.beginPath(); c.rect(-420, -900, 840, 1800); lnW(c, 8, WB.ln);
    c.beginPath(); c.roundRect(-330, -1180, 660, 150, 18); fill(c, '#f4efe4'); lnW(c, 5, WB.ink); tx(c, 'ВЕЙПЫ · США', 0, -1104, { f: 'U', w: 800, s: 64, c: WB.ink });
    // флаг на крыше
    c.beginPath(); c.moveTo(500, -1250); c.lineTo(500, -1560); lnW(c, 8, WB.ln);
    const wv = x => 10 * Math.sin(t * 4 + x / 40);
    for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(500, -1560 + i * 22); for (let x = 0; x <= 260; x += 20) c.lineTo(500 + x, -1560 + i * 22 + wv(x)); c.lineTo(500 + 260, -1560 + (i + 1) * 22 + wv(260)); for (let x = 260; x >= 0; x -= 20) c.lineTo(500 + x, -1560 + (i + 1) * 22 + wv(x)); c.closePath(); fill(c, i % 2 ? '#f4efe4' : WB.red) }
    c.beginPath(); c.moveTo(500, -1560); for (let x = 0; x <= 110; x += 20) c.lineTo(500 + x, -1560 + wv(x)); c.lineTo(610, -1560 + 88 + wv(110)); for (let x = 110; x >= 0; x -= 20) c.lineTo(500 + x, -1560 + 88 + wv(x)); c.closePath(); fill(c, WB.ink);
  }
  function factoryB(c, t) {   // завод в Шэньчжэне: пилообразная крыша, трубы, окна загораются, конвейер
    const k = W2, Y = FAC.y, on = at(t, k.zapusk - .3, k.zapusk + .4);
    c.beginPath(); c.rect(-650 + 24, Y - 820 + 30, 1300, 820); fill(c, 'rgba(8,10,24,.35)');
    [-420, -250].forEach((x, i) => { c.beginPath(); c.rect(x - 34, Y - 1420, 68, 700); fill(c, '#3f4570'); lnW(c, 5, WB.ln); for (let j = 0; j < 3; j++) { c.fillStyle = WB.red; c.fillRect(x - 34, Y - 1300 + j * 160, 68, 26) }
      const bl = .5 + .5 * Math.sin(t * 5 + i * 2); circ(c, x, Y - 1440, 12, rgba('#ff6b6b', .4 + .6 * bl * (.3 + .7 * on))) });
    c.beginPath(); c.moveTo(-650, Y); c.lineTo(-650, Y - 820); for (let i = 0; i < 5; i++) { const x = -650 + i * 260; c.lineTo(x + 180, Y - 1060); c.lineTo(x + 260, Y - 820) } c.lineTo(650, Y); c.closePath(); fill(c, '#2f3454'); lnW(c, 6, WB.ln);
    for (let i = 0; i < 5; i++) { const x = -650 + i * 260; poly(c, [x + 186, Y - 1046, x + 252, Y - 830, x + 186, Y - 830]); fill(c, mixc('#1b1f36', '#ffe7a3', on * at(t, k.zapusk + i * .07, k.zapusk + .3 + i * .07))) }
    for (let r = 0; r < 3; r++) for (let q = 0; q < 8; q++) { const x = -560 + q * 145, y = Y - 740 + r * 170, tl = k.zapusk - .2 + (q + r * 3) * .035;
      c.beginPath(); c.roundRect(x, y, 96, 110, 8); fill(c, mixc('#1b1f36', H1(q + r * 8) > .3 ? '#ffd479' : '#f4a261', at(t, tl, tl + .25))); lnW(c, 4, WB.ln) }
    c.beginPath(); c.roundRect(-330, Y - 945, 660, 110, 16); fill(c, '#f4efe4'); lnW(c, 5, WB.ink); tx(c, 'ЗАВОД · ШЭНЬЧЖЭНЬ', 0, Y - 888, { f: 'U', w: 800, s: 46, c: WB.ink });
    // конвейер перед заводом: ролики крутятся, одноразки едут вправо
    const run = Math.max(0, t - (k.zapusk - .1)), sp = 420 * cl(run / .8), dist = run < .8 ? 420 * run * run / 1.6 : 420 * .4 + (run - .8) * 420;
    c.beginPath(); c.roundRect(-640, Y + 30, 1280, 56, 28); fill(c, '#1b1f36'); lnW(c, 5, WB.ln);
    for (let i = 0; i < 21; i++) { const x = -610 + i * 61; c.save(); c.translate(x, Y + 58); c.rotate(dist / 22); circ(c, 0, 0, 18, '#565d8a'); c.beginPath(); c.moveTo(-14, 0); c.lineTo(14, 0); lnW(c, 4, WB.ln); c.restore() }
    if (run > 0) { const N = 26; for (let i = 0; i < N; i++) { let x = -620 + ((dist + i * 50) % 1300); if (x > 640) continue; const col = POD_TOP[i % 5][1];
      c.beginPath(); c.roundRect(x - 15, Y - 58, 30, 88, 9); fill(c, col); lnW(c, 4, WB.ink); c.fillStyle = WB.ink; c.fillRect(x - 15, Y - 58, 30, 18) } }
  }
  const CRATES = [{ x: -400, n: 'PUFF BAR', c: '#a78bfa', w: 'puff' }, { x: 0, n: 'HQD', c: '#f472b6', w: 'hqd' }, { x: 400, n: 'ELF BAR', c: '#34d399', w: 'elf' }];
  function cratesB(c, t) {
    const k = W2, tip = eio(at(t, k.odn - .35, k.odn + .2));
    CRATES.forEach((cr, i) => {
      const ka = bo(at(t, k[cr.w] - .25, k[cr.w] + .2)); if (ka <= 0) return;
      const yb = COAST_CN - 30;
      c.save(); c.translate(cr.x + 150, yb); c.rotate(tip * 1.25); c.translate(-150, 0); c.scale(1, ka); c.translate(0, -1);
      for (let j = 0; j < 7; j++) { if (tip > .5 && H1(j + i * 7) < tip) continue; c.save(); c.translate(-110 + j * 36, -175 - 14 * H1(j * 3 + i)); c.rotate((H1(j + i) - .5) * .5); c.beginPath(); c.roundRect(-15, -40, 30, 86, 9); fill(c, POD_TOP[(i + j) % 5][1]); lnW(c, 4, WB.ink); c.restore() }
      c.beginPath(); c.rect(-150, -170, 300, 170); fill(c, WB.crate); lnW(c, 5, WB.ink); for (let j = 1; j < 3; j++) { c.beginPath(); c.moveTo(-150, -170 + j * 57); c.lineTo(150, -170 + j * 57); lnW(c, 3, '#7a5536') }
      c.beginPath(); c.roundRect(-118, -128, 236, 72, 10); fill(c, '#f4efe4'); lnW(c, 4, WB.ink); tx(c, cr.n, 0, -91, { f: 'U', w: 800, s: 38, c: WB.ink, mw: 212 }); c.fillStyle = cr.c; c.fillRect(-118, -64, 236, 8);
      c.restore();
    });
  }
  const waveYB = t => lp(COAST_CN + 40, COAST_US + 70, eio(at(t, W2.odn - .05, W2.voln + .05)));
  function waveB(c, t) {   // волна одноразок: гребень с пеной, за ним — светлая вода, внутри кувыркаются одноразки
    const k = W2, Y = waveYB(t); if (t < k.odn - .1) return;
    const crest = x => Y + 34 * Math.sin(x / 150 + t * 6) + 18 * Math.sin(x / 61 - t * 9);
    c.beginPath(); c.moveTo(-3200, COAST_CN); for (let x = -3200; x <= 3200; x += 30) c.lineTo(x, crest(x)); c.lineTo(3200, COAST_CN); c.closePath(); fill(c, '#3466ad');
    c.beginPath(); for (let x = -3200; x <= 3200; x += 30) c.lineTo(x, crest(x) - 260); for (let x = 3200; x >= -3200; x -= 30) c.lineTo(x, crest(x)); c.closePath(); fill(c, '#4a86cf');
    c.beginPath(); for (let x = -3200; x <= 3200; x += 30) c.lineTo(x, crest(x) - 300); lnW(c, 6, rgba('#f4f8ff', .5));
    c.save(); c.clip(); for (let i = 0; i < 46; i++) { const x = -1300 + H1(i * 2.3) * 2600, dy = H1(i * 5.1) * 520 + 40, y = Y - dy, col = POD_TOP[i % 5][1];
      if (y < COAST_CN) continue; c.save(); c.translate(x + Math.sin(t * 3 + i) * 20, y); c.rotate(t * (2 + H1(i) * 3) * (i % 2 ? 1 : -1)); c.beginPath(); c.roundRect(-15, -40, 30, 84, 9); fill(c, col); lnW(c, 4, WB.ink); c.restore() } c.restore();
    c.beginPath(); for (let x = -3200; x <= 3200; x += 30) { const y = crest(x); if (x === -3200) c.moveTo(x, y); else c.lineTo(x, y) } lnW(c, 26, '#f4f8ff');
    for (let i = 0; i < 16; i++) { const x = -1650 + i * 220 + ((t * 120) % 220), y = crest(x); c.beginPath(); c.arc(x + 40, y - 36, 62, Math.PI * .1, Math.PI * 1.15); lnW(c, 14, '#f4f8ff'); circ(c, x - 18, y - 20, 14, '#f4f8ff') }
    for (let i = 0; i < 40; i++) { const x = -1300 + H1(i * 9.1) * 2600, ph = (t * 1.8 + H1(i)) % 1; circ(c, x + ph * 30, crest(x) + 10 - ph * 70, 12 * (1 - ph), rgba('#f4f8ff', .9 * (1 - ph))) }
    // удар о берег США: брызги
    const ks = at(t, k.voln - .12, k.voln + .7); if (ks > 0 && ks < 1) for (let i = 0; i < 28; i++) { const x = -900 + i * 66, a = -Math.PI / 2 + (H1(i * 3) - .5) * 1.2, sp = 500 + H1(i) * 600, dt = ks * .8;
      circ(c, x + Math.cos(a) * sp * dt, COAST_US + 20 + Math.sin(a) * sp * dt + 1600 * dt * dt, 22 * (1 - ks), '#f4f8ff') }
  }
  function columnLiquid(c, t, x0, x1, base, h, kf) {   // жидкость в большом столбике = мир C, видимый снаружи
    const top = base - h * kf; if (kf <= 0) return;
    c.save(); c.beginPath(); c.rect(x0, top, x1 - x0, base - top); c.clip();
    const n = NEST.C; c.save(); c.translate(n.ox, n.oy); c.scale(n.s, n.s); drawC(c, t, null, (top - n.oy) / n.s); c.restore();
    c.restore();
  }
  function chartB(c, t) {
    const k = W2; if (t < k.vsego - .3) return;
    const ka = bo(at(t, k.vsego - .2, k.vsego + .35)), kb = bo(at(t, k.vsego - .05, k.vsego + .5));
    const fs = eo(at(t, k.god, k.dolya + .3)), fb = lp(.09 * eo(at(t, k.dolya, k.par)), 1, eo(at(t, k.vyr - .05, k.x11 + .4)));
    // маленький столбик 2019
    if (ka > 0) { c.save(); c.translate(0, COL.base); c.scale(1, ka); c.translate(0, -COL.base);
      c.beginPath(); c.roundRect(COL.sx0, COL.base - COL.sh - 30, COL.sx1 - COL.sx0, COL.sh + 30, [10, 10, 18, 18]); fill(c, 'rgba(238,242,247,.12)');
      c.save(); c.beginPath(); c.rect(COL.sx0, COL.base - COL.sh * fs, COL.sx1 - COL.sx0, COL.sh * fs); c.clip(); c.fillStyle = WB.liq; c.fillRect(COL.sx0, COL.base - 200, 200, 200); c.restore();
      c.beginPath(); c.roundRect(COL.sx0, COL.base - COL.sh - 30, COL.sx1 - COL.sx0, COL.sh + 30, [10, 10, 18, 18]); lnW(c, 6, WB.ln); c.restore();
      A(c, at(t, k.dolya - .2, k.dolya + .2), () => tx(c, '2,4 %', (COL.sx0 + COL.sx1) / 2, COL.base - COL.sh - 80, { f: 'U', w: 800, s: 46, c: '#fff' })); }
    // большой столбик 2020: колба, в ней — мир C
    if (kb > 0) { c.save(); c.translate(0, COL.base); c.scale(1, kb); c.translate(0, -COL.base);
      c.beginPath(); c.roundRect(COL.x0 - 10, COL.base - COL.h - 40, COL.x1 - COL.x0 + 20, COL.h + 40, [12, 12, 22, 22]); fill(c, 'rgba(238,242,247,.12)');
      columnLiquid(c, t, COL.x0, COL.x1, COL.base, COL.h, fb);
      c.beginPath(); c.roundRect(COL.x0 - 10, COL.base - COL.h - 40, COL.x1 - COL.x0 + 20, COL.h + 40, [12, 12, 22, 22]); lnW(c, 7, WB.ln);
      c.save(); c.globalAlpha = .2; c.fillStyle = '#fff'; c.fillRect(COL.x0 + 18, COL.base - COL.h - 20, 18, COL.h); c.restore(); c.restore();
      const kv = at(t, k.x11 - .1, k.x11 + .3); A(c, kv, () => tx(c, '26,5 %', (COL.x0 + COL.x1) / 2, COL.base - COL.h - 110, { f: 'U', w: 800, s: 60, c: '#fff' })); }
    A(c, at(t, k.vsego - .1, k.vsego + .3), () => { tx(c, '2019', (COL.sx0 + COL.sx1) / 2, COL.base + 70, { f: 'U', w: 800, s: 44, c: WB.ln }); tx(c, '2020', (COL.x0 + COL.x1) / 2, COL.base + 70, { f: 'U', w: 800, s: 44, c: WB.ln }) });
    const kp = eo(at(t, k.dolya - .2, k.par + .3)); if (kp > 0) { c.save(); c.translate(-250, 740); c.scale(kp, kp);
      c.beginPath(); c.roundRect(-255, -100, 510, 200, 22); fill(c, 'rgba(15,23,42,.88)'); lnW(c, 4, WB.ln);
      tx(c, 'ДОЛЯ ОДНОРАЗОК', 0, -46, { f: 'U', w: 800, s: 36, c: '#fff' }); tx(c, 'У ПАРЯЩИХ', 0, 8, { f: 'M', w: 800, s: 30, c: '#cbd5e1' }); tx(c, 'СТАРШЕКЛАССНИКОВ США', 0, 50, { f: 'M', w: 800, s: 30, c: '#cbd5e1' }); c.restore() }
    const kx = spr(at(t, k.x11 + .1, k.x11 + .6)); if (kx > 0) { c.save(); c.translate(430, -230); c.rotate(-.18); c.scale(kx * lp(1.8, 1, cl(kx)), kx * lp(1.8, 1, cl(kx))); circ(c, 0, 0, 104, WB.red); ring(c, 0, 0, 86, '#fff', 4); tx(c, '×11', 0, 6, { f: 'U', w: 800, s: 76, c: '#fff' }); c.restore() }
  }
  function drawB(c, t, v) {   // мир B в своих координатах (v — видимый прямоугольник, null — всё)
    seaB(c, t, v);
    landB(c, t, COAST_CN, -1, 'КИТАЙ', -760, COAST_CN - 160);
    waveB(c, t);
    landB(c, t, COAST_US, 1, 'США', -820, COAST_US + 200);
    if (!v || v.y0 < FAC.y + 200) { factoryB(c, t); cratesB(c, t) }
    const sk = 2600 * ei(at(t, W2.voln - .2, W2.voln + .7));
    if ((!v || v.y1 > -1700) && sk < 2500) { c.save(); c.beginPath(); c.rect(-3000, -4000, 6000, 4000 + COAST_US + 50); c.clip(); c.translate(0, sk); storeB(c, t); c.restore() }
    chartB(c, t);
  }
  function shotB(c, t) {
    const cm = camIn('B', camW(t)), cm2 = camIn('B', camW(t + 1 / 30)), v = viewRect(cm);
    c.fillStyle = WB.sea; c.fillRect(0, 0, WW, HH);
    layer(c, cm, 1, c => drawB(c, t, v));
    speedLoc(c, cm, cm2, t);
  }
