// ЧЕРНОВИК варианта 3 «Thriller», пункты 1–3 ТЗ (15.11). В v170.js НЕ подключён и не проверен на кадрах.
// Вставлять перед function frameV и подключать ветками VARIANT === 3 — так же, как сделаны варианты 1 и 2.
  // ================= v17.0 · вариант 3 «Thriller» (ТЗ Андрея и Gemini; приёмы пульта — shorts/ep/v170-fx.md) =================
  // 0:00–0:02,6 — красная плашка «ЧТО ВЫ ЗНАЕТЕ ОБ ОДНОРАЗКАХ?» сворачивается в знак «?», с ним сверху подлетает мундштук и садится на вейп (#011)
  function v3Plate(c, t) {
    const kin = spr(at(t, .05, .4)), ks = eio(at(t, 1.5, 1.85)), kd = eio(at(t, 1.85, 2.35)), kq = 1 - at(t, 2.6, 3.0); if (kin <= 0 || kq <= 0) return;
    const w = lp(940, 150, ks), h = lp(270, 150, ks), x = CX, y = lp(lp(760, 560, ks), 196, kd), cap = kd > 0;
    c.save(); c.globalAlpha *= (1 - ss(.4, .9, at(t, 1.0, 1.6))) * .55 * (1 - ks); c.fillStyle = '#05061a'; c.fillRect(-300, -300, WW + 600, HH + 600); c.restore();   // город притушен под плашкой
    c.save(); c.translate(x, y); c.scale(kin, kin); c.globalAlpha *= kq;
    if (!cap) { rr(c, -w / 2 + 10, -h / 2 + 14, w, h, lp(24, 75, ks)); fill(c, 'rgba(40,0,10,.35)'); rr(c, -w / 2, -h / 2, w, h, lp(24, 75, ks)); fill(c, '#e0233c') }
    const o = { f: 'M', w: 800, s: 68, ls: 2 }, ka = 1 - ss(0, .35, ks);
    if (ka > 0) { [['ЧТО ВЫ ЗНАЕТЕ', -44, .26], ['ОБ ОДНОРАЗКАХ?', 44, .98]].forEach(([s, yy, t0]) => tx(c, s, 0, yy, { ...o, c: '#fff6ee', a: at(t, t0, t0 + .15) * ka })) }
    if (ks > 0) {   // знак вопроса — сначала на плашке, потом над мундштуком
      if (cap) { const e = kd; poly(c, [-60, 70 * e + 20, 60, 70 * e + 20, 75, 70 * e + 150, -75, 70 * e + 150]); fill(c, mixc('#e0233c', '#f3ead8', e)) }   // плашка становится мундштуком
      tx(c, '?', 0, cap ? -40 * kd : 4, { s: lp(10, 120, ss(.2, 1, ks)), w: 800, c: '#fff6ee' });
    }
    c.restore();
  }
  // 0:03,5–0:03,9 — витрина на миг вспыхивает рентгеном (#029): в коробке череп, на вейпе — формула никотина
  function v3Xray(c, t) {
    const k = at(t, 3.5, 3.92); if (k <= 0 || k >= 1) return;
    const fl = (Math.sin(Math.PI * k) > .25 ? 1 : .5) * (k < .5 ? 1 : 1 - (k - .5) * .6);
    c.save(); c.globalAlpha = .86 * fl; c.fillStyle = '#071a3a'; c.fillRect(-300, -300, WW + 600, HH + 600); c.restore();
    c.save(); c.globalAlpha = fl; c.strokeStyle = '#bfe6ff'; c.lineWidth = 5;
    rr(c, HB.x - HB.w / 2, CTR.y - HB.h, HB.w, HB.h, 16); c.stroke(); rr(c, HV.x - 72, 250, 144, 560, 40); c.stroke();
    const sx = HB.x, sy = CTR.y - HB.h * .5;   // череп
    c.fillStyle = '#e8f6ff'; c.beginPath(); c.arc(sx, sy - 30, 92, Math.PI, 0); c.lineTo(sx + 70, sy + 50); c.lineTo(sx - 70, sy + 50); c.closePath(); c.fill();
    c.fillStyle = '#071a3a'; for (const dx of [-36, 36]) { c.beginPath(); c.ellipse(sx + dx, sy - 20, 24, 28, 0, 0, TAU); c.fill() } poly(c, [sx, sy + 8, sx - 12, sy + 30, sx + 12, sy + 30]); c.fill();
    for (let i = -2; i <= 2; i++) c.fillRect(sx + i * 22 - 7, sy + 50, 14, 26);
    tx(c, 'C₁₀H₁₄N₂', HV.x, 560, { f: 'J', w: 700, s: 40, c: '#e8f6ff' }); tx(c, 'ЯД', HV.x, 618, { f: 'O', w: 700, s: 44, ls: 6, c: '#ff5a68' });
    c.restore();
  }
  // 0:13,8–0:14,4 — камера пролетает сквозь петлю цифры «9» в «1973» (#020); 0:14,4–0:16 — белый частокол из 20 сигарет опускается
  // и становится дымящими кирпичными трубами завода (#124)
  function v3NineDive(c, t, scene) {   // scene — завод без табло; табло летит на камеру, сквозь «9»
    const k = eio(at(t, K.y73 + .12, K.y73 + .7)); scene(); if (k >= 1) return;
    c.save(); c.font = FNT({ s: 200, w: 800 }); const dw = c.measureText('0').width * 1.04; c.restore();
    const nx = CX - dw * .5, ny = 600 - 26, z = Math.pow(40, k);
    c.save(); c.translate(nx, ny); c.scale(z, z); c.translate(-nx, -ny);
    const o = mk(1, 1); c.beginPath(); c.rect(-400, -400, WW + 800, HH + 800); c.arc(nx, ny + 4, 30, 0, TAU, true); c.clip();   // дырка петли — окно в завод
    yearPlate(c, CX, 600, 1, 1); odo(c, 1973, CX, 600, 1);
    c.restore();
  }
  function v3Stacks(c, t) {   // частокол сигарет → трубы
    const k0 = K.y73 + .55, kd = eio(at(t, k0, k0 + .7)), km = ss(.6, 1, kd), ko = 1 - eio(at(t, K.emp - .4, K.emp + .1)); if (kd <= 0 || ko <= 0) return;
    c.save(); c.globalAlpha *= ko;
    for (let i = 0; i < 20; i++) {
      const x = 60 + i * 50.5, base = 905 + 26 * Math.sin(i * 1.7), h = lp(520, 150 + 60 * H1(i * 3.3), km), y = lp(-560, base, kd);
      const body = mixc('#f4efe6', '#9c4a32', km), cw = lp(22, 30, km);
      rr(c, x - cw / 2, y - h, cw, h, lp(5, 3, km)); fill(c, body);
      if (km < 1) { c.save(); c.globalAlpha *= 1 - km; rr(c, x - cw / 2, y - h, cw, h * .3, [5, 5, 0, 0]); fill(c, C.am); c.restore() }   // фильтр
      if (km > 0) { c.fillStyle = `rgba(60,20,10,${.4 * km})`; for (let b = 1; b < 6; b++) c.fillRect(x - cw / 2, y - h + b * h / 6, cw, 2); c.fillStyle = '#5a2a1c'; c.fillRect(x - cw / 2 - 3, y - h - 6, cw + 6, 10) }
      if (km > .8 && i % 2 === 0) for (let m = 0; m < 2; m++) { const ph = ((t - k0) / 2.4 + m / 2 + i * .13) % 1; cloud(c, x + ph * 30, y - h - 20 - ph * 160, .08 + .1 * ph, .5 * (1 - ph), i + m * 7, '#e9e2f2') }
    }
    c.restore();
  }
  // 0:18,9–0:19,8 — два металлических валика падают на стол и раскатывают вниз лист меморандума (#112)
  const v3RollY = t => lp(-60, MH + 60, eio(at(t, K.prep + .35, K.prep + 1.05)));   // нижний край раскатанного листа в координатах записки
  function v3Rollers(c, t) {   // в координатах записки
    const kf = eo(at(t, K.prep + .15, K.prep + .35)), y = v3RollY(t); if (kf <= 0 || y > MH + 50) return;
    const fall = (1 - kf) * -700;
    for (const [dy, r] of [[-26, 28], [26, 28]]) {
      const yy = y + dy + fall, g = c.createLinearGradient(0, yy - r, 0, yy + r); g.addColorStop(0, '#d9dfea'); g.addColorStop(.45, '#8d95a8'); g.addColorStop(1, '#3a404f');
      rr(c, -40, yy - r, MW + 80, 2 * r, r); c.fillStyle = g; c.fill(); rr(c, -40, yy - r, MW + 80, 2 * r, r); stroke(c, '#262a35', 4);
      for (const ex of [-40, MW + 40]) { circ(c, ex, yy, r * .8, '#2a2e3c'); circ(c, ex, yy, r * .35, '#c9cfdb') }
      c.save(); c.globalAlpha = .4; c.strokeStyle = '#fff'; c.lineWidth = 3; const ph = (t * 3) % 1; for (let q = 0; q < 6; q++) { const xx = -20 + (q + ph) * (MW + 40) / 6; c.beginPath(); c.moveTo(xx, yy - r * .6); c.lineTo(xx, yy + r * .6); c.stroke() } c.restore();
    }
  }
  // 0:26,1–0:27 — круглая печать «СЕКРЕТНО» моргает, как следящий глаз корпорации (#034)
  function v3EyeSeal(c, t, F) {   // в координатах записки
    const k = F ? 1 : at(t, K.qEnd - .02, K.qEnd + .2); if (k <= 0) return;
    const e = ei(k), sc = lp(2.2, 1, e), x = 470, y = 690, r = 96;
    c.save(); c.translate(x, y); c.rotate(-.12); c.scale(sc, sc); c.globalAlpha *= lp(.2, 1, e);
    c.beginPath(); c.arc(0, 0, r, 0, TAU); c.lineWidth = 11; c.strokeStyle = '#d8303f'; c.stroke(); c.beginPath(); c.arc(0, 0, r - 24, 0, TAU); c.lineWidth = 4; c.stroke();
    const s = 'СЕКРЕТНО · СЕКРЕТНО · ', n = s.length; c.font = FNT({ s: 20, w: 800 }); c.fillStyle = '#d8303f'; c.textAlign = 'center'; c.textBaseline = 'middle'; for (let q = 0; q < n; q++) { c.save(); c.rotate(q / n * TAU); c.fillText(s[q], 0, -(r - 12)); c.restore() }
    // глаз: веко открывается, зрачок следит, моргает
    const tb = t - K.qEnd, open = F ? 1 : ss(.25, .5, tb) * (1 - Math.max(0, Math.sin(Math.PI * at(tb, 1.1, 1.3))) * 1) * (1 - Math.max(0, Math.sin(Math.PI * at(tb, 2.0, 2.2))));
    const ew = 58, eh = 34 * open;
    c.beginPath(); c.moveTo(-ew, 0); c.quadraticCurveTo(0, -eh * 1.6, ew, 0); c.quadraticCurveTo(0, eh * 1.6, -ew, 0); c.closePath(); c.fillStyle = '#fff4f4'; c.fill(); c.lineWidth = 4; c.strokeStyle = '#d8303f'; c.stroke();
    if (open > .1) { c.save(); c.clip(); const px = 14 * Math.sin(t * 1.7), py = 4 * Math.sin(t * 2.3); circ(c, px, py, 22, '#d8303f'); circ(c, px, py, 10, '#2a0610'); circ(c, px - 6, py - 6, 4, '#ffffff'); c.restore() }
    c.restore();
  }
