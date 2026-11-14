// v16.9 (14.11) — «как ролик про Александра» (Андрей прислал референс dynastixxx про Александра Македонского: «почему мы так не можем?»).
// Что взято у референса (разобрано покадрово):
//  • каждый план — СЦЕНА, а не предмет на чёрном: небо градиентом, горизонт, дымка, далёкие силуэты, птицы, боке;
//  • один источник света красит всё (закат, лампа, неон) — у предметов светлая сторона и контровой свет с одной стороны;
//  • глубина как у объектива: передний и дальний планы размыты, середина резкая; камера медленно едет — ближнее смещается быстрее;
//  • плоская рисовка (2D) + простое 3D там, где его легко сделать честно (кубики, диск); сложное рисуем плоско;
//  • HUD как у них: «● ТЕМА · МЕСТО» сверху слева, год сверху справа, внизу «ГЛАВА / 09 · НАЗВАНИЕ», полоса с отметками и ромбом, тайм-код;
//  • большие золотые числа (Rubik), моно-плашки с оранжевой рамкой, субтитры по центру с караоке.
// Темп спокойнее, чем у референса (Андрей: «ролик не должен быть сдвгшный») — план 2,5–5 с, внутри плана меняется одна-две вещи.
// Голос и тайминг — v16.5 (1:45.8), кадр 9:16 (1080×1920). Проба: начало до архива + сделка + конец (RANGE=0-47.5,77.6-105.8).
(function () {
  'use strict';
  const WW = 1080, HH = 1920, TAU = Math.PI * 2;
  const C = { ink: '#04060b', navy: '#0a1222', deep: '#060b16', orange: '#ff9f1c', amber: '#ffb54a', gold: '#f2c46b', red: '#ff3b30', red2: '#c3141c',
    green: '#3fe08a', cyan: '#59d4ff', ice: '#9fdcff', paper: '#efe7d4', paper2: '#ddd2b8', inkT: '#2a241d', white: '#ffffff', mint: '#5fe3b5' };
  P = { bg: C.ink, paper: C.paper, ink: C.ink, line: C.paper, a1: C.orange, a2: C.red };
  const D = {};
  let cv = null, X = null, A = null, B = null, SH = [], CHS = [], HITS = [], Q = {};

  // ================= утилиты =================
  const cl = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, lp = (a, b, k) => a + (b - a) * k;
  const ss = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k) };
  const eo = k => 1 - Math.pow(1 - cl(k), 3), ei = k => Math.pow(cl(k), 3), eio = k => { k = cl(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 };
  const eb = k => { k = cl(k); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2) };   // с перелётом
  const spr = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-6.5 * k) * Math.cos(11 * k);
  const H1 = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) };
  const H2 = (i, j) => H1(i * 57.31 + j * 131.71);
  const n1 = x => { const i = Math.floor(x), f = x - i; return lp(H1(i), H1(i + 1), f * f * (3 - 2 * f)) * 2 - 1 };
  function vn(x, y) { const xi = Math.floor(x), yi = Math.floor(y), u = x - xi, v = y - yi, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v); return lp(lp(H2(xi, yi), H2(xi + 1, yi), su), lp(H2(xi, yi + 1), H2(xi + 1, yi + 1), su), sv) }
  function fbm(x, y, o = 4) { let s = 0, a = .5, f = 1; for (let i = 0; i < o; i++) { s += a * vn(x * f, y * f); a *= .5; f *= 2.03 } return s }
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c };
  const CA = new Map();
  const cache = (k, w, h, fn) => { let c = CA.get(k); if (!c) { c = mk(w, h); fn(c.getContext('2d'), c.width, c.height); CA.set(k, c) } return c };
  const hx = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255] };
  const mixh = (a, b, k) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(lp(v, B[i], k)).toString(16).padStart(2, '0')).join('') };
  const rgba = (hex, a) => { const [r, g, b] = hx(hex); return `rgba(${r},${g},${b},${a})` };
  const lg = (c, x0, y0, x1, y1, st) => { const g = c.createLinearGradient(x0, y0, x1, y1); for (const [o, col] of st) g.addColorStop(cl(o), col); return g };
  const rg = (c, x, y, r0, r1, st) => { const g = c.createRadialGradient(x, y, r0, x, y, r1); for (const [o, col] of st) g.addColorStop(cl(o), col); return g };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r) };
  const poly = (c, p) => { c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath() };
  const at = (u, k0, k1) => cl((u - k0) / (k1 - k0));
  const pop = (t, t0, d = .38) => eb((t - t0) / d);                 // появление «с перелётом»
  const fade = (t, t0, d = .3) => cl((t - t0) / d);

  // ================= текст =================
  // шрифты: O — Oswald (как у референсов), J — JetBrains Mono, M — Manrope
  function font(c, o) { c.font = `${o.w || 700} ${o.s || 32}px ${o.f || 'O'}`; c.letterSpacing = (o.ls || 0) + 'px' }
  function tx(c, s, x, y, o = {}) {
    if (!s) return; c.save(); font(c, o); c.textAlign = o.al || 'center'; c.textBaseline = o.bl || 'alphabetic'; c.globalAlpha *= o.a ?? 1;
    if (o.glow) { c.shadowColor = o.glow; c.shadowBlur = o.gb || 20 } else if (o.sh) { c.shadowColor = o.sh; c.shadowBlur = o.sb || 12; c.shadowOffsetY = o.so ?? 3 }
    c.fillStyle = o.c || '#fff'; c.fillText(s, x, y); c.restore()
  }
  function tw(c, s, o = {}) { c.save(); font(c, o); const w = c.measureText(s).width; c.restore(); return w }
  const typed = (s, k) => s.slice(0, Math.round(cl(k) * s.length));

  // ================= свет, воздух =================
  function glowDot(c, x, y, r, col, a = 1) {
    if (a <= 0 || r <= 0) return; c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha *= cl(a, 0, 4);
    c.fillStyle = rg(c, x, y, 0, r, [[0, rgba(col, 1)], [.22, rgba(col, .45)], [1, rgba(col, 0)]]); c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore();
  }
  function glow(c, x, y, rx, ry, col, a = 1) {   // мягкое пятно света за предметом (эллипс)
    if (a <= 0) return; c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha *= a; c.translate(x, y); c.scale(1, ry / rx);
    c.fillStyle = rg(c, 0, 0, 0, rx, [[0, rgba(col, .55)], [.35, rgba(col, .22)], [.7, rgba(col, .06)], [1, rgba(col, 0)]]); c.fillRect(-rx, -rx, 2 * rx, 2 * rx); c.restore();
  }
  function shadowE(c, x, y, rx, ry, a = .6) {   // мягкая тень-эллипс
    const s = cache('shE', 256, 256, (x) => { x.fillStyle = rg(x, 128, 128, 0, 128, [[0, 'rgba(0,0,0,1)'], [.45, 'rgba(0,0,0,.55)'], [1, 'rgba(0,0,0,0)']]); x.fillRect(0, 0, 256, 256) });
    c.save(); c.globalAlpha *= a; c.drawImage(s, x - rx, y - ry, rx * 2, ry * 2); c.restore();
  }
  function coneSprite(spread, col) {
    const len = 900, half = Math.tan(spread / 2) * len, pad = 70, w = half * 2 + pad * 2, h = len + pad;
    return cache(`cone|${spread.toFixed(3)}|${col}`, w, h, (x) => {
      const t = mk(w, h), y = t.getContext('2d');
      for (let i = 0; i < 7; i++) {
        const k = 1 - i / 7, hh = half * (.3 + .7 * k);
        y.beginPath(); y.moveTo(w / 2 - 5 * k, 0); y.lineTo(w / 2 + 5 * k, 0); y.lineTo(w / 2 + hh, len); y.lineTo(w / 2 - hh, len); y.closePath();
        y.fillStyle = lg(y, 0, 0, 0, len, [[0, rgba(col, .17)], [.3, rgba(col, .08)], [1, rgba(col, 0)]]); y.fill();
      }
      x.filter = 'blur(16px)'; x.drawImage(t, 0, 0);
    });
  }
  // конус света: вершина (x, y), ang — направление (0 — вниз), spread — раствор, len — длина
  function beam(c, x, y, ang, spread, len, col, a = 1) {
    if (a <= 0 || !(len > 1)) return; const s = coneSprite(spread, col), k = len / 900;
    c.save(); c.translate(x, y); c.rotate(ang); c.scale(k, k); c.globalCompositeOperation = 'screen'; c.globalAlpha *= a; c.drawImage(s, -s.width / 2, 0); c.restore();
  }
  function dust(c, t, x, y, ang, spread, len, n, seed = 1, a = 1) {   // пылинки в луче
    c.save(); c.translate(x, y); c.rotate(ang); c.globalCompositeOperation = 'screen'; c.fillStyle = '#fff';
    const tn = Math.tan(spread / 2);
    for (let i = 0; i < n; i++) {
      const d = ((H1(seed + i * 3.17) + t * (.006 + .012 * H1(i * 1.9 + seed))) % 1), al = d * len, w = tn * al;
      const ac = (H1(seed + i * 7.73) * 2 - 1) * w * .85 + Math.sin(t * .6 + i) * 8, r = .9 + H1(i * 1.31 + seed) * 2.4;
      const k = a * (.25 + .75 * H1(i * 9.1 + seed)) * Math.sin(Math.PI * d) * (1 - Math.abs(ac) / (w + 1)) * (.6 + .4 * Math.sin(t * 2 + i));
      if (k <= .01) continue; c.globalAlpha = k; c.fillRect(ac - r / 2, al - r / 2, r, r);
    }
    c.restore();
  }
  // пылинки по всему кадру (медленно плывут вверх) — у референсов они почти в каждом плане
  function motes(c, t, seed = 1, n = 46, col = '#ffffff', a = 1) {
    c.save(); c.globalCompositeOperation = 'screen';
    for (let i = 0; i < n; i++) {
      const z = H1(seed + i * 5.13), sp = 10 + 34 * z, x = (H1(seed + i * 3.1) * WW + Math.sin(t * .35 + i * 1.7) * 26 * z + WW) % WW;
      const y = ((H1(seed + i * 7.7) * (HH + 200) - t * sp) % (HH + 200) + HH + 200) % (HH + 200) - 100, r = .8 + 3.2 * z * z;
      const k = a * (.18 + .5 * z) * (.55 + .45 * Math.sin(t * (1 + z * 2) + i));
      if (r > 2.6) { c.globalAlpha = k * .35; c.fillStyle = rg(c, x, y, 0, r * 3.2, [[0, rgba(col, 1)], [1, rgba(col, 0)]]); c.fillRect(x - r * 3.2, y - r * 3.2, r * 6.4, r * 6.4) }
      else { c.globalAlpha = k; c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill() }
    }
    c.restore();
  }
  // пластина боке (кэш): мягкие диски
  function bokeh(key, w, h, n, cols, r0, r1, seed = 1) {
    return cache('bk' + key, w, h, (x) => {
      const t = mk(w, h), y = t.getContext('2d'); y.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        const px = H1(seed + i * 3.1) * w, py = H1(seed + i * 7.7) * h, r = lp(r0, r1, H1(seed + i * 1.9) ** 2), col = cols[i % cols.length], a = .05 + .14 * H1(seed + i * 5.3);
        y.fillStyle = rg(y, px, py, 0, r, [[0, rgba(col, a * .6)], [.82, rgba(col, a)], [.93, rgba(col, a * 1.25)], [1, rgba(col, 0)]]);
        y.beginPath(); y.arc(px, py, r, 0, TAU); y.fill();
      }
      x.filter = 'blur(3px)'; x.drawImage(t, 0, 0);
    });
  }
  function bokehL(c, t, key, cols, o = {}) {   // слой боке, медленно плывёт
    const w = WW * 1.3, h = HH * 1.2, b = bokeh(key, w, h, o.n || 26, cols, o.r0 || 14, o.r1 || 70, o.seed || 3);
    c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha *= o.a ?? 1; c.drawImage(b, -WW * .15 + Math.sin(t * .12 + (o.seed || 3)) * 40 - t * (o.vx || 6), -HH * .1 + Math.cos(t * .1) * 30); c.restore();
  }
  let SMK = null;
  function smokeSprites() {
    if (SMK) return SMK; SMK = []; const S = 160;
    for (let v = 0; v < 4; v++) {
      const c = mk(S, S), x = c.getContext('2d'), im = x.createImageData(S, S), d = im.data;
      for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
        const dx = (i - S / 2) / (S / 2), dy = (j - S / 2) / (S / 2), r = Math.sqrt(dx * dx + dy * dy), m = Math.max(0, 1 - r);
        const n = fbm(i / 34 + v * 11.3, j / 34 + v * 7.1, 4), a = cl(Math.pow(m, 1.5) * (n * 2 - .5)) * 255, p = (j * S + i) * 4;
        d[p] = d[p + 1] = d[p + 2] = 255; d[p + 3] = a;
      }
      x.putImageData(im, 0, 0); SMK.push(c);
    }
    return SMK;
  }
  const SMT = {};
  function smokeT(col) {   // те же клубы, но своего цвета (дым заводов, цветной пар)
    if (SMT[col]) return SMT[col];
    return SMT[col] = smokeSprites().map(s => { const c = mk(s.width, s.height), x = c.getContext('2d'); x.drawImage(s, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, c.width, c.height); return c });
  }
  // дым / пар: источник (x, y); o: n, life, rise, sway, drift, spread, r0, r1, a, seed, col, op, from
  function smoke(c, t, x, y, o = {}) {
    const S = o.col ? smokeT(o.col) : smokeSprites(), n = o.n || 24, life = o.life || 4, seed = o.seed || 1;
    c.save(); c.globalCompositeOperation = o.op || 'screen';
    for (let i = 0; i < n; i++) {
      const age = (((t + (o.t0 || 0)) / life + H1(seed + i * 1.37)) % 1 + 1) % 1;
      if (o.from != null && t - o.from < age * life) continue;
      const rise = (o.rise || 420) * Math.pow(age, .85);
      const sway = n1(i * 3.7 + t * .35 + seed) * (o.sway || 40) * age + (o.drift || 0) * age * age;
      const px = x + sway + (H1(seed + i * 9.1) - .5) * (o.spread || 20) * (1 + age * 2), py = y - rise;
      const r = lp(o.r0 || 30, o.r1 || 180, Math.pow(age, .8)), a = (o.a ?? .5) * Math.pow(Math.sin(Math.PI * Math.min(1, age * 1.12)), 1.3);
      if (a <= .003) continue;
      c.globalAlpha = a; c.save(); c.translate(px, py); c.rotate(H1(seed + i) * TAU + t * .15 * (H1(i * 2.3) - .5)); c.drawImage(S[i % 4], -r, -r, 2 * r, 2 * r); c.restore();
    }
    c.restore();
  }
  function noiseTex(k, w, h, sc, oct, lo = 0, hi = 1) {
    return cache('nz' + k, w, h, (x, W, H) => { const im = x.createImageData(W, H), d = im.data; for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = lp(lo, hi, fbm(i / sc + 3.3, j / sc + 7.7, oct)), p = (j * W + i) * 4; d[p] = d[p + 1] = d[p + 2] = v * 255; d[p + 3] = 255 } x.putImageData(im, 0, 0) });
  }

  // ================= фон и камера =================
  // фон плана: вертикальный градиент + свечения + боке + пылинки (как у референсов: тьма, одно цветное пятно за предметом)
  function bg(c, t, o = {}) {
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, o.top || '#060a14'], [1, o.bot || '#020308']]); c.fillRect(0, 0, WW, HH);
    for (const g of o.glows || []) glow(c, g[0], g[1], g[2], g[3] || g[2], g[4], g[5] ?? 1);
    if (o.bk) bokehL(c, t, o.bk[0], o.bk[1], o.bk[2] || {});
  }
  // камера: медленный наезд на точку (fx, fy) — s0 → s1 за d секунд, плюс лёгкий дрейф
  function cam(c, u, o = {}) {
    const d = o.d || 3, k = ss(0, 1, u / d) * .5 + cl(u / d) * .5, s = lp(o.s0 ?? 1, o.s1 ?? 1.06, k);
    const fx = o.fx ?? WW / 2, fy = o.fy ?? HH * .42;
    c.translate(fx + (o.dx || 0) * k, fy + (o.dy || 0) * k); if (o.r) c.rotate(o.r * k); c.scale(s, s); c.translate(-fx, -fy);
  }

  // штамп: резиновый оттиск с неровной краской; бьёт 2,2 → 1 за 0,16 с, волна от удара
  function stampImg(s, col, sz) {
    return cache(`st|${s}|${col}|${sz}`, tw(X, s, { f: 'O', w: 700, s: sz, ls: 8 }) + 120, sz * 1.75 + 40, (x, W, H) => {
      const w = W - 40, h = H - 40; x.translate(20, 20);
      x.strokeStyle = col; x.lineWidth = 10; rr(x, 0, 0, w, h, 14); x.stroke(); x.lineWidth = 3.5; rr(x, 14, 14, w - 28, h - 28, 7); x.stroke();
      font(x, { f: 'O', w: 700, s: sz, ls: 8 }); x.fillStyle = col; x.textAlign = 'center'; x.fillText(s, w / 2, h / 2 + sz * .36);
      x.setTransform(1, 0, 0, 1, 0, 0);
      const n = noiseTex('ink', 256, 256, 7, 4), m = mk(W, H), y = m.getContext('2d'); for (let yy = 0; yy < H; yy += 256) for (let xx = 0; xx < W; xx += 256) y.drawImage(n, xx, yy);
      const im = x.getImageData(0, 0, W, H), d = im.data, nm = y.getImageData(0, 0, W, H).data;
      for (let i = 3; i < d.length; i += 4) { const v = nm[i - 1] / 255; d[i] = d[i] * cl((v - .28) * 2.6) }   // краска ложится неровно
      x.putImageData(im, 0, 0);
    });
  }
  function stamp(c, s, x, y, rot, t, t0, col = C.red, sz = 70, o = {}) {
    const k = cl((t - t0 + .16) / .16); if (k <= 0) return;
    const im = stampImg(s, col, sz), sc = lp(2.2, 1, k * k) * (o.sc || 1);
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc); c.globalAlpha *= cl(k * 3) * (o.a ?? .95);
    if (o.op) c.globalCompositeOperation = o.op; c.drawImage(im, -im.width / 2, -im.height / 2); c.restore();
    const pk = (t - t0) / .45; if (pk > 0 && pk < 1 && o.ring !== false) { c.save(); c.strokeStyle = col; c.globalAlpha = (1 - pk) * .8; c.lineWidth = 10 * (1 - pk); c.beginPath(); c.arc(x, y, 90 + pk * 380, 0, TAU); c.stroke(); c.restore() }
  }
  function shake(t) { for (const h of HITS) if (t >= h && t < h + .22) { const k = 1 - (t - h) / .22, f = Math.floor(t * 60); return [(H1(f) - .5) * 26 * k, (H1(f + 7) - .5) * 26 * k] } return [0, 0] }
  // лист бумаги: центр (0, 0), w × h; фактура, края темнее, тень; draw — содержимое в координатах листа (0..w, 0..h)
  function paperTex(w, h, key, base = C.paper) {
    return cache('pp' + key, w, h, (x, W, H) => {
      x.fillStyle = base; x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = 'multiply'; x.globalAlpha = .16; const n = noiseTex('pap', 512, 512, 3, 3, .55, 1); for (let yy = 0; yy < H; yy += 512) for (let xx = 0; xx < W; xx += 512) x.drawImage(n, xx, yy);
      x.globalAlpha = .1; const n2 = noiseTex('pap2', 256, 256, 40, 3, .4, 1); x.drawImage(n2, 0, 0, W, H);
      x.globalAlpha = 1; x.fillStyle = rg(x, W * .45, H * .4, Math.min(W, H) * .3, Math.max(W, H) * .78, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(90,70,40,.35)']]); x.fillRect(0, 0, W, H);
    });
  }
  function sheet(c, w, h, key, draw, o = {}) {
    c.save();
    shadowE(c, 18, h * .52, w * .62, 60, .55 * (o.sa ?? 1)); c.fillStyle = 'rgba(0,0,0,.45)'; c.filter = 'blur(22px)'; c.fillRect(-w / 2 + 16, -h / 2 + 26, w, h); c.filter = 'none';
    c.drawImage(paperTex(w, h, key, o.base), -w / 2, -h / 2);
    c.translate(-w / 2, -h / 2); if (draw) draw(c);
    c.globalCompositeOperation = 'multiply'; c.fillStyle = lg(c, 0, 0, w, h, [[0, 'rgba(255,255,255,1)'], [.6, 'rgba(255,255,255,1)'], [1, 'rgba(200,190,170,1)']]); c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = 'source-over'; c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1.5; c.strokeRect(.75, .75, w - 1.5, h - 1.5);
    c.restore();
  }

  // ================= монтаж: план = функция от времени; переходы =================
  const TRD = { cut: 0, blur: .42, punch: .3, flash: .38, whip: .36, dip: .5, white: .7, burn: .62 };
  function shotAt(t) { let i = 0; while (i < SH.length - 1 && t >= SH[i + 1].a) i++; return i }
  function drawShot(c, sh, t) { c.save(); c.fillStyle = '#05070c'; c.fillRect(0, 0, WW, HH); sh.f(c, t, t - sh.a, sh); c.restore() }
  // «прогорание» как у референса (кубики → колонны): рваный край с оранжевым свечением съедает старый план
  let BRN = null, BRM = null, BRE = null, BRT = null;
  function burnMask(k) {
    const w = 216, h = 384;
    if (!BRN) { BRN = new Float32Array(w * h); for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) BRN[j * w + i] = fbm(i / 22 + 4.1, j / 22 + 1.7, 4); BRM = mk(w, h); BRE = mk(w, h); BRT = mk(WW, HH) }
    const th = lp(-.25, 1.25, k), mx = BRM.getContext('2d'), ex = BRE.getContext('2d'), mi = mx.createImageData(w, h), ei = ex.createImageData(w, h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const g = (i / w) * .55 + (1 - j / h) * .45, v = g * .62 + BRN[j * w + i] * .38, p = (j * w + i) * 4, d = v - th;
      mi.data[p + 3] = d > 0 ? 255 : 0;                                        // 255 — старый план ещё виден
      const e = Math.max(0, 1 - Math.abs(d) / .035); ei.data[p] = 255; ei.data[p + 1] = 150; ei.data[p + 2] = 60; ei.data[p + 3] = e * 255;
    }
    mx.putImageData(mi, 0, 0); ex.putImageData(ei, 0, 0);
  }
  function composite(c, p, n, k, kind, t) {
    const a = A.getContext('2d'), b = B.getContext('2d');
    if (kind === 'blur') {
      drawShot(a, p, t); drawShot(b, n, t); const b1 = 22 * Math.sin(Math.PI * Math.min(k, .5)), b2 = 22 * Math.sin(Math.PI * Math.max(k, .5));
      c.filter = b1 > .3 ? `blur(${b1.toFixed(1)}px)` : 'none'; c.drawImage(A, 0, 0);
      c.globalAlpha = ss(.2, .8, k); c.filter = b2 > .3 ? `blur(${b2.toFixed(1)}px)` : 'none'; c.drawImage(B, 0, 0); c.globalAlpha = 1; c.filter = 'none';
    } else if (kind === 'punch') {
      if (k < .5) { const e = ei(k * 2); drawShot(a, p, t); c.save(); c.translate(WW / 2, HH * .42); c.scale(1 + .3 * e, 1 + .3 * e); c.translate(-WW / 2, -HH * .42); c.filter = `blur(${(10 * e).toFixed(1)}px)`; c.drawImage(A, 0, 0); c.restore() }
      else { const e = eo((k - .5) * 2); drawShot(b, n, t); c.save(); c.translate(WW / 2, HH * .42); c.scale(1.14 - .14 * e, 1.14 - .14 * e); c.translate(-WW / 2, -HH * .42); c.filter = `blur(${(8 * (1 - e)).toFixed(1)}px)`; c.drawImage(B, 0, 0); c.restore() }
      c.filter = 'none';
    } else if (kind === 'flash') {
      drawShot(c, k < .5 ? p : n, t); c.fillStyle = `rgba(255,246,236,${Math.pow(Math.max(0, 1 - Math.abs(k - .5) * 2), 1.6).toFixed(3)})`; c.fillRect(0, 0, WW, HH);
    } else if (kind === 'dip') {
      drawShot(c, k < .5 ? p : n, t); c.fillStyle = `rgba(0,0,0,${Math.pow(Math.max(0, 1 - Math.abs(k - .5) * 2), .8).toFixed(3)})`; c.fillRect(0, 0, WW, HH);
    } else if (kind === 'white') {   // пар / пыль заливает кадр, из белого — новый план
      drawShot(c, k < .5 ? p : n, t); const w = Math.pow(Math.max(0, 1 - Math.abs(k - .5) * 2), .7);
      c.fillStyle = rgba('#f4ece2', w * .96); c.fillRect(0, 0, WW, HH);
    } else if (kind === 'whip') {
      const e = eio(k); drawShot(a, p, t); drawShot(b, n, t); c.filter = `blur(${(18 * Math.sin(Math.PI * k)).toFixed(1)}px)`;
      c.drawImage(A, -WW * e, 0); c.drawImage(B, WW * (1 - e), 0); c.filter = 'none';
    } else if (kind === 'burn') {
      drawShot(c, n, t); drawShot(a, p, t); burnMask(k);
      const T = BRT.getContext('2d'); T.globalCompositeOperation = 'copy'; T.imageSmoothingEnabled = true; T.drawImage(BRM, 0, 0, WW, HH);
      T.globalCompositeOperation = 'source-in'; T.drawImage(A, 0, 0); T.globalCompositeOperation = 'source-over';
      c.drawImage(BRT, 0, 0);
      c.save(); c.globalCompositeOperation = 'screen'; c.filter = 'blur(6px)'; c.drawImage(BRE, 0, 0, WW, HH); c.filter = 'blur(26px)'; c.globalAlpha = .9; c.drawImage(BRE, 0, 0, WW, HH); c.restore();
    }
  }

  // ================= HUD — как у ролика про Александра =================
  const ORANGE = '#ff8a3d';
  const hms = s => { s = Math.max(0, Math.floor(s)); return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(v => String(v).padStart(2, '0')).join(':') };
  let CHAP = [], DUR = 106;
  function hudR(c, t) {
    let ch = CHS[0]; for (const h of CHS) if (t >= h.a) ch = h;
    let cp = CHAP[0]; for (const h of CHAP) if (t >= h.a) cp = h;
    c.drawImage(cache('hudBg', WW, HH, (x) => {
      x.fillStyle = lg(x, 0, 0, 0, 260, [[0, 'rgba(0,0,0,.55)'], [1, 'rgba(0,0,0,0)']]); x.fillRect(0, 0, WW, 260);
      x.fillStyle = lg(x, 0, HH - 300, 0, HH, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.62)']]); x.fillRect(0, HH - 300, WW, 300);
      // уголки
      x.strokeStyle = 'rgba(205,214,228,.42)'; x.lineWidth = 2; const L = 26, xl = 56, xr = WW - 56, yt = 98, yb = HH - 52;
      x.beginPath(); x.moveTo(xl, yt + L); x.lineTo(xl, yt); x.lineTo(xl + L, yt); x.moveTo(xr - L, yt); x.lineTo(xr, yt); x.lineTo(xr, yt + L);
      x.moveTo(xl, yb - L); x.lineTo(xl, yb); x.lineTo(xl + L, yb); x.moveTo(xr - L, yb); x.lineTo(xr, yb); x.lineTo(xr, yb - L); x.stroke();
    }), 0, 0);
    const k = ch.inst ? 1 : eo((t - ch.a) / .35);
    c.save(); c.textBaseline = 'alphabetic';
    // слева сверху: ● ТЕМА · МЕСТО
    const y = 150, x0 = 74, bl = .5 + .5 * Math.sin(t * 4.4);
    c.fillStyle = `rgba(255,70,52,${.6 + .4 * bl})`; c.beginPath(); c.arc(x0, y - 6, 5, 0, TAU); c.fill();
    font(c, { f: 'J', w: 500, s: 17, ls: 2.6 }); c.textAlign = 'left';
    const a = ch.topic + ' · '; c.globalAlpha = .4 + .6 * k; c.fillStyle = 'rgba(196,204,218,.72)'; c.fillText(a, x0 + 16, y);
    c.fillStyle = ORANGE; c.fillText(typed(ch.place, k * 1.5), x0 + 16 + c.measureText(a).width, y); c.globalAlpha = 1;
    // справа сверху: год
    font(c, { f: 'J', w: 500, s: 40, ls: 3 }); c.textAlign = 'right'; c.fillStyle = 'rgba(236,240,247,.94)';
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 10; c.fillText(ch.year(t), WW - 68, 162); c.shadowBlur = 0;
    // снизу: глава, тайм-код, полоса
    const yb = 1812, xa = 94, xb = WW - 94, p = cl(t / DUR);
    font(c, { f: 'J', w: 500, s: 16, ls: 2.4 }); c.textAlign = 'left'; c.fillStyle = 'rgba(196,204,218,.62)';
    c.fillText(String(cp.n).padStart(2, '0') + ' / 09 · ' + cp.name, xa, yb);
    c.textAlign = 'right'; c.fillStyle = 'rgba(196,204,218,.5)'; c.fillText(hms(t * 60 + 41), xb, yb);
    const ly = 1846; c.fillStyle = 'rgba(200,210,225,.22)'; c.fillRect(xa, ly - 1, xb - xa, 2);
    c.fillStyle = rgba(ORANGE, .85); c.fillRect(xa, ly - 1, (xb - xa) * p, 2);
    for (const h of CHAP) { const xx = xa + (xb - xa) * cl(h.a / DUR); c.fillStyle = h.a <= t ? rgba(ORANGE, .8) : 'rgba(200,210,225,.38)'; c.fillRect(xx - 1, ly - 7, 2, 7) }
    for (let i = 1; i < 30; i++) { const xx = xa + (xb - xa) * i / 30; c.fillStyle = 'rgba(200,210,225,.16)'; c.fillRect(xx - .5, ly - 3, 1, 3) }
    const dx = xa + (xb - xa) * p; c.save(); c.translate(dx, ly); c.rotate(Math.PI / 4); c.fillStyle = ORANGE; c.shadowColor = ORANGE; c.shadowBlur = 12; c.fillRect(-6, -6, 12, 12); c.restore();
    c.restore();
  }

  // ================= субтитры — как у референса =================
  // Oswald 700, по 1–3 слова в строку, по центру; сказанные — белые, ещё не сказанные — серо-синие; главное слово — оранжевое
  const CAPF = 86, CAPW = 860;
  const KEYW = new Set(['одноразках', 'замена', 'безобидным', 'манго', 'мяты', 'жидкость', 'гиганты', 'пятьдесят', '1973', 'рейнольдс', 'camel', 'winston', 'секретный',
    'прямо', 'молодёжного', 'рынка', 'проблема', 'едкий', 'горло', 'кислотой', 'соль', 'мягко', 'убойной', 'архив', '1998', 'суд', 'тайны', 'четырнадцать', 'миллионов',
    'калифорнии', 'соседству', 'стэнфордским', 'студента', 'флешку', 'оживает', 'пачку', 'остановки', 'быстрее', 'четвёртый', 'треть', 'тринадцать', 'мальборо',
    'идеально', 'затянуться', 'продадут', 'люди', 'youtube', 'точно']);
  let CAPS = [];
  const capWord = d => d.replace(/[,.:;…]+$/g, '').replace(/[,.:;…](?=»)/g, '').toUpperCase();
  const bareW = d => d.toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
  function buildCaps(tl) {
    const W = tl.sent.flatMap(s => s.words.map((w, i) => ({ ...w, end: i === s.words.length - 1 }))), out = []; let cur = [];
    const c = X; font(c, { f: 'O', w: 700, s: CAPF, ls: .5 });
    const wd = w => c.measureText(capWord(w.d) + ' ').width;
    const lay2 = ws => { const L = [[]]; let x = 0; for (const w of ws) { const ww = wd(w); if (x + ww > CAPW && L[L.length - 1].length) { L.push([]); x = 0 } L[L.length - 1].push(w); x += ww } return L };
    const FW = new Set(['с', 'со', 'в', 'во', 'и', 'а', 'на', 'по', 'за', 'но', 'к', 'ко', 'о', 'об', 'от', 'до', 'из', 'у', 'для', 'при', 'без', 'под', 'над', 'что', 'как', 'не', 'ни', 'ещё', 'же', 'это', 'эту', 'эти', 'та', 'те', 'ли']);
    const flush = () => { const carry = []; while (cur.length > 1 && FW.has(bareW(cur[cur.length - 1].d)) && !/[?!.:,»]$/.test(cur[cur.length - 1].d)) carry.unshift(cur.pop()); if (cur.length) out.push({ ws: cur, lines: lay2(cur) }); cur = carry };
    const BRK = new Set(['внутри', 'изобрели', 'табачные', 'ещё', 'camel', 'которая', 'даже', 'опубликовали', 'прямо', 'где', 'похожую', 'школьники', 'тянули', 'без', 'каждый', 'выкупил',
      'производитель', 'смотрите', 'заливать', 'было', 'спрятали', 'раскрыть', 'находят', 'оживает', 'та', 'целую', 'подсаживались']);
    W.forEach((w, i) => {
      const nx = W[i + 1];
      if (cur.length && (BRK.has(bareW(w.d)) || lay2([...cur, w]).length > (cur.length >= 2 ? 1 : 2) || cur.length >= 3 || w.a - cur[cur.length - 1].b > .38)) flush();
      cur.push(w);
      if (w.end || /[?!.:»,]$/.test(w.d) || (nx && nx.a - w.b > .38)) flush();
    });
    flush();
    for (let i = out.length - 2; i >= 0; i--) { const a = out[i], b = out[i + 1]; if (a.ws.length === 1 && FW.has(bareW(a.ws[0].d)) && b.ws[0].a - a.ws[0].b < .5) { b.ws.unshift(a.ws[0]); b.lines = lay2(b.ws); out.splice(i, 1) } }
    out.forEach(ch => { ch.a = ch.ws[0].a });
    out.forEach((ch, i) => { const nx = out[i + 1], e = ch.ws[ch.ws.length - 1].b; ch.e = nx ? Math.min(nx.a - .02, e + .5) : e + .6 });
    CAPS = out;
  }
  let NOCAP = () => false, CAPSKIP = null;   // CAPSKIP — субтитры пропущенной в пробе середины не показываем
  function capsR(c, t, cy) {
    const ch = CAPS.find(x => t >= x.a - .06 && t < x.e); if (!ch || NOCAP(t) || (CAPSKIP && ch.a > CAPSKIP[0] && ch.a < CAPSKIP[1])) return;
    const k = eo((t - ch.a + .06) / .1), lh = CAPF * 1.02, y0 = cy - (ch.lines.length - 1) * lh / 2 + CAPF * .37;
    c.save(); font(c, { f: 'O', w: 700, s: CAPF, ls: .5 }); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
    ch.lines.forEach((ln, j) => {
      const ws = ln.map(w => capWord(w.d)), sp = c.measureText(' ').width * .9, W = ws.reduce((s, x) => s + c.measureText(x).width, 0) + sp * (ws.length - 1);
      let x = WW / 2 - W / 2; const y = y0 + j * lh + (1 - k) * 10;
      ln.forEach((w, i) => {
        const s = ws[i], ww = c.measureText(s).width, on = t >= w.a - .04, key = KEYW.has(bareW(w.d)), pk = cl((t - w.a + .04) / .16), sc = on && key ? 1 + .06 * (1 - eo(pk)) : 1;
        c.save(); c.translate(x + ww / 2, y - CAPF * .37); c.scale(sc, sc); c.translate(-(x + ww / 2), -(y - CAPF * .37));
        c.globalAlpha = k * (on ? 1 : .5);
        c.shadowColor = 'rgba(0,0,0,.85)'; c.shadowBlur = 16; c.shadowOffsetY = 5;
        c.strokeStyle = 'rgba(10,8,14,.55)'; c.lineWidth = 7; c.strokeText(s, x, y); c.shadowBlur = 0; c.shadowOffsetY = 0;
        c.fillStyle = key && on ? ORANGE : on ? '#ffffff' : '#9aa6bd'; c.fillText(s, x, y); c.restore();
        x += ww + sp;
      });
    });
    c.restore();
  }
  // ================= свет и цвет кадра: свечение ярких мест, контраст, сильная виньетка =================
  let BLS = null;
  function bloomR(c, amt = .38) {
    const w = 135, h = 240; if (!BLS) BLS = mk(w, h); const b = BLS.getContext('2d', { willReadFrequently: true });
    b.globalCompositeOperation = 'copy'; b.drawImage(c.canvas, 0, 0, w, h); const im = b.getImageData(0, 0, w, h), d = im.data;
    for (let i = 0; i < d.length; i += 4) { const l = (d[i] * .3 + d[i + 1] * .55 + d[i + 2] * .15) / 255, m = cl((l - .58) / .3); d[i] *= m; d[i + 1] *= m; d[i + 2] *= m }
    b.putImageData(im, 0, 0);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'screen'; c.globalAlpha = amt; c.filter = 'blur(26px)'; c.drawImage(BLS, 0, 0, WW, HH); c.globalAlpha = amt * .7; c.filter = 'blur(70px)'; c.drawImage(BLS, 0, 0, WW, HH); c.restore();
  }
  function vignetteR(c) {
    c.drawImage(cache('vig9', WW, HH, (x) => {
      x.fillStyle = rg(x, WW / 2, HH * .46, HH * .2, HH * .72, [[0, 'rgba(0,0,0,0)'], [.5, 'rgba(0,0,0,.18)'], [1, 'rgba(0,0,0,.86)']]); x.fillRect(0, 0, WW, HH);
      x.fillStyle = lg(x, 0, 0, 150, 0, [[0, 'rgba(0,0,0,.6)'], [1, 'rgba(0,0,0,0)']]); x.fillRect(0, 0, 150, HH);
      x.fillStyle = lg(x, WW, 0, WW - 150, 0, [[0, 'rgba(0,0,0,.6)'], [1, 'rgba(0,0,0,0)']]); x.fillRect(WW - 150, 0, 150, HH);
    }), 0, 0);
  }
  let GR = null;
  function gradeR(c) {
    if (!GR) GR = mk(WW, HH); const g = GR.getContext('2d'); g.globalCompositeOperation = 'copy'; g.drawImage(c.canvas, 0, 0);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'copy'; c.filter = 'contrast(1.06) saturate(1.12)'; c.drawImage(GR, 0, 0); c.restore(); c.filter = 'none';
  }
  function capY(t) { const i = shotAt(t), sh = SH[i]; return sh.cy || 1210 }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none';
    const i = shotAt(t), sh = SH[i], nx = SH[i + 1]; let tr = null;
    if (nx && nx.tr !== 'cut' && t >= nx.a - TRD[nx.tr] / 2) tr = [sh, nx, (t - (nx.a - TRD[nx.tr] / 2)) / TRD[nx.tr], nx.tr];
    else if (i > 0 && sh.tr !== 'cut' && t < sh.a + TRD[sh.tr] / 2) tr = [SH[i - 1], sh, (t - (sh.a - TRD[sh.tr] / 2)) / TRD[sh.tr], sh.tr];
    const [dx, dy] = shake(t);
    c.save(); c.translate(dx, dy);
    if (tr) composite(c, tr[0], tr[1], cl(tr[2]), tr[3], t); else drawShot(c, sh, t);
    c.restore();
    bloomR(c, sh.bloom ?? .38); gradeR(c); vignetteR(c); hudR(c, t); capsR(c, t, capY(t));
  }

  // ================= набор для сцен (как у референса) =================
  function skyG(c, st, y0 = 0, y1 = HH) { c.fillStyle = lg(c, 0, y0, 0, y1, st); c.fillRect(-200, -200, WW + 400, HH + 400) }
  // солнце / луна: диск и свечение слоями
  function sunD(c, x, y, r, col = '#fff3cf', gcol = '#ffae55', a = 1) {
    glow(c, x, y, r * 8, r * 8, gcol, .5 * a); glow(c, x, y, r * 3.2, r * 3.2, gcol, .75 * a);
    c.save(); c.globalAlpha *= a; c.fillStyle = rg(c, x, y, r * .78, r * 1.06, [[0, col], [1, rgba(col, 0)]]); c.beginPath(); c.arc(x, y, r * 1.06, 0, TAU); c.fill(); c.restore();
  }
  // лучи от источника (как у пирамид и всадника у референса)
  function rays(c, x, y, o = {}) {
    const n = o.n || 9, len = o.len || 1700, col = o.col || '#ffd9a0', W0 = 400, H0 = 1600;
    const sp = cache('ray|' + col, W0, H0, (x2, W, H) => { const m = mk(W, H), q = m.getContext('2d'); q.fillStyle = lg(q, 0, 0, 0, H, [[0, rgba(col, .55)], [.35, rgba(col, .2)], [1, rgba(col, 0)]]); q.beginPath(); q.moveTo(W / 2 - 4, 0); q.lineTo(W / 2 + 4, 0); q.lineTo(W * .96, H); q.lineTo(W * .04, H); q.closePath(); q.fill(); x2.filter = 'blur(20px)'; x2.drawImage(m, 0, 0) });
    const base = Math.atan(W0 * .46 / H0);
    c.save(); c.translate(x, y); c.globalCompositeOperation = 'screen';
    for (let i = 0; i < n; i++) {
      const ang = (o.a0 ?? 0) + (o.span ?? TAU) * (i + .5) / n + (o.rot || 0) + Math.sin((o.t || 0) * .25 + i * 1.7) * .015;
      const w = (o.w || .07) * (.5 + H1(i * 3.7 + (o.seed || 0))), L = len * (.55 + .6 * H1(i * 5.1 + (o.seed || 0)));
      c.save(); c.rotate(ang - Math.PI / 2); c.scale(Math.tan(w) / Math.tan(base), L / H0);
      c.globalAlpha = (o.a ?? .5) * (.55 + .45 * Math.sin((o.t || 0) * .6 + i * 2.1)); c.drawImage(sp, -W0 / 2, 0); c.restore();
    }
    c.restore();
  }
  function hazeB(c, y, h, col, a) { if (a <= 0) return; c.fillStyle = lg(c, 0, y - h, 0, y + h, [[0, rgba(col, 0)], [.5, rgba(col, a)], [1, rgba(col, 0)]]); c.fillRect(-100, y - h, WW + 200, 2 * h) }
  // длинные тонкие облака на закате
  function streaks(c, t, y0, y1, n, col, a, seed = 1) {
    c.save(); for (let i = 0; i < n; i++) {
      const rx = 140 + 360 * H1(seed + i * 3.3), ry = 3 + 9 * H1(seed + i * 5.7), y = lp(y0, y1, H1(seed + i * 7.1)), x = ((H1(seed + i * 1.9) * (WW + 600) + t * (6 + 8 * H1(i))) % (WW + 600)) - 300;
      c.globalAlpha = a * (.4 + .6 * H1(seed + i * 9.3)); c.save(); c.translate(x, y); c.scale(1, ry / rx);
      c.fillStyle = rg(c, 0, 0, 0, rx, [[0, rgba(col, 1)], [.6, rgba(col, .35)], [1, rgba(col, 0)]]); c.beginPath(); c.arc(0, 0, rx, 0, TAU); c.fill(); c.restore();
    } c.restore();
  }
  function birdsF(c, t, n, x0, y0, w, h, col = 'rgba(30,14,26,.75)', seed = 1) {
    c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
    for (let i = 0; i < n; i++) {
      const x = x0 + ((H1(seed + i) * w + t * (22 + 26 * H1(i * 3))) % w), y = y0 + H1(seed + i * 7) * h + Math.sin(t * 1.6 + i) * 5, s = 7 + 7 * H1(i * 9 + seed), f = Math.sin(t * 9 + i * 2.3);
      c.lineWidth = 2 + s * .12; c.beginPath(); c.moveTo(x - s, y - s * .45 * f); c.quadraticCurveTo(x - s * .45, y - s * .15, x, y); c.quadraticCurveTo(x + s * .45, y - s * .15, x + s, y - s * .45 * f); c.stroke();
    } c.restore();
  }
  // гряда / дюны
  function ridge(c, y, amp, col, seed = 1, sc = 300, x0 = -100, x1 = WW + 100) {
    c.fillStyle = col; c.beginPath(); c.moveTo(x0, HH + 300); for (let x = x0; x <= x1; x += 16) c.lineTo(x, y - amp * (n1(x / sc + seed) * .5 + .5)); c.lineTo(x1, HH + 300); c.closePath(); c.fill();
  }
  // город: силуэты зданий с окнами (кэш)
  function skylineImg(key, W, H, o) {
    return cache('skl|' + key, W, H, (x) => {
      let xx = -20, i = 0; const s = o.seed || 1;
      while (xx < W) {
        const bw = (o.bw0 || 46) + H1(s + i * 3.1) * (o.bw1 || 110), bh = H * ((o.h0 ?? .22) + Math.pow(H1(s + i * 7.7), 1.6) * ((o.h1 ?? .95) - (o.h0 ?? .22)));
        x.fillStyle = o.col; x.fillRect(xx, H - bh, bw, bh + 2);
        if (H1(i * 5.3 + s) > .55) x.fillRect(xx + bw * .2, H - bh - bh * .07, bw * .6, bh * .07 + 1);
        if (H1(i * 9.1 + s) > .75) x.fillRect(xx + bw * .47, H - bh - bh * .22, 3, bh * .22);
        if (o.win) { const cs = 13, rs = 21, nc = Math.floor((bw - 8) / cs), nr = Math.floor((bh - 10) / rs);
          for (let r = 1; r < nr; r++) for (let q = 0; q < nc; q++) { const v = H2(i * 31 + r + s, q * 17 + s); if (v > (o.wd ?? .74)) { x.fillStyle = rgba(v > .93 && o.win2 ? o.win2 : o.win, .3 + .6 * H2(r + i, q * 3 + s)); x.fillRect(xx + 6 + q * cs, H - bh + r * rs, 6, 9) } } }
        xx += bw + (o.gap ?? 3); i++;
      }
    });
  }
  // силуэт с контровым светом: path рисуется заливкой, по краю — светлая кромка со стороны источника
  function rimFill(c, p, fill, rim, dx = -7, dy = 0, w = 1) {
    c.save(); c.fillStyle = fill; c.fill(p); c.clip(p);
    c.translate(dx, dy); c.globalCompositeOperation = 'source-atop'; c.strokeStyle = rim; c.lineWidth = 2 * Math.abs(dx || dy) * w + 3; c.shadowColor = rim; c.shadowBlur = 14; c.stroke(p);
    c.restore();
  }
  // подросток в худи со спины (низ кадра), s — высота до макушки; rim — цвет кромки справа
  const TEENP = (() => {
    const p = new Path2D();
    p.moveTo(-.52, .05); p.bezierCurveTo(-.52, -.25, -.51, -.45, -.46, -.53); p.bezierCurveTo(-.4, -.61, -.26, -.63, -.17, -.665);
    p.bezierCurveTo(-.215, -.78, -.2, -.95, -.07, -.995); p.bezierCurveTo(-.02, -1.01, .03, -1.01, .075, -.995); p.bezierCurveTo(.205, -.95, .22, -.78, .175, -.665);
    p.bezierCurveTo(.265, -.63, .4, -.61, .465, -.53); p.bezierCurveTo(.515, -.45, .525, -.25, .525, .05); p.closePath(); return p;
  })();
  function teenBack(c, s, o = {}) {
    c.save(); c.scale(s, s); c.lineWidth = 1 / s;
    c.fillStyle = 'rgba(0,0,0,.35)'; c.filter = 'blur(6px)'; c.fill(TEENP); c.filter = 'none';
    c.fillStyle = lg(c, -.5, -1, .5, 0, [[0, o.c1 || '#262838'], [1, o.c2 || '#11121b']]); c.fill(TEENP);
    c.save(); c.clip(TEENP);
    // складки и шов капюшона
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = .012; c.beginPath(); c.moveTo(.005, -1.0); c.bezierCurveTo(.0, -.86, .01, -.74, .0, -.64); c.stroke();
    c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.moveTo(-.18, -.64); c.quadraticCurveTo(.0, -.57, .18, -.64); c.quadraticCurveTo(.0, -.53, -.18, -.64); c.fill();
    c.fillStyle = lg(c, 0, -1, 0, 0, [[0, 'rgba(255,255,255,.07)'], [.4, 'rgba(255,255,255,0)'], [1, 'rgba(0,0,0,.35)']]); c.fillRect(-.6, -1.1, 1.2, 1.2);
    // контровой свет справа и сверху
    c.globalCompositeOperation = 'screen';
    c.translate(-.014, .01); c.strokeStyle = rgba(o.rim || '#ff7ab8', .95); c.lineWidth = .014; c.shadowColor = o.rim || '#ff7ab8'; c.shadowBlur = 12; c.stroke(TEENP);
    c.translate(.028, 0); c.strokeStyle = rgba(o.rim2 || '#ffb46b', .7); c.lineWidth = .012; c.shadowColor = o.rim2 || '#ffb46b'; c.stroke(TEENP); c.translate(-.014, 0); c.shadowBlur = 0;
    c.translate(0, -.01); c.fillStyle = lg(c, .55, 0, .2, 0, [[0, rgba(o.rim || '#ff7ab8', .32)], [1, rgba(o.rim || '#ff7ab8', 0)]]); c.fillRect(-.6, -1.1, 1.2, 1.2);
    c.fillStyle = lg(c, -.55, 0, -.2, 0, [[0, rgba(o.rim2 || '#ffb46b', .3)], [1, rgba(o.rim2 || '#ffb46b', 0)]]); c.fillRect(-.6, -1.1, 1.2, 1.2);
    c.fillStyle = lg(c, 0, -1.02, 0, -.8, [[0, rgba(o.rim2 || '#ffb46b', .35)], [1, rgba(o.rim2 || '#ffb46b', 0)]]); c.fillRect(-.6, -1.1, 1.2, 1.2);
    c.restore();
    c.restore();
  }
  // человек в костюме со спины (по пояс), s — рост до макушки
  function execBack(c, s, o = {}) {
    c.save(); c.scale(s, s);
    const p = new Path2D(); p.moveTo(-.25, .0); p.lineTo(-.24, -.5); p.bezierCurveTo(-.24, -.66, -.2, -.72, -.08, -.74); p.lineTo(-.06, -.79);
    p.bezierCurveTo(-.11, -.82, -.11, -.97, -.0, -.99); p.bezierCurveTo(.11, -.97, .11, -.82, .06, -.79); p.lineTo(.08, -.74); p.bezierCurveTo(.2, -.72, .24, -.66, .24, -.5); p.lineTo(.25, .0); p.closePath();
    c.fillStyle = o.fill || '#0d1018'; c.fill(p); c.save(); c.clip(p);
    c.fillStyle = 'rgba(255,255,255,.05)'; c.fillRect(-.005, -.74, .01, .74);                 // шов пиджака
    c.fillStyle = o.hair || '#07080c'; c.beginPath(); c.ellipse(0, -.9, .1, .1, 0, Math.PI * 1.05, TAU * 1.0); c.fill();
    c.globalCompositeOperation = 'screen'; c.translate(o.rx ?? -.012, 0); c.strokeStyle = rgba(o.rim || '#8fb6ff', .9); c.lineWidth = .02; c.shadowColor = o.rim || '#8fb6ff'; c.shadowBlur = 14; c.stroke(p);
    c.restore(); c.restore();
  }
  // химик в халате со спины
  function chemBack(c, s, o = {}) {
    c.save(); c.scale(s, s);
    const p = new Path2D(); p.moveTo(-.3, .0); p.bezierCurveTo(-.3, -.3, -.27, -.62, -.12, -.7); p.lineTo(-.06, -.76);
    p.bezierCurveTo(-.12, -.8, -.11, -.97, .0, -.99); p.bezierCurveTo(.11, -.97, .12, -.8, .06, -.76); p.lineTo(.12, -.7); p.bezierCurveTo(.27, -.62, .3, -.3, .3, .0); p.closePath();
    c.fillStyle = o.fill || '#c9d3e0'; c.fill(p); c.save(); c.clip(p);
    c.fillStyle = 'rgba(30,40,60,.25)'; c.fillRect(-.3, -.5, .6, .5); c.fillStyle = o.hair || '#2a2420'; c.beginPath(); c.ellipse(0, -.9, .1, .1, 0, 0, TAU); c.fill();
    c.globalCompositeOperation = 'screen'; c.translate(-.012, 0); c.strokeStyle = rgba(o.rim || '#ffd08a', .8); c.lineWidth = .02; c.stroke(p);
    c.restore(); c.restore();
  }
  // моно-плашка с оранжевой рамкой (как «ДАРИЙ БЕЖИТ», «ПРОГНОЗ: НЕ ПРОТЯНЕТ И ГОДА»)
  function pill(c, s, x, y, k, o = {}) {
    if (k <= 0 || !s) return; const sz = o.s || 19, ls = o.ls ?? 2.6, w = tw(c, s, { f: 'J', w: 700, s: sz, ls }) + (o.px || 26), h = sz * 1.9, al = o.al || 'center';
    const X0 = al === 'center' ? x - w / 2 : al === 'left' ? x : x - w, e = eo(k);
    c.save(); c.globalAlpha *= cl(k * 2.5); c.translate(0, (1 - e) * 10);
    c.fillStyle = o.bg || 'rgba(16,11,9,.86)'; rr(c, X0, y - h / 2, w, h, 4); c.fill();
    c.strokeStyle = o.bc || 'rgba(255,138,61,.85)'; c.lineWidth = 2; rr(c, X0 + 1, y - h / 2 + 1, w - 2, h - 2, 4); c.stroke();
    tx(c, typed(s, k * 1.6), X0 + w / 2, y + sz * .36, { f: 'J', w: 700, s: sz, ls, c: o.c || '#ffd2a6' });
    c.restore();
  }
  // большое золотое число (как «200», «1000», «20» у референса): Rubik 900, тёмная обводка, свечение
  function goldNum(c, s, x, y, size, k, o = {}) {
    if (k <= 0) return; const e = eb(cl(k / .9)), sc = lp(1.35, 1, cl(k / .5)) * (o.sc || 1);
    c.save(); c.translate(x, y); c.scale(sc * (.85 + .15 * e), sc * (.85 + .15 * e)); c.globalAlpha *= cl(k * 3);
    font(c, { f: 'R', w: 900, s: size, ls: o.ls ?? 0 }); c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
    c.shadowColor = rgba(o.glow || '#ff7a1a', .75); c.shadowBlur = size * .32; c.strokeStyle = o.st || '#3a1606'; c.lineWidth = size * .085; c.strokeText(s, 0, 0);
    c.shadowBlur = 0; c.fillStyle = lg(c, 0, -size * .74, 0, 0, [[0, '#fffbe6'], [.42, '#ffe08a'], [.78, '#ffb23e'], [1, '#e9862a']]); c.fillText(s, 0, 0);
    c.globalCompositeOperation = 'screen'; c.fillStyle = lg(c, 0, -size * .74, 0, -size * .45, [[0, 'rgba(255,255,255,.55)'], [1, 'rgba(255,255,255,0)']]); c.fillText(s, 0, 0);
    c.restore();
    if (o.sub) pill(c, o.sub, x, y + size * .32, cl((k - .25) / .5), { s: o.ss || 19 });
  }
  // глубина резкости: нарисовать слой на отдельном холсте и положить размытым
  const LY = [];
  function layer(c, i, blur, draw, a = 1) {
    if (blur < .6) { c.save(); c.globalAlpha *= a; draw(c); c.restore(); return }
    if (!LY[i]) LY[i] = mk(WW, HH); const L = LY[i], x = L.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, WW, HH); x.globalAlpha = 1; x.filter = 'none'; x.globalCompositeOperation = 'source-over';
    draw(x); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha *= a; c.filter = `blur(${blur.toFixed(1)}px)`; c.drawImage(L, 0, 0); c.restore();
  }
  // крупные мягкие диски боке поверх кадра (у референса — почти в каждом плане)
  function bokehBig(c, t, seed, cols, a = 1, n = 9) {
    c.save(); c.globalCompositeOperation = 'screen';
    for (let i = 0; i < n; i++) {
      const r = 18 + 70 * Math.pow(H1(seed + i * 2.3), 2), x = (H1(seed + i * 3.7) * WW + Math.sin(t * .2 + i) * 30 + t * 5 * (H1(i) - .5) + WW) % WW, y = (H1(seed + i * 5.9) * HH - t * (4 + 10 * H1(i * 7)) + HH * 4) % HH;
      const col = cols[i % cols.length], al = a * (.08 + .16 * H1(seed + i * 4.1)) * (.7 + .3 * Math.sin(t * .8 + i * 2));
      c.fillStyle = rg(c, x, y, 0, r, [[0, rgba(col, al * .55)], [.78, rgba(col, al)], [.92, rgba(col, al * 1.2)], [1, rgba(col, 0)]]); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    } c.restore();
  }
  // настольная лампа «банкир» (зелёный абажур), свет вниз
  function bankerLamp(c, s, on = 1) {
    c.save(); c.scale(s, s);
    c.fillStyle = lg(c, -.5, 0, .5, 0, [[0, '#6e5418'], [.4, '#e9c46a'], [.6, '#c79a3a'], [1, '#5a4210']]);
    c.beginPath(); c.ellipse(0, 0, .5, .09, 0, 0, TAU); c.fill(); c.fillRect(-.04, -.62, .08, .62);
    c.beginPath(); c.moveTo(-.05, -.62); c.lineTo(.05, -.62); c.lineTo(.05, -.7); c.lineTo(-.05, -.7); c.fill();
    const sh = new Path2D(); sh.moveTo(-.62, -.68); sh.quadraticCurveTo(-.6, -.92, -.3, -.98); sh.lineTo(.3, -.98); sh.quadraticCurveTo(.6, -.92, .62, -.68); sh.closePath();
    c.fillStyle = lg(c, 0, -.98, 0, -.68, [[0, '#0f5a3e'], [.55, '#1f8a5e'], [1, '#0a3d2a']]); c.fill(sh);
    c.save(); c.clip(sh); c.globalCompositeOperation = 'screen'; c.fillStyle = lg(c, -.6, 0, .6, 0, [[0, 'rgba(255,255,255,0)'], [.25, 'rgba(180,255,220,.35)'], [.4, 'rgba(255,255,255,0)']]); c.fillRect(-.7, -1, 1.4, .4); c.restore();
    c.fillStyle = '#d8b25a'; c.fillRect(-.62, -.7, 1.24, .03);
    if (on > 0) { c.fillStyle = rgba('#fff2c8', on); c.beginPath(); c.ellipse(0, -.67, .5, .05, 0, 0, TAU); c.fill() }
    c.restore();
  }
  // мягкий конус света лампы (вниз), вершина (x, y), ширина у основания w на высоте h
  function lampCone(c, x, y, w, h, col = '#ffd9a0', a = .5) {
    if (a <= 0) return; c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha *= a;
    const sp = cache('lc|' + col, 600, 800, (x2, W, H) => { const m = mk(W, H), q = m.getContext('2d'); q.fillStyle = lg(q, 0, 0, 0, H, [[0, rgba(col, .6)], [.5, rgba(col, .22)], [1, rgba(col, 0)]]); q.beginPath(); q.moveTo(W * .28, 0); q.lineTo(W * .72, 0); q.lineTo(W, H); q.lineTo(0, H); q.closePath(); q.fill(); x2.filter = 'blur(22px)'; x2.drawImage(m, 0, 0) });
    c.drawImage(sp, x - w / 2, y, w, h); c.restore();
  }
  // окно с ночным городом: прямоугольник x, y, w, h, переплёт
  function cityWindow(c, t, x, y, w, h, o = {}) {
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    skyG(c, o.sky || [[0, '#070b1c'], [.6, '#16234a'], [1, '#2b3a6a']], y, y + h);
    if (o.moon) sunD(c, x + w * .78, y + h * .2, 26, '#eef4ff', '#8fb2ff', .8);
    c.drawImage(skylineImg('win1' + (o.key || ''), w + 40, h * .62, { col: '#0d1430', win: '#ffd28a', win2: '#9fd0ff', seed: 7, h0: .2, h1: .8, wd: .8 }), x - 20, y + h * .4);
    if (o.tower) o.tower(c, x, y, w, h);
    c.drawImage(skylineImg('win2' + (o.key || ''), w + 40, h * .4, { col: '#060912', win: '#ffcf7a', seed: 21, h0: .3, h1: 1, wd: .86, bw0: 70, bw1: 140 }), x - 20, y + h * .62);
    c.restore();
    c.fillStyle = o.frame || '#1b140f'; const fw = o.fw || 18;
    c.fillRect(x - fw, y - fw, w + 2 * fw, fw); c.fillRect(x - fw, y + h, w + 2 * fw, fw); c.fillRect(x - fw, y, fw, h); c.fillRect(x + w, y, fw, h);
    c.fillRect(x + w / 2 - fw / 3, y, fw * .66, h); c.fillRect(x, y + h * .5 - fw / 3, w, fw * .66);
  }

  // ================= предметы из v16.8 =================
  function vapeBar(c, h, o = {}) {
    const w = h * .3, mpH = h * .17, m0 = w * .8, m1 = w * .56, top = -h, bT = -h + mpH, bH = -bT, R = w * .17;
    const c1 = o.c1 || '#ffc24d', c2 = o.c2 || '#ff7e22', c3 = o.c3 || '#e2441c';
    c.save();
    // мундштук: дымчатый пластик, сужается кверху
    c.beginPath(); c.moveTo(-m0 / 2, bT + R); c.lineTo(-m0 / 2, bT - mpH * .08); c.bezierCurveTo(-m0 / 2, top + mpH * .5, -m1 / 2, top + mpH * .25, -m1 / 2, top + mpH * .14);
    c.quadraticCurveTo(-m1 / 2, top, -m1 / 2 + m1 * .22, top); c.lineTo(m1 / 2 - m1 * .22, top); c.quadraticCurveTo(m1 / 2, top, m1 / 2, top + mpH * .14);
    c.bezierCurveTo(m1 / 2, top + mpH * .25, m0 / 2, top + mpH * .5, m0 / 2, bT - mpH * .08); c.lineTo(m0 / 2, bT + R); c.closePath();
    c.fillStyle = lg(c, -m0 / 2, 0, m0 / 2, 0, [[0, '#040506'], [.1, '#1c1f26'], [.22, '#4e535e'], [.34, '#262930'], [.8, '#0c0d10'], [1, '#33435a']]); c.fill();
    c.fillStyle = lg(c, 0, top, 0, bT, [[0, 'rgba(255,255,255,.18)'], [.5, 'rgba(255,255,255,0)']]); c.fill();
    rr(c, -m1 * .24, top + 7, m1 * .48, 8, 4); c.fillStyle = '#000'; c.fill();
    // корпус: плоская лицевая грань, скруглённые рёбра
    rr(c, -w / 2, bT, w, bH, [R, R, R * .8, R * .8]); c.save(); c.clip();
    c.fillStyle = lg(c, 0, bT, 0, 0, [[0, c1], [.5, c2], [1, c3]]); c.fillRect(-w / 2, bT, w, bH);
    c.globalCompositeOperation = 'multiply';
    c.fillStyle = lg(c, -w / 2, 0, w / 2, 0, [[0, 'rgb(70,60,66)'], [.07, 'rgb(190,178,180)'], [.15, '#ffffff'], [.85, '#ffffff'], [.93, 'rgb(150,138,142)'], [1, 'rgb(52,48,58)']]); c.fillRect(-w / 2, bT, w, bH);
    c.fillStyle = lg(c, 0, bT, 0, 0, [[0, 'rgb(225,220,220)'], [.12, '#ffffff'], [.8, '#ffffff'], [1, 'rgb(150,140,140)']]); c.fillRect(-w / 2, bT, w, bH);
    c.globalCompositeOperation = 'screen';
    c.fillStyle = lg(c, -w / 2, 0, -w / 2 + w * .16, 0, [[0, 'rgba(255,255,255,0)'], [.55, 'rgba(255,255,255,.55)'], [1, 'rgba(255,255,255,0)']]); c.fillRect(-w / 2, bT, w * .16, bH);
    c.fillStyle = lg(c, -w / 2, bT, w / 2, bT + w * 1.6, [[0, 'rgba(255,255,255,.22)'], [.5, 'rgba(255,255,255,.04)'], [1, 'rgba(255,255,255,0)']]); c.fillRect(-w / 2, bT, w, bH);
    c.fillStyle = lg(c, w * .38, 0, w * .5, 0, [[0, 'rgba(140,200,255,0)'], [1, rgba(o.rim || '#9fd0ff', .62)]]); c.fillRect(w * .38, bT, w * .12, bH);
    if (o.glint != null && o.glint > 0 && o.glint < 1) { const gy = lp(bT - h * .25, h * .25, o.glint); c.fillStyle = lg(c, 0, gy - h * .1, 0, gy + h * .1, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,255,255,.5)'], [1, 'rgba(255,255,255,0)']]); c.fillRect(-w / 2, gy - h * .1, w, h * .2) }
    c.restore();
    c.strokeStyle = 'rgba(255,255,255,.22)'; c.lineWidth = 1.5; rr(c, -w / 2 + 1, bT + 1, w - 2, bH - 2, [R, R, R * .8, R * .8]); c.stroke();
    // надпись вдоль корпуса
    if (o.label !== '') { c.save(); c.translate(-w * .04, bT + bH * .44); c.rotate(-Math.PI / 2); tx(c, o.label || 'МАНГО', 0, w * .1, { f: 'O', w: 700, s: w * .3, ls: w * .025, c: 'rgba(255,255,255,.95)', sh: 'rgba(90,25,0,.45)', sb: 6, so: 2 }); tx(c, o.sub || '20 MG', 0, w * .26, { f: 'J', w: 500, s: w * .07, ls: w * .02, c: 'rgba(255,255,255,.75)' }); c.restore() }
    // шов и индикатор
    c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(-w / 2 + 4, -h * .085, w - 8, 2);
    const led = o.led ?? .5, lc = o.ledCol || '#9fe8ff'; rr(c, -w * .16, -h * .052, w * .32, Math.max(5, h * .011), 4); c.fillStyle = rgba(lc, .3 + .7 * Math.min(1, led)); c.fill();
    glowDot(c, 0, -h * .047, w * .85, lc, .55 * led);
    c.restore();
  }
  // отражение на полу: тот же рисунок вверх ногами, гаснет
  function reflect(c, y, a, draw) {
    c.save(); c.translate(0, 2 * y); c.scale(1, -1); c.globalAlpha *= a; draw(); c.restore();
    c.fillStyle = lg(c, 0, y, 0, y + 300, [[0, 'rgba(3,4,8,0)'], [1, 'rgba(3,4,8,1)']]); c.fillRect(-300, y, WW + 600, 700);
  }
  // сигарета: центр (0, 0), вдоль +x длиной L, толщина d; фильтр слева, уголёк справа; o.ash, o.burn (0..1), o.t
  function cigarette(c, L, d, o = {}) {
    const x0 = -L / 2, xf = x0 + L * .3, x1 = L / 2, r = d / 2, t = o.t || 0;
    c.save();
    shadowE(c, 30, d * 1.4, L * .55, d * .7, .45);
    // бумага
    rr(c, xf - 2, -r, x1 - xf + 2, d, [0, r * .3, r * .3, 0]);
    c.fillStyle = lg(c, 0, -r, 0, r, [[0, '#76736e'], [.16, '#ecebe7'], [.42, '#ffffff'], [.72, '#d6d3cc'], [1, '#5f5c57']]); c.fill();
    c.save(); c.clip(); c.globalAlpha = .07; c.fillStyle = '#000'; for (let i = 0; i < 30; i++) c.fillRect(xf + H1(i * 3.3) * (x1 - xf), -r, 1.2, d); c.restore();
    // фильтр
    rr(c, x0, -r, xf - x0, d, [r * .35, 0, 0, r * .35]);
    c.fillStyle = lg(c, 0, -r, 0, r, [[0, '#6e4219'], [.18, '#d8954d'], [.45, '#f4c27f'], [.78, '#bd7731'], [1, '#4f2f10']]); c.fill();
    c.save(); c.clip(); for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(${90 + 60 * H1(i)},${45 + 30 * H1(i * 2)},10,${.35 + .3 * H1(i * 5)})`; c.beginPath(); c.arc(x0 + H1(i * 7.7) * (xf - x0), (H1(i * 3.1) - .5) * d, 1 + 1.6 * H1(i * 9.3), 0, TAU); c.fill() } c.restore();
    c.fillStyle = 'rgba(220,180,90,.85)'; c.fillRect(xf - 6, -r, 2.5, d); c.fillRect(xf - 12, -r, 1.5, d);
    // пепел и уголёк
    const ax = x1, burn = o.burn ?? 1;
    c.fillStyle = lg(c, 0, -r, 0, r, [[0, '#3a3633'], [.4, '#8a847e'], [1, '#2a2725']]); rr(c, ax - d * .55, -r, d * .55, d, [0, r * .5, r * .5, 0]); c.fill();
    const fl = .75 + .25 * Math.sin(t * 9) * Math.sin(t * 3.7);
    c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = rg(c, ax - d * .2, 0, 0, d * .9, [[0, `rgba(255,${190 + 40 * fl | 0},120,${.95 * burn})`], [.35, `rgba(255,90,30,${.8 * burn * fl})`], [1, 'rgba(255,40,0,0)']]); c.fillRect(ax - d * 1.2, -d, d * 1.6, d * 2); c.restore();
    glowDot(c, ax - d * .15, 0, d * 2.4, '#ff5a1a', .55 * burn * fl);
    c.restore();
  }
  // манго: центр (0, 0), «радиус» s
  const MANGO = 'M.1 -1C.6 -.98 .84 -.55 .82 -.05C.8 .52 .5 .94 .02 1C-.44 1.04 -.76 .74 -.82 .26C-.88 -.28 -.6 -1.02 .1 -1Z';
  function mango(c, s, o = {}) {
    const p = new Path2D(MANGO);
    c.save(); shadowE(c, s * .1, s * 1.05, s * .9, s * .22, .35 * (o.sa ?? 1));
    c.scale(s * .82, s); c.lineWidth = 1 / s;
    c.fillStyle = lg(c, .3, -1, -.3, 1, [[0, '#8fcf3a'], [.28, '#ffd43a'], [.62, '#ff8a22'], [1, '#d8341f']]); c.fill(p);
    c.save(); c.clip(p);
    c.globalCompositeOperation = 'multiply'; c.fillStyle = lg(c, -.9, 0, .9, 0, [[0, 'rgb(140,120,110)'], [.3, '#ffffff'], [.75, '#ffffff'], [1, 'rgb(120,90,80)']]); c.fillRect(-1.2, -1.2, 2.4, 2.4);
    c.globalCompositeOperation = 'screen'; c.fillStyle = rg(c, -.32, -.46, 0, .42, [[0, 'rgba(255,255,255,.62)'], [1, 'rgba(255,255,255,0)']]); c.fillRect(-1.2, -1.2, 2.4, 2.4);
    for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,240,170,${.25 * H1(i)})`; c.beginPath(); c.arc((H1(i * 3.1) - .5) * 1.5, (H1(i * 7.3) - .5) * 1.9, .012, 0, TAU); c.fill() }
    c.restore();
    c.strokeStyle = '#4a2c12'; c.lineWidth = 6 / s; c.lineCap = 'round'; c.beginPath(); c.moveTo(.12, -.98); c.quadraticCurveTo(.16, -1.12, .26, -1.2); c.stroke();
    c.fillStyle = lg(c, .2, -1.2, .8, -1.1, [[0, '#3fbf62'], [1, '#13703a']]); c.beginPath(); c.moveTo(.24, -1.18); c.quadraticCurveTo(.55, -1.45, .9, -1.22); c.quadraticCurveTo(.55, -1.02, .24, -1.18); c.fill();
    c.restore();
  }
  function mangoSlice(c, s) {   // долька: полумесяц мякоти
    c.save(); c.scale(s, s);
    c.beginPath(); c.moveTo(-1, 0); c.quadraticCurveTo(0, -1.3, 1, 0); c.quadraticCurveTo(0, -.55, -1, 0); c.closePath();
    c.fillStyle = lg(c, 0, -.7, 0, 0, [[0, '#ffe066'], [.6, '#ffb02a'], [1, '#ff8a1a']]); c.fill();
    c.strokeStyle = '#e8561c'; c.lineWidth = .07; c.stroke();
    c.globalCompositeOperation = 'screen'; c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-.2, -.48, .4, .07, -.25, 0, TAU); c.fill();
    c.restore();
  }
  function mintLeaf(c, s, rot, shade = 0) {
    c.save(); c.rotate(rot); c.scale(s * .58, s);
    const p = new Path2D('M0 -1C.62 -.74 .66 .14 0 1C-.66 .14 -.62 -.74 0 -1Z');
    c.fillStyle = lg(c, -.6, 0, .6, 0, [[0, mixh('#46e38c', '#0a3d22', shade)], [.5, mixh('#22b866', '#0a3d22', shade)], [1, mixh('#0c7a40', '#04170c', shade)]]); c.fill(p);
    c.save(); c.clip(p); c.strokeStyle = 'rgba(200,255,220,.55)'; c.lineWidth = .045; c.beginPath(); c.moveTo(0, -.95); c.lineTo(0, .95); c.stroke();
    for (let i = 0; i < 5; i++) { const y = -.6 + i * .3; c.beginPath(); c.moveTo(0, y); c.quadraticCurveTo(.25, y - .1, .5, y - .28); c.moveTo(0, y); c.quadraticCurveTo(-.25, y - .1, -.5, y - .28); c.stroke() }
    c.globalCompositeOperation = 'screen'; c.fillStyle = 'rgba(255,255,255,.28)'; c.beginPath(); c.ellipse(-.2, -.3, .14, .45, .2, 0, TAU); c.fill(); c.restore();
    c.restore();
  }
  // одноразка «на просвет»: те же размеры, что vapeBar
  const MEMO = { w: 820, h: 1080 };
  const MEMOQ = [['REALISTICALLY, IF OUR COMPANY IS TO'], ['SURVIVE AND PROSPER, OVER THE LONG'], ['TERM, ', 'WE', ' ', 'MUST', ' ', 'GET', ' ', 'OUR'], ['SHARE OF THE', ' ', 'YOUTH', ' ', 'MARKET.']];
  function memoBody(x, t, o) {
    const W = MEMO.w, tk = o.type ?? 1, L = [['R.J. REYNOLDS TOBACCO COMPANY', 30, 700, 120], ['RESEARCH PLANNING MEMORANDUM', 24, 700, 165], ['DATE: FEBRUARY 2, 1973', 22, 500, 250], ['SUBJECT: SOME THOUGHTS ABOUT NEW BRANDS', 22, 500, 290], ['OF CIGARETTES FOR THE YOUTH MARKET', 22, 500, 322]];
    const tot = L.reduce((s, l) => s + l[0].length, 0); let used = 0;
    for (const [s, sz, wt, y] of L) { const n = Math.max(0, Math.min(s.length, Math.round(tk * tot) - used)); used += s.length; if (n <= 0) continue; tx(x, s.slice(0, n), W / 2, y, { f: 'J', w: wt, s: sz, ls: 1, c: '#2a241d', al: y > 200 ? 'center' : 'center' }) }
    if (tk > .3) { x.fillStyle = 'rgba(42,36,29,.75)'; x.fillRect(90, 190, W - 180, 2.5) }
    // тело: серые строки и абзац с цитатой
    const qa = cl((tk - .6) / .4);
    x.save(); x.globalAlpha = qa;
    for (let i = 0; i < 4; i++) { x.fillStyle = 'rgba(55,48,40,.32)'; x.fillRect(90, 400 + i * 40, (W - 180) * (i === 3 ? .6 : .95 - .06 * H1(i)), 12) }
    font(x, { f: 'J', w: 700, s: 27, ls: .5 }); x.textAlign = 'left';
    MEMOQ.forEach((ln, j) => { let xx = 90; const y = 610 + j * 50; for (const p of ln) { const w = x.measureText(p).width; const hl = o.hl && o.hl[p.trim()]; if (hl) { x.save(); x.globalCompositeOperation = 'multiply'; x.fillStyle = 'rgba(255,224,40,.9)'; const pad = 6; x.beginPath(); x.moveTo(xx - pad, y - 30); x.lineTo(xx - pad + (w + pad * 2) * hl, y - 28 + H1(xx) * 4); x.lineTo(xx - pad + (w + pad * 2) * hl, y + 10); x.lineTo(xx - pad, y + 8 + H1(y) * 3); x.fill(); x.restore() } x.fillStyle = '#2a241d'; x.fillText(p, xx, y); xx += w } });
    for (let i = 0; i < 6; i++) { x.fillStyle = 'rgba(55,48,40,.3)'; x.fillRect(90, 830 + i * 40, (W - 180) * (.93 - .1 * H1(i * 3)), 12) }
    x.restore();
    if (o.mark) { x.save(); x.strokeStyle = '#c3141c'; x.lineWidth = 5; x.lineCap = 'round'; x.globalAlpha = .9; x.beginPath(); const k = o.mark; x.moveTo(70, 575); x.lineTo(70, 575 + 190 * k); x.stroke(); x.restore() }
  }
  const HEADP = 'M-120 160C-150 90 -170 20 -160 -60C-150 -170 -60 -230 40 -220C140 -210 190 -140 190 -50C190 -20 200 0 225 40C232 52 222 62 205 62C200 90 205 110 190 120C180 130 170 140 172 160C175 185 150 200 110 195L70 190L70 260L-120 260Z';
  const AIRP = 'M196 92C160 96 122 102 98 122C78 140 68 170 66 200L64 262';
  function flaskPath(h) {
    const nw = h * .2, bw = h * .78, nh = h * .38, p = new Path2D();
    p.moveTo(-nw / 2, -h); p.lineTo(-nw / 2, -h + nh); p.lineTo(-bw / 2 + h * .04, -h * .1); p.quadraticCurveTo(-bw / 2 - h * .01, 0, -bw / 2 + h * .08, 0);
    p.lineTo(bw / 2 - h * .08, 0); p.quadraticCurveTo(bw / 2 + h * .01, 0, bw / 2 - h * .04, -h * .1); p.lineTo(nw / 2, -h + nh); p.lineTo(nw / 2, -h); p.closePath(); return p;
  }
  function flask(c, h, t, o = {}) {
    const p = flaskPath(h), bw = h * .78, rot = o.rot || 0;
    c.save(); c.rotate(rot);
    c.fillStyle = 'rgba(160,210,255,.07)'; c.fill(p);
    if (o.lv > 0) {   // жидкость: поверхность всегда горизонтальна — режем в повёрнутой системе по линии горизонта
      c.save(); c.clip(p); c.rotate(-rot);
      const ly = lp(0, -h * .62, o.lv) + Math.sin(t * 3) * 3, col = o.col || C.amber;
      c.fillStyle = lg(c, 0, ly, 0, ly + h * .7, [[0, rgba(col, .85)], [1, rgba(mixh(col, '#000000', .35), .9)]]); c.fillRect(-h, ly, h * 2, h * 2);
      c.globalCompositeOperation = 'screen'; c.fillStyle = rgba(mixh(col, '#ffffff', .5), .55); c.fillRect(-h, ly - 2, h * 2, 5);
      for (let i = 0; i < 18; i++) { const k = (H1(i * 3.1) + t * (.2 + .3 * H1(i))) % 1, bx = (H1(i * 7.7) - .5) * bw * .7, by = lp(-6, ly + 10, k); if (by < ly + 4) continue; c.strokeStyle = `rgba(255,255,255,${.5 * Math.sin(Math.PI * k)})`; c.lineWidth = 1.5; c.beginPath(); c.arc(bx, by, 2 + 4 * H1(i * 5), 0, TAU); c.stroke() }
      if (o.glow) glowDot(c, 0, -h * .2, h * .7, col, o.glow);
      c.restore();
    }
    c.save(); c.clip(p); c.globalCompositeOperation = 'screen';
    c.fillStyle = lg(c, -bw / 2, 0, bw / 2, 0, [[0, 'rgba(255,255,255,0)'], [.12, 'rgba(255,255,255,.28)'], [.2, 'rgba(255,255,255,0)'], [.8, 'rgba(255,255,255,0)'], [.9, 'rgba(180,220,255,.22)'], [1, 'rgba(255,255,255,0)']]); c.fillRect(-bw / 2, -h, bw, h);
    c.restore();
    c.strokeStyle = 'rgba(220,240,255,.75)'; c.lineWidth = 3; c.stroke(p);
    c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, -h, h * .1 + 3, 6, 0, 0, TAU); c.stroke();
    if (o.label) { c.save(); c.translate(0, -h * .3); rr(c, -h * .24, -h * .07, h * .48, h * .14, 6); c.fillStyle = 'rgba(240,236,226,.92)'; c.fill(); tx(c, o.label, 0, h * .03, { f: 'O', w: 700, s: h * .075, ls: 1, c: '#20242c' }); c.restore() }
    c.restore();
  }
  function stream(c, x0, y0, x1, y1, col, w, t, k = 1) {
    if (k <= 0) return; c.save(); c.globalCompositeOperation = 'screen'; c.strokeStyle = rgba(col, .85); c.lineCap = 'round'; c.lineWidth = w; c.shadowColor = col; c.shadowBlur = 16;
    c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(lp(x0, x1, .3), y0 + 10, lp(x0, x1, .3 + .7 * k), lp(y0, y1, k)); c.stroke();
    for (let i = 0; i < 8; i++) { const s = (t * 3 + i / 8) % 1; if (s > k) continue; c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(lp(x0, x1, .3 + .7 * s), lp(y0, y1, s), w * .3, 0, TAU); c.fill() } c.restore();
  }
  function crystal(c, s, t, a = 1) {
    if (a <= 0) return; const w = s * .38, top = -s / 2, bot = s / 2, ph = t * .5;
    c.save(); c.globalAlpha *= a;
    glowDot(c, 0, 0, s * 1.1, C.amber, .5);
    const F = []; for (let i = 0; i < 6; i++) { const a0 = ph + i * TAU / 6, a1 = a0 + TAU / 6, x0 = Math.cos(a0) * w, x1 = Math.cos(a1) * w, z = Math.sin(a0 + TAU / 12); if (z < 0) continue; F.push([x0, x1, z, i]) }
    F.sort((A, B) => A[2] - B[2]).forEach(([x0, x1, z, i]) => { const L = .35 + .65 * z; c.beginPath(); c.moveTo(x0, top + w * .5); c.lineTo(x1, top + w * .5); c.lineTo(x1, bot - w * .5); c.lineTo(x0, bot - w * .5); c.closePath();
      c.fillStyle = lg(c, x0, top, x1, bot, [[0, `rgba(255,${215 + 40 * L | 0},${150 + 100 * L | 0},${.7 + .3 * L})`], [.5, `rgba(255,${150 + 70 * L | 0},${60 + 50 * L | 0},${.6 + .3 * L})`], [1, `rgba(200,${80 + 40 * L | 0},20,${.7 + .2 * L})`]]); c.fill(); c.strokeStyle = 'rgba(255,250,235,.95)'; c.lineWidth = 2.5; c.stroke();
      c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = `rgba(255,255,255,${.35 * L * L})`; c.beginPath(); c.moveTo(lp(x0, x1, .15), top + w * .6); c.lineTo(lp(x0, x1, .35), top + w * .6); c.lineTo(lp(x0, x1, .2), bot - w * .7); c.lineTo(lp(x0, x1, .05), bot - w * .7); c.fill(); c.restore() });
    for (const sgn of [-1, 1]) { c.beginPath(); for (let i = 0; i <= 6; i++) { const a0 = ph + i * TAU / 6, x = Math.cos(a0) * w, y = (sgn < 0 ? top + w * .5 : bot - w * .5) + Math.sin(a0) * w * .18; i ? c.lineTo(x, y) : c.moveTo(x, y) } c.closePath(); c.fillStyle = sgn < 0 ? 'rgba(255,240,210,.55)' : 'rgba(180,90,30,.35)'; c.fill() }
    c.beginPath(); c.moveTo(0, top - w * .3); for (let i = 0; i <= 6; i++) { const a0 = ph + i * TAU / 6; c.lineTo(Math.cos(a0) * w, top + w * .5 + Math.sin(a0) * w * .18) } c.closePath(); c.fillStyle = 'rgba(255,248,230,.5)'; c.fill();
    c.globalCompositeOperation = 'screen'; for (let i = 0; i < 3; i++) { const k = (t * .7 + i / 3) % 1, x = (H1(i * 9 + Math.floor(t * .7 + i / 3)) - .5) * w * 1.6, y = (H1(i * 5 + Math.floor(t * .7 + i / 3)) - .5) * s * .8, r = 26 * Math.sin(Math.PI * k);
      c.strokeStyle = `rgba(255,255,255,${.9 * Math.sin(Math.PI * k)})`; c.lineWidth = 2; c.beginPath(); c.moveTo(x - r, y); c.lineTo(x + r, y); c.moveTo(x, y - r); c.lineTo(x, y + r); c.stroke() }
    c.restore();
  }
  function vapeOutline(c, h) {
    const w = h * .3, mpH = h * .17, m0 = w * .8, m1 = w * .56, top = -h, bT = -h + mpH, R = w * .17;
    c.beginPath(); c.roundRect(-w / 2, bT, w, -bT, [R, R, R * .8, R * .8]);
    c.moveTo(-m0 / 2, bT); c.bezierCurveTo(-m0 / 2, top + mpH * .5, -m1 / 2, top + mpH * .25, -m1 / 2, top + mpH * .14); c.quadraticCurveTo(-m1 / 2, top, 0, top); c.quadraticCurveTo(m1 / 2, top, m1 / 2, top + mpH * .14); c.bezierCurveTo(m1 / 2, top + mpH * .25, m0 / 2, top + mpH * .5, m0 / 2, bT);
  }
  function folderArt(x, W, H) {
    x.fillStyle = lg(x, 0, 0, 0, H, [[0, '#d9b47a'], [1, '#b98f52']]); x.beginPath(); x.moveTo(0, 40); x.lineTo(W * .32, 40); x.lineTo(W * .38, 0); x.lineTo(W * .7, 0); x.lineTo(W * .74, 40); x.lineTo(W, 40); x.lineTo(W, H); x.lineTo(0, H); x.fill();
    x.globalAlpha = .12; x.drawImage(noiseTex('pap', 512, 512, 3, 3, .55, 1), 0, 0, W, H); x.globalAlpha = 1;
    x.fillStyle = '#f2ead6'; x.fillRect(W * .12, H * .18, W * .76, H * .2); x.strokeStyle = 'rgba(60,40,20,.5)'; x.lineWidth = 2; x.strokeRect(W * .12, H * .18, W * .76, H * .2);
    font(x, { f: 'J', w: 700, s: W * .052, ls: 2 }); x.fillStyle = '#2a241d'; x.textAlign = 'center'; x.fillText('НИКОТИНОВАЯ СОЛЬ', W / 2, H * .27); font(x, { f: 'J', w: 500, s: W * .045, ls: 4 }); x.fillText('R.J. REYNOLDS · 1979', W / 2, H * .34);
    x.save(); x.translate(W * .52, H * .66); x.rotate(-.12); const im = stampImg('СЕКРЕТНО', C.red2, 70); x.globalCompositeOperation = 'multiply'; x.globalAlpha = .9; x.drawImage(im, -im.width / 2, -im.height / 2); x.restore();
  }
  const BCARD = [['1979', 'СОЛЬ', 540, 860, -.03, 0], ['2020', 'ЛАЗЕЙКА ОДНОРАЗОК', 265, 470, -.08, 1], ['1924', '«МАЛЬБОРО»', 815, 490, .07, 1], ['2014', 'НАГРЕВАТЕЛИ', 275, 1250, .06, 1], ['2022', 'ШАЙБЫ', 805, 1240, -.07, 1]];

  // ================= сцены начала =================
  // --- A1 / B7: вечерний город, подросток в худи со спины ---
  function cityDusk(c, t, px = 0) {
    skyG(c, [[0, '#100d30'], [.26, '#2e1c58'], [.46, '#7a3570'], [.6, '#d75d58'], [.69, '#ff9d58'], [.735, '#ffd28c'], [.76, '#ffe6b0']]);
    glow(c, 700, 1450, 900, 360, '#ffa25a', .75); glow(c, 700, 1460, 320, 110, '#fff2cc', .65);
    rays(c, 700, 1470, { n: 9, len: 1300, col: '#ffcf9a', a: .22, w: .05, t, a0: -Math.PI, span: Math.PI, seed: 5 });
    streaks(c, t, 560, 1300, 18, '#ffa8bc', .5, 3);
    birdsF(c, t, 6, 80, 560, 900, 320, 'rgba(36,14,40,.75)', 11);
    layer(c, 1, 2.4, x => { x.drawImage(skylineImg('cdFar2', 1500, 420, { col: '#8a4370', win: '#ffe0b8', seed: 5, h0: .12, h1: .7, wd: .93 }), -210 + px * .25, 1478 - 420) });
    hazeB(c, 1470, 70, '#ffb08a', .55);
    c.fillStyle = lg(c, 0, 1476, 0, 1800, [[0, 'rgba(176,90,104,.95)'], [.5, 'rgba(90,40,70,.98)'], [1, '#2a1430']]); c.fillRect(-300, 1476, WW + 600, 330);
    c.drawImage(skylineImg('cdNear2', 1600, 640, { col: '#1e1232', win: '#ffcf86', win2: '#8fe3ff', seed: 12, h0: .12, h1: .9, wd: .76, bw0: 70, bw1: 170 }), -260 + px * .6, 1800 - 640);
    const nn = [[140, 1290, '#ff4fa8'], [900, 1250, '#4fe3ff'], [470, 1360, '#ffb347']];
    for (const [x, y, col] of nn) { const f = .8 + .2 * Math.sin(t * 3 + x); c.save(); c.translate(px * .6, 0); c.fillStyle = rgba(col, .9 * f); rr(c, x - 54, y, 108, 12, 6); c.fill(); glow(c, x, y + 6, 140, 50, col, .8 * f); c.restore() }
    c.fillStyle = lg(c, 0, 1780, 0, HH, [[0, '#120a1c'], [1, '#05030a']]); c.fillRect(0, 1780, WW, HH);
    c.fillStyle = 'rgba(255,170,120,.3)'; c.fillRect(0, 1780, WW, 3);
  }
  function shotCity(c, t, u, o = {}) {
    // o.cam(u) → {s, fy, px}; vapor — пар появляется с vap (время от начала плана)
    const cm = o.cam ? o.cam(u) : { s: lp(1, 1.06, ss(0, 2.6, u)), px: -u * 6 };
    c.save(); c.translate(540, 1500); c.scale(cm.s, cm.s); c.translate(-540, -1500);
    cityDusk(c, t, cm.px);
    if (o.vap != null && u > o.vap) smoke(c, t, 620, 1440, { n: 22, life: 3.2, rise: 520, sway: 50, drift: 140, spread: 24, r0: 30, r1: 230, a: .5 * cl((u - o.vap) / .5), seed: 7, col: '#ffd6e6', from: t - (u - o.vap) });
    c.save(); c.translate(560 + cm.px * 1.2, 2010); teenBack(c, 520, { c1: '#3c4a66', c2: '#1b2032', rim: '#ff8ac0', rim2: '#ffb46b' }); c.restore();
    c.restore();
    bokehBig(c, t, 41, ['#ff8fbf', '#ffb36b', '#8fe3ff'], 1, 8);
    motes(c, t, 17, 30, '#ffd6e6', .5);
  }

  // --- A2 / B5: витрина-киоск, одноразка на стойке ---
  function kioskBg(c, t, dark = 0) {
    skyG(c, [[0, '#0a0712'], [.5, '#170d22'], [1, '#07050b']]);
    layer(c, 2, 9, x => {   // полки с одноразками — в расфокусе
      const cols = ['#ff4fa8', '#4fe3ff', '#b7ff5a', '#ffb347', '#b06bff', '#ff6a5a'];
      for (let r = 0; r < 5; r++) { const y = 360 + r * 200; x.fillStyle = 'rgba(255,255,255,.08)'; x.fillRect(0, y + 120, WW, 8);
        for (let i = 0; i < 11; i++) { const col = cols[(i + r * 2) % 6], bx = 20 + i * 98 + (r % 2) * 40, h = 90 + 20 * H1(i + r * 9);
          x.fillStyle = rgba(col, .55); rr(x, bx, y + 120 - h, 34, h, 8); x.fill(); x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(bx + 6, y + 126 - h, 4, h - 14);
          x.save(); x.globalCompositeOperation = 'screen'; x.fillStyle = rg(x, bx + 17, y + 120 - h / 2, 0, 90, [[0, rgba(col, .35)], [1, rgba(col, 0)]]); x.fillRect(bx - 80, y - 60, 200, 260); x.restore() } }
      x.fillStyle = 'rgba(255,79,168,.9)'; x.fillRect(80, 240, 920, 10); x.fillStyle = 'rgba(79,227,255,.9)'; x.fillRect(960, 240, 10, 900);
    }, 1 - dark);
    glow(c, 520, 245, 700, 130, '#ff4fa8', .55 * (1 - dark)); glow(c, 965, 700, 160, 600, '#4fe3ff', .45 * (1 - dark));
    // стойка: глянцевая, с отражениями
    c.fillStyle = lg(c, 0, 1380, 0, HH, [[0, '#1d1428'], [.12, '#0e0a15'], [1, '#050308']]); c.fillRect(0, 1380, WW, HH - 1380);
    c.fillStyle = lg(c, 0, 1372, 0, 1392, [[0, 'rgba(255,170,220,.0)'], [.5, 'rgba(255,170,220,.55)'], [1, 'rgba(255,170,220,0)']]); c.fillRect(0, 1372, WW, 20);
  }
  function packG(c, w, h, o = {}) {   // пачка без марки: бумага, полоса, фольга
    c.save(); shadowE(c, 10, 6, w * .7, 18, .6);
    c.fillStyle = lg(c, -w / 2, 0, w / 2, 0, [[0, '#6c5a44'], [.3, '#cdb994'], [.7, '#b9a37b'], [1, '#5a4a36']]); rr(c, -w / 2, -h, w, h, 8); c.fill();
    c.fillStyle = lg(c, -w / 2, 0, w / 2, 0, [[0, '#5a1b16'], [.4, '#9a2f24'], [1, '#4a1410']]); c.fillRect(-w / 2, -h * .62, w, h * .2);
    c.fillStyle = 'rgba(255,230,180,.85)'; c.fillRect(-w / 2, -h * .44, w, 3); c.fillRect(-w / 2, -h * .64, w, 3);
    c.fillStyle = lg(c, -w / 2, -h, w / 2, -h * .8, [[0, '#9a9fa8'], [.5, '#eef1f5'], [1, '#7c818a']]); c.beginPath(); c.moveTo(-w * .42, -h); c.lineTo(w * .42, -h); c.lineTo(w * .3, -h - 26); c.lineTo(-w * .3, -h - 26); c.fill();
    for (let i = 0; i < 6; i++) { c.fillStyle = '#f2ece0'; rr(c, -w * .36 + i * w * .13, -h - 34, w * .1, 34, 3); c.fill(); c.fillStyle = '#d99a52'; c.fillRect(-w * .36 + i * w * .13, -h - 34, w * .1, 8) }
    c.globalCompositeOperation = 'screen'; c.fillStyle = lg(c, -w / 2, 0, -w / 2 + 40, 0, [[0, 'rgba(255,190,230,.0)'], [.5, 'rgba(255,190,230,.4)'], [1, 'rgba(255,190,230,0)']]); c.fillRect(-w / 2, -h, 40, h);
    c.restore();
  }
  function shotKiosk(c, t, u) {
    const q = Q, sw = ss(q.zam - .1, q.sig + .25, t), sc = lp(1, 1.07, ss(0, 4.7, u));
    c.save(); c.translate(540, 1300); c.scale(sc, sc); c.translate(-540, -1300);
    kioskBg(c, t);
    // пачка уезжает влево и гаснет, одноразка въезжает справа — «замена»
    const px = lp(540, -260, eio(sw)), vx = lp(1360, 540, eo(cl((t - q.zam) / .55)));
    if (px > -250) { c.save(); c.globalAlpha = 1 - .6 * sw; c.translate(px, 1388); packG(c, 300, 420); c.restore() }
    if (vx < 1300) {
      c.save(); c.translate(vx, 2 * 1388); c.scale(1, -1); c.translate(0, 1388); c.globalAlpha = .26; vapeBar(c, 880, { led: .4, rim: '#ff8fd0' }); c.restore();
      c.fillStyle = lg(c, 0, 1388, 0, 1388 + 420, [[0, 'rgba(14,10,21,0)'], [1, 'rgba(10,7,15,1)']]); c.fillRect(0, 1388, WW, 440);
      c.save(); c.translate(vx, 1388); vapeBar(c, 880, { led: .4 + .6 * Math.sin(t * 2) ** 2, rim: '#ff8fd0', glint: cl((t - q.zam - .3) / .7) }); c.restore();
    }
    // пар — «безобидный», со вкусом манго и мяты
    if (t > q.bez - .1) smoke(c, t, vx, 1388 - 880, { n: 26, life: 3.2, rise: 640, sway: 70, drift: -90, spread: 22, r0: 34, r1: 260, a: .55 * cl((t - q.bez + .1) / .5), seed: 5, col: '#ffe1ec', from: q.bez - .1 });
    const mk1 = pop(t, q.mango - .05, .45), mk2 = pop(t, q.myaty - .05, .45);
    if (mk1 > 0) { c.save(); c.translate(330 + Math.sin(t) * 10, 470 - (t - q.mango) * 14); c.rotate(-.25 + Math.sin(t * .8) * .06); c.scale(mk1, mk1); mango(c, 120, { sa: 0 }); c.restore() }
    if (mk2 > 0) for (let i = 0; i < 3; i++) { const k = pop(t, q.myaty - .05 + i * .09, .45); if (k <= 0) continue; c.save(); c.translate(760 + i * 70 + Math.sin(t + i) * 8, 380 + i * 110 - (t - q.myaty) * 12); c.scale(k, k); mintLeaf(c, 80, .5 + i * .7 + Math.sin(t * .7 + i) * .1, i * .15); c.restore() }
    c.restore();
    pill(c, 'МАНГО · МЯТА', 540, 300, cl((t - q.mango) / .4));
    bokehBig(c, t, 23, ['#ff6fb8', '#5fe3ff', '#ffc070'], 1.1, 10);
    motes(c, t, 9, 26, '#ffe1ec', .45);
  }
  // одноразка «на просвет»: корпус-стекло, бак с жидкостью, спираль, батарея
  function vapeInside(c, h, t, k) {
    const w = h * .3, mpH = h * .17, bT = -h + mpH, R = w * .17;
    c.save(); c.globalAlpha = lp(1, .22, k); vapeBar(c, h, { label: k > .5 ? '' : undefined, led: .3, rim: '#ffb46b' }); c.restore();
    if (k <= 0) return;
    c.save(); c.globalAlpha = k;
    // бак
    const tx0 = -w * .32, tw0 = w * .64, ty0 = bT + h * .05, th = h * .42;
    rr(c, tx0, ty0, tw0, th, 14); c.fillStyle = 'rgba(255,220,170,.06)'; c.fill(); c.strokeStyle = 'rgba(255,230,200,.6)'; c.lineWidth = 3; c.stroke();
    c.save(); rr(c, tx0, ty0, tw0, th, 14); c.clip();
    const ly = ty0 + th * .18 + Math.sin(t * 2.2) * 4;
    c.fillStyle = lg(c, 0, ly, 0, ty0 + th, [[0, '#ffd27a'], [.4, '#ffaa3a'], [1, '#c8661a']]); c.fillRect(tx0, ly, tw0, th);
    c.fillStyle = 'rgba(255,250,220,.75)'; c.fillRect(tx0, ly - 2, tw0, 4);
    for (let i = 0; i < 22; i++) { const kk = (H1(i * 3.1) + t * (.25 + .35 * H1(i))) % 1, bx = tx0 + 14 + H1(i * 7.7) * (tw0 - 28), by = lp(ty0 + th - 10, ly + 8, kk); c.strokeStyle = `rgba(255,255,255,${.55 * Math.sin(Math.PI * kk)})`; c.lineWidth = 2; c.beginPath(); c.arc(bx, by, 3 + 6 * H1(i * 5), 0, TAU); c.stroke() }
    c.restore();
    glow(c, 0, ty0 + th * .6, w * 1.4, th * .8, '#ffae4a', .8 * k);
    // фитиль и спираль
    const cy = ty0 + th + h * .05; c.fillStyle = '#f2ead8'; rr(c, -w * .2, cy - 14, w * .4, 28, 10); c.fill();
    c.strokeStyle = `rgba(255,${140 + 60 * Math.sin(t * 6) | 0},60,1)`; c.lineWidth = 5; c.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU * 5, xx = lp(-w * .2, w * .2, i / 40), yy = cy + Math.sin(a) * 12; i ? c.lineTo(xx, yy) : c.moveTo(xx, yy) } c.stroke();
    glowDot(c, 0, cy, w * .8, '#ff6a2a', .7);
    // батарея
    const by0 = cy + h * .06, bh = -by0 - h * .1; rr(c, -w * .3, by0, w * .6, bh, 16); c.fillStyle = 'rgba(30,40,60,.75)'; c.fill(); c.strokeStyle = 'rgba(160,200,255,.5)'; c.lineWidth = 2; c.stroke();
    tx(c, '+', 0, by0 + 44, { f: 'O', w: 700, s: 40, c: 'rgba(200,225,255,.7)' });
    c.restore();
  }
  function shotInside(c, t, u) {
    const q = Q, k = ss(0, .7, u), sc = lp(1.08, 1.3, ss(0, 2.6, u));
    c.save(); c.translate(540, 760); c.scale(sc, sc); c.translate(-540, -760);
    kioskBg(c, t, .65);
    glow(c, 540, 820, 600, 700, '#ff8a2a', .35 * k);
    c.save(); c.translate(540, 1388); vapeInside(c, 880, t, k); c.restore();
    c.restore();
    pill(c, 'ЖИДКОСТЬ ВНУТРИ', 540, 330, cl((t - q.zhid) / .4));
    bokehBig(c, t, 77, ['#ffb46b', '#ff6a2a'], 1, 7); motes(c, t, 33, 26, '#ffd9b0', .45);
  }

  // --- A4: табачные гиганты на закате, «50 лет назад» ---
  function chimney(c, x, y0, y1, w0, w1, rim) {   // от основания y0 вверх до y1
    c.save(); c.beginPath(); c.moveTo(x - w0 / 2, y0); c.lineTo(x - w1 / 2, y1); c.lineTo(x + w1 / 2, y1); c.lineTo(x + w0 / 2, y0); c.closePath();
    c.fillStyle = lg(c, x - w0 / 2, 0, x + w0 / 2, 0, [[0, '#2a1012'], [.55, '#3d1814'], [.85, '#6a2a18'], [1, rim]]); c.fill();
    c.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 1; i < 9; i++) { const yy = lp(y0, y1, i / 9); c.fillRect(x - lp(w0, w1, i / 9) / 2, yy, lp(w0, w1, i / 9), 3) }
    c.fillStyle = '#1e0c0e'; c.fillRect(x - w1 / 2 - 8, y1 - 14, w1 + 16, 18); c.restore();
  }
  function shotGiants(c, t, u) {
    const q = Q, sc = lp(1, 1.06, ss(0, 3.4, u));
    c.save(); c.translate(540, 900); c.scale(sc, sc); c.translate(-540, -900);
    skyG(c, [[0, '#24102e'], [.3, '#5e2236'], [.55, '#b8432f'], [.7, '#ee8a3e'], [.76, '#ffc777']]);
    sunD(c, 560, 1250, 90, '#fff2cc', '#ff9a4a', 1);
    rays(c, 560, 1250, { n: 11, len: 1500, col: '#ffcf8a', a: .35, w: .06, t, a0: -Math.PI, span: Math.PI, seed: 3 });
    streaks(c, t, 520, 1150, 12, '#ffb08a', .4, 9);
    // заводы-гиганты
    const rimC = '#ffb46b';
    layer(c, 3, 1.6, x => {
      const base = 1460;
      x.fillStyle = '#2a1014'; for (const [bx, bw, bh] of [[40, 360, 300], [380, 420, 380], [760, 340, 280]]) { x.fillRect(bx, base - bh, bw, bh + 40); for (let i = 0; i < bw / 60; i++) { x.beginPath(); x.moveTo(bx + i * 60, base - bh); x.lineTo(bx + i * 60 + 60, base - bh - 40); x.lineTo(bx + i * 60 + 60, base - bh); x.fill() } }
      for (const [cx, top, w] of [[170, 420, 70], [330, 300, 84], [560, 240, 96], [770, 330, 82], [930, 450, 66]]) chimney(x, cx, base - 200, top, w * 1.25, w, rimC);
      for (let i = 0; i < 160; i++) { const wx = 60 + H1(i * 3.3) * 960, wy = base - 40 - H1(i * 5.1) * 250; if (H1(i * 9) > .55) { x.fillStyle = rgba('#ffcf7a', .5 + .5 * H1(i)); x.fillRect(wx, wy, 10, 14) } }
    });
    for (const [cx, top] of [[170, 420], [330, 300], [560, 240], [770, 330], [930, 450]]) smoke(c, t, cx, top - 10, { n: 12, life: 5, rise: 420, sway: 30, drift: 220, spread: 18, r0: 30, r1: 170, a: .42, seed: cx, col: '#5a3a3a', op: 'source-over' });
    hazeB(c, 1440, 90, '#ff9a5a', .4);
    // домики для масштаба
    c.fillStyle = '#12080a'; c.fillRect(0, 1500, WW, HH);
    for (let i = 0; i < 14; i++) { const hx0 = i * 80 - 10, hw = 64, hh = 50 + 20 * H1(i); c.fillStyle = '#170a0c'; c.fillRect(hx0, 1540 - hh, hw, hh + 10); c.beginPath(); c.moveTo(hx0 - 6, 1540 - hh); c.lineTo(hx0 + hw / 2, 1540 - hh - 34); c.lineTo(hx0 + hw + 6, 1540 - hh); c.fill(); if (H1(i * 3) > .3) { c.fillStyle = rgba('#ffcf7a', .85); c.fillRect(hx0 + 16, 1510 - hh * .3, 12, 14); glowDot(c, hx0 + 22, 1517 - hh * .3, 30, '#ffb347', .4) } }
    birdsF(c, t, 5, 100, 600, 800, 300, 'rgba(40,10,20,.7)', 3);
    c.restore();
    goldNum(c, '50', 540, 760, 330, cl((t - q.p50 + .05) / .5), { sub: 'ЛЕТ НАЗАД' });
    bokehBig(c, t, 61, ['#ffb46b', '#ff7a4a'], 1, 8); motes(c, t, 12, 30, '#ffd9a0', .5);
  }

  // --- A5: 1973, башня «Рейнольдс» (ар-деко, ступенями) ---
  const TIERS = [[300, 0, -560], [235, -560, -860], [175, -860, -1060], [120, -1060, -1170], [72, -1170, -1238]];
  function decoTower(c, x, base, s, t, o = {}) {
    c.save(); c.translate(x, base); c.scale(s, s);
    const lit = o.lit || '#ffb070', sh = o.shade || '#3a2346';
    for (const [hw, y0, y1] of TIERS) {
      c.fillStyle = lg(c, -hw, 0, hw, 0, [[0, sh], [.45, mixh(sh, '#7a5a6a', .5)], [.8, mixh('#8a6a5a', lit, .5)], [1, lit]]); c.fillRect(-hw, y1, hw * 2, y0 - y1 + 2);
      // простенки и окна
      const n = Math.floor(hw * 2 / 26);
      for (let i = 0; i < n; i++) { const xx = -hw + 13 + i * 26; c.fillStyle = 'rgba(255,230,200,.07)'; c.fillRect(xx - 3, y1 + 6, 6, y0 - y1 - 6);
        for (let yy = y1 + 18; yy < y0 - 14; yy += 30) { const v = H2(Math.round(xx * 3 + hw), Math.round(yy)); c.fillStyle = v > (o.wd ?? .7) ? rgba('#ffd58a', .55 + .45 * H1(v * 9)) : 'rgba(20,10,24,.45)'; c.fillRect(xx + 5, yy, 12, 16) } }
      c.fillStyle = rgba(lit, .9); c.fillRect(-hw, y1, hw * 2, 4);                       // освещённый карниз
      c.fillStyle = lg(c, hw - 26, 0, hw, 0, [[0, rgba(lit, 0)], [1, rgba(lit, .55)]]); c.fillRect(hw - 26, y1, 26, y0 - y1);
    }
    // корона и шпиль
    c.fillStyle = lg(c, -72, 0, 72, 0, [[0, sh], [1, lit]]); c.beginPath(); c.moveTo(-72, -1238); c.lineTo(-30, -1300); c.lineTo(30, -1300); c.lineTo(72, -1238); c.fill();
    c.fillRect(-7, -1380, 14, 82); glowDot(c, 0, -1384, 30, '#ff5a3a', .9 * (.6 + .4 * Math.sin(t * 3)));
    glow(c, 0, -1250, 240, 140, '#ffd28a', .45);
    c.restore();
  }
  function retroSky(c, t) {
    skyG(c, [[0, '#1a0e2c'], [.3, '#4a1f42'], [.55, '#a8443e'], [.7, '#e98a46'], [.78, '#ffc479'], [.82, '#ffe1a6']]);
    sunD(c, 820, 1420, 110, '#fff1c8', '#ffa04a', 1);
    rays(c, 820, 1420, { n: 12, len: 1700, col: '#ffcf8a', a: .3, w: .055, t, a0: -Math.PI, span: Math.PI, seed: 8 });
    streaks(c, t, 400, 1300, 16, '#ffb38a', .45, 21);
  }
  function shotTower(c, t, u) {
    const q = Q, mv = eio(cl((t - q.tab + .05) / 1.1)), sc = lp(1, 1.05, ss(0, 3.6, u));
    c.save(); c.translate(540, 1100); c.scale(sc, sc); c.translate(-540, -1100);
    retroSky(c, t);
    birdsF(c, t, 6, 60, 360, 900, 380, 'rgba(40,12,30,.75)', 5);
    layer(c, 4, 2.2, x => { x.drawImage(skylineImg('ret1', 1400, 460, { col: '#5a2a44', win: '#ffd9a6', seed: 31, h0: .15, h1: .6, wd: .9 }), -160, 1560 - 460) });
    hazeB(c, 1560, 80, '#ffae7a', .5);
    // башня-«империя» вырастает из-за города
    c.save(); c.beginPath(); c.rect(-200, -400, WW + 400, 1800 + 400); c.clip(); c.translate(0, (1 - mv) * 1450); decoTower(c, 540, 1760, 1, t); c.restore();
    c.drawImage(skylineImg('ret2', 1500, 420, { col: '#1e0d1c', win: '#ffcf7a', seed: 44, h0: .2, h1: .75, wd: .8, bw0: 80, bw1: 160 }), -200, 1800 - 420);
    c.fillStyle = '#120812'; c.fillRect(-100, 1795, WW + 200, 400);
    c.restore();
    // год крутится 2026 → 1973 и уходит вверх, когда растёт башня
    const yk = cl((t - q.s2 + .1) / .3), yv = Math.round(lp(2026, 1973, eio(cl((t - q.s2) / .85))));
    c.save(); c.translate(0, -mv * 520); c.globalAlpha = 1 - mv;
    goldNum(c, String(yv), 540, 760, 300, yk, { sub: t > q.y73 + .1 ? 'ВЕРНЁМСЯ НАЗАД' : '' });
    c.restore();
    pill(c, 'R.J. REYNOLDS · УИНСТОН-СЕЙЛЕМ', 540, 300, cl((t - q.rey + .1) / .4));
    bokehBig(c, t, 81, ['#ffb46b', '#ff8a5a'], 1, 8); motes(c, t, 5, 30, '#ffd9a0', .5);
  }

  // --- A6: неоновые вывески CAMEL и WINSTON на крышах ---
  function neonOn(t, t0) { if (t < t0) return 0; const d = t - t0; return d < .06 ? 1 : d < .12 ? .15 : d < .18 ? 1 : d < .23 ? .3 : 1 }
  function neonText(c, s, x, y, sz, col, k, t) {
    c.save(); font(c, { f: 'O', w: 700, s: sz, ls: sz * .06 }); c.textAlign = 'center'; c.lineJoin = 'round'; c.lineCap = 'round';
    c.strokeStyle = 'rgba(70,40,50,.75)'; c.lineWidth = sz * .07; c.strokeText(s, x, y);
    if (k > 0) {
      const f = k * (.92 + .08 * Math.sin(t * 40) * Math.sin(t * 7));
      c.globalCompositeOperation = 'screen'; c.globalAlpha = f;
      c.shadowColor = col; c.shadowBlur = sz * .45; c.strokeStyle = col; c.lineWidth = sz * .075; c.strokeText(s, x, y);
      c.shadowBlur = sz * .15; c.lineWidth = sz * .03; c.strokeStyle = mixh(col, '#ffffff', .65); c.strokeText(s, x, y);
    }
    c.restore();
  }
  function lattice(c, x0, y0, x1, y1) {   // стальная рама вывески
    c.save(); c.strokeStyle = 'rgba(20,12,24,.95)'; c.lineWidth = 6; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
    c.lineWidth = 3; for (let x = x0; x < x1; x += 60) { c.beginPath(); c.moveTo(x, y1); c.lineTo(x + 60, y0); c.moveTo(x, y0); c.lineTo(x + 60, y1); c.stroke() }
    for (let x = x0 + 40; x < x1; x += 160) { c.lineWidth = 8; c.beginPath(); c.moveTo(x, y1); c.lineTo(x, y1 + 140); c.stroke() }
    c.restore();
  }
  function shotNeon(c, t, u) {
    const q = Q, sc = lp(1.04, 1, ss(0, 2.2, u));
    c.save(); c.translate(540, 1000); c.scale(sc, sc); c.translate(-540, -1000);
    skyG(c, [[0, '#0d0a24'], [.4, '#2c1a4c'], [.65, '#6e2c58'], [.8, '#c0544c'], [.86, '#f08c4c']]);
    streaks(c, t, 500, 1300, 12, '#ff9ab0', .35, 13);
    layer(c, 5, 5, x => { decoTower(x, 560, 1700, .72, t, { lit: '#ff9a6a', wd: .62 }) });
    layer(c, 6, 3, x => { x.drawImage(skylineImg('neb', 1400, 500, { col: '#2a1636', win: '#ffcf8a', seed: 52, h0: .1, h1: .55, wd: .85 }), -160, 1660 - 500) });
    const k1 = neonOn(t, q.camel - .05), k2 = neonOn(t, q.winston - .05);
    // крыши
    c.fillStyle = '#100914'; c.fillRect(-60, 860, 600, 1200); c.fillRect(560, 1170, 600, 900);
    lattice(c, 40, 560, 500, 760); lattice(c, 590, 880, 1040, 1060);
    glow(c, 270, 700, 420, 220, '#ffc24a', .7 * k1); glow(c, 815, 980, 420, 200, '#ff3a3a', .7 * k2);
    neonText(c, 'CAMEL', 270, 712, 170, '#ffc24a', k1, t);
    neonText(c, 'WINSTON', 815, 1022, 128, '#ff3b3b', k2, t);
    c.fillStyle = rgba('#ffc24a', .25 * k1); c.fillRect(-60, 860, 600, 4); c.fillStyle = rgba('#ff3b3b', .25 * k2); c.fillRect(560, 1170, 600, 4);
    for (let i = 0; i < 18; i++) { const wx = 40 + (i % 6) * 80, wy = 960 + Math.floor(i / 6) * 120; if (H1(i * 3.7) > .45) { c.fillStyle = rgba('#ffcf86', .5); c.fillRect(wx, wy, 26, 44) } }
    c.restore();
    bokehBig(c, t, 91, ['#ffc24a', '#ff4a4a', '#b06bff'], 1, 9); motes(c, t, 7, 24, '#ffd0b0', .45);
  }

  // --- A7 / B4: кабинет 1973, ночь; машинка, лампа, человек у окна ---
  function typewriter(c, w, t, typed, paper = 1) {
    const h = w * .42;
    c.save();
    shadowE(c, 0, 6, w * .62, 26, .7);
    // бумага
    if (paper > 0) { c.save(); c.translate(0, -h * 1.02); c.rotate(-.02); c.fillStyle = '#efe6d2'; c.fillRect(-w * .3, -w * .48, w * .6, w * .5);
      c.fillStyle = 'rgba(40,32,24,.8)'; for (let i = 0; i < 9; i++) { const L = cl(typed * 9 - i); if (L <= 0) continue; c.fillRect(-w * .25, -w * .43 + i * 21, w * .5 * L * (i === 8 ? .55 : .9 - .08 * H1(i)), 6) }
      c.fillStyle = 'rgba(120,90,60,.25)'; c.fillRect(-w * .3, -w * .48, 6, w * .5); c.restore() }
    // каретка и валик
    c.fillStyle = lg(c, 0, -h * 1.15, 0, -h * .95, [[0, '#3c3a36'], [.5, '#9a958c'], [1, '#2a2826']]); rr(c, -w * .46, -h * 1.12, w * .92, h * .2, 14); c.fill();
    c.fillStyle = '#c9c2b2'; c.fillRect(-w * .5, -h * 1.06, 18, 18); c.fillRect(w * .5 - 18, -h * 1.06, 18, 18);
    // корпус
    c.beginPath(); c.moveTo(-w * .5, 0); c.lineTo(-w * .42, -h * .95); c.lineTo(w * .42, -h * .95); c.lineTo(w * .5, 0); c.closePath();
    c.fillStyle = lg(c, -w / 2, 0, w / 2, 0, [[0, '#14201a'], [.5, '#2a3e32'], [1, '#162219']]); c.fill();
    c.fillStyle = lg(c, 0, -h * .95, 0, -h * .7, [[0, 'rgba(255,240,200,.25)'], [1, 'rgba(255,240,200,0)']]); c.fill();
    // клавиши
    for (let r = 0; r < 4; r++) for (let i = 0; i < 11 - r; i++) { const kx = -w * .36 + r * w * .03 + i * w * .068, ky = -h * .62 + r * h * .15, pr = typed > 0 && typed < 1 && H1(i * 7 + r + Math.floor(t * 12)) > .9;
      c.fillStyle = '#0b0f0c'; c.beginPath(); c.arc(kx, ky + 3, 13, 0, TAU); c.fill(); c.fillStyle = pr ? '#bfb8a6' : '#e8e0cc'; c.beginPath(); c.arc(kx, ky - (pr ? 0 : 3), 11, 0, TAU); c.fill() }
    c.fillStyle = '#d8d0bc'; rr(c, -w * .2, -h * .12, w * .4, 14, 7); c.fill();
    c.restore();
  }
  function officeRoom(c, t, o = {}) {
    skyG(c, [[0, '#120c16'], [1, '#07050a']]);
    cityWindow(c, t, 120, 240, 840, 760, { moon: 1, key: 'of', tower: (x, X, Y, W, H) => decoTower(x, X + W * .62, Y + H * .98, .45, t, { lit: '#ffb07a', wd: .58 }) });
    glow(c, 540, 620, 600, 500, '#5a7ac0', .25);
    if (o.man !== false) { c.save(); c.translate(330, 1330); c.globalAlpha *= o.manA ?? 1; execBack(c, 980, { rim: '#9cc0ff' }); c.restore() }
    // стол
    c.fillStyle = lg(c, 0, 1290, 0, 1420, [[0, '#4a2c18'], [1, '#2a170c']]); c.fillRect(-100, 1290, WW + 200, 130);
    c.fillStyle = lg(c, 0, 1420, 0, HH, [[0, '#1a0e08'], [1, '#090504']]); c.fillRect(-100, 1420, WW + 200, 600);
    c.fillStyle = 'rgba(255,200,140,.25)'; c.fillRect(-100, 1290, WW + 200, 3);
    lampCone(c, 190, 1012, 760, 520, '#ffd9a0', .75); glow(c, 260, 1320, 520, 120, '#ffcf8a', .5);
    c.save(); c.translate(190, 1312); bankerLamp(c, 330); c.restore();
  }
  function folderDesk(c, x, y, rot, t, st) {
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(1, .42);
    c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(-150, -190, 310, 400);
    const f = cache('fold9', 300, 390, (xx, W, H) => folderArt(xx, W, H)); c.drawImage(f, -150, -200);
    c.restore();
  }
  function shotOffice(c, t, u) {
    const q = Q, zk = eio(cl((t - q.s3 + .1) / 2.2)), sc = lp(1, 1.85, zk);
    c.save(); c.translate(lp(540, 640, zk), lp(1100, 1060, zk)); c.scale(sc, sc); c.translate(-640, -1060 - 40 * zk);
    officeRoom(c, t, { manA: 1 - .75 * zk });
    c.save(); c.translate(900, 1345); c.scale(1.2, 1.2); c.save(); c.scale(1, .42); c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(-130, -170, 270, 360); c.restore();
    c.fillStyle = lg(c, 0, -60, 0, 60, [[0, '#d9b47a'], [1, '#a77d42']]); c.beginPath(); c.moveTo(-120, -50); c.lineTo(110, -62); c.lineTo(130, 56); c.lineTo(-104, 66); c.closePath(); c.fill(); c.restore();
    stamp(c, 'СЕКРЕТНО', 905, 1345, -.12, t, q.sekr + .02, '#c3141c', 30, { sc: 1, ring: true });
    c.save(); c.translate(640, 1335); typewriter(c, 470, t, cl((t - q.gotov) / 2.4)); c.restore();
    c.restore();
    bokehBig(c, t, 101, ['#ffcf8a', '#9cc0ff'], .9, 7); motes(c, t, 19, 24, '#ffe0b0', .45);
  }

  // --- A8: записка 1973 крупно, цитата выделяется маркером под голос ---
  const QKEY = ['WE', 'MUST', 'GET', 'OUR', 'SHARE OF THE', 'YOUTH', 'MARKET.'];
  function memoCanvas(t) {
    const q = Q, hl = {}; QKEY.forEach((k, i) => { hl[k] = cl((t - q.qt[i] + .05) / Math.max(.18, q.qtB[i] - q.qt[i])) });
    const m = cache('memo9', MEMO.w, MEMO.h, () => {}), x = m.getContext('2d');
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(paperTex(MEMO.w, MEMO.h, 'm9'), 0, 0); memoBody(x, t, { type: 1, hl, mark: cl((t - q.qt[6]) / .4) });
    return m;
  }
  function dofV(c, L, y0, y1, b) {   // L — готовый кадр; вне [y0, y1] — размытие
    c.drawImage(L, 0, 0);
    const T = LY[9] || (LY[9] = mk(WW, HH)), x = T.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'copy'; x.filter = `blur(${b}px)`; x.drawImage(L, 0, 0); x.filter = 'none';
    x.globalCompositeOperation = 'destination-in'; x.fillStyle = lg(x, 0, 0, 0, HH, [[0, 'rgba(0,0,0,1)'], [cl(y0 / HH - .08), 'rgba(0,0,0,1)'], [y0 / HH, 'rgba(0,0,0,0)'], [y1 / HH, 'rgba(0,0,0,0)'], [cl(y1 / HH + .08), 'rgba(0,0,0,1)'], [1, 'rgba(0,0,0,1)']]); x.fillRect(0, 0, WW, HH);
    x.globalCompositeOperation = 'source-over'; c.drawImage(T, 0, 0);
  }
  function deskTop(x) {   // стол сверху: дерево, свет лампы слева сверху
    x.fillStyle = lg(x, 0, 0, WW, HH, [[0, '#5a361e'], [.5, '#3a2112'], [1, '#1e1008']]); x.fillRect(-200, -200, WW + 400, HH + 400);
    x.globalAlpha = .18; x.drawImage(noiseTex('wood', 256, 1024, 3, 3, .4, 1), -200, -200, WW + 400, HH + 400); x.globalAlpha = 1;
    for (let i = 0; i < 26; i++) { x.strokeStyle = `rgba(20,10,4,${.12 + .1 * H1(i)})`; x.lineWidth = 2 + 3 * H1(i * 3); x.beginPath(); x.moveTo(-200, i * 90 + 40 * H1(i)); x.bezierCurveTo(300, i * 90 + 30, 700, i * 90 - 20, WW + 200, i * 90 + 25 * H1(i * 7)); x.stroke() }
  }
  function shotMemo(c, t, u) {
    const q = Q, sc = lp(1, 1.16, ss(0, 4, u));
    const L = LY[8] || (LY[8] = mk(WW, HH)), x = L.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.filter = 'none'; x.globalCompositeOperation = 'source-over';
    x.save(); x.translate(540, 960); x.scale(sc, sc); x.rotate(-.035 + u * .004); x.translate(-540, -960);
    deskTop(x);
    x.save(); x.translate(560, 860); x.rotate(-.04);
    x.fillStyle = 'rgba(0,0,0,.5)'; x.filter = 'blur(24px)'; x.fillRect(-MEMO.w / 2 + 20, -MEMO.h / 2 + 30, MEMO.w, MEMO.h); x.filter = 'none';
    x.drawImage(memoCanvas(t), -MEMO.w / 2, -MEMO.h / 2); x.restore();
    x.restore();
    // свет лампы и тень сверху
    x.save(); x.globalCompositeOperation = 'multiply'; x.fillStyle = rg(x, 300, 520, 200, 1500, [[0, 'rgba(255,236,200,1)'], [.6, 'rgba(200,150,110,1)'], [1, 'rgba(60,35,25,1)']]); x.fillRect(0, 0, WW, HH); x.restore();
    glow(x, 320, 560, 700, 520, '#ffd28a', .35);
    dofV(c, L, 760, 1180, 9);
    bokehBig(c, t, 111, ['#ffd28a'], .8, 6); motes(c, t, 23, 20, '#ffe6c0', .4);
  }

  // --- A9: обычный табачный дым (сигарета в пепельнице) ---
  function ashtray(c, r) {
    c.save(); shadowE(c, 0, r * .3, r * 1.2, r * .32, .7);
    c.fillStyle = lg(c, -r, 0, r, 0, [[0, 'rgba(120,150,170,.55)'], [.5, 'rgba(220,235,245,.35)'], [1, 'rgba(90,110,130,.6)']]); c.beginPath(); c.ellipse(0, 0, r, r * .34, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(30,30,34,.85)'; c.beginPath(); c.ellipse(0, -r * .02, r * .72, r * .22, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(120,115,110,.7)'; for (let i = 0; i < 30; i++) { c.beginPath(); c.arc((H1(i * 3) - .5) * r * 1.1, (H1(i * 7) - .5) * r * .25, 3 + 5 * H1(i), 0, TAU); c.fill() }
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 3; c.beginPath(); c.ellipse(0, 0, r, r * .34, 0, Math.PI * 1.1, Math.PI * 1.75); c.stroke();
    c.restore();
  }
  function shotSmoke(c, t, u) {
    const q = Q, sc = lp(1, 1.08, ss(0, 2.8, u));
    c.save(); c.translate(540, 1200); c.scale(sc, sc); c.translate(-540, -1200);
    skyG(c, [[0, '#0e0a10'], [1, '#050306']]);
    layer(c, 7, 14, x => { for (let i = 0; i < 40; i++) { const col = ['#ffcf86', '#9cc0ff', '#ff9a6a'][i % 3]; x.fillStyle = rgba(col, .5); x.beginPath(); x.arc(H1(i * 3.1) * WW, 250 + H1(i * 7.7) * 700, 6 + 10 * H1(i * 5), 0, TAU); x.fill() } });
    c.fillStyle = lg(c, 0, 1300, 0, HH, [[0, '#3a2112'], [1, '#120904']]); c.fillRect(-100, 1300, WW + 200, 700);
    lampCone(c, 300, 300, 1100, 1200, '#ffd9a0', .55);
    c.save(); c.translate(540, 1420); ashtray(c, 230); c.restore();
    c.save(); c.translate(560, 1388); c.rotate(-.18); cigarette(c, 420, 44, { t, burn: 1 }); c.restore();
    const ex = 560 + 210 * Math.cos(-.18), ey = 1388 + 210 * Math.sin(-.18);
    smoke(c, t, ex, ey - 10, { n: 30, life: 4, rise: 1000, sway: 90, drift: -120, spread: 16, r0: 22, r1: 300, a: .55, seed: 3, col: '#8f957e', op: 'source-over' });
    smoke(c, t, ex, ey - 10, { n: 18, life: 4, rise: 900, sway: 80, drift: -100, spread: 14, r0: 18, r1: 220, a: .35, seed: 9, col: '#ffe2b0' });
    c.restore();
    pill(c, 'ТАБАЧНЫЙ ДЫМ · ЕДКИЙ', 540, 380, cl((t - q.dym + .05) / .4));
    motes(c, t, 29, 24, '#ffe0b0', .4);
  }

  // --- A10 / A13: горло в профиль (силуэт), раздражение / мягко ---
  function profileBg(c, t, calm) {
    skyG(c, calm ? [[0, '#0b1426'], [.5, '#17305a'], [.8, '#2e5a8a'], [1, '#5a8ab8']] : [[0, '#1a0c1c'], [.45, '#4a1830'], [.75, '#a8382e'], [1, '#f07a3a']]);
    glow(c, 820, 1300, 700, 700, calm ? '#8fd0ff' : '#ff8a3a', .45);
    streaks(c, t, 300, 1500, 10, calm ? '#9fd0ff' : '#ff9a7a', .3, calm ? 61 : 63);
  }
  function profileHead(c, t, irr, calm) {
    const hp = new Path2D(HEADP), air = new Path2D(AIRP);
    const shp = new Path2D('M-120 250L70 250C120 300 300 330 520 420L520 760L-460 760L-460 420C-330 330 -170 300 -120 250Z');
    c.fillStyle = lg(c, -170, 0, 230, 0, [[0, '#0a0c16'], [.7, '#141a2e'], [1, '#202842']]); c.fill(shp); c.fill(hp);
    c.save(); c.clip(hp); c.globalCompositeOperation = 'screen'; c.translate(-6, 0); c.strokeStyle = calm ? 'rgba(160,215,255,.9)' : 'rgba(255,170,110,.95)'; c.lineWidth = 5; c.shadowColor = calm ? '#8fd0ff' : '#ff9a4a'; c.shadowBlur = 16; c.stroke(hp); c.restore();
    c.save(); c.globalCompositeOperation = 'screen'; c.lineCap = 'round';
    const col = calm ? 'rgba(170,230,255,.8)' : `rgba(255,${150 - 110 * irr | 0},${120 - 100 * irr | 0},.9)`;
    c.shadowColor = calm ? '#8fd0ff' : '#ff3a2a'; c.shadowBlur = 26; c.strokeStyle = col; c.lineWidth = 26 * (1 + .12 * Math.sin(t * 11) * irr); c.stroke(air);
    c.shadowBlur = 0; c.lineWidth = 8; c.strokeStyle = 'rgba(255,255,255,.5)'; c.stroke(air);
    glowDot(c, 70, 175, 170 * (1 + .2 * Math.sin(t * 7)), calm ? '#7fd0ff' : '#ff2a2a', calm ? .45 : .35 + .6 * irr);
    for (let i = 0; i < 34; i++) { const ph = (t * (calm ? .55 : 1.1) + H1(i * 3.1)) % 1, px = lp(330, 70, ph) + Math.sin(i + t * 3) * 6, py = ph < .55 ? lp(92 + (H1(i) - .5) * 30, 120, ph / .55) : lp(125, 262, (ph - .55) / .45);
      c.globalAlpha = (calm ? .4 : .7) * Math.sin(Math.PI * ph); c.fillStyle = calm ? '#e6f6ff' : '#d8c8b0';
      if (calm) { c.beginPath(); c.arc(px, py, 7 + 4 * H1(i * 7), 0, TAU); c.fill() }
      else { c.save(); c.translate(px, py); c.rotate(i); c.beginPath(); for (let k = 0; k < 5; k++) { const a = k * TAU / 5, rr2 = k % 2 ? 3 : 9; c.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2) } c.closePath(); c.fill(); c.restore() } }
    c.restore();
  }
  function shotThroat(c, t, u) {
    const q = Q, irr = ss(q.edkiy - .1, q.deret + .1, t) * (.75 + .25 * Math.sin(t * 9)), sc = lp(1, 1.06, ss(0, 3, u));
    c.save(); c.translate(540, 900); c.scale(sc, sc); c.translate(-540, -900);
    profileBg(c, t, false);
    c.save(); c.translate(470, 880); c.scale(2.35, 2.35); profileHead(c, t, irr, false); c.restore();
    for (const tt of [q.deret, q.gorlo]) { const pk = (t - tt) / .6; if (pk > 0 && pk < 1) { c.save(); c.strokeStyle = rgba('#ff3a2a', (1 - pk) * .85); c.lineWidth = 10 * (1 - pk); c.beginPath(); c.arc(470 + 70 * 2.35, 880 + 175 * 2.35, 60 + pk * 320, 0, TAU); c.stroke(); c.restore() } }
    c.restore();
    pill(c, 'ГОРЛО · РАЗДРАЖЕНИЕ', 760, 1420, cl((t - q.gorlo + .05) / .4), { c: '#ffb0a0', bc: 'rgba(255,70,50,.85)' });
    bokehBig(c, t, 121, ['#ff8a5a', '#ff5a3a'], .8, 7); motes(c, t, 31, 22, '#ffd0b0', .4);
  }
  function shotCalm(c, t, u) {
    const q = Q, sc = lp(1.04, 1, ss(0, 3.4, u));
    c.save(); c.translate(540, 900); c.scale(sc, sc); c.translate(-540, -900);
    profileBg(c, t, true);
    c.save(); c.translate(470, 880); c.scale(2.35, 2.35); profileHead(c, t, 0, true); c.restore();
    // шкала дозы справа: растёт до «МАКС» на «убойной»
    const dk = ss(q.uboy - .4, q.doze + .3, t), x0 = 930, y0 = 500, h = 760;
    c.save(); c.fillStyle = 'rgba(8,12,24,.7)'; rr(c, x0 - 26, y0 - 20, 52, h + 40, 26); c.fill(); c.strokeStyle = 'rgba(160,200,255,.4)'; c.lineWidth = 2; c.stroke();
    const fh = h * lp(.15, 1, dk); c.fillStyle = lg(c, 0, y0 + h, 0, y0, [[0, '#3fe08a'], [.6, '#ffc24a'], [1, '#ff3a2a']]); rr(c, x0 - 14, y0 + h - fh, 28, fh, 14); c.fill();
    glowDot(c, x0, y0 + h - fh, 90, dk > .8 ? '#ff3a2a' : '#ffc24a', .7 * dk);
    tx(c, 'ДОЗА', x0, y0 + h + 70, { f: 'J', w: 700, s: 20, ls: 3, c: 'rgba(200,220,255,.75)' });
    if (dk > .85) tx(c, 'МАКС', x0, y0 - 40, { f: 'J', w: 700, s: 22, ls: 3, c: '#ff5a4a', a: cl((dk - .85) / .1) });
    c.restore();
    c.restore();
    pill(c, 'ГОРЛО: МЯГКО ✓', 560, 1420, cl((t - q.myagko + .05) / .4), { c: '#c8ecff', bc: 'rgba(120,200,255,.85)' });
    bokehBig(c, t, 131, ['#8fd0ff', '#c8ecff'], .8, 7); motes(c, t, 37, 22, '#d8f0ff', .4);
  }

  // --- A11: лаборатория, ночь; две колбы на штативах льют в третью — никотиновая соль ---
  function labRoom(c, t) {
    skyG(c, [[0, '#071820'], [.6, '#0a1c26'], [1, '#03080c']]);
    // окно с ночным небом
    c.save(); c.beginPath(); c.rect(70, 200, 470, 820); c.clip();
    skyG(c, [[0, '#050a1e'], [.6, '#10204a'], [1, '#22407a']], 200, 1020); sunD(c, 400, 380, 34, '#eef4ff', '#8fb2ff', .9);
    for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,255,255,${.3 + .6 * H1(i * 3)})`; c.fillRect(80 + H1(i * 7) * 450, 210 + H1(i * 11) * 500, 2, 2) }
    c.drawImage(skylineImg('lab1', 520, 260, { col: '#0a1228', win: '#ffd28a', seed: 71, h0: .2, h1: .9, wd: .85 }), 50, 1020 - 260);
    c.restore();
    c.fillStyle = '#0c1418'; c.fillRect(56, 186, 498, 16); c.fillRect(56, 1018, 498, 16); c.fillRect(56, 186, 16, 846); c.fillRect(538, 186, 16, 846); c.fillRect(298, 186, 12, 846); c.fillRect(56, 600, 498, 12);
    glow(c, 300, 600, 400, 520, '#6f9cff', .25);
    // полки с бутылями — размыты; химики со спины
    layer(c, 10, 8, x => {
      for (let r = 0; r < 4; r++) { const sy = 360 + r * 220; x.fillStyle = '#16262e'; x.fillRect(600, sy, 480, 10);
        for (let i = 0; i < 7; i++) { const bx = 620 + i * 66, bh = 70 + 80 * H1(r * 9 + i), col = ['#3fd3c6', '#ffb54a', '#8fd6ff', '#ff6a5a'][(i + r) % 4]; x.fillStyle = rgba(col, .35); rr(x, bx, sy - bh, 40, bh, 8); x.fill() } }
      x.save(); x.translate(760, 1460); chemBack(x, 640); x.restore(); x.save(); x.translate(960, 1500); chemBack(x, 600, { hair: '#4a3a2a' }); x.restore();
    });
    // стол
    c.fillStyle = lg(c, 0, 1450, 0, 1540, [[0, '#2a3a40'], [1, '#141e22']]); c.fillRect(-100, 1450, WW + 200, 90);
    c.fillStyle = lg(c, 0, 1540, 0, HH, [[0, '#0b1216'], [1, '#040709']]); c.fillRect(-100, 1540, WW + 200, 600);
    c.fillStyle = 'rgba(160,220,255,.35)'; c.fillRect(-100, 1450, WW + 200, 3);
    lampCone(c, 540, 300, 1100, 1250, '#cfe8ff', .35);
  }
  function standClamp(c, bx, by, cx, cy) {   // штатив: стойка от стола и держатель у горлышка
    c.save(); c.strokeStyle = '#7a8a92'; c.lineCap = 'round'; c.lineWidth = 10; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, cy - 30); c.stroke();
    c.lineWidth = 7; c.beginPath(); c.moveTo(bx, cy); c.lineTo(cx, cy); c.stroke(); c.fillStyle = '#5a666e'; rr(c, bx - 60, by - 14, 120, 18, 6); c.fill();
    c.fillStyle = '#a8b4ba'; c.beginPath(); c.arc(bx, cy, 10, 0, TAU); c.fill(); c.restore();
  }
  function shotLab(c, t, u) {
    const q = Q, sc = lp(1, 1.28, ss(0, 4.8, u));
    c.save(); c.translate(540, 1150); c.scale(sc, sc); c.translate(-540, -1150);
    labRoom(c, t);
    const pL = ss(q.smesh - .3, q.nikot + .1, t), pR = ss(q.kisl - .5, q.kisl + .05, t), mix = ss(q.nikot, q.poluch + .2, t);
    const sL = ss(q.nikot + .1, q.nikot + .5, t) * (1 - ss(q.poluch, q.poluch + .4, t)), sR = ss(q.kisl, q.kisl + .35, t) * (1 - ss(q.poluch + .1, q.poluch + .5, t));
    // центральная колба
    const h0 = 540, cx = 540, cyB = 1452;
    // левая колба (никотин) и правая (кислота) на штативах
    const rotL = lp(.15, 1.15, eio(pL)), rotR = -lp(.15, 1.15, eio(pR));
    const L = [240, 860], R = [840, 860], hs = 300;
    standClamp(c, 120, 1450, L[0] + hs * .6 * Math.sin(rotL), L[1] - hs * .6 * Math.cos(rotL)); standClamp(c, 960, 1450, R[0] + hs * .6 * Math.sin(rotR), R[1] - hs * .6 * Math.cos(rotR));
    const mL = [L[0] + hs * Math.sin(rotL), L[1] - hs * Math.cos(rotL)], mR = [R[0] + hs * Math.sin(rotR), R[1] - hs * Math.cos(rotR)];
    stream(c, mL[0], mL[1], cx - 24, cyB - h0 + 10, '#ffb54a', 12, t, sL); stream(c, mR[0], mR[1], cx + 24, cyB - h0 + 10, '#3fd3c6', 12, t, sR);
    c.save(); c.translate(L[0], L[1]); flask(c, hs, t, { rot: rotL, lv: lp(.55, .2, pL * (sL > 0 ? 1 : .6) + mix * .2), col: '#ffb54a', label: 'НИКОТИН' }); c.restore();
    c.save(); c.translate(R[0], R[1]); flask(c, hs, t, { rot: rotR, lv: lp(.55, .2, pR), col: '#3fd3c6', label: 'КИСЛОТА' }); c.restore();
    const col = mixh('#ffb54a', '#ffe08a', mix), sk = ss(q.sol - .3, q.sol + .3, t);
    c.save(); c.translate(cx, cyB); flask(c, h0, t, { lv: lp(.12, .56, mix), col, glow: .35 + .6 * sk }); c.restore();
    // соль: кристаллы растут внутри
    if (sk > 0) for (let i = 0; i < 5; i++) { const k = ss(q.sol - .3 + i * .12, q.sol + .3 + i * .12, t); if (k <= 0) continue; c.save(); c.translate(cx + [-90, 70, -20, 120, -130][i], cyB - 60 - [20, 10, 80, 60, 40][i]); c.rotate([-.3, .25, .05, .4, -.5][i]); crystal(c, [110, 90, 140, 70, 80][i] * eb(k), t + i, k); c.restore() }
    glow(c, cx, cyB - 160, 420, 300, '#ffc24a', .5 * sk);
    c.restore();
    pill(c, 'НИКОТИНОВАЯ СОЛЬ', 540, 320, cl((t - q.nikot2 + .05) / .4), { s: 24 });
    bokehBig(c, t, 141, ['#8fd6ff', '#ffc24a'], .9, 8); motes(c, t, 41, 26, '#d8f0ff', .45);
  }

  // --- A14: 1979, табачная лавка ночью; в продаже нет ничего, во что залить жидкость ---
  function shotShop(c, t, u) {
    const q = Q, sc = lp(1, 1.12, ss(0, 4.4, u));
    c.save(); c.translate(540, 1050); c.scale(sc, sc); c.translate(-540, -1050);
    skyG(c, [[0, '#0b0910'], [1, '#050407']]);
    // кирпич
    c.save(); c.globalAlpha = .55; for (let r = 0; r < 70; r++) for (let i = 0; i < 12; i++) { const bx = i * 100 - (r % 2) * 50, by = r * 30; c.fillStyle = `rgb(${40 + 16 * H2(i, r)},${20 + 8 * H2(r, i)},${22 + 6 * H2(i + 3, r)})`; c.fillRect(bx + 2, by + 2, 96, 26) } c.restore();
    // витрина
    const wx = 110, wy = 620, ww = 860, wh = 760;
    c.save(); c.beginPath(); c.rect(wx, wy, ww, wh); c.clip();
    c.fillStyle = lg(c, 0, wy, 0, wy + wh, [[0, '#ffcf8a'], [.6, '#e48a46'], [1, '#7a3a22']]); c.fillRect(wx, wy, ww, wh);
    for (let r = 0; r < 3; r++) { const sy = wy + 170 + r * 170; c.fillStyle = '#5a2a14'; c.fillRect(wx, sy, ww, 14);
      for (let i = 0; i < 12; i++) { const px = wx + 20 + i * 70, ph = 96, pc = ['#b8382c', '#f2ece0', '#2a5aa0', '#c9a24a', '#3a7a4a', '#7a2a5a'][(i * 3 + r) % 6];
        c.fillStyle = pc; c.fillRect(px, sy - ph, 54, ph); c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(px, sy - ph, 54, 20); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(px + 42, sy - ph, 12, ph) } }
    // прилавок: колба светится, рядом — пунктир того, чего ещё нет
    const cy0 = wy + wh - 230; c.fillStyle = lg(c, 0, cy0, 0, wy + wh, [[0, '#4a2412'], [.1, '#2a1208'], [1, '#170904']]); c.fillRect(wx, cy0, ww, 230);
    c.fillStyle = 'rgba(255,210,150,.35)'; c.fillRect(wx, cy0, ww, 3);
    c.fillStyle = 'rgba(20,8,4,.55)'; c.filter = 'blur(30px)'; c.fillRect(wx + 150, cy0 - 360, 680, 360); c.filter = 'none';
    c.save(); c.translate(380, cy0 + 4); flask(c, 300, t, { lv: .55, col: '#ffb54a', glow: .9 }); c.restore();
    const bl = t > q.zaliv ? .6 + .4 * Math.sin((t - q.zaliv) * 9) : .9;
    c.save(); c.translate(700, cy0 + 4); c.lineJoin = 'round';
    c.setLineDash([]); c.strokeStyle = 'rgba(20,8,4,.75)'; c.lineWidth = 12; vapeOutline(c, 380); c.stroke();
    c.setLineDash([16, 11]); c.strokeStyle = `rgba(255,255,255,${bl})`; c.lineWidth = 5; c.shadowColor = '#ffffff'; c.shadowBlur = 12; vapeOutline(c, 380); c.stroke(); c.setLineDash([]); c.shadowBlur = 0;
    tx(c, '?', 0, -140, { f: 'O', w: 700, s: 110, c: `rgba(255,255,255,${bl})`, sh: 'rgba(20,8,4,.8)', sb: 14 }); c.restore();
    c.fillStyle = 'rgba(255,255,255,.08)'; c.beginPath(); c.moveTo(wx, wy); c.lineTo(wx + 260, wy); c.lineTo(wx + 60, wy + wh); c.lineTo(wx, wy + wh); c.fill();
    c.restore();
    c.fillStyle = '#1c0d08'; c.fillRect(wx - 20, wy - 20, ww + 40, 20); c.fillRect(wx - 20, wy + wh, ww + 40, 30); c.fillRect(wx - 20, wy, 20, wh); c.fillRect(wx + ww, wy, 20, wh);
    glow(c, 540, wy + wh / 2, 700, 600, '#ffb46b', .5);
    neonText(c, 'TOBACCO', 540, 520, 120, '#ff8a3d', 1, t);
    glow(c, 540, 480, 420, 140, '#ff8a3d', .5);
    // тротуар, отражение витрины
    c.fillStyle = lg(c, 0, 1410, 0, HH, [[0, '#2a1a14'], [1, '#08050a']]); c.fillRect(-100, 1410, WW + 200, 600);
    c.save(); c.globalAlpha = .25; c.fillStyle = lg(c, 0, 1410, 0, 1700, [[0, '#ffb46b'], [1, 'rgba(255,180,107,0)']]); c.fillRect(wx, 1410, ww, 290); c.restore();
    c.restore();
    pill(c, 'ЭЛЕКТРОННЫХ СИГАРЕТ ЕЩЁ НЕТ', 540, 300, cl((t - q.elek + .05) / .4));
    bokehBig(c, t, 151, ['#ffb46b', '#ff8a3d'], .9, 8); motes(c, t, 43, 22, '#ffe0b0', .4);
  }

  // --- A15: архив — проход между стеллажами (перспектива), папку прячут, свет гаснет ---
  function shotArchive(c, t, u) {
    const q = Q, F = 640, VX = 540, VY = 880, dz = lp(0, .9, ss(0, 3.2, u));
    const P = (X, Y, z) => [VX + X * F / (z - dz), VY - Y * F / (z - dz)];
    const lampOff = i => ss(q.arhiv - .12 + (5 - i) * .09, q.arhiv - .06 + (5 - i) * .09, t);   // гаснут от дальних к ближним
    const on = [1, 2, 3, 4, 5].map(i => 1 - lampOff(i));
    skyG(c, [[0, '#0b0a0c'], [1, '#050405']]);
    const wallC = (z) => { const L = cl(1.6 / z); return `rgb(${18 + 30 * L | 0},${15 + 22 * L | 0},${12 + 14 * L | 0})` };
    // пол и потолок
    for (let z = 14; z > 1.2; z -= .5) {
      const [x0, y0] = P(-1.1, -.8, z), [x1] = P(1.1, -.8, z), [, y1] = P(0, -.8, z - .5), [, yc0] = P(0, .95, z), [, yc1] = P(0, .95, z - .5);
      const lum = on.reduce((s, k, i) => s + k * Math.exp(-Math.abs(z - (i + 1) * 2.2) * 1.2), 0) * .5;
      c.fillStyle = `rgb(${14 + 50 * lum | 0},${12 + 34 * lum | 0},${10 + 20 * lum | 0})`; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y0); const [x3, y3] = P(1.1, -.8, z - .5), [x2] = P(-1.1, -.8, z - .5); c.lineTo(x3, y3); c.lineTo(x2, y3); c.fill();
      c.fillStyle = '#080706'; const [cx0, cy0] = P(-1.1, .95, z), [cx1] = P(1.1, .95, z), [cx3, cy3] = P(1.1, .95, z - .5), [cx2] = P(-1.1, .95, z - .5); c.beginPath(); c.moveTo(cx0, cy0); c.lineTo(cx1, cy0); c.lineTo(cx3, cy3); c.lineTo(cx2, cy3); c.fill();
    }
    // стеллажи с коробками по обе стороны
    for (let z = 14; z > 1.2; z -= 1.2) for (const side of [-1, 1]) {
      const z1 = z - 1.2, lum = on.reduce((s, k, i) => s + k * Math.exp(-Math.abs(z - .6 - (i + 1) * 2.2) * 1.1), 0) * .6;
      const quad = (Y0, Y1, za, zb, col) => { const [a0, b0] = P(side, Y0, za), [a1, b1] = P(side, Y1, za), [a2, b2] = P(side, Y1, zb), [a3, b3] = P(side, Y0, zb); c.fillStyle = col; c.beginPath(); c.moveTo(a0, b0); c.lineTo(a1, b1); c.lineTo(a2, b2); c.lineTo(a3, b3); c.closePath(); c.fill() };
      quad(-.8, .9, z, z1, `rgb(${10 + 18 * lum | 0},${9 + 14 * lum | 0},${8 + 10 * lum | 0})`);
      for (const Y of [-.72, -.3, .12, .54]) {
        let zz = z - .05; let k = 0;
        while (zz > z1 + .1) { const bw = .25 + .15 * H1(z * 7 + Y * 13 + k + side), bh = .26 + .08 * H1(k * 3 + z), zb = Math.max(z1 + .05, zz - bw), v = H1(z * 3 + Y * 5 + k * 9 + side * 2);
          const base = v > .85 ? [200, 170, 120] : [150 + 40 * v, 105 + 30 * v, 60 + 20 * v];
          quad(Y + .02, Y + .02 + bh, zz, zb, `rgb(${base[0] * (.15 + .85 * lum) | 0},${base[1] * (.15 + .85 * lum) | 0},${base[2] * (.15 + .85 * lum) | 0})`);
          const ym = Y + .02 + bh * .55; quad(ym - .04, ym + .03, zz - (zz - zb) * .3, zb + (zz - zb) * .3, `rgba(240,232,210,${.15 + .7 * lum})`);
          zz = zb - .03; k++ }
        quad(Y - .02, Y + .02, z, z1, `rgb(${60 * (.2 + .8 * lum) | 0},${50 * (.2 + .8 * lum) | 0},${40 * (.2 + .8 * lum) | 0})`);
      }
      quad(-.8, .9, z, z - .05, `rgb(${70 * (.2 + .8 * lum) | 0},${58 * (.2 + .8 * lum) | 0},${44 * (.2 + .8 * lum) | 0})`);
    }
    // лампы на потолке
    for (let i = 5; i >= 1; i--) { const z = i * 2.2; if (z - dz < .5) continue; const [lx, ly] = P(0, .8, z), s = F / (z - dz) / 640, k = on[i - 1];
      c.fillStyle = '#1a1612'; c.beginPath(); c.moveTo(lx - 70 * s, ly + 22 * s); c.lineTo(lx + 70 * s, ly + 22 * s); c.lineTo(lx + 26 * s, ly - 20 * s); c.lineTo(lx - 26 * s, ly - 20 * s); c.fill();
      c.fillStyle = `rgba(255,230,180,${k})`; c.beginPath(); c.ellipse(lx, ly + 22 * s, 64 * s, 9 * s, 0, 0, TAU); c.fill();
      lampCone(c, lx, ly + 20 * s, 700 * s, 1100 * s, '#ffd9a0', .55 * k); glowDot(c, lx, ly + 22 * s, 140 * s, '#ffd28a', .8 * k) }
    // папку «НИКОТИНОВАЯ СОЛЬ» задвигают в коробку справа
    const fk = eio(cl((t - q.spryat + .15) / .6)), [fx, fy] = P(.98, .2, 2.4), fs = F / (2.4 - dz) / 640;
    if (fk < 1) { const x = lp(640, fx, fk), y = lp(1350, fy, fk), s = lp(1, fs * .55, fk);
      c.save(); c.translate(x, y); c.scale(s, s); c.rotate(lp(-.08, 0, fk)); const f = cache('fold9b', 360, 470, (xx, W, H) => folderArt(xx, W, H)); c.globalAlpha = 1 - fk * .6; c.drawImage(f, -180, -235); c.restore() }
    const dark = ss(q.arhiv + .22, q.arhiv + .42, t); if (dark > 0) { c.fillStyle = `rgba(0,0,0,${dark * .7})`; c.fillRect(0, 0, WW, HH) }
    pill(c, 'АРХИВ · 1979', 540, 320, cl((t - q.sekr7 + .1) / .4));
    motes(c, t, 47, 26, '#ffe0b0', .35 * (1 - dark));
  }

  // ================= сделка и конец =================
  // --- B1: 40 школьников-кубиков, 11 загораются (27,5 %) — приём с 1:24 у референса ---
  function cam3(cx, cy, cz, tx3, ty3, tz3) {
    let fx = tx3 - cx, fy = ty3 - cy, fz = tz3 - cz; const fl = Math.hypot(fx, fy, fz); fx /= fl; fy /= fl; fz /= fl;
    let rx = fz, ry = 0, rz = -fx; const rl = Math.hypot(rx, rz); rx /= rl; rz /= rl;            // right = up × forward (up = 0,1,0)
    const ux = fy * rz - fz * ry, uy = fz * rx - fx * rz, uz = fx * ry - fy * rx;
    return (x, y, z, F = 1500, VX = 540, VY = 960) => { const dx = x - cx, dy = y - cy, dz = z - cz, X = dx * rx + dy * ry + dz * rz, Y = dx * ux + dy * uy + dz * uz, Z = dx * fx + dy * fy + dz * fz; return [VX + X * F / Z, VY - Y * F / Z, Z] };
  }
  function cubeDraw(c, pr, x, y, z, s, col, camX) {
    const v = (a, b, d) => pr(x + a * s, y + b * s, z + d * s), h = s / 2;
    const P8 = [v(-.5, 0, -.5), v(.5, 0, -.5), v(.5, 0, .5), v(-.5, 0, .5), v(-.5, 1, -.5), v(.5, 1, -.5), v(.5, 1, .5), v(-.5, 1, .5)];
    const face = (ids, fill) => { c.fillStyle = fill; c.beginPath(); ids.forEach((i, k) => k ? c.lineTo(P8[i][0], P8[i][1]) : c.moveTo(P8[i][0], P8[i][1])); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1; c.stroke() };
    if (x > camX) face([0, 3, 7, 4], col[2]); else face([1, 2, 6, 5], col[2]);
    face([0, 1, 5, 4], col[1]); face([4, 5, 6, 7], col[0]);
    return P8;
  }
  function shotCubes(c, t, u) {
    const q = Q, k = ss(0, 4.2, u), camX = lp(-1.6, .6, k), camY = lp(7.5, 11, k), camZ = lp(-9.5, -13.5, k);
    const pr0 = cam3(camX, camY, camZ, 0, .5, 3.1), pr = (x, y, z) => pr0(x, y, z, 1000, 540, 1010);
    skyG(c, [[0, '#050b18'], [.5, '#0b1a33'], [1, '#040812']]);
    glow(c, 540, 1000, 800, 600, '#2a5aa8', .35);
    const N = [], cols = 8, rows = 5, red = new Set([3, 6, 9, 12, 17, 20, 25, 28, 31, 36, 39]);
    for (let r = 0; r < rows; r++) for (let i = 0; i < cols; i++) { const id = r * cols + i, x = (i - (cols - 1) / 2) * 1.55, z = r * 1.55;
      const ord = [...red].indexOf(id), tk = ord < 0 ? 0 : ss(q.kazhd - .1 + ord * .07, q.kazhd + .15 + ord * .07, t);
      N.push({ id, x, z, tk, d: Math.hypot(x - camX, camY, z - camZ) }) }
    N.sort((a, b) => b.d - a.d);
    const layerOf = n => n.z > 4.6 ? 0 : n.z < 1 ? 2 : 1;
    for (const L of [0, 1, 2]) layer(c, 11 + L, [3.2, 0, 1.6][L], x => {
      for (const n of N) { if (layerOf(n) !== L) continue;
        const W = ['#f3efe6', '#c8c2b8', '#a49d93'], O = ['#ffb36b', '#ec7a32', '#c25a22'], col = [0, 1, 2].map(j => mixh(W[j], O[j], n.tk));
        const s = 1 + .18 * Math.sin(Math.PI * cl(n.tk * 1.2)) * (n.tk < 1 ? 1 : 0);
        cubeDraw(x, pr, n.x, 0, n.z, s, col, camX);
        if (n.tk > .3) { const [gx, gy] = pr(n.x, .6, n.z); glowDot(x, gx, gy, 120, '#ff8a3d', .55 * n.tk) } }
    });
    // пар над «загоревшимися»
    for (const n of N) if (n.tk > .5) { const [px, py] = pr(n.x, 1.1, n.z); smoke(c, t, px, py, { n: 6, life: 2.2, rise: 160, sway: 14, drift: 10, spread: 6, r0: 8, r1: 46, a: .35 * n.tk, seed: n.id * 3, col: '#ffe1d0', from: q.kazhd + .2 }) }
    pill(c, '2015 → 2019', 540, 380, cl((t - q.chetyre + .05) / .4) * (1 - cl((t - q.kazhd) / .3)));
    goldNum(c, '27,5 %', 540, 560, 230, cl((t - q.starsh + .1) / .5), { sub: 'СТАРШЕКЛАССНИКИ США · 2019' });
    bokehBig(c, t, 161, ['#7fb0ff', '#ffb36b'], .8, 8); motes(c, t, 53, 26, '#cfe0ff', .4);
    if (u < .35) { c.fillStyle = `rgba(0,0,0,${1 - eo(u / .35)})`; c.fillRect(0, 0, WW, HH) }   // проба: вход после пропуска середины
  }

  // --- B2: треть компании за $12,8 млрд уходит производителю «Мальборо» ---
  function pieDisc(c, cx, cy, rx, ry, h, a0, a1, col, o = {}) {   // сектор «шайбы» (верх + видимая боковина)
    const seg = (a, b) => { c.beginPath(); c.moveTo(cx, cy); c.ellipse(cx, cy, rx, ry, 0, a, b); c.closePath() };
    // боковина — только передняя часть (sin > 0)
    const s0 = Math.max(a0, 0), s1 = Math.min(a1, Math.PI);
    if (s1 > s0) { c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, s0, s1); c.lineTo(cx + rx * Math.cos(s1), cy + ry * Math.sin(s1) + h); c.ellipse(cx, cy + h, rx, ry, 0, s1, s0, true); c.closePath();
      c.fillStyle = lg(c, cx - rx, 0, cx + rx, 0, [[0, mixh(col, '#000000', .55)], [.5, mixh(col, '#000000', .25)], [1, mixh(col, '#000000', .45)]]); c.fill() }
    for (const a of [a0, a1]) if (Math.sin(a) > -.2) { c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + rx * Math.cos(a), cy + ry * Math.sin(a)); c.lineTo(cx + rx * Math.cos(a), cy + ry * Math.sin(a) + h); c.lineTo(cx, cy + h); c.closePath(); c.fillStyle = mixh(col, '#000000', .35); c.fill() }
    seg(a0, a1); c.fillStyle = lg(c, cx - rx, cy - ry, cx + rx, cy + ry, [[0, mixh(col, '#ffffff', .25)], [1, col]]); c.fill();
    c.strokeStyle = o.rim || 'rgba(255,255,255,.35)'; c.lineWidth = 2; c.stroke();
  }
  function monolith(c, x, base, w, h, t) {
    const d = w * .28;
    c.save(); c.fillStyle = lg(c, x, base - h, x, base, [[0, '#8a0f14'], [.4, '#c4141c'], [1, '#4a0508']]); c.fillRect(x - w / 2, base - h, w, h);
    c.beginPath(); c.moveTo(x + w / 2, base - h); c.lineTo(x + w / 2 + d, base - h - d * .5); c.lineTo(x + w / 2 + d, base - d * .5); c.lineTo(x + w / 2, base); c.closePath(); c.fillStyle = lg(c, x + w / 2, 0, x + w / 2 + d, 0, [[0, '#5a080c'], [1, '#2a0306']]); c.fill();
    c.beginPath(); c.moveTo(x - w / 2, base - h); c.lineTo(x - w / 2 + d, base - h - d * .5); c.lineTo(x + w / 2 + d, base - h - d * .5); c.lineTo(x + w / 2, base - h); c.closePath(); c.fillStyle = lg(c, x, base - h - d * .5, x, base - h, [[0, '#ff8a7a'], [1, '#e0303a']]); c.fill();
    c.globalCompositeOperation = 'screen'; c.fillStyle = lg(c, x - w / 2, 0, x - w / 2 + 40, 0, [[0, 'rgba(255,120,110,.6)'], [1, 'rgba(255,120,110,0)']]); c.fillRect(x - w / 2, base - h, 40, h);
    c.restore();
  }
  function shotDeal(c, t, u) {
    const q = Q, pan = eio(cl((t - q.vykup + .1) / 1.0)), cam = lp(0, -560, pan), lift = eo(cl((t - q.tret + .05) / .5)), fly = eio(cl((t - q.vykup) / .95)), hit = cl((t - q.marl) / .3);
    c.save(); c.translate(cam, 0);
    skyG(c, [[0, '#07060c'], [1, '#030205']]);
    glow(c, 540, 1100, 700, 500, '#3a5a8a', .35); glow(c, 1300, 1000, 700, 800, '#ff2a20', .5 * (.4 + .6 * pan));
    beam(c, 540, -200, 0, .55, 1500, '#cfe0ff', .45);
    beam(c, 1300, -200, 0, .65, 1700, '#ff6a5a', .5 * pan);
    // постамент и «компания»
    c.fillStyle = lg(c, 0, 1500, 0, 1800, [[0, '#262e3e'], [1, '#07090e']]); c.beginPath(); c.ellipse(540, 1500, 360, 100, 0, 0, TAU); c.fill(); c.fillRect(180, 1500, 720, 400);
    c.fillStyle = 'rgba(190,215,255,.35)'; c.beginPath(); c.ellipse(540, 1500, 360, 100, 0, Math.PI, TAU); c.lineWidth = 3; c.strokeStyle = 'rgba(190,215,255,.4)'; c.stroke();
    const cx = 540, cy = 1390, rx = 320, ry = 96, h = 64, a0 = -.25, a1 = a0 + TAU * .35;
    glow(c, cx, cy, 460, 220, '#7fb0ff', .35);
    pieDisc(c, cx, cy, rx, ry, h, a1, a0 + TAU, '#6a8098', { rim: 'rgba(220,235,255,.7)' });
    // доля 35 %: поднимается, потом улетает к монолиту
    const mid = (a0 + a1) / 2, ox = Math.cos(mid) * 90 * lift, oy = Math.sin(mid) * 28 * lift - 80 * lift;
    const tx2 = lp(cx + ox, 1300 - 60, fly), ty2 = lp(cy + oy, 900, fly) - Math.sin(Math.PI * fly) * 260, sc2 = lp(1, .55, fly);
    if (hit < 1) { c.save(); c.translate(tx2, ty2); c.scale(sc2, sc2); c.translate(-cx, -cy); pieDisc(c, cx, cy, rx, ry, h, a0, a1, '#ffb23e', { rim: 'rgba(255,240,200,.9)' }); glow(c, cx + 150, cy + 40, 260, 160, '#ffb23e', .6); c.restore() }
    tx(c, 'JUUL', cx - 90, cy + 12, { f: 'O', w: 700, s: 50, ls: 6, c: 'rgba(240,246,255,.92)', sh: 'rgba(0,0,0,.6)', sb: 8 });
    // монолит «Мальборо»
    c.save(); const sh = hit > 0 && hit < 1 ? (H1(Math.floor(t * 60)) - .5) * 20 * (1 - hit) : 0; c.translate(sh, 0); monolith(c, 1330, 1720, 360, 1050, t); c.restore();
    if (hit > 0 && hit < 1) { glowDot(c, 1300, 820, 500 * hit, '#ffd28a', 1.2 * (1 - hit)) }
    c.fillStyle = lg(c, 0, 1700, 0, HH, [[0, '#0a0608'], [1, '#030203']]); c.fillRect(-200, 1700, 2400, 400);
    c.restore();
    goldNum(c, '$12,8 МЛРД', 540, 560, 140, cl((t - q.trin + .05) / .5) * (1 - pan), { sub: '35 % JUUL · 20.12.2018' });
    pill(c, 'ALTRIA · ПРОИЗВОДИТЕЛЬ «МАЛЬБОРО»', 540, 420, cl((t - q.proizv + .05) / .4));
    bokehBig(c, t, 171, ['#ff6a5a', '#ffb23e'], .9, 8); motes(c, t, 59, 24, '#ffd0c0', .4);
  }

  // --- B4: «Старый план сработал идеально» — записка 1973, зелёный штамп ---
  function shotPlan(c, t, u) {
    const q = Q, sc = lp(1.1, 1, ss(0, 2.4, u));
    const L = LY[8] || (LY[8] = mk(WW, HH)), x = L.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.filter = 'none'; x.globalCompositeOperation = 'source-over';
    x.save(); x.translate(540, 960); x.scale(sc, sc); x.rotate(.02); x.translate(-540, -960);
    deskTop(x);
    x.save(); x.translate(540, 860); x.rotate(-.04);
    x.fillStyle = 'rgba(0,0,0,.5)'; x.filter = 'blur(24px)'; x.fillRect(-MEMO.w / 2 + 20, -MEMO.h / 2 + 30, MEMO.w, MEMO.h); x.filter = 'none';
    x.drawImage(memoCanvas(q.e4 + 5), -MEMO.w / 2, -MEMO.h / 2); x.restore();
    x.restore();
    x.save(); x.globalCompositeOperation = 'multiply'; x.fillStyle = rg(x, 300, 520, 200, 1500, [[0, 'rgba(255,236,200,1)'], [.6, 'rgba(200,150,110,1)'], [1, 'rgba(60,35,25,1)']]); x.fillRect(0, 0, WW, HH); x.restore();
    glow(x, 320, 560, 700, 520, '#ffd28a', .35);
    dofV(c, L, 520, 1300, 6);
    stamp(c, 'ПЛАН ВЫПОЛНЕН', 560, 1000, -.1, t, q.ideal - .02, '#16a84a', 104, { a: 1 }); stamp(c, 'ПЛАН ВЫПОЛНЕН', 560, 1000, -.1, t, q.ideal - .02, '#16a84a', 104, { a: .7, ring: false });
    bokehBig(c, t, 181, ['#ffd28a'], .8, 6); motes(c, t, 61, 20, '#ffe6c0', .4);
  }

  // --- B5: «Признайтесь… вам ведь и сейчас захотелось… затянуться?» ---
  function shotTempt(c, t, u) {
    const q = Q, sc = lp(1, 1.18, ss(0, 4.4, u)), zk = cl((t - q.zat + .05) / .6), led = .3 + .7 * (.5 + .5 * Math.sin(t * 2.4)) + 1.5 * zk;
    c.save(); c.translate(540, 900); c.scale(sc, sc); c.translate(-540, -900);
    skyG(c, [[0, '#06040a'], [1, '#020103']]);
    glow(c, 540, 900, 600, 800, '#ff4fa8', .22); glow(c, 540, 1500, 700, 250, '#4fe3ff', .18);
    beam(c, 540, -300, 0, .45, 1700, '#ffd0e8', .35);
    c.fillStyle = lg(c, 0, 1388, 0, HH, [[0, '#120a14'], [1, '#040205']]); c.fillRect(0, 1388, WW, HH);
    c.save(); c.translate(540, 2 * 1388); c.scale(1, -1); c.translate(0, 1388); c.globalAlpha = .22; vapeBar(c, 880, { led: led * .5, rim: '#ff8fd0' }); c.restore();
    c.fillStyle = lg(c, 0, 1388, 0, 1800, [[0, 'rgba(14,8,16,0)'], [1, 'rgba(8,4,10,1)']]); c.fillRect(0, 1388, WW, 420);
    c.save(); c.translate(540, 1388); vapeBar(c, 880, { led: Math.min(1.6, led), ledCol: zk > 0 ? '#ff5a8a' : '#9fe8ff', rim: '#ff8fd0' }); c.restore();
    smoke(c, t, 540, 1388 - 880, { n: 22, life: 4, rise: 600, sway: 60, drift: -40, spread: 18, r0: 24, r1: 200, a: .35, seed: 21, col: '#ffe1ec' });
    if (zk > 0) smoke(c, t, 540, 1388 - 900, { n: 40, life: 1.6, rise: 900, sway: 120, drift: 0, spread: 80, r0: 80, r1: 700, a: .9 * zk, seed: 33, col: '#f4ece2', from: q.zat - .05 });
    c.restore();
    bokehBig(c, t, 191, ['#ff6fb8', '#5fe3ff'], .9, 8); motes(c, t, 67, 24, '#ffe1ec', .45);
  }

  // --- B6: доска расследования — «одни и те же люди», «смотрите на YouTube» ---
  function corkBg9(c) {
    c.drawImage(cache('cork9', WW, HH, (x, W, H) => {
      x.fillStyle = '#7a5230'; x.fillRect(0, 0, W, H); const n = noiseTex('cork', 256, 256, 2.2, 3); x.globalCompositeOperation = 'multiply'; x.globalAlpha = .55; for (let yy = 0; yy < H; yy += 256) for (let xx = 0; xx < W; xx += 256) x.drawImage(n, xx, yy);
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; for (let i = 0; i < 2400; i++) { x.fillStyle = `rgba(${40 + 60 * H1(i)},${25 + 30 * H1(i * 2)},10,${.25 + .3 * H1(i * 3)})`; x.fillRect(H1(i * 5.1) * W, H1(i * 7.3) * H, 2 + 3 * H1(i * 9), 2 + 2 * H1(i * 11)) }
    }), 0, 0);
  }
  function card9(c, i, t, k) {
    const [yr, cap, x, y, rot, red] = BCARD[i]; if (k <= 0) return;
    const w = i ? 330 : 420, h = i ? 280 : 360, e = eb(k);
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(e, e);
    c.fillStyle = 'rgba(0,0,0,.55)'; c.filter = 'blur(14px)'; c.fillRect(-w / 2 + 12, -h / 2 + 18, w, h); c.filter = 'none';
    c.fillStyle = '#f1ece2'; c.fillRect(-w / 2, -h / 2, w, h);
    const ih = h - 96; c.fillStyle = '#16181d'; c.fillRect(-w / 2 + 16, -h / 2 + 16, w - 32, ih - 16);
    if (!red) { c.save(); c.beginPath(); c.rect(-w / 2 + 16, -h / 2 + 16, w - 32, ih - 16); c.clip(); glow(c, 0, -h / 2 + ih / 2, w * .6, ih * .6, '#ffb54a', .7); c.translate(0, -h / 2 + 16 + (ih - 16) / 2); crystal(c, ih * .62, t, 1); c.restore() }
    else { c.fillStyle = '#050505'; for (let s = 0; s < 6; s++) { c.save(); c.translate(-w / 2 + 16, -h / 2 + 16 + s * (ih - 16) / 6); c.beginPath(); c.moveTo(0, -4); c.lineTo(w - 32, 2); c.lineTo(w - 32, (ih - 16) / 6 + 6); c.lineTo(0, (ih - 16) / 6 + 2); c.fill(); c.restore() } tx(c, '?', 0, -h / 2 + ih / 2 + 30, { f: 'O', w: 700, s: 90, c: 'rgba(255,255,255,.25)' }) }
    const lab = yr + ' · ' + cap; let fs = i ? 32 : 40; while (fs > 18 && tw(c, lab, { f: 'O', w: 700, s: fs, ls: 1 }) > w - 30) fs -= 2;
    tx(c, lab, 0, h / 2 - 34, { f: 'O', w: 700, s: fs, ls: 1, c: '#1b1b1b' });
    c.restore();
  }
  function pin9(c, x, y) { shadowE(c, x + 6, y + 8, 14, 8, .6); c.fillStyle = rg(c, x - 4, y - 4, 1, 14, [[0, '#ff8a80'], [.5, '#d0242a'], [1, '#6a0c10']]); c.beginPath(); c.arc(x, y, 13, 0, TAU); c.fill() }
  function shotBoard(c, t, u) {
    const q = Q, zo = eio(cl((t - q.s15) / 3.6)), sc = lp(1.5, 1, zo) * lp(1, 1.06, ss(q.kto, q.yt + .5, t)), fx = lp(540, 540, zo), fy = lp(860, 900, zo);
    skyG(c, [[0, '#0a0706'], [1, '#040302']]);
    c.save(); c.translate(fx, fy); c.scale(sc, sc); c.translate(-540, -900);
    corkBg9(c);
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = rg(c, 540, 700, 200, 1300, [[0, 'rgba(255,240,215,1)'], [.6, 'rgba(170,120,80,1)'], [1, 'rgba(30,18,10,1)']]); c.fillRect(-300, -300, WW + 600, HH + 600); c.restore();
    lampCone(c, 540, -200, 1600, 1700, '#ffe2b8', .45);
    const ck = i => (t - (q.s15 - .2 + i * .25)) / .4, nk = at(t, q.odni - .25, q.lyud + .25);
    for (let i = 1; i < 5; i++) { const [, , x, y] = BCARD[i], [, , x0, y0] = BCARD[0], e = eo(cl(nk * 1.2 - (i - 1) * .1)); if (e <= 0) continue;
      const mx = (x0 + x) / 2, my = Math.max(y0, y) * .5 + (y0 + y) * .25 + 60; c.save(); c.strokeStyle = '#d0242a'; c.lineWidth = 5; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 8; c.shadowOffsetY = 6;
      c.beginPath(); c.moveTo(x0, y0 - 160); for (let s = 1; s <= 20 * e; s++) { const kk = s / 20, px = (1 - kk) * (1 - kk) * x0 + 2 * kk * (1 - kk) * mx + kk * kk * x, py = (1 - kk) * (1 - kk) * (y0 - 160) + 2 * kk * (1 - kk) * my + kk * kk * (y - 120); c.lineTo(px, py) } c.stroke(); c.restore() }
    for (let i = 4; i >= 0; i--) card9(c, i, t, ck(i));
    for (let i = 0; i < 5; i++) if (ck(i) > .5) pin9(c, BCARD[i][2], BCARD[i][3] - (i ? 135 : 175));
    c.restore();
    c.save(); const sk2 = cl((t - q.yt - .05 + .16) / .16); if (sk2 > 0) { c.globalAlpha = sk2 * .85; c.fillStyle = 'rgba(245,238,226,.92)'; c.save(); c.translate(540, 1060); c.rotate(-.08); rr(c, -400, -95, 800, 190, 10); c.fill(); c.restore() } c.restore();
    stamp(c, 'ТОЛЬКО НА YOUTUBE', 540, 1060, -.08, t, q.yt + .05, '#e3201a', 84, { a: 1 });
    motes(c, t, 71, 24, '#ffe6c4', .5);
  }
  // --- B7: петля — тот же город, камера приходит ровно в первый кадр ---
  function shotLoop(c, t, u, sh) {
    const d = Math.max(.5, Q.endT - sh.a), k = ss(0, d, u);
    shotCity(c, t - Q.endT, u, { cam: () => ({ s: lp(1.12, 1, k), px: lp(40, 0, k) }) });
  }
  // звуки по событиям
  function sounds(q) {
    cue(0, 'city', .5); cue(.02, 'whoosh', .4); cue(.95, 'vape', .45); cue(q.odn + .05, 'shimmer', .3);
    cue(q.chto2 - .08, 'swish', .35); cue(q.zam - .05, 'whoosh', .45, -.3); cue(q.zam + .4, 'thud', .3, .2); cue(q.bez - .1, 'puff', .6); cue(q.parom, 'vape', .4); cue(q.mango - .05, 'shimmer', .35, -.3); cue(q.myaty - .05, 'ding', .25, .3);
    cue(q.s1 - .1, 'whoosh', .4); cue(q.s1 + .1, 'xray', .5); cue(q.zhid, 'bubble', .45); cue(q.izobr - .12, 'deep', .55); cue(q.gig, 'factory', .7); cue(q.p50, 'impact', .45); cue(q.p50 + .02, 'shimmer', .35);
    cue(q.s2 - .15, 'whoosh', .6); for (let tt = q.s2; tt < q.s2 + .85; tt += .07) cue(tt, 'tick', .22); cue(q.y73 + .1, 'impact', .6); cue(q.tab - .05, 'deep', .55); cue(q.rey, 'pin', .4);
    cue(q.sozd - .1, 'swish', .3); cue(q.camel - .05, 'buzz', .55, -.3); cue(q.winston - .05, 'buzz', .55, .3); cue(q.camel, 'zap', .25, -.3); cue(q.winston, 'zap', .25, .3);
    cue(q.gotov - .15, 'whoosh', .3); cue(q.gotov - .05, 'typing', .8); cue(q.sekr + .02, 'stamp', .9); cue(q.s3, 'whoosh', .35);
    cue(q.s4 - .12, 'papers', .4); for (let i = 0; i < 7; i++) cue(q.qt[i], 'marker', i === 6 ? .45 : .26, .15);
    cue(q.s5 - .1, 'swish', .3); cue(q.s5 + .2, 'puff', .4); cue(q.dym, 'sniff', .35); cue(q.edkiy - .3, 'whoosh', .35); cue(q.edkiy, 'deep', .45); cue(q.deret, 'impact', .45); cue(q.gorlo, 'heart', .55); cue(q.gorlo + .7, 'heart', .45);
    cue(q.s6 - .1, 'swish', .35); cue(q.nikot - .1, 'pour', .7, -.3); cue(q.kisl - .1, 'pour', .7, .3); cue(q.poluch, 'bubble', .7); cue(q.sol - .1, 'shimmer', .5); cue(q.sol, 'ding', .35);
    cue(q.kot - .2, 'whoosh', .3); cue(q.myagko, 'ding', .3); cue(q.uboy - .2, 'whirr', .45); cue(q.doze, 'impact', .35);
    cue(q.s7 - .1, 'swish', .3); cue(q.elek, 'buzz', .3); cue(q.prod, 'pin', .3); cue(q.zaliv, 'glass', .35); cue(q.vochto, 'drip', .4);
    cue(q.sekr7 - .2, 'whoosh', .35); cue(q.sekr7, 'papers', .45); cue(q.spryat, 'drawer', .9); cue(q.arhiv + .02, 'thud', .55); for (let i = 0; i < 5; i++) cue(q.arhiv - .1 + i * .09, 'tick', .45);
    cue(77.52, 'whoosh', .35); cue(q.chetyre, 'pin', .3); for (let i = 0; i < 11; i++) cue(q.kazhd - .05 + i * .07, 'tick', .3); cue(q.starsh, 'impact', .45); cue(q.starsh + .02, 'shimmer', .3);
    cue(q.tret - .2, 'whoosh', .4); cue(q.tret, 'whirr', .35); cue(q.trin, 'coins', .45); cue(q.vykup - .1, 'whoosh', .55); cue(q.marl, 'impact', .8); cue(q.marl + .02, 'thud', .6);
    cue(q.s13 - .1, 'deep', .45); cue(q.ideal - .02, 'stamp', 1);
    cue(q.s14 - .1, 'deep', .35); cue(q.zat - .1, 'vape', .9); cue(q.zat + .5, 'puff', .9);
    cue(q.b0 - .2, 'deep', .5); cue(q.odni - .2, 'marker', .4); cue(q.lyud - .2, 'tick', .4); cue(q.yt + .05, 'stamp', 1); cue(q.yt + .08, 'thud', .55);
    cue(q.q1v - .45, 'whoosh', .4); cue(q.q2, 'ding', .3); cue(q.endT - .25, 'whoosh', .5);
  }

  // ================= план ролика: каждый план — от слов диктора =================
  window.CUES = window.CUES || {};
  const cue = (t0, name, gain = 1, pan = 0) => { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, pan] };
  function stub(c, t, u) { skyG(c, [[0, '#111'], [1, '#000']]); tx(c, 'ВНЕ ПРОБЫ', WW / 2, HH / 2, { f: 'O', w: 700, s: 80, c: 'rgba(255,255,255,.2)' }) }
  const SHOTS = {};   // имя плана → функция (заполняют части с планами)
  const S_ = n => SHOTS[n] || stub;
  function build(tl) {
    const S = tl.sent, nrm = s => cueNorm(s), ALL = S.flatMap(x => x.words);
    const find = (cu, n) => { const q = nrm(cu); let k = 0; for (const x of ALL) { const d = nrm(x.d); if (d === q || (q.length > 3 && d.startsWith(q))) { if (k++ === n) return x } } console.warn('нет слова', cu, n); return ALL[0] };
    const W = (cu, n = 0) => find(cu, n).a, WB = (cu, n = 0) => find(cu, n).b, s = i => S[i].a, se = i => S[i].b;
    const QW = ['мы', 'должны', 'получить', 'свою', 'долю', 'молодёжного', 'рынка'];
    Q = { odn: W('одноразках'), chto2: W('что', 1), modn: W('модная'), zam: W('замена'), sig: W('сигаретам'), bez: W('безобидным'), parom: W('паром'), vkus: W('вкусом'), mango: W('манго'), myaty: W('мяты'), e0: se(0),
      s1: s(1), zhid: W('жидкость'), vnutri: W('внутри'), izobr: W('изобрели'), tab1: W('табачные'), gig: W('гиганты'), p50: W('пятьдесят'), nazad: W('назад'),
      s2: s(2), vern: W('вернёмся'), y73: W('1973'), tab: W('табачная'), imp: W('империя'), rey: W('рейнольдс'), sozd: W('создатель'), camel: W('camel'), winston: W('winston'), gotov: W('готовит'), sekr: W('секретный'), otch: W('отчёт'),
      s3: s(3), cel: W('цель'), dok: W('документа'), zvuch: W('звучала'), pryamo: W('прямо'), s4: s(4), qt: QW.map(q => W(q)), qtB: QW.map(q => WB(q)), e4: se(4),
      s5: s(5), probl: W('проблема'), obych: W('обычный'), dym: W('дым'), edkiy: W('едкий'), deret: W('дерёт'), gorlo: W('горло'), podr: W('подросткам'),
      s6: s(6), him: W('химики'), smesh: W('смешали'), nikot: W('никотин'), kisl: W('кислотой'), poluch: W('получили'), nikot2: W('никотиновую'), sol: W('соль'), kot: W('которая'), zahod: W('заходит'), myagko: W('мягко'), uboy: W('убойной'), doze: W('дозе'),
      s7: s(7), elek: W('электронных'), prod: W('продавали'), zaliv: W('заливать'), vochto: W('во') + .15, sekr7: W('секретную'), formul: W('формулу'), spryat: W('спрятали'), arhiv: W('архив'), arhivB: WB('архив'),
      s8: s(8), s9: s(9), s10: s(10), s11: s(11),
      s12: s(12), chetyre: W('четыре'), ssha: W('сша'), paril: W('парил'), kazhd: W('каждый'), chetv: W('четвёртый'), starsh: W('старшеклассник'), tret: W('треть'), trin: W('тринадцать'), mlrd: W('миллиардов'), vykup: W('выкупил'), proizv: W('производитель'), marl: W('мальборо'),
      s13: s(13), plan: W('план'), srab: W('сработал'), ideal: W('идеально'), s14: s(14), vam: W('вам'), seych: W('сейчас'), zahot: W('захотелось'), zat: W('затянуться'),
      s15: s(15), l1: W('захотите'), brosit: W('бросить'), prodad: W('продадут'), odni: W('одни'), lyud: W('люди'), kto: W('кто'), smotr: W('смотрите'), yt: W('youtube'),
      s16: s(16), q1v: S[16].words[4].a, q2: S[16].words[6].a, b0: tl.b0, endT: tl.endT };
    const q = Q; DUR = tl.dur;
    const sh = (a, tr, f, cy, o = {}) => SH.push({ a, tr, f, cy, ...o });
    // главы фильма (9, как «06 / 09 · БИТВА» у референса)
    CHAP = [[0, 'ОДНОРАЗКИ'], [q.s2 - .1, '1973'], [q.s5 - .1, 'ГОРЛО'], [q.s6 - .1, 'СОЛЬ'], [q.s7 - .1, 'АРХИВ'], [q.s9 - .1, 'СТЭНФОРД'], [q.s10 - .1, 'JUUL'], [q.s12 - .1, 'СДЕЛКА'], [q.s13 - .1, 'ДОСЬЕ']].map(([a, name], i) => ({ a, name, n: i + 1 }));
    // сверху: ● ТЕМА · МЕСТО и год
    const Y = y => () => y;
    const ch = (a, topic, place, year, o = {}) => CHS.push({ a, topic, place, year: typeof year === 'function' ? year : Y(year), ...o });
    ch(-1, 'СЕЙЧАС', 'ТВОЙ ГОРОД', '2026');
    ch(q.chto2 - .2, 'ВИТРИНА', 'ОДНОРАЗКИ', '2026');
    ch(q.s1 - .15, 'СОСТАВ', 'ЖИДКОСТЬ', '2026');
    ch(q.izobr - .15, 'ПРОИСХОЖДЕНИЕ', 'ТАБАЧНЫЕ ГИГАНТЫ', '2026');
    ch(q.s2 - .15, 'ПЕРЕМОТКА', 'НАЗАД', t => String(Math.round(lp(2026, 1973, eio(cl((t - q.s2) / .85))))));
    ch(q.tab - .2, 'УИНСТОН-СЕЙЛЕМ', 'R.J. REYNOLDS', '1973');
    ch(q.sozd - .15, 'R.J. REYNOLDS', 'СИГАРЕТЫ', '1973');
    ch(q.gotov - .15, 'R.J. REYNOLDS', 'ОТДЕЛ ИССЛЕДОВАНИЙ', '1973');
    ch(q.s4 - .12, 'МЕМОРАНДУМ', '2 ФЕВРАЛЯ', '1973');
    ch(q.s5 - .1, 'ПРОБЛЕМА', 'ГОРЛО', '1973');
    ch(q.s6 - .1, 'R.J. REYNOLDS', 'ЛАБОРАТОРИЯ', '1979');
    ch(q.kot - .2, 'НИКОТИНОВАЯ СОЛЬ', 'ГОРЛО', '1979');
    ch(q.s7 - .1, 'ПРОДАЖИ', 'ЗАЛИТЬ НЕКУДА', '1979');
    ch(q.sekr7 - .2, 'R.J. REYNOLDS', 'АРХИВ', '1979');
    ch(q.s12 - .1, 'ШКОЛЫ', 'США', '2019');
    ch(q.tret - .25, 'СДЕЛКА', 'ALTRIA × JUUL', '2018');
    ch(q.s13 - .1, 'R.J. REYNOLDS', 'ПЛАН 1973', '1973');
    ch(q.s14 - .1, 'СЕЙЧАС', 'ТЫ', '2026');
    ch(q.b0 - .02, 'ДОСЬЕ', 'ПОЛНЫЙ ФИЛЬМ', '2026');
    ch(q.q1v - .3, 'СЕЙЧАС', 'ТВОЙ ГОРОД', '2026');
    // планы (спокойный темп: 2,5–5 с на план)
    sh(0, 'cut', (c, t, u) => S_('city')(c, t, u, { vap: .95 }), 1210);
    sh(q.chto2 - .08, 'cut', S_('kiosk'), 1210);
    sh(q.s1 - .1, 'blur', S_('inside'), 1210);
    sh(q.izobr - .12, 'cut', S_('giants'), 1210);
    sh(q.s2 - .1, 'burn', S_('tower'), 1210);
    sh(q.sozd - .12, 'cut', S_('neon'), 1210);
    sh(q.gotov - .15, 'cut', S_('office'), 1560);
    sh(q.s4 - .12, 'blur', S_('memo'), 1600);
    sh(q.s5 - .1, 'cut', S_('smoke'), 1210);
    sh(q.edkiy - .3, 'cut', S_('throat'), 1210);
    sh(q.s6 - .1, 'cut', S_('lab'), 1210);
    sh(q.kot - .2, 'blur', S_('calm'), 1210);
    sh(q.s7 - .1, 'cut', S_('shop'), 1580);
    sh(q.sekr7 - .2, 'cut', S_('archive'), 1210);
    sh(q.s8 - .05, 'dip', stub, 1210);
    sh(77.5, 'cut', S_('cubes'), 1590);
    sh(q.tret - .2, 'cut', S_('deal'), 1210);
    sh(q.s13 - .1, 'cut', S_('plan'), 1600);
    sh(q.s14 - .1, 'blur', S_('tempt'), 1210);
    sh(q.b0 - .25, 'white', S_('board'), 1590);
    sh(q.q1v - .45, 'blur', S_('loop'), 1210);
    HITS.push(q.y73 + .1, q.sekr + .02, q.deret, q.arhiv + .05, q.marl + .05, q.ideal, q.yt + .08);
    sounds(q);
    CAPSKIP = [q.s8 - .3, q.s12 - .05];   // проба: середина (суд → школьники) ещё не нарисована
    buildCaps(tl);
  }

  window.EP = {
    P, D, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      SC.forEach(S => { D[S.key] = (t) => { frame(t); return '' } });
      const gr = document.getElementById('grain'); gr.style.display = ''; gr.style.opacity = .12;
      const vg = document.getElementById('vig'); if (vg) vg.style.display = 'none';
      if (!document.getElementById('v169f')) { const st = document.createElement('style'); st.id = 'v169f'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF}`).join('') + '@font-face{font-family:R;font-weight:300 900;src:url(fonts/rubik-var.ttf)}'; document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); A = mk(WW, HH); B = mk(WW, HH);
      SH = []; CHS = []; HITS = [];
      return Promise.all(['500 20px J', '700 20px J', '500 20px O', '700 20px O', '800 20px M', '900 20px R'].map(f => document.fonts.load(f, 'АЯaz09$%'))).then(() => { smokeSprites(); build(tl) });
    },
  };
  SHOTS.city = shotCity; SHOTS.kiosk = shotKiosk; SHOTS.inside = shotInside; SHOTS.giants = shotGiants;
  SHOTS.tower = shotTower; SHOTS.neon = shotNeon; SHOTS.office = shotOffice; SHOTS.memo = shotMemo; SHOTS.smoke = shotSmoke; SHOTS.throat = shotThroat; SHOTS.calm = shotCalm;
  SHOTS.lab = shotLab; SHOTS.shop = shotShop; SHOTS.archive = shotArchive;
  SHOTS.cubes = shotCubes; SHOTS.deal = shotDeal; SHOTS.plan = shotPlan; SHOTS.tempt = shotTempt; SHOTS.board = shotBoard; SHOTS.loop = shotLoop;
})();
