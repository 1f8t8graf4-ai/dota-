  // ================= сборка главы 3: время сцен по словам голоса, плашка года, кадр, звуки =================
  const BLOCKS = [];   // [начало, функция кадра] — заполняется в allInit по времени фраз
  function keys() { return { endT: TLX.endT, b0: TLX.b0, vEnd: TLX.vEnd } }
  function stub(c, t, name) { c.fillStyle = '#1e2138'; c.fillRect(0, 0, WW, HH); tx(c, name, 540, 900, { s: 60, c: '#fff' }) }
  function allInit() {
    if (BLOCKS.length) return;
    const FN = { w1: typeof w1Shot === 'function' ? w1Shot : null, s2: typeof w2Shot === 'function' ? w2Shot : null, s3: wcShot, s4: wcShot, s5: wcShot, s6: wcShot,
      s7: (c, t) => (t < T7.sw || typeof w8Shot !== 'function' ? w7Shot : w8Shot)(c, t), s8: typeof w8Shot === 'function' ? w8Shot : null, s9: w9Shot, s10: w9Shot, s11: w9Shot,
      s12: w12Shot, q3: w13Shot };   // v20.6: строк 13–14 нет; q3 — вопрос шортса новой концовки
    w1Init(); w2Init(); linkK(K1, K2, { x: V1.x, y: V1.y, m: M1 }, true);   // ныряем из плаката в коридор: мир 2 вложен в мир 1
    wcInit(); linkK(K2, KC, NC2, true);   // ныряем в красный торец: круг рынка — это он
    chInit(); linkK(KC, KCH, NCH, true);   // v20.2: ныряем в пробку сигареты — это корона небоскрёба, отъезд в ночной Чикаго
    w7Init(); linkK(KCH, K7, NC7(), true);   // ныряем в кабинет Бёрнетта (этаж в разрезе дома)
    w8Init(); linkK(K7, K8, { x: 540, y: 960, m: 1 }, true);   // лист = плакат: тот же мир, смена незаметна
    linkK(K8, KE, NE8, false);   // столбик в ночном небе = луч над Землёй (мир 8 вложен в Землю)
    w9Init(); linkK(KE, K9, NE9, true);   // ныряем к горизонту на верху шара: ночной щит вложен в Землю
    w12Init(); if (K12) linkK(K9, K12, N12, false);   // отъезд из фото карточки 1924 на доску
    w13Init();
    if (typeof wInitRest === 'function') wInitRest();
    const W = (a, b) => SHUT.push([a, b]);   // короткая выдержка на быстрых проездах: без смаза и двоения
    W(T1.zh - .2, T1.end + .55); W(T2.izy - .1, T2.zh + .5); W(T2.pom - .15, T2.end + .35); W(TC.spas - .1, TC.strah + .25); W(TC.amer + .15, TC.amer + .75); W(TC.bros - .1, TC.filt + .4); W(TC.nezh - .2, TC.nezh + .4); W(TC.fil - .12, TC.fil + .9);
    W(TC.vidu - .1, TC.end + .4); W(T7.stav + .2, T7.slov + .15); W(T8.muzh, T8.chet + .55); W(T8.sem - .1, T8.mir + .35); W(T8.sweep1 - .1, T9.kur); W(T9.vsego - .2, T9.umerli + .3); W(T9.chet + .8, T9.chet + 1.4); W(T9.dev - .2, T9.dev + .5);
    if (T12) { W(T12.pom - .1, T12.mil + .6); W(T12.pochti - .1, T12.poter + .55); W(T12.spok - .45, T12.perezh + .35); W(T12.korm + .3, T12.V) } if (MODE === 's') W(TSM - .5, TSM + .5);   // v20.3: проезды вдоль нити — без двоения
    if (MODE === 'y') { W(TLX.vEnd - .05, TLX.vEnd + 1.3); W(TLX.vEnd + 2.9, TLX.endT + .1) } else W(T13.qEnd, TLX.endT + .1);   // v20.6: нырок в кофейню — без смаза: последний кадр = кадр главы 4
    BLOCKS.push(['w1', -1, FN.w1]);
    for (const sc of ['s2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 'q3']) { const a = SA(sc); if (a !== null) BLOCKS.push([sc, a, FN[sc]]) }
  }
  function scene(c, t) {
    allInit(); let b = BLOCKS[0];
    for (const x of BLOCKS) if (t >= x[1] - .02) b = x;
    if (b[2]) b[2](c, t); else stub(c, t, b[0]);
    smokeCover(c, t, TSM);   // дым на стыке с 2014-м
  }
  let HY = null;
  function hud(c, t) {   // плашка года — только вперёд: 1924 → 1954 → 1972 → 1990 → 1992, уходит; 2014; в кадре 0 и в концовке плашки нет
    if (!HY) HY = { t1: Ws('s2', 'первые'), t54: Ws('s3', 'пятьдесят'), t72: Ws('s8', 'семьдесят'), t90: Ws('s10', 'девяностом'), t92: Ws('s10', 'умер'), out: Ws('s11', 'всего'), t14: Infinity, kv: Ws('s2', 'видно'),
      end: MODE === 'y' ? TLX.vEnd : T13.qEnd + .25 };
    const h = HY, pill = (y0, y1, k, dy = 0, al = 1) => { c.save(); c.setTransform(1, 0, 0, 1, 0, dy); yearPill(c, y0, y1, k, al, true); c.restore() };
    if (t < h.t1 - .25) return;
    if (t < h.t72 - .3) return pill(1924, 1954, at(t, h.t54 - .15, h.t54 + .35), -240 * (1 - eo(at(t, h.t1 - .25, h.t1 + .15))), Math.min(1, 1 - at(t, h.kv + .11, h.kv + .31) + at(t, h.t54 - .15, h.t54 + .05)));   // v20.4: на наезде в журнал плашка гаснет — не ложится на буквы Marlboro
    if (t < h.t90 - .3) return pill(1954, 1972, at(t, h.t72 - .15, h.t72 + .35));
    if (t < h.t92 - .3) return pill(1972, 1990, at(t, h.t90 - .15, h.t90 + .35));
    if (t < h.out + .45) return pill(1990, 1992, at(t, h.t92 - .15, h.t92 + .35), -240 * ei(at(t, h.out, h.out + .45)));
    const he = h.end - (MODE === 'y' ? .42 : 0);   // v20.5: в фильме плашка уходит до отъезда из фото — не горит, пока витрина сжимается в карточку
    if (t < h.t14 - .25 || t > he + .45) return;
    pill(2014, 2014, 1, -240 * Math.max(1 - eo(at(t, h.t14 - .25, h.t14 + .15)), ei(at(t, he, he + .45))));
  }
  function names(c, t) {   // плашки с именами — поверх кадра, чтобы читались, пока камера едет
    { const kn = at(t, T9.nast - .05, T9.nast + .3) * (1 - at(t, T9.uein - .4, T9.uein - .12)); if (kn > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); plate(c, 'ПО-НАСТОЯЩЕМУ', 540, 300, bo(kn), { s: 46, bg: '#F4F1EA', c: '#141010', ls: 3 }); c.restore() } }   // v20.2: плашкой, не поверх ламп
    for (const [a, b, n1, n2] of [[TC.bern - .12, TC.end - .12, 'ЛЕО БЁРНЕТТ', 'РЕКЛАМЩИК, ЧИКАГО'], [T9.uein - .05, T9.polt + .1, 'УЭЙН МАКЛАРЕН', 'КОВБОЙ С РЕКЛАМЫ']]) {
      const k = at(t, a, a + .3) * (1 - at(t, b - .25, b)); if (k <= 0) continue;
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); plate(c, n1, 540, 300, bo(k), { s: 50, bg: '#F3EBDD', c: '#141010', ls: 3 }); plate(c, n2, 540, 384, bo(at(t, a + .1, a + .4)) * (1 - at(t, b - .25, b)), { s: 30, bg: C3.red, c: '#fff', ls: 3 }); c.restore() }
  }
  let MBC = null; const SHUT = [];   // окна короткой выдержки — заполняются в allInit по быстрым проездам камеры
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
  function frameTo(c, t) {   // v20.1: кадр главы в любой холст — им же мостик «Льда» рисует последние кадры
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (window.NOMB) scene(c, t); else sceneMB(c, t);
    c.setTransform(1, 0, 0, 1, 0, 0); hud(c, t); names(c, t); if (T12) drum12(c, t); subs(c, t);
    if (window.WIDE && MODE === 'y' && c === X) wideSeam(c, t, TLX.endT, WSRC4());   // 23.11: 16:9 — бока стыка с главой 4
  }
  const LANG3 = () => (window.L10N && window.L10N.lang) || 'ru';
  const WSRC4 = () => 'ep/wide/v200-ch4f0' + (LANG3() !== 'ru' ? '-' + LANG3() : '') + '.png';
  function cues() {   // звуки по событиям сцен (мягкие)
    allInit(); const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    const a = T1; if (a.hk) { Q(.05, 'leaves', .35); Q(a.brut, 'whoosh', .35); Q(a.ledi - .1, 'pageflip', .5) } Q(a.marl, 'whoosh', .3); Q(a.do, 'pageflip', .8); Q(a.do + .5, 'papers', .4); Q(a.zh - .2, 'whoosh', .6);
    const b = T2; Q(b.perv - .1, 'whoosh', .4); Q(b.myag - .1, 'plop', .5); Q(b.myag + .2, 'scroll', .35); Q(b.izy, 'pageflip', .6); Q(b.rekl, 'papers', .45); Q(b.zh, 'pageflip', .5); Q(b.kr - .2, 'whoosh', .45); Q(b.kr + .2, 'lipstick', .9); Q(b.kon, 'lipstick', .6); Q(b.kot, 'whoosh', .35); Q(b.tilt0 + .1, 'whoosh', .5); Q(b.tilt1, 'deep', .5);
    const d = TC; Q(d.pyat - .15, 'plop', .4); Q(d.gor - .1, 'counter', .5); Q(d.gor + .35, 'glass', .45); Q(d.proc - .2, 'plop', .5); Q(d.umer - .1, 'puff', .35); Q(d.spas - .05, 'whoosh', .6);
    Q(d.nam - .15, 'pour', .4); Q(d.nam + .3, 'marker', .5); Q(d.smol, 'marker', .4); Q(d.op - .1, 'xray', .45); Q(d.op + .45, 'xray', .3); Q(d.amer + .15, 'marker', .55); for (let i = 0; i < BARS.length; i++) Q(d.amer + .75 + i * .26, 'plop', .22, -.4 + i * .1); Q(d.men - .2, 'thud', .5);
    Q(d.bros - .1, 'whoosh', .5); Q(d.bros + .3, 'school', .35); for (let i = 0; i < 5; i++) Q(d.bros + .1 + i * .18, 'plop', .25, -.3 + i * .15); Q(d.muzh + .05, 'whoosh', .4); Q(d.nezh - .25, 'drawer', .5); Q(d.nezh + .02, 'stamp', .6);
    Q(d.fil - .1, 'icecrack', .5); Q(d.fil + .35, 'impact', .7); Q(d.fil + .45, 'thud', .6); Q(d.vtor - .05, 'shimmer', .4); Q(d.filtr - .2, 'xray', .4); Q(d.zhest + .24, 'thud', .5); Q(d.pach + .18, 'thud', .55); Q(d.otkr - .35, 'whoosh', .35); Q(d.shch - .08, 'drawer', .9); Q(d.shch, 'stamp', .5); Q(d.chik - .1, 'whoosh', .5); Q(d.sw - .3, 'deep', .5); Q(d.sw - .12, 'glass', .2); Q(d.sw + .1, 'city', .4); Q(d.leo - .3, 'whoosh', .5); Q(d.end - .6, 'deep', .5);
    const e = T7; Q(e.stav - .3, 'whoosh', .4); Q(e.stav, 'marker', .6); Q(e.stav + .6, 'marker', .5); Q(e.stav + 1.2, 'marker', .45); Q(e.slov - .1, 'pour', .45); Q(e.sam + .1, 'scroll', .4); Q(e.sam + .3, 'plop', .5); Q(e.sim - .1, 'whoosh', .6);
    const f = T8; Q(f.cherez, 'truck', .45, -.4); Q(f.god, 'whoosh', .5); Q(f.byv, 'truck', .35, .4); Q(f.chet - .2, 'counter', .5); Q(f.chet + .2, 'glass', .45); Q(f.sem - .1, 'whoosh', .7); Q(f.sw + .1, 'deep', .5); Q(f.mir - .1, 'whoosh', .45);
    PACKS_E.forEach(([ri, an]) => { const a2 = AN(an); Q(lp(f.sweep0, f.sweep1, (a2 + .05) / TAU), 'plop', .35, Math.sin(a2) * .8) });
    const g = T9; Q(g.vot - .3, 'whoosh', .6); Q(g.kur - .05, 'neon', .4); Q(g.kur + .1, 'puff', .3); Q(g.uein - .05, 'plop', .4); for (let i = 0; i < 8; i++) Q(g.polt - .2 + i * .19, 'pageflip', .25, .2); Q(g.dev - .05, 'xray', .55);
    Q(g.rekl - .25, 'conveyor', .4); Q(g.rekl, 'chain', .35); Q(g.umer - .15, 'thud', .55); Q(g.pyat + .3, 'thud', .5); Q(g.vsego, 'whoosh', .45); Q(g.vot + .35, 'truck', .2, -.5); Q(g.umerli + .3, 'truck', .18, .5); for (let i = 0; i < 3; i++) Q(g.chet - .05 + i * .25, 'thud', .4, -.2 + i * .25); Q(g.marl, 'leaves', .35);
    if (T12) { const h = T12; Q(h.pom - .05, 'whoosh', .5); Q(h.mil - .1, 'plop', .5); Q(h.mil + .2, 'coins', .4); Q(h.pochti, 'counter', .6); Q(h.spok - .25, 'whoosh', .45); Q(h.korm - .08, 'register', .8); Q(h.korm + .15, 'receipt', .7); Q(h.burn, 'puff', .5) }
    if (MODE === 'y') { const V = TLX.vEnd, E = TLX.endT;   // v20.6: доска → нить к 2014 → маркер осыпается → нырок в кофейню главы 4
      Q(V + .05, 'receipt', .4); Q(V + .2, 'whoosh', .55); Q(V + .45, 'scroll', .3); Q(V + 1.15, 'marker', .35); Q(V + 1.25, 'whoosh', .35); Q(V + 2.05, 'plop', .3); Q(V + 2.35, 'papers', .5); Q(V + 2.95, 'whoosh', .5); Q(E - .55, 'dive', .5) }
    else { const k = T13; Q(TSM - .3, 'whoosh', .55); Q(k.q - .05, 'plop', .4); for (let i = 0; i < 2; i++) Q(k.marl - .05 + i * .22, 'glass', .5, -.4 + i * .4); Q(k.poob, 'plop', .45, .4);
      Q(k.qEnd + .05, 'whoosh', .55); Q(k.ts - .12, 'deep', .5); Q(k.ts + .1, 'leaves', .35) }   // нырок в пачку → щит у трассы
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: window.WIDE ? [WIDE.W, WIDE.H] : [WW, HH],
    // v20.1: глава внутри другого ролика (мостик «Льда» ныряет в её кадр 0): sub.init(таймлайн главы) — без своего холста и звуков,
    // sub.scene(c, t) — мир главы в текущих координатах, sub.frameTo(c, t) — кадр целиком, sub.pre(камера до кадра 0, порыв ветра на плакате)
    sub: { init: null, scene: (c, t) => scene(c, t), frameTo: (c, t) => frameTo(c, t), pre(cam, peel) { W1PRE = cam; W1PEEL = peel } },
    init(tl, SC, sub) {
      TLW = tl.sent.flatMap(s => s.words); TLS = tl.sent; const ep = String(tl.ep || '').replace(/-(ru|en|de)$/, '');
      MODE = /y$/.test(ep) ? 'y' : 's';
      TLX = { b0: tl.b0, vEnd: tl.vEnd, endT: (Math.ceil(tl.dur * 30) - 1) / 30 };
      K = keys(); BLOCKS.length = 0; SHUT.length = 0; HY = null; CHUNKS = buildChunks(tl.subs); W1PRE = W1PEEL = null;
      if (!sub) { window.__K = K; cues(); window.CUES_READY = 1 } else allInit();
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v200f')) { const st = document.createElement('style'); st.id = 'v200f';
        st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join('')
          + ['latin', 'cyrillic'].map(sub => `@font-face{font-family:P;font-weight:700;font-style:normal;src:url(fonts/playfair-${sub}-700-normal.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}@font-face{font-family:P;font-weight:400 700;font-style:italic;src:url(fonts/playfair-${sub}-700-italic.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}`).join('');
        document.head.appendChild(st) }
      cv = wideCanvas(mk, WW, HH); if (!sub) { cv.style.cssText = `position:absolute;left:0;top:0;width:${cv.width}px;height:${cv.height}px`; document.body.insertBefore(cv, document.getElementById('grain')) }
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      const img4 = new Promise(r => { if (IMG4) return r(); IMG4 = new Image(); IMG4.onload = IMG4.onerror = () => r(); IMG4.src = 'ep/v200-ch4f0.png' });   // v20.6: кадр главы 4 — фото карточки 2014
      return Promise.all([img4, ...(window.WIDE && MODE === 'y' && !sub ? [wideSeamLoad(WSRC4())] : []), ...['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U', '700 20px P', 'italic 700 20px P', 'italic 400 20px P'].map(f => document.fonts.load(f, 'АЯaz09$'))]).then(() => 0);
    },
  };
  { const ep = window.EP; ep.sub.init = tl => ep.init(tl, [], true) }
  window.__dbg = { camAt, get K12() { return K12 }, get K13() { return K13 }, get KL() { return KL }, get T12() { return T12 }, get T13() { return T13 }, get TSM() { return TSM } };   // v20.3: камера для проверок (кадр не трогает)
})();
