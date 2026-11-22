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
    T0.j0 = MODE === 'y' ? SA('b1') - .1 : 0;   // v22.4: фильм — волна стыка 4 → 5 открывает океан к началу b1 (80-board.js)
    K0 = [KY(T0.j0, 540, 960, 1.0), KY(a.zap - .4, 548, 940, 1.1), KY(a.mlrd, 560, 1010, 1.26), KY(a.dazhe, 548, 1060, 1.42), KY(a.fly + .1, 540, 1110, 1.62)];
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
  function oceanWorld(c, t, q, o = {}) {   // o.noTin — без баночки (v22.4: в фото 2022 на доске, пока баночка едет на гребне волны)
    const a = T0, up = eio(at(t, a.zap - .05, a.zap + .7));
    layer(c, q, .15, cc => { P0(cc, .15); oceanSky(cc, t) }); layer(c, q, .35, cc => { P0(cc, .35); oceanShore(cc, t) });   // P0: дальний план при камере (540, 960, 1) — на своём месте
    layer(c, q, .55, cc => { P0(cc, .55); seaRows(cc, t, 830, 1000, 5, false) });
    layer(c, q, .7, cc => { P0(cc, .7); quay5(cc, t, up);   // ценник висит на стреле шлагбаума, пока её не подняли
      const hang = 1 - eio(at(t, a.zap - .05, a.zap + .5)); if (hang > 0 && t < a.shest) { const [hx, hy] = barArm(t, up, 260); cc.save(); cc.globalAlpha *= hang; const sw = Math.sin(t * 2.2) * .08; cc.translate(hx, hy + 8); cc.rotate(sw);
        cc.beginPath(); cc.moveTo(0, 0); cc.lineTo(0, 62); lnB(cc, 2, 'rgba(244,234,212,.8)'); priceTag(cc, 0, 98, .62 * eo(at(t, a.fil - .1, a.fil + .3)), 1, 0); cc.restore() } });
    layer(c, q, 1, cc => seaRows(cc, t, 1000, 1500, 6, false));
    layer(c, q, 1, cc => sand(cc, t, at(t, a.zap, a.zap + 1.6)));
    layer(c, q, 1, cc => { const p = tinPos0(t);
      if (!o.noTin) { cc.save(); cc.translate(p.x, p.y); cc.rotate(p.r); tin5(cc, 0, 0, p.R, p.ty, p.lid, { skip: t > a.fly ? 1 : -1, shc: 'rgba(4,8,26,.4)' }); cc.restore() }
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

  // ================= v23.1 (22.11): предметы глав 3–5 картинками для пролога (ep/v231spr.js — только для v231_spr.mjs) =================
  // Пачка Marlboro (pack3) и сигарета (cig3) — глава 3/4, айкос (iqos4) — глава 4, «Джул» (juul5) и баночка снюса (tin5) — глава 5.
  // Одноразка «манго-лёд» — как vapeBody главы 2 (ep/v191/10-b1.js), без надписи.
  setLang('ru');
  function iceVape(c, x0, y0, w, h) {   // глава 2: корпус манго, ледяной косой срез, тёмный мундштук с инеем
    const x1 = x0 + w, y1 = y0 + h, r = 46, mt = y0 - h * .2;
    poly(c, [x0 + w * .16, y0 + 2, x1 - w * .16, y0 + 2, x1 - w * .3, mt, x0 + w * .3, mt]); cel(c, x0 + w * .16, mt, w * .68, y0 - mt, '#2a2f55', { hw: .08 });
    poly(c, [x0 + w * .16, y0 + 2, x1 - w * .16, y0 + 2, x1 - w * .3, mt, x0 + w * .3, mt]); lnB(c, 4);
    c.beginPath(); c.moveTo(x0 + w * .28, mt + 4); for (let i = 0; i <= 10; i++) { const xx = lp(x0 + w * .28, x1 - w * .28, i / 10); c.lineTo(xx, mt - 6 - (10 + 8 * Math.sin(i * 1.9))) } c.lineTo(x1 - w * .28, mt + 4); c.closePath(); fill(c, '#f4fbff');
    rr(c, x0, y0, w, h, r); c.save(); c.fillStyle = B2.mango; c.fill(); c.clip();
    poly(c, [x0 - 10, y0 + h * .48, x1 + 10, y0 + h * .26, x1 + 10, y1 + 10, x0 - 10, y1 + 10]); fill(c, B2.ice2);
    for (let i = 0; i < 14; i++) ring(c, x0 + 24 + H1(i * 3.3) * (w - 48), y0 + h * (.42 + .5 * H1(i * 7.7)), 3 + H1(i) * 7, 'rgba(255,255,255,.55)', 2);
    c.fillStyle = 'rgba(20,23,51,.28)'; c.fillRect(x0 + w * .75, y0 - 4, w * .25 + 8, h + 8);
    rr(c, x0 + w * .08, y0 + h * .08, Math.max(6, w * .1), h * .8, 20); fill(c, 'rgba(255,255,255,.35)');
    c.restore(); rr(c, x0, y0, w, h, r); lnB(c, 4);
    circ(c, x0 + w / 2, y1 - h * .1, 7, '#fff6ee');
  }
  function stick(c, x, y0, y1, r) {   // стик: белая бумага, коричневый фильтр сверху
    rr(c, x - r, y0, r * 2, y1 - y0, r * .3); cel(c, x - r, y0, r * 2, y1 - y0, '#f5f1e8', { sw: .3 }); rr(c, x - r, y0, r * 2, (y1 - y0) * .4, r * .3); cel(c, x - r, y0, r * 2, (y1 - y0) * .4, '#d6a96e', { sw: .3 });
    rr(c, x - r, y0, r * 2, y1 - y0, r * .3); lnB(c, 2.5, 'rgba(20,23,51,.35)');
  }
  const SPRD = {   // [ширина, высота, рисовка в рамке (0,0)–(w,h)]
    cig: [560, 700, c => { pack3(c, 140, 150, 250, 380, { d: 96, ang: 24, shadow: false }); cig3(c, 30, 640, 470, 586, 19, { tip: '#d9a35a', tl: .24, ring: '#e8c56a' }) }],
    pod: [260, 760, c => { c.save(); c.translate(130, 700); c.scale(2.3, 2.3); juul5(c, 0, 0, 1, 0); c.restore() }],
    ice: [360, 760, c => { iceVape(c, 70, 180, 220, 540) }],
    heat: [300, 820, c => { stick(c, 150, 40, 260, 30); c.save(); c.translate(150, 520); c.rotate(-Math.PI / 2); iqos4(c, 0, 0, 560, { name: true, leds: 3 }); c.restore() }],
    tin: [640, 520, c => { tin5(c, 320, 210, 250, .55, 1, { n: 9, h: .5, shadow: false }) }],
  };
  window.SPR = { list: Object.keys(SPRD), draw(name, S = 3) { const [w, h, f] = SPRD[name], cv = mk(w * S, h * S), g = cv.getContext('2d'); g.scale(S, S); f(g); return cv.toDataURL('image/png') } };
})();
