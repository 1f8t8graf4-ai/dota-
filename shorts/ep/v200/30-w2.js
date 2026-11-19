  // ================= мир 2 (фраза 2): коридор арок ар-деко → страница журнала 1924 → журналы веером (#065) → помада становится красным кончиком (#048) → кончик торцом =================
  // Координаты страницы: 1080×1920. Мир 2 вложен в плакат мира 1 (V1, M1): камера ныряет в коридор без остановки (linkK).
  let T2 = null, K2 = null;
  const LIP = { x: 860, y: 1700, w: 250, bw: 200 };   // помада / сигарета: центр, верх гильзы, ширина гильзы и стержня
  const MAGC = [['#9FD6C2', '#3D7F6E'], ['#C9B6E4', '#5D4A8A'], ['#F4B98E', '#9A5530'], ['#A9C8E8', '#3C5E8A'], ['#F1C3CC', '#9B4A62']];
  function w2Init() {
    const s = 's2';
    T2 = { a: SA(s), perv: Ws(s, 'первые'), dam: Ws(s, 'дамской'), slog: Ws(s, 'слоган'), myag: Ws(s, 'мягкие'), may: Ws(s, 'май'), izy: Ws(s, 'изящная'), rekl: Ws(s, 'реклама'),
      zh: Ws(s, 'журналах'), kr: Ws(s, 'красный'), kon: Ws(s, 'кончик'), kot: Ws(s, 'котором'), vid: Ws(s, 'видно'), pom: Ws(s, 'помады'), end: SA('s3') - .02 };
    const a = T2; a.top = LIP.y - 330;   // верх стержня, когда он выкручен
    a.tilt0 = a.pom + .05; a.tilt1 = a.end - .32;
    K2 = [KY(a.a + .55, 610, 1010, .6), KY(a.dam - .05, 540, 960, 1.0), KY(a.myag + .4, 552, 950, 1.04), KY(a.izy + .1, 566, 942, 1.06),
      KY(a.zh + .35, 800, 1230, .6), KY(a.kr + .05, 860, 1300, .56), KY(a.kon + .25, LIP.x, 1250, .6), KY(a.pom - .05, LIP.x, 1215, .7),   // v20.2: заголовок страницы всё время ниже плашки года
      KY(a.tilt1, LIP.x, a.top, 2.4), KY(a.end, LIP.x, a.top, 11.6)];
  }
  // дама 1920-х сбоку (смотрит вправо), ноги — y 0. v20.2: икры и тонкие щиколотки, туфли на каблуке, платье с заниженной талией и складками,
  // подол фестонами, пояс с бантом, клатч; сигарета между пальцев: красный мундштук к лицу, огонёк наружу, дым — от огонька
  function shoe(c, ax, ay, col) {
    c.beginPath(); c.moveTo(ax - 9, ay - 2); c.quadraticCurveTo(ax + 8, ay + 4, ax + 20, ay + 15); c.quadraticCurveTo(ax + 34, ay + 26, ax + 46, ay + 27); c.lineTo(ax + 46, ay + 30);
    c.lineTo(ax + 6, ay + 30); c.quadraticCurveTo(ax - 2, ay + 24, ax - 5, ay + 14); c.lineTo(ax - 6, ay + 30); c.lineTo(ax - 12, ay + 30); c.lineTo(ax - 13, ay + 6); c.closePath(); fill(c, col);
  }
  function lady(c, x, y, s, t, col = '#3A1830', rim = '#F1C3CC') {
    c.save(); c.translate(x, y); c.scale(s, s);
    const sk = shd(col, .25), acc = C3.rose2;
    limb(c, [[-28, -604], [-46, -492], [-56, -396]], [20, 16, 12], sk); rr(c, -80, -404, 46, 30, 7); fill(c, acc); c.fillStyle = C3.gold; c.fillRect(-80, -392, 46, 4);   // задняя рука от плеча, за спиной, с клатчем
    limb(c, [[-18, -240], [-20, -150], [-15, -30]], [27, 31, 12], sk); shoe(c, -15, -30, sk);   // задняя нога
    limb(c, [[14, -240], [24, -150], [32, -30]], [27, 31, 12], col); shoe(c, 32, -30, col);   // передняя нога
    c.beginPath(); c.moveTo(-34, -618); c.bezierCurveTo(-44, -560, -46, -470, -46, -404); c.lineTo(-72, -234);   // спина, юбка чуть клёш
    [[-58, -218, -46, -232], [-30, -214, -14, -230], [2, -212, 18, -228], [36, -212, 52, -228], [66, -214, 78, -232]].forEach(([qx, qy, ex, ey]) => c.quadraticCurveTo(qx, qy, ex, ey));   // подол фестонами
    c.lineTo(52, -404); c.bezierCurveTo(54, -470, 58, -520, 50, -552); c.bezierCurveTo(44, -584, 40, -606, 34, -618); c.quadraticCurveTo(0, -606, -34, -618); c.closePath(); fill(c, col);
    c.strokeStyle = sk; c.lineWidth = 3; [[-22, -398, -34, -238], [6, -398, 4, -234], [32, -398, 44, -236]].forEach(([x0, y0, x1, y1]) => { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke() });   // складки
    c.fillStyle = acc; c.beginPath(); c.moveTo(-47, -416); c.lineTo(53, -416); c.lineTo(52, -398); c.lineTo(-46, -398); c.closePath(); c.fill();   // пояс
    c.beginPath(); c.ellipse(-50, -414, 16, 9, -.5, 0, TAU); c.ellipse(-50, -398, 16, 9, .5, 0, TAU); fill(c, acc); PL(c, [-50, -404, -60, -350, -52, -352], acc); PL(c, [-48, -404, -40, -356, -34, -360], acc);   // бант
    rr(c, -12, -664, 24, 52, 8); fill(c, col);   // шея
    circ(c, 6, -690, 36, col); PL(c, [36, -708, 50, -689, 40, -682], col);   // голова, нос
    c.beginPath(); c.ellipse(38, -672, 4.5, 2.8, -.2, 0, TAU); fill(c, C3.red);   // губы
    c.beginPath(); c.moveTo(-36, -700); c.quadraticCurveTo(-42, -664, -24, -652); c.quadraticCurveTo(-10, -662, -8, -676); c.lineTo(-14, -700); c.closePath(); fill(c, sk);   // каре
    c.beginPath(); c.moveTo(-36, -690); c.bezierCurveTo(-38, -740, -10, -762, 14, -760); c.bezierCurveTo(40, -758, 52, -734, 50, -700); c.quadraticCurveTo(54, -690, 62, -686); c.lineTo(58, -676); c.quadraticCurveTo(30, -684, 4, -684); c.quadraticCurveTo(-24, -682, -40, -668); c.closePath(); fill(c, shd(col, .12));   // шляпка-колокол
    c.fillStyle = acc; c.fillRect(-36, -704, 86, 7);
    for (let i = 0; i < 11; i++) { const u = i / 10; circ(c, lp(-6, 30, u) + Math.sin(u * Math.PI) * 14, lp(-622, -500, u), 4.6, '#F6EBDD') }   // длинные бусы
    const tip = [150, -636]; cig3(c, 76, -574, tip[0], tip[1], 4.6, { tip: C3.red, tl: .2, ring: C3.gold, em: .85 });   // мундштук к лицу, огонёк наружу
    limb(c, [[30, -600], [68, -506], [98, -593]], [19, 15, 12], col); circ(c, 99, -594, 9, col); PL(c, [94, -602, 108, -606, 104, -596], col);   // рука, пальцы держат сигарету
    const sw = Math.sin(t * 1.7) * 9; smokeLine(c, [tip[0] + 3, tip[1] - 4, tip[0] + 12 + sw, tip[1] - 70, tip[0] - 4 + sw, tip[1] - 150, tip[0] + 18 - sw, tip[1] - 240, tip[0] + 4, tip[1] - 330], 5.5, '#F6EBDD', .85);
    SL(c, [-34, -616, -44, -560, -46, -470, -46, -404, -72, -234], rim, 4); SL(c, [-34, -700, -26, -748, 10, -760], rim, 3); SL(c, [-16, -236, -18, -150, -13, -32], rgba(rim, .55), 2.5);
    c.restore();
  }
  function fanArt(c, x, y, R, n = 7) {   // золотой веер ар-деко
    c.strokeStyle = C3.gold; c.lineWidth = 4;
    for (let q = 0; q < 4; q++) { c.beginPath(); c.arc(x, y, R * (.4 + q * .2), Math.PI, 0); c.stroke() }
    for (let i = 0; i <= n; i++) { const a = Math.PI + i * Math.PI / n; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * R, y + Math.sin(a) * R); c.stroke() }
  }
  // страница-реклама 1924 (координаты страницы). Реклама проявляется на «мягкие»; на «журналах» страница — обложка журнала
  function pageW2(c, t) {
    const a = T2; c.fillStyle = '#F6EBDD'; c.fillRect(0, 0, 1080, 1920);
    PL(c, [0, 1240, 1080, 820, 1080, 1120, 0, 1540], '#F1C9CF'); PL(c, [0, 1540, 1080, 1120, 1080, 1180, 0, 1600], '#E7A9B6');
    fanArt(c, 540, 1920, 520, 9); c.fillStyle = '#F6EBDD'; c.fillRect(0, 1600, 1080, 320); PL(c, [0, 1600, 1080, 1180, 1080, 1250, 0, 1670], '#F1C9CF');
    c.strokeStyle = C3.gold; c.lineWidth = 7; c.strokeRect(36, 36, 1008, 1848); c.lineWidth = 2.5; c.strokeRect(58, 58, 964, 1804);
    [[58, 58, 1, 1], [1022, 58, -1, 1], [58, 1862, 1, -1], [1022, 1862, -1, -1]].forEach(([qx, qy, sx, sy]) => { c.beginPath(); c.arc(qx, qy, 70, sy > 0 ? (sx > 0 ? 0 : Math.PI / 2) : (sx > 0 ? -Math.PI / 2 : Math.PI), (sy > 0 ? (sx > 0 ? 0 : Math.PI / 2) : (sx > 0 ? -Math.PI / 2 : Math.PI)) + Math.PI / 2); c.stroke() });
    lady(c, 300, 1650, 1.55, t);
    const k = at(t, a.myag - .25, a.myag + .35), k2 = at(t, a.myag + .05, a.may + .2);
    if (k > 0) {   // реклама: Marlboro курсивом, мягкая пачка выезжает, Mild as May пишется
      c.save(); c.beginPath(); c.rect(80, 150, 960 * eo(k) + 1, 260); c.clip();
      tx(c, 'Marlboro', 560, 290, { f: 'P', w: 700, st: 'italic', s: 170, c: '#3A1830' }); c.restore();
      c.save(); c.beginPath(); c.rect(240, 410, 640 * eo(k2) + 1, 120); c.clip(); tx(c, 'Mild as May', 560, 470, { f: 'P', w: 400, st: 'italic', s: 84, c: C3.red }); c.restore();
      const kp = spr(at(t, a.myag - .05, a.myag + .75)); c.save(); c.translate(780, 1360 + (1 - kp) * 700); c.rotate((1 - kp) * .3); softPack(c, -130, -420, 260, 400, 34, { shc: 'rgba(120,40,60,.28)' }); c.restore();
    }
  }
  // обложки журналов: тот же формат 1080×1920, цвет и рисунок свои
  function magCover(c, i, t) {
    const [bg, ink] = MAGC[i % MAGC.length]; c.fillStyle = bg; c.fillRect(0, 0, 1080, 1920);
    PL(c, [0, 1100 + i * 40, 1080, 700 + i * 40, 1080, 1920, 0, 1920], shd(bg, .12));
    c.save(); c.strokeStyle = ink; c.globalAlpha = .5; fanArt(c, 540, 1500, 460, 7 + i); c.restore();
    c.fillStyle = ink; c.fillRect(90, 120, 900, 150); c.fillStyle = bg; for (let j = 0; j < 6; j++) c.fillRect(130 + j * 140, 160, 90, 70);   // заголовок — полосками, без слов
    c.save(); c.translate(540, 960); c.scale(2.2, 2.2); circ(c, 0, 0, 86, lit(bg, .25)); c.restore();
    lady(c, 480 + (i % 2 ? -40 : 40), 1540, 1.25, t + i, ink, lit(bg, .4));
    c.strokeStyle = C3.gold; c.lineWidth = 6; c.strokeRect(36, 36, 1008, 1848);
  }
  const PIV = { x: 70, y: 1880 };   // журналы раскрываются веером вокруг нижнего левого угла
  function fanK(t) { const a = T2; return eio(at(t, a.izy - .1, a.zh + .45)) }
  // помада → сигарета: m — превращение 0…1, rise — подъём из-под кадра, rib — красный ободок 0…1, ph — наклон торцом к камере 0…1
  function lipstick(c, t) {
    const a = T2, rise = eo(at(t, a.kr - .25, a.kr + .55)); if (rise <= 0) return;
    const tw = at(t, a.kr + .15, a.kon - .05), m = eio(at(t, a.kon - .05, a.kon + .55)), rib = eio(at(t, a.kot - .1, a.pom - .05)), ph = eio(at(t, a.tilt0, a.tilt1));
    const dy = 1500 * (1 - rise), x = LIP.x, y = LIP.y + dy, bw = LIP.bw, W = lp(LIP.w, bw, m);
    const ext = 330 * eo(tw), bodyL = lp(520, 1500, m), top = y - ext, slant = 70 * (1 - m), cb = Math.cos(ph * Math.PI / 2), sb = Math.sin(ph * Math.PI / 2);
    if (ph < .999) {
      c.save(); c.translate(x, top); c.scale(1, cb); c.translate(-x, -top);   // наклон: длина сжимается, торец становится кругом
      const tube = mixc('#D9A441', C3.white, m), col = mixc('#B98A2E', '#EDE7DC', m);
      rasterPoly(c, [x + W / 2, y + 30, x + W / 2 + 160, y + 150, x + W / 2 + 160, y + bodyL + 60, x + W / 2, y + bodyL], 'rgba(90,30,40,.3)', 9, 2.4);
      rr(c, x - W / 2, y, W, bodyL, lp(10, 22, m)); fill(c, tube); c.fillStyle = shd(tube, lp(.22, .1, m)); c.fillRect(x + W * .22, y, W * .28, bodyL); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(x - W * .38, y + 20, W * .08, bodyL - 40);
      if (m < 1) A(c, 1 - m, () => { rr(c, x - LIP.w / 2 - 14, y - 22, LIP.w + 28, 44, 10); fill(c, col); c.fillStyle = shd(col, .2); c.fillRect(x + LIP.w * .2, y - 22, LIP.w * .34, 44);
        for (let i = 0; i < 4; i++) c.fillRect(x - LIP.w / 2 - 10, y + 70 + i * 26, LIP.w + 20, 5) });
      const tipH = lp(ext + 6, 170, m);   // стержень помады → красный кончик сигареты
      c.beginPath(); c.moveTo(x - bw / 2, y); c.lineTo(x - bw / 2, top + slant + 10); c.quadraticCurveTo(x - bw / 2, top + slant, x - bw / 2 + 14, top + slant - 4 * (1 - m));
      c.lineTo(x + bw / 2 - 14, top + 4); c.quadraticCurveTo(x + bw / 2, top, x + bw / 2, top + 14); c.lineTo(x + bw / 2, y); c.closePath();
      c.save(); c.clip(); c.fillStyle = C3.red; c.fillRect(x - bw / 2, top - 10, bw, Math.max(tipH, ext + 20) + 20);
      if (m > 0) { c.fillStyle = C3.white; c.fillRect(x - bw / 2, top + tipH, bw, bodyL + 400) }
      c.fillStyle = C3.redD; c.fillRect(x + bw * .22, top - 10, bw * .3, tipH + 10); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x - bw * .36, top + slant + 8, bw * .08, tipH - slant - 12); c.restore();
      if (m > .3) A(c, at(m, .3, .8), () => {   // v20.2: бумага сигареты — шов и надпись Marlboro вдоль, у мундштука
        c.fillStyle = 'rgba(60,30,40,.09)'; c.fillRect(x - bw * .3, top + tipH + 12, 3, bodyL);
        c.save(); c.translate(x - bw * .04, top + tipH + 64); c.rotate(Math.PI / 2); tx(c, 'Marlboro', 0, 0, { f: 'P', w: 700, st: 'italic', s: 46, c: 'rgba(176,18,44,.85)', al: 'left' }); c.restore() });
      if (rib > 0) {   // v20.2: тонкое золотое кольцо между красным мундштуком и бумагой (обвивает слева направо) — сигарета, а не маркер
        const ry = top + tipH, e = 10, hh = 10; c.save(); c.beginPath(); c.rect(x - bw / 2 - 4, ry - e - hh - 8, (bw + 8) * rib, 2 * e + hh + 20); c.clip();
        c.beginPath(); c.ellipse(x, ry + hh / 2, bw / 2 + 2, e, 0, 0, Math.PI); c.lineTo(x - bw / 2 - 2, ry - hh / 2); c.ellipse(x, ry - hh / 2, bw / 2 + 2, e, 0, Math.PI, 0, true); c.closePath(); fill(c, C3.gold);
        c.beginPath(); c.ellipse(x, ry - hh / 2 + 2, bw / 2 + 2, e, 0, .2, Math.PI - .2); c.strokeStyle = 'rgba(255,240,200,.75)'; c.lineWidth = 2.5; c.stroke(); c.restore();
      }
      c.restore();
    }
    // торец: эллипс растёт в круг
    const R = bw / 2; c.beginPath(); c.ellipse(x, top, R, Math.max(1, R * sb), 0, 0, TAU); fill(c, ph > .5 ? C3.red : mixc('#E7D9C4', C3.red, ph * 2));
    if (ph > .2) { c.beginPath(); c.ellipse(x, top, R, Math.max(1, R * sb), 0, 0, TAU); c.strokeStyle = rgba('#FBFAF7', .8 * (1 - ss(.7, 1, ph))); c.lineWidth = 5; c.stroke() }
  }
  function w2World(c, t) {
    corridor(c, t, 12, 1);
    const kf = fanK(t);
    for (let i = MAGC.length - 1; i >= 0; i--) { const ang = (i + 1) * .21 * kf; if (ang <= .002) continue;
      c.save(); c.translate(PIV.x, PIV.y); c.rotate(ang); c.translate(-PIV.x, -PIV.y);
      castDots(c, 1080, 40, 10, 1880, 90, { col: 'rgba(90,30,50,.25)', st: 13 }); magCover(c, i, t); c.restore() }
    if (kf > 0) { castDots(c, 1080, 40, 10, 1880, 90 * kf, { col: 'rgba(90,30,50,.25)', st: 13 }); c.fillStyle = 'rgba(58,24,48,.55)'; c.fillRect(0, 0, 26 * kf, 1920) }   // корешок
    pageW2(c, t);
    lipstick(c, t);
    const kp = at(t, T2.myag + .15, T2.myag + .55) * (1 - at(t, T2.zh - .35, T2.zh + .05));
    if (kp > 0) plate(c, 'МЯГКИЕ, КАК МАЙ', 720, 1420, bo(kp), { s: 50, bg: '#3A1830', c: '#F6EBDD', ls: 3 });
  }
  function w2Shot(c, t) { const q = camObj(camAt(K2, t)); layer(c, q, 1, cc => w2World(cc, t)) }
