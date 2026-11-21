  // ================= кадр 0 главы 1 — её же рисовка, перенесена слово в слово из ep/v170.js (мостик выпуска 1, v170e) =================
  // Нужна, чтобы последний кадр пролога был кадром главы 1 за 1/30 с до её кадра 0 (кадры подряд, без повтора и без склейки).
  // Поменяешь в главе 1 v1Band / v1Capsule / v1Ring / liveCam / Rpost (STY 'cine') — поменяй и здесь, проверка стыка: ./v230_render.sh seam
  const C1 = { am: '#f2a33a', am3: '#ffc46a', rim: '#060e38', glass: '#040a2a' };
  const V1Z = { x: 540, top: 300, bot: 1300, w: 160 }, V1RY0 = V1Z.top + 42;
  const rr1 = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r) };   // как rr главы 1 (без ограничения радиуса)
  function liveCam1(c, t) {   // liveCam(c, t, 1)
    const a = 1;
    const dx = a * (16 * Math.sin(TAU * t / 6.1) + 8 * Math.sin(TAU * t / 2.9 + 1)), dy = a * (10 * Math.sin(TAU * t / 7.7 + 2) + 5 * Math.sin(TAU * t / 3.3));
    const z = 1 + a * (.045 + .015 * Math.sin(TAU * t / 9.5)), r = a * .004 * Math.sin(TAU * t / 8.3);
    c.translate(CX, CY); c.rotate(r); c.scale(z, z); c.translate(-CX + dx, -CY + dy);
  }
  function band1(c) {   // v1Band: красный фон заставки = корпус вейпа, мелкий растр
    const g = c.createLinearGradient(0, -300, 0, HH + 300); g.addColorStop(0, '#ef5668'); g.addColorStop(1, '#da3e52');
    c.fillStyle = g; c.fillRect(-300, -300, WW + 600, HH + 600);
    c.save(); c.globalAlpha = .07; c.fillStyle = '#ffffff';
    for (let r = 0, y = -290; y < HH + 300; r++, y += 34) for (let x = (r % 2) * 17 - 290; x < WW + 300; x += 34) { c.beginPath(); c.arc(x, y, 2.6, 0, TAU); c.fill() }
    c.restore();
  }
  function ring1(c, x, y, r, a = 1, lw = 8) { if (a <= 0 || r <= 0) return; c.save(); c.globalAlpha *= a; c.beginPath(); c.arc(x, y, r, 0, TAU); c.strokeStyle = '#fff6ee'; c.lineWidth = lw; c.stroke(); c.restore() }
  // v1Capsule; lvK — уровень янтаря (доля высоты сверху), у главы 1 — lp(.15, 83/270, flat); в прологе ядро стекает в капсулу — уровень поднимается
  function capsule1(c, t, x, y0, y1, w, rev, a = 1, rad, flat = 0, lvK) {
    if (a <= 0 || rev <= y0) return;
    const h = y1 - y0, R = rad ?? w / 2, k = w / 124;
    c.save(); c.globalAlpha *= a; c.beginPath(); c.rect(-400, -400, WW + 800, rev + 400); c.clip();
    c.save(); c.globalAlpha *= .35 * (1 - flat); rr1(c, x - w / 2 + 10 * k, y0 + 14 * k, w, h, R); fill(c, '#5a0f1c'); c.restore();
    rr1(c, x - w / 2, y0, w, h, R); fill(c, C1.rim);
    const p = 12 * k, iw = w - 2 * p, ih = h - 2 * p, ir = Math.max(4, R - p * .85);
    rr1(c, x - iw / 2, y0 + p, iw, ih, ir); fill(c, C1.glass);
    c.save(); rr1(c, x - iw / 2, y0 + p, iw, ih, ir); c.clip();
    const lv = y0 + h * (lvK ?? lp(.15, 83 / 270, flat));
    c.beginPath(); c.moveTo(x - iw, lv + 6 * k); for (let q = -iw; q <= iw; q += 6) c.lineTo(x + q, lv + 6 * k + Math.sin(q * .07 / k - t * 3.1 + 2) * 6 * k); c.lineTo(x + iw, y1 + 10); c.lineTo(x - iw, y1 + 10); c.closePath(); fill(c, '#d97a06');
    c.beginPath(); c.moveTo(x - iw, lv); for (let q = -iw; q <= iw; q += 6) c.lineTo(x + q, lv + Math.sin(q * .07 / k + t * 3.4) * 5 * k); c.lineTo(x + iw, y1 + 10); c.lineTo(x - iw, y1 + 10); c.closePath(); fill(c, C1.am);
    const lg = c.createLinearGradient(x - iw / 2, 0, x + iw / 2, 0); lg.addColorStop(0, 'rgba(255,240,200,.28)'); lg.addColorStop(.4, 'rgba(255,240,200,0)'); lg.addColorStop(1, 'rgba(120,50,0,.28)'); c.save(); c.globalAlpha *= 1 - flat; c.fillStyle = lg; c.fillRect(x - iw / 2, lv - 10, iw, ih); c.restore();
    for (let i = 0; i < 16; i++) {
      const ph = (t * (.42 + .3 * H1(i * 2.3)) + H1(i * 3.1)) % 1, by = lp(y1 - p - 8 * k, lv + 10 * k, ph), bx = x - iw * .36 + iw * .72 * H1(i * 7.7) + Math.sin(t * 2.4 + i) * 5 * k;
      c.beginPath(); c.arc(bx, by, (i % 3 ? 3 + 4 * H1(i * 1.3) : 2 + 2 * H1(i)) * k, 0, TAU); fill(c, i % 3 ? C1.am3 : 'rgba(255,255,255,.85)');
    }
    c.restore();
    if (flat > 0) { c.save(); c.globalAlpha *= flat; rr1(c, x - w * (36 / 124), y0 + h * (27 / 270), w * (10 / 124), h * (120 / 270), 5 * k); fill(c, 'rgba(255,255,255,.35)'); c.restore() }
    c.restore();
  }
  function vignette1(c, a, col = '0,0,0') {   // виньетка главы 1 (чуть шире, чем у глав 3–5)
    if (a <= 0) return; const g = c.createRadialGradient(CX, CY * .94, 460, CX, CY, 1300); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`);
    c.save(); c.fillStyle = g; c.fillRect(-400, -400, WW + 800, HH + 800); c.restore();
  }
  let RG1 = null, RGR1 = null;
  function post1(c, t) {   // Rpost при STY 'cine' (у главы 1 LUX): контраст 1,1, насыщенность 1,06, мягкое зерно 0,05, виньетка 0,36 — в той же живой камере
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    if (!RG1) RG1 = mk(WW, HH); const g = RG1.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'copy'; g.drawImage(c.canvas, 0, 0);
    c.globalCompositeOperation = 'copy'; c.filter = 'brightness(1.0) contrast(1.1) saturate(1.06)'; c.drawImage(RG1, 0, 0); c.filter = 'none'; c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    if (!RGR1) { RGR1 = mk(256, 256); const x = RGR1.getContext('2d'), im = x.createImageData(256, 256), d = im.data; for (let i = 0; i < 65536; i++) { const v = 128 + (H1(i * 1.37 + 5) - .5) * 200; d[4 * i] = d[4 * i + 1] = d[4 * i + 2] = v; d[4 * i + 3] = 255 } x.putImageData(im, 0, 0) }
    const f = Math.floor(t * 30), ox = Math.floor(H1(f * 3.1) * 256), oy = Math.floor(H1(f * 7.7) * 256);
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = .05; c.translate(-ox, -oy); c.fillStyle = c.createPattern(RGR1, 'repeat'); c.fillRect(0, 0, WW + 256, HH + 256);
    c.restore(); vignette1(c, .36);
  }
  // кадр главы 1 при t < 0 (кольцо ещё наверху, видна только верхушка капсулы) — ровно её frame(t) без субтитров
  function ch1Frame(c, t) {
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    liveCam1(c, t);
    band1(c); capsule1(c, t, V1Z.x, V1Z.top, V1Z.bot, V1Z.w, V1RY0 + 4, 1, V1Z.w / 2, 0); ring1(c, V1Z.x, V1RY0, 24, 1, 8);
    post1(c, t);
  }
  // ---------- одноразка пролога: тот же кадр, только корпус целиком (координаты кадра главы 1) ----------
  const BODY = { x0: -60, y0: -240, x1: 1140, y1: 2160, r: 170 };   // при нырке закрывает весь кадр с запасом под живую камеру (зум 1,06, сдвиг до 24 px)
  function bodyPath(c, k) {   // k — рост вокруг капсулы: 0 — по контуру капсулы, 1 — весь корпус
    const x0 = lp(V1Z.x - V1Z.w / 2 - 40, BODY.x0, k), x1 = lp(V1Z.x + V1Z.w / 2 + 40, BODY.x1, k), y0 = lp(V1Z.top - 40, BODY.y0, k), y1 = lp(V1Z.bot + 40, BODY.y1, k);
    rr1(c, x0, y0, x1 - x0, y1 - y0, lp(V1Z.w / 2 + 40, BODY.r, k));
  }
  function mouthPath(c, k) {   // мундштук выезжает из-за верха корпуса
    const dy = (1 - k) * 300; c.beginPath(); c.moveTo(330, -180 + dy); c.lineTo(362, -458 + dy); c.quadraticCurveTo(372, -510 + dy, 420, -510 + dy); c.lineTo(660, -510 + dy); c.quadraticCurveTo(708, -510 + dy, 718, -458 + dy); c.lineTo(750, -180 + dy); c.closePath();
  }
  // o: { g — рост корпуса, m — мундштук, lv — уровень янтаря, ry — кольцо (y), rs — его размер, ra — видно ли, fl — вспышка кольца }
  function device1(c, t, o) {
    if (o.m > 0) { mouthPath(c, o.m); cel(c, 330, -510, 420, 330, '#1f2858', { sw: .26, hx: .12, hw: .1, ha: .3 }); mouthPath(c, o.m); lnB(c, 12, 'rgba(238,241,248,.85)'); }
    c.save(); bodyPath(c, o.g); c.clip();
    band1(c);
    c.fillStyle = 'rgba(20,23,51,.3)'; c.fillRect(BODY.x1 - 70, -400, 200, 2800); c.fillRect(-200, BODY.y1 - 60, 1600, 200);   // тень справа и снизу — за краем кадра главы 1
    c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(BODY.x0 + 18, BODY.y0 + 160, 46, BODY.y1 - BODY.y0 - 320);   // блик слева
    capsule1(c, t, V1Z.x, V1Z.top, V1Z.bot, V1Z.w, o.rev, 1, V1Z.w / 2, 0, o.lv);
    if (o.ra > 0) ring1(c, V1Z.x, o.ry, 24 * o.rs, o.ra, 8);
    c.restore();
    bodyPath(c, o.g); lnB(c, 12, 'rgba(238,241,248,.85)');
    if (o.fl > 0) glow(c, V1Z.x, o.ry, 260, '#fff6ee', .85 * o.fl);   // кольцо вспыхивает, как диод при затяжке
  }
