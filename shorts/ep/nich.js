// Никотин v8 · «Что вы знаете о…» с нуля — умная конспирология, как у оригиналов (Google → Паноптикум → Брин; Apple → Тьюринг → яблоко).
//   Тезис: ваш мозг подписан именем никотина. Цепочка реальных фактов: Ленгли 1905 (петух, никотин → «рецептор»), Дейл 1914 (никотиновые
//   и мускариновые — яд мухомора), табак — подопытный науки: первый вирус (Ивановский 1892), первое ГМ-растение, светящийся табак (1986),
//   лекарство от Эболы в диком табаке на заводе табачной компании; табака нет в дикой природе → «Совпадение? Не думаю» → «кто кого приручил?»
//   Палитра «вино» (бордо/пергамент/золото) + живые цвета предметов.
(function () {
  pal8(PAL8.wine);
  const C = K8;
  P = { bg: C.night, paper: C.paper, ink: C.night, line: C.paper, a1: C.amber, a2: C.red };
  const D = {};
  const PAR = '#EBDDC2', PAR2 = '#DFCDAB', INK = '#4A2232';
  const bgPar = () => bgPaper(PAR, PAR2, 'b', .25);
  const wax = (r) => D_.poly([...Array(36)].map((_, i) => { const a = i / 36 * 2 * PI, rr = r + Math.sin(i * 5.3) * 7 + Math.sin(i * 2.1) * 4; return [Math.cos(a) * rr, Math.sin(a) * rr] }));
  const name8 = (s, x, y, t, t0, o = {}) => lab8(s, x, y, { c: o.c || INK, s: o.s || 28, ls: 6, op: E(t, t0, .5), a: o.a });

  // ---- предметы этого ролика ----
  // ПЕТУХ (бок, смотрит вправо): stiff — ноги вытянуты (никотин)
  function rooster8(t, o = {}) {
    const st = o.stiff || 0;
    let s = '';
    const leg = (x) => Ln(`M${x} 120L${R(x + st * 30)} ${R(220 + st * 30)}L${R(x + 30 + st * 50)} ${R(230 + st * 30)}`, 1, { c: C.amber2, w: 10 });
    s += leg(-30) + leg(30);
    s += F('M-210 -60C-260 -150 -230 -250 -170 -270C-180 -200 -150 -160 -120 -140Z', C.green2) + F('M-200 -30C-280 -90 -290 -190 -250 -230C-240 -150 -200 -110 -150 -90Z', C.eu) + F('M-190 0C-260 -20 -300 -110 -280 -160C-250 -100 -200 -70 -150 -50Z', C.green3);
    const body = 'M-170 -40C-170 -120 -60 -150 40 -130C100 -120 130 -150 140 -200C150 -250 200 -260 230 -230C260 -200 250 -150 230 -110C210 -60 190 40 130 90C70 140 -40 150 -110 110C-150 90 -170 40 -170 -40Z';
    s += SH(body, { op: .25, c: C.navy }) + F(body, C.paper) + ht(body, 'n', 'v', .25) + F('M-60 -40C0 -70 80 -60 100 0C60 40 -20 40 -60 -40Z', C.paper2);
    s += F('M200 -270C190 -300 210 -320 225 -300C230 -330 255 -330 255 -300C270 -320 290 -305 280 -280Z', C.red) + F('M245 -205L290 -190L245 -180Z', C.amber) + F('M225 -170C222 -140 232 -126 242 -134C246 -150 240 -165 232 -172Z', C.red) + F(D_.circ(232, -220, 7), C.night);
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // ШПРИЦ (игла влево)
  const syringe8 = (x, y, s = 1, o = {}) => g(F(D_.rr(-20, -22, 220, 44, 10), '#DCEAF2', { op: .95 }) + F(D_.rr(-20, -22, 120 * (o.fill ?? 1), 44, 10), C.amber) + Ln('M10 -22V-8M40 -22V-8M70 -22V-8M100 -22V-8M130 -22V-8', 1, { c: INK, w: 3, op: .5 }) + F(D_.rr(200, -30, 18, 60, 4), C.line) + F(D_.rr(218, -8, 60, 16, 4), C.line) + F(D_.rr(278, -26, 14, 52, 4), C.line) + Ln('M-20 0H-110', 1, { c: '#9AA7B0', w: 4 }), at(x, y, s, o.r || 0), o.op ?? 1);
  // МУХОМОР
  const amanita8 = (x, y, s = 1, o = {}) => { const cap = 'M-150 0C-150 -110 -70 -160 0 -160C70 -160 150 -110 150 0Z'; return g(SH(cap, { op: .25, c: C.navy }) + F('M-40 0C-44 80 -50 150 -60 200H60C50 150 44 80 40 0Z', C.paper) + F(D_.ell(0, 70, 64, 14), C.paper2) + F(cap, C.red) + ht(cap, 'n', 'x', .25) + [[-80, -60, 18], [-20, -120, 15], [50, -90, 20], [100, -40, 13], [-110, -20, 12], [10, -40, 14]].map(([a, b, r]) => F(D_.circ(a, b, r), C.paper)).join(''), at(x, y, s, o.r || 0), o.op ?? 1) };
  // МИКРОСКОП (силуэт)
  const scope8 = (x, y, s = 1) => g(F(D_.rr(-140, 180, 280, 40, 14), C.navy3) + F('M60 180V40C60 -40 20 -110 -30 -150L-60 -120C-10 -80 20 -20 20 40V180Z', C.navy3) + F(D_.rr(-120, -260, 70, 200, 20), C.line, { tr: 'rotate(-28 -85 -160)' }) + F(D_.rr(-110, 60, 150, 24, 8), C.navy2) + F(D_.circ(-40, -10, 12), C.amber), at(x, y, s));
  // ДНК (двойная спираль по горизонтали), k — рисуется
  function dna8(x0, x1, y, t, k = 1, o = {}) {
    let a = '', b = '', rungs = '';
    const n = 60, amp = o.amp || 70;
    for (let i = 0; i <= n * k; i++) { const u = i / n, x = lerp(x0, x1, u), ph = u * 5 * PI + t * 1.5, ya = y + Math.sin(ph) * amp, yb = y - Math.sin(ph) * amp; a += (i ? 'L' : 'M') + R(x) + ' ' + R(ya); b += (i ? 'L' : 'M') + R(x) + ' ' + R(yb); if (i % 4 === 0) rungs += `M${R(x)} ${R(ya)}L${R(x)} ${R(yb)}` }
    return Ln(rungs, 1, { c: C.paper2, w: 4, op: .6 }) + Ln(a, 1, { c: C.blue, w: 9 }) + Ln(b, 1, { c: C.pink, w: 9 })
  }
  // СВЕТЛЯЧОК
  const firefly8 = (t, x, y, s = 1) => g(F(D_.circ(-30, 0, 40), C.yellow, { op: .25 + .15 * Math.sin(t * 9) }) + F(D_.ell(-26, 4, 26, 18), C.yellow) + F(D_.ell(10, 0, 30, 16), C.navy3) + F(D_.circ(42, -2, 12), C.navy3) + F(D_.ell(0, -20, 34, 12), C.paper, { op: .5 + .3 * Math.sin(t * 40) }), at(x, y, s));
  // ПРОБИРКА-ФЛАКОН с красным крестом
  const vial8 = (x, y, s = 1, o = {}) => g(SH(D_.rr(-70, -150, 140, 300, 30), { op: .35 }) + F(D_.rr(-70, -150, 140, 300, 30), '#DCEAF2', { op: .9 }) + F(D_.rr(-70, -40 + (1 - (o.fill ?? 1)) * 150, 140, 190 - (1 - (o.fill ?? 1)) * 150, 30), C.amber) + F(D_.rr(-56, -190, 112, 50, 10), C.navy3) + F(D_.rr(-48, 0, 96, 70, 10), C.paper) + F(D_.rr(-26, 26, 52, 18, 4), C.red) + F(D_.rr(-9, 9, 18, 52, 4), C.red), at(x, y, s, o.r || 0), o.op ?? 1);
  // ЗАВОД с трубой-сигаретой
  function factory8(t, x, y, s = 1) {
    let q = F('M-260 0V-180L-160 -240V-180L-60 -240V-180L40 -240V0Z', '#B5523F') + F(D_.rr(-260, -60, 300, 60, 0), '#9B4535') + [-220, -140, -60].map(xx => F(D_.rr(xx, -150, 50, 50, 6), C.yellow, { op: .85 })).join('');
    q += F(D_.rr(60, -460, 70, 460, 8), C.paper) + F(D_.rr(60, -460, 70, 120, 8), '#D9973A') + F(D_.rr(60, -470, 70, 22, 8), C.red);
    for (let i = 0; i < 5; i++) { const p = (t * .35 + i / 5) % 1; q += F(D_.circ(95 + p * 60 + Math.sin(p * 6 + i) * 20, -490 - p * 280, 20 + p * 40), C.paper2, { op: (1 - p) * .7 }) }
    return g(q, at(x, y, s))
  }
  // ЧАШКА ПЕТРИ (вид сверху), inner — содержимое
  const petri8 = (x, y, r, inner = '', s = 1) => g(SH(D_.ell(0, 0, r, r * .55), { op: .3 }) + F(D_.ell(0, 0, r, r * .55), '#DCEAF2', { op: .55 }) + inner + Ln(D_.ell(0, 0, r, r * .55), 1, { c: '#fff', w: 5, op: .8 }) + Ln(D_.ell(0, -10, r * .96, r * .52), 1, { c: '#fff', w: 2, op: .5 }), at(x, y, s));
  // КРОЛИК (сидит, смотрит вправо)
  const rabbit8 = (x, y, s = 1, o = {}) => g(F(D_.ell(-20, 40, 120, 90), C.paper) + F(D_.circ(90, -40, 60), C.paper) + F('M60 -90C40 -200 60 -260 90 -260C110 -240 100 -170 90 -90Z', C.paper) + F('M100 -90C110 -200 150 -250 170 -240C180 -210 150 -150 120 -86Z', C.paper2) + F(D_.circ(-140, 50, 30), C.paper) + F(D_.circ(118, -50, 8), C.night) + F(D_.circ(146, -30, 7), C.pink) + ht(D_.ell(-20, 40, 120, 90), 'n', 'v', .25), at(x, y, s), o.op ?? 1);

  // 1. «Что вы знаете о никотине?» — сургучная печать с оттиском N (печать = «подпись»), текст золотом; влёт в печать
  const SEAL = [540, 520];
  D.title = (t, S, T) => {
    let s = bgDiag({ off: -t * 20 });
    const ks = P01(t, T.a + .02, .4);
    if (ks > 0) {
      const sc = lerp(2.6, 1, EZ.i(ks)) * (ks >= 1 ? 1 + .06 * Math.sin(P01(t, T.a + .42, .3) * PI) : 1);
      s += g(SH(wax(118), { op: .5 }) + F(wax(118), C.red) + F(D_.circ(0, 0, 84), '#B92B30') + Ln(D_.circ(0, 0, 84), 1, { c: '#FF6B6B', w: 3, op: .5 }) + tx('N', 0, 36, { f: 'M', w: 800, s: 104, c: C.amber3 }), at(SEAL[0], SEAL[1], sc), clamp(ks * 3));
      if (ks >= 1) cue(T.a + .42, 'seal', .9);
    }
    { const k = E(t, T.a + .2, .6, 'o5'), id = uid(); s += `<clipPath id="${id}"><rect x="0" y="752" width="1080" height="62"/></clipPath>` + g(cap8('что вы знаете о', 540, 800 + (1 - k) * 60, { s: 38, c: C.line, ls: 12 }), '', 1, `clip-path="url(#${id})"`) }
    s += rise('НИКОТИНЕ?', 540, 940, t, T.c('никотине') - .12, { f: 'M', w: 800, s: 124, c: C.amber3, ls: 2, dur: .6 });
    s += Ln('M300 990H780', E(t, T.c('никотине') + .1, .5, 'o5'), { c: C.red, w: 5 });
    return g(s, push8(t, T, .05, 540, 700))
  };

  // 2. «Что на нём сидит больше миллиарда человек?» — глобус (океан, материки пятнами), точки-люди, счётчик
  const GLB = [540, 640];
  const GD = []; for (let i = 0; i < 160; i++) { const a = rnd(i * 7) * 2 * PI, r = Math.sqrt(rnd(i * 7 + 1)) * 238; GD.push([GLB[0] + Math.cos(a) * r, GLB[1] + Math.sin(a) * r, rnd(i * 7 + 2)]) }
  D.known = (t, S, T) => {
    const tm = T.c('миллиарда') - .4;
    let s = bgDiag({ off: -t * 15 });
    const id = uid(), rot = t * 30;
    s += F(D_.circ(GLB[0], GLB[1], 250), C.eu) + `<clipPath id="${id}"><circle cx="${GLB[0]}" cy="${GLB[1]}" r="250"/></clipPath><g clip-path="url(#${id})">` + [[-120, -80, 120, 70], [60, 20, 90, 110], [150, -120, 70, 50], [-160, 120, 80, 50]].map(([x, y, rx, ry]) => F(D_.ell(GLB[0] + ((x + rot + 400) % 800) - 400, GLB[1] + y, rx, ry), C.green)).join('') + '</g>' + ht(D_.circ(GLB[0], GLB[1], 250), 'n', 'd', .45);
    const kd = E(t, tm, 1.5, 'io');
    GD.forEach(([x, y, r]) => { if (r < kd) s += F(D_.circ(x, y, 6), C.yellow, { op: clamp((kd - r) * 8) }) });
    if (t > tm) { const v = Math.round(1e9 * E(t, tm, 1.4, 'o')); s += tx(v.toLocaleString('ru-RU').replace(/ /g, ' ') + (v >= 1e9 ? '+' : ''), 540, 1060, { f: 'M', w: 800, s: 88, c: C.amber3 }) }
    s += Ln(D_.circ(GLB[0], GLB[1], 250), 1, { c: C.paper, w: 3, op: .5 });
    return g(s, push8(t, T, .05, 540, 640))
  };

  // 3. «А знаете ли вы, что ваш мозг подписан его именем?» — мозг крупно; золотой росчерк по мозгу; на «именем» — бирка NICOTINE
  D.claim = (t, S, T) => {
    if (t > T.a) cue(T.a + .05, 'impact', 1);
    const tp = T.c('подписан') - .2, ti = T.c('именем') - .2;
    let s = bgDiag({ off: -t * 15 });
    s += rise8(brain8(t, {}), 540, 700, t, T.a, { s: 2.3, d: .7 });
    s += Ln('M330 760C380 700 420 820 460 740C500 660 520 800 560 730C600 660 640 780 690 700C720 660 760 700 780 690', E(t, tp, .9, 'io'), { c: C.amber3, w: 9 });
    const kt = P01(t, ti, .5);
    if (kt > 0) {
      s += Ln('M560 920C580 980 600 1010 640 1030', E(kt, 0, .5), { c: C.amber, w: 5 });
      s += g(F(D_.rr(-170, -46, 340, 92, 18), C.amber) + F(D_.circ(-138, 0, 12), C.night) + tx('NICOTINE', 18, 16, { f: 'M', w: 800, s: 46, c: C.night, ls: 3 }), at(700, 1060, EZ.back(kt), lerp(-30, -6, EZ.o(kt))));
      cue(ti, 'stamp', .8);
    }
    return g(s, push8(t, T, .05, 540, 800))
  };

  // 4. «В 1905 году англичанин Джон Ленгли вводил никотин петуху — и открыл то, что потом назовут рецептором.» — пергамент, петух, шприц,
  //    ноги петуха вытягиваются; лупа — на мышце появляется рецептор
  D.langley = (t, S, T) => {
    const tn = T.c('никотин') - .3, tr = T.c('рецептором') - .5;
    let s = bgPar();
    s += num8('1905', 540, 330, t, T.a + .1, { s: 130, c: INK });
    s += name8('дж. н. ленгли', 540, 400, t, T.c('Ленгли') - .3);
    const ks = E(t, tn + .5, .6, 'io');
    s += rooster8(t, { x: 430, y: 840, s: 1.15, stiff: ks });
    const ki = E(t, tn - .2, .6, 'io');
    if (ki > 0) s += syringe8(lerp(1200, 700, ki), 1030, .9, { fill: 1 - E(t, tn + .3, .5), r: -20 });
    const km = P01(t, tr, .6);
    if (km > 0) {
      const cx = 820, cy = 700, r = 170 * EZ.back(km);
      s += F(D_.circ(cx, cy, r), '#F6E2D6') + `<clipPath id="lgm"><circle cx="${cx}" cy="${cy}" r="${R(r)}"/></clipPath><g clip-path="url(#lgm)">` + [...Array(7)].map((_, i) => F(D_.rr(cx - 200, cy - 150 + i * 46, 400, 30, 15), i % 2 ? '#E7A8A0' : '#D98A84')).join('') + '</g>';
      s += rec8(cx, cy - 6, 3.2 * EZ.back(km)) + Ln(D_.circ(cx, cy, r), 1, { c: INK, w: 8 }) + Ln(`M${R(cx - r * .7)} ${R(cy + r * .7)}L${R(cx - r * 1.2)} ${R(cy + r * 1.2)}`, 1, { c: INK, w: 18 });
      s += lab8('рецептор', cx, cy + r + 60, { c: C.red, s: 32, ls: 8, op: E(km, 0, .5) });
      cue(tr, 'ding', .5);
    }
    return g(s, push8(t, T, .04))
  };
  // 5. «Через девять лет Генри Дейл разделил рецепторы на два вида. Один назвал в честь никотина, второй — в честь яда мухомора.» — два столбца
  D.dale = (t, S, T) => {
    const tn = T.c('никотина') - .4, tm = T.c('мухомора') - .5;
    let s = bgPar();
    s += num8('1914', 540, 330, t, T.a + .1, { s: 130, c: INK }) + name8('генри дейл', 540, 400, t, T.c('Дейл') - .3);
    // один рецептор делится на два
    const tsplit = T.c('разделил') - .3, kd = E(t, tsplit, .8, 'io');
    if (kd < 1) s += g(rec8(0, 0, 3.6), at(540, 640, EZ.back(P01(t, T.a + .2, .5))));
    s += Ln('M540 520V1200', E(t, tsplit + .3, .6, 'io'), { c: INK, w: 4, op: .5, da: '4 14' });
    if (kd > 0 && t < tn + .2) s += rec8(lerp(540, 300, kd), 600, 3.4) + rec8(lerp(540, 780, kd), 600, 3.4, { c: C.red });
    s += rise8(leaf8({ len: 380, w: 150, r: -12 }), 300, 960, t, tn, { dy: 60 });
    s += rise8(rec8(0, 0, 3.4), 300, 600, t, tn + .2, { back: true }) + name8('никотиновые', 300, 1130, t, tn + .3, { c: C.green3, s: 30 });
    s += rise8(amanita8(0, 0, 1.1), 780, 900, t, tm, { dy: 60 });
    s += rise8(rec8(0, 0, 3.4, { c: C.red }), 780, 600, t, tm + .2, { back: true }) + name8('мускариновые', 780, 1130, t, tm + .3, { c: C.red, s: 30 });
    if (t > tm) cue(tm, 'pin', .5);
    return g(s, push8(t, T, .04))
  };
  // 6. «Никотиновые рецепторы есть в каждом мозге — даже если вы ни разу не курили.» — профиль, внутри мозг, рецепторы мерцают; перечёркнутая сигарета
  D.brain = (t, S, T) => {
    const tk = T.c('курили') - .5;
    let s = bgDiag({ off: -t * 12 });
    const id = uid();
    s += head8({ x: 420, y: 880, s: 1.6 }) + `<clipPath id="${id}"><path d="${HEAD8}" transform="translate(420 880) scale(1.6)"/></clipPath><g clip-path="url(#${id})">${F(D_.circ(460, 800, 210), C.navy, { op: .55 })}</g>`;
    let br = brain8(t, { shadow: false });
    [[-120, -60], [-60, -120], [20, -110], [90, -80], [140, -20], [-140, 20], [-60, 30], [40, 10], [100, 40], [-10, -40]].forEach(([x, y], i) => br += rec8(x, y, 1, { op: .5 + .5 * Math.max(0, Math.sin(t * 4 + i)) }));
    s += g(br, at(470, 790, 1.15));
    const kc = P01(t, tk, .5);
    if (kc > 0) s += g(cig8(t, { len: 300, h: 44, fc: '#D9973A', ember: false }) + ban8(0, 0, 150, P01(t, tk + .25, .5), { w: 14 }), at(860, 1150, EZ.back(kc) * .9));
    return g(s, push8(t, T, .05, 540, 860))
  };
  // 7. «А сам табак уже сто лет — один из главных подопытных науки.» — подопытный кролик превращается в лист табака в чашке Петри
  D.lab = (t, S, T) => {
    const tp = T.c('подопытных') - .5, km = E(t, tp, .7, 'io');
    let s = bgPar();
    for (let i = 0; i < 10; i++) s += Ln(`M${i * 120} 0V1920M0 ${i * 120 + 200}H1080`, 1, { c: INK, w: 1.5, op: .12 });
    s += petri8(540, 900, 330, '', 1);
    s += rabbit8(540, 800, 1.15 * (1 - km * .4), { op: 1 - km });
    s += g(leaf8({ len: 420, w: 170, r: 80 }), at(370, 930, km * 1), km);
    s += g(F(D_.rr(-90, -32, 180, 64, 12), C.paper) + Ln(D_.rr(-90, -32, 180, 64, 12), 1, { c: INK, w: 3 }) + tx('№ 1', 0, 14, { f: 'M', w: 800, s: 36, c: C.red }), at(820, 640, 1, 8), E(t, tp + .5, .4));
    return g(s, push8(t, T, .05, 540, 880))
  };
  // 8. «На нём открыли первый в истории вирус. В 1892 году, русский ботаник Дмитрий Ивановский.» — микроскоп и круг-окуляр: мозаика листа, палочки вируса
  const RODS = []; for (let i = 0; i < 22; i++) RODS.push([rnd(i * 3) * 360 - 180, rnd(i * 3 + 1) * 360 - 180, rnd(i * 3 + 2) * 180]);
  D.virus = (t, S, T) => {
    const tv = T.c('вирус') - .5, ty = T.c('1892') - .4;
    let s = bgDiag({ off: -t * 12 });
    s += scope8(260, 980, 1.15);
    const cx = 680, cy = 720, r = 300, id = uid();
    s += F(D_.circ(cx, cy, r + 14), C.navy3) + `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><g clip-path="url(#${id})">${F(D_.circ(cx, cy, r), C.green)}`;
    for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) { const x = cx - r + i * 75, y = cy - r + j * 75 + (i % 2) * 30; s += F(D_.ell(x, y, 36, 30), rnd(i * 13 + j) > .55 ? C.yellow : C.green2, { op: rnd(i * 13 + j) > .55 ? .55 : .7 }) }
    RODS.forEach(([x, y, a], i) => { const k = P01(t, tv + i * .06, .4); if (k > 0) s += F(D_.rr(-40, -8, 80, 16, 8), C.amber, { tr: `translate(${R(cx + x)} ${R(cy + y)}) rotate(${R(a + t * 10)}) scale(${R(EZ.back(k) * 100) / 100})` }) });
    s += '</g>' + Ln(D_.circ(cx, cy, r), 1, { c: C.paper, w: 6 });
    s += num8('1892', 680, 1160, t, ty, { s: 110, c: C.amber3 }) + lab8('д. ивановский', 680, 1230, { c: C.line, s: 28, op: E(t, T.c('Ивановский') - .4, .4) });
    return g(s, push8(t, T, .04))
  };
  // 9. «Табак стал первым растением, которое генетически изменили.» — двойная спираль входит в лист
  D.gmo = (t, S, T) => {
    const tg = T.c('генетически') - .5;
    let s = bgDiag({ off: -t * 12 });
    s += leaf8({ len: 900, w: 340, x: 300, y: 1260, r: 50 });
    const kd = E(t, T.a, 1.2, 'io');
    s += dna8(lerp(1300, 600, E(t, tg, 1, 'io')), lerp(1300, 600, E(t, tg, 1, 'io')) + 640, 640, t, kd, { amp: 80 });
    if (t > tg + .8) { const q = P01(t, tg + .8, .7); s += Ln(D_.circ(560, 760, lerp(40, 300, EZ.o(q))), 1, { c: C.yellow, w: 8 * (1 - q), op: 1 - q }) }
    return g(s, push8(t, T, .04))
  };
  // 10. «В 1986 году ему вставили ген светлячка — и он засветился.» — темнота, светлячок, куст табака загорается
  D.glow = (t, S, T) => {
    const tf = T.c('светлячка') - .6, tz = T.c('засветился') - .4, kz = E(t, tz, .8, 'io');
    let s = BG(C.night);
    if (kz > 0) s += F(D_.circ(540, 760, 520 * kz), C.yellow, { op: .08 }) + F(D_.circ(540, 760, 360 * kz), C.yellow, { op: .1 });
    s += plant8(t, { x: 540, y: 1220, h: 820, roots: 0 }).replace(/#5DB36A/g, kz > .5 ? '#E9F27A' : '#2C6B3D').replace(/#3E9152/g, kz > .5 ? '#C8DA4E' : '#1F4D2C');
    s += F(D_.rr(-200, 1220, 1480, 800, 0), C.soil);
    const kf = E(t, tf, 1.3, 'io');
    if (t > tf) s += firefly8(t, lerp(1250, 560, kf) + Math.sin(t * 3) * 20, lerp(300, 520, kf) + Math.sin(t * 5) * 14, 1.3);
    s += num8('1986', 540, 300, t, T.c('1986') - .3, { s: 110, c: C.amber3 });
    if (t > tz) cue(tz, 'shimmer', .6);
    return g(s, push8(t, T, .05, 540, 760))
  };
  // 11. «А лекарство от Эболы выращивали в листьях дикого табака. На заводе, который принадлежал табачной компании.» — лист → капля → флакон;
  //     завод с трубой-сигаретой
  D.ebola = (t, S, T) => {
    const tl = T.c('листьях') - .4, tz = T.c('заводе') - .4, kz = E(t, tz, .9, 'io');
    let s = BG(C.night) + F(D_.poly([[700, -400], [1460, -400], [-40, 2400], [-800, 2400]]), C.navy, { op: .8 });
    let a = leaf8({ len: 520, w: 200, x: 300, y: 1000, r: 30 }) + vial8(760, 860, 1.1, { fill: E(t, tl + .4, 1.2, 'io') });
    for (let i = 0; i < 3; i++) { const q = P01(t, tl + .3 + i * .4, .6); if (q > 0 && q < 1) s += F(D_.drop(lerp(420, 740, q), lerp(700, 640, q) - Math.sin(q * PI) * 160, 16), C.amber) }
    s += g(a, `translate(0 ${R(-kz * 420)}) ` + about(540, 860, 1 - kz * .45));
    if (kz > 0) { s += g(factory8(t, 0, 0, 1), at(560, lerp(1700, 1240, kz), 1.05)); cue(tz + .2, 'thud', .6) }
    return s
  };
  // 12. «Кстати, табака, который курят, в дикой природе нет. Он растёт только там, где его сажают люди.» — слева дикая трава, справа поле и рука сажает росток
  D.wild = (t, S, T) => {
    const tn = T.c('нет') - .3, ts = T.c('сажают') - .6;
    let s = BG('#7FB8E6') + F(D_.circ(860, 300, 90), C.yellow) + F(D_.rr(-200, 900, 1480, 1200, 0), C.green2);
    for (let i = 0; i < 26; i++) { const x = rnd(i) * 520, y = 950 + rnd(i + 3) * 380; s += Ln(`M${R(x)} ${R(y)}l-10 -40M${R(x)} ${R(y)}l4 -50M${R(x)} ${R(y)}l14 -36`, 1, { c: C.green3, w: 6 }) + (i % 4 === 0 ? F(D_.circ(x, y - 50, 9), i % 8 ? C.yellow : C.pink) : '') }
    s += F('M560 900H1300V2400H560Z', C.soil) + [0, 1, 2, 3, 4].map(r => F(D_.rr(560, 960 + r * 90, 760, 28, 14), C.soil2)).join('');
    [[640, 1000], [800, 1000], [960, 1000], [700, 1180], [880, 1180]].forEach(([x, y], i) => { s += rise8(plant8(t, { roots: 0, h: 320 }), x, y, t, ts + .2 + i * .15, { s: .55 }) });
    if (t > tn) s += g(ban8(0, 0, 90, P01(t, tn, .5), { w: 12 }) + tx('?', 0, 30, { f: 'M', w: 800, s: 90, c: C.paper, op: E(t, tn, .4) }), at(260, 760));
    const kh = E(t, ts - .3, .7, 'io');
    if (kh > 0) s += finger8(lerp(1400, 1010, kh), 1080, 1.05, { r: 180, f: C.skin, sl: C.eu });
    return g(s, push8(t, T, .04))
  };
  // 13. «Люди сто лет ставят опыты на табаке. А табак — на людях. Совпадение? Не думаю.» — зеркало: пипетка над листом / лист с пипеткой над мозгом;
  //     затем всё гаснет — красные глаза
  D.coinc = (t, S, T) => {
    const tb = T.c('табак', 1) - .3, tc = T.c('Совпадение') - .2, td = T.c('думаю') - .3;
    const dim = 1 - E(t, tc, .4) * .82;
    let s = BG(C.night) + F(D_.rr(538, -100, 4, 2200, 0), C.line, { op: .3 });
    let L = petri8(270, 1000, 200, leaf8({ len: 240, w: 100, x: -110, y: 10, r: 80 })) + finger8(270, 640, .8, { r: 90, f: C.skin, sl: C.eu }) + syringe8(270, 820, .55, { r: -90 });
    let Rr = petri8(810, 1000, 200, brain8(t, { shadow: false, x: 0, y: -10, s: .75 }));
    const kr = E(t, tb, .7, 'io');
    Rr += g(leaf8({ len: 300, w: 120, r: 170 }) + syringe8(0, 220, .55, { r: -90 }), at(810, lerp(300, 560, kr)), kr);
    s += g(rise8(L, 0, 0, t, T.a, { dy: 40 }) + Rr, '', dim);
    if (t > tc) { s += eyes8(540, 860, 1.2, E(t, tc + .15, .35, 'o5'), E(t, td, .3, 'io')); cue(tc + .1, 'eyes', .9) }
    return s
  };
  // 14. «Так кто кого приручил: человек табак — или табак человека?» — поводок: человек держит горшок с табаком → поводок у табака, ошейник у человека
  D.turn = (t, S, T) => {
    const tw = T.c('или') - .2, kw = E(t, tw, .8, 'io');
    let s = bgDiag({ off: -t * 12 });
    const hx = 300, hy = 900, px = 780, py = 1060;
    s += man8(hx, hy, 6.2, C.skin) + F(D_.rr(hx - 186, hy + 200, 372, 30, 0), C.eu);
    s += F('M-90 0H90L70 140H-70Z', '#B5523F', { tr: `translate(${px} ${py})` }) + plant8(t, { x: px, y: py, h: 420, roots: 0, s: .9 });
    const handA = [hx + 150, hy + 60], collarP = [px, py + 10], leafB = [px - 140, py - 260], neck = [hx, hy - 120];
    const a = [lerp(handA[0], leafB[0], kw), lerp(handA[1], leafB[1], kw)], b = [lerp(collarP[0], neck[0], kw), lerp(collarP[1], neck[1], kw)];
    s += Ln(`M${R(a[0])} ${R(a[1])}Q${R((a[0] + b[0]) / 2)} ${R(Math.max(a[1], b[1]) + 160)} ${R(b[0])} ${R(b[1])}`, 1, { c: C.amber, w: 8 });
    if (kw > .5) s += Ln(D_.ell(neck[0], neck[1], 70, 22), 1, { c: C.red, w: 14, op: clamp((kw - .5) * 2) });
    else s += Ln(D_.ell(px, py + 10, 100, 20), 1, { c: C.red, w: 12, op: 1 - kw * 2 });
    if (t > tw) cue(tw + .3, 'swish', .6);
    return g(s, push8(t, T, .05, 540, 900))
  };
  // 15. «В профиле — как табак воюет с жуками и почему гусеница парит.»
  D.cta = (t, S, T) => cta8(t, T, [{ k: 'bugs', t: ['Табак', 'против жуков'] }, { k: 'cat', t: ['Гусеница,', 'которая парит'] }]);

  window.EP = {
    P, D, clean: true, lead: .2, defs: V8DEFS,
    cap: { size: 58, top: 1360, hi: C.amber, st: C.night },
    tr: { title: 'dive', known: 'wave', claim: 'zc', langley: 'panL', dale: 'zc', brain: 'wave', lab: 'dive', virus: 'cut', gmo: 'zc', glow: 'cut', ebola: 'wave', wild: 'zc', coinc: 'cut', turn: 'wave' },
    trAt: { title: SEAL, claim: [540, 700], dale: [540, 760], lab: [540, 900], gmo: [540, 760], wild: [540, 900] },
    trR: { title: 80, lab: 90 },
    trCol: { claim: PAR, dale: C.night, gmo: C.night, wild: C.night },
    trCols: { known: [C.amber, C.paper, C.navy3], brain: [C.amber, C.paper, PAR2], ebola: [C.green, C.paper, '#7FB8E6'], turn: [C.amber, C.paper, C.navy3] },
    trBg: { title: C.night, lab: C.night },
    init() {
      const st = document.createElement('style');
      st.textContent = `#cap{font-weight:800!important;letter-spacing:0!important;text-shadow:0 0 2px ${C.night},0 3px 0 ${C.night},0 0 14px rgba(23,10,17,.85),2px 2px 0 ${C.night},-2px 2px 0 ${C.night},2px -2px 0 ${C.night},-2px -2px 0 ${C.night}!important}#cap .u{color:#F2E6CF!important;opacity:.55}`;
      document.head.appendChild(st);
    }
  };
})();
