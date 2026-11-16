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
    const { x, y, w, h } = TK, k = o.k ?? 1, L = x - w / 2, T = y - h / 2, dr = o.draw ?? 1;
    c.save();
    if (dr >= 1) { rr(c, L, T, w, h, 60); fill(c, 'rgba(186,230,253,.08)') }
    if (k > 0) {
      c.save(); rr(c, L + 10, T + 10, w - 20, h - 20, 52); c.clip();
      const lv = T + h - 10 - 420 * k, mid = T + h * .56, wv = (ph, amp) => x0 => Math.sin(x0 * .018 + t * 3.2 + ph) * amp;
      const top = wv(0, 16 * k), md = wv(Math.PI, 14 * k);
      c.beginPath(); c.moveTo(L, HH); for (let xx = L; xx <= L + w; xx += 10) c.lineTo(xx, Math.max(lv, mid) + md(xx) * (lv < mid ? 1 : 0)); c.lineTo(L + w, HH); c.closePath();
      const gb = c.createLinearGradient(0, mid, 0, T + h); gb.addColorStop(0, '#22d3ee'); gb.addColorStop(1, '#0891b2'); c.fillStyle = gb; c.fill();
      if (lv < mid) { c.beginPath(); for (let xx = L; xx <= L + w; xx += 10) c.lineTo(xx, lv + top(xx)); for (let xx = L + w; xx >= L; xx -= 10) c.lineTo(xx, mid + md(xx)); c.closePath(); const go = c.createLinearGradient(0, lv, 0, mid); go.addColorStop(0, '#fbbf24'); go.addColorStop(1, '#f59e0b'); c.fillStyle = go; c.fill() }
      for (let i = 0; i < 5; i++) { const ix = L + 70 + i * 66, iy = Math.max(T + h * .75 + Math.sin(t * 2 + i) * 14 + (i % 2) * 40, Math.max(lv, mid) + 34 + i % 2 * 20); if (iy > T + h - 40) continue; c.save(); c.translate(ix, iy); c.rotate(.3 + i); rr(c, -22, -22, 44, 44, 8); fill(c, 'rgba(240,249,255,.75)'); rr(c, -22, -22, 44, 44, 8); stroke(c, '#fff', 2); c.restore() }
      for (let i = 0; i < 10; i++) { const by = T + h - ((t * 120 + i * 70) % (h * .5)); if (by > lv + 12) circ(c, L + 40 + H1(i) * (w - 80), by, 5 + H1(i * 3) * 5, 'rgba(255,255,255,.45)') }
      c.restore();
    }
    c.save(); if (dr < 1) { const per = 2 * (w + h) - 100; c.setLineDash([per * dr, per]) } rr(c, L, T, w, h, 60); stroke(c, 'rgba(224,242,254,.85)', 8); c.restore();
    if (dr >= 1) { c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(L + 30, T + 60, 18, h - 120) }
    c.save(); c.translate(x, T - 33); c.scale(dr, dr); rr(c, -60, -37, 120, 74, 14); fill(c, '#111827'); c.restore();
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
  function medallion(c, t, x, y, R, kf) {   // круг честно поворачивается в 3D (scale по X = cos): мята → ребро → лёд
    if (R <= 0) return; const ang = eio(kf) * Math.PI, cs = Math.cos(ang), off = R * .2 * Math.sin(ang), ice = eio(kf) >= .5;
    if (Math.abs(off) > .5) {   // ребро монеты: в момент поворота видно толщину, а не пустоту
      const rim = ice ? '#075985' : '#047857', ax = Math.abs(cs) * R;
      c.save(); c.translate(x, y); c.fillStyle = rim; c.beginPath(); c.ellipse(-off / 2, 0, Math.max(ax, .5), R, 0, 0, TAU); c.fill(); c.fillRect(-off / 2, -R, off, 2 * R);
      c.strokeStyle = 'rgba(255,255,255,.22)'; c.lineWidth = 3; for (let i = -6; i <= 6; i++) { const yy = i * R / 7; c.beginPath(); c.moveTo(-off / 2, yy); c.lineTo(off / 2, yy); c.stroke() } c.restore() }
    c.save(); c.translate(x + off / 2, y); c.scale(cs, 1); circ(c, 0, 0, R, ice ? '#0284c7' : '#10b981'); ring(c, 0, 0, R - 14, 'rgba(255,255,255,.55)', 6);
    c.lineCap = 'round';
    if (!ice) { c.save(); c.rotate(-.75); const L = R * .78, Wd2 = R * .42; c.beginPath(); c.moveTo(0, L); c.bezierCurveTo(Wd2 * 1.3, L * .4, Wd2 * 1.1, -L * .7, 0, -L); c.bezierCurveTo(-Wd2 * 1.1, -L * .7, -Wd2 * 1.3, L * .4, 0, L); fill(c, '#f0fdf4');
      c.strokeStyle = '#10b981'; c.lineWidth = 9; c.beginPath(); c.moveTo(0, L * .95); c.lineTo(0, -L * .8); c.stroke(); for (let i = 0; i < 4; i++) { const y0 = L * .5 - i * L * .38; c.beginPath(); c.moveTo(0, y0); c.lineTo(Wd2 * .7, y0 - L * .22); c.moveTo(0, y0); c.lineTo(-Wd2 * .7, y0 - L * .22); c.stroke() } c.restore() }
    else { c.strokeStyle = '#f0f9ff'; c.lineWidth = 14;
      for (let i = 0; i < 6; i++) { c.save(); c.rotate(i * TAU / 6); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -R * .78); c.moveTo(0, -R * .45); c.lineTo(-R * .16, -R * .6); c.moveTo(0, -R * .45); c.lineTo(R * .16, -R * .6); c.stroke(); c.restore() } circ(c, 0, 0, 22, '#f0f9ff') }
    c.restore();
  }
  function meter(c, x, y, lab, val, col, k, arrow) {
    rr(c, x - 380, y - 32, 760, 64, 16); fill(c, 'rgba(15,23,42,.85)');
    const v = lp(1 - val, val, k); rr(c, x - 370, y - 22, 740 * v + 1, 44, 12); fill(c, col);
    tx(c, lab + ': ' + Math.round(100 * v) + '% ' + arrow, x, y + 2, { f: 'M', w: 800, s: 30, c: '#fff' });
  }
  function flipLabel(c, s0, s1, x, y, k, o0, o1, ka) {   // подпись переворачивается по горизонтальной оси (без растворения)
    if (ka <= 0) return; const a = Math.cos(Math.PI * eio(k)), sy = Math.abs(a) * ka;
    c.save(); c.translate(x, y); c.scale(ka, Math.max(.001, sy)); tx(c, a >= 0 ? s0 : s1, 0, 0, a >= 0 ? o0 : o1); c.restore();
  }
  const LABY = 1920;   // лаборатория — этажом ниже стола
  function shot5Old(c, t) {
    // 43.0–43.6: лист и стол уезжают вниз, красный столбик 2020 сжимается в каплю (540, 560), проступает контур пустого бака;
    // 43.6–44.0: капля падает на дно; 43.9–44.8: жидкость поднимается со дна
    const T0 = K.s5 - .25, p = at(t, T0, T0 + .6), pe = eio(p), hit = T0 + 1;
    const pan = eio(at(t, K.liq - .1, K.liq + 1.0)) * 1400;   // потом камера поднимается от бака к пакетам
    const kz = eio(at(t, K.fool - .3, K.fool + .5));           // наезд в экран анализатора
    window.__T = t;
    labBg(c, t, pan);
    c.save(); c.translate(0, pan);
    if (pan < 1300) {
      const km = bo(at(t, hit + .2, hit + .8)), sw = Math.sin(t * 1.6) * .06;
      if (km > 0) { mintLeaf(c, 330, 760, 1.45 * km, Math.PI + .35 + sw); mintLeaf(c, 750, 820, 1.45 * km, -.35 - sw); mintLeaf(c, 335, 1010, 1.1 * km, Math.PI - .25 - sw) }
      tank(c, t, { k: eo(at(t, T0 + .9, T0 + 1.8)), draw: eo(p) });
      const ks = at(t, hit, hit + .6); if (ks > 0 && ks < 1) { c.save(); c.translate(540, 1185); c.scale(1, .3); ring(c, 0, 0, 30 + ks * 150, rgba('#e0f2fe', 1 - ks), 6); c.restore() }
    }
    c.restore();
    if (pe < 1) { c.save(); c.translate(0, 1600 * pe); deskShot(c, t, { hideBar: true }); c.restore() }   // стол уезжает вниз и открывает бак
    if (t < hit) {
      if (p < 1) {   // столбик → капля
        const sd = deskS(t), r = RP.r, x0 = 540 + sd * (Math.cos(r) * 180 + Math.sin(r) * 10), y0 = 830 + sd * (Math.sin(r) * 180 - Math.cos(r) * 10);
        const w = lp(160 * sd, 44, pe), h = lp(720 * sd, 56, pe), cx2 = lp(x0, 540, pe), cy2 = lp(y0, 560, pe);
        c.save(); c.translate(cx2, cy2); c.rotate(r * (1 - pe)); rr(c, -w / 2, -h / 2, w, h, lp(10, 22, pe)); fill(c, '#ef4444');
        const R0 = 48 * sd * (1 - pe); if (R0 > 1) { circ(c, 0, -h / 2, R0, '#ef4444'); circ(c, 0, -h / 2, R0 * .83, '#fff'); c.save(); c.translate(0, -h / 2); c.scale(1 - pe, 1 - pe); tx(c, '2020', 0, 2, { f: 'O', w: 700, s: 30, c: '#b91c1c' }); c.restore() }
        circ(c, -w * .18, -h * .2, 8 * pe, 'rgba(255,255,255,.6)'); c.restore();
      } else { const dy = lp(560, 1160, ei(at(t, T0 + .6, hit))); c.beginPath(); c.ellipse(540, dy, 22, 28, 0, 0, TAU); fill(c, '#ef4444'); circ(c, 532, dy - 8, 7, 'rgba(255,255,255,.6)') }
    }
    if (t < K.liq - .2) return;
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
    const ay = -1400 + 1130 + pan, km2 = at(t, K.ws + .7, K.fool), ms = 1 - eio(at(t, K.fool - .1, K.fool + .1)), mr = bo(at(t, K.fool + .11, K.fool + .51)), flip = at(t, K.ice - .51, K.ice + .29);
    c.save(); if (kz > 0) { const s = lp(1, 1.6, kz); c.translate(540, lp(ay, 820, kz)); c.scale(s, s); c.translate(-540, -ay) }
    analyzer(c, t, 540, ay, () => {
      if (ms > 0) molecule(c, t, -30, 0, .9 * ms, km2, 0);   // молекула гаснет (сжимается в точку) до появления круга
      if (mr > 0) medallion(c, t, 0, 0, 140 * mr, flip);
    });
    c.restore();
    if (kz > 0) {   // подписи и шкалы — поверх, ровно
      const kl = spr(at(t, K.fool + .5, K.fool + .9));
      flipLabel(c, 'ПРИРОДНАЯ МЯТА', 'СИНТЕТИЧЕСКИЙ ЛЁД WS-23', 540, 1215, flip, { f: 'O', w: 700, s: 40, c: '#a7f3d0', ls: 3 }, { f: 'O', w: 700, s: 40, c: '#bae6fd', ls: 3, mw: 900 }, kl);
      const km3 = eo(at(t, K.ice + .3, K.ice + 1.1));
      if (km3 > 0) { c.save(); c.translate(-1100 * (1 - km3), 0); meter(c, 540, 1305, 'ОЩУЩЕНИЕ ХОЛОДА', 1, '#0ea5e9', km3, '▲'); c.restore(); c.save(); c.translate(1100 * (1 - km3), 0); meter(c, 540, 1390, 'СПАЗМ ГОРЛА', 0, '#10b981', km3, '▼'); c.restore() }
    }
  }

  // ================= v18.3 (проба): сцена 5 по Cola 0:03–0:05.5 (#002), Instagram 0:21.5–0:31.5 (#054/#055), Starbucks 0:39.5–0:43.5 (#019) =================
  // Белый круг заливает экран — высокий стакан с двухслойной жидкостью, красная капля висит и падает, за стаканом встаёт круг-солнце,
  // растут листья мяты. Камера вверх — пакеты на штанге, трубка из пакета WS-23 идёт в стакан; камера бежит вниз за голубым потоком
  // по трубке до анализатора (бирюзовый корпус, красный экран), на экране собирается молекула; наезд в экран — кольца разлетаются,
  // за ними эмблема «природная мята»; эмблема поворачивается на 180° в плоскости, перевёрнутый лист становится снежинкой.
  const S5 = { wc: { x: 560, y: 950, R: 1150 }, nav: '#1b2440', wall: '#1c2b74', slate: '#232741', an: 2350, PU: 1350, PD: -1450 };
  const TUB1 = [[540, -830], [540, -560], [720, -560], [720, -190], [540, -190], [540, 712]];
  const TUB2 = [[540, 1150], [540, 1380], [330, 1380], [330, 1740], [740, 1740], [740, 1960], [540, 1960], [540, 2140]];
  function polyUpTo(c, P, yMax) {   // ломаная до глубины yMax (путь идёт только вниз и вбок)
    c.beginPath(); c.moveTo(P[0][0], P[0][1]);
    for (let i = 1; i < P.length; i++) { const [x0, y0] = P[i - 1], [x1, y1] = P[i];
      if (y1 <= yMax) { c.lineTo(x1, y1); continue }
      if (y0 < yMax) c.lineTo(x0 + (x1 - x0) * (yMax - y0) / (y1 - y0), yMax); break }
  }
  function tubeS5(c, P, front, col) {
    c.lineJoin = 'round'; c.lineCap = 'round';
    c.beginPath(); P.forEach(([x, y], i) => c[i ? 'lineTo' : 'moveTo'](x, y)); c.strokeStyle = '#0f3b44'; c.lineWidth = 22; c.stroke(); c.strokeStyle = '#e2e8f0'; c.lineWidth = 12; c.stroke();
    if (front > P[0][1]) { polyUpTo(c, P, front); c.strokeStyle = col; c.lineWidth = 12; c.stroke() }
  }
  function pintPath(c) { c.beginPath(); c.moveTo(390, 700); c.bezierCurveTo(392, 830, 452, 960, 445, 1105); c.lineTo(635, 1105); c.bezierCurveTo(628, 960, 688, 830, 690, 700); c.closePath() }
  function pintS5(c, t, amp, bandCol) {
    c.save(); pintPath(c); c.clip();
    const lv = 790, wv = (x, ph) => Math.sin(x * .03 + t * 3.4 + ph) * amp;
    c.beginPath(); c.moveTo(380, 1200); for (let x = 380; x <= 700; x += 8) c.lineTo(x, lv + wv(x, 0)); c.lineTo(700, 1200); c.closePath(); fill(c, bandCol);
    c.beginPath(); c.moveTo(380, 1200); for (let x = 380; x <= 700; x += 8) c.lineTo(x, lv + 42 + wv(x, 2.1) * .8); c.lineTo(700, 1200); c.closePath(); fill(c, S5.nav);
    for (let i = 0; i < 9; i++) { const y = 1090 - ((t * 60 + i * 37) % 260); circ(c, 470 + H1(i) * 140, y, 3 + H1(i * 3) * 3, 'rgba(241,245,249,.55)') }
    for (let yy = 712; yy < 770; yy += 11) for (let xx = 400; xx < 452; xx += 11) circ(c, xx + (yy % 22 ? 5 : 0), yy, 2.4, S5.nav);
    c.restore();
    pintPath(c); lnS(c, 6, S5.nav);
    rr(c, 430, 1105, 220, 34, 6); fill(c, '#fff'); c.save(); rr(c, 430, 1105, 220, 34, 6); c.clip(); for (let xx = 436; xx < 650; xx += 11) for (let yy = 1112; yy < 1140; yy += 11) circ(c, xx, yy, 2.2, S5.nav); c.restore(); rr(c, 430, 1105, 220, 34, 6); lnS(c, 6, S5.nav);
  }
  function leafS5(c, x, y, s, r, col, vein) { if (s <= 0) return; c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(70, -120, 240, -120, 300, 0); c.bezierCurveTo(240, 110, 70, 110, 0, 0); fill(c, col);
    c.beginPath(); c.moveTo(10, 0); c.lineTo(290, 0); for (let i = 1; i < 6; i++) { c.moveTo(i * 48, 0); c.lineTo(i * 48 + 40, -50 + (i % 2) * 2); c.moveTo(i * 48, 0); c.lineTo(i * 48 + 40, 50) } lnS(c, 5, vein); c.restore() }
  function analyzerS5(c, t, y, km) {   // #055: бирюзовый корпус, красный экран, ручки справа
    c.save(); c.translate(540, y);
    rr(c, -360, -230, 720, 460, 26); fill(c, '#1f8a9a'); rr(c, -360, -230, 720, 70, 26); fill(c, '#176b78'); rr(c, -360, -230, 720, 460, 26); lnS(c, 6, '#0f3b44');
    [-300, -250, -200].forEach(x => circ(c, x, -195, 12, '#0f3b44'));
    rr(c, -320, -130, 420, 290, 16); fill(c, '#0f3b44'); rr(c, -305, -115, 390, 260, 10); fill(c, '#d0384f');
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { circ(c, 170 + i * 56, -40 + j * 70, 22, '#f1f5f9'); circ(c, 170 + i * 56 + 6 * Math.sin(t * 2 + i + j), -40 + j * 70 - 6, 5, '#0f3b44') }
    rr(c, 150, -120, 150, 40, 6); fill(c, '#f1f5f9'); rr(c, 160, 80, 130, 26, 6); fill(c, '#0f3b44'); rr(c, 160, 116, 90, 26, 6); fill(c, '#0f3b44');
    rr(c, -390, -60, 30, 160, 6); fill(c, '#d0384f');
    // молекула WS-23 белыми точками на экране
    if (km > 0) { c.save(); c.translate(-110, 15); c.scale(.62, .62);
      MOLB.forEach(([a, b], i) => { const kk = at(km, .3 + i * .05, .5 + i * .05); if (kk <= 0) return; c.beginPath(); c.moveTo(MOLA[a][0], MOLA[a][1]); c.lineTo(lp(MOLA[a][0], MOLA[b][0], kk), lp(MOLA[a][1], MOLA[b][1], kk)); lnS(c, 7, '#f1f5f9') });
      MOLA.forEach(([px, py], i) => { const kk = spr(at(km, i * .045, i * .045 + .35)); if (kk > 0) circ(c, px, py, (i === 3 ? 30 : 20) * kk, i === 3 ? '#38bdf8' : '#f1f5f9') });
      c.restore() }
    c.restore();
  }
  function ringsS5(c, t, k) {   // #019: толстые дуги разлетаются из центра, крутятся
    const cols = ['#22d3ee', '#0f172a', '#34d399', '#0f172a', '#22d3ee', '#34d399'];
    for (let i = 0; i < 6; i++) { const r = (k * 1.5 - i * .1) * 1250; if (r <= 0) continue; const a0 = t * (i % 2 ? -3 : 2.4) + i;
      c.beginPath(); c.arc(540, 820, r, a0, a0 + Math.PI * (1.25 + .1 * i)); c.strokeStyle = cols[i]; c.lineWidth = 70 + i * 6; c.lineCap = 'round'; c.stroke() }
  }
  function emblemS5(c, t, kr, km) {   // эмблема «природная мята»: контур, буквы по кругу, лист; поворот kr (0…1 = 180°), лист → снежинка km
    const R = 224; c.save(); c.translate(540, 820); c.rotate(Math.PI * eio(kr));
    circ(c, 0, 0, R, S5.slate); ring(c, 0, 0, R, '#34d399', 9); ring(c, 0, 0, R - 46, '#34d399', 4);
    const S = 'ПРИРОДНАЯ МЯТА · ПРИРОДНАЯ МЯТА · '; for (let i = 0; i < S.length; i++) { c.save(); c.rotate(i * TAU / S.length); tx(c, S[i], 0, -R + 23, { f: 'O', w: 700, s: 26, c: '#34d399' }); c.restore() }
    if (km < 1) { c.save(); c.rotate(-.75); const L = R * .6, Wd2 = R * .34; c.beginPath(); c.moveTo(0, L); c.bezierCurveTo(Wd2 * 1.3, L * .4, Wd2 * 1.1, -L * .7, 0, -L); c.bezierCurveTo(-Wd2 * 1.1, -L * .7, -Wd2 * 1.3, L * .4, 0, L);
      c.moveTo(0, L * .95); c.lineTo(0, -L * .8); for (let i = 0; i < 4; i++) { const y0 = L * .5 - i * L * .38; c.moveTo(0, y0); c.lineTo(Wd2 * .7, y0 - L * .22); c.moveTo(0, y0); c.lineTo(-Wd2 * .7, y0 - L * .22) }
      if (km > 0) c.setLineDash([1400 * (1 - km), 1500]); lnS(c, 8, '#34d399'); c.restore() }
    c.restore();
    if (km > 0) { c.save(); c.translate(540, 820); c.strokeStyle = '#f0f9ff'; c.lineWidth = 14; c.lineCap = 'round';
      for (let i = 0; i < 6; i++) { c.save(); c.rotate(i * TAU / 6); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -R * .78 * km); if (km > .5) { const b = (km - .5) * 2; c.moveTo(0, -R * .45); c.lineTo(-R * .16 * b, -R * (.45 + .15 * b)); c.moveTo(0, -R * .45); c.lineTo(R * .16 * b, -R * (.45 + .15 * b)) } c.stroke(); c.restore() }
      circ(c, 0, 0, 22 * km, '#f0f9ff'); c.restore() }
  }
  function shot5(c, t) {
    const T0 = K.s5 - .25, hit = T0 + 1.45, W = S5.wc;
    const kw = eio(at(t, T0, T0 + .45)), Rw = lp(0, W.R, kw), wcx = lp(1250, W.x, kw), wcy = lp(560, W.y, kw);
    const pan = S5.PU * eio(at(t, K.liq - .2, K.liq + .7)) + (S5.PD - S5.PU) * eio(at(t, K.ws + .15, K.fool - .05));
    const zp = 1 + .2 * eio(at(t, hit + .05, hit + .9)) * (1 - eio(at(t, K.liq - .25, K.liq + .35)));
    const kz = eio(at(t, K.fool + .55, K.fool + 1.2)), za = lp(1, 2.6, kz), kR = at(t, K.fool + 1.2, K.fool + 1.75);
    const kr = at(t, K.ice - .55, K.ice - .05), km = eio(at(t, K.ice - .05, K.ice + .35)), kfl = eio(at(t, K.ice + .25, K.ice + .65));
    window.__T = t;
    if (kR >= 1) {   // эмблема на тёмно-синем
      c.fillStyle = S5.slate; c.fillRect(0, 0, WW, HH);
      if (kfl >= 1) medallion(c, t, 540, 820, 224, 1);
      else { emblemS5(c, t, kr, km); if (kfl > 0) { c.save(); c.beginPath(); c.arc(540, 820, 224 * kfl, 0, TAU); c.clip(); medallion(c, t, 540, 820, 224, 1); c.restore() } }
      const kl = spr(at(t, K.ice - .9, K.ice - .5));
      flipLabel(c, 'ПРИРОДНАЯ МЯТА', 'СИНТЕТИЧЕСКИЙ ЛЁД WS-23', 540, 1125, at(t, K.ice - .2, K.ice + .3), { f: 'O', w: 700, s: 42, c: '#6ee7b7', ls: 3 }, { f: 'O', w: 700, s: 42, c: '#bae6fd', ls: 3, mw: 900 }, kl);
      const km3 = eo(at(t, K.ice + .3, K.ice + 1.1));
      if (km3 > 0) { c.save(); c.translate(-1100 * (1 - km3), 0); meter(c, 540, 1235, 'ОЩУЩЕНИЕ ХОЛОДА', 1, '#0ea5e9', km3, '▲'); c.restore(); c.save(); c.translate(1100 * (1 - km3), 0); meter(c, 540, 1325, 'СПАЗМ ГОРЛА', 0, '#10b981', km3, '▼'); c.restore() }
      return;
    }
    // мир: тёмно-синяя стена, белый круг со стаканом, трубки, анализатор
    c.save();
    if (kz > 0) { const scx = 540 - 110, scy = S5.an + 15 + pan; c.translate(lp(scx, 540, kz), lp(scy, 820, kz)); c.scale(za, za); c.translate(-scx, -scy) }
    c.translate(560, 900); c.scale(zp, zp); c.translate(-560, -900); c.translate(0, pan);
    if (Rw > 0) {
      c.fillStyle = S5.wall; c.fillRect(-600, -2400, WW + 1200, 6000);
      c.save(); c.beginPath(); c.arc(wcx, wcy, Rw, 0, TAU); c.clip(); c.fillStyle = '#fbfaf7'; c.fillRect(-600, -2400, WW + 1200, 6000);
      // солнце-круг, листья, холмик
      const kS = bo(at(t, hit + .1, hit + .5)); if (kS > 0) { circ(c, 735, 610, 165 * kS, '#7dd3fc'); ring(c, 765, 600, 205 * kS, '#38bdf8', 5) }
      leafS5(c, 950, 1180, 1.25 * bo(at(t, hit + .2, hit + .65)), Math.PI + .55 + Math.sin(t * 1.4) * .04, '#2a9d8f', '#1f7a70');
      leafS5(c, 990, 940, .9 * bo(at(t, hit + .3, hit + .75)), Math.PI + .1 + Math.sin(t * 1.2 + 1) * .05, '#6ee7b7', '#2a9d8f');
      const kg = eo(at(t, hit + .05, hit + .5)); if (kg > 0) { c.beginPath(); c.ellipse(220, 1150 + 120 * (1 - kg), 330, 70, 0, 0, TAU); fill(c, '#6ee7b7') }
      c.restore();
      if (Rw < W.R) { c.save(); c.translate(0, 0); if (pan < 1) { c.save(); c.beginPath(); c.rect(-600, -2400, WW + 1200, 6000); c.arc(wcx, wcy, Rw, 0, TAU, true); c.clip(); c.setTransform(1, 0, 0, 1, 0, 0); deskShot(c, t, { hideBar: true }); c.restore() } c.restore() }
    } else deskShot(c, t, { hideBar: true });
    // штанга с пакетами (#054)
    if (pan > 50) { const RY = -1170; c.strokeStyle = '#64748b'; c.lineWidth = 16; c.beginPath(); c.moveTo(-60, RY); c.lineTo(WW + 60, RY); c.stroke();
      BAGS.forEach(([lab, col], i) => { const x = 540 + (i - 2) * 200, sw = Math.sin(t * 1.5 + i * .7) * .05; c.save(); c.translate(x, RY + 16); c.scale(1.18, 1.18); c.translate(-x, -RY - 16); ivBag(c, x, RY + 16, lab, col, sw, i === 2 ? pulse2(t, K.ws) + ss(K.ws, K.ws + .3, t) * .6 : 0); c.restore() }) }
    // трубки: голубой поток бежит за камерой
    const front = t < K.ws - .1 ? -1e4 : lp(TUB1[0][1], 960 - S5.PU, at(t, K.ws - .1, K.ws + .15)) + Math.max(0, (S5.PU - pan));
    const kd1 = eo(at(t, K.liq - .45, K.liq + .05)); if (kd1 > 0) { c.save(); c.translate(0, -1100 * (1 - kd1)); tubeS5(c, TUB1, front, '#22d3ee'); c.restore() }
    if (t > K.ws && pan < 600) tubeS5(c, TUB2, front, '#22d3ee');
    // стакан и капля (#002)
    if (Rw > 0) {
      const kb = at(front, 700, 1105), bandCol = mixc('#f59e0b', '#22d3ee', kb), amp = 8 + 26 * Math.exp(-5 * Math.max(0, t - hit)) * (t > hit ? 1 : 0);
      c.save(); if (Rw < W.R) { c.beginPath(); c.arc(wcx, wcy, Rw, 0, TAU); c.clip() } pintS5(c, t, amp, bandCol); c.restore();
      const ks = at(t, hit, hit + .55); if (ks > 0 && ks < 1) { c.save(); c.translate(540, 790); c.scale(1, .35); ring(c, 0, 0, 20 + ks * 140, rgba('#ef4444', 1 - ks), 5); c.restore() }
    }
    analyzerS5(c, t, S5.an, at(t, K.fool - .05, K.fool + .85));
    c.restore();
    if (kR > 0) { c.save(); c.beginPath(); c.arc(540, 820, Math.max(0, (kR * 1.5 - .5) * 1250), 0, TAU); c.clip(); c.fillStyle = S5.slate; c.fillRect(0, 0, WW, HH); emblemS5(c, t, 0, 0); c.restore(); ringsS5(c, t, kR) }
    // столбик 2020 → капля (поверх всего), висит, падает в стакан
    if (t < hit) {
      const p = at(t, T0, T0 + .6), pe = eio(p);
      if (p < 1) {
        const sd = deskS(t), r = RP.r, x0 = 540 + sd * (Math.cos(r) * 180 + Math.sin(r) * 10), y0 = 830 + sd * (Math.sin(r) * 180 - Math.cos(r) * 10);
        const w = lp(160 * sd, 44, pe), h = lp(720 * sd, 56, pe), cx2 = lp(x0, 540, pe), cy2 = lp(y0, 560, pe);
        c.save(); c.translate(cx2, cy2); c.rotate(r * (1 - pe)); rr(c, -w / 2, -h / 2, w, h, lp(10, 22, pe)); fill(c, '#ef4444');
        const R0 = 48 * sd * (1 - pe); if (R0 > 1) { circ(c, 0, -h / 2, R0, '#ef4444'); circ(c, 0, -h / 2, R0 * .83, '#fff'); c.save(); c.translate(0, -h / 2); c.scale(1 - pe, 1 - pe); tx(c, '2020', 0, 2, { f: 'O', w: 700, s: 30, c: '#b91c1c' }); c.restore() }
        c.restore();
      } else { const kf = at(t, hit - .3, hit), dy = lp(560 + Math.sin((t - T0) * 5) * 10, 790, kf * kf); c.beginPath(); c.ellipse(540, dy, 22, 28, 0, 0, TAU); fill(c, '#ef4444') }
    }
  }
