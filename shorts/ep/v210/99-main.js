  // ================= сборка главы 4: миры подряд, одна камера, плашка года, кадр, звуки =================
  // Миры: A кофейня → B бумажный глобус → C витрина в Нагое → D ночная машина → F магазин (шоу) → G лаборатория → H кабинет FDA с картой США
  // → A кофейня (карта на столе) → J доска (только фильм). На каждом стыке у миров общие ключи камеры (linkK), кадр на стыке одинаков в обоих мирах.
  const SEG = []; let INITED = false;
  function keys() { return { endT: TLX.endT, b0: TLX.b0, vEnd: TLX.vEnd } }
  function allInit() {
    if (INITED) return; INITED = true;
    cafeInit(); globeInit(); linkK(KA1, KB, { x: 660, y: 1990, m: BALL_R / GB.R }, true);   // комок падает в темноту — это глобус
    storeCInit(); linkK(KB, KC, NBC, true);   // в точке Нагои — витрина
    carInit();   // v21.2: держатель переезжает из витрины на подлокотник (без нырка в белое — carShot)
    storeFInit();   // v21.2: экран машины = телевизор магазина, шоу стоит, окружение меняется шторкой (storeFShot)
    labInit(); linkK(KF, KG, NFG, true);   // луч в темноте — одинаковый в магазине и в лаборатории
    deskInit(); linkK(KG, KH, NGH, true);   // страница журнала во весь экран: тот же журнал на столе FDA (v21.1: без нырка в белое)
    mapInit(); cafe2Init(); linkK(KH, KAE, N_HA, false);   // карта США на столе FDA = карта на столе кофейни
    if (MODE === 'y') boardInit();   // v21.1: кадр кофейни сжимается в фото карточки 2014 (photoOver) — без нырка в белое
    const W = (a, b) => SHUT.push([a, b]);
    W(TA.fall1 - .45, TA.jAB + 1.15); W(TB.dive - .1, TB.jBC + .35); W(TC4.close - .1, TC4.jCD + .4); W(TD4.kom + .2, TD4.jDF + .3); W(TG.jGH - .45, TG.jGH + .65);
    W(TH.pat + .35, TH.land + .1); W(TH.vygn, TH.vygn + .65); W(TH.jHA - .1, TH.jHA + .85); W(TM.brosaj + .5, TM.inBin + .1);
    if (MODE !== 'y') W(TM.amerQ + .05, TM.amerQ + .5);
    W(TC4.vdvoe - .2, TC4.close); W(TH.sela - .3, TH.doll + .5); W(TH.kom - .55, TH.kom + .6);   // v21.2: термометры, горящие доллары, молоток — короткая выдержка (без двоения)
    SEG.push([-1e9, (c, t) => { cafeShot(c, t, KA1, t, {}); cafePlates1(c, t) }], [TA.jAB, globeShot], [TB.jBC, storeShot], [TC4.jCD, carShot], [TD4.jDF - .35, storeFShot], [TF.jFG, labShot],
      [TG.jGH, (c, t) => { deskShot(c, t); mapPlates(c, t) }], [TH.jHA, cafe2Shot]);
    if (MODE === 'y') SEG.push([TM.jAJ, boardShot]);
  }
  function vturn(KA, KB, f = 2.2) {   // v21.1: нырок «в белое» — на стыке зум разворачивается на полном ходу, камера не замирает на белом кадре (было до 0,5 с белого)
    const a1 = KA[KA.length - 3], a2 = KA[KA.length - 2], b1 = KB[1], b2 = KB[2];
    a2.v = [0, 0, f * (a2[3] - a1[3]) / (a2[0] - a1[0]), 0]; b1.v = [0, 0, f * (b2[3] - b1[3]) / (b2[0] - b1[0]), 0];
  }
  function scene(c, t) { allInit(); let f = SEG[0][1]; for (const s of SEG) if (t >= s[0]) f = s[1]; f(c, t) }
  let HY = null;
  function hud(c, t) {   // плашка года — только вперёд: 2014 → 2016 → 2017 → 2020, уходит на «Помните» (1973 и 1988 — назад нельзя); 2021 → 2024, уходит до строки 16 / вопроса
    if (!HY) HY = { t14: Ws('s4', 'две'), t16: Ws('s6', 'шестнадцатом'), t17: Ws('s8', 'год'), t20: Ws('s10', 'двадцатом'), out1: Ws('s11', 'помните') - .5, t21: Ws('s13', 'двадцать'),
      t24: Ws('s14', 'двадцать'), out2: MODE === 'y' ? WsB('s15', 'вы') + .2 : Ws('q', 'угадаете') - .6 };   // v21.1: год — на «в две тысячи…», «в двадцать…»; 2020 уходит до «Помните»
    const h = HY, pill = (y0, y1, k, dy = 0) => { c.save(); c.setTransform(1, 0, 0, 1, 0, dy); yearPill(c, y0, y1, k, 1, true); c.restore() };
    if (t < h.t14 - .25) return;
    if (t < h.t16 - .3) return pill(2014, 2014, 1, -240 * (1 - eo(at(t, h.t14 - .25, h.t14 + .15))));
    if (t < h.t17 - .3) return pill(2014, 2016, at(t, h.t16 - .1, h.t16 + .2));   // v21.2: барабан щёлкает быстрее — не «висит» на полпути
    if (t < h.t20 - .3) return pill(2016, 2017, at(t, h.t17 - .1, h.t17 + .2));
    if (t < h.out1 + .45) return pill(2017, 2020, at(t, h.t20 - .1, h.t20 + .2), -240 * ei(at(t, h.out1, h.out1 + .45)));
    if (t < h.t21 - .25) return;
    if (t < h.t24 - .3) return pill(2021, 2021, 1, -240 * (1 - eo(at(t, h.t21 - .25, h.t21 + .15))));
    if (t < h.out2 + .45) return pill(2021, 2024, at(t, h.t24 - .1, h.t24 + .2), -240 * ei(at(t, h.out2, h.out2 + .45)));
  }
  let MBC = null; const SHUT = [];   // окна короткой выдержки — на быстрых нырках и проездах
  function sceneMB(c, t) {   // затвор 180° — среднее 4 моментов за полкадра
    const n = 4, sh = SHUT.some(([a, b]) => t > a && t < b) ? 1 / 240 : 1 / 60; if (!MBC) MBC = wideCanvas(mk, WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { scene(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); scene(g, tj);
      if (window.WIDE) wideRaw(c); else c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function frame(t) { frameTo(X, t) }
  function frameTo(c, t) {
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH); FT = t;
    if (window.NOMB) scene(c, t); else sceneMB(c, t);
    c.setTransform(1, 0, 0, 1, 0, 0); hud(c, t); subs(c, t);
  }
  function cues() {   // звуки по событиям (мягкие)
    allInit(); const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    const a = TA; Q(.05, 'city', .25); Q(a.marl, 'shimmer', .25); Q(a.poob, 'pageflip', .7); Q(a.poob + .2, 'papers', .3); Q(a.brit - .05, 'papers', .5); Q(a.brit + .1, 'whoosh', .3, -.3);
    Q(a.nashe, 'quill', .3); Q(a.pyt, 'quill', .25); Q(a.slovo, 'papers', .6); Q(a.slovo + .5, 'munch', .3); Q(a.ball0, 'thud', .4); Q(a.roll1 - .3, 'scuttle', .3, .2); Q(a.fall1, 'whoosh', .45); Q(a.jAB, 'deep', .4);
    const b = TB; Q(b.j + .3, 'whirr', .3); Q(b.chet, 'shimmer', .3); Q(b.nag, 'plop', .45, .3); Q(b.mil, 'plop', .45, -.3); Q(b.dive, 'dive', .55); Q(b.jBC, 'glass', .3);
    const s = TC4; Q(s.kot - .1, 'drawer', .3); Q(s.kot + .5, 'plop', .35); Q(s.nelz, 'cryptex', .35, -.4); Q(s.podzh - .1, 'zap', .3, -.4); Q(s.podzh, 'puff', .2); Q(s.tab, 'whoosh', .35); Q(s.nagr, 'blade', .35);
    Q(s.vdvoe, 'counter', .3); Q(s.hol, 'counter', .3); Q(s.close, 'whoosh', .25); Q(s.jCD + .1, 'whoosh', .45);
    const d = TD4; Q(d.j + .1, 'city', .3); Q(d.kurt, 'truck', .3, .4); Q(d.pep, 'drawer', .35); Q(d.mash, 'puff', .3); Q(d.shest, 'shimmer', .3); Q(d.rash, 'flutter', .3); Q(d.jDF - .35, 'whoosh', .45); Q(d.jDF, 'glass', .2);
    const f = TF; Q(f.smel - .25, 'scuttle', .5); Q(f.smel + .3, 'conveyor', .3); Q(f.pol, 'whoosh', .3); Q(f.off, 'buzz', .35); Q(f.vred, 'puff', .3);
    const g = TG; Q(g.on, 'buzz', .3); Q(g.poim - .1, 'glassbulb', .45); Q(g.yady - .1, 'xray', .45); Q(g.mnog, 'plop', .3); for (let i = 0; i < 4; i++) Q(g.mnog + .15 + i * .12, 'plop', .2, -.3 + i * .2);
    Q(g.bol, 'impact', .35); Q(g.nik, 'counter', .35); Q(g.stat - .1, 'pageflip', .5); Q(g.dym - .05, 'scroll', .35); Q(g.imen, 'puff', .3); Q(g.jGH - .3, 'whoosh', .5); Q(g.jGH, 'pageflip', .3);
    const h = TH; Q(h.form, 'papers', .5); Q(h.mensh, 'marker', .45); Q(h.vreda - .05, 'thud', .6); Q(h.vreda, 'impact', .4); Q(h.razresh + .25, 'plop', .35); Q(h.pomn, 'scroll', .4); Q(h.pomn + .4, 'papers', .4);
    Q(h.reyn, 'factory', .3); Q(h.sem, 'marker', .35); Q(h.podr, 'marker', .45); Q(h.svoi - .05, 'drawer', .3); Q(h.svoi + .3, 'thud', .4); Q(h.svoi + .45, 'plop', .3); Q(h.prizh, 'puff', .3); Q(h.ugol, 'zap', .3);
    Q(h.ugol + .1, 'coins', .3); Q(h.sela, 'counter', .5); Q(h.sela + .3, 'puff', .35); Q(h.doll, 'register', .5); Q(h.pat, 'scroll', .5); Q(h.pat + .5, 'whoosh', .4); Q(h.land, 'papers', .5);
    for (let i = 0; i < 4; i++) Q(h.perv - .3 + i * .1, 'plop', .2, -.2 + i * .15); Q(h.kom - .05, 'impact', .7); Q(h.kom, 'thud', .6); Q(h.narush, 'xray', .4); Q(h.vygn - .2, 'chain', .4); Q(h.vygn + .1, 'whoosh', .6);
    Q(h.vygn + .45, 'splash', .5); Q(h.vygn + .5, 'stamp', .55); Q(h.amer, 'wave', .3); Q(h.jHA, 'whoosh', .45);
    const m = TM; Q(m.roll0, 'scuttle', .4, -.4); Q(m.tri, 'counter', .45); for (let i = 0; i < 3; i++) Q(m.tri + .2 + i * .3, 'plop', .2, -.3); Q(m.sig, 'conveyor', .35); Q(m.sig + .1, 'counter', .4); Q(m.shest, 'counter', .45);
    Q(m.bol, 'impact', .3); Q(m.bol + .05, 'shimmer', .25); Q(m.brosaj, 'scuttle', .4, .3); Q(m.edge, 'whoosh', .3); Q(m.inBin - .05, 'bin', .6, .4); Q(m.rovno, 'thud', .2); Q(m.vy, 'city', .2);
    if (MODE === 'y') { Q(m.jAJ + .05, 'whoosh', .4); Q(m.jAJ + .6, 'papers', .3); Q(m.jAJ + .7, 'plop', .3); Q(m.jAJ + .9, 'whoosh', .22) }   // v22.4: без нити к 2022 — её тянет глава 5   // v21.2: хвост 2 с — кадр → фото, нить к 2022, камера к карточке 2022   // кадр → фото на доске, нить к 2022
    else { Q(m.ugad, 'shimmer', .3); Q(m.amerQ, 'pageflip', .3); Q(m.amerQ + .46, 'impact', .45); Q(m.amerQ + .48, 'papers', .5); Q(TL0 - .5, 'city', .25) }
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: window.WIDE ? [WIDE.W, WIDE.H] : [WW, HH],
    sub: { init: null, scene: (c, t) => scene(c, t), frameTo: (c, t) => frameTo(c, t) },
    init(tl, SC, sub) {
      TLW = tl.sent.flatMap(s => s.words); TLS = tl.sent; const ep = String(tl.ep || '').replace(/-(ru|en|de)$/, '');
      setLang(tl.lang || (String(tl.ep || '').match(/-(ru|en|de)$/) || [])[1] || 'ru'); MQF = 0;   // v21.1: надписи — на языке ролика
      MODE = /y$/.test(ep) ? 'y' : 's';
      TLX = { b0: tl.b0, vEnd: tl.vEnd, endT: (Math.ceil(tl.dur * 30) - 1) / 30 };
      K = keys(); SEG.length = 0; SHUT.length = 0; HY = null; INITED = false; CHUNKS = buildChunks(tl.subs);
      if (!sub) { window.__K = K; cues(); window.CUES_READY = 1 } else allInit();
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v210f')) { const st = document.createElement('style'); st.id = 'v210f';
        st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join('')
          + ['latin', 'cyrillic'].map(sub => `@font-face{font-family:P;font-weight:700;font-style:normal;src:url(fonts/playfair-${sub}-700-normal.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}@font-face{font-family:P;font-weight:400 700;font-style:italic;src:url(fonts/playfair-${sub}-700-italic.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}`).join('');
        document.head.appendChild(st) }
      cv = wideCanvas(mk, WW, HH); if (!sub) { cv.style.cssText = `position:absolute;left:0;top:0;width:${cv.width}px;height:${cv.height}px`; document.body.insertBefore(cv, document.getElementById('grain')) }
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U', '700 20px P', 'italic 700 20px P', 'italic 400 20px P'].map(f => document.fonts.load(f, 'АЯaz09$'))).then(() => 0);
    },
  };
  { const ep = window.EP; ep.sub.init = tl => ep.init(tl, [], true) }
  window.__dbg = { camAt, get KA1() { return KA1 }, get KB() { return KB }, get KC() { return KC }, get KD() { return KD }, get KF() { return KF }, get KG() { return KG }, get KH() { return KH }, get KAE() { return KAE }, get KJ() { return KJ },
    get T() { return { TA, TB, TC4, TD4, TF, TG, TH, TM } }, get HOLD() { return HOLD }, get SEG() { return SEG } };
})();
