  // ================= блок 6 (63,9–75,5 с): торец опускается и становится белым холмом (Кола #009), растут 3 стебля табака →
  // красный круг БЕЗ ТАБАКА, листья осыпаются, центральный бутон вспыхивает колбой-лампочкой с кипящим золотым никотином →
  // 5-витковый змеевик (Кола #010), камера за каплей вниз: розлив одноразок → фиолетовая касса (Starbucks #012) $3 000 000 000 В ГОД → сзади растут башни корпораций =================
  let T6 = null, K6 = null; const HILL = { y: 1560, rx: 760, ry: 300 }, BULB = { x: 540, y: 640, r: 120 }, REG6 = { x: 540, y: 3300 };
  const STEM = [[390, 930, -1], [540, 760, 0], [700, 950, 1]];
  let PATH6 = null;
  function b6Init() {
    const w = Wd; T6 = { a: T5.end, obo: w('обойти'), var: w('варить'), prob: w('пробирке'), bez: w('без'), list: w('листа'), tab: w('табака'),
      kogda: w('когда'), mlrd: w('миллиарды'), doll: w('долларов'), god: w('год', 1), rynok: w('рынок'), star: w('старые'), corp: w('корпорации'), end: K.s8 - .57 };
    K6 = [KY(T6.a, 540, 875, 1.04), KY(T6.a + .7, 540, 1080, .92), KY(T6.prob, 540, 1000, .98), KY(T6.tab + .2, 545, 980, 1.0), KY(T6.kogda, 560, 900, 1.0),
      KY(T6.kogda + .9, 720, 1200, 1.08), KY(T6.mlrd - .3, 700, 1950, 1.0), KY(T6.mlrd + .4, 560, 3020, 1.0), KY(T6.rynok - .1, 545, 3020, 1.0), KY(T6.corp + .2, 540, 3000, .82), KY(T6.end, 540, 2995, .8)];
    // путь капли: из горлышка колбы вверх, вправо, 5 витков вниз, к соплу над конвейером
    PATH6 = []; const P = PATH6; P.push([540, 505], [540, 410]); for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; P.push([700 + Math.cos(a) * 160, 410 + Math.sin(a) * 160]) }
    for (let i = 1; i <= 200; i++) { const u = i / 200; P.push([860 + 80 * Math.sin(u * 5 * TAU), 410 + u * 1380]) } P.push([860, 1900]);
    let L = 0; P[0][2] = 0; for (let i = 1; i < P.length; i++) { L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); P[i][2] = L } PATH6.L = L;
  }
  function pathAt(u) { const P = PATH6, d = u * P.L; let i = 1; while (i < P.length - 1 && P[i][2] < d) i++; const a = P[i - 1], b = P[i], k = (d - a[2]) / Math.max(1e-6, b[2] - a[2]); return [lp(a[0], b[0], k), lp(a[1], b[1], k)] }
  function pathStroke(c, u0, u1) { const P = PATH6; c.beginPath(); let st = false; for (const p of P) { const u = p[2] / P.L; if (u < u0 || u > u1) continue; if (!st) { c.moveTo(p[0], p[1]); st = true } else c.lineTo(p[0], p[1]) } }
  function hill6(c, t) {   // торец-круг → белый холм
    const k = eio(at(t, T6.a, T6.a + .7)), cx = 540, cy = lp(ORB.y, HILL.y, k), rx = lp(ORB.R, HILL.rx, k), ry = lp(ORB.R, HILL.ry, k), col = mixc(lit(B2.ind, .25), B2.cream, ss(.3, .8, k));
    if (k < .4) castCirc(c, cx, cy, rx, 520 * (1 - k / .4), { st: 17 });
    c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, TAU); if (k > 0) c.rect(cx - 2400 * k, cy, 4800 * k, 400 * k); fill(c, col);
    c.save(); c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, TAU); c.rect(cx - 2400 * k, cy, 4800 * k, 400 * k); c.clip(); grain(c, -1200, cy - ry - 10, 3000, 800, .12 * k); c.fillStyle = 'rgba(20,23,51,.12)'; c.fillRect(cx + rx * .45, cy - ry, 2000, 800); c.restore();
    if (k > .5) { c.beginPath(); c.moveTo(-1900, cy + 400); c.lineTo(3000, cy + 400); lnB(c, 5) }
    c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, Math.PI, 0); lnB(c, 5);
    if (k < .5) { c.save(); c.globalAlpha *= 1 - k * 2; c.beginPath(); c.ellipse(cx, cy, rx * .55, ry * .55, 0, 0, TAU); fill(c, '#2d3142'); c.restore() }
  }
  const hillTop = x => HILL.y - HILL.ry * Math.sqrt(Math.max(0, 1 - Math.pow((x - 540) / HILL.rx, 2)));
  function leaf(c, x, y, s, a, col = B2.mint) { c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(30, -40, 110, -40, 140, 0); c.bezierCurveTo(110, 30, 30, 30, 0, 0); c.closePath(); cel(c, 0, -40, 140, 70, col, { hw: .1, sw: .35 }); c.beginPath(); c.moveTo(4, 0); c.lineTo(130, 0); lnB(c, 3, '#2f7d5a'); c.restore() }
  function stems6(c, t) {
    STEM.forEach(([x, ty, side], i) => {
      const kg = eo(at(t, T6.obo - .2 + i * .15, T6.obo + .8 + i * .15)); if (kg <= 0) return;
      const by = hillTop(x), yy = lp(by, ty, kg), bend = side * 40;
      c.beginPath(); c.moveTo(x, by); c.quadraticCurveTo(x + bend, (by + yy) / 2, x, yy); lnB(c, 7, B2.cream);
      // листья: на «листа табака» отрываются и падают
      const kf = at(t, T6.list - .15, T6.tab + .9);
      for (let j = 0; j < 3; j++) { const ly = lp(by, yy, .3 + j * .2), s = .8 * eo(at(kg, .3 + j * .15, .7 + j * .1)), sd = j % 2 ? 1 : -1; if (s <= 0) continue;
        const d = Math.max(0, kf * 1.6 - j * .2), fx = sd * 120 * d, fy = 900 * d * d, ra = sd * 2.5 * d; leaf(c, x + fx, ly + fy, s, (sd > 0 ? -.35 : Math.PI + .35) + ra, d > 0 ? mixc(B2.mint, '#b7a24b', cl(d)) : B2.mint) }
      if (i !== 1) { const kb = spr(at(t, T6.var - .1 + i * .1, T6.var + .4 + i * .1)); if (kb > 0) { circ(c, x, yy - 10, 26 * kb, B2.coral); ring(c, x, yy - 10, 26 * kb, B2.ln, 3) } }
    });
  }
  function bulb6(c, t) {   // центральный бутон → колба-лампочка с кипящим золотым никотином
    const kb = spr(at(t, T6.var - .1, T6.var + .4)), kv = spr(at(t, T6.prob - .1, T6.prob + .5)); if (kb <= 0) return;
    const r = lp(26 * kb, BULB.r, kv), cy = lp(STEM[1][1] - 10, BULB.y, kv), x = BULB.x;
    if (kv > 0) { glow(c, x, cy, r * 2.6, '#ffd45e', .35 * cl(kv)); c.save(); c.translate(x, cy + r * .9); c.scale(kv, kv); rr(c, -38, 0, 76, 70, 8); cel(c, -38, 0, 76, 70, B2.steel, { hw: .14 }); for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-38, 18 + i * 18); c.lineTo(38, 12 + i * 18); lnB(c, 3, B2.ink) } c.restore() }
    c.beginPath(); c.arc(x, cy, r, 0, TAU); c.save(); c.clip(); c.fillStyle = kv > 0 ? 'rgba(220,240,255,.25)' : B2.coral; c.fillRect(x - r, cy - r, r * 2, r * 2);
    if (kv > 0) { const lv = cy - r * .2 + Math.sin(t * 9) * 4; c.fillStyle = '#f2b84b'; c.beginPath(); c.moveTo(x - r, cy + r); for (let i = 0; i <= 20; i++) { const xx = x - r + i * r / 10; c.lineTo(xx, lv + 8 * Math.sin(i * 1.3 + t * 12)) } c.lineTo(x + r, cy + r); c.closePath(); c.fill();
      for (let i = 0; i < 9; i++) { const u = (t * 1.4 + i / 9) % 1; ring(c, x - r * .6 + H1(i) * r * 1.2, lp(cy + r * .8, lv, u), 5 + 6 * H1(i * 3), '#fff4cc', 3) } glint(c, x - r, cy - r, r * 2, r * 2, .25) }
    c.restore(); c.beginPath(); c.arc(x, cy, r, 0, TAU); lnB(c, 5);
    if (kv > .5) { c.beginPath(); c.moveTo(x - 18, cy + r - 6); c.lineTo(x - 8, cy + 10); c.lineTo(x, cy + 30); c.lineTo(x + 8, cy + 10); c.lineTo(x + 18, cy + r - 6); lnB(c, 4, '#ffffff') }
  }
  function noTob6(c, t) {   // красный круг БЕЗ ТАБАКА — целиком в кадре
    const k = spr(at(t, T6.bez - .1, T6.bez + .45)); if (k <= 0) return;
    c.save(); c.translate(230, 610); c.scale(k, k); c.rotate(-.06);
    circ(c, 0, 0, 130, '#f5f1e8'); leaf(c, -70, 10, .95, -.2, '#6b8f4e'); ring(c, 0, 0, 118, B2.red, 22); c.beginPath(); c.moveTo(-82, -82); c.lineTo(82, 82); lnB(c, 22, B2.red);
    plate(c, 'БЕЗ ТАБАКА', 0, 182, 1, { s: 32, bg: B2.red, c: '#fff' }); c.restore();
  }
  function coil6(c, t) {   // змеевик: трубка контуром, золото бежит каплей
    const kc = eo(at(t, T6.kogda - .5, T6.kogda + .3)); if (kc <= 0) return;
    pathStroke(c, 0, kc); lnB(c, 22, B2.ln); pathStroke(c, 0, kc); lnB(c, 14, B2.navy);
    const ud = eio(at(t, T6.kogda, T6.mlrd - .15)); if (ud > 0) { pathStroke(c, 0, ud); lnB(c, 10, '#f2b84b'); const [dx, dy] = pathAt(ud); circ(c, dx, dy, 15, '#f2b84b'); ring(c, dx, dy, 15, '#fff4cc', 3) }
    c.fillStyle = '#2c3048'; c.fillRect(820, 1890, 80, 50); poly(c, [830, 1940, 890, 1940, 872, 1975, 848, 1975]); fill(c, B2.steel);
  }
  function conveyor6(c, t) {
    if (t < T6.kogda) return; const y = 2120;
    c.beginPath(); c.moveTo(80, y); c.lineTo(1100, y); lnB(c, 10, B2.ln); for (let x = 120; x < 1100; x += 110) { circ(c, x, y + 36, 24, '#3a3f66'); ring(c, x, y + 36, 24, B2.ln, 3) }
    for (let i = 0; i < 8; i++) { const x = 60 + ((t - T6.kogda) * 160 + i * 150) % 1200, fil = x > 860 ? 1 : 0;
      rr(c, x - 28, y - 130, 56, 130, 14); cel(c, x - 28, y - 130, 56, 130, B2.ind, { hw: .14 }); if (fil) { rr(c, x - 18, y - 100, 36, 60, 8); fill(c, '#f2b84b') } rr(c, x - 28, y - 130, 56, 130, 14); lnB(c, 3) }
    if (t > T6.mlrd - .3) for (let i = 0; i < 3; i++) { const u = (t * 2 + i / 3) % 1; drop(c, 860, lp(1985, 2000, 0) + u * 80, 9, '#f2b84b') }
  }
  function towers6(c, t) {   // башни табачных корпораций растут сзади
    [[-40, 900, 220, 0], [150, 1050, 200, 'ALTRIA'], [930, 1000, 210, 'BAT'], [1120, 850, 220, 0], [545, 1080, 300, 0]].forEach(([x, h, w, lab], i) => {
      const k = spr(at(t, T6.rynok + i * .14, T6.rynok + .7 + i * .14)); if (k <= 0) return; const g = 3560, top = g - h * k;
      rr(c, x - w / 2, top, w, g - top, 4); cel(c, x - w / 2, top, w, g - top, i % 2 ? '#3d3f6e' : '#34376a', { hw: .06, sw: .3 }); rr(c, x - w / 2, top, w, g - top, 4); lnB(c, 3);
      for (let r = 0; r < Math.floor(h * k / 70); r++) for (let q = 0; q < Math.floor((w - 30) / 40); q++) if (H1(i * 31 + r * 7 + q) < .45) { c.fillStyle = H1(r + q * 3 + i) > .5 ? '#f4a261' : '#fde68a'; c.fillRect(x - w / 2 + 20 + q * 40, top + 40 + r * 70, 18, 28) }
      if (lab) { const kl = bo(at(t, T6.star + i * .1, T6.star + .4 + i * .1)); if (kl > 0) plate(c, lab, x, top - 50, kl, { s: 34, bg: B2.gold, c: B2.ink }) }
    });
  }
  function register6(c, t) {   // касса (Starbucks #012): фиолетовый корпус контуром, табло, чек лентой
    const k = spr(at(t, T6.mlrd - .5, T6.mlrd + .1)); if (k <= 0) return;
    const { x, y } = REG6; c.save(); c.translate(x, y); c.scale(k, k);
    castDots(c, -300, -80, 600, 300, 160, { st: 16 });
    poly(c, [-300, 220, 300, 220, 250, -80, -250, -80]); cel(c, -300, -80, 600, 300, B2.ind, { hw: .06 }); poly(c, [-300, 220, 300, 220, 250, -80, -250, -80]); lnB(c, 5);
    for (let r = 0; r < 2; r++) for (let q = 0; q < 5; q++) { rr(c, -200 + q * 82, -40 + r * 76, 60, 50, 10); fill(c, '#e9e3ff'); lnB(c, 3, B2.ink) }
    c.beginPath(); c.moveTo(-40, -80); c.lineTo(-40, -170); c.moveTo(40, -80); c.lineTo(40, -170); lnB(c, 16, '#3b3166');
    rr(c, -360, -400, 720, 240, 26); fill(c, B2.ink); rr(c, -360, -400, 720, 240, 26); lnB(c, 6);
    const v = 3e9 * eio(at(t, T6.mlrd, T6.doll + .4)); c.save(); rr(c, -340, -380, 680, 150, 16); c.clip(); num(c, '$' + fmt3(Math.round(v / 1e7) * 1e7), 0, -306, { f: 'J', w: 700, s: 60, c: '#7ee787' }); c.restore();
    const kg = bo(at(t, T6.god - .1, T6.god + .3)); if (kg > 0) { c.save(); c.translate(0, -200); c.scale(kg, kg); tx(c, 'В ГОД', 0, 0, { f: 'U', w: 800, s: 40, c: B2.gold }); c.restore() }
    const kt = eo(at(t, T6.mlrd, T6.corp)); if (kt > 0) { c.beginPath(); c.moveTo(250, 40); for (let i = 0; i <= 30; i++) { const u = i / 30 * kt; c.lineTo(250 + u * 260 + 40 * Math.sin(u * 10), 40 + u * 420) } lnB(c, 28, B2.cream); }
    c.restore();
  }
  const fmt3 = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  function b6World(c, t, q) {
    const kw = eio(at(t, T6.a, T6.a + .6)), v = viewRect(q);
    c.fillStyle = B2.navy; c.fillRect(v.x0 - 10, v.y0 - 10, v.x1 - v.x0 + 20, v.y1 - v.y0 + 20);
    if (kw < 1) { c.save(); const X = lp(v.x1 + 1000, v.x0 - 60, kw); poly(c, [v.x0 - 50, v.y0 - 50, X, v.y0 - 50, X - 900, v.y1 + 50, v.x0 - 50, v.y1 + 50]); c.clip(); blueprint5(c, t, q); c.restore() }
    for (let i = 0; i < 30; i++) circ(c, -300 + H1(i * 4.4) * 1700, -200 + H1(i * 6.6) * 1300, 2 + H1(i) * 2, rgba('#e2e8f0', .3 + .2 * Math.sin(t * 1.7 + i)));
    towers6(c, t);
    if (t < T6.a + .5) orbitOut(c, t);
    hill6(c, t); stems6(c, t); coil6(c, t); bulb6(c, t); noTob6(c, t); conveyor6(c, t); register6(c, t);
  }
  function orbitOut(c, t) { const k = ei(at(t, T6.a, T6.a + .5)); for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i * TAU / 16, R = ORB.r + 1200 * k; c.save(); c.translate(ORB.x + Math.cos(a) * R, ORB.y + Math.sin(a) * R); c.rotate(a + Math.PI / 2); cart5(c, 0, 20, .62); c.restore() } plate(c, '= 16 КАРТРИДЖЕЙ', 540, 1330 + 900 * k, 1, { s: 46, bg: B2.mango, c: B2.ink }) }
  let COIN6 = 0;
  function b6Shot(c, t) {
    if (!T6) b6Init(); const q = camObj(camAt(K6, t)); c.save(); c.translate(540, 960); c.rotate(q.r); c.scale(q.z, q.z); c.translate(-q.x, -q.y); b6World(c, t, q); c.restore();
    const kc = bo(at(t, T6.end - .35, T6.end)); if (kc > 0) { const y = lp(1180, 850, eo(at(t, T6.end - .35, T6.end))); circ(c, 540, y, 36 * kc, '#f59e0b'); ring(c, 540, y, 27 * kc, '#b45309', 4) }   // монета выпрыгивает из кассы — дальше её ведёт сцена 8 в Луну
  }
