  // ================= блок 5 (53,65–63,9 с): нырок в ледяной круг → весы: 1 картридж = пачка → картридж летит в центр и «разрастается» в одноразку на синем чертеже (Кола #067):
  // лебёдки на цепях, разрез — БАК 13 МЛ, 2 СЕТКИ НАГРЕВА, барабан 5 000 ЗАТЯЖЕК → корпус поворачивается круглым торцом (Кола #003) с точечной тенью,
  // по орбите R 330 загораются все 16 картриджей, плашка «= 16 КАРТРИДЖЕЙ» =================
  let T5 = null, K5 = null; const DEV = { x: 540, y: 1000, w: 300, h: 820 }, ORB = { x: 540, y: 820, r: 330, R: 210 };
  function b5Init() {
    const w = Wd; T5 = { a: T4.end, kart: w('картридж'), zam: w('заменял'), pach: w('пачку'), potom: w('потом', 1), razr: w('разрослись'), t13: w('тринадцать'), dv: w('двойная'), tys: w('тысячи'),
      rot: 61.3, nik: w('никотину'), n16: w('шестнадцать'), k16: w('картриджей'), end: w('чтобы') - .15 };
    T5.wipe = T5.potom - .12;
    K5 = [KY(T5.a, 540, 960, 1), KY(T5.pach + .1, 540, 935, 1.05), KY(T5.pach + .4, 540, 935, 1.05), KY(T5.razr + .3, 540, 980, .9), KY(T5.rot - .1, 540, 960, .94),
      KY(T5.rot + .7, 540, 900, 1.0), KY(T5.k16 + .05, 540, 880, 1.03), KY(T5.k16 + .28, 540, 880, 1.03), KY(T5.end, 540, 875, 1.04)];
  }
  function pack5(c, x, y) {   // пачка 20 сигарет
    rr(c, x - 80, y - 200, 160, 200, 10); cel(c, x - 80, y - 200, 160, 200, '#f5f1e8', { hw: .08 }); c.fillStyle = B2.red; c.fillRect(x - 80, y - 200, 160, 70);
    rr(c, x - 80, y - 200, 160, 200, 10); lnB(c, 4, B2.ink); for (let i = 0; i < 5; i++) { rr(c, x - 64 + i * 26, y - 240, 22, 50, 6); fill(c, i % 2 ? '#f5f1e8' : '#e9a65d'); lnB(c, 3, B2.ink) }
    tx(c, '20', x, y - 80, { f: 'U', w: 800, s: 56, c: B2.ink });
  }
  function cart5(c, x, y, s = 1) {   // картридж «Джула»
    c.save(); c.translate(x, y); c.scale(s, s); rr(c, -34, -150, 68, 150, 14); cel(c, -34, -150, 68, 150, B2.mango, { hw: .14 }); rr(c, -34, -150, 68, 50, 14); fill(c, '#2d3142'); rr(c, -34, -150, 68, 150, 14); lnB(c, 4, B2.ink); c.restore();
  }
  function scale5(c, t) {   // весы: перевес у пачки → ровно, «=»
    const kin = spr(at(t, T5.a + .05, T5.a + .55));   // v19.1: диск весов — это круг снежинки из блока 4, он уже на месте; весы вырастают на нём
    const th = lp(.24, 0, spr(at(t, T5.zam - .1, T5.pach + .2))), L = 300;
    circ(c, 540, 900, 430, '#f5f1e8'); grain(c, 110, 470, 860, 860, .1); ring(c, 540, 900, 430, B2.ln, 4); if (kin <= 0) return;
    c.save(); c.translate(540, 1330); c.scale(kin, kin); c.translate(-540, -1330);
    c.beginPath(); c.moveTo(540, 1330); c.lineTo(540, 660); c.moveTo(420, 1330); c.lineTo(660, 1330); lnB(c, 8, B2.ink);
    const ex = L * Math.cos(th), ey = L * Math.sin(th);
    c.beginPath(); c.moveTo(540 - ex, 660 - ey); c.lineTo(540 + ex, 660 + ey); lnB(c, 10, B2.ink); circ(c, 540, 660, 16, B2.red);
    [[-1, 'cart'], [1, 'pack']].forEach(([s, what]) => { const px = 540 + s * ex, py = 660 + s * ey; c.beginPath(); c.moveTo(px, py); c.lineTo(px - 90, py + 230); c.moveTo(px, py); c.lineTo(px + 90, py + 230); lnB(c, 4, B2.ink);
      c.beginPath(); c.ellipse(px, py + 236, 120, 22, 0, 0, TAU); fill(c, B2.steel); lnB(c, 4, B2.ink);
      if (what === 'pack') pack5(c, px, py + 226); else if (t < T5.wipe - .12) cart5(c, px, py + 226) });   // v19.2: на перевороте диска картридж уже снят с чаши (его рисует device5)
    const ke = bo(at(t, T5.pach - .05, T5.pach + .25)); if (ke > 0) { c.save(); c.translate(540, 760); c.scale(ke, ke); tx(c, '=', 0, 0, { f: 'U', w: 800, s: 130, c: B2.red }); c.restore() }
    tx(c, '1 КАРТРИДЖ', 540 - ex, 660 - ey + 330, { f: 'M', w: 800, s: 30, c: B2.ink }); tx(c, '20 СИГАРЕТ', 540 + ex, 660 + ey + 330, { f: 'M', w: 800, s: 30, c: B2.ink });
    c.restore();
  }
  function cranes5(c, t) {   // балка с лебёдками и паллетами одноразок (#067)
    const ca = WD ? -2400 : -400, cw = WD ? 5900 : 1900; c.fillStyle = '#f2b84b'; c.fillRect(ca, 230, cw, 48); c.save(); c.beginPath(); c.rect(ca, 230, cw, 48); c.clip(); for (let i = 0; i < (WD ? 100 : 50); i++) { poly(c, [ca + i * 60, 278, ca + 30 + i * 60, 278, ca + 60 + i * 60, 230, ca + 30 + i * 60, 230]); fill(c, B2.ink) } c.restore();   // 24.11: в 16:9 балка на всю ширину
    for (let j = 0; j < (WD ? 6 : 3); j++) { const x = (WD ? -1450 : -250) + ((t - T5.wipe) * 150 + j * 560) % (WD ? 3360 : 1680), sw = Math.sin(t * 2 + j) * 8;
      c.fillStyle = '#2c3048'; c.fillRect(x - 40, 274, 80, 34); for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(x - 30 + sw * i / 4, 330 + i * 30, 6, 13, 0, 0, TAU); c.ellipse(x + 30 + sw * i / 4, 330 + i * 30, 6, 13, 0, 0, TAU); lnB(c, 4, B2.steel) }
      c.save(); c.translate(x + sw, 450); rr(c, -90, 0, 180, 20, 4); fill(c, '#8a6a4a'); for (let i = 0; i < 5; i++) { rr(c, -80 + i * 34, -60, 26, 60, 8); fill(c, [B2.mango, B2.ice2, B2.teal, B2.coral, '#b65bd6'][(i + j) % 5]); lnB(c, 2) } c.restore() }
  }
  function blueprint5(c, t, q) {
    const v = viewRect(q); c.fillStyle = B2.bp; c.fillRect(v.x0 - 10, v.y0 - 10, v.x1 - v.x0 + 20, v.y1 - v.y0 + 20);
    c.beginPath(); for (let x = Math.floor(v.x0 / 60) * 60; x < v.x1; x += 60) { c.moveTo(x, v.y0); c.lineTo(x, v.y1) } for (let y = Math.floor(v.y0 / 60) * 60; y < v.y1; y += 60) { c.moveTo(v.x0, y); c.lineTo(v.x1, y) } lnB(c, 1.5, 'rgba(255,255,255,.12)');
  }
  function device5(c, t) {   // одноразка в разрезе; k — поворот торцом (0 — сбоку, 1 — торец круг R 210)
    const kg = t < T5.wipe ? 0 : spr(at(t, T5.razr - .45, T5.razr + .4)), km = eio(at(t, T5.wipe - .12, T5.wipe + .38)), kr = eio(at(t, T5.rot, T5.rot + .7));   // v19.2: картридж слетает с чаши вместе с переворотом диска
    const s = lp(km < .5 ? .2 : lp(.2, .35, (km - .5) * 2), 1, kg), cx = lp(lp(540 - 300, 540, km), ORB.x, kr), cy0 = lp(lp(805, DEV.y, km), ORB.y, kr) - 90 * Math.sin(Math.PI * km);   // v19.2: в момент смены картридж → корпус одного размера; подскок дугой
    const w = lp(DEV.w * s, ORB.R * 2, kr), hl = DEV.h * s / 2 * Math.cos(kr * Math.PI / 2), ry = ORB.R * Math.sin(kr * Math.PI / 2) + w * .12 * (1 - kr), top = cy0 - hl;
    if (km < .5) { cart5(c, cx, cy0 + 75, 1); return { cx, top: cy0 - 75, s } }   // пока шторка не прошла — это ещё картридж с весов
    if (kr > .3) castCirc(c, cx, cy0, ORB.R * Math.min(1, kr * 1.2), 520 * at(kr, .3, 1), { st: 17 });
    // корпус
    c.beginPath(); c.moveTo(cx - w / 2, top); c.lineTo(cx - w / 2, cy0 + hl); c.ellipse(cx, cy0 + hl, w / 2, ry, 0, Math.PI, 0, true); c.lineTo(cx + w / 2, top); c.closePath();
    cel(c, cx - w / 2, top - 10, w, hl * 2 + ry + 20, kr > .02 ? B2.ind : 'rgba(255,255,255,.07)', { hw: .08 }); c.beginPath(); c.moveTo(cx - w / 2, top); c.lineTo(cx - w / 2, cy0 + hl); c.ellipse(cx, cy0 + hl, w / 2, ry, 0, Math.PI, 0, true); c.lineTo(cx + w / 2, top); lnB(c, 5);
    if (kr < .5 && s > .5) {   // разрез: бак, спирали, батарея
      const a = 1 - kr * 2, x0 = cx - w / 2 + 26, ww = w - 52, yT = top + 70 * s, hT = DEV.h * s * .5;
      c.save(); c.globalAlpha *= a;
      rr(c, x0, yT, ww, hT, 18); lnB(c, 4, '#bfe0ff'); const kl = eo(at(t, T5.t13 - .1, T5.t13 + .7)); if (kl > 0) { c.save(); rr(c, x0, yT, ww, hT, 18); c.clip(); liquid2(c, x0, x0 + ww, yT + hT * (1 - .9 * kl), 10, t, yT + hT + 10); c.restore() }
      const kh = at(t, T5.dv - .1, T5.dv + .3), heat = kh * (.8 + .2 * Math.sin(t * 14)); [cx - ww * .22, cx + ww * .22].forEach(xx => { c.beginPath(); for (let i = 0; i <= 24; i++) { const y = yT + hT + 30 + i * 8; c.lineTo(xx + (i % 2 ? 22 : -22), y) } lnB(c, 6, mixc('#bfe0ff', '#ff7a3d', heat)); if (heat > 0) glow(c, xx, yT + hT + 130, 90, '#ff7a3d', .45 * heat) });
      rr(c, x0, yT + hT + 250 * s, ww, DEV.h * s * .22, 12); lnB(c, 4, '#bfe0ff'); tx(c, '+', cx, yT + hT + 250 * s + DEV.h * s * .11, { f: 'U', w: 800, s: 44, c: '#bfe0ff' });
      c.restore();
    }
    // торец: кольца мундштука
    if (kr > 0) { c.beginPath(); c.ellipse(cx, top, w / 2, Math.max(1, ry), 0, 0, TAU); cel(c, cx - w / 2, top - ry, w, ry * 2, lit(B2.ind, .25), { hw: .1 }); c.beginPath(); c.ellipse(cx, top, w / 2, Math.max(1, ry), 0, 0, TAU); lnB(c, 5);
      c.beginPath(); c.ellipse(cx, top, w / 2 * .55, ry * .55, 0, 0, TAU); fill(c, '#2d3142'); lnB(c, 4); c.beginPath(); c.ellipse(cx, top, w / 2 * .2, ry * .2, 0, 0, TAU); fill(c, B2.mango) }
    else { rr(c, cx - w * .3, top - 60 * s, w * .6, 70 * s, 14 * s); cel(c, cx - w * .3, top - 60 * s, w * .6, 70 * s, '#2d3142', { hw: .1 }); rr(c, cx - w * .3, top - 60 * s, w * .6, 70 * s, 14 * s); lnB(c, 4) }
    return { cx, top, s };
  }
  function callouts5(c, t) {   // выноски: бак, спирали, барабан
    const out = ei(at(t, T5.rot - .15, T5.rot + .2)); if (out >= 1) return;   // v19.3: выноски уходят позже — «5 000» успевают прочитать
    const L = (k, x0, y0, x1, y1, lab1, lab2, al = 'right') => { if (k <= 0) return; c.save(); c.translate(-500 * out * (al === 'right' ? 1 : -1), 0);
      c.beginPath(); c.moveTo(x0, y0); c.lineTo(lp(x0, x1, eo(k)), lp(y0, y1, eo(k))); lnB(c, 4, '#ffffff'); circ(c, x0, y0, 9, '#ffffff');
      const kb = bo(at(k, .4, 1)); if (kb > 0) { c.save(); c.translate(x1, y1); c.scale(kb, kb); tx(c, lab1, 0, -20, { f: 'U', w: 800, s: 44, c: '#ffffff' }); if (lab2) tx(c, lab2, 0, 26, { f: 'M', w: 800, s: 28, c: '#bfe0ff' }); c.restore() } c.restore() };
    L(at(t, T5.t13 - .2, T5.t13 + .6), 470, 760, 200, 640, '13 МЛ', 'БАК', 'left');
    L(at(t, T5.dv - .2, T5.dv + .6), 470, 1150, 190, 1080, '2 СЕТКИ', 'НАГРЕВА', 'left');
    const kd = at(t, T5.tys - .25, T5.tys + .5); if (kd > 0) { c.save(); c.translate(500 * out, 0); const x = 860, y = 1120, sb = bo(at(kd, 0, .5)); c.translate(x, y); c.scale(sb, sb);
      rr(c, -150, -70, 300, 140, 16); fill(c, B2.ink); rr(c, -150, -70, 300, 140, 16); lnB(c, 4); const v = Math.round(5000 * eo(at(Math.round(t * 30) / 30, T5.tys - .05, T5.tys + .45)) / 10) * 10;   // по кадру — без двоения цифр; v19.3: до 5 000 за полсекунды (было — уходил на «110»)
      c.save(); rr(c, -130, -52, 260, 92, 10); c.clip(); num(c, (v >= 1000 ? Math.floor(v / 1000) + ' ' + String(v % 1000).padStart(3, '0') : String(v)), 0, -6, { f: 'J', w: 700, s: 66, c: '#7ee787' }); c.restore();
      tx(c, 'ЗАТЯЖЕК', 0, 100, { f: 'U', w: 800, s: 34, c: '#ffffff' }); c.restore() }
  }
  function orbit16(c, t) {
    const k0 = at(t, T5.rot + .35, T5.rot + .7); if (k0 <= 0) return;
    for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i * TAU / 16, tl = lp(T5.nik + .1, T5.k16 - .2, i / 15), kl = spr(at(t, tl, tl + .35)), x = ORB.x + Math.cos(a) * ORB.r * lp(.7, 1, eo(k0)), y = ORB.y + Math.sin(a) * ORB.r * lp(.7, 1, eo(k0));
      c.save(); c.translate(x, y); c.rotate(a + Math.PI / 2); c.globalAlpha *= cl(k0 * 2); const s = .62 * (1 + .25 * Math.max(0, kl - 1 + 1) * (t < tl + .35 ? 1 : 0) * 0);
      if (kl > 0) { glow(c, 0, -60, 80, '#f6a03a', .35 * cl(kl)); cart5(c, 0, 20, s * lp(.85, 1, cl(kl))) } else { c.setLineDash([10, 8]); rr(c, -21, -73, 42, 93, 9); lnB(c, 3, 'rgba(255,255,255,.55)'); c.setLineDash([]) }
      c.restore() }
    const kp = bo(at(t, T5.k16 - .05, T5.k16 + .3)); if (kp > 0) plate(c, '= 16 КАРТРИДЖЕЙ', 540, 1330, kp, { s: 46, bg: B2.mango, c: B2.ink });
  }
  function b5World(c, t, q) {   // v19.2 (отзыв 17.11: «переход уебищный» — косая шторка): белый диск весов честно переворачивается (#019, формула Андрея «медальон поворачивается»),
    // на обороте — синий чертёж; диск разрастается до краёв кадра, в нём уже балка с лебёдками; картридж в это время слетает с чаши в центр
    c.fillStyle = B2.ice2; c.fillRect(-2000, -2000, 5000, 6000);
    const kf = eio(at(t, T5.wipe - .12, T5.wipe + .3)), kd = eio(at(t, T5.wipe + .2, T5.wipe + .75)), v = viewRect(q);
    const Rend = Math.max(...[[v.x0, v.y0], [v.x1, v.y0], [v.x0, v.y1], [v.x1, v.y1]].map(([x, y]) => Math.hypot(x - 540, y - 900))) + 60, R = 430 * Math.pow(Rend / 430, kd);
    if (kf < .5) { const sx = Math.max(.002, Math.cos(Math.PI * kf)); c.save(); c.translate(540, 0); c.scale(sx, 1); c.translate(-540, 0); scale5(c, t); c.restore() }   // лицо диска: весы
    else if (kd < 1) { const sx = Math.max(.002, -Math.cos(Math.PI * kf));   // оборот диска: синий чертёж; потом диск растёт до кадра
      c.save(); c.beginPath(); c.ellipse(540, 900, R * sx, R, 0, 0, TAU); c.clip(); blueprint5(c, t, q); cranes5(c, t); c.restore();
      c.beginPath(); c.ellipse(540, 900, R * sx, R, 0, 0, TAU); lnB(c, 5, B2.ln) }
    else { blueprint5(c, t, q); cranes5(c, t) }
    if (t > T5.wipe - .12) { device5(c, t); callouts5(c, t); orbit16(c, t) }
  }
  function b5Shot(c, t) {
    if (!T5) b5Init(); const q = camObj(camAt(K5, t)); c.save(); c.translate(540, 960); c.rotate(q.r); c.scale(q.z, q.z); c.translate(-q.x, -q.y); b5World(c, t, q); c.restore();
  }
