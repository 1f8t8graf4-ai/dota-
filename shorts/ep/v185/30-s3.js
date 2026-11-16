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
  const SCR = { x: 540, w: 820, top: 260, bot: 1420 };
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
    const ta = 1 - at(t, K.zoom0, K.zoom0 + 1);   // при наезде текст свитка тает — буквы не лезут под плашку года
    c.save(); c.globalAlpha *= ta; if (ta > 0) {
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
    } c.restore();
    if (kh > 0 && kh < 1) {   // кусок бумаги внутри пунктира уходит вглубь, поворачиваясь
      c.save(); c.translate(HOLE.x, HOLE.y); c.rotate(kh * .9); c.scale(1 - kh, 1 - kh); rr(c, -HOLE.w / 2, -HOLE.h / 2, HOLE.w, HOLE.h, 40); fill(c, mixc('#f5efe0', '#64748b', kh)); c.restore();
    }
    // пунктир дыры: рисуется по кругу, потом бежит
    const kd = at(t, K.cart + .15, K.cart + .75);
    if (kd > 0) { const per = 2 * (HOLE.w + HOLE.h) - 70; c.save(); holePath(c); c.setLineDash(kd < 1 ? [per * kd, per] : [16, 12]); c.lineDashOffset = kd < 1 ? 0 : -t * 60; stroke(c, '#dc2626', 7); c.restore() }
    const kl = spr(at(t, K.whole + .1, K.whole + .6)), zs = t > ZP() ? zoomS(t) : 1, la = 1 - at(960 + 236 * zs, 1380, 1520);   // уходит вниз — тает, не лезет в субтитры
    if (kl > 0 && la > 0) { c.save(); c.globalAlpha *= la; c.translate(540, 1196); c.scale(kl, kl); tx(c, '[ ЦЕЛЬНЫЕ ОДНОРАЗОВЫЕ — ПУСТО ]', 0, 0, { f: 'M', w: 800, s: 32, c: '#dc2626', mw: SCR.w - 80 }); c.restore() }
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
      const kin = eo(at(t, t0 - .07 + (Math.abs(i) - 1) * .06, t0 + .43)); if (kin <= 0) continue;
      vapeBox(c, x - (1 - kin) * (i < 0 ? 700 : -700), 1055, 150, 360, BOXC[(i + 9) % 8], { label: { '-3': 'МАНГО', '-2': 'КОЛА', '-1': 'ВИНОГРАД', '1': 'ЛЁД', '2': 'ЯГОДЫ' }[i] });
    }
  }
  const darkF = t => t < K.lights ? .9 : t < K.lights + .15 ? .6 : t < K.lights + .3 ? .3 : 0;   // свет в цехе включается тремя прожекторами
  function factoryShotOld(c, t) {
    factoryBg(c, t);
    // табличка «JUUL КАРТРИДЖИ» на цепях; крест сбивает её — она улетает вниз за кадр
    const hit = K.juul2 + .32, kf = at(t, hit, hit + 1.1);
    const sx = 540 - 300 * kf * kf, sy = 470 + 1800 * kf * kf, sr = -1.2 * kf;
    if (kf < 1) {
      c.strokeStyle = '#94a3b8'; c.lineWidth = 5; if (kf <= 0) { c.beginPath(); c.moveTo(390, 262); c.lineTo(390, 425); c.moveTo(690, 262); c.lineTo(690, 425); c.stroke() }
      c.save(); c.translate(sx, sy); c.rotate(sr); rr(c, -210, -45, 420, 90, 12); fill(c, '#0f172a'); rr(c, -210, -45, 420, 90, 12); stroke(c, '#f8fafc', 4); tx(c, 'JUUL КАРТРИДЖИ', 0, 2, { f: 'O', w: 700, s: 40, c: '#f8fafc', ls: 2 }); c.restore();
    }
    // крест падает со шлейфом
    const cy = t < hit ? lp(-200, 470, ei(at(t, hit - .32, hit))) : lp(470, 1040, eo(at(t, hit, K.shen - .47)));
    const km = eio(at(t, K.shen - .47, K.shen - .07)), x = 540 + Math.max(0, t - K.shen - .2) * 180 * eo(at(t, K.shen + .2, K.shen + .9));
    if (t > hit - .32 && km < 1 || km >= 1 && t < K.shen - .07) {   // шлейф: верх опускается к крышке коробки, цвет густеет в цвет коробки
      const top = lp(350, 875, km), bot = Math.max(cy, lp(cy, 1235, km));
      if (bot > top) { const B0 = BOXC[0], g = c.createLinearGradient(0, top, 0, bot); g.addColorStop(0, rgba(B0, lp(0, 1, km))); g.addColorStop(.4, rgba(mixc('#f472b6', B0, km), lp(.75, 1, km))); g.addColorStop(1, rgba(mixc('#38bdf8', B0, km), lp(.9, 1, km))); rr(c, x - 75, top, 150, bot - top, lp(40, 10, km)); c.fillStyle = g; c.fill() }
      if (km <= 0) cross3d(c, 540, cy, 1, t * 3);
    }
    sparks(c, t, hit, 540, 470, 18);
    if (km >= 1) vapeBox(c, x, 1055, 150, 360, BOXC[0], { label: 'МАНГО', inner: bo(at(t, K.shen - .07, K.shen + .2)) });   // прямоугольник шлейфа остаётся — на нём проявляются окошко и надпись
    conveyor(c, t, eo(at(t, K.shen - .6, K.shen - .1)));
    convBoxes(c, t);
    const kp = spr(at(t, K.shen + .5, K.shen + 1.1));
    if (kp > 0) { c.strokeStyle = '#94a3b8'; c.lineWidth = 4; c.beginPath(); c.moveTo(380, 262); c.lineTo(380, 560 - 40 * kp); c.moveTo(700, 262); c.lineTo(700, 560 - 40 * kp); c.stroke(); plate(c, 'ШЭНЬЧЖЭНЬ · КОНВЕЙЕР', 540, 560, kp, { s: 34, bg: '#facc15', c: '#0f172a' }) }
    const d = darkF(t); if (d > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(2,6,15,${d})`; c.fillRect(0, 0, WW, HH); c.restore() }
    if (t < K.lights + .35) { const kk = at(t, K.lights, K.lights + .35); [200, 540, 880].forEach((lx, i) => { if (t >= K.lights + i * .15) glow(c, lx, 390, 160, '#e0f2fe', .9 * (1 - kk)) }) }
  }
  const ZP = () => K.scr0 + 1.2;   // свиток раскатан — камера сразу тихо подъезжает (без статики до наезда)
  const zoomS = t => (1 + .06 * eio(at(t, ZP(), K.zoom0 + .8))) * lp(1, 7.5, ei(at(t, K.zoom0, K.zoom1)));   // наезд в дыру: 1 → 7,5, easeInCubic
  function radar(c, t) {   // красные волны радара из центра дыры (в координатах экрана)
    for (let i = 0; i < 4; i++) { const ph = ((t - K.whole) * .8 + i / 4) % 1; if (t < K.whole) break; ring(c, 540, 960, 30 + ph * 900, rgba('#ef4444', .55 * (1 - ph)), 6) }
  }
  function shot3Old(c, t) {
    if (t >= K.zoom1) { factoryShot(c, t); return }
    const s = t > ZP() ? zoomS(t) : 1, zt = () => { c.translate(540, 960); c.scale(s, s); c.translate(-540, -960) };
    // 20.8–22.2: нижний валик едет вниз, всё выше него — дубовый стол поверх зала FDA; верхний встаёт на 260
    const kr = bo(at(t, K.scr0, K.scr0 + .3)), k1 = eio(at(t, K.scr0, K.scr0 + 1.4));
    const y2 = lp(-80, SCR.bot, k1), y1 = Math.min(SCR.top, y2);
    c.save(); zt();
    if (k1 < 1) hallShot(c, t);
    c.save(); if (k1 < 1) { c.beginPath(); c.rect(-200, -200, WW + 400, y2 + 237); c.clip() } oakTable(c, t); c.restore();
    if (kHole(t) > 0) {   // сквозь дыру — тёмный цех и волны радара
      c.save(); holePath(c); c.clip(); c.setTransform(1, 0, 0, 1, 0, 0); factoryShot(c, t); radar(c, t); c.restore();
    }
    if (y2 > y1) {
      c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(SCR.x - SCR.w / 2 + 16, y1 + 20, SCR.w, y2 - y1);
      c.save(); c.beginPath(); c.rect(-200, y1, WW + 400, y2 - y1); c.clip(); lawPaper(c, t); c.restore();
    }
    const ph = k1 * 6, sc = Math.min(1, kr);
    c.save(); c.translate(540, y1); c.scale(sc, sc); roller(c, 0, 0, 860, 0, 0); c.restore();
    c.save(); c.translate(540, y2); c.scale(sc, sc); roller(c, 0, 0, 860, 0, -ph); c.restore();
    c.restore();
  }

  // ================= v18.3 (проба): сцена 3 по Соболеву 0:05.5–0:10 (#112) и Cola 0:11.8–0:15.5 (#005) =================
  // Свиток падает кувырком на зал, встаёт стоймя, валики разъезжаются влево-вправо — между ними указ, камера подъезжает,
  // пока свиток не займёт экран. Пунктир → дыра → наезд в неё. За ней: тёмно-синий фон, JUUL, сверху падает объёмный крест,
  // JUUL падает вниз, оставляя красный след; след — полоса на корпусе большой одноразки, камера отъезжает к ряду на конвейере.
  const S3 = { lr: 1300, hole: { y: 60, w: 120, h: 290 }, paper: '#f3ead6', nav: '#0b1233' };
  function rollerV(c, x, L) {   // вертикальный валик: серый цилиндр, жёлтые наконечники
    c.save(); c.translate(x, 0);
    c.fillStyle = '#7f949c'; c.fillRect(-30, -L / 2, 60, L); c.fillStyle = '#a9bcc2'; c.fillRect(-30, -L / 2, 22, L); c.fillStyle = '#62767e'; c.fillRect(20, -L / 2, 10, L);
    [-1, 1].forEach(sg => { const y = sg * (L / 2 + 12); rr(c, -38, y - 14, 76, 28, 6); fill(c, '#f2c230'); rr(c, -16, y + sg * 14 - (sg < 0 ? 22 : 0), 32, 22, 6); fill(c, '#f2c230'); poly(c, [-6, y + sg * 36, 6, y + sg * 36, 0, y + sg * 54]); fill(c, '#f2c230') });
    c.restore();
  }
  function decreeS3(c, t, gap, ta) {   // бумага указа между валиками (локальные координаты свитка)
    const H = S3.hole, L = S3.lr / 2, kh = kHole(t);
    c.fillStyle = S3.paper; c.beginPath(); c.rect(-gap / 2, -L, gap, 2 * L); if (kh > 0) c.roundRect(-H.w / 2, H.y - H.h / 2, H.w, H.h, 30); c.fill('evenodd');
    for (let i = 0; i < 46; i++) { c.fillStyle = 'rgba(120,90,40,.05)'; c.fillRect(-gap / 2, -L + i * 28, gap, 1) }
    c.save(); c.globalAlpha *= ta; if (ta > 0) {
      circ(c, 0, -470, 24, '#1e3a8a'); tx(c, 'FDA', 0, -469, { f: 'U', w: 800, s: 13, c: '#fff' });
      tx(c, 'УКАЗ МИНЗДРАВА США · 2020', 0, -420, { f: 'O', w: 700, s: 30, c: '#1e293b', ls: 2, mw: 600 });
      c.fillStyle = '#1e293b'; c.fillRect(-300, -396, 600, 3);
      tx(c, 'ПОД ЗАПРЕТ ПОПАДАЮТ ТОЛЬКО:', 0, -356, { f: 'M', w: 800, s: 22, c: '#334155' });
      const km = eio(at(t, K.s3 + 1.9, K.cart - .1));
      if (km > 0) { rr(c, -310, -330, 620 * km, 40, 6); fill(c, '#fde047') }
      tx(c, '• ВЕЙПЫ СО СМЕННЫМИ КАРТРИДЖАМИ', 0, -309, { f: 'M', w: 800, s: 23, c: '#0f172a', mw: 600 });
      for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(71,85,105,.28)'; c.fillRect(-290, -262 + i * 24, 580 - (i % 2) * 110, 9) }
      for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(71,85,105,.28)'; c.fillRect(-290, 300 + i * 24, 580 - (i % 2) * 140, 9) }
      c.save(); c.translate(-30, -50); c.scale(.62, .62); blueStamp(c, 360, -200, at(t, K.cart - .12, K.cart + .12)); c.restore();
    } c.restore();
    if (kh > 0 && kh < 1) { c.save(); c.translate(0, H.y); c.rotate(kh * .9); c.scale(1 - kh, 1 - kh); rr(c, -H.w / 2, -H.h / 2, H.w, H.h, 30); fill(c, mixc(S3.paper, '#334155', kh)); c.restore() }
    const kd = at(t, K.cart + .15, K.cart + .75);
    if (kd > 0) { const per = 2 * (H.w + H.h) - 50; c.save(); c.beginPath(); c.roundRect(-H.w / 2, H.y - H.h / 2, H.w, H.h, 30); c.setLineDash(kd < 1 ? [per * kd, per] : [12, 9]); c.lineDashOffset = kd < 1 ? 0 : -t * 45; stroke(c, '#dc2626', 5); c.restore() }
    const kl = spr(at(t, K.whole + .1, K.whole + .6));
    if (kl > 0) { c.save(); c.globalAlpha *= ta; c.translate(0, 235); c.scale(kl, kl); tx(c, '[ ЦЕЛЬНЫЕ ОДНОРАЗОВЫЕ — ПУСТО ]', 0, 0, { f: 'M', w: 800, s: 22, c: '#dc2626', mw: 560 }); c.restore() }
  }
  function shot3(c, t) {
    if (t >= K.zoom1) { factoryShot(c, t); return }
    const T = K.scr0, kf = at(t, T, T + .75), land = T + .75;
    const gx = lp(1060, 540, eo(kf)), gy = lp(-760, 960, kf * kf);
    const ul = t - land, r = t < land ? lp(-2.3, .22, kf) : .22 * Math.exp(-6 * ul) * Math.cos(11 * ul);
    const gap = lp(0, 700, eio(at(t, T + .95, T + 1.85)));
    const z0 = lp(1, 1.6, eio(at(t, T + 1.2, T + 2.1))) * (1 + .04 * eio(at(t, T + 2.1, K.zoom0 + .8)));
    const d = lp(1, 7.5, ei(at(t, K.zoom0, K.zoom1))), hx = 540, hy = 960 + S3.hole.y * z0;
    hallShot(c, t);
    c.save(); c.translate(hx, hy); c.scale(d, d); c.translate(-hx, -hy);
    c.translate(540, 960); c.scale(z0, z0); c.translate(gx - 540, gy - 960); c.rotate(r);
    if (kHole(t) > 0) { c.save(); c.beginPath(); c.roundRect(-S3.hole.w / 2, S3.hole.y - S3.hole.h / 2, S3.hole.w, S3.hole.h, 30); c.clip(); c.setTransform(1, 0, 0, 1, 0, 0); factoryShot(c, t); c.restore() }
    if (gap > 0) decreeS3(c, t, gap, 1 - at(t, K.zoom0, K.zoom0 + 1));
    rollerV(c, -gap / 2 - 30, S3.lr); rollerV(c, gap / 2 + 30, S3.lr);
    c.restore();
  }
  // ---------- за дырой: #005 ----------
  function cross3dS(c, x, y, s, r) {   // небольшой объёмный крест: синий, светлая грань
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const arm = (a) => { c.save(); c.rotate(a); c.save(); c.translate(10, 10); rr(c, -26, -80, 52, 160, 8); fill(c, '#16245c'); c.restore(); rr(c, -26, -80, 52, 160, 8); fill(c, '#2f4fae'); rr(c, -26, -80, 18, 160, 8); fill(c, '#5d7fe0'); c.restore() };
    arm(Math.PI / 4); arm(-Math.PI / 4); c.restore();
  }
  function vapeRow(c, x, yb, w, h, col, o = {}) {   // одноразка контуром, полоса слева цветом
    const top = yb - h, mw = w * .56, mh = 62;
    c.save(); c.translate(x, 0);
    rr(c, -w / 2, top, w, h, 30); fill(c, S3.nav);
    const k = o.k ?? 1, sf = o.full ? 1 : k;
    c.save(); rr(c, -w / 2, top, w, h, 30); c.clip(); c.fillStyle = col; c.fillRect(-w / 2, yb - h * sf - 20, w * .3, h * sf + 40); c.restore();
    c.save(); rr(c, -w / 2, top, w, h, 30); if (k < 1) c.setLineDash([2 * (w + h) * k, 3000]); lnS(c, 5, '#e2e8f0'); c.restore();
    if (k > .5) { const k2 = (k - .5) * 2; rr(c, -mw / 2, top - mh + 6, mw, mh, 16); fill(c, S3.nav); c.save(); rr(c, -mw / 2, top - mh + 6, mw, mh, 16); if (k2 < 1) c.setLineDash([2 * (mw + mh) * k2, 3000]); lnS(c, 5, '#e2e8f0'); c.restore() }
    if (o.label && k >= 1) tx(c, o.label, w * .1, yb - 40, { f: 'O', w: 700, s: 20, c: '#e2e8f0', mw: w * .62 });
    if (o.tag > 0) { c.save(); c.translate(w * .14, top + h * .62); c.rotate(-.12); c.scale(o.tag, o.tag); rr(c, -70, -24, 140, 48, 8); fill(c, '#e8445a'); tx(c, 'ШЭНЬЧЖЭНЬ', 0, 2, { f: 'O', w: 700, s: 22, c: '#fff' }); c.restore() }
    c.restore();
  }
  function beltS3(c, t, run) {   // лента: верх Y 1220 серый, ниже тёмная (в это же переходит волна сцены 4)
    vgrad(c, -60, 1220, WW + 120, 760, ['#1f2937', '#0b0f19']); c.fillStyle = '#475569'; c.fillRect(-60, 1220, WW + 120, 12);
    for (let i = -1; i < 9; i++) { const x = i * 140 + ((run * 140) % 140), y = 1290; ring(c, x, y, 26, '#64748b', 5); c.save(); c.translate(x, y); c.rotate(run * 5.5); c.beginPath(); c.moveTo(-18, 0); c.lineTo(18, 0); lnS(c, 4, '#64748b'); c.restore() }
  }
  function factoryShot(c, t) {
    const hit = K.juul2 + .32, sh = K.shen;
    c.fillStyle = S3.nav; c.fillRect(-200, -200, WW + 400, HH + 400);
    // JUUL и крест
    const uj = Math.max(0, t - hit), jy = 900 + 2000 * uj * uj, jr = .5 * uj;
    if (jy < 2200) { c.save(); c.translate(540, jy); c.rotate(jr); tx(c, 'JUUL', 0, 0, { f: 'U', w: 800, s: 170, c: '#e8445a', ls: 6 }); tx(c, 'КАРТРИДЖИ · ВКУСЫ', 0, 120, { f: 'O', w: 700, s: 30, c: '#94a3b8', ls: 4 }); c.restore() }
    const kc = at(t, hit - .62, hit), cy = t < hit ? lp(-200, 790, kc * kc) : 790 + 2300 * uj * uj, cr = t * 4.2;
    if (cy < 2200) { for (let i = 0; i < 12; i++) { const ph = H1(i * 3.3), dx = (ph - .5) * 90, dy = -40 - H1(i * 7.1) * 160 - ((t * 120 + i * 13) % 60); circ(c, 540 + dx + Math.sin(t * 6 + i) * 6, cy + dy, 3 + H1(i) * 3, i % 3 ? 'rgba(232,68,90,.8)' : 'rgba(241,245,249,.8)') }
      cross3dS(c, 540, cy, .8, cr) }
    sparks(c, t, hit, 540, 800, 14, '#f1f5f9');
    // след → полоса большой одноразки → отъезд к ряду на ленте
    const VW = 170, VH = 470, VB = 1220, sx = 540 - VW / 2 + VW * .15, sy = VB - VH / 2;
    const zb = lp(3.2, 1, eio(at(t, sh - .1, sh + .6))), u = (zb - 1) / 2.2;
    const run = Math.max(0, t - (sh + .6)) * eo(at(t, sh + .6, sh + 1.2)) * 140 / 140;
    const kb = at(t, hit + .05, sh - .47);   // ширина следа
    c.save();
    const px = lp(sx, 540, u), py = lp(sy, 960, u); c.translate(px, py); c.scale(zb, zb); c.translate(-sx, -sy);
    if (t >= sh - .47) {
      const ko = eo(at(t, sh - .47, sh - .05)), off = 140 * Math.max(0, t - (sh + .6)) * eo(at(t, sh + .6, sh + 1.2));
      c.save(); poly(c, [-400, 1500, 500, -200, 980, -200, 80, 1500]); c.clip(); c.fillStyle = '#14215a'; c.fillRect(-400, lp(1500, -200, ko), 1500, 1800); c.restore();
      c.save(); c.beginPath(); c.rect(-400, 1200, 1900, 1000); c.clip(); c.translate(0, 700 * (1 - ko)); beltS3(c, t, off / 140); c.restore();
      for (let i = -4; i <= 4; i++) {
        if (i === 0) continue;
        const x = ((540 + i * 240 + off + 540) % 2160 + 2160) % 2160 - 540;
        vapeRow(c, x, VB, VW, VH, BOXC[(i + 8) % 8], { k: ko, label: ['МАНГО', 'КОЛА', 'ВИНОГРАД', 'ЛЁД', 'ЯГОДЫ', 'ДЫНЯ', 'ЛИЧИ', 'МЯТА'][(i + 8) % 8] });
      }
      vapeRow(c, 540 + off, VB, VW, VH, '#e8445a', { k: ko, label: 'МАНГО', tag: bo(at(t, sh + .4, sh + .75)), full: 1 });
    } else if (kb > 0) {
      const w = lp(14, VW * .3, kb), top = lp(900, -400, eo(at(t, hit + .25, hit + .8)));
      c.fillStyle = '#e8445a'; c.fillRect(sx - w / 2, Math.min(top, 900), w, Math.max(jy, 1900) - Math.min(top, 900));
    }
    c.restore();
  }
