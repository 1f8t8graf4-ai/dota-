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
  function roller(c, x, y, w, r, ph = 0) {   // серый валик с жёлтыми ручками; ph — поворот (полоски бегут)
    c.save(); c.translate(x, y); c.rotate(r);
    c.save(); c.translate(0, 18); rr(c, -w / 2 + 50, -30, w - 100, 60, 26); fill(c, 'rgba(0,0,0,.3)'); c.restore();
    const g = c.createLinearGradient(0, -38, 0, 38); g.addColorStop(0, '#cbd5e1'); g.addColorStop(.35, '#94a3b8'); g.addColorStop(1, '#475569');
    rr(c, -w / 2 + 50, -37, w - 100, 75, 30); c.fillStyle = g; c.fill();
    c.save(); rr(c, -w / 2 + 50, -37, w - 100, 75, 30); c.clip(); for (let i = 0; i < 4; i++) { const yy = -37 + (((ph * 220 + i * 19) % 75) + 75) % 75; c.fillStyle = 'rgba(30,41,59,.22)'; c.fillRect(-w / 2 + 50, yy, w - 100, 3) } c.restore();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-w / 2 + 70, -26, w - 140, 8);
    [-1, 1].forEach(s => { rr(c, s > 0 ? w / 2 - 56 : -w / 2, -24, 56, 48, 16); fill(c, '#facc15'); rr(c, s > 0 ? w / 2 - 56 : -w / 2, -24, 56, 14, 8); fill(c, '#fde68a') });
    c.restore();
  }
  const SCR = { x: 540, w: 820, top: 280, bot: 1380 };
  const HOLE = { x: 540, y: 960, w: 160, h: 380 };
  function holePath(c, nb) { if (!nb) c.beginPath(); c.roundRect(HOLE.x - HOLE.w / 2, HOLE.y - HOLE.h / 2, HOLE.w, HOLE.h, 40) }
  function blueStamp(c, x, y, k) {   // круглая синяя печать FDA — бьёт сверху
    if (k <= 0) return; const s = lp(2.4, 1, eo(k));
    c.save(); c.translate(x, y); c.rotate(-.22); c.scale(s, s);
    circ(c, 0, 0, 82, 'rgba(239,246,255,.55)'); ring(c, 0, 0, 80, '#1d4ed8', 7); ring(c, 0, 0, 60, '#1d4ed8', 3);
    const R = 'МИНЗДРАВ США · МИНЗДРАВ США · '; for (let i = 0; i < R.length; i++) { c.save(); c.rotate(i * TAU / R.length); tx(c, R[i], 0, -70, { f: 'O', w: 700, s: 13, c: '#1d4ed8' }); c.restore() }
    tx(c, 'FDA', 0, 4, { f: 'U', w: 800, s: 46, c: '#1d4ed8' }); c.restore();
  }
  const kHole = t => eio(at(t, K.whole - .15, K.whole + .4));   // кусок листа внутри пунктира проваливается
  function lawPaper(c, t) {   // бумага закона (видна между валиками), с дырой, когда её «пусто»
    const L = SCR.x - SCR.w / 2, kh = kHole(t);
    c.fillStyle = '#f5efe0'; c.beginPath(); c.rect(L, SCR.top, SCR.w, SCR.bot - SCR.top); if (kh > 0) holePath(c, 1); c.fill('evenodd');
    for (let i = 0; i < 40; i++) { c.fillStyle = 'rgba(120,90,40,.04)'; c.fillRect(L, SCR.top + i * 28, SCR.w, 1) }
    circ(c, 540, 350, 30, '#1e3a8a'); tx(c, 'FDA', 540, 352, { f: 'U', w: 800, s: 16, c: '#fff' });
    tx(c, 'УКАЗ МИНЗДРАВА США · 2020', 540, 410, { f: 'O', w: 700, s: 40, c: '#1e293b', ls: 2, mw: SCR.w - 80 });
    c.fillStyle = '#1e293b'; c.fillRect(L + 60, 440, SCR.w - 120, 4);
    tx(c, 'ПОД ЗАПРЕТ ПОПАДАЮТ ТОЛЬКО:', 540, 500, { f: 'M', w: 800, s: 34, c: '#334155' });
    const km = eio(at(t, K.s3 + 1.9, K.cart - .1));   // маркер по строке про картриджи
    if (km > 0) { rr(c, L + 50, 540, (SCR.w - 100) * km, 56, 8); fill(c, '#fde047'); poly(c, [L + 50 + (SCR.w - 100) * km - 6, 536, L + 50 + (SCR.w - 100) * km + 18, 536, L + 50 + (SCR.w - 100) * km + 6, 600, L + 50 + (SCR.w - 100) * km - 18, 600]); fill(c, km < 1 ? '#facc15' : 'rgba(0,0,0,0)') }
    tx(c, '• ВЕЙПЫ СО СМЕННЫМИ КАРТРИДЖАМИ', 540, 570, { f: 'M', w: 800, s: 36, c: '#0f172a', mw: SCR.w - 110 });
    for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(71,85,105,.28)'; c.fillRect(L + 70, 630 + i * 30, SCR.w - 140 - (i % 2) * 120, 12) }
    for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(71,85,105,.28)'; c.fillRect(L + 70, 1260 + i * 30, SCR.w - 140 - (i % 2) * 160, 12) }
    blueStamp(c, 790, 690, at(t, K.cart - .12, K.cart + .12));
    if (kh > 0 && kh < 1) {   // кусок бумаги внутри пунктира уходит вглубь, поворачиваясь
      c.save(); c.translate(HOLE.x, HOLE.y); c.rotate(kh * .9); c.scale(1 - kh, 1 - kh); rr(c, -HOLE.w / 2, -HOLE.h / 2, HOLE.w, HOLE.h, 40); fill(c, mixc('#f5efe0', '#64748b', kh)); c.restore();
    }
    // пунктир дыры: рисуется по кругу, потом бежит
    const kd = at(t, K.cart + .15, K.cart + .75);
    if (kd > 0) { const per = 2 * (HOLE.w + HOLE.h) - 70; c.save(); holePath(c); c.setLineDash(kd < 1 ? [per * kd, per] : [16, 12]); c.lineDashOffset = kd < 1 ? 0 : -t * 60; stroke(c, '#dc2626', 7); c.restore() }
    const kl = spr(at(t, K.whole + .1, K.whole + .6));
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
  function conveyor(c, t, k = 1) {   // лента Y 1220–1340, ролики через 140 px; k — выезжает снизу
    if (k <= 0) return; c.save(); c.translate(0, 520 * (1 - k));
    vgrad(c, -40, 1220, WW + 80, 120, ['#334155', '#1e293b', '#0f172a']);
    c.fillStyle = '#475569'; c.fillRect(-40, 1220, WW + 80, 10);
    for (let i = -1; i < 9; i++) { const x = i * 140 + ((t * 180) % 140), y = 1290; circ(c, x, y, 28, '#94a3b8'); circ(c, x, y, 20, '#cbd5e1'); c.save(); c.translate(x, y); c.rotate(t * 6.4); c.fillStyle = '#475569'; c.fillRect(-18, -3, 36, 6); c.restore() }
    c.fillStyle = '#0b1220'; for (let i = 0; i < 3; i++) c.fillRect(120 + i * 380, 1340, 26, 140);
    c.restore();
  }
  function convBoxes(c, t) {   // коробки на ленте, едут вправо 180 px/с
    const t0 = K.shen;
    for (let i = -3; i < 3; i++) {
      if (i === 0) continue;   // центральную рисует морф шлейфа
      const x = 540 + i * 210 + Math.max(0, t - t0 - .2) * 180 * eo(at(t, t0 + .2, t0 + .9)); if (x < -100 || x > WW + 100) continue;
      const kin = eo(at(t, t0 + .1 + Math.abs(i) * .12, t0 + .55 + Math.abs(i) * .12)); if (kin <= 0) continue;
      vapeBox(c, x - (1 - kin) * (i < 0 ? 700 : -700), 1055, 150, 360, BOXC[(i + 9) % 8], { label: { '-3': 'КОЛА', '-2': 'ВИНОГРАД', '-1': 'МАНГО', '1': 'ЯГОДЫ', '2': 'КОЛА' }[i] });
    }
  }
  const darkF = t => t < K.lights ? .9 : t < K.lights + .15 ? .6 : t < K.lights + .3 ? .3 : 0;   // свет в цехе включается тремя прожекторами
  function factoryShot(c, t) {
    factoryBg(c, t);
    // табличка «JUUL КАРТРИДЖИ» на цепях; крест сбивает её — она улетает вниз за кадр
    const hit = K.juul2 + .32, kf = at(t, hit, hit + 1.1);
    const sx = 540 - 300 * kf * kf, sy = 470 + 1800 * kf * kf, sr = -1.2 * kf;
    if (kf < 1) {
      c.strokeStyle = '#94a3b8'; c.lineWidth = 5; if (kf <= 0) { c.beginPath(); c.moveTo(390, 262); c.lineTo(390, 425); c.moveTo(690, 262); c.lineTo(690, 425); c.stroke() }
      c.save(); c.translate(sx, sy); c.rotate(sr); rr(c, -210, -45, 420, 90, 12); fill(c, '#0f172a'); rr(c, -210, -45, 420, 90, 12); stroke(c, '#f8fafc', 4); tx(c, 'JUUL КАРТРИДЖИ', 0, 2, { f: 'O', w: 700, s: 40, c: '#f8fafc', ls: 2 }); c.restore();
    }
    // крест падает со шлейфом
    const cy = t < hit ? lp(-200, 470, ei(at(t, hit - .32, hit))) : lp(470, 1040, eo(at(t, hit, K.shen)));
    const km = eio(at(t, K.shen, K.shen + .6)), x = 540 + Math.max(0, t - K.shen - .2) * 180 * eo(at(t, K.shen + .2, K.shen + .9));
    if (t > hit - .32 && km < 1) {   // шлейф: верх опускается к крышке коробки, цвет густеет в цвет коробки
      const top = lp(350, 875, km), bot = Math.max(cy, lp(cy, 1235, km));
      if (bot > top) { const g = c.createLinearGradient(0, top, 0, bot); g.addColorStop(0, rgba(km > .5 ? '#ec4899' : '#f472b6', lp(0, 1, km))); g.addColorStop(.4, rgba('#f472b6', lp(.75, 1, km))); g.addColorStop(1, rgba('#38bdf8', lp(.9, 1, km))); rr(c, x - 75, top, 150, bot - top, lp(40, 10, km)); c.fillStyle = g; c.fill() }
      if (km <= 0) cross3d(c, 540, cy, 1, t * 3);
    }
    sparks(c, t, hit, 540, 470, 18);
    if (km > 0) { const kb = bo(at(t, K.shen + .35, K.shen + .75)); if (kb > 0) { c.save(); c.translate(x, 1235); c.scale(1, kb); c.translate(-x, -1235); vapeBox(c, x, 1055, 150, 360, BOXC[0], { label: 'ЛЁД' }); c.restore() } }
    conveyor(c, t, eo(at(t, K.shen - .2, K.shen + .4)));
    convBoxes(c, t);
    const kp = spr(at(t, K.shen + .5, K.shen + 1.1));
    if (kp > 0) { c.strokeStyle = '#94a3b8'; c.lineWidth = 4; c.beginPath(); c.moveTo(380, 262); c.lineTo(380, 560 - 40 * kp); c.moveTo(700, 262); c.lineTo(700, 560 - 40 * kp); c.stroke(); plate(c, 'ШЭНЬЧЖЭНЬ · КОНВЕЙЕР', 540, 560, kp, { s: 34, bg: '#facc15', c: '#0f172a' }) }
    const d = darkF(t); if (d > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(2,6,15,${d})`; c.fillRect(0, 0, WW, HH); c.restore() }
    if (t < K.lights + .35) { const kk = at(t, K.lights, K.lights + .35); [200, 540, 880].forEach((lx, i) => { if (t >= K.lights + i * .15) glow(c, lx, 390, 160, '#e0f2fe', .9 * (1 - kk)) }) }
  }
  const zoomS = t => { const u = at(t, K.zoom0, K.zoom1); return Math.exp(Math.log(7.4) * (.6 * u + .4 * u * u * u)) };   // непрерывный наезд в дыру
  function radar(c, t) {   // красные волны радара из центра дыры (в координатах экрана)
    for (let i = 0; i < 4; i++) { const ph = ((t - K.whole) * .8 + i / 4) % 1; if (t < K.whole) break; ring(c, 540, 960, 30 + ph * 900, rgba('#ef4444', .55 * (1 - ph)), 6) }
  }
  function shot3(c, t) {
    if (t >= K.zoom1) { factoryShot(c, t); return }
    const s = (1 + .05 * eio(at(t, K.s3 + 1.6, K.zoom0))) * (t > K.zoom0 ? zoomS(t) : 1);   // лёгкий наезд ещё до нырка — кадр не стоит
    const zt = () => { c.translate(540, 960); c.scale(s, s); c.translate(-540, -960) };
    c.save(); zt(); hallShot(c, t); c.restore();
    // валики раскатывают указ поверх зала
    const kr = bo(at(t, K.s3 - .15, K.s3 + .2)), k1 = eio(at(t, K.s3 - .1, K.s3 + 1.85));
    const y1 = lp(806, SCR.top, k1), y2 = lp(854, SCR.bot, k1);
    c.save(); zt();
    if (kHole(t) > 0) {   // сквозь дыру — тёмный цех и волны радара
      c.save(); holePath(c); c.clip(); c.setTransform(1, 0, 0, 1, 0, 0); factoryShot(c, t); radar(c, t); c.restore();
    }
    if (k1 > 0) {
      c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(SCR.x - SCR.w / 2 + 16, y1 + 20, SCR.w, y2 - y1);
      c.save(); c.beginPath(); c.rect(-200, y1, WW + 400, y2 - y1); c.clip(); lawPaper(c, t); c.restore();
    }
    const ph = k1 * 6, sc = Math.min(1, kr);
    c.save(); c.translate(540, y1); c.scale(sc, sc); roller(c, 0, 0, 860, 0, ph); c.restore();
    c.save(); c.translate(540, y2); c.scale(sc, sc); roller(c, 0, 0, 860, 0, -ph); c.restore();
    c.restore();
  }
