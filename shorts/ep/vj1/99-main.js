  // ================= сборка: миры по очереди, размытие движения, плашка года, звуки =================
  function scene(c, t) {
    if (t < TAB) shotW1(c, t);
    else if (t < TW) shotW2(c, t);
    else if (t < TH) shotW3(c, t);
    else if (t < TC1) shotW4(c, t);
    else if (t < TSW) { shotW5(c, t); if (t < TC1 + 1.5) shards(c, t) }
    else shotW6(c, t);
  }
  let YS = null;
  function hud(c, t) {   // плашка года: 1979 → 2015 → 2018 → 2019 → 2022
    if (!YS) YS = [[T2.find, 1979], [T2.y15, 2015], [T3.goda, 2018], [TC1, 2019], [T5.prik, 2022]];
    let i = -1; for (let j = 0; j < YS.length; j++) if (t >= YS[j][0] - .2) i = j; if (i < 0 || t > TSW + .3) return;
    const a = (i === 0 ? at(t, YS[0][0] - .2, YS[0][0] + .2) : 1) * (1 - at(t, TSW - .1, TSW + .3));
    if (i === 0) yearPill(c, 1979, 1979, 1, a); else yearPill(c, YS[i - 1][1], YS[i][1], at(t, YS[i][0] - .2, YS[i][0] + .2), a);
  }
  let MBC = null;
  function sceneMB(c, t) {
    const fast = Math.abs(t - TW) < .4 || Math.abs(t - TAB) < .3 || Math.abs(t - TH) < .3 || Math.abs(t - TC1 - .4) < .5, n = fast ? 10 : 7, sh = fast ? 1 / 30 : 1 / 40;
    if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { c.save(); scene(c, tj); c.restore(); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); g.save(); scene(g, tj); g.restore();
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    sceneMB(c, t); c.setTransform(1, 0, 0, 1, 0, 0); hud(c, t); subsBig(c, t);
  }
  function cues() {
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    // мир 1
    Q(.2, 'city', .35); Q(T1.pan0 + .1, 'whoosh', .6); Q(T1.pan0 + .7, 'dive', .7); Q(T1.on, 'neon', .7); Q(T1.on + .05, 'counter', .5); Q(T1.off, 'thud', .3);
    // мир 2
    Q(TAB, 'whoosh', .5); Q(T2.ubit - .05, 'blade', .9); Q(T2.ubit + .12, 'impact', .5); Q(T2.ubit + .4, 'whoosh', .5); Q(PH[3].a - .2, 'thud', .4);
    for (let j = 0; j < 5; j++) Q(T2.ro + j * .3, 'papers', .3, -.4 + j * .2);
    Q(T2.pull - .05, 'whoosh', .5); Q(T2.xr0, 'neon', .5); Q(T2.find, 'scroll', .7); Q(T2.st - .05, 'stamp', 1); Q(T2.st, 'impact', .4); Q(T2.ffall, 'whoosh', .4);
    Q(T2.nic - .1, 'pour', .5); Q(T2.kis - .1, 'pour', .5, .3); Q(T2.sol - .3, 'icecrack', .8); Q(T2.sol, 'shimmer', .4); Q(T2.der - .2, 'chain', .4); Q(T2.sil - .2, 'thud', .5);
    Q(T2.vyp - .2, 'marker', .5); Q(T2.vyp + .25, 'plop', .5); Q(T2.fl - .2, 'marker', .4); Q(T2.zar - .45, 'whoosh', .5); Q(T2.plug, 'plop', .7); Q(T2.plug + .05, 'glassbulb', .4);
    [T2.mango, T2.krem, T2.myata].forEach((tt, i) => Q(tt - .25, 'plop', .5, -.4 + i * .4)); Q(T2.cel - .3, 'whoosh', .4); Q(T2.pach - .2, 'thud', .6);
    // мир 3
    Q(TW - .25, 'whoosh', 1); Q(TW + .1, 'city', .5); Q(T3.mol - .1, 'plop', .4); Q(T3.mod, 'plop', .4, .3); Q(T3.ts - .1, 'stamp', .6); Q(T3.goda, 'whoosh', .5); Q(T3.tri, 'counter', .5); Q(T3.chet + .3, 'stamp', .5); Q(TH - .4, 'dive', .8);
    // мир 4
    for (let j = 0; j < 4; j++) Q(TH + .35 + j * .7, 'chain', .35, -.2); Q(T4.dek - .15, 'pageflip', .6); Q(T4.d12 - .05, 'register', 1); Q(T4.d12, 'counter', .7); Q(T4.d12 + .3, 'receipt', .6); Q(T4.tret - .1, 'whoosh', .5); Q(T4.tret + .2, 'thud', .5);
    Q(PH[15].a - .2, 'whoosh', .5); Q(T4.stoit, 'counter', .8); Q(T4.mlrds + .2, 'coins', .6); Q(T4.vl - .1, 'neon', .6); Q(T4.epi - .05, 'icecrack', 1); Q(TC1, 'impact', .9); Q(TC1 + .05, 'icecrack', .7);
    // мир 5
    Q(T5.par - .1, 'neon', .5); Q(T5.pyat, 'counter', .7); Q(PH[18].a - .05, 'whoosh', .6); [0, 1, 2].forEach(i => Q(T5.zap - .1 + i * .12, 'stamp', .7, -.4 + i * .4)); Q(T5.dir + .2, 'thud', .5); Q(T5.uh, 'whoosh', .4);
    Q(T5.isk - .1, 'papers', .8); Q(T5.tys, 'papers', .6, .3); Q(T5.tys + .25, 'whoosh', .4); Q(T5.tys + .55, 'plop', .5); Q(T5.prik - .1, 'chain', .6); Q(T5.prik + .45, 'thud', .5); Q(T5.prik + 1.0, 'chain', .5); Q(T5.ryn + .25, 'thud', .7);
    Q(PH[20].a - .2, 'whoosh', .4); Q(T5.tep - .1, 'counter', .9); Q(T5.pol + .2, 'thud', .6); Q(T5.mesto - .1, 'chain', .5); Q(T5.zan - .1, 'impact', .8); Q(T5.zan, 'wave', 1); Q(T5.zan + .3, 'splash', .9);
    // мир 6
    Q(TSW + .3, 'splash', .6); Q(TSW + .5, 'wave', .5); Q(T6.pat - .1, 'whoosh', .5); Q(T6.pat + .2, 'stamp', .5); Q(T6.perv - .1, 'chain', .4); Q(T6.ul, 'chain', .4, .3); Q(T6.film - .4, 'thud', .6); Q(T6.film + .45, 'stamp', 1); Q(T6.film + .48, 'impact', .5);
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); PH = tl.sent.map(s => ({ a: s.a, b: s.b, text: s.text }));
      TLX = { b0: tl.b0, endT: (Math.ceil(tl.dur * 30) - 1) / 30 }; K = { endT: TLX.endT }; MODE = 's';
      w1Init(); w2Init(); w3Init(); w4Init(); w5Init(); w6Init(); window.__K = { TAB, TW, TH, TC1, TSW };
      cues();
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v180f')) { const st = document.createElement('style'); st.id = 'v180f'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U'].map(f => document.fonts.load(f, 'АЯaz09$'))).then(() => 0);
    },
  };
})();
