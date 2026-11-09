// Никотин v10 · ролик C (nicsc, голос Stanislav): анимация «Морфинг».
//   Крупные плоские формы и смена фона цветом, как у «ОТКРОЙ ГЛАЗА на Coca-Cola». Один предмет в центре всё время перетекает в следующий:
//   одноразка → кристалл соли → сигарета → записка → профиль → колба → соль → яблоко → досье → сейф → ноутбук → «Джул» → пачка → манго →
//   человек → записка → «пирог» → дом → снова одноразка (петля). Сюжет связан и в картинке: каждая форма вырастает из прошлой.
(function () {
  'use strict';
  const { MONO, G2, mono, year, stamp9, curl9, cloud, crystal, lerp2, hex, PROF, THROAT, handVape, vape, QUOTE } = N9;
  const K = { navy: '#1B2848', navy2: '#24365F', coral: '#E9524A', coral2: '#C93E37', cream: '#F4EBDD', cream2: '#E3D5BE', mint: '#7FD1B9', mint2: '#4FAE93',
    gold: '#F2B544', gold2: '#D9902A', ink: '#141B30', red: '#E23B3B', white: '#FFFFFF', apple: '#8BD45A', steel: '#9AA6BB', steel2: '#6E7A90' };
  P = { bg: K.navy, paper: K.cream, ink: K.ink, line: K.cream, a1: K.gold, a2: K.red };
  const D = {};
  const CX = 540, CY = 820;
  let Q = null, KF = [], BGK = [];

  // ---------- формы (центр 0,0; один замкнутый контур — для morph) ----------
  function sp(d, s, cx = 0, cy = 0) { // масштаб пути с командами M L C H V Z (абсолютные)
    let cmd = '', i = 0;
    return d.replace(/([MLCHVZ])|(-?\d*\.?\d+)/g, (m, c, n) => { if (c) { cmd = c; i = 0; return c } const v = parseFloat(n); let r; if (cmd === 'H') r = (v - cx) * s; else if (cmd === 'V') r = (v - cy) * s; else r = (i % 2 ? (v - cy) : (v - cx)) * s; i++; return R(r) + ' ' })
  }
  const S_ = {
    vape: 'M-50 -470H50L80 -340C120 -340 150 -310 150 -270V270C150 310 120 340 80 340H-80C-120 340 -150 310 -150 270V-270C-150 -310 -120 -340 -80 -340Z',
    hex: hex(300),
    cig: D_.rr(-62, -430, 124, 860, 16),
    paper: D_.rr(-290, -370, 580, 740, 14),
    prof: sp(PROF, 2.25, 19, -23),
    flask: sp('M-34 -250H34V-120C110 -96 160 -30 160 50C160 150 88 210 0 210C-88 210 -160 150 -160 50C-160 -30 -110 -96 -34 -120Z', 1.6, 0, -20),
    apple: sp('M0 -70C-40 -110 -130 -90 -130 0C-130 80 -70 130 -30 120C-12 116 -6 110 0 110C6 110 12 116 30 120C70 130 130 80 130 0C130 -90 40 -110 0 -70Z', 2.4, 0, 20),
    folder: 'M-330 -190L-150 -190L-110 -240L330 -240L330 230L-330 230Z',
    circ: D_.circ(0, 0, 330),
    laptop: 'M-310 -240H310V160L380 250H-380L-310 160Z',
    juul: D_.rr(-370, -72, 740, 144, 64),
    pack: D_.rr(-175, -260, 350, 520, 20),
    mango: sp('M-110 0C-118 -80 -40 -130 30 -110C110 -88 140 -10 110 60C80 120 -20 130 -70 90C-96 70 -106 40 -110 0Z', 2.6, 5, 0),
    bust: 'M-240 340C-240 180 -160 110 -76 96C-136 56 -156 -18 -146 -80C-126 -206 126 -206 146 -80C156 -18 136 56 76 96C160 110 240 180 240 340Z',
    pie: D_.circ(0, 0, 320),
    house: 'M-300 330V-60L0 -330L170 -176V-290H240V-112L300 -60V330Z',
  };
  const MD = .62; // длительность перетекания
  function shapeAt(t) {
    let i = 0; while (i < KF.length - 1 && t >= KF[i + 1][0]) i++;
    const [t0, key, col] = KF[i];
    if (i === 0) return { d: S_[key], col, key, k: 1, t0 };
    const k = EZ.io5(clamp((t - t0) / MD)), [, pk, pcol] = KF[i - 1];
    return { d: k >= 1 ? S_[key] : morph(S_[pk], S_[key], k, 220), col: k >= 1 ? col : lerp2(pcol, col, k), key, k, t0, prev: pk }
  }
  function bgAt(t) {
    let i = 0; while (i < BGK.length - 1 && t >= BGK[i + 1][0]) i++;
    const [t0, c] = BGK[i];
    let s = `<rect x="-200" y="-200" width="1480" height="2320" fill="${i ? BGK[i - 1][1] : c}"/>`;
    if (i) { const k = EZ.io(clamp((t - t0) / .7)); s += `<circle cx="${CX}" cy="${CY}" r="${R(k * 1500)}" fill="${c}"/>` }
    // крупная косая полоса — как у Coca-Cola (фон «дышит»)
    s += `<path d="M${R(-400 + fl(t, 30, .03))} 2200L700 -200H1100L0 2200Z" fill="#fff" opacity=".05"/>`;
    return s
  }
  const shadowOf = (d, c = '#000', op = .22) => F(d, c, { op, tr: 'translate(22 30)' });
  const lab = (s, x, y, o = {}) => tx(s, x, y, { f: 'O', w: 700, s: o.s || 44, c: o.c || K.ink, ls: o.ls ?? 4, op: o.op, a: o.a });

  // ---------- кадр ----------
  function frame(t) {
    const q = Q, sh0 = shapeAt(t), ready = sh0.k >= .85 ? clamp((sh0.k - .85) / .15) : 0;
    let s = bgAt(t);
    const bob = fl(t, 8, .25), rot = fl(t, 1.2, .18);
    let body = shadowOf(sh0.d) + F(sh0.d, sh0.col);
    let over = '';   // поверх формы (в её координатах)
    let around = ''; // вокруг (в координатах кадра)
    const key = sh0.key;
    // --- детали по форме ---
    if (key === 'vape' && t < q.home + 2) { // заставка: блик, мундштук, огонёк; люди-точки вокруг; счётчик
      over += F('M-50 -470H50L80 -340H-80Z', K.ink, { op: .85 * ready }) + F(D_.rr(-120, -300, 30, 560, 15), '#fff', { op: .25 * ready }) + F(D_.circ(0, 270, 22), K.ink, { op: .5 * ready }) + F(D_.circ(0, 270, 13), '#fff', { op: ready });
      const kb = E(t, q.bil - .1, 1.6, 'o');
      if (kb > 0) { for (let i = 0; i < 260; i++) { const a = i * 2.39996, r = 430 + Math.sqrt(i) * 28, qq = clamp(kb * 2.2 - i / 200); if (qq > 0) around += `<circle cx="${R(CX + Math.cos(a) * r)}" cy="${R(CY + Math.sin(a) * r * .9)}" r="${R(7 * qq)}" fill="${[K.gold, K.mint, K.coral, K.cream][i % 4]}" opacity=".9"/>` }
        around += g(odo(1.25e9 * kb, 0, 0, { f: 'O', w: 700, s: 96, c: K.cream, sep: ' ' }), at(CX, 1300)) }
    }
    if (key === 'hex') { // соль: грани кристалла
      for (let i = 0; i < 6; i++) { const a0 = i * PI / 3 + PI / 6, a1 = a0 + PI / 3; over += F(`M0 0L${R(Math.cos(a0) * 300)} ${R(Math.sin(a0) * 300)}L${R(Math.cos(a1) * 300)} ${R(Math.sin(a1) * 300)}Z`, i % 2 ? '#fff' : K.gold, { op: (i % 2 ? .35 : .18) * ready }) }
      if (t > q.salt2 - .3 && t < q.chem) over += lab('СОЛЬ', 0, 20, { s: 90, c: K.ink, op: ready });
    }
    if (key === 'cig') { // сигарета: фильтр, кончик, дымок
      over += F(D_.rr(-62, 160, 124, 270, 16), K.gold, { op: ready }) + F(D_.rr(-62, -430, 124, 46, 14), '#5B5550', { op: ready }) + F(D_.rr(-62, -430, 124, 18, 8), K.red, { op: ready }) + F(D_.rr(-36, -380, 22, 520, 11), '#fff', { op: .3 * ready });
      if (ready > 0) over += curl9(0, -450, t, 300, '#fff', 9, .55 * ready);
    }
    if (key === 'paper') { // записка: шапка, цитата печатается, «молодёжный рынок» обводится
      const second = t > q.pay - .3;
      over += mono('R.J. REYNOLDS · 1973', -240, -290, { s: 24, c: '#7A6E58', op: ready }) + F(D_.rr(-240, -270, 480, 4, 2), '#C9B999', { op: ready });
      const kq = second ? 1 : clamp((t - q.quote) / (q.quoteE - q.quote - .2)); let n = Math.round(QUOTE.join('').length * kq), yy = -170;
      for (const l of QUOTE) { const m = Math.min(n, l.length); if (m > 0) over += mono(l.slice(0, m), -240, yy, { s: 38, c: K.ink, op: ready }); n -= m; yy += 76 }
      const tm = second ? q.pay + .3 : q.mol - .05;
      over += Ln('M-262 92C-120 120 230 118 280 92C324 70 314 36 226 30C80 22 -220 26 -284 58C-306 72 -296 90 -262 98', E(t, tm, .6), { c: K.red, w: 9 });
      over += stamp9('СЕКРЕТНО', 150, -340, t, (second ? q.pay : q.zap) - .1, { s: 36 });
    }
    if (key === 'prof') { // профиль: горло дерёт, кашель
      const hot = E(t, q.deret - .15, .35);
      const thr = sp(THROAT, 2.25, 19, -23);
      over += Ln(thr, ready, { c: lerp2('#9FD4E8', '#FF5A3C', hot), w: 30, op: .95 });
      if (hot > .05) { const P0 = pts(thr, 20); [6, 10, 14].forEach((i, j) => { const qq = clamp(hot * 3 - j * .6), [x, y] = P0[i], d = `M${R(x - 60)} ${R(y - 22)}L${R(x + 60)} ${R(y + 22)}`; if (qq > 0) over += Ln(d, qq, { c: '#fff', w: 16 }) + Ln(d, qq, { c: K.red, w: 9 }) }) }
      over += F(D_.ell(140, -103, 16, 22), K.ink, { op: ready }) + F(D_.rr(260, 50, 300, 46, 10), '#fff', { op: ready * (1 - E(t, q.deret + .5, .3)) }) + F(D_.rr(260, 50, 84, 46, 10), K.gold, { op: ready * (1 - E(t, q.deret + .5, .3)) });
      for (let i = 0; i < 3; i++) { const p = P01(t, q.deret + .45 + i * .2, 1.1); if (p > 0 && p < 1) around += cloud(CX + 330 + p * 220, CY + 60 - p * 200 - i * 40, .5 + p * .6, { op: (1 - p) * .9 }) }
    }
    if (key === 'flask') { // колба: жидкость поднимается, превращается в кристаллы
      const pour = clamp((t - q.lab) / 1.5), kc = E(t, q.kis + .2, .9, 'o');
      over += clip(sh0.d, F(D_.rr(-300, 330 - 560 * (.15 + .55 * pour), 600, 600, 0), lerp2('#F2B35A', '#FFF4CC', kc), { op: .9 }));
      if (kc > 0) for (let i = 0; i < 14; i++) { const qq = clamp(kc * 14 - i * .8); if (qq > 0) over += crystal(-120 + (i % 5) * 60, 250 - Math.floor(i / 5) * 56, 24 * EZ.back(qq), { r: i * 23 }) }
      around += lab('НИКОТИН', CX - 330, 470, { s: 48, c: K.cream, op: ready * (1 - kc) }) + lab('+ КИСЛОТА', CX + 330, 470, { s: 48, c: K.mint, op: ready * (1 - kc) });
    }
    if (key === 'hex' || key === 'apple') { // 30 вариантов — кольцо пробирок вокруг
      const nv = Math.floor(clamp((t - q.t30 + .2) / 1.0) * 30);
      for (let i = 0; i < nv; i++) { const a = -PI / 2 + i / 30 * 2 * PI, x = CX + Math.cos(a) * 470, y = CY + Math.sin(a) * 470, gr = i === 0 && t > q.apple - .4;
        around += g(F(D_.rr(-14, -44, 28, 88, 14), gr ? K.apple : [K.gold, K.cream, K.mint][i % 3]) + F(D_.rr(-14, -44, 28, 20, 10), '#fff', { op: .4 }), at(x, y, 1, a * 180 / PI + 90)) }
    }
    if (key === 'apple') over += Ln('M0 -150C0 -220 20 -260 50 -290', ready, { c: '#5A3A22', w: 18 }) + F('M30 -250C80 -330 190 -330 220 -280C150 -270 90 -240 30 -250Z', '#3E9152', { op: ready }) + Ln('M-200 -40C-210 10 -200 60 -175 100', ready, { c: '#fff', w: 22, op: .45 });
    if (key === 'folder') { // досье 1979 + штамп
      over += F(D_.rr(-280, -200, 560, 30, 6), '#fff', { op: .35 * ready }) + F(D_.rr(-260, -120, 230, 80, 8), K.cream, { op: ready }) + lab('№ 1979', -145, -64, { s: 46, op: ready });
      over += stamp9('КОНФИДЕНЦИАЛЬНО', 10, 90, t, q.konf - .05, { s: 54, r: -8, c: K.red });
      around += g(year('1979', 0, 0, t, q.stamp - .1, { s: 170, c: K.ink }), at(CX, 330));
    }
    if (key === 'circ' && t < q.stud) { // сейф: штурвал крутится, на «открыть» дверь уходит вбок
      const ko = E(t, q.otkr - .2, .8, 'io');
      over += F(D_.circ(0, 0, 270), K.steel2, { op: ready }) + F(D_.circ(0, 0, 255), K.steel, { op: ready });
      for (let i = 0; i < 12; i++) { const a = i * PI / 6; over += F(D_.circ(Math.cos(a) * 300, Math.sin(a) * 300, 14), K.steel2, { op: ready }) }
      const wh = t * 40 + ko * 200; for (let i = 0; i < 3; i++) over += F(D_.rr(-150, -14, 300, 28, 14), K.ink, { op: ready, tr: `rotate(${R(wh + i * 60)})` });
      over += F(D_.circ(0, 0, 40), K.cream, { op: ready });
      if (ko > 0) over += F(D_.circ(0, 0, 330), '#FFE9B0', { op: ko * .9 }) + [...Array(6)].map((_, i) => F(D_.rr(-250 + i * 84, -150, 66, 300, 6), [K.gold, K.cream, K.gold2][i % 3], { op: ko })).join('');
      around += g(year('1998', 0, 0, t, q.arch - .1, { s: 170, c: K.cream }), at(CX, 330));
    }
    if (key === 'laptop') { // ноутбук: записка и график, два студента со спины
      over += F(D_.rr(-280, -210, 560, 350, 8), '#E9EEF5', { op: ready }) + g(F(D_.rr(-100, -130, 200, 260, 6), '#FBF5E7') + [...Array(6)].map((_, i) => F(D_.rr(-80, -100 + i * 34, 150, 10, 4), '#8C8572', { op: .55 })).join(''), at(-140, -40), ready);
      over += Ln('M20 100C60 90 90 -40 140 -60S220 30 260 -110', clamp((t - q.stud - .2) / 1.4), { c: K.red, w: 9 });
      for (const [x, c1] of [[-170, '#5C6B8C'], [170, '#9A4B3C']]) around += g(F('M-150 0C-146 -110 -100 -170 -40 -180L40 -180C100 -170 146 -110 150 0Z', c1) + F(D_.ell(0, -250, 70, 80), '#C98F6A') + F('M-72 -240C-90 -360 90 -360 72 -240C60 -270 -60 -270 -72 -240Z', x < 0 ? '#2E2219' : '#C9A26A'), at(CX + x, 1330, 1.05), ready);
      around += lab('СТЭНФОРД · 2005', CX, 330, { s: 64, c: K.cream, op: ready });
    }
    if (key === 'juul') { // «Джул»: огонёк, в «окне» соль; патент со ссылкой на «Рейнольдс»
      over += F(D_.rr(-340, -48, 400, 18, 9), '#fff', { op: .25 * ready }) + F(D_.rr(150, -72, 220, 144, 60), '#DCE4EC', { op: ready }) + F(D_.circ(-240, 0, 16), '#fff', { op: ready * (.5 + .5 * Math.sin(t * 3)) });
      const ks = E(t, q.pat - .1, .7);
      for (let i = 0; i < 6; i++) { const qq = clamp(ks * 6 - i); if (qq > 0) over += crystal(190 + (i % 3) * 52, -22 + Math.floor(i / 3) * 44, 18 * EZ.back(qq), { r: i * 17 }) }
      around += g(year('2015', 0, 0, t, q.juul - .1, { s: 170, c: K.ink }), at(CX, 330));
      const kp = E(t, q.rey - .5, .6, 'o5');
      if (kp > 0) around += g(F(D_.rr(-330, -60, 660, 120, 10), '#FBF5E7') + mono('ПАТЕНТ: R.J. REYNOLDS · 1989', -300, 12, { s: 30, c: K.ink }) + Ln(D_.rr(-340, -70, 680, 140, 12), E(t, q.rey, .45), { c: K.red, w: 7 }), at(lerp(1700, CX, kp), 1150, 1, -2));
      around += lab('≈ ФЛЕШКА', CX, 1080, { s: 56, c: K.ink, op: E(t, q.fl - .2, .4) * (1 - kp) });
    }
    if (key === 'pack') { // пачка: крышка, сигареты; «= 1 картридж»
      over += F(D_.rr(-175, -260, 350, 120, 20), K.red, { op: ready }) + F(D_.rr(-175, -150, 350, 10, 0), '#000', { op: .12 * ready });
      for (let i = 0; i < 10; i++) over += F(D_.circ(-128 + (i % 5) * 64, -286 - (i < 5 ? 0 : 34), 26), '#E9A04E', { op: ready });
      around += g(F(D_.rr(-110, -40, 220, 80, 30), '#DCE4EC') + F(D_.rr(-90, -28, 120, 56, 18), K.gold, { op: .7 }), at(CX - 380, 1260, 1, -8), ready) + lab('=', CX - 180, 1290, { s: 90, c: K.cream, op: ready }) + lab('1 КАРТРИДЖ = 1 ПАЧКА', CX, 330, { s: 62, c: K.cream, op: ready });
    }
    if (key === 'mango') over += F('M30 -300C80 -440 260 -450 310 -380C210 -380 140 -330 80 -270Z', '#4CAF50', { op: ready }) + Ln('M-150 -130C-90 -230 10 -260 90 -250', ready, { c: '#fff', w: 24, op: .45 }) + lab('МАНГО', 0, 40, { s: 80, c: K.ink, op: .0 });
    if (key === 'bust') { // школьник; на «четвёртый» — класс 4×4, каждый четвёртый — с одноразкой
      over += F(D_.ell(-52, -96, 13, 17), K.ink, { op: ready }) + F(D_.ell(52, -96, 13, 17), K.ink, { op: ready }) + Ln('M-30 -30H30', ready, { c: K.ink, w: 9 });
      const kg = E(t, q.chetv - .5, .7, 'o5') * (1 - E(t, q.pay - .4, .4));
      if (kg > 0) { for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const i = r * 4 + c, lit = [2, 5, 11, 12].includes(i), x = CX + (c - 1.5) * 230, y = 560 + r * 250;
          around += g(F(S_.bust, lit ? K.gold : K.cream) + (lit ? F(D_.rr(150, -60, 40, 130, 18), K.mint) : '') + F(D_.ell(-52, -96, 13, 17), K.ink) + F(D_.ell(52, -96, 13, 17), K.ink), at(x, y + (1 - kg) * 120, .3), kg) + (lit ? cloud(x + 70, y - 110, .35 * kg, { c: '#FFE3B0', op: .9 * kg }) : '') }
        body = g(body, '', 1 - kg); over = g(over, '', 1 - kg) }
      around += lab('США · КАЖДЫЙ ЧЕТВЁРТЫЙ', CX, 290, { s: 52, c: K.cream, op: E(t, q.chetv - .3, .4) * (1 - E(t, q.pay - .4, .4)) });
    }
    if (key === 'pie') { // «пирог» компании: треть уходит к пачке; 12,8 млрд $
      const ks = E(t, q.deal + .5, .9, 'io'), off = ks * 230;
      const sl = (a0, a1) => `M0 0L${R(Math.cos(a0) * 320)} ${R(Math.sin(a0) * 320)}A320 320 0 0 1 ${R(Math.cos(a1) * 320)} ${R(Math.sin(a1) * 320)}Z`;
      over += F(sl(-PI / 2, -PI / 2 + 2 * PI / 3), K.navy, { op: ready }) + g(F(sl(-PI / 2, -PI / 2 + 2 * PI / 3), K.coral) + lab('1/3', 150, -70, { s: 70, c: K.cream }), `translate(${R(off * .87)} ${R(-off * .5)})`, ready);
      around += g(odo(12.8e9 * E(t, q.trin, 1.3, 'o'), 0, 0, { f: 'O', w: 700, s: 96, c: K.gold, pre: '$', sep: ' ' }), at(CX, 1330), E(t, q.trin - .1, .3));
      around += lab('ПРОИЗВОДИТЕЛЬ «МАЛЬБОРО»', CX, 300, { s: 52, c: K.cream, op: ready });
    }
    if (key === 'house') { // «домой»: дом с трубой, из трубы дым
      over += F(D_.rr(-70, 90, 140, 240, 10), K.navy, { op: ready }) + F(D_.rr(-220, -10, 110, 110, 8), K.gold, { op: ready }) + F(D_.rr(110, -10, 110, 110, 8), K.gold, { op: ready });
      if (ready > 0) over += curl9(205, -300, t, 280, '#fff', 12, .6 * ready);
      if (t > q.domoy - .05) around += ringWave(CX, CY, t, q.domoy, { c: K.cream, r0: 200, r1: 1100, w: 18, d: .8 });
    }
    if (key === 'vape' && t > q.home + 2) { // ВЫ: одноразки вокруг (в большинстве — соль), потом рука; прицел и 1973
      const kh = E(t, q.sami - .2, .9, 'o5');
      for (let i = 0; i < 10; i++) { const a = -PI / 2 + i / 10 * 2 * PI + .3, x = CX + Math.cos(a) * 470, y = CY + Math.sin(a) * 470, qq = E(t, q.you + i * .06, .4, 'back') * (1 - kh);
        around += g(F(S_.vape, [K.coral, K.mint, K.cream, '#9B6BDF', '#4F86E8'][i % 5]), at(x, y, .16 * qq)) + (i !== 3 && t > q.you + .8 ? crystal(x, y, 16 * qq, { r: i * 20 }) : '') }
      over += F('M-50 -470H50L80 -340H-80Z', K.ink, { op: .85 * ready }) + F(D_.rr(-120, -300, 30, 560, 15), '#fff', { op: .25 * ready });
      if (kh > 0) { body = g(body, '', 1 - kh); over = g(over, '', 1 - kh); around += handVape({ x: CX, y: lerp(1500, 960, kh), s: 1.15, c1: K.gold, c2: K.gold2, led: t > q.end ? .5 + .5 * Math.sin((t - q.end) * 5) : 1, op: kh }) }
      const kx = E(t, q.ran + .3, .7, 'o5');
      if (kx > 0) { const r = lerp(560, 300, kx); around += g(Ln(D_.circ(0, 0, r), 1, { c: K.red, w: 8 }) + Ln(`M${-r - 50} 0H${-r + 60}M${r - 60} 0H${r + 50}M0 ${-r - 50}V${-r + 60}M0 ${r - 60}V${r + 50}`, 1, { c: K.red, w: 8 }), at(CX, CY + 60, 1, kx * 30), kx) + g(year('1973', 0, 0, t, q.t73 - .1, { s: 150, c: K.red }), at(CX, 330)) }
    }
    // заголовок в начале
    if (t < q.bil) around += wipe2('ЧТО ВЫ ЗНАЕТЕ О', CX, 230, t, -.4, 40, K.cream2) + wipe2('НИКОТИНЕ?', CX, 370, t, -.3, 120, K.cream, 'U');
    // год назад 2026 → 1973 на тезисе
    if (t > q.y50 - .2 && t < q.memo) { const kr = E(t, q.y50, 1.2, 'io5'); around += g(year(String(Math.round(lerp(2026, 1973, kr))), 0, 0, t, q.y50 - .25, { s: 190, c: kr >= 1 ? K.gold : K.cream, d: .35, stag: .04 }), at(CX, 330)) }
    if (t > q.memo && t < q.harsh) around += g(year('1973', 0, 0, t, q.memo - .1, { s: 170, c: K.gold }), at(CX, 300), 1 - E(t, q.quote - .3, .3));
    const sc = 1 + .025 * Math.sin((t - sh0.t0) * 1.3);
    s += g(body + over, `translate(${CX} ${R(CY + bob)}) rotate(${R(rot)}) scale(${R(sc * 1000) / 1000})`) + around;
    return s
  }
  function wipe2(str, x, y, t, t0, sz, c, f = 'M') { const k = E(t, t0, .6, 'o5'); if (k <= 0) return ''; const id = uid(), w0 = tw(str, { f, w: 800, s: sz }) + 300; return `<clipPath id="${id}"><rect x="${R(x - w0 / 2)}" y="${R(y - sz * 1.05)}" width="${R(w0)}" height="${R(sz * 1.4)}"/></clipPath><g clip-path="url(#${id})">` + tx(str, x, y + (1 - k) * sz * 1.3, { f, w: 800, s: sz, c, ls: f === 'M' ? 9 : 0 }) + '</g>' }

  for (const k of ['title', 'claim', 'memo', 'harsh', 'lab', 'stamp', 'archive', 'juul', 'teens', 'deal', 'you']) D[k] = (t) => frame(t);

  window.EP = {
    P, D, clean: true, lead: .12, tr: {}, trDef: 'cut',
    cap: { size: 60, top: 1372, hi: K.gold, st: '#0E1428' },
    defs: () => V8DEFS(),
    init(tl, SC) {
      const T = {}; SC.forEach(S => T[S.key] = S.T);
      Q = {
        bil: T.title.s(1), claim: T.claim.a, salt: T.claim.c('солевой'), y50: T.claim.c('пятьдесят'), comp: T.claim.s(1),
        memo: T.memo.a, zap: T.memo.c('записку'), quote: T.memo.s(1), quoteE: T.memo.se(1), mol: T.memo.c('молодёжного'),
        harsh: T.harsh.a, deret: T.harsh.c('дерёт'),
        lab: T.lab.a, kis: T.lab.c('кислотой'), salt2: T.lab.s(1), chem: T.lab.s(2), t30: T.lab.c('тридцать'), apple: T.lab.c('яблоком'),
        stamp: T.stamp.a, konf: T.stamp.c('Конфиденциально'),
        arch: T.archive.a, otkr: T.archive.c('открыть'), stud: T.archive.s(1),
        juul: T.juul.a, dj: T.juul.c('Джул'), fl: T.juul.c('флешку'), pat: T.juul.s(1), rey: T.juul.c('Рейнольдс'), pod: T.juul.s(2), pachk: T.juul.c('пачке'), mango: T.juul.c('манго'),
        teens: T.teens.a, chetv: T.teens.c('четвёртый'), pay: T.teens.s(1),
        deal: T.deal.a, trin: T.deal.c('тринадцать'), home: T.deal.s(1), domoy: T.deal.c('домой'),
        you: T.you.a, sami: T.you.s(1), ran: T.you.s(2), t73: T.you.c('семьдесят'), end: T.you.s(3),
      };
      // перетекание формы: [время, форма, цвет]
      KF = [[0, 'vape', K.gold], [Q.salt - .1, 'hex', K.cream], [Q.comp - .15, 'cig', K.white], [Q.memo, 'paper', K.cream], [Q.harsh, 'prof', K.cream],
        [Q.lab, 'flask', '#BFE8DD'], [Q.salt2 - .15, 'hex', K.cream], [Q.apple - .2, 'apple', K.apple], [Q.stamp, 'folder', K.gold], [Q.arch, 'circ', K.steel],
        [Q.stud - .1, 'laptop', K.ink], [Q.juul, 'juul', '#5A606E'], [Q.pachk - .3, 'pack', '#FBFBF7'], [Q.mango - .2, 'mango', '#FFB829'],
        [Q.teens, 'bust', K.cream], [Q.pay - .1, 'paper', K.cream], [Q.deal, 'pie', K.cream], [Q.home + .2, 'house', K.cream], [Q.you, 'vape', K.gold]];
      // фон по сценам (круг расходится от центра)
      BGK = [[0, K.navy], [Q.comp - .15, K.coral], [Q.memo, K.navy], [Q.harsh, K.coral], [Q.lab, K.navy], [Q.stamp, K.cream2], [Q.arch, K.navy],
        [Q.juul, K.mint], [Q.teens, K.coral], [Q.pay - .1, K.navy], [Q.deal, K.navy2], [Q.home + .2, K.coral], [Q.you, K.navy]];
      for (const [tt] of KF.slice(1)) cue(tt, 'whoosh', .35);
      cue(Q.zap - .1, 'stamp', .55); cue(Q.konf - .05, 'stamp', 1.0); cue(Q.kis + .25, 'shimmer', .6); cue(Q.apple, 'pin', .7); cue(Q.deret + .45, 'puff', .7);
      cue(Q.otkr, 'whirr', .6); cue(Q.rey, 'pin', .6); cue(Q.trin, 'coins', .6); cue(Q.domoy, 'impact', .8); cue(Q.ran + .2, 'heart', .9); cue(Q.end + .2, 'heart', .9);
      const st = document.createElement('style'), c = '#0E1428';
      st.textContent = `#cap{font-weight:800!important;letter-spacing:0!important;text-shadow:${[...Array(16)].map((_, i) => `${(Math.cos(i * PI / 8) * 6).toFixed(1)}px ${(Math.sin(i * PI / 8) * 6).toFixed(1)}px 0 ${c}`).join(',')},0 8px 22px rgba(0,0,0,.5)!important}#cap .u{color:#F4EBDD!important;opacity:1!important}`;
      document.head.appendChild(st);
    }
  };
})();
