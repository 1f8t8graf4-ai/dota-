// v23.0 (21.11) — пролог фильма «Что вы знаете о никотине?» (ТЗ Gemini «ПРОЛОГ ДЛЯ ПОЛНОГО YOUTUBE-ФИЛЬМА», вариант текста 2 — выбор Андрея).
// Без голоса (Андрей: «добро на интро, на голос — нет»): субтитры по черновому таймлайну v230_tl.py, темп Макса. Время событий — по номерам слов (ANCH).
// Тёмная сцена, тот же титул, что в финале; янтарное ядро никотина; пять оболочек без марок (сигарета → нагреватель → под → одноразка → банка
// с пакетиками) превращаются одна в другую (flubber); три «лица» оболочки (упаковка, вкус, обещания) — на «но не суть» оболочка трескается и падает.
// Конец: вокруг ядра вырастает корпус одноразки — это кадр 0 главы 1 в миниатюре (красный корпус, капсула, белое кольцо). Ядро стекает в капсулу,
// кольцо застёгивает её снизу вверх, камера ныряет в корпус — последний кадр = кадр главы 1 за 1/30 с до её кадра 0 (её код перенесён сюда: ep/v230/30-ch1.js).
(function () {
  'use strict';
  const WW = 1080, HH = 1920, CX = WW / 2, CY = HH / 2, TAU = Math.PI * 2, SUBY = 1720;
  let cv = null, X = null, K = null, TLW = [], TLX = {}, MODE = 'y', CHUNKS = [], LANG = 'ru';
  let FT = 0;   // v21.1: время кадра — числа на счётчиках считаем по нему, иначе в размытии движения (4 момента за полкадра) цифры двоятся
  window.CUES = window.CUES || {};
  const cue = (t0, name, gain = 1, pan = 0) => { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, pan] };
  const nw = s => String(s).toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
  function Wd(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.a } throw new Error('v230: нет слова «' + q + '» #' + n) }
  let TLS = [];
  function Ws(sc, q, n = 0) { const s = TLS.find(x => x.scene === sc); if (!s) return null; let k = 0; for (const w of s.words) if (nw(w.d) === q) { if (k++ === n) return w.a } throw new Error('v230: нет слова «' + q + '» во фразе ' + sc) }
  function WsB(sc, q, n = 0) { const s = TLS.find(x => x.scene === sc); if (!s) return null; let k = 0; for (const w of s.words) if (nw(w.d) === q) { if (k++ === n) return w.b } throw new Error('v230: нет слова «' + q + '» во фразе ' + sc) }
  const SA = sc => { const s = TLS.find(x => x.scene === sc); return s ? s.a : null }, SB = sc => { const s = TLS.find(x => x.scene === sc); return s ? s.b : null };
  function WdB(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.b } throw new Error('v230: нет слова «' + q + '» #' + n) }
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
      if (/[.,!?…:;—–]$/.test(w.d) || !nx || nx.a - w.b > .35) flush();
    });
    out.forEach((ch, i) => { const nx = out[i + 1]; ch.e = nx ? Math.min(nx.a - .02, ch.b + .6) : Math.min(ch.b + .45, TLX.endT - .3); ch.s = ch.s.replace(/\.\.\./g, '…').replace(/\s*[—–]\s*/g, ' ').replace(/[.,;:]+$/, '').trim() });   // v23.0: тире — пауза, в субтитре его нет; последний гаснет до нырка   // v20.2: в фильме последний субтитр уходит до отъезда на доску
    return out.filter(ch => ch.s);
  }
  function subs(c, t) {
    const ch = CHUNKS.find(x => t >= x.a - .05 && t < x.e); if (!ch) return;
    if (K && K.noSub && K.noSub(ch)) return;   // v23.0: первая фраза — это титул, субтитром её не дублируем
    let a = eo(at(t, ch.a - .05, ch.a + .1)) * (1 - at(t, ch.e - .12, ch.e));
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
  // ================= тексты и привязка событий к словам (по номерам слов — у EN/DE свои номера, голоса пока нет) =================
  const TITLE_L = {   // титул — слово в слово как в финале фильма (ep/v220/10-text.js, titleL): кольцо — фильм начинается и кончается этим вопросом
    ru: [['ЧТО', 'ВЫ', 'ЗНАЕТЕ'], ['О', 'НИКОТИНЕ?']],
    en: [['WHAT', 'DO', 'YOU', 'KNOW'], ['ABOUT', 'NICOTINE?']],
    de: [['WAS', 'WISST', 'IHR'], ['ÜBER', 'NIKOTIN?']],
  };
  // [фраза, № слова]: форма 1–5 (сигарета, нагреватель, под, одноразка, банка); три «лица» оболочки; трещина; вспышка ядра; рост корпуса; молния
  const ANCH = {
    ru: { form: [['s2', 0], ['s2', 4], ['s2', 6], ['s2', 9], ['s2', 12]], face: [['s3', 1], ['s3', 2], ['s3', 4]], crack: ['s3', 5], flare: ['s3', 7], grow: ['s4', 0], zip: ['s4', 2] },
    en: { form: [['s2', 0], ['s2', 4], ['s2', 6], ['s2', 9], ['s2', 12]], face: [['s3', 1], ['s3', 3], ['s3', 6]], crack: ['s3', 8], flare: ['s3', 9], grow: ['s4', 0], zip: ['s4', 4] },
    de: { form: [['s2', 0], ['s2', 5], ['s2', 8], ['s2', 10], ['s2', 14]], face: [['s3', 0], ['s3', 1], ['s3', 3]], crack: ['s3', 6], flare: ['s3', 7], grow: ['s4', 0], zip: ['s4', 5] },
  };
  const WA = ([sc, i]) => { const s = TLS.find(x => x.scene === sc); if (!s) throw new Error('v230: нет фразы ' + sc); const w = s.words[Math.min(i, s.words.length - 1)]; return w.a };
  const WB = ([sc, i]) => { const s = TLS.find(x => x.scene === sc); const w = s.words[Math.min(i, s.words.length - 1)]; return w.b };
  function keys() {
    const A = ANCH[LANG] || ANCH.ru, s1 = TLS.find(x => x.scene === 's1'), TE = TLX.endT;
    const k = {
      TE, TE1: TE - 1 / 30,                                         // кадр 0 главы 1 и последний кадр пролога (= глава 1 за 1/30 с до кадра 0)
      tw: s1.words.map(w => w.a), s1b: s1.b, s2: SA('s2'),
      form: A.form.map(WA), face: A.face.map(WA), crack: WA(A.crack), flare: WA(A.flare), grow: WA(A.grow), zip: WA(A.zip),
    };
    k.beat0 = k.tw[k.tw.length - 1];                                  // ядро «бьётся» с последнего слова титула
    k.dive0 = Math.max(k.zip + .95, TE - 1.05); k.dive1 = k.TE1;     // нырок кончается ровно на последнем кадре
    k.pour = [k.grow + .3, k.grow + .7];                              // ядро стекает в капсулу
    k.zipE = Math.min(k.zip + .62, k.dive0 - .2);                     // кольцо дошло до верха капсулы — это кадр 0 главы 1
    k.noSub = ch => ch.a < s1.b + .05;
    return k;
  }
  // ================= пять оболочек без марок: контуры (по часовой стрелке), превращения — flubber (vendor/, MIT) =================
  // Координаты оболочки: (0, 0) — точка ядра на сцене (540, 980). Одноразка — ровно силуэт корпуса из конца пролога (кадр 0 главы 1 в миниатюре, S0).
  const FLB = window.flubber, MCACHE = {};
  function morphF(key, a, b) { return MCACHE[key] || (MCACHE[key] = FLB.interpolate(a, b, { string: false, maxSegmentLength: 5 })) }
  const S0 = .32, DEV0 = { x: 540, y: 980 }, DEVC = { x: 540, y: 800 };   // корпус на сцене: точка (540, 800) кадра главы 1 (середина капсулы) — в ядре
  const toSh = (x, y) => [(x - DEVC.x) * S0, (y - DEVC.y) * S0];
  function arcPts(o, cx, cy, rx, ry, a0, a1, n) { for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]) } return o }
  function rrPts(x0, y0, x1, y1, r, n = 10) {   // скруглённый прямоугольник, начало — верхний левый угол после дуги
    const o = [], P = Math.PI;
    arcPts(o, x1 - r, y0 + r, r, r, -P / 2, 0, n); arcPts(o, x1 - r, y1 - r, r, r, 0, P / 2, n); arcPts(o, x0 + r, y1 - r, r, r, P / 2, P, n); arcPts(o, x0 + r, y0 + r, r, r, P, P * 1.5, n);
    return o;
  }
  const P2 = Math.PI / 2;
  const SH = {
    cig: rrPts(-46, -315, 46, 315, 10),                                                     // 1924: сигарета стоя, фильтр снизу
    heat: (() => {                                                                          // 2014: держатель-«ручка», сверху торчит стик
      const o = [], R = 75, cy = -105, a = Math.asin(27 / R);
      o.push([-27, -175 + 0], [-27, -314]); arcPts(o, -21, -314, 6, 6, Math.PI, Math.PI * 1.5, 4); arcPts(o, 21, -314, 6, 6, -P2, 0, 4); o.push([27, cy - R * Math.cos(a)]);
      arcPts(o, 0, cy, R, R, -P2 + a, 0, 12); o.push([R, 265]); arcPts(o, 0, 265, R, R, 0, Math.PI, 20); o.push([-R, cy]); arcPts(o, 0, cy, R, R, Math.PI, Math.PI * 1.5 - a, 12);
      return o;
    })(),
    pod: (() => {                                                                           // 2015: плоский под, мундштук сужается
      const o = []; o.push([-22, -240], [-18, -322]); arcPts(o, -10, -322, 8, 8, Math.PI, Math.PI * 1.5, 4); arcPts(o, 10, -322, 8, 8, -P2, 0, 4); o.push([22, -240]);
      arcPts(o, 24, -204, 36, 36, -P2, 0, 8); arcPts(o, 24, 284, 36, 36, 0, P2, 8); arcPts(o, -24, 284, 36, 36, P2, Math.PI, 8); arcPts(o, -24, -204, 36, 36, Math.PI, Math.PI * 1.5, 8);
      return o;
    })(),
    disp: (() => {                                                                          // 2020: одноразка — корпус и мундштук из ep/v230/30-ch1.js (BODY, mouthPath)
      const o = [], b = [-60, -240, 1140, 2160], r = 170, P = Math.PI, q = (x0, y0, cx, cy, x1, y1, n) => { for (let i = 1; i <= n; i++) { const u = i / n, v = 1 - u; o.push(toSh(v * v * x0 + 2 * v * u * cx + u * u * x1, v * v * y0 + 2 * v * u * cy + u * u * y1)) } };
      const A = (cx, cy, a0, a1) => { for (let i = 0; i <= 10; i++) { const a = a0 + (a1 - a0) * i / 10; o.push(toSh(cx + Math.cos(a) * r, cy + Math.sin(a) * r)) } };
      o.push(toSh(330, -240), toSh(362, -458)); q(362, -458, 372, -510, 420, -510, 5); o.push(toSh(660, -510)); q(660, -510, 708, -510, 718, -458, 5); o.push(toSh(750, -240));
      A(b[2] - r, b[1] + r, -P / 2, 0); A(b[2] - r, b[3] - r, 0, P / 2); A(b[0] + r, b[3] - r, P / 2, P); A(b[0] + r, b[1] + r, P, P * 1.5);
      return o;
    })(),
    can: (() => {                                                                           // 2022: баночка с пакетиками, вид в три четверти
      const o = []; arcPts(o, 0, -70, 220, 64, Math.PI, Math.PI * 2, 30); o.push([220, 90]); arcPts(o, 0, 90, 220, 64, 0, Math.PI, 30); return o;
    })(),
  };
  const FORMS = ['cig', 'heat', 'pod', 'disp', 'can'];
  const FTINT = { cig: '#f5f1e8', heat: '#a9b3cf', pod: '#8792b4', disp: '#ef5668', can: '#eef4f7' };
  const FCORE = { cig: [0, -40], heat: [0, -150], pod: [0, -150], disp: [0, 0], can: [0, 22] };   // где ядро внутри каждой оболочки (никотин: табак, стик, под, капсула, пакетик)
  function shPath(c, pts) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath() }
  function shBox(pts) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) } return [x0, y0, x1 - x0, y1 - y0] }
  // детали внутри оболочки (тонкие светлые линии «рентгена»); a — вес формы во время превращения
  function shDetail(c, f, a) {
    if (a <= .01) return; c.save(); c.globalAlpha *= a; c.strokeStyle = 'rgba(238,241,248,.55)'; c.lineWidth = 3; c.lineCap = 'round';
    if (f === 'cig') { c.fillStyle = 'rgba(242,184,75,.2)'; c.fillRect(-46, 150, 92, 165); c.beginPath(); c.moveTo(-46, 150); c.lineTo(46, 150); c.stroke(); c.beginPath(); c.moveTo(-46, 172); c.lineTo(46, 172); c.globalAlpha *= .5; c.stroke() }
    else if (f === 'heat') {   // стик: белая бумага, светло-коричневый фильтр сверху; ниже — внутри держателя (пунктир), лезвие нагревателя
      rr(c, -27, -320, 54, 142, 6); c.fillStyle = 'rgba(250,246,238,.42)'; c.fill(); rr(c, -27, -320, 54, 46, 6); c.fillStyle = 'rgba(214,170,110,.55)'; c.fill();
      c.beginPath(); c.moveTo(-27, -274); c.lineTo(27, -274); c.stroke();
      c.setLineDash([10, 9]); rr(c, -21, -176, 42, 150, 5); c.stroke(); c.setLineDash([]); c.beginPath(); c.moveTo(0, -130); c.lineTo(0, -40); c.stroke(); ring(c, 0, 150, 12, 'rgba(238,241,248,.55)', 3);
    }
    else if (f === 'pod') {   // под: тёмный мундштук, окошко с жидкостью, шов, диод
      c.save(); c.beginPath(); c.rect(-70, -340, 140, 100); c.clip(); shPath(c, SH.pod); c.fillStyle = 'rgba(20,23,51,.5)'; c.fill(); c.restore();
      c.beginPath(); c.moveTo(-60, -40); c.lineTo(60, -40); c.stroke(); rr(c, -30, -222, 60, 150, 14); c.stroke(); circ(c, 0, 268, 6, 'rgba(238,241,248,.6)');
    }
    else if (f === 'disp') { const [x0, y0] = toSh(460, 300), [x1, y1] = toSh(620, 1300); rr(c, x0, y0, x1 - x0, y1 - y0, (x1 - x0) / 2); c.stroke(); const [, ym] = toSh(0, -240); c.beginPath(); c.moveTo(-67, ym); c.lineTo(67, ym); c.stroke() }
    else if (f === 'can') {
      c.beginPath(); c.ellipse(0, -70, 220, 64, 0, 0, Math.PI); c.stroke();
      for (const [x, y, w, h, r, k] of [[-118, 30, 150, 64, -.16, .35], [118, 34, 150, 64, .14, .35], [0, 22, 168, 74, -.02, .6]]) { c.save(); c.translate(x, y); c.rotate(r); rr(c, -w / 2, -h / 2, w, h, h * .42); c.fillStyle = `rgba(250,248,242,${k * .5})`; c.fill(); c.strokeStyle = `rgba(250,248,242,${k})`; c.stroke(); c.restore() }   // белые пакетики
    }
    c.restore();
  }
  // оболочка-«рентген»: заливка просвечивает, тень справа, блик слева, тонкий светлый контур (наши 3 тона; ядро — внутри)
  function shellBack(c, pts, tint, op) { shPath(c, pts); c.save(); c.globalAlpha *= op; c.fillStyle = tint; c.fill(); c.restore() }
  function shellFront(c, pts, tint, op, a = 1) {
    const [x, y, w, h] = shBox(pts), g0 = c.globalAlpha;
    c.save(); shPath(c, pts); c.clip();
    c.globalAlpha = g0 * a * (.18 + .1 * op); c.fillStyle = op > 0 ? mixc(shd(tint, .55), '#141733', op) : shd(tint, .55); c.fillRect(x + w * .74, y - 4, w * .26 + 8, h + 8);   // тень справа (у непрозрачного «лица» — тёмная, а не серая)
    c.globalAlpha = g0 * a * (.22 + .2 * op); rr(c, x + w * .1, y + h * .08, Math.max(5, w * .085), h * .84, 6); fill(c, '#ffffff');   // блик полосой слева
    c.restore();
    c.save(); c.globalAlpha *= a; shPath(c, pts); lnB(c, 4, 'rgba(238,241,248,.92)'); c.restore();
  }
  // ================= кадр 0 главы 1 — её же рисовка, перенесена слово в слово из ep/v170.js (мостик выпуска 1, v170e) =================
  // Нужна, чтобы последний кадр пролога был кадром главы 1 за 1/30 с до её кадра 0 (кадры подряд, без повтора и без склейки).
  // Поменяешь в главе 1 v1Band / v1Capsule / v1Ring / liveCam / Rpost (STY 'cine') — поменяй и здесь, проверка стыка: ./v230_render.sh seam
  const C1 = { am: '#f2a33a', am3: '#ffc46a', rim: '#060e38', glass: '#040a2a' };
  const V1Z = { x: 540, top: 300, bot: 1300, w: 160 }, V1RY0 = V1Z.top + 42;
  const rr1 = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r) };   // как rr главы 1 (без ограничения радиуса)
  function liveCam1(c, t) {   // liveCam(c, t, 1)
    const a = 1;
    const dx = a * (16 * Math.sin(TAU * t / 6.1) + 8 * Math.sin(TAU * t / 2.9 + 1)), dy = a * (10 * Math.sin(TAU * t / 7.7 + 2) + 5 * Math.sin(TAU * t / 3.3));
    const z = 1 + a * (.045 + .015 * Math.sin(TAU * t / 9.5)), r = a * .004 * Math.sin(TAU * t / 8.3);
    c.translate(CX, CY); c.rotate(r); c.scale(z, z); c.translate(-CX + dx, -CY + dy);
  }
  function band1(c) {   // v1Band: красный фон заставки = корпус вейпа, мелкий растр
    const g = c.createLinearGradient(0, -300, 0, HH + 300); g.addColorStop(0, '#ef5668'); g.addColorStop(1, '#da3e52');
    c.fillStyle = g; c.fillRect(-300, -300, WW + 600, HH + 600);
    c.save(); c.globalAlpha = .07; c.fillStyle = '#ffffff';
    for (let r = 0, y = -290; y < HH + 300; r++, y += 34) for (let x = (r % 2) * 17 - 290; x < WW + 300; x += 34) { c.beginPath(); c.arc(x, y, 2.6, 0, TAU); c.fill() }
    c.restore();
  }
  function ring1(c, x, y, r, a = 1, lw = 8) { if (a <= 0 || r <= 0) return; c.save(); c.globalAlpha *= a; c.beginPath(); c.arc(x, y, r, 0, TAU); c.strokeStyle = '#fff6ee'; c.lineWidth = lw; c.stroke(); c.restore() }
  // v1Capsule; lvK — уровень янтаря (доля высоты сверху), у главы 1 — lp(.15, 83/270, flat); в прологе ядро стекает в капсулу — уровень поднимается
  function capsule1(c, t, x, y0, y1, w, rev, a = 1, rad, flat = 0, lvK) {
    if (a <= 0 || rev <= y0) return;
    const h = y1 - y0, R = rad ?? w / 2, k = w / 124;
    c.save(); c.globalAlpha *= a; c.beginPath(); c.rect(-400, -400, WW + 800, rev + 400); c.clip();
    c.save(); c.globalAlpha *= .35 * (1 - flat); rr1(c, x - w / 2 + 10 * k, y0 + 14 * k, w, h, R); fill(c, '#5a0f1c'); c.restore();
    rr1(c, x - w / 2, y0, w, h, R); fill(c, C1.rim);
    const p = 12 * k, iw = w - 2 * p, ih = h - 2 * p, ir = Math.max(4, R - p * .85);
    rr1(c, x - iw / 2, y0 + p, iw, ih, ir); fill(c, C1.glass);
    c.save(); rr1(c, x - iw / 2, y0 + p, iw, ih, ir); c.clip();
    const lv = y0 + h * (lvK ?? lp(.15, 83 / 270, flat));
    c.beginPath(); c.moveTo(x - iw, lv + 6 * k); for (let q = -iw; q <= iw; q += 6) c.lineTo(x + q, lv + 6 * k + Math.sin(q * .07 / k - t * 3.1 + 2) * 6 * k); c.lineTo(x + iw, y1 + 10); c.lineTo(x - iw, y1 + 10); c.closePath(); fill(c, '#d97a06');
    c.beginPath(); c.moveTo(x - iw, lv); for (let q = -iw; q <= iw; q += 6) c.lineTo(x + q, lv + Math.sin(q * .07 / k + t * 3.4) * 5 * k); c.lineTo(x + iw, y1 + 10); c.lineTo(x - iw, y1 + 10); c.closePath(); fill(c, C1.am);
    const lg = c.createLinearGradient(x - iw / 2, 0, x + iw / 2, 0); lg.addColorStop(0, 'rgba(255,240,200,.28)'); lg.addColorStop(.4, 'rgba(255,240,200,0)'); lg.addColorStop(1, 'rgba(120,50,0,.28)'); c.save(); c.globalAlpha *= 1 - flat; c.fillStyle = lg; c.fillRect(x - iw / 2, lv - 10, iw, ih); c.restore();
    for (let i = 0; i < 16; i++) {
      const ph = (t * (.42 + .3 * H1(i * 2.3)) + H1(i * 3.1)) % 1, by = lp(y1 - p - 8 * k, lv + 10 * k, ph), bx = x - iw * .36 + iw * .72 * H1(i * 7.7) + Math.sin(t * 2.4 + i) * 5 * k;
      c.beginPath(); c.arc(bx, by, (i % 3 ? 3 + 4 * H1(i * 1.3) : 2 + 2 * H1(i)) * k, 0, TAU); fill(c, i % 3 ? C1.am3 : 'rgba(255,255,255,.85)');
    }
    c.restore();
    if (flat > 0) { c.save(); c.globalAlpha *= flat; rr1(c, x - w * (36 / 124), y0 + h * (27 / 270), w * (10 / 124), h * (120 / 270), 5 * k); fill(c, 'rgba(255,255,255,.35)'); c.restore() }
    c.restore();
  }
  function vignette1(c, a, col = '0,0,0') {   // виньетка главы 1 (чуть шире, чем у глав 3–5)
    if (a <= 0) return; const g = c.createRadialGradient(CX, CY * .94, 460, CX, CY, 1300); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`);
    c.save(); c.fillStyle = g; c.fillRect(-400, -400, WW + 800, HH + 800); c.restore();
  }
  let RG1 = null, RGR1 = null;
  function post1(c, t) {   // Rpost при STY 'cine' (у главы 1 LUX): контраст 1,1, насыщенность 1,06, мягкое зерно 0,05, виньетка 0,36 — в той же живой камере
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    if (!RG1) RG1 = mk(WW, HH); const g = RG1.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'copy'; g.drawImage(c.canvas, 0, 0);
    c.globalCompositeOperation = 'copy'; c.filter = 'brightness(1.0) contrast(1.1) saturate(1.06)'; c.drawImage(RG1, 0, 0); c.filter = 'none'; c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    if (!RGR1) { RGR1 = mk(256, 256); const x = RGR1.getContext('2d'), im = x.createImageData(256, 256), d = im.data; for (let i = 0; i < 65536; i++) { const v = 128 + (H1(i * 1.37 + 5) - .5) * 200; d[4 * i] = d[4 * i + 1] = d[4 * i + 2] = v; d[4 * i + 3] = 255 } x.putImageData(im, 0, 0) }
    const f = Math.floor(t * 30), ox = Math.floor(H1(f * 3.1) * 256), oy = Math.floor(H1(f * 7.7) * 256);
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = .05; c.translate(-ox, -oy); c.fillStyle = c.createPattern(RGR1, 'repeat'); c.fillRect(0, 0, WW + 256, HH + 256);
    c.restore(); vignette1(c, .36);
  }
  // кадр главы 1 при t < 0 (кольцо ещё наверху, видна только верхушка капсулы) — ровно её frame(t) без субтитров
  function ch1Frame(c, t) {
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    liveCam1(c, t);
    band1(c); capsule1(c, t, V1Z.x, V1Z.top, V1Z.bot, V1Z.w, V1RY0 + 4, 1, V1Z.w / 2, 0); ring1(c, V1Z.x, V1RY0, 24, 1, 8);
    post1(c, t);
  }
  // ---------- одноразка пролога: тот же кадр, только корпус целиком (координаты кадра главы 1) ----------
  const BODY = { x0: -60, y0: -240, x1: 1140, y1: 2160, r: 170 };   // при нырке закрывает весь кадр с запасом под живую камеру (зум 1,06, сдвиг до 24 px)
  function bodyPath(c, k) {   // k — рост вокруг капсулы: 0 — по контуру капсулы, 1 — весь корпус
    const x0 = lp(V1Z.x - V1Z.w / 2 - 40, BODY.x0, k), x1 = lp(V1Z.x + V1Z.w / 2 + 40, BODY.x1, k), y0 = lp(V1Z.top - 40, BODY.y0, k), y1 = lp(V1Z.bot + 40, BODY.y1, k);
    rr1(c, x0, y0, x1 - x0, y1 - y0, lp(V1Z.w / 2 + 40, BODY.r, k));
  }
  function mouthPath(c, k) {   // мундштук выезжает из-за верха корпуса
    const dy = (1 - k) * 300; c.beginPath(); c.moveTo(330, -180 + dy); c.lineTo(362, -458 + dy); c.quadraticCurveTo(372, -510 + dy, 420, -510 + dy); c.lineTo(660, -510 + dy); c.quadraticCurveTo(708, -510 + dy, 718, -458 + dy); c.lineTo(750, -180 + dy); c.closePath();
  }
  // o: { g — рост корпуса, m — мундштук, lv — уровень янтаря, ry — кольцо (y), rs — его размер, ra — видно ли, fl — вспышка кольца }
  function device1(c, t, o) {
    if (o.m > 0) { mouthPath(c, o.m); cel(c, 330, -510, 420, 330, '#1f2858', { sw: .26, hx: .12, hw: .1, ha: .3 }); mouthPath(c, o.m); lnB(c, 12, 'rgba(238,241,248,.85)'); }
    c.save(); bodyPath(c, o.g); c.clip();
    band1(c);
    c.fillStyle = 'rgba(20,23,51,.3)'; c.fillRect(BODY.x1 - 70, -400, 200, 2800); c.fillRect(-200, BODY.y1 - 60, 1600, 200);   // тень справа и снизу — за краем кадра главы 1
    c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(BODY.x0 + 18, BODY.y0 + 160, 46, BODY.y1 - BODY.y0 - 320);   // блик слева
    capsule1(c, t, V1Z.x, V1Z.top, V1Z.bot, V1Z.w, o.rev, 1, V1Z.w / 2, 0, o.lv);
    if (o.ra > 0) ring1(c, V1Z.x, o.ry, 24 * o.rs, o.ra, 8);
    c.restore();
    bodyPath(c, o.g); lnB(c, 12, 'rgba(238,241,248,.85)');
    if (o.fl > 0) glow(c, V1Z.x, o.ry, 260, '#fff6ee', .85 * o.fl);   // кольцо вспыхивает, как диод при затяжке
  }
  // ================= сцена пролога: один мир, одна камера (нырок в корпус = кадр главы 1) =================
  const CORE_R = 30, BEAT = .95;
  function beatAt(t) {   // «тук-тук» ядра раз в 0,95 с — с последнего слова титула
    if (t < K.beat0 - .02) return 0;
    const u = (t - K.beat0) / BEAT, ph = (u - Math.floor(u)) * BEAT, q = ph - .19;
    const b1 = ph < .045 ? ph / .045 : Math.exp(-(ph - .045) / .11), b2 = q < 0 ? 0 : q < .045 ? .55 * q / .045 : .55 * Math.exp(-(q - .045) / .12);
    return Math.max(b1, b2);
  }
  function beats() { const o = []; for (let tb = K.beat0; tb < K.pour[0]; tb += BEAT) o.push(tb); return o }
  function coreDraw(c, x, y, r, hb, fl) {   // янтарное ядро никотина: 3 тона, свечение — на сцене
    if (r <= .4) return;
    const R = r * (1 + .12 * hb + .3 * fl);
    glow(c, x, y, R * (5 + 1.6 * hb + 5 * fl), '#f2a33a', Math.min(.9, .24 + .16 * hb + .5 * fl));
    glow(c, x, y, R * 2.1, '#ffc46a', Math.min(1, .5 + .25 * hb + .3 * fl));
    circ(c, x, y, R, '#f2a33a');
    c.save(); c.beginPath(); c.arc(x, y, R, 0, TAU); c.clip(); circ(c, x + R * .62, y + R * .25, R * .95, '#d97a06'); circ(c, x - R * .34, y - R * .36, R * .3, 'rgba(255,241,206,.9)'); c.restore();
    ring(c, x, y, R, 'rgba(255,227,174,.85)', 2.4);
  }
  const DUST = [...Array(28)].map((_, i) => ({ x: 340 + 400 * H1(i * 3.7), y: 1400 * H1(i * 5.3), s: .7 + 1.5 * H1(i * 7.1), v: 7 + 13 * H1(i * 2.9), ph: H1(i * 9.3) * TAU }));
  function stage(c, t, lit) {   // тёмная сцена, конус света сверху, пылинки в луче (частицы — только там, где их видно в свете)
    c.fillStyle = '#0B0D12'; c.fillRect(-3000, -3000, 7080, 7920);
    const g = c.createRadialGradient(540, 1010, 60, 540, 1010, 900); g.addColorStop(0, `rgba(242,163,58,${.07 + .05 * lit})`); g.addColorStop(1, 'rgba(242,163,58,0)'); c.fillStyle = g; c.fillRect(-360, 110, 1800, 1800);   // ядро подсвечивает сцену
    const sw = .022 * Math.sin(TAU * t / 7.3) + .008 * Math.sin(TAU * t / 3.1);   // луч чуть качается — сцена не стоит
    c.save(); c.translate(540, -170); c.rotate(sw); c.translate(-540, 170);
    beam(c, 540, -170, 540, 1660, 58, 540, '#fff1dc', .075 + .03 * lit);
    beam(c, 540, -170, 540, 1300, 26, 250, '#fff1dc', .06 + .02 * lit);
    c.restore();
    for (const d of DUST) {
      const yy = (((d.y - d.v * t) % 1500) + 1500) % 1500 + 40, xx = d.x + Math.sin(t * .6 + d.ph) * 12, half = 58 + (yy + 170) * .264, k = 1 - Math.abs(xx - 540) / half;
      if (k > 0) circ(c, xx, yy, d.s * 1.7, `rgba(255,236,206,${.32 * k * (.55 + .45 * Math.sin(t * 2.1 + d.ph))})`);
    }
  }
  function title(c, t) {   // титул как в финале: Manrope 800, 82 px, y 360 / 464 — слова встают по голосу
    const L = TITLE_L[LANG] || TITLE_L.ru, out = at(t, K.s2 - .12, K.s2 + .3); if (out >= 1) return;
    const o = { f: 'M', w: 800, s: 82, ls: 2 }; let wi = 0;
    L.forEach((ws, li) => {
      const line = ws.join(' '), W0 = tw(c, line, o), oo = { ...o, s: W0 > 980 ? o.s * 980 / W0 : o.s }, W = tw(c, line, oo), x0 = 540 - W / 2, y = 360 + li * 104 - 26 * eio(out);
      ws.forEach((w, j) => {
        const ta = K.tw[Math.min(wi++, K.tw.length - 1)], k = eo(at(t, ta - .06, ta + .2)); if (k <= 0) return;
        const x = x0 + (j ? tw(c, ws.slice(0, j).join(' ') + ' ', oo) + oo.ls : 0);
        tx(c, w, x, y + 14 * (1 - k), { ...oo, al: 'left', c: '#F4F1EA', a: k * (1 - out) });
      });
    });
  }
  function counter(c, t) {   // пять точек: сколько раз сменилась форма (без цифр и лет)
    const t0 = K.form[0] - .12; if (t < t0) return;
    for (let i = 0; i < 5; i++) {
      const x = 540 + (i - 2) * 58, ap = spr(at(t, t0 + i * .05, t0 + i * .05 + .42)); if (ap <= 0) continue;
      const ft = t - (K.crack + .12 + i * .045), fy = ft > 0 ? 2500 * ft * ft - 70 * ft : 0; if (fy > 900) continue;
      const y = 1505 + fy, on = at(t, K.form[i] + .2, K.form[i] + .36), pg = t - (K.form[i] + .2);
      ring(c, x, y, 10 * ap, 'rgba(238,241,248,.45)', 2.5);
      if (on > 0) { glow(c, x, y, 36, '#f2a33a', .5 * on); circ(c, x, y, 10 * spr(on), '#f2a33a') }
      if (pg > 0 && pg < .5) ring(c, x, y, 10 + 32 * eo(pg / .5), `rgba(242,163,58,${.6 * (1 - pg / .5)})`, 2);
    }
  }
  // ---------- оболочки ----------
  function shellState(t) {
    const T = K.form; if (t < T[0] - .1) return null;
    let i = 0; while (i < 4 && t >= T[i + 1] - .05) i++;
    if (i === 0) return { pts: SH.cig, a: 'cig', b: 'cig', k: 1, build: at(t, T[0] - .1, T[0] + .5) };
    const k = eio(at(t, T[i] - .05, T[i] + .37)), a = FORMS[i - 1], b = FORMS[i];
    return { pts: k >= 1 ? SH[b] : morphF(a + b, SH[a], SH[b])(k), a, b, k, build: 1 };
  }
  function corePos(t) {   // где ядро: в своей оболочке, после трещины — снова в центре
    const S = shellState(t); let p = [0, 0];
    if (S) { const A = FCORE[S.a], B = FCORE[S.b]; p = [lp(A[0], B[0], S.k), lp(A[1], B[1], S.k) * eo(S.build)] }
    const back = eio(at(t, K.crack + .1, K.flare + .25)); return [p[0] * (1 - back), p[1] * (1 - back)];
  }
  function skinAt(t) { const F = K.face; let s = -1; for (let i = 0; i < 3; i++) if (t >= F[i] - .06) s = i; return s < 0 ? null : { s, w: eo(at(t, F[s] - .06, F[s] + .16)) } }
  const canSide = c => { c.beginPath(); c.moveTo(-220, -70); c.lineTo(220, -70); c.lineTo(220, 90); c.ellipse(0, 90, 220, 64, 0, 0, Math.PI); c.closePath() };
  const canLid = c => { c.beginPath(); c.ellipse(0, -70, 220, 64, 0, 0, TAU) };
  function spark(c, x, y, r, a) { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.beginPath(); for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4, rr2 = i % 2 ? r * .22 : r; c.lineTo(x + Math.cos(an) * rr2, y + Math.sin(an) * rr2) } c.closePath(); fill(c, '#ffffff'); c.restore() }
  function canSkin(c, s, t) {   // три «лица» оболочки: упаковка (красно-белая), вкус (манго и мята), обещания (холодное «чистое»)
    if (s === 0) { canSide(c); fill(c, '#f6f2ea'); c.save(); canSide(c); c.clip(); c.fillStyle = '#d6334d'; c.fillRect(-240, 0, 480, 46); c.fillStyle = '#b8283e'; c.fillRect(-240, 46, 480, 8); c.restore(); canLid(c); fill(c, '#d6334d'); c.save(); canLid(c); c.clip(); c.beginPath(); c.ellipse(0, -70, 150, 40, 0, 0, TAU); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 6; c.stroke(); c.restore() }
    else if (s === 1) { canSide(c); fill(c, '#5ed39b'); c.save(); canSide(c); c.clip(); poly(c, [-240, -80, 60, -80, -120, 170, -240, 170]); fill(c, '#f6a03a'); c.restore(); canLid(c); fill(c, '#f6a03a'); c.save(); canLid(c); c.clip(); poly(c, [40, -150, 240, -150, 240, 0, -60, 0]); fill(c, '#5ed39b'); c.restore() }
    else { canSide(c); const g = c.createLinearGradient(0, -70, 0, 160); g.addColorStop(0, '#f2fafd'); g.addColorStop(1, '#a8daee'); c.fillStyle = g; c.fill(); canLid(c); fill(c, '#f7fcfe');
      [[-120, 10, 26, 0], [96, 48, 20, 1.3], [138, -86, 16, 2.1], [-60, -88, 12, 2.9]].forEach(([x, y, r, ph]) => spark(c, x, y, r, .5 + .5 * Math.sin(t * 7 + ph))) }
  }
  function canOpaque(c, t, S) {   // непрозрачная банка (после первого «лица»): слои «лиц» сменяются шторкой слева направо
    const sk = skinAt(t); if (!sk) return 0;
    if (sk.s > 0) canSkin(c, sk.s - 1, t);
    c.save(); if (sk.w < 1) { c.beginPath(); c.rect(-260, -200, 520 * sk.w, 420); c.clip() } canSkin(c, sk.s, t); c.restore();
    return sk.s === 0 ? sk.w : 1;
  }
  const CRACK = [[0, -140], [14, -86], [-9, -34], [13, 18], [-7, 72], [8, 162]];
  function halfClip(c, sd) { c.beginPath(); c.moveTo(0, -420); CRACK.forEach(p => c.lineTo(p[0], p[1])); c.lineTo(8, 420); c.lineTo(sd * 700, 420); c.lineTo(sd * 700, -420); c.closePath() }
  function floatT(c, t) {   // оболочка с ядром парит в луче: чуть вверх-вниз и наклон; к росту корпуса затихает (ядро встаёт ровно в капсулу)
    const a = 1 - at(t, K.flare + .3, K.grow - .12); if (a <= 0) return;
    c.translate(0, a * (9 * Math.sin(TAU * t / 3.3) + 3 * Math.sin(TAU * t / 1.7 + 1))); c.rotate(a * .028 * Math.sin(TAU * t / 4.4 + 1));
  }
  function shells(c, t, hb, fl, withCore) {   // оболочка + ядро внутри (координаты оболочки: ядро — (0, 0) мира 540, 980)
    const S = shellState(t), [cx, cy] = corePos(t), tf = t - (K.crack + .14);
    const core = () => { if (withCore) coreDraw(c, cx, cy, CORE_R * (1 - .3 * eo(at(t, K.grow - .05, K.grow + .2))), hb, fl) };
    if (!S || tf > 1.3) { core(); return }
    const tint = mixc(FTINT[S.a], FTINT[S.b], S.k), opq = S.b === 'can' && S.k >= 1 ? 1 : 0;
    const whole = (sh = true) => {   // целая банка/оболочка, с «лицом», если оно уже есть
      if (opq) { const w = canOpaque(c, t, S); shellFront(c, S.pts, '#eef4f7', w, 1); return w }
      shellFront(c, S.pts, tint, 0, S.build); return 0;
    };
    if (tf < 0) {   // до трещины: задняя заливка, ядро, передняя «стеклянная» часть
      const b = S.build, sk = skinAt(t), op = sk ? (sk.s === 0 ? sk.w : 1) : 0;
      shellBack(c, S.pts, tint, .17 * b * (1 - op));
      core();
      if (op <= 0) shDetail(c, S.a, 1 - eio(at(S.k, 0, .5))), shDetail(c, S.b, S.a === S.b ? eo(b) : eio(at(S.k, .5, 1)));
      if (b < 1) { c.save(); shPath(c, S.pts); c.setLineDash([1500 * b, 3000]); lnB(c, 4, 'rgba(238,241,248,.92)'); c.restore(); if (b > .3) shellFront(c, S.pts, tint, 0, at(b, .3, 1)) }
      else whole();
      const kc = at(t, K.crack - .02, K.crack + .1); if (kc > 0) { c.save(); c.beginPath(); CRACK.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.setLineDash([340 * kc, 600]); lnB(c, 5, '#ffffff'); c.restore() }
      return;
    }
    core();
    for (const sd of [-1, 1]) {   // половинки падают (сила тяжести), поворачиваясь от середины
      const dx = sd * (150 * tf + 70 * tf * tf), dy = -50 * tf + 2400 * tf * tf, rot = sd * (1.1 * tf + .5 * tf * tf), px = sd * 110, py = 10;
      c.save(); c.translate(px + dx, py + dy); c.rotate(rot); c.translate(-px, -py); halfClip(c, sd); c.clip(); whole(); c.restore();
    }
  }
  function shock(c, t) { const u = (t - K.flare) / .6; if (u <= 0 || u >= 1) return; ring(c, 0, 0, 30 + 560 * eo(u), `rgba(255,214,150,${.55 * (1 - u)})`, 6 - 4.5 * u) }
  // ---------- корпус одноразки = кадр 0 главы 1 в миниатюре ----------
  function puff(c, t) {   // затяжка: облачко манго-мяты из мундштука уходит вверх
    const u = t - K.zipE - .04; if (u <= 0 || u > 1) return;
    for (let i = 0; i < 4; i++) { const v = u - i * .07; if (v <= 0) continue; const e = eo(v / .9); glow(c, 540 + (i - 1.5) * 60 * v, -560 - 760 * e, 70 + 280 * e, i % 2 ? '#c8f3e0' : '#ffd9a8', .55 * (1 - v / .9)) }
  }
  function deviceShot(c, t, t1, hb) {
    const pop = lp(.12, 1, spr(at(t, K.grow - .06, K.grow + .32))), g = eio(at(t, K.grow + .08, K.grow + .55)), m = eo(at(t, K.grow + .38, K.grow + .7));
    const lv = lp(1.06, .15, eio(at(t, K.pour[0], K.pour[1]))), zk = at(t, K.zip, K.zipE), ry = zk > 0 ? lp(V1Z.bot, V1RY0, eio(zk)) : V1Z.bot;
    const rs = spr(at(t, K.zip - .08, K.zip + .22)) * (1 + .3 * Math.sin(Math.PI * at(t, K.zipE, K.zipE + .25))), fl = Math.sin(Math.PI * at(t, K.zipE - .02, K.zipE + .45));
    c.save(); c.translate(DEV0.x, DEV0.y); c.scale(S0, S0); c.translate(-DEVC.x, -DEVC.y);
    if (pop < 1) { c.translate(DEVC.x, DEVC.y); c.scale(pop, pop); c.translate(-DEVC.x, -DEVC.y) }
    device1(c, t1, { g, m, lv, rev: zk > 0 ? ry + 4 : 1e4, ry, rs, ra: t >= K.zip - .08 ? 1 : 0, fl });
    puff(c, t);
    c.restore();
    const r = CORE_R * (1 - .3 * eo(at(t, K.grow - .05, K.grow + .2))) * (1 - eio(at(t, K.pour[0], K.pour[1])));   // ядро стекает в капсулу
    if (r > .4) coreDraw(c, DEV0.x, DEV0.y, r, hb, 0);
  }
  // ---------- камера: медленный наезд на ядро, в конце — нырок в корпус (точка зума F рассчитана так, что в конце корпус = кадр главы 1) ----------
  const ZS1 = 1 / S0, P1 = { x: DEV0.x + S0 * (CX - DEVC.x), y: DEV0.y + S0 * (CY - DEVC.y) };
  const FZ = { x: (CX - ZS1 * P1.x) / (1 - ZS1), y: (CY - ZS1 * P1.y) / (1 - ZS1) }, VS = .004;
  function camZ(t) { return VS * t + (Math.log(ZS1) - VS * K.TE1) * eio(at(t, K.dive0, K.TE1)) }
  function scene(c, t) {
    const t1 = t - K.TE, hb = beatAt(t), fl = t > K.flare - .02 ? Math.exp(-Math.max(0, t - K.flare) / .3) * at(t, K.flare - .02, K.flare + .05) : 0;
    const s = Math.exp(camZ(t)), px = FZ.x - (FZ.x - CX) / s, py = FZ.y - (FZ.y - CY) / s;
    c.save(); liveCam1(c, t1);   // живая камера главы 1 на весь пролог: кадр всё время чуть плывёт, а в конце она же продолжается в главе 1
    c.save(); cam(c, s, px, py);
    stage(c, t, hb * .6 + fl);
    counter(c, t);
    c.save(); c.translate(DEV0.x, DEV0.y); floatT(c, t); if (t < K.grow - .06 || t - (K.crack + .14) < 1.3) shells(c, t, hb, fl, t < K.grow - .06); shock(c, t); c.restore();
    if (t >= K.grow - .06) deviceShot(c, t, t1, hb);
    c.restore();
    title(c, t);
    c.restore();
  }
  // ================= кадр, звуки, сборка =================
  const SHUT = [];   // окна размытия движения (затвор 180°, 8 моментов за полкадра): превращения, падение половинок, нырок
  let MBC = null;
  function sceneMB(c, t) {
    const n = 8, sh = 1 / 60; if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext("2d");
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { scene(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); scene(g, tj);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function frame(t) { frameTo(X, t) }
  function frameTo(c, t) {
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; FT = t;
    const t1 = t - K.TE;
    if (t >= K.TE1 - 1e-6) { ch1Frame(c, t1); return }   // последний кадр пролога — кадр главы 1 за 1/30 с до её кадра 0 (её рисовка и обработка, без субтитров)
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (!window.NOMB && SHUT.some(([a, b]) => t > a && t < b)) sceneMB(c, t); else scene(c, t);
    c.setTransform(1, 0, 0, 1, 0, 0); liveCam1(c, t1); post1(c, t1);   // обработка главы 1 на весь пролог: в конце она та же, что у её кадра
    c.setTransform(1, 0, 0, 1, 0, 0); subs(c, t);
  }
  function cues() {   // звуки по событиям; hb, drop, zip, zipend — синтез в v230_sound.py, остальное — файлы sfx* (tick и swish там под запретом — не брать)
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    Q(Math.max(.05, K.tw[0] - .1), 'shimmer', .22);
    beats().forEach((tb, i) => Q(tb, 'hb', i ? .9 : 1.1));
    Q(K.form[0] - .08, 'xray', .5);
    K.form.forEach((tf, i) => { Q(tf - .03, 'plop', .7, 0); Q(tf + .2, 'glass', .55, (i - 2) * .35) });
    Q(K.face[0] - .04, 'pageflip', .8, -.2); Q(K.face[1] - .04, 'bubble', 1.2, .1); Q(K.face[2] - .04, 'shimmer', .34, .2);
    Q(K.crack - .02, 'icecrack', 1.1); Q(K.crack + .16, 'whoosh', 1.1);
    Q(K.flare - .03, 'drop', 1); Q(K.flare - .02, 'boom', .7);
    Q(K.grow - .04, 'plop', .8); Q(K.pour[0], 'pour', 1); Q(K.pour[0] + .12, 'bubble', .7);
    Q(K.zip - .06, 'zip', 1); Q(K.zipE, 'zipend', 1); Q(K.zipE + .03, 'vape', .85);
    Q(K.dive0 + .05, 'whoosh', 1.4); Q(K.dive0 + .18, 'dive', 1.1);
  }
  window.EP = {
    P: { bg: '#0B0D12', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f2a33a', a2: '#ef5668' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); TLS = tl.sent; LANG = tl.lang || 'ru'; MODE = 'y';
      TLX = { endT: tl.endT || tl.dur }; K = keys(); window.__K = K; CHUNKS = buildChunks();
      SHUT.length = 0; K.form.slice(1).forEach(tf => SHUT.push([tf - .07, tf + .4])); SHUT.push([K.crack + .1, K.crack + 1.3], [K.grow - .08, K.grow + .5], [K.dive0 + .05, K.TE1 - .2]);
      for (const k in CUES) delete CUES[k]; cues(); window.CUES_READY = 1;
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      return Promise.all(['600 20px M', '800 20px M'].map(f => document.fonts.load(f, 'АЯaz09ÜÄ?'))).then(() => 0);
    },
  };
  window.__dbg = { get K() { return K }, SH, morphF, frameTo, ch1Frame };
})();
