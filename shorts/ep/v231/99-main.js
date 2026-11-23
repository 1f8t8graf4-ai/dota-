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
    const t1 = Math.round((t - K.TE) * 3e5) / 3e5;   // v23.3: без хвоста округления — иначе зерно главы 1 (floor(t·30)) на последнем кадре берёт соседний кадр
    if (t >= K.TE1 - 1e-6) { ch1Frame(c, t1); return }   // последний кадр пролога — кадр главы 1 за 1/30 с до её кадра 0 (её рисовка и обработка, без субтитров)
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (!window.NOMB && SHUT.some(([a, b]) => t > a && t < b)) sceneMB(c, t); else scene(c, t);
    c.setTransform(1, 0, 0, 1, 0, 0); liveCam1(c, t1); post1(c, t1);   // обработка главы 1 на весь пролог: в конце она та же, что у её кадра
    c.setTransform(1, 0, 0, 1, 0, 0); if (VAR === 'A') label(c, t); subs(c, t);
    if (FILM) { const k = eio(at(t, K.blk[0], K.blk[1])); if (k > 0) { c.fillStyle = `rgba(2,3,6,${.88 * k})`; c.fillRect(0, 0, WW, HH) } }   // v23.4: в темноту — дальше наплыв в ночной город главы 1   // v23.3: плашка врезки — в кадре экрана, как субтитры
  }
  function cues() {   // hb, drop, land, sub, steam — синтез в v231_sound.py (как в v230_sound.py), остальное — файлы sfx*; tick и swish под запретом
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    beats().forEach((tb, i) => Q(tb, 'hb', i ? .9 : 1.1));
    if (VAR === 'A') {   // v23.2: капля падает в луч, оболочки вокруг неё, предметы на свои слова, ряд, врезки (без «бульканья»)
      Q(.02, 'whoosh', .5); Q(.42, 'land', 1); Q(.45, 'shimmer', .25);   // v23.3: капля садится мягким ударом (синтез), без «плюх»
      K.form.forEach((tf, i) => { Q(tf - .1, 'whoosh', .75, .4); Q(tf + .2, 'glass', .55, (i - 2) * .3); if (i) Q(tf + .06, 'thud', .4, (i - 3) * .3) });   // v23.3: все въезжают справа
      Q(K.row + .06, 'thud', .45, .6); Q(K.row + .15, 'shimmer', .4);
      Q(K.mac[0], 'seal', 1); Q(K.mac[0] + .03, 'thud', .6); Q(K.mac[1], 'splash', .55); Q(K.mac[2], 'stamp', .9); Q(K.mac[2] + .25, 'shimmer', .35);
      Q(K.dark, 'deep', .8);
    } else {
      K.form.forEach((tf, i) => { Q(tf - .14, 'whoosh', .5, (i - 2) * .35); Q(tf + .02, 'thud', 1.1, (i - 2) * .35); Q(tf + .03, 'impact', .55, (i - 2) * .35) });
      stampT().forEach((ts, i) => Q(ts, 'stamp', .8, (i - 2) * .35));
      Q(K.back - .05, 'deep', .9); Q(K.pull - .05, 'whoosh', 1.2);
    }
    Q(K.flare - .03, 'drop', 1); Q(K.flare - .02, 'boom', .7);
    Q(K.grow - .06, 'sub', 1); Q(K.suck1 - .04, 'steam', 1);   // v23.3: без «бульканья» и шипения молнии — мягкий саб-подъём (синтез, до втягивания капли) и лёгкий выдох пара
    Q(K.dive0 + .05, 'whoosh', 1.4); Q(K.dive0 + .18, 'dive', 1.1);
    if (FILM) { Q(K.hit, 'hit', 1); Q(K.hit - .5, 'rain', 1) }   // v23.7, фильм: низкий удар — на нём гаснет грув пролога; дождь заходит под главу 1
  }
  window.EP = {
    P: { bg: '#0A0D13', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f2a33a', a2: '#ef5668' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); TLS = tl.sent; LANG = tl.lang || 'ru'; MODE = 'y'; VAR = /^v232/.test(tl.ep || '') ? 'B' : 'A'; FILM = /^v231f/.test(tl.ep || '');
      TLX = { endT: tl.endT || tl.dur }; K = keys(); window.__K = K; CHUNKS = buildChunks();
      SHUT.length = 0; shutters().forEach(w => SHUT.push(w)); SHUT.push([K.grow - .08, K.grow + .4]); SHUT.push([K.dive0 + .05, K.TE1 - .2]);
      for (const k in CUES) delete CUES[k]; cues(); window.CUES_READY = 1;
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      return Promise.all([...['600 20px M', '800 20px M'].map(f => document.fonts.load(f, 'АЯaz09ÜÄ?')), sprLoad()]).then(() => 0);
    },
  };
  window.__dbg = { get K() { return K }, frameTo, ch1Frame };
})();
