  // ================= мир 8 (фразы 7–8): щит у трассы (координаты мира 1) → проезд вдоль трассы, щит за щитом → щиты на столбах как столбики графика (#109),
  // наш красный дорастает до 4-го места → уходит в ночное небо → Земля: столбик становится лучом радара (#039), на материках загораются пачки.
  let T8 = null, K8 = null, KE = null, NE8 = null;
  const ROW = { x0: 4400, dx: 1100, n: 8, ours: 5 }, BARH = [2600, 3400, 2200, 3000, 1800, 0, 1500, 1200];
  const OURX = ROW.x0 + ROW.ours * ROW.dx + BB.w / 2;   // центр нашего щита в ряду
  const GLOBE = { x: 540, y: 960, R: 360 }, SPACE = '#0B0F2A', GLOBEC = '#18183A', LANDC = '#26244A', BEAMW = 40;
  function w8Init() {
    const s = 's8', a7 = T7;
    T8 = { sim: a7.sim, muzh: Ws('s7', 'мужчины'), a: SA(s), cherez: Ws(s, 'через'), god: Ws(s, 'год'), byv: Ws(s, 'бывшая'), mar: Ws(s, 'марка'), chet: Ws(s, 'четвёртая'), str: Ws(s, 'стране'),
      sem: Ws(s, 'семьдесят'), vt: Ws(s, 'втором'), perv: Ws(s, 'первая'), mir: Ws(s, 'мире'), end: SA('s9') - .02 };
    const a = T8; a.sw = a.perv - .12;   // смена мира: в кадре — только ночное небо, звёзды и красный столбик
    a.sweep0 = a.mir - .05; a.sweep1 = a.end - .2;
    K8 = [KY(a.sim + .2, 470, 850, 1.7), KY(a.muzh + .42, 540, 955, 1.01), KY(a.cherez + .25, 900, 950, .98), KY(a.byv + .18, 3000, 930, .9), KY(a.mar + .08, 6000, 820, .62),
      KY(a.chet + .25, 8700, -300, .135), KY(a.str + .15, 8760, -420, .13), KY(a.sem + .28, OURX, -3200, .16), KY(a.vt + .4, OURX, -12000, .19), KY(a.sw, OURX, -15500, .2)];
    // W8 вложен в Землю: основание нашего столбика (OURX, 1378) — верх шара, ширина щита — ширина луча
    const m = BEAMW / BB.w; NE8 = { x: GLOBE.x - (OURX - 540) * m, y: GLOBE.y - GLOBE.R - (1378 - 960) * m, m };
    KE = [KY(a.mir + .1, 540, 880, .95), KY(a.sweep1 - .3, 540, 900, .98)];
  }
  function nightK(t) { const a = T8; return eio(at(t, a.byv - .2, a.sem + .6)) }
  function ourH(t) { const a = T8; return lp(600, 2400, eio(at(t, a.chet - .45, a.chet + .45))) + 90000 * Math.pow(at(t, a.sem - .1, a.sw + .3), 2.2) }
  function rowBoard(c, t, i, nk) {   // щит в ряду: рама, плакат (наш — Marlboro, другие — серые без названий), под щитом столбик своего цвета
    const x = ROW.x0 + i * ROW.dx, ours = i === ROW.ours, kb = at(t, T8.chet - .5, T8.chet + .1), hb = ours ? ourH(t) : lp(1200, BARH[i], eio(kb)), y = 1378 - hb - BB.h;
    const col = ours ? C3.red : GRAYS[i % 4], cb = mixc(C3.steel, col, eio(kb));
    c.fillStyle = cb; c.fillRect(x + (BB.w - lp(60, BB.w, eio(kb))) / 2, y + BB.h, lp(60, BB.w, eio(kb)), hb);
    c.fillStyle = C3.steel; c.fillRect(x - 12, y - 12, BB.w + 24, BB.h + 24);
    if (ours) { c.save(); c.translate(x - BB.x, y - BB.y); poster(c, t, { peelPx: 0, night: nk * .6 }); c.restore() }
    else { c.fillStyle = mixc('#B8B4AC', '#3A3848', nk * .6); c.fillRect(x, y, BB.w, BB.h); c.fillStyle = mixc(col, '#2A2838', nk * .5); c.fillRect(x, y + BB.h * .55, BB.w, BB.h * .45);
      c.fillStyle = mixc('#8A867E', '#2A2838', nk * .6); c.fillRect(x + 60, y + 60, 420, 60); c.fillRect(x + 60, y + 150, 260, 40); rr(c, x + 640, y + 140, 200, 300, 10); fill(c, mixc('#6E6A62', '#242232', nk * .6)) }
  }
  function w8World(c, t, q) {
    const a = T8, nk = nightK(t);
    layer(c, q, .3, cc => { P0(cc, .3); desertFar(cc, nk) });
    if (nk > .05) starsS(c, t, ss(.3, .9, nk) * at(viewRect(q).y1, 2500, -800));
    layer(c, q, 1, cc => {
      desertGround(cc, t, nk, q); billboardFrame(cc, { lamp: nk }); poster(cc, t, { peelPx: 0, night: nk * .6 });
      for (let i = 0; i < ROW.n; i++) rowBoard(cc, t, i, nk);
      [1700, 2900].forEach((bx, j) => { cc.save(); cc.translate(bx - BB.x, 0); cc.fillStyle = C3.steel; cc.fillRect(BB.x + 230, BB.y + BB.h, 24, 1378 - BB.y - BB.h); cc.fillRect(BB.x + 714, BB.y + BB.h, 24, 1378 - BB.y - BB.h);
        cc.fillRect(BB.x - 12, BB.y - 12, BB.w + 24, BB.h + 24); cc.fillStyle = mixc(j ? '#C9C2B4' : '#B5AFA2', '#3A3848', nk * .6); cc.fillRect(BB.x, BB.y, BB.w, BB.h); cc.fillStyle = mixc(GRAYS[j + 1], '#2A2838', nk * .5); cc.fillRect(BB.x, BB.y + 380, BB.w, 250); cc.restore() });
      const k4 = at(t, a.chet + .05, a.chet + .45) * (1 - at(t, a.sem - .2, a.sem + .2));
      if (k4 > 0) { const x = OURX, y = 1378 - ourH(t) - BB.h - 900; tx(cc, '№ 4 В США', x, y, { f: 'M', w: 800, s: 640 * bo(k4), c: '#F4F1EA', a: Math.min(1, k4 * 2) }) }
    });
    layer(c, q, 1.35, cc => { if (q.z < .5) return; P0(cc, 1.35); const u = (t * .045 + .62) % 1, x = lp(-300, 1500, u); tumbleweed(cc, x, 1530 - Math.abs(Math.sin(t * 2.4)) * 26, 44, t * 2.2) });
  }
  // ---------- Земля ----------
  const CONT = [[[-.62, -.15], [-.3, -.42], [-.05, -.3], [-.12, .05], [-.38, .12], [-.55, .02]], [[-.28, .15], [-.08, .2], [-.12, .6], [-.25, .7], [-.3, .35]],
    [[.05, -.35], [.32, -.45], [.5, -.25], [.38, -.05], [.12, -.1]], [[.1, 0], [.3, .02], [.32, .4], [.18, .55], [.06, .3]], [[.45, .3], [.62, .32], [.6, .45], [.44, .44]]];
  const PACKS_E = [[-.36, -.18], [-.2, .38], [.25, -.28], [.2, .22], [.53, .38], [-.5, -.05], [.4, -.18]];
  function earthWorld(c, t, q) {
    const a = T8, G = GLOBE;
    c.fillStyle = SPACE; c.fillRect(-60000, -60000, 120000, 120000);
    starsS(c, t, 1);
    const sw = eio(at(t, a.sweep0, a.sweep1)), ang = -Math.PI / 2 + TAU * sw, ret = eio(at(t, a.sweep1 - .05, a.sweep1 + .35));
    c.save(); c.translate(G.x, G.y); c.rotate(ang + Math.PI / 2); c.fillStyle = C3.red; c.fillRect(-BEAMW / 2, -G.R - 60000 * (1 - ret), BEAMW, 60000 * (1 - ret) + 10); c.restore();   // луч: снаружи шара
    circ(c, G.x, G.y, G.R, GLOBEC);
    c.save(); c.beginPath(); c.arc(G.x, G.y, G.R, 0, TAU); c.clip();
    CONT.forEach(P => { poly(c, P.flatMap(p => [G.x + p[0] * G.R * 1.15, G.y + p[1] * G.R * 1.15])); fill(c, LANDC) });
    for (let i = 0; i < 40; i++) { const u = H1(i * 2.3), v = H1(i * 5.1); circ(c, G.x + (u - .5) * G.R * 1.3, G.y + (v - .45) * G.R * 1.2, 2.2, rgba('#FDE68A', .45)) }
    if (sw > 0 && sw < 1) { c.beginPath(); c.moveTo(G.x, G.y); c.arc(G.x, G.y, G.R + 20, ang - .7, ang); c.closePath(); fill(c, 'rgba(200,16,46,.22)'); c.save(); c.translate(G.x, G.y); c.rotate(ang); c.fillStyle = C3.red; c.fillRect(0, -6, G.R + 20, 12); c.restore() }
    PACKS_E.forEach(([u, v], i) => { const pa = Math.atan2(v, u), d = ((pa - (-Math.PI / 2)) % TAU + TAU) % TAU, k = spr(at(sw * TAU, d, d + .6)); if (k <= 0) return;
      const px = G.x + u * G.R * 1.15, py = G.y + v * G.R * 1.15; c.save(); c.translate(px, py); c.scale(k * .16, k * .16); mPack(c, -95, -141, 190, 282, 34, { shadow: false }); c.restore() });
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(G.x + G.R * .35, G.y - G.R, G.R, G.R * 2); c.restore();
    const k1 = at(t, a.mir - .05, a.mir + .35) * (1 - at(t, a.sweep1 - .25, a.sweep1 + .05)); if (k1 > 0) plate(c, '№ 1 В МИРЕ', G.x, G.y - G.R - 190, bo(k1), { s: 64, bg: '#F4F1EA', c: '#141010', ls: 3 });
    if (typeof nightInEarth === 'function') nightInEarth(c, t, q);
  }
  function w8Shot(c, t) {
    if (t < T8.sw) { const q = camObj(camAt(K8, t)); w8World(c, t, q) }
    else { const q = camObj(camAt(KE, t)); layer(c, q, 1, cc => earthWorld(cc, t, q)) }
  }
