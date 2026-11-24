  // ================= мир 6: школьный коридор (строки 10–11) =================
  // Вложен в круг медальона «мозг» (N6): круг — круглое окно двери, за ним коридор со шкафчиками. Фигурки с рюкзаками идут по коридору;
  // на шкафчике — лист «ШКОЛЬНИКИ США», шкала 0–2 %: серый столбик сигарет 1,4 %, белый столбик снюса растёт до 1,7 % и обгоняет — красная стрелка.
  // Строка 11: белый столбик сжимается и делится на две банки (бока банок — тот же белый), они встают на нижнюю планку листа: 3 МГ и 6 МГ;
  // на «покрепче» крышки темнеют, банки выше; барабаны 3 → 9 и 6 → 11; на «вместо трёх и шести» старые числа зачёркнуты.
  let T6 = null, K6 = null;
  const SH6 = { x: 540, y: 900, w: 480, h: 600 }, BASE6 = 1110, PCT6 = 170, BAR6 = [{ x: 430, v: 1.4, col: '#9AA3B5' }, { x: 650, v: 1.7, col: '#FFFFFF' }];
  function schoolInit() {
    const w10 = q => Ws('s10', q), w11 = q => Ws('s11', q);
    T6 = { j: T5.jdive, s10: SA('s10'), amer: w10('американские'), shk: w10('школьники'), sig: w10('сигарет'), kur: w10('курят'), snus: w10('снюс'), ob: w10('обогнал'), sig2: w10('сигареты'),
      s11: SA('s11'), mes: w11('месяца'), razr: w11('разрешили'), snus2: w11('снюс'), kr: w11('покрепче'), dev: w11('девять'), odin: w11('одиннадцать'), mg: w11('миллиграммов'),
      vm: w11('вместо'), tr: w11('трёх'), sh: w11('шести'), shB: WsB('s11', 'шести') };
    const a = T6; a.split0 = a.razr - .35; a.split1 = a.razr + .45; a.jout = a.shB + .35;   // после строки 11 — вода поднимается (мир доски)
    // v22.2: строка 10 — коридор и лист с графиком (камера в движении); строка 11 — камера уезжает вправо к тёмной витрине с двумя банками ZYN
    // («КРЕПОСТЬ»): заголовка «ШКОЛЬНИКИ США» в кадре нет — крепкий снюс не читается как разрешённый школьникам
    K6 = [KY(a.j + .35, 560, 1010, 1.06), KY(a.shk + .2, 640, 1000, 1.02), ...(window.WIDE ? [KY(a.sig + .1, 575, 1030, 1.2), KY(a.ob, 548, 1025, 1.26), KY(a.s11 + .2, 600, 1030, 1.2)] : [KY(a.sig + .1, 575, 955, 1.5), KY(a.ob, 548, 945, 1.6), KY(a.s11 + .2, 600, 950, 1.5)]),   // 24.11: в 16:9 школьники в кадре по пояс, а не одними макушками KY(a.razr - .1, 1600, 1000, 1.3),
      KY(a.kr + .2, 1630, 985, 1.38), KY(a.shB, 1640, 975, 1.5), KY(a.jout + .62, 1640, 970, 1.6)];   // до самой воды камера не встаёт
    linkK(K5, K6, N6, true);
  }
  function schoolRoom(c, t) {
    c.fillStyle = '#E8E4DA'; c.fillRect(-1600, -1200, 4800, 1800); c.fillStyle = '#D6D0C2'; c.fillRect(-1600, 500, 4800, 60);
    for (let i = 0; i < 5; i++) { rr(c, -600 + i * 600, 150, 360, 26, 13); fill(c, '#FFFFFF'); glow(c, -420 + i * 600, 170, 300, '#FFFFFF', .12) }   // лампы
    // v22.2: справа коридор кончается — тёмная витрина-стенд (строка 11)
    c.fillStyle = '#121833'; c.fillRect(1110, 470, 1500, 1030); c.fillStyle = 'rgba(255,255,255,.035)'; for (let x = 1140; x < 2600; x += 110) c.fillRect(x, 470, 3, 1030);
    c.fillStyle = '#2B3256'; c.fillRect(1096, 470, 18, 1030); c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(1096, 470, 4, 1030);
    for (let i = 0; i < 20; i++) {   // шкафчики (до витрины)
      const x = -1500 + i * 130, col = i % 2 ? C5.locker : mixc(C5.locker, C5.lockerL, .25);
      c.fillStyle = col; c.fillRect(x, 560, 126, 920); c.fillStyle = C5.lockerD; c.fillRect(x + 96, 560, 30, 920); c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(x + 6, 570, 6, 900);
      for (let v = 0; v < 4; v++) { c.fillStyle = C5.lockerD; c.fillRect(x + 22, 600 + v * 14, 60, 6) }
      rr(c, x + 70, 1010, 14, 46, 5); fill(c, '#C9CED8'); rr(c, x + 30, 640 + 0, 40, 20, 3); fill(c, 'rgba(255,255,255,.25)');
    }
    c.fillStyle = '#2E4770'; c.fillRect(-1600, 1480, 4800, 14);
    c.fillStyle = C5.floor; c.fillRect(-1600, 1494, 4800, 1500); c.fillStyle = 'rgba(0,0,0,.06)'; for (let y = 1540; y < 3000; y += 70) c.fillRect(-1600, y, 4800, 3);
    c.fillStyle = 'rgba(255,255,255,.25)'; for (let x = -1600; x < 3200; x += 240) c.fillRect(x, 1494, 4, 1500);
  }
  function pack6(c, P, s, back) {   // рюкзак за спиной фигурки
    const top = [P.pel[0], P.pel[1] - RG.torso * s * .95]; c.save(); c.translate(top[0] - (back ? 0 : 0) - 30 * s, top[1] + 10 * s);
    rr(c, -34 * s, 0, 46 * s, 100 * s, 12 * s); fill(c, back); rr(c, -34 * s, 46 * s, 46 * s, 22 * s, 6 * s); fill(c, 'rgba(0,0,0,.18)'); c.restore();
  }
  const WALK6 = [{ x0: 60, v: 170, s: 1.0, f: 1720, col: '#F4F1EA', bp: '#D6334D', t0: 0 }, { x0: 1000, v: -150, s: 1.08, f: 1760, col: '#E8E2D4', bp: '#2F6FD6', t0: .3 },
    { x0: -330, v: 200, s: .94, f: 1690, col: '#EDE7DA', bp: '#F2B84B', t0: .6 }, { x0: 1350, v: -190, s: 1.12, f: 1800, col: '#F4F1EA', bp: '#17A86B', t0: .1 }];
  function walkers6(c, t) {   // фигурки с рюкзаками идут по коридору (кто влево — зеркально)
    const a = T6; if (!a) return;
    WALK6.forEach(W => { const tt = t - a.j + 1.2 + W.t0, P = walker(tt, { x0: 0, v: Math.abs(W.v), T: .62, floor: W.f, s: W.s, t0: 0, lean: .05 }), x = W.x0 + W.v * tt;
      if (x < -600 || x > 1000) return;   // v22.2: к витрине школьники не подходят
      const body = () => { c.save(); c.translate(x - P.pel[0], 0); castDots(c, P.pel[0] - 50 * W.s, W.f - 8, 110 * W.s, 10, 60, { k: .6 }); pack6(c, P, W.s, W.bp); drawRig(c, P, { col: W.col }); c.restore() };
      if (W.v < 0) mirrorX(c, x, body); else body() });
  }
  function sheet6(c, t) {   // лист на шкафчике: шкала 0–2 %, столбики
    const a = T6, S = SH6, x0 = S.x - S.w / 2, y0 = S.y - S.h / 2;
    castDots(c, x0, y0 + 20, S.w, S.h, 70, { k: .7 }); rr(c, x0, y0, S.w, S.h, 6); fill(c, '#FBFAF6');
    c.save(); c.translate(x0 + 60, y0 - 6); c.rotate(-.2); c.fillStyle = 'rgba(240,230,190,.85)'; c.fillRect(-40, -14, 80, 28); c.restore(); c.save(); c.translate(x0 + S.w - 60, y0 - 6); c.rotate(.18); c.fillStyle = 'rgba(240,230,190,.85)'; c.fillRect(-40, -14, 80, 28); c.restore();
    tx(c, TEXT.kids, S.x, y0 + 52, { f: 'M', w: 800, s: 36, c: '#1F2A44', ls: 3, mw: S.w - 40 });
    const ax = 0;   // v22.2: лист остаётся как есть — банки крепкого снюса стоят отдельно, на витрине
    c.save(); c.globalAlpha *= 1 - ax;
    c.fillStyle = 'rgba(31,42,68,.85)'; c.fillRect(x0 + 70, BASE6, S.w - 110, 5); c.fillRect(x0 + 70, BASE6 - 2 * PCT6, 4, 2 * PCT6);
    for (let i = 0; i <= 2; i++) { const yy = BASE6 - i * PCT6; c.fillStyle = 'rgba(31,42,68,.15)'; c.fillRect(x0 + 70, yy, S.w - 110, 2); tx(c, TEXT.fPct(i), x0 + 40, yy, { f: 'M', w: 800, s: 24, c: '#56607A' }) }
    c.restore();
    const B = BAR6, kc = eo(at(t, a.sig - .1, a.kur + .1)), ks = eo(at(t, a.snus - .1, a.ob + .05));
    // сигареты: серый столбик 1,4 % и значок
    c.save(); c.globalAlpha *= 1 - ax; const hc = B[0].v * PCT6 * kc; rr(c, B[0].x - 55, BASE6 - hc, 110, hc, 6); fill(c, B[0].col);
    if (kc > .6) tx(c, TEXT.fPct('1.4'), B[0].x, BASE6 - hc - 28, { f: 'M', w: 800, s: 32, c: '#56607A', a: at(kc, .6, 1) });
    cigar(c, B[0].x - 46, BASE6 + 44, B[0].x + 46, BASE6 + 44, 10, { filt: C3.filt, ember: 1 }); c.restore();
    // снюс: белый столбик 1,7 % (обводка) и баночка-значок; на «обогнал» — красная стрелка
    if (ax <= 0) { const hs = B[1].v * PCT6 * ks; rr(c, B[1].x - 55, BASE6 - hs, 110, hs, 6); fill(c, '#FFFFFF'); rr(c, B[1].x - 55, BASE6 - hs, 110, hs, 6); lnB(c, 3, '#1F2A44');
      if (ks > .6) tx(c, TEXT.fPct('1.7'), B[1].x, BASE6 - hs - 28, { f: 'M', w: 800, s: 32, c: '#1F2A44', a: at(ks, .6, 1) });
      tin5(c, B[1].x, BASE6 + 34, 30, .5, 0, { h: .6, shadow: false }) }
    const kar = eo(at(t, a.ob - .1, a.ob + .35)) * (1 - ax); if (kar > 0) { c.save(); c.globalAlpha *= kar; const y1 = BASE6 - 1.4 * PCT6, y2 = BASE6 - 1.7 * PCT6 - 70;
      c.beginPath(); c.moveTo(B[0].x, y1 - 60); c.quadraticCurveTo(B[0].x + 60, y2 - 60, lp(B[0].x, B[1].x - 30, kar), lp(y1 - 60, y2, kar)); lnB(c, 8, '#D6334D');
      if (kar > .9) { c.save(); c.translate(B[1].x - 30, y2); c.rotate(.6); poly(c, [0, 0, -26, -10, -16, 14]); fill(c, '#D6334D'); c.restore() } c.restore() }
  }
  const DSP = { x: 1640, y: 1100, xs: [1520, 1760] };
  function mgTins(c, t) {   // v22.2: строка 11 — тёмная витрина: стеклянная полка, два луча, банки ZYN 3 → 9 и 6 → 11 МГ, «КРЕПОСТЬ»
    const a = T6, on = eio(at(t, a.razr - .45, a.razr + .1)); if (on <= 0) return;
    const kr = eio(at(t, a.kr - .1, a.kr + .4)), R = 92, ty = .34, h = lp(.7, 1.0, kr), cap = mixc('#FAFAF8', '#2B2F3A', kr);
    for (const x of DSP.xs) beam(c, x, 520, x, DSP.y + 20, 16, 150, '#FFE7B0', .22 * on);
    c.save(); c.globalAlpha *= on; PL(c, [1300, DSP.y + 38, 1980, DSP.y + 38, 2010, DSP.y + 16, 1330, DSP.y + 16], 'rgba(190,225,250,.25)'); SL(c, [1300, DSP.y + 38, 1980, DSP.y + 38], 'rgba(225,242,255,.8)', 3); c.restore();
    cap5(c, TEXT.strength, DSP.x, 640, at(t, a.razr - .2, a.razr + .15) * (1 - at(t, a.jout - .3, a.jout)), { s: 46, bg: '#F4F1EA', c: '#141010' });   // гаснет до того, как поднимется вода
    [[DSP.xs[0], a.dev, 3, 9], [DSP.xs[1], a.odin, 6, 11]].forEach(([x, w, v0, v1], i) => {
      const k = eo(at(t, a.razr - .3 + i * .12, a.razr + .2 + i * .12)); if (k <= 0) return;
      const hS = R * h * Math.sqrt(1 - ty * ty) + R * .06, y = DSP.y + 30 - hS - R * ty;
      c.save(); c.globalAlpha *= k; tin5(c, x, y + (1 - k) * 60, R, ty, 0, { cap, name: OBJ.zyn, nameC: kr > .5 ? '#F4F1EA' : '#1F2A44', h, shc: 'rgba(0,0,0,.45)' }); c.restore();
      const v = Math.round(lp(v0, v1, eo(at(FT, w - .1, w + .4))));   // по времени кадра — цифры не двоятся
      drum4(c, v + ' ' + TEXT.mg, x, y - R * ty - 96, at(t, a.razr, a.razr + .35), { s: 52, w: 210, bg: kr > .5 ? '#D6334D' : '#141733' });
      const ko = at(t, a.vm - .05 + i * .4, a.vm + .3 + i * .4); if (ko > 0) { c.save(); c.globalAlpha *= ko; tx(c, v0 + ' ' + TEXT.mg, x, DSP.y + 96, { f: 'M', w: 800, s: 34, c: '#AEB6CC' });
        c.beginPath(); c.moveTo(x - 56, DSP.y + 96); c.lineTo(lp(x - 56, x + 56, eo(ko)), DSP.y + 96); lnB(c, 5, '#D6334D'); c.restore() }
    });
  }
  function schoolWorld(c, t) { schoolRoom(c, t); sheet6(c, t); mgTins(c, t); walkers6(c, t) }
  function schoolShot(c, t) { const q = camObj(camAt(K6, t)); layer(c, q, 1, cc => schoolWorld(cc, t)) }
  function schoolCues(Q) {
    const a = T6; Q(a.j + .1, 'school', .35); Q(a.j + .4, 'thud', .15, -.3); Q(a.sig, 'marker', .35); Q(a.snus, 'marker', .35); Q(a.ob, 'whip', .4); Q(a.ob + .1, 'impact', .3);
    Q(a.razr - .2, 'whoosh', .3); Q(a.razr + .3, 'plop', .35, -.2); Q(a.razr + .4, 'plop', .35, .2); Q(a.kr, 'thud', .45); Q(a.dev, 'counter', .45, -.2); Q(a.odin, 'counter', .45, .2); Q(a.vm, 'marker', .3);
  }
