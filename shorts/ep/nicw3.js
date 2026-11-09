// Никотин v6-3 — «Что вы знаете о…» как я его вижу: одна камера без склеек. Каждая сцена лежит внутри предмета прошлой
// (буква «О» → куст табака → лист → баклажан → весы → сигарета → пачка …), камера влетает внутрь (thru) или отъезжает
// (into). Петля: последняя фраза «А если спросят, что вы знаете о…» переходит в первый кадр — ролик крутится по кругу.
// Новый поворот: никотин есть в баклажане (паслёновые), на одну сигарету — около 10 кг баклажанов.
(function () {
  const C = { bg: '#2B1B3D', bg2: '#3A2552', bg3: '#4A3066', ink: '#140D1F', paper: '#F2ECDD', paper2: '#E4D9C2', line: '#F2ECDD',
    a1: '#FFB238', a2: '#E2574C', a3: '#7FC48A', egg: '#6B3FA0', egg2: '#532F80', leaf: '#5E9E5A', leaf2: '#3F7A45', field: '#2E5A3E', field2: '#386B4A',
    eu: '#2F56A6', star: '#FFD23F', skin: '#E9B48F', wood: '#B57A45', wood2: '#8A5A33', dark: '#120B1A' };
  P = C;
  const D = {};
  const MOT = [C.a1, C.paper, '#B98BEF'];
  const RAYV = 7;  // скорость лучей в заголовке (петля: в конце угол возвращается к 0)
  let DUR = 60;
  const titleWord = 'НИКОТИНЕ?', TS = 104;

  // ===== 1. заголовок: «ЧТО ВЫ ЗНАЕТЕ О» уже напечатано (с ним кончается ролик), «НИКОТИНЕ?» падает; камера — в «О» =====
  function band(t, typed, k = 1) {
    let s = sh(D_.rr(lerp(-1100, 0, k), CY - 230, 1080, 440, 0), C.paper) + sh(D_.rr(lerp(-1100, 0, k), CY + 200, 1080, 12, 0), C.a1);
    if (typed > 0) s += cap('Что вы знаете о'.slice(0, Math.ceil(typed * 15)), 540, CY - 70, { c: C.ink, s: 34, ls: 9 });
    return s
  }
  D.title = (t, S, T) => {
    let s = BG(C.bg) + rays(540, CY, 18, C.bg2, t * RAYV) + band(t, 1, 1);
    s += dropWord(titleWord, 540, CY + 80, t, .72, { s: TS, c: C.egg2, stag: .05 });
    return s
  };

  // ===== 2. «Что он есть в табаке?»: куст табака в поле, на листе — молекула =====
  const CP = { x: 540, y: 1360, h: 1100 };
  D.common = (t, S, T) => {
    const tt = T.c('табаке') - .2;
    let s = BG(C.field) + rays(540, 700, 20, C.field2, t * 6);
    s += sh('M-100 1360Q540 1300 1180 1360V2100H-100Z', '#24472F');
    s += tobaccoPlant(t, { x: CP.x, y: CP.y, h: CP.h, c: C.ink, sway: 3, leaves: [[.28, -64, 1.05], [.44, 60, 1], [.6, -60, .85], [.76, 58, .7], [.88, -52, .5]] });
    s += pop(molecule(t, { s: 1, mood: 'sly', c: C.ink, f: C.a1, f2: '#E8901F', look: -.5 }), 360, 940, t, tt, { s: .62, r0: 30 });
    return g(s, `translate(0 0) ` + about(362, 955, 1 + .12 * E(t, T.a, T.b - T.a + .3, 'io')))
  };

  // ===== 3. «А знаете ли вы, что он есть и в баклажане?»: лист во весь кадр превращается в баклажан =====
  const LEAFB = D_.poly(pts(leafPath(1500, 560), 180).map(([x, y]) => [540 + x, 1620 + y]));
  const EGGB = D_.poly(pts(EGG, 180).map(([x, y]) => [540 + x * 2.3, CY + 60 + y * 2.3]));
  D.claim = (t, S, T) => {
    const tb = T.c('баклажане') - .25, km = E(t, tb, .5, 'io'), kc = E(t, tb + .1, .55, 'o5');
    let s = BG(C.leaf2) + rays(540, CY, 22, C.leaf, t * 9);
    s += sh(D_.circ(540, CY + 60, lerp(0, 1500, kc)), C.bg) + (kc > 0 ? g(rays(540, CY, 22, C.bg2, t * 9), '', kc >= 1 ? 1 : 0) : '');
    const sq = squash(t, tb + .5, .14);
    if (km <= 0) s += g(leafT({ len: 1500, w: 560, c: C.ink, ow: 8, vw: 6, dots: false }), `translate(540 ${R(1620 + Math.sin(t * 2) * 6)}) rotate(${R(Math.sin(t * 1.5) * 2)})`);
    else if (km < 1) { cue(tb, 'morph', .9); s += sh(morph(LEAFB, EGGB, km), km < .5 ? C.leaf : C.egg, { c: C.ink, w: 8 }) }
    else s += g(eggplant(t, { c: C.ink, face: { mood: t > tb + 1 ? 'o' : 'calm', look: -.2 } }), `translate(540 ${R(CY + 60)}) scale(${R(2.3 / sq * 1000) / 1000} ${R(2.3 * sq * 1000) / 1000})`);
    if (km >= 1) s += burst(540, CY + 60, t, tb + .5, { c: C.a1, r0: 540, r1: 700, n: 14 });
    s += pop(pill('НИКОТИН: ЕСТЬ', 0, 0, { f: C.a1, tc: C.ink, s: 50 }), 540, 330, t, tb + .55, { r: -5 });
    s += flashF(t, T.a + .03, C.paper);
    return s
  };

  // ===== 4. «Табак, помидор, картошка, перец и баклажан — одна семья. Паслёновые»: семейный портрет =====
  const EGF = [540, 700, .82];
  D.family = (t, S, T) => {
    const t1 = T.c('Табак') - .15, t2 = T.c('помидор') - .15, t3 = T.c('картошка') - .15, t4 = T.c('перец') - .15, tf = T.c('семья') - .3, tp = T.c('Паслёновые') - .15;
    let s = BG('#F2E3C6') + stripes('#E9D5B0', 60, 150, 0, 0);
    s += drawOn(D_.rr(90, 300, 900, 960, 30), t, tf, { d: .6, c: '#B8862E', w: 26 }) + drawOn(D_.rr(120, 330, 840, 900, 20), t, tf + .1, { d: .6, c: '#E0B04A', w: 10 });
    s += sh(D_.rr(0, 1180, 1080, 800, 0), '#C99B5F') + line('M0 1180H1080', 1, { c: C.ink, w: 7 });
    s += pop(g(leafT({ len: 760, w: 270, c: C.ink, ow: 6, vw: 4, dots: false }) + faceOn(t, { face: { mood: 'smile', look: .4 }, c: C.ink }, 0, -400), ''), 230, 1180, t, t1, { r: -8, r0: -20 });
    s += g(eggplant(t, { c: C.ink, face: { mood: t > tf ? 'happy' : 'calm', look: .2 } }), at(EGF[0], EGF[1] + bob(t, 4, .7), EGF[2]));
    s += pop(tomato(t, { c: C.ink, face: { mood: 'happy' } }), 440, 1060, t, t2, { s: 1.05 });
    s += pop(potato(t, { c: C.ink, face: { mood: 'smile', look: -.3 } }), 660, 1090, t, t3, { s: 1 });
    s += pop(pepper(t, { c: C.ink, face: { mood: 'happy', look: -.4 } }), 860, 1040, t, t4, { s: .95 });
    s += pop(g(sh(D_.rr(-300, -54, 600, 108, 16), '#E0B04A', { c: C.ink, w: 6 }) + tx('ПАСЛЁНОВЫЕ', 0, 22, { f: 'O', w: 700, s: 62, c: C.ink, ls: 4 }), ''), 540, 1275, t, tp, { r: -2, snd: 'stamp' });
    return g(s, drift(t, T, .04))
  };

  // ===== 5. «Совсем чуть-чуть: на никотин одной сигареты нужно съесть около десяти килограммов»: весы =====
  const SC0 = { x: 540, y: 520 };
  function eggPile(t, n, t0, dt, o = {}) {  // кучка баклажанов на чаше: n штук падают по очереди
    let s = '';
    for (let i = 0; i < n; i++) {
      const k = P01(t, t0 + i * dt, .3); if (k <= 0) continue;
      const row = i < 4 ? 0 : i < 7 ? 1 : i < 9 ? 2 : 3, ci = i < 4 ? i : i < 7 ? i - 4 : i < 9 ? i - 7 : 0, nr = [4, 3, 2, 1][row];
      const x = (ci - (nr - 1) / 2) * 62, y = -36 - row * 52;
      s += g(eggplant(t, { c: C.ink }), at(x, lerp(y - 500, y, EZ.i(k)), .16, 90 + (i % 2 ? 8 : -8)));
      if (k >= 1 && o.snd !== false) cue(t0 + i * dt + .3, 'thud', .35);
    }
    return s
  }
  D.tiny = (t, S, T) => {
    const tc = T.c('сигареты') - .25, te = T.c('съесть') - .2, t10 = T.c('десяти') - .2, tk = T.c('килограммов') - .1;
    const n = Math.min(10, Math.floor(clamp((t - te) / (t10 - te + .3)) * 10) + (t > te ? 1 : 0));
    const ang = lerp(-16, 0, EZ.io(clamp(n / 10)));
    let s = BG(C.bg) + rays(540, 700, 20, C.bg2, t * 8);
    const cig = P01(t, tc, .35) > 0 ? g(cigarette(t, { len: 200, h: 34, c: C.ink }), at(0, lerp(-500, -18, EZ.i(P01(t, tc, .35))))) : '';
    let w = scales(t, { x: SC0.x, y: SC0.y, ang, c: C.ink, left: cig, right: eggPile(t, 10, te, (t10 - te + .3) / 10) + g(eggplant(t, { c: C.ink }), at(0, -36, .16, 90)) });
    if (P01(t, tc, .35) >= 1) cue(tc + .35, 'thud', .5);
    const z = lerp(3, 1, E(t, T.a, 1.3, 'io5')), fx = lerp(857, SC0.x, E(t, T.a, 1.3, 'io5')), fy = lerp(650, SC0.y + 300, E(t, T.a, 1.3, 'io5'));
    s += g(w, `translate(540 ${CY}) scale(${R(z * 1000) / 1000}) translate(${R(-fx)} ${R(-fy)})`);
    // лупа на «чуть-чуть»: в баклажане крошечная молекула
    const kl = P01(t, T.a + .2, .5);
    if (kl > 0 && t < T.a + 2) s += g(`<circle r="140" fill="${C.egg}" stroke="${C.ink}" stroke-width="40"/><circle r="140" fill="none" stroke="#2B2F3A" stroke-width="24"/>` + molIcon(0, 0, .1, C.a1, C.ink) + ringWave(0, 0, t, T.a + .6, { c: C.a1, r0: 6, r1: 60, w: 4 }) + line('M100 100L230 230', 1, { c: C.ink, w: 40 }) + line('M100 100L230 230', 1, { c: C.wood2, w: 26 }), at(700, 600, EZ.back(kl) * (1 - E(t, T.a + 1.5, .4, 'i'))));
    const kk = P01(t, tk - .2, .5);
    if (kk > 0) s += g(sh(D_.rr(-170, -60, 340, 120, 20), C.paper, { c: C.ink, w: 6 }) + tx('≈ 10 КГ', 0, 24, { f: 'O', w: 700, s: 70, c: C.ink }), at(780, 1110, EZ.back(kk), 4));
    s += pop(pill('1 СИГАРЕТА', 0, 0, { f: C.paper, tc: C.ink, s: 40 }), 270, 1110, t, tc + .3, { r: -4 });
    return s
  };

  // ===== 6. «Пачка в день — это по никотину сотни килограммов баклажанов. Каждый день» =====
  const PILE = []; for (let r = 0; r < 9; r++) for (let c0 = 0; c0 < 14 - r; c0++) PILE.push([(c0 - (13 - r) / 2) * 76 + (r % 2) * 10, -r * 48]);
  D.pack = (t, S, T) => {
    const tp = T.c('Пачка') - .2, ts = T.c('сотни') - .3, tk = T.c('Каждый') - .2;
    let s = BG(C.paper) + rays(540, 520, 20, C.paper2, -t * 8);
    const kp = P01(t, tp, .4), sq = squash(t, tp + .4, .2);
    if (kp > 0) s += g(cigPack(t, { c: C.ink, f: '#FFFFFF', f2: C.a2 }), `translate(540 ${R(lerp(-300, 470, EZ.i(kp)))}) scale(${R(1 / sq * 1000) / 1000} ${R(sq * 1000) / 1000})`);
    if (kp >= 1) cue(tp + .4, 'thud', .7);
    // дождь баклажанов в кучу
    let pile = '', nOn = 0;
    PILE.forEach(([x, y], i) => { const t0 = ts + i * .018 + (i > 70 ? (tk - ts - 1.26) : 0), k = P01(t, t0, .35); if (k > 0) { nOn++; pile += g(eggplant(t, { c: C.ink }), at(540 + x, lerp(-200, 1250 + y, EZ.i(k)), .16, 90 + (rnd(i) - .5) * 40)) } });
    s += pile;
    for (let i = 0; i < 6; i++) cue(ts + i * .2, 'thud', .3, rnd(i) - .5);
    // календарь листается
    const kd = P01(t, tk, .5);
    if (kd > 0) { const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'], di = Math.min(6, Math.floor(Math.max(0, t - tk) * 6)); s += g(calPage(0, 0, days[di], String(di + 1), { c: C.ink, w: 220, h: 250, bs: 110 }), at(210, 330, EZ.back(kd), -6)); cue(tk, 'flip', .5) }
    s += g(sh(D_.rr(-190, -64, 380, 128, 20), C.ink) + tx('≈ ' + Math.round(lerp(0, 200, E(t, ts, 1.1, 'o5'))) + ' КГ', 0, 26, { f: 'O', w: 700, s: 76, c: C.a1 }), at(800, 330, 1, 5), E(t, ts, .3));
    return g(s, drift(t, T, .04))
  };

  // ===== 7. «А табак копит никотин в листьях. Для жуков это яд»: лист в разрезе, клетки с молекулами =====
  const CELLS = []; for (let r = 0; r < 6; r++) for (let c0 = 0; c0 < 5; c0++) CELLS.push([(c0 - 2) * 110 + (r % 2) * 55, (r - 2.5) * 96]);
  D.leaf = (t, S, T) => {
    const tk = T.c('копит') - .2, tj = T.c('жуков') - .2, ty = T.c('яд') - .15;
    let s = BG(C.leaf2) + rays(540, CY, 22, '#4C8A50', t * 6);
    s += g(leafT({ len: 1700, w: 640, c: C.ink, ow: 8, vw: 6, dots: false }), at(560, 1900, 1, -8));
    // лупа-разрез: клетки наполняются молекулами
    let cells = sh(D_.circ(0, 0, 330), '#A6D86B', { c: C.ink, w: 10 });
    CELLS.forEach(([x, y], i) => { cells += sh(D_.poly([...Array(6)].map((_, j) => [x + Math.cos(j * PI / 3) * 58, y + Math.sin(j * PI / 3) * 58])), '#C9EBA0', { c: C.leaf2, w: 5 }); const k = P01(t, tk + i * .05, .3); if (k > 0) cells += molIcon(x - 10, y, .22 * EZ.back(k), C.a1, C.ink) });
    s += g(clip(D_.circ(0, 0, 326), cells), at(540, 760, EZ.back(P01(t, T.a + .1, .5))));
    s += g(`<circle r="330" fill="none" stroke="${C.ink}" stroke-width="12"/>`, at(540, 760, EZ.back(P01(t, T.a + .1, .5))));
    const kb = P01(t, tj, .8);
    if (kb > 0) s += beetle(t, { x: lerp(-300, 170, EZ.o(kb)), y: 1230, s: 1.2, walk: kb < 1, c: C.ink, look: true });
    if (t > ty) s += pop(g(sh(D_.rr(-110, -70, 220, 140, 18), C.paper, { c: C.ink, w: 6 }) + tx('ЯД', 0, 30, { f: 'O', w: 700, s: 82, c: C.a2 }) + line('M0 -70L0 -150', 1, { c: C.ink, w: 6 }), ''), 860, 1170, t, ty, { r: 10 });
    return g(s, drift(t, T, .05))
  };

  // ===== 8. «Укус — и жук замирает: никотин бьёт ему по нервам» =====
  D.bite = (t, S, T) => {
    const tb = T.c('Укус') - .1, tf = T.c('замирает') - .15, tn = T.c('нервам') - .4;
    let s = BG(C.leaf2) + rays(540, CY, 22, '#4C8A50', t * 6);
    const edge = 'M-200 1000Q540 966 1280 1014L1280 2200L-200 2200Z';
    let leafS = sh(edge, C.leaf) + sh('M520 982Q900 970 1280 1014L1280 2200L700 2200Z', '#4E8C4C') + line(edge, 1, { c: C.ink, w: 7 });
    const kb = P01(t, tb + .15, .3), nb = kb > 0 ? 64 * EZ.back(kb) : 0;
    if (nb > 0) { leafS = cut(leafS, [[700, 984, nb * 1.4]]); cue(tb + .15, 'chomp', .9) }
    s += leafS;
    const fr = P01(t, tf, .25), back = P01(t, T.e - .4, .45), ch = t > tb && t < tf ? Math.sin((t - tb) * 13) * .5 + .5 : 0;
    s += beetle(t, { x: 380 + shake(t, tn, 16, 1, 60), y: 958, s: 1.75, chomp: ch, stiff: fr, zap: t > tn && t < T.e - .3 ? 1 : 0, c: C.ink, f: fr > 0 ? '#7E9A8D' : '#2E7D5B', f2: fr > 0 ? '#5E7A6D' : '#1F5A41', dead: back > .5, back: EZ.io(back) });
    if (fr > 0) { s += pop(g(sh(D_.rr(-50, -64, 34, 128, 10), C.paper) + sh(D_.rr(16, -64, 34, 128, 10), C.paper)), 420, 560, t, tf, { s: 1.1, out: T.e - .45 }); cue(tf, 'freeze', .8) }
    if (t > tn) cue(tn, 'zap', .8);
    s += flashF(t, tf, C.paper);
    return g(s, about(560, 900, 1 + .1 * E(t, T.a, 1.6, 'io') + .08 * E(t, tf, .3, 'o5')))
  };

  // ===== 9. «Люди травили им вредителей триста лет. Пока в 2009 Евросоюз не запретил»: лента истории, камера едет =====
  const FR = [[540, 1690], [1180, 1800], [1820, 1900], [2460, 1990], [3100, 2009]];
  function frameItem(t, i, tB) {
    const W0 = 500, H0 = 600;
    let s = sh(D_.rr(-W0 / 2, -H0 / 2, W0, H0, 18), C.paper, { c: C.ink, w: 7 }) + sh(D_.rr(-W0 / 2 + 24, -H0 / 2 + 24, W0 - 48, H0 - 150, 8), [C.leaf2, '#E4D9C2', '#C99B5F', '#9FC4E8', C.eu][i]);
    const ins = [
      g(sh('M-120 -100L-100 120H100L120 -100Z', C.wood, { c: C.ink, w: 6 }) + sh(D_.ell(0, -100, 120, 26), '#8A5C2E', { c: C.ink, w: 6 }) + g(leafT({ len: 160, w: 60, c: C.ink, ow: 4, vw: 3, dots: false }), at(-20, -110, 1, -20)), at(0, -40, .9)),
      g(line('M-100 -90C-110 -170 40 -180 50 -90', 1, { c: C.ink, w: 10 }) + sh('M50 -30L190 -110L200 -96L70 0Z', '#5B6F86', { c: C.ink, w: 6 }) + sh('M-110 -90H80L90 90H-120Z', '#6E86A3', { c: C.ink, w: 7 }), at(-30, -30, .8, 20)),
      g(sh('M-60 -40C-60 -90 -30 -100 -26 -120V-160H26V-120C30 -100 60 -90 60 -40V140C60 160 46 170 26 170H-26C-46 170 -60 160 -60 140Z', '#3A2A1A', { c: C.ink, w: 6 }) + sh(D_.rr(-44, -10, 88, 110, 8), C.paper, { c: C.ink, w: 4 }) + sh(D_.circ(0, 40, 20), C.ink), at(0, -40, .9)),
      g(sh('M-180 0L180 0L160 30H-160Z', '#E9A23B', { c: C.ink, w: 6 }) + sh('M-40 -60H40L60 0H-60Z', '#E9A23B', { c: C.ink, w: 6 }) + sh(D_.rr(-220, -10, 440, 20, 10), C.a2, { c: C.ink, w: 5 }) + line('M-150 40L-170 160M-50 40L-60 160M50 40L60 160M150 40L170 160', 1, { c: C.paper, w: 6, da: '10 14' }), at(0, -70, .9)),
      euDisc(0, -70, 150, 1, { f: C.eu, sc: C.star }),
    ][i];
    s += g(ins, `translate(0 -30)`);
    s += tx(String(FR[i][1]), 0, H0 / 2 - 44, { f: 'O', w: 700, s: 70, c: C.ink });
    if (i === 4) s += stamp('ЗАПРЕЩЕНО', 0, -60, t, tB, { c: C.a2, s: 64, r: -12 });
    return s
  }
  D.years = (t, S, T) => {
    const t3 = T.c('триста') - .2, t9 = T.c('2009') - .3, tB = T.c('запретил') - .15;
    const K = [[T.a, 540], [t3, 1500], [t9, 2700], [t9 + .8, 3100], [T.b + 1, 3100]];
    let i = 0; while (i < K.length - 1 && t >= K[i + 1][0]) i++;
    const a = K[i], b = K[Math.min(i + 1, K.length - 1)], cx = lerp(a[1], b[1], b[0] > a[0] ? EZ.io(clamp((t - a[0]) / (b[0] - a[0]))) : 1);
    let s = BG(C.bg) + stripes(C.bg2, 50, 160, 20, -cx * .3);
    let w = line('M0 1260H3700', 1, { c: C.paper, w: 8 });
    FR.forEach(([x, y], j) => { w += line(`M${x} 1240V1280`, 1, { c: C.paper, w: 8 }) + g(frameItem(t, j, tB), at(x, 760, 1, (j % 2 ? 3 : -3))) });
    s += g(w, `translate(${R(540 - cx)} 0)`);
    s += g(sh(D_.rr(-190, -70, 380, 140, 20), C.a1, { c: C.ink, w: 6 }) + odo(lerp(1690, 2009, E(t, T.a + .2, t9 - T.a + .4, 'io')), 0, 34, { s: 90, c: C.ink, sep: '' }), at(540, 300, 1, -3));
    cue(t3, 'tick', .5); cue(t9, 'tick', .5);
    return s
  };

  // ===== 10. «А у вас в мозге такие же рецепторы, как у жука. Их так и назвали — никотиновые» =====
  function cupCirc(t, x, y, r, tDock) {
    let s = sh(D_.circ(x, y, r), '#F4C7D2', { c: C.ink, w: 7 });
    const k = P01(t, tDock, .5);
    s += clip(D_.circ(x, y, r - 4), sh(`M${x - r} ${y + 30}Q${x - r / 2} ${y + 10} ${x} ${y + 30}T${x + r} ${y + 30}V${y + r}H${x - r}Z`, '#E89BB0') + sh(`M${x - 60} ${y + 20}C${x - 60} ${y + 110} ${x + 60} ${y + 110} ${x + 60} ${y + 20}L${x + 34} ${y + 20}C${x + 34} ${y + 76} ${x - 34} ${y + 76} ${x - 34} ${y + 20}Z`, C.a1, { c: C.ink, w: 5 }) + molecule(t, { x: x - 6, y: lerp(y - r - 60, y + 6, EZ.o5(k)), s: .42, f: C.a2, f2: '#B83A32', c: C.ink, face: false, rot: (1 - k) * 200 }));
    if (k >= 1) s += ringWave(x, y + 20, t, tDock + .5, { c: C.paper, r0: 20, r1: r, w: 5 });
    return s
  }
  D.brain = (t, S, T) => {
    const tb = T.c('мозге') - .25, tj = T.c('жука') - .2, tn = T.c('никотиновые') - .15;
    let s = BG(C.bg) + rays(540, 900, 20, C.bg2, t * 6) + motes(t, MOT, 8);
    s += pop(brainF(t, { c: C.ink, face: { mood: 'calm', look: .4 } }), 280, 1040, t, T.a + .05, { s: 1.38 });
    s += pop(beetle(t, { c: C.ink, look: true }), 780, 1120, t, tj, { s: 1.2 });
    s += pop(tx('=', 0, 0, { f: 'O', w: 700, s: 170, c: C.a1 }), 570, 1100, t, tj + .25, {});
    const kL = P01(t, tb + .3, .5), kR = P01(t, tj + .3, .5);
    if (kL > 0) s += line('M300 930L290 790', EZ.o(kL), { c: C.paper, w: 6 }) + g(cupCirc(t, 0, 0, 160, tb + .6), at(290, 600, 1.2 * EZ.back(kL)));
    if (kR > 0) s += line('M880 1000L800 790', EZ.o(kR), { c: C.paper, w: 6 }) + g(cupCirc(t, 0, 0, 160, tj + .6), at(800, 600, 1.2 * EZ.back(kR)));
    const kt = P01(t, tn, .6);
    if (kt > 0) { s += g(sh(D_.rr(-280, -58, 560, 116, 58), C.a2, { c: C.paper, w: 5 }) + tx('НИКОТИНОВЫЕ', 0, 22, { f: 'O', w: 700, s: 58, c: C.paper, ls: 3 }), at(540, 300, EZ.back(kt), Math.sin((t - tn) * 7) * 10 * (1 - EZ.o(kt)))); cue(tn, 'ding', .7) }
    return g(s, drift(t, T, .04))
  };

  // ===== 11. «Затяжка — и примерно через 10 секунд никотин уже там»: секундомер, точка бежит от одноразки к мозгу =====
  D.ten = (t, S, T) => {
    const tp = T.c('Затяжка') - .15, tth = T.c('там') - .1;
    let s = BG(C.paper) + rays(540, 640, 20, C.paper2, -t * 8);
    const run = E(t, tp + .2, tth - tp - .2, 'io');
    s += stopwatch(540, 640, 10 * run, { r: 260, c: C.ink, f: '#FFFFFF', face: C.paper, fill: C.a1, hand: C.a2, unit: ' с' });
    const path = 'M190 1120C260 900 420 1180 560 1050S860 960 890 1100';
    s += dotted(path, E(t, tp, .6, 'o5'), C.ink, 7, 22);
    const p = pts(path, 120)[Math.min(119, Math.floor(run * 119))];
    s += pop(vape(t, { c: C.ink, f: C.egg, f2: C.egg2, label: false, fruit: false }), 180, 1180, t, T.a, { s: .38 });
    const kp = P01(t, tp, .6); if (kp > 0 && kp < 1) s += g(cloud(0, 0, 1, { c: C.ink, w: 8 }), at(240, 1040 - 40 * kp, .32 * EZ.o(kp)));
    s += g(brainF(t, { c: C.ink, face: { mood: run >= 1 ? 'happy' : 'calm' } }), at(900, 1150, .5));
    if (run > 0 && run < 1) s += sh(D_.circ(p[0], p[1], 16), C.a2, { c: C.ink, w: 5 });
    s += ringWave(900, 1150, t, tth, { c: C.a2, r1: 260 });
    cue(tp + .2, 'clock', .6);
    return g(s, drift(t, T, .04))
  };

  // ===== 12. «Мозг получает дофамин и запоминает: хочу ещё» =====
  D.dopa = (t, S, T) => {
    const td = T.c('дофамин') - .2, th = T.c('хочу') - .15;
    let s = BG(C.bg) + rays(540, CY, 20, C.bg2, t * 8) + sh(D_.circ(540, CY, 430), C.bg2);
    for (let i = 0; i < 9; i++) { const ph = clamp((t - td - i * .12) / .7); if (ph > 0 && ph < 1) s += sh(D_.drop(330 + (i % 5) * 100 + (i > 4 ? 50 : 0), lerp(220, 640, EZ.i(ph)), 30), C.star, { c: C.ink, w: 5 }); if (ph > .95 && ph < 1) cue(td + i * .12 + .7, 'drip', .4) }
    const hap = t > td + .4 && t < th;
    s += g(brainF(t, { c: C.ink, face: { mood: t > th ? 'want' : hap ? 'happy' : 'calm' } }), at(540, 880 + bob(t, 6, .8), 2.3 * squash(t, td + .4, .1)));
    s += pop(bubble('ХОЧУ ЕЩЁ!', 0, 0, { s: 70, c: C.ink }), 640, 420, t, th, { r: -6 });
    return g(s, drift(t, T, .05))
  };

  // ===== 13. «Каждый год табак убивает больше 7 миллионов человек» =====
  D.toll = (t, S, T) => {
    const t7 = T.c('7') - .2, z = lerp(2.3, .62, E(t, T.a, T.b - T.a + .3, 'io'));
    let s = BG(C.dark);
    const cols = 15, rows = 22;
    let w = '';
    for (let r = 0; r < rows; r++) for (let c0 = 0; c0 < cols; c0++) {
      const i = r * cols + c0, x = c0 * 92 - (cols - 1) * 46, y = r * 104 - (rows - 1) * 52, dd = Math.hypot(x, y), k = P01(t, T.a + dd / 2600, .35), dead = t > t7 + .3 + rnd(i) * 1.8 && rnd(i + 9) < .45;
      if (k > 0) w += g(person1(0, 0, 1, dead ? '#4A2A38' : C.paper), at(x, y, .9 * EZ.back(k)));
    }
    s += g(w, `translate(540 ${CY - 40}) scale(${R(z * 1000) / 1000})`);
    s += sh(D_.rr(0, 1110, 1080, 220, 0), C.dark);
    s += g(odo(7000000 * E(t, t7, 1.1, 'o5'), 540, 1260, { s: 130, c: C.a2, post: '+', sep: ' ' }), '', E(t, t7 - .25, .3));
    if (t > t7) cue(t7, 'count', .6);
    return s
  };

  // ===== 14. «Так что, если очень хочется никотина, съешьте баклажан. Десять килограммов»: стол, тарелка, башня баклажанов =====
  const TOWER = [[0, 0], [-70, -6], [70, -4], [-36, -60], [36, -62], [0, -118], [-60, -120], [60, -116], [0, -176], [0, -236]];
  D.eat = (t, S, T) => {
    const tb = T.c('баклажан') - .25, t10 = T.c('Десять') - .2;
    let s = BG(C.paper) + rays(540, 600, 20, C.paper2, t * 6);
    const sk = shake(t, t10 + .9, 12, .6);
    s += sh(D_.rr(-100, 1060, 1280, 900, 0), C.wood, { c: C.ink, w: 7 }) + sh(D_.rr(-100, 1060, 1280, 40, 0), C.wood2);
    s += g(sh(D_.ell(0, 0, 330, 70), '#FFFFFF', { c: C.ink, w: 7 }) + sh(D_.ell(0, -6, 250, 48), '#EFE8DA', { c: C.ink, w: 4 }), at(540 + sk, 1080));
    s += g(sh(D_.rr(-14, -170, 28, 300, 12), '#9AA6B8', { c: C.ink, w: 5 }) + line('M-14 -170V-250M0 -170V-250M14 -170V-250', 1, { c: C.ink, w: 7 }), at(140, 1050, 1, -10)) + g(sh(D_.rr(-16, -260, 32, 390, 14), '#9AA6B8', { c: C.ink, w: 5 }), at(940, 1050, 1, 10));
    // один баклажан на тарелке, потом башня
    s += g(eggplant(t, { c: C.ink, face: { mood: t > tb ? 'o' : 'calm', look: .3 } }), at(540 + sk, 1020 - 160 * .62, .62, 90 + Math.sin(t * 2) * 3));
    TOWER.forEach(([x, y], i) => { const k = P01(t, t10 + i * .07, .3); if (k > 0) s += g(eggplant(t, { c: C.ink }), at(540 + x * 1.6 + sk, lerp(-300, 900 + y * 1.6, EZ.i(k)), .4, 90 + (i % 2 ? 6 : -6))) });
    for (let i = 0; i < 4; i++) cue(t10 + i * .17 + .3, 'thud', .45, (rnd(i) - .5));
    const kk = P01(t, t10 + .9, .4);
    if (kk > 0) s += g(sh(D_.rr(-170, -60, 340, 120, 20), C.ink) + tx('10 КГ', 0, 26, { f: 'O', w: 700, s: 80, c: C.a1 }), at(830, 380, EZ.back(kk), 6));
    s += pop(pill('СЪЕШЬТЕ', 0, 0, { f: C.a2, s: 50 }), 270, 380, t, T.c('съешьте') - .2, { r: -6 });
    return g(s, drift(t, T, .04))
  };

  // ===== 15. петля: «А если спросят, что вы знаете о…» — полоса въезжает, буквы печатаются; последний кадр = первый =====
  D.loop = (t, S, T) => {
    const tw0 = T.c('что') - .25, kb = E(t, tw0 - .5, .5, 'o5');
    const ty = clamp((t - tw0) / (T.c('о') + .2 - tw0));
    return BG(C.bg) + rays(540, CY, 18, C.bg2, (t - DUR) * RAYV) + band(t, ty, kb) + (ty > 0 ? '' : '') + (cue(tw0, 'type', .6), '')
  };

  window.EP = {
    P: C, D, clean: true, lead: .2,
    init(TL) {
      DUR = TL.dur;
      // точка «О» в «НИКОТИНЕ?» — туда влетает камера
      const ws = [...titleWord].map(ch => tw(ch, { f: 'U', w: 800, s: TS })), tot = ws.reduce((a, b) => a + b, 0);
      const ox = 540 - tot / 2 + ws[0] + ws[1] + ws[2] + ws[3] / 2;
      EP.trAt.title = [ox, CY + 80 - TS * .36];
    },
    tr: { title: 'thru', common: 'thru', claim: 'into', family: 'thru', tiny: 'thru', pack: 'thru', leaf: 'cut', bite: 'into', years: 'thru', brain: 'into', ten: 'thru', dopa: 'thru', toll: 'thru', eat: 'thru' },
    trAt: { title: [540, CY], common: [362, 955], claim: [540, CY + 60], family: [EGF[0], EGF[1] + 40], tiny: [210, 802], pack: [779, 866], bite: [540, CY], years: [540, 660], brain: [540, CY], ten: [900, 1150], dopa: [555, 963], toll: [540, 766], eat: [540, 510] },
    trTo: { claim: [EGF[0], EGF[1] + 20], bite: [540, 760], brain: [900, 1150] },
    trR: { title: 18, common: 60, family: 120, tiny: 40, pack: 22, years: 120, ten: 60, dopa: 26, toll: 14, eat: 60 },
    trBg: { title: C.field, common: C.leaf2, claim: '#F2E3C6', family: C.bg, tiny: C.paper, pack: C.leaf2, years: C.bg, ten: C.bg, dopa: C.dark, toll: C.paper, eat: C.bg },
    trCol: { title: C.ink, common: C.ink, claim: C.paper, family: C.ink, tiny: C.ink, pack: C.ink, bite: C.paper, years: C.ink, brain: C.ink, ten: C.ink, dopa: C.ink, toll: C.paper, eat: C.ink },
    trRing: { title: 0 },
    cap: { hi: C.a1, st: C.ink },
  };
})();
