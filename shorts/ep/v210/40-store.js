  // ================= мир C — витрина в Нагое, 2014 (строки 4–5) =================
  // Стик сам выезжает из пачки Marlboro HeatSticks и садится в держатель IQOS (держатель лежит на зарядном футляре).
  // «нельзя поджечь»: зажигалка откидывает крышку, пламя лижет кончик — ни огонька, ни дыма. «Табак…»: пламя сжимается внутрь держателя и
  // становится лезвием нагревателя (#114), держатель — в разрезе тонкими линиями (#067), волны тепла; «вдвое холоднее» — два столбика: 684° и 330°.
  // Стык с машиной (мир D): камера ныряет в белый бок держателя — в машине он лежит в подстаканнике.
  let TC4 = null, KC = null, NCD = null;
  const HC = { x: 600, y: 1048, L: 420 }, SHELFC = 1180, LIGHTER = { x: 265, y: SHELFC }, HPACK = { x: 905, y: SHELFC };
  const tipC = () => [HC.x - HC.L / 2 + 8 - HC.L * .34 + 10, HC.y];   // торец стика (табак) — слева
  function storeCInit() {
    const w4 = (q, n) => Ws('s4', q, n), w5 = (q, n) => Ws('s5', q, n);
    TC4 = { j: TB.jBC, kot: w4('которую'), nelz: w4('нельзя'), podzh: w4('поджечь'), tab: w5('табак'), nagr: w5('нагреватель'), vdvoe: w5('вдвое'), hol: w5('холоднее'), kurt: w5('куртка') };
    const a = TC4; a.close = a.kurt - .45; a.jCD = a.close + .08;   // v21.2: без нырка в белый бок — держатель переезжает на подлокотник (45-car.js)
    KC = [KY(a.j + .45, 545, 1010, 1.12), KY(a.kot + .45, 520, 1030, 1.25), KY(a.podzh + .05, 330, 1050, 2.05), KY(a.tab + .45, 560, 1040, 1.75),
      KY(a.vdvoe + .1, 560, 800, 1.18), KY(a.hol + .3, 578, 790, 1.2), KY(a.jCD, 713, 919, .9)];   // держатель — того же размера и там же, где на подлокотнике
    NCD = { x: HC.x, y: HC.y - (HD.y - 960) * MCAR, m: MCAR };   // держатель в машине — (540, 1310), в MCAR раз меньше витринного (v21.1: был в пол-салона)
  }
  function lighter4(c, t) {   // зажигалка: хром в 3 тона, крышка на петле справа, колёсико, пламя
    const a = TC4, { x, y } = LIGHTER, w = 64, h = 100, top = y - h, open = eio(at(t, a.nelz - .05, a.nelz + .25)) * (1 - eio(at(t, a.tab + .2, a.tab + .45)));
    rasterPoly(c, [x + w / 2, y - 10, x + w / 2 + 50, y + 30, x - w / 2 + 50, y + 30, x - w / 2, y], 'rgba(0,0,0,.3)', 8, 2);
    rr(c, x - w / 2, top, w, h, 8); cel(c, x - w / 2, top, w, h, '#B9BFCC', { sw: .3, hx: .12, ha: .5 }); rr(c, x - w / 2, top, w, h, 8); lnB(c, 2.5, 'rgba(238,241,248,.6)');
    c.fillStyle = '#7C8396'; c.fillRect(x - w / 2, top + 22, w, 4);
    if (open > 0) { circ(c, x - 6, top - 6, 9, '#6B7184'); c.fillStyle = '#9AA1B3'; c.fillRect(x - 24, top - 14, 30, 14) }   // колёсико и ветрозащита
    c.save(); c.translate(x - w / 2, top + 22); c.rotate(2.3 * open); rr(c, 0, -40, w, 40, 7); cel(c, 0, -40, w, 40, '#C9CED9', { sw: .3, ha: .5 }); c.restore();   // крышка — петля слева, откидывается от футляра (v21.1)
    const fl = at(t, a.podzh - .12, a.podzh + .05) * (1 - at(t, a.tab - .05, a.tab + .1)); if (fl > 0) flame4(c, t, x - 8, top - 16, fl);
  }
  function flame4(c, t, x, y, k, s = 1) {   // язычок пламени: капля в 3 тона, дрожит
    const f = 1 + Math.sin(t * 31) * .06 + Math.sin(t * 17) * .05, H = 70 * s * k * f, W = 22 * s * k;
    c.save(); c.translate(x, y); c.beginPath(); c.moveTo(0, -H); c.bezierCurveTo(W * 1.1, -H * .45, W, 0, 0, 0); c.bezierCurveTo(-W, 0, -W * 1.1, -H * .45, 0, -H); fill(c, '#FF8A2A');
    c.beginPath(); c.moveTo(0, -H * .66); c.bezierCurveTo(W * .6, -H * .3, W * .5, 0, 0, 0); c.bezierCurveTo(-W * .5, 0, -W * .6, -H * .3, 0, -H * .66); fill(c, '#FFD27A');
    c.beginPath(); c.ellipse(0, -2, W * .35, H * .12, 0, 0, TAU); fill(c, '#5B8CFF'); c.restore();
  }
  function stickFly(t) {   // стик из пачки в держатель: [x, y, угол, доля полёта 0..1]
    const a = TC4, k = eio(at(t, a.kot - .1, a.kot + .55)), up = eo(at(t, a.kot - .1, a.kot + .15));
    const x0 = HPACK.x, y0 = HPACK.y - 190 - 40 * up, [tx0, ty0] = [HC.x - HC.L / 2 - 50, HC.y];
    return [lp(x0, tx0, k), lp(y0, ty0, k) - Math.sin(Math.PI * k) * 160, lp(-Math.PI / 2, 0, eio(at(t, a.kot, a.kot + .5))), k];
  }
  function bladeIn(c, t, kn, ko = 1, kw = 1) {   // v21.1: внутри держателя — стик, его табачная часть и острое лезвие нагревателя: серое → раскалённое; kw — волны тепла
    const x0 = HC.x - HC.L / 2 + 8, hy = HC.y, tip = x0 + 34, base = x0 + 132;
    rr(c, x0, hy - 17, 104, 34, 4); fill(c, 'rgba(247,244,236,.9)');   // бумага стика внутри
    rr(c, x0 + 22, hy - 14, 82, 28, 3); fill(c, '#B9874A'); c.fillStyle = 'rgba(90,55,25,.45)'; for (let i = 0; i < 9; i++) c.fillRect(x0 + 26 + i * 9, hy - 12 + (i % 3) * 7, 6, 2);   // табак
    const g = c.createLinearGradient(tip, 0, base, 0); g.addColorStop(0, mixc('#C9CDD6', '#FFE08A', kn)); g.addColorStop(1, mixc('#8E929E', '#FF8A2A', kn));
    poly(c, [tip, hy, tip + 26, hy - 7, base, hy - 7, base, hy + 7, tip + 26, hy + 7]); c.fillStyle = g; c.fill(); lnB(c, 1.5, 'rgba(20,23,51,.45)');
    rr(c, base, hy - 20, 26, 40, 5); fill(c, '#6E7488');   // держатель лезвия
    if (kn > 0) glow(c, (tip + base) / 2, hy, 120, '#FF9A3A', .45 * kn * ko);
    if (kn > 0 && kw > 0) for (let i = 0; i < 4; i++) { const u = (t * .7 + i * .25) % 1, wx = tip - 10 + i * 40; smokeLine(c, [wx, hy - 50 - u * 40, wx + 14, hy - 140 - u * 60, wx - 8, hy - 230 - u * 80, wx + 10, hy - 320 - u * 90], 9, C4.heat, .4 * kn * kw * Math.sin(Math.PI * u)) }
  }
  function thermo4(c, t) {   // «вдвое холоднее»: огонь 684° и нагрев 330° — столбики над держателем
    const a = TC4, k1 = eo(at(t, a.vdvoe - .1, a.vdvoe + .4)), k2 = eo(at(t, a.hol - .15, a.hol + .3)), out = eio(at(t, a.close - .25, a.close + .05)); if (k1 <= 0 || out >= 1) return;
    const kv = [eo(at(FT, a.vdvoe - .1, a.vdvoe + .4)), eo(at(FT, a.hol - .15, a.hol + .3))];   // цифры — по времени кадра: в размытии не двоятся
    const base = 800, Hmax = 420;
    [[440, 684, '#E2412F', TEXT.fire, k1, kv[0]], [700, 330, '#FF9A3A', TEXT.blade, k2, kv[1]]].forEach(([x, v, col, lab, k, kn]) => { if (k <= 0) return; const H = Hmax * v / 684 * kn;
      c.save(); c.globalAlpha *= 1 - out; rr(c, x - 50, base - Hmax - 20, 100, Hmax + 20, 50); fill(c, 'rgba(238,241,248,.08)'); rr(c, x - 50, base - Hmax - 20, 100, Hmax + 20, 50); lnB(c, 3, 'rgba(238,241,248,.4)');
      rr(c, x - 38, base - H, 76, H, 38); cel(c, x - 38, base - H, 76, H, col, { sw: .3, hx: .14 }); circ(c, x, base + 20, 56, col);
      const Hn = Hmax * v / 684 * kn; tx(c, Math.round(v * kn) + '°', x, base - Hn - 46, { f: 'M', w: 800, s: 54, c: '#F4F1EA' }); tx(c, lab, x, base + 100, { f: 'M', w: 800, s: 28, c: '#F4F1EA', ls: 3 }); c.restore() });   // v21.2: и число, и его место — по времени кадра
  }
  function storeC(c, t) {   // фон: графит, ряды коробок в глубине, стеклянная полка, луч сверху
    c.fillStyle = C4.graph; c.fillRect(-3000, -3000, 7000, 7000);
    c.save(); c.globalAlpha *= .5; for (let r = 0; r < 4; r++) { const y = 320 + r * 230; c.fillStyle = '#23262D'; c.fillRect(-600, y + 120, 2300, 14); for (let i = 0; i < 26; i++) { c.fillStyle = (i + r) % 3 ? '#3A3E4A' : '#454A58'; c.fillRect(-560 + i * 88, y + 30, 60, 90) } } c.restore();
    beam(c, 560, -200, 560, SHELFC, 60, 520, '#FFE6B8', .16);
    c.fillStyle = 'rgba(200,230,255,.18)'; c.fillRect(80, SHELFC, 940, 14); c.fillStyle = 'rgba(220,240,255,.55)'; c.fillRect(80, SHELFC, 940, 3); c.fillStyle = '#1B1D23'; c.fillRect(-3000, SHELFC + 14, 7000, 3000);
  }
  function storeWorld(c, t, q) {
    const a = TC4; storeC(c, t);
    c.beginPath(); c.ellipse(HC.x + 18, SHELFC + 2, 186, 12, 0, 0, TAU); fill(c, 'rgba(0,0,0,.32)');
    rr(c, HC.x - 170, HC.y + 42, 340, 90, 30); cel(c, HC.x - 170, HC.y + 42, 340, 90, '#E6E7EB', { sw: .25 }); rr(c, HC.x - 170, HC.y + 42, 340, 90, 30); lnB(c, 2, 'rgba(20,23,51,.3)');   // зарядный футляр
    heat4(c, HPACK.x, HPACK.y, 1, 0);
    const [sx, sy, sa, sk] = stickFly(t), inH = sk >= 1;
    const cut = eio(at(t, a.tab + .1, a.tab + .5)) * (1 - eio(at(t, a.close - .35, a.close))), kn = eio(at(t, a.nagr - .25, a.nagr + .3));
    if (!HIDE_H) iqos4(c, HC.x, HC.y, HC.L, { left: true, stick: inH ? 1 : 0, name: true, cut: cut > .5, shadow: false });
    if (cut > 0) { c.save(); c.globalAlpha *= Math.min(1, cut * 2); bladeIn(c, t, kn, 1, 1 - at(t, a.vdvoe - .35, a.vdvoe)); c.restore() }   // волны тепла гаснут, когда встают столбики
    if (!inH && sk > 0) { c.save(); c.translate(sx, sy); c.rotate(sa); rr(c, -71, -9, 142, 18, 4); fill(c, '#F7F4EC'); c.fillStyle = '#C9A266'; c.fillRect(-71, -9, 22, 18); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(-71, 3, 142, 6); c.restore() }
    lighter4(c, t);
    const fk = at(t, a.tab - .05, a.tab + .4); if (fk > 0 && fk < 1) { const fx = lp(LIGHTER.x - 8, HC.x - HC.L / 2 + 70, eio(fk)), fy = lp(LIGHTER.y - 116, HC.y + 10, eio(fk)); flame4(c, t, fx, fy, 1 - fk * .85) }   // пламя улетает внутрь и сжимается в лезвие
    thermo4(c, t);
  }
  function storeShot(c, t) {
    const q = camObj(camAt(KC, t)); layer(c, q, 1, cc => storeWorld(cc, t, q));
    const a = TC4; capS(c, TEXT.nofire, 540, 330, at(t, a.podzh + .12, a.podzh + .45) * (1 - at(t, a.tab - .2, a.tab + .05)), { s: 56 });
    capS(c, TEXT.half, 540, 300, at(t, a.hol + .05, a.hol + .3) * (1 - at(t, a.close - .3, a.close - .05)), { s: 52 });
  }

  // ================= японское шоу (мир E): его показывает экран машины и телевизор в магазине =================
  // Студия: яркие полосы, лучи софитов, за столом два белых силуэта комиков, между ними на подставке IQOS; на «расхвалили» — звёздочки и смех.
  function comic4(c, x, y, d, t, ks, lau, i) {   // комик за столом: плечи, голова, рука с микрофоном у рта, другая — жест (на «расхвалили» — к айкосу)
    c.save(); c.translate(x, y); c.scale(d, 1); const W = '#FFFFFF', S = '#D9DCE6';
    c.beginPath(); c.moveTo(-92, 150); c.quadraticCurveTo(-98, 30, -52, 8); c.quadraticCurveTo(0, -6, 52, 8); c.quadraticCurveTo(98, 30, 92, 150); c.closePath(); fill(c, W);   // плечи и грудь
    c.save(); c.clip(); c.fillStyle = S; c.fillRect(40, -20, 80, 200); c.restore();
    poly(c, [-14, 10, 14, 10, 0, 44]); fill(c, i ? '#E7A9B6' : '#8FC7F0');   // галстук-бабочка / ворот
    rr(c, -14, -24, 28, 30, 10); fill(c, W); circ(c, 0, -62, 42, W); c.save(); c.beginPath(); c.arc(0, -62, 42, 0, TAU); c.clip(); c.fillStyle = S; c.fillRect(18, -110, 40, 100); c.restore();
    const g = ks > 0 ? Math.sin(t * 7 + i) * .15 : Math.sin(t * 3 + i * 2) * .1;   // рука-жест: к центру стола (к айкосу)
    c.save(); c.translate(60, 30); c.rotate(-.9 + g - .5 * ks); rr(c, -14, -14, 120, 28, 14); fill(c, W); c.translate(108, 0); c.rotate(-.7 + g); rr(c, -12, -12, 80, 24, 12); fill(c, W); circ(c, 76, 0, 17, W); c.restore();
    c.save(); c.translate(-58, 34); c.rotate(-2.2 + .1 * Math.sin(t * 5 + i)); rr(c, -14, -14, 96, 28, 14); fill(c, S); c.translate(86, 0); c.rotate(1.9); rr(c, -12, -12, 70, 24, 12); fill(c, S); circ(c, 64, 0, 16, S);
      c.translate(64, 0); c.rotate(-.5); rr(c, -6, -46, 12, 50, 5); fill(c, '#2B2F3A'); circ(c, 0, -52, 13, '#3A3F4C'); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(-6, -60, 4, 10); c.restore();   // микрофон
    c.restore();
  }
  function showDraw(c, t, cx, cy, w) {   // кадр шоу 16:9 с центром (cx, cy) шириной w
    const h = w * 9 / 16, s = w / 1080; c.save(); c.translate(cx - w / 2, cy - h / 2); c.scale(s, s);
    const H = 607.5; c.fillStyle = '#F2B84B'; c.fillRect(0, 0, 1080, H);
    for (let i = 0; i < 14; i++) { const a0 = i * TAU / 14 + t * .15, a1 = a0 + TAU / 28; c.beginPath(); c.moveTo(540, 260); c.arc(540, 260, 900, a0, a1); c.closePath(); fill(c, i % 2 ? '#F6C76B' : '#EFA93A') }
    c.fillStyle = '#E7A9B6'; c.fillRect(0, 0, 1080, 60); c.fillStyle = '#8FC7F0'; c.fillRect(0, 60, 1080, 18);
    for (const x of [120, 960]) beam(c, x, -40, x < 540 ? 300 : 780, 420, 8, 90, '#FFFFFF', .22);
    const ks = TD4 ? eo(at(t, TD4.rash - .05, TD4.rash + .4)) : 0, lau = TD4 ? at(t, TD4.kom - .1, TD4.kom + .3) : 0;
    [[250, 1], [830, -1]].forEach(([x, d], i) => { const hop = lau > 0 ? Math.abs(Math.sin(t * 9 + i * 1.7)) * 14 * lau : 0; comic4(c, x, 300 - hop, d, t, ks, lau, i);   // v21.2: комики — плечи, жесты, микрофоны
      if (lau > 0) { c.strokeStyle = `rgba(29,63,143,${.9 * lau})`; c.lineWidth = 6; c.lineCap = 'round'; for (let k = 0; k < 3; k++) { const a = -2.2 + k * .5 + (d < 0 ? 1.6 : 0); c.beginPath(); c.moveTo(x + Math.cos(a) * 80, 160 - hop + Math.sin(a) * 80); c.lineTo(x + Math.cos(a) * 114, 160 - hop + Math.sin(a) * 114); c.stroke() } } });
    rr(c, 80, 420, 920, 190, 18); fill(c, '#2F6FD6'); c.fillStyle = '#1D3F8F'; c.fillRect(80, 520, 920, 90); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(80, 430, 920, 10);   // стол — перед комиками
    poly(c, [476, 420, 604, 420, 590, 344, 490, 344]); fill(c, '#FFFFFF'); c.fillStyle = '#D9DCE3'; c.fillRect(576, 344, 20, 76); rr(c, 466, 330, 148, 18, 6); fill(c, '#EDEFF4');   // подиум-витрина
    beam(c, 540, -40, 540, 330, 6, 120, '#FFFFFF', .18);
    iqos4(c, 540, 300, 230, { name: true, glow: TD4 ? eo(at(t, TD4.aik - .05, TD4.aik + .3)) : 0, shadow: false });
    if (ks > 0) for (let i = 0; i < 7; i++) { const a = i * TAU / 7 + t * .8, r = 150 + 20 * Math.sin(t * 5 + i); star(c, 540 + Math.cos(a) * r, 290 + Math.sin(a) * r * .55, 18 * ks * (.7 + .3 * Math.sin(t * 9 + i)), '#FFFFFF') }
    c.restore();
  }

  // ================= мир F — магазин в Японии, 2016 (строки 6–7) =================
  // Шоу идёт на телевизоре у входа; рядом полки с рядами коробок IQOS. «смели с полок» — поток белых фигурок (#103), коробки исчезают волной.
  // «Без огня — значит, без вреда?»: свет гаснет, луч сверху — на полке один держатель, пар над ним загибается в «?» (#009).
  let TF = null, KF = null, NFG = null;
  // 24.11 (ТЗ 16:9): в широком кадре телевизор левее, полки с коробками — во всю правую часть
  const WDF = !!window.WIDE, SHX = WDF ? 300 : 490, SHW = WDF ? 1640 : 590, SHN = WDF ? 20 : 7;
  const TVF = { x: WDF ? -260 : 300, y: 820, w: 420 }, HF = { x: 760, y: 802, L: 180 }, SHELVES = [560, 820, 1080];
  function storeFInit() {
    const w6 = (q, n) => Ws('s6', q, n), w7 = (q, n) => Ws('s7', q, n);
    TF = { j: TD4.jDF, aik2: w6('айкосы'), smel: w6('смели'), pol: w6('полок'), bez: w7('без'), vred: w7('вреда'), cherez: Ws('s8', 'через') };
    const a = TF; a.off = a.bez - .1; a.jFG = a.cherez + .12;
    KF = [KY(a.j + .1, TVF.x, 822.7, 1080 / TVF.w), KY(a.j + .65, TVF.x + 120, 860, 1.6), KY(a.aik2 + .1, 610, 900, 1.06), KY(a.pol + .4, 690, 930, 1.1), KY(a.vred - .2, 760, 780, 1.75), KY(a.vred + .55, 760, 760, 2.45), KY(a.jFG, 760, 770, 2.6)];
    NFG = { x: HF.x, y: HF.y - 140, m: 1 };   // держатель в лаборатории — (540, 1100)
  }
  function crowdF(c, t) {   // поток белых фигурок слева направо: фронт — fx
    const a = TF, k = at(t, a.smel - .25, a.smel + 1.05); if (k <= 0 || k >= 1) return;
    for (let i = 0; i < (WDF ? 26 : 16); i++) { const x = lp(WDF ? -900 : -500, WDF ? 3300 : 1700, k) - i * 95 - (i % 3) * 30, bob = Math.abs(Math.sin(t * 12 + i)) * 10, m = i % 2 === 0;
      if (x < (WDF ? -1000 : -200) || x > (WDF ? 2500 : 1350)) continue; fig(c, x, 1440 - bob - (i % 2) * 18, 1.65, { m, col: '#F4F1EA', hat: i % 5 === 2 }) }
  }
  const crowdFront = t => TF ? lp(WDF ? -900 : -500, WDF ? 3300 : 1700, at(t, TF.smel - .25, TF.smel + 1.05)) : -1e9;
  function storeFWorld(c, t, q) {
    const a = TF; c.fillStyle = '#E9E1D2'; c.fillRect(-3000, -3000, 7000, 7000);
    c.fillStyle = '#D9CFBD'; for (let x = -1000; x < 2400; x += 160) c.fillRect(x, 0, 6, 1350);
    c.fillStyle = '#F7F4EC'; for (let i = WDF ? -4 : 0; i < (WDF ? 9 : 6); i++) { rr(c, -200 + i * 290, 90, 220, 26, 13); c.fill() }   // лампы дневного света
    c.fillStyle = '#C9C2B4'; c.fillRect(-3000, 1350, 7000, 3000); c.fillStyle = '#B9B1A2'; c.fillRect(-3000, 1350, 7000, 10);
    const front = crowdFront(t);
    SHELVES.forEach((y, r) => { c.fillStyle = '#8A8F9C'; c.fillRect(SHX + 10, y - 230, 10, 240); if (WDF) c.fillRect(SHX + SHW - 20, y - 230, 10, 240); c.fillStyle = '#D8D4CC'; c.fillRect(SHX, y, SHW, 22); c.fillStyle = '#B9B5AD'; c.fillRect(SHX, y + 22, SHW, 8);
      for (let i = 0; i < SHN; i++) { const bx = SHX + 30 + i * 78; if (front > bx + 60 + r * 20) continue; if (r === 1 && Math.abs(bx + 31 - HF.x) < 39) continue; box4(c, bx, y - 96, 62, 96) } });
    c.fillStyle = '#20232E'; c.fillRect(TVF.x - 14, TVF.y + TVF.w * 9 / 32, 28, 300); rr(c, TVF.x - 120, TVF.y + TVF.w * 9 / 32 + 290, 240, 20, 8); fill(c, '#20232E');   // стойка ТВ
    rr(c, TVF.x - TVF.w / 2 - 16, TVF.y - TVF.w * 9 / 32 - 16, TVF.w + 32, TVF.w * 9 / 16 + 32, 14); fill(c, '#16181F');
    c.save(); c.beginPath(); c.rect(TVF.x - TVF.w / 2, TVF.y - TVF.w * 9 / 32, TVF.w, TVF.w * 9 / 16); c.clip(); showDraw(c, t, TVF.x, TVF.y, TVF.w); c.restore();
    crowdF(c, t);   // v21.2: после «раскупили» полка пустая — держатель опускается в луч, когда гаснет свет (spotScene)
    const off = at(t, a.off - .35, a.off + .65); spotScene(c, t, HF.x, HF.y, HF.L, off, a.vred, 1);
  }
  function storeFShot(c, t) {
    const a0 = TF; if (t < a0.j + .1) {   // v21.2: экран машины = телевизор магазина; шоу стоит на месте, салон уезжает вниз, магазин приходит сверху — без рывка в айкос
      const e = eio(at(t, a0.j - .35, a0.j + .1)), qd = camObj(camAt(KD, t)), qf = camObj(camAt(KF, t));
      const yb = HH * e;   // шторка сверху вниз: выше границы — магазин, ниже — салон; оба мира стоят, телевизор магазина = экран машины на том же месте (без дублей)
      c.save(); c.beginPath(); c.rect(0, 0, WW, yb); c.clip(); layer(c, qf, 1, cc => storeFWorld(cc, t, qf)); c.restore();
      c.save(); c.beginPath(); c.rect(0, yb, WW, HH - yb); c.clip(); carWorld(c, t, qd); c.restore();
      if (e > 0 && e < 1) { const g = c.createLinearGradient(0, yb - 14, 0, yb + 14); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, 'rgba(0,0,0,.4)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, yb - 14, WW, 28) }
      const w = SCR.w * qd.z, cy = (SCR.y - qd.y) * qd.z + 960; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); c.rect(540 - w / 2, cy - w * 9 / 32, w, w * 9 / 16); c.clip(); showDraw(c, t, 540, cy, w); c.restore();
      return }
    const q = camObj(camAt(KF, t)); layer(c, q, 1, cc => storeFWorld(cc, t, q));
    const a = TF; capS(c, TEXT.soldout, 540, 330, at(t, a.smel + .35, a.smel + .7) * (1 - at(t, a.bez - .3, a.bez)), { s: 58 });
    capS(c, TEXT.noharm, 540, 250, at(t, a.vred + .15, a.vred + .45) * (1 - at(t, a.jFG - .45, a.jFG - .15)), { s: 58 });   // выше «?» (v21.1)
  }
