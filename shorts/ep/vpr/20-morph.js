  // ================= проба 20.11, часть 1: превращения формы в форму (flubber) =================
  // flubber сам расставляет точки на контурах двух любых фигур и ведёт одну в другую — без ручной подгонки каждой пары.
  const FLB = window.flubber, MCACHE = {};
  function morph(key, a, b) { return MCACHE[key] || (MCACHE[key] = FLB.interpolate(a, b, { string: false, maxSegmentLength: 6 })) }
  const shCircle = (r, n = 120) => [...Array(n)].map((_, i) => { const a = -Math.PI / 2 + i * TAU / n; return [Math.cos(a) * r, Math.sin(a) * r] });
  function shRR(w, h, r, n = 14) {   // скруглённый прямоугольник по часовой стрелке
    const o = [], hw = w / 2, hh = h / 2;
    for (const [cx, cy, a0] of [[hw - r, -hh + r, -Math.PI / 2], [hw - r, hh - r, 0], [-hw + r, hh - r, Math.PI / 2], [-hw + r, -hh + r, Math.PI]])
      for (let i = 0; i <= n; i++) { const a = a0 + i / n * Math.PI / 2; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]) }
    return o;
  }
  function catmull(P, per = 8) {   // гладкий замкнутый контур через опорные точки
    const o = [], n = P.length;
    for (let i = 0; i < n; i++) {
      const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
      for (let j = 0; j < per; j++) { const t = j / per, t2 = t * t, t3 = t2 * t;
        o.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))) }
    }
    return o;
  }
  // белая фигурка по грудь, в профиль вправо (лица нет — как у всех наших фигурок)
  const shBust = () => catmull([[-6, -232], [52, -214], [80, -160], [74, -104], [44, -64], [40, -30], [118, 6], [158, 84], [168, 196], [-168, 196], [-158, 84], [-118, 6], [-46, -34], [-62, -96], [-70, -168], [-48, -216]], 10);
  function shLeaf(L = 470, W = 220) {   // лист табака: острый кончик справа, черешок слева
    const o = [], n = 60;
    for (let i = 0; i <= n; i++) { const u = i / n; o.push([-L / 2 + L * u, -W / 2 * Math.pow(Math.sin(Math.PI * u), .8) * (1 - .25 * u)]) }
    for (let i = n; i >= 0; i--) { const u = i / n; o.push([-L / 2 + L * u, W / 2 * Math.pow(Math.sin(Math.PI * u), .8) * (1 - .25 * u)]) }
    return o.map(([x, y]) => { const a = -.5; return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)] });
  }
  function shDrop(R = 150) {   // капля острым концом вверх
    const o = [], n = 120;
    for (let i = 0; i < n; i++) { const t = i / n * TAU; o.push([R * Math.sin(t) * Math.pow(Math.sin(t / 2), 1.3), -R * 1.35 * Math.cos(t) + R * .35]) }
    return o;
  }
  const SH = { tin: shCircle(232), pouch: shRR(430, 240, 96), bust: shBust(), win: shRR(420, 560, 18), port: shRR(310, 460, 155), leaf: shLeaf(), drop: shDrop() };
  function pathOf(c, pts) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath() }
  function bbox(pts) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) } return [x0, y0, x1 - x0, y1 - y0] }
  function celPts(c, pts, base, o = {}) {   // наши 3 тона: заливка, тень справа (темнее и холоднее), блик полосой слева, тонкий светлый контур
    const [x, y, w, h] = bbox(pts); pathOf(c, pts); cel(c, x, y, w, h, base, { sw: o.sw ?? .26, hx: .1, hw: .09, ha: o.ha ?? .4 }); pathOf(c, pts); lnB(c, o.lw ?? 4, o.lc ?? B2.ln);
  }
  // кадры части 1: t от 0
  function morphPart(c, t) {
    bgSplit(c, B2.bg, B2.bg2, 540, 1380, -.32);
    const zc = 1 + .05 * t / 6.6; c.save(); cam(c, zc, 540, 920);
    // А: баночка → подушечка → фигурка
    if (t < 3.35) {
      const k1 = eio(at(t, .85, 1.6)), k2 = eio(at(t, 1.72, 2.6)), app = spr(at(t, 0, .55)), out = ei(at(t, 3.0, 3.35));
      let pts = k1 < 1 ? morph('tp', SH.tin, SH.pouch)(k1) : morph('pb', SH.pouch, SH.bust)(k2);
      const col = k1 < 1 ? mixc('#FBFAF7', '#EFE6D2', k1) : mixc('#EFE6D2', '#F4F1EA', k2);
      c.save(); c.translate(540, 900 - 40 * k2); { const z = 1.25 * app * (1 - out * .9); c.scale(z, z) } c.rotate(-.06 * (1 - k1) + .04 * Math.sin(t * 1.3));
      castDots(c, -40, 150, 80, 60, 260, { k: (1 - out) });
      celPts(c, pts, col);
      if (k1 < .35) { A(c, 1 - k1 / .35, () => { ring(c, 0, 0, 178, B2.mint, 16); ring(c, 0, 0, 160, rgba('#ffffff', .6), 3) }) }   // кольцо на крышке гаснет, пока круг становится подушечкой
      c.restore();
      label(c, 'баночка → подушечка → фигурка', 540, 1400, app * (1 - out));
    }
    // Б: окно переговорной → иллюминатор
    else if (t < 5.05) {
      const k = eio(at(t, 3.75, 4.55)), app = spr(at(t, 3.35, 3.8)), out = ei(at(t, 4.8, 5.05));
      const o = morph('wp', SH.win, SH.port)(k), inn = o.map(([x, y]) => [x * .86, y * .9]);
      c.save(); c.translate(540, 900); const s = 1.25 * app * (1 - out * .9); c.scale(s, s);
      celPts(c, o, mixc('#D8D2C8', '#E9E4DA', k));
      pathOf(c, inn); c.save(); c.clip();
      vgrad(c, -300, -320, 600, 640, [mixc('#3b5aa0', '#7cc4e0', k), mixc('#1d2a55', '#bde7f6', k)]);
      for (let i = 0; i < 5; i++) { const cx = ((i * 190 + t * 90 * (1 + k)) % 760) - 380, cy = -150 + i * 70; A(c, k, () => { c.beginPath(); c.ellipse(cx, cy, 80, 26, 0, 0, TAU); fill(c, 'rgba(255,255,255,.85)') }) }
      A(c, 1 - k, () => { for (let i = 0; i < 7; i++) { const bx = -170 + i * 52, bh = 120 + H1(i) * 160; c.fillStyle = '#141733'; c.fillRect(bx, 260 - bh, 40, bh); c.fillStyle = 'rgba(242,184,75,.8)'; for (let j = 0; j < 5; j++) c.fillRect(bx + 8, 270 - bh + j * 26, 8, 10) } });
      c.restore(); pathOf(c, inn); lnB(c, 4, B2.ln);
      A(c, 1 - k, () => { c.fillStyle = '#D8D2C8'; c.fillRect(-6, -250, 12, 500); c.fillRect(-180, -6, 360, 12) });   // переплёт окна уходит, пока окно скругляется
      c.restore();
      label(c, 'окно → иллюминатор', 540, 1400, app * (1 - out));
    }
    // В: лист табака → капля никотина
    else {
      const k = eio(at(t, 5.45, 6.25)), app = spr(at(t, 5.05, 5.5));
      const o = morph('ld', SH.leaf, SH.drop)(k);
      c.save(); c.translate(540, 900); c.scale(1.25 * app, 1.25 * app);
      celPts(c, o, mixc('#6E8B3D', '#F2B84B', k), { lc: mixc('#C9E29A', '#FFF4D6', k) });
      A(c, 1 - k * 1.6, () => { c.save(); c.rotate(-.5); c.beginPath(); c.moveTo(-235, 0); c.lineTo(220, 0); for (let i = -3; i <= 3; i++) { const x = i * 55; c.moveTo(x, 0); c.lineTo(x + 50, -60 + Math.abs(i) * 6); c.moveTo(x, 0); c.lineTo(x + 50, 60 - Math.abs(i) * 6) } lnB(c, 4, 'rgba(232,240,200,.75)'); c.restore() });   // прожилки гаснут
      A(c, at(k, .6, 1), () => { c.beginPath(); c.ellipse(-48, 60, 22, 46, .35, 0, TAU); fill(c, 'rgba(255,255,255,.55)') });
      c.restore();
      label(c, 'лист → капля никотина', 540, 1400, app);
    }
    c.restore();
  }
  function label(c, s, x, y, a) { if (a <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); plate(c, s, x, y, 1, { s: 38, a: Math.min(1, a), bg: 'rgba(15,23,42,.88)', c: '#fff', sh: false }); c.restore() }
  function partTag(c, s, a) { if (a <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); plate(c, s, 540, 230, 1, { s: 34, ls: 3, a, bg: '#FFD23F', c: '#141733' }); c.restore() }
