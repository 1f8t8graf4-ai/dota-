  // ================= СЦЕНА 7: холм с табаком → колба-лампочка → змеевик → касса =================
  function labBlue(c, t) {   // тёмно-синяя лаборатория с бензольными шестигранниками и штативами
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#0b1430', '#13214a', '#0a1228']);
    for (let i = 0; i < 9; i++) { const x = (H1(i * 3) * WW + t * 12 * (i % 2 ? 1 : -1) + 2000) % (WW + 200) - 100, y = 160 + H1(i * 7) * 1100 + Math.sin(t * .6 + i) * 20, r = 40 + H1(i) * 50;
      c.save(); c.translate(x, y); c.rotate(t * .1 + i); c.globalAlpha = .14; c.beginPath(); for (let j = 0; j < 6; j++) { const a = j * TAU / 6; c[j ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r) } c.closePath(); stroke(c, '#93c5fd', 4); c.beginPath(); c.arc(0, 0, r * .55, 0, TAU); c.stroke(); c.restore() }
    c.save(); c.globalAlpha = .35; [[110, 1350], [970, 1350]].forEach(([x, b]) => { c.fillStyle = '#334155'; c.fillRect(x - 6, b - 760, 12, 760); c.fillRect(x - 70, b - 10, 140, 14); c.fillRect(x, b - 600, 70, 8); c.fillRect(x, b - 420, 70, 8) }); c.restore();
    glow(c, 540, 700, 700, '#3b82f6', .12); vignette(c, .5);
  }
  const PL = [{ x: 540, by: 805, ty: 380, s: 1 }, { x: 330, by: 840, ty: 600, s: .8 }, { x: 750, by: 840, ty: 600, s: .8 }];   // стебли растут из купола холма
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
    const path = () => { c.beginPath(); c.moveTo(540, 465); for (let i = 0; i <= nP; i++) c.lineTo(COIL[i][0], COIL[i][1]) };   // трубка растёт из низа колбы
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
  function hillShape(c, kh) {   // круг торца опускается и растёт в купол белого холма: y 860 → 1520, R 230 → 720
    const hy = lp(860, 1520, kh), R = lp(230, 720, kh);
    const g = c.createLinearGradient(0, hy - R, 0, hy); g.addColorStop(0, mixc('#fbbf24', '#f1f5f9', kh)); g.addColorStop(1, mixc('#f59e0b', '#94a3b8', kh));
    c.beginPath(); c.arc(540, hy, R, 0, TAU); c.fillStyle = g; c.fill();
    return hy;
  }
  function shot7Old(c, t) {
    const kq = eio(at(t, K.s7 - .1, K.s7 + .2));      // надпись и картриджи втягиваются
    const kh = eio(at(t, K.s7 - .07, K.s7 + .73));    // 64.0–64.8: торец → купол холма
    const kp = at(t, K.s7 + .73, K.s7 + 1.9);         // табак растёт из купола
    const kb = spr(at(t, K.tube - .1, K.tube + .4)), kw = eio(at(t, K.noleaf, K.leaf + .5));
    const kl = eio(at(t, K.when - .75, K.when + .05)); // 68.8–69.6: холм со стеблями уходит вниз, колба и плашка стоят
    const kc = at(t, K.when - .55, K.when + .05), kd = at(t, K.when + .1, K.bill - .25);
    const pR = 900 * eio(at(t, K.bill - .55, K.bill - .05)), pan = 350 * ss(0, 1, kd) + pR;
    // фон: тёмный чертёж плавно уходит в такую же тёмную лабораторию, потом панорама вниз к витрине
    if (pR < 900) { c.save(); c.translate(0, -pan * .6); labBlue(c, t); c.restore(); if (kh < 1) { c.save(); c.globalAlpha = 1 - kh; blueprintBg(c, t, 1); c.restore() } }
    if (pR > 0) { c.save(); c.translate(0, 2100 * (1 - pR / 900)); storeBg(c, t); vgrad(c, -200, -120, WW + 400, 120, ['#0b0712', '#1c1426']); c.restore() }
    c.save(); c.translate(0, -pan);
    if (kl < 1 && pan < 1200) {
      c.save(); c.translate(0, 1380 * kl);
      const hy = hillShape(c, kh);
      if (kh < 1) { c.save(); c.translate(540, hy); c.scale(1 - kh, 1 - kh); capFace(c, 230); c.restore() }
      if (kq < 1) endFace(c, t, 1, kq, hy, true);
      PL.forEach((p, i) => tobacco(c, t, p, i, eo(at(kp, i * .12, .7 + i * .12)), i === 0 ? kw : Math.max(kw, ss(.5, 1, kw))));
      bud(c, PL[1].x, PL[1].ty, spr(at(kp, .7, 1)), kw); bud(c, PL[2].x, PL[2].ty, spr(at(kp, .75, 1)), kw);
      bud(c, 540, PL[0].ty, spr(at(kp, .65, .95)) * (1 - kb), 0);
      c.restore();
    }
    if (pan < 1200) {
      coil(c, t, kc, kd);
      bulb(c, 540, 380, kb, t);
      const kpl = spr(at(t, K.tube + .2, K.tube + .7)); if (kpl > 0) plate(c, 'СИНТЕТИЧЕСКИЙ НИКОТИН · БЕЗ ТАБАКА', 540, 232, kpl, { s: 30, bg: '#fbbf24', c: '#1c1917' });
    }
    // капля падает с конца змеевика на кассу
    const kfall = at(t, K.bill - .55, K.bill - .02); if (kfall > 0 && kfall < 1) { const y = lp(1180, 1250 + 848, kfall * kfall); glow(c, 540, y, 50, '#fde68a', .9); circ(c, 540, y, 16, '#fde047') }
    c.restore();
    if (pR > 0) {   // касса (мир: на 1250 ниже лаборатории)
      c.save(); c.translate(0, 1250 - pan);
      const kt = eio(at(t, K.bill - .05, K.bill + .7)) * (1 - eio(at(t, K.market - .7, K.market - .1)));
      if (kt > 0) { c.translate(540, 740); c.rotate(-.10 * kt); c.scale(lp(1, 1.4, kt), lp(1, 1.4, kt)); c.translate(-540, -740) }
      billFan(c, at(t, K.bill + .1, K.bill + .9));
      register(c, t, { disp: regDisplay(c, t), coin: spr(at(t, K.bill - .05, K.bill + .3)) * (t < K.s8 - .57 ? 1 : 0), after: () => receipt(c, t) });
      c.restore();
    }
  }

  // ================= v18.3 (проба): сцена 7 по Cola 0:41.5–1:00 (#009, #010) и Starbucks 0:05.5–0:11 (#012) =================
  // Торец опускается и становится белым холмом; из холма растут тонкие стебли с красными цветами и белыми бутонами, средний бутон —
  // лампочка; лепестки облетают; холм уходит вниз, лампочка — колба на горелке; по трубке и змеевику бегут золотые капли,
  // камера идёт вниз за ними, капля падает в одноразку, ряд наполняется; красная диагональ — и касса контуром: табло считает,
  // наезд с наклоном на табло, чек лентой ползёт вверх с названиями корпораций, фон темнеет в бордовый.
  const S7 = { nav: '#0e1432', ln: '#f1f5f9', red: '#e5484d', gold: '#fbbf24' };
  const STEM = [{ x: 290, h: 470, f: 'r' }, { x: 415, h: 330, f: 'w' }, { x: 540, h: 600, f: 'b' }, { x: 665, h: 380, f: 'w' }, { x: 795, h: 500, f: 'r' }];
  const domeY = x => 1820 - Math.sqrt(Math.max(0, 720 * 720 - (x - 540) * (x - 540)));
  function poppyS7(c, x, y, s, kw, t, i) {   // красный цветок: три лепестка (облетают при kw)
    if (s <= 0) return;
    for (let j = 0; j < 3; j++) { const fk = ss(j * .15, .5 + j * .15, kw), dx = (j - 1) * 16 + Math.sin(t * 2 + j + i) * 30 * fk, dy = 700 * fk * fk;
      c.save(); c.translate(x + dx * (1 + fk * 4), y + dy); c.rotate((j - 1) * .6 + fk * (j - 1 || 1) * 4); c.scale(s, s); c.beginPath(); c.ellipse(0, -18, 15, 24, 0, 0, TAU); fill(c, S7.red); c.restore() }
    circ(c, x, y + 4, 6 * s * (1 - kw), '#1f0a10');
  }
  function bulbS7(c, x, y, k, lit, t) {   // лампочка контуром: круг, цоколь, нить
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k);
    c.beginPath(); c.arc(0, 0, 70, Math.PI * .72, Math.PI * 2.28); c.lineTo(22, 92); c.lineTo(-22, 92); c.closePath(); fill(c, S7.nav); c.beginPath(); c.arc(0, 0, 70, Math.PI * .72, Math.PI * 2.28); c.lineTo(22, 92); c.lineTo(-22, 92); c.closePath(); lnS(c, 6, S7.ln);
    for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-20, 100 + i * 12); c.lineTo(20, 100 + i * 12); lnS(c, 5, S7.ln) }
    c.beginPath(); c.moveTo(-14, 90); c.lineTo(-14, 20); c.quadraticCurveTo(0, -16, 14, 20); c.lineTo(14, 90); lnS(c, 5, lit > 0 ? mixc('#64748b', S7.red, lit) : '#64748b');
    if (lit > 0) for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .42, r0 = 92, r1 = 92 + 34 * lit + 6 * Math.sin(t * 8 + i); c.beginPath(); c.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); c.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); lnS(c, 5, S7.ln) }
    c.restore();
  }
  function flaskS7(c, x, y, k, lv, t) {   // круглая колба с золотой жидкостью и горелкой
    c.save(); c.translate(x, y);
    const R = lp(70, 108, k), nh = lp(92, 120, k), nw = lp(22, 26, k);
    c.save(); c.beginPath(); c.arc(0, 0, R, 0, TAU); c.clip(); const ly = lp(R, -R * .2, lv); c.beginPath(); c.moveTo(-R, R); for (let xx = -R; xx <= R; xx += 8) c.lineTo(xx, ly + Math.sin(xx * .06 + t * 4) * 6); c.lineTo(R, R); c.closePath(); fill(c, S7.gold); c.restore();
    c.beginPath(); c.arc(0, 0, R, Math.PI * .58 + .1 * (1 - k), Math.PI * 2.42 - .1 * (1 - k)); c.lineTo(nw, -R - nh + R * (1 - k) * 0 - 0); c.lineTo(-nw, -R - nh); c.closePath(); lnS(c, 6, S7.ln);
    // штатив и горелка
    if (k > .3) { const kk = at(k, .3, 1); c.beginPath(); c.moveTo(-R * .9, R + 10); c.lineTo(R * .9, R + 10); lnS(c, 5, S7.ln);
      c.save(); c.translate(0, R + 110); c.scale(kk, kk); rr(c, -46, 0, 92, 70, 10); fill(c, S7.nav); rr(c, -46, 0, 92, 70, 10); lnS(c, 5, S7.ln); c.fillStyle = S7.ln; c.fillRect(-46, 46, 92, 24);
        const fl = 1 + .14 * Math.sin(t * 19); c.save(); c.scale(1, fl); c.beginPath(); c.moveTo(0, -72); c.quadraticCurveTo(28, -24, 0, 0); c.quadraticCurveTo(-28, -24, 0, -72); fill(c, S7.red); c.beginPath(); c.moveTo(0, -42); c.quadraticCurveTo(13, -14, 0, 0); c.quadraticCurveTo(-13, -14, 0, -42); fill(c, '#fde68a'); c.restore(); c.restore() }
    c.restore();
  }
  const TUB7 = (() => { const P = [[360, 286], [360, 230], [720, 230], [720, 380]]; for (let i = 0; i <= 80; i++) { const u = i / 80; P.push([720 + Math.sin(u * 8 * Math.PI) * 70, 380 + u * 1070]) } P.push([720, 1500]); return P })();
  const TL7 = (() => { let L = 0; const D = [0]; for (let i = 1; i < TUB7.length; i++) { L += Math.hypot(TUB7[i][0] - TUB7[i - 1][0], TUB7[i][1] - TUB7[i - 1][1]); D.push(L) } return D })();
  function tubeS7(c, t, kd, kf) {
    const L = TL7[TL7.length - 1]; c.lineJoin = 'round'; c.lineCap = 'round';
    const path = () => { c.beginPath(); TUB7.forEach(([x, y], i) => c[i ? 'lineTo' : 'moveTo'](x, y)) };
    c.save(); path(); if (kd < 1) c.setLineDash([L * kd, L + 10]); lnS(c, 16, S7.ln); path(); if (kd < 1) c.setLineDash([L * kd, L + 10]); lnS(c, 8, S7.nav); c.restore();
    if (kf > 0) { c.save(); path(); c.setLineDash([60, 90]); c.lineDashOffset = -t * 420; const g = Math.min(L * kd, L * kf); c.restore(); c.save(); path(); c.setLineDash([60, 90]); c.lineDashOffset = -t * 420; c.beginPath(); TUB7.forEach(([x, y], i) => { if (TL7[i] <= g) c[i ? 'lineTo' : 'moveTo'](x, y) }); lnS(c, 8, S7.gold); c.restore() }
    rr(c, 696, 1490, 48, 40, 8); fill(c, S7.nav); rr(c, 696, 1490, 48, 40, 8); lnS(c, 5, S7.ln);
  }
  function vapeFillS7(c, x, yb, w, h, kf) {
    const top = yb - h; rr(c, x - w / 2, top, w, h, 28); fill(c, S7.nav);
    if (kf > 0) { c.save(); rr(c, x - w / 2, top, w, h, 28); c.clip(); c.fillStyle = S7.gold; c.fillRect(x - w / 2, yb - h * kf, w, h * kf); c.restore() }
    rr(c, x - w / 2, top, w, h, 28); lnS(c, 5, S7.ln); rr(c, x - w * .28, top - 54, w * .56, 60, 14); fill(c, S7.nav); rr(c, x - w * .28, top - 54, w * .56, 60, 14); lnS(c, 5, S7.ln);
  }
  function shopIntS7(c, t, kr) {   // интерьер магазина контуром (как у Starbucks) — темнеет в бордовый на «корпорации»
    c.fillStyle = mixc('#232741', '#2a0f1f', kr); c.fillRect(-300, -300, WW + 600, HH + 600);
    const lc = mixc('#3a3f62', '#4a1d30', kr);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) { const x = -40 + i * 300, y = 300 + r * 230; c.beginPath(); c.rect(x, y, 250, 170); lnS(c, 4, lc);
      for (let j = 0; j < 4; j++) { c.beginPath(); c.roundRect(x + 30 + j * 52, y + 70, 30, 76, 8); lnS(c, 3, lc) } }
    c.beginPath(); c.moveTo(-300, 1250); c.lineTo(WW + 300, 1250); lnS(c, 5, S7.ln);
  }
  function registerS7(c, t, disp) {   // касса контуром: корпус с косой заливкой, ступенька со щелью, табло на стойке
    const body = () => { c.beginPath(); c.moveTo(300, 1250); c.lineTo(780, 1250); c.lineTo(780, 1100); c.lineTo(740, 1020); c.lineTo(430, 1020); c.lineTo(430, 960); c.lineTo(300, 960); c.closePath() };
    body(); fill(c, '#2b2f4a'); c.save(); body(); c.clip(); c.beginPath(); c.moveTo(280, 960); c.lineTo(520, 960); c.bezierCurveTo(560, 1120, 700, 1180, 800, 1260); c.lineTo(280, 1260); c.closePath(); fill(c, '#4b3f8e'); c.restore(); body(); lnS(c, 6, S7.ln);
    for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++) { c.beginPath(); c.roundRect(470 + i * 56, 1040 + r * 44, 40, 30, 6); lnS(c, 4, S7.ln) }
    c.beginPath(); c.moveTo(310, 1180); c.lineTo(770, 1180); lnS(c, 4, S7.ln);
    c.beginPath(); c.moveTo(325, 960); c.lineTo(405, 960); lnS(c, 9, '#0b0f19');   // щель для чека
    c.beginPath(); c.moveTo(620, 1020); c.lineTo(620, 792); lnS(c, 8, S7.ln);
    rr(c, 430, 640, 380, 150, 8); fill(c, '#1b1f36'); c.save(); rr(c, 430, 640, 380, 150, 8); c.clip(); poly(c, [600, 640, 810, 640, 810, 710, 520, 790, 430, 790]); fill(c, 'rgba(255,255,255,.07)'); c.restore(); rr(c, 430, 640, 380, 150, 8); lnS(c, 6, S7.ln);
    disp(620, 715);
    vapeFillS7(c, 920, 1250, 96, 230, 1);
  }
  const recL7 = t => 600 * eio(at(t, K.market - .3, K.corp + .6));
  function receiptS7(c, t) {   // чек: лента ползёт вверх из щели, наверху загибается и волнами спускается слева
    const L = recL7(t); if (L <= 0) return; const x = 365, y0 = 960, Wd = 236, up = Math.min(L, 600);
    rr(c, x - Wd / 2, y0 - up, Wd, up, 4); fill(c, '#fafaf9'); c.beginPath(); c.moveTo(x - Wd / 2, y0); c.lineTo(x - Wd / 2, y0 - up); c.lineTo(x + Wd / 2, y0 - up); c.lineTo(x + Wd / 2, y0); lnS(c, 4, '#cbd5e1');
    const lines = [['ЧЕК · РЫНОК ОДНОРАЗОК', K.market - .2], ['VUSE GO — BAT', K.old - .1], ['NJOY — ALTRIA', K.corp - .2], ['(«МАЛЬБОРО»)', K.corp + .1]];
    lines.forEach(([s2, t0], i) => { if (t < t0) return; const d = i ? Math.min(up - 80, Math.min(L, 600) - Math.min(recL7(t0), 600) + 30) : up - 30; if (d < 16) return; tx(c, s2, x, y0 - d, { f: 'J', w: 700, s: i ? 24 : 21, c: '#1c1917', mw: Wd - 20 }) });
  }
  function shot7(c, t) {
    const kh = eio(at(t, K.s7 - .07, K.s7 + .73)), kq = eio(at(t, K.s7 - .1, K.s7 + .2));
    const kg = at(t, K.s7 + .7, K.tube - .1), lit = eo(at(t, K.tube - .05, K.tube + .25)), kw = eio(at(t, K.noleaf, K.leaf + .5));
    const kl = eio(at(t, K.when - .75, K.when + .05)), kfm = eio(at(t, K.when - .75, K.when - .2));
    const kd = at(t, K.when - .4, K.when + .3), kfl = at(t, K.when - .05, K.bill - .6);
    const P = 1100 * eio(at(t, K.when + .05, K.bill - .75));
    const wipe = at(t, K.bill - .36, K.bill - .04);
    // ---- лаборатория (до конца шторки) ----
    if (wipe < 1) {
      c.fillStyle = S7.nav; c.fillRect(0, 0, WW, HH);
      if (kh < 1) { c.save(); c.translate(0, -1920 * kh); blueprintBg(c, t, 1); c.restore() }
      c.save(); c.translate(0, -P);
      if (kl < 1) {
        c.save(); c.translate(0, 1380 * kl);
        const hy = lp(860, 1820, kh), R = lp(230, 720, kh);
        c.beginPath(); c.arc(540, hy, R, 0, TAU); fill(c, mixc('#f59e0b', '#f1f5f9', kh));
        if (kh > .5) { c.save(); c.beginPath(); c.arc(540, hy, R, 0, TAU); c.clip(); for (let a = -2.4; a < -.7; a += .045) for (let j = 0; j < 3; j++) { const rr2 = R - 14 - j * 18; circ(c, 540 + Math.cos(a) * rr2, hy + Math.sin(a) * rr2, 3.2 - j * .8, rgba(S7.nav, .35 * (1 - j / 3))) } c.restore() }
        if (kh < 1) { c.save(); c.translate(540, hy); c.scale(1 - kh, 1 - kh); capFace(c, 230); c.restore() }
        if (kq < 1) endFace(c, t, 1, kq, hy, true);
        if (kh >= 1) STEM.forEach((st, i) => {
          const kk = eo(at(kg, i * .08, .55 + i * .08)); if (kk <= 0) return;
          const by = domeY(st.x), top = by - st.h * kk, sway = Math.sin(t * 1.3 + i) * 8 * kk, droop = st.f === 'b' ? 0 : kw * 60 * (i < 2 ? -1 : 1);
          c.beginPath(); c.moveTo(st.x, by); c.quadraticCurveTo(st.x + (i % 2 ? 26 : -26), (by + top) / 2, st.x + sway + droop, top + kw * 30 * (st.f === 'b' ? 0 : 1)); lnS(c, 5, S7.ln);
          const fx = st.x + sway + droop, fy = top + kw * 30 * (st.f === 'b' ? 0 : 1), fk = spr(at(kg, .45 + i * .08, .8 + i * .08));
          if (st.f === 'r') poppyS7(c, fx, fy, fk, kw, t, i);
          else if (st.f === 'w') { c.save(); c.translate(fx, fy); c.scale(fk * (1 - kw * .6), fk * (1 - kw * .6)); c.beginPath(); c.ellipse(0, -8, 11, 15, 0, 0, TAU); fill(c, S7.ln); c.restore() }
        });
        c.restore();
      }
      // лампочка → колба на горелке; трубка, змеевик
      const bx = lp(540, 360, kfm), byy = lp(domeY(540) - STEM[2].h - 70, 470, kfm);
      if (kfm <= 0) { const kb = spr(at(kg, .5, .95)); if (kb > 0) bulbS7(c, 540, domeY(540) - STEM[2].h * eo(at(kg, .16, .71)) - 70 + 1380 * kl, kb, lit, t) }
      else { if (kd > 0) tubeS7(c, t, eo(kd), kfl); flaskS7(c, bx, byy, kfm, lp(.6, .25, kfl), t); if (kfm < .5) bulbS7(c, bx, byy, 1 - kfm * 2, lit, t) }
      const kpl = spr(at(t, K.tube + .2, K.tube + .7)) * (1 - eio(at(t, K.when - .5, K.when - .1))); if (kpl > 0) plate(c, 'СИНТЕТИЧЕСКИЙ НИКОТИН · БЕЗ ТАБАКА', 540, 232, kpl, { s: 30, bg: S7.gold, c: '#1c1917' });
      // капля из змеевика в одноразку, ряд наполняется
      const vf = at(t, K.bill - .75, K.bill - .55); if (vf > 0 && vf < 1) circ(c, 720, lp(1530, 1990, vf * vf), 14, S7.gold);
      if (P > 200) for (let k = -3; k <= 1; k++) { const x = 720 + k * 230, t0 = K.bill - .55 + (k === 0 ? 0 : (Math.abs(k) * .07 + .05)); vapeFillS7(c, x, 2440, 160, 400, eo(at(t, t0, t0 + .3))) }
      c.restore();
    }
    // ---- касса (#012): за красной диагональю ----
    if (wipe > 0) {
      const x0 = lp(-2300, 1300, wipe);
      c.save(); if (wipe < 1) { c.beginPath(); c.moveTo(-200, -200); c.lineTo(x0 + 700 + 110, -200); c.lineTo(x0 - 110, HH + 200); c.lineTo(-200, HH + 200); c.closePath(); c.clip() }
      const zk = eio(at(t, K.bill - .05, K.bill + .6)) * (1 - eio(at(t, K.market - .75, K.market - .15))), z = 1 + .75 * zk, kr = eio(at(t, K.corp - .3, K.corp + .4));
      c.translate(620, 715); c.rotate(-.07 * zk); c.scale(z, z); c.translate(-620, -715);
      shopIntS7(c, t, kr);
      receiptS7(c, t);
      registerS7(c, t, (x, y) => { const k = eio(at(t, K.bill - .1, K.bill + 1.0)), v = Math.round(3.2e9 * k / 1e6) * 1e6, s2 = '$' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        num(c, k >= 1 ? REGNUM : s2, x, y - 10, { f: 'J', w: 700, s: 50, c: '#f59e0b' }); tx(c, 'ОДНОРАЗКИ · США · ГОД', x, y + 44, { f: 'O', w: 500, s: 20, c: '#fdba74', ls: 3 }) });
      const kc = spr(at(t, K.corp + .1, K.corp + .5)); if (kc > 0 && t < K.s8 - .57) { const cy = lp(1020, 850, kc); circ(c, 540, cy, 36, '#f59e0b'); ring(c, 540, cy, 27, '#b45309', 4) }
      c.restore();
      if (wipe < 1) { c.beginPath(); c.moveTo(x0 - 110, HH + 200); c.lineTo(x0 + 700 + 110, -200); c.lineTo(x0 + 700 + 110 + 900, -200); c.lineTo(x0 - 110 + 900, HH + 200); c.closePath(); fill(c, S7.red) }
    }
  }
