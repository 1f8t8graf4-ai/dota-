  // ================= мир 8 (фразы 7–8): щит у трассы (координаты мира 1) → проезд вдоль трассы, щит за щитом → щиты на столбах как столбики графика (#109),
  // наш красный дорастает до 4-го места → уходит в ночное небо → Земля: столбик становится лучом радара (#039), на материках загораются пачки.
  let T8 = null, K8 = null, KE = null, NE8 = null;
  const ROW = { x0: 4400, dx: 1100, n: 8, ours: 5 }, BARH = [2600, 3400, 2200, 3000, 1800, 0, 1500, 1200];
  const OURX = ROW.x0 + ROW.ours * ROW.dx + BB.w / 2;   // центр нашего щита в ряду
  const GLOBE = { x: 540, y: 960, R: 360 }, SPACE = '#0B0F2A', GLOBEC = '#1C2B6B', LANDC = '#26244A', BEAMW = 40;
  function w8Init() {
    const s = 's8', a7 = T7;
    T8 = { sim: a7.sim, muzh: Ws('s7', 'мужчины'), a: SA(s), cherez: Ws(s, 'через'), god: Ws(s, 'год'), byv: Ws(s, 'бывшая'), mar: Ws(s, 'марка'), chet: Ws(s, 'четвёртая'), str: Ws(s, 'стране'),
      sem: Ws(s, 'семьдесят'), vt: Ws(s, 'втором'), perv: Ws(s, 'первая'), mir: Ws(s, 'мире'), end: SA('s9') - .02 };
    const a = T8; a.sw = a.perv - .12;   // смена мира: в кадре — только ночное небо, звёзды и красный столбик
    a.sweep0 = a.perv + .2; a.sweep1 = a.end - .2;   // v20.2: круг радара — 0,8 с
    K8 = [KY(a.sim + .2, 470, 850, 1.7), KY(a.muzh + .42, 540, 955, 1.01), KY(a.cherez + .25, 900, 950, .98), KY(a.byv + .18, 3000, 930, .9), KY(a.mar + .08, 6000, 820, .62),
      KY(a.chet + .25, 8700, -300, .135), KY(a.str + .15, 8760, -420, .13), KY(a.sem + .28, OURX, -3200, .16), KY(a.vt + .4, OURX, -12000, .19), KY(a.sw, OURX, -15500, .2)];
    // W8 вложен в Землю: основание нашего столбика (OURX, 1378) — верх шара, ширина щита — ширина луча
    const m = BEAMW / BB.w; NE8 = { x: GLOBE.x - (OURX - 540) * m, y: GLOBE.y - GLOBE.R - (1378 - 960) * m, m };
    KE = [KY(a.mir + .1, 540, 900, .9), KY(a.sweep1 - .3, 540, 910, .92)];
  }
  function nightK(t) { const a = T8; return eio(at(t, a.byv - .2, a.sem + .6)) }
  function ourH(t) { const a = T8; return lp(600, 2400, eio(at(t, a.chet - .45, a.chet + .45))) + 90000 * Math.pow(at(t, a.sem - .1, a.sw + .3), 2.2) }
  // v20.2: на чужих щитах — обычная реклама 1950-х без марок (газировка, машина, кофе, бензин, шины, шляпы); ночью темнеет, как наш плакат
  function adPoster(c, x, y, i, nk) {
    const W = BB.w, H = BB.h, v = i % 6, BG = ['#2E7F86', '#E6D3A8', '#7A4A2A', '#E3B23C', '#2F4F8F', '#C96A5A'][v], INK = ['#F4F1EA', '#8E1B24', '#F4E3C8', '#3A2416', '#F4F1EA', '#F8EEE4'][v];
    c.save(); c.beginPath(); c.rect(x, y, W, H); c.clip(); c.fillStyle = BG; c.fillRect(x, y, W, H); c.fillStyle = shd(BG, .14); c.fillRect(x, y + H * .78, W, H * .22);
    c.fillStyle = INK; c.fillRect(x + 60, y + 70, 420, 64); c.fillRect(x + 60, y + 160, 280, 34); c.fillRect(x + 60, y + 214, 330, 34);   // заголовок и строки — плашками, без слов
    if (v === 0) { rr(c, x + 680, y + 150, 120, 380, 46); fill(c, '#F4F1EA'); rr(c, x + 712, y + 90, 56, 90, 14); fill(c, '#F4F1EA'); c.fillStyle = '#C8102E'; c.fillRect(x + 680, y + 300, 120, 70); circ(c, x + 560, y + 420, 70, '#C8102E') }   // бутылка газировки
    else if (v === 1) { rr(c, x + 470, y + 360, 420, 110, 46); fill(c, '#C8102E'); rr(c, x + 560, y + 290, 230, 100, 40); fill(c, '#C8102E'); c.fillStyle = '#BFE3EE'; c.fillRect(x + 590, y + 310, 80, 60); c.fillRect(x + 690, y + 310, 80, 60);
      circ(c, x + 560, y + 480, 46, '#2A1A14'); circ(c, x + 800, y + 480, 46, '#2A1A14'); circ(c, x + 560, y + 480, 18, '#D8D2C8'); circ(c, x + 800, y + 480, 18, '#D8D2C8') }   // машина
    else if (v === 2) { rr(c, x + 600, y + 300, 230, 200, 30); fill(c, '#F4F1EA'); c.beginPath(); c.arc(x + 840, y + 390, 50, -1.2, 1.2); c.strokeStyle = '#F4F1EA'; c.lineWidth = 22; c.stroke();
      for (let k = 0; k < 3; k++) smokeLine(c, [x + 650 + k * 60, y + 280, x + 670 + k * 60, y + 220, x + 650 + k * 60, y + 160, x + 670 + k * 60, y + 100], 8, '#F4E3C8', .9) }   // чашка кофе
    else if (v === 3) { rr(c, x + 640, y + 170, 170, 360, 18); fill(c, '#C8102E'); rr(c, x + 668, y + 210, 114, 90, 10); fill(c, '#F4F1EA'); c.beginPath(); c.moveTo(x + 810, y + 260); c.quadraticCurveTo(x + 900, y + 270, x + 880, y + 420); c.strokeStyle = '#2A1A14'; c.lineWidth = 16; c.stroke() }   // бензоколонка
    else if (v === 4) { ring(c, x + 700, y + 360, 150, '#F4F1EA', 60); for (let k = 0; k < 12; k++) { const an = k * TAU / 12; c.fillStyle = '#2F4F8F'; c.save(); c.translate(x + 700 + Math.cos(an) * 150, y + 360 + Math.sin(an) * 150); c.rotate(an); c.fillRect(-6, -30, 12, 60); c.restore() } }   // шина
    else { fig(c, x + 720, y + 560, 2.1, { col: '#F8EEE4', hc: '#3A1830' }); fig(c, x + 880, y + 560, 1.8, { m: true, hat: true, col: '#F8EEE4' }) }   // шляпы и пальто
    if (nk) { c.fillStyle = `rgba(14,18,46,${.55 * nk})`; c.fillRect(x, y, W, H) }
    c.restore();
  }
  function rowBoard(c, t, i, nk) {   // щит в ряду: рама, плакат (наш — Marlboro, другие — обычная реклама), под щитом столбик своего цвета
    const x = ROW.x0 + i * ROW.dx, ours = i === ROW.ours, kb = at(t, T8.chet - .5, T8.chet + .1), hb = ours ? ourH(t) : lp(1200, BARH[i], eio(kb)), y = 1378 - hb - BB.h;
    const col = ours ? C3.red : GRAYS[i % 4], cb = mixc(C3.steel, col, eio(kb));
    c.fillStyle = cb; c.fillRect(x + (BB.w - lp(60, BB.w, eio(kb))) / 2, y + BB.h, lp(60, BB.w, eio(kb)), hb);
    c.fillStyle = C3.steel; c.fillRect(x - 12, y - 12, BB.w + 24, BB.h + 24);
    if (ours) { c.save(); c.translate(x - BB.x, y - BB.y); poster(c, t, { peelPx: 0, night: nk * .6 }); c.restore() }
    else adPoster(c, x, y, i + 1, nk * .6);
  }
  function w8World(c, t, q) {
    const a = T8, nk = nightK(t);
    layer(c, q, .3, cc => { P0(cc, .3); desertFar(cc, nk) });
    if (nk > .05) starsS(c, t, ss(.3, .9, nk) * at(viewRect(q).y1, 2500, -800));
    layer(c, q, 1, cc => {
      desertGround(cc, t, nk, q); billboardFrame(cc, { lamp: nk }); poster(cc, t, { peelPx: 0, night: nk * .6 });
      for (let i = 0; i < ROW.n; i++) rowBoard(cc, t, i, nk);
      [1700, 2900].forEach((bx, j) => { cc.save(); cc.translate(bx - BB.x, 0); cc.fillStyle = C3.steel; cc.fillRect(BB.x + 230, BB.y + BB.h, 24, 1378 - BB.y - BB.h); cc.fillRect(BB.x + 714, BB.y + BB.h, 24, 1378 - BB.y - BB.h);
        cc.fillRect(BB.x - 12, BB.y - 12, BB.w + 24, BB.h + 24); cc.restore(); adPoster(cc, bx, BB.y, j ? 4 : 2, nk * .6) });
      const k4 = at(t, a.chet + .05, a.chet + .45) * (1 - at(t, a.sem - .2, a.sem + .2));
      if (k4 > 0) { const x = OURX, y = 1378 - ourH(t) - BB.h - 900; tx(cc, '№ 4 В США', x, y, { f: 'M', w: 800, s: 640 * bo(k4), c: '#F4F1EA', a: Math.min(1, k4 * 2) }) }
    });
    layer(c, q, 1.35, cc => { if (q.z < .5) return; P0(cc, 1.35); const u = (t * .045 + .62) % 1, x = lp(-300, 1500, u); tumbleweed(cc, x, 1530 - Math.abs(Math.sin(t * 2.4)) * 26, 44, t * 2.2) });
  }
  // ---------- Земля (v20.2, Боб #039): глобус в концентрических кольцах; наш красный столбик втягивается в стрелку радара, она идёт по кругу
  // градиентным сектором и по очереди зажигает кружки с пачками на кольцах вокруг Земли; «№ 1 В МИРЕ» крупно ----------
  const CONT = [[[-.62, -.15], [-.3, -.42], [-.05, -.3], [-.12, .05], [-.38, .12], [-.55, .02]], [[-.28, .15], [-.08, .2], [-.12, .6], [-.25, .7], [-.3, .35]],
    [[.05, -.35], [.32, -.45], [.5, -.25], [.38, -.05], [.12, -.1]], [[.1, 0], [.3, .02], [.32, .4], [.18, .55], [.06, .3]], [[.45, .3], [.62, .32], [.6, .45], [.44, .44]]];
  const RING = [1.24, 1.46], ICONS = [[0, -.95], [1, -.35], [0, .45], [1, 1.1], [0, 1.75], [1, 2.4], [0, 3.05], [1, 3.75], [0, 4.45], [1, 5.15]];   // кольцо, угол от верха по часовой
  const PACKS_E = ICONS, AN = an => ((an % TAU) + TAU) % TAU;   // для звуков: кружок загорается, когда стрелка проходит его угол
  function blob(c, pts) { const n = pts.length; c.beginPath(); const m = i => [(pts[i % n][0] + pts[(i + 1) % n][0]) / 2, (pts[i % n][1] + pts[(i + 1) % n][1]) / 2]; let p = m(n - 1); c.moveTo(p[0], p[1]);
    for (let i = 0; i < n; i++) { const q2 = m(i); c.quadraticCurveTo(pts[i][0], pts[i][1], q2[0], q2[1]) } c.closePath() }
  function radarT(t) { const a = T8; return { ret: eio(at(t, a.sw + .04, a.sweep0)), sw: eio(at(t, a.sweep0, a.sweep1)), back: eio(at(t, a.sweep1 - .04, a.sweep1 + .14)) } }
  function earthWorld(c, t, q) {
    const a = T8, G = GLOBE, R = G.R, { ret, sw, back } = radarT(t), ang = -Math.PI / 2 + TAU * sw;
    c.fillStyle = SPACE; c.fillRect(-60000, -60000, 120000, 120000);
    starsS(c, t, 1);
    RING.forEach(rk => ring(c, G.x, G.y, R * rk, 'rgba(200,210,255,.22)', 3)); ring(c, G.x, G.y, R * 1.7, 'rgba(200,210,255,.1)', 2);
    if (sw > 0 && sw < 1) { const g = c.createConicGradient(ang - 1.25, G.x, G.y); g.addColorStop(0, 'rgba(200,16,46,0)'); g.addColorStop(1.25 / TAU, 'rgba(232,40,70,.42)'); g.addColorStop(1.25 / TAU + .001, 'rgba(200,16,46,0)'); g.addColorStop(1, 'rgba(200,16,46,0)');
      c.beginPath(); c.arc(G.x, G.y, R * 1.7, 0, TAU); c.fillStyle = g; c.fill() }   // след радара — градиентный сектор
    circ(c, G.x, G.y, R, GLOBEC);   // океан = земля ночной сцены (на нырке к горизонту — тот же цвет)
    c.save(); c.beginPath(); c.arc(G.x, G.y, R, 0, TAU); c.clip();
    CONT.forEach(P => { blob(c, P.map(p => [G.x + p[0] * R * 1.15, G.y + p[1] * R * 1.15])); fill(c, '#2E4290') });
    if (q.z < 3) { c.strokeStyle = 'rgba(150,180,255,.16)'; c.lineWidth = 2; [-.45, 0, .45].forEach(la => { c.beginPath(); c.ellipse(G.x, G.y + la * R, R * Math.sqrt(1 - la * la), R * .13, 0, 0, TAU); c.stroke() });
    [.36, .72].forEach(lo => { c.beginPath(); c.ellipse(G.x, G.y, R * lo, R, 0, 0, TAU); c.stroke() }) }   // параллели и меридианы — объём (вблизи не рисуем: сходятся в точке нырка)
    for (let i = 0; i < 40; i++) { const u = H1(i * 2.3), v = H1(i * 5.1); circ(c, G.x + (u - .5) * R * 1.3, G.y + (v - .45) * R * 1.2, 2.2, rgba('#FDE68A', .45)) }
    c.beginPath(); c.arc(G.x + R * .6, G.y - R * .08, R * 1.08, 0, TAU); fill(c, 'rgba(6,8,30,.42)'); c.restore();   // терминатор — ночная сторона справа
    c.beginPath(); c.arc(G.x, G.y, R - 6, Math.PI * 1.02, Math.PI * 1.36); c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = 9; c.stroke();   // блик — слева, не на верху шара (туда ныряем)
    ICONS.forEach(([ri, an], i) => { const r = R * RING[ri], th = -Math.PI / 2 + an, px = G.x + Math.cos(th) * r, py = G.y + Math.sin(th) * r, lit = spr(at(sw * TAU, AN(an) + .05, AN(an) + .65));
      circ(c, px, py, 44, mixc('#1B2552', '#C8102E', Math.min(1, lit))); ring(c, px, py, 44, lit > .02 ? '#F4F1EA' : 'rgba(200,210,255,.35)', 3);
      if (lit > 0) { c.save(); c.translate(px, py + 2); c.scale(.17 * lit, .17 * lit); mPack(c, -95, -141, 190, 282, 34, { shadow: false }); c.restore(); ring(c, px, py, 44 + 40 * at(lit, 0, 1), rgba('#F4F1EA', .5 * (1 - Math.min(1, lit))), 3) } });
    { const rin = lp(R, 0, ret), rout = Math.max(rin, (R * 1.7 + 60000 * Math.pow(1 - ret, 4)) * (1 - back)), bw = lp(BEAMW, 14, ret);   // наш столбик → стрелка радара; после круга уходит в Землю
      if (rout > rin + 1) { c.save(); c.translate(G.x, G.y); c.rotate(ang + Math.PI / 2); c.fillStyle = C3.red; c.fillRect(-bw / 2, -rout, bw, rout - rin); c.fillStyle = `rgba(255,240,240,${.8 * ret})`; c.fillRect(-1.5, -rout, 3, rout - rin); c.restore() } }
    const k1 = at(t, a.perv + .25, a.perv + .6) * (1 - at(t, a.sweep1 + .15, a.sweep1 + .4)); if (k1 > 0) plate(c, '№ 1 В МИРЕ', G.x, G.y - R * 1.7 - 90, bo(k1), { s: 84, bg: '#F4F1EA', c: '#141010', ls: 3 });
    if (typeof nightInEarth === 'function') nightInEarth(c, t, q);
  }
  function w8Shot(c, t) {
    if (t < T8.sw) { const q = camObj(camAt(K8, t)); w8World(c, t, q) }
    else { const q = camObj(camAt(KE, t)); layer(c, q, 1, cc => earthWorld(cc, t, q)) }
  }
