  // ================= мир 12 (фраза 12, только фильм): пробковая доска глав. Ночная дорога — это фото карточки 1924; проволока краснеет — это красная нить (#126).
  // На карточке 1979 оживает круг «Джула» с долей 35 % и «$12,8 МЛРД», счётчик крутится вниз до 0,45 (#089); из карточки 1924 выезжает пачка, крышка — как ящик кассы, чек волной (#012, #138).
  const CARDS3 = [{ id: '1979', x: 340, y: 400, a: '1979', b: 'СОЛЬ', open: true }, { id: '2020', x: 740, y: 400, a: '2020', b: 'ЛАЗЕЙКА ОДНОРАЗОК', open: true },
    { id: '2014', x: 230, y: 790, a: '2014', b: 'НАГРЕВАТЕЛИ' }, { id: '1924', x: 540, y: 805, a: '1924', b: '«МАЛЬБОРО»', open: true }, { id: '2022', x: 850, y: 790, a: '2022', b: 'ШАЙБЫ' }];
  const CW3 = 270, CH3 = 330, PH3 = 240, photo3 = cd => [cd.x, cd.y - CH3 / 2 + 15 + PH3 / 2], pin3 = cd => [cd.x, cd.y - CH3 / 2 + 4], C1924 = CARDS3[3];
  let T12 = null, K12 = null, N12 = null, CORK3 = null;
  function corkImg3() { if (CORK3) return CORK3; CORK3 = mk(WW, 1400); const g = CORK3.getContext('2d'); g.fillStyle = '#b07a4a'; g.fillRect(0, 0, WW, 1400);
    for (let y = 10, r = 0; y < 1400; y += 22, r++) for (let x = (r % 2) * 11; x < WW; x += 22) { if (H1(x * .37 + y * 1.13) > .55) continue; g.fillStyle = 'rgba(120,72,35,.35)'; g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill() } return CORK3 }
  function boardWall3(c, t) {
    c.fillStyle = '#1f1b2b'; c.fillRect(-4000, -4000, 9000, 9000);
    c.save(); rr(c, 30, 150, WW - 60, 1050, 14); fill(c, '#5b3d26'); rr(c, 52, 172, WW - 104, 1006, 8); c.clip(); c.drawImage(corkImg3(), 0, 0); c.restore();
    rr(c, 30, 150, WW - 60, 1050, 14); lnS(c, 5, '#f1e6d6'); rr(c, 52, 172, WW - 104, 1006, 8); lnS(c, 3, 'rgba(241,230,214,.5)');
    const sw = Math.sin(t * 1.25) * .2, bx = 540 + Math.sin(sw) * 1300; c.beginPath(); c.moveTo(540, -400); c.lineTo(540, 40); lnS(c, 3, '#f1e6d6');
    c.save(); c.translate(540, 40); c.rotate(-sw * .25); c.beginPath(); c.arc(0, 30, 44, Math.PI, 0); c.closePath(); fill(c, '#2b2638'); c.beginPath(); c.arc(0, 30, 44, Math.PI, 0); c.closePath(); lnS(c, 4, '#f1e6d6'); circ(c, 0, 34, 10, '#fde68a'); c.restore();
    poly(c, [510, 74, 570, 74, bx + 420, 1200, bx - 420, 1200]); fill(c, 'rgba(253,230,138,.09)');
  }
  function marker3(c, x, y, s, seed) { c.save(); c.translate(x, y); c.lineCap = 'round';
    [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(seed + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke(); c.restore() }); c.restore() }
  function pin3d(c, x, y) { circ(c, x + 3, y + 5, 14, 'rgba(0,0,0,.35)'); circ(c, x, y, 14, '#dc2626'); circ(c, x - 4, y - 4, 5, '#fca5a5') }
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
    const m = 230 / (1920 / .45); N12 = { x: 540 - (1640 - 540) * m, y: photo3(C1924)[1], m };
    const a = T12; a.burn = a.por + .05;
    K12 = [KY(a.pom + .5, 520, 720, 2.6), KY(a.tri + .5, 500, 660, 1.55), KY(a.mil + .25, 360, 470, 2.0), KY(a.juul, 345, 430, 2.35), KY(a.pochti + .35, 345, 470, 2.2), KY(a.spok + .1, 520, 720, 1.35),
      KY(a.korm + .1, 600, 900, 1.2), KY(a.por, 720, 1080, 1.6), KY(a.end, RC.x1, RC.y1, 9)];
  }
  const RC = { x0: 640, y0: 760, x1: 860, y1: 1140 };   // чек: откуда выползает и где кончик (тлеет)
  function pack12(c, t) {   // пачка выезжает из-за карточки 1924, качается; крышка открывается ящиком кассы, чек волной
    const a = T12, k = eo(at(t, a.spok - .3, a.spok + .5)); if (k <= 0) return;
    const x = lp(560, 650, k), y = 800, sw = Math.sin(t * 2.2) * .05 * at(t, a.spok + .3, a.spok + .8), lid = eio(at(t, a.korm - .08, a.korm + .2));
    c.save(); c.translate(x + 60, y + 90); c.rotate(sw); c.translate(-(x + 60), -(y + 90));
    if (lid > 0) { const rl = at(t, a.korm + .1, a.end); c.strokeStyle = '#F4F1EA'; c.lineCap = 'butt';   // бесконечный чек волной
      const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40 * rl; pts.push([lp(x + 60, RC.x1, u) + Math.sin(u * 9 - t * 4) * 26, lp(y - 10, RC.y1, u)]) }
      c.lineWidth = 34; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.strokeStyle = 'rgba(40,40,50,.35)'; c.lineWidth = 2;
      pts.forEach((p, i) => { if (i % 2) { c.beginPath(); c.moveTo(p[0] - 10, p[1]); c.lineTo(p[0] + 10, p[1]); c.stroke() } });
      const end = pts[pts.length - 1], eb = at(t, a.burn - .1, a.end); if (eb > 0) { circ(c, end[0], end[1], 14, rgba('#FF9A4A', .5 * eb)); circ(c, end[0], end[1], 8, C3.ember) } }
    c.save(); c.translate(x, y); c.scale(.42, .42); mPack(c, 0, 0, 190, 282, 34, { shc: 'rgba(0,0,0,.3)' });
    if (lid > 0) { c.save(); c.translate(190, 282 * .3); c.rotate(-lid * 2.1); PL(c, [-190, 0, 0, 0, 0, -84, -190, -84], C3.white); PL(c, [-190, -84, 0, -84, -95, -36], C3.red); c.restore() } c.restore();
    c.restore();
  }
  function counter12(c, t) {   // барабанный счётчик под кругом: 12,8 → 0,45 млрд
    const a = T12, k = at(t, a.mil + .2, a.mil + .5); if (k <= 0) return; const v = lp(12.8, .45, eio(at(t, a.pochti, a.poter + .45))), s = v >= 1 ? v.toFixed(1).replace('.', ',') : v.toFixed(2).replace('.', ',');
    const cd = CARDS3[0]; plate(c, '$' + s + ' МЛРД', cd.x, cd.y + CH3 / 2 + 46, bo(k), { s: 30, bg: '#F4F1EA', c: '#141010', ls: 1 });
  }
  function board12(c, t, inner) {
    const a = T12; boardWall3(c, t);
    thread3(c, CARDS3[0], CARDS3[1]); [2, 3, 4].forEach(i => thread3(c, CARDS3[1], CARDS3[i]));
    const kt = a ? eo(at(t, a.pom + .2, a.tri + .4)) : 1; thread3(c, C1924, CARDS3[0], kt);
    CARDS3.forEach(cd => card3(c, t, cd, cd.id === '1924' ? inner : null));
    CARDS3.forEach(cd => pin3d(c, ...pin3(cd)));
    if (a) { counter12(c, t); if (t < a.end + .3) pack12(c, t) }   // пачка с чеком сгорела в дым — на доске в концовке её нет
  }
  function w12Shot(c, t) { const q = camObj(camAt(K12, t)); layer(c, q, 1, cc => board12(cc, t, ci => inNest(ci, N12, cn => nightLocal(cn, t, q, false)))) }
  // ---------- дым: густая серая полоса проходит перед камерой (стык доски / ночной дороги с 2014-м) ----------
  function smokeCover(c, t, tc, half = .62) {
    const k = 1 - Math.abs(t - tc) / half; if (k <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    const cov = ss(0, .94, k);
    for (let i = 0; i < 26; i++) { const ang = H1(i * 3.3) * TAU, d = (1 - cov) * (700 + H1(i) * 500), x = 540 + Math.cos(ang) * d + Math.sin(t * 1.3 + i) * 30, y = 960 + Math.sin(ang) * d * 1.6 + (t - tc) * -300, r = (260 + H1(i * 7) * 260) * (.4 + .9 * cov);
      circ(c, x, y, r, ['#9A9AA6', '#8A8A96', '#B0AFBA'][i % 3]) }
    if (cov >= .999) { c.fillStyle = '#9A9AA6'; c.fillRect(0, 0, WW, HH) }
    c.restore();
  }
