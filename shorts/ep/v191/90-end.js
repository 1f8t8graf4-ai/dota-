  // ================= СЦЕНА 9: пробковая доска и две концовки =================
  const CARDS = [
    { id: '1979', x: 340, y: 400, a: '1979', b: 'СОЛЬ', open: true },
    { id: '2020', x: 740, y: 400, a: '2020', b: 'ЛАЗЕЙКА ОДНОРАЗОК', open: true },
    { id: '2014', x: 230, y: 790, a: '2014', b: 'НАГРЕВАТЕЛИ' },
    { id: '1924', x: 540, y: 805, a: '1924', b: '«МАЛЬБОРО»' },
    { id: '2022', x: 850, y: 790, a: '2022', b: 'ШАЙБЫ' },
  ];
  const CW = 270, CH = 330, PH = 240;
  const photoC = cd => [cd.x, cd.y - CH / 2 + 15 + PH / 2];
  const pinP = cd => [cd.x, cd.y - CH / 2 + 4];
  let CORK = null; const BWX0 = WD ? -640 : 0, BWX1 = WD ? WW + 640 : WW;
  function corkImg() {   // v18.4: пробка ровным цветом, редкие точки — как растр у Боба
    const CWd = WD ? BWX1 - BWX0 : WW; if (CORK) return CORK; CORK = mk(CWd, 1400); const g = CORK.getContext('2d');
    g.fillStyle = '#b07a4a'; g.fillRect(0, 0, CWd, 1400);
    for (let y = 10, r = 0; y < 1400; y += 22, r++) for (let x = (r % 2) * 11; x < CWd; x += 22) { if (H1(x * .37 + y * 1.13) > .55) continue; g.fillStyle = 'rgba(120,72,35,.35)'; g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill() }
    return CORK;
  }
  function boardWall(c, t) {   // v18.4: ровная стена, рама контуром, плоский конус света от качающейся лампы
    c.fillStyle = '#1f1b2b'; c.fillRect(-1200, -1200, WW + 2400, 5200);
    c.save(); rr(c, BWX0 + 30, 150, BWX1 - BWX0 - 60, 1050, 14); fill(c, '#5b3d26'); rr(c, BWX0 + 52, 172, BWX1 - BWX0 - 104, 1006, 8); c.clip(); c.drawImage(corkImg(), BWX0, 0); c.restore();   // 24.11: в 16:9 доска шире
    rr(c, BWX0 + 30, 150, BWX1 - BWX0 - 60, 1050, 14); lnS(c, 5, '#f1e6d6'); rr(c, BWX0 + 52, 172, BWX1 - BWX0 - 104, 1006, 8); lnS(c, 3, 'rgba(241,230,214,.5)');
    const sw = Math.sin(t * 1.25) * .2, bx = 540 + Math.sin(sw) * 1300;
    c.beginPath(); c.moveTo(540, -400); c.lineTo(540, 40); lnS(c, 3, '#f1e6d6');
    c.save(); c.translate(540, 40); c.rotate(-sw * .25); c.beginPath(); c.arc(0, 30, 44, Math.PI, 0); c.closePath(); fill(c, '#2b2638'); c.beginPath(); c.arc(0, 30, 44, Math.PI, 0); c.closePath(); lnS(c, 4, '#f1e6d6'); circ(c, 0, 34, 10, '#fde68a'); c.restore();
    poly(c, [540 - 30, 74, 540 + 30, 74, bx + 420, 1200, bx - 420, 1200]); fill(c, 'rgba(253,230,138,.09)');
  }
  function photo1979(c, t, x, y, s) {   // v18.4: колба контуром и голубой кристалл соли — плоско
    c.fillStyle = '#1b2142'; c.fillRect(x - s / 2, y - s / 2, s, s);
    c.save(); c.translate(x - s * .12, y + s * .08); c.scale(s / 240, s / 240);
    poly(c, [-38, 20, 38, 20, 56, 56, -56, 56]); fill(c, '#38bdf8');
    poly(c, [-14, -80, 14, -80, 14, -30, 60, 60, -60, 60, -14, -30]); c.strokeStyle = '#e0f2fe'; c.lineWidth = 5; c.lineJoin = 'round'; c.stroke();
    c.restore();
    c.save(); c.translate(x + s * .24, y + s * .2); c.scale(s / 240, s / 240); poly(c, [0, -34, 26, -10, 18, 26, -18, 26, -26, -10]); fill(c, '#7dd3fc'); poly(c, [0, -34, 26, -10, 0, 0]); fill(c, '#e0f2fe'); poly(c, [0, -34, 26, -10, 18, 26, -18, 26, -26, -10]); c.strokeStyle = '#e0f2fe'; c.lineWidth = 3; c.stroke(); c.restore();
  }
  function sil(c, id, x, y, s) {   // тёмные силуэты закрытых карточек
    c.save(); c.translate(x, y); c.scale(s / 240, s / 240); c.fillStyle = '#334155';
    if (id === '2014') { rr(c, -22, -90, 44, 180, 14); c.fill(); rr(c, -12, -120, 24, 40, 8); c.fill() }
    else if (id === '1924') { rr(c, -14, -100, 28, 200, 6); c.fill(); c.fillRect(-14, -100, 28, 34) }
    else { c.beginPath(); c.ellipse(0, 10, 80, 30, 0, 0, TAU); c.fill(); c.fillRect(-80, -20, 160, 30); c.beginPath(); c.ellipse(0, -20, 80, 30, 0, 0, TAU); fill(c, '#475569') }
    c.restore();
  }
  function marker(c, x, y, s, seed) {   // фактурные полосы чёрного маркера крест-накрест
    c.save(); c.translate(x, y); c.lineCap = 'round';
    [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(seed + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke();
      c.strokeStyle = 'rgba(60,60,70,.35)'; c.lineWidth = 3; for (let j = 0; j < 4; j++) { c.beginPath(); c.moveTo(-s * .6, off * s * .25 - s * .08 + j * s * .05); c.lineTo(s * .6, off * s * .25 - s * .08 + j * s * .05); c.stroke() } c.restore() });
    c.restore();
  }
  // 3-я глава, кадр 0: белая сигарета с красным ободком на тёмно-синем фоне ар-деко
  const sp4 = (c, x, y, r, col) => { c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, q = i % 2 ? r * .26 : r; c.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q) } c.closePath(); fill(c, col) };
  function ep3Frame(c, t, tip = 1) {   // v19.3: tip 0…1 — красный кончик загорается (мостик, «нежные»), 1 — кадр 0 3-й главы
    const u = MODE === 'y' && K.ledi ? 1 - at(t, K.ledi - .5, K.endT) : 0, w2 = u * u;   // мостик: лучи и сигарета плавно «садятся» в кадр 0 3-й главы
    c.fillStyle = '#0f172a'; c.fillRect(-200, -200, WW + 400, HH + 400);
    const g = c.createRadialGradient(540, 860, 0, 540, 860, 1000); g.addColorStop(0, '#1e3a8a'); g.addColorStop(.5, '#172554'); g.addColorStop(1, '#0f172a'); c.fillStyle = g; c.fillRect(-200, -200, WW + 400, HH + 400);
    c.save(); c.translate(540, 860); c.rotate(.22 * w2); for (let i = 0; i < 24; i++) { c.save(); c.rotate(i * TAU / 24); poly(c, [0, 0, -40, -1400, 40, -1400]); fill(c, i % 2 ? 'rgba(212,160,23,.07)' : 'rgba(212,160,23,.03)'); c.restore() }
    [260, 360, 470].forEach((r, i) => { c.beginPath(); c.arc(0, 0, r, Math.PI * 1.1, Math.PI * 1.9); stroke(c, rgba('#d4a017', .35 - i * .08), 4) }); c.restore();
    c.save(); c.strokeStyle = 'rgba(212,160,23,.35)'; c.lineWidth = 4; [[0, 0], [WW, 0], [0, HH], [WW, HH]].forEach(([qx, qy]) => { c.save(); c.translate(qx, qy); c.scale(qx ? -1 : 1, qy ? -1 : 1); for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(40 + i * 26, 230); c.lineTo(40 + i * 26, 40 + i * 26); c.lineTo(230, 40 + i * 26); c.stroke() } c.restore() }); c.restore();
    glow(c, 540, 860, 420, '#fde68a', .14);
    c.save(); c.translate(540, 860); c.scale(1 + .1 * w2, 1 + .1 * w2);
    const pk = tip < 1 ? Math.sin(Math.PI * at(tip, .2, 1)) : 0;   // вспышка, пока кончик загорается
    if (pk > 0) { glow(c, 0, -295, 260, '#f43f5e', .6 * pk); glow(c, 0, -295, 120, '#fecdd3', .5 * pk) }
    c.save(); c.translate(30, 40); rr(c, -38, -330, 76, 660, 20); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, -38, -330, 76, 660, 20); fill(c, '#f8fafc'); c.fillStyle = 'rgba(203,213,225,.6)'; c.fillRect(14, -330, 16, 660);
    if (tip >= 1) { rr(c, -38, -330, 76, 70, 20); fill(c, '#e11d48'); c.fillStyle = '#be123c'; c.fillRect(-38, -270, 76, 10) }
    else if (tip > 0) { const f = ss(0, .75, tip); c.save(); rr(c, -38, -330, 76, 70, 20); c.clip(); c.fillStyle = '#e11d48'; c.fillRect(-38, -260 - 70 * f, 76, 70 * f + 1); c.fillStyle = '#be123c'; c.fillRect(-38, -270, 76, 10 * ss(.1, .4, tip)); c.restore();
      if (pk > 0) { rr(c, -38, -330, 76, 70, 20); stroke(c, rgba('#fff1f2', .8 * pk), 6) } }
    if (tip > 0 && tip < 1) for (let i = 0; i < 6; i++) { const k0 = .3 + i * .08, k = at(tip, k0, k0 + .4); if (k <= 0 || k >= 1) continue; const a = -Math.PI / 2 + (i - 2.5) * .62, r = 70 + 70 * eo(k);
      c.save(); c.globalAlpha *= 1 - ss(.55, 1, k); sp4(c, Math.cos(a) * r, -295 + Math.sin(a) * r * .9, (i % 2 ? 22 : 30) * bo(at(k, 0, .45)), i % 2 ? '#fecdd3' : '#fde68a'); c.restore() }
    c.restore();
  }
  function cardDraw(c, t, cd, o = {}) {
    const [px, py] = photoC(cd);
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW / 2, -CH / 2, CW, CH, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW / 2, cd.y - CH / 2, CW, CH, 6); fill(c, '#f5f0e6'); rr(c, cd.x - CW / 2, cd.y - CH / 2, CW, CH, 6); lnS(c, 3, '#2b2638');
    c.save(); c.beginPath(); c.rect(px - PH / 2, py - PH / 2, PH, PH); c.clip();
    if (cd.id === '1979') photo1979(c, t, px, py, PH);
    else if (cd.id === '2020') { c.save(); c.translate(px, py); c.scale(PH / 1040, PH / 1040); c.translate(-620, -880); shot8(c, t); c.restore() }
    else if (cd.id === '1924' && o.ch3 && !cd.open && !(o.ds > 0) && !(o.lip && o.lip.s > 0)) { c.fillStyle = '#1e293b'; c.fillRect(px - PH / 2, py - PH / 2, PH, PH) }   // v19.4: маркер ещё целый — под ним ничего не рисуем
    else if (cd.id === '1924' && (o.ep3 || o.ch3)) { c.save(); c.translate(px, py); c.scale(PH / 1080, PH / 1080); c.translate(-540, -860); if (o.ch3 && CH3OK) ch3(c, t); else ep3Frame(c, t, o.tip ?? 1); c.restore() }
    else { c.fillStyle = '#1e293b'; c.fillRect(px - PH / 2, py - PH / 2, PH, PH) }
    if (!cd.open && o.lip) lipCover(c, cd, px, py, o.lip);   // v22.4: шляпа на заглушке, мазок помады стирает заглушку
    else if (!cd.open) {   // закрыто — глухой чёрный маркер; v19.3: на 1924 маркер режется по диагонали (o.dl) и две половины расходятся (o.ds)
      const ds = o.ds || 0, L = px - PH / 2, R = px + PH / 2, T = py - PH / 2, B = py + PH / 2;
      if (ds < 1) { const d = PH * .8 * eio(ds), n = Math.SQRT1_2;
        [[1, [L - 4, T - 4, R + 4, T - 4, R + 4, B + 4]], [-1, [L - 4, T - 4, R + 4, B + 4, L - 4, B + 4]]].forEach(([sg, P]) => {
          c.save(); c.translate(sg * d * n, -sg * d * n); poly(c, P); c.clip();
          rr(c, L, T, PH, PH, 2); fill(c, '#17171c'); marker(c, px, py, PH, cd.x);
          if (ds > 0) { c.beginPath(); c.moveTo(L, T); c.lineTo(R, B); lnS(c, 7, rgba('#fde68a', .9 * (1 - ss(.4, 1, ds)))) }
          c.restore() });
        const dl = o.dl || 0; if (dl > 0 && ds <= 0) { const ex = lp(L, R, eio(dl)), ey = lp(T, B, eio(dl)); c.beginPath(); c.moveTo(L, T); c.lineTo(ex, ey); lnS(c, 5, '#fde68a');
          if (dl < 1) { glow(c, ex, ey, 46, '#fde68a', .95); circ(c, ex, ey, 6, '#fffbe6') } } }
    }
    c.restore();
    const la = o.labA ?? 1;
    if (la > 0) A(c, la, () => tx(c, cd.a, cd.x, cd.y + CH / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' }));   // на закрытой карточке — только год
    if (cd.open) tx(c, cd.b, cd.x, cd.y + CH / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW - 24 });
    else if (o.sub && o.subA > 0 && la > 0) { c.save(); c.globalAlpha *= la; c.translate(cd.x, cd.y + CH / 2 - 18); c.scale(1, bo(o.subA)); tx(c, o.sub, 0, 0, { f: 'M', w: 800, s: 18, c: '#b91c1c', mw: CW - 20 }); c.restore() }
    if (o.q > 0) { const [qx, qy] = photoC(cd); c.save(); c.translate(qx, qy); c.scale(o.q, o.q); tx(c, '?', 0, 4, { f: 'U', w: 800, s: 150, c: '#fbbf24', sw: 10, sc: '#78350f' }); c.restore() }
    if (!o.noPin) pin(c, ...pinP(cd));
  }
  function pin(c, x, y) { circ(c, x + 3, y + 5, 14, 'rgba(0,0,0,.35)'); circ(c, x, y, 14, '#dc2626'); circ(c, x - 4, y - 4, 5, '#fca5a5') }
  function thread(c, a, b, k = 1) { if (k <= 0) return; const [x1, y1] = pinP(a), [x2, y2] = pinP(b); c.save(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(lp(x1, x2, k) + 3, lp(y1, y2, k) + 6); c.stroke(); c.strokeStyle = '#dc2626'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, k), lp(y1, y2, k)); c.stroke(); c.restore() }
  function board(c, t, o = {}) {
    boardWall(c, t);
    const C0 = CARDS, th = o.th || [1, 1, 1];   // нити от 2020 к 2014, 1924, 2022
    thread(c, C0[0], C0[1]);
    if (o.pulse > 0 && o.pulse < 1) { const [x1, y1] = pinP(C0[1]), [x2, y2] = pinP(C0[3]), u = eio(o.pulse); glow(c, lp(x1, x2, u), lp(y1, y2, u), 60, '#fde68a', .9); circ(c, lp(x1, x2, u), lp(y1, y2, u), 9, '#fff7cc') }
    [[C0[2], 0], [C0[3], 1], [C0[4], 2]].forEach(([cd, i]) => thread(c, C0[1], cd, eo(th[i])));
    const wob = { '2014': o.wob?.[0], '1924': o.wob?.[1], '2022': o.wob?.[2] };
    if (o.hl > 0) { const cd = C0[1]; glow(c, cd.x, cd.y, 300, '#fde68a', .45 * o.hl) }
    C0.forEach(cd => { if (o.skip === cd.id) return; const w = wob[cd.id] || 0, [px, py] = pinP(cd);
      c.save(); if (w) { c.translate(px, py); c.rotate(w); c.translate(-px, -py) } cardDraw(c, t, cd, { ...(o.card && o.card[cd.id] || {}), noPin: true, q: o.q?.[cd.id] || 0 }); c.restore() });
    [C0[0], C0[1], C0[3], C0[2], C0[4]].forEach(cd => { if (!(o.card && o.card[cd.id] && o.card[cd.id].noPin)) pin(c, ...pinP(cd)) });
  }
  function boardS(t) {   // шортс: нити рисуются по очереди, карточка качается на кнопке, вспыхивает золотой «?»
    const th = [], wob = [], q = {};
    ['2014', '1924', '2022'].forEach((id, i) => { const t0 = K.th0 + i * K.thd; th.push(at(t, t0, t0 + .9)); const d = t - t0 - .9; wob.push(d > 0 ? .1 * Math.sin(d * 9) * Math.exp(-d * 2.2) : 0); q[id] = bo(at(t, t0 + .85, t0 + 1.25)) });
    return { th, wob, q, hl: at(t, K.hl0, K.hl0 + .3) * (1 - at(t, K.th0 + 2 * K.thd - .2, K.th0 + 2 * K.thd + .2)) * (.75 + .25 * Math.sin(t * 6)) };
  }
  // ---------- переход от общежития к карточке 2020 (отъезд камеры) ----------
  function zoomOutTo2020(c, t, drawBoard) {
    // отъезд: окно фото карточки 2020 сначала больше экрана, потом сжимается в свою рамку; дом виден ТОЛЬКО внутри окна фото
    const k = eio(at(t, K.b0, K.zo1)), [pcx, pcy] = photoC(CARDS[1]);
    const z = Math.exp(lp(Math.log(HH / PH), 0, k)), Px = lp(540, pcx, k), Py = lp(960, pcy, k), side = PH * z;
    c.save(); c.translate(Px, Py); c.scale(z, z); c.translate(-pcx, -pcy); drawBoard(c); c.restore();
    const span = Math.exp(lp(Math.log(HH), Math.log(1040), k)), sc = side / span, Cx = lp(540, 620, k), Cy = lp(960, 880, k);
    c.save(); c.beginPath(); c.rect(Px - side / 2, Py - side / 2, side, side); c.clip();
    c.translate(Px, Py); c.scale(sc, sc); c.translate(-Cx, -Cy); shot8(c, t); c.restore();
  }
  // ---------- концовка А (шортс): штамп, спуск к ноутбуку, зум в кадр 0 ----------
  const LAP = { x: 540, y: 2360, vw: 180, vh: 320 };   // прямоугольник видео на экране ноутбука (мир)
  let F0C = null;
  function frame0In(c, x, y, w, h, sx, sy, sw2, sh2) {   // кадр 0 векторно: экран ноутбука целиком в его фоне, без чёрных полос
    c.save(); c.beginPath(); c.rect(sx, sy, sw2, sh2); c.clip(); c.translate(x, y); c.scale(w / WW, h / HH); b1Shot(c, 0); c.restore();   // v19.0: точный кадр 0 — глыба, без второй плашки
  }
  function deskWorld(c, t) {   // v18.4: под доской плоско — стол, лампа контуром, силуэт со спины, ноутбук с роликом
    c.fillStyle = '#4a3424'; c.fillRect(-400, 1700, WW + 800, 1600); c.beginPath(); c.moveTo(-400, 1700); c.lineTo(WW + 400, 1700); lnS(c, 5, '#f1e6d6');
    c.save(); c.translate(150, 1700); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -420); c.lineTo(200, -310); lnS(c, 10, '#2b2638'); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -420); c.lineTo(200, -310); lnS(c, 3, '#f1e6d6');
    c.translate(200, -310); c.rotate(.6); poly(c, [-50, -20, 50, -20, 80, 60, -80, 60]); fill(c, '#2b2638'); poly(c, [-50, -20, 50, -20, 80, 60, -80, 60]); lnS(c, 4, '#f1e6d6'); c.restore();
    poly(c, [330, 1440, 420, 1430, 1020, 2600, 120, 2600]); fill(c, 'rgba(253,230,138,.08)');
    const { x, y, vw, vh } = LAP, SW = 640, SH = 400;
    rr(c, x - SW / 2 - 18, y - SH / 2 - 18, SW + 36, SH + 36, 18); fill(c, '#111827'); rr(c, x - SW / 2 - 18, y - SH / 2 - 18, SW + 36, SH + 36, 18); lnS(c, 4, '#f1e6d6');
    frame0In(c, x - vw / 2, y - vh / 2, vw, vh, x - SW / 2, y - SH / 2, SW, SH);
    c.fillStyle = '#18181b'; c.fillRect(x - SW / 2, y - SH / 2, SW, 30); circ(c, x - SW / 2 + 20, y - SH / 2 + 15, 6, '#ef4444');
    const ba = MODE === 's' ? cl(1 - (t - (K.zA0 + .9)) / .5) : 1;
    if (ba > 0) { c.save(); c.globalAlpha = ba; c.fillStyle = '#3f3f46'; c.fillRect(x - SW / 2 + 20, y + SH / 2 - 22, SW - 40, 6); c.fillStyle = '#ef4444'; c.fillRect(x - SW / 2 + 20, y + SH / 2 - 22, (SW - 40) * .96, 6); c.restore() }
    poly(c, [x - SW / 2 - 60, y + SH / 2 + 18, x + SW / 2 + 60, y + SH / 2 + 18, x + SW / 2 + 140, y + SH / 2 + 110, x - SW / 2 - 140, y + SH / 2 + 110]); fill(c, '#374151'); poly(c, [x - SW / 2 - 60, y + SH / 2 + 18, x + SW / 2 + 60, y + SH / 2 + 18, x + SW / 2 + 140, y + SH / 2 + 110, x - SW / 2 - 140, y + SH / 2 + 110]); lnS(c, 4, '#f1e6d6');
    c.fillStyle = '#0b0912'; c.beginPath(); c.ellipse(x - 420, y + 210, 230, 300, 0, Math.PI, TAU); c.fill(); c.fillRect(x - 650, y + 210, 460, 600); c.beginPath(); c.ellipse(x - 420, y - 40, 120, 140, 0, 0, TAU); c.fill();
  }
  function endA(c, t) {
    const kd = eio(at(t, K.down0, K.down1)), kz = eio(at(t, K.zA0, K.endT));
    if (kz >= 1) { firstFrame(c); return }
    const sk = t > K.stamp ? 16 * (1 - at(t, K.stamp, K.stamp + .45)) : 0, shx = Math.sin(t * 93) * sk, shy = Math.cos(t * 71) * sk;
    const drawAll = cc => { board(cc, t, boardS(t)); stampYT(cc, t); deskWorld(cc, t) };
    if (t < K.zo1) { zoomOutTo2020(c, t, drawAll); return }
    const Fy = lp(960, LAP.y, kd), z = Math.exp(lp(0, Math.log(HH / LAP.vh), kz));
    const u = at(t, K.zo1, K.zA0), dz = 1 + .07 * Math.sin(Math.PI * u) ** 2, dx = 60 * Math.sin(2 * Math.PI * u) * Math.sin(Math.PI * u);   // v18.5: доска не стоит — медленный дрейф
    c.save(); c.translate(540 + shx, 960 + shy); c.scale(z * dz, z * dz); c.translate(-540 - dx, -Fy); drawAll(c); c.restore();
    vignette(c, .35 * (1 - kz));
  }
  function stampYT(c, t) {
    const k = at(t, K.stamp - .25, K.stamp); if (k <= 0) return;
    const s = lp(2.6, 1, ei(k));
    c.save(); c.translate(540, 1075); c.rotate(-.05); c.scale(s, s);
    rr(c, -330, -48, 660, 96, 14); fill(c, 'rgba(153,27,27,0.92)'); rr(c, -330, -48, 660, 96, 14); stroke(c, '#ef4444', 5);
    tx(c, '▶ ТОЛЬКО НА YOUTUBE', 0, 3, { f: 'U', w: 800, s: 44, c: '#ffffff' }); c.restore();
  }
  // ---------- концовка Б (мостик в 3-ю главу): криптекс 1·9·2·4 → помада → фото 1924 → зум ----------
  const C24 = CARDS[3];
  function cryptex(c, x, y, len, r, rings, o = {}) {   // золотой цилиндр: rings — значения 0…9.99 (дробное — прокрутка)
    c.save(); c.translate(x, y); c.rotate(r);
    const H = 95, g = c.createLinearGradient(0, -H / 2, 0, H / 2); g.addColorStop(0, '#fde68a'); g.addColorStop(.35, '#d4a017'); g.addColorStop(1, '#78530a');
    rr(c, -len / 2, -H / 2, len, H, 18); c.fillStyle = g; c.fill();
    if (rings) rings.forEach((v, i) => { const rx = -len / 2 + 60 + i * (len - 120) / 3; rr(c, rx - 30, -H / 2 - 6, 60, H + 12, 10); fill(c, '#b8860b'); c.save(); rr(c, rx - 26, -H / 2, 52, H, 8); c.clip(); const fl = Math.floor(v), fr = v - fl;
      [0, 1].forEach(j => tx(c, String((fl + j) % 10), rx, (j - fr) * 62, { f: 'U', w: 800, s: 40, c: '#3b2a05' })); c.restore() });
    [-1, 1].forEach(sd => { rr(c, sd > 0 ? len / 2 - 18 : -len / 2 - 22, -H / 2 - 10, 40, H + 20, 12); fill(c, '#a16207') });
    c.restore();
  }
  function lipstick(c, x, y, r, kcap, kout) {   // золотой футляр 1920-х (вертикальный), колпачок снимается, помада выкручивается
    c.save(); c.translate(x, y); c.rotate(r);
    const g = c.createLinearGradient(-48, 0, 48, 0); g.addColorStop(0, '#78530a'); g.addColorStop(.4, '#fde68a'); g.addColorStop(1, '#a16207');
    const bh = 110 * kout;
    if (bh > 0) { c.save(); c.beginPath(); c.moveTo(-30, -40); c.lineTo(-30, -40 - bh); c.lineTo(30, -40 - bh - 34); c.lineTo(30, -40); c.closePath(); fill(c, '#e11d48'); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(-24, -40 - bh, 8, bh); c.restore() }
    rr(c, -48, -50, 96, 230, 14); c.fillStyle = g; c.fill(); c.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 6; i++) c.fillRect(-48, -10 + i * 28, 96, 3);
    if (kcap < 1) { c.save(); c.translate(kcap * 520, -kcap * 1300); c.rotate(kcap * 2.4); rr(c, -50, -180, 100, 140, 16); c.fillStyle = g; c.fill(); c.restore() }
    c.restore();
  }
  // v19.4 (19.11): мостик ныряет в кадр 0 главы 3 «1924 · Мальборо» (щит Marlboro Country у трассы) — рисовку главы даёт сама глава (window.EP3, ep/v200.js).
  // Общий масштаб растёт плавно и к стыку набирает скорость, с которой глава стартует (W1V = 0,4 в секунду): сначала едет только камера доски —
  // фото растёт до экрана, к концу её сменяет камера самой главы (параллакс включается постепенно). Последний кадр мостика — кадр главы за 1/30 с до кадра 0.
  let CH3OK = false;
  const DVR = .4, DVL = .1, DVB = Math.log(4.5 / 2.6), DVH = .93;   // скорость на стыке; насколько камера главы отъехала до нырка; нырок камеры доски (2,6 → 1/p); где он кончается
  function DV(t) {   // f — камера доски (0…1), g — камера главы (0…1): вместе — один плавный наезд без остановки
    const S = K.ts - K.d0, dL = DVB + DVL, k = DVR * S / dL, c1 = dL / DVB, a = 2 / c1 - DVH, P = Math.pow(at(t, K.d0, K.ts), k);
    const f = P <= a ? c1 * P : P >= DVH ? 1 : c1 * a + c1 * (P - a) - c1 * (P - a) ** 2 / (2 * (DVH - a));
    return { f, g: (dL * P - DVB * f) / DVL };
  }
  const GUST = t => 240 * eo(at(t, K.L1 - .1, K.L1 + .5)) * (1 - eio(at(t, K.d0 + .4, K.ts - .35)));   // v22.4: мазок стёр заглушку — ветер сильнее отгибает угол щита, под ним розовая дамская реклама; к кадру 0 угол ложится как был
  const ch3 = (c, t) => window.EP3.sub.scene(c, t - K.ts);
  // ---------- v22.4 (ФИНАЛЬНОЕ ТЗ мейн): стык 2 → 3 — нить в реальном времени, силуэт шляпы, мазок помады ----------
  // «Но менять правила игры табачникам не впервой» — из булавки 2020 к закрытой 1924 в реальном времени натягивается нить (провисает, у булавки дрожит),
  // камера едет вдоль неё и встаёт на 1924. «Ведь главный символ мужской брутальности…» — на тёмной заглушке проступает белый силуэт ковбойской шляпы
  // с тёмно-золотой лентой. «…как нежные сигареты для леди» — золотой тюбик помады по диагонали: жирный алый мазок с неровной кромкой перечёркивает
  // шляпу, заглушка тает от мазка — под ней фото карточки 1924 (кадр 0 главы 3: щит Marlboro Country, ветер сильнее отгибает угол — под ним розовая
  // дамская реклама), подпись «МАЛЬБОРО»: МЯГКИЕ, КАК МАЙ; ≈ 0,25 с — и камера ныряет в фото: кадр 0 главы 3.
  let KB2 = null;
  const LIPD = 150;   // путь кончика помады по диагонали фото: от (−LIPD, −LIPD) до (LIPD, LIPD) от центра фото
  function lipState(t) { return { hat: eo(at(t, K.brut - .15, K.brut + .45)), s: at(t, K.L0, K.L1), e: at(t, K.L1 - .25, K.L1 + .35), r: 1 - at(t, K.L1 + .35, K.L1 + 1.05) } }   // v23.5: мазок тает уже на наезде
  function lipTip(u) { const d = lp(-LIPD, LIPD, eio(u)); return [d, d] }
  function lipBand(c, x0, y0, x1, y1, hw, rough, seed, cont) {   // полоса вдоль отрезка с неровной кромкой (контур — путь; cont — дописать к текущему пути)
    const L = Math.hypot(x1 - x0, y1 - y0) || 1, dx = (x1 - x0) / L, dy = (y1 - y0) / L, nx = -dy, ny = dx, n = Math.max(6, Math.ceil(L / 7)), ext = hw * .55;
    const P = i => { const u = i / n, x = lp(x0 - dx * ext, x1 + dx * ext, u), y = lp(y0 - dy * ext, y1 + dy * ext, u); return [x, y] };
    const j = (i, sd) => rough * (Math.sin(i * 1.7 + seed + sd) * .6 + Math.sin(i * 4.3 + seed * 2 + sd) * .4);
    if (!cont) c.beginPath(); for (let i = 0; i <= n; i++) { const [x, y] = P(i), w = hw * (i === 0 || i === n ? .55 : 1) + j(i, 0); i ? c.lineTo(x + nx * w, y + ny * w) : c.moveTo(x + nx * w, y + ny * w) }
    for (let i = n; i >= 0; i--) { const [x, y] = P(i), w = hw * (i === 0 || i === n ? .55 : 1) + j(i, 9); c.lineTo(x - nx * w, y - ny * w) } c.closePath();
  }
  function cowHat(c, x, y, s, a) {   // минималистичный силуэт ковбойской шляпы: белые тулья и поля с загнутыми краями, тёмно-золотые лента и контур
    if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s);
    const brim = () => { c.beginPath(); c.moveTo(-112, -10); c.bezierCurveTo(-98, 30, -40, 40, 0, 40); c.bezierCurveTo(40, 40, 98, 30, 112, -10); c.bezierCurveTo(90, 10, 50, 18, 0, 18); c.bezierCurveTo(-50, 18, -90, 10, -112, -10); c.closePath() };
    const crown = () => { c.beginPath(); c.moveTo(-50, 20); c.lineTo(-46, -34); c.bezierCurveTo(-44, -56, -26, -66, -12, -58); c.quadraticCurveTo(0, -50, 12, -58); c.bezierCurveTo(26, -66, 44, -56, 46, -34); c.lineTo(50, 20); c.closePath() };
    brim(); fill(c, '#F4F1EA'); crown(); fill(c, '#F4F1EA');
    c.save(); crown(); c.clip(); c.fillStyle = '#9A7417'; c.fillRect(-60, 2, 120, 15); c.fillStyle = 'rgba(0,0,0,.1)'; c.fillRect(18, -70, 40, 90); c.restore();   // лента, тень справа
    brim(); lnB(c, 4, '#9A7417'); crown(); lnB(c, 4, '#9A7417');
    c.beginPath(); c.moveTo(-26, -50); c.quadraticCurveTo(0, -40, 26, -50); lnB(c, 2.5, 'rgba(154,116,23,.7)');   // залом на тулье
    c.restore();
  }
  function lipCover(c, cd, px, py, L) {   // заглушка 1924: чёрный маркер + шляпа; мазок помады перечёркивает, заглушка тает от мазка; мазок гаснет
    const [tx0, ty0] = lipTip(L.s), A = [px - 128, py - 128], B = [px + tx0, py + ty0], HW = 50;
    const sp = 185 * eo(L.e), cov = L.e < 1;
    if (cov) { c.save(); c.beginPath(); c.rect(px - PH / 2 - 6, py - PH / 2 - 6, PH + 12, PH + 12);
      if (L.s > 0 && (B[0] > A[0] || sp > 0)) lipBand(c, A[0], A[1], Math.max(A[0], B[0]), Math.max(A[1], B[1]), HW + sp, 10 + 18 * L.e, cd.x * .01, true);
      c.clip('evenodd'); rr(c, px - PH / 2, py - PH / 2, PH, PH, 2); fill(c, '#17171c'); marker(c, px, py, PH, cd.x); cowHat(c, px, py + 8, .95, L.hat); c.restore() }
    if (L.s > 0 && L.r > 0 && B[0] > A[0]) {   // алый мазок: основной тон, тень по одной кромке, светлые и тёмные штрихи вдоль хода
      c.save(); c.globalAlpha *= L.r; lipBand(c, A[0], A[1], B[0], B[1], HW, 7, cd.x * .01); fill(c, '#D61F3C');
      c.save(); lipBand(c, A[0], A[1], B[0], B[1], HW, 7, cd.x * .01); c.clip();
      const dx = B[0] - A[0], dy = B[1] - A[1], Ln = Math.hypot(dx, dy) || 1, ux = dx / Ln, uy = dy / Ln, nx = -uy, ny = ux;
      c.lineCap = 'round'; for (let i = 0; i < 14; i++) { const off = lp(-HW + 6, HW - 6, H1(i * 3.7 + 1)), l0 = Ln * H1(i * 5.1) * .3, l1 = Ln * (.55 + .45 * H1(i * 2.3));
        c.beginPath(); c.moveTo(A[0] + ux * l0 + nx * off, A[1] + uy * l0 + ny * off); c.lineTo(A[0] + ux * l1 + nx * off, A[1] + uy * l1 + ny * off);
        c.strokeStyle = i % 3 ? 'rgba(255,140,160,.28)' : 'rgba(110,0,24,.3)'; c.lineWidth = 2 + 3 * H1(i + 8); c.stroke() }
      c.fillStyle = 'rgba(110,0,24,.35)'; c.beginPath(); c.moveTo(A[0] - nx * HW * 1.2, A[1] - ny * HW * 1.2); c.lineTo(B[0] - nx * HW * 1.2, B[1] - ny * HW * 1.2); c.lineTo(B[0] - nx * HW * .55, B[1] - ny * HW * .55); c.lineTo(A[0] - nx * HW * .55, A[1] - ny * HW * .55); c.closePath(); c.fill();
      c.restore(); c.restore() }
  }
  function lipTube(c, x, y, s) {   // золотой тюбик помады: скошенный алый стержень впереди, золотой цилиндр (свет полосой, тень по краю); x, y — кончик стержня
    c.save(); c.translate(x, y); c.rotate(Math.PI * .25 + Math.PI + .38); c.scale(s, s);   // ось тюбика — назад по ходу, чуть приподнят
    c.save(); c.translate(10, 16); c.globalAlpha *= .3; rr(c, 30, -24, 190, 48, 12); fill(c, '#000'); c.restore();   // тень
    poly(c, [0, -12, 46, -17, 46, 17, 14, 17]); fill(c, '#E11D48'); poly(c, [0, -12, 46, -17, 46, -6, 8, -2]); fill(c, '#FB7185'); poly(c, [14, 17, 46, 17, 46, 9, 12, 9]); fill(c, '#9F1239');   // стержень со скосом
    const g = c.createLinearGradient(0, -24, 0, 24); g.addColorStop(0, '#78530a'); g.addColorStop(.28, '#fde68a'); g.addColorStop(.55, '#d4a017'); g.addColorStop(1, '#6b4a08');
    rr(c, 44, -20, 30, 40, 4); c.fillStyle = g; c.fill(); rr(c, 70, -24, 150, 48, 10); c.fillStyle = g; c.fill();
    c.fillStyle = 'rgba(80,52,6,.55)'; c.fillRect(70, -24, 7, 48); c.fillRect(212, -24, 8, 48); c.fillStyle = 'rgba(255,248,220,.55)'; c.fillRect(80, -16, 128, 5);
    rr(c, 70, -24, 150, 48, 10); lnB(c, 2, 'rgba(60,40,4,.55)');
    c.restore();
  }
  function pullThread2(c, t) {   // нить 2020 → 1924 тянется в реальном времени: провисает, у булавки 1924 дрожит и замирает
    const k = eio(at(t, K.rules - .1, K.vperv + .05)); if (k <= 0) return;
    const [x1, y1] = pinP(CARDS[1]), [x2, y2] = pinP(C24), x = lp(x1, x2, k), y = lp(y1, y2, k), t1 = K.vperv + .05;
    const tw = t > t1 ? 16 * Math.exp(-5 * (t - t1)) * Math.sin(24 * (t - t1)) : 0, sag = 46 * Math.sin(Math.PI * k) + tw, mx = (x1 + x) / 2 + sag * .3, my = (y1 + y) / 2 + sag;
    c.save(); c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.quadraticCurveTo(mx + 3, my + 6, x + 3, y + 6); lnB(c, 4, 'rgba(0,0,0,.25)');
    c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(mx, my, x, y); lnB(c, 4, '#dc2626');
    if (k < 1) { glow(c, x, y, 26, '#fecaca', .55); circ(c, x, y, 5, '#fff1f2') }
    c.restore();
  }
  function endB(c, t) {
    if (t < K.zo1) { zoomOutTo2020(c, t, cc => board(cc, t, { th: [1, 0, 1] })); return }   // нить 2020 → 1924 ещё не натянута
    if (!KB2) KB2 = [KY(K.zo1, 540, 960, 1), KY(K.rules + .15, 660, 500, 1.5), KY(K.rules + .95, 610, 620, 1.9), KY(K.vperv + .35, 540, 812, 2.45), KY(K.d0, 540, 810, 2.6)];
    const p = PH / 1080, [pcx, pcy] = photoC(C24), zc = 2.6, Fc = [540, 810], FE = [pcx, pcy + p * 100];   // в конце фото = кадр 0 главы ровно во весь экран
    let z, F;
    if (t >= K.d0) { const f = DV(t).f; z = zc * Math.exp(DVB * f); F = [lp(Fc[0], FE[0], f), lp(Fc[1], FE[1], f)] }
    else { const q = camObj(camAt(KB2, t)); z = q.z; F = [q.x, q.y] }
    const kc = eio(at(t, K.d0 + .05, K.d0 + 2.05)), labA = 1 - at(kc, .1, .35), L = lipState(t);   // фото раскрывается из квадрата в кадр 9:16
    const ops = { th: [1, 0, 1], card: { '1924': { ch3: true, lip: L, labA, sub: '«МАЛЬБОРО»: МЯГКИЕ, КАК МАЙ', subA: at(t, K.L1 + .2, K.L1 + .6) } } };
    c.save(); c.translate(540, 960); c.scale(z, z); c.translate(-F[0], -F[1]);
    board(c, t, ops); pullThread2(c, t); pin(c, ...pinP(CARDS[1])); pin(c, ...pinP(C24));
    if (L.s > 0 && L.s < 1) { const [lx, ly] = lipTip(L.s); lipTube(c, pcx + lx, pcy + ly, .95) }
    if (kc > 0) {   // фото раскрывается из квадрата во весь кадр главы; окно шире кадра — поля и подпись карточки не торчат по краям
      const m = 26, R = [lp(pcx - PH / 2, pcx - 540 * p - m, kc), lp(pcy - PH / 2, pcy - 860 * p - m, kc), lp(PH, WW * p + 2 * m, kc), lp(PH, HH * p + 2 * m, kc)];
      c.save(); c.beginPath(); c.rect(...R); c.clip(); c.translate(pcx, pcy); c.scale(p, p); c.translate(-540, -860); if (CH3OK) ch3(c, t); else ep3Frame(c, t); c.restore();
    }
    c.restore();
  }
  function ep3Pill(c, a) { c.save(); c.setTransform(1, 0, 0, 1, 0, -220 * (1 - eo(a))); yearPill(c, 1924, 1924, 1, 1, true); c.restore() }
