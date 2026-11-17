  // ================= блок 2 (7,5–20,9 с): эмблема раскрывается в Капитолий → влёт в окно → кабинет, лист закона с пустой клеткой «ОДНОРАЗОВЫЕ ?» →
  // календарь «январь 2020» → газета СКАНДАЛ, стик «Джула» взлетает и становится косым лезвием на цепях (Соболев #127) → рубит вкусы, ТАБАК и МЕНТОЛ остаются =================
  // Мир C — Капитолий (координаты экрана в 7,5 с), мир O — кабинет за окном: точка O (x, y) = C (OX + x·OS, OY + y·OS).
  const WIN2 = { x: 504, y: 1226, w: 72, h: 128 }, OS2 = 72 / 1080, OX2 = 504, OY2 = 1226;
  const CRT2 = [['ТАБАК', '#9a6a44'], ['МАНГО', '#f6a03a'], ['ФРУКТЫ', '#e2504f'], ['ДЕСЕРТЫ', '#f19ac2'], ['МЯТА', '#5ed39b'], ['МЕНТОЛ', '#9fdcf2']];
  const CX2 = [190, 330, 470, 610, 750, 890], STK2 = { y: -300, top: -560, cut: -470 }, BLD2 = { x0: 262, x1: 818, top: -1080, bl: -830, br: -905 };
  let T2 = null, K2 = null, TIN2 = 99, DR2 = null;
  const KO2 = (t, x, y, z) => KY(t, OX2 + x * OS2, OY2 + y * OS2, z / OS2);
  function b2Init() {
    const w = Wd; T2 = { a: T1.end, rev: T1.end + .38, fly: 7.95, open: 8.55, one: w('одного'), word: w('слова'), zab: w('забыли'), zak: w('закон'), jan: w('январь'), y20: w('2020', 1),
      posle: w('после'), sk: w('скандала'), juul: w('джулом'), lift: 15.2, vl: w('власти'), usa: w('сша'), rub: w('рубят'), vk: w('вкусами'),
      fl: [w('манго'), w('фрукты'), w('десерты'), w('мята')], pod: w('под'), end: 20.95 };
    T2.chop = T2.pod; T2.drop = T2.chop - .17;
    K2 = [KY(T2.a, 540, 960, 1), KY(T2.fly, 540, 1010, 1.04), KY(8.55, 540, 1210, 4.2), KO2(9.0, 540, 960, 1.0), KO2(9.6, 560, 1060, 1.5), KO2(10.9, 556, 1050, 1.62),
      KO2(T2.zak - .15, 540, 960, 1.06), KO2(T2.zak + .25, 540, 960, 1.06), KO2(12.7, 520, 1040, 1.0), KO2(14.6, 548, 1080, 1.0), KO2(15.15, 552, 1090, 1.0),
      KO2(15.95, 540, -700, 1.0), KO2(T2.chop, 540, -684, 1.04), KO2(T2.chop + .22, 540, -684, 1.04), KO2(T2.end, 540, -650, 1.02)]; if (typeof b3Keys === 'function') { K2.pop(); K2.push(...b3Keys()) }
    TIN2 = 99; for (let f = Math.floor(8 * 30); f < 10 * 30; f++) { const v = viewRect(camObj(camAt(K2, f / 30))); if (v.x0 > WIN2.x && v.x1 < WIN2.x + WIN2.w && v.y0 > WIN2.y && v.y1 < WIN2.y + WIN2.h) { TIN2 = f / 30; break } }
    DR2 = []; for (let i = 0; i < 44; i++) DR2.push({ ci: 1 + (i % 4), vx: (H1(i * 3.1) - .5) * 900, vy: -700 - H1(i * 7.3) * 900, r: 9 + H1(i) * 12 });
  }
  const camO2 = cm => ({ x: (cm.x - OX2) / OS2, y: (cm.y - OY2) / OS2, z: cm.z * OS2, r: cm.r });
  // ---------- Капитолий ночью ----------
  function domeFillPath(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(-212, 0); c.lineTo(-212, -70); c.lineTo(-172, -70); c.lineTo(-172, -110); c.lineTo(-160, -110);
    c.bezierCurveTo(-160, -250, -60, -300, 0, -305); c.bezierCurveTo(60, -300, 160, -250, 160, -110); c.lineTo(172, -110); c.lineTo(172, -70); c.lineTo(212, -70); c.lineTo(212, 0); c.closePath();
    c.rect(-28, -360, 56, 56); c.restore();
  }
  function capitol(c, t) {
    const kd = eo(at(t, T2.a + .05, T2.a + .45)), kw = eo(at(t, T2.a + .1, T2.a + .55)), ds = .6147, dy = 1090.6;
    c.fillStyle = B2.ink; c.fillRect(-1500, -1500, 4000, 4500);
    for (let i = 0; i < 40; i++) circ(c, -200 + H1(i * 4.4) * 1500, 120 + H1(i * 6.6) * 760, 2 + H1(i) * 2.5, rgba('#e2e8f0', .35 + .25 * Math.sin(t * 1.7 + i)));
    beam(c, 250, 1520, 470, 860, 30, 120, '#bfe9ff', .1 * kw); beam(c, 830, 1520, 610, 860, 30, 120, '#bfe9ff', .1 * kw);
    // крылья и главный корпус выезжают из-за краёв
    c.save(); c.translate(-700 * (1 - kw), 0); rr(c, -420, 1180, 640, 330, 4); cel(c, -420, 1180, 640, 330, '#d9d2c1', { hw: .04 }); rr(c, -420, 1180, 640, 330, 4); lnB(c, 3);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const lt = H1(i * 3 + r * 7) > .62; rr(c, -390 + i * 66, 1210 + r * 96, 34, 60, 14); fill(c, lt ? '#fbd38d' : '#3d4470') } c.restore();
    c.save(); c.translate(700 * (1 - kw), 0); rr(c, 860, 1180, 640, 330, 4); cel(c, 860, 1180, 640, 330, '#d9d2c1', { hw: .04 }); rr(c, 860, 1180, 640, 330, 4); lnB(c, 3);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const lt = H1(i * 5 + r * 3) > .62; rr(c, 890 + i * 66, 1210 + r * 96, 34, 60, 14); fill(c, lt ? '#fbd38d' : '#3d4470') } c.restore();
    c.save(); c.translate(0, 600 * (1 - kw)); rr(c, 200, dy, 680, 420, 4); cel(c, 200, dy, 680, 420, '#e6e0d1', { hw: .05, gr: .06 }); rr(c, 200, dy, 680, 420, 4); lnB(c, 3);
    poly(c, [370, 1150, 710, 1150, 540, 1100]); fill(c, '#cfc7b4'); poly(c, [370, 1150, 710, 1150, 540, 1100]); lnB(c, 3);
    win2(c, t);
    [400, 446, 634, 680].forEach(x => { rr(c, x - 14, 1158, 28, 330, 6); cel(c, x - 14, 1158, 28, 330, '#f5f1e8', { hw: .2, sw: .35 }); rr(c, x - 14, 1158, 28, 330, 6); lnB(c, 2.5) });
    for (let i = 0; i < 5; i++) { c.fillStyle = i % 2 ? '#bdb5a2' : '#d6cfbd'; c.fillRect(150 - i * 30, 1510 + i * 26, 780 + i * 60, 26) }
    c.restore();
    c.fillStyle = '#152018'; c.fillRect(-1500, 1640, 4000, 2000);
    // купол: сначала красный контур из эмблемы, заливка встаёт снизу шторкой
    c.save(); domeFillPath(c, 540, dy, ds); c.clip(); c.fillStyle = '#efe9db'; c.fillRect(300, dy - (370 * ds + 20) * kd, 480, 400); c.fillStyle = 'rgba(20,23,51,.24)'; c.fillRect(540 + 70, dy - 400, 200, 420);
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(540 - 112, dy - 260, 18, 200); c.restore();
    domePath(c, 540, dy, ds); lnB(c, lp(12.3, 3, kd), mixc(B2.red, '#4b4f73', kd)); star(c, 540, 821.7, 34.6, B2.gold);
  }
  function win2(c, t) {   // окно под куполом: тёплый свет, внутри — кабинет; створки распахиваются перед влётом
    const { x, y, w, h } = WIN2, ko = eio(at(t, T2.fly + .2, T2.open));
    c.save(); rr(c, x, y, w, h, 2); c.clip(); c.translate(OX2, OY2); c.scale(OS2, OS2); office(c, t); c.restore();
    [[x, 1], [x + w, -1]].forEach(([hx, s]) => { const sc = Math.cos(ko * 1.35); c.save(); c.translate(hx, 0); c.scale(s * sc, 1); rr(c, 0, y, w / 2, h, 1); fill(c, 'rgba(251,211,141,.25)'); c.beginPath(); c.rect(0, y, w / 2, h); c.moveTo(0, y + h / 2); c.lineTo(w / 2, y + h / 2); c.moveTo(w / 4, y); c.lineTo(w / 4, y + h); lnB(c, 2, '#5b4a3a'); c.restore() });
    rr(c, x - 4, y - 4, w + 8, h + 8, 3); lnB(c, 3, '#8c7d64');
  }
  // ---------- кабинет (мир O) ----------
  function sheet2(c, t) {
    const x0 = 210, y0 = 450, w = 660, h = 900;
    castDots(c, x0, y0, w, h, 140, { st: 16 });
    rr(c, x0, y0, w, h, 8); cel(c, x0, y0, w, h, B2.cream, { hw: .03, sw: .12, gr: .12 }); rr(c, x0, y0, w, h, 8); lnB(c, 4, '#c9c1ae');
    tx(c, 'ЗАПРЕТ ВКУСОВ', 540, 560, { f: 'U', w: 800, s: 62, c: B2.ink }); tx(c, 'FDA · США · 2020', 540, 625, { f: 'M', w: 800, s: 26, c: '#5b6075', ls: 3 });
    c.fillStyle = B2.ink; c.fillRect(260, 665, 560, 5);
    const rows = [['КАРТРИДЖНЫЕ', 'ЗАПРЕЩЕНЫ', B2.red], ['ТАБАК · МЕНТОЛ', 'МОЖНО', '#16a34a']];
    rows.forEach(([a, b, col], i) => { const yy = 760 + i * 130; rr(c, 260, yy - 50, 560, 100, 6); lnB(c, 3, '#b8ae98'); tx(c, a, 400, yy, { f: 'M', w: 800, s: 30, c: B2.ink, mw: 260 }); tx(c, b, 680, yy, { f: 'M', w: 800, s: 30, c: col, mw: 230 }) });
    const yy = 1150, blink = t > T2.one - .2 && t < T2.zak + .6 ? .5 + .5 * Math.sin((t - T2.one) * 9) : 0;
    rr(c, 260, yy - 60, 560, 120, 6); fill(c, rgba('#fde68a', .35 * blink)); c.setLineDash([16, 12]); rr(c, 260, yy - 60, 560, 120, 6); lnB(c, 4, mixc('#b8ae98', B2.red, blink)); c.setLineDash([]);
    tx(c, 'ОДНОРАЗОВЫЕ ?', 540, yy + 2, { f: 'M', w: 800, s: 40, c: mixc('#c9c3b6', '#9a937f', blink) });
    for (let i = 0; i < 3; i++) { c.fillStyle = '#d9d2c1'; c.fillRect(260, 1240 + i * 28, 560 - i * 120, 9) }
    const ks = at(t, T2.zak - .12, T2.zak); if (ks > 0) { const s = lp(2.6, 1, eo(ks)); c.save(); c.translate(650, 1290); c.rotate(-.12); c.scale(s, s); c.globalAlpha *= cl(ks * 3);
      rr(c, -120, -48, 240, 96, 10); lnB(c, 9, B2.red); tx(c, 'ЗАКОН', 0, 3, { f: 'U', w: 800, s: 58, c: B2.red, ls: 4 }); c.restore() }
  }
  function calendar2(c, t) {
    const k = bo(at(t, T2.jan - .3, T2.jan + .15)); if (k <= 0) return;
    const fl = eio(at(t, T2.jan - .05, T2.jan + .35));
    const kx = ei(at(t, T2.lift + .05, T2.lift + .5)); if (kx >= 1) return;
    c.save(); c.translate(250 - 900 * kx, 1460 - 500 * (1 - k)); c.rotate(-.06 - .4 * kx);
    castDots(c, -130, -330, 260, 330, 90, { st: 14 });
    rr(c, -130, -330, 260, 330, 12); cel(c, -130, -330, 260, 330, B2.cream, { hw: .05, gr: .1 }); rr(c, -130, -330, 260, 330, 12); lnB(c, 4, '#c9c1ae');
    c.fillStyle = B2.red; c.fillRect(-130, -330, 260, 80); tx(c, 'ЯНВАРЬ', 0, -290, { f: 'U', w: 800, s: 40, c: '#fff' }); tx(c, '2020', 0, -150, { f: 'U', w: 800, s: 92, c: B2.ink });
    if (fl < 1) { c.save(); c.translate(0, -330); c.scale(1, Math.cos(Math.PI * fl * .5) * 1); rr(c, -130, 0, 260, 330, 12); fill(c, '#ece6d6'); c.fillStyle = '#4b5563'; c.fillRect(-130, 0, 260, 80);
      tx(c, 'ДЕКАБРЬ', 0, 40, { f: 'U', w: 800, s: 38, c: '#fff' }); tx(c, '2019', 0, 180, { f: 'U', w: 800, s: 92, c: '#6b7280' }); rr(c, -130, 0, 260, 330, 12); lnB(c, 4, '#c9c1ae'); c.restore() }
    for (let i = 0; i < 6; i++) circ(c, -100 + i * 40, -330, 8, '#9aa3b5');
    c.restore();
  }
  function paper2(c, t) {
    const k = eo(at(t, T2.posle - .25, T2.sk + .2)); if (k <= 0) return;
    const kx = ei(at(t, T2.lift + .1, T2.lift + .55)); if (kx >= 1) return;
    c.save(); c.translate(lp(1500, 760, k) + 1000 * kx, 1500); c.rotate(-.07 * k + .3 * kx);
    castDots(c, -230, -170, 460, 340, 110, { st: 14 });
    rr(c, -230, -170, 460, 340, 6); cel(c, -230, -170, 460, 340, '#ece6d6', { hw: .03, sw: .15, gr: .14 }); rr(c, -230, -170, 460, 340, 6); lnB(c, 4, '#c9c1ae');
    tx(c, 'СКАНДАЛ', 0, -112, { f: 'U', w: 800, s: 74, c: B2.ink, ls: 2 }); c.fillStyle = B2.ink; c.fillRect(-200, -68, 400, 5);
    for (let i = 0; i < 5; i++) { c.fillStyle = '#b8ae98'; c.fillRect(30, -40 + i * 36, 170, 10); c.fillRect(-200, 90 + (i % 2) * 30, 200, 10) }
    rr(c, -200, -40, 200, 112, 4); fill(c, '#d1c9b6');
    c.restore();
  }
  // стик «Джула» (горизонтальный) → косое лезвие: 4 угла морфятся
  function stickBlade(c, t) {
    if (t < T2.posle) return;
    const kf = eio(at(t, T2.lift, T2.lift + .7)), on = bo(at(t, T2.juul - .25, T2.juul + .1));
    const S0 = [[620, 1468], [820, 1468], [820, 1500], [620, 1500]], B0 = [[BLD2.x0, BLD2.top], [BLD2.x1, BLD2.top], [BLD2.x1, BLD2.br], [BLD2.x0, BLD2.bl]];
    const kx = lp(1500, 760, eo(at(t, T2.posle - .25, T2.sk + .2))) - 760;
    let P = S0.map((p, i) => [lp(p[0] + kx, B0[i][0], kf), lp(p[1] - 30 * on * (1 - kf), B0[i][1], kf) - Math.sin(Math.PI * kf) * 220]);
    if (kf < .5) { c.save(); const cx = (P[0][0] + P[1][0]) / 2, cy = (P[0][1] + P[2][1]) / 2; c.translate(cx, cy); c.rotate(-.07 * (1 - kf * 2) + kf * .9 * Math.sin(Math.PI * kf * 2)); c.translate(-cx, -cy); }
    poly(c, P.flat()); const x0 = Math.min(...P.map(p => p[0])), x1 = Math.max(...P.map(p => p[0])), y0 = Math.min(...P.map(p => p[1])), y1 = Math.max(...P.map(p => p[1]));
    cel(c, x0, y0, x1 - x0, y1 - y0, mixc('#e7e9ef', B2.steel, kf), { hw: .05, sw: .22 }); poly(c, P.flat()); lnB(c, 4, '#ffffff');
    if (kf < .3) A(c, 1 - kf / .3, () => { c.fillStyle = '#2d3142'; c.fillRect(P[1][0] - 46, P[1][1], 46, P[2][1] - P[1][1]); circ(c, P[0][0] + 30, (P[0][1] + P[3][1]) / 2, 5, '#5eead4') });
    if (kf < .5) c.restore();
    if (kf > .6) { const ka = at(kf, .6, 1); c.save(); c.globalAlpha *= ka;
      poly(c, [P[3][0], P[3][1], P[2][0], P[2][1], P[2][0], P[2][1] - 26, P[3][0], P[3][1] - 26]); fill(c, '#ffffff');   // заточенная кромка
      c.fillStyle = '#2c3048'; c.fillRect(P[0][0] - 20, P[0][1] - 54, P[1][0] - P[0][0] + 40, 56); for (let i = 0; i < 4; i++) circ(c, P[0][0] + 50 + i * 150, P[0][1] + 30, 9, '#6b7593');
      const kfda = bo(at(t, T2.vl - .1, T2.vl + .3)); if (kfda > 0) { c.save(); c.translate((P[0][0] + P[1][0]) / 2, P[0][1] + 100); c.scale(kfda, kfda); rr(c, -92, -32, 184, 64, 8); lnB(c, 5, B2.red); tx(c, 'FDA · США', 0, 2, { f: 'M', w: 800, s: 30, c: B2.red }); c.restore() }
      c.restore() }
  }
  function chains2(c, t, dy) {
    const k = eo(at(t, T2.lift + .55, T2.lift + 1.0)); if (k <= 0) return;
    [BLD2.x0 + 60, BLD2.x1 - 60].forEach((x, j) => { for (let i = 0; i < 26; i++) { const y = BLD2.top + dy - 30 - i * 44; if (y < BLD2.top - 1300 * k) break;
      c.beginPath(); if (i % 2) c.ellipse(x, y, 7, 24, 0, 0, TAU); else c.ellipse(x, y, 16, 24, 0, 0, TAU); lnB(c, 7, i % 2 ? '#8590ad' : B2.steel) } });
  }
  function stock2(c, t) {
    const k = eo(at(t, T2.lift + .2, T2.lift + .8)); if (k <= 0) return;
    c.save(); c.translate(0, 500 * (1 - k));
    const cutT = i => T2.chop + (CX2[i] - BLD2.x0) / (BLD2.x1 - BLD2.x0) * .05;
    CRT2.forEach(([lab, col], i) => {
      const x = CX2[i], cut = i > 0 && i < 5 && t >= cutT(i), hop = T2.fl[i - 1] && t > T2.fl[i - 1] - .05 ? 34 * Math.sin(Math.PI * cl((t - T2.fl[i - 1] + .05) / .32)) : 0;
      const sh = i > 0 && i < 5 && t > T2.vk - .2 && t < T2.fl[0] - .1 ? Math.sin(t * 40 + i) * 3 : 0;
      c.save(); c.translate(x + sh, -hop);
      const top = cut ? STK2.cut : STK2.top;
      rr(c, -55, top, 110, STK2.y - top, cut ? 4 : 22); cel(c, -55, top, 110, STK2.y - top, col, { hw: .12 }); rr(c, -55, top, 110, STK2.y - top, cut ? 4 : 22); lnB(c, 4);
      if (!cut) { rr(c, -55, top, 110, 56, 22); fill(c, '#2d3142'); rr(c, -55, top, 110, 56, 22); lnB(c, 4) }
      else { c.beginPath(); c.ellipse(0, STK2.cut, 55, 12, 0, 0, TAU); fill(c, lit(col, .2)) }
      c.restore();
      if (cut) {   // верхушка отлетает
        const u = t - cutT(i), dir = i < 3 ? -1 : 1; c.save(); c.translate(x + dir * (180 + 60 * i % 3) * u, STK2.cut - 380 * u + 1400 * u * u); c.rotate(dir * 4 * u);
        rr(c, -55, STK2.top - STK2.cut, 110, STK2.cut - STK2.top, 22); cel(c, -55, STK2.top - STK2.cut, 110, STK2.cut - STK2.top, col, { hw: .12 }); rr(c, -55, STK2.top - STK2.cut, 110, 56, 22); fill(c, '#2d3142'); rr(c, -55, STK2.top - STK2.cut, 110, STK2.cut - STK2.top, 22); lnB(c, 4); c.restore();
      }
    });
    rr(c, 100, STK2.y, 880, 90, 8); cel(c, 100, STK2.y, 880, 90, B2.wood, { hw: .04, gr: .12 }); rr(c, 100, STK2.y, 880, 90, 8); lnB(c, 4);
    CRT2.forEach(([lab], i) => { const on = i > 0 && i < 5 && T2.fl[i - 1] && t > T2.fl[i - 1] - .05; tx(c, lab, CX2[i], STK2.y + 46, { f: 'M', w: 800, s: 25, c: on ? '#fde68a' : B2.cream, mw: 128 }) });
    if (t > T2.chop) DR2.forEach((d, j) => { const u = t - T2.chop - (j % 4) * .015; if (u <= 0) return; const x = CX2[d.ci] + d.vx * u * .6, y = STK2.cut + d.vy * u + 1600 * u * u; if (y > STK2.y + 400) return; drop(c, x, y, d.r, CRT2[d.ci][1], Math.atan2(d.vy + 3200 * u, d.vx * .6) + Math.PI / 2) });
    c.restore();
  }
  function bladeY(t) {   // лезвие висит, на «рубят» дёргается вверх, на «под нож» падает
    let y = 0; if (t > T2.rub - .1) y -= 70 * eo(at(t, T2.rub - .1, T2.rub + .35)); y += Math.sin(t * 2.2) * 6 * at(t, T2.lift + .7, T2.lift + 1.2);
    if (t > T2.drop) y = lp(y, STK2.cut - BLD2.br + 40 + 4, ei(at(t, T2.drop, T2.chop))); return y;
  }
  function office(c, t) {
    c.fillStyle = B2.bg2; c.fillRect(-1600, -3000, 9000, 6000);
    c.save(); c.globalAlpha *= .9; for (let i = 0; i < 7; i++) { c.fillStyle = i % 2 ? '#2b2f50' : '#272b49'; c.fillRect(-1600, -2400 + i * 520, 4300, 520) } c.restore();
    beam(c, 540, -40, 540, 1500, 60, 520, '#fde68a', .1);
    c.fillStyle = '#3a2a22'; c.fillRect(-1600, 1640, 3100, 1400); c.beginPath(); c.moveTo(-1600, 1640); c.lineTo(1500, 1640); lnB(c, 4, '#c9a27e');
    sheet2(c, t); calendar2(c, t); paper2(c, t);
    // гильотина над листом
    stock2(c, t);
    const by = bladeY(t); chains2(c, t, by); c.save(); c.translate(0, t > T2.lift + .7 ? by : 0); stickBlade(c, t); c.restore();
    if (t > T2.end - .3 && typeof b3Draw === 'function') b3Draw(c, t);
  }
  function b2Shot(c, t) {
    if (!T2) b2Init(); const q = camObj(camAt(K2, t));
    if (t > T2.chop && t < T2.chop + .45) { const s = 22 * (1 - at(t, T2.chop, T2.chop + .45)); q.x += Math.sin(t * 97) * s / q.z * .05; q.y += Math.cos(t * 83) * s / q.z * .05 }
    if (t < TIN2) {
      const kr = eio(at(t, T2.a, T2.rev));
      if (kr < 1) { b1Shot(c, T1.end - .001) }
      const R = lp(EM.r, 1400, kr);
      c.save(); c.beginPath(); c.arc(EM.x, EM.y, R, 0, TAU); c.clip(); c.translate(540, 960); c.scale(q.z, q.z); c.translate(-q.x, -q.y); capitol(c, t); c.restore();
      if (kr < 1) { const k = R / 95; ring(c, EM.x, EM.y, 87 * k, B2.red, 7 * k * (1 - kr)); ring(c, EM.x, EM.y, 78 * k, B2.red, 2.5 * k * (1 - kr)); ring(c, EM.x, EM.y, R, B2.ln, 3 * k * (1 - kr) + 1) }
    } else { const o = camO2(q); c.save(); c.translate(540, 960); c.rotate(o.r); c.scale(o.z, o.z); c.translate(-o.x, -o.y); office(c, t); c.restore();
      speedLines(c, o, camO2(camObj(camAt(K2, t + 1 / 30))), t) }
  }
