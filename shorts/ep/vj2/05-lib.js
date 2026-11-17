  // ================= vj1: общие предметы и помощники =================
  const PJ = { bg: '#262a40', bg2: '#2f3454', dim: '#3a3f5e', ln: '#eef2f7', ink: '#1e2340', red: '#e8445a', warm: '#ffd479', gold: '#f2c14e', ice: '#9fdcf7',
    grn: '#7ee787', blue: '#3b5d9a', blue2: '#26406c', paper: '#f1ede4', paper2: '#e2dac9', inkP: '#2a2f4a', hole: '#141a33', orange: '#f97316' };
  let PH = [];   // фразы: {a, b, text}
  const KY = (t, x, y, z, r = 0) => [t, x, y, Math.log(z), r];
  const camOf = (KS, t) => camObj(camAt(KS, t));
  function applyCam(c, q) { c.translate(540, 960); if (q.r) c.rotate(q.r); c.scale(q.z, q.z); c.translate(-q.x, -q.y) }
  const toScr = (q, x, y) => [540 + (x - q.x) * q.z, 960 + (y - q.y) * q.z];   // без поворота
  // слой с параллаксом: p = 1 — основной план; (ox, oy) — где слои совпадают с основным
  function lay(c, q, p, ox, oy, draw) { c.save(); c.translate(540, 960); if (q.r) c.rotate(q.r * p); const s = Math.pow(q.z, p); c.scale(s, s); c.translate(-(ox + (q.x - ox) * p), -(oy + (q.y - oy) * p)); draw(c, s); c.restore() }
  function lnW(c, w, col = PJ.ln) { c.strokeStyle = col; c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke() }
  const fmt = v => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const bump = (t, a, d = .35) => { const k = at(t, a, a + d); return Math.sin(Math.PI * k) };
  function along(P, u) {   // точка на ломаной P = [[x,y],…] по доле длины u
    let L = 0; const s = [0]; for (let i = 1; i < P.length; i++) { L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); s.push(L) }
    const d = cl(u) * L; let i = 1; while (i < P.length - 1 && s[i] < d) i++;
    const k = (d - s[i - 1]) / ((s[i] - s[i - 1]) || 1); return [lp(P[i - 1][0], P[i][0], k), lp(P[i - 1][1], P[i][1], k)];
  }
  function pathL(c, P, k = 1) {   // ломаная, нарисованная на долю k
    c.beginPath(); if (k <= 0) return; c.moveTo(P[0][0], P[0][1]);
    if (k >= 1) { for (let i = 1; i < P.length; i++) c.lineTo(P[i][0], P[i][1]); return }
    let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
    let d = k * L; for (let i = 1; i < P.length && d > 0; i++) { const s = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); const u = Math.min(1, d / s); c.lineTo(lp(P[i - 1][0], P[i][0], u), lp(P[i - 1][1], P[i][1], u)); d -= s }
  }
  // огонёк сигареты: круг с горячим центром (на большом зуме — оранжевое поле, в нём табло)
  function ember(c, x, y, r, t, k = 1) {
    if (k <= 0) return; const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, mixc('#7c6f6a', '#fff1c2', k)); g.addColorStop(.38, mixc('#5b524f', '#ffb347', k)); g.addColorStop(.78, mixc('#4a4240', '#f97316', k)); g.addColorStop(1, mixc('#3a3330', '#c2410c', k));
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = g; c.fill();
  }
  // «Джул»: плоский брусок, справа картридж с окошком, слева огонёк; k — сколько «настоящего» цвета (слева направо), bp — пунктир чертежа
  function juulDev(c, x, y, L, o = {}) {
    const H = L * .155, k = o.k ?? 1, lw = Math.max(2, L * .009);
    c.save(); c.translate(x, y); if (o.ang) c.rotate(o.ang);
    if (o.sh) { c.save(); c.translate(o.sh * .5, o.sh); rr(c, -L / 2, -H / 2, L, H, H * .3); fill(c, 'rgba(10,12,30,.35)'); c.restore() }
    if (k > 0) {
      c.save(); c.beginPath(); c.rect(-L / 2 - 6, -H, (L + 12) * cl(k), H * 2); c.clip();
      rr(c, -L / 2, -H / 2, L, H, H * .3); fill(c, '#5d6479');
      c.save(); rr(c, -L / 2, -H / 2, L, H, H * .3); c.clip();
      c.fillStyle = '#4b5165'; c.fillRect(-L / 2, H * .12, L, H * .5);
      poly(c, [-L / 2 + L * .05, -H / 2, -L / 2 + L * .13, -H / 2, -L / 2 + L * .25, H / 2, -L / 2 + L * .17, H / 2]); fill(c, 'rgba(255,255,255,.13)');
      c.fillStyle = '#1e2340'; c.fillRect(L / 2 - L * .25, -H / 2, L * .25, H);
      c.fillStyle = o.liq || '#f59e0b'; c.globalAlpha = .9; c.fillRect(L / 2 - L * .21, -H * .2, L * .13, H * .4); c.globalAlpha = 1;
      c.restore();
      rr(c, -L / 2, -H / 2, L, H, H * .3); lnW(c, lw, o.lc || PJ.ln);
      c.beginPath(); c.moveTo(L / 2 - L * .25, -H / 2); c.lineTo(L / 2 - L * .25, H / 2); lnW(c, lw * .7, o.lc || PJ.ln);
      const led = o.led ?? 0; circ(c, -L / 2 + L * .09, 0, H * .08, mixc('#7dd3fc', '#4ade80', led)); if (led > 0) glow(c, -L / 2 + L * .09, 0, H * .6, '#4ade80', .7 * led);
      tx(c, 'ДЖУЛ', -L * .06, H * .03, { f: 'U', w: 800, s: H * .32, c: 'rgba(238,242,247,.8)', ls: H * .05 });
      c.restore();
    }
    if (k < 1 && o.bp) { c.save(); c.beginPath(); c.rect(-L / 2 - 6 + (L + 12) * cl(k), -H, L + 12, H * 2); c.clip(); c.setLineDash([L * .03, L * .02]); rr(c, -L / 2, -H / 2, L, H, H * .3); lnW(c, lw, o.bpc || PJ.inkP);
      c.beginPath(); c.moveTo(L / 2 - L * .25, -H / 2); c.lineTo(L / 2 - L * .25, H / 2); lnW(c, lw * .7, o.bpc || PJ.inkP); c.restore() }
    c.restore();
  }
  // картридж (под): прозрачный корпус, цветная жидкость, чёрный мундштук
  function podJ(c, x, y, s, col, o = {}) {
    if (s <= 0) return; c.save(); c.translate(x, y); if (o.r) c.rotate(o.r); c.scale(s, s); if (o.a !== undefined) c.globalAlpha *= o.a;
    rr(c, -34, -64, 68, 134, 14); fill(c, '#e6ecf5');
    c.save(); rr(c, -34, -64, 68, 134, 14); c.clip(); c.fillStyle = col; c.fillRect(-34, -8, 68, 80); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-22, -56, 9, 118); c.restore();
    rr(c, -38, -92, 76, 34, 10); fill(c, PJ.ink);
    rr(c, -34, -64, 68, 134, 14); lnW(c, 5, PJ.ink); rr(c, -38, -92, 76, 34, 10); lnW(c, 5, PJ.ink);
    if (o.lab) tx(c, o.lab, 0, 104, { f: 'U', w: 800, s: 22, c: o.lc || PJ.ink, mw: 230 });
    if (o.x > 0) { c.save(); c.globalAlpha *= cl(o.x * 2); const e = eo(o.x); c.beginPath(); c.moveTo(-60 * e, -70 * e); c.lineTo(60 * e, 70 * e); c.moveTo(60 * e, -70 * e); c.lineTo(-60 * e, 70 * e); lnW(c, 18, PJ.red); c.restore() }
    c.restore();
  }
  function packJ(c, x, y, s, o = {}) {   // пачка сигарет без марки
    if (s <= 0) return; c.save(); c.translate(x, y); if (o.r) c.rotate(o.r); c.scale(s, s);
    rr(c, -78, -106, 156, 212, 10); fill(c, '#f4f1ea'); c.save(); rr(c, -78, -106, 156, 212, 10); c.clip(); c.fillStyle = '#d33a3a'; c.fillRect(-78, -106, 156, 70);
    poly(c, [-78, -36, 0, -76, 78, -36, 78, -24, 0, -64, -78, -24]); fill(c, '#f4f1ea'); c.restore();
    rr(c, -78, -106, 156, 212, 10); lnW(c, 5, PJ.ink);
    tx(c, 'СИГАРЕТЫ', 0, 18, { f: 'U', w: 800, s: 21, c: PJ.ink }); tx(c, '20 ШТ.', 0, 56, { f: 'M', w: 800, s: 22, c: '#64748b' });
    c.restore();
  }
  // табло денег: тёмная панель, зелёные цифры (у краха — красные)
  function moneyPanel(c, x, y, w, val, o = {}) {
    const h = w * .34; c.save(); c.translate(x, y); if (o.sy !== undefined) c.scale(1, o.sy);
    rr(c, -w / 2 + w * .02, -h / 2 + w * .03, w, h, w * .05); fill(c, 'rgba(5,8,20,.45)');
    rr(c, -w / 2, -h / 2, w, h, w * .05); fill(c, '#0b1020'); rr(c, -w / 2, -h / 2, w, h, w * .05); lnW(c, w * .011, o.bd || PJ.ln);
    const col = o.col || '#7ee787'; glow(c, 0, h * .06, w * .45, col, .12);
    num(c, '$' + fmt(val), 0, o.lab ? h * .1 : 0, { f: 'J', w: 700, s: w * .092, c: col });
    if (o.lab) tx(c, o.lab, 0, -h * .27, { f: 'U', w: 800, s: w * .036, c: rgba(col, .85), ls: w * .003 });
    c.restore();
  }
  // круглый прибор (тушью на бумаге): v — 0…1, стрелка
  function dialJ(c, x, y, r, v, lab, o = {}) {
    const a0 = Math.PI * 1.1, a1 = Math.PI * 1.9;
    c.beginPath(); c.arc(x, y, r, Math.PI, 0); c.closePath(); fill(c, o.bg || '#fbf8f1'); c.beginPath(); c.arc(x, y, r, Math.PI, 0); c.closePath(); lnW(c, 6, PJ.inkP);
    const segs = [['#4ade80', 0, .45], ['#facc15', .45, .7], ['#ef4444', .7, 1]];
    segs.forEach(([col, s0, s1]) => { c.beginPath(); c.arc(x, y, r * .78, lp(a0, a1, s0), lp(a0, a1, s1)); lnW(c, r * .12, col) });
    for (let i = 0; i <= 8; i++) { const a = lp(a0, a1, i / 8); c.beginPath(); c.moveTo(x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9); c.lineTo(x + Math.cos(a) * r * .98, y + Math.sin(a) * r * .98); lnW(c, 4, PJ.inkP) }
    const a = lp(a0, a1, cl(v)); c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72); lnW(c, 9, PJ.inkP); circ(c, x, y, 13, PJ.inkP);
    tx(c, lab, x, y + 48, { f: 'U', w: 800, s: 30, c: PJ.inkP, mw: r * 2.2 });
  }
  // красный штамп по кругу
  function stampC(c, x, y, r, k, top, mid, o = {}) {
    if (k <= 0) return; const s = lp(2.4, 1, ei(cl(k * 1.4)));
    c.save(); c.translate(x, y); c.rotate(o.r ?? -.18); c.scale(s, s); c.globalAlpha *= cl(k * 3) * .92;
    ring(c, 0, 0, r, o.col || '#d61f3c', 8); ring(c, 0, 0, r * .8, o.col || '#d61f3c', 4);
    tx(c, mid, 0, 4, { f: 'U', w: 800, s: r * .5, c: o.col || '#d61f3c' }); if (top) tx(c, top, 0, -r * .55, { f: 'M', w: 800, s: r * .17, c: o.col || '#d61f3c', ls: 2 });
    c.restore();
  }
  // молекула никотина (скелетная): пиридин + пирролидин
  function nicMol(c, x, y, s, col, w = 5) {
    c.save(); c.translate(x, y); c.scale(s, s);
    const hx = (cx, cy, r) => { const p = []; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * TAU / 6; p.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r) } return p };
    const P = hx(-50, 0, 52); poly(c, P); lnW(c, w, col);
    c.beginPath(); c.moveTo(P[2] - 9, P[3] + 5); c.lineTo(P[4] - 9, P[5] - 5); lnW(c, w * .8, col);
    tx(c, 'N', P[8], P[9] + 2, { f: 'M', w: 800, s: 26, c: col });
    const q = []; for (let i = 0; i < 5; i++) { const a = Math.PI + i * TAU / 5; q.push(70 + Math.cos(a) * 40, 18 + Math.sin(a) * 40) }
    c.beginPath(); c.moveTo(P[2], P[3]); c.lineTo(q[0], q[1]); lnW(c, w, col); poly(c, q); lnW(c, w, col);
    tx(c, 'N', q[6], q[7] + 2, { f: 'M', w: 800, s: 26, c: col }); c.beginPath(); c.moveTo(q[6] + 8, q[7] + 14); c.lineTo(q[6] + 26, q[7] + 44); lnW(c, w, col);
    c.restore();
  }
  function speedTrail(c, q0, q1, a) {   // черты скорости по движению камеры (экранные)
    if (a <= 0) return; const dx = (q1.x - q0.x) * q1.z, dy = (q1.y - q0.y) * q1.z, v = Math.hypot(dx, dy); if (v < 60) return;
    const ux = dx / v, uy = dy / v, n = 18, L = Math.min(900, v * 4);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = a * cl((v - 60) / 300) * .5; c.strokeStyle = '#eef2f7'; c.lineCap = 'round';
    for (let i = 0; i < n; i++) { const x = H1(i * 3.3) * 1180 - 50, y = H1(i * 7.1 + 2) * 2020 - 50; c.lineWidth = 3 + H1(i) * 5; c.beginPath(); c.moveTo(x, y); c.lineTo(x - ux * L * (.4 + H1(i * 1.7)), y - uy * L * (.4 + H1(i * 1.7))); c.stroke() }
    c.restore();
  }
