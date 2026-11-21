// v22.0 (20.11) — глава 5 «2022 · Снюс» и финал фильма «Что вы знаете о никотине?». Текст 1 «Невидимка» и финал Б (глава5/data.py), голос Макса (voice/v220),
// строки 16–17 главы 4 в начале (voice/v210). Ролики: v220y-ru — глава фильма с финалом (переворот доски, змея), v220s-ru — шортс (вопрос, доска на ребро, петля).
// Рисовка — по таблице Gemini 20.11 (разбор нашей рисовки глава5/рисовка-20.11): без белых вспышек, баночка на волне с кадра 0, морфы (flubber) и
// скелетные фигурки из пробы инструментов (ep/vpr). Основа — набор глав 3–4: ep/v200/05-kit.js, 12-cam.js, 15-props.js; время событий — по словам голоса (Ws).
(function () {
  'use strict';
  const WW = 1080, HH = 1920, CX = WW / 2, CY = HH / 2, TAU = Math.PI * 2, SUBY = 1720;
  let cv = null, X = null, K = null, TLW = [], TLX = {}, MODE = 's', CHUNKS = [];
  let FT = 0;   // v21.1: время кадра — числа на счётчиках считаем по нему, иначе в размытии движения (4 момента за полкадра) цифры двоятся
  window.CUES = window.CUES || {};
  const cue = (t0, name, gain = 1, pan = 0) => { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, pan] };
  const nw = s => String(s).toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
  function Wd(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.a } throw new Error('v220: нет слова «' + q + '» #' + n) }
  let TLS = [];
  function Ws(sc, q, n = 0) { const s = TLS.find(x => x.scene === sc); if (!s) return null; let k = 0; for (const w of s.words) if (nw(w.d) === q) { if (k++ === n) return w.a } throw new Error('v220: нет слова «' + q + '» во фразе ' + sc) }
  function WsB(sc, q, n = 0) { const s = TLS.find(x => x.scene === sc); if (!s) return null; let k = 0; for (const w of s.words) if (nw(w.d) === q) { if (k++ === n) return w.b } throw new Error('v220: нет слова «' + q + '» во фразе ' + sc) }
  const SA = sc => { const s = TLS.find(x => x.scene === sc); return s ? s.a : null }, SB = sc => { const s = TLS.find(x => x.scene === sc); return s ? s.b : null };
  function WdB(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.b } throw new Error('v220: нет слова «' + q + '» #' + n) }
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
  function buildChunks(subs) {   // 21.11: subs — субтитры перевода из таймлайна (озвучка EN/DE, l10n/dub.py), иначе — русские слова голоса
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
  // ================= глава 5: надписи — по языку ролика (как в главе 4: TEXT — наши плашки, OBJ — надписи на предметах) =================
  // По разбору Gemini 20.11 числа сразу в форматах EN/DE ($16B / 16 MRD. $, 581M / 581 MIO.). Язык — из ролика (v220y-ru → ru) в EP.init → setLang.
  const TEXT_L = {
    ru: {
      notob: 'БЕЗ ТАБАКА', snusTob: 'СНЮС = ТАБАК', nicTob: 'НИКОТИН — ИЗ ТАБАКА', ky: 'КЕНТУККИ', empty: 'ПУСТЫЕ ПОЛКИ',
      soldout: 'РАСКУПИЛИ', ok: 'РАЗРЕШЕНО', first: 'ПЕРВЫЕ', less: 'МЕНЬШЕ ВЕЩЕСТВ', harm: 'МЕНЬШЕ ВРЕДА', no: 'НЕЛЬЗЯ', risk: 'НИЖЕ РИСК',
      kids: 'ШКОЛЬНИКИ США', mg: 'МГ', strength: 'КРЕПОСТЬ', title: 'ЧТО ВЫ ЗНАЕТЕ О НИКОТИНЕ?', titleL: ['ЧТО ВЫ ЗНАЕТЕ', 'О НИКОТИНЕ?'], quit: 'СПОСОБ БРОСИТЬ', yt: 'ЦЕЛИКОМ — НА YOUTUBE',
      card79b: 'СОЛЬ', card20b: 'ЛАЗЕЙКА ОДНОРАЗОК', card24b: '«МАЛЬБОРО»', card14b: 'НАГРЕВАТЕЛИ', card22b: 'СНЮС',
      fPrice: v => '$' + v + ' МЛРД', fCans: v => v + ' МЛН', fPct: v => String(v).replace('.', ',') + ' %',
    },
    en: {
      notob: 'NO TOBACCO', snusTob: 'SNUS = TOBACCO', nicTob: 'NICOTINE — FROM TOBACCO', ky: 'KENTUCKY', empty: 'EMPTY SHELVES',
      soldout: 'SOLD OUT', ok: 'AUTHORIZED', first: 'THE FIRST', less: 'FEWER CHEMICALS', harm: 'LESS HARM', no: 'NOT ALLOWED', risk: 'LOWER RISK',
      kids: 'U.S. STUDENTS', mg: 'MG', strength: 'STRENGTH', title: 'WHAT DO YOU KNOW ABOUT NICOTINE?', titleL: ['WHAT DO YOU KNOW', 'ABOUT NICOTINE?'], quit: 'A WAY TO QUIT', yt: 'FULL VERSION — ON YOUTUBE',
      card79b: 'SALT', card20b: 'THE DISPOSABLE LOOPHOLE', card24b: '“MARLBORO”', card14b: 'HEATED TOBACCO', card22b: 'NICOTINE POUCHES',
      fPrice: v => '$' + v + 'B', fCans: v => v + 'M', fPct: v => v + '%',
    },
    de: {
      notob: 'OHNE TABAK', snusTob: 'SNUS = TABAK', nicTob: 'NIKOTIN – AUS TABAK', ky: 'KENTUCKY', empty: 'LEERE REGALE',
      soldout: 'AUSVERKAUFT', ok: 'ZUGELASSEN', first: 'DIE ERSTEN', less: 'WENIGER SCHADSTOFFE', harm: 'WENIGER SCHÄDLICH', no: 'VERBOTEN', risk: 'GERINGERES RISIKO',
      kids: 'US-SCHÜLER', mg: 'MG', strength: 'STÄRKE', title: 'WAS WISST IHR ÜBER NIKOTIN?', titleL: ['WAS WISST IHR', 'ÜBER NIKOTIN?'], quit: 'EIN WEG ZUM AUFHÖREN', yt: 'KOMPLETT AUF YOUTUBE',
      card79b: 'SALZ', card20b: 'DIE EINWEG-LÜCKE', card24b: '„MARLBORO“', card14b: 'TABAKERHITZER', card22b: 'NIKOTINBEUTEL',
      fPrice: v => v + ' MRD. $', fCans: v => v + ' MIO.', fPct: v => String(v).replace('.', ',') + ' %',
    },
  };
  const OBJ_NAMES = { pm: 'Philip Morris', snus: 'SNUS', marl: 'Marlboro', zyn: 'ZYN', velo: 'VELO', pablo: 'PABLO', juul: 'JUUL', fda: 'FDA', iqos: 'IQOS', rj: 'R.J. REYNOLDS', pmT: 'PHILIP MORRIS' };
  const TEXT = {}, OBJ = {};
  let LANG = 'ru';
  function setLang(l) {
    LANG = TEXT_L[l] ? l : 'ru'; for (const o of [TEXT, OBJ]) for (const k in o) delete o[k];
    Object.assign(TEXT, TEXT_L[LANG]); Object.assign(OBJ, OBJ_NAMES);
  }
  setLang('ru');
  // палитра главы 5 (основа — набор Боба B2; C4 — имена, которыми пользуются помощники из главы 4)
  const C5 = {
    sky0: '#0B1128', sky1: '#16224A', sky2: '#24356A', moon: '#F4EBD0', shore: '#0E1430', lights: '#FFD27A', sea0: '#0F2350', sea1: '#173170', sea2: '#21428C', foam: '#C9DCF2',
    sand: '#3A3550', sandW: '#2B2C4A', tin: '#F4F4F2', tinS: '#D4D7DF', tinD: '#B9BECB', lid: '#FAFAF8', pouch: '#FFFDF8', pouchS: '#E6E1D6',
    office: '#E9E3D8', officeD: '#CFC6B6', table: '#EFE6D2', tableS: '#D9CDB4', tableE: '#BFAF92', sky: '#9FC6E8', city: '#6E86A8', cityD: '#56708F',
    cabin: '#DCD8D0', cabinD: '#B9B3A8', seat: '#3D4A6B', seatD: '#2C3652', gum: '#E8A3A8', gumD: '#C97E86', vessel: '#D6334D', nic: '#FFD23F',
    wood: '#8A5A3A', woodL: '#A5734E', woodD: '#5E3B25', wall: '#E9DCC5', red: '#B3352B', forest: '#2F5B3A', forestD: '#1F4029', lake: '#5C8FC2',
    snusD: '#2A2420', snusB: '#6B4A2E', brown: '#7A5232', leaf: '#6E8B3D', leafD: '#4E6A2A', copper: '#C27A44', glass: 'rgba(190,225,250,.18)',
    gas: '#1C2240', shelf: '#C9CED8', shelfD: '#9EA5B5', neon: '#FF5A5F', fda: '#E7E1D3', lamp: '#FFE7B0',
    mint: '#5ED39B', lemon: '#F2D04B', coffee: '#6B4429', cinn: '#B5652E', green: '#17A86B', grnL: '#5ED39B',
    locker: '#3E5C8A', lockerD: '#2E4770', lockerL: '#5A7BB0', floor: '#C7BFAF', cork: '#b07a4a', board: '#5b3d26',
    iq: '#F4F3EF', iqS: '#C9CBD2', iqD: '#9EA2AD', iqCap: '#2B2F3A', ember: '#FF6A2A', paperL: '#FFFDF8',
  };
  const C4 = C5;
  // наша плашка (как в главе 3): светлая, тёмные буквы
  function cap5(c, s, x, y, k, o = {}) { plate(c, s, x, y, bo(k), { s: o.s || 50, bg: o.bg || '#F4F1EA', c: o.c || '#141010', ls: o.ls ?? 3, w: o.w || 800, r: o.r, a: o.a }) }
  // плашка в экранных координатах (поверх кадра, пока камера едет)
  function capS(c, s, x, y, k, o) { if (k <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); cap5(c, s, x, y, k, o); c.restore() }
  // держатель IQOS 2014 года, горизонтально: центр (x, y), длина L; белый, скруглённый, бок темнее, блик; o.stick — стик торчит справа (0..1), o.cut — разрез (тонкие линии), o.ang — поворот
  function iqos4(c, x, y, L, o = {}) {
    const h = L * .2, r = h * .5; c.save(); c.translate(x, y); if (o.ang) c.rotate(o.ang);
    if (o.shadow !== false) rasterPoly(c, [-L / 2 + 10, h / 2, L / 2, h / 2, L / 2 + h * .9, h * 1.15, -L / 2 + 10 + h * .9, h * 1.15], o.shc || 'rgba(6,8,24,.4)', 9, 2.3);
    const st = o.stick ?? 0;
    if (st > 0) {   // стик: бумага, табачный торец снаружи; o.left — стик торчит слева
      const sl = L * .34 * st, sx = o.left ? -L / 2 + 8 - sl : L / 2 - 8; rr(c, sx, -h * .2, sl, h * .4, 4); fill(c, '#F7F4EC'); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(sx, h * .06, sl, h * .14);
      c.fillStyle = '#C9A266'; const tw0 = Math.min(sl, h * .5); c.fillRect(o.left ? sx : sx + sl - tw0, -h * .2, tw0, h * .4);
      if (o.brand) tx(c, 'Marlboro', sx + sl * .5, 1, { f: 'P', w: 700, st: 'italic', s: h * .26, c: 'rgba(176,18,44,.8)' });
    }
    const body = cc => rr(cc, -L / 2, -h / 2, L, h, r);
    if (o.cut) { body(c); c.fillStyle = 'rgba(190,225,250,.13)'; c.fill(); body(c); lnB(c, 3, 'rgba(220,240,255,.9)'); rr(c, -L / 2 + 12, -h / 2 + 12, L - 24, h - 24, r - 10); lnB(c, 1.6, 'rgba(220,240,255,.45)') }
    else {
      body(c); c.fillStyle = C4.iq; c.fill(); c.save(); body(c); c.clip();
      c.fillStyle = C4.iqS; c.fillRect(-L / 2, h * .16, L, h); c.fillStyle = 'rgba(255,255,255,.75)'; c.fillRect(-L / 2 + r, -h * .36, L - r * 2, h * .12);
      c.fillStyle = C4.iqCap; c.fillRect(o.left ? -L / 2 + L * .16 - 6 : L / 2 - L * .16, -h, 6, h * 2);   // шов колпачка
      for (let i = 0; i < 3; i++) circ(c, (o.left ? L / 2 - L * .2 - i * 16 : -L / 2 + L * .2 + i * 16), -h * .05, 4, i < (o.leds ?? 3) ? '#CDEBFF' : '#8E95A6');   // огоньки заряда
      c.restore(); body(c); lnB(c, 2.5, 'rgba(20,23,51,.35)');
      if (o.name) tx(c, OBJ.iqos, -L * .08, h * .02, { f: 'M', w: 800, s: h * .3, c: o.glow ? mixc('#7A7F8E', '#1B1A18', o.glow) : '#8A8F9C', ls: 4 });
    }
    c.restore();
  }
  // v22.2: объёмная пачка Marlboro — та же, что в главе 4 (v212): лицо, крыша, бок, шов Flip-Top, откинутая крышка с фольгой и фильтрами
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
  // пачка стиков Marlboro HeatSticks — эталон главы 3 (та же «крыша», ниже и уже обычной пачки)
  function heat4(c, x, y, s, gl = 0) { c.save(); c.translate(x, y); c.scale(s, s); mPack(c, -60, -190, 120, 190, 22, { sub: 'HeatSticks', glow: gl, shc: 'rgba(0,0,0,.3)' }); c.restore() }
  // коробка IQOS для полки
  function box4(c, x, y, w, h, o = {}) {
    rasterPoly(c, [x + w, y + h * .2, x + w + h * .22, y + h * .32, x + w + h * .22, y + h * 1.06, x + w * .25, y + h * 1.06, x, y + h], 'rgba(0,0,0,.28)', 8, 2);
    PL(c, [x - w * .14, y + h * .05, x, y, x, y + h, x - w * .14, y + h - h * .05], '#C9CBD2');
    c.fillStyle = '#F4F3EF'; c.fillRect(x, y, w, h); c.fillStyle = '#E3E4E8'; c.fillRect(x + w * .78, y, w * .22, h);
    tx(c, OBJ.iqos, x + w * .45, y + h * .5, { f: 'M', w: 800, s: w * .2, c: '#3A3F4C', ls: 2 }); c.fillStyle = '#2F6FD6'; c.fillRect(x + w * .2, y + h * .72, w * .5, 4);
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
  // ================= глава 5: инструменты из пробы 20.11 (ep/vpr) — превращения формы в форму (flubber, MIT) и скелет у белых фигурок =================
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
  const mirrorX = (c, axis, fn) => { c.save(); c.translate(axis * 2, 0); c.scale(-1, 1); fn(); c.restore() };   // фигурка смотрит влево: та же поза, зеркально
  // ================= мир 0: ночной океан у берега США (строки 16–17 главы 4: b1, b2) =================
  // Кадр 0 (шортс и фильм после нырка в фото карточки 2022): крупная белая баночка уже качается на волне на переднем плане, позади — огни берега
  // и опущенный красный шлагбаум, на нём висит ценник Philip Morris. «через» — плашка 2022; «запрета» — шлагбаум поднимается, волна выносит баночку
  // на мокрый песок; «шестнадцать» — ценник ложится на баночку, барабан до $16 МЛРД. b2: баночка поворачивается крышкой к нам, крышка откидывается —
  // белые подушечки по кругу; над ними лист табака перечёркнут, «БЕЗ ТАБАКА». Стык с офисом — подушечка вылетает к камере и становится столешницей.
  let T0 = null, K0 = null;
  function oceanInit() {
    T0 = { fil: Ws('b1', 'филип'), cher: Ws('b1', 'через'), zap: Ws('b1', 'запрета'), mal: Ws('b1', 'маленькой'), za: Ws('b1', 'за'), shest: Ws('b1', 'шестнадцать'), mlrdA: Ws('b1', 'миллиардов'), mlrd: WsB('b1', 'миллиардов'),
      net: Ws('b2', 'нет'), dazhe: Ws('b2', 'даже'), tab: Ws('b2', 'табака'), tabB: WsB('b2', 'табака'), s1: SA('s1') };
    const a = T0; T0.fly = a.tabB + .05; T0.sw = SA('s1') - .25;   // подушечка летит к камере · смена фона
    K0 = [KY(MODE === 'y' ? 1.15 : 0, 540, 960, 1.0), KY(a.zap - .4, 548, 940, 1.1), KY(a.mlrd, 560, 1010, 1.26), KY(a.dazhe, 548, 1060, 1.42), KY(a.fly + .1, 540, 1110, 1.62)];
  }
  // баночка 2.5D: центр крышки (x, y), радиус R, ty — насколько видна крышка (0 — сбоку, 1 — сверху), lid 0..1 — крышка откидывается назад;
  // o.cap — цвет крышки (вкусы), o.name — надпись на крышке, o.dark — тёмная банка SNUS, o.label — бумажная наклейка на боку, o.h — высота бока
  // v22.2: баночка в объёме — бок цилиндром в 3 тона (тень справа двумя ступенями, блик полосой слева, отсвет у края), юбка крышки со швом,
  // выпуклое кольцо на крышке; крышка снимается вверх и улетает — сзади нет «обрубка»; подушечки внутри — мягкие и пухлые
  function cylBand(c, cx, y0, y1, R, ty) { c.beginPath(); c.moveTo(cx - R, y0); c.lineTo(cx - R, y1); c.ellipse(cx, y1, R, R * ty, 0, Math.PI, 0, true); c.lineTo(cx + R, y0); c.ellipse(cx, y0, R, R * ty, 0, 0, Math.PI, false); c.closePath() }
  function cylShade(c, cx, y0, y1, R, ty, base, dk) {
    cylBand(c, cx, y0, y1, R, ty); fill(c, base); c.save(); cylBand(c, cx, y0, y1, R, ty); c.clip();
    const T = y0 - R * ty - 4, H = y1 - y0 + 2 * R * ty + 8;
    c.fillStyle = shd(base, dk ? .18 : .14); c.fillRect(cx + R * .3, T, R * .72, H);
    c.fillStyle = shd(base, dk ? .3 : .26); c.fillRect(cx + R * .66, T, R * .36, H);
    c.fillStyle = `rgba(255,255,255,${dk ? .13 : .62})`; c.fillRect(cx - R * .76, T, R * .12, H);
    c.fillStyle = `rgba(255,255,255,${dk ? .05 : .22})`; c.fillRect(cx + R * .9, T, R * .05, H);
    c.restore();
  }
  function lidTop5(c, cx, cy, R, ty, capC, dark, o) {   // верх крышки: выпуклое кольцо (свет сверху-слева, тень снизу-справа), блик на ободке, надпись
    c.beginPath(); c.ellipse(cx, cy, R, R * ty, 0, 0, TAU); fill(c, capC);
    if (R > 18) {
      const r2 = R * .8, lw = Math.max(1.4, R * .032);
      c.save(); c.beginPath(); c.ellipse(cx, cy, r2, r2 * ty, 0, 0, TAU); c.clip(); c.fillStyle = dark ? 'rgba(0,0,0,.2)' : 'rgba(30,40,70,.07)'; c.fillRect(cx + R * .22, cy - R, R, R * 2); c.restore();
      c.beginPath(); c.ellipse(cx, cy, r2, r2 * ty, 0, Math.PI * .85, Math.PI * 1.85); lnB(c, lw, dark ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.95)');
      c.beginPath(); c.ellipse(cx, cy, r2, r2 * ty, 0, -Math.PI * .15, Math.PI * .85); lnB(c, lw, dark ? 'rgba(0,0,0,.5)' : 'rgba(80,90,120,.42)');
      c.beginPath(); c.ellipse(cx, cy, R * .95, R * ty * .95, 0, Math.PI * 1.05, Math.PI * 1.45); lnB(c, Math.max(1.4, R * .04), dark ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.95)');
    }
    if (o.name) { c.save(); c.translate(cx, cy); c.scale(1, Math.max(.05, ty)); tx(c, o.name, 0, 4, { f: 'M', w: 800, s: R * .4, c: o.nameC || (dark ? '#E8D9B8' : '#1F2A44'), ls: Math.max(1, R * .035) }); c.restore() }
    c.beginPath(); c.ellipse(cx, cy, R, R * ty, 0, 0, TAU); lnB(c, Math.max(1, R * .014), 'rgba(20,23,51,.38)');
  }
  function lid5(c, cx, cy, R, ty, sk, capC, dark, o) {   // крышка целиком: юбка (бок крышки) и верх
    cylShade(c, cx, cy, cy + sk, R, ty, shd(capC, dark ? .05 : .04), dark);
    c.beginPath(); c.ellipse(cx, cy + sk, R, R * ty, 0, Math.PI * .02, Math.PI * .98); lnB(c, Math.max(1, R * .018), dark ? 'rgba(0,0,0,.55)' : 'rgba(60,66,90,.4)');   // шов крышки
    lidTop5(c, cx, cy, R, ty, capC, dark, o);
  }
  function pouchP(c, x, y, w, h, ang, dark, sy = 1, o = {}) {   // мягкая подушечка: «подушка» с градиентом, шов по краю, блик; dark — табачный снюс
    c.save(); c.translate(x, y); c.scale(1, Math.max(.06, sy)); c.rotate(ang);
    const base = o.col || (dark ? C5.snusB : C5.pouch), edge = dark ? '#3E2A1A' : '#CFC8B6', r = h * .46;
    rr(c, -w / 2 + w * .04, -h / 2 + h * .18, w, h, r); fill(c, dark ? 'rgba(0,0,0,.38)' : 'rgba(40,40,60,.18)');
    const g = c.createRadialGradient(-w * .14, -h * .2, 1, 0, 0, w * .6); g.addColorStop(0, lit(base, dark ? .18 : .55)); g.addColorStop(.55, base); g.addColorStop(1, edge);
    rr(c, -w / 2, -h / 2, w, h, r); c.fillStyle = g; c.fill();
    if (w > 16) { const d = Math.max(2, w * .05); rr(c, -w / 2 + w * .07, -h / 2 + h * .15, w * .86, h * .7, r * .8); c.setLineDash([d, d]); lnB(c, Math.max(.8, w * .018), dark ? 'rgba(255,220,180,.22)' : 'rgba(140,130,110,.45)'); c.setLineDash([]) }
    if (dark) for (let i = 0; i < 7; i++) circ(c, (H1(i * 3.1 + w) - .5) * w * .7, (H1(i * 5.3 + w) - .5) * h * .55, Math.max(.6, w * .016), 'rgba(28,16,8,.5)');
    if (o.dots) for (let j = 0; j < 3; j++) circ(c, (j - 1) * w * .22, 0, w * .06 * o.dots, C5.nic);
    c.beginPath(); c.ellipse(-w * .17, -h * .2, w * .17, h * .11, -.15, 0, TAU); fill(c, dark ? 'rgba(255,230,200,.16)' : 'rgba(255,255,255,.55)');
    c.restore();
  }
  function hand5(c, s, x, y, sz, col) {   // надпись «от руки»: курсив с разбросом наклона и высоты букв, подчёркивание
    c.save(); c.font = `italic 700 ${sz}px P`; c.fillStyle = col; c.textBaseline = 'middle'; c.textAlign = 'left'; c.letterSpacing = '0px';
    const ch = [...s], ws = ch.map(k => c.measureText(k).width * .96), W = ws.reduce((a, b) => a + b, 0); let px = x - W / 2;
    ch.forEach((k, i) => { c.save(); c.translate(px + ws[i] / 2, y + (H1(i * 7.3) - .5) * sz * .1); c.rotate((H1(i * 3.7) - .5) * .18 - .05); c.fillText(k, -ws[i] / 2, 0); c.restore(); px += ws[i] });
    c.beginPath(); c.moveTo(x - W / 2 - sz * .04, y + sz * .5); c.quadraticCurveTo(x, y + sz * .64, x + W / 2 + sz * .12, y + sz * .42); c.strokeStyle = col; c.lineWidth = Math.max(1.2, sz * .065); c.lineCap = 'round'; c.stroke();
    c.restore();
  }
  // x, y — центр верха; R — радиус; ty — насколько видна крышка (0 — сбоку, 1 — сверху); lid 0..1 — крышка поднимается и улетает вверх-вправо.
  // o: cap — цвет крышки, name — надпись на крышке, dark — тёмная банка снюса, label — наклейка «от руки» на боку, h — высота бока, n/skip — подушечки
  function tin5(c, x, y, R, ty, lid = 0, o = {}) {
    ty = Math.max(.05, Math.min(1, ty));
    const dark = !!o.dark, hS = R * (o.h ?? .42) * Math.sqrt(Math.max(0, 1 - ty * ty)) + R * .06;
    const body = o.body || (dark ? C5.snusD : C5.tin), capC = o.cap || (dark ? '#4A3F37' : C5.lid), sk = Math.min(hS * .34, R * .17);
    if (o.shadow !== false) { c.beginPath(); c.ellipse(x + R * .16, y + hS + R * ty * .2, R * 1.1, R * ty + R * .08, 0, 0, TAU); fill(c, o.shc || 'rgba(6,10,30,.3)') }
    cylShade(c, x, y, y + hS, R, ty, body, dark);
    if (o.band) { c.save(); cylBand(c, x, y, y + hS, R, ty); c.clip(); c.fillStyle = o.band; c.fillRect(x - R, y + hS * .2, R * 2, Math.max(3, hS * .16)); c.restore() }
    if (o.label) {   // наклейка на боку: «СНЮС» от руки
      const top = y + R * ty + sk, bot = y + hS + R * ty, lh = Math.min((bot - top) * .7, R * .52), lw = R * 1.08, cy = (top + bot) / 2;
      c.save(); cylBand(c, x, y, y + hS, R, ty); c.clip(); c.translate(x, cy); c.rotate(-.035);
      rr(c, -lw / 2, -lh / 2, lw, lh, lh * .12); fill(c, o.labelBg || '#F2D04B'); c.fillStyle = 'rgba(20,20,40,.14)'; c.fillRect(R * .3, -lh / 2, lw / 2 - R * .3 + 2, lh);
      rr(c, -lw / 2, -lh / 2, lw, lh, lh * .12); lnB(c, 1.5, 'rgba(120,90,20,.45)'); hand5(c, o.label, 0, -lh * .02, lh * .64, o.labelC || '#2A1E14'); c.restore();
    }
    if (lid <= 0) {   // закрыта
      lid5(c, x, y, R * 1.01, ty, sk, capC, dark, o);
      cylBand(c, x, y, y + hS, R, ty); lnB(c, Math.max(1, R * .012), 'rgba(238,241,248,.5)');
      return;
    }
    // открыта: срез — ободок, стенка, подушечки по кругу (сзади — раньше)
    c.beginPath(); c.ellipse(x, y, R, R * ty, 0, 0, TAU); fill(c, dark ? '#2E2621' : lit(body, .4));
    c.save(); c.beginPath(); c.ellipse(x, y, R * .93, R * ty * .93, 0, 0, TAU); c.clip(); fill(c, dark ? '#1C1714' : '#D3D7E0');
    const d = Math.min(hS * .16, R * .1); c.beginPath(); c.ellipse(x, y + d, R * .93, R * ty * .93, 0, 0, TAU); fill(c, dark ? '#251E1A' : '#E4E7EE');
    const n = o.n ?? 9, skip = o.skip ?? -1, P = [];
    for (let k = 0; k < n; k++) { if (k === skip) continue; const al = Math.PI / 2 + k * TAU / n; P.push([al, x + Math.cos(al) * R * .56, y + d + Math.sin(al) * R * .56 * ty]) }
    P.sort((p1, p2) => Math.sin(p1[0]) - Math.sin(p2[0]));
    const back = P.filter(p => Math.sin(p[0]) < 0), front = P.filter(p => Math.sin(p[0]) >= 0);
    back.forEach(([al, px, py]) => pouchP(c, px, py, R * .46, R * .29, al + Math.PI / 2, dark, ty, { dots: o.dots }));
    if (o.center !== false && n >= 7) pouchP(c, x, y + d, R * .46, R * .29, .35, dark, ty, { dots: o.dots });
    front.forEach(([al, px, py]) => pouchP(c, px, py, R * .46, R * .29, al + Math.PI / 2, dark, ty, { dots: o.dots }));
    c.restore();
    c.beginPath(); c.ellipse(x, y, R * .93, R * ty * .93, 0, Math.PI, TAU); lnB(c, Math.max(1, R * .02), dark ? 'rgba(0,0,0,.5)' : 'rgba(90,100,125,.35)');
    cylBand(c, x, y, y + hS, R, ty); lnB(c, Math.max(1, R * .012), 'rgba(238,241,248,.5)');
    if (lid < 1) {   // крышка: сначала поднимается, потом уходит вверх-вправо и гаснет
      const up = eo(cl(lid / .3)), go = ei(at(lid, .25, 1)), lx = x + R * 3.2 * go, ly = y - R * .55 * up - R * 3.4 * go, al = 1 - at(lid, .88, 1);   // v22.2: крышка быстро уходит за край кадра, а не тает посреди
      if (al > 0) { c.save(); c.globalAlpha *= al; c.translate(lx, ly); c.rotate(.5 * go); lid5(c, 0, 0, R * 1.01, ty, sk, capC, dark, o); c.restore() }
    }
  }
  // ценник: бирка на нитке, барабан внизу; drum 0..1 — сколько насчитал (по времени кадра FT — цифры не двоятся)
  function priceTag(c, x, y, s, k, drum) {
    c.save(); c.translate(x, y); c.scale(s, s);
    poly(c, [-150, -46, 120, -46, 160, 0, 120, 46, -150, 46]); fill(c, 'rgba(0,0,0,.25)');
    c.translate(-6, -8); poly(c, [-150, -46, 120, -46, 160, 0, 120, 46, -150, 46]); fill(c, '#F4EAD4'); poly(c, [-150, -46, 120, -46, 160, 0, 120, 46, -150, 46]); lnB(c, 3, '#3A2A1A');
    circ(c, 124, 0, 9, '#3A2A1A'); circ(c, 124, 0, 5, '#F4EAD4');
    tx(c, OBJ.pm, -14, -14, { f: 'P', w: 700, st: 'italic', s: 30, c: '#3A2A1A' });
    if (drum > 0) { const v = Math.round(lp(1, 16, drum)); num(c, TEXT.fPrice(v), -14, 22, { f: 'M', w: 800, s: 30, c: '#B3352B' }) }
    else tx(c, '$ —', -14, 22, { f: 'M', w: 800, s: 30, c: 'rgba(58,42,26,.4)' });
    c.restore();
  }
  function oceanSky(c, t) {
    vgrad(c, -600, -900, 2300, 1720, [C5.sky0, C5.sky1, C5.sky2]);
    for (let i = 0; i < 70; i++) { const x = -400 + H1(i * 3.1) * 1900, y = -700 + H1(i * 5.7) * 1380, a = .35 + .5 * Math.abs(Math.sin(t * (.8 + H1(i)) + i)); circ(c, x, y, 1.6 + H1(i * 9) * 1.8, `rgba(255,248,225,${a})`) }
    glow(c, 820, 330, 260, '#F4EBD0', .22); circ(c, 820, 330, 70, C5.moon); circ(c, 800, 312, 70, 'rgba(255,255,255,.18)'); circ(c, 842, 352, 14, 'rgba(160,150,120,.25)'); circ(c, 800, 360, 9, 'rgba(160,150,120,.22)');
  }
  // v22.2: берег США вместо «гор-треугольников» — город с огнями на горизонте (два ряда домов разной высоты, окна, красные огни на крышах, маяк)
  let SKY5 = null;
  function skyline5() {
    if (SKY5) return SKY5; const B = [];
    for (const [row, y0, hMin, hMax, wMin, wMax, col] of [[0, 812, 50, 200, 46, 120, '#1A2452'], [1, 816, 14, 74, 30, 86, '#0E1430']]) {
      let x = -460, k = 0; while (x < 1600) { const w = wMin + H1(k * 3.7 + row * 11) * (wMax - wMin), h = hMin + Math.pow(H1(k * 5.1 + row * 7), 1.6) * (hMax - hMin);
        B.push({ row, x, w, h, y0, col, seed: k * 13 + row * 97 }); x += w + (row ? 2 : 8 + H1(k) * 30); k++ } }
    return (SKY5 = B);
  }
  function oceanShore(c, t) {   // горизонт y 812: дома, окна, огни на крышах; под берегом — дрожащие отражения огней
    c.fillStyle = '#10163A'; c.fillRect(-700, 806, 2600, 40);
    for (const b of skyline5()) { c.fillStyle = b.col; c.fillRect(b.x, b.y0 - b.h, b.w, b.h + 30);
      if (b.row === 0) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(b.x + b.w * .7, b.y0 - b.h, b.w * .3, b.h) }
      for (let yy = b.y0 - b.h + 8; yy < b.y0 - 6; yy += 11) for (let xx = b.x + 5; xx < b.x + b.w - 6; xx += 9) { const r = H1(b.seed + xx * .37 + yy * 1.13); if (r > (b.row ? .3 : .38)) continue;
        c.fillStyle = `rgba(255,${r > .2 ? 214 : 236},${r > .2 ? 130 : 190},${.5 + .45 * Math.abs(Math.sin(t * .7 + r * 40))})`; c.fillRect(xx, yy, 4, 5) }
      if (b.row === 0 && b.h > 150) { const on = Math.sin(t * 3 + b.seed) > .2; circ(c, b.x + b.w / 2, b.y0 - b.h - 6, 4, on ? '#FF4B4B' : 'rgba(255,75,75,.25)'); if (on) glow(c, b.x + b.w / 2, b.y0 - b.h - 6, 22, '#FF4B4B', .5) } }
    // маяк слева
    c.fillStyle = '#E9E4DA'; poly(c, [6, 812, 30, 812, 26, 700, 10, 700]); c.fill(); c.fillStyle = '#C9373F'; poly(c, [8, 770, 28, 770, 27, 745, 9, 745]); c.fill();
    c.fillStyle = '#1D2340'; c.fillRect(6, 688, 24, 14); const lb = .6 + .4 * Math.sin(t * 2.2); glow(c, 18, 694, 90, '#FFE7B0', .55 * lb); circ(c, 18, 694, 6, '#FFF3D0');
    for (let i = 0; i < 70; i++) { const x = -600 + H1(i * 2.9) * 2200, y = 846 + H1(i * 4.3) * 40, w = 8 + 14 * H1(i * 6.1), a = .2 + .3 * Math.abs(Math.sin(t * 1.8 + i));
      c.fillStyle = `rgba(255,210,122,${a})`; c.fillRect(x - w / 2 + Math.sin(t * 2 + i) * 3, y, w, 2.5) }
    glow(c, 540, 812, 900, '#FFD27A', .05);
  }
  // v22.2: каменный причал на среднем плане (слой .7) — фонари, будка, шлагбаум на опоре на причале (на суше); up 0..1 — стрела поднята
  const QY = 884, QX0 = 300, QX1 = 1760, BPX = 900, BARL = 420, QW = 58, QD = 24;
  function quay5(c, t, up) {
    for (let i = 0; i < 8; i++) { const lx = 380 + i * 190; if (lx > BPX - 30 && lx < BPX + 150) continue; for (let j = 0; j < 7; j++) { const yy = QY + QW + 6 + j * 13, w = 22 - j * 2.2 + 6 * Math.sin(t * 2.6 + i * 1.7 + j);   // отражения фонарей
      c.fillStyle = `rgba(255,210,122,${.34 - j * .045})`; c.fillRect(lx - w / 2, yy, w, 3) } }
    poly(c, [QX0, QY, QX1, QY, QX1, QY + QW, QX0 + 10, QY + QW]); fill(c, '#283055');   // лицевая стена из камня
    c.fillStyle = 'rgba(0,0,0,.24)'; for (let x = QX0 + 26; x < QX1; x += 72) c.fillRect(x, QY + 3, 3, 26); for (let x = QX0 + 62; x < QX1; x += 72) c.fillRect(x, QY + 31, 3, 26); c.fillRect(QX0 + 4, QY + 29, QX1 - QX0, 2);
    c.fillStyle = 'rgba(255,255,255,.07)'; c.fillRect(QX0 + 10, QY + QW - 7, QX1 - QX0, 7);
    poly(c, [QX0 + 22, QY - QD, QX1, QY - QD, QX1, QY, QX0, QY]); fill(c, '#3A4370'); c.fillStyle = 'rgba(255,255,255,.16)'; c.fillRect(QX0 + 22, QY - QD, QX1 - QX0, 2);   // настил
    c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(QX0, QY - 2, QX1 - QX0, 2);
    for (let i = 0; i < 8; i++) { const lx = 380 + i * 190; if (lx > BPX - 30 && lx < BPX + 150) continue;   // фонари
      c.fillStyle = '#1B2140'; c.fillRect(lx - 3, QY - QD - 104, 6, 96); c.fillRect(lx - 9, QY - QD - 10, 18, 6); c.fillRect(lx - 12, QY - QD - 110, 24, 5);
      glow(c, lx, QY - QD - 100, 80, '#FFD27A', .42 + .08 * Math.sin(t * 3 + i)); circ(c, lx, QY - QD - 100, 8, '#FFE7B0') }
    // будка и шлагбаум
    c.save(); c.translate(BPX + 78, QY - QD + 4); c.scale(1.15, 1.15); castDots(c, -46, -4, 92, 8, 40, { k: .6 });
    rr(c, -46, -86, 92, 86, 4); fill(c, '#2F3866'); c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(20, -86, 26, 86); rr(c, -52, -98, 104, 16, 4); fill(c, '#1B2140');
    rr(c, -34, -70, 46, 32, 3); fill(c, '#FFE7B0'); glow(c, -11, -54, 70, '#FFE7B0', .35); c.fillStyle = '#2F3866'; c.fillRect(-13, -70, 4, 32); c.restore();
    c.save(); c.translate(BPX, QY - QD + 6); c.scale(1.2, 1.2);
    rr(c, -9, -70, 18, 70, 4); fill(c, '#D9DEE8'); c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(2, -70, 7, 70); rr(c, -16, -6, 32, 8, 3); fill(c, '#1B2140');
    c.save(); c.translate(0, -60); c.rotate(-Math.PI / 2 * .9 * up);
    rr(c, -BARL, -9, BARL, 18, 7); fill(c, '#F2EEE6'); c.save(); rr(c, -BARL, -9, BARL, 18, 7); c.clip(); for (let i = 0; i < 8; i++) { c.fillStyle = '#D6334D'; c.fillRect(-BARL + i * 50, -9, 25, 18) } c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-BARL, 3, BARL, 6); c.restore();
    rr(c, -BARL, -9, BARL, 18, 7); lnB(c, 2, 'rgba(20,23,51,.45)'); const bl = Math.sin(t * 5) > 0; circ(c, -BARL + 12, 0, 6, bl ? '#FF4B4B' : '#8A2A33'); if (bl) glow(c, -BARL + 12, 0, 26, '#FF4B4B', .5);
    c.restore(); circ(c, 0, -60, 11, '#F2EEE6'); circ(c, 0, -60, 4.5, '#2A2F4A'); c.restore();
  }
  function barArm(t, up, d) {   // точка на стреле на расстоянии d от опоры (координаты слоя причала)
    const an = -Math.PI / 2 * .9 * up, px = BPX, py = QY - QD + 6 - 60 * 1.2; return [px - d * 1.2 * Math.cos(an), py - d * 1.2 * Math.sin(an)];
  }
  function seaRows(c, t, y0, y1, n, zone) {   // волны рядами: дальние светлее и мельче
    for (let i = 0; i < n; i++) { const u = i / (n - 1), y = lp(y0, y1, Math.pow(u, 1.6)), A = lp(4, 26, u), Lw = lp(60, 260, u), sp = lp(.6, 1.6, u), col = mixc(C5.sea2, C5.sea0, u);
      c.beginPath(); c.moveTo(-700, y + 400); for (let x = -700; x <= 1800; x += 20) c.lineTo(x, y + A * Math.sin(x / Lw * TAU * .5 + t * sp + i * 1.3)); c.lineTo(1800, y + 400); c.closePath(); fill(c, col);
      c.beginPath(); for (let x = -700; x <= 1800; x += 20) { const yy = y + A * Math.sin(x / Lw * TAU * .5 + t * sp + i * 1.3); x === -700 ? c.moveTo(x, yy) : c.lineTo(x, yy) } lnB(c, lp(1.2, 3, u), `rgba(201,220,242,${lp(.18, .45, u)})`);
      if (zone && u > .2) for (let j = 0; j < 6; j++) { const x = 820 + (H1(i * 7 + j) - .5) * lp(40, 220, u), w = lp(10, 46, u); c.fillStyle = `rgba(255,236,190,${.25 + .35 * Math.abs(Math.sin(t * 3 + i + j))})`; c.fillRect(x - w / 2, y - 2, w, 3) } }
  }
  function sand(c, t, k) {   // мокрый песок поднимается снизу, пена кромкой
    if (k <= 0) return; const y = lp(2100, 1330, eio(k));
    c.beginPath(); c.moveTo(-700, y); for (let x = -700; x <= 1800; x += 30) c.lineTo(x, y + 18 * Math.sin(x / 140 + t * 1.2)); c.lineTo(1800, 2600); c.lineTo(-700, 2600); c.closePath(); fill(c, C5.sand);
    c.beginPath(); for (let x = -700; x <= 1800; x += 30) { const yy = y + 18 * Math.sin(x / 140 + t * 1.2); x === -700 ? c.moveTo(x, yy) : c.lineTo(x, yy) } lnB(c, 8, 'rgba(201,220,242,.7)');
    c.fillStyle = 'rgba(255,236,190,.08)'; c.fillRect(-700, y + 30, 2500, 60);
  }
  function tinPos0(t) {   // баночка: качается на волне, на «запрета» её выносит на песок; b2 — поворачивается крышкой к нам
    const a = T0, k = eio(at(t, a.zap - .1, a.zap + 1.5)), wet = 1 - k, turn = eio(at(t, a.net - .25, a.dazhe + .3));
    const x = lp(540, 556, k) + Math.sin(t * 1.1) * 10 * wet, y = lp(1180, 1236, k) + Math.sin(t * 1.7) * 16 * wet - 20 * turn;
    return { x, y, R: lp(lp(210, 222, k), 236, turn), ty: lp(.46 + .06 * Math.sin(t * 1.7) * wet, .9, turn), r: Math.sin(t * 1.3) * .07 * wet, lid: eio(at(t, a.dazhe + .05, a.tab - .1)) };
  }
  function oceanWorld(c, t, q) {
    const a = T0, up = eio(at(t, a.zap - .05, a.zap + .7));
    layer(c, q, .15, cc => { P0(cc, .15); oceanSky(cc, t) }); layer(c, q, .35, cc => { P0(cc, .35); oceanShore(cc, t) });   // P0: дальний план при камере (540, 960, 1) — на своём месте
    layer(c, q, .55, cc => { P0(cc, .55); seaRows(cc, t, 830, 1000, 5, false) });
    layer(c, q, .7, cc => { P0(cc, .7); quay5(cc, t, up);   // ценник висит на стреле шлагбаума, пока её не подняли
      const hang = 1 - eio(at(t, a.zap - .05, a.zap + .5)); if (hang > 0 && t < a.shest) { const [hx, hy] = barArm(t, up, 260); cc.save(); cc.globalAlpha *= hang; const sw = Math.sin(t * 2.2) * .08; cc.translate(hx, hy + 8); cc.rotate(sw);
        cc.beginPath(); cc.moveTo(0, 0); cc.lineTo(0, 62); lnB(cc, 2, 'rgba(244,234,212,.8)'); priceTag(cc, 0, 98, .62 * eo(at(t, a.fil - .1, a.fil + .3)), 1, 0); cc.restore() } });
    layer(c, q, 1, cc => seaRows(cc, t, 1000, 1500, 6, false));
    layer(c, q, 1, cc => sand(cc, t, at(t, a.zap, a.zap + 1.6)));
    layer(c, q, 1, cc => { const p = tinPos0(t);
      cc.save(); cc.translate(p.x, p.y); cc.rotate(p.r); tin5(cc, 0, 0, p.R, p.ty, p.lid, { skip: t > a.fly ? 1 : -1, shc: 'rgba(4,8,26,.4)' }); cc.restore();
      // волна перед баночкой — пока её не вынесло на песок
      const wet = 1 - at(t, a.zap + .2, a.zap + 1.2); if (wet > 0) { cc.save(); cc.globalAlpha *= wet; cc.beginPath(); cc.moveTo(-700, 2400);
        for (let x = -700; x <= 1800; x += 20) cc.lineTo(x, 1330 + 30 * Math.sin(x / 160 + t * 1.7)); cc.lineTo(1800, 2400); cc.closePath(); fill(cc, C5.sea0);
        cc.beginPath(); for (let x = -700; x <= 1800; x += 20) { const yy = 1330 + 30 * Math.sin(x / 160 + t * 1.7); x === -700 ? cc.moveTo(x, yy) : cc.lineTo(x, yy) } lnB(cc, 5, 'rgba(201,220,242,.55)'); cc.restore() }
      // ценник лёг на баночку: барабан до $16 млрд — досчитывает к «миллиардов» (по времени кадра FT)
      if (t >= a.shest - .35) { const k = eo(at(t, a.shest - .35, a.shest + .1)), out = at(t, a.dazhe - .3, a.dazhe + .1); if (out < 1) { cc.save(); cc.globalAlpha *= 1 - out;
        priceTag(cc, p.x + lp(120, 40, k), p.y + lp(-420, -150, k), lp(.62, 1, k), 1, eo(at(FT, a.za - .05, a.mlrdA))); cc.restore() } }
      leaf5(cc, t, p.x, p.y - p.R * .95);
    });
  }
  function leaf5(c, t, x, y) {   // лист табака над открытой баночкой — перечёркивается и тает
    const a = T0, k = at(t, a.dazhe - .1, a.dazhe + .25), out = at(t, a.fly - .1, a.fly + .2); if (k <= 0 || out >= 1) return;
    c.save(); c.translate(x, y); c.globalAlpha *= Math.min(1, k * 2) * (1 - out); const s = lp(1.6, 2.2, eo(k)); c.scale(s, s);
    c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-26, 10, -22, -22, 0, -36); c.bezierCurveTo(22, -22, 26, 10, 0, 30); fill(c, 'rgba(110,139,61,.35)');
    c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-26, 10, -22, -22, 0, -36); c.bezierCurveTo(22, -22, 26, 10, 0, 30); lnB(c, 2.6, '#C9E29A'); c.beginPath(); c.moveTo(0, 30); c.lineTo(0, -30); lnB(c, 1.6, '#C9E29A');
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(0, 12 - i * 13); c.lineTo(sd * 13, 2 - i * 13); lnB(c, 1.2, '#C9E29A') }
    const kx = eo(at(t, a.tab - .1, a.tab + .15)); if (kx > 0) { c.beginPath(); c.moveTo(-30, 34); c.lineTo(lp(-30, 30, kx), lp(34, -38, kx)); lnB(c, 5, '#E2412F') }
    c.restore();
  }
  // подушечка, которая вылетает из баночки к камере (экранные координаты): от места в баночке до середины кадра, растёт и ложится плашмя
  function flyPouch(t, q) {
    const a = T0, k = eio(at(t, a.fly, T0.sw)), p = tinPos0(a.fly);
    const al = Math.PI / 2 + 1 * TAU / 9, wx = p.x + Math.cos(al) * p.R * .56, wy = p.y + Math.sin(al) * p.R * .56 * p.ty;
    const sx = (wx - q.x) * q.z + 540, sy = (wy - q.y) * q.z + 960, w0 = p.R * .4 * q.z, h0 = p.R * .26 * q.z * p.ty;
    return { x: lp(sx, 540, k), y: lp(sy, 1190, k) - 240 * Math.sin(Math.PI * k), w: lp(w0, 760, k), h: lp(h0, 240, k), r: lp(.55, 0, k), k };
  }
  function oceanShot(c, t) {
    const q = camObj(camAt(K0, t)); oceanWorld(c, t, q);
    capS(c, TEXT.notob, 540, 330, at(t, T0.tab - .05, T0.tab + .25) * (1 - at(t, T0.fly + .2, T0.fly + .45)), { s: 56 });
    if (t >= T0.fly) { const f = flyPouch(t, q); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.translate(f.x, f.y); c.rotate(f.r);
      castDots(c, -f.w / 2, f.h * .2, f.w, f.h * .4, 60 + f.k * 60, {}); pouchP(c, 0, 0, f.w, f.h, 0, false, 1); c.restore() }
  }
  // ================= мир 1: переговорная → салон самолёта (строки 1–2) =================
  // Стык с океаном: подушечка долетает до середины кадра, фоны уезжают вверх (океан) и приходят снизу (офис), подушечка без белого кадра
  // расплющивается в светлую столешницу (flubber). Над главной фигуркой гаснут глаз / ухо / нос; на «пакетик» — фигурка в профиль, на «губу» —
  // полоса рентгена: под верхней губой белый прямоугольник. Строка 2: линза сканера — десна, жёлтые точки никотина уходят в сосуд; отъезд, призраки
  // сигареты с дымом и одноразки с паром перечёркнуты; окно скругляется в иллюминатор (flubber), офис уходит вниз, кресло становится креслом самолёта,
  // загорается табло ремней. Нырок в иллюминатор — мир 2 (облака → Швеция), вложен в иллюминатор (N2).
  let T1 = null, K1 = null;
  const WIN1 = { x: 760, y: 600 }, WIN1B = { x: 840, y: 960 }, N2 = { x: 840, y: 960, m: .188 }, HEAD1 = { x: 1012, y: 1028, R: 54 }, PEL1 = [1010, 1300];
  const TABLE1 = [[70, 1110], [830, 1110], [900, 1270], [-20, 1270]];   // главная фигурка сидит в торце стола справа, колени — под столом
  function officeInit() {
    const w1 = q => Ws('s1', q), w2 = q => Ws('s2', q);
    T1 = { s1: SA('s1'), vid: w1('видно'), sly: w1('слышно'), pah: w1('пахнут'), pak: w1('пакетик'), gub: w1('губу'), vse: w1('всё'),
      s2: SA('s2'), shch: w2('щиплет'), nik: w2('никотин'), krov: w2('кровь'), nee: w2('неё'), stor: w2('стороны'), zam: w2('заметно'),
      dym: w2('дыма'), par: w2('пара'), sov: w2('совещании'), sam: w2('самолёте'), s3: SA('s3') };
    const a = T1; a.sw = T0.sw; a.mEnd = a.s1 + .3; a.cab0 = a.sov + .1; a.cab1 = a.cab0 + 1.35; a.dive = a.s3 + .35;   // v22.2: окно → иллюминатор за 1,35 с; нырок раньше — подлёт к домику длиннее
    K1 = [KY(a.sw, 540, 960, 1.0), KY(a.s1 + 1.0, 590, 980, 1.04), KY(a.pah, 680, 980, 1.1), KY(a.pak + .1, 950, 1000, 1.75), KY(a.gub, 975, 1028, 2.3),
      KY(a.shch, 952, 1050, 3.3), KY(a.krov + .3, 950, 1034, 3.4), KY(a.stor, 930, 1010, 3.0), KY(a.zam + .2, 560, 1000, 1.05), KY(a.par + .2, 590, 990, 1.08),
      KY(a.cab0, 760, 1010, 1.18), KY(a.cab1, 840, 1000, 1.45), KY(a.dive - .3, 844, 985, 2.1), KY(a.dive, N2.x, N2.y, 1 / N2.m)];
  }
  const kCab = t => eio(at(t, T1.cab0, T1.cab1));
  const tableShape = () => { const o = []; const P = TABLE1; for (let s = 0; s < 4; s++) { const A0 = P[s], B0 = P[(s + 1) % 4]; for (let i = 0; i < 30; i++) o.push([lp(A0[0], B0[0], i / 30), lp(A0[1], B0[1], i / 30)]) } return o };
  let TBL = null;
  function officeWall(c, t, kc) {
    c.fillStyle = mixc(C5.office, C5.cabin, kc); c.fillRect(-900, -1200, 2900, 2500);
    c.fillStyle = mixc(C5.officeD, '#8E8A9C', kc); c.fillRect(-900, 1300, 2900, 1400);   // пол
    c.fillStyle = 'rgba(0,0,0,.05)'; for (let x = -900; x < 2000; x += 240) c.fillRect(x, -1200, 6, 2500);
    if (kc > 0) {   // салон: потолочные панели и полоса багажных полок
      c.save(); c.globalAlpha *= kc; c.fillStyle = '#C9C4BA'; c.fillRect(-900, 260, 2900, 120); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-900, 372, 2900, 6);
      for (let x = -900; x < 2000; x += 300) { c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(x, 260, 4, 120) } c.restore() }
  }
  function cityView(c, t, dy) {   // вид из окна переговорной: дневной город (уезжает вниз, когда «самолёт» взлетает)
    c.save(); c.translate(0, dy); vgrad(c, 300, 200, 900, 800, ['#BFD9EE', '#E4EFF7']);
    for (let i = 0; i < 9; i++) { const x = 440 + i * 70 + (H1(i) - .5) * 20, h = 160 + H1(i * 3.3) * 260, w = 54 + H1(i * 1.7) * 30; c.fillStyle = i % 2 ? C5.city : C5.cityD; c.fillRect(x, 940 - h, w, h + 400);
      c.fillStyle = 'rgba(255,255,255,.35)'; for (let yy = 940 - h + 14; yy < 930; yy += 26) for (let xx = x + 8; xx < x + w - 8; xx += 16) c.fillRect(xx, yy, 7, 10) }
    c.restore();
  }
  function winShape(t) { const k = kCab(t), P = morph('w2p', shRR(560, 560, 16), shRR(300, 440, 150))(k), cx = lp(WIN1.x, WIN1B.x, k), cy = lp(WIN1.y, WIN1B.y, k); return P.map(([x, y]) => [x + cx, y + cy]) }
  function officeWindow(c, t) {
    const k = kCab(t), P = winShape(t), cx = lp(WIN1.x, WIN1B.x, k), cy = lp(WIN1.y, WIN1B.y, k), F = P.map(([x, y]) => [cx + (x - cx) * 1.12, cy + (y - cy) * 1.12]);
    castDots(c, cx - 200, cy - 230, 400, 470, 90, { k: .6 * (1 - k) }); pathOf(c, F); fill(c, mixc('#F7F5F0', '#E9E6DE', k)); pathOf(c, F); lnB(c, 3, 'rgba(20,23,51,.25)');
    c.save(); pathOf(c, P); c.clip();
    inNest(c, N2, cc => swedenWorld(cc, t, true));   // облака мира 2 — за иллюминатором
    if (k < 1) cityView(c, t, 900 * eio(k));
    if (k < .6) { c.save(); c.globalAlpha *= 1 - at(k, 0, .6); c.fillStyle = '#F7F5F0'; c.fillRect(cx - 6, cy - 300, 12, 600); c.fillRect(cx - 300, cy - 6, 600, 12); c.restore() }   // переплёт уходит
    c.fillStyle = 'rgba(255,255,255,.12)'; poly(c, [cx - 200, cy + 300, cx - 120, cy + 300, cx + 60, cy - 300, cx - 20, cy - 300]); c.fill();
    c.restore(); pathOf(c, P); lnB(c, 3, 'rgba(20,23,51,.3)');
  }
  function seatedFront(c, x, y, s, col) { fig(c, x, y, s, { m: 1, col }) }
  function mainPose(t) {   // главная фигурка сидит в профиль, лицом влево (поза в своей системе: «вперёд» = +x, потом зеркало вокруг x = 960)
    const kc = kCab(t), br = Math.sin(t * 1.4) * .012, [px, py] = PEL1;
    return { s: 1.5, pel: [px, py], lean: -.03 + br - .08 * kc, neck: -.06, shL: lp(1.05, .55, kc), elL: lp(.85, 1.25, kc), shR: lp(1.15, .5, kc), elR: lp(.8, 1.3, kc),
      ankL: [px + 160, py + 236], ankR: [px + 140, py + 236], ftL: 0, ftR: 0 };
  }
  function chair1(c, t) {   // кресло: офисное → кресло самолёта (спинка выше, с подголовником, синяя обивка)
    const k = kCab(t), [px, py] = PEL1, back = morph('chair', shRR(70, 230, 14), shRR(170, 460, 40))(k).map(([x, y]) => [x + px + 62 + 30 * k, y + lp(py - 115, py - 200, k)]);
    pathOf(c, back); fill(c, mixc('#3A3F55', C5.seat, k)); c.save(); pathOf(c, back); c.clip(); c.fillStyle = mixc('#2C3045', C5.seatD, k); c.fillRect(px + 92 + 30 * k, py - 700, 200, 900); c.restore(); pathOf(c, back); lnB(c, 3, B2.ln);
    rr(c, px - 100, py - 10, 230, lp(30, 60, k), 14); fill(c, mixc('#3A3F55', C5.seat, k)); rr(c, px - 100, py - 10, 230, lp(30, 60, k), 14); lnB(c, 3, B2.ln);
    if (k < 1) { c.save(); c.globalAlpha *= 1 - k; rr(c, px + 5, py + 20, 18, 190, 6); fill(c, '#2C3045'); rr(c, px - 80, py + 206, 190, 14, 6); fill(c, '#2C3045'); c.restore() }
  }
  function officeTable(c, t, drop, part) {   // стол и три фигурки за ним; drop — за первые 45 % окна → иллюминатора тают и чуть оседают (без смаза в движении)
    const g = at(drop, 0, .45); if (g >= 1) return; c.save(); c.translate(0, 70 * eo(g)); c.globalAlpha *= 1 - eio(g);
    if (part === 'back') { [[200, '#EDE7DA'], [400, '#F4F1EA'], [600, '#E8E2D4']].forEach(([x, col], i) => { const by = Math.sin(t * 1.2 + i) * 3; seatedFront(c, x, 1222 + by, 2.0, col) }); c.restore(); return }
    const kf = eo(at(t, T1.mEnd - .05, T1.mEnd + .3));   // кромка и ножки вырастают, когда подушечка стала столешницей
    if (kf > 0) { poly(c, [-20, 1270, 900, 1270, 900, 1270 + 42 * kf, -20, 1270 + 42 * kf]); fill(c, C5.tableE); for (const x of [30, 846]) { rr(c, x, 1300, 26, 272 * kf, 6); fill(c, C5.tableE) } }
    if (t >= T1.mEnd) { if (!TBL) TBL = tableShape(); celPts(c, TBL, C5.table, { sw: .12, ha: .3 }) }
    c.restore();
  }
  function icon5(c, kind, x, y, k, kx, sc = 1) {   // значок в белом круге; kx — красная черта; sc — размер
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(bo(k) * sc, bo(k) * sc); circ(c, 4, 6, 52, 'rgba(0,0,0,.25)'); circ(c, 0, 0, 52, '#F7F5F0'); ring(c, 0, 0, 52, B2.navy, 3);
    c.strokeStyle = B2.navy; c.lineWidth = 6; c.lineCap = 'round'; c.lineJoin = 'round';
    if (kind === 'eye') { c.beginPath(); c.moveTo(-30, 0); c.quadraticCurveTo(0, -26, 30, 0); c.quadraticCurveTo(0, 26, -30, 0); c.stroke(); circ(c, 0, 0, 9, B2.navy) }
    else if (kind === 'ear') { c.beginPath(); c.moveTo(-10, 26); c.bezierCurveTo(-30, 10, -22, -30, 4, -28); c.bezierCurveTo(28, -26, 26, 4, 8, 12); c.bezierCurveTo(0, 18, 4, 26, -4, 30); c.stroke(); c.beginPath(); c.moveTo(-2, -8); c.quadraticCurveTo(10, -14, 12, -2); c.stroke() }
    else if (kind === 'nose') { c.beginPath(); c.moveTo(-4, -30); c.quadraticCurveTo(-8, 4, -22, 16); c.quadraticCurveTo(-6, 26, 10, 18); c.stroke(); c.beginPath(); c.moveTo(14, -10); c.quadraticCurveTo(24, -6, 22, 2); c.stroke() }
    else if (kind === 'cig') { rr(c, -34, -7, 68, 14, 4); stroke(c, B2.navy, 4); c.fillStyle = '#E8A35A'; c.fillRect(14, -7, 20, 14) }
    else if (kind === 'vape') { rr(c, -10, -32, 20, 64, 8); stroke(c, B2.navy, 4); c.fillStyle = '#7CC4E0'; c.fillRect(-10, 6, 20, 26) }
    if (kx > 0) { c.beginPath(); c.moveTo(-36, 36); c.lineTo(lp(-36, 36, eo(kx)), lp(36, -36, eo(kx))); c.strokeStyle = '#D6334D'; c.lineWidth = 9; c.stroke() }
    c.restore();
  }
  // v22.2 (ТЗ Gemini): вместо «черепа» и «клавиш с трубочкой» — рентген лица в профиль (тонкие светлые линии, как горло в главе 1):
  // губа, десна, резец, кость; белый пакетик лежит между верхней губой и десной; на «щиплет» — покалывание, на «никотин» — жёлтые частицы
  // проходят сквозь слизистую десны в тонкую сеть капилляров и бегут вверх. Панель растёт из головы фигурки и в неё же сворачивается.
  const XP = { x: 950, y: 1038, w: 245, h: 290 };
  function smoothOpen(c, P) { c.beginPath(); c.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length - 1; i++) { const mx = (P[i][0] + P[i + 1][0]) / 2, my = (P[i][1] + P[i + 1][1]) / 2; c.quadraticCurveTo(P[i][0], P[i][1], mx, my) } c.lineTo(P[P.length - 1][0], P[P.length - 1][1]) }
  const XFACE = [[176, -12], [160, 50], [112, 108], [74, 142], [78, 162], [118, 176], [150, 186], [146, 226], [128, 268], [116, 292], [134, 312], [118, 334], [128, 362], [146, 396], [142, 432], [128, 468], [150, 500], [210, 512]];
  // v22.3: макросхема десны (координаты рамки 420 × 500): сверху белая подушечка, под ней ровная розовая десна (на стыке — жёлтые уколы),
  // прямо под десной — горизонтальный сосуд, кровь течёт вправо; жёлтые точки никотина проходят сквозь розовую стенку и уходят с потоком
  function gumMacro(c, t, a) {
    const L = (w, col) => lnB(c, w, col), gy0 = 236, gy1 = 330, vy0 = 340, vy1 = 424;
    c.fillStyle = '#6E1621'; c.fillRect(-20, gy1, 470, vy1 - gy1 + 10);   // стенка сосуда
    c.fillStyle = '#C8303F'; c.fillRect(-20, vy0, 470, vy1 - vy0);
    c.fillStyle = 'rgba(255,130,140,.35)'; c.fillRect(-20, vy0 + 6, 470, 9); c.fillStyle = 'rgba(70,8,18,.35)'; c.fillRect(-20, vy1 - 14, 470, 14);
    for (let i = 0; i < 14; i++) { const x = ((t * 95 + i * 37) % 490) - 35, y = vy0 + 22 + H1(i * 2.7) * 42; c.save(); c.translate(x, y); c.scale(1, .55); circ(c, 0, 0, 11, 'rgba(140,16,32,.55)'); circ(c, 0, 0, 5, 'rgba(100,8,22,.5)'); c.restore() }   // кровь течёт
    c.fillStyle = '#E58C99'; c.fillRect(-20, gy0, 470, gy1 - gy0); c.fillStyle = '#F6B3BC'; c.fillRect(-20, gy0, 470, 8); c.fillStyle = 'rgba(160,60,75,.35)'; c.fillRect(-20, gy1 - 12, 470, 12);
    for (let i = 0; i < 40; i++) circ(c, H1(i * 3.1) * 440 - 10, gy0 + 20 + H1(i * 7.7) * (gy1 - gy0 - 36), 3 + H1(i) * 3, 'rgba(255,215,220,.35)');   // клетки слизистой
    const px0 = 60, px1 = 360, py0 = 122, py1 = gy0 + 4, pw = px1 - px0, ph = py1 - py0;   // подушечка
    c.fillStyle = 'rgba(0,0,0,.25)'; rr(c, px0 + 10, py0 + 12, pw, ph, 46); c.fill();
    rr(c, px0, py0, pw, ph, 46); fill(c, '#FFFDF8');
    c.save(); rr(c, px0, py0, pw, ph, 46); c.clip(); c.fillStyle = 'rgba(205,198,186,.5)'; c.fillRect(px0 + pw * .64, py0, pw, ph); c.fillStyle = 'rgba(255,255,255,.95)'; c.fillRect(px0 + 34, py0 + 16, pw * .42, 9); c.restore();
    c.setLineDash([8, 7]); rr(c, px0 + 13, py0 + 13, pw - 26, ph - 26, 34); L(2, 'rgba(176,166,150,.75)'); c.setLineDash([]); rr(c, px0, py0, pw, ph, 46); L(2.5, '#E8E2D6');
    const ks = at(t, a.shch - .1, a.shch + .15) * (1 - at(t, a.stor - .4, a.stor));   // «щиплет»: жёлтые уколы на стыке
    if (ks > 0) for (let i = 0; i < 9; i++) { const q = (t * 2.6 + i * .29) % 1, x = px0 + 28 + i * 31 + (H1(i * 5.3) - .5) * 12, y = gy0 + 4;
      c.save(); c.globalAlpha *= ks * Math.sin(Math.PI * q); c.beginPath(); c.moveTo(x - 10 - 6 * q, y - 7); c.lineTo(x, y + 4); c.lineTo(x + 10 + 6 * q, y - 7); c.moveTo(x, y - 15 - 8 * q); c.lineTo(x, y + 4); L(3, C5.nic); circ(c, x, y + 4, 3.5, '#FFF4C2'); c.restore() }
    if (t > a.nik - .15) for (let i = 0; i < 16; i++) { const st = a.nik - .15 + i * .11; if (t < st) continue;   // никотин: сквозь десну — в кровь и с потоком вправо
      const q = ((t - st) * .55) % 1, x0 = px0 + 30 + H1(i * 3.7) * (pw - 60); let x, y;
      if (q < .55) { const e = q / .55; x = x0 + 6 * Math.sin(e * 6 + i); y = lp(gy0 - 4, vy0 + 22, eio(e)) } else { const e = (q - .55) / .45; x = x0 + e * 230; y = vy0 + 22 + H1(i * 9.1) * 34 }
      circ(c, x, y, 11, 'rgba(255,210,63,.28)'); circ(c, x, y, 5.6, C5.nic) }
  }
  function xrayPanel(c, t) {
    const a = T1, k1 = eio(at(t, a.gub - .5, a.gub)), k2 = eio(at(t, a.stor - .15, a.stor + .35)); if (k1 <= 0 || k2 >= 1) return;
    const k = k1 * (1 - k2), h = HEAD1, W = XP.w, H = XP.h, s = W / 420;
    c.save(); c.translate(h.x, h.y); c.scale(lp(.15, 1, k), lp(.15, 1, k)); c.translate(XP.x - h.x, XP.y - h.y); c.globalAlpha *= Math.min(1, k * 1.6);
    castDots(c, -W / 2 + 8, -H / 2 + 14, W, H, 40, { k: .5 });
    rr(c, -W / 2, -H / 2, W, H, 10); fill(c, '#0E2240'); c.save(); rr(c, -W / 2, -H / 2, W, H, 10); c.clip();
    c.fillStyle = 'rgba(126,214,207,.07)'; for (let x = -W / 2; x < W / 2; x += 14) c.fillRect(x, -H / 2, 1, H); for (let y = -H / 2; y < H / 2; y += 14) c.fillRect(-W / 2, y, W, 1);
    const g = c.createRadialGradient(0, 0, W * .2, 0, 0, W * .8); g.addColorStop(0, 'rgba(60,120,200,.18)'); g.addColorStop(1, 'rgba(0,0,0,.35)'); c.fillStyle = g; c.fillRect(-W / 2, -H / 2, W, H);
    c.translate(-W / 2, -H / 2); c.scale(s, H / 500);
    const L = (w, col) => lnB(c, w, col);
    const zA = eio(at(t, a.shch - .45, a.shch - .05));   // v22.3: профиль → макросхема (наезд в пакетик) к «щиплет»
    // кадр А («кладут под верхнюю губу — и всё»): только профиль — нос, губы, подбородок; под верхней губой светится пакетик
    if (zA < 1) { c.save(); c.globalAlpha *= 1 - zA; c.translate(200, 232); c.scale(1 + 2.2 * zA, 1 + 2.2 * zA); c.translate(-200, -232);
      smoothOpen(c, XFACE); L(3.4, 'rgba(207,233,255,.95)');
      const kin = eio(at(t, a.gub - .35, a.gub + .2)), px = 197 - 46 * (1 - kin), py = 232 + 70 * (1 - kin), pul = .45 + .12 * Math.sin(t * 5);
      c.save(); c.globalAlpha *= kin; c.translate(px, py); c.rotate(-.12); glow(c, 0, 0, 56, '#FFFFFF', pul); rr(c, -11, -42, 22, 84, 10); fill(c, '#FFFDF8'); rr(c, -11, -42, 22, 84, 10); L(1.6, 'rgba(255,255,255,.9)'); c.restore();
      c.restore() }
    // кадр Б («щиплет десну, никотин уходит в кровь прямо через неё»): макросхема в два слоя — подушечка, под ней десна, ещё ниже — сосуд
    if (zA > 0) { c.save(); c.globalAlpha *= zA; c.translate(210, 270); c.scale(lp(.55, 1, zA), lp(.55, 1, zA)); c.translate(-210, -270); gumMacro(c, t, a); c.restore() }
    c.restore();
    const bl = Math.sin(t * 6) > 0; circ(c, W / 2 - 16, -H / 2 + 16, 4, bl ? '#FF4B4B' : '#7A2A33');
    c.strokeStyle = '#CFE9FF'; c.lineWidth = 2.5; const q = 18, m = 10;   // уголки рамки
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { c.beginPath(); c.moveTo(sx * (W / 2 - m), sy * (H / 2 - m - q)); c.lineTo(sx * (W / 2 - m), sy * (H / 2 - m)); c.lineTo(sx * (W / 2 - m - q), sy * (H / 2 - m)); c.stroke() }
    c.restore();
    rr(c, -W / 2, -H / 2, W, H, 10); lnB(c, 4, '#7ED6CF'); rr(c, -W / 2 - 6, -H / 2 - 6, W + 12, H + 12, 14); lnB(c, 1.5, 'rgba(126,214,207,.45)');
    c.restore();
  }
  function ghosts(c, t) {   // над столом: сигарета с дымом и одноразка с паром — призраки, перечёркнуты
    const a = T1, out = at(t, a.sov - .1, a.sov + .3);
    [[a.dym, 'cig', 330, 720], [a.par, 'vape', 760, 720]].forEach(([w, kind, x, y]) => { const k = at(t, w - .2, w + .15); if (k <= 0 || out >= 1) return;
      c.save(); c.globalAlpha *= .9 * (1 - out); const yy = y - 10 * Math.sin(t * 2);
      const puff = (px, py, r, col) => { for (let i = 0; i < 4; i++) { const u = ((t * .5 + i * .25) % 1); circ(c, px + Math.sin(i * 2 + t) * 14 * u, py - u * 90, r * (.6 + u), `rgba(${col},${.35 * (1 - u)})`) } };
      if (kind === 'cig') { puff(x + 70, yy - 20, 26, '200,200,210'); icon5(c, 'cig', x, yy, k, at(t, w + .1, w + .35), 1.6) } else { puff(x, yy - 70, 28, '220,240,255'); icon5(c, 'vape', x, yy, k, at(t, w + .1, w + .35), 1.6) }
      c.restore() });
  }
  function beltSign(c, t) {   // табло «пристегнуть ремни» на потолочной панели
    const k = kCab(t); if (k <= 0) return; const on = at(t, T1.sam - .1, T1.sam + .05);
    c.save(); c.globalAlpha *= at(k, .5, 1); c.translate(930, 560); c.scale(1.3, 1.3); c.translate(-675, -322); rr(c, 600, 290, 150, 64, 12); fill(c, '#2A2E3A'); rr(c, 610, 298, 130, 48, 9); fill(c, mixc('#3A3F4C', '#FFE8A3', on));   // v22.2: правее — плашка 2022 не налезает
    c.strokeStyle = on > .5 ? '#2A2E3A' : '#6B7080'; c.lineWidth = 5; c.lineCap = 'round'; circ(c, 650, 310, 7, c.strokeStyle); c.beginPath(); c.moveTo(650, 318); c.lineTo(650, 336); c.stroke();
    c.beginPath(); c.moveTo(672, 316); c.lineTo(712, 316); c.moveTo(672, 330); c.lineTo(712, 330); c.stroke(); rr(c, 684, 310, 16, 26, 4); c.stroke();
    if (on > 0) glow(c, 675, 322, 120, '#FFE8A3', .3 * on); c.restore();
  }
  function officeWorld(c, t, q) {
    const a = T1, kc = kCab(t);
    officeWall(c, t, kc); officeWindow(c, t); beltSign(c, t);
    const drop = at(t, a.cab0, a.cab1 - .15); officeTable(c, t, drop, 'back');
    chair1(c, t);
    const P = mainPose(t); mirrorX(c, PEL1[0], () => { castDots(c, PEL1[0] - 60, PEL1[1] + 222, 140, 14, 120, {}); drawRig(c, P) });
    officeTable(c, t, drop, 'top');
    xrayPanel(c, t); ghosts(c, t);
    [[a.vid, 'eye', 330], [a.sly, 'ear', 540], [a.pah, 'nose', 750]].forEach(([w, kind, x]) => icon5(c, kind, x, 700, at(t, w - .25, w + .1) * (1 - at(t, a.pak - .2, a.pak + .2)), at(t, w + .05, w + .35), 1.35));
  }
  function officeShot(c, t) {
    const a = T1, q = camObj(camAt(K1, t)), e = eio(at(t, a.sw, a.sw + .5));
    if (e < 1) {   // стык: океан уезжает вверх, офис приходит снизу; подушечка в середине кадра расплющивается в столешницу
      c.save(); c.translate(0, -HH * e); oceanWorld(c, t, camObj(camAt(K0, t))); c.restore();
      c.save(); c.translate(0, HH * (1 - e)); layer(c, q, 1, cc => officeWorld(cc, t, q)); c.restore();
    } else layer(c, q, 1, cc => officeWorld(cc, t, q));
    const km = eio(at(t, a.sw, a.mEnd));
    if (km < 1) {   // подушечка → столешница: в экранных координатах (камера офиса на стыке стоит в (540, 960), z = 1)
      if (!TBL) TBL = tableShape(); const f = flyPouch(a.sw, camObj(camAt(K0, a.sw)));
      const src = shRR(f.w, f.h, f.h * .38).map(([x, y]) => [x + f.x, y + f.y]), P = morph('p2t', src, TBL)(km);
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); const qq = q, sx = x => (x - qq.x) * qq.z + 540, sy = y => (y - qq.y) * qq.z + 960;
      const PS = P.map(([x, y]) => [lp(x, sx(x), km), lp(y, sy(y), km)]); celPts(c, PS, mixc(C5.pouch, C5.table, km), { sw: lp(.22, .2, km), ha: .3 }); c.restore();
    }
  }
  // ================= мир 2: за иллюминатором — облака расходятся, внизу Швеция (строка 3, начало) =================
  // Вложен в иллюминатор салона (N2). Облака закрывают кадр, на нырке расходятся в стороны; ниже — лес, озёра, красные домики (вид сверху наискосок).
  // Камера летит к домику с горящим окном и влетает в окно: за ним мир 3 — деревянный стол (N3).
  let T2 = null, K2 = null;
  const HOUSE = { x: 560, y: 2350 }, N3 = { x: 560, y: 2350, m: 1 / 40 };   // v22.2: окно крупнее (30 × 52) — домик растёт вокруг окна, без «красной шторки»
  function swedenInit() {
    const a = T1; T2 = { dive: a.dive, jw: a.dive + 1.7 };   // v22.2: подлёт 1,7 с — облака, лес, домик; последние полсекунды камера уже в центре окна
    K2 = [KY(T2.dive + .3, 548, 1260, 1.12), KY(T2.dive + .8, 556, 1960, 2.0), KY(T2.dive + 1.22, N3.x, N3.y - 4, 5.2), KY(T2.jw, N3.x, N3.y, 1 / N3.m)];
    linkK(K1, K2, N2, true);
  }
  function cloud5(c, x, y, s, a = 1) { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s);
    [[-90, 10, 70], [-30, -20, 90], [50, -5, 80], [110, 20, 55], [0, 30, 80]].forEach(([dx, dy, r]) => circ(c, dx + 6, dy + 14, r, 'rgba(120,150,190,.35)'));
    [[-90, 10, 70], [-30, -20, 90], [50, -5, 80], [110, 20, 55], [0, 30, 80]].forEach(([dx, dy, r]) => circ(c, dx, dy, r, '#FFFFFF'));
    c.fillStyle = 'rgba(200,220,240,.6)'; c.fillRect(-160, 40, 320, 50); c.restore() }
  function tree5(c, x, y, s, dark) { poly(c, [x, y - 34 * s, x - 14 * s, y, x + 14 * s, y]); fill(c, dark ? C5.forestD : C5.forest); c.fillStyle = 'rgba(0,0,0,.18)'; poly(c, [x, y - 34 * s, x + 3 * s, y, x + 14 * s, y]); c.fill() }
  function house5(c, x, y, s, lit) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(10,30,20,.3)'; c.fillRect(-46, 26, 100, 10);
    poly(c, [-50, -20, 0, -62, 50, -20]); fill(c, '#3B2A2A'); c.fillStyle = C5.red; c.fillRect(-44, -20, 88, 50); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(22, -20, 22, 50);
    c.strokeStyle = '#F4F1EA'; c.lineWidth = 3; c.strokeRect(-44, -20, 88, 50);
    c.fillStyle = '#F4F1EA'; c.fillRect(-36, -8, 18, 22); c.fillStyle = lit ? '#FFE7B0' : '#2B3A5A'; c.fillRect(-33, -5, 12, 16);
    c.restore();
  }
  function houseBig(c, t, x, y) {   // ближний домик (фасадом к камере): красные доски, белые углы, большое окно с тёплым светом — за стеклом стол (мир 3)
    c.save(); c.fillStyle = 'rgba(10,30,20,.35)'; c.fillRect(x - 70, y + 44, 150, 12);
    poly(c, [x - 74, y - 56, x, y - 108, x + 74, y - 56]); fill(c, '#3B2A2A'); poly(c, [x - 74, y - 56, x, y - 108, x + 74, y - 56]); lnB(c, 3, '#F4F1EA');
    c.fillStyle = '#4A3434'; c.fillRect(x + 30, y - 104, 14, 30);
    c.fillStyle = '#A8352B'; c.fillRect(x - 64, y - 56, 128, 102); c.fillStyle = 'rgba(0,0,0,.12)'; for (let xx = x - 60; xx < x + 64; xx += 8) c.fillRect(xx, y - 56, 1.4, 102);
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x + 40, y - 56, 24, 102); c.fillStyle = '#F4F1EA'; c.fillRect(x - 66, y - 56, 6, 102); c.fillRect(x + 60, y - 56, 6, 102);
    c.fillStyle = '#F4F1EA'; c.fillRect(x + 36, y - 8, 20, 54); c.fillStyle = '#2E3A4E'; c.fillRect(x + 39, y - 5, 14, 51);   // дверь
    glow(c, x, y, 70, '#FFE7B0', .4);
    c.fillStyle = '#F4F1EA'; c.fillRect(x - 21, y - 32, 42, 64); c.fillRect(x - 25, y + 30, 50, 5);   // рама и подоконник
    c.save(); c.beginPath(); c.rect(x - 15, y - 26, 30, 52); c.clip(); c.fillStyle = '#FFE7B0'; c.fillRect(x - 15, y - 26, 30, 52); inNest(c, N3, cc => tableWorld(cc, t)); c.restore();
    c.restore();
  }
  function swedenWorld(c, t, inPort) {
    const a = T2 || { dive: 1e9, jw: 1e9 }, part = eio(at(t, a.dive - .1, a.dive + .55));
    vgrad(c, -2000, -1500, 5200, 2800, ['#6FA3DA', '#A9CDEE', '#DCEBF7']);
    // земля: лес, озёра, красные домики (с высоты, наискосок)
    c.fillStyle = '#3E6B45'; c.fillRect(-2000, 1300, 5200, 3000);
    const V = c.getTransform ? null : null;
    for (let i = 0; i < 9; i++) { const lx = -600 + H1(i * 3.3) * 2400, ly = 1450 + H1(i * 5.1) * 1300; c.beginPath(); c.ellipse(lx, ly, 120 + H1(i) * 160, 40 + H1(i * 2) * 50, 0, 0, TAU); fill(c, C5.lake);
      c.beginPath(); c.ellipse(lx - 20, ly - 8, 60, 10, 0, 0, TAU); fill(c, 'rgba(255,255,255,.3)') }
    for (let r = 0; r < 26; r++) for (let i = 0; i < 30; i++) { const x = -700 + i * 80 + (r % 2) * 40 + (H1(r * 31 + i) - .5) * 30, y = 1330 + r * 70 + (H1(r + i * 7) - .5) * 20;
      if (Math.abs(x - HOUSE.x) < 190 && Math.abs(y - HOUSE.y) < 150) continue; if (H1(r * 13.7 + i * 2.1) < .82) tree5(c, x, y, .9 + .02 * r, H1(i + r) > .5) }
    [[-120, 1720, .9], [900, 1600, .8], [260, 2050, 1], [1180, 2240, 1.1], [-260, 2520, 1.1], [980, 2700, 1.2]].forEach(([x, y, s]) => house5(c, x, y, s, false));
    houseBig(c, t, HOUSE.x, HOUSE.y);   // окно домика: за ним мир 3 (стол), он виден, когда камера подлетает
    // облака: закрывают кадр за иллюминатором, на нырке расходятся
    [[-140, 760, 1.6, -1], [360, 640, 2.0, -1], [820, 800, 1.7, 1], [1240, 680, 1.9, 1], [140, 1080, 2.2, -1], [700, 1150, 2.4, 1], [1100, 1240, 1.8, 1], [-300, 1240, 1.9, -1], [420, 900, 2.6, 1]].forEach(([x, y, s, d], i) =>
      cloud5(c, x + d * 900 * part + Math.sin(t * .3 + i) * 12, y + 160 * part, s * (1 + .3 * part), 1));
  }
  function swedenShot(c, t) { const q = camObj(camAt(K2, t)); layer(c, q, 1, cc => swedenWorld(cc, t, false)) }
  // ================= мир 3: шведский стол → макет фабрики под стеклянными куполами → заправка в США → улица (строки 3–6) =================
  // Один мир, камера едет по столу слева направо: баночки (строка 3) → сканер и пресс, змеевик, колба (строка 4) → макет шведской фабрики,
  // пачка Marlboro, купола (строка 5). На «снюс смели» шар с заводом Кентукки трескается, камера падает за банками вниз — в магазин на заправке
  // (коробка GS): фигурки сметают банки с полок, на «айкосы» — телевизор над кассой (полки IQOS из главы 4), отъезд сквозь витрину на улицу:
  // ряд магазинов с пустыми полками, из средней полки растёт башня банок и барабан 581 МЛН. Пока камера внутри магазина (после посадки),
  // мир подменяется улицей (те же координаты, тот же магазин) — стола над ней уже нет.
  let T3 = null, K3 = null;
  const TA3 = { x: 410, y: 1180, R: 150 }, TB3 = { x: 760, y: 1176, R: 150 }, PRESS = { x: 1330, y: 1150 }, FLASK = { x: 1810, y: 1060 };
  const FACT = { x: 2440, y: 1150 }, PACK3 = { x: 2715, y: 1170, w: 170, h: 268 }, G2 = { x: 3140, y: 1050, R: 170 }, D1R = 190;   // v22.2: оба купола и пачка — целиком в кадре (камера .95)
  const GS = { x: 2960, y: 3700 }, SHOP = { x0: 2360, y0: 2300, w: 1200, h: 2400 }, SHELVES = [3330, 3580, 3830, 4080], FLOOR3 = 4260;
  function tableInit() {
    const w3 = q => Ws('s3', q), w4 = q => Ws('s4', q), w5 = q => Ws('s5', q), w6 = q => Ws('s6', q);
    T3 = { jw: T2.jw, snusom: w3('снюсом'), nast: w3('настоящий'), shv: w3('шведский'), tab: w3('табак'),
      s4: SA('s4'), net: w4('нет'), nik: w4('никотин'), est: w4('есть'), vyzh: w4('выжимают'), ego: w4('его'), iz: w4('из'), s5: SA('s5'),
      shvedy: w5('шведы'), proizv: w5('производитель'), malb: w5('мальборо'), kupil: w5('купил'), komp: w5('компанию'), tsel: w5('целиком'), amer: w5('американским'), zav: w5('заводом'), kent: w5('кентукки'),
      s6: SA('s6'), dva: w6('два'), snus6: w6('снюс'), smeli: w6('смели'), polok: w6('полок'), amer6: w6('америке'), ajk: w6('айкосы'), japo: w6('японии'), tolko: w6('только'), chet: w6('четвёртом'),
      prod: w6('продали'), shest: w6('шестьсот'), bank: WsB('s6', 'банок'), s7: SA('s7') };
    const a = T3; a.crack = a.snus6 - .2; a.fall = a.snus6; a.land = a.smeli + .3; a.junk = a.bank + .4;
    K3 = [KY(a.jw + .3, 560, 1150, 1.25), KY(a.nast, 572, 1205, 1.32), KY(a.tab + .3, 578, 1215, 1.35), KY(a.nik, 430, 1190, 1.45), KY(a.vyzh, 1350, 860, 1.42),
      KY(a.ego + .3, 1530, 910, 1.42), KY(a.iz + .25, 1830, 1060, 1.5), KY(a.shvedy, 2450, 1000, 1.3), KY(a.malb, 2600, 990, 1.12), KY(a.tsel + .2, 2610, 990, 1.02),
      KY(a.amer, 2740, 995, .92), KY(a.zav + .2, 2780, 995, .89), KY(a.kent + .1, 2782, 995, .89),   // v22.3: купола на 6 % мельче — края не режутся
      KY(a.crack, 3130, 1010, 1.15), KY(a.land, 2960, 3560, .95), KY(a.ajk - .2, 2960, 3580, .95),
      KY(a.japo + .1, 3260, 3090, 2.0), KY(a.tolko + .15, 3120, 3220, 1.35), KY(a.chet + .5, 2960, 3300, .55), KY(a.shest, 2960, 3150, .42), KY(a.junk, 2960, 3060, .4)];
    linkK(K2, K3, N3, true);
  }
  // ---------- стол, стена ----------
  function tableRoom(c) {
    c.fillStyle = C5.wall; c.fillRect(-1600, -1400, 6600, 2490); c.fillStyle = 'rgba(120,80,40,.07)'; for (let x = -1600; x < 5000; x += 120) c.fillRect(x, -1400, 4, 2490);
    c.fillStyle = '#F7F1E4'; c.fillRect(20, 280, 420, 500); vgrad(c, 40, 300, 380, 460, ['#8FB9E0', '#D6E8F3']);   // окно: шведский лес
    for (let i = 0; i < 10; i++) tree5(c, 60 + i * 38, 760 - (i % 3) * 10, 1.4, i % 2);
    c.fillStyle = '#F7F1E4'; c.fillRect(224, 280, 12, 500); c.fillRect(20, 524, 420, 12);
    c.fillStyle = 'rgba(160,110,60,.25)'; c.fillRect(0, 780, 460, 18);   // подоконник
    c.fillStyle = C5.woodL; c.fillRect(-1600, 1080, 6600, 1000); c.fillStyle = 'rgba(80,45,20,.16)'; for (let y = 1080; y < 2080; y += 90) c.fillRect(-1600, y, 6600, 3);
    c.fillStyle = 'rgba(255,240,210,.2)'; c.fillRect(-1600, 1080, 6600, 10); c.fillStyle = C5.woodD; c.fillRect(-1600, 2080, 6600, 60);
    c.fillStyle = '#10142A'; c.fillRect(-1600, 2140, 6600, 700);   // под столом — темно: камера падает к заправке
  }
  // ---------- строки 3–4: баночки, сканер, пресс, змеевик, колба ----------
  // v22.3: вместо наклейки «СНЮС» — веер белых банок брендов (латиницей во всех языках): ZYN впереди, VELO и PABLO выезжают из-за неё,
  // на «табака нет» уходят в стороны — сканер и дальше вся линия про шведов остаются на ZYN
  const BRC = { zyn: ['#1F2A44', '#2BB5A0'], velo: ['#1E5BD8', '#1E5BD8'], pablo: ['#D6334D', '#18181C'] }, BR3 = [['velo', -128], ['pablo', 128]];
  function brandTin(c, kd, x, y, R) { tin5(c, x, y, R, .55, 0, { name: OBJ[kd], nameC: BRC[kd][0], band: BRC[kd][1], h: .7 }) }
  function snusTins(c, t) {
    const a = T3, kin = eio(at(t, a.nast - .35, a.nast + .4)), lid = eio(at(t, a.shv, a.tab - .05));
    const fan = T3 ? eio(at(t, a.jw - .2, a.jw + .5)) : 1, away = T3 ? eio(at(t, a.s4 - .3, a.s4 + .5)) : 0;
    if (fan > 0 && away < 1) BR3.forEach(([kd, dx]) => { const x = TA3.x + dx * fan + Math.sign(dx) * 300 * away, y = TA3.y - 118 * fan, sc = lp(.74, .84, fan);
      c.save(); c.globalAlpha *= Math.min(1, fan * 1.6) * (1 - away); c.translate(x, y); c.scale(sc, sc); brandTin(c, kd, 0, 0, TA3.R); c.restore() });
    brandTin(c, 'zyn', TA3.x, TA3.y, TA3.R);
    if (kin > 0) tin5(c, lp(1600, TB3.x, kin), TB3.y, TB3.R, .55, lid, { dark: true, name: OBJ.snus, h: .6, n: 9 });
  }
  function scanTin(c, t) {   // строка 4: линза сканера над белой баночкой — внутри лист табака перечёркнут, потом светятся шестигранники никотина
    const a = T3, k = eo(at(t, a.s4 - .1, a.net)) * (1 - eio(at(t, a.vyzh - .3, a.vyzh + .15))); if (k <= 0) return;
    const x = TA3.x, y = TA3.y - 40, R = 150 * k;
    c.save(); c.beginPath(); c.arc(x, y, R, 0, TAU); c.clip(); c.fillStyle = 'rgba(14,34,64,.96)'; c.fillRect(x - R, y - R, R * 2, R * 2);
    c.beginPath(); c.ellipse(x, y - 52, 118, 40, 0, 0, TAU); lnB(c, 2, 'rgba(190,230,255,.5)'); c.beginPath(); c.moveTo(x - 118, y - 52); c.lineTo(x - 118, y + 50); c.ellipse(x, y + 50, 118, 40, 0, Math.PI, 0, true); c.lineTo(x + 118, y - 52); lnB(c, 2, 'rgba(190,230,255,.5)');
    const kl = at(t, a.s4 + .2, a.s4 + .6); if (kl > 0) { c.save(); c.translate(x, y); c.globalAlpha *= kl; c.scale(1.4, 1.4); c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-26, 10, -22, -22, 0, -36); c.bezierCurveTo(22, -22, 26, 10, 0, 30); lnB(c, 2.5, 'rgba(201,226,154,.9)');
      c.beginPath(); c.moveTo(0, 28); c.lineTo(0, -30); lnB(c, 1.6, 'rgba(201,226,154,.8)'); const kx = eo(at(t, a.net - .05, a.net + .25)); c.beginPath(); c.moveTo(-30, 32); c.lineTo(lp(-30, 30, kx), lp(32, -36, kx)); lnB(c, 5, '#E2412F'); c.restore() }
    const kh = at(t, a.nik - .15, a.est + .2); for (let i = 0; i < 7; i++) { const e = at(kh, i * .08, i * .08 + .4); if (e <= 0) continue;
      const hx = x - 84 + (i % 4) * 56 + (i > 3 ? 28 : 0), hy = y + 36 + (i > 3 ? 54 : 0); c.save(); c.translate(hx, hy); c.scale(bo(e), bo(e)); c.beginPath();
      for (let j = 0; j < 6; j++) { const an = j * Math.PI / 3; j ? c.lineTo(Math.cos(an) * 20, Math.sin(an) * 20) : c.moveTo(20, 0) } c.closePath(); c.fillStyle = 'rgba(255,210,63,.25)'; c.fill(); c.strokeStyle = C5.nic; c.lineWidth = 4; c.stroke(); c.restore() }
    c.restore(); c.beginPath(); c.arc(x, y, R, 0, TAU); lnB(c, 5, '#7ED6CF'); c.beginPath(); c.arc(x, y, R + 9, 0, TAU); lnB(c, 2, 'rgba(126,214,207,.45)');
    c.beginPath(); c.moveTo(x + R * .7, y + R * .7); c.lineTo(x + R * 1.05, y + R * 1.05); lnB(c, 14, '#2E3244');   // ручка лупы
  }
  // v22.2 (ТЗ Gemini): пресс в объёме на деревянной подставке — винт с маховиком, две колонны, траверса, верхняя плита; лист табака на нижней плите
  // сплющивается внутри пресса; из носика нижней плиты — ровная золотистая струйка в стеклянный змеевик → капли в колбу → из отвода колбы
  // по тонкой трубке капли падают на белые подушечки, лежащие на столе. «Капли-гиганта» больше нет.
  const PB = { x: 1330, y: 1000 }, FL = { x: 1830, y: 1100 }, POU = [1965, 2055, 2145], POUY = 1236, MANY = 1168;
  const COIL2 = (() => { const o = [[PB.x + 186, PB.y - 45], [PB.x + 210, PB.y - 40], [PB.x + 226, PB.y - 26]];
    for (let i = 0; i <= 120; i++) { const u = i / 120, an = u * TAU * 3; o.push([PB.x + 236 + u * 226 + Math.sin(an) * 14, PB.y - 6 + u * 34 + Math.cos(an) * 30 - 30]) }
    o.push([FL.x - 36, FL.y - 104], [FL.x - 12, FL.y - 104], [FL.x, FL.y - 96]);
    const L = [0]; for (let i = 1; i < o.length; i++) L.push(L[i - 1] + Math.hypot(o[i][0] - o[i - 1][0], o[i][1] - o[i - 1][1])); return { P: o, L, tot: L[L.length - 1] } })();
  function pathTo(c, C, u) {   // путь змеевика до доли u длины
    const lim = C.tot * cl(u); c.beginPath(); c.moveTo(C.P[0][0], C.P[0][1]);
    for (let i = 1; i < C.P.length; i++) { if (C.L[i] <= lim) { c.lineTo(C.P[i][0], C.P[i][1]); continue } const k = (lim - C.L[i - 1]) / (C.L[i] - C.L[i - 1]); c.lineTo(lp(C.P[i - 1][0], C.P[i][0], k), lp(C.P[i - 1][1], C.P[i][1], k)); break }
  }
  function glassTube(c, draw, w = 13) {   // стеклянная трубка: светлые стенки, полупрозрачное нутро, блик
    draw(); lnB(c, w + 3, 'rgba(225,242,255,.75)'); draw(); lnB(c, w - 3, 'rgba(90,110,135,.28)'); c.save(); c.translate(-2, -3); draw(); lnB(c, 2, 'rgba(255,255,255,.7)'); c.restore();
  }
  function flaskPath(c) { c.beginPath(); c.moveTo(-22, -80); c.lineTo(22, -80); c.lineTo(22, -20); c.lineTo(78, 110); c.quadraticCurveTo(80, 128, 60, 128); c.lineTo(-60, 128); c.quadraticCurveTo(-80, 128, -78, 110); c.lineTo(-22, -20); c.closePath() }
  function press5(c, t, down, sq) {
    const x = PB.x, y = PB.y;
    castDots(c, x - 190, 1176, 412, 14, 130, { k: .8 });
    PL(c, [x - 190, y + 24, x + 190, y + 24, x + 190, 1190, x - 190, 1190], '#8A5A3A'); PL(c, [x + 190, y + 24, x + 224, y + 2, x + 224, 1168, x + 190, 1190], '#5E3B25');   // деревянная подставка
    c.fillStyle = 'rgba(0,0,0,.13)'; for (let yy = y + 66; yy < 1190; yy += 44) c.fillRect(x - 190, yy, 380, 3); c.fillStyle = 'rgba(255,235,200,.18)'; c.fillRect(x - 190, y + 24, 380, 4);
    PL(c, [x - 176, y - 12, x - 150, y - 36, x + 206, y - 36, x + 180, y - 12], '#5C6379'); PL(c, [x - 176, y - 12, x + 180, y - 12, x + 180, y + 24, x - 176, y + 24], '#3F4559'); PL(c, [x + 180, y - 12, x + 206, y - 36, x + 206, y, x + 180, y + 24], '#2C3142');   // основание
    SL(c, [x - 172, y - 13, x + 178, y - 13], 'rgba(255,255,255,.35)', 2);
    PL(c, [x - 120, y - 36, x - 104, y - 52, x + 150, y - 52, x + 134, y - 36], '#9AA0B3'); c.fillStyle = '#6B7187'; c.fillRect(x - 120, y - 36, 254, 7);   // нижняя плита
    rr(c, x + 130, y - 52, 60, 12, 5); fill(c, '#8A90A3'); rr(c, x + 130, y - 52, 60, 12, 5); lnB(c, 1.5, 'rgba(255,255,255,.4)');   // носик
    // лист табака на нижней плите: сплющивается, темнеет
    const lf = SH.leaf.map(([lx, ly]) => [x + 14 + lx * .44, y - 60 + ly * .44 * lp(.36, .14, sq)]); celPts(c, lf, mixc('#6E8B3D', '#4E5A2A', sq), { lc: mixc('#C9E29A', '#8A9A5A', sq), lw: 2.5 });
    for (const cx0 of [x - 140, x + 150]) { const g = c.createLinearGradient(cx0 - 15, 0, cx0 + 15, 0); g.addColorStop(0, '#D7DCE6'); g.addColorStop(.35, '#8F95A8'); g.addColorStop(1, '#3B4155');   // колонны
      c.fillStyle = g; c.fillRect(cx0 - 15, y - 470, 30, 420); c.fillStyle = '#2C3142'; rr(c, cx0 - 20, y - 54, 40, 18, 4); c.fill(); rr(c, cx0 - 20, y - 446, 40, 16, 4); c.fill() }
    const py = lp(y - 330, y - 72, down);   // верхняя плита
    c.fillStyle = '#A3A9BA'; c.fillRect(x + 5 - 10, y - 530, 20, py - 40 - (y - 530)); c.fillStyle = 'rgba(0,0,0,.32)'; for (let yy = y - 530 + ((down * 90) % 12); yy < py - 46; yy += 12) c.fillRect(x - 5, yy, 20, 4);   // винт
    PL(c, [x - 112, py - 26, x - 96, py - 42, x + 142, py - 42, x + 126, py - 26], '#B3B8C7'); PL(c, [x - 112, py - 26, x + 126, py - 26, x + 126, py, x - 112, py], '#6B7187'); PL(c, [x + 126, py - 26, x + 142, py - 42, x + 142, py - 16, x + 126, py], '#4A5066');
    SL(c, [x - 110, py - 25, x + 124, py - 25], 'rgba(255,255,255,.45)', 2);
    PL(c, [x - 172, y - 470, x - 150, y - 490, x + 194, y - 490, x + 172, y - 470], '#7A8096'); PL(c, [x - 172, y - 470, x + 172, y - 470, x + 172, y - 430, x - 172, y - 430], '#4C5268'); PL(c, [x + 172, y - 470, x + 194, y - 490, x + 194, y - 452, x + 172, y - 430], '#343A4D');   // траверса
    SL(c, [x - 170, y - 469, x + 170, y - 469], 'rgba(255,255,255,.35)', 2);
    const w = Math.cos(down * 6 + .4), hy = y - 540; c.fillStyle = '#5A6078'; c.fillRect(x + 5 - 130 * Math.abs(w), hy - 6, 260 * Math.abs(w), 12); c.fillStyle = '#3B4155'; c.fillRect(x - 9, hy - 14, 28, 28);   // маховик
    for (const s0 of [-1, 1]) { const bx = x + 5 + s0 * 130 * w, g = c.createRadialGradient(bx - 5, hy - 5, 1, bx, hy, 17); g.addColorStop(0, '#FF9A9A'); g.addColorStop(1, '#9E1E2B'); c.fillStyle = g; c.beginPath(); c.arc(bx, hy, 16, 0, TAU); c.fill() }
  }
  function pressScene(c, t) {
    const a = T3, down = eio(at(t, a.vyzh - .1, a.ego + .05)), sq = eio(at(t, a.ego - .25, a.ego + .3));
    press5(c, t, down, sq);
    // змеевик: стекло, внутри — ровная золотистая струйка
    const C = COIL2, fu = at(t, a.ego - .05, a.iz + .25), drawC = () => { c.beginPath(); C.P.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)) };
    glassTube(c, drawC, 13);
    if (fu > 0) { pathTo(c, C, fu); lnB(c, 7, 'rgba(242,184,75,.95)'); c.save(); c.translate(-1.5, -2); pathTo(c, C, fu); lnB(c, 2, 'rgba(255,240,190,.8)'); c.restore() }
    if (fu > 0 && fu < 1) { const lim = C.tot * fu; let i = 1; while (i < C.P.length - 1 && C.L[i] < lim) i++; const k = (lim - C.L[i - 1]) / (C.L[i] - C.L[i - 1]); circ(c, lp(C.P[i - 1][0], C.P[i][0], k), lp(C.P[i - 1][1], C.P[i][1], k), 6, '#FFD23F') }
    // колба: капли из змеевика, уровень растёт
    const fill0 = eo(at(t, a.iz - .2, a.iz + 1.0));
    c.save(); c.translate(FL.x, FL.y); castDots(c, -70, 110, 150, 20, 90, { k: .8 });
    flaskPath(c); c.fillStyle = 'rgba(190,225,250,.22)'; c.fill(); c.save(); flaskPath(c); c.clip(); const ly = lp(128, 30, fill0) + Math.sin(t * 5) * 2.5 * fill0; c.fillStyle = 'rgba(242,184,75,.92)'; c.fillRect(-90, ly, 180, 150);
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-90, ly, 180, 4); c.restore();
    flaskPath(c); lnB(c, 4, '#EEF1F8'); c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(-58, 24, 8, 86);
    for (let i = 0; i < 6; i++) { const t0 = a.iz - .15 + i * .22, u = at(t, t0, t0 + .32); if (u <= 0 || u >= 1 || fu < 1) continue; const yy = lp(-90, ly, u * u); drop(c, 0, yy, 6, '#F2B84B') }
    c.restore();
    // отвод колбы и тонкая трубка над подушечками: три носика, капли на подушечки
    const ty0 = FL.y + 56, ku = at(t, a.iz + .25, a.iz + .75), tube = () => { c.beginPath(); c.moveTo(FL.x + 50, ty0); c.lineTo(FL.x + 96, ty0); c.quadraticCurveTo(FL.x + 112, ty0, FL.x + 116, MANY - 4); c.lineTo(POU[2] + 26, MANY) };
    glassTube(c, tube, 9); circ(c, FL.x + 80, ty0, 8, '#C9CED8'); c.fillStyle = '#5A6078'; c.fillRect(FL.x + 77, ty0 - 18, 6, 12);   // кран
    if (ku > 0) { c.save(); c.beginPath(); c.rect(FL.x + 40, ty0 - 20, (POU[2] + 40 - FL.x - 40) * ku + 10, 200); c.clip(); tube(); lnB(c, 4, 'rgba(242,184,75,.95)'); c.restore() }
    POU.forEach((px, i) => {
      c.save(); c.translate(px, MANY); rr(c, -5, 0, 10, 14, 3); fill(c, 'rgba(225,242,255,.85)'); c.restore();   // носик
      let hits = 0; for (let j = 0; j < 4; j++) { const t0 = a.iz + .62 + i * .14 + j * .42, u = at(t, t0, t0 + .28); if (t > t0 + .28) hits++; if (u > 0 && u < 1) drop(c, px, lp(MANY + 18, POUY - 10, u * u), 5.5, '#F2B84B') }
      castDots(c, px - 42, POUY + 8, 84, 8, 40, { k: .6 }); pouchP(c, px, POUY, 82, 50, 0, false, .5, { dots: Math.min(1, hits / 2) });
    });
  }
  // ---------- строка 5: макеты заводов (Швеция и Кентукки), объёмная пачка Marlboro, стеклянные купола ----------
  // v22.2: заводы чище — цоколь в объёме, кирпичный цех с пилообразной крышей и фонарями, труба в полоску, конвейер с банками, флаг страны
  function flag5(c, x, y, kind, t) {   // флаг на флагштоке: 'se' — Швеция, 'us' — США; колышется
    c.fillStyle = '#C9CED8'; c.fillRect(x, y, 5, 240); circ(c, x + 2.5, y - 4, 6, '#E2C79A'); const wv = Math.sin(t * 4) * 5;
    c.save(); c.translate(x + 5, y + 4); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(44, wv, 88, wv * .6); c.lineTo(88, 56 + wv * .6); c.quadraticCurveTo(44, 56 + wv, 0, 56); c.closePath(); c.clip();
    if (kind === 'se') { c.fillStyle = '#2F6FD6'; c.fillRect(0, -10, 90, 80); c.fillStyle = '#F2D04B'; c.fillRect(24, -10, 13, 80); c.fillRect(0, 21, 90, 13) }
    else { for (let i = 0; i < 7; i++) { c.fillStyle = i % 2 ? '#F4F1EA' : '#C8102E'; c.fillRect(0, i * 8, 90, 8) } c.fillStyle = '#2B3A78'; c.fillRect(0, 0, 38, 30); for (let i = 0; i < 6; i++) circ(c, 6 + (i % 3) * 12, 7 + Math.floor(i / 3) * 14, 2, '#F4F1EA') }
    c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(60, -10, 40, 80); c.restore();
  }
  function factoryModel(c, t, x, y, s, kind) {
    c.save(); c.translate(x, y); c.scale(s, s); castDots(c, -200, 34, 410, 16, 120, { k: .7 });
    PL(c, [-212, 0, -196, -14, 230, -14, 214, 0], '#7A5135'); PL(c, [-212, 0, 214, 0, 214, 42, -212, 42], C5.woodD); PL(c, [214, 0, 230, -14, 230, 28, 214, 42], '#3E2718');   // цоколь
    c.fillStyle = 'rgba(255,240,210,.2)'; c.fillRect(-212, 0, 426, 4);
    if (kind === 'us') { const K = [[-150, 14], [-100, 6], [-40, 9], [20, 2], [80, 5], [150, 12], [130, 30], [60, 34], [-20, 30], [-110, 34]]; poly(c, K.flat()); fill(c, '#D9C9A6'); poly(c, K.flat()); lnB(c, 2, '#7A5232') }   // контур Кентукки на цоколе
    PL(c, [-150, -14, -150, -150, 60, -150, 60, -14], '#B85A3E'); PL(c, [60, -150, 82, -164, 82, -28, 60, -14], '#8A3E2A');   // цех: лицо и бок
    c.fillStyle = 'rgba(0,0,0,.1)'; for (let yy = -140; yy < -14; yy += 12) c.fillRect(-150, yy, 210, 1.5);
    for (let i = 0; i < 3; i++) { const x0 = -150 + i * 70; poly(c, [x0, -150, x0 + 70, -150, x0 + 70, -196]); fill(c, '#7A3E2E'); poly(c, [x0 + 70, -150, x0 + 70, -196, x0 + 58, -152]); fill(c, '#9FD0EE') }   // пилообразная крыша с фонарями
    PL(c, [60, -150, 82, -164, 82, -210, 60, -196], '#6A3426');
    for (let i = 0; i < 3; i++) { rr(c, -132 + i * 62, -116, 40, 46, 3); fill(c, '#F4F1EA'); c.fillStyle = '#FFE7B0'; c.fillRect(-128 + i * 62, -112, 32, 38); c.fillStyle = '#F4F1EA'; c.fillRect(-113 + i * 62, -112, 3, 38); c.fillRect(-128 + i * 62, -94, 32, 3) }
    c.fillStyle = '#F4F1EA'; c.fillRect(-32, -64, 40, 50); c.fillStyle = '#5A6078'; c.fillRect(-28, -60, 32, 46);   // ворота
    { const g = c.createLinearGradient(96, 0, 128, 0); g.addColorStop(0, '#D4D8E2'); g.addColorStop(1, '#7A8096'); c.fillStyle = g; c.fillRect(96, -270, 32, 256); for (let i = 0; i < 3; i++) { c.fillStyle = '#C8102E'; c.fillRect(96, -262 + i * 34, 32, 12) } }   // труба
    rr(c, -196, -34, 392, 18, 9); fill(c, '#3A3F55'); for (let i = 0; i < 9; i++) circ(c, -184 + i * 46, -25, 5, '#5A6078');   // конвейер
    for (let i = 0; i < 6; i++) { const xx = -176 + ((i * 64 + t * 50) % 340); tin5(c, xx, -46, 15, .5, 0, { h: .6, shadow: false }) }
    flag5(c, 150, -250, kind, t + (kind === 'us' ? 1.7 : 0));
    c.restore();
  }
  function domePath5(c, x, y, R) { c.beginPath(); c.arc(x, y, R, Math.PI, 0); c.lineTo(x + R, y + R * .55); c.lineTo(x - R, y + R * .55); c.closePath() }
  function dome(c, t, x, y, R, crack, seed) {   // стеклянный купол: внутри кружатся подушечки; блики, ободок, деревянная база
    for (let i = 0; i < 12; i++) { const an = t * (.6 + H1(seed + i) * .6) + i, r0 = R * (.2 + .62 * H1(seed + i * 3)), px = x + Math.cos(an) * r0, py = y - R * .2 + Math.sin(an * 1.3) * R * .38;
      c.save(); c.translate(px, py); c.rotate(an); rr(c, -9, -6, 18, 12, 4); fill(c, 'rgba(255,253,248,.92)'); c.restore() }
    domePath5(c, x, y, R); c.fillStyle = C5.glass; c.fill(); domePath5(c, x, y, R); lnB(c, 4, 'rgba(238,241,248,.85)');
    c.save(); c.globalAlpha *= .5; c.beginPath(); c.arc(x, y, R * .9, Math.PI * 1.08, Math.PI * 1.42); lnB(c, R * .07, 'rgba(255,255,255,.9)'); c.beginPath(); c.arc(x, y, R * .82, Math.PI * 1.55, Math.PI * 1.65); lnB(c, R * .04, 'rgba(255,255,255,.8)'); c.restore();
    c.fillStyle = 'rgba(190,225,250,.12)'; c.fillRect(x - R, y, R * 2, R * .55);
    PL(c, [x - R * 1.08, y + R * .55, x + R * 1.08, y + R * .55, x + R * 1.08, y + R * .74, x - R * 1.08, y + R * .74], '#3A2A1E'); c.fillStyle = 'rgba(255,230,200,.18)'; c.fillRect(x - R * 1.08, y + R * .55, R * 2.16, 4);
    if (crack > 0) { c.save(); c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 3; for (let i = 0; i < 7; i++) { const an = -Math.PI * (.1 + i * .13), L = R * Math.min(1, crack * 1.4) * (.6 + H1(i) * .4);
      c.beginPath(); c.moveTo(x + Math.cos(an) * R * .15, y + Math.sin(an) * R * .15); c.lineTo(x + Math.cos(an + .18) * L * .5, y + Math.sin(an + .18) * L * .5); c.lineTo(x + Math.cos(an) * L, y + Math.sin(an) * L); c.stroke() } c.restore() }
  }
  function marlScene(c, t) {
    const a = T3, kin = eio(at(t, a.malb - .45, a.malb + .2)), lid = eio(at(t, a.kupil - .1, a.kupil + .35)), fly = eio(at(t, a.komp - .1, a.tsel + .1));
    factoryModel(c, t, FACT.x, FACT.y, .82, 'se');
    // второй купол: завод в Кентукки — на «американским заводом»; на «снюс» трескается и разлетается
    const g2 = spr(at(t, a.amer - .15, a.zav + .3)), crack = at(t, a.crack - .35, a.crack), burst = at(t, a.crack, a.crack + .45), gy = G2.y + G2.R * .74;
    if (g2 > 0 && burst < 1) { c.save(); c.globalAlpha *= 1 - burst; c.translate(G2.x, gy); c.scale(g2, g2); c.translate(-G2.x, -gy);
      factoryModel(c, t, G2.x, G2.y + G2.R * .5, .56, 'us'); dome(c, t, G2.x, G2.y, G2.R, crack, 9); c.restore() }
    if (burst > 0) for (let i = 0; i < 14; i++) { const an = -Math.PI * (.08 + .84 * H1(i * 3.1)), sp = 300 + 500 * H1(i * 7.7), u = burst * .45;   // осколки стекла и банки — вниз, за камерой
      const px = G2.x + Math.cos(an) * sp * u, py = G2.y + Math.sin(an) * sp * u + 1600 * u * u; if (i % 2) tin5(c, px, py, 26, .5, 0, { h: .6, shadow: false });
      else { c.save(); c.translate(px, py); c.rotate(i + burst * 6); poly(c, [-14, -8, 16, -4, 4, 14]); fill(c, 'rgba(220,240,255,.7)'); c.restore() } }
    const px = lp(3500, PACK3.x, kin), pTop = PACK3.y - PACK3.h;
    if (kin > 0) pack3(c, px, pTop, PACK3.w, PACK3.h, { lid: lid > .02 ? lid : 0, d: 64 });
    if (lid > .3 && t > a.komp - .1) { const dx = lp(px + PACK3.w / 2, FACT.x, fly), dy = lp(pTop - 40, FACT.y - D1R * .74 + 16, fly) - Math.sin(Math.PI * fly) * 160, R = lp(56, D1R, fly) * (1 + .04 * Math.sin(Math.PI * at(t, a.tsel + .1, a.tsel + .4)));
      dome(c, t, dx, dy, R, 0, 3) }
  }
  // ---------- строка 6: магазин на заправке (коробка SHOP) ----------
  const RUN = [0, .16, .3, .46, .62, .8];
  function runnerT0(i) { return T3.smeli + RUN[i] * .9 }
  function shopTins() { const o = []; SHELVES.forEach((y, r) => { for (let i = 0; i < 13; i++) o.push({ x: GS.x - 520 + i * 84 + (r % 2) * 26, y: y - 4, r, run: (i + r * 2) % RUN.length }) }); return o }
  let STINS = null;
  function shopInterior(c, t) {
    const a = T3, S = SHOP; if (!STINS) STINS = shopTins();
    c.save(); c.beginPath(); c.rect(S.x0, S.y0, S.w, S.h); c.clip();
    c.fillStyle = C5.gas; c.fillRect(S.x0, S.y0, S.w, S.h);
    c.fillStyle = '#E8ECF4'; c.fillRect(S.x0, S.y0, S.w, 120); for (let i = 0; i < 4; i++) { rr(c, S.x0 + 70 + i * 280, S.y0 + 60, 200, 16, 8); fill(c, '#FFFFFF'); glow(c, S.x0 + 170 + i * 280, S.y0 + 90, 260, '#E8F0FF', .16) }   // потолок и лампы
    vgrad(c, S.x0 + 40, S.y0 + 180, S.w - 80, 420, ['#0A1026', '#1A2550']);   // окно на трассу
    for (let i = 0; i < 7; i++) { const u = ((t * .32 + i / 7) % 1); c.fillStyle = i % 2 ? 'rgba(255,90,95,.85)' : 'rgba(255,236,190,.9)'; c.fillRect(S.x0 + 40 + u * (S.w - 160), S.y0 + 520 + (i % 2) * 18, 110, 6) }
    c.fillStyle = '#2A3150'; for (const x of [S.x0 + 40, S.x0 + 420, S.x0 + 800, S.x0 + S.w - 56]) c.fillRect(x, S.y0 + 180, 16, 420); c.fillRect(S.x0 + 30, S.y0 + 596, S.w - 60, 14);
    c.fillStyle = '#2B3256'; c.fillRect(S.x0, S.y0 + 610, S.w, 2000);   // задняя стена
    SHELVES.forEach(y => { c.fillStyle = C5.shelf; c.fillRect(GS.x - 560, y, 1120, 18); c.fillStyle = C5.shelfD; c.fillRect(GS.x - 560, y + 18, 1120, 9);
      for (let i = 0; i < 6; i++) { c.fillStyle = '#F2D04B'; c.fillRect(GS.x - 530 + i * 180, y + 3, 38, 13) } });
    c.fillStyle = '#B9C0CC'; c.fillRect(S.x0, FLOOR3 - 60, S.w, 1000); c.fillStyle = 'rgba(255,255,255,.25)'; for (let x = S.x0; x < S.x0 + S.w; x += 160) c.fillRect(x, FLOOR3 - 60, 4, 1000);   // пол
    // касса и телевизор над ней: на «айкосы» — полки IQOS пустеют (как в главе 4)
    rr(c, GS.x + 250, FLOOR3 - 300, 320, 240, 10); fill(c, '#3A3F55'); rr(c, GS.x + 250, FLOOR3 - 300, 320, 20, 6); fill(c, '#5A6078'); rr(c, GS.x + 300, FLOOR3 - 350, 130, 52, 8); fill(c, '#22263A');
    tv5(c, t, GS.x + 300, GS.y - 620);
    // банки: падают с купола на полки → фигурки сметают их бегом
    for (const g of STINS) {
      const k = at(t, a.fall + .2 + g.r * .06 + (g.x % 7) * .015, a.land + .1 + g.r * .06 + (g.x % 7) * .015); if (k <= 0) continue;
      const tg = runnerT0(g.run) + (g.x - (GS.x - 760)) / 980; if (t > tg + .3) continue;
      const up = at(t, tg, tg + .3), yy = lp(g.y - 1100, g.y, eio(k)) - 90 * Math.sin(Math.PI * up * .8) - 40 * up;
      c.save(); c.globalAlpha *= 1 - up; tin5(c, g.x + 30 * up, yy - 24, 26, .4, 0, { h: .6, shadow: false }); c.restore() }
    for (let i = 0; i < RUN.length; i++) { const t0 = runnerT0(i); if (t < t0 || t > t0 + 2.2) continue;   // бегут слева направо, руки вперёд
      const P = walker(t, { x0: GS.x - 760, v: 980, T: .42, floor: FLOOR3 + (i % 2) * 40, s: 1.1, lean: .3, lift: 70, arm: 1.0, el: 1.3, bob: 12, crouch: .9, t0 });
      drawRig(c, P, { col: i % 3 ? '#F4F1EA' : '#E1DCCF' }) }
    c.restore();
  }
  function tv5(c, t, x, y) {
    const a = T3; c.fillStyle = '#2A2E3A'; c.fillRect(x - 5, SHOP.y0 + 120, 10, y - 120 - SHOP.y0 - 120); rr(c, x - 160, y - 120, 320, 200, 12); fill(c, '#14161F');
    c.save(); rr(c, x - 146, y - 106, 292, 172, 6); c.clip(); c.fillStyle = '#E9E6DE'; c.fillRect(x - 150, y - 110, 300, 180);
    c.fillStyle = '#C9CED8'; c.fillRect(x - 150, y - 18, 300, 10); c.fillRect(x - 150, y + 48, 300, 10);
    const k = at(t, a.ajk - .25, a.japo + .45); for (let i = 0; i < 8; i++) { if (k > (i + 1) / 9) continue; box4(c, x - 136 + (i % 4) * 70, y - 78 + Math.floor(i / 4) * 66, 46, 56) }
    if (k > .55) tx(c, TEXT.soldout, x, y + 6, { f: 'M', w: 800, s: 30, c: '#D6334D', ls: 3, a: at(k, .55, .75) });
    c.restore(); rr(c, x - 160, y - 120, 320, 200, 12); lnB(c, 3, 'rgba(238,241,248,.5)');
  }
  // ---------- улица: отъезд сквозь витрину — ряд магазинов с пустыми полками ----------
  function shopFront(c, x0, y0, w, h, sign, col, lit) {   // фасад соседнего магазина: витрина с пустыми полками
    c.fillStyle = '#2B2F4A'; c.fillRect(x0 - 50, y0 - 260, w + 100, h + 300); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(x0 + w + 20, y0 - 260, 30, h + 300);
    c.fillStyle = lit ? '#1E2647' : '#141830'; c.fillRect(x0, y0, w, h);
    SHELVES.forEach(yy => { c.fillStyle = lit ? C5.shelf : '#5A6078'; c.fillRect(x0 + 40, yy - GS.y + y0 + h * .55, w - 80, 16) });
    if (lit) glow(c, x0 + w / 2, y0 + 120, 500, '#E8F0FF', .1);
    rr(c, x0 + w / 2 - 280, y0 - 220, 560, 130, 16); fill(c, '#1D2138'); tx(c, sign, x0 + w / 2, y0 - 154, { f: 'M', w: 800, s: 74, c: col, ls: 6 });
  }
  function streetWorld(c, t) {
    const S = SHOP;
    vgrad(c, -4000, -1200, 12000, 3400, ['#070B1E', '#10183A', '#1D2552']); for (let i = 0; i < 60; i++) circ(c, -2000 + H1(i * 3.7) * 9000, -1000 + H1(i * 5.3) * 2800, 2.2, `rgba(255,248,225,${.4 + .4 * Math.abs(Math.sin(t + i))})`);
    c.fillStyle = '#151A34'; for (let i = 0; i < 16; i++) { const x = -1500 + i * 520, h = 600 + H1(i * 2.2) * 900; c.fillRect(x, 2200 - h, 360, h) }   // дальние дома
    c.fillStyle = '#23284A'; c.fillRect(-4000, 1880, 12000, 3000); c.fillStyle = 'rgba(255,255,255,.05)'; for (let x = -4000; x < 8000; x += 90) c.fillRect(x, 1880, 3, 3000);   // сплошной фасад квартала
    c.fillStyle = '#2E3458'; c.fillRect(-4000, 1880, 12000, 40);
    [-2, -1, 1, 2].forEach(n => shopFront(c, S.x0 + n * 1500, S.y0 + 260, S.w, S.h - 400, '24/7', n % 2 ? '#FF5A5F' : '#5ED39B', Math.abs(n) === 1));
    c.fillStyle = '#2B2F4A'; c.fillRect(S.x0 - 70, S.y0 - 300, S.w + 140, S.h + 340); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(S.x0 + S.w + 40, S.y0 - 300, 30, S.h + 340);   // фасад нашего магазина
    rr(c, S.x0 + S.w / 2 - 300, S.y0 - 250, 600, 140, 16); fill(c, '#1D2138'); tx(c, '24/7', S.x0 + S.w / 2, S.y0 - 178, { f: 'M', w: 800, s: 80, c: '#FFD23F', ls: 6 });
    c.fillStyle = '#3A3F55'; c.fillRect(-4000, S.y0 + S.h + 40, 12000, 140); c.fillStyle = '#16192B'; c.fillRect(-4000, S.y0 + S.h + 180, 12000, 1400);   // тротуар и дорога
    for (let i = 0; i < 18; i++) { c.fillStyle = '#E8E2D4'; c.fillRect(-3600 + i * 700, S.y0 + S.h + 560, 300, 18) }
    for (let i = 0; i < 3; i++) { const u = ((t * .18 + i / 3) % 1), x = -1500 + u * 8000; rr(c, x, S.y0 + S.h + 300, 340, 110, 26); fill(c, '#0E1124'); glow(c, x + 340, S.y0 + S.h + 360, 220, '#FFE7B0', .3) }
  }
  function storeGlass(c, t) {   // отъезд: витрина нашего магазина — рама, стойки, блики стекла
    const a = T3, S = SHOP, k = at(t, a.tolko, a.chet + .3); if (k <= 0) return; c.save(); c.globalAlpha *= k;
    c.fillStyle = '#3A4068'; c.fillRect(S.x0 - 30, S.y0 - 30, S.w + 60, 30); c.fillRect(S.x0 - 30, S.y0 + S.h, S.w + 60, 40); c.fillRect(S.x0 - 30, S.y0, 30, S.h); c.fillRect(S.x0 + S.w, S.y0, 30, S.h);
    for (const x of [S.x0 + S.w * .5]) c.fillRect(x - 10, S.y0, 20, S.h);
    c.beginPath(); c.rect(S.x0, S.y0, S.w, S.h); c.clip(); c.fillStyle = 'rgba(200,225,255,.08)';
    poly(c, [S.x0 + 100, S.y0 + S.h, S.x0 + 300, S.y0 + S.h, S.x0 + 900, S.y0, S.x0 + 700, S.y0]); c.fill(); poly(c, [S.x0 + 420, S.y0 + S.h, S.x0 + 480, S.y0 + S.h, S.x0 + 1080, S.y0, S.x0 + 1020, S.y0]); c.fill(); c.restore();
  }
  function canTower(c, t) {   // башня банок из средней полки — выше крыши, над улицей; барабан 581 МЛН
    const a = T3, k = eo(at(t, a.prod - .1, a.bank + .1)); if (k <= 0) return;
    const n = Math.round(lp(0, 22, k)), x = GS.x, y0 = SHELVES[1] - 6;
    for (let i = 0; i < n; i++) for (const dx of [-150, 150, 0]) { if (dx && i > n - 3) continue; tin5(c, x + dx, y0 - i * 96 - 40 - (dx ? 0 : 20), 80, .3, 0, { h: .9, shadow: false }) }
    drum4(c, TEXT.fCans(Math.round(lp(0, 581, eo(at(FT, a.shest - .05, a.bank + .1))))), x, y0 - n * 96 - 220, eo(at(t, a.shest - .2, a.shest + .2)), { s: 200, w: 1080, bg: '#F4F1EA', c: '#141010' });
  }
  function tableWorld(c, t) {
    if (!T3) { tableRoom(c); brandTin(c, 'zyn', TA3.x, TA3.y, TA3.R); return }
    const a = T3;
    if (t < a.land) { tableRoom(c); pressScene(c, t); snusTins(c, t); scanTin(c, t); marlScene(c, t); shopInterior(c, t) }
    else { streetWorld(c, t); shopInterior(c, t); storeGlass(c, t); canTower(c, t) }
  }
  function tablePlates(c, t) {
    const a = T3;
    capS(c, TEXT.snusTob, 540, 330, at(t, a.tab - .05, a.tab + .25) * (1 - at(t, a.s4 + .1, a.s4 + .4)), { s: 54 });
    capS(c, TEXT.nicTob, 540, 330, at(t, a.iz - .1, a.iz + .2) * (1 - at(t, a.shvedy - .3, a.shvedy)), { s: 50 });
    capS(c, TEXT.ky, 540, 330, at(t, a.kent - .05, a.kent + .25) * (1 - at(t, a.crack - .3, a.crack)), { s: 54 });
    capS(c, TEXT.empty, 540, 330, at(t, a.polok + .15, a.polok + .45) * (1 - at(t, a.ajk - .35, a.ajk - .05)), { s: 54 });
  }
  function tableShot(c, t) { const q = camObj(camAt(K3, t)); layer(c, q, 1, cc => tableWorld(cc, t)); tablePlates(c, t) }
  // ================= мир 5: кабинет FDA (строки 7–9) =================
  // Стык с улицей: улица — это фото на столе FDA (A вложен в B): камера отъезжает от фото, видно стол, окно со зданием FDA, лампу.
  // Строка 7: бланк на банку, «разрешил» — зелёный штамп; «первыми» — плашка; четыре банки с цветными крышками въезжают в ряд, на «мята / цитрус /
  // кофе / корица» крышки откидываются по очереди. Строка 8: банки уезжают вправо, слева четыре «Джула» с цветными картриджами — на «запретили»
  // падает нож с гравировкой FDA и срезает картриджи, банки целы. Строка 9: слева бланк айкоса (НЕЛЬЗЯ — как в главе 4), справа бланк банки:
  // на «Зину» на крышке печатается ZYN, «разрешили» — зелёная галочка у «МЕНЬШЕ ВРЕДА»; «айкосу не разрешают» — камера к бланку айкоса, красный
  // штамп; «о риске» — назад; «ниже риск» — стол темнеет, четыре медальона 2×2 (рот, лёгкие, сердце, мозг). Нырок в круг мозга — мир школы (N6).
  let T5 = null, K5 = null, N5 = null;
  const PH5 = { x: -260, y: 1320, w: 270, h: 480, r: -.08 }, FZ = { x: 780, y: 1230 }, FI = { x: 270, y: 1230 }, FW = 380, FH = 520;
  const TINS5 = [{ cap: C5.mint, f: 'mint' }, { cap: C5.lemon, f: 'lemon' }, { cap: C5.coffee, f: 'coffee' }, { cap: C5.cinn, f: 'cinn' }];
  const MED = [{ k: 'mouth', x: 630, y: 850 }, { k: 'lungs', x: 930, y: 850 }, { k: 'heart', x: 630, y: 1150 }, { k: 'brain', x: 930, y: 1150 }], MR = 120;
  const N6 = { x: 930, y: 1150, m: .108 };
  function fdaInit() {
    const w7 = q => Ws('s7', q), w8 = q => Ws('s8', q), w9 = q => Ws('s9', q);
    T5 = { j: T3.junk, s7: SA('s7'), dvadc: w7('двадцать'), regul: w7('регулятор'), razr: w7('разрешил'), prod: w7('продавать'), perv: w7('первыми'), vkus: w7('вкусами'),
      mint: w7('мята'), citr: w7('цитрус'), kofe: w7('кофе'), kor: w7('корица'), s8: SA('s8'), pyat: w8('пять'), juul: w8('джулу'), takie: w8('такие'), zapr: w8('запретили'),
      s9: SA('s9'), dv26: w9('двадцать'), zinu: w9('зину'), razr9: w9('разрешили'), ayk: w9('айкосу'), nera: w9('разрешают'), pory: w9('пор'), govor: w9('говорить'), risk: w9('риске'),
      zin2: w9('зин'), vmesto: w9('вместо'), sig: w9('сигарет'), nizhe: w9('ниже'), rta: w9('рта'), legk: w9('лёгких'), serd: w9('сердца'), insult: w9('инсульта'), s10: SA('s10') };
    const a = T5; a.jdive = a.s10 + .12; a.dive0 = a.jdive - .95;
    { const cr = Math.cos(PH5.r), sr = Math.sin(PH5.r), m = PH5.w / (1080 / .4), dx = (2960 - 540) * m, dy = (3060 - 960) * m;
      N5 = { x: PH5.x - (dx * cr - dy * sr), y: PH5.y - (dx * sr + dy * cr), m, r: PH5.r } }   // кадр улицы в момент стыка (2960, 3060, z .4) = фото на столе
    K5 = [KY(a.j + .55, -150, 1290, 1.5, .04), KY(a.j + 1.25, 250, 1240, 1.1, .01), KY(a.regul, 660, 1230, 1.2), KY(a.razr, 720, 1225, 1.3), KY(a.perv - .3, 640, 1430, 1.0), KY(a.vkus, 640, 1620, 1.25),
      KY(a.kor + .4, 640, 1620, 1.2), KY(a.juul, 560, 1560, .97), KY(a.zapr + .3, 540, 1540, 1.0), KY(a.dv26, 540, 1260, 1.0), KY(a.zinu, 760, 1230, 1.3),
      KY(a.ayk, 300, 1240, 1.3), KY(a.pory, 300, 1240, 1.32), KY(a.govor + .1, 760, 1230, 1.3), KY(a.zin2, 780, 1220, 1.25), KY(a.nizhe + .3, 780, 1020, .95),
      KY(a.insult + .1, 790, 1010, .95), KY(a.dive0 + .3, 900, 1120, 1.5), KY(a.jdive, N6.x, N6.y, 1 / N6.m)];
    linkK(K3, K5, N5, false);
  }
  // ---------- комната и стол ----------
  function fdaRoom(c, t) {
    c.fillStyle = '#D9D3C7'; c.fillRect(-1600, -1200, 4800, 1900); c.fillStyle = 'rgba(0,0,0,.04)'; for (let x = -1600; x < 3200; x += 160) c.fillRect(x, -1200, 5, 1900);
    rr(c, 110, 70, 860, 560, 10); fill(c, '#F4F1EA'); vgrad(c, 130, 90, 820, 520, ['#B9D7EE', '#E3EEF6']);   // окно: здание FDA
    c.save(); c.beginPath(); c.rect(130, 90, 820, 520); c.clip();
    c.fillStyle = '#9DB6C9'; for (let i = 0; i < 6; i++) c.fillRect(140 + i * 140, 430 - H1(i) * 120, 110, 300);
    c.fillStyle = '#F7F6F2'; c.fillRect(400, 270, 520, 360); c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(820, 270, 100, 360);   // v22.2: здание и вывеска правее — плашка 2026 их не задевает
    for (let r = 0; r < 4; r++) for (let i = 0; i < 7; i++) { c.fillStyle = '#7FA2BF'; c.fillRect(420 + i * 70, 330 + r * 70, 46, 44) }
    rr(c, 560, 200, 280, 70, 8); fill(c, '#1F3A66'); tx(c, OBJ.fda, 700, 236, { f: 'M', w: 800, s: 54, c: '#F4F1EA', ls: 10 });
    for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(170 + i * 190, 610, 60 + H1(i * 3) * 30, Math.PI, 0); fill(c, '#5E8C5A') } c.restore();
    c.fillStyle = '#F4F1EA'; c.fillRect(330, 90, 20, 520); c.fillRect(130, 340, 200, 16);
    c.fillStyle = '#5A3A26'; c.fillRect(-1600, 660, 4800, 3000); c.fillStyle = 'rgba(255,235,200,.18)'; c.fillRect(-1600, 660, 4800, 8);   // стол
    rr(c, -1500, 720, 4600, 2900, 18); fill(c, '#2F5444'); rr(c, -1480, 740, 4560, 2860, 14); lnB(c, 3, 'rgba(201,162,74,.55)');   // зелёное сукно с золотой каймой
    glow(c, 980, 980, 620, '#FFE7B0', .16);   // свет лампы на сукне
  }
  function lamp5(c) {   // банкирская лампа справа: латунь, зелёный абажур
    c.save(); c.translate(1010, 860); castDots(c, -60, 40, 120, 16, 80, { k: .7 });
    rr(c, -70, 26, 140, 24, 10); fill(c, '#B8913E'); c.fillStyle = '#9C7A30'; c.fillRect(-6, -150, 12, 180);
    c.beginPath(); c.moveTo(-120, -150); c.lineTo(120, -150); c.quadraticCurveTo(126, -210, 90, -230); c.lineTo(-90, -230); c.quadraticCurveTo(-126, -210, -120, -150); c.closePath(); fill(c, '#1E6B4A');
    c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(-80, -226, 14, 70); c.fillStyle = '#FFE7B0'; c.fillRect(-110, -152, 220, 8); c.restore();
  }
  function streetPhoto(c, t) {   // фото улицы на столе (кадр стыка): бумага, тень, внутри — мир улицы
    const P = PH5; c.save(); c.translate(P.x, P.y); c.rotate(P.r);
    c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(-P.w / 2 - 14 + 10, -P.h / 2 - 14 + 14, P.w + 28, P.h + 28); c.fillStyle = '#F7F4EC'; c.fillRect(-P.w / 2 - 14, -P.h / 2 - 14, P.w + 28, P.h + 28);
    c.beginPath(); c.rect(-P.w / 2, -P.h / 2, P.w, P.h); c.clip(); c.rotate(-P.r); c.translate(-P.x, -P.y); inNest(c, N5, cc => tableWorld(cc, Math.min(t, T3.junk + .2))); c.restore();
  }
  // ---------- бланки ----------
  function stamp5(c, s, x, y, k, col, r = -.14) {   // штамп: падает сверху и печатается
    if (k <= 0) return; const e = k < 1 ? lp(1.7, 1, eo(k)) : 1; c.save(); c.translate(x, y); c.rotate(r); c.scale(e, e); c.globalAlpha *= Math.min(1, k * 2.2) * .92;
    const w = tw(c, s, { f: 'M', w: 800, s: 44, ls: 4 }) + 54; rr(c, -w / 2, -40, w, 80, 12); lnB(c, 7, col); rr(c, -w / 2 + 9, -31, w - 18, 62, 8); lnB(c, 2.5, col);
    tx(c, s, 0, 3, { f: 'M', w: 800, s: 44, c: col, ls: 4 }); c.restore();
  }
  function check5(c, x, y, k, col = '#17A86B') { if (k <= 0) return; c.save(); c.translate(x, y); c.beginPath(); const e = eo(k); c.moveTo(-14, 0); c.lineTo(lp(-14, -3, cl(e * 2)), lp(0, 12, cl(e * 2))); if (e > .5) c.lineTo(lp(-3, 18, (e - .5) * 2), lp(12, -14, (e - .5) * 2)); lnB(c, 6, col); c.restore() }
  function form5(c, t, x, y, o) {   // бланк FDA: шапка, картинка продукта, строки «МЕНЬШЕ ВЕЩЕСТВ», «МЕНЬШЕ ВРЕДА»
    c.save(); c.translate(x, y); if (o.r) c.rotate(o.r); castDots(c, -FW / 2, -FH / 2 + 20, FW, FH, 80, { k: .8 });
    rr(c, -FW / 2, -FH / 2, FW, FH, 6); fill(c, '#FBFAF6'); c.fillStyle = 'rgba(0,0,0,.06)'; c.fillRect(FW / 2 - 70, -FH / 2, 70, FH);
    rr(c, -FW / 2 + 22, -FH / 2 + 22, 96, 44, 6); fill(c, '#1F3A66'); tx(c, OBJ.fda, -FW / 2 + 70, -FH / 2 + 45, { f: 'M', w: 800, s: 26, c: '#F4F1EA', ls: 4 });
    for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(60,70,90,.25)'; c.fillRect(-FW / 2 + 134, -FH / 2 + 26 + i * 15, 190 - i * 40, 7) }
    c.fillStyle = 'rgba(60,70,90,.12)'; rr(c, -FW / 2 + 24, -FH / 2 + 86, FW - 48, 200, 8); c.fill();
    if (o.pic === 'iqos') iqos4(c, 0, -FH / 2 + 186, 250, { name: true, shadow: false });
    else tin5(c, 0, -FH / 2 + 160, 92, .55, 0, { name: o.name > 0 ? OBJ.zyn : null, nameC: rgba('#1F2A44', Math.min(1, o.name * 1.5)), shc: 'rgba(6,10,30,.18)' });
    const L = (yy, s, ok, no) => { tx(c, s, -FW / 2 + 30, yy, { f: 'M', w: 800, s: 25, c: '#1F2A44', al: 'left', ls: 1, mw: FW - 110 }); rr(c, FW / 2 - 62, yy - 18, 36, 36, 6); lnB(c, 3, '#1F2A44');
      if (ok) check5(c, FW / 2 - 44, yy, ok) };
    if (o.less !== undefined) L(-FH / 2 + 330, TEXT.less, o.less);
    L(-FH / 2 + (o.less !== undefined ? 400 : 340), TEXT.harm, o.harm || 0);
    for (let i = 0; i < 2; i++) { c.fillStyle = 'rgba(60,70,90,.18)'; c.fillRect(-FW / 2 + 30, FH / 2 - 70 + i * 22, 260 - i * 80, 8) }
    if (o.no) stamp5(c, TEXT.no, 20, -FH / 2 + (o.less !== undefined ? 400 : 340), o.no, '#D6334D', -.1);
    if (o.ok) stamp5(c, TEXT.ok, 0, FH / 2 - 110, o.ok, '#17A86B');
    c.restore();
  }
  // ---------- вкусы ----------
  function flavor5(c, kind, x, y, k) {   // v22.2: вкусы узнаваемо и в объёме — лист мяты, долька цитруса с сегментами, кофейные зёрна, палочка корицы
    if (k <= 0) return; c.save(); c.translate(x, y - 64 * eo(k)); c.scale(bo(k) * 1.7, bo(k) * 1.7);
    if (kind === 'mint') {
      for (const [ang, sc, col] of [[-.55, .82, '#2E9E63'], [.35, 1, '#3FBF7F']]) { c.save(); c.translate(0, -8); c.rotate(ang); c.scale(sc, sc);
        c.beginPath(); c.moveTo(0, 6); for (let i = 0; i <= 12; i++) { const u = i / 12, yy = -u * 64, w = 26 * Math.sin(Math.PI * Math.pow(u, .8)) * (1 + (i % 2 ? .1 : 0)); c.lineTo(-w, yy) } for (let i = 12; i >= 0; i--) { const u = i / 12, yy = -u * 64, w = 26 * Math.sin(Math.PI * Math.pow(u, .8)) * (1 + (i % 2 ? .1 : 0)); c.lineTo(w, yy) } c.closePath();
        fill(c, col); c.save(); c.clip(); c.fillStyle = shd(col, .3); c.fillRect(0, -70, 40, 80); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(-18, -54, 5, 40); c.restore();
        c.beginPath(); c.moveTo(0, 6); c.lineTo(0, -60); for (let i = 1; i < 5; i++) { c.moveTo(0, -i * 12); c.lineTo(-16, -i * 12 - 10); c.moveTo(0, -i * 12); c.lineTo(16, -i * 12 - 10) } lnB(c, 2, 'rgba(20,80,50,.7)'); c.restore() }
    } else if (kind === 'lemon') {
      c.save(); c.translate(0, -30); circ(c, 3, 5, 36, 'rgba(0,0,0,.22)'); circ(c, 0, 0, 36, '#E8B730'); circ(c, 0, 0, 31, '#FFF6D6');
      for (let i = 0; i < 8; i++) { const a0 = i * TAU / 8 + .06, a1 = (i + 1) * TAU / 8 - .06; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 27, a0, a1); c.closePath(); fill(c, i % 2 ? '#F6D54A' : '#F2CC3A') }
      circ(c, 0, 0, 4, '#FFF6D6'); c.beginPath(); c.arc(0, 0, 33, Math.PI * 1.1, Math.PI * 1.5); lnB(c, 3, 'rgba(255,255,255,.7)'); c.restore();
    } else if (kind === 'coffee') {
      for (const [dx, dy, r] of [[-17, -24, -.4], [16, -30, .5]]) { c.save(); c.translate(dx, dy); c.rotate(r); c.beginPath(); c.ellipse(2, 3, 16, 22, 0, 0, TAU); fill(c, 'rgba(0,0,0,.25)');
        c.beginPath(); c.ellipse(0, 0, 16, 22, 0, 0, TAU); fill(c, '#6B4429'); c.save(); c.beginPath(); c.ellipse(0, 0, 16, 22, 0, 0, TAU); c.clip(); c.fillStyle = '#4A2C18'; c.fillRect(4, -24, 14, 48); c.restore();
        c.beginPath(); c.moveTo(0, -19); c.bezierCurveTo(6, -6, -6, 6, 0, 19); lnB(c, 3, '#2A180C'); c.beginPath(); c.ellipse(-7, -8, 3, 8, .2, 0, TAU); fill(c, 'rgba(255,220,180,.35)'); c.restore() }
    } else {
      c.save(); c.translate(0, -28); c.rotate(-.35); castDots(c, -40, 10, 80, 8, 20, { k: .5 });
      for (const off of [-6, 6]) { rr(c, -42, off - 9, 84, 18, 8); fill(c, '#A85A2A'); c.fillStyle = '#7E3F1C'; c.fillRect(-42, off + 2, 84, 7); c.fillStyle = 'rgba(255,210,170,.3)'; c.fillRect(-36, off - 7, 70, 3) }
      for (const sx of [-1, 1]) { c.save(); c.translate(sx * 42, 0); c.beginPath(); c.ellipse(0, 0, 6, 15, 0, 0, TAU); fill(c, '#8A4A22'); c.beginPath(); for (let i = 0; i < 30; i++) { const a = i * .45, r = 1 + i * .45; c.lineTo(Math.cos(a) * r * .38, Math.sin(a) * r) } lnB(c, 1.6, '#5A2C12'); c.restore() }
      c.restore();
    }
    c.restore();
  }
  function tinsRow(c, t) {
    const a = T5, kin = eo(at(t, a.perv - .9, a.perv - .1)), shift = eio(at(t, a.pyat - .1, a.juul)), out = eio(at(t, a.s9 - .2, a.dv26 + .3)); if (kin <= 0 || out >= 1) return;
    const W = [a.mint, a.citr, a.kofe, a.kor];
    const sc = lp(1, .72, shift);   // v22.3: на «Джулу» банки сдвигаются плотнее и чуть мельче — все четыре с дольками в кадре справа от гильотины
    TINS5.forEach((T, i) => { const x = lp(lp(1700 + i * 200, 340 + i * 200, kin), 622 + i * 120, shift) + 700 * out, y = 1720, lid = eio(at(t, W[i] - .25, W[i] + .05));
      c.save(); c.translate(x, y); c.scale(sc, sc); tin5(c, 0, 0, 92, .55, lid, { cap: T.cap, h: .6, n: 8 }); flavor5(c, T.f, 0, -70, at(t, W[i] - .05, W[i] + .3)); c.restore() });
  }
  // ---------- «Джул» и нож ----------
  const JCOL = ['#7FD3A8', '#F6A03A', '#E9D8B4', '#E7739A'];
  // v22.2: узнаваемые «Джулы» (графитовый корпус, светодиод, цветной под с окошком и мундштуком) и строгая стальная гильотина:
  // стойки из стали, косое лезвие с красной кромкой и гравировкой FDA срезает поды со стола
  function juul5(c, x, y, i, cut) {
    castDots(c, x - 18, y - 6, 36, 10, 60, { k: .7 });
    rr(c, x - 18, y - 236, 36, 236, 8); fill(c, '#3A3F4C'); c.save(); rr(c, x - 18, y - 236, 36, 236, 8); c.clip(); c.fillStyle = '#2A2E38'; c.fillRect(x + 6, y - 240, 14, 240); c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(x - 13, y - 228, 4, 220); c.restore();
    circ(c, x, y - 150, 3.5, i % 2 ? '#7FD3FF' : '#9CF2C2'); c.fillStyle = '#9AA3B5'; c.fillRect(x - 18, y - 240, 36, 6);
    const fall = cut, px = x + fall * (36 + i * 14), py = y - 272 + 900 * fall * fall, rot = fall * (i % 2 ? 1.7 : -1.5); if (fall >= 1) return;
    c.save(); c.translate(px, py); c.rotate(rot); c.globalAlpha *= 1 - at(fall, .6, 1);
    rr(c, -18, -34, 36, 66, 7); fill(c, rgba(JCOL[i], .92)); rr(c, -11, -56, 22, 26, 6); fill(c, rgba(shd(JCOL[i], .1), .95));   // под и мундштук
    rr(c, -10, -18, 20, 36, 4); fill(c, 'rgba(255,255,255,.35)'); c.fillStyle = rgba(shd(JCOL[i], .35), .9); c.fillRect(-10, -18 + 36 * (.35 + i * .1), 20, 36 * (.65 - i * .1));   // окошко с жидкостью
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(6, -34, 12, 66); c.restore();
  }
  function juulRow(c, t) {
    const a = T5, kin = eio(at(t, a.juul - .45, a.juul + .1)), out = eio(at(t, a.s9 - .2, a.dv26 + .2)), cut = at(t, a.zapr - .02, a.zapr + .8); if (kin <= 0 || out >= 1) return;
    c.save(); c.translate(lp(-800, 0, kin) - 900 * out, 0);
    for (let i = 0; i < 4; i++) juul5(c, 150 + i * 100, 1720, i, cut > 0 ? cut : 0);
    // стойки и перекладина — сталь
    for (const px of [62, 518]) { const g = c.createLinearGradient(px - 14, 0, px + 14, 0); g.addColorStop(0, '#D4D8E2'); g.addColorStop(.4, '#8F95A8'); g.addColorStop(1, '#3B4155');
      c.fillStyle = g; c.fillRect(px - 14, 1170, 28, 572); c.fillStyle = '#2C3142'; c.fillRect(px - 4, 1190, 8, 540); for (let k = 0; k < 4; k++) circ(c, px, 1200 + k * 160, 4, '#C9CED8') }
    PL(c, [40, 1150, 540, 1150, 540, 1186, 40, 1186], '#5C6379'); SL(c, [42, 1151, 538, 1151], 'rgba(255,255,255,.4)', 2); PL(c, [30, 1736, 550, 1736, 550, 1752, 30, 1752], '#3F4559');
    // лезвие: падает на «запретили»
    const by = lp(1196, 1404, eio(at(t, a.zapr - .18, a.zapr + .02))), shake = cut > 0 && cut < .15 ? Math.sin(cut * 200) * 4 : 0;
    c.save(); c.translate(shake, 0); const B = [76, by, 504, by, 504, by + 46, 76, by + 120];
    poly(c, B); const g = c.createLinearGradient(0, by, 0, by + 120); g.addColorStop(0, '#E1E5EC'); g.addColorStop(1, '#9AA1B2'); c.fillStyle = g; c.fill();
    c.save(); poly(c, B); c.clip(); c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(76, by + 8, 428, 6); poly(c, [76, by + 106, 504, by + 34, 504, by + 46, 76, by + 120]); fill(c, '#C8102E'); c.restore();
    tx(c, OBJ.fda, 290, by + 44, { f: 'M', w: 800, s: 38, c: 'rgba(40,46,60,.5)', ls: 10 }); tx(c, OBJ.fda, 291, by + 45, { f: 'M', w: 800, s: 38, c: 'rgba(255,255,255,.35)', ls: 10 });
    poly(c, B); lnB(c, 2, 'rgba(20,23,51,.5)'); c.restore();
    c.restore();
  }
  // ---------- медальоны ----------
  function organ5(c, k) {
    c.strokeStyle = '#D6334D'; c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round';
    if (k === 'mouth') { c.beginPath(); c.moveTo(-52, 0); c.bezierCurveTo(-30, -26, -12, -22, 0, -12); c.bezierCurveTo(12, -22, 30, -26, 52, 0); c.bezierCurveTo(26, 30, -26, 30, -52, 0); c.closePath(); fill(c, '#E2566A'); c.beginPath(); c.moveTo(-46, 0); c.quadraticCurveTo(0, 10, 46, 0); lnB(c, 4, '#9C2236') }
    else if (k === 'lungs') {   // v22.2: лёгкие узнаваемо — трахея, бронхи, две доли с вырезкой под сердце, 3 тона
      for (const s of [-1, 1]) { const P = () => { c.beginPath(); c.moveTo(s * 9, -38); c.bezierCurveTo(s * 30, -50, s * 52, -26, s * 56, 8); c.bezierCurveTo(s * 60, 40, s * 48, 58, s * 26, 56);
          c.bezierCurveTo(s * 12, 55, s * (s < 0 ? 8 : 16), 44, s * (s < 0 ? 8 : 16), 26); c.bezierCurveTo(s * (s < 0 ? 8 : 22), 12, s * 10, -6, s * 9, -38); c.closePath() };
        P(); fill(c, '#E98A96'); c.save(); P(); c.clip(); c.fillStyle = s > 0 ? '#C9677A' : '#D97A8A'; c.fillRect(s > 0 ? 34 : -60, -60, 30, 130); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(s > 0 ? 18 : -48, -30, 6, 60); c.restore();
        P(); lnB(c, 2.5, '#B84A60'); c.beginPath(); c.moveTo(s * 30, -14); c.quadraticCurveTo(s * 44, 6, s * 54, 18); lnB(c, 2, 'rgba(160,50,70,.6)') }
      c.beginPath(); c.moveTo(0, -58); c.lineTo(0, -22); c.moveTo(0, -24); c.quadraticCurveTo(-10, -16, -22, -8); c.moveTo(0, -24); c.quadraticCurveTo(10, -16, 22, -8); lnB(c, 7, '#D6334D');
      for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(-5, -54 + i * 8, 10, 2.5) } }
    else if (k === 'heart') { c.beginPath(); c.moveTo(0, 46); c.bezierCurveTo(-60, 6, -50, -46, 0, -22); c.bezierCurveTo(50, -46, 60, 6, 0, 46); fill(c, '#E2414F') }
    else { for (const s of [-1, 1]) { c.beginPath(); c.moveTo(0, -40); c.bezierCurveTo(s * 40, -50, s * 60, -10, s * 48, 18); c.bezierCurveTo(s * 40, 40, s * 10, 40, 0, 30); c.closePath(); fill(c, '#F2A6B4') }
      c.beginPath(); c.moveTo(0, -38); c.lineTo(0, 30); c.moveTo(-34, -20); c.quadraticCurveTo(-20, -8, -30, 6); c.moveTo(34, -20); c.quadraticCurveTo(20, -8, 30, 6); c.moveTo(-14, 14); c.quadraticCurveTo(-26, 22, -40, 16); c.moveTo(14, 14); c.quadraticCurveTo(26, 22, 40, 16); lnB(c, 4, '#B84A60') }
  }
  function medal5(c, t, M, k, ic) {   // медальон: белый круг, орган, зелёная стрелка «ниже»
    if (k <= 0) return; c.save(); c.translate(M.x, M.y); c.scale(bo(k), bo(k)); circ(c, 8, 12, MR, 'rgba(0,0,0,.3)'); circ(c, 0, 0, MR, '#F7F5F0'); ring(c, 0, 0, MR, '#17A86B', 7); ring(c, 0, 0, MR - 12, 'rgba(23,168,107,.35)', 2);
    if (ic > 0) { c.save(); c.globalAlpha *= ic; organ5(c, M.k); c.restore();
      c.save(); c.globalAlpha *= ic; circ(c, MR * .66, MR * .62, 30, '#17A86B'); c.beginPath(); c.moveTo(MR * .66, MR * .62 - 16); c.lineTo(MR * .66, MR * .62 + 14); c.moveTo(MR * .66 - 12, MR * .62 + 2); c.lineTo(MR * .66, MR * .62 + 15); c.lineTo(MR * .66 + 12, MR * .62 + 2); lnB(c, 5, '#FFFFFF'); c.restore() }
    c.restore();
  }
  function medals(c, t) {
    const a = T5, W = [a.rta, a.legk, a.serd, a.insult];
    MED.forEach((M, i) => { const k = at(t, W[i] - .2, W[i] + .25); if (k <= 0) return;
      if (M.k === 'brain' && t > a.dive0) {   // мозг: круг становится круглым окном двери — за ним школа (N6)
        const e = at(t, a.dive0, a.dive0 + .5); circ(c, M.x + 8, M.y + 12, MR, 'rgba(0,0,0,.3)');
        c.save(); c.beginPath(); c.arc(M.x, M.y, MR, 0, TAU); c.clip(); inNest(c, N6, cc => { if (typeof schoolWorld === 'function') schoolWorld(cc, t); else { cc.fillStyle = '#3E5C8A'; cc.fillRect(0, 0, 1080, 1920) } });
        if (e < 1) { c.globalAlpha = 1 - e; circ(c, M.x, M.y, MR, '#F7F5F0'); c.save(); c.translate(M.x, M.y); organ5(c, M.k); c.restore() } c.restore();
        ring(c, M.x, M.y, MR, mixc('#17A86B', '#8E95A6', e), 7 + 5 * e); ring(c, M.x, M.y, MR + 8, rgba('#C9CED8', e), 4); return }
      medal5(c, t, M, k, 1) });
  }
  // ---------- мир 5 ----------
  function fdaWorld(c, t) {
    const a = T5; fdaRoom(c, t); streetPhoto(c, t);
    const kz = eo(at(t, a.razr - .2, a.razr + .15)), zn = at(t, a.zinu - .05, a.zinu + .35), ok9 = at(t, a.govor - .05, a.govor + .35);   // v22.3: галочка ZYN — когда камера вернулась, на «говорить о риске»
    const inI = eio(at(t, a.s9 - .1, a.dv26 + .3));
    if (inI > 0) form5(c, t, lp(-500, FI.x, inI), FI.y, { pic: 'iqos', less: 1, harm: 0, no: at(t, a.nera - .2, a.nera + .1), r: .03 });
    form5(c, t, FZ.x, FZ.y, { pic: 'tin', harm: ok9, ok: kz * (1 - at(t, a.s9 - .2, a.s9 + .2)), name: zn, r: -.02 });
    if (t > a.zin2 - .3 && t < a.nizhe + .3) { const k = at(t, a.zin2 - .3, a.zin2 + .1) * (1 - at(t, a.nizhe - .1, a.nizhe + .3));   // «Зин вместо сигарет»: сигарета перечёркнута у бланка
      c.save(); c.globalAlpha *= k; cigar(c, FZ.x - 140, FZ.y + 300, FZ.x + 40, FZ.y + 300, 14, { filt: C3.filt, ember: 1 }); const kx = eo(at(t, a.sig - .05, a.sig + .25)); c.beginPath(); c.moveTo(FZ.x - 150, FZ.y + 330); c.lineTo(lp(FZ.x - 150, FZ.x + 50, kx), lp(FZ.y + 330, FZ.y + 270, kx)); lnB(c, 7, '#D6334D'); c.restore() }
    cap5(c, TEXT.first, FZ.x + 104, FZ.y - FH / 2 + 2, at(t, a.perv - .05, a.perv + .25) * (1 - at(t, a.vkus + .3, a.vkus + .6)), { s: 44, r: .07 });   // v22.2: наклейкой на углу бланка — логотип FDA открыт
    tinsRow(c, t); juulRow(c, t); lamp5(c);
    const dim = at(t, a.nizhe - .1, a.nizhe + .4); if (dim > 0) { c.save(); c.globalAlpha *= .6 * dim; c.fillStyle = '#0B1024'; c.fillRect(-1600, -1200, 4800, 4800); c.restore() }
    medals(c, t);
    cap5(c, TEXT.risk, 780, 664, at(t, a.nizhe - .05, a.nizhe + .25) * (1 - at(t, a.dive0 + .2, a.dive0 + .5)), { s: 50, bg: '#17A86B', c: '#FFFFFF' });   // v22.2: над сеткой медальонов, лёгкие не закрывает
  }
  function fdaPlates(c, t) {
    const a = T5;

  }
  function fdaShot(c, t) { const q = camObj(camAt(K5, t)); layer(c, q, 1, cc => fdaWorld(cc, t)); fdaPlates(c, t) }
  function fdaCues(Q) {
    const a = T5; Q(a.j + .1, 'whoosh', .35); Q(a.j + .6, 'papers', .4); Q(a.razr - .05, 'stamp', .6); Q(a.razr, 'thud', .4); for (let i = 0; i < 4; i++) Q(a.perv - .8 + i * .14, 'plop', .25, .4 - i * .2);
    [a.mint, a.citr, a.kofe, a.kor].forEach((w, i) => { Q(w - .2, 'drawer', .25, -.3 + i * .2); Q(w, 'plop', .35, -.3 + i * .2) });
    Q(a.juul - .4, 'scuttle', .35, -.4); Q(a.zapr - .2, 'chain', .35); Q(a.zapr, 'blade', .6); Q(a.zapr + .1, 'impact', .4); Q(a.zapr + .4, 'plop', .3);
    Q(a.s9, 'whoosh', .35); Q(a.dv26 + .1, 'papers', .4); Q(a.zinu, 'marker', .4); Q(a.govor + .05, 'shimmer', .35); Q(a.ayk - .2, 'whoosh', .3); Q(a.nera - .1, 'stamp', .55); Q(a.nera, 'thud', .45);
    Q(a.govor, 'whoosh', .3); Q(a.sig, 'marker', .35); Q(a.nizhe, 'deep', .35); [a.rta, a.legk, a.serd, a.insult].forEach((w, i) => Q(w - .1, 'plop', .4, [-.3, .3, -.3, .3][i])); Q(a.dive0 + .2, 'dive', .55);
  }
  // ================= мир 6: школьный коридор (строки 10–11) =================
  // Вложен в круг медальона «мозг» (N6): круг — круглое окно двери, за ним коридор со шкафчиками. Фигурки с рюкзаками идут по коридору;
  // на шкафчике — лист «ШКОЛЬНИКИ США», шкала 0–2 %: серый столбик сигарет 1,4 %, белый столбик снюса растёт до 1,7 % и обгоняет — красная стрелка.
  // Строка 11: белый столбик сжимается и делится на две банки (бока банок — тот же белый), они встают на нижнюю планку листа: 3 МГ и 6 МГ;
  // на «покрепче» крышки темнеют, банки выше; барабаны 3 → 9 и 6 → 11; на «вместо трёх и шести» старые числа зачёркнуты.
  let T6 = null, K6 = null;
  const SH6 = { x: 540, y: 900, w: 480, h: 600 }, BASE6 = 1110, PCT6 = 170, BAR6 = [{ x: 430, v: 1.4, col: '#9AA3B5' }, { x: 650, v: 1.7, col: '#FFFFFF' }];
  function schoolInit() {
    const w10 = q => Ws('s10', q), w11 = q => Ws('s11', q);
    T6 = { j: T5.jdive, s10: SA('s10'), amer: w10('американские'), shk: w10('школьники'), sig: w10('сигарет'), kur: w10('курят'), snus: w10('снюс'), ob: w10('обогнал'), sig2: w10('сигареты'),
      s11: SA('s11'), mes: w11('месяца'), razr: w11('разрешили'), snus2: w11('снюс'), kr: w11('покрепче'), dev: w11('девять'), odin: w11('одиннадцать'), mg: w11('миллиграммов'),
      vm: w11('вместо'), tr: w11('трёх'), sh: w11('шести'), shB: WsB('s11', 'шести') };
    const a = T6; a.split0 = a.razr - .35; a.split1 = a.razr + .45; a.jout = a.shB + .35;   // после строки 11 — вода поднимается (мир доски)
    // v22.2: строка 10 — коридор и лист с графиком (камера в движении); строка 11 — камера уезжает вправо к тёмной витрине с двумя банками ZYN
    // («КРЕПОСТЬ»): заголовка «ШКОЛЬНИКИ США» в кадре нет — крепкий снюс не читается как разрешённый школьникам
    K6 = [KY(a.j + .35, 560, 1010, 1.06), KY(a.shk + .2, 640, 1000, 1.02), KY(a.sig + .1, 575, 955, 1.5), KY(a.ob, 548, 945, 1.6), KY(a.s11 + .2, 600, 950, 1.5), KY(a.razr - .1, 1600, 1000, 1.3),
      KY(a.kr + .2, 1630, 985, 1.38), KY(a.shB, 1640, 975, 1.5), KY(a.jout + .62, 1640, 970, 1.6)];   // до самой воды камера не встаёт
    linkK(K5, K6, N6, true);
  }
  function schoolRoom(c, t) {
    c.fillStyle = '#E8E4DA'; c.fillRect(-1600, -1200, 4800, 1800); c.fillStyle = '#D6D0C2'; c.fillRect(-1600, 500, 4800, 60);
    for (let i = 0; i < 5; i++) { rr(c, -600 + i * 600, 150, 360, 26, 13); fill(c, '#FFFFFF'); glow(c, -420 + i * 600, 170, 300, '#FFFFFF', .12) }   // лампы
    // v22.2: справа коридор кончается — тёмная витрина-стенд (строка 11)
    c.fillStyle = '#121833'; c.fillRect(1110, 470, 1500, 1030); c.fillStyle = 'rgba(255,255,255,.035)'; for (let x = 1140; x < 2600; x += 110) c.fillRect(x, 470, 3, 1030);
    c.fillStyle = '#2B3256'; c.fillRect(1096, 470, 18, 1030); c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(1096, 470, 4, 1030);
    for (let i = 0; i < 20; i++) {   // шкафчики (до витрины)
      const x = -1500 + i * 130, col = i % 2 ? C5.locker : mixc(C5.locker, C5.lockerL, .25);
      c.fillStyle = col; c.fillRect(x, 560, 126, 920); c.fillStyle = C5.lockerD; c.fillRect(x + 96, 560, 30, 920); c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(x + 6, 570, 6, 900);
      for (let v = 0; v < 4; v++) { c.fillStyle = C5.lockerD; c.fillRect(x + 22, 600 + v * 14, 60, 6) }
      rr(c, x + 70, 1010, 14, 46, 5); fill(c, '#C9CED8'); rr(c, x + 30, 640 + 0, 40, 20, 3); fill(c, 'rgba(255,255,255,.25)');
    }
    c.fillStyle = '#2E4770'; c.fillRect(-1600, 1480, 4800, 14);
    c.fillStyle = C5.floor; c.fillRect(-1600, 1494, 4800, 1500); c.fillStyle = 'rgba(0,0,0,.06)'; for (let y = 1540; y < 3000; y += 70) c.fillRect(-1600, y, 4800, 3);
    c.fillStyle = 'rgba(255,255,255,.25)'; for (let x = -1600; x < 3200; x += 240) c.fillRect(x, 1494, 4, 1500);
  }
  function pack6(c, P, s, back) {   // рюкзак за спиной фигурки
    const top = [P.pel[0], P.pel[1] - RG.torso * s * .95]; c.save(); c.translate(top[0] - (back ? 0 : 0) - 30 * s, top[1] + 10 * s);
    rr(c, -34 * s, 0, 46 * s, 100 * s, 12 * s); fill(c, back); rr(c, -34 * s, 46 * s, 46 * s, 22 * s, 6 * s); fill(c, 'rgba(0,0,0,.18)'); c.restore();
  }
  const WALK6 = [{ x0: 60, v: 170, s: 1.0, f: 1720, col: '#F4F1EA', bp: '#D6334D', t0: 0 }, { x0: 1000, v: -150, s: 1.08, f: 1760, col: '#E8E2D4', bp: '#2F6FD6', t0: .3 },
    { x0: -330, v: 200, s: .94, f: 1690, col: '#EDE7DA', bp: '#F2B84B', t0: .6 }, { x0: 1350, v: -190, s: 1.12, f: 1800, col: '#F4F1EA', bp: '#17A86B', t0: .1 }];
  function walkers6(c, t) {   // фигурки с рюкзаками идут по коридору (кто влево — зеркально)
    const a = T6; if (!a) return;
    WALK6.forEach(W => { const tt = t - a.j + 1.2 + W.t0, P = walker(tt, { x0: 0, v: Math.abs(W.v), T: .62, floor: W.f, s: W.s, t0: 0, lean: .05 }), x = W.x0 + W.v * tt;
      if (x < -600 || x > 1000) return;   // v22.2: к витрине школьники не подходят
      const body = () => { c.save(); c.translate(x - P.pel[0], 0); castDots(c, P.pel[0] - 50 * W.s, W.f - 8, 110 * W.s, 10, 60, { k: .6 }); pack6(c, P, W.s, W.bp); drawRig(c, P, { col: W.col }); c.restore() };
      if (W.v < 0) mirrorX(c, x, body); else body() });
  }
  function sheet6(c, t) {   // лист на шкафчике: шкала 0–2 %, столбики
    const a = T6, S = SH6, x0 = S.x - S.w / 2, y0 = S.y - S.h / 2;
    castDots(c, x0, y0 + 20, S.w, S.h, 70, { k: .7 }); rr(c, x0, y0, S.w, S.h, 6); fill(c, '#FBFAF6');
    c.save(); c.translate(x0 + 60, y0 - 6); c.rotate(-.2); c.fillStyle = 'rgba(240,230,190,.85)'; c.fillRect(-40, -14, 80, 28); c.restore(); c.save(); c.translate(x0 + S.w - 60, y0 - 6); c.rotate(.18); c.fillStyle = 'rgba(240,230,190,.85)'; c.fillRect(-40, -14, 80, 28); c.restore();
    tx(c, TEXT.kids, S.x, y0 + 52, { f: 'M', w: 800, s: 36, c: '#1F2A44', ls: 3, mw: S.w - 40 });
    const ax = 0;   // v22.2: лист остаётся как есть — банки крепкого снюса стоят отдельно, на витрине
    c.save(); c.globalAlpha *= 1 - ax;
    c.fillStyle = 'rgba(31,42,68,.85)'; c.fillRect(x0 + 70, BASE6, S.w - 110, 5); c.fillRect(x0 + 70, BASE6 - 2 * PCT6, 4, 2 * PCT6);
    for (let i = 0; i <= 2; i++) { const yy = BASE6 - i * PCT6; c.fillStyle = 'rgba(31,42,68,.15)'; c.fillRect(x0 + 70, yy, S.w - 110, 2); tx(c, TEXT.fPct(i), x0 + 40, yy, { f: 'M', w: 800, s: 24, c: '#56607A' }) }
    c.restore();
    const B = BAR6, kc = eo(at(t, a.sig - .1, a.kur + .1)), ks = eo(at(t, a.snus - .1, a.ob + .05));
    // сигареты: серый столбик 1,4 % и значок
    c.save(); c.globalAlpha *= 1 - ax; const hc = B[0].v * PCT6 * kc; rr(c, B[0].x - 55, BASE6 - hc, 110, hc, 6); fill(c, B[0].col);
    if (kc > .6) tx(c, TEXT.fPct('1.4'), B[0].x, BASE6 - hc - 28, { f: 'M', w: 800, s: 32, c: '#56607A', a: at(kc, .6, 1) });
    cigar(c, B[0].x - 46, BASE6 + 44, B[0].x + 46, BASE6 + 44, 10, { filt: C3.filt, ember: 1 }); c.restore();
    // снюс: белый столбик 1,7 % (обводка) и баночка-значок; на «обогнал» — красная стрелка
    if (ax <= 0) { const hs = B[1].v * PCT6 * ks; rr(c, B[1].x - 55, BASE6 - hs, 110, hs, 6); fill(c, '#FFFFFF'); rr(c, B[1].x - 55, BASE6 - hs, 110, hs, 6); lnB(c, 3, '#1F2A44');
      if (ks > .6) tx(c, TEXT.fPct('1.7'), B[1].x, BASE6 - hs - 28, { f: 'M', w: 800, s: 32, c: '#1F2A44', a: at(ks, .6, 1) });
      tin5(c, B[1].x, BASE6 + 34, 30, .5, 0, { h: .6, shadow: false }) }
    const kar = eo(at(t, a.ob - .1, a.ob + .35)) * (1 - ax); if (kar > 0) { c.save(); c.globalAlpha *= kar; const y1 = BASE6 - 1.4 * PCT6, y2 = BASE6 - 1.7 * PCT6 - 70;
      c.beginPath(); c.moveTo(B[0].x, y1 - 60); c.quadraticCurveTo(B[0].x + 60, y2 - 60, lp(B[0].x, B[1].x - 30, kar), lp(y1 - 60, y2, kar)); lnB(c, 8, '#D6334D');
      if (kar > .9) { c.save(); c.translate(B[1].x - 30, y2); c.rotate(.6); poly(c, [0, 0, -26, -10, -16, 14]); fill(c, '#D6334D'); c.restore() } c.restore() }
  }
  const DSP = { x: 1640, y: 1100, xs: [1520, 1760] };
  function mgTins(c, t) {   // v22.2: строка 11 — тёмная витрина: стеклянная полка, два луча, банки ZYN 3 → 9 и 6 → 11 МГ, «КРЕПОСТЬ»
    const a = T6, on = eio(at(t, a.razr - .45, a.razr + .1)); if (on <= 0) return;
    const kr = eio(at(t, a.kr - .1, a.kr + .4)), R = 92, ty = .34, h = lp(.7, 1.0, kr), cap = mixc('#FAFAF8', '#2B2F3A', kr);
    for (const x of DSP.xs) beam(c, x, 520, x, DSP.y + 20, 16, 150, '#FFE7B0', .22 * on);
    c.save(); c.globalAlpha *= on; PL(c, [1300, DSP.y + 38, 1980, DSP.y + 38, 2010, DSP.y + 16, 1330, DSP.y + 16], 'rgba(190,225,250,.25)'); SL(c, [1300, DSP.y + 38, 1980, DSP.y + 38], 'rgba(225,242,255,.8)', 3); c.restore();
    cap5(c, TEXT.strength, DSP.x, 640, at(t, a.razr - .2, a.razr + .15) * (1 - at(t, a.jout - .3, a.jout)), { s: 46, bg: '#F4F1EA', c: '#141010' });   // гаснет до того, как поднимется вода
    [[DSP.xs[0], a.dev, 3, 9], [DSP.xs[1], a.odin, 6, 11]].forEach(([x, w, v0, v1], i) => {
      const k = eo(at(t, a.razr - .3 + i * .12, a.razr + .2 + i * .12)); if (k <= 0) return;
      const hS = R * h * Math.sqrt(1 - ty * ty) + R * .06, y = DSP.y + 30 - hS - R * ty;
      c.save(); c.globalAlpha *= k; tin5(c, x, y + (1 - k) * 60, R, ty, 0, { cap, name: OBJ.zyn, nameC: kr > .5 ? '#F4F1EA' : '#1F2A44', h, shc: 'rgba(0,0,0,.45)' }); c.restore();
      const v = Math.round(lp(v0, v1, eo(at(FT, w - .1, w + .4))));   // по времени кадра — цифры не двоятся
      drum4(c, v + ' ' + TEXT.mg, x, y - R * ty - 96, at(t, a.razr, a.razr + .35), { s: 52, w: 210, bg: kr > .5 ? '#D6334D' : '#141733' });
      const ko = at(t, a.vm - .05 + i * .4, a.vm + .3 + i * .4); if (ko > 0) { c.save(); c.globalAlpha *= ko; tx(c, v0 + ' ' + TEXT.mg, x, DSP.y + 96, { f: 'M', w: 800, s: 34, c: '#AEB6CC' });
        c.beginPath(); c.moveTo(x - 56, DSP.y + 96); c.lineTo(lp(x - 56, x + 56, eo(ko)), DSP.y + 96); lnB(c, 5, '#D6334D'); c.restore() }
    });
  }
  function schoolWorld(c, t) { schoolRoom(c, t); sheet6(c, t); mgTins(c, t); walkers6(c, t) }
  function schoolShot(c, t) { const q = camObj(camAt(K6, t)); layer(c, q, 1, cc => schoolWorld(cc, t)) }
  function schoolCues(Q) {
    const a = T6; Q(a.j + .1, 'school', .35); Q(a.j + .4, 'thud', .15, -.3); Q(a.sig, 'marker', .35); Q(a.snus, 'marker', .35); Q(a.ob, 'whip', .4); Q(a.ob + .1, 'impact', .3);
    Q(a.razr - .2, 'whoosh', .3); Q(a.razr + .3, 'plop', .35, -.2); Q(a.razr + .4, 'plop', .35, .2); Q(a.kr, 'thud', .45); Q(a.dev, 'counter', .45, -.2); Q(a.odin, 'counter', .45, .2); Q(a.vm, 'marker', .3);
  }
  // ================= мир 7: пробковая доска глав (начало фильма, строка 12, концовка шортса) =================
  // Доска та же, что в конце главы 4 (v21.2: компактная, на тёмной стене): 1979 — колба, 2020 — одноразка, 1924 — две пачки (мягкая 1920-х
  // и Flip-Top 1950-х, без HeatSticks), 2014 — айкос у карты США на столе кофейни, 2022 — ночной океан с баночкой (кадр 0 главы 5).
  // Фильм, начало: камера та же, что в последнем кадре главы 4 (карточка 2022 под маркером), маркер осыпается кусками, фото раскрывается
  // на весь экран — это кадр океана. Конец строки 11: вода поднимается снизу (за ней — тот же ночной океан), кадр сжимается в фото
  // карточки 2022, отъезд на всю доску. Фильм: импульс света по нитям, на «Осталось перевернуть» — угол доски загибается (финал — 90-final.js).
  // Шортс: значки карточек вспыхивают, нити натягиваются и уходят за доску, на «обороте» доска поворачивается на ребро (видна тёмная изнанка
  // с красным кольцом змеи) и возвращается, штамп «ЦЕЛИКОМ — НА YOUTUBE», нырок в фото 2022 — кадр 0 (петля).
  const CARDS5 = [{ id: '1979', x: 340, y: 400, a: '1979', bk: 'card79b' }, { id: '2020', x: 740, y: 400, a: '2020', bk: 'card20b' },
    { id: '2014', x: 230, y: 790, a: '2014', bk: 'card14b' }, { id: '1924', x: 540, y: 850, a: '1924', bk: 'card24b' }, { id: '2022', x: 850, y: 790, a: '2022', bk: 'card22b' }];
  const CW5 = 270, CH5 = 330, PS5 = 240, BRD5 = { x0: -40, y0: 120, x1: 1120, y1: 1160 }, C22 = CARDS5[4];
  const THR5 = [[0, 1], [1, 2], [1, 3], [1, 4], [3, 0], [3, 2], [2, 4]];   // как в главе 4: 79–20, 20–14, 20–24, 20–22, 24–79, 24–14, 14–22
  const photo5 = cd => [cd.x, cd.y - CH5 / 2 + 15 + PS5 / 2], pin5 = cd => [cd.x, cd.y - CH5 / 2 + 4];
  const PHC5 = { x: 560, y: 860, s: 1200 }, Q0 = { x: 540, y: 960, z: 1, r: 0 };   // какой квадрат кадра океана видно в фото 2022
  const JCAM = [540, 640, .88];   // v22.2: камера стыка 4 → 5 — вся доска целиком (без обрезанных карточек у краёв кадра); последний кадр главы 4 = кадр главы 5 за 1/30 с до начала
  let T7 = null, K7 = null, KJ5 = null, CORK5 = null, COVER = null, IMG14 = null;
  // ---------- доска ----------
  function corkImg5() { if (CORK5) return CORK5; CORK5 = mk(WW, 1400); const g = CORK5.getContext('2d'); g.fillStyle = '#b07a4a'; g.fillRect(0, 0, WW, 1400);
    for (let y = 10, r = 0; y < 1400; y += 22, r++) for (let x = (r % 2) * 11; x < WW; x += 22) { if (H1(x * .37 + y * 1.13) > .55) continue; g.fillStyle = 'rgba(120,72,35,.35)'; g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill() } return CORK5 }
  function wallBg5(c) { c.fillStyle = '#2a1d14'; c.fillRect(-4000, -4000, 9000, 9000); c.fillStyle = 'rgba(255,255,255,.03)'; for (let x = -4000; x < 5000; x += 140) c.fillRect(x, -4000, 4, 9000) }
  function boardWall5(c, noWall) {
    if (!noWall) wallBg5(c);
    const B = BRD5, im = corkImg5();
    c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(B.x0 + 18, B.y0 + 26, B.x1 - B.x0, B.y1 - B.y0);
    c.save(); rr(c, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 14); fill(c, '#5b3d26'); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); c.clip();
    for (let yy = B.y0; yy < B.y1; yy += 1400) for (let xx = B.x0; xx < B.x1; xx += 1080) c.drawImage(im, xx, yy); c.restore();
    rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); lnS(c, 3, 'rgba(241,230,214,.4)');
    c.save(); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); c.clip(); const g = c.createRadialGradient(540, 420, 120, 540, 700, 1100); g.addColorStop(0, 'rgba(255,236,190,.12)'); g.addColorStop(1, 'rgba(20,12,6,.38)'); c.fillStyle = g; c.fillRect(B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0); c.restore();
  }
  function marker5(c, x, y, s, seed) { c.save(); c.translate(x, y); c.lineCap = 'round';
    [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(seed + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke(); c.restore() }); c.restore() }
  function pin5d(c, x, y) { circ(c, x + 2, y + 4, 10, 'rgba(0,0,0,.35)'); circ(c, x, y, 10, '#dc2626'); circ(c, x - 3, y - 3, 3.6, '#fca5a5') }
  function thread5(c, a, b, k = 1, o = {}) { if (k <= 0) return; const [x1, y1] = pin5(a), [x2, y2] = pin5(b), x = lp(x1, x2, k), y = lp(y1, y2, k);
    c.save(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(x + 3, y + 6); c.stroke(); c.strokeStyle = o.col || '#dc2626'; c.lineWidth = o.w || 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x, y); c.stroke();
    if (o.pulse !== undefined && o.pulse > 0 && o.pulse < 1) { const u = o.pulse, px = lp(x1, x2, u), py = lp(y1, y2, u); glow(c, px, py, 46, '#FFE7B0', .9); circ(c, px, py, 7, '#FFF6DA') } c.restore() }
  function photo1979(c, x, y, s) { c.fillStyle = '#1b2142'; c.fillRect(x - s / 2, y - s / 2, s, s); c.save(); c.translate(x - s * .12, y + s * .08); c.scale(s / 240, s / 240);
    poly(c, [-38, 20, 38, 20, 56, 56, -56, 56]); fill(c, '#38bdf8'); poly(c, [-14, -80, 14, -80, 14, -30, 60, 60, -60, 60, -14, -30]); c.strokeStyle = '#e0f2fe'; c.lineWidth = 5; c.stroke();
    poly(c, [96, 30, 120, 8, 146, 26, 140, 58, 108, 60]); fill(c, '#F4F1EA'); poly(c, [120, 8, 146, 26, 128, 38]); fill(c, '#FFFFFF'); c.restore() }
  function photo2020(c, x, y, s) { c.fillStyle = '#1e2138'; c.fillRect(x - s / 2, y - s / 2, s, s); rr(c, x - s * .12, y - s * .32, s * .24, s * .64, s * .08); fill(c, B2.mango);
    poly(c, [x - s * .12, y + s * .02, x + s * .12, y - s * .1, x + s * .12, y + s * .32, x - s * .12, y + s * .32]); fill(c, B2.ice2); rr(c, x - s * .07, y - s * .42, s * .14, s * .12, 6); fill(c, '#2a2f55') }
  function photo1924(c, x, y, s) {   // v21.2: две пачки главы 3 — мягкая 1920-х и Flip-Top 1950-х, без HeatSticks
    c.fillStyle = '#1b1f3a'; c.fillRect(x - s / 2, y - s / 2, s, s); beam(c, x, y - s / 2, x, y + s * .3, 10, s * .5, '#FFE6B8', .14);
    c.fillStyle = 'rgba(200,230,255,.25)'; c.fillRect(x - s / 2, y + s * .3, s, 4); c.fillStyle = '#14172E'; c.fillRect(x - s / 2, y + s * .3 + 4, s, s);
    c.save(); c.translate(x, y); c.scale(s / 240, s / 240); softPack(c, -86, -16, 64, 96, 12, { shadow: false }); mPack(c, 10, -24, 64, 104, 12, { shadow: false }); c.restore();
  }
  function photo2014(c, x, y, s) {   // кофейня главы 4: айкос у карты США на столе
    c.fillStyle = '#6B4A34'; c.fillRect(x - s / 2, y - s / 2, s, s); c.save(); c.translate(x, y); c.scale(s / 240, s / 240);
    c.save(); c.rotate(-.08); rr(c, -100, -74, 196, 128, 4); fill(c, '#EDE3CC'); c.translate(-90, -62); c.scale(1, .95);   // контур США
    const US = [0, 10, 2, 40, 8, 70, 20, 92, 40, 100, 60, 98, 75, 106, 90, 120, 100, 108, 110, 96, 125, 98, 138, 96, 146, 118, 150, 96, 156, 80, 166, 62, 172, 44, 180, 30, 176, 22, 160, 30, 150, 34, 140, 26, 128, 30, 118, 20, 100, 16, 60, 12, 20, 8];
    poly(c, US); fill(c, '#C9B892'); poly(c, US); lnB(c, 1.8, '#7A6A4A'); c.restore();
    iqos4(c, 10, 72, 130, { shadow: false, ang: -.12 }); c.restore();
  }
  function oceanIn(c, x, y, s, tO) {   // кадр океана (камера (540, 960, 1), без параллакса) в квадрате со стороной s
    const k = s / PHC5.s; c.save(); c.beginPath(); c.rect(x - s / 2, y - s / 2, s, s); c.clip(); c.translate(x, y); c.scale(k, k); c.translate(-PHC5.x, -PHC5.y); oceanWorld(c, tO, Q0); c.restore();
  }
  function card5(c, t, cd, o = {}) {
    const [px, py] = photo5(cd);
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW5 / 2, -CH5 / 2, CW5, CH5, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW5 / 2, cd.y - CH5 / 2, CW5, CH5, 6); fill(c, '#f5f0e6'); rr(c, cd.x - CW5 / 2, cd.y - CH5 / 2, CW5, CH5, 6); lnS(c, 3, '#2b2638');
    c.save(); c.beginPath(); c.rect(px - PS5 / 2, py - PS5 / 2, PS5, PS5); c.clip();
    if (cd.id === '1979') photo1979(c, px, py, PS5); else if (cd.id === '2020') photo2020(c, px, py, PS5); else if (cd.id === '1924') photo1924(c, px, py, PS5);
    else if (cd.id === '2014') { if (IMG14 && IMG14.complete && IMG14.naturalWidth) c.drawImage(IMG14, px - PS5 / 2, py - PS5 / 2, PS5, PS5); else photo2014(c, px, py, PS5) } else oceanIn(c, px, py, PS5, o.tO ?? -50);   // v22.2: 2014 — то же фото кофейни, что в конце главы 4 (ep/v210-ph2014.png)
    if (o.flash > 0) { c.fillStyle = `rgba(255,246,218,${.55 * o.flash})`; c.fillRect(px - PS5 / 2, py - PS5 / 2, PS5, PS5) }
    c.restore();
    if (cd.id === '2022' && o.cover !== undefined) coverDraw(c, t, px, py, o.cover);
    tx(c, cd.a, cd.x, cd.y + CH5 / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' });
    if (o.label !== false) tx(c, TEXT[cd.bk], cd.x, cd.y + CH5 / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW5 - 24, a: o.label ?? 1 });
  }
  // маркер на фото 2022 (как в конце главы 4) — осыпается кусками: k 0 — целый, 1 — осыпался
  function coverImg() { if (COVER) return COVER; COVER = mk(PS5 * 3, PS5 * 3); const g = COVER.getContext('2d'); g.scale(3, 3); rr(g, 0, 0, PS5, PS5, 2); fill(g, '#17171c'); marker5(g, PS5 / 2, PS5 / 2, PS5, C22.x); return COVER }   // v22.1: в 3 раза чётче — на стыке камера близко
  function coverDraw(c, t, px, py, k) {
    if (k <= 0) { c.save(); c.beginPath(); c.rect(px - PS5 / 2, py - PS5 / 2, PS5, PS5); c.clip(); rr(c, px - PS5 / 2, py - PS5 / 2, PS5, PS5, 2); fill(c, '#17171c'); marker5(c, px, py, PS5, C22.x); c.restore(); return }   // целый — вектором, как в главе 4 (стык 4 → 5)
    if (k >= 1) return;
    const im = coverImg(), n = 6, d = PS5 / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const s0 = .05 + .5 * H1(i * 7.1 + j * 3.3) * (1 - j / n * .5), u = cl((k - s0) / .45); if (u >= 1) continue;
      const x = px - PS5 / 2 + i * d, y = py - PS5 / 2 + j * d; c.save(); c.translate(x + d / 2 + (H1(i + j * 9) - .5) * 90 * u, y + d / 2 + 520 * u * u); c.rotate((H1(i * 3 + j) - .5) * 4 * u); c.globalAlpha *= 1 - at(u, .7, 1);
      c.drawImage(im, i * d * 3, j * d * 3, d * 3, d * 3, -d / 2 - .5, -d / 2 - .5, d + 1, d + 1); c.restore() }
  }
  function boardWorld5(c, t, o = {}) {
    boardWall5(c, o.noWall);
    if (o.titleStrip) o.titleStrip(c);
    if (o.threads !== false) THR5.forEach(([i, j], n) => { const kk = o.thrK ? o.thrK(n) : 1; thread5(c, CARDS5[i], CARDS5[j], kk, { pulse: o.pulse ? o.pulse(n) : undefined }) });
    CARDS5.forEach((cd, i) => card5(c, t, cd, { tO: o.tO, cover: cd.id === '2022' ? o.cover : undefined, flash: o.flash ? o.flash(i) : 0 }));
    CARDS5.forEach(cd => pin5d(c, ...pin5(cd)));
  }
  // ---------- кадр океана поверх доски: фото 2022 ↔ весь экран ----------
  function photoOver5(c, q, e, tO) {   // e: 0 — океан на весь экран (камера (540, 960, 1)), 1 — океан в фото 2022 на доске (камера доски q)
    const [px, py] = photo5(C22), P = { x: (px - q.x) * q.z + 540, y: (py - q.y) * q.z + 960, s: PS5 * q.z };
    const S = { x: lp(540, P.x, e), y: lp(960, P.y, e), w: lp(WW, P.s, e), h: lp(HH, P.s, e) }, Vh = lp(HH, PHC5.s, e), k = S.h / Vh, V = { x: lp(540, PHC5.x, e), y: lp(960, PHC5.y, e) };
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); c.rect(S.x - S.w / 2, S.y - S.h / 2, S.w, S.h); c.clip(); c.translate(S.x, S.y); c.scale(k, k); c.translate(-V.x, -V.y); oceanWorld(c, tO, Q0); c.restore();
  }
  // ---------- фильм: начало главы ----------
  function boardStartInit() { KJ5 = [KY(-1.0, 330, 740, 1.35), KY(0, ...JCAM), KY(.55, 820, 752, 2.2), KY(1.15, 850, 760, 4.6)]; T0.j0 = 1.15 }   // v22.1: ключи — те же, что KS в конце главы 4 (ep/v210/80-board.js)
  function boardStartShot(c, t) {
    const q = camObj(camAt(KJ5, t)), cov = at(t, 0, .62);
    layer(c, q, 1, cc => boardWorld5(cc, t, { tO: t, cover: cov }));
    const e = eio(at(t, .5, 1.15)); if (e > 0) photoOver5(c, q, 1 - e, t);
  }
  // ---------- вода поднимается (конец строки 11): за ней — тот же ночной океан ----------
  function flood5(c, t, k, tO) {
    if (k <= 0) return; const e = eio(k), fy = lp(HH + 80, -120, e), wv = x => fy + 26 * Math.sin(x / 120 + t * 4) + 14 * Math.sin(x / 47 - t * 3);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); c.moveTo(0, HH + 200); for (let x = 0; x <= WW; x += 20) c.lineTo(x, wv(x)); c.lineTo(WW, HH + 200); c.closePath(); c.clip();
    oceanWorld(c, tO, Q0); c.restore();
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); for (let x = 0; x <= WW; x += 20) { const y = wv(x); x ? c.lineTo(x, y) : c.moveTo(x, y) } lnB(c, 10, 'rgba(201,220,242,.85)'); c.restore();
  }
  // ---------- строка 12 (фильм) и концовка шортса ----------
  function boardInit5() {
    const a = { j: T6.jout }; T7 = a; a.fl1 = a.j + .62; a.sh1 = a.fl1 + .75; a.tOff = MODE === 'y' ? 200 : TLX.endT + 1 / 30;
    if (MODE === 'y') { const w = q => Ws('s12', q); Object.assign(a, { kazh: w('каждая'), dosk: w('доске'), nov: w('новый'), bros: w('бросить'), ost: w('осталось'), per: w('перевернуть'), dosk2: w('доску'), sB: SB('s12') }) }
    else { const w = q => Ws('q', q); Object.assign(a, { ugad: w('угадаете'), obor: w('обороте'), dos: w('доски'), vEnd: TLX.vEnd, end: TLX.endT + 1 / 30 }) }
    if (MODE === 'y') K7 = [KY(a.fl1, 850, 760, 3.0), KY(a.sh1, 700, 690, 1.25), KY(a.dosk + .2, 560, 680, .94), KY(a.ost, 548, 660, .92), KY(a.dosk2 + .4, 540, 610, .86)];
    else K7 = [KY(a.fl1, 850, 760, 3.0), KY(a.sh1, 700, 690, 1.25), KY(a.sh1 + .7, 560, 690, .92), KY(a.vEnd + .15, 560, 680, .9), KY(a.end - .62, 760, 730, 1.6), KY(a.end, 850, 760, 4.6)];
  }
  function turnK(t) { const a = T7; if (MODE === 'y') return 0; const u = at(t, Math.max(a.obor - .3, a.sh1 + .05), a.obor + 1.0); return u > 0 && u < 1 ? 1.92 * Math.sin(Math.PI * u) : 0 }   // шортс: поворот доски на ребро и обратно (рад); v22.2 — когда фото уже легло в карточку
  function boardShot5(c, t) {
    const a = T7, tO = t - a.tOff;
    if (t < a.fl1) { schoolShot(c, t); flood5(c, t, at(t, a.j, a.fl1), tO); return }
    const q = camObj(camAt(K7, Math.min(t, K7[K7.length - 1][0])));
    const pulse = MODE === 'y' ? (n => at(t, a.nov - .1 + n * .05, a.bros + .2 + n * .05)) : undefined;
    const flash = MODE === 'y' ? undefined : (i => Math.sin(Math.PI * at(t, a.fl1 + .15 + i * .08, a.fl1 + .5 + i * .08)));   // шортс: пока кадр сжимается в фото — значки вспыхивают, нити уходят за доску
    const thrK = MODE === 'y' ? undefined : (n => 1 - eio(at(t, a.fl1 + .35 + n * .03, a.obor - .35)));
    const ang = turnK(t), sx = Math.cos(ang);
    c.save(); layer(c, q, 1, cc => {
      if (Math.abs(sx) < .999) { wallBg5(cc); flipBoard(cc, ang, g => boardWorld5(g, t, { tO, threads: false, noWall: true }), g => boardBack5(g, t, { teaser: 1 })) }   // v22.2: настоящий 3D-поворот, на изнанке — уроборос с натянутыми нитями
      else boardWorld5(cc, t, { tO, pulse, flash, thrK });
      if (MODE === 'y' && t > a.ost) curlCorner(cc, t);
    }); c.restore();
    const e = eio(at(t, a.fl1, a.sh1)); if (e < 1) photoOver5(c, q, e, tO);
    if (MODE !== 'y') {   // шортс: штамп и нырок в фото 2022 = кадр 0
      const ks = at(t, a.vEnd - .05, a.vEnd + .25) * (1 - at(t, a.end - .75, a.end - .5)); if (ks > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); stamp5(c, TEXT.yt, 540, 330, ks, '#D6334D', -.08); c.restore() }
      const ed = eio(at(t, a.end - .62, TLX.endT)); if (ed > 0) photoOver5(c, q, 1 - ed, tO);   // в последнем кадре океан — ровно на весь экран (шов петли)
    }
  }
  // ---------- v22.2: изнанка доски — фанера с волокнами, рамка, светлые контуры-отпечатки пяти карточек, острия пяти булавок ----------
  const BPIN = () => CARDS5.map(cd => { const [x, y] = pin5(cd); return [1080 - x, y] });   // на изнанке всё зеркально
  function boardBack5(c, t, o = {}) {
    const B = BRD5; c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(B.x0 + 18, B.y0 + 26, B.x1 - B.x0, B.y1 - B.y0);
    rr(c, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 14); fill(c, '#3A2A1E'); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); fill(c, '#2A1E15');
    c.save(); rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); c.clip();
    for (let k = 0; k < 34; k++) { const y0 = B.y0 + 30 + k * 30 + H1(k) * 10; c.beginPath(); for (let x = B.x0; x <= B.x1; x += 30) { const yy = y0 + 6 * Math.sin(x / (90 + H1(k * 3) * 70) + k) + 3 * Math.sin(x / 23 + k * 2); x === B.x0 ? c.moveTo(x, yy) : c.lineTo(x, yy) }
      lnB(c, 1.2 + H1(k * 7) * 1.2, `rgba(255,220,180,${.035 + H1(k * 5) * .05})`) }   // волокна фанеры
    for (let k = 0; k < 4; k++) { const cx = B.x0 + 140 + H1(k * 9.1) * 860, cy = B.y0 + 120 + H1(k * 4.4) * 780; c.beginPath(); c.ellipse(cx, cy, 26, 12, H1(k) * 2, 0, TAU); lnB(c, 1.4, 'rgba(255,220,180,.08)') }   // сучки
    const g = c.createRadialGradient(540, 560, 120, 540, 640, 900); g.addColorStop(0, 'rgba(255,236,190,.06)'); g.addColorStop(1, 'rgba(0,0,0,.35)'); c.fillStyle = g; c.fillRect(B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0);
    CARDS5.forEach(cd => { const x = 1080 - cd.x, y = cd.y; c.save(); c.setLineDash([10, 7]); rr(c, x - CW5 / 2, y - CH5 / 2, CW5, CH5, 6); lnB(c, 2, 'rgba(255,236,200,.16)');
      c.setLineDash([]); c.strokeStyle = 'rgba(255,236,200,.1)'; c.lineWidth = 1.5; c.strokeRect(x - PS5 / 2, y - CH5 / 2 + 15, PS5, PS5); c.restore() });   // отпечатки карточек
    c.restore();
    rr(c, B.x0 + 22, B.y0 + 22, B.x1 - B.x0 - 44, B.y1 - B.y0 - 44, 8); lnS(c, 3, 'rgba(241,230,214,.22)');
    BPIN().forEach(([x, y]) => { circ(c, x, y, 13, 'rgba(0,0,0,.4)'); circ(c, x, y, 7, '#1A120C'); c.save(); c.translate(x, y); c.rotate(-.7);   // остриё булавки сквозь доску
      const gg = c.createLinearGradient(-4, 0, 4, 0); gg.addColorStop(0, '#E6EAF0'); gg.addColorStop(1, '#7A8096'); c.fillStyle = gg; poly(c, [-3.5, 0, 3.5, 0, 0, -26]); c.fill(); c.restore(); circ(c, x - 4, y - 9, 2, 'rgba(255,255,255,.85)') });
    if (o.teaser) backTeaser(c, t, o.teaser);
  }
  // ---------- v22.2: строгий графичный уроборос — алое тело с бордовой тенью и светлыми гранями-ромбами, сужается к хвосту;
  // угловатая голова с белыми клыками и прищуром намертво смыкается на кончике хвоста (кольцо без разрыва) ----------
  const OUR = { red: '#B8122C', redL: '#E0344B', redD: '#5E0A18', facet: '#CC1E37', ln: 'rgba(255,226,226,.6)' };
  function ouroBody(c, x, y, R, o = {}) {   // o.w — толщина у шеи, o.a0 — кончик хвоста (угол), o.gap — зазор под голову, o.kw 0..1 — толщина растёт
    const a0 = o.a0 ?? (-Math.PI / 2 + .06), span = TAU - (o.gap ?? .13), n = 180, W = (o.w ?? 46) * (o.kw ?? 1), tail = u => lp(.14, 1, Math.pow(u, .5)) * (u > .97 ? lp(1, .86, (u - .97) / .03) : 1);
    const pt = (u, d) => { const a = a0 + span * u, r = R + d + (o.wv ? o.wv * Math.sin(TAU * (u * 7 - (o.ph || 0))) : 0); return [x + Math.cos(a) * r, y + Math.sin(a) * r] };   // v22.3: o.wv — волна вдоль тела (ползёт)
    const band = (d0, d1) => { c.beginPath(); for (let i = 0; i <= n; i++) { const u = i / n, w = W * tail(u) / 2, [px, py] = pt(u, w * d1); i ? c.lineTo(px, py) : c.moveTo(px, py) }
      for (let i = n; i >= 0; i--) { const u = i / n, w = W * tail(u) / 2, [px, py] = pt(u, w * d0); c.lineTo(px, py) } c.closePath() };
    band(-1, 1); fill(c, OUR.red); band(-1, -.15); fill(c, OUR.redD); band(.72, 1); fill(c, OUR.redL);   // 3 тона: алый, бордовая тень внутри, свет по внешнему краю
    if ((o.kw ?? 1) > .55) {   // грани-ромбы (чешуя): по одной на толщину тела, через одну — чуть светлее
      let u = .03, k = 0; while (u < .975) { const w = W * tail(u) / 2; if (w > 7) { const du = w * 1.7 / (R * span), [p0x, p0y] = pt(u - du / 2, 0), [p1x, p1y] = pt(u, w * .7), [p2x, p2y] = pt(u + du / 2, 0), [p3x, p3y] = pt(u, -w * .7);
          c.beginPath(); c.moveTo(p0x, p0y); c.lineTo(p1x, p1y); c.lineTo(p2x, p2y); c.lineTo(p3x, p3y); c.closePath();
          const gw = o.gl == null ? 0 : Math.exp(-Math.pow((((u - o.gl) % 1 + 1.5) % 1 - .5) / .06, 2));   // v22.3: перелив чешуек — светлая волна бежит по телу
          if (k % 2 || gw > .05) { c.fillStyle = `rgba(255,${120 + 90 * gw | 0},${130 + 80 * gw | 0},${.16 + .5 * gw})`; c.fill() } lnB(c, 1.3, OUR.ln);
          u += du * 1.02 } else u += .01; k++ } }
    band(-1, 1); lnB(c, 2, 'rgba(255,226,226,.4)');
    return { head: pt(1, 0), ang: a0 + span + Math.PI / 2, tailTip: pt(0, 0) };
  }
  function ouroHead(c, x, y, ang, s, jaw = 0) {   // угловатая ромбовидная голова, нос — по ходу кольца (к хвосту); jaw 0 — челюсти сомкнуты на хвосте, 1 — раскрыты
    c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
    const op = jaw * .35;
    const up = [[-70, -22], [-44, -46], [6, -44], [48, -22], [80, -2 - 18 * op], [18, 1 - 12 * op], [-40, 1]], lo = [[-70, 22], [-44, 44], [10, 38], [52, 16], [76, 3 + 18 * op], [18, -1 + 12 * op], [-40, -1]];   // сомкнуты: щели нет
    poly(c, lo.flat()); fill(c, OUR.redD); poly(c, up.flat()); fill(c, OUR.red);
    poly(c, [-44, -46, 6, -44, 48, -22, -2, -26]); fill(c, OUR.redL); poly(c, [-70, -22, -44, -46, -2, -26, -40, -8]); fill(c, OUR.facet);   // светлые грани сверху
    c.beginPath(); c.moveTo(-34, 0); c.lineTo(78, 0); lnB(c, 2.2, 'rgba(40,4,12,.85)');   // линия пасти
    c.fillStyle = '#FFF6F0'; poly(c, [40, -3 - 11 * op, 49, -3 - 11 * op, 44.5, 9]); c.fill(); poly(c, [22, -3 - 9 * op, 30, -3 - 9 * op, 26, 8]); c.fill();   // клыки впиваются в хвост
    poly(c, [32, 3 + 11 * op, 40, 3 + 11 * op, 36, -8]); c.fill();
    c.beginPath(); c.moveTo(-18, -26); c.lineTo(14, -32); lnB(c, 5, '#FFD9A0'); c.beginPath(); c.moveTo(-12, -26.5); c.lineTo(8, -30); lnB(c, 2, '#2A0A10');   // узкий прищур
    poly(c, up.flat()); lnB(c, 2, OUR.ln); poly(c, lo.flat()); lnB(c, 2, OUR.ln); c.beginPath(); c.moveTo(-60, -14); c.lineTo(-10, -22); c.lineTo(40, -14); lnB(c, 1.2, 'rgba(255,226,226,.45)');
    c.restore();
  }
  function ouro5(c, t, x, y, R, o = {}) {   // целиком: тело, голова на кончике хвоста
    const r = ouroBody(c, x, y, R, o); if ((o.kh ?? 1) <= 0) return r;
    const s = (o.hs ?? R / 330) * bo(Math.min(1, o.kh ?? 1)); ouroHead(c, r.head[0], r.head[1], r.ang, s, o.jaw ?? 0); return r;
  }
  function backTeaser(c, t, k) {   // шортс: на изнанке — прямые нити от булавок к центру и строгий уроборос вокруг
    const C = { x: 540, y: 660 }, P = BPIN(); c.save(); c.globalAlpha *= k;
    P.forEach(([px, py]) => { c.beginPath(); c.moveTo(px, py); c.lineTo(C.x, C.y); lnB(c, 5, '#D6334D'); c.beginPath(); c.moveTo(px + 2, py + 3); c.lineTo(C.x + 2, C.y + 3); lnB(c, 2, 'rgba(0,0,0,.25)') });
    ouro5(c, t, C.x, C.y, 230, { w: 40, hs: .8, gap: .14 }); c.restore();
  }
  // ---------- v22.2: 3D-поворот доски вокруг вертикали (полосками, с перспективой); изнанка — зеркально ----------
  let BFC = null, BBC = null; const FLR = { x0: -80, y0: 90, w: 1240, h: 1110, ax: 540, cy: 640 };
  function flipBoard(c, ang, drawFront, drawBack) {
    const R = FLR, ca = Math.cos(ang), sa = Math.sin(ang), front = ca >= 0;
    if (front && !BFC) BFC = mk(R.w, R.h); if (!front && !BBC) BBC = mk(R.w, R.h);
    const src = front ? BFC : BBC, g = src.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, R.w, R.h); g.translate(-R.x0, -R.y0); (front ? drawFront : drawBack)(g);
    const n = 96, D = 2600, prj = xs => { const X = xs * ca, Z = xs * sa, f = D / (D + Z); return [R.ax + X * f, f] };
    for (let i = 0; i < n; i++) {
      const u0 = i / n, u1 = (i + 1) / n, [x0, f0] = prj(R.x0 + u0 * R.w - R.ax), [x1, f1] = prj(R.x0 + u1 * R.w - R.ax), dw = Math.abs(x1 - x0); if (dw < .05) continue;
      const f = (f0 + f1) / 2, sx = front ? u0 * R.w : (1 - u1) * R.w;
      c.drawImage(src, sx, 0, R.w / n + .5, R.h, Math.min(x0, x1) - .3, R.cy - (R.cy - R.y0) * f, dw + .6, R.h * f);
    }
    const sh = (1 - Math.abs(ca)) * .55; if (sh > .01) { const [xl, fl] = prj(R.x0 - R.ax), [xr, fr] = prj(R.x0 + R.w - R.ax);   // свет уходит, когда доска поворачивается ребром
      c.save(); c.globalAlpha *= sh; poly(c, [xl, R.cy - (R.cy - R.y0) * fl, xr, R.cy - (R.cy - R.y0) * fr, xr, R.cy + (R.y0 + R.h - R.cy) * fr, xl, R.cy + (R.y0 + R.h - R.cy) * fl]); fill(c, '#050407'); c.restore() }
    if (Math.abs(ca) < .14) { const e = 1 - Math.abs(ca) / .14; c.save(); c.globalAlpha *= e; rr(c, R.ax - 10, R.y0 + 30, 20, R.h - 60, 6); fill(c, '#3A2A1E'); c.fillStyle = 'rgba(255,230,200,.25)'; c.fillRect(R.ax - 10, R.y0 + 30, 4, R.h - 60); c.restore() }   // ребро доски
  }
  // ---------- фильм: «Осталось перевернуть саму доску» — правый нижний угол загибается ----------
  function curlK(t) { const a = T7; return eio(at(t, a.per - .1, a.dosk2 + .35)) * .55 }
  function curlCorner(c, t) {
    const k = curlK(t); if (k <= 0) return; const B = BRD5, L = lp(0, 340, k), x = B.x1, y = B.y1;
    c.save(); poly(c, [x - L, y, x, y, x, y - L]); fill(c, '#2a1d14');   // под загибом — стена
    poly(c, [x - L, y, x - L * 1.02, y - L * 1.02, x, y - L]); fill(c, '#3a2a1e'); c.save(); poly(c, [x - L, y, x - L * 1.02, y - L * 1.02, x, y - L]); c.clip();
    c.fillStyle = 'rgba(255,220,180,.08)'; for (let i = 0; i < 6; i++) c.fillRect(x - L * 1.1 + i * 50, y - L * 1.1, 2, L * 1.2); c.restore();
    poly(c, [x - L, y, x - L * 1.02, y - L * 1.02, x, y - L]); lnB(c, 3, 'rgba(255,236,190,.35)'); c.restore();
  }
  function boardCues5(Q) {
    const a = T7; Q(a.j + .05, 'wave', .5); Q(a.j + .3, 'splash', .45); Q(a.fl1 + .1, 'whoosh', .4); Q(a.sh1 - .1, 'papers', .3); Q(a.sh1, 'plop', .3);
    if (MODE === 'y') { Q(a.nov - .1, 'shimmer', .35); Q(a.per, 'pageflip', .4); Q(a.per + .3, 'papers', .3) }
    else { for (let i = 0; i < 5; i++) Q(a.ugad - .1 + i * .12, 'plop', .25, -.4 + i * .2); Q(a.ugad + .8, 'chain', .35); Q(a.obor - .3, 'whoosh', .45); Q(a.obor + .2, 'deep', .35); Q(a.obor + .8, 'whoosh', .35); Q(a.vEnd, 'stamp', .55); Q(a.end - .6, 'dive', .5); Q(a.end - .2, 'wave', .35) }
  }
  // ================= финал фильма (финал Б, f1–f4) — v22.2: собран заново по ТЗ Gemini =================
  // f1 «Так что вы знаете о никотине?» — свет гаснет до луча на доске, маркер пишет название на тёмной полосе над доской.
  // f2 — карточки вспыхивают на глаголах, из-под каждой выползает чек «СПОСОБ БРОСИТЬ».
  // f3 «Переверните доску» — настоящий 3D-поворот на 180° вокруг вертикали (перспектива, ребро, свет уходит); изнанка не пустая: фанера,
  // рамка, светлые отпечатки пяти карточек, острия пяти булавок. «все пять нитей» — из булавок выстреливают пять прямых, туго натянутых
  // красных нитей и симметричными лучами сходятся в центр; на «гигантам» там вырастают две башни — ар-деко R.J. Reynolds и стеклянный
  // монолит Philip Morris, подписи выше Y 1480. f4 «Змея кусает свой хвост» — нити одним движением стягиваются вокруг башен в ровное кольцо,
  // кольцо становится строгим графичным уроборосом: алое тело сужается к хвосту, угловатая голова с клыками смыкает челюсти на кончике хвоста.
  // «бросаете одно — продают следующее» — по концентрической орбите снаружи кольца идут четыре силуэта: Marlboro, IQOS, одноразка, ZYN.
  // В конце башни и доска уходят в темноту — остаются уроборос и крупное название «ЧТО ВЫ ЗНАЕТЕ О НИКОТИНЕ?».
  let T8 = null, KF = null;
  const TC = { x: 540, y: 1700 }, RR = 380, RI = 248;   // v22.3: продукты ходят по кругу ВНУТРИ кольца (RI), голова змеи до них не достаёт   // центр кольца (и точка схода нитей), радиус кольца, радиус орбиты
  function finalInit() {
    const f = (sc, q) => Ws(sc, q);
    T8 = { f0: K7[K7.length - 1][0], tak: f('f1', 'так'), nik: f('f1', 'никотине'), kur: f('f2', 'курят'), gre: f('f2', 'греют'), par: f('f2', 'парят'), klad: f('f2', 'кладут'), gubu: f('f2', 'губу'),
      prod: f('f2', 'продают'), bros: f('f2', 'бросить'), perev: f('f3', 'переверните'), dosku: f('f3', 'доску'), vse: f('f3', 'все'), niti: f('f3', 'нитей'), tyan: f('f3', 'тянутся'), gig: f('f3', 'гигантам'),
      zmeya: f('f4', 'змея'), kus: f('f4', 'кусает'), hvost: f('f4', 'хвост'), vy: f('f4', 'вы'), brosa: f('f4', 'бросаете'), odno: f('f4', 'одно'), prod2: f('f4', 'продают'), sled: f('f4', 'следующее'), vEnd: TLX.vEnd, end: TLX.endT };
    const a = T8; a.flip0 = a.perev - .1; a.flip1 = a.dosku + .9; a.fade0 = a.vEnd + .05; a.fade1 = a.vEnd + 1.1;
    const k7 = K7[K7.length - 1];
    KF = [k7, KY(a.tak, 540, 565, .87), KY(a.bros + .3, 540, 620, .97), KY(a.flip0, 540, 640, .92), KY(a.flip1, 540, 700, .88), KY(a.gig + .3, 540, 1040, .9),
      KY(a.zmeya + .1, 540, 1110, .88), KY(a.hvost + .4, 540, TC.y - 10, .86), KY(a.vEnd, 540, TC.y - 55, .93), KY(a.end, 540, TC.y - 90, 1.02)];   // до конца медленный наезд на змею — кадр не стоит
  }
  function titleStrip5(c, t, k, a = 1) {   // тёмная полоса над доской, маркер пишет название
    if (k <= 0 && a >= 1) { } const w = 1060, x0 = 540 - w / 2, y0 = -90;
    c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(0,0,0,.4)'; c.fillRect(x0 + 10, y0 + 14, w, 120); rr(c, x0, y0, w, 120, 6); fill(c, '#111116');
    c.save(); c.translate(x0 + 40, y0 - 4); c.rotate(-.2); c.fillStyle = 'rgba(240,230,190,.8)'; c.fillRect(-36, -12, 72, 24); c.restore(); c.save(); c.translate(x0 + w - 40, y0 - 4); c.rotate(.18); c.fillStyle = 'rgba(240,230,190,.8)'; c.fillRect(-36, -12, 72, 24); c.restore();
    if (k > 0) { const o = { f: 'M', w: 800, s: 58, c: '#F4F1EA', ls: 2, mw: w - 70 }, tw0 = Math.min(w - 60, tw(c, TEXT.title, o)); c.save(); c.beginPath(); c.rect(540 - tw0 / 2 - 4, y0, (tw0 + 8) * eo(k), 120); c.clip(); tx(c, TEXT.title, 540, y0 + 62, o); c.restore();
      if (k < 1) { const mx = 540 - tw0 / 2 + tw0 * eo(k); c.save(); c.translate(mx, y0 + 70); c.rotate(-.6); rr(c, -8, -70, 16, 64, 4); fill(c, '#D6334D'); rr(c, -8, -10, 16, 14, 3); fill(c, '#F4F1EA'); c.restore() } }
    c.restore();
  }
  function receipt5(c, x, y, k) {   // чек «СПОСОБ БРОСИТЬ» выползает из-под карточки
    if (k <= 0) return; const w = 190, h = 150 * eo(k); c.save(); c.beginPath(); c.rect(x - w / 2 - 4, y, w + 8, h + 12); c.clip();
    c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(x - w / 2 + 6, y + 8, w, h); c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x + w / 2, y); c.lineTo(x + w / 2, y + h);
    for (let i = 10; i >= 0; i--) c.lineTo(x - w / 2 + i * w / 10, y + h + (i % 2 ? 7 : 0)); c.closePath(); fill(c, '#FBFAF6');
    tx(c, TEXT.quit, x, y + h - 98, { f: 'M', w: 800, s: 22, c: '#1F2A44', mw: w - 24 }); c.fillStyle = '#1F2A44'; for (let i = 0; i < 16; i++) c.fillRect(x - 70 + i * 9, y + h - 66, i % 3 ? 3 : 5, 30);
    tx(c, '$ $ $', x, y + h - 20, { f: 'M', w: 800, s: 18, c: '#D6334D' }); c.restore();
  }
  // ---------- башни (по центру, подписи выше Y 1480 на экране) ----------
  // подпись башни видна, только когда она на экране выше 1460 (центр плашки): субтитры её не закрывают, пока башня встаёт и камера едет
  function capVis(c, x, y) { if (c.canvas.width !== WW || c.canvas.height !== HH) return 1; const m = c.getTransform(), sy = m.b * x + m.d * y + m.f; return 1 - at(sy, 1420, 1450) }
  function towerRJ5(c, x, top, w, k, capA = 1) {   // ар-деко R.J. Reynolds: уступы, шпиль, золотые вертикали
    if (k <= 0) return; const y = top + 900 * (1 - eo(k)); c.save();
    const steps = [[w, 0], [w * .8, -70], [w * .58, -130], [w * .36, -176]];
    steps.forEach(([ww, dy], i) => { const shade = mixc('#2E2C36', '#1E1C26', i * .15); c.fillStyle = shade; c.fillRect(x - ww / 2, y + dy, ww, 2400); c.fillStyle = 'rgba(0,0,0,.28)'; c.fillRect(x + ww * .22, y + dy, ww * .28, 2400);
      c.fillStyle = 'rgba(255,226,170,.25)'; c.fillRect(x - ww / 2, y + dy, ww, 3) });
    c.fillStyle = '#C9A24A'; for (let i = -2; i <= 2; i++) c.fillRect(x + i * w * .17 - 2.5, y + 14, 5, 2400); c.fillRect(x - 4, y - 290, 8, 120); circ(c, x, y - 292, 6, '#F2D27A');
    for (let r = 0; r < 26; r++) for (let i = -2; i < 2; i++) { const on = H1(r * 7.1 + i * 3) > .55; c.fillStyle = on ? 'rgba(255,214,140,.55)' : 'rgba(0,0,0,.25)'; c.fillRect(x + i * w * .17 + 6, y + 40 + r * 44, w * .17 - 12, 22) }
    const cv = at(k, .75, 1) * capVis(c, x, y + 92) * capA; if (cv > 0) { c.save(); c.globalAlpha *= cv; rr(c, x - 125, y + 60, 250, 62, 10); fill(c, '#111116'); rr(c, x - 125, y + 60, 250, 62, 10); lnB(c, 3, '#C9A24A'); tx(c, OBJ.rj, x, y + 92, { f: 'M', w: 800, s: 30, c: '#E9C66A', ls: 2, mw: 226 }); c.restore() }
    c.restore();
  }
  function towerPM5(c, x, top, w, k, capA = 1) {   // монолит Philip Morris: тёмное стекло, сетка окон, косой блик
    if (k <= 0) return; const y = top + 900 * (1 - eo(k)); c.save();
    c.fillStyle = '#26344F'; c.fillRect(x - w / 2, y, w, 2400); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(x + w * .2, y, w * .3, 2400);
    c.fillStyle = 'rgba(170,205,245,.3)'; for (let r = 0; r < 40; r++) for (let i = 0; i < 5; i++) c.fillRect(x - w / 2 + 12 + i * (w - 24) / 5, y + 18 + r * 40, (w - 24) / 5 - 7, 26);
    c.save(); c.beginPath(); c.rect(x - w / 2, y, w, 2400); c.clip(); c.fillStyle = 'rgba(255,255,255,.12)'; poly(c, [x - w / 2, y + 300, x - w / 2 + 40, y, x + 10, y, x - w / 2, y + 520]); c.fill(); c.restore();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x - w / 2, y, w, 4); c.fillRect(x - w / 2 + 5, y, 4, 2400);
    const cv = at(k, .75, 1) * capVis(c, x, y + 102) * capA; if (cv > 0) { c.save(); c.globalAlpha *= cv; rr(c, x - 125, y + 70, 250, 62, 10); fill(c, '#111116'); rr(c, x - 125, y + 70, 250, 62, 10); lnB(c, 3, '#9DB6D9'); tx(c, OBJ.pmT, x, y + 102, { f: 'M', w: 800, s: 30, c: '#E8EEF8', ls: 2, mw: 226 }); c.restore() }
    c.restore();
  }
  // ---------- нити: прямые струны от булавок изнанки к центру; потом стягиваются в кольцо ----------
  function strings5(c, t, shoot, wrap) {   // shoot 0..1 — нити выстреливают; wrap 0..1 — нити гнутся в кольцо вокруг башен
    const P = BPIN(), ord = [3, 0, 1, 2, 4], n = 40;
    ord.forEach((pi, j) => { const [px, py] = P[pi], u = eo(cl(shoot * 1.6 - j * .15)); if (u <= 0) return;
      const tw = Math.exp(-6 * Math.max(0, shoot * 1.6 - j * .15 - 1)) * (u >= 1 ? 1 : 0), vib = s => Math.sin(Math.PI * s) * 9 * tw * Math.sin((t - T8.niti) * 60);   // струна дрожит и замирает
      const a0 = -Math.PI / 2 + .06 + j * (TAU - .13) / 5, a1 = -Math.PI / 2 + .06 + (j + 1) * (TAU - .13) / 5;
      const pts = []; for (let i = 0; i <= n; i++) { const s = i / n * u, lx = lp(px, TC.x, s), ly = lp(py, TC.y, s), dx = -(TC.y - py), dy = TC.x - px, L = Math.hypot(dx, dy) || 1;
        const ax = lx + dx / L * vib(s), ay = ly + dy / L * vib(s), ang = lp(a0, a1, s), rx = TC.x + Math.cos(ang) * RR, ry = TC.y + Math.sin(ang) * RR, e = eio(wrap);
        pts.push([lp(ax, rx, e), lp(ay, ry, e)]) }
      c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x + 3, y + 5) : c.moveTo(x + 3, y + 5)); lnB(c, 6, 'rgba(0,0,0,.3)');
      c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); lnB(c, 6, '#D6334D'); c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x - 1, y - 1.5) : c.moveTo(x - 1, y - 1.5)); lnB(c, 1.6, 'rgba(255,190,190,.7)');
      if (u < 1) { const [hx, hy] = pts[pts.length - 1]; glow(c, hx, hy, 30, '#FFB0B0', .6); circ(c, hx, hy, 6, '#FFE0E0') } });
    if (shoot >= .99 && wrap <= 0) { glow(c, TC.x, TC.y, 70, '#FF6A6A', .35 * Math.min(1, (t - T8.tyan) * 2)) }
  }
  // ---------- четыре силуэта на орбите снаружи кольца ----------
  function prodIcon(c, kind) {
    circ(c, 0, 0, 58, '#141016'); ring(c, 0, 0, 58, 'rgba(244,241,234,.55)', 3);
    if (kind === 'marl') { c.save(); c.scale(.42, .42); pack3(c, -60, -95, 110, 170, { d: 36, shadow: false }); c.restore() }
    else if (kind === 'iqos') iqos4(c, 0, 0, 96, { shadow: false, name: false });
    else if (kind === 'vape') { rr(c, -15, -42, 30, 84, 10); fill(c, B2.mango); c.save(); rr(c, -15, -42, 30, 84, 10); c.clip(); poly(c, [-15, 2, 15, -10, 15, 44, -15, 44]); fill(c, B2.ice2); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-10, -36, 5, 72); c.restore(); rr(c, -9, -52, 18, 12, 4); fill(c, '#2A2F55') }
    else tin5(c, 0, -12, 40, .5, 0, { name: OBJ.zyn, h: .7, shadow: false });
  }
  function carousel5(c, t, a, out) {
    const k = at(t, a.vy - .15, a.vy + .35); if (k <= 0 || out >= 1) return;
    const step = eio(at(t, a.prod2 - .1, a.sled + .25)) * Math.PI / 2, rot = step + (t - a.vy) * .3;   // v22.3: круговорот внутри кольца
    ['marl', 'iqos', 'vape', 'zyn'].forEach((kd, i) => { const an = -Math.PI / 4 + i * Math.PI / 2 + rot, x = TC.x + Math.cos(an) * RI, y = TC.y + Math.sin(an) * RI;
      c.save(); c.globalAlpha *= 1 - out; c.translate(x, y); const s = bo(cl(k * 1.3 - i * .1)) * .95; c.scale(s, s); prodIcon(c, kd); c.restore() });
    c.save(); c.globalAlpha *= .35 * k * (1 - out); c.setLineDash([6, 12]); c.beginPath(); c.arc(TC.x, TC.y, RI, 0, TAU); lnB(c, 2, 'rgba(244,241,234,.6)'); c.restore();
  }
  function finalShot(c, t) {
    const a = T8, q = camObj(camAt(KF, t)), fk = eio(at(t, a.flip0, a.flip1)), ang = Math.PI * fk;
    const flashW = [[a.par, 0], [a.par, 1], [a.gre, 2], [a.kur, 3], [a.klad, 4]];
    const flash = i => { const w = flashW.find(f => f[1] === i)[0]; return Math.sin(Math.PI * at(t, w - .1, w + .55)) };
    const fade = eio(at(t, a.fade0, a.fade1)), dim = at(t, a.f0 + .4, a.tak + .2), shoot = at(t, a.niti - .35, a.tyan + .45), wrap = at(t, a.zmeya - .1, a.kus + .35);
    const front = g => { boardWorld5(g, t, { tO: t - 200, flash, noWall: true }); curlCorner(g, t);
      CARDS5.forEach((cd, i) => { const f = flash(i); if (f > 0) { rr(g, cd.x - CW5 / 2 - 8, cd.y - CH5 / 2 - 8, CW5 + 16, CH5 + 16, 10); lnB(g, 6, rgba('#FFD23F', f)) }
        receipt5(g, cd.x, cd.y + CH5 / 2 - 8, at(t, a.prod - .1 + i * .1, a.bros + .2 + i * .1)) }) };
    layer(c, q, 1, cc => {
      wallBg5(cc);
      if (fk > 0 && fk < 1) flipBoard(cc, ang, front, g => boardBack5(g, t, {}));
      else if (fk <= 0) front(cc); else { const bF = 1 - eio(at(t, a.kus, a.hvost + .3)); if (bF > 0) { cc.save(); cc.globalAlpha *= bF; boardBack5(cc, t, {}); cc.restore() } }   // v22.3: изнанка уходит, пока нити становятся змеёй — край доски сверху не торчит
      if (dim > 0) { const g = cc.createRadialGradient(540, 640, 420, 540, 700, 1500); g.addColorStop(0, 'rgba(6,4,10,0)'); g.addColorStop(1, `rgba(6,4,10,${.72 * dim})`); cc.fillStyle = g; cc.fillRect(-3000, -3000, 7000, 7000) }
      titleStrip5(cc, t, at(t, a.tak, a.nik + .55), 1 - at(t, a.zmeya, a.hvost));
      const tw = [at(t, a.gig - .55, a.gig + .35), at(t, a.gig - .4, a.gig + .5)];
      if (fade < 1) { cc.save(); cc.globalAlpha *= 1 - fade; const cA = 1 - at(t, a.vy - .35, a.vy - .05); towerRJ5(cc, TC.x - 168, TC.y - 280, 190, tw[0], cA); towerPM5(cc, TC.x + 168, TC.y - 250, 180, tw[1], cA); cc.restore() }   // v22.3: в конце башни и таблички гаснут до нуля
      if (wrap < 1) strings5(cc, t, shoot, wrap);
      if (fade > 0) { cc.save(); cc.globalAlpha *= fade; cc.fillStyle = '#050407'; cc.fillRect(-3000, -3000, 7000, 7000); cc.restore() }
      if (wrap > .85) { const kw = eio(at(wrap, .85, 1)) * 1 + 0, jaw = 1 - eio(at(t, a.hvost - .25, a.hvost + .05));   // кольцо → тело змеи, голова смыкается на хвосте («хвост»)
        if (wrap < 1) { cc.save(); cc.globalAlpha *= at(wrap, .85, 1); }
        const u0 = Math.max(0, t - (a.kus + .35)), th = .85 * (u0 - .5 * (1 - Math.exp(-u0 / .5)));   // v22.3: змея ползёт по кругу — плавный разгон, дальше ровно
        cc.save(); cc.translate(TC.x, TC.y); cc.rotate(th); cc.translate(-TC.x, -TC.y);
        ouro5(cc, t, TC.x, TC.y, RR, { kw: Math.max(.12, kw), kh: at(t, a.kus - .2, a.kus + .3), jaw, hs: 1.45, w: 58, gap: .13, wv: 3 * at(u0, 0, .6), ph: t * 1.6, gl: u0 > 0 ? (u0 * .45) % 1 : null });
        cc.restore();
        if (wrap < 1) cc.restore();
        const fl = Math.sin(Math.PI * at(t, a.hvost, a.hvost + .4)); if (fl > 0) glow(cc, TC.x, TC.y - RR, 120, '#FF8080', .5 * fl) }
      carousel5(cc, t, a, at(t, a.fade0 - .1, a.fade0 + .5));
    });
    const kt = eio(at(t, a.fade0 + .2, a.fade0 + .9)); if (kt > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha *= kt;   // крупное чистое название
      TEXT.titleL.forEach((L, i) => tx(c, L, 540, 360 + i * 104 + 14 * (1 - kt), { f: 'M', w: 800, s: 82, c: '#F4F1EA', ls: 2, mw: 980 })); c.restore() }
  }
  function finalCues(Q) {
    const a = T8; Q(a.f0 + .4, 'buzz', .3); Q(a.tak, 'marker', .45); Q(a.tak + .6, 'marker', .35);
    [a.kur, a.gre, a.par, a.klad].forEach((w, i) => Q(w, 'shimmer', .3, [-.2, -.4, .1, .4][i])); for (let i = 0; i < 5; i++) Q(a.prod + i * .1, 'receipt', .3, -.4 + i * .2);
    Q(a.flip0, 'whoosh', .55); Q(a.flip0 + .7, 'pageflip', .35); Q(a.flip1 - .1, 'thud', .45); for (let i = 0; i < 5; i++) Q(a.niti - .3 + i * .1, 'whip', .28, -.4 + i * .2); Q(a.gig - .4, 'factory', .45); Q(a.gig, 'boom', .35);
    Q(a.zmeya, 'scuttle', .35); Q(a.hvost, 'chomp', .5); Q(a.vy, 'whoosh', .3); Q(a.prod2, 'register', .4); Q(a.fade0, 'deep', .45);
  }
  // ================= сборка главы 5: миры подряд, одна камера, плашка года, кадр, звуки =================
  // Фильм: доска (карточка 2022, маркер осыпается) → нырок в фото: океан → офис → Швеция → стол → заправка/улица → кабинет FDA → школа → доска → финал.
  // Шортс: кадр 0 — океан; в конце нырок в фото карточки 2022 = снова кадр 0 (петля). На каждом стыке у миров общие ключи камеры (linkK).
  const SEG = []; let INITED = false;
  function keys() { return { endT: TLX.endT, b0: TLX.b0, vEnd: TLX.vEnd, fin: TLX.fin } }
  function allInit() {
    if (INITED) return; INITED = true;
    oceanInit(); if (MODE === 'y' && typeof boardStartInit === 'function') boardStartInit();
    officeInit(); swedenInit(); tableInit();
    if (typeof fdaInit === 'function') fdaInit();
    if (typeof schoolInit === 'function') schoolInit();
    if (typeof boardInit5 === 'function') boardInit5();
    if (MODE === 'y' && typeof finalInit === 'function') finalInit();
    const W = (a, b) => SHUT.push([a, b]);
    W(T1.dive - .5, T1.dive + .3); W(T2.jw - .35, T2.jw + .25); W(T3.vyzh - .2, T3.iz + .2); W(T3.iz + .2, T3.shvedy + .1); W(T3.crack - .1, T3.land + .15);
    W(T3.junk - .2, T3.junk + .7); W(T5.dive0 + .3, T5.jdive + .25); W(T7.fl1 - .1, T7.sh1 + .1); if (MODE === 'y') { W(.45, 1.2); W(T8.flip0, T8.flip1) } else W(T7.end - .65, T7.end + .1);
    if (MODE === 'y' && typeof boardStartShot === 'function') SEG.push([-1e9, boardStartShot], [T0.j0, oceanShot]); else SEG.push([-1e9, oceanShot]);
    SEG.push([T0.sw, officeShot], [T1.dive, swedenShot], [T2.jw, tableShot]);
    if (typeof fdaShot === 'function') SEG.push([T3.junk, fdaShot]);
    if (typeof schoolShot === 'function') SEG.push([T5.jdive, schoolShot]);
    if (typeof boardShot5 === 'function') SEG.push([T6.jout, boardShot5]);
    if (MODE === 'y' && typeof finalShot === 'function') SEG.push([T8.f0, finalShot]);
  }
  function scene(c, t) { allInit(); let f = SEG[0][1]; for (const s of SEG) if (t >= s[0]) f = s[1]; f(c, t) }
  let HY = null;
  function hud(c, t) {   // плашка года — только вперёд: 2022 → 2024 → 2025, гаснет на «Пять лет назад» (2020 — назад нельзя), 2026 — до доски / вопроса
    if (!HY) HY = { t22: Ws('b1', 'через'), t24: Ws('s6', 'два'), t25: Ws('s7', 'двадцать'), out1: Ws('s8', 'пять') - .15, t26: Ws('s9', 'двадцать'),
      out2: MODE === 'y' ? SA('s12') - .2 : Ws('q', 'угадаете') - .5 };
    const h = HY, pill = (y0, y1, k, dy = 0) => { c.save(); c.setTransform(1, 0, 0, 1, 0, dy); yearPill(c, y0, y1, k, 1, true); c.restore() };
    if (t < h.t22 - .25) return;
    if (t < h.t24 - .3) return pill(2022, 2022, 1, -240 * (1 - eo(at(t, h.t22 - .25, h.t22 + .15))));
    if (t < h.t25 - .3) return pill(2022, 2024, at(t, h.t24 - .15, h.t24 + .35));
    if (t < h.out1 + .45) return pill(2024, 2025, at(t, h.t25 - .15, h.t25 + .35), -240 * ei(at(t, h.out1, h.out1 + .45)));
    if (t < h.t26 - .25) return;
    if (t < h.out2 + .45) return pill(2026, 2026, 1, -240 * (1 - eo(at(t, h.t26 - .25, h.t26 + .15))) - 240 * ei(at(t, h.out2, h.out2 + .45)));
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
    const o = T0; Q(Math.max(.05, o.fil - 1.2), 'wave', .35); Q(o.fil, 'plop', .3, .3); Q(o.cher, 'shimmer', .2); Q(o.zap, 'chain', .35, .3); Q(o.zap + .5, 'splash', .4); Q(o.shest, 'counter', .45); Q(o.dazhe, 'drawer', .3); Q(o.tab, 'marker', .35);
    Q(o.fly, 'whoosh', .45); Q(o.sw + .2, 'papers', .35);
    const f = T1; Q(f.vid, 'plop', .25, -.2); Q(f.sly, 'plop', .25); Q(f.pah, 'plop', .25, .2); Q(f.gub - .2, 'xray', .4); Q(f.shch, 'glassbulb', .35); Q(f.krov, 'shimmer', .25);
    Q(f.dym, 'puff', .25, -.3); Q(f.par, 'puff', .25, .3); Q(f.cab0, 'whoosh', .35); Q(f.sam, 'bell', .25); Q(f.dive - .2, 'dive', .5);
    const s = T3; Q(T2.jw - .1, 'whoosh', .35); Q(s.nast - .3, 'scuttle', .35, .4); Q(s.tab - .3, 'drawer', .3); Q(s.net, 'xray', .4); Q(s.nik, 'shimmer', .3); Q(s.vyzh, 'chain', .35); Q(s.ego, 'thud', .45);
    Q(s.iz, 'glassbulb', .4); Q(s.shvedy, 'plop', .3); Q(s.malb - .3, 'scuttle', .35, .4); Q(s.kupil, 'drawer', .35); Q(s.komp, 'whoosh', .35); Q(s.tsel, 'glass', .4); Q(s.zav, 'plop', .35, .3);
    Q(s.crack - .3, 'glass', .45, .3); Q(s.crack, 'icecrack', .5, .3); Q(s.fall, 'whoosh', .5); Q(s.land - .1, 'coins', .5); Q(s.smeli, 'scuttle', .55); Q(s.smeli + .4, 'scuttle', .45, .3);
    Q(s.ajk, 'buzz', .3); Q(s.japo, 'flutter', .3); Q(s.chet, 'whoosh', .4); Q(s.chet + .3, 'city', .3); Q(s.prod, 'conveyor', .3); Q(s.shest, 'counter', .5);
    if (typeof fdaCues === 'function') fdaCues(Q); if (typeof schoolCues === 'function') schoolCues(Q); if (typeof boardCues5 === 'function') boardCues5(Q); if (MODE === 'y' && typeof finalCues === 'function') finalCues(Q);
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    sub: { init: null, scene: (c, t) => scene(c, t), frameTo: (c, t) => frameTo(c, t) },
    init(tl, SC, sub) {
      TLW = tl.sent.flatMap(s => s.words); TLS = tl.sent; const ep = String(tl.ep || '').replace(/-(ru|en|de)$/, '');
      setLang(tl.lang || (String(tl.ep || '').match(/-(ru|en|de)$/) || [])[1] || 'ru');
      MODE = /y$/.test(ep) ? 'y' : 's';
      TLX = { b0: tl.b0, vEnd: tl.vEnd, fin: tl.fin, endT: (Math.ceil(tl.dur * 30) - 1) / 30 };
      K = keys(); SEG.length = 0; SHUT.length = 0; HY = null; INITED = false; CHUNKS = buildChunks(tl.subs);
      if (!sub) { window.__K = K; cues(); window.CUES_READY = 1 } else allInit();
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v220f')) { const st = document.createElement('style'); st.id = 'v220f';
        st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join('')
          + ['latin', 'cyrillic'].map(sub => `@font-face{font-family:P;font-weight:700;font-style:normal;src:url(fonts/playfair-${sub}-700-normal.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}@font-face{font-family:P;font-weight:400 700;font-style:italic;src:url(fonts/playfair-${sub}-700-italic.woff2)${sub === 'cyrillic' ? ';unicode-range:U+0400-04FF' : ''}}`).join('');
        document.head.appendChild(st) }
      cv = mk(WW, HH); if (!sub) { cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain')) }
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      if (!IMG14) { IMG14 = new Image(); IMG14.src = 'ep/v210-ph2014.png' }   // v22.2: фото карточки 2014 из последнего кадра главы 4 (node v170tools/ph14.mjs v210y-ru 720 ep/v210-ph2014.png)
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U', '700 20px P', 'italic 700 20px P', 'italic 400 20px P'].map(f => document.fonts.load(f, 'АЯaz09$')).concat([IMG14.decode().catch(() => 0)])).then(() => 0);
    },
  };
  { const ep = window.EP; ep.sub.init = tl => ep.init(tl, [], true) }
  window.__dbg = { camAt, get K() { return { K0, K1, K2, K3, K5, K6, K7, KF, KJ5 } }, get T() { return { T0, T1, T2, T3, T5, T6, T7, T8 } }, get SEG() { return SEG } };
})();
