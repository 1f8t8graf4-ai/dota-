  // ================= СЦЕНА 7: холм с табаком → колба-лампочка → змеевик → касса =================
  function labBlue(c, t) {   // тёмно-синяя лаборатория с бензольными шестигранниками и штативами
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#0b1430', '#13214a', '#0a1228']);
    for (let i = 0; i < 9; i++) { const x = (H1(i * 3) * WW + t * 12 * (i % 2 ? 1 : -1) + 2000) % (WW + 200) - 100, y = 160 + H1(i * 7) * 1100 + Math.sin(t * .6 + i) * 20, r = 40 + H1(i) * 50;
      c.save(); c.translate(x, y); c.rotate(t * .1 + i); c.globalAlpha = .14; c.beginPath(); for (let j = 0; j < 6; j++) { const a = j * TAU / 6; c[j ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r) } c.closePath(); stroke(c, '#93c5fd', 4); c.beginPath(); c.arc(0, 0, r * .55, 0, TAU); c.stroke(); c.restore() }
    c.save(); c.globalAlpha = .35; [[110, 1350], [970, 1350]].forEach(([x, b]) => { c.fillStyle = '#334155'; c.fillRect(x - 6, b - 760, 12, 760); c.fillRect(x - 70, b - 10, 140, 14); c.fillRect(x, b - 600, 70, 8); c.fillRect(x, b - 420, 70, 8) }); c.restore();
    glow(c, 540, 700, 700, '#3b82f6', .12); vignette(c, .5);
  }
  const PL = [{ x: 540, by: 1095, ty: 420, s: 1 }, { x: 330, by: 1120, ty: 650, s: .8 }, { x: 750, by: 1120, ty: 650, s: .8 }];
  function tobacco(c, t, p, i, kg, kw) {   // растение: стебель, большие листья, розово-красные бутоны; kw — увядание
    const top = lp(p.by, p.ty, kg); if (kg <= 0) return;
    c.strokeStyle = mixc('#15803d', '#78716c', kw); c.lineWidth = 9 * p.s; c.lineCap = 'round'; c.beginPath(); c.moveTo(p.x, p.by); c.quadraticCurveTo(p.x + 18 * Math.sin(i + 1), (p.by + top) / 2, p.x, top); c.stroke();
    for (let j = 0; j < 4; j++) { const ly = lp(p.by, top, .2 + j * .2), kl = spr(at(kg, .2 + j * .15, .5 + j * .15)), dir = j % 2 ? 1 : -1; if (kl <= 0 || ly < top + 20) continue;
      const kf = ss((j + i) * .08, (j + i) * .08 + .45, kw), fall = kw * (40 + j * 20) + 1400 * kf * kf;
      c.save(); c.translate(p.x + dir * 160 * kf, ly + fall); c.rotate(dir * (.5 + kw * .9 + kf * 3)); c.scale(kl * p.s * dir, kl * p.s);
      c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(60, -70, 170, -40, 200, 0); c.bezierCurveTo(170, 40, 60, 50, 0, 0); fill(c, mixc('#059669', '#a8a29e', kw));
      c.strokeStyle = 'rgba(209,250,229,.5)'; c.lineWidth = 3; c.beginPath(); c.moveTo(4, 0); c.lineTo(190, 0); c.stroke(); c.restore() }
  }
  function bud(c, x, y, k, kw) { k *= 1 - ss(0, .7, kw); if (k <= 0) return; c.save(); c.translate(x, y + 60 * kw); c.rotate(kw * 1.4); c.scale(k, k); for (let j = 0; j < 5; j++) { c.save(); c.rotate(-Math.PI / 2 + (j - 2) * .28); c.beginPath(); c.ellipse(0, -36, 13, 34, 0, 0, TAU); fill(c, j % 2 ? '#f472b6' : '#e11d48'); c.restore() } circ(c, 0, 0, 16, '#be123c'); c.restore() }
  function bulb(c, x, y, k, t) {   // стеклянная колба-лампочка R 85 с золотым свечением
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k);
    glow(c, 0, 0, 260, '#fbbf24', .55); circ(c, 0, 0, 85, 'rgba(254,243,199,.30)'); circ(c, 0, 10, 60, rgba('#f59e0b', .75)); glow(c, 0, 10, 90, '#fde68a', .8);
    ring(c, 0, 0, 85, 'rgba(255,255,255,.85)', 6); rr(c, -26, 78, 52, 40, 8); fill(c, 'rgba(226,232,240,.8)'); c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(-36, -34, 12, 26, -.6, 0, TAU); c.fill();
    c.restore();
  }
  // змеевик: 5 витков, X 380…700, Y 520…1170
  const COIL = (() => { const P = []; for (let i = 0; i <= 400; i++) { const u = i / 400, a = u * 5 * TAU; P.push([540 + Math.sin(a) * 160, 520 + u * 650 + Math.cos(a) * 26]) } return P })();
  function coil(c, t, ka, kd) {
    if (ka <= 0) return; c.save();
    const kst = eo(at(ka, 0, .5)); c.save(); c.translate(0, 900 * (1 - kst));
    c.fillStyle = '#475569'; c.fillRect(780, 420, 14, 900); c.fillRect(700, 1310, 180, 16); rr(c, 700, 500, 100, 26, 6); fill(c, '#64748b'); rr(c, 700, 1100, 100, 26, 6); fill(c, '#64748b');
    rr(c, 480, 1230, 120, 80, 18); fill(c, 'rgba(186,230,253,.35)'); rr(c, 480, 1230, 120, 80, 18); stroke(c, '#e0f2fe', 3);   // спиртовка
    const fl = 1 + .12 * Math.sin(t * 17); c.save(); c.translate(540, 1228); c.scale(1, fl); c.beginPath(); c.moveTo(0, -70); c.quadraticCurveTo(26, -22, 0, 0); c.quadraticCurveTo(-26, -22, 0, -70); fill(c, '#3b82f6'); c.beginPath(); c.moveTo(0, -46); c.quadraticCurveTo(13, -16, 0, 0); c.quadraticCurveTo(-13, -16, 0, -46); fill(c, '#93c5fd'); c.restore(); c.restore();
    const nP = Math.floor(400 * at(ka, .2, 1)); if (nP < 2) { c.restore(); return }
    const path = () => { c.beginPath(); for (let i = 0; i <= nP; i++) c[i ? 'lineTo' : 'moveTo'](COIL[i][0], COIL[i][1]) };
    c.lineCap = 'round'; c.lineJoin = 'round';
    path(); stroke(c, 'rgba(255,255,255,.75)', 28); path(); stroke(c, 'rgba(15,23,42,.85)', 20); path(); stroke(c, 'rgba(186,230,253,.18)', 20);
    if (kd > 0) { const n = Math.floor(kd * 400), a = Math.max(0, n - 60); c.beginPath(); for (let i = a; i <= n; i++) c[i > a ? 'lineTo' : 'moveTo'](COIL[i][0], COIL[i][1]); stroke(c, '#fbbf24', 12); if (kd < 1) { const p = COIL[n]; glow(c, p[0], p[1], 60, '#fde68a', .9); circ(c, p[0], p[1], 14, '#fde047') } }
    c.restore();
  }
  function billFan(c, k) {   // веер стодолларовых купюр за кассой
    if (k <= 0) return; c.save(); c.translate(540, 1100);
    for (let i = 0; i < 11; i++) { const a = lp(0, -1.25 + i * .25, eo(k)); c.save(); c.rotate(a); c.translate(0, -330); rr(c, -78, -170, 156, 340, 10); fill(c, i % 2 ? '#86b48a' : '#9ec29f'); rr(c, -66, -158, 132, 316, 6); stroke(c, '#3f6d48', 3); circ(c, 0, -20, 38, '#d9e8d5'); ring(c, 0, -20, 38, '#3f6d48', 3); tx(c, '100', 0, 120, { f: 'O', w: 700, s: 34, c: '#2f5537' }); c.restore() }
    c.restore();
  }
  function storeBg(c, t) {   // витрина магазина за кассой: полки с коробками одноразок, тёплый свет
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#1c1426', '#2a1a2e', '#140f1c']);
    for (let r = 0; r < 4; r++) { c.fillStyle = '#3b2a3f'; c.fillRect(0, 300 + r * 230, WW, 14); for (let i = 0; i < 13; i++) { if (H1(i + r * 13) > .82) continue; c.save(); c.globalAlpha = .55; vapeBox(c, 40 + i * 80, 300 + r * 230 - 58, 56, 112, BOXC[(i + r) % 8]); c.restore() } }
    glow(c, 540, 700, 800, '#f59e0b', .12);
    vgrad(c, -100, 1360, WW + 200, 700, ['#2b1d14', '#1a110b']); c.fillStyle = '#5b3a24'; c.fillRect(-100, 1356, WW + 200, 12);
    vignette(c, .55);
  }
  const REG = { x: 540, y: 980 };
  function register(c, t, o = {}) {   // ретро-касса 580×480: табло сверху (Y 740), клавиши, ящик
    const { x, y } = REG; c.save(); c.translate(x, y);
    c.save(); c.translate(0, 250); c.scale(1, .12); circ(c, 0, 0, 340, 'rgba(0,0,0,.45)'); c.restore();
    poly(c, [-290, 240, 290, 240, 250, -120, -250, -120]); const g = c.createLinearGradient(0, -120, 0, 240); g.addColorStop(0, '#b45309'); g.addColorStop(1, '#78350f'); c.fillStyle = g; c.fill();
    poly(c, [-250, -120, 250, -120, 240, -150, -240, -150]); fill(c, '#d97706');
    for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { rr(c, -210 + i * 72, -90 + r * 64, 58, 48, 10); fill(c, '#fef3c7'); rr(c, -210 + i * 72, -90 + r * 64, 58, 14, 6); fill(c, '#fff') }
    rr(c, -260, 120, 520, 100, 10); fill(c, '#92400e'); rr(c, -60, 160, 120, 20, 8); fill(c, '#fbbf24');
    // табло
    rr(c, -280, -330, 560, 180, 22); fill(c, '#451a03'); rr(c, -260, -312, 520, 144, 14); fill(c, '#0c0a09');
    if (o.disp) o.disp(-240, -240); else tx(c, '$0', 0, -240, { f: 'J', w: 700, s: 60, c: '#fb923c' });
    if (o.after) o.after();
    if (o.coin > 0) { c.save(); c.translate(0, -132 + 10 * (1 - o.coin)); circ(c, 0, 0, 34 * o.coin, '#fbbf24'); ring(c, 0, 0, 26 * o.coin, '#b45309', 4); c.restore() }
    c.restore();
  }
  const REGNUM = '$3 200 000 000';
  function regDisplay(c, t) {   // цифры набегают от $0 до 3 200 000 000
    const k = eio(at(t, K.bill - .1, K.bill + 1.0)), v = Math.round(3.2e9 * k / 1e6) * 1e6;
    const s = '$' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (x, y) => { glow(c, 0, y, 260, '#fb923c', .22); num(c, k >= 1 ? REGNUM : s, 0, y - 6, { f: 'J', w: 700, s: 52, c: '#fb923c' }); tx(c, 'ОДНОРАЗКИ · США · ГОД', 0, y + 50, { f: 'O', w: 500, s: 22, c: '#fdba74', ls: 3 }) };
  }
  const recL = t => 560 * eio(at(t, K.market - .3, K.corp + .6));
  function receipt(c, t) {   // чек выползает вверх из щели на крышке кассы (над табло); строки печатаются и едут вместе с бумагой
    const L = recL(t); if (L <= 0) return;
    const y0 = -338, W = 300, pt = d => [-30 * Math.sin(d / 560 * Math.PI * 1.2), y0 - d];
    const N = 30, top = []; for (let i = 0; i <= N; i++) top.push(pt(i / N * L));
    c.beginPath(); top.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0] - W / 2, p[1])); for (let i = N; i >= 0; i--) c.lineTo(top[i][0] + W / 2, top[i][1]); c.closePath(); fill(c, '#fafaf9'); c.strokeStyle = '#d6d3d1'; c.lineWidth = 2; c.stroke();
    const lines = [['ЧЕК · РЫНОК ОДНОРАЗОК', K.market - .2], ['VUSE GO — BAT', K.old - .1], ['NJOY — ALTRIA', K.corp - .2], ['(«МАЛЬБОРО»)', K.corp + .1]];
    lines.forEach(([s, tt0], i) => { if (t < tt0) return; const d = i ? L - recL(tt0) + 34 : L - 26; if (d > L - 14 || d < 20) return; const p = pt(d); tx(c, s, p[0], p[1], { f: 'J', w: 700, s: 27, c: '#1c1917', mw: W - 24 }) });
    rr(c, -170, y0 - 8, 340, 16, 6); fill(c, '#1c1917');   // щель
  }
  function hillShape(c, kh, kl) {   // круг торца опускается и расползается в белый холм
    const hy = lp(860, 1300, kh) + 1400 * kl, rx = lp(230, 760, kh), ry = lp(230, 300, kh), lo = lp(230, 0, kh);
    c.beginPath(); c.ellipse(540, hy, rx, ry, 0, Math.PI, TAU); c.lineTo(540 + rx, hy + 700 * kh); c.lineTo(540 - rx, hy + 700 * kh); c.closePath();
    if (kh < 1) { c.moveTo(540 + rx, hy); c.ellipse(540, hy, rx, lo, 0, 0, Math.PI) }
    const g = c.createLinearGradient(0, hy - ry, 0, hy + 200); g.addColorStop(0, mixc('#fbbf24', '#f1f5f9', kh)); g.addColorStop(1, mixc('#d97706', '#94a3b8', kh)); c.fillStyle = g; c.fill();
    return hy;
  }
  function shot7(c, t) {
    const kq = eio(at(t, K.s7 - .1, K.s7 + .2));      // надпись и картриджи втягиваются
    const kh = eio(at(t, K.s7 + .1, K.s7 + .8));      // торец опускается и становится холмом
    const kp = at(t, K.s7 + .6, K.s7 + 1.9);          // табак растёт
    const kb = spr(at(t, K.tube - .1, K.tube + .4)), kw = eio(at(t, K.noleaf, K.leaf + .5));
    const kl = eio(at(t, K.when - .55, K.when + .1));  // холм со стеблями уходит вниз до змеевика
    const kc = at(t, K.when - .2, K.when + .4), kd = at(t, K.when + .1, K.bill - .25);
    const pR = 900 * eio(at(t, K.bill - .55, K.bill - .05)), pan = 350 * ss(0, 1, kd) + pR;
    // фон: тёмный чертёж → лаборатория раскрывается кругом из торца → (панорама вниз) витрина за кассой
    if (kh < 1) blueprintBg(c, t, 1);
    if (kh > 0 && pR < 900) { c.save(); if (kh < 1) { c.beginPath(); c.arc(540, lp(860, 1300, kh), lp(230, 2300, kh), 0, TAU); c.clip() } c.translate(0, -pan * .6); labBlue(c, t); c.restore() }
    if (pR > 0) { c.save(); c.translate(0, 2100 * (1 - pR / 900)); storeBg(c, t); vgrad(c, -200, -120, WW + 400, 120, ['#0b0712', '#1c1426']); c.restore() }
    c.save(); c.translate(0, -pan);
    if (kl < 1 && pan < 1200) {
      const hy = hillShape(c, kh, kl);
      if (kh < 1) { c.save(); c.translate(540, hy); c.scale(1 - kh, (1 - kh) * lp(1, .6, kh)); capFace(c, 230); c.restore() }
      if (kh <= 0) endFace(c, t, 1, kq);
      c.save(); c.translate(0, 1400 * kl);
      PL.forEach((p, i) => tobacco(c, t, p, i, eo(at(kp, i * .12, .7 + i * .12)), i === 0 ? kw : Math.max(kw, ss(.5, 1, kw))));
      bud(c, PL[1].x, PL[1].ty, spr(at(kp, .7, 1)), kw); bud(c, PL[2].x, PL[2].ty, spr(at(kp, .75, 1)), kw);
      bud(c, 540, 420, spr(at(kp, .65, .95)) * (1 - kb), 0);
      c.restore();
    }
    if (pan < 1200) {
      coil(c, t, kc, kd);
      bulb(c, 540, 420, kb, t);
      const kpl = spr(at(t, K.tube + .2, K.tube + .7)); if (kpl > 0) plate(c, 'СИНТЕТИЧЕСКИЙ НИКОТИН · БЕЗ ТАБАКА', 540, 270, kpl, { s: 30, bg: '#fbbf24', c: '#1c1917' });
    }
    // капля падает с конца змеевика на кассу
    const kfall = at(t, K.bill - .55, K.bill - .02); if (kfall > 0 && kfall < 1) { const y = lp(1180, 1250 + 848, kfall * kfall); glow(c, 540, y, 50, '#fde68a', .9); circ(c, 540, y, 16, '#fde047') }
    c.restore();
    if (pR > 0) {   // касса (мир: на 1250 ниже лаборатории)
      c.save(); c.translate(0, 1250 - pan);
      const kt = eio(at(t, K.bill - .05, K.bill + .7)) * (1 - eio(at(t, K.market - .7, K.market - .1)));
      if (kt > 0) { c.translate(540, 740); c.rotate(-.10 * kt); c.scale(lp(1, 1.4, kt), lp(1, 1.4, kt)); c.translate(-540, -740) }
      billFan(c, at(t, K.bill + .1, K.bill + .9));
      register(c, t, { disp: regDisplay(c, t), coin: spr(at(t, K.bill - .05, K.bill + .3)) * (t < K.s8 - .25 ? 1 : 0), after: () => receipt(c, t) });
      c.restore();
    }
  }
