  // ================= СЦЕНА 5: капля → бак с двухслойной волной → пакеты и анализатор WS-23 → медальон «мята → лёд» =================
  function labBg(c, t, py = 0) {   // кафельная лаборатория: плитка, полки с реактивами в расфокусе, лампы сверху
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#0c1830', '#12203d', '#0a1426']);
    c.save(); c.translate(0, (py * .35) % 90); c.strokeStyle = 'rgba(56,189,248,.10)'; c.lineWidth = 3;
    for (let y = -180; y < HH + 180; y += 90) { c.beginPath(); c.moveTo(0, y); c.lineTo(WW, y); c.stroke() }
    for (let x = 0; x < WW; x += 90) { c.beginPath(); c.moveTo(x, -180); c.lineTo(x, HH + 180); c.stroke() } c.restore();
    const sh = blurLayer('labshelf', 300, 1300, 7, g => {
      for (let r = 0; r < 5; r++) { g.fillStyle = '#334155'; g.fillRect(0, 230 + r * 250, 300, 12);
        for (let i = 0; i < 6; i++) { const col = ['#38bdf8', '#f59e0b', '#a78bfa', '#34d399', '#f472b6'][(i + r) % 5], h = 70 + H1(i + r * 9) * 80; g.fillStyle = col; g.globalAlpha = .55; g.fillRect(12 + i * 46, 230 + r * 250 - h, 32, h); g.globalAlpha = .9; g.fillStyle = '#e2e8f0'; g.fillRect(16 + i * 46, 230 + r * 250 - h - 14, 24, 14); g.globalAlpha = 1 } }
    });
    c.save(); c.globalAlpha = .5; c.drawImage(sh, -60, 120 + (py * .5) % 250 - 250); c.drawImage(sh, -60, 120 + (py * .5) % 250 + 1050); c.drawImage(sh, WW - 240, 80 + (py * .5) % 250 - 250); c.drawImage(sh, WW - 240, 80 + (py * .5) % 250 + 1050); c.restore();
    [300, 780].forEach(x => { rr(c, x - 90, -10, 180, 34, 10); fill(c, '#e2e8f0'); beam(c, x, 24, x, 1500, 80, 260, '#e0f2fe', .10) });
    vignette(c, .5);
  }
  const TK = { x: 540, y: 860, w: 420, h: 680 };
  function tank(c, t, o = {}) {   // бак одноразки в разрезе: сверху манго, снизу лёд, волны в противофазе
    const { x, y, w, h } = TK, k = o.k ?? 1, L = x - w / 2, T = y - h / 2;
    c.save(); if (o.a !== undefined) c.globalAlpha *= o.a;
    rr(c, L, T, w, h, 60); fill(c, 'rgba(186,230,253,.08)');
    if (k > 0) {
      c.save(); rr(c, L + 10, T + 10, w - 20, h - 20, 52); c.clip();
      const lv = T + h * lp(.95, .22, k), mid = T + h * .56, wv = (ph, amp) => x0 => Math.sin(x0 * .018 + t * 3.2 + ph) * amp;
      const top = wv(0, 16 * k), md = wv(Math.PI, 14 * k);
      c.beginPath(); c.moveTo(L, HH); for (let xx = L; xx <= L + w; xx += 10) c.lineTo(xx, Math.max(lv, mid) + md(xx) * (lv < mid ? 1 : 0)); c.lineTo(L + w, HH); c.closePath();
      const gb = c.createLinearGradient(0, mid, 0, T + h); gb.addColorStop(0, '#22d3ee'); gb.addColorStop(1, '#0891b2'); c.fillStyle = gb; c.fill();
      if (lv < mid) { c.beginPath(); for (let xx = L; xx <= L + w; xx += 10) c.lineTo(xx, lv + top(xx)); for (let xx = L + w; xx >= L; xx -= 10) c.lineTo(xx, mid + md(xx)); c.closePath(); const go = c.createLinearGradient(0, lv, 0, mid); go.addColorStop(0, '#fbbf24'); go.addColorStop(1, '#f59e0b'); c.fillStyle = go; c.fill() }
      for (let i = 0; i < 5; i++) { const ix = L + 70 + i * 66, iy = Math.max(T + h * .75 + Math.sin(t * 2 + i) * 14 + (i % 2) * 40, Math.max(lv, mid) + 34 + i % 2 * 20); if (iy > T + h - 40) continue; c.save(); c.translate(ix, iy); c.rotate(.3 + i); rr(c, -22, -22, 44, 44, 8); fill(c, 'rgba(240,249,255,.75)'); rr(c, -22, -22, 44, 44, 8); stroke(c, '#fff', 2); c.restore() }
      for (let i = 0; i < 10; i++) { const by = T + h - ((t * 120 + i * 70) % (h * .5)); if (by > lv + 12) circ(c, L + 40 + H1(i) * (w - 80), by, 5 + H1(i * 3) * 5, 'rgba(255,255,255,.45)') }
      c.restore();
    }
    rr(c, L, T, w, h, 60); stroke(c, 'rgba(224,242,254,.85)', 8); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(L + 30, T + 60, 18, h - 120);
    rr(c, x - 60, T - 70, 120, 74, 14); fill(c, '#111827');
    c.restore();
  }
  function mintLeaf(c, x, y, s, r) { c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(50, -46, 110, 0); c.quadraticCurveTo(50, 46, 0, 0); fill(c, '#10b981'); c.strokeStyle = '#d1fae5'; c.lineWidth = 3; c.beginPath(); c.moveTo(4, 0); c.lineTo(104, 0); c.stroke(); for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(i * 22, 0); c.lineTo(i * 22 + 14, -16); c.moveTo(i * 22, 0); c.lineTo(i * 22 + 14, 16); c.stroke() } c.restore() }
  const BAGS = [['МАНГО', '#f59e0b'], ['АРБУЗ', '#f43f5e'], ['ХЛАДАГЕНТ WS-23', '#22d3ee'], ['КОЛА', '#7c2d12'], ['СОЛЬ 50 МГ', '#e2e8f0']];
  function ivBag(c, x, y, lab, col, sw, glowA) {   // медицинский пакет 155×230 на крючке
    c.save(); c.translate(x, y); c.rotate(sw);
    c.strokeStyle = '#94a3b8'; c.lineWidth = 5; c.beginPath(); c.arc(0, -16, 14, Math.PI, 0); c.lineTo(14, 0); c.stroke();
    if (glowA > 0) glow(c, 0, 120, 200, '#22d3ee', .5 * glowA);
    rr(c, -77, 0, 155, 230, 26); fill(c, 'rgba(241,245,249,.30)'); c.save(); rr(c, -77, 0, 155, 230, 26); c.clip(); c.rotate(-sw * 1.6);
    const tt = (window.__T || 0); c.beginPath(); c.moveTo(-120, 300); for (let xx = -120; xx <= 120; xx += 10) c.lineTo(xx, 80 + Math.sin(xx * .05 + tt * 4 + x * .01) * 7 + xx * sw * .4); c.lineTo(120, 300); c.closePath(); fill(c, rgba(col, .78));
    for (let j = 0; j < 4; j++) { const ph = (tt * .6 + H1(j + x) ) % 1; circ(c, -50 + j * 32, 220 - ph * 130, 5 + j % 2 * 3, 'rgba(255,255,255,.5)') } c.restore();
    rr(c, -77, 0, 155, 230, 26); stroke(c, 'rgba(241,245,249,.8)', 4);
    rr(c, -16, 228, 32, 30, 6); fill(c, '#cbd5e1');
    rr(c, -66, 22, 132, 40, 8); fill(c, '#fff'); tx(c, lab, 0, 43, { f: 'O', w: 700, s: 20, c: '#0f172a', mw: 122 });
    c.restore();
  }
  const MOLA = [[0, 0], [-70, -40], [-70, 40], [70, -40], [140, 0], [70, 40], [-140, -80], [-140, 80], [140, -80], [210, 40], [0, -90]];
  const MOLB = [[0, 1], [0, 2], [0, 3], [3, 4], [3, 5], [1, 6], [2, 7], [4, 8], [4, 9], [0, 10]];
  function molecule(c, t, x, y, s, k, conv = 0) {   // WS-23: шарики-атомы и связи (сборка k, сжатие в медальон conv)
    c.save(); c.translate(x, y); c.scale(s, s);
    const P = MOLA.map(([px, py], i) => [lp(px, Math.cos(i / MOLA.length * TAU) * 150, conv), lp(py, Math.sin(i / MOLA.length * TAU) * 150, conv)]);
    c.strokeStyle = '#e0f2fe'; c.lineWidth = 8 * (1 - conv); MOLB.forEach(([a, b], i) => { const kk = at(k, .3 + i * .05, .5 + i * .05); if (kk <= 0) return; c.beginPath(); c.moveTo(P[a][0], P[a][1]); c.lineTo(lp(P[a][0], P[b][0], kk), lp(P[a][1], P[b][1], kk)); if (conv < .95) c.stroke() });
    P.forEach(([px, py], i) => { let kk = spr(at(k, i * .045, i * .045 + .35)); if (kk <= 0) return; kk *= 1 - conv * .85; circ(c, px, py, (i === 3 ? 30 : i === 10 ? 24 : 22) * kk, i === 3 ? '#38bdf8' : i === 10 ? '#f43f5e' : '#f8fafc'); circ(c, px - 6, py - 6, 6 * kk, 'rgba(255,255,255,.8)') });
    c.restore();
  }
  function analyzer(c, t, x, y, inner) {   // прибор 680×420, экран внутри
    c.save(); c.translate(x, y);
    rr(c, -340, -210, 680, 420, 30); fill(c, '#cbd5e1'); rr(c, -340, -210, 680, 60, 30); fill(c, '#e2e8f0');
    rr(c, -300, -150, 600, 300, 18); fill(c, '#062a33');
    c.save(); rr(c, -300, -150, 600, 300, 18); c.clip(); c.strokeStyle = 'rgba(45,212,191,.15)'; c.lineWidth = 2; for (let i = -300; i < 300; i += 30) { c.beginPath(); c.moveTo(i, -150); c.lineTo(i, 150); c.stroke() } for (let i = -150; i < 150; i += 30) { c.beginPath(); c.moveTo(-300, i); c.lineTo(300, i); c.stroke() } if (inner) inner(); c.restore();
    [-250, -200, 200, 250].forEach((bx, i) => circ(c, bx, 180, 12, i < 2 ? '#22c55e' : '#f59e0b'));
    tx(c, 'АНАЛИЗАТОР', 0, -182, { f: 'O', w: 700, s: 24, c: '#334155', ls: 4 });
    c.restore();
  }
  function medallion(c, t, x, y, R, kf) {   // круг: зелёная «природная мята» → честный поворот на 180° → синий «синтетический лёд»
    if (R <= 0) return; c.save(); c.translate(x, y); c.rotate(Math.PI * eio(kf));
    const m = ss(.3, .7, kf), col = mixc('#10b981', '#0284c7', m); circ(c, 0, 0, R, col); ring(c, 0, 0, R - 14, 'rgba(255,255,255,.55)', 6);
    c.lineCap = 'round';
    if (m < 1) { c.save(); c.rotate(-.75); const L = R * .78 * (1 - m * .35), Wd2 = R * .42 * (1 - m); c.beginPath(); c.moveTo(0, L); c.bezierCurveTo(Wd2 * 1.3, L * .4, Wd2 * 1.1, -L * .7, 0, -L); c.bezierCurveTo(-Wd2 * 1.1, -L * .7, -Wd2 * 1.3, L * .4, 0, L); fill(c, '#f0fdf4');
      c.strokeStyle = mixc('#10b981', '#f0f9ff', m); c.lineWidth = 9 + 5 * m; c.beginPath(); c.moveTo(0, L * .95); c.lineTo(0, -L * .8); c.stroke(); c.restore() }
    if (m > 0) { c.strokeStyle = '#f0f9ff'; c.lineWidth = 14;   // лучи снежинки вырастают из жилок
      for (let i = 0; i < 6; i++) { c.save(); c.rotate(i * TAU / 6); const L = R * .78 * m; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -L); c.moveTo(0, -L * .58); c.lineTo(-R * .16 * m, -L * .77); c.moveTo(0, -L * .58); c.lineTo(R * .16 * m, -L * .77); c.stroke(); c.restore() } circ(c, 0, 0, 22 * m, '#f0f9ff') }
    c.restore();
  }
  function meter(c, x, y, lab, val, col, k, arrow) {
    rr(c, x - 380, y - 32, 760, 64, 16); fill(c, 'rgba(15,23,42,.85)');
    const v = lp(1 - val, val, k); rr(c, x - 370, y - 22, 740 * v + 1, 44, 12); fill(c, col);
    tx(c, lab + ': ' + Math.round(100 * v) + '% ' + arrow, x, y + 2, { f: 'M', w: 800, s: 30, c: '#fff' });
  }
  function flipLabel(c, s0, s1, x, y, k, o0, o1, ka) {   // подпись переворачивается по горизонтальной оси (без растворения)
    if (ka <= 0) return; const a = Math.cos(Math.PI * k), sy = Math.abs(a) * ka;
    c.save(); c.translate(x, y); c.scale(ka, Math.max(.001, sy)); tx(c, a >= 0 ? s0 : s1, 0, 0, a >= 0 ? o0 : o1); c.restore();
  }
  const LABY = 1920;   // лаборатория — этажом ниже стола
  function shot5(c, t) {
    const hit = K.s5 + .55;
    const u = at(t, K.s5 - .15, hit), yd = lp(432, LABY + 1150, Math.pow(u, 1.7)), camD = 1920 * ss(560, 2560, yd);   // камера летит за каплей вниз
    const pan = eio(at(t, K.liq - .1, K.liq + 1.0)) * 1400;   // потом поднимается от бака к пакетам
    const kz = eio(at(t, K.fool - .3, K.fool + .5));           // наезд в экран анализатора
    window.__T = t;
    if (camD < 1920) { c.save(); c.translate(0, -camD); deskShot(c, t); c.restore() }
    c.save(); c.translate(0, LABY - camD); c.beginPath(); c.rect(-200, -40, WW + 400, 4400); c.clip(); labBg(c, t, pan);
    if (camD < 1920) { vgrad(c, -200, -40, WW + 400, 80, ['#1e293b', '#334155', '#0f172a']); [300, 780].forEach(lx => { rr(c, lx - 90, 40, 180, 26, 8); fill(c, '#e2e8f0') }) }   // потолок лаборатории
    c.restore();
    // мир лаборатории: бак, листья мяты, капля
    c.save(); c.translate(0, LABY - camD + pan);
    if (pan < 1300) {
      const km = bo(at(t, hit + .3, hit + .9)), sw = Math.sin(t * 1.6) * .06;
      if (km > 0) { mintLeaf(c, 330, 760, 1.45 * km, Math.PI + .35 + sw); mintLeaf(c, 750, 820, 1.45 * km, -.35 - sw); mintLeaf(c, 335, 1010, 1.1 * km, Math.PI - .25 - sw) }
      tank(c, t, { k: eo(at(t, hit, hit + 1.1)) });
      const ks = at(t, hit, hit + .6); if (ks > 0 && ks < 1) { c.save(); c.translate(540, LABY + 1150 - LABY); c.scale(1, .3); ring(c, 0, 0, 30 + ks * 150, rgba('#e0f2fe', 1 - ks), 6); c.restore() }
    }
    c.restore();
    if (u > 0 && u < 1) { const dx = lp(708, 540, ss(0, .6, u)), dy = yd - camD; c.beginPath(); c.ellipse(dx, dy, 26, 34, 0, 0, TAU); fill(c, '#ef4444'); circ(c, dx - 8, dy - 10, 8, 'rgba(255,255,255,.6)') }
    if (t < hit + .2) return;
    // штанга с пакетами въезжает слева, качается маятником; трубка в анализатор с пульсирующими каплями
    c.save(); c.translate(0, pan);
    const RY = -1400 + 200, ks = eo(at(t, K.liq + .4, K.ws - .2)), xs = lp(-1150, 0, ks), tS = K.ws - .2;
    c.save(); c.translate(xs, 0); c.strokeStyle = '#64748b'; c.lineWidth = 16; c.beginPath(); c.moveTo(-1200, RY); c.lineTo(WW + 40, RY); c.stroke();
    rr(c, WW + 20, RY - 30, 40, 60, 8); fill(c, '#475569');
    BAGS.forEach(([lab, col], i) => { const x = 540 + (i - 2) * 195, v = ks < 1 ? (1 - ks) : 0, sw = t < tS ? -.22 * v : Math.sin((t - tS) * 3.4 + i * .5) * -.2 * Math.exp(-(t - tS) * .8) + Math.sin(t * 1.3 + i) * .02;
      ivBag(c, x, RY + 16, lab, col, sw, i === 2 ? pulse2(t, K.ws) + ss(K.ws, K.ws + .3, t) * .6 : 0) });
    c.restore();
    const kt = at(t, K.ws + .1, K.ws + .9), TY0 = RY + 290, TY1 = -1400 + 920;
    c.strokeStyle = 'rgba(226,232,240,.6)'; c.lineWidth = 18; c.beginPath(); c.moveTo(540, TY0); c.lineTo(540, lp(TY0, TY1, ss(0, .4, kt))); c.stroke();
    if (kt > 0) { c.strokeStyle = '#22d3ee'; c.lineWidth = 9; c.beginPath(); c.moveTo(540, TY0); c.lineTo(540, lp(TY0, TY1, kt)); c.stroke();
      if (kt >= 1) for (let j = 0; j < 4; j++) { const ph = ((t - K.ws) * 1.4 + j / 4) % 1, yy = lp(TY0, TY1, ph); glow(c, 540, yy, 40, '#22d3ee', .9); circ(c, 540, yy, 11, '#e0f2fe') } }
    c.restore();
    // анализатор: молекула собирается, атомы сходятся в кольцо — из них вырастает медальон
    const ay = -1400 + 1130 + pan, km2 = at(t, K.ws + .7, K.fool), conv = eio(at(t, K.fool + .2, K.fool + .8)), flip = at(t, K.ice - .35, K.ice + .45);
    c.save(); if (kz > 0) { const s = lp(1, 1.6, kz); c.translate(540, lp(ay, 820, kz)); c.scale(s, s); c.translate(-540, -ay) }
    analyzer(c, t, 540, ay, () => {
      if (conv > 0) medallion(c, t, 0, 0, 140 * bo(conv), flip);
      if (conv < 1) molecule(c, t, -30 * (1 - conv), 0, .9 + .1 * conv, km2, conv);
    });
    c.restore();
    if (kz > 0) {   // подписи и шкалы — поверх, ровно
      const kl = spr(at(t, K.fool + .5, K.fool + .9));
      flipLabel(c, 'ПРИРОДНАЯ МЯТА', 'СИНТЕТИЧЕСКИЙ ЛЁД WS-23', 540, 1215, flip, { f: 'O', w: 700, s: 40, c: '#a7f3d0', ls: 3 }, { f: 'O', w: 700, s: 40, c: '#bae6fd', ls: 3, mw: 900 }, kl);
      const km3 = eo(at(t, K.ice + .3, K.ice + 1.1));
      if (km3 > 0) { c.save(); c.translate(-1100 * (1 - km3), 0); meter(c, 540, 1305, 'ОЩУЩЕНИЕ ХОЛОДА', 1, '#0ea5e9', km3, '▲'); c.restore(); c.save(); c.translate(1100 * (1 - km3), 0); meter(c, 540, 1390, 'СПАЗМ ГОРЛА', 0, '#10b981', km3, '▼'); c.restore() }
    }
  }
