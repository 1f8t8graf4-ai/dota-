// v16.8 (14.11) — «чисто по референсам, сам, без ТЗ» (Андрей: «ты добавил кучу 3D уродливых объектов — посмотри, как там сделано, и делай»).
// Как у референсов (dynastixxx: Bybit, Пентагон, Stuxnet, NotPetya, ZachXBT, Александр), разобрано покадрово:
//  • один крупный предмет на план, по центру; тёмный фон, цветное свечение за предметом, пылинки и боке, сильная виньетка;
//  • предметы — чистая 2D-рисовка с объёмом градиентами, блик, контровой свет, мягкая тень; никаких 3D-сеток и «мира» из коробок;
//  • склейка раз в 2–4 с, внутри плана всё время что-то меняется: камера медленно наезжает, детали появляются под слова,
//    числа прокручиваются как барабан, штампы бьют с отдачей;
//  • HUD: уголки по краям кадра, слева «● ТЕМА · МЕСТО» мелким моно, справа часы, которые тикают, и дата под ними;
//  • субтитры: Oswald 700, по 1–3 слова, ещё не сказанные — серые, главное слово — оранжевое; стоят там, где не закрывают предмет.
// Голос и тайминг — v16.5 (1:45.8), кадр 9:16 (1080×1920).
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

  // ================= общие детали =================
  // ярлык с выноской: точка на предмете (px, py), плашка в (x, y); как «ДЫРА · СЕРВЕР 7» у референсов
  function tag(c, px, py, x, y, a, b, k, col = C.orange, al = 'left') {
    if (k <= 0) return;
    const w = Math.max(tw(c, a, { f: 'J', w: 500, s: 19, ls: 3 }), b ? tw(c, b, { f: 'O', w: 700, s: 38, ls: .5 }) : 0) + 48, h = b ? 96 : 50;
    const X0 = al === 'left' ? x : x - w, ex = al === 'left' ? X0 : X0 + w, ey = y + h / 2, e = eo(k / .5), e2 = eo((k - .35) / .65);
    c.save();
    c.strokeStyle = rgba(col, .85); c.lineWidth = 2.2; c.beginPath(); c.moveTo(px, py); c.lineTo(lp(px, ex, e), lp(py, ey, e)); c.stroke();
    c.fillStyle = col; c.beginPath(); c.arc(px, py, 6, 0, TAU); c.fill(); glowDot(c, px, py, 34, col, .8);
    c.strokeStyle = rgba(col, .45); c.lineWidth = 2; c.beginPath(); c.arc(px, py, 15, 0, TAU); c.stroke();
    if (e2 > 0) {
      c.globalAlpha *= e2; c.translate((al === 'left' ? -1 : 1) * (1 - e2) * 30, 0);
      c.fillStyle = 'rgba(5,9,18,.84)'; rr(c, X0, y, w, h, 8); c.fill(); c.strokeStyle = 'rgba(210,225,245,.28)'; c.lineWidth = 1.5; rr(c, X0 + .75, y + .75, w - 1.5, h - 1.5, 8); c.stroke();
      c.fillStyle = col; c.fillRect(al === 'left' ? X0 : X0 + w - 5, y + 8, 5, h - 16);
      tx(c, a, X0 + 26, y + (b ? 34 : 33), { f: 'J', w: 500, s: 19, ls: 3, al: 'left', c: b ? 'rgba(200,212,232,.78)' : col });
      if (b) tx(c, b, X0 + 26, y + 80, { f: 'O', w: 700, s: 38, ls: .5, al: 'left', c: '#fff' });
    }
    c.restore();
  }
  // большая цифра / заголовок с подписью моно и чертой (как «$1 500 000 000 / полтора миллиарда долларов»)
  function plate(c, x, y, big, sub, k, o = {}) {
    if (k <= 0) return;
    const s = o.s || 150, e = eo(k), w = tw(c, big, { f: 'O', w: 700, s, ls: o.ls ?? 2 });
    c.save(); c.globalAlpha *= cl(k * 2.2); c.translate(0, (1 - e) * 26);
    if (o.box) { const bw = Math.max(w, sub ? tw(c, sub, { f: 'J', w: 500, s: 24, ls: 6 }) : 0) + 90; c.fillStyle = 'rgba(5,9,18,.72)'; rr(c, x - bw / 2, y - s * .92, bw, s * 1.32 + (sub ? 70 : 0), 14); c.fill(); c.strokeStyle = 'rgba(210,225,245,.22)'; c.lineWidth = 2; c.stroke() }
    c.save(); font(c, { f: 'O', w: 700, s, ls: o.ls ?? 2 }); c.textAlign = 'center';
    c.shadowColor = rgba(o.glow || C.orange, .55); c.shadowBlur = 40;
    c.fillStyle = o.fill || lg(c, 0, y - s * .8, 0, y, [[0, '#ffffff'], [.55, '#ffe9c4'], [1, o.col2 || '#ffb54a']]); c.fillText(big, x, y);
    c.shadowBlur = 0; c.globalCompositeOperation = 'screen'; c.globalAlpha *= .25; c.fillStyle = lg(c, 0, y - s * .8, 0, y - s * .45, [[0, '#ffffff'], [1, 'rgba(255,255,255,0)']]); c.fillText(big, x, y);
    c.restore();
    if (o.line !== false) { const lw = (w + 30) * eo((k - .2) / .6); c.fillStyle = o.lc || C.orange; c.shadowColor = o.lc || C.orange; c.shadowBlur = 14; c.fillRect(x - lw / 2, y + s * .2, lw, 5); c.shadowBlur = 0 }
    if (sub) tx(c, sub, x, y + s * .2 + 52, { f: 'J', w: 500, s: o.ss || 24, ls: 6, c: 'rgba(205,214,230,.8)', a: cl((k - .35) / .5) });
    c.restore();
  }
  // барабан цифр: цифры крутятся и встают на место слева направо (как «$1 5?? ??? ???» у референсов)
  function roll(c, str, x, y, k, t, o = {}) {
    if (k <= 0) return;
    const s = o.s || 150, f = { f: 'O', w: 700, s, ls: o.ls ?? 4 }, ch = [...str], ws = ch.map(q => tw(c, q, f)), W = ws.reduce((a, b) => a + b, 0) + (ch.length - 1) * (o.ls ?? 4);
    const nd = ch.filter(q => /\d/.test(q)).length; let di = 0, xx = x - W / 2;
    c.save(); font(c, f); c.textAlign = 'left'; c.globalAlpha *= cl(k * 4);
    c.shadowColor = rgba(o.glow || C.orange, .6); c.shadowBlur = 36;
    for (let i = 0; i < ch.length; i++) {
      let q = ch[i]; const isD = /\d/.test(q);
      const lock = isD ? lp(.12, .92, nd > 1 ? di++ / (nd - 1) : 1) : .05, ok = k >= lock;
      let dy = 0, al = 1;
      if (isD && !ok) { const sp = Math.floor(t * 26 + i * 7); q = String(Math.floor(H1(sp * 1.7 + i) * 10)); dy = ((t * 26 + i * 7) % 1 - .5) * s * .3; al = .75 }
      else if (isD) { const b = (k - lock) / .12; if (b < 1) dy = -Math.sin(b * Math.PI) * s * .08 }
      const col = o.colAt ? o.colAt(i, q) : null;
      c.globalAlpha = al * cl(k * 4); c.fillStyle = col || o.fill || lg(c, 0, y - s * .8, 0, y, [[0, '#ffffff'], [.6, '#fff1d8'], [1, '#ffc46b']]);
      c.fillText(q, xx, y + dy); xx += ws[i] + (o.ls ?? 4);
    }
    c.restore();
    if (o.sub) { tx(c, o.sub, x, y + s * .2 + 52, { f: 'J', w: 500, s: 24, ls: 6, c: 'rgba(205,214,230,.8)', a: cl((k - .3) / .4) }); const lw = (W + 30) * eo((k - .1) / .5); c.save(); c.fillStyle = o.lc || C.orange; c.shadowColor = o.lc || C.orange; c.shadowBlur = 14; c.fillRect(x - lw / 2, y + s * .2, lw, 5); c.restore() }
    return W;
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
  const TRD = { cut: 0, blur: .42, punch: .3, flash: .38, whip: .36, dip: .34, glitch: .45 };
  function shotAt(t) { let i = 0; while (i < SH.length - 1 && t >= SH[i + 1].a) i++; return i }
  function drawShot(c, sh, t) { c.save(); c.fillStyle = C.ink; c.fillRect(0, 0, WW, HH); sh.f(c, t, t - sh.a, sh); c.restore() }
  function composite(c, p, n, k, kind, t) {
    const a = A.getContext('2d'), b = B.getContext('2d');
    if (kind === 'blur') {
      drawShot(a, p, t); drawShot(b, n, t); const b1 = 22 * Math.sin(Math.PI * Math.min(k, .5)), b2 = 22 * Math.sin(Math.PI * Math.max(k, .5));
      c.filter = b1 > .3 ? `blur(${b1.toFixed(1)}px)` : 'none'; c.drawImage(A, 0, 0);
      c.globalAlpha = ss(.2, .8, k); c.filter = b2 > .3 ? `blur(${b2.toFixed(1)}px)` : 'none'; c.drawImage(B, 0, 0); c.globalAlpha = 1; c.filter = 'none';
    } else if (kind === 'punch') {
      if (k < .5) { const e = ei(k * 2); drawShot(a, p, t); c.save(); c.translate(WW / 2, HH * .42); c.scale(1 + .3 * e, 1 + .3 * e); c.translate(-WW / 2, -HH * .42); c.filter = `blur(${(10 * e).toFixed(1)}px)`; c.drawImage(A, 0, 0); c.restore() }
      else { const e = eo((k - .5) * 2); drawShot(b, n, t); c.save(); c.translate(WW / 2, HH * .42); c.scale(1.14 - .14 * e, 1.14 - .14 * e); c.translate(-WW / 2, -HH * .42); c.filter = `blur(${(8 * (1 - e)).toFixed(1)}px)`; c.drawImage(B, 0, 0); c.restore() }
      c.filter = 'none'; c.fillStyle = `rgba(255,255,255,${(.16 * Math.max(0, 1 - Math.abs(k - .5) * 5)).toFixed(3)})`; c.fillRect(0, 0, WW, HH);
    } else if (kind === 'flash') {
      drawShot(c, k < .5 ? p : n, t); c.fillStyle = `rgba(255,246,236,${Math.pow(Math.max(0, 1 - Math.abs(k - .5) * 2), 1.6).toFixed(3)})`; c.fillRect(0, 0, WW, HH);
    } else if (kind === 'dip') {
      drawShot(c, k < .5 ? p : n, t); c.fillStyle = `rgba(0,0,0,${Math.pow(Math.max(0, 1 - Math.abs(k - .5) * 2), .8).toFixed(3)})`; c.fillRect(0, 0, WW, HH);
    } else if (kind === 'whip') {
      const e = eio(k); drawShot(a, p, t); drawShot(b, n, t); c.filter = `blur(${(18 * Math.sin(Math.PI * k)).toFixed(1)}px)`;
      c.drawImage(A, -WW * e, 0); c.drawImage(B, WW * (1 - e), 0); c.filter = 'none';
    } else if (kind === 'glitch') {
      const sh = k < .5 ? p : n; drawShot(a, sh, t); c.drawImage(A, 0, 0);
      const f = Math.floor(t * 30), amt = Math.sin(Math.PI * k);
      for (let i = 0; i < 12; i++) { const y = H1(f * 13 + i) * HH, h = 8 + H1(f * 7 + i) * 70, dx = (H1(f * 3 + i) - .5) * 220 * amt; c.drawImage(A, 0, y, WW, h, dx, y, WW, h) }
    }
  }

  // ================= HUD — как у референсов =================
  const ORANGE = C.orange;
  const hms = s => { s = ((Math.floor(s) % 86400) + 86400) % 86400; return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(v => String(v).padStart(2, '0')).join(':') };
  function corners(c) {
    c.drawImage(cache('crn', WW, HH, (x) => {
      x.strokeStyle = 'rgba(222,230,242,.34)'; x.lineWidth = 2; const L = 46, xl = 38, xr = WW - 38, yt = 80, yb = HH - 42;
      x.beginPath(); x.moveTo(xl, yt + L); x.lineTo(xl, yt); x.lineTo(xl + L, yt); x.moveTo(xr - L, yt); x.lineTo(xr, yt); x.lineTo(xr, yt + L);
      x.moveTo(xl, yb - L); x.lineTo(xl, yb); x.lineTo(xl + L, yb); x.moveTo(xr - L, yb); x.lineTo(xr, yb); x.lineTo(xr, yb - L); x.stroke();
    }), 0, 0);
  }
  function hudR(c, t) {
    let ch = CHS[0]; for (const h of CHS) if (t >= h.a) ch = h;
    const y = 134, x0 = 52, k = ch.inst ? 1 : eo((t - ch.a) / .3);
    c.drawImage(cache('hudBg', WW, 240, (x) => { x.fillStyle = lg(x, 0, 0, 0, 240, [[0, 'rgba(0,0,0,.42)'], [1, 'rgba(0,0,0,0)']]); x.fillRect(0, 0, WW, 240) }), 0, 0);
    corners(c);
    c.save(); c.shadowColor = 'rgba(0,0,0,.8)'; c.shadowBlur = 8;
    const bl = .5 + .5 * Math.sin(t * 4.4); c.fillStyle = `rgba(255,59,48,${.55 + .45 * bl})`; c.beginPath(); c.arc(x0, y - 7, 5.5, 0, TAU); c.fill();
    font(c, { f: 'J', w: 500, s: 21, ls: 2 }); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    const a = ch.topic + '  ·  '; c.globalAlpha = .35 + .65 * k; c.fillStyle = 'rgba(214,220,232,.7)'; c.fillText(a, x0 + 16, y);
    c.fillStyle = ORANGE; c.fillText(typed(ch.place, k * 1.6), x0 + 16 + c.measureText(a).width, y); c.globalAlpha = 1;
    font(c, { f: 'J', w: 500, s: 46, ls: 3 }); c.textAlign = 'right'; c.fillStyle = 'rgba(240,243,248,.93)'; c.fillText(ch.clock(t), WW - 50, y + 16);
    font(c, { f: 'J', w: 500, s: 17, ls: 3 }); c.fillStyle = 'rgba(205,212,226,.55)'; c.fillText(ch.sub(t), WW - 52, y + 46);
    c.restore();
  }

  // ================= субтитры — как у референсов =================
  // Oswald 700, по 1–3 слова; сказанные — белые, ещё не сказанные — серые; главное — оранжевым (+8 % при появлении)
  const CAPF = 92, CAPW = 900;
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
    // где рвать фразу по смыслу (чтобы «внутри них», «табачные гиганты», «та самая соль» стояли вместе)
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
  let NOCAP = () => false;
  function capsR(c, t, cy) {
    const ch = CAPS.find(x => t >= x.a - .06 && t < x.e); if (!ch || NOCAP(t)) return;
    const k = eo((t - ch.a + .06) / .12), lh = CAPF * 1.0, y0 = cy - (ch.lines.length - 1) * lh / 2 + CAPF * .37;
    c.save(); font(c, { f: 'O', w: 700, s: CAPF, ls: .5 }); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    ch.lines.forEach((ln, j) => {
      const ws = ln.map(w => capWord(w.d)), sp = c.measureText(' ').width, W = ws.reduce((s, x) => s + c.measureText(x).width, 0) + sp * (ws.length - 1);
      let x = WW / 2 - W / 2; const y = y0 + j * lh + (1 - k) * 14;
      ln.forEach((w, i) => {
        const s = ws[i], ww = c.measureText(s).width, on = t >= w.a - .04, key = KEYW.has(bareW(w.d)), pk = cl((t - w.a + .04) / .16), sc = on ? 1 + (key ? .08 : .03) * (1 - eo(pk)) : 1;
        c.save(); c.translate(x + ww / 2, y - CAPF * .37); c.scale(sc, sc); c.translate(-(x + ww / 2), -(y - CAPF * .37));
        c.globalAlpha = k * (on ? 1 : .42); c.shadowColor = 'rgba(0,0,0,.8)'; c.shadowBlur = 18; c.shadowOffsetY = 4;
        c.fillStyle = key && on ? ORANGE : on ? '#ffffff' : '#b9bec8'; c.fillText(s, x, y); c.restore();
        x += ww + sp;
      });
    });
    c.restore();
  }
  function vignetteR(c) { c.drawImage(cache('vigR', WW, HH, (x) => { x.fillStyle = rg(x, WW / 2, HH * .44, HH * .22, HH * .74, [[0, 'rgba(0,0,0,0)'], [.55, 'rgba(0,0,0,.2)'], [1, 'rgba(0,0,0,.82)']]); x.fillRect(0, 0, WW, HH) }), 0, 0) }
  let GR = null;
  function gradeR(c) {
    if (!GR) GR = mk(WW, HH); const g = GR.getContext('2d'); g.globalCompositeOperation = 'copy'; g.drawImage(c.canvas, 0, 0);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'copy'; c.filter = 'contrast(1.05) saturate(1.1)'; c.drawImage(GR, 0, 0); c.restore(); c.filter = 'none';
  }
  function capY(t) { const i = shotAt(t), sh = SH[i], nx = SH[i + 1]; let y = sh.cy || 1250; if (nx && t > nx.a - .12 && nx.cy && t >= nx.a - .02) y = nx.cy; return y }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none';
    const i = shotAt(t), sh = SH[i], nx = SH[i + 1]; let tr = null;
    if (nx && nx.tr !== 'cut' && t >= nx.a - TRD[nx.tr] / 2) tr = [sh, nx, (t - (nx.a - TRD[nx.tr] / 2)) / TRD[nx.tr], nx.tr];
    else if (i > 0 && sh.tr !== 'cut' && t < sh.a + TRD[sh.tr] / 2) tr = [SH[i - 1], sh, (t - (sh.a - TRD[sh.tr] / 2)) / TRD[sh.tr], sh.tr];
    const [dx, dy] = shake(t);
    c.save(); c.translate(dx, dy);
    if (tr) composite(c, tr[0], tr[1], cl(tr[2]), tr[3], t); else drawShot(c, sh, t);
    c.restore();
    gradeR(c); vignetteR(c); hudR(c, t); capsR(c, t, capY(t));
  }

  // ================= предметы =================
  // одноразка-«бар»: начало — середина низа, рост вверх на h; o: c1..c3 — цвет корпуса сверху вниз, label, led (0..1), ledCol, glint (0..1 — блик бежит)
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
  function vapeXray(c, h, t, o = {}) {
    const w = h * .27, mpH = h * .19, mpW = w * .6, top = -h, bT = -h + mpH * .88, bH = -bT, R = w * .34;
    c.save();
    rr(c, -w / 2, bT, w, bH, [R, R, R * .7, R * .7]); c.fillStyle = 'rgba(4,16,34,.94)'; c.fill();
    rr(c, -mpW / 2, top, mpW, mpH + R, [mpW * .44, mpW * .44, 0, 0]); c.fill();
    c.strokeStyle = C.ice; c.lineWidth = 3; c.shadowColor = C.cyan; c.shadowBlur = 18;
    rr(c, -w / 2, bT, w, bH, [R, R, R * .7, R * .7]); c.stroke(); rr(c, -mpW / 2, top, mpW, mpH + R * .3, [mpW * .44, mpW * .44, 0, 0]); c.stroke();
    c.lineWidth = 2; c.beginPath(); c.moveTo(-w * .06, top + 12); c.lineTo(-w * .06, bT + bH * .12); c.moveTo(w * .06, top + 12); c.lineTo(w * .06, bT + bH * .12); c.stroke(); c.shadowBlur = 0;
    // бак с жидкостью
    const t0 = bT + bH * .05, t1 = bT + bH * .46; rr(c, -w * .38, t0, w * .76, t1 - t0, 14); c.fillStyle = 'rgba(255,170,60,.12)'; c.fill(); c.strokeStyle = 'rgba(255,195,110,.85)'; c.lineWidth = 2; c.stroke();
    const lv = t0 + (t1 - t0) * .18; c.save(); rr(c, -w * .38, t0, w * .76, t1 - t0, 14); c.clip();
    c.fillStyle = lg(c, 0, lv, 0, t1, [[0, 'rgba(255,185,70,.62)'], [1, 'rgba(255,120,40,.42)']]); c.beginPath(); c.moveTo(-w, lv);
    for (let i = 0; i <= 20; i++) c.lineTo(-w * .38 + i * w * .76 / 20, lv + Math.sin(t * 3 + i * .9) * 3); c.lineTo(w, t1 + 20); c.lineTo(-w, t1 + 20); c.fill();
    for (let i = 0; i < 16; i++) { const u = (H1(i * 3.3) + t * (.15 + .2 * H1(i))) % 1, bx = -w * .3 + H1(i * 7.1) * w * .6, by = lp(t1 - 8, lv + 6, u); c.strokeStyle = `rgba(255,230,180,${.6 * Math.sin(Math.PI * u)})`; c.lineWidth = 1.5; c.beginPath(); c.arc(bx, by, 2 + 3 * H1(i), 0, TAU); c.stroke() }
    c.restore();
    // спираль
    const heat = o.heat ?? 1, cy = t0 + (t1 - t0) * .66, ch = (t1 - t0) * .34, cw = w * .44;
    c.save(); c.lineCap = 'round';
    for (let i = 0; i < 7; i++) { const yy = cy - ch / 2 + i * ch / 6; c.lineWidth = 3.5; c.strokeStyle = `rgba(255,${150 + 80 * heat | 0},80,${.4 + .55 * heat})`; c.shadowColor = '#ff8a2a'; c.shadowBlur = 16 * heat; c.beginPath(); c.ellipse(0, yy, cw / 2, cw * .1, 0, 0, Math.PI); c.stroke() }
    c.restore(); glowDot(c, 0, cy, cw * 1.6, '#ff7a1a', .6 * heat * (.85 + .15 * Math.sin(t * 9)));
    // плата и аккумулятор
    const b0 = bT + bH * .52, b1 = bT + bH * .6; rr(c, -w * .36, b0, w * .72, b1 - b0, 6); c.fillStyle = 'rgba(40,210,150,.14)'; c.fill(); c.strokeStyle = 'rgba(70,235,175,.85)'; c.lineWidth = 2; c.stroke();
    c.fillStyle = 'rgba(70,235,175,.75)'; c.fillRect(-w * .12, b0 + (b1 - b0) * .25, w * .24, (b1 - b0) * .5);
    const a0 = bT + bH * .64, a1 = -h * .07; rr(c, -w * .36, a0, w * .72, a1 - a0, 16); c.fillStyle = 'rgba(80,140,255,.1)'; c.fill(); c.strokeStyle = 'rgba(140,190,255,.8)'; c.stroke();
    tx(c, '+', 0, a0 + 34, { f: 'J', w: 700, s: 26, c: 'rgba(160,200,255,.8)' });
    c.restore();
  }
  // штрихи сетки на тёмном (как экраны у референсов)
  function grid(c, step, a, col = '#8fc8ff', x0 = 0, y0 = 0, x1 = WW, y1 = HH) { c.save(); c.strokeStyle = rgba(col, a); c.lineWidth = 1; c.beginPath(); for (let x = x0; x <= x1; x += step) { c.moveTo(x, y0); c.lineTo(x, y1) } for (let y = y0; y <= y1; y += step) { c.moveTo(x0, y); c.lineTo(x1, y) } c.stroke(); c.restore() }

  // ================= планы 0:00–0:27 =================
  // 1. «Что вы знаете об одноразках?» — одна одноразка на тёмном глянцевом полу, свет сверху, тёплое свечение за ней
  function s01(c, t, u) {
    const q = Q, fl = 1185;
    bg(c, t, { top: '#0b0e18', bot: '#020306', glows: [[540, 760, 560, 760, C.orange, .55], [540, 330, 300, 300, '#ffd9a8', .25]], bk: ['s1', ['#ff9f4a', '#ffd38a', '#7fb8ff'], { a: .55, n: 30, seed: 7 }] });
    c.save(); cam(c, u, { s0: 1, s1: 1.07, d: 2.6, fx: 540, fy: 780 });
    // пол
    c.fillStyle = lg(c, 0, fl - 6, 0, HH, [[0, 'rgba(40,30,30,.65)'], [.08, 'rgba(14,12,16,.9)'], [1, '#020204']]); c.fillRect(-200, fl, WW + 400, HH);
    glow(c, 540, fl + 10, 420, 60, C.orange, .55);
    beam(c, 540, -120, 0, .42, 1500, '#ffe2bd', .45); dust(c, t, 540, -120, 0, .42, 1400, 60, 3, .8);
    const led = .55 + .45 * Math.sin(t * 2.4) + 2 * Math.max(0, 1 - Math.abs(t - q.odn - .1) / .25);
    const gl = cl((t - q.odn + .2) / .9), dv = () => vapeBar(c, 860, { led: cl(led, 0, 1.5), glint: gl > 0 && gl < 1 ? gl : null });
    c.save(); c.translate(540, fl); reflect(c, 0, .11, dv); c.restore();
    shadowE(c, 540, fl + 4, 190, 26, .9);
    c.save(); c.translate(540, fl); dv(); c.restore();
    smoke(c, t, 540, fl - 860, { n: 14, life: 3.4, rise: 380, sway: 50, spread: 14, r0: 14, r1: 120, a: .16, seed: 5, col: '#ffe1c4' });
    c.restore();
    motes(c, t, 11, 40, '#ffd9b0', .8);
  }
  // 2. «Что это модная замена сигаретам» — сигарета уезжает и гаснет, на её место встаёт одноразка
  function s02(c, t, u) {
    const q = Q, sw = eio(at(t, q.zam - .05, q.zam + .55));
    bg(c, t, { top: '#0b0d16', bot: '#030305', glows: [[lp(540, 330, sw), 820, 520, 520, '#ff8a3a', .4 * (1 - sw * .6)], [lp(1100, 760, sw), 800, 520, 700, C.orange, .55 * sw]], bk: ['s2', ['#ffb06a', '#8fbfff'], { a: .4, seed: 12 }] });
    c.save(); cam(c, u, { s0: 1, s1: 1.06, d: 2.2, fx: 540, fy: 820 });
    // сигарета: крупно поперёк кадра → уезжает влево, поворачивается, гаснет; красная черта на «сигаретам»
    c.save(); c.translate(lp(540, 300, sw), lp(780, 860, sw)); c.rotate(lp(-.18, -1.12, sw)); c.scale(lp(1, .8, sw), lp(1, .8, sw));
    c.globalAlpha = lp(1, .55, sw); cigarette(c, 860, 74, { t, burn: 1 - sw * .7 });
    c.restore();
    if (sw < .9) smoke(c, t, lp(540, 300, sw) + Math.cos(lp(-.18, -1.12, sw)) * 400, lp(780, 860, sw) + Math.sin(lp(-.18, -1.12, sw)) * 400, { n: 16, life: 3, rise: 420, sway: 40, r0: 16, r1: 140, a: .28 * (1 - sw), seed: 9 });
    const sk = eo(at(t, q.sig + .05, q.sig + .35));
    if (sk > 0) { c.save(); c.translate(300, 860); c.rotate(.45); c.strokeStyle = C.red; c.lineWidth = 16; c.lineCap = 'round'; c.shadowColor = C.red; c.shadowBlur = 22; c.beginPath(); c.moveTo(-230, 0); c.lineTo(-230 + 460 * sk, 0); c.stroke(); c.restore() }
    // одноразка въезжает справа
    if (sw > 0) { c.save(); c.translate(lp(1200, 760, eb(sw)), 1220); c.rotate(lp(.3, .05, sw)); shadowE(c, 0, 4, 150, 20, .7 * sw); vapeBar(c, 760, { led: .6 + .4 * Math.sin(t * 3) }); c.restore() }
    // стрелка «→»
    const ak = eo(at(t, q.zam + .35, q.zam + .75));
    if (ak > 0) { c.save(); c.globalAlpha = ak; c.translate(530, 470); c.strokeStyle = C.orange; c.lineWidth = 10; c.lineCap = 'round'; c.shadowColor = C.orange; c.shadowBlur = 24; c.beginPath(); c.arc(0, 220, 230, -Math.PI * .82, -Math.PI * lp(.82, .2, ak)); c.stroke(); const ea = -Math.PI * lp(.82, .2, ak); c.translate(Math.cos(ea) * 230, 220 + Math.sin(ea) * 230); c.rotate(ea + Math.PI / 2); c.beginPath(); c.moveTo(-22, -6); c.lineTo(0, 22); c.lineTo(22, -6); c.stroke(); c.restore() }
    c.restore();
    motes(c, t, 21, 36, '#ffd9b0', .7);
  }
  // 3. «с безобидным паром со вкусом манго и мяты?» — облако пара, из него манго и мята
  function s03(c, t, u) {
    const q = Q, mk1 = pop(t, q.mango - .05), mk2 = pop(t, q.myaty - .05), mt = cl((t - q.myaty + .1) / .5);
    bg(c, t, { top: mixh('#120d12', '#08151a', mt), bot: '#030305', glows: [[340, 760, 520, 560, '#ff9a2a', .3 + .3 * cl(mk1)], [760, 840, 520, 560, C.mint, .1 + .45 * mt], [540, 1000, 700, 500, '#ffffff', .08]] });
    c.save(); cam(c, u, { s0: 1.02, s1: 1.1, d: 2.8, fx: 540, fy: 860 });
    // облако: клубы растут на «безобидным», светлеют на «паром»
    const g = eo(at(t, q.bez - .3, q.parom + .5)), wh = cl((t - q.parom + .2) / .6);
    for (let i = 0; i < 22; i++) { const a = H1(i * 4.1) * TAU, r = (80 + 260 * H1(i * 2.3)) * (.4 + .6 * g), x = 540 + Math.cos(a) * r * 1.2 + Math.sin(t * .4 + i) * 20, y = 900 + Math.sin(a) * r * .75 + Math.cos(t * .3 + i) * 16 - (t - q.bez) * 14, rs = (150 + 160 * H1(i * 9.3)) * (.5 + .5 * g);
      const S = smokeSprites(); c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = (.16 + .12 * wh) * cl(g * 1.5); c.translate(x, y); c.rotate(H1(i) * TAU + t * .08); c.drawImage(S[i % 4], -rs, -rs, rs * 2, rs * 2); c.restore() }
    glow(c, 540, 900, 420, 320, '#fff3e6', .25 * g);
    // манго слева, мята справа
    if (mk1 > 0) { c.save(); c.translate(360, 760 + Math.sin(t * 1.3) * 10); c.rotate(-.7 + Math.sin(t) * .03); c.scale(mk1, mk1); glow(c, 0, 0, 300, 300, '#ffb030', .5); mango(c, 150); c.restore();
      c.save(); c.translate(250, 980); c.rotate(.5); c.scale(mk1, mk1); mangoSlice(c, 80); c.restore() }
    if (mk2 > 0) { c.save(); c.translate(760, 820 + Math.sin(t * 1.1 + 1) * 10); c.scale(mk2, mk2); glow(c, 0, 0, 280, 280, C.mint, .55);
      c.save(); c.translate(-70, 30); mintLeaf(c, 150, -.7, .25); c.restore(); c.save(); c.translate(60, 20); mintLeaf(c, 160, .55, .1); c.restore(); c.save(); c.translate(-5, -40); mintLeaf(c, 175, -.05); c.restore();
      c.strokeStyle = '#1d7a3f'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 120); c.quadraticCurveTo(10, 200, -10, 260); c.stroke(); c.restore() }
    c.restore();
    // искры
    c.save(); c.globalCompositeOperation = 'screen'; for (let i = 0; i < 26; i++) { const k = (t * .25 + H1(i * 3.7)) % 1, x = 540 + (H1(i * 5.1) - .5) * 900, y = 1250 - k * 900, a = Math.sin(Math.PI * k) * .8; c.fillStyle = i % 2 ? rgba('#ffd27a', a) : rgba(C.mint, a); c.beginPath(); c.arc(x, y, 2 + 2 * H1(i), 0, TAU); c.fill() } c.restore();
  }
  // 4. «А знаете ли вы, что жидкость внутри них» — сканер проходит по одноразке, внутри — жидкость и спираль
  function s04(c, t, u) {
    const q = Q, sc = eio(at(t, q.s1 + .1, q.zhid + .1)), H = 1000, x0 = 540, y0 = 1420;
    bg(c, t, { top: '#040a16', bot: '#010205', glows: [[540, 860, 520, 700, '#2a7cff', .35], [540, 900, 260, 360, C.amber, .25 * cl((t - q.zhid) / .4)]] });
    grid(c, 60, .05);
    c.save(); cam(c, u, { s0: 1, s1: 1.08, d: 2.6, fx: 540, fy: 900, r: -.01 });
    c.save(); c.translate(x0, y0); c.rotate(-.06);
    const scanY = lp(-H - 60, 40, sc);
    c.save(); c.beginPath(); c.rect(-400, scanY, 800, 2000); c.clip(); vapeBar(c, H, { led: .7 }); c.restore();
    c.save(); c.beginPath(); c.rect(-400, -H - 200, 800, scanY + H + 200); c.clip(); vapeXray(c, H, t, { heat: cl((t - q.vnutri) / .4) * .9 + .1 }); c.restore();
    if (sc > 0 && sc < 1) { c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = lg(c, 0, scanY - 70, 0, scanY + 10, [[0, 'rgba(80,200,255,0)'], [1, 'rgba(120,220,255,.6)']]); c.fillRect(-380, scanY - 70, 760, 80); c.fillStyle = '#cfefff'; c.shadowColor = C.cyan; c.shadowBlur = 30; c.fillRect(-380, scanY - 2, 760, 4); c.restore() }
    c.restore();
    const k1 = (t - q.zhid + .05) / .6, k2 = (t - q.vnutri + .05) / .6;
    tag(c, 572, 760, 640, 520, 'ЖИДКОСТЬ', 'НИКОТИНОВАЯ СОЛЬ', k1, C.amber, 'left');
    tag(c, 510, 856, 430, 900, 'НАГРЕВ', 'СПИРАЛЬ', k2, '#ff7a3a', 'right');
    c.restore();
    motes(c, t, 31, 30, '#9fdcff', .6);
  }
  // 5. «изобрели табачные гиганты» — снизу вверх: громадные башни и трубы на рыжем небе, дым
  const KX = (x, y) => 540 + (x - 540) * (.8 + .2 * cl(y / 1750));
  function towerPoly(c, x0, x1, y0, y1) { c.beginPath(); c.moveTo(KX(x0, y1), y1); c.lineTo(KX(x0, y0), y0); c.lineTo(KX(x1, y0), y0); c.lineTo(KX(x1, y1), y1); c.closePath() }
  function giants(c, t, rise) {
    const B = [[60, 360, 420], [330, 760, 150], [770, 1020, 330]];   // x0, x1, верх
    B.forEach(([x0, x1, top], i) => {
      const y0 = top + (1 - rise) * (260 + i * 60), y1 = 1900;
      towerPoly(c, x0, x1, y0, y1); c.fillStyle = lg(c, 0, y0, 0, y1, [[0, '#1a0e0a'], [.4, '#0c0605'], [1, '#050202']]); c.fill();
      c.save(); towerPoly(c, x0, x1, y0, y1); c.clip();
      c.globalCompositeOperation = 'screen'; c.fillStyle = lg(c, KX(x0, y0), 0, KX(x0, y0) + 40, 0, [[0, 'rgba(255,120,40,.35)'], [1, 'rgba(255,120,40,0)']]); c.fillRect(0, y0, WW, y1 - y0);
      c.globalCompositeOperation = 'source-over';
      const cols = Math.round((x1 - x0) / 40), rows = Math.round((y1 - y0) / 52);
      for (let r = 1; r < rows; r++) for (let k = 0; k < cols; k++) { const h = H2(k + i * 50, r); if (h < .55) continue; const wx = x0 + 14 + k * 40, wy = y0 + 20 + r * 52, on = .4 + .6 * (h > .8 ? .5 + .5 * Math.sin(t * 2 + k * r) : 1);
        c.fillStyle = `rgba(255,${170 + 40 * h | 0},${80 + 40 * h | 0},${.18 + .5 * on * (h - .55)})`; const xa = KX(wx, wy), xb = KX(wx + 18, wy); c.fillRect(xa, wy, xb - xa, 24) }
      c.restore();
      c.strokeStyle = 'rgba(255,150,70,.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(KX(x0, y0), y0); c.lineTo(KX(x1, y0), y0); c.stroke();
    });
    // трубы
    [[230, 150, 34], [880, 210, 30], [520, 40, 40]].forEach(([x, top, w], i) => { const y0 = top + (1 - rise) * 380; c.fillStyle = lg(c, KX(x - w / 2, y0), 0, KX(x + w / 2, y0), 0, [[0, '#120806'], [.4, '#2a1510'], [1, '#080303']]); towerPoly(c, x - w / 2, x + w / 2, y0, 1900); c.fill();
      for (let r = 0; r < 3; r++) { c.fillStyle = 'rgba(255,90,40,.5)'; c.fillRect(KX(x - w / 2, y0 + 30 + r * 22), y0 + 30 + r * 22, KX(x + w / 2, y0) - KX(x - w / 2, y0), 5) }
      smoke(c, t, KX(x, y0), y0 - 4, { n: 16, life: 6, rise: 520, sway: 60, drift: 260, r0: 30, r1: 260, a: .5, seed: 40 + i * 9, col: '#2a1913', op: 'source-over' }) });
  }
  function s05(c, t, u) {
    const q = Q, rise = eo(at(t, q.izobr - .1, q.gig + .3));
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, '#0d0605'], [.45, '#3a1409'], [.72, '#a8431a'], [.86, '#ff8a3a'], [1, '#ffc27a']]); c.fillRect(0, 0, WW, HH);
    glow(c, 540, 1500, 800, 420, '#ffb36a', .6);
    c.save(); cam(c, u, { s0: 1.1, s1: 1.0, d: 1.9, fx: 540, fy: 900, dy: 120 });
    giants(c, t, rise);
    c.restore();
    c.fillStyle = lg(c, 0, 1500, 0, HH, [[0, 'rgba(10,4,2,0)'], [1, 'rgba(10,4,2,.9)']]); c.fillRect(0, 1500, WW, 420);
    motes(c, t, 41, 50, '#ffb070', .8);
  }
  // 6. «ещё пятьдесят лет назад?» → «Вернёмся в 1973 год.» — счётчик лет крутится назад и встаёт на 1973
  function yearNow(t) { const q = Q, k = eio(cl((t - q.p50 + .05) / (q.y73 + .06 - q.p50 + .05))); return lp(2026, 1973, k) }
  function odometer(c, val, x, y, s, t, o = {}) {   // 4 барабана; val — дробное значение
    const dg = [1000, 100, 10, 1], f = { f: 'O', w: 700, s, ls: 0 }, cw = tw(c, '0', f) * 1.02, W = cw * 4 + 18 * 3;
    for (let i = 0; i < 4; i++) {
      const p = dg[i], d0 = Math.floor(val / p) % 10, fr = p === 1 ? val - Math.floor(val) : cl(val % p - (p - 1)), cx = x - W / 2 + i * (cw + 18) + cw / 2;
      c.save(); rr(c, cx - cw / 2 - 8, y - s * .9, cw + 16, s * 1.12, 16); c.fillStyle = 'rgba(8,10,16,.82)'; c.fill(); c.strokeStyle = 'rgba(255,190,110,.25)'; c.lineWidth = 2; c.stroke(); c.clip();
      const sp = o.speed ? o.speed / p : 0, bl = cl(sp * 1.3, 0, 1);
      font(c, f); c.textAlign = 'center'; c.shadowColor = rgba(C.orange, .7); c.shadowBlur = 30;
      for (const [dd, off] of [[d0, -fr], [(d0 + 1) % 10, 1 - fr]]) { c.globalAlpha = 1 - bl * .45; c.fillStyle = lg(c, 0, y - s * .8, 0, y, [[0, '#ffffff'], [.6, '#ffe7c0'], [1, '#ffb54a']]); c.fillText(String(dd), cx, y - off * s * 1.12) }
      if (bl > .05) { c.globalAlpha = bl * .3; for (const k of [-.3, .3]) c.fillText(String(d0), cx, y + k * s * .4) }
      c.globalAlpha = 1; c.shadowBlur = 0; c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(cx - cw, y - s * .36, cw * 2, 3);
      c.fillStyle = lg(c, 0, y - s * .9, 0, y + s * .22, [[0, 'rgba(0,0,0,.6)'], [.25, 'rgba(0,0,0,0)'], [.75, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.6)']]); c.fillRect(cx - cw, y - s, cw * 2, s * 1.4);
      c.restore();
    }
    return W;
  }
  function s06(c, t, u) {
    const q = Q, yr = yearNow(t), land = t - q.y73, warm = cl(land / .5), sp = Math.abs(yearNow(t + .02) - yr) / .02;
    bg(c, t, { top: mixh('#0a0c14', '#1a0f06', warm), bot: mixh('#020306', '#060302', warm), glows: [[540, 820, 600, 600, C.orange, .35 + .3 * warm]] });
    // туннель времени: полосы к центру, пока крутится
    const sk = cl(1 - land / .4) * cl((t - q.p50) / .3);
    if (sk > 0) { c.save(); c.globalCompositeOperation = 'screen'; for (let i = 0; i < 70; i++) { const a = H1(i * 3.3) * TAU, d = ((H1(i * 7.1) + t * (.8 + H1(i))) % 1), r0 = 80 + d * 900, r1 = r0 + 60 + 200 * d; c.strokeStyle = rgba(i % 3 ? '#ffb46a' : '#9fd0ff', .5 * d * sk); c.lineWidth = 1 + 3 * d; c.beginPath(); c.moveTo(540 + Math.cos(a) * r0, 800 + Math.sin(a) * r0); c.lineTo(540 + Math.cos(a) * r1, 800 + Math.sin(a) * r1); c.stroke() } c.restore() }
    c.save(); cam(c, u, { s0: 1, s1: 1.05, d: 3, fx: 540, fy: 820 });
    const bump = land > 0 ? 1 + .12 * Math.exp(-land * 9) * Math.cos(land * 30) : 1;
    c.save(); c.translate(540, 820); c.scale(bump, bump); c.translate(-540, -820); odometer(c, yr, 540, 900, 300, t, { speed: land > 0 ? 0 : sp }); c.restore();
    const sub = land > -.05 ? 'ФЕВРАЛЬ · 1973' : 'ОТМАТЫВАЕМ НАЗАД';
    tx(c, sub, 540, 1010, { f: 'J', w: 500, s: 28, ls: 8, c: land > -.05 ? C.amber : 'rgba(205,214,230,.8)' });
    if (land < 0) { c.save(); c.globalAlpha = .6 + .4 * Math.sin(t * 14); tx(c, '◀◀', 540, 560, { f: 'J', w: 700, s: 54, c: C.orange, glow: C.orange, gb: 18 }); c.restore() }
    c.restore();
    if (land > 0 && land < .6) { c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = (1 - land / .6) * .8; c.strokeStyle = C.orange; c.lineWidth = 8 * (1 - land / .6); c.beginPath(); c.arc(540, 780, 200 + land * 900, 0, TAU); c.stroke(); c.restore() }
    motes(c, t, 51, 40, '#ffcc8a', .7);
  }
  // 7. «Табачная империя «Рейнольдс»» — ночная башня ар-деко снизу, прожекторы, прицел на крыше
  function tower(c, t) {
    // ступени башни: [x0, x1, верх, низ]
    const T = [[230, 850, 1150, 1950], [300, 780, 720, 1150], [360, 720, 520, 720], [410, 670, 420, 520], [470, 610, 330, 420]];
    for (const [x0, x1, y0, y1] of T) {
      towerPoly(c, x0, x1, y0, y1); c.fillStyle = lg(c, KX(x0, y0), 0, KX(x1, y0), 0, [[0, '#1c2638'], [.18, '#2c3a52'], [.5, '#141c2a'], [1, '#090d15']]); c.fill();
      c.save(); towerPoly(c, x0, x1, y0, y1); c.clip();
      // простенки и окна
      const n = Math.round((x1 - x0) / 34); for (let k = 0; k < n; k++) { const wx = x0 + 8 + k * (x1 - x0 - 16) / n, ww = (x1 - x0 - 16) / n;
        c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.moveTo(KX(wx + ww * .25, y0), y0); c.lineTo(KX(wx + ww * .75, y0), y0); c.lineTo(KX(wx + ww * .75, y1), y1); c.lineTo(KX(wx + ww * .25, y1), y1); c.fill();
        for (let yy = y0 + 18; yy < y1 - 10; yy += 30) { const h = H2(k * 13 + x0, yy); if (h < .42) continue; const on = h > .9 ? .6 + .4 * Math.sin(t * 1.3 + k + yy) : 1; c.fillStyle = `rgba(255,${190 + 40 * h | 0},${110 + 60 * h | 0},${(.25 + .6 * (h - .42)) * on})`; const xa = KX(wx + ww * .3, yy), xb = KX(wx + ww * .7, yy); c.fillRect(xa, yy, xb - xa, 16) } }
      // подсветка снизу и сверху ступени
      c.fillStyle = lg(c, 0, y0, 0, y0 + 140, [[0, 'rgba(255,210,150,.35)'], [1, 'rgba(255,210,150,0)']]); c.fillRect(0, y0, WW, 140);
      c.restore();
      c.strokeStyle = 'rgba(255,220,170,.45)'; c.lineWidth = 2; c.beginPath(); c.moveTo(KX(x0, y0), y0); c.lineTo(KX(x1, y0), y0); c.stroke();
    }
    // шпиль
    c.fillStyle = lg(c, 530, 0, 550, 0, [[0, '#3a4660'], [1, '#121824']]); c.beginPath(); c.moveTo(KX(528, 330), 330); c.lineTo(540, 190); c.lineTo(KX(552, 330), 330); c.fill();
    glowDot(c, 540, 196, 40, '#ff3b30', .6 + .4 * Math.sin(t * 3));
  }
  function s07(c, t, u) {
    const q = Q;
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, '#04070f'], [.6, '#0b1730'], [.9, '#2a2a3a'], [1, '#5a3a2a']]); c.fillRect(0, 0, WW, HH);
    c.save(); c.globalCompositeOperation = 'screen'; for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(255,255,255,${.15 + .5 * H1(i * 3.3) * (.6 + .4 * Math.sin(t * 2 + i))})`; c.fillRect(H1(i * 7.1) * WW, H1(i * 5.3) * 900, 1.6, 1.6) } c.restore();
    c.save(); cam(c, u, { s0: 1, s1: 1.08, d: 2.4, fx: 540, fy: 700, dy: 40 });
    const sw = Math.sin(t * .9);
    beam(c, 200, 1500, Math.PI + .35 + sw * .18, .1, 1800, '#cfe4ff', .5); beam(c, 880, 1500, Math.PI - .3 - sw * .2, .1, 1800, '#cfe4ff', .45);
    glow(c, 540, 600, 400, 520, '#ffd09a', .22);
    tower(c, t);
    c.restore();
    // город снизу, размыт
    c.save(); c.filter = 'blur(6px)'; for (let i = 0; i < 14; i++) { const x = i * 84 - 20 + H1(i) * 30, h = 160 + 220 * H1(i * 3.1); c.fillStyle = '#05070c'; c.fillRect(x, HH - h, 90, h); for (let k = 0; k < 10; k++) if (H2(i, k) > .6) { c.fillStyle = 'rgba(255,200,120,.5)'; c.fillRect(x + 10 + (k % 3) * 24, HH - h + 20 + Math.floor(k / 3) * 30, 10, 12) } } c.restore();
    // прицел на крыше
    const k = at(t, q.rey - .15, q.rey + .35);
    if (k > 0) { const s = lp(260, 120, eo(k)), x = 540, y = 400; c.save(); c.strokeStyle = C.orange; c.lineWidth = 4; c.shadowColor = C.orange; c.shadowBlur = 16; c.globalAlpha = cl(k * 3);
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { c.beginPath(); c.moveTo(x + sx * s, y + sy * (s - 34)); c.lineTo(x + sx * s, y + sy * s); c.lineTo(x + sx * (s - 34), y + sy * s); c.stroke() }
      c.beginPath(); c.arc(x, y, 10, 0, TAU); c.stroke(); c.restore() }
    tag(c, 560, 400, 1000, 300, 'ТАБАЧНАЯ ИМПЕРИЯ', 'R.J. REYNOLDS', (t - q.rey - .05) / .6, C.orange, 'right');
    motes(c, t, 61, 30, '#cfe4ff', .5);
  }
  // 8. «создатель сигарет Camel и Winston» — две пачки падают под лучи прожекторов
  function camelArt(x, w, h) {   // лицевая сторона пачки CAMEL (свой рисунок, не логотип)
    x.fillStyle = lg(x, 0, 0, 0, h, [[0, '#ecd08a'], [1, '#c99a45']]); x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(90,50,15,.55)'; x.lineWidth = 6; x.strokeRect(14, 14, w - 28, h - 28);
    font(x, { f: 'O', w: 700, s: w * .25, ls: 4 }); x.textAlign = 'center'; x.lineWidth = 8; x.strokeStyle = '#f7ecd0'; x.strokeText('CAMEL', w / 2, h * .25); x.fillStyle = '#5a2e10'; x.fillText('CAMEL', w / 2, h * .25);
    x.save(); x.translate(w * .14, h * .38); x.scale(w / 230, w / 230); x.fillStyle = '#6b3a17'; x.strokeStyle = '#6b3a17'; x.lineCap = 'round';
    x.beginPath(); x.ellipse(92, 82, 54, 23, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(86, 64, 30, 27, 0, Math.PI, TAU); x.fill();
    x.lineWidth = 17; x.beginPath(); x.moveTo(136, 80); x.quadraticCurveTo(156, 64, 160, 36); x.stroke(); x.beginPath(); x.ellipse(170, 30, 17, 9, -.2, 0, TAU); x.fill();
    x.lineWidth = 9; for (const [a, b] of [[58, 54], [72, 74], [118, 120], [132, 136]]) { x.beginPath(); x.moveTo(a, 96); x.lineTo(b, 146); x.stroke() }
    x.lineWidth = 4; x.beginPath(); x.moveTo(40, 80); x.lineTo(32, 100); x.stroke();
    x.restore();
    font(x, { f: 'J', w: 500, s: w * .045, ls: 2 }); x.fillStyle = '#5a2e10'; x.fillText('TURKISH & DOMESTIC BLEND', w / 2, h * .88);
  }
  function winstonArt(x, w, h) {
    x.fillStyle = lg(x, 0, 0, 0, h, [[0, '#fbf9f4'], [1, '#e3ded4']]); x.fillRect(0, 0, w, h);
    x.fillStyle = '#c3141c'; x.beginPath(); x.moveTo(0, 0); x.lineTo(w, 0); x.lineTo(w, h * .2); x.lineTo(w / 2, h * .3); x.lineTo(0, h * .2); x.fill();
    font(x, { f: 'O', w: 700, s: w * .2, ls: 3 }); x.textAlign = 'center'; x.fillStyle = '#b5121b'; x.fillText('WINSTON', w / 2, h * .56);
    x.strokeStyle = '#c9a24a'; x.lineWidth = 5; x.beginPath(); x.arc(w / 2, h * .72, w * .08, 0, TAU); x.stroke(); x.fillStyle = '#c9a24a'; x.beginPath(); x.arc(w / 2, h * .72, w * .03, 0, TAU); x.fill();
    font(x, { f: 'J', w: 500, s: w * .045, ls: 2 }); x.fillStyle = '#7a1a1a'; x.fillText('FILTER CIGARETTES', w / 2, h * .9);
  }
  function packMarlboroArt(x, w, h) {
    x.fillStyle = lg(x, 0, 0, 0, h, [[0, '#fbfaf6'], [1, '#e2ded5']]); x.fillRect(0, 0, w, h);
    x.fillStyle = '#d0101c'; x.beginPath(); x.moveTo(0, 0); x.lineTo(w, 0); x.lineTo(w, h * .42); x.lineTo(w * .62, h * .42); x.lineTo(w * .5, h * .25); x.lineTo(w * .38, h * .42); x.lineTo(0, h * .42); x.fill();
    font(x, { f: 'O', w: 700, s: w * .19, ls: 1 }); x.textAlign = 'center'; x.fillStyle = '#1a1a1a'; x.fillText('Marlboro', w / 2, h * .64);
    font(x, { f: 'J', w: 500, s: w * .045, ls: 2 }); x.fillStyle = '#333'; x.fillText('FILTER CIGARETTES', w / 2, h * .74);
  }
  // пачка коробкой: лицевая сторона (картинка), правый бок, верх — простые грани с градиентом; начало — низ середины лица
  function pack(c, art, key, w, h, o = {}) {
    const d = w * .3, dx = d * .78, dy = d * .42, img = cache('pk' + key, 360, 520, (x, W, H) => art(x, W, H));
    c.save();
    shadowE(c, w * .25, 8, w * .85, 24, .8);
    c.fillStyle = lg(c, w / 2, 0, w / 2 + dx, 0, [[0, o.side || '#8f8a80'], [1, mixh(o.side || '#8f8a80', '#000000', .5)]]); poly(c, [w / 2, 0, w / 2 + dx, -dy, w / 2 + dx, -h - dy, w / 2, -h]); c.fill();
    c.fillStyle = lg(c, 0, -h - dy, 0, -h, [[0, mixh(o.top || '#d8d2c6', '#ffffff', .3)], [1, o.top || '#d8d2c6']]); poly(c, [-w / 2, -h, w / 2, -h, w / 2 + dx, -h - dy, -w / 2 + dx, -h - dy]); c.fill();
    c.drawImage(img, -w / 2, -h, w, h);
    c.globalCompositeOperation = 'multiply'; c.fillStyle = lg(c, -w / 2, 0, w / 2, 0, [[0, 'rgb(200,195,190)'], [.3, '#ffffff'], [1, 'rgb(210,205,200)']]); c.fillRect(-w / 2, -h, w, h);
    c.globalCompositeOperation = 'screen'; c.fillStyle = lg(c, -w / 2, -h, -w / 2 + w * .5, -h + h * .5, [[0, 'rgba(255,255,255,.28)'], [1, 'rgba(255,255,255,0)']]); c.fillRect(-w / 2, -h, w, h);
    c.globalCompositeOperation = 'source-over'; c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-w / 2, -h); c.lineTo(w / 2, -h); c.lineTo(w / 2 + dx, -h - dy); c.stroke();
    c.restore();
  }
  function s08(c, t, u) {
    const q = Q, fl = 1130, l1 = cl((t - q.sozd + .1) / .3), l2 = cl((t - q.camel + .1) / .3), l3 = cl((t - q.winston + .1) / .3);
    bg(c, t, { top: '#120b07', bot: '#030201', glows: [[330, 900, 330, 420, '#ffb46a', .35 * l2], [760, 900, 330, 420, '#ffb46a', .35 * l3]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.05, d: 2.2, fx: 540, fy: 900 });
    c.fillStyle = lg(c, 0, fl - 4, 0, HH, [[0, 'rgba(60,40,25,.7)'], [.05, 'rgba(18,12,8,.95)'], [1, '#030201']]); c.fillRect(-100, fl, WW + 200, HH);
    beam(c, 330, -100, 0, .34, 1350, '#ffe2bd', .55 * Math.max(.35 + .45 * l1, l2)); beam(c, 760, -100, 0, .34, 1350, '#ffe2bd', .55 * Math.max(.35 + .45 * l1, l3));
    dust(c, t, 330, -100, 0, .3, 1300, 40, 5, .7); dust(c, t, 760, -100, 0, .3, 1300, 40, 9, .7);
    glow(c, 330, fl, 240, 40, '#ffb46a', .25 + .3 * l2); glow(c, 760, fl, 240, 40, '#ffb46a', .25 + .3 * l3);
    const drop = (t0) => { const k = (t - t0 + .05) / .5; return k <= 0 ? null : -(1 - eb(k)) * 900 };
    const d1 = drop(q.camel), d2 = drop(q.winston);
    if (d1 != null) { c.save(); c.translate(330, fl + d1); c.rotate(-.06 * (1 - cl((t - q.camel) / .5))); pack(c, camelArt, 'camel', 300, 430, { side: '#a07a3c', top: '#e6c98a' }); c.restore() }
    if (d2 != null) { c.save(); c.translate(760, fl + d2); c.rotate(.05 * (1 - cl((t - q.winston) / .5))); pack(c, winstonArt, 'winston', 300, 430, { side: '#9a958c', top: '#eeeae2' }); c.restore() }
    c.restore();
    tag(c, 330, 735, 300, 330, 'МАРКА', 'CAMEL', (t - q.camel - .25) / .5, C.amber, 'right');
    tag(c, 760, 735, 790, 330, 'МАРКА', 'WINSTON', (t - q.winston - .25) / .5, C.amber, 'left');
    motes(c, t, 71, 40, '#ffd9b0', .7);
  }
  // 9–11. записка 1973: печатается, штамп «СЕКРЕТНО»; потом крупно — цитата, маркер по словам
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
  function deskBg(c, t, lamp = 1) {
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, '#120c08'], [1, '#050302']]); c.fillRect(0, 0, WW, HH);
    c.save(); c.globalAlpha = .22; c.globalCompositeOperation = 'overlay'; const n = noiseTex('wood', 128, 1024, 6, 3); c.drawImage(n, 0, 0, WW, HH); c.restore();
    glow(c, 300, 300, 900, 800, '#ffb66a', .35 * lamp);
  }
  function s09(c, t, u) {
    const q = Q;
    deskBg(c, t);
    c.save(); cam(c, u, { s0: 1, s1: 1.07, d: 1.8, fx: 540, fy: 820 });
    c.save(); c.translate(540, 820); c.rotate(-.035);
    sheet(c, MEMO.w, MEMO.h, 'memo', x => memoBody(x, t, { type: cl((t - q.gotov + .3) / 1.1) }));
    stamp(c, 'СЕКРЕТНО', MEMO.w * .2, -MEMO.h / 2 + 430, -.14, t, q.sekr + .02, C.red2, 74, { op: 'multiply', a: .9 });
    c.restore();
    beam(c, 120, -200, -.5, .55, 1700, '#ffd9a8', .35); dust(c, t, 120, -200, -.5, .5, 1500, 50, 7, .7);
    c.restore();
    motes(c, t, 81, 26, '#ffd9b0', .5);
  }
  function topShade(c) { c.drawImage(cache('tsh', WW, 420, (x) => { x.fillStyle = lg(x, 0, 0, 0, 420, [[0, 'rgba(6,4,2,.88)'], [.55, 'rgba(6,4,2,.45)'], [1, 'rgba(6,4,2,0)']]); x.fillRect(0, 0, WW, 420) }), 0, 0) }
  function memoSheet(c, t, o) {   // лист с уже напечатанным, штамп стоит
    c.save(); c.translate(540, 820); c.rotate(-.035);
    sheet(c, MEMO.w, MEMO.h, 'memo', x => { memoBody(x, t, o); x.save(); x.translate(MEMO.w * .7, 430); x.rotate(-.14); const im = stampImg('СЕКРЕТНО', C.red2, 74); x.globalAlpha = .9; x.globalCompositeOperation = 'multiply'; x.drawImage(im, -im.width / 2, -im.height / 2); x.restore(); if (o.done) o.done(x) });
    c.restore();
  }
  function s10(c, t, u) {
    const q = Q;
    deskBg(c, t);
    c.save(); cam(c, u, { s0: 1.3, s1: 1.45, d: 2.6, fx: 540, fy: lp(600, 760, eio(u / 2.4)), ease: 'lin' });
    memoSheet(c, t, { mark: eo(at(t, q.pryamo - .1, q.pryamo + .4)) });
    c.restore(); topShade(c);
    beam(c, 80, -200, -.45, .55, 1700, '#ffd9a8', .3);
    motes(c, t, 91, 22, '#ffd9b0', .5);
  }
  function s11(c, t, u) {
    const q = Q, hl = {}, M = [['WE', 0], ['MUST', 1], ['GET', 2], ['OUR', 3], ['SHARE OF THE', 4], ['YOUTH', 5], ['MARKET.', 6]];
    for (const [w, i] of M) hl[w] = eo(at(t, q.qt[i] - .05, q.qtB[i]));
    deskBg(c, t, .8);
    c.save(); cam(c, u, { s0: 1.45, s1: 1.62, d: 3.6, fx: 540, fy: lp(780, 840, eio(u / 3.6)), ease: 'lin' });
    memoSheet(c, t, { hl, mark: 1 });
    c.restore(); topShade(c);
    const g = cl((t - q.qt[6]) / .4); if (g > 0) glow(c, 640, 1010, 360, 120, '#ffe24a', .35 * g * (1 - cl((t - q.e4 - .2) / .6)));
    beam(c, 60, -200, -.42, .5, 1700, '#ffd9a8', .25);
    motes(c, t, 101, 18, '#ffd9b0', .45);
  }

  // ================= планы 0:27–1:03 =================
  // 12. «Но вот проблема: обычный табачный дым» — сигарета наискось, густой дым, ярлык «7000+ веществ»
  function s12(c, t, u) {
    const q = Q;
    bg(c, t, { top: '#0c0a0c', bot: '#020203', glows: [[700, 640, 380, 380, '#ff6a2a', .4], [540, 1000, 600, 600, '#3a4a6a', .25]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.1, d: 2.6, fx: 700, fy: 650 });
    c.save(); c.translate(470, 980); c.rotate(-.62); cigarette(c, 980, 84, { t }); c.restore();
    const ex = 470 + Math.cos(-.62) * 490, ey = 980 + Math.sin(-.62) * 490;
    smoke(c, t, ex, ey - 10, { n: 30, life: 4.2, rise: 820, sway: 90, drift: -60, spread: 24, r0: 20, r1: 240, a: .42, seed: 13, col: '#d8d2ca' });
    smoke(c, t + 1.7, ex, ey - 10, { n: 14, life: 3.2, rise: 600, sway: 60, spread: 18, r0: 12, r1: 120, a: .3, seed: 29 });
    c.restore();
    tag(c, ex - 30, ey - 260, 560, 300, 'ТАБАЧНЫЙ ДЫМ', '7000+ ВЕЩЕСТВ', (t - q.dym + .05) / .5, C.red, 'right');
    motes(c, t, 111, 30, '#ffcfa0', .6);
  }
  // 13. «слишком едкий и сильно дерёт горло подросткам» — профиль головы на просвет, горло краснеет и пульсирует
  const HEADP = 'M-120 160C-150 90 -170 20 -160 -60C-150 -170 -60 -230 40 -220C140 -210 190 -140 190 -50C190 -20 200 0 225 40C232 52 222 62 205 62C200 90 205 110 190 120C180 130 170 140 172 160C175 185 150 200 110 195L70 190L70 260L-120 260Z';
  const AIRP = 'M196 92C160 96 122 102 98 122C78 140 68 170 66 200L64 262';
  function head(c, t, irr, calm) {
    const hp = new Path2D(HEADP), air = new Path2D(AIRP);
    c.fillStyle = rg(c, 20, -40, 20, 320, [[0, 'rgba(60,130,190,.42)'], [1, 'rgba(10,30,60,.75)']]); c.fill(hp);
    c.save(); c.clip(hp); c.globalCompositeOperation = 'screen'; c.fillStyle = lg(c, 180, 0, 100, 0, [[0, 'rgba(160,220,255,.25)'], [1, 'rgba(160,220,255,0)']]); c.fillRect(-200, -260, 460, 540); c.restore();
    c.strokeStyle = 'rgba(170,230,255,.95)'; c.lineWidth = 2.6; c.shadowColor = '#6fd0ff'; c.shadowBlur = 18; c.stroke(hp); c.shadowBlur = 0;
    c.strokeStyle = 'rgba(210,240,255,.32)'; c.lineWidth = 6; c.beginPath(); c.ellipse(10, -80, 150, 122, -.15, Math.PI * .92, Math.PI * 2.12); c.stroke();
    c.beginPath(); c.moveTo(120, 140); c.quadraticCurveTo(150, 175, 105, 185); c.stroke();
    for (let i = 0; i < 6; i++) { c.fillStyle = 'rgba(210,240,255,.2)'; rr(c, -96, 36 + i * 37, 52, 28, 8); c.fill() }
    c.save(); c.globalCompositeOperation = 'screen'; c.lineCap = 'round';
    const col = calm ? `rgba(140,255,200,.75)` : `rgba(255,${210 - 170 * irr | 0},${210 - 190 * irr | 0},.85)`;
    c.strokeStyle = col; c.lineWidth = 24 * (1 + .1 * Math.sin(t * 11) * irr); c.stroke(air);
    c.lineWidth = 8; c.strokeStyle = 'rgba(255,255,255,.45)'; c.stroke(air);
    glowDot(c, 70, 175, 150 * (1 + .2 * Math.sin(t * 7)), calm ? '#3fe08a' : '#ff2a2a', calm ? .5 : irr * .95);
    for (let i = 0; i < 30; i++) { const ph = (t * (calm ? .7 : 1) + H1(i * 3.1)) % 1, px = lp(320, 70, ph) + Math.sin(i + t * 3) * 6, py = ph < .55 ? lp(92 + (H1(i) - .5) * 30, 120, ph / .55) : lp(125, 260, (ph - .55) / .45);
      c.globalAlpha = (calm ? .32 : .6) * Math.sin(Math.PI * ph); c.fillStyle = calm ? '#e6fff4' : '#cfc6bb'; c.beginPath(); c.arc(px, py, (calm ? 7 : 3) + 3 * H1(i * 7), 0, TAU); c.fill() }
    c.restore();
  }
  function s13(c, t, u) {
    const q = Q, irr = cl((t - q.edkiy) / .7) * (.7 + .3 * Math.sin(t * 8)), hit = cl((t - q.deret) / .3);
    bg(c, t, { top: '#020814', bot: '#01030a', glows: [[540, 820, 560, 700, '#1d5fb0', .35], [600, 1050, 300, 300, '#ff2a2a', .35 * irr]] });
    grid(c, 60, .045);
    c.save(); cam(c, u, { s0: 1, s1: 1.18, d: 3, fx: 600, fy: 1040 });
    c.save(); c.translate(470, 800); c.scale(2.1, 2.1); head(c, t, Math.max(irr, hit), false); c.restore();
    if (irr > .05) { const bl = .5 + .5 * Math.sin(t * 10); c.save(); c.strokeStyle = `rgba(255,60,60,${.45 + .5 * bl})`; c.lineWidth = 4; c.setLineDash([22, 12]); c.beginPath(); c.arc(612, 1170, 150 + 10 * bl, 0, TAU); c.stroke(); c.setLineDash([]); c.restore() }
    for (let i = 0; i < 3; i++) { const k = ((t - q.deret) * 1.4 - i * .33); if (k > 0 && k < 1) { c.save(); c.globalAlpha = (1 - k) * .8; c.strokeStyle = C.red; c.lineWidth = 6 * (1 - k); c.beginPath(); c.arc(612, 1170, 60 + k * 360, 0, TAU); c.stroke(); c.restore() } }
    c.restore();
    tag(c, 640, 1180, 720, 700, 'ГОРЛО', 'РАЗДРАЖЕНИЕ', (t - q.gorlo + .05) / .55, C.red, 'left');
    motes(c, t, 121, 26, '#9fdcff', .5);
  }
  // колба Эрленмейера: дно в (0, 0), высота h; o.lv — уровень 0..1, o.col — цвет жидкости, o.rot — наклон, o.label
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
  function labBack(c, t) {
    c.drawImage(cache('labBk', WW, HH, (x, W, H) => {
      const m = mk(W, H), y = m.getContext('2d'); y.fillStyle = '#04080e'; y.fillRect(0, 0, W, H);
      for (let r = 0; r < 5; r++) { const sy = 280 + r * 260; y.fillStyle = '#121a26'; y.fillRect(0, sy, W, 12);
        for (let i = 0; i < 22; i++) { const bx = 10 + i * 52 + H1(r * 40 + i) * 16, bh = 60 + H1(r * 9 + i * 3) * 130, bw = 22 + H1(i * 7 + r) * 28, col = ['#3fd3c6', '#ffb54a', '#8fd6ff', '#ff6a5a', '#b4ff8a'][(i + r) % 5];
          y.fillStyle = rgba(col, .14 + .28 * H1(i * 3 + r)); rr(y, bx, sy - bh, bw, bh, 6); y.fill(); y.fillStyle = 'rgba(255,255,255,.18)'; y.fillRect(bx + 4, sy - bh + 6, 3, bh - 12) } }
      x.filter = 'blur(14px)'; x.drawImage(m, 0, 0);
    }), 0, 0);
  }
  // 14. «Тогда химики смешали никотин с особой кислотой» — две колбы льют в третью
  function stream(c, x0, y0, x1, y1, col, w, t, k = 1) {
    if (k <= 0) return; c.save(); c.globalCompositeOperation = 'screen'; c.strokeStyle = rgba(col, .85); c.lineCap = 'round'; c.lineWidth = w; c.shadowColor = col; c.shadowBlur = 16;
    c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(lp(x0, x1, .3), y0 + 10, lp(x0, x1, .3 + .7 * k), lp(y0, y1, k)); c.stroke();
    for (let i = 0; i < 8; i++) { const s = (t * 3 + i / 8) % 1; if (s > k) continue; c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(lp(x0, x1, .3 + .7 * s), lp(y0, y1, s), w * .3, 0, TAU); c.fill() } c.restore();
  }
  function s14(c, t, u) {
    const q = Q, p1 = at(t, q.nikot - .25, q.nikot + .2), p2 = at(t, q.kisl - .25, q.kisl + .2), e1 = eio(p1), e2 = eio(p2);
    labBack(c, t); glow(c, 540, 1050, 520, 520, '#3a8cff', .3); glow(c, 540, 1150, 300, 260, C.amber, .25 + .3 * e1);
    c.save(); cam(c, u, { s0: 1, s1: 1.06, d: 2.9, fx: 540, fy: 950 });
    c.fillStyle = lg(c, 0, 1390, 0, HH, [[0, 'rgba(30,40,55,.9)'], [.06, 'rgba(8,12,18,.95)'], [1, '#020306']]); c.fillRect(-100, 1390, WW + 200, 600);
    const lv = .12 + .25 * at(t, q.nikot, q.nikot + 1.2) + .25 * at(t, q.kisl, q.kisl + 1.2), mixc = mixh(C.amber, '#c9ff8a', .35 * at(t, q.kisl, q.kisl + 1));
    shadowE(c, 540, 1395, 250, 26, .8); c.save(); c.translate(540, 1390); flask(c, 560, t, { lv, col: mixc, glow: .25 }); c.restore();
    c.save(); c.translate(lp(150, 170, e1), lp(1180, 895, e1)); flask(c, 330, t, { lv: .55 - .3 * at(t, q.nikot, q.nikot + 1.4), col: C.amber, rot: lp(0, 1.15, e1), label: 'НИКОТИН' }); c.restore();
    c.save(); c.translate(lp(930, 910, e2), lp(1180, 895, e2)); flask(c, 330, t, { lv: .55 - .3 * at(t, q.kisl, q.kisl + 1.4), col: '#c9ff8a', rot: lp(0, -1.15, e2), label: 'КИСЛОТА' }); c.restore();
    stream(c, 470, 762, 528, 900, C.amber, 14, t, at(t, q.nikot + .1, q.nikot + .4) * (1 - at(t, q.nikot + 1.3, q.nikot + 1.6)));
    stream(c, 610, 762, 552, 900, '#c9ff8a', 14, t, at(t, q.kisl + .1, q.kisl + .4) * (1 - at(t, q.kisl + 1.3, q.kisl + 1.6)));
    c.restore();
    motes(c, t, 131, 26, '#9fdcff', .5);
  }
  // кристалл: шестигранная призма; s — высота
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
  // 15. «и получили никотиновую соль» — колба светится, растёт кристалл, крупная подпись
  function s15(c, t, u) {
    const q = Q, g = cl((t - q.nikot2 + .1) / .5), k = pop(t, q.nikot2 - .05, .6);
    bg(c, t, { top: '#0c0804', bot: '#020101', glows: [[540, 980, 620, 620, C.amber, .35 + .35 * g], [540, 980, 200, 200, '#ffffff', .2 * g]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.08, d: 2, fx: 540, fy: 1000 });
    c.save(); c.translate(540, 1400); flask(c, 760, t, { lv: .62, col: mixh(C.amber, '#c9ff8a', .35), glow: .5 * g }); c.restore();
    c.save(); c.translate(540, 1020 - 60 * eo(g)); c.scale(k, k); c.rotate(.12); crystal(c, 380, t, cl(k)); c.restore();
    c.restore();
    plate(c, 540, 420, 'НИКОТИНОВАЯ СОЛЬ', 'НИКОТИН + КИСЛОТА', (t - q.sol + .15) / .5, { s: 100 });
    motes(c, t, 141, 40, '#ffd27a', .8);
  }
  // 16. «которая заходит мягко даже в убойной дозе» — прибор «ДОЗА»: стрелка уходит в красное, «вдох мягкий»
  function gauge(c, r, v, t, o = {}) {
    const a0 = Math.PI * .8, a1 = Math.PI * 2.2;
    c.save();
    shadowE(c, 10, r * 1.08, r * 1.1, r * .2, .6);
    c.fillStyle = rg(c, -r * .3, -r * .4, r * .1, r * 1.15, [[0, '#6b7280'], [.5, '#2b3038'], [1, '#0d0f13']]); c.beginPath(); c.arc(0, 0, r * 1.08, 0, TAU); c.fill();
    c.fillStyle = lg(c, 0, -r, 0, r, [[0, '#d7dbe2'], [.5, '#7d8490'], [1, '#2a2f37']]); c.beginPath(); c.arc(0, 0, r * 1.02, 0, TAU); c.fill();
    c.fillStyle = rg(c, 0, -r * .2, 0, r, [[0, '#1b2029'], [1, '#07090c']]); c.beginPath(); c.arc(0, 0, r * .94, 0, TAU); c.fill();
    const seg = [[0, .55, '#3fe08a'], [.55, .78, '#ffd23a'], [.78, 1, '#ff3b30']];
    for (const [s0, s1, col] of seg) { c.strokeStyle = col; c.lineWidth = r * .07; c.shadowColor = col; c.shadowBlur = 12; c.beginPath(); c.arc(0, 0, r * .8, lp(a0, a1, s0) + .01, lp(a0, a1, s1) - .01); c.stroke() } c.shadowBlur = 0;
    for (let i = 0; i <= 20; i++) { const a = lp(a0, a1, i / 20), L = i % 5 ? .06 : .12; c.strokeStyle = 'rgba(230,236,245,.8)'; c.lineWidth = i % 5 ? 2 : 4; c.beginPath(); c.moveTo(Math.cos(a) * r * .7, Math.sin(a) * r * .7); c.lineTo(Math.cos(a) * r * (.7 - L), Math.sin(a) * r * (.7 - L)); c.stroke() }
    tx(c, 'MAX', Math.cos(lp(a0, a1, .93)) * r * .5, Math.sin(lp(a0, a1, .93)) * r * .5 + 12, { f: 'O', w: 700, s: r * .11, c: '#ff5a50' });
    tx(c, o.title || 'ДОЗА НИКОТИНА', 0, r * .42, { f: 'J', w: 700, s: r * .075, ls: 3, c: 'rgba(220,226,236,.85)' });
    const a = lp(a0, a1, v) + Math.sin(t * 40) * .006 * v;
    c.save(); c.rotate(a); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 12; c.shadowOffsetY = 6; c.fillStyle = '#ff3b30'; c.beginPath(); c.moveTo(-r * .12, -r * .025); c.lineTo(r * .76, 0); c.lineTo(-r * .12, r * .025); c.closePath(); c.fill(); c.restore();
    c.fillStyle = rg(c, -r * .02, -r * .03, 0, r * .1, [[0, '#f2f4f8'], [1, '#3a3f48']]); c.beginPath(); c.arc(0, 0, r * .09, 0, TAU); c.fill();
    c.globalCompositeOperation = 'screen'; c.fillStyle = lg(c, -r, -r, r * .2, r * .2, [[0, 'rgba(255,255,255,.18)'], [.5, 'rgba(255,255,255,.03)'], [1, 'rgba(255,255,255,0)']]); c.beginPath(); c.arc(0, 0, r * .94, 0, TAU); c.fill();
    c.restore();
  }
  function s16(c, t, u) {
    const q = Q, v = lp(.08, .2, at(t, q.zahod, q.myagko)) + .74 * eb(at(t, q.uboy - .15, q.uboy + .55)), soft = pop(t, q.myagko - .05, .45);
    bg(c, t, { top: '#0b0d14', bot: '#020306', glows: [[540, 760, 560, 560, v > .7 ? C.red : C.orange, .3 + .25 * cl((v - .6) * 3)]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.07, d: 3.4, fx: 540, fy: 800 });
    c.save(); c.translate(540, 780); gauge(c, 360, cl(v, 0, 1.02), t); c.restore();
    if (soft > 0) { c.save(); c.translate(540, 1300); c.scale(soft, soft); rr(c, -250, -54, 500, 108, 54); c.fillStyle = 'rgba(8,30,18,.9)'; c.fill(); c.strokeStyle = C.green; c.lineWidth = 3; c.shadowColor = C.green; c.shadowBlur = 20; c.stroke(); c.shadowBlur = 0;
      tx(c, 'ВДОХ: МЯГКИЙ  ✓', 0, 16, { f: 'O', w: 700, s: 46, ls: 1, c: '#bfffd8' }); c.restore() }
    c.restore();
    if (v > .85) { c.save(); c.globalAlpha = .5 + .5 * Math.sin(t * 12); tx(c, 'УБОЙНАЯ ДОЗА', 540, 330, { f: 'O', w: 700, s: 64, ls: 4, c: C.red, glow: C.red, gb: 20 }); c.restore() }
    motes(c, t, 151, 30, '#ffd9b0', .6);
  }
  // 17. «Но электронных сигарет тогда ещё не продавали… заливать эту жидкость было не во что» — колба льёт сквозь пустой силуэт вейпа
  function vapeOutline(c, h) {
    const w = h * .3, mpH = h * .17, m0 = w * .8, m1 = w * .56, top = -h, bT = -h + mpH, R = w * .17;
    c.beginPath(); c.roundRect(-w / 2, bT, w, -bT, [R, R, R * .8, R * .8]);
    c.moveTo(-m0 / 2, bT); c.bezierCurveTo(-m0 / 2, top + mpH * .5, -m1 / 2, top + mpH * .25, -m1 / 2, top + mpH * .14); c.quadraticCurveTo(-m1 / 2, top, 0, top); c.quadraticCurveTo(m1 / 2, top, m1 / 2, top + mpH * .14); c.bezierCurveTo(m1 / 2, top + mpH * .25, m0 / 2, top + mpH * .5, m0 / 2, bT);
  }
  function s17(c, t, u) {
    const q = Q, pr = eio(at(t, q.zaliv - .5, q.zaliv + .1)), fl = 1400;
    bg(c, t, { top: '#08090f', bot: '#020204', glows: [[620, 860, 420, 600, '#9fd0ff', .18], [300, 520, 300, 300, C.amber, .3 * pr]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.06, d: 4.2, fx: 560, fy: 900 });
    c.fillStyle = lg(c, 0, fl - 4, 0, HH, [[0, 'rgba(40,46,60,.7)'], [.05, 'rgba(10,12,18,.95)'], [1, '#020204']]); c.fillRect(-100, fl, WW + 200, 600);
    // пустой силуэт одноразки
    const da = .55 + .45 * Math.sin(t * 3) * cl((t - q.vochto) / .3);
    c.save(); c.translate(640, fl); c.setLineDash([22, 16]); c.lineDashOffset = -t * 30; c.strokeStyle = `rgba(220,235,255,${.55 + .3 * da})`; c.lineWidth = 5; vapeOutline(c, 820); c.stroke(); c.setLineDash([]);
    tx(c, '?', 0, -330, { f: 'O', w: 700, s: 260, c: rgba('#ffffff', .25 + .5 * da), glow: '#9fd0ff', gb: 30 }); c.restore();
    // «ещё не продавали» — красная плашка
    stamp(c, 'В ПРОДАЖЕ НЕТ', 640, 400, -.06, t, q.prod, C.red, 58, { ring: false });
    // колба наклоняется сверху слева и льёт
    c.save(); c.translate(lp(80, 330, pr), lp(380, 560, pr)); flask(c, 360, t, { lv: .5 - .25 * at(t, q.zaliv + .1, q.zaliv + 1.6), col: C.amber, rot: lp(.2, 1.9, pr), glow: .3 }); c.restore();
    const sk = at(t, q.zaliv + .05, q.zaliv + .45);
    if (sk > 0) { c.save(); c.globalCompositeOperation = 'screen'; c.strokeStyle = rgba(C.amber, .9); c.lineWidth = 16; c.lineCap = 'round'; c.shadowColor = C.amber; c.shadowBlur = 20;
      c.beginPath(); c.moveTo(560, 640); c.quadraticCurveTo(640, 700, 640, lp(700, fl - 6, sk)); c.stroke(); c.restore();
      const pk = at(t, q.zaliv + .4, q.zaliv + 1.6); if (pk > 0) { c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = rg(c, 640, fl + 6, 0, 260 * pk, [[0, rgba(C.amber, .6)], [1, rgba(C.amber, 0)]]); c.beginPath(); c.ellipse(640, fl + 6, 260 * eo(pk), 26 * eo(pk), 0, 0, TAU); c.fill(); c.restore();
        for (let i = 0; i < 14; i++) { const k = ((t - q.zaliv - .4) * 1.6 + H1(i)) % 1, a = -Math.PI * (.15 + .7 * H1(i * 3)), r = 30 + 160 * k; c.fillStyle = rgba(C.amber, .8 * (1 - k)); c.beginPath(); c.arc(640 + Math.cos(a) * r, fl + Math.sin(a) * r * .7 + 260 * k * k, 4, 0, TAU); c.fill() } } }
    c.restore();
    motes(c, t, 161, 26, '#ffd9b0', .5);
  }
  // 18. «И секретную формулу спрятали в архив» — папка со штампом уезжает в ящик картотеки, ящик захлопывается, свет гаснет
  function folderArt(x, W, H) {
    x.fillStyle = lg(x, 0, 0, 0, H, [[0, '#d9b47a'], [1, '#b98f52']]); x.beginPath(); x.moveTo(0, 40); x.lineTo(W * .32, 40); x.lineTo(W * .38, 0); x.lineTo(W * .7, 0); x.lineTo(W * .74, 40); x.lineTo(W, 40); x.lineTo(W, H); x.lineTo(0, H); x.fill();
    x.globalAlpha = .12; x.drawImage(noiseTex('pap', 512, 512, 3, 3, .55, 1), 0, 0, W, H); x.globalAlpha = 1;
    x.fillStyle = '#f2ead6'; x.fillRect(W * .12, H * .18, W * .76, H * .2); x.strokeStyle = 'rgba(60,40,20,.5)'; x.lineWidth = 2; x.strokeRect(W * .12, H * .18, W * .76, H * .2);
    font(x, { f: 'J', w: 700, s: W * .052, ls: 2 }); x.fillStyle = '#2a241d'; x.textAlign = 'center'; x.fillText('НИКОТИНОВАЯ СОЛЬ', W / 2, H * .27); font(x, { f: 'J', w: 500, s: W * .045, ls: 4 }); x.fillText('R.J. REYNOLDS · 1979', W / 2, H * .34);
    x.save(); x.translate(W * .52, H * .66); x.rotate(-.12); const im = stampImg('СЕКРЕТНО', C.red2, 70); x.globalCompositeOperation = 'multiply'; x.globalAlpha = .9; x.drawImage(im, -im.width / 2, -im.height / 2); x.restore();
  }
  function cabinet(c, t, open) {   // картотека: корпус и верхний ящик, open 0..1
    c.save();
    c.fillStyle = lg(c, -330, 0, 330, 0, [[0, '#2a2f37'], [.5, '#4a515c'], [1, '#1b1f25']]); rr(c, -330, 0, 660, 900, 10); c.fill();
    for (let i = 0; i < 3; i++) { const y = 40 + i * 290; c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(-310, y - 6, 620, 6); }
    // верхний ящик выдвинут вперёд (вниз по кадру), open: 1 — открыт
    const dy = 230 * open;
    c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(-300, 30, 600, dy);
    c.fillStyle = lg(c, 0, 30 + dy, 0, 30 + dy + 260, [[0, '#5d6570'], [1, '#353b44']]); rr(c, -310, 30 + dy, 620, 260, 8); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.25)'; c.lineWidth = 2; c.stroke();
    rr(c, -120, 30 + dy + 150, 240, 44, 22); c.fillStyle = lg(c, 0, 30 + dy + 150, 0, 30 + dy + 194, [[0, '#d7dbe2'], [1, '#6b7280']]); c.fill();
    rr(c, -90, 30 + dy + 50, 180, 70, 6); c.fillStyle = '#c9c2b0'; c.fill(); tx(c, '1979', 0, 30 + dy + 100, { f: 'J', w: 700, s: 34, ls: 4, c: '#2a241d' });
    for (let i = 1; i < 3; i++) { const y = 30 + i * 290 + 20; c.fillStyle = lg(c, 0, y, 0, y + 250, [[0, '#4b525c'], [1, '#2b3038']]); rr(c, -310, y, 620, 250, 8); c.fill(); rr(c, -120, y + 140, 240, 40, 20); c.fillStyle = '#8a929e'; c.fill() }
    c.restore();
  }
  function s18(c, t, u) {
    const q = Q, sl = eio(at(t, q.spryat - .1, q.arhiv - .05)), shut = eo(at(t, q.arhiv - .08, q.arhiv + .06)), dark = at(t, q.arhiv + .3, q.arhiv + .9);
    bg(c, t, { top: '#0a0b10', bot: '#020203', glows: [[540, 900, 600, 600, '#ff3b30', .25], [540, 500, 400, 300, '#ffd9a8', .3 * (1 - dark)]] });
    c.save(); cam(c, u, { s0: 1.02, s1: 1.1, d: 2.3, fx: 540, fy: 1000 });
    beam(c, 540, -150, 0, .5, 1600, '#ffe2bd', .4 * (1 - dark));
    c.save(); c.translate(540, 1080); cabinet(c, t, 1 - shut); c.restore();
    // папка: висит над ящиком → падает в него
    const fy = lp(560, 1130, sl), sc = lp(1, .82, sl);
    if (shut < 1) { c.save(); c.beginPath(); c.rect(0, 0, WW, 1110 + 230 * (1 - shut)); c.clip(); c.translate(540, fy); c.rotate(lp(-.06, 0, sl)); c.scale(sc, sc); const img = cache('fold', 600, 760, folderArt); shadowE(c, 0, 400, 300, 40, .5 * (1 - sl)); c.drawImage(img, -300, -380); c.restore() }
    c.restore();
    c.fillStyle = `rgba(0,0,0,${.75 * dark})`; c.fillRect(0, 0, WW, HH);
    motes(c, t, 171, 26, '#ffd9b0', .5 * (1 - dark));
  }
  // 19. «В 1998 году суд» — молоток бьёт; сверху — 1998
  function gavel(c, ang) {
    c.save(); c.rotate(ang);
    c.fillStyle = lg(c, 0, -14, 0, 14, [[0, '#3a1f0e'], [.4, '#8a5426'], [1, '#2a160a']]); rr(c, 0, -14, 420, 28, 14); c.fill();
    c.save(); c.translate(440, 0);
    c.fillStyle = lg(c, 0, -70, 0, 70, [[0, '#2a160a'], [.3, '#9a5e2a'], [.55, '#c98a4a'], [1, '#2a160a']]); rr(c, -60, -70, 120, 140, 18); c.fill();
    for (const x of [-46, 38]) { c.fillStyle = lg(c, 0, -72, 0, 72, [[0, '#6a4a10'], [.4, '#f2d27a'], [1, '#6a4a10']]); c.fillRect(x, -72, 10, 144) }
    c.restore(); c.restore();
  }
  function s19(c, t, u) {
    const q = Q, hit = t - q.sud; let ang = lp(.2, -.5, eo(at(t, q.y98 + .1, q.y98 + .6))); const sw = at(t, q.sud - .16, q.sud); if (sw > 0) ang = lp(-.5, .37, ei(sw)); if (hit > 0) ang = .37 - .06 * Math.exp(-hit * 9) * Math.abs(Math.cos(hit * 30));
    bg(c, t, { top: '#140c08', bot: '#030201', glows: [[540, 1000, 600, 500, '#ffb46a', .3], [600, 1080, 300, 200, '#ffffff', .4 * Math.exp(-Math.max(0, hit) * 5) * (hit > 0 ? 1 : 0)]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.06, d: 1.6, fx: 540, fy: 1000 });
    beam(c, 540, -150, 0, .5, 1500, '#ffe2bd', .35);
    // подставка
    c.save(); c.translate(600, 1150); shadowE(c, 0, 50, 220, 30, .8); c.fillStyle = lg(c, -200, 0, 200, 0, [[0, '#2a160a'], [.4, '#8a5426'], [1, '#1f1008']]); c.beginPath(); c.ellipse(0, 20, 200, 52, 0, 0, Math.PI); c.lineTo(-200, 0); c.fill(); c.fillRect(-200, -10, 400, 30); c.fillStyle = lg(c, 0, -60, 0, 0, [[0, '#c98a4a'], [1, '#6a3c18']]); c.beginPath(); c.ellipse(0, -10, 200, 52, 0, 0, TAU); c.fill(); c.restore();
    c.save(); c.translate(160, 980); gavel(c, ang); c.restore();
    if (hit > 0 && hit < .5) { c.save(); c.globalAlpha = 1 - hit / .5; c.strokeStyle = '#ffd9a8'; c.lineWidth = 6; c.beginPath(); c.ellipse(600, 1140, 200 + hit * 700, 52 + hit * 180, 0, 0, TAU); c.stroke(); c.restore() }
    c.restore();
    { const k = at(t, q.s8 - .05, q.y98 + .55), v = lp(1979, 1998, eio(k)), sp = Math.abs(lp(1979, 1998, eio(at(t + .02, q.s8 - .05, q.y98 + .55))) - v) / .02;
      odometer(c, v, 540, 600, 200, t, { speed: sp }); tx(c, 'СУД · ШТАТ МИННЕСОТА', 540, 690, { f: 'J', w: 500, s: 26, ls: 6, c: 'rgba(205,214,230,.85)', a: cl((t - q.y98) / .4) }) }
    motes(c, t, 181, 30, '#ffd9b0', .6);
  }
  // 20. «заставил табачников раскрыть свои тайны» — круглая дверь сейфа, штурвал крутится, дверь открывается, свет и бумаги
  function vault(c, r, t, spin, open) {
    c.save();
    // проём и свет за дверью
    c.fillStyle = '#05060a'; c.beginPath(); c.arc(0, 0, r * 1.02, 0, TAU); c.fill();
    if (open > 0) { glowDot(c, 0, 0, r * 2.2 * open, '#fff3d8', 1.2 * open); c.fillStyle = rg(c, 0, 0, 0, r, [[0, `rgba(255,252,240,${open})`], [1, `rgba(255,220,160,${.8 * open})`]]); c.beginPath(); c.arc(0, 0, r * .98, 0, TAU); c.fill() }
    // рама с болтами
    c.lineWidth = r * .14; c.strokeStyle = lg(c, -r, -r, r, r, [[0, '#9aa3ae'], [.5, '#3a4048'], [1, '#c7ced8']]); c.beginPath(); c.arc(0, 0, r * 1.09, 0, TAU); c.stroke();
    for (let i = 0; i < 24; i++) { const a = i * TAU / 24; c.fillStyle = rg(c, Math.cos(a) * r * 1.09 - 2, Math.sin(a) * r * 1.09 - 2, 0, 9, [[0, '#f2f4f8'], [1, '#4a5058']]); c.beginPath(); c.arc(Math.cos(a) * r * 1.09, Math.sin(a) * r * 1.09, 8, 0, TAU); c.fill() }
    // дверь: поворот вокруг левой петли (сжимается по x), видна толщина
    const sx = Math.cos(open * 1.45);
    c.save(); c.translate(-r, 0); c.scale(Math.max(.02, sx), 1); c.translate(r, 0);
    if (open > 0) { c.fillStyle = '#2a2f36'; c.beginPath(); c.ellipse(r * .06 / Math.max(.05, sx), 0, r, r, 0, 0, TAU); c.fill() }
    c.fillStyle = rg(c, -r * .3, -r * .35, r * .1, r * 1.1, [[0, '#d9dee5'], [.45, '#8e96a1'], [1, '#3a4048']]); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    c.save(); c.clip(); c.globalAlpha = .1; c.drawImage(noiseTex('brsh', 256, 256, 2, 2), -r, -r, r * 2, r * 2); c.restore();
    for (const k of [.82, .62]) { c.strokeStyle = 'rgba(30,34,40,.55)'; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, r * k, 0, TAU); c.stroke(); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, r * k - 4, Math.PI * 1.1, Math.PI * 1.7); c.stroke() }
    c.save(); c.rotate(spin);
    for (let i = 0; i < 4; i++) { c.save(); c.rotate(i * TAU / 4); c.fillStyle = lg(c, 0, -14, 0, 14, [[0, '#f2f4f8'], [.5, '#9aa2ad'], [1, '#4a5058']]); rr(c, 0, -14, r * .52, 28, 14); c.fill(); c.fillStyle = rg(c, r * .55, 0, 0, 30, [[0, '#ffffff'], [1, '#6b737e']]); c.beginPath(); c.arc(r * .55, 0, 26, 0, TAU); c.fill(); c.restore() }
    c.restore();
    c.fillStyle = rg(c, -10, -12, 4, r * .2, [[0, '#ffffff'], [.4, '#aeb5bf'], [1, '#3a4048']]); c.beginPath(); c.arc(0, 0, r * .17, 0, TAU); c.fill();
    c.globalCompositeOperation = 'screen'; c.fillStyle = lg(c, -r, -r, r, r, [[0, 'rgba(255,255,255,.22)'], [.4, 'rgba(255,255,255,0)'], [1, 'rgba(120,170,255,.12)']]); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    c.restore();
    c.restore();
  }
  // бумаги летят на зрителя из точки (x, y): k — время от начала
  function papers(c, t, x, y, t0, n = 26, seed = 1) {
    for (let i = 0; i < n; i++) {
      const life = 1.6 + H1(seed + i) * .8, k = ((t - t0) / life + H1(seed + i * 3.3)) % 1; if (t < t0 + H1(seed + i * 3.3) * .1) continue;
      const a = H1(seed + i * 7.7) * TAU, d = Math.pow(k, 1.6) * (500 + 600 * H1(seed + i * 2.1)), s = .15 + 1.3 * k * k, px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * .9 + k * 120;
      c.save(); c.translate(px, py); c.rotate(H1(seed + i) * 6 + k * (H1(i * 5) - .5) * 8); c.scale(s, s * (.4 + .6 * Math.abs(Math.cos(k * 5 + i)))); c.globalAlpha = Math.min(1, k * 6) * (1 - Math.pow(k, 4));
      c.fillStyle = '#f2ece0'; c.fillRect(-60, -80, 120, 160); c.fillStyle = 'rgba(40,36,30,.5)'; for (let r = 0; r < 7; r++) c.fillRect(-46, -60 + r * 18, 92 - (r === 6 ? 40 : 0), 5); c.restore();
    }
  }
  function s20(c, t, u) {
    const q = Q, spin = eio(at(t, q.zast - .1, q.raskr)) * 5.2, open = eio(at(t, q.raskr - .05, q.raskr + .7));
    bg(c, t, { top: '#07090e', bot: '#020203', glows: [[540, 820, 600, 600, '#9fc8ff', .2], [540, 820, 700, 700, '#fff0d0', .5 * open]] });
    c.save(); cam(c, u, { s0: 1, s1: lp(1.06, 1.25, open), d: 2.3, fx: 540, fy: 820 });
    c.save(); c.translate(540, 820); vault(c, 380, t, spin, open); c.restore();
    if (open > .3) { beam(c, 540, 820, Math.PI, 1.2, 1100, '#fff1d6', .5 * open); papers(c, t, 540, 820, q.tainy - .3, 20, 7) }
    c.restore();
    motes(c, t, 191, 40, '#ffe9c4', .5 + .5 * open);
  }
  // 21. «и четырнадцать миллионов секретных документов» — счётчик крутится, бумаги летят
  function s21(c, t, u) {
    const q = Q;
    bg(c, t, { top: '#0d0a06', bot: '#020101', glows: [[540, 760, 800, 800, '#fff0d0', .3], [540, 820, 500, 300, C.orange, .35]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.05, d: 2.4, fx: 540, fy: 820 });
    c.save(); c.filter = 'blur(3px)'; papers(c, t, 540, 760, q.chet - 1.2, 34, 19); c.restore();
    c.restore();
    roll(c, '14 000 000', 540, 860, at(t, q.chet - .1, q.mln + .7), t, { s: 170, sub: 'СЕКРЕТНЫХ ДОКУМЕНТОВ' });
    c.save(); papers(c, t, 540, 760, q.chet - .8, 6, 31); c.restore();
    motes(c, t, 201, 40, '#ffe9c4', .7);
  }
  // 22–23. Калифорния → залив: точки суши, булавки, дуга маршрута, «по соседству»
  function mapDots(name, step) {
    const M = window.V15MAP[name];
    return cache('map' + name, M.nx * step, M.ny * step, (x) => {
      for (let j = 0; j < M.ny; j++) { const row = M.rows[j]; for (let i = 0; i < M.nx; i++) if (row[i] === '1') {
        const h = H2(i + 3, j + 5), r = step * (.2 + .1 * h);
        x.fillStyle = `rgba(${60 + 70 * h | 0},${130 + 80 * h | 0},${190 + 60 * h | 0},${.5 + .4 * h})`;
        x.beginPath(); x.arc((i + .5) * step, (j + .5) * step, r, 0, TAU); x.fill();
      } }
    });
  }
  function pinMark(c, x, y, col, k, t) {
    if (k <= 0) return; const e = eb(k), pu = (t * 1.1) % 1;
    c.save(); c.strokeStyle = col; c.globalAlpha = cl(k * 3) * (1 - pu); c.lineWidth = 3; c.beginPath(); c.arc(x, y, 14 + pu * 70, 0, TAU); c.stroke(); c.restore();
    c.save(); c.translate(x, y - (1 - e) * 60); shadowE(c, 0, 6, 26, 9, .6);
    c.fillStyle = rg(c, -6, -48, 2, 30, [[0, '#ffffff'], [.3, col], [1, mixh(col, '#000000', .5)]]); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-26, -34, -28, -66, 0, -68); c.bezierCurveTo(28, -66, 26, -34, 0, 0); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(0, -46, 9, 0, TAU); c.fill(); c.restore(); glowDot(c, x, y, 60, col, .6 * cl(k));
  }
  function mapShot(c, t, u, o) {
    const M = window.V15MAP, ST = 7, ratio = M.CA.deg / M.BAY.deg, z = cl(o.z(t)), ze = eio(z);
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, '#030913'], [1, '#01040a']]); c.fillRect(0, 0, WW, HH);
    const ca = mapDots('CA', ST), bay = mapDots('BAY', ST);
    const bu = M.BAY.at.ucsf.map(v => (v + .5) * ST), bs = M.BAY.at.stanford.map(v => (v + .5) * ST), cu = M.CA.at.ucsf.map(v => (v + .5) * ST);
    const caX = bu[0] - cu[0] * ratio, caY = bu[1] - cu[1] * ratio, sc0 = 1500 / (ca.height * ratio), sc1 = 1.42, sc = Math.exp(lp(Math.log(sc0), Math.log(sc1), ze)) * (1 + .03 * u / 4);
    const f0 = [caX + ca.width * ratio * .5, caY + ca.height * ratio * .5], f1 = [(bu[0] + bs[0]) / 2 + 20, (bu[1] + bs[1]) / 2], fk = Math.pow(ze, .55);
    const fx = lp(f0[0], f1[0], fk), fy = lp(f0[1], f1[1], fk), S2 = (x, y) => [WW / 2 + (x - fx) * sc, 900 + (y - fy) * sc];
    grid(c, 90, .06, '#7fb8ff');
    c.save(); c.translate(WW / 2, 900); c.scale(sc, sc); c.translate(-fx, -fy);
    let a = 1 - ss(.3, .62, z); if (a > 0) { c.globalAlpha = a; c.drawImage(ca, caX, caY, ca.width * ratio, ca.height * ratio) }
    a = ss(.25, .58, z); if (a > 0) { c.globalAlpha = a; c.drawImage(bay, 0, 0) }
    c.restore(); c.globalAlpha = 1;
    if (z < .5) { const [lx, ly] = S2(caX + ca.width * ratio * .62, caY + ca.height * ratio * .46); tx(c, 'КАЛИФОРНИЯ', lx, ly, { f: 'J', w: 700, s: 44, ls: 16, c: 'rgba(205,228,255,.8)', a: cl((t - o.cal) / .4) * (1 - ss(.15, .45, z)) }) }
    const [ux, uy] = S2(...bu), [sx, sy] = S2(...bs);
    pinMark(c, ux, uy, '#ff4a3a', (t - o.n1) / .35, t);
    const ak = o.arc ? eio(cl((t - o.arc) / 1.1)) : 0, mx = (ux + sx) / 2 + 220, my = (uy + sy) / 2 - 80;
    if (ak > 0) {
      c.save(); c.strokeStyle = C.orange; c.lineWidth = 6; c.shadowColor = C.orange; c.shadowBlur = 22; c.setLineDash([18, 12]); c.lineDashOffset = -t * 40; c.beginPath(); c.moveTo(ux, uy);
      for (let i = 1; i <= 40; i++) { const k = i / 40 * ak, x = (1 - k) * (1 - k) * ux + 2 * k * (1 - k) * mx + k * k * sx, y = (1 - k) * (1 - k) * uy + 2 * k * (1 - k) * my + k * k * sy; c.lineTo(x, y) } c.stroke(); c.restore();
      pinMark(c, sx, sy, '#ffc24a', (t - o.arc - .9) / .35, t);
    }
    if (o.lab) {
      tag(c, ux, uy - 40, ux - 40, uy - 300, 'САН-ФРАНЦИСКО', 'АРХИВ ДОКУМЕНТОВ', (t - o.n1 - .2) / .5, '#ff4a3a', 'left');
      if (ak > 0) tag(c, sx, sy - 40, sx + 60, sy + 120, 'ПАЛО-АЛЬТО', 'СТЭНФОРД', (t - o.arc - 1) / .5, '#ffc24a', 'right');
      plate(c, mx + 40, my - 10, 'ПО СОСЕДСТВУ', null, (t - o.near) / .45, { s: 64, line: false, box: true });
    }
  }
  function s22(c, t, u) { const q = Q; mapShot(c, t, u, { z: () => 0, n1: q.opubl + .1, cal: q.kalif - .1 }); motes(c, t, 211, 30, '#9fdcff', .4) }
  function s23(c, t, u) { const q = Q; mapShot(c, t, u, { z: t => .03 + .97 * eio(cl((t - q.s9) / 1.5)), n1: q.s9 + .4, arc: q.pryamo9 - .2, near: q.sosed - .05, cal: -9, lab: 1 }); motes(c, t, 221, 30, '#9fdcff', .4) }
  // 24. «где эти бумаги вскоре находят два студента» — двое со спины у ноутбука, на экране поиск, «НАЙДЕНО»
  function student(c, s, rim, o = {}) {   // силуэт со спины: капюшон, плечи; контровой свет с двух сторон
    c.save(); c.scale(s, s);
    const body = new Path2D('M-150 260C-160 120 -120 40 -60 20C-40 12 -30 -10 -30 -30L30 -30C30 -10 40 12 60 20C120 40 160 120 150 260Z');
    const hood = new Path2D('M-78 -20C-92 -110 -52 -168 0 -170C52 -168 92 -110 78 -20C60 10 -60 10 -78 -20Z');
    c.fillStyle = lg(c, 0, -170, 0, 260, [[0, '#14161c'], [1, '#07080b']]); c.fill(body); c.fill(hood);
    c.save(); c.globalCompositeOperation = 'screen'; c.lineWidth = 2.6; c.strokeStyle = rgba(rim, .85); c.shadowColor = rim; c.shadowBlur = 14; c.stroke(hood);
    c.beginPath(); c.moveTo(-150, 250); c.bezierCurveTo(-158, 120, -120, 40, -60, 20); c.moveTo(150, 250); c.bezierCurveTo(158, 120, 120, 40, 60, 20); c.stroke(); c.restore();
    if (o.side) { c.save(); c.globalCompositeOperation = 'screen'; c.strokeStyle = rgba(o.side, .95); c.lineWidth = 3; c.shadowColor = o.side; c.shadowBlur = 14; c.beginPath(); c.moveTo(o.sx * 150, 250); c.bezierCurveTo(o.sx * 158, 120, o.sx * 120, 40, o.sx * 60, 20); c.stroke(); c.restore() }
    c.restore();
  }
  function screenSearch(x, W, H, t, t0, tf) {
    x.fillStyle = '#0d1117'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#1b2230'; x.fillRect(0, 0, W, 56); for (let i = 0; i < 3; i++) { x.fillStyle = ['#ff5f56', '#ffbd2e', '#27c93f'][i]; x.beginPath(); x.arc(30 + i * 26, 28, 8, 0, TAU); x.fill() }
    tx(x, 'TOBACCO DOCUMENTS LIBRARY · UCSF', W / 2, 38, { f: 'J', w: 500, s: 20, ls: 2, c: 'rgba(200,212,232,.7)' });
    rr(x, 40, 90, W - 80, 70, 35); x.fillStyle = '#e8edf5'; x.fill();
    const q = 'nicotine salt', k = cl((t - t0) / 1.2), s = q.slice(0, Math.round(k * q.length)); tx(x, s + ((t * 2) % 1 < .5 && k < 1 ? '|' : ''), 76, 136, { f: 'J', w: 500, s: 28, al: 'left', c: '#1b2230' });
    const R = ['R.J. REYNOLDS · RESEARCH MEMO', 'NICOTINE SALTS · 1979 · CONFIDENTIAL', 'YOUTH MARKET · 1973', 'PH OF SMOKE · STUDY'];
    R.forEach((r, i) => { const y = 210 + i * 92, a = cl((t - t0 - 1.2 - i * .12) / .25); if (a <= 0) return; const hl = i === 1 && t > tf;
      x.globalAlpha = a; rr(x, 40, y, W - 80, 76, 10); x.fillStyle = hl ? 'rgba(255,159,28,.22)' : 'rgba(255,255,255,.05)'; x.fill(); if (hl) { x.strokeStyle = C.orange; x.lineWidth = 3; x.stroke() }
      tx(x, r, 66, y + 36, { f: 'J', w: 700, s: 22, al: 'left', c: hl ? '#ffd9a0' : '#cfd6e2' }); x.fillStyle = 'rgba(200,210,230,.25)'; x.fillRect(66, y + 50, (W - 160) * (.5 + .3 * H1(i)), 8); x.globalAlpha = 1 });
    if (t > tf) { x.save(); x.translate(W - 170, 300); x.rotate(-.12); const im = stampImg('НАЙДЕНО', C.orange, 46); const k2 = cl((t - tf) / .16); x.scale(lp(2, 1, k2), lp(2, 1, k2)); x.globalAlpha = cl(k2 * 3); x.drawImage(im, -im.width / 2, -im.height / 2); x.restore() }
  }
  let SCR = null;
  function s24(c, t, u) {
    const q = Q, rimK = cl((t - q.dva + .1) / .4);
    bg(c, t, { top: '#05070d', bot: '#020204', glows: [[540, 760, 560, 460, '#7fb8ff', .35], [540, 1500, 700, 400, C.orange, .2 + .2 * rimK]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.08, d: 2.7, fx: 540, fy: 900 });
    // окно общежития и кампус за ним, размыто
    c.save(); c.filter = 'blur(5px)'; rr(c, 150, 200, 780, 520, 10); c.fillStyle = lg(c, 0, 200, 0, 720, [[0, '#0a1530'], [1, '#1b2a4a']]); c.fill(); c.fillStyle = '#d9e4ff'; c.beginPath(); c.arc(760, 330, 46, 0, TAU); c.fill();
    for (let i = 0; i < 9; i++) { c.fillStyle = '#05070d'; c.fillRect(150 + i * 90, 560 - 60 * H1(i), 80, 160 + 60 * H1(i)) } c.fillStyle = '#05070d'; c.fillRect(530, 200, 20, 520); c.fillRect(150, 450, 780, 16); c.restore();
    // ноутбук
    if (!SCR) SCR = mk(760, 600); const sx2 = SCR.getContext('2d'); sx2.clearRect(0, 0, 760, 600); screenSearch(sx2, 760, 600, t, q.gde - .1, q.nahod + .1); const scr = SCR;
    c.save(); c.translate(540, 1000); c.fillStyle = '#0b0d12'; rr(c, -340, -300, 680, 470, 18); c.fill(); c.drawImage(scr, -320, -282, 640, 420); glow(c, 0, -60, 520, 380, '#9fc8ff', .35); c.restore();
    c.fillStyle = lg(c, 0, 1180, 0, 1260, [[0, '#2a2f38'], [1, '#0b0d12']]); c.beginPath(); c.moveTo(150, 1180); c.lineTo(930, 1180); c.lineTo(990, 1250); c.lineTo(90, 1250); c.closePath(); c.fill();
    // двое со спины
    c.save(); c.translate(250, 1330); student(c, 1.25, '#bcd8ff', { side: C.orange, sx: -1 }); c.restore();
    c.save(); c.translate(840, 1350); student(c, 1.32, '#bcd8ff', { side: C.orange, sx: 1 }); c.restore();
    if (rimK > 0) { glow(c, 250, 1250, 260, 300, C.orange, .25 * rimK); glow(c, 840, 1270, 260, 300, C.orange, .25 * rimK) }
    c.restore();
    motes(c, t, 231, 26, '#bcd8ff', .5);
  }

  // ================= планы 1:03–1:46 =================
  // стик-«флешка»: середина низа (0, 0), длина L вверх, ширина w; o.pod — свечение картриджа, o.metal — сплошной металл, иначе контур
  function stick(c, L, w, t, o = {}) {
    const top = -L, podH = L * .3, R = w * .28;
    c.save();
    if (o.metal) {
      rr(c, -w / 2, top + podH, w, L - podH, [4, 4, R, R]); c.fillStyle = lg(c, -w / 2, 0, w / 2, 0, [[0, '#2b3038'], [.12, '#8a929e'], [.26, '#e6eaf0'], [.4, '#9aa2ad'], [.75, '#4a5058'], [1, '#2a2f36']]); c.fill();
      c.save(); c.clip(); c.globalAlpha = .1; c.drawImage(noiseTex('brsh', 256, 256, 2, 2), -w / 2, top, w, L); c.restore();
      rr(c, -w / 2, top, w, podH + 8, [R, R, 4, 4]); c.fillStyle = lg(c, -w / 2, 0, w / 2, 0, [[0, '#0b0c0f'], [.25, '#3a3f48'], [.5, '#15171c'], [1, '#2a3444']]); c.fill();
      const pg = o.pod || 0; rr(c, -w * .3, top + podH * .3, w * .6, podH * .55, 6); c.fillStyle = `rgba(255,${150 + 60 * pg | 0},50,${.25 + .6 * pg})`; c.fill();
      if (pg > 0) { glowDot(c, 0, top + podH * .55, w * 1.8, C.amber, .7 * pg); if (o.crys) { c.save(); c.translate(0, top + podH * .57); crystal(c, podH * .42, t, pg) ; c.restore() } }
      const led = o.led ?? .4; rr(c, -w * .08, -L * .2, w * .16, w * .16, w * .08); c.fillStyle = rgba(o.ledCol || '#7fe0ff', .3 + .7 * led); c.fill(); glowDot(c, 0, -L * .2 + w * .08, w * .9, o.ledCol || '#7fe0ff', .6 * led);
    } else {
      const k = o.draw ?? 1, per = 2 * (L + w) * 1.2; c.strokeStyle = C.ice; c.lineWidth = 3; c.shadowColor = C.cyan; c.shadowBlur = 14; c.setLineDash([per * k, per]);
      rr(c, -w / 2, top, w, L, R); c.stroke(); c.beginPath(); c.moveTo(-w / 2, top + podH); c.lineTo(w / 2, top + podH); c.stroke();
      rr(c, -w * .3, top + podH * .3, w * .6, podH * .55, 6); c.stroke(); c.setLineDash([]); c.shadowBlur = 0;
    }
    c.restore();
  }
  function usbOutline(c, L, w, k) {
    const per = 2 * (L + w) * 1.4; c.save(); c.strokeStyle = 'rgba(255,200,120,.95)'; c.lineWidth = 3; c.shadowColor = C.amber; c.shadowBlur = 14; c.setLineDash([per * k, per]);
    rr(c, -w / 2, -L * .82, w, L * .82, w * .2); c.stroke(); rr(c, -w * .36, -L, w * .72, L * .2, 4); c.stroke(); c.beginPath(); c.moveTo(-w * .2, -L * .96); c.lineTo(-w * .2, -L * .9); c.moveTo(w * .2, -L * .96); c.lineTo(w * .2, -L * .9); c.stroke(); c.restore();
  }
  function dimLine(c, x0, y0, x1, y1, s, k, side = 1) {
    if (k <= 0) return; c.save(); c.globalAlpha = cl(k * 2); c.strokeStyle = 'rgba(160,215,255,.8)'; c.lineWidth = 2;
    const xe = lp(x0, x1, eo(k)), ye = lp(y0, y1, eo(k)); c.beginPath(); c.moveTo(x0, y0); c.lineTo(xe, ye); c.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0); for (const [x, y, d] of [[x0, y0, 1], [xe, ye, -1]]) { c.beginPath(); c.moveTo(x + Math.cos(a + .5 * d) * 16 * d, y + Math.sin(a + .5 * d) * 16 * d); c.lineTo(x, y); c.lineTo(x + Math.cos(a - .5 * d) * 16 * d, y + Math.sin(a - .5 * d) * 16 * d); c.stroke() }
    c.translate((x0 + x1) / 2, (y0 + y1) / 2); c.rotate(a); tx(c, s, 0, -14 * side, { f: 'J', w: 700, s: 24, ls: 3, c: 'rgba(200,232,255,.95)', a: cl((k - .4) * 2) }); c.restore();
  }
  // 25. «Позже они создают электронную сигарету, похожую на флешку» — чертёж: линии прорисовываются, рядом контур флешки
  function s25(c, t, u) {
    const q = Q, d1 = at(t, q.s10 - .1, q.sozd10 + 1.1), uk = at(t, q.pohozh - .1, q.flesh + .3);
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, '#07182f'], [1, '#030b18']]); c.fillRect(0, 0, WW, HH); grid(c, 40, .06, '#7fc8ff'); grid(c, 200, .12, '#7fc8ff');
    glow(c, 540, 900, 600, 700, '#2a7cff', .3);
    c.save(); cam(c, u, { s0: 1, s1: 1.06, d: 3.2, fx: 540, fy: 900 });
    c.save(); c.translate(lp(540, 680, eio(uk)), 1360); stick(c, 940, 170, t, { draw: d1 }); c.restore();
    dimLine(c, lp(540, 680, eio(uk)) + 150, 1360, lp(540, 680, eio(uk)) + 150, 420, 'ДЛИНА', at(t, q.sozd10 + .5, q.sozd10 + 1.2), -1);
    if (uk > 0) { c.save(); c.translate(330, 1360); usbOutline(c, 860, 170, uk); c.restore(); tx(c, '≈', 505, 900, { f: 'O', w: 700, s: 140, c: C.orange, a: cl((uk - .5) * 3), glow: C.orange, gb: 20 }) }
    c.restore();
    tag(c, 680, 520, 860, 300, 'ПРОЕКТ', 'JUUL · 2015', (t - q.elek10 + .1) / .6, C.cyan, 'right');
    tag(c, 330, 600, 120, 330, 'ФОРМА', 'КАК ФЛЕШКА', (t - q.flesh - .1) / .6, C.amber, 'left');
    motes(c, t, 241, 26, '#9fdcff', .5);
  }
  // 26. «внутри которой оживает та самая соль» — металлический стик, картридж загорается, внутри кристалл
  function s26(c, t, u) {
    const q = Q, pg = cl((t - q.ozhiv + .1) / .5) * (.85 + .15 * Math.sin(t * 5));
    bg(c, t, { top: '#07090f', bot: '#020204', glows: [[540, 700, 520, 620, C.amber, .2 + .4 * pg], [540, 1000, 600, 600, '#5a8cff', .18]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.12, d: 2.6, fx: 540, fy: 720 });
    beam(c, 540, -150, 0, .4, 1500, '#e8f0ff', .3);
    c.save(); c.translate(540, 1330); c.rotate(.04); shadowE(c, 0, 4, 140, 22, .7); stick(c, 920, 170, t, { metal: 1, pod: pg, crys: 1, led: .5 + .5 * Math.sin(t * 3) }); c.restore();
    c.restore();
    tag(c, 560, 600, 700, 340, 'ВНУТРИ', 'ТА САМАЯ СОЛЬ · 1979', (t - q.sol10 + .2) / .6, C.amber, 'left');
    motes(c, t, 251, 40, '#ffd27a', .7);
  }
  // 27. «Один картридж заменял целую пачку сигарет» — картридж = 20 сигарет
  function pod(c, s, t, g = .6) {
    c.save(); c.scale(s, s);
    rr(c, -60, -220, 120, 60, [26, 26, 4, 4]); c.fillStyle = lg(c, -60, 0, 60, 0, [[0, '#0b0c0f'], [.3, '#3a3f48'], [1, '#14161b']]); c.fill();
    rr(c, -70, -165, 140, 230, 12); c.fillStyle = `rgba(255,${160 + 50 * g | 0},60,${.35 + .4 * g})`; c.fill(); c.strokeStyle = 'rgba(255,220,170,.8)'; c.lineWidth = 3; c.stroke();
    c.save(); rr(c, -70, -165, 140, 230, 12); c.clip(); c.fillStyle = lg(c, 0, -120, 0, 65, [[0, 'rgba(255,190,80,.7)'], [1, 'rgba(255,120,30,.8)']]); c.fillRect(-70, -120 + Math.sin(t * 2) * 4, 140, 200);
    c.globalCompositeOperation = 'screen'; c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-56, -160, 14, 220); c.restore();
    rr(c, -70, 60, 140, 40, [4, 4, 12, 12]); c.fillStyle = '#1b1e24'; c.fill(); c.fillStyle = '#c9a24a'; c.fillRect(-30, 98, 14, 8); c.fillRect(16, 98, 14, 8);
    glowDot(c, 0, -40, 200, C.amber, .4 * g);
    c.restore();
  }
  function s27(c, t, u) {
    const q = Q, n = Math.min(20, Math.max(0, Math.floor((t - q.zamen + .1) / ((q.pachku + .25 - q.zamen) / 20)) + 1)), eqk = pop(t, q.zamen - .05, .4);
    bg(c, t, { top: '#0c0907', bot: '#020101', glows: [[300, 900, 360, 460, C.amber, .4], [760, 900, 420, 520, '#ffffff', .12]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.05, d: 2.7, fx: 540, fy: 920 });
    c.save(); c.translate(260, 1020); const pk0 = pop(t, q.s11 - .12, .4); c.scale(pk0, pk0); pod(c, 1.35, t); c.restore();
    if (eqk > 0) tx(c, '=', 470, 990, { f: 'O', w: 700, s: 180 * cl(eqk), c: C.orange, glow: C.orange, gb: 24 });
    for (let i = 0; i < 20; i++) { const k = cl((t - (q.zamen + i * (q.pachku + .25 - q.zamen) / 20)) / .25); if (k <= 0) continue; const col = i % 5, row = Math.floor(i / 5), x = 640 + col * 78, y = 640 + row * 170;
      c.save(); c.translate(x, y + (1 - eo(k)) * -80); c.rotate(Math.PI / 2); c.globalAlpha = cl(k * 2); cigarette(c, 150, 26, { t: t + i, burn: 0 }); c.restore() }
    c.restore();
    const pk = (t - q.pachku - .1) / .4, ca = cl((t - q.zamen) / .3) * (1 - cl((t - q.pachku + .12) / .2));
    if (ca > 0) { tx(c, String(n), 800, 500, { f: 'O', w: 700, s: 120, c: '#ffffff', glow: C.orange, gb: 20, a: ca }); tx(c, 'СИГАРЕТ', 800, 548, { f: 'J', w: 500, s: 22, ls: 6, c: 'rgba(205,214,230,.8)', a: ca }) }
    plate(c, 540, 470, '1 КАРТРИДЖ = 20 СИГАРЕТ', null, pk, { s: 76, line: false });
    motes(c, t, 261, 30, '#ffd9b0', .6);
  }
  // 28. «а раз мягкий пар больше не обжигал горло» — та же голова, пар мягкий, горло зелёное
  function s28(c, t, u) {
    const q = Q;
    bg(c, t, { top: '#020a10', bot: '#010306', glows: [[540, 820, 560, 700, '#1d8f6a', .3]] });
    grid(c, 60, .04, '#8fffd0');
    c.save(); cam(c, u, { s0: 1, s1: 1.1, d: 2.4, fx: 600, fy: 1040 });
    c.save(); c.translate(470, 800); c.scale(2.1, 2.1); head(c, t, 0, true); c.restore();
    c.restore();
    tag(c, 640, 1180, 720, 700, 'ГОРЛО', 'НЕ ОБЖИГАЕТ  ✓', (t - q.obzh + .05) / .55, C.green, 'left');
    motes(c, t, 271, 26, '#bfffe0', .5);
  }
  // 29. «школьники тянули его без остановки» — стик крупно, индикатор мигает, счётчик затяжек летит
  function s29(c, t, u) {
    const q = Q, n = Math.max(0, Math.floor((t - q.shkol) * 36)), blink = (t * 6) % 1 < .5 ? 1 : .2;
    bg(c, t, { top: '#0a0b10', bot: '#020203', glows: [[420, 900, 420, 620, '#7fd0ff', .25], [760, 600, 360, 360, C.red, .25]] });
    c.save(); cam(c, u, { s0: 1.05, s1: 1.14, d: 2.2, fx: 420, fy: 900 });
    c.save(); c.translate(400, 1500); c.rotate(-.18); stick(c, 1000, 180, t, { metal: 1, pod: .5, led: blink, ledCol: '#7fe0ff' }); c.restore();
    for (let i = 0; i < 4; i++) smoke(c, t + i * .9, 330, 520, { n: 8, life: 1.6, rise: 260, sway: 60, drift: 140, r0: 20, r1: 160, a: .22, seed: 70 + i * 7 });
    c.restore();
    c.save(); c.translate(760, 620); rr(c, -220, -120, 440, 250, 18); c.fillStyle = 'rgba(8,10,16,.85)'; c.fill(); c.strokeStyle = 'rgba(255,90,80,.6)'; c.lineWidth = 2; c.stroke();
    tx(c, 'ЗАТЯЖКИ', -190, -70, { f: 'J', w: 500, s: 22, ls: 5, al: 'left', c: 'rgba(220,226,236,.8)' });
    tx(c, String(n), 190, 60, { f: 'O', w: 700, s: 130, al: 'right', c: '#ffffff', glow: C.red, gb: 26 });
    c.fillStyle = C.red; c.globalAlpha = blink; c.beginPath(); c.arc(-180, -110 + 40, 8, 0, TAU); c.fill(); c.restore();
    motes(c, t, 281, 26, '#9fdcff', .5);
  }
  // 30. «и подсаживались в разы быстрее» — две кривые зависимости: сигареты и соль
  function s30(c, t, u) {
    const q = Q, k1 = eio(at(t, q.podsazh - .3, q.bystr + .5)), k2 = eio(at(t, q.podsazh - .2, q.razy + .2));
    bg(c, t, { top: '#0a0b10', bot: '#020203', glows: [[540, 760, 560, 500, C.red, .22 * k2]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.05, d: 2.2, fx: 540, fy: 820 });
    const X0 = 140, X1 = 960, Y0 = 1180, Y1 = 380;
    c.strokeStyle = 'rgba(220,226,236,.5)'; c.lineWidth = 3; c.beginPath(); c.moveTo(X0, Y1 - 40); c.lineTo(X0, Y0); c.lineTo(X1 + 30, Y0); c.stroke();
    tx(c, 'ЗАВИСИМОСТЬ', X0 + 14, Y1 - 50, { f: 'J', w: 700, s: 24, ls: 4, al: 'left', c: 'rgba(220,226,236,.85)' }); tx(c, 'ВРЕМЯ', X1 + 20, Y0 + 50, { f: 'J', w: 700, s: 24, ls: 4, al: 'right', c: 'rgba(220,226,236,.85)' });
    for (let i = 1; i < 5; i++) { c.strokeStyle = 'rgba(220,226,236,.08)'; c.lineWidth = 1; c.beginPath(); c.moveTo(X0, lp(Y0, Y1, i / 5)); c.lineTo(X1, lp(Y0, Y1, i / 5)); c.stroke() }
    const curve = (f, k, col, w, lab) => { c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.shadowColor = col; c.shadowBlur = 18; c.beginPath(); const N = 60; let lx = 0, ly = 0;
      for (let i = 0; i <= N * k; i++) { const x = i / N, y = f(x); lx = lp(X0, X1, x); ly = lp(Y0, Y1, y); i ? c.lineTo(lx, ly) : c.moveTo(lx, ly) } c.stroke(); c.restore(); if (k > .05) { glowDot(c, lx, ly, 40, col, .8); tx(c, lab, lx - 20, ly - 26, { f: 'O', w: 700, s: 40, al: 'right', c: col, a: cl(k * 3) }) } };
    curve(x => .55 * Math.pow(x, 1.6), k1, 'rgba(220,226,236,.9)', 6, 'СИГАРЕТЫ');
    curve(x => Math.min(1, 1.1 * (1 - Math.exp(-x * 4.2))), k2, C.red, 9, 'НИКОТИНОВАЯ СОЛЬ');
    c.restore();
    motes(c, t, 291, 22, '#ffd9b0', .45);
  }
  // 31. «…в США парил каждый четвёртый старшеклассник» — сетка силуэтов, каждый четвёртый краснеет и парит; «27,5 %»
  function bust(c, s, col, rim, a = 1) {
    c.save(); c.scale(s, s); c.globalAlpha *= a;
    c.fillStyle = col; c.beginPath(); c.arc(0, -62, 30, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-58, 40); c.quadraticCurveTo(-60, -20, -22, -26); c.lineTo(22, -26); c.quadraticCurveTo(60, -20, 58, 40); c.closePath(); c.fill();
    c.globalCompositeOperation = 'screen'; c.strokeStyle = rim; c.lineWidth = 3; c.shadowColor = rim; c.shadowBlur = 10; c.beginPath(); c.arc(0, -62, 30, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); c.beginPath(); c.moveTo(-58, 38); c.quadraticCurveTo(-60, -20, -22, -26); c.moveTo(58, 38); c.quadraticCurveTo(60, -20, 22, -26); c.stroke();
    c.restore();
  }
  function s31(c, t, u) {
    const q = Q, lit = cl((t - q.kazhd + .05) / .35), pct = (t - q.starsh + .1) / .5;
    bg(c, t, { top: '#0a0b10', bot: '#020203', glows: [[540, 900, 620, 620, C.red, .25 * lit], [540, 900, 600, 600, '#5a7aff', .15]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.06, d: 4, fx: 540, fy: 900 });
    for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) {
      const i = r * 4 + k, hot = k === (r * 3 + 1) % 4, x = 200 + k * 227, y = 600 + r * 180, ap = cl((t - q.s12 + .2 - i * .025) / .25);
      if (ap <= 0) continue;
      c.save(); c.translate(x, y); bust(c, 1.15, hot && lit > 0 ? mixh('#1a1d24', '#5a0e10', lit) : '#1a1d24', hot && lit > 0 ? rgba('#ff5a50', .5 + .5 * lit) : 'rgba(255,170,90,.7)', ap); c.restore();
      if (hot && lit > 0) { glowDot(c, x + 40, y - 40, 60, C.red, .9 * lit); smoke(c, t, x + 40, y - 40, { n: 8, life: 2.4, rise: 200, sway: 30, drift: 80, r0: 10, r1: 90, a: .3 * lit, seed: i * 11 }) }
    }
    c.restore();
    plate(c, 540, 1470, '27,5 %', 'СТАРШЕКЛАССНИКОВ США · 2019', pct, { s: 150, glow: C.red, lc: C.red });
    motes(c, t, 301, 26, '#ffd9b0', .45);
  }
  // 32. «а треть новой компании за тринадцать миллиардов долларов» — кольцо, сектор 35 % выезжает, счётчик $12,8 млрд
  function s32(c, t, u) {
    const q = Q, sk = eb(at(t, q.tret - .05, q.tret + .5)), r = 300, cx = 540, cy = 760, a0 = -Math.PI / 2, a1 = a0 + TAU * .35;
    bg(c, t, { top: '#0b0a0d', bot: '#020203', glows: [[540, 760, 560, 560, C.red, .2 + .2 * cl(sk)], [540, 1300, 500, 300, C.amber, .2]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.06, d: 2.9, fx: 540, fy: 800 });
    shadowE(c, cx, cy + r + 40, r * 1.1, 40, .6);
    c.lineWidth = 120; c.strokeStyle = lg(c, cx - r, cy - r, cx + r, cy + r, [[0, '#3a4a66'], [1, '#1b2232']]); c.beginPath(); c.arc(cx, cy, r, a1 + .02, a0 + TAU - .02); c.stroke();
    tx(c, 'JUUL', cx, cy + 22, { f: 'O', w: 700, s: 90, ls: 6, c: 'rgba(220,230,245,.85)' });
    const mid = (a0 + a1) / 2, off = 50 * cl(sk);
    c.save(); c.translate(Math.cos(mid) * off, Math.sin(mid) * off); c.lineWidth = 128 * (.9 + .1 * cl(sk)); c.strokeStyle = lg(c, cx, cy - r, cx + r, cy, [[0, '#ff5a50'], [1, '#c3141c']]); c.shadowColor = C.red; c.shadowBlur = 30; c.beginPath(); c.arc(cx, cy, r, a0 + .02, a1 - .02); c.stroke(); c.restore();
    if (sk > 0) tx(c, '35 %', cx + Math.cos(mid) * (r + 60) + 10, cy + Math.sin(mid) * (r + 60) - 70, { f: 'O', w: 700, s: 96, c: '#ffffff', glow: C.red, gb: 24, a: cl(sk * 2) });
    c.restore();
    roll(c, '$12,8 МЛРД', 540, 1300, at(t, q.trin - .1, q.mlrd + .4), t, { s: 130, sub: 'СДЕЛКА · 20.12.2018' });
    motes(c, t, 311, 26, '#ffd9b0', .5);
  }
  // 33. «выкупил производитель «Мальборо»» — пачка падает в луч
  function s33(c, t, u) {
    const q = Q, fl = 1150, l = .6 + .4 * cl((t - q.marl + .1) / .3), dk = (t - q.marl + .08) / .45, d = dk <= 0 ? null : -(1 - eb(dk)) * 900;
    bg(c, t, { top: '#120707', bot: '#030101', glows: [[540, 900, 420, 520, '#ff4a3a', .35 * l]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.05, d: 1.9, fx: 540, fy: 900 });
    c.fillStyle = lg(c, 0, fl - 4, 0, HH, [[0, 'rgba(70,30,30,.7)'], [.05, 'rgba(18,8,8,.95)'], [1, '#030101']]); c.fillRect(-100, fl, WW + 200, HH);
    beam(c, 540, -100, 0, .36, 1400, '#ffe2d0', .55 * l); glow(c, 540, fl, 300, 44, '#ff6a4a', .5 * l);
    const sil = 1 - cl((t - q.marl + .02) / .12);
    if (sil > 0) { c.save(); c.translate(540, fl); c.globalAlpha = sil; shadowE(c, 0, 8, 320, 26, .8); rr(c, -190, -540, 380, 540, 6); c.fillStyle = lg(c, -190, 0, 190, 0, [[0, '#0a0606'], [.5, '#170d0c'], [1, '#070404']]); c.fill();
      c.strokeStyle = 'rgba(255,120,100,.55)'; c.lineWidth = 3; c.shadowColor = '#ff5a4a'; c.shadowBlur = 16; c.stroke(); c.shadowBlur = 0; tx(c, '?', 0, -200, { f: 'O', w: 700, s: 230, c: 'rgba(255,200,190,.55)', glow: '#ff5a4a', gb: 24 }); c.restore() }
    if (d != null) { c.save(); c.translate(540, fl + d); pack(c, packMarlboroArt, 'marl', 380, 540, { side: '#9a958c', top: '#eeeae2' }); c.restore() }
    c.restore();
    tag(c, 560, 640, 990, 300, 'ПОКУПАТЕЛЬ', 'ALTRIA', (t - q.marl - .2) / .5, C.red, 'right');
    motes(c, t, 321, 26, '#ffd0c0', .5);
  }
  // 34. «Старый план сработал идеально» — та же записка 1973, зелёный штамп «ПЛАН ВЫПОЛНЕН»
  function s34(c, t, u) {
    const q = Q, hl = { WE: 1, MUST: 1, GET: 1, OUR: 1, 'SHARE OF THE': 1, YOUTH: 1, 'MARKET.': 1 };
    deskBg(c, t);
    c.save(); cam(c, u, { s0: 1.02, s1: 1.1, d: 2.4, fx: 540, fy: 820 });
    memoSheet(c, t, { hl, mark: 1 });
    stamp(c, 'ПЛАН ВЫПОЛНЕН', 540, 980, -.12, t, q.ideal - .02, '#1f9d55', 76, { op: 'multiply', a: .95 });
    c.restore();
    beam(c, 120, -200, -.5, .55, 1700, '#ffd9a8', .3);
    motes(c, t, 331, 22, '#ffd9b0', .5);
  }
  // 35. «Признайтесь… вам ведь и сейчас захотелось… затянуться?» — та же одноразка в темноте, индикатор как пульс, на «затянуться» — облако пара на весь экран
  function s35(c, t, u) {
    const q = Q, fl = 1185, pulse = .5 + .5 * Math.sin((t - q.s14) * 3.2), puff = cl((t - q.zat) / 1.3);
    bg(c, t, { top: '#05070d', bot: '#010203', glows: [[540, 760, 520, 700, '#ff3b30', .12 + .2 * pulse], [800, 300, 600, 500, '#6f8cff', .15]] });
    c.save(); cam(c, u, { s0: 1, s1: 1.22, d: 4.6, fx: 540, fy: 820, ease: 'lin' });
    c.fillStyle = lg(c, 0, fl - 6, 0, HH, [[0, 'rgba(30,30,40,.65)'], [.08, 'rgba(10,10,14,.9)'], [1, '#020204']]); c.fillRect(-200, fl, WW + 400, HH);
    beam(c, 900, -200, -.25, .3, 1700, '#9fb8ff', .25);
    const dv = () => vapeBar(c, 860, { led: .3 + .9 * pulse + 2 * puff, ledCol: '#ff4a3a', rim: '#9fb8ff' });
    c.save(); c.translate(540, fl); reflect(c, 0, .1, dv); c.restore(); shadowE(c, 540, fl + 4, 190, 26, .9);
    c.save(); c.translate(540, fl); dv(); c.restore();
    c.restore();
    if (puff > 0) { const S = smokeSprites(); c.save(); c.globalCompositeOperation = 'screen'; for (let i = 0; i < 26; i++) { const a = H1(i * 4.3) * TAU, k = eo(puff), r = (100 + 700 * k) * (.4 + .6 * H1(i * 2.1)), rs = (200 + 700 * k) * (.6 + .4 * H1(i * 5.5)); c.globalAlpha = .35 * cl(puff * 3); c.drawImage(S[i % 4], 540 + Math.cos(a) * r - rs, 500 + Math.sin(a) * r * .8 - rs, rs * 2, rs * 2) } c.restore();
      c.fillStyle = `rgba(240,240,236,${ei(puff) * .95})`; c.fillRect(0, 0, WW, HH) }
    motes(c, t, 341, 20, '#ffffff', .4);
  }
  // 36. доска расследования: «1979 · СОЛЬ» открыта, остальные под чёрным маркером; нитки; «ТОЛЬКО НА YOUTUBE»; «?» и «!»
  const BCARD = [['1979', 'СОЛЬ', 540, 860, -.03, 0], ['2020', 'ЛАЗЕЙКА ОДНОРАЗОК', 265, 470, -.08, 1], ['1924', '«МАЛЬБОРО»', 815, 490, .07, 1], ['2014', 'НАГРЕВАТЕЛИ', 275, 1250, .06, 1], ['2022', 'ШАЙБЫ', 805, 1240, -.07, 1]];
  function corkBg(c) {
    c.drawImage(cache('cork', WW, HH, (x, W, H) => {
      x.fillStyle = '#8a5e36'; x.fillRect(0, 0, W, H); const n = noiseTex('cork', 256, 256, 2.2, 3); x.globalCompositeOperation = 'multiply'; x.globalAlpha = .55; for (let yy = 0; yy < H; yy += 256) for (let xx = 0; xx < W; xx += 256) x.drawImage(n, xx, yy);
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; for (let i = 0; i < 2400; i++) { x.fillStyle = `rgba(${40 + 60 * H1(i)},${25 + 30 * H1(i * 2)},10,${.25 + .3 * H1(i * 3)})`; x.fillRect(H1(i * 5.1) * W, H1(i * 7.3) * H, 2 + 3 * H1(i * 9), 2 + 2 * H1(i * 11)) }
      x.fillStyle = rg(x, W / 2, H * .45, 200, H * .8, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.75)']]); x.fillRect(0, 0, W, H);
    }), 0, 0);
  }
  function card(c, i, t, k) {
    const [yr, cap, x, y, rot, red] = BCARD[i]; if (k <= 0) return;
    const w = i ? 340 : 430, h = i ? 280 : 370, e = eb(k);
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(e, e);
    c.fillStyle = 'rgba(0,0,0,.5)'; c.filter = 'blur(14px)'; c.fillRect(-w / 2 + 12, -h / 2 + 18, w, h); c.filter = 'none';
    c.fillStyle = '#f3efe6'; c.fillRect(-w / 2, -h / 2, w, h);
    const ih = h - 96; c.fillStyle = '#16181d'; c.fillRect(-w / 2 + 16, -h / 2 + 16, w - 32, ih - 16);
    if (!red) { c.save(); c.beginPath(); c.rect(-w / 2 + 16, -h / 2 + 16, w - 32, ih - 16); c.clip(); glow(c, 0, -h / 2 + ih / 2, w * .6, ih * .6, C.amber, .7); c.translate(0, -h / 2 + 16 + (ih - 16) / 2); crystal(c, ih * .62, t, 1); c.restore() }
    else { c.fillStyle = '#050505'; for (let s = 0; s < 6; s++) { c.save(); c.translate(-w / 2 + 16, -h / 2 + 16 + s * (ih - 16) / 6); c.beginPath(); c.moveTo(0, -4); c.lineTo(w - 32, 2); c.lineTo(w - 32, (ih - 16) / 6 + 6); c.lineTo(0, (ih - 16) / 6 + 2); c.fill(); c.restore() } }
    tx(c, yr + ' · ' + cap, 0, h / 2 - 34, { f: 'O', w: 700, s: i ? 34 : 42, ls: 1, c: '#1b1b1b' });
    c.restore();
  }
  function pinAt(c, x, y) { shadowE(c, x + 6, y + 8, 14, 8, .6); c.fillStyle = rg(c, x - 4, y - 4, 1, 14, [[0, '#ff8a80'], [.5, '#d0242a'], [1, '#6a0c10']]); c.beginPath(); c.arc(x, y, 13, 0, TAU); c.fill() }
  function s36(c, t, u) {
    const q = Q, flash = 1 - cl((t - q.b0) / .5);
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    c.save(); cam(c, u, { s0: 1.12, s1: 1.0, d: 6, fx: 540, fy: 880, ease: 'lin' });
    corkBg(c);
    glow(c, 540, 700, 700, 600, '#ffd9a8', .35); beam(c, 540, -250, 0, .7, 1900, '#ffe6c4', .35);
    const ck = i => (t - (q.b0 + .2 + i * .35)) / .4;
    // нитки от центра к соседям
    const nk = at(t, q.odni - .2, q.lyud + .2);
    for (let i = 1; i < 5; i++) { const [, , x, y] = BCARD[i], [, , x0, y0] = BCARD[0], e = eo(cl(nk * 1.2 - (i - 1) * .1)); if (e <= 0) continue;
      const mx = (x0 + x) / 2, my = Math.max(y0, y) * .5 + (y0 + y) * .25 + 60; c.save(); c.strokeStyle = '#d0242a'; c.lineWidth = 5; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 8; c.shadowOffsetY = 6;
      c.beginPath(); c.moveTo(x0, y0 - 160); for (let s = 1; s <= 20 * e; s++) { const k = s / 20, px = (1 - k) * (1 - k) * x0 + 2 * k * (1 - k) * mx + k * k * x, py = (1 - k) * (1 - k) * (y0 - 160) + 2 * k * (1 - k) * my + k * k * (y - 120); c.lineTo(px, py) } c.stroke(); c.restore() }
    for (let i = 4; i >= 0; i--) card(c, i, t, ck(i));
    for (let i = 0; i < 5; i++) if (ck(i) > .5) pinAt(c, BCARD[i][2], BCARD[i][3] - (i ? 135 : 175));
    c.restore();
    stamp(c, 'ТОЛЬКО НА YOUTUBE', 540, 1050, -.08, t, q.yt + .05, C.red, 70);
    const qk = pop(t, q.q1v - .1, .45), ek = pop(t, q.q2 - .05, .4);
    if (qk > 0) { c.save(); c.translate(860, 330); c.scale(qk, qk); tx(c, '?', 0, 60, { f: 'O', w: 700, s: 200, c: '#ffffff', glow: '#ffffff', gb: 30 }); c.restore() }
    if (ek > 0) { c.save(); c.translate(200, 330); c.scale(ek, ek); tx(c, '!', 0, 60, { f: 'O', w: 700, s: 200, c: C.orange, glow: C.orange, gb: 30 }); c.restore() }
    if (flash > 0) { c.fillStyle = `rgba(240,240,236,${flash})`; c.fillRect(0, 0, WW, HH) }
    motes(c, t, 351, 24, '#ffe6c4', .5);
  }

  // ================= план ролика: каждый план — от слов диктора =================
  window.CUES = window.CUES || {};
  const cue = (t0, name, gain = 1, pan = 0) => { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, pan] };
  function stub(c, t, u) { bg(c, t, {}); tx(c, 'ДАЛЬШЕ', WW / 2, HH / 2, { f: 'O', w: 700, s: 80, c: 'rgba(255,255,255,.2)' }) }
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
      s6: s(6), him: W('химики'), smesh: W('смешали'), nikot: W('никотин'), kisl: W('кислотой'), poluch: W('получили'), nikot2: W('никотиновую'), sol: W('соль'), zahod: W('заходит'), myagko: W('мягко'), uboy: W('убойной'), doze: W('дозе'),
      s7: s(7), elek: W('электронных'), prod: W('продавали'), zaliv: W('заливать'), vochto: W('что', 6), sekr7: W('секретную'), formul: W('формулу'), spryat: W('спрятали'), arhiv: W('архив'),
      s8: s(8), y98: W('1998'), sud: W('суд'), zast: W('заставил'), raskr: W('раскрыть'), tainy: W('тайны'), chet: W('четырнадцать'), mln: W('миллионов'), opubl: W('опубликовали'), kalif: W('калифорнии'),
      s9: s(9), stran: W('странному'), pryamo9: W('прямо', 1), sosed: W('соседству'), stan: W('стэнфордским'), gde: W('где'), bum: W('бумаги'), nahod: W('находят'), dva: W('два'), stud: W('студента'),
      s10: s(10), sozd10: W('создают'), elek10: W('электронную'), pohozh: W('похожую'), flesh: W('флешку'), vnutri9: W('внутри', 1), ozhiv: W('оживает'), sol10: W('соль', 1),
      s11: s(11), kart: W('картридж'), zamen: W('заменял'), pachku: W('пачку'), myag: W('мягкий'), obzh: W('обжигал'), gorlo11: W('горло', 1), shkol: W('школьники'), tyan: W('тянули'), ostan: W('остановки'), podsazh: W('подсаживались'), razy: W('разы'), bystr: W('быстрее'),
      s12: s(12), chetyre: W('четыре'), ssha: W('сша'), paril: W('парил'), kazhd: W('каждый'), chetv: W('четвёртый'), starsh: W('старшеклассник'), tret: W('треть'), trin: W('тринадцать'), mlrd: W('миллиардов'), vykup: W('выкупил'), marl: W('мальборо'),
      s13: s(13), plan: W('план'), ideal: W('идеально'), s14: s(14), vam: W('вам'), seych: W('сейчас'), zahot: W('захотелось'), zat: W('затянуться'),
      s15: s(15), l1: W('захотите'), brosit: W('бросить'), prodad: W('продадут'), odni: W('одни'), lyud: W('люди'), kto: W('кто'), smotr: W('смотрите'), yt: W('youtube'),
      s16: s(16), q1v: S[16].words[4].a, q2: S[16].words[6].a, b0: tl.b0, endT: tl.endT };
    const q = Q;
    const sh = (a, tr, f, cy) => SH.push({ a, tr, f, cy });
    // HUD: тема · место; часы тикают; на «пятьдесят лет назад» отматываются
    const T0 = 23 * 3600 + 41 * 60 + 7, T73 = 21 * 3600 + 14 * 60 + 52;
    const now = { clock: t => hms(T0 + t), sub: () => 'НОЯБРЬ · 2026' };
    CHS.push({ a: -1, topic: 'ОДНОРАЗКИ', place: 'ВИТРИНА', ...now });
    CHS.push({ a: q.s1 - .1, topic: 'ОДНОРАЗКИ', place: 'СОСТАВ', ...now });
    CHS.push({ a: q.izobr - .1, topic: 'ОДНОРАЗКИ', place: 'ПРОИСХОЖДЕНИЕ', ...now });
    CHS.push({ a: q.p50 - .2, topic: 'ПЕРЕМОТКА', place: 'НАЗАД', clock: t => hms(T0 + q.p50 - (t - q.p50) * 9100), sub: t => 'ГОД ' + Math.round(yearNow(t)) });
    CHS.push({ a: q.y73 - .03, topic: 'R.J. REYNOLDS', place: 'УИНСТОН-СЕЙЛЕМ', clock: t => hms(T73 + (t - q.y73)), sub: () => 'ФЕВРАЛЬ · 1973' });
    CHS.push({ a: q.gotov - .15, topic: 'R.J. REYNOLDS', place: 'ОТДЕЛ ИССЛЕДОВАНИЙ', clock: t => hms(T73 + (t - q.y73)), sub: () => '02.02.1973' });
    CHS.push({ a: q.s4 - .12, topic: 'R.J. REYNOLDS', place: 'МЕМОРАНДУМ', clock: t => hms(T73 + (t - q.y73)), sub: () => '02.02.1973' });
    CHS.push({ a: q.s5 - .1, topic: 'ПРОБЛЕМА', place: 'ГОРЛО', clock: t => hms(T73 + (t - q.y73)), sub: () => '1973' });
    const T79 = 10 * 3600 + 42 * 60 + 18, T98 = 14 * 3600 + 5 * 60 + 41, T15 = 23 * 3600 + 12 * 60 + 40;
    CHS.push({ a: q.s6 - .1, topic: 'R.J. REYNOLDS', place: 'ЛАБОРАТОРИЯ', clock: t => hms(T79 + (t - q.s6)), sub: () => '1979' });
    CHS.push({ a: q.sekr7 - .2, topic: 'R.J. REYNOLDS', place: 'АРХИВ', clock: t => hms(T79 + 900 + (t - q.s6)), sub: () => '18.01.1979' });
    CHS.push({ a: q.s8 - .1, topic: 'СУД', place: 'МИННЕСОТА', clock: t => hms(T98 + (t - q.s8)), sub: () => '1998' });
    CHS.push({ a: q.sud + .3, topic: 'АРХИВ', place: 'ДОКУМЕНТЫ ОТКРЫТЫ', clock: t => hms(T98 + (t - q.s8)), sub: () => '1998' });
    CHS.push({ a: q.opubl - .15, topic: 'КАЛИФОРНИЯ', place: 'ОТКРЫТЫЙ ДОСТУП', clock: t => hms(T98 + 7200 + (t - q.s8)), sub: () => 'АРХИВ ДОКУМЕНТОВ' });
    CHS.push({ a: q.s9 - .05, topic: 'КАЛИФОРНИЯ', place: 'ЗАЛИВ САН-ФРАНЦИСКО', clock: t => hms(T98 + 7200 + (t - q.s8)), sub: () => 'АРХИВ → СТЭНФОРД' });
    CHS.push({ a: q.gde - .15, topic: 'СТЭНФОРД', place: 'ОБЩЕЖИТИЕ', clock: t => hms(T15 + (t - q.gde)), sub: () => '2000-Е' });
    CHS.push({ a: q.s10 - .08, topic: 'JUUL', place: 'ЧЕРТЁЖ', clock: t => hms(T15 + 900 + (t - q.gde)), sub: () => '2015' });
    CHS.push({ a: q.s11 - .08, topic: 'JUUL', place: 'КАРТРИДЖ', clock: t => hms(T15 + 900 + (t - q.gde)), sub: () => '2015' });
    CHS.push({ a: q.shkol - .1, topic: 'ШКОЛЫ', place: 'США', clock: t => hms(8 * 3600 + 14 * 60 + 9 + (t - q.shkol)), sub: () => '2015 → 2019' });
    CHS.push({ a: q.s12 - .1, topic: 'ШКОЛЫ', place: 'США', clock: t => hms(8 * 3600 + 14 * 60 + 9 + (t - q.shkol)), sub: () => '2019' });
    CHS.push({ a: q.tret - .25, topic: 'СДЕЛКА', place: 'ALTRIA × JUUL', clock: t => hms(16 * 3600 + 2 * 60 + 33 + (t - q.tret)), sub: () => '20.12.2018' });
    CHS.push({ a: q.s13 - .1, topic: 'R.J. REYNOLDS', place: 'ПЛАН 1973', clock: t => hms(T73 + 40 + (t - q.s13)), sub: () => '02.02.1973' });
    CHS.push({ a: q.s14 - .1, topic: 'СЕЙЧАС', place: 'ТЫ', clock: t => hms(T0 - 600 + (t - q.s14)), sub: () => 'НОЯБРЬ · 2026' });
    CHS.push({ a: q.b0 - .02, topic: 'ДОСЬЕ', place: 'ПОЛНЫЙ ФИЛЬМ', clock: t => hms(T0 - 590 + (t - q.s14)), sub: () => 'YOUTUBE' });
    CHS.push({ a: q.endT - .2, topic: 'ОДНОРАЗКИ', place: 'ВИТРИНА', clock: () => hms(T0), sub: () => 'НОЯБРЬ · 2026', inst: 1 });
    // планы
    sh(0, 'cut', s01, 1300);
    sh(q.chto2 - .08, 'cut', s02, 1330);
    sh(q.bez - .15, 'blur', s03, 1390);
    sh(q.s1 - .1, 'punch', s04, 1500);
    sh(q.izobr - .1, 'cut', s05, 1250);
    sh(q.p50 - .2, 'blur', s06, 1300);
    sh(q.tab - .2, 'blur', s07, 1300);
    sh(q.sozd - .15, 'cut', s08, 1330);
    sh(q.gotov - .15, 'blur', s09, 1430);
    sh(q.s3 - .08, 'punch', s10, 1450);
    sh(q.s4 - .12, 'cut', s11, 1450);
    sh(q.s5 - .1, 'cut', s12, 1420);
    sh(q.edkiy - .35, 'punch', s13, 1500);
    sh(q.s6 - .1, 'blur', s14, 1520);
    sh(q.poluch - .15, 'cut', s15, 1520);
    sh(q.zahod - .45, 'cut', s16, 1500);
    sh(q.s7 - .1, 'blur', s17, 1520);
    sh(q.sekr7 - .2, 'cut', s18, 1500);
    sh(q.s8 - .1, 'flash', s19, 1450);
    sh(q.sud + .3, 'punch', s20, 1450);
    sh(q.chet - .15, 'cut', s21, 1300);
    sh(q.opubl - .15, 'blur', s22, 1450);
    sh(q.s9 - .05, 'cut', s23, 1480);
    sh(q.gde - .15, 'blur', s24, 1290);
    sh(q.s10 - .08, 'blur', s25, 1500);
    sh(q.vnutri9 - .15, 'punch', s26, 1480);
    sh(q.s11 - .08, 'blur', s27, 1450);
    sh(q.myag - .3, 'blur', s28, 1500);
    sh(q.shkol - .1, 'punch', s29, 1250);
    sh(q.podsazh - .15, 'cut', s30, 1400);
    sh(q.s12 - .1, 'blur', s31, 1290);
    sh(q.tret - .25, 'punch', s32, 1520);
    sh(q.vykup - .12, 'cut', s33, 1300);
    sh(q.s13 - .1, 'blur', s34, 1420);
    sh(q.s14 - .1, 'blur', s35, 1300);
    sh(q.b0 - .02, 'cut', s36, 1500);
    sh(q.endT - .2, 'whip', (c, t, u) => s01(c, 0, 0), 1300);
    HITS.push(q.y73, q.sekr + .02, q.camel + .05, q.winston + .05, q.deret, q.arhiv, q.sud, q.raskr + .1, q.marl + .05, q.ideal, q.yt + .08);
    // звуки
    cue(0, 'deep', .5); cue(.02, 'whoosh', .45); cue(q.odn + .05, 'ding', .35); cue(q.odn + .1, 'shimmer', .3);
    cue(q.chto2 - .05, 'swish', .35); cue(q.zam - .05, 'whoosh', .45, .3); cue(q.zam + .35, 'thud', .35, .3); cue(q.sig + .05, 'whip', .3, -.3);
    cue(q.bez - .2, 'puff', .7); cue(q.parom - .05, 'vape', .4); cue(q.mango - .05, 'chomp', .3, -.4); cue(q.mango, 'shimmer', .35, -.3); cue(q.myaty - .05, 'shimmer', .35, .4); cue(q.myaty, 'ding', .25, .3);
    cue(q.s1 - .12, 'whoosh', .5); cue(q.s1 + .15, 'xray', .6); cue(q.zhid, 'ding', .3, .3); cue(q.vnutri + .05, 'zap', .25, -.3);
    cue(q.izobr - .1, 'dive', .7); cue(q.tab1, 'factory', .9); cue(q.gig, 'deep', .6); cue(q.gig + .05, 'impact', .35);
    cue(q.p50 - .2, 'whoosh', .55); for (let tt = q.p50; tt < q.y73; tt += .08) cue(tt, 'tick', .2 + .22 * (tt - q.p50) / (q.y73 - q.p50)); cue(q.y73, 'impact', .75); cue(q.y73 + .02, 'stamp', .35);
    cue(q.tab - .2, 'whoosh', .4); cue(q.tab, 'deep', .4); cue(q.rey - .15, 'buzz', .3); cue(q.rey + .1, 'pin', .45);
    cue(q.sozd - .1, 'swish', .35); cue(q.camel + .05, 'thud', .75, -.3); cue(q.winston + .05, 'thud', .75, .3);
    cue(q.gotov - .15, 'whoosh', .35); cue(q.gotov - .1, 'typing', .8); cue(q.sekr + .02, 'stamp', 1);
    cue(q.s3 - .08, 'swish', .35); cue(q.pryamo, 'marker', .45);
    for (let i = 0; i < 7; i++) cue(q.qt[i], 'marker', i === 6 ? .5 : .28, .2);
    cue(q.s5 - .1, 'whoosh', .35); cue(q.s5, 'puff', .4); cue(q.dym, 'pin', .35, .3);
    cue(q.edkiy - .35, 'xray', .45); cue(q.edkiy, 'deep', .45); cue(q.deret, 'impact', .45); cue(q.gorlo, 'heart', .55); cue(q.gorlo + .7, 'heart', .45);
    cue(q.s6 - .1, 'swish', .4); cue(q.nikot - .15, 'pour', .7, -.3); cue(q.kisl - .15, 'pour', .7, .3); cue(q.poluch, 'bubble', .7);
    cue(q.nikot2 - .05, 'shimmer', .45); cue(q.sol, 'ding', .35); cue(q.zahod - .4, 'whoosh', .3); cue(q.myagko, 'ding', .3, -.3); cue(q.uboy - .1, 'whirr', .45); cue(q.uboy + .3, 'impact', .4);
    cue(q.s7 - .1, 'whoosh', .35); cue(q.prod, 'stamp', .7); cue(q.zaliv - .2, 'glass', .35); cue(q.zaliv + .05, 'pour', .8); cue(q.zaliv + .5, 'drip', .5);
    cue(q.sekr7 - .2, 'whoosh', .35); cue(q.sekr7, 'papers', .4); cue(q.spryat, 'swish', .4); cue(q.arhiv - .05, 'drawer', .9); cue(q.arhiv + .02, 'thud', .6);
    cue(q.s8 - .1, 'deep', .45); cue(q.y98, 'tick', .3); cue(q.sud, 'stamp', 1); cue(q.sud + .02, 'impact', .7);
    cue(q.zast, 'whirr', .45); cue(q.raskr, 'vaultopen', .9); cue(q.raskr + .3, 'papers', .9); cue(q.tainy, 'whoosh', .4);
    cue(q.chet - .1, 'papers', .6); for (let i = 0; i < 9; i++) cue(q.chet + i * .13, 'tick', .25); cue(q.mln + .6, 'ding', .35);
    cue(q.opubl - .1, 'whoosh', .35); cue(q.opubl + .1, 'pin', .5); cue(q.kalif - .1, 'shimmer', .3);
    cue(q.s9 + .4, 'pin', .45, -.3); cue(q.pryamo9 - .2, 'marker', .5); cue(q.sosed, 'ding', .3); cue(q.pryamo9 + .7, 'pin', .5, .3);
    cue(q.gde - .15, 'swish', .35); cue(q.gde, 'keys', .7); cue(q.nahod + .1, 'ding', .4); cue(q.nahod + .12, 'stamp', .45);
    cue(q.s10 - .08, 'deep', .4); cue(q.s10 + .1, 'quill', .45); cue(q.pohozh, 'whoosh', .3); cue(q.flesh, 'pin', .4);
    cue(q.vnutri9 - .15, 'whoosh', .4); cue(q.ozhiv, 'shimmer', .5); cue(q.sol10, 'ding', .35);
    cue(q.s11 - .08, 'swish', .35); cue(q.kart, 'thud', .4); for (let i = 0; i < 20; i += 2) cue(q.zamen + i * (q.pachku + .25 - q.zamen) / 20, 'tick', .3); cue(q.pachku + .1, 'stamp', .45);
    cue(q.myag - .3, 'whoosh', .35); cue(q.obzh, 'ding', .3);
    cue(q.shkol - .1, 'school', .9); cue(q.tyan, 'vape', .5); cue(q.ostan, 'vape', .4); cue(q.podsazh - .15, 'whoosh', .3); cue(q.podsazh, 'heart', .5); cue(q.razy, 'impact', .4);
    cue(q.s12 - .1, 'swish', .35); cue(q.kazhd, 'impact', .5); cue(q.starsh, 'stamp', .4);
    cue(q.tret - .25, 'whoosh', .5); cue(q.tret, 'thud', .45); cue(q.trin, 'coins', .45); cue(q.vykup - .1, 'whoosh', .35); cue(q.marl + .05, 'thud', .8);
    cue(q.s13 - .1, 'deep', .5); cue(q.ideal - .02, 'stamp', 1);
    cue(q.s14 - .1, 'deep', .35); cue(q.zat - .1, 'vape', .9); cue(q.zat + .9, 'puff', .9);
    cue(q.b0, 'deep', .5); cue(q.odni - .2, 'marker', .4); cue(q.lyud - .2, 'tick', .4); cue(q.yt + .08, 'stamp', 1); cue(q.yt + .11, 'thud', .6); cue(q.q1v, 'thud', .35); cue(q.q2, 'ding', .35); cue(q.endT - .25, 'whoosh', .8);
    buildCaps(tl);
  }

  window.EP = {
    P, D, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      SC.forEach(S => { D[S.key] = (t) => { frame(t); return '' } });
      const gr = document.getElementById('grain'); gr.style.display = ''; gr.style.opacity = .14;
      const vg = document.getElementById('vig'); if (vg) vg.style.display = 'none';
      if (!document.getElementById('v168f')) { const st = document.createElement('style'); st.id = 'v168f'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); A = mk(WW, HH); B = mk(WW, HH);
      SH = []; CHS = []; HITS = [];
      return Promise.all(['500 20px J', '700 20px J', '500 20px O', '700 20px O', '800 20px M'].map(f => document.fonts.load(f, 'АЯaz09'))).then(() => { smokeSprites(); build(tl) });
    },
  };
})();
