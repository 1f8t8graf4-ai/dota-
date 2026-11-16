  // ================= СЦЕНА 2 (v18.4): витрина как у Apple #042 → колодка и косое лезвие как у Хованского #127 =================
  // 9.0–9.8: камера ныряет в левую витрину магазина (линии не толстеют, у коробок проявляются детали);
  // 9.9–11.0: едет вдоль полок вправо, мимо простенка, стекло бликует полосами; снизу въезжает красная плашка «ЗАКОН О ВКУСАХ» и пустая клетка с курсором;
  // 11.9–12.7: наезд в значок-снежинку на одноразке — внутри него уже круги зала FDA (как мишень);
  // зал: сливовый фон, круги с печатью, колодка с дырами, 4 картриджа впрыгивают, сбоку серые «разрешённые»;
  // «рубят» — лезвие падает, верхушки улетают, сок брызгает короной и каплями; камера отъезжает — видна рама с лампой.
  const S2 = { bg: '#2b2430', d1: '#312a36', d2: '#383040', d3: '#2f2834', d4: '#3b3343', ln: '#f3e6dc', dim: '#5a4d5f', red: '#e8445a', hole: '#211b25', plate: '#433a49' };
  const pulse2 = (t, a) => at(t, a - .1, a + .05) * (1 - at(t, a + .5, a + .8));
  // ---------- витрина: где окна магазина сцены 1 на экране ----------
  function s1Scr(t, x, y) { const s = 1 + .06 * eio(at(t, K.morph0 + 1.2, K.train1)); const X = 540 + (x - 540) * S1.z, Y = 990 + (y - 990) * S1.z; return [540 + (X - 540) * s, 980 + (Y - 980) * s, S1.z * s] }
  const WIN = { y: 1032.5, h: 235, x0: 350, x1: 540 };   // центры левой и средней витрины (мир сцены 1)
  const EMB = { x: 460 + 22 + 38.667, y: 997 - 27, r: 6.5 };   // значок на 2-й одноразке верхней полки средней витрины
  const ZF = 5.9;
  function boxLOD(c, k, idx) {   // детали одноразки в витрине: мундштук, косая полоса, значок-снежинка
    const e = bo(k); if (e <= 0) return;
    c.save(); c.translate(0, -50); c.scale(e, e); poly(c, [-6.5, 0, -4.5, -8, 4.5, -8, 6.5, 0]); fill(c, '#1f1a24'); poly(c, [-6.5, 0, -4.5, -8, 4.5, -8, 6.5, 0]); lnS(c, 2); c.restore();
    c.save(); rr(c, -11, -50, 22, 50, 7); c.clip(); c.translate(0, -25); c.scale(e, e);
    c.beginPath(); c.moveTo(-12, 13); c.bezierCurveTo(-4, 6, 4, -8, 12, -14); c.lineTo(12, -6); c.bezierCurveTo(4, 0, -4, 14, -12, 22); c.closePath(); fill(c, 'rgba(255,255,255,.22)'); c.restore();
    c.save(); c.translate(0, -27); c.scale(e, e); circ(c, 0, 0, EMB.r, S2.bg); c.beginPath(); c.arc(0, 0, EMB.r, 0, TAU); lnS(c, 1.6);
    c.beginPath(); for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3; c.moveTo(Math.cos(a) * 3.6, Math.sin(a) * 3.6); c.lineTo(-Math.cos(a) * 3.6, -Math.sin(a) * 3.6) } lnS(c, 1.1, '#5eead4'); c.restore();
  }
  function camA(t) {   // камера витрины: экран = P + Z·(p − F) в координатах кадра сцены 1
    const k1 = at(t, K.train0, K.train0 + .8), k2 = eio(at(t, K.train0 + .85, K.train0 + 1.95));
    const W0 = s1Scr(t, WIN.x0, WIN.y), W1 = s1Scr(t, WIN.x1, WIN.y);
    const Z = Math.exp(lp(0, Math.log(ZF), eio(k1))), F = [lp(W0[0], W1[0], k2), lp(W0[1], W1[1], k2)];
    const P = [lp(F[0], 540, eio(k1)), lp(F[1], 980, eio(k1))];
    return { Z, F, P, k1, k2 };
  }
  function glassS2(c, t, k2) {   // блики стекла как у Apple: косые полосы едут быстрее камеры
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = 0; i < 4; i++) { const x0 = 300 + i * 620 - k2 * 2600, w = 70 + (i % 2) * 110; poly(c, [x0, -50, x0 + w, -50, x0 + w - 700, HH + 50, x0 - 700, HH + 50]); fill(c, 'rgba(255,255,255,.055)') }
    c.restore();
  }
  function lawPlateS2(c, t, k2) {   // красная плашка закона и пустая клетка с курсором — въезжает справа вместе с полкой
    const dx = (1 - k2) * 1600, y = 1425; if (dx > 1500) return;
    c.save(); c.translate(dx, 0);
    rr(c, 40, y - 54, 580, 108, 16); fill(c, S2.red); tx(c, 'ЗАКОН О ВКУСАХ', 330, y + 3, { f: 'U', w: 800, s: 44, c: '#fff', mw: 530 });
    c.beginPath(); c.roundRect(650, y - 54, 390, 108, 16); c.setLineDash([16, 12]); c.lineDashOffset = -t * 20; lnS(c, 5, '#f1f5f9'); c.setLineDash([]);
    const kc = at(t, K.law - .85, K.law - .7); if (kc > 0 && Math.floor((t - K.law) * 2.6) % 2 === 0) { c.fillStyle = '#5eead4'; c.fillRect(684, y - 34, 9, 68) }
    const kq = spr(at(t, K.law + .05, K.law + .45)); if (kq > 0) { c.save(); c.translate(845, y + 4); c.scale(kq, kq); tx(c, '?', 0, 0, { f: 'U', w: 800, s: 66, c: '#5eead4' }); c.restore() }
    c.restore();
  }
  // ---------- зал FDA (мир со своей камерой; круги — в точке 540, 1000) ----------
  const HOL = [{ x: 285, col: '#f97316', n: 'МАНГО' }, { x: 455, col: '#ec4899', n: 'ФРУКТЫ' }, { x: 625, col: '#eab308', n: 'ДЕСЕРТ' }, { x: 795, col: '#10b981', n: 'МЯТА' }];
  const SIDE = [{ x: 115, n: 'ТАБАК' }, { x: 965, n: 'МЕНТОЛ' }];
  const PLK = 1000, BL = { YE: 900, SL: .16, x0: 190, x1: 890 };
  const yEdge = x => BL.YE + (x - 540) * BL.SL;
  const TC = () => K.chop;   // удар
  const holeT = i => K.jan + .75 + i * .12, cartT2 = i => Wd('после') + .05 + i * .25, sideT = i => Wd('власти') + .05 + i * .2;
  function sealS2(c, t) {   // печать FDA по кругу: буквы проступают по очереди, круг медленно вращается
    const S = 'FDA · 2 ЯНВАРЯ 2020 · ЗАПРЕТ ВКУСОВ · МИНЗДРАВ США · ', n = S.length * 2, k = at(t, K.jan + .1, K.jan + 1.5);
    c.save(); c.translate(540, PLK); c.rotate(-1.15 + t * .035);
    for (let i = 0; i < n * k; i++) { c.save(); c.rotate(i * TAU / n); tx(c, S[i % S.length], 0, -735, { f: 'O', w: 700, s: 34, c: S2.dim }); c.restore() }
    c.restore();
  }
  function ringsS2(c, t) {
    c.fillStyle = S2.bg; c.fillRect(-1500, -1500, WW + 3000, HH + 3000);
    circ(c, 540, PLK, 860, S2.d1); circ(c, 540, PLK, 640, S2.bg); circ(c, 540, PLK, 600, S2.d2); circ(c, 540, PLK, 420, S2.d3); circ(c, 540, PLK, 230, S2.d4); circ(c, 540, PLK, 9, '#1d1820');
    sealS2(c, t);
  }
  function holeS2(c, x, r, k) {   // круглая пластина колодки с болтами
    if (k <= 0) return; c.save(); c.translate(x, PLK); c.scale(k, k);
    circ(c, 0, 0, r, S2.plate); c.beginPath(); c.arc(0, 0, r, 0, TAU); lnS(c, 4, S2.ln); circ(c, 0, 0, r * .7, S2.hole);
    for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + .5; circ(c, Math.cos(a) * r * .86, Math.sin(a) * r * .86, 3.5, S2.ln) }
    c.restore();
  }
  function cartS2(c, x, col, w, h, o = {}) {   // картридж контуром: мундштук, тёмный корпус, косая заливка вкуса; o.part: 1 — низ под лезвием, 2 — верх
    const top = PLK + 50 - h, mh = h * .22, bt = top + mh;
    c.save();
    if (o.part) { c.beginPath(); if (o.part === 1) { c.moveTo(x - 80, yEdge(x - 80)); c.lineTo(x + 80, yEdge(x + 80)); c.lineTo(x + 80, PLK + 200); c.lineTo(x - 80, PLK + 200) } else { c.moveTo(x - 80, yEdge(x - 80)); c.lineTo(x + 80, yEdge(x + 80)); c.lineTo(x + 80, top - 100); c.lineTo(x - 80, top - 100) } c.closePath(); c.clip() }
    poly(c, [x - w * .36, bt, x - w * .28, top, x + w * .28, top, x + w * .36, bt]); fill(c, '#1f1a24'); poly(c, [x - w * .36, bt, x - w * .28, top, x + w * .28, top, x + w * .36, bt]); lnS(c, 4, S2.ln);
    rr(c, x - w / 2, bt, w, PLK + 50 - bt, w * .16); fill(c, '#241e28');
    c.save(); rr(c, x - w / 2, bt, w, PLK + 50 - bt, w * .16); c.clip(); const B = PLK + 50, H2 = B - bt;
    c.beginPath(); c.moveTo(x - w / 2 - 4, bt + H2 * .5); c.bezierCurveTo(x - w * .1, bt + H2 * .42, x + w * .2, bt + H2 * .2, x + w / 2 + 4, bt + H2 * .08); c.lineTo(x + w / 2 + 4, B + 4); c.lineTo(x - w / 2 - 4, B + 4); c.closePath(); fill(c, col);
    c.fillStyle = 'rgba(255,255,255,.28)'; c.fillRect(x - w / 2 + 12, bt + 14, 8, H2 * .4); c.restore();
    rr(c, x - w / 2, bt, w, PLK + 50 - bt, w * .16); lnS(c, 4, S2.ln);
    c.restore();
    if (o.part === 1 && o.cutCol) { c.beginPath(); c.moveTo(x - w / 2 + 3, yEdge(x - w / 2 + 3)); c.lineTo(x + w / 2 - 3, yEdge(x + w / 2 - 3)); lnS(c, 7, o.cutCol) }
  }
  function checkS2(c, x, y, k) { if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k); circ(c, 0, 0, 24, '#22c55e'); c.beginPath(); c.moveTo(-10, 1); c.lineTo(-3, 9); c.lineTo(11, -8); lnS(c, 5, '#fff'); c.restore() }
  function bladeS2(c, t, dy) {   // широкое лезвие между рельсами: низ косой, надпись по скосу
    const L = BL.x0 + 6, R = BL.x1 - 6, e = x => yEdge(x) + dy, b = x => e(x) - 250;
    poly(c, [L, b(L), R, b(R), R, e(R), L, e(L)]); fill(c, S2.plate);
    poly(c, [L, e(L) - 30, R, e(R) - 30, R, e(R), L, e(L)]); fill(c, '#5a4f62');
    c.beginPath(); c.moveTo(L, e(L) - 30); c.lineTo(R, e(R) - 30); lnS(c, 2.5, S2.ln);
    poly(c, [L, b(L), R, b(R), R, e(R), L, e(L)]); lnS(c, 4, S2.ln);
    c.save(); c.translate(540, e(540) - 130); c.rotate(Math.atan(BL.SL)); tx(c, 'ЗАПРЕТ ВКУСОВ', 0, 0, { f: 'U', w: 800, s: 50, c: S2.red, ls: 2 }); c.restore();
    circ(c, 540, b(540) + 26, 12, S2.hole); c.beginPath(); c.arc(540, b(540) + 26, 12, 0, TAU); lnS(c, 3, S2.ln);
  }
  function frameS2(c, t, k) {   // рама: рельсы, перекладина с печатью FDA, лампа на шнуре; рисуется линиями при отъезде
    if (k <= 0) return;
    c.save(); c.fillStyle = S2.plate; [BL.x0, BL.x1].forEach(x => c.fillRect(x - 12, 432, 24, 898 * eo(k))); c.restore();
    c.save(); dashDraw(c, k, 1100);
    [BL.x0, BL.x1].forEach(x => { c.beginPath(); c.moveTo(x - 14, 1330); c.lineTo(x - 14, 430); c.moveTo(x + 14, 1330); c.lineTo(x + 14, 430); lnS(c, 4, S2.ln) });
    c.beginPath(); c.moveTo(130, 380); c.lineTo(950, 380); c.lineTo(950, 432); c.lineTo(130, 432); c.closePath(); lnS(c, 4, S2.ln);
    c.beginPath(); c.moveTo(-300, 1330); c.lineTo(1380, 1330); lnS(c, 4, S2.ln);
    c.beginPath(); c.moveTo(540, -400); c.lineTo(540, 250); lnS(c, 3, S2.ln);
    c.restore();
    const kp = bo(at(k, .4, 1)); if (kp > 0) {
      c.save(); c.translate(540, 250); c.scale(kp, kp); c.beginPath(); c.arc(0, 36, 40, Math.PI, 0); c.closePath(); fill(c, S2.plate); c.beginPath(); c.arc(0, 36, 40, Math.PI, 0); c.closePath(); lnS(c, 4, S2.ln); circ(c, 0, 40, 9, '#fde68a'); c.restore();
      poly(c, [540 - 26, 290, 540 + 26, 290, 540 + 170, 382, 540 - 170, 382]); fill(c, rgba('#fde68a', .1 * kp));
      c.save(); c.translate(540, 406); c.scale(kp, kp); circ(c, 0, 0, 40, '#d4a017'); c.beginPath(); c.arc(0, 0, 40, 0, TAU); lnS(c, 4, S2.ln); tx(c, 'FDA', 0, 2, { f: 'U', w: 800, s: 24, c: '#3b2a05' }); c.restore();
    }
  }
  function splashS2(c, t, x, col, i) {   // сок из среза: корона с каплями, потом шапочка и подтёки
    const u = t - TC() - i * .03; if (u <= 0) return;
    const yc = yEdge(x), Hj = 165 * (1 - Math.exp(-13 * u)) * Math.exp(-1.25 * u) + 16 + 4 * Math.sin(t * 5 + i);
    c.beginPath(); c.moveTo(x - 38, yc + 8);
    for (let k = 0; k <= 6; k++) { const px = x - 34 + k * 11.3, top = yc - Hj * (.55 + .45 * H1(i * 7 + k)) - 7 * Math.sin(t * 9 + k * 1.7); c.lineTo(px, top + (k % 2 ? 10 : 0)) }
    c.lineTo(x + 38, yc + 8); c.closePath(); fill(c, col);
    for (let j = 0; j < 7; j++) {   // капли
      const vy = -(520 + 340 * H1(i * 11 + j)), vx = (H1(i * 13 + j) - .5) * 300, ua = u - j * .02, px = x + vx * ua, py = yc - 30 + vy * ua + 1100 * ua * ua;
      if (ua > 0 && py < yc + 20 && ua < 1.5) circ(c, px, py, 7 + 6 * H1(i * 3 + j), col);
    }
    [-24, 6, 28].forEach((dx, j) => { const L = Math.min(70 + 40 * H1(i * 5 + j), 30 + 160 * u); rr(c, x + dx - 5, yc, 10, L, 5); fill(c, col); const ph = ((t * .8 + H1(i * 9 + j)) % 1); if (L > 60) circ(c, x + dx, yc + L + ph * ph * 120, 6, col) });
  }
  function flyTops(c, t) {   // отрубленные верхушки улетают в стороны и падают за кадр
    const u = t - TC(); if (u <= 0 || u > 1.6) return;
    HOL.forEach((p, i) => {
      const dir = i < 2 ? -1 : 1, vx = dir * (260 + 110 * (i % 2 ? 0 : 1)), dx = vx * u, dy = -380 * u + 1500 * u * u, cx = p.x, cy = yEdge(p.x) - 70;
      if (cy + dy > 2200) return;
      c.save(); c.translate(cx + dx, cy + dy); c.rotate(dir * u * (4 + i)); c.translate(-cx, -cy); cartS2(c, p.x, p.col, 92, 250, { part: 2 }); c.restore();
    });
  }
  function hallCam(t) {   // камера зала: крупно 1,45 → на «власти США» 1,0 (видны серые сбоку) → после удара 0,95 и вверх к раме
    const k1 = eio(at(t, Wd('власти') - .1, Wd('власти') + .6)), k = eio(at(t, TC() + .55, TC() + 1.35));
    return { z: lp(lp(1.45, 1, k1), .95, k), wy: lp(PLK, 905, k), sy: lp(PLK, 960, k), k };
  }
  function hallShot(c, t) {   // зал FDA целиком (его же рисует сцена 3 под свитком)
    const cm = hallCam(t), sh = t > TC() && t < TC() + .5 ? Math.sin((t - TC()) * 70) * 9 * (1 - at(t, TC(), TC() + .5)) : 0;
    c.save(); c.translate(540 + sh, cm.sy); c.scale(cm.z, cm.z); c.translate(-540, -cm.wy);
    ringsS2(c, t);
    c.save(); dashDraw(c, at(t, K.jan + .55, K.jan + 1.1), 700); c.beginPath(); c.moveTo(540, PLK - 8); c.lineTo(-300, PLK - 8); c.moveTo(540, PLK + 8); c.lineTo(-300, PLK + 8); c.moveTo(540, PLK - 8); c.lineTo(1380, PLK - 8); c.moveTo(540, PLK + 8); c.lineTo(1380, PLK + 8); lnS(c, 4, S2.ln); c.restore();
    frameS2(c, t, at(t, TC() + .6, TC() + 1.4));
    HOL.forEach((p, i) => holeS2(c, p.x, 76, spr(at(t, holeT(i), holeT(i) + .45))));
    SIDE.forEach((p, i) => holeS2(c, p.x, 52, spr(at(t, sideT(i) - .1, sideT(i) + .35))));
    SIDE.forEach((p, i) => { const k = spr(at(t, sideT(i), sideT(i) + .45)); if (k <= 0) return; c.save(); c.translate(p.x, PLK); c.scale(k, k); c.translate(-p.x, -PLK); cartS2(c, p.x, '#94a3b8', 64, 170); c.restore();
      checkS2(c, p.x, PLK - 170, spr(at(t, sideT(i) + .3, sideT(i) + .7))); tx(c, p.n, p.x, PLK + 86, { f: 'O', w: 700, s: 26, c: S2.ln, ls: 2, a: k }) });
    const cut = t >= TC(), dropY = cut ? 0 : -950 * (1 - ei(at(t, TC() - .17, TC())));
    HOL.forEach((p, i) => {
      const k = spr(at(t, cartT2(i), cartT2(i) + .5)); if (k <= 0) return;
      c.save(); c.translate(p.x, PLK); c.scale(k, k); c.translate(-p.x, -PLK); cartS2(c, p.x, p.col, 92, 250, cut ? { part: 1, cutCol: p.col } : {}); c.restore();
      const hl = pulse2(t, [K.mango, K.fru, K.des, K.mint][i]), on = Math.max(hl, t > [K.mango, K.fru, K.des, K.mint][i] + .5 ? 1 : 0);
      c.save(); c.translate(p.x, PLK + 112); c.scale(k * (1 + .25 * hl), k * (1 + .25 * hl));
      if (on > 0) { const w = tw(c, p.n, { f: 'O', w: 700, s: 28, ls: 2 }) + 30; rr(c, -w / 2, -24, w, 48, 12); fill(c, p.col) }
      tx(c, p.n, 0, 2, { f: 'O', w: 700, s: 28, c: on > 0 ? '#1d1820' : S2.ln, ls: 2 }); c.restore();
    });
    if (t > TC() - .2) { if (cm.k > 0) { c.save(); dashDraw(c, cm.k, 700); c.beginPath(); c.moveTo(540, yEdge(540) - 250 + dropY); c.lineTo(540, 432); lnS(c, 3, S2.ln); c.restore() } bladeS2(c, t, dropY) }
    if (cut) HOL.forEach((p, i) => splashS2(c, t, p.x, p.col, i));
    flyTops(c, t);
    c.restore();
  }
  // ---------- кадр сцены 2 ----------
  function shot2(c, t) {
    const k3 = at(t, K.jan - .25, K.jan + .55);
    if (k3 >= 1) { hallShot(c, t); return }
    const A = camA(t);
    let Z = A.Z, F = A.F, P = A.P;
    const E = s1Scr(t, EMB.x, EMB.y), Re = EMB.r * E[2];
    if (k3 > 0) {   // наезд в значок: значок едет в точку 540, 1000 и растёт до 1150 px
      const E0 = [P[0] + Z * (E[0] - F[0]), P[1] + Z * (E[1] - F[1])], Ze = 1150 / Re, Z0 = Z;
      Z = Math.exp(lp(Math.log(Z0), Math.log(Ze), ei(k3) * .55 + eio(k3) * .45)); F = E; P = [lp(E0[0], 540, eio(k3)), lp(E0[1], PLK, eio(k3))];
    }
    LWK = 1 / Math.pow(Z, .8); LOD = at(Z, 1.8, 4.2);
    c.save(); c.translate(P[0], P[1]); c.scale(Z, Z); c.translate(-F[0], -F[1]); shot1(c, t); c.restore();
    LWK = 1; LOD = 0;
    if (k3 <= 0) { glassS2(c, t, A.k2); lawPlateS2(c, t, A.k2) }
    else {   // портал: внутри значка — зал FDA целиком, масштаб — по радиусу значка
      const R = Re * Z, cx = P[0], cy = P[1], m = R / 1150;
      c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip(); c.translate(cx, cy); c.scale(m, m); c.translate(-540, -PLK); hallShot(c, t); c.restore();
      c.beginPath(); c.arc(cx, cy, R, 0, TAU); lnS(c, 5, S2.ln);
      const kp = 1 - at(t, K.jan - .25, K.jan + .15); if (kp > 0) lawPlateS2(c, t, 1 + (1 - kp) * .6);
    }
  }
