// v16.7 (13.11, ночь) — тёмная версия «в стиле референсов» (dynastixxx: NotPetya, ZachXBT, Stuxnet…). Андрей: «не обязательно один в один v15 —
// просто покажи, что можешь так: тёмную, с объёмной графикой, как там сделано». Голос и тайминг — v16.5 (1:45.8), кадр 9:16 (1080×1920).
// Как устроено:
//  • мини-3D на canvas: камера с перспективой (cam3, look, tc, pj), грани со светом (ключевой, заполняющий, контровой), блики, фаски,
//    текстуры граней с перспективой (texQuad — треугольники с аффинной заливкой), туман по глубине, мягкие тени, отражения в мокром полу;
//  • глубина резкости — слои «дальний / резкий» с размытием (lay, comp), «тилт» для столов (tiltDOF), свечение — отдельный слой (bloom);
//  • HUD как у референсов: красная точка, «ТЕМА · МЕСТО» слева, часы справа (тикают; на «пятьдесят лет назад» отматываются 2026 → 1973);
//  • субтитры: Oswald 700 крупно, куски по 1–3 слова; сказанные — белые, ещё не сказанные — серые, главное слово — оранжевое.
// Из v164r (v15) взяты утилиты (шум, свет, дым, пыль, боке, штамп), одноразка и её «рентген», движок планов и переходов.
(function () {
  'use strict';
  const WW = 1080, HH = 1920, TAU = Math.PI * 2;
  const C = { ink: '#03050a', night: '#060a13', navy: '#0b1324', steel: '#18202d', cold: '#cfe9ff', ice: '#8fd6ff', teal: '#3fd3c6', amber: '#ffb54a',
    gold: '#e7b15c', red: '#ff3d3d', red2: '#a8121b', crimson: '#3a070c', paper: '#ece2c6', paper2: '#cdbf9b', inkT: '#23201b', green: '#47e38a', white: '#ffffff' };
  P = { bg: C.ink, paper: C.paper, ink: C.ink, line: C.paper, a1: C.gold, a2: C.red };
  const D = {};
  let cv = null, X = null, A = null, B = null, SH = [], CHS = [], HITS = [], Q = {};

  // ================= утилиты =================
  const cl = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, lp = (a, b, k) => a + (b - a) * k;
  const ss = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k) };
  const eo = k => 1 - Math.pow(1 - cl(k), 3), ei = k => Math.pow(cl(k), 3), eio = k => { k = cl(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 };
  const spr = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-6.5 * k) * Math.cos(11 * k);
  const H1 = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) };
  const H2 = (i, j) => H1(i * 57.31 + j * 131.71);
  const n1 = x => { const i = Math.floor(x), f = x - i; return lp(H1(i), H1(i + 1), f * f * (3 - 2 * f)) * 2 - 1 };
  function vn(x, y) { const xi = Math.floor(x), yi = Math.floor(y), u = x - xi, v = y - yi, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v); return lp(lp(H2(xi, yi), H2(xi + 1, yi), su), lp(H2(xi, yi + 1), H2(xi + 1, yi + 1), su), sv) }
  function fbm(x, y, o = 4) { let s = 0, a = .5, f = 1; for (let i = 0; i < o; i++) { s += a * vn(x * f, y * f); a *= .5; f *= 2.03 } return s }
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c };
  const CA = new Map();
  const cache = (k, w, h, fn) => { let c = CA.get(k); if (!c) { c = mk(w, h); fn(c.getContext('2d'), c.width, c.height); CA.set(k, c) } return c };
  const mixh = (a, b, k) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = (s) => Math.round(lp((A >> s) & 255, (B >> s) & 255, k)); return '#' + [16, 8, 0].map(s => m(s).toString(16).padStart(2, '0')).join('') };
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})` };
  const lg = (c, x0, y0, x1, y1, st) => { const g = c.createLinearGradient(x0, y0, x1, y1); for (const [o, col] of st) g.addColorStop(o, col); return g };
  const rg = (c, x, y, r0, r1, st) => { const g = c.createRadialGradient(x, y, r0, x, y, r1); for (const [o, col] of st) g.addColorStop(o, col); return g };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r) };
  const poly = (c, p) => { c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath() };
  // вид: точка мира (x, y) — в центре кадра, масштаб s, поворот r
  const view = (c, s, x, y, r = 0) => { c.translate(WW / 2, HH / 2); if (r) c.rotate(r); c.scale(s, s); c.translate(-x, -y) };
  const at = (u, k0, k1) => cl((u - k0) / (k1 - k0));

  // ================= текст =================
  function font(c, o) { c.font = `${o.w || 700} ${o.s || 32}px ${o.f || 'U'}`; c.letterSpacing = (o.ls || 0) + 'px' }
  function tx(c, s, x, y, o = {}) {
    if (!s) return; c.save(); font(c, o); c.textAlign = o.al || 'center'; c.textBaseline = o.bl || 'alphabetic'; c.globalAlpha *= o.a ?? 1;
    if (o.glow) { c.shadowColor = o.glow; c.shadowBlur = o.gb || 20 } c.fillStyle = o.c || '#fff'; c.fillText(s, x, y); c.restore()
  }
  function tw(c, s, o = {}) { c.save(); font(c, o); const w = c.measureText(s).width; c.restore(); return w }

  // ================= свет, воздух, глубина =================
  function noiseTex(k, w, h, sc, oct) {
    return cache('nz' + k, w, h, (x, W, H) => { const im = x.createImageData(W, H), d = im.data; for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = fbm(i / sc + 3.3, j / sc + 7.7, oct), p = (j * W + i) * 4; d[p] = d[p + 1] = d[p + 2] = v * 255; d[p + 3] = 255 } x.putImageData(im, 0, 0) })
  }
  function coneSprite(len, spread, col) {
    const half = Math.tan(spread / 2) * len, pad = 70, w = half * 2 + pad * 2, h = len + pad;
    return cache(`cone${len | 0}|${spread.toFixed(3)}|${col}`, w, h, (x) => {
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
    if (a <= 0 || !(len > 1)) return; const s = coneSprite(900, spread, col), k = len / 900;   // v16.7: один спрайт на раствор, длина — масштабом (иначе кэш рос с каждым кадром)
    c.save(); c.translate(x, y); c.rotate(ang); c.scale(k, k); c.globalCompositeOperation = 'screen'; c.globalAlpha *= a; c.drawImage(s, -s.width / 2, 0); c.restore();
  }
  // пылинки в конусе
  function dust(c, t, x, y, ang, spread, len, n, seed = 1, a = 1) {
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
  function glowDot(c, x, y, r, col, a = 1) {
    if (a <= 0) return; c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha *= cl(a, 0, 4);
    c.fillStyle = rg(c, x, y, 0, r, [[0, rgba(col, 1)], [.22, rgba(col, .45)], [1, rgba(col, 0)]]); c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore();
  }
  function pool(c, x, y, rx, ry, col, a) { c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha *= a; c.translate(x, y); c.scale(1, ry / rx); c.fillStyle = rg(c, 0, 0, 0, rx, [[0, rgba(col, .55)], [.45, rgba(col, .2)], [1, rgba(col, 0)]]); c.fillRect(-rx, -rx, 2 * rx, 2 * rx); c.restore() }
  // пластина боке (кэш): мягкие диски со светлым краем
  function bokeh(key, w, h, n, cols, r0, r1, seed = 1) {
    return cache('bk' + key, w, h, (x) => {
      x.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        const px = H1(seed + i * 3.1) * w, py = H1(seed + i * 7.7) * h, r = lp(r0, r1, H1(seed + i * 1.9) ** 2), col = cols[i % cols.length], a = .05 + .13 * H1(seed + i * 5.3);
        x.fillStyle = rg(x, px, py, 0, r, [[0, rgba(col, a * .65)], [.8, rgba(col, a)], [.92, rgba(col, a * 1.3)], [1, rgba(col, 0)]]);
        x.beginPath(); x.arc(px, py, r, 0, TAU); x.fill();
      }
    });
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
  // дым / пар: источник (x, y); o: n, life, rise, sway, drift, spread, r0, r1, a, seed
  function smoke(c, t, x, y, o = {}) {
    const S = smokeSprites(), n = o.n || 24, life = o.life || 4, seed = o.seed || 1;
    c.save(); c.globalCompositeOperation = o.op || 'screen';
    for (let i = 0; i < n; i++) {
      const age = (((t + (o.t0 || 0)) / life + H1(seed + i * 1.37)) % 1 + 1) % 1;
      if (o.from != null && t - o.from < age * life) continue;    // дым появляется с момента from
      const rise = (o.rise || 420) * Math.pow(age, .85);
      const sway = n1(i * 3.7 + t * .35 + seed) * (o.sway || 40) * age + (o.drift || 0) * age * age;
      const px = x + sway + (H1(seed + i * 9.1) - .5) * (o.spread || 20) * (1 + age * 2), py = y - rise;
      const r = lp(o.r0 || 30, o.r1 || 180, Math.pow(age, .8)), a = (o.a ?? .5) * Math.pow(Math.sin(Math.PI * Math.min(1, age * 1.12)), 1.3);
      if (a <= .003) continue;
      c.globalAlpha = a; c.save(); c.translate(px, py); c.rotate(H1(seed + i) * TAU + t * .15 * (H1(i * 2.3) - .5)); c.drawImage(S[i % 4], -r, -r, 2 * r, 2 * r); c.restore();
    }
    c.restore();
  }
  // тех-карточка с выноской: (x, y) — левый верх, k — появление, o.tx/o.ty — куда тянется линия
  function card(c, x, y, title, value, k, o = {}) {
    if (k <= 0) return;
    const tw1 = tw(c, title, { f: 'J', w: 500, s: 20, ls: 4 }), tw2 = tw(c, value, { f: 'U', w: 700, s: o.vs || 34 }), w = Math.max(tw1, tw2) + 56, h = 98, e = eo(k);
    c.save(); c.globalAlpha *= cl(k * 2);
    if (o.tx != null) {
      const sx = o.side === 'r' ? x : x + w, sy = y + h / 2, ex = lp(sx, o.tx, e), ey = lp(sy, o.ty, e);
      c.strokeStyle = rgba(o.col || C.ice, .7); c.lineWidth = 2; c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex, ey); c.stroke();
      c.fillStyle = o.col || C.ice; c.beginPath(); c.arc(ex, ey, 6, 0, TAU); c.fill(); glowDot(c, ex, ey, 30, o.col || C.ice, .7 * e);
    }
    c.beginPath(); c.rect(x, y, w * e, h); c.clip();
    c.fillStyle = 'rgba(6,10,20,.78)'; c.fillRect(x, y, w, h); c.strokeStyle = 'rgba(190,225,255,.35)'; c.lineWidth = 1.5; c.strokeRect(x + .75, y + .75, w - 1.5, h - 1.5);
    c.fillStyle = o.col || C.ice; c.fillRect(x, y, 5, h);
    tx(c, title, x + 26, y + 34, { f: 'J', w: 500, s: 20, ls: 4, al: 'left', c: 'rgba(190,210,235,.8)' });
    tx(c, value, x + 26, y + 78, { f: 'U', w: 700, s: o.vs || 34, al: 'left', c: '#fff' });
    c.restore();
  }
  // штамп: 2,2 → 1 за 0,18 с (встряска кадра — HITS)
  function stamp(c, s, x, y, rot, t, t0, col = C.red, sz = 70) {
    const k = cl((t - t0 + .18) / .18); if (k <= 0) return;
    const w = tw(c, s, { f: 'O', w: 700, s: sz, ls: 8 }) + 80, h = sz * 1.75, sc = lp(2.2, 1, k * k);
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc); c.globalAlpha *= cl(k * 3) * .92;
    c.strokeStyle = col; c.lineWidth = 9; rr(c, -w / 2, -h / 2, w, h, 12); c.stroke(); c.lineWidth = 3; rr(c, -w / 2 + 13, -h / 2 + 13, w - 26, h - 26, 6); c.stroke();
    tx(c, s, 0, sz * .36, { f: 'O', w: 700, s: sz, ls: 8, c: col });
    c.restore();
    const pk = (t - t0) / .45; if (pk > 0 && pk < 1) { c.save(); c.strokeStyle = col; c.globalAlpha = 1 - pk; c.lineWidth = 10 * (1 - pk); c.beginPath(); c.arc(x, y, 100 + pk * 420, 0, TAU); c.stroke(); c.restore() }
  }
  function shake(t) { for (const h of HITS) if (t >= h && t < h + .22) { const k = 1 - (t - h) / .22, f = Math.floor(t * 60); return [(H1(f) - .5) * 30 * k, (H1(f + 7) - .5) * 30 * k] } return [0, 0] }

  // ================= предметы =================
  // одноразка-стик: центр (0, 0), высота h; o.led — яркость индикатора, o.ledCol
  function vape(c, h, o = {}) {
    const w = h * .23, top = -h / 2, mp = h * .2, led = o.led ?? .6, lc = o.ledCol || C.ice;
    c.save();
    rr(c, -w / 2, top + mp * .92, w, h - mp * .92, w * .36);
    const B = o.body;   // v16.4 B: цветной корпус («МАНГО») — те же блики, что у металла
    c.fillStyle = B ? lg(c, -w / 2, 0, w / 2, 0, [[0, mixh(B, '#000000', .62)], [.1, mixh(B, '#000000', .2)], [.2, mixh(B, '#ffffff', .38)], [.3, B], [.62, mixh(B, '#000000', .38)], [.88, mixh(B, '#000000', .62)], [1, o.rim || '#4a6a92']])
      : lg(c, -w / 2, 0, w / 2, 0, [[0, '#121419'], [.1, '#454b55'], [.2, '#7a828f'], [.3, '#3f454f'], [.62, '#1d2026'], [.88, '#0c0d10'], [1, '#4a6a92']]); c.fill();
    c.save(); c.clip(); c.globalAlpha = .1; c.fillStyle = c.createPattern(brushed(), 'repeat'); c.fillRect(-w / 2, top, w, h); c.restore();
    if (o.label) tx(c, o.label, 0, h / 2 - h * .2, { f: 'U', w: 700, s: w * .17, ls: w * .02, c: 'rgba(255,255,255,.85)' });
    rr(c, -w * .33, top, w * .66, mp * 1.05, [w * .3, w * .3, 4, 4]);
    c.fillStyle = o.body ? lg(c, -w * .33, 0, w * .33, 0, [[0, '#8a8478'], [.3, '#f2ede2'], [.62, '#bdb6a8'], [1, '#e8dccb']]) : lg(c, -w * .33, 0, w * .33, 0, [[0, '#050506'], [.3, '#24272d'], [.62, '#0f1013'], [1, '#22324a']]); c.fill();
    c.fillStyle = '#000'; rr(c, -w * .15, top + 5, w * .3, 6, 3); c.fill();
    c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(-w / 2 + 2, top + mp * .98, w - 4, 3);
    c.globalCompositeOperation = 'screen';
    c.fillStyle = lg(c, 0, top, 0, h / 2, [[0, 'rgba(255,255,255,0)'], [.3, 'rgba(255,255,255,.22)'], [.75, 'rgba(255,255,255,.07)'], [1, 'rgba(255,255,255,0)']]); c.fillRect(-w * .3, top + mp, w * .07, h - mp);
    c.fillStyle = lg(c, 0, top, 0, h / 2, [[0, 'rgba(140,200,255,0)'], [.5, 'rgba(140,200,255,.38)'], [1, 'rgba(140,200,255,.05)']]); c.fillRect(w * .43, top + mp, w * .045, h - mp);
    if (o.sweep != null) { const sy = lp(top, h / 2, o.sweep); c.fillStyle = lg(c, 0, sy - h * .12, 0, sy + h * .12, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,255,255,.16)'], [1, 'rgba(255,255,255,0)']]); c.fillRect(-w / 2, sy - h * .12, w, h * .24) }
    c.globalCompositeOperation = 'source-over';
    const ly = h / 2 - h * .13; rr(c, -w * .26, ly, w * .52, Math.max(4, h * .018), 3.5); c.fillStyle = rgba(lc, .22 + .78 * led); c.fill();
    glowDot(c, 0, ly + 3, w * 1.25, lc, .6 * led);
    c.restore();
  }
  function brushed() { return cache('brushed', 64, 512, (x, W, H) => { const im = x.createImageData(W, H), d = im.data; for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = fbm(i / 2.5, j / 90, 3), p = (j * W + i) * 4; d[p] = d[p + 1] = d[p + 2] = v * 255; d[p + 3] = 255 } x.putImageData(im, 0, 0) }) }
  function coil(c, x, y, w, hg, t, heat = 1) {
    const n = 7; c.save(); c.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const yy = y - hg / 2 + i * hg / (n - 1);
      c.lineWidth = 3; c.strokeStyle = `rgba(255,${110 + 50 * heat | 0},40,.35)`; c.beginPath(); c.ellipse(x, yy, w / 2, w * .09, 0, Math.PI, TAU); c.stroke();
      c.lineWidth = 4; c.strokeStyle = `rgba(255,${150 + 80 * heat | 0},80,.95)`; c.shadowColor = '#ff8a2a'; c.shadowBlur = 18 * heat; c.beginPath(); c.ellipse(x, yy, w / 2, w * .09, 0, 0, Math.PI); c.stroke(); c.shadowBlur = 0;
    }
    glowDot(c, x, y, w * 1.5, '#ff7a1a', .55 * heat * (.85 + .15 * Math.sin(t * 9)));
    c.restore();
  }
  // одноразка «на рентгене»: внутренности светятся
  function vapeX(c, h, t, o = {}) {
    const w = h * .23, top = -h / 2, mp = h * .2, t0 = top + mp + 10, t1 = top + h * .46;
    c.save();
    rr(c, -w / 2, top + mp * .92, w, h - mp * .92, w * .36); c.fillStyle = 'rgba(8,26,48,.9)'; c.fill();
    rr(c, -w * .33, top, w * .66, mp * 1.05, [w * .3, w * .3, 4, 4]); c.fill();
    c.strokeStyle = C.ice; c.lineWidth = 3; c.shadowColor = C.ice; c.shadowBlur = 16;
    rr(c, -w / 2, top + mp * .92, w, h - mp * .92, w * .36); c.stroke(); rr(c, -w * .33, top, w * .66, mp * 1.05, [w * .3, w * .3, 4, 4]); c.stroke();
    c.lineWidth = 2; c.beginPath(); c.moveTo(-w * .05, top + 10); c.lineTo(-w * .05, t0 + 10); c.moveTo(w * .05, top + 10); c.lineTo(w * .05, t0 + 10); c.stroke(); c.shadowBlur = 0;
    // бак
    rr(c, -w * .38, t0, w * .76, t1 - t0, 12); c.fillStyle = 'rgba(255,170,60,.14)'; c.fill(); c.strokeStyle = 'rgba(255,190,100,.85)'; c.lineWidth = 2; c.stroke();
    const lv = t0 + (t1 - t0) * .22; c.save(); rr(c, -w * .38, t0, w * .76, t1 - t0, 12); c.clip();
    c.fillStyle = lg(c, 0, lv, 0, t1, [[0, 'rgba(255,180,70,.55)'], [1, 'rgba(255,120,40,.35)']]); c.beginPath(); c.moveTo(-w, lv);
    for (let i = 0; i <= 20; i++) c.lineTo(-w * .38 + i * w * .76 / 20, lv + Math.sin(t * 3 + i * .9) * 3); c.lineTo(w, t1 + 20); c.lineTo(-w, t1 + 20); c.fill();
    for (let i = 0; i < 14; i++) { const u = (H1(i * 3.3) + t * (.15 + .2 * H1(i))) % 1, bx = -w * .3 + H1(i * 7.1) * w * .6, by = lp(t1 - 8, lv + 6, u); c.strokeStyle = `rgba(255,230,180,${.6 * Math.sin(Math.PI * u)})`; c.lineWidth = 1.5; c.beginPath(); c.arc(bx, by, 2 + 3 * H1(i), 0, TAU); c.stroke() }
    c.restore();
    coil(c, 0, t0 + (t1 - t0) * .62, w * .46, (t1 - t0) * .32, t, o.heat ?? 1);
    // плата
    const b0 = top + h * .5, b1 = top + h * .6; rr(c, -w * .38, b0, w * .76, b1 - b0, 6); c.fillStyle = 'rgba(40,210,150,.14)'; c.fill(); c.strokeStyle = 'rgba(70,235,175,.8)'; c.lineWidth = 2; c.stroke();
    c.fillStyle = 'rgba(70,235,175,.7)'; c.fillRect(-w * .14, b0 + (b1 - b0) * .25, w * .28, (b1 - b0) * .5);
    c.strokeStyle = 'rgba(70,235,175,.45)'; c.lineWidth = 1.5; c.beginPath();
    for (let i = 0; i < 6; i++) { const yy = b0 + (b1 - b0) * (.2 + i * .12); c.moveTo(-w * .34, yy); c.lineTo(-w * .16, yy); c.moveTo(w * .16, yy); c.lineTo(w * .34, yy) } c.stroke();
    // аккумулятор
    const a0 = top + h * .63, a1 = h / 2 - h * .07; rr(c, -w * .38, a0, w * .76, a1 - a0, 16); c.fillStyle = 'rgba(120,180,255,.10)'; c.fill(); c.strokeStyle = 'rgba(150,210,255,.8)'; c.stroke();
    c.strokeStyle = 'rgba(150,210,255,.35)'; c.beginPath(); for (let i = 1; i < 5; i++) { const yy = lp(a0, a1, i / 5); c.moveTo(-w * .3, yy); c.lineTo(w * .3, yy) } c.stroke();
    tx(c, '+', 0, a0 + 36, { f: 'J', w: 700, s: 26, c: 'rgba(150,210,255,.8)' });
    const ly = h / 2 - h * .13 + 2; glowDot(c, 0, ly, w, C.ice, .5);
    c.restore();
  }

  // ================= мини-3D: камера с перспективой, грани со светом, текстуры =================
  // Мир: x — вправо, y — вверх, z — вглубь. Камера: yaw + — поворот вправо, pitch + — взгляд вверх, f — фокус в пикселях.
  const HX = {};
  const c3 = h => HX[h] || (HX[h] = [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255]);
  const css3 = (v, a = 1) => `rgba(${cl(v[0]) * 255 | 0},${cl(v[1]) * 255 | 0},${cl(v[2]) * 255 | 0},${a})`;
  const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], lerp3 = (a, b, k) => [lp(a[0], b[0], k), lp(a[1], b[1], k), lp(a[2], b[2], k)];
  const nrm3 = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l] };
  function cam3(o) {
    const C = Object.assign({ x: 0, y: 0, z: 0, yaw: 0, pitch: 0, roll: 0, f: 1150, cx: WW / 2, cy: HH / 2 }, o);
    C.ca = Math.cos(C.yaw); C.sa = Math.sin(C.yaw); C.cp = Math.cos(C.pitch); C.sp = Math.sin(C.pitch); C.cr = Math.cos(C.roll); C.sr = Math.sin(C.roll);
    C.P = [C.x, C.y, C.z]; return C;
  }
  // камера, которая смотрит из точки from в точку to
  function look(from, to, f = 1150, roll = 0, o = {}) {
    const d = sub3(to, from); return cam3(Object.assign({ x: from[0], y: from[1], z: from[2], yaw: Math.atan2(d[0], d[2]), pitch: Math.atan2(d[1], Math.hypot(d[0], d[2])), roll, f }, o));
  }
  function tc(C, p) {
    const dx = p[0] - C.x, dy = p[1] - C.y, dz = p[2] - C.z, X = dx * C.ca - dz * C.sa, Z1 = dx * C.sa + dz * C.ca, Y = dy * C.cp - Z1 * C.sp, Z = dy * C.sp + Z1 * C.cp;
    return [X * C.cr + Y * C.sr, -X * C.sr + Y * C.cr, Z];
  }
  const ZN = 2;
  const pj = (C, q) => { const s = C.f / q[2]; return [C.cx + q[0] * s, C.cy - q[1] * s] };
  const P3 = (C, p) => { const q = tc(C, p); return q[2] > ZN ? pj(C, q) : null };
  const depth = (C, p) => tc(C, p)[2];
  function clipN(Q) {
    const o = [];
    for (let i = 0; i < Q.length; i++) { const a = Q[i], b = Q[(i + 1) % Q.length], ia = a[2] >= ZN, ib = b[2] >= ZN; if (ia) o.push(a); if (ia !== ib) { const k = (ZN - a[2]) / (b[2] - a[2]); o.push([lp(a[0], b[0], k), lp(a[1], b[1], k), ZN]) } }
    return o;
  }
  function rot3(v, r) {
    let x = v[0], y = v[1], z = v[2]; if (!r) return [x, y, z];
    if (r.rz) { const c = Math.cos(r.rz), s = Math.sin(r.rz); [x, y] = [x * c - y * s, x * s + y * c] }
    if (r.rx) { const c = Math.cos(r.rx), s = Math.sin(r.rx); [y, z] = [y * c - z * s, y * s + z * c] }
    if (r.ry) { const c = Math.cos(r.ry), s = Math.sin(r.ry); [x, z] = [x * c + z * s, -x * s + z * c] }
    return [x, y, z];
  }
  // свет: E = { amb:[r,g,b], ls:[{pos|dir, col, k, r, aim, spot:[cos0,cos1]}], rim:{dir, col, k}, fog:{col, d0, d1, max} }
  function shade(E, n, p, base, C, gloss) {
    const a = E.amb; let r = base[0] * a[0], g = base[1] * a[1], b = base[2] * a[2];
    const V = nrm3(sub3(C.P, p));
    for (const l of E.ls) {
      let L, at = l.k;
      if (l.pos) { const d = sub3(l.pos, p), dd = Math.hypot(d[0], d[1], d[2]) || 1; L = [d[0] / dd, d[1] / dd, d[2] / dd]; at /= 1 + (dd / (l.r || 300)) ** 2 }
      else L = [-l.dir[0], -l.dir[1], -l.dir[2]];
      if (l.spot) at *= ss(l.spot[0], l.spot[1], -dot3(L, l.aim));
      if (at <= 0) continue;
      const k = dot3(n, L);
      if (k > 0) { r += base[0] * l.col[0] * k * at; g += base[1] * l.col[1] * k * at; b += base[2] * l.col[2] * k * at }
      if (gloss && k > 0) { const H = nrm3(add3(L, V)), sp = Math.pow(Math.max(0, dot3(n, H)), 36) * gloss * at; r += l.col[0] * sp; g += l.col[1] * sp; b += l.col[2] * sp }
    }
    if (E.rim) { const R = E.rim, k = Math.max(0, -dot3(n, R.dir)) * Math.pow(1 - Math.abs(dot3(n, V)), 1.6) * R.k; r += R.col[0] * k; g += R.col[1] * k; b += R.col[2] * k }
    if (E.fog) { const F = E.fog, d = Math.hypot(p[0] - C.x, p[1] - C.y, p[2] - C.z), f = cl((d - F.d0) / (F.d1 - F.d0)) * (F.max ?? 1); r = lp(r, F.col[0], f); g = lp(g, F.col[1], f); b = lp(b, F.col[2], f) }
    return [r, g, b];
  }
  const lum3 = v => v[0] * .3 + v[1] * .59 + v[2] * .11;
  function path2(c, s) { c.beginPath(); c.moveTo(s[0][0], s[0][1]); for (let i = 1; i < s.length; i++) c.lineTo(s[i][0], s[i][1]); c.closePath() }
  // грань: w — 4 точки мира (TL, TR, BR, BL, как видно снаружи), n — нормаль наружу, m — материал
  // m: col, tex (холст), sub (дробление текстуры), gloss, emis (цвет свечения), a, edge (фаска: яркость линии), two (видна с обеих сторон), z (свой порядок), glow (холст свечения)
  function face(F, C, E, w, n, m) {
    const ctr = [(w[0][0] + w[1][0] + w[2][0] + w[3][0]) / 4, (w[0][1] + w[1][1] + w[2][1] + w[3][1]) / 4, (w[0][2] + w[1][2] + w[2][2] + w[3][2]) / 4];
    const vis = dot3(n, sub3(C.P, ctr)) > 0; if (!vis && !m.two) return;
    const q = w.map(p => tc(C, p)); let qq = q;
    if (q[0][2] < ZN || q[1][2] < ZN || q[2][2] < ZN || q[3][2] < ZN) { if (q.every(v => v[2] < ZN)) return; qq = clipN(q); if (qq.length < 3) return }
    const s = qq.map(v => pj(C, v)), z = m.z ?? (q[0][2] + q[1][2] + q[2][2] + q[3][2]) / 4 + (m.dz || 0);
    F.push({ z, f: c => drawFace(c, C, E, w, vis ? n : [-n[0], -n[1], -n[2]], m, s, ctr) });
  }
  function drawFace(c, C, E, w, n, m, s, ctr) {
    path2(c, s);
    if (m.emis) { c.fillStyle = m.emis; c.globalAlpha = m.a ?? 1; c.fill(); c.globalAlpha = 1; if (m.glow) { path2(m.glow, s); m.glow.fillStyle = m.emis; m.glow.globalAlpha = m.ga ?? 1; m.glow.fill(); m.glow.globalAlpha = 1 } return }
    const base = m.tex ? [1, 1, 1] : c3(m.col || '#808080'), g = m.gloss || 0;
    const sh = w.map(p => shade(E, n, p, base, C, g));
    let iM = 0, im = 0; for (let i = 1; i < 4; i++) { if (lum3(sh[i]) > lum3(sh[iM])) iM = i; if (lum3(sh[i]) < lum3(sh[im])) im = i }
    const pM = P3(C, w[iM]), pm = P3(C, w[im]);
    let fill;
    if (pM && pm && iM !== im && Math.hypot(pM[0] - pm[0], pM[1] - pm[1]) > 2) fill = lg(c, pM[0], pM[1], pm[0], pm[1], [[0, css3(sh[iM])], [1, css3(sh[im])]]);
    else fill = css3(shade(E, n, ctr, base, C, g));
    if (!m.tex) { c.fillStyle = fill; c.globalAlpha = m.a ?? 1; c.fill(); c.globalAlpha = 1 }
    else {
      c.save(); c.clip(); c.globalAlpha = m.a ?? 1; texQuad(c, m.tex, C, w, m.sub || 3);
      if (!m.unlit) { path2(c, s); c.globalCompositeOperation = 'multiply'; c.fillStyle = fill; c.fill() }
      c.restore();
      if (m.glow) { m.glow.save(); m.glow.globalAlpha = m.ga ?? 1; m.glow.globalCompositeOperation = 'lighter'; texQuad(m.glow, m.tex, C, w, 2); m.glow.restore() }
    }
    if (m.sheen) {   // глянцевая полоса: смещается от взгляда камеры
      const pA = P3(C, w[0]), pB = P3(C, w[2]);
      if (pA && pB) { const k = cl(.5 + .5 * Math.sin(C.yaw * 3 + (m.sheenP || 0))); c.save(); path2(c, s); c.clip(); c.globalCompositeOperation = 'screen';
        c.fillStyle = lg(c, pA[0], pA[1], pB[0], pB[1], [[0, 'rgba(255,255,255,0)'], [cl(k - .14), 'rgba(255,255,255,0)'], [k, `rgba(255,255,255,${m.sheen})`], [cl(k + .14), 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']]); c.fill(); c.restore() }
    }
    if (m.edge) { path2(c, s); c.strokeStyle = `rgba(255,255,255,${m.edge})`; c.lineWidth = m.ew || 1.4; c.stroke() }
  }
  // текстура на грани с перспективой: сетка n×n, каждая клетка — 2 треугольника с аффинной заливкой
  function texQuad(c, img, C, w, n) {
    const W = img.width, H = img.height, G = [];
    for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) { const u = i / n, v = j / n; G.push(P3(C, lerp3(lerp3(w[0], w[1], u), lerp3(w[3], w[2], u), v))) }
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const a = G[j * (n + 1) + i], b = G[j * (n + 1) + i + 1], d = G[(j + 1) * (n + 1) + i], e = G[(j + 1) * (n + 1) + i + 1];
      if (!a || !b || !d || !e) continue;
      const u0 = i / n * W, u1 = (i + 1) / n * W, v0 = j / n * H, v1 = (j + 1) / n * H;
      tri(c, img, a, b, e, u0, v0, u1, v0, u1, v1); tri(c, img, a, e, d, u0, v0, u1, v1, u0, v1);
    }
  }
  function tri(c, img, p0, p1, p2, u0, v0, u1, v1, u2, v2) {
    const den = u0 * (v1 - v2) + u1 * (v2 - v0) + u2 * (v0 - v1); if (Math.abs(den) < 1e-6) return;
    const mx = (p0[0] + p1[0] + p2[0]) / 3, my = (p0[1] + p1[1] + p2[1]) / 3, ex = p => { const dx = p[0] - mx, dy = p[1] - my, l = Math.hypot(dx, dy) || 1; return [p[0] + dx / l * .9, p[1] + dy / l * .9] };
    const q0 = ex(p0), q1 = ex(p1), q2 = ex(p2);
    const a = (p0[0] * (v1 - v2) + p1[0] * (v2 - v0) + p2[0] * (v0 - v1)) / den, b = (p0[1] * (v1 - v2) + p1[1] * (v2 - v0) + p2[1] * (v0 - v1)) / den;
    const cc = (p0[0] * (u2 - u1) + p1[0] * (u0 - u2) + p2[0] * (u1 - u0)) / den, d = (p0[1] * (u2 - u1) + p1[1] * (u0 - u2) + p2[1] * (u1 - u0)) / den;
    const e = (p0[0] * (u1 * v2 - u2 * v1) + p1[0] * (u2 * v0 - u0 * v2) + p2[0] * (u0 * v1 - u1 * v0)) / den, f = (p0[1] * (u1 * v2 - u2 * v1) + p1[1] * (u2 * v0 - u0 * v2) + p2[1] * (u0 * v1 - u1 * v0)) / den;
    c.save(); c.beginPath(); c.moveTo(q0[0], q0[1]); c.lineTo(q1[0], q1[1]); c.lineTo(q2[0], q2[1]); c.closePath(); c.clip();
    c.transform(a, b, cc, d, e, f); c.drawImage(img, 0, 0); c.restore();
  }
  // коробка: p — центр, s — размеры [w, h, d], r — поворот {rx, ry, rz}, m — материал всех граней, mf — свои материалы граней {f, b, l, r, t, d}, skip — какие грани не рисовать
  const BOXF = [
    ['f', [0, 0, -1], [[-1, 1, -1], [1, 1, -1], [1, -1, -1], [-1, -1, -1]]],
    ['b', [0, 0, 1], [[1, 1, 1], [-1, 1, 1], [-1, -1, 1], [1, -1, 1]]],
    ['l', [-1, 0, 0], [[-1, 1, 1], [-1, 1, -1], [-1, -1, -1], [-1, -1, 1]]],
    ['r', [1, 0, 0], [[1, 1, -1], [1, 1, 1], [1, -1, 1], [1, -1, -1]]],
    ['t', [0, 1, 0], [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]]],
    ['d', [0, -1, 0], [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]]];
  function boxW(b, k, cs) { const h = [b.s[0] / 2, b.s[1] / 2, b.s[2] / 2]; return cs.map(s => { const v = add3(b.p, rot3([s[0] * h[0], s[1] * h[1], s[2] * h[2]], b.r)); if (b.my != null) v[1] = 2 * b.my - v[1]; return v }) }
  function box(F, C, E, b) {
    for (const [k, n, cs] of BOXF) {
      if (b.skip && b.skip.includes(k)) continue;
      const m = Object.assign({}, b.m, b.mf && b.mf[k]);
      const nn = rot3(n, b.r); if (b.my != null) nn[1] = -nn[1]; face(F, C, E, boxW(b, k, cs), nn, m);
    }
  }
  // призма (цилиндр из n граней): низ p, радиус r, высота h; m — материал, top — материал верха
  function prism(F, C, E, p, r, h, n, m, top) {
    for (let i = 0; i < n; i++) {
      const a0 = i / n * TAU, a1 = (i + 1) / n * TAU, am = (a0 + a1) / 2;
      const P = (a, y) => [p[0] + Math.cos(a) * r, p[1] + y, p[2] + Math.sin(a) * r];
      face(F, C, E, [P(a1, h), P(a0, h), P(a0, 0), P(a1, 0)], [Math.cos(am), 0, Math.sin(am)], m);
    }
    if (top) { const T = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; T.push([p[0] + Math.cos(a) * r, p[1] + h, p[2] + Math.sin(a) * r]) } F.push({ z: depth(C, [p[0], p[1] + h, p[2]]) + (top.dz || 0), f: c => { const s = T.map(q => P3(C, q)); if (s.some(v => !v)) return; path2(c, s); c.fillStyle = top.col; c.fill(); if (top.edge) { c.strokeStyle = top.edge; c.lineWidth = top.ew || 2; c.stroke() } } }) }
  }
  // плоский четырёхугольник мира (окна, вывески, пятна света) — сразу в список
  function quad(F, C, w, fill, o = {}) {
    const q = w.map(p => tc(C, p)); if (q.every(v => v[2] < ZN)) return;
    const qq = q.some(v => v[2] < ZN) ? clipN(q) : q; if (qq.length < 3) return;
    const s = qq.map(v => pj(C, v)), z = o.z ?? (q[0][2] + q[1][2] + q[2][2] + q[3][2]) / 4 + (o.dz || 0);
    F.push({ z, f: c => { path2(c, s); c.globalAlpha = o.a ?? 1; if (o.op) c.globalCompositeOperation = o.op; c.fillStyle = typeof fill === 'function' ? fill(c, s) : fill; c.fill(); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; if (o.glow) { path2(o.glow, s); o.glow.fillStyle = o.gcol || (typeof fill === 'string' ? fill : '#fff'); o.glow.globalAlpha = o.ga ?? 1; o.glow.fill(); o.glow.globalAlpha = 1 } } });
  }
  // большая грань — кусками nu × nv (иначе порядок «художника» ломается: средняя глубина огромной стены ≠ глубина там, где она за предметом)
  function faceT(F, C, E, w, n, m, nu, nv) {
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const P = (u, v) => lerp3(lerp3(w[0], w[1], u), lerp3(w[3], w[2], u), v), u0 = i / nu, u1 = (i + 1) / nu, v0 = j / nv, v1 = (j + 1) / nv;
      face(F, C, E, [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)], n, Object.assign({}, m, { edge: 0 }));
    }
  }
  const item = (F, z, f) => F.push({ z, f });
  function draw3(c, F) { F.sort((a, b) => b.z - a.z); for (const it of F) { c.save(); it.f(c); c.restore() } }
  // мягкая тень под предметом на полу y = p[1]
  function cshadow(c, C, p, rx, rz, a = .6) {
    const o = P3(C, p), ex = P3(C, [p[0] + rx, p[1], p[2]]), ez = P3(C, [p[0], p[1], p[2] - rz]); if (!o || !ex || !ez) return;
    const RX = Math.max(4, Math.hypot(ex[0] - o[0], ex[1] - o[1])), RY = Math.max(2, Math.hypot(ez[0] - o[0], ez[1] - o[1]));
    c.save(); c.translate(o[0], o[1]); c.scale(1, RY / RX); c.fillStyle = rg(c, 0, 0, 0, RX * 1.25, [[0, `rgba(0,0,0,${a})`], [.55, `rgba(0,0,0,${a * .55})`], [1, 'rgba(0,0,0,0)']]); c.beginPath(); c.arc(0, 0, RX * 1.25, 0, TAU); c.fill(); c.restore();
  }
  // отражение источника в мокром полу: вертикальная полоса от точки касания вниз до зеркальной точки
  function wet(c, C, p, col, w, a) {
    const d = depth(C, [p[0], 0, p[2]]); if (d < 150) return; a *= ss(150, 700, d);
    const g = P3(C, [p[0], 0, p[2]]), m = P3(C, [p[0], -p[1] * .9, p[2]]); if (!g || !m) return;
    const L = Math.min(700, Math.max(10, m[1] - g[1])), W = Math.max(1.5, w * C.f / Math.max(30, d));
    c.save(); c.globalCompositeOperation = 'screen';
    for (let i = 0; i < 4; i++) {
      const x = m[0] + (H1(i * 7.3 + p[0]) - .5) * W * 2.2, ww = W * (.35 + .5 * H1(i * 3.1 + p[2])), L2 = L * (.55 + .45 * H1(i * 5.7));
      c.fillStyle = lg(c, 0, g[1], 0, g[1] + L2, [[0, rgba(col, a)], [.5, rgba(col, a * .4)], [1, rgba(col, 0)]]);
      c.fillRect(x - ww / 2, g[1], ww, L2);
    }
    c.restore();
  }

  // ================= слои: глубина резкости и свечение =================
  const LY = {};
  function lay(k, sc = 1) {
    let L = LY[k]; if (!L || L.sc !== sc) { L = LY[k] = mk(WW * sc, HH * sc); L.sc = sc; L.x = L.getContext('2d') }
    const x = L.x; x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none'; x.clearRect(0, 0, L.width, L.height); x.setTransform(sc, 0, 0, sc, 0, 0); return x;
  }
  function comp(c, k, blur = 0, op, a = 1) {
    const L = LY[k]; if (!L) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); if (op) c.globalCompositeOperation = op; c.globalAlpha = a;
    c.filter = blur > .4 ? `blur(${blur.toFixed(1)}px)` : 'none'; c.drawImage(L, 0, 0, WW, HH); c.restore();
  }
  // свечение (bloom): слой k размывается дважды и ложится «светом»
  function bloom(c, k, a = 1, r1 = 10, r2 = 34) { comp(c, k, r1, 'lighter', .9 * a); comp(c, k, r2, 'lighter', .75 * a) }
  // «тилт»: резкая полоса по экрану (y0 … y1), выше и ниже — размытие (для столов и бумаги)
  let TILT = null;
  function tiltDOF(c, y0, y1, blur, soft = 260) {
    if (!TILT) TILT = mk(WW / 2, HH / 2); const t = TILT.getContext('2d');
    t.setTransform(1, 0, 0, 1, 0, 0); t.globalCompositeOperation = 'copy'; t.filter = `blur(${(blur / 2).toFixed(1)}px)`; t.drawImage(c.canvas, 0, 0, WW / 2, HH / 2); t.filter = 'none';
    t.globalCompositeOperation = 'destination-out'; t.setTransform(.5, 0, 0, .5, 0, 0);
    t.fillStyle = lg(t, 0, y0 - soft, 0, y1 + soft, [[0, 'rgba(0,0,0,0)'], [soft / (y1 - y0 + 2 * soft), 'rgba(0,0,0,1)'], [1 - soft / (y1 - y0 + 2 * soft), 'rgba(0,0,0,1)'], [1, 'rgba(0,0,0,0)']]);
    t.fillRect(0, y0 - soft, WW, y1 - y0 + 2 * soft);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(TILT, 0, 0, WW, HH); c.restore();
  }

  // ================= текстуры (кэш) =================
  const BXK = {
    mango: { brand: 'ELFBAR', fl: 'МАНГО', c0: '#ffc21a', c1: '#ff5a00', side: '#e8590c', body: '#ff7a1a', led: '#ff6a2a', glow: '#ff9a2a', L: [1, .55, .15] },
    mint: { brand: 'HQD', fl: 'МЯТА', c0: '#3ff5cf', c1: '#0a8a82', side: '#0b7d76', body: '#18c4a6', led: '#3fffd8', glow: '#3ff0d0', L: [.2, 1, .85] },
    cola: { brand: 'waka', fl: 'КОЛА', c0: '#ff3358', c1: '#6e0a1c', side: '#8a0c22', body: '#c8102e', led: '#ff3a5a', glow: '#ff3a5a', L: [1, .2, .3] },
  };
  function fruitArt(x, k, cx, cy, r) {
    x.save(); x.translate(cx, cy);
    if (k === 'mango') {
      x.rotate(-.5); x.fillStyle = rg(x, -r * .3, -r * .3, r * .1, r * 1.2, [[0, '#ffe680'], [.5, '#ffb01a'], [1, '#e8380c']]);
      x.beginPath(); x.ellipse(0, 0, r * .78, r, 0, 0, TAU); x.fill();
      x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.ellipse(-r * .3, -r * .35, r * .16, r * .32, -.3, 0, TAU); x.fill();
      x.fillStyle = lg(x, 0, -r * 1.3, r * .6, -r * .9, [[0, '#2fae4a'], [1, '#0d6a2a']]); x.beginPath(); x.moveTo(0, -r * .95); x.quadraticCurveTo(r * .6, -r * 1.5, r * 1.05, -r * 1.05); x.quadraticCurveTo(r * .5, -r * .95, 0, -r * .95); x.fill();
    } else if (k === 'mint') {
      for (const [a, s] of [[-.55, 1], [.6, .85]]) {
        x.save(); x.rotate(a); x.scale(s, s); x.fillStyle = lg(x, -r * .4, 0, r * .4, 0, [[0, '#7dffb0'], [1, '#0f9a54']]);
        x.beginPath(); x.moveTo(0, r * .95); x.quadraticCurveTo(r * .75, 0, 0, -r * 1.05); x.quadraticCurveTo(-r * .75, 0, 0, r * .95); x.fill();
        x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, r * .9); x.lineTo(0, -r * .95); x.stroke(); x.restore();
      }
      x.fillStyle = 'rgba(220,250,255,.75)'; x.strokeStyle = '#fff'; x.lineWidth = 2; x.save(); x.translate(r * .55, r * .55); x.rotate(.3); x.fillRect(-r * .22, -r * .22, r * .44, r * .44); x.strokeRect(-r * .22, -r * .22, r * .44, r * .44); x.restore();
    } else {
      x.fillStyle = 'rgba(255,255,255,.22)'; rr(x, -r * .55, -r * .95, r * 1.1, r * 1.9, 16); x.fill(); x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 3; x.stroke();
      x.fillStyle = lg(x, 0, -r * .5, 0, r * .9, [[0, '#5a1a0a'], [1, '#1a0603']]); rr(x, -r * .5, -r * .5, r, r * 1.38, 12); x.fill();
      x.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 9; i++) { x.beginPath(); x.arc(-r * .35 + H1(i * 3.7) * r * .7, -r * .4 + H1(i * 5.1) * r * 1.2, 2 + 4 * H1(i), 0, TAU); x.fill() }
      x.fillStyle = 'rgba(220,240,255,.55)'; x.fillRect(-r * .38, -r * .62, r * .34, r * .3); x.fillRect(r * .02, -r * .7, r * .3, r * .3);
    }
    x.restore();
  }
  function lines(x, x0, y0, w, n, gap, col, h = 6, seed = 1) { x.fillStyle = col; for (let i = 0; i < n; i++) { const yy = y0 + i * gap, ww = w * (i === n - 1 ? .55 : .9 + .1 * H1(seed + i)); for (let q = 0; q < ww; q += 13 + 12 * H1(seed * 7 + i * 31 + q)) x.fillRect(x0 + q, yy, Math.min(ww - q, 5 + 15 * H1(seed * 3 + i * 17 + q)), h) } }
  function boxFront(k) {
    return cache('bf' + k, 280, 720, (x, W, H) => {
      const b = BXK[k];
      x.fillStyle = lg(x, 0, 0, W * .5, H, [[0, b.c0], [1, b.c1]]); x.fillRect(0, 0, W, H);
      x.globalAlpha = .1; x.fillStyle = x.createPattern(noiseTex('card', 128, 128, 3, 2), 'repeat'); x.fillRect(0, 0, W, H); x.globalAlpha = 1;
      tx(x, b.brand, W / 2, 96, { f: 'U', w: 800, s: b.brand.length > 4 ? 46 : 62, ls: 1, c: '#fff' });
      x.fillStyle = 'rgba(255,255,255,.8)'; x.fillRect(46, 124, W - 92, 3);
      fruitArt(x, k, W / 2, 268, 86);
      tx(x, b.fl, W / 2, 448, { f: 'O', w: 700, s: 74, ls: 2, c: '#fff' });
      lines(x, 50, 482, W - 100, 3, 17, 'rgba(255,255,255,.55)', 6, 3);
      x.fillStyle = '#fbfbf8'; x.fillRect(18, H - 154, W - 36, 136); x.strokeStyle = '#111'; x.lineWidth = 5; x.strokeRect(28, H - 144, W - 56, 116);
      tx(x, 'WARNING', W / 2, H - 98, { f: 'O', w: 700, s: 42, ls: 2, c: '#111' });
      lines(x, 48, H - 78, W - 96, 3, 15, 'rgba(25,25,25,.6)', 6, 9);
      x.globalCompositeOperation = 'screen'; x.fillStyle = lg(x, 0, 0, W, H * .45, [[0, 'rgba(255,255,255,0)'], [.42, 'rgba(255,255,255,.2)'], [.52, 'rgba(255,255,255,0)']]); x.fillRect(0, 0, W, H);
    });
  }
  function boxSideT(k) {
    return cache('bs' + k, 200, 720, (x, W, H) => {
      const b = BXK[k]; x.fillStyle = lg(x, 0, 0, 0, H, [[0, b.c0], [1, b.side]]); x.fillRect(0, 0, W, H);
      x.save(); x.translate(W / 2, H / 2); x.rotate(-Math.PI / 2); tx(x, b.brand, 0, 22, { f: 'U', w: 800, s: 60, c: 'rgba(255,255,255,.9)' }); x.restore();
      lines(x, 30, H - 120, W - 60, 4, 16, 'rgba(255,255,255,.45)', 6, 5);
    });
  }
  const PKK = { marlboro: { t: 'MARLBORO', bg: '#f5f2ea', top: '#c8102e', ink: '#151515' }, camel: { t: 'CAMEL', bg: '#d9b45e', top: '#c99a3a', ink: '#1d2b5c' }, winston: { t: 'WINSTON', bg: '#f3efe6', top: '#c8102e', ink: '#c8102e' } };
  function packFront(k) {
    return cache('pk' + k, 220, 352, (x, W, H) => {
      const p = PKK[k]; x.fillStyle = p.bg; x.fillRect(0, 0, W, H);
      if (k === 'marlboro') { x.fillStyle = p.top; x.beginPath(); x.moveTo(0, 0); x.lineTo(W, 0); x.lineTo(W, 120); x.lineTo(W / 2, 64); x.lineTo(0, 120); x.closePath(); x.fill() }
      else if (k === 'camel') { x.strokeStyle = '#1d2b5c'; x.lineWidth = 4; x.strokeRect(14, 14, W - 28, H - 28); x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(14, 150, W - 28, 60) }
      else { x.fillStyle = p.top; x.fillRect(0, H - 120, W, 120); x.fillStyle = '#fff'; x.fillRect(0, H - 128, W, 6) }
      tx(x, p.t, W / 2, k === 'marlboro' ? 196 : 196, { f: 'O', w: 700, s: p.t.length > 6 ? 40 : 52, ls: 2, c: p.ink });
      lines(x, 40, 222, W - 80, 2, 14, 'rgba(40,30,20,.45)', 5, k.length);
      x.globalAlpha = .12; x.fillStyle = x.createPattern(noiseTex('card', 128, 128, 3, 2), 'repeat'); x.fillRect(0, 0, W, H); x.globalAlpha = 1;
    });
  }
  function neonSignT() {
    return cache('neonVS', 900, 210, (x, W, H) => {
      x.fillStyle = '#07060c'; x.fillRect(0, 0, W, H);
      x.shadowColor = '#ff2fb0'; x.shadowBlur = 28; tx(x, 'VAPE', 300, 150, { f: 'O', w: 700, s: 150, ls: 10, c: '#ff8ad8' }); tx(x, 'VAPE', 300, 150, { f: 'O', w: 700, s: 150, ls: 10, c: '#ffe2f6', a: .55 });
      x.shadowColor = '#3ff0ff'; x.shadowBlur = 24; tx(x, 'SHOP', 700, 150, { f: 'O', w: 500, s: 120, ls: 16, c: '#8ff8ff' });
      x.shadowBlur = 0; x.strokeStyle = 'rgba(80,240,255,.8)'; x.lineWidth = 4; x.strokeRect(10, 10, W - 20, H - 20);
    });
  }
  function shelfT() {   // стена магазина: полки с коробками (далёкий слой, размывается)
    return cache('shelf', 1024, 640, (x, W, H) => {
      x.fillStyle = '#0b0910'; x.fillRect(0, 0, W, H);
      const cols = ['#ff7a1a', '#18c4a6', '#c8102e', '#ffd21a', '#7a5cff', '#ff4fa8', '#3fa0ff', '#9be15d'];
      for (let r = 0; r < 4; r++) {
        const y = 60 + r * 150; x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(20, y + 104, W - 40, 6);
        for (let i = 0; i < 24; i++) { const bx = 30 + i * 41, h = 70 + 30 * H1(r * 40 + i); x.fillStyle = cols[(i * 3 + r * 5 + (H1(i + r) * 3 | 0)) % cols.length]; x.fillRect(bx, y + 104 - h, 32, h); x.fillStyle = 'rgba(255,255,255,.25)'; x.fillRect(bx, y + 104 - h, 32, 6) }
      }
      x.globalCompositeOperation = 'lighter'; x.fillStyle = lg(x, 0, 0, 0, H, [[0, 'rgba(255,60,170,.0)'], [.5, 'rgba(255,60,170,.12)'], [1, 'rgba(60,220,255,.1)']]); x.fillRect(0, 0, W, H);
    });
  }
  function skyT() {
    return cache('sky1', 512, 1024, (x, W, H) => {
      x.fillStyle = lg(x, 0, 0, 0, H, [[0, '#020308'], [.55, '#0a0f22'], [.85, '#1b1832'], [1, '#2a1e3a']]); x.fillRect(0, 0, W, H);
      const im = x.getImageData(0, 0, W, H), d = im.data;
      for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = fbm(i / 110 + 2, j / 46 + 5, 5), k = cl((v - .45) * 2.2) * (j / H) * .35, p = (j * W + i) * 4; d[p] += 90 * k; d[p + 1] += 70 * k; d[p + 2] += 110 * k }
      x.putImageData(im, 0, 0);
    });
  }

  // ================= сцена 1: квартал → витрина → прилавок (0 … 7,2 с) =================
  // мир — в сантиметрах. Улица вдоль z к магазину (фасады x = ±420); фасад магазина — плоскость z = 0; витрина x ∈ [−250, 250], y ∈ [40, 300];
  // подставка с коробками сразу за стеклом (верх y = 110, z = 24); урна на тротуаре слева у входа, над ней фонарь.
  const S1 = { top: 110, bz: 24, bin: [-330, 0, -70], binR: 26, binH: 76, sx: 420 };
  const S1B = [];   // кварталы по бокам: [сторона, z0, z1, высота, зерно]
  (function () { for (const sd of [-1, 1]) { let z = -4600; let i = 0; while (z < -40) { const L = 420 + 360 * H1(sd * 9 + i * 3.1), z1 = Math.min(-40, z + L); S1B.push([sd, z, z1, 1300 + 1300 * H1(sd * 7 + i * 5.3), sd * 100 + i]); z = z1 + 24; i++ } } })();
  const LAMPS = [[-360, -3600], [360, -3000], [-360, -2400], [360, -1800], [-360, -1200], [360, -620]];
  const ez3 = u => 1 - Math.pow(1 - u, 3.4), eq2 = u => 1 - (1 - u) * (1 - u);
  function camPath(K, t) {
    let i = 0; while (i < K.length - 2 && t >= K[i + 1].t) i++;
    const a = K[i], b = K[i + 1], u = cl((t - a.t) / (b.t - a.t)), k = (b.ez || eio)(u);
    return look(lerp3(a.p, b.p, k), lerp3(a.g, b.g, k), lp(a.f, b.f, k), lp(a.r || 0, b.r || 0, k));
  }
  let S1K = null;
  function s1Keys() {
    const q = Q, z = S1.bz;
    return [
      { t: 0, p: [0, 200, -4400], g: [0, 186, -3400], f: 950 },
      { t: 1.32, p: [0, 129, -40], g: [0, 121, z], f: 1650, ez: eq2 },
      { t: q.zam - .2, p: [8, 128, -34], g: [1, 121, z], f: 1700 },
      { t: q.zam + .28, p: [-236, 128, -205], g: [-330, 66, -70], f: 1350 },
      { t: q.bez - .15, p: [-246, 124, -212], g: [-330, 64, -70], f: 1380 },
      { t: q.parom - .2, p: [0, 129, -26], g: [0, 121, z + 1], f: 1250 },
      { t: q.s1 - .1, p: [0, 128, -20], g: [0, 121, z + 1], f: 1270 },
      { t: q.s1 + 1, p: [0, 128, -16], g: [0, 121, z + 1], f: 1290 },
    ];
  }
  function boxAt(k, t) {   // где коробка: «МАНГО» — с начала, «МЯТА» и «КОЛА» въезжают к «паром»
    if (k === 'mango') return [0, S1.top + 9, S1.bz];
    const q = Q, sd = k === 'mint' ? -1 : 1, t0 = q.parom - .32 + (sd > 0 ? .1 : 0), u = cl((t - t0) / .42), e = u <= 0 ? 0 : u >= 1 ? 1 : 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2);
    return [lp(sd * 62, sd * 11.5, e), S1.top + 9, S1.bz + 3];
  }
  function vapeRise(k, t) { const q = Q, t0 = k === 'mango' ? 1.5 : q.parom + .25 + (k === 'cola' ? .12 : 0); return spr(cl((t - t0) / .7)) }
  function boxAlpha(k, t) { return k === 'mango' ? 1 : cl((t - (Q.parom - .34)) / .12) }
  function s1Light(t) {
    const q = Q, mg = ss(q.mango - .15, q.mango + .2, t) * (1 - .6 * ss(q.myaty - .1, q.myaty + .2, t)), mt = ss(q.myaty - .12, q.myaty + .2, t);
    const ls = [
      { pos: [60, 190, -70], col: [1, .95, .9], k: 1.05, r: 230 },
      { pos: [0, 270, S1.bz], col: [1, .93, .84], k: 2.6, r: 190, aim: [0, -1, 0], spot: [.55, .93] },
      { pos: [-230, 190, 330], col: [1, .25, .65], k: 1.4, r: 260 },
      { pos: [230, 190, 330], col: [.2, .85, 1], k: 1.2, r: 260 },
      { pos: [0, 140, -40], col: [1, .7, .85], k: .5, r: 260 },
      { pos: [-290, 230, -150], col: [1, .82, .6], k: 1.7, r: 200 },
      { dir: [.25, -1, .35], col: [.32, .4, .7], k: .2 },
      { pos: [0, 150, 70], col: BXK.mango.L, k: 2.5 * mg, r: 70 },
      { pos: [-14, 150, 70], col: BXK.mint.L, k: 2.5 * mt, r: 70 },
    ];
    for (const [x, z] of LAMPS) ls.push({ pos: [x * .9, 600, z], col: [1, .78, .5], k: 1.3, r: 330 });
    return { amb: [.06, .065, .1], ls, rim: { dir: nrm3([0, -.25, -1]), col: [1, .45, .75], k: .9 }, fog: { col: [.05, .06, .11], d0: 900, d1: 6200, max: .8 } };
  }
  function s1Scene(c, t, u) {
    const q = Q; if (!S1K) S1K = s1Keys();
    const C = camPath(S1K, t), E = s1Light(t), out = C.z < -1.5, SX = S1.sx;
    const far = lay('far', .5), mid = lay('mid'), glw = lay('glow', .5);
    // небо, земля
    c.drawImage(skyT(), 0, 0, WW, HH * .62);
    const horizon = P3(C, [0, 0, 9000]), hy = horizon ? horizon[1] : HH * .55;
    c.fillStyle = lg(c, 0, hy - 4, 0, HH, [[0, '#17162c'], [.05, '#0b0b17'], [1, '#040409']]); c.fillRect(0, hy - 4, WW, HH);
    c.save(); c.globalAlpha = .12; c.globalCompositeOperation = 'screen'; c.fillStyle = c.createPattern(noiseTex('asph', 256, 256, 3, 2), 'repeat'); c.fillRect(0, hy, WW, HH); c.restore();
    // --- внутри магазина: дальняя стена с полками и неон (дальний слой, размывается) ---
    const FF = [];
    face(FF, C, E, [[-420, 300, 380], [420, 300, 380], [420, 0, 380], [-420, 0, 380]], [0, 0, -1], { tex: shelfT(), sub: 2, z: 1e5 });
    for (const [x, col] of [[-300, '#ff3fb4'], [300, '#3fe8ff']]) quad(FF, C, [[x - 3, 290, 370], [x + 3, 290, 370], [x + 3, 20, 370], [x - 3, 20, 370]], col, { glow: glw, ga: 1, z: 9e4 });
    face(FF, C, E, [[-420, 300, 0], [420, 300, 0], [420, 300, 380], [-420, 300, 380]], [0, -1, 0], { col: '#120f18', z: 2e5 });
    face(FF, C, E, [[-420, 0, 380], [420, 0, 380], [420, 0, 0], [-420, 0, 0]], [0, 1, 0], { col: '#1a1520', gloss: .6, z: 3e5 });
    draw3(far, FF); far.fillStyle = 'rgba(0,0,0,.55)'; far.fillRect(0, 0, WW, HH);
    // --- резкий слой ---
    const F = [];
    // кварталы по бокам: фасад, окна, витрины первых этажей, вывески
    for (const [sd, z0, z1, hgt, sd0] of S1B) {
      const x = sd * SX, n = [-sd, 0, 0], zr = (a, b2) => sd < 0 ? [b2, a] : [a, b2];
      const [za, zb] = zr(z0, z1);
      faceT(F, C, E, [[x, hgt, za], [x, hgt, zb], [x, 0, zb], [x, 0, za]], n, { col: H1(sd0) > .5 ? '#2c2731' : '#23272f' }, Math.ceil((z1 - z0) / 260), Math.ceil(hgt / 420));
      if (Math.min(depth(C, [x, 0, z0]), depth(C, [x, 0, z1])) > 7000) continue;
      for (let y = 420; y < hgt - 150; y += 280) for (let z = z0 + 50; z < z1 - 120; z += 150) {
        const h = H1(sd0 * 13 + y * .31 + z * .07), lit = h > .5, col = lit ? (h > .88 ? '#a8d0ff' : h > .7 ? '#ffd79a' : '#ffbe70') : '#0b0d15';
        const [w0, w1] = zr(z, z + 95);
        quad(F, C, [[x - sd * 2, y + 160, w0], [x - sd * 2, y + 160, w1], [x - sd * 2, y, w1], [x - sd * 2, y, w0]], col, { dz: -2, a: lit ? .95 : .9, glow: lit ? glw : null, ga: .45 });
      }
      const zc = (z0 + z1) / 2, sh = H1(sd0 * 3.3);
      if (sh > .3) {
        const col = sh > .78 ? '#ff5aa8' : sh > .56 ? '#ffd28a' : '#7fe0ff', [w0, w1] = zr(zc - 150, zc + 150);
        quad(F, C, [[x - sd * 2, 240, w0], [x - sd * 2, 240, w1], [x - sd * 2, 30, w1], [x - sd * 2, 30, w0]], col, { dz: -2, a: .5, glow: glw, ga: .8 });
        if (sh > .55) { const [v0, v1] = zr(zc - 110, zc + 110); quad(F, C, [[x - sd * 6, 300, v0], [x - sd * 6, 300, v1], [x - sd * 6, 268, v1], [x - sd * 6, 268, v0]], sh > .78 ? '#ff4fc0' : '#4ff0ff', { dz: -3, glow: glw, ga: 1 }) }
      }
    }
    // фасад магазина: 4 куска вокруг витрины, дверь, вывеска, окна этажей выше
    const fm = { col: '#241e2b', edge: .04 };
    faceT(F, C, E, [[-SX, 1700, 0], [-250, 1700, 0], [-250, 0, 0], [-SX, 0, 0]], [0, 0, -1], fm, 1, 10);
    faceT(F, C, E, [[250, 1700, 0], [SX, 1700, 0], [SX, 0, 0], [250, 0, 0]], [0, 0, -1], fm, 1, 10);
    faceT(F, C, E, [[-250, 1700, 0], [250, 1700, 0], [250, 300, 0], [-250, 300, 0]], [0, 0, -1], fm, 3, 7);
    face(F, C, E, [[-250, 40, 0], [250, 40, 0], [250, 0, 0], [-250, 0, 0]], [0, 0, -1], { col: '#15121a' });
    quad(F, C, [[290, 260, -.5], [400, 260, -.5], [400, 0, -.5], [290, 0, -.5]], '#ffc9e6', { a: .45, glow: glw, ga: .5 });
    face(F, C, E, [[-235, 440, -6], [235, 440, -6], [235, 330, -6], [-235, 330, -6]], [0, 0, -1], { tex: neonSignT(), sub: 2, dz: -3, unlit: true, glow: glw, ga: .9 });
    for (let y = 560; y < 1600; y += 280) for (let x = -380; x < 300; x += 170) { const h = H1(y * .7 + x * .13), lit = h > .55; quad(F, C, [[x, y + 160, -1], [x + 100, y + 160, -1], [x + 100, y, -1], [x, y, -1]], lit ? '#ffcf8a' : '#0b0d15', { dz: -1, a: .9, glow: lit ? glw : null, ga: .45 }) }
    for (const y of [300, 40]) box(F, C, E, { p: [0, y, -3], s: [510, 8, 8], m: { col: '#3a3640', gloss: .6, edge: .12 } });
    // подставка: тумба, стеклянный верх, светодиодная полоса
    const bz = S1.bz;
    box(F, C, E, { p: [0, 53, bz], s: [260, 106, 40], m: { col: '#0d0b12', gloss: .4, edge: .1 }, skip: 't' });
    face(F, C, E, [[-130, S1.top, bz + 20], [130, S1.top, bz + 20], [130, S1.top, bz - 20], [-130, S1.top, bz - 20]], [0, 1, 0], { col: '#050508', gloss: .8, z: depth(C, [0, S1.top, bz]) + 60 });
    quad(F, C, [[-130, S1.top - 1.2, bz - 20.5], [130, S1.top - 1.2, bz - 20.5], [130, S1.top - 1.8, bz - 20.5], [-130, S1.top - 1.8, bz - 20.5]], 'rgba(255,190,235,.75)', { dz: -1, glow: glw, gcol: '#ff7ad0', ga: .45 });
    item(F, depth(C, [0, S1.top, bz]) + 50, c => { const o = P3(C, [0, S1.top, bz]), e = P3(C, [55, S1.top, bz]); if (!o || !e) return; const R = Math.abs(e[0] - o[0]); c.globalCompositeOperation = 'screen'; c.translate(o[0], o[1]); c.scale(1, .3); c.fillStyle = rg(c, 0, 0, 0, R, [[0, 'rgba(255,240,220,.3)'], [1, 'rgba(255,240,220,0)']]); c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill() });
    // коробки и одноразки
    for (const k of ['mango', 'mint', 'cola']) {
      const a = boxAlpha(k, t); if (a <= 0) continue;
      const p = boxAt(k, t), B = { p, s: [7, 18, 5], r: { ry: k === 'mint' ? .32 : k === 'cola' ? -.32 : 0 } }, b = BXK[k];
      const mat = { col: b.side, gloss: .9, edge: .22, a }, mf = { f: { tex: boxFront(k), sub: 3, edge: .3, sheen: .2, a }, l: { tex: boxSideT(k), sub: 2, a }, r: { tex: boxSideT(k), sub: 2, a }, b: { col: b.side, two: true } };
      const zr = depth(C, p);
      // отражение в стекле подставки (зеркально, слабое)
      const RF = []; box(RF, C, E, { p, s: B.s, r: B.r, my: S1.top, m: { col: b.side, a: .16 * a }, mf: { f: { tex: boxFront(k), sub: 2, a: .16 * a } }, skip: 'td' }); for (const it of RF) item(F, zr + 30, it.f);
      box(F, C, E, Object.assign(B, { m: mat, mf, skip: 't' }));
      const W4 = boxW(B, 't', BOXF[4][2]); quad(F, C, W4.map(v => [v[0], v[1] - .3, v[2]]), '#050407', { z: zr + 1.5 });
      { // открытая крышка (петля на заднем верхнем ребре, отогнута назад) и два боковых клапана — регламент п. 22
        const hx = B.s[0] / 2, hy = B.s[1] / 2, hz = B.s[2] / 2, R = v => add3(p, rot3(v, B.r)), th = 1.95, lid = [0, 5 * Math.sin(th), -5 * Math.cos(th)];
        const bl = [-hx, hy, hz], br = [hx, hy, hz], lm = { col: '#a39a88', two: true, edge: .3, a, z: zr + 2.2 };
        face(F, C, E, [R(add3(bl, lid)), R(add3(br, lid)), R(br), R(bl)], rot3([0, -Math.cos(th), Math.sin(th)], B.r), lm);
        for (const sd of [-1, 1]) { const fv = [sd * 1.3, 2.1, 0], f0 = [sd * hx, hy, -hz], f1 = [sd * hx, hy, hz];
          face(F, C, E, [R(add3(f0, fv)), R(add3(f1, fv)), R(f1), R(f0)], rot3([sd * .85, .5, 0], B.r), { col: b.c0, two: true, edge: .3, a, z: zr + .4 }) }
      }
      const rise = vapeRise(k, t);
      if (rise > 0) {
        const fl = boxW(B, 'f', BOXF[0][2]), e0 = P3(C, fl[0]), e1 = P3(C, fl[1]), base = add3(p, [0, -6 + 10 * rise, .5]);
        item(F, zr - 2.6, c => {
          if (!e0 || !e1) return; const dx = e1[0] - e0[0], dy = e1[1] - e0[1], L0 = Math.hypot(dx, dy) || 1, nx = dy / L0, ny = -dx / L0, sg = ny < 0 ? 1 : -1;
          c.beginPath(); c.moveTo(e0[0] - dx * 9, e0[1] - dy * 9); c.lineTo(e1[0] + dx * 9, e1[1] + dy * 9);
          c.lineTo(e1[0] + dx * 9 + nx * sg * 3000, e1[1] + dy * 9 + ny * sg * 3000); c.lineTo(e0[0] - dx * 9 + nx * sg * 3000, e0[1] - dy * 9 + ny * sg * 3000); c.closePath(); c.clip();
          vape3(c, C, base, 14, { body: b.body, label: '', led: .4 + .6 * rise, ledCol: b.led, rim: '#ffc0e8' });
        });
      }
    }
    // лёд и фрукты вокруг коробок
    for (const [x, z, sz, ry, rx] of [[-23, 13, 3.4, .5, .08], [21, 12, 3, -.4, -.06], [-13, 7, 2.6, .9, .1], [27, 22, 2.8, .2, 0]]) {
      box(F, C, E, { p: [x, S1.top + sz / 2 + .05, bz + z - 24 + 3], s: [sz, sz, sz], r: { ry, rx }, m: { col: '#7fb4d6', a: .2, gloss: 2.2, edge: .75, ew: 1.4 } });
      const g = P3(C, [x, S1.top + sz * .8, bz + z - 21]); if (g) item(F, depth(C, [x, S1.top, bz + z - 21]) - 1, c => glowDot(c, g[0], g[1], sz * C.f / Math.max(10, depth(C, [x, S1.top, bz + z - 21])) * .9, '#bfe8ff', .35));
    }
    item(F, depth(C, [-27, S1.top, bz + 9]) + .5, c => mangoPiece(c, C, [-27, S1.top, bz + 9], 8));
    face(F, C, E, [[16, S1.top + .2, bz + 2], [31, S1.top + .2, bz + 4], [31, S1.top + .2, bz - 8], [16, S1.top + .2, bz - 10]], [0, 1, 0], { tex: mintLeaves(), sub: 2, unlit: true, dz: -.5 });
    // урна на тротуаре, пачки сигарет падают в неё
    const BN = S1.bin;
    prism(F, C, E, BN, S1.binR, S1.binH - 5, 18, { col: '#26332d', gloss: .9 }, null);
    prism(F, C, E, [BN[0], BN[1] + S1.binH - 5, BN[2]], S1.binR + .8, 5, 18, { col: '#5d6a63', gloss: 1.4, edge: .12 }, { col: '#030404', edge: 'rgba(200,215,210,.7)', ew: 3, dz: 25 });
    item(F, depth(C, BN) + 60, c => cshadow(c, C, BN, S1.binR * 1.6, S1.binR * 1.6, .75));
    const PK = ['marlboro', 'camel', 'winston'], REST = [[-7, 80, -6, .22, .12, -.08], [8, 79, 2, -.16, -.25, .12], [-1, 80.5, 9, .1, .45, -.16]];
    PK.forEach((k, i) => {
      const t0 = q.zam + .12 + i * .2, uu = (t - t0) / .34; if (uu <= 0) return;
      const r = REST[i], e = uu >= 1 ? 1 : uu * uu, bounce = uu > 1 ? Math.exp(-(uu - 1) * 9) * Math.sin((uu - 1) * 22) * 1.4 : 0;
      const y = lp(240, r[1], e) + bounce, spn = (1 - Math.min(1, e)) * 5;
      box(F, C, E, { p: [BN[0] + r[0], y, BN[2] + r[2]], s: [5.5, 8.8, 2.2], r: { rx: r[3] + spn, ry: r[4] + spn * .6, rz: r[5] + spn * .4 },
        m: { col: PKK[k].bg, gloss: .5, edge: .25 }, mf: { f: { tex: packFront(k), sub: 2, edge: .3 }, b: { tex: packFront(k), sub: 2 } } });
    });
    // фонари
    for (const [x, z] of LAMPS) {
      box(F, C, E, { p: [x, 320, z], s: [10, 640, 10], m: { col: '#15171d', edge: .05 } });
      box(F, C, E, { p: [x * .93, 636, z], s: [60, 8, 10], m: { col: '#15171d' } });
      const hp = [x * .86, 626, z]; quad(F, C, [[hp[0] - 20, hp[1], z - 6], [hp[0] + 20, hp[1], z - 6], [hp[0] + 20, hp[1] - 5, z - 6], [hp[0] - 20, hp[1] - 5, z - 6]], '#fff3d6', { dz: -1, glow: glw, ga: 1 });
    }
    // стекло витрины: блики и капли (капли — «боке» близко к камере)
    if (out) {
      const gd = depth(C, [0, 170, 0]), ga = .35 + .45 * ss(30, 300, -C.z);
      item(F, gd, c => {
        const s = [[-250, 300, 0], [250, 300, 0], [250, 40, 0], [-250, 40, 0]].map(p => P3(C, p)); if (s.some(v => !v)) return;
        path2(c, s); c.save(); c.clip(); c.globalCompositeOperation = 'screen';
        const a = s[0], b = s[2];
        c.fillStyle = lg(c, a[0], a[1], b[0], b[1], [[0, `rgba(150,180,255,${.13 * ga})`], [.35, 'rgba(150,180,255,0)'], [.5, `rgba(255,190,235,${.1 * ga})`], [.58, 'rgba(255,190,235,0)'], [1, `rgba(120,160,255,${.08 * ga})`]]); c.fillRect(0, 0, WW, HH);
        const sc = C.f / Math.max(30, gd);
        for (let i = 0; i < 40; i++) { const dp = P3(C, [-245 + H1(i * 3.3) * 490, 45 + H1(i * 5.9) * 250, -.6]); if (!dp) continue; const r = (1 + 2.6 * H1(i * 2.2)) * sc, yy = dp[1] + ((t * 22 * H1(i) + H1(i * 9) * 30) % 30) * sc * .3;
          c.fillStyle = rg(c, dp[0], yy, r * .2, r, [[0, `rgba(220,235,255,${.05 * ga})`], [.75, `rgba(220,235,255,${.12 * ga})`], [1, 'rgba(220,235,255,0)']]); c.beginPath(); c.arc(dp[0], yy, r, 0, TAU); c.fill() }
        c.restore();
      });
    }
    draw3(mid, F);
    // --- сборка: дальний слой (размыт), отражения в мокром асфальте, резкий слой, свет, свечение ---
    const fb = lp(2, 22, ss(.7, 1.3, t));
    comp(c, 'far', fb);
    if (out) {
      for (const [x, z] of LAMPS) wet(c, C, [x * .86, 626, z], '#ffcf8a', 14, .45);
      wet(c, C, [-120, 385, -8], '#ff5ac8', 30, .3); wet(c, C, [120, 385, -8], '#5af0ff', 30, .25); wet(c, C, [345, 130, -8], '#ffc9e6', 26, .3);
      for (const [x, z] of LAMPS) { const g = P3(C, [x * .86, 0, z]), e = P3(C, [x * .86 + 150, 0, z]); if (g && e) pool(c, g[0], g[1], Math.abs(e[0] - g[0]), Math.abs(e[0] - g[0]) * .22, '#ffcf8a', .5) }
    }
    comp(c, 'mid', 0);
    if (out) for (const [x, z] of LAMPS) { const a = P3(C, [x * .86, 620, z]), b = P3(C, [x * .86, 0, z]); if (a && b) { const len = Math.hypot(b[0] - a[0], b[1] - a[1]); beam(c, a[0], a[1], Math.atan2(-(b[0] - a[0]), b[1] - a[1]), .7, len * 1.05, '#ffd9a0', .5) } }
    { const a = P3(C, [0, 268, bz]), b = P3(C, [0, S1.top, bz]); if (a && b) { const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(-(b[0] - a[0]), b[1] - a[1]); beam(c, a[0], a[1], ang, .6, len * 1.15, '#fff0dc', .7); dust(c, t, a[0], a[1], ang, .6, len * 1.1, 60, 7, .7) } }
    { const a = P3(C, [-300, 232, -150]), b = P3(C, [-330, 0, -70]); if (a && b) { const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(-(b[0] - a[0]), b[1] - a[1]); beam(c, a[0], a[1], ang, .75, len * 1.1, '#ffd9a0', .45 * ss(q.zam - .4, q.zam, t) * (1 - ss(q.bez, q.parom, t))); } }
    // пар из «МАНГО» на «паром»
    if (t > q.parom - .3) {
      const B = boxAt('mango', t), top = P3(C, add3(B, [0, -6 + 10 * vapeRise('mango', t) + 14, 0])), dd = depth(C, B);
      if (top) { const sc = C.f / Math.max(10, dd); smoke(c, t, top[0], top[1], { n: 26, life: 2.2, rise: 46 * sc, sway: 10 * sc, drift: 6 * sc, r0: 1.5 * sc, r1: 16 * sc, a: .55, seed: 77, from: q.parom - .3 }) }
    }
    // вкусы: ореол за коробкой
    for (const [k, t0, t1] of [['mango', q.mango - .15, q.myaty - .1], ['mint', q.myaty - .12, q.s1 + .5]]) {
      const kk = ss(t0, t0 + .25, t) * (1 - ss(t1, t1 + .3, t)); if (kk <= 0) continue;
      const pp = boxAt(k, t), p = P3(C, pp); if (p) { const sc = C.f / Math.max(10, depth(C, pp)); glowDot(glw, p[0], p[1], 24 * sc, BXK[k].glow, .8 * kk) }
    }
    bloom(c, 'glow', 1, 6, 22);
    if (out) rain(c, t, cl(-C.z / 300));
    const spd = t < 1.32 ? 1 - eq2(cl(t / 1.32)) : 0;
    if (spd > .05) zoomBlur(c, spd);
    for (const [t0, t1, dir] of [[q.zam - .2, q.zam + .28, 1], [q.bez - .15, q.parom - .2, -1]]) { const k = Math.sin(Math.PI * cl((t - t0) / (t1 - t0))); if (k > .05) panBlur(c, k * dir) }
  }
  function mangoPiece(c, C, p, w) {
    const a = P3(C, p), b = P3(C, [p[0] + w, p[1], p[2]]); if (!a || !b) return; const W = Math.abs(b[0] - a[0]), H = W * .62;
    c.save(); c.translate(a[0], a[1]);
    c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.ellipse(0, 2, W * .55, H * .14, 0, 0, TAU); c.fill();
    c.beginPath(); c.moveTo(-W / 2, 0); c.bezierCurveTo(-W / 2, -H * 1.05, W / 2, -H * 1.05, W / 2, 0); c.closePath();
    c.fillStyle = rg(c, -W * .15, -H * .7, W * .05, W * .7, [[0, '#fff1a0'], [.35, '#ffc21a'], [.75, '#ff7a1a'], [1, '#b8320c']]); c.fill();
    c.save(); c.clip(); c.strokeStyle = 'rgba(160,60,0,.35)'; c.lineWidth = 1.2; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(i * W * .14, 0); c.lineTo(i * W * .14 + W * .1, -H); c.stroke(); c.beginPath(); c.moveTo(i * W * .14, 0); c.lineTo(i * W * .14 - W * .1, -H); c.stroke() } c.restore();
    c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-W * .18, -H * .62, W * .1, H * .12, -.4, 0, TAU); c.fill();
    c.restore();
  }
  function mintLeaves() {
    return cache('mintL', 300, 260, (x, W, H) => {
      for (const [cx, cy, r, a] of [[110, 140, 78, -.6], [190, 120, 66, .5], [150, 190, 54, 1.4]]) {
        x.save(); x.translate(cx, cy); x.rotate(a);
        x.fillStyle = 'rgba(0,0,0,.35)'; x.beginPath(); x.ellipse(5, 8, r * .5, r * 1.02, 0, 0, TAU); x.fill();
        x.fillStyle = lg(x, -r * .5, 0, r * .5, 0, [[0, '#9cff9a'], [.5, '#3bcf5a'], [1, '#137a33']]);
        x.beginPath(); x.moveTo(0, r); for (let i = 0; i <= 10; i++) { const v = i / 10, yy = lp(r, -r, v), ww = Math.sin(Math.PI * v) * r * .5 * (1 + .06 * (i % 2)); x.lineTo(ww, yy) } for (let i = 10; i >= 0; i--) { const v = i / 10, yy = lp(r, -r, v), ww = Math.sin(Math.PI * v) * r * .5 * (1 + .06 * (i % 2)); x.lineTo(-ww, yy) } x.closePath(); x.fill();
        x.strokeStyle = 'rgba(230,255,220,.7)'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(0, r * .95); x.lineTo(0, -r * .9); x.stroke();
        x.lineWidth = 1.3; for (let i = 1; i < 5; i++) { const yy = lp(r * .7, -r * .7, i / 5); x.beginPath(); x.moveTo(0, yy); x.lineTo(r * .32, yy - r * .22); x.moveTo(0, yy); x.lineTo(-r * .32, yy - r * .22); x.stroke() }
        x.restore();
      }
    });
  }
  // одноразка в 3D: основание p, высота h (см) — 2D-функцией vape в масштабе проекции (столбик всегда «стоит»)
  function vape3(c, C, p, h, o) {
    const a = P3(C, p), b = P3(C, [p[0], p[1] + h, p[2]]); if (!a || !b) return;
    const hp = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[0] - a[0], -(b[1] - a[1]));
    c.save(); c.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2); c.rotate(ang); vape(c, hp, o); c.restore();
  }
  function rain(c, t, a = 1) {
    if (a <= 0) return; c.save(); c.strokeStyle = `rgba(200,215,255,${.22 * a})`; c.lineWidth = 1.6; c.beginPath();
    for (let i = 0; i < 220; i++) { const x = (H1(i * 3.1) * 1300 + t * 160) % 1300 - 110, y = (H1(i * 5.7) * 2200 + t * 2300) % 2200 - 140, L = 30 + 40 * H1(i * 1.7); c.moveTo(x, y); c.lineTo(x - 7, y + L) } c.stroke(); c.restore();
  }
  let PB = null;
  function panBlur(c, k) {   // смаз вбок: копии кадра со сдвигом
    if (!PB) PB = mk(WW / 2, HH / 2); const z = PB.getContext('2d'); z.globalCompositeOperation = 'copy'; z.drawImage(c.canvas, 0, 0, WW / 2, HH / 2);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); for (let i = 1; i <= 5; i++) { c.globalAlpha = .2 * Math.abs(k); c.drawImage(PB, -k * i * 26, 0, WW, HH) } c.restore();
  }
  let ZB = null;
  function zoomBlur(c, k) {
    if (!ZB) ZB = mk(WW / 2, HH / 2); const z = ZB.getContext('2d'); z.globalCompositeOperation = 'copy'; z.drawImage(c.canvas, 0, 0, WW / 2, HH / 2);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over';
    for (let i = 1; i <= 4; i++) { const s = 1 + .035 * k * i; c.globalAlpha = .22 * k; c.drawImage(ZB, WW / 2 - WW * s / 2, HH * .52 - HH * s * .52, WW * s, HH * s) }
    c.restore();
  }

  // ================= заглушки следующих сцен (пишутся дальше) =================
  function stub(c, t, u, name) { c.fillStyle = '#05070c'; c.fillRect(0, 0, WW, HH); tx(c, name, WW / 2, HH / 2, { f: 'O', w: 700, s: 60, c: '#334' }) }

  // ================= сцена 2: рентген одноразки → «табачные гиганты» → табло 2026 → 1973 (7,1 … 13,7 с) =================
  function shopBack(c, a = .55) {   // тот же магазин за спиной — размыт: полки, неон
    c.fillStyle = '#06050a'; c.fillRect(0, 0, WW, HH);
    c.save(); c.globalAlpha = a; c.filter = 'blur(30px)'; c.drawImage(shelfT(), -260, 140, WW + 520, 1000); c.restore();
    glowDot(c, 80, 760, 420, '#ff3fb4', .35); glowDot(c, WW - 60, 700, 420, '#3fe8ff', .3);
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, 'rgba(0,0,0,.25)'], [.55, 'rgba(0,0,0,.2)'], [1, 'rgba(0,0,0,.85)']]); c.fillRect(0, 0, WW, HH);
  }
  function s2Xray(c, t, u) {
    const q = Q;
    shopBack(c);
    // стекло подставки: отражение и светодиод
    const gy = 1520; c.fillStyle = lg(c, 0, gy, 0, HH, [[0, 'rgba(30,20,40,.95)'], [1, '#030205']]); c.fillRect(0, gy, WW, HH - gy);
    c.fillStyle = 'rgba(255,190,235,.55)'; c.fillRect(0, gy - 2, WW, 3); glowDot(c, WW / 2, gy, 520, '#ff7ad0', .18);
    const k = eio(cl(u / 3.2)), sc = lp(1, 1.16, k), h = 1180 * sc, cx = WW / 2 + 10, cy = gy - h / 2 + 30 * sc, sw = q.s1 + .25, sk = eio(cl((t - sw) / 1.35)), scanY = lp(-h / 2 - 50, h / 2 + 20, sk);
    // отражение вейпа в стекле
    c.save(); c.translate(cx, gy); c.scale(1, -.42); c.globalAlpha = .18; c.translate(0, -h / 2); vape(c, h, { body: '#ff7a1a', label: '', led: .8, ledCol: '#ff6a2a', rim: '#ffc0e8' }); c.restore();
    c.save(); c.translate(cx, cy); c.rotate(-.03 + .02 * k);
    c.save(); c.beginPath(); c.rect(-500, scanY, 1000, 3000); c.clip(); vape(c, h, { body: '#ff7a1a', label: '', led: .85, ledCol: '#ff6a2a', rim: '#ffc0e8' }); c.restore();
    if (sk > 0) {
      c.save(); c.beginPath(); c.rect(-500, -3000, 1000, 3000 + scanY); c.clip();
      glowDot(c, 0, 0, h * .6, '#2a8cff', .22); vapeX(c, h, t, { heat: .7 + .3 * ss(q.zhid - .2, q.zhid + .3, t) });
      // жидкость вспыхивает на «жидкость»
      const lk = ss(q.zhid - .15, q.zhid + .35, t); if (lk > 0) { const w = h * .23, t0 = -h / 2 + h * .2 + 10, t1 = -h / 2 + h * .46; glowDot(c, 0, (t0 + t1) / 2, w * 1.6, '#ffb03a', .55 * lk) }
      c.restore();
      // кольцо сканера вокруг корпуса (эллипс — объём)
      if (sk < 1) { const w = h * .23; c.save(); c.strokeStyle = 'rgba(120,230,255,.95)'; c.lineWidth = 4; c.shadowColor = '#4fe0ff'; c.shadowBlur = 26;
        c.beginPath(); c.ellipse(0, scanY, w * .62, w * .14, 0, 0, TAU); c.stroke(); c.restore(); glowDot(c, 0, scanY, w * 1.3, '#4fe0ff', .5);
        c.fillStyle = lg(c, 0, scanY - 140, 0, scanY, [[0, 'rgba(80,220,255,0)'], [1, 'rgba(80,220,255,.16)']]); c.fillRect(-w * .62, scanY - 140, w * 1.24, 140) }
    }
    c.restore();
    // выноска «ЖИДКОСТЬ» — тег как у референсов
    const lk2 = (t - q.zhid + .05) / .3, w0 = h * .23, ty = cy - h / 2 + h * .33;
    if (lk2 > 0) tagR(c, WW / 2 + w0 * .45 + 10, ty, WW - 330, ty - 150, 'СОСТАВ', 'ЖИДКОСТЬ', lk2, '#ffb03a');
    const lk3 = (t - q.vnutri - .1) / .3; if (lk3 > 0) tagR(c, WW / 2 - w0 * .45 - 10, ty + h * .24, 130, ty + h * .24 + 140, 'ВНУТРИ', 'НИКОТИН', lk3, '#4fe0ff', 1);
    bokehNear(c, t, 7);
  }
  // выноска-тег: от точки (x0, y0) линия к плашке (x1, y1); left — плашка слева
  function tagR(c, x0, y0, x1, y1, a, b, k, col, left) {
    if (k <= 0) return; const e = eo(k); c.save(); c.globalAlpha *= cl(k * 2);
    const ex = lp(x0, x1, e), ey = lp(y0, y1, e); c.strokeStyle = rgba(col, .85); c.lineWidth = 2.5; c.beginPath(); c.moveTo(x0, y0); c.lineTo(ex, ey); c.stroke();
    c.fillStyle = col; c.beginPath(); c.arc(x0, y0, 7, 0, TAU); c.fill(); glowDot(c, x0, y0, 34, col, .7);
    if (e > .6) { const kk = (e - .6) / .4, w1 = tw(c, a, { f: 'J', w: 500, s: 19, ls: 4 }), w2 = tw(c, b, { f: 'O', w: 700, s: 40, ls: 2 }), W = Math.max(w1, w2) + 44, H = 96, X = left ? x1 - W + 10 : x1 - 10, Y = y1 - H / 2;
      c.globalAlpha *= kk; c.fillStyle = 'rgba(6,8,14,.82)'; rr(c, X, Y, W, H, 10); c.fill(); c.strokeStyle = rgba(col, .6); c.lineWidth = 1.5; c.stroke();
      tx(c, a, X + 22, Y + 34, { f: 'J', w: 500, s: 19, ls: 4, al: 'left', c: 'rgba(200,210,228,.8)' }); tx(c, b, X + 22, Y + 78, { f: 'O', w: 700, s: 40, ls: 2, al: 'left', c: '#fff' }) }
    c.restore();
  }
  // частицы-боке у самой камеры (передний план размыт — регламент п. 60)
  function bokehNear(c, t, seed, col = '#ffd8a0', n = 10, a = .5) {
    c.save(); c.globalCompositeOperation = 'screen';
    for (let i = 0; i < n; i++) { const x = (H1(seed + i * 3.3) * WW + Math.sin(t * .3 + i) * 30), y = ((H1(seed + i * 7.7) * HH - t * (10 + 25 * H1(i))) % HH + HH) % HH, r = 30 + 90 * H1(seed + i * 1.9);
      c.fillStyle = rg(c, x, y, r * .55, r, [[0, rgba(col, .05 * a)], [.85, rgba(col, .16 * a)], [1, rgba(col, 0)]]); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill() }
    c.restore();
  }
  // «табачные гиганты»: камера ныряет в янтарную жидкость — внутри поднимаются силуэты заводов и башен
  function s2Giants(c, t, u) {
    const q = Q, rise = ss(q.gig - .6, q.gig + .5, t);
    const C = look([0, lp(-10, 20, eio(cl(u / 2.2))), -150], [0, lp(120, 170, eio(cl(u / 2.2))), 200], 1050);
    const E = { amb: [.05, .03, .01], ls: [{ dir: nrm3([.3, -1, .4]), col: [1, .62, .2], k: .5 }], rim: { dir: nrm3([0, -.3, -1]), col: [1, .55, .15], k: 1.6 }, fog: { col: [.42, .2, .03], d0: 120, d1: 900, max: .9 } };
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, '#ffb54a'], [.25, '#c46a12'], [.6, '#5a2a06'], [1, '#1a0b02']]); c.fillRect(0, 0, WW, HH);
    // лучи сверху от поверхности жидкости
    for (let i = 0; i < 5; i++) beam(c, WW * (.12 + .2 * i) + Math.sin(t * .5 + i) * 40, -60, (i - 2) * .08, .18, HH * 1.1, '#ffd890', .5);
    const F = [];
    const G = [[-120, 160, 150, 40, 34], [-30, 300, 260, 34, 30], [60, 230, 200, 30, 26], [150, 340, 300, 40, 34], [-210, 380, 220, 36, 30], [230, 260, 170, 30, 28]];
    G.forEach(([x, z, hgt, w, d], i) => { const y0 = -hgt * (1 - rise) * (.8 + .2 * H1(i)); faceTbox(F, C, E, { p: [x, y0 + hgt / 2, z], s: [w, hgt, d], m: { col: '#1a0d04', edge: .08 } }) });
    for (const [x, z, hgt, r] of [[-90, 230, 330, 9], [10, 360, 380, 10], [100, 300, 300, 8], [190, 420, 400, 11]]) prism(F, C, E, [x, -hgt * (1 - rise), z], r, hgt, 12, { col: '#140a03' }, null);
    draw3(c, F);
    // дым из труб — тёмный, вьётся вверх
    for (const [x, z, hgt] of [[-90, 230, 330], [10, 360, 380], [100, 300, 300], [190, 420, 400]]) { const p = P3(C, [x, hgt - hgt * (1 - rise), z]); if (p && rise > .3) { const sc = C.f / depth(C, [x, hgt, z]); smoke(c, t, p[0], p[1], { n: 18, life: 4, rise: 120 * sc, sway: 30 * sc, drift: 60 * sc, r0: 8 * sc, r1: 60 * sc, a: .22 * rise, seed: x | 0 }) } }
    // пузырьки — передний план
    c.save(); for (let i = 0; i < 40; i++) { const x = H1(i * 3.7) * WW, y = ((H1(i * 5.1) * HH - t * (120 + 200 * H1(i))) % HH + HH) % HH, r = 3 + 14 * H1(i * 1.3) ** 2;
      c.strokeStyle = 'rgba(255,240,200,.55)'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke(); c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(x - r * .35, y - r * .35, r * .25, 0, TAU); c.fill() } c.restore();
    bokehNear(c, t, 19, '#ffe0a0', 8, .8);
    c.fillStyle = rg(c, WW / 2, HH * .45, HH * .2, HH * .8, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(20,8,0,.6)']]); c.fillRect(0, 0, WW, HH);
  }
  function faceTbox(F, C, E, b) {   // коробка-здание: грани кусками (для порядка глубины)
    const h = [b.s[0] / 2, b.s[1] / 2, b.s[2] / 2];
    for (const [k, n, cs] of BOXF) { if (k === 'd') continue; const w = boxW(b, k, cs), len = Math.hypot(...sub3(w[0], w[1])), hh = Math.hypot(...sub3(w[0], w[3])); faceT(F, C, E, w, rot3(n, b.r), b.m, Math.max(1, Math.ceil(len / (b.tile || 40))), Math.max(1, Math.ceil(hh / (b.tile || 40)))) }
  }
  // ---------- металлическое перекидное табло (регламент п. 17, 57) ----------
  function flapT(d, half) {
    return cache('fl' + d + half, 240, 170, (x, W, H) => {
      x.fillStyle = lg(x, 0, 0, 0, H, half ? [[0, '#0b0c10'], [1, '#191b22']] : [[0, '#20232b'], [1, '#121419']]); x.fillRect(0, 0, W, H);
      x.save(); x.beginPath(); x.rect(0, 0, W, H); x.clip(); tx(x, String(d), W / 2, half ? 112 : 282, { f: 'O', w: 700, s: 300, c: '#f2efe6' }); x.restore();
      x.fillStyle = half ? 'rgba(0,0,0,.55)' : 'rgba(255,255,255,.06)'; x.fillRect(0, half ? 0 : H - 6, W, 6);
    });
  }
  function yearAt3(t) { const q = Q; return 2026 - 53 * eio(cl((t - q.p50 + .1) / (q.y73 + .12 - q.p50 + .1))) }
  function s2Rewind(c, t, u) {
    const q = Q, yv = yearAt3(t), Y = Math.ceil(yv - 1e-6), ph = Y - yv, nxt = Y - 1, landed = t >= q.y73 + .12;
    const ds = String(landed ? 1973 : Y).split('').map(Number), dn = String(nxt).split('').map(Number);
    const orb = .3 * Math.sin(u * .55) - .1, C = look([Math.sin(orb) * 98, 16 + 5 * Math.sin(u * .4), -Math.cos(orb) * 98], [0, -1, 0], 1250);
    const E = { amb: [.12, .11, .12], ls: [{ pos: [-60, 90, -80], col: [1, .9, .75], k: 1.6, r: 160 }, { pos: [80, -20, -60], col: [.4, .6, 1], k: .7, r: 140 }], rim: { dir: nrm3([0, -.2, 1]), col: [1, .6, .3], k: 1.2 } };
    // фон: туннель времени — светящиеся кольца летят назад
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, '#0a0604'], [.5, '#120a05'], [1, '#050302']]); c.fillRect(0, 0, WW, HH);
    const glw = lay('glow', .5);
    for (let i = 0; i < 9; i++) { const zz = ((i * 120 - (t - q.p50) * 520 * (landed ? 0 : 1)) % 1080 + 1080) % 1080 + 200, pts = []; for (let a = 0; a <= 48; a++) { const an = a / 48 * TAU; pts.push(P3(C, [Math.cos(an) * 170, Math.sin(an) * 170, zz])) } if (pts.some(p => !p)) continue;
      glw.strokeStyle = i % 3 ? 'rgba(255,150,60,.5)' : 'rgba(120,200,255,.45)'; glw.lineWidth = 3; glw.beginPath(); pts.forEach((p, j) => j ? glw.lineTo(p[0], p[1]) : glw.moveTo(p[0], p[1])); glw.stroke() }
    bloom(c, 'glow', .9, 4, 16);
    const F = [], cw = 13, ch = 18, gap = 2.2, x0 = -(4 * cw + 3 * gap) / 2;
    // корпус: коробка из анодированного металла
    box(F, C, E, { p: [0, 0, 4.5], s: [4 * cw + 3 * gap + 6, ch * 2 + 6, 9], m: { col: '#2b2f37', gloss: 1.2, edge: .25, z: 2e4 }, mf: { f: { col: '#16181d', gloss: .8, edge: .3, z: 2e4 } } });
    for (const sd of [-1, 1]) box(F, C, E, { p: [sd * (2 * cw + 1.5 * gap + 5), 0, 3], s: [3, 10, 6], m: { col: '#4a4f58', gloss: 1.4, edge: .3, z: 1.5e4 } });
    for (let i = 0; i < 4; i++) {
      const xl = x0 + i * (cw + gap), xr = xl + cw, d0 = ds[i], d1 = dn[i], flip = !landed && d0 !== d1, th = flip ? ph * Math.PI : 0, z = -.2;
      const top = flip ? d1 : d0;
      face(F, C, E, [[xl, ch, z], [xr, ch, z], [xr, 0, z], [xl, 0, z]], [0, 0, -1], { tex: flapT(top, 0), sub: 1, edge: .12, z: 1e4 + i });
      face(F, C, E, [[xl, 0, z], [xr, 0, z], [xr, -ch, z], [xl, -ch, z]], [0, 0, -1], { tex: flapT(d0, 1), sub: 1, edge: .12, z: 1e4 + i });
      if (flip) {
        const v = [0, Math.cos(th) * ch, -Math.sin(th) * ch - .3];
        if (th < Math.PI / 2) face(F, C, E, [[xl, v[1], v[2]], [xr, v[1], v[2]], [xr, 0, z - .3], [xl, 0, z - .3]], [0, Math.sin(th), -Math.cos(th)], { tex: flapT(d0, 0), sub: 2, two: true, edge: .2, z: 9e3 });
        else face(F, C, E, [[xl, 0, z - .3], [xr, 0, z - .3], [xr, v[1], v[2]], [xl, v[1], v[2]]], [0, -Math.sin(th), Math.cos(th)], { tex: flapT(d1, 1), sub: 2, two: true, edge: .2, z: 9e3 });
      }
      // ось на петле и тень щели
      quad(F, C, [[xl, .35, z - .4], [xr, .35, z - .4], [xr, -.35, z - .4], [xl, -.35, z - .4]], '#050506', { z: 8e3 });
    }
    draw3(c, F);
    // подпись под табло
    const lc = landed ? '#ff5a3a' : '#9fd0ff'; tx(c, landed ? 'НАЗАД НА 53 ГОДА' : 'ОТМАТЫВАЕМ НАЗАД', WW / 2, 1240, { f: 'J', w: 500, s: 26, ls: 10, c: lc, a: .9 });
    if (landed) { const k = cl((t - q.y73 - .12) / .5); glowDot(c, WW / 2, 960, 700, '#ff5a2a', .35 * (1 - k * .5)) }
    bokehNear(c, t, 31, '#ffb070', 7, .6);
  }

  // ================= сцена 3: 1973 — штаб-квартира «Рейнольдс», заводы, трубы, прожекторы (13,7 … 16,6 с) =================
  // мир — в метрах. Башня ар-деко: каскад из 5 блоков с карнизами и сотнями окон; по бокам заводы с трубами.
  const TWB = [[0, 0, 0, 46, 16, 34], [0, 16, 0, 30, 50, 26], [0, 66, 0, 24, 12, 21], [0, 78, 0, 17, 9, 15], [0, 87, 0, 10, 6, 9]];   // x, y0, z, w, h, d
  const FAC = [[-92, 0, 70, 46, 13, 60], [96, 0, 55, 54, 11, 48], [-150, 0, 160, 60, 15, 50], [160, 0, 150, 60, 14, 46]];
  const CHIM = [[-78, 55, 2.3, 46], [-60, 92, 2, 38], [74, 40, 2.6, 52], [104, 72, 2.1, 44], [-140, 150, 2.4, 50], [150, 140, 2.5, 48]];   // x, z, r, h
  // фасад сеткой ячеек: каждая ячейка — кусок стены и окно в одном элементе (окно не отрывается от своей стены при сортировке)
  function facadeGrid(F, C, E, w, n, m, nu, nv, o) {
    const P = (u, v) => lerp3(lerp3(w[0], w[1], u), lerp3(w[3], w[2], u), v);
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const u0 = i / nu, u1 = (i + 1) / nu, v0 = j / nv, v1 = (j + 1) / nv, cw = [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)];
      const ctr = lerp3(cw[0], cw[2], .5); if (dot3(n, sub3(C.P, ctr)) <= 0) continue;
      const q = cw.map(p => tc(C, p)); if (q.some(v => v[2] < ZN)) continue;
      const s = q.map(v => pj(C, v)), z = (q[0][2] + q[1][2] + q[2][2] + q[3][2]) / 4;
      const hh = H1(o.seed + i * 7.13 + j * 3.71), lit = hh < o.litP;
      const wc = [P(lp(u0, u1, o.mu), lp(v0, v1, o.mv)), P(lp(u1, u0, o.mu), lp(v0, v1, o.mv)), P(lp(u1, u0, o.mu), lp(v1, v0, o.mv)), P(lp(u0, u1, o.mu), lp(v1, v0, o.mv))];
      F.push({ z, f: c => {
        drawFace(c, C, E, cw, n, m, s, ctr);
        const ws = wc.map(p => P3(C, p)); if (ws.some(v => !v)) return;
        path2(c, ws); c.fillStyle = lit ? (hh < o.litP * .2 ? o.colB : o.colA) : o.dark; c.fill();
        if (lit && o.glw) { path2(o.glw, ws); o.glw.fillStyle = o.colA; o.glw.globalAlpha = o.ga ?? .4; o.glw.fill(); o.glw.globalAlpha = 1 }
      } });
    }
  }
  function rjrSignT() {
    return cache('rjrSign', 900, 96, (x, W, H) => {
      x.fillStyle = '#0d0806'; x.fillRect(0, 0, W, H); x.shadowColor = '#ffb24a'; x.shadowBlur = 18;
      tx(x, 'R.J. REYNOLDS TOBACCO COMPANY', W / 2, 66, { f: 'O', w: 700, s: 54, ls: 6, c: '#ffe2b0' });
    });
  }
  function sky73T() {
    return cache('sky73', 512, 1024, (x, W, H) => {
      x.fillStyle = lg(x, 0, 0, 0, H, [[0, '#04050a'], [.45, '#0d0f1a'], [.78, '#2a1c16'], [1, '#4a2c16']]); x.fillRect(0, 0, W, H);
      const im = x.getImageData(0, 0, W, H), d = im.data;
      for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = fbm(i / 90 + 9, j / 38 + 2, 5), k = cl((v - .42) * 2.4) * Math.pow(j / H, 1.6) * .55, p = (j * W + i) * 4; d[p] += 150 * k; d[p + 1] += 90 * k; d[p + 2] += 45 * k }
      x.putImageData(im, 0, 0);
    });
  }
  function towerLight() {
    return { amb: [.05, .045, .05],
      ls: [{ pos: [-16, 1, -26], col: [1, .78, .48], k: 2.8, r: 36 }, { pos: [16, 1, -26], col: [1, .78, .48], k: 2.8, r: 36 }, { pos: [-30, 1, -8], col: [1, .7, .4], k: 1.9, r: 32 },
        { dir: nrm3([.4, -.6, .7]), col: [.35, .45, .75], k: .22 }, { pos: [0, 40, -70], col: [1, .6, .3], k: .55, r: 70 }],
      rim: { dir: nrm3([.2, -.1, -1]), col: [1, .55, .2], k: .9 }, fog: { col: [.1, .07, .05], d0: 90, d1: 560, max: .85 } };
  }
  function towerWorld(F, C, E, t, glw) {
    const q = Q, M = { col: '#463c35', gloss: .25 }, WO = { litP: .36, colA: '#f0a24c', colB: '#ffe2ae', dark: '#100d0e', mu: .24, mv: .2, glw, ga: .35 };
    TWB.forEach(([x, y0, z, w, h, d], bi) => {
      const zf = z - d / 2, xl = x - w / 2;
      facadeGrid(F, C, E, [[xl, y0 + h, zf], [x + w / 2, y0 + h, zf], [x + w / 2, y0, zf], [xl, y0, zf]], [0, 0, -1], M, Math.round(w / 2.2), Math.round(h / 3.3), Object.assign({ seed: bi * 31 }, WO));
      facadeGrid(F, C, E, [[xl, y0 + h, z + d / 2], [xl, y0 + h, zf], [xl, y0, zf], [xl, y0, z + d / 2]], [-1, 0, 0], M, Math.round(d / 2.2), Math.round(h / 3.3), Object.assign({ seed: bi * 57 + 9 }, WO));
      faceT(F, C, E, [[x + w / 2, y0 + h, zf], [x + w / 2, y0 + h, z + d / 2], [x + w / 2, y0, z + d / 2], [x + w / 2, y0, zf]], [1, 0, 0], M, 3, Math.ceil(h / 10));
      faceT(F, C, E, [[xl, y0 + h, z + d / 2], [x + w / 2, y0 + h, z + d / 2], [x + w / 2, y0 + h, zf], [xl, y0 + h, zf]], [0, 1, 0], { col: '#2e2723' }, 3, 3);
      box(F, C, E, { p: [x, y0 + h + .3, z], s: [w + 1.4, .6, d + 1.4], m: { col: '#8a7862', gloss: .6, edge: .3 } });
    });
    box(F, C, E, { p: [0, 96, 0], s: [1.6, 10, 1.6], m: { col: '#9a8a74', gloss: 1, edge: .3 } });
    const on = t > q.rey - .12 ? (t < q.rey + .3 ? (Math.sin(t * 95) > -.2 ? 1 : .15) : 1) : 0;
    if (on > 0) face(F, C, E, [[-16, 14.8, -17.4], [16, 14.8, -17.4], [16, 11.6, -17.4], [-16, 11.6, -17.4]], [0, 0, -1], { tex: rjrSignT(), sub: 2, unlit: true, glow: glw, ga: .9 * on, a: on, dz: -.6 });
    FAC.forEach(([x, y0, z, w, h, d], fi) => {
      const zf = z - d / 2;
      facadeGrid(F, C, E, [[x - w / 2, y0 + h, zf], [x + w / 2, y0 + h, zf], [x + w / 2, y0, zf], [x - w / 2, y0, zf]], [0, 0, -1], { col: '#2d2723' }, Math.round(w / 3.4), 2, { seed: 300 + fi * 17, litP: .62, colA: '#ff9a3a', colB: '#ffd08a', dark: '#141011', mu: .18, mv: .25, glw, ga: .5 });
      for (const sd of [-1, 1]) faceT(F, C, E, sd < 0 ? [[x - w / 2, y0 + h, z + d / 2], [x - w / 2, y0 + h, zf], [x - w / 2, y0, zf], [x - w / 2, y0, z + d / 2]] : [[x + w / 2, y0 + h, zf], [x + w / 2, y0 + h, z + d / 2], [x + w / 2, y0, z + d / 2], [x + w / 2, y0, zf]], [sd, 0, 0], { col: '#28221f' }, 3, 1);
      faceT(F, C, E, [[x - w / 2, y0 + h, z + d / 2], [x + w / 2, y0 + h, z + d / 2], [x + w / 2, y0 + h, zf], [x - w / 2, y0 + h, zf]], [0, 1, 0], { col: '#1d1816' }, 3, 3);
    });
    for (const [x, z, r, h] of CHIM) { prism(F, C, E, [x, 0, z], r, h, 12, { col: '#4a3b31', gloss: .3 }, { col: '#0a0605' }); box(F, C, E, { p: [x, h - 3, z], s: [r * 2.3, .8, r * 2.3], m: { col: '#6a5442', edge: .2 } }) }
  }
  function towerBeams(c, C, t, a = 1) {
    for (const [x, z, ph] of [[-34, -34, 0], [36, -30, 1.9], [-70, 40, 3.1]]) {
      const g = P3(C, [x, 0, z]); if (!g) continue; const ang = Math.PI + .28 * Math.sin(t * .55 + ph) + (x < 0 ? .12 : -.12);
      beam(c, g[0], g[1], ang, .1, HH * 1.4, '#ffe6b8', .5 * a); glowDot(c, g[0], g[1], 60, '#fff0d0', .6 * a);
    }
  }
  function towerSmoke(c, C, t, a = 1) {
    for (const [x, z, r, h] of CHIM) { const p = P3(C, [x, h, z]); if (!p) continue; const sc = C.f / Math.max(5, depth(C, [x, h, z]));
      smoke(c, t, p[0], p[1], { n: 22, life: 6, rise: 26 * sc, sway: 5 * sc, drift: 22 * sc, r0: 2 * sc, r1: 14 * sc, a: .2 * a, seed: (x * 7) | 0 }) }
  }
  function towerOutside(c, C, t, glw, o = {}) {   // небо, город, башня, заводы, дым, прожекторы — одной функцией (и для кабинета за окном)
    c.drawImage(sky73T(), 0, 0, WW, HH);
    const hz = P3(C, [0, 0, 3000]); const hy = hz ? hz[1] : HH * .7;
    c.fillStyle = lg(c, 0, hy - 30, 0, HH, [[0, '#2a1c14'], [.08, '#120c09'], [1, '#050302']]); c.fillRect(0, hy - 30, WW, HH);
    // дальний город — огоньки у горизонта
    c.save(); c.globalCompositeOperation = 'screen'; for (let i = 0; i < 160; i++) { const p = P3(C, [(H1(i * 3.3) - .5) * 1600, 2 + 18 * H1(i * 5.1) ** 2, 500 + 1500 * H1(i * 7.7)]); if (!p) continue; c.fillStyle = `rgba(255,${170 + 60 * H1(i) | 0},110,${.25 + .5 * H1(i * 2.2)})`; c.fillRect(p[0], p[1], 2.5, 2.5) } c.restore();
    towerBeams(c, C, t, o.beams ?? 1);
    const E = towerLight(), F = []; towerWorld(F, C, E, t, glw); draw3(c, F);
    towerSmoke(c, C, t, o.smoke ?? 1);
    // низкий туман
    c.save(); c.globalAlpha = .5; smoke(c, t, WW * .3, hy + 40, { n: 10, life: 14, rise: 30, sway: 200, drift: 120, r0: 260, r1: 520, a: .18, seed: 9 }); smoke(c, t, WW * .75, hy + 60, { n: 10, life: 14, rise: 30, sway: 200, drift: -120, r0: 260, r1: 520, a: .16, seed: 21 }); c.restore();
  }
  function s3Tower(c, t, u) {
    const q = Q, k = eio(cl(u / 3)), C = look([lp(-50, -42, k), lp(1.4, 13, k), lp(-112, -95, k)], [0, lp(34, 50, k), 0], lp(980, 1040, k));
    const glw = lay('glow', .5);
    towerOutside(c, C, t, glw);
    bloom(c, 'glow', 1, 5, 20);
    // отражения окон и вывески в мокрой площади
    for (const [x, y] of [[-10, 12], [10, 12], [0, 40], [-14, 60]]) wet(c, C, [x, y, -18], '#ffb658', .9, .35);
    bokehNear(c, t, 41, '#ffc080', 6, .5);
  }

  // ================= сцена 4: кабинет 1973 — стол у окна; пачки CAMEL и WINSTON; записка, штамп, рука с маркером (16,6 … 26,8 с) =================
  // мир — в сантиметрах: верх стола y = 0, x ∈ [−95, 95], z ∈ [−45, 75]; окно в стене z = 150 (за ним — башня «Рейнольдс», размыта)
  const MEMO = { p: [4, .06, 6], ry: -.07, w: 21, h: 29.7, tw: 840, th: 1188 };
  function memoW(u, v, y = .06) {
    const x = (u - .5) * MEMO.w, z = (.5 - v) * MEMO.h, c0 = Math.cos(MEMO.ry), s0 = Math.sin(MEMO.ry);
    return [MEMO.p[0] + x * c0 + z * s0, y, MEMO.p[2] - x * s0 + z * c0];
  }
  const MEMOL = { hl: null };
  function memoT() {
    return cache('memo73', MEMO.tw, MEMO.th, (x, W, H) => {
      x.fillStyle = lg(x, 0, 0, W, H, [[0, '#efe5c8'], [.6, '#e6d9b4'], [1, '#d6c69c']]); x.fillRect(0, 0, W, H);
      x.globalAlpha = .22; x.fillStyle = x.createPattern(noiseTex('pap', 256, 256, 9, 3), 'repeat'); x.fillRect(0, 0, W, H); x.globalAlpha = 1;
      x.fillStyle = 'rgba(120,80,30,.07)'; for (let i = 0; i < 7; i++) { x.beginPath(); x.ellipse(H1(i * 3.3) * W, H1(i * 7.1) * H, 30 + 70 * H1(i), 20 + 50 * H1(i * 2), H1(i) * 3, 0, TAU); x.fill() }
      x.fillStyle = rg(x, W / 2, H / 2, W * .35, W * .95, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(90,60,20,.28)']]); x.fillRect(0, 0, W, H);
      const ink = '#23201b', T = (s, y, o = {}) => tx(x, s, o.x ?? 70, y, Object.assign({ f: 'J', w: 500, s: 19, al: 'left', c: ink }, o));
      T('R.J. REYNOLDS TOBACCO COMPANY', 88, { w: 700, s: 30, ls: 3 }); T('WINSTON-SALEM, NORTH CAROLINA', 116, { s: 15, ls: 2, c: 'rgba(35,32,27,.75)' });
      x.fillStyle = ink; x.fillRect(70, 132, W - 140, 3);
      T('RESEARCH PLANNING MEMORANDUM', 184, { w: 700, s: 25, ls: 1 });
      T('DATE:     February 2, 1973', 226); T('FROM:     C. E. Teague, Jr.', 254);
      T('SUBJECT:  Some Thoughts About New Brands of', 282); T('          Cigarettes for the Youth Market', 308);
      x.fillRect(70, 330, W - 140, 2);
      lines(x, 70, 372, W - 140, 6, 30, 'rgba(40,36,30,.5)', 11, 21);
      // ключевая фраза — читается
      const L1 = 'Realistically, if our Company is to survive and', L2a = 'prosper, over the long term, ', L2b = 'we must get our share', L3 = 'of the youth market.';
      T(L1, 566, { s: 20 }); T(L2a + L2b, 604, { s: 20 }); T(L3, 642, { s: 20 });
      font(x, { f: 'J', w: 500, s: 20 }); const a2 = x.measureText(L2a).width, b2 = x.measureText(L2b).width, c3 = x.measureText(L3).width;
      MEMOL.hl = [[70 + a2 - 4, 70 + a2 + b2 + 6, 604], [70 - 4, 70 + c3 + 4, 642]];
      lines(x, 70, 690, W - 140, 7, 30, 'rgba(40,36,30,.5)', 11, 57);
      // подпись пером
      x.save(); x.strokeStyle = 'rgba(20,30,90,.85)'; x.lineWidth = 2.6; x.lineCap = 'round'; x.beginPath(); x.moveTo(470, 1040);
      x.bezierCurveTo(500, 990, 520, 1060, 545, 1012); x.bezierCurveTo(560, 985, 575, 1050, 600, 1020); x.bezierCurveTo(625, 990, 640, 1040, 690, 1010); x.bezierCurveTo(720, 995, 740, 1030, 770, 1000); x.stroke(); x.restore();
      T('C. E. Teague, Jr.', 1080, { x: 470, s: 17 });
      T('RJR  ·  CONFIDENTIAL', 1150, { s: 14, ls: 4, c: 'rgba(35,32,27,.55)' });
    });
  }
  function stampT() {
    return cache('stampSek', 520, 190, (x, W, H) => {
      x.strokeStyle = '#c4161c'; x.fillStyle = '#c4161c'; x.lineWidth = 10; rr(x, 12, 12, W - 24, H - 24, 14); x.stroke(); x.lineWidth = 4; rr(x, 30, 30, W - 60, H - 60, 8); x.stroke();
      tx(x, 'СЕКРЕТНО', W / 2, H / 2 + 34, { f: 'O', w: 700, s: 96, ls: 10, c: '#c4161c' });
      x.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 900; i++) { x.globalAlpha = .3 + .7 * H1(i * 1.7); x.fillRect(H1(i * 3.1) * W, H1(i * 5.3) * H, 1 + 4 * H1(i * 2.2), 1 + 3 * H1(i * 9.9)) }
    });
  }
  function dossierT() {
    return cache('dossier', 480, 320, (x, W, H) => {
      x.fillStyle = lg(x, 0, 0, 0, H, [[0, '#f4ecd6'], [1, '#e2d4b0']]); x.fillRect(0, 0, W, H);
      x.fillStyle = '#b8241c'; x.fillRect(0, 0, W, 16);
      tx(x, 'ДОСЬЕ № 1', 28, 76, { f: 'O', w: 700, s: 46, ls: 3, al: 'left', c: '#1d1a16' });
      tx(x, 'АВТОР: К. Э. ТИГ', 28, 136, { f: 'J', w: 700, s: 24, al: 'left', c: '#2a2620' });
      tx(x, 'R.J. REYNOLDS · ИССЛЕДОВАНИЯ', 28, 180, { f: 'J', w: 500, s: 21, al: 'left', c: '#2a2620' });
      tx(x, '02.02.1973', 28, 236, { f: 'J', w: 700, s: 30, al: 'left', c: '#b8241c' });
      x.strokeStyle = 'rgba(30,25,20,.35)'; x.lineWidth = 2; x.strokeRect(8, 8, W - 16, H - 16);
    });
  }
  function clipT() {   // стальная скрепка: двойная петля, блик на изгибе
    return cache('clip', 120, 300, (x, W, H) => {
      const path = (o) => { x.beginPath(); x.moveTo(W / 2 + 18 - o, H - 30); x.lineTo(W / 2 + 18 - o, 40 + o); x.arc(W / 2 - o * .2, 40 + o, 18 - o * .8, 0, Math.PI, true); x.lineTo(W / 2 - 18 + o * .6, H - 70 + o); x.arc(W / 2 - 4, H - 70 + o, 14 - o * .3, Math.PI, 0, true); x.lineTo(W / 2 + 10 - o * .2, 80) };
      x.lineCap = 'round'; x.lineJoin = 'round';
      x.strokeStyle = 'rgba(0,0,0,.45)'; x.lineWidth = 9; x.save(); x.translate(4, 6); path(0); x.stroke(); x.restore();
      x.strokeStyle = lg(x, 0, 0, W, 0, [[0, '#5d6670'], [.4, '#e9f0f7'], [.6, '#9aa6b2'], [1, '#4b545e']]); x.lineWidth = 7; path(0); x.stroke();
      x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 2; x.beginPath(); x.arc(W / 2, 40, 16, Math.PI * 1.1, Math.PI * 1.6); x.stroke();
    });
  }
  function camelPath(x) {   // силуэт верблюда (для пачки CAMEL)
    x.beginPath(); x.moveTo(-60, 40); x.lineTo(-58, 0); x.bezierCurveTo(-60, -20, -48, -30, -36, -28); x.bezierCurveTo(-30, -60, -8, -62, -2, -34); x.bezierCurveTo(4, -50, 22, -52, 26, -30);
    x.bezierCurveTo(34, -32, 40, -40, 44, -58); x.bezierCurveTo(46, -70, 58, -72, 64, -64); x.lineTo(70, -60); x.lineTo(62, -54); x.bezierCurveTo(56, -40, 52, -22, 42, -10);
    x.bezierCurveTo(40, 6, 40, 20, 42, 40); x.lineTo(34, 40); x.lineTo(32, 6); x.lineTo(24, 6); x.lineTo(22, 40); x.lineTo(14, 40); x.lineTo(12, 2); x.bezierCurveTo(-4, 4, -24, 4, -34, 0);
    x.lineTo(-36, 40); x.lineTo(-44, 40); x.lineTo(-46, 2); x.lineTo(-50, 2); x.lineTo(-52, 40); x.closePath();
  }
  function eaglePath(x) {   // силуэт орла (для пачки WINSTON)
    x.beginPath(); x.moveTo(0, -46); x.bezierCurveTo(8, -46, 10, -36, 6, -30); x.lineTo(14, -26); x.lineTo(6, -24); x.bezierCurveTo(30, -34, 60, -40, 86, -30); x.bezierCurveTo(70, -26, 60, -18, 52, -14);
    x.bezierCurveTo(64, -14, 74, -10, 80, -4); x.bezierCurveTo(56, -2, 34, 0, 20, 6); x.lineTo(14, 30); x.lineTo(24, 46); x.lineTo(0, 38); x.lineTo(-24, 46); x.lineTo(-14, 30); x.lineTo(-20, 6);
    x.bezierCurveTo(-34, 0, -56, -2, -80, -4); x.bezierCurveTo(-74, -10, -64, -14, -52, -14); x.bezierCurveTo(-60, -18, -70, -26, -86, -30); x.bezierCurveTo(-60, -40, -30, -34, -6, -24);
    x.bezierCurveTo(-10, -34, -8, -46, 0, -46); x.closePath();
  }
  function pack73T(k) {
    return cache('p73' + k, 220, 352, (x, W, H) => {
      if (k === 'camel') {
        x.fillStyle = lg(x, 0, 0, 0, H, [[0, '#e2be6a'], [1, '#c99c42']]); x.fillRect(0, 0, W, H);
        x.strokeStyle = '#1d2b5c'; x.lineWidth = 4; x.strokeRect(12, 12, W - 24, H - 24);
        x.save(); x.translate(W / 2, 168); x.scale(1.05, 1.05); camelPath(x); x.fillStyle = '#7a5520'; x.fill(); x.restore();
        x.fillStyle = 'rgba(70,140,60,.8)'; x.fillRect(30, 214, 40, 6); x.fillRect(150, 214, 40, 6);
        tx(x, 'CAMEL', W / 2, 92, { f: 'O', w: 700, s: 54, ls: 4, c: '#1d2b5c' });
        tx(x, 'TURKISH & DOMESTIC BLEND', W / 2, 262, { f: 'J', w: 700, s: 12, ls: 1, c: '#1d2b5c' });
      } else {
        x.fillStyle = '#f4f1ea'; x.fillRect(0, 0, W, H); x.fillStyle = '#c8102e'; x.fillRect(0, 0, W, 64); x.fillRect(0, H - 64, W, 64);
        x.save(); x.translate(W / 2, 156); x.scale(.95, .95); eaglePath(x); x.fillStyle = '#c8102e'; x.fill(); x.restore();
        tx(x, 'WINSTON', W / 2, 252, { f: 'O', w: 700, s: 44, ls: 4, c: '#c8102e' });
        tx(x, 'FILTER CIGARETTES', W / 2, 46, { f: 'J', w: 700, s: 13, ls: 3, c: '#fff' });
      }
      x.globalAlpha = .12; x.fillStyle = x.createPattern(noiseTex('card', 128, 128, 3, 2), 'repeat'); x.fillRect(0, 0, W, H); x.globalAlpha = 1;
      x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(0, 0, 18, H);
    });
  }
  function woodT() {
    return cache('wood73', 1024, 512, (x, W, H) => {
      const im = x.createImageData(W, H), d = im.data;
      for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const g = fbm(i / 260 + 3, j / 9 + 1, 4), r = .5 + .5 * Math.sin(j / 5.5 + g * 9), v = .55 + .45 * g, p = (j * W + i) * 4;
        d[p] = (66 + 40 * v + 18 * r) | 0; d[p + 1] = (38 + 24 * v + 10 * r) | 0; d[p + 2] = (20 + 12 * v + 5 * r) | 0; d[p + 3] = 255 }
      x.putImageData(im, 0, 0);
    });
  }
  function officeLight(t) {
    return { amb: [.08, .07, .07], ls: [
      { pos: [-46, 30, 42], col: [1, .82, .55], k: 2.6, r: 70, aim: nrm3([.55, -1, -.45]), spot: [.2, .75] },
      { pos: [0, 120, 150], col: [.55, .6, .85], k: .5, r: 260 },
      { pos: [60, 60, -60], col: [1, .9, .8], k: .35, r: 200 },
      { pos: [-14, 26, -50], col: [1, .9, .78], k: 1.1 * (1 - ss(Q.gotov, Q.gotov + .4, t)), r: 70 }],
      rim: { dir: nrm3([0, -.2, -1]), col: [1, .7, .4], k: .8 }, fog: null };
  }
  let S4K = null;
  function s4Keys() {
    const q = Q;
    return [
      { t: q.y73 + 2.8, p: [-12, 21, -46], g: [-24, 8, -2], f: 1450 },
      { t: q.gotov - .15, p: [-14, 19, -40], g: [-25, 7, -3], f: 1520 },
      { t: q.gotov + .3, p: [5, 45, -15], g: [4, 0, 7], f: 1150 },
      { t: q.zvuch, p: [5, 42, -20], g: [4, 0, 9], f: 1220 },
      { t: q.s4 - .1, p: [7, 25, -15], g: [5, 0, 3.5], f: 1300 },
      { t: q.e4 + .8, p: [10, 22, -12], g: [7, 0, 3], f: 1340 },
    ];
  }
  function packFall(t, t0, rest) { const u = (t - t0) / .4; if (u <= 0) return null; const e = u >= 1 ? 1 : u * u, b = u > 1 ? Math.exp(-(u - 1) * 8) * Math.sin((u - 1) * 20) * 1.2 : 0, sp = (1 - Math.min(1, e)) * 4; return { y: lp(60, rest, e) + b, sp } }
  function s4Office(c, t, u) {
    const q = Q; if (!S4K) S4K = s4Keys();
    const C = camPath(S4K, t), E = officeLight(t), glw = lay('glow', .5), far = lay('far', .5), mid = lay('mid');
    // за окном: башня «Рейнольдс» ночью (свой мир, в метрах), размыто
    const wc = P3(C, [0, 115, 150]) || [WW / 2, HH * .3], CO = look([-70, 42, -230], [0, 44, 0], 1050 * lp(1, 1.06, cl(u / 8)), 0, { cx: wc[0], cy: wc[1] });
    towerOutside(far, CO, t, glw, { beams: .8 });
    // комната и стол
    const F = [], WZ = 150, wm = { col: '#22170f', gloss: .2 };
    faceT(F, C, E, [[-260, 260, WZ], [-110, 260, WZ], [-110, -90, WZ], [-260, -90, WZ]], [0, 0, -1], wm, 1, 4);
    faceT(F, C, E, [[110, 260, WZ], [260, 260, WZ], [260, -90, WZ], [110, -90, WZ]], [0, 0, -1], wm, 1, 4);
    faceT(F, C, E, [[-110, 260, WZ], [110, 260, WZ], [110, 210, WZ], [-110, 210, WZ]], [0, 0, -1], wm, 2, 1);
    faceT(F, C, E, [[-110, 30, WZ], [110, 30, WZ], [110, -90, WZ], [-110, -90, WZ]], [0, 0, -1], wm, 2, 2);
    for (const x of [-110, -37, 37, 110]) box(F, C, E, { p: [x, 120, WZ - 2], s: [5, 180, 6], m: { col: '#120c08', edge: .12 } });
    for (const y of [30, 120, 210]) box(F, C, E, { p: [0, y, WZ - 2], s: [225, 5, 6], m: { col: '#120c08', edge: .12 } });
    // стол: дерево, лак
    face(F, C, E, [[-95, 0, 75], [95, 0, 75], [95, 0, -45], [-95, 0, -45]], [0, 1, 0], { tex: woodT(), sub: 6, gloss: .5, z: 5e3 });
    box(F, C, E, { p: [0, -2.5, 15], s: [190, 5, 120], m: { col: '#3a2414', gloss: .6, edge: .15 }, skip: 't', mf: { f: { col: '#2a190e', edge: .3 } } });
    // лампа банкира (зелёный абажур) — слева сзади
    prism(F, C, E, [-52, 0, 44], 7, 2, 14, { col: '#9a7a3a', gloss: 1.4 }, { col: '#b8944a' });
    box(F, C, E, { p: [-52, 13, 44], s: [1.2, 24, 1.2], m: { col: '#b8944a', gloss: 1.4 } });
    box(F, C, E, { p: [-46, 27, 40], s: [26, 6, 10], r: { ry: -.5, rz: -.08 }, m: { col: '#0f5a34', gloss: 2, edge: .35 } });
    quad(F, C, [[-58, 23.8, 46], [-34, 23.8, 34], [-34, 23.8, 30], [-58, 23.8, 40]].map(p => [p[0], p[1], p[2]]), '#fff1c8', { glow: glw, ga: .9, dz: -2 });
    // пепельница (гранёное стекло) с сигаретой
    const AX = [44, 0, 34];
    prism(F, C, E, AX, 8, 2.6, 8, { col: '#a9c6d6', a: .38, gloss: 2.4, edge: .55, ew: 1.2 }, { col: 'rgba(20,24,28,.85)', edge: 'rgba(220,240,255,.6)', ew: 1.5, dz: 3 });
    item(F, depth(C, AX) + 6, c2 => cshadow(c2, C, AX, 11, 11, .5));
    box(F, C, E, { p: [AX[0] - 4, 3.1, AX[2] - 2], s: [8, .85, .85], r: { ry: .5, rz: -.12 }, m: { col: '#f2ede2', gloss: .6, edge: .2 } });
    box(F, C, E, { p: [AX[0] - 8.5, 2.8, AX[2] + .5], s: [2.4, .88, .88], r: { ry: .5, rz: -.12 }, m: { col: '#d99a4a', gloss: .4 } });
    // пачки CAMEL и WINSTON падают на стол
    for (const [k, t0, x, z, ry] of [['camel', q.camel - .3, -31, -4, -.12], ['winston', q.winston - .3, -18, 2, -.3]]) {
      const fl = packFall(t, t0, 4.4); if (!fl) continue;
      box(F, C, E, { p: [x, fl.y, z], s: [5.5, 8.8, 2.2], r: { ry: ry + fl.sp, rx: fl.sp * .3 }, m: { col: k === 'camel' ? '#c99c42' : '#f4f1ea', gloss: .8, edge: .3 }, mf: { f: { tex: pack73T(k), sub: 2, edge: .35, sheen: .18 }, b: { tex: pack73T(k), sub: 2 } } });
      item(F, depth(C, [x, 0, z]) + 3, c2 => cshadow(c2, C, [x, 0, z], 5, 3, .55 * cl((fl.y - 4.4) < 3 ? 1 : .4)));
    }
    // лист записки, досье на скрепке, штамп, маркер
    const mw = [memoW(0, 0), memoW(1, 0), memoW(1, 1), memoW(0, 1)];
    item(F, depth(C, MEMO.p) + 2.5, c2 => { const s = mw.map(p => P3(C, [p[0] + .5, 0, p[2] - .6])); if (s.some(v => !v)) return; c2.filter = 'blur(6px)'; path2(c2, s); c2.fillStyle = 'rgba(0,0,0,.45)'; c2.fill(); c2.filter = 'none' });
    face(F, C, E, mw, [0, 1, 0], { tex: memoT(), sub: 8, z: depth(C, MEMO.p) + 2 });
    // маркер по ключевой фразе: полупрозрачный жёлтый (умножение) — регламент п. 40, 41
    const hk = cl((t - q.qt[0] + .05) / (q.qtB[6] + .1 - q.qt[0])), segs = MEMOL.hl;
    if (hk > 0 && segs) {
      const L1 = segs[0][1] - segs[0][0], L2 = segs[1][1] - segs[1][0], tot = L1 + L2, dist = hk * tot;
      segs.forEach((sg, i) => {
        const len = i === 0 ? Math.min(L1, dist) : Math.max(0, dist - L1); if (len <= 0) return;
        const u0 = sg[0] / MEMO.tw, u1 = (sg[0] + len) / MEMO.tw, v0 = (sg[2] - 22) / MEMO.th, v1 = (sg[2] + 7) / MEMO.th;
        quad(F, C, [memoW(u0, v0, .08), memoW(u1, v0 + .001, .08), memoW(u1, v1, .08), memoW(u0, v1 + .002, .08)], 'rgba(255,214,30,.8)', { op: 'multiply', z: depth(C, MEMO.p) + 1.5 });
      });
    }
    // оттиск штампа (красная краска — умножение)
    if (t >= q.sekr) { const sw = [memoW(.55, .03, .07), memoW(.95, .0, .07), memoW(.96, .12, .07), memoW(.56, .15, .07)]; face(F, C, E, sw, [0, 1, 0], { tex: stampT(), sub: 2, unlit: true, a: .88, z: depth(C, MEMO.p) + 1.6 }) }
    // досье: карточка у верхнего края листа на скрепке
    const dc = { p: [memoW(.24, .02)[0] - 1, .3, memoW(.24, .02)[2] + 2.6], ry: MEMO.ry + .1 }, dW = 12, dH = 8, rot = (dx, dz) => [dc.p[0] + dx * Math.cos(dc.ry) + dz * Math.sin(dc.ry), .32, dc.p[2] - dx * Math.sin(dc.ry) + dz * Math.cos(dc.ry)];
    face(F, C, E, [rot(-dW / 2, dH / 2), rot(dW / 2, dH / 2), rot(dW / 2, -dH / 2), rot(-dW / 2, -dH / 2)], [0, 1, 0], { tex: dossierT(), sub: 3, z: depth(C, MEMO.p) + 1.2, edge: .25 });
    face(F, C, E, [rot(-1.2, -dH / 2 + 4.5), rot(1.8, -dH / 2 + 4.5), rot(1.8, -dH / 2 - 3), rot(-1.2, -dH / 2 - 3)], [0, 1, 0], { tex: clipT(), sub: 2, unlit: true, z: depth(C, MEMO.p) + .9 });
    // штамп-колодка: 3–4 кадра у удара (регламент п. 43)
    const sk = (t - q.sekr) / .13;
    if (sk > -1 && sk < 1.1) {
      const sp = memoW(.75, .08), lift = sk < 0 ? 12 * sk * sk : sk < .25 ? 0 : 14 * (sk - .25) * (sk - .25) * 1.6;
      const y0 = .4 + lift; box(F, C, E, { p: [sp[0], y0 + .5, sp[2]], s: [10, 1, 4.6], r: { ry: MEMO.ry - .12 }, m: { col: '#2a1c14', edge: .2 } });
      box(F, C, E, { p: [sp[0], y0 + 2.6, sp[2]], s: [10.4, 3.2, 5], r: { ry: MEMO.ry - .12 }, m: { col: '#8a5a32', gloss: .8, edge: .3 } });
      prism(F, C, E, [sp[0], y0 + 4.2, sp[2]], 1.4, 7, 10, { col: '#6a4224', gloss: .9 }, null);
      prism(F, C, E, [sp[0], y0 + 11, sp[2]], 2.6, 2.2, 12, { col: '#8a5a32', gloss: 1.2 }, { col: '#a06a3a' });
    }
    draw3(mid, F);
    // сборка: окно (размыто) → кабинет; тилт по ключевой строке; свет лампы, пыль, дым сигареты
    comp(c, 'far', 9);
    c.fillStyle = 'rgba(10,14,30,.18)'; c.fillRect(0, 0, WW, HH);
    comp(c, 'mid', 0);
    const hlY = (() => { const a = P3(C, memoW(.5, .52)); return a ? a[1] : HH / 2 })(), packY = (() => { const a = P3(C, [-28, 5, 35]); return a ? a[1] : HH / 2 })();
    const fy = t < q.gotov ? packY : hlY, band = t < q.gotov ? 380 : lp(520, 300, ss(q.zvuch, q.s4, t));
    tiltDOF(c, fy - band / 2, fy + band / 2, 16, 300);
    { const a = P3(C, [-48, 24, 40]), b = P3(C, memoW(.5, .4)); if (a && b) { const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(-(b[0] - a[0]), b[1] - a[1]); beam(c, a[0], a[1], ang, .9, len * 1.3, '#ffd9a0', .55); dust(c, t, a[0], a[1], ang, .9, len * 1.25, 90, 13, .8) } }
    { const e = P3(C, [AX[0] - 9.7, 2.9, AX[2] + 1.2]); if (e) { const sc = C.f / Math.max(10, depth(C, AX)); glowDot(c, e[0], e[1], 2.2 * sc, '#ff5a1a', .9 + .3 * Math.sin(t * 6)); smoke(c, t, e[0], e[1], { n: 26, life: 5, rise: 40 * sc, sway: 6 * sc, drift: 8 * sc, r0: .6 * sc, r1: 9 * sc, a: .32, seed: 43 }) } }
    bloom(c, 'glow', 1, 6, 22);
    // рука с маркером над строкой (регламент п. 25–28)
    if (hk > 0 || (t > q.qt[0] - .7 && t < q.e4 + 1.2)) {
      const segs2 = MEMOL.hl; if (segs2) {
        const L1 = segs2[0][1] - segs2[0][0], L2 = segs2[1][1] - segs2[1][0], dist = cl(hk) * (L1 + L2), i = dist <= L1 ? 0 : 1, sg = segs2[i], xx = sg[0] + (i === 0 ? dist : dist - L1);
        const tip = P3(C, memoW(xx / MEMO.tw, (sg[2] - 8) / MEMO.th, .08)), sc = C.f / Math.max(5, depth(C, memoW(.5, .52)));
        const enter = ss(q.qt[0] - .7, q.qt[0] - .1, t), leave = ss(q.e4 + .2, q.e4 + 1, t);
        if (tip) handMarker(c, tip[0] + (1 - enter + leave) * 600, tip[1] + (1 - enter + leave) * 260, sc * .86, -.62, t, cl(enter - leave) > .9 ? 0 : 1);
      }
    }
    bokehNear(c, t, 53, '#ffcf90', 6, .45);
  }
  // рука держит маркер: кончик маркера в (x, y), sc — пикселей на сантиметр, ang — угол маркера (от кончика к руке)
  function handMarker(c, x, y, sc, ang, t, lifted) {
    c.save(); c.translate(x, y); c.rotate(ang); c.scale(sc, sc);
    // тень руки на бумаге
    c.save(); c.translate(1.2, 2.2); c.globalAlpha = .28; c.filter = 'blur(6px)'; c.fillStyle = '#000'; c.beginPath(); c.ellipse(11, 1.5, 9, 4.2, 0, 0, TAU); c.fill(); c.fillRect(1, -1, 12, 2.6); c.filter = 'none'; c.restore();
    // маркер: цилиндр (5 точек градиента — регламент п. 2), колпачок, скошенный наконечник
    const cyl = (x0, x1, r, cols) => { c.fillStyle = lg(c, 0, -r, 0, r, cols); rr(c, x0, -r, x1 - x0, 2 * r, r * .7); c.fill() };
    c.fillStyle = '#e8a400'; c.beginPath(); c.moveTo(0, -.25); c.lineTo(.9, -.65); c.lineTo(.9, .65); c.lineTo(0, .45); c.closePath(); c.fill();
    cyl(.8, 2.4, .62, [[0, '#4a4a4a'], [.3, '#bdbdbd'], [.5, '#ffffff'], [.75, '#8a8a8a'], [1, '#2a2a2a']]);
    cyl(2.3, 12.6, .82, [[0, '#8a6a00'], [.25, '#ffd21a'], [.42, '#fff6b0'], [.62, '#ffcc00'], [1, '#6a5000']]);
    cyl(10.4, 13.6, .9, [[0, '#2a2a2a'], [.35, '#6a6a6a'], [.5, '#bcbcbc'], [.7, '#3a3a3a'], [1, '#111']]);
    // пальцы: указательный — сверху по маркеру, большой — сбоку, средний — снизу (фаланги, ногти — п. 26, 27)
    const skin = (x0, y0, x1, y1, r) => [[0, '#7a4a32'], [.18, '#c98a64'], [.45, '#f2c4a0'], [.7, '#e2a882'], [1, '#9a5a3e']];
    const finger = (pts, w, nail) => {
      c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
      c.strokeStyle = '#8a5038'; c.lineWidth = w + .35; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
      const a = pts[0], b = pts[pts.length - 1], nx = -(b[1] - a[1]), ny = b[0] - a[0], L = Math.hypot(nx, ny) || 1;
      c.strokeStyle = lg(c, (a[0] + b[0]) / 2 + nx / L * w / 2, (a[1] + b[1]) / 2 + ny / L * w / 2, (a[0] + b[0]) / 2 - nx / L * w / 2, (a[1] + b[1]) / 2 - ny / L * w / 2, skin()); c.lineWidth = w; c.stroke();
      for (let i = 1; i < pts.length - 1; i++) { c.strokeStyle = 'rgba(120,60,40,.45)'; c.lineWidth = .12; c.beginPath(); c.arc(pts[i][0], pts[i][1], w * .38, ang - 1, ang + 1); c.stroke() }
      if (nail) { const [nx0, ny0, nr] = nail; c.fillStyle = 'rgba(255,214,200,.95)'; c.beginPath(); c.ellipse(nx0, ny0, nr * 1.25, nr * .82, Math.atan2(b[1] - a[1], b[0] - a[0]), 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(nx0 - .12, ny0 - .14, nr * .5, nr * .22, Math.atan2(b[1] - a[1], b[0] - a[0]), 0, TAU); c.fill() }
      c.restore();
    };
    finger([[5.4, 1.9], [4.4, 2.0], [3.4, 1.7]], 1.45, null);   // средний — частично под маркером
    // тыльная сторона ладони и запястье
    c.beginPath(); c.moveTo(6.2, -2.4); c.bezierCurveTo(8.6, -3.6, 12.4, -3.8, 14.6, -2.6); c.bezierCurveTo(16.2, -1.6, 16.6, 1.6, 15.4, 3.2); c.bezierCurveTo(13.2, 4.6, 9.4, 4.4, 6.8, 3.0); c.bezierCurveTo(5.6, 1.6, 5.4, -1.2, 6.2, -2.4); c.closePath();
    c.fillStyle = lg(c, 0, -3.8, 0, 4.4, [[0, '#f6cfae'], [.35, '#f0c09c'], [.7, '#d8a07c'], [1, '#9a5e42']]); c.fill();
    c.strokeStyle = 'rgba(110,55,35,.55)'; c.lineWidth = .14; c.stroke();
    c.strokeStyle = 'rgba(255,240,225,.6)'; c.lineWidth = .12; c.beginPath(); c.moveTo(7, -2.6); c.bezierCurveTo(9.4, -3.5, 12.4, -3.6, 14.4, -2.5); c.stroke();
    for (const [kx, ky] of [[7.6, -2.2], [8.2, -.6], [8.4, 1.1]]) { c.fillStyle = 'rgba(255,230,210,.5)'; c.beginPath(); c.ellipse(kx, ky, .55, .35, .3, 0, TAU); c.fill() }
    finger([[7.8, -1.9], [5.6, -1.55], [3.9, -1.25], [2.5, -1.05]], 1.5, [2.95, -1.1, .55]);   // указательный
    finger([[7.4, 2.6], [5.6, 2.2], [4.1, 1.45]], 1.75, [4.55, 1.55, .6]);   // большой
    // манжет рубашки и рукав пиджака (рука не обрывается — п. 28)
    c.save(); c.translate(16.4, .4); c.rotate(.08);
    c.fillStyle = lg(c, 0, -4, 0, 4, [[0, '#ffffff'], [.5, '#e9eef4'], [1, '#9aa4b0']]); rr(c, -.6, -3.9, 2.6, 7.8, .8); c.fill(); c.fillStyle = '#c9a24a'; c.beginPath(); c.arc(.7, -1.2, .45, 0, TAU); c.fill();
    c.fillStyle = lg(c, 0, -5, 0, 5, [[0, '#2a3346'], [.4, '#1b2232'], [1, '#0a0d14']]); c.beginPath(); c.moveTo(1.8, -4.6); c.lineTo(30, -6); c.lineTo(30, 7); c.lineTo(1.8, 4.6); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = .25; for (const yy of [-2, 1.4]) { c.beginPath(); c.moveTo(4, yy); c.quadraticCurveTo(8, yy + .8, 12, yy - .2); c.stroke() }
    c.restore();
    c.restore();
  }
  function s6Next(c, t, u) { stub(c, t, u, 'ДАЛЬШЕ') }

  // ================= кадр: планы и переходы (движок v15) =================
  const TRD = { cut: 0, blur: .5, punch: .34, flash: .42, whip: .4, glitch: .55, fade: .6 };
  function shotAt(t) { let i = 0; while (i < SH.length - 1 && t >= SH[i + 1].a) i++; return i }
  function drawShot(c, sh, t) { c.save(); c.fillStyle = C.ink; c.fillRect(0, 0, WW, HH); sh.f(c, t, t - sh.a, sh); c.restore() }
  function composite(c, p, n, k, kind, t) {
    const a = A.getContext('2d'), b = B.getContext('2d');
    if (kind === 'blur' || kind === 'fade') {
      drawShot(a, p, t); drawShot(b, n, t);
      const bl = kind === 'blur' ? 24 : 0, b1 = bl * ss(0, .6, k), b2 = bl * (1 - ss(.4, 1, k));
      c.filter = b1 > .3 ? `blur(${b1.toFixed(1)}px)` : 'none'; c.drawImage(A, 0, 0);
      c.globalAlpha = ss(.2, .8, k); c.filter = b2 > .3 ? `blur(${b2.toFixed(1)}px)` : 'none'; c.drawImage(B, 0, 0); c.globalAlpha = 1; c.filter = 'none';
    } else if (kind === 'punch') {
      if (k < .5) { const e = ei(k * 2); drawShot(a, p, t); c.save(); c.translate(WW / 2, HH / 2); c.scale(1 + .32 * e, 1 + .32 * e); c.translate(-WW / 2, -HH / 2); c.filter = `blur(${(10 * e).toFixed(1)}px)`; c.drawImage(A, 0, 0); c.restore() }
      else { const e = eo((k - .5) * 2); drawShot(b, n, t); c.save(); c.translate(WW / 2, HH / 2); c.scale(1.16 - .16 * e, 1.16 - .16 * e); c.translate(-WW / 2, -HH / 2); c.filter = `blur(${(8 * (1 - e)).toFixed(1)}px)`; c.drawImage(B, 0, 0); c.restore() }
      c.filter = 'none'; c.fillStyle = `rgba(255,255,255,${(.22 * Math.max(0, 1 - Math.abs(k - .5) * 5)).toFixed(3)})`; c.fillRect(0, 0, WW, HH);
    } else if (kind === 'flash') {
      drawShot(c, k < .5 ? p : n, t); c.fillStyle = `rgba(255,248,240,${Math.pow(Math.max(0, 1 - Math.abs(k - .5) * 2), 1.6).toFixed(3)})`; c.fillRect(0, 0, WW, HH);
    } else if (kind === 'whip') {
      const e = eio(k); drawShot(a, p, t); drawShot(b, n, t); c.filter = `blur(${(18 * Math.sin(Math.PI * k)).toFixed(1)}px)`;
      c.drawImage(A, -WW * e, 0); c.drawImage(B, WW * (1 - e), 0); c.filter = 'none';
    } else if (kind === 'glitch') {
      const sh = k < .5 ? p : n; drawShot(a, sh, t); c.drawImage(A, 0, 0);
      const f = Math.floor(t * 30), amt = Math.sin(Math.PI * k);
      for (let i = 0; i < 14; i++) { const y = H1(f * 13 + i) * HH, h = 8 + H1(f * 7 + i) * 70, dx = (H1(f * 3 + i) - .5) * 260 * amt; c.drawImage(A, 0, y, WW, h, dx, y, WW, h) }
      c.globalCompositeOperation = 'screen'; c.globalAlpha = .5 * amt; c.drawImage(A, 14 * amt, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
      for (let i = 0; i < 5; i++) { c.fillStyle = i % 2 ? `rgba(255,40,60,${.35 * amt})` : `rgba(40,240,255,${.3 * amt})`; c.fillRect(0, H1(f + i * 9) * HH, WW, 2 + H1(f + i) * 10) }
    }
  }

  // ================= HUD и субтитры — как у референсов =================
  const ORANGE = '#ff9f1c';   // регламент п. 95
  const hms = s => { s = ((Math.floor(s) % 86400) + 86400) % 86400; return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(v => String(v).padStart(2, '0')).join(':') };
  function hudR(c, t) {
    let ch = CHS[0]; for (const h of CHS) if (t >= h.a) ch = h;
    const y = 76, x0 = 80, k = eo((t - ch.a) / .35);   // регламент п. 92: HUD на высоте ~70 px, поля 80 px
    c.save(); c.shadowColor = 'rgba(0,0,0,.85)'; c.shadowBlur = 10;
    const bl = .5 + .5 * Math.sin(t * 4.4); c.fillStyle = `rgba(255,59,48,${.6 + .4 * bl})`; c.beginPath(); c.arc(x0 + 7, y - 8, 7.5, 0, TAU); c.fill();
    font(c, { f: 'J', w: 500, s: 21, ls: 2.2 }); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    const a = ch.topic + '  ·  '; c.globalAlpha = .4 + .6 * k; c.fillStyle = 'rgba(232,236,245,.82)'; c.fillText(a, x0 + 26, y);
    c.fillStyle = ORANGE; c.fillText(ch.place, x0 + 26 + c.measureText(a).width, y); c.globalAlpha = 1;
    font(c, { f: 'J', w: 500, s: 40, ls: 1 }); c.textAlign = 'right'; c.fillStyle = '#f3f5f9'; c.fillText(ch.clock(t), WW - 80, y + 6);
    font(c, { f: 'J', w: 500, s: 17, ls: 3 }); c.fillStyle = 'rgba(205,212,226,.62)'; c.fillText(ch.sub(t), WW - 82, y + 34);
    c.restore();
  }
  // субтитры: крупно (Oswald 700), куски по 1–3 слова; сказанные — белые, ещё не сказанные — серые; главное — оранжевым
  const CAPY = 1392, CAPF = 86, CAPW = 900;   // регламент п. 91, 94: крупный гротеск, поля 80 px; низ 1520+ закрывает описание TikTok — ставим чуть выше
  const KEYW = new Set(['одноразках', 'замена', 'манго', 'мяты', 'жидкость', 'гиганты', 'пятьдесят', '1973', 'рейнольдс', 'camel', 'winston', 'секретный', 'прямо', 'молодёжного', 'рынка']);
  let CAPS = [];
  const capWord = d => d.replace(/[,.:;…]+$/g, '').replace(/[,.:;…](?=»)/g, '').toUpperCase();
  const bareW = d => d.toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
  function buildCaps(tl) {
    const W = tl.sent.flatMap(s => s.words.map((w, i) => ({ ...w, end: i === s.words.length - 1 }))), out = []; let cur = [];
    const c = X; font(c, { f: 'M', w: 800, s: CAPF, ls: 0 });
    const wd = w => c.measureText(capWord(w.d) + ' ').width;
    const lay2 = ws => { const L = [[]]; let x = 0; for (const w of ws) { const ww = wd(w); if (x + ww > CAPW && L[L.length - 1].length) { L.push([]); x = 0 } L[L.length - 1].push(w); x += ww } return L };
    const FW = new Set(['с', 'со', 'в', 'во', 'и', 'а', 'на', 'по', 'за', 'но', 'к', 'ко', 'о', 'об', 'от', 'до', 'из', 'у', 'для', 'при', 'без', 'под', 'над', 'что', 'как', 'не', 'ни', 'ещё', 'же', 'ли']);
    const flush = () => { const carry = []; while (cur.length > 1 && FW.has(bareW(cur[cur.length - 1].d)) && !/[?!.:,»]$/.test(cur[cur.length - 1].d)) carry.unshift(cur.pop()); if (cur.length) out.push({ ws: cur, lines: lay2(cur) }); cur = carry };
    W.forEach((w, i) => {
      const nx = W[i + 1];
      if (cur.length && (lay2([...cur, w]).length > 2 || cur.length >= 3 || w.a - cur[cur.length - 1].b > .38)) flush();
      cur.push(w);
      if (w.end || /[?!.:»]$/.test(w.d) || (nx && nx.a - w.b > .38)) flush();
    });
    flush();
    out.forEach(ch => { ch.a = ch.ws[0].a });
    out.forEach((ch, i) => { const nx = out[i + 1], e = ch.ws[ch.ws.length - 1].b; ch.e = nx ? Math.min(nx.a - .02, e + .55) : e + .6 });
    CAPS = out;
  }
  function capsR(c, t) {
    const ch = CAPS.find(x => t >= x.a - .06 && t < x.e); if (!ch || NOCAP(t)) return;
    const k = eo((t - ch.a + .06) / .14), lh = CAPF * 1.02, y0 = CAPY - (ch.lines.length - 1) * lh / 2 + CAPF * .36;
    c.save(); c.globalAlpha = .5 * k; c.translate(WW / 2, CAPY); c.scale(1, (ch.lines.length * lh + 60) / 760); c.fillStyle = rg(c, 0, 0, 0, 520, [[0, 'rgba(0,0,0,.7)'], [.6, 'rgba(0,0,0,.35)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(-540, -520, 1080, 1040); c.restore();
    c.save(); font(c, { f: 'M', w: 800, s: CAPF, ls: 0 }); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    ch.lines.forEach((ln, j) => {
      const ws = ln.map(w => capWord(w.d)), sp = c.measureText(' ').width, W = ws.reduce((s, x) => s + c.measureText(x).width, 0) + sp * (ws.length - 1);
      let x = WW / 2 - W / 2; const y = y0 + j * lh + (1 - k) * 18;
      ln.forEach((w, i) => {
        const s = ws[i], ww = c.measureText(s).width, on = t >= w.a - .04, key = KEYW.has(bareW(w.d)), pk = cl((t - w.a + .04) / .16), sc = on ? 1 + (key ? .08 : .04) * (1 - eo(pk)) : 1;
        c.save(); c.translate(x + ww / 2, y - CAPF * .36); c.scale(sc, sc); c.translate(-(x + ww / 2), -(y - CAPF * .36));
        c.globalAlpha = k * (on ? 1 : .34); c.shadowColor = 'rgba(0,0,0,.85)'; c.shadowBlur = 18; c.shadowOffsetY = 5;
        c.fillStyle = key && on ? ORANGE : on ? '#ffffff' : '#c9ccd4'; c.fillText(s, x, y); c.restore();
        x += ww + sp;
      });
    });
    c.restore();
  }
  let NOCAP = () => false;
  function vignetteR(c) { c.drawImage(cache('vigR', WW, HH, (x) => { x.fillStyle = rg(x, WW / 2, HH * .46, HH * .26, HH * .78, [[0, 'rgba(0,0,0,0)'], [.6, 'rgba(0,0,0,.22)'], [1, 'rgba(0,0,0,.78)']]); x.fillRect(0, 0, WW, HH) }), 0, 0) }
  let GR = null;
  function gradeR(c) {
    if (!GR) GR = mk(WW, HH); const g = GR.getContext('2d'); g.globalCompositeOperation = 'copy'; g.drawImage(c.canvas, 0, 0);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'copy'; c.filter = 'contrast(1.06) saturate(1.12)'; c.drawImage(GR, 0, 0); c.restore(); c.filter = 'none';
  }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none';
    const i = shotAt(t), sh = SH[i], nx = SH[i + 1]; let tr = null;
    if (nx && nx.tr !== 'cut' && t >= nx.a - TRD[nx.tr] / 2) tr = [sh, nx, (t - (nx.a - TRD[nx.tr] / 2)) / TRD[nx.tr], nx.tr];
    else if (i > 0 && sh.tr !== 'cut' && t < sh.a + TRD[sh.tr] / 2) tr = [SH[i - 1], sh, (t - (sh.a - TRD[sh.tr] / 2)) / TRD[sh.tr], sh.tr];
    const [dx, dy] = shake(t);
    c.save(); c.translate(dx, dy);
    if (tr) composite(c, tr[0], tr[1], cl(tr[2]), tr[3], t); else drawShot(c, sh, t);
    c.restore();
    gradeR(c); vignetteR(c); hudR(c, t); capsR(c, t);
  }

  // ================= план ролика: каждый план — от слов диктора =================
  window.CUES = window.CUES || {};
  const cue = (t0, name, gain = 1, pan = 0) => { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, pan] };
  function build(tl) {
    const S = tl.sent, nrm = s => cueNorm(s), ALL = S.flatMap(x => x.words);
    const find = (cu, n) => { const q = nrm(cu); let k = 0; for (const x of ALL) { const d = nrm(x.d); if (d === q || (q.length > 3 && d.startsWith(q))) { if (k++ === n) return x } } console.warn('нет слова', cu, n); return ALL[0] };
    const W = (cu, n = 0) => find(cu, n).a, WB = (cu, n = 0) => find(cu, n).b, s = i => S[i].a, se = i => S[i].b;
    const QW = ['мы', 'должны', 'получить', 'свою', 'долю', 'молодёжного', 'рынка'];
    Q = { odn: W('одноразках'), chto2: W('что', 1), modn: W('модная'), zam: W('замена'), sig: W('сигаретам'), bez: W('безобидным'), parom: W('паром'), vkus: W('вкусом'), mango: W('манго'), myaty: W('мяты'), e0: se(0),
      s1: s(1), zhid: W('жидкость'), vnutri: W('внутри'), izobr: W('изобрели'), tab1: W('табачные'), gig: W('гиганты'), p50: W('пятьдесят'), nazad: W('назад'),
      s2: s(2), vern: W('вернёмся'), y73: W('1973'), tab: W('табачная'), imp: W('империя'), rey: W('рейнольдс'), sozd: W('создатель'), camel: W('camel'), winston: W('winston'), gotov: W('готовит'), sekr: W('секретный'), otch: W('отчёт'),
      s3: s(3), cel: W('цель'), dok: W('документа'), zvuch: W('звучала'), pryamo: W('прямо'), s4: s(4), qt: QW.map(q => W(q)), qtB: QW.map(q => WB(q)), e4: se(4), s5: s(5),
      b0: tl.b0, endT: tl.endT };
    const q = Q;
    const sh = (a, tr, f) => SH.push({ a, tr, f });
    // HUD: тема · место; часы справа (тикают; на «пятьдесят лет назад» отматываются)
    const T0 = 23 * 3600 + 41 * 60 + 7, T73 = 21 * 3600 + 14 * 60 + 52;
    const yr = t => { const k = eio(cl((t - q.p50 + .1) / (q.y73 + .15 - q.p50 + .1))); return Math.round(2026 - 53 * k) };
    const now = { clock: t => hms(T0 + t), sub: () => 'НОЯБРЬ 2026' };
    CHS.push({ a: 0, topic: 'ОДНОРАЗКИ', place: 'ВЕЙП-ШОП', ...now });
    CHS.push({ a: q.s1 - .1, topic: 'ОДНОРАЗКИ', place: 'СОСТАВ', ...now });
    CHS.push({ a: q.p50 - .25, topic: 'ПЕРЕМОТКА', place: 'НАЗАД', clock: t => hms(T0 + q.p50 - (t - q.p50) * 7700), sub: t => 'ГОД ' + yr(t) });
    CHS.push({ a: q.y73 - .05, topic: 'R.J. REYNOLDS', place: 'УИНСТОН-СЕЙЛЕМ', clock: t => hms(T73 + (t - q.y73)), sub: () => 'ФЕВРАЛЬ 1973' });
    CHS.push({ a: q.gotov - .15, topic: 'R.J. REYNOLDS', place: 'ОТДЕЛ ИССЛЕДОВАНИЙ', clock: t => hms(T73 + (t - q.y73)), sub: () => '02.02.1973' });
    // планы
    sh(0, 'cut', s1Scene);
    sh(q.s1 - .12, 'punch', s2Xray);
    sh(q.izobr - .12, 'blur', s2Giants);
    sh(q.p50 - .25, 'blur', s2Rewind);
    sh(q.y73 - .06, 'flash', s3Tower);
    sh(q.y73 + 2.8, 'blur', s4Office);
    sh(q.s5 - .12, 'blur', s6Next);
    HITS.push(q.y73, q.sekr + .02);
    // звуки
    cue(0, 'city', .9); cue(.02, 'whoosh', .55); cue(1.25, 'deep', .4); cue(1.55, 'swish', .35);
    cue(q.zam - .1, 'whoosh', .35, -.3); [0, 1, 2].forEach(i => cue(q.zam + .12 + i * .2 + .34, 'bin', [.7, .55, .6][i], -.5));
    cue(q.bez - .1, 'whoosh', .35, .2); cue(q.parom - .32, 'glass', .3); cue(q.parom - .1, 'thud', .35, -.4); cue(q.parom, 'thud', .35, .4); cue(q.parom + .05, 'puff', .55);
    cue(q.mango - .1, 'shimmer', .35); cue(q.myaty - .1, 'shimmer', .3, -.3);
    cue(q.s1 - .1, 'whoosh', .5); cue(q.s1 + .25, 'xray', .6); cue(q.zhid, 'ding', .3, .3); cue(q.vnutri + .1, 'ding', .25, -.3);
    cue(q.izobr - .1, 'dive', .8); cue(q.tab1, 'factory', .9); cue(q.gig, 'deep', .55);
    cue(q.y73 + .1, 'deep', .5); cue(q.tab, 'factory', .55); cue(q.rey - .1, 'buzz', .35); cue(q.y73 + 2.75, 'whoosh', .4);
    cue(q.camel + .1, 'thud', .5, -.3); cue(q.winston + .1, 'thud', .5, .2); cue(q.gotov, 'swish', .5); cue(q.gotov + .3, 'papers', .45); cue(q.sekr - .02, 'stamp', 1); cue(q.zvuch, 'deep', .35);
    cue(q.qt[0] - .05, 'marker', .55); cue(q.qt[4], 'marker', .45);
    cue(q.p50 - .2, 'whoosh', .55); for (let tt = q.p50; tt < q.y73; tt += .085) cue(tt, 'tick', .22 + .2 * (tt - q.p50) / (q.y73 - q.p50)); cue(q.y73, 'impact', .7);
    buildCaps(tl);
  }

  window.EP = {
    P, D, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      SC.forEach(S => { D[S.key] = (t) => { frame(t); return '' } });
      const gr = document.getElementById('grain'); gr.style.display = ''; gr.style.opacity = .2;
      if (!document.getElementById('v15f')) { const st = document.createElement('style'); st.id = 'v15f'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); A = mk(WW, HH); B = mk(WW, HH);
      SH = []; CHS = []; HITS = []; S1K = null;
      return Promise.all(['500 20px J', '700 20px J', '700 20px U', '800 20px U', '500 20px O', '700 20px O', '800 20px M'].map(f => document.fonts.load(f, 'АЯaz09'))).then(() => { smokeSprites(); build(tl) });
    },
  };
})();
