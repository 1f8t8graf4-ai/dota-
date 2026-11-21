// v21.0 (19.11) — глава 4 «2014 · Нагреватели» фильма «Что вы знаете о никотине?». Утверждённый текст (глава4/data.py → FINAL), голос Макса (voice/v210).
// Ролики: v210y-ru — глава фильма (строки 1–17 и финал на доске), v210s-ru — шортс (строки 1–15, вопрос, «Часть 5 →», петля в кадр 0).
// Рисовка — по общей раскадровке shorts/глава4/рисовка.py (Claude + Gemini). Основа — код главы 3: набор «Боб 2.0» (ep/v200/05-kit.js),
// камера без старт-стопа (ep/v200/12-cam.js), предметы (ep/v200/15-props.js); время событий — по словам голоса (Ws(строка, слово)).
// Все наши надписи — в словаре TEXT (10-text.js): по нему сделаем английскую и немецкую версии.
(function () {
  'use strict';
  const WW = 1080, HH = 1920, CX = WW / 2, CY = HH / 2, TAU = Math.PI * 2, SUBY = 1720;
  let cv = null, X = null, K = null, TLW = [], TLX = {}, MODE = 's', CHUNKS = [];
  let FT = 0;   // v21.1: время кадра — числа на счётчиках считаем по нему, иначе в размытии движения (4 момента за полкадра) цифры двоятся
  window.CUES = window.CUES || {};
  const cue = (t0, name, gain = 1, pan = 0) => { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, pan] };
  const nw = s => String(s).toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
  function Wd(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.a } throw new Error('v210: нет слова «' + q + '» #' + n) }
  let TLS = [];
  function Ws(sc, q, n = 0) { const s = TLS.find(x => x.scene === sc); if (!s) return null; let k = 0; for (const w of s.words) if (nw(w.d) === q) { if (k++ === n) return w.a } throw new Error('v210: нет слова «' + q + '» во фразе ' + sc) }
  function WsB(sc, q, n = 0) { const s = TLS.find(x => x.scene === sc); if (!s) return null; let k = 0; for (const w of s.words) if (nw(w.d) === q) { if (k++ === n) return w.b } throw new Error('v210: нет слова «' + q + '» во фразе ' + sc) }
  const SA = sc => { const s = TLS.find(x => x.scene === sc); return s ? s.a : null }, SB = sc => { const s = TLS.find(x => x.scene === sc); return s ? s.b : null };
  function WdB(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.b } throw new Error('v210: нет слова «' + q + '» #' + n) }
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
  function buildChunks(subs) {   // 21.11: subs — субтитры перевода из таймлайна (EN/DE, l10n/build.py), иначе — русские слова голоса
    const out = []; let cur = []; if (subs) subs.forEach(x => out.push({ a: x.a, b: x.b, s: x.s }));
    const FW = new Set(['с', 'со', 'в', 'во', 'и', 'а', 'на', 'по', 'за', 'но', 'к', 'о', 'от', 'до', 'из', 'у', 'для', 'при', 'без', 'под', 'что', 'как', 'не', 'их', 'ещё', 'если', 'пока', 'когда', 'чтобы', 'так']);
    const bare = w => w.d.toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
    const flush = () => { if (cur.length) { out.push({ a: cur[0].a, b: cur[cur.length - 1].b, s: cur.map(w => w.d).join(' ') }); cur = [] } };
    if (!subs) TLW.forEach((w, i) => {
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
    if (!KEYS._chk) { KEYS._chk = 1; for (let j = 0; j + 1 < n; j++) if (!(KEYS[j + 1][0] > KEYS[j][0])) console.error(`camAt: ключи камеры не по порядку №${j}: ${KEYS[j][0].toFixed(3)} → ${KEYS[j + 1][0].toFixed(3)}`) }   // 21.11: озвучка перевода сжимает время между словами
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
  // ================= глава 4: надписи — по языку ролика (Андрей, 20.11: «текст зависит от типа ролика: русский ролик — на русском, английский — англ, дойч — дойч») =================
  // TEXT — наши плашки, OBJ — надписи на предметах. Названия (The Times, The Sun, Daily Mirror, Marlboro, IQOS, Philip Morris, R.J. Reynolds, Premier, FDA, JAMA) — как в жизни.
  // Язык берётся из ролика (v210y-ru → ru) в EP.init → setLang.
  const TEXT_L = {
    ru: {
      promise: 'НОВОГОДНЕЕ ОБЕЩАНИЕ', nagoya: 'НАГОЯ', milan: 'МИЛАН', nofire: 'НЕ ГОРИТ', half: 'ВДВОЕ ХОЛОДНЕЕ', soldout: 'РАСКУПИЛИ',
      noharm: 'БЕЗ ВРЕДА?', vapor: 'ПАР', smoke: 'ДЫМ', onemore: 'ОДНОГО БОЛЬШЕ', nicL: 'НИКОТИН', title: 'ДЫМ ПОД ДРУГИМ ИМЕНЕМ',
      less: 'МЕНЬШЕ ВЕЩЕСТВ', harm: 'МЕНЬШЕ ВРЕДА', no: 'НЕЛЬЗЯ', memo: 'МЕМОРАНДУМ', memoDate: '2 ФЕВРАЛЯ 1973', secret: 'СЕКРЕТНО',
      quote: [['МЫ', 'ДОЛЖНЫ', 'ПОЛУЧИТЬ'], ['СВОЮ', 'ДОЛЮ'], ['МОЛОДЁЖНОГО', 'РЫНКА']], sign: 'К. ТИГ · ОТДЕЛ ИССЛЕДОВАНИЙ',
      premier: '−$300 МЛН', itc: 'ТОРГОВАЯ КОМИССИЯ США', ban: 'ЗАПРЕТ', users: '32 МЛН', usersL: 'ПОЛЬЗОВАТЕЛЕЙ', cigs: '617 МЛРД', cigsL: 'СИГАРЕТ',
      pct: '+0,6 %', pctL: 'ЗА ГОД', price: '$16 МЛРД', notob: 'БЕЗ ТАБАКА', part5: 'Часть 5 →', fire: 'ОГОНЬ', blade: 'НАГРЕВ',
      card79b: 'СОЛЬ', card20b: 'ЛАЗЕЙКА ОДНОРАЗОК', card24b: '«МАЛЬБОРО»', card14b: 'НАГРЕВАТЕЛИ', card22b: 'СНЮС',
      fPrem: v => '−$' + v + ' МЛН', fUsers: v => v + ' МЛН', fCigs: v => v + ' МЛРД', fPrice: v => '$' + v + ' МЛРД', fPctN: v => v + ' %',
    },
    en: {
      promise: 'NEW YEAR’S RESOLUTION', nagoya: 'NAGOYA', milan: 'MILAN', nofire: 'WON’T LIGHT', half: 'HALF AS HOT', soldout: 'SOLD OUT',
      noharm: 'NO HARM?', vapor: 'VAPOR', smoke: 'SMOKE', onemore: 'ONE EVEN HIGHER', nicL: 'NICOTINE', title: 'SMOKE BY ANY OTHER NAME',
      less: 'FEWER CHEMICALS', harm: 'LESS HARM', no: 'NOT ALLOWED', memo: 'MEMORANDUM', memoDate: 'FEBRUARY 2, 1973', secret: 'SECRET',
      quote: [['WE', 'MUST', 'GET'], ['OUR', 'SHARE', 'OF THE'], ['YOUTH', 'MARKET']], sign: 'C. TEAGUE · RESEARCH DEPARTMENT',
      premier: '−$300M', itc: 'U.S. TRADE COMMISSION', ban: 'BANNED', users: '32M', usersL: 'USERS', cigs: '617B', cigsL: 'CIGARETTES',
      pct: '+0.6%', pctL: 'VS. PRIOR YEAR', price: '$16B', notob: 'NO TOBACCO', part5: 'Part 5 →', fire: 'FLAME', blade: 'HEATER',
      card79b: 'SALT', card20b: 'THE DISPOSABLE LOOPHOLE', card24b: '“MARLBORO”', card14b: 'HEATED TOBACCO', card22b: 'NICOTINE POUCHES',
      fPrem: v => '−$' + v + 'M', fUsers: v => v + 'M', fCigs: v => v + 'B', fPrice: v => '$' + v + 'B', fPctN: v => v + '%',
    },
    de: {
      promise: 'NEUJAHRSVORSATZ', nagoya: 'NAGOYA', milan: 'MAILAND', nofire: 'BRENNT NICHT', half: 'HALB SO HEISS', soldout: 'AUSVERKAUFT',
      noharm: 'HARMLOS?', vapor: 'DAMPF', smoke: 'RAUCH', onemore: 'EINER SOGAR HÖHER', nicL: 'NIKOTIN', title: 'RAUCH UNTER ANDEREM NAMEN',
      less: 'WENIGER SCHADSTOFFE', harm: 'WENIGER SCHÄDLICH', no: 'VERBOTEN', memo: 'MEMORANDUM', memoDate: '2. FEBRUAR 1973', secret: 'GEHEIM',
      quote: [['WIR', 'MÜSSEN', 'UNS'], ['UNSEREN', 'ANTEIL', 'AM'], ['JUGENDMARKT'], ['SICHERN.']], sign: 'C. TEAGUE · FORSCHUNGSABTEILUNG',
      premier: '−300 MIO. $', itc: 'US-HANDELSKOMMISSION', ban: 'VERBOT', users: '32 MIO.', usersL: 'NUTZER', cigs: '617 MRD.', cigsL: 'ZIGARETTEN',
      pct: '+0,6 %', pctL: 'ZUM VORJAHR', price: '16 MRD. $', notob: 'OHNE TABAK', part5: 'Teil 5 →', fire: 'FLAMME', blade: 'HEIZELEMENT',
      card79b: 'SALZ', card20b: 'DIE EINWEG-LÜCKE', card24b: '„MARLBORO“', card14b: 'TABAKERHITZER', card22b: 'NIKOTINBEUTEL',
      fPrem: v => '−' + v + ' MIO. $', fUsers: v => v + ' MIO.', fCigs: v => v + ' MRD.', fPrice: v => v + ' MRD. $', fPctN: v => v + ' %',
    },
  };
  const OBJ_NAMES = { ad3: 'Philip Morris Limited', heads: ['The Times', 'The Sun', 'Daily Mirror'], journal: 'JAMA Internal Medicine', fda: 'FDA', rj: 'R.J. REYNOLDS TOBACCO COMPANY',
    premier: 'Premier', rjs: 'R.J. Reynolds', iqos: 'IQOS' };
  const OBJ_L = {   // текст рекламы — как в газетах 2018 года (Our New Year’s resolution. We’re trying to give up cigarettes.), переведён
    ru: { ad1L: ['Наше новогоднее', 'обещание'], ad2L: ['Мы пытаемся бросить', 'сигареты.'], news: 'НОВОСТИ', jtitle1: 'Табачные нагреватели:', jtitle2: 'дым под другим именем',
      patent: 'ПАТЕНТ', fig: 'РИС. 1', mapUS: 'США', mapOcean: ['АТЛАНТИЧЕСКИЙ', 'ОКЕАН'] },
    en: { ad1L: ['Our New', 'Year’s resolution'], ad2L: ['We’re trying to', 'give up cigarettes.'], news: 'NEWS', jtitle1: 'Heat-Not-Burn Tobacco Cigarettes:', jtitle2: 'Smoke by Any Other Name',
      patent: 'PATENT', fig: 'FIG. 1', mapUS: 'USA', mapOcean: ['ATLANTIC', 'OCEAN'] },
    de: { ad1L: ['Unser', 'Neujahrsvorsatz'], ad2L: ['Wir versuchen,', 'Zigaretten aufzugeben.'], news: 'NACHRICHTEN', jtitle1: 'Tabakerhitzer:', jtitle2: 'Rauch unter anderem Namen',
      patent: 'PATENT', fig: 'ABB. 1', mapUS: 'USA', mapOcean: ['ATLANTISCHER', 'OZEAN'] },
  };
  const TEXT = {}, OBJ = {};
  let LANG = 'ru';
  function setLang(l) {
    LANG = TEXT_L[l] ? l : 'ru'; for (const o of [TEXT, OBJ]) for (const k in o) delete o[k];
    Object.assign(TEXT, TEXT_L[LANG]); Object.assign(OBJ, OBJ_NAMES, OBJ_L[LANG]);
  }
  setLang('ru');
  // палитра главы 4 (основа — набор Боба B2 и палитра главы 3 C3)
  const C4 = {
    night: '#1e2138', navy: '#141733', ink: '#141010', cream: '#F4F1EA', paper: '#F3EFE6', paperD: '#DDD6C8', paperL: '#FFFDF8', inkN: '#1B1A18',
    wall: '#2A2233', wallD: '#211B29', wood: '#5A3A26', woodL: '#7A5135', woodD: '#3E2718', woodE: '#2E1D14',
    dawn: ['#1F2A4A', '#2E3563', '#5A4775', '#A05D6E', '#D98A5E', '#F2B26B'], ben: '#191B38', roofs: '#232547',
    iq: '#F4F3EF', iqS: '#C9CBD2', iqD: '#9EA2AD', iqCap: '#2B2F3A', ember: '#FF6A2A', heat: '#FFB36A',
    graph: '#2B2E36', graph2: '#343844', lab: '#123A3E', labD: '#0B2427', labL: '#1F4E52', teal: '#7ED6CF',
    green: '#17A86B', red: '#C8102E', redD: '#93091F', gold: '#C9A24A', blue: '#2F6FD6', bp: '#1D3F8F', bpL: '#2E58B8', ocean: '#1F3D7A', oceanL: '#2C5296',
  };
  // наша плашка (как в главе 3): светлая, тёмные буквы
  function cap4(c, s, x, y, k, o = {}) { plate(c, s, x, y, bo(k), { s: o.s || 50, bg: o.bg || '#F4F1EA', c: o.c || '#141010', ls: o.ls ?? 3, w: o.w || 800, r: o.r, a: o.a }) }
  // плашка в экранных координатах (поверх кадра, пока камера едет)
  function capS(c, s, x, y, k, o) { if (k <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); cap4(c, s, x, y, k, o); c.restore() }
  // держатель IQOS 2014 года, горизонтально: центр (x, y), длина L; белый, скруглённый, бок темнее, блик; o.stick — стик торчит справа (0..1), o.cut — разрез (тонкие линии), o.ang — поворот
  let HIDE_H = false;   // v21.2: на переезде витрина → машина держатель рисуется поверх кадра, в мирах — нет
  function iqos4(c, x, y, L, o = {}) {   // v21.2: один держатель на весь ролик — объём цилиндра, металлический ободок у колпачка, IQOS по центру, огоньки у дальнего края
    const h = L * .2, r = h * .5, lf = o.left ? -1 : 1; c.save(); c.translate(x, y); if (o.ang) c.rotate(o.ang);
    if (o.shadow !== false) { rasterPoly(c, [-L / 2 + 10, h / 2, L / 2, h / 2, L / 2 + h * .9, h * 1.15, -L / 2 + 10 + h * .9, h * 1.15], o.shc || 'rgba(6,8,24,.4)', 9, 2.3);
      c.beginPath(); c.ellipse(0, h * .5, L * .48, h * .16, 0, 0, TAU); fill(c, 'rgba(6,8,24,.35)') }   // тень касания — под корпусом
    const st = o.stick ?? 0;
    if (st > 0) {   // стик: бумага, табачный торец снаружи; o.left — стик торчит слева
      const sl = L * .34 * st, sx = o.left ? -L / 2 + 8 - sl : L / 2 - 8; rr(c, sx, -h * .2, sl, h * .4, 4); fill(c, '#F7F4EC'); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(sx, h * .06, sl, h * .14);
      c.fillStyle = '#C9A266'; const tw0 = Math.min(sl, h * .5); c.fillRect(o.left ? sx : sx + sl - tw0, -h * .2, tw0, h * .4);
      if (o.brand) tx(c, 'Marlboro', sx + sl * .5, 1, { f: 'P', w: 700, st: 'italic', s: h * .26, c: 'rgba(176,18,44,.8)' });
    }
    const body = cc => rr(cc, -L / 2, -h / 2, L, h, r);
    if (o.cut) { body(c); c.fillStyle = 'rgba(190,225,250,.13)'; c.fill(); body(c); lnB(c, 3, 'rgba(220,240,255,.9)'); rr(c, -L / 2 + 12, -h / 2 + 12, L - 24, h - 24, r - 10); lnB(c, 1.6, 'rgba(220,240,255,.45)') }
    else {
      body(c); const g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.3, C4.iq); g.addColorStop(.72, C4.iqS); g.addColorStop(1, C4.iqD); c.fillStyle = g; c.fill();
      c.save(); body(c); c.clip();
      rr(c, -L / 2 + r * .8, -h * .34, L - r * 1.6, h * .13, h * .06); fill(c, 'rgba(255,255,255,.85)');   // блик вдоль цилиндра
      const cx0 = lf * (L / 2 - L * .17); c.fillStyle = 'rgba(40,44,58,.16)'; c.fillRect(lf > 0 ? cx0 : -L / 2, -h, L * .17, h * 2);   // колпачок чуть темнее
      const mg = c.createLinearGradient(0, -h / 2, 0, h / 2); mg.addColorStop(0, '#E9ECF2'); mg.addColorStop(.45, '#8E95A6'); mg.addColorStop(.6, '#D8DCE5'); mg.addColorStop(1, '#6B7180');
      c.fillStyle = mg; c.fillRect(cx0 - 4, -h, 8, h * 2);   // металлический ободок
      for (let i = 0; i < 3; i++) circ(c, -lf * (L / 2 - L * .06 - i * L * .042), h * .05, Math.max(1.6, h * .06), i < (o.leds ?? 3) ? '#8FD3FF' : '#8E95A6');   // огоньки заряда — у дальнего края
      c.restore(); body(c); lnB(c, 2.5, 'rgba(20,23,51,.35)');
      if (o.name !== false) tx(c, OBJ.iqos, 0, h * .04, { f: 'M', w: 800, s: h * .3, c: o.glow ? mixc('#7A7F8E', '#1B1A18', o.glow) : '#7A7F8E', ls: Math.max(1, h * .06) });
    }
    c.restore();
  }
  // v21.2: пачка Marlboro в объёме — лицо, крыша и бок в 3 тона (свет слева сверху), шов крышки Flip-Top, растровая тень 35°;
  // (x, y) — левый верхний угол лица, w × h — лицо, o.d — глубина, o.lid 0..1 — крышка откинута назад (видно золотую фольгу и фильтры), o.glow — имя загорается
  function pack3(c, x, y, w, h, o = {}) {
    const T = C3, d = o.d ?? w * .4, a = (o.ang ?? 22) * Math.PI / 180, dx = d * Math.cos(a), dy = -d * Math.sin(a), cut = h * .27, lid = o.lid || 0;
    if (o.shadow !== false) castDots(c, x + 6, y + h - 6, w + dx, 12, h * .55, { k: .9, col: o.shc || 'rgba(6,8,24,.5)' });
    // бок (правый): верх — красная крышка, низ — белый в тени; шов крышки — наискосок
    PL(c, [x + w, y + h, x + w + dx, y + h + dy, x + w + dx, y + dy + (lid ? cut : 0), x + w, y + (lid ? cut : 0)], '#C9C2B6');
    if (!lid) { PL(c, [x + w, y, x + w + dx, y + dy, x + w + dx, y + dy + h * .36, x + w, y + h * .36], T.redD); SL(c, [x + w, y + cut, x + w + dx, y + dy + cut * .62], 'rgba(0,0,0,.35)', 1.5) }
    // лицо
    c.fillStyle = T.white; c.fillRect(x, y + (lid ? cut : 0), w, h - (lid ? cut : 0));
    if (!lid) PL(c, [x, y, x + w, y, x + w, y + h * .36, x + w / 2, y + h * .13, x, y + h * .36], T.red);
    else { c.save(); c.beginPath(); c.rect(x, y + cut, w, h); c.clip(); PL(c, [x, y, x + w, y, x + w, y + h * .36, x + w / 2, y + h * .13, x, y + h * .36], T.red); c.restore() }
    const gx = x + w / 2, gy = y + h * .17;
    if (!lid) { c.beginPath(); c.ellipse(gx, gy, w * .1, w * .12, 0, 0, TAU); fill(c, T.gold); c.beginPath(); c.ellipse(gx, gy, w * .065, w * .085, 0, 0, TAU); fill(c, T.white);
      tx(c, 'PM', gx, gy + 1, { f: 'P', w: 700, s: Math.round(w * .07), c: T.red }) }
    c.save(); c.translate(gx, y + h * .56); c.scale(1, 1.18); tx(c, 'Marlboro', 0, -h * .02, { f: 'P', w: 700, s: Math.round(w * .2), c: o.glow ? mixc(T.ink, T.red, o.glow) : T.ink }); c.restore();
    tx(c, o.sub || 'FILTER CIGARETTES', gx, y + h * .67, { f: 'M', w: 800, s: Math.round(w * .055), c: T.ink, mw: w * .86 });
    if (o.glow) { c.fillStyle = rgba('#FFD27A', .55 * o.glow); c.fillRect(x + w * .1, y + h * .62, w * .8 * o.glow, 5) }
    if (!lid) { SL(c, [x, y + cut, x + w, y + cut], 'rgba(0,0,0,.22)', 1.5);   // шов крышки Flip-Top
      PL(c, [x, y, x + dx, y + dy, x + w + dx, y + dy, x + w, y], '#E0283F'); SL(c, [x + 4, y - 1, x + w - 2, y - 1], 'rgba(255,255,255,.55)', 2) }   // крыша
    else {   // открыта: срез — золотая фольга и пробковые фильтры, крышка откинута назад
      const y1 = y + cut; PL(c, [x, y1, x + dx, y1 + dy, x + w + dx, y1 + dy, x + w, y1], '#D9C27A');
      for (let i = 0; i < 5; i++) { const fx = x + w * (.14 + i * .18) + dx * .45, fy = y1 + dy * .45; c.beginPath(); c.ellipse(fx, fy, w * .075, w * .075 * .5, 0, 0, TAU); fill(c, T.cork) }
      const lh = cut * (1 - lid * .4); PL(c, [x + dx, y1 + dy, x + w + dx, y1 + dy, x + w + dx * 1.2, y1 + dy - lh, x + dx * 1.2, y1 + dy - lh], T.redD);
      SL(c, [x, y1, x + w, y1], 'rgba(0,0,0,.25)', 1.5) }
    SL(c, [x, y + 2, x, y + h - 2], 'rgba(255,255,255,.7)', 2);
  }
  // пачка стиков Marlboro HeatSticks (эталон главы 3) — v21.2: в объёме
  function heat4(c, x, y, s, gl = 0) { c.save(); c.translate(x, y); c.scale(s, s); pack3(c, -60, -190, 120, 190, { sub: 'HeatSticks', glow: gl, shc: 'rgba(0,0,0,.3)', d: 40 }); c.restore() }
  // коробка IQOS для полки — v21.2: в объёме (лицо, крыша, бок), растровая тень
  function box4(c, x, y, w, h, o = {}) {
    const d = w * .34, dx = d * .93, dy = -d * .37;
    castDots(c, x + 4, y + h - 4, w + dx, 8, h * .45, { k: .8, col: 'rgba(0,0,0,.35)' });
    PL(c, [x + w, y, x + w + dx, y + dy, x + w + dx, y + h + dy, x + w, y + h], '#C9CBD2');
    c.fillStyle = '#F4F3EF'; c.fillRect(x, y, w, h); PL(c, [x, y, x + dx, y + dy, x + w + dx, y + dy, x + w, y], '#FFFFFF');
    tx(c, OBJ.iqos, x + w * .5, y + h * .46, { f: 'M', w: 800, s: w * .2, c: '#3A3F4C', ls: 2 }); c.fillStyle = '#2F6FD6'; c.fillRect(x + w * .2, y + h * .7, w * .6, 4);
    SL(c, [x, y + 1, x + w, y + 1], 'rgba(255,255,255,.8)', 1.5);
  }
  // барабанный счётчик (как в главе 3, #089): строка s в тёмной плашке, цифры в ровных клетках
  function drum4(c, s, x, y, k, o = {}) {
    if (k <= 0) return; const fs = o.s || 76, w = (o.w || 420), h = fs * 1.5;
    c.save(); c.translate(x, y); c.scale(bo(k), bo(k)); rr(c, -w / 2 + 8, -h / 2 + 10, w, h, 16); fill(c, 'rgba(0,0,0,.3)');
    rr(c, -w / 2, -h / 2, w, h, 16); fill(c, o.bg || '#141733'); c.save(); rr(c, -w / 2, -h / 2, w, h, 16); c.clip();
    c.fillStyle = 'rgba(255,255,255,.07)'; c.fillRect(-w / 2, -h / 2, w, h * .45); num(c, s, 0, 4, { f: 'M', w: 800, s: fs, c: o.c || '#fff' }); c.restore();
    if (o.lab) tx(c, o.lab, 0, h / 2 + fs * .42, { f: 'M', w: 800, s: fs * .34, c: o.lc || '#F4F1EA', ls: 3 }); c.restore();
  }
  // пачка долларов (как настоящие купюры: зелёные, полоска, мелко) — для «съела 300 млн»
  function bills4(c, x, y, w, n, burn = 0) {
    for (let i = 0; i < n; i++) { const yy = y - i * 7, b = cl((burn * n - (n - 1 - i)) / 1.2); if (b >= 1) continue;
      c.save(); c.beginPath(); c.rect(x - w / 2 - 20, yy - 30, w + 40 + 1, 60); c.clip();
      const ww = w * (1 - b); rr(c, x - w / 2, yy - 18, ww, 36, 4); fill(c, mixc('#7FA86A', '#3A3330', b)); c.fillStyle = 'rgba(30,60,30,.35)'; c.fillRect(x - w / 2 + ww * .42, yy - 18, ww * .16, 36);
      if (i === n - 1 && b < .5) { const cx0 = x - w / 2 + ww * .5; c.save(); c.globalAlpha *= 1 - b * 2; c.strokeStyle = 'rgba(30,60,30,.45)'; c.lineWidth = 1.5; c.strokeRect(x - w / 2 + 4, yy - 14, ww - 8, 28);
        c.beginPath(); c.ellipse(cx0, yy, 15, 12, 0, 0, TAU); fill(c, '#A9CC92'); tx(c, '$', cx0, yy + 1, { f: 'M', w: 800, s: 18, c: '#2E5A2A' }); tx(c, '100', x - w / 2 + 18, yy - 7, { f: 'M', w: 800, s: 9, c: '#2E5A2A' }); tx(c, '100', x - w / 2 + ww - 18, yy + 8, { f: 'M', w: 800, s: 9, c: '#2E5A2A' }); c.restore() }   // v21.1: видно, что это доллары
      if (b > 0) { c.fillStyle = C4.ember; c.fillRect(x - w / 2 + ww - 6, yy - 18, 6, 36); c.fillStyle = 'rgba(169,162,160,.9)'; c.fillRect(x - w / 2 + ww, yy - 16, 10, 32) }
      c.restore() }
  }
  // шаги камеры по ключам удобнее писать так: K(t, x, y, z)
  const shot4 = (K, t, fn) => fn(camObj(camAt(K, t)));
  // ================= мир A — столик лондонской кофейни (кадр 0, строки 1–3; строки 14–15; петля шортса) =================
  // Кадр 0 (идея Gemini): окно — рассвет и силуэт Биг-Бена, тёмный стол, сложенная газета, пачка Marlboro, чашка чая с паром, косой луч.
  // «пообещал» — газета раскрывается (#088), «британских» — ещё две газеты веером (#119), реклама печатается по словам голоса;
  // «Слово… не сдержал» — разворот сминается в комок, комок катится к краю и падает в темноту под столом — там он станет глобусом (мир B).
  // Строка 14: из карты на столе (мир I) — отъезд, комок-обещание катится обратно; из пачки растёт башня сигарет, из белых фигурок — столбик.
  // Строка 15: комок падает в урну, полную таких же комков; на столе — IQOS и пачка Marlboro. Шортс: на стол ложится свежая газета — кадр 0.
  let TA = null, KA1 = null, KA2 = null, KAL = null;
  const RA = { x: 540, y: 1000, z: 1, r: 0 };   // опорная камера параллакса
  const WIN = { x0: 150, x1: 930, y0: 170, y1: 880 }, TOPY4 = 1060, EDGEY = 1590, FLOORY = 1650, TEND = 1130;
  const PG = { w: 300, h: 420, sx: 540, y: 1140 };   // страницы разворота: левая [240..540], правая [540..840]
  const PACK0 = { x: 120, y: 1290, w: 110, h: 163 }, CUP = { x: 930, y: 1215 }, BIN = { x: 1265, y: 1905, w: 190, h: 255 };
  const MAPA = { x: 690, y: 1350, w: 290, h: 330 };   // карта США (мир I) лежит на столе — в строке 14 и дальше
  const BALL_R = 44, FLOORC = '#3A2B2E';   // v21.2: пол светлее — урна стоит на полу, а не в темноте
  function cafeInit() {
    const w = (s, q, n) => Ws(s, q, n);
    TA = { marl: w('s1', 'мальборо'), poob: w('s1', 'пообещал'), bros: w('s1', 'бросить'), vyk: w('s2', 'выкупил'), brit: w('s2', 'британских'), nashe: w('s2', 'наше'), ob2: w('s2', 'обещание'), my2: w('s2', 'мы'),
      pyt: w('s2', 'пытаемся'), sig2: w('s2', 'сигареты'), slovo: w('s3', 'слово'), sderzh: w('s3', 'сдержал'), brosat: w('s4', 'бросать'),
      obesch: SA('s14') !== null ? w('s14', 'обещание') : null };
    const a = TA;
    a.ball0 = a.sderzh + .05; a.roll1 = a.ball0 + .8; a.fall1 = a.roll1 + .55; a.jAB = a.fall1 + .1;   // комок готов → у края → в темноте
    KA1 = [KY(0, 540, 1000, 1.0), KY(a.poob + .1, 560, 1110, 1.1), KY(a.vyk - .2, 560, 1230, 1.2), KY(a.vyk + .75, 640, 1330, 1.55), KY(a.brit + .6, 540, 1330, .95),
      KY(a.nashe + .55, 690, 1275, 1.98), KY(a.pyt + .5, 690, 1330, 1.88), KY(a.slovo - .3, 680, 1340, 1.72), KY(a.sderzh - .2, 560, 1345, 1.3),
      KY(a.ball0 + .35, 565, 1420, 1.42), KY(a.roll1 + .05, 620, 1650, 1.8), KY(a.jAB, 660, 2050, 2.6)];
    KA1[0].v = [6, 40, .035, 0];   // кадр 0 — уже на ходу (как в главе 3): петля шортса въезжает в него с той же скоростью
  }
  const ballPos = t => {   // комок строк 3–4: (x, y, поворот)
    const a = TA;
    if (t < a.ball0) return [540, 1350, 3];   // v21.2: поворот — с того, на котором кончилось сминание (crumple: e * 3), без скачка граней
    if (t < a.roll1) { const k = eio(at(t, a.ball0, a.roll1)); return [lp(540, 630, k), lp(1350, 1585, k), lp(3, 10.5, k)] }
    const k = eo(at(t, a.roll1, a.fall1)); return [lp(630, 660, k), lp(1585, 1990, k), 10.5 + 2.2 * k];
  };
  // ---------- газета ----------
  function textLines(c, x, y, w, h, n, col, seed) { c.fillStyle = col; for (let i = 0; i < n; i++) { const yy = y + i * h / n; c.fillRect(x, yy, w * (.72 + .28 * H1(seed + i)), Math.max(2, h / n * .42)) } }
  function frontPage(c, x, y, w, h, head, o = {}) {   // первая полоса: шапка, заголовок, колонки, фото
    c.fillStyle = o.paper || C4.paper; c.fillRect(x, y, w, h);
    if (o.red) { c.fillStyle = C4.red; c.fillRect(x + w * .06, y + h * .03, w * .88, h * .1); tx(c, head, x + w / 2, y + h * .082, { f: 'M', w: 800, s: h * .062, c: '#fff', mw: w * .8 }) }
    else tx(c, head, x + w / 2, y + h * .08, { f: 'P', w: 700, s: h * .075, c: C4.inkN, mw: w * .86 });
    c.fillStyle = C4.inkN; c.fillRect(x + w * .06, y + h * .15, w * .88, 2);
    c.fillStyle = 'rgba(27,26,24,.85)'; c.fillRect(x + w * .06, y + h * .18, w * .88, h * .05);
    textLines(c, x + w * .06, y + h * .27, w * .4, h * .66, 16, 'rgba(27,26,24,.38)', 3);
    c.fillStyle = '#9A958C'; c.fillRect(x + w * .52, y + h * .27, w * .42, h * .3); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x + w * .52, y + h * .27, w * .42 * .4, h * .3);
    textLines(c, x + w * .52, y + h * .61, w * .42, h * .32, 8, 'rgba(27,26,24,.38)', 9);
  }
  function adPage(c, x, y, w, h, m1, m2) {   // v21.1: полоса рекламы напечатана целиком (не печатается по буквам); m1, m2 — жёлтый маркер под строками по голосу (0..1)
    c.fillStyle = C4.paperL; c.fillRect(x, y, w, h); c.strokeStyle = 'rgba(27,26,24,.75)'; c.lineWidth = Math.max(1.5, w * .006); c.strokeRect(x + w * .05, y + h * .035, w * .9, h * .93);
    const f1 = { f: 'P', w: 700, s: w * .088, c: C4.inkN, al: 'left', mw: w * .8 }, f2 = { f: 'P', w: 700, st: 'italic', s: w * .057, c: C4.inkN, al: 'left', mw: w * .8 };
    const L = [[OBJ.ad1L[0], .2, f1, m1, 0], [OBJ.ad1L[1], .31, f1, m1, 1], [OBJ.ad2L[0], .44, f2, m2, 0], [OBJ.ad2L[1], .515, f2, m2, 1]];
    for (const [ln, yy, f, m, i] of L) { const k = cl(m * 2 - i); if (k <= 0) continue;   // маркер — под буквами, строка за строкой
      const ww = Math.min(tw(c, ln, f), f.mw) * eio(k) + w * .03, hh = f.s * .78, x0 = x + w * .11 - w * .015, y0 = y + h * yy;
      poly(c, [x0, y0 - hh * .42, x0 + ww, y0 - hh * .5, x0 + ww - 3, y0 + hh * .5, x0 - 2, y0 + hh * .46]); fill(c, 'rgba(255,226,122,.85)') }
    for (const [ln, yy, f] of L) tx(c, ln, x + w * .11, y + h * yy, f);
    textLines(c, x + w * .11, y + h * .6, w * .37, h * .2, 9, 'rgba(27,26,24,.3)', 21); textLines(c, x + w * .52, y + h * .6, w * .37, h * .2, 9, 'rgba(27,26,24,.3)', 27);   // текст объявления — две колонки
    c.fillStyle = 'rgba(27,26,24,.6)'; c.fillRect(x + w * .3, y + h * .835, w * .4, 1.5);
    tx(c, OBJ.ad3, x + w * .5, y + h * .87, { f: 'M', w: 800, s: w * .045, c: C4.inkN, ls: 1, mw: w * .8 });
  }
  function innerLeft(c, x, y, w, h) { c.fillStyle = C4.paper; c.fillRect(x, y, w, h); tx(c, OBJ.news, x + w * .1, y + h * .06, { f: 'M', w: 800, s: h * .035, c: C4.inkN, al: 'left', ls: 2, mw: w * .5 });
    c.fillStyle = 'rgba(27,26,24,.8)'; c.fillRect(x + w * .08, y + h * .1, w * .84, h * .045); c.fillStyle = '#A8A296'; c.fillRect(x + w * .08, y + h * .19, w * .84, h * .24);
    textLines(c, x + w * .08, y + h * .47, w * .4, h * .46, 12, 'rgba(27,26,24,.35)', 31); textLines(c, x + w * .52, y + h * .47, w * .4, h * .46, 12, 'rgba(27,26,24,.35)', 41) }
  // газета целиком: сложена → раскрывается (#088) → разворот; k — раскрытие 0..1
  function newspaper(c, t, k, adK1, adK2) {
    const { w, h, sx, y } = PG;
    rasterPoly(c, [sx - w * k + 20, y + h, sx + w, y + h, sx + w + 90, y + h + 60, sx - w * k + 110, y + h + 60], 'rgba(6,8,24,.4)', 9, 2.3);
    adPage(c, sx, y, w, h, adK1, adK2);
    // обложка поворачивается вокруг корешка: cos > 0 — видна первая полоса над правой страницей, < 0 — оборот обложки (левая страница)
    const a = Math.PI * eio(k), cs = Math.cos(a), lift = Math.sin(a) * 26;
    c.save(); c.translate(sx, y + h / 2 - lift * .4);
    if (cs > 0) { c.scale(cs, 1); c.transform(1, -.06 * Math.sin(a), 0, 1, 0, 0); frontPage(c, 0, -h / 2, w, h, OBJ.heads[0]); c.fillStyle = `rgba(20,16,30,${.35 * (1 - cs)})`; c.fillRect(0, -h / 2, w, h) }
    else { c.scale(cs, 1); c.transform(1, -.06 * Math.sin(a), 0, 1, 0, 0); c.scale(-1, 1); innerLeft(c, -w, -h / 2, w, h); c.fillStyle = `rgba(20,16,30,${.3 * (1 + cs)})`; c.fillRect(-w, -h / 2, w, h) }
    c.restore();
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(sx - 2, y, 4, h);   // корешок
  }
  function fanPapers(c, t, k, out) {   // «британских»: ещё две газеты выезжают веером из-под разворота; в строке 3 уезжают
    if (k <= 0) return; const { w, h, y } = PG, e = eo(k), o = eio(out);
    [[-1, OBJ.heads[1], -.13], [1, OBJ.heads[2], .1]].forEach(([d, head, rot], i) => {
      const cx = 540 + d * lp(150, 390 + 700 * o, e), cy = y + h / 2 + 25 - i * 10;
      c.save(); c.translate(cx, cy); c.rotate(rot * e); rasterPoly(c, [-w / 2 + 20, h / 2, w / 2, h / 2, w / 2 + 70, h / 2 + 45, -w / 2 + 90, h / 2 + 45], 'rgba(6,8,24,.35)', 9, 2.2);
      frontPage(c, -w / 2, -h / 2, w, h, head, { red: true }); adPage(c, -w / 2 + w * .06, -h / 2 + h * .26, w * .88, h * .7, 0, 0); c.restore() });
  }
  function creases(c, R) {   // v21.1: складки смятой бумаги — тонкие ломаные линии (раньше тёмные чёрточки читались как значок «пауза»)
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (let i = 0; i < 6; i++) { const a = H1(i * 7.3 + .4) * TAU, d = R * (.15 + H1(i * 2.1) * .55), L = R * (.35 + H1(i * 4.7) * .3), b = a * 2 + H1(i) * 1.5;
      const x0 = Math.cos(a) * d, y0 = Math.sin(a) * d; c.beginPath(); c.moveTo(x0 - Math.cos(b) * L / 2, y0 - Math.sin(b) * L / 2); c.lineTo(x0 + Math.sin(b) * L * .08, y0 - Math.cos(b) * L * .08); c.lineTo(x0 + Math.cos(b) * L / 2, y0 + Math.sin(b) * L / 2);
      c.strokeStyle = i % 2 ? 'rgba(120,108,92,.42)' : 'rgba(255,255,255,.6)'; c.lineWidth = Math.max(1, R * .025); c.stroke() }
  }
  // комок бумаги (v21.2, ТЗ v212 — без гладкого «мячика»): неровный контур из 13 бугров, грани в 3 тона по свету (свет слева сверху — грани
  // перекрашиваются, пока комок катится), складки, обрывки газетных строк. Тот же комок — в начале глобуса (30-globe.js): контур скругляется
  // (k → 0), грани гаснут, проступает суша — комок одним вращением становится глобусом.
  const CRN = 13, crumpR = (i, k) => 1 + k * (.84 + .22 * H1(i * 5.3 + 1) - 1);
  function crumpPath(c, R, k, rot) { const M = 78; c.beginPath();
    for (let j = 0; j <= M; j++) { const u = j / M * CRN, i = Math.floor(u) % CRN, f = u - Math.floor(u), r = lp(crumpR(i, k), crumpR((i + 1) % CRN, k), f) * R, a = j / M * TAU + rot;
      j ? c.lineTo(Math.cos(a) * r, Math.sin(a) * r) : c.moveTo(Math.cos(a) * r, Math.sin(a) * r) } c.closePath() }
  function crumpFacets(c, R, rot, al) {
    if (al <= 0) return; c.save(); c.globalAlpha *= al; const P = [], Q = [];
    for (let i = 0; i < CRN; i++) { const a = i / CRN * TAU + rot, r = crumpR(i, 1) * R * 1.03; P.push([Math.cos(a) * r, Math.sin(a) * r]);
      const b = (i + .5 + (H1(i * 2.7) - .5) * .5) / CRN * TAU + rot, r0 = R * (.24 + .24 * H1(i * 3.9 + 4)); Q.push([Math.cos(b) * r0, Math.sin(b) * r0]) }
    const tone = (x, y, s) => { const d = (-.72 * x - .69 * y) / R + (H1(s) - .5) * .55; return d > .28 ? '#FCFAF4' : d < -.3 ? '#B8AE9B' : '#E4DDCE' };
    for (let i = 0; i < CRN; i++) { const p1 = P[i], p2 = P[(i + 1) % CRN], q = Q[i], q0 = Q[(i + CRN - 1) % CRN];
      poly(c, [q[0], q[1], p1[0], p1[1], p2[0], p2[1]]); fill(c, tone((q[0] + p1[0] + p2[0]) / 3, (q[1] + p1[1] + p2[1]) / 3, i));
      poly(c, [q0[0], q0[1], p1[0], p1[1], q[0], q[1]]); fill(c, tone((q0[0] + p1[0] + q[0]) / 3, (q0[1] + p1[1] + q[1]) / 3, i + 40));
      if (i % 4 === 1) { c.save(); poly(c, [q[0], q[1], p1[0], p1[1], p2[0], p2[1]]); c.clip(); c.fillStyle = 'rgba(38,40,58,.36)';   // обрывки газетных строк вдоль грани
        [.5, .64, .78].forEach((f, n) => { const x1 = lp(q[0], p1[0], f), y1 = lp(q[1], p1[1], f), x2 = lp(q[0], p2[0], f), y2 = lp(q[1], p2[1], f), w = R * (n ? .032 : .05);
          c.save(); c.translate(lp(x1, x2, .5), lp(y1, y2, .5)); c.rotate(Math.atan2(y2 - y1, x2 - x1)); c.fillRect(-Math.hypot(x2 - x1, y2 - y1) * .38, -w / 2, Math.hypot(x2 - x1, y2 - y1) * (.76 - n * .12), w); c.restore() });
        c.restore() } }
    poly(c, Q.flat()); fill(c, tone(Q.reduce((m, v) => m + v[0], 0) / CRN, Q.reduce((m, v) => m + v[1], 0) / CRN, 99));
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (let i = 0; i < CRN; i++) { const p1 = P[i], q = Q[i], q2 = Q[(i + 1) % CRN];   // складки: тёмная линия сгиба и светлый край
      c.strokeStyle = 'rgba(92,80,62,.5)'; c.lineWidth = Math.max(1, R * .022); c.beginPath(); c.moveTo(q[0], q[1]); c.lineTo(p1[0], p1[1]); c.stroke();
      c.strokeStyle = i % 2 ? 'rgba(255,255,255,.65)' : 'rgba(92,80,62,.35)'; c.lineWidth = Math.max(1, R * .018); c.beginPath(); c.moveTo(q[0], q[1]); c.lineTo(q2[0], q2[1]); c.stroke() }
    c.restore();
  }
  function crumpShade(c, R) { c.fillStyle = 'rgba(14,16,40,.28)'; c.beginPath(); c.arc(0, 0, R * 1.25, -Math.PI * .35, Math.PI * .65); c.arc(R * .18, 0, R * .9, Math.PI * .65, -Math.PI * .35, true); c.fill() }
  function paperBall(c, x, y, R, rot = 0, o = {}) {
    c.save(); c.translate(x, y);
    if (o.shadow !== false) { c.save(); c.scale(1, .3); circ(c, R * .35, R * 3.3, R * 1.05, 'rgba(6,8,24,.35)'); c.restore() }
    crumpPath(c, R, 1, rot); c.fillStyle = C4.paper; c.fill(); c.save(); crumpPath(c, R, 1, rot); c.clip(); crumpFacets(c, R, rot, 1); crumpShade(c, R); c.restore();
    crumpPath(c, R, 1, rot); lnB(c, Math.max(1.5, R * .045), 'rgba(238,241,248,.55)'); c.restore();
  }
  // разворот сминается в комок: k 0..1
  function crumple(c, t, k) {
    const cx = 540, cy = PG.y + PG.h / 2, n = 28, e = eio(k), R1 = BALL_R;
    const pts = []; for (let i = 0; i < n; i++) { const u = i / n, a = u * TAU, rx = PG.w, ry = PG.h / 2, sq = Math.max(Math.abs(Math.cos(a)) / rx, Math.abs(Math.sin(a)) / ry), r0 = 1 / sq;
      const r = lp(r0, R1 * (1 + (H1(i * 3.1) - .5) * .25), e) * (1 + (H1(i * 7.7 + 2) - .5) * .35 * Math.sin(Math.PI * e)); pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r) }
    if (e < .97) { c.save(); poly(c, pts); c.clip(); c.translate(cx, cy); c.rotate(e * .5); c.scale(1 - e * .82, 1 - e * .82); c.translate(-cx, -cy);
      innerLeft(c, 240, PG.y, PG.w, PG.h); adPage(c, 540, PG.y, PG.w, PG.h, 1, 1); c.restore();
      c.save(); poly(c, pts); c.clip(); for (let i = 0; i < 14; i++) { const a = H1(i * 4.3) * TAU, L = PG.w * (1 - e) + 60; c.save(); c.translate(cx + (H1(i * 1.7) - .5) * PG.w * (1 - e), cy + (H1(i * 2.9) - .5) * PG.h * (1 - e)); c.rotate(a);
        poly(c, [0, 0, L, -18, L, 18]); fill(c, i % 2 ? `rgba(30,24,40,${.16 * e})` : `rgba(255,255,255,${.3 * e})`); c.restore() } c.restore();
      poly(c, pts); lnB(c, 2.5, `rgba(238,241,248,${.35 * e})`) }
    if (e > .85) A(c, (e - .85) / .15, () => paperBall(c, cx, cy, R1, e * 3, { shadow: false }));
  }
  // ---------- стол, окно, чашка, урна ----------
  function cafeFar(c, t) {   // за окном: рассвет полосами, солнце, крыши, Биг-Бен (дальний план)
    const B = C4.dawn, y0 = WIN.y0 - 260, y1 = WIN.y1 + 140, bh = (y1 - y0) / B.length;
    B.forEach((col, i) => { c.fillStyle = col; c.fillRect(-1400, y0 + i * bh, 3900, bh + 1) });
    circ(c, 330, 812, 70, '#F7CB78'); circ(c, 330, 812, 52, '#FBE2A8');
    c.fillStyle = 'rgba(255,214,150,.25)'; for (let i = 0; i < 3; i++) c.fillRect(-1400, WIN.y1 - 130 + i * 26 + Math.sin(t * .4 + i) * 4, 3900, 6);
    const bx = 735, by = 870; c.fillStyle = C4.ben;   // Биг-Бен: башня, часы, шпиль
    c.fillRect(bx - 34, by - 440, 68, 440); c.fillRect(bx - 44, by - 470, 88, 60); poly(c, [bx - 44, by - 470, bx + 44, by - 470, bx + 26, by - 540, bx - 26, by - 540]); fill(c, C4.ben);
    poly(c, [bx - 12, by - 540, bx + 12, by - 540, bx, by - 640]); fill(c, C4.ben); circ(c, bx, by - 405, 26, '#E9C88A'); circ(c, bx, by - 405, 21, '#F6E2B4');
    c.strokeStyle = C4.ben; c.lineWidth = 3; c.beginPath(); c.moveTo(bx, by - 405); c.lineTo(bx, by - 421); c.moveTo(bx, by - 405); c.lineTo(bx + 11, by - 401); c.stroke();
    poly(c, [-400, by, -400, by - 90, 90, by - 90, 110, by - 130, 160, by - 130, 180, by - 100, 470, by - 100, 490, by - 150, 520, by - 150, 540, by - 110, 690, by - 110, 690, by - 150, 790, by - 150, 790, by - 120, 1000, by - 120, 1020, by - 160, 1060, by - 160, 1080, by - 95, 1500, by - 95, 1500, by]); fill(c, C4.roofs);
    c.fillStyle = 'rgba(247,203,120,.55)'; for (let i = 0; i < 16; i++) { const wx = -200 + i * 105 + (i % 3) * 14, wy = by - 70 + (i % 2) * 22; if (H1(i * 3.3) > .45) c.fillRect(wx, wy, 10, 14) }
  }
  function cafeWall(c, t) {
    c.save(); c.beginPath(); c.rect(-3000, -2000, 7000, TOPY4 + 2000); c.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); c.fillStyle = C4.wall; c.fill('evenodd'); c.restore();
    c.fillStyle = C4.wallD; c.fillRect(-3000, 930, 7000, TOPY4 - 930); c.fillStyle = 'rgba(255,255,255,.04)'; for (let x = -2900; x < 4000; x += 120) c.fillRect(x, 940, 4, TOPY4 - 950);   // панели под окном
    const f = 22; c.fillStyle = C4.woodE; c.fillRect(WIN.x0 - f, WIN.y0 - f, WIN.x1 - WIN.x0 + f * 2, f); c.fillRect(WIN.x0 - f, WIN.y0, f, WIN.y1 - WIN.y0); c.fillRect(WIN.x1, WIN.y0, f, WIN.y1 - WIN.y0);
    c.fillStyle = C4.woodE; c.fillRect(538 - 6, WIN.y0, 12, WIN.y1 - WIN.y0); c.fillRect(WIN.x0, 520, WIN.x1 - WIN.x0, 10);
    c.fillStyle = C4.woodD; c.fillRect(WIN.x0 - 40, WIN.y1, WIN.x1 - WIN.x0 + 80, 34); c.fillStyle = C4.woodL; c.fillRect(WIN.x0 - 40, WIN.y1, WIN.x1 - WIN.x0 + 80, 6);
    c.save(); c.beginPath(); c.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); c.clip(); glint(c, WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0, .06); c.restore();
  }
  function cafeTable(c, t) {
    c.fillStyle = C4.wallD; c.fillRect(TEND, TOPY4 - 2, 3000, FLOORY - TOPY4 + 2); c.fillStyle = 'rgba(255,255,255,.04)'; for (let x = TEND + 40; x < 4000; x += 120) c.fillRect(x, TOPY4, 4, FLOORY - TOPY4 - 30);
    c.fillStyle = C4.woodE; c.fillRect(TEND, FLOORY - 30, 3000, 30);   // плинтус
    c.fillStyle = FLOORC; c.fillRect(-3000, FLOORY, 7000, 3000); c.fillStyle = 'rgba(255,255,255,.07)'; for (let i = 0; i < 14; i++) c.fillRect(-3000, FLOORY + 40 + i * 70 + i * i * 4, 7000, 4);   // доски пола
    c.fillStyle = 'rgba(0,0,0,.18)'; for (let x = -3000; x < 4000; x += 230) c.fillRect(x, FLOORY, 3, 3000); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(-3000, FLOORY, 7000, 26);   // стыки досок, тень под столом
    c.fillStyle = C4.wood; c.fillRect(-3000, TOPY4, 3000 + TEND, EDGEY - TOPY4); c.fillStyle = C4.woodL; c.fillRect(-3000, TOPY4, 3000 + TEND, 10);
    c.strokeStyle = 'rgba(40,24,14,.35)'; c.lineWidth = 3; c.beginPath(); for (let i = 0; i < 9; i++) { const yy = TOPY4 + 40 + i * 58; c.moveTo(-3000, yy); for (let x = -3000; x < TEND; x += 160) c.lineTo(x + 80, yy + Math.sin(x * .013 + i) * 5) } c.stroke();
    c.fillStyle = C4.woodD; c.fillRect(-3000, EDGEY, 3000 + TEND, FLOORY - EDGEY); c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(-3000, EDGEY, 3000 + TEND, 4);
    PL(c, [TEND, TOPY4, TEND + 26, TOPY4 + 14, TEND + 26, FLOORY + 10, TEND, FLOORY], C4.woodE);   // торец стола справа
    c.fillStyle = C4.woodE; c.fillRect(TEND - 60, FLOORY, 34, 900);   // ножка
  }
  function cup(c, t, tau, sk = 1) {   // sk — сколько видно пара (v21.1: пока чашку закрывает газета, пар не идёт сквозь бумагу)
    const { x, y } = CUP; c.save(); c.translate(x, y);
    c.beginPath(); c.ellipse(10, 58, 120, 26, 0, 0, TAU); fill(c, 'rgba(6,8,24,.35)'); c.beginPath(); c.ellipse(0, 50, 112, 24, 0, 0, TAU); fill(c, '#E9E5DD'); c.beginPath(); c.ellipse(0, 46, 84, 15, 0, 0, TAU); fill(c, '#D5D0C6');
    c.beginPath(); c.moveTo(-62, -50); c.lineTo(62, -50); c.quadraticCurveTo(60, 40, 0, 44); c.quadraticCurveTo(-60, 40, -62, -50); c.closePath(); cel(c, -62, -50, 124, 94, '#F4F1EA', { sw: .28, hx: .12 });
    c.beginPath(); c.ellipse(0, -50, 62, 13, 0, 0, TAU); fill(c, '#EDE8DF'); c.beginPath(); c.ellipse(0, -48, 54, 9, 0, 0, TAU); fill(c, '#8A4E24'); c.beginPath(); c.ellipse(-12, -50, 20, 3, 0, 0, TAU); fill(c, 'rgba(255,220,170,.35)');
    c.beginPath(); c.arc(70, -12, 24, -1.3, 1.3); lnB(c, 11, '#E3DED4'); c.restore();
    for (let i = 0; i < 2; i++) { const u = (tau * .22 + i * .5) % 1, sx = x - 18 + i * 34; if (sk > 0) smokeLine(c, [sx, y - 66, sx + 16 + Math.sin(tau * 1.3 + i) * 14, y - 150, sx - 6, y - 240, sx + 20 + Math.sin(tau + i) * 10, y - 330], 6, '#F4F1EA', .38 * sk * Math.sin(Math.PI * (.25 + .75 * u))) }
  }
  function bin(c, t, n = 7) {   // урна на полу справа от стола: металл в 3 тона, в ней — такие же комки
    const { x, y, w, h } = BIN, top = y - h; c.beginPath(); c.ellipse(x + 26, y + 6, w * .62, 22, 0, 0, TAU); fill(c, 'rgba(8,6,12,.5)');   // тень на полу
    for (let i = 0; i < n; i++) paperBall(c, x - w * .32 + (i % 4) * w * .21 + (i > 3 ? w * .1 : 0), top + 8 - (i > 3 ? 46 : 14) - H1(i) * 12, 40 + H1(i * 3) * 8, i * 1.3, { shadow: false });
    poly(c, [x - w / 2, top, x + w / 2, top, x + w * .42, y, x - w * .42, y]); cel(c, x - w / 2, top, w, h, '#5A5F72', { sw: .3, hx: .1 });
    c.strokeStyle = 'rgba(20,23,51,.45)'; c.lineWidth = 4; c.beginPath(); for (let i = 1; i < 6; i++) { const u = i / 6; c.moveTo(x - w / 2 + w * u, top); c.lineTo(x - w * .42 + w * .84 * u, y) } c.stroke();
    rr(c, x - w / 2 - 8, top - 10, w + 16, 22, 10); fill(c, '#7A8096'); rr(c, x - w / 2 - 8, top - 10, w + 16, 22, 10); lnB(c, 2.5, 'rgba(238,241,248,.4)');
  }
  function beamA(c, t, tau) {   // косой луч из окна и пылинки в нём (передний план)
    c.save(); poly(c, [WIN.x0 + 40, WIN.y1 - 120, 520, WIN.y1 - 120, 1150, FLOORY, 300, FLOORY]); c.fillStyle = 'rgba(255,214,150,.06)'; c.fill(); c.clip();
    for (let i = 0; i < 26; i++) { const px = 200 + H1(i * 3.7) * 900 + Math.sin(tau * .3 + i) * 30, py = 700 + ((H1(i * 5.1) * 1000 + tau * (12 + H1(i) * 14)) % 1000); circ(c, px, py, 1.5 + H1(i * 2) * 1.8, `rgba(255,236,200,${.2 + .16 * Math.sin(tau + i)})`) }
    c.restore();
  }
  // ---------- строка 14: башня пачек и толпа пользователей ----------
  // v21.2 (ТЗ v212): красная башня — стопка объёмных пачек Marlboro (не «блины»), не выше 5 пачек — верх не доходит до плашки года;
  // 32 млн — плотная толпа бюстов рядами (не колонны «акробатов»), сверху — IQOS. В фильме башня и толпа остаются на столе до конца.
  function bust4(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(-23, 0); c.quadraticCurveTo(-22, -24, 0, -26); c.quadraticCurveTo(22, -24, 23, 0); c.closePath(); fill(c, col);
    circ(c, 0, -38, 13, col); c.fillStyle = 'rgba(0,0,0,.1)'; c.fillRect(8, -24, 15, 24); c.restore() }
  function towers(c, t) {
    const a = TB4; if (!a || t < a.tri - .1) return;
    const out = MODE === 'y' ? 0 : eio(at(t, a.brosaj - .25, a.brosaj + .25)), kr = eio(at(t, a.sig - .05, a.shest + .8)) * (1 - out), kw = eio(at(t, a.tri - .05, a.tri + 1.4)) * (1 - out);
    const px = PACK0.x - packOff(t), NP = 5, ph = PACK0.h * .98;
    if (kr > 0) { const nf = kr * NP; for (let i = 1; i <= Math.ceil(nf - 1e-6); i++) { const f = cl(nf - (i - 1)), drop = (1 - eo(f)) * 260, wob = (H1(i * 3.3) - .5) * 14;
      c.save(); c.globalAlpha *= Math.min(1, f * 3); pack3(c, px + wob, PACK0.y - i * ph - drop, PACK0.w, PACK0.h, { d: 46, shadow: false }); c.restore() } }
    if (kw > 0) { const cx = 330, rows = Math.round(kw * 8);
      for (let r = rows - 1; r >= 0; r--) { const col = mixc(r % 2 ? '#E9E5DD' : '#F4F1EA', '#9A97A8', r * .07); for (let j = 0; j < 4; j++) bust4(c, cx - 75 + j * 50 + (r % 2) * 22 - 11, 1452 - r * 40, 1, col) }
      if (kw > .95) iqos4(c, cx, 1452 - rows * 40 - 70, 150, { shadow: false }) }
  }
  const packOff = t => 160 * eio(at(t, TA.bros - .05, TA.bros + .55)) - (TB4 ? 90 * eio(at(t, TB4.chet - .7, TB4.chet - .1)) + 70 * eio(at(t, TB4.vy - .3, TB4.vy + .35)) : 0);   // пачка уехала влево на «бросить» (целиком из кадра), в строке 14 вернулась к краю, на «вы» — на место
  function cafeWorld(c, t, tau, st = {}) {   // tau — «своё» время мира: пар, пыль (для петли шортса — t − TL0)
    cafeTable(c, t); bin(c, t, st.binN ?? 7);
    if (st.map) st.map(c);   // карта США лежит на столе (строки 14–17) — под пачкой и чашкой
    const a = TA;
    pack3(c, PACK0.x - packOff(t), PACK0.y, PACK0.w, PACK0.h, { d: 46, glow: eo(at(t, a.marl - .05, a.marl + .3)) * (1 - at(t, a.bros, a.bros + .4)) });   // v21.2: пачка в объёме
    cup(c, t, tau, 1 - at(t, a.brit - .15, a.brit + .25) * (1 - at(t, a.slovo + .25, a.slovo + .7)));
    if (st.paper !== false) {
      if (t < a.slovo) { const k = eio(at(t, a.poob - .05, a.poob + .55)); fanPapers(c, t, at(t, a.brit - .1, a.brit + .55), 0);
        newspaper(c, t, k, at(t, a.nashe - .08, a.ob2 + .5), at(t, a.my2 - .08, a.sig2 + .45)) }
      else if (t < a.ball0) { fanPapers(c, t, 1, at(t, a.slovo - .1, a.slovo + .5)); crumple(c, t, at(t, a.slovo, a.ball0)) }
      else if (t < a.jAB + .5) { const [bx, by, br] = ballPos(t); paperBall(c, bx, by, BALL_R, br, { shadow: by < EDGEY }) }
    }
    if (st.after) st.after(c);
  }
  function cafePlates1(c, t) { const a = TA; capS(c, TEXT.promise, 540, 300, at(t, a.nashe + .15, a.nashe + .45) * (1 - at(t, a.slovo - .35, a.slovo - .05)), { s: 50 }) }
  function cafeShot(c, t, K, tau, st) {   // K — ключи камеры или готовая камера {x, y, z, r} (фото на доске)
    const q = Array.isArray(K) ? camObj(camAt(K, t)) : K;
    layerRel(c, q, RA, .38, cc => cafeFar(cc, tau));
    layer(c, q, 1, cc => { cafeWall(cc, t); cafeWorld(cc, t, tau, st) });
    layerRel(c, q, RA, 1.22, cc => A(cc, 1 - at(Math.log(q.z), .62, 1.05), () => beamA(cc, t, tau)));   // луч с пылью — только на общих планах: при наезде на карту его нет
    return q;
  }
  // ================= мир B — бумажный глобус (строка 4): комок падает в темноту, складки становятся материками (#039, #179) =================
  // Луч радара обходит глобус; на «Нагое» загорается точка с силуэтом замка, на «Милане» — с силуэтом собора. Камера ныряет в точку Нагои — в ней витрина (мир C).
  let TB = null, KB = null, NBC = null;
  const GB = { x: 540, y: 960, R: 400, lat0: 52 }, D2R = Math.PI / 180;
  // материки (долгота, широта) — упрощённо, по крупным изгибам берега
  const LAND = [
    [-9.5,37,-9,43,-1.5,43.5,-4.5,48.5,-1.5,49.5,2,51,4.5,53,8.5,53.8,8,57,10.5,57.6,5,59,5.5,62,10,64,14,67.5,19,70,26,71,31,70,33,69,40.5,67,44,68.5,53,68.5,60,69,68,69,69,73,80,73.5,87,75,100,77,113,74,128,72,140,72.5,150,71,160,69.5,170,70,180,68.5,185,67,190,66,182,64.5,178,62.5,170,60,163,58.5,162,56,156.5,51,156,57.5,151,59.5,143,59.3,137,54.5,141,53,140.5,48.5,135,43.5,131,42.5,129.5,40.5,129.5,36,126.5,34.5,126,37.5,124.5,39.8,121.5,40.8,121.5,39,118,39,119.5,37,122.5,37,120.5,35,121.9,30.9,121,28,119.5,26,117,23.5,114,22.3,110,21,108.5,21.6,106.5,20,106,18,108.5,15.5,109.3,12.5,107,10.5,105,8.7,104.5,10.5,102.5,12.2,100.5,13.5,99,10,100.5,6,103.5,1.4,101,3,98.5,8,98,16,96,17,94.2,16,94,19,92.5,21,90,22,87,21.5,86,20,80.3,15.5,80,10,77.5,8,76.5,9.5,74.5,14,73,18.5,72.8,21,70,22.5,68.5,23.5,66.5,25.4,61.5,25.2,57.5,25.7,56.4,27,54,26.7,51.5,27.9,50,29.5,48,30,48.4,28.5,50,26.5,51.6,25,51.2,24.2,54,24.2,56.3,26.2,56.4,24.5,57.8,23.6,59.8,22.5,58.5,20.4,57,18.9,55,17,52,15.6,48.8,14,45,12.8,43.5,12.6,42.7,15.5,41.2,18.5,39.1,21.5,38.5,23.6,37,25.5,35.2,28,34.6,29.5,34.2,31.3,34.9,32.8,35.9,35.5,36,36.8,32.8,36.1,30.6,36.6,29,36.7,27.3,37.3,26.3,39.4,26.6,40.6,24,40.9,22.9,40.4,23.3,39.2,22.6,37.9,21.6,36.8,21.1,38.3,19.5,40.6,19.4,41.9,18.5,42.5,16,43.5,13.6,45.6,12.3,45.2,12.4,44.2,13.7,43.3,14.2,42.2,16,41.4,18.5,40.2,17,39,16.6,38.4,15.6,37.9,15.7,38.8,16.1,39.7,15.6,40.1,14.9,40.4,14,40.9,12.8,41.4,11.1,42.4,10.3,43.5,8.8,44.4,7.4,43.7,6,43.1,4.5,43.4,3.1,43,3.2,41.9,.8,40.8,-.3,39.4,.2,38.7,-.7,37.6,-2.1,36.7,-4.4,36.7,-5.6,36,-6.4,36.8,-7.4,37.2,-8.9,37],
    [-17,14.7,-16.5,19.5,-17,21,-15,24.5,-13,27.7,-9.8,30,-9.7,32.5,-6.8,34,-5.9,35.8,-2,35.1,3,36.8,9.5,37.3,11,36.8,10.2,34.3,11.4,33.3,15.2,32.3,19.9,30.9,20.1,32.1,23.1,32.6,25.2,31.6,29,30.8,32.3,31.3,32.6,29.9,34,26.6,35.6,23.9,37.2,21,38.5,18,39.7,15.5,41.7,13.3,43.3,12.2,44.5,10.4,47.5,11.2,51.3,11.8,50.7,9,48,4.5,44,1,41.6,-1.7,39.4,-5,39.5,-8,40.5,-11,40.4,-15,37,-18,35.3,-22,35.5,-24,32.8,-26,32.4,-28.6,30,-31.3,27,-33.6,22,-34,18.4,-34.2,17.8,-31,15,-27,14.5,-22.5,11.8,-17.5,12.3,-13,13.5,-10,12.2,-6,9.6,-2.4,9.6,2,9.7,4,6.5,4.3,4.5,6.3,1,6,-2,4.9,-4,5.2,-7.5,4.4,-9.5,5.8,-11.5,6.9,-13.2,8.8,-15,11,-16.8,12.5],
    [-5.7,50,1.5,51.2,1.7,52.7,.2,53.5,-1.2,54.6,-1.6,55.6,-2.1,56.5,-1.8,57.6,-3.3,58.6,-5,58.6,-6.2,56.8,-5.6,55.4,-4.9,54.8,-3.1,54.5,-3,53.3,-4.6,53.3,-4.2,52.2,-5.3,51.8,-3.1,51.4,-4.2,51.1],
    [-6,52,-6.2,53.5,-6,55.2,-7.5,55.3,-8.3,54.6,-10,54.2,-9.5,53,-10.3,51.8,-8.2,51.6,-6.4,52.2],
    [130.2,33.6,131,34.4,132.5,35.4,134,35.6,135.6,35.7,136.8,36.9,137.4,36.8,138.4,37.7,139.5,38.6,140,39.8,139.9,40.6,140.9,41.5,141.5,40.6,142,39.4,141,38.3,140.9,37,140.6,35.7,139.8,34.9,138.8,34.6,137,34.6,136,33.7,135.1,34.3,134.2,33.2,132.6,32.8,131.6,31.4,130.6,31.2,129.8,32.6],
    [140,41.4,139.8,42.6,141.4,43.4,141.8,45.4,143.2,44.2,145.4,43.4,143.3,42,141,42.4],
    [142,46,141.8,49,142.5,53.5,143.2,52,143,49,143.6,46.5],
    [12.4,38,15.6,38.3,15.1,36.7,12.5,37.6], [79.9,6,80,9.6,81.8,7.5,80.6,5.9],
    [95.3,5.6,98.5,3.7,103.8,-1,106,-3.2,105.8,-5.8,104.5,-5.9,101,-2.8,97.5,2],
    [109,1.5,110.5,1.8,113,3.2,115.5,5.5,117,7,119.2,5.3,118,1,116,-3.5,114.5,-3.8,110.2,-2.9,109,-.5],
    [-73,78,-60,82,-30,83.5,-18,81.5,-20,75,-22,70.5,-32,68.2,-40,65,-43,60,-48,61,-52,65,-54,70,-58,75.5,-66,76.5],
    [-24,65.5,-22,66.4,-16,66.5,-13.5,65.2,-15,64.2,-20,63.4,-22.5,63.8],
    [-168,66,-162,70,-156,71.3,-141,69.7,-128,70,-115,68.5,-100,68,-94,71.5,-85,69.5,-82,66,-88,64,-93,60,-95,58.5,-90,57,-82,55,-80,51.5,-78,56,-77,60,-73,62,-65,60,-61,56,-56,52,-59,48,-64,47,-67,45,-70,43,-70,41.5,-74,40.5,-76,37,-76,35,-81,31.5,-80,25.5,-82,27,-83,29.5,-85,30,-89,30,-93,29.6,-97,27.8,-97.5,22,-95,18.5,-91,19,-90.5,21,-87,21.5,-88.5,17,-84,15,-83,10,-80,8.5,-77.5,8,-84,9,-86,11.5,-88,13,-92,14.5,-96,16,-105,19.5,-105.5,22.5,-110,23.5,-112.2,28,-114.8,31.8,-117.1,32.6,-120.6,34.5,-122.5,37.8,-124.2,40.5,-124.1,46.2,-124.7,48.4,-127.5,50.5,-130.5,54.5,-134,58,-137.5,58.5,-140,59.8,-146,60.8,-152,59.2,-154,57.5,-158,56.5,-158,58.6,-162,60,-165,62.5,-164,64.5],
  ];
  const LAKES = [   // моря внутри материка — цветом океана поверх суши
    [27.5,42.5,28.6,44,29.7,45.2,31.6,46.6,33.5,44.5,36.6,45.3,37.6,44.6,39.7,43.5,41.6,41.6,37.5,41.1,34.9,42,31.5,41.2,29.1,41.2],
    [47,44.5,49.5,46.5,52.5,46.8,53,45,51.3,43.2,52.7,41.7,54,40,53.8,37.4,50.3,37.3,49,38.5,49.6,40.2,48.6,41.8],
    [10.5,54.3,14,53.9,19,54.4,21,56.5,24,57.2,23.5,59.3,30,60,25,60.4,21.5,60.7,21.4,63.6,25.4,65,22.3,65.8,17.8,62.5,18.4,60.2,16.5,57.3,14.2,55.4,12.5,56.2,11,55.6],
  ];
  const NAGOYA = [136.9, 35.2], MILAN = [9.2, 45.5];
  // v21.2: Италия подробнее (сапог, Сицилия, Сардиния) — подсвечивается на «итальянском», Япония (Хонсю, Хоккайдо) — на «японской»
  const ITALY = [[7.5,43.8,8.2,44,8.8,44.4,9.8,44.1,10.3,43.5,10.5,42.9,11.1,42.4,11.6,42.3,12.3,41.7,12.8,41.4,13.6,41.2,14,40.9,14.4,40.6,14.9,40.4,15.6,40.1,15.7,39.9,16.1,39.7,16,39.2,15.8,38.9,15.6,38.2,15.9,38,16.2,38.3,16.6,38.6,17.1,39,17.2,39.4,16.6,39.8,16.9,40.4,17.5,40.3,18,40.1,18.5,40.1,18.4,40.4,17.9,40.7,17,41.1,16.1,41.5,15.9,41.9,15.2,41.9,14.5,42.2,14,42.7,13.6,43.5,12.6,44.1,12.3,44.8,12.4,45.4,13.1,45.7,13.7,45.6,13.8,46.4,12.6,46.7,11,46.8,10.4,46.5,9.3,46.5,8.5,46.2,7,45.9,6.9,45.2,7.6,44.2],
    [12.4,38,13.4,38.2,14.5,38,15.6,38.3,15.1,37.5,15.1,36.7,14.4,36.8,12.5,37.6], [8.4,39,9,39.1,9.6,39.2,9.8,40.5,9.4,41.2,8.6,41,8.2,40.6,8.4,40]];
  function gProj(lon, lat, lon0, lat0 = GB.lat0) {   // ортографическая проекция → [x, y (вниз), видна]
    const f = lat * D2R, l = (lon - lon0) * D2R, f0 = lat0 * D2R, cf = Math.cos(f), cs = Math.sin(f0) * Math.sin(f) + Math.cos(f0) * cf * Math.cos(l);
    let x = cf * Math.sin(l), y = Math.cos(f0) * Math.sin(f) - Math.sin(f0) * cf * Math.cos(l);
    if (cs < 0) { const d = Math.hypot(x, y) || 1; x /= d; y /= d }
    return [x, -y, cs];
  }
  const lon0At = t => TB ? lp(28, 72, eio(at(t, TB.j, TB.nag - .3))) + .8 * at(t, TB.nag - .3, TB.dive) : 72;
  function globeInit() {
    const w = (q, n) => Ws('s4', q, n);
    TB = { j: TA.jAB, chet: w('четырнадцатом'), nag: w('нагое'), mil: w('милане'), yap: w('японской'), ital: w('итальянском'), poyav: w('появилась'), sig: w('сигарета'), kot: w('которую') };
    const a = TB; a.dive = a.sig - .25; a.jBC = a.sig + .35;
    const L0 = lon0At(a.dive), [nx, ny] = gProj(NAGOYA[0], NAGOYA[1], L0), px = GB.x + nx * GB.R, py = GB.y + ny * GB.R;
    a.ng = [px, py]; NBC = { x: px, y: py + CARDC * .8, m: PWW * .8 / 1080 };   // v21.2: мир C — в окне карточки Нагои (9:16), не в точке
    KB = [KY(a.j + .55, 540, 975, .8), KY(a.chet + .2, 560, 960, 1.12), KY(a.nag - .1, 620, 935, 1.2), KY(a.mil - .05, 520, 925, 1.18), KY(a.poyav + .1, lp(540, px, .45), lp(935, py, .45), 1.6),
      KY(a.dive + .02, lp(540, NBC.x, .85), lp(935, NBC.y, .85), 3.4), KY(a.jBC, NBC.x, NBC.y, 1 / NBC.m)];
  }
  function landPath(c, P, R, lon0) { c.beginPath(); for (let i = 0; i < P.length; i += 2) { const [x, y] = gProj(P[i], P[i + 1], lon0); i ? c.lineTo(x * R, y * R) : c.moveTo(x * R, y * R) } c.closePath() }
  function castle(c, x, y, s, col) {   // замок Нагои: каменное основание, три яруса крыш, золотые рыбы на коньке
    c.save(); c.translate(x, y); c.scale(s, s); poly(c, [-46, 0, 46, 0, 38, -26, -38, -26]); fill(c, col);
    [[-40, -26, 80, 22], [-30, -60, 60, 20], [-20, -90, 40, 18]].forEach(([x0, y0, w, h]) => { c.fillStyle = col; c.fillRect(x0 + 8, y0 - h, w - 16, h); poly(c, [x0 - 8, y0 - h, x0 + w + 8, y0 - h, x0 + w - 6, y0 - h - 12, x0 + 6, y0 - h - 12]); fill(c, col) });
    circ(c, -14, -124, 4, '#F2B84B'); circ(c, 14, -124, 4, '#F2B84B'); c.restore() }
  function duomo(c, x, y, s, col) {   // Миланский собор: фасад, острые шпили
    c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.fillRect(-50, -60, 100, 60); poly(c, [-50, -60, 0, -92, 50, -60]); fill(c, col);
    for (let i = -2; i <= 2; i++) { c.fillRect(i * 24 - 3, -60 - (i ? 30 : 64), 6, i ? 30 : 64); poly(c, [i * 24 - 5, -60 - (i ? 30 : 64), i * 24 + 5, -60 - (i ? 30 : 64), i * 24, -60 - (i ? 46 : 88)]); fill(c, col) }
    c.restore() }
  function globe(c, t, lon0, k, spin, hl = {}) {   // k — сколько ещё «комок»; spin — поворот в плоскости кадра (комок раскручивается в глобус — одним вращением)
    const R = GB.R; c.save(); c.translate(GB.x, GB.y);
    crumpPath(c, R, k, spin); c.fillStyle = mixc(C4.paper, '#D9E2E6', 1 - k); c.fill(); c.save(); crumpPath(c, R, k, spin); c.clip(); c.rotate(spin);   // v21.2: контур — тот же мятый комок, скругляется по k
    const lk = Math.min(1, (1 - k) * 2.6); c.save(); c.globalAlpha *= lk;   // суша проступает, пока грани комка гаснут — гладкого «мячика» нет
    LAND.forEach(P => { landPath(c, P, R, lon0); fill(c, '#C9B48A'); landPath(c, P, R, lon0); lnB(c, 1.6, 'rgba(60,44,24,.55)') });
    LAKES.forEach(P => { landPath(c, P, R, lon0); fill(c, '#D9E2E6') });
    if (hl.it > 0) ITALY.forEach(P => { landPath(c, P, R, lon0); fill(c, rgba('#E39A2E', hl.it)); landPath(c, P, R, lon0); lnB(c, 2.2, rgba('#5A3510', hl.it)) });
    if (hl.jp > 0) [LAND[4], LAND[5], LAND[6]].forEach(P => { landPath(c, P, R, lon0); fill(c, rgba('#E39A2E', hl.jp)); landPath(c, P, R, lon0); lnB(c, 2.2, rgba('#5A3510', hl.jp)) });
    c.strokeStyle = 'rgba(60,70,110,.18)'; c.lineWidth = 1.5; for (let la = -60; la <= 80; la += 20) { c.beginPath(); for (let lo = -180; lo <= 180; lo += 6) { const [x, y, v] = gProj(lo, la, lon0); if (v < 0) { c.moveTo(x * R, y * R); continue } c.lineTo(x * R, y * R) } c.stroke() }
    for (let lo = -180; lo < 180; lo += 30) { c.beginPath(); for (let la = -80; la <= 80; la += 5) { const [x, y, v] = gProj(lo, la, lon0); if (v < 0) { c.moveTo(x * R, y * R); continue } c.lineTo(x * R, y * R) } c.stroke() }
    c.restore();
    c.rotate(-spin); crumpFacets(c, R, spin, k);   // грани комка (20-cafe.js): гаснут, пока он раскручивается
    const sw = TB ? at(t, TB.chet - .2, TB.chet + .2) : 0;   // луч радара (#039)
    if (sw > 0) { const ang = (t - TB.chet) * 2.4 - 1.2, g = c.createConicGradient ? c.createConicGradient(ang - .9, 0, 0) : null;
      if (g) { g.addColorStop(0, 'rgba(30,220,255,0)'); g.addColorStop(.14, `rgba(30,220,255,${.38 * sw})`); g.addColorStop(.15, 'rgba(30,220,255,0)'); g.addColorStop(1, 'rgba(30,220,255,0)'); c.fillStyle = g; c.fillRect(-R, -R, R * 2, R * 2) }
      c.strokeStyle = `rgba(12,30,60,${.8 * sw})`; c.lineWidth = 9; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(ang) * R, Math.sin(ang) * R); c.stroke();   // v21.2: луч контрастнее — бирюзовый с тёмной обводкой
      c.strokeStyle = `rgba(60,235,255,${sw})`; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(ang) * R, Math.sin(ang) * R); c.stroke() }
    crumpShade(c, R); c.restore();   // тень как у комка (стык с миром A)
    if (k < 1) { c.fillStyle = `rgba(255,255,255,${.28 * (1 - k)})`; c.beginPath(); c.ellipse(-R * .52, -R * .38, R * .08, R * .26, .6, 0, TAU); c.fill() }
    crumpPath(c, R, k, spin); lnB(c, lp(3, R * .045, k), 'rgba(238,241,248,.55)');
    c.restore();
  }
  const CARDW = 108, CARDH = 192, CARDC = -136, PWW = 96, PWH = 96 * 16 / 9;   // v21.2: карточка булавки вертикальная — её окно 9:16, в нём витрина (мир C)
  function pinAt(c, t, ll, lon0, k, kind, o = {}) {   // точка-булавка с силуэтом; o.win — в окне карточки мир C (нырок), o.wk — силуэт гаснет
    const [x, y, v] = gProj(ll[0], ll[1], lon0), px = GB.x + x * GB.R, py = GB.y + y * GB.R; if (k <= 0 || v < .05) return [px, py];
    const e = bo(k); glow(c, px, py, 60 * e, '#FFC86A', .55 * k); circ(c, px, py, 9 * e, '#FFE2A0'); ring(c, px, py, 14 + 40 * cl(k * 1.3 - .3), `rgba(255,214,120,${.6 * (1 - cl(k * 1.3 - .3))})`, 3);
    c.save(); c.translate(px, py); c.scale(e * .8, e * .8); c.beginPath(); c.moveTo(0, -12); c.lineTo(-10, -40); c.lineTo(10, -40); c.closePath(); fill(c, '#F4F1EA');
    rr(c, -CARDW / 2, CARDC - CARDH / 2, CARDW, CARDH, 14); fill(c, '#F4F1EA'); rr(c, -CARDW / 2, CARDC - CARDH / 2, CARDW, CARDH, 14); lnB(c, 3, 'rgba(20,23,51,.4)');
    if (o.win) { c.save(); c.beginPath(); c.rect(-PWW / 2, CARDC - PWH / 2, PWW, PWH); c.clip(); c.scale(PWW / 1080, PWW / 1080); c.translate(-540, CARDC * 1080 / PWW - 960); o.win(c); c.restore() }
    const wk = o.wk ?? 0; if (wk < 1) { c.save(); c.globalAlpha *= 1 - wk; if (o.win) { c.fillStyle = '#F4F1EA'; c.fillRect(-PWW / 2, CARDC - PWH / 2, PWW, PWH) }
      if (kind === 'n') castle(c, 0, CARDC + 38, .82, '#2B2F55'); else duomo(c, 0, CARDC + 38, .9, '#2B2F55'); c.restore() }
    c.restore();
    return [px, py];
  }
  function globeWorld(c, t, q) {
    const a = TB, lon0 = lon0At(t), kb = 1 - eio(at(t, a.j + .1, a.j + 1.1)), s0 = ballPos(a.j)[2], spin = (s0 - TAU * Math.floor(s0 / TAU) + TAU) * (1 - eio(at(t, a.j + .05, a.j + 1.15)));   // v21.2: раскручивается ровно на один оборот (тот же угол по модулю 2π)
    const sp = at(t, a.j, a.j + .9);   // сетка и кольца проявляются вокруг (фон — в globeShot, под звёздами)
    if (sp > 0) { c.save(); c.globalAlpha *= sp; c.strokeStyle = 'rgba(126,150,220,.08)'; c.lineWidth = 2; c.beginPath(); for (let x = -1500; x < 2600; x += 90) { c.moveTo(x, -1500); c.lineTo(x, 3400) } for (let y = -1500; y < 3400; y += 90) { c.moveTo(-1500, y); c.lineTo(2600, y) } c.stroke();
      [1.16, 1.34, 1.55].forEach((f, i) => ring(c, GB.x, GB.y, GB.R * f, `rgba(238,241,248,${.22 - i * .05})`, 2.5)); c.restore() }
    const kn = at(t, a.yap - .05, a.yap + .5), km = at(t, a.ital - .05, a.ital + .5);
    globe(c, t, lon0, kb, spin, { jp: .85 * kn, it: .85 * km });
    const pm = 1 - at(t, a.dive - .35, a.dive - .05); c.save(); c.globalAlpha *= pm; pinAt(c, t, MILAN, lon0, km, 'm'); c.restore();
    const dv = t > a.dive - .4, [nx, ny] = pinAt(c, t, NAGOYA, lon0, kn, 'n', dv ? { win: cc => storeWorld(cc, t, null), wk: at(t, a.dive - .35, a.dive + .1) } : {});   // v21.2: нырок в окно карточки Нагои — без чёрной дыры
    return [nx, ny];
  }
  function globeLabels(c, t, q) {   // подписи городов — плашками поверх (по экрану), пока камера едет
    const a = TB; if (t > a.dive + .1) return; const lon0 = lon0At(t);
    for (const [ll, s, t0] of [[NAGOYA, TEXT.nagoya, a.yap], [MILAN, TEXT.milan, a.ital]]) {
      const k = at(t, t0 + .05, t0 + .4) * (1 - at(t, a.dive - .2, a.dive + .05)); if (k <= 0) continue;
      const [x, y] = gProj(ll[0], ll[1], lon0), px = GB.x + x * GB.R, py = GB.y + y * GB.R, sx = (px - q.x) * q.z + 540, sy = (py - q.y) * q.z + 960;
      capS(c, s, sx, sy + 60, k, { s: 40 }) }
  }
  function globeShot(c, t) {
    const q = camObj(camAt(KB, t)); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = FLOORC; c.fillRect(0, 0, WW, HH); c.restore();
    starsS(c, t, .8 * at(t, TB.j + .2, TB.j + 1)); layer(c, q, 1, cc => globeWorld(cc, t, q)); globeLabels(c, t, q);
  }
  // ================= мир C — витрина в Нагое, 2014 (строки 4–5) =================
  // Стик сам выезжает из пачки Marlboro HeatSticks и садится в держатель IQOS (держатель лежит на зарядном футляре).
  // «нельзя поджечь»: зажигалка откидывает крышку, пламя лижет кончик — ни огонька, ни дыма. «Табак…»: пламя сжимается внутрь держателя и
  // становится лезвием нагревателя (#114), держатель — в разрезе тонкими линиями (#067), волны тепла; «вдвое холоднее» — два столбика: 684° и 330°.
  // Стык с машиной (мир D): камера ныряет в белый бок держателя — в машине он лежит в подстаканнике.
  let TC4 = null, KC = null, NCD = null;
  const HC = { x: 600, y: 1048, L: 420 }, SHELFC = 1180, LIGHTER = { x: 265, y: SHELFC }, HPACK = { x: 905, y: SHELFC };
  const tipC = () => [HC.x - HC.L / 2 + 8 - HC.L * .34 + 10, HC.y];   // торец стика (табак) — слева
  function storeCInit() {
    const w4 = (q, n) => Ws('s4', q, n), w5 = (q, n) => Ws('s5', q, n);
    TC4 = { j: TB.jBC, kot: w4('которую'), nelz: w4('нельзя'), podzh: w4('поджечь'), tab: w5('табак'), nagr: w5('нагреватель'), vdvoe: w5('вдвое'), hol: w5('холоднее'), kurt: w5('куртка') };
    const a = TC4; a.close = a.kurt - .45; a.jCD = a.close + .08;   // v21.2: без нырка в белый бок — держатель переезжает на подлокотник (45-car.js)
    KC = [KY(a.j + .45, 545, 1010, 1.12), KY(a.kot + .45, 520, 1030, 1.25), KY(a.podzh + .05, 330, 1050, 2.05), KY(a.tab + .45, 560, 1040, 1.75),
      KY(a.vdvoe + .1, 560, 800, 1.18), KY(a.hol + .3, 578, 790, 1.2), KY(a.jCD, 713, 919, .9)];   // держатель — того же размера и там же, где на подлокотнике
    NCD = { x: HC.x, y: HC.y - (HD.y - 960) * MCAR, m: MCAR };   // держатель в машине — (540, 1310), в MCAR раз меньше витринного (v21.1: был в пол-салона)
  }
  function lighter4(c, t) {   // зажигалка: хром в 3 тона, крышка на петле справа, колёсико, пламя
    const a = TC4, { x, y } = LIGHTER, w = 64, h = 100, top = y - h, open = eio(at(t, a.nelz - .05, a.nelz + .25)) * (1 - eio(at(t, a.tab + .2, a.tab + .45)));
    rasterPoly(c, [x + w / 2, y - 10, x + w / 2 + 50, y + 30, x - w / 2 + 50, y + 30, x - w / 2, y], 'rgba(0,0,0,.3)', 8, 2);
    rr(c, x - w / 2, top, w, h, 8); cel(c, x - w / 2, top, w, h, '#B9BFCC', { sw: .3, hx: .12, ha: .5 }); rr(c, x - w / 2, top, w, h, 8); lnB(c, 2.5, 'rgba(238,241,248,.6)');
    c.fillStyle = '#7C8396'; c.fillRect(x - w / 2, top + 22, w, 4);
    if (open > 0) { circ(c, x - 6, top - 6, 9, '#6B7184'); c.fillStyle = '#9AA1B3'; c.fillRect(x - 24, top - 14, 30, 14) }   // колёсико и ветрозащита
    c.save(); c.translate(x - w / 2, top + 22); c.rotate(2.3 * open); rr(c, 0, -40, w, 40, 7); cel(c, 0, -40, w, 40, '#C9CED9', { sw: .3, ha: .5 }); c.restore();   // крышка — петля слева, откидывается от футляра (v21.1)
    const fl = at(t, a.podzh - .12, a.podzh + .05) * (1 - at(t, a.tab - .05, a.tab + .1)); if (fl > 0) flame4(c, t, x - 8, top - 16, fl);
  }
  function flame4(c, t, x, y, k, s = 1) {   // язычок пламени: капля в 3 тона, дрожит
    const f = 1 + Math.sin(t * 31) * .06 + Math.sin(t * 17) * .05, H = 70 * s * k * f, W = 22 * s * k;
    c.save(); c.translate(x, y); c.beginPath(); c.moveTo(0, -H); c.bezierCurveTo(W * 1.1, -H * .45, W, 0, 0, 0); c.bezierCurveTo(-W, 0, -W * 1.1, -H * .45, 0, -H); fill(c, '#FF8A2A');
    c.beginPath(); c.moveTo(0, -H * .66); c.bezierCurveTo(W * .6, -H * .3, W * .5, 0, 0, 0); c.bezierCurveTo(-W * .5, 0, -W * .6, -H * .3, 0, -H * .66); fill(c, '#FFD27A');
    c.beginPath(); c.ellipse(0, -2, W * .35, H * .12, 0, 0, TAU); fill(c, '#5B8CFF'); c.restore();
  }
  function stickFly(t) {   // стик из пачки в держатель: [x, y, угол, доля полёта 0..1]
    const a = TC4, k = eio(at(t, a.kot - .1, a.kot + .55)), up = eo(at(t, a.kot - .1, a.kot + .15));
    const x0 = HPACK.x, y0 = HPACK.y - 190 - 40 * up, [tx0, ty0] = [HC.x - HC.L / 2 - 50, HC.y];
    return [lp(x0, tx0, k), lp(y0, ty0, k) - Math.sin(Math.PI * k) * 160, lp(-Math.PI / 2, 0, eio(at(t, a.kot, a.kot + .5))), k];
  }
  function bladeIn(c, t, kn, ko = 1, kw = 1) {   // v21.1: внутри держателя — стик, его табачная часть и острое лезвие нагревателя: серое → раскалённое; kw — волны тепла
    const x0 = HC.x - HC.L / 2 + 8, hy = HC.y, tip = x0 + 34, base = x0 + 132;
    rr(c, x0, hy - 17, 104, 34, 4); fill(c, 'rgba(247,244,236,.9)');   // бумага стика внутри
    rr(c, x0 + 22, hy - 14, 82, 28, 3); fill(c, '#B9874A'); c.fillStyle = 'rgba(90,55,25,.45)'; for (let i = 0; i < 9; i++) c.fillRect(x0 + 26 + i * 9, hy - 12 + (i % 3) * 7, 6, 2);   // табак
    const g = c.createLinearGradient(tip, 0, base, 0); g.addColorStop(0, mixc('#C9CDD6', '#FFE08A', kn)); g.addColorStop(1, mixc('#8E929E', '#FF8A2A', kn));
    poly(c, [tip, hy, tip + 26, hy - 7, base, hy - 7, base, hy + 7, tip + 26, hy + 7]); c.fillStyle = g; c.fill(); lnB(c, 1.5, 'rgba(20,23,51,.45)');
    rr(c, base, hy - 20, 26, 40, 5); fill(c, '#6E7488');   // держатель лезвия
    if (kn > 0) glow(c, (tip + base) / 2, hy, 120, '#FF9A3A', .45 * kn * ko);
    if (kn > 0 && kw > 0) for (let i = 0; i < 4; i++) { const u = (t * .7 + i * .25) % 1, wx = tip - 10 + i * 40; smokeLine(c, [wx, hy - 50 - u * 40, wx + 14, hy - 140 - u * 60, wx - 8, hy - 230 - u * 80, wx + 10, hy - 320 - u * 90], 9, C4.heat, .4 * kn * kw * Math.sin(Math.PI * u)) }
  }
  function thermo4(c, t) {   // «вдвое холоднее»: огонь 684° и нагрев 330° — столбики над держателем
    const a = TC4, k1 = eo(at(t, a.vdvoe - .1, a.vdvoe + .4)), k2 = eo(at(t, a.hol - .15, a.hol + .3)), out = eio(at(t, a.close - .25, a.close + .05)); if (k1 <= 0 || out >= 1) return;
    const kv = [eo(at(FT, a.vdvoe - .1, a.vdvoe + .4)), eo(at(FT, a.hol - .15, a.hol + .3))];   // цифры — по времени кадра: в размытии не двоятся
    const base = 800, Hmax = 420;
    [[440, 684, '#E2412F', TEXT.fire, k1, kv[0]], [700, 330, '#FF9A3A', TEXT.blade, k2, kv[1]]].forEach(([x, v, col, lab, k, kn]) => { if (k <= 0) return; const H = Hmax * v / 684 * kn;
      c.save(); c.globalAlpha *= 1 - out; rr(c, x - 50, base - Hmax - 20, 100, Hmax + 20, 50); fill(c, 'rgba(238,241,248,.08)'); rr(c, x - 50, base - Hmax - 20, 100, Hmax + 20, 50); lnB(c, 3, 'rgba(238,241,248,.4)');
      rr(c, x - 38, base - H, 76, H, 38); cel(c, x - 38, base - H, 76, H, col, { sw: .3, hx: .14 }); circ(c, x, base + 20, 56, col);
      const Hn = Hmax * v / 684 * kn; tx(c, Math.round(v * kn) + '°', x, base - Hn - 46, { f: 'M', w: 800, s: 54, c: '#F4F1EA' }); tx(c, lab, x, base + 100, { f: 'M', w: 800, s: 28, c: '#F4F1EA', ls: 3 }); c.restore() });   // v21.2: и число, и его место — по времени кадра
  }
  function storeC(c, t) {   // фон: графит, ряды коробок в глубине, стеклянная полка, луч сверху
    c.fillStyle = C4.graph; c.fillRect(-3000, -3000, 7000, 7000);
    c.save(); c.globalAlpha *= .5; for (let r = 0; r < 4; r++) { const y = 320 + r * 230; c.fillStyle = '#23262D'; c.fillRect(-600, y + 120, 2300, 14); for (let i = 0; i < 26; i++) { c.fillStyle = (i + r) % 3 ? '#3A3E4A' : '#454A58'; c.fillRect(-560 + i * 88, y + 30, 60, 90) } } c.restore();
    beam(c, 560, -200, 560, SHELFC, 60, 520, '#FFE6B8', .16);
    c.fillStyle = 'rgba(200,230,255,.18)'; c.fillRect(80, SHELFC, 940, 14); c.fillStyle = 'rgba(220,240,255,.55)'; c.fillRect(80, SHELFC, 940, 3); c.fillStyle = '#1B1D23'; c.fillRect(-3000, SHELFC + 14, 7000, 3000);
  }
  function storeWorld(c, t, q) {
    const a = TC4; storeC(c, t);
    c.beginPath(); c.ellipse(HC.x + 18, SHELFC + 2, 186, 12, 0, 0, TAU); fill(c, 'rgba(0,0,0,.32)');
    rr(c, HC.x - 170, HC.y + 42, 340, 90, 30); cel(c, HC.x - 170, HC.y + 42, 340, 90, '#E6E7EB', { sw: .25 }); rr(c, HC.x - 170, HC.y + 42, 340, 90, 30); lnB(c, 2, 'rgba(20,23,51,.3)');   // зарядный футляр
    heat4(c, HPACK.x, HPACK.y, 1, 0);
    const [sx, sy, sa, sk] = stickFly(t), inH = sk >= 1;
    const cut = eio(at(t, a.tab + .1, a.tab + .5)) * (1 - eio(at(t, a.close - .35, a.close))), kn = eio(at(t, a.nagr - .25, a.nagr + .3));
    if (!HIDE_H) iqos4(c, HC.x, HC.y, HC.L, { left: true, stick: inH ? 1 : 0, name: true, cut: cut > .5, shadow: false });
    if (cut > 0) { c.save(); c.globalAlpha *= Math.min(1, cut * 2); bladeIn(c, t, kn, 1, 1 - at(t, a.vdvoe - .35, a.vdvoe)); c.restore() }   // волны тепла гаснут, когда встают столбики
    if (!inH && sk > 0) { c.save(); c.translate(sx, sy); c.rotate(sa); rr(c, -71, -9, 142, 18, 4); fill(c, '#F7F4EC'); c.fillStyle = '#C9A266'; c.fillRect(-71, -9, 22, 18); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(-71, 3, 142, 6); c.restore() }
    lighter4(c, t);
    const fk = at(t, a.tab - .05, a.tab + .4); if (fk > 0 && fk < 1) { const fx = lp(LIGHTER.x - 8, HC.x - HC.L / 2 + 70, eio(fk)), fy = lp(LIGHTER.y - 116, HC.y + 10, eio(fk)); flame4(c, t, fx, fy, 1 - fk * .85) }   // пламя улетает внутрь и сжимается в лезвие
    thermo4(c, t);
  }
  function storeShot(c, t) {
    const q = camObj(camAt(KC, t)); layer(c, q, 1, cc => storeWorld(cc, t, q));
    const a = TC4; capS(c, TEXT.nofire, 540, 330, at(t, a.podzh + .12, a.podzh + .45) * (1 - at(t, a.tab - .2, a.tab + .05)), { s: 56 });
    capS(c, TEXT.half, 540, 300, at(t, a.hol + .05, a.hol + .3) * (1 - at(t, a.close - .3, a.close - .05)), { s: 52 });
  }

  // ================= японское шоу (мир E): его показывает экран машины и телевизор в магазине =================
  // Студия: яркие полосы, лучи софитов, за столом два белых силуэта комиков, между ними на подставке IQOS; на «расхвалили» — звёздочки и смех.
  function comic4(c, x, y, d, t, ks, lau, i) {   // комик за столом: плечи, голова, рука с микрофоном у рта, другая — жест (на «расхвалили» — к айкосу)
    c.save(); c.translate(x, y); c.scale(d, 1); const W = '#FFFFFF', S = '#D9DCE6';
    c.beginPath(); c.moveTo(-92, 150); c.quadraticCurveTo(-98, 30, -52, 8); c.quadraticCurveTo(0, -6, 52, 8); c.quadraticCurveTo(98, 30, 92, 150); c.closePath(); fill(c, W);   // плечи и грудь
    c.save(); c.clip(); c.fillStyle = S; c.fillRect(40, -20, 80, 200); c.restore();
    poly(c, [-14, 10, 14, 10, 0, 44]); fill(c, i ? '#E7A9B6' : '#8FC7F0');   // галстук-бабочка / ворот
    rr(c, -14, -24, 28, 30, 10); fill(c, W); circ(c, 0, -62, 42, W); c.save(); c.beginPath(); c.arc(0, -62, 42, 0, TAU); c.clip(); c.fillStyle = S; c.fillRect(18, -110, 40, 100); c.restore();
    const g = ks > 0 ? Math.sin(t * 7 + i) * .15 : Math.sin(t * 3 + i * 2) * .1;   // рука-жест: к центру стола (к айкосу)
    c.save(); c.translate(60, 30); c.rotate(-.9 + g - .5 * ks); rr(c, -14, -14, 120, 28, 14); fill(c, W); c.translate(108, 0); c.rotate(-.7 + g); rr(c, -12, -12, 80, 24, 12); fill(c, W); circ(c, 76, 0, 17, W); c.restore();
    c.save(); c.translate(-58, 34); c.rotate(-2.2 + .1 * Math.sin(t * 5 + i)); rr(c, -14, -14, 96, 28, 14); fill(c, S); c.translate(86, 0); c.rotate(1.9); rr(c, -12, -12, 70, 24, 12); fill(c, S); circ(c, 64, 0, 16, S);
      c.translate(64, 0); c.rotate(-.5); rr(c, -6, -46, 12, 50, 5); fill(c, '#2B2F3A'); circ(c, 0, -52, 13, '#3A3F4C'); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(-6, -60, 4, 10); c.restore();   // микрофон
    c.restore();
  }
  function showDraw(c, t, cx, cy, w) {   // кадр шоу 16:9 с центром (cx, cy) шириной w
    const h = w * 9 / 16, s = w / 1080; c.save(); c.translate(cx - w / 2, cy - h / 2); c.scale(s, s);
    const H = 607.5; c.fillStyle = '#F2B84B'; c.fillRect(0, 0, 1080, H);
    for (let i = 0; i < 14; i++) { const a0 = i * TAU / 14 + t * .15, a1 = a0 + TAU / 28; c.beginPath(); c.moveTo(540, 260); c.arc(540, 260, 900, a0, a1); c.closePath(); fill(c, i % 2 ? '#F6C76B' : '#EFA93A') }
    c.fillStyle = '#E7A9B6'; c.fillRect(0, 0, 1080, 60); c.fillStyle = '#8FC7F0'; c.fillRect(0, 60, 1080, 18);
    for (const x of [120, 960]) beam(c, x, -40, x < 540 ? 300 : 780, 420, 8, 90, '#FFFFFF', .22);
    const ks = TD4 ? eo(at(t, TD4.rash - .05, TD4.rash + .4)) : 0, lau = TD4 ? at(t, TD4.kom - .1, TD4.kom + .3) : 0;
    [[250, 1], [830, -1]].forEach(([x, d], i) => { const hop = lau > 0 ? Math.abs(Math.sin(t * 9 + i * 1.7)) * 14 * lau : 0; comic4(c, x, 300 - hop, d, t, ks, lau, i);   // v21.2: комики — плечи, жесты, микрофоны
      if (lau > 0) { c.strokeStyle = `rgba(29,63,143,${.9 * lau})`; c.lineWidth = 6; c.lineCap = 'round'; for (let k = 0; k < 3; k++) { const a = -2.2 + k * .5 + (d < 0 ? 1.6 : 0); c.beginPath(); c.moveTo(x + Math.cos(a) * 80, 160 - hop + Math.sin(a) * 80); c.lineTo(x + Math.cos(a) * 114, 160 - hop + Math.sin(a) * 114); c.stroke() } } });
    rr(c, 80, 420, 920, 190, 18); fill(c, '#2F6FD6'); c.fillStyle = '#1D3F8F'; c.fillRect(80, 520, 920, 90); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(80, 430, 920, 10);   // стол — перед комиками
    poly(c, [476, 420, 604, 420, 590, 344, 490, 344]); fill(c, '#FFFFFF'); c.fillStyle = '#D9DCE3'; c.fillRect(576, 344, 20, 76); rr(c, 466, 330, 148, 18, 6); fill(c, '#EDEFF4');   // подиум-витрина
    beam(c, 540, -40, 540, 330, 6, 120, '#FFFFFF', .18);
    iqos4(c, 540, 300, 230, { name: true, glow: TD4 ? eo(at(t, TD4.aik - .05, TD4.aik + .3)) : 0, shadow: false });
    if (ks > 0) for (let i = 0; i < 7; i++) { const a = i * TAU / 7 + t * .8, r = 150 + 20 * Math.sin(t * 5 + i); star(c, 540 + Math.cos(a) * r, 290 + Math.sin(a) * r * .55, 18 * ks * (.7 + .3 * Math.sin(t * 9 + i)), '#FFFFFF') }
    c.restore();
  }

  // ================= мир F — магазин в Японии, 2016 (строки 6–7) =================
  // Шоу идёт на телевизоре у входа; рядом полки с рядами коробок IQOS. «смели с полок» — поток белых фигурок (#103), коробки исчезают волной.
  // «Без огня — значит, без вреда?»: свет гаснет, луч сверху — на полке один держатель, пар над ним загибается в «?» (#009).
  let TF = null, KF = null, NFG = null;
  const TVF = { x: 300, y: 820, w: 420 }, HF = { x: 760, y: 802, L: 180 }, SHELVES = [560, 820, 1080];
  function storeFInit() {
    const w6 = (q, n) => Ws('s6', q, n), w7 = (q, n) => Ws('s7', q, n);
    TF = { j: TD4.jDF, aik2: w6('айкосы'), smel: w6('смели'), pol: w6('полок'), bez: w7('без'), vred: w7('вреда'), cherez: Ws('s8', 'через') };
    const a = TF; a.off = a.bez - .1; a.jFG = a.cherez + .12;
    KF = [KY(a.j + .1, 300, 822.7, 1080 / TVF.w), KY(a.j + .65, 420, 860, 1.6), KY(a.aik2 + .1, 610, 900, 1.06), KY(a.pol + .4, 690, 930, 1.1), KY(a.vred - .2, 760, 780, 1.75), KY(a.vred + .55, 760, 760, 2.45), KY(a.jFG, 760, 770, 2.6)];
    NFG = { x: HF.x, y: HF.y - 140, m: 1 };   // держатель в лаборатории — (540, 1100)
  }
  function crowdF(c, t) {   // поток белых фигурок слева направо: фронт — fx
    const a = TF, k = at(t, a.smel - .25, a.smel + 1.05); if (k <= 0 || k >= 1) return;
    for (let i = 0; i < 16; i++) { const x = lp(-500, 1700, k) - i * 95 - (i % 3) * 30, bob = Math.abs(Math.sin(t * 12 + i)) * 10, m = i % 2 === 0;
      if (x < -200 || x > 1350) continue; fig(c, x, 1440 - bob - (i % 2) * 18, 1.65, { m, col: '#F4F1EA', hat: i % 5 === 2 }) }
  }
  const crowdFront = t => TF ? lp(-500, 1700, at(t, TF.smel - .25, TF.smel + 1.05)) : -1e9;
  function storeFWorld(c, t, q) {
    const a = TF; c.fillStyle = '#E9E1D2'; c.fillRect(-3000, -3000, 7000, 7000);
    c.fillStyle = '#D9CFBD'; for (let x = -1000; x < 2400; x += 160) c.fillRect(x, 0, 6, 1350);
    c.fillStyle = '#F7F4EC'; for (let i = 0; i < 6; i++) { rr(c, -200 + i * 290, 90, 220, 26, 13); c.fill() }   // лампы дневного света
    c.fillStyle = '#C9C2B4'; c.fillRect(-3000, 1350, 7000, 3000); c.fillStyle = '#B9B1A2'; c.fillRect(-3000, 1350, 7000, 10);
    const front = crowdFront(t);
    SHELVES.forEach((y, r) => { c.fillStyle = '#8A8F9C'; c.fillRect(500, y - 230, 10, 240); c.fillStyle = '#D8D4CC'; c.fillRect(490, y, 590, 22); c.fillStyle = '#B9B5AD'; c.fillRect(490, y + 22, 590, 8);
      for (let i = 0; i < 7; i++) { const bx = 520 + i * 78; if (front > bx + 60 + r * 20) continue; if (r === 1 && i === 3) continue; box4(c, bx, y - 96, 62, 96) } });
    c.fillStyle = '#20232E'; c.fillRect(TVF.x - 14, TVF.y + TVF.w * 9 / 32, 28, 300); rr(c, TVF.x - 120, TVF.y + TVF.w * 9 / 32 + 290, 240, 20, 8); fill(c, '#20232E');   // стойка ТВ
    rr(c, TVF.x - TVF.w / 2 - 16, TVF.y - TVF.w * 9 / 32 - 16, TVF.w + 32, TVF.w * 9 / 16 + 32, 14); fill(c, '#16181F');
    c.save(); c.beginPath(); c.rect(TVF.x - TVF.w / 2, TVF.y - TVF.w * 9 / 32, TVF.w, TVF.w * 9 / 16); c.clip(); showDraw(c, t, TVF.x, TVF.y, TVF.w); c.restore();
    crowdF(c, t);   // v21.2: после «раскупили» полка пустая — держатель опускается в луч, когда гаснет свет (spotScene)
    const off = at(t, a.off - .35, a.off + .65); spotScene(c, t, HF.x, HF.y, HF.L, off, a.vred, 1);
  }
  function storeFShot(c, t) {
    const a0 = TF; if (t < a0.j + .1) {   // v21.2: экран машины = телевизор магазина; шоу стоит на месте, салон уезжает вниз, магазин приходит сверху — без рывка в айкос
      const e = eio(at(t, a0.j - .35, a0.j + .1)), qd = camObj(camAt(KD, t)), qf = camObj(camAt(KF, t));
      const yb = HH * e;   // шторка сверху вниз: выше границы — магазин, ниже — салон; оба мира стоят, телевизор магазина = экран машины на том же месте (без дублей)
      c.save(); c.beginPath(); c.rect(0, 0, WW, yb); c.clip(); layer(c, qf, 1, cc => storeFWorld(cc, t, qf)); c.restore();
      c.save(); c.beginPath(); c.rect(0, yb, WW, HH - yb); c.clip(); carWorld(c, t, qd); c.restore();
      if (e > 0 && e < 1) { const g = c.createLinearGradient(0, yb - 14, 0, yb + 14); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, 'rgba(0,0,0,.4)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, yb - 14, WW, 28) }
      const w = SCR.w * qd.z, cy = (SCR.y - qd.y) * qd.z + 960; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); c.rect(540 - w / 2, cy - w * 9 / 32, w, w * 9 / 16); c.clip(); showDraw(c, t, 540, cy, w); c.restore();
      return }
    const q = camObj(camAt(KF, t)); layer(c, q, 1, cc => storeFWorld(cc, t, q));
    const a = TF; capS(c, TEXT.soldout, 540, 330, at(t, a.smel + .35, a.smel + .7) * (1 - at(t, a.bez - .3, a.bez)), { s: 58 });
    capS(c, TEXT.noharm, 540, 250, at(t, a.vred + .15, a.vred + .45) * (1 - at(t, a.jFG - .45, a.jFG - .15)), { s: 58 });   // выше «?» (v21.1)
  }
  // ================= мир D — ночная машина, вид с заднего сиденья (строки 5–6) =================
  // Держатель лежит в подстаканнике между сиденьями. «куртка не пахнет» — куртка на спинке пассажирского сиденья, «пепла нет» — пепельница пустая,
  // «прямо в машине» — белая фигурка за рулём, к потолку тает облачко пара (устройства у рта не показываем). За стеклом — ночной город и фары (#158).
  // «Это айкос…» — на экране машины идёт японское шоу; камера ныряет в экран — это телевизор в магазине (мир F).
  let TD4 = null, KD = null, NDF = null;
  const MCAR = 1.6, HDA = -.1, HD = { x: 548, y: 1300 }, SCR = { x: 540, y: 860, w: 300 }, WSH = [70, 780, 1010, 780, 930, 170, 150, 170];
  function carInit() {
    const w5 = (q, n) => Ws('s5', q, n), w6 = (q, n) => Ws('s6', q, n);
    TD4 = { j: TC4.jCD, kurt: w5('куртка'), pep: w5('пепла'), zat: w5('затянуться'), mash: w5('машине'), aik: w6('айкос'), shest: w6('шестнадцатом'), rash: w6('расхвалили'),
      kom: w6('комики'), shou: w6('шоу') };
    const a = TD4; a.jDF = a.kom + .95; a.sl1 = a.j + .5;   // v21.2: держатель переезжает из витрины на подлокотник (без нырка в белое); экран машины = телевизор магазина — без рывка в айкос
    KD = [KY(a.j, 610, 1230, 1.45), KY(a.kurt + .25, 612, 1232, 1.46), KY(a.pep + .25, 560, 1380, 1.55), KY(a.mash + .05, 400, 1040, 1.22), KY(a.aik + .25, 540, 905, 1.5), KY(a.shest + .55, 540, 862, 3.25),
      KY(a.kom + .3, 540, 862, 3.55), KY(a.jDF - .35, 540, 862, 3.6)];
    const m = SCR.w / TVF.w; NDF = { x: SCR.x - (TVF.x - 540) * m, y: SCR.y - (TVF.y - 960) * m, m };   // телевизор магазина = экран машины
  }
  function cityFar(c, t) {   // ночной город за лобовым стеклом
    ['#0E1230', '#151A40', '#1E2150', '#2B2558'].forEach((col, i) => { c.fillStyle = col; c.fillRect(-1500, -200 + i * 230, 4200, 232) });
    for (let i = 0; i < 18; i++) { const x = -500 + i * 130 + H1(i) * 40, h = 240 + H1(i * 3.3) * 380, w = 90 + H1(i * 5.1) * 60; c.fillStyle = i % 2 ? '#161A3A' : '#1B2046'; c.fillRect(x, 820 - h, w, h);
      c.fillStyle = 'rgba(247,203,120,.6)'; for (let r = 0; r < h / 40 - 1; r++) for (let k = 0; k < w / 30 - 1; k++) if (H1(i * 31 + r * 7 + k) > .62) c.fillRect(x + 12 + k * 30, 820 - h + 18 + r * 40, 12, 16) }
    c.fillStyle = '#0B0D22'; c.fillRect(-1500, 790, 4200, 400);
    for (let i = 0; i < 6; i++) { const x = ((i * 420 - t * 260) % 2520 + 2520) % 2520 - 700; c.fillStyle = '#2A2F55'; c.fillRect(x, 560, 8, 240); circ(c, x + 4, 556, 18, '#FFE2A0'); glow(c, x + 4, 556, 90, '#FFD27A', .35) }
    for (let i = 0; i < 4; i++) { const u = ((t * .35 + i * .27) % 1), x = lp(1500, -500, u), y = 770 + (i % 2) * 14; circ(c, x, y, 9, '#FFF2C8'); circ(c, x + 40, y, 9, '#FFF2C8'); glow(c, x + 20, y, 80, '#FFE6B8', .35) }   // фары встречных
  }
  function navDraw(c, t, cx, cy, w) {   // экран машины до шоу: ночной навигатор — тёмная карта, дороги, стрелка
    const h = w * 9 / 16, x0 = cx - w / 2, y0 = cy - h / 2; c.fillStyle = '#10142C'; c.fillRect(x0, y0, w, h);
    c.strokeStyle = 'rgba(126,150,220,.35)'; c.lineWidth = 3; c.beginPath();
    for (let i = 0; i < 5; i++) { const yy = y0 + h * (.15 + i * .18) + ((t * 18) % (h * .18)); c.moveTo(x0, yy); c.lineTo(x0 + w, yy - h * .12) } for (let i = 0; i < 4; i++) { const xx = x0 + w * (.12 + i * .26); c.moveTo(xx, y0); c.lineTo(xx + w * .05, y0 + h) } c.stroke();
    c.strokeStyle = '#4FA3FF'; c.lineWidth = 7; c.beginPath(); c.moveTo(cx, y0 + h); c.lineTo(cx, cy + 6); c.lineTo(cx + w * .2, cy - h * .3); c.stroke();
    poly(c, [cx, cy - 16, cx + 13, cy + 14, cx, cy + 6, cx - 13, cy + 14]); fill(c, '#FFFFFF');
  }
  function carInterior(c, t) {
    c.save(); c.beginPath(); c.rect(-3000, -3000, 7000, 7000); poly(c, WSH); c.fillStyle = '#14162A'; c.fill('evenodd'); c.restore();
    poly(c, WSH); lnB(c, 10, '#0C0E1E'); c.save(); poly(c, WSH); c.clip(); glint(c, 70, 170, 940, 610, .05); c.restore();
    rr(c, 480, 210, 120, 46, 12); fill(c, '#0C0E1E'); c.fillStyle = 'rgba(160,180,230,.25)'; c.fillRect(490, 218, 100, 8);   // зеркало
    rr(c, -300, 760, 1680, 200, 40); fill(c, '#1B1E33'); c.fillStyle = 'rgba(126,150,220,.18)'; c.fillRect(-300, 768, 1680, 6);   // панель
    for (const x of [120, 960]) { rr(c, x - 50, 820, 100, 40, 10); fill(c, '#0F1124') }
    glow(c, SCR.x, SCR.y, 260, '#7EA6FF', .12);   // свечение экрана — под ним, на сам экран не ложится (стык с телевизором магазина)
    rr(c, SCR.x - SCR.w / 2 - 14, SCR.y - SCR.w * 9 / 32 - 14, SCR.w + 28, SCR.w * 9 / 16 + 28, 16); fill(c, '#0B0C18');
    c.save(); c.beginPath(); c.rect(SCR.x - SCR.w / 2, SCR.y - SCR.w * 9 / 32, SCR.w, SCR.w * 9 / 16); c.clip(); const ks = TD4 ? at(t, TD4.aik - .45, TD4.aik - .05) : 1;
    if (ks < 1) navDraw(c, t, SCR.x, SCR.y, SCR.w); if (ks > 0) A(c, ks, () => showDraw(c, t, SCR.x, SCR.y, SCR.w)); c.restore();   // v21.1: шоу — с «Это айкос», до этого навигатор
    c.beginPath(); c.arc(255, 940, 170, 0, TAU); lnB(c, 30, '#0E1022'); c.beginPath(); c.arc(255, 940, 170, Math.PI * 1.1, Math.PI * 1.6); lnB(c, 6, 'rgba(160,180,230,.25)');   // руль
  }
  function driver(c, t) { c.save(); circ(c, 250, 1000, 64, '#F4F1EA'); c.fillStyle = shd('#F4F1EA', .25); c.beginPath(); c.arc(250, 1000, 64, -.6, 1.2); c.lineTo(250, 1000); c.fill();
    rr(c, 125, 1068, 250, 220, 90); fill(c, '#F4F1EA'); c.fillStyle = shd('#F4F1EA', .25); c.fillRect(300, 1080, 70, 200); c.restore() }
  function seats(c, t) {
    rr(c, 80, 1180, 340, 520, 60); cel(c, 80, 1180, 340, 520, '#262A45', { sw: .22, ha: .12 }); rr(c, 150, 1150, 200, 70, 30); fill(c, '#262A45');   // спинка водителя
    rr(c, 660, 1080, 340, 620, 60); cel(c, 660, 1080, 340, 620, '#262A45', { sw: .22, ha: .12 }); rr(c, 760, 980, 150, 110, 30); cel(c, 760, 980, 150, 110, '#2C3150', { sw: .25, ha: .12 });   // спинка пассажира и подголовник
    jacket4(c);   // v21.2: куртка на спинке — плечи, воротник с лацканами, свисающий рукав
  }
  function jacket4(c) {   // куртка через спинку пассажирского сиденья
    const O = '#6B6A3E', OD = '#55542F', OL = '#7E7D4A';
    poly(c, [655, 1130, 700, 1112, 740, 1150, 712, 1560, 652, 1548]); cel(c, 652, 1112, 90, 450, OD, { sw: .35, ha: .18 });   // рукав свисает вдоль сиденья
    rr(c, 648, 1520, 66, 40, 10); fill(c, '#47462A');   // манжета
    poly(c, [690, 1118, 772, 1096, 830, 1142, 888, 1096, 972, 1118, 990, 1300, 984, 1490, 900, 1520, 830, 1508, 760, 1520, 676, 1490, 668, 1300]); cel(c, 668, 1096, 322, 424, O, { sw: .28, hx: .1, ha: .25 });   // плечи и полы
    poly(c, [772, 1096, 830, 1142, 812, 1262, 768, 1176]); fill(c, OD); poly(c, [888, 1096, 830, 1142, 848, 1262, 892, 1176]); fill(c, shd(O, .2));   // лацканы
    poly(c, [790, 1090, 830, 1128, 870, 1090, 830, 1080]); fill(c, OL);   // воротник
    c.fillStyle = 'rgba(30,30,16,.35)'; c.fillRect(828, 1262, 6, 250); [1300, 1370, 1440].forEach(y => { circ(c, 846, y, 7, '#C9A24A'); circ(c, 844, y - 2, 2.5, '#FFE7A0') });
    c.beginPath(); c.moveTo(700, 1118); c.quadraticCurveTo(735, 1104, 772, 1100); lnB(c, 3, 'rgba(255,255,230,.25)');
  }
  function console4(c, t, hide) {   // подлокотник между сиденьями в перспективе; на нём держатель (с тенью касания), спереди — пепельница
    const a = TD4; c.save();
    poly(c, [400, 1250, 680, 1250, 742, 1362, 338, 1362]); lnB(c, 10, '#0A0B16'); poly(c, [338, 1362, 742, 1362, 742, 1720, 338, 1720]); lnB(c, 10, '#0A0B16');   // тёмный зазор — отделён от сидений
    poly(c, [338, 1362, 742, 1362, 742, 1720, 338, 1720]); cel(c, 338, 1362, 404, 358, '#1A1D32', { sw: .2, ha: .08 });   // передняя стенка
    poly(c, [400, 1250, 680, 1250, 742, 1362, 338, 1362]); fill(c, '#2C3150'); c.fillStyle = 'rgba(255,255,255,.06)'; poly(c, [400, 1250, 680, 1250, 690, 1268, 392, 1268]); c.fill();   // крышка подлокотника
    c.beginPath(); c.moveTo(370, 1306); c.lineTo(710, 1306); c.setLineDash([10, 8]); lnB(c, 2, 'rgba(255,255,255,.12)'); c.setLineDash([]);   // строчка
    c.beginPath(); c.ellipse(430, 1292, 36, 12, 0, 0, TAU); fill(c, '#111326');   // подстаканник
    if (!hide) iqos4(c, HD.x, HD.y, HC.L / MCAR, { left: true, stick: 1, name: true, ang: HDA, shc: 'rgba(4,5,14,.5)' });
    const op = eio(at(t, a.pep - .2, a.pep + .2)), ax = 540, ay = 1520;   // пепельница: крышка откидывается вверх — внутри пусто, чистый металл с бликом
    rr(c, ax - 116, ay - 54, 232, 108, 14); fill(c, '#0F1124');
    if (op > .05) { rr(c, ax - 100, ay - 40, 200, 80, 10); const g = c.createLinearGradient(0, ay - 40, 0, ay + 40); g.addColorStop(0, '#5E6578'); g.addColorStop(.5, '#C9CED9'); g.addColorStop(1, '#7A8194'); c.fillStyle = g; c.fill();
      c.save(); rr(c, ax - 100, ay - 40, 200, 80, 10); c.clip(); c.globalAlpha *= op; poly(c, [ax - 70, ay + 40, ax - 40, ay + 40, ax + 10, ay - 40, ax - 20, ay - 40]); fill(c, 'rgba(255,255,255,.85)');
        poly(c, [ax - 2, ay + 40, ax + 10, ay + 40, ax + 60, ay - 40, ax + 48, ay - 40]); fill(c, 'rgba(255,255,255,.55)'); c.restore();
      rr(c, ax - 100, ay - 40, 200, 80, 10); lnB(c, 2, 'rgba(238,241,248,.6)') }
    c.save(); c.translate(ax, ay - 54); c.scale(1, Math.cos(op * 2.6)); rr(c, -116, -4, 232, 108, 14); fill(c, op < .6 ? '#2A2E4A' : '#3A3F5E'); rr(c, -116, -4, 232, 108, 14); lnB(c, 2, 'rgba(160,170,210,.35)'); c.restore();
    c.restore();
  }
  function carPuff(c, t) {   // v21.2: лёгкий пар — у самого водителя, тает над его головой
    const a = TD4, k = at(t, a.mash - .35, a.mash + 1.3); if (k <= 0 || k >= 1) return; const y = lp(990, 800, eo(k)), r = lp(18, 70, eo(k)), al = .55 * Math.sin(Math.PI * k);
    for (let i = 0; i < 5; i++) { const px = 318 + i * 9 + Math.sin(i * 2.1 + t) * r * .5, py = y - i * r * .3, rr0 = r * (.7 + H1(i) * .5), g = c.createRadialGradient(px, py, 0, px, py, rr0); g.addColorStop(0, `rgba(244,241,234,${al * .5})`); g.addColorStop(.6, `rgba(244,241,234,${al * .25})`); g.addColorStop(1, 'rgba(244,241,234,0)'); c.fillStyle = g; c.fillRect(px - rr0, py - rr0, rr0 * 2, rr0 * 2) }
  }
  function sweepLight(c, t) {   // свет фонарей пробегает по салону
    const u = (t * .42) % 1; if (u > .45) return; const x = lp(1500, -600, u / .45); c.save(); c.globalAlpha *= .07 * Math.sin(Math.PI * u / .45);
    poly(c, [x, -400, x + 260, -400, x - 200, 2400, x - 460, 2400]); fill(c, '#FFE6B8'); c.restore();
  }
  function carWorld(c, t, q) {
    layerRel(c, q, { x: 540, y: 960, z: 1, r: 0 }, .35, cc => cityFar(cc, t));
    layer(c, q, 1, cc => { carInterior(cc, t); driver(cc, t); seats(cc, t); console4(cc, t, HIDE_H); carPuff(cc, t) });
    layerRel(c, q, { x: 540, y: 960, z: 1, r: 0 }, 1.2, cc => A(cc, 1 - at(Math.log(q.z), .7, 1.3), () => sweepLight(cc, t)));   // при нырке в экран свет фонарей не бежит
  }
  function carShot(c, t) {
    const a = TD4;
    if (t < a.sl1) {   // v21.2: переезд — витрина уходит вверх, салон приходит снизу, держатель по экрану переезжает на подлокотник и поворачивается
      const e = eio(at(t, a.j, a.sl1)), qs = camObj(camAt(KC, t)), qd = camObj(camAt(KD, t));
      const yb = HH * (1 - e);   // граница шторки: выше — витрина, ниже — салон (каждый мир только в своей полосе — не наслаиваются)
      HIDE_H = true; c.save(); c.beginPath(); c.rect(0, 0, WW, yb); c.clip(); c.translate(0, -HH * e); storeShot(c, t); c.restore();
      c.save(); c.beginPath(); c.rect(0, yb, WW, HH - yb); c.clip(); c.translate(0, yb); carWorld(c, t, qd); c.restore(); HIDE_H = false;
      if (e > 0 && e < 1) { const g = c.createLinearGradient(0, yb - 14, 0, yb + 14); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, 'rgba(0,0,0,.4)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, yb - 14, WW, 28) }
      const s0 = [(HC.x - qs.x) * qs.z + 540, (HC.y - qs.y) * qs.z + 960, HC.L * qs.z, 0], s1 = [(HD.x - qd.x) * qd.z + 540, (HD.y - qd.y) * qd.z + 960, HC.L / MCAR * qd.z, HDA];
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); iqos4(c, lp(s0[0], s1[0], e), lp(s0[1], s1[1], e) - 70 * Math.sin(Math.PI * e), lp(s0[2], s1[2], e), { left: true, stick: 1, name: true, ang: lp(0, HDA, e), shadow: e > .85, shc: 'rgba(4,5,14,.5)' }); c.restore();
      return }
    const q = camObj(camAt(KD, t)); carWorld(c, t, q);
  }
  // ================= мир G — лаборатория в Швейцарии, 2017 (строки 8–9) =================
  // Стык с магазином (мир F): в темноте тот же луч и тот же держатель на белой полочке — свет зажигается, вокруг лаборатория.
  // «поймали этот пар» — колпак опускается и ловит «?» (наклейка «ПАР»); «те же яды» — полоса сканера (#037), в паре и в дыме сигареты — одни шестигранники (#116);
  // «многих меньше, одного даже больше» — пары столбиков на доске (#109), один белый выстреливает выше серого и краснеет; «никотина 84 %» — круг (#120).
  // «Статью они так и назвали» — журнал на столе, наклейка «ПАР» отклеивается — под ней «ДЫМ» (#088), из-под заголовка выползает дым (#141).
  let TG = null, KG = null, NGH = null;
  const HG = { x: 540, y: 1100, L: 180 }, BENCH = 1118, BENCHF = 1420, JRN = { x: 560, y: 1300, w: 470, h: 300 }, JAR = { x: 540, w: 300, h: 380 };
  const BARS4 = [[230, 70], [270, 90], [210, 50], [250, 320], [190, 80]];   // [дым, пар]; четвёртый «пар» — выше дыма
  function labInit() {
    const w8 = (q, n) => Ws('s8', q, n), w9 = (q, n) => Ws('s9', q, n);
    TG = { j: TF.jFG, poim: w8('поймали'), yady: w8('яды'), mnog: w8('многих'), odn: w8('одного'), bol: w8('больше'), nik: w8('никотина'), stat: w9('статью'), dym: w9('дым'), imen: w9('именем'), dvadc: Ws('s10', 'двадцатом') };
    const a = TG; a.on = a.j + .1; a.jGH = a.dvadc + .45;
    KG = [KY(a.on + .55, 540, 1010, 1.32), KY(a.poim + .45, 540, 1010, 1.42), KY(a.yady + .3, 430, 1060, 1.28), KY(a.mnog + .35, 780, 600, 1.32), KY(a.bol + .3, 820, 560, 1.6),
      KY(a.nik + .7, 790, 520, 1.5), KY(a.stat - .3, 420, 760, 1.12), KY(a.stat + .45, 560, 1180, 1.42), KY(a.dym + .35, 520, 1160, 1.55), KY(a.imen + .4, 470, 1230, 1.72),
      KY(a.jGH - .3, 452, 1292, 4.2), KY(a.jGH, JRN.x - 118, JRN.y, 6.6)];   // v21.1: наезд на заголовок статьи — страница во весь экран; это же журнал на столе FDA (стык без белого)
    NGH = { x: JRN.x - (JRH.x - 540), y: JRN.y - (JRH.y - 960), m: 1 };   // журнал на столе FDA (мир H)
  }
  // общий «луч в темноте» на стыке магазин → лаборатория: темнота, луч, кусок белой полочки, держатель, пар и «?»
  function spotScene(c, t, x, y, L, k, tq, q0) {   // v21.2: свет гаснет «диафрагмой» — темнота сходится к лучу над держателем (не рубка в чёрное)
    if (k <= 0) return; c.save();
    if (k < 1) { const R = 2200 * (1 - eio(k)), g = c.createRadialGradient(x, y - 80, R * .5, x, y - 80, R + 2); g.addColorStop(0, 'rgba(11,12,22,0)'); g.addColorStop(1, 'rgba(11,12,22,1)'); c.fillStyle = g; c.fillRect(x - 4000, y - 4000, 8000, 8000) }
    else { c.fillStyle = '#0B0C16'; c.fillRect(x - 4000, y - 4000, 8000, 8000) }
    c.globalAlpha *= k; beam(c, x, y - 760, x, y + 18, 30, 190, '#FFE6B8', .22);
    c.fillStyle = '#D8D4CC'; c.fillRect(x - 170, y + 18, 340, 22); c.fillStyle = '#B9B5AD'; c.fillRect(x - 170, y + 40, 340, 8);
    c.beginPath(); c.ellipse(x, y + 22, 190, 26, 0, 0, TAU); c.fillStyle = 'rgba(255,230,184,.12)'; c.fill(); c.restore();
    const drop = 1 - eo(at(k, .1, .6)); if (k > .1) { c.save(); c.globalAlpha *= Math.min(1, (k - .1) * 4); iqos4(c, x, y - 260 * drop, L, { name: true, shadow: false, leds: 0, stick: 1 }); c.restore() }   // держатель опускается в луч на полку
    qVapor2(c, t, vapX(x, L), y, k * (q0 ?? 1), tq);
  }
  function vapX(x, L) { return x + L / 2 - 14 + L * .34 }   // v21.1: пар идёт из стика, а не из корпуса держателя
  function qVapor2(c, t, x, y, k, tq) {   // пар → белый «?» (над держателем, близко — в луче)
    if (k <= 0) return; smokeLine(c, [x, y - 16, x + 8 + Math.sin(t * 2) * 6, y - 60, x - 4, y - 100], 6, '#F4F1EA', .5 * k);
    const kq = eio(at(t, tq - .1, tq + .5)) * k; if (kq <= 0) return;
    c.save(); c.translate(x - 50, y - 190); c.globalAlpha *= kq; c.beginPath(); c.arc(0, -34, 40, Math.PI * 1.05, Math.PI * .35, false); c.quadraticCurveTo(8, 26, 0, 46);
    lnB(c, 16, 'rgba(244,241,234,.92)'); circ(c, 0, 82, 10, 'rgba(244,241,234,.92)'); c.restore();
  }
  const hexA = (c, x, y, r, col, w = 3) => { c.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) } c.closePath(); lnB(c, w, col) };
  function hexes(c, x, y, w, h, k, seed) { if (k <= 0) return; for (let i = 0; i < 7; i++) { const hx = x + H1(seed + i) * w, hy = y + H1(seed + i * 3.3) * h, r = 14 + H1(i * 5) * 10; c.save(); c.globalAlpha *= k; hexA(c, hx, hy, r, '#F2B84B', 3); hexA(c, hx + r * 1.7, hy, r * .8, '#F2B84B', 2.5); c.restore() } }
  function labRoom4(c, t) {
    c.fillStyle = C4.lab; c.fillRect(-3000, -3000, 7000, BENCH + 3000);
    c.strokeStyle = 'rgba(126,214,210,.08)'; c.lineWidth = 2; c.beginPath(); for (let x = -1200; x < 2400; x += 80) { c.moveTo(x, -400); c.lineTo(x, BENCH) } for (let y = -400; y < BENCH; y += 80) { c.moveTo(-1200, y); c.lineTo(2400, y) } c.stroke();
    for (const lx of [300, 800]) { rr(c, lx - 70, 100, 140, 34, 8); fill(c, '#0E2B2E'); c.fillStyle = '#CFF6F2'; c.fillRect(lx - 56, 128, 112, 9); beam(c, lx, 140, lx + 40, BENCH, 50, 320, '#CFF6F2', .06) }
    c.fillStyle = '#E6EEF2'; c.fillRect(90, 240, 380, 460); ['#BFD5E8', '#A9C6E0', '#93B6D6'].forEach((col, i) => { c.fillStyle = col; c.fillRect(90, 240 + i * 60, 380, 62) });   // окно: небо и Альпы
    poly(c, [90, 620, 150, 470, 210, 540, 290, 400, 370, 520, 420, 470, 470, 560, 470, 700, 90, 700]); fill(c, '#5E7AA0'); poly(c, [260, 440, 290, 400, 322, 446, 300, 438, 284, 452]); fill(c, '#FFFFFF'); poly(c, [130, 520, 150, 470, 170, 516]); fill(c, '#FFFFFF');
    c.fillStyle = '#7E9A6E'; c.fillRect(90, 660, 380, 40); rr(c, 90, 240, 380, 460, 4); lnB(c, 14, '#0B2427'); c.fillStyle = '#0B2427'; c.fillRect(276, 240, 10, 460);
    rr(c, 380, 420, 64, 64, 6); fill(c, '#D52B1E'); c.fillStyle = '#FFFFFF'; c.fillRect(405, 432, 14, 40); c.fillRect(392, 445, 40, 14);   // v21.2: швейцарский флажок на правом стекле — в кадре с первой секунды и не под плашкой года
    rr(c, 560, 230, 470, 540, 10); fill(c, '#F4F6F2'); rr(c, 560, 230, 470, 540, 10); lnB(c, 8, '#9AA6A8');   // доска
    [[-1300, 380], [1120, 320]].forEach(([sx, sy], i) => { c.fillStyle = '#0B2427'; c.fillRect(sx, sy, 420, 16); for (let k = 0; k < 4; k++) { const fx = sx + 40 + k * 100, h = 70 + H1(i * 4 + k) * 70, col = ['#3FB6A8', '#7ED6CF', '#E7A9B6', '#F2B84B'][(i + k) % 4];
      c.beginPath(); c.moveTo(fx, sy); c.lineTo(fx, sy - h * .55); c.lineTo(fx + 12, sy - h * .55); c.lineTo(fx + 12, sy - h); c.lineTo(fx + 30, sy - h); c.lineTo(fx + 30, sy - h * .55); c.lineTo(fx + 42, sy - h * .55); c.lineTo(fx + 42, sy); c.closePath(); fill(c, rgba(col, .75)); lnB(c, 2.5, 'rgba(230,250,248,.5)') } });
    c.fillStyle = '#D8D4CC'; c.fillRect(-3000, BENCH, 7000, BENCHF - BENCH); c.fillStyle = 'rgba(0,0,0,.05)'; c.fillRect(-3000, BENCH, 7000, 40);
    c.fillStyle = '#B9B5AD'; c.fillRect(-3000, BENCHF, 7000, 32); c.fillStyle = C4.labD; c.fillRect(-3000, BENCHF + 32, 7000, 3000);
    for (let x = -600; x < 1800; x += 300) { c.fillStyle = '#103236'; c.fillRect(x, BENCHF + 32, 6, 1400); circ(c, x + 150, BENCHF + 120, 8, C4.gold) }
  }
  function ashtrayCig(c, t, sk) {   // пепельница и тлеющая сигарета — для сравнения
    const x = 210, y = 1240; c.beginPath(); c.ellipse(x + 8, y + 18, 110, 26, 0, 0, TAU); fill(c, 'rgba(6,8,24,.25)'); c.beginPath(); c.ellipse(x, y, 100, 30, 0, 0, TAU); fill(c, 'rgba(200,225,235,.55)');
    c.beginPath(); c.ellipse(x, y - 4, 64, 16, 0, 0, TAU); fill(c, 'rgba(120,140,150,.45)'); cig3(c, x - 120, y - 30, x + 30, y - 6, 9, { tip: '#D9874A', tl: .25, em: 1 });
    smokeLine(c, [x + 34, y - 18, x + 50 + Math.sin(t * 1.6) * 16, y - 120, x + 30, y - 230, x + 60 + Math.sin(t) * 12, y - 340], 7, '#C9C6D2', .7);
    hexes(c, x - 20, y - 330, 120, 260, sk, 11);
  }
  function bellJar(c, t, ky, label) {   // стеклянный колпак: стекло, блики, наклейка
    const x = JAR.x, b = BENCH + 6 - ky, w = JAR.w, h = JAR.h; c.save();
    c.beginPath(); c.moveTo(x - w / 2, b); c.lineTo(x - w / 2, b - h + w / 2); c.arc(x, b - h + w / 2, w / 2, Math.PI, 0); c.lineTo(x + w / 2, b); c.closePath();
    c.fillStyle = 'rgba(200,230,240,.14)'; c.fill(); lnB(c, 4, 'rgba(230,250,255,.7)'); c.save(); c.clip(); glint(c, x - w / 2, b - h, w, h, .12); c.restore();
    rr(c, x - w / 2 - 14, b - 18, w + 28, 22, 8); fill(c, 'rgba(200,230,240,.35)'); c.restore();
    if (label) label(x, b - h * .86);   // v21.1: наклейка — на куполе, над «?» (иначе вместе с «?» читалась как висячий замок)
  }
  function labelPAR(c, t, x, y, peel) {   // наклейка «ПАР» отклеивается с угла — под ней «ДЫМ»
    const w = 150, h = 64; c.save(); c.translate(x, y); c.rotate(-.05);
    rr(c, -w / 2, -h / 2, w, h, 6); fill(c, '#F4F1EA'); tx(c, TEXT.smoke, 0, 3, { f: 'M', w: 800, s: 40, c: C4.red, ls: 4 });
    if (peel < 1) { const p = eio(peel), cx = w / 2 - w * p * 1.1; c.save(); c.beginPath(); c.rect(-w / 2 - 2, -h / 2 - 2, cx + w / 2 + 2, h + 4); c.clip(); rr(c, -w / 2, -h / 2, w, h, 6); fill(c, '#FFFFFF'); tx(c, TEXT.vapor, 0, 3, { f: 'M', w: 800, s: 40, c: '#141010', ls: 4 }); c.restore();
      if (p > 0) { poly(c, [cx, -h / 2, cx + 30 * p + 8, -h / 2 - 10 * p, cx + 30 * p + 8, h / 2 - 10 * p, cx, h / 2]); fill(c, '#E2DDD2') } }
    c.restore();
  }
  function bars4(c, t) {   // пары столбиков на доске: серый — дым, белый — пар; четвёртый белый — выше и краснеет
    const a = TG, base = 700, x0 = 610, ko = 1 - at(t, a.nik - .2, a.nik + .1); if (ko <= 0) return; c.save(); c.globalAlpha *= ko;
    c.fillStyle = '#2B2F55'; c.fillRect(x0 - 10, base, 410, 4); c.fillRect(x0 - 10, 300, 4, base - 296);   // оси — видны сразу, доска не пустая
    rr(c, x0, 260, 22, 22, 3); fill(c, '#8C8FA0'); tx(c, TEXT.smoke, x0 + 32, 272, { f: 'M', w: 800, s: 22, c: '#2B2F55', al: 'left' });
    rr(c, x0 + 120, 260, 22, 22, 3); fill(c, '#FFFFFF'); rr(c, x0 + 120, 260, 22, 22, 3); lnB(c, 2, '#2B2F55'); tx(c, TEXT.vapor, x0 + 152, 272, { f: 'M', w: 800, s: 22, c: '#2B2F55', al: 'left' });
    const k = eo(at(t, a.mnog - .1, a.mnog + .6));
    if (k > 0) BARS4.forEach(([g, w], i) => { const x = x0 + i * 82, kb = cl(k * 1.4 - i * .1), up = i === 3 ? eo(at(t, a.odn - .05, a.odn + .4)) : 0, wh = (i === 3 ? lp(90, w, up) : w) * kb;
      rr(c, x, base - g * kb, 30, g * kb, 4); fill(c, '#8C8FA0'); rr(c, x + 34, base - wh, 30, wh, 4); fill(c, i === 3 ? mixc('#FFFFFF', C4.red, up) : '#FFFFFF'); rr(c, x + 34, base - wh, 30, wh, 4); lnB(c, 2, '#2B2F55') });
    c.restore();
  }
  function gauge4(c, t) {   // никотин: 84 % от сигареты (#120) — на той же доске, вместо столбиков (v21.1: был над окном с Альпами и уезжал под плашку года)
    const a = TG, k = eo(at(t, a.nik - .05, a.nik + .35)); if (k <= 0) return; const x = 795, y = 500, R = 150, f = .84 * eio(at(t, a.nik + .1, a.nik + 1.3)), fv = .84 * eio(at(FT, a.nik + .1, a.nik + 1.3)), s = bo(k);
    c.save(); c.translate(x, y); c.scale(s, s); circ(c, 8, 12, R + 30, 'rgba(0,0,0,.18)'); circ(c, 0, 0, R + 30, '#F4F1EA');
    c.beginPath(); c.arc(0, 0, R - 10, 0, TAU); lnB(c, 40, '#D9D3C6'); c.beginPath(); c.arc(0, 0, R - 10, -Math.PI / 2, -Math.PI / 2 + TAU * f); lnB(c, 40, '#E2412F');
    tx(c, TEXT.fPctN(Math.round(fv * 100)), 0, -6, { f: 'M', w: 800, s: 66, c: '#141010' }); tx(c, TEXT.nicL, 0, 50, { f: 'M', w: 800, s: 26, c: '#141010', ls: 3 }); c.restore();
  }
  // журнал: раскрыт, слева заголовок статьи (сначала закрыт полоской), справа колонки; есть белый просвет справа — в него ныряет камера
  function journal4(c, t, x, y, strip, smoke) {
    const { w, h } = JRN; c.save(); c.translate(x, y);
    rasterPoly(c, [-w / 2 + 20, h / 2, w / 2, h / 2, w / 2 + 70, h / 2 + 40, -w / 2 + 90, h / 2 + 40], 'rgba(6,8,24,.3)', 9, 2.2);
    c.fillStyle = '#FFFDF8'; c.fillRect(-w / 2, -h / 2, w, h); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(-3, -h / 2, 6, h);
    c.fillStyle = '#B5162B'; c.fillRect(-w / 2 + 18, -h / 2 + 18, w / 2 - 36, 26); tx(c, OBJ.journal, -w / 4, -h / 2 + 32, { f: 'M', w: 800, s: 15, c: '#FFFFFF', mw: w / 2 - 90 });
    tx(c, OBJ.jtitle1, -w / 4, -h / 2 + 74, { f: 'P', w: 700, s: 17, c: '#141010', mw: w / 2 - 82 }); tx(c, OBJ.jtitle2, -w / 4, -h / 2 + 100, { f: 'P', w: 700, st: 'italic', s: 21, c: '#141010', mw: w / 2 - 82 });
    if (strip < 1) { const s = eio(strip); c.save(); c.translate(-w / 4 + s * 260, -h / 2 + 88 - s * 120); c.rotate(s * .5); rr(c, -w / 4 + 6, -26, w / 2 - 12, 52, 3); fill(c, '#EDE6D6'); rr(c, -w / 4 + 6, -26, w / 2 - 12, 52, 3); lnB(c, 2, 'rgba(0,0,0,.15)'); c.restore() }
    textLines(c, -w / 2 + 18, -h / 2 + 128, w / 2 - 36, 150, 10, 'rgba(27,26,24,.35)', 51);
    textLines(c, 18, -h / 2 + 22, w / 2 - 36, 60, 5, 'rgba(27,26,24,.35)', 61); textLines(c, 18, -h / 2 + 152, w / 2 - 36, 120, 8, 'rgba(27,26,24,.35)', 71);   // справа: просвет y −h/2+90…−h/2+148
    if (smoke > 0) for (let i = 0; i < 3; i++) smokeLine(c, [-w / 4 - 90 + i * 90, -h / 2 + 108, -w / 4 - 70 + i * 90 + Math.sin(t * 1.4 + i) * 14, -h / 2 + 30, -w / 4 - 100 + i * 90, -h / 2 - 60, -w / 4 - 60 + i * 90, -h / 2 - 160], 10, '#B9B6C4', .7 * smoke);
    c.restore();
  }
  function labWorld(c, t, q) {
    const a = TG; labRoom4(c, t);
    c.fillStyle = '#D8D4CC'; c.fillRect(HG.x - 170, BENCH, 340, 22); c.fillStyle = '#B9B5AD'; c.fillRect(HG.x - 170, BENCH + 22, 340, 8);   // белая полочка под держателем
    const sk = eio(at(t, a.yady - .1, a.yady + .5)) * (1 - at(t, a.stat - .3, a.stat));
    ashtrayCig(c, t, sk);
    iqos4(c, HG.x, HG.y, HG.L, { name: true, shadow: false, leds: 0, stick: 1 });
    qVapor2(c, t, vapX(HG.x, HG.L), HG.y, 1, -10);
    hexes(c, HG.x - 120, HG.y - 300, 220, 220, sk, 5);
    const ky = 760 * (1 - eio(at(t, a.poim - .2, a.poim + .25)));
    bellJar(c, t, ky, (x, y) => labelPAR(c, t, x, y, at(t, a.dym - .1, a.dym + .45)));
    const sc = at(t, a.yady - .15, a.yady + .75); if (sc > 0 && sc < 1) { const x = lp(80, 760, sc); c.save(); c.globalAlpha *= Math.sin(Math.PI * sc); c.fillStyle = 'rgba(126,240,180,.25)'; c.fillRect(x - 40, 560, 80, 700); c.fillStyle = 'rgba(126,240,180,.85)'; c.fillRect(x - 3, 560, 6, 700); c.restore() }
    bars4(c, t); gauge4(c, t);
    const kj = eio(at(t, a.stat - .2, a.stat + .4)); if (kj > 0) journal4(c, t, lp(1500, JRN.x, kj), JRN.y, at(t, a.dym - .05, a.dym + .45), at(t, a.imen - .3, a.imen + .5));
    spotScene(c, t, HG.x, HG.y, HG.L, 1 - at(t, a.on - .1, a.on + .7), -10, 1);   // v21.2: свет в лаборатории зажигается за 0,8 с (было 0,45 с с двойным сглаживанием — вспышка)
  }
  function labShot(c, t) {
    const q = camObj(camAt(KG, t)); layer(c, q, 1, cc => labWorld(cc, t, q));
    const a = TG; capS(c, TEXT.onemore, 540, 300, at(t, a.bol + .15, a.bol + .45) * (1 - at(t, a.nik - .2, a.nik)), { s: 54 });
    capS(c, TEXT.title, 540, 1480, at(t, a.imen + .05, a.imen + .35) * (1 - at(t, a.jGH - .5, a.jGH - .25)), { s: 46 });   // под журналом: не налезает на колпак с «ДЫМ»
  }
  // ================= мир H — кабинет FDA (строки 10–13) =================
  // Стык с лабораторией: камера ныряет в белое поле журнала — и выныривает из того же журнала на столе кабинета (тот же рисунок, m = 1).
  // Строка 10: за окном здание FDA и флаг США; на журнал ложится бланк из двух строк: у «МЕНЬШЕ ВЕЩЕСТВ» — галочка, «МЕНЬШЕ ВРЕДА» закрывает
  // красная планка «НЕЛЬЗЯ» (#105), вторая галочка отскакивает от планки.
  // Строка 11: планка тянется в красную нить и вытаскивает из-под журнала записку «Рейнольдс» 1973 года (та же, что в главе 1; #126);
  // за окном вместо FDA выезжает башня Reynolds и заводы. Дата подсвечивается, «МОЛОДЁЖНОГО РЫНКА» — под маркером.
  // Строка 12: записка уезжает, на её место падают пачка Premier и сигарета с угольком: уголёк гаснет, вспыхивает, прожигает стопку долларов (#089).
  // Строка 13: из пепла выезжает синий лист PATENT · R.J. Reynolds и ложится на карту США, что лежит на том же столе (карта — 70-map.js).
  let TH = null, KH = null;
  const RH = { x: 540, y: 1000, z: 1, r: 0 };   // опорная камера параллакса
  const WINH = { x0: 110, x1: 970, y0: 130, y1: 820 }, DESKH = 930, BLT = { x0: 70, x1: 1060, y0: 1030, y1: 1660 };
  const JRH = { x: 380, y: 1250 }, FORM = { x: 395, y: 1232, w: 400, h: 276, r: -.035 }, IQH = { x: 300, y: 1512, L: 220 };
  const MEMO0 = { x: 404, y: 1254, s: .48, r: -1.55 }, MEMO1 = { x: 800, y: 1290, s: .48, r: .04 }, MEMO2 = { x: 940, y: 2300, s: .48, r: .32 };
  const PREMH = { x: 690, y: 1262 }, CIGH = [588, 1452, 858, 1410], BILLH = { x: 930, y: 1416, w: 150, n: 9 }, DRUMH = { x: 930, y: 1566 };
  const PAT0 = { x: 930, y: 1404 }, PAT1 = { x: 1290, y: 1330, r: -.12 }, PATW = 300, PATHH = 390;
  function deskInit() {
    const w10 = (q, n) => Ws('s10', q, n), w11 = (q, n) => Ws('s11', q, n), w12 = (q, n) => Ws('s12', q, n), w13 = (q, n) => Ws('s13', q, n);
    TH = { j: TG.jGH, reg: w10('регулятор'), razr: w10('разрешил'), vesch: w10('веществ'), mensh: w10('меньше', 0), vreda: w10('вреда'), mensh2: w10('меньше', 1),
      razresh: w10('разрешает'), por: w10('пор'), pomn: w11('помните'), reyn: w11('рейнольдс'), sem: w11('семьдесят'), isk: w11('искали'), podr: w11('подростков'),
      svoi: w12('свои'), prizh: w12('прижились'), ugol: w12('угольком'), sela: w12('съела'), treh: w12('трёхсот'), doll: w12('долларов'),
      pat: w13('патенты'), vyzh: w13('выжили'), perv: w13('первом'), kom: w13('комиссия'), narush: w13('нарушает'), vygn: w13('выгнала'), amer: w13('америки'),
      obesch: Ws('s14', 'обещание') };
    const a = TH; a.jHA = a.obesch + .15; a.form = a.reg + .05; a.land = a.perv + .02;
    KH = [KY(a.j + .6, 452, 1150, 2.6), KY(a.reg + .45, 530, 985, 1.16), KY(a.vesch, 470, 1120, 1.42), KY(a.mensh + .1, 430, 1188, 1.72), KY(a.vreda + .3, 420, 1205, 1.86),
      KY(a.razresh + .5, 450, 1180, 1.62), KY(a.pomn + .3, 600, 1130, 1.34), KY(a.reyn + .45, 650, 1000, 1.14), KY(a.sem + .05, 790, 1258, 2.0), KY(a.podr + .3, 800, 1300, 2.2),
      KY(a.svoi + .35, 790, 1332, 1.85), KY(a.prizh + .2, 800, 1362, 2.0), KY(a.ugol + .25, 845, 1392, 1.98), KY(a.sela + .7, 890, 1432, 1.92), KY(a.doll + .25, 910, 1452, 1.9),
      KY(a.pat + .25, 1010, 1412, 1.62), KY(a.perv - .25, 1300, 1430, 1.55), KY(a.perv + .45, 1470, 1480, 1.82), KY(a.kom + .4, 1500, 1470, 1.9), KY(a.narush + .1, 1470, 1500, 2.05),
      KY(a.vygn + .2, 1600, 1540, 1.95), KY(a.amer + .3, 1640, 1560, 1.95), KY(a.jHA, 1650, 1560, 2.05)];
  }
  // ---------- за окном: здание FDA с флагом → башня Reynolds и заводы (сумерки) ----------
  function flag4(c, x, y, w, h, t) {   // флаг США полосками, колышется
    const n = 16; for (let i = 0; i < n; i++) { const u = i / n, dx = x + u * w, dy = Math.sin(t * 3.2 - u * 5) * 6 * u, cw = w / n + 1;
      for (let s = 0; s < 7; s++) { c.fillStyle = s % 2 ? '#F4F1EA' : '#B22234'; c.fillRect(dx, y + dy + s * h / 7, cw, h / 7 + .5) }
      if (u < .42) { c.fillStyle = '#3C3B6E'; c.fillRect(dx, y + dy, cw, h * 4 / 7) } }
    c.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 6; i++) { const u = (.05 + (i % 3) * .12), dy = Math.sin(t * 3.2 - u * 5) * 6 * u; c.fillRect(x + u * w, y + dy + 8 + Math.floor(i / 3) * 16, 4, 4) }
  }
  function fdaFar(c, t) {
    const a = TH, sw = eio(at(t, a.reyn - .25, a.reyn + .55)), dusk = eio(at(t, a.reyn - .1, a.svoi + .6));
    const SK = ['#8FB6DE', '#A9C8E6', '#C7DCEE', '#E2EBF1'], SD = ['#24264F', '#433A6A', '#83566F', '#CC8660'];
    SK.forEach((col, i) => { c.fillStyle = mixc(col, SD[i], dusk); c.fillRect(-1600, -400 + i * 320, 4300, 322) });
    c.fillStyle = mixc('#E2EBF1', '#E39A63', dusk); c.fillRect(-1600, 880, 4300, 700);
    c.save(); c.translate(lp(-130, -1630, sw), 0);   // здание FDA (кампус Уайт-Оук): длинный корпус, центральный блок, вывеска, флаг
    const B = '#C9CED8', BD = '#A8AFBE', W = '#6F86A6';
    c.fillStyle = '#7E9A6E'; c.fillRect(-300, 800, 1700, 500);
    c.fillStyle = B; c.fillRect(110, 560, 860, 250); c.fillStyle = BD; c.fillRect(110, 560, 860, 14); c.fillRect(110, 790, 860, 20);
    c.fillStyle = W; for (let r = 0; r < 4; r++) for (let i = 0; i < 19; i++) { const x = 130 + i * 44; if (x > 395 && x < 690) continue; c.fillRect(x, 596 + r * 46, 26, 26) }
    c.fillStyle = B; c.fillRect(410, 400, 270, 410); c.fillStyle = BD; c.fillRect(410, 400, 270, 16); c.fillRect(640, 416, 40, 394);
    c.fillStyle = W; for (let r = 0; r < 6; r++) for (let i = 0; i < 4; i++) c.fillRect(432 + i * 52, 438 + r * 42, 30, 26);
    rr(c, 448, 702, 194, 50, 6); fill(c, '#1D3F8F'); tx(c, OBJ.fda, 545, 728, { f: 'M', w: 800, s: 38, c: '#FFFFFF', ls: 8 });
    c.fillStyle = '#26324F'; c.fillRect(505, 756, 80, 54);
    c.fillStyle = '#8A8F9C'; c.fillRect(858, 420, 7, 390); circ(c, 861, 418, 7, '#C9A24A'); flag4(c, 866, 428, 132, 78, t);
    for (let i = 0; i < 14; i++) circ(c, 120 + i * 64, 812, 34 + H1(i) * 10, i % 2 ? '#4E6B45' : '#5A7A4F');   // кусты
    c.restore();
    c.save(); c.translate(lp(1500, 0, sw), 0);   // башня Reynolds (ар-деко) и заводы с трубами, как в главе 1
    const L = mixc('#C8B08A', '#9C7F6A', dusk), LD = mixc('#A88F6C', '#7A6152', dusk);
    c.fillStyle = mixc('#5B6B52', '#2C2A3E', dusk); c.fillRect(-300, 800, 1700, 500);
    c.fillStyle = mixc('#8F7E6E', '#4A3F4E', dusk); c.fillRect(120, 650, 330, 160); for (let i = 0; i < 5; i++) { poly(c, [120 + i * 66, 650, 153 + i * 66, 600, 186 + i * 66, 650]); fill(c, mixc('#8F7E6E', '#4A3F4E', dusk)) }
    [210, 300, 390].forEach((x, i) => { c.fillStyle = mixc('#7A6A5C', '#3E3443', dusk); c.fillRect(x - 16, 400 + i * 30, 32, 260 - i * 30); c.fillStyle = '#B22234'; c.fillRect(x - 16, 420 + i * 30, 32, 14);
      smokeLine(c, [x, 400 + i * 30, x + 30 + Math.sin(t + i) * 10, 300 + i * 30, x + 80, 200 + i * 30, x + 150 + Math.sin(t * .7 + i) * 16, 110 + i * 30], 12, '#D6D0D8', .55) });
    const TX = 690; c.fillStyle = L; c.fillRect(TX - 110, 360, 220, 450); c.fillRect(TX - 82, 270, 164, 100); c.fillRect(TX - 56, 200, 112, 80); c.fillRect(TX - 30, 150, 60, 60);
    c.fillStyle = LD; c.fillRect(TX + 60, 360, 50, 450); c.fillRect(TX + 44, 270, 38, 100); c.fillRect(TX + 30, 200, 26, 80); c.fillStyle = L; c.fillRect(TX - 3, 90, 6, 62);
    c.fillStyle = 'rgba(40,30,30,.35)'; for (let i = 0; i < 9; i++) c.fillRect(TX - 98 + i * 22, 380, 8, 420);
    c.fillStyle = rgba('#FFD27A', .75 * dusk); for (let r = 0; r < 14; r++) for (let i = 0; i < 9; i++) if (H1(r * 9 + i) > .6) c.fillRect(TX - 98 + i * 22 + 10, 392 + r * 28, 9, 12);
    c.restore();
  }
  // ---------- кабинет: стена с окном, стол, кожаная вставка, лампа ----------
  function deskRoom(c, t) {
    c.save(); c.beginPath(); c.rect(-3000, -2000, 7000, DESKH + 2000); c.rect(WINH.x0, WINH.y0, WINH.x1 - WINH.x0, WINH.y1 - WINH.y0); c.fillStyle = '#2C3349'; c.fill('evenodd'); c.restore();
    c.fillStyle = 'rgba(255,255,255,.035)'; for (let x = -2900; x < 4000; x += 140) { if (x > WINH.x0 - 10 && x < WINH.x1 + 10) { c.fillRect(x, -2000, 3, WINH.y0 + 2000); c.fillRect(x, WINH.y1, 3, DESKH - WINH.y1) } else c.fillRect(x, -2000, 3, DESKH + 2000) }
    const f = 20; c.fillStyle = '#D9DCE2'; c.fillRect(WINH.x0 - f, WINH.y0 - f, WINH.x1 - WINH.x0 + 2 * f, f); c.fillRect(WINH.x0 - f, WINH.y0, f, WINH.y1 - WINH.y0); c.fillRect(WINH.x1, WINH.y0, f, WINH.y1 - WINH.y0);
    c.fillRect((WINH.x0 + WINH.x1) / 2 - 6, WINH.y0, 12, WINH.y1 - WINH.y0); c.fillStyle = '#B9BDC6'; c.fillRect(WINH.x0 - 34, WINH.y1, WINH.x1 - WINH.x0 + 68, 26);
    c.fillStyle = '#E4E6EA'; c.fillRect(WINH.x0, WINH.y0, WINH.x1 - WINH.x0, 64); c.fillStyle = 'rgba(0,0,0,.13)'; for (let i = 0; i < 5; i++) c.fillRect(WINH.x0, WINH.y0 + 10 + i * 11, WINH.x1 - WINH.x0, 2);   // жалюзи подняты
    c.save(); c.beginPath(); c.rect(WINH.x0, WINH.y0, WINH.x1 - WINH.x0, WINH.y1 - WINH.y0); c.clip(); glint(c, WINH.x0, WINH.y0, WINH.x1 - WINH.x0, WINH.y1 - WINH.y0, .05); c.restore();
    c.fillStyle = '#3A2A22'; c.fillRect(-3000, DESKH, 7000, 3000); c.fillStyle = '#5C4334'; c.fillRect(-3000, DESKH, 7000, 12);
    c.strokeStyle = 'rgba(20,12,8,.35)'; c.lineWidth = 3; c.beginPath(); for (let i = 0; i < 26; i++) { const yy = DESKH + 50 + i * 64; c.moveTo(-3000, yy); for (let x = -3000; x < 3200; x += 180) c.lineTo(x + 90, yy + Math.sin(x * .011 + i) * 6) } c.stroke();
    rr(c, BLT.x0, BLT.y0, BLT.x1 - BLT.x0, BLT.y1 - BLT.y0, 10); fill(c, '#2C4F43'); rr(c, BLT.x0 + 14, BLT.y0 + 14, BLT.x1 - BLT.x0 - 28, BLT.y1 - BLT.y0 - 28, 6);
    c.setLineDash([10, 9]); lnB(c, 2, 'rgba(201,162,74,.5)'); c.setLineDash([]);
    const g = c.createRadialGradient(380, 1240, 40, 380, 1240, 560); g.addColorStop(0, 'rgba(255,230,184,.13)'); g.addColorStop(1, 'rgba(255,230,184,0)'); c.fillStyle = g; c.fillRect(-180, 680, 1120, 1120);   // пятно лампы
  }
  function lampH(c) {   // лампа банкира: латунь, зелёный абажур
    const bx = -10, by = 1112; c.beginPath(); c.ellipse(bx + 12, by + 12, 92, 22, 0, 0, TAU); fill(c, 'rgba(6,8,20,.35)');
    c.beginPath(); c.ellipse(bx, by, 82, 20, 0, 0, TAU); fill(c, '#A8823A'); c.beginPath(); c.ellipse(bx, by - 6, 72, 15, 0, 0, TAU); fill(c, '#D6B05A');
    c.fillStyle = '#B8913F'; c.fillRect(bx - 7, by - 196, 14, 190); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(bx - 4, by - 190, 3, 182); c.fillStyle = '#B8913F'; c.fillRect(bx - 7, by - 202, 130, 12);
    const sx = bx + 120, sy = by - 212; c.beginPath(); c.moveTo(sx - 150, sy + 40); c.quadraticCurveTo(sx - 140, sy - 30, sx, sy - 34); c.quadraticCurveTo(sx + 140, sy - 30, sx + 150, sy + 40); c.closePath();
    cel(c, sx - 150, sy - 34, 300, 74, '#1F6B4E', { sw: .3, hx: .1, ha: .3 }); c.fillStyle = '#F6D98A'; c.fillRect(sx - 146, sy + 36, 292, 8);
  }
  function lampBeam(c, t) {   // конус света лампы и пылинки (передний план)
    const sx = 110, sy = 944; c.save(); poly(c, [sx - 140, sy, sx + 140, sy, 760, 1560, -40, 1560]); c.fillStyle = 'rgba(255,230,184,.05)'; c.fill(); c.clip();
    for (let i = 0; i < 18; i++) { const px = -20 + H1(i * 3.7 + 1) * 760 + Math.sin(t * .3 + i) * 24, py = 960 + ((H1(i * 5.1 + 2) * 600 + t * (10 + H1(i) * 12)) % 600); circ(c, px, py, 2 + H1(i * 2) * 2.2, `rgba(255,236,200,${.3 + .25 * Math.sin(t + i)})`) }
    c.restore();
  }
  // ---------- бланк FDA: две строки, печать; галочки и планка «НЕЛЬЗЯ» ----------
  function checkPath(c, x, y, s, k, col, w = 9) {   // галочка рисуется по длине (k 0..1)
    if (k <= 0) return; const P = [[-14, 0], [-3, 13], [22, -20]].map(([u, v]) => [x + u * s, y + v * s]), L1 = Math.hypot(P[1][0] - P[0][0], P[1][1] - P[0][1]), L2 = Math.hypot(P[2][0] - P[1][0], P[2][1] - P[1][1]), d = (L1 + L2) * cl(k);
    c.beginPath(); c.moveTo(P[0][0], P[0][1]); if (d <= L1) c.lineTo(lp(P[0][0], P[1][0], d / L1), lp(P[0][1], P[1][1], d / L1)); else { c.lineTo(P[1][0], P[1][1]); c.lineTo(lp(P[1][0], P[2][0], (d - L1) / L2), lp(P[1][1], P[2][1], (d - L1) / L2)) }
    lnB(c, w, col);
  }
  const ROW1 = -12, ROW2 = 78;
  function formH(c, t, x, y, r, s, barK) {
    const a = TH, { w, h } = FORM; c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    rasterPoly(c, [-w / 2 + 16, h / 2, w / 2, h / 2, w / 2 + 60, h / 2 + 36, -w / 2 + 76, h / 2 + 36], 'rgba(6,8,24,.32)', 9, 2.2);
    c.fillStyle = '#FBFAF6'; c.fillRect(-w / 2, -h / 2, w, h); c.fillStyle = '#1D3F8F'; c.fillRect(-w / 2, -h / 2, w, 12);
    textLines(c, -w / 2 + 24, -h / 2 + 30, w * .5, 30, 3, 'rgba(27,26,24,.3)', 81);
    ring(c, w / 2 - 56, -h / 2 + 58, 40, '#1D3F8F', 4); ring(c, w / 2 - 56, -h / 2 + 58, 31, '#1D3F8F', 1.6); tx(c, OBJ.fda, w / 2 - 56, -h / 2 + 60, { f: 'M', w: 800, s: 24, c: '#1D3F8F', ls: 2 });
    [[TEXT.less, ROW1], [TEXT.harm, ROW2]].forEach(([s0, yy]) => { rr(c, -w / 2 + 24, yy - 22, 44, 44, 6); lnB(c, 3, '#2B2E36'); tx(c, s0, -w / 2 + 88, yy + 2, { f: 'M', w: 800, s: 34, c: '#141010', al: 'left', mw: w - 112 }) });
    checkPath(c, -w / 2 + 46, ROW1 + 2, 1.15, eo(at(t, a.mensh - .05, a.mensh + .3)), '#17A86B');
    const kb = at(t, a.vreda - .12, a.vreda + .1), thin = barK ?? 0;   // планка «НЕЛЬЗЯ»: падает сверху со стуком
    if (kb > 0 && thin < 1) { const dy = -150 * (1 - eo(kb)), sc = lp(1.25, 1, eo(kb)), hit = at(t, a.razresh + .2, a.razresh + .45), sh = Math.sin(hit * Math.PI * 4) * 6 * (1 - hit) * (hit > 0 ? 1 : 0), hh = lp(64, 6, thin);
      c.save(); c.translate(sh, ROW2 + dy + sh * .3); c.scale(sc, sc); c.globalAlpha *= Math.min(1, kb * 4);
      c.fillStyle = C4.red; c.fillRect(-w / 2 + 8, -hh / 2, w - 16, hh);   // v21.1: плоская полоса, как штамп
      if (thin < .3) tx(c, TEXT.no, 0, 3, { f: 'M', w: 800, s: 38, c: '#FFFFFF', ls: 8, a: 1 - thin / .3 });
      c.restore() }
    const kc = at(t, a.razresh - .1, a.razresh + .7);   // вторая галочка пробует встать — и отскакивает от планки
    if (kc > 0 && kc < 1) { const hit = .45, u = kc < hit ? eio(kc / hit) : 1, v = kc < hit ? 0 : (kc - hit) / (1 - hit);
      const px = kc < hit ? lp(-w / 2 - 80, -w / 2 + 46, u) : lp(-w / 2 + 46, -w / 2 - 120, v), py = kc < hit ? lp(-170, ROW2 - 46, u) : ROW2 - 46 - Math.sin(Math.PI * Math.min(1, v * 1.2)) * 120 + v * v * 160;
      c.save(); c.translate(px, py); c.rotate(kc < hit ? 0 : -v * 3); c.globalAlpha *= kc < hit ? 1 : 1 - v; checkPath(c, 0, 0, 1.15, 1, '#17A86B'); c.restore() }
    c.restore();
  }
  // ---------- записка R.J. Reynolds 1973 (как в главе 1) ----------
  let MQF = 0;
  function stamp4(c, s, x, y, k, col, r = -.2, fs = 50) {
    if (k <= 0) return; const sc = lp(1.5, 1, bo(k)); c.save(); c.translate(x, y); c.rotate(r); c.scale(sc, sc); c.globalAlpha *= cl(k * 5) * .94;
    const w = tw(c, s, { s: fs, ls: 6 }) + fs * 1.1, h = fs * 1.9; c.strokeStyle = col; rr(c, -w / 2, -h / 2, w, h, 14); c.lineWidth = 7; c.stroke();
    rr(c, -w / 2 + 11, -h / 2 + 11, w - 22, h - 22, 8); c.lineWidth = 2.5; c.stroke(); tx(c, s, 0, 3, { s: fs, ls: 6, c: col }); c.restore();
  }
  function memo4(c, t, P, o = {}) {
    c.save(); c.translate(P.x, P.y); c.rotate(P.r); c.scale(P.s, P.s); c.translate(-320, -400);
    c.fillStyle = 'rgba(20,25,53,.3)'; c.fillRect(18, 22, 640, 800); c.fillStyle = '#FBF6EA'; c.fillRect(0, 0, 640, 800);
    tx(c, OBJ.rj, 56, 72, { f: 'J', w: 700, s: 22, ls: 2, c: '#1f2858', al: 'left' }); c.fillStyle = '#1f2858'; c.fillRect(56, 96, 528, 4);
    tx(c, TEXT.memo, 56, 150, { s: 50, c: '#141935', al: 'left' });
    if (o.date > 0) { const m = eio(o.date), w = tw(c, TEXT.memoDate, { f: 'J', w: 500, s: 24, ls: 1 }) + 20; poly(c, [46, 184, 46 + w * m, 182, 46 + w * m - 4, 218, 44, 216]); fill(c, '#FFE27A') }
    tx(c, TEXT.memoDate, 56, 200, { f: 'J', w: 500, s: 24, ls: 1, c: '#2e3c7e', al: 'left' });
    [520, 470, 505, 330, 480].forEach((L, i) => { rr(c, 56, 250 + i * 32, L, 13, 6.5); fill(c, '#d8cdb8') });
    if (!MQF) MQF = Math.min(48, 48 * 528 / Math.max(...TEXT.quote.map(q => tw(c, q.join(' '), { f: 'J', w: 700, s: 48 }))));
    const fs = MQF;
    TEXT.quote.forEach((L, i) => { const y = 470 + i * fs * 1.25, s0 = L.join(' ');
      if (i === 2 && o.mk > 0) { const m = eio(o.mk), w = (tw(c, s0, { f: 'J', w: 700, s: fs }) + 28) * m; poly(c, [44, y - fs * .52, 44 + w, y - fs * .56, 44 + w - 6, y + fs * .52, 40, y + fs * .5]); fill(c, '#FFE27A') }
      tx(c, s0, 56, y, { f: 'J', w: 700, s: fs, c: '#141935', al: 'left' }) });
    c.save(); c.strokeStyle = '#1f2858'; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
    for (let i = 0; i <= 70; i++) { const u = i / 70, px = 60 + u * 220, py = 700 + Math.sin(u * 17) * 15 * (1 - u * .5) - u * 10 + Math.sin(u * 5) * 6; i ? c.lineTo(px, py) : c.moveTo(px, py) } c.stroke(); c.restore();
    tx(c, TEXT.sign, 60, 748, { f: 'J', w: 500, s: 17, ls: 1, c: '#2e3c7e', al: 'left' });
    stamp4(c, TEXT.secret, 450, 318, 1, '#e8475a');
    if (o.glow > 0) glow(c, 160, 200, 260, '#FFE27A', .25 * o.glow);
    c.restore();
  }
  function memoPose(t) {   // под журналом → вытянута нитью вправо → уезжает со стола
    const a = TH, k1 = eio(at(t, a.pomn + .42, a.reyn + .5)), k2 = ei(at(t, a.svoi - .1, a.svoi + .55)), L = (p, q, k) => ({ x: lp(p.x, q.x, k), y: lp(p.y, q.y, k), s: p.s, r: lp(p.r, q.r, k) });
    return k2 > 0 ? L(MEMO1, MEMO2, k2) : L(MEMO0, MEMO1, k1);
  }
  const memoPin = P => [P.x + (Math.cos(P.r) * 320 + Math.sin(P.r) * 120) * P.s, P.y + (Math.sin(P.r) * 320 - Math.cos(P.r) * 120) * P.s];   // правый край записки — к нему привязана нить
  // ---------- Premier: пачка, сигарета с угольком, доллары, пепел, счётчик ----------
  function premier4(c, x, y, s = 1) {   // v21.2: пачка Premier в объёме — лицо, крыша, бок, растровая тень 35°
    const w = 110 * s, h = 165 * s, d = w * .4, dx = d * .93, dy = -d * .37; c.save(); c.translate(x - w / 2, y - h / 2);
    castDots(c, 4, h - 6, w + dx, 10, h * .55, { k: .9, col: 'rgba(0,0,0,.4)' });
    PL(c, [w, 0, w + dx, dy, w + dx, h + dy, w, h], '#C3C9D4'); PL(c, [w, h * .3, w + dx, h * .3 + dy, w + dx, h * .51 + dy, w, h * .51], '#162C5E');
    PL(c, [0, 0, dx, dy, w + dx, dy, w, 0], '#FFFFFF'); SL(c, [2, 0, w - 2, 0], 'rgba(0,0,0,.18)', 1.5); c.fillStyle = '#F7F7F4'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#1E3A7A'; c.fillRect(0, h * .3, w, h * .21); c.fillStyle = '#C9A24A'; c.fillRect(0, h * .51, w, h * .025);
    tx(c, OBJ.premier, w / 2, h * .405, { f: 'P', w: 700, st: 'italic', s: w * .25, c: '#FFFFFF' }); tx(c, OBJ.rjs, w / 2, h * .74, { f: 'M', w: 800, s: w * .085, c: '#1E3A7A', mw: w * .84 });
    c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(1, 2, 2, h - 4); c.restore();
  }
  function ash4(c, x, y, k) {   // горстка пепла
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k); c.beginPath(); c.ellipse(6, 10, 86, 22, 0, 0, TAU); fill(c, 'rgba(6,8,20,.3)');
    c.beginPath(); c.moveTo(-80, 6); c.quadraticCurveTo(-40, -34, 0, -38); c.quadraticCurveTo(46, -32, 82, 6); c.closePath(); fill(c, '#8E8A88');
    c.beginPath(); c.moveTo(-50, 0); c.quadraticCurveTo(-10, -30, 30, -22); c.quadraticCurveTo(10, -6, -50, 0); fill(c, '#B6B1AE');
    c.fillStyle = '#4A4442'; for (let i = 0; i < 14; i++) c.fillRect(-60 + H1(i * 3.1) * 120, -26 + H1(i * 7.7) * 28, 5, 3); c.restore();
  }
  function premierScene(c, t) {
    const a = TH, kl = at(t, a.svoi - .05, a.svoi + .4); if (kl <= 0) return;
    const fall = eo(kl), sc = lp(1.35, 1, fall), dy = -260 * (1 - fall);
    c.save(); c.translate(PREMH.x, PREMH.y + dy); c.scale(sc, sc); c.translate(-PREMH.x, -PREMH.y); c.globalAlpha *= Math.min(1, kl * 3); premier4(c, PREMH.x, PREMH.y, 1); c.restore();
    const kc = at(t, a.svoi + .12, a.svoi + .5), cf = eo(kc), cdy = -300 * (1 - cf); if (kc <= 0) return;
    // уголёк: тёмный → тлеет → гаснет на «прижились» → вспыхивает на «угольком» → горит, пока прожигает доллары
    const em = (.45 + .1 * Math.sin(t * 6)) * (1 - at(t, a.prizh - .1, a.prizh + .45)) + at(t, a.ugol - .1, a.ugol + .15) * (.9 + .1 * Math.sin(t * 11)) * (1 - at(t, a.doll + .2, a.doll + .7));
    const [x0, y0, X1, Y1] = CIGH, bu = .3 * eio(at(t, a.ugol, a.doll + .4)), x1 = lp(X1, x0, bu), y1 = lp(Y1, y0, bu); c.save(); c.translate(0, cdy); c.globalAlpha *= Math.min(1, kc * 3);   // v21.1: сигарета сгорает — короче
    c.beginPath(); c.ellipse((x0 + x1) / 2 + 10, (y0 + y1) / 2 + 16, 150, 12, Math.atan2(y1 - y0, x1 - x0), 0, TAU); fill(c, 'rgba(6,8,20,.3)');
    cig3(c, x0, y0, x1, y1, 13, { tip: '#D9B48A', tl: .24, em, ek: 1.15 }); if (em > .3) glow(c, x1 - 8, y1, 90, '#FF7A30', .5 * (em - .3)); c.restore();
    const kb = at(t, a.ugol - .05, a.ugol + .35), burn = eio(at(t, a.sela - .05, a.doll + .05));
    if (kb > 0 && burn < 1) { c.save(); c.translate(BILLH.x, BILLH.y); c.scale(bo(kb), bo(kb)); c.translate(-BILLH.x, -BILLH.y);
      c.beginPath(); c.ellipse(BILLH.x + 8, BILLH.y + 26, 90, 16, 0, 0, TAU); fill(c, 'rgba(6,8,20,.3)'); bills4(c, BILLH.x, BILLH.y, BILLH.w, BILLH.n, burn); c.restore();
      if (burn > 0) for (let i = 0; i < 3; i++) smokeLine(c, [BILLH.x - 40 + i * 40, BILLH.y - 60 + burn * 50, BILLH.x - 30 + i * 40 + Math.sin(t * 2 + i) * 14, BILLH.y - 150, BILLH.x - 50 + i * 40, BILLH.y - 250], 7, '#B9B6C4', .5 * Math.sin(Math.PI * burn)) }
    ash4(c, BILLH.x + BILLH.w * .42, BILLH.y + 20, eo(at(t, a.sela + .1, a.doll + .1)) * (1 - eio(at(t, a.pat - .05, a.pat + .5))));   // v21.2: пепел на столе — у обгоревшего края, не «аквариум» поверх купюр
  }
  // ---------- синий чертёж PATENT · R.J. Reynolds (без года) ----------
  const PBL = [-46, 8];   // лезвие нагревателя на чертеже (координаты листа)
  function patent4(c, t, x, y, r, s, o = {}) {
    const w = PATW, h = PATHH; c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const lift = o.lift || 0; rasterPoly(c, [-w / 2 + 14 + lift * 40, h / 2 + lift * 50, w / 2 + lift * 40, h / 2 + lift * 50, w / 2 + 56 + lift * 40, h / 2 + 36 + lift * 50, -w / 2 + 70 + lift * 40, h / 2 + 36 + lift * 50], `rgba(6,8,24,${.32 - lift * .12})`, 9, 2.2);
    c.fillStyle = C4.bp; c.fillRect(-w / 2, -h / 2, w, h); c.fillStyle = 'rgba(255,255,255,.07)'; for (let i = -w / 2 + 20; i < w / 2; i += 20) c.fillRect(i, -h / 2, 1.5, h); for (let i = -h / 2 + 20; i < h / 2; i += 20) c.fillRect(-w / 2, i, w, 1.5);
    c.strokeStyle = 'rgba(234,241,255,.75)'; c.lineWidth = 2; c.strokeRect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20);
    tx(c, OBJ.patent, 0, -h / 2 + 46, { f: 'M', w: 800, s: 38, c: '#FFFFFF', ls: 10, mw: w - 40 }); tx(c, OBJ.rjs, 0, -h / 2 + 84, { f: 'P', w: 700, st: 'italic', s: 24, c: '#DCE6FF' });
    c.strokeStyle = '#EAF1FF'; c.lineWidth = 2.5; rr(c, -110, -16, 220, 52, 26); c.stroke(); rr(c, -98, -6, 196, 32, 16); c.lineWidth = 1.5; c.stroke();
    c.setLineDash([6, 5]); c.beginPath(); c.moveTo(-130, 10); c.lineTo(130, 10); c.stroke(); c.setLineDash([]);
    rr(c, PBL[0] - 36, PBL[1] - 9, 72, 18, 4); c.fillStyle = o.hl > 0 ? mixc('#2E58B8', C4.red, o.hl) : 'rgba(234,241,255,.2)'; c.fill(); c.lineWidth = 2; c.stroke();
    if (o.hl > 0) glow(c, PBL[0], PBL[1], 70, '#FF6A4A', .5 * o.hl);
    c.beginPath(); c.moveTo(-110, 66); c.lineTo(110, 66); c.moveTo(-110, 58); c.lineTo(-110, 74); c.moveTo(110, 58); c.lineTo(110, 74); c.stroke();
    tx(c, OBJ.fig, 0, 96, { f: 'M', w: 800, s: 16, c: '#DCE6FF', ls: 4 }); textLines(c, -w / 2 + 30, 120, w - 60, 56, 4, 'rgba(234,241,255,.3)', 91);
    c.restore();
  }
  function patentPose(t) {   // лист выезжает из пепла, поднимается и ложится на карту
    const a = TH, k0 = eo(at(t, a.pat - .05, a.pat + .5)), k1 = eio(at(t, a.pat + .45, a.land));
    if (k1 <= 0) return { x: PAT0.x, y: PAT0.y - 40 * k0, r: -.3 + .2 * k0, s: lp(.12, .62, k0), lift: k0 * .5 };
    const lift = Math.sin(Math.PI * k1) * .8 + (1 - k1) * .5 * (1 - k1);
    return { x: lp(PAT0.x, PAT1.x, k1), y: lp(PAT0.y - 40, PAT1.y, k1) - Math.sin(Math.PI * k1) * 140, r: lp(-.1, PAT1.r, k1), s: lp(.62, 1, k1) * (1 + .18 * Math.sin(Math.PI * k1)), lift };
  }
  const patentBlade = t => { const P = patentPose(t); return [P.x + (Math.cos(P.r) * PBL[0] - Math.sin(P.r) * PBL[1]) * P.s, P.y + (Math.sin(P.r) * PBL[0] + Math.cos(P.r) * PBL[1]) * P.s] };
  // ---------- мир целиком ----------
  function deskWorld(c, t, q) {
    const a = TH; deskRoom(c, t);
    if (t < a.svoi + .6) { const P = memoPose(t); memo4(c, t, P, { date: at(t, a.sem - .1, a.sem + .4), mk: at(t, a.podr - .1, a.podr + .45), glow: at(t, a.sem - .1, a.sem + .3) * (1 - at(t, a.isk, a.podr)) }) }
    iqos4(c, IQH.x, IQH.y, IQH.L, { stick: 1, name: true, brand: true });
    journal4(c, t, JRH.x, JRH.y, 1, 1 - at(t, a.j + .3, a.reg));
    const kf = at(t, a.form - .05, a.form + .4), thin = eio(at(t, a.pomn - .1, a.pomn + .3));
    const fo = eio(at(t, a.reyn + .2, a.reyn + .95));   // v21.2: бланк FDA уезжает за край кадра — не лежит рядом с запиской и Premier
    if (kf > 0 && fo < 1) { const f = eo(kf); c.save(); c.globalAlpha *= Math.min(1, kf * 3); formH(c, t, FORM.x + 40 * (1 - f) - 1100 * fo, FORM.y - 220 * (1 - f) + 160 * fo, FORM.r - .25 * (1 - f) - .35 * fo, lp(1.3, 1, f), thin); c.restore() }
    const kt = at(t, a.pomn - .05, a.pomn + .45), ko = 1 - at(t, a.svoi - .2, a.svoi + .3);   // красная нить от планки к записке, тянет её вправо
    if (kt > 0 && ko > 0) { const P = memoPose(t), [mx, my] = memoPin(P), e = eio(kt), r = eio(at(t, a.reyn + .35, a.reyn + .85)), rl = eio(at(t, a.reyn - .05, a.reyn + .4)), lx = lp(lp(FORM.x - 180, mx, e), mx, rl), ly = lp(lp(FORM.y + ROW2, my, e), my, rl), rx = lp(lp(FORM.x + 190, 1500, e), mx, r), ry = lp(lp(FORM.y + ROW2, my - 160, e), my, r);   // v21.1: хвост нити втягивается в записку; v21.2: левый конец тоже уходит в записку — обрубка нет
      c.save(); c.globalAlpha *= ko; c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 5; c.beginPath(); c.moveTo(lx + 3, ly + 6); c.lineTo(rx + 3, ry + 6); c.stroke(); c.strokeStyle = '#dc2626'; c.lineWidth = 5; c.beginPath(); c.moveTo(lx, ly); c.lineTo(rx, ry); c.stroke();
      if (e > .6 && rl < .9) circ(c, lx, ly, 7, '#dc2626'); c.restore() }
    premierScene(c, t);
    lampH(c);
  }
  function deskPlates(c, t) {   // v21.2: счётчик −$… МЛН — по экрану, как счётчики строки 14: цифры по времени кадра, без размытия
    const a = TH, kd = at(t, a.sela - .1, a.sela + .2) * (1 - at(t, a.pat - .3, a.pat)), v = Math.round(300 * eio(at(FT, a.sela, a.doll - .05)));
    if (kd > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); drum4(c, TEXT.fPrem(v), 540, 1430, kd, { s: 64, w: 400, bg: '#141733' }); c.restore() }
  }
  function deskShot(c, t) {
    const q = camObj(camAt(KH, t));
    layerRel(c, q, RH, .38, cc => fdaFar(cc, t));
    layer(c, q, 1, cc => { deskWorld(cc, t, q); usMapWorld(cc, t, true) });
    layerRel(c, q, RH, 1.12, cc => A(cc, 1 - at(Math.log(q.z), .5, .9), () => lampBeam(cc, t)));
    deskPlates(c, t);
    return q;
  }
  // ================= карта США (строка 13 — на столе FDA; строки 14–17 — та же карта на столе кофейни) =================
  // Карта рисуется в координатах кабинета (мир H); в кофейне — она же через inNest(N_HA): на стыке H → A камера внутри листа карты, миры совпадают.
  // Строка 13: лист PATENT ложится на карту, по суше рядами стоят белые IQOS; молоток (комиссия); «нарушает» — лезвие на чертеже и в разрезе
  // держателя загораются, их соединяет красная линия; «выгнала» — красный шлагбаум от побережья Мэна одним махом сметает держатели в Атлантику (#005),
  // штамп «ЗАПРЕТ». Строка 14: держатели уплывают за край карты, отъезд — карта лежит на столе той же лондонской кофейни.
  // Фильм, строки 16–17: по океану к берегу катится белая баночка, шлагбаум поднимается, ценник $16 МЛРД, крышка открывается — подушечки, листа табака нет.
  // Шортс: на краю карты, у океана, — белый круг со знаком «?».
  const MAPH = { x: 1560, y: 1560, w: 900, h: 1024 }, MSC = 25.6, MLON = -84, MLAT = 37, MCOS = .8;
  const mpj = (lon, lat) => [MAPH.x + (lon - MLON) * MCOS * MSC, MAPH.y - (lat - MLAT) * MSC];
  const N_HA = { m: MAPA.w / MAPH.w, x: MAPA.x - (MAPH.x - 540) * MAPA.w / MAPH.w, y: MAPA.y - (MAPH.y - 960) * MAPA.w / MAPH.w };   // H → кофейня
  const LL = {   // долгота, широта — упрощённые очертания
    us: [-124.7, 48.4, -123.1, 49.0, -95.2, 49.0, -89.6, 48.0, -84.8, 46.5, -83.5, 46.1, -82.5, 43.0, -83.1, 42.2, -82.8, 41.7, -79.0, 42.8, -79.2, 43.3, -76.3, 43.6, -75.0, 44.8,
      -71.5, 45.0, -70.8, 45.4, -70.0, 46.7, -69.2, 47.45, -68.0, 47.2, -67.8, 45.9, -67.0, 44.8, -68.8, 44.2, -70.2, 43.6, -70.7, 42.7, -70.0, 41.8, -71.4, 41.4, -72.9, 41.2,
      -74.0, 40.6, -74.1, 39.7, -75.0, 38.8, -75.9, 37.2, -76.0, 36.9, -75.5, 35.3, -76.9, 34.6, -78.0, 33.9, -79.3, 33.1, -80.8, 32.0, -81.4, 30.4, -80.6, 28.5, -80.0, 26.5,
      -80.4, 25.2, -81.1, 25.1, -81.8, 26.5, -82.7, 28.0, -83.6, 29.9, -84.9, 29.7, -86.5, 30.4, -88.1, 30.4, -89.4, 30.2, -89.2, 29.2, -90.1, 29.1, -91.5, 29.5, -93.8, 29.7,
      -94.8, 29.3, -96.5, 28.3, -97.2, 27.5, -97.4, 26.0, -99.1, 26.5, -99.5, 27.5, -100.9, 29.4, -102.4, 29.8, -103.3, 29.0, -104.5, 29.7, -106.5, 31.8, -108.2, 31.8, -108.2, 31.3,
      -111.1, 31.3, -114.8, 32.5, -117.1, 32.5, -117.3, 33.2, -118.4, 33.8, -119.6, 34.4, -120.6, 34.6, -121.9, 36.5, -122.5, 37.8, -123.8, 39.6, -124.4, 40.4, -124.2, 41.9,
      -124.6, 42.8, -124.0, 46.2],
    can: [-112, 62, -54, 62, -55.7, 53.8, -56.0, 52.5, -57.1, 51.4, -60.0, 50.2, -63.0, 50.2, -66.4, 50.2, -68.6, 49.1, -70.5, 47.4, -71.2, 46.8, -69.5, 47.9, -67.5, 48.9, -64.4, 48.8,
      -64.8, 47.1, -64.2, 46.2, -62.5, 45.7, -61.6, 46.0, -60.6, 46.9, -60.0, 46.0, -61.0, 45.2, -63.6, 44.6, -66.0, 43.8, -65.8, 44.6, -64.5, 45.2, -64.8, 45.6, -66.1, 45.3,
      -67.0, 44.8, -67.8, 45.9, -68.0, 47.2, -69.2, 47.45, -70.0, 46.7, -70.8, 45.4, -71.5, 45.0, -75.0, 44.8, -76.3, 43.6, -79.2, 43.3, -79.0, 42.8, -82.8, 41.7, -83.1, 42.2,
      -82.5, 43.0, -83.5, 46.1, -84.8, 46.5, -89.6, 48.0, -95.2, 49.0, -112, 49.0],
    mex: [-117.1, 32.5, -114.8, 32.5, -111.1, 31.3, -108.2, 31.3, -108.2, 31.8, -106.5, 31.8, -104.5, 29.7, -103.3, 29.0, -102.4, 29.8, -100.9, 29.4, -99.5, 27.5, -99.1, 26.5, -97.4, 26.0,
      -97.6, 24.0, -97.4, 22.0, -96.0, 19.5, -94.5, 18.2, -92.0, 18.6, -90.5, 19.5, -90.4, 21.0, -88.0, 21.5, -86.8, 21.4, -87.5, 19.0, -88.3, 18.4, -88.5, 14.0, -112, 14.0, -112, 31.3],
    cuba: [-84.9, 21.9, -82.0, 23.1, -80.0, 23.0, -77.5, 21.7, -75.6, 21.0, -74.2, 20.2, -75.0, 19.9, -77.7, 19.9, -79.0, 21.6, -81.5, 22.0, -83.5, 21.8],
    hisp: [-74.4, 18.4, -72.8, 19.9, -70.0, 19.7, -68.4, 18.6, -70.0, 18.2, -71.5, 17.6], pr: [-67.2, 18.5, -65.6, 18.4, -65.7, 18.0, -67.2, 18.0],
    hud: [-95, 58.5, -92.5, 57, -88.5, 56.4, -85, 55.3, -82.3, 55.1, -82, 53, -80.5, 51.4, -79, 51.6, -78.9, 54.3, -77.7, 55.3, -77, 58.5],
  };
  const LAKE_US = [[-92.1, 46.7, -89.6, 48.0, -86.5, 48.7, -84.8, 46.9, -85.0, 46.5, -87.4, 46.5, -90.4, 46.6], [-87.8, 41.6, -86.6, 41.9, -86.2, 43.5, -85.5, 45.0, -85.0, 45.8, -86.9, 45.7, -87.6, 44.7, -87.9, 43.0],
    [-84.6, 45.8, -83.5, 46.0, -81.7, 45.3, -80.4, 45.0, -81.6, 43.2, -82.5, 43.0, -83.4, 43.9, -83.6, 44.8], [-83.4, 41.7, -82.5, 41.4, -81.0, 41.9, -79.0, 42.8, -80.2, 42.6, -81.7, 42.6, -83.1, 42.1],
    [-79.8, 43.3, -78.0, 43.4, -76.2, 43.5, -76.3, 44.1, -77.6, 44.0, -79.4, 43.7]];
  const BP = mpj(-68.2, 44.4), BFL = mpj(-79.6, 25.4), BPHI1 = Math.atan2(BFL[1] - BP[1], BFL[0] - BP[0]), BPHI0 = Math.PI, BLEN = 560, BOPEN = 2.78;   // шлагбаум: столб у Мэна
  const QM = mpj(-66.4, 38.6), CANF = mpj(-76.5, 38.2), CANR = 34, GV = [1730, 1290];   // v21.2: молоток бьёт по северо-востоку карты — не закрывает центральный IQOS
  let PJ = null, HOLD = null, WAVES = null, TM = null, TB4 = null, HCUT = null;
  function pip(P, x, y) { let ins = false; for (let i = 0, j = P.length - 2; i < P.length; j = i, i += 2) { const xi = P[i], yi = P[i + 1], xj = P[j], yj = P[j + 1]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins } return ins }
  function boomPhi(t) { const a = TM; let p = lp(BPHI0, BPHI1, eio(at(t, a.vygn + .02, a.vygn + .62))); if (a.zapr) p = lp(p, BOPEN, eio(at(t, a.zapr - .05, a.zapr + .55))); return p }
  function mapInit() {
    const w13 = q => Ws('s13', q), w14 = q => Ws('s14', q), w15 = q => Ws('s15', q), hasQ = SA('q') !== null, hasF = SA('s16') !== null;
    TM = { perv: w13('первом'), kom: w13('комиссия'), narush: w13('нарушает'), vygn: w13('выгнала'), amer: w13('америки'), obesch: w14('обещание'), chet: w14('четвёртом'),
      tri: w14('тридцать'), sig: w14('сигарет'), shest: w14('шестьсот'), bol: w14('больше'), brosaj: w15('бросают'), rovno: w15('ровно'), vy: w15('вы'),
      ugad: hasQ ? Ws('q', 'угадаете') : null, amerQ: hasQ ? Ws('q', 'америку') : null,
      amerF: hasF ? Ws('s16', 'америку') : null, vern: hasF ? Ws('s16', 'вернулся') : null, zapr: hasF ? Ws('s16', 'запрета') : null, shestn: hasF ? Ws('s16', 'шестнадцать') : null,
      net: hasF ? Ws('s17', 'нет') : null, dazhe: hasF ? Ws('s17', 'даже') : null, tab: hasF ? Ws('s17', 'табака') : null };
    TB4 = TM; const a = TM; a.jAJ = MODE === 'y' ? TLX.vEnd + .25 : null;   // v21.1: фильм — после «как и вы» сразу доска
    if (PJ) return;
    const P = L => { const o = []; for (let i = 0; i < L.length; i += 2) o.push(...mpj(L[i], L[i + 1])); return o };
    PJ = { us: P(LL.us), can: P(LL.can), mex: P(LL.mex), isl: [P(LL.cuba), P(LL.hisp), P(LL.pr)], hud: P(LL.hud), lakes: LAKE_US.map(P) };
    const land = (x, y) => (pip(PJ.us, x, y) || pip(PJ.can, x, y) || pip(PJ.mex, x, y) || PJ.isl.some(p => pip(p, x, y))) && !pip(PJ.hud, x, y);
    const H = []; let row = 0;
    for (let y = 1420; y <= 1830; y += 56, row++) for (let x = 1300; x <= 1880; x += 62) { const xx = x + (row % 2) * 31, dx = xx - BP[0], dy = y - BP[1], r = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      if (xx < 1470 || r < 110 || r > BLEN - 50 || th < BPHI1 + .07 || th > BPHI0 - 20 / r - .05) continue;
      if (![[0, 0], [-16, 4], [16, 4], [0, -40]].every(([u, v]) => pip(PJ.us, xx + u, y + v))) continue; if (PJ.lakes.some(p => pip(p, xx, y))) continue;
      H.push({ x: xx, y, r, th, i: H.length, ph: H1(H.length * 3.7) * 6 }) }
    HOLD = H; const [pbx, pby] = [PAT1.x - 46, PAT1.y + 14]; HCUT = H.reduce((b, h) => !b || Math.hypot(h.x - pbx, h.y - pby) < Math.hypot(b.x - pbx, b.y - pby) ? h : b, null);
    WAVES = []; for (let y = MAPH.y - MAPH.h / 2 + 30; y < MAPH.y + MAPH.h / 2; y += 46) for (let x = MAPH.x - MAPH.w / 2 + 24; x < MAPH.x + MAPH.w / 2; x += 58) { const xx = x + H1(x * .7 + y) * 26, yy = y + H1(y * .3 + x) * 16;
      if (!land(xx, yy) && !land(xx - 22, yy) && !land(xx + 22, yy) && !land(xx, yy - 14) && !land(xx, yy + 14)) WAVES.push([xx, yy, H1(xx + yy * 3)]) }
  }
  // момент, когда шлагбаум доходит до держателя (для падения)
  function hPushT(h) { const a = TM, d = 20 / h.r; for (let t = a.vygn; t < a.vygn + .7; t += .01) if (boomPhi(t) - d <= h.th) return t; return a.vygn + .62 }
  function holderPin(c, x, y, s, o = {}) {   // держатель стоит: белая капсула, тень вправо-вниз
    const L = 64 * s, w = 15 * s;
    if (o.sh !== false) { c.beginPath(); c.ellipse(x + 10 * s, y + 2 * s, 17 * s, 5 * s, .25, 0, TAU); fill(c, 'rgba(20,30,60,.3)') }
    rr(c, x - w / 2, y - L, w, L, w / 2); c.fillStyle = C4.iq; c.fill(); c.save(); rr(c, x - w / 2, y - L, w, L, w / 2); c.clip();
    c.fillStyle = C4.iqS; c.fillRect(x + w * .15, y - L, w, L); c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(x - w * .36, y - L + 5 * s, w * .16, L - 10 * s); c.fillStyle = C4.iqCap; c.fillRect(x - w / 2, y - L + L * .22, w, 2.5 * s); c.restore();
    rr(c, x - w / 2, y - L, w, L, w / 2); lnB(c, 1.5, 'rgba(20,23,51,.35)');
    if (o.hl > 0) { rr(c, x - 3 * s, y - L + 8 * s, 6 * s, 22 * s, 2); c.fillStyle = rgba('#E2412F', o.hl); c.fill(); glow(c, x, y - L + 19 * s, 36 * s, '#FF6A4A', .6 * o.hl) }   // v21.1: лезвие светится сквозь корпус
  }
  function holderState(h, t) {   // [x, y, наклон 0..1, в воде 0..1]
    const a = TM, phi = boomPhi(t), d = 20 / h.r; let th = t > a.vygn ? Math.min(h.th, phi - d) : h.th, x, y;
    x = BP[0] + Math.cos(th) * h.r; y = BP[1] + Math.sin(th) * h.r;
    if (h.tp === undefined) h.tp = hPushT(h);
    const fall = eio(at(t, h.tp, h.tp + .3)), wet = at(t, a.vygn + .6, a.vygn + 1.1), nx = Math.cos(BPHI1 - Math.PI / 2), ny = Math.sin(BPHI1 - Math.PI / 2);
    const out = 50 + h.r * .08, push = eo(at(t, h.tp, a.vygn + 1.2)) * out * (fall > 0 ? 1 : 0);
    x += nx * push; y += ny * push;
    const drift = ei(at(t, a.obesch - .25 + H1(h.i * 5) * .3, a.obesch + 1.3 + H1(h.i * 5) * .3)) * 760; x += drift; y += drift * .08;
    if (wet > 0) { y += Math.sin(t * 2.6 + h.ph) * 4 * wet; x += Math.sin(t * 1.7 + h.ph) * 3 * wet }
    return [x, y, fall, wet];
  }
  function gavel4(c, t) {   // молоток комиссии: опускается сверху, удар, кольца, уходит
    const a = TM, k = at(t, a.kom - .5, a.kom + .55); if (k <= 0 || k >= 1) return;
    const hk = .5 / 1.05, dn = k < hk ? ei(k / hk) : 1 - eo((k - hk) / (1 - hk)), s = lp(1.45, 1, dn), lift = lp(-380, 0, dn), rot = lp(-.75, -.2, dn), [gx, gy] = GV, ga = k < hk ? 1 : 1 - at(k, hk + .05, hk + .35);   // v21.1: меньше, после удара гаснет
    c.save(); c.globalAlpha *= .4 * dn * ga; c.beginPath(); c.ellipse(gx + 40, gy + 26, 120 * (2.2 - dn * 1.2), 34 * (2.2 - dn * 1.2), .2, 0, TAU); fill(c, '#0A0F23'); c.restore();
    c.save(); c.globalAlpha *= ga; c.translate(gx, gy + lift); c.rotate(rot); c.scale(s, s);
    rr(c, -13, -340, 26, 290, 12); cel(c, -13, -340, 26, 290, '#8A5A38', { sw: .35 }); rr(c, -13, -340, 26, 290, 12); lnB(c, 2, 'rgba(20,12,8,.4)');
    rr(c, -100, -76, 200, 82, 20); cel(c, -100, -76, 200, 82, '#6B4228', { sw: .3, hx: .1, ha: .25 }); c.fillStyle = '#C9A24A'; c.fillRect(-74, -76, 12, 82); c.fillRect(62, -76, 12, 82);
    rr(c, -100, -76, 200, 82, 20); lnB(c, 2.5, 'rgba(20,12,8,.45)'); c.restore();
    const ki = at(t, a.kom - .02, a.kom + .45); if (ki > 0 && ki < 1) for (let j = 0; j < 2; j++) ring(c, gx, gy - 20, 70 + 260 * eo(ki) * (1 + j * .45), `rgba(255,255,255,${.65 * (1 - ki)})`, 7 - j * 3);
  }
  function boom4(c, t) {   // красно-белый шлагбаум: «опускается» — вырастает из столба у Мэна, одним махом сметает держатели в океан
    const a = TM, k = eo(at(t, a.vygn - .22, a.vygn + .04)); if (k <= 0) return;
    const phi = boomPhi(t), L = BLEN * k, [px, py] = BP;
    c.save(); c.translate(px, py); c.rotate(phi);
    c.save(); c.translate(14, 16); rr(c, 0, -10, L, 20, 10); fill(c, 'rgba(10,20,50,.28)'); c.restore();
    rr(c, 0, -11, L, 22, 11); c.fillStyle = '#F4F1EA'; c.fill(); c.save(); rr(c, 0, -11, L, 22, 11); c.clip();
    for (let x = 34; x < L; x += 72) { c.fillStyle = '#D21F2E'; c.fillRect(x, -11, 36, 22) } c.fillStyle = 'rgba(0,0,0,.14)'; c.fillRect(0, 3, L, 8); c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(0, -8, L, 3); c.restore();
    rr(c, 0, -11, L, 22, 11); lnB(c, 2, 'rgba(20,23,51,.45)'); rr(c, -74, -17, 66, 34, 7); fill(c, '#3A3F4C'); c.restore();
    circ(c, px + 5, py + 7, 28, 'rgba(10,20,50,.3)'); circ(c, px, py, 26, '#5A5F72'); circ(c, px, py, 18, '#6E7488'); circ(c, px - 7, py - 8, 8, 'rgba(255,255,255,.4)');
  }
  // ---------- баночка (фильм): плывёт по волнам, шлагбаум поднимается, ценник, крышка открывается — подушечки ----------
  function canState(t) {   // [x, y, наклон ty, крышка 0..1]
    const a = TM; if (!a.vern || t < a.vern - .4) return null;
    const k1 = eo(at(t, a.vern - .4, a.zapr - .15)), x1 = 1846, y1 = 1588, k2 = eio(at(t, a.zapr + .25, a.zapr + 1.35)), wet = 1 - k2;
    let x = lp(lp(2070, x1, k1), CANF[0], k2), y = lp(lp(1606, y1, k1), CANF[1], k2) + Math.sin(t * 2.4) * 5 * wet;
    const ty = lp(.58 + .1 * Math.sin(t * 2.4) * wet, 1, eio(at(t, a.net - .25, a.net + .1))), lid = eio(at(t, a.net + .02, a.net + .38));
    return [x, y, ty, lid];
  }
  const POUCH = (x, y, R, ty, k) => { const al = Math.PI / 2 + k * TAU / 9; return [x + Math.cos(al) * R * .58, y + Math.sin(al) * R * .58 * ty, al] };
  function can4(c, t, x, y, R, ty, lid) {
    const hS = R * .78 * Math.sqrt(Math.max(0, 1 - ty * ty));   // бок баночки виден, пока она наклонена
    c.beginPath(); c.ellipse(x + R * .25, y + hS + R * ty * .5, R * 1.05, R * ty * .45 + 3, 0, 0, TAU); fill(c, 'rgba(10,25,60,.28)');
    if (hS > .5) { c.beginPath(); c.moveTo(x - R, y); c.lineTo(x - R, y + hS); c.ellipse(x, y + hS, R, R * ty, 0, Math.PI, 0, true); c.lineTo(x + R, y); c.closePath(); fill(c, '#E9EAEE');
      c.fillStyle = 'rgba(30,40,70,.12)'; c.fillRect(x + R * .35, y, R * .65, hS + R * ty * .6) }
    if (lid < 1) { c.beginPath(); c.ellipse(x, y, R, R * ty, 0, 0, TAU); fill(c, '#F4F4F2'); c.beginPath(); c.ellipse(x, y, R * .82, R * ty * .82, 0, 0, TAU); lnB(c, 1.4, 'rgba(120,128,145,.55)') }
    if (lid > 0) {   // внутри: дно и белые подушечки по кругу; крышка откидывается назад, за баночку
      c.beginPath(); c.ellipse(x, y, R * .94, R * ty * .94, 0, 0, TAU); fill(c, '#DADDE4');
      for (let k = 0; k < 9; k++) { const [px, py, al] = POUCH(x, y, R, ty, k); c.save(); c.translate(px, py); c.scale(1, ty); c.rotate(al);
        rr(c, -R * .18, -R * .13, R * .36, R * .26, R * .1); fill(c, C4.paperL); rr(c, -R * .18, -R * .13, R * .36, R * .26, R * .1); lnB(c, .7, 'rgba(150,156,170,.6)'); c.restore() }
      if (lid < 1) { const ly = y - R * ty * lp(0, 1.1, lid), lry = R * ty * lp(1, .28, lid); c.beginPath(); c.ellipse(x, ly, R, Math.max(.5, lry), 0, 0, TAU); fill(c, '#F7F7F5'); lnB(c, 1.2, 'rgba(120,128,145,.5)') }
      else { c.beginPath(); c.ellipse(x, y - R * ty * 1.1, R, R * ty * .28, 0, Math.PI, TAU); fill(c, '#ECEDEF') }
    }
  }
  function leaf4(c, t, x, y) {   // контур табачного листа над баночкой — перечёркивается и тает
    const a = TM, k = at(t, a.dazhe - .05, a.dazhe + .3), out = at(t, a.tab + .2, a.tab + .55); if (k <= 0 || out >= 1) return;
    c.save(); c.translate(x, y); c.globalAlpha *= Math.min(1, k * 2) * (1 - out); c.scale(lp(.7, 1, eo(k)), lp(.7, 1, eo(k)));
    c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-26, 10, -22, -22, 0, -36); c.bezierCurveTo(22, -22, 26, 10, 0, 30); lnB(c, 2.4, '#7A5A26'); c.beginPath(); c.moveTo(0, 30); c.lineTo(0, -30); lnB(c, 1.4, '#7A5A26');
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(0, 12 - i * 13); c.lineTo(s * 13, 2 - i * 13); lnB(c, 1, '#7A5A26') }
    const kx = eo(at(t, a.tab - .05, a.tab + .2)); if (kx > 0) { c.beginPath(); c.moveTo(-30, 34); c.lineTo(lp(-30, 30, kx), lp(34, -38, kx)); lnB(c, 4, '#E2412F') }
    c.restore();
  }
  // ---------- карта целиком ----------
  function mapPrint(c, t) {
    const { x, y, w, h } = MAPH, x0 = x - w / 2, y0 = y - h / 2;
    rasterPoly(c, [x0 + w, y0 + 30, x0 + w + 44, y0 + 66, x0 + w + 44, y0 + h + 34, x0 + 44, y0 + h + 34, x0, y0 + h], 'rgba(6,8,24,.35)', 9, 2.4);
    c.save(); c.beginPath(); c.rect(x0, y0, w, h); c.clip();
    c.fillStyle = '#9CC4DA'; c.fillRect(x0, y0, w, h);
    c.strokeStyle = 'rgba(52,96,140,.35)'; c.lineWidth = 2; for (const [wx, wy, ph] of WAVES) { const dx = Math.sin(t * 1.3 + ph * 6) * 4; c.beginPath(); c.moveTo(wx - 12 + dx, wy); c.quadraticCurveTo(wx - 6 + dx, wy - 5, wx + dx, wy); c.quadraticCurveTo(wx + 6 + dx, wy + 5, wx + 12 + dx, wy); c.stroke() }
    for (const p of [PJ.can, PJ.mex, ...PJ.isl]) { poly(c, p); fill(c, '#E2DCC9') }
    poly(c, PJ.hud); fill(c, '#9CC4DA');
    poly(c, PJ.us); fill(c, '#F2E5C1'); c.save(); poly(c, PJ.us); c.clip(); c.strokeStyle = 'rgba(140,110,60,.18)'; c.lineWidth = 1.6; c.setLineDash([6, 6]);
    for (const lon of [-100, -95, -90, -85, -80, -75, -70]) { const [lx] = mpj(lon, 37); c.beginPath(); c.moveTo(lx, y0); c.lineTo(lx, y0 + h); c.stroke() } c.setLineDash([]); c.restore();
    for (const p of PJ.lakes) { poly(c, p); fill(c, '#9CC4DA'); poly(c, p); lnB(c, 1.6, '#4E7FA6') }
    c.strokeStyle = 'rgba(70,110,150,.16)'; c.lineWidth = 1.5; for (let lat = 20; lat <= 55; lat += 5) { const [, ly] = mpj(-84, lat); c.beginPath(); c.moveTo(x0, ly); c.lineTo(x0 + w, ly); c.stroke() }
    for (const p of [PJ.us, PJ.can, PJ.mex, ...PJ.isl]) { poly(c, p); lnB(c, 2.4, '#4E7FA6') }
    c.setLineDash([8, 6]); c.beginPath(); for (const L of [[-95.2, 49.0, -89.6, 48.0], [-71.5, 45.0, -70.0, 46.7, -69.2, 47.45, -67.8, 45.9, -67.0, 44.8], [-117.1, 32.5, -111.1, 31.3, -106.5, 31.8, -104.5, 29.7, -102.4, 29.8, -99.5, 27.5, -97.4, 26.0]]) { for (let i = 0; i < L.length; i += 2) { const [px, py] = mpj(L[i], L[i + 1]); i ? c.lineTo(px, py) : c.moveTo(px, py) } } lnB(c, 1.6, 'rgba(120,90,50,.6)'); c.setLineDash([]);
    const [dx, dy] = mpj(-77.0, 38.9); star(c, dx, dy, 11, '#C8102E');
    { const [ux, uy] = mpj(-83.5, 39.2); tx(c, OBJ.mapUS, ux, uy, { f: 'P', w: 700, s: 30, c: 'rgba(110,84,40,.4)', ls: 10 }) }   // v21.1: подписи — на языке ролика, «США» не под листом патента
    { const [ox, oy] = mpj(-68.5, 32.6); OBJ.mapOcean.forEach((L, i) => tx(c, L, ox, oy + i * 28, { f: 'P', w: 400, st: 'italic', s: 22, c: 'rgba(40,80,120,.5)', ls: 3 })) }
    c.fillStyle = 'rgba(255,255,255,.16)'; c.fillRect(x0 + w / 3 - 2, y0, 4, h); c.fillRect(x0 + w * 2 / 3 - 2, y0, 4, h); c.fillRect(x0, y0 + h / 2 - 2, w, 4);   // сгибы
    c.fillStyle = 'rgba(0,0,0,.06)'; c.fillRect(x0 + w / 3 + 2, y0, 3, h); c.fillRect(x0 + w * 2 / 3 + 2, y0, 3, h); c.fillRect(x0, y0 + h / 2 + 2, w, 3);
    c.restore(); c.strokeStyle = 'rgba(60,50,30,.45)'; c.lineWidth = 2; c.strokeRect(x0, y0, w, h);
  }
  function usMapWorld(c, t, inH) {
    const a = TM; mapPrint(c, t);
    const kz = at(t, a.vygn + .5, a.vygn + .78); if (kz > 0) stamp4(c, TEXT.ban, 1560, 1712, kz, '#C8102E', -.16, 60);
    const P = patentPose(t), hl = at(t, a.narush - .05, a.narush + .3) * (1 - at(t, a.vygn - .3, a.vygn));
    if (t > TH.pat - .1) patent4(c, t, P.x, P.y, P.r, P.s, { lift: P.lift, hl });
    const { x: mx, y: my, w: mw, h: mh } = MAPH;
    c.save(); c.beginPath(); c.rect(mx - mw / 2, my - mh / 2, mw, mh); c.clip();
    const app = i => bo(at(t, a.perv - .35 + (i % 7) * .05, a.perv + .05 + (i % 7) * .05)), hop = Math.sin(Math.PI * at(t, a.kom, a.kom + .3)) * 16;
    const cut = t > a.narush - .15 && t < a.vygn - .12;
    for (const h of HOLD) { const s = app(h.i); if (s <= 0) continue; const [x, y, fall, wet] = holderState(h, t), hc = cut && h === HCUT;
      c.save(); c.translate(x, y - hop * (fall > 0 ? 0 : 1)); c.rotate(fall * (Math.PI / 2 - .3 + H1(h.i) * .6) + Math.sin(t * 2 + h.ph) * .08 * wet); c.scale(s, s);
      if (wet > 0) { c.beginPath(); c.ellipse(0, -30, 44 * wet, 16 * wet, 0, 0, TAU); c.strokeStyle = `rgba(255,255,255,${.35 * wet})`; c.lineWidth = 2; c.stroke() }
      holderPin(c, 0, 0, 1, { hl: hc ? hl : 0, sh: fall < .5 }); c.restore() }
    gavel4(c, t);
    if (hl > 0 && HCUT) { const [bx, by] = patentBlade(t), hx = HCUT.x, hy = HCUT.y - 64 + 19; c.save(); c.globalAlpha *= hl; c.setLineDash([14, 9]); c.lineDashOffset = -t * 40; c.beginPath(); c.moveTo(bx, by); c.lineTo(hx, hy); lnB(c, 5, '#E2412F'); c.setLineDash([]); circ(c, bx, by, 8, '#E2412F'); circ(c, hx, hy, 8, '#E2412F'); c.restore() }
    boom4(c, t);
    if (a.ugad) { const kq = at(t, a.ugad - .1, a.ugad + .35); if (kq > 0) { const [qx, qy] = QM, s = bo(kq) * (1 + .05 * Math.sin(t * 5)); c.save(); c.translate(qx, qy); c.scale(s, s);
      c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.fillStyle = 'rgba(255,255,255,.25)'; c.fill(); c.setLineDash([9, 7]); c.lineDashOffset = -t * 20; lnB(c, 4, '#FFFFFF'); c.setLineDash([]);
      tx(c, '?', 0, 3, { f: 'M', w: 800, s: 48, c: '#FFFFFF' }); c.restore() } }
    const cs = canState(t); if (cs) { const [x, y, ty, lid] = cs; if (a.zapr && t > a.zapr - .2 && t < a.zapr + .5) ring(c, x, y, CANR * 1.3 + 30 * at(t, a.zapr - .2, a.zapr + .5), `rgba(255,255,255,${.4 * (1 - at(t, a.zapr - .2, a.zapr + .5))})`, 2);
      if (ty < .95) for (let j = 0; j < 2; j++) { const u = (t * .6 + j * .5) % 1; c.beginPath(); c.ellipse(x, y + CANR * .4, CANR * (1.1 + u * .8), CANR * ty * (.6 + u * .5), 0, 0, TAU); c.strokeStyle = `rgba(255,255,255,${.5 * (1 - u) * (1 - ty)})`; c.lineWidth = 2; c.stroke() }
      can4(c, t, x, y, CANR, ty, lid);
      const kt = at(t, a.shestn - .1, a.shestn + .25) * (1 - at(t, a.net - .35, a.net - .1)); if (kt > 0) { const sw = Math.sin(t * 3) * .18, tx0 = x + CANR * .7, ty0 = y - CANR * ty * .6;   // ценник на нитке
        c.save(); c.globalAlpha *= Math.min(1, kt * 2); c.translate(tx0, ty0); c.rotate(sw); c.beginPath(); c.moveTo(0, 0); c.lineTo(22, 26); lnB(c, 1.4, '#3A3F4C'); c.translate(22, 26); c.rotate(-.5);
        poly(c, [0, 0, 12, -9, 38, -9, 38, 9, 12, 9]); fill(c, '#F7F1DC'); poly(c, [0, 0, 12, -9, 38, -9, 38, 9, 12, 9]); lnB(c, 1, '#8A7A5A'); circ(c, 9, 0, 2.2, '#3A3F4C'); tx(c, '$', 25, 1, { f: 'M', w: 800, s: 12, c: '#17A86B' }); c.restore() }
      leaf4(c, t, x, y - CANR * 2.3) }
    c.restore();
  }
  // заголовки поверх кадра в мире карты (строка 13)
  function mapPlates(c, t) { const a = TM; capS(c, TEXT.itc, 560, 190, at(t, a.kom + .12, a.kom + .42) * (1 - at(t, a.narush - .35, a.narush - .1)), { s: 38 }) }   // v21.2: выше синего PATENT, правее плашки года
  // ================= кофейня, часть 2 (строки 14–15; шортс — вопрос и петля; фильм — строки 16–17 на карте) =================
  // Отъезд из карты: она лежит на столе той же кофейни. Комок-обещание вкатывается слева; из белых фигурок растёт столбик (32 млн),
  // из пачки Marlboro — красная башня сигарет (617 млрд, +0,6 %). «Бросают…» — комок скатывается в урну к таким же; на столе IQOS и пачка.
  // Шортс: на карте «?», «Часть 5 →», сверху ложится свежая газета — кадр 0 (петля). Фильм: камера наезжает на карту — баночка, ныряем в подушечку.
  let KAE = null, TL0 = 0;
  const IQC = { x: 561, y: 1392, L: 112, r: Math.PI / 2 + .07 };   // IQOS на столе кофейни — у края карты, под газетой кадра 0 (v21.1: меньше — был с пол-Америки)
  const BALLY = 1546;
  const Hc = (x, y) => [N_HA.x + (x - 540) * N_HA.m, N_HA.y + (y - 960) * N_HA.m];   // точка карты (мир H) → кофейня
  const binBall = i => [BIN.x - BIN.w * .32 + (i % 4) * BIN.w * .21 + (i > 3 ? BIN.w * .1 : 0), BIN.y - BIN.h + 8 - (i > 3 ? 46 : 14) - H1(i) * 12, 40 + H1(i * 3) * 8, i * 1.3];
  function cafe2Init() {
    const a = TM; a.jHA = TH.jHA; a.roll0 = a.jHA + .3; a.rest = a.roll0 + 1.6; a.edge = a.brosaj + .8; a.inBin = a.edge + .48;
    TL0 = TLX.endT + 1 / 30;
    KA2 = [KY(a.jHA + .95, 640, 1300, 1.7), KY(a.chet + .3, 470, 1195, 1.18), KY(a.tri + .4, 390, 1150, 1.1), KY(a.sig + .5, 330, 1060, 1.0), KY(a.shest + .6, 350, 1000, .95),
      KY(a.bol + .3, 390, 1060, 1.0), KY(a.brosaj + .3, 830, 1440, 1.15), KY(a.rovno + .25, 1070, 1610, 1.35), KY(a.vy + .35, 470, 1220, 1.0)];   // v21.2: на «как и вы» — общий план стола: башня пачек и толпа ниже плашки года
    if (MODE === 'y') KAE = KA2.slice();   // v21.1: фильм кончается на «как и вы» — дальше кадр кофейни становится фото карточки 2014 на доске (80-board.js)
    else {
      const [qx, qy] = Hc(QM[0], QM[1]);
      KAE = KA2.concat([KY(a.ugad + .4, qx - 30, qy - 4, 2.4), KY(a.amerQ + .05, 700, 1290, 1.9), KY(TL0, 540, 1000, 1.0)]);
      KAE[KAE.length - 1].v = KA1[0].v;   // петля: в кадр 0 — с той же скоростью, что у кадра 0
    }
  }
  function ballA2(t) {   // [x, y, поворот, R] — комок вкатывается, лежит, скатывается в урну
    const a = TM; if (t < a.roll0) return null;
    if (t < a.brosaj) { const k = eo(at(t, a.roll0, a.rest)); return [lp(-140, 440, k), BALLY, lp(-7, 0, k), BALL_R] }
    if (t < a.edge) { const k = eio(at(t, a.brosaj, a.edge)); return [lp(440, TEND + 14, k), BALLY, lp(0, 7.4, k), BALL_R] }
    const k = at(t, a.edge, a.inBin); if (k >= 1) return null; const [bx, by, br, rot] = binBall(7);
    return [lp(TEND + 14, bx, k), lp(BALLY, by, k * k) - Math.sin(Math.PI * k) * 70, lp(7.4, rot, k), lp(BALL_R, br, k)];
  }
  function newsDrop(c, t) {   // шортс: свежая сложенная газета падает на стол — это кадр 0
    const a = TM; if (!a.amerQ) return; const k = at(t, a.amerQ + .1, a.amerQ + .48); if (k <= 0) return;
    const f = ei(k), cx = PG.sx + PG.w / 2, cy = PG.y + PG.h / 2, s = lp(1.45, 1, f), r = lp(-.14, 0, f), dy = lp(-420, 0, f);
    c.save(); c.translate(cx, cy + dy); c.rotate(r); c.scale(s, s); c.translate(-cx, -cy); newspaper(c, t, 0, 0, 0); c.restore();
  }
  function cafe2After(c, t) {
    iqos4(c, IQC.x, IQC.y, IQC.L, { ang: IQC.r, stick: 1, name: true });
    towers(c, t);
    const b = ballA2(t); if (b) paperBall(c, b[0], b[1], b[3], b[2], { shadow: b[1] < EDGEY });
    newsDrop(c, t);
  }
  function cafe2Plates(c, t) {   // поверх кадра: счётчики строки 14, «Часть 5 →», ценник и «БЕЗ ТАБАКА» (фильм)
    const a = TM, S = fn => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); fn(); c.restore() };
    const k1 = at(t, a.tri - .05, a.tri + .25) * (1 - at(t, a.sig - .3, a.sig)); if (k1 > 0) S(() => { const v = Math.round(32 * eio(at(FT, a.tri, a.tri + 1.1))); drum4(c, TEXT.fUsers(v), 540, 330, k1, { s: 72, w: 400, lab: TEXT.usersL }) });
    const k2 = at(t, a.sig - .05, a.sig + .25) * (1 - at(t, a.brosaj - .45, a.brosaj - .15)); if (k2 > 0) S(() => { const v = Math.round(617 * eio(at(FT, a.sig + .15, a.shest + .9))); drum4(c, TEXT.fCigs(v), 540, 330, k2, { s: 72, w: 470, lab: TEXT.cigsL }) });
    const k3 = at(t, a.bol - .1, a.bol + .2) * (1 - at(t, a.brosaj - .45, a.brosaj - .15)); if (k3 > 0) S(() => { const s = bo(k3); c.save(); c.translate(430, 500); c.scale(s, s);
      poly(c, [0, -46, 30, -8, 12, -8, 12, 40, -12, 40, -12, -8, -30, -8]); fill(c, C4.red); c.restore(); plate(c, TEXT.pct, 590, 500, s, { s: 50, bg: '#F4F1EA', c: C4.red, ls: 2 }); plate(c, TEXT.pctL, 590, 578, s, { s: 26, bg: '#141733', c: '#F4F1EA', ls: 3 }) });   // v21.1: «за год»
    if (a.amerQ) { const kp = at(t, a.amerQ - .12, a.amerQ + .15), out = ei(at(t, TL0 - 1.2, TL0 - .75)); if (kp > 0 && out < 1) S(() => plate(c, TEXT.part5, 330, 520 - 680 * out, bo(kp), { s: 58, bg: C4.red, c: '#FFFFFF', ls: 2 })) }   // v21.2: «Часть 5 →» ниже и левее — не закрывает циферблат Биг-Бена
    if (a.shestn) { const kd = at(t, a.shestn - .1, a.shestn + .2) * (1 - at(t, a.net - .3, a.net)); if (kd > 0) S(() => { const v = Math.round(16 * eio(at(t, a.shestn, a.shestn + .9))); drum4(c, v >= 16 ? TEXT.price : '$' + v + ' МЛРД', 540, 330, kd, { s: 72, w: 440 }) });
      capS(c, TEXT.notob, 540, 330, at(t, a.tab + .05, a.tab + .3) * (1 - at(t, a.jAJ - .32, a.jAJ - .08)), { s: 56 }) }
  }
  const cafe2St = t => ({ paper: false, binN: t >= TM.inBin ? 8 : 7, map: cc => inNest(cc, N_HA, c2 => usMapWorld(c2, t, false)), after: cc => cafe2After(cc, t) });
  function cafe2Shot(c, t) {
    cafeShot(c, t, KAE, t - TL0, cafe2St(t)); cafe2Plates(c, t);
  }
  // ================= мир J (только фильм): пробковая доска глав — отъезд один раз за главу =================
  // v21.1: хвоста про баночку больше нет (строки 16–17 переехали в начало главы 5). После «как и вы» кадр кофейни сжимается в фото карточки
  // «2014 · НАГРЕВАТЕЛИ» (на фото — тот же стол: айкос у карты США), камера отъезжает на всю доску: открыты 1979, 2020, 1924 и 2014;
  // красная нить тянется от 2014 к закрытой 2022 — под маркером виден только год. Белых кадров на стыке нет.
  const CARDS4 = [{ id: '1979', x: 340, y: 400, a: '1979', bk: 'card79b', open: true }, { id: '2020', x: 740, y: 400, a: '2020', bk: 'card20b', open: true },
    { id: '2014', x: 230, y: 790, a: '2014', bk: 'card14b', open: true }, { id: '1924', x: 540, y: 850, a: '1924', bk: 'card24b', open: true }, { id: '2022', x: 850, y: 790, a: '2022', bk: 'card22b' }];
  // 1924 — на 45 ниже, чем в главе 3: нить 2014 → 2022 идёт над её булавкой, а не впритык
  const CW4 = 270, CH4 = 330, PH4 = 240, photo4 = cd => [cd.x, cd.y - CH4 / 2 + 15 + PH4 / 2], pin4 = cd => [cd.x, cd.y - CH4 / 2 + 4], C2014 = CARDS4[2], C2022 = CARDS4[4];
  const PHC = { x: 610, y: 1340, s: 460 };   // фото 2014: квадрат кофейни с центром (610, 1340) стороной 460 — айкос у карты США на столе
  let KJ = null, CORK4 = null, CAFE_END = null;
  // v21.2: доска — та же, что в начале главы 5 (ep/v220/80-board.js): компактная, на тёмной стене, 1924 — две пачки без HeatSticks.
  // Хвост фильма — 2 с: кадр кофейни сжимается в фото 2014, нить тянется к закрытой 2022, камера едет по нити к карточке 2022.
  // Последний кадр = кадр главы 5 за 1/30 с до её начала: ключи KS — общие с KJ5 главы 5 (время τ: 0 — начало главы 5).
  const BRD4 = { x0: -40, y0: 120, x1: 1120, y1: 1160 }, KS = [[-1.0, 330, 740, 1.35], [0, 540, 640, .88], [.55, 820, 752, 2.2], [1.15, 850, 760, 4.6]];
  function boardInit() {
    if (MODE !== 'y') return; const a = TM, j0 = a.jAJ, [px, py] = photo4(C2014), T0 = TLX.endT + 1 / 30;
    CAFE_END = camObj(camAt(KAE, j0));   // кадр кофейни, который станет фото
    KJ = [KY(j0, px, py, 860 / PH4), ...KS.map(([t, x, y, z]) => KY(T0 + t, x, y, z))];
  }
  function corkImg4() { if (CORK4) return CORK4; CORK4 = mk(WW, 1400); const g = CORK4.getContext('2d'); g.fillStyle = '#b07a4a'; g.fillRect(0, 0, WW, 1400);
    for (let y = 10, r = 0; y < 1400; y += 22, r++) for (let x = (r % 2) * 11; x < WW; x += 22) { if (H1(x * .37 + y * 1.13) > .55) continue; g.fillStyle = 'rgba(120,72,35,.35)'; g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill() } return CORK4 }
  function boardWall4(c) {
    c.fillStyle = '#2a1d14'; c.fillRect(-4000, -4000, 9000, 9000); c.fillStyle = 'rgba(255,255,255,.03)'; for (let x = -4000; x < 5000; x += 140) c.fillRect(x, -4000, 4, 9000);
    const B = BRD4, im = corkImg4();
    c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(B.x0 + 18, B.y0 + 26, B.x1 - B.x0, B.y1 - B.y0);
    c.save(); rr(c, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 14); fill(c, '#5b3d26'); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); c.clip();
    for (let yy = B.y0; yy < B.y1; yy += 1400) for (let xx = B.x0; xx < B.x1; xx += 1080) c.drawImage(im, xx, yy); c.restore();
    rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); lnS(c, 3, 'rgba(241,230,214,.4)');
    c.save(); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); c.clip(); const g = c.createRadialGradient(540, 420, 120, 540, 700, 1100); g.addColorStop(0, 'rgba(255,236,190,.12)'); g.addColorStop(1, 'rgba(20,12,6,.38)'); c.fillStyle = g; c.fillRect(B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0); c.restore();
  }
  function marker4(c, x, y, s, seed) { c.save(); c.translate(x, y); c.lineCap = 'round';
    [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(seed + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke(); c.restore() }); c.restore() }
  function pin4d(c, x, y) { circ(c, x + 2, y + 4, 10, 'rgba(0,0,0,.35)'); circ(c, x, y, 10, '#dc2626'); circ(c, x - 3, y - 3, 3.6, '#fca5a5') }
  function thread4(c, a, b, k = 1) { if (k <= 0) return; const [x1, y1] = pin4(a), [x2, y2] = pin4(b), x = lp(x1, x2, k), y = lp(y1, y2, k);
    c.save(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(x + 3, y + 6); c.stroke(); c.strokeStyle = '#dc2626'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x, y); c.stroke(); c.restore() }
  function photo1979(c, x, y, s) { c.fillStyle = '#1b2142'; c.fillRect(x - s / 2, y - s / 2, s, s); c.save(); c.translate(x - s * .12, y + s * .08); c.scale(s / 240, s / 240);
    poly(c, [-38, 20, 38, 20, 56, 56, -56, 56]); fill(c, '#38bdf8'); poly(c, [-14, -80, 14, -80, 14, -30, 60, 60, -60, 60, -14, -30]); c.strokeStyle = '#e0f2fe'; c.lineWidth = 5; c.stroke();
    poly(c, [96, 30, 120, 8, 146, 26, 140, 58, 108, 60]); fill(c, '#F4F1EA'); poly(c, [120, 8, 146, 26, 128, 38]); fill(c, '#FFFFFF'); c.restore() }
  function photo2020(c, x, y, s) { c.fillStyle = '#1e2138'; c.fillRect(x - s / 2, y - s / 2, s, s); rr(c, x - s * .12, y - s * .32, s * .24, s * .64, s * .08); fill(c, B2.mango);
    poly(c, [x - s * .12, y + s * .02, x + s * .12, y - s * .1, x + s * .12, y + s * .32, x - s * .12, y + s * .32]); fill(c, B2.ice2); rr(c, x - s * .07, y - s * .42, s * .14, s * .12, 6); fill(c, '#2a2f55') }
  function photo1924(c, x, y, s) {   // v21.2: две пачки главы 3 — мягкая 1920-х и Flip-Top 1950-х, без HeatSticks (как в главе 5)
    c.fillStyle = '#1b1f3a'; c.fillRect(x - s / 2, y - s / 2, s, s); beam(c, x, y - s / 2, x, y + s * .3, 10, s * .5, '#FFE6B8', .14);
    c.fillStyle = 'rgba(200,230,255,.25)'; c.fillRect(x - s / 2, y + s * .3, s, 4); c.fillStyle = '#14172E'; c.fillRect(x - s / 2, y + s * .3 + 4, s, s);
    c.save(); c.translate(x, y); c.scale(s / 240, s / 240); softPack(c, -86, -16, 64, 96, 12, { shadow: false }); mPack(c, 10, -24, 64, 104, 12, { shadow: false }); c.restore();
  }
  function card4(c, t, cd) {
    const [px, py] = photo4(cd);
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW4 / 2, -CH4 / 2, CW4, CH4, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW4 / 2, cd.y - CH4 / 2, CW4, CH4, 6); fill(c, '#f5f0e6'); rr(c, cd.x - CW4 / 2, cd.y - CH4 / 2, CW4, CH4, 6); lnS(c, 3, '#2b2638');
    c.save(); c.beginPath(); c.rect(px - PH4 / 2, py - PH4 / 2, PH4, PH4); c.clip();
    if (cd.id === '1979') photo1979(c, px, py, PH4); else if (cd.id === '2020') photo2020(c, px, py, PH4); else if (cd.id === '1924') photo1924(c, px, py, PH4);
    else { c.fillStyle = '#1e293b'; c.fillRect(px - PH4 / 2, py - PH4 / 2, PH4, PH4) }   // 2014 — кадр кофейни рисует photoOver поверх
    if (!cd.open) { rr(c, px - PH4 / 2, py - PH4 / 2, PH4, PH4, 2); fill(c, '#17171c'); marker4(c, px, py, PH4, cd.x) }
    c.restore();
    tx(c, cd.a, cd.x, cd.y + CH4 / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' });
    tx(c, TEXT[cd.bk], cd.x, cd.y + CH4 / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW4 - 24 });   // v21.2: подпись у всех (у 2022 — «СНЮС», как в главе 5)
  }
  function boardWorld(c, t) {
    const a = TM; boardWall4(c);
    const [c79, c20, c14, c24, c22] = CARDS4; thread4(c, c79, c20); thread4(c, c20, c14); thread4(c, c20, c24); thread4(c, c20, c22); thread4(c, c24, c79); thread4(c, c24, c14);
    thread4(c, c14, c22, eio(at(t, a.jAJ + .45, a.jAJ + 1.15)));   // нить к закрытой 2022
    CARDS4.forEach(cd => card4(c, t, cd)); CARDS4.forEach(cd => pin4d(c, ...pin4(cd)));
  }
  function photoOver(c, t, q) {   // кадр кофейни сжимается в фото карточки 2014 (v21.2: за 0,7 с)
    const a = TM, e = eio(at(t, a.jAJ, a.jAJ + .7)), [px, py] = photo4(C2014), P = { x: (px - q.x) * q.z + 540, y: (py - q.y) * q.z + 960, s: PH4 * q.z };
    const S = { x: lp(540, P.x, e), y: lp(960, P.y, e), w: lp(WW, P.s, e), h: lp(HH, P.s, e) }, c0 = CAFE_END, Vh = lp(HH / c0.z, PHC.s, e), k = S.h / Vh;
    const V = { x: lp(c0.x, PHC.x, e), y: lp(c0.y, PHC.y, e) }, fw = 15 * q.z * Math.min(1, e * 3);
    if (e > 0) { c.save(); c.globalAlpha *= .35 * Math.min(1, e * 3) * (1 - at(e, .85, 1)); c.fillStyle = '#000'; c.fillRect(S.x - S.w / 2 - fw + 8 * q.z, S.y - S.h / 2 - fw + 12 * q.z, S.w + fw * 2, S.h + fw * 2); c.restore();
      c.fillStyle = '#f5f0e6'; c.fillRect(S.x - S.w / 2 - fw, S.y - S.h / 2 - fw, S.w + fw * 2, S.h + fw * 2) }
    c.save(); c.beginPath(); c.rect(S.x - S.w / 2, S.y - S.h / 2, S.w, S.h); c.clip(); c.translate(S.x - 540, S.y - 960);
    cafeShot(c, t, { x: V.x, y: V.y, z: k, r: 0 }, t - TL0, cafe2St(t)); c.restore();
  }
  function boardShot(c, t) { const q = camObj(camAt(KJ, t)); layer(c, q, 1, cc => boardWorld(cc, t)); photoOver(c, t, q) }
  window.__ph14 = (t, N) => { const cv = mk(N, N), g = cv.getContext('2d'); g.translate(N / 2 - 540, N / 2 - 960); cafeShot(g, t, { x: PHC.x, y: PHC.y, z: N / PHC.s, r: 0 }, t - TL0, cafe2St(t)); return cv.toDataURL('image/png') };   // v22.2: фото карточки 2014 в конце главы 4 → ep/v210-ph2014.png (глава 5 рисует его же — стык 4 → 5 без подмены)
  // ================= сборка главы 4: миры подряд, одна камера, плашка года, кадр, звуки =================
  // Миры: A кофейня → B бумажный глобус → C витрина в Нагое → D ночная машина → F магазин (шоу) → G лаборатория → H кабинет FDA с картой США
  // → A кофейня (карта на столе) → J доска (только фильм). На каждом стыке у миров общие ключи камеры (linkK), кадр на стыке одинаков в обоих мирах.
  const SEG = []; let INITED = false;
  function keys() { return { endT: TLX.endT, b0: TLX.b0, vEnd: TLX.vEnd } }
  function allInit() {
    if (INITED) return; INITED = true;
    cafeInit(); globeInit(); linkK(KA1, KB, { x: 660, y: 1990, m: BALL_R / GB.R }, true);   // комок падает в темноту — это глобус
    storeCInit(); linkK(KB, KC, NBC, true);   // в точке Нагои — витрина
    carInit();   // v21.2: держатель переезжает из витрины на подлокотник (без нырка в белое — carShot)
    storeFInit();   // v21.2: экран машины = телевизор магазина, шоу стоит, окружение меняется шторкой (storeFShot)
    labInit(); linkK(KF, KG, NFG, true);   // луч в темноте — одинаковый в магазине и в лаборатории
    deskInit(); linkK(KG, KH, NGH, true);   // страница журнала во весь экран: тот же журнал на столе FDA (v21.1: без нырка в белое)
    mapInit(); cafe2Init(); linkK(KH, KAE, N_HA, false);   // карта США на столе FDA = карта на столе кофейни
    if (MODE === 'y') boardInit();   // v21.1: кадр кофейни сжимается в фото карточки 2014 (photoOver) — без нырка в белое
    const W = (a, b) => SHUT.push([a, b]);
    W(TA.fall1 - .45, TA.jAB + 1.15); W(TB.dive - .1, TB.jBC + .35); W(TC4.close - .1, TC4.jCD + .4); W(TD4.kom + .2, TD4.jDF + .3); W(TG.jGH - .45, TG.jGH + .65);
    W(TH.pat + .35, TH.land + .1); W(TH.vygn, TH.vygn + .65); W(TH.jHA - .1, TH.jHA + .85); W(TM.brosaj + .5, TM.inBin + .1);
    if (MODE !== 'y') W(TM.amerQ + .05, TM.amerQ + .5);
    W(TC4.vdvoe - .2, TC4.close); W(TH.sela - .3, TH.doll + .5); W(TH.kom - .55, TH.kom + .6);   // v21.2: термометры, горящие доллары, молоток — короткая выдержка (без двоения)
    SEG.push([-1e9, (c, t) => { cafeShot(c, t, KA1, t, {}); cafePlates1(c, t) }], [TA.jAB, globeShot], [TB.jBC, storeShot], [TC4.jCD, carShot], [TD4.jDF - .35, storeFShot], [TF.jFG, labShot],
      [TG.jGH, (c, t) => { deskShot(c, t); mapPlates(c, t) }], [TH.jHA, cafe2Shot]);
    if (MODE === 'y') SEG.push([TM.jAJ, boardShot]);
  }
  function vturn(KA, KB, f = 2.2) {   // v21.1: нырок «в белое» — на стыке зум разворачивается на полном ходу, камера не замирает на белом кадре (было до 0,5 с белого)
    const a1 = KA[KA.length - 3], a2 = KA[KA.length - 2], b1 = KB[1], b2 = KB[2];
    a2.v = [0, 0, f * (a2[3] - a1[3]) / (a2[0] - a1[0]), 0]; b1.v = [0, 0, f * (b2[3] - b1[3]) / (b2[0] - b1[0]), 0];
  }
  function scene(c, t) { allInit(); let f = SEG[0][1]; for (const s of SEG) if (t >= s[0]) f = s[1]; f(c, t) }
  let HY = null;
  function hud(c, t) {   // плашка года — только вперёд: 2014 → 2016 → 2017 → 2020, уходит на «Помните» (1973 и 1988 — назад нельзя); 2021 → 2024, уходит до строки 16 / вопроса
    if (!HY) HY = { t14: Ws('s4', 'две'), t16: Ws('s6', 'шестнадцатом'), t17: Ws('s8', 'год'), t20: Ws('s10', 'двадцатом'), out1: Ws('s11', 'помните') - .5, t21: Ws('s13', 'двадцать'),
      t24: Ws('s14', 'двадцать'), out2: MODE === 'y' ? WsB('s15', 'вы') + .2 : Ws('q', 'угадаете') - .6 };   // v21.1: год — на «в две тысячи…», «в двадцать…»; 2020 уходит до «Помните»
    const h = HY, pill = (y0, y1, k, dy = 0) => { c.save(); c.setTransform(1, 0, 0, 1, 0, dy); yearPill(c, y0, y1, k, 1, true); c.restore() };
    if (t < h.t14 - .25) return;
    if (t < h.t16 - .3) return pill(2014, 2014, 1, -240 * (1 - eo(at(t, h.t14 - .25, h.t14 + .15))));
    if (t < h.t17 - .3) return pill(2014, 2016, at(t, h.t16 - .1, h.t16 + .2));   // v21.2: барабан щёлкает быстрее — не «висит» на полпути
    if (t < h.t20 - .3) return pill(2016, 2017, at(t, h.t17 - .1, h.t17 + .2));
    if (t < h.out1 + .45) return pill(2017, 2020, at(t, h.t20 - .1, h.t20 + .2), -240 * ei(at(t, h.out1, h.out1 + .45)));
    if (t < h.t21 - .25) return;
    if (t < h.t24 - .3) return pill(2021, 2021, 1, -240 * (1 - eo(at(t, h.t21 - .25, h.t21 + .15))));
    if (t < h.out2 + .45) return pill(2021, 2024, at(t, h.t24 - .1, h.t24 + .2), -240 * ei(at(t, h.out2, h.out2 + .45)));
  }
  let MBC = null; const SHUT = [];   // окна короткой выдержки — на быстрых нырках и проездах
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
  function frameTo(c, t) {
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH); FT = t;
    if (window.NOMB) scene(c, t); else sceneMB(c, t);
    c.setTransform(1, 0, 0, 1, 0, 0); hud(c, t); subs(c, t);
  }
  function cues() {   // звуки по событиям (мягкие)
    allInit(); const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    const a = TA; Q(.05, 'city', .25); Q(a.marl, 'shimmer', .25); Q(a.poob, 'pageflip', .7); Q(a.poob + .2, 'papers', .3); Q(a.brit - .05, 'papers', .5); Q(a.brit + .1, 'whoosh', .3, -.3);
    Q(a.nashe, 'quill', .3); Q(a.pyt, 'quill', .25); Q(a.slovo, 'papers', .6); Q(a.slovo + .5, 'munch', .3); Q(a.ball0, 'thud', .4); Q(a.roll1 - .3, 'scuttle', .3, .2); Q(a.fall1, 'whoosh', .45); Q(a.jAB, 'deep', .4);
    const b = TB; Q(b.j + .3, 'whirr', .3); Q(b.chet, 'shimmer', .3); Q(b.nag, 'plop', .45, .3); Q(b.mil, 'plop', .45, -.3); Q(b.dive, 'dive', .55); Q(b.jBC, 'glass', .3);
    const s = TC4; Q(s.kot - .1, 'drawer', .3); Q(s.kot + .5, 'plop', .35); Q(s.nelz, 'cryptex', .35, -.4); Q(s.podzh - .1, 'zap', .3, -.4); Q(s.podzh, 'puff', .2); Q(s.tab, 'whoosh', .35); Q(s.nagr, 'blade', .35);
    Q(s.vdvoe, 'counter', .3); Q(s.hol, 'counter', .3); Q(s.close, 'whoosh', .25); Q(s.jCD + .1, 'whoosh', .45);
    const d = TD4; Q(d.j + .1, 'city', .3); Q(d.kurt, 'truck', .3, .4); Q(d.pep, 'drawer', .35); Q(d.mash, 'puff', .3); Q(d.shest, 'shimmer', .3); Q(d.rash, 'flutter', .3); Q(d.jDF - .35, 'whoosh', .45); Q(d.jDF, 'glass', .2);
    const f = TF; Q(f.smel - .25, 'scuttle', .5); Q(f.smel + .3, 'conveyor', .3); Q(f.pol, 'whoosh', .3); Q(f.off, 'buzz', .35); Q(f.vred, 'puff', .3);
    const g = TG; Q(g.on, 'buzz', .3); Q(g.poim - .1, 'glassbulb', .45); Q(g.yady - .1, 'xray', .45); Q(g.mnog, 'plop', .3); for (let i = 0; i < 4; i++) Q(g.mnog + .15 + i * .12, 'plop', .2, -.3 + i * .2);
    Q(g.bol, 'impact', .35); Q(g.nik, 'counter', .35); Q(g.stat - .1, 'pageflip', .5); Q(g.dym - .05, 'scroll', .35); Q(g.imen, 'puff', .3); Q(g.jGH - .3, 'whoosh', .5); Q(g.jGH, 'pageflip', .3);
    const h = TH; Q(h.form, 'papers', .5); Q(h.mensh, 'marker', .45); Q(h.vreda - .05, 'thud', .6); Q(h.vreda, 'impact', .4); Q(h.razresh + .25, 'plop', .35); Q(h.pomn, 'scroll', .4); Q(h.pomn + .4, 'papers', .4);
    Q(h.reyn, 'factory', .3); Q(h.sem, 'marker', .35); Q(h.podr, 'marker', .45); Q(h.svoi - .05, 'drawer', .3); Q(h.svoi + .3, 'thud', .4); Q(h.svoi + .45, 'plop', .3); Q(h.prizh, 'puff', .3); Q(h.ugol, 'zap', .3);
    Q(h.ugol + .1, 'coins', .3); Q(h.sela, 'counter', .5); Q(h.sela + .3, 'puff', .35); Q(h.doll, 'register', .5); Q(h.pat, 'scroll', .5); Q(h.pat + .5, 'whoosh', .4); Q(h.land, 'papers', .5);
    for (let i = 0; i < 4; i++) Q(h.perv - .3 + i * .1, 'plop', .2, -.2 + i * .15); Q(h.kom - .05, 'impact', .7); Q(h.kom, 'thud', .6); Q(h.narush, 'xray', .4); Q(h.vygn - .2, 'chain', .4); Q(h.vygn + .1, 'whoosh', .6);
    Q(h.vygn + .45, 'splash', .5); Q(h.vygn + .5, 'stamp', .55); Q(h.amer, 'wave', .3); Q(h.jHA, 'whoosh', .45);
    const m = TM; Q(m.roll0, 'scuttle', .4, -.4); Q(m.tri, 'counter', .45); for (let i = 0; i < 3; i++) Q(m.tri + .2 + i * .3, 'plop', .2, -.3); Q(m.sig, 'conveyor', .35); Q(m.sig + .1, 'counter', .4); Q(m.shest, 'counter', .45);
    Q(m.bol, 'impact', .3); Q(m.bol + .05, 'shimmer', .25); Q(m.brosaj, 'scuttle', .4, .3); Q(m.edge, 'whoosh', .3); Q(m.inBin - .05, 'bin', .6, .4); Q(m.rovno, 'thud', .2); Q(m.vy, 'city', .2);
    if (MODE === 'y') { Q(m.jAJ + .05, 'whoosh', .4); Q(m.jAJ + .6, 'papers', .3); Q(m.jAJ + .7, 'plop', .3); Q(m.jAJ + .5, 'marker', .35); Q(m.jAJ + 1.2, 'whoosh', .3) }   // v21.2: хвост 2 с — кадр → фото, нить к 2022, камера к карточке 2022   // кадр → фото на доске, нить к 2022
    else { Q(m.ugad, 'shimmer', .3); Q(m.amerQ, 'pageflip', .3); Q(m.amerQ + .46, 'impact', .45); Q(m.amerQ + .48, 'papers', .5); Q(TL0 - .5, 'city', .25) }
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    sub: { init: null, scene: (c, t) => scene(c, t), frameTo: (c, t) => frameTo(c, t) },
    init(tl, SC, sub) {
      TLW = tl.sent.flatMap(s => s.words); TLS = tl.sent; const ep = String(tl.ep || '').replace(/-(ru|en|de)$/, '');
      setLang(tl.lang || (String(tl.ep || '').match(/-(ru|en|de)$/) || [])[1] || 'ru'); MQF = 0;   // v21.1: надписи — на языке ролика
      MODE = /y$/.test(ep) ? 'y' : 's';
      TLX = { b0: tl.b0, vEnd: tl.vEnd, endT: (Math.ceil(tl.dur * 30) - 1) / 30 };
      K = keys(); SEG.length = 0; SHUT.length = 0; HY = null; INITED = false; CHUNKS = buildChunks(tl.subs);
      if (!sub) { window.__K = K; cues(); window.CUES_READY = 1 } else allInit();
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v210f')) { const st = document.createElement('style'); st.id = 'v210f';
        st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join('')
          + ['latin', 'cyrillic'].map(sub => `@font-face{font-family:P;font-weight:700;font-style:normal;src:url(fonts/playfair-${sub}-700-normal.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}@font-face{font-family:P;font-weight:400 700;font-style:italic;src:url(fonts/playfair-${sub}-700-italic.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}`).join('');
        document.head.appendChild(st) }
      cv = mk(WW, HH); if (!sub) { cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain')) }
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U', '700 20px P', 'italic 700 20px P', 'italic 400 20px P'].map(f => document.fonts.load(f, 'АЯaz09$'))).then(() => 0);
    },
  };
  { const ep = window.EP; ep.sub.init = tl => ep.init(tl, [], true) }
  window.__dbg = { camAt, get KA1() { return KA1 }, get KB() { return KB }, get KC() { return KC }, get KD() { return KD }, get KF() { return KF }, get KG() { return KG }, get KH() { return KH }, get KAE() { return KAE }, get KJ() { return KJ },
    get T() { return { TA, TB, TC4, TD4, TF, TG, TH, TM } }, get HOLD() { return HOLD }, get SEG() { return SEG } };
})();
