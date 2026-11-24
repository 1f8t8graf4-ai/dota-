  // ================= мир G — лаборатория в Швейцарии, 2017 (строки 8–9) =================
  // Стык с магазином (мир F): в темноте тот же луч и тот же держатель на белой полочке — свет зажигается, вокруг лаборатория.
  // «поймали этот пар» — колпак опускается и ловит «?» (наклейка «ПАР»); «те же яды» — полоса сканера (#037), в паре и в дыме сигареты — одни шестигранники (#116);
  // «многих меньше, одного даже больше» — пары столбиков на доске (#109), один белый выстреливает выше серого и краснеет; «никотина 84 %» — круг (#120).
  // «Статью они так и назвали» — журнал на столе, наклейка «ПАР» отклеивается — под ней «ДЫМ» (#088), из-под заголовка выползает дым (#141).
  let TG = null, KG = null, NGH = null;
  const HG = { x: 540, y: 1100, L: 180 }, BENCH = 1118, BENCHF = 1420, JRN = { x: 560, y: 1300, w: 470, h: 300 }, JAR = { x: 540, w: 300, h: 380 };
  // 24.11 (ТЗ 16:9): в широком кадре доска с графиком — слева от колпака, окно с Альпами — справа (не друг под другом)
  const WDG = !!window.WIDE, BDX = WDG ? -855 : 0, BDY = WDG ? 330 : 0, WNX = WDG ? 790 : 0, WNY = WDG ? 200 : 0;
  const BARS4 = [[230, 70], [270, 90], [210, 50], [250, 320], [190, 80]];   // [дым, пар]; четвёртый «пар» — выше дыма
  function labInit() {
    const w8 = (q, n) => Ws('s8', q, n), w9 = (q, n) => Ws('s9', q, n);
    TG = { j: TF.jFG, poim: w8('поймали'), yady: w8('яды'), mnog: w8('многих'), odn: w8('одного'), bol: w8('больше'), nik: w8('никотина'), stat: w9('статью'), dym: w9('дым'), imen: w9('именем'), dvadc: Ws('s10', 'двадцатом') };
    const a = TG; a.on = a.j + .1; a.jGH = a.dvadc + .45;
    KG = [KY(a.on + .55, 540, 1010, 1.32), KY(a.poim + .45, 540, 1010, 1.42), KY(a.yady + .3, 430, 1060, 1.28), KY(a.mnog + .35, WDG ? 210 : 780, WDG ? 860 : 600, WDG ? 1.55 : 1.32), KY(a.bol + .3, WDG ? 120 : 820, WDG ? 850 : 560, WDG ? 1.72 : 1.6),
      KY(a.nik + .7, WDG ? 160 : 790, WDG ? 850 : 520, WDG ? 1.62 : 1.5), KY(a.stat - .3, 420, 760, 1.12), KY(a.stat + .45, WDG ? 300 : 560, WDG ? 1060 : 1180, 1.42), KY(a.dym + .35, WDG ? 310 : 520, WDG ? 1075 : 1160, WDG ? 1.5 : 1.55), KY(a.imen + .4, WDG ? 380 : 470, WDG ? 1150 : 1230, WDG ? 1.62 : 1.72),
      KY(a.jGH - .3, 452, 1292, 4.2), KY(a.jGH, JRN.x - 118, JRN.y, 6.6)];   // v21.1: наезд на заголовок статьи — страница во весь экран; это же журнал на столе FDA (стык без белого)
    NGH = { x: JRN.x - (JRH.x - 540), y: JRN.y - (JRH.y - 960), m: 1 };   // журнал на столе FDA (мир H)
  }
  // общий «луч в темноте» на стыке магазин → лаборатория: темнота, луч, кусок белой полочки, держатель, пар и «?»
  function spotScene(c, t, x, y, L, k, tq, q0) {   // v21.2: свет гаснет «диафрагмой» — темнота сходится к лучу над держателем (не рубка в чёрное)
    if (k <= 0) return; c.save();
    if (k < 1) { const R = 2200 * (1 - eio(k)), g = c.createRadialGradient(x, y - 80, R * .5, x, y - 80, R + 2); g.addColorStop(0, 'rgba(11,12,22,0)'); g.addColorStop(1, 'rgba(11,12,22,1)'); c.fillStyle = g; c.fillRect(x - 4000, y - 4000, 8000, 8000) }
    else { c.fillStyle = '#0B0C16'; c.fillRect(x - 4000, y - 4000, 8000, 8000) }
    c.globalAlpha *= k; beam(c, x, y - 760, x, y + 18, 30, 190, '#FFE6B8', .22);
    c.fillStyle = '#D8D4CC'; c.fillRect(x - 170, y + 18, 340, 22); c.fillStyle = '#B9B5AD'; c.fillRect(x - 170, y + 40, 340, 8);
    c.beginPath(); c.ellipse(x, y + 22, 190, 26, 0, 0, TAU); c.fillStyle = 'rgba(255,230,184,.12)'; c.fill(); c.restore();
    const drop = 1 - eo(at(k, .1, .6)); if (k > .1) { c.save(); c.globalAlpha *= Math.min(1, (k - .1) * 4); iqos4(c, x, y - 260 * drop, L, { name: true, shadow: false, leds: 0, stick: 1 }); c.restore() }   // держатель опускается в луч на полку
    qVapor2(c, t, vapX(x, L), y, k * (q0 ?? 1), tq);
  }
  function vapX(x, L) { return x + L / 2 - 14 + L * .34 }   // v21.1: пар идёт из стика, а не из корпуса держателя
  function qVapor2(c, t, x, y, k, tq) {   // пар → белый «?» (над держателем, близко — в луче)
    if (k <= 0) return; smokeLine(c, [x, y - 16, x + 8 + Math.sin(t * 2) * 6, y - 60, x - 4, y - 100], 6, '#F4F1EA', .5 * k);
    const kq = eio(at(t, tq - .1, tq + .5)) * k; if (kq <= 0) return;
    c.save(); c.translate(x - 50, y - 190); c.globalAlpha *= kq; c.beginPath(); c.arc(0, -34, 40, Math.PI * 1.05, Math.PI * .35, false); c.quadraticCurveTo(8, 26, 0, 46);
    lnB(c, 16, 'rgba(244,241,234,.92)'); circ(c, 0, 82, 10, 'rgba(244,241,234,.92)'); c.restore();
  }
  const hexA = (c, x, y, r, col, w = 3) => { c.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) } c.closePath(); lnB(c, w, col) };
  function hexes(c, x, y, w, h, k, seed) { if (k <= 0) return; for (let i = 0; i < 7; i++) { const hx = x + H1(seed + i) * w, hy = y + H1(seed + i * 3.3) * h, r = 14 + H1(i * 5) * 10; c.save(); c.globalAlpha *= k; hexA(c, hx, hy, r, '#F2B84B', 3); hexA(c, hx + r * 1.7, hy, r * .8, '#F2B84B', 2.5); c.restore() } }
  function labRoom4(c, t) {
    c.fillStyle = C4.lab; c.fillRect(-3000, -3000, 7000, BENCH + 3000);
    c.strokeStyle = 'rgba(126,214,210,.08)'; c.lineWidth = 2; c.beginPath(); for (let x = -1200; x < 2400; x += 80) { c.moveTo(x, -400); c.lineTo(x, BENCH) } for (let y = -400; y < BENCH; y += 80) { c.moveTo(-1200, y); c.lineTo(2400, y) } c.stroke();
    for (const lx of [300, 800]) { rr(c, lx - 70, 100, 140, 34, 8); fill(c, '#0E2B2E'); c.fillStyle = '#CFF6F2'; c.fillRect(lx - 56, 128, 112, 9); beam(c, lx, 140, lx + 40, BENCH, 50, 320, '#CFF6F2', .06) }
    c.save(); c.translate(WNX, WNY); c.fillStyle = '#E6EEF2'; c.fillRect(90, 240, 380, 460); ['#BFD5E8', '#A9C6E0', '#93B6D6'].forEach((col, i) => { c.fillStyle = col; c.fillRect(90, 240 + i * 60, 380, 62) });   // окно: небо и Альпы
    poly(c, [90, 620, 150, 470, 210, 540, 290, 400, 370, 520, 420, 470, 470, 560, 470, 700, 90, 700]); fill(c, '#5E7AA0'); poly(c, [260, 440, 290, 400, 322, 446, 300, 438, 284, 452]); fill(c, '#FFFFFF'); poly(c, [130, 520, 150, 470, 170, 516]); fill(c, '#FFFFFF');
    c.fillStyle = '#7E9A6E'; c.fillRect(90, 660, 380, 40); rr(c, 90, 240, 380, 460, 4); lnB(c, 14, '#0B2427'); c.fillStyle = '#0B2427'; c.fillRect(276, 240, 10, 460);
    rr(c, 380, 420, 64, 64, 6); fill(c, '#D52B1E'); c.fillStyle = '#FFFFFF'; c.fillRect(405, 432, 14, 40); c.fillRect(392, 445, 40, 14); c.restore();   // v21.2: швейцарский флажок на правом стекле — в кадре с первой секунды и не под плашкой года
    rr(c, 560 + BDX, 230 + BDY, 470, 540, 10); fill(c, '#F4F6F2'); rr(c, 560 + BDX, 230 + BDY, 470, 540, 10); lnB(c, 8, '#9AA6A8');   // доска
    [[-1300, 380], [WDG ? 1420 : 1120, 320]].forEach(([sx, sy], i) => { c.fillStyle = '#0B2427'; c.fillRect(sx, sy, 420, 16); for (let k = 0; k < 4; k++) { const fx = sx + 40 + k * 100, h = 70 + H1(i * 4 + k) * 70, col = ['#3FB6A8', '#7ED6CF', '#E7A9B6', '#F2B84B'][(i + k) % 4];
      c.beginPath(); c.moveTo(fx, sy); c.lineTo(fx, sy - h * .55); c.lineTo(fx + 12, sy - h * .55); c.lineTo(fx + 12, sy - h); c.lineTo(fx + 30, sy - h); c.lineTo(fx + 30, sy - h * .55); c.lineTo(fx + 42, sy - h * .55); c.lineTo(fx + 42, sy); c.closePath(); fill(c, rgba(col, .75)); lnB(c, 2.5, 'rgba(230,250,248,.5)') } });
    c.fillStyle = '#D8D4CC'; c.fillRect(-3000, BENCH, 7000, BENCHF - BENCH); c.fillStyle = 'rgba(0,0,0,.05)'; c.fillRect(-3000, BENCH, 7000, 40);
    c.fillStyle = '#B9B5AD'; c.fillRect(-3000, BENCHF, 7000, 32); c.fillStyle = C4.labD; c.fillRect(-3000, BENCHF + 32, 7000, 3000);
    for (let x = -600; x < 1800; x += 300) { c.fillStyle = '#103236'; c.fillRect(x, BENCHF + 32, 6, 1400); circ(c, x + 150, BENCHF + 120, 8, C4.gold) }
  }
  function ashtrayCig(c, t, sk) {   // пепельница и тлеющая сигарета — для сравнения
    const x = 210, y = 1240; c.beginPath(); c.ellipse(x + 8, y + 18, 110, 26, 0, 0, TAU); fill(c, 'rgba(6,8,24,.25)'); c.beginPath(); c.ellipse(x, y, 100, 30, 0, 0, TAU); fill(c, 'rgba(200,225,235,.55)');
    c.beginPath(); c.ellipse(x, y - 4, 64, 16, 0, 0, TAU); fill(c, 'rgba(120,140,150,.45)'); cig3(c, x - 120, y - 30, x + 30, y - 6, 9, { tip: '#D9874A', tl: .25, em: 1 });
    smokeLine(c, [x + 34, y - 18, x + 50 + Math.sin(t * 1.6) * 16, y - 120, x + 30, y - 230, x + 60 + Math.sin(t) * 12, y - 340], 7, '#C9C6D2', .7);
    hexes(c, x - 20, y - 330, 120, 260, sk, 11);
  }
  function bellJar(c, t, ky, label) {   // стеклянный колпак: стекло, блики, наклейка
    const x = JAR.x, b = BENCH + 6 - ky, w = JAR.w, h = JAR.h; c.save();
    c.beginPath(); c.moveTo(x - w / 2, b); c.lineTo(x - w / 2, b - h + w / 2); c.arc(x, b - h + w / 2, w / 2, Math.PI, 0); c.lineTo(x + w / 2, b); c.closePath();
    c.fillStyle = 'rgba(200,230,240,.14)'; c.fill(); lnB(c, 4, 'rgba(230,250,255,.7)'); c.save(); c.clip(); glint(c, x - w / 2, b - h, w, h, .12); c.restore();
    rr(c, x - w / 2 - 14, b - 18, w + 28, 22, 8); fill(c, 'rgba(200,230,240,.35)'); c.restore();
    if (label) label(x, b - h * .86);   // v21.1: наклейка — на куполе, над «?» (иначе вместе с «?» читалась как висячий замок)
  }
  function labelPAR(c, t, x, y, peel) {   // наклейка «ПАР» отклеивается с угла — под ней «ДЫМ»
    const w = 150, h = 64; c.save(); c.translate(x, y); c.rotate(-.05);
    rr(c, -w / 2, -h / 2, w, h, 6); fill(c, '#F4F1EA'); tx(c, TEXT.smoke, 0, 3, { f: 'M', w: 800, s: 40, c: C4.red, ls: 4 });
    if (peel < 1) { const p = eio(peel), cx = w / 2 - w * p * 1.1; c.save(); c.beginPath(); c.rect(-w / 2 - 2, -h / 2 - 2, cx + w / 2 + 2, h + 4); c.clip(); rr(c, -w / 2, -h / 2, w, h, 6); fill(c, '#FFFFFF'); tx(c, TEXT.vapor, 0, 3, { f: 'M', w: 800, s: 40, c: '#141010', ls: 4 }); c.restore();
      if (p > 0) { poly(c, [cx, -h / 2, cx + 30 * p + 8, -h / 2 - 10 * p, cx + 30 * p + 8, h / 2 - 10 * p, cx, h / 2]); fill(c, '#E2DDD2') } }
    c.restore();
  }
  function bars4(c, t) {   // пары столбиков на доске: серый — дым, белый — пар; четвёртый белый — выше и краснеет
    const a = TG, base = 700, x0 = 610, ko = 1 - at(t, a.nik - .2, a.nik + .1); if (ko <= 0) return; c.save(); c.translate(BDX, BDY); c.globalAlpha *= ko;
    c.fillStyle = '#2B2F55'; c.fillRect(x0 - 10, base, 410, 4); c.fillRect(x0 - 10, 300, 4, base - 296);   // оси — видны сразу, доска не пустая
    rr(c, x0, 260, 22, 22, 3); fill(c, '#8C8FA0'); tx(c, TEXT.smoke, x0 + 32, 272, { f: 'M', w: 800, s: 22, c: '#2B2F55', al: 'left' });
    rr(c, x0 + 120, 260, 22, 22, 3); fill(c, '#FFFFFF'); rr(c, x0 + 120, 260, 22, 22, 3); lnB(c, 2, '#2B2F55'); tx(c, TEXT.vapor, x0 + 152, 272, { f: 'M', w: 800, s: 22, c: '#2B2F55', al: 'left' });
    const k = eo(at(t, a.mnog - .1, a.mnog + .6));
    if (k > 0) BARS4.forEach(([g, w], i) => { const x = x0 + i * 82, kb = cl(k * 1.4 - i * .1), up = i === 3 ? eo(at(t, a.odn - .05, a.odn + .4)) : 0, wh = (i === 3 ? lp(90, w, up) : w) * kb;
      rr(c, x, base - g * kb, 30, g * kb, 4); fill(c, '#8C8FA0'); rr(c, x + 34, base - wh, 30, wh, 4); fill(c, i === 3 ? mixc('#FFFFFF', C4.red, up) : '#FFFFFF'); rr(c, x + 34, base - wh, 30, wh, 4); lnB(c, 2, '#2B2F55') });
    c.restore();
  }
  function gauge4(c, t) {   // никотин: 84 % от сигареты (#120) — на той же доске, вместо столбиков (v21.1: был над окном с Альпами и уезжал под плашку года)
    const a = TG, k = eo(at(t, a.nik - .05, a.nik + .35)); if (k <= 0) return; const x = 795 + BDX, y = 500 + BDY, R = 150, f = .84 * eio(at(t, a.nik + .1, a.nik + 1.3)), fv = .84 * eio(at(FT, a.nik + .1, a.nik + 1.3)), s = bo(k);
    c.save(); c.translate(x, y); c.scale(s, s); circ(c, 8, 12, R + 30, 'rgba(0,0,0,.18)'); circ(c, 0, 0, R + 30, '#F4F1EA');
    c.beginPath(); c.arc(0, 0, R - 10, 0, TAU); lnB(c, 40, '#D9D3C6'); c.beginPath(); c.arc(0, 0, R - 10, -Math.PI / 2, -Math.PI / 2 + TAU * f); lnB(c, 40, '#E2412F');
    tx(c, TEXT.fPctN(Math.round(fv * 100)), 0, -6, { f: 'M', w: 800, s: 66, c: '#141010' }); tx(c, TEXT.nicL, 0, 50, { f: 'M', w: 800, s: 26, c: '#141010', ls: 3 }); c.restore();
  }
  // журнал: раскрыт, слева заголовок статьи (сначала закрыт полоской), справа колонки; есть белый просвет справа — в него ныряет камера
  function journal4(c, t, x, y, strip, smoke) {
    const { w, h } = JRN; c.save(); c.translate(x, y);
    rasterPoly(c, [-w / 2 + 20, h / 2, w / 2, h / 2, w / 2 + 70, h / 2 + 40, -w / 2 + 90, h / 2 + 40], 'rgba(6,8,24,.3)', 9, 2.2);
    c.fillStyle = '#FFFDF8'; c.fillRect(-w / 2, -h / 2, w, h); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(-3, -h / 2, 6, h);
    c.fillStyle = '#B5162B'; c.fillRect(-w / 2 + 18, -h / 2 + 18, w / 2 - 36, 26); tx(c, OBJ.journal, -w / 4, -h / 2 + 32, { f: 'M', w: 800, s: 15, c: '#FFFFFF', mw: w / 2 - 90 });
    tx(c, OBJ.jtitle1, -w / 4, -h / 2 + 74, { f: 'P', w: 700, s: 17, c: '#141010', mw: w / 2 - 82 }); tx(c, OBJ.jtitle2, -w / 4, -h / 2 + 100, { f: 'P', w: 700, st: 'italic', s: 21, c: '#141010', mw: w / 2 - 82 });
    if (strip < 1) { const s = eio(strip); c.save(); c.translate(-w / 4 + s * 260, -h / 2 + 88 - s * 120); c.rotate(s * .5); rr(c, -w / 4 + 6, -26, w / 2 - 12, 52, 3); fill(c, '#EDE6D6'); rr(c, -w / 4 + 6, -26, w / 2 - 12, 52, 3); lnB(c, 2, 'rgba(0,0,0,.15)'); c.restore() }
    textLines(c, -w / 2 + 18, -h / 2 + 128, w / 2 - 36, 150, 10, 'rgba(27,26,24,.35)', 51);
    textLines(c, 18, -h / 2 + 22, w / 2 - 36, 60, 5, 'rgba(27,26,24,.35)', 61); textLines(c, 18, -h / 2 + 152, w / 2 - 36, 120, 8, 'rgba(27,26,24,.35)', 71);   // справа: просвет y −h/2+90…−h/2+148
    if (smoke > 0) for (let i = 0; i < 3; i++) smokeLine(c, [-w / 4 - 90 + i * 90, -h / 2 + 108, -w / 4 - 70 + i * 90 + Math.sin(t * 1.4 + i) * 14, -h / 2 + 30, -w / 4 - 100 + i * 90, -h / 2 - 60, -w / 4 - 60 + i * 90, -h / 2 - 160], 10, '#B9B6C4', .7 * smoke);
    c.restore();
  }
  function labWorld(c, t, q) {
    const a = TG; labRoom4(c, t);
    c.fillStyle = '#D8D4CC'; c.fillRect(HG.x - 170, BENCH, 340, 22); c.fillStyle = '#B9B5AD'; c.fillRect(HG.x - 170, BENCH + 22, 340, 8);   // белая полочка под держателем
    const sk = eio(at(t, a.yady - .1, a.yady + .5)) * (1 - at(t, a.stat - .3, a.stat));
    ashtrayCig(c, t, sk);
    iqos4(c, HG.x, HG.y, HG.L, { name: true, shadow: false, leds: 0, stick: 1 });
    qVapor2(c, t, vapX(HG.x, HG.L), HG.y, 1, -10);
    hexes(c, HG.x - 120, HG.y - 300, 220, 220, sk, 5);
    const ky = 760 * (1 - eio(at(t, a.poim - .2, a.poim + .25)));
    bellJar(c, t, ky, (x, y) => labelPAR(c, t, x, y, at(t, a.dym - .1, a.dym + .45)));
    const sc = at(t, a.yady - .15, a.yady + .75); if (sc > 0 && sc < 1) { const x = lp(80, 760, sc); c.save(); c.globalAlpha *= Math.sin(Math.PI * sc); c.fillStyle = 'rgba(126,240,180,.25)'; c.fillRect(x - 40, 560, 80, 700); c.fillStyle = 'rgba(126,240,180,.85)'; c.fillRect(x - 3, 560, 6, 700); c.restore() }
    bars4(c, t); gauge4(c, t);
    const kj = eio(at(t, a.stat - .2, a.stat + .4)); if (kj > 0) journal4(c, t, lp(1500, JRN.x, kj), JRN.y, at(t, a.dym - .05, a.dym + .45), at(t, a.imen - .3, a.imen + .5));
    spotScene(c, t, HG.x, HG.y, HG.L, 1 - at(t, a.on - .1, a.on + .7), -10, 1);   // v21.2: свет в лаборатории зажигается за 0,8 с (было 0,45 с с двойным сглаживанием — вспышка)
  }
  function labShot(c, t) {
    const q = camObj(camAt(KG, t)); layer(c, q, 1, cc => labWorld(cc, t, q));
    const a = TG; capS(c, TEXT.onemore, 540, 300, at(t, a.bol + .15, a.bol + .45) * (1 - at(t, a.nik - .2, a.nik)), { s: 54 });
    capS(c, TEXT.title, 540, 1480, at(t, a.imen + .05, a.imen + .35) * (1 - at(t, a.jGH - .5, a.jGH - .25)), { s: 46 });   // под журналом: не налезает на колпак с «ДЫМ»
  }
