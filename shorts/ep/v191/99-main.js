  // ================= время сцен по словам голоса =================
  function keys() {
    const w = Wd, k = {};
    k.s8 = w('запретом');
    k.b0 = TLX.b0 - .4; k.endT = TLX.endT;   // v19.0: отъезд в карточку 2020 на 0,4 с раньше
    if (MODE === 's') { k.rest = w('остальных'); k.yt = w('youtube'); k.zo1 = k.b0 + 3.9; k.hl0 = w('открыла'); k.th0 = k.zo1 + .2; k.stamp = k.yt - 1; k.down0 = k.yt + .5; k.down1 = k.down0 + 1.6; k.zA0 = k.down1 + .08 }
    else { k.zo1 = k.b0 + 1.75; k.rules = w('правила'); k.vperv = w('впервой'); k.brut = w('брутальности'); k.vek = w('век'); k.vyv = w('выводили'); k.nezh = w('нежные'); k.ledi = w('леди'); k.ts = k.endT + 1 / 30;
      const after = (q, t0) => { for (const x of TLW) if (nw(x.d) === q && x.a > t0) return x.a; return null }, kak = after('как', WdB('рынок')), sig = after('сигареты', kak);   // v22.4: помада — «как нежные сигареты», ≈0,25 с фиксации, нырок
      k.L0 = kak - .15; k.L1 = Math.max(k.L0 + .7, sig + .1); k.d0 = Math.max(k.ledi + .2, k.L1 + .9) }   // v19.4: d0 — начало нырка в кадр 0 главы 3, ts — её кадр 0 (следующий после последнего кадра мостика)
    return k;
  }
  function allInit() { if (!T1) b1Init(); if (!T2) b2Init(); if (!T5) b5Init(); if (!T6) b6Init() }
  function scene(c, t) {   // v19.0: 6 блоков «Боб 2.0», дальше — сцена 8 (Луна, общежитие) из v18.5
    allInit();
    if (t < T1.end) b1Shot(c, t);
    else if (t < T2.fin) b2Shot(c, t);
    else if (t < T5.end) b5Shot(c, t);
    else if (t < K.s8 - .57) b6Shot(c, t);
    else shot8(c, t);
  }
  function hud(c, t) {   // плашка года — годы только вперёд; в кадре 0 плашки нет (петля шортса)
    const pill = (y0, y1, k, dy = 0, a = 1) => { c.save(); c.setTransform(1, 0, 0, 1, 0, dy); yearPill(c, y0, y1, k, a, true); c.restore() };
    if (t < 1) pill(2020, 2020, 1, 0, at(t, .3, .6));
    else if (t < 43.4) pill(2020, 2020, 1, -240 * ei(at(t, 43.0, 43.4)));
    else if (t < T6.a - .2) return;
    else if (t < K.s8 - .25) pill(2021, 2022, at(t, T6.kogda - .2, T6.kogda + .2), -240 * (1 - eo(at(t, T6.a - .2, T6.a + .2))));
    else if (t < K.s8 + .3) pill(2022, 2022, 1, -240 * ei(at(t, K.s8 - .25, K.s8 + .3)));
  }
  function firstFrame(c) { b1Shot(c, 0) }   // кадр 0 — без субтитров и без плашки
  let MBC = null; const SHUT = [[15.1, 16.1], [29.3, 29.9], [42.95, 43.5], [48.4, 50.6], [53.05, 53.6], [69.8, 71.9], [75.75, 76.25]];   // v19.2: + 0:29, 0:43, 0:53, 1:16 — надписи двоились в размытии   // v19.1: на быстрых проездах камеры затвор короче — без смаза и двоения цифр
  function sceneMB(c, t) {   // v19.0: затвор 180° — среднее 4 моментов за полкадра
    const n = 4, sh = SHUT.some(([a, b]) => t > a && t < b) ? 1 / 240 : 1 / 60; if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { scene(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); scene(g, tj);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function mbDo(c, t, fn) {   // v19.4: затвор 180° для любой функции кадра (как sceneMB)
    const n = 4, sh = 1 / 60; if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { fn(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); fn(g, tj);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (t >= K.b0) { if (MODE === 's') endA(c, t); else if (t >= K.d0 && !window.NOMB) mbDo(c, t, endB); else endB(c, t) }   // v19.4: нырок — с затвором, как у главы 3 (стык без смены резкости); плашки 1924 нет — в кадре 0 главы её нет
    else { sceneMB(c, t); hud(c, t) }
    subs(c, t);
  }
  // ================= звуки (мягкие) по событиям блоков =================
  function cues() {
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p); allInit();
    const a = T1; Q(.1, 'icecrack', .4); Q(a.cr, 'icecrack', .6); Q(a.sh - .02, 'icecrack', 1); Q(a.sh, 'impact', .5); Q(a.sh + .05, 'shimmer', .4); Q(a.up, 'whoosh', .5); Q(a.up + .1, 'flutter', .4);
    Q(a.back + .2, 'whoosh', .4); Q(a.land, 'thud', .6); Q(a.sq - .2, 'plop', .5); Q(a.sign - .05, 'plop', .6); Q(a.grow, 'city', .35); Q(3.9, 'truck', .2, -.5); Q(a.neon, 'neon', .6); Q(a.dive, 'whoosh', .6);
    Q(a.sw0, 'deep', .5); Q(a.sw0 + .05, 'flutter', .45); Q(a.rot0, 'whoosh', .5); Q(a.sw1 - .3, 'whoosh', .45);
    const b = T2; Q(b.rev, 'city', .3); Q(b.fly + .2, 'whoosh', .55); Q(b.open - .2, 'dive', .6); Q(b.one, 'papers', .35); Q(b.zab, 'marker', .5); Q(b.zak - .02, 'stamp', 1); Q(b.zak, 'impact', .4);
    Q(b.jan - .1, 'pageflip', .7); Q(b.posle - .1, 'whoosh', .45); Q(b.sk, 'papers', .4); Q(b.juul, 'plop', .5); Q(b.lift, 'whoosh', .7); Q(b.lift + .55, 'blade', .6); Q(b.lift + .7, 'chain', .6); Q(b.vl, 'thud', .5); Q(b.usa, 'deep', .35);
    Q(b.rub - .05, 'chain', .7); b.fl.forEach((tf, i) => { Q(tf - .03, 'plop', .55, -.45 + i * .3); Q(tf + .02, 'bubble', .25, -.45 + i * .3) }); Q(b.drop, 'blade', 1); Q(b.chop, 'impact', .9); Q(b.chop + .03, 'splash', .9);
    const d = T3; Q(21.05, 'whoosh', .6); Q(d.unf, 'scroll', .9); Q(d.zap, 'typing', .3); Q(d.only, 'marker', .6); Q(d.cart + .2, 'plop', .5); Q(d.cel, 'marker', .35); Q(d.upom - .03, 'stamp', 1); Q(d.upom, 'impact', .45);
    Q(d.poka - .25, 'whoosh', .7); for (let i = 0; i < 9; i++) Q(d.ubir + i * .12, 'plop', .25, -.5 + i * .12); Q(d.flip, 'thud', .5); Q(d.flip + .1, 'whoosh', .7); Q(d.flip + .75, 'thud', .6);
    Q(d.shen - .2, 'neon', .6); Q(d.conv - .2, 'conveyor', .8); d.box.forEach((tb, i) => Q(tb - .05, 'thud', .55, -.4 + i * .4)); Q(d.wave - .1, 'wave', 1); Q(d.am, 'splash', .9); Q(d.voln, 'impact', .4);
    const e = T4; Q(e.vsego + .3, 'plop', .5); Q(e.vyr - .1, 'pour', .6); Q(e.x11 - .03, 'stamp', .9); Q(e.dive, 'dive', .7); Q(e.zh - .3, 'chain', .5); Q(e.sint, 'shimmer', .4); Q(e.ws - .25, 'icecrack', .9); Q(e.ws + .25, 'splash', .5);
    Q(e.obm - .3, 'whoosh', .5); Q(e.rec, 'flutter', .4); Q(e.gor, 'icecrack', .6); Q(e.led, 'shimmer', .5); Q(e.end - .6, 'dive', .7);
    const f = T5; Q(f.a + .05, 'plop', .5); Q(f.zam, 'thud', .4); Q(f.pach - .03, 'stamp', .6); Q(f.wipe, 'whoosh', .6); Q(f.razr - .2, 'pour', .4); Q(f.wipe + .3, 'chain', .4); Q(f.t13 - .1, 'pour', .5); Q(f.dv - .1, 'thud', .4); Q(f.tys, 'counter', .6);
    Q(f.rot, 'whoosh', .5); for (let i = 0; i < 16; i++) Q(lp(f.nik + .1, f.k16 - .2, i / 15), 'plop', .22, -.6 + i * .08); Q(f.k16 - .03, 'stamp', .6);
    const g = T6; Q(g.a, 'whoosh', .5); Q(g.obo, 'leaves', .4); Q(g.prob - .05, 'glassbulb', .6); Q(g.bez - .05, 'stamp', .7); Q(g.list, 'leaves', .5); Q(g.kogda - .3, 'pour', .5); Q(g.kogda + .4, 'bubble', .4);
    Q(g.mlrd - .4, 'conveyor', .5); Q(g.mlrd - .05, 'register', 1); Q(g.mlrd + .05, 'counter', .8); Q(g.doll, 'coins', .5); Q(g.rynok - .05, 'boom', .35); Q(g.corp - .2, 'boom', .35); Q(g.end - .3, 'plop', .5);
    Q(K.s8 - .57, 'whoosh', .7); Q(K.s8 + .4, 'city', .6); Q(K.s8 + .9, 'thud', .5); Q(K.s8 + .95, 'marker', .5); { const W = w8(); Q(W.pod - .2, 'scroll', .7); Q(W.pod, 'neon', .7); Q(W.led - .3, 'icecrack', .7); Q(W.gig - .3, 'pour', .6); Q(W.nik - .3, 'glassbulb', .6); Q(W.nik + .1, 'plop', .5) } Q(K.b0, 'whoosh', .6);
    if (MODE === 's') { for (let i = 0; i < 3; i++) Q(K.th0 + i * 1.2, 'papers', .3, -.3 + i * .3); Q(K.stamp, 'stamp', 1); Q(K.stamp + .02, 'impact', .5); Q(K.down0, 'whoosh', .6); Q(K.zA0 + .3, 'dive', .7) }
    else { Q(K.zo1 + .1, 'whoosh', .6); Q(K.rules - .1, 'whip', .3, .2); Q(K.vperv + .03, 'plop', .5); Q(K.brut - .12, 'shimmer', .4); Q(K.L0 - .05, 'whoosh', .45, -.3); Q(K.L0 + .12, 'lipstick', .5); Q(K.L1 - .15, 'shimmer', .35, .3); Q(K.L1 + .1, 'leaves', .4); Q(K.d0 + .1, 'whoosh', .35); Q(K.ts - 1.2, 'dive', .55) }   // v19.4: ветер треплет угол плаката, нырок в кадр 0 главы 3
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); const ep = String(tl.ep || '').replace(/-(ru|en|de)$/, '');
      MODE = /y$/.test(ep) ? 'y' : 's';
      TLX = { b0: tl.b0, endT: (Math.ceil(tl.dur * 30) - 1) / 30 };   // последний кадр ролика = endT (у шортса он равен кадру 0)
      K = keys(); window.__K = K; cues(); CHUNKS = buildChunks(tl.subs);
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v180f')) { const st = document.createElement('style'); st.id = 'v180f'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); CORK = null; T1 = T2 = T3 = T4 = T5 = T6 = null; for (const k in BLUR) delete BLUR[k];
      // v19.4: мостик фильма ныряет в кадр 0 главы 3 — её рисовку грузит stage.html (window.EP3 = ep/v200.js, window.TL200 — таймлайн главы)
      const E3 = MODE === 'y' && window.EP3 && window.EP3.sub && window.TL200 ? window.EP3 : null; CH3OK = false;
      const p3 = E3 ? Promise.resolve(E3.sub.init(window.TL200)).then(() => { E3.sub.pre(tau => -DVL * (1 - DV(tau + K.ts).g), tau => GUST(tau + K.ts)); CH3OK = true }) : 0;
      return Promise.all([p3].concat(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U'].map(f => document.fonts.load(f, 'АЯaz09$')))).then(() => 0);
    },
  };
})();
