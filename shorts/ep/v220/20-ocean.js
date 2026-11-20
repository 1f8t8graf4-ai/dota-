  // ================= мир 0: ночной океан у берега США (строки 16–17 главы 4: b1, b2) =================
  // Кадр 0 (шортс и фильм после нырка в фото карточки 2022): крупная белая баночка уже качается на волне на переднем плане, позади — огни берега
  // и опущенный красный шлагбаум, на нём висит ценник Philip Morris. «через» — плашка 2022; «запрета» — шлагбаум поднимается, волна выносит баночку
  // на мокрый песок; «шестнадцать» — ценник ложится на баночку, барабан до $16 МЛРД. b2: баночка поворачивается крышкой к нам, крышка откидывается —
  // белые подушечки по кругу; над ними лист табака перечёркнут, «БЕЗ ТАБАКА». Стык с офисом — подушечка вылетает к камере и становится столешницей.
  let T0 = null, K0 = null;
  function oceanInit() {
    T0 = { fil: Ws('b1', 'филип'), cher: Ws('b1', 'через'), zap: Ws('b1', 'запрета'), mal: Ws('b1', 'маленькой'), shest: Ws('b1', 'шестнадцать'), mlrd: WsB('b1', 'миллиардов'),
      net: Ws('b2', 'нет'), dazhe: Ws('b2', 'даже'), tab: Ws('b2', 'табака'), tabB: WsB('b2', 'табака'), s1: SA('s1') };
    const a = T0; T0.fly = a.tabB + .05; T0.sw = SA('s1') - .25;   // подушечка летит к камере · смена фона
    K0 = [KY(MODE === 'y' ? 1.15 : 0, 540, 960, 1.0), KY(a.zap - .4, 548, 940, 1.1), KY(a.mlrd, 560, 1010, 1.26), KY(a.dazhe, 548, 1060, 1.42), KY(a.fly + .1, 540, 1110, 1.62)];
  }
  // баночка 2.5D: центр крышки (x, y), радиус R, ty — насколько видна крышка (0 — сбоку, 1 — сверху), lid 0..1 — крышка откидывается назад;
  // o.cap — цвет крышки (вкусы), o.name — надпись на крышке, o.dark — тёмная банка SNUS, o.label — бумажная наклейка на боку, o.h — высота бока
  function tin5(c, x, y, R, ty, lid = 0, o = {}) {
    const hS = R * (o.h ?? .42) * Math.sqrt(Math.max(0, 1 - ty * ty)) + R * .06, body = o.dark ? C5.snusD : C5.tin, side = o.dark ? '#3A322C' : C5.tinS, capC = o.cap || (o.dark ? '#4A3F37' : C5.lid);
    if (o.shadow !== false) { c.beginPath(); c.ellipse(x + R * .3, y + hS + R * ty * .55, R * 1.08, R * ty * .5 + 6, 0, 0, TAU); fill(c, o.shc || 'rgba(6,10,30,.32)') }
    c.beginPath(); c.moveTo(x - R, y); c.lineTo(x - R, y + hS); c.ellipse(x, y + hS, R, R * ty, 0, Math.PI, 0, true); c.lineTo(x + R, y); c.closePath(); fill(c, body);
    c.save(); c.clip(); c.fillStyle = side; c.fillRect(x + R * .38, y - 4, R * .7, hS + R * ty + 8); c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(x - R * .78, y + 4, R * .1, hS + R * ty * .5);
    if (o.band) { c.fillStyle = o.band; c.fillRect(x - R, y + hS * .18, R * 2, Math.max(3, hS * .16)) }
    if (o.label) { rr(c, x - R * .55, y + hS * .2, R * 1.1, hS * .62, 4); fill(c, '#F7F1E1'); tx(c, o.label, x, y + hS * .52, { f: 'U', w: 800, s: Math.max(10, hS * .42), c: '#3A2A1A', ls: 2 }) }
    c.restore();
    c.beginPath(); c.moveTo(x - R, y); c.lineTo(x - R, y + hS); c.ellipse(x, y + hS, R, R * ty, 0, Math.PI, 0, true); c.lineTo(x + R, y); lnB(c, 2, 'rgba(238,241,248,.55)');
    const top = () => { c.beginPath(); c.ellipse(x, y, R, Math.max(.5, R * ty), 0, 0, TAU) };
    if (lid < 1) {   // крышка на месте (или ещё не ушла)
      if (lid <= 0) { top(); fill(c, capC); c.save(); top(); c.clip(); c.fillStyle = o.dark ? 'rgba(0,0,0,.25)' : 'rgba(30,40,70,.08)'; c.fillRect(x + R * .3, y - R, R, R * 2); c.restore();
        c.beginPath(); c.ellipse(x, y, R * .8, R * ty * .8, 0, 0, TAU); lnB(c, 2, o.dark ? 'rgba(255,255,255,.25)' : 'rgba(120,128,145,.5)');
        if (o.name) { c.save(); c.translate(x, y); c.scale(1, Math.max(.05, ty)); tx(c, o.name, 0, 4, { f: 'M', w: 800, s: R * .42, c: o.nameC || (o.dark ? '#E8D9B8' : '#1F2A44'), ls: 4 }); c.restore() }
        top(); lnB(c, 2.2, 'rgba(20,23,51,.35)'); return }
    }
    // открыта: внутри дно и подушечки по кругу
    top(); fill(c, o.dark ? '#1C1714' : '#D9DCE3');
    c.beginPath(); c.ellipse(x, y, R * .94, R * ty * .94, 0, 0, TAU); fill(c, o.dark ? '#2A221D' : '#E3E5EB');
    const n = o.n ?? 9, skip = o.skip ?? -1;
    for (let k = 0; k < n; k++) { if (k === skip) continue; const al = Math.PI / 2 + k * TAU / n, px = x + Math.cos(al) * R * .56, py = y + Math.sin(al) * R * .56 * ty;
      c.save(); c.translate(px, py); c.scale(1, Math.max(.08, ty)); c.rotate(al + Math.PI / 2);
      rr(c, -R * .2, -R * .13, R * .4, R * .26, R * .1); fill(c, o.dark ? C5.snusB : C5.pouch); c.fillStyle = o.dark ? 'rgba(0,0,0,.25)' : 'rgba(170,160,140,.35)'; c.fillRect(-R * .2, R * .03, R * .4, R * .1);
      if (o.dots && !o.dark) for (let j = 0; j < 3; j++) circ(c, -R * .1 + j * R * .1, -R * .02, R * .025 * o.dots, C5.nic);
      c.restore() }
    if (lid < 1) { const ly = y - R * ty * lp(0, 1.15, lid), lry = R * ty * lp(1, .3, lid); c.beginPath(); c.ellipse(x, ly, R * 1.01, Math.max(.5, lry), 0, 0, TAU); fill(c, capC); lnB(c, 1.6, 'rgba(20,23,51,.3)') }
    else { c.beginPath(); c.ellipse(x, y - R * ty * 1.15, R * 1.01, R * ty * .3, 0, Math.PI, TAU); fill(c, capC); lnB(c, 1.6, 'rgba(20,23,51,.3)') }
  }
  // ценник: бирка на нитке, барабан внизу
  function priceTag(c, x, y, s, k, drum) {
    c.save(); c.translate(x, y); c.scale(s, s);
    poly(c, [-150, -46, 120, -46, 160, 0, 120, 46, -150, 46]); fill(c, 'rgba(0,0,0,.25)');
    c.translate(-6, -8); poly(c, [-150, -46, 120, -46, 160, 0, 120, 46, -150, 46]); fill(c, '#F4EAD4'); poly(c, [-150, -46, 120, -46, 160, 0, 120, 46, -150, 46]); lnB(c, 3, '#3A2A1A');
    circ(c, 124, 0, 9, '#3A2A1A'); circ(c, 124, 0, 5, '#F4EAD4');
    tx(c, OBJ.pm, -14, -14, { f: 'P', w: 700, st: 'italic', s: 30, c: '#3A2A1A' });
    if (drum > 0) { const v = Math.round(lp(1, 16, eo(drum))); num(c, TEXT.fPrice(v), -14, 22, { f: 'M', w: 800, s: 30, c: '#B3352B' }) }
    else tx(c, '$ —', -14, 22, { f: 'M', w: 800, s: 30, c: 'rgba(58,42,26,.4)' });
    c.restore();
  }
  function oceanSky(c, t) {
    vgrad(c, -600, -900, 2300, 1720, [C5.sky0, C5.sky1, C5.sky2]);
    for (let i = 0; i < 70; i++) { const x = -400 + H1(i * 3.1) * 1900, y = -700 + H1(i * 5.7) * 1380, a = .35 + .5 * Math.abs(Math.sin(t * (.8 + H1(i)) + i)); circ(c, x, y, 1.6 + H1(i * 9) * 1.8, `rgba(255,248,225,${a})`) }
    glow(c, 820, 330, 260, '#F4EBD0', .22); circ(c, 820, 330, 70, C5.moon); circ(c, 800, 312, 70, 'rgba(255,255,255,.18)'); circ(c, 842, 352, 14, 'rgba(160,150,120,.25)'); circ(c, 800, 360, 9, 'rgba(160,150,120,.22)');
  }
  function oceanShore(c, t) {   // огни берега США на горизонте (y 790)
    c.fillStyle = C5.shore; c.beginPath(); c.moveTo(-600, 820); for (let x = -600; x <= 1700; x += 60) c.lineTo(x, 800 - (H1(x * .13) > .55 ? 30 + H1(x * .37) * 60 : 6 + H1(x) * 10)); c.lineTo(1700, 840); c.lineTo(-600, 840); c.closePath(); c.fill();
    for (let i = 0; i < 90; i++) { const x = -560 + H1(i * 2.3) * 2200, y = 778 + H1(i * 4.1) * 36, a = .55 + .45 * Math.sin(t * 2 + i * 1.7); circ(c, x, y, 2 + H1(i * 7) * 2, `rgba(255,210,122,${a})`) }
    glow(c, 540, 800, 900, '#FFD27A', .05);
  }
  function barrier(c, x, y, s, up) {   // шлагбаум на берегу: стойка и полосатая стрела, up 0..1 — поднят
    c.save(); c.translate(x, y); c.scale(s, s);
    rr(c, -14, -70, 28, 120, 6); fill(c, '#2A2F4A'); rr(c, -22, 40, 44, 16, 4); fill(c, '#1D2138');
    c.save(); c.translate(0, -56); c.rotate(-Math.PI / 2 * .92 * up); const L = 420;
    rr(c, -L, -11, L, 22, 8); fill(c, '#F2EEE6'); c.save(); rr(c, -L, -11, L, 22, 8); c.clip(); for (let i = 0; i < 7; i++) { c.fillStyle = '#D6334D'; c.fillRect(-L + i * 60, -11, 30, 22) } c.restore();
    rr(c, -L, -11, L, 22, 8); lnB(c, 2, 'rgba(20,23,51,.5)'); circ(c, -L + 14, 18, 6, '#D6334D');
    c.restore(); circ(c, 0, -56, 12, '#F2EEE6'); circ(c, 0, -56, 5, '#2A2F4A'); c.restore();
  }
  function seaRows(c, t, y0, y1, n, zone) {   // волны рядами: дальние светлее и мельче
    for (let i = 0; i < n; i++) { const u = i / (n - 1), y = lp(y0, y1, Math.pow(u, 1.6)), A = lp(4, 26, u), Lw = lp(60, 260, u), sp = lp(.6, 1.6, u), col = mixc(C5.sea2, C5.sea0, u);
      c.beginPath(); c.moveTo(-700, y + 400); for (let x = -700; x <= 1800; x += 20) c.lineTo(x, y + A * Math.sin(x / Lw * TAU * .5 + t * sp + i * 1.3)); c.lineTo(1800, y + 400); c.closePath(); fill(c, col);
      c.beginPath(); for (let x = -700; x <= 1800; x += 20) { const yy = y + A * Math.sin(x / Lw * TAU * .5 + t * sp + i * 1.3); x === -700 ? c.moveTo(x, yy) : c.lineTo(x, yy) } lnB(c, lp(1.2, 3, u), `rgba(201,220,242,${lp(.18, .45, u)})`);
      if (zone && u > .2) for (let j = 0; j < 6; j++) { const x = 820 + (H1(i * 7 + j) - .5) * lp(40, 220, u), w = lp(10, 46, u); c.fillStyle = `rgba(255,236,190,${.25 + .35 * Math.abs(Math.sin(t * 3 + i + j))})`; c.fillRect(x - w / 2, y - 2, w, 3) } }
  }
  function sand(c, t, k) {   // мокрый песок поднимается снизу, пена кромкой
    if (k <= 0) return; const y = lp(2100, 1330, eio(k));
    c.beginPath(); c.moveTo(-700, y); for (let x = -700; x <= 1800; x += 30) c.lineTo(x, y + 18 * Math.sin(x / 140 + t * 1.2)); c.lineTo(1800, 2600); c.lineTo(-700, 2600); c.closePath(); fill(c, C5.sand);
    c.beginPath(); for (let x = -700; x <= 1800; x += 30) { const yy = y + 18 * Math.sin(x / 140 + t * 1.2); x === -700 ? c.moveTo(x, yy) : c.lineTo(x, yy) } lnB(c, 8, 'rgba(201,220,242,.7)');
    c.fillStyle = 'rgba(255,236,190,.08)'; c.fillRect(-700, y + 30, 2500, 60);
  }
  function tinPos0(t) {   // баночка: качается на волне, на «запрета» её выносит на песок; b2 — поворачивается крышкой к нам
    const a = T0, k = eio(at(t, a.zap - .1, a.zap + 1.5)), wet = 1 - k, turn = eio(at(t, a.net - .25, a.dazhe + .3));
    const x = lp(540, 556, k) + Math.sin(t * 1.1) * 10 * wet, y = lp(1180, 1236, k) + Math.sin(t * 1.7) * 16 * wet - 20 * turn;
    return { x, y, R: lp(lp(210, 222, k), 236, turn), ty: lp(.46 + .06 * Math.sin(t * 1.7) * wet, .9, turn), r: Math.sin(t * 1.3) * .07 * wet, lid: eio(at(t, a.dazhe + .05, a.tab - .1)) };
  }
  function oceanWorld(c, t, q) {
    const a = T0;
    layer(c, q, .15, cc => { P0(cc, .15); oceanSky(cc, t) }); layer(c, q, .35, cc => { P0(cc, .35); oceanShore(cc, t) });   // P0: дальний план при камере (540, 960, 1) — на своём месте
    layer(c, q, .55, cc => { P0(cc, .55); seaRows(cc, t, 830, 1000, 5, true) });
    layer(c, q, .7, cc => { P0(cc, .7); barrier(cc, 790, 868, .62, eio(at(t, a.zap - .05, a.zap + .7)));   // ценник висит на стреле, пока её не подняли
      const hang = 1 - eio(at(t, a.zap - .05, a.zap + .5)); if (hang > 0 && t < a.shest) { cc.save(); cc.globalAlpha *= hang; const sw = Math.sin(t * 2.2) * .08; cc.translate(640, 834); cc.rotate(sw);
        cc.beginPath(); cc.moveTo(0, 0); cc.lineTo(0, 70); lnB(cc, 2, 'rgba(244,234,212,.8)'); priceTag(cc, 0, 108, .62 * eo(at(t, a.fil - .1, a.fil + .3)), 1, 0); cc.restore() } });
    layer(c, q, 1, cc => seaRows(cc, t, 1000, 1500, 6, true));
    layer(c, q, 1, cc => sand(cc, t, at(t, a.zap, a.zap + 1.6)));
    layer(c, q, 1, cc => { const p = tinPos0(t);
      cc.save(); cc.translate(p.x, p.y); cc.rotate(p.r); tin5(cc, 0, 0, p.R, p.ty, p.lid, { skip: t > a.fly ? 1 : -1, shc: 'rgba(4,8,26,.4)' }); cc.restore();
      // волна перед баночкой — пока её не вынесло на песок
      const wet = 1 - at(t, a.zap + .2, a.zap + 1.2); if (wet > 0) { cc.save(); cc.globalAlpha *= wet; cc.beginPath(); cc.moveTo(-700, 2400);
        for (let x = -700; x <= 1800; x += 20) cc.lineTo(x, 1330 + 30 * Math.sin(x / 160 + t * 1.7)); cc.lineTo(1800, 2400); cc.closePath(); fill(cc, C5.sea0);
        cc.beginPath(); for (let x = -700; x <= 1800; x += 20) { const yy = 1330 + 30 * Math.sin(x / 160 + t * 1.7); x === -700 ? cc.moveTo(x, yy) : cc.lineTo(x, yy) } lnB(cc, 5, 'rgba(201,220,242,.55)'); cc.restore() }
      // ценник лёг на баночку: барабан до $16 млрд
      if (t >= a.shest - .35) { const k = eo(at(t, a.shest - .35, a.shest + .1)), out = at(t, a.dazhe - .3, a.dazhe + .1); if (out < 1) { cc.save(); cc.globalAlpha *= 1 - out;
        priceTag(cc, p.x + lp(120, 40, k), p.y + lp(-420, -150, k), lp(.62, 1, k), 1, at(t, a.shest, a.mlrd + .1)); cc.restore() } }
      leaf5(cc, t, p.x, p.y - p.R * .95);
    });
  }
  function leaf5(c, t, x, y) {   // лист табака над открытой баночкой — перечёркивается и тает
    const a = T0, k = at(t, a.dazhe - .1, a.dazhe + .25), out = at(t, a.fly - .1, a.fly + .2); if (k <= 0 || out >= 1) return;
    c.save(); c.translate(x, y); c.globalAlpha *= Math.min(1, k * 2) * (1 - out); const s = lp(1.6, 2.2, eo(k)); c.scale(s, s);
    c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-26, 10, -22, -22, 0, -36); c.bezierCurveTo(22, -22, 26, 10, 0, 30); fill(c, 'rgba(110,139,61,.35)');
    c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-26, 10, -22, -22, 0, -36); c.bezierCurveTo(22, -22, 26, 10, 0, 30); lnB(c, 2.6, '#C9E29A'); c.beginPath(); c.moveTo(0, 30); c.lineTo(0, -30); lnB(c, 1.6, '#C9E29A');
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(0, 12 - i * 13); c.lineTo(sd * 13, 2 - i * 13); lnB(c, 1.2, '#C9E29A') }
    const kx = eo(at(t, a.tab - .1, a.tab + .15)); if (kx > 0) { c.beginPath(); c.moveTo(-30, 34); c.lineTo(lp(-30, 30, kx), lp(34, -38, kx)); lnB(c, 5, '#E2412F') }
    c.restore();
  }
  // подушечка, которая вылетает из баночки к камере (экранные координаты): от места в баночке до середины кадра, растёт и ложится плашмя
  function flyPouch(t, q) {
    const a = T0, k = eio(at(t, a.fly, T0.sw)), p = tinPos0(a.fly);
    const al = Math.PI / 2 + 1 * TAU / 9, wx = p.x + Math.cos(al) * p.R * .56, wy = p.y + Math.sin(al) * p.R * .56 * p.ty;
    const sx = (wx - q.x) * q.z + 540, sy = (wy - q.y) * q.z + 960, w0 = p.R * .4 * q.z, h0 = p.R * .26 * q.z * p.ty;
    return { x: lp(sx, 540, k), y: lp(sy, 1190, k) - 240 * Math.sin(Math.PI * k), w: lp(w0, 760, k), h: lp(h0, 240, k), r: lp(.55, 0, k), k };
  }
  function oceanShot(c, t) {
    const q = camObj(camAt(K0, t)); oceanWorld(c, t, q);
    capS(c, TEXT.notob, 540, 330, at(t, T0.tab - .05, T0.tab + .25) * (1 - at(t, T0.fly + .2, T0.fly + .45)), { s: 56 });
    if (t >= T0.fly) { const f = flyPouch(t, q); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.translate(f.x, f.y); c.rotate(f.r);
      castDots(c, -f.w / 2, f.h * .2, f.w, f.h * .4, 60 + f.k * 60, {}); rr(c, -f.w / 2, -f.h / 2, f.w, f.h, f.h * .38); fill(c, C5.pouch); c.save(); rr(c, -f.w / 2, -f.h / 2, f.w, f.h, f.h * .38); c.clip();
      c.fillStyle = C5.pouchS; c.fillRect(f.w * .22, -f.h, f.w, f.h * 2); c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(-f.w * .4, -f.h * .32, f.w * .08, f.h * .64); c.restore();
      rr(c, -f.w / 2, -f.h / 2, f.w, f.h, f.h * .38); lnB(c, 3, B2.ln); c.restore() }
  }
