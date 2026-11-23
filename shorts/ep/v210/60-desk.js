  // ================= мир H — кабинет FDA (строки 10–13) =================
  // Стык с лабораторией: камера ныряет в белое поле журнала — и выныривает из того же журнала на столе кабинета (тот же рисунок, m = 1).
  // Строка 10: за окном здание FDA и флаг США; на журнал ложится бланк из двух строк: у «МЕНЬШЕ ВЕЩЕСТВ» — галочка, «МЕНЬШЕ ВРЕДА» закрывает
  // красная планка «НЕЛЬЗЯ» (#105), вторая галочка отскакивает от планки.
  // Строка 11: планка тянется в красную нить и вытаскивает из-под журнала записку «Рейнольдс» 1973 года (та же, что в главе 1; #126);
  // за окном вместо FDA выезжает башня Reynolds и заводы. Дата подсвечивается, «МОЛОДЁЖНОГО РЫНКА» — под маркером.
  // Строка 12: записка уезжает, на её место падают пачка Premier и сигарета с угольком: уголёк гаснет, вспыхивает, прожигает стопку долларов (#089).
  // Строка 13: из пепла выезжает синий лист PATENT · R.J. Reynolds и ложится на карту США, что лежит на том же столе (карта — 70-map.js).
  let TH = null, KH = null;
  const RH = { x: 540, y: 1000, z: 1, r: 0 };   // опорная камера параллакса
  const WINH = { x0: 110, x1: 970, y0: 130, y1: 820 }, DESKH = 930, BLT = { x0: 70, x1: 1060, y0: 1030, y1: 1660 };
  const JRH = { x: 380, y: 1250 }, FORM = { x: 395, y: 1232, w: 400, h: 276, r: -.035 }, IQH = { x: 300, y: 1512, L: 220 };
  const MEMO0 = { x: 404, y: 1254, s: .48, r: -1.55 }, MEMO1 = { x: 800, y: 1290, s: .48, r: .04 }, MEMO2 = { x: 940, y: 2300, s: .48, r: .32 };
  const PREMH = { x: 690, y: 1262 }, CIGH = [588, 1452, 858, 1410], BILLH = { x: 930, y: 1416, w: 150, n: 9 }, DRUMH = { x: 930, y: 1566 };
  const PAT0 = { x: 930, y: 1404 }, PAT1 = { x: 1290, y: 1330, r: -.12 }, PATW = 300, PATHH = 390;
  function deskInit() {
    const w10 = (q, n) => Ws('s10', q, n), w11 = (q, n) => Ws('s11', q, n), w12 = (q, n) => Ws('s12', q, n), w13 = (q, n) => Ws('s13', q, n);
    TH = { j: TG.jGH, reg: w10('регулятор'), razr: w10('разрешил'), vesch: w10('веществ'), mensh: w10('меньше', 0), vreda: w10('вреда'), mensh2: w10('меньше', 1),
      razresh: w10('разрешает'), por: w10('пор'), pomn: w11('помните'), reyn: w11('рейнольдс'), sem: w11('семьдесят'), isk: w11('искали'), podr: w11('подростков'),
      svoi: w12('свои'), prizh: w12('прижились'), ugol: w12('угольком'), sela: w12('съела'), treh: w12('трёхсот'), doll: w12('долларов'),
      pat: w13('патенты'), vyzh: w13('выжили'), perv: w13('первом'), kom: w13('комиссия'), narush: w13('нарушает'), vygn: w13('выгнала'), amer: w13('америки'),
      obesch: Ws('s14', 'обещание') };
    const a = TH; a.jHA = a.obesch + .15; a.form = a.reg + .05; a.land = a.perv + .02;
    const ZB = window.WIDE ? WIDE.z : 1;   // 24.11 (Андрей): в 16:9 сцена «−$300 МЛН» — без приближения камеры ×1,3 (бумага слева и «США» справа целиком)
    KH = [KY(a.j + .6, 452, 1150, 2.6), KY(a.reg + .45, window.WIDE ? 560 : 530, window.WIDE ? 1010 : 985, window.WIDE ? 1.5 : 1.16), KY(a.vesch, 470, 1120, window.WIDE ? 1.62 : 1.42),   // 24.11: в 16:9 ближе — справа нет пустого стола
       KY(a.mensh + .1, 430, 1188, 1.72), KY(a.vreda + .3, 420, 1205, 1.86),
      KY(a.razresh + .5, 450, 1180, 1.62), KY(a.pomn + .3, 600, 1130, 1.34), KY(a.reyn + .45, 650, 1000, 1.14), KY(a.sem + .05, 790, 1258, 2.0), KY(a.podr + .3, 800, 1300, 2.2),
      KY(a.svoi + .35, 790, 1332, 1.85 / ZB), KY(a.prizh + .2, 800, 1362, 2.0 / ZB), KY(a.ugol + .25, 845, 1392, 1.98 / ZB), KY(a.sela + .7, 890, 1432, 1.92 / ZB), KY(a.doll + .25, 910, 1452, 1.9 / ZB),
      KY(a.pat + .25, 1010, 1412, 1.62), KY(a.perv - .25, 1300, 1430, 1.55), KY(a.perv + .45, 1470, 1480, 1.82), KY(a.kom + .4, 1500, 1470, 1.9), KY(a.narush + .1, 1470, 1500, 2.05),
      KY(a.vygn + .2, 1600, 1540, 1.95), KY(a.amer + .3, 1640, 1560, 1.95), KY(a.jHA, 1650, 1560, 2.05)];
  }
  // ---------- за окном: здание FDA с флагом → башня Reynolds и заводы (сумерки) ----------
  function flag4(c, x, y, w, h, t) {   // флаг США полосками, колышется
    const n = 16; for (let i = 0; i < n; i++) { const u = i / n, dx = x + u * w, dy = Math.sin(t * 3.2 - u * 5) * 6 * u, cw = w / n + 1;
      for (let s = 0; s < 7; s++) { c.fillStyle = s % 2 ? '#F4F1EA' : '#B22234'; c.fillRect(dx, y + dy + s * h / 7, cw, h / 7 + .5) }
      if (u < .42) { c.fillStyle = '#3C3B6E'; c.fillRect(dx, y + dy, cw, h * 4 / 7) } }
    c.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 6; i++) { const u = (.05 + (i % 3) * .12), dy = Math.sin(t * 3.2 - u * 5) * 6 * u; c.fillRect(x + u * w, y + dy + 8 + Math.floor(i / 3) * 16, 4, 4) }
  }
  function fdaFar(c, t) {
    const a = TH, sw = eio(at(t, a.reyn - .25, a.reyn + .55)), dusk = eio(at(t, a.reyn - .1, a.svoi + .6));
    const SK = ['#8FB6DE', '#A9C8E6', '#C7DCEE', '#E2EBF1'], SD = ['#24264F', '#433A6A', '#83566F', '#CC8660'];
    SK.forEach((col, i) => { c.fillStyle = mixc(col, SD[i], dusk); c.fillRect(-1600, -400 + i * 320, 4300, 322) });
    c.fillStyle = mixc('#E2EBF1', '#E39A63', dusk); c.fillRect(-1600, 880, 4300, 700);
    c.save(); c.translate(lp(-130, -1630, sw), 0);   // здание FDA (кампус Уайт-Оук): длинный корпус, центральный блок, вывеска, флаг
    const B = '#C9CED8', BD = '#A8AFBE', W = '#6F86A6';
    c.fillStyle = '#7E9A6E'; c.fillRect(-300, 800, 1700, 500);
    c.fillStyle = B; c.fillRect(110, 560, 860, 250); c.fillStyle = BD; c.fillRect(110, 560, 860, 14); c.fillRect(110, 790, 860, 20);
    c.fillStyle = W; for (let r = 0; r < 4; r++) for (let i = 0; i < 19; i++) { const x = 130 + i * 44; if (x > 395 && x < 690) continue; c.fillRect(x, 596 + r * 46, 26, 26) }
    c.fillStyle = B; c.fillRect(410, 400, 270, 410); c.fillStyle = BD; c.fillRect(410, 400, 270, 16); c.fillRect(640, 416, 40, 394);
    c.fillStyle = W; for (let r = 0; r < 6; r++) for (let i = 0; i < 4; i++) c.fillRect(432 + i * 52, 438 + r * 42, 30, 26);
    rr(c, 448, 702, 194, 50, 6); fill(c, '#1D3F8F'); tx(c, OBJ.fda, 545, 728, { f: 'M', w: 800, s: 38, c: '#FFFFFF', ls: 8 });
    c.fillStyle = '#26324F'; c.fillRect(505, 756, 80, 54);
    c.fillStyle = '#8A8F9C'; c.fillRect(858, 420, 7, 390); circ(c, 861, 418, 7, '#C9A24A'); flag4(c, 866, 428, 132, 78, t);
    for (let i = 0; i < 14; i++) circ(c, 120 + i * 64, 812, 34 + H1(i) * 10, i % 2 ? '#4E6B45' : '#5A7A4F');   // кусты
    c.restore();
    c.save(); c.translate(lp(1500, 0, sw), 0);   // башня Reynolds (ар-деко) и заводы с трубами, как в главе 1
    const L = mixc('#C8B08A', '#9C7F6A', dusk), LD = mixc('#A88F6C', '#7A6152', dusk);
    c.fillStyle = mixc('#5B6B52', '#2C2A3E', dusk); c.fillRect(-300, 800, 1700, 500);
    c.fillStyle = mixc('#8F7E6E', '#4A3F4E', dusk); c.fillRect(120, 650, 330, 160); for (let i = 0; i < 5; i++) { poly(c, [120 + i * 66, 650, 153 + i * 66, 600, 186 + i * 66, 650]); fill(c, mixc('#8F7E6E', '#4A3F4E', dusk)) }
    [210, 300, 390].forEach((x, i) => { c.fillStyle = mixc('#7A6A5C', '#3E3443', dusk); c.fillRect(x - 16, 400 + i * 30, 32, 260 - i * 30); c.fillStyle = '#B22234'; c.fillRect(x - 16, 420 + i * 30, 32, 14);
      smokeLine(c, [x, 400 + i * 30, x + 30 + Math.sin(t + i) * 10, 300 + i * 30, x + 80, 200 + i * 30, x + 150 + Math.sin(t * .7 + i) * 16, 110 + i * 30], 12, '#D6D0D8', .55) });
    const TX = 690; c.fillStyle = L; c.fillRect(TX - 110, 360, 220, 450); c.fillRect(TX - 82, 270, 164, 100); c.fillRect(TX - 56, 200, 112, 80); c.fillRect(TX - 30, 150, 60, 60);
    c.fillStyle = LD; c.fillRect(TX + 60, 360, 50, 450); c.fillRect(TX + 44, 270, 38, 100); c.fillRect(TX + 30, 200, 26, 80); c.fillStyle = L; c.fillRect(TX - 3, 90, 6, 62);
    c.fillStyle = 'rgba(40,30,30,.35)'; for (let i = 0; i < 9; i++) c.fillRect(TX - 98 + i * 22, 380, 8, 420);
    c.fillStyle = rgba('#FFD27A', .75 * dusk); for (let r = 0; r < 14; r++) for (let i = 0; i < 9; i++) if (H1(r * 9 + i) > .6) c.fillRect(TX - 98 + i * 22 + 10, 392 + r * 28, 9, 12);
    c.restore();
  }
  // ---------- кабинет: стена с окном, стол, кожаная вставка, лампа ----------
  function deskRoom(c, t) {
    c.save(); c.beginPath(); c.rect(-3000, -2000, 7000, DESKH + 2000); c.rect(WINH.x0, WINH.y0, WINH.x1 - WINH.x0, WINH.y1 - WINH.y0); c.fillStyle = '#2C3349'; c.fill('evenodd'); c.restore();
    c.fillStyle = 'rgba(255,255,255,.035)'; for (let x = -2900; x < 4000; x += 140) { if (x > WINH.x0 - 10 && x < WINH.x1 + 10) { c.fillRect(x, -2000, 3, WINH.y0 + 2000); c.fillRect(x, WINH.y1, 3, DESKH - WINH.y1) } else c.fillRect(x, -2000, 3, DESKH + 2000) }
    const f = 20; c.fillStyle = '#D9DCE2'; c.fillRect(WINH.x0 - f, WINH.y0 - f, WINH.x1 - WINH.x0 + 2 * f, f); c.fillRect(WINH.x0 - f, WINH.y0, f, WINH.y1 - WINH.y0); c.fillRect(WINH.x1, WINH.y0, f, WINH.y1 - WINH.y0);
    c.fillRect((WINH.x0 + WINH.x1) / 2 - 6, WINH.y0, 12, WINH.y1 - WINH.y0); c.fillStyle = '#B9BDC6'; c.fillRect(WINH.x0 - 34, WINH.y1, WINH.x1 - WINH.x0 + 68, 26);
    c.fillStyle = '#E4E6EA'; c.fillRect(WINH.x0, WINH.y0, WINH.x1 - WINH.x0, 64); c.fillStyle = 'rgba(0,0,0,.13)'; for (let i = 0; i < 5; i++) c.fillRect(WINH.x0, WINH.y0 + 10 + i * 11, WINH.x1 - WINH.x0, 2);   // жалюзи подняты
    c.save(); c.beginPath(); c.rect(WINH.x0, WINH.y0, WINH.x1 - WINH.x0, WINH.y1 - WINH.y0); c.clip(); glint(c, WINH.x0, WINH.y0, WINH.x1 - WINH.x0, WINH.y1 - WINH.y0, .05); c.restore();
    c.fillStyle = '#3A2A22'; c.fillRect(-3000, DESKH, 7000, 3000); c.fillStyle = '#5C4334'; c.fillRect(-3000, DESKH, 7000, 12);
    c.strokeStyle = 'rgba(20,12,8,.35)'; c.lineWidth = 3; c.beginPath(); for (let i = 0; i < 26; i++) { const yy = DESKH + 50 + i * 64; c.moveTo(-3000, yy); for (let x = -3000; x < 3200; x += 180) c.lineTo(x + 90, yy + Math.sin(x * .011 + i) * 6) } c.stroke();
    rr(c, BLT.x0, BLT.y0, BLT.x1 - BLT.x0, BLT.y1 - BLT.y0, 10); fill(c, '#2C4F43'); rr(c, BLT.x0 + 14, BLT.y0 + 14, BLT.x1 - BLT.x0 - 28, BLT.y1 - BLT.y0 - 28, 6);
    c.setLineDash([10, 9]); lnB(c, 2, 'rgba(201,162,74,.5)'); c.setLineDash([]);
    const g = c.createRadialGradient(380, 1240, 40, 380, 1240, 560); g.addColorStop(0, 'rgba(255,230,184,.13)'); g.addColorStop(1, 'rgba(255,230,184,0)'); c.fillStyle = g; c.fillRect(-180, 680, 1120, 1120);   // пятно лампы
  }
  function lampH(c) {   // лампа банкира: латунь, зелёный абажур
    const bx = -10, by = 1112; c.beginPath(); c.ellipse(bx + 12, by + 12, 92, 22, 0, 0, TAU); fill(c, 'rgba(6,8,20,.35)');
    c.beginPath(); c.ellipse(bx, by, 82, 20, 0, 0, TAU); fill(c, '#A8823A'); c.beginPath(); c.ellipse(bx, by - 6, 72, 15, 0, 0, TAU); fill(c, '#D6B05A');
    c.fillStyle = '#B8913F'; c.fillRect(bx - 7, by - 196, 14, 190); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(bx - 4, by - 190, 3, 182); c.fillStyle = '#B8913F'; c.fillRect(bx - 7, by - 202, 130, 12);
    const sx = bx + 120, sy = by - 212; c.beginPath(); c.moveTo(sx - 150, sy + 40); c.quadraticCurveTo(sx - 140, sy - 30, sx, sy - 34); c.quadraticCurveTo(sx + 140, sy - 30, sx + 150, sy + 40); c.closePath();
    cel(c, sx - 150, sy - 34, 300, 74, '#1F6B4E', { sw: .3, hx: .1, ha: .3 }); c.fillStyle = '#F6D98A'; c.fillRect(sx - 146, sy + 36, 292, 8);
  }
  function lampBeam(c, t) {   // конус света лампы и пылинки (передний план)
    const sx = 110, sy = 944; c.save(); poly(c, [sx - 140, sy, sx + 140, sy, 760, 1560, -40, 1560]); c.fillStyle = 'rgba(255,230,184,.05)'; c.fill(); c.clip();
    for (let i = 0; i < 18; i++) { const px = -20 + H1(i * 3.7 + 1) * 760 + Math.sin(t * .3 + i) * 24, py = 960 + ((H1(i * 5.1 + 2) * 600 + t * (10 + H1(i) * 12)) % 600); circ(c, px, py, 2 + H1(i * 2) * 2.2, `rgba(255,236,200,${.3 + .25 * Math.sin(t + i)})`) }
    c.restore();
  }
  // ---------- бланк FDA: две строки, печать; галочки и планка «НЕЛЬЗЯ» ----------
  function checkPath(c, x, y, s, k, col, w = 9) {   // галочка рисуется по длине (k 0..1)
    if (k <= 0) return; const P = [[-14, 0], [-3, 13], [22, -20]].map(([u, v]) => [x + u * s, y + v * s]), L1 = Math.hypot(P[1][0] - P[0][0], P[1][1] - P[0][1]), L2 = Math.hypot(P[2][0] - P[1][0], P[2][1] - P[1][1]), d = (L1 + L2) * cl(k);
    c.beginPath(); c.moveTo(P[0][0], P[0][1]); if (d <= L1) c.lineTo(lp(P[0][0], P[1][0], d / L1), lp(P[0][1], P[1][1], d / L1)); else { c.lineTo(P[1][0], P[1][1]); c.lineTo(lp(P[1][0], P[2][0], (d - L1) / L2), lp(P[1][1], P[2][1], (d - L1) / L2)) }
    lnB(c, w, col);
  }
  const ROW1 = -12, ROW2 = 78;
  function formH(c, t, x, y, r, s, barK) {
    const a = TH, { w, h } = FORM; c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    rasterPoly(c, [-w / 2 + 16, h / 2, w / 2, h / 2, w / 2 + 60, h / 2 + 36, -w / 2 + 76, h / 2 + 36], 'rgba(6,8,24,.32)', 9, 2.2);
    c.fillStyle = '#FBFAF6'; c.fillRect(-w / 2, -h / 2, w, h); c.fillStyle = '#1D3F8F'; c.fillRect(-w / 2, -h / 2, w, 12);
    textLines(c, -w / 2 + 24, -h / 2 + 30, w * .5, 30, 3, 'rgba(27,26,24,.3)', 81);
    ring(c, w / 2 - 56, -h / 2 + 58, 40, '#1D3F8F', 4); ring(c, w / 2 - 56, -h / 2 + 58, 31, '#1D3F8F', 1.6); tx(c, OBJ.fda, w / 2 - 56, -h / 2 + 60, { f: 'M', w: 800, s: 24, c: '#1D3F8F', ls: 2 });
    [[TEXT.less, ROW1], [TEXT.harm, ROW2]].forEach(([s0, yy]) => { rr(c, -w / 2 + 24, yy - 22, 44, 44, 6); lnB(c, 3, '#2B2E36'); tx(c, s0, -w / 2 + 88, yy + 2, { f: 'M', w: 800, s: 34, c: '#141010', al: 'left', mw: w - 112 }) });
    checkPath(c, -w / 2 + 46, ROW1 + 2, 1.15, eo(at(t, a.mensh - .05, a.mensh + .3)), '#17A86B');
    const kb = at(t, a.vreda - .12, a.vreda + .1), thin = barK ?? 0;   // планка «НЕЛЬЗЯ»: падает сверху со стуком
    if (kb > 0 && thin < 1) { const dy = -150 * (1 - eo(kb)), sc = lp(1.25, 1, eo(kb)), hit = at(t, a.razresh + .2, a.razresh + .45), sh = Math.sin(hit * Math.PI * 4) * 6 * (1 - hit) * (hit > 0 ? 1 : 0), hh = lp(64, 6, thin);
      c.save(); c.translate(sh, ROW2 + dy + sh * .3); c.scale(sc, sc); c.globalAlpha *= Math.min(1, kb * 4);
      c.fillStyle = C4.red; c.fillRect(-w / 2 + 8, -hh / 2, w - 16, hh);   // v21.1: плоская полоса, как штамп
      if (thin < .3) tx(c, TEXT.no, 0, 3, { f: 'M', w: 800, s: 38, c: '#FFFFFF', ls: 8, a: 1 - thin / .3 });
      c.restore() }
    const kc = at(t, a.razresh - .1, a.razresh + .7);   // вторая галочка пробует встать — и отскакивает от планки
    if (kc > 0 && kc < 1) { const hit = .45, u = kc < hit ? eio(kc / hit) : 1, v = kc < hit ? 0 : (kc - hit) / (1 - hit);
      const px = kc < hit ? lp(-w / 2 - 80, -w / 2 + 46, u) : lp(-w / 2 + 46, -w / 2 - 120, v), py = kc < hit ? lp(-170, ROW2 - 46, u) : ROW2 - 46 - Math.sin(Math.PI * Math.min(1, v * 1.2)) * 120 + v * v * 160;
      c.save(); c.translate(px, py); c.rotate(kc < hit ? 0 : -v * 3); c.globalAlpha *= kc < hit ? 1 : 1 - v; checkPath(c, 0, 0, 1.15, 1, '#17A86B'); c.restore() }
    c.restore();
  }
  // ---------- записка R.J. Reynolds 1973 (как в главе 1) ----------
  let MQF = 0;
  function stamp4(c, s, x, y, k, col, r = -.2, fs = 50) {
    if (k <= 0) return; const sc = lp(1.5, 1, bo(k)); c.save(); c.translate(x, y); c.rotate(r); c.scale(sc, sc); c.globalAlpha *= cl(k * 5) * .94;
    const w = tw(c, s, { s: fs, ls: 6 }) + fs * 1.1, h = fs * 1.9; c.strokeStyle = col; rr(c, -w / 2, -h / 2, w, h, 14); c.lineWidth = 7; c.stroke();
    rr(c, -w / 2 + 11, -h / 2 + 11, w - 22, h - 22, 8); c.lineWidth = 2.5; c.stroke(); tx(c, s, 0, 3, { s: fs, ls: 6, c: col }); c.restore();
  }
  function memo4(c, t, P, o = {}) {
    c.save(); c.translate(P.x, P.y); c.rotate(P.r); c.scale(P.s, P.s); c.translate(-320, -400);
    c.fillStyle = 'rgba(20,25,53,.3)'; c.fillRect(18, 22, 640, 800); c.fillStyle = '#FBF6EA'; c.fillRect(0, 0, 640, 800);
    tx(c, OBJ.rj, 56, 72, { f: 'J', w: 700, s: 22, ls: 2, c: '#1f2858', al: 'left' }); c.fillStyle = '#1f2858'; c.fillRect(56, 96, 528, 4);
    tx(c, TEXT.memo, 56, 150, { s: 50, c: '#141935', al: 'left' });
    if (o.date > 0) { const m = eio(o.date), w = tw(c, TEXT.memoDate, { f: 'J', w: 500, s: 24, ls: 1 }) + 20; poly(c, [46, 184, 46 + w * m, 182, 46 + w * m - 4, 218, 44, 216]); fill(c, '#FFE27A') }
    tx(c, TEXT.memoDate, 56, 200, { f: 'J', w: 500, s: 24, ls: 1, c: '#2e3c7e', al: 'left' });
    [520, 470, 505, 330, 480].forEach((L, i) => { rr(c, 56, 250 + i * 32, L, 13, 6.5); fill(c, '#d8cdb8') });
    if (!MQF) MQF = Math.min(48, 48 * 528 / Math.max(...TEXT.quote.map(q => tw(c, q.join(' '), { f: 'J', w: 700, s: 48 }))));
    const fs = MQF;
    TEXT.quote.forEach((L, i) => { const y = 470 + i * fs * 1.25, s0 = L.join(' ');
      if (i === 2 && o.mk > 0) { const m = eio(o.mk), w = (tw(c, s0, { f: 'J', w: 700, s: fs }) + 28) * m; poly(c, [44, y - fs * .52, 44 + w, y - fs * .56, 44 + w - 6, y + fs * .52, 40, y + fs * .5]); fill(c, '#FFE27A') }
      tx(c, s0, 56, y, { f: 'J', w: 700, s: fs, c: '#141935', al: 'left' }) });
    c.save(); c.strokeStyle = '#1f2858'; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
    for (let i = 0; i <= 70; i++) { const u = i / 70, px = 60 + u * 220, py = 700 + Math.sin(u * 17) * 15 * (1 - u * .5) - u * 10 + Math.sin(u * 5) * 6; i ? c.lineTo(px, py) : c.moveTo(px, py) } c.stroke(); c.restore();
    tx(c, TEXT.sign, 60, 748, { f: 'J', w: 500, s: 17, ls: 1, c: '#2e3c7e', al: 'left' });
    stamp4(c, TEXT.secret, 450, 318, 1, '#e8475a');
    if (o.glow > 0) glow(c, 160, 200, 260, '#FFE27A', .25 * o.glow);
    c.restore();
  }
  function memoPose(t) {   // под журналом → вытянута нитью вправо → уезжает со стола
    const a = TH, k1 = eio(at(t, a.pomn + .42, a.reyn + .5)), k2 = ei(at(t, a.svoi - .1, a.svoi + .55)), L = (p, q, k) => ({ x: lp(p.x, q.x, k), y: lp(p.y, q.y, k), s: p.s, r: lp(p.r, q.r, k) });
    return k2 > 0 ? L(MEMO1, MEMO2, k2) : L(MEMO0, MEMO1, k1);
  }
  const memoPin = P => [P.x + (Math.cos(P.r) * 320 + Math.sin(P.r) * 120) * P.s, P.y + (Math.sin(P.r) * 320 - Math.cos(P.r) * 120) * P.s];   // правый край записки — к нему привязана нить
  // ---------- Premier: пачка, сигарета с угольком, доллары, пепел, счётчик ----------
  function premier4(c, x, y, s = 1) {   // v21.2: пачка Premier в объёме — лицо, крыша, бок, растровая тень 35°
    const w = 110 * s, h = 165 * s, d = w * .4, dx = d * .93, dy = -d * .37; c.save(); c.translate(x - w / 2, y - h / 2);
    castDots(c, 4, h - 6, w + dx, 10, h * .55, { k: .9, col: 'rgba(0,0,0,.4)' });
    PL(c, [w, 0, w + dx, dy, w + dx, h + dy, w, h], '#C3C9D4'); PL(c, [w, h * .3, w + dx, h * .3 + dy, w + dx, h * .51 + dy, w, h * .51], '#162C5E');
    PL(c, [0, 0, dx, dy, w + dx, dy, w, 0], '#FFFFFF'); SL(c, [2, 0, w - 2, 0], 'rgba(0,0,0,.18)', 1.5); c.fillStyle = '#F7F7F4'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#1E3A7A'; c.fillRect(0, h * .3, w, h * .21); c.fillStyle = '#C9A24A'; c.fillRect(0, h * .51, w, h * .025);
    tx(c, OBJ.premier, w / 2, h * .405, { f: 'P', w: 700, st: 'italic', s: w * .25, c: '#FFFFFF' }); tx(c, OBJ.rjs, w / 2, h * .74, { f: 'M', w: 800, s: w * .085, c: '#1E3A7A', mw: w * .84 });
    c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(1, 2, 2, h - 4); c.restore();
  }
  function ash4(c, x, y, k) {   // горстка пепла
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k); c.beginPath(); c.ellipse(6, 10, 86, 22, 0, 0, TAU); fill(c, 'rgba(6,8,20,.3)');
    c.beginPath(); c.moveTo(-80, 6); c.quadraticCurveTo(-40, -34, 0, -38); c.quadraticCurveTo(46, -32, 82, 6); c.closePath(); fill(c, '#8E8A88');
    c.beginPath(); c.moveTo(-50, 0); c.quadraticCurveTo(-10, -30, 30, -22); c.quadraticCurveTo(10, -6, -50, 0); fill(c, '#B6B1AE');
    c.fillStyle = '#4A4442'; for (let i = 0; i < 14; i++) c.fillRect(-60 + H1(i * 3.1) * 120, -26 + H1(i * 7.7) * 28, 5, 3); c.restore();
  }
  function premierScene(c, t) {
    const a = TH, kl = at(t, a.svoi - .05, a.svoi + .4); if (kl <= 0) return;
    const fall = eo(kl), sc = lp(1.35, 1, fall), dy = -260 * (1 - fall);
    c.save(); c.translate(PREMH.x, PREMH.y + dy); c.scale(sc, sc); c.translate(-PREMH.x, -PREMH.y); c.globalAlpha *= Math.min(1, kl * 3); premier4(c, PREMH.x, PREMH.y, 1); c.restore();
    const kc = at(t, a.svoi + .12, a.svoi + .5), cf = eo(kc), cdy = -300 * (1 - cf); if (kc <= 0) return;
    // уголёк: тёмный → тлеет → гаснет на «прижились» → вспыхивает на «угольком» → горит, пока прожигает доллары
    const em = (.45 + .1 * Math.sin(t * 6)) * (1 - at(t, a.prizh - .1, a.prizh + .45)) + at(t, a.ugol - .1, a.ugol + .15) * (.9 + .1 * Math.sin(t * 11)) * (1 - at(t, a.doll + .2, a.doll + .7));
    const [x0, y0, X1, Y1] = CIGH, bu = .3 * eio(at(t, a.ugol, a.doll + .4)), x1 = lp(X1, x0, bu), y1 = lp(Y1, y0, bu); c.save(); c.translate(0, cdy); c.globalAlpha *= Math.min(1, kc * 3);   // v21.1: сигарета сгорает — короче
    c.beginPath(); c.ellipse((x0 + x1) / 2 + 10, (y0 + y1) / 2 + 16, 150, 12, Math.atan2(y1 - y0, x1 - x0), 0, TAU); fill(c, 'rgba(6,8,20,.3)');
    cig3(c, x0, y0, x1, y1, 13, { tip: '#D9B48A', tl: .24, em, ek: 1.15 }); if (em > .3) glow(c, x1 - 8, y1, 90, '#FF7A30', .5 * (em - .3)); c.restore();
    const kb = at(t, a.ugol - .05, a.ugol + .35), burn = eio(at(t, a.sela - .05, a.doll + .05));
    if (kb > 0 && burn < 1) { c.save(); c.translate(BILLH.x, BILLH.y); c.scale(bo(kb), bo(kb)); c.translate(-BILLH.x, -BILLH.y);
      c.beginPath(); c.ellipse(BILLH.x + 8, BILLH.y + 26, 90, 16, 0, 0, TAU); fill(c, 'rgba(6,8,20,.3)'); bills4(c, BILLH.x, BILLH.y, BILLH.w, BILLH.n, burn); c.restore();
      if (burn > 0) for (let i = 0; i < 3; i++) smokeLine(c, [BILLH.x - 40 + i * 40, BILLH.y - 60 + burn * 50, BILLH.x - 30 + i * 40 + Math.sin(t * 2 + i) * 14, BILLH.y - 150, BILLH.x - 50 + i * 40, BILLH.y - 250], 7, '#B9B6C4', .5 * Math.sin(Math.PI * burn)) }
    ash4(c, BILLH.x + BILLH.w * .42, BILLH.y + 20, eo(at(t, a.sela + .1, a.doll + .1)) * (1 - eio(at(t, a.pat - .05, a.pat + .5))));   // v21.2: пепел на столе — у обгоревшего края, не «аквариум» поверх купюр
  }
  // ---------- синий чертёж PATENT · R.J. Reynolds (без года) ----------
  const PBL = [-46, 8];   // лезвие нагревателя на чертеже (координаты листа)
  function patent4(c, t, x, y, r, s, o = {}) {
    const w = PATW, h = PATHH; c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const lift = o.lift || 0; rasterPoly(c, [-w / 2 + 14 + lift * 40, h / 2 + lift * 50, w / 2 + lift * 40, h / 2 + lift * 50, w / 2 + 56 + lift * 40, h / 2 + 36 + lift * 50, -w / 2 + 70 + lift * 40, h / 2 + 36 + lift * 50], `rgba(6,8,24,${.32 - lift * .12})`, 9, 2.2);
    c.fillStyle = C4.bp; c.fillRect(-w / 2, -h / 2, w, h); c.fillStyle = 'rgba(255,255,255,.07)'; for (let i = -w / 2 + 20; i < w / 2; i += 20) c.fillRect(i, -h / 2, 1.5, h); for (let i = -h / 2 + 20; i < h / 2; i += 20) c.fillRect(-w / 2, i, w, 1.5);
    c.strokeStyle = 'rgba(234,241,255,.75)'; c.lineWidth = 2; c.strokeRect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20);
    tx(c, OBJ.patent, 0, -h / 2 + 46, { f: 'M', w: 800, s: 38, c: '#FFFFFF', ls: 10, mw: w - 40 }); tx(c, OBJ.rjs, 0, -h / 2 + 84, { f: 'P', w: 700, st: 'italic', s: 24, c: '#DCE6FF' });
    c.strokeStyle = '#EAF1FF'; c.lineWidth = 2.5; rr(c, -110, -16, 220, 52, 26); c.stroke(); rr(c, -98, -6, 196, 32, 16); c.lineWidth = 1.5; c.stroke();
    c.setLineDash([6, 5]); c.beginPath(); c.moveTo(-130, 10); c.lineTo(130, 10); c.stroke(); c.setLineDash([]);
    rr(c, PBL[0] - 36, PBL[1] - 9, 72, 18, 4); c.fillStyle = o.hl > 0 ? mixc('#2E58B8', C4.red, o.hl) : 'rgba(234,241,255,.2)'; c.fill(); c.lineWidth = 2; c.stroke();
    if (o.hl > 0) glow(c, PBL[0], PBL[1], 70, '#FF6A4A', .5 * o.hl);
    c.beginPath(); c.moveTo(-110, 66); c.lineTo(110, 66); c.moveTo(-110, 58); c.lineTo(-110, 74); c.moveTo(110, 58); c.lineTo(110, 74); c.stroke();
    tx(c, OBJ.fig, 0, 96, { f: 'M', w: 800, s: 16, c: '#DCE6FF', ls: 4 }); textLines(c, -w / 2 + 30, 120, w - 60, 56, 4, 'rgba(234,241,255,.3)', 91);
    c.restore();
  }
  function patentPose(t) {   // лист выезжает из пепла, поднимается и ложится на карту
    const a = TH, k0 = eo(at(t, a.pat - .05, a.pat + .5)), k1 = eio(at(t, a.pat + .45, a.land));
    if (k1 <= 0) return { x: PAT0.x, y: PAT0.y - 40 * k0, r: -.3 + .2 * k0, s: lp(.12, .62, k0), lift: k0 * .5 };
    const lift = Math.sin(Math.PI * k1) * .8 + (1 - k1) * .5 * (1 - k1);
    return { x: lp(PAT0.x, PAT1.x, k1), y: lp(PAT0.y - 40, PAT1.y, k1) - Math.sin(Math.PI * k1) * 140, r: lp(-.1, PAT1.r, k1), s: lp(.62, 1, k1) * (1 + .18 * Math.sin(Math.PI * k1)), lift };
  }
  const patentBlade = t => { const P = patentPose(t); return [P.x + (Math.cos(P.r) * PBL[0] - Math.sin(P.r) * PBL[1]) * P.s, P.y + (Math.sin(P.r) * PBL[0] + Math.cos(P.r) * PBL[1]) * P.s] };
  // ---------- мир целиком ----------
  function deskWorld(c, t, q) {
    const a = TH; deskRoom(c, t);
    if (t < a.svoi + .6) { const P = memoPose(t); memo4(c, t, P, { date: at(t, a.sem - .1, a.sem + .4), mk: at(t, a.podr - .1, a.podr + .45), glow: at(t, a.sem - .1, a.sem + .3) * (1 - at(t, a.isk, a.podr)) }) }
    iqos4(c, IQH.x, IQH.y, IQH.L, { stick: 1, name: true, brand: true });
    journal4(c, t, JRH.x, JRH.y, 1, 1 - at(t, a.j + .3, a.reg));
    const kf = at(t, a.form - .05, a.form + .4), thin = eio(at(t, a.pomn - .1, a.pomn + .3));
    const fo = eio(at(t, a.reyn + .2, a.reyn + .95));   // v21.2: бланк FDA уезжает за край кадра — не лежит рядом с запиской и Premier
    if (kf > 0 && fo < 1) { const f = eo(kf); c.save(); c.globalAlpha *= Math.min(1, kf * 3); formH(c, t, FORM.x + 40 * (1 - f) - 1100 * fo, FORM.y - 220 * (1 - f) + 160 * fo, FORM.r - .25 * (1 - f) - .35 * fo, lp(1.3, 1, f), thin); c.restore() }
    const kt = at(t, a.pomn - .05, a.pomn + .45), ko = 1 - at(t, a.svoi - .2, a.svoi + .3);   // красная нить от планки к записке, тянет её вправо
    if (kt > 0 && ko > 0) { const P = memoPose(t), [mx, my] = memoPin(P), e = eio(kt), r = eio(at(t, a.reyn + .35, a.reyn + .85)), rl = eio(at(t, a.reyn - .05, a.reyn + .4)), lx = lp(lp(FORM.x - 180, mx, e), mx, rl), ly = lp(lp(FORM.y + ROW2, my, e), my, rl), rx = lp(lp(FORM.x + 190, 1500, e), mx, r), ry = lp(lp(FORM.y + ROW2, my - 160, e), my, r);   // v21.1: хвост нити втягивается в записку; v21.2: левый конец тоже уходит в записку — обрубка нет
      c.save(); c.globalAlpha *= ko; c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 5; c.beginPath(); c.moveTo(lx + 3, ly + 6); c.lineTo(rx + 3, ry + 6); c.stroke(); c.strokeStyle = '#dc2626'; c.lineWidth = 5; c.beginPath(); c.moveTo(lx, ly); c.lineTo(rx, ry); c.stroke();
      if (e > .6 && rl < .9) circ(c, lx, ly, 7, '#dc2626'); c.restore() }
    premierScene(c, t);
    lampH(c);
  }
  function deskPlates(c, t) {   // v21.2: счётчик −$… МЛН — по экрану, как счётчики строки 14: цифры по времени кадра, без размытия
    const a = TH, kd = at(t, a.sela - .1, a.sela + .2) * (1 - at(t, a.pat - .3, a.pat)), v = Math.round(300 * eio(at(FT, a.sela, a.doll - .05)));
    if (kd > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); drum4(c, TEXT.fPrem(v), 540, 1430, kd, { s: 64, w: 400, bg: '#141733' }); c.restore() }
  }
  function deskShot(c, t) {
    const q = camObj(camAt(KH, t));
    layerRel(c, q, RH, .38, cc => fdaFar(cc, t));
    // 24.11 (ТЗ 16:9): в широком кадре карта не торчит краем, пока говорим о бланке FDA, — её кладут на стол на «Помните „Рейнольдс“»
    const km = window.WIDE ? eio(at(t, TH.pomn - .25, TH.pomn + .55)) : 1;
    layer(c, q, 1, cc => { deskWorld(cc, t, q); if (km > 0) { cc.save(); cc.translate(900 * (1 - km), 60 * (1 - km)); cc.rotate(.08 * (1 - km)); cc.globalAlpha *= km; usMapWorld(cc, t, true); cc.restore() } });
    layerRel(c, q, RH, 1.12, cc => A(cc, 1 - at(Math.log(q.z), .5, .9), () => lampBeam(cc, t)));
    deskPlates(c, t);
    return q;
  }
