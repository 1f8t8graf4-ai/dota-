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
    out.forEach((ch, i) => { const nx = out[i + 1]; ch.e = nx ? Math.min(nx.a - .02, ch.b + .6) : MODE === 'y' ? Math.min(ch.b + .8, TLX.vEnd + .3) : ch.b + .2; ch.s = ch.s.replace(/\.\.\./g, '…').replace(/[.,;:—]+$/, '').replace(/^—\s*/, '') });   // v20.2: в фильме последний субтитр уходит до отъезда на доску
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
    const sy = (MODE === 'y' && T12 && ch.a >= T12.mil - .1 && ch.a < T12.perezh - .1) ? 1416 : SUBY;   // v20.5: пока камера на карточке 1979, подпись «1979 · СОЛЬ» внизу кадра — субтитр выше, в тёмном поле фото под кругом
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
  // ================= мир 1: щит Marlboro Country у трассы на закате (кадр 0) → ветер рвёт плакат с угла → под ним дамская реклама, нырок в дыру (#088) =================
  let T1 = null, K1 = null, W1PRE = null, W1PEEL = null;   // v20.1: W1PRE / W1PEEL — только когда главу рисует мостик «Льда» (камера до кадра 0, порыв ветра)
  const W1V = .4;   // v20.1: фильм — в кадре 0 камера уже наезжает (лог. масштаба в секунду); мостик «Льда» приходит с той же скоростью
  function w1Init() {
    const hk = SA('hook') !== null, s1 = SA('s1');
    T1 = { hk, s1, marl: Ws('s1', 'мальборо'), do: Ws('s1', 'до'), zh: Ws('s1', 'жизнь'), end: SA('s2') - .02,
      ledi: hk ? Ws('hook', 'леди') : -9, brut: hk ? Ws('hook', 'брутальности') : -9 };
    const a = T1;   // камера: кадр 0 → пачка → угол → нырок в розовый слой под плакатом
    K1 = [KY(0, 540, 960, 1)];
    // v20.2: до «до» камера держит щит целиком (надпись и всадник в кадре), потом едет к отогнутому углу
    if (hk) K1.push(KY(a.brut, 545, 944, 1.05), KY(a.s1 - .2, 540, 912, 1.1));   // крючок: медленный наезд, камера не стоит
    else { K1[0].v = [0, 0, W1V, 0]; K1.push(KY(.62, 540, 905, 1.12)) }   // v20.1: фильм — кадр 0 на ходу (наезд продолжает нырок мостика «Льда») и сразу мягко тормозит
    K1.push(KY(a.do + .05, 548, 880, 1.16), KY(a.do + .6, 760, 860, 1.42), KY(a.zh - .5, 860, 860, 1.9), KY(a.zh + .05, 900, 870, 2.6), KY(a.end, 918, 872, 9.5));
  }
  function w1Peel(t) {
    const a = T1; let px = 210 + 14 * Math.sin(t * 3.1) + 8 * Math.sin(t * 7.3);   // ветер треплет угол
    if (a.hk) px += 40 * eo(at(t, a.ledi - .3, a.ledi + .6));
    return px + 1250 * eio(at(t, a.do - .1, a.zh + .2)) + (W1PEEL ? W1PEEL(t) : 0);
  }
  function tumbleweed(c, x, y, R, rot) {
    c.save(); c.translate(x, y); c.rotate(rot); c.strokeStyle = '#8A4A2A'; c.lineWidth = 4;
    for (let k = 0; k < 14; k++) { c.beginPath(); c.arc(((k * 13) % 21 - 10) * R / 40, ((k * 7) % 17 - 8) * R / 40, R * (.65 + ((k * 11) % 22) / 40), k * .9, k * .9 + 2.1); c.stroke() } c.restore();
  }
  function w1World(c, t, q) {
    layer(c, q, .3, cc => { P0(cc, .3); desertFar(cc) });   // дальний план почти стоит
    layer(c, q, 1, cc => { desertGround(cc, t); billboardFrame(cc); poster(cc, t, { peelPx: w1Peel(t), glow: eo(at(t, T1.marl - .05, T1.marl + .3)) * (1 - eio(at(t, T1.do + .4, T1.do + 1))) }) });   // v20.2: на «Мальборо» имя на пачке загорается
    layer(c, q, 1.35, cc => { P0(cc, 1.35);   // передний план: перекати-поле катится, песок по ветру
      const u = (t * .045 + .62) % 1, x = lp(-300, 1500, u); tumbleweed(cc, x, 1530 - Math.abs(Math.sin(t * 2.4)) * 26, 44, t * 2.2);
      cc.strokeStyle = 'rgba(242,180,90,.5)'; cc.lineWidth = 3;
      [[90, 1500], [270, 1560], [500, 1510], [690, 1590], [210, 1650], [620, 1680], [960, 1640], [-200, 1600], [1200, 1540]].forEach(([x0, y0], i) => { const dx = ((t * 160 + i * 90) % 400); cc.beginPath(); cc.moveTo(x0 + dx, y0); cc.lineTo(x0 + dx + 80, y0 - 16); cc.stroke() });
    });
  }
  function w1Shot(c, t) { const v = camAt(K1, t); if (W1PRE && t < 0) v[2] = W1PRE(t); w1World(c, t, camObj(v)) }
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
      KY(a.zh + .35, 800, 1230, .6), KY(a.kr + .05, 860, 1300, .56), KY(a.kon + .25, LIP.x, 1250, .6), KY(a.pom - .05, LIP.x, 1215, .7),   // v20.2: заголовок страницы всё время ниже плашки года
      KY(a.tilt1, LIP.x, a.top, 2.4), KY(a.end, LIP.x, a.top, 11.6)];
  }
  // дама 1920-х сбоку (смотрит вправо), ноги — y 0. v20.2: икры и тонкие щиколотки, туфли на каблуке, платье с заниженной талией и складками,
  // подол фестонами, пояс с бантом, клатч; сигарета между пальцев: красный мундштук к лицу, огонёк наружу, дым — от огонька
  function shoe(c, ax, ay, col) {
    c.beginPath(); c.moveTo(ax - 9, ay - 2); c.quadraticCurveTo(ax + 8, ay + 4, ax + 20, ay + 15); c.quadraticCurveTo(ax + 34, ay + 26, ax + 46, ay + 27); c.lineTo(ax + 46, ay + 30);
    c.lineTo(ax + 6, ay + 30); c.quadraticCurveTo(ax - 2, ay + 24, ax - 5, ay + 14); c.lineTo(ax - 6, ay + 30); c.lineTo(ax - 12, ay + 30); c.lineTo(ax - 13, ay + 6); c.closePath(); fill(c, col);
  }
  function lady(c, x, y, s, t, col = '#3A1830', rim = '#F1C3CC') {
    c.save(); c.translate(x, y); c.scale(s, s);
    const sk = shd(col, .25), acc = C3.rose2;
    limb(c, [[-28, -604], [-46, -492], [-56, -396]], [20, 16, 12], sk); rr(c, -80, -404, 46, 30, 7); fill(c, acc); c.fillStyle = C3.gold; c.fillRect(-80, -392, 46, 4);   // задняя рука от плеча, за спиной, с клатчем
    limb(c, [[-18, -240], [-20, -150], [-15, -30]], [27, 31, 12], sk); shoe(c, -15, -30, sk);   // задняя нога
    limb(c, [[14, -240], [24, -150], [32, -30]], [27, 31, 12], col); shoe(c, 32, -30, col);   // передняя нога
    c.beginPath(); c.moveTo(-34, -618); c.bezierCurveTo(-44, -560, -46, -470, -46, -404); c.lineTo(-72, -234);   // спина, юбка чуть клёш
    [[-58, -218, -46, -232], [-30, -214, -14, -230], [2, -212, 18, -228], [36, -212, 52, -228], [66, -214, 78, -232]].forEach(([qx, qy, ex, ey]) => c.quadraticCurveTo(qx, qy, ex, ey));   // подол фестонами
    c.lineTo(52, -404); c.bezierCurveTo(54, -470, 58, -520, 50, -552); c.bezierCurveTo(44, -584, 40, -606, 34, -618); c.quadraticCurveTo(0, -606, -34, -618); c.closePath(); fill(c, col);
    c.strokeStyle = sk; c.lineWidth = 3; [[-22, -398, -34, -238], [6, -398, 4, -234], [32, -398, 44, -236]].forEach(([x0, y0, x1, y1]) => { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke() });   // складки
    c.fillStyle = acc; c.beginPath(); c.moveTo(-47, -416); c.lineTo(53, -416); c.lineTo(52, -398); c.lineTo(-46, -398); c.closePath(); c.fill();   // пояс
    c.beginPath(); c.ellipse(-50, -414, 16, 9, -.5, 0, TAU); c.ellipse(-50, -398, 16, 9, .5, 0, TAU); fill(c, acc); PL(c, [-50, -404, -60, -350, -52, -352], acc); PL(c, [-48, -404, -40, -356, -34, -360], acc);   // бант
    rr(c, -12, -664, 24, 52, 8); fill(c, col);   // шея
    circ(c, 6, -690, 36, col); PL(c, [36, -708, 50, -689, 40, -682], col);   // голова, нос
    c.beginPath(); c.ellipse(38, -672, 4.5, 2.8, -.2, 0, TAU); fill(c, C3.red);   // губы
    c.beginPath(); c.moveTo(-36, -700); c.quadraticCurveTo(-42, -664, -24, -652); c.quadraticCurveTo(-10, -662, -8, -676); c.lineTo(-14, -700); c.closePath(); fill(c, sk);   // каре
    c.beginPath(); c.moveTo(-36, -690); c.bezierCurveTo(-38, -740, -10, -762, 14, -760); c.bezierCurveTo(40, -758, 52, -734, 50, -700); c.quadraticCurveTo(54, -690, 62, -686); c.lineTo(58, -676); c.quadraticCurveTo(30, -684, 4, -684); c.quadraticCurveTo(-24, -682, -40, -668); c.closePath(); fill(c, shd(col, .12));   // шляпка-колокол
    c.fillStyle = acc; c.fillRect(-36, -704, 86, 7);
    for (let i = 0; i < 11; i++) { const u = i / 10; circ(c, lp(-6, 30, u) + Math.sin(u * Math.PI) * 14, lp(-622, -500, u), 4.6, '#F6EBDD') }   // длинные бусы
    const tip = [150, -636]; cig3(c, 76, -574, tip[0], tip[1], 4.6, { tip: C3.red, tl: .2, ring: C3.gold, em: .85 });   // мундштук к лицу, огонёк наружу
    limb(c, [[30, -600], [68, -506], [98, -593]], [19, 15, 12], col); circ(c, 99, -594, 9, col); PL(c, [94, -602, 108, -606, 104, -596], col);   // рука, пальцы держат сигарету
    const sw = Math.sin(t * 1.7) * 9; smokeLine(c, [tip[0] + 3, tip[1] - 4, tip[0] + 12 + sw, tip[1] - 70, tip[0] - 4 + sw, tip[1] - 150, tip[0] + 18 - sw, tip[1] - 240, tip[0] + 4, tip[1] - 330], 5.5, '#F6EBDD', .85);
    SL(c, [-34, -616, -44, -560, -46, -470, -46, -404, -72, -234], rim, 4); SL(c, [-34, -700, -26, -748, 10, -760], rim, 3); SL(c, [-16, -236, -18, -150, -13, -32], rgba(rim, .55), 2.5);
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
      rr(c, x - W / 2, y, W, bodyL, lp(10, 22, m)); fill(c, tube); c.fillStyle = shd(tube, lp(.22, .1, m)); c.fillRect(x + W * .22, y, W * .28, bodyL); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(x - W * .38, y + 20, W * .08, bodyL - 40);
      if (m < 1) A(c, 1 - m, () => { rr(c, x - LIP.w / 2 - 14, y - 22, LIP.w + 28, 44, 10); fill(c, col); c.fillStyle = shd(col, .2); c.fillRect(x + LIP.w * .2, y - 22, LIP.w * .34, 44);
        for (let i = 0; i < 4; i++) c.fillRect(x - LIP.w / 2 - 10, y + 70 + i * 26, LIP.w + 20, 5) });
      const tipH = lp(ext + 6, 170, m);   // стержень помады → красный кончик сигареты
      c.beginPath(); c.moveTo(x - bw / 2, y); c.lineTo(x - bw / 2, top + slant + 10); c.quadraticCurveTo(x - bw / 2, top + slant, x - bw / 2 + 14, top + slant - 4 * (1 - m));
      c.lineTo(x + bw / 2 - 14, top + 4); c.quadraticCurveTo(x + bw / 2, top, x + bw / 2, top + 14); c.lineTo(x + bw / 2, y); c.closePath();
      c.save(); c.clip(); c.fillStyle = C3.red; c.fillRect(x - bw / 2, top - 10, bw, Math.max(tipH, ext + 20) + 20);
      if (m > 0) { c.fillStyle = C3.white; c.fillRect(x - bw / 2, top + tipH, bw, bodyL + 400) }
      c.fillStyle = C3.redD; c.fillRect(x + bw * .22, top - 10, bw * .3, tipH + 10); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x - bw * .36, top + slant + 8, bw * .08, tipH - slant - 12); c.restore();
      if (m > .3) A(c, at(m, .3, .8), () => {   // v20.2: бумага сигареты — шов и надпись Marlboro вдоль, у мундштука
        c.fillStyle = 'rgba(60,30,40,.09)'; c.fillRect(x - bw * .3, top + tipH + 12, 3, bodyL);
        c.save(); c.translate(x - bw * .04, top + tipH + 64); c.rotate(Math.PI / 2); tx(c, 'Marlboro', 0, 0, { f: 'P', w: 700, st: 'italic', s: 46, c: 'rgba(176,18,44,.85)', al: 'left' }); c.restore() });
      if (rib > 0) {   // v20.2: тонкое золотое кольцо между красным мундштуком и бумагой (обвивает слева направо) — сигарета, а не маркер
        const ry = top + tipH, e = 10, hh = 10; c.save(); c.beginPath(); c.rect(x - bw / 2 - 4, ry - e - hh - 8, (bw + 8) * rib, 2 * e + hh + 20); c.clip();
        c.beginPath(); c.ellipse(x, ry + hh / 2, bw / 2 + 2, e, 0, 0, Math.PI); c.lineTo(x - bw / 2 - 2, ry - hh / 2); c.ellipse(x, ry - hh / 2, bw / 2 + 2, e, 0, Math.PI, 0, true); c.closePath(); fill(c, C3.gold);
        c.beginPath(); c.ellipse(x, ry - hh / 2 + 2, bw / 2 + 2, e, 0, .2, Math.PI - .2); c.strokeStyle = 'rgba(255,240,200,.75)'; c.lineWidth = 2.5; c.stroke(); c.restore();
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
  let TC = null, KC = null, NC2 = null, NCH = null;
  const MK = { x: 540, y: 860, R: 400 }, SLIT = .045;   // круг рынка; щель «Мальборо» — 2,6° (0,25 % — это 0,9°, тоньше не видно)
  const SLAB = [-420, -300], TOPY = -900, ROOF = [-2520, -2400], WALLX = [1480, 1560], SHOPX = 3900;
  const GRAYS = ['#5B5866', '#6C6977', '#4D4A57', '#7A7784'];
  const WIN = { x: 2945, y: -2150, w: 600, h: 520 }, CHM = .155;   // v20.4: окно над новой пачкой — за стеклом ночной Чикаго (мир CH вложен в окно)
  function wcInit() {
    const w = (s, q, n) => Ws(s, q, n);
    TC = { a3: SA('s3'), pyat: w('s3', 'пятьдесят'), gor: w('s3', 'горстка'), zhen: w('s3', 'женщин'), chet: w('s3', 'четверть'), proc: w('s3', 'процента'), ryn: w('s3', 'рынка'), umer: w('s3', 'умерла'),
      spas: w('s4', 'спас'), strah: w('s4', 'страх'), uch: w('s4', 'учёные'), nam: w('s4', 'намазали'), smol: w('s4', 'смолой'), vyr: w('s4', 'выросли'), op: w('s4', 'опухоли'), amer: w('s4', 'америка'),
      vperv: w('s4', 'впервые'), dep: w('s4', 'депрессии'), stala: w('s4', 'стала'), men: w('s4', 'меньше'),
      kur: w('s5', 'курильщики'), bros: w('s5', 'бросились'), filt: w('s5', 'фильтром'), muzh: w('s5', 'мужчины'), stesn: w('s5', 'стеснялись'), schit: w('s5', 'считалось'), nezh: w('s5', 'неженок'),
      fil: w('s6', 'филип'), dar: w('s6', 'дарит'), vtor: w('s6', 'вторую'), zhizn: w('s6', 'жизнь'), filtr: w('s6', 'фильтр'), zhest: w('s6', 'жёсткую'), pach: w('s6', 'пачку'), otkr: w('s6', 'открывают'), shch: w('s6', 'щелчком'),
      vseh: w('s6', 'всех'), vidu: w('s6', 'виду'), chik: w('s6', 'чикагского'), rekl: w('s6', 'рекламщика'), leo: w('s6', 'лео'), bern: w('s6', 'бёрнетта'), end: SA('s7') - .02 };
    const a = TC;
    KC = [KY(a.pyat + .45, 540, 880, .96), KY(a.gor + .1, 540, 850, 1.0), KY(a.gor + .95, 546, 650, 1.38), KY(a.proc + .35, 545, 690, 1.24), KY(a.umer + .05, 548, 600, 1.3),
      KY(a.spas + .12, 552, 330, 1.22), KY(a.strah + .05, 575, -960, 1.1), KY(a.nam + .1, 430, -1060, 1.42), KY(a.smol + .2, 425, -1080, 1.55), KY(a.op + .25, 420, -1086, 1.64),
      KY(a.amer + .6, 780, -1080, .92), KY(a.men + .15, 960, -1100, .8), KY(a.bros + .45, 1650, -1160, .72), KY(a.filt + .35, 2350, -1110, .7), KY(a.muzh + .45, 2700, -1120, .74),
      KY(a.nezh - .45, 3010, -1080, 1.12), KY(a.nezh + .35, 3040, -1110, 1.32), KY(a.fil + .35, 3170, -1090, 1.14), KY(a.zhest + .05, 3200, -1080, 1.24),
      KY(a.otkr + .05, 3205, -1205, 1.72), KY(a.shch + .28, 3200, -1170, 1.42), KY(a.vidu, 3170, -1262, .94)];
    // v20.4: на «чикагского» камера поднимается от пачки к окну над прилавком и ныряет в стекло — за ним ночной Чикаго (мир CH вложен в окно); без наезда в пробку
    a.sw = a.rekl - .05; NCH = { x: WIN.x + WIN.w / 2, y: WIN.y + WIN.h / 2, m: CHM };
    KC.push(KY(a.chik + .02, 3232, -1610, 1.4), KY(a.sw - .25, 3244, -1846, 2.7), KY(a.sw, NCH.x, NCH.y, 4.2));   // на стыке кадр целиком внутри стекла, поля по 30 px
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
    if (kc > 0) { const w = lp(R * Math.tan(sl / 2) * 2, 30, kc); c.save(); c.translate(x, y); c.rotate(top);   // v20.2: щель → сигарета: бумага без красного у центра, у края — пепел и огонёк полосой (не градусник)
      cig3(c, 4, 0, R - 4, 0, w / 2, { em: em * kc, ek: kc, paper: mixc(C3.red, C3.white, kc) });
      if (em > .3) circ(c, R - 16, 0, 26, rgba('#FF9A4A', .16 * kc * em)); c.restore() }
    const kl = eo(at(t, a.gor + .3, a.gor + .9)) * (1 - eio(at(t, a.proc - .1, a.proc + .4)));   // лупа над щелью
    if (kl > 0) { const lx = x + 12, ly = y - R + 120 - (1 - kl) * 260, LR = 112; c.save(); c.globalAlpha *= Math.min(1, kl * 2);
      c.save(); c.translate(lx + 92, ly + 92); c.rotate(.78); rr(c, -14, 0, 28, 190, 10); fill(c, '#3A2A1E'); c.restore();
      circ(c, lx, ly, LR + 12, C3.gold); c.save(); c.beginPath(); c.arc(lx, ly, LR, 0, TAU); c.clip(); c.fillStyle = '#5B5866'; c.fillRect(lx - LR, ly - LR, LR * 2, LR * 2);
      c.fillStyle = C3.red; c.fillRect(lx - 70 - 12, ly - LR, 140, LR * 2);   // щель под лупой — широкая
      for (let i = 0; i < 5; i++) fig(c, lx - 52 + i * 26, ly + 56, .26, { col: '#F4F1EA', hc: C3.rose2 });
      c.fillStyle = 'rgba(255,255,255,.18)'; poly(c, [lx - LR, ly + 20, lx - 20, ly - LR, lx + 10, ly - LR, lx - LR, ly + 50]); c.fill(); c.restore();
      ring(c, lx, ly, LR + 6, '#8A6A2A', 4); c.restore() }
  }
  // ---------- лаборатория ----------
  function labRoom(c, t, q) {
    const v = viewRect(q); if (v.y0 > SLAB[0] + 10 || v.y1 < ROOF[1] - 10) return;
    const x0 = -1600, x1 = WALLX[0];
    c.fillStyle = '#123A3E'; c.fillRect(x0, ROOF[1], x1 - x0, SLAB[0] - ROOF[1]);
    c.strokeStyle = 'rgba(126,214,210,.08)'; c.lineWidth = 2; c.beginPath(); for (let gx = x0; gx < x1; gx += 80) { c.moveTo(gx, ROOF[1]); c.lineTo(gx, SLAB[0]) } for (let gy = ROOF[1]; gy < SLAB[0]; gy += 80) { c.moveTo(x0, gy); c.lineTo(x1, gy) } c.stroke();
    poly(c, [180, ROOF[1], 300, ROOF[1], 760, SLAB[0], 220, SLAB[0]]); fill(c, 'rgba(190,240,236,.07)'); poly(c, [900, ROOF[1], 980, ROOF[1], 1400, SLAB[0], 1000, SLAB[0]]); fill(c, 'rgba(190,240,236,.05)');   // косые лучи холодной лампы
    c.fillStyle = '#0E2B2E'; rr(c, 200, ROOF[1], 120, 40, 8); c.fill(); rr(c, 900, ROOF[1], 120, 40, 8); c.fill(); c.fillStyle = '#CFF6F2'; c.fillRect(214, ROOF[1] + 34, 92, 10); c.fillRect(914, ROOF[1] + 34, 92, 10);
    [[-1300, -1700], [-1300, -1350], [-760, -1700], [-760, -1350], [80, -1760]].forEach(([sx, sy], i) => {   // полки с колбами
      c.fillStyle = '#0B2427'; c.fillRect(sx, sy, 420, 16);
      for (let k = 0; k < 4; k++) { const fx = sx + 40 + k * 100, h = 70 + H1(i * 4 + k) * 70, col = ['#3FB6A8', '#7ED6CF', '#E7A9B6', '#F2B84B'][(i + k) % 4];
        c.beginPath(); c.moveTo(fx, sy); c.lineTo(fx, sy - h * .55); c.lineTo(fx + 12, sy - h * .55); c.lineTo(fx + 12, sy - h); c.lineTo(fx + 30, sy - h); c.lineTo(fx + 30, sy - h * .55); c.lineTo(fx + 42, sy - h * .55); c.lineTo(fx + 42, sy); c.closePath(); fill(c, rgba(col, .75)); lnB(c, 2.5, 'rgba(230,250,248,.5)') } });
    c.fillStyle = '#0B2427'; c.fillRect(WALLX[0], ROOF[1], WALLX[1] - WALLX[0], SLAB[0] - ROOF[1]);   // стена между лабораторией и лавкой
  }
  function table(c, x0, x1) {   // v20.4: в лаборатории — пол как у лавки и тумба с ящиками до пола (дым под столом не виден); ножки — только у прилавка, до пола лавки
    const FL = -620, bx0 = x0 + 20, bx1 = WALLX[0] - 40, bh = FL - TOPY - 34;
    c.fillStyle = '#0E2B2E'; c.fillRect(-1600, FL, WALLX[0] + 1600, SLAB[0] - FL); c.fillStyle = '#1F4E52'; c.fillRect(-1600, FL, WALLX[0] + 1600, 8);
    c.fillStyle = '#4A2F1F'; c.fillRect(bx0, TOPY + 34, bx1 - bx0, bh); c.fillStyle = '#2E1D14'; c.fillRect(bx0, FL - 20, bx1 - bx0, 20);
    for (let dx = bx0; dx < bx1 - 60; dx += 250) { c.fillStyle = '#3A2418'; c.fillRect(dx, TOPY + 34, 6, bh); rr(c, dx + 30, TOPY + 58, 190, 58, 6); lnB(c, 3, '#3A2418'); rr(c, dx + 30, TOPY + 132, 190, 92, 6); lnB(c, 3, '#3A2418');
      circ(c, dx + 125, TOPY + 87, 7, '#C9A24A'); circ(c, dx + 200, TOPY + 178, 7, '#C9A24A') }   // ящики и дверцы, латунные ручки
    c.fillStyle = '#5A3A26'; c.fillRect(x0, TOPY, x1 - x0, 34); c.fillStyle = '#7A5135'; c.fillRect(x0, TOPY, x1 - x0, 8);
    c.fillStyle = '#3E2718'; for (let lx = x0 + 40; lx < x1; lx += 520) if (lx > WALLX[1]) c.fillRect(lx, TOPY + 34, 26, FL - TOPY - 34) }
  // v20.2: мышь как у Боба — контур кривыми (спина, круп, острая мордочка), ушко-овал, глаз, усы, лапки, короткий хвост; смотрит влево, лапки — y 0
  const MOUSE = { x: 470, y: TOPY - 2 };
  const MT = [[330, -4], [[290, -8], [240, -46], [184, -40]]];   // хвост: кончик → у крупа
  const MB = [[184, -40], [[200, -90], [180, -140], [130, -160]], [[70, -182], [-20, -180], [-80, -160]], [[-130, -142], [-170, -128], [-205, -112]], [[-232, -98], [-252, -84], [-266, -70]],
    [[-252, -56], [-228, -44], [-200, -38]], [[-150, -16], [-60, -8], [20, -8]], [[100, -8], [170, -14], [184, -40]]];
  function bez(c, P) { c.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) c.bezierCurveTo(P[i][0][0], P[i][0][1], P[i][1][0], P[i][1][1], P[i][2][0], P[i][2][1]) }
  function flatB(P, n = 14) { const out = [[P[0][0], P[0][1]]]; for (let i = 1; i < P.length; i++) { const p0 = out[out.length - 1], [c1, c2, p3] = P[i];
      for (let k = 1; k <= n; k++) { const u = k / n, v = 1 - u; out.push([0, 1].map(j => v * v * v * p0[j] + 3 * v * v * u * c1[j] + 3 * v * u * u * c2[j] + u * u * u * p3[j])) } } return out }
  let MPATH = null;   // путь, по которому дым обводит мышь: хвост от кончика, потом контур тела (длины по дуге)
  function mPath() { if (MPATH) return MPATH; const P = flatB(MT).concat(flatB(MB).slice(1)); let L = 0; P.forEach((p, i) => { if (i) L += Math.hypot(p[0] - P[i - 1][0], p[1] - P[i - 1][1]); p[2] = L }); return (MPATH = { P, L }) }
  function mouseRun(t) { const a = TC; return ei(at(t, a.amer - .15, a.amer + .85)) }
  function mouse(c, t) {
    const a = TC, f = eio(at(t, a.uch - .38, a.uch + .18)); if (f <= 0) return;   // мышь заливается белым от крупа к мордочке, когда дым обвёл контур
    const run = mouseRun(t), { y } = MOUSE, x = MOUSE.x - 1250 * run, hop = run > 0 && run < 1 ? Math.abs(Math.sin(t * 26)) * 14 : 0, br = Math.sin(t * 3.1) * 2.5, base = '#F4F1EA', sk = shd(base, .24);
    c.save(); c.translate(x, y - hop);
    if (run < .02) rasterPoly(c, [-190, 0, 200, 0, 250, 54, -140, 54], 'rgba(5,20,22,.38)', 9, 2.3);
    c.save(); c.beginPath(); c.rect(lp(360, -360, f), -260, 900, 300); c.clip();
    c.beginPath(); bez(c, MT); c.strokeStyle = '#E9A9B4'; c.lineWidth = 7; c.lineCap = 'round'; c.stroke();   // хвост
    const lg = Math.sin(t * 26) * 14 * (run > 0 && run < 1 ? 1 : 0);
    rr(c, -168 + lg, -10, 34, 12, 6); fill(c, '#E9A9B4'); rr(c, 86 - lg, -10, 44, 12, 6); fill(c, '#E9A9B4');   // лапки
    c.save(); c.scale(1, 1 + br * .004); c.beginPath(); bez(c, MB); c.closePath(); fill(c, base);
    c.save(); c.beginPath(); bez(c, MB); c.closePath(); c.clip(); c.fillStyle = sk; c.fillRect(120, -200, 140, 220); c.beginPath(); c.ellipse(-30, -176, 110, 14, 0, 0, TAU); fill(c, 'rgba(255,255,255,.55)');
    c.beginPath(); c.moveTo(96, -14); c.bezierCurveTo(150, -36, 168, -98, 126, -142); lnB(c, 4, sk); c.restore(); c.restore();   // тень крупа, блик спины, линия бедра
    c.beginPath(); c.ellipse(-150, -150, 22, 31, -.35, 0, TAU); fill(c, base); c.beginPath(); c.ellipse(-150, -148, 12, 19, -.35, 0, TAU); fill(c, '#E9A9B4');   // ушко-овал
    circ(c, -206, -92, 6.5, '#1A1214'); circ(c, -208, -94.5, 2, '#fff'); circ(c, -266, -70, 6, '#E9A9B4');   // глаз, нос
    c.strokeStyle = 'rgba(230,236,240,.85)'; c.lineWidth = 2; [[-318, -96], [-326, -74], [-316, -52]].forEach(([wx, wy]) => { c.beginPath(); c.moveTo(-250, -74); c.quadraticCurveTo((wx - 250) / 2 - 125, (wy - 74) / 2 - 37, wx, wy); c.stroke() });   // усы
    const PT = { x: 30, y: -160, rx: 60, ry: 15 }; c.beginPath(); c.ellipse(PT.x, PT.y, PT.rx, PT.ry, -.04, 0, TAU); fill(c, '#EDB5BE');   // выбритое пятно
    const T0 = a.nam + .4, T1 = Math.min(t, a.smol + .35); if (T1 > T0) { c.save(); c.beginPath(); c.ellipse(PT.x, PT.y, PT.rx, PT.ry, -.04, 0, TAU); c.clip();   // смола — мазками по следу кисти
      c.beginPath(); let on = false; for (let k = 0; k <= 48; k++) { const tk = lp(T0, T1, k / 48), [bx, by] = brushPos(tk); if (by < -1092) { on = false; continue } const px = bx - MOUSE.x, py = PT.y + Math.sin(k * 1.7) * 3; if (!on) { c.moveTo(px, py); on = true } else c.lineTo(px, py) }
      c.strokeStyle = '#16100E'; c.lineWidth = 22; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); c.restore() }
    const sp = eo(at(t, a.vyr - .1, a.op + .2)); if (sp > 0) { c.beginPath(); c.ellipse(PT.x + 12, PT.y - 6 - 8 * sp, 26 * sp, 17 * sp, 0, 0, TAU); fill(c, '#5A1018'); c.beginPath(); c.ellipse(PT.x + 4, PT.y - 12 - 8 * sp, 10 * sp, 6 * sp, -.3, 0, TAU); fill(c, '#8E2C36') }   // опухоль — бугорок
    c.restore();
    if (run < .05) for (let k = 0; k < 2; k++) { const u = at(t, a.op + k * .45, a.op + .7 + k * .45); if (u <= 0 || u >= 1) continue; ring(c, 42, -176, 46 + 110 * eo(u), rgba('#E23A4E', .9 * (1 - u)), 7) }
    c.restore();
  }
  // дым от огонька — гладкая лента вверх; на «страх» обводит мышь от кончика хвоста; низ отрывается и тает.
  // v20.4 (разбор Gemini: «дым лезет в мышь снизу из-под стола»): лента идёт за перекрытием, полом и тумбой стола, над столом выходит справа от банки со смолой,
  // огибает банку сверху и опускается на кончик хвоста; обвод контура — поверх всего (smokeTrace)
  const SMK = [[540, 474], [552, 300], [566, 120], [592, -60], [640, -250], [720, -440], [830, -640], [940, -820], [1010, -958], [1044, -1080], [1026, -1188],
    [968, -1244], [890, -1250], [826, -1204], [796, -1100], [796, -990], [MOUSE.x + 330, MOUSE.y - 4]];
  let SMKP = null;
  function smokeRise(c, t) {
    const a = TC, rise = eio(at(t, a.umer + .05, a.strah - .12)); if (rise <= 0) return;
    if (!SMKP) { SMKP = smoothPts(SMK.flat(), 10); let L = 0; SMKP.forEach((p, i) => { if (i) L += Math.hypot(p[0] - SMKP[i - 1][0], p[1] - SMKP[i - 1][1]); p[2] = L }); SMKP.L = L;
      const iS = SMKP.findIndex(p => p[1] <= SLAB[1]); SMKP.uS = iS > 0 ? SMKP[iS][2] / L : 0 }   // v20.5: доля пути, на которой лента уходит за перекрытие
    const lo = eio(at(t, a.strah - .4, a.strah + .45)), fb = eio(at(t, a.strah - .62, a.strah - .22)), u0 = Math.max(lo, fb * SMKP.uS), u1 = rise,   // v20.5: пока камера поднимается к столу, хвост уходит из подвала за перекрытие
      wob = 1 - at(t, a.strah - .3, a.strah + .3);   // v20.4: низ ленты тает, как только дым вышел над столом
    if (u1 - u0 > .005) { const S = SMKP.filter(p => p[2] >= u0 * SMKP.L && p[2] <= u1 * SMKP.L).map((p, i) => [p[0] + Math.sin(t * 2.2 + p[1] * .01) * 14 * wob * (1 - p[2] / SMKP.L), p[1]]);
      if (S.length > 1) { c.save(); c.globalAlpha *= 1 - .7 * lo; ribbon(c, S, u => 14 + 10 * u, 'rgba(226,222,232,.22)'); ribbon(c, S, u => 6 + 3 * u, 'rgba(236,232,240,.8)'); c.restore() } }
  }
  function smokeTrace(c, t) {
    const a = TC, f = eio(at(t, a.uch - .38, a.uch + .18)), tr = eio(at(t, a.strah - .12, a.uch - .2)); if (tr <= 0 || f >= 1) return;   // обвод контура
    const { P, L } = mPath(), d = tr * L, S = []; for (const p of P) { if (p[2] > d) break; S.push([MOUSE.x + p[0], MOUSE.y + p[1]]) }
    if (S.length < 2) return; c.save(); c.globalAlpha *= 1 - f; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); S.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.strokeStyle = 'rgba(226,222,232,.3)'; c.lineWidth = 22; c.stroke(); c.strokeStyle = 'rgba(244,240,248,.95)'; c.lineWidth = 8; c.stroke();
    const h = S[S.length - 1]; if (tr < 1) { circ(c, h[0], h[1], 18, 'rgba(236,232,240,.35)'); circ(c, h[0], h[1], 9, 'rgba(250,248,252,.9)') } c.restore();
  }
  // кисть в стальном зажиме (без рук): штатив на столе, зажим едет сам
  function brushPos(t) {
    const a = TC, P = [[a.uch - .4, 760, -1240], [a.nam - .15, 900, -1005], [a.nam + .2, 900, -1060], [a.nam + .45, 552, -1074], [a.nam + .75, 452, -1070], [a.nam + 1.05, 552, -1068], [a.smol, 452, -1066], [a.smol + .3, 548, -1064], [a.smol + .6, 560, -1210],
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
    { const { x, y, w, h } = WIN, gl = 1 - at(t, TC.chik - .1, TC.sw - .3);   // v20.4: окно над новой пачкой — за стеклом ночной Чикаго (мир CH), в него камера и ныряет
      c.save(); rr(c, x, y, w, h, 10); c.clip(); inNest(c, NCH, cc => chWorld(cc, t, null));
      if (gl > 0) { c.fillStyle = `rgba(255,255,255,${.09 * gl})`; poly(c, [x + 40, y + h, x + 150, y + h, x + 330, y, x + 220, y]); c.fill(); poly(c, [x + 190, y + h, x + 224, y + h, x + 404, y, x + 370, y]); c.fill() }   // блики стекла
      c.restore(); rr(c, x, y, w, h, 10); lnB(c, 10, '#DCD3BE'); c.fillStyle = '#DCD3BE'; c.fillRect(x - 26, y + h + 4, w + 52, 16) }   // рама и подоконник
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
  // толпа белых фигурок: бегут к фильтрам; мужчины тормозят и отходят; v20.2: после «дарит» мужчины идут к новой пачке и подпрыгивают на щелчок
  const MEN = [0, 2, 3, 5, 6, 8, 9, 11];
  function crowd(c, t) {
    const a = TC, run = at(t, a.bros - .2, a.bros + 1.6); if (run <= 0) return;
    for (let i = 0; i < 12; i++) { const m = i % 3 !== 1, x0 = SHOPX + 500 + i * 120, xt = 1950 + (i % 8) * 120 + (m ? 40 : 0), turn = m ? eo(at(t, a.muzh - .05 + (i % 3) * .08, a.muzh + .35 + (i % 3) * .08)) : 0;
      const back = m ? eio(at(t, a.stesn, a.nezh + .2)) * 340 : 0, xb = lp(x0, xt + (m ? 260 : 0), eo(run)) + back;
      const g0 = a.dar + .05 + (i % 4) * .14, go = m ? eio(at(t, g0, g0 + 1.9)) : 0, mk = MEN.indexOf(i), xg = mk < 4 ? 2700 + mk * 78 : 3340 + (mk - 4) * 78, x = lp(xb, xg, go);   // встают по бокам пачки — её видно
      const walking = run < 1 || (go > 0 && go < 1), bob = walking ? Math.abs(Math.sin(t * 9 + i)) * 12 : 0;
      const hop = m ? Math.sin(Math.PI * at(t, a.shch + (i % 3) * .05, a.shch + .38 + (i % 3) * .05)) * 34 : 0;
      const dir = !m ? -1 : go > 0 ? (go < 1 ? Math.sign(xg - xb) || 1 : (x < PK.x + PK.w / 2 ? 1 : -1)) : (turn > .5 ? 1 : -1);
      fig(c, x, SLAB[0] - 200 + 6 - bob - hop, 1.55, { m, hat: m && i % 2 === 0, dir, col: '#F4F1EA', hc: C3.rose2 }) }
  }
  function shelfPacks(c, t) {
    const a = TC, kp = eio(at(t, a.bros - .1, a.bros + .55)), sl = eio(at(t, a.bros + .2, a.bros + 1.3)); if (kp <= 0) return;
    SHELF.forEach((tx0, i) => { if (i >= BARS.length) return; const x = lp(barX(i) - 46, tx0, sl); A(c, kp, () => pack5(c, x, TOPY - 12, 1, GRAYS[i % 4], { filt: true })) });
  }
  // v20.2: пудреница в 3/4: круглый корпус с бортиком, внутри пудра и пуховка, крышка на петле сзади — внутри зеркало; на «неженок» защёлкивается,
  // на «Филип» трескается и улетает вниз из кадра (не лежит на полу)
  function compact(c, t) {
    const a = TC, k = eio(at(t, a.schit - .2, a.schit + .25)), cr = at(t, a.fil - .12, a.fil + .18), fall = ei(at(t, a.fil + .3, a.fil + .85)); if (k <= 0 || fall >= 1) return;
    const x = 2926 - 520 * fall, y = TOPY - 12 - 136 - 40 + 1500 * fall * fall, R = 74, e = .42, th = R * .22;
    const phi = 1.9 * (1 - eio(at(t, a.nezh - .3, a.nezh + .02))), ry = R * (e * Math.cos(phi) - .91 * Math.sin(phi)), cy = -R * (.91 * Math.sin(phi) + e - e * Math.cos(phi));
    c.save(); c.translate(x, y); c.rotate(-fall * 2.4); c.scale(k, k);
    if (ry < 0) {   // крышка открыта: видно зеркало
      c.beginPath(); c.ellipse(0, cy, R, -ry, 0, 0, TAU); fill(c, '#C9A24A'); c.beginPath(); c.ellipse(0, cy, R * .86, -ry * .86, 0, 0, TAU); fill(c, '#DDEFF4');
      c.save(); c.beginPath(); c.ellipse(0, cy, R * .86, -ry * .86, 0, 0, TAU); c.clip(); c.fillStyle = 'rgba(255,255,255,.55)'; poly(c, [-R * .5, cy + R, -R * .2, cy + R, R * .3, cy - R, 0, cy - R]); c.fill(); poly(c, [R * .05, cy + R, R * .14, cy + R, R * .64, cy - R, R * .55, cy - R]); c.fill(); c.restore() }
    c.beginPath(); c.ellipse(0, th, R, R * e, 0, 0, TAU); fill(c, '#B9657A'); c.fillStyle = '#B9657A'; c.fillRect(-R, 0, R * 2, th);   // бортик
    c.beginPath(); c.ellipse(0, 0, R, R * e, 0, 0, TAU); fill(c, '#C9A24A'); c.beginPath(); c.ellipse(0, 0, R * .86, R * e * .86, 0, 0, TAU); fill(c, '#F3D5C6');   // кольцо, пудра
    c.beginPath(); c.ellipse(-R * .12, -R * .04, R * .5, R * e * .48, 0, 0, TAU); fill(c, '#FBF4EE'); c.beginPath(); c.ellipse(-R * .12, -R * .07, R * .5, R * e * .4, 0, Math.PI, TAU); fill(c, '#FFFFFF');   // пуховка
    c.beginPath(); c.ellipse(R * .3, -R * .1, R * .12, R * .07, .4, 0, TAU); fill(c, C3.rose2);   // бантик на пуховке
    if (ry >= 0) {   // крышка закрывается сверху
      c.beginPath(); c.ellipse(0, cy, R, ry, 0, 0, TAU); fill(c, '#E7A9B6'); c.beginPath(); c.ellipse(0, cy, R, ry, 0, 0, TAU); lnB(c, 3, '#C9A24A');
      c.beginPath(); c.ellipse(0, cy, R * .38, ry * .38, 0, 0, TAU); lnB(c, 3, '#C9A24A');
      if (cr > 0) { c.save(); c.beginPath(); c.ellipse(0, cy, R, ry, 0, 0, TAU); c.clip(); c.beginPath(); c.moveTo(-R, cy - 4); c.lineTo(-24, cy + 6); c.lineTo(6, cy - 8); c.lineTo(34, cy + 8); c.lineTo(R, cy - 2); c.moveTo(6, cy - 8); c.lineTo(14, cy - R * .4); lnB(c, 4 * cr, '#5a1a2a'); c.restore() } }
    c.restore();
    const kp = at(t, a.nezh - .1, a.nezh + .3) * (1 - at(t, a.fil - .3, a.fil + .1)); if (kp > 0) tx(c, 'ДЛЯ НЕЖЕНОК', 2980, TOPY - 520, { f: 'M', w: 800, s: 70 * bo(kp), c: '#F1C3CC', a: Math.min(1, kp * 2) });
  }
  // старая мягкая пачка → на «Филип» сверху падают жёсткие стенки и захлопываются — новая пачка Marlboro; на «щелчком» крышка откидывается
  const PK = { x: OLDP - 95, y: TOPY - 12, w: 190, h: 282 };
  // v20.4 (разбор Gemini: «пачка 4 секунды стоит без движения»): на «вторую жизнь» по пачке бежит блик, на «фильтр» полоса сканера показывает
  // сигареты с фильтрами внутри (как рентген у Макларена, Боб #037), на «жёсткую пачку» пачка дважды стучит о прилавок
  function packKnock(t) { const a = TC, k1 = at(t, a.zhest - .02, a.zhest + .26), k2 = at(t, a.pach - .06, a.pach + .2); return 34 * Math.sin(Math.PI * k1) + 26 * Math.sin(Math.PI * k2) }
  function packGlow(c, t) {   // за пачкой — тёплое сияние на стене (на белой пачке блик не виден)
    const a = TC, s = at(t, a.vtor - .12, a.zhizn + .45); if (s <= 0 || s >= 1) return; const { x, y, w, h } = PK, k = Math.sin(Math.PI * s);
    glow(c, x + w / 2, y - h / 2, 210 + 90 * eo(s), '#FFE7A6', .55 * k);
    for (let i = 0; i < 8; i++) { const an = -Math.PI / 2 + (i - 3.5) * .3 + Math.sin(t * .8) * .04, L0 = 160, L1 = 300 + 110 * k; c.beginPath(); c.moveTo(x + w / 2 + Math.cos(an - .04) * L0, y - h / 2 + Math.sin(an - .04) * L0);
      c.lineTo(x + w / 2 + Math.cos(an) * L1, y - h / 2 + Math.sin(an) * L1); c.lineTo(x + w / 2 + Math.cos(an + .04) * L0, y - h / 2 + Math.sin(an + .04) * L0); c.closePath(); fill(c, rgba('#FFF1B8', .28 * k)) }   // лучи — только вверх и в стороны
  }
  function packSheen(c, t) {
    const a = TC, s = at(t, a.vtor - .08, a.zhizn + .3); if (s <= 0 || s >= 1) return; const { x, y, w, h } = PK, top = y - h, o = lp(-w * .9, w * 1.25, eio(s)), al = .5 * Math.sin(Math.PI * s);
    c.save(); c.beginPath(); c.rect(x, top, w, h); c.clip(); c.fillStyle = `rgba(255,255,255,${al})`; poly(c, [x + o, top + h, x + o + w * .24, top + h, x + o + w * .24 + h * .5, top, x + o + h * .5, top]); c.fill();
    c.fillStyle = `rgba(255,255,255,${al * .5})`; poly(c, [x + o + w * .32, top + h, x + o + w * .38, top + h, x + o + w * .38 + h * .5, top, x + o + w * .32 + h * .5, top]); c.fill(); c.restore();
    for (let k = 0; k < 3; k++) { const u = at(s, .35 + k * .12, .75 + k * .1); if (u <= 0 || u >= 1) continue; const sx = [x + w + 22, x - 50, x + w * .5][k], sy = [top - 12, top + h * .42, top - 40][k], r = 16 * Math.sin(Math.PI * u);
      c.fillStyle = '#FFF6D6'; poly(c, [sx, sy - r * 2, sx + r * .35, sy - r * .35, sx + r * 2, sy, sx + r * .35, sy + r * .35, sx, sy + r * 2, sx - r * .35, sy + r * .35, sx - r * 2, sy, sx - r * .35, sy - r * .35]); c.fill() }   // искры
  }
  function packXray(c, t) {
    const a = TC, { x, y, w, h } = PK, top = y - h, sd = eio(at(t, a.filtr - .22, a.filtr + .2)), su = eio(at(t, a.zhest - .4, a.zhest - .06)); if (sd <= 0 || su >= 1) return;
    const y0 = top + h * su, y1 = top + h * sd;
    if (y1 - y0 > 1) { c.save(); c.beginPath(); c.rect(x - 2, y0, w + 4, y1 - y0); c.clip();
      c.fillStyle = '#0B1A33'; c.fillRect(x, top, w, h); c.strokeStyle = 'rgba(120,210,240,.22)'; c.lineWidth = 1.5; c.beginPath();
      for (let gx = x; gx <= x + w; gx += 19) { c.moveTo(gx, top); c.lineTo(gx, top + h) } for (let gy = top; gy <= top + h; gy += 19) { c.moveTo(x, gy); c.lineTo(x + w, gy) } c.stroke();
      for (let k = 0; k < 7; k++) { const cw = w / 7, cx = x + cw * k + cw * .12, iw = cw * .76, ct = top + h * .06, cb = top + h * .96, fh = h * .26;
        rr(c, cx, ct, iw, cb - ct, 4); c.strokeStyle = '#BFEFFF'; c.lineWidth = 2; c.stroke(); rr(c, cx, ct, iw, fh, 4); fill(c, 'rgba(226,199,154,.92)');
        c.fillStyle = 'rgba(120,70,30,.45)'; for (let s2 = 0; s2 < 3; s2++) c.fillRect(cx, ct + 10 + s2 * 18, iw, 3) }   // фильтры светятся цветом пробки
      rr(c, x + 1, top + 1, w - 2, h - 2, 2); c.strokeStyle = 'rgba(191,239,255,.9)'; c.lineWidth = 2; c.stroke(); c.restore() }   // контур коробки
    for (const ly of [sd < 1 ? y1 : null, su > 0 ? y0 : null]) if (ly !== null) { c.fillStyle = 'rgba(190,240,255,.25)'; c.fillRect(x - 14, ly - 8, w + 28, 16); c.fillStyle = '#E8FBFF'; c.fillRect(x - 14, ly - 2, w + 28, 4) }   // полосы сканера
    const kp = at(t, a.filtr - .02, a.filtr + .25) * (1 - at(t, a.zhest - .22, a.zhest)); if (kp > 0) { c.beginPath(); c.moveTo(x + w + 8, top + h * .14); c.lineTo(x + w + 64, top + h * .14); lnB(c, 3, rgba('#F4F1EA', kp));
      plate(c, 'ФИЛЬТР', x + w + 146, top + h * .14, bo(kp), { s: 30, bg: '#F4F1EA', c: '#141010', ls: 2 }) }
  }
  function packDust(c, t) {   // удары о прилавок: облачка пыли и черты удара у дна
    const a = TC, { x, y, w } = PK;
    for (const ti of [a.zhest + .26, a.pach + .2]) { const u = at(t, ti - .01, ti + .42); if (u <= 0 || u >= 1) continue;
      for (const s2 of [-1, 1]) { for (let k = 0; k < 3; k++) circ(c, x + w / 2 + s2 * (w / 2 + 10 + 50 * eo(u) + k * 22), y - 8 - k * 10 * u, (14 - k * 3) * (1 - u * .6), rgba('#E8DCC8', .55 * (1 - u)));
        c.beginPath(); c.moveTo(x + w / 2 + s2 * (w / 2 + 16), y - 30); c.lineTo(x + w / 2 + s2 * (w / 2 + 40 + 40 * u), y - 52 - 20 * u); lnB(c, 4, rgba('#F4F1EA', 1 - u)) } }
  }
  function hardPack(c, t) {
    const a = TC, d = at(t, a.fil - .05, a.fil + .5), slam = eio(d), { x, y, w, h } = PK, top = y - h;
    if (slam < 1) softPack(c, x, top, w, h, 30, { shc: 'rgba(8,24,22,.35)' });
    if (d > 0 && slam < 1) { c.save(); c.translate(0, -(1 - ei(d)) * 1100); mPack(c, x, top, w, h, 34, { shadow: false }); c.restore() }   // жёсткая пачка падает сверху и накрывает мягкую
    if (slam >= 1) { const u = at(t, a.fil + .45, a.fil + .85); if (u > 0 && u < 1) for (let k = 0; k < 6; k++) { const s2 = k < 3 ? -1 : 1, yy = y - 20 - (k % 3) * 40; c.beginPath(); c.moveTo(x + w / 2 + s2 * (w / 2 + 20 + 60 * u), yy); c.lineTo(x + w / 2 + s2 * (w / 2 + 70 + 120 * u), yy - 10); lnB(c, 5, rgba('#F4F1EA', 1 - u)) } }
    if (slam >= 1) {
      const kn = packKnock(t); c.save(); c.translate(0, -kn);   // v20.4: «жёсткую пачку» — пачка стучит о прилавок
      packGlow(c, t);
      const lid = eio(at(t, a.shch - .08, a.shch + .24)), seam = at(t, a.otkr - .35, a.shch - .1), phi = lid * 1.98, cutY = top + h * .3, L = h * .3;
      if (lid > 0 && phi > Math.PI / 2) {   // v20.2: крышка откинулась назад на петле — за сигаретами видно её изнанку (золотая фольга)
        const hh = L * -Math.cos(phi); PL(c, [x - 34, top + 2 - hh * .9, x, top - hh, x, top, x - 34, top + 2], '#C8B370');
        c.fillStyle = '#F4EEDD'; c.fillRect(x, top - hh, w, hh); c.fillStyle = '#D9C27A'; c.fillRect(x + w * .08, top - hh + hh * .18, w * .84, hh * .64) }
      if (lid > 0) { c.fillStyle = '#E6E0D2'; c.fillRect(x, top + 3, w, h * .32); c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(x + w * .7, top + 3, w * .3, h * .32) }   // задняя стенка пачки изнутри
      if (lid > 0) {   // открытая пачка: сигареты с фильтром цвета пробки выезжают на щелчок (v20.4: в башни не растут — Чикаго за окном)
        const bot = top + h * .5;
        for (let i = 0; i < 4; i++) { const cx = x + w * (.2 + i * .2), ct = top + 14 - (74 - (i % 2) * 22) * ei(lid);
          rr(c, cx - 17, ct, 34, bot - ct, 6); fill(c, C3.white); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(cx + 4, ct, 13, bot - ct); c.fillStyle = C3.cork; c.fillRect(cx - 17, ct, 34, 44);
          c.fillStyle = 'rgba(120,70,30,.35)'; for (let s = 0; s < 3; s++) c.fillRect(cx - 17, ct + 8 + s * 12, 34, 3) } }
      if (lid > 0) { c.save(); c.beginPath(); c.rect(x - 60, cutY, w + 400, h + 400); c.clip(); mPack(c, x, top, w, h, 34, { shc: 'rgba(8,24,22,.35)' }); c.restore();   // корпус ниже линии крышки
        PL(c, [x - 34, top + 6, x, cutY, x - 34, cutY + 4], C3.redD);   // бок: косой срез от петли к линии крышки
        c.fillStyle = '#D9C27A'; c.fillRect(x + w * .05, cutY - h * .07, w * .9, h * .07 + 2); c.fillStyle = '#B89B55'; c.fillRect(x + w * .05, cutY - 3, w * .9, 5); PL(c, [x - 30, cutY - h * .06, x, cutY - h * .07, x, cutY + 2, x - 30, cutY + 4], '#B89B55');   // внутренний золотой воротник
        if (phi < Math.PI / 2) { const k2 = Math.cos(phi); c.save(); c.translate(0, top); c.scale(1, Math.max(.001, k2)); c.translate(0, -top); c.beginPath(); c.rect(x - 60, top - 10, w + 120, L + 10); c.clip(); mPack(c, x, top, w, h, 34, { shadow: false }); c.restore() } }   // крышка уходит назад: лицевая сторона сжимается к петле
      else mPack(c, x, top, w, h, 34, { shc: 'rgba(8,24,22,.35)' });
      if (seam > 0 && lid <= 0) { const sx = x + w * eio(seam); c.fillStyle = '#FFF6D6'; c.fillRect(x, top + h * .3, sx - x, 5); glow(c, sx, top + h * .3, 40, '#FFF1B8', .8) }
      for (let k = 0; k < 2; k++) { const u = at(t, a.shch + k * .18, a.shch + .7 + k * .18); if (u > 0 && u < 1) ring(c, x + w / 2, top, 60 + 260 * eo(u), rgba('#FFF1B8', .8 * (1 - u)), 6) }
      packSheen(c, t); packXray(c, t); c.restore(); packDust(c, t);
    }
  }
  function wcWorld(c, t, q) {
    const a = TC, md = eio(at(t, a.spas - .2, a.strah - .2));   // марка «умерла» — на рынке гаснет свет; v20.4 — целиком: под лабораторией и лавкой пачек больше не видно
    c.fillStyle = '#1A1720'; c.fillRect(-1600, ROOF[0], SHOPX + 3200, ROOF[1] - ROOF[0]);   // крыша
    labRoom(c, t, q); shopRoom(c, t, q);
    if (md < 1) packWall(c, q, -1600, SHOPX + 1600, SLAB[1], 1500);
    c.fillStyle = '#5A3A26'; c.fillRect(-1600, 1500, SHOPX + 3200, 220); c.fillStyle = '#7A5135'; c.fillRect(-1600, 1500, SHOPX + 3200, 10); c.fillStyle = '#1A1420'; c.fillRect(-1600, 1720, SHOPX + 3200, 2000);
    if (md < 1) marketDisc(c, t);
    const kr = at(t, a.proc + .1, a.proc + .45) * (1 - at(t, a.spas - .3, a.spas + .1));
    if (kr > 0) { const T = c.getTransform(), k = bo(kr), py = Math.min(1040, (1600 - T.f) / T.d - 70 * k); plate(c, '0,25 % РЫНКА', 540, py, k, { s: 62, bg: '#F4F1EA', c: '#141010', ls: 2 }) }   // v20.5: камера уходит вверх за дымом — плашка остаётся над субтитром (низ не ниже 1600 px), а не съезжает под него
    if (md > 0) { const v = viewRect(q); if (v.y1 > SLAB[1]) { const g = c.createLinearGradient(0, SLAB[1], 0, SLAB[1] + 1100); g.addColorStop(0, `rgba(22,19,28,${md})`); g.addColorStop(1, `rgba(8,7,11,${md})`);
      c.fillStyle = g; c.fillRect(v.x0 - 50, SLAB[1], v.x1 - v.x0 + 100, v.y1 - SLAB[1] + 50) } }
    smokeRise(c, t);   // v20.4: лента дыма — за перекрытием, полом и тумбой стола
    c.fillStyle = '#1A1720'; c.fillRect(-1600, SLAB[0], SHOPX + 3200, SLAB[1] - SLAB[0]); c.fillStyle = '#26222E'; for (let bx = -1560; bx < SHOPX + 1600; bx += 240) c.fillRect(bx, SLAB[0] + 34, 70, 52);   // перекрытие: торцы балок
    table(c, -300, SHOPX + 400); mouse(c, t); tarJar(c); strokeAxis(c, t); bars(c, t); shelfPacks(c, t);
    hardPack(c, t); compact(c, t); crowd(c, t); brushRig(c, t);
    smokeTrace(c, t);
  }
  function wcShot(c, t) { if (KCH && t >= TC.sw) return chShot(c, t); const q = camObj(camAt(KC, t)); layer(c, q, 1, cc => wcWorld(cc, t, q));
    layer(c, q, 1.3, cc => { const v = viewRect(q); if (v.y1 < SLAB[0] - 600 || v.y0 > SLAB[0] + 400) return;   // шестигранники смолы плывут мимо камеры
      for (let i = 0; i < 9; i++) { const hx = -200 + i * 260 + Math.sin(t * .5 + i) * 30, hy = -1500 + H1(i * 3) * 900 + ((t * 40 + i * 111) % 600) - 300, R = 26 + H1(i) * 18;
        cc.beginPath(); for (let k = 0; k < 6; k++) { const an = k * Math.PI / 3; cc.lineTo(hx + Math.cos(an) * R, hy + Math.sin(an) * R) } cc.closePath(); lnB(cc, 3, 'rgba(160,230,224,.28)') } });
  }
  // ================= мир CH (конец фразы 6): ночной Чикаго. v20.2 — по разбору Gemini: сигареты больше не проходят сквозь крышу лавки.
  // v20.4: мир CH вложен в окно лавки над новой пачкой (NCH, считается в wcInit): камера ныряет в стекло — за ним ночной Чикаго
  // (в v20.2–20.3 ныряла в пробку сигареты: кадр на долю секунды целиком в бежевых полосах — разбор Gemini). Четыре белые башни-сигареты среди ночных домов и луна;
  // справа въезжает дом Бёрнетта в разрезе (WoT #076): освещённые этажи с фигурами, в одном — его кабинет (мир 7).
  let KCH = null;
  const TWM = .283, TWW = 120, TWR = [{ x: 240, top: 820 }, { x: 440, top: 640 }, { x: 640, top: 760 }, { x: 840, top: 560 }];   // башни в мире CH
  const CORK = 44 / TWM;   // полоса короны башни — как пробка сигареты
  const BUR = { x0: 1180, x1: 1780, top: 380, cut: [1780, 760, 1300, 1860], slabs: [760, 980, 1200, 1420, 1640, 1860] };   // дом Бёрнетта; разрез — треугольник у правого края
  const ROOM = { x: 1635, y: 1530, w: 270, h: 200, m: 270 / 1500 };   // кабинет Бёрнетта (этаж 1420…1640): мир 7 вложен сюда
  function chInit() {
    const a = TC;
    KCH = [KY(a.rekl + .42, 760, 1004, .63), KY(a.leo + .05, 1000, 1100, .64), KY(a.bern + .02, 1060, 1150, .68), KY(a.end - .3, ROOM.x, ROOM.y, 3.4), KY(a.end, ROOM.x, ROOM.y, 1.96 / ROOM.m)];   // v20.4: из окна — сразу общий план (зум на стыке 0,65), дом въезжает в стоящий кадр (#076), потом нырок на этаж
  }
  function burX(t) { const a = TC; return (1 - eio(at(t, a.leo - .35, a.bern + .05))) * 760 }   // дом въезжает справа в стоящий кадр
  function cutX(y) { const [x0, y0, x1, y1] = BUR.cut; return lp(x0, x1, (y - y0) / (y1 - y0)) }
  function sitter(c, x, y, s, col, o = {}) {   // фигура за столом сбоку (смотрит вправо): стул, тело, рука к машинке / доске
    c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col;
    c.fillRect(-34, -64, 8, 64); c.fillRect(-34, -64, 40, 8);   // стул
    rr(c, -26, -150, 44, 92, 14); c.fill(); circ(c, 0, -172, 20, col); if (o.hat) { c.fillRect(-26, -192, 52, 7); rr(c, -16, -212, 32, 22, 6); c.fill() }
    limb(c, [[6, -132], [40, -104], [70, -110]], [12, 10, 9], col); limb(c, [[-6, -64], [30, -60], [34, 0]], [16, 14, 12], col);
    if (o.desk !== false) { c.fillRect(56, -86, 110, 10); c.fillRect(150, -76, 8, 76); rr(c, 76, -112, 54, 26, 5); c.fill(); c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(88, -134, 30, 24) }   // стол и машинка с листом
    c.restore();
  }
  function burnettB(c, t) {
    const { x0, x1, top, slabs } = BUR, dx = burX(t), [cxa, cya, cxb, cyb] = BUR.cut; c.save(); c.translate(dx, 0);
    c.fillStyle = '#1C2352'; c.fillRect(x0 + 70, top - 130, x1 - x0 - 140, 140); c.fillRect(x0 + 170, top - 230, x1 - x0 - 340, 110); c.fillRect(x0 + 292, top - 420, 16, 200);   // ступени ар-деко и шпиль
    c.fillStyle = '#20285A'; c.fillRect(x0, top, x1 - x0, 3200); c.fillStyle = '#171D47'; c.fillRect(x1 - 90, top, 90, 3200);
    for (let k = 0; k < 24; k++) for (let m = 0; m < 5; m++) { const wx = x0 + 34 + m * 104, wy = top + 50 + k * 110; if (wx + 70 > cutX(wy) && wy > cya - 40 && wy < cyb) continue;
      c.fillStyle = H1(k * 7 + m * 3) > .55 ? 'rgba(253,230,138,.55)' : '#141A3E'; c.fillRect(wx, wy, 70, 56) }
    c.save(); poly(c, [cxa, cya, cxa, cyb, cxb, cyb]); c.clip();   // разрез: этажи изнутри
    for (let f = 0; f < slabs.length - 1; f++) { const fy0 = slabs[f], fy1 = slabs[f + 1]; c.fillStyle = ['#E3BE7E', '#EBCB8C', '#E5C384', '#F0D29A', '#E8C688'][f]; c.fillRect(x0, fy0, x1 - x0, fy1 - fy0);
      c.fillStyle = 'rgba(120,70,30,.18)'; c.fillRect(x0, fy1 - 46, x1 - x0, 28) }   // плинтус
    const ink = '#2A2238';
    sitter(c, 1600, 1420 - 18, .95, ink, { hat: true }); sitter(c, 1380, 1860 - 18, 1, ink); sitter(c, 1580, 1860 - 18, 1, ink, { hat: true });
    c.fillStyle = ink; c.fillRect(1660, 1200 - 18 - 150, 70, 150); c.fillRect(1668, 1200 - 18 - 120, 54, 4); c.fillRect(1668, 1200 - 18 - 70, 54, 4);   // картотека
    c.save(); c.translate(1700, 980 - 18); c.fillRect(-4, -90, 8, 90); poly(c, [-26, -90, 26, -90, 14, -120, -14, -120]); c.fill(); c.restore();   // лампа
    c.save(); poly(c, [cutX(slabs[3]), slabs[3], x1, slabs[3], x1, slabs[4] - 18, cutX(slabs[4] - 18), slabs[4] - 18]); c.clip();   // кабинет Бёрнетта — мир 7
    inNest(c, NC7(), cc => officeW7(cc, t)); c.restore();   // та же вложенность, что у камеры (linkK) — на стыке кадры совпадают
    c.fillStyle = '#3A3050'; slabs.forEach(sy => c.fillRect(x0, sy - 18, x1 - x0, 18));   // перекрытия
    c.restore();
    c.beginPath(); c.moveTo(cxa, cya); c.lineTo(cxb, cyb); lnB(c, 14, '#DCD3BE'); c.strokeStyle = '#2C356E'; c.lineWidth = 4; c.beginPath(); c.moveTo(cxa - 10, cya + 4); c.lineTo(cxb - 10, cyb + 4); c.stroke();   // край разреза: толщина стены
    c.restore();
  }
  function tower(c, i, t) {   // белая башня = сигарета: тело с окнами, полоса короны = пробка (совпадает с ней при стыке), ступени и шпиль ар-деко
    const { x, top } = TWR[i], L = x - TWW / 2, s = 1 / TWM;
    rr(c, L, top, TWW, 3600 - top, 6 * s); fill(c, C3.white);
    c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(x + 4 * s, top, 13 * s, 3600 - top);   // тень — как у сигареты
    c.fillStyle = 'rgba(253,230,138,.9)'; for (let r = 0; r < 60; r++) for (let m = 0; m < 4; m++) if (H1(i * 41 + r * 3 + m) > .42) c.fillRect(L + 12 + m * 26, top + CORK + 36 + r * 52, 16, 26);
    c.fillStyle = C3.cork; c.fillRect(L, top, TWW, CORK); c.fillStyle = 'rgba(120,70,30,.35)'; for (let k = 0; k < 3; k++) c.fillRect(L, top + (8 + k * 12) * s, TWW, 3 * s);
    PL(c, [L + 14, top, L + 30, top - 50, L + TWW - 30, top - 50, L + TWW - 14, top], C3.cork); PL(c, [x - 26, top - 50, x - 16, top - 100, x + 16, top - 100, x + 26, top - 50], '#D9B888');
    PL(c, [x - 7, top - 100, x, top - 210 - i * 16, x + 7, top - 100], C3.cork); c.fillStyle = 'rgba(120,70,30,.3)'; c.fillRect(L + 22, top - 30, TWW - 44, 6);
  }
  function chWorld(c, t, q) {
    c.fillStyle = '#0D1230'; c.fillRect(-3000, -5000, 8000, 9000); c.fillStyle = '#121845'; c.fillRect(-3000, 1300, 8000, 500); c.fillStyle = '#18204F'; c.fillRect(-3000, 1800, 8000, 3000);
    starsS(c, t, .9);
    circ(c, 190, 300, 110, '#F3EBDD'); circ(c, 150, 270, 22, '#DCD3BE'); circ(c, 222, 342, 15, '#DCD3BE'); circ(c, 230, 262, 9, '#DCD3BE');   // луна
    for (let i = 0; i < 34; i++) { const bx = -900 + i * 104, h = 520 + H1(i * 2.7) * 720, by = 2500 - h; c.fillStyle = i % 2 ? '#141A3E' : '#1A2150'; c.fillRect(bx, by, 96, h + 1200);
      c.fillStyle = 'rgba(253,230,138,.45)'; for (let k = 0; k < h / 60; k++) for (let m = 0; m < 3; m++) if (H1(i * 31 + k * 7 + m) > .62) c.fillRect(bx + 12 + m * 28, by + 26 + k * 60, 16, 22) }   // дальние дома
    for (let i = 0; i < TWR.length; i++) tower(c, i, t);
    burnettB(c, t);
    for (let i = 0; i < 22; i++) { const bx = -1000 + i * 160, h = 260 + H1(i * 5.3) * 300; c.fillStyle = '#0A0E26'; c.fillRect(bx, 2560 - h, 150, h + 1400);
      c.fillStyle = 'rgba(253,230,138,.35)'; for (let k = 0; k < h / 70; k++) if (H1(i * 13 + k) > .5) c.fillRect(bx + 30 + (k % 2) * 60, 2600 - h + k * 70, 22, 26) }   // ближние дома закрывают низ башен
  }
  function chShot(c, t) { const q = camObj(camAt(KCH, t)); layer(c, q, 1, cc => chWorld(cc, t, q)) }
  // ================= мир 7 (фраза 7): кабинет Бёрнетта — в координатах мира 1: лист на чертёжной доске = плакат щита (BB). Толстый чёрный карандаш сам рисует ковбоя (#091),
  // набросок заливается цветом, лист становится плакатом — и мир 7 незаметно меняется на щит у трассы (видно только лист), камера отъезжает (#041).
  let T7 = null, K7 = null, RIDS = null, RIDC = null, RIDO = null, PEN7 = null, TB7 = null;
  const NC7 = () => ({ x: ROOM.x + (540 - 360) * ROOM.m, y: ROOM.y + (960 - 765) * ROOM.m, m: ROOM.m });   // в центре этажа — место всадника на листе (360, 765): после нырка в кадре уже набросок   // v20.2: этаж в разрезе дома Бёрнетта (мир CH) показывает кабинет 1500×1050 с центром (540, 765)
  const RB = { x0: 96, x1: 610, y0: 540, y1: 960 };   // рамка всадника на листе (мир 1)
  function w7Init() {
    const s = 's7';
    T7 = { a: SA(s), stav: Ws(s, 'ставит'), rekl: Ws(s, 'рекламу'), kov: Ws(s, 'ковбоя'), slov: Ws(s, 'словам'), sam: Ws(s, 'самый'), am: Ws(s, 'америке'), sim: Ws(s, 'символ'), muzh: Ws(s, 'мужчины'), end: SA('s8') - .02 };
    const a = T7; a.sw = a.sim - .55;   // смена мира: кадр — только лист
    K7 = [KY(a.stav + .1, 360, 770, 1.96), KY(a.kov + .2, 352, 772, 2.0), KY(a.slov + .1, 360, 740, 2.2), KY(a.sw, 380, 640, 3.3)];   // v20.2: на «символ» надпись Marlboro Country — ниже плашки года
    // всадник: цветной и карандашный (маска + обводка) — заранее, в 2× разрешении
    const S = 2, W = (RB.x1 - RB.x0) * S, H = (RB.y1 - RB.y0) * S; RIDC = mk(W, H); const g = RIDC.getContext('2d'); g.scale(S, S); g.translate(-RB.x0, -RB.y0); horseRider(g, BB.x + 290, BB.y + BB.h * .94, 1.5, { t: 0 });
    RIDS = mk(W, H); const h = RIDS.getContext('2d');
    for (const [dx, dy] of [[-3, 0], [3, 0], [0, -3], [0, 3], [-2, -2], [2, 2], [-2, 2], [2, -2]]) h.drawImage(RIDC, dx, dy);
    h.globalCompositeOperation = 'source-in'; h.fillStyle = '#4A4A52'; h.fillRect(0, 0, W, H); h.globalCompositeOperation = 'source-over';
    const m2 = mk(W, H), q2 = m2.getContext('2d'); q2.drawImage(RIDC, 0, 0); q2.globalCompositeOperation = 'source-in'; q2.fillStyle = '#E4DCC8'; q2.fillRect(0, 0, W, H); h.drawImage(m2, 0, 0);
    h.strokeStyle = 'rgba(74,74,82,.35)'; h.lineWidth = 2; h.globalCompositeOperation = 'source-atop'; for (let k = -H; k < W; k += 14) { h.beginPath(); h.moveTo(k, H); h.lineTo(k + H * .7, 0); h.stroke() }   // штриховка
    RIDO = mk(W, H); const o2 = RIDO.getContext('2d');   // v20.2: только контур — первый проход карандаша
    for (const [dx, dy] of [[-3, 0], [3, 0], [0, -3], [0, 3], [-2, -2], [2, 2], [-2, 2], [2, -2]]) o2.drawImage(RIDC, dx, dy);
    o2.globalCompositeOperation = 'source-in'; o2.fillStyle = '#4A4A52'; o2.fillRect(0, 0, W, H); o2.globalCompositeOperation = 'destination-out'; o2.drawImage(RIDC, 0, 0); o2.globalCompositeOperation = 'source-over';
    // путь карандаша: три прохода рядами (верх, середина, низ силуэта) — как штрихуют набросок; карандаш едет не быстрее ~1000 px/с
    const d = g.getImageData(0, 0, W, H).data, top = [], bot = []; TB7 = { top, bot };
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
  // лист на доске: бумага, набросок карандашом, цвет, потом весь плакат. v20.2: карандаш идёт двумя проходами — контур слева направо, штриховка обратно
  // (проявляется полосой с неровным краем, без «дырок» кругами); начинается ещё во время нырка в окно — после нырка лист не пустой
  const edgeY = (arr, x) => { const P = arr; if (!P.length) return RB.y0; if (x <= P[0][0]) return P[0][1]; for (let i = 1; i < P.length; i++) if (x <= P[i][0]) return lp(P[i - 1][1], P[i][1], (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return P[P.length - 1][1] };
  function sweepClip(c, xa, xb, seed) { const { y0, y1 } = RB; c.beginPath(); c.moveTo(xa, y0 - 20); for (let i = 0; i <= 14; i++) c.lineTo(xb + Math.sin(i * 2.3 + seed) * 9, lp(y0 - 20, y1 + 20, i / 14)); c.lineTo(xa, y1 + 20); c.closePath(); c.clip() }
  function penSk(t) { const a = T7, ko = at(t, a.a - .62, a.stav + .28), kh = at(t, a.stav + .28, a.slov - .05); return { ko, kh } }
  function sheet7(c, t) {
    const a = T7, { x, y, w, h } = BB, T = C3;
    const { ko, kh } = penSk(t), kco = eio(at(t, a.slov - .1, a.slov + .45)), kbg = eio(at(t, a.slov + .25, a.sam + .45)), ktx = at(t, a.sam + .1, a.am + .1), kpk = spr(at(t, a.sam + .2, a.am + .6));
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    c.fillStyle = T.paper; c.fillRect(x, y, w, h);
    if (kbg > 0) { c.save(); c.beginPath(); c.rect(x, y + h * (1 - kbg), w, h * kbg + 1); c.clip(); c.fillStyle = T.dune; c.fillRect(x, y + h * .58, w, h * .42);
      PL(c, [x, y + h * .58, x, y + h * .42, x + 120, y + h * .42, x + 150, y + h * .5, x + 330, y + h * .5, x + 370, y + h * .58], T.rock);
      PL(c, [x + 500, y + h * .58, x + 540, y + h * .47, x + 620, y + h * .47, x + 648, y + h * .4, x + 760, y + h * .4, x + 820, y + h * .58], T.rock); c.fillStyle = T.dune2; c.fillRect(x, y + h * .8, w, h * .2); c.restore() }
    if (ktx > 0) { c.save(); c.beginPath(); c.rect(x, y, 40 + 600 * eo(ktx), 160); c.clip(); tx(c, 'Marlboro Country', x + 40, y + 84, { f: 'P', w: 700, st: 'italic', s: 66, c: T.inkB, al: 'left' }); c.restore() }
    if (kco >= 1) horseRider(c, x + 290, y + h * .94, 1.5, { t });
    else {
      const bw = RB.x1 - RB.x0, bh = RB.y1 - RB.y0;
      if (ko > 0) { c.save(); sweepClip(c, RB.x0 - 30, lp(RB.x0 - 20, RB.x1 + 20, ko), 1); c.drawImage(RIDO, RB.x0, RB.y0, bw, bh); c.restore() }
      if (kh > 0) { c.save(); sweepClip(c, RB.x1 + 30, lp(RB.x1 + 20, RB.x0 - 20, kh), 4); c.drawImage(RIDS, RB.x0, RB.y0, bw, bh); c.restore() }
      if (kco > 0) { c.save(); c.beginPath(); c.rect(RB.x0, RB.y0, (RB.x1 - RB.x0) * kco, RB.y1 - RB.y0); c.clip(); horseRider(c, x + 290, y + h * .94, 1.5, { t }); c.restore() }
    }
    if (kpk > 0) { c.save(); c.translate(x + 771, y + 458); c.scale(kpk, kpk); c.translate(-(x + 771), -(y + 458)); mPack(c, x + 676, y + 176, 190, 282, 34, {}); c.restore() }
    c.restore();
    if (kco < .2) {   // карандаш: подлетает, ведёт контур по верху силуэта, потом штрихует обратно (вверх-вниз)
      const { top, bot } = TB7, X0 = RB.x0 - 20, X1 = RB.x1 + 20;
      if (ko <= 0) { const k = eo(at(t, a.a - 1.1, a.a - .62)), px = X0, py = edgeY(top, RB.x0); pencil(c, lp(px + 300, px, k), lp(py + 260, py, k), .7, -2.3) }
      else if (kh <= 0) { const ex = lp(X0, X1, ko); pencil(c, ex, edgeY(top, ex) + Math.sin(t * 23) * 3, .7, -2.3) }
      else if (kh < 1) { const ex = lp(X1, X0, kh), z = .5 + .5 * Math.sin(t * 34); pencil(c, ex, lp(edgeY(top, ex) + 6, edgeY(bot, ex) - 6, z), .7, -2.3) }
      else { const k = eio(at(t, a.slov - .1, a.slov + .5)); pencil(c, lp(RB.x0, 760, k), lp(RB.y0 + 300, 1260, k), .7, -2.3) }
    } else { const k = eio(at(t, a.slov - .1, a.slov + .5)); pencil(c, lp(RB.x0, 760, k), lp(RB.y0 + 300, 1260, k), .7, -2.3) }
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
  const GLOBE = { x: 540, y: 960, R: 360 }, SPACE = '#0B0F2A', GLOBEC = '#1C2B6B', LANDC = '#26244A', BEAMW = 40;
  function w8Init() {
    const s = 's8', a7 = T7;
    T8 = { sim: a7.sim, muzh: Ws('s7', 'мужчины'), a: SA(s), cherez: Ws(s, 'через'), god: Ws(s, 'год'), byv: Ws(s, 'бывшая'), mar: Ws(s, 'марка'), chet: Ws(s, 'четвёртая'), str: Ws(s, 'стране'),
      sem: Ws(s, 'семьдесят'), vt: Ws(s, 'втором'), perv: Ws(s, 'первая'), mir: Ws(s, 'мире'), end: SA('s9') - .02 };
    const a = T8; a.sw = a.perv - .12;   // смена мира: в кадре — только ночное небо, звёзды и красный столбик
    a.sweep0 = a.perv + .2; a.sweep1 = a.end - .2;   // v20.2: круг радара — 0,8 с
    K8 = [KY(a.sim + .2, 470, 850, 1.7), KY(a.muzh + .42, 540, 955, 1.01), KY(a.cherez + .25, 900, 950, .98), KY(a.byv + .18, 3000, 930, .9), KY(a.mar + .08, 6000, 820, .62),
      KY(a.chet + .25, 8700, -300, .135), KY(a.str + .15, 8760, -420, .13), KY(a.sem + .28, OURX, -3200, .16), KY(a.vt + .4, OURX, -12000, .19), KY(a.sw, OURX, -15500, .2)];
    // W8 вложен в Землю: основание нашего столбика (OURX, 1378) — верх шара, ширина щита — ширина луча
    const m = BEAMW / BB.w; NE8 = { x: GLOBE.x - (OURX - 540) * m, y: GLOBE.y - GLOBE.R - (1378 - 960) * m, m };
    KE = [KY(a.mir + .1, 540, 900, .9), KY(a.sweep1 - .3, 540, 910, .92)];
  }
  function nightK(t) { const a = T8; return eio(at(t, a.byv - .2, a.sem + .6)) }
  function ourH(t) { const a = T8; return lp(600, 2400, eio(at(t, a.chet - .45, a.chet + .45))) + 90000 * Math.pow(at(t, a.sem - .1, a.sw + .3), 2.2) }
  // v20.2: на чужих щитах — обычная реклама 1950-х без марок (газировка, машина, кофе, бензин, шины, шляпы); ночью темнеет, как наш плакат
  function adPoster(c, x, y, i, nk) {
    const W = BB.w, H = BB.h, v = i % 6, BG = ['#2E7F86', '#E6D3A8', '#7A4A2A', '#E3B23C', '#2F4F8F', '#C96A5A'][v], INK = ['#F4F1EA', '#8E1B24', '#F4E3C8', '#3A2416', '#F4F1EA', '#F8EEE4'][v];
    c.save(); c.beginPath(); c.rect(x, y, W, H); c.clip(); c.fillStyle = BG; c.fillRect(x, y, W, H); c.fillStyle = shd(BG, .14); c.fillRect(x, y + H * .78, W, H * .22);
    c.fillStyle = INK; c.fillRect(x + 60, y + 70, 420, 64); c.fillRect(x + 60, y + 160, 280, 34); c.fillRect(x + 60, y + 214, 330, 34);   // заголовок и строки — плашками, без слов
    if (v === 0) { rr(c, x + 680, y + 150, 120, 380, 46); fill(c, '#F4F1EA'); rr(c, x + 712, y + 90, 56, 90, 14); fill(c, '#F4F1EA'); c.fillStyle = '#C8102E'; c.fillRect(x + 680, y + 300, 120, 70); circ(c, x + 560, y + 420, 70, '#C8102E') }   // бутылка газировки
    else if (v === 1) { rr(c, x + 470, y + 360, 420, 110, 46); fill(c, '#C8102E'); rr(c, x + 560, y + 290, 230, 100, 40); fill(c, '#C8102E'); c.fillStyle = '#BFE3EE'; c.fillRect(x + 590, y + 310, 80, 60); c.fillRect(x + 690, y + 310, 80, 60);
      circ(c, x + 560, y + 480, 46, '#2A1A14'); circ(c, x + 800, y + 480, 46, '#2A1A14'); circ(c, x + 560, y + 480, 18, '#D8D2C8'); circ(c, x + 800, y + 480, 18, '#D8D2C8') }   // машина
    else if (v === 2) { rr(c, x + 600, y + 300, 230, 200, 30); fill(c, '#F4F1EA'); c.beginPath(); c.arc(x + 840, y + 390, 50, -1.2, 1.2); c.strokeStyle = '#F4F1EA'; c.lineWidth = 22; c.stroke();
      for (let k = 0; k < 3; k++) smokeLine(c, [x + 650 + k * 60, y + 280, x + 670 + k * 60, y + 220, x + 650 + k * 60, y + 160, x + 670 + k * 60, y + 100], 8, '#F4E3C8', .9) }   // чашка кофе
    else if (v === 3) { rr(c, x + 640, y + 170, 170, 360, 18); fill(c, '#C8102E'); rr(c, x + 668, y + 210, 114, 90, 10); fill(c, '#F4F1EA'); c.beginPath(); c.moveTo(x + 810, y + 260); c.quadraticCurveTo(x + 900, y + 270, x + 880, y + 420); c.strokeStyle = '#2A1A14'; c.lineWidth = 16; c.stroke() }   // бензоколонка
    else if (v === 4) { ring(c, x + 700, y + 360, 150, '#F4F1EA', 60); for (let k = 0; k < 12; k++) { const an = k * TAU / 12; c.fillStyle = '#2F4F8F'; c.save(); c.translate(x + 700 + Math.cos(an) * 150, y + 360 + Math.sin(an) * 150); c.rotate(an); c.fillRect(-6, -30, 12, 60); c.restore() } }   // шина
    else { fig(c, x + 720, y + 560, 2.1, { col: '#F8EEE4', hc: '#3A1830' }); fig(c, x + 880, y + 560, 1.8, { m: true, hat: true, col: '#F8EEE4' }) }   // шляпы и пальто
    if (nk) { c.fillStyle = `rgba(14,18,46,${.55 * nk})`; c.fillRect(x, y, W, H) }
    c.restore();
  }
  function rowBoard(c, t, i, nk) {   // щит в ряду: рама, плакат (наш — Marlboro, другие — обычная реклама), под щитом столбик своего цвета
    const x = ROW.x0 + i * ROW.dx, ours = i === ROW.ours, kb = at(t, T8.chet - .5, T8.chet + .1), hb = ours ? ourH(t) : lp(1200, BARH[i], eio(kb)), y = 1378 - hb - BB.h;
    const col = ours ? C3.red : GRAYS[i % 4], cb = mixc(C3.steel, col, eio(kb));
    c.fillStyle = cb; c.fillRect(x + (BB.w - lp(60, BB.w, eio(kb))) / 2, y + BB.h, lp(60, BB.w, eio(kb)), hb);
    c.fillStyle = C3.steel; c.fillRect(x - 12, y - 12, BB.w + 24, BB.h + 24);
    if (ours) { c.save(); c.translate(x - BB.x, y - BB.y); poster(c, t, { peelPx: 0, night: nk * .6 }); c.restore() }
    else adPoster(c, x, y, i + 1, nk * .6);
  }
  function w8World(c, t, q) {
    const a = T8, nk = nightK(t);
    layer(c, q, .3, cc => { P0(cc, .3); desertFar(cc, nk) });
    if (nk > .05) starsS(c, t, ss(.3, .9, nk) * at(viewRect(q).y1, 2500, -800));
    layer(c, q, 1, cc => {
      desertGround(cc, t, nk, q); billboardFrame(cc, { lamp: nk }); poster(cc, t, { peelPx: 0, night: nk * .6 });
      for (let i = 0; i < ROW.n; i++) rowBoard(cc, t, i, nk);
      [1700, 2900].forEach((bx, j) => { cc.save(); cc.translate(bx - BB.x, 0); cc.fillStyle = C3.steel; cc.fillRect(BB.x + 230, BB.y + BB.h, 24, 1378 - BB.y - BB.h); cc.fillRect(BB.x + 714, BB.y + BB.h, 24, 1378 - BB.y - BB.h);
        cc.fillRect(BB.x - 12, BB.y - 12, BB.w + 24, BB.h + 24); cc.restore(); adPoster(cc, bx, BB.y, j ? 4 : 2, nk * .6) });
      const k4 = at(t, a.chet + .05, a.chet + .45) * (1 - at(t, a.sem - .2, a.sem + .2));
      if (k4 > 0) { const x = OURX, y = 1378 - ourH(t) - BB.h - 900; tx(cc, '№ 4 В США', x, y, { f: 'M', w: 800, s: 640 * bo(k4), c: '#F4F1EA', a: Math.min(1, k4 * 2) }) }
    });
    layer(c, q, 1.35, cc => { if (q.z < .5) return; P0(cc, 1.35); const u = (t * .045 + .62) % 1, x = lp(-300, 1500, u); tumbleweed(cc, x, 1530 - Math.abs(Math.sin(t * 2.4)) * 26, 44, t * 2.2) });
  }
  // ---------- Земля (v20.2, Боб #039): глобус в концентрических кольцах; наш красный столбик втягивается в стрелку радара, она идёт по кругу
  // градиентным сектором и по очереди зажигает кружки с пачками на кольцах вокруг Земли; «№ 1 В МИРЕ» крупно ----------
  const CONT = [[[-.62, -.15], [-.3, -.42], [-.05, -.3], [-.12, .05], [-.38, .12], [-.55, .02]], [[-.28, .15], [-.08, .2], [-.12, .6], [-.25, .7], [-.3, .35]],
    [[.05, -.35], [.32, -.45], [.5, -.25], [.38, -.05], [.12, -.1]], [[.1, 0], [.3, .02], [.32, .4], [.18, .55], [.06, .3]], [[.45, .3], [.62, .32], [.6, .45], [.44, .44]]];
  const RING = [1.24, 1.46], ICONS = [[0, -.95], [1, -.35], [0, .45], [1, 1.1], [0, 1.75], [1, 2.4], [0, 3.05], [1, 3.75], [0, 4.45], [1, 5.15]];   // кольцо, угол от верха по часовой
  const PACKS_E = ICONS, AN = an => ((an % TAU) + TAU) % TAU;   // для звуков: кружок загорается, когда стрелка проходит его угол
  function blob(c, pts) { const n = pts.length; c.beginPath(); const m = i => [(pts[i % n][0] + pts[(i + 1) % n][0]) / 2, (pts[i % n][1] + pts[(i + 1) % n][1]) / 2]; let p = m(n - 1); c.moveTo(p[0], p[1]);
    for (let i = 0; i < n; i++) { const q2 = m(i); c.quadraticCurveTo(pts[i][0], pts[i][1], q2[0], q2[1]) } c.closePath() }
  function radarT(t) { const a = T8; return { ret: eio(at(t, a.sw + .04, a.sweep0)), sw: eio(at(t, a.sweep0, a.sweep1)), back: eio(at(t, a.sweep1 - .04, a.sweep1 + .14)) } }
  function earthWorld(c, t, q) {
    const a = T8, G = GLOBE, R = G.R, { ret, sw, back } = radarT(t), ang = -Math.PI / 2 + TAU * sw;
    c.fillStyle = SPACE; c.fillRect(-60000, -60000, 120000, 120000);
    starsS(c, t, 1);
    RING.forEach(rk => ring(c, G.x, G.y, R * rk, 'rgba(200,210,255,.22)', 3)); ring(c, G.x, G.y, R * 1.7, 'rgba(200,210,255,.1)', 2);
    if (sw > 0 && sw < 1) { const g = c.createConicGradient(ang - 1.25, G.x, G.y); g.addColorStop(0, 'rgba(200,16,46,0)'); g.addColorStop(1.25 / TAU, 'rgba(232,40,70,.42)'); g.addColorStop(1.25 / TAU + .001, 'rgba(200,16,46,0)'); g.addColorStop(1, 'rgba(200,16,46,0)');
      c.beginPath(); c.arc(G.x, G.y, R * 1.7, 0, TAU); c.fillStyle = g; c.fill() }   // след радара — градиентный сектор
    circ(c, G.x, G.y, R, GLOBEC);   // океан = земля ночной сцены (на нырке к горизонту — тот же цвет)
    c.save(); c.beginPath(); c.arc(G.x, G.y, R, 0, TAU); c.clip();
    CONT.forEach(P => { blob(c, P.map(p => [G.x + p[0] * R * 1.15, G.y + p[1] * R * 1.15])); fill(c, '#2E4290') });
    if (q.z < 3) { c.strokeStyle = 'rgba(150,180,255,.16)'; c.lineWidth = 2; [-.45, 0, .45].forEach(la => { c.beginPath(); c.ellipse(G.x, G.y + la * R, R * Math.sqrt(1 - la * la), R * .13, 0, 0, TAU); c.stroke() });
    [.36, .72].forEach(lo => { c.beginPath(); c.ellipse(G.x, G.y, R * lo, R, 0, 0, TAU); c.stroke() }) }   // параллели и меридианы — объём (вблизи не рисуем: сходятся в точке нырка)
    for (let i = 0; i < 40; i++) { const u = H1(i * 2.3), v = H1(i * 5.1); circ(c, G.x + (u - .5) * R * 1.3, G.y + (v - .45) * R * 1.2, 2.2, rgba('#FDE68A', .45)) }
    c.beginPath(); c.arc(G.x + R * .6, G.y - R * .08, R * 1.08, 0, TAU); fill(c, 'rgba(6,8,30,.42)'); c.restore();   // терминатор — ночная сторона справа
    c.beginPath(); c.arc(G.x, G.y, R - 6, Math.PI * 1.02, Math.PI * 1.36); c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = 9; c.stroke();   // блик — слева, не на верху шара (туда ныряем)
    ICONS.forEach(([ri, an], i) => { const r = R * RING[ri], th = -Math.PI / 2 + an, px = G.x + Math.cos(th) * r, py = G.y + Math.sin(th) * r, lit = spr(at(sw * TAU, AN(an) + .05, AN(an) + .65));
      circ(c, px, py, 44, mixc('#1B2552', '#C8102E', Math.min(1, lit))); ring(c, px, py, 44, lit > .02 ? '#F4F1EA' : 'rgba(200,210,255,.35)', 3);
      if (lit > 0) { c.save(); c.translate(px, py + 2); c.scale(.17 * lit, .17 * lit); mPack(c, -95, -141, 190, 282, 34, { shadow: false }); c.restore(); ring(c, px, py, 44 + 40 * at(lit, 0, 1), rgba('#F4F1EA', .5 * (1 - Math.min(1, lit))), 3) } });
    { const rin = lp(R, 0, ret), rout = Math.max(rin, (R * 1.7 + 60000 * Math.pow(1 - ret, 4)) * (1 - back)), bw = lp(BEAMW, 14, ret);   // наш столбик → стрелка радара; после круга уходит в Землю
      if (rout > rin + 1) { c.save(); c.translate(G.x, G.y); c.rotate(ang + Math.PI / 2); c.fillStyle = C3.red; c.fillRect(-bw / 2, -rout, bw, rout - rin); c.fillStyle = `rgba(255,240,240,${.8 * ret})`; c.fillRect(-1.5, -rout, 3, rout - rin); c.restore() } }
    const k1 = at(t, a.perv + .25, a.perv + .6) * (1 - at(t, a.sweep1 + .15, a.sweep1 + .4)); if (k1 > 0) plate(c, '№ 1 В МИРЕ', G.x, G.y - R * 1.7 - 90, bo(k1), { s: 84, bg: '#F4F1EA', c: '#141010', ls: 3 });
    if (typeof nightInEarth === 'function') nightInEarth(c, t, q);
  }
  function w8Shot(c, t) {
    if (t < T8.sw) { const q = camObj(camAt(K8, t)); w8World(c, t, q) }
    else { const q = camObj(camAt(KE, t)); layer(c, q, 1, cc => earthWorld(cc, t, q)) }
  }
  // ================= мир 9 (фразы 9–11): ночной щит у пустой дороги (координаты мира 1). Камера спускается с ночной стороны Земли (мир 9 вложен в верх шара),
  // нарисованный огонёк становится живым (#092), дым тает в небе (#141); Макларен: календарь и пачки, рентген (#037), планки щита поворачиваются (#105), щит → столб-памятник, ещё три столба.
  let T9 = null, K9 = null, NE9 = null;
  const M9 = .0012, POSTS = [540, 980, 1420, 1860], HORZ = 1350, PTOP = 980;   // v20.2: столбы забора ближе и ниже — шляпы крупнее
  function w9Init() {
    const w = (s, q, n) => Ws(s, q, n);
    T9 = { a: SA('s9'), vot: w('s9', 'вот'), kov: w('s9', 'ковбои'), rekl0: w('s9', 'рекламы'), kur: w('s9', 'курили'), nast: w('s9', 'по-настоящему'),
      uein: w('s10', 'уэйн'), mak: w('s10', 'макларен'), vyk: w('s10', 'выкуривал'), polt: w('s10', 'полторы'), den: w('s10', 'день'), dev: w('s10', 'девяностом'), rak: w('s10', 'рак'), leg: w('s10', 'лёгких'),
      posl: w('s10', 'последний'), snim: w('s10', 'снимался'), rekl: w('s10', 'рекламе'), prot: w('s10', 'против'), umer: w('s10', 'умер'), pyat: w('s10', 'пятьдесят'), odin: w('s10', 'один'),
      vsego: w('s11', 'всего'), umerli: w('s11', 'умерли'), chet: w('s11', 'четверо'), kovb: w('s11', 'ковбоев'), marl: w('s11', 'мальборо'), end: (SA('s12') ?? SA('s13')) - .02 };
    const a = T9; a.sw = a.vot + .28;   // смена мира: шар Земли во весь кадр, горизонт — прямая
    NE9 = { x: GLOBE.x, y: GLOBE.y - GLOBE.R - (HORZ - 960) * M9, m: M9 };
    { const ty = NE9.y + (1000 - 960) * M9, d = a.sw - T8.sweep1 - .06;   // v20.2: нырок к горизонту быстрее — щит сразу крупный; щит всё время у центра кадра (сдвиг цели на экране тает: y = цель + D / z)
      KE.push(KY(T8.sweep1 + .06, 540, 700, 1.7), KY(T8.sweep1 + .06 + d * .32, 540, ty + 120 / 8, 8), KY(T8.sweep1 + .06 + d * .66, 540, ty + 60 / 50, 50), KY(a.sw, 540, ty, .6 / M9)) }   // v20.5: на стыке щит крупнее (было .45 — «мелковат над пустыней»)
    K9 = [KY(a.kov + .05, 520, 860, .85), KY(a.rekl0 + .1, 430, 700, 1.6), KY(a.kur + .08, 405, 640, 3.4), KY(a.nast + .45, 420, 520, 2.4), KY(a.uein + .2, 470, 600, 1.75),
      KY(a.polt + .1, 560, 600, 1.45), KY(a.den + .3, 600, 640, 1.4), KY(a.dev + .2, 390, 660, 3.0), KY(a.leg + .25, 385, 668, 3.3), KY(a.posl + .2, 470, 690, 1.6),
      KY(a.rekl + .15, 540, 700, 1.15), KY(a.umer, 540, 800, 1.0), KY(a.odin + .2, 560, 900, .9), KY(a.umerli, 1000, 1010, .66), KY(a.chet + .5, 1170, 980, .58), KY(a.end, T9END[0], T9END[1], T9END[2])];
  }
  const KEf = () => KE;
  const T9END = [1200, 960, .56];   // последний кадр ночной сцены = фото карточки 1924 на доске (мир 12)
  // ночное небо и горизонт (для мира 9 целиком; noFill — внутри Земли: небо и землю там даёт сам шар)
  function nightLocal(c, t, q, noFill) {
    const a = T9;
    if (!noFill) { c.fillStyle = SPACE; c.fillRect(-60000, -60000, 120000, 60000 + HORZ) }
    if (!noFill) { c.save(); c.beginPath(); c.rect(-60000, -60000, 120000, 60000 + HORZ); c.clip(); starsS(c, t, 1); c.restore() }
    c.fillStyle = '#121640'; c.fillRect(-60000, 950, 120000, HORZ - 950); c.fillStyle = '#24183A'; c.fillRect(-60000, 1180, 120000, HORZ - 1180); c.fillStyle = '#3E1C30'; c.fillRect(-60000, 1300, 120000, HORZ - 1300);
    const mx = 900, my = 118; circ(c, mx, my, 84, '#F3EBDD'); circ(c, mx - 30, my - 20, 18, '#DCD3BE'); circ(c, mx + 26, my + 30, 12, '#DCD3BE'); circ(c, mx + 30, my - 34, 9, '#DCD3BE');   // v20.2: луна выше ламп щита
    PL(c, [-1500, HORZ, -1500, 1220, -900, 1220, -860, 1260, -500, 1260, -470, 1196, 110, 1196, 150, 1240, 250, 1240, 296, HORZ], NIGHT.mesa);
    PL(c, [800, HORZ, 836, 1262, 880, 1262, 904, 1222, 1500, 1222, 1540, 1180, 2100, 1180, 2600, HORZ], NIGHT.mesa); PL(c, [2600, HORZ, 2700, 1250, 3300, 1250, 3420, 1200, 4200, 1200, 4400, HORZ], NIGHT.mesa);
    if (!noFill) { c.fillStyle = GLOBEC; c.fillRect(-60000, HORZ, 120000, 60000) }
    c.fillStyle = '#0E0B1C'; c.fillRect(-60000, 1376, 120000, 64); c.fillStyle = '#2A2440'; c.fillRect(-60000, 1376, 120000, 4); c.fillRect(-60000, 1436, 120000, 4);
    c.fillStyle = '#5A4E44'; for (let dx = -2960; dx < 6000; dx += 120) c.fillRect(dx, 1406, 64, 5);
    c.fillStyle = '#0E0B1C'; for (let fx = -594; fx < 260; fx += 50) c.fillRect(fx, 1300, 11, 80); c.fillRect(-600, 1316, 866, 5); c.fillRect(-600, 1344, 866, 5);
    nightBoard(c, t, q);
    ground9(c, t, q, noFill); car9(c, t);
  }
  // v20.4 (разбор Gemini: «пол-экрана снизу — пустое синее поле»): ночная земля перед дорогой — ряды кустов, камни, кактусы; чем ниже ряд, тем он ближе к зрителю
  // и крупнее. Ряды уходят далеко вниз — их видно и на нырке с Земли (там — внутри шара); по дороге проезжает машина с фарами
  const ell = (c, x, y, rx, ry, r = 0) => { c.moveTo(x + rx * Math.cos(r), y + rx * Math.sin(r)); c.ellipse(x, y, rx, ry, r, 0, TAU) };
  function bush9(c, x, y, s) { c.beginPath(); ell(c, x, y - s * .42, s, s * .6); ell(c, x - s * .62, y - s * .28, s * .6, s * .42); ell(c, x + s * .66, y - s * .3, s * .58, s * .4); fill(c, '#121B4A');
    c.beginPath(); ell(c, x - s * .28, y - s * .86, s * .42, s * .13, -.1); fill(c, 'rgba(60,82,160,.45)') }
  function rock9(c, x, y, s) { c.beginPath(); ell(c, x, y - s * .2, s * .8, s * .3); fill(c, '#18225C'); c.beginPath(); ell(c, x - s * .2, y - s * .38, s * .4, s * .08); fill(c, 'rgba(70,92,170,.4)') }
  function cactus9(c, x, y, s) { c.fillStyle = '#101848'; rr(c, x - s * .18, y - s * 2.2, s * .36, s * 2.2, s * .18); c.fill(); rr(c, x - s * .7, y - s * 1.62, s * .26, s * .78, s * .13); c.fill(); rr(c, x - s * .7, y - s * 1.06, s * .62, s * .24, s * .12); c.fill();
    rr(c, x + s * .44, y - s * 1.9, s * .26, s * .7, s * .13); c.fill(); rr(c, x + s * .08, y - s * 1.42, s * .62, s * .24, s * .12); c.fill() }
  function ground9(c, t, q, noFill) {
    const T = c.getTransform(), I = T.inverse(), P = [[0, 0], [WW, 0], [0, HH], [WW, HH]].map(([X, Y]) => [I.a * X + I.c * Y + I.e, I.b * X + I.d * Y + I.f]);   // что видно — из текущего преобразования холста:
    const v = { x0: Math.min(...P.map(p => p[0])), x1: Math.max(...P.map(p => p[0])), y0: Math.min(...P.map(p => p[1])), y1: Math.max(...P.map(p => p[1])) }, z = Math.sqrt(Math.abs(T.a * T.d - T.b * T.c)), al = noFill ? at(q.z, 12, 22) : 1;   // мир 9, он же внутри Земли и в фото карточки 1924
    if (al <= 0 || v.y1 < 1440) return;
    const base = c.globalAlpha, G = 1.32; c.save();
    if (noFill) { c.beginPath(); c.arc(540 + (GLOBE.x - NE9.x) / M9, 960 + (GLOBE.y - NE9.y) / M9, GLOBE.R / M9, 0, TAU); c.clip() }   // по кривизне шара
    for (let j = 0; j < 20; j++) {
      const yj = 1452 + 46 * (Math.pow(G, j) - 1) / (G - 1), sj = 16 * Math.pow(G, j), aj = 1 - at(yj, 9000, 15000);
      if (aj <= 0 || sj * z < 1.2 || yj - sj * 2.4 > v.y1 || yj + sj * .2 < v.y0) continue;
      const dx = 6.5 * sj, k0 = Math.floor((v.x0 - sj * 2) / dx), k1 = Math.ceil((v.x1 + sj * 2) / dx); if (k1 - k0 > 90) continue;
      c.globalAlpha = base * al * aj;
      for (let k = k0; k <= k1; k++) { const hh = H1(j * 31.7 + k * 7.31), x = (k + H1(j * 13.1 + k * 3.7) * .7) * dx, s2 = sj * (.7 + hh * .6);
        if (hh < .1 && j < 7) cactus9(c, x, yj, s2); else if (hh < .32) rock9(c, x, yj, s2); else bush9(c, x, yj, s2) }
    }
    c.restore();
  }
  function car9(c, t) {   // машина 1950-х с фарами: на «Вот только ковбои» едет вправо, на «Всего от болезней» — влево
    const a = T9;
    for (const [t0, t1, x0, x1] of [[a.vot + .1, a.rekl0 + .3, -700, 1700], [a.umerli - .2, a.marl + .3, 2600, -300]]) {   // проезжает, пока камера широко
      const u = at(t, t0, t1); if (u <= 0 || u >= 1) continue; const x = lp(x0, x1, u), d = Math.sign(x1 - x0), by = 1428;
      const g = c.createLinearGradient(x + d * 120, 0, x + d * 760, 0); g.addColorStop(0, 'rgba(255,236,170,.26)'); g.addColorStop(1, 'rgba(255,236,170,0)');
      c.fillStyle = g; poly(c, [x + d * 118, by - 30, x + d * 760, by - 64, x + d * 760, by + 14, x + d * 118, by - 20]); c.fill();   // свет фар
      rr(c, x - 130, by - 36, 260, 30, 10); fill(c, '#262040'); rr(c, x - 70 - d * 6, by - 62, 140, 30, 13); fill(c, '#262040');   // кузов и крыша
      c.fillStyle = 'rgba(120,130,190,.5)'; c.fillRect(x - 56 - d * 6, by - 56, 50, 18); c.fillRect(x + 6 - d * 6, by - 56, 50, 18);   // окна
      for (const wx of [-78, 78]) { circ(c, x + wx, by - 4, 18, '#0A0814'); circ(c, x + wx, by - 4, 7, '#3A3456') }   // колёса
      circ(c, x + d * 124, by - 24, 7, '#FFF3C4'); glow(c, x + d * 124, by - 24, 34, '#FFF3C4', .6); circ(c, x - d * 128, by - 26, 5, '#E23A4E') }   // фара и стоп-сигнал
  }
  function nightInEarth(c, t, q) { if (q.z < 12) return; inNest(c, NE9, cc => nightLocal(cc, t, q, true)) }
  // ---------- щит ночью: лампы, огонёк, дым, календарь, рентген, планки, столб ----------
  function boardMorph(t) { const a = T9; return eio(at(t, a.umer - .15, a.pyat + .2)) }
  function nightBoard(c, t, q) {
    const a = T9, km = boardMorph(t), { x, y, w, h } = BB;
    if (km < 1) {
      c.save();
      if (km > 0) { const gx0 = x - 12, gx1 = x + w + 12, gy0 = y - 92, gy1 = 1378, gcx = (gx0 + gx1) / 2, gcy = (gy0 + gy1) / 2;
        c.translate(lp(gcx, POSTS[0], km), lp(gcy, (PTOP + 1378) / 2, km)); c.scale(lp(1, 44 / (gx1 - gx0), km), lp(1, (1378 - PTOP) / (gy1 - gy0), km)); c.translate(-gcx, -gcy) }
      billboardFrame(c, { lamp: 1 });
      const em = eo(at(t, a.kur - .15, a.kur + .25)) * (1 - .3 * at(t, a.nast + .6, a.uein + .3));
      poster(c, t, { peelPx: 0, night: .62, ember: em, chest: cc => xray(cc, t), cal: cc => calendar(cc, t), over: cc => slats(cc, t) });
      [x + 180, x + 480, x + 780].forEach(lx => poly(c, [lx + 40, y - 62, lx + 72, y - 56, lx + 330, y + h * .9, lx - 220, y + h * .9]) || fill(c, 'rgba(255,233,176,.09)'));
      if (km > 0) { c.fillStyle = rgba('#4A3326', ss(.3, .92, km)); c.fillRect(x - 14, y - 94, w + 28, 1378 - y + 94) }   // щит становится деревом
      c.restore();
    }
    if (km >= 1) post(c, POSTS[0], t, 0);
    for (let i = 1; i < 4; i++) post(c, POSTS[i], t, i);
    wire(c, t);
    smoke9(c, t);
    const k1 = at(t, a.polt + .1, a.polt + .45) * (1 - at(t, a.dev - .3, a.dev)); if (k1 > 0) plate(c, '1,5 ПАЧКИ В ДЕНЬ', 560, 300, bo(k1), { s: 40, bg: C3.red, c: '#fff', ls: 2 });
    const k5 = at(t, a.odin - .05, a.odin + .3) * (1 - at(t, a.vsego - .3, a.vsego + .1)); if (k5 > 0) tx(c, '51', 760, 760, { f: 'M', w: 800, s: 200 * bo(k5), c: '#F4F1EA', a: Math.min(1, k5 * 2) });
    const k4 = at(t, a.chet + .9, a.chet + 1.25); if (k4 > 0) tx(c, 'КАК МИНИМУМ 4', 1200, 640, { f: 'M', w: 800, s: 112 * bo(k4), c: '#F4F1EA', a: Math.min(1, k4 * 2) });
  }
  function smoke9(c, t) {   // дым выходит из плаката и тает в ночном небе
    const a = T9, k = at(t, a.kur + .1, a.uein + .6); if (k <= 0) return; const x0 = 412, y0 = 628;   // кончик сигареты всадника (RCIG)
    for (let j = 0; j < 3; j++) { const u = cl(k * 1.4 - j * .2), pts = []; for (let i = 0; i <= 10; i++) { const s2 = i / 10 * u; pts.push(x0 + Math.sin(s2 * 7 + j + t * 1.3) * 26 * s2 + s2 * 40, y0 - s2 * 520) } smokeLine(c, pts, 6 - j, '#DCD8E4', (1 - at(k, .7, 1)) * (1 - j * .2)) }
  }
  function calendar(c, t) {   // отрывной календарь на плакате между всадником и пачкой; за каждый день из пачки падают полторы пачки
    const a = T9, k = at(t, a.polt - .25, a.dev - .2); if (k <= 0) return; const cx = 840, cy = 452, A0 = Math.min(1, k * 6) * (1 - at(t, a.dev - .2, a.dev + .1));
    c.save(); c.globalAlpha *= A0;
    rr(c, cx - 74, cy - 96, 148, 176, 8); fill(c, '#F4F1EA'); c.fillStyle = C3.red; c.fillRect(cx - 74, cy - 96, 148, 40); circ(c, cx - 40, cy - 96, 6, '#333'); circ(c, cx + 40, cy - 96, 6, '#333');
    const n = Math.floor(k * 14); tx(c, String(1 + n), cx, cy + 18, { f: 'M', w: 800, s: 74, c: '#141010' });
    const fl = (k * 14) % 1; if (n < 14) { c.save(); c.translate(cx + 80 * fl, cy - 10 - 60 * fl); c.rotate(fl * 1.2); c.globalAlpha *= 1 - fl; rr(c, -74, -50, 148, 136, 8); fill(c, '#F4F1EA'); tx(c, String(n), 0, 18, { f: 'M', w: 800, s: 74, c: '#141010' }); c.restore() }
    const np = Math.min(21, Math.floor(k * 14 * 1.5)); for (let i = 0; i < np; i++) { const col = i % 3, row = Math.floor(i / 3); c.save(); c.translate(736 + 140 + col * 34, BB.y + BB.h - 30 - row * 46); c.scale(.17, .17); mPack(c, -95, -282, 190, 282, 34, { shadow: false }); c.restore() }
    const fp = (k * 21) % 1; if (np < 21) { c.save(); c.translate(860, lp(BB.y + 200, BB.y + BB.h - 60, ei(fp))); c.rotate(fp * 2); c.scale(.17, .17); mPack(c, -95, -141, 190, 282, 34, { shadow: false }); c.restore() }
    c.restore();
  }
  function torsoPath(c) { c.beginPath(); c.moveTo(-6, -160); c.bezierCurveTo(-10, -178, -8, -196, -2, -208); c.quadraticCurveTo(6, -216, 16, -214); c.lineTo(24, -211); c.bezierCurveTo(31, -204, 32, -192, 28, -180); c.bezierCurveTo(24, -172, 22, -166, 20, -160); c.closePath() }
  function xray(c, t) {   // v20.2 (Боб #037): вертикальная полоса сканера идёт по всаднику слева направо; за ней тело — прозрачный контур на тёмной сетке: лёгкие, рёбра, тёмное пятно (координаты всадника)
    const a = T9, k = at(t, a.dev - .15, a.posl - .1); if (k <= 0 || k >= 1) return; const bx = lp(-16, 38, eio(at(k, 0, .4))), A0 = 1 - at(k, .88, 1), sp = eo(at(t, a.rak - .1, a.leg + .2));
    c.save(); c.globalAlpha *= A0;
    c.save(); torsoPath(c); c.clip(); c.beginPath(); c.rect(-20, -230, bx + 20, 90); c.clip();
    c.fillStyle = '#0B1A33'; c.fillRect(-20, -230, 60, 90); c.strokeStyle = 'rgba(120,210,240,.3)'; c.lineWidth = .5; c.beginPath(); for (let gx = -18; gx < 40; gx += 4) { c.moveTo(gx, -230); c.lineTo(gx, -140) } for (let gy = -228; gy < -140; gy += 4) { c.moveTo(-20, gy); c.lineTo(40, gy) } c.stroke();
    [-1, 1].forEach(s2 => { c.beginPath(); c.ellipse(11 + s2 * 6, -186, 5, 13, s2 * .14, 0, TAU); c.fillStyle = 'rgba(150,220,245,.32)'; c.fill(); c.strokeStyle = '#BFEFFF'; c.lineWidth = 1; c.stroke() });   // лёгкие
    c.strokeStyle = 'rgba(191,239,255,.55)'; c.lineWidth = .7; for (let r = 0; r < 4; r++) { c.beginPath(); c.arc(11, -198 + r * 7, 10, Math.PI * .1, Math.PI * .9); c.stroke() }   // рёбра
    c.beginPath(); c.moveTo(11, -210); c.lineTo(11, -166); c.strokeStyle = '#BFEFFF'; c.lineWidth = .9; c.stroke(); if (sp > 0) circ(c, 15, -190, 3.4 * sp, '#020308');   // трахея, пятно
    c.restore();
    c.strokeStyle = 'rgba(191,239,255,.85)'; c.lineWidth = .9;
    c.save(); c.beginPath(); c.rect(-20, -230, bx + 20, 90); c.clip(); torsoPath(c); c.stroke(); c.restore();   // контур тела — только за полосой
    if (k < .45) { c.fillStyle = 'rgba(190,240,255,.22)'; c.fillRect(bx - 3, -222, 6, 70); c.fillStyle = '#E8FBFF'; c.fillRect(bx - .8, -222, 1.6, 70) }   // полоса сканера
    c.restore();
    if (sp > 0) for (let q = 0; q < 2; q++) { const u = at(t, a.rak + q * .4, a.rak + .7 + q * .4); if (u > 0 && u < 1) ring(c, 15, -190, 5 + 16 * eo(u), rgba('#E23A4E', .9 * (1 - u)), 1.4) }
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
  function hatL(c, x, y, s) {   // v20.2: светлая шляпа ковбоя в лунном свете — видна на ночном небе
    cHat(c, x, y, s, '#B88A5C'); c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = 'rgba(250,232,196,.9)'; c.lineWidth = 2.2;
    c.beginPath(); c.moveTo(-60, -13); c.quadraticCurveTo(-46, -1, -26, -5); c.lineTo(26, -5); c.quadraticCurveTo(46, -1, 60, -13); c.stroke();
    c.beginPath(); c.moveTo(-25, -8); c.bezierCurveTo(-25, -32, -18, -44, -8, -48); c.stroke(); c.restore();
  }
  function post(c, px, t, i) {   // v20.2: столб забора ранчо у дороги (тёплое дерево, скошенный верх); на него падает большая светлая шляпа
    const a = T9; let k;
    if (i === 0) k = 1; else { const t0 = a.vsego + .1 + (i - 1) * .2; k = eo(at(t, t0, t0 + .5)) }
    if (k <= 0) return; const H = (1378 - PTOP) * k, y0 = 1378 - H;
    c.fillStyle = '#4A3326'; c.fillRect(px - 22, y0, 44, H); c.fillStyle = '#5E4232'; c.fillRect(px - 22, y0, 12, H); c.fillStyle = '#2E1F17'; c.fillRect(px + 12, y0, 10, H);
    PL(c, [px - 22, y0, px, y0 - 12, px + 22, y0], '#5E4232'); c.fillStyle = 'rgba(30,20,14,.45)'; for (let g = 0; g < 3; g++) c.fillRect(px - 12 + g * 9, y0 + 40 + g * 70, 3, 60);
    const th = i === 0 ? at(t, a.pyat - .05, a.pyat + .35) : at(t, a.chet - .1 + (i - 1) * .25, a.chet + .3 + (i - 1) * .25); if (th > 0) hatL(c, px, lp(PTOP - 700, y0 - 16, eo(th)), 2.0);
  }
  function wire(c, t) {   // v20.2: между столбами — две жерди и колючая проволока; проволока натягивается на «Мальборо», в фильме на «Помните» краснеет — это красная нить доски
    const a = T9, red = SA('s12') !== null ? eio(at(t, SA('s12') - .05, SA('s12') + .5)) : 0, tight = eio(at(t, a.marl - .1, a.marl + .4));
    for (let i = 0; i < 3; i++) { const t0 = a.vsego + .1 + i * .2, k = eio(at(t, t0 + .2, t0 + .6)); if (k <= 0) continue; const x0 = POSTS[i], x1 = POSTS[i + 1], xe = lp(x0, x1, k);
      [PTOP + 110, PTOP + 250].forEach(ry => { c.fillStyle = '#3E2B20'; c.fillRect(x0, ry, xe - x0, 22); c.fillStyle = '#5E4232'; c.fillRect(x0, ry, xe - x0, 5) });
      const wy = PTOP + 34, sag = 46 * (1 - tight); c.strokeStyle = mixc('#8A8296', '#DC2626', red); c.lineWidth = 3 + 3 * red; c.beginPath(); c.moveTo(x0, wy); c.quadraticCurveTo((x0 + xe) / 2, wy + sag * k, xe, wy); c.stroke();
      for (let bx = x0 + 30; bx < xe - 10; bx += 46) { const u = (bx - x0) / (x1 - x0), by = wy + sag * k * 4 * u * (1 - u); c.beginPath(); c.moveTo(bx - 6, by - 6); c.lineTo(bx + 6, by + 6); c.moveTo(bx + 6, by - 6); c.lineTo(bx - 6, by + 6); c.stroke() } }   // колючки
  }
  function w9World(c, t, q) {
    nightLocal(c, t, q, false);
    if (q.z > .6) A(c, cl((q.z - .6) / .8), () => layerRel(c, q, K9REF, 1.3, cc => { for (let i = 0; i < 14; i++) { const lx = BB.x + 180 + (i % 3) * 300 + Math.sin(t * 3 + i) * 60, ly = BB.y - 40 + H1(i) * 300 + Math.cos(t * 2.3 + i * 2) * 40; circ(cc, lx, ly, 3, 'rgba(255,240,200,.7)') } }));   // мошкара в луче лампы
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
  function boardWall3(c, t) {   // v20.2: пробка во весь кадр (без тёмной стены снизу): доска шире любого кадра камеры
    c.fillStyle = '#4a3220'; c.fillRect(-4000, -4000, 9000, 9000);
    const X0 = -520, Y0 = -420, X1 = 1600, Y1 = 2300, im = corkImg3();
    c.save(); rr(c, X0, Y0, X1 - X0, Y1 - Y0, 14); fill(c, '#5b3d26'); rr(c, X0 + 22, Y0 + 22, X1 - X0 - 44, Y1 - Y0 - 44, 8); c.clip();
    for (let yy = Y0; yy < Y1; yy += 1400) for (let xx = X0; xx < X1; xx += 1080) c.drawImage(im, xx, yy); c.restore();
    rr(c, X0 + 22, Y0 + 22, X1 - X0 - 44, Y1 - Y0 - 44, 8); lnS(c, 3, 'rgba(241,230,214,.4)');
    c.save(); const g = c.createRadialGradient(540, 420, 120, 540, 700, 1500); g.addColorStop(0, 'rgba(255,236,190,.12)'); g.addColorStop(1, 'rgba(20,12,6,.38)'); c.fillStyle = g; c.fillRect(X0, Y0, X1 - X0, Y1 - Y0); c.restore();   // свет лампы сверху, края темнее
  }
  function marker3(c, x, y, s, seed) { c.save(); c.translate(x, y); c.lineCap = 'round';
    [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(seed + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke(); c.restore() }); c.restore() }
  function pin3d(c, x, y, k = 1) { if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k); circ(c, 2, 4, 10, 'rgba(0,0,0,.35)'); circ(c, 0, 0, 10, '#dc2626'); circ(c, -3, -3, 3.6, '#fca5a5'); c.restore() }   // v20.2: булавка меньше — при отъезде из фото не «огромный шар»
  function thread3(c, a, b, k = 1, col = '#dc2626') { if (k <= 0) return; const [x1, y1] = pin3(a), [x2, y2] = pin3(b); c.save(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(lp(x1, x2, k) + 3, lp(y1, y2, k) + 6); c.stroke(); c.strokeStyle = col; c.lineWidth = 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, k), lp(y1, y2, k)); c.stroke(); c.restore() }
  function photo1979b(c, t, x, y, s) {   // колба и кристалл соли (как в главе 1); на «миллиардов» — круг «Джула» с долей 35 %
    const a = T12, k = a ? spr(at(t, a.mil + .05, a.mil + .7)) : 0;   // v20.3: круг раскрывается, когда камера уже на карточке
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
    const [ex, ey, ez] = T9END, m = 230 / (1920 / ez); N12 = { x: 540 - (ex - 540) * m, y: photo3(C1924)[1] - (ey - 960) * m, m };   // v20.2: фото = последний кадр ночной сцены
    const a = T12; a.burn = a.por + .05; a.sih = w('сих');
    // v20.3 (по разбору Gemini): на 1:12–1:21 доска только крупно — всю доску с закрытыми 2014 и 2022 видно один раз, в конце главы.
    // Кадр, который заходит ниже верхнего края карточек 2014 и 2022 (y 619), не шире промежутка между ними (x 373…715); по диагонали нити — с наездом.
    const tip = [RC.x1 + Math.sin(9 - a.end * 4) * 24, RC.y1];   // кончик чека в момент нырка
    K12 = [KY(a.pom + .5, 545, 785, 3.3), KY(a.tri + .4, 538, 520, 4.3), KY(a.mil + .1, 478, 395, 4.6), KY(a.mil + .36, 345, 342, 3.6),   // 1924 → вверх по нити → 1979, круг «Джула»
      KY(a.juul, 342, 348, 3.95), KY(a.poter + .25, 348, 340, 3.8),   // счётчик 12,80 → 0,45 крутится поверх кадра
      KY(a.spok, 470, 330, 4.3), KY(a.spok + .4, 540, 560, 4), KY(a.perezh + .2, 544, 900, 3.4), KY(a.pach, 544, 1010, 3.3),   // назад вдоль нити и вниз: пачка выезжает из-за карточки 1924
      KY(a.korm + .1, 548, 1100, 3.35), KY(a.sih + .1, 570, 1340, 3.9), KY(a.end, tip[0], tip[1], 9)];   // крышка-касса, чек спускается, нырок в тлеющий кончик
  }
  const RC = { x1: 610, y1: 1640 };   // v20.3: кончик чека (тлеет) — под карточками, в стороне от закрытых 2014 и 2022
  function pack12(c, t) {   // v20.2: крупная пачка-касса: выезжает из-за карточки 1924, крышка откидывается назад (как ящик кассы), из пачки волной ползёт чек
    const a = T12, k = eo(at(t, a.perezh - .3, a.perezh + .5)); if (k <= 0) return;   // v20.3: выезжает вниз из-за карточки 1924
    const S = .82, w = 190 * S, h = 282 * S, x = 540 - w / 2, top = lp(700, 1010, k), sw = Math.sin(t * 2.2) * .04 * at(t, a.perezh + .3, a.perezh + .8), lid = eio(at(t, a.korm - .1, a.korm + .2));
    c.save(); c.translate(x + w / 2, top + h); c.rotate(sw); c.translate(-(x + w / 2), -(top + h));
    rasterPoly(c, [x + w, top + h * .1, x + w + h * .2, top + h * .25, x + w + h * .2, top + h * 1.1, x + w * .2, top + h * 1.1, x, top + h], 'rgba(0,0,0,.3)', 9, 2.4);
    flipPack(c, x, top, w, h, lid, { shadow: false });
    c.restore();
    if (lid > 0) { const rl = at(t, a.korm + .08, a.end), x0 = x + w / 2, y0 = top + h * .1, pts = [];   // бесконечный чек волной
      for (let i = 0; i <= 44; i++) { const u = i / 44 * rl, bx = lp(x0, RC.x1, u), by = lp(y0, RC.y1, u) - Math.sin(Math.PI * Math.min(1, u * 1.6)) * 200; pts.push([bx + Math.sin(u * 9 - t * 4) * 24, by]) }
      c.strokeStyle = '#F4F1EA'; c.lineCap = 'butt'; c.lineWidth = 36; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
      c.strokeStyle = 'rgba(40,40,50,.35)'; c.lineWidth = 2; pts.forEach((p, i) => { if (i % 2 && i > 2) { c.beginPath(); c.moveTo(p[0] - 11, p[1]); c.lineTo(p[0] + 11, p[1]); c.stroke() } });
      const end = pts[pts.length - 1], eb = at(t, a.burn - .1, a.end); if (eb > 0) { circ(c, end[0], end[1], 16, rgba('#FF9A4A', .45 * eb)); circ(c, end[0], end[1], 9, C3.ember) } }
  }
  function drum12(c, t) {   // v20.2: барабанный счётчик поверх кадра: 12,80 → 0,45 млрд $, цифры прокручиваются; уходит на «пережил»
    const a = T12; if (!a) return; const k = at(t, a.mil + .1, a.mil + .45) * (1 - at(t, a.perezh + .1, a.perezh + .4)); if (k <= 0) return;
    const v = lp(12.8, .45, eio(at(t, a.pochti, a.poter + .45))), cw = 46, ch = 70, x0 = 540 - 3.2 * cw, y0 = 300;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.translate(540, y0); c.scale(bo(k), bo(k)); c.translate(-540, -y0); c.globalAlpha *= Math.min(1, k * 2);
    rr(c, x0 - 70, y0 - ch / 2 - 14, 6.4 * cw + 210, ch + 28, 18); fill(c, 'rgba(15,23,42,.9)');
    tx(c, '$', x0 - 34, y0 + 3, { f: 'M', w: 800, s: 50, c: '#F4F1EA' }); tx(c, 'МЛРД', x0 + 5.6 * cw + 62, y0 + 3, { f: 'M', w: 800, s: 34, c: '#F4F1EA' });
    const P = [[10, 0], [1, 1], [null, 2], [.1, 3], [.01, 4]];
    P.forEach(([pl, i]) => { const cx = x0 + i * cw * 1.12 + cw / 2;
      if (pl === null) { tx(c, ',', cx, y0 + 14, { f: 'M', w: 800, s: 54, c: '#F4F1EA' }); return }
      rr(c, cx - cw / 2, y0 - ch / 2, cw, ch, 8); fill(c, '#F4F1EA');
      const dd = (v + 1e-6) / pl, d0 = Math.floor(dd) % 10, fr = dd - Math.floor(dd), sh = pl < .05 ? fr : cl((fr - .9) * 10);   // как одометр: младшая цифра крутится, старшие поворачиваются, когда младшая проходит 9→0
      c.save(); rr(c, cx - cw / 2, y0 - ch / 2, cw, ch, 8); c.clip();
      const show = n => (i === 0 && v < 9.6 && n % 10 === 0) ? '' : String(n % 10);
      tx(c, show(d0), cx, y0 + 4 - sh * ch, { f: 'M', w: 800, s: 54, c: '#141010' }); tx(c, show(d0 + 1), cx, y0 + 4 + ch - sh * ch, { f: 'M', w: 800, s: 54, c: '#141010' });
      c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(cx - cw / 2, y0 - 3, cw, 6); c.restore() });
    c.restore();
  }
  function board12(c, t, inner) {
    const a = T12; boardWall3(c, t);
    const pk = (MODE === 'y' && T13 && t >= T13.vEnd) ? spr(at(t, T13.vEnd + .52, T13.vEnd + .9)) : 1, ta = Math.min(1, pk);   // v20.5: при отъезде из фото булавка 1924 не вылезает огромной сверху — вдавливается, когда карточка уже целиком в кадре; нити к ней появляются вместе с ней
    const th = (p, q, k) => { if (p !== C1924 && q !== C1924) return thread3(c, p, q, k); c.save(); c.globalAlpha *= ta; thread3(c, p, q, k); c.restore() };
    th(CARDS3[0], CARDS3[1]); [2, 3, 4].forEach(i => th(CARDS3[1], CARDS3[i]));
    const kt = a ? eio(at(t, a.pom + .25, a.mil + .1)) : 1; th(C1924, CARDS3[0], kt);   // v20.3: нить тянется, камера едет за ней
    if (a && t < a.end + .3) pack12(c, t);   // v20.3: пачка выезжает вниз из-за карточки 1924 (рисуется под карточками); с чеком сгорает в дым — в концовке её нет
    CARDS3.forEach(cd => card3(c, t, cd, cd.id === '1924' ? inner : null));
    CARDS3.forEach(cd => pin3d(c, ...pin3(cd), cd === C1924 ? pk : 1));
  }
  function w12Shot(c, t) { const q = camObj(camAt(K12, t)); layer(c, q, 1, cc => board12(cc, t, ci => inNest(ci, N12, cn => nightLocal(cn, t, q, false)))) }
  // ---------- дым (v20.2): неровные клубы растут из тлеющего кончика чека (в шортсе — снизу), закрывают кадр; после стыка с 2014-м уходят вверх ----------
  // v20.4 (разбор Gemini: «плоские серые круги, как мыльные пузыри»): мягкий дым — клубы с размытым краем (радиальный градиент, без кружка-блика),
  // каждый из трёх комков, которые медленно ворочаются; рисуется в маленький холст и растягивается — края мягкие; на стыке кадр закрыт ровной дымкой
  let SMC = null; const SMTONE = ['#B9B6C2', '#A9A6B4', '#C6C3CE', '#9F9CAA'];
  function puff(g, x, y, r, col, a) { if (a <= 0 || r <= 0) return; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(col, a)); gr.addColorStop(.55, rgba(col, a * .72)); gr.addColorStop(1, rgba(col, 0));
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2) }
  function smokeCover(c, t, tc, half = .5) {
    if (Math.abs(t - tc) > half + .5) return;
    if (!SMC) SMC = mk(270, 480); const g = SMC.getContext('2d'), Q = .25; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, 270, 480);
    const [sx, sy] = MODE === 'y' && T12 ? [540, 960] : [540, 2250];
    const base = t <= tc ? ei(at(t, tc - .24, tc)) : 1 - eo(at(t, tc + .02, tc + .32)); if (base > 0) { g.fillStyle = rgba('#ABA8B6', base); g.fillRect(0, 0, 270, 480) }   // ровная дымка — к стыку кадр закрыт
    let any = base > 0;
    for (let n = 0; n < 56; n++) {
      const fx = -80 + H1(n * 1.37) * 1240, fy = -120 + H1(n * 2.91) * 2160, R = 240 + H1(n * 6.53) * 280;   // где клуб стоит, когда кадр закрыт
      const ta = tc - half + H1(n * 4.17) * half * .55, k = eo(at(t, ta, tc + .02));
      const after = at(t, tc + .03 + (fy / 1920) * .1, tc + .03 + half + .25), up = 2400 * after * after;   // после стыка — вверх и тает; нижние клубы уходят позже
      if (k <= 0 || after >= 1) continue; any = true;
      const x = lp(sx, fx, k) + Math.sin(t * 1.6 + n) * 16, y = lp(sy, fy, k) - up, r = R * (.18 + .82 * k) * (1 + .25 * after), al = Math.min(1, k * 1.6) * Math.pow(1 - after, 1.3);
      for (let j = 0; j < 3; j++) { const an = n * 2.1 + j * 2.09 + t * (.5 + H1(n) * .5), d = r * .34;   // три комка ворочаются вокруг центра клуба
        puff(g, (x + Math.cos(an) * d) * Q, (y + Math.sin(an) * d * .8) * Q, r * (.62 - j * .06) * Q, SMTONE[(n + j) % 4], .9 * al) }
      puff(g, (x - r * .22) * Q, (y - r * .28) * Q, r * .42 * Q, '#D4D1DB', .45 * al);   // светлая сторона — мягко, без края
    }
    if (!any) return;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(SMC, 0, 0, WW, HH); c.restore();
  }
  // ================= мир 13–14 (фразы 13–14): графит 2014-го. Белые фигурки 1954-го пятятся от дыма; огонь на кончике сжимается в пластинку нагревателя (#114);
  // разрез тонкими линиями поверх держателя (#067); волны тепла вместо дыма. Стик выезжает, отъезд: пачка HeatSticks → витрина с тремя пачками (#151), имена загораются.
  // Концовки: фильм — витрина становится фото карточки 1924, нить к закрытой «2014»; шортс — вопрос, «Часть 4 →», камера ныряет в среднюю пачку витрины —
  // v20.3: это та же пачка, что на плакате у трассы, она раскрывается в щит кадра 0 (петля).
  let T13 = null, K13 = null, KEND = null, N14 = null, TSM = 0, KL = null, TL0 = 0;
  const CIG = { x0: 230, x1: 820, y: 900, r: 26 }, HOLD = { x0: 640, x1: 1180, y: 900 }, SHOW = { x0: 90, x1: 990, y0: 600, y1: 1250, shelf: 1190 };
  function w13Init() {
    const s = 's13', w = q => Ws(s, q), s4 = 's14';
    T13 = { a: SA(s), kogda: w('когда'), isp: w('испугались'), dyma: w('дыма'), tret: w('третья'), zh: w('жизнь'), bez: w('без'), ogn: w('огня'), tab: w('табак'), sig: w('сигарете'), gre: w('греет'), nagr: w('нагреватель'),
      a14: SA(s4), stiki: Ws(s4, 'стики'), naz: Ws(s4, 'назывались'), marl: Ws(s4, 'мальборо'), q: SA('q'), qEnd: SB('q'), vEnd: TLX.vEnd, endT: TLX.endT };
    const a = T13; TSM = (SA('s12') !== null ? T12.end : T9.end);   // дым закрывает кадр — стык миров
    K13 = [KY(TSM, 560, 930, .74), KY(a.isp, 520, 960, .9), KY(a.tret, 640, 930, 1.3), KY(a.bez + .25, 700, 920, 1.6), KY(a.tab + .35, 760, 900, 1.25), KY(a.nagr + .3, 780, 880, 1.35),
      KY(a.stiki + .2, 560, 920, 1.05), KY(a.naz + .1, 540, 900, .86), KY(a.marl + .1, 540, 905, .84)];
    if (MODE === 's') {   // v20.3: петля шортса — нырок в среднюю пачку; пачка на плакате (мир 1) нарисована так же, мир 1 лежит так, что пачки совпадают
      a.ts = a.qEnd + .95; TL0 = TLX.endT + 1 / 30; const NPK = { x: 445 - (BB.x + 676) + 540, y: SHOW.shelf - 282 - (BB.y + 176) + 960, m: 1 };
      K13[K13.length - 1] = KY(a.marl + .1, 540, 930, .9); K13.push(KY(a.qEnd - .05, 540, 1020, 1.06), KY(a.ts, 540, SHOW.shelf - 141, 7.6)); KL = [KY(TL0, 540, 960, 1)]; linkK(K13, KL, NPK, true) }   // наезд до пачки во весь кадр → отъезд к кадру 0
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
    const kd = MODE === 's' ? eio(at(t, a.qEnd - .05, a.ts - .3)) : 0;   // v20.3: на нырке имена гаснут и блики стекла уходят — пачка как на плакате
    const gl = i => eo(at(t, a.marl - .05 + i * .22, a.marl + .2 + i * .22)) * (1 - kd);
    softPack(c, 160, shelf - 300, 200, 300, 30, { glow: gl(0), shc: 'rgba(0,0,0,.3)' });
    mPack(c, 445, shelf - 282, 190, 282, 34, { glow: gl(1), shc: 'rgba(0,0,0,.3)' });
    heatPack(c, 830, shelf, 1, gl(2));
    c.save(); rr(c, x0, y0, x1 - x0, y1 - y0, 8); c.clip(); c.globalAlpha *= 1 - kd;   // стекло: блики и отражение четырёх шляп с забора
    poly(c, [x0 + 80, y1, x0 + 200, y1, x0 + 520, y0, x0 + 400, y0]); fill(c, 'rgba(255,255,255,.07)'); poly(c, [x0 + 600, y1, x0 + 640, y1, x0 + 960, y0, x0 + 920, y0]); fill(c, 'rgba(255,255,255,.06)');
    { const u = at(t, a.naz - .2, a.marl + .9), gxx = lp(x0 - 300, x1 + 300, eio(u)); if (u > 0 && u < 1) { poly(c, [gxx - 60, y1, gxx + 60, y1, gxx + 380, y0, gxx + 260, y0]); fill(c, 'rgba(255,255,255,.13)') } }   // v20.2: блик бежит по стеклу, пока имена загораются
    c.globalAlpha *= .16; for (let i = 0; i < 4; i++) cHat(c, x0 + 170 + i * 190, y0 + 110 + Math.sin(t * 1.3 + i) * 3, 1.6, '#F4F1EA'); c.restore();
    rr(c, x0, y0, x1 - x0, y1 - y0, 8); lnB(c, 4, 'rgba(255,255,255,.35)');
  }
  function w13World(c, t) {
    const a = T13; graphite(c, t); figs13(c, t); showcase(c, t); stick13(c, t);
    if (MODE === 's') { const kq = at(t, a.q - .1, a.q + .3); if (kq > 0) plate(c, 'Без огня — без вреда?', 540, 528, bo(kq), { s: 54, bg: '#F4F1EA', c: '#141010', ls: 0, w: 800 });   // v20.3: на нырке плашки уходят за край кадра
      const kp = at(t, a.q + 1, a.q + 1.4); if (kp > 0) tx(c, 'Часть 4 →', 540, 1330, { f: 'M', w: 800, s: 70 * bo(kp), c: '#F4F1EA', a: Math.min(1, kp * 2) }) }
  }
  function w13Shot(c, t) {
    if (MODE === 'y' && t >= T13.vEnd) { const q = camObj(camAt(KEND, t)); layer(c, q, 1, cc => { board12(cc, t, ci => inNest(ci, N14, cn => w13World(cn, t)));
      const kt = eo(at(t, T13.vEnd + 1.3, T13.vEnd + 2.3)); thread3(cc, C1924, CARDS3[2], kt) }); return }
    if (KL && t >= T13.ts) { w1World(c, t - TL0, camObj(camAt(KL, t))); return }   // v20.3: шортс — пачка раскрылась в щит у трассы; мир 1 подходит к своему кадру 0 (петля без повтора кадра)
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
    chInit(); linkK(KC, KCH, NCH, true);   // v20.2: ныряем в пробку сигареты — это корона небоскрёба, отъезд в ночной Чикаго
    w7Init(); linkK(KCH, K7, NC7(), true);   // ныряем в кабинет Бёрнетта (этаж в разрезе дома)
    w8Init(); linkK(K7, K8, { x: 540, y: 960, m: 1 }, true);   // лист = плакат: тот же мир, смена незаметна
    linkK(K8, KE, NE8, false);   // столбик в ночном небе = луч над Землёй (мир 8 вложен в Землю)
    w9Init(); linkK(KE, K9, NE9, true);   // ныряем к горизонту на верху шара: ночной щит вложен в Землю
    w12Init(); if (K12) linkK(K9, K12, N12, false);   // отъезд из фото карточки 1924 на доску
    w13Init();
    if (typeof wInitRest === 'function') wInitRest();
    const W = (a, b) => SHUT.push([a, b]);   // короткая выдержка на быстрых проездах: без смаза и двоения
    W(T1.zh - .2, T1.end + .55); W(T2.izy - .1, T2.zh + .5); W(T2.pom - .15, T2.end + .35); W(TC.spas - .1, TC.strah + .25); W(TC.amer + .15, TC.amer + .75); W(TC.bros - .1, TC.filt + .4); W(TC.nezh - .2, TC.nezh + .4); W(TC.fil - .12, TC.fil + .9);
    W(TC.vidu - .1, TC.end + .4); W(T7.stav + .2, T7.slov + .15); W(T8.muzh, T8.chet + .55); W(T8.sem - .1, T8.mir + .35); W(T8.sweep1 - .1, T9.kur); W(T9.vsego - .2, T9.umerli + .3); W(T9.chet + .8, T9.chet + 1.4); W(T9.dev - .2, T9.dev + .5);
    if (T12) { W(T12.pom - .1, T12.mil + .6); W(T12.pochti - .1, T12.poter + .55); W(T12.spok - .45, T12.perezh + .35); W(T12.korm + .3, T12.end) } W(TSM - .5, TSM + .5); W(T13.stiki - .2, T13.naz + .3);   // v20.3: проезды вдоль нити — без двоения
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
    if (!HY) HY = { t1: Ws('s2', 'первые'), t54: Ws('s3', 'пятьдесят'), t72: Ws('s8', 'семьдесят'), t90: Ws('s10', 'девяностом'), t92: Ws('s10', 'умер'), out: Ws('s11', 'всего'), t14: Ws('s13', 'когда'), kv: Ws('s2', 'видно'),
      end: MODE === 'y' ? TLX.vEnd : T13.qEnd + .25 };
    const h = HY, pill = (y0, y1, k, dy = 0, al = 1) => { c.save(); c.setTransform(1, 0, 0, 1, 0, dy); yearPill(c, y0, y1, k, al, true); c.restore() };
    if (t < h.t1 - .25) return;
    if (t < h.t72 - .3) return pill(1924, 1954, at(t, h.t54 - .15, h.t54 + .35), -240 * (1 - eo(at(t, h.t1 - .25, h.t1 + .15))), Math.min(1, 1 - at(t, h.kv + .11, h.kv + .31) + at(t, h.t54 - .15, h.t54 + .05)));   // v20.4: на наезде в журнал плашка гаснет — не ложится на буквы Marlboro
    if (t < h.t90 - .3) return pill(1954, 1972, at(t, h.t72 - .15, h.t72 + .35));
    if (t < h.t92 - .3) return pill(1972, 1990, at(t, h.t90 - .15, h.t90 + .35));
    if (t < h.out + .45) return pill(1990, 1992, at(t, h.t92 - .15, h.t92 + .35), -240 * ei(at(t, h.out, h.out + .45)));
    const he = h.end - (MODE === 'y' ? .42 : 0);   // v20.5: в фильме плашка уходит до отъезда из фото — не горит, пока витрина сжимается в карточку
    if (t < h.t14 - .25 || t > he + .45) return;
    pill(2014, 2014, 1, -240 * Math.max(1 - eo(at(t, h.t14 - .25, h.t14 + .15)), ei(at(t, he, he + .45))));
  }
  function names(c, t) {   // плашки с именами — поверх кадра, чтобы читались, пока камера едет
    { const kn = at(t, T9.nast - .05, T9.nast + .3) * (1 - at(t, T9.uein - .4, T9.uein - .12)); if (kn > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); plate(c, 'ПО-НАСТОЯЩЕМУ', 540, 300, bo(kn), { s: 46, bg: '#F4F1EA', c: '#141010', ls: 3 }); c.restore() } }   // v20.2: плашкой, не поверх ламп
    for (const [a, b, n1, n2] of [[TC.bern - .12, TC.end - .12, 'ЛЕО БЁРНЕТТ', 'РЕКЛАМЩИК, ЧИКАГО'], [T9.uein - .05, T9.polt + .1, 'УЭЙН МАКЛАРЕН', 'КОВБОЙ С РЕКЛАМЫ']]) {
      const k = at(t, a, a + .3) * (1 - at(t, b - .25, b)); if (k <= 0) continue;
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); plate(c, n1, 540, 300, bo(k), { s: 50, bg: '#F3EBDD', c: '#141010', ls: 3 }); plate(c, n2, 540, 384, bo(at(t, a + .1, a + .4)) * (1 - at(t, b - .25, b)), { s: 30, bg: C3.red, c: '#fff', ls: 3 }); c.restore() }
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
  function frame(t) { frameTo(X, t) }
  function frameTo(c, t) {   // v20.1: кадр главы в любой холст — им же мостик «Льда» рисует последние кадры
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (window.NOMB) scene(c, t); else sceneMB(c, t);
    c.setTransform(1, 0, 0, 1, 0, 0); hud(c, t); names(c, t); if (T12) drum12(c, t); subs(c, t);
  }
  function cues() {   // звуки по событиям сцен (мягкие)
    allInit(); const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    const a = T1; if (a.hk) { Q(.05, 'leaves', .35); Q(a.brut, 'whoosh', .35); Q(a.ledi - .1, 'pageflip', .5) } Q(a.marl, 'whoosh', .3); Q(a.do, 'pageflip', .8); Q(a.do + .5, 'papers', .4); Q(a.zh - .2, 'whoosh', .6);
    const b = T2; Q(b.perv - .1, 'whoosh', .4); Q(b.myag - .1, 'plop', .5); Q(b.myag + .2, 'scroll', .35); Q(b.izy, 'pageflip', .6); Q(b.rekl, 'papers', .45); Q(b.zh, 'pageflip', .5); Q(b.kr - .2, 'whoosh', .45); Q(b.kr + .2, 'lipstick', .9); Q(b.kon, 'lipstick', .6); Q(b.kot, 'whoosh', .35); Q(b.tilt0 + .1, 'whoosh', .5); Q(b.tilt1, 'deep', .5);
    const d = TC; Q(d.pyat - .15, 'plop', .4); Q(d.gor - .1, 'counter', .5); Q(d.gor + .35, 'glass', .45); Q(d.proc - .2, 'plop', .5); Q(d.umer - .1, 'puff', .35); Q(d.spas - .05, 'whoosh', .6);
    Q(d.nam - .15, 'pour', .4); Q(d.nam + .3, 'marker', .5); Q(d.smol, 'marker', .4); Q(d.op - .1, 'xray', .45); Q(d.op + .45, 'xray', .3); Q(d.amer + .15, 'marker', .55); for (let i = 0; i < BARS.length; i++) Q(d.amer + .75 + i * .26, 'plop', .22, -.4 + i * .1); Q(d.men - .2, 'thud', .5);
    Q(d.bros - .1, 'whoosh', .5); Q(d.bros + .3, 'school', .35); for (let i = 0; i < 5; i++) Q(d.bros + .1 + i * .18, 'plop', .25, -.3 + i * .15); Q(d.muzh + .05, 'whoosh', .4); Q(d.nezh - .25, 'drawer', .5); Q(d.nezh + .02, 'stamp', .6);
    Q(d.fil - .1, 'icecrack', .5); Q(d.fil + .35, 'impact', .7); Q(d.fil + .45, 'thud', .6); Q(d.vtor - .05, 'shimmer', .4); Q(d.filtr - .2, 'xray', .4); Q(d.zhest + .24, 'thud', .5); Q(d.pach + .18, 'thud', .55); Q(d.otkr - .35, 'whoosh', .35); Q(d.shch - .08, 'drawer', .9); Q(d.shch, 'stamp', .5); Q(d.chik - .1, 'whoosh', .5); Q(d.sw - .3, 'deep', .5); Q(d.sw - .12, 'glass', .2); Q(d.sw + .1, 'city', .4); Q(d.leo - .3, 'whoosh', .5); Q(d.end - .6, 'deep', .5);
    const e = T7; Q(e.stav - .3, 'whoosh', .4); Q(e.stav, 'marker', .6); Q(e.stav + .6, 'marker', .5); Q(e.stav + 1.2, 'marker', .45); Q(e.slov - .1, 'pour', .45); Q(e.sam + .1, 'scroll', .4); Q(e.sam + .3, 'plop', .5); Q(e.sim - .1, 'whoosh', .6);
    const f = T8; Q(f.cherez, 'truck', .45, -.4); Q(f.god, 'whoosh', .5); Q(f.byv, 'truck', .35, .4); Q(f.chet - .2, 'counter', .5); Q(f.chet + .2, 'glass', .45); Q(f.sem - .1, 'whoosh', .7); Q(f.sw + .1, 'deep', .5); Q(f.mir - .1, 'whoosh', .45);
    PACKS_E.forEach(([ri, an]) => { const a2 = AN(an); Q(lp(f.sweep0, f.sweep1, (a2 + .05) / TAU), 'plop', .35, Math.sin(a2) * .8) });
    const g = T9; Q(g.vot - .3, 'whoosh', .6); Q(g.kur - .05, 'neon', .4); Q(g.kur + .1, 'puff', .3); Q(g.uein - .05, 'plop', .4); for (let i = 0; i < 8; i++) Q(g.polt - .2 + i * .19, 'pageflip', .25, .2); Q(g.dev - .05, 'xray', .55);
    Q(g.rekl - .25, 'conveyor', .4); Q(g.rekl, 'chain', .35); Q(g.umer - .15, 'thud', .55); Q(g.pyat + .3, 'thud', .5); Q(g.vsego, 'whoosh', .45); Q(g.vot + .35, 'truck', .2, -.5); Q(g.umerli + .3, 'truck', .18, .5); for (let i = 0; i < 3; i++) Q(g.chet - .05 + i * .25, 'thud', .4, -.2 + i * .25); Q(g.marl, 'leaves', .35);
    if (T12) { const h = T12; Q(h.pom - .05, 'whoosh', .5); Q(h.mil - .1, 'plop', .5); Q(h.mil + .2, 'coins', .4); Q(h.pochti, 'counter', .6); Q(h.spok - .25, 'whoosh', .45); Q(h.korm - .08, 'register', .8); Q(h.korm + .15, 'receipt', .7); Q(h.burn, 'puff', .5) }
    Q(TSM - .3, 'whoosh', .55);
    const k = T13; Q(k.isp - .1, 'school', .3); Q(k.tret - .15, 'puff', .4); Q(k.tret + .1, 'glassbulb', .4); Q(k.tab - .3, 'whoosh', .45); Q(k.tab, 'drawer', .45); Q(k.gre, 'pour', .35); Q(k.stiki - .1, 'whoosh', .5); Q(k.naz - .1, 'glass', .45);
    for (let i = 0; i < 3; i++) Q(k.marl - .05 + i * .22, 'glass', .5, -.4 + i * .4);
    if (MODE === 'y') { Q(TLX.vEnd + .05, 'whoosh', .55); Q(TLX.vEnd + .6, 'plop', .3); Q(TLX.vEnd + 1.3, 'marker', .4) } else { Q(k.q - .1, 'plop', .5); Q(k.q + .95, 'plop', .3); Q(k.qEnd + .05, 'whoosh', .55); Q(k.ts - .12, 'deep', .5); Q(k.ts + .1, 'leaves', .35) }   // v20.3: нырок в пачку → щит у трассы
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    // v20.1: глава внутри другого ролика (мостик «Льда» ныряет в её кадр 0): sub.init(таймлайн главы) — без своего холста и звуков,
    // sub.scene(c, t) — мир главы в текущих координатах, sub.frameTo(c, t) — кадр целиком, sub.pre(камера до кадра 0, порыв ветра на плакате)
    sub: { init: null, scene: (c, t) => scene(c, t), frameTo: (c, t) => frameTo(c, t), pre(cam, peel) { W1PRE = cam; W1PEEL = peel } },
    init(tl, SC, sub) {
      TLW = tl.sent.flatMap(s => s.words); TLS = tl.sent; const ep = String(tl.ep || '').replace(/-(ru|en|de)$/, '');
      MODE = /y$/.test(ep) ? 'y' : 's';
      TLX = { b0: tl.b0, vEnd: tl.vEnd, endT: (Math.ceil(tl.dur * 30) - 1) / 30 };
      K = keys(); BLOCKS.length = 0; SHUT.length = 0; HY = null; CHUNKS = buildChunks(); W1PRE = W1PEEL = null;
      if (!sub) { window.__K = K; cues(); window.CUES_READY = 1 } else allInit();
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v200f')) { const st = document.createElement('style'); st.id = 'v200f';
        st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join('')
          + ['latin', 'cyrillic'].map(sub => `@font-face{font-family:P;font-weight:700;font-style:normal;src:url(fonts/playfair-${sub}-700-normal.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}@font-face{font-family:P;font-weight:400 700;font-style:italic;src:url(fonts/playfair-${sub}-700-italic.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}`).join('');
        document.head.appendChild(st) }
      cv = mk(WW, HH); if (!sub) { cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain')) }
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U', '700 20px P', 'italic 700 20px P', 'italic 400 20px P'].map(f => document.fonts.load(f, 'АЯaz09$'))).then(() => 0);
    },
  };
  { const ep = window.EP; ep.sub.init = tl => ep.init(tl, [], true) }
  window.__dbg = { camAt, get K12() { return K12 }, get K13() { return K13 }, get KL() { return KL }, get T12() { return T12 }, get T13() { return T13 }, get TSM() { return TSM } };   // v20.3: камера для проверок (кадр не трогает)
})();
