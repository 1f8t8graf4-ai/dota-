  // ================= v18.5: МИР D (≈64…76 с) — «никотин начали варить прямо в пробирке» → розлив → касса → корпорации =================
  // Изнутри пузыря — колба на горелке (кипит синтетический никотин), по змеевику капает в пробирку; слева лист табака перечёркнут.
  // Камера едет вправо по столу: одноразки наполняются и едут к кассе, табло — до 3 млрд $ в год, сзади вырастают три башни
  // старых табачных корпораций, монеты летят к ним. Дальше — сцена 8 (монета → Луна, город, общежитие).
  const WDc = { bg: '#24283f', wall2: '#2b3050', ink: '#1e2340', ln: '#eef2f7', glass: 'rgba(238,242,247,.12)', nic: '#f5b041', nic2: '#d98a1c', red: '#e8445a', gold: '#f2c14e', leaf: '#5b8f2a' };
  const BENCH = 980;
  let W4 = null;
  function w4Words() {
    const w = Wd; W4 = {
      chtob: w('чтобы'), obo: w('обойти'), prov: w('проверки'), nik: w('никотин', 1), nach: w('начали'), var: w('варить'), pryam: w('прямо'), prob: w('пробирке'),
      bez: w('без'), ed: w('единого'), list: w('листа'), tab: w('табака'), kogda: w('когда'), odn: w('одноразки', 2), stali: w('стали'), prin: w('приносить'),
      mlrd: w('миллиарды'), doll: w('долларов'), god: w('год', 1), rynok: w('рынок'), zashli: w('зашли'), sami: w('сами'), star: w('старые'), tabn: w('табачные'), corp: w('корпорации'),
    };
  }
  function labBgD(c, t, v) {
    const r = v || { x0: -700, x1: 700, y0: -700, y1: 700 };
    c.fillStyle = WDc.bg; c.fillRect(r.x0 - 20, r.y0 - 20, r.x1 - r.x0 + 40, r.y1 - r.y0 + 40);
    c.save(); c.globalAlpha = .5; for (let x = Math.floor(r.x0 / 240) * 240; x < r.x1 + 240; x += 240) { c.beginPath(); c.moveTo(x, Math.max(r.y0, -6000)); c.lineTo(x, Math.min(r.y1, BENCH)); lnW(c, 3, WDc.wall2) }
    for (let y = Math.floor(r.y0 / 240) * 240; y < Math.min(r.y1, BENCH); y += 240) { c.beginPath(); c.moveTo(r.x0, y); c.lineTo(r.x1, y); lnW(c, 3, WDc.wall2) } c.restore();
    if (r.y1 > BENCH - 40) { c.fillStyle = '#4a3f6b'; c.fillRect(r.x0 - 20, BENCH, r.x1 - r.x0 + 40, 90); c.fillStyle = '#1b1830'; c.fillRect(r.x0 - 20, BENCH + 90, r.x1 - r.x0 + 40, Math.max(0, r.y1 - BENCH)); c.beginPath(); c.moveTo(r.x0 - 20, BENCH); c.lineTo(r.x1 + 20, BENCH); lnW(c, 8, WDc.ln) }
  }
  function flaskD(c, t) {   // круглая колба на горелке: кипит
    const k = W4, boil = .35 + .65 * at(t, k.nach - .3, k.var + .3);
    c.beginPath(); c.moveTo(-760, BENCH); c.lineTo(-760, -1700); lnW(c, 26, "#7b8098"); c.beginPath(); c.moveTo(-760, -1150); c.lineTo(-150, -1150); lnW(c, 18, '#7b8098'); c.beginPath(); c.roundRect(-190, -1190, 80, 80, 16); fill(c, '#565d8a');
    // горелка и пламя
    c.beginPath(); c.roundRect(-200, 720, 400, 260, 30); fill(c, '#565d8a'); lnW(c, 8, WDc.ln);
    for (let i = 0; i < 5; i++) { const x = -120 + i * 60, h = 90 + 40 * Math.sin(t * 13 + i * 2) + 40 * boil; c.beginPath(); c.moveTo(x - 26, 720); c.quadraticCurveTo(x - 10, 720 - h * .6, x, 720 - h); c.quadraticCurveTo(x + 10, 720 - h * .6, x + 26, 720); c.closePath(); fill(c, i % 2 ? '#60a5fa' : '#93c5fd') }
    // колба
    c.save(); c.beginPath(); c.arc(0, 0, 600, 0, TAU); c.rect(-130, -1350, 260, 900); c.clip();
    c.fillStyle = 'rgba(238,242,247,.08)'; c.fillRect(-620, -1360, 1240, 1980);
    const sy = 110 + 12 * Math.sin(t * 5); c.beginPath(); c.moveTo(-620, sy); for (let x = -620; x <= 620; x += 30) c.lineTo(x, sy + 16 * Math.sin(x / 70 + t * 7) * boil); c.lineTo(620, 640); c.lineTo(-620, 640); c.closePath(); fill(c, WDc.nic);
    c.save(); c.clip(); c.globalAlpha = .25; dotsRect(c, -620, sy, 1240, 600, 34, 4, WDc.nic2); c.restore();
    for (let i = 0; i < 30; i++) { const ph = (t * (.5 + H1(i) * .6) * boil + H1(i * 3)) % 1, x = -440 + H1(i * 7) * 880, y = lp(560, sy + 20, ph); ring(c, x + Math.sin(t * 4 + i) * 16, y, 12 + 16 * H1(i * 5) * (1 - ph * .5), 'rgba(255,255,255,.7)', 5) }
    for (let i = 0; i < 8; i++) { const ph = (t * .35 + H1(i * 4)) % 1; circ(c, -60 + H1(i) * 120, lp(sy - 20, -1300, ph), 30 * (1 - ph), rgba('#fff7e0', .35 * (1 - ph))) }
    c.restore();
    c.beginPath(); c.arc(0, 0, 600, -Math.PI / 2 + .22, Math.PI * 1.5 - .22); c.lineTo(-130, -1350); c.moveTo(130, -1350); c.lineTo(130, -594); lnW(c, 16, WDc.ln);
    c.beginPath(); c.arc(0, 0, 600, -Math.PI / 2 + .22, Math.PI * 1.5 - .22); lnW(c, 16, WDc.ln); c.beginPath(); c.moveTo(-130, -594); c.lineTo(-130, -1350); c.moveTo(130, -594); c.lineTo(130, -1350); lnW(c, 16, WDc.ln);
    c.beginPath(); c.arc(0, 0, 520, Math.PI * 1.1, Math.PI * 1.35); lnW(c, 18, 'rgba(255,255,255,.5)');
    c.beginPath(); c.roundRect(-170, -1400, 340, 60, 16); fill(c, '#7b8098'); lnW(c, 8, WDc.ln);
  }
  const COILD = { x: 1050, y0: -1350, y1: -250 };
  function coilD(c, t) {   // трубка и змеевик к пробирке, капли
    const k = W4;
    c.beginPath(); c.moveTo(0, -1400); c.lineTo(0, -1640); c.quadraticCurveTo(0, -1720, 90, -1720); c.lineTo(COILD.x - 90, -1720); c.quadraticCurveTo(COILD.x, -1720, COILD.x, -1620); c.lineTo(COILD.x, COILD.y0); lnW(c, 34, WDc.ln);
    c.beginPath(); c.moveTo(0, -1400); c.lineTo(0, -1640); c.quadraticCurveTo(0, -1720, 90, -1720); c.lineTo(COILD.x - 90, -1720); c.quadraticCurveTo(COILD.x, -1720, COILD.x, -1620); c.lineTo(COILD.x, COILD.y0); lnW(c, 18, '#3a4066');
    c.beginPath(); c.roundRect(COILD.x - 230, COILD.y0 - 40, 460, COILD.y1 - COILD.y0 + 80, 60); fill(c, 'rgba(147,197,253,.12)'); c.beginPath(); c.roundRect(COILD.x - 230, COILD.y0 - 40, 460, COILD.y1 - COILD.y0 + 80, 60); lnW(c, 10, WDc.ln);
    c.beginPath(); for (let i = 0; i <= 140; i++) { const q = i / 140, y = lp(COILD.y0, COILD.y1, q), x = COILD.x + Math.sin(q * Math.PI * 12) * 150; if (!i) c.moveTo(x, y); else c.lineTo(x, y) } lnW(c, 22, WDc.ln);
    c.beginPath(); c.moveTo(COILD.x, COILD.y1); c.lineTo(COILD.x, COILD.y1 + 260); lnW(c, 22, WDc.ln);
    // поток по змеевику — бегущая точка
    const fl = at(t, k.nik - .5, k.var); for (let j = 0; j < 4; j++) { const q = ((t * .5 + j / 4) % 1) * fl; if (q <= 0) continue; const y = lp(COILD.y0, COILD.y1, q), x = COILD.x + Math.sin(q * Math.PI * 12) * 150; circ(c, x, y, 14, WDc.nic) }
    // пробирка в штативе
    const tx0 = COILD.x, ty0 = 120, ty1 = 860, lv = at(t, k.nik, k.prob + .6);
    c.beginPath(); c.rect(tx0 - 260, 700, 520, 40); fill(c, '#7a4e33'); lnW(c, 6, WDc.ln); c.beginPath(); c.rect(tx0 - 240, 740, 40, 240); c.rect(tx0 + 200, 740, 40, 240); fill(c, '#7a4e33');
    c.save(); c.beginPath(); c.roundRect(tx0 - 80, ty0, 160, ty1 - ty0, [10, 10, 80, 80]); c.clip(); c.fillStyle = 'rgba(238,242,247,.1)'; c.fillRect(tx0 - 80, ty0, 160, ty1 - ty0); c.fillStyle = WDc.nic; c.fillRect(tx0 - 80, ty1 - (ty1 - ty0 - 40) * lv, 160, ty1); c.restore();
    c.beginPath(); c.roundRect(tx0 - 80, ty0, 160, ty1 - ty0, [10, 10, 80, 80]); lnW(c, 12, WDc.ln);
    if (t > k.nik - .2) { const ph = (t * 2.2) % 1; circ(c, tx0, lp(COILD.y1 + 280, ty1 - (ty1 - ty0 - 40) * lv, ph * ph), 16, WDc.nic) }
    const kp = spr(at(t, k.prob - .1, k.prob + .4)); if (kp > 0) plate(c, 'ПРОБИРКА', tx0 + 330, 300, kp, { s: 60, bg: WDc.nic, c: WDc.ink });
    const kn = spr(at(t, k.var - .1, k.var + .4)); if (kn > 0) plate(c, 'СИНТЕТИЧЕСКИЙ НИКОТИН', 400, -2000, kn, { s: 72, bg: '#fff', c: WDc.ink });
  }
  function leafD(c, t) {   // лист табака — и красный круг с чертой
    const k = W4, ka = bo(at(t, k.bez - .3, k.bez + .2)); if (ka <= 0) return;
    c.save(); c.translate(-1000, -350); c.scale(ka, ka); c.rotate(-.35 + .05 * Math.sin(t * 2));
    c.beginPath(); c.moveTo(0, -560); c.bezierCurveTo(330, -420, 380, 220, 0, 520); c.bezierCurveTo(-380, 220, -330, -420, 0, -560); fill(c, WDc.leaf); lnW(c, 10, WDc.ink);
    c.beginPath(); c.moveTo(0, -520); c.lineTo(0, 600); lnW(c, 10, '#a3c76a'); for (let i = 0; i < 5; i++) { const y = -340 + i * 170; c.beginPath(); c.moveTo(0, y + 60); c.quadraticCurveTo(110, y, 210 - i * 20, y - 60); c.moveTo(0, y + 60); c.quadraticCurveTo(-110, y, -210 + i * 20, y - 60); lnW(c, 7, '#a3c76a') }
    c.restore();
    const kx = eo(at(t, k.list - .15, k.list + .25)); if (kx > 0) { c.save(); c.translate(-1000, -350); c.beginPath(); c.arc(0, 0, 640, -Math.PI / 2, -Math.PI / 2 + TAU * kx); lnW(c, 40, WDc.red); if (kx > .6) { const e = cl((kx - .6) / .4); c.beginPath(); c.moveTo(-450, -450); c.lineTo(-450 + 900 * e, -450 + 900 * e); lnW(c, 40, WDc.red) } c.restore() }
    const kt = spr(at(t, k.tab - .1, k.tab + .4)); if (kt > 0) plate(c, 'БЕЗ ТАБАКА', -1000, 450, kt, { s: 70, bg: WDc.red, c: '#fff' });
  }
  const LINE = { x0: 1900, n: 6, dx: 320, w: 170, h: 560 };
  function lineD(c, t) {   // наполнение одноразок и лента к кассе
    const k = W4; if (t < k.kogda - .6) return;
    const run = Math.max(0, t - (k.prin - .1)), shift = run < .6 ? 700 * run * run / 1.2 : 700 * .3 + (run - .6) * 700;
    c.beginPath(); c.moveTo(COILD.x + 80, 840); c.lineTo(LINE.x0 - 200, 840); c.lineTo(LINE.x0 - 200, 300); c.lineTo(LINE.x0 + LINE.dx * (LINE.n - 1) + 60, 300); lnW(c, 26, WDc.ln); c.stroke(); lnW(c, 12, WDc.nic);
    for (let i = 0; i < LINE.n; i++) { const nx = LINE.x0 + i * LINE.dx; c.beginPath(); c.moveTo(nx, 300); c.lineTo(nx, 360); lnW(c, 22, WDc.ln) }
    c.beginPath(); c.roundRect(LINE.x0 - 120, BENCH - 60, 4200, 60, 30); fill(c, '#1b1f36'); lnW(c, 6, WDc.ln);
    for (let i = 0; i < LINE.n; i++) {
      const x = LINE.x0 + i * LINE.dx + shift; if (x > REGD.x + 100) continue;
      const ii = i, tf = k.kogda - .2 + ii * .16, kf = eio(at(t, tf, tf + .4)), yb = BENCH - 60, ka = bo(at(t, k.kogda - .5 + ii * .05, k.kogda - .1 + ii * .05)); if (ka <= 0) continue;
      c.save(); c.translate(x, yb); c.scale(ka, ka);
      c.beginPath(); c.roundRect(-LINE.w / 2, -LINE.h, LINE.w, LINE.h, 40); fill(c, POD_TOP[ii % 5][1]); lnW(c, 8, WDc.ink);
      c.beginPath(); c.roundRect(-LINE.w * .32, -LINE.h - 90, LINE.w * .64, 100, [40, 40, 6, 6]); fill(c, WDc.ink);
      c.beginPath(); c.roundRect(-46, -LINE.h + 70, 92, 300, 20); fill(c, '#1b2138'); c.save(); c.beginPath(); c.roundRect(-46, -LINE.h + 70, 92, 300, 20); c.clip(); c.fillStyle = WDc.nic; c.fillRect(-46, -LINE.h + 370 - 300 * kf, 92, 300); c.restore(); c.beginPath(); c.roundRect(-46, -LINE.h + 70, 92, 300, 20); lnW(c, 6, WDc.ln);
      c.restore();
    }
  }
  const REGD = { x: 4700 };
  function towersD(c, t) {   // три башни старых табачных корпораций вырастают за кассой
    const k = W4; if (t < k.zashli - .4) return;
    [[3900, 3300], [4800, 4300], [5700, 3700]].forEach(([x, h], i) => {
      const tr = [k.star, k.tabn, k.corp][i] - .45, kr = bo(at(t, tr, tr + .6)); if (kr <= 0) return;
      const top = 700 - h * kr;
      c.save(); c.beginPath(); c.rect(x - 420, -6000, 840, 6700); c.clip();
      c.beginPath(); c.rect(x - 380, top, 760, h + 200); fill(c, '#33395c'); lnW(c, 10, WDc.ln);
      c.fillStyle = '#2a2f4d'; c.fillRect(x + 140, top, 240, h + 200);
      for (let r = 0; r < Math.floor(h / 230); r++) for (let q = 0; q < 4; q++) { const lit = H1(i * 50 + r * 4 + q) > .35 ? at(t, tr + .3 + r * .02, tr + .6 + r * .02) : 0; c.fillStyle = mixc('#1b1f36', '#ffd479', lit); c.fillRect(x - 320 + q * 170, top + 420 + r * 230, 110, 140) }
      circ(c, x, top + 210, 170, WDc.gold); ring(c, x, top + 210, 170, WDc.ink, 10);
      c.save(); c.translate(x, top + 210); c.beginPath(); c.moveTo(0, -120); c.bezierCurveTo(80, -90, 90, 50, 0, 120); c.bezierCurveTo(-90, 50, -80, -90, 0, -120); fill(c, WDc.leaf); c.beginPath(); c.moveTo(0, -110); c.lineTo(0, 120); lnW(c, 7, '#a3c76a'); c.restore();
      c.restore();
    });
    const kh = spr(at(t, k.star - .2, k.star + .3)); if (kh > 0) plate(c, 'СТАРЫЕ ТАБАЧНЫЕ КОРПОРАЦИИ', 4800, -4100, kh, { s: 110, bg: WDc.red, c: '#fff' });
    if (t > k.tabn) for (let i = 0; i < 14; i++) { const ph = ((t - k.tabn) * .9 + i / 14) % 1, tx0 = [3900, 4800, 5700][i % 3], ty = 700 - [3300, 4300, 3700][i % 3] + 210;
      const x = lp(REGD.x, tx0, ph), y = lp(300, ty, ph) - Math.sin(Math.PI * ph) * 500; circ(c, x, y, 60, WDc.gold); ring(c, x, y, 46, '#b07d12', 8) }
  }
  function registerD(c, t) {   // касса с табло: 0 → 3 000 000 000 $ в год
    const k = W4, ka = bo(at(t, k.prin - .4, k.prin + .1)); if (ka <= 0) return;
    c.save(); c.translate(REGD.x, BENCH); c.scale(ka, ka);
    c.beginPath(); c.roundRect(-560 + 30, -620 + 40, 1120, 620, 50); fill(c, 'rgba(8,10,24,.35)');
    c.beginPath(); c.roundRect(-560, -620, 1120, 620, 50); fill(c, '#5b4b9a'); lnW(c, 12, WDc.ln);
    for (let r = 0; r < 3; r++) for (let q = 0; q < 5; q++) { c.beginPath(); c.roundRect(-430 + q * 130, -520 + r * 120, 100, 80, 14); fill(c, '#e9e3ff'); lnW(c, 6, WDc.ink) }
    const kd = bo(at(t, k.doll - .1, k.doll + .4)); c.beginPath(); c.rect(-520, -60 + 140 * kd, 1040, 120); fill(c, '#463a7a'); lnW(c, 10, WDc.ln);
    for (let i = 0; i < 9; i++) circ(c, -380 + i * 95, -60 + 140 * kd + 20, 34 * kd, WDc.gold);
    c.beginPath(); c.moveTo(-60, -620); c.lineTo(-60, -880); c.moveTo(60, -620); c.lineTo(60, -880); lnW(c, 24, '#3b3166');
    c.beginPath(); c.roundRect(-760, -1320, 1520, 460, 40); fill(c, '#0b1020'); lnW(c, 12, WDc.ln);
    const v = Math.round(3e9 * eo(at(t, k.mlrd - .2, k.god - .05)) / 1e6) * 1e6, s = '$' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    num(c, s, 0, -1130, { f: 'J', w: 700, s: 150, c: '#7ee787' });
    A(c, at(t, k.god - .2, k.god + .2), () => tx(c, 'В ГОД', 0, -960, { f: 'U', w: 800, s: 70, c: '#7ee787' }));
    c.restore();
  }
  function drawD(c, t, v) {
    if (!W4) w4Words();
    labBgD(c, t, v);
    if (!v || v.x1 > 3000) towersD(c, t);
    flaskD(c, t); coilD(c, t); leafD(c, t);
    if (!v || v.x1 > LINE.x0 - 600) { lineD(c, t); registerD(c, t) }
  }
  function shotD(c, t) {
    const cm = camIn('D', camW(t)), cm2 = camIn('D', camW(t + 1 / 30)), v = viewRect(cm);
    c.fillStyle = WDc.bg; c.fillRect(0, 0, WW, HH);
    layer(c, cm, 1, c => drawD(c, t, v));
    speedLoc(c, cm, cm2, t);
  }
