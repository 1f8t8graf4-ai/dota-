  // ================= кадр, звуки, сборка =================
  const SHUT = [];   // окна размытия движения (затвор 180°, 8 моментов за полкадра): превращения, падение половинок, нырок
  let MBC = null;
  function sceneMB(c, t) {
    const n = 8, sh = 1 / 60; if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext("2d");
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { scene(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); scene(g, tj);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function frame(t) { frameTo(X, t) }
  function frameTo(c, t) {
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; FT = t;
    const t1 = t - K.TE;
    if (t >= K.TE1 - 1e-6) { ch1Frame(c, t1); return }   // последний кадр пролога — кадр главы 1 за 1/30 с до её кадра 0 (её рисовка и обработка, без субтитров)
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (!window.NOMB && SHUT.some(([a, b]) => t > a && t < b)) sceneMB(c, t); else scene(c, t);
    c.setTransform(1, 0, 0, 1, 0, 0); liveCam1(c, t1); post1(c, t1);   // обработка главы 1 на весь пролог: в конце она та же, что у её кадра
    c.setTransform(1, 0, 0, 1, 0, 0); subs(c, t);
  }
  function cues() {   // звуки по событиям; hb, drop, zip, zipend — синтез в v230_sound.py, остальное — файлы sfx* (tick и swish там под запретом — не брать)
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    Q(Math.max(.05, K.tw[0] - .1), 'shimmer', .22);
    beats().forEach((tb, i) => Q(tb, 'hb', i ? .9 : 1.1));
    Q(K.form[0] - .08, 'xray', .5);
    K.form.forEach((tf, i) => { Q(tf - .03, 'plop', .7, 0); Q(tf + .2, 'glass', .55, (i - 2) * .35) });
    Q(K.face[0] - .04, 'pageflip', .8, -.2); Q(K.face[1] - .04, 'bubble', 1.2, .1); Q(K.face[2] - .04, 'shimmer', .34, .2);
    Q(K.crack - .02, 'icecrack', 1.1); Q(K.crack + .16, 'whoosh', 1.1);
    Q(K.flare - .03, 'drop', 1); Q(K.flare - .02, 'boom', .7);
    Q(K.grow - .04, 'plop', .8); Q(K.pour[0], 'pour', 1); Q(K.pour[0] + .12, 'bubble', .7);
    Q(K.zip - .06, 'zip', 1); Q(K.zipE, 'zipend', 1); Q(K.zipE + .03, 'vape', .85);
    Q(K.dive0 + .05, 'whoosh', 1.4); Q(K.dive0 + .18, 'dive', 1.1);
  }
  window.EP = {
    P: { bg: '#0B0D12', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f2a33a', a2: '#ef5668' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); TLS = tl.sent; LANG = tl.lang || 'ru'; MODE = 'y';
      TLX = { endT: tl.endT || tl.dur }; K = keys(); window.__K = K; CHUNKS = buildChunks();
      SHUT.length = 0; K.form.slice(1).forEach(tf => SHUT.push([tf - .07, tf + .4])); SHUT.push([K.crack + .1, K.crack + 1.3], [K.grow - .08, K.grow + .5], [K.dive0 + .05, K.TE1 - .2]);
      for (const k in CUES) delete CUES[k]; cues(); window.CUES_READY = 1;
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      return Promise.all(['600 20px M', '800 20px M'].map(f => document.fonts.load(f, 'АЯaz09ÜÄ?'))).then(() => 0);
    },
  };
  window.__dbg = { get K() { return K }, SH, morphF, frameTo, ch1Frame };
})();
