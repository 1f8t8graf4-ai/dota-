// Проба 20.11 «инструменты» (не глава): превращения формы в форму (flubber), «скелет» у белых фигурок (как Duik), баночка из Blender в наших 3 тонах.
// Ролик vpr-ru — 9:16, без голоса. Код: ep/vpr/*.js поверх общего набора глав 3–4 (ep/v200/05-kit.js, 12-cam.js, 15-props.js); flubber — vendor/flubber-0.4.2.min.js (MIT).
// Баночку рисует Blender: shorts/proba/tin_blender.py → out/vpr-tin/c/0001.png… (её кадры кладём в ролик картинками).
(function () {
  'use strict';
  const WW = 1080, HH = 1920, CX = WW / 2, CY = HH / 2, TAU = Math.PI * 2;
  let cv = null, X = null, FT = 0;
  window.CUES = window.CUES || {};
  const cue = (t0, name, gain = 1, pan = 0) => { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, pan] };
  // ---------- утилиты ----------
  const cl = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, lp = (a, b, k) => a + (b - a) * k;
  const at = (t, a, b) => cl((t - a) / (b - a));
  const ss = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k) };
  const eo = k => 1 - Math.pow(1 - cl(k), 3), ei = k => Math.pow(cl(k), 3);
  const eio = k => { k = cl(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 };
  const bo = k => { k = cl(k); const s = 1.9; return 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2) };   // easeOutBack
  const spr = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-6.2 * k) * Math.cos(10.5 * k);
  const H1 = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) };
  const hex = h => h[0] === '#' ? [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)) : h.match(/[\d.]+/g).slice(0, 3).map(Number);
  const mixc = (a, b, k) => { const A = hex(a), B = hex(b); return 'rgb(' + A.map((v, i) => Math.round(lp(v, B[i], cl(k)))).join(',') + ')' };
  const rgba = (h, a) => { const A = hex(h); return `rgba(${A[0]},${A[1]},${A[2]},${a})` };
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2))) };
  const poly = (c, p) => { c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath() };
  const fill = (c, col) => { c.fillStyle = col; c.fill() };
  const stroke = (c, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.stroke() };
  const circ = (c, x, y, r, col) => { if (r <= 0) return; c.beginPath(); c.arc(x, y, r, 0, TAU); fill(c, col) };
  const ring = (c, x, y, r, col, w) => { if (r <= 0) return; c.beginPath(); c.arc(x, y, r, 0, TAU); stroke(c, col, w) };
  const cam = (c, s, x, y, r = 0) => { c.translate(WW / 2, HH / 2); if (r) c.rotate(r); c.scale(s, s); c.translate(-x, -y) };
  const A = (c, a, fn) => { if (a <= 0) return; c.save(); c.globalAlpha *= Math.min(1, a); fn(); c.restore() };
  const FNT = o => `${o.st ? o.st + ' ' : ''}${o.w || 800} ${o.s || 40}px ${o.f || 'M'}`;   // v20.0: o.st — italic
  function tw(c, s, o = {}) { c.save(); c.font = FNT(o); c.letterSpacing = (o.ls || 0) + 'px'; const w = c.measureText(s).width - (o.ls || 0); c.restore(); return w }
  function tx(c, s, x, y, o = {}) {
    if (!s || (o.a ?? 1) <= 0) return;
    if (o.mw) { const w = tw(c, s, o); if (w > o.mw) o = { ...o, s: o.s * o.mw / w } }
    c.save(); c.font = FNT(o); c.letterSpacing = (o.ls || 0) + 'px'; const al = o.al || 'center';
    c.textAlign = al; c.textBaseline = 'middle'; c.globalAlpha *= o.a ?? 1;
    const xx = x + (al === 'center' ? (o.ls || 0) / 2 : al === 'right' ? (o.ls || 0) : 0);
    if (o.sw) { c.lineJoin = 'round'; c.strokeStyle = o.sc || '#fff'; c.lineWidth = o.sw; c.strokeText(s, xx, y) }
    c.fillStyle = o.c || '#fff'; c.fillText(s, xx, y); c.restore();
  }
  function num(c, s, x, y, o) {   // цифры в ровных клетках — не прыгают, пока считают
    c.save(); c.font = FNT(o); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = o.c; c.globalAlpha *= o.a ?? 1;
    const dw = c.measureText('0').width * 1.02, cw = ch => /[0-9]/.test(ch) ? dw : ch === ' ' ? dw * .38 : c.measureText(ch).width + dw * .05;
    let px = x - [...s].reduce((n, ch) => n + cw(ch), 0) / 2; const pos = [];
    for (const ch of s) { const w = cw(ch); if (ch !== ' ') c.fillText(ch, px + w / 2, y); pos.push(px + w / 2); px += w }
    c.restore(); return pos;
  }
  function plate(c, s, x, y, k, o = {}) {   // плашка по тексту
    if (k <= 0) return;
    const fs = o.s || 34, to = { s: fs, ls: o.ls ?? 2, w: o.w || 800, f: o.f || 'M' }, w = tw(c, s, to) + fs * 1.3, h = fs * 1.9;
    c.save(); c.translate(x, y); if (o.r) c.rotate(o.r); c.scale(k, k); c.globalAlpha *= o.a ?? 1;
    if (o.sh !== false) { rr(c, -w / 2 + 6, -h / 2 + 9, w, h, o.rad ?? h * .24); fill(c, 'rgba(0,0,0,.28)') }
    rr(c, -w / 2, -h / 2, w, h, o.rad ?? h * .24); fill(c, o.bg || '#fff');
    if (o.bd) { rr(c, -w / 2, -h / 2, w, h, o.rad ?? h * .24); stroke(c, o.bd, 3) }
    tx(c, s, 0, fs * .04, { ...to, c: o.c || '#0f172a' }); c.restore();
  }
  function glow(c, x, y, r, col, a = 1) {
    if (a <= 0 || r <= 0) return; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
    c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function vignette(c, a, col = '0,0,0') {
    if (a <= 0) return; const g = c.createRadialGradient(CX, CY * .9, 420, CX, CY, 1250); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = g; c.fillRect(0, 0, WW, HH); c.restore();
  }
  function vgrad(c, x, y, w, h, cols) { const g = c.createLinearGradient(x, y, x, y + h); cols.forEach((s, i) => g.addColorStop(i / (cols.length - 1), s)); c.fillStyle = g; c.fillRect(x, y, w, h) }
  function beam(c, x0, y0, x1, y1, w0, w1, col, a) {   // конус света от (x0,y0) к (x1,y1)
    if (a <= 0) return; const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
    c.save(); c.fillStyle = g; poly(c, [x0 + nx * w0, y0 + ny * w0, x1 + nx * w1, y1 + ny * w1, x1 - nx * w1, y1 - ny * w1, x0 - nx * w0, y0 - ny * w0]); c.fill(); c.restore();
  }
  const BLUR = {};
  function blurLayer(key, w, h, px, draw) {
    if (BLUR[key]) return BLUR[key];
    const a = mk(w, h), b = mk(w, h); draw(a.getContext('2d')); const g = b.getContext('2d'); g.filter = `blur(${px}px)`; g.drawImage(a, 0, 0); return (BLUR[key] = b);
  }
  // ================= v19.0 «Боб 2.0» (17.11): набор рисовки — по самим роликам Боба, не по словам ТЗ =================
  // У Боба: ровный тёмный фон, плоские заливки 3 тонами (база, жёсткая тень справа — темнее и холоднее, блик слева полосой),
  // тонкие светлые контуры (толстой чёрной обводки у него нет), точечный растр в тенях, косые двухцветные разрезы фона.
  const B2 = {
    bg: '#1e2138', bg2: '#262a47', bg3: '#30355a', ln: '#eef1f8', dim: '#3b4068', ink: '#0d1024', navy: '#141733',
    ind: '#4f4cab', red: '#d6334d', coral: '#ec5a57', teal: '#17cf98', cream: '#f5f1e8', ice: '#bde7f6', ice2: '#7cc4e0',
    mango: '#f6a03a', gold: '#f2b84b', steel: '#a9b3cf', mint: '#5ed39b', wood: '#7a5135', blue: '#2f6fd6', bp: '#1d3f8f'
  };
  const shd = (col, k = .3) => mixc(col, B2.navy, k);   // тень: темнее и холоднее
  const lit = (col, k = .35) => mixc(col, '#ffffff', k);
  const KY = (t, x, y, z, r = 0) => [t, x, y, Math.log(z), r];
  function lnB(c, w = 4, col = B2.ln) { c.strokeStyle = col; c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke() }
  // 3 тона внутри пути, который уже построен: (x, y, w, h) — рамка объекта; тень — правая четверть, блик — полоса слева
  function cel(c, x, y, w, h, base, o = {}) {
    c.save(); c.fillStyle = base; c.fill(); c.clip();
    const sw = o.sw ?? .25; c.fillStyle = o.sh || shd(base); c.fillRect(x + w * (1 - sw), y - 4, w * sw + 8, h + 8);
    if (o.hi !== false) { const hw = Math.max(4, w * (o.hw ?? .1)), hx = x + w * (o.hx ?? .08); rr(c, hx, y + h * (o.hy ?? .1), hw, h * (o.hh ?? .8), hw / 2); fill(c, `rgba(255,255,255,${o.ha ?? .35})`) }
    if (o.gr) grain(c, x, y, w, h, o.gr);
    c.restore();
  }
  // фигура целиком: путь pf, 3 тона, тонкий светлый контур
  function shp(c, pf, x, y, w, h, base, o = {}) { pf(c); cel(c, x, y, w, h, base, o); if (o.ln !== false) { pf(c); lnB(c, o.lw ?? 4, o.lc ?? B2.ln) } }
  const RRp = (x, y, w, h, r) => c => rr(c, x, y, w, h, r);
  // зерно на светлых плоскостях (как у Боба на бумаге и банке)
  let GRP = null;
  function grain(c, x, y, w, h, a = .18) {
    if (!GRP) { const g = mk(256, 256), q = g.getContext('2d'); for (let i = 0; i < 2600; i++) { q.fillStyle = H1(i * 1.7) > .5 ? 'rgba(0,0,0,.55)' : 'rgba(255,255,255,.6)'; q.fillRect(H1(i * 3.3) * 256, H1(i * 5.9) * 256, 1.4, 1.4) } GRP = g }
    c.save(); c.globalAlpha *= a; c.fillStyle = c.createPattern(GRP, 'repeat'); c.fillRect(x, y, w, h); c.restore();
  }
  // растровая тень 35°: от прямоугольника (x, y, w, h) длиной L, точки мельчают к концу (Кола #003)
  function castDots(c, x, y, w, h, L, o = {}) {
    const a = (o.ang ?? 35) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), dx = ca * L, dy = sa * L, st = o.st ?? 15;
    c.save(); poly(c, [x, y, x + w, y, x + w + dx, y + dy, x + w + dx, y + h + dy, x + dx, y + h + dy, x, y + h]); c.clip();
    c.beginPath();
    for (let yy = y + st / 2, r = 0; yy < y + h + dy; yy += st, r++) for (let xx = x + st / 2 + (r % 2) * st / 2; xx < x + w + dx; xx += st) {
      const u = ((xx - x - w / 2) * ca + (yy - y - h / 2) * sa) / L, rad = st * .42 * Math.pow(1 - cl(u), .8) * (o.k ?? 1);
      if (rad > .7) { c.moveTo(xx + rad, yy); c.arc(xx, yy, rad, 0, TAU) }
    }
    c.fillStyle = o.col || 'rgba(6,8,24,.55)'; c.fill(); c.restore();
  }
  function castCirc(c, x, y, R, L, o = {}) {   // растровая тень круга (торец банки, монета)
    const a = (o.ang ?? 35) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), st = o.st ?? 15;
    c.save(); c.beginPath();
    const x0 = x - R, x1 = x + R + ca * L, y0 = y - R, y1 = y + R + sa * L;
    for (let yy = y0 + st / 2, r = 0; yy < y1; yy += st, r++) for (let xx = x0 + st / 2 + (r % 2) * st / 2; xx < x1; xx += st) {
      const px = xx - x, py = yy - y, u = cl((px * ca + py * sa) / L), d = Math.hypot(px - ca * u * L, py - sa * u * L);
      if (d > R) continue; const rad = st * .42 * Math.pow(1 - u, .8) * (o.k ?? 1); if (rad > .7) { c.moveTo(xx + rad, yy); c.arc(xx, yy, rad, 0, TAU) }
    }
    c.fillStyle = o.col || 'rgba(6,8,24,.55)'; c.fill(); c.restore();
  }
  // поле точек-растра: точки растут к краю side (0 — слева, 1 — справа, 2 — сверху, 3 — снизу)
  function dotsField(c, x, y, w, h, st, col, side = 3) {
    c.beginPath();
    for (let yy = y + st / 2, r = 0; yy < y + h; yy += st, r++) for (let xx = x + st / 2 + (r % 2) * st / 2; xx < x + w; xx += st) {
      const u = side === 0 ? 1 - (xx - x) / w : side === 1 ? (xx - x) / w : side === 2 ? 1 - (yy - y) / h : (yy - y) / h, rad = st * .45 * u;
      if (rad > .6) { c.moveTo(xx + rad, yy); c.arc(xx, yy, rad, 0, TAU) }
    }
    c.fillStyle = col; c.fill();
  }
  // блики стекла: две косые полосы внутри уже стоящего clip
  function glint(c, x, y, w, h, a = .3) {
    c.save(); c.fillStyle = `rgba(255,255,255,${a})`;
    poly(c, [x + w * .12, y + h, x + w * .32, y + h, x + w * .62, y, x + w * .42, y]); c.fill();
    poly(c, [x + w * .4, y + h, x + w * .47, y + h, x + w * .77, y, x + w * .7, y]); c.fill(); c.restore();
  }
  // косой двухцветный разрез фона (в координатах экрана): линия через (px, py) под углом ang
  function bgSplit(c, c0, c1, px, py, ang) {
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = c0; c.fillRect(0, 0, WW, HH);
    const dx = Math.cos(ang), dy = Math.sin(ang), L = 3000;
    poly(c, [px - dx * L, py - dy * L, px + dx * L, py + dy * L, px + dx * L + dy * L, py + dy * L - dx * L, px - dx * L + dy * L, py - dy * L - dx * L]); fill(c, c1); c.restore();
  }
  // кирпичики-штрихи фона, как у Боба вокруг стакана (#011)
  function bricks(c, x, y, s, col = B2.dim) {
    c.save(); c.translate(x, y); c.scale(s, s); c.beginPath();
    c.moveTo(0, 0); c.lineTo(120, 0); c.moveTo(30, 26); c.lineTo(150, 26); c.moveTo(60, 0); c.lineTo(60, 26); c.moveTo(100, 26); c.lineTo(100, 52); c.moveTo(10, 52); c.lineTo(130, 52);
    lnB(c, 3, col); c.restore();
  }
  // снежинка: 6 лучей с веточками
  function flake(c, x, y, R, col, w = 6, rot = 0) {
    c.save(); c.translate(x, y); c.rotate(rot); c.beginPath();
    for (let i = 0; i < 6; i++) { const a = i * TAU / 6, ca = Math.cos(a), sa = Math.sin(a); c.moveTo(0, 0); c.lineTo(ca * R, sa * R);
      for (const f of [.45, .72]) { const bx = ca * R * f, by = sa * R * f, L = R * (f < .5 ? .26 : .2); for (const s of [-1, 1]) { const b = a + s * .75; c.moveTo(bx, by); c.lineTo(bx + Math.cos(b) * L, by + Math.sin(b) * L) } } }
    lnB(c, w, col); c.restore();
  }
  // купол Капитолия контуром (центр основания барабана (x, y), высота купола ~ 380·s)
  function domePath(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.beginPath(); c.moveTo(-220, 0); c.lineTo(220, 0); c.moveTo(-200, 0); c.lineTo(-200, -70); c.lineTo(200, -70); c.lineTo(200, 0);   // нижний ярус
    for (let i = -4; i <= 4; i++) { c.moveTo(i * 44, 0); c.lineTo(i * 44, -70) }
    c.moveTo(-170, -70); c.lineTo(-170, -110); c.lineTo(170, -110); c.lineTo(170, -70);
    c.moveTo(-160, -110); c.bezierCurveTo(-160, -250, -60, -300, 0, -305); c.bezierCurveTo(60, -300, 160, -250, 160, -110);   // купол
    c.moveTo(-90, -130); c.bezierCurveTo(-90, -230, -40, -262, 0, -265); c.moveTo(90, -130); c.bezierCurveTo(90, -230, 40, -262, 0, -265);
    c.moveTo(-28, -305); c.lineTo(-28, -360); c.lineTo(28, -360); c.lineTo(28, -305); c.moveTo(-40, -360); c.lineTo(40, -360);   // фонарь
    c.restore();
  }
  function star(c, x, y, R, col, rot = -Math.PI / 2) {
    c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? R * .42 : R, a = rot + i * Math.PI / 5; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) } c.closePath(); fill(c, col);
  }
  // капля / брызги глянцевые (сок): тело, блик
  function drop(c, x, y, r, col, ang = 0) {
    c.save(); c.translate(x, y); c.rotate(ang); c.beginPath(); c.moveTo(0, -r * 1.7); c.bezierCurveTo(r * .9, -r * .6, r, r * .2, r, r * .35); c.arc(0, r * .35, r, 0, Math.PI); c.bezierCurveTo(-r, r * .2, -r * .9, -r * .6, 0, -r * 1.7); c.closePath();
    fill(c, col); c.beginPath(); c.ellipse(-r * .35, r * .1, r * .18, r * .38, .3, 0, TAU); fill(c, 'rgba(255,255,255,.55)'); c.restore();
  }
  // осколок: многоугольник в своих координатах, 3 тона: заливка + светлая грань
  function shard(c, pts, col, ln = B2.ln) {
    poly(c, pts); fill(c, col); c.save(); c.clip(); c.fillStyle = 'rgba(255,255,255,.32)'; c.fillRect(-400, -400, 400 * .55, 800); c.restore(); poly(c, pts); lnB(c, 3, ln);
  }
  // общий передний план: снег на 3 глубинах (дальний — мелкий, передний — крупный и быстрее)
  function snow3(c, q, t, a = 1) {
    if (a <= 0) return; c.save(); c.globalAlpha *= a;
    [[.35, 26, 2, .5], [.7, 22, 3.5, .7], [1.5, 12, 6, .55]].forEach(([p, n, r, al], j) => fieldLayer(c, q, p, n, 31 + j * 17, 1200, (cc, X, Y, s) => circ(cc, X, Y, r * Math.min(1.6, Math.max(.6, s)), rgba('#eef6ff', al)), t));
    c.restore();
  }
  // для сцены 8 и концовок (из v18.5)
  const S1 = { ln: '#f1f5f9' }; let LWK = 1;
  function lnS(c, w = 6, col = S1.ln) { c.strokeStyle = col; c.lineWidth = w * LWK; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke() }
  function flipLabel(c, s0, s1, x, y, k, o0, o1, ka) {   // подпись переворачивается по горизонтальной оси (без растворения)
    if (ka <= 0) return; const a = Math.cos(Math.PI * eio(k)), sy = Math.abs(a) * ka;
    c.save(); c.translate(x, y); c.scale(ka, Math.max(.001, sy)); tx(c, a >= 0 ? s0 : s1, 0, 0, a >= 0 ? o0 : o1); c.restore();
  }
  // черты скорости на рывке камеры (в экранных координатах): по настоящей скорости камеры
  function speedLines(c, q0, q1, t) {
    const vx = (q1.x - q0.x) * q0.z * 30, vy = (q1.y - q0.y) * q0.z * 30, v = Math.hypot(vx, vy), k = cl((v - 1800) / 5000); if (k <= 0) return;
    const ux = vx / v, uy = vy / v; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.lineCap = 'round';
    for (let i = 0; i < 22; i++) { const px = H1(i * 3.7 + Math.floor(t * 30)) * 1300 - 110, py = H1(i * 5.3 + Math.floor(t * 30) * .7) * 2100 - 90, L = (180 + H1(i) * 420) * k;
      c.strokeStyle = `rgba(238,241,248,${.22 * k})`; c.lineWidth = 3 + H1(i * 9) * 5; c.beginPath(); c.moveTo(px, py); c.lineTo(px - ux * L, py - uy * L); c.stroke() }
    c.restore();
  }
  // ================= v18.5 (16.11): «один мир + камера» — камера без старт-стопа и слои с параллаксом =================
  // Камера по ключам [t, x, y, ln z, r]: монотонная кривая (Фрич–Карлсон). Старт и финиш — с места, внутри — без остановок.
  function camAt(KEYS, t) {
    const n = KEYS.length, D = KEYS[0].length;
    if (t <= KEYS[0][0]) { const k0 = KEYS[0]; return k0.v ? k0.slice(1).map((x, i) => x + k0.v[i] * (t - k0[0])) : k0.slice(1) }   // v20.1: у первого ключа со скоростью (v) камера и до него едет с ней
    if (t >= KEYS[n - 1][0]) return KEYS[n - 1].slice(1);
    let i = 0; while (KEYS[i + 1][0] < t) i++;
    const tg = (j, k) => {
      if (KEYS[j].v) return KEYS[j].v[k - 1];   // v20.1: явная скорость в ключе — глава 3 стартует на ходу, мостик «Льда» въезжает в кадр 0 с той же скоростью
      if (j <= 0 || j >= n - 1) return 0;
      const a = (KEYS[j][k] - KEYS[j - 1][k]) / (KEYS[j][0] - KEYS[j - 1][0]), b = (KEYS[j + 1][k] - KEYS[j][k]) / (KEYS[j + 1][0] - KEYS[j][0]);
      if (a * b <= 0) return 0;
      const h0 = KEYS[j][0] - KEYS[j - 1][0], h1 = KEYS[j + 1][0] - KEYS[j][0], w1 = 2 * h1 + h0, w2 = h1 + 2 * h0;
      return (w1 + w2) / (w1 / a + w2 / b);
    };
    const p1 = KEYS[i], p2 = KEYS[i + 1], h = p2[0] - p1[0], u = (t - p1[0]) / h, u2 = u * u, u3 = u2 * u, out = [];
    for (let k = 1; k < D; k++) out.push((2 * u3 - 3 * u2 + 1) * p1[k] + (u3 - 2 * u2 + u) * h * tg(i, k) + (-2 * u3 + 3 * u2) * p2[k] + (u3 - u2) * h * tg(i + 1, k));
    return out;
  }
  const camObj = v => ({ x: v[0], y: v[1], z: Math.exp(v[2]), r: v[3] });
  // p — глубина: 1 — основной план, 0.4 — дальний фон (едет и растёт медленнее), 1.6 — передний план (быстрее)
  function layer(c, cam, p, draw) {
    c.save(); c.translate(540, 960); c.rotate(cam.r * p); const s = Math.pow(cam.z, p); c.scale(s, s);
    c.translate(-cam.x * p, -cam.y * p); draw(c, s); c.restore();
  }
  // прямоугольник, который видит камера (в координатах мира, с запасом на поворот)
  function viewRect(cam) {
    const hw = 540 / cam.z, hh = 960 / cam.z, cs = Math.abs(Math.cos(cam.r)), sn = Math.abs(Math.sin(cam.r));
    const ex = hw * cs + hh * sn, ey = hw * sn + hh * cs; return { x0: cam.x - ex, x1: cam.x + ex, y0: cam.y - ey, y1: cam.y + ey };
  }
  // частицы переднего плана (снег, пыль) на слое глубины p: поле повторяется плиткой T, видны всегда, при наезде разлетаются
  function fieldLayer(c, cam, p, n, seed, T, drawOne, t) {
    const s = Math.pow(cam.z, p), lx = cam.x * p, ly = cam.y * p, hw = 560 / s, hh = 980 / s;
    c.save(); c.translate(540, 960); c.rotate(cam.r * p);
    for (let i = 0; i < n; i++) {
      const bx = H1(seed + i * 7.13) * T, by = H1(seed + i * 3.71 + 9) * T;
      const fx = bx + Math.sin(t * (.5 + H1(i + seed) * .6) + i) * 12, fy = by + t * (26 + H1(i * 2.3 + seed) * 34);
      const x0 = Math.floor((lx - hw - fx) / T), x1 = Math.floor((lx + hw - fx) / T), y0 = Math.floor((ly - hh - fy) / T), y1 = Math.floor((ly + hh - fy) / T);
      if ((x1 - x0 + 1) * (y1 - y0 + 1) > 40) continue;
      for (let a = x0; a <= x1 + 1; a++) for (let b = y0; b <= y1 + 1; b++) {
        const X = (fx + a * T - lx) * s, Y = (fy + b * T - ly) * s;
        if (X < -560 || X > 560 || Y < -980 || Y > 980) continue;
        drawOne(c, X, Y, s, i);
      }
    }
    c.restore();
  }
  // полутон точками внутри текущего пути (clip уже стоит) — тень как у Колы
  function dotsRect(c, x, y, w, h, step, r, col) {
    c.beginPath();
    for (let yy = y + step / 2, row = 0; yy < y + h; yy += step, row++) for (let xx = x + step / 2 + (row % 2) * step / 2; xx < x + w; xx += step) { c.moveTo(xx + r, yy); c.arc(xx, yy, r, 0, TAU) }
    c.fillStyle = col; c.fill();
  }
  const P0 = (cc, p) => cc.translate(540 * p - 540, 960 * p - 960);   // v20.0: слой глубины p — при камере (540, 960, 1) рисуется на своём месте
  // v20.0: вложенные миры. N = {x, y, m, r}: точка p мира B лежит в мире A в (N.x, N.y) + R(N.r)·(p − (540, 960))·m.
  // Ключ камеры переводится из B в A и обратно — так камера на стыке миров едет без остановки (общие ключи по обе стороны стыка).
  function nestK(k, N) { const dx = (k[1] - 540) * N.m, dy = (k[2] - 960) * N.m, r = N.r || 0, cr = Math.cos(r), sr = Math.sin(r);
    return [k[0], N.x + dx * cr - dy * sr, N.y + dx * sr + dy * cr, k[3] - Math.log(N.m), k[4] - r] }
  function unnestK(k, N) { const r = N.r || 0, cr = Math.cos(-r), sr = Math.sin(-r), dx = (k[1] - N.x) / N.m, dy = (k[2] - N.y) / N.m;
    return [k[0], 540 + dx * cr - dy * sr, 960 + dx * sr + dy * cr, k[3] + Math.log(N.m), k[4] + r] }
  function inNest(c, N, fn) { c.save(); c.translate(N.x, N.y); if (N.r) c.rotate(N.r); c.scale(N.m, N.m); c.translate(-540, -960); fn(c); c.restore() }
  // стык: KA кончается ключом стыка (в координатах A), KB начинается первым своим ключом после стыка (в координатах B).
  // inner = true — B вложен в A (ныряем), false — A вложен в B (отъезд). Ключи дописываются в оба списка.
  function linkK(KA, KB, N, inner) {
    const toB = inner ? k => unnestK(k, N) : k => nestK(k, N), toA = inner ? k => nestK(k, N) : k => unnestK(k, N);
    const a1 = KA[KA.length - 2], a2 = KA[KA.length - 1], b1 = KB[0];
    KB.unshift(toB(a1), toB(a2)); KA.push(toA(b1));
  }
  // общее звёздное небо в координатах экрана: одно и то же в любом мире — на стыках «небо + звёзды» миры совпадают
  function starsS(c, t, a = 1, seed = 5) {
    if (a <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha *= a;
    for (let i = 0; i < 90; i++) { const x = H1(seed + i * 3.1) * WW, y = H1(seed + i * 7.7) * HH, r = .9 + H1(i * 1.3 + seed) * 2.2, tw = .55 + .45 * Math.sin(t * (1.3 + H1(i) * 2) + i);
      c.fillStyle = `rgba(238,241,248,${.85 * tw})`; c.fillRect(x - r, y - r, r * 2, r * 2) }
    c.restore();
  }
  // параллакс относительно опорной камеры ref: при камере = ref слой лежит как основной план (p = 1)
  function layerRel(c, cam, ref, p, draw) {
    const e = { x: ref.x + (cam.x - ref.x) * p, y: ref.y + (cam.y - ref.y) * p, z: Math.exp(Math.log(ref.z) + (Math.log(cam.z) - Math.log(ref.z)) * p), r: ref.r + (cam.r - ref.r) * p };
    layer(c, e, 1, draw);
  }
  // ================= v20.0: предметы главы 3 — щит Marlboro Country, всадник, пачки, фигурки, сигарета, шляпа, дым =================
  const C3 = {
    sky0: '#4E1622', sky1: '#7C2426', sky2: '#AE3A2A', sky3: '#D2582F', sun0: '#F2B45A', sun1: '#F7CB78', mesa: '#47201A', ground: '#3A1C12', sand: '#4A2416',
    road: '#2A1612', roadL: '#5A3020', dash: '#E8B26A', steel: '#1E0E0A', fence: '#2C130C',
    paper: '#F3E6CB', dune: '#E3A866', rock: '#C2603A', dune2: '#C9824C', inkB: '#2B1A14',
    horse: '#3A1E14', horseD: '#24120C', rim: 'rgba(255,214,150,.85)', hoof: '#140A06', sad: '#7A3E1E', blank: '#E9D8B4',
    rid: '#2B1A14', boot: '#1C0F0A', hat: '#1F120D', band: '#8C5A2B', cig: '#F4EEE2', ember: '#FF6A2A',
    red: '#C8102E', redD: '#93091F', white: '#FBFAF7', side: '#D8D2C8', gold: '#C9A24A', ink: '#141010', sh: 'rgba(70,30,18,.45)',
    cream: '#EFE4CC', creamD: '#D2C4A4', foil: '#D9D2C2', rose: '#E7A9B6', rose2: '#C2697F', plum: '#3A1830', cork: '#E2C79A', filt: '#D9883A'
  };
  // нога / рука: сегменты с толщиной в узлах
  function limb(c, pts, ws, col) {
    c.fillStyle = col;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], wa = ws[i] / 2, wb = ws[i + 1] / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
      c.beginPath(); c.moveTo(a[0] + nx * wa, a[1] + ny * wa); c.lineTo(b[0] + nx * wb, b[1] + ny * wb); c.lineTo(b[0] - nx * wb, b[1] - ny * wb); c.lineTo(a[0] - nx * wa, a[1] - ny * wa); c.closePath(); c.fill();
    }
    for (const p of pts.map((p, j) => [p, ws[j]])) { c.beginPath(); c.arc(p[0][0], p[0][1], p[1] / 2, 0, TAU); c.fill() }
  }
  const PL = (c, p, col) => { poly(c, p); fill(c, col) };
  const SL = (c, p, col, w) => { c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke() };
  // v20.2: сигарета объёмом в 3 тона (бумага, тень снизу, блик сверху) от мундштука (x0, y0) к кончику (x1, y1).
  // o.tip — цвет мундштука (o.tl — его доля длины), o.ring — тонкое кольцо за ним, o.em — огонёк 0…1 (полоса и пепел на кончике, без круга), o.brand — Marlboro на бумаге
  function cig3(c, x0, y0, x1, y1, r, o = {}) {
    const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0); c.save(); c.translate(x0, y0); c.rotate(a);
    rr(c, 0, -r, L, r * 2, r * .35); fill(c, o.paper || C3.white);
    c.save(); rr(c, 0, -r, L, r * 2, r * .35); c.clip();
    c.fillStyle = 'rgba(52,26,36,.17)'; c.fillRect(0, r * .28, L, r); c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(0, -r * .72, L, r * .3);
    if (o.tip) { const tl = L * (o.tl ?? .2); c.fillStyle = o.tip; c.fillRect(-1, -r, tl + 1, r * 2); c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(-1, r * .28, tl + 1, r); c.fillStyle = 'rgba(255,255,255,.28)'; c.fillRect(-1, -r * .72, tl + 1, r * .3);
      if (o.ring) { c.fillStyle = o.ring; c.fillRect(tl, -r, Math.max(1, r * .3), r * 2) } }
    if (o.brand) tx(c, 'Marlboro', L * (o.tl ?? .2) + r * 2.6, 0, { f: 'P', w: 700, st: 'italic', s: r * .95, c: rgba('#B0122C', .8), al: 'left' });
    if (o.em !== undefined) { const el = Math.min(L * .13, r * 1.9) * (o.ek ?? 1), em = cl(o.em);
      c.fillStyle = mixc('#5a4842', C3.ember, em); c.fillRect(L - el, -r, el * .72, r * 2);
      if (em > .15) { c.fillStyle = rgba('#FFD08A', .7 * em); c.fillRect(L - el * .82, -r * .38, el * .36, r * .76) }
      c.fillStyle = '#A9A2A0'; c.beginPath(); c.moveTo(L - el * .3, -r); c.lineTo(L, -r * .55); c.lineTo(L, r * .55); c.lineTo(L - el * .3, r); c.closePath(); c.fill() }
    c.restore(); c.restore();
  }
  const RCIG = [27, -219.5, 44, -216];   // сигарета всадника: мундштук у губ → кончик (координаты всадника)
  // всадник на коне (смотрят вправо), земля — y 0; o.ember — огонёк сигареты 0..1 (живой), o.chest — функция поверх груди (рентген)
  function horseRider(c, x, y, s, o = {}) {
    const T = C3; c.save(); c.translate(x, y); c.scale(s, s);
    const hoofAt = p => PL(c, [p[0] - 8, p[1] - 5, p[0] + 9, p[1] - 5, p[0] + 11, p[1] + 4, p[0] - 9, p[1] + 4], T.hoof);
    limb(c, [[42, -86], [40, -47], [38, -15], [41, -4]], [20, 13, 10, 10], T.horseD); hoofAt([42, 0]);
    limb(c, [[-62, -100], [-92, -54], [-86, -16], [-82, -4]], [34, 14, 10, 10], T.horseD); hoofAt([-81, 0]);
    const sw = Math.sin((o.t || 0) * 2.1) * 3;   // хвост чуть качается
    c.beginPath(); c.moveTo(-126, -146); c.bezierCurveTo(-156, -140, -170 + sw, -110, -166 + sw, -70); c.bezierCurveTo(-164 + sw, -52, -170 + sw * 1.5, -40, -176 + sw * 2, -30);
    c.bezierCurveTo(-158 + sw, -36, -148, -56, -146, -78); c.bezierCurveTo(-144, -104, -136, -122, -118, -128); c.closePath(); fill(c, T.horseD);
    c.beginPath(); c.ellipse(-24, -114, 96, 36, 0, 0, TAU); fill(c, T.horse); circ(c, 50, -114, 34, T.horse); circ(c, -98, -121, 36, T.horse);
    c.beginPath(); c.moveTo(-134, -124); c.bezierCurveTo(-137, -100, -130, -74, -118, -56); c.lineTo(-96, -64); c.bezierCurveTo(-84, -86, -76, -104, -72, -122); c.closePath(); fill(c, T.horse);
    c.beginPath(); c.moveTo(18, -144); c.bezierCurveTo(30, -178, 64, -212, 100, -208); c.lineTo(99, -229); c.lineTo(108, -211); c.lineTo(112, -227); c.lineTo(118, -206);
    c.bezierCurveTo(127, -203, 133, -197, 139, -187); c.bezierCurveTo(149, -171, 158, -158, 166, -146); c.quadraticCurveTo(174, -136, 166, -129); c.lineTo(156, -128);
    c.quadraticCurveTo(150, -128, 149, -134); c.bezierCurveTo(140, -138, 131, -145, 125, -152); c.bezierCurveTo(115, -158, 110, -166, 111, -175);
    c.bezierCurveTo(98, -160, 88, -136, 86, -106); c.quadraticCurveTo(86, -86, 66, -80); c.lineTo(40, -84); c.closePath(); fill(c, T.horse);
    limb(c, [[60, -88], [78, -50], [67, -24], [74, -12]], [22, 14, 10, 10], T.horse);
    c.save(); c.translate(76, -8); c.rotate(-.55); PL(c, [-8, -5, 9, -5, 11, 4, -9, 4], T.hoof); c.restore();
    limb(c, [[-96, -100], [-116, -52], [-110, -16], [-106, -4]], [38, 15, 11, 11], T.horse); hoofAt([-105, 0]);
    c.beginPath(); c.moveTo(102, -210); c.bezierCurveTo(64, -214, 30, -180, 16, -146); c.bezierCurveTo(24, -150, 28, -154, 32, -160); c.bezierCurveTo(36, -158, 40, -160, 44, -168);
    c.bezierCurveTo(50, -168, 54, -172, 58, -180); c.bezierCurveTo(64, -181, 70, -186, 74, -192); c.bezierCurveTo(82, -194, 88, -198, 92, -202); c.bezierCurveTo(96, -201, 100, -202, 102, -210); c.closePath(); fill(c, T.horseD);
    PL(c, [116, -206, 132, -199, 125, -190], T.horseD);
    SL(c, [-130, -146, -104, -157, -72, -150, -40, -146, -14, -148], T.rim, 3);
    c.beginPath(); c.moveTo(100, -210); c.bezierCurveTo(66, -214, 36, -186, 26, -160); c.strokeStyle = T.rim; c.lineWidth = 3; c.stroke();
    SL(c, [120, -204, 134, -196, 148, -172, 162, -152], T.rim, 3); SL(c, [-150, -130, -165, -92], T.rim, 2.5);
    circ(c, 130, -184, 3.2, T.rim); circ(c, 160, -138, 2.6, T.horseD);
    PL(c, [-30, -150, 24, -150, 28, -108, -26, -108], T.blank); c.fillStyle = T.red; c.fillRect(-28, -126, 54, 7); c.fillRect(-27, -116, 52, 4);
    c.beginPath(); c.moveTo(-26, -150); c.bezierCurveTo(-20, -164, -8, -160, 4, -156); c.bezierCurveTo(14, -154, 20, -160, 24, -170); c.lineTo(30, -166); c.bezierCurveTo(28, -152, 24, -146, 20, -142); c.lineTo(-24, -142); c.closePath(); fill(c, T.sad);
    SL(c, [46, -176, 102, -160, 150, -136], T.horseD, 2.4);
    limb(c, [[4, -158], [28, -134], [24, -96]], [24, 16, 13], T.rid); PL(c, [14, -102, 36, -100, 44, -90, 14, -90], T.boot); c.fillStyle = T.horseD; c.fillRect(16, -90, 26, 3);
    c.beginPath(); c.moveTo(-6, -160); c.bezierCurveTo(-10, -178, -8, -196, -2, -208); c.quadraticCurveTo(6, -216, 16, -214); c.lineTo(24, -211); c.bezierCurveTo(31, -204, 32, -192, 28, -180); c.bezierCurveTo(24, -172, 22, -166, 20, -160); c.closePath(); fill(c, T.rid);
    if (o.chest) o.chest(c);
    PL(c, [8, -214, 27, -212, 20, -200], T.red);
    c.beginPath(); c.moveTo(9, -213); c.bezierCurveTo(3, -219, 3, -230, 8, -236); c.lineTo(25, -236); c.lineTo(27, -231); c.lineTo(32, -226); c.lineTo(28, -224); c.lineTo(29, -220); c.lineTo(27, -216); c.bezierCurveTo(23, -213, 18, -213, 15, -210); c.closePath(); fill(c, T.rid);
    c.beginPath(); c.moveTo(4, -236); c.bezierCurveTo(4, -250, 6, -256, 10, -258); c.quadraticCurveTo(17, -252, 24, -258); c.bezierCurveTo(28, -256, 30, -250, 30, -236); c.closePath(); fill(c, T.hat);
    c.beginPath(); c.moveTo(-14, -240); c.quadraticCurveTo(-8, -234, 4, -236); c.lineTo(30, -236); c.quadraticCurveTo(42, -234, 48, -242); c.quadraticCurveTo(44, -230, 30, -230); c.lineTo(4, -230); c.quadraticCurveTo(-10, -230, -14, -240); c.closePath(); fill(c, T.hat);
    c.fillStyle = T.band; c.fillRect(4, -240, 26, 4);
    limb(c, [[14, -205], [25, -184], [45, -176]], [11, 9, 8], T.rid);
    const em = o.ember ?? 0;   // v20.2: сигарета во рту — бумага, пепел и огонёк полосой на кончике (не круг поверх головы)
    if (em > 0) circ(c, RCIG[2] - 1.5, RCIG[3], 2.4 + em * 2.2, rgba('#FFB060', .24 * em));
    cig3(c, RCIG[0], RCIG[1], RCIG[2], RCIG[3], 1.7, { em: .45 + .55 * em });
    SL(c, [28, -204, 27, -184, 21, -164], T.rim, 2.2); SL(c, [30, -236, 4, -236], T.rim, 1.6);
    c.restore();
  }
  // растровая тень под 35° внутри многоугольника (как на наброске)
  function rasterPoly(c, pts, col, step, r) {
    c.save(); poly(c, pts); c.clip(); const xs = pts.filter((_, i) => i % 2 === 0), ys = pts.filter((_, i) => i % 2 === 1);
    const x0 = Math.min(...xs) - step, x1 = Math.max(...xs) + step, y0 = Math.min(...ys) - step, y1 = Math.max(...ys) + step, ca = Math.cos(.61), sa = Math.sin(.61);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.hypot(x1 - x0, y1 - y0) / 2 + step; c.beginPath();
    for (let u = -R; u < R; u += step) for (let v = -R; v < R; v += step) { const px = cx + u * ca - v * sa, py = cy + u * sa + v * ca; if (px < x0 || px > x1 || py < y0 || py > y1) continue; c.moveTo(px + r, py); c.arc(px, py, r, 0, TAU) }
    c.fillStyle = col; c.fill(); c.restore();
  }
  // пачка Marlboro по эталону: лицо, левый бок темнее, крыша-шеврон, золотой герб «PM», надпись; o.lid — крышка открыта 0..1, o.sub — подпись, o.glow — имя светится
  function mPack(c, x, y, w, h, side, o = {}) {
    const T = C3, dz = side, sy = h * .04;
    if (o.shadow !== false) rasterPoly(c, [x + w, y + h * .1, x + w + h * .15, y + h * .2, x + w + h * .15, y + h * 1.08, x + w * .2, y + h * 1.08, x, y + h], o.shc || T.sh, 8, 2.3);
    PL(c, [x - dz, y + sy, x, y, x, y + h, x - dz, y + h - sy], T.side);
    PL(c, [x - dz, y + sy, x, y, x, y + h * .36, x - dz, y + h * .36 - sy * .4], T.redD);
    c.fillStyle = T.white; c.fillRect(x, y, w, h);
    PL(c, [x, y, x + w, y, x + w, y + h * .36, x + w / 2, y + h * .13, x, y + h * .36], T.red);
    SL(c, [x, y + h * .2, x + w * .18, y + h * .2], 'rgba(0,0,0,.12)', 2); SL(c, [x + w * .82, y + h * .2, x + w, y + h * .2], 'rgba(0,0,0,.12)', 2);
    const gx = x + w / 2, gy = y + h * .17;
    c.beginPath(); c.ellipse(gx, gy, w * .1, w * .12, 0, 0, TAU); fill(c, T.gold); c.beginPath(); c.ellipse(gx, gy, w * .065, w * .085, 0, 0, TAU); fill(c, T.white);
    tx(c, 'PM', gx, gy + 1, { f: 'P', w: 700, s: Math.round(w * .07), c: T.red });
    SL(c, [gx - w * .12, gy + w * .05, gx - w * .17, gy - w * .06], T.gold, 3); SL(c, [gx + w * .12, gy + w * .05, gx + w * .17, gy - w * .06], T.gold, 3);
    c.save(); c.translate(gx, y + h * .56); c.scale(1, 1.18); tx(c, 'Marlboro', 0, -h * .02, { f: 'P', w: 700, s: Math.round(w * .2), c: o.glow ? mixc(T.ink, T.red, o.glow) : T.ink }); c.restore();
    tx(c, o.sub || 'FILTER CIGARETTES', gx, y + h * .67, { f: 'M', w: 800, s: Math.round(w * .055), c: T.ink, mw: w * .86 });
    if (o.glow) { c.fillStyle = rgba('#FFD27A', .55 * o.glow); c.fillRect(x + w * .1, y + h * .62, w * .8 * o.glow, 5) }   // имя загорается: цвет и черта, без свечения
    SL(c, [x, y + 2, x, y + h - 2], 'rgba(255,255,255,.7)', 2);
  }
  // мягкая пачка 1920-х: кремовая, Marlboro курсивом, Mild as May; сверху сигареты с красным кончиком
  function softPack(c, x, y, w, h, side, o = {}) {
    const T = C3; if (o.shadow !== false) rasterPoly(c, [x + w, y + h * .1, x + w + h * .15, y + h * .2, x + w + h * .15, y + h * 1.06, x + w * .2, y + h * 1.06, x, y + h], o.shc || T.sh, 8, 2.3);
    if (o.cigs !== false) [[.33, .25], [.5, .32], [.67, .22]].forEach(([u, hh]) => {   // v20.2: длинные тонкие сигареты из надорванной фольги, красный мундштук и золотое кольцо (не спички)
      const cw = w * .074, cx = x + w * u, top = y - h * hh + h * .05, L = h * hh + 14;
      c.save(); rr(c, cx - cw / 2, top, cw, L, cw * .2); c.clip(); c.fillStyle = T.white; c.fillRect(cx - cw / 2, top, cw, L);
      c.fillStyle = 'rgba(52,26,36,.16)'; c.fillRect(cx + cw * .14, top, cw * .4, L); c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(cx - cw * .38, top, cw * .16, L);
      c.fillStyle = T.red; c.fillRect(cx - cw / 2, top, cw, h * .05); c.fillStyle = T.redD; c.fillRect(cx + cw * .14, top, cw * .4, h * .05);
      c.fillStyle = T.gold; c.fillRect(cx - cw / 2, top + h * .05, cw, Math.max(1.5, h * .008)); c.restore() });
    PL(c, [x - side, y + 8, x, y + 2, x, y + h, x - side, y + h - 8], T.creamD);
    c.beginPath(); c.moveTo(x, y + 6); [[.18, 0], [.3, 10], [.46, 2], [.62, 12], [.8, 3], [1, 8]].forEach(([u, d]) => c.lineTo(x + w * u, y + d)); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); fill(c, T.cream);
    c.fillStyle = T.foil; c.fillRect(x, y + 14, w, 10);
    c.strokeStyle = T.gold; c.lineWidth = 2.5; c.strokeRect(x + w * .063, y + h * .12, w * .874, h * .83);
    { const gx = x + w / 2, gy = y + h * .33, R = w * .085;   // v20.2: герб ар-деко — золотой овал «PM» в лавровых ветках (было — дуги, читались как значок вайфая)
      c.beginPath(); c.ellipse(gx, gy, R, R * 1.25, 0, 0, TAU); c.lineWidth = Math.max(2, w * .012); c.stroke();
      tx(c, 'PM', gx, gy + R * .06, { f: 'P', w: 700, st: 'italic', s: Math.round(R * 1.05), c: T.gold });
      for (const s of [-1, 1]) for (let k = 0; k < 4; k++) { const an = Math.PI / 2 + s * (.62 + k * .42), lx = gx + Math.cos(an) * R * 1.62, ly = gy + Math.sin(an) * R * 1.75;
        c.save(); c.translate(lx, ly); c.rotate(an + s * Math.PI / 2 * .9); c.beginPath(); c.ellipse(0, 0, R * .3, R * .12, 0, 0, TAU); fill(c, T.gold); c.restore() } }
    tx(c, 'Marlboro', x + w / 2, y + h * .56, { f: 'P', w: 700, st: 'italic', s: Math.round(w * .2), c: o.glow ? mixc(T.ink, T.red, o.glow) : T.ink });
    tx(c, 'Mild as May', x + w / 2, y + h * .69, { f: 'P', w: 400, st: 'italic', s: Math.round(w * .1), c: T.ink });
    if (o.glow) { c.fillStyle = rgba('#FFD27A', .55 * o.glow); c.fillRect(x + w * .14, y + h * .62, w * .72 * o.glow, 5) }
    SL(c, [x, y + 8, x, y + h - 2], 'rgba(255,255,255,.6)', 2);
  }
  // v20.2: жёсткая пачка с крышкой Flip-Top на петле сзади: lid 0…1 — крышка откидывается назад (лицевая сторона сжимается к петле, потом видна изнанка),
  // внутри — задняя стенка, золотой воротник и пробковые кончики сигарет
  function flipPack(c, x, top, w, h, lid, o = {}) {
    const phi = lid * 1.98, cutY = top + h * .3, L = h * .3;
    if (lid <= 0) { mPack(c, x, top, w, h, w * .18, o); return }
    if (phi > Math.PI / 2) { const hh = L * -Math.cos(phi); PL(c, [x - w * .18, top + 2 - hh * .9, x, top - hh, x, top, x - w * .18, top + 2], '#C8B370'); c.fillStyle = '#F4EEDD'; c.fillRect(x, top - hh, w, hh); c.fillStyle = '#D9C27A'; c.fillRect(x + w * .08, top - hh + hh * .18, w * .84, hh * .64) }
    c.fillStyle = '#E6E0D2'; c.fillRect(x, top + 3, w, h * .32);
    for (let i = 0; i < 5; i++) { const cx = x + w * (.14 + i * .18), ct = top + h * .1 - h * .12 * ei(lid); rr(c, cx - w * .08, ct, w * .16, h * .4, 4); fill(c, C3.white); c.fillStyle = C3.cork; c.fillRect(cx - w * .08, ct, w * .16, h * .14) }
    c.save(); c.beginPath(); c.rect(x - w, cutY, w * 3, h * 2); c.clip(); mPack(c, x, top, w, h, w * .18, o); c.restore();
    PL(c, [x - w * .18, top + 6, x, cutY, x - w * .18, cutY + 4], C3.redD);
    c.fillStyle = '#D9C27A'; c.fillRect(x + w * .05, cutY - h * .07, w * .9, h * .07 + 2); c.fillStyle = '#B89B55'; c.fillRect(x + w * .05, cutY - 3, w * .9, 5);
    if (phi < Math.PI / 2) { const k2 = Math.cos(phi); c.save(); c.translate(0, top); c.scale(1, Math.max(.001, k2)); c.translate(0, -top); c.beginPath(); c.rect(x - w, top - 10, w * 3, L + 10); c.clip(); mPack(c, x, top, w, h, w * .18, { ...o, shadow: false }); c.restore() }
  }
  // небо заката полосами, облака, одно солнце, столовые горы (дальний план кадра 0)
  // nk — ночь 0…1 (трасса фразы 8: закат → ночь). При nk = 0 кадр 0 — как был. Края раздвинуты: камера отъезжает и летит вдоль трассы
  const NIGHT = { sky0: '#0B0F2A', sky1: '#10153A', sky2: '#1A1A44', sky3: '#3A1E3C', mesa: '#120F22', ground: '#18183A' };
  function desertFar(c, nk = 0) {
    const T = C3, M = (a, b) => nk > 0 ? mixc(a, b, nk) : a, X0 = -60000, XW = 120000;
    c.fillStyle = M(T.sky0, NIGHT.sky0); c.fillRect(X0, -90000, XW, 90470);
    if (nk > 0) { [[-300, -2400], [-2400, -6000], [-6000, -90000]].forEach(([y0, y1], i) => { c.fillStyle = mixc(T.sky0, NIGHT.sky0, Math.min(1, nk * (1.3 + i * .5))); c.fillRect(X0, y1, XW, y0 - y1) }) }
    c.fillStyle = M(T.sky1, NIGHT.sky1); c.fillRect(X0, 470, XW, 360); c.fillStyle = M(T.sky2, NIGHT.sky2); c.fillRect(X0, 830, XW, 290); c.fillStyle = M(T.sky3, NIGHT.sky3); c.fillRect(X0, 1120, XW, 230);
    if (nk < 1) A(c, 1 - nk, () => { c.fillStyle = '#6A2232'; c.fillRect(70, 128, 420, 14); c.fillRect(170, 162, 260, 9); c.fillRect(640, 210, 380, 12); c.fillRect(-640, 300, 420, 12); c.fillRect(1200, 90, 380, 12); c.fillStyle = '#C24A2C'; c.fillRect(560, 1060, 300, 10) });
    const sy = 1350 + 320 * nk; c.beginPath(); c.arc(540, sy, 236, Math.PI, 0); fill(c, T.sun0); c.beginPath(); c.arc(540, sy, 168, Math.PI, 0); fill(c, T.sun1);   // солнце садится
    const mc = M(T.mesa, NIGHT.mesa);
    for (let rep = -6; rep <= 6; rep++) { const o = rep * 4100; c.save(); c.translate(o, 0);
      PL(c, [-1500, 1350, -1500, 1220, -900, 1220, -860, 1260, -500, 1260, -470, 1196, 110, 1196, 150, 1240, 250, 1240, 296, 1350], mc);
      PL(c, [800, 1350, 836, 1262, 880, 1262, 904, 1222, 1500, 1222, 1540, 1180, 2100, 1180, 2600, 1350], mc); c.restore() }
    c.fillStyle = M(T.ground, NIGHT.ground); c.fillRect(X0, 1349, XW, 60000);   // земля дальнего плана — без чёрной щели, когда планы расходятся
  }
  function desertGround(c, t, nk = 0, q = null) {
    const T = C3, M = (a, b) => nk > 0 ? mixc(a, b, nk) : a, v = q ? viewRect(q) : { x0: -1500, x1: 2600 }, X0 = Math.max(-60000, v.x0 - 200), X1 = Math.min(60000, v.x1 + 200), XW = X1 - X0;
    c.fillStyle = M(T.ground, NIGHT.ground); c.fillRect(X0, 1350, XW, 2600);
    c.fillStyle = M(T.road, '#0E0B1C'); c.fillRect(X0, 1376, XW, 64); c.fillStyle = M(T.roadL, '#2A2440'); c.fillRect(X0, 1376, XW, 4); c.fillRect(X0, 1436, XW, 4);
    c.fillStyle = M(T.dash, '#6A5A48'); for (let dx = Math.floor((X0 + 1480) / 120) * 120 - 1480; dx < X1; dx += 120) c.fillRect(dx, 1406, 64, 5);
    c.fillStyle = M(T.sand, NIGHT.ground); c.fillRect(X0, 1440, XW, 2600);
    rasterPoly(c, [210, 1380, 870, 1380, 700, 1700, 40, 1700], 'rgba(18,8,5,.38)', 19, 4.8);
    c.fillStyle = M(T.fence, '#0E0B1C'); for (let fx = -594; fx < 260; fx += 50) c.fillRect(fx, 1300, 11, 80); c.fillRect(-600, 1316, 866, 5); c.fillRect(-600, 1344, 866, 5);
  }
  // щит: стойки, рама, лампы; плакат рисует poster(); o.lamp — ночная лампа горит 0..1
  const BB = { x: 56, y: 360, w: 968, h: 630 };
  function billboardFrame(c, o = {}) {
    const ST = C3.steel, { x, y, w, h } = BB;
    c.fillStyle = ST; c.fillRect(286, y + h + 10, 24, 1378 - (y + h + 10)); c.fillRect(770, y + h + 10, 24, 1378 - (y + h + 10));
    SL(c, [298, 1070, 240, 1004], ST, 8); SL(c, [298, 1070, 356, 1004], ST, 8); SL(c, [782, 1070, 724, 1004], ST, 8); SL(c, [782, 1070, 840, 1004], ST, 8); c.fillRect(286, 1214, 508, 8);
    c.fillRect(x - 12, y - 12, w + 24, h + 24); c.fillRect(x - 12, y + h + 12, w + 24, 10);
    [x + 180, x + 480, x + 780].forEach(lx => { SL(c, [lx, y - 12, lx + 10, y - 60, lx + 54, y - 78], ST, 6); PL(c, [lx + 40, y - 92, lx + 80, y - 82, lx + 72, y - 62, lx + 34, y - 72], ST);
      PL(c, [lx + 36, y - 72, lx + 72, y - 62, lx + 70, y - 58, lx + 36, y - 67], o.lamp ? mixc('#5A3020', '#fff3c4', o.lamp) : '#5A3020') });
  }
  // плакат Marlboro Country: свой день, всадник, пачка; peelPx — насколько отогнут правый нижний угол, lamp — ночью свет лампы сверху
  function poster(c, t, o = {}) {
    const T = C3, { x: X, y: Y, w: W, h: H } = BB;
    c.save(); c.beginPath(); c.rect(X, Y, W, H); c.clip();
    const sz = o.peelPx ?? 210, cx0 = X + W, cy0 = Y + H;   // отогнутый угол: 210 px — как в кадре 0
    if (sz > 0) { c.save(); c.beginPath(); c.moveTo(cx0, cy0); c.lineTo(cx0, cy0 - sz); c.lineTo(cx0 - sz, cy0); c.closePath(); c.clip(); decoLayer(c, t); c.restore();
      c.beginPath(); c.moveTo(X, Y); c.lineTo(X + W, Y); c.lineTo(cx0, cy0 - sz); c.lineTo(cx0 - sz, cy0); c.lineTo(X, Y + H); c.closePath(); c.clip() }
    c.fillStyle = T.paper; c.fillRect(X, Y, W, H); c.fillStyle = T.dune; c.fillRect(X, Y + H * .58, W, H * .42);
    PL(c, [X, Y + H * .58, X, Y + H * .42, X + 120, Y + H * .42, X + 150, Y + H * .5, X + 330, Y + H * .5, X + 370, Y + H * .58], T.rock);
    PL(c, [X + 500, Y + H * .58, X + 540, Y + H * .47, X + 620, Y + H * .47, X + 648, Y + H * .4, X + 760, Y + H * .4, X + 820, Y + H * .58], T.rock);
    c.fillStyle = T.dune2; c.fillRect(X, Y + H * .8, W, H * .2);
    tx(c, 'Marlboro Country', X + 40, Y + 84, { f: 'P', w: 700, st: 'italic', s: 66, c: T.inkB, al: 'left' });
    if (o.cal) o.cal(c);
    horseRider(c, X + 290, Y + H * .94, 1.5, { t, ember: o.ember || 0, chest: o.chest });
    mPack(c, X + 676, Y + 176, 190, 282, 34, { glow: o.glow || 0 });
    if (o.over) o.over(c);
    if (o.night) { c.fillStyle = `rgba(14,18,46,${.55 * o.night})`; c.fillRect(X, Y, W, H); if (o.lamp) { c.globalCompositeOperation = 'lighter'; glow(c, X + W * .4, Y - 40, 900, '#ffe9b0', .32 * o.lamp); c.globalCompositeOperation = 'source-over' } }
    c.restore();
    if (sz > 0) {   // отогнутый лоскут — оборот бумаги
      c.save(); c.beginPath(); c.rect(X - 400, Y - 400, W + 800, H + 800); c.clip();
      const fx = cx0 - sz * .74, fy = cy0 - sz * .62; PL(c, [cx0, cy0 - sz, cx0 - sz, cy0, fx, fy], '#EFE3CC'); PL(c, [cx0, cy0 - sz, fx, fy, cx0 - sz * .6, cy0 - sz * .66], 'rgba(0,0,0,.16)');
      SL(c, [cx0, cy0 - sz, cx0 - sz, cy0], 'rgba(255,255,255,.55)', 3); c.restore();
    }
  }
  // коридор арок ар-деко вокруг страницы журнала (мир 2). Координаты страницы: 1080×1920, центр (540, 960); арка k — в 1,55^k раз больше страницы.
  // В мире 1 коридор рисуется в точке схода V с масштабом M1 — камера ныряет в него, и мир 2 продолжает тот же кадр (вложенный мир).
  const V1 = { x: 912, y: 868 }, M1 = .03, ARF = 1.55;
  const ROSE = ['#E7A9B6', '#D88A9C', '#F1C3CC', '#C97489'];
  function archPath(c, cx, cy, w, h) { const r = w / 2; c.beginPath(); c.moveTo(cx - r, cy + h / 2); c.lineTo(cx - r, cy - h / 2 + r); c.arc(cx, cy - h / 2 + r, r, Math.PI, 0); c.lineTo(cx + r, cy + h / 2); c.closePath() }
  function corridor(c, t, kmax = 10, kmin = 1) {   // в координатах страницы; дальние арки (большие) — первыми
    c.fillStyle = ROSE[0]; c.fillRect(540 - 1080 * Math.pow(ARF, kmax + 1), 960 - 1920 * Math.pow(ARF, kmax + 1), 2160 * Math.pow(ARF, kmax + 1), 3840 * Math.pow(ARF, kmax + 1));
    for (let k = kmax; k >= kmin; k--) {
      const f = Math.pow(ARF, k), w = 1180 * f, h = 2100 * f, cy = 960 + 40 * f;
      archPath(c, 540, cy, w, h); fill(c, ROSE[k % 4]);
      archPath(c, 540, cy, w * .9, h * .93); fill(c, ROSE[(k + 1) % 4]);
      c.save(); archPath(c, 540, cy, w * .9, h * .93); c.clip(); c.strokeStyle = C3.gold; c.lineWidth = 5 * f;
      for (let q = 0; q < 5; q++) { const a0 = Math.PI * (1.12 + q * .19); c.beginPath(); c.moveTo(540, cy - h * .465 + w * .45); c.lineTo(540 + Math.cos(a0) * w * .45, cy - h * .465 + w * .45 + Math.sin(a0) * w * .45); c.stroke() }   // веер в арке
      c.restore();
      archPath(c, 540, cy, w * .9, h * .93); c.strokeStyle = C3.gold; c.lineWidth = 7 * f; c.stroke();
      archPath(c, 540, cy, w * .84, h * .885); c.lineWidth = 3 * f; c.stroke();
    }
  }
  // в мире 1: тот же коридор, уменьшенный в точку схода V1
  function decoLayer(c, t) { c.save(); c.translate(V1.x, V1.y); c.scale(M1, M1); c.translate(-540, -960); w2World(c, t); c.restore() }   // тот же мир 2 целиком — на стыке кадры совпадают
  // белая фигурка, как у Боба: m — мужчина (широкие плечи), иначе женщина (платье, шляпка-колокол); turn — поворот спиной 0..1
  function fig(c, x, y, s, o = {}) {
    c.save(); c.translate(x, y); c.scale(s * (o.dir || 1), s); const col = o.col || '#F4F1EA', sh = shd(col, .25);
    if (o.m) { rr(c, -34, -150, 68, 92, 26); fill(c, col); c.fillStyle = sh; c.fillRect(14, -146, 20, 86); limb(c, [[-14, -64], [-16, -4]], [24, 18], col); limb(c, [[14, -64], [18, -4]], [24, 18], col);
      circ(c, 0, -178, 26, col); if (o.hat) { c.beginPath(); c.ellipse(0, -196, 40, 8, 0, 0, TAU); fill(c, '#2b2f55'); rr(c, -22, -222, 44, 26, 8); fill(c, '#2b2f55') } }
    else { c.beginPath(); c.moveTo(-18, -140); c.lineTo(18, -140); c.lineTo(36, -38); c.lineTo(-36, -38); c.closePath(); fill(c, col); limb(c, [[-10, -40], [-12, -2]], [14, 12], col); limb(c, [[10, -40], [12, -2]], [14, 12], col);
      circ(c, 0, -164, 22, col); c.beginPath(); c.arc(0, -168, 26, Math.PI, 0); c.lineTo(30, -164); c.lineTo(-30, -164); c.closePath(); fill(c, o.hc || C3.rose2) }
    c.restore();
  }
  // сигарета от (x0, y0) к (x1, y1): белая бумага, кончик со стороны x1; o.tip — цвет кончика, o.filt — фильтр со стороны x0
  function cigar(c, x0, y0, x1, y1, r, o = {}) {
    const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0); c.save(); c.translate(x0, y0); c.rotate(a);
    rr(c, 0, -r, L, r * 2, r * .4); fill(c, o.paper || C3.white); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(0, r * .35, L, r * .65);
    if (o.filt) { c.fillStyle = o.filt; c.fillRect(0, -r, L * (o.fl || .28), r * 2) }
    if (o.tip) { c.fillStyle = o.tip; c.fillRect(L - L * (o.tl || .14), -r, L * (o.tl || .14), r * 2) }
    if (o.ember) { c.fillStyle = mixc('#5a4a44', C3.ember, o.ember); c.fillRect(L - r * .6, -r, r * .6, r * 2) }
    c.restore();
  }
  // ковбойская шляпа (центр полей (x, y))
  function cHat(c, x, y, s, col = C3.hat) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.beginPath(); c.moveTo(-26, -6); c.bezierCurveTo(-26, -34, -18, -46, -8, -50); c.quadraticCurveTo(0, -42, 8, -50); c.bezierCurveTo(18, -46, 26, -34, 26, -6); c.closePath(); fill(c, col);
    c.beginPath(); c.moveTo(-62, -14); c.quadraticCurveTo(-46, 0, -26, -4); c.lineTo(26, -4); c.quadraticCurveTo(46, 0, 62, -14); c.quadraticCurveTo(54, 8, 26, 6); c.lineTo(-26, 6); c.quadraticCurveTo(-54, 8, -62, -14); c.closePath(); fill(c, col);
    c.fillStyle = C3.band; c.fillRect(-26, -14, 52, 6); SL(c, [-24, -46, -8, -50], C3.rim, 2); c.restore();
  }
  // струйка дыма (v20.2): гладкая лента по точкам (Катмулл–Ром), ширина растёт кверху, прозрачность тает градиентом вдоль ленты; два слоя — мягкий край и плотная середина
  function smoothPts(pts, nPer = 6) {
    const n = pts.length / 2, P = []; for (let i = 0; i < n; i++) P.push([pts[i * 2], pts[i * 2 + 1]]); if (n < 2) return P;
    const S = []; for (let i = 0; i < n - 1; i++) { const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n - 1, i + 2)];
      for (let k = 0; k < nPer; k++) { const u = k / nPer, u2 = u * u, u3 = u2 * u; S.push([0, 1].map(j => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3))) } }
    S.push(P[n - 1]); return S;
  }
  function ribbon(c, S, hw, style) {   // лента вокруг осевой S, полуширина hw(u), заливка style
    const m = S.length; if (m < 2) return; const Lp = [], Rp = [];
    for (let i = 0; i < m; i++) { const a0 = S[Math.max(0, i - 1)], a1 = S[Math.min(m - 1, i + 1)], dx = a1[0] - a0[0], dy = a1[1] - a0[1], d = Math.hypot(dx, dy) || 1, h = hw(i / (m - 1));
      Lp.push([S[i][0] - dy / d * h, S[i][1] + dx / d * h]); Rp.push([S[i][0] + dy / d * h, S[i][1] - dx / d * h]) }
    const E = Lp.concat(Rp.reverse()); c.beginPath(); c.moveTo(E[0][0], E[0][1]);
    for (let i = 1; i < E.length - 1; i++) c.quadraticCurveTo(E[i][0], E[i][1], (E[i][0] + E[i + 1][0]) / 2, (E[i][1] + E[i + 1][1]) / 2);
    c.lineTo(E[E.length - 1][0], E[E.length - 1][1]); c.closePath(); c.fillStyle = style; c.fill();
  }
  function smokeLine(c, pts, w, col, a = 1, o = {}) {
    if (a <= 0 || pts.length < 4) return; const S = smoothPts(pts), A = S[0], B = S[S.length - 1];
    const g = (k, w0) => { const gr = c.createLinearGradient(A[0], A[1], B[0], B[1]); gr.addColorStop(0, rgba(col, k * (o.a0 ?? .9))); gr.addColorStop(.45, rgba(col, k * .55)); gr.addColorStop(1, rgba(col, 0)); return gr };
    c.save(); c.globalAlpha *= a;
    ribbon(c, S, u => w * (.9 + u * 2.6) * Math.sqrt(Math.min(1, u * 8 + .3)), g(.3));
    ribbon(c, S, u => w * (.42 + u * 1.2) * Math.sqrt(Math.min(1, u * 8 + .3)), g(.75));
    c.restore();
  }
  // ================= проба 20.11, часть 1: превращения формы в форму (flubber) =================
  // flubber сам расставляет точки на контурах двух любых фигур и ведёт одну в другую — без ручной подгонки каждой пары.
  const FLB = window.flubber, MCACHE = {};
  function morph(key, a, b) { return MCACHE[key] || (MCACHE[key] = FLB.interpolate(a, b, { string: false, maxSegmentLength: 6 })) }
  const shCircle = (r, n = 120) => [...Array(n)].map((_, i) => { const a = -Math.PI / 2 + i * TAU / n; return [Math.cos(a) * r, Math.sin(a) * r] });
  function shRR(w, h, r, n = 14) {   // скруглённый прямоугольник по часовой стрелке
    const o = [], hw = w / 2, hh = h / 2;
    for (const [cx, cy, a0] of [[hw - r, -hh + r, -Math.PI / 2], [hw - r, hh - r, 0], [-hw + r, hh - r, Math.PI / 2], [-hw + r, -hh + r, Math.PI]])
      for (let i = 0; i <= n; i++) { const a = a0 + i / n * Math.PI / 2; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]) }
    return o;
  }
  function catmull(P, per = 8) {   // гладкий замкнутый контур через опорные точки
    const o = [], n = P.length;
    for (let i = 0; i < n; i++) {
      const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
      for (let j = 0; j < per; j++) { const t = j / per, t2 = t * t, t3 = t2 * t;
        o.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))) }
    }
    return o;
  }
  // белая фигурка по грудь, в профиль вправо (лица нет — как у всех наших фигурок)
  const shBust = () => catmull([[-6, -232], [52, -214], [80, -160], [74, -104], [44, -64], [40, -30], [118, 6], [158, 84], [168, 196], [-168, 196], [-158, 84], [-118, 6], [-46, -34], [-62, -96], [-70, -168], [-48, -216]], 10);
  function shLeaf(L = 470, W = 220) {   // лист табака: острый кончик справа, черешок слева
    const o = [], n = 60;
    for (let i = 0; i <= n; i++) { const u = i / n; o.push([-L / 2 + L * u, -W / 2 * Math.pow(Math.sin(Math.PI * u), .8) * (1 - .25 * u)]) }
    for (let i = n; i >= 0; i--) { const u = i / n; o.push([-L / 2 + L * u, W / 2 * Math.pow(Math.sin(Math.PI * u), .8) * (1 - .25 * u)]) }
    return o.map(([x, y]) => { const a = -.5; return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)] });
  }
  function shDrop(R = 150) {   // капля острым концом вверх
    const o = [], n = 120;
    for (let i = 0; i < n; i++) { const t = i / n * TAU; o.push([R * Math.sin(t) * Math.pow(Math.sin(t / 2), 1.3), -R * 1.35 * Math.cos(t) + R * .35]) }
    return o;
  }
  const SH = { tin: shCircle(232), pouch: shRR(430, 240, 96), bust: shBust(), win: shRR(420, 560, 18), port: shRR(310, 460, 155), leaf: shLeaf(), drop: shDrop() };
  function pathOf(c, pts) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath() }
  function bbox(pts) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) } return [x0, y0, x1 - x0, y1 - y0] }
  function celPts(c, pts, base, o = {}) {   // наши 3 тона: заливка, тень справа (темнее и холоднее), блик полосой слева, тонкий светлый контур
    const [x, y, w, h] = bbox(pts); pathOf(c, pts); cel(c, x, y, w, h, base, { sw: o.sw ?? .26, hx: .1, hw: .09, ha: o.ha ?? .4 }); pathOf(c, pts); lnB(c, o.lw ?? 4, o.lc ?? B2.ln);
  }
  // кадры части 1: t от 0
  function morphPart(c, t) {
    bgSplit(c, B2.bg, B2.bg2, 540, 1380, -.32);
    const zc = 1 + .05 * t / 6.6; c.save(); cam(c, zc, 540, 920);
    // А: баночка → подушечка → фигурка
    if (t < 3.35) {
      const k1 = eio(at(t, .85, 1.6)), k2 = eio(at(t, 1.72, 2.6)), app = spr(at(t, 0, .55)), out = ei(at(t, 3.0, 3.35));
      let pts = k1 < 1 ? morph('tp', SH.tin, SH.pouch)(k1) : morph('pb', SH.pouch, SH.bust)(k2);
      const col = k1 < 1 ? mixc('#FBFAF7', '#EFE6D2', k1) : mixc('#EFE6D2', '#F4F1EA', k2);
      c.save(); c.translate(540, 900 - 40 * k2); { const z = 1.25 * app * (1 - out * .9); c.scale(z, z) } c.rotate(-.06 * (1 - k1) + .04 * Math.sin(t * 1.3));
      castDots(c, -40, 150, 80, 60, 260, { k: (1 - out) });
      celPts(c, pts, col);
      if (k1 < .35) { A(c, 1 - k1 / .35, () => { ring(c, 0, 0, 178, B2.mint, 16); ring(c, 0, 0, 160, rgba('#ffffff', .6), 3) }) }   // кольцо на крышке гаснет, пока круг становится подушечкой
      c.restore();
      label(c, 'баночка → подушечка → фигурка', 540, 1400, app * (1 - out));
    }
    // Б: окно переговорной → иллюминатор
    else if (t < 5.05) {
      const k = eio(at(t, 3.75, 4.55)), app = spr(at(t, 3.35, 3.8)), out = ei(at(t, 4.8, 5.05));
      const o = morph('wp', SH.win, SH.port)(k), inn = o.map(([x, y]) => [x * .86, y * .9]);
      c.save(); c.translate(540, 900); const s = 1.25 * app * (1 - out * .9); c.scale(s, s);
      celPts(c, o, mixc('#D8D2C8', '#E9E4DA', k));
      pathOf(c, inn); c.save(); c.clip();
      vgrad(c, -300, -320, 600, 640, [mixc('#3b5aa0', '#7cc4e0', k), mixc('#1d2a55', '#bde7f6', k)]);
      for (let i = 0; i < 5; i++) { const cx = ((i * 190 + t * 90 * (1 + k)) % 760) - 380, cy = -150 + i * 70; A(c, k, () => { c.beginPath(); c.ellipse(cx, cy, 80, 26, 0, 0, TAU); fill(c, 'rgba(255,255,255,.85)') }) }
      A(c, 1 - k, () => { for (let i = 0; i < 7; i++) { const bx = -170 + i * 52, bh = 120 + H1(i) * 160; c.fillStyle = '#141733'; c.fillRect(bx, 260 - bh, 40, bh); c.fillStyle = 'rgba(242,184,75,.8)'; for (let j = 0; j < 5; j++) c.fillRect(bx + 8, 270 - bh + j * 26, 8, 10) } });
      c.restore(); pathOf(c, inn); lnB(c, 4, B2.ln);
      A(c, 1 - k, () => { c.fillStyle = '#D8D2C8'; c.fillRect(-6, -250, 12, 500); c.fillRect(-180, -6, 360, 12) });   // переплёт окна уходит, пока окно скругляется
      c.restore();
      label(c, 'окно → иллюминатор', 540, 1400, app * (1 - out));
    }
    // В: лист табака → капля никотина
    else {
      const k = eio(at(t, 5.45, 6.25)), app = spr(at(t, 5.05, 5.5));
      const o = morph('ld', SH.leaf, SH.drop)(k);
      c.save(); c.translate(540, 900); c.scale(1.25 * app, 1.25 * app);
      celPts(c, o, mixc('#6E8B3D', '#F2B84B', k), { lc: mixc('#C9E29A', '#FFF4D6', k) });
      A(c, 1 - k * 1.6, () => { c.save(); c.rotate(-.5); c.beginPath(); c.moveTo(-235, 0); c.lineTo(220, 0); for (let i = -3; i <= 3; i++) { const x = i * 55; c.moveTo(x, 0); c.lineTo(x + 50, -60 + Math.abs(i) * 6); c.moveTo(x, 0); c.lineTo(x + 50, 60 - Math.abs(i) * 6) } lnB(c, 4, 'rgba(232,240,200,.75)'); c.restore() });   // прожилки гаснут
      A(c, at(k, .6, 1), () => { c.beginPath(); c.ellipse(-48, 60, 22, 46, .35, 0, TAU); fill(c, 'rgba(255,255,255,.55)') });
      c.restore();
      label(c, 'лист → капля никотина', 540, 1400, app);
    }
    c.restore();
  }
  function label(c, s, x, y, a) { if (a <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); plate(c, s, x, y, 1, { s: 38, a: Math.min(1, a), bg: 'rgba(15,23,42,.88)', c: '#fff', sh: false }); c.restore() }
  function partTag(c, s, a) { if (a <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); plate(c, s, 540, 230, 1, { s: 34, ls: 3, a, bg: '#FFD23F', c: '#141733' }); c.restore() }
  // ================= проба 20.11, часть 2: «скелет» у белых фигурок (как Duik в After Effects) =================
  // Кости: таз → корпус → шея → голова; плечо → локоть → кисть; бедро → колено → стопа. Ноги — обратной кинематикой:
  // стопа стоит на полу, пока на неё опираются (не скользит), колено гнётся само. Руки качаются в противофазе ногам.
  const RG = { torso: 128, neck: 18, head: 36, uarm: 82, farm: 76, thigh: 100, shin: 98, foot: 38 };
  const add2 = (a, b) => [a[0] + b[0], a[1] + b[1]], dir = (a, L) => [Math.sin(a) * L, Math.cos(a) * L];   // угол от «вниз», плюс — вперёд (по +x)
  // нога: бедро в hip, стопа (лодыжка) в ank — колено вперёд
  function ik2(hip, ank, a, b) {
    let dx = ank[0] - hip[0], dy = ank[1] - hip[1], d = Math.hypot(dx, dy); const dm = (a + b) * .999;
    if (d > dm) { dx *= dm / d; dy *= dm / d; d = dm; ank = [hip[0] + dx, hip[1] + dy] }
    const th0 = Math.atan2(dx, dy), al = Math.acos(cl((a * a + d * d - b * b) / (2 * a * d), -1, 1));
    const knee = add2(hip, dir(th0 + al, a)); return [knee, ank];
  }
  // одна фигурка: pose = { pel:[x,y], lean, neck, shL, elL, shR, elR, ankL, ankR, ftL, ftR, s }; L — дальняя сторона (темнее)
  function drawRig(c, P, o = {}) {
    const s = P.s, base = o.col || '#F4F1EA', far = shd(base, .32), near = base;
    const top = add2(P.pel, dir(Math.PI - P.lean, RG.torso * s)), shoulder = add2(P.pel, dir(Math.PI - P.lean, (RG.torso - 14) * s));
    const head = add2(top, dir(Math.PI - P.lean - P.neck, (RG.neck + RG.head) * s));
    const legs = side => { const ank = side ? P.ankR : P.ankL, [kn, an] = ik2(P.pel, ank, RG.thigh * s, RG.shin * s); return { kn, an, ft: add2(an, [Math.cos(side ? P.ftR : P.ftL) * RG.foot * s, -Math.sin(side ? P.ftR : P.ftL) * RG.foot * s]) } };
    const arm = (sh, el) => { const e = add2(shoulder, dir(sh, RG.uarm * s)); return { e, w: add2(e, dir(sh + el, RG.farm * s)) } };
    const lL = legs(0), lR = legs(1), aL = arm(P.shL, P.elL), aR = arm(P.shR, P.elR);
    const leg = (l, col) => { limb(c, [P.pel, l.kn, l.an], [34 * s, 27 * s, 20 * s], col); limb(c, [l.an, l.ft], [18 * s, 14 * s], col) };
    const armD = (a, col) => limb(c, [shoulder, a.e, a.w], [24 * s, 19 * s, 16 * s], col);
    // дальние рука и нога — темнее (как тень), ближние — светлые
    leg(lL, far); armD(aL, far);
    // корпус: капсула от таза к плечам, 3 тона
    const bw = 66 * s, tw = 78 * s, a = Math.atan2(top[0] - P.pel[0], -(top[1] - P.pel[1])), L = Math.hypot(top[0] - P.pel[0], top[1] - P.pel[1]);
    c.save(); c.translate(P.pel[0], P.pel[1]); c.rotate(a);
    const torso = () => { c.beginPath(); c.moveTo(-bw / 2, 10 * s); c.lineTo(bw / 2, 10 * s); c.quadraticCurveTo(tw / 2 + 6 * s, -L * .55, tw / 2, -L + 14 * s); c.quadraticCurveTo(tw / 2, -L - 6 * s, tw / 2 - 18 * s, -L - 6 * s);
      c.lineTo(-tw / 2 + 18 * s, -L - 6 * s); c.quadraticCurveTo(-tw / 2, -L - 6 * s, -tw / 2, -L + 14 * s); c.quadraticCurveTo(-tw / 2 - 4 * s, -L * .55, -bw / 2, 10 * s); c.closePath() };
    torso(); cel(c, -tw / 2, -L - 8 * s, tw, L + 20 * s, near, { sw: .3, ha: .35 }); c.restore();
    limb(c, [top, add2(top, dir(Math.PI - P.lean - P.neck, RG.neck * s * .9))], [26 * s, 24 * s], near);
    // голова: круг, тень справа серпом
    c.save(); c.beginPath(); c.arc(head[0], head[1], RG.head * s, 0, TAU); fill(c, near); c.clip();
    c.beginPath(); c.arc(head[0] - 12 * s, head[1] - 4 * s, RG.head * s * 1.02, 0, TAU); c.rect(head[0] - 200, head[1] - 200, 400, 400); c.fillStyle = shd(near, .3); c.fill('evenodd');
    rr(c, head[0] - RG.head * s * .62, head[1] - RG.head * s * .55, RG.head * s * .18, RG.head * s * .7, 4); fill(c, 'rgba(255,255,255,.45)'); c.restore();
    leg(lR, near); armD(aR, near);
  }
  // ходьба без скольжения стоп: каждая стопа стоит на полу полпериода, потом дугой переносится вперёд на v·T
  function walker(t, o) {   // o: x0, v (px/с), T (период шага), floor, s, t0 (старт); по желанию lean, lift, arm, el, bob, crouch
    const s = o.s, T = o.T, v = o.v, x = o.x0 + v * (t - o.t0), legH = (RG.thigh + RG.shin) * s, FY = o.floor - 10 * s;
    const foot = ph0 => {
      const ph = ((t - o.t0) / T + ph0) % 1, n = Math.floor((t - o.t0) / T + ph0);
      const mid = k => o.x0 + v * ((k - ph0) * T + T / 4);   // стопа под тазом — в середине опоры
      if (ph < .5) return [[mid(n), FY], 0, ph];
      const u = (ph - .5) / .5, e = u * u * (3 - 2 * u); return [[lp(mid(n), mid(n + 1), e), FY - (o.lift || 34) * s * Math.sin(Math.PI * u)], -.35 * Math.sin(Math.PI * u), ph];
    };
    const [aL, fL, pL] = foot(0), [aR, fR, pR] = foot(.5);
    const w = TAU * ((t - o.t0) / T), bob = (o.bob ?? 7) * s * Math.cos(2 * w);
    const pel = [x, o.floor - legH * (o.crouch ?? .955) - bob];
    const armA = o.arm ?? .48, sw = ph => armA * Math.sin(TAU * (ph - .25));
    return { pel, lean: o.lean ?? .06, neck: -.04, shL: sw(pL), elL: (o.el ?? .3) + .25 * Math.max(0, sw(pL) / armA), shR: sw(pR), elR: (o.el ?? .3) + .25 * Math.max(0, sw(pR) / armA),
      ankL: aL, ankR: aR, ftL: fL, ftR: fR, s };
  }
  // кадры части 2: t от 0 (6,4 с)
  const FLOOR = 1300, CHAIR = { x: 800, seat: 1185 };
  function chair(c) {   // стул смотрит влево: спинка справа
    const W = B2.wood;
    shp(c, RRp(CHAIR.x + 78, 860, 26, FLOOR - 860, 10), CHAIR.x + 78, 860, 26, FLOOR - 860, W, { lw: 3 });   // спинка
    shp(c, RRp(CHAIR.x - 112, CHAIR.seat - 4, 216, 30, 10), CHAIR.x - 112, CHAIR.seat - 4, 216, 30, lit(W, .12), { lw: 3 });   // сиденье
    shp(c, RRp(CHAIR.x - 100, CHAIR.seat + 26, 20, FLOOR - CHAIR.seat - 26, 8), CHAIR.x - 100, CHAIR.seat + 26, 20, FLOOR - CHAIR.seat - 26, shd(W, .2), { lw: 3 });
  }
  const mirrorX = (c, axis, fn) => { c.save(); c.translate(axis * 2, 0); c.scale(-1, 1); fn(); c.restore() };   // фигурка смотрит влево: та же поза, зеркально
  function rigPart(c, t) {
    bgSplit(c, B2.bg, B2.bg2, 540, 520, .12);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = B2.bg2; c.fillRect(0, FLOOR, WW, HH - FLOOR); c.fillStyle = B2.dim; c.fillRect(0, FLOOR - 3, WW, 6);
    dotsField(c, 0, FLOOR + 6, WW, 200, 22, 'rgba(6,8,24,.35)', 2);
    c.restore();
    const zc = 1.02 + .03 * t / 6.4; c.save(); cam(c, zc, 540, 1000);
    // в глубине бегут трое (последние 2 с): та же фигурка, бег — другой ритм тех же костей
    if (t > 4.25) for (let i = 0; i < 3; i++) {
      const P = walker(t - 4.25, { x0: -180 - i * 120, v: 600, T: .5, floor: 1196, s: .7, lean: .3, lift: 62, arm: .95, el: 1.35, bob: 10, crouch: .9, t0: i * .05 });
      mirrorX(c, 540, () => drawRig(c, P, { col: '#C9C5D6' }));
    }
    chair(c);
    if (t < 1.75) {   // «было»: старая фигурка едет целиком, ноги не двигаются
      const k = eio(at(t, .1, 1.3)), x = lp(60, 430, k), a = 1 - at(t, 1.45, 1.75);
      A(c, a, () => { castDots(c, x - 40, FLOOR - 16, 80, 16, 120, {}); fig(c, x, FLOOR, 2.05, { m: 1, col: '#F4F1EA' }) });
      label(c, 'было: фигурка едет целиком', 540, 1520, a);
    } else {   // «стало»: идёт к стулу, разворачивается, садится, машет
      const S = 1.25, tw0 = 1.75, V = 360, AX = CHAIR.x - 170, X0 = 40, tStop = tw0 + (AX - X0) / V;
      const wk = { x0: X0, v: V, T: 1.0, floor: FLOOR, s: S, t0: tw0, lift: 36, crouch: .98 }, FY = FLOOR - 10 * S, standY = FLOOR - (RG.thigh + RG.shin) * S * .975;
      let P, sx = 1;
      if (t < tStop) P = walker(t, wk);
      else {
        const P0 = walker(tStop, wk), k = eio(at(t, tStop, tStop + .3));   // встал ровно, стопы рядом
        const stand = { s: S, pel: [lp(P0.pel[0], AX, k), lp(P0.pel[1], standY, k)], lean: lp(P0.lean, .02, k), neck: -.04, shL: lp(P0.shL, .05, k), elL: lp(P0.elL, .2, k), shR: lp(P0.shR, .05, k), elR: lp(P0.elR, .2, k),
          ankL: [lp(P0.ankL[0], AX - 14, k), lp(P0.ankL[1], FY, k)], ankR: [lp(P0.ankR[0], AX + 14, k), lp(P0.ankR[1], FY, k)], ftL: lp(P0.ftL, 0, k), ftR: lp(P0.ftR, 0, k) };
        const tf0 = tStop + .32, tf1 = tf0 + .26;   // разворот: сжимается по ширине и выходит зеркально
        if (t < tf1) { P = stand; sx = Math.cos(Math.PI * eio(at(t, tf0, tf1))) }
        else {   // дальше — в своей системе: «вперёд» = влево по экрану, стул сзади
          const ks = eio(at(t, tf1 + .05, tf1 + .85)), wave = eio(at(t, tf1 + 1.0, tf1 + 1.35)), wv = Math.sin((t - tf1 - 1.0) * 11);
          const seat = [AX - 170, CHAIR.seat - 20], dip = Math.sin(Math.PI * ks);
          P = { s: S, pel: [lp(AX, seat[0], ks), lp(standY, seat[1], ks) + 22 * dip], lean: lp(.02, -.05, ks) + .42 * dip,
            neck: -.04 + .1 * Math.sin((t - tf1 - 1.0) * 6) * wave,
            shL: lp(.05, .5, ks), elL: lp(.2, .95, ks), shR: lp(lp(.05, .45, ks), 2.6, wave), elR: lp(lp(.2, .9, ks), .35 + .4 * wv, wave),
            ankL: [lp(AX - 14, AX - 52, ks), FY], ankR: [lp(AX + 14, AX - 30, ks), FY], ftL: 0, ftR: 0 };
          sx = -1;
        }
      }
      const px = P.pel[0], draw = () => { castDots(c, px - 50, FLOOR - 14, 100, 14, 140, {}); drawRig(c, P) };
      if (sx === -1) mirrorX(c, AX, draw);
      else { c.save(); c.translate(px, 0); c.scale(Math.abs(sx) < .02 ? .02 : sx, 1); c.translate(-px, 0); draw(); c.restore() }
      label(c, t < 4.25 ? 'стало: скелет — колени и локти гнутся сами' : 'бег — те же кости, другой ритм', 540, 1520, at(t, 1.8, 2.1));
    }
    c.restore();
  }
  // ================= проба 20.11, часть 3: баночка из Blender в наших 3 тонах =================
  // Blender считает форму (нормали, материалы), цвета красим сами — proba/tin_blender.py → out/vpr-tin/c/0001.png… (RGBA 760×950, 30 к/с).
  // Здесь кадры баночки ставятся в ролик картинкой; длинная растровая тень 35° — от её же силуэта, точки мельчают к концу (как castDots).
  const TIN = [], TIN_N = 165, TIN_FPS = 30, TIN_S = 1.5, TIN_X = -81, TIN_Y = 369;
  function tinLoad() {
    if (TIN.length) return Promise.resolve();
    const ps = [];
    for (let i = 1; i <= TIN_N; i++) { const im = new Image(); TIN.push(im); ps.push(new Promise(r => { im.onload = im.onerror = r })); im.src = 'out/vpr-tin/c/' + String(i).padStart(4, '0') + '.png' }
    return Promise.all(ps);
  }
  let SHC = null, SHT = null; const DOTP = {};
  function dotPat(g, r) {   // растр: шаг 14 px, точки радиуса r (в шахматку)
    const k = Math.round(r * 4); if (!DOTP[k]) { const d = mk(14, 14), q = d.getContext('2d'); q.fillStyle = '#000'; q.beginPath(); q.arc(3.5, 3.5, r, 0, TAU); q.arc(10.5, 10.5, r, 0, TAU); q.fill(); DOTP[k] = d }
    return g.createPattern(DOTP[k], 'repeat');
  }
  function tinShadow(c, im, x, y, w, h, L) {   // тень тянется вправо-вниз: дальние полосы — мелкие точки, ближние — крупные поверх
    if (!SHC) { SHC = mk(WW, HH); SHT = mk(WW, HH) }
    const g = SHC.getContext('2d'), q = SHT.getContext('2d'), n = 6, dx = Math.cos(35 * Math.PI / 180), dy = Math.sin(35 * Math.PI / 180);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, WW, HH);
    for (let i = n; i >= 1; i--) {
      const d = L * i / n, r = 5 * Math.pow(1 - (i - 1) / n, .8);
      q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, WW, HH); q.drawImage(im, x + dx * d, y + dy * d, w, h);
      q.globalCompositeOperation = 'source-in'; q.fillStyle = dotPat(q, r); q.fillRect(0, 0, WW, HH);
      g.drawImage(SHT, 0, 0);
    }
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha *= .55; c.drawImage(SHC, 0, 0); c.restore();
  }
  // кадры части 3: t от 0 (5,6 с)
  function tinPart(c, t) {
    bgSplit(c, B2.bg, B2.bg2, 540, 1460, -.3);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); dotsField(c, 0, 1700, WW, 220, 22, 'rgba(6,8,24,.3)', 3); c.restore();
    const im = TIN[Math.min(TIN_N - 1, Math.max(0, Math.round(t * TIN_FPS)))]; if (!im || !im.naturalWidth) return;
    const w = im.naturalWidth * TIN_S, h = im.naturalHeight * TIN_S, app = eo(at(t, 0, .35));
    c.save(); c.globalAlpha *= app;
    tinShadow(c, im, TIN_X, TIN_Y, w, h, 130);
    c.drawImage(im, TIN_X, TIN_Y, w, h);
    c.restore();
    label(c, t < 2.7 ? 'объём из Blender: камера облетает сама' : 'а цвета наши: 3 тона, как у рисованных', 540, 1560, at(t, .3, .6));
  }
  // ================= сборка пробы: три части подряд, плашка части сверху =================
  const PARTS = [[0, 6.6, morphPart, '1 · ПРЕВРАЩЕНИЯ'], [6.6, 13.0, rigPart, '2 · СКЕЛЕТ'], [13.0, 18.6, tinPart, '3 · BLENDER']];
  const partAt = t => PARTS.find(p => t < p[1]) || PARTS[PARTS.length - 1];
  function scene(c, t) { const p = partAt(t); p[2](c, t - p[0]) }
  let MBC = null;
  function sceneMB(c, t) {   // затвор 180° — среднее 4 моментов за полкадра (у баночки кадры свои — без него)
    if (partAt(t)[2] === tinPart) return scene(c, t);
    const n = 4, sh = 1 / 60; if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { scene(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); scene(g, tj);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function frameTo(c, t) {
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH); FT = t;
    if (window.NOMB) scene(c, t); else sceneMB(c, t);
    const p = partAt(t); c.setTransform(1, 0, 0, 1, 0, 0); partTag(c, p[3], eo(at(t - p[0], .05, .4)));
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      SC.forEach(S => { this.D[S.key] = t => { frameTo(X, t); return '' } }); window.CUES_READY = 1;
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d');
      return Promise.all([tinLoad(), ...['600 20px M', '800 20px M'].map(f => document.fonts.load(f, 'АЯaz09'))]).then(() => 0);
    },
  };
})();
