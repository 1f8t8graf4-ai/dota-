  // ================= мир 12 (фраза 12, только фильм): пробковая доска глав. Ночная дорога — это фото карточки 1924; проволока краснеет — это красная нить (#126).
  // На карточке 1979 оживает круг «Джула» с долей 35 % и «$12,8 МЛРД», счётчик крутится вниз до 0,45 (#089); из карточки 1924 выезжает пачка, крышка — как ящик кассы, чек волной (#012, #138).
  const CARDS3 = [{ id: '1979', x: 340, y: 400, a: '1979', b: 'СОЛЬ', open: true }, { id: '2020', x: 740, y: 400, a: '2020', b: 'ЛАЗЕЙКА ОДНОРАЗОК', open: true },
    { id: '2014', x: 230, y: 790, a: '2014', b: 'НАГРЕВАТЕЛИ' }, { id: '1924', x: 540, y: 805, a: '1924', b: '«МАЛЬБОРО»', open: true }, { id: '2022', x: 850, y: 790, a: '2022', b: 'ШАЙБЫ' }];
  const CW3 = 270, CH3 = 330, PH3 = 240, photo3 = cd => [cd.x, cd.y - CH3 / 2 + 15 + PH3 / 2], pin3 = cd => [cd.x, cd.y - CH3 / 2 + 4], C1924 = CARDS3[3];
  let T12 = null, K12 = null, N12 = null, CORK3 = null;
  function corkImg3() { if (CORK3) return CORK3; CORK3 = mk(WW, 1400); const g = CORK3.getContext('2d'); g.fillStyle = '#b07a4a'; g.fillRect(0, 0, WW, 1400);
    for (let y = 10, r = 0; y < 1400; y += 22, r++) for (let x = (r % 2) * 11; x < WW; x += 22) { if (H1(x * .37 + y * 1.13) > .55) continue; g.fillStyle = 'rgba(120,72,35,.35)'; g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill() } return CORK3 }
  function boardWall3(c, t) {   // v20.2: пробка во весь кадр (без тёмной стены снизу): доска шире любого кадра камеры
    c.fillStyle = '#4a3220'; c.fillRect(-4000, -4000, 9000, 9000);
    const X0 = -520, Y0 = -420, X1 = 1600, Y1 = 2300, im = corkImg3();
    c.save(); rr(c, X0, Y0, X1 - X0, Y1 - Y0, 14); fill(c, '#5b3d26'); rr(c, X0 + 22, Y0 + 22, X1 - X0 - 44, Y1 - Y0 - 44, 8); c.clip();
    for (let yy = Y0; yy < Y1; yy += 1400) for (let xx = X0; xx < X1; xx += 1080) c.drawImage(im, xx, yy); c.restore();
    rr(c, X0 + 22, Y0 + 22, X1 - X0 - 44, Y1 - Y0 - 44, 8); lnS(c, 3, 'rgba(241,230,214,.4)');
    c.save(); const g = c.createRadialGradient(540, 420, 120, 540, 700, 1500); g.addColorStop(0, 'rgba(255,236,190,.12)'); g.addColorStop(1, 'rgba(20,12,6,.38)'); c.fillStyle = g; c.fillRect(X0, Y0, X1 - X0, Y1 - Y0); c.restore();   // свет лампы сверху, края темнее
  }
  function marker3(c, x, y, s, seed) { c.save(); c.translate(x, y); c.lineCap = 'round';
    [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(seed + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke(); c.restore() }); c.restore() }
  function pin3d(c, x, y) { circ(c, x + 2, y + 4, 10, 'rgba(0,0,0,.35)'); circ(c, x, y, 10, '#dc2626'); circ(c, x - 3, y - 3, 3.6, '#fca5a5') }   // v20.2: булавка меньше — при отъезде из фото не «огромный шар»
  function thread3(c, a, b, k = 1, col = '#dc2626') { if (k <= 0) return; const [x1, y1] = pin3(a), [x2, y2] = pin3(b); c.save(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(lp(x1, x2, k) + 3, lp(y1, y2, k) + 6); c.stroke(); c.strokeStyle = col; c.lineWidth = 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, k), lp(y1, y2, k)); c.stroke(); c.restore() }
  function photo1979b(c, t, x, y, s) {   // колба и кристалл соли (как в главе 1); на «миллиардов» — круг «Джула» с долей 35 %
    const a = T12, k = a ? spr(at(t, a.mil - .15, a.mil + .5)) : 0;
    c.fillStyle = '#1b2142'; c.fillRect(x - s / 2, y - s / 2, s, s);
    if (k < 1) { c.save(); c.translate(x - s * .12, y + s * .08); c.scale(s / 240, s / 240); poly(c, [-38, 20, 38, 20, 56, 56, -56, 56]); fill(c, '#38bdf8'); poly(c, [-14, -80, 14, -80, 14, -30, 60, 60, -60, 60, -14, -30]); c.strokeStyle = '#e0f2fe'; c.lineWidth = 5; c.stroke(); c.restore() }
    if (k > 0) { const R = s * .34 * k, cx = x, cy = y - s * .06, pale = a ? eio(at(t, a.pochti, a.poter + .4)) : 0;
      c.fillStyle = '#1b2142'; c.fillRect(x - s / 2, y - s / 2, s, s); circ(c, cx, cy, R, '#3A3E4C'); c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + TAU * .35); c.closePath(); fill(c, mixc(C3.red, '#6A6E7C', pale * .85));
      circ(c, cx, cy, R * .42, '#1b2142'); tx(c, 'JUUL', cx, cy + 2, { f: 'M', w: 800, s: Math.round(s * .1), c: '#F4F1EA' }); tx(c, '35 %', cx + R * .62, cy - R * .2, { f: 'M', w: 800, s: Math.round(s * .07), c: '#fff', a: k }) }
  }
  function photo2020(c, t, x, y, s) { c.fillStyle = '#1e2138'; c.fillRect(x - s / 2, y - s / 2, s, s); rr(c, x - s * .12, y - s * .32, s * .24, s * .64, s * .08); fill(c, B2.mango); poly(c, [x - s * .12, y + s * .02, x + s * .12, y - s * .1, x + s * .12, y + s * .32, x - s * .12, y + s * .32]); fill(c, B2.ice2); rr(c, x - s * .07, y - s * .42, s * .14, s * .12, 6); fill(c, '#2a2f55') }
  function card3(c, t, cd, inner) {
    const [px, py] = photo3(cd);
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW3 / 2, -CH3 / 2, CW3, CH3, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW3 / 2, cd.y - CH3 / 2, CW3, CH3, 6); fill(c, '#f5f0e6'); rr(c, cd.x - CW3 / 2, cd.y - CH3 / 2, CW3, CH3, 6); lnS(c, 3, '#2b2638');
    c.save(); c.beginPath(); c.rect(px - PH3 / 2, py - PH3 / 2, PH3, PH3); c.clip();
    if (cd.id === '1979') photo1979b(c, t, px, py, PH3); else if (cd.id === '2020') photo2020(c, t, px, py, PH3); else if (cd.id === '1924' && inner) inner(c); else { c.fillStyle = '#1e293b'; c.fillRect(px - PH3 / 2, py - PH3 / 2, PH3, PH3) }
    if (!cd.open) { rr(c, px - PH3 / 2, py - PH3 / 2, PH3, PH3, 2); fill(c, '#17171c'); marker3(c, px, py, PH3, cd.x) }
    c.restore();
    tx(c, cd.a, cd.x, cd.y + CH3 / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' });
    if (cd.open) tx(c, cd.b, cd.x, cd.y + CH3 / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW3 - 24 });
  }
  function w12Init() {
    const s = 's12'; if (SA(s) === null) return; const w = q => Ws(s, q);
    T12 = { a: SA(s), pom: w('помните'), tri: w('тринадцать'), mil: w('миллиардов'), juul: w('джула'), pochti: w('почти'), poter: w('потерял'), spok: w('спокойно'), perezh: w('пережил'),
      pach: w('пачка'), korm: w('кормит'), por: w('пор'), end: SA('s13') - .02 };
    const [ex, ey, ez] = T9END, m = 230 / (1920 / ez); N12 = { x: 540 - (ex - 540) * m, y: photo3(C1924)[1] - (ey - 960) * m, m };   // v20.2: фото = последний кадр ночной сцены
    const a = T12; a.burn = a.por + .05;
    K12 = [KY(a.pom + .5, 520, 720, 2.6), KY(a.tri + .5, 500, 660, 1.55), KY(a.mil + .25, 360, 470, 2.0), KY(a.juul, 345, 430, 2.35), KY(a.pochti + .35, 345, 470, 2.2), KY(a.spok + .1, 520, 720, 1.35),
      KY(a.korm + .1, 600, 900, 1.2), KY(a.por, 720, 1080, 1.6), KY(a.end, RC.x1, RC.y1, 9)];
  }
  const RC = { x0: 640, y0: 760, x1: 905, y1: 1175 };   // чек: откуда выползает и где кончик (тлеет)
  function pack12(c, t) {   // v20.2: крупная пачка-касса на переднем плане: выезжает из-за карточки 1924, крышка откидывается назад (как ящик кассы), из пачки волной ползёт чек
    const a = T12, k = eo(at(t, a.spok - .3, a.spok + .5)); if (k <= 0) return;
    const S = .82, w = 190 * S, h = 282 * S, x = lp(470, 650, k), top = lp(760, 800, k), sw = Math.sin(t * 2.2) * .04 * at(t, a.spok + .3, a.spok + .8), lid = eio(at(t, a.korm - .1, a.korm + .2));
    c.save(); c.translate(x + w / 2, top + h); c.rotate(sw); c.translate(-(x + w / 2), -(top + h));
    rasterPoly(c, [x + w, top + h * .1, x + w + h * .2, top + h * .25, x + w + h * .2, top + h * 1.1, x + w * .2, top + h * 1.1, x, top + h], 'rgba(0,0,0,.3)', 9, 2.4);
    flipPack(c, x, top, w, h, lid, { shadow: false });
    c.restore();
    if (lid > 0) { const rl = at(t, a.korm + .08, a.end), x0 = x + w / 2, y0 = top + h * .1, pts = [];   // бесконечный чек волной
      for (let i = 0; i <= 44; i++) { const u = i / 44 * rl, bx = lp(x0, RC.x1, u), by = lp(y0, RC.y1, u) - Math.sin(Math.PI * Math.min(1, u * 1.6)) * 240; pts.push([bx + Math.sin(u * 9 - t * 4) * 24, by]) }
      c.strokeStyle = '#F4F1EA'; c.lineCap = 'butt'; c.lineWidth = 36; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
      c.strokeStyle = 'rgba(40,40,50,.35)'; c.lineWidth = 2; pts.forEach((p, i) => { if (i % 2 && i > 2) { c.beginPath(); c.moveTo(p[0] - 11, p[1]); c.lineTo(p[0] + 11, p[1]); c.stroke() } });
      const end = pts[pts.length - 1], eb = at(t, a.burn - .1, a.end); if (eb > 0) { circ(c, end[0], end[1], 16, rgba('#FF9A4A', .45 * eb)); circ(c, end[0], end[1], 9, C3.ember) } }
  }
  function drum12(c, t) {   // v20.2: барабанный счётчик поверх кадра: 12,80 → 0,45 млрд $, цифры прокручиваются; уходит на «пережил»
    const a = T12; if (!a) return; const k = at(t, a.mil + .1, a.mil + .45) * (1 - at(t, a.perezh + .1, a.perezh + .4)); if (k <= 0) return;
    const v = lp(12.8, .45, eio(at(t, a.pochti, a.poter + .45))), cw = 46, ch = 70, x0 = 540 - 3.2 * cw, y0 = 300;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.translate(540, y0); c.scale(bo(k), bo(k)); c.translate(-540, -y0); c.globalAlpha *= Math.min(1, k * 2);
    rr(c, x0 - 70, y0 - ch / 2 - 14, 6.4 * cw + 210, ch + 28, 18); fill(c, 'rgba(15,23,42,.9)');
    tx(c, '$', x0 - 34, y0 + 3, { f: 'M', w: 800, s: 50, c: '#F4F1EA' }); tx(c, 'МЛРД', x0 + 5.6 * cw + 62, y0 + 3, { f: 'M', w: 800, s: 34, c: '#F4F1EA' });
    const P = [[10, 0], [1, 1], [null, 2], [.1, 3], [.01, 4]];
    P.forEach(([pl, i]) => { const cx = x0 + i * cw * 1.12 + cw / 2;
      if (pl === null) { tx(c, ',', cx, y0 + 14, { f: 'M', w: 800, s: 54, c: '#F4F1EA' }); return }
      rr(c, cx - cw / 2, y0 - ch / 2, cw, ch, 8); fill(c, '#F4F1EA');
      const dd = (v + 1e-6) / pl, d0 = Math.floor(dd) % 10, fr = dd - Math.floor(dd), sh = pl < .05 ? fr : cl((fr - .9) * 10);   // как одометр: младшая цифра крутится, старшие поворачиваются, когда младшая проходит 9→0
      c.save(); rr(c, cx - cw / 2, y0 - ch / 2, cw, ch, 8); c.clip();
      const show = n => (i === 0 && v < 9.6 && n % 10 === 0) ? '' : String(n % 10);
      tx(c, show(d0), cx, y0 + 4 - sh * ch, { f: 'M', w: 800, s: 54, c: '#141010' }); tx(c, show(d0 + 1), cx, y0 + 4 + ch - sh * ch, { f: 'M', w: 800, s: 54, c: '#141010' });
      c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(cx - cw / 2, y0 - 3, cw, 6); c.restore() });
    c.restore();
  }
  function board12(c, t, inner) {
    const a = T12; boardWall3(c, t);
    thread3(c, CARDS3[0], CARDS3[1]); [2, 3, 4].forEach(i => thread3(c, CARDS3[1], CARDS3[i]));
    const kt = a ? eo(at(t, a.pom + .2, a.tri + .4)) : 1; thread3(c, C1924, CARDS3[0], kt);
    CARDS3.forEach(cd => card3(c, t, cd, cd.id === '1924' ? inner : null));
    CARDS3.forEach(cd => pin3d(c, ...pin3(cd)));
    if (a && t < a.end + .3) pack12(c, t);   // пачка с чеком сгорела в дым — на доске в концовке её нет
  }
  function w12Shot(c, t) { const q = camObj(camAt(K12, t)); layer(c, q, 1, cc => board12(cc, t, ci => inNest(ci, N12, cn => nightLocal(cn, t, q, false)))) }
  // ---------- дым (v20.2): неровные клубы растут из тлеющего кончика чека (в шортсе — снизу), закрывают кадр; после стыка с 2014-м уходят вверх ----------
  function smokeCover(c, t, tc, half = .5) {
    if (Math.abs(t - tc) > half + .5) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    const TONE = ['#9A9AA6', '#8C8C98', '#B3B2BC', '#A5A4AF', '#7F7F8B'], [sx, sy] = MODE === 'y' && T12 ? [540, 960] : [540, 2250];
    for (let n = 0; n < 48; n++) {
      const fx = -80 + H1(n * 1.37) * 1240, fy = -120 + H1(n * 2.91) * 2160, R = 230 + H1(n * 6.53) * 270;   // где клуб стоит, когда кадр закрыт
      const ta = tc - half + H1(n * 4.17) * half * .55, k = eo(at(t, ta, tc + .02));
      const after = at(t, tc + .03 + (fy / 1920) * .1, tc + .03 + half + .2), up = 2800 * after * after;   // после стыка — вверх; нижние клубы уходят позже
      if (k <= 0 || after >= 1) continue;
      const x = lp(sx, fx, k) + Math.sin(t * 1.6 + n) * 16, y = lp(sy, fy, k) - up, r = R * (.18 + .82 * k) * (1 - .35 * after);
      circ(c, x, y, r, TONE[n % 5]); circ(c, x - r * .22, y - r * .26, r * .56, 'rgba(200,199,208,.32)');   // клуб и его светлая сторона
    }
    if (Math.abs(t - tc) < .02) { c.fillStyle = '#9A9AA6'; c.fillRect(0, 0, WW, HH) }
    c.restore();
  }
