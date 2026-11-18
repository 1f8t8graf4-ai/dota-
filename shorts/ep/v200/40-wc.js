  // ================= мир C (фразы 3–6): дом в разрезе. Внизу — «рынок»: круг рынка на стене серых пачек; наверху — лаборатория с мышью и лавка 1950-х;
  // над крышей — ночной Чикаго. Мир C вложен в торец сигареты мира 2: круг рынка = красный торец (камера ныряет в него).
  let TC = null, KC = null, NC2 = null;
  const MK = { x: 540, y: 860, R: 400 }, SLIT = .045;   // круг рынка; щель «Мальборо» — 2,6° (0,25 % — это 0,9°, тоньше не видно)
  const SLAB = [-420, -300], TOPY = -900, ROOF = [-2520, -2400], WALLX = [1480, 1560], SHOPX = 3900;
  const GRAYS = ['#5B5866', '#6C6977', '#4D4A57', '#7A7784'];
  function wcInit() {
    const w = (s, q, n) => Ws(s, q, n);
    TC = { a3: SA('s3'), pyat: w('s3', 'пятьдесят'), gor: w('s3', 'горстка'), zhen: w('s3', 'женщин'), chet: w('s3', 'четверть'), proc: w('s3', 'процента'), ryn: w('s3', 'рынка'), umer: w('s3', 'умерла'),
      spas: w('s4', 'спас'), strah: w('s4', 'страх'), uch: w('s4', 'учёные'), nam: w('s4', 'намазали'), smol: w('s4', 'смолой'), vyr: w('s4', 'выросли'), op: w('s4', 'опухоли'), amer: w('s4', 'америка'),
      vperv: w('s4', 'впервые'), dep: w('s4', 'депрессии'), stala: w('s4', 'стала'), men: w('s4', 'меньше'),
      kur: w('s5', 'курильщики'), bros: w('s5', 'бросились'), filt: w('s5', 'фильтром'), muzh: w('s5', 'мужчины'), stesn: w('s5', 'стеснялись'), schit: w('s5', 'считалось'), nezh: w('s5', 'неженок'),
      fil: w('s6', 'филип'), dar: w('s6', 'дарит'), vtor: w('s6', 'вторую'), filtr: w('s6', 'фильтр'), zhest: w('s6', 'жёсткую'), pach: w('s6', 'пачку'), otkr: w('s6', 'открывают'), shch: w('s6', 'щелчком'),
      vseh: w('s6', 'всех'), vidu: w('s6', 'виду'), chik: w('s6', 'чикагского'), rekl: w('s6', 'рекламщика'), leo: w('s6', 'лео'), bern: w('s6', 'бёрнетта'), end: SA('s7') - .02 };
    const a = TC;
    KC = [KY(a.pyat + .45, 540, 880, .96), KY(a.gor + .1, 540, 850, 1.0), KY(a.gor + .95, 546, 650, 1.38), KY(a.proc + .35, 545, 690, 1.24), KY(a.umer + .05, 548, 600, 1.3),
      KY(a.spas + .12, 552, 330, 1.22), KY(a.strah + .05, 470, -930, 1.12), KY(a.nam + .1, 430, -1060, 1.42), KY(a.smol + .2, 425, -1080, 1.55), KY(a.op + .25, 420, -1086, 1.64),
      KY(a.amer + .6, 780, -1080, .92), KY(a.men + .15, 960, -1100, .8), KY(a.bros + .45, 1650, -1060, .72), KY(a.filt + .35, 2350, -1010, .7), KY(a.muzh + .45, 2700, -1020, .74),
      KY(a.nezh - .45, 3010, -1080, 1.12), KY(a.nezh + .35, 3040, -1110, 1.32), KY(a.fil + .35, 3170, -1090, 1.14), KY(a.zhest + .05, 3200, -1080, 1.24),
      KY(a.otkr + .05, 3205, -1205, 1.72), KY(a.shch + .28, 3200, -1170, 1.42), KY(a.vidu, 3130, -1130, .94), KY(a.chik + .35, 3200, -1850, .8), KY(a.rekl + .35, 3240, -2950, .62),
      KY(a.leo + .05, 3420, -3260, .6), KY(a.bern - .02, BW.x + BW.wx, BW.y + BW.wy - 30, 1.05), KY(a.end - .32, BW.x + BW.wx, BW.y + BW.wy, 4.4), KY(a.end, BW.x + BW.wx, BW.y + BW.wy, 14.6)];   // нырок в окно — за 0,8 с, без рывка   // окно 200×140 закрывает кадр: дальше — мир 7
    // круг рынка = торец сигареты мира 2: радиус торца — LIP.bw / 2
    const m = (LIP.bw / 2) / MK.R; NC2 = { x: LIP.x, y: T2.top + (960 - MK.y) * m, m };
  }
  // ---------- «рынок»: стена серых пачек, прилавок ----------
  function packWall(c, q, x0, x1, y0, y1) {
    const v = viewRect(q), ax = Math.max(x0, v.x0 - 120), bx = Math.min(x1, v.x1 + 120), ay = Math.max(y0, v.y0 - 180), by = Math.min(y1, v.y1 + 180); if (ax >= bx || ay >= by) return;
    c.fillStyle = '#2A2630'; c.fillRect(ax, ay, bx - ax, by - ay);
    const SX = 120, SY = 190;
    for (let j = Math.floor((ay - y0) / SY); y0 + j * SY < by; j++) { const yy = y0 + j * SY; if (yy + SY < ay) continue;
      c.fillStyle = '#3A3542'; c.fillRect(ax, yy + 158, bx - ax, 14);   // полка
      for (let i = Math.floor((ax - x0) / SX) - 1; x0 + i * SX < bx; i++) { const xx = x0 + i * SX + (j % 2) * 30, col = GRAYS[Math.floor(H1(i * 3.1 + j * 7.7) * 4)], h = 120 + Math.floor(H1(i + j * 5) * 3) * 10;
        c.fillStyle = col; c.fillRect(xx + 14, yy + 158 - h, 86, h); c.fillStyle = shd(col, .25); c.fillRect(xx + 76, yy + 158 - h, 24, h); c.fillStyle = lit(col, .18); c.fillRect(xx + 14, yy + 158 - h, 86, h * .3) }
    }
  }
  // ---------- круг рынка: красный → серый с щелью; лупа с 5 женщинами; щель становится сигаретой с огоньком у края ----------
  function marketDisc(c, t) {
    const a = TC, { x, y, R } = MK, sw = eio(at(t, a.gor - .15, a.gor + .75)), sl = SLIT, top = -Math.PI / 2;
    castCirc(c, x, y, R, 150, { col: 'rgba(8,6,14,.5)', st: 16 });
    circ(c, x, y, R, C3.red);
    if (sw > 0) {   // серые марки заливают круг по часовой, «Мальборо» остаётся щелью наверху
      const a0 = top + sl / 2, a1 = a0 + (TAU - sl) * sw;
      for (let k = 0; k < 9; k++) { const s0 = a0 + (TAU - sl) * k / 9, s1 = a0 + (TAU - sl) * (k + 1) / 9; if (s0 >= a1) break;
        c.beginPath(); c.moveTo(x, y); c.arc(x, y, R, s0, Math.min(s1, a1)); c.closePath(); fill(c, GRAYS[k % 4]) }
      for (let k = 1; k < 9; k++) { const s0 = a0 + (TAU - sl) * k / 9; if (s0 >= a1) break; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(s0) * R, y + Math.sin(s0) * R); lnB(c, 3, 'rgba(255,255,255,.25)') }
    }
    c.save(); c.beginPath(); c.arc(x, y, R, 0, TAU); c.clip(); c.fillStyle = 'rgba(0,0,0,.16)'; c.fillRect(x + R * .5, y - R, R, R * 2); c.restore();
    ring(c, x, y, R, 'rgba(255,255,255,.55)', 4);
    const kc = eio(at(t, a.proc - .25, a.proc + .35)), em = 1 - .85 * eio(at(t, a.umer - .2, a.umer + .6));   // щель → сигарета: лежит от центра к краю, огонёк у края
    if (kc > 0) { const w = lp(R * Math.tan(sl / 2) * 2, 26, kc); c.save(); c.translate(x, y); c.rotate(top);
      rr(c, 0, -w / 2, R - 6, w, w / 2); fill(c, mixc(C3.red, C3.white, kc)); c.fillStyle = C3.red; c.fillRect(0, -w / 2, 60 * kc, w);
      c.fillStyle = mixc(C3.red, '#3a2a26', kc); c.fillRect(R - 26, -w / 2, 20, w); const er = 13 * kc; circ(c, R - 12, 0, er, mixc('#4a3a34', C3.ember, em));
      if (em > .3) glow(c, R - 12, 0, 34, C3.ember, .45 * kc * em); c.restore() }
    const kl = eo(at(t, a.gor + .3, a.gor + .9)) * (1 - eio(at(t, a.proc - .1, a.proc + .4)));   // лупа над щелью
    if (kl > 0) { const lx = x + 12, ly = y - R + 120 - (1 - kl) * 260, LR = 112; c.save(); c.globalAlpha *= Math.min(1, kl * 2);
      c.save(); c.translate(lx + 92, ly + 92); c.rotate(.78); rr(c, -14, 0, 28, 190, 10); fill(c, '#3A2A1E'); c.restore();
      circ(c, lx, ly, LR + 12, C3.gold); c.save(); c.beginPath(); c.arc(lx, ly, LR, 0, TAU); c.clip(); c.fillStyle = '#5B5866'; c.fillRect(lx - LR, ly - LR, LR * 2, LR * 2);
      c.fillStyle = C3.red; c.fillRect(lx - 70 - 12, ly - LR, 140, LR * 2);   // щель под лупой — широкая
      for (let i = 0; i < 5; i++) fig(c, lx - 52 + i * 26, ly + 56, .26, { col: '#F4F1EA', hc: C3.rose2 });
      c.fillStyle = 'rgba(255,255,255,.18)'; poly(c, [lx - LR, ly + 20, lx - 20, ly - LR, lx + 10, ly - LR, lx - LR, ly + 50]); c.fill(); c.restore();
      ring(c, lx, ly, LR + 6, '#8A6A2A', 4); c.restore() }
  }
  // дым: тонкая струйка от огонька; на «Спас» выше перекрытия становится хвостом мыши
  const TAILP = [[540, 470], [552, 330], [528, 190], [556, 40], [536, -110], [548, -250], [560, -420], [590, -560], [612, -700], [600, -820], [640, -930], [690, -985]];
  function tailOrSmoke(c, t, q) {
    const a = TC, rise = eo(at(t, a.umer - .1, a.umer + .9)); if (rise <= 0) return;
    const n = TAILP.length, top = lp(470, -985, rise), pts = [];
    for (let i = 0; i < n; i++) { const p = TAILP[i]; if (p[1] < top) break; const wob = Math.sin(t * 2.2 + i * .9) * 10 * (1 - at(t, a.spas - .2, a.spas + .5)); pts.push(p[0] + wob, p[1]) }
    if (pts.length < 4) return;
    const kt = eio(at(t, a.spas - .15, a.spas + .55));   // хвост: выше пола лаборатории дым розовеет и толстеет
    for (let i = 2; i < pts.length; i += 2) { const y0 = pts[i - 1], y1 = pts[i + 1], up = y1 < SLAB[0] ? kt : 0, u = i / pts.length;
      c.strokeStyle = up > 0 ? mixc('#C7C2CF', '#E9A9B4', up) : rgba('#C7C2CF', .7 * (1 - u * .4)); c.lineWidth = up > 0 ? lp(7, 16 - u * 4, up) : 7 + u * 6; c.lineCap = 'round';
      c.beginPath(); c.moveTo(pts[i - 2], y0); c.lineTo(pts[i], y1); c.stroke() }
  }
  // ---------- лаборатория ----------
  function labRoom(c, t, q) {
    const v = viewRect(q); if (v.y0 > SLAB[0] + 10 || v.y1 < ROOF[1] - 10) return;
    const x0 = -1600, x1 = WALLX[0];
    c.fillStyle = '#123A3E'; c.fillRect(x0, ROOF[1], x1 - x0, SLAB[0] - ROOF[1]);
    c.strokeStyle = 'rgba(126,214,210,.08)'; c.lineWidth = 2; c.beginPath(); for (let gx = x0; gx < x1; gx += 80) { c.moveTo(gx, ROOF[1]); c.lineTo(gx, SLAB[0]) } for (let gy = ROOF[1]; gy < SLAB[0]; gy += 80) { c.moveTo(x0, gy); c.lineTo(x1, gy) } c.stroke();
    poly(c, [180, ROOF[1], 300, ROOF[1], 760, SLAB[0], 220, SLAB[0]]); fill(c, 'rgba(190,240,236,.07)'); poly(c, [900, ROOF[1], 980, ROOF[1], 1400, SLAB[0], 1000, SLAB[0]]); fill(c, 'rgba(190,240,236,.05)');   // косые лучи холодной лампы
    c.fillStyle = '#0E2B2E'; rr(c, 200, ROOF[1], 120, 40, 8); c.fill(); rr(c, 900, ROOF[1], 120, 40, 8); c.fill(); c.fillStyle = '#CFF6F2'; c.fillRect(214, ROOF[1] + 34, 92, 10); c.fillRect(914, ROOF[1] + 34, 92, 10);
    [[-1300, -1700], [-1300, -1350], [-760, -1700], [-760, -1350], [1000, -1760], [1000, -1460]].forEach(([sx, sy], i) => {   // полки с колбами
      c.fillStyle = '#0B2427'; c.fillRect(sx, sy, 420, 16);
      for (let k = 0; k < 4; k++) { const fx = sx + 40 + k * 100, h = 70 + H1(i * 4 + k) * 70, col = ['#3FB6A8', '#7ED6CF', '#E7A9B6', '#F2B84B'][(i + k) % 4];
        c.beginPath(); c.moveTo(fx, sy); c.lineTo(fx, sy - h * .55); c.lineTo(fx + 12, sy - h * .55); c.lineTo(fx + 12, sy - h); c.lineTo(fx + 30, sy - h); c.lineTo(fx + 30, sy - h * .55); c.lineTo(fx + 42, sy - h * .55); c.lineTo(fx + 42, sy); c.closePath(); fill(c, rgba(col, .75)); lnB(c, 2.5, 'rgba(230,250,248,.5)') } });
    c.fillStyle = '#0B2427'; c.fillRect(WALLX[0], ROOF[1], WALLX[1] - WALLX[0], SLAB[0] - ROOF[1]);   // стена между лабораторией и лавкой
  }
  function table(c, x0, x1) { c.fillStyle = '#5A3A26'; c.fillRect(x0, TOPY, x1 - x0, 34); c.fillStyle = '#7A5135'; c.fillRect(x0, TOPY, x1 - x0, 8); c.fillStyle = '#3E2718'; for (let lx = x0 + 40; lx < x1; lx += 520) c.fillRect(lx, TOPY + 34, 26, SLAB[0] - TOPY - 34) }
  // мышь в профиль (смотрит влево): тело, голова, ухо, глаз; выбритый квадрат на спине; смола, пятно, кольцо тревоги
  const MOUSE = { x: 470, y: TOPY - 4 };
  function mouse(c, t) {
    const a = TC, { x, y } = MOUSE, br = Math.sin(t * 3.1) * 3;
    c.save(); c.translate(x, y);
    rasterPoly(c, [-150, 0, 190, 0, 240, 60, -110, 60], 'rgba(5,20,22,.4)', 9, 2.3);
    c.beginPath(); c.ellipse(20, -96 - br * .3, 190, 96 + br * .2, 0, 0, TAU); fill(c, '#F4F1EA');
    c.beginPath(); c.moveTo(-140, -110); c.quadraticCurveTo(-230, -110, -268, -64); c.quadraticCurveTo(-232, -30, -150, -40); c.closePath(); fill(c, '#F4F1EA');
    circ(c, -270, -64, 9, '#E9A9B4'); circ(c, -196, -86, 9, '#1A1214');
    c.beginPath(); c.ellipse(-150, -170, 46, 58, -.3, 0, TAU); fill(c, '#F4F1EA'); c.beginPath(); c.ellipse(-150, -168, 28, 38, -.3, 0, TAU); fill(c, '#E9A9B4');
    c.save(); c.beginPath(); c.ellipse(20, -96, 190, 96, 0, 0, TAU); c.clip(); c.fillStyle = shd('#F4F1EA', .22); c.fillRect(110, -200, 140, 220); c.restore();
    [[-90, 0], [-20, 0], [80, 0], [150, 0]].forEach(([fx]) => { rr(c, fx - 14, -14, 34, 16, 8); fill(c, '#E9A9B4') });
    const SQ = { x: -10, y: -186, w: 116, h: 64 }; rr(c, SQ.x, SQ.y, SQ.w, SQ.h, 8); fill(c, '#EDB5BE');
    const pt = at(t, a.nam + .25, a.smol + .35); if (pt > 0) { c.save(); rr(c, SQ.x, SQ.y, SQ.w, SQ.h, 8); c.clip(); c.fillStyle = '#16100E';
      for (let s = 0; s < 4; s++) { const k = cl(pt * 4 - s); if (k <= 0) break; c.fillRect(SQ.x - 4, SQ.y + s * SQ.h / 4 - 2, (SQ.w + 8) * k, SQ.h / 4 + 4) } c.restore() }
    const sp = eo(at(t, a.vyr - .1, a.op + .2)); if (sp > 0) { c.beginPath(); c.ellipse(SQ.x + 64, SQ.y + 26, 36 * sp, 20 * sp, 0, 0, TAU); fill(c, '#3A0E14'); c.beginPath(); c.ellipse(SQ.x + 56, SQ.y + 20, 14 * sp, 7 * sp, 0, 0, TAU); fill(c, '#6A1A22') }
    for (let k = 0; k < 2; k++) { const u = at(t, a.op + k * .45, a.op + .7 + k * .45); if (u <= 0 || u >= 1) continue; ring(c, SQ.x + 64, SQ.y + 26, 50 + 110 * eo(u), rgba('#E23A4E', .9 * (1 - u)), 7) }
    c.restore();
  }
  // кисть в стальном зажиме (без рук): штатив на столе, зажим едет сам
  function brushPos(t) {
    const a = TC, P = [[a.uch - .4, 760, -1240], [a.nam - .15, 900, -1005], [a.nam + .2, 900, -1060], [a.nam + .45, 560, -1135], [a.nam + .75, 420, -1130], [a.nam + 1.05, 560, -1120], [a.smol, 420, -1112], [a.smol + .3, 560, -1100], [a.smol + .6, 560, -1210],
      [a.amer - .1, 590, -1180], [a.amer + .15, 600, TOPY - 8], [a.amer + 1.4, 1560, TOPY - 8], [a.amer + 1.9, 1700, -1200]];
    if (t <= P[0][0]) return [P[0][1], P[0][2]]; for (let i = 1; i < P.length; i++) if (t < P[i][0]) { const k = eio((t - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return [lp(P[i - 1][1], P[i][1], k), lp(P[i - 1][2], P[i][2], k)] }
    return [P[P.length - 1][1], P[P.length - 1][2]];
  }
  function brushRig(c, t) {
    const [bx, by] = brushPos(t), sx = 760;
    c.fillStyle = '#9AA6B2'; c.fillRect(sx - 60, TOPY - 16, 120, 16); c.fillRect(sx - 8, -1560, 16, TOPY - 16 + 1560); c.fillStyle = '#6E7A86'; c.fillRect(sx + 2, -1560, 6, TOPY + 1544);
    c.fillStyle = '#AAB6C2'; c.fillRect(Math.min(sx, bx), by - 190, Math.abs(bx - sx) + 10, 12); rr(c, bx - 22, by - 210, 44, 40, 8); fill(c, '#C9D2DC'); rr(c, bx - 22, by - 210, 44, 40, 8); lnB(c, 2, '#6E7A86');
    rr(c, bx - 9, by - 170, 18, 110, 6); fill(c, '#B9875A'); c.fillStyle = '#C9D2DC'; c.fillRect(bx - 11, by - 66, 22, 18);
    c.beginPath(); c.moveTo(bx - 12, by - 48); c.lineTo(bx + 12, by - 48); c.lineTo(bx + 4, by); c.lineTo(bx - 4, by); c.closePath(); fill(c, '#16100E');
  }
  function tarJar(c) { const x = 900, y = TOPY; rasterPoly(c, [x + 70, y - 120, x + 150, y - 60, x + 150, y + 4, x + 70, y], 'rgba(5,20,22,.4)', 9, 2.3);
    rr(c, x - 70, y - 150, 140, 150, 16); fill(c, 'rgba(170,220,220,.35)'); c.fillStyle = '#16100E'; c.fillRect(x - 64, y - 100, 128, 96); rr(c, x - 76, y - 168, 152, 26, 8); fill(c, '#3A2A1E');
    plate(c, 'СМОЛА', x, y - 52, 1, { s: 22, bg: '#F4F1EA', c: '#16100E', sh: false, ls: 1 }); rr(c, x - 70, y - 150, 140, 150, 16); lnB(c, 3, 'rgba(230,250,248,.6)') }
  // ---------- график: мазок кисти — ось; торцы сигарет подпрыгивают и вытягивают столбики продаж ----------
  const BARS = [300, 330, 352, 372, 394, 414, 428, 392], BX0 = 1000, BDX = 64;
  function barX(i) { return BX0 + i * BDX }
  function strokeAxis(c, t) { const a = TC, k = at(t, a.amer + .15, a.amer + 1.4); if (k <= 0) return; const [bx] = brushPos(t); c.fillStyle = '#16100E'; c.fillRect(600, TOPY - 12, Math.max(0, Math.min(bx, 1560) - 600), 12) }
  function bars(c, t) {
    const a = TC, kp = eio(at(t, a.bros - .1, a.bros + .55));   // на «бросились» столбики оседают в пачки
    if (kp >= 1) return;
    BARS.forEach((h, i) => { const t0 = a.amer + .7 + i * .26, j = at(t, t0, t0 + .3), g = eio(at(t, t0 + .2, t0 + .75)), x = barX(i); if (j <= 0) return;
      const hop = Math.sin(Math.PI * cl(j)) * 46 * (1 - g), H = lp(0, i < 7 ? h : h, g) * (1 - kp) + 140 * kp, y = TOPY - 12 - hop;
      if (H > 4) { rr(c, x - 22, y - H, 44, H, 8); fill(c, i === 7 ? '#F4D8D8' : C3.white); c.fillStyle = 'rgba(0,0,0,.14)'; c.fillRect(x + 6, y - H, 16, H); c.fillStyle = C3.filt; c.fillRect(x - 22, y - H, 44, Math.min(H, 24)) }
      c.beginPath(); c.ellipse(x, y - H, 22, 9, 0, 0, TAU); fill(c, '#E8D6B8'); circ(c, x, y - H, 5, '#B76E3A') });
    const kd = eo(at(t, a.men - .25, a.men + .3)) * (1 - kp); if (kd > 0) { const x = barX(7), y = TOPY - 12 - 392 - 90;
      c.save(); c.translate(x, y - 30 * (1 - kd)); c.globalAlpha *= kd; c.fillStyle = '#E23A4E'; c.fillRect(-8, -80, 16, 70); poly(c, [-30, -14, 30, -14, 0, 26]); c.fill(); c.restore();
      tx(c, 'КУРЯТ МЕНЬШЕ ↓', 1230, TOPY - 760, { f: 'M', w: 800, s: 64 * bo(kd), c: '#F4F1EA', a: kd }) }
  }
  // ---------- лавка 1950-х ----------
  function shopRoom(c, t, q) {
    const v = viewRect(q); if (v.x1 < WALLX[1] - 10 || v.y0 > SLAB[0] + 10 || v.y1 < ROOF[1] - 10) return;
    const x0 = WALLX[1], x1 = SHOPX + 1600;
    c.fillStyle = '#2F5E5A'; c.fillRect(x0, ROOF[1], x1 - x0, SLAB[0] - ROOF[1]); c.fillStyle = '#28524E'; c.fillRect(x0, -1500, x1 - x0, 1080);
    rr(c, 2050, -2150, 700, 520, 10); fill(c, '#1C2748'); c.save(); rr(c, 2050, -2150, 700, 520, 10); c.clip();   // окно: улица 1950-х, фонарь
    c.fillStyle = '#26345E'; c.fillRect(2050, -1830, 700, 200); for (let i = 0; i < 6; i++) { c.fillStyle = '#18213F'; c.fillRect(2070 + i * 120, -1960 - H1(i) * 120, 96, 420) }
    c.fillStyle = '#E8D49A'; for (let i = 0; i < 6; i++) for (let k = 0; k < 4; k++) if (H1(i * 9 + k) > .45) c.fillRect(2090 + i * 120, -1930 - H1(i) * 120 + k * 60, 22, 26);
    c.fillStyle = '#0E1430'; c.fillRect(2560, -2100, 14, 470); circ(c, 2567, -2105, 20, '#FDE68A'); beam(c, 2567, -2100, 2567, -1640, 14, 120, '#FDE68A', .25); c.restore();
    rr(c, 2050, -2150, 700, 520, 10); lnB(c, 10, '#DCD3BE'); c.fillStyle = '#DCD3BE'; c.fillRect(2394, -2150, 12, 520);
    for (let i = 0; i < 4; i++) { poly(c, [1800 + i * 520, SLAB[0], 2000 + i * 520, SLAB[0], 2300 + i * 520, -600, 2100 + i * 520, -600]); fill(c, 'rgba(253,230,138,.06)') }   // косые полосы света на полу
    c.fillStyle = '#4A3226'; c.fillRect(x0, -620, x1 - x0, 200);   // пол лавки
    c.fillStyle = '#1D3B38'; c.fillRect(SHOPX + 600, ROOF[1], 60, SLAB[0] - ROOF[1]);
  }
  // пачки на прилавке: обезличенные, сверху белые фильтры
  function pack5(c, x, y, s, col, o = {}) {
    const w = 92 * s, h = 136 * s; rasterPoly(c, [x + w, y - h + 10, x + w + 40 * s, y - h + 30, x + w + 40 * s, y + 8, x + w * .2, y + 8, x, y], 'rgba(8,24,22,.35)', 7, 2);
    if (o.filt) for (let k = 0; k < 3; k++) { const fx = x + w * (.22 + k * .28), fy = y - h - 16 * s - (k % 2) * 8 * s; rr(c, fx - 9 * s, fy, 18 * s, 30 * s, 4); fill(c, '#F4F1EA') }
    c.fillStyle = col; c.fillRect(x, y - h, w, h); c.fillStyle = shd(col, .25); c.fillRect(x + w * .74, y - h, w * .26, h); c.fillStyle = lit(col, .3); c.fillRect(x, y - h, w, h * .22);
    c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(x + w * .14, y - h * .56, w * .5, 8 * s);
  }
  const SHELF = [1900, 2040, 2180, 2320, 2460, 2600, 2740, 2880], OLDP = 3150;   // где встают пачки; старая мягкая пачка Mild as May — с краю
  // толпа белых фигурок: бегут к фильтрам; мужчины тормозят и разворачиваются
  function crowd(c, t) {
    const a = TC, run = at(t, a.bros - .2, a.bros + 1.6); if (run <= 0) return;
    for (let i = 0; i < 12; i++) { const m = i % 3 !== 1, x0 = SHOPX + 500 + i * 120, xt = 1950 + (i % 8) * 120 + (m ? 40 : 0), turn = m ? eo(at(t, a.muzh - .05 + (i % 3) * .08, a.muzh + .35 + (i % 3) * .08)) : 0;
      const back = m ? eio(at(t, a.stesn, a.nezh + .2)) * 340 : 0, x = lp(x0, xt + (m ? 260 : 0), eo(run)) + back, bob = Math.abs(Math.sin(t * 9 + i)) * 12 * (1 - at(t, a.bros + 1.2, a.bros + 1.7));
      const look = m ? eio(at(t, a.shch - .05, a.shch + .4)) : 0, dir = m ? (turn > .5 ? (look > .5 ? -1 : 1) : -1) : -1;
      fig(c, x, SLAB[0] - 200 + 6 - bob, 1.55, { m, hat: m && i % 2 === 0, dir, col: '#F4F1EA', hc: C3.rose2 }) }
  }
  function shelfPacks(c, t) {
    const a = TC, kp = eio(at(t, a.bros - .1, a.bros + .55)), sl = eio(at(t, a.bros + .2, a.bros + 1.3)); if (kp <= 0) return;
    SHELF.forEach((tx0, i) => { if (i >= BARS.length) return; const x = lp(barX(i) - 46, tx0, sl); A(c, kp, () => pack5(c, x, TOPY - 12, 1, GRAYS[i % 4], { filt: true })) });
  }
  // пудреница защёлкивается вокруг фильтра; на «Филип» трескается
  function compact(c, t) {
    const a = TC, k = eio(at(t, a.schit - .2, a.nezh + .05)), cr = at(t, a.fil - .15, a.fil + .25); if (k <= 0) return;
    const x = 2880 + 46, y = TOPY - 12 - 136 - 40, R = 62, op = 1 - eio(at(t, a.nezh - .25, a.nezh + .02)), fall = eio(at(t, a.fil + .15, a.fil + .7));
    c.save(); c.translate(x, y + fall * 600); c.rotate(fall * .8); c.globalAlpha *= Math.min(1, k * 2);
    c.save(); c.translate(0, 0); c.rotate(-op * 1.9); c.beginPath(); c.arc(0, 0, R, Math.PI, TAU); c.closePath(); fill(c, '#E7A9B6'); c.beginPath(); c.arc(0, -4, R * .7, Math.PI, TAU); c.closePath(); fill(c, '#DDEFF4'); c.restore();
    c.beginPath(); c.arc(0, 0, R, 0, Math.PI); c.closePath(); fill(c, '#D88A9C'); c.beginPath(); c.arc(0, 0, R * .55, .2, Math.PI - .2); fill(c, '#F1C3CC'); ring(c, 0, 0, R, '#C9A24A', 4);
    if (cr > 0) { c.beginPath(); c.moveTo(-R, 0); c.lineTo(-20, 18); c.lineTo(8, -6); c.lineTo(40, 22); c.lineTo(R, 6); lnB(c, 4 * cr, '#5a1a2a') }
    c.restore();
    const kp = at(t, a.nezh - .1, a.nezh + .3) * (1 - at(t, a.fil - .3, a.fil + .1)); if (kp > 0) tx(c, 'ДЛЯ НЕЖЕНОК', 2980, TOPY - 520, { f: 'M', w: 800, s: 70 * bo(kp), c: '#F1C3CC', a: Math.min(1, kp * 2) });
  }
  // старая мягкая пачка → на «Филип» сверху падают жёсткие стенки и захлопываются — новая пачка Marlboro; на «щелчком» крышка откидывается
  const PK = { x: OLDP - 95, y: TOPY - 12, w: 190, h: 282 };
  function hardPack(c, t) {
    const a = TC, d = at(t, a.fil - .05, a.fil + .5), slam = eio(d), { x, y, w, h } = PK, top = y - h;
    if (slam < 1) softPack(c, x, top, w, h, 30, { shc: 'rgba(8,24,22,.35)' });
    if (d > 0 && slam < 1) { c.save(); c.translate(0, -(1 - ei(d)) * 1100); mPack(c, x, top, w, h, 34, { shadow: false }); c.restore() }   // жёсткая пачка падает сверху и накрывает мягкую
    if (slam >= 1) { const u = at(t, a.fil + .45, a.fil + .85); if (u > 0 && u < 1) for (let k = 0; k < 6; k++) { const s2 = k < 3 ? -1 : 1, yy = y - 20 - (k % 3) * 40; c.beginPath(); c.moveTo(x + w / 2 + s2 * (w / 2 + 20 + 60 * u), yy); c.lineTo(x + w / 2 + s2 * (w / 2 + 70 + 120 * u), yy - 10); lnB(c, 5, rgba('#F4F1EA', 1 - u)) } }
    if (slam >= 1) {
      const lid = eio(at(t, a.shch - .08, a.shch + .22)), seam = at(t, a.otkr - .35, a.shch - .1);
      if (lid > 0) {   // открытая пачка: сигареты с фильтром цвета пробки
        const ris = at(t, a.chik - .2, a.rekl + .6); c.save(); c.beginPath(); c.rect(-1e4, ROOF[1], 2e4, 1e4); c.clip();   // выше крыши — уже башни
        CIGS.forEach((cg, i) => { const lift = 60 + cg.h * eio(cl(ris * 1.25 - i * .1)); const cx = x + w * cg.u;
          rr(c, cx - 17, top - lift, 34, lift + 30, 6); fill(c, C3.white); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(cx + 4, top - lift, 13, lift + 30); c.fillStyle = C3.cork; c.fillRect(cx - 17, top - lift, 34, 44);
          c.fillStyle = 'rgba(120,70,30,.35)'; for (let s = 0; s < 3; s++) c.fillRect(cx - 17, top - lift + 8 + s * 12, 34, 3) }); c.restore() }
      mPack(c, x, top, w, h, 34, { shc: 'rgba(8,24,22,.35)' });
      if (seam > 0 && lid <= 0) { const sx = x + w * eio(seam); c.fillStyle = '#FFF6D6'; c.fillRect(x, top + h * .3, sx - x, 5); glow(c, sx, top + h * .3, 40, '#FFF1B8', .8) }
      if (lid > 0) { c.save(); c.translate(x + w, top + h * .3); c.rotate(-lid * 2.1); PL(c, [-w, 0, 0, 0, 0, -h * .3, -w, -h * .3], C3.white); PL(c, [-w, -h * .3, 0, -h * .3, -w / 2, -h * .3 + h * .17], C3.red); c.restore() }
      for (let k = 0; k < 2; k++) { const u = at(t, a.shch + k * .18, a.shch + .7 + k * .18); if (u > 0 && u < 1) ring(c, x + w / 2, top, 60 + 260 * eo(u), rgba('#FFF1B8', .8 * (1 - u)), 6) }
    }
  }
  const CIGS = [{ u: .2, h: 1700 }, { u: .4, h: 2300 }, { u: .6, h: 1950 }, { u: .8, h: 2500 }];
  // ---------- ночной Чикаго над крышей ----------
  const BW = { x: 3920, y: -3560, w: 520, h: 820, wx: 150, wy: 300 };   // дом Бёрнетта (с косым разрезом), окно — (x + wx, y + wy)
  function chicago(c, t, q) {
    const a = TC; if (viewRect(q).y0 > ROOF[0] + 20) return;
    c.fillStyle = '#0D1230'; c.fillRect(-1600, -9000, 9000, 9000 + ROOF[0]);
    c.fillStyle = '#171D45'; c.fillRect(-1600, ROOF[0] - 700, 9000, 700);
    circ(c, 3150, -3900, 120, '#F3EBDD'); circ(c, 3110, -3930, 22, '#DCD3BE'); circ(c, 3190, -3860, 14, '#DCD3BE');
    for (let i = 0; i < 26; i++) { const bx = 1500 + i * 150, h = 300 + H1(i * 2.7) * 520; c.fillStyle = i % 2 ? '#141A3E' : '#1A2150'; c.fillRect(bx, ROOF[0] - h, 130, h);
      c.fillStyle = 'rgba(253,230,138,.5)'; for (let k = 0; k < h / 60 - 1; k++) for (let m = 0; m < 3; m++) if (H1(i * 31 + k * 7 + m) > .6) c.fillRect(bx + 18 + m * 36, ROOF[0] - h + 30 + k * 60, 18, 24) }
    const sl = eo(at(t, a.leo - .4, a.bern + .1)); if (sl > 0) burnett(c, t, sl);
  }
  function burnett(c, t, sl) {   // дом с косым разрезом (WoT #076): в светлом окне — стол, ваза красных яблок, стакан толстых чёрных карандашей
    const { x, y, w, h, wx, wy } = BW, dx = (1 - sl) * 1400; c.save(); c.translate(dx, 0);
    c.fillStyle = '#20285A'; c.fillRect(x, y, w, h + 3000); PL(c, [x + w, y, x + w + 60, y + 60, x + w + 60, y + h + 3000, x + w, y + h + 3000], '#161C44');
    PL(c, [x, y + 60, x + w, y - 40, x + w, y + 10, x, y + 110], '#2C356E');
    for (let k = 0; k < 14; k++) for (let m = 0; m < 4; m++) if (!(k === 2 && m < 2)) { c.fillStyle = H1(k * 5 + m) > .55 ? 'rgba(253,230,138,.45)' : '#141A3E'; c.fillRect(x + 40 + m * 120, y + 150 + k * 110, 70, 60) }
    c.fillStyle = '#FFE9B0'; c.fillRect(x + wx - 100, y + wy - 70, 200, 140);
    c.save(); c.beginPath(); c.rect(x + wx - 100, y + wy - 70, 200, 140); c.clip(); inNest(c, NC7(), cc => officeW7(cc, t)); c.restore();
    c.strokeStyle = '#DCD3BE'; c.lineWidth = 6; c.strokeRect(x + wx - 100, y + wy - 70, 200, 140);
    c.restore();
    const kp = at(t, TC.bern - .1, TC.bern + .3) * (1 - at(t, TC.end - .55, TC.end - .25)); if (kp > 0) plate(c, 'ЛЕО БЁРНЕТТ · РЕКЛАМЩИК, ЧИКАГО', x + wx + 40, y + wy - 190, bo(kp), { s: 58, bg: '#F3EBDD', c: '#141010', ls: 2 });
  }
  // сигареты из пачки растут небоскрёбами: выше крыши у них окна и ступени ар-деко
  function towers(c, t) {
    const a = TC, ris = at(t, a.chik - .2, a.rekl + .6); if (ris <= 0) return; const { x, y, w, h } = PK, top = y - h;
    CIGS.forEach((cg, i) => { const lift = 60 + cg.h * eio(cl(ris * 1.25 - i * .1)), yt = top - lift, k = eio(at(yt, ROOF[0] + 100, ROOF[0] - 900)); if (yt > ROOF[0]) return;
      const W = lp(34, 250, k), cx = x + w * cg.u + (cg.u - .5) * 1500 * k, yb = ROOF[0];
      c.fillStyle = '#E9E4DA'; c.fillRect(cx - W / 2, yt, W, yb - yt); c.fillStyle = 'rgba(20,20,40,.28)'; c.fillRect(cx + W * .12, yt, W * .38, yb - yt);
      if (k > .3) { c.fillStyle = rgba('#FDE68A', .85 * at(k, .3, .7)); for (let r = 0; r < (yb - yt - 130) / 52; r++) for (let m = 0; m < 4; m++) if (H1(i * 41 + r * 3 + m) > .38) c.fillRect(cx - W / 2 + 14 + m * (W - 28) / 4, yt + 120 + r * 52, (W - 28) / 4 - 12, 24) }
      c.fillStyle = C3.cork; c.fillRect(cx - W / 2, yt, W, 44 + 30 * k); PL(c, [cx - W * .34, yt, cx - W * .18, yt - 90 * k, cx + W * .18, yt - 90 * k, cx + W * .34, yt], C3.cork); c.fillRect(cx - 5, yt - 160 * k, 10, 70 * k) });
    c.fillStyle = '#1A1720'; c.fillRect(-1600, ROOF[0], SHOPX + 3200, ROOF[1] - ROOF[0]);   // крыша поверх — стык ствола и башни не виден
  }
  function wcWorld(c, t, q) {
    const a = TC;
    chicago(c, t, q);
    c.fillStyle = '#1A1720'; c.fillRect(-1600, ROOF[0], SHOPX + 3200, ROOF[1] - ROOF[0]);   // крыша
    labRoom(c, t, q); shopRoom(c, t, q);
    packWall(c, q, -1600, SHOPX + 1600, SLAB[1], 1500);
    c.fillStyle = '#1A1720'; c.fillRect(-1600, SLAB[0], SHOPX + 3200, SLAB[1] - SLAB[0]); c.fillStyle = '#0E0C12'; rr(c, 500, SLAB[0] - 4, 120, SLAB[1] - SLAB[0] + 8, 10); c.fill();   // перекрытие с решёткой
    c.fillStyle = '#5A3A26'; c.fillRect(-1600, 1500, SHOPX + 3200, 220); c.fillStyle = '#7A5135'; c.fillRect(-1600, 1500, SHOPX + 3200, 10); c.fillStyle = '#1A1420'; c.fillRect(-1600, 1720, SHOPX + 3200, 2000);
    marketDisc(c, t);
    const kr = at(t, a.proc + .1, a.proc + .45) * (1 - at(t, a.spas - .3, a.spas + .1)); if (kr > 0) plate(c, '0,25 % РЫНКА', 540, 1040, bo(kr), { s: 62, bg: '#F4F1EA', c: '#141010', ls: 2 });
    table(c, -300, SHOPX + 400); mouse(c, t); tarJar(c); strokeAxis(c, t); bars(c, t); shelfPacks(c, t);
    hardPack(c, t); compact(c, t); towers(c, t); crowd(c, t); brushRig(c, t);
    tailOrSmoke(c, t, q);
  }
  function wcShot(c, t) { const q = camObj(camAt(KC, t)); layer(c, q, 1, cc => wcWorld(cc, t, q));
    layer(c, q, 1.3, cc => { const v = viewRect(q); if (v.y1 < SLAB[0] - 600 || v.y0 > SLAB[0] + 400) return;   // шестигранники смолы плывут мимо камеры
      for (let i = 0; i < 9; i++) { const hx = -200 + i * 260 + Math.sin(t * .5 + i) * 30, hy = -1500 + H1(i * 3) * 900 + ((t * 40 + i * 111) % 600) - 300, R = 26 + H1(i) * 18;
        cc.beginPath(); for (let k = 0; k < 6; k++) { const an = k * Math.PI / 3; cc.lineTo(hx + Math.cos(an) * R, hy + Math.sin(an) * R) } cc.closePath(); lnB(cc, 3, 'rgba(160,230,224,.28)') } });
  }
