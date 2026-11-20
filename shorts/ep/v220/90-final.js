  // ================= финал фильма (финал Б, f1–f4): доска глав переворачивается =================
  // f1 «Так что вы знаете о никотине?» — свет гаснет до луча на доске, маркер пишет название на тёмной полосе над доской.
  // f2 — карточки вспыхивают на глаголах: «курят» 1924, «греют» 2014, «парят» 1979 и 2020, «кладут под губу» 2022; «продают как способ бросить» —
  // из-под каждой карточки выползает чек «СПОСОБ БРОСИТЬ». f3 «Переверните доску» — доска поворачивается на 180°: картон, пять дырок от булавок;
  // из дырок тянутся пять нитей вниз, к башням R.J. Reynolds (ар-деко) и Philip Morris — они поднимаются снизу на «гигантам».
  // f4 «Змея кусает свой хвост» — нити сплетаются в красное кольцо змеи, голова кусает хвост; «бросаете одно — продают следующее» — по кольцу
  // идут силуэты: сигарета → айкос → одноразка → баночка. В конце башни, доска и стена гаснут — остаются кольцо и название.
  let T8 = null, KF = null;
  const RINGC = { x: 540, y: 640, R: 300 }, TWR = [{ id: 'rj', x: 240, w: 300, top: 1400 }, { id: 'pm', x: 840, w: 280, top: 1300 }];
  const TO_TWR = [0, 0, 1, 1, 1];   // какая нить к какой башне (порядок CARDS5): 1979, 2020 → R.J. Reynolds; 2014, 1924, 2022 → Philip Morris
  function finalInit() {
    const f = (sc, q) => Ws(sc, q);
    T8 = { f0: K7[K7.length - 1][0], tak: f('f1', 'так'), nik: f('f1', 'никотине'), kur: f('f2', 'курят'), gre: f('f2', 'греют'), par: f('f2', 'парят'), klad: f('f2', 'кладут'), gubu: f('f2', 'губу'),
      prod: f('f2', 'продают'), bros: f('f2', 'бросить'), perev: f('f3', 'переверните'), dosku: f('f3', 'доску'), niti: f('f3', 'нитей'), tyan: f('f3', 'тянутся'), gig: f('f3', 'гигантам'),
      zmeya: f('f4', 'змея'), kus: f('f4', 'кусает'), hvost: f('f4', 'хвост'), brosa: f('f4', 'бросаете'), odno: f('f4', 'одно'), prod2: f('f4', 'продают'), sled: f('f4', 'следующее'), vEnd: TLX.vEnd, end: TLX.endT };
    const a = T8; a.flip0 = a.perev - .1; a.flip1 = a.dosku + .45; a.fade0 = a.vEnd + .1; a.fade1 = a.vEnd + 1.3;
    const k7 = K7[K7.length - 1];
    KF = [k7, KY(a.tak, 540, 565, .87), KY(a.bros + .3, 540, 620, .97), KY(a.flip0, 540, 600, .85), KY(a.gig + .4, 540, 780, .64), KY(a.zmeya, 540, 700, .74), KY(a.sled, 540, 560, .95), KY(a.end, 540, 440, 1.1)];
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
  function towerRJ(c, x, top, w, k) {   // ар-деко: уступы, золотые полосы
    if (k <= 0) return; const y = lp(2300, top, eo(k)); c.save(); castDots(c, x - w / 2, y + 60, w, 1200, 120, { k: .7 });
    const steps = [[w, 0], [w * .82, -90], [w * .62, -170], [w * .4, -230]]; steps.forEach(([ww, dy]) => { c.fillStyle = '#2E2C36'; c.fillRect(x - ww / 2, y + dy, ww, 2400); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(x + ww * .25, y + dy, ww * .25, 2400) });
    c.fillStyle = '#C9A24A'; for (let i = -2; i <= 2; i++) c.fillRect(x + i * w * .16 - 3, y + 10, 6, 2400); c.fillRect(x - 5, y - 330, 10, 100);
    rr(c, x - 170, y + 120, 340, 76, 10); fill(c, '#111116'); rr(c, x - 170, y + 120, 340, 76, 10); lnB(c, 3, '#C9A24A'); tx(c, OBJ.rj, x, y + 159, { f: 'M', w: 800, s: 40, c: '#C9A24A', ls: 3, mw: 310 }); c.restore();
  }
  function towerPM(c, x, top, w, k) {   // стекло, сетка окон
    if (k <= 0) return; const y = lp(2300, top, eo(k)); c.save(); castDots(c, x - w / 2, y + 60, w, 1200, 120, { k: .7 });
    c.fillStyle = '#3E4F6E'; c.fillRect(x - w / 2, y, w, 2400); c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(x + w * .25, y, w * .25, 2400);
    c.fillStyle = 'rgba(190,220,255,.35)'; for (let r = 0; r < 30; r++) for (let i = 0; i < 6; i++) c.fillRect(x - w / 2 + 14 + i * (w - 28) / 6, y + 20 + r * 46, (w - 28) / 6 - 8, 30);
    c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x - w / 2 + 6, y, 6, 2400);
    rr(c, x - 170, y + 120, 340, 76, 10); fill(c, '#111116'); rr(c, x - 170, y + 120, 340, 76, 10); lnB(c, 3, '#9DB6D9'); tx(c, OBJ.pmT, x, y + 159, { f: 'M', w: 800, s: 40, c: '#E8EEF8', ls: 3, mw: 310 }); c.restore();
  }
  function backThreads(c, t, k, a) {   // нити с изнанки: из дырок к вершинам башен
    if (k <= 0 || a <= 0) return; c.save(); c.globalAlpha *= a;
    CARDS5.forEach((cd, i) => { const [x0, y0] = pin5(cd), hx = 1080 - x0, T = TWR[TO_TWR[i]], tx1 = T.x, ty1 = T.top - (T.id === 'rj' ? 330 : 0), u = eo(cl(k * 1.4 - i * .08));
      if (u <= 0) return; const ex = lp(hx, tx1, u), ey = lp(y0, ty1, u), mx = (hx + ex) / 2, my = Math.max(y0, ey) + 120 * u;
      c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 5; c.beginPath(); c.moveTo(hx + 3, y0 + 6); c.quadraticCurveTo(mx + 3, my + 6, ex + 3, ey + 6); c.stroke();
      c.strokeStyle = '#dc2626'; c.lineWidth = 8; c.beginPath(); c.moveTo(hx, y0); c.quadraticCurveTo(mx, my, ex, ey); c.stroke() });
    c.restore();
  }
  function carousel(c, t) {   // по кольцу: сигарета → айкос → одноразка → баночка; верхний — «сейчас», на «бросаете» уходит, на «продают» приходит следующий
    const a = T8, k = at(t, a.hvost - .1, a.hvost + .5); if (k <= 0) return; const C = RINGC, rot = eio(at(t, a.odno - .1, a.prod2 + .4)) * Math.PI / 2 + Math.max(0, t - a.sled - .4) * .25;
    const icons = ['cig', 'iqos', 'vape', 'tin'];
    icons.forEach((ic, i) => { const an = -Math.PI / 2 - i * Math.PI / 2 + rot, x = C.x + Math.cos(an) * C.R, y = C.y + Math.sin(an) * C.R, top = Math.max(0, Math.cos(an + Math.PI / 2) * -1);
      c.save(); c.translate(x, y); const s = bo(k) * (.85 + .35 * Math.max(0, -Math.sin(an))); c.scale(s, s); circ(c, 0, 0, 64, '#141016'); ring(c, 0, 0, 64, 'rgba(244,241,234,.6)', 3);
      if (ic === 'cig') cigar(c, -46, 0, 46, 0, 11, { filt: C3.filt, ember: 1 }); else if (ic === 'iqos') iqos4(c, 0, 0, 110, { shadow: false, name: false });
      else if (ic === 'vape') { rr(c, -15, -44, 30, 88, 10); fill(c, B2.mango); poly(c, [-15, 0, 15, -12, 15, 44, -15, 44]); fill(c, B2.ice2) } else tin5(c, 0, -10, 40, .5, 0, { name: OBJ.zyn, h: .6, shadow: false });
      c.restore() });
  }
  function finalShot(c, t) {
    const a = T8, q = camObj(camAt(KF, t)), fk = eio(at(t, a.flip0, a.flip1)), sx = Math.cos(Math.PI * fk), lift = 1 + .06 * Math.sin(Math.PI * fk);
    const flashW = [[a.par, 0], [a.par, 1], [a.gre, 2], [a.kur, 3], [a.klad, 4]];
    const flash = i => { const w = flashW.find(f => f[1] === i)[0]; return Math.sin(Math.PI * at(t, w - .1, w + .55)) };
    const fade = at(t, a.fade0, a.fade1), dim = at(t, a.f0 + .4, a.tak + .2);
    layer(c, q, 1, cc => {
      wallBg5(cc); cc.save(); cc.translate(540, 640); cc.scale(sx * lift, lift); cc.translate(-540, -640);
      if (sx > 0) { boardWorld5(cc, t, { tO: t - 200, flash, noWall: true }); curlCorner(cc, t);
        CARDS5.forEach((cd, i) => { const f = flash(i); if (f > 0) { rr(cc, cd.x - CW5 / 2 - 8, cd.y - CH5 / 2 - 8, CW5 + 16, CH5 + 16, 10); lnB(cc, 6, rgba('#FFD23F', f)) }
          receipt5(cc, cd.x, cd.y + CH5 / 2 - 8, at(t, a.prod - .1 + i * .1, a.bros + .2 + i * .1)) }) }
      else boardBack5(cc, t, {});
      cc.restore();
      if (dim > 0) { const g = cc.createRadialGradient(540, 640, 420, 540, 700, 1500); g.addColorStop(0, 'rgba(6,4,10,0)'); g.addColorStop(1, `rgba(6,4,10,${.72 * dim})`); cc.fillStyle = g; cc.fillRect(-3000, -3000, 7000, 7000) }
      titleStrip5(cc, t, at(t, a.tak, a.nik + .55));
      TWR.forEach((T, i) => (T.id === 'rj' ? towerRJ : towerPM)(cc, T.x, T.top, T.w, at(t, a.gig - .55 + i * .12, a.gig + .35 + i * .12)));
      const ringK = at(t, a.zmeya - .1, a.hvost + .05); backThreads(cc, t, at(t, a.niti - .2, a.gig + .3), 1 - ringK);
      if (fade > 0) { cc.save(); cc.globalAlpha *= .94 * fade; cc.fillStyle = '#050407'; cc.fillRect(-3000, -3000, 7000, 7000); cc.restore(); titleStrip5(cc, t, 1, fade) }
      snakeRing(cc, t, RINGC.x, RINGC.y, RINGC.R, ringK, {}); carousel(cc, t);
    });
  }
  function finalCues(Q) {
    const a = T8; Q(a.f0 + .4, 'buzz', .3); Q(a.tak, 'marker', .45); Q(a.tak + .6, 'marker', .35);
    [a.kur, a.gre, a.par, a.klad].forEach((w, i) => Q(w, 'shimmer', .3, [-.2, -.4, .1, .4][i])); for (let i = 0; i < 5; i++) Q(a.prod + i * .1, 'receipt', .3, -.4 + i * .2);
    Q(a.flip0, 'whoosh', .55); Q(a.flip0 + .4, 'thud', .45); Q(a.niti, 'chain', .35); Q(a.gig - .4, 'factory', .45); Q(a.gig, 'boom', .35);
    Q(a.zmeya, 'scuttle', .35); Q(a.hvost, 'chomp', .5); Q(a.odno, 'whoosh', .3); Q(a.prod2, 'register', .4); Q(a.fade0, 'deep', .45);
  }
