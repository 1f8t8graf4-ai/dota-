// Никотин v8 · «нормальный, другой»: гусеница табачного бражника выдыхает никотин. Светлая «природная» палитра (leaf):
//   зелень + бумага, никотин — фиолетовый, красный — рог гусеницы и «опасно». Без «Что вы знаете о» и без шизы — спокойная документалка.
//   Факты: Kumar, Baldwin и др., PNAS 2014 («toxic halitosis», пауки-волки); Kessler & Baldwin, Science 2001 (хищные клопы, −90 %);
//   Kessler, Diezel & Baldwin, Current Biology 2010 (цветы утром → колибри).
(function () {
  pal8(PAL8.leaf);
  const C = K8;
  P = { bg: C.night, paper: C.paper, ink: C.night, line: C.paper, a1: C.amber, a2: C.red };
  const D = {};
  const L0 = '#EEF1E3', L1 = '#E2E8D3', NIGHT = '#132A20';
  const bgDay = () => bgPaper(L0, L1, 'l', .3);
  // большой лист по диагонали снизу (край — линия, по которой ползёт гусеница)
  const EDGE = 'M-200 980C200 900 600 860 1300 900L1300 2400L-200 2400Z';
  const bigLeaf = (t, bites = []) => { let s = F(EDGE, C.navy3) + F('M600 870C900 860 1100 880 1300 900L1300 2400L800 2400Z', C.navy2) + ht(EDGE, 'n', 'v', .45) + Ln('M-200 1240C300 1100 700 1120 1300 1180M200 950C260 1120 160 1400 120 1600M760 880C820 1100 900 1400 1000 1700', 1, { c: C.paper, w: 3, op: .45 }); return bites.length ? cut(s, bites) : s };

  // 1. «Эта гусеница выдыхает никотин.» — крупно гусеница на краю листа; из боков — фиолетовые облачка; молекула никотина
  D.hook = (t, S, T) => {
    const tp = T.c('выдыхает') - .2, tn = T.c('никотин') - .1;
    let s = bgDay() + bigLeaf(t);
    s += caterpillar8(t, { x: 540, y: 840, s: 1.35, crawl: t * .7, puff: t > tp ? (t - tp) * 1.2 : null });
    s += rise8(nicMol8(0, 0, 1, { bg: L0, nc: C.night }), 760, 420, t, tn, { s: .8, back: true });
    return g(s, push8(t, T, .05, 540, 760))
  };
  // 2. «Это гусеница табачного бражника. Она ест табак — тот самый, из которого делают сигареты.» — жуёт край листа; лист сушится и сворачивается в сигарету
  // сухой лист горизонтально (черешок слева) — превращается в сигарету без поворота
  const LEAFC = (() => { const L = 760, w = 150; return `M${-L / 2} 0C${R(-L / 2 + L * .12)} ${R(-w * .95)} ${R(-L / 2 + L * .7)} ${R(-w * .9)} ${L / 2} 0C${R(-L / 2 + L * .7)} ${R(w * .9)} ${R(-L / 2 + L * .12)} ${R(w * .95)} ${-L / 2} 0Z` })();
  const CIGP = D_.rr(-380, -48, 760, 96, 10);
  D.intro = (t, S, T) => {
    const te = T.c('ест') - .2, tt = T.c('тот') - .2, tc = T.c('сигареты') - .5;
    const bites = []; for (let i = 0; i < 4; i++) { const k = P01(t, te + i * .45, .25); if (k > 0) bites.push([700 + i * 46, 900 + Math.sin(i) * 6, 40 * EZ.back(k)]) }
    let s = bgDay();
    const up = E(t, tt, .8, 'io');
    s += g(bigLeaf(t, bites) + caterpillar8(t, { x: 420 + Math.min(t - T.a, 3) * 20, y: 840, s: 1.1, crawl: t * .5, chew: t > te ? 1 : 0 }) + lab8('manduca sexta', 540, 330, { c: C.navy2, s: 32, op: E(t, T.a + .2, .5) }), `translate(0 ${R(-up * 330)})`);
    if (t > te) cue(te, 'munch', .6);
    // лист → сигарета
    const kl = P01(t, tt, .5), km = E(t, tc, .6, 'io');
    if (kl > 0 && km < 1) s += g(SH(km > 0 ? morph(LEAFC, CIGP, km) : LEAFC, { c: C.night, op: .2 }) + F(km > 0 ? morph(LEAFC, CIGP, km) : LEAFC, km < .5 ? '#B58A4C' : C.paper) + (km <= 0 ? Ln('M-380 0H370M-200 0L-120 -80M-200 0L-120 80M0 0L80 -90M0 0L80 90M180 0L250 -60M180 0L250 60', 1, { c: '#8C6634', w: 4 }) + ht(LEAFC, 'n', 'v', .25) : ''), at(540, 1160, lerp(.6, 1, EZ.o(kl)), lerp(-8, 0, EZ.o(kl))));
    if (km >= 1) s += cig8(t, { x: 540, y: 1160, fc: '#D9973A', shc: C.night, shOp: .25 });
    return g(s, push8(t, T, .04, 540, 860))
  };
  // 3. «Для большинства насекомых никотин — смертельный яд.» — жук, тля и муха на листьях: фиолетовый импульс — и они падают контуром
  D.poison = (t, S, T) => {
    const tn = T.c('никотин') - .3, ty = T.c('яд') - .2;
    let s = bgDay() + F('M-200 1100C300 1050 700 1060 1300 1080L1300 2400L-200 2400Z', C.navy3) + ht('M-200 1100C300 1050 700 1060 1300 1080L1300 2400L-200 2400Z', 'n', 'v', .45);
    const bugs = [[230, 'beetle', 0], [540, 'aphid', .25], [850, 'fly', .5]];
    bugs.forEach(([x, k, d]) => {
      const kz = P01(t, tn + d, .5), kf = E(t, ty + d * .6, .6, 'i');
      let b = k === 'beetle' ? beetle8(t, { s: .8, f: C.night, nerve: E(kz, 0, 1), ghost: P01(t, tn + d + .5, .4), walk: kz <= 0 })
        : k === 'aphid' ? aphid8(t, { s: .95, f: C.night }) + (kz > 0 ? Ln('M-60 0C-20 20 30 20 70 0', E(kz, 0, 1), { c: C.amber, w: 6 }) : '')
        : bug8(t, { s: .9, f: C.night, wing: kz <= 0 });
      if (k !== 'beetle' && kz > .5) b = g(b, '', 1 - (kz - .5));
      s += g(b, `translate(${x} ${R(1010 + kf * 500)}) rotate(${R(kf * 120)})`, 1 - kf);
      if (kz > 0 && kz < 1) s += Ln(D_.circ(x, 1010, lerp(30, 160, kz)), 1, { c: C.amber, w: 6 * (1 - kz), op: 1 - kz });
    });
    s += rise8(skull8(0, 0, 1.3, { c: C.amber, bg: L0 }), 540, 560, t, ty, { back: true });
    if (t > ty) cue(ty, 'thud', .6);
    return g(s, push8(t, T, .04))
  };
  // 4–5. Рентген гусеницы: никотин (фиолетовые точки) идёт по кишке и выходит сзади; потом часть уходит в кровь и к дыхальцам — облачка
  function xray(t, T, side) {
    const t0 = side ? T.a : T.c('ест') - .2, tout = side ? 0 : T.c('выводит') - .4, ts = side ? T.c('боках') - .6 : 99;
    const dots = segs => {
      let q = ''; const n = segs.length, N = 14;
      for (let i = 0; i < N; i++) {
        const p = ((t - t0) * .35 + i / N) % 1; if (t < t0) continue;
        const f = p * (n - 1), j = Math.min(n - 2, Math.floor(f)), u = f - j, A = segs[n - 1 - j], B = segs[n - 2 - j];
        let x = lerp(A[0], B[0], u), y = lerp(A[1], B[1], u) + 4;
        const toBlood = side && i % 3 === 0 && t > T.a + .3;
        if (toBlood) { const ky = Math.min(1, (p * 3) % 1); y -= ky * 26; }
        q += F(D_.circ(x, y, toBlood ? 9 : 11), C.amber, { op: .95 });
      }
      if (!side && t > tout) for (let i = 0; i < 4; i++) { const p = ((t - tout) * .8 + i / 4) % 1; q += F(D_.ell(segs[0][0] - 30 - p * 30, segs[0][1] + 20 + p * p * 260, 10, 14), C.night, { op: 1 - p }) }
      return q
    };
    let s = bgDay() + F('M-200 1080C300 1050 700 1060 1300 1070L1300 2400L-200 2400Z', C.navy3) + ht('M-200 1080C300 1050 700 1060 1300 1070L1300 2400L-200 2400Z', 'n', 'v', .45);
    s += caterpillar8(t, { x: 560, y: 820, s: 1.55, crawl: t * .3, xray: 1, dots, puff: t > ts ? (t - ts) * 1.2 : null, chew: side ? 0 : 1 });
    return g(s, push8(t, T, .04, 560, 820))
  }
  D.survive = (t, S, T) => xray(t, T, false);
  D.blood = (t, S, T) => xray(t, T, true);
  // 6. «Пауки-волки этот запах не выносят и гусеницу не трогают.» — паук подходит, натыкается на облако и пятится
  D.spider = (t, S, T) => {
    const tv = T.c('выносят') - .3, tg = T.c('трогают') - .2;
    let s = bgDay() + bigLeaf(t);
    s += caterpillar8(t, { x: 360, y: 840, s: 1.15, crawl: t * .5, puff: (t - T.a) * 1.2 });
    const kin = E(t, T.a, tv - T.a, 'o'), kb = E(t, tv, 1.6, 'io');
    const sx = lerp(1350, 820, kin) + kb * 600, sy = 860 - Math.sin(clamp((t - tv) / .3) * PI) * 40;
    s += spider8(t, { x: sx, y: sy, s: .95, r: 180, walk: t * (kb > 0 && kb < 1 ? 3 : 1.6) });
    if (t > tv) { cue(tv, 'scuttle', .6); const q = P01(t, tv, .6); if (q < 1) s += Ln(D_.circ(sx - 120, 820, lerp(30, 160, q)), 1, { c: C.amber, w: 6 * (1 - q), op: 1 - q }) }
    return g(s, push8(t, T, .04, 560, 820))
  };
  // 7. «Учёные так и назвали это: токсичный перегар.» — лист журнала, «PNAS · 2014», выделено маркером
  D.named = (t, S, T) => {
    const tt = T.c('токсичный') - .3;
    let s = bgDay();
    const kp = E(t, T.a, .7, 'o5'), pg = D_.rr(-330, -440, 660, 880, 14);
    let p = SH(pg, { op: .25, c: C.night }) + F(pg, '#FFFFFF') + lab8('pnas · 2014', -280, -360, { c: C.navy2, s: 26, a: 'start', ls: 6 }) + Ln('M-280 -330H280', 1, { c: C.navy2, w: 2, op: .5 });
    for (let i = 0; i < 9; i++) { const y = -270 + i * 56; if (i === 3) continue; p += F(D_.rr(-280, y, i % 3 === 2 ? 380 : 560, 18, 9), C.paper2) }
    const km = E(t, tt, .6, 'io');
    p += F(D_.rr(-292, -112, 584 * km, 76, 10), C.amber3, { op: .9 }) + tx('ТОКСИЧНЫЙ ПЕРЕГАР', 0, -60, { f: 'M', w: 800, s: 44, c: C.night });
    p += g(caterpillar8(t, { s: .42, crawl: t * .5, puff: t * 1.2 }), at(-80, 300));
    s += g(p, at(540, lerp(1900, 820, kp), 1, lerp(8, -3, kp)));
    if (t > tt) cue(tt, 'swish', .5);
    return s
  };
  // 8. «Но табак не сдаётся. Когда его грызут, он пахнет так, что прилетают хищные клопы и едят яйца бражника.» — куст, волны запаха, клопы летят к яйцам
  const EGGS = [[380, 760], [420, 790], [700, 640], [735, 670], [660, 1010], [400, 1040]];
  D.plant = (t, S, T) => {
    const tg = T.c('грызут') - .2, tz = T.c('пахнет') - .2, tk = T.c('клопы') - .6, te = T.c('яйца') - .3;
    let s = bgDay();
    s += soil8(1260, { c: C.night }) + plant8(t, { x: 540, y: 1260, h: 960, roots: 0, sway: 1 });
    s += caterpillar8(t, { x: 780, y: 760, s: .45, r: -30, crawl: t * .5, chew: 1 });
    if (t > tz) for (let i = 0; i < 4; i++) { const q = ((t - tz) * .5 + i / 4) % 1; s += Ln(D_.arc(540, 700, 120 + q * 520, 200, 340), 1, { c: C.navy2, w: 4 * (1 - q) + 1, op: (1 - q) * .7, da: '18 14' }) }
    EGGS.forEach(([x, y], i) => {
      const ta = te + i * .35, eaten = P01(t, ta + .4, .3);
      if (eaten < 1) s += F(D_.circ(x, y, 13 * (1 - eaten)), C.paper) + Ln(D_.circ(x, y, 13 * (1 - eaten)), 1, { c: C.navy2, w: 2 });
      const kf = E(t, tk + i * .3, ta - tk - i * .3 + .4, 'io');
      if (kf > 0 && t < ta + 1.6) { const sx = i % 2 ? 1250 : -170, sy = 300 + i * 90; s += bug8(t, { x: lerp(sx, x + 30, kf), y: lerp(sy, y - 30, kf), s: .42, r: i % 2 ? 180 : 0, wing: kf < 1, f: C.night }) }
    });
    if (t > tk) cue(tk + .3, 'buzz', .5);
    return g(s, push8(t, T, .04, 540, 800))
  };
  // 9. «Так табак убирает с себя больше 90 процентов вредителей.» — кольцо заполняется до 90 %
  D.pct = (t, S, T) => {
    const k = E(t, T.c('90') - .5, 1.4, 'io');
    let s = bgDay();
    s += ring8(540, 700, 280, k * .9, { val: Math.round(k * 90) + '%', vs: 150, c: C.amber, tc: C.night });
    for (let i = 0; i < 10; i++) { const x = 130 + (i % 5) * 205, y = 1130 + Math.floor(i / 5) * 120, off = i < 9 && t > T.c('вредителей') - .4 + i * .06; s += g(caterpillar8(t, { s: .24, crawl: t * .5 + i * .1 }), at(x, y), off ? .25 : 1) + (off ? Ln(`M${x - 50} ${y - 40}L${x + 50} ${y + 30}`, 1, { c: C.red, w: 7 }) : '') }
    return g(s, push8(t, T, .04))
  };
  // 10–11. Ночь → утро: цветы табака открыты ночью, к ним бражник (кладёт яйца); утром табак цветёт снова — прилетает колибри
  const FL = [[300, 760, -18], [460, 640, 8], [640, 700, 22], [800, 820, 30]], FL2 = [[380, 900, -10], [720, 560, 16]];
  function sky(t, kd) {
    let s = BG(NIGHT) + F(D_.circ(820, 320, 90), C.paper, { op: .95 * (1 - kd) });
    for (let i = 0; i < 24; i++) s += F(D_.circ(60 + rnd(i) * 960, 80 + rnd(i + 5) * 700, 2 + rnd(i + 7) * 2), C.paper, { op: (.3 + .5 * Math.abs(Math.sin(t + i))) * (1 - kd) });
    if (kd > 0) s += g(bgDay() + F(D_.circ(240, lerp(900, 340, kd), 110), '#F6D365') + ht(D_.circ(240, lerp(900, 340, kd), 110), 'n', 'x', .15), '', kd);
    return s
  }
  function bush(t, openN, openD) {
    let s = soil8(1240, { c: C.night }) + F('M-12 1240C-10 1000 -6 760 -2 560H2C6 760 10 1000 12 1240Z', C.navy3, { tr: 'translate(540 0)' });
    [[1050, -50, 1], [940, 46, .9], [830, -40, .75]].forEach(([y, a, sc], i) => s += leaf8({ len: 420 * sc, w: 160 * sc, x: 540, y, r: a + fl(t, 1.5, .25, i), vo: .5 }));
    FL.forEach(([x, y, r], i) => s += Ln(`M540 ${y + 140}Q${(540 + x) / 2} ${y + 120} ${x} ${y + 40}`, 1, { c: C.navy3, w: 6 }) + flower8({ x, y: y + 40, r, open: openN, s: .8 }));
    FL2.forEach(([x, y, r]) => s += Ln(`M540 ${y + 140}Q${(540 + x) / 2} ${y + 120} ${x} ${y + 40}`, 1, { c: C.navy3, w: 6, op: openD }) + flower8({ x, y: y + 40, r, open: openD, s: .8, o: clamp(openD * 3) }));
    return s
  }
  D.flowers = (t, S, T) => {
    const tm = T.c('утро') - .5, kd = E(t, tm, 1.2, 'io');
    let s = sky(t, kd) + bush(t, 1 - kd, kd);
    return g(s, push8(t, T, .05, 540, 800))
  };
  D.why = (t, S, T) => {
    const tu = T.c('Утром') - .3, kd = E(t, tu, .9, 'io'), tl = T.c('откладывают') - .3;
    let s = sky(t, kd) + bush(t, 1 - kd, kd);
    const km = E(t, T.a, 1, 'o5');
    if (kd < 1) { s += moth8(t, { x: lerp(-200, 330, km) + Math.sin(t * 2) * 10, y: 700 + Math.sin(t * 3) * 14, s: .9, tongue: 1, op: 1 - kd }); if (t > tl) for (let i = 0; i < 3; i++) { const q = P01(t, tl + i * .3, .6); if (q > 0) s += F(D_.circ(320 + i * 20, lerp(720, 1040, EZ.i(q)), 9), C.paper, { op: 1 - kd }) } }
    if (kd > 0) s += bird8(t, { x: lerp(1300, 860, E(t, tu + .2, .8, 'o5')) + Math.sin(t * 2) * 8, y: 520 + Math.sin(t * 4) * 10, s: .9 });
    if (t > T.a) cue(T.a + .3, 'flutter', .5); if (t > tu) cue(tu + .3, 'whirr', .6);
    return g(s, push8(t, T, .04, 540, 760))
  };
  // 12. «Сам бражник, кстати, размером почти с колибри и так же зависает в воздухе.» — рядом: бражник и колибри, между ними «≈»
  D.moth = (t, S, T) => {
    let s = bgDay();
    s += moth8(t, { x: 300, y: 760 + Math.sin(t * 3) * 14, s: 1.25, f: '#7A6B5A' }) + bird8(t, { x: 760, y: 760 + Math.sin(t * 3.4 + 1) * 14, s: 1.25 });
    s += rise8(tx('≈', 0, 0, { f: 'M', w: 800, s: 150, c: C.night }), 540, 800, t, T.c('почти') - .3, { back: true });
    s += Ln('M160 1000H940', E(t, T.c('размером') - .3, .7, 'o5'), { c: C.navy2, w: 4 }) + [...Array(9)].map((_, i) => Ln(`M${160 + i * 97.5} 990V1010`, E(t, T.c('размером') - .1 + i * .04, .2), { c: C.navy2, w: 4 })).join('');
    return g(s, push8(t, T, .04))
  };
  // 13. «Выходит, вся эта война — на никотине.» — по диагонали: табак против гусеницы, посередине рисуется молекула никотина
  D.war = (t, S, T) => {
    const tn = T.c('никотине') - .6;
    let s = bgDay() + F(D_.poly([[-200, 1500], [1280, 260], [1280, 2400], [-200, 2400]]), C.navy3, { op: .18 });
    s += plant8(t, { x: 270, y: 900, h: 700, roots: 0, s: .75 });
    s += caterpillar8(t, { x: 760, y: 1120, s: .9, crawl: t * .6, puff: t * 1.2 });
    s += nicMol8(560, 720, 1.25, { k: E(t, tn, .9, 'io'), bg: L0, nc: C.night });
    return g(s, push8(t, T, .04))
  };
  // 14. «Гусенице никотин спасает жизнь. Людям — нет.» — слева гусеница с галочкой, справа человек с облаком; на «нет» — красный крест
  D.humans = (t, S, T) => {
    const tl = T.c('жизнь') - .3, tn = T.c('нет') - .2;
    let s = bgDay();
    s += caterpillar8(t, { x: 330, y: 560, s: .8, crawl: t * .6, puff: t * 1.2 }) + check8(330, 360, 1, P01(t, tl, .5), '#3E9D5C');
    s += head8({ x: 520, y: 1060, s: .95, f: C.navy3 });
    const kc = E(t, T.c('Людям') - .3, .8, 'o5');
    s += cloud8(860, 960, .62 * kc + .01, { f: '#E8DEF8' });
    if (t > tn) { s += g(Ln('M-50 -50L50 50M50 -50L-50 50', E(t, tn, .35), { c: C.red, w: 16 }), at(860, 960, 1)); cue(tn, 'thud', .6) }
    return g(s, push8(t, T, .04))
  };
  // 15. «В профиле — как никотином откачивали утопленников и почему тля выдохнула.»
  D.cta = (t, S, T) => cta8(t, T, [{ k: 'thames', t: ['Как откачивали', 'утопленников'] }, { k: 'aphid', t: ['Почему тля', 'выдохнула'] }]);

  window.EP = {
    P, D, clean: true, lead: .2, defs: V8DEFS,
    cap: { size: 58, top: 1360, hi: '#C9AEF5', st: C.night },
    tr: { hook: 'cut', intro: 'panL', poison: 'wave', survive: 'cut', blood: 'cut', spider: 'zc', named: 'wave', plant: 'cut', pct: 'zc', flowers: 'cut', why: 'panL', moth: 'wave', war: 'cut', humans: 'zc' },
    trAt: { spider: [600, 760], pct: [540, 760], humans: [520, 1000] },
    trCol: { spider: '#FFFFFF', pct: NIGHT, humans: C.night },
    trCols: { poison: [C.amber, C.paper, C.navy3], named: [C.navy3, C.paper, C.navy2], moth: [C.amber, C.paper, C.navy3] },
    init() {
      const st = document.createElement('style');
      st.textContent = `#cap{font-weight:800!important;letter-spacing:0!important;text-shadow:0 0 2px ${C.night},0 3px 0 ${C.night},0 0 14px rgba(23,51,39,.85),2px 2px 0 ${C.night},-2px 2px 0 ${C.night},2px -2px 0 ${C.night},-2px -2px 0 ${C.night}!important}#cap .u{color:#FFFDF4!important;opacity:.6}`;
      document.head.appendChild(st);
    }
  };
})();
