// Никотин v6-2 — «Что вы знаете о…», тот же ролик лучше. Андрей про nicw: «около идеального, улучши анимацию и сюжет».
//   Сюжет: табак отвечает на укусы (корни делают больше никотина) — мозг отвечает на затяжки (рецепторов больше).
//   Анимация: кадр не пустует (лучи, большие листья по краям, крупные предметы), падение с хлопком пыли, тля с первого
//   кадра сцены, куст в разрезе с корнями и бегущими молекулами, листья наливаются янтарём, переход внутрь листа (thru).
(function () {
  const C = { bg: '#13241F', bg2: '#1D3B32', bg3: '#2A5244', ink: '#0C1814', paper: '#F2ECDD', paper2: '#E8DCC2', line: '#F2ECDD', a1: '#E9A23B', a2: '#E2574C', a3: '#7FC48A', leaf: '#5E9E5A', leaf2: '#3F7A45', mango: '#FFB238', eu: '#2F56A6', star: '#FFD23F', skin: '#E9B48F', wood: '#B57A45', wood2: '#8A5A33', brown: '#7A4A22', denim: '#3D5E8E', denim2: '#2E4A73' };
  P = C;
  const D = {};
  const MOT = [C.a1, C.paper, C.a3];
  // флакон-распылитель с черепом
  function spray(t, o = {}) {
    const c = o.c ?? C.ink;
    let s = sh('M-70 -120H70V170C70 196 50 210 30 210H-30C-50 210 -70 196 -70 170Z', o.f || C.a1, { c, w: 6 }) + sh('M20 -120H70V170C70 196 50 210 30 210H20Z', '#C9832C');
    s += sh(D_.rr(-34, -170, 68, 54, 8), '#2B2F3A', { c, w: 6 }) + sh('M-40 -230H40L52 -170H-52Z', '#2B2F3A', { c, w: 6 }) + sh('M40 -224H110V-200H40Z', '#2B2F3A', { c, w: 6 }) + sh('M-6 -170C-30 -140 -60 -150 -70 -120', 'none', { c, w: 6 });
    s += sh(D_.rr(-52, -40, 104, 140, 14), C.paper, { c, w: 5 });
    s += sh(D_.circ(0, 4, 26), C.ink) + `<circle cx="-9" cy="2" r="7" fill="${C.paper}"/><circle cx="9" cy="2" r="7" fill="${C.paper}"/>` + sh(D_.rr(-14, 22, 28, 18, 4), C.ink) + line('M-34 52L34 82M34 52L-34 82', 1, { c: C.ink, w: 8 });
    if (o.mist) { const k = clamp(o.mist); for (let i = 0; i < 7; i++) s += `<circle cx="${R(118 + k * (60 + i * 18))}" cy="${R(-212 + (i - 3) * 9 * k)}" r="${R(5 + i % 3 * 2)}" fill="${C.paper}" opacity="${R((1 - k) * 100) / 100}"/>` }
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // ведро
  function bucket(o = {}) {
    const c = o.c ?? C.ink, wl = o.water || '#5B8DEF';
    let s = line('M-150 -170C-150 -330 150 -330 150 -170', 1, { c, w: 9 });
    s += sh('M-170 -170L-140 170H140L170 -170Z', C.wood, { c, w: 7 }) + sh('M40 -170L60 170H140L170 -170Z', C.wood2);
    s += line('M-100 -170L-84 170M-34 -170L-28 170M34 -170L28 170M100 -170L84 170', 1, { c, w: 4, op: .6 });
    s += sh('M-168 -110H168L164 -76H-164Z', '#6B6F78', { c, w: 5 }) + sh('M-150 90H150L148 124H-148Z', '#6B6F78', { c, w: 5 });
    s += sh(D_.ell(0, -170, 170, 34), wl, { c, w: 7 });
    if (o.leaves) for (let i = 0; i < 3; i++) s += g(leafT({ len: 220, w: 80, c: C.ink, ow: 4, vw: 3, dots: false }), at(-60 + i * 60, -176, 1, -30 + i * 30), clamp(o.leaves * 3 - i));
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // рука с кружевной манжетой (XVII век): запястье (0,0), пальцы вправо
  function lace(o = {}) {
    const c = o.c ?? C.ink;
    let s = sh(D_.rr(-260, -52, 200, 104, 30), '#3B4A6B', { c, w: 6 });
    for (let i = 0; i < 6; i++) s += sh(D_.circ(-62, -50 + i * 20, 16), '#FFFFFF', { c, w: 4 });
    s += sh(D_.rr(-50, -46, 130, 92, 40), C.skin, { c, w: 6 }) + sh('M-10 -40C0 -84 52 -92 58 -60C60 -46 40 -40 24 -36Z', C.skin, { c, w: 6 });
    s += line('M78 -18L50 -18M78 6L52 6M74 28L50 28', 1, { c, w: 5, op: .7 });
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // лейка: носик вправо, наклон r
  function wcan(o = {}) {
    const c = o.c ?? C.ink;
    let s = line('M-120 -120C-130 -230 60 -240 70 -120', 1, { c, w: 12 }) + sh('M70 -40L250 -150L262 -132L96 0Z', '#5B6F86', { c, w: 6 }) + sh(D_.rr(236, -176, 70, 60, 14), '#5B6F86', { c, w: 6, tr: 'rotate(-30 270 -146)' });
    s += sh('M-140 -120H100L110 120H-150Z', '#6E86A3', { c, w: 7 }) + sh('M40 -120H100L110 120H50Z', '#5B6F86') + line('M-146 -50H104M-148 50H108', 1, { c, w: 4, op: .5 });
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // кочан капусты
  const cabbage = (x, y, s = 1) => g(sh(D_.ell(0, 0, 120, 88), '#8CC66A', { c: C.ink, w: 6 }) + sh(D_.ell(30, -10, 80, 64), '#A6D86B', { c: C.ink, w: 5 }) + sh(D_.ell(-40, 6, 70, 56), '#9ED073', { c: C.ink, w: 5 }) + line('M-60 -40C-20 -10 10 20 60 40M10 -60C20 -20 40 0 70 10', 1, { c: C.ink, w: 4, op: .5 }), at(x, y, s));
  // грядка: земля + 5 кочанов, жуки падают по kill[i]
  function bed(t, x0, killT, o = {}) {
    let s = sh(D_.rr(x0 - 200, 1010, 2600, 300, 40), '#7A5236') + sh(D_.rr(x0 - 200, 1010, 2600, 40, 20), '#8E6443');
    for (let i = 0; i < 6; i++) {
      const cx = x0 + i * 400, kt = killT[i] ?? 99, k = P01(t, kt, .55);
      s += cabbage(cx, 980, 1);
      if (k < 1) s += beetle(t, { x: cx + 30 + k * 50, y: 900 + EZ.i(k) * 260, s: .32, back: k > 0 ? 1 : 0, c: C.ink, stiff: k > 0 ? 1 : 0, op: 1 - clamp((k - .7) / .3) });
      if (o.aphid === i) s += aphid(t, { x: cx - 30, y: 905, s: .42, mood: 'calm', c: C.ink });
    }
    return s
  }
  // струя из лейки: капли от (x,y) вниз
  const drops = (x, y, t, on = 1, c = C.brown) => { if (on <= 0) return ''; let s = ''; for (let i = 0; i < 9; i++) { const ph = (t * 1.6 + i / 9) % 1; s += sh(D_.drop(x + 20 + ph * 60 + Math.sin(i) * 14, y + ph * 300, 14), c, { op: on }) } return s };
  // джинсы с карманом (верх кармана — y)
  function jeans(y, o = {}) {
    let s = sh(D_.rr(-100, y - 200, 1280, 1400, 0), C.denim) + dots(D_.rr(-100, y - 200, 1280, 1400, 0), { c: C.denim2, step: 18, r: 6, x0: 0, y0: y - 200, x1: 600, y1: y + 900, op: .5 });
    const pk = `M240 ${y}C240 ${y + 380} 300 ${y + 520} 540 ${y + 600}C780 ${y + 520} 840 ${y + 380} 840 ${y}`;
    s += sh(pk + 'Z', C.denim2) + line(pk, 1, { c: '#E9A23B', w: 6, da: '18 14' }) + line(`M210 ${y - 30}H870`, 1, { c: '#E9A23B', w: 6, da: '18 14' });
    s += sh(D_.circ(240, y + 6, 14), '#C9A04A', { c: C.ink, w: 4 }) + sh(D_.circ(840, y + 6, 14), '#C9A04A', { c: C.ink, w: 4 });
    return s
  }
  // ядовитая бутылка
  function poison(o = {}) {
    const c = o.c ?? C.line;
    let s = sh('M-90 -60C-90 -120 -50 -140 -40 -170V-230H40V-170C50 -140 90 -120 90 -60V220C90 250 70 266 40 266H-40C-70 266 -90 250 -90 220Z', '#6B3A1E', { c, w: 7 }) + sh(D_.rr(-48, -290, 96, 64, 12), C.ink, { c, w: 6 });
    s += sh(D_.rr(-74, -10, 148, 190, 12), C.paper, { c: C.ink, w: 5 }) + sh(D_.circ(0, 60, 34), C.ink) + `<circle cx="-12" cy="56" r="9" fill="${C.paper}"/><circle cx="12" cy="56" r="9" fill="${C.paper}"/>` + sh(D_.rr(-18, 82, 36, 22, 4), C.ink) + line('M-44 120L44 156M44 120L-44 156', 1, { c: C.ink, w: 9 });
    s += tx(L('POISON', 'ЯД'), 0, 30, { f: 'O', w: 700, s: 30, c: C.a2, ls: 3 }) + `<path d="M-60 -50V180" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".25"/>`;
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }


  // ===== 1. «Что вы знаете о никотине?» — лучи и большие листья по краям, полоса въезжает, буквы падают =====
  D.title = (t, S, T) => {
    const kb = E(t, 0, .38, 'o5'), gr = E(t, T.b - .36, .36, 'io');
    let s = BG(C.bg) + rays(540, CY - 30, 20, C.bg2, t * 9) + motes(t, MOT, 12);
    s += g(leafT({ len: 980, w: 340, c: C.ink, f: C.bg3, f2: C.bg2, ow: 6, vw: 4, dots: false }), at(-80 + bob(t, 14, .3), 1760, 1, 36 + bob(t, 3, .4)));
    s += g(leafT({ len: 820, w: 300, c: C.ink, f: C.bg3, f2: C.bg2, ow: 6, vw: 4, dots: false }), at(1180 - bob(t, 14, .35), 420, 1, -146 + bob(t, 3, .5)));
    const bh = lerp(440, 2000, gr), by = lerp(CY - 230, -40, gr);
    s += sh(D_.rr(lerp(-1100, 0, kb), by, 1080, bh, 0), C.paper);
    s += sh(D_.rr(lerp(-1100, 0, kb), by + bh - 12, 1080, 12, 0), C.a1, { op: 1 - gr });
    const ty = CY - 70 - gr * 600;
    s += g(typeCap('Что вы знаете о', 540, ty, t, .1, { c: C.ink, s: 34, ls: 9, d: .35 }) + dropWord('НИКОТИНЕ?', 540, ty + 150, t, .3, { s: 104, c: C.bg }), '', 1 - gr);
    return g(s, drift(t, T, .04))
  };

  // ===== 2. сигарета падает → одноразка → веер одноразок; лучи крутятся; наезд в диод =====
  const GY = 1110, CIGP = D_.tf(D_.rrp(800, 108, 46), 540, GY - 54, 0), VAPEP = D_.tf(D_.rrp(170 * 1.3, 440 * 1.3, 58 * 1.3), 540, GY - 286, 0);
  D.common = (t, S, T) => {
    const tc = T.c('сигарет') - .25, tv = T.c('одноразк') - .28;
    let s = BG(C.paper) + rays(540, 800, 16, C.paper2, -t * 12) + sh(D_.circ(540, 800, 300), C.paper);
    s += line('M60 1110H1020', E(t, T.a, .5, 'o5'), { c: C.ink, w: 7 });
    const kf = P01(t, tc, .38), km = E(t, tv, .45, 'io');
    if (kf > 0 && km <= 0) {
      cue(tc + .38, 'thud', .8);
      const y = lerp(-300, GY - 54, EZ.i(kf)), sq = squash(t, tc + .38, .25);
      s += puffs(150, GY - 6, t, tc + .38, { c: C.paper2, n: 4, sp: 34, r: 26 }) + puffs(930, GY - 6, t, tc + .38, { c: C.paper2, n: 4, sp: 34, r: 26 });
      s += g(cigarette(t, { len: 800, h: 108, r: (1 - kf) * -20, c: C.ink }), `translate(540 ${R(y + 54)}) scale(${R(1 / sq * 1000) / 1000} ${R(sq * 1000) / 1000}) translate(0 -54)`);
      if (kf >= 1) s += curl(936, GY - 70, t, 220, C.ink, 6);
    }
    if (km > 0 && km < 1) { cue(tv, 'morph', .7); const col = km < .5 ? '#FFFFFF' : C.mango; s += g(sh(morph(CIGP, VAPEP, km), col, { c: C.ink, w: 7 }), about(540, GY - 286, 1 + Math.sin(km * PI) * .08, km * 360)) }
    if (km >= 1) {
      const sideT = tv + .5;
      const cols = [['#7FC48A', '#5FA86C', 'МЯТА'], ['#E2574C', '#C2433A', 'ЯГОДА'], ['#5B8DEF', '#3F6FD0', 'ЧЕРНИКА'], ['#B98BEF', '#9466D6', 'ВИНОГРАД']];
      [[140, 0, -16], [320, 1, -8], [760, 2, 8], [940, 3, 16]].forEach(([x, i, r], j) => { s += pop(vape(t, { f: cols[i][0], f2: cols[i][1], label: cols[i][2], fruit: false, c: C.ink, s: 1 }), x, GY - 175 + Math.abs(r) * 2, t, sideT + j * .08, { s: .7, dy: 120, r, r0: r * -1.5 }) });
      s += g(vape(t, { c: C.ink }), at(540, GY - 286, 1.3 * squash(t, tv + .45, .14)));
      s += puffs(430, GY - 6, t, tv + .45, { c: C.paper2, n: 3, sp: 30, r: 22 }) + puffs(650, GY - 6, t, tv + .45, { c: C.paper2, n: 3, sp: 30, r: 22 });
    }
    return g(s, drift(t, T, .05, 540, 900))
  };

  // ===== 3. «в Евросоюзе никотином запрещено травить даже тлю»: тля внизу с первого кадра, сверху — ЕС, яд, запрет =====
  D.claim = (t, S, T) => {
    const te = T.c('Евросоюз') - .15, tn = T.c('никотином') - .15, tb = T.c('запрещено') - .1, ta = T.c('даже') - .1, tl = T.c('тлю') - .1;
    const up = E(t, ta, .6, 'io5');
    let s = BG(C.bg2) + rays(540, 470, 24, C.bg3, t * 7) + motes(t, MOT, 10);
    // верх: звёзды ЕС, флакон, знак запрета
    let grp = '';
    const ke = P01(t, te, .8);
    if (ke > 0) { grp += g(euDisc(0, 0, 250, EZ.o(ke), { f: C.eu, sc: C.star }), at(0, 0, EZ.back(clamp(ke * 2.2)))); cue(te, 'whoosh', .5) }
    grp += pop(spray(t, { c: C.ink, mist: P01(t, tn + .45, .8) }), 0, 30, t, tn, { s: .55, dy: 120, r0: 14 });
    const kb = P01(t, tb, .4);
    if (kb > 0) { grp += banSign(0, 10, 150, { s: lerp(2.2, 1, EZ.back(kb)), op: clamp(kb * 3) }); cue(tb + .15, 'thud', .9) }
    s += g(grp, at(540 + shake(t, tb + .25, 16), lerp(500, 380, up), lerp(1, .78, up)));
    // низ: лист и тля — видны сразу
    const kA = P01(t, T.a, .55), ay = lerp(1560, 1110, EZ.o5(kA)) - up * 60;
    s += g(leafT({ len: 700, w: 260, c: C.ink, ow: 6, vw: 5, dots: false }), at(120, ay + 150, 1, 78));
    s += aphidX(t, { x: 500, y: ay, s: lerp(1.6, 1.95, up), mood: t > tl + .3 ? 'smile' : 'calm', c: C.ink, lid: t > tn && t < ta ? .45 : 0 });
    // тля поднимает глаза на знак
    if (t > tl) s += g(line('M760 1000L850 920H950', E(t, tl + .2, .3, 'o5'), { c: C.paper, w: 5 }) + cap('ТЛЯ', 955, 934, { c: C.paper, s: 40, a: 'start', op: E(t, tl + .3, .3) }), '');
    s += flashF(t, T.a + .03, C.paper);
    return g(s, drift(t, T, .035))
  };

  // ===== 4. «Никотин — оружие табака» (лист → меч), «его делают корни и гонят вверх, в листья» (куст в разрезе) =====
  const ROUTES = ['M-90 200C-50 120 -10 60 0 0L0 -380C40 -420 120 -440 220 -470', 'M20 260C14 160 6 80 0 0L0 -560C-40 -600 -120 -620 -220 -650', 'M120 150C80 90 30 40 0 0L0 -760C30 -790 90 -810 160 -830'];
  function plantRoots(t, x, y, o = {}) {
    let s = sh(D_.rr(x - 1600, y, 3200, 1400, 0), '#4A3424') + sh(D_.rr(x - 1600, y, 3200, 28, 0), '#6B4A33');
    for (let i = 0; i < 40; i++) s += sh(D_.ell(x - 700 + rnd(i) * 1400, y + 60 + rnd(i + 7) * 500, 6 + rnd(i + 3) * 10, 4 + rnd(i + 5) * 6), '#3A281B');
    for (let i = 0; i < 9; i++) { const gx = x - 640 + i * 160; s += line(`M${gx} ${y}l-14 -40M${gx} ${y}l4 -52M${gx} ${y}l18 -38`, 1, { c: C.a3, w: 6 }) }
    s += tobaccoPlant(t, { x, y, h: 1000, roots: o.roots ?? 1, c: C.ink, rc: '#E8C9A0', sway: 2, leaves: [[.28, -64, 1.05], [.44, 60, 1], [.6, -60, .85], [.76, 58, .7], [.88, -52, .5]] });
    if (o.flow != null) for (let i = 0; i < 12; i++) {
      const p = (o.flow + i / 12) % 1, route = ROUTES[i % 3], P0 = pts(route, 80)[Math.min(79, Math.floor(p * 79))], k = p > .9 ? 1 - (p - .9) / .1 : Math.min(1, p / .06);
      s += molIcon(x + P0[0], y + P0[1], .3 * k, C.a1, C.ink);
    }
    return s
  }
  D.leaf = (t, S, T) => {
    const tw0 = T.c('оружие') - .2, kw = E(t, tw0, .55, 'io5'), tt = T.c('табака'), tr = T.c('корни') - .45, tu = T.c('вверх') - .25;
    const ex = E(t, tr, .6, 'io5');
    let s = BG(C.bg) + motes(t, MOT, 10);
    if (ex < 1) {
      let A = rays(560, CY - 120, 18, C.bg2, t * 10) + sh(D_.circ(560, CY - 60, 400), C.bg2);
      let L0 = leafT({ len: 860, w: 300, k: E(t, T.a, .9, 'o5'), c: C.line, vc: C.line });
      const kh = P01(t, tw0 + .3, .45);
      if (kh > 0) {
        cue(tw0 + .3, 'shing', .9);
        let hilt = sh(D_.rr(-34, 0, 68, 190, 16), C.wood2, { c: C.line, w: 6 }) + line('M-34 40L34 70M-34 90L34 120M-34 140L34 170', 1, { c: C.line, w: 4, op: .6 });
        hilt += sh(D_.rr(-170, -26, 340, 52, 26), C.a1, { c: C.line, w: 6 }) + sh(D_.circ(0, 222, 38), C.a1, { c: C.line, w: 6 });
        L0 += g(hilt, at(0, 10, EZ.back(kh)));
        const ks = P01(t, tw0 + .55, .5);
        if (ks > 0 && ks < 1) L0 += clip(leafPath(860, 300), sh(D_.poly([[-400, 0], [-300, 0], [400, -900], [300, -900]]), '#FFFFFF', { op: .55, tr: `translate(0 ${R(lerp(300, -1000, ks))})` }));
      }
      A += g(L0, at(lerp(400, 540, kw), 1180 - (kh > 0 ? 180 * EZ.io(kh) : 0), 1, lerp(32, 0, kw)));
      A += cap('Nicotiana tabacum', 540, 300, { c: C.a1, s: 32, op: E(t, tt, .4) });
      s += g(A, `translate(0 ${R(-1700 * ex)})`);
    }
    if (ex > 0) {
      const up = E(t, tu, 1.3, 'io'), camY = lerp(1560, 860, up), z = lerp(1.2, .82, up);
      const W0 = plantRoots(t, 540, 1300, { roots: E(t, tr + .4, .7, 'o5'), flow: t > tr + .5 ? (t - tr - .5) * .42 : null });
      s += g(W0, `translate(0 ${R(1700 * (1 - ex))}) translate(540 ${CY}) scale(${R(z * 1000) / 1000}) translate(-540 ${R(-camY)})`);
      s += g(pill('КОРНИ', 0, 0, { f: C.a1, tc: C.ink, s: 50 }), at(820, 1040 + 1700 * (1 - ex) - up * 420, 1, -6), clamp((t - tr - .6) * 4) * (1 - up));
      if (up > .2) s += pop(pill('ЛИСТЬЯ', 0, 0, { f: C.a3, tc: C.ink, s: 50 }), 290, 380, t, tu + .5, { r: 6 });
    }
    return g(s, drift(t, T, .03))
  };

  // ===== 5. жук кусает лист → молнии по нервам → замирает → на спину =====
  D.bite = (t, S, T) => {
    const tb = T.c(L('bites', 'кусает')) - .1, tz = T.c(L('nerves', 'нервам')) - .2, tf = T.c(L('freezes', 'замирает')) - .1;
    let s = BG(C.bg3) + motes(t, MOT, 8);
    const edge = 'M-200 1000Q540 966 1280 1014L1280 2200L-200 2200Z';
    let leafS = sh(edge, C.leaf) + sh('M520 982Q900 970 1280 1014L1280 2200L700 2200Z', C.leaf2) + line('M-200 1300Q300 1150 1280 1240M200 930Q260 1100 120 1400M700 912Q760 1100 900 1500', 1, { c: C.ink, w: 5, op: .35 }) + line(edge, 1, { c: C.ink, w: 7 });
    const kb = P01(t, tb + .2, .35), nb = kb > 0 ? 58 * EZ.back(kb) : 0, nb2 = P01(t, tb + .6, .3) > 0 ? 40 * EZ.back(P01(t, tb + .6, .3)) : 0;
    if (nb > 0) leafS = cut(leafS, [[770, 984, nb * 1.4], [828, 982, nb2 * 1.4]]);
    s += leafS;
    // крошки
    for (let i = 0; i < 6; i++) { const k = P01(t, tb + .25 + (i % 2) * .4, .6); if (k > 0 && k < 1) s += sh(D_.circ(780 + (i - 3) * 30 * k + 60 * k, 950 - 220 * k + 420 * k * k, 13), C.leaf, { c: C.ink, w: 4, op: 1 - k }) }
    const walk = P01(t, T.a, tb - T.a + .05), bx = lerp(-400, 430, EZ.o(walk)), fr = P01(t, tf, .25), back = P01(t, T.e - .5, .45);
    const ch = t > tb && t < tb + 1 ? (Math.sin((t - tb) * 13) * .5 + .5) : 0, zp = t > tz && t < tf ? 1 : 0;
    s += beetle(t, { x: bx + shake(t, tz, 14, .9, 60), y: 958, s: 1.75, walk: walk < 1 && fr <= 0, chomp: ch, zap: zp, stiff: fr, c: C.ink, f: fr > 0 ? '#7E9A8D' : '#2E7D5B', f2: fr > 0 ? '#5E7A6D' : '#1F5A41', dead: back > .5, back: EZ.io(back) });
    if (fr > 0) s += pop(g(sh(D_.rr(-50, -64, 34, 128, 10), C.paper) + sh(D_.rr(16, -64, 34, 128, 10), C.paper)), bx + 30, 560, t, tf, { s: 1, out: T.e - .55 });
    return g(s, about(600, 900, 1 + .06 * EZ.io(P01(t, T.a, 2.4)) + .08 * E(t, tf, .3, 'o5')))
  };

  // ===== 6. «А табак в ответ делает никотина ещё больше»: листья наливаются янтарём, корни качают быстрее =====
  D.reply = (t, S, T) => {
    const ta = T.c('ответ') - .2, tb = T.c('больше') - .25;
    const rate = t2 => .3 * t2 + 1.1 * Math.max(0, t2 - ta) + .4 * Math.max(0, t2 - tb);
    let s = BG(C.bg3) + rays(540, 500, 22, C.bg2, -t * 8);
    const x = 540, y = 1180, h = 900, lv = E(t, ta + .2, 1.6, 'io');
    let w = sh(D_.rr(-600, y, 2280, 900, 0), '#4A3424') + sh(D_.rr(-600, y, 2280, 26, 0), '#6B4A33');
    w += tobaccoPlant(t, { x, y, h, roots: 1, c: C.ink, rc: '#E8C9A0', sway: 3, flowers: true, leaves: [] });
    // листья: янтарь поднимается от основания к кончику
    [[.3, -62, 1.1], [.46, 60, 1], [.62, -58, .85], [.78, 56, .66]].forEach(([u, a, sc], i) => {
      const len = 420 * sc, wd = 160 * sc, lp = leafPath(len, wd), lvl = clamp(lv * 1.25 - i * .08) * .82;
      let L1 = leafT({ len, w: wd, c: C.ink, ow: 5, vw: 3, dots: false, k: 0 });
      if (lvl > 0) L1 += clip(lp, sh(D_.wave(-wd, wd, -len * lvl, 10, 70, t * 6 + i, 8) + `L${wd} 20L${-wd} 20Z`, C.a1));
      L1 += line(`M0 -6Q${R(wd * .06)} ${R(-len * .5)} 0 ${R(-len * .96)}`, 1, { c: C.ink, w: 3, op: .6 }) + line(lp, 1, { c: C.ink, w: 5 });
      w += g(L1, at(x + Math.sin(t * 1.3) * 3 * u * 10, y - h * u, 1 + .06 * Math.sin(clamp((t - tb - i * .1) / .4) * PI), a + Math.sin(t * 1.6 + i) * 3));
    });
    for (let i = 0; i < 16; i++) {
      const p = (rate(t) + i / 16) % 1, route = ROUTES[i % 3], P0 = pts(route, 80)[Math.min(79, Math.floor(p * 79))], k = p > .9 ? 1 - (p - .9) / .1 : Math.min(1, p / .06);
      w += molIcon(x + P0[0] * .9, y + P0[1] * .9, .28 * k, C.a1, C.ink);
    }
    // жук лежит на спине у корня — из прошлой сцены
    w += beetle(t, { x: 820, y: y - 6, s: .55, back: 1, dead: true, stiff: 1, c: C.ink, f: '#7E9A8D', f2: '#5E7A6D' });
    s += g(w, drift(t, T, .05, 540, 900));
    s += pop(g(sh('M0 -70L50 -10H22V60H-22V-10H-50Z', C.a1, { c: C.ink, w: 6 })), 900, 520, t, tb, { r0: 20 }) + pop(g(sh('M0 -70L50 -10H22V60H-22V-10H-50Z', C.a1, { c: C.ink, w: 6 })), 980, 640, t, tb + .12, { s: .7, r0: 20 });
    s += pop(pill('НИКОТИН', 0, 0, { f: C.a1, tc: C.ink, s: 44 }), 300, 420, t, ta + .3, { r: -6 });
    return s
  };

  // ===== 6. «к 1690 году»: год откатывается назад, табачная вода =====
  const YR = (t, from, to, t0, d) => odo(lerp(from, to, E(t, t0, d, 'io')), 540, 400, { s: 150, c: C.ink, sep: '' });
  D.y1690 = (t, S, T) => {
    const ty = T.c('1690') - .2, tn = T.c(L('noticed', 'заметили')) - .2;
    let s = BG(C.paper) + corner(C.paper2, 1);
    s += YR(t, 2026, 1690, T.a + .1, ty - T.a + .5);
    s += line('M200 1180H880', 1, { c: C.ink, w: 7 });
    const kw = E(t, tn + .3, 1.0, 'io'), wcol = kw < 1 ? `rgb(${R(lerp(91, 138, kw))},${R(lerp(141, 92, kw))},${R(lerp(239, 46, kw))})` : '#8A5C2E';
    s += bucket({ x: 540, y: 1010, s: 1, water: wcol, leaves: E(t, tn + .25, .4, 'o5') });
    const kh = P01(t, tn - .1, .7);
    if (kh > 0 && kh < 1) s += lace({ x: lerp(-120, 360, Math.sin(EZ.io(kh) * Math.PI) ), y: lerp(780, 830, Math.sin(kh * Math.PI)), s: 1.1, r: 20 });
    for (let i = 0; i < 3; i++) s += ringWave(540 + (i - 1) * 60, 840, t, tn + .4 + i * .15, { c: C.ink, r0: 10, r1: 90, w: 5 });
    s += cap(L('tobacco water', 'табачная вода'), 540, 1260, { c: C.brown, s: 32, op: E(t, ty + .4, .4) });
    return g(s, drift(t, T, .04))
  };

  const GX0 = 300;
  function garden(t, T, camx, yr, pour, kill, extra = '') {
    let s = BG(C.paper2) + corner('#D9C9A6', 1);
    let w = bed(t, GX0, kill, { aphid: 3 });
    w += extra;
    s += g(g(w, `translate(${R(-camx)} 0)`), about(540, 1000, 1.12));
    s += yr;
    return s
  }
  D.garden = (t, S, T) => {
    const t3 = T.c(L('three', 'триста')) - .2;
    const camx = lerp(0, 700, E(t, T.a, T.b - T.a + .8, 'io'));
    const pourX = GX0 + 160 + camx * .95, kill = [0, 1, 2, 3, 4, 5].map(i => T.a + .5 + i * .45);
    const can = wcan({ x: pourX - 200, y: 640, s: .9, r: 24 }) + drops(pourX + 90, 640 - 40, t, 1);
    let s = garden(t, T, camx, YR(t, 1690, 1990, t3, T.b - t3 + .6), 1, kill, can);
    s += pop(pill(L('+300 YEARS', '+300 ЛЕТ'), 0, 0, { f: C.a2, s: 44 }), 540, 560, t, T.c(L('years', 'лет')) - .1, { r0: 10 });
    return s
  };

  D.ban = (t, S, T) => {
    const tY = T.c('2009') - .2, tE = T.c(L('EU', 'Евросоюз')) - .25, tB = T.c(L('banned', 'запретил')) - .12;
    const camx = 700 + 120 * E(t, T.a, 2, 'io');
    const pourX = GX0 + 160 + 700 * .95, hit = P01(t, tE + .45, .7), kill = [0, 1, 2, 3, 4, 5].map(() => -5);
    const cy0 = 640 - Math.sin(hit * Math.PI) * 260 + EZ.i(clamp((hit - .5) * 2)) * 900;
    const can = wcan({ x: pourX - 200 + hit * 300, y: cy0, s: .9, r: 24 + hit * 220, op: 1 - clamp((hit - .8) * 5) }) + drops(pourX + 90, 600, t, 1 - clamp(hit * 4));
    const rollX = lerp(1500, pourX + 40, EZ.o(P01(t, tE, .5))) + hit * 120;
    const disc = P01(t, tE, .1) > 0 ? euDisc(rollX, 860, 150, 1, { f: C.eu, sc: C.star, rot: -lerp(0, 420, EZ.o(P01(t, tE, .5))) }) : '';
    let s = garden(t, T, camx, YR(t, 1990, 2009, tY - .3, .7), 1 - hit, kill, can + disc);
    s += stamp(L('BANNED', 'ЗАПРЕЩЕНО'), 540, 760, t, tB, { c: C.a2, s: 92, r: -12 });
    return g(s, `translate(${R(shake(t, tB + .1, 18))} 0)`)
  };

  // ===== 9. «Тля выдохнула» =====
  D.aphid = (t, S, T) => {
    const tx0 = T.c(L('exhaled', 'выдохнула')) - .1, kp = P01(t, tx0, .8);
    let s = BG('#CFE6B5') + sh(D_.circ(540, CY, 420), '#BEDDA0') + corner('#B3D48F', 1);
    s += g(leafT({ len: 900, w: 340, c: C.ink, ow: 6, vw: 5, f: '#8CC66A', f2: '#6FAF55', dots: false }), at(300, 1500, 1, 62));
    s += aphid(t, { x: 520, y: 980, s: 2.6, mood: kp > .05 ? 'relief' : 'calm', puff: kp > 0 && kp < 1 ? kp : 0, sweat: P01(t, tx0 + .2, .7), c: C.ink });
    return g(s, drift(t, T, .08, 560, 900))
  };

  // ===== 11. «А вы выдыхаете до сих пор. Облаком со вкусом манго»: профиль с лицом, облако становится манго =====
  const CL = 'M-170 40C-210 40 -220 -20 -176 -34C-184 -94 -110 -118 -70 -84C-50 -140 40 -140 62 -84C110 -110 176 -70 160 -20C210 -10 206 40 160 40Z';
  const MG = 'M-90 10C-100 -60 -20 -96 40 -80C100 -64 120 0 90 40C60 84 -10 90 -50 70C-76 58 -86 38 -90 10Z';
  D.exhale = (t, S, T) => {
    const tv = T.c('выдыхаете') - .2, tc = T.c('облаком') - .15, tm = T.c('манго') - .2;
    let s = BG(C.bg) + rays(760, 720, 20, C.bg2, t * 9) + sh(D_.circ(760, 720, 330), C.bg2) + motes(t, MOT, 10);
    const kc = P01(t, tv + .1, 1.4), kg = E(t, tc, .5, 'back'), km = E(t, tm, .5, 'io');
    if (kc > 0 && kc < .3) cue(tv + .1, 'puff', .8);
    s += face2(t, { x: 210, y: 880, s: 1.45, puff: kc > 0 && kc < .7 ? Math.sin(kc / .7 * PI) : 0, relax: kc > .2 && kc < .8, c: C.ink });
    const cx = lerp(560, 760, EZ.o(kc)), cyy = lerp(1060, 720, EZ.o(kc)), cs = lerp(.25, 1.2, EZ.o(kc)) + kg * .35;
    // маленькие облачка-«колечки» по пути
    for (let i = 0; i < 3; i++) { const k = P01(t, tv + .2 + i * .25, 1.1); if (k > 0 && k < 1) s += g(cloud(0, 0, 1, { c: C.ink, w: 9 }), at(lerp(560, 960 - i * 90, EZ.o(k)), lerp(1060, 980 - i * 260, EZ.o(k)), .22 * (1 - k * .5)), 1) }
    if (kc > 0) {
      if (km < 1) s += g(sh(km > 0 ? morph(CL, MG, km) : CL, km > .5 ? C.mango : '#FFFFFF', { c: C.ink, w: 6 / cs * 1.2 }), at(cx, cyy, cs + km * .9, km * 20));
      else s += mango(cx, cyy, 2.4 * squash(t, tm + .5, .12), { c: C.ink });
    }
    if (km > 0) cue(tm, 'morph', .7);
    if (km >= 1) s += burst(cx, cyy, t, tm + .5, { c: C.a1, r0: 260, r1: 420, n: 12 });
    return g(s, drift(t, T, .04))
  };

  // ===== 12. «В мозге у вас такие же рецепторы, как у жука. Они так и называются — никотиновые» =====
  function cupCirc(t, x, y, r, tDock, col) {
    let s = sh(D_.circ(x, y, r), '#F4C7D2', { c: C.ink, w: 7 });
    const k = P01(t, tDock, .5);
    s += clip(D_.circ(x, y, r - 4), sh(`M${x - r} ${y + 30}Q${x - r / 2} ${y + 10} ${x} ${y + 30}T${x + r} ${y + 30}V${y + r}H${x - r}Z`, '#E89BB0') + sh(`M${x - 60} ${y + 20}C${x - 60} ${y + 110} ${x + 60} ${y + 110} ${x + 60} ${y + 20}L${x + 34} ${y + 20}C${x + 34} ${y + 76} ${x - 34} ${y + 76} ${x - 34} ${y + 20}Z`, C.a1, { c: C.ink, w: 5 }) + molecule(t, { x: x - 6, y: lerp(y - r - 60, y + 6, EZ.o5(k)), s: .42, f: col, f2: '#B83A32', c: C.ink, face: false, rot: (1 - k) * 200 }));
    if (k >= 1) s += ringWave(x, y + 20, t, tDock + .5, { c: C.paper, r0: 20, r1: r, w: 5 });
    return s
  }
  D.recep = (t, S, T) => {
    const tb = T.c('мозге') - .25, tj = T.c('жука') - .2, tn = T.c('никотиновые') - .15;
    let s = BG(C.bg2) + rays(540, 900, 20, C.bg3, t * 6) + motes(t, MOT, 8);
    // мозг слева, жук справа, «=» между, над каждым — один и тот же рецептор в кругу
    s += pop(brainF(t, { c: C.ink, face: { mood: 'calm', look: .4 } }), 280, 1040, t, T.a, { s: 1.38 });
    s += pop(beetle(t, { c: C.ink, look: true }), 780, 1120, t, tj, { s: 1.2 });
    s += pop(tx('=', 0, 0, { f: 'O', w: 700, s: 170, c: C.a1 }), 570, 1100, t, tj + .25, {});
    const kL = P01(t, tb + .3, .5), kR = P01(t, tj + .3, .5);
    if (kL > 0) s += line('M300 930L290 790', EZ.o(kL), { c: C.paper, w: 6 }) + g(cupCirc(t, 0, 0, 160, tb + .6, C.a2), at(290, 600, 1.2 * EZ.back(kL)));
    if (kR > 0) s += line('M880 1000L800 790', EZ.o(kR), { c: C.paper, w: 6 }) + g(cupCirc(t, 0, 0, 160, tj + .6, C.a2), at(800, 600, 1.2 * EZ.back(kR)));
    const kt = P01(t, tn, .6);
    if (kt > 0) s += g(sh(D_.rr(-280, -58, 560, 116, 58), C.a2, { c: C.paper, w: 5 }) + tx('НИКОТИНОВЫЕ', 0, 22, { f: 'O', w: 700, s: 58, c: C.paper, ls: 3 }), at(540, 300, EZ.back(kt), Math.sin((t - tn) * 7) * 10 * (1 - EZ.o(kt))));
    if (kt > 0) cue(tn, 'ding', .7);
    return g(s, drift(t, T, .04))
  };

  // ===== 12. секундомер 0 → 10 с, точка бежит от одноразки к мозгу =====
  D.ten = (t, S, T) => {
    const tp = T.c(L('puff', 'затяжка')) - .15, t10 = T.c('10') - .1, tth = T.c(L('there', 'там')) - .1;
    let s = BG(C.paper) + corner(C.paper2, 1, 1080, 0, 0, 900);
    const run = E(t, tp + .2, tth - tp - .2, 'io');
    s += stopwatch(540, 640, 10 * run, { r: 250, c: C.ink, f: '#FFFFFF', face: C.paper, fill: C.a1, hand: C.a2, unit: ' с' });
    const path = 'M190 1120C260 900 420 1180 560 1050S860 960 890 1100';
    s += dotted(path, E(t, tp, .6, 'o5'), C.ink, 7, 22);
    const p = pts(path, 120)[Math.min(119, Math.floor(run * 119))];
    s += pop(vape(t, { c: C.ink }), 180, 1180, t, T.a, { s: .38 }) + (P01(t, tp, .6) > 0 && P01(t, tp, .6) < 1 ? g(cloud(0, 0, 1, { c: C.ink, w: 8 }), at(240, 1040 - 40 * P01(t, tp, .6), .32 * EZ.o(P01(t, tp, .6)))) : '');
    s += pop(brainF(t, { c: C.ink, face: { mood: run >= 1 ? 'happy' : 'calm' } }), 900, 1150, t, T.a + .1, { s: .5 });
    if (run > 0 && run < 1) s += sh(D_.circ(p[0], p[1], 16), C.a2, { c: C.ink, w: 5 });
    s += ringWave(900, 1150, t, tth, { c: C.a2, r1: 260 });
    return g(s, drift(t, T, .04))
  };

  // ===== 13. дофамин: капли падают в мозг, мозг рад; полароид с одноразкой прикалывается =====
  D.dopa = (t, S, T) => {
    const td = T.c(L('dopamine', 'дофамина')) - .2, tm = T.c(L('remembers', 'запоминает')) - .15;
    let s = BG(C.bg) + sh(D_.circ(540, CY, 430), C.bg2) + motes(t, MOT, 8);
    const kd = P01(t, td, 1.6);
    for (let i = 0; i < 9; i++) { const ph = clamp((t - td - i * .12) / .7); if (ph > 0 && ph < 1) s += sh(D_.drop(330 + (i % 5) * 100 + (i > 4 ? 50 : 0), lerp(220, 640, EZ.i(ph)), 30), C.star, { c: C.ink, w: 5 }) }
    const hap = kd > .25;
    s += g(brainF(t, { c: C.ink, face: { mood: hap ? 'happy' : 'calm' } }), at(540, 860 + bob(t, 6, .8), 2.3 * squash(t, td + .4, .1)));
    const kp = P01(t, tm, .55);
    if (kp > 0) {
      const pol = sh(D_.rr(-120, -140, 240, 280, 10), '#FFFFFF', { c: C.ink, w: 6 }) + sh(D_.rr(-96, -116, 192, 180, 4), C.bg2) + g(vape(t, { c: C.ink, label: false }), at(0, -26, .32)) + tx(L('mango = good', 'манго = хорошо'), 0, 112, { f: 'M', w: 800, s: 26, c: C.ink });
      s += g(pol, at(lerp(1200, 700, EZ.o5(kp)), lerp(300, 640, EZ.o5(kp)), 1, lerp(30, 9, EZ.back(kp))));
      s += pop(sh(D_.circ(0, 0, 18), C.a2, { c: C.ink, w: 5 }) + sh(D_.circ(-5, -5, 5), '#fff'), 690, 516, t, tm + .5, { s: 1 });
    }
    return g(s, drift(t, T, .04))
  };

  // ===== 15. «А дальше как с табаком: чем чаще затяжки, тем больше в мозге рецепторов» =====
  const RCP = [[420, 640], [610, 610], [520, 760], [700, 760], [380, 820], [600, 900], [460, 560], [760, 650], [330, 700], [690, 880], [520, 860], [420, 940], [800, 800], [560, 660], [640, 520], [360, 900]];
  const cupMini = (x, y, s0, op = 1) => g(sh('M-22 0C-22 32 22 32 22 0L13 0C13 20 -13 20 -13 0Z', C.a1, { c: C.ink, w: 4 }), at(x, y, s0), op);
  D.grow = (t, S, T) => {
    const tt = T.c('табаком') - .25, tz = T.c('затяжки') - .2, tb = T.c('больше') - .2;
    let s = BG(C.bg) + rays(600, 760, 22, C.bg2, t * 8);
    // слева вверху — куст из 6-й сцены, листья в янтаре, стрелка вверх
    const kp = P01(t, tt, .5);
    if (kp > 0) s += g(sh(D_.circ(0, 0, 170), C.bg3, { c: C.paper, w: 5 }) + clip(D_.circ(0, 0, 166), g(leafT({ len: 300, w: 120, c: C.ink, ow: 5, vw: 3, dots: false }) + clip(leafPath(300, 120), sh(D_.rr(-140, -200, 280, 220, 0), C.a1)) + line(leafPath(300, 120), 1, { c: C.ink, w: 5 }), at(-20, 120, 1, 10))) + sh('M110 -40L150 0H128V60H92V0H70Z', C.a1, { c: C.ink, w: 5 }), at(210, 360, EZ.back(kp)));
    // мозг крупно; рецепторы появляются волнами — на каждую затяжку
    s += g(brainF(t, { c: C.ink, face: { mood: 'calm', look: -.3 } }), at(600, 780, 2.25));
    const waves = [tz, tz + .55, tz + 1.1, tb + .1];
    RCP.forEach((p, i) => { const w0 = waves[Math.min(3, Math.floor(i / 4))], k = P01(t, w0 + (i % 4) * .06, .35); if (k > 0) { s += cupMini(p[0] + 60, p[1] + 20, 1.3 * EZ.back(k)); if (i % 4 === 0) cue(w0, 'pop', .6) } });
    // затяжки — облачка снизу
    for (let i = 0; i < 3; i++) { const k = P01(t, tz + i * .55, .5); if (k > 0 && k < 1) s += g(cloud(0, 0, 1, { c: C.ink, w: 8 }), at(820, lerp(1220, 1080, EZ.o(k)), .3 * EZ.back(k) * (1 - EZ.i(k) * .4)), 1) }
    s += pop(vape(t, { c: C.ink, s: 1 }), 900, 1180, t, T.a + .1, { s: .34, r: 12 });
    return g(s, drift(t, T, .05, 600, 800))
  };

  // ===== 16. «И каждый просит ещё»: из каждого рецептора — «ещё!» =====
  D.more = (t, S, T) => {
    const tm = T.c('каждый') - .15;
    let s = BG(C.bg) + rays(600, 760, 22, C.bg2, t * 8 + 30);
    s += g(brainF(t, { c: C.ink, face: { mood: 'want', look: -.3 } }), at(600 + shake(t, tm + .3, 10, .7), 780, 2.25 * squash(t, tm + .3, .06)));
    RCP.forEach((p, i) => { s += cupMini(p[0] + 60, p[1] + 20, 1.3) });
    const B = [[230, 380, -8, .8], [820, 330, 6, .9], [540, 260, -2, 1], [150, 700, -10, .7], [930, 620, 8, .75], [300, 1130, -6, .7], [860, 1120, 6, .8], [560, 1230, 0, .65]];
    B.forEach(([x, y, r, sc], i) => { s += pop(bubble('ЕЩЁ!', 0, 0, { s: 54, c: C.ink }), x, y, t, tm + .1 + i * .07, { r, s: sc, snd: i % 2 ? false : 'pop' }) });
    return g(s, drift(t, T, .07, 600, 800))
  };

  // ===== 17. «Так оружие табака переехало к вам в карман»: меч из 4-й сцены → одноразка → в карман =====
  const SWD = leafPath(860, 300), VP2 = D_.tf(D_.rrp(170, 440, 58), 0, -430, 0);
  D.pocket = (t, S, T) => {
    const tw0 = T.c('оружие') - .2, tm = T.c('переехало') - .2, tp = T.c('карман') - .4;
    let s = BG(C.bg2) + rays(540, 700, 18, C.bg3, t * 9) + motes(t, MOT, 8);
    const km = E(t, tm, .5, 'io'), kp = E(t, tm + .45, tp - tm + .2, 'io5');
    const jy = lerp(2100, 960, kp);
    s += jeans(jy);
    const vy = lerp(1180, jy + 560, kp), sc = lerp(.75, .55, kp);
    let obj;
    if (km <= 0) {
      obj = leafT({ len: 860, w: 300, c: C.line, vc: C.line }) + sh(D_.rr(-34, 10, 68, 190, 16), C.wood2, { c: C.line, w: 6 }) + sh(D_.rr(-170, -16, 340, 52, 26), C.a1, { c: C.line, w: 6 }) + sh(D_.circ(0, 232, 38), C.a1, { c: C.line, w: 6 });
      obj = g(obj, about(0, -300, 1 + .03 * Math.sin(t * 6)));
    } else if (km < 1) { cue(tm, 'morph', .7); obj = sh(morph(SWD, VP2, km), km < .5 ? C.leaf : C.mango, { c: C.ink, w: 7 }) }
    else obj = g(vape(t, { c: C.ink }), at(0, -430, 1));
    const O = g(obj, at(540, vy, sc, (1 - km) * 8));
    s += kp > 0 ? clip(`M-400 -2000H1480V${jy}H-400Z`, O) : O;
    s += sh(`M240 ${jy}C240 ${jy + 380} 300 ${jy + 520} 540 ${jy + 600}C780 ${jy + 520} 840 ${jy + 380} 840 ${jy}Z`, C.denim2) + line(`M240 ${jy}C240 ${jy + 380} 300 ${jy + 520} 540 ${jy + 600}C780 ${jy + 520} 840 ${jy + 380} 840 ${jy}`, 1, { c: C.a1, w: 6, da: '18 14' });
    if (kp > .98) cue(tp + .2, 'thud', .6);
    return g(s, drift(t, T, .03))
  };

  // ===== 18. 7 миллионов в год: камера отъезжает от лиц к огромной толпе =====
  D.toll = (t, S, T) => {
    const t7 = T.c('7') - .2, z = lerp(2.3, .62, E(t, T.a, T.b - T.a + .3, 'io'));
    let s = BG('#0B1512');
    const cols = 15, rows = 22;
    let w = '';
    for (let r = 0; r < rows; r++) for (let c0 = 0; c0 < cols; c0++) {
      const i = r * cols + c0, x = c0 * 92 - (cols - 1) * 46, y = r * 104 - (rows - 1) * 52, dd = Math.hypot(x, y), k = P01(t, T.a + dd / 2600, .35), dead = t > t7 + .3 + rnd(i) * 1.8 && rnd(i + 9) < .45;
      if (k > 0) w += g(person1(0, 0, 1, dead ? '#4A2A28' : C.paper), at(x, y, .9 * EZ.back(k)));
    }
    s += g(w, `translate(540 ${CY - 40}) scale(${R(z * 1000) / 1000})`);
    s += sh(D_.rr(0, 1110, 1080, 220, 0), '#0B1512');
    s += g(odo(7000000 * E(t, t7, 1.1, 'o5'), 540, 1260, { s: 130, c: C.a2, post: '+', sep: ' ' }), '', E(t, t7 - .25, .3));
    if (t > t7) cue(t7, 'count', .6);
    return s
  };

  // ===== 19. «Признайтесь…»: карман, диод мигает, рука тянется — и замирает =====
  D.end = (t, S, T) => {
    const tz = T.c('затянуться') - .1, jy = 820;
    let s = BG(C.bg2) + motes(t, MOT, 8) + jeans(jy);
    s += clip(`M-400 -2000H1480V${jy}H-400Z`, g(vape(t, { c: C.ink }), at(540, jy - 10 + bob(t, 3, .7), .6, -6)));
    s += sh(`M240 ${jy}C240 ${jy + 380} 300 ${jy + 520} 540 ${jy + 600}C780 ${jy + 520} 840 ${jy + 380} 840 ${jy}Z`, C.denim2) + line(`M240 ${jy}C240 ${jy + 380} 300 ${jy + 520} 540 ${jy + 600}C780 ${jy + 520} 840 ${jy + 380} 840 ${jy}`, 1, { c: C.a1, w: 6, da: '18 14' });
    // рука тянется справа и замирает у кармана
    const kh = E(t, T.v + .2, tz - T.v + .2, 'io'), hx = lerp(1400, 790, kh) + (t > tz ? Math.sin(t * 40) * 4 : 0), hy = lerp(560, 640, kh);
    const fing = 'M-150 -24L-232 -40M-156 0L-246 -2M-150 22L-232 30M-128 40L-196 62';
    s += g(sh(D_.rr(0, -62, 700, 124, 50), '#E2574C', { c: C.ink, w: 7 }) + sh(D_.rr(-26, -60, 50, 120, 20), '#F2ECDD', { c: C.ink, w: 6 }) + sh('M-20 -56C-80 -64 -140 -50 -164 -12C-180 24 -150 52 -110 52C-70 52 -50 58 -20 58Z', C.skin, { c: C.ink, w: 7 }) + line(fing, 1, { c: C.ink, w: 34 }) + line(fing, 1, { c: C.skin, w: 20 }), at(hx, hy, 1.15, -24));
    s += typeCap('Признайтесь, вы ведь сейчас', 540, 290, t, T.v - .05, { c: C.paper, s: 44, ls: 6, d: .7 });
    s += typeCap('тоже захотели', 540, 370, t, T.v + .7, { c: C.paper, s: 44, ls: 6, d: .45 });
    s += typeCap('затянуться?', 540, 470, t, tz, { c: C.a1, s: 60, ls: 6, d: .4 });
    const kf = P01(t, tz + .9, .5);
    if (kf > 0) { const w0 = 470; s += g(sh(D_.rr(-w0 / 2, -56, w0, 112, 56), C.a2) + tx('ПОДПИСАТЬСЯ', 0, 14, { f: 'M', w: 800, s: 38, c: C.paper, ls: 4 }), at(540, 1180, EZ.back(kf))); cue(tz + .9, 'pop', .8) }
    return g(s, drift(t, T, .03))
  };

  window.EP = {
    P: C, D, clean: true, lead: .2,
    tr: { title: 'cut', common: 'zc', claim: 'band', leaf: 'thru', bite: 'out', reply: 'whip', y1690: 'slide', garden: 'cut', ban: 'zc', aphid: 'out', exhale: 'zc', recep: 'whipU', ten: 'zc', dopa: 'cut', grow: 'cut', more: 'band', pocket: 'zc', toll: 'fade' },
    trAt: { common: [540, 1110 - 286 + 572 * .34], leaf: [690, 774], bite: [505, 846], ban: [650, 905], aphid: [660, 870], exhale: [760, 720], ten: [900, 1150], pocket: [540, 1010] },
    trR: { leaf: 70 },
    trBg: { leaf: C.bg3 },
    trCol: { common: C.bg2, claim: C.a1, leaf: C.ink, bite: C.paper, ban: '#CFE6B5', exhale: C.bg2, ten: C.bg, more: C.a1, pocket: '#0B1512' },
    trCol2: { claim: C.a2, more: C.a2 },
    cap: { hi: C.a1, st: C.ink },
  };
})();
