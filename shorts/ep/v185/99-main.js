  // ================= время сцен по словам голоса =================
  function keys() {
    const w = Wd, k = {};
    k.morph0 = w('и'); k.shopSign = k.morph0 + 1.15; k.shopBox = k.morph0 + 1.25; k.tr1a = k.morph0 - .15; k.tr1b = k.tr1a + .8;
    k.train0 = w('одного') - .1; k.train1 = k.train0 + 1.2;
    k.law = w('закон'); k.jan = w('январь'); k.chop = w('рубят'); k.mango = w('манго'); k.fru = w('фрукты'); k.des = w('десерты'); k.mint = w('мята'); k.knife = w('нож');
    k.s3 = w('но'); k.scr0 = k.s3 - .37; k.only = w('только'); k.cart = w('картриджами'); k.whole = w('цельные'); k.notm = w('упомянуты'); k.zoom0 = w('цельные') - .71; k.zoom1 = k.zoom0 + 3.5; k.lights = k.zoom1 + .03;
    k.juul2 = w('джул'); k.shen = w('шэньчжэне'); k.conv = w('конвейеры');
    k.s4 = w('puff bar'); k.puff = k.s4; k.hqd = w('hqd'); k.elf = w('elf bar'); k.vsego = w('всего'); k.par = w('парящих'); k.vyr = w('выросла'); k.x11 = w('одиннадцать');
    k.s5 = w('это') - .1; k.liq = w('жидкость'); k.ws = w('ws-23'); k.fool = w('обманывает'); k.ice = w('лёд');
    k.s6 = w('помните'); k.grew = w('разрослись'); k.mesh = w('двойная'); k.puffs = w('тысячи'); k.nicot = w('никотину'); k.n16 = w('шестнадцать');
    k.s7 = w('чтобы'); k.tube = w('пробирке'); k.noleaf = w('без'); k.leaf = w('листа'); k.when = w('когда'); k.bill = w('миллиарды'); k.market = w('рынок'); k.old = w('старые'); k.corp = w('корпорации');
    k.s8 = w('запретом');
    k.b0 = TLX.b0; k.endT = TLX.endT;
    if (MODE === 's') { k.rest = w('остальных'); k.yt = w('youtube'); k.zo1 = k.b0 + 3.5; k.hl0 = w('открыла'); k.th0 = k.zo1 + .2; k.stamp = k.yt - 1; k.down0 = k.yt + .5; k.down1 = k.down0 + 1.6; k.zA0 = k.down1 + .08 }
    else { k.zo1 = k.b0 + 1.35; k.rules = w('правила'); k.vperv = w('впервой'); k.brut = w('брутальности'); k.vek = w('век'); k.vyv = w('выводили'); k.nezh = w('нежные'); k.ledi = w('леди') }
    return k;
  }
  function scene(c, t) {
    if (!KEYS1) w1Init(); if (TINW.B > 98) tinInit();
    if (t < TINW.B) shot1(c, t);   // v18.5: мир 1 и лист закона с указом — одной камерой
    else if (t < TINW.C) shotB(c, t);   // мир B: полка → океан → Шэньчжэнь → волна → ×11
    else if (t < TINW.D) shotC(c, t);   // мир C: WS-23 → рецепторы → картридж = пачка → одноразка → 16 картриджей
    else if (t < K.s8 - .57) shotD(c, t);   // мир D: колба → пробирка → касса → корпорации
    else shot8(c, t);
  }
  function hud(c, t) {   // плашка года
    if (t < K.grew - .3) yearPill(c, 2020, 2020, 1);
    else if (t < K.s7 - .2) yearPill(c, 2020, 2022, at(t, K.grew - .3, K.grew + .1));
    else if (t < K.market - .3) yearPill(c, 2022, 2021, at(t, K.s7 - .2, K.s7 + .2));
    else if (t < K.s8 - .25) yearPill(c, 2021, 2023, at(t, K.market - .3, K.market + .1));
    else if (t < K.s8 + .3) { c.save(); c.setTransform(1, 0, 0, 1, 0, -240 * ei(at(t, K.s8 - .25, K.s8 + .3))); yearPill(c, 2023, 2023, 1, 1, true); c.restore() }
  }
  function firstFrame(c) { shot1(c, 0); hud(c, 0) }   // кадр 0 — без субтитров
  // v18.5: размытие движения: затвор 270° (на перевороте монеты — 360°), кадр = среднее 8–12 моментов (мир 1)
  let MBC = null;
  function sceneMB(c, t) {
    const fl = t > TF0 - .05 && t < TF1 + .05, n = fl ? 12 : 8, sh = fl ? 1 / 30 : 1 / 40; if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { scene(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); scene(g, tj);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (t >= K.b0) { if (MODE === 's') endA(c, t); else { endB(c, t); const kZ = at(t, K.nezh - .2, K.ledi + 1.6); if (kZ > .7 && kZ < 1) ep3Pill(c, at(kZ, .7, 1)) } }
    else { sceneMB(c, t); hud(c, t) }
    subs(c, t);
  }
  // ================= звуки (только мягкие: без ding / tick / pin / swish) =================
  function cues() {
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    if (!WK) w1Init(); const k = WK;   // v18.5: звуки мира 1 (0…21 с)
    Q(.1, 'icecrack', .45); Q(k.ice - .05, 'icecrack', .8); Q(k.ice + .25, 'shimmer', .35); Q(k.i + .05, 'whoosh', .55); Q(k.prod - .38, 'neon', .6);
    for (let i = 0; i < 4; i++) Q(k.prod - .15 + i * .14, 'plop', .38, -.4 + i * .27);
    Q(k.vk - .1, 'bubble', .3); Q(4.4, 'truck', .22, -.5); Q(k.vk - .02, 'whoosh', .6); Q(TF0, 'deep', .5); Q(TF0 + .12, 'flutter', .5); Q(TF1 - .05, 'whoosh', .6); Q(k.y20, 'city', .35); Q(k.y20 + .3, 'flutter', .4, .3);
    Q(k.vse - .05, 'dive', .7); Q(k.vse + .55, 'papers', .4); Q(k.odn, 'typing', .25); Q(k.zab, 'marker', .5); Q(k.zak - .03, 'stamp', 1); Q(k.zak, 'impact', .45);
    Q(k.jan - .2, 'pageflip', .7); Q(k.jan, 'whoosh', .35); Q(k.y20b, 'stamp', .45); Q(k.sk - .55, 'whoosh', .5); Q(k.sk, 'stamp', .6); Q(k.juul, 'plop', .5); Q(k.vl - .2, 'whoosh', .5); Q(k.vl + .45, 'thud', .5); Q(k.usa, 'deep', .4);
    Q(k.rub - .16, 'blade', .8); Q(k.rub, 'thud', .6); k.fl.forEach((tf, i) => { Q(tf - .05, 'plop', .6, -.45 + i * .3); Q(tf, 'bubble', .3, -.45 + i * .3) }); Q(k.vk2 + .2, 'plop', .3, -.6); Q(k.vk2 + .35, 'plop', .3, .6);
    Q(k.pod - .12, 'blade', 1); Q(k.pod + .1, 'impact', .9); Q(k.pod + .12, 'splash', .9); Q(k.pod + .4, 'whoosh', .4);
    // v18.5: звуки миров 2–4 (лист с указом → карта → жидкость → колба)
    w3Words(); w4Words(); const m = W2, n = W3, o = W4;
    Q(m.razv - .05, 'scroll', .9); Q(m.doc, 'papers', .4); Q(m.zap, 'typing', .3); Q(m.only - .1, 'marker', .6); Q(m.veip, 'marker', .4); Q(m.smen, 'plop', .6); Q(m.cart + .2, 'thud', .45);
    Q(m.cel, 'marker', .4); Q(m.upom - .05, 'stamp', .9); Q(m.upom, 'impact', .4); Q(m.poka - .4, 'whoosh', .5); Q(m.poka, 'dive', .7);
    for (let i = 0; i < 7; i++) Q(m.ubir + .15 + i * .12, 'plop', .3, -.5 + i * .17);
    Q(m.shen - .1, 'whoosh', .7); Q(m.zapusk - .2, 'conveyor', .8); Q(m.uzhe, 'city', .3); Q(m.puff, 'thud', .5, -.4); Q(m.hqd, 'thud', .5); Q(m.elf, 'thud', .5, .4);
    Q(m.odn - .3, 'wave', 1); Q(m.voln, 'splash', .9); Q(m.voln + .1, 'impact', .5); Q(m.vsego, 'whoosh', .5); Q(m.vsego + .1, 'bubble', .4); Q(m.vyr - .1, 'pour', .6); Q(m.x11 + .1, 'stamp', .8); Q(43.4, 'dive', .7);
    Q(n.eto, 'bubble', .5); Q(n.zhid - .1, 'whoosh', .5); Q(n.sint, 'icecrack', 1); Q(n.hol, 'shimmer', .5); Q(n.ws, 'plop', .4); Q(n.obm, 'whoosh', .5); Q(n.rec - .2, 'thud', .4); Q(n.led, 'icecrack', .6); Q(n.nik, 'deep', .5);
    Q(n.pomn - .2, 'whoosh', .7); Q(n.zam, 'thud', .5); Q(n.pach, 'plop', .4); Q(n.odn, 'whoosh', .6); Q(n.razr, 'chain', .5); Q(n.t13, 'pour', .5); Q(n.dv - .2, 'thud', .4); Q(n.set, 'chain', .4); Q(n.tys, 'counter', .6);
    Q(n.ponik - .1, 'whoosh', .5); for (let i = 0; i < 8; i++) Q(n.ponik + .4 + i * .14, 'plop', .28, -.5 + i * .14); Q(n.kart16, 'stamp', .6); Q(63.55, 'dive', .7);
    Q(o.nach, 'bubble', .6); Q(o.var, 'pour', .4); Q(o.prob, 'glassbulb', .6); Q(o.bez, 'leaves', .5); Q(o.list - .1, 'marker', .6); Q(o.tab, 'stamp', .7);
    Q(o.kogda - .3, 'whoosh', .5); Q(o.kogda, 'pour', .5); Q(o.prin, 'conveyor', .5); Q(o.mlrd - .05, 'register', 1); Q(o.mlrd + .05, 'counter', .8); Q(o.doll, 'coins', .5); Q(o.god, 'thud', .3);
    Q(o.rynok - .3, 'whoosh', .6); Q(o.star - .2, 'boom', .4); Q(o.tabn - .2, 'thud', .4); Q(o.corp - .2, 'boom', .4); Q(o.corp + .1, 'coins', .35);
    Q(K.s8 - .57, 'whoosh', .7); Q(K.s8 + .4, 'city', .6); Q(K.s8 + .5, 'thud', .4);
    Q(K.b0, 'whoosh', .6);
    if (MODE === 's') { for (let i = 0; i < 3; i++) Q(K.th0 + i * 1.2, 'papers', .3, -.3 + i * .3); Q(K.stamp, 'stamp', 1); Q(K.stamp + .02, 'impact', .5); Q(K.down0, 'whoosh', .6); Q(K.zA0 + .3, 'dive', .7) }
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
      X = cv.getContext('2d'); CORK = null; for (const k in BLUR) delete BLUR[k];
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U'].map(f => document.fonts.load(f, 'АЯaz09$'))).then(() => 0);
    },
  };
})();
