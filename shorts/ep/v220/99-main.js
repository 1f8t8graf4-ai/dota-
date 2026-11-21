  // ================= сборка главы 5: миры подряд, одна камера, плашка года, кадр, звуки =================
  // Фильм: доска (карточка 2022, маркер осыпается) → нырок в фото: океан → офис → Швеция → стол → заправка/улица → кабинет FDA → школа → доска → финал.
  // Шортс: кадр 0 — океан; в конце нырок в фото карточки 2022 = снова кадр 0 (петля). На каждом стыке у миров общие ключи камеры (linkK).
  const SEG = []; let INITED = false;
  function keys() { return { endT: TLX.endT, b0: TLX.b0, vEnd: TLX.vEnd, fin: TLX.fin } }
  function allInit() {
    if (INITED) return; INITED = true;
    oceanInit(); if (MODE === 'y' && typeof boardStartInit === 'function') boardStartInit();
    officeInit(); swedenInit(); tableInit();
    if (typeof fdaInit === 'function') fdaInit();
    if (typeof schoolInit === 'function') schoolInit();
    if (typeof boardInit5 === 'function') boardInit5();
    if (MODE === 'y' && typeof finalInit === 'function') finalInit();
    const W = (a, b) => SHUT.push([a, b]);
    W(T1.dive - .5, T1.dive + .3); W(T2.jw - .35, T2.jw + .25); W(T3.vyzh - .2, T3.iz + .2); W(T3.iz + .2, T3.shvedy + .1); W(T3.crack - .1, T3.land + .15);
    W(T3.junk - .2, T3.junk + .7); W(T5.dive0 + .3, T5.jdive + .25); W(T7.fl1 - .1, T7.sh1 + .1); if (MODE === 'y') { W(J5.th0 - .1, J5.fix + .1); W(J5.w0 - .05, J5.j0 + .05); W(T8.flip0, T8.flip1) } else W(T7.end - .65, T7.end + .1);
    if (MODE === 'y' && typeof boardStartShot === 'function') SEG.push([-1e9, boardStartShot], [T0.j0, oceanShot]); else SEG.push([-1e9, oceanShot]);
    SEG.push([T0.sw, officeShot], [T1.dive, swedenShot], [T2.jw, tableShot]);
    if (typeof fdaShot === 'function') SEG.push([T3.junk, fdaShot]);
    if (typeof schoolShot === 'function') SEG.push([T5.jdive, schoolShot]);
    if (typeof boardShot5 === 'function') SEG.push([T6.jout, boardShot5]);
    if (MODE === 'y' && typeof finalShot === 'function') SEG.push([T8.f0, finalShot]);
  }
  function scene(c, t) { allInit(); let f = SEG[0][1]; for (const s of SEG) if (t >= s[0]) f = s[1]; f(c, t) }
  let HY = null;
  function hud(c, t) {   // плашка года — только вперёд: 2022 → 2024 → 2025, гаснет на «Пять лет назад» (2020 — назад нельзя), 2026 — до доски / вопроса
    if (!HY) HY = { t22: Ws('b1', 'через'), t24: Ws('s6', 'два'), t25: Ws('s7', 'двадцать'), out1: Ws('s8', 'пять') - .15, t26: Ws('s9', 'двадцать'),
      out2: MODE === 'y' ? SB('s11') + .1 : Ws('q', 'угадаете') - .5 };   // v22.4: строки 12 в фильме нет — 2026 уходит после строки 11
    const h = HY, pill = (y0, y1, k, dy = 0) => { c.save(); c.setTransform(1, 0, 0, 1, 0, dy); yearPill(c, y0, y1, k, 1, true); c.restore() };
    if (t < h.t22 - .25) return;
    if (t < h.t24 - .3) return pill(2022, 2022, 1, -240 * (1 - eo(at(t, h.t22 - .25, h.t22 + .15))));
    if (t < h.t25 - .3) return pill(2022, 2024, at(t, h.t24 - .15, h.t24 + .35));
    if (t < h.out1 + .45) return pill(2024, 2025, at(t, h.t25 - .15, h.t25 + .35), -240 * ei(at(t, h.out1, h.out1 + .45)));
    if (t < h.t26 - .25) return;
    if (t < h.out2 + .45) return pill(2026, 2026, 1, -240 * (1 - eo(at(t, h.t26 - .25, h.t26 + .15))) - 240 * ei(at(t, h.out2, h.out2 + .45)));
  }
  let MBC = null; const SHUT = [];   // окна короткой выдержки — на быстрых нырках и проездах
  function sceneMB(c, t) {   // затвор 180° — среднее 4 моментов за полкадра
    const n = 4, sh = SHUT.some(([a, b]) => t > a && t < b) ? 1 / 240 : 1 / 60; if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { scene(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); scene(g, tj);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
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
    const o = T0; Q(Math.max(.05, o.fil - 1.2), 'wave', .35); Q(o.fil, 'plop', .3, .3); Q(o.cher, 'shimmer', .2); Q(o.zap, 'chain', .35, .3); Q(o.zap + .5, 'splash', .4); Q(o.shest, 'counter', .45); Q(o.dazhe, 'drawer', .3); Q(o.tab, 'marker', .35);
    Q(o.fly, 'whoosh', .45); Q(o.sw + .2, 'papers', .35);
    const f = T1; Q(f.vid, 'plop', .25, -.2); Q(f.sly, 'plop', .25); Q(f.pah, 'plop', .25, .2); Q(f.gub - .2, 'xray', .4); Q(f.shch, 'glassbulb', .35); Q(f.krov, 'shimmer', .25);
    Q(f.dym, 'puff', .25, -.3); Q(f.par, 'puff', .25, .3); Q(f.cab0, 'whoosh', .35); Q(f.sam, 'bell', .25); Q(f.dive - .2, 'dive', .5);
    const s = T3; Q(T2.jw - .1, 'whoosh', .35); Q(s.nast - .3, 'scuttle', .35, .4); Q(s.tab - .3, 'drawer', .3); Q(s.net, 'xray', .4); Q(s.nik, 'shimmer', .3); Q(s.vyzh, 'chain', .35); Q(s.ego, 'thud', .45);
    Q(s.iz, 'glassbulb', .4); Q(s.shvedy, 'plop', .3); Q(s.malb - .3, 'scuttle', .35, .4); Q(s.kupil, 'drawer', .35); Q(s.komp, 'whoosh', .35); Q(s.tsel, 'glass', .4); Q(s.zav, 'plop', .35, .3);
    Q(s.crack - .3, 'glass', .45, .3); Q(s.crack, 'icecrack', .5, .3); Q(s.fall, 'whoosh', .5); Q(s.land - .1, 'coins', .5); Q(s.smeli, 'scuttle', .55); Q(s.smeli + .4, 'scuttle', .45, .3);
    Q(s.ajk, 'buzz', .3); Q(s.japo, 'flutter', .3); Q(s.chet, 'whoosh', .4); Q(s.chet + .3, 'city', .3); Q(s.prod, 'conveyor', .3); Q(s.shest, 'counter', .5);
    if (typeof fdaCues === 'function') fdaCues(Q); if (typeof schoolCues === 'function') schoolCues(Q); if (typeof boardCues5 === 'function') boardCues5(Q); if (MODE === 'y' && typeof finalCues === 'function') finalCues(Q); if (MODE === 'y' && typeof boardStartCues === 'function') boardStartCues(Q);
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    sub: { init: null, scene: (c, t) => scene(c, t), frameTo: (c, t) => frameTo(c, t) },
    init(tl, SC, sub) {
      TLW = tl.sent.flatMap(s => s.words); TLS = tl.sent; const ep = String(tl.ep || '').replace(/-(ru|en|de)$/, '');
      setLang(tl.lang || (String(tl.ep || '').match(/-(ru|en|de)$/) || [])[1] || 'ru');
      MODE = /y$/.test(ep) ? 'y' : 's';
      TLX = { b0: tl.b0, vEnd: tl.vEnd, fin: tl.fin, endT: (Math.ceil(tl.dur * 30) - 1) / 30 };
      K = keys(); SEG.length = 0; SHUT.length = 0; HY = null; INITED = false; CHUNKS = buildChunks(tl.subs);
      if (!sub) { window.__K = K; cues(); window.CUES_READY = 1 } else allInit();
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v220f')) { const st = document.createElement('style'); st.id = 'v220f';
        st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join('')
          + ['latin', 'cyrillic'].map(sub => `@font-face{font-family:P;font-weight:700;font-style:normal;src:url(fonts/playfair-${sub}-700-normal.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}@font-face{font-family:P;font-weight:400 700;font-style:italic;src:url(fonts/playfair-${sub}-700-italic.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}`).join('');
        document.head.appendChild(st) }
      cv = mk(WW, HH); if (!sub) { cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain')) }
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      if (!IMG14 || IMG14.dataset.l !== LANG) { IMG14 = new Image(); IMG14.dataset.l = LANG; IMG14.src = 'ep/v210-ph2014' + (LANG === 'ru' ? '' : '-' + LANG) + '.png' }   // v22.4: фото по языку ролика (надписи на карте — ЗАПРЕТ, США…)   // v22.2: фото карточки 2014 из последнего кадра главы 4 (node v170tools/ph14.mjs v210y-ru 720 ep/v210-ph2014.png)
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U', '700 20px P', 'italic 700 20px P', 'italic 400 20px P'].map(f => document.fonts.load(f, 'АЯaz09$')).concat([IMG14.decode().catch(() => 0)])).then(() => 0);
    },
  };
  { const ep = window.EP; ep.sub.init = tl => ep.init(tl, [], true) }
  window.__dbg = { camAt, get K() { return { K0, K1, K2, K3, K5, K6, K7, KF, KJ5 } }, get T() { return { T0, T1, T2, T3, T5, T6, T7, T8 } }, get SEG() { return SEG } };
})();
