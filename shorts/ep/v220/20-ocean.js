  // ================= мир 0: ночной океан у берега США (строки 16–17 главы 4: b1, b2) =================
  // Кадр 0 (шортс и фильм после нырка в фото карточки 2022): крупная белая баночка уже качается на волне на переднем плане, позади — огни берега
  // и опущенный красный шлагбаум, на нём висит ценник Philip Morris. «через» — плашка 2022; «запрета» — шлагбаум поднимается, волна выносит баночку
  // на мокрый песок; «шестнадцать» — ценник ложится на баночку, барабан до $16 МЛРД. b2: баночка поворачивается крышкой к нам, крышка откидывается —
  // белые подушечки по кругу; над ними лист табака перечёркнут, «БЕЗ ТАБАКА». Стык с офисом — подушечка вылетает к камере и становится столешницей.
  let T0 = null, K0 = null;
  function oceanInit() {
    T0 = { fil: Ws('b1', 'филип'), cher: Ws('b1', 'через'), zap: Ws('b1', 'запрета'), mal: Ws('b1', 'маленькой'), za: Ws('b1', 'за'), shest: Ws('b1', 'шестнадцать'), mlrdA: Ws('b1', 'миллиардов'), mlrd: WsB('b1', 'миллиардов'),
      net: Ws('b2', 'нет'), dazhe: Ws('b2', 'даже'), tab: Ws('b2', 'табака'), tabB: WsB('b2', 'табака'), s1: SA('s1') };
    const a = T0; T0.fly = a.tabB + .05; T0.sw = SA('s1') - .25;   // подушечка летит к камере · смена фона
    T0.j0 = MODE === 'y' ? SA('b1') - .1 : 0;   // v22.4: фильм — волна стыка 4 → 5 открывает океан к началу b1 (80-board.js)
    K0 = [KY(T0.j0, 540, 960, 1.0), KY(a.zap - .4, 548, 940, 1.1), KY(a.mlrd, 560, 1010, 1.26), KY(a.dazhe, 548, 1060, 1.42), KY(a.fly + .1, 540, 1110, 1.62)];
  }
  // баночка 2.5D: центр крышки (x, y), радиус R, ty — насколько видна крышка (0 — сбоку, 1 — сверху), lid 0..1 — крышка откидывается назад;
  // o.cap — цвет крышки (вкусы), o.name — надпись на крышке, o.dark — тёмная банка SNUS, o.label — бумажная наклейка на боку, o.h — высота бока
  // v22.2: баночка в объёме — бок цилиндром в 3 тона (тень справа двумя ступенями, блик полосой слева, отсвет у края), юбка крышки со швом,
  // выпуклое кольцо на крышке; крышка снимается вверх и улетает — сзади нет «обрубка»; подушечки внутри — мягкие и пухлые
  function cylBand(c, cx, y0, y1, R, ty) { c.beginPath(); c.moveTo(cx - R, y0); c.lineTo(cx - R, y1); c.ellipse(cx, y1, R, R * ty, 0, Math.PI, 0, true); c.lineTo(cx + R, y0); c.ellipse(cx, y0, R, R * ty, 0, 0, Math.PI, false); c.closePath() }
  function cylShade(c, cx, y0, y1, R, ty, base, dk) {
    cylBand(c, cx, y0, y1, R, ty); fill(c, base); c.save(); cylBand(c, cx, y0, y1, R, ty); c.clip();
    const T = y0 - R * ty - 4, H = y1 - y0 + 2 * R * ty + 8;
    c.fillStyle = shd(base, dk ? .18 : .14); c.fillRect(cx + R * .3, T, R * .72, H);
    c.fillStyle = shd(base, dk ? .3 : .26); c.fillRect(cx + R * .66, T, R * .36, H);
    c.fillStyle = `rgba(255,255,255,${dk ? .13 : .62})`; c.fillRect(cx - R * .76, T, R * .12, H);
    c.fillStyle = `rgba(255,255,255,${dk ? .05 : .22})`; c.fillRect(cx + R * .9, T, R * .05, H);
    c.restore();
  }
  function lidTop5(c, cx, cy, R, ty, capC, dark, o) {   // верх крышки: выпуклое кольцо (свет сверху-слева, тень снизу-справа), блик на ободке, надпись
    c.beginPath(); c.ellipse(cx, cy, R, R * ty, 0, 0, TAU); fill(c, capC);
    if (R > 18) {
      const r2 = R * .8, lw = Math.max(1.4, R * .032);
      c.save(); c.beginPath(); c.ellipse(cx, cy, r2, r2 * ty, 0, 0, TAU); c.clip(); c.fillStyle = dark ? 'rgba(0,0,0,.2)' : 'rgba(30,40,70,.07)'; c.fillRect(cx + R * .22, cy - R, R, R * 2); c.restore();
      c.beginPath(); c.ellipse(cx, cy, r2, r2 * ty, 0, Math.PI * .85, Math.PI * 1.85); lnB(c, lw, dark ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.95)');
      c.beginPath(); c.ellipse(cx, cy, r2, r2 * ty, 0, -Math.PI * .15, Math.PI * .85); lnB(c, lw, dark ? 'rgba(0,0,0,.5)' : 'rgba(80,90,120,.42)');
      c.beginPath(); c.ellipse(cx, cy, R * .95, R * ty * .95, 0, Math.PI * 1.05, Math.PI * 1.45); lnB(c, Math.max(1.4, R * .04), dark ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.95)');
    }
    if (o.name) { c.save(); c.translate(cx, cy); c.scale(1, Math.max(.05, ty)); tx(c, o.name, 0, 4, { f: 'M', w: 800, s: R * .4, c: o.nameC || (dark ? '#E8D9B8' : '#1F2A44'), ls: Math.max(1, R * .035) }); c.restore() }
    c.beginPath(); c.ellipse(cx, cy, R, R * ty, 0, 0, TAU); lnB(c, Math.max(1, R * .014), 'rgba(20,23,51,.38)');
  }
  function lid5(c, cx, cy, R, ty, sk, capC, dark, o) {   // крышка целиком: юбка (бок крышки) и верх
    cylShade(c, cx, cy, cy + sk, R, ty, shd(capC, dark ? .05 : .04), dark);
    c.beginPath(); c.ellipse(cx, cy + sk, R, R * ty, 0, Math.PI * .02, Math.PI * .98); lnB(c, Math.max(1, R * .018), dark ? 'rgba(0,0,0,.55)' : 'rgba(60,66,90,.4)');   // шов крышки
    lidTop5(c, cx, cy, R, ty, capC, dark, o);
  }
  function pouchP(c, x, y, w, h, ang, dark, sy = 1, o = {}) {   // мягкая подушечка: «подушка» с градиентом, шов по краю, блик; dark — табачный снюс
    c.save(); c.translate(x, y); c.scale(1, Math.max(.06, sy)); c.rotate(ang);
    const base = o.col || (dark ? C5.snusB : C5.pouch), edge = dark ? '#3E2A1A' : '#CFC8B6', r = h * .46;
    rr(c, -w / 2 + w * .04, -h / 2 + h * .18, w, h, r); fill(c, dark ? 'rgba(0,0,0,.38)' : 'rgba(40,40,60,.18)');
    const g = c.createRadialGradient(-w * .14, -h * .2, 1, 0, 0, w * .6); g.addColorStop(0, lit(base, dark ? .18 : .55)); g.addColorStop(.55, base); g.addColorStop(1, edge);
    rr(c, -w / 2, -h / 2, w, h, r); c.fillStyle = g; c.fill();
    if (w > 16) { const d = Math.max(2, w * .05); rr(c, -w / 2 + w * .07, -h / 2 + h * .15, w * .86, h * .7, r * .8); c.setLineDash([d, d]); lnB(c, Math.max(.8, w * .018), dark ? 'rgba(255,220,180,.22)' : 'rgba(140,130,110,.45)'); c.setLineDash([]) }
    if (dark) for (let i = 0; i < 7; i++) circ(c, (H1(i * 3.1 + w) - .5) * w * .7, (H1(i * 5.3 + w) - .5) * h * .55, Math.max(.6, w * .016), 'rgba(28,16,8,.5)');
    if (o.dots) for (let j = 0; j < 3; j++) circ(c, (j - 1) * w * .22, 0, w * .06 * o.dots, C5.nic);
    c.beginPath(); c.ellipse(-w * .17, -h * .2, w * .17, h * .11, -.15, 0, TAU); fill(c, dark ? 'rgba(255,230,200,.16)' : 'rgba(255,255,255,.55)');
    c.restore();
  }
  function hand5(c, s, x, y, sz, col) {   // надпись «от руки»: курсив с разбросом наклона и высоты букв, подчёркивание
    c.save(); c.font = `italic 700 ${sz}px P`; c.fillStyle = col; c.textBaseline = 'middle'; c.textAlign = 'left'; c.letterSpacing = '0px';
    const ch = [...s], ws = ch.map(k => c.measureText(k).width * .96), W = ws.reduce((a, b) => a + b, 0); let px = x - W / 2;
    ch.forEach((k, i) => { c.save(); c.translate(px + ws[i] / 2, y + (H1(i * 7.3) - .5) * sz * .1); c.rotate((H1(i * 3.7) - .5) * .18 - .05); c.fillText(k, -ws[i] / 2, 0); c.restore(); px += ws[i] });
    c.beginPath(); c.moveTo(x - W / 2 - sz * .04, y + sz * .5); c.quadraticCurveTo(x, y + sz * .64, x + W / 2 + sz * .12, y + sz * .42); c.strokeStyle = col; c.lineWidth = Math.max(1.2, sz * .065); c.lineCap = 'round'; c.stroke();
    c.restore();
  }
  // x, y — центр верха; R — радиус; ty — насколько видна крышка (0 — сбоку, 1 — сверху); lid 0..1 — крышка поднимается и улетает вверх-вправо.
  // o: cap — цвет крышки, name — надпись на крышке, dark — тёмная банка снюса, label — наклейка «от руки» на боку, h — высота бока, n/skip — подушечки
  function tin5(c, x, y, R, ty, lid = 0, o = {}) {
    ty = Math.max(.05, Math.min(1, ty));
    const dark = !!o.dark, hS = R * (o.h ?? .42) * Math.sqrt(Math.max(0, 1 - ty * ty)) + R * .06;
    const body = o.body || (dark ? C5.snusD : C5.tin), capC = o.cap || (dark ? '#4A3F37' : C5.lid), sk = Math.min(hS * .34, R * .17);
    if (o.shadow !== false) { c.beginPath(); c.ellipse(x + R * .16, y + hS + R * ty * .2, R * 1.1, R * ty + R * .08, 0, 0, TAU); fill(c, o.shc || 'rgba(6,10,30,.3)') }
    cylShade(c, x, y, y + hS, R, ty, body, dark);
    if (o.band) { c.save(); cylBand(c, x, y, y + hS, R, ty); c.clip(); c.fillStyle = o.band; c.fillRect(x - R, y + hS * .2, R * 2, Math.max(3, hS * .16)); c.restore() }
    if (o.label) {   // наклейка на боку: «СНЮС» от руки
      const top = y + R * ty + sk, bot = y + hS + R * ty, lh = Math.min((bot - top) * .7, R * .52), lw = R * 1.08, cy = (top + bot) / 2;
      c.save(); cylBand(c, x, y, y + hS, R, ty); c.clip(); c.translate(x, cy); c.rotate(-.035);
      rr(c, -lw / 2, -lh / 2, lw, lh, lh * .12); fill(c, o.labelBg || '#F2D04B'); c.fillStyle = 'rgba(20,20,40,.14)'; c.fillRect(R * .3, -lh / 2, lw / 2 - R * .3 + 2, lh);
      rr(c, -lw / 2, -lh / 2, lw, lh, lh * .12); lnB(c, 1.5, 'rgba(120,90,20,.45)'); hand5(c, o.label, 0, -lh * .02, lh * .64, o.labelC || '#2A1E14'); c.restore();
    }
    if (lid <= 0) {   // закрыта
      lid5(c, x, y, R * 1.01, ty, sk, capC, dark, o);
      cylBand(c, x, y, y + hS, R, ty); lnB(c, Math.max(1, R * .012), 'rgba(238,241,248,.5)');
      return;
    }
    // открыта: срез — ободок, стенка, подушечки по кругу (сзади — раньше)
    c.beginPath(); c.ellipse(x, y, R, R * ty, 0, 0, TAU); fill(c, dark ? '#2E2621' : lit(body, .4));
    c.save(); c.beginPath(); c.ellipse(x, y, R * .93, R * ty * .93, 0, 0, TAU); c.clip(); fill(c, dark ? '#1C1714' : '#D3D7E0');
    const d = Math.min(hS * .16, R * .1); c.beginPath(); c.ellipse(x, y + d, R * .93, R * ty * .93, 0, 0, TAU); fill(c, dark ? '#251E1A' : '#E4E7EE');
    const n = o.n ?? 9, skip = o.skip ?? -1, P = [];
    for (let k = 0; k < n; k++) { if (k === skip) continue; const al = Math.PI / 2 + k * TAU / n; P.push([al, x + Math.cos(al) * R * .56, y + d + Math.sin(al) * R * .56 * ty]) }
    P.sort((p1, p2) => Math.sin(p1[0]) - Math.sin(p2[0]));
    const back = P.filter(p => Math.sin(p[0]) < 0), front = P.filter(p => Math.sin(p[0]) >= 0);
    back.forEach(([al, px, py]) => pouchP(c, px, py, R * .46, R * .29, al + Math.PI / 2, dark, ty, { dots: o.dots }));
    if (o.center !== false && n >= 7) pouchP(c, x, y + d, R * .46, R * .29, .35, dark, ty, { dots: o.dots });
    front.forEach(([al, px, py]) => pouchP(c, px, py, R * .46, R * .29, al + Math.PI / 2, dark, ty, { dots: o.dots }));
    c.restore();
    c.beginPath(); c.ellipse(x, y, R * .93, R * ty * .93, 0, Math.PI, TAU); lnB(c, Math.max(1, R * .02), dark ? 'rgba(0,0,0,.5)' : 'rgba(90,100,125,.35)');
    cylBand(c, x, y, y + hS, R, ty); lnB(c, Math.max(1, R * .012), 'rgba(238,241,248,.5)');
    if (lid < 1) {   // крышка: сначала поднимается, потом уходит вверх-вправо и гаснет
      const up = eo(cl(lid / .3)), go = ei(at(lid, .25, 1)), lx = x + R * 3.2 * go, ly = y - R * .55 * up - R * 3.4 * go, al = 1 - at(lid, .88, 1);   // v22.2: крышка быстро уходит за край кадра, а не тает посреди
      if (al > 0) { c.save(); c.globalAlpha *= al; c.translate(lx, ly); c.rotate(.5 * go); lid5(c, 0, 0, R * 1.01, ty, sk, capC, dark, o); c.restore() }
    }
  }
  // ценник: бирка на нитке, барабан внизу; drum 0..1 — сколько насчитал (по времени кадра FT — цифры не двоятся)
  function priceTag(c, x, y, s, k, drum) {
    c.save(); c.translate(x, y); c.scale(s, s);
    poly(c, [-150, -46, 120, -46, 160, 0, 120, 46, -150, 46]); fill(c, 'rgba(0,0,0,.25)');
    c.translate(-6, -8); poly(c, [-150, -46, 120, -46, 160, 0, 120, 46, -150, 46]); fill(c, '#F4EAD4'); poly(c, [-150, -46, 120, -46, 160, 0, 120, 46, -150, 46]); lnB(c, 3, '#3A2A1A');
    circ(c, 124, 0, 9, '#3A2A1A'); circ(c, 124, 0, 5, '#F4EAD4');
    tx(c, OBJ.pm, -14, -14, { f: 'P', w: 700, st: 'italic', s: 30, c: '#3A2A1A' });
    if (drum > 0) { const v = Math.round(lp(1, 16, drum)); num(c, TEXT.fPrice(v), -14, 22, { f: 'M', w: 800, s: 30, c: '#B3352B' }) }
    else tx(c, '$ —', -14, 22, { f: 'M', w: 800, s: 30, c: 'rgba(58,42,26,.4)' });
    c.restore();
  }
  function oceanSky(c, t) {
    vgrad(c, -600, -900, 2300, 1720, [C5.sky0, C5.sky1, C5.sky2]);
    for (let i = 0; i < 70; i++) { const x = -400 + H1(i * 3.1) * 1900, y = -700 + H1(i * 5.7) * 1380, a = .35 + .5 * Math.abs(Math.sin(t * (.8 + H1(i)) + i)); circ(c, x, y, 1.6 + H1(i * 9) * 1.8, `rgba(255,248,225,${a})`) }
    glow(c, 820, 330, 260, '#F4EBD0', .22); circ(c, 820, 330, 70, C5.moon); circ(c, 800, 312, 70, 'rgba(255,255,255,.18)'); circ(c, 842, 352, 14, 'rgba(160,150,120,.25)'); circ(c, 800, 360, 9, 'rgba(160,150,120,.22)');
  }
  // v22.2: берег США вместо «гор-треугольников» — город с огнями на горизонте (два ряда домов разной высоты, окна, красные огни на крышах, маяк)
  let SKY5 = null;
  function skyline5() {
    if (SKY5) return SKY5; const B = [];
    for (const [row, y0, hMin, hMax, wMin, wMax, col] of [[0, 812, 50, 200, 46, 120, '#1A2452'], [1, 816, 14, 74, 30, 86, '#0E1430']]) {
      let x = -460, k = 0; while (x < 1600) { const w = wMin + H1(k * 3.7 + row * 11) * (wMax - wMin), h = hMin + Math.pow(H1(k * 5.1 + row * 7), 1.6) * (hMax - hMin);
        B.push({ row, x, w, h, y0, col, seed: k * 13 + row * 97 }); x += w + (row ? 2 : 8 + H1(k) * 30); k++ } }
    return (SKY5 = B);
  }
  function oceanShore(c, t) {   // горизонт y 812: дома, окна, огни на крышах; под берегом — дрожащие отражения огней
    c.fillStyle = '#10163A'; c.fillRect(-700, 806, 2600, 40);
    for (const b of skyline5()) { c.fillStyle = b.col; c.fillRect(b.x, b.y0 - b.h, b.w, b.h + 30);
      if (b.row === 0) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(b.x + b.w * .7, b.y0 - b.h, b.w * .3, b.h) }
      for (let yy = b.y0 - b.h + 8; yy < b.y0 - 6; yy += 11) for (let xx = b.x + 5; xx < b.x + b.w - 6; xx += 9) { const r = H1(b.seed + xx * .37 + yy * 1.13); if (r > (b.row ? .3 : .38)) continue;
        c.fillStyle = `rgba(255,${r > .2 ? 214 : 236},${r > .2 ? 130 : 190},${.5 + .45 * Math.abs(Math.sin(t * .7 + r * 40))})`; c.fillRect(xx, yy, 4, 5) }
      if (b.row === 0 && b.h > 150) { const on = Math.sin(t * 3 + b.seed) > .2; circ(c, b.x + b.w / 2, b.y0 - b.h - 6, 4, on ? '#FF4B4B' : 'rgba(255,75,75,.25)'); if (on) glow(c, b.x + b.w / 2, b.y0 - b.h - 6, 22, '#FF4B4B', .5) } }
    // маяк слева
    c.fillStyle = '#E9E4DA'; poly(c, [6, 812, 30, 812, 26, 700, 10, 700]); c.fill(); c.fillStyle = '#C9373F'; poly(c, [8, 770, 28, 770, 27, 745, 9, 745]); c.fill();
    c.fillStyle = '#1D2340'; c.fillRect(6, 688, 24, 14); const lb = .6 + .4 * Math.sin(t * 2.2); glow(c, 18, 694, 90, '#FFE7B0', .55 * lb); circ(c, 18, 694, 6, '#FFF3D0');
    for (let i = 0; i < 70; i++) { const x = -600 + H1(i * 2.9) * 2200, y = 846 + H1(i * 4.3) * 40, w = 8 + 14 * H1(i * 6.1), a = .2 + .3 * Math.abs(Math.sin(t * 1.8 + i));
      c.fillStyle = `rgba(255,210,122,${a})`; c.fillRect(x - w / 2 + Math.sin(t * 2 + i) * 3, y, w, 2.5) }
    glow(c, 540, 812, 900, '#FFD27A', .05);
  }
  // v22.2: каменный причал на среднем плане (слой .7) — фонари, будка, шлагбаум на опоре на причале (на суше); up 0..1 — стрела поднята
  const QY = 884, QX0 = 300, QX1 = 1760, BPX = 900, BARL = 420, QW = 58, QD = 24;
  function quay5(c, t, up) {
    for (let i = 0; i < 8; i++) { const lx = 380 + i * 190; if (lx > BPX - 30 && lx < BPX + 150) continue; for (let j = 0; j < 7; j++) { const yy = QY + QW + 6 + j * 13, w = 22 - j * 2.2 + 6 * Math.sin(t * 2.6 + i * 1.7 + j);   // отражения фонарей
      c.fillStyle = `rgba(255,210,122,${.34 - j * .045})`; c.fillRect(lx - w / 2, yy, w, 3) } }
    poly(c, [QX0, QY, QX1, QY, QX1, QY + QW, QX0 + 10, QY + QW]); fill(c, '#283055');   // лицевая стена из камня
    c.fillStyle = 'rgba(0,0,0,.24)'; for (let x = QX0 + 26; x < QX1; x += 72) c.fillRect(x, QY + 3, 3, 26); for (let x = QX0 + 62; x < QX1; x += 72) c.fillRect(x, QY + 31, 3, 26); c.fillRect(QX0 + 4, QY + 29, QX1 - QX0, 2);
    c.fillStyle = 'rgba(255,255,255,.07)'; c.fillRect(QX0 + 10, QY + QW - 7, QX1 - QX0, 7);
    poly(c, [QX0 + 22, QY - QD, QX1, QY - QD, QX1, QY, QX0, QY]); fill(c, '#3A4370'); c.fillStyle = 'rgba(255,255,255,.16)'; c.fillRect(QX0 + 22, QY - QD, QX1 - QX0, 2);   // настил
    c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(QX0, QY - 2, QX1 - QX0, 2);
    for (let i = 0; i < 8; i++) { const lx = 380 + i * 190; if (lx > BPX - 30 && lx < BPX + 150) continue;   // фонари
      c.fillStyle = '#1B2140'; c.fillRect(lx - 3, QY - QD - 104, 6, 96); c.fillRect(lx - 9, QY - QD - 10, 18, 6); c.fillRect(lx - 12, QY - QD - 110, 24, 5);
      glow(c, lx, QY - QD - 100, 80, '#FFD27A', .42 + .08 * Math.sin(t * 3 + i)); circ(c, lx, QY - QD - 100, 8, '#FFE7B0') }
    // будка и шлагбаум
    c.save(); c.translate(BPX + 78, QY - QD + 4); c.scale(1.15, 1.15); castDots(c, -46, -4, 92, 8, 40, { k: .6 });
    rr(c, -46, -86, 92, 86, 4); fill(c, '#2F3866'); c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(20, -86, 26, 86); rr(c, -52, -98, 104, 16, 4); fill(c, '#1B2140');
    rr(c, -34, -70, 46, 32, 3); fill(c, '#FFE7B0'); glow(c, -11, -54, 70, '#FFE7B0', .35); c.fillStyle = '#2F3866'; c.fillRect(-13, -70, 4, 32); c.restore();
    c.save(); c.translate(BPX, QY - QD + 6); c.scale(1.2, 1.2);
    rr(c, -9, -70, 18, 70, 4); fill(c, '#D9DEE8'); c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(2, -70, 7, 70); rr(c, -16, -6, 32, 8, 3); fill(c, '#1B2140');
    c.save(); c.translate(0, -60); c.rotate(-Math.PI / 2 * .9 * up);
    rr(c, -BARL, -9, BARL, 18, 7); fill(c, '#F2EEE6'); c.save(); rr(c, -BARL, -9, BARL, 18, 7); c.clip(); for (let i = 0; i < 8; i++) { c.fillStyle = '#D6334D'; c.fillRect(-BARL + i * 50, -9, 25, 18) } c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-BARL, 3, BARL, 6); c.restore();
    rr(c, -BARL, -9, BARL, 18, 7); lnB(c, 2, 'rgba(20,23,51,.45)'); const bl = Math.sin(t * 5) > 0; circ(c, -BARL + 12, 0, 6, bl ? '#FF4B4B' : '#8A2A33'); if (bl) glow(c, -BARL + 12, 0, 26, '#FF4B4B', .5);
    c.restore(); circ(c, 0, -60, 11, '#F2EEE6'); circ(c, 0, -60, 4.5, '#2A2F4A'); c.restore();
  }
  function barArm(t, up, d) {   // точка на стреле на расстоянии d от опоры (координаты слоя причала)
    const an = -Math.PI / 2 * .9 * up, px = BPX, py = QY - QD + 6 - 60 * 1.2; return [px - d * 1.2 * Math.cos(an), py - d * 1.2 * Math.sin(an)];
  }
  function seaRows(c, t, y0, y1, n, zone) {   // волны рядами: дальние светлее и мельче
    for (let i = 0; i < n; i++) { const u = i / (n - 1), y = lp(y0, y1, Math.pow(u, 1.6)), A = lp(4, 26, u), Lw = lp(60, 260, u), sp = lp(.6, 1.6, u), col = mixc(C5.sea2, C5.sea0, u);
      c.beginPath(); c.moveTo(-700, y + 400); for (let x = -700; x <= 1800; x += 20) c.lineTo(x, y + A * Math.sin(x / Lw * TAU * .5 + t * sp + i * 1.3)); c.lineTo(1800, y + 400); c.closePath(); fill(c, col);
      c.beginPath(); for (let x = -700; x <= 1800; x += 20) { const yy = y + A * Math.sin(x / Lw * TAU * .5 + t * sp + i * 1.3); x === -700 ? c.moveTo(x, yy) : c.lineTo(x, yy) } lnB(c, lp(1.2, 3, u), `rgba(201,220,242,${lp(.18, .45, u)})`);
      if (zone && u > .2) for (let j = 0; j < 6; j++) { const x = 820 + (H1(i * 7 + j) - .5) * lp(40, 220, u), w = lp(10, 46, u); c.fillStyle = `rgba(255,236,190,${.25 + .35 * Math.abs(Math.sin(t * 3 + i + j))})`; c.fillRect(x - w / 2, y - 2, w, 3) } }
  }
  function sand(c, t, k) {   // мокрый песок поднимается снизу, пена кромкой
    if (k <= 0) return; const y = lp(2100, 1330, eio(k));
    c.beginPath(); c.moveTo(-700, y); for (let x = -700; x <= 1800; x += 30) c.lineTo(x, y + 18 * Math.sin(x / 140 + t * 1.2)); c.lineTo(1800, 2600); c.lineTo(-700, 2600); c.closePath(); fill(c, C5.sand);
    c.beginPath(); for (let x = -700; x <= 1800; x += 30) { const yy = y + 18 * Math.sin(x / 140 + t * 1.2); x === -700 ? c.moveTo(x, yy) : c.lineTo(x, yy) } lnB(c, 8, 'rgba(201,220,242,.7)');
    c.fillStyle = 'rgba(255,236,190,.08)'; c.fillRect(-700, y + 30, 2500, 60);
  }
  function tinUp(t) {   // v23.7, фильм: после волны баночка спокойно всплывает из-под переднего вала (1 — под водой, 0 — качается на месте); в фото на доске и в шортсе — на месте
    const a = T0; return MODE === 'y' && t > a.j0 - 1 && t < a.j0 + 1.3 ? 1 - eo(at(t, a.j0, a.j0 + 1.2)) : 0;
  }
  function tinPos0(t) {   // баночка: качается на волне, на «запрета» её выносит на песок; b2 — поворачивается крышкой к нам
    const a = T0, k = eio(at(t, a.zap - .1, a.zap + 1.5)), wet = 1 - k, turn = eio(at(t, a.net - .25, a.dazhe + .3)), up = tinUp(t);
    const x = lp(540, 556, k) + Math.sin(t * 1.1) * 10 * wet, y = lp(1180, 1236, k) + Math.sin(t * 1.7) * 16 * wet - 20 * turn + 320 * up;
    return { x, y, R: lp(lp(210, 222, k), 236, turn), ty: lp(.46 + .06 * Math.sin(t * 1.7) * wet, .9, turn), r: Math.sin(t * 1.3) * .07 * wet + .1 * up, lid: eio(at(t, a.dazhe + .05, a.tab - .1)) };
  }
  function oceanWorld(c, t, q, o = {}) {   // o.noTin — без баночки (v22.4: в фото 2022 на доске, пока баночка едет на гребне волны)
    const a = T0, up = eio(at(t, a.zap - .05, a.zap + .7));
    layer(c, q, .15, cc => { P0(cc, .15); oceanSky(cc, t) }); layer(c, q, .35, cc => { P0(cc, .35); oceanShore(cc, t) });   // P0: дальний план при камере (540, 960, 1) — на своём месте
    layer(c, q, .55, cc => { P0(cc, .55); seaRows(cc, t, 830, 1000, 5, false) });
    layer(c, q, .7, cc => { P0(cc, .7); quay5(cc, t, up);   // ценник висит на стреле шлагбаума, пока её не подняли
      const hang = 1 - eio(at(t, a.zap - .05, a.zap + .5)); if (hang > 0 && t < a.shest) { const [hx, hy] = barArm(t, up, 260); cc.save(); cc.globalAlpha *= hang; const sw = Math.sin(t * 2.2) * .08; cc.translate(hx, hy + 8); cc.rotate(sw);
        cc.beginPath(); cc.moveTo(0, 0); cc.lineTo(0, 62); lnB(cc, 2, 'rgba(244,234,212,.8)'); priceTag(cc, 0, 98, .62 * eo(at(t, a.fil - .1, a.fil + .3)), 1, 0); cc.restore() } });
    layer(c, q, 1, cc => seaRows(cc, t, 1000, 1500, 6, false));
    layer(c, q, 1, cc => sand(cc, t, at(t, a.zap, a.zap + 1.6)));
    layer(c, q, 1, cc => { const p = tinPos0(t);
      if (!o.noTin) { cc.save(); cc.translate(p.x, p.y); cc.rotate(p.r); tin5(cc, 0, 0, p.R, p.ty, p.lid, { skip: t > a.fly ? 1 : -1, shc: 'rgba(4,8,26,.4)' }); cc.restore() }
      // волна перед баночкой — пока её не вынесло на песок
      const wet = 1 - at(t, a.zap + .2, a.zap + 1.2); if (wet > 0) { cc.save(); cc.globalAlpha *= wet; cc.beginPath(); cc.moveTo(-700, 2400);
        for (let x = -700; x <= 1800; x += 20) cc.lineTo(x, 1330 + 30 * Math.sin(x / 160 + t * 1.7)); cc.lineTo(1800, 2400); cc.closePath(); fill(cc, C5.sea0);
        cc.beginPath(); for (let x = -700; x <= 1800; x += 20) { const yy = 1330 + 30 * Math.sin(x / 160 + t * 1.7); x === -700 ? cc.moveTo(x, yy) : cc.lineTo(x, yy) } lnB(cc, 5, 'rgba(201,220,242,.55)'); cc.restore() }
      if (MODE === 'y' && t > a.j0 && t < a.j0 + 1.6) for (let i = 0; i < 2; i++) {   // v23.7: баночка прорезала воду — два тихих круга расходятся по переднему валу и тают
        const u = at(t, a.j0 + .12 + i * .25, a.j0 + 1.25 + i * .25); if (u <= 0 || u >= 1) continue; const rx = p.R * lp(.95, 1.9, eo(u)), wy = 1330 + 30 * Math.sin(p.x / 160 + t * 1.7) + 6;
        cc.beginPath(); cc.ellipse(p.x, wy, rx, rx * .16, 0, 0, TAU); lnB(cc, 4, `rgba(201,220,242,${.4 * (1 - u)})`) }
      // ценник лёг на баночку: барабан до $16 млрд — досчитывает к «миллиардов» (по времени кадра FT)
      if (t >= a.shest - .35) { const k = eo(at(t, a.shest - .35, a.shest + .1)), out = at(t, a.dazhe - .3, a.dazhe + .1); if (out < 1) { cc.save(); cc.globalAlpha *= 1 - out;
        priceTag(cc, p.x + lp(120, 40, k), p.y + lp(-420, -150, k), lp(.62, 1, k), 1, eo(at(FT, a.za - .05, a.mlrdA))); cc.restore() } }
      leaf5(cc, t, p.x, p.y - p.R * .95);
    });
  }
  function leaf5(c, t, x, y) {   // лист табака над открытой баночкой — перечёркивается и тает
    const a = T0, k = at(t, a.dazhe - .1, a.dazhe + .25), out = at(t, a.fly - .1, a.fly + .2); if (k <= 0 || out >= 1) return;
    c.save(); c.translate(x, y); c.globalAlpha *= Math.min(1, k * 2) * (1 - out); const s = lp(1.6, 2.2, eo(k)); c.scale(s, s);
    c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-26, 10, -22, -22, 0, -36); c.bezierCurveTo(22, -22, 26, 10, 0, 30); fill(c, 'rgba(110,139,61,.35)');
    c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-26, 10, -22, -22, 0, -36); c.bezierCurveTo(22, -22, 26, 10, 0, 30); lnB(c, 2.6, '#C9E29A'); c.beginPath(); c.moveTo(0, 30); c.lineTo(0, -30); lnB(c, 1.6, '#C9E29A');
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(0, 12 - i * 13); c.lineTo(sd * 13, 2 - i * 13); lnB(c, 1.2, '#C9E29A') }
    const kx = eo(at(t, a.tab - .1, a.tab + .15)); if (kx > 0) { c.beginPath(); c.moveTo(-30, 34); c.lineTo(lp(-30, 30, kx), lp(34, -38, kx)); lnB(c, 5, '#E2412F') }
    c.restore();
  }
  // подушечка, которая вылетает из баночки к камере (экранные координаты): от места в баночке до середины кадра, растёт и ложится плашмя
  function flyPouch(t, q) {
    const a = T0, k = eio(at(t, a.fly, T0.sw)), p = tinPos0(a.fly);
    const al = Math.PI / 2 + 1 * TAU / 9, wx = p.x + Math.cos(al) * p.R * .56, wy = p.y + Math.sin(al) * p.R * .56 * p.ty;
    const sx = (wx - q.x) * q.z + 540, sy = (wy - q.y) * q.z + 960, w0 = p.R * .4 * q.z, h0 = p.R * .26 * q.z * p.ty;
    return { x: lp(sx, 540, k), y: lp(sy, 1190, k) - 240 * Math.sin(Math.PI * k), w: lp(w0, 760, k), h: lp(h0, 240, k), r: lp(.55, 0, k), k };
  }
  function oceanShot(c, t) {
    const q = camObj(camAt(K0, t)); oceanWorld(c, t, q);
    capS(c, TEXT.notob, 540, 330, at(t, T0.tab - .05, T0.tab + .25) * (1 - at(t, T0.fly + .2, T0.fly + .45)), { s: 56 });
    if (t >= T0.fly) { const f = flyPouch(t, q); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.translate(f.x, f.y); c.rotate(f.r);
      castDots(c, -f.w / 2, f.h * .2, f.w, f.h * .4, 60 + f.k * 60, {}); pouchP(c, 0, 0, f.w, f.h, 0, false, 1); c.restore() }
  }
