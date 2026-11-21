  // ================= мир 1: переговорная → салон самолёта (строки 1–2) =================
  // Стык с океаном: подушечка долетает до середины кадра, фоны уезжают вверх (океан) и приходят снизу (офис), подушечка без белого кадра
  // расплющивается в светлую столешницу (flubber). Над главной фигуркой гаснут глаз / ухо / нос; на «пакетик» — фигурка в профиль, на «губу» —
  // полоса рентгена: под верхней губой белый прямоугольник. Строка 2: линза сканера — десна, жёлтые точки никотина уходят в сосуд; отъезд, призраки
  // сигареты с дымом и одноразки с паром перечёркнуты; окно скругляется в иллюминатор (flubber), офис уходит вниз, кресло становится креслом самолёта,
  // загорается табло ремней. Нырок в иллюминатор — мир 2 (облака → Швеция), вложен в иллюминатор (N2).
  let T1 = null, K1 = null;
  const WIN1 = { x: 760, y: 600 }, WIN1B = { x: 840, y: 960 }, N2 = { x: 840, y: 960, m: .188 }, HEAD1 = { x: 1012, y: 1028, R: 54 }, PEL1 = [1010, 1300];
  const TABLE1 = [[70, 1110], [830, 1110], [900, 1270], [-20, 1270]];   // главная фигурка сидит в торце стола справа, колени — под столом
  function officeInit() {
    const w1 = q => Ws('s1', q), w2 = q => Ws('s2', q);
    T1 = { s1: SA('s1'), vid: w1('видно'), sly: w1('слышно'), pah: w1('пахнут'), pak: w1('пакетик'), gub: w1('губу'), vse: w1('всё'),
      s2: SA('s2'), shch: w2('щиплет'), nik: w2('никотин'), krov: w2('кровь'), nee: w2('неё'), stor: w2('стороны'), zam: w2('заметно'),
      dym: w2('дыма'), par: w2('пара'), sov: w2('совещании'), sam: w2('самолёте'), s3: SA('s3') };
    const a = T1; a.sw = T0.sw; a.mEnd = a.s1 + .3; a.cab0 = a.sov + .1; a.cab1 = a.cab0 + 1.35; a.dive = a.s3 + .35;   // v22.2: окно → иллюминатор за 1,35 с; нырок раньше — подлёт к домику длиннее
    K1 = [KY(a.sw, 540, 960, 1.0), KY(a.s1 + 1.0, 590, 980, 1.04), KY(a.pah, 680, 980, 1.1), KY(a.pak + .1, 950, 1000, 1.75), KY(a.gub, 975, 1028, 2.3),
      KY(a.shch, 952, 1050, 3.3), KY(a.krov + .3, 950, 1034, 3.4), KY(a.stor, 930, 1010, 3.0), KY(a.zam + .2, 560, 1000, 1.05), KY(a.par + .2, 590, 990, 1.08),
      KY(a.cab0, 760, 1010, 1.18), KY(a.cab1, 840, 1000, 1.45), KY(a.dive - .3, 844, 985, 2.1), KY(a.dive, N2.x, N2.y, 1 / N2.m)];
  }
  const kCab = t => eio(at(t, T1.cab0, T1.cab1));
  const tableShape = () => { const o = []; const P = TABLE1; for (let s = 0; s < 4; s++) { const A0 = P[s], B0 = P[(s + 1) % 4]; for (let i = 0; i < 30; i++) o.push([lp(A0[0], B0[0], i / 30), lp(A0[1], B0[1], i / 30)]) } return o };
  let TBL = null;
  function officeWall(c, t, kc) {
    c.fillStyle = mixc(C5.office, C5.cabin, kc); c.fillRect(-900, -1200, 2900, 2500);
    c.fillStyle = mixc(C5.officeD, '#8E8A9C', kc); c.fillRect(-900, 1300, 2900, 1400);   // пол
    c.fillStyle = 'rgba(0,0,0,.05)'; for (let x = -900; x < 2000; x += 240) c.fillRect(x, -1200, 6, 2500);
    if (kc > 0) {   // салон: потолочные панели и полоса багажных полок
      c.save(); c.globalAlpha *= kc; c.fillStyle = '#C9C4BA'; c.fillRect(-900, 260, 2900, 120); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-900, 372, 2900, 6);
      for (let x = -900; x < 2000; x += 300) { c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(x, 260, 4, 120) } c.restore() }
  }
  function cityView(c, t, dy) {   // вид из окна переговорной: дневной город (уезжает вниз, когда «самолёт» взлетает)
    c.save(); c.translate(0, dy); vgrad(c, 300, 200, 900, 800, ['#BFD9EE', '#E4EFF7']);
    for (let i = 0; i < 9; i++) { const x = 440 + i * 70 + (H1(i) - .5) * 20, h = 160 + H1(i * 3.3) * 260, w = 54 + H1(i * 1.7) * 30; c.fillStyle = i % 2 ? C5.city : C5.cityD; c.fillRect(x, 940 - h, w, h + 400);
      c.fillStyle = 'rgba(255,255,255,.35)'; for (let yy = 940 - h + 14; yy < 930; yy += 26) for (let xx = x + 8; xx < x + w - 8; xx += 16) c.fillRect(xx, yy, 7, 10) }
    c.restore();
  }
  function winShape(t) { const k = kCab(t), P = morph('w2p', shRR(560, 560, 16), shRR(300, 440, 150))(k), cx = lp(WIN1.x, WIN1B.x, k), cy = lp(WIN1.y, WIN1B.y, k); return P.map(([x, y]) => [x + cx, y + cy]) }
  function officeWindow(c, t) {
    const k = kCab(t), P = winShape(t), cx = lp(WIN1.x, WIN1B.x, k), cy = lp(WIN1.y, WIN1B.y, k), F = P.map(([x, y]) => [cx + (x - cx) * 1.12, cy + (y - cy) * 1.12]);
    castDots(c, cx - 200, cy - 230, 400, 470, 90, { k: .6 * (1 - k) }); pathOf(c, F); fill(c, mixc('#F7F5F0', '#E9E6DE', k)); pathOf(c, F); lnB(c, 3, 'rgba(20,23,51,.25)');
    c.save(); pathOf(c, P); c.clip();
    inNest(c, N2, cc => swedenWorld(cc, t, true));   // облака мира 2 — за иллюминатором
    if (k < 1) cityView(c, t, 900 * eio(k));
    if (k < .6) { c.save(); c.globalAlpha *= 1 - at(k, 0, .6); c.fillStyle = '#F7F5F0'; c.fillRect(cx - 6, cy - 300, 12, 600); c.fillRect(cx - 300, cy - 6, 600, 12); c.restore() }   // переплёт уходит
    c.fillStyle = 'rgba(255,255,255,.12)'; poly(c, [cx - 200, cy + 300, cx - 120, cy + 300, cx + 60, cy - 300, cx - 20, cy - 300]); c.fill();
    c.restore(); pathOf(c, P); lnB(c, 3, 'rgba(20,23,51,.3)');
  }
  function seatedFront(c, x, y, s, col) { fig(c, x, y, s, { m: 1, col }) }
  function mainPose(t) {   // главная фигурка сидит в профиль, лицом влево (поза в своей системе: «вперёд» = +x, потом зеркало вокруг x = 960)
    const kc = kCab(t), br = Math.sin(t * 1.4) * .012, [px, py] = PEL1;
    return { s: 1.5, pel: [px, py], lean: -.03 + br - .08 * kc, neck: -.06, shL: lp(1.05, .55, kc), elL: lp(.85, 1.25, kc), shR: lp(1.15, .5, kc), elR: lp(.8, 1.3, kc),
      ankL: [px + 160, py + 236], ankR: [px + 140, py + 236], ftL: 0, ftR: 0 };
  }
  function chair1(c, t) {   // кресло: офисное → кресло самолёта (спинка выше, с подголовником, синяя обивка)
    const k = kCab(t), [px, py] = PEL1, back = morph('chair', shRR(70, 230, 14), shRR(170, 460, 40))(k).map(([x, y]) => [x + px + 62 + 30 * k, y + lp(py - 115, py - 200, k)]);
    pathOf(c, back); fill(c, mixc('#3A3F55', C5.seat, k)); c.save(); pathOf(c, back); c.clip(); c.fillStyle = mixc('#2C3045', C5.seatD, k); c.fillRect(px + 92 + 30 * k, py - 700, 200, 900); c.restore(); pathOf(c, back); lnB(c, 3, B2.ln);
    rr(c, px - 100, py - 10, 230, lp(30, 60, k), 14); fill(c, mixc('#3A3F55', C5.seat, k)); rr(c, px - 100, py - 10, 230, lp(30, 60, k), 14); lnB(c, 3, B2.ln);
    if (k < 1) { c.save(); c.globalAlpha *= 1 - k; rr(c, px + 5, py + 20, 18, 190, 6); fill(c, '#2C3045'); rr(c, px - 80, py + 206, 190, 14, 6); fill(c, '#2C3045'); c.restore() }
  }
  function officeTable(c, t, drop, part) {   // стол и три фигурки за ним; drop — за первые 45 % окна → иллюминатора тают и чуть оседают (без смаза в движении)
    const g = at(drop, 0, .45); if (g >= 1) return; c.save(); c.translate(0, 70 * eo(g)); c.globalAlpha *= 1 - eio(g);
    if (part === 'back') { [[200, '#EDE7DA'], [400, '#F4F1EA'], [600, '#E8E2D4']].forEach(([x, col], i) => { const by = Math.sin(t * 1.2 + i) * 3; seatedFront(c, x, 1222 + by, 2.0, col) }); c.restore(); return }
    const kf = eo(at(t, T1.mEnd - .05, T1.mEnd + .3));   // кромка и ножки вырастают, когда подушечка стала столешницей
    if (kf > 0) { poly(c, [-20, 1270, 900, 1270, 900, 1270 + 42 * kf, -20, 1270 + 42 * kf]); fill(c, C5.tableE); for (const x of [30, 846]) { rr(c, x, 1300, 26, 272 * kf, 6); fill(c, C5.tableE) } }
    if (t >= T1.mEnd) { if (!TBL) TBL = tableShape(); celPts(c, TBL, C5.table, { sw: .12, ha: .3 }) }
    c.restore();
  }
  function icon5(c, kind, x, y, k, kx, sc = 1) {   // значок в белом круге; kx — красная черта; sc — размер
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(bo(k) * sc, bo(k) * sc); circ(c, 4, 6, 52, 'rgba(0,0,0,.25)'); circ(c, 0, 0, 52, '#F7F5F0'); ring(c, 0, 0, 52, B2.navy, 3);
    c.strokeStyle = B2.navy; c.lineWidth = 6; c.lineCap = 'round'; c.lineJoin = 'round';
    if (kind === 'eye') { c.beginPath(); c.moveTo(-30, 0); c.quadraticCurveTo(0, -26, 30, 0); c.quadraticCurveTo(0, 26, -30, 0); c.stroke(); circ(c, 0, 0, 9, B2.navy) }
    else if (kind === 'ear') { c.beginPath(); c.moveTo(-10, 26); c.bezierCurveTo(-30, 10, -22, -30, 4, -28); c.bezierCurveTo(28, -26, 26, 4, 8, 12); c.bezierCurveTo(0, 18, 4, 26, -4, 30); c.stroke(); c.beginPath(); c.moveTo(-2, -8); c.quadraticCurveTo(10, -14, 12, -2); c.stroke() }
    else if (kind === 'nose') { c.beginPath(); c.moveTo(-4, -30); c.quadraticCurveTo(-8, 4, -22, 16); c.quadraticCurveTo(-6, 26, 10, 18); c.stroke(); c.beginPath(); c.moveTo(14, -10); c.quadraticCurveTo(24, -6, 22, 2); c.stroke() }
    else if (kind === 'cig') { rr(c, -34, -7, 68, 14, 4); stroke(c, B2.navy, 4); c.fillStyle = '#E8A35A'; c.fillRect(14, -7, 20, 14) }
    else if (kind === 'vape') { rr(c, -10, -32, 20, 64, 8); stroke(c, B2.navy, 4); c.fillStyle = '#7CC4E0'; c.fillRect(-10, 6, 20, 26) }
    if (kx > 0) { c.beginPath(); c.moveTo(-36, 36); c.lineTo(lp(-36, 36, eo(kx)), lp(36, -36, eo(kx))); c.strokeStyle = '#D6334D'; c.lineWidth = 9; c.stroke() }
    c.restore();
  }
  // v22.2 (ТЗ Gemini): вместо «черепа» и «клавиш с трубочкой» — рентген лица в профиль (тонкие светлые линии, как горло в главе 1):
  // губа, десна, резец, кость; белый пакетик лежит между верхней губой и десной; на «щиплет» — покалывание, на «никотин» — жёлтые частицы
  // проходят сквозь слизистую десны в тонкую сеть капилляров и бегут вверх. Панель растёт из головы фигурки и в неё же сворачивается.
  const XP = { x: 950, y: 1038, w: 245, h: 290 };
  function smoothOpen(c, P) { c.beginPath(); c.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length - 1; i++) { const mx = (P[i][0] + P[i + 1][0]) / 2, my = (P[i][1] + P[i + 1][1]) / 2; c.quadraticCurveTo(P[i][0], P[i][1], mx, my) } c.lineTo(P[P.length - 1][0], P[P.length - 1][1]) }
  const XFACE = [[176, -12], [160, 50], [112, 108], [74, 142], [78, 162], [118, 176], [150, 186], [146, 226], [128, 268], [116, 292], [134, 312], [118, 334], [128, 362], [146, 396], [142, 432], [128, 468], [150, 500], [210, 512]];
  // v22.3: макросхема десны (координаты рамки 420 × 500): сверху белая подушечка, под ней ровная розовая десна (на стыке — жёлтые уколы),
  // прямо под десной — горизонтальный сосуд, кровь течёт вправо; жёлтые точки никотина проходят сквозь розовую стенку и уходят с потоком
  function gumMacro(c, t, a) {
    const L = (w, col) => lnB(c, w, col), gy0 = 236, gy1 = 330, vy0 = 340, vy1 = 424;
    c.fillStyle = '#6E1621'; c.fillRect(-20, gy1, 470, vy1 - gy1 + 10);   // стенка сосуда
    c.fillStyle = '#C8303F'; c.fillRect(-20, vy0, 470, vy1 - vy0);
    c.fillStyle = 'rgba(255,130,140,.35)'; c.fillRect(-20, vy0 + 6, 470, 9); c.fillStyle = 'rgba(70,8,18,.35)'; c.fillRect(-20, vy1 - 14, 470, 14);
    for (let i = 0; i < 14; i++) { const x = ((t * 95 + i * 37) % 490) - 35, y = vy0 + 22 + H1(i * 2.7) * 42; c.save(); c.translate(x, y); c.scale(1, .55); circ(c, 0, 0, 11, 'rgba(140,16,32,.55)'); circ(c, 0, 0, 5, 'rgba(100,8,22,.5)'); c.restore() }   // кровь течёт
    c.fillStyle = '#E58C99'; c.fillRect(-20, gy0, 470, gy1 - gy0); c.fillStyle = '#F6B3BC'; c.fillRect(-20, gy0, 470, 8); c.fillStyle = 'rgba(160,60,75,.35)'; c.fillRect(-20, gy1 - 12, 470, 12);
    for (let i = 0; i < 40; i++) circ(c, H1(i * 3.1) * 440 - 10, gy0 + 20 + H1(i * 7.7) * (gy1 - gy0 - 36), 3 + H1(i) * 3, 'rgba(255,215,220,.35)');   // клетки слизистой
    const px0 = 60, px1 = 360, py0 = 122, py1 = gy0 + 4, pw = px1 - px0, ph = py1 - py0;   // подушечка
    c.fillStyle = 'rgba(0,0,0,.25)'; rr(c, px0 + 10, py0 + 12, pw, ph, 46); c.fill();
    rr(c, px0, py0, pw, ph, 46); fill(c, '#FFFDF8');
    c.save(); rr(c, px0, py0, pw, ph, 46); c.clip(); c.fillStyle = 'rgba(205,198,186,.5)'; c.fillRect(px0 + pw * .64, py0, pw, ph); c.fillStyle = 'rgba(255,255,255,.95)'; c.fillRect(px0 + 34, py0 + 16, pw * .42, 9); c.restore();
    c.setLineDash([8, 7]); rr(c, px0 + 13, py0 + 13, pw - 26, ph - 26, 34); L(2, 'rgba(176,166,150,.75)'); c.setLineDash([]); rr(c, px0, py0, pw, ph, 46); L(2.5, '#E8E2D6');
    const ks = at(t, a.shch - .1, a.shch + .15) * (1 - at(t, a.stor - .4, a.stor));   // «щиплет»: жёлтые уколы на стыке
    if (ks > 0) for (let i = 0; i < 9; i++) { const q = (t * 2.6 + i * .29) % 1, x = px0 + 28 + i * 31 + (H1(i * 5.3) - .5) * 12, y = gy0 + 4;
      c.save(); c.globalAlpha *= ks * Math.sin(Math.PI * q); c.beginPath(); c.moveTo(x - 10 - 6 * q, y - 7); c.lineTo(x, y + 4); c.lineTo(x + 10 + 6 * q, y - 7); c.moveTo(x, y - 15 - 8 * q); c.lineTo(x, y + 4); L(3, C5.nic); circ(c, x, y + 4, 3.5, '#FFF4C2'); c.restore() }
    if (t > a.nik - .15) for (let i = 0; i < 16; i++) { const st = a.nik - .15 + i * .11; if (t < st) continue;   // никотин: сквозь десну — в кровь и с потоком вправо
      const q = ((t - st) * .55) % 1, x0 = px0 + 30 + H1(i * 3.7) * (pw - 60); let x, y;
      if (q < .55) { const e = q / .55; x = x0 + 6 * Math.sin(e * 6 + i); y = lp(gy0 - 4, vy0 + 22, eio(e)) } else { const e = (q - .55) / .45; x = x0 + e * 230; y = vy0 + 22 + H1(i * 9.1) * 34 }
      circ(c, x, y, 11, 'rgba(255,210,63,.28)'); circ(c, x, y, 5.6, C5.nic) }
  }
  function xrayPanel(c, t) {
    const a = T1, k1 = eio(at(t, a.gub - .5, a.gub)), k2 = eio(at(t, a.stor - .15, a.stor + .35)); if (k1 <= 0 || k2 >= 1) return;
    const k = k1 * (1 - k2), h = HEAD1, W = XP.w, H = XP.h, s = W / 420;
    c.save(); c.translate(h.x, h.y); c.scale(lp(.15, 1, k), lp(.15, 1, k)); c.translate(XP.x - h.x, XP.y - h.y); c.globalAlpha *= Math.min(1, k * 1.6);
    castDots(c, -W / 2 + 8, -H / 2 + 14, W, H, 40, { k: .5 });
    rr(c, -W / 2, -H / 2, W, H, 10); fill(c, '#0E2240'); c.save(); rr(c, -W / 2, -H / 2, W, H, 10); c.clip();
    c.fillStyle = 'rgba(126,214,207,.07)'; for (let x = -W / 2; x < W / 2; x += 14) c.fillRect(x, -H / 2, 1, H); for (let y = -H / 2; y < H / 2; y += 14) c.fillRect(-W / 2, y, W, 1);
    const g = c.createRadialGradient(0, 0, W * .2, 0, 0, W * .8); g.addColorStop(0, 'rgba(60,120,200,.18)'); g.addColorStop(1, 'rgba(0,0,0,.35)'); c.fillStyle = g; c.fillRect(-W / 2, -H / 2, W, H);
    c.translate(-W / 2, -H / 2); c.scale(s, H / 500);
    const L = (w, col) => lnB(c, w, col);
    const zA = eio(at(t, a.shch - .45, a.shch - .05));   // v22.3: профиль → макросхема (наезд в пакетик) к «щиплет»
    // кадр А («кладут под верхнюю губу — и всё»): только профиль — нос, губы, подбородок; под верхней губой светится пакетик
    if (zA < 1) { c.save(); c.globalAlpha *= 1 - zA; c.translate(200, 232); c.scale(1 + 2.2 * zA, 1 + 2.2 * zA); c.translate(-200, -232);
      smoothOpen(c, XFACE); L(3.4, 'rgba(207,233,255,.95)');
      const kin = eio(at(t, a.gub - .35, a.gub + .2)), px = 197 - 46 * (1 - kin), py = 232 + 70 * (1 - kin), pul = .45 + .12 * Math.sin(t * 5);
      c.save(); c.globalAlpha *= kin; c.translate(px, py); c.rotate(-.12); glow(c, 0, 0, 56, '#FFFFFF', pul); rr(c, -11, -42, 22, 84, 10); fill(c, '#FFFDF8'); rr(c, -11, -42, 22, 84, 10); L(1.6, 'rgba(255,255,255,.9)'); c.restore();
      c.restore() }
    // кадр Б («щиплет десну, никотин уходит в кровь прямо через неё»): макросхема в два слоя — подушечка, под ней десна, ещё ниже — сосуд
    if (zA > 0) { c.save(); c.globalAlpha *= zA; c.translate(210, 270); c.scale(lp(.55, 1, zA), lp(.55, 1, zA)); c.translate(-210, -270); gumMacro(c, t, a); c.restore() }
    c.restore();
    const bl = Math.sin(t * 6) > 0; circ(c, W / 2 - 16, -H / 2 + 16, 4, bl ? '#FF4B4B' : '#7A2A33');
    c.strokeStyle = '#CFE9FF'; c.lineWidth = 2.5; const q = 18, m = 10;   // уголки рамки
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { c.beginPath(); c.moveTo(sx * (W / 2 - m), sy * (H / 2 - m - q)); c.lineTo(sx * (W / 2 - m), sy * (H / 2 - m)); c.lineTo(sx * (W / 2 - m - q), sy * (H / 2 - m)); c.stroke() }
    c.restore();
    rr(c, -W / 2, -H / 2, W, H, 10); lnB(c, 4, '#7ED6CF'); rr(c, -W / 2 - 6, -H / 2 - 6, W + 12, H + 12, 14); lnB(c, 1.5, 'rgba(126,214,207,.45)');
    c.restore();
  }
  function ghosts(c, t) {   // над столом: сигарета с дымом и одноразка с паром — призраки, перечёркнуты
    const a = T1, out = at(t, a.sov - .1, a.sov + .3);
    [[a.dym, 'cig', 330, 720], [a.par, 'vape', 760, 720]].forEach(([w, kind, x, y]) => { const k = at(t, w - .2, w + .15); if (k <= 0 || out >= 1) return;
      c.save(); c.globalAlpha *= .9 * (1 - out); const yy = y - 10 * Math.sin(t * 2);
      const puff = (px, py, r, col) => { for (let i = 0; i < 4; i++) { const u = ((t * .5 + i * .25) % 1); circ(c, px + Math.sin(i * 2 + t) * 14 * u, py - u * 90, r * (.6 + u), `rgba(${col},${.35 * (1 - u)})`) } };
      if (kind === 'cig') { puff(x + 70, yy - 20, 26, '200,200,210'); icon5(c, 'cig', x, yy, k, at(t, w + .1, w + .35), 1.6) } else { puff(x, yy - 70, 28, '220,240,255'); icon5(c, 'vape', x, yy, k, at(t, w + .1, w + .35), 1.6) }
      c.restore() });
  }
  function beltSign(c, t) {   // табло «пристегнуть ремни» на потолочной панели
    const k = kCab(t); if (k <= 0) return; const on = at(t, T1.sam - .1, T1.sam + .05);
    c.save(); c.globalAlpha *= at(k, .5, 1); c.translate(930, 560); c.scale(1.3, 1.3); c.translate(-675, -322); rr(c, 600, 290, 150, 64, 12); fill(c, '#2A2E3A'); rr(c, 610, 298, 130, 48, 9); fill(c, mixc('#3A3F4C', '#FFE8A3', on));   // v22.2: правее — плашка 2022 не налезает
    c.strokeStyle = on > .5 ? '#2A2E3A' : '#6B7080'; c.lineWidth = 5; c.lineCap = 'round'; circ(c, 650, 310, 7, c.strokeStyle); c.beginPath(); c.moveTo(650, 318); c.lineTo(650, 336); c.stroke();
    c.beginPath(); c.moveTo(672, 316); c.lineTo(712, 316); c.moveTo(672, 330); c.lineTo(712, 330); c.stroke(); rr(c, 684, 310, 16, 26, 4); c.stroke();
    if (on > 0) glow(c, 675, 322, 120, '#FFE8A3', .3 * on); c.restore();
  }
  function officeWorld(c, t, q) {
    const a = T1, kc = kCab(t);
    officeWall(c, t, kc); officeWindow(c, t); beltSign(c, t);
    const drop = at(t, a.cab0, a.cab1 - .15); officeTable(c, t, drop, 'back');
    chair1(c, t);
    const P = mainPose(t); mirrorX(c, PEL1[0], () => { castDots(c, PEL1[0] - 60, PEL1[1] + 222, 140, 14, 120, {}); drawRig(c, P) });
    officeTable(c, t, drop, 'top');
    xrayPanel(c, t); ghosts(c, t);
    [[a.vid, 'eye', 330], [a.sly, 'ear', 540], [a.pah, 'nose', 750]].forEach(([w, kind, x]) => icon5(c, kind, x, 700, at(t, w - .25, w + .1) * (1 - at(t, a.pak - .2, a.pak + .2)), at(t, w + .05, w + .35), 1.35));
  }
  function officeShot(c, t) {
    const a = T1, q = camObj(camAt(K1, t)), e = eio(at(t, a.sw, a.sw + .5));
    if (e < 1) {   // стык: океан уезжает вверх, офис приходит снизу; подушечка в середине кадра расплющивается в столешницу
      c.save(); c.translate(0, -HH * e); oceanWorld(c, t, camObj(camAt(K0, t))); c.restore();
      c.save(); c.translate(0, HH * (1 - e)); layer(c, q, 1, cc => officeWorld(cc, t, q)); c.restore();
    } else layer(c, q, 1, cc => officeWorld(cc, t, q));
    const km = eio(at(t, a.sw, a.mEnd));
    if (km < 1) {   // подушечка → столешница: в экранных координатах (камера офиса на стыке стоит в (540, 960), z = 1)
      if (!TBL) TBL = tableShape(); const f = flyPouch(a.sw, camObj(camAt(K0, a.sw)));
      const src = shRR(f.w, f.h, f.h * .38).map(([x, y]) => [x + f.x, y + f.y]), P = morph('p2t', src, TBL)(km);
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); const qq = q, sx = x => (x - qq.x) * qq.z + 540, sy = y => (y - qq.y) * qq.z + 960;
      const PS = P.map(([x, y]) => [lp(x, sx(x), km), lp(y, sy(y), km)]); celPts(c, PS, mixc(C5.pouch, C5.table, km), { sw: lp(.22, .2, km), ha: .3 }); c.restore();
    }
  }
