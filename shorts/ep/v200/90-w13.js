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
      KEND = [KY(a.vEnd + 1.2, 470, 800, 1.55), KY(a.endT, 420, 790, 1.42)]; linkK(K13, KEND, N14, false) }
  }
  function graphite(c, t) {
    c.fillStyle = '#2B2E36'; c.fillRect(-6000, -6000, 12000, 12000); poly(c, [-6000, 2600, 6000, -3400, 6000, -2600, -6000, 3400]); fill(c, '#343844');
    c.strokeStyle = 'rgba(180,200,230,.07)'; c.lineWidth = 2; c.beginPath(); for (let x = -1200; x < 2400; x += 90) { c.moveTo(x, -900); c.lineTo(x, 2900) } for (let y = -900; y < 2900; y += 90) { c.moveTo(-1200, y); c.lineTo(2400, y) } c.stroke();
    c.fillStyle = '#23262D'; c.fillRect(-6000, 1460, 12000, 3000);
  }
  function figs13(c, t) {   // белые фигурки из 1954-го пятятся от дыма
    const a = T13, b = eio(at(t, a.isp - .2, a.isp + .7)); for (let i = 0; i < 5; i++) { const m = i % 2 === 0, x = 60 + i * 90 - b * (260 + i * 40); fig(c, x, 1460, 1.5, { m, hat: m && i === 2, dir: b > .1 ? -1 : 1, col: '#F4F1EA', hc: C3.rose2 }) }
  }
  function flame(c, x, y, s, t) { const f = 1 + Math.sin(t * 17) * .06; c.save(); c.translate(x, y); c.scale(s, s * f);
    c.beginPath(); c.moveTo(0, -70); c.bezierCurveTo(30, -30, 34, 0, 0, 22); c.bezierCurveTo(-34, 0, -30, -30, 0, -70); fill(c, '#FF8A2A'); c.beginPath(); c.moveTo(0, -34); c.bezierCurveTo(16, -14, 16, 2, 0, 14); c.bezierCurveTo(-16, 2, -16, -14, 0, -34); fill(c, '#FFD45A'); c.restore() }
  function stick13(c, t) {
    const a = T13, kf = eio(at(t, a.tret - .2, a.tret + .5)), kh = eio(at(t, a.tab - .35, a.tab + .3)), kn = eio(at(t, a.gre - .2, a.nagr + .2)), out = eio(at(t, a.stiki - .2, a.stiki + .55)), { y, r } = CIG;
    const L = lp(CIG.x1 - CIG.x0, 340, kh), x0 = CIG.x0 + lp(0, 300, kh) - out * 520, x1 = x0 + L;
    if (out < 1 || t < a.naz) {
      rasterPoly(c, [x0, y + r, x1, y + r, x1 + 90, y + r + 70, x0 + 90, y + r + 70], 'rgba(0,0,0,.3)', 9, 2.3);
      rr(c, x0, y - r, L, r * 2, r * .4); fill(c, C3.white); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(x0, y + r * .35, L, r * .65);
      c.fillStyle = lp(0, 1, kh) > .5 ? C3.cork : C3.white; c.fillRect(x0, y - r, L * .3, r * 2); c.fillStyle = '#8A5A2E'; c.fillRect(x1 - L * .38, y - r, L * .38 - 6, r * 2 * kh);
      if (kf < 1) { const ex = x1; c.fillStyle = mixc('#3a2a26', C3.ember, 1 - kf); c.fillRect(ex - 18, y - r, 18, r * 2); flame(c, ex + 30, y - 8, 1 - kf, t);
        smokeLine(c, [ex + 20, y - 60, ex + 40 + Math.sin(t * 2) * 20, y - 160, ex + 10, y - 280, ex + 40, y - 400], 7, '#C9C6D2', .7 * (1 - kf)) }
      const sq = lp(26, 14, kf); if (kf > .2) { c.fillStyle = mixc('#9A9AA6', '#FF8A2A', kn); c.fillRect(x1 - L * .22 - sq / 2, y - sq * 1.6, sq, sq * 3.2) }   // пластинка нагревателя
    }
    if (kh > 0 && out < 1) {   // белый держатель надвигается на табак; поверх — разрез тонкими линиями
      const hx = lp(1500, HOLD.x0 + 140, kh) + out * 700, hw = 540; c.save(); rr(c, hx - 40, y - 70, hw, 140, 60); c.fillStyle = '#F2F2F4'; c.fill(); c.clip(); c.fillStyle = '#D9DAE0'; c.fillRect(hx - 40, y + 20, hw, 60); c.restore();
      rr(c, hx - 40, y - 70, hw, 140, 60); lnB(c, 3, 'rgba(255,255,255,.8)');
      const kc = at(t, a.tab - .1, a.tab + .5); if (kc > 0) { c.save(); c.globalAlpha *= Math.min(1, kc * 2); c.setLineDash([10, 8]); rr(c, x1 - L * .4, y - r, L * .4, r * 2, 6); lnB(c, 3, '#7CC4E0'); c.setLineDash([]);
        c.beginPath(); c.moveTo(x1 - L * .3, y); c.lineTo(hx + 300, y); lnB(c, 2, '#7CC4E0'); c.restore() }
      if (kn > 0) for (let i = 0; i < 4; i++) { const u = ((t * .9 + i * .25) % 1), wx = hx + 80 + i * 90; c.beginPath(); for (let k = 0; k <= 12; k++) { const yy = y - 90 - k * 22 - u * 60; c.lineTo(wx + Math.sin(k * .9 + t * 6 + i) * 12, yy) } lnB(c, 4, rgba('#FFB36A', .65 * kn * (1 - u))) }
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
    if (MODE === 's') { const kq = at(t, a.q - .1, a.q + .3); if (kq > 0) { plate(c, 'Без огня — без вреда?', 540, 528, bo(kq), { s: 54, bg: '#F4F1EA', c: '#141010', ls: 0, w: 800 }) }
      const kp = at(t, a.qEnd - .2, a.qEnd + .2); if (kp > 0) tx(c, 'Часть 4 →', 540, 1400, { f: 'M', w: 800, s: 70 * bo(kp), c: '#F4F1EA', a: Math.min(1, kp * 2) }) }
  }
  function w13Shot(c, t) {
    if (MODE === 'y' && t >= T13.vEnd) { const q = camObj(camAt(KEND, t)); layer(c, q, 1, cc => { board12(cc, t, ci => inNest(ci, N14, cn => w13World(cn, t)));
      const kt = eo(at(t, T13.vEnd + 1.3, T13.vEnd + 2.3)); thread3(cc, C1924, CARDS3[2], kt) }); return }
    const q = camObj(camAt(K13, t)); layer(c, q, 1, cc => w13World(cc, t));
  }
