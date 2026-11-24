  // ================= мир 3: шведский стол → макет фабрики под стеклянными куполами → заправка в США → улица (строки 3–6) =================
  // Один мир, камера едет по столу слева направо: баночки (строка 3) → сканер и пресс, змеевик, колба (строка 4) → макет шведской фабрики,
  // пачка Marlboro, купола (строка 5). На «снюс смели» шар с заводом Кентукки трескается, камера падает за банками вниз — в магазин на заправке
  // (коробка GS): фигурки сметают банки с полок, на «айкосы» — телевизор над кассой (полки IQOS из главы 4), отъезд сквозь витрину на улицу:
  // ряд магазинов с пустыми полками, из средней полки растёт башня банок и барабан 581 МЛН. Пока камера внутри магазина (после посадки),
  // мир подменяется улицей (те же координаты, тот же магазин) — стола над ней уже нет.
  let T3 = null, K3 = null;
  const TA3 = { x: 410, y: 1180, R: 150 }, TB3 = { x: 760, y: 1176, R: 150 }, PRESS = { x: 1330, y: 1150 }, FLASK = { x: 1810, y: 1060 };
  const FACT = { x: 2440, y: 1150 }, PACK3 = { x: 2715, y: 1170, w: 170, h: 268 }, G2 = { x: 3140, y: 1050, R: 170 }, D1R = 190;   // v22.2: оба купола и пачка — целиком в кадре (камера .95)
  const GS = { x: 2960, y: 3700 }, SHOP = { x0: 2360, y0: 2300, w: 1200, h: 2400 }, SHELVES = [3330, 3580, 3830, 4080], FLOOR3 = 4260;
  function tableInit() {
    const w3 = q => Ws('s3', q), w4 = q => Ws('s4', q), w5 = q => Ws('s5', q), w6 = q => Ws('s6', q);
    T3 = { jw: T2.jw, snusom: w3('снюсом'), nast: w3('настоящий'), shv: w3('шведский'), tab: w3('табак'),
      s4: SA('s4'), net: w4('нет'), nik: w4('никотин'), est: w4('есть'), vyzh: w4('выжимают'), ego: w4('его'), iz: w4('из'), s5: SA('s5'),
      shvedy: w5('шведы'), proizv: w5('производитель'), malb: w5('мальборо'), kupil: w5('купил'), komp: w5('компанию'), tsel: w5('целиком'), amer: w5('американским'), zav: w5('заводом'), kent: w5('кентукки'),
      s6: SA('s6'), dva: w6('два'), snus6: w6('снюс'), smeli: w6('смели'), polok: w6('полок'), amer6: w6('америке'), ajk: w6('айкосы'), japo: w6('японии'), tolko: w6('только'), chet: w6('четвёртом'),
      prod: w6('продали'), shest: w6('шестьсот'), bank: WsB('s6', 'банок'), s7: SA('s7') };
    const a = T3; a.crack = a.snus6 - .2; a.fall = a.snus6; a.land = a.smeli + .3; a.junk = a.bank + .4;
    K3 = [KY(a.jw + .3, 560, 1150, 1.25), KY(a.nast, 572, 1205, 1.32), KY(a.tab + .3, 578, 1215, 1.35), KY(a.nik, 430, 1190, 1.45), KY(a.vyzh, 1350, 860, 1.42),
      KY(a.ego + .3, 1530, 910, 1.42), KY(a.iz + .25, 1830, 1060, 1.5), KY(a.shvedy, 2450, 1000, 1.3), KY(a.malb, 2600, 990, 1.12), KY(a.tsel + .2, 2610, 990, 1.02),
      KY(a.amer, 2740, 995, .92), KY(a.zav + .2, 2780, 995, .89), KY(a.kent + .1, 2782, 995, .89),   // v22.3: купола на 6 % мельче — края не режутся
      KY(a.crack, 3130, 1010, 1.15), KY(a.land, 2960, 3560, .95), KY(a.ajk - .2, 2960, 3580, .95),
      KY(a.japo + .1, 3260, 3090, 2.0), KY(a.tolko + .15, 3120, 3220, 1.35), KY(a.chet + .5, 2960, 3300, .55), KY(a.shest, 2960, window.WIDE ? 2920 : 3150, .42), KY(a.junk, 2960, window.WIDE ? 2780 : 3060, .4)];   // 24.11: в 16:9 барабан «581 МЛН» не у самого края кадра
    linkK(K2, K3, N3, true);
  }
  // ---------- стол, стена ----------
  function tableRoom(c) {
    c.fillStyle = C5.wall; c.fillRect(-1600, -1400, 6600, 2490); c.fillStyle = 'rgba(120,80,40,.07)'; for (let x = -1600; x < 5000; x += 120) c.fillRect(x, -1400, 4, 2490);
    c.fillStyle = '#F7F1E4'; c.fillRect(20, 280, 420, 500); vgrad(c, 40, 300, 380, 460, ['#8FB9E0', '#D6E8F3']);   // окно: шведский лес
    for (let i = 0; i < 10; i++) tree5(c, 60 + i * 38, 760 - (i % 3) * 10, 1.4, i % 2);
    c.fillStyle = '#F7F1E4'; c.fillRect(224, 280, 12, 500); c.fillRect(20, 524, 420, 12);
    c.fillStyle = 'rgba(160,110,60,.25)'; c.fillRect(0, 780, 460, 18);   // подоконник
    c.fillStyle = C5.woodL; c.fillRect(-1600, 1080, 6600, 1000); c.fillStyle = 'rgba(80,45,20,.16)'; for (let y = 1080; y < 2080; y += 90) c.fillRect(-1600, y, 6600, 3);
    c.fillStyle = 'rgba(255,240,210,.2)'; c.fillRect(-1600, 1080, 6600, 10); c.fillStyle = C5.woodD; c.fillRect(-1600, 2080, 6600, 60);
    c.fillStyle = '#10142A'; c.fillRect(-1600, 2140, 6600, 700);   // под столом — темно: камера падает к заправке
  }
  // ---------- строки 3–4: баночки, сканер, пресс, змеевик, колба ----------
  // v22.3: вместо наклейки «СНЮС» — веер белых банок брендов (латиницей во всех языках): ZYN впереди, VELO и PABLO выезжают из-за неё,
  // на «табака нет» уходят в стороны — сканер и дальше вся линия про шведов остаются на ZYN
  const BRC = { zyn: ['#1F2A44', '#2BB5A0'], velo: ['#1E5BD8', '#1E5BD8'], pablo: ['#D6334D', '#18181C'] }, BR3 = [['velo', -128], ['pablo', 128]];
  function brandTin(c, kd, x, y, R) { tin5(c, x, y, R, .55, 0, { name: OBJ[kd], nameC: BRC[kd][0], band: BRC[kd][1], h: .7 }) }
  function snusTins(c, t) {
    const a = T3, kin = eio(at(t, a.nast - .35, a.nast + .4)), lid = eio(at(t, a.shv, a.tab - .05));
    const fan = T3 ? eio(at(t, a.jw - .2, a.jw + .5)) : 1, away = T3 ? eio(at(t, a.s4 - .3, a.s4 + .5)) : 0;
    if (fan > 0 && away < 1) BR3.forEach(([kd, dx]) => { const x = TA3.x + dx * fan + Math.sign(dx) * 300 * away, y = TA3.y - 118 * fan, sc = lp(.74, .84, fan);
      c.save(); c.globalAlpha *= Math.min(1, fan * 1.6) * (1 - away); c.translate(x, y); c.scale(sc, sc); brandTin(c, kd, 0, 0, TA3.R); c.restore() });
    brandTin(c, 'zyn', TA3.x, TA3.y, TA3.R);
    if (kin > 0) tin5(c, lp(1600, TB3.x, kin), TB3.y, TB3.R, .55, lid, { dark: true, name: OBJ.snus, h: .6, n: 9 });
  }
  function scanTin(c, t) {   // строка 4: линза сканера над белой баночкой — внутри лист табака перечёркнут, потом светятся шестигранники никотина
    const a = T3, k = eo(at(t, a.s4 - .1, a.net)) * (1 - eio(at(t, a.vyzh - .3, a.vyzh + .15))); if (k <= 0) return;
    const x = TA3.x, y = TA3.y - 40, R = 150 * k;
    c.save(); c.beginPath(); c.arc(x, y, R, 0, TAU); c.clip(); c.fillStyle = 'rgba(14,34,64,.96)'; c.fillRect(x - R, y - R, R * 2, R * 2);
    c.beginPath(); c.ellipse(x, y - 52, 118, 40, 0, 0, TAU); lnB(c, 2, 'rgba(190,230,255,.5)'); c.beginPath(); c.moveTo(x - 118, y - 52); c.lineTo(x - 118, y + 50); c.ellipse(x, y + 50, 118, 40, 0, Math.PI, 0, true); c.lineTo(x + 118, y - 52); lnB(c, 2, 'rgba(190,230,255,.5)');
    const kl = at(t, a.s4 + .2, a.s4 + .6); if (kl > 0) { c.save(); c.translate(x, y); c.globalAlpha *= kl; c.scale(1.4, 1.4); c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-26, 10, -22, -22, 0, -36); c.bezierCurveTo(22, -22, 26, 10, 0, 30); lnB(c, 2.5, 'rgba(201,226,154,.9)');
      c.beginPath(); c.moveTo(0, 28); c.lineTo(0, -30); lnB(c, 1.6, 'rgba(201,226,154,.8)'); const kx = eo(at(t, a.net - .05, a.net + .25)); c.beginPath(); c.moveTo(-30, 32); c.lineTo(lp(-30, 30, kx), lp(32, -36, kx)); lnB(c, 5, '#E2412F'); c.restore() }
    const kh = at(t, a.nik - .15, a.est + .2); for (let i = 0; i < 7; i++) { const e = at(kh, i * .08, i * .08 + .4); if (e <= 0) continue;
      const hx = x - 84 + (i % 4) * 56 + (i > 3 ? 28 : 0), hy = y + 36 + (i > 3 ? 54 : 0); c.save(); c.translate(hx, hy); c.scale(bo(e), bo(e)); c.beginPath();
      for (let j = 0; j < 6; j++) { const an = j * Math.PI / 3; j ? c.lineTo(Math.cos(an) * 20, Math.sin(an) * 20) : c.moveTo(20, 0) } c.closePath(); c.fillStyle = 'rgba(255,210,63,.25)'; c.fill(); c.strokeStyle = C5.nic; c.lineWidth = 4; c.stroke(); c.restore() }
    c.restore(); c.beginPath(); c.arc(x, y, R, 0, TAU); lnB(c, 5, '#7ED6CF'); c.beginPath(); c.arc(x, y, R + 9, 0, TAU); lnB(c, 2, 'rgba(126,214,207,.45)');
    c.beginPath(); c.moveTo(x + R * .7, y + R * .7); c.lineTo(x + R * 1.05, y + R * 1.05); lnB(c, 14, '#2E3244');   // ручка лупы
  }
  // v22.2 (ТЗ Gemini): пресс в объёме на деревянной подставке — винт с маховиком, две колонны, траверса, верхняя плита; лист табака на нижней плите
  // сплющивается внутри пресса; из носика нижней плиты — ровная золотистая струйка в стеклянный змеевик → капли в колбу → из отвода колбы
  // по тонкой трубке капли падают на белые подушечки, лежащие на столе. «Капли-гиганта» больше нет.
  const PB = { x: 1330, y: 1000 }, FL = { x: 1830, y: 1100 }, POU = [1965, 2055, 2145], POUY = 1236, MANY = 1168;
  const COIL2 = (() => { const o = [[PB.x + 186, PB.y - 45], [PB.x + 210, PB.y - 40], [PB.x + 226, PB.y - 26]];
    for (let i = 0; i <= 120; i++) { const u = i / 120, an = u * TAU * 3; o.push([PB.x + 236 + u * 226 + Math.sin(an) * 14, PB.y - 6 + u * 34 + Math.cos(an) * 30 - 30]) }
    o.push([FL.x - 36, FL.y - 104], [FL.x - 12, FL.y - 104], [FL.x, FL.y - 96]);
    const L = [0]; for (let i = 1; i < o.length; i++) L.push(L[i - 1] + Math.hypot(o[i][0] - o[i - 1][0], o[i][1] - o[i - 1][1])); return { P: o, L, tot: L[L.length - 1] } })();
  function pathTo(c, C, u) {   // путь змеевика до доли u длины
    const lim = C.tot * cl(u); c.beginPath(); c.moveTo(C.P[0][0], C.P[0][1]);
    for (let i = 1; i < C.P.length; i++) { if (C.L[i] <= lim) { c.lineTo(C.P[i][0], C.P[i][1]); continue } const k = (lim - C.L[i - 1]) / (C.L[i] - C.L[i - 1]); c.lineTo(lp(C.P[i - 1][0], C.P[i][0], k), lp(C.P[i - 1][1], C.P[i][1], k)); break }
  }
  function glassTube(c, draw, w = 13) {   // стеклянная трубка: светлые стенки, полупрозрачное нутро, блик
    draw(); lnB(c, w + 3, 'rgba(225,242,255,.75)'); draw(); lnB(c, w - 3, 'rgba(90,110,135,.28)'); c.save(); c.translate(-2, -3); draw(); lnB(c, 2, 'rgba(255,255,255,.7)'); c.restore();
  }
  function flaskPath(c) { c.beginPath(); c.moveTo(-22, -80); c.lineTo(22, -80); c.lineTo(22, -20); c.lineTo(78, 110); c.quadraticCurveTo(80, 128, 60, 128); c.lineTo(-60, 128); c.quadraticCurveTo(-80, 128, -78, 110); c.lineTo(-22, -20); c.closePath() }
  function press5(c, t, down, sq) {
    const x = PB.x, y = PB.y;
    castDots(c, x - 190, 1176, 412, 14, 130, { k: .8 });
    PL(c, [x - 190, y + 24, x + 190, y + 24, x + 190, 1190, x - 190, 1190], '#8A5A3A'); PL(c, [x + 190, y + 24, x + 224, y + 2, x + 224, 1168, x + 190, 1190], '#5E3B25');   // деревянная подставка
    c.fillStyle = 'rgba(0,0,0,.13)'; for (let yy = y + 66; yy < 1190; yy += 44) c.fillRect(x - 190, yy, 380, 3); c.fillStyle = 'rgba(255,235,200,.18)'; c.fillRect(x - 190, y + 24, 380, 4);
    PL(c, [x - 176, y - 12, x - 150, y - 36, x + 206, y - 36, x + 180, y - 12], '#5C6379'); PL(c, [x - 176, y - 12, x + 180, y - 12, x + 180, y + 24, x - 176, y + 24], '#3F4559'); PL(c, [x + 180, y - 12, x + 206, y - 36, x + 206, y, x + 180, y + 24], '#2C3142');   // основание
    SL(c, [x - 172, y - 13, x + 178, y - 13], 'rgba(255,255,255,.35)', 2);
    PL(c, [x - 120, y - 36, x - 104, y - 52, x + 150, y - 52, x + 134, y - 36], '#9AA0B3'); c.fillStyle = '#6B7187'; c.fillRect(x - 120, y - 36, 254, 7);   // нижняя плита
    rr(c, x + 130, y - 52, 60, 12, 5); fill(c, '#8A90A3'); rr(c, x + 130, y - 52, 60, 12, 5); lnB(c, 1.5, 'rgba(255,255,255,.4)');   // носик
    // лист табака на нижней плите: сплющивается, темнеет
    const lf = SH.leaf.map(([lx, ly]) => [x + 14 + lx * .44, y - 60 + ly * .44 * lp(.36, .14, sq)]); celPts(c, lf, mixc('#6E8B3D', '#4E5A2A', sq), { lc: mixc('#C9E29A', '#8A9A5A', sq), lw: 2.5 });
    for (const cx0 of [x - 140, x + 150]) { const g = c.createLinearGradient(cx0 - 15, 0, cx0 + 15, 0); g.addColorStop(0, '#D7DCE6'); g.addColorStop(.35, '#8F95A8'); g.addColorStop(1, '#3B4155');   // колонны
      c.fillStyle = g; c.fillRect(cx0 - 15, y - 470, 30, 420); c.fillStyle = '#2C3142'; rr(c, cx0 - 20, y - 54, 40, 18, 4); c.fill(); rr(c, cx0 - 20, y - 446, 40, 16, 4); c.fill() }
    const py = lp(y - 330, y - 72, down);   // верхняя плита
    c.fillStyle = '#A3A9BA'; c.fillRect(x + 5 - 10, y - 530, 20, py - 40 - (y - 530)); c.fillStyle = 'rgba(0,0,0,.32)'; for (let yy = y - 530 + ((down * 90) % 12); yy < py - 46; yy += 12) c.fillRect(x - 5, yy, 20, 4);   // винт
    PL(c, [x - 112, py - 26, x - 96, py - 42, x + 142, py - 42, x + 126, py - 26], '#B3B8C7'); PL(c, [x - 112, py - 26, x + 126, py - 26, x + 126, py, x - 112, py], '#6B7187'); PL(c, [x + 126, py - 26, x + 142, py - 42, x + 142, py - 16, x + 126, py], '#4A5066');
    SL(c, [x - 110, py - 25, x + 124, py - 25], 'rgba(255,255,255,.45)', 2);
    PL(c, [x - 172, y - 470, x - 150, y - 490, x + 194, y - 490, x + 172, y - 470], '#7A8096'); PL(c, [x - 172, y - 470, x + 172, y - 470, x + 172, y - 430, x - 172, y - 430], '#4C5268'); PL(c, [x + 172, y - 470, x + 194, y - 490, x + 194, y - 452, x + 172, y - 430], '#343A4D');   // траверса
    SL(c, [x - 170, y - 469, x + 170, y - 469], 'rgba(255,255,255,.35)', 2);
    const w = Math.cos(down * 6 + .4), hy = y - 540; c.fillStyle = '#5A6078'; c.fillRect(x + 5 - 130 * Math.abs(w), hy - 6, 260 * Math.abs(w), 12); c.fillStyle = '#3B4155'; c.fillRect(x - 9, hy - 14, 28, 28);   // маховик
    for (const s0 of [-1, 1]) { const bx = x + 5 + s0 * 130 * w, g = c.createRadialGradient(bx - 5, hy - 5, 1, bx, hy, 17); g.addColorStop(0, '#FF9A9A'); g.addColorStop(1, '#9E1E2B'); c.fillStyle = g; c.beginPath(); c.arc(bx, hy, 16, 0, TAU); c.fill() }
  }
  function pressScene(c, t) {
    const a = T3, down = eio(at(t, a.vyzh - .1, a.ego + .05)), sq = eio(at(t, a.ego - .25, a.ego + .3));
    press5(c, t, down, sq);
    // змеевик: стекло, внутри — ровная золотистая струйка
    const C = COIL2, fu = at(t, a.ego - .05, a.iz + .25), drawC = () => { c.beginPath(); C.P.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)) };
    glassTube(c, drawC, 13);
    if (fu > 0) { pathTo(c, C, fu); lnB(c, 7, 'rgba(242,184,75,.95)'); c.save(); c.translate(-1.5, -2); pathTo(c, C, fu); lnB(c, 2, 'rgba(255,240,190,.8)'); c.restore() }
    if (fu > 0 && fu < 1) { const lim = C.tot * fu; let i = 1; while (i < C.P.length - 1 && C.L[i] < lim) i++; const k = (lim - C.L[i - 1]) / (C.L[i] - C.L[i - 1]); circ(c, lp(C.P[i - 1][0], C.P[i][0], k), lp(C.P[i - 1][1], C.P[i][1], k), 6, '#FFD23F') }
    // колба: капли из змеевика, уровень растёт
    const fill0 = eo(at(t, a.iz - .2, a.iz + 1.0));
    c.save(); c.translate(FL.x, FL.y); castDots(c, -70, 110, 150, 20, 90, { k: .8 });
    flaskPath(c); c.fillStyle = 'rgba(190,225,250,.22)'; c.fill(); c.save(); flaskPath(c); c.clip(); const ly = lp(128, 30, fill0) + Math.sin(t * 5) * 2.5 * fill0; c.fillStyle = 'rgba(242,184,75,.92)'; c.fillRect(-90, ly, 180, 150);
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-90, ly, 180, 4); c.restore();
    flaskPath(c); lnB(c, 4, '#EEF1F8'); c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(-58, 24, 8, 86);
    for (let i = 0; i < 6; i++) { const t0 = a.iz - .15 + i * .22, u = at(t, t0, t0 + .32); if (u <= 0 || u >= 1 || fu < 1) continue; const yy = lp(-90, ly, u * u); drop(c, 0, yy, 6, '#F2B84B') }
    c.restore();
    // отвод колбы и тонкая трубка над подушечками: три носика, капли на подушечки
    const ty0 = FL.y + 56, ku = at(t, a.iz + .25, a.iz + .75), tube = () => { c.beginPath(); c.moveTo(FL.x + 50, ty0); c.lineTo(FL.x + 96, ty0); c.quadraticCurveTo(FL.x + 112, ty0, FL.x + 116, MANY - 4); c.lineTo(POU[2] + 26, MANY) };
    glassTube(c, tube, 9); circ(c, FL.x + 80, ty0, 8, '#C9CED8'); c.fillStyle = '#5A6078'; c.fillRect(FL.x + 77, ty0 - 18, 6, 12);   // кран
    if (ku > 0) { c.save(); c.beginPath(); c.rect(FL.x + 40, ty0 - 20, (POU[2] + 40 - FL.x - 40) * ku + 10, 200); c.clip(); tube(); lnB(c, 4, 'rgba(242,184,75,.95)'); c.restore() }
    POU.forEach((px, i) => {
      c.save(); c.translate(px, MANY); rr(c, -5, 0, 10, 14, 3); fill(c, 'rgba(225,242,255,.85)'); c.restore();   // носик
      let hits = 0; for (let j = 0; j < 4; j++) { const t0 = a.iz + .62 + i * .14 + j * .42, u = at(t, t0, t0 + .28); if (t > t0 + .28) hits++; if (u > 0 && u < 1) drop(c, px, lp(MANY + 18, POUY - 10, u * u), 5.5, '#F2B84B') }
      castDots(c, px - 42, POUY + 8, 84, 8, 40, { k: .6 }); pouchP(c, px, POUY, 82, 50, 0, false, .5, { dots: Math.min(1, hits / 2) });
    });
  }
  // ---------- строка 5: макеты заводов (Швеция и Кентукки), объёмная пачка Marlboro, стеклянные купола ----------
  // v22.2: заводы чище — цоколь в объёме, кирпичный цех с пилообразной крышей и фонарями, труба в полоску, конвейер с банками, флаг страны
  function flag5(c, x, y, kind, t) {   // флаг на флагштоке: 'se' — Швеция, 'us' — США; колышется
    c.fillStyle = '#C9CED8'; c.fillRect(x, y, 5, 240); circ(c, x + 2.5, y - 4, 6, '#E2C79A'); const wv = Math.sin(t * 4) * 5;
    c.save(); c.translate(x + 5, y + 4); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(44, wv, 88, wv * .6); c.lineTo(88, 56 + wv * .6); c.quadraticCurveTo(44, 56 + wv, 0, 56); c.closePath(); c.clip();
    if (kind === 'se') { c.fillStyle = '#2F6FD6'; c.fillRect(0, -10, 90, 80); c.fillStyle = '#F2D04B'; c.fillRect(24, -10, 13, 80); c.fillRect(0, 21, 90, 13) }
    else { for (let i = 0; i < 7; i++) { c.fillStyle = i % 2 ? '#F4F1EA' : '#C8102E'; c.fillRect(0, i * 8, 90, 8) } c.fillStyle = '#2B3A78'; c.fillRect(0, 0, 38, 30); for (let i = 0; i < 6; i++) circ(c, 6 + (i % 3) * 12, 7 + Math.floor(i / 3) * 14, 2, '#F4F1EA') }
    c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(60, -10, 40, 80); c.restore();
  }
  function factoryModel(c, t, x, y, s, kind) {
    c.save(); c.translate(x, y); c.scale(s, s); castDots(c, -200, 34, 410, 16, 120, { k: .7 });
    PL(c, [-212, 0, -196, -14, 230, -14, 214, 0], '#7A5135'); PL(c, [-212, 0, 214, 0, 214, 42, -212, 42], C5.woodD); PL(c, [214, 0, 230, -14, 230, 28, 214, 42], '#3E2718');   // цоколь
    c.fillStyle = 'rgba(255,240,210,.2)'; c.fillRect(-212, 0, 426, 4);
    if (kind === 'us') { const K = [[-150, 14], [-100, 6], [-40, 9], [20, 2], [80, 5], [150, 12], [130, 30], [60, 34], [-20, 30], [-110, 34]]; poly(c, K.flat()); fill(c, '#D9C9A6'); poly(c, K.flat()); lnB(c, 2, '#7A5232') }   // контур Кентукки на цоколе
    PL(c, [-150, -14, -150, -150, 60, -150, 60, -14], '#B85A3E'); PL(c, [60, -150, 82, -164, 82, -28, 60, -14], '#8A3E2A');   // цех: лицо и бок
    c.fillStyle = 'rgba(0,0,0,.1)'; for (let yy = -140; yy < -14; yy += 12) c.fillRect(-150, yy, 210, 1.5);
    for (let i = 0; i < 3; i++) { const x0 = -150 + i * 70; poly(c, [x0, -150, x0 + 70, -150, x0 + 70, -196]); fill(c, '#7A3E2E'); poly(c, [x0 + 70, -150, x0 + 70, -196, x0 + 58, -152]); fill(c, '#9FD0EE') }   // пилообразная крыша с фонарями
    PL(c, [60, -150, 82, -164, 82, -210, 60, -196], '#6A3426');
    for (let i = 0; i < 3; i++) { rr(c, -132 + i * 62, -116, 40, 46, 3); fill(c, '#F4F1EA'); c.fillStyle = '#FFE7B0'; c.fillRect(-128 + i * 62, -112, 32, 38); c.fillStyle = '#F4F1EA'; c.fillRect(-113 + i * 62, -112, 3, 38); c.fillRect(-128 + i * 62, -94, 32, 3) }
    c.fillStyle = '#F4F1EA'; c.fillRect(-32, -64, 40, 50); c.fillStyle = '#5A6078'; c.fillRect(-28, -60, 32, 46);   // ворота
    { const g = c.createLinearGradient(96, 0, 128, 0); g.addColorStop(0, '#D4D8E2'); g.addColorStop(1, '#7A8096'); c.fillStyle = g; c.fillRect(96, -270, 32, 256); for (let i = 0; i < 3; i++) { c.fillStyle = '#C8102E'; c.fillRect(96, -262 + i * 34, 32, 12) } }   // труба
    rr(c, -196, -34, 392, 18, 9); fill(c, '#3A3F55'); for (let i = 0; i < 9; i++) circ(c, -184 + i * 46, -25, 5, '#5A6078');   // конвейер
    for (let i = 0; i < 6; i++) { const xx = -176 + ((i * 64 + t * 50) % 340); tin5(c, xx, -46, 15, .5, 0, { h: .6, shadow: false }) }
    flag5(c, 150, -250, kind, t + (kind === 'us' ? 1.7 : 0));
    c.restore();
  }
  function domePath5(c, x, y, R) { c.beginPath(); c.arc(x, y, R, Math.PI, 0); c.lineTo(x + R, y + R * .55); c.lineTo(x - R, y + R * .55); c.closePath() }
  function dome(c, t, x, y, R, crack, seed) {   // стеклянный купол: внутри кружатся подушечки; блики, ободок, деревянная база
    for (let i = 0; i < 12; i++) { const an = t * (.6 + H1(seed + i) * .6) + i, r0 = R * (.2 + .62 * H1(seed + i * 3)), px = x + Math.cos(an) * r0, py = y - R * .2 + Math.sin(an * 1.3) * R * .38;
      c.save(); c.translate(px, py); c.rotate(an); rr(c, -9, -6, 18, 12, 4); fill(c, 'rgba(255,253,248,.92)'); c.restore() }
    domePath5(c, x, y, R); c.fillStyle = C5.glass; c.fill(); domePath5(c, x, y, R); lnB(c, 4, 'rgba(238,241,248,.85)');
    c.save(); c.globalAlpha *= .5; c.beginPath(); c.arc(x, y, R * .9, Math.PI * 1.08, Math.PI * 1.42); lnB(c, R * .07, 'rgba(255,255,255,.9)'); c.beginPath(); c.arc(x, y, R * .82, Math.PI * 1.55, Math.PI * 1.65); lnB(c, R * .04, 'rgba(255,255,255,.8)'); c.restore();
    c.fillStyle = 'rgba(190,225,250,.12)'; c.fillRect(x - R, y, R * 2, R * .55);
    PL(c, [x - R * 1.08, y + R * .55, x + R * 1.08, y + R * .55, x + R * 1.08, y + R * .74, x - R * 1.08, y + R * .74], '#3A2A1E'); c.fillStyle = 'rgba(255,230,200,.18)'; c.fillRect(x - R * 1.08, y + R * .55, R * 2.16, 4);
    if (crack > 0) { c.save(); c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 3; for (let i = 0; i < 7; i++) { const an = -Math.PI * (.1 + i * .13), L = R * Math.min(1, crack * 1.4) * (.6 + H1(i) * .4);
      c.beginPath(); c.moveTo(x + Math.cos(an) * R * .15, y + Math.sin(an) * R * .15); c.lineTo(x + Math.cos(an + .18) * L * .5, y + Math.sin(an + .18) * L * .5); c.lineTo(x + Math.cos(an) * L, y + Math.sin(an) * L); c.stroke() } c.restore() }
  }
  function marlScene(c, t) {
    const a = T3, kin = eio(at(t, a.malb - .45, a.malb + .2)), lid = eio(at(t, a.kupil - .1, a.kupil + .35)), fly = eio(at(t, a.komp - .1, a.tsel + .1));
    factoryModel(c, t, FACT.x, FACT.y, .82, 'se');
    // второй купол: завод в Кентукки — на «американским заводом»; на «снюс» трескается и разлетается
    const g2 = spr(at(t, a.amer - .15, a.zav + .3)), crack = at(t, a.crack - .35, a.crack), burst = at(t, a.crack, a.crack + .45), gy = G2.y + G2.R * .74;
    if (g2 > 0 && burst < 1) { c.save(); c.globalAlpha *= 1 - burst; c.translate(G2.x, gy); c.scale(g2, g2); c.translate(-G2.x, -gy);
      factoryModel(c, t, G2.x, G2.y + G2.R * .5, .56, 'us'); dome(c, t, G2.x, G2.y, G2.R, crack, 9); c.restore() }
    if (burst > 0) for (let i = 0; i < 14; i++) { const an = -Math.PI * (.08 + .84 * H1(i * 3.1)), sp = 300 + 500 * H1(i * 7.7), u = burst * .45;   // осколки стекла и банки — вниз, за камерой
      const px = G2.x + Math.cos(an) * sp * u, py = G2.y + Math.sin(an) * sp * u + 1600 * u * u; if (i % 2) tin5(c, px, py, 26, .5, 0, { h: .6, shadow: false });
      else { c.save(); c.translate(px, py); c.rotate(i + burst * 6); poly(c, [-14, -8, 16, -4, 4, 14]); fill(c, 'rgba(220,240,255,.7)'); c.restore() } }
    const px = lp(3500, PACK3.x, kin), pTop = PACK3.y - PACK3.h;
    if (kin > 0) pack3(c, px, pTop, PACK3.w, PACK3.h, { lid: lid > .02 ? lid : 0, d: 64 });
    if (lid > .3 && t > a.komp - .1) { const dx = lp(px + PACK3.w / 2, FACT.x, fly), dy = lp(pTop - 40, FACT.y - D1R * .74 + 16, fly) - Math.sin(Math.PI * fly) * 160, R = lp(56, D1R, fly) * (1 + .04 * Math.sin(Math.PI * at(t, a.tsel + .1, a.tsel + .4)));
      dome(c, t, dx, dy, R, 0, 3) }
  }
  // ---------- строка 6: магазин на заправке (коробка SHOP) ----------
  const RUN = [0, .16, .3, .46, .62, .8];
  function runnerT0(i) { return T3.smeli + RUN[i] * .9 }
  function shopTins() { const o = []; SHELVES.forEach((y, r) => { for (let i = 0; i < 13; i++) o.push({ x: GS.x - 520 + i * 84 + (r % 2) * 26, y: y - 4, r, run: (i + r * 2) % RUN.length }) }); return o }
  let STINS = null;
  function shopInterior(c, t) {
    const a = T3, S = SHOP; if (!STINS) STINS = shopTins();
    c.save(); c.beginPath(); c.rect(S.x0, S.y0, S.w, S.h); c.clip();
    c.fillStyle = C5.gas; c.fillRect(S.x0, S.y0, S.w, S.h);
    c.fillStyle = '#E8ECF4'; c.fillRect(S.x0, S.y0, S.w, 120); for (let i = 0; i < 4; i++) { rr(c, S.x0 + 70 + i * 280, S.y0 + 60, 200, 16, 8); fill(c, '#FFFFFF'); glow(c, S.x0 + 170 + i * 280, S.y0 + 90, 260, '#E8F0FF', .16) }   // потолок и лампы
    vgrad(c, S.x0 + 40, S.y0 + 180, S.w - 80, 420, ['#0A1026', '#1A2550']);   // окно на трассу
    for (let i = 0; i < 7; i++) { const u = ((t * .32 + i / 7) % 1); c.fillStyle = i % 2 ? 'rgba(255,90,95,.85)' : 'rgba(255,236,190,.9)'; c.fillRect(S.x0 + 40 + u * (S.w - 160), S.y0 + 520 + (i % 2) * 18, 110, 6) }
    c.fillStyle = '#2A3150'; for (const x of [S.x0 + 40, S.x0 + 420, S.x0 + 800, S.x0 + S.w - 56]) c.fillRect(x, S.y0 + 180, 16, 420); c.fillRect(S.x0 + 30, S.y0 + 596, S.w - 60, 14);
    c.fillStyle = '#2B3256'; c.fillRect(S.x0, S.y0 + 610, S.w, 2000);   // задняя стена
    SHELVES.forEach(y => { c.fillStyle = C5.shelf; c.fillRect(GS.x - 560, y, 1120, 18); c.fillStyle = C5.shelfD; c.fillRect(GS.x - 560, y + 18, 1120, 9);
      for (let i = 0; i < 6; i++) { c.fillStyle = '#F2D04B'; c.fillRect(GS.x - 530 + i * 180, y + 3, 38, 13) } });
    c.fillStyle = '#B9C0CC'; c.fillRect(S.x0, FLOOR3 - 60, S.w, 1000); c.fillStyle = 'rgba(255,255,255,.25)'; for (let x = S.x0; x < S.x0 + S.w; x += 160) c.fillRect(x, FLOOR3 - 60, 4, 1000);   // пол
    // касса и телевизор над ней: на «айкосы» — полки IQOS пустеют (как в главе 4)
    rr(c, GS.x + 250, FLOOR3 - 300, 320, 240, 10); fill(c, '#3A3F55'); rr(c, GS.x + 250, FLOOR3 - 300, 320, 20, 6); fill(c, '#5A6078'); rr(c, GS.x + 300, FLOOR3 - 350, 130, 52, 8); fill(c, '#22263A');
    tv5(c, t, GS.x + 300, GS.y - 620);
    // банки: падают с купола на полки → фигурки сметают их бегом
    for (const g of STINS) {
      const k = at(t, a.fall + .2 + g.r * .06 + (g.x % 7) * .015, a.land + .1 + g.r * .06 + (g.x % 7) * .015); if (k <= 0) continue;
      const tg = runnerT0(g.run) + (g.x - (GS.x - 760)) / 980; if (t > tg + .3) continue;
      const up = at(t, tg, tg + .3), yy = lp(g.y - 1100, g.y, eio(k)) - 90 * Math.sin(Math.PI * up * .8) - 40 * up;
      c.save(); c.globalAlpha *= 1 - up; tin5(c, g.x + 30 * up, yy - 24, 26, .4, 0, { h: .6, shadow: false }); c.restore() }
    for (let i = 0; i < RUN.length; i++) { const t0 = runnerT0(i); if (t < t0 || t > t0 + 2.2) continue;   // бегут слева направо, руки вперёд
      const P = walker(t, { x0: GS.x - 760, v: 980, T: .42, floor: FLOOR3 + (i % 2) * 40, s: 1.1, lean: .3, lift: 70, arm: 1.0, el: 1.3, bob: 12, crouch: .9, t0 });
      drawRig(c, P, { col: i % 3 ? '#F4F1EA' : '#E1DCCF' }) }
    c.restore();
  }
  function tv5(c, t, x, y) {
    const a = T3; c.fillStyle = '#2A2E3A'; c.fillRect(x - 5, SHOP.y0 + 120, 10, y - 120 - SHOP.y0 - 120); rr(c, x - 160, y - 120, 320, 200, 12); fill(c, '#14161F');
    c.save(); rr(c, x - 146, y - 106, 292, 172, 6); c.clip(); c.fillStyle = '#E9E6DE'; c.fillRect(x - 150, y - 110, 300, 180);
    c.fillStyle = '#C9CED8'; c.fillRect(x - 150, y - 18, 300, 10); c.fillRect(x - 150, y + 48, 300, 10);
    const k = at(t, a.ajk - .25, a.japo + .45); for (let i = 0; i < 8; i++) { if (k > (i + 1) / 9) continue; box4(c, x - 136 + (i % 4) * 70, y - 78 + Math.floor(i / 4) * 66, 46, 56) }
    if (k > .55) tx(c, TEXT.soldout, x, y + 6, { f: 'M', w: 800, s: 30, c: '#D6334D', ls: 3, a: at(k, .55, .75) });
    c.restore(); rr(c, x - 160, y - 120, 320, 200, 12); lnB(c, 3, 'rgba(238,241,248,.5)');
  }
  // ---------- улица: отъезд сквозь витрину — ряд магазинов с пустыми полками ----------
  function shopFront(c, x0, y0, w, h, sign, col, lit) {   // фасад соседнего магазина: витрина с пустыми полками
    c.fillStyle = '#2B2F4A'; c.fillRect(x0 - 50, y0 - 260, w + 100, h + 300); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(x0 + w + 20, y0 - 260, 30, h + 300);
    c.fillStyle = lit ? '#1E2647' : '#141830'; c.fillRect(x0, y0, w, h);
    SHELVES.forEach(yy => { c.fillStyle = lit ? C5.shelf : '#5A6078'; c.fillRect(x0 + 40, yy - GS.y + y0 + h * .55, w - 80, 16) });
    if (lit) glow(c, x0 + w / 2, y0 + 120, 500, '#E8F0FF', .1);
    rr(c, x0 + w / 2 - 280, y0 - 220, 560, 130, 16); fill(c, '#1D2138'); tx(c, sign, x0 + w / 2, y0 - 154, { f: 'M', w: 800, s: 74, c: col, ls: 6 });
  }
  function streetWorld(c, t) {
    const S = SHOP;
    vgrad(c, -4000, -1200, 12000, 3400, ['#070B1E', '#10183A', '#1D2552']); for (let i = 0; i < 60; i++) circ(c, -2000 + H1(i * 3.7) * 9000, -1000 + H1(i * 5.3) * 2800, 2.2, `rgba(255,248,225,${.4 + .4 * Math.abs(Math.sin(t + i))})`);
    c.fillStyle = '#151A34'; for (let i = 0; i < 16; i++) { const x = -1500 + i * 520, h = 600 + H1(i * 2.2) * 900; c.fillRect(x, 2200 - h, 360, h) }   // дальние дома
    c.fillStyle = '#23284A'; c.fillRect(-4000, 1880, 12000, 3000); c.fillStyle = 'rgba(255,255,255,.05)'; for (let x = -4000; x < 8000; x += 90) c.fillRect(x, 1880, 3, 3000);   // сплошной фасад квартала
    c.fillStyle = '#2E3458'; c.fillRect(-4000, 1880, 12000, 40);
    [-2, -1, 1, 2].forEach(n => shopFront(c, S.x0 + n * 1500, S.y0 + 260, S.w, S.h - 400, '24/7', n % 2 ? '#FF5A5F' : '#5ED39B', Math.abs(n) === 1));
    c.fillStyle = '#2B2F4A'; c.fillRect(S.x0 - 70, S.y0 - 300, S.w + 140, S.h + 340); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(S.x0 + S.w + 40, S.y0 - 300, 30, S.h + 340);   // фасад нашего магазина
    rr(c, S.x0 + S.w / 2 - 300, S.y0 - 250, 600, 140, 16); fill(c, '#1D2138'); tx(c, '24/7', S.x0 + S.w / 2, S.y0 - 178, { f: 'M', w: 800, s: 80, c: '#FFD23F', ls: 6 });
    c.fillStyle = '#3A3F55'; c.fillRect(-4000, S.y0 + S.h + 40, 12000, 140); c.fillStyle = '#16192B'; c.fillRect(-4000, S.y0 + S.h + 180, 12000, 1400);   // тротуар и дорога
    for (let i = 0; i < 18; i++) { c.fillStyle = '#E8E2D4'; c.fillRect(-3600 + i * 700, S.y0 + S.h + 560, 300, 18) }
    for (let i = 0; i < 3; i++) { const u = ((t * .18 + i / 3) % 1), x = -1500 + u * 8000; rr(c, x, S.y0 + S.h + 300, 340, 110, 26); fill(c, '#0E1124'); glow(c, x + 340, S.y0 + S.h + 360, 220, '#FFE7B0', .3) }
  }
  function storeGlass(c, t) {   // отъезд: витрина нашего магазина — рама, стойки, блики стекла
    const a = T3, S = SHOP, k = at(t, a.tolko, a.chet + .3); if (k <= 0) return; c.save(); c.globalAlpha *= k;
    c.fillStyle = '#3A4068'; c.fillRect(S.x0 - 30, S.y0 - 30, S.w + 60, 30); c.fillRect(S.x0 - 30, S.y0 + S.h, S.w + 60, 40); c.fillRect(S.x0 - 30, S.y0, 30, S.h); c.fillRect(S.x0 + S.w, S.y0, 30, S.h);
    for (const x of [S.x0 + S.w * .5]) c.fillRect(x - 10, S.y0, 20, S.h);
    c.beginPath(); c.rect(S.x0, S.y0, S.w, S.h); c.clip(); c.fillStyle = 'rgba(200,225,255,.08)';
    poly(c, [S.x0 + 100, S.y0 + S.h, S.x0 + 300, S.y0 + S.h, S.x0 + 900, S.y0, S.x0 + 700, S.y0]); c.fill(); poly(c, [S.x0 + 420, S.y0 + S.h, S.x0 + 480, S.y0 + S.h, S.x0 + 1080, S.y0, S.x0 + 1020, S.y0]); c.fill(); c.restore();
  }
  function canTower(c, t) {   // башня банок из средней полки — выше крыши, над улицей; барабан 581 МЛН
    const a = T3, k = eo(at(t, a.prod - .1, a.bank + .1)); if (k <= 0) return;
    const n = Math.round(lp(0, 22, k)), x = GS.x, y0 = SHELVES[1] - 6;
    for (let i = 0; i < n; i++) for (const dx of [-150, 150, 0]) { if (dx && i > n - 3) continue; tin5(c, x + dx, y0 - i * 96 - 40 - (dx ? 0 : 20), 80, .3, 0, { h: .9, shadow: false }) }
    drum4(c, TEXT.fCans(Math.round(lp(0, 581, eo(at(FT, a.shest - .05, a.bank + .1))))), x, y0 - n * 96 - 220, eo(at(t, a.shest - .2, a.shest + .2)), { s: 200, w: 1080, bg: '#F4F1EA', c: '#141010' });
  }
  function tableWorld(c, t) {
    if (!T3) { tableRoom(c); brandTin(c, 'zyn', TA3.x, TA3.y, TA3.R); return }
    const a = T3;
    if (t < a.land) { tableRoom(c); pressScene(c, t); snusTins(c, t); scanTin(c, t); marlScene(c, t); shopInterior(c, t) }
    else { streetWorld(c, t); shopInterior(c, t); storeGlass(c, t); canTower(c, t) }
  }
  function tablePlates(c, t) {
    const a = T3;
    capS(c, TEXT.snusTob, 540, 330, at(t, a.tab - .05, a.tab + .25) * (1 - at(t, a.s4 + .1, a.s4 + .4)), { s: 54 });
    capS(c, TEXT.nicTob, 540, 330, at(t, a.iz - .1, a.iz + .2) * (1 - at(t, a.shvedy - .3, a.shvedy)), { s: 50 });
    capS(c, TEXT.ky, 540, 330, at(t, a.kent - .05, a.kent + .25) * (1 - at(t, a.crack - .3, a.crack)), { s: 54 });
    capS(c, TEXT.empty, 540, 330, at(t, a.polok + .15, a.polok + .45) * (1 - at(t, a.ajk - .35, a.ajk - .05)), { s: 54 });
  }
  function tableShot(c, t) { const q = camObj(camAt(K3, t)); layer(c, q, 1, cc => tableWorld(cc, t)); tablePlates(c, t) }
