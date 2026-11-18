// v20.0 (18.11) — глава 3 «1924 · Мальборо» фильма «Что вы знаете о никотине?». Текст 3 «Три жизни одной марки», голос Макса (voice/v200).
// Ролики: v200y-ru — глава фильма (фразы 1–14 и финал на доске), v200s-ru — шортс (крючок из «Льда», без фразы 12, вопрос и «Часть 4 →», петля в кадр 0).
// Рисовка — по раскадровке shorts/глава3/рисовка.py (версия 3: всадник на коне, пачка по эталону, марки на предметах латиницей).
// Набор «Боб 2.0» (05-kit.js), камера без старт-стопа (12-cam.js), время событий — по словам голоса (Ws(фраза, слово)).
// Факты в кадре — с источников страницы текстов: 1953 — опыт с мышами (Wynder, Cancer Research), 0,25 % рынка в 1954, Бёрнетт (Чикаго, яблоки и карандаши),
// №4 в США через год, №1 в мире в 1972, Уэйн Макларен (рак лёгких в 1990, умер в 1992 в 51), 12,8 млрд $ за 35 % Juul (2018) → 450 млн $ (30.06.2022), Marlboro HeatSticks (2014).
(function () {
  'use strict';
  const WW = 1080, HH = 1920, CX = WW / 2, CY = HH / 2, TAU = Math.PI * 2, SUBY = 1720;
  let cv = null, X = null, K = null, TLW = [], TLX = {}, MODE = 's', CHUNKS = [];
  window.CUES = window.CUES || {};
  const cue = (t0, name, gain = 1, pan = 0) => { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, pan] };
  const nw = s => String(s).toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
  function Wd(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.a } throw new Error('v200: нет слова «' + q + '» #' + n) }
  let TLS = [];
  function Ws(sc, q, n = 0) { const s = TLS.find(x => x.scene === sc); if (!s) return null; let k = 0; for (const w of s.words) if (nw(w.d) === q) { if (k++ === n) return w.a } throw new Error('v200: нет слова «' + q + '» во фразе ' + sc) }
  function WsB(sc, q, n = 0) { const s = TLS.find(x => x.scene === sc); if (!s) return null; let k = 0; for (const w of s.words) if (nw(w.d) === q) { if (k++ === n) return w.b } throw new Error('v200: нет слова «' + q + '» во фразе ' + sc) }
  const SA = sc => { const s = TLS.find(x => x.scene === sc); return s ? s.a : null }, SB = sc => { const s = TLS.find(x => x.scene === sc); return s ? s.b : null };
  function WdB(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.b } throw new Error('v200: нет слова «' + q + '» #' + n) }
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
  // ---------- плашка года (ТЗ: x 70, y 80, 180×68, без обводки) ----------
  function yearPill(c, y0, y1, k, a = 1, local = false) {   // y0 → y1: старое число уходит вверх, новое въезжает снизу
    if (a <= 0) return;
    c.save(); if (!local) c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha *= a;
    rr(c, 70, 80, 180, 68, 18); fill(c, 'rgba(15,23,42,0.88)');
    c.save(); rr(c, 70, 80, 180, 68, 18); c.clip();
    if (k <= 0 || y0 === y1) tx(c, String(k >= 1 ? y1 : y0), 160, 116, { s: 38, w: 800, c: '#fff' });
    else { const e = eio(k); tx(c, String(y0), 160, 116 - 70 * e, { s: 38, w: 800, c: '#fff' }); tx(c, String(y1), 160, 116 + 70 * (1 - e), { s: 38, w: 800, c: '#fff' }) }   // v19.3: как счётчик-барабан — оба числа едут вместе, плашка не бывает пустой (1:09)
    c.restore(); c.restore();
  }
  // ---------- субтитры (ТЗ: x 540, y 1720, ширина до 920) ----------
  function buildChunks() {
    const out = []; let cur = [];
    const FW = new Set(['с', 'со', 'в', 'во', 'и', 'а', 'на', 'по', 'за', 'но', 'к', 'о', 'от', 'до', 'из', 'у', 'для', 'при', 'без', 'под', 'что', 'как', 'не', 'их', 'ещё', 'если', 'пока', 'когда', 'чтобы', 'так']);
    const bare = w => w.d.toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
    const flush = () => { if (cur.length) { out.push({ a: cur[0].a, b: cur[cur.length - 1].b, s: cur.map(w => w.d).join(' ') }); cur = [] } };
    TLW.forEach((w, i) => {
      const nx = TLW[i + 1];
      if (cur.length && ((FW.has(bare(w)) && cur.length >= 2) || cur.length >= 4 || (cur.map(x => x.d).join(' ') + ' ' + w.d).length > 22)) flush();
      cur.push(w);
      if (/[.,!?…:;—]$/.test(w.d) || !nx || nx.a - w.b > .35) flush();
    });
    out.forEach((ch, i) => { const nx = out[i + 1]; ch.e = nx ? Math.min(nx.a - .02, ch.b + .6) : ch.b + .8; ch.s = ch.s.replace(/\.\.\./g, '…').replace(/[.,;:—]+$/, '').replace(/^—\s*/, '') });
    return out.filter(ch => ch.s);
  }
  function subs(c, t) {
    const ch = CHUNKS.find(x => t >= x.a - .05 && t < x.e); if (!ch) return;
    let a = eo(at(t, ch.a - .05, ch.a + .1));
    if (MODE === 's') a *= 1 - at(t, K.endT - .75, K.endT - .45);   // петля: на последних кадрах (и в кадре 0) субтитра нет
    if (a <= 0) return;
    const o = { f: 'M', w: 800, s: 54, ls: 0 }; let w = tw(c, ch.s, o); if (w > 840) { o.s *= 840 / w; w = 840 }
    w += 64; const h = 84;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = a; c.translate(0, (1 - a) * 10);
    const sy = SUBY;
    rr(c, CX - w / 2, sy - h / 2, w, h, 20); fill(c, 'rgba(11,16,48,.86)');
    tx(c, ch.s, CX, sy + 2, { ...o, c: '#fff' }); c.restore();
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
    if (t <= KEYS[0][0]) return KEYS[0].slice(1);
    if (t >= KEYS[n - 1][0]) return KEYS[n - 1].slice(1);
    let i = 0; while (KEYS[i + 1][0] < t) i++;
    const tg = (j, k) => {
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
    SL(c, [29, -222, 38, -219], T.cig, 2.6);
    const em = o.ember ?? 0; if (em > 0) { circ(c, 39, -219, 3.4 + em * 4.5, rgba('#FF9A4A', .28 * em)); circ(c, 39, -219, 2.6 + em * 2.4, rgba('#FFC36A', .5 * em)) } circ(c, 39, -219, 2.2 + em * 1.2, mixc('#c05a3a', T.ember, .6 + em * .4));   // огонёк — плоскими кругами, без свечения
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
    if (o.cigs !== false) [.3, .5, .7].forEach((u, i) => { const cx = x + w * u, top = y - h * .12 + (i % 2) * h * .04; c.fillStyle = T.white; c.fillRect(cx - w * .047, top, w * .095, h * .21); c.fillStyle = T.red; c.fillRect(cx - w * .047, top, w * .095, h * .042) });
    PL(c, [x - side, y + 8, x, y + 2, x, y + h, x - side, y + h - 8], T.creamD);
    c.beginPath(); c.moveTo(x, y + 6); [[.18, 0], [.3, 10], [.46, 2], [.62, 12], [.8, 3], [1, 8]].forEach(([u, d]) => c.lineTo(x + w * u, y + d)); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); fill(c, T.cream);
    c.fillStyle = T.foil; c.fillRect(x, y + 14, w, 10);
    c.strokeStyle = T.gold; c.lineWidth = 2.5; c.strokeRect(x + w * .063, y + h * .12, w * .874, h * .83);
    for (let q = 0; q < 3; q++) { c.beginPath(); c.arc(x + w / 2, y + h * .36, w * (.084 + q * .063), Math.PI * 1.15, Math.PI * 1.85); c.stroke() }
    tx(c, 'Marlboro', x + w / 2, y + h * .56, { f: 'P', w: 700, st: 'italic', s: Math.round(w * .2), c: o.glow ? mixc(T.ink, T.red, o.glow) : T.ink });
    tx(c, 'Mild as May', x + w / 2, y + h * .69, { f: 'P', w: 400, st: 'italic', s: Math.round(w * .1), c: T.ink });
    if (o.glow) { c.fillStyle = rgba('#FFD27A', .55 * o.glow); c.fillRect(x + w * .14, y + h * .62, w * .72 * o.glow, 5) }
    SL(c, [x, y + 8, x, y + h - 2], 'rgba(255,255,255,.6)', 2);
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
  // струйка дыма: мягкая лента по точкам, тает к концу (без колец)
  function smokeLine(c, pts, w, col, a = 1) {
    if (a <= 0 || pts.length < 4) return; c.save(); c.globalAlpha *= a; c.lineCap = 'round'; c.lineJoin = 'round';
    for (let i = 2; i < pts.length; i += 2) { const u = i / pts.length; c.strokeStyle = rgba(col, .75 * (1 - u * .8)); c.lineWidth = w * (1 + u * 1.6); c.beginPath(); c.moveTo(pts[i - 2], pts[i - 1]); c.lineTo(pts[i], pts[i + 1]); c.stroke() }
    c.restore();
  }
  // ================= мир 1: щит Marlboro Country у трассы на закате (кадр 0) → ветер рвёт плакат с угла → под ним дамская реклама, нырок в дыру (#088) =================
  let T1 = null, K1 = null;
  function w1Init() {
    const hk = SA('hook') !== null, s1 = SA('s1');
    T1 = { hk, s1, marl: Ws('s1', 'мальборо'), do: Ws('s1', 'до'), zh: Ws('s1', 'жизнь'), end: SA('s2') - .02,
      ledi: hk ? Ws('hook', 'леди') : -9, brut: hk ? Ws('hook', 'брутальности') : -9 };
    const a = T1;   // камера: кадр 0 → пачка → угол → нырок в розовый слой под плакатом
    K1 = [KY(0, 540, 960, 1)];
    if (hk) K1.push(KY(a.brut, 549, 944, 1.05), KY(a.s1 - .2, 566, 912, 1.19));   // крючок: медленный наезд, камера не стоит
    K1.push(KY(a.marl + .1, 690, 840, 1.32), KY(a.do + .6, 760, 860, 1.42), KY(a.zh - .5, 860, 860, 1.9), KY(a.zh + .05, 900, 870, 2.6), KY(a.end, 918, 872, 9.5));
  }
  function w1Peel(t) {
    const a = T1; let px = 210 + 14 * Math.sin(t * 3.1) + 8 * Math.sin(t * 7.3);   // ветер треплет угол
    if (a.hk) px += 40 * eo(at(t, a.ledi - .3, a.ledi + .6));
    return px + 1250 * eio(at(t, a.do - .1, a.zh + .2));
  }
  function tumbleweed(c, x, y, R, rot) {
    c.save(); c.translate(x, y); c.rotate(rot); c.strokeStyle = '#8A4A2A'; c.lineWidth = 4;
    for (let k = 0; k < 14; k++) { c.beginPath(); c.arc(((k * 13) % 21 - 10) * R / 40, ((k * 7) % 17 - 8) * R / 40, R * (.65 + ((k * 11) % 22) / 40), k * .9, k * .9 + 2.1); c.stroke() } c.restore();
  }
  function w1World(c, t, q) {
    layer(c, q, .3, cc => { P0(cc, .3); desertFar(cc) });   // дальний план почти стоит
    layer(c, q, 1, cc => { desertGround(cc, t); billboardFrame(cc); poster(cc, t, { peelPx: w1Peel(t) }) });
    layer(c, q, 1.35, cc => { P0(cc, 1.35);   // передний план: перекати-поле катится, песок по ветру
      const u = (t * .045 + .62) % 1, x = lp(-300, 1500, u); tumbleweed(cc, x, 1530 - Math.abs(Math.sin(t * 2.4)) * 26, 44, t * 2.2);
      cc.strokeStyle = 'rgba(242,180,90,.5)'; cc.lineWidth = 3;
      [[90, 1500], [270, 1560], [500, 1510], [690, 1590], [210, 1650], [620, 1680], [960, 1640], [-200, 1600], [1200, 1540]].forEach(([x0, y0], i) => { const dx = ((t * 160 + i * 90) % 400); cc.beginPath(); cc.moveTo(x0 + dx, y0); cc.lineTo(x0 + dx + 80, y0 - 16); cc.stroke() });
    });
  }
  function w1Shot(c, t) { const q = camObj(camAt(K1, t)); w1World(c, t, q) }
  // ================= мир 2 (фраза 2): коридор арок ар-деко → страница журнала 1924 → журналы веером (#065) → помада становится красным кончиком (#048) → кончик торцом =================
  // Координаты страницы: 1080×1920. Мир 2 вложен в плакат мира 1 (V1, M1): камера ныряет в коридор без остановки (linkK).
  let T2 = null, K2 = null;
  const LIP = { x: 860, y: 1700, w: 250, bw: 200 };   // помада / сигарета: центр, верх гильзы, ширина гильзы и стержня
  const MAGC = [['#9FD6C2', '#3D7F6E'], ['#C9B6E4', '#5D4A8A'], ['#F4B98E', '#9A5530'], ['#A9C8E8', '#3C5E8A'], ['#F1C3CC', '#9B4A62']];
  function w2Init() {
    const s = 's2';
    T2 = { a: SA(s), perv: Ws(s, 'первые'), dam: Ws(s, 'дамской'), slog: Ws(s, 'слоган'), myag: Ws(s, 'мягкие'), may: Ws(s, 'май'), izy: Ws(s, 'изящная'), rekl: Ws(s, 'реклама'),
      zh: Ws(s, 'журналах'), kr: Ws(s, 'красный'), kon: Ws(s, 'кончик'), kot: Ws(s, 'котором'), vid: Ws(s, 'видно'), pom: Ws(s, 'помады'), end: SA('s3') - .02 };
    const a = T2; a.top = LIP.y - 330;   // верх стержня, когда он выкручен
    a.tilt0 = a.pom + .05; a.tilt1 = a.end - .32;
    K2 = [KY(a.a + .55, 610, 1010, .6), KY(a.dam - .05, 540, 960, 1.0), KY(a.myag + .4, 552, 950, 1.04), KY(a.izy + .1, 566, 942, 1.06),
      KY(a.zh + .35, 800, 1230, .6), KY(a.kr + .05, 880, 1420, .56), KY(a.kon + .25, LIP.x, a.top + 120, .74), KY(a.pom - .05, LIP.x, a.top + 40, .9),
      KY(a.tilt1, LIP.x, a.top, 2.4), KY(a.end, LIP.x, a.top, 11.6)];
  }
  // дама 1920-х сбоку (смотрит вправо), ноги — y 0; шляпка-колокол, платье с заниженной талией, жемчуг, сигарета в поднятой руке
  function lady(c, x, y, s, t, col = '#3A1830', rim = '#F1C3CC') {
    c.save(); c.translate(x, y); c.scale(s, s);
    limb(c, [[-14, -190], [-18, -96], [-22, -10]], [26, 18, 14], col); limb(c, [[14, -190], [20, -100], [26, -10]], [26, 18, 14], col);
    PL(c, [-34, -12, -6, -12, -2, 0, -40, 0], col); PL(c, [16, -12, 44, -12, 48, 0, 10, 0], col);
    c.beginPath(); c.moveTo(-40, -620); c.bezierCurveTo(-48, -520, -50, -440, -52, -380); c.lineTo(-74, -180); c.quadraticCurveTo(0, -164, 76, -180); c.lineTo(54, -380); c.bezierCurveTo(52, -460, 48, -540, 40, -620); c.closePath(); fill(c, col);
    c.fillStyle = shd(col, .3); c.fillRect(-60, -392, 118, 10);   // заниженная талия — лента
    c.beginPath(); c.moveTo(-40, -620); c.quadraticCurveTo(0, -640, 40, -620); c.lineTo(36, -600); c.lineTo(-36, -600); c.closePath(); fill(c, col);
    rr(c, -12, -664, 24, 52, 8); fill(c, col);   // шея
    circ(c, 6, -690, 36, col);   // голова
    c.beginPath(); c.moveTo(-36, -690); c.bezierCurveTo(-38, -740, -10, -762, 14, -760); c.bezierCurveTo(40, -758, 52, -734, 50, -700); c.quadraticCurveTo(54, -690, 62, -686); c.lineTo(58, -676); c.quadraticCurveTo(30, -684, 4, -684); c.quadraticCurveTo(-24, -682, -40, -668); c.closePath(); fill(c, shd(col, .15));   // шляпка-колокол
    c.fillStyle = C3.rose2; c.fillRect(-36, -704, 86, 7);
    for (let i = 0; i < 9; i++) { const u = i / 8; circ(c, lp(-8, 26, u) + Math.sin(u * Math.PI) * 10, lp(-622, -520, u), 5, '#F6EBDD') }   // жемчуг
    limb(c, [[30, -606], [70, -506], [84, -590]], [22, 16, 13], col);   // рука: локоть вниз, кисть у плеча
    const tip = [140, -650]; cigar(c, 86, -594, tip[0], tip[1], 5, { tip: C3.red, tl: .2 });
    const sw = Math.sin(t * 1.7) * 8; smokeLine(c, [tip[0], tip[1], tip[0] + 10 + sw, tip[1] - 50, tip[0] - 6 + sw, tip[1] - 110, tip[0] + 14 - sw, tip[1] - 170, tip[0] + 2, tip[1] - 230], 5, '#F6EBDD', .8);
    SL(c, [-40, -616, -48, -520, -52, -380, -72, -186], rim, 4); SL(c, [-34, -700, -26, -748, 10, -760], rim, 3);
    c.restore();
  }
  function fanArt(c, x, y, R, n = 7) {   // золотой веер ар-деко
    c.strokeStyle = C3.gold; c.lineWidth = 4;
    for (let q = 0; q < 4; q++) { c.beginPath(); c.arc(x, y, R * (.4 + q * .2), Math.PI, 0); c.stroke() }
    for (let i = 0; i <= n; i++) { const a = Math.PI + i * Math.PI / n; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * R, y + Math.sin(a) * R); c.stroke() }
  }
  // страница-реклама 1924 (координаты страницы). Реклама проявляется на «мягкие»; на «журналах» страница — обложка журнала
  function pageW2(c, t) {
    const a = T2; c.fillStyle = '#F6EBDD'; c.fillRect(0, 0, 1080, 1920);
    PL(c, [0, 1240, 1080, 820, 1080, 1120, 0, 1540], '#F1C9CF'); PL(c, [0, 1540, 1080, 1120, 1080, 1180, 0, 1600], '#E7A9B6');
    fanArt(c, 540, 1920, 520, 9); c.fillStyle = '#F6EBDD'; c.fillRect(0, 1600, 1080, 320); PL(c, [0, 1600, 1080, 1180, 1080, 1250, 0, 1670], '#F1C9CF');
    c.strokeStyle = C3.gold; c.lineWidth = 7; c.strokeRect(36, 36, 1008, 1848); c.lineWidth = 2.5; c.strokeRect(58, 58, 964, 1804);
    [[58, 58, 1, 1], [1022, 58, -1, 1], [58, 1862, 1, -1], [1022, 1862, -1, -1]].forEach(([qx, qy, sx, sy]) => { c.beginPath(); c.arc(qx, qy, 70, sy > 0 ? (sx > 0 ? 0 : Math.PI / 2) : (sx > 0 ? -Math.PI / 2 : Math.PI), (sy > 0 ? (sx > 0 ? 0 : Math.PI / 2) : (sx > 0 ? -Math.PI / 2 : Math.PI)) + Math.PI / 2); c.stroke() });
    lady(c, 300, 1650, 1.55, t);
    const k = at(t, a.myag - .25, a.myag + .35), k2 = at(t, a.myag + .05, a.may + .2);
    if (k > 0) {   // реклама: Marlboro курсивом, мягкая пачка выезжает, Mild as May пишется
      c.save(); c.beginPath(); c.rect(80, 150, 960 * eo(k) + 1, 260); c.clip();
      tx(c, 'Marlboro', 560, 290, { f: 'P', w: 700, st: 'italic', s: 170, c: '#3A1830' }); c.restore();
      c.save(); c.beginPath(); c.rect(240, 410, 640 * eo(k2) + 1, 120); c.clip(); tx(c, 'Mild as May', 560, 470, { f: 'P', w: 400, st: 'italic', s: 84, c: C3.red }); c.restore();
      const kp = spr(at(t, a.myag - .05, a.myag + .75)); c.save(); c.translate(780, 1360 + (1 - kp) * 700); c.rotate((1 - kp) * .3); softPack(c, -130, -420, 260, 400, 34, { shc: 'rgba(120,40,60,.28)' }); c.restore();
    }
  }
  // обложки журналов: тот же формат 1080×1920, цвет и рисунок свои
  function magCover(c, i, t) {
    const [bg, ink] = MAGC[i % MAGC.length]; c.fillStyle = bg; c.fillRect(0, 0, 1080, 1920);
    PL(c, [0, 1100 + i * 40, 1080, 700 + i * 40, 1080, 1920, 0, 1920], shd(bg, .12));
    c.save(); c.strokeStyle = ink; c.globalAlpha = .5; fanArt(c, 540, 1500, 460, 7 + i); c.restore();
    c.fillStyle = ink; c.fillRect(90, 120, 900, 150); c.fillStyle = bg; for (let j = 0; j < 6; j++) c.fillRect(130 + j * 140, 160, 90, 70);   // заголовок — полосками, без слов
    c.save(); c.translate(540, 960); c.scale(2.2, 2.2); circ(c, 0, 0, 86, lit(bg, .25)); c.restore();
    lady(c, 480 + (i % 2 ? -40 : 40), 1540, 1.25, t + i, ink, lit(bg, .4));
    c.strokeStyle = C3.gold; c.lineWidth = 6; c.strokeRect(36, 36, 1008, 1848);
  }
  const PIV = { x: 70, y: 1880 };   // журналы раскрываются веером вокруг нижнего левого угла
  function fanK(t) { const a = T2; return eio(at(t, a.izy - .1, a.zh + .45)) }
  // помада → сигарета: m — превращение 0…1, rise — подъём из-под кадра, rib — красный ободок 0…1, ph — наклон торцом к камере 0…1
  function lipstick(c, t) {
    const a = T2, rise = eo(at(t, a.kr - .25, a.kr + .55)); if (rise <= 0) return;
    const tw = at(t, a.kr + .15, a.kon - .05), m = eio(at(t, a.kon - .05, a.kon + .55)), rib = eio(at(t, a.kot - .1, a.pom - .05)), ph = eio(at(t, a.tilt0, a.tilt1));
    const dy = 1500 * (1 - rise), x = LIP.x, y = LIP.y + dy, bw = LIP.bw, W = lp(LIP.w, bw, m);
    const ext = 330 * eo(tw), bodyL = lp(520, 1500, m), top = y - ext, slant = 70 * (1 - m), cb = Math.cos(ph * Math.PI / 2), sb = Math.sin(ph * Math.PI / 2);
    if (ph < .999) {
      c.save(); c.translate(x, top); c.scale(1, cb); c.translate(-x, -top);   // наклон: длина сжимается, торец становится кругом
      const tube = mixc('#D9A441', C3.white, m), col = mixc('#B98A2E', '#EDE7DC', m);
      rasterPoly(c, [x + W / 2, y + 30, x + W / 2 + 160, y + 150, x + W / 2 + 160, y + bodyL + 60, x + W / 2, y + bodyL], 'rgba(90,30,40,.3)', 9, 2.4);
      rr(c, x - W / 2, y, W, bodyL, lp(10, 22, m)); fill(c, tube); c.fillStyle = shd(tube, .22); c.fillRect(x + W * .22, y, W * .28, bodyL); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(x - W * .38, y + 20, W * .08, bodyL - 40);
      if (m < 1) A(c, 1 - m, () => { rr(c, x - LIP.w / 2 - 14, y - 22, LIP.w + 28, 44, 10); fill(c, col); c.fillStyle = shd(col, .2); c.fillRect(x + LIP.w * .2, y - 22, LIP.w * .34, 44);
        for (let i = 0; i < 4; i++) c.fillRect(x - LIP.w / 2 - 10, y + 70 + i * 26, LIP.w + 20, 5) });
      const tipH = lp(ext + 6, 170, m);   // стержень помады → красный кончик сигареты
      c.beginPath(); c.moveTo(x - bw / 2, y); c.lineTo(x - bw / 2, top + slant + 10); c.quadraticCurveTo(x - bw / 2, top + slant, x - bw / 2 + 14, top + slant - 4 * (1 - m));
      c.lineTo(x + bw / 2 - 14, top + 4); c.quadraticCurveTo(x + bw / 2, top, x + bw / 2, top + 14); c.lineTo(x + bw / 2, y); c.closePath();
      c.save(); c.clip(); c.fillStyle = C3.red; c.fillRect(x - bw / 2, top - 10, bw, Math.max(tipH, ext + 20) + 20);
      if (m > 0) { c.fillStyle = C3.white; c.fillRect(x - bw / 2, top + tipH, bw, bodyL + 400) }
      c.fillStyle = C3.redD; c.fillRect(x + bw * .22, top - 10, bw * .3, tipH + 10); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x - bw * .36, top + slant + 8, bw * .08, tipH - slant - 12); c.restore();
      if (rib > 0) {   // ободок — чистой лентой: обвивает кончик слева направо, без следа губ
        const ry = top + tipH - 14, e = 16; c.save(); c.beginPath(); c.rect(x - bw / 2 - 4, ry - e - 10, (bw + 8) * rib, e * 2 + 30); c.clip();
        c.beginPath(); c.ellipse(x, ry + 8, bw / 2 + 3, e, 0, 0, Math.PI); c.lineTo(x - bw / 2 - 3, ry - 10); c.ellipse(x, ry - 10, bw / 2 + 3, e, 0, Math.PI, 0, true); c.closePath(); fill(c, C3.redD);
        c.beginPath(); c.ellipse(x, ry - 4, bw / 2 + 3, e, 0, .15, Math.PI - .15); c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 3; c.stroke(); c.restore();
      }
      c.restore();
    }
    // торец: эллипс растёт в круг
    const R = bw / 2; c.beginPath(); c.ellipse(x, top, R, Math.max(1, R * sb), 0, 0, TAU); fill(c, ph > .5 ? C3.red : mixc('#E7D9C4', C3.red, ph * 2));
    if (ph > .2) { c.beginPath(); c.ellipse(x, top, R, Math.max(1, R * sb), 0, 0, TAU); c.strokeStyle = rgba('#FBFAF7', .8 * (1 - ss(.7, 1, ph))); c.lineWidth = 5; c.stroke() }
  }
  function w2World(c, t) {
    corridor(c, t, 12, 1);
    const kf = fanK(t);
    for (let i = MAGC.length - 1; i >= 0; i--) { const ang = (i + 1) * .21 * kf; if (ang <= .002) continue;
      c.save(); c.translate(PIV.x, PIV.y); c.rotate(ang); c.translate(-PIV.x, -PIV.y);
      castDots(c, 1080, 40, 10, 1880, 90, { col: 'rgba(90,30,50,.25)', st: 13 }); magCover(c, i, t); c.restore() }
    if (kf > 0) { castDots(c, 1080, 40, 10, 1880, 90 * kf, { col: 'rgba(90,30,50,.25)', st: 13 }); c.fillStyle = 'rgba(58,24,48,.55)'; c.fillRect(0, 0, 26 * kf, 1920) }   // корешок
    pageW2(c, t);
    lipstick(c, t);
    const kp = at(t, T2.myag + .15, T2.myag + .55) * (1 - at(t, T2.zh - .35, T2.zh + .05));
    if (kp > 0) plate(c, 'МЯГКИЕ, КАК МАЙ', 720, 1420, bo(kp), { s: 50, bg: '#3A1830', c: '#F6EBDD', ls: 3 });
  }
  function w2Shot(c, t) { const q = camObj(camAt(K2, t)); layer(c, q, 1, cc => w2World(cc, t)) }
  // ================= мир C (фразы 3–6): дом в разрезе. Внизу — «рынок»: круг рынка на стене серых пачек; наверху — лаборатория с мышью и лавка 1950-х;
  // над крышей — ночной Чикаго. Мир C вложен в торец сигареты мира 2: круг рынка = красный торец (камера ныряет в него).
  let TC = null, KC = null, NC2 = null;
  const MK = { x: 540, y: 860, R: 400 }, SLIT = .045;   // круг рынка; щель «Мальборо» — 2,6° (0,25 % — это 0,9°, тоньше не видно)
  const SLAB = [-420, -300], TOPY = -900, ROOF = [-2520, -2400], WALLX = [1480, 1560], SHOPX = 3900;
  const GRAYS = ['#5B5866', '#6C6977', '#4D4A57', '#7A7784'];
  function wcInit() {
    const w = (s, q, n) => Ws(s, q, n);
    TC = { a3: SA('s3'), pyat: w('s3', 'пятьдесят'), gor: w('s3', 'горстка'), zhen: w('s3', 'женщин'), chet: w('s3', 'четверть'), proc: w('s3', 'процента'), ryn: w('s3', 'рынка'), umer: w('s3', 'умерла'),
      spas: w('s4', 'спас'), strah: w('s4', 'страх'), uch: w('s4', 'учёные'), nam: w('s4', 'намазали'), smol: w('s4', 'смолой'), vyr: w('s4', 'выросли'), op: w('s4', 'опухоли'), amer: w('s4', 'америка'),
      vperv: w('s4', 'впервые'), dep: w('s4', 'депрессии'), stala: w('s4', 'стала'), men: w('s4', 'меньше'),
      kur: w('s5', 'курильщики'), bros: w('s5', 'бросились'), filt: w('s5', 'фильтром'), muzh: w('s5', 'мужчины'), stesn: w('s5', 'стеснялись'), schit: w('s5', 'считалось'), nezh: w('s5', 'неженок'),
      fil: w('s6', 'филип'), dar: w('s6', 'дарит'), vtor: w('s6', 'вторую'), filtr: w('s6', 'фильтр'), zhest: w('s6', 'жёсткую'), pach: w('s6', 'пачку'), otkr: w('s6', 'открывают'), shch: w('s6', 'щелчком'),
      vseh: w('s6', 'всех'), vidu: w('s6', 'виду'), chik: w('s6', 'чикагского'), rekl: w('s6', 'рекламщика'), leo: w('s6', 'лео'), bern: w('s6', 'бёрнетта'), end: SA('s7') - .02 };
    const a = TC;
    KC = [KY(a.pyat + .45, 540, 880, .96), KY(a.gor + .1, 540, 850, 1.0), KY(a.gor + .95, 546, 650, 1.38), KY(a.proc + .35, 545, 690, 1.24), KY(a.umer + .05, 548, 600, 1.3),
      KY(a.spas + .12, 552, 330, 1.22), KY(a.strah + .05, 470, -930, 1.12), KY(a.nam + .1, 430, -1060, 1.42), KY(a.smol + .2, 425, -1080, 1.55), KY(a.op + .25, 420, -1086, 1.64),
      KY(a.amer + .6, 780, -1080, .92), KY(a.men + .15, 960, -1100, .8), KY(a.bros + .45, 1650, -1060, .72), KY(a.filt + .35, 2350, -1010, .7), KY(a.muzh + .45, 2700, -1020, .74),
      KY(a.nezh - .45, 3010, -1080, 1.12), KY(a.nezh + .35, 3040, -1110, 1.32), KY(a.fil + .35, 3170, -1090, 1.14), KY(a.zhest + .05, 3200, -1080, 1.24),
      KY(a.otkr + .05, 3205, -1205, 1.72), KY(a.shch + .28, 3200, -1170, 1.42), KY(a.vidu, 3130, -1130, .94), KY(a.chik + .35, 3200, -1850, .8), KY(a.rekl + .35, 3240, -2950, .62),
      KY(a.leo + .05, 3420, -3260, .6), KY(a.bern - .02, BW.x + BW.wx, BW.y + BW.wy - 30, 1.05), KY(a.end - .32, BW.x + BW.wx, BW.y + BW.wy, 4.4), KY(a.end, BW.x + BW.wx, BW.y + BW.wy, 14.6)];   // нырок в окно — за 0,8 с, без рывка   // окно 200×140 закрывает кадр: дальше — мир 7
    // круг рынка = торец сигареты мира 2: радиус торца — LIP.bw / 2
    const m = (LIP.bw / 2) / MK.R; NC2 = { x: LIP.x, y: T2.top + (960 - MK.y) * m, m };
  }
  // ---------- «рынок»: стена серых пачек, прилавок ----------
  function packWall(c, q, x0, x1, y0, y1) {
    const v = viewRect(q), ax = Math.max(x0, v.x0 - 120), bx = Math.min(x1, v.x1 + 120), ay = Math.max(y0, v.y0 - 180), by = Math.min(y1, v.y1 + 180); if (ax >= bx || ay >= by) return;
    c.fillStyle = '#2A2630'; c.fillRect(ax, ay, bx - ax, by - ay);
    const SX = 120, SY = 190;
    for (let j = Math.floor((ay - y0) / SY); y0 + j * SY < by; j++) { const yy = y0 + j * SY; if (yy + SY < ay) continue;
      c.fillStyle = '#3A3542'; c.fillRect(ax, yy + 158, bx - ax, 14);   // полка
      for (let i = Math.floor((ax - x0) / SX) - 1; x0 + i * SX < bx; i++) { const xx = x0 + i * SX + (j % 2) * 30, col = GRAYS[Math.floor(H1(i * 3.1 + j * 7.7) * 4)], h = 120 + Math.floor(H1(i + j * 5) * 3) * 10;
        c.fillStyle = col; c.fillRect(xx + 14, yy + 158 - h, 86, h); c.fillStyle = shd(col, .25); c.fillRect(xx + 76, yy + 158 - h, 24, h); c.fillStyle = lit(col, .18); c.fillRect(xx + 14, yy + 158 - h, 86, h * .3) }
    }
  }
  // ---------- круг рынка: красный → серый с щелью; лупа с 5 женщинами; щель становится сигаретой с огоньком у края ----------
  function marketDisc(c, t) {
    const a = TC, { x, y, R } = MK, sw = eio(at(t, a.gor - .15, a.gor + .75)), sl = SLIT, top = -Math.PI / 2;
    castCirc(c, x, y, R, 150, { col: 'rgba(8,6,14,.5)', st: 16 });
    circ(c, x, y, R, C3.red);
    if (sw > 0) {   // серые марки заливают круг по часовой, «Мальборо» остаётся щелью наверху
      const a0 = top + sl / 2, a1 = a0 + (TAU - sl) * sw;
      for (let k = 0; k < 9; k++) { const s0 = a0 + (TAU - sl) * k / 9, s1 = a0 + (TAU - sl) * (k + 1) / 9; if (s0 >= a1) break;
        c.beginPath(); c.moveTo(x, y); c.arc(x, y, R, s0, Math.min(s1, a1)); c.closePath(); fill(c, GRAYS[k % 4]) }
      for (let k = 1; k < 9; k++) { const s0 = a0 + (TAU - sl) * k / 9; if (s0 >= a1) break; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(s0) * R, y + Math.sin(s0) * R); lnB(c, 3, 'rgba(255,255,255,.25)') }
    }
    c.save(); c.beginPath(); c.arc(x, y, R, 0, TAU); c.clip(); c.fillStyle = 'rgba(0,0,0,.16)'; c.fillRect(x + R * .5, y - R, R, R * 2); c.restore();
    ring(c, x, y, R, 'rgba(255,255,255,.55)', 4);
    const kc = eio(at(t, a.proc - .25, a.proc + .35)), em = 1 - .85 * eio(at(t, a.umer - .2, a.umer + .6));   // щель → сигарета: лежит от центра к краю, огонёк у края
    if (kc > 0) { const w = lp(R * Math.tan(sl / 2) * 2, 26, kc); c.save(); c.translate(x, y); c.rotate(top);
      rr(c, 0, -w / 2, R - 6, w, w / 2); fill(c, mixc(C3.red, C3.white, kc)); c.fillStyle = C3.red; c.fillRect(0, -w / 2, 60 * kc, w);
      c.fillStyle = mixc(C3.red, '#3a2a26', kc); c.fillRect(R - 26, -w / 2, 20, w); const er = 13 * kc; circ(c, R - 12, 0, er, mixc('#4a3a34', C3.ember, em));
      if (em > .3) glow(c, R - 12, 0, 34, C3.ember, .45 * kc * em); c.restore() }
    const kl = eo(at(t, a.gor + .3, a.gor + .9)) * (1 - eio(at(t, a.proc - .1, a.proc + .4)));   // лупа над щелью
    if (kl > 0) { const lx = x + 12, ly = y - R + 120 - (1 - kl) * 260, LR = 112; c.save(); c.globalAlpha *= Math.min(1, kl * 2);
      c.save(); c.translate(lx + 92, ly + 92); c.rotate(.78); rr(c, -14, 0, 28, 190, 10); fill(c, '#3A2A1E'); c.restore();
      circ(c, lx, ly, LR + 12, C3.gold); c.save(); c.beginPath(); c.arc(lx, ly, LR, 0, TAU); c.clip(); c.fillStyle = '#5B5866'; c.fillRect(lx - LR, ly - LR, LR * 2, LR * 2);
      c.fillStyle = C3.red; c.fillRect(lx - 70 - 12, ly - LR, 140, LR * 2);   // щель под лупой — широкая
      for (let i = 0; i < 5; i++) fig(c, lx - 52 + i * 26, ly + 56, .26, { col: '#F4F1EA', hc: C3.rose2 });
      c.fillStyle = 'rgba(255,255,255,.18)'; poly(c, [lx - LR, ly + 20, lx - 20, ly - LR, lx + 10, ly - LR, lx - LR, ly + 50]); c.fill(); c.restore();
      ring(c, lx, ly, LR + 6, '#8A6A2A', 4); c.restore() }
  }
  // дым: тонкая струйка от огонька; на «Спас» выше перекрытия становится хвостом мыши
  const TAILP = [[540, 470], [552, 330], [528, 190], [556, 40], [536, -110], [548, -250], [560, -420], [590, -560], [612, -700], [600, -820], [640, -930], [690, -985]];
  function tailOrSmoke(c, t, q) {
    const a = TC, rise = eo(at(t, a.umer - .1, a.umer + .9)); if (rise <= 0) return;
    const n = TAILP.length, top = lp(470, -985, rise), pts = [];
    for (let i = 0; i < n; i++) { const p = TAILP[i]; if (p[1] < top) break; const wob = Math.sin(t * 2.2 + i * .9) * 10 * (1 - at(t, a.spas - .2, a.spas + .5)); pts.push(p[0] + wob, p[1]) }
    if (pts.length < 4) return;
    const kt = eio(at(t, a.spas - .15, a.spas + .55));   // хвост: выше пола лаборатории дым розовеет и толстеет
    for (let i = 2; i < pts.length; i += 2) { const y0 = pts[i - 1], y1 = pts[i + 1], up = y1 < SLAB[0] ? kt : 0, u = i / pts.length;
      c.strokeStyle = up > 0 ? mixc('#C7C2CF', '#E9A9B4', up) : rgba('#C7C2CF', .7 * (1 - u * .4)); c.lineWidth = up > 0 ? lp(7, 16 - u * 4, up) : 7 + u * 6; c.lineCap = 'round';
      c.beginPath(); c.moveTo(pts[i - 2], y0); c.lineTo(pts[i], y1); c.stroke() }
  }
  // ---------- лаборатория ----------
  function labRoom(c, t, q) {
    const v = viewRect(q); if (v.y0 > SLAB[0] + 10 || v.y1 < ROOF[1] - 10) return;
    const x0 = -1600, x1 = WALLX[0];
    c.fillStyle = '#123A3E'; c.fillRect(x0, ROOF[1], x1 - x0, SLAB[0] - ROOF[1]);
    c.strokeStyle = 'rgba(126,214,210,.08)'; c.lineWidth = 2; c.beginPath(); for (let gx = x0; gx < x1; gx += 80) { c.moveTo(gx, ROOF[1]); c.lineTo(gx, SLAB[0]) } for (let gy = ROOF[1]; gy < SLAB[0]; gy += 80) { c.moveTo(x0, gy); c.lineTo(x1, gy) } c.stroke();
    poly(c, [180, ROOF[1], 300, ROOF[1], 760, SLAB[0], 220, SLAB[0]]); fill(c, 'rgba(190,240,236,.07)'); poly(c, [900, ROOF[1], 980, ROOF[1], 1400, SLAB[0], 1000, SLAB[0]]); fill(c, 'rgba(190,240,236,.05)');   // косые лучи холодной лампы
    c.fillStyle = '#0E2B2E'; rr(c, 200, ROOF[1], 120, 40, 8); c.fill(); rr(c, 900, ROOF[1], 120, 40, 8); c.fill(); c.fillStyle = '#CFF6F2'; c.fillRect(214, ROOF[1] + 34, 92, 10); c.fillRect(914, ROOF[1] + 34, 92, 10);
    [[-1300, -1700], [-1300, -1350], [-760, -1700], [-760, -1350], [1000, -1760], [1000, -1460]].forEach(([sx, sy], i) => {   // полки с колбами
      c.fillStyle = '#0B2427'; c.fillRect(sx, sy, 420, 16);
      for (let k = 0; k < 4; k++) { const fx = sx + 40 + k * 100, h = 70 + H1(i * 4 + k) * 70, col = ['#3FB6A8', '#7ED6CF', '#E7A9B6', '#F2B84B'][(i + k) % 4];
        c.beginPath(); c.moveTo(fx, sy); c.lineTo(fx, sy - h * .55); c.lineTo(fx + 12, sy - h * .55); c.lineTo(fx + 12, sy - h); c.lineTo(fx + 30, sy - h); c.lineTo(fx + 30, sy - h * .55); c.lineTo(fx + 42, sy - h * .55); c.lineTo(fx + 42, sy); c.closePath(); fill(c, rgba(col, .75)); lnB(c, 2.5, 'rgba(230,250,248,.5)') } });
    c.fillStyle = '#0B2427'; c.fillRect(WALLX[0], ROOF[1], WALLX[1] - WALLX[0], SLAB[0] - ROOF[1]);   // стена между лабораторией и лавкой
  }
  function table(c, x0, x1) { c.fillStyle = '#5A3A26'; c.fillRect(x0, TOPY, x1 - x0, 34); c.fillStyle = '#7A5135'; c.fillRect(x0, TOPY, x1 - x0, 8); c.fillStyle = '#3E2718'; for (let lx = x0 + 40; lx < x1; lx += 520) c.fillRect(lx, TOPY + 34, 26, SLAB[0] - TOPY - 34) }
  // мышь в профиль (смотрит влево): тело, голова, ухо, глаз; выбритый квадрат на спине; смола, пятно, кольцо тревоги
  const MOUSE = { x: 470, y: TOPY - 4 };
  function mouse(c, t) {
    const a = TC, { x, y } = MOUSE, br = Math.sin(t * 3.1) * 3;
    c.save(); c.translate(x, y);
    rasterPoly(c, [-150, 0, 190, 0, 240, 60, -110, 60], 'rgba(5,20,22,.4)', 9, 2.3);
    c.beginPath(); c.ellipse(20, -96 - br * .3, 190, 96 + br * .2, 0, 0, TAU); fill(c, '#F4F1EA');
    c.beginPath(); c.moveTo(-140, -110); c.quadraticCurveTo(-230, -110, -268, -64); c.quadraticCurveTo(-232, -30, -150, -40); c.closePath(); fill(c, '#F4F1EA');
    circ(c, -270, -64, 9, '#E9A9B4'); circ(c, -196, -86, 9, '#1A1214');
    c.beginPath(); c.ellipse(-150, -170, 46, 58, -.3, 0, TAU); fill(c, '#F4F1EA'); c.beginPath(); c.ellipse(-150, -168, 28, 38, -.3, 0, TAU); fill(c, '#E9A9B4');
    c.save(); c.beginPath(); c.ellipse(20, -96, 190, 96, 0, 0, TAU); c.clip(); c.fillStyle = shd('#F4F1EA', .22); c.fillRect(110, -200, 140, 220); c.restore();
    [[-90, 0], [-20, 0], [80, 0], [150, 0]].forEach(([fx]) => { rr(c, fx - 14, -14, 34, 16, 8); fill(c, '#E9A9B4') });
    const SQ = { x: -10, y: -186, w: 116, h: 64 }; rr(c, SQ.x, SQ.y, SQ.w, SQ.h, 8); fill(c, '#EDB5BE');
    const pt = at(t, a.nam + .25, a.smol + .35); if (pt > 0) { c.save(); rr(c, SQ.x, SQ.y, SQ.w, SQ.h, 8); c.clip(); c.fillStyle = '#16100E';
      for (let s = 0; s < 4; s++) { const k = cl(pt * 4 - s); if (k <= 0) break; c.fillRect(SQ.x - 4, SQ.y + s * SQ.h / 4 - 2, (SQ.w + 8) * k, SQ.h / 4 + 4) } c.restore() }
    const sp = eo(at(t, a.vyr - .1, a.op + .2)); if (sp > 0) { c.beginPath(); c.ellipse(SQ.x + 64, SQ.y + 26, 36 * sp, 20 * sp, 0, 0, TAU); fill(c, '#3A0E14'); c.beginPath(); c.ellipse(SQ.x + 56, SQ.y + 20, 14 * sp, 7 * sp, 0, 0, TAU); fill(c, '#6A1A22') }
    for (let k = 0; k < 2; k++) { const u = at(t, a.op + k * .45, a.op + .7 + k * .45); if (u <= 0 || u >= 1) continue; ring(c, SQ.x + 64, SQ.y + 26, 50 + 110 * eo(u), rgba('#E23A4E', .9 * (1 - u)), 7) }
    c.restore();
  }
  // кисть в стальном зажиме (без рук): штатив на столе, зажим едет сам
  function brushPos(t) {
    const a = TC, P = [[a.uch - .4, 760, -1240], [a.nam - .15, 900, -1005], [a.nam + .2, 900, -1060], [a.nam + .45, 560, -1135], [a.nam + .75, 420, -1130], [a.nam + 1.05, 560, -1120], [a.smol, 420, -1112], [a.smol + .3, 560, -1100], [a.smol + .6, 560, -1210],
      [a.amer - .1, 590, -1180], [a.amer + .15, 600, TOPY - 8], [a.amer + 1.4, 1560, TOPY - 8], [a.amer + 1.9, 1700, -1200]];
    if (t <= P[0][0]) return [P[0][1], P[0][2]]; for (let i = 1; i < P.length; i++) if (t < P[i][0]) { const k = eio((t - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return [lp(P[i - 1][1], P[i][1], k), lp(P[i - 1][2], P[i][2], k)] }
    return [P[P.length - 1][1], P[P.length - 1][2]];
  }
  function brushRig(c, t) {
    const [bx, by] = brushPos(t), sx = 760;
    c.fillStyle = '#9AA6B2'; c.fillRect(sx - 60, TOPY - 16, 120, 16); c.fillRect(sx - 8, -1560, 16, TOPY - 16 + 1560); c.fillStyle = '#6E7A86'; c.fillRect(sx + 2, -1560, 6, TOPY + 1544);
    c.fillStyle = '#AAB6C2'; c.fillRect(Math.min(sx, bx), by - 190, Math.abs(bx - sx) + 10, 12); rr(c, bx - 22, by - 210, 44, 40, 8); fill(c, '#C9D2DC'); rr(c, bx - 22, by - 210, 44, 40, 8); lnB(c, 2, '#6E7A86');
    rr(c, bx - 9, by - 170, 18, 110, 6); fill(c, '#B9875A'); c.fillStyle = '#C9D2DC'; c.fillRect(bx - 11, by - 66, 22, 18);
    c.beginPath(); c.moveTo(bx - 12, by - 48); c.lineTo(bx + 12, by - 48); c.lineTo(bx + 4, by); c.lineTo(bx - 4, by); c.closePath(); fill(c, '#16100E');
  }
  function tarJar(c) { const x = 900, y = TOPY; rasterPoly(c, [x + 70, y - 120, x + 150, y - 60, x + 150, y + 4, x + 70, y], 'rgba(5,20,22,.4)', 9, 2.3);
    rr(c, x - 70, y - 150, 140, 150, 16); fill(c, 'rgba(170,220,220,.35)'); c.fillStyle = '#16100E'; c.fillRect(x - 64, y - 100, 128, 96); rr(c, x - 76, y - 168, 152, 26, 8); fill(c, '#3A2A1E');
    plate(c, 'СМОЛА', x, y - 52, 1, { s: 22, bg: '#F4F1EA', c: '#16100E', sh: false, ls: 1 }); rr(c, x - 70, y - 150, 140, 150, 16); lnB(c, 3, 'rgba(230,250,248,.6)') }
  // ---------- график: мазок кисти — ось; торцы сигарет подпрыгивают и вытягивают столбики продаж ----------
  const BARS = [300, 330, 352, 372, 394, 414, 428, 392], BX0 = 1000, BDX = 64;
  function barX(i) { return BX0 + i * BDX }
  function strokeAxis(c, t) { const a = TC, k = at(t, a.amer + .15, a.amer + 1.4); if (k <= 0) return; const [bx] = brushPos(t); c.fillStyle = '#16100E'; c.fillRect(600, TOPY - 12, Math.max(0, Math.min(bx, 1560) - 600), 12) }
  function bars(c, t) {
    const a = TC, kp = eio(at(t, a.bros - .1, a.bros + .55));   // на «бросились» столбики оседают в пачки
    if (kp >= 1) return;
    BARS.forEach((h, i) => { const t0 = a.amer + .7 + i * .26, j = at(t, t0, t0 + .3), g = eio(at(t, t0 + .2, t0 + .75)), x = barX(i); if (j <= 0) return;
      const hop = Math.sin(Math.PI * cl(j)) * 46 * (1 - g), H = lp(0, i < 7 ? h : h, g) * (1 - kp) + 140 * kp, y = TOPY - 12 - hop;
      if (H > 4) { rr(c, x - 22, y - H, 44, H, 8); fill(c, i === 7 ? '#F4D8D8' : C3.white); c.fillStyle = 'rgba(0,0,0,.14)'; c.fillRect(x + 6, y - H, 16, H); c.fillStyle = C3.filt; c.fillRect(x - 22, y - H, 44, Math.min(H, 24)) }
      c.beginPath(); c.ellipse(x, y - H, 22, 9, 0, 0, TAU); fill(c, '#E8D6B8'); circ(c, x, y - H, 5, '#B76E3A') });
    const kd = eo(at(t, a.men - .25, a.men + .3)) * (1 - kp); if (kd > 0) { const x = barX(7), y = TOPY - 12 - 392 - 90;
      c.save(); c.translate(x, y - 30 * (1 - kd)); c.globalAlpha *= kd; c.fillStyle = '#E23A4E'; c.fillRect(-8, -80, 16, 70); poly(c, [-30, -14, 30, -14, 0, 26]); c.fill(); c.restore();
      tx(c, 'КУРЯТ МЕНЬШЕ ↓', 1230, TOPY - 760, { f: 'M', w: 800, s: 64 * bo(kd), c: '#F4F1EA', a: kd }) }
  }
  // ---------- лавка 1950-х ----------
  function shopRoom(c, t, q) {
    const v = viewRect(q); if (v.x1 < WALLX[1] - 10 || v.y0 > SLAB[0] + 10 || v.y1 < ROOF[1] - 10) return;
    const x0 = WALLX[1], x1 = SHOPX + 1600;
    c.fillStyle = '#2F5E5A'; c.fillRect(x0, ROOF[1], x1 - x0, SLAB[0] - ROOF[1]); c.fillStyle = '#28524E'; c.fillRect(x0, -1500, x1 - x0, 1080);
    rr(c, 2050, -2150, 700, 520, 10); fill(c, '#1C2748'); c.save(); rr(c, 2050, -2150, 700, 520, 10); c.clip();   // окно: улица 1950-х, фонарь
    c.fillStyle = '#26345E'; c.fillRect(2050, -1830, 700, 200); for (let i = 0; i < 6; i++) { c.fillStyle = '#18213F'; c.fillRect(2070 + i * 120, -1960 - H1(i) * 120, 96, 420) }
    c.fillStyle = '#E8D49A'; for (let i = 0; i < 6; i++) for (let k = 0; k < 4; k++) if (H1(i * 9 + k) > .45) c.fillRect(2090 + i * 120, -1930 - H1(i) * 120 + k * 60, 22, 26);
    c.fillStyle = '#0E1430'; c.fillRect(2560, -2100, 14, 470); circ(c, 2567, -2105, 20, '#FDE68A'); beam(c, 2567, -2100, 2567, -1640, 14, 120, '#FDE68A', .25); c.restore();
    rr(c, 2050, -2150, 700, 520, 10); lnB(c, 10, '#DCD3BE'); c.fillStyle = '#DCD3BE'; c.fillRect(2394, -2150, 12, 520);
    for (let i = 0; i < 4; i++) { poly(c, [1800 + i * 520, SLAB[0], 2000 + i * 520, SLAB[0], 2300 + i * 520, -600, 2100 + i * 520, -600]); fill(c, 'rgba(253,230,138,.06)') }   // косые полосы света на полу
    c.fillStyle = '#4A3226'; c.fillRect(x0, -620, x1 - x0, 200);   // пол лавки
    c.fillStyle = '#1D3B38'; c.fillRect(SHOPX + 600, ROOF[1], 60, SLAB[0] - ROOF[1]);
  }
  // пачки на прилавке: обезличенные, сверху белые фильтры
  function pack5(c, x, y, s, col, o = {}) {
    const w = 92 * s, h = 136 * s; rasterPoly(c, [x + w, y - h + 10, x + w + 40 * s, y - h + 30, x + w + 40 * s, y + 8, x + w * .2, y + 8, x, y], 'rgba(8,24,22,.35)', 7, 2);
    if (o.filt) for (let k = 0; k < 3; k++) { const fx = x + w * (.22 + k * .28), fy = y - h - 16 * s - (k % 2) * 8 * s; rr(c, fx - 9 * s, fy, 18 * s, 30 * s, 4); fill(c, '#F4F1EA') }
    c.fillStyle = col; c.fillRect(x, y - h, w, h); c.fillStyle = shd(col, .25); c.fillRect(x + w * .74, y - h, w * .26, h); c.fillStyle = lit(col, .3); c.fillRect(x, y - h, w, h * .22);
    c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(x + w * .14, y - h * .56, w * .5, 8 * s);
  }
  const SHELF = [1900, 2040, 2180, 2320, 2460, 2600, 2740, 2880], OLDP = 3150;   // где встают пачки; старая мягкая пачка Mild as May — с краю
  // толпа белых фигурок: бегут к фильтрам; мужчины тормозят и разворачиваются
  function crowd(c, t) {
    const a = TC, run = at(t, a.bros - .2, a.bros + 1.6); if (run <= 0) return;
    for (let i = 0; i < 12; i++) { const m = i % 3 !== 1, x0 = SHOPX + 500 + i * 120, xt = 1950 + (i % 8) * 120 + (m ? 40 : 0), turn = m ? eo(at(t, a.muzh - .05 + (i % 3) * .08, a.muzh + .35 + (i % 3) * .08)) : 0;
      const back = m ? eio(at(t, a.stesn, a.nezh + .2)) * 340 : 0, x = lp(x0, xt + (m ? 260 : 0), eo(run)) + back, bob = Math.abs(Math.sin(t * 9 + i)) * 12 * (1 - at(t, a.bros + 1.2, a.bros + 1.7));
      const look = m ? eio(at(t, a.shch - .05, a.shch + .4)) : 0, dir = m ? (turn > .5 ? (look > .5 ? -1 : 1) : -1) : -1;
      fig(c, x, SLAB[0] - 200 + 6 - bob, 1.55, { m, hat: m && i % 2 === 0, dir, col: '#F4F1EA', hc: C3.rose2 }) }
  }
  function shelfPacks(c, t) {
    const a = TC, kp = eio(at(t, a.bros - .1, a.bros + .55)), sl = eio(at(t, a.bros + .2, a.bros + 1.3)); if (kp <= 0) return;
    SHELF.forEach((tx0, i) => { if (i >= BARS.length) return; const x = lp(barX(i) - 46, tx0, sl); A(c, kp, () => pack5(c, x, TOPY - 12, 1, GRAYS[i % 4], { filt: true })) });
  }
  // пудреница защёлкивается вокруг фильтра; на «Филип» трескается
  function compact(c, t) {
    const a = TC, k = eio(at(t, a.schit - .2, a.nezh + .05)), cr = at(t, a.fil - .15, a.fil + .25); if (k <= 0) return;
    const x = 2880 + 46, y = TOPY - 12 - 136 - 40, R = 62, op = 1 - eio(at(t, a.nezh - .25, a.nezh + .02)), fall = eio(at(t, a.fil + .15, a.fil + .7));
    c.save(); c.translate(x, y + fall * 600); c.rotate(fall * .8); c.globalAlpha *= Math.min(1, k * 2);
    c.save(); c.translate(0, 0); c.rotate(-op * 1.9); c.beginPath(); c.arc(0, 0, R, Math.PI, TAU); c.closePath(); fill(c, '#E7A9B6'); c.beginPath(); c.arc(0, -4, R * .7, Math.PI, TAU); c.closePath(); fill(c, '#DDEFF4'); c.restore();
    c.beginPath(); c.arc(0, 0, R, 0, Math.PI); c.closePath(); fill(c, '#D88A9C'); c.beginPath(); c.arc(0, 0, R * .55, .2, Math.PI - .2); fill(c, '#F1C3CC'); ring(c, 0, 0, R, '#C9A24A', 4);
    if (cr > 0) { c.beginPath(); c.moveTo(-R, 0); c.lineTo(-20, 18); c.lineTo(8, -6); c.lineTo(40, 22); c.lineTo(R, 6); lnB(c, 4 * cr, '#5a1a2a') }
    c.restore();
    const kp = at(t, a.nezh - .1, a.nezh + .3) * (1 - at(t, a.fil - .3, a.fil + .1)); if (kp > 0) tx(c, 'ДЛЯ НЕЖЕНОК', 2980, TOPY - 520, { f: 'M', w: 800, s: 70 * bo(kp), c: '#F1C3CC', a: Math.min(1, kp * 2) });
  }
  // старая мягкая пачка → на «Филип» сверху падают жёсткие стенки и захлопываются — новая пачка Marlboro; на «щелчком» крышка откидывается
  const PK = { x: OLDP - 95, y: TOPY - 12, w: 190, h: 282 };
  function hardPack(c, t) {
    const a = TC, d = at(t, a.fil - .05, a.fil + .5), slam = eio(d), { x, y, w, h } = PK, top = y - h;
    if (slam < 1) softPack(c, x, top, w, h, 30, { shc: 'rgba(8,24,22,.35)' });
    if (d > 0 && slam < 1) { c.save(); c.translate(0, -(1 - ei(d)) * 1100); mPack(c, x, top, w, h, 34, { shadow: false }); c.restore() }   // жёсткая пачка падает сверху и накрывает мягкую
    if (slam >= 1) { const u = at(t, a.fil + .45, a.fil + .85); if (u > 0 && u < 1) for (let k = 0; k < 6; k++) { const s2 = k < 3 ? -1 : 1, yy = y - 20 - (k % 3) * 40; c.beginPath(); c.moveTo(x + w / 2 + s2 * (w / 2 + 20 + 60 * u), yy); c.lineTo(x + w / 2 + s2 * (w / 2 + 70 + 120 * u), yy - 10); lnB(c, 5, rgba('#F4F1EA', 1 - u)) } }
    if (slam >= 1) {
      const lid = eio(at(t, a.shch - .08, a.shch + .22)), seam = at(t, a.otkr - .35, a.shch - .1);
      if (lid > 0) {   // открытая пачка: сигареты с фильтром цвета пробки
        const ris = at(t, a.chik - .2, a.rekl + .6); c.save(); c.beginPath(); c.rect(-1e4, ROOF[1], 2e4, 1e4); c.clip();   // выше крыши — уже башни
        CIGS.forEach((cg, i) => { const lift = 60 + cg.h * eio(cl(ris * 1.25 - i * .1)); const cx = x + w * cg.u;
          rr(c, cx - 17, top - lift, 34, lift + 30, 6); fill(c, C3.white); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(cx + 4, top - lift, 13, lift + 30); c.fillStyle = C3.cork; c.fillRect(cx - 17, top - lift, 34, 44);
          c.fillStyle = 'rgba(120,70,30,.35)'; for (let s = 0; s < 3; s++) c.fillRect(cx - 17, top - lift + 8 + s * 12, 34, 3) }); c.restore() }
      mPack(c, x, top, w, h, 34, { shc: 'rgba(8,24,22,.35)' });
      if (seam > 0 && lid <= 0) { const sx = x + w * eio(seam); c.fillStyle = '#FFF6D6'; c.fillRect(x, top + h * .3, sx - x, 5); glow(c, sx, top + h * .3, 40, '#FFF1B8', .8) }
      if (lid > 0) { c.save(); c.translate(x + w, top + h * .3); c.rotate(-lid * 2.1); PL(c, [-w, 0, 0, 0, 0, -h * .3, -w, -h * .3], C3.white); PL(c, [-w, -h * .3, 0, -h * .3, -w / 2, -h * .3 + h * .17], C3.red); c.restore() }
      for (let k = 0; k < 2; k++) { const u = at(t, a.shch + k * .18, a.shch + .7 + k * .18); if (u > 0 && u < 1) ring(c, x + w / 2, top, 60 + 260 * eo(u), rgba('#FFF1B8', .8 * (1 - u)), 6) }
    }
  }
  const CIGS = [{ u: .2, h: 1700 }, { u: .4, h: 2300 }, { u: .6, h: 1950 }, { u: .8, h: 2500 }];
  // ---------- ночной Чикаго над крышей ----------
  const BW = { x: 3920, y: -3560, w: 520, h: 820, wx: 150, wy: 300 };   // дом Бёрнетта (с косым разрезом), окно — (x + wx, y + wy)
  function chicago(c, t, q) {
    const a = TC; if (viewRect(q).y0 > ROOF[0] + 20) return;
    c.fillStyle = '#0D1230'; c.fillRect(-1600, -9000, 9000, 9000 + ROOF[0]);
    c.fillStyle = '#171D45'; c.fillRect(-1600, ROOF[0] - 700, 9000, 700);
    circ(c, 3150, -3900, 120, '#F3EBDD'); circ(c, 3110, -3930, 22, '#DCD3BE'); circ(c, 3190, -3860, 14, '#DCD3BE');
    for (let i = 0; i < 26; i++) { const bx = 1500 + i * 150, h = 300 + H1(i * 2.7) * 520; c.fillStyle = i % 2 ? '#141A3E' : '#1A2150'; c.fillRect(bx, ROOF[0] - h, 130, h);
      c.fillStyle = 'rgba(253,230,138,.5)'; for (let k = 0; k < h / 60 - 1; k++) for (let m = 0; m < 3; m++) if (H1(i * 31 + k * 7 + m) > .6) c.fillRect(bx + 18 + m * 36, ROOF[0] - h + 30 + k * 60, 18, 24) }
    const sl = eo(at(t, a.leo - .4, a.bern + .1)); if (sl > 0) burnett(c, t, sl);
  }
  function burnett(c, t, sl) {   // дом с косым разрезом (WoT #076): в светлом окне — стол, ваза красных яблок, стакан толстых чёрных карандашей
    const { x, y, w, h, wx, wy } = BW, dx = (1 - sl) * 1400; c.save(); c.translate(dx, 0);
    c.fillStyle = '#20285A'; c.fillRect(x, y, w, h + 3000); PL(c, [x + w, y, x + w + 60, y + 60, x + w + 60, y + h + 3000, x + w, y + h + 3000], '#161C44');
    PL(c, [x, y + 60, x + w, y - 40, x + w, y + 10, x, y + 110], '#2C356E');
    for (let k = 0; k < 14; k++) for (let m = 0; m < 4; m++) if (!(k === 2 && m < 2)) { c.fillStyle = H1(k * 5 + m) > .55 ? 'rgba(253,230,138,.45)' : '#141A3E'; c.fillRect(x + 40 + m * 120, y + 150 + k * 110, 70, 60) }
    c.fillStyle = '#FFE9B0'; c.fillRect(x + wx - 100, y + wy - 70, 200, 140);
    c.save(); c.beginPath(); c.rect(x + wx - 100, y + wy - 70, 200, 140); c.clip(); inNest(c, NC7(), cc => officeW7(cc, t)); c.restore();
    c.strokeStyle = '#DCD3BE'; c.lineWidth = 6; c.strokeRect(x + wx - 100, y + wy - 70, 200, 140);
    c.restore();
    const kp = at(t, TC.bern - .1, TC.bern + .3) * (1 - at(t, TC.end - .55, TC.end - .25)); if (kp > 0) plate(c, 'ЛЕО БЁРНЕТТ · РЕКЛАМЩИК, ЧИКАГО', x + wx + 40, y + wy - 190, bo(kp), { s: 58, bg: '#F3EBDD', c: '#141010', ls: 2 });
  }
  // сигареты из пачки растут небоскрёбами: выше крыши у них окна и ступени ар-деко
  function towers(c, t) {
    const a = TC, ris = at(t, a.chik - .2, a.rekl + .6); if (ris <= 0) return; const { x, y, w, h } = PK, top = y - h;
    CIGS.forEach((cg, i) => { const lift = 60 + cg.h * eio(cl(ris * 1.25 - i * .1)), yt = top - lift, k = eio(at(yt, ROOF[0] + 100, ROOF[0] - 900)); if (yt > ROOF[0]) return;
      const W = lp(34, 250, k), cx = x + w * cg.u + (cg.u - .5) * 1500 * k, yb = ROOF[0];
      c.fillStyle = '#E9E4DA'; c.fillRect(cx - W / 2, yt, W, yb - yt); c.fillStyle = 'rgba(20,20,40,.28)'; c.fillRect(cx + W * .12, yt, W * .38, yb - yt);
      if (k > .3) { c.fillStyle = rgba('#FDE68A', .85 * at(k, .3, .7)); for (let r = 0; r < (yb - yt - 130) / 52; r++) for (let m = 0; m < 4; m++) if (H1(i * 41 + r * 3 + m) > .38) c.fillRect(cx - W / 2 + 14 + m * (W - 28) / 4, yt + 120 + r * 52, (W - 28) / 4 - 12, 24) }
      c.fillStyle = C3.cork; c.fillRect(cx - W / 2, yt, W, 44 + 30 * k); PL(c, [cx - W * .34, yt, cx - W * .18, yt - 90 * k, cx + W * .18, yt - 90 * k, cx + W * .34, yt], C3.cork); c.fillRect(cx - 5, yt - 160 * k, 10, 70 * k) });
    c.fillStyle = '#1A1720'; c.fillRect(-1600, ROOF[0], SHOPX + 3200, ROOF[1] - ROOF[0]);   // крыша поверх — стык ствола и башни не виден
  }
  function wcWorld(c, t, q) {
    const a = TC;
    chicago(c, t, q);
    c.fillStyle = '#1A1720'; c.fillRect(-1600, ROOF[0], SHOPX + 3200, ROOF[1] - ROOF[0]);   // крыша
    labRoom(c, t, q); shopRoom(c, t, q);
    packWall(c, q, -1600, SHOPX + 1600, SLAB[1], 1500);
    c.fillStyle = '#1A1720'; c.fillRect(-1600, SLAB[0], SHOPX + 3200, SLAB[1] - SLAB[0]); c.fillStyle = '#0E0C12'; rr(c, 500, SLAB[0] - 4, 120, SLAB[1] - SLAB[0] + 8, 10); c.fill();   // перекрытие с решёткой
    c.fillStyle = '#5A3A26'; c.fillRect(-1600, 1500, SHOPX + 3200, 220); c.fillStyle = '#7A5135'; c.fillRect(-1600, 1500, SHOPX + 3200, 10); c.fillStyle = '#1A1420'; c.fillRect(-1600, 1720, SHOPX + 3200, 2000);
    marketDisc(c, t);
    const kr = at(t, a.proc + .1, a.proc + .45) * (1 - at(t, a.spas - .3, a.spas + .1)); if (kr > 0) plate(c, '0,25 % РЫНКА', 540, 1040, bo(kr), { s: 62, bg: '#F4F1EA', c: '#141010', ls: 2 });
    table(c, -300, SHOPX + 400); mouse(c, t); tarJar(c); strokeAxis(c, t); bars(c, t); shelfPacks(c, t);
    hardPack(c, t); compact(c, t); towers(c, t); crowd(c, t); brushRig(c, t);
    tailOrSmoke(c, t, q);
  }
  function wcShot(c, t) { const q = camObj(camAt(KC, t)); layer(c, q, 1, cc => wcWorld(cc, t, q));
    layer(c, q, 1.3, cc => { const v = viewRect(q); if (v.y1 < SLAB[0] - 600 || v.y0 > SLAB[0] + 400) return;   // шестигранники смолы плывут мимо камеры
      for (let i = 0; i < 9; i++) { const hx = -200 + i * 260 + Math.sin(t * .5 + i) * 30, hy = -1500 + H1(i * 3) * 900 + ((t * 40 + i * 111) % 600) - 300, R = 26 + H1(i) * 18;
        cc.beginPath(); for (let k = 0; k < 6; k++) { const an = k * Math.PI / 3; cc.lineTo(hx + Math.cos(an) * R, hy + Math.sin(an) * R) } cc.closePath(); lnB(cc, 3, 'rgba(160,230,224,.28)') } });
  }
  // ================= мир 7 (фраза 7): кабинет Бёрнетта — в координатах мира 1: лист на чертёжной доске = плакат щита (BB). Толстый чёрный карандаш сам рисует ковбоя (#091),
  // набросок заливается цветом, лист становится плакатом — и мир 7 незаметно меняется на щит у трассы (видно только лист), камера отъезжает (#041).
  let T7 = null, K7 = null, RIDS = null, RIDC = null, PEN7 = null;
  const NC7 = () => ({ x: BW.x + BW.wx, y: BW.y + BW.wy + (960 - 765) * (200 / 1500), m: 200 / 1500 });   // окно дома Бёрнетта (200×140) показывает кабинет 1500×1050 с центром (540, 765)
  const RB = { x0: 96, x1: 610, y0: 540, y1: 960 };   // рамка всадника на листе (мир 1)
  function w7Init() {
    const s = 's7';
    T7 = { a: SA(s), stav: Ws(s, 'ставит'), rekl: Ws(s, 'рекламу'), kov: Ws(s, 'ковбоя'), slov: Ws(s, 'словам'), sam: Ws(s, 'самый'), am: Ws(s, 'америке'), sim: Ws(s, 'символ'), muzh: Ws(s, 'мужчины'), end: SA('s8') - .02 };
    const a = T7; a.sw = a.sim - .55;   // смена мира: кадр — только лист
    K7 = [KY(a.stav + .1, 360, 770, 1.96), KY(a.kov + .2, 352, 772, 2.0), KY(a.slov + .1, 360, 740, 2.2), KY(a.sw, 380, 690, 3.3)];
    // всадник: цветной и карандашный (маска + обводка) — заранее, в 2× разрешении
    const S = 2, W = (RB.x1 - RB.x0) * S, H = (RB.y1 - RB.y0) * S; RIDC = mk(W, H); const g = RIDC.getContext('2d'); g.scale(S, S); g.translate(-RB.x0, -RB.y0); horseRider(g, BB.x + 290, BB.y + BB.h * .94, 1.5, { t: 0 });
    RIDS = mk(W, H); const h = RIDS.getContext('2d');
    for (const [dx, dy] of [[-3, 0], [3, 0], [0, -3], [0, 3], [-2, -2], [2, 2], [-2, 2], [2, -2]]) h.drawImage(RIDC, dx, dy);
    h.globalCompositeOperation = 'source-in'; h.fillStyle = '#4A4A52'; h.fillRect(0, 0, W, H); h.globalCompositeOperation = 'source-over';
    const m2 = mk(W, H), q2 = m2.getContext('2d'); q2.drawImage(RIDC, 0, 0); q2.globalCompositeOperation = 'source-in'; q2.fillStyle = '#E4DCC8'; q2.fillRect(0, 0, W, H); h.drawImage(m2, 0, 0);
    h.strokeStyle = 'rgba(74,74,82,.35)'; h.lineWidth = 2; h.globalCompositeOperation = 'source-atop'; for (let k = -H; k < W; k += 14) { h.beginPath(); h.moveTo(k, H); h.lineTo(k + H * .7, 0); h.stroke() }   // штриховка
    // путь карандаша: три прохода рядами (верх, середина, низ силуэта) — как штрихуют набросок; карандаш едет не быстрее ~1000 px/с
    const d = g.getImageData(0, 0, W, H).data, top = [], bot = [];
    for (let x = 0; x < W; x += 16) { let y0 = -1, y1 = -1; for (let y = 0; y < H; y += 3) if (d[(y * W + x) * 4 + 3] > 40) { if (y0 < 0) y0 = y; y1 = y } if (y0 >= 0) { top.push([RB.x0 + x / S, RB.y0 + y0 / S]); bot.push([RB.x0 + x / S, RB.y0 + y1 / S]) } }
    const row = f => top.map((p, i) => [p[0], lp(p[1], bot[i][1], f)]), P = [...row(.12), ...row(.5).reverse(), ...row(.86)];
    let L = 0; P.forEach((p, i) => { if (i) L += Math.hypot(p[0] - P[i - 1][0], p[1] - P[i - 1][1]); p[2] = L }); PEN7 = { P, L };
  }
  function penAt(u) { const { P, L } = PEN7, dd = u * L; let i = 1; while (i < P.length - 1 && P[i][2] < dd) i++; const a = P[i - 1], b = P[i], k = (dd - a[2]) / Math.max(1e-6, b[2] - a[2]); return [lp(a[0], b[0], k), lp(a[1], b[1], k), i] }
  function pencil(c, x, y, s = 1, ang = -.62) {   // толстый чёрный карандаш Бёрнетта: шестигранный корпус, дерево, грифель
    c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
    c.fillStyle = '#1A1A1E'; c.fillRect(-300, -16, 254, 32); c.fillStyle = '#34343C'; c.fillRect(-300, -16, 254, 9); c.fillStyle = '#0C0C0E'; c.fillRect(-300, 8, 254, 8);
    PL(c, [-46, -16, -46, 16, -6, 4, -6, -4], '#D9B38C'); PL(c, [-6, -4, -6, 4, 6, 0], '#1A1A1E'); c.fillStyle = '#B8B8C0'; c.fillRect(-312, -16, 14, 32);
    c.restore();
  }
  // лист на доске: бумага, набросок карандашом, цвет, потом весь плакат (k — сколько готово)
  function sheet7(c, t) {
    const a = T7, { x, y, w, h } = BB, T = C3;
    const ksk = at(t, a.stav - .05, a.slov - .05), kco = eio(at(t, a.slov - .1, a.slov + .45)), kbg = eio(at(t, a.slov + .25, a.sam + .45)), ktx = at(t, a.sam + .1, a.am + .1), kpk = spr(at(t, a.sam + .2, a.am + .6));
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    c.fillStyle = T.paper; c.fillRect(x, y, w, h);
    if (kbg > 0) { c.save(); c.beginPath(); c.rect(x, y + h * (1 - kbg), w, h * kbg + 1); c.clip(); c.fillStyle = T.dune; c.fillRect(x, y + h * .58, w, h * .42);
      PL(c, [x, y + h * .58, x, y + h * .42, x + 120, y + h * .42, x + 150, y + h * .5, x + 330, y + h * .5, x + 370, y + h * .58], T.rock);
      PL(c, [x + 500, y + h * .58, x + 540, y + h * .47, x + 620, y + h * .47, x + 648, y + h * .4, x + 760, y + h * .4, x + 820, y + h * .58], T.rock); c.fillStyle = T.dune2; c.fillRect(x, y + h * .8, w, h * .2); c.restore() }
    if (ktx > 0) { c.save(); c.beginPath(); c.rect(x, y, 40 + 600 * eo(ktx), 160); c.clip(); tx(c, 'Marlboro Country', x + 40, y + 84, { f: 'P', w: 700, st: 'italic', s: 66, c: T.inkB, al: 'left' }); c.restore() }
    if (kco >= 1) horseRider(c, x + 290, y + h * .94, 1.5, { t });
    else {
      if (ksk > 0) { const [px, py] = penAt(Math.min(1, ksk)); c.save(); c.beginPath(); const { P } = PEN7, n = penAt(Math.min(1, ksk))[2];
        for (let i = 0; i < n; i++) { c.moveTo(P[i][0] + 92, P[i][1]); c.arc(P[i][0], P[i][1], 92, 0, TAU) } c.moveTo(px + 92, py); c.arc(px, py, 92, 0, TAU); if (ksk >= 1) c.rect(RB.x0, RB.y0, RB.x1 - RB.x0, RB.y1 - RB.y0);
        c.clip(); c.drawImage(RIDS, RB.x0, RB.y0, RB.x1 - RB.x0, RB.y1 - RB.y0); c.restore() }
      if (kco > 0) { c.save(); c.beginPath(); c.rect(RB.x0, RB.y0, (RB.x1 - RB.x0) * kco, RB.y1 - RB.y0); c.clip(); horseRider(c, x + 290, y + h * .94, 1.5, { t }); c.restore() }
    }
    if (kpk > 0) { c.save(); c.translate(x + 771, y + 458); c.scale(kpk, kpk); c.translate(-(x + 771), -(y + 458)); mPack(c, x + 676, y + 176, 190, 282, 34, {}); c.restore() }
    c.restore();
    if (ksk > 0 && ksk < 1.05 && kco < .2) { const [px, py] = penAt(Math.min(1, ksk)); pencil(c, px + Math.sin(t * 31) * 3, py + Math.cos(t * 23) * 4, .7, -2.3) }
    else if (kco < .2 && t > a.stav - .6) { const k = eo(at(t, a.stav - .6, a.stav)), [px, py] = penAt(0); pencil(c, lp(px + 300, px, k), lp(py + 260, py, k), .7, -2.3) }
    else if (kco >= .2) { const k = eio(at(t, a.slov - .1, a.slov + .5)); pencil(c, lp(RB.x0 + 420, 760, k), lp(RB.y0 + 300, 1260, k), .7, -2.3) }
  }
  function officeW7(c, t) {   // кабинет: стена, доска с листом, стол, ваза яблок, стакан карандашей, лампа
    c.fillStyle = '#3B2A22'; c.fillRect(-600, -200, 2300, 1800); c.fillStyle = '#433027'; for (let sx = -600; sx < 1700; sx += 120) c.fillRect(sx, -200, 50, 1800);
    rr(c, BB.x - 34, BB.y - 34, BB.w + 68, BB.h + 68, 10); fill(c, '#6B4A30'); rr(c, BB.x - 34, BB.y - 34, BB.w + 68, BB.h + 68, 10); lnB(c, 3, 'rgba(255,230,190,.35)');
    sheet7(c, t);
    c.fillStyle = '#5A3A26'; c.fillRect(-600, 1110, 2300, 40); c.fillStyle = '#7A5135'; c.fillRect(-600, 1110, 2300, 10); c.fillStyle = '#3E2718'; c.fillRect(-600, 1150, 2300, 500);
    c.beginPath(); c.ellipse(150, 1100, 150, 30, 0, 0, Math.PI); c.lineTo(0, 1060); c.lineTo(300, 1060); c.closePath(); fill(c, '#C9D2DC');   // ваза
    [[70, 1040], [130, 1020], [195, 1034], [250, 1046], [105, 990], [175, 985], [230, 1000]].forEach(([ax, ay], i) => { circ(c, ax, ay, 36, i % 2 ? '#B3162C' : C3.red); c.beginPath(); c.ellipse(ax - 12, ay - 12, 9, 13, -.5, 0, TAU); fill(c, 'rgba(255,255,255,.35)'); c.fillStyle = '#3E2718'; c.fillRect(ax - 2, ay - 46, 4, 14) });
    rr(c, 860, 960, 110, 150, 10); fill(c, '#2B2F3A'); for (let i = 0; i < 6; i++) { c.save(); c.translate(880 + i * 15, 960); c.rotate(-.25 + i * .1); c.fillStyle = '#1A1A1E'; c.fillRect(-9, -190, 18, 200); PL(c, [-9, -190, 9, -190, 0, -218], '#D9B38C'); c.restore() }
    c.fillStyle = '#1A1A1E'; c.fillRect(1150, 300, 14, 820); c.save(); c.translate(1157, 300); c.rotate(-.5); rr(c, -60, -40, 120, 70, 14); fill(c, '#2B2F3A'); c.restore(); beam(c, 1120, 330, 600, 700, 30, 520, '#FFF1C8', .12);
  }
  function w7Shot(c, t) { const q = camObj(camAt(K7, t)); layer(c, q, 1, cc => officeW7(cc, t)) }
  // ================= мир 8 (фразы 7–8): щит у трассы (координаты мира 1) → проезд вдоль трассы, щит за щитом → щиты на столбах как столбики графика (#109),
  // наш красный дорастает до 4-го места → уходит в ночное небо → Земля: столбик становится лучом радара (#039), на материках загораются пачки.
  let T8 = null, K8 = null, KE = null, NE8 = null;
  const ROW = { x0: 4400, dx: 1100, n: 8, ours: 5 }, BARH = [2600, 3400, 2200, 3000, 1800, 0, 1500, 1200];
  const OURX = ROW.x0 + ROW.ours * ROW.dx + BB.w / 2;   // центр нашего щита в ряду
  const GLOBE = { x: 540, y: 960, R: 360 }, SPACE = '#0B0F2A', GLOBEC = '#18183A', LANDC = '#26244A', BEAMW = 40;
  function w8Init() {
    const s = 's8', a7 = T7;
    T8 = { sim: a7.sim, muzh: Ws('s7', 'мужчины'), a: SA(s), cherez: Ws(s, 'через'), god: Ws(s, 'год'), byv: Ws(s, 'бывшая'), mar: Ws(s, 'марка'), chet: Ws(s, 'четвёртая'), str: Ws(s, 'стране'),
      sem: Ws(s, 'семьдесят'), vt: Ws(s, 'втором'), perv: Ws(s, 'первая'), mir: Ws(s, 'мире'), end: SA('s9') - .02 };
    const a = T8; a.sw = a.perv - .12;   // смена мира: в кадре — только ночное небо, звёзды и красный столбик
    a.sweep0 = a.mir - .05; a.sweep1 = a.end - .2;
    K8 = [KY(a.sim + .2, 470, 850, 1.7), KY(a.muzh + .42, 540, 955, 1.01), KY(a.cherez + .25, 900, 950, .98), KY(a.byv + .18, 3000, 930, .9), KY(a.mar + .08, 6000, 820, .62),
      KY(a.chet + .25, 8700, -300, .135), KY(a.str + .15, 8760, -420, .13), KY(a.sem + .28, OURX, -3200, .16), KY(a.vt + .4, OURX, -12000, .19), KY(a.sw, OURX, -15500, .2)];
    // W8 вложен в Землю: основание нашего столбика (OURX, 1378) — верх шара, ширина щита — ширина луча
    const m = BEAMW / BB.w; NE8 = { x: GLOBE.x - (OURX - 540) * m, y: GLOBE.y - GLOBE.R - (1378 - 960) * m, m };
    KE = [KY(a.mir + .1, 540, 880, .95), KY(a.sweep1 - .3, 540, 900, .98)];
  }
  function nightK(t) { const a = T8; return eio(at(t, a.byv - .2, a.sem + .6)) }
  function ourH(t) { const a = T8; return lp(600, 2400, eio(at(t, a.chet - .45, a.chet + .45))) + 90000 * Math.pow(at(t, a.sem - .1, a.sw + .3), 2.2) }
  function rowBoard(c, t, i, nk) {   // щит в ряду: рама, плакат (наш — Marlboro, другие — серые без названий), под щитом столбик своего цвета
    const x = ROW.x0 + i * ROW.dx, ours = i === ROW.ours, kb = at(t, T8.chet - .5, T8.chet + .1), hb = ours ? ourH(t) : lp(1200, BARH[i], eio(kb)), y = 1378 - hb - BB.h;
    const col = ours ? C3.red : GRAYS[i % 4], cb = mixc(C3.steel, col, eio(kb));
    c.fillStyle = cb; c.fillRect(x + (BB.w - lp(60, BB.w, eio(kb))) / 2, y + BB.h, lp(60, BB.w, eio(kb)), hb);
    c.fillStyle = C3.steel; c.fillRect(x - 12, y - 12, BB.w + 24, BB.h + 24);
    if (ours) { c.save(); c.translate(x - BB.x, y - BB.y); poster(c, t, { peelPx: 0, night: nk * .6 }); c.restore() }
    else { c.fillStyle = mixc('#B8B4AC', '#3A3848', nk * .6); c.fillRect(x, y, BB.w, BB.h); c.fillStyle = mixc(col, '#2A2838', nk * .5); c.fillRect(x, y + BB.h * .55, BB.w, BB.h * .45);
      c.fillStyle = mixc('#8A867E', '#2A2838', nk * .6); c.fillRect(x + 60, y + 60, 420, 60); c.fillRect(x + 60, y + 150, 260, 40); rr(c, x + 640, y + 140, 200, 300, 10); fill(c, mixc('#6E6A62', '#242232', nk * .6)) }
  }
  function w8World(c, t, q) {
    const a = T8, nk = nightK(t);
    layer(c, q, .3, cc => { P0(cc, .3); desertFar(cc, nk) });
    if (nk > .05) starsS(c, t, ss(.3, .9, nk) * at(viewRect(q).y1, 2500, -800));
    layer(c, q, 1, cc => {
      desertGround(cc, t, nk, q); billboardFrame(cc, { lamp: nk }); poster(cc, t, { peelPx: 0, night: nk * .6 });
      for (let i = 0; i < ROW.n; i++) rowBoard(cc, t, i, nk);
      [1700, 2900].forEach((bx, j) => { cc.save(); cc.translate(bx - BB.x, 0); cc.fillStyle = C3.steel; cc.fillRect(BB.x + 230, BB.y + BB.h, 24, 1378 - BB.y - BB.h); cc.fillRect(BB.x + 714, BB.y + BB.h, 24, 1378 - BB.y - BB.h);
        cc.fillRect(BB.x - 12, BB.y - 12, BB.w + 24, BB.h + 24); cc.fillStyle = mixc(j ? '#C9C2B4' : '#B5AFA2', '#3A3848', nk * .6); cc.fillRect(BB.x, BB.y, BB.w, BB.h); cc.fillStyle = mixc(GRAYS[j + 1], '#2A2838', nk * .5); cc.fillRect(BB.x, BB.y + 380, BB.w, 250); cc.restore() });
      const k4 = at(t, a.chet + .05, a.chet + .45) * (1 - at(t, a.sem - .2, a.sem + .2));
      if (k4 > 0) { const x = OURX, y = 1378 - ourH(t) - BB.h - 900; tx(cc, '№ 4 В США', x, y, { f: 'M', w: 800, s: 640 * bo(k4), c: '#F4F1EA', a: Math.min(1, k4 * 2) }) }
    });
    layer(c, q, 1.35, cc => { if (q.z < .5) return; P0(cc, 1.35); const u = (t * .045 + .62) % 1, x = lp(-300, 1500, u); tumbleweed(cc, x, 1530 - Math.abs(Math.sin(t * 2.4)) * 26, 44, t * 2.2) });
  }
  // ---------- Земля ----------
  const CONT = [[[-.62, -.15], [-.3, -.42], [-.05, -.3], [-.12, .05], [-.38, .12], [-.55, .02]], [[-.28, .15], [-.08, .2], [-.12, .6], [-.25, .7], [-.3, .35]],
    [[.05, -.35], [.32, -.45], [.5, -.25], [.38, -.05], [.12, -.1]], [[.1, 0], [.3, .02], [.32, .4], [.18, .55], [.06, .3]], [[.45, .3], [.62, .32], [.6, .45], [.44, .44]]];
  const PACKS_E = [[-.36, -.18], [-.2, .38], [.25, -.28], [.2, .22], [.53, .38], [-.5, -.05], [.4, -.18]];
  function earthWorld(c, t, q) {
    const a = T8, G = GLOBE;
    c.fillStyle = SPACE; c.fillRect(-60000, -60000, 120000, 120000);
    starsS(c, t, 1);
    const sw = eio(at(t, a.sweep0, a.sweep1)), ang = -Math.PI / 2 + TAU * sw, ret = eio(at(t, a.sweep1 - .05, a.sweep1 + .35));
    c.save(); c.translate(G.x, G.y); c.rotate(ang + Math.PI / 2); c.fillStyle = C3.red; c.fillRect(-BEAMW / 2, -G.R - 60000 * (1 - ret), BEAMW, 60000 * (1 - ret) + 10); c.restore();   // луч: снаружи шара
    circ(c, G.x, G.y, G.R, GLOBEC);
    c.save(); c.beginPath(); c.arc(G.x, G.y, G.R, 0, TAU); c.clip();
    CONT.forEach(P => { poly(c, P.flatMap(p => [G.x + p[0] * G.R * 1.15, G.y + p[1] * G.R * 1.15])); fill(c, LANDC) });
    for (let i = 0; i < 40; i++) { const u = H1(i * 2.3), v = H1(i * 5.1); circ(c, G.x + (u - .5) * G.R * 1.3, G.y + (v - .45) * G.R * 1.2, 2.2, rgba('#FDE68A', .45)) }
    if (sw > 0 && sw < 1) { c.beginPath(); c.moveTo(G.x, G.y); c.arc(G.x, G.y, G.R + 20, ang - .7, ang); c.closePath(); fill(c, 'rgba(200,16,46,.22)'); c.save(); c.translate(G.x, G.y); c.rotate(ang); c.fillStyle = C3.red; c.fillRect(0, -6, G.R + 20, 12); c.restore() }
    PACKS_E.forEach(([u, v], i) => { const pa = Math.atan2(v, u), d = ((pa - (-Math.PI / 2)) % TAU + TAU) % TAU, k = spr(at(sw * TAU, d, d + .6)); if (k <= 0) return;
      const px = G.x + u * G.R * 1.15, py = G.y + v * G.R * 1.15; c.save(); c.translate(px, py); c.scale(k * .16, k * .16); mPack(c, -95, -141, 190, 282, 34, { shadow: false }); c.restore() });
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(G.x + G.R * .35, G.y - G.R, G.R, G.R * 2); c.restore();
    const k1 = at(t, a.mir - .05, a.mir + .35) * (1 - at(t, a.sweep1 - .25, a.sweep1 + .05)); if (k1 > 0) tx(c, '№ 1 В МИРЕ', G.x, G.y + G.R + 150, { f: 'M', w: 800, s: 92 * bo(k1), c: '#F4F1EA', a: Math.min(1, k1 * 2) });
    if (typeof nightInEarth === 'function') nightInEarth(c, t, q);
  }
  function w8Shot(c, t) {
    if (t < T8.sw) { const q = camObj(camAt(K8, t)); w8World(c, t, q) }
    else { const q = camObj(camAt(KE, t)); layer(c, q, 1, cc => earthWorld(cc, t, q)) }
  }
  // ================= мир 9 (фразы 9–11): ночной щит у пустой дороги (координаты мира 1). Камера спускается с ночной стороны Земли (мир 9 вложен в верх шара),
  // нарисованный огонёк становится живым (#092), дым тает в небе (#141); Макларен: календарь и пачки, рентген (#037), планки щита поворачиваются (#105), щит → столб-памятник, ещё три столба.
  let T9 = null, K9 = null, NE9 = null;
  const M9 = .0012, POSTS = [540, 1260, 1980, 2700], HORZ = 1350;
  function w9Init() {
    const w = (s, q, n) => Ws(s, q, n);
    T9 = { a: SA('s9'), vot: w('s9', 'вот'), kov: w('s9', 'ковбои'), rekl0: w('s9', 'рекламы'), kur: w('s9', 'курили'), nast: w('s9', 'по-настоящему'),
      uein: w('s10', 'уэйн'), mak: w('s10', 'макларен'), vyk: w('s10', 'выкуривал'), polt: w('s10', 'полторы'), den: w('s10', 'день'), dev: w('s10', 'девяностом'), rak: w('s10', 'рак'), leg: w('s10', 'лёгких'),
      posl: w('s10', 'последний'), snim: w('s10', 'снимался'), rekl: w('s10', 'рекламе'), prot: w('s10', 'против'), umer: w('s10', 'умер'), pyat: w('s10', 'пятьдесят'), odin: w('s10', 'один'),
      vsego: w('s11', 'всего'), umerli: w('s11', 'умерли'), chet: w('s11', 'четверо'), kovb: w('s11', 'ковбоев'), marl: w('s11', 'мальборо'), end: (SA('s12') ?? SA('s13')) - .02 };
    const a = T9; a.sw = a.vot + .28;   // смена мира: шар Земли во весь кадр, горизонт — прямая
    NE9 = { x: GLOBE.x, y: GLOBE.y - GLOBE.R - (HORZ - 960) * M9, m: M9 };
    KE.push(KY(T8.sweep1 + .12, 540, 640, 2.6), KY(a.sw, 540, NE9.y + (1100 - 960) * M9, .14 / M9));
    K9 = [KY(a.kov + .05, 520, 900, .55), KY(a.rekl0 + .1, 430, 700, 1.6), KY(a.kur + .08, 405, 640, 3.4), KY(a.nast + .45, 420, 520, 2.4), KY(a.uein + .2, 470, 600, 1.75),
      KY(a.polt + .1, 560, 600, 1.45), KY(a.den + .3, 600, 640, 1.4), KY(a.dev + .2, 390, 660, 3.0), KY(a.leg + .25, 385, 668, 3.3), KY(a.posl + .2, 470, 690, 1.6),
      KY(a.rekl + .15, 540, 700, 1.15), KY(a.umer, 540, 800, 1.0), KY(a.odin + .2, 560, 900, .9), KY(a.umerli, 1250, 950, .58), KY(a.chet + .5, 1600, 970, .47), KY(a.end, 1640, 960, .45)];
  }
  const KEf = () => KE;
  // ночное небо и горизонт (для мира 9 целиком; noFill — внутри Земли: небо и землю там даёт сам шар)
  function nightLocal(c, t, q, noFill) {
    const a = T9;
    if (!noFill) { c.fillStyle = SPACE; c.fillRect(-60000, -60000, 120000, 60000 + HORZ) }
    if (!noFill) { c.save(); c.beginPath(); c.rect(-60000, -60000, 120000, 60000 + HORZ); c.clip(); starsS(c, t, 1); c.restore() }
    c.fillStyle = '#121640'; c.fillRect(-60000, 950, 120000, HORZ - 950); c.fillStyle = '#24183A'; c.fillRect(-60000, 1180, 120000, HORZ - 1180); c.fillStyle = '#3E1C30'; c.fillRect(-60000, 1300, 120000, HORZ - 1300);
    const mx = 870, my = 250; circ(c, mx, my, 96, '#F3EBDD'); circ(c, mx - 30, my - 20, 18, '#DCD3BE'); circ(c, mx + 26, my + 30, 12, '#DCD3BE'); circ(c, mx + 30, my - 34, 9, '#DCD3BE');
    PL(c, [-1500, HORZ, -1500, 1220, -900, 1220, -860, 1260, -500, 1260, -470, 1196, 110, 1196, 150, 1240, 250, 1240, 296, HORZ], NIGHT.mesa);
    PL(c, [800, HORZ, 836, 1262, 880, 1262, 904, 1222, 1500, 1222, 1540, 1180, 2100, 1180, 2600, HORZ], NIGHT.mesa); PL(c, [2600, HORZ, 2700, 1250, 3300, 1250, 3420, 1200, 4200, 1200, 4400, HORZ], NIGHT.mesa);
    if (!noFill) { c.fillStyle = GLOBEC; c.fillRect(-60000, HORZ, 120000, 60000) }
    c.fillStyle = '#0E0B1C'; c.fillRect(-60000, 1376, 120000, 64); c.fillStyle = '#2A2440'; c.fillRect(-60000, 1376, 120000, 4); c.fillRect(-60000, 1436, 120000, 4);
    c.fillStyle = '#5A4E44'; for (let dx = -2960; dx < 6000; dx += 120) c.fillRect(dx, 1406, 64, 5);
    c.fillStyle = '#0E0B1C'; for (let fx = -594; fx < 260; fx += 50) c.fillRect(fx, 1300, 11, 80); c.fillRect(-600, 1316, 866, 5); c.fillRect(-600, 1344, 866, 5);
    nightBoard(c, t, q);
  }
  function nightInEarth(c, t, q) { if (q.z < 12) return; inNest(c, NE9, cc => nightLocal(cc, t, q, true)) }
  // ---------- щит ночью: лампы, огонёк, дым, календарь, рентген, планки, столб ----------
  function boardMorph(t) { const a = T9; return eio(at(t, a.umer - .15, a.pyat + .2)) }
  function nightBoard(c, t, q) {
    const a = T9, km = boardMorph(t), { x, y, w, h } = BB;
    if (km < 1) {
      c.save();
      if (km > 0) { const px = 540, py = 620, sx = lp(1, 44 / w, km), sy = lp(1, (1378 - py) / h, km); c.translate(px, lp(y + h / 2, py + (1378 - py) / 2, km)); c.scale(sx, sy); c.translate(-(x + w / 2), -(y + h / 2)) }
      billboardFrame(c, { lamp: 1 });
      const em = eo(at(t, a.kur - .15, a.kur + .25)) * (1 - .3 * at(t, a.nast + .6, a.uein + .3));
      poster(c, t, { peelPx: 0, night: .62, ember: em, chest: cc => xray(cc, t), cal: cc => calendar(cc, t), over: cc => slats(cc, t) });
      [x + 180, x + 480, x + 780].forEach(lx => poly(c, [lx + 40, y - 62, lx + 72, y - 56, lx + 330, y + h * .9, lx - 220, y + h * .9]) || fill(c, 'rgba(255,233,176,.09)'));
      c.restore();
    }
    if (km > 0) post(c, POSTS[0], t, 0);
    for (let i = 1; i < 4; i++) post(c, POSTS[i], t, i);
    wire(c, t);
    smoke9(c, t);
    const kn = at(t, a.nast - .05, a.nast + .35) * (1 - at(t, a.uein - .35, a.uein + .05)); if (kn > 0) tx(c, 'ПО-НАСТОЯЩЕМУ', 430, 330, { f: 'M', w: 800, s: 38 * bo(kn), c: '#F4F1EA', a: Math.min(1, kn * 2) });
    const kp = at(t, a.uein - .05, a.uein + .3) * (1 - at(t, a.polt - .25, a.polt + .05)); if (kp > 0) { plate(c, 'УЭЙН МАКЛАРЕН', 470, 290, bo(kp), { s: 34, bg: '#F3EBDD', c: '#141010', ls: 2 }); plate(c, 'КОВБОЙ С РЕКЛАМЫ', 470, 352, bo(kp), { s: 22, bg: C3.red, c: '#fff', ls: 2 }) }
    const k1 = at(t, a.polt + .1, a.polt + .45) * (1 - at(t, a.dev - .3, a.dev)); if (k1 > 0) plate(c, '1,5 ПАЧКИ В ДЕНЬ', 560, 300, bo(k1), { s: 40, bg: C3.red, c: '#fff', ls: 2 });
    const k5 = at(t, a.odin - .05, a.odin + .3) * (1 - at(t, a.vsego - .3, a.vsego + .1)); if (k5 > 0) tx(c, '51', 760, 760, { f: 'M', w: 800, s: 200 * bo(k5), c: '#F4F1EA', a: Math.min(1, k5 * 2) });
    const k4 = at(t, a.chet + .9, a.chet + 1.25); if (k4 > 0) tx(c, 'КАК МИНИМУМ 4', 1620, 470, { f: 'M', w: 800, s: 150 * bo(k4), c: '#F4F1EA', a: Math.min(1, k4 * 2) });
  }
  function smoke9(c, t) {   // дым выходит из плаката и тает в ночном небе
    const a = T9, k = at(t, a.kur + .1, a.uein + .6); if (k <= 0) return; const x0 = 404.5, y0 = 623.5;
    for (let j = 0; j < 3; j++) { const u = cl(k * 1.4 - j * .2), pts = []; for (let i = 0; i <= 10; i++) { const s2 = i / 10 * u; pts.push(x0 + Math.sin(s2 * 7 + j + t * 1.3) * 26 * s2 + s2 * 40, y0 - s2 * 520) } smokeLine(c, pts, 6 - j, '#DCD8E4', (1 - at(k, .7, 1)) * (1 - j * .2)) }
  }
  function calendar(c, t) {   // отрывной календарь на плакате между всадником и пачкой; за каждый день из пачки падают полторы пачки
    const a = T9, k = at(t, a.polt - .25, a.dev - .2); if (k <= 0) return; const cx = 560, cy = 520, A0 = Math.min(1, k * 6) * (1 - at(t, a.dev - .2, a.dev + .1));
    c.save(); c.globalAlpha *= A0;
    rr(c, cx - 74, cy - 96, 148, 176, 8); fill(c, '#F4F1EA'); c.fillStyle = C3.red; c.fillRect(cx - 74, cy - 96, 148, 40); circ(c, cx - 40, cy - 96, 6, '#333'); circ(c, cx + 40, cy - 96, 6, '#333');
    const n = Math.floor(k * 14); tx(c, String(1 + n), cx, cy + 18, { f: 'M', w: 800, s: 74, c: '#141010' });
    const fl = (k * 14) % 1; if (n < 14) { c.save(); c.translate(cx + 80 * fl, cy - 10 - 60 * fl); c.rotate(fl * 1.2); c.globalAlpha *= 1 - fl; rr(c, -74, -50, 148, 136, 8); fill(c, '#F4F1EA'); tx(c, String(n), 0, 18, { f: 'M', w: 800, s: 74, c: '#141010' }); c.restore() }
    const np = Math.min(21, Math.floor(k * 14 * 1.5)); for (let i = 0; i < np; i++) { const col = i % 3, row = Math.floor(i / 3); c.save(); c.translate(736 + 140 + col * 34, BB.y + BB.h - 30 - row * 46); c.scale(.17, .17); mPack(c, -95, -282, 190, 282, 34, { shadow: false }); c.restore() }
    const fp = (k * 21) % 1; if (np < 21) { c.save(); c.translate(860, lp(BB.y + 200, BB.y + BB.h - 60, ei(fp))); c.rotate(fp * 2); c.scale(.17, .17); mPack(c, -95, -141, 190, 282, 34, { shadow: false }); c.restore() }
    c.restore();
  }
  function xray(c, t) {   // светлая планка рентгена едет по груди всадника: за ней лёгкие контуром и тёмное пятно (координаты всадника)
    const a = T9, k = at(t, a.dev - .1, a.posl - .1); if (k <= 0 || k >= 1) return; const bx = lp(-30, 40, eio(at(k, 0, .45))), A0 = Math.min(1, k * 8) * (1 - at(k, .85, 1)), sp = eo(at(t, a.rak - .1, a.leg + .2));
    c.save(); c.globalAlpha *= A0; c.beginPath(); c.rect(bx - 30, -214, 60, 58); c.clip(); c.fillStyle = '#9FD4E6'; c.fillRect(bx - 30, -214, 60, 58);
    [[-1, 0], [1, 0]].forEach(([s2]) => { c.beginPath(); c.ellipse(10 + s2 * 9, -186, 7, 18, s2 * .15, 0, TAU); c.strokeStyle = '#1E4E6A'; c.lineWidth = 1.6; c.stroke() });
    c.beginPath(); c.moveTo(10, -208); c.lineTo(10, -170); c.strokeStyle = '#1E4E6A'; c.lineWidth = 1.4; c.stroke(); if (sp > 0) circ(c, 15, -192, 4.2 * sp, '#1A1214');
    c.restore(); c.save(); c.globalAlpha *= A0; c.strokeStyle = '#E8F7FC'; c.lineWidth = 1.5; c.strokeRect(bx - 30, -214, 60, 58); c.restore();
  }
  function slats(c, t) {   // щит делится на трёхгранные планки, они поворачиваются: реклама против курения — шляпа на больничной койке
    const a = T9, k = at(t, a.rekl - .25, a.prot + .5); if (k <= 0) return; const { x, y, w, h } = BB, N = 14, sw = w / N;
    for (let i = 0; i < N; i++) { const u = cl(k * 1.6 - i * .045); if (u <= 0) continue; const f = Math.sin(Math.PI / 2 * eio(u)), sx = x + i * sw, cx = sx + sw / 2;   // новая грань планки разворачивается из ребра
      c.save(); c.beginPath(); c.rect(cx - sw * f / 2, y, sw * f, h); c.clip(); hospital(c, t);
      if (f < 1) { c.fillStyle = `rgba(0,0,0,${.45 * (1 - f)})`; c.fillRect(cx - sw / 2, y, sw, h) } c.restore();
      if (f > .02 && f < 1) { c.fillStyle = 'rgba(10,8,20,.7)'; c.fillRect(cx - sw * f / 2 - 3, y, 3, h); c.fillRect(cx + sw * f / 2, y, 3, h) } }
  }
  function hospital(c, t) {
    const { x, y, w, h } = BB; c.fillStyle = '#C9D4DC'; c.fillRect(x, y, w, h); c.fillStyle = '#AEBAC4'; c.fillRect(x, y + h * .72, w, h * .28);
    c.fillStyle = '#7E8A94'; c.fillRect(x + 240, y + 300, 14, 250); c.fillRect(x + 720, y + 260, 14, 290); c.fillRect(x + 240, y + 420, 494, 12);
    rr(c, x + 254, y + 360, 466, 66, 12); fill(c, '#F4F1EA'); rr(c, x + 270, y + 330, 130, 40, 14); fill(c, '#FFFFFF'); c.fillStyle = '#9FB3C2'; c.fillRect(x + 254, y + 408, 466, 18);
    cHat(c, x + 520, y + 352, 1.9); c.fillStyle = '#5E6A74'; c.fillRect(x + 820, y + 120, 8, 430); rr(c, x + 790, y + 120, 70, 90, 10); fill(c, '#DCE6EC');
  }
  function post(c, px, t, i) {   // столб-памятник у дороги: шляпа висит на нём
    const a = T9; let k;
    if (i === 0) k = boardMorph(t); else { const t0 = a.vsego + .1 + (i - 1) * .2; k = eo(at(t, t0, t0 + .5)) }
    if (k <= 0) return; const top = 620, H = (1378 - top) * (i === 0 ? 1 : k);
    c.fillStyle = '#2A1D18'; c.fillRect(px - 22, 1378 - H, 44, H); c.fillStyle = '#3E2A22'; c.fillRect(px - 22, 1378 - H, 14, H); c.fillRect(px - 70, 1378 - H + 90, 140, 22);
    const th = i === 0 ? at(t, a.pyat - .05, a.pyat + .35) : at(t, a.chet - .1 + (i - 1) * .25, a.chet + .3 + (i - 1) * .25); if (th > 0) { const hy = lp(top - 500, 1378 - H + 6, eo(th)); cHat(c, px, hy, 2.1) }
  }
  function wire(c, t) {   // проволока между столбами натягивается на «Мальборо»; в фильме на «Помните» краснеет — это красная нить доски
    const a = T9, k = at(t, a.vsego + .3, a.vsego + .9); if (k <= 0) return; const tight = eio(at(t, a.marl - .1, a.marl + .4)), red = SA('s12') !== null ? eio(at(t, SA('s12') - .05, SA('s12') + .5)) : 0;
    c.strokeStyle = mixc('#8A8296', '#DC2626', red); c.lineWidth = 5 + 4 * red; c.beginPath();
    for (let i = 0; i < 3; i++) { const x0 = POSTS[i], x1 = POSTS[i + 1], sag = 120 * (1 - tight) * Math.min(1, k * 2); c.moveTo(x0, 760); c.quadraticCurveTo((x0 + x1) / 2, 760 + sag, x0 + (x1 - x0) * Math.min(1, k * 3 - i), 760) } c.stroke();
    if (tight > 0) for (let i = 0; i < 10; i++) { const u = (t * 1.6 + i * .37) % 1, dx = lp(-200, 3800, u), dy = 900 + H1(i) * 400; c.beginPath(); c.moveTo(dx, dy); c.lineTo(dx + 140, dy - 40); lnB(c, 3, rgba('#B9A99A', .45 * tight)) }
  }
  function w9World(c, t, q) {
    nightLocal(c, t, q, false);
    if (q.z > .3) layerRel(c, q, K9REF, 1.3, cc => { for (let i = 0; i < 14; i++) { const lx = BB.x + 180 + (i % 3) * 300 + Math.sin(t * 3 + i) * 60, ly = BB.y - 40 + H1(i) * 300 + Math.cos(t * 2.3 + i * 2) * 40; circ(cc, lx, ly, 3, 'rgba(255,240,200,.7)') } });   // мошкара в луче лампы
  }
  let K9REF = null;
  function w9Shot(c, t) {
    if (t < T9.sw) { const q = camObj(camAt(KE, t)); layer(c, q, 1, cc => earthWorld(cc, t, q)); return }
    const q = camObj(camAt(K9, t)); if (!K9REF) K9REF = camObj(camAt(K9, T9.kur)); layer(c, q, 1, cc => w9World(cc, t, q));
  }
  // ================= мир 12 (фраза 12, только фильм): пробковая доска глав. Ночная дорога — это фото карточки 1924; проволока краснеет — это красная нить (#126).
  // На карточке 1979 оживает круг «Джула» с долей 35 % и «$12,8 МЛРД», счётчик крутится вниз до 0,45 (#089); из карточки 1924 выезжает пачка, крышка — как ящик кассы, чек волной (#012, #138).
  const CARDS3 = [{ id: '1979', x: 340, y: 400, a: '1979', b: 'СОЛЬ', open: true }, { id: '2020', x: 740, y: 400, a: '2020', b: 'ЛАЗЕЙКА ОДНОРАЗОК', open: true },
    { id: '2014', x: 230, y: 790, a: '2014', b: 'НАГРЕВАТЕЛИ' }, { id: '1924', x: 540, y: 805, a: '1924', b: '«МАЛЬБОРО»', open: true }, { id: '2022', x: 850, y: 790, a: '2022', b: 'ШАЙБЫ' }];
  const CW3 = 270, CH3 = 330, PH3 = 240, photo3 = cd => [cd.x, cd.y - CH3 / 2 + 15 + PH3 / 2], pin3 = cd => [cd.x, cd.y - CH3 / 2 + 4], C1924 = CARDS3[3];
  let T12 = null, K12 = null, N12 = null, CORK3 = null;
  function corkImg3() { if (CORK3) return CORK3; CORK3 = mk(WW, 1400); const g = CORK3.getContext('2d'); g.fillStyle = '#b07a4a'; g.fillRect(0, 0, WW, 1400);
    for (let y = 10, r = 0; y < 1400; y += 22, r++) for (let x = (r % 2) * 11; x < WW; x += 22) { if (H1(x * .37 + y * 1.13) > .55) continue; g.fillStyle = 'rgba(120,72,35,.35)'; g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill() } return CORK3 }
  function boardWall3(c, t) {
    c.fillStyle = '#1f1b2b'; c.fillRect(-4000, -4000, 9000, 9000);
    c.save(); rr(c, 30, 150, WW - 60, 1050, 14); fill(c, '#5b3d26'); rr(c, 52, 172, WW - 104, 1006, 8); c.clip(); c.drawImage(corkImg3(), 0, 0); c.restore();
    rr(c, 30, 150, WW - 60, 1050, 14); lnS(c, 5, '#f1e6d6'); rr(c, 52, 172, WW - 104, 1006, 8); lnS(c, 3, 'rgba(241,230,214,.5)');
    const sw = Math.sin(t * 1.25) * .2, bx = 540 + Math.sin(sw) * 1300; c.beginPath(); c.moveTo(540, -400); c.lineTo(540, 40); lnS(c, 3, '#f1e6d6');
    c.save(); c.translate(540, 40); c.rotate(-sw * .25); c.beginPath(); c.arc(0, 30, 44, Math.PI, 0); c.closePath(); fill(c, '#2b2638'); c.beginPath(); c.arc(0, 30, 44, Math.PI, 0); c.closePath(); lnS(c, 4, '#f1e6d6'); circ(c, 0, 34, 10, '#fde68a'); c.restore();
    poly(c, [510, 74, 570, 74, bx + 420, 1200, bx - 420, 1200]); fill(c, 'rgba(253,230,138,.09)');
  }
  function marker3(c, x, y, s, seed) { c.save(); c.translate(x, y); c.lineCap = 'round';
    [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(seed + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke(); c.restore() }); c.restore() }
  function pin3d(c, x, y) { circ(c, x + 3, y + 5, 14, 'rgba(0,0,0,.35)'); circ(c, x, y, 14, '#dc2626'); circ(c, x - 4, y - 4, 5, '#fca5a5') }
  function thread3(c, a, b, k = 1, col = '#dc2626') { if (k <= 0) return; const [x1, y1] = pin3(a), [x2, y2] = pin3(b); c.save(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(lp(x1, x2, k) + 3, lp(y1, y2, k) + 6); c.stroke(); c.strokeStyle = col; c.lineWidth = 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, k), lp(y1, y2, k)); c.stroke(); c.restore() }
  function photo1979b(c, t, x, y, s) {   // колба и кристалл соли (как в главе 1); на «миллиардов» — круг «Джула» с долей 35 %
    const a = T12, k = a ? spr(at(t, a.mil - .15, a.mil + .5)) : 0;
    c.fillStyle = '#1b2142'; c.fillRect(x - s / 2, y - s / 2, s, s);
    if (k < 1) { c.save(); c.translate(x - s * .12, y + s * .08); c.scale(s / 240, s / 240); poly(c, [-38, 20, 38, 20, 56, 56, -56, 56]); fill(c, '#38bdf8'); poly(c, [-14, -80, 14, -80, 14, -30, 60, 60, -60, 60, -14, -30]); c.strokeStyle = '#e0f2fe'; c.lineWidth = 5; c.stroke(); c.restore() }
    if (k > 0) { const R = s * .34 * k, cx = x, cy = y - s * .06, pale = a ? eio(at(t, a.pochti, a.poter + .4)) : 0;
      c.fillStyle = '#1b2142'; c.fillRect(x - s / 2, y - s / 2, s, s); circ(c, cx, cy, R, '#3A3E4C'); c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + TAU * .35); c.closePath(); fill(c, mixc(C3.red, '#6A6E7C', pale * .85));
      circ(c, cx, cy, R * .42, '#1b2142'); tx(c, 'JUUL', cx, cy + 2, { f: 'M', w: 800, s: Math.round(s * .1), c: '#F4F1EA' }); tx(c, '35 %', cx + R * .62, cy - R * .2, { f: 'M', w: 800, s: Math.round(s * .07), c: '#fff', a: k }) }
  }
  function photo2020(c, t, x, y, s) { c.fillStyle = '#1e2138'; c.fillRect(x - s / 2, y - s / 2, s, s); rr(c, x - s * .12, y - s * .32, s * .24, s * .64, s * .08); fill(c, B2.mango); poly(c, [x - s * .12, y + s * .02, x + s * .12, y - s * .1, x + s * .12, y + s * .32, x - s * .12, y + s * .32]); fill(c, B2.ice2); rr(c, x - s * .07, y - s * .42, s * .14, s * .12, 6); fill(c, '#2a2f55') }
  function card3(c, t, cd, inner) {
    const [px, py] = photo3(cd);
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW3 / 2, -CH3 / 2, CW3, CH3, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW3 / 2, cd.y - CH3 / 2, CW3, CH3, 6); fill(c, '#f5f0e6'); rr(c, cd.x - CW3 / 2, cd.y - CH3 / 2, CW3, CH3, 6); lnS(c, 3, '#2b2638');
    c.save(); c.beginPath(); c.rect(px - PH3 / 2, py - PH3 / 2, PH3, PH3); c.clip();
    if (cd.id === '1979') photo1979b(c, t, px, py, PH3); else if (cd.id === '2020') photo2020(c, t, px, py, PH3); else if (cd.id === '1924' && inner) inner(c); else { c.fillStyle = '#1e293b'; c.fillRect(px - PH3 / 2, py - PH3 / 2, PH3, PH3) }
    if (!cd.open) { rr(c, px - PH3 / 2, py - PH3 / 2, PH3, PH3, 2); fill(c, '#17171c'); marker3(c, px, py, PH3, cd.x) }
    c.restore();
    tx(c, cd.a, cd.x, cd.y + CH3 / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' });
    if (cd.open) tx(c, cd.b, cd.x, cd.y + CH3 / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW3 - 24 });
  }
  function w12Init() {
    const s = 's12'; if (SA(s) === null) return; const w = q => Ws(s, q);
    T12 = { a: SA(s), pom: w('помните'), tri: w('тринадцать'), mil: w('миллиардов'), juul: w('джула'), pochti: w('почти'), poter: w('потерял'), spok: w('спокойно'), perezh: w('пережил'),
      pach: w('пачка'), korm: w('кормит'), por: w('пор'), end: SA('s13') - .02 };
    const m = 230 / (1920 / .45); N12 = { x: 540 - (1640 - 540) * m, y: photo3(C1924)[1], m };
    const a = T12; a.burn = a.por + .05;
    K12 = [KY(a.pom + .5, 520, 720, 2.6), KY(a.tri + .5, 500, 660, 1.55), KY(a.mil + .25, 360, 470, 2.0), KY(a.juul, 345, 430, 2.35), KY(a.pochti + .35, 345, 470, 2.2), KY(a.spok + .1, 520, 720, 1.35),
      KY(a.korm + .1, 600, 900, 1.2), KY(a.por, 720, 1080, 1.6), KY(a.end, RC.x1, RC.y1, 9)];
  }
  const RC = { x0: 640, y0: 760, x1: 860, y1: 1140 };   // чек: откуда выползает и где кончик (тлеет)
  function pack12(c, t) {   // пачка выезжает из-за карточки 1924, качается; крышка открывается ящиком кассы, чек волной
    const a = T12, k = eo(at(t, a.spok - .3, a.spok + .5)); if (k <= 0) return;
    const x = lp(560, 650, k), y = 800, sw = Math.sin(t * 2.2) * .05 * at(t, a.spok + .3, a.spok + .8), lid = eio(at(t, a.korm - .08, a.korm + .2));
    c.save(); c.translate(x + 60, y + 90); c.rotate(sw); c.translate(-(x + 60), -(y + 90));
    if (lid > 0) { const rl = at(t, a.korm + .1, a.end); c.strokeStyle = '#F4F1EA'; c.lineCap = 'butt';   // бесконечный чек волной
      const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40 * rl; pts.push([lp(x + 60, RC.x1, u) + Math.sin(u * 9 - t * 4) * 26, lp(y - 10, RC.y1, u)]) }
      c.lineWidth = 34; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.strokeStyle = 'rgba(40,40,50,.35)'; c.lineWidth = 2;
      pts.forEach((p, i) => { if (i % 2) { c.beginPath(); c.moveTo(p[0] - 10, p[1]); c.lineTo(p[0] + 10, p[1]); c.stroke() } });
      const end = pts[pts.length - 1], eb = at(t, a.burn - .1, a.end); if (eb > 0) { circ(c, end[0], end[1], 14, rgba('#FF9A4A', .5 * eb)); circ(c, end[0], end[1], 8, C3.ember) } }
    c.save(); c.translate(x, y); c.scale(.42, .42); mPack(c, 0, 0, 190, 282, 34, { shc: 'rgba(0,0,0,.3)' });
    if (lid > 0) { c.save(); c.translate(190, 282 * .3); c.rotate(-lid * 2.1); PL(c, [-190, 0, 0, 0, 0, -84, -190, -84], C3.white); PL(c, [-190, -84, 0, -84, -95, -36], C3.red); c.restore() } c.restore();
    c.restore();
  }
  function counter12(c, t) {   // барабанный счётчик под кругом: 12,8 → 0,45 млрд
    const a = T12, k = at(t, a.mil + .2, a.mil + .5); if (k <= 0) return; const v = lp(12.8, .45, eio(at(t, a.pochti, a.poter + .45))), s = v >= 1 ? v.toFixed(1).replace('.', ',') : v.toFixed(2).replace('.', ',');
    const cd = CARDS3[0]; plate(c, '$' + s + ' МЛРД', cd.x, cd.y + CH3 / 2 + 46, bo(k), { s: 30, bg: '#F4F1EA', c: '#141010', ls: 1 });
  }
  function board12(c, t, inner) {
    const a = T12; boardWall3(c, t);
    thread3(c, CARDS3[0], CARDS3[1]); [2, 3, 4].forEach(i => thread3(c, CARDS3[1], CARDS3[i]));
    const kt = a ? eo(at(t, a.pom + .2, a.tri + .4)) : 1; thread3(c, C1924, CARDS3[0], kt);
    CARDS3.forEach(cd => card3(c, t, cd, cd.id === '1924' ? inner : null));
    CARDS3.forEach(cd => pin3d(c, ...pin3(cd)));
    if (a) { counter12(c, t); if (t < a.end + .3) pack12(c, t) }   // пачка с чеком сгорела в дым — на доске в концовке её нет
  }
  function w12Shot(c, t) { const q = camObj(camAt(K12, t)); layer(c, q, 1, cc => board12(cc, t, ci => inNest(ci, N12, cn => nightLocal(cn, t, q, false)))) }
  // ---------- дым: густая серая полоса проходит перед камерой (стык доски / ночной дороги с 2014-м) ----------
  function smokeCover(c, t, tc, half = .62) {
    const k = 1 - Math.abs(t - tc) / half; if (k <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    const cov = ss(0, .94, k);
    for (let i = 0; i < 26; i++) { const ang = H1(i * 3.3) * TAU, d = (1 - cov) * (700 + H1(i) * 500), x = 540 + Math.cos(ang) * d + Math.sin(t * 1.3 + i) * 30, y = 960 + Math.sin(ang) * d * 1.6 + (t - tc) * -300, r = (260 + H1(i * 7) * 260) * (.4 + .9 * cov);
      circ(c, x, y, r, ['#9A9AA6', '#8A8A96', '#B0AFBA'][i % 3]) }
    if (cov >= .999) { c.fillStyle = '#9A9AA6'; c.fillRect(0, 0, WW, HH) }
    c.restore();
  }
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
  // ================= сборка главы 3: время сцен по словам голоса, плашка года, кадр, звуки =================
  const BLOCKS = [];   // [начало, функция кадра] — заполняется в allInit по времени фраз
  function keys() { return { endT: TLX.endT, b0: TLX.b0, vEnd: TLX.vEnd } }
  function stub(c, t, name) { c.fillStyle = '#1e2138'; c.fillRect(0, 0, WW, HH); tx(c, name, 540, 900, { s: 60, c: '#fff' }) }
  function allInit() {
    if (BLOCKS.length) return;
    const FN = { w1: typeof w1Shot === 'function' ? w1Shot : null, s2: typeof w2Shot === 'function' ? w2Shot : null, s3: wcShot, s4: wcShot, s5: wcShot, s6: wcShot,
      s7: (c, t) => (t < T7.sw || typeof w8Shot !== 'function' ? w7Shot : w8Shot)(c, t), s8: typeof w8Shot === 'function' ? w8Shot : null, s9: w9Shot, s10: w9Shot, s11: w9Shot,
      s12: w12Shot, s13: w13Shot, s14: w13Shot };
    w1Init(); w2Init(); linkK(K1, K2, { x: V1.x, y: V1.y, m: M1 }, true);   // ныряем из плаката в коридор: мир 2 вложен в мир 1
    wcInit(); linkK(K2, KC, NC2, true);   // ныряем в красный торец: круг рынка — это он
    w7Init(); linkK(KC, K7, NC7(), true);   // ныряем в окно Бёрнетта
    w8Init(); linkK(K7, K8, { x: 540, y: 960, m: 1 }, true);   // лист = плакат: тот же мир, смена незаметна
    linkK(K8, KE, NE8, false);   // столбик в ночном небе = луч над Землёй (мир 8 вложен в Землю)
    w9Init(); linkK(KE, K9, NE9, true);   // ныряем к горизонту на верху шара: ночной щит вложен в Землю
    w12Init(); if (K12) linkK(K9, K12, N12, false);   // отъезд из фото карточки 1924 на доску
    w13Init();
    if (typeof wInitRest === 'function') wInitRest();
    const W = (a, b) => SHUT.push([a, b]);   // короткая выдержка на быстрых проездах: без смаза и двоения
    W(T1.zh - .2, T1.end + .55); W(T2.izy - .1, T2.zh + .5); W(T2.tilt1 - .15, T2.end + .35); W(TC.spas - .1, TC.strah + .25); W(TC.amer + .15, TC.amer + .75); W(TC.bros - .1, TC.filt + .4);
    W(TC.chik - .1, TC.leo + .3); W(TC.end - .7, TC.end + .35); W(T8.muzh, T8.chet + .55); W(T8.sem - .1, T8.mir + .35); W(T8.sweep1 - .1, T9.kur); W(T9.vsego - .2, T9.umerli + .3);
    if (T12) { W(T12.pom - .1, T12.pom + .7); W(T12.pochti - .1, T12.poter + .55) } W(TSM - .5, TSM + .5); W(T13.stiki - .2, T13.naz + .3);
    if (MODE === 'y') W(TLX.vEnd - .05, TLX.vEnd + 1.3); else W(T13.qEnd, TLX.endT + .1);
    BLOCKS.push(['w1', -1, FN.w1]);
    for (const sc of ['s2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14']) { const a = SA(sc); if (a !== null) BLOCKS.push([sc, a, FN[sc]]) }
  }
  function scene(c, t) {
    allInit(); let b = BLOCKS[0];
    for (const x of BLOCKS) if (t >= x[1] - .02) b = x;
    if (b[2]) b[2](c, t); else stub(c, t, b[0]);
    smokeCover(c, t, TSM);   // дым на стыке с 2014-м
  }
  let HY = null;
  function hud(c, t) {   // плашка года — только вперёд: 1924 → 1954 → 1972 → 1990 → 1992, уходит; 2014; в кадре 0 и в концовке плашки нет
    if (!HY) HY = { t1: Ws('s2', 'первые'), t54: Ws('s3', 'пятьдесят'), t72: Ws('s8', 'семьдесят'), t90: Ws('s10', 'девяностом'), t92: Ws('s10', 'умер'), out: Ws('s11', 'всего'), t14: Ws('s13', 'когда'),
      end: MODE === 'y' ? TLX.vEnd : T13.qEnd + .25 };
    const h = HY, pill = (y0, y1, k, dy = 0) => { c.save(); c.setTransform(1, 0, 0, 1, 0, dy); yearPill(c, y0, y1, k, 1, true); c.restore() };
    if (t < h.t1 - .25) return;
    if (t < h.t72 - .3) return pill(1924, 1954, at(t, h.t54 - .15, h.t54 + .35), -240 * (1 - eo(at(t, h.t1 - .25, h.t1 + .15))));
    if (t < h.t90 - .3) return pill(1954, 1972, at(t, h.t72 - .15, h.t72 + .35));
    if (t < h.t92 - .3) return pill(1972, 1990, at(t, h.t90 - .15, h.t90 + .35));
    if (t < h.out + .45) return pill(1990, 1992, at(t, h.t92 - .15, h.t92 + .35), -240 * ei(at(t, h.out, h.out + .45)));
    if (t < h.t14 - .25 || t > h.end + .45) return;
    pill(2014, 2014, 1, -240 * Math.max(1 - eo(at(t, h.t14 - .25, h.t14 + .15)), ei(at(t, h.end, h.end + .45))));
  }
  let MBC = null; const SHUT = [];   // окна короткой выдержки — заполняются в allInit по быстрым проездам камеры
  function sceneMB(c, t) {   // затвор 180° — среднее 4 моментов за полкадра
    const n = 4, sh = SHUT.some(([a, b]) => t > a && t < b) ? 1 / 240 : 1 / 60; if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { scene(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); scene(g, tj);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (window.NOMB) scene(c, t); else sceneMB(c, t);
    c.setTransform(1, 0, 0, 1, 0, 0); hud(c, t); subs(c, t);
  }
  function cues() {   // звуки по событиям сцен (мягкие)
    allInit(); const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    const a = T1; if (a.hk) { Q(.05, 'leaves', .35); Q(a.brut, 'whoosh', .35); Q(a.ledi - .1, 'pageflip', .5) } Q(a.marl, 'whoosh', .3); Q(a.do, 'pageflip', .8); Q(a.do + .5, 'papers', .4); Q(a.zh - .2, 'whoosh', .6);
    const b = T2; Q(b.perv - .1, 'whoosh', .4); Q(b.myag - .1, 'plop', .5); Q(b.myag + .2, 'scroll', .35); Q(b.izy, 'pageflip', .6); Q(b.rekl, 'papers', .45); Q(b.zh, 'pageflip', .5); Q(b.kr - .2, 'whoosh', .45); Q(b.kr + .2, 'lipstick', .9); Q(b.kon, 'lipstick', .6); Q(b.kot, 'whoosh', .35); Q(b.tilt0 + .1, 'whoosh', .5); Q(b.tilt1, 'deep', .5);
    const d = TC; Q(d.pyat - .15, 'plop', .4); Q(d.gor - .1, 'counter', .5); Q(d.gor + .35, 'glass', .45); Q(d.proc - .2, 'plop', .5); Q(d.umer - .1, 'puff', .35); Q(d.spas - .05, 'whoosh', .6);
    Q(d.nam - .15, 'pour', .4); Q(d.nam + .3, 'marker', .5); Q(d.smol, 'marker', .4); Q(d.op - .1, 'xray', .45); Q(d.op + .45, 'xray', .3); Q(d.amer + .15, 'marker', .55); for (let i = 0; i < BARS.length; i++) Q(d.amer + .75 + i * .26, 'plop', .22, -.4 + i * .1); Q(d.men - .2, 'thud', .5);
    Q(d.bros - .1, 'whoosh', .5); Q(d.bros + .3, 'school', .35); for (let i = 0; i < 5; i++) Q(d.bros + .1 + i * .18, 'plop', .25, -.3 + i * .15); Q(d.muzh + .05, 'whoosh', .4); Q(d.nezh - .25, 'drawer', .5); Q(d.nezh + .02, 'stamp', .6);
    Q(d.fil - .1, 'icecrack', .5); Q(d.fil + .35, 'impact', .7); Q(d.fil + .45, 'thud', .6); Q(d.otkr - .35, 'whoosh', .35); Q(d.shch - .08, 'drawer', .9); Q(d.shch, 'stamp', .5); Q(d.chik - .1, 'whoosh', .6); Q(d.chik + .3, 'city', .4); Q(d.leo - .3, 'whoosh', .5); Q(d.end - .6, 'deep', .5);
    const e = T7; Q(e.stav - .3, 'whoosh', .4); Q(e.stav, 'marker', .6); Q(e.stav + .6, 'marker', .5); Q(e.stav + 1.2, 'marker', .45); Q(e.slov - .1, 'pour', .45); Q(e.sam + .1, 'scroll', .4); Q(e.sam + .3, 'plop', .5); Q(e.sim - .1, 'whoosh', .6);
    const f = T8; Q(f.cherez, 'truck', .45, -.4); Q(f.god, 'whoosh', .5); Q(f.byv, 'truck', .35, .4); Q(f.chet - .2, 'counter', .5); Q(f.chet + .2, 'glass', .45); Q(f.sem - .1, 'whoosh', .7); Q(f.sw + .1, 'deep', .5); Q(f.mir - .1, 'whoosh', .45);
    PACKS_E.forEach((p, i) => { const pa = Math.atan2(p[1], p[0]), dd = ((pa + Math.PI / 2) % TAU + TAU) % TAU; Q(lp(f.sweep0, f.sweep1, dd / TAU), 'plop', .35, (p[0]) * .8) });
    const g = T9; Q(g.vot - .3, 'whoosh', .6); Q(g.kur - .05, 'neon', .4); Q(g.kur + .1, 'puff', .3); Q(g.uein - .05, 'plop', .4); for (let i = 0; i < 8; i++) Q(g.polt - .2 + i * .19, 'pageflip', .25, .2); Q(g.dev - .05, 'xray', .55);
    Q(g.rekl - .25, 'conveyor', .4); Q(g.rekl, 'chain', .35); Q(g.umer - .15, 'thud', .55); Q(g.pyat + .3, 'thud', .5); Q(g.vsego, 'whoosh', .45); for (let i = 0; i < 3; i++) Q(g.chet - .05 + i * .25, 'thud', .4, -.2 + i * .25); Q(g.marl, 'leaves', .35);
    if (T12) { const h = T12; Q(h.pom - .05, 'whoosh', .5); Q(h.mil - .1, 'plop', .5); Q(h.mil + .2, 'coins', .4); Q(h.pochti, 'counter', .6); Q(h.spok - .25, 'whoosh', .45); Q(h.korm - .08, 'register', .8); Q(h.korm + .15, 'receipt', .7); Q(h.burn, 'puff', .5) }
    Q(TSM - .3, 'whoosh', .55);
    const k = T13; Q(k.isp - .1, 'school', .3); Q(k.tret - .15, 'puff', .4); Q(k.tret + .1, 'glassbulb', .4); Q(k.tab - .3, 'whoosh', .45); Q(k.tab, 'drawer', .45); Q(k.gre, 'pour', .35); Q(k.stiki - .1, 'whoosh', .5); Q(k.naz - .1, 'glass', .45);
    for (let i = 0; i < 3; i++) Q(k.marl - .05 + i * .22, 'glass', .5, -.4 + i * .4);
    if (MODE === 'y') { Q(TLX.vEnd + .05, 'whoosh', .55); Q(TLX.vEnd + 1.3, 'marker', .4) } else { Q(k.q - .1, 'plop', .5); Q(k.qEnd - .2, 'whoosh', .45); Q(k.qEnd + .3, 'whoosh', .6) }
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); TLS = tl.sent; const ep = String(tl.ep || '').replace(/-(ru|en|de)$/, '');
      MODE = /y$/.test(ep) ? 'y' : 's';
      TLX = { b0: tl.b0, vEnd: tl.vEnd, endT: (Math.ceil(tl.dur * 30) - 1) / 30 };
      K = keys(); window.__K = K; BLOCKS.length = 0; SHUT.length = 0; HY = null; cues(); window.CUES_READY = 1; CHUNKS = buildChunks();
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v200f')) { const st = document.createElement('style'); st.id = 'v200f';
        st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join('')
          + ['latin', 'cyrillic'].map(sub => `@font-face{font-family:P;font-weight:700;font-style:normal;src:url(fonts/playfair-${sub}-700-normal.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}@font-face{font-family:P;font-weight:400 700;font-style:italic;src:url(fonts/playfair-${sub}-700-italic.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}`).join('');
        document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U', '700 20px P', 'italic 700 20px P', 'italic 400 20px P'].map(f => document.fonts.load(f, 'АЯaz09$'))).then(() => 0);
    },
  };
})();
