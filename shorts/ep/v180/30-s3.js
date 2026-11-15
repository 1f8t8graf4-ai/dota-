  // ================= СЦЕНА 3: валики раскатывают закон → дыра → крест → конвейер Шэньчжэня =================
  function oakTable(c, t) {
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#3b2414', '#4a2d18', '#2e1b0e']);
    c.save(); c.strokeStyle = 'rgba(20,10,4,.28)'; c.lineWidth = 3;
    for (let i = 0; i < 26; i++) { const y0 = -60 + i * 80; c.beginPath(); for (let x = -40; x <= WW + 40; x += 40) c.lineTo(x, y0 + Math.sin(x * .006 + i * 1.7) * 18 + Math.sin(x * .021 + i) * 5); c.stroke() }
    c.strokeStyle = 'rgba(255,220,180,.06)'; for (let i = 0; i < 26; i++) { const y0 = -30 + i * 80; c.beginPath(); for (let x = -40; x <= WW + 40; x += 40) c.lineTo(x, y0 + Math.sin(x * .007 + i * 2.3) * 14); c.stroke() }
    c.restore();
    // линейка сбоку
    c.save(); c.translate(985, 260); c.rotate(.04); rr(c, -34, 0, 68, 1180, 6); fill(c, '#d6c29a'); for (let i = 0; i < 59; i++) { c.fillStyle = '#5b4630'; c.fillRect(-34, i * 20, i % 5 ? 14 : 26, 2) } c.restore();
    c.save(); c.translate(70, 1390); c.rotate(-.5); rr(c, -10, -150, 20, 300, 6); fill(c, '#f59e0b'); poly(c, [-10, 150, 10, 150, 0, 186]); fill(c, '#fde68a'); c.restore();   // карандаш
    glow(c, 540, 820, 900, '#fde68a', .12);
    vignette(c, .55, '12,6,2');
  }
  function roller(c, x, y, w, r) {   // серый валик с жёлтыми ручками
    c.save(); c.translate(x, y); c.rotate(r);
    const g = c.createLinearGradient(0, -38, 0, 38); g.addColorStop(0, '#cbd5e1'); g.addColorStop(.35, '#94a3b8'); g.addColorStop(1, '#475569');
    rr(c, -w / 2 + 50, -37, w - 100, 75, 30); c.fillStyle = g; c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-w / 2 + 70, -26, w - 140, 8);
    [-1, 1].forEach(s => { rr(c, s > 0 ? w / 2 - 56 : -w / 2, -24, 56, 48, 16); fill(c, '#facc15'); rr(c, s > 0 ? w / 2 - 56 : -w / 2, -24, 56, 14, 8); fill(c, '#fde68a') });
    c.restore();
  }
  const SCR = { x: 540, w: 820, top: 280, bot: 1380 };
  const HOLE = { x: 540, y: 960, w: 160, h: 380 };
  function holePath(c, nb) { if (!nb) c.beginPath(); c.roundRect(HOLE.x - HOLE.w / 2, HOLE.y - HOLE.h / 2, HOLE.w, HOLE.h, 40) }
  function lawPaper(c, t) {   // бумага закона в координатах листа (видна между валиками)
    const L = SCR.x - SCR.w / 2;
    c.fillStyle = '#f5efe0'; c.beginPath(); c.rect(L, SCR.top, SCR.w, SCR.bot - SCR.top); holePath(c, 1); c.fill('evenodd');
    c.save(); c.beginPath(); c.rect(L, SCR.top, SCR.w, SCR.bot - SCR.top); holePath(c, 1); c.clip('evenodd');
    for (let i = 0; i < 40; i++) { c.fillStyle = 'rgba(120,90,40,.04)'; c.fillRect(L, SCR.top + i * 28, SCR.w, 1) }
    c.restore();
    circ(c, 540, 350, 30, '#1e3a8a'); tx(c, 'FDA', 540, 352, { f: 'U', w: 800, s: 16, c: '#fff' });
    tx(c, 'FDA GUIDANCE · JAN 2020', 540, 410, { f: 'O', w: 700, s: 40, c: '#1e293b', ls: 3 });
    c.fillStyle = '#1e293b'; c.fillRect(L + 60, 440, SCR.w - 120, 4);
    tx(c, 'ПОД ЗАПРЕТ ПОПАДАЮТ ТОЛЬКО:', 540, 500, { f: 'M', w: 800, s: 34, c: '#334155' });
    const km = eio(at(t, K.only, K.cart + .45));   // маркер по строке про картриджи
    if (km > 0) { c.save(); c.globalAlpha = .9; rr(c, L + 50, 540, (SCR.w - 100) * km, 56, 8); fill(c, '#fef08a'); c.restore() }
    tx(c, '• ВЕЙПЫ СО СМЕННЫМИ КАРТРИДЖАМИ', 540, 570, { f: 'M', w: 800, s: 36, c: '#0f172a', mw: SCR.w - 110 });
    for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(71,85,105,.28)'; c.fillRect(L + 70, 630 + i * 30, SCR.w - 140 - (i % 2) * 120, 12) }
    for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(71,85,105,.28)'; c.fillRect(L + 70, 1260 + i * 30, SCR.w - 140 - (i % 2) * 160, 12) }
    // дыра: красный пунктир по контуру, подпись
    const kd = at(t, K.whole - .1, K.whole + .6);
    if (kd > 0) { c.save(); c.setLineDash([16, 12]); c.lineDashOffset = -t * 20; c.globalAlpha = kd; holePath(c); stroke(c, '#dc2626', 7); c.restore() }
    const kl = spr(at(t, K.notm - .2, K.notm + .3));
    if (kl > 0) { c.save(); c.translate(540, 1196); c.scale(kl, kl); tx(c, '[ ЦЕЛЬНЫЕ ОДНОРАЗОВЫЕ — ПУСТО ]', 0, 0, { f: 'M', w: 800, s: 32, c: '#dc2626', mw: SCR.w - 80 }); c.restore() }
  }
  function factoryBg(c, t) {   // цех в Шэньчжэне: фермы, вентиляция, окна, прожекторы, пол
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#0b1220', '#111c30', '#0b1220']);
    // окна задней стены
    for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const x = 40 + i * 175, y = 470 + r * 120; rr(c, x, y, 150, 96, 6); fill(c, rgba('#38bdf8', .10 + .05 * H1(i + r * 7))); c.fillStyle = 'rgba(11,18,32,.8)'; c.fillRect(x + 73, y, 4, 96); c.fillRect(x, y + 46, 150, 4) }
    // фермы под потолком
    c.save(); c.strokeStyle = '#334155'; c.lineWidth = 8; c.beginPath(); c.moveTo(-40, 120); c.lineTo(WW + 40, 120); c.moveTo(-40, 260); c.lineTo(WW + 40, 260); c.stroke();
    c.lineWidth = 5; c.beginPath(); for (let i = -1; i < 12; i++) { c.moveTo(i * 100, 260); c.lineTo(i * 100 + 50, 120); c.lineTo(i * 100 + 100, 260) } c.stroke(); c.restore();
    // вентиляционная труба
    vgrad(c, -40, 300, WW + 80, 70, ['#475569', '#64748b', '#334155']); for (let i = 0; i < 9; i++) { c.fillStyle = '#1e293b'; c.fillRect(i * 130, 300, 8, 70) }
    // прожекторы
    [200, 540, 880].forEach((x, i) => { rr(c, x - 40, 372, 80, 30, 8); fill(c, '#1e293b'); beam(c, x, 400, x + (540 - x) * .2, 1260, 26, i === 1 ? 240 : 190, '#e0f2fe', i === 1 ? .22 : .12) });
    // пол цеха
    vgrad(c, -100, 1340, WW + 200, 700, ['#1f2937', '#111827', '#0b0f19']);
    c.save(); c.translate(540, 1345); c.scale(1, .12); glow(c, 0, 0, 480, '#e0f2fe', .3); c.restore();
    vignette(c, .5);
  }
  function cross3d(c, x, y, s, r) {   // объёмный сине-красный крест
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const bar = (rot, col, dk) => { c.save(); c.rotate(rot); c.save(); c.translate(14, 14); rr(c, -120, -32, 240, 64, 18); fill(c, dk); c.restore(); rr(c, -120, -32, 240, 64, 18); fill(c, col); rr(c, -112, -26, 224, 14, 8); fill(c, 'rgba(255,255,255,.3)'); c.restore() };
    bar(Math.PI / 4, '#2563eb', '#1e3a8a'); bar(-Math.PI / 4, '#dc2626', '#7f1d1d'); c.restore();
  }
  function sparks(c, t, t0, x, y, n = 14, col = '#fde047') {
    const k = t - t0; if (k < 0 || k > .8) return;
    for (let i = 0; i < n; i++) { const a = H1(i * 4.7) * TAU, v = 300 + H1(i * 9) * 600, px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k + 600 * k * k;
      c.save(); c.globalAlpha = 1 - k / .8; c.strokeStyle = col; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(px, py); c.lineTo(px - Math.cos(a) * 24, py - Math.sin(a) * 24); c.stroke(); c.restore() }
  }
  function conveyor(c, t, a = 1, sway = 0) {   // лента Y 1220–1340, ролики через 140 px
    if (a <= 0) return; c.save(); c.globalAlpha *= a;
    vgrad(c, -40, 1220, WW + 80, 120, ['#334155', '#1e293b', '#0f172a']);
    c.fillStyle = '#475569'; c.fillRect(-40, 1220, WW + 80, 10);
    for (let i = -1; i < 9; i++) { const x = i * 140 + ((t * 180) % 140), y = 1290; circ(c, x, y, 28, '#94a3b8'); circ(c, x, y, 20, '#cbd5e1'); c.save(); c.translate(x, y); c.rotate(t * 6.4); c.fillStyle = '#475569'; c.fillRect(-18, -3, 36, 6); c.restore() }
    c.fillStyle = '#0b1220'; for (let i = 0; i < 3; i++) c.fillRect(120 + i * 380, 1340, 26, 140);
    c.restore();
  }
  function convBoxes(c, t, a = 1) {   // 5 коробок на ленте, едут вправо 180 px/с
    if (a <= 0) return; const t0 = K.shen;
    for (let i = -3; i < 3; i++) {
      const x0 = 540 + i * 210 + (t - t0) * 180 * eo(at(t, t0 + .2, t0 + .9)) + Math.max(0, t - t0 - .9) * 0;
      const x = x0; if (x < -100 || x > WW + 100) continue;
      if (i === 0) continue;   // первую рисует морф шлейфа
      const kin = eo(at(t, t0 + .1 + Math.abs(i) * .12, t0 + .55 + Math.abs(i) * .12)); if (kin <= 0) continue;
      vapeBox(c, x - (1 - kin) * (i < 0 ? 700 : -700), 1040, 150, 360, BOXC[(i + 9) % 8], { label: ['PEACH', 'COLA', 'MINT', 'GRAPE', 'MANGO', 'BERRY'][(i + 6) % 6] });
    }
  }
  function factoryShot(c, t) {
    factoryBg(c, t);
    // табличка «JUUL КАРТРИДЖИ» на цепях; крест сбивает её
    const hit = K.juul2 + .32, kf = at(t, hit, hit + 1.1);
    const sx = 540 - 260 * kf * kf, sy = 470 + 620 * kf * kf, sr = -1.2 * kf;
    if (kf < 1) A(c, 1 - at(kf, .7, 1), () => {
      c.strokeStyle = '#94a3b8'; c.lineWidth = 5; if (kf <= 0) { c.beginPath(); c.moveTo(390, 262); c.lineTo(390, 425); c.moveTo(690, 262); c.lineTo(690, 425); c.stroke() }
      c.save(); c.translate(sx, sy); c.rotate(sr); rr(c, -210, -45, 420, 90, 12); fill(c, '#0f172a'); rr(c, -210, -45, 420, 90, 12); stroke(c, '#f8fafc', 4); tx(c, 'JUUL КАРТРИДЖИ', 0, 2, { f: 'O', w: 700, s: 40, c: '#f8fafc', ls: 2 }); c.restore();
    });
    // крест падает со шлейфом
    const cy = t < hit ? lp(-200, 470, ei(at(t, hit - .32, hit))) : lp(470, 1040, eo(at(t, hit, K.shen)));
    const kt = at(t, hit - .3, hit), kmorph = eio(at(t, K.shen, K.shen + .6));
    if (t > hit - .32 && kmorph < 1) {
      const top = 350, bot = cy;
      if (bot > top) A(c, 1 - kmorph, () => { const g = c.createLinearGradient(0, top, 0, bot); g.addColorStop(0, 'rgba(244,114,182,0)'); g.addColorStop(.4, 'rgba(244,114,182,.75)'); g.addColorStop(1, 'rgba(56,189,248,.9)'); rr(c, 465, top, 150, bot - top, 40); c.fillStyle = g; c.fill() });
      if (kmorph <= 0) cross3d(c, 540, cy, 1, t * 3);
    }
    sparks(c, t, hit, 540, 470, 18);
    // шлейф застывает и превращается в первую одноразку на ленте
    if (kmorph > 0) {
      const top = lp(350, 860, kmorph), x = 540 + Math.max(0, t - K.shen - .2) * 180 * eo(at(t, K.shen + .2, K.shen + .9));
      if (kmorph < 1) { rr(c, x - 75, top, 150, 1220 - top, lp(40, 10, kmorph)); fill(c, mixc('#38bdf8', BOXC[0], kmorph)) }
      A(c, kmorph, () => vapeBox(c, x, 1040, 150, 360, BOXC[0], { label: 'ICE' }));
    }
    conveyor(c, t, eo(at(t, K.shen - .2, K.shen + .4)));
    convBoxes(c, t, 1);
    const kp = spr(at(t, K.shen + .5, K.shen + 1.1));
    if (kp > 0) { c.strokeStyle = '#94a3b8'; c.lineWidth = 4; c.beginPath(); c.moveTo(380, 262); c.lineTo(380, 560 - 40 * kp); c.moveTo(700, 262); c.lineTo(700, 560 - 40 * kp); c.stroke(); plate(c, 'ШЭНЬЧЖЭНЬ · КОНВЕЙЕР', 540, 560, kp, { s: 34, bg: '#facc15', c: '#0f172a' }) }
  }
  function shot3(c, t) {
    // 0) зал FDA → стол: перекладина и колодка гильотины становятся валиками
    const kz = eio(at(t, K.zoom0, K.zoom1));   // наезд в дыру
    if (kz >= 1) { factoryShot(c, t); return }
    const k0 = eio(at(t, K.s3 - .15, K.s3 + .45)), k1 = eio(at(t, K.s3 + .45, K.s3 + 1.6));
    if (kz > 0 || k1 > 0) factoryShot(c, t);   // цех — сквозь дыру
    c.save();
    if (kz > 0) { const s = Math.exp(lp(0, Math.log(7.5), kz)); c.translate(540, 960); c.scale(s, s); c.translate(-540, -960) }
    if (k0 < 1) A(c, 1 - k0, () => hallShot(c, t));
    if (k0 > 0) {
      A(c, k0, () => { c.save(); c.beginPath(); c.rect(-2000, -2000, 5000, 6000); holePath(c, 1); c.clip('evenodd'); oakTable(c, t); c.restore() });
      const y1 = lp(lp(305, 820, k0), SCR.top, k1), y2 = lp(lp(1306, 820, k0), SCR.bot, k1), r = lp(-.32, 0, eio(at(t, K.s3 + .1, K.s3 + .5)));
      if (k1 > 0) { c.save(); c.beginPath(); c.rect(0, y1, WW, y2 - y1); c.clip(); lawPaper(c, t); c.restore() }
      roller(c, 540, y1, lp(780, 860, k0), r * (1 - k1)); roller(c, 540, y2, lp(630, 860, k0), -r * .6 * (1 - k1));
    }
    c.restore();
  }
