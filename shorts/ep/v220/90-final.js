  // ================= финал фильма (финал Б, f1–f4) — v22.2: собран заново по ТЗ Gemini =================
  // f1 «Так что вы знаете о никотине?» — свет гаснет до луча на доске, маркер пишет название на тёмной полосе над доской.
  // f2 — карточки вспыхивают на глаголах, из-под каждой выползает чек «СПОСОБ БРОСИТЬ».
  // f3 «Переверните доску» — настоящий 3D-поворот на 180° вокруг вертикали (перспектива, ребро, свет уходит); изнанка не пустая: фанера,
  // рамка, светлые отпечатки пяти карточек, острия пяти булавок. «все пять нитей» — из булавок выстреливают пять прямых, туго натянутых
  // красных нитей и симметричными лучами сходятся в центр; на «гигантам» там вырастают две башни — ар-деко R.J. Reynolds и стеклянный
  // монолит Philip Morris, подписи выше Y 1480. f4 «Змея кусает свой хвост» — нити одним движением стягиваются вокруг башен в ровное кольцо,
  // кольцо становится строгим графичным уроборосом: алое тело сужается к хвосту, угловатая голова с клыками смыкает челюсти на кончике хвоста.
  // «бросаете одно — продают следующее» — по концентрической орбите снаружи кольца идут четыре силуэта: Marlboro, IQOS, одноразка, ZYN.
  // В конце башни и доска уходят в темноту — остаются уроборос и крупное название «ЧТО ВЫ ЗНАЕТЕ О НИКОТИНЕ?».
  let T8 = null, KF = null;
  const TC = { x: 540, y: 1700 }, RR = 380, RO = RR + 150;   // центр кольца (и точка схода нитей), радиус кольца, радиус орбиты
  function finalInit() {
    const f = (sc, q) => Ws(sc, q);
    T8 = { f0: K7[K7.length - 1][0], tak: f('f1', 'так'), nik: f('f1', 'никотине'), kur: f('f2', 'курят'), gre: f('f2', 'греют'), par: f('f2', 'парят'), klad: f('f2', 'кладут'), gubu: f('f2', 'губу'),
      prod: f('f2', 'продают'), bros: f('f2', 'бросить'), perev: f('f3', 'переверните'), dosku: f('f3', 'доску'), vse: f('f3', 'все'), niti: f('f3', 'нитей'), tyan: f('f3', 'тянутся'), gig: f('f3', 'гигантам'),
      zmeya: f('f4', 'змея'), kus: f('f4', 'кусает'), hvost: f('f4', 'хвост'), vy: f('f4', 'вы'), brosa: f('f4', 'бросаете'), odno: f('f4', 'одно'), prod2: f('f4', 'продают'), sled: f('f4', 'следующее'), vEnd: TLX.vEnd, end: TLX.endT };
    const a = T8; a.flip0 = a.perev - .1; a.flip1 = a.dosku + .9; a.fade0 = a.vEnd + .05; a.fade1 = a.vEnd + 1.1;
    const k7 = K7[K7.length - 1];
    KF = [k7, KY(a.tak, 540, 565, .87), KY(a.bros + .3, 540, 620, .97), KY(a.flip0, 540, 640, .92), KY(a.flip1, 540, 700, .88), KY(a.gig + .3, 540, 1040, .9),
      KY(a.zmeya + .1, 540, 1110, .88), KY(a.hvost + .4, 540, TC.y - 10, .86), KY(a.vEnd, 540, TC.y - 55, .93), KY(a.end, 540, TC.y - 90, 1.02)];   // до конца медленный наезд на змею — кадр не стоит
  }
  function titleStrip5(c, t, k, a = 1) {   // тёмная полоса над доской, маркер пишет название
    if (k <= 0 && a >= 1) { } const w = 1060, x0 = 540 - w / 2, y0 = -90;
    c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(0,0,0,.4)'; c.fillRect(x0 + 10, y0 + 14, w, 120); rr(c, x0, y0, w, 120, 6); fill(c, '#111116');
    c.save(); c.translate(x0 + 40, y0 - 4); c.rotate(-.2); c.fillStyle = 'rgba(240,230,190,.8)'; c.fillRect(-36, -12, 72, 24); c.restore(); c.save(); c.translate(x0 + w - 40, y0 - 4); c.rotate(.18); c.fillStyle = 'rgba(240,230,190,.8)'; c.fillRect(-36, -12, 72, 24); c.restore();
    if (k > 0) { const o = { f: 'M', w: 800, s: 58, c: '#F4F1EA', ls: 2, mw: w - 70 }, tw0 = Math.min(w - 60, tw(c, TEXT.title, o)); c.save(); c.beginPath(); c.rect(540 - tw0 / 2 - 4, y0, (tw0 + 8) * eo(k), 120); c.clip(); tx(c, TEXT.title, 540, y0 + 62, o); c.restore();
      if (k < 1) { const mx = 540 - tw0 / 2 + tw0 * eo(k); c.save(); c.translate(mx, y0 + 70); c.rotate(-.6); rr(c, -8, -70, 16, 64, 4); fill(c, '#D6334D'); rr(c, -8, -10, 16, 14, 3); fill(c, '#F4F1EA'); c.restore() } }
    c.restore();
  }
  function receipt5(c, x, y, k) {   // чек «СПОСОБ БРОСИТЬ» выползает из-под карточки
    if (k <= 0) return; const w = 190, h = 150 * eo(k); c.save(); c.beginPath(); c.rect(x - w / 2 - 4, y, w + 8, h + 12); c.clip();
    c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(x - w / 2 + 6, y + 8, w, h); c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x + w / 2, y); c.lineTo(x + w / 2, y + h);
    for (let i = 10; i >= 0; i--) c.lineTo(x - w / 2 + i * w / 10, y + h + (i % 2 ? 7 : 0)); c.closePath(); fill(c, '#FBFAF6');
    tx(c, TEXT.quit, x, y + h - 98, { f: 'M', w: 800, s: 22, c: '#1F2A44', mw: w - 24 }); c.fillStyle = '#1F2A44'; for (let i = 0; i < 16; i++) c.fillRect(x - 70 + i * 9, y + h - 66, i % 3 ? 3 : 5, 30);
    tx(c, '$ $ $', x, y + h - 20, { f: 'M', w: 800, s: 18, c: '#D6334D' }); c.restore();
  }
  // ---------- башни (по центру, подписи выше Y 1480 на экране) ----------
  // подпись башни видна, только когда она на экране выше 1460 (центр плашки): субтитры её не закрывают, пока башня встаёт и камера едет
  function capVis(c, x, y) { if (c.canvas.width !== WW || c.canvas.height !== HH) return 1; const m = c.getTransform(), sy = m.b * x + m.d * y + m.f; return 1 - at(sy, 1420, 1450) }
  function towerRJ5(c, x, top, w, k) {   // ар-деко R.J. Reynolds: уступы, шпиль, золотые вертикали
    if (k <= 0) return; const y = top + 900 * (1 - eo(k)); c.save();
    const steps = [[w, 0], [w * .8, -70], [w * .58, -130], [w * .36, -176]];
    steps.forEach(([ww, dy], i) => { const shade = mixc('#2E2C36', '#1E1C26', i * .15); c.fillStyle = shade; c.fillRect(x - ww / 2, y + dy, ww, 2400); c.fillStyle = 'rgba(0,0,0,.28)'; c.fillRect(x + ww * .22, y + dy, ww * .28, 2400);
      c.fillStyle = 'rgba(255,226,170,.25)'; c.fillRect(x - ww / 2, y + dy, ww, 3) });
    c.fillStyle = '#C9A24A'; for (let i = -2; i <= 2; i++) c.fillRect(x + i * w * .17 - 2.5, y + 14, 5, 2400); c.fillRect(x - 4, y - 290, 8, 120); circ(c, x, y - 292, 6, '#F2D27A');
    for (let r = 0; r < 26; r++) for (let i = -2; i < 2; i++) { const on = H1(r * 7.1 + i * 3) > .55; c.fillStyle = on ? 'rgba(255,214,140,.55)' : 'rgba(0,0,0,.25)'; c.fillRect(x + i * w * .17 + 6, y + 40 + r * 44, w * .17 - 12, 22) }
    const cv = at(k, .75, 1) * capVis(c, x, y + 92); if (cv > 0) { c.save(); c.globalAlpha *= cv; rr(c, x - 125, y + 60, 250, 62, 10); fill(c, '#111116'); rr(c, x - 125, y + 60, 250, 62, 10); lnB(c, 3, '#C9A24A'); tx(c, OBJ.rj, x, y + 92, { f: 'M', w: 800, s: 30, c: '#E9C66A', ls: 2, mw: 226 }); c.restore() }
    c.restore();
  }
  function towerPM5(c, x, top, w, k) {   // монолит Philip Morris: тёмное стекло, сетка окон, косой блик
    if (k <= 0) return; const y = top + 900 * (1 - eo(k)); c.save();
    c.fillStyle = '#26344F'; c.fillRect(x - w / 2, y, w, 2400); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(x + w * .2, y, w * .3, 2400);
    c.fillStyle = 'rgba(170,205,245,.3)'; for (let r = 0; r < 40; r++) for (let i = 0; i < 5; i++) c.fillRect(x - w / 2 + 12 + i * (w - 24) / 5, y + 18 + r * 40, (w - 24) / 5 - 7, 26);
    c.save(); c.beginPath(); c.rect(x - w / 2, y, w, 2400); c.clip(); c.fillStyle = 'rgba(255,255,255,.12)'; poly(c, [x - w / 2, y + 300, x - w / 2 + 40, y, x + 10, y, x - w / 2, y + 520]); c.fill(); c.restore();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x - w / 2, y, w, 4); c.fillRect(x - w / 2 + 5, y, 4, 2400);
    const cv = at(k, .75, 1) * capVis(c, x, y + 102); if (cv > 0) { c.save(); c.globalAlpha *= cv; rr(c, x - 125, y + 70, 250, 62, 10); fill(c, '#111116'); rr(c, x - 125, y + 70, 250, 62, 10); lnB(c, 3, '#9DB6D9'); tx(c, OBJ.pmT, x, y + 102, { f: 'M', w: 800, s: 30, c: '#E8EEF8', ls: 2, mw: 226 }); c.restore() }
    c.restore();
  }
  // ---------- нити: прямые струны от булавок изнанки к центру; потом стягиваются в кольцо ----------
  function strings5(c, t, shoot, wrap) {   // shoot 0..1 — нити выстреливают; wrap 0..1 — нити гнутся в кольцо вокруг башен
    const P = BPIN(), ord = [3, 0, 1, 2, 4], n = 40;
    ord.forEach((pi, j) => { const [px, py] = P[pi], u = eo(cl(shoot * 1.6 - j * .15)); if (u <= 0) return;
      const tw = Math.exp(-6 * Math.max(0, shoot * 1.6 - j * .15 - 1)) * (u >= 1 ? 1 : 0), vib = s => Math.sin(Math.PI * s) * 9 * tw * Math.sin((t - T8.niti) * 60);   // струна дрожит и замирает
      const a0 = -Math.PI / 2 + .06 + j * (TAU - .13) / 5, a1 = -Math.PI / 2 + .06 + (j + 1) * (TAU - .13) / 5;
      const pts = []; for (let i = 0; i <= n; i++) { const s = i / n * u, lx = lp(px, TC.x, s), ly = lp(py, TC.y, s), dx = -(TC.y - py), dy = TC.x - px, L = Math.hypot(dx, dy) || 1;
        const ax = lx + dx / L * vib(s), ay = ly + dy / L * vib(s), ang = lp(a0, a1, s), rx = TC.x + Math.cos(ang) * RR, ry = TC.y + Math.sin(ang) * RR, e = eio(wrap);
        pts.push([lp(ax, rx, e), lp(ay, ry, e)]) }
      c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x + 3, y + 5) : c.moveTo(x + 3, y + 5)); lnB(c, 6, 'rgba(0,0,0,.3)');
      c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); lnB(c, 6, '#D6334D'); c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x - 1, y - 1.5) : c.moveTo(x - 1, y - 1.5)); lnB(c, 1.6, 'rgba(255,190,190,.7)');
      if (u < 1) { const [hx, hy] = pts[pts.length - 1]; glow(c, hx, hy, 30, '#FFB0B0', .6); circ(c, hx, hy, 6, '#FFE0E0') } });
    if (shoot >= .99 && wrap <= 0) { glow(c, TC.x, TC.y, 70, '#FF6A6A', .35 * Math.min(1, (t - T8.tyan) * 2)) }
  }
  // ---------- четыре силуэта на орбите снаружи кольца ----------
  function prodIcon(c, kind) {
    circ(c, 0, 0, 58, '#141016'); ring(c, 0, 0, 58, 'rgba(244,241,234,.55)', 3);
    if (kind === 'marl') { c.save(); c.scale(.42, .42); pack3(c, -60, -95, 110, 170, { d: 36, shadow: false }); c.restore() }
    else if (kind === 'iqos') iqos4(c, 0, 0, 96, { shadow: false, name: false });
    else if (kind === 'vape') { rr(c, -15, -42, 30, 84, 10); fill(c, B2.mango); c.save(); rr(c, -15, -42, 30, 84, 10); c.clip(); poly(c, [-15, 2, 15, -10, 15, 44, -15, 44]); fill(c, B2.ice2); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-10, -36, 5, 72); c.restore(); rr(c, -9, -52, 18, 12, 4); fill(c, '#2A2F55') }
    else tin5(c, 0, -12, 40, .5, 0, { name: OBJ.zyn, h: .7, shadow: false });
  }
  function carousel5(c, t, a, out) {
    const k = at(t, a.vy - .15, a.vy + .35); if (k <= 0 || out >= 1) return;
    const step = eio(at(t, a.prod2 - .1, a.sled + .25)) * Math.PI / 2, rot = step + (t - a.vy) * .06;
    ['marl', 'iqos', 'vape', 'zyn'].forEach((kd, i) => { const an = -Math.PI / 4 + i * Math.PI / 2 + rot, x = TC.x + Math.cos(an) * RO, y = TC.y + Math.sin(an) * RO;
      c.save(); c.globalAlpha *= 1 - out; c.translate(x, y); const s = bo(cl(k * 1.3 - i * .1)) * .95; c.scale(s, s); prodIcon(c, kd); c.restore() });
    c.save(); c.globalAlpha *= .35 * k * (1 - out); c.setLineDash([6, 12]); c.beginPath(); c.arc(TC.x, TC.y, RO, 0, TAU); lnB(c, 2, 'rgba(244,241,234,.6)'); c.restore();
  }
  function finalShot(c, t) {
    const a = T8, q = camObj(camAt(KF, t)), fk = eio(at(t, a.flip0, a.flip1)), ang = Math.PI * fk;
    const flashW = [[a.par, 0], [a.par, 1], [a.gre, 2], [a.kur, 3], [a.klad, 4]];
    const flash = i => { const w = flashW.find(f => f[1] === i)[0]; return Math.sin(Math.PI * at(t, w - .1, w + .55)) };
    const fade = eio(at(t, a.fade0, a.fade1)), dim = at(t, a.f0 + .4, a.tak + .2), shoot = at(t, a.niti - .35, a.tyan + .45), wrap = at(t, a.zmeya - .1, a.kus + .35);
    const front = g => { boardWorld5(g, t, { tO: t - 200, flash, noWall: true }); curlCorner(g, t);
      CARDS5.forEach((cd, i) => { const f = flash(i); if (f > 0) { rr(g, cd.x - CW5 / 2 - 8, cd.y - CH5 / 2 - 8, CW5 + 16, CH5 + 16, 10); lnB(g, 6, rgba('#FFD23F', f)) }
        receipt5(g, cd.x, cd.y + CH5 / 2 - 8, at(t, a.prod - .1 + i * .1, a.bros + .2 + i * .1)) }) };
    layer(c, q, 1, cc => {
      wallBg5(cc);
      if (fk > 0 && fk < 1) flipBoard(cc, ang, front, g => boardBack5(g, t, {}));
      else if (fk <= 0) front(cc); else boardBack5(cc, t, {});
      if (dim > 0) { const g = cc.createRadialGradient(540, 640, 420, 540, 700, 1500); g.addColorStop(0, 'rgba(6,4,10,0)'); g.addColorStop(1, `rgba(6,4,10,${.72 * dim})`); cc.fillStyle = g; cc.fillRect(-3000, -3000, 7000, 7000) }
      titleStrip5(cc, t, at(t, a.tak, a.nik + .55), 1 - at(t, a.zmeya, a.hvost));
      const tw = [at(t, a.gig - .55, a.gig + .35), at(t, a.gig - .4, a.gig + .5)];
      towerRJ5(cc, TC.x - 168, TC.y - 280, 190, tw[0]); towerPM5(cc, TC.x + 168, TC.y - 250, 180, tw[1]);
      if (wrap < 1) strings5(cc, t, shoot, wrap);
      if (fade > 0) { cc.save(); cc.globalAlpha *= .97 * fade; cc.fillStyle = '#050407'; cc.fillRect(-3000, -3000, 7000, 7000); cc.restore() }
      if (wrap > .85) { const kw = eio(at(wrap, .85, 1)) * 1 + 0, jaw = 1 - eio(at(t, a.hvost - .25, a.hvost + .05));   // кольцо → тело змеи, голова смыкается на хвосте («хвост»)
        if (wrap < 1) { cc.save(); cc.globalAlpha *= at(wrap, .85, 1); }
        ouro5(cc, t, TC.x, TC.y, RR, { kw: Math.max(.12, kw), kh: at(t, a.kus - .2, a.kus + .3), jaw, hs: 1.45, w: 58, gap: .13 });
        if (wrap < 1) cc.restore();
        const fl = Math.sin(Math.PI * at(t, a.hvost, a.hvost + .4)); if (fl > 0) glow(cc, TC.x, TC.y - RR, 120, '#FF8080', .5 * fl) }
      carousel5(cc, t, a, at(t, a.fade0 - .1, a.fade0 + .5));
    });
    const kt = eio(at(t, a.fade0 + .2, a.fade0 + .9)); if (kt > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha *= kt;   // крупное чистое название
      TEXT.titleL.forEach((L, i) => tx(c, L, 540, 360 + i * 104 + 14 * (1 - kt), { f: 'M', w: 800, s: 82, c: '#F4F1EA', ls: 2, mw: 980 })); c.restore() }
  }
  function finalCues(Q) {
    const a = T8; Q(a.f0 + .4, 'buzz', .3); Q(a.tak, 'marker', .45); Q(a.tak + .6, 'marker', .35);
    [a.kur, a.gre, a.par, a.klad].forEach((w, i) => Q(w, 'shimmer', .3, [-.2, -.4, .1, .4][i])); for (let i = 0; i < 5; i++) Q(a.prod + i * .1, 'receipt', .3, -.4 + i * .2);
    Q(a.flip0, 'whoosh', .55); Q(a.flip0 + .7, 'pageflip', .35); Q(a.flip1 - .1, 'thud', .45); for (let i = 0; i < 5; i++) Q(a.niti - .3 + i * .1, 'whip', .28, -.4 + i * .2); Q(a.gig - .4, 'factory', .45); Q(a.gig, 'boom', .35);
    Q(a.zmeya, 'scuttle', .35); Q(a.hvost, 'chomp', .5); Q(a.vy, 'whoosh', .3); Q(a.prod2, 'register', .4); Q(a.fade0, 'deep', .45);
  }
