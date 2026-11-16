  // ================= мир 2: стол с сигаретой → архив табачников → патент 1979 → химия на листе → чертёж «Джула» → ноутбук =================
  let W2K = null, T2 = {}, TW = 0, FOLD = null;
  const SH = { x0: 190, x1: 890 }, LAP = { cx: 1300, cy: 3560, w: 760, h: 500, iw: 680, ih: 425 };
  const DIA = { L: [350, 2830], R: [730, 2830], dish: [540, 3045] };
  const PA = [[350, 2768], [350, 2740], [420, 2740], [470, 2905], [610, 2905], [470, 2945], [610, 2945], [470, 2985], [540, 2985], [540, 3018]];
  const PB = [[730, 2768], [730, 2740], [660, 2740], [610, 2905], [470, 2905], [610, 2945], [470, 2945], [610, 2985], [540, 2985], [540, 3018]];
  function w2Init() {
    const p = PH; TW = p[10].b + .18;
    T2 = { ubit: Wd('убить'), ro: Wd('роешься'), pull: Wd('архивах'), xr0: Wd('табачных') + .05, xr1: Wd('компаний') + .45, find: Wd('находишь'), st: Wd('семьдесят'), ffall: p[4].b - .1,
      nic: Wd('никотину'), kis: Wd('кислоту'), sol: Wd('солью'), der: Wd('дерёт'), sil: Wd('сильнее'), y15: Wd('пятнадцатом'), vyp: Wd('выпускаешь'),
      fl: Wd('флешку'), zar: Wd('заряжается'), plug: Wd('ноутбука') - .05, mango: Wd('манго'), krem: Wd('крем-брюле'), myata: Wd('мята'), odn: Wd('одном'), cel: Wd('целой'), pach: Wd('пачки') };
    W2K = [KY(TAB, 920, 900, 51), KY(TAB + .5, 720, 900, 2.4), KY(TAB + 1.0, 560, 900, 1.06), KY(T2.ubit + .55, 545, 1000, 1.0), KY(p[3].a - .1, 540, 2350, .9), KY(p[3].a + .3, 470, 2640, .92),
      KY(T2.pull - .05, 600, 2660, .95), KY(T2.pull + .45, 540, 2700, 1.0), KY(p[4].a, 540, 2690, 1.02), KY(p[4].a + .7, 540, 2470, 1.06), KY(p[5].a - .2, 540, 2440, 1.1), KY(p[5].a + .45, 540, 2885, 1.7),
      KY(p[6].a, 540, 2900, 1.74), KY(p[6].a + .5, 540, 3300, 1.75), KY(p[7].a, 540, 3310, 1.78), KY(p[7].a + .5, 560, 3665, 1.55), KY(p[8].a, 560, 3680, 1.6), KY(p[8].a + .7, 820, 3670, 1.15),
      KY(T2.plug + .05, 1120, 3660, .95), KY(p[9].a, 1300, 3580, 1.3), KY(p[9].a + .45, 1300, 3560, 1.62), KY(TW - .25, 1300, 3560, 1.66), KY(TW, 2300, 3560, 1.66)];
    FOLD = []; const YRS = ['1963', '1966', '1971', '1973', '1976', '1981', '1984', '1987', '1990', '1994', '1958', '1969'], COLS = ['#1e3a8a', '#1d4ed8', '#2b4a9a', '#22336b', '#2f5bb7'];
    [2200, 2650, 3100].forEach((ry, r) => { const go = (dir) => { let x = r === 1 ? 540 + dir * 55 : 540 + dir * (H1(r) * 40); for (let i = 0; i < 16; i++) { const w = 70 + H1(r * 31 + i * 7 + dir) * 34;
      const cx = x + dir * w / 2; FOLD.push({ x: cx, y: ry, w: w - 6, h: 300 + H1(i * 3 + r) * 34, col: COLS[Math.floor(H1(i * 5 + r * 2 + dir) * 5)], yr: YRS[Math.floor(H1(i * 11 + r * 7 + dir * 3) * 12)], r, i: i * dir }); x += dir * w } };
      go(-1); go(1); if (r !== 1) FOLD.push({ x: 540, y: ry, w: 84, h: 316, col: COLS[r], yr: YRS[r + 4], r, i: 0 }) });
  }
  function cigW2(c, t) {
    const sp = at(t, T2.ubit + .12, T2.ubit + .3), tf = t - (T2.ubit + .35), burn = 1 - at(t, T2.ubit, T2.ubit + .8);
    const half = (x0, x1, side) => {   // половинка: фильтр слева, бумага, огонёк справа
      c.save(); rr(c, x0, 874, x1 - x0, 52, side ? 4 : 26); fill(c, '#f4f1ea');
      c.save(); rr(c, x0, 874, x1 - x0, 52, 26); c.clip(); if (x0 < 330) { c.fillStyle = '#d99a4e'; c.fillRect(160, 874, 170, 52); for (let i = 0; i < 14; i++) circ(c, 175 + H1(i) * 150, 880 + H1(i * 3) * 40, 3, 'rgba(120,70,20,.35)') }
      c.fillStyle = 'rgba(30,35,64,.1)'; c.fillRect(x0, 906, x1 - x0, 20); c.restore();
      rr(c, x0, 874, x1 - x0, 52, 26); lnW(c, 4, PJ.ink);
      if (side && x1 >= 900) { glow(c, 920, 900, 90, '#fb923c', .5 * burn); ember(c, 920, 900, 26, t, burn) }
      c.restore();
    };
    if (sp <= 0) { half(160, 920, 1); }
    else {
      const g = 2600, dt = Math.max(0, tf), fall = .5 * g * dt * dt, sh = 1 / (1 + dt * 1.4), al = 1 - at(dt, .7, 1.05);
      [[160, 560, -1], [560, 920, 1]].forEach(([x0, x1, d]) => { const cx = (x0 + x1) / 2; c.save(); c.globalAlpha *= al; c.translate(cx + d * 30 * eo(sp) + d * dt * 140, 900 + fall); c.rotate(d * (.18 * eo(sp) + dt * 1.6)); c.scale(sh, sh); c.translate(-cx, -900); half(x0, x1, d > 0 ? 1 : 0); c.restore() });
    }
    // красная черта «убить»
    const ks = at(t, T2.ubit - .05, T2.ubit + .15), kf = 1 - at(t, T2.ubit + .5, T2.ubit + .9);
    if (ks > 0 && kf > 0) { c.save(); c.globalAlpha *= kf; c.beginPath(); c.moveTo(500, 690); c.lineTo(lp(500, 620, eo(ks)), lp(690, 1110, eo(ks))); lnW(c, 22, PJ.red); c.restore() }
  }
  function tableW2(c, t) {
    c.fillStyle = '#3a2920'; c.fillRect(-900, -600, 2900, 2100);
    for (let i = 0; i < 22; i++) { const y = -560 + i * 95 + H1(i) * 30; c.beginPath(); c.moveTo(-900, y); c.bezierCurveTo(0, y + 30 * Math.sin(i), 900, y - 20, 2000, y + 10); lnW(c, 3, 'rgba(20,12,8,.35)') }
    glow(c, 560, 900, 760, '#ffd479', .16);
    c.fillStyle = '#24170f'; c.fillRect(-900, 1500, 2900, 70); c.fillStyle = '#191c30'; c.fillRect(-900, 1570, 2900, 2900);
  }
  function folderSpine(c, f, t) {
    let lift = 0; for (let j = 0; j < 7; j++) { const tj = T2.ro - .1 + j * .3; if (Math.floor(H1(j * 13 + 1) * 9) === ((f.i + 9) % 9) && f.r === j % 3) lift += 46 * bump(t, tj, .4) }
    const y0 = f.y + 150 - f.h - lift;
    rr(c, f.x - f.w / 2, y0, f.w, f.h, 6); fill(c, f.col); rr(c, f.x - f.w / 2, y0, f.w, f.h, 6); lnW(c, 4, PJ.ink);
    rr(c, f.x - f.w / 2 + 10, y0 + 30, f.w - 20, 70, 4); fill(c, '#e8e3d6'); tx(c, f.yr, f.x, y0 + 66, { f: 'O', w: 700, s: 22, c: PJ.ink });
    c.beginPath(); c.arc(f.x, y0 + f.h - 50, 11, 0, TAU); lnW(c, 4, 'rgba(238,242,247,.5)');
  }
  function shelvesW2(c, t, v) {
    [2200, 2650, 3100].forEach(ry => { c.fillStyle = '#1b1f36'; c.fillRect(-900, ry - 220, 2900, 380); });
    FOLD.forEach(f => { if (f.x + f.w < v.x0 - 50 || f.x - f.w > v.x1 + 50) return; folderSpine(c, f, t) });
    [2200, 2650, 3100].forEach(ry => { c.fillStyle = '#4a3526'; c.fillRect(-900, ry + 150, 2900, 30); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(-900, ry + 180, 2900, 16) });
  }
  function folder79(c, t, front) {   // папка 1979: корешок → разворачивается лицом, рентген, листа край сверху; потом падает
    const kp = eio(at(t, T2.pull, T2.pull + .45)), ff = Math.max(0, t - T2.ffall);
    const w = lp(104, 760, kp), h = lp(330, 980, kp), cx = 540, cy = lp(2650 - 15, 2700, kp) + 700 * eio(at(t, T2.find, T2.find + .7)) + 2400 * ff * ff, rot = ff * .9;
    if (front && cy - h / 2 > 4200) return;
    c.save(); c.translate(cx, cy); c.rotate(rot);
    if (kp > 0) glow(c, 0, 0, w * .9, '#fbbf24', .18 * (1 - kp) + .3 * bump(t, T2.pull - .25, .5));
    rr(c, -w / 2 + 14, -h / 2 + 20, w, h, 14); fill(c, 'rgba(5,8,20,.4)');
    rr(c, -w / 2, -h / 2, w, h, 14); fill(c, '#1d4ed8'); c.save(); rr(c, -w / 2, -h / 2, w, h, 14); c.clip();
    poly(c, [-w / 2, h * .1, w / 2, -h * .2, w / 2, h / 2, -w / 2, h / 2]); fill(c, '#1e40af');
    // рентген
    const kx = at(t, T2.xr0, T2.xr1), sy = -h / 2 + h * kx;
    if (kx > 0) { c.save(); c.beginPath(); c.rect(-w / 2, -h / 2, w, sy + h / 2); c.clip(); c.fillStyle = '#052e1a'; c.fillRect(-w / 2, -h / 2, w, h);
      for (let i = 0; i < 9; i++) { c.fillStyle = 'rgba(74,222,128,.08)'; c.fillRect(-w / 2, -h / 2 + i * h / 9, w, 2) }
      rr(c, -w * .38, -h * .4, w * .76, h * .82, 8); lnW(c, 5, '#4ade80'); tx(c, 'ПАТЕНТ', 0, -h * .32, { f: 'U', w: 800, s: w * .07, c: '#4ade80' });
      for (let i = 0; i < 5; i++) { c.fillStyle = 'rgba(74,222,128,.55)'; c.fillRect(-w * .3, -h * .24 + i * 26, w * (.6 - (i % 2) * .15), 9) }
      nicMol(c, 0, h * .05, w / 760 * 1.3, '#4ade80', 6); c.restore();
      if (kx < 1) { c.fillStyle = '#86efac'; c.fillRect(-w / 2, sy - 5, w, 10); glow(c, 0, sy, w * .6, '#4ade80', .5) } }
    c.restore();
    rr(c, -w / 2, -h / 2, w, h, 14); lnW(c, 6, PJ.ink);
    A(c, at(kp, .6, 1) * (1 - at(kx, 0, .25)), () => { rr(c, -w * .3, -h * .3, w * .6, h * .2, 10); fill(c, '#e8e3d6'); tx(c, '1979', 0, -h * .2, { f: 'O', w: 700, s: w * .13, c: PJ.ink }); tx(c, 'АРХИВ · ТАБАЧНЫЕ КОМПАНИИ', 0, h * .02, { f: 'M', w: 800, s: w * .035, c: '#dbe4ff', mw: w * .8 }) });
    if (kp <= 0) { rr(c, -w / 2 + 10, -h / 2 + 30, w - 20, 70, 4); fill(c, '#e8e3d6'); tx(c, '1979', 0, -h / 2 + 66, { f: 'O', w: 700, s: 22, c: PJ.ink }) }
    c.restore();
  }
  function sheetTop(t) { return lp(2700, 2150, eio(at(t, T2.find - .05, T2.find + .7))) }
  function sheetW2(c, t) {
    const y0 = sheetTop(t), dy = y0 - 2150; if (t < T2.find - .05) return;
    c.save(); c.translate(0, dy);
    c.save(); c.translate(18, 24); rr(c, SH.x0, 2150, 700, 1800, 8); fill(c, 'rgba(5,8,20,.4)'); c.restore();
    rr(c, SH.x0, 2150, 700, 1800, 8); fill(c, PJ.paper); rr(c, SH.x0, 2150, 700, 1800, 8); lnW(c, 4, PJ.paper2);
    tx(c, 'ПАТЕНТ', 540, 2232, { f: 'U', w: 800, s: 58, c: PJ.inkP, ls: 4 }); tx(c, 'ТАБАЧНАЯ КОМПАНИЯ · США', 540, 2292, { f: 'M', w: 800, s: 22, c: '#6b6a7a', ls: 2 });
    tx(c, 'НИКОТИНОВЫЕ СОЛИ', 540, 2338, { f: 'O', w: 700, s: 34, c: PJ.inkP });
    for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(42,47,74,.25)'; c.fillRect(240, 2385 + i * 24, 600 - (i === 2 ? 180 : 0), 9) }
    nicMol(c, 540, 2560, 1.2, PJ.inkP, 6);
    c.beginPath(); c.moveTo(230, 2660); c.lineTo(850, 2660); lnW(c, 3, 'rgba(42,47,74,.25)');
    diagram(c, t); gauges(c, t);
    c.beginPath(); c.moveTo(230, 3505); c.lineTo(850, 3505); lnW(c, 3, 'rgba(42,47,74,.25)');
    tx(c, 'ЧЕРТЁЖ УСТРОЙСТВА', 540, 3540, { f: 'M', w: 800, s: 22, c: '#6b6a7a', ls: 3 });
    for (let i = 0; i < 2; i++) { c.fillStyle = 'rgba(42,47,74,.2)'; c.fillRect(240, 3880 + i * 24, 600 - i * 220, 9) }
    stampC(c, 760, 2300, 74, at(t, T2.st - .12, T2.st + .25), 'ПАТЕНТ', '1979');
    c.restore();
  }
  function flask(c, x, y, col, lev, lab) {
    poly(c, [x - 16, y - 70, x + 16, y - 70, x + 16, y - 26, x + 64, y + 50, x - 64, y + 50, x - 16, y - 26]);
    c.save(); c.clip(); c.fillStyle = col; c.fillRect(x - 70, y + 50 - 76 * lev, 140, 80); c.restore();
    poly(c, [x - 16, y - 70, x + 16, y - 70, x + 16, y - 26, x + 64, y + 50, x - 64, y + 50, x - 16, y - 26]); lnW(c, 6, PJ.inkP);
    tx(c, lab, x, y + 84, { f: 'U', w: 800, s: 26, c: PJ.inkP });
  }
  function diagram(c, t) {
    const kA = at(t, T2.nic - .1, T2.nic + 1.3), kB = at(t, T2.kis - .1, T2.kis + 1.2);
    flask(c, DIA.L[0], DIA.L[1], '#f5b041', .8 - .3 * kA, 'НИКОТИН'); flask(c, DIA.R[0], DIA.R[1], '#7dd3fc', .8 - .3 * kB, 'КИСЛОТА');
    pathL(c, PA); lnW(c, 7, PJ.inkP); pathL(c, PB); lnW(c, 7, PJ.inkP);
    pathL(c, PA, kA); lnW(c, 4, '#f5b041'); pathL(c, PB, kB); lnW(c, 4, '#7dd3fc');
    for (let i = 0; i < 4; i++) { const ua = kA * 1.25 - i * .09, ub = kB * 1.25 - i * .09;
      if (ua > 0 && ua < 1) { const [x, y] = along(PA, ua); circ(c, x, y, 10, '#f5b041'); ring(c, x, y, 10, PJ.inkP, 3) }
      if (ub > 0 && ub < 1) { const [x, y] = along(PB, ub); circ(c, x, y, 10, '#7dd3fc'); ring(c, x, y, 10, PJ.inkP, 3) } }
    // чашка и кристалл соли
    const [dx, dy] = DIA.dish; c.beginPath(); c.ellipse(dx, dy + 12, 92, 22, 0, 0, Math.PI); lnW(c, 6, PJ.inkP); c.beginPath(); c.moveTo(dx - 92, dy + 12); c.lineTo(dx + 92, dy + 12); lnW(c, 6, PJ.inkP);
    const kc = spr(at(t, T2.sol - .35, T2.sol + .35));
    if (kc > 0) { c.save(); c.translate(dx, dy + 6); c.scale(kc, kc); glow(c, 0, -40, 120, '#9fdcf7', .5);
      poly(c, [-40, 0, -46, -54, 0, -88, 46, -54, 40, 0]); fill(c, '#9fdcf7'); poly(c, [-46, -54, 0, -88, 46, -54, 0, -40]); fill(c, '#e0f2fe');
      poly(c, [-40, 0, -46, -54, 0, -88, 46, -54, 40, 0]); lnW(c, 5, PJ.inkP); c.restore();
      A(c, at(t, T2.sol, T2.sol + .2), () => { tx(c, 'СОЛЬ', dx + 170, dy - 30, { f: 'U', w: 800, s: 44, c: PJ.red }); c.beginPath(); c.moveTo(dx + 110, dy - 4); c.lineTo(dx + 110 + 120 * eo(at(t, T2.sol + .1, T2.sol + .4)), dy - 4); lnW(c, 8, PJ.red) }) }
  }
  function gauges(c, t) {
    const v1 = lp(.88, .07, eio(at(t, T2.der - .25, T2.der + .35))) + .02 * Math.sin(t * 23), v2 = lp(.3, .96, bo(at(t, T2.sil - .3, T2.sil + .3))) + .015 * Math.sin(t * 19);
    dialJ(c, 372, 3330, 140, v1, 'ЖЖЕНИЕ В ГОРЛЕ'); dialJ(c, 708, 3330, 140, v2, 'НИКОТИН');
  }
  // ноутбук: экран (свой мир 680×425), основание, порт слева
  function laptop(c, t, dx) {
    const lit = at(t, T2.plug, T2.plug + .3); c.save(); c.translate(dx, 0);
    const X0 = LAP.cx - LAP.w / 2, Y0 = LAP.cy - LAP.h / 2;
    c.save(); c.translate(20, 26); rr(c, X0, Y0, LAP.w, LAP.h + 70, 22); fill(c, 'rgba(5,8,20,.35)'); c.restore();
    rr(c, X0, Y0, LAP.w, LAP.h, 22); fill(c, '#11131f'); rr(c, X0, Y0, LAP.w, LAP.h, 22); lnW(c, 5, PJ.ln);
    c.save(); c.translate(LAP.cx - LAP.iw / 2, LAP.cy - LAP.ih / 2); c.beginPath(); c.rect(0, 0, LAP.iw, LAP.ih); c.clip();
    c.fillStyle = '#0b1020'; c.fillRect(0, 0, LAP.iw, LAP.ih); if (lit > 0) { c.globalAlpha = lit; screenJ(c, t); c.globalAlpha = 1 }
    poly(c, [LAP.iw * .55, 0, LAP.iw * .7, 0, LAP.iw * .35, LAP.ih, LAP.iw * .2, LAP.ih]); fill(c, 'rgba(255,255,255,.04)');
    c.restore();
    poly(c, [920, 3812, 1680, 3812, 1720, 3870, 880, 3870]); fill(c, '#4b5165'); poly(c, [920, 3812, 1680, 3812, 1720, 3870, 880, 3870]); lnW(c, 5, PJ.ln);
    rr(c, 1240, 3826, 120, 14, 6); fill(c, '#3a3f52'); rr(c, 895, 3834, 18, 16, 3); fill(c, '#0b1020');
    c.restore();
  }
  function screenJ(c, t) {   // содержимое экрана: вкусы и весы (у мира 3 то же самое — не нужно)
    const W = LAP.iw, H = LAP.ih; c.fillStyle = '#f6f3ea'; c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(42,47,74,.06)'; for (let x = 0; x < W; x += 34) c.fillRect(x, 0, 2, H); for (let y = 0; y < H; y += 34) c.fillRect(0, y, W, 2);
    const PODS = [['МАНГО', '#f97316', T2.mango], ['КРЕМ-БРЮЛЕ', '#d4a373', T2.krem], ['МЯТА', '#22c55e', T2.myata]];
    const ks = at(t, T2.odn - .3, T2.odn + .3);   // переход к весам: манго едет на чашу, остальные уходят
    const piv = [340, 112], ang = lp(.22, 0, spr(at(t, T2.pach - .25, T2.pach + .45))) * at(t, T2.odn, T2.odn + .3), bl = 210;
    const pan = d => [piv[0] + d * Math.cos(ang) * bl, piv[1] + d * Math.sin(ang) * bl + 120];
    if (ks > 0) {
      c.fillStyle = PJ.inkP; c.fillRect(334, 112, 12, 270); rr(c, 270, 372, 140, 22, 8); fill(c, PJ.inkP);
      c.save(); c.translate(piv[0], piv[1]); c.rotate(ang); c.globalAlpha *= ks; rr(c, -bl - 10, -7, bl * 2 + 20, 14, 7); fill(c, PJ.inkP); c.restore(); circ(c, piv[0], piv[1], 13, PJ.inkP);
      [-1, 1].forEach(d => { const [px, py] = pan(d), ex = piv[0] + d * Math.cos(ang) * bl, ey = piv[1] + d * Math.sin(ang) * bl;
        c.beginPath(); c.moveTo(ex, ey); c.lineTo(px - 60, py); c.moveTo(ex, ey); c.lineTo(px + 60, py); lnW(c, 3, PJ.inkP); c.beginPath(); c.ellipse(px, py + 4, 76, 14, 0, 0, Math.PI); lnW(c, 6, PJ.inkP); c.beginPath(); c.moveTo(px - 76, py + 4); c.lineTo(px + 76, py + 4); lnW(c, 6, PJ.inkP) });
      const kp = eo(at(t, T2.cel - .35, T2.cel + .1)), [rx, ry] = pan(1); packJ(c, rx, lp(-140, ry - 54, kp), .5);
      A(c, at(t, T2.pach, T2.pach + .25), () => tx(c, '1 КАРТРИДЖ = 1 ПАЧКА', 340, 38, { f: 'U', w: 800, s: 30, c: PJ.red }));
    }
    PODS.forEach(([lab, col, tw0], i) => { const k = bo(at(t, tw0 - .3, tw0 + .1)); if (k <= 0) return;
      let x = lp(340, 170 + i * 170, k), y = lp(470, 200, k), s = .85, a = 1;
      if (ks > 0) { if (i === 0) { const [lx, ly] = pan(-1); x = lp(x, lx, eio(ks)); y = lp(y, ly - 66, eio(ks)); s = lp(.85, .6, ks) } else { a = 1 - ks; s *= 1 - .5 * ks } }
      podJ(c, x, y, s, col, { lab: ks > 0 ? '' : lab, a, r: (1 - k) * .4 * (i - 1) }) });
  }
  function devW2(c, t) {   // чертёж «Джула» на листе → настоящий → флешка → летит в порт
    const kb = at(t, PH[7].a - .1, PH[7].a + .6), kf = at(t, T2.vyp - .2, T2.vyp + .45), kl = eo(at(t, T2.vyp + .2, T2.vyp + .6)), km = eio(at(t, T2.zar - .25, T2.plug));
    if (kb <= 0) return;
    const x = lp(540, 900 - 150, km), y = lp(3665 - 14 * kl, 3842, km) - Math.sin(Math.PI * km) * 120, L = lp(560 * (1 + .05 * kl), 300, km);
    if (kb < 1) { c.save(); c.beginPath(); c.rect(240, 3550, 620 * kb, 260); c.clip() }
    juulDev(c, x, y, L, { k: kf, bp: 1, sh: 26 * kl * (1 - km), led: at(t, T2.plug, T2.plug + .2) });
    if (kb < 1) c.restore();
    A(c, kb * (1 - kf), () => { c.save(); c.setLineDash([10, 8]); c.beginPath(); c.moveTo(260, 3745); c.lineTo(820, 3745); lnW(c, 3, PJ.inkP); c.restore();
      tx(c, '≈ 9,5 СМ', 540, 3775, { f: 'M', w: 800, s: 24, c: PJ.inkP }) });
    const kd = at(t, T2.fl - .25, T2.fl + .1) * (1 - at(t, T2.zar - .3, T2.zar));   // как флешка: пунктир флешки рядом
    if (kd > 0) { c.save(); c.globalAlpha *= kd; c.setLineDash([12, 9]); rr(c, 330, 3410, 330, 76, 18); lnW(c, 5, PJ.red); rr(c, 660, 3426, 56, 44, 4); lnW(c, 5, PJ.red); c.restore();
      tx(c, '≈ ФЛЕШКА', 495, 3450, { f: 'U', w: 800, s: 26, c: PJ.red, a: kd }) }
  }
  function drawW2(c, t, q) {
    const v = viewRect(q);
    c.save(); applyCam(c, q);
    tableW2(c, t);
    if (v.y1 > 1800) shelvesW2(c, t, v);
    const dim = .62 * at(t, T2.pull, T2.pull + .5) + .34 * at(t, PH[5].a, PH[5].a + 1.2); if (dim > 0) { c.fillStyle = 'rgba(12,14,30,' + dim + ')'; c.fillRect(-900, 1570, 2900, 2900) }
    if (v.y1 > 1800 && t < T2.pull + .01) folder79(c, t, 0);
    sheetW2(c, t);
    if (t >= T2.pull + .01) folder79(c, t, 1);
    devW2(c, t);
    const dxl = 1100 * (1 - eo(at(t, T2.zar - .45, T2.zar + .15))); if (dxl < 1099) laptop(c, t, dxl);
    if (v.y0 < 1500 || t < T2.ubit + 1.6) cigW2(c, t);
    c.restore();
  }
  function shotW2(c, t) { if (!W2K) w2Init(); const q = camOf(W2K, t); drawW2(c, t, q); speedTrail(c, camOf(W2K, t - 1 / 30), q, at(t, TW - .3, TW - .1)) }
