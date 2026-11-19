  // ================= мир C (фразы 3–6): дом в разрезе. Внизу — «рынок»: круг рынка на стене серых пачек; наверху — лаборатория с мышью и лавка 1950-х;
  // над крышей — ночной Чикаго. Мир C вложен в торец сигареты мира 2: круг рынка = красный торец (камера ныряет в него).
  let TC = null, KC = null, NC2 = null, NCH = null;
  const MK = { x: 540, y: 860, R: 400 }, SLIT = .045;   // круг рынка; щель «Мальборо» — 2,6° (0,25 % — это 0,9°, тоньше не видно)
  const SLAB = [-420, -300], TOPY = -900, ROOF = [-2520, -2400], WALLX = [1480, 1560], SHOPX = 3900;
  const GRAYS = ['#5B5866', '#6C6977', '#4D4A57', '#7A7784'];
  const WIN = { x: 2945, y: -2150, w: 600, h: 520 }, CHM = .155;   // v20.4: окно над новой пачкой — за стеклом ночной Чикаго (мир CH вложен в окно)
  function wcInit() {
    const w = (s, q, n) => Ws(s, q, n);
    TC = { a3: SA('s3'), pyat: w('s3', 'пятьдесят'), gor: w('s3', 'горстка'), zhen: w('s3', 'женщин'), chet: w('s3', 'четверть'), proc: w('s3', 'процента'), ryn: w('s3', 'рынка'), umer: w('s3', 'умерла'),
      spas: w('s4', 'спас'), strah: w('s4', 'страх'), uch: w('s4', 'учёные'), nam: w('s4', 'намазали'), smol: w('s4', 'смолой'), vyr: w('s4', 'выросли'), op: w('s4', 'опухоли'), amer: w('s4', 'америка'),
      vperv: w('s4', 'впервые'), dep: w('s4', 'депрессии'), stala: w('s4', 'стала'), men: w('s4', 'меньше'),
      kur: w('s5', 'курильщики'), bros: w('s5', 'бросились'), filt: w('s5', 'фильтром'), muzh: w('s5', 'мужчины'), stesn: w('s5', 'стеснялись'), schit: w('s5', 'считалось'), nezh: w('s5', 'неженок'),
      fil: w('s6', 'филип'), dar: w('s6', 'дарит'), vtor: w('s6', 'вторую'), zhizn: w('s6', 'жизнь'), filtr: w('s6', 'фильтр'), zhest: w('s6', 'жёсткую'), pach: w('s6', 'пачку'), otkr: w('s6', 'открывают'), shch: w('s6', 'щелчком'),
      vseh: w('s6', 'всех'), vidu: w('s6', 'виду'), chik: w('s6', 'чикагского'), rekl: w('s6', 'рекламщика'), leo: w('s6', 'лео'), bern: w('s6', 'бёрнетта'), end: SA('s7') - .02 };
    const a = TC;
    KC = [KY(a.pyat + .45, 540, 880, .96), KY(a.gor + .1, 540, 850, 1.0), KY(a.gor + .95, 546, 650, 1.38), KY(a.proc + .35, 545, 690, 1.24), KY(a.umer + .05, 548, 600, 1.3),
      KY(a.spas + .12, 552, 330, 1.22), KY(a.strah + .05, 575, -960, 1.1), KY(a.nam + .1, 430, -1060, 1.42), KY(a.smol + .2, 425, -1080, 1.55), KY(a.op + .25, 420, -1086, 1.64),
      KY(a.amer + .6, 780, -1080, .92), KY(a.men + .15, 960, -1100, .8), KY(a.bros + .45, 1650, -1160, .72), KY(a.filt + .35, 2350, -1110, .7), KY(a.muzh + .45, 2700, -1120, .74),
      KY(a.nezh - .45, 3010, -1080, 1.12), KY(a.nezh + .35, 3040, -1110, 1.32), KY(a.fil + .35, 3170, -1090, 1.14), KY(a.zhest + .05, 3200, -1080, 1.24),
      KY(a.otkr + .05, 3205, -1205, 1.72), KY(a.shch + .28, 3200, -1170, 1.42), KY(a.vidu, 3170, -1262, .94)];
    // v20.4: на «чикагского» камера поднимается от пачки к окну над прилавком и ныряет в стекло — за ним ночной Чикаго (мир CH вложен в окно); без наезда в пробку
    a.sw = a.rekl - .05; NCH = { x: WIN.x + WIN.w / 2, y: WIN.y + WIN.h / 2, m: CHM };
    KC.push(KY(a.chik + .02, 3232, -1610, 1.4), KY(a.sw - .25, 3244, -1846, 2.7), KY(a.sw, NCH.x, NCH.y, 4.2));   // на стыке кадр целиком внутри стекла, поля по 30 px
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
    if (kc > 0) { const w = lp(R * Math.tan(sl / 2) * 2, 30, kc); c.save(); c.translate(x, y); c.rotate(top);   // v20.2: щель → сигарета: бумага без красного у центра, у края — пепел и огонёк полосой (не градусник)
      cig3(c, 4, 0, R - 4, 0, w / 2, { em: em * kc, ek: kc, paper: mixc(C3.red, C3.white, kc) });
      if (em > .3) circ(c, R - 16, 0, 26, rgba('#FF9A4A', .16 * kc * em)); c.restore() }
    const kl = eo(at(t, a.gor + .3, a.gor + .9)) * (1 - eio(at(t, a.proc - .1, a.proc + .4)));   // лупа над щелью
    if (kl > 0) { const lx = x + 12, ly = y - R + 120 - (1 - kl) * 260, LR = 112; c.save(); c.globalAlpha *= Math.min(1, kl * 2);
      c.save(); c.translate(lx + 92, ly + 92); c.rotate(.78); rr(c, -14, 0, 28, 190, 10); fill(c, '#3A2A1E'); c.restore();
      circ(c, lx, ly, LR + 12, C3.gold); c.save(); c.beginPath(); c.arc(lx, ly, LR, 0, TAU); c.clip(); c.fillStyle = '#5B5866'; c.fillRect(lx - LR, ly - LR, LR * 2, LR * 2);
      c.fillStyle = C3.red; c.fillRect(lx - 70 - 12, ly - LR, 140, LR * 2);   // щель под лупой — широкая
      for (let i = 0; i < 5; i++) fig(c, lx - 52 + i * 26, ly + 56, .26, { col: '#F4F1EA', hc: C3.rose2 });
      c.fillStyle = 'rgba(255,255,255,.18)'; poly(c, [lx - LR, ly + 20, lx - 20, ly - LR, lx + 10, ly - LR, lx - LR, ly + 50]); c.fill(); c.restore();
      ring(c, lx, ly, LR + 6, '#8A6A2A', 4); c.restore() }
  }
  // ---------- лаборатория ----------
  function labRoom(c, t, q) {
    const v = viewRect(q); if (v.y0 > SLAB[0] + 10 || v.y1 < ROOF[1] - 10) return;
    const x0 = -1600, x1 = WALLX[0];
    c.fillStyle = '#123A3E'; c.fillRect(x0, ROOF[1], x1 - x0, SLAB[0] - ROOF[1]);
    c.strokeStyle = 'rgba(126,214,210,.08)'; c.lineWidth = 2; c.beginPath(); for (let gx = x0; gx < x1; gx += 80) { c.moveTo(gx, ROOF[1]); c.lineTo(gx, SLAB[0]) } for (let gy = ROOF[1]; gy < SLAB[0]; gy += 80) { c.moveTo(x0, gy); c.lineTo(x1, gy) } c.stroke();
    poly(c, [180, ROOF[1], 300, ROOF[1], 760, SLAB[0], 220, SLAB[0]]); fill(c, 'rgba(190,240,236,.07)'); poly(c, [900, ROOF[1], 980, ROOF[1], 1400, SLAB[0], 1000, SLAB[0]]); fill(c, 'rgba(190,240,236,.05)');   // косые лучи холодной лампы
    c.fillStyle = '#0E2B2E'; rr(c, 200, ROOF[1], 120, 40, 8); c.fill(); rr(c, 900, ROOF[1], 120, 40, 8); c.fill(); c.fillStyle = '#CFF6F2'; c.fillRect(214, ROOF[1] + 34, 92, 10); c.fillRect(914, ROOF[1] + 34, 92, 10);
    [[-1300, -1700], [-1300, -1350], [-760, -1700], [-760, -1350], [80, -1760]].forEach(([sx, sy], i) => {   // полки с колбами
      c.fillStyle = '#0B2427'; c.fillRect(sx, sy, 420, 16);
      for (let k = 0; k < 4; k++) { const fx = sx + 40 + k * 100, h = 70 + H1(i * 4 + k) * 70, col = ['#3FB6A8', '#7ED6CF', '#E7A9B6', '#F2B84B'][(i + k) % 4];
        c.beginPath(); c.moveTo(fx, sy); c.lineTo(fx, sy - h * .55); c.lineTo(fx + 12, sy - h * .55); c.lineTo(fx + 12, sy - h); c.lineTo(fx + 30, sy - h); c.lineTo(fx + 30, sy - h * .55); c.lineTo(fx + 42, sy - h * .55); c.lineTo(fx + 42, sy); c.closePath(); fill(c, rgba(col, .75)); lnB(c, 2.5, 'rgba(230,250,248,.5)') } });
    c.fillStyle = '#0B2427'; c.fillRect(WALLX[0], ROOF[1], WALLX[1] - WALLX[0], SLAB[0] - ROOF[1]);   // стена между лабораторией и лавкой
  }
  function table(c, x0, x1) {   // v20.4: в лаборатории — пол как у лавки и тумба с ящиками до пола (дым под столом не виден); ножки — только у прилавка, до пола лавки
    const FL = -620, bx0 = x0 + 20, bx1 = WALLX[0] - 40, bh = FL - TOPY - 34;
    c.fillStyle = '#0E2B2E'; c.fillRect(-1600, FL, WALLX[0] + 1600, SLAB[0] - FL); c.fillStyle = '#1F4E52'; c.fillRect(-1600, FL, WALLX[0] + 1600, 8);
    c.fillStyle = '#4A2F1F'; c.fillRect(bx0, TOPY + 34, bx1 - bx0, bh); c.fillStyle = '#2E1D14'; c.fillRect(bx0, FL - 20, bx1 - bx0, 20);
    for (let dx = bx0; dx < bx1 - 60; dx += 250) { c.fillStyle = '#3A2418'; c.fillRect(dx, TOPY + 34, 6, bh); rr(c, dx + 30, TOPY + 58, 190, 58, 6); lnB(c, 3, '#3A2418'); rr(c, dx + 30, TOPY + 132, 190, 92, 6); lnB(c, 3, '#3A2418');
      circ(c, dx + 125, TOPY + 87, 7, '#C9A24A'); circ(c, dx + 200, TOPY + 178, 7, '#C9A24A') }   // ящики и дверцы, латунные ручки
    c.fillStyle = '#5A3A26'; c.fillRect(x0, TOPY, x1 - x0, 34); c.fillStyle = '#7A5135'; c.fillRect(x0, TOPY, x1 - x0, 8);
    c.fillStyle = '#3E2718'; for (let lx = x0 + 40; lx < x1; lx += 520) if (lx > WALLX[1]) c.fillRect(lx, TOPY + 34, 26, FL - TOPY - 34) }
  // v20.2: мышь как у Боба — контур кривыми (спина, круп, острая мордочка), ушко-овал, глаз, усы, лапки, короткий хвост; смотрит влево, лапки — y 0
  const MOUSE = { x: 470, y: TOPY - 2 };
  const MT = [[330, -4], [[290, -8], [240, -46], [184, -40]]];   // хвост: кончик → у крупа
  const MB = [[184, -40], [[200, -90], [180, -140], [130, -160]], [[70, -182], [-20, -180], [-80, -160]], [[-130, -142], [-170, -128], [-205, -112]], [[-232, -98], [-252, -84], [-266, -70]],
    [[-252, -56], [-228, -44], [-200, -38]], [[-150, -16], [-60, -8], [20, -8]], [[100, -8], [170, -14], [184, -40]]];
  function bez(c, P) { c.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) c.bezierCurveTo(P[i][0][0], P[i][0][1], P[i][1][0], P[i][1][1], P[i][2][0], P[i][2][1]) }
  function flatB(P, n = 14) { const out = [[P[0][0], P[0][1]]]; for (let i = 1; i < P.length; i++) { const p0 = out[out.length - 1], [c1, c2, p3] = P[i];
      for (let k = 1; k <= n; k++) { const u = k / n, v = 1 - u; out.push([0, 1].map(j => v * v * v * p0[j] + 3 * v * v * u * c1[j] + 3 * v * u * u * c2[j] + u * u * u * p3[j])) } } return out }
  let MPATH = null;   // путь, по которому дым обводит мышь: хвост от кончика, потом контур тела (длины по дуге)
  function mPath() { if (MPATH) return MPATH; const P = flatB(MT).concat(flatB(MB).slice(1)); let L = 0; P.forEach((p, i) => { if (i) L += Math.hypot(p[0] - P[i - 1][0], p[1] - P[i - 1][1]); p[2] = L }); return (MPATH = { P, L }) }
  function mouseRun(t) { const a = TC; return ei(at(t, a.amer - .15, a.amer + .85)) }
  function mouse(c, t) {
    const a = TC, f = eio(at(t, a.uch - .38, a.uch + .18)); if (f <= 0) return;   // мышь заливается белым от крупа к мордочке, когда дым обвёл контур
    const run = mouseRun(t), { y } = MOUSE, x = MOUSE.x - 1250 * run, hop = run > 0 && run < 1 ? Math.abs(Math.sin(t * 26)) * 14 : 0, br = Math.sin(t * 3.1) * 2.5, base = '#F4F1EA', sk = shd(base, .24);
    c.save(); c.translate(x, y - hop);
    if (run < .02) rasterPoly(c, [-190, 0, 200, 0, 250, 54, -140, 54], 'rgba(5,20,22,.38)', 9, 2.3);
    c.save(); c.beginPath(); c.rect(lp(360, -360, f), -260, 900, 300); c.clip();
    c.beginPath(); bez(c, MT); c.strokeStyle = '#E9A9B4'; c.lineWidth = 7; c.lineCap = 'round'; c.stroke();   // хвост
    const lg = Math.sin(t * 26) * 14 * (run > 0 && run < 1 ? 1 : 0);
    rr(c, -168 + lg, -10, 34, 12, 6); fill(c, '#E9A9B4'); rr(c, 86 - lg, -10, 44, 12, 6); fill(c, '#E9A9B4');   // лапки
    c.save(); c.scale(1, 1 + br * .004); c.beginPath(); bez(c, MB); c.closePath(); fill(c, base);
    c.save(); c.beginPath(); bez(c, MB); c.closePath(); c.clip(); c.fillStyle = sk; c.fillRect(120, -200, 140, 220); c.beginPath(); c.ellipse(-30, -176, 110, 14, 0, 0, TAU); fill(c, 'rgba(255,255,255,.55)');
    c.beginPath(); c.moveTo(96, -14); c.bezierCurveTo(150, -36, 168, -98, 126, -142); lnB(c, 4, sk); c.restore(); c.restore();   // тень крупа, блик спины, линия бедра
    c.beginPath(); c.ellipse(-150, -150, 22, 31, -.35, 0, TAU); fill(c, base); c.beginPath(); c.ellipse(-150, -148, 12, 19, -.35, 0, TAU); fill(c, '#E9A9B4');   // ушко-овал
    circ(c, -206, -92, 6.5, '#1A1214'); circ(c, -208, -94.5, 2, '#fff'); circ(c, -266, -70, 6, '#E9A9B4');   // глаз, нос
    c.strokeStyle = 'rgba(230,236,240,.85)'; c.lineWidth = 2; [[-318, -96], [-326, -74], [-316, -52]].forEach(([wx, wy]) => { c.beginPath(); c.moveTo(-250, -74); c.quadraticCurveTo((wx - 250) / 2 - 125, (wy - 74) / 2 - 37, wx, wy); c.stroke() });   // усы
    const PT = { x: 30, y: -160, rx: 60, ry: 15 }; c.beginPath(); c.ellipse(PT.x, PT.y, PT.rx, PT.ry, -.04, 0, TAU); fill(c, '#EDB5BE');   // выбритое пятно
    const T0 = a.nam + .4, T1 = Math.min(t, a.smol + .35); if (T1 > T0) { c.save(); c.beginPath(); c.ellipse(PT.x, PT.y, PT.rx, PT.ry, -.04, 0, TAU); c.clip();   // смола — мазками по следу кисти
      c.beginPath(); let on = false; for (let k = 0; k <= 48; k++) { const tk = lp(T0, T1, k / 48), [bx, by] = brushPos(tk); if (by < -1092) { on = false; continue } const px = bx - MOUSE.x, py = PT.y + Math.sin(k * 1.7) * 3; if (!on) { c.moveTo(px, py); on = true } else c.lineTo(px, py) }
      c.strokeStyle = '#16100E'; c.lineWidth = 22; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); c.restore() }
    const sp = eo(at(t, a.vyr - .1, a.op + .2)); if (sp > 0) { c.beginPath(); c.ellipse(PT.x + 12, PT.y - 6 - 8 * sp, 26 * sp, 17 * sp, 0, 0, TAU); fill(c, '#5A1018'); c.beginPath(); c.ellipse(PT.x + 4, PT.y - 12 - 8 * sp, 10 * sp, 6 * sp, -.3, 0, TAU); fill(c, '#8E2C36') }   // опухоль — бугорок
    c.restore();
    if (run < .05) for (let k = 0; k < 2; k++) { const u = at(t, a.op + k * .45, a.op + .7 + k * .45); if (u <= 0 || u >= 1) continue; ring(c, 42, -176, 46 + 110 * eo(u), rgba('#E23A4E', .9 * (1 - u)), 7) }
    c.restore();
  }
  // дым от огонька — гладкая лента вверх; на «страх» обводит мышь от кончика хвоста; низ отрывается и тает.
  // v20.4 (разбор Gemini: «дым лезет в мышь снизу из-под стола»): лента идёт за перекрытием, полом и тумбой стола, над столом выходит справа от банки со смолой,
  // огибает банку сверху и опускается на кончик хвоста; обвод контура — поверх всего (smokeTrace)
  const SMK = [[540, 474], [552, 300], [566, 120], [592, -60], [640, -250], [720, -440], [830, -640], [940, -820], [1010, -958], [1044, -1080], [1026, -1188],
    [968, -1244], [890, -1250], [826, -1204], [796, -1100], [796, -990], [MOUSE.x + 330, MOUSE.y - 4]];
  let SMKP = null;
  function smokeRise(c, t) {
    const a = TC, rise = eio(at(t, a.umer + .05, a.strah - .12)); if (rise <= 0) return;
    if (!SMKP) { SMKP = smoothPts(SMK.flat(), 10); let L = 0; SMKP.forEach((p, i) => { if (i) L += Math.hypot(p[0] - SMKP[i - 1][0], p[1] - SMKP[i - 1][1]); p[2] = L }); SMKP.L = L;
      const iS = SMKP.findIndex(p => p[1] <= SLAB[1]); SMKP.uS = iS > 0 ? SMKP[iS][2] / L : 0 }   // v20.5: доля пути, на которой лента уходит за перекрытие
    const lo = eio(at(t, a.strah - .4, a.strah + .45)), fb = eio(at(t, a.strah - .62, a.strah - .22)), u0 = Math.max(lo, fb * SMKP.uS), u1 = rise,   // v20.5: пока камера поднимается к столу, хвост уходит из подвала за перекрытие
      wob = 1 - at(t, a.strah - .3, a.strah + .3);   // v20.4: низ ленты тает, как только дым вышел над столом
    if (u1 - u0 > .005) { const S = SMKP.filter(p => p[2] >= u0 * SMKP.L && p[2] <= u1 * SMKP.L).map((p, i) => [p[0] + Math.sin(t * 2.2 + p[1] * .01) * 14 * wob * (1 - p[2] / SMKP.L), p[1]]);
      if (S.length > 1) { c.save(); c.globalAlpha *= 1 - .7 * lo; ribbon(c, S, u => 14 + 10 * u, 'rgba(226,222,232,.22)'); ribbon(c, S, u => 6 + 3 * u, 'rgba(236,232,240,.8)'); c.restore() } }
  }
  function smokeTrace(c, t) {
    const a = TC, f = eio(at(t, a.uch - .38, a.uch + .18)), tr = eio(at(t, a.strah - .12, a.uch - .2)); if (tr <= 0 || f >= 1) return;   // обвод контура
    const { P, L } = mPath(), d = tr * L, S = []; for (const p of P) { if (p[2] > d) break; S.push([MOUSE.x + p[0], MOUSE.y + p[1]]) }
    if (S.length < 2) return; c.save(); c.globalAlpha *= 1 - f; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); S.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.strokeStyle = 'rgba(226,222,232,.3)'; c.lineWidth = 22; c.stroke(); c.strokeStyle = 'rgba(244,240,248,.95)'; c.lineWidth = 8; c.stroke();
    const h = S[S.length - 1]; if (tr < 1) { circ(c, h[0], h[1], 18, 'rgba(236,232,240,.35)'); circ(c, h[0], h[1], 9, 'rgba(250,248,252,.9)') } c.restore();
  }
  // кисть в стальном зажиме (без рук): штатив на столе, зажим едет сам
  function brushPos(t) {
    const a = TC, P = [[a.uch - .4, 760, -1240], [a.nam - .15, 900, -1005], [a.nam + .2, 900, -1060], [a.nam + .45, 552, -1074], [a.nam + .75, 452, -1070], [a.nam + 1.05, 552, -1068], [a.smol, 452, -1066], [a.smol + .3, 548, -1064], [a.smol + .6, 560, -1210],
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
    { const { x, y, w, h } = WIN, gl = 1 - at(t, TC.chik - .1, TC.sw - .3);   // v20.4: окно над новой пачкой — за стеклом ночной Чикаго (мир CH), в него камера и ныряет
      c.save(); rr(c, x, y, w, h, 10); c.clip(); inNest(c, NCH, cc => chWorld(cc, t, null));
      if (gl > 0) { c.fillStyle = `rgba(255,255,255,${.09 * gl})`; poly(c, [x + 40, y + h, x + 150, y + h, x + 330, y, x + 220, y]); c.fill(); poly(c, [x + 190, y + h, x + 224, y + h, x + 404, y, x + 370, y]); c.fill() }   // блики стекла
      c.restore(); rr(c, x, y, w, h, 10); lnB(c, 10, '#DCD3BE'); c.fillStyle = '#DCD3BE'; c.fillRect(x - 26, y + h + 4, w + 52, 16) }   // рама и подоконник
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
  // толпа белых фигурок: бегут к фильтрам; мужчины тормозят и отходят; v20.2: после «дарит» мужчины идут к новой пачке и подпрыгивают на щелчок
  const MEN = [0, 2, 3, 5, 6, 8, 9, 11];
  function crowd(c, t) {
    const a = TC, run = at(t, a.bros - .2, a.bros + 1.6); if (run <= 0) return;
    for (let i = 0; i < 12; i++) { const m = i % 3 !== 1, x0 = SHOPX + 500 + i * 120, xt = 1950 + (i % 8) * 120 + (m ? 40 : 0), turn = m ? eo(at(t, a.muzh - .05 + (i % 3) * .08, a.muzh + .35 + (i % 3) * .08)) : 0;
      const back = m ? eio(at(t, a.stesn, a.nezh + .2)) * 340 : 0, xb = lp(x0, xt + (m ? 260 : 0), eo(run)) + back;
      const g0 = a.dar + .05 + (i % 4) * .14, go = m ? eio(at(t, g0, g0 + 1.9)) : 0, mk = MEN.indexOf(i), xg = mk < 4 ? 2700 + mk * 78 : 3340 + (mk - 4) * 78, x = lp(xb, xg, go);   // встают по бокам пачки — её видно
      const walking = run < 1 || (go > 0 && go < 1), bob = walking ? Math.abs(Math.sin(t * 9 + i)) * 12 : 0;
      const hop = m ? Math.sin(Math.PI * at(t, a.shch + (i % 3) * .05, a.shch + .38 + (i % 3) * .05)) * 34 : 0;
      const dir = !m ? -1 : go > 0 ? (go < 1 ? Math.sign(xg - xb) || 1 : (x < PK.x + PK.w / 2 ? 1 : -1)) : (turn > .5 ? 1 : -1);
      fig(c, x, SLAB[0] - 200 + 6 - bob - hop, 1.55, { m, hat: m && i % 2 === 0, dir, col: '#F4F1EA', hc: C3.rose2 }) }
  }
  function shelfPacks(c, t) {
    const a = TC, kp = eio(at(t, a.bros - .1, a.bros + .55)), sl = eio(at(t, a.bros + .2, a.bros + 1.3)); if (kp <= 0) return;
    SHELF.forEach((tx0, i) => { if (i >= BARS.length) return; const x = lp(barX(i) - 46, tx0, sl); A(c, kp, () => pack5(c, x, TOPY - 12, 1, GRAYS[i % 4], { filt: true })) });
  }
  // v20.2: пудреница в 3/4: круглый корпус с бортиком, внутри пудра и пуховка, крышка на петле сзади — внутри зеркало; на «неженок» защёлкивается,
  // на «Филип» трескается и улетает вниз из кадра (не лежит на полу)
  function compact(c, t) {
    const a = TC, k = eio(at(t, a.schit - .2, a.schit + .25)), cr = at(t, a.fil - .12, a.fil + .18), fall = ei(at(t, a.fil + .3, a.fil + .85)); if (k <= 0 || fall >= 1) return;
    const x = 2926 - 520 * fall, y = TOPY - 12 - 136 - 40 + 1500 * fall * fall, R = 74, e = .42, th = R * .22;
    const phi = 1.9 * (1 - eio(at(t, a.nezh - .3, a.nezh + .02))), ry = R * (e * Math.cos(phi) - .91 * Math.sin(phi)), cy = -R * (.91 * Math.sin(phi) + e - e * Math.cos(phi));
    c.save(); c.translate(x, y); c.rotate(-fall * 2.4); c.scale(k, k);
    if (ry < 0) {   // крышка открыта: видно зеркало
      c.beginPath(); c.ellipse(0, cy, R, -ry, 0, 0, TAU); fill(c, '#C9A24A'); c.beginPath(); c.ellipse(0, cy, R * .86, -ry * .86, 0, 0, TAU); fill(c, '#DDEFF4');
      c.save(); c.beginPath(); c.ellipse(0, cy, R * .86, -ry * .86, 0, 0, TAU); c.clip(); c.fillStyle = 'rgba(255,255,255,.55)'; poly(c, [-R * .5, cy + R, -R * .2, cy + R, R * .3, cy - R, 0, cy - R]); c.fill(); poly(c, [R * .05, cy + R, R * .14, cy + R, R * .64, cy - R, R * .55, cy - R]); c.fill(); c.restore() }
    c.beginPath(); c.ellipse(0, th, R, R * e, 0, 0, TAU); fill(c, '#B9657A'); c.fillStyle = '#B9657A'; c.fillRect(-R, 0, R * 2, th);   // бортик
    c.beginPath(); c.ellipse(0, 0, R, R * e, 0, 0, TAU); fill(c, '#C9A24A'); c.beginPath(); c.ellipse(0, 0, R * .86, R * e * .86, 0, 0, TAU); fill(c, '#F3D5C6');   // кольцо, пудра
    c.beginPath(); c.ellipse(-R * .12, -R * .04, R * .5, R * e * .48, 0, 0, TAU); fill(c, '#FBF4EE'); c.beginPath(); c.ellipse(-R * .12, -R * .07, R * .5, R * e * .4, 0, Math.PI, TAU); fill(c, '#FFFFFF');   // пуховка
    c.beginPath(); c.ellipse(R * .3, -R * .1, R * .12, R * .07, .4, 0, TAU); fill(c, C3.rose2);   // бантик на пуховке
    if (ry >= 0) {   // крышка закрывается сверху
      c.beginPath(); c.ellipse(0, cy, R, ry, 0, 0, TAU); fill(c, '#E7A9B6'); c.beginPath(); c.ellipse(0, cy, R, ry, 0, 0, TAU); lnB(c, 3, '#C9A24A');
      c.beginPath(); c.ellipse(0, cy, R * .38, ry * .38, 0, 0, TAU); lnB(c, 3, '#C9A24A');
      if (cr > 0) { c.save(); c.beginPath(); c.ellipse(0, cy, R, ry, 0, 0, TAU); c.clip(); c.beginPath(); c.moveTo(-R, cy - 4); c.lineTo(-24, cy + 6); c.lineTo(6, cy - 8); c.lineTo(34, cy + 8); c.lineTo(R, cy - 2); c.moveTo(6, cy - 8); c.lineTo(14, cy - R * .4); lnB(c, 4 * cr, '#5a1a2a'); c.restore() } }
    c.restore();
    const kp = at(t, a.nezh - .1, a.nezh + .3) * (1 - at(t, a.fil - .3, a.fil + .1)); if (kp > 0) tx(c, 'ДЛЯ НЕЖЕНОК', 2980, TOPY - 520, { f: 'M', w: 800, s: 70 * bo(kp), c: '#F1C3CC', a: Math.min(1, kp * 2) });
  }
  // старая мягкая пачка → на «Филип» сверху падают жёсткие стенки и захлопываются — новая пачка Marlboro; на «щелчком» крышка откидывается
  const PK = { x: OLDP - 95, y: TOPY - 12, w: 190, h: 282 };
  // v20.4 (разбор Gemini: «пачка 4 секунды стоит без движения»): на «вторую жизнь» по пачке бежит блик, на «фильтр» полоса сканера показывает
  // сигареты с фильтрами внутри (как рентген у Макларена, Боб #037), на «жёсткую пачку» пачка дважды стучит о прилавок
  function packKnock(t) { const a = TC, k1 = at(t, a.zhest - .02, a.zhest + .26), k2 = at(t, a.pach - .06, a.pach + .2); return 34 * Math.sin(Math.PI * k1) + 26 * Math.sin(Math.PI * k2) }
  function packGlow(c, t) {   // за пачкой — тёплое сияние на стене (на белой пачке блик не виден)
    const a = TC, s = at(t, a.vtor - .12, a.zhizn + .45); if (s <= 0 || s >= 1) return; const { x, y, w, h } = PK, k = Math.sin(Math.PI * s);
    glow(c, x + w / 2, y - h / 2, 210 + 90 * eo(s), '#FFE7A6', .55 * k);
    for (let i = 0; i < 8; i++) { const an = -Math.PI / 2 + (i - 3.5) * .3 + Math.sin(t * .8) * .04, L0 = 160, L1 = 300 + 110 * k; c.beginPath(); c.moveTo(x + w / 2 + Math.cos(an - .04) * L0, y - h / 2 + Math.sin(an - .04) * L0);
      c.lineTo(x + w / 2 + Math.cos(an) * L1, y - h / 2 + Math.sin(an) * L1); c.lineTo(x + w / 2 + Math.cos(an + .04) * L0, y - h / 2 + Math.sin(an + .04) * L0); c.closePath(); fill(c, rgba('#FFF1B8', .28 * k)) }   // лучи — только вверх и в стороны
  }
  function packSheen(c, t) {
    const a = TC, s = at(t, a.vtor - .08, a.zhizn + .3); if (s <= 0 || s >= 1) return; const { x, y, w, h } = PK, top = y - h, o = lp(-w * .9, w * 1.25, eio(s)), al = .5 * Math.sin(Math.PI * s);
    c.save(); c.beginPath(); c.rect(x, top, w, h); c.clip(); c.fillStyle = `rgba(255,255,255,${al})`; poly(c, [x + o, top + h, x + o + w * .24, top + h, x + o + w * .24 + h * .5, top, x + o + h * .5, top]); c.fill();
    c.fillStyle = `rgba(255,255,255,${al * .5})`; poly(c, [x + o + w * .32, top + h, x + o + w * .38, top + h, x + o + w * .38 + h * .5, top, x + o + w * .32 + h * .5, top]); c.fill(); c.restore();
    for (let k = 0; k < 3; k++) { const u = at(s, .35 + k * .12, .75 + k * .1); if (u <= 0 || u >= 1) continue; const sx = [x + w + 22, x - 50, x + w * .5][k], sy = [top - 12, top + h * .42, top - 40][k], r = 16 * Math.sin(Math.PI * u);
      c.fillStyle = '#FFF6D6'; poly(c, [sx, sy - r * 2, sx + r * .35, sy - r * .35, sx + r * 2, sy, sx + r * .35, sy + r * .35, sx, sy + r * 2, sx - r * .35, sy + r * .35, sx - r * 2, sy, sx - r * .35, sy - r * .35]); c.fill() }   // искры
  }
  function packXray(c, t) {
    const a = TC, { x, y, w, h } = PK, top = y - h, sd = eio(at(t, a.filtr - .22, a.filtr + .2)), su = eio(at(t, a.zhest - .4, a.zhest - .06)); if (sd <= 0 || su >= 1) return;
    const y0 = top + h * su, y1 = top + h * sd;
    if (y1 - y0 > 1) { c.save(); c.beginPath(); c.rect(x - 2, y0, w + 4, y1 - y0); c.clip();
      c.fillStyle = '#0B1A33'; c.fillRect(x, top, w, h); c.strokeStyle = 'rgba(120,210,240,.22)'; c.lineWidth = 1.5; c.beginPath();
      for (let gx = x; gx <= x + w; gx += 19) { c.moveTo(gx, top); c.lineTo(gx, top + h) } for (let gy = top; gy <= top + h; gy += 19) { c.moveTo(x, gy); c.lineTo(x + w, gy) } c.stroke();
      for (let k = 0; k < 7; k++) { const cw = w / 7, cx = x + cw * k + cw * .12, iw = cw * .76, ct = top + h * .06, cb = top + h * .96, fh = h * .26;
        rr(c, cx, ct, iw, cb - ct, 4); c.strokeStyle = '#BFEFFF'; c.lineWidth = 2; c.stroke(); rr(c, cx, ct, iw, fh, 4); fill(c, 'rgba(226,199,154,.92)');
        c.fillStyle = 'rgba(120,70,30,.45)'; for (let s2 = 0; s2 < 3; s2++) c.fillRect(cx, ct + 10 + s2 * 18, iw, 3) }   // фильтры светятся цветом пробки
      rr(c, x + 1, top + 1, w - 2, h - 2, 2); c.strokeStyle = 'rgba(191,239,255,.9)'; c.lineWidth = 2; c.stroke(); c.restore() }   // контур коробки
    for (const ly of [sd < 1 ? y1 : null, su > 0 ? y0 : null]) if (ly !== null) { c.fillStyle = 'rgba(190,240,255,.25)'; c.fillRect(x - 14, ly - 8, w + 28, 16); c.fillStyle = '#E8FBFF'; c.fillRect(x - 14, ly - 2, w + 28, 4) }   // полосы сканера
    const kp = at(t, a.filtr - .02, a.filtr + .25) * (1 - at(t, a.zhest - .22, a.zhest)); if (kp > 0) { c.beginPath(); c.moveTo(x + w + 8, top + h * .14); c.lineTo(x + w + 64, top + h * .14); lnB(c, 3, rgba('#F4F1EA', kp));
      plate(c, 'ФИЛЬТР', x + w + 146, top + h * .14, bo(kp), { s: 30, bg: '#F4F1EA', c: '#141010', ls: 2 }) }
  }
  function packDust(c, t) {   // удары о прилавок: облачка пыли и черты удара у дна
    const a = TC, { x, y, w } = PK;
    for (const ti of [a.zhest + .26, a.pach + .2]) { const u = at(t, ti - .01, ti + .42); if (u <= 0 || u >= 1) continue;
      for (const s2 of [-1, 1]) { for (let k = 0; k < 3; k++) circ(c, x + w / 2 + s2 * (w / 2 + 10 + 50 * eo(u) + k * 22), y - 8 - k * 10 * u, (14 - k * 3) * (1 - u * .6), rgba('#E8DCC8', .55 * (1 - u)));
        c.beginPath(); c.moveTo(x + w / 2 + s2 * (w / 2 + 16), y - 30); c.lineTo(x + w / 2 + s2 * (w / 2 + 40 + 40 * u), y - 52 - 20 * u); lnB(c, 4, rgba('#F4F1EA', 1 - u)) } }
  }
  function hardPack(c, t) {
    const a = TC, d = at(t, a.fil - .05, a.fil + .5), slam = eio(d), { x, y, w, h } = PK, top = y - h;
    if (slam < 1) softPack(c, x, top, w, h, 30, { shc: 'rgba(8,24,22,.35)' });
    if (d > 0 && slam < 1) { c.save(); c.translate(0, -(1 - ei(d)) * 1100); mPack(c, x, top, w, h, 34, { shadow: false }); c.restore() }   // жёсткая пачка падает сверху и накрывает мягкую
    if (slam >= 1) { const u = at(t, a.fil + .45, a.fil + .85); if (u > 0 && u < 1) for (let k = 0; k < 6; k++) { const s2 = k < 3 ? -1 : 1, yy = y - 20 - (k % 3) * 40; c.beginPath(); c.moveTo(x + w / 2 + s2 * (w / 2 + 20 + 60 * u), yy); c.lineTo(x + w / 2 + s2 * (w / 2 + 70 + 120 * u), yy - 10); lnB(c, 5, rgba('#F4F1EA', 1 - u)) } }
    if (slam >= 1) {
      const kn = packKnock(t); c.save(); c.translate(0, -kn);   // v20.4: «жёсткую пачку» — пачка стучит о прилавок
      packGlow(c, t);
      const lid = eio(at(t, a.shch - .08, a.shch + .24)), seam = at(t, a.otkr - .35, a.shch - .1), phi = lid * 1.98, cutY = top + h * .3, L = h * .3;
      if (lid > 0 && phi > Math.PI / 2) {   // v20.2: крышка откинулась назад на петле — за сигаретами видно её изнанку (золотая фольга)
        const hh = L * -Math.cos(phi); PL(c, [x - 34, top + 2 - hh * .9, x, top - hh, x, top, x - 34, top + 2], '#C8B370');
        c.fillStyle = '#F4EEDD'; c.fillRect(x, top - hh, w, hh); c.fillStyle = '#D9C27A'; c.fillRect(x + w * .08, top - hh + hh * .18, w * .84, hh * .64) }
      if (lid > 0) { c.fillStyle = '#E6E0D2'; c.fillRect(x, top + 3, w, h * .32); c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(x + w * .7, top + 3, w * .3, h * .32) }   // задняя стенка пачки изнутри
      if (lid > 0) {   // открытая пачка: сигареты с фильтром цвета пробки выезжают на щелчок (v20.4: в башни не растут — Чикаго за окном)
        const bot = top + h * .5;
        for (let i = 0; i < 4; i++) { const cx = x + w * (.2 + i * .2), ct = top + 14 - (74 - (i % 2) * 22) * ei(lid);
          rr(c, cx - 17, ct, 34, bot - ct, 6); fill(c, C3.white); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(cx + 4, ct, 13, bot - ct); c.fillStyle = C3.cork; c.fillRect(cx - 17, ct, 34, 44);
          c.fillStyle = 'rgba(120,70,30,.35)'; for (let s = 0; s < 3; s++) c.fillRect(cx - 17, ct + 8 + s * 12, 34, 3) } }
      if (lid > 0) { c.save(); c.beginPath(); c.rect(x - 60, cutY, w + 400, h + 400); c.clip(); mPack(c, x, top, w, h, 34, { shc: 'rgba(8,24,22,.35)' }); c.restore();   // корпус ниже линии крышки
        PL(c, [x - 34, top + 6, x, cutY, x - 34, cutY + 4], C3.redD);   // бок: косой срез от петли к линии крышки
        c.fillStyle = '#D9C27A'; c.fillRect(x + w * .05, cutY - h * .07, w * .9, h * .07 + 2); c.fillStyle = '#B89B55'; c.fillRect(x + w * .05, cutY - 3, w * .9, 5); PL(c, [x - 30, cutY - h * .06, x, cutY - h * .07, x, cutY + 2, x - 30, cutY + 4], '#B89B55');   // внутренний золотой воротник
        if (phi < Math.PI / 2) { const k2 = Math.cos(phi); c.save(); c.translate(0, top); c.scale(1, Math.max(.001, k2)); c.translate(0, -top); c.beginPath(); c.rect(x - 60, top - 10, w + 120, L + 10); c.clip(); mPack(c, x, top, w, h, 34, { shadow: false }); c.restore() } }   // крышка уходит назад: лицевая сторона сжимается к петле
      else mPack(c, x, top, w, h, 34, { shc: 'rgba(8,24,22,.35)' });
      if (seam > 0 && lid <= 0) { const sx = x + w * eio(seam); c.fillStyle = '#FFF6D6'; c.fillRect(x, top + h * .3, sx - x, 5); glow(c, sx, top + h * .3, 40, '#FFF1B8', .8) }
      for (let k = 0; k < 2; k++) { const u = at(t, a.shch + k * .18, a.shch + .7 + k * .18); if (u > 0 && u < 1) ring(c, x + w / 2, top, 60 + 260 * eo(u), rgba('#FFF1B8', .8 * (1 - u)), 6) }
      packSheen(c, t); packXray(c, t); c.restore(); packDust(c, t);
    }
  }
  function wcWorld(c, t, q) {
    const a = TC, md = eio(at(t, a.spas - .2, a.strah - .2));   // марка «умерла» — на рынке гаснет свет; v20.4 — целиком: под лабораторией и лавкой пачек больше не видно
    c.fillStyle = '#1A1720'; c.fillRect(-1600, ROOF[0], SHOPX + 3200, ROOF[1] - ROOF[0]);   // крыша
    labRoom(c, t, q); shopRoom(c, t, q);
    if (md < 1) packWall(c, q, -1600, SHOPX + 1600, SLAB[1], 1500);
    c.fillStyle = '#5A3A26'; c.fillRect(-1600, 1500, SHOPX + 3200, 220); c.fillStyle = '#7A5135'; c.fillRect(-1600, 1500, SHOPX + 3200, 10); c.fillStyle = '#1A1420'; c.fillRect(-1600, 1720, SHOPX + 3200, 2000);
    if (md < 1) marketDisc(c, t);
    const kr = at(t, a.proc + .1, a.proc + .45) * (1 - at(t, a.spas - .3, a.spas + .1));
    if (kr > 0) { const T = c.getTransform(), k = bo(kr), py = Math.min(1040, (1600 - T.f) / T.d - 70 * k); plate(c, '0,25 % РЫНКА', 540, py, k, { s: 62, bg: '#F4F1EA', c: '#141010', ls: 2 }) }   // v20.5: камера уходит вверх за дымом — плашка остаётся над субтитром (низ не ниже 1600 px), а не съезжает под него
    if (md > 0) { const v = viewRect(q); if (v.y1 > SLAB[1]) { const g = c.createLinearGradient(0, SLAB[1], 0, SLAB[1] + 1100); g.addColorStop(0, `rgba(22,19,28,${md})`); g.addColorStop(1, `rgba(8,7,11,${md})`);
      c.fillStyle = g; c.fillRect(v.x0 - 50, SLAB[1], v.x1 - v.x0 + 100, v.y1 - SLAB[1] + 50) } }
    smokeRise(c, t);   // v20.4: лента дыма — за перекрытием, полом и тумбой стола
    c.fillStyle = '#1A1720'; c.fillRect(-1600, SLAB[0], SHOPX + 3200, SLAB[1] - SLAB[0]); c.fillStyle = '#26222E'; for (let bx = -1560; bx < SHOPX + 1600; bx += 240) c.fillRect(bx, SLAB[0] + 34, 70, 52);   // перекрытие: торцы балок
    table(c, -300, SHOPX + 400); mouse(c, t); tarJar(c); strokeAxis(c, t); bars(c, t); shelfPacks(c, t);
    hardPack(c, t); compact(c, t); crowd(c, t); brushRig(c, t);
    smokeTrace(c, t);
  }
  function wcShot(c, t) { if (KCH && t >= TC.sw) return chShot(c, t); const q = camObj(camAt(KC, t)); layer(c, q, 1, cc => wcWorld(cc, t, q));
    layer(c, q, 1.3, cc => { const v = viewRect(q); if (v.y1 < SLAB[0] - 600 || v.y0 > SLAB[0] + 400) return;   // шестигранники смолы плывут мимо камеры
      for (let i = 0; i < 9; i++) { const hx = -200 + i * 260 + Math.sin(t * .5 + i) * 30, hy = -1500 + H1(i * 3) * 900 + ((t * 40 + i * 111) % 600) - 300, R = 26 + H1(i) * 18;
        cc.beginPath(); for (let k = 0; k < 6; k++) { const an = k * Math.PI / 3; cc.lineTo(hx + Math.cos(an) * R, hy + Math.sin(an) * R) } cc.closePath(); lnB(cc, 3, 'rgba(160,230,224,.28)') } });
  }
