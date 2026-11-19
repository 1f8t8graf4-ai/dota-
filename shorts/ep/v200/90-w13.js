  // ================= мир 13–14 (фразы 13–14): графит 2014-го. Белые фигурки 1954-го пятятся от дыма; огонь на кончике сжимается в пластинку нагревателя (#114);
  // разрез тонкими линиями поверх держателя (#067); волны тепла вместо дыма. Стик выезжает, отъезд: пачка HeatSticks → витрина с тремя пачками (#151), имена загораются.
  // Концовки: фильм — витрина становится фото карточки 1924, нить к закрытой «2014»; шортс — вопрос, «Часть 4 →», камера ныряет в рамку с кадром 0 (петля).
  let T13 = null, K13 = null, KEND = null, N14 = null, TSM = 0;
  const CIG = { x0: 230, x1: 820, y: 900, r: 26 }, HOLD = { x0: 640, x1: 1180, y: 900 }, SHOW = { x0: 90, x1: 990, y0: 600, y1: 1250, shelf: 1190 }, PRINT = { x: 540, y: 300, w: 108, h: 192 };
  function w13Init() {
    const s = 's13', w = q => Ws(s, q), s4 = 's14';
    T13 = { a: SA(s), kogda: w('когда'), isp: w('испугались'), dyma: w('дыма'), tret: w('третья'), zh: w('жизнь'), bez: w('без'), ogn: w('огня'), tab: w('табак'), sig: w('сигарете'), gre: w('греет'), nagr: w('нагреватель'),
      a14: SA(s4), stiki: Ws(s4, 'стики'), naz: Ws(s4, 'назывались'), marl: Ws(s4, 'мальборо'), q: SA('q'), qEnd: SB('q'), vEnd: TLX.vEnd, endT: TLX.endT };
    const a = T13; TSM = (SA('s12') !== null ? T12.end : T9.end);   // дым закрывает кадр — стык миров
    K13 = [KY(TSM, 560, 930, .74), KY(a.isp, 520, 960, .9), KY(a.tret, 640, 930, 1.3), KY(a.bez + .25, 700, 920, 1.6), KY(a.tab + .35, 760, 900, 1.25), KY(a.nagr + .3, 780, 880, 1.35),
      KY(a.stiki + .2, 560, 920, 1.05), KY(a.naz + .1, 540, 900, .86), KY(a.marl + .1, 540, 905, .84)];
    if (MODE === 's') K13.push(KY(a.qEnd, 540, 760, .9), KY(a.endT, PRINT.x, PRINT.y, WW / PRINT.w));
    else { K13.push(KY(a.vEnd, 540, 900, .82)); const m = 230 / (1920 / .82); N14 = { x: 540, y: photo3(C1924)[1] - (900 - 960) * m, m };
      KEND = [KY(a.vEnd + 1.25, 540, 640, 1.12), KY(a.endT, 535, 630, 1.08)]; linkK(K13, KEND, N14, false) }   // v20.2: в кадре все пять карточек и нить к закрытой «2014»
  }
  function graphite(c, t) {
    c.fillStyle = '#2B2E36'; c.fillRect(-6000, -6000, 12000, 12000); poly(c, [-6000, 2600, 6000, -3400, 6000, -2600, -6000, 3400]); fill(c, '#343844');
    c.strokeStyle = 'rgba(180,200,230,.07)'; c.lineWidth = 2; c.beginPath(); for (let x = -1200; x < 2400; x += 90) { c.moveTo(x, -900); c.lineTo(x, 2900) } for (let y = -900; y < 2900; y += 90) { c.moveTo(-1200, y); c.lineTo(2400, y) } c.stroke();
    c.fillStyle = '#23262D'; c.fillRect(-6000, 1460, 12000, 3000);
  }
  function figs13(c, t) {   // белые фигурки из 1954-го пятятся от дыма
    const a = T13, b = eio(at(t, a.isp - .2, a.isp + .75)); if (b >= 1) return; for (let i = 0; i < 5; i++) { const m = i % 2 === 0, x = 60 + i * 90 - b * (900 + i * 70), bob = b > 0 ? Math.abs(Math.sin(t * 11 + i)) * 10 : 0; fig(c, x, 1460 - bob, 1.5, { m, hat: m && i === 2, dir: b > .1 ? -1 : 1, col: '#F4F1EA', hc: C3.rose2 }) }   // v20.2: убегают из кадра целиком
  }
  // v20.2: сигарета 2014-го — бумага, пробковый фильтр, огонёк с пеплом (без язычка свечи); на «табак» она становится стиком, держатель — чертёж тонкими линиями,
  // пластина нагревателя раскаляется оранжевым, тепло — мягкими прозрачными струями; на «стики» стик уходит в пачку HeatSticks на витрине
  function stick13(c, t) {
    const a = T13, kf = eio(at(t, a.tret - .2, a.tret + .5)), kh = eio(at(t, a.tab - .35, a.tab + .3)), kn = eio(at(t, a.gre - .2, a.nagr + .2)), out = eio(at(t, a.stiki - .2, a.stiki + .6)), { y, r } = CIG;
    const L0 = lp(CIG.x1 - CIG.x0, 360, kh), X0 = CIG.x0 + lp(0, 300, kh);
    const gx = 830, gy = SHOW.shelf - 236, sc = lp(1, .34, out), px = lp(X0 + L0 / 2, gx, out), py = lp(y, gy - 40 + 120 * eio(at(t, a.stiki + .35, a.naz)), out);   // в пачку: уменьшается, летит к её верху и опускается внутрь
    if (out < 1 || t < a.naz + .1) {
      c.save(); if (out > .6) { c.beginPath(); c.rect(-4000, -4000, 8000, gy + 4000); c.clip() }   // внутри пачки стик не виден
      c.translate(px, py); c.scale(sc, sc); const x0 = -L0 / 2, x1 = L0 / 2;
      if (out < .05) rasterPoly(c, [x0, r, x1, r, x1 + 90, r + 70, x0 + 90, r + 70], 'rgba(0,0,0,.3)', 9, 2.3);
      cig3(c, x0, 0, x1, 0, r, { tip: C3.cork, tl: .3, em: kf < 1 ? 1 - kf : undefined, ek: 1 - kf });
      if (kh > 0) { c.fillStyle = rgba('#8A5A2E', kh); c.fillRect(x1 - L0 * .36, -r, L0 * .36 - 4, r * 2); c.fillStyle = rgba('#6A4222', kh); for (let k = 0; k < 6; k++) c.fillRect(x1 - L0 * .36 + 6 + k * L0 * .055, -r + 4, 3, r * 2 - 8) }   // табак стика
      c.restore();
    }
    const ex = CIG.x1; if (kf < 1) smokeLine(c, [ex + 6, y - 20, ex + 22 + Math.sin(t * 2) * 18, y - 140, ex + 4, y - 270, ex + 30, y - 400], 7, '#C9C6D2', .75 * (1 - kf));
    if (kh > 0 && out < 1) {   // держатель — чертёж: контур тонкими линиями, прозрачный корпус, размерные линии; внутри пластина
      const hx = lp(1500, CIG.x0 + 300 + 360 * .62, kh) + out * 900, hw = 560, hy = y; c.save();
      rr(c, hx - 40, hy - 72, hw, 144, 64); c.fillStyle = 'rgba(190,225,250,.13)'; c.fill(); rr(c, hx - 40, hy - 72, hw, 144, 64); lnB(c, 3, 'rgba(220,240,255,.9)');
      rr(c, hx - 26, hy - 58, hw - 28, 116, 52); lnB(c, 1.6, 'rgba(220,240,255,.45)');
      c.setLineDash([12, 9]); c.beginPath(); c.moveTo(hx - 70, hy); c.lineTo(hx + hw + 30, hy); lnB(c, 1.4, 'rgba(124,196,224,.7)'); c.setLineDash([]);   // ось
      const dy = hy + 112; c.beginPath(); c.moveTo(hx - 40, dy); c.lineTo(hx + hw - 40, dy); c.moveTo(hx - 40, dy - 12); c.lineTo(hx - 40, dy + 12); c.moveTo(hx + hw - 40, dy - 12); c.lineTo(hx + hw - 40, dy + 12); lnB(c, 2, 'rgba(124,196,224,.8)');   // размер
      const bx = hx + 58, bh = r * 1.7, ko = 1 - out;   // пластина — внутри держателя и уезжает с ним
      if (kh > .5) { const g = c.createLinearGradient(bx, hy - bh, bx, hy + bh); g.addColorStop(0, mixc('#8E929E', '#FF8A2A', kn)); g.addColorStop(.5, mixc('#B9BCC6', '#FFE08A', kn)); g.addColorStop(1, mixc('#8E929E', '#FF8A2A', kn));
        rr(c, bx - 7, hy - bh, 14, bh * 2, 4); c.fillStyle = g; c.fill(); if (kn > 0) glow(c, bx, hy, 90, '#FF9A3A', .45 * kn * ko) }   // пластина: серая → раскалённая
      if (kn > 0) for (let i = 0; i < 4; i++) { const u = (t * .7 + i * .25) % 1, wx = bx - 90 + i * 60; smokeLine(c, [wx, hy - 80 - u * 40, wx + 14, hy - 170 - u * 60, wx - 8, hy - 260 - u * 80, wx + 10, hy - 350 - u * 90], 9, '#FFB36A', .4 * kn * ko * Math.sin(Math.PI * u)) }   // тепло — мягкие прозрачные струи
      c.restore();
    }
    const kb = at(t, a.bez - .05, a.bez + .3) * (1 - at(t, a.stiki - .3, a.stiki)); if (kb > 0) tx(c, 'БЕЗ ОГНЯ', 700, 560, { f: 'M', w: 800, s: 92 * bo(kb), c: '#F4F1EA', a: Math.min(1, kb * 2) });
  }
  function heatPack(c, x, y, s, gl) { c.save(); c.translate(x, y); c.scale(s, s); mPack(c, -75, -230, 150, 230, 28, { sub: 'HeatSticks', glow: gl, shc: 'rgba(0,0,0,.3)' }); c.restore() }
  function showcase(c, t) {
    const a = T13, k = eio(at(t, a.stiki - .1, a.naz + .2)); if (k <= 0) return; const { x0, x1, y0, y1, shelf } = SHOW;
    c.save(); c.globalAlpha *= 1; rr(c, x0 - 20, y0 - 20, x1 - x0 + 40, y1 - y0 + 40, 14); fill(c, '#1B1D23'); rr(c, x0, y0, x1 - x0, y1 - y0, 8); fill(c, '#3A3E4A');
    c.fillStyle = '#4A4F5C'; c.fillRect(x0, shelf, x1 - x0, 24); c.restore();
    const gl = i => eo(at(t, a.marl - .05 + i * .22, a.marl + .2 + i * .22));
    softPack(c, 160, shelf - 300, 200, 300, 30, { glow: gl(0), shc: 'rgba(0,0,0,.3)' });
    mPack(c, 445, shelf - 282, 190, 282, 34, { glow: gl(1), shc: 'rgba(0,0,0,.3)' });
    heatPack(c, 830, shelf, 1, gl(2));
    c.save(); rr(c, x0, y0, x1 - x0, y1 - y0, 8); c.clip();   // стекло: блики и отражение четырёх шляп с забора
    poly(c, [x0 + 80, y1, x0 + 200, y1, x0 + 520, y0, x0 + 400, y0]); fill(c, 'rgba(255,255,255,.07)'); poly(c, [x0 + 600, y1, x0 + 640, y1, x0 + 960, y0, x0 + 920, y0]); fill(c, 'rgba(255,255,255,.06)');
    c.globalAlpha *= .16; for (let i = 0; i < 4; i++) cHat(c, x0 + 170 + i * 190, y0 + 110, 1.6, '#F4F1EA'); c.restore();
    rr(c, x0, y0, x1 - x0, y1 - y0, 8); lnB(c, 4, 'rgba(255,255,255,.35)');
  }
  function print0(c, t) {   // рамка на стене: внутри — кадр 0 (щит у трассы); в шортсе камера ныряет в неё — петля
    if (MODE !== 's') return; const { x, y, w, h } = PRINT; rr(c, x - w / 2 - 12, y - h / 2 - 12, w + 24, h + 24, 4); fill(c, '#C9A24A');
    c.save(); c.beginPath(); c.rect(x - w / 2, y - h / 2, w, h); c.clip(); c.translate(x - w / 2, y - h / 2); c.scale(w / WW, h / HH); w1Shot(c, 0); c.restore();
  }
  function w13World(c, t) {
    const a = T13; graphite(c, t); print0(c, t); figs13(c, t); showcase(c, t); stick13(c, t);
    if (MODE === 's') { const kq = at(t, a.q - .1, a.q + .3), kx = 1 - eio(at(t, a.qEnd + .15, a.qEnd + .45)); if (kq > 0 && kx > 0) { plate(c, 'Без огня — без вреда?', 540, 528, bo(kq) * kx, { s: 54, bg: '#F4F1EA', c: '#141010', ls: 0, w: 800 }) }   // v20.2: до нырка в рамку плашки сжимаются
      const kp = at(t, a.qEnd - .2, a.qEnd + .2); if (kp > 0) tx(c, 'Часть 4 →', 540, 1330, { f: 'M', w: 800, s: 70 * bo(kp), c: '#F4F1EA', a: Math.min(1, kp * 2) }) }
  }
  function w13Shot(c, t) {
    if (MODE === 'y' && t >= T13.vEnd) { const q = camObj(camAt(KEND, t)); layer(c, q, 1, cc => { board12(cc, t, ci => inNest(ci, N14, cn => w13World(cn, t)));
      const kt = eo(at(t, T13.vEnd + 1.3, T13.vEnd + 2.3)); thread3(cc, C1924, CARDS3[2], kt) }); return }
    const q = camObj(camAt(K13, t)); layer(c, q, 1, cc => w13World(cc, t));
  }
