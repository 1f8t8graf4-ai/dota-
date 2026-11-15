  // ================= время сцен по словам голоса =================
  function keys() {
    const w = Wd, k = {};
    k.morph0 = w('и'); k.shopSign = k.morph0 + 1.15; k.shopBox = k.morph0 + 1.25;
    k.truck0 = w('всё') - .15; k.truck1 = k.truck0 + 2.4;
    k.law = w('закон'); k.jan = w('январь'); k.chop = w('рубят'); k.mango = w('манго'); k.fru = w('фрукты'); k.des = w('десерты'); k.mint = w('мята'); k.knife = w('нож');
    k.s3 = w('но'); k.only = w('только'); k.cart = w('картриджами'); k.whole = w('цельные'); k.notm = w('упомянуты'); k.zoom0 = WdB('упомянуты') + .02; k.zoom1 = k.zoom0 + .75;
    k.juul2 = w('джул'); k.shen = w('шэньчжэне'); k.conv = w('конвейеры');
    k.s4 = w('puff bar'); k.puff = k.s4; k.hqd = w('hqd'); k.elf = w('elf bar'); k.vsego = w('всего'); k.par = w('парящих'); k.vyr = w('выросла'); k.x11 = w('одиннадцать');
    k.s5 = w('это') - .1; k.liq = w('жидкость'); k.ws = w('ws-23'); k.fool = w('обманывает'); k.ice = w('лёд');
    k.s6 = w('помните'); k.grew = w('разрослись'); k.mesh = w('двойная'); k.puffs = w('тысячи'); k.nicot = w('никотину'); k.n16 = w('шестнадцать');
    k.s7 = w('чтобы'); k.tube = w('пробирке'); k.noleaf = w('без'); k.leaf = w('листа'); k.when = w('когда'); k.bill = w('миллиарды'); k.market = w('рынок'); k.old = w('старые'); k.corp = w('корпорации');
    k.s8 = w('запретом');
    k.b0 = TLX.b0; k.endT = TLX.endT;
    if (MODE === 's') { k.rest = w('остальных'); k.yt = w('youtube'); k.down0 = WdB('youtube') + .2; k.down1 = k.down0 + 1.9; k.zA0 = k.endT - 2.3 }
    else { k.rules = w('правила'); k.vperv = w('впервой'); k.brut = w('брутальности'); k.vek = w('век'); k.vyv = w('выводили'); k.nezh = w('нежные'); k.ledi = w('леди') }
    return k;
  }
  function scene(c, t) {
    if (t < K.truck0) shot1(c, t);
    else if (t < K.s3 - .15) shot2(c, t);
    else if (t < K.s4 - .1) shot3(c, t);
    else if (t < K.s5 - .15) shot4(c, t);
    else if (t < K.s6 - .1) shot5(c, t);
    else if (t < K.s7 - .1) shot6(c, t);
    else if (t < K.s8 - .25) shot7(c, t);
    else shot8(c, t);
  }
  function hud(c, t) {   // плашка года
    if (t < K.grew - .3) yearPill(c, 2020, 2020, 1);
    else if (t < K.s7 - .2) yearPill(c, 2020, 2022, at(t, K.grew - .3, K.grew + .1));
    else if (t < K.market - .3) yearPill(c, 2022, 2021, at(t, K.s7 - .2, K.s7 + .2));
    else if (t < K.s8 - .25) yearPill(c, 2021, 2023, at(t, K.market - .3, K.market + .1));
    else if (t < K.s8 + .2) yearPill(c, 2023, 2023, 1, 1 - at(t, K.s8 - .25, K.s8 + .2));
  }
  function firstFrame(c) { shot1(c, 0); hud(c, 0) }   // кадр 0 — без субтитров
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (t >= K.b0) { if (MODE === 's') endA(c, t); else { endB(c, t); const kZ = at(t, K.nezh - .2, K.ledi + 1.6); if (kZ > .7 && kZ < 1) ep3Pill(c, at(kZ, .7, 1)) } }
    else { scene(c, t); hud(c, t) }
    subs(c, t);
  }
  // ================= звуки (только мягкие: без ding / tick / pin / swish) =================
  function cues() {
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    Q(.5, 'whoosh', .7); Q(.72, 'icecrack', .8); Q(K.morph0 + .1, 'whoosh', .8); Q(K.morph0 + .72, 'thud', .7); Q(K.morph0 + .7, 'snowroof', .5); Q(K.shopSign, 'neon', .5); Q(K.shopBox, 'papers', .25);
    Q(K.truck0, 'truck', 1); Q(K.jan - .2, 'deep', .6);
    Q(K.chop, 'blade', 1); Q(K.chop + .12, 'impact', .7); Q(K.chop + .15, 'splash', .9); Q(K.chop + .9, 'chain', .4);
    Q(K.s3 - .1, 'whoosh', .6); Q(K.s3 + .45, 'scroll', .9); Q(K.only, 'marker', .6); Q(K.whole - .05, 'papers', .4); Q(K.zoom0, 'whoosh', .8);
    Q(K.juul2 + .32, 'impact', .8); Q(K.juul2 + .35, 'thud', .6); Q(K.shen - .1, 'conveyor', .7);
    Q(K.s4, 'wave', 1); Q(K.puff, 'thud', .35, -.3); Q(K.hqd, 'thud', .35); Q(K.elf, 'thud', .35, .3); Q(K.vsego, 'whoosh', .7); Q(K.vsego + .45, 'papers', .5); Q(K.par, 'thud', .4, -.3); Q(K.vyr - .1, 'boom', .7);
    Q(K.s5 + .5, 'plop', .9); Q(K.s5 + .6, 'bubble', .5); Q(K.liq, 'whoosh', .6); Q(K.liq + .4, 'chain', .35); Q(K.ws, 'deep', .6); Q(K.ws + .1, 'pour', .4); Q(K.fool + .2, 'whoosh', .5); Q(K.ice - .3, 'icecrack', .9); Q(K.ice + .3, 'deep', .5);
    Q(K.s6 - .1, 'whoosh', .7); Q(K.grew - .1, 'chain', .5); Q(K.mesh - .25, 'pageflip', .8); Q(K.puffs - .25, 'pageflip', .8); Q(K.nicot - .2, 'whoosh', .6); Q(K.nicot + .3, 'thud', .5); Q(K.n16, 'coins', .35);
    Q(K.s7 - .1, 'whoosh', .6); Q(K.tube - .05, 'deep', .7); Q(K.tube, 'glassbulb', .6); Q(K.noleaf, 'leaves', .5); Q(K.when - .2, 'pour', .5); Q(K.bill - .5, 'whoosh', .7); Q(K.bill - .05, 'register', 1); Q(K.bill + .05, 'counter', .8); Q(K.market - .3, 'receipt', .6);
    Q(K.s8 - .2, 'whoosh', .6); Q(K.s8 + .25, 'thud', .5); Q(K.s8 + .4, 'city', .6);
    Q(K.b0, 'whoosh', .8); Q(K.b0 + 1.2, 'thud', .4);
    if (MODE === 's') { Q(K.rest - .1, 'marker', .4); Q(K.yt, 'stamp', 1); Q(K.down0, 'whoosh', .6); Q(K.zA0 + .3, 'dive', .7) }
    else { Q(K.b0 + 1.45, 'whoosh', .6); Q(K.vperv - .5, 'cryptex', .9); Q(K.vperv + .6, 'cryptex', .6); Q(K.brut - .4, 'lipstick', .9); Q(K.vyv - .2, 'marker', .7); Q(K.nezh - .2, 'dive', .8) }
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); const ep = String(tl.ep || '').replace(/-(ru|en|de)$/, '');
      MODE = /y$/.test(ep) ? 'y' : 's';
      TLX = { b0: tl.b0, endT: (Math.ceil(tl.dur * 30) - 1) / 30 };   // последний кадр ролика = endT (у шортса он равен кадру 0)
      K = keys(); window.__K = K; cues(); CHUNKS = buildChunks();
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v180f')) { const st = document.createElement('style'); st.id = 'v180f'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); CORK = null; F0C = null; for (const k in BLUR) delete BLUR[k];
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U'].map(f => document.fonts.load(f, 'АЯaz09$'))).then(() => 0);
    },
  };
})();
