// v23.1 (22.11) — два пролога фильма на выбор (Андрей: «сделай 2 варика — как ты видишь и как я тебе ТЗ дал»). Основа — код v23.0 (ep/v230).
//   v231y — A: строго по ТЗ Gemini (текст v23.0): студия, янтарная капля с первого кадра, пять предметов глав по очереди с поворотом и бликом,
//           три врезки «упаковка · вкус · обещания», на «но не суть» — темнота, капля с формулой и ударной волной, конец — как v23.0 (кадр 0 главы 1).
//   v232y — B: «Сигареты. «Джул». Одноразки. Айкос. Снюс.» — предметы падают в ряд по слову, «способ бросить» — штампы,
//           «Угадаете, кто стоит за всеми пятью?» — силуэт в контровом свете, пятёрка стягивается в каплю, конец — кадр 0 главы 1.
// Предметы — картинки из кода глав 3–5 (node v231_spr.mjs → ep/v231/spr/*.png), одноразка — как в главе 2. Голоса нет: черновой таймлайн v231_tl.py.
// Сборка: ./v231_render.sh. Ниже — шапка v23.0:
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
  // ================= тексты и привязка событий к словам (по номерам слов; голоса пока нет — черновой таймлайн) =================
  const TITLE_L = {   // титул — слово в слово как в финале фильма (ep/v220/10-text.js, titleL)
    ru: [['ЧТО', 'ВЫ', 'ЗНАЕТЕ'], ['О', 'НИКОТИНЕ?']],
    en: [['WHAT', 'DO', 'YOU', 'KNOW'], ['ABOUT', 'NICOTINE?']],
    de: [['WAS', 'WISST', 'IHR'], ['ÜBER', 'NIKOTIN?']],
  };
  const LAB_L = { ru: ['УПАКОВКА', 'ВКУС', 'ОБЕЩАНИЯ'], en: ['PACKAGING', 'FLAVORS', 'PROMISES'], de: ['VERPACKUNG', 'GESCHMACK', 'VERSPRECHEN'] };
  const STAMP_L = { ru: 'СПОСОБ БРОСИТЬ', en: 'A WAY TO QUIT', de: 'ZUM AUFHÖREN' };
  let VAR = 'A';
  const ORDA = ['cig', 'pod', 'heat', 'ice', 'tin'];   // v23.2: A — сигареты · «Джул» · айкос · одноразки · снюс (как карточки доски: 1924 · 1979 · 2014 · 2020 · 2022)
  // [фраза, № слова] — A: см. ниже;
  //                     B: «Сигареты. «Джул». Одноразки. Айкос. Снюс.» / «И каждый раз — «способ бросить».» / «Угадаете, кто стоит за всеми пятью?»
  const ANCH = {
    // v23.2: A — «Что вы знаете о никотине? / За сто лет он менял форму пять раз: / Сигареты. «Джул». Айкос. Одноразки. Снюс. / Менялись упаковка, вкус и обещания — но не суть. / Начнём…»
    A: { ru: { form: [['s3', 0], ['s3', 1], ['s3', 2], ['s3', 3], ['s3', 4]], five: ['s2', 6], mac: [['s4', 0], ['s4', 2], ['s4', 4]], dark: ['s4', 5], flare: ['s4', 7], grow: ['s5', 0], zip: ['s5', 2] } },
    B: { ru: { form: [['s1', 0], ['s1', 1], ['s1', 2], ['s1', 3], ['s1', 4]], stamp: ['s2', 1], quote: ['s2', 3], back: ['s3', 0], who: ['s3', 1], stand: ['s3', 2], pull: ['s3', 4], flare: ['s3', 5], grow: ['s4', 0], zip: ['s4', 2] } },
  };
  const WA = ([sc, i]) => { const s = TLS.find(x => x.scene === sc); if (!s) throw new Error('v231: нет фразы ' + sc); const w = s.words[Math.min(i, s.words.length - 1)]; return w.a };
  function keys() {
    const A = ANCH[VAR][LANG] || ANCH[VAR].ru, TE = TLX.endT, s1 = TLS.find(x => x.scene === 's1');
    const k = { TE, TE1: TE - 1 / 30, s1a: s1.a, s1b: s1.b, s2: SA('s2'), s2b: SB('s2'), s3: SA('s3'), s3b: SB('s3'), s4: SA('s4'), form: A.form.map(WA), flare: WA(A.flare), grow: WA(A.grow), zip: WA(A.zip) };
    if (VAR === 'A') {
      k.tw = s1.words.map(w => w.a); k.five = WA(A.five); k.mac = A.mac.map(WA); k.dark = WA(A.dark);
      k.row = Math.min(k.form[4] + .45, k.mac[0] - .55);   // v23.3: «Снюс» крупно ≈ 0,45 с → весь ряд; врезка «упаковка» — ровно на «Менялись» (mac[0])
      k.beat0 = k.tw[k.tw.length - 1]; k.noSub = ch => ch.a < s1.b + .05;   // первая фраза — это титул, субтитром её не дублируем
    } else {
      k.stamp = WA(A.stamp); k.quote = WA(A.quote); k.back = WA(A.back); k.who = WA(A.who); k.stand = WA(A.stand); k.pull = WA(A.pull);
      k.dark = k.flare - .02; k.beat0 = k.flare + .25; k.noSub = () => false;
    }
    k.dive0 = Math.max(k.zip + .95, TE - 1.05); k.dive1 = k.TE1;     // нырок кончается ровно на последнем кадре
    k.suck0 = k.grow + .35; k.suck1 = Math.max(k.suck0 + .4, Math.min(k.zip + .3, k.dive0 - .3));   // v23.3: капля поднимается к щели окна и втягивается (окно не открываем)
    return k;
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
  // ================= v23.1: сцена обоих прологов — студия, предметы глав, капля никотина; конец — как v23.0 (кадр 0 главы 1) =================
  const PL = (c, p, col) => { poly(c, p); fill(c, col) };
  const S0 = .32, DEV0 = { x: 540, y: 980 }, DEVC = { x: 540, y: 800 }, PY = 1250;   // корпус одноразки на сцене (кадр главы 1 в миниатюре), верх подиума
  // ---------- предметы глав картинками (node v231_spr.mjs) ----------
  const SPRN = ['cig', 'pod', 'ice', 'heat', 'tin'], SPRI = {};
  const SCORE = { cig: [.42, .62], pod: [.5, .1], ice: [.5, .62], heat: [.5, .16], tin: [.5, .42] };   // где внутри никотин (доли картинки): табак, под, жидкость, стик, пакетики
  // v23.3: обрезки картинок — у «Джула» снизу и у айкоса справа были растровые тени (предмет «висел», тень двоилась); pack — пачка без сигареты (врезка «упаковка»)
  const CROP = { pod: ['pod', 0, 0, 266, 2116], heat: ['heat', 0, 0, 356, 2304], pack: ['cig', 335, 0, 1029, 1274] };
  function sprLoad() {
    return Promise.all(SPRN.map(n => new Promise(r => { const im = new Image(); im.onload = () => { SPRI[n] = im; r() }; im.onerror = () => r(); im.src = 'ep/v231/spr/' + n + '.png' }))).then(() => {
      for (const k in CROP) { const [n, x, y, w, h] = CROP[k], im = SPRI[n]; if (!im) continue; const cv = mk(w, h); cv.getContext('2d').drawImage(im, x, y, w, h, 0, 0, w, h); SPRI[k] = cv }
    });
  }
  function fitWH(n, mw, mh) { const im = SPRI[n]; if (!im) return [mw, mh]; const k = Math.min(mw / im.width, mh / im.height); return [im.width * k, im.height * k] }
  let TMP = null;
  // предмет стоит на (x, yb); o: mw, mh — рамка; th — поворот вокруг вертикали (рад); sq — сплющивание (удар); dk — темнее; fl — проход блика 0..1; rim — янтарный контровой
  function obj(c, n, x, yb, o = {}) {
    const im = SPRI[n]; if (!im) return; const [w, h] = fitWH(n, o.mw || 600, o.mh || 560), a = o.a ?? 1; if (a <= 0) return;
    const ct = Math.cos(o.th || 0), sx = Math.max(.04, Math.abs(ct)) * (1 + (o.sq || 0) * .12), sy = 1 - (o.sq || 0) * .14;
    if (o.sh !== false) { c.save(); c.globalAlpha *= a * .55; c.beginPath(); c.ellipse(x + 10, yb + 4, w * .55 * sx, 16 + w * .03, 0, 0, TAU); fill(c, 'rgba(0,0,0,.7)'); c.restore() }   // тень на подиуме
    const W = Math.ceil(w), H = Math.ceil(h); if (!TMP || TMP.width < W + 2 || TMP.height < H + 2) TMP = mk(Math.max(W + 2, TMP ? TMP.width : 0), Math.max(H + 2, TMP ? TMP.height : 0));
    const g = TMP.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W + 2, H + 2); g.drawImage(im, 0, 0, W, H);
    g.globalCompositeOperation = 'source-atop';
    const dk = Math.min(.85, (o.dk || 0) + .55 * (1 - Math.abs(ct)));   // повёрнутый боком — темнее (объём)
    if (dk > 0) { g.fillStyle = `rgba(6,8,22,${dk})`; g.fillRect(0, 0, W, H) }
    if (o.xr > 0) { g.fillStyle = `rgba(150,190,255,${o.xr})`; g.fillRect(0, 0, W, H) }   // v23.2: оболочка «рентгеном»
    if (o.fl > 0 && o.fl < 1) { const u = lp(-.4, 1.4, o.fl) * (W + H), gr = g.createLinearGradient(u - 110, 0, u + 110, H * .6); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, `rgba(255,255,255,${o.fa ?? .5})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H) }   // блик проходит по предмету
    if (o.rim > 0) { const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, `rgba(255,190,110,${.55 * o.rim})`); gr.addColorStop(.18, 'rgba(255,190,110,0)'); gr.addColorStop(.82, 'rgba(255,190,110,0)'); gr.addColorStop(1, `rgba(255,190,110,${.55 * o.rim})`); g.fillStyle = gr; g.fillRect(0, 0, W, H) }
    c.save(); c.globalAlpha *= a; c.translate(x, yb); c.scale(sx, sy); c.drawImage(TMP, 0, 0, W, H, -w / 2, -h, w, h); c.restore();
  }
  const corePt = (n, x, yb, o = {}) => { const [w, h] = fitWH(n, o.mw || 600, o.mh || 560), q = SCORE[n]; return [x + (q[0] - .5) * w, yb - h + q[1] * h] };
  // ---------- студия: тёмный фон, конус света сверху, подиум, туман слоями, пылинки ----------
  const DUST = [...Array(30)].map((_, i) => ({ x: 300 + 480 * H1(i * 3.7), y: 1400 * H1(i * 5.3), s: .7 + 1.5 * H1(i * 7.1), v: 7 + 13 * H1(i * 2.9), ph: H1(i * 9.3) * TAU }));
  function fogTex() { return blurLayer('fog', 720, 640, 26, g => { for (let i = 0; i < 26; i++) { const x = 720 * H1(i * 4.1), y = 160 + 380 * H1(i * 6.7), r = 60 + 120 * H1(i * 2.3); g.fillStyle = `rgba(190,205,235,${.18 + .2 * H1(i * 8.9)})`; g.beginPath(); g.ellipse(x, y, r * 1.8, r * .55, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x - 720, y, r * 1.8, r * .55, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x + 720, y, r * 1.8, r * .55, 0, 0, TAU); g.fill() } }) }
  function fog(c, t, a) {   // два слоя тумана едут в разные стороны (тянутся по кругу, без шва)
    if (a <= 0) return; const F = fogTex();
    for (const [y, s, v, al] of [[880, 2.3, 11, .12], [1200, 2.8, -7, .2]]) {
      const w = 720 * s, off = ((t * v) % w + w) % w; c.save(); c.globalAlpha *= a * al;
      for (let k = -1; k <= 1; k++) c.drawImage(F, -w + off + k * w + 540 - w / 2, y - 320 * s * .5, w, 640 * s * .5); c.restore();
    }
  }
  function podium(c, rx, lit) {
    const y = PY + 12, ry = rx * .17;
    c.save(); c.beginPath(); c.ellipse(540, y, rx, ry, 0, 0, Math.PI); c.lineTo(540 - rx, y + 46); c.ellipse(540, y + 46, rx, ry, 0, Math.PI, 0, true); c.closePath(); fill(c, '#10131c'); c.restore();   // бок
    const g = c.createRadialGradient(540, y - ry * .2, 10, 540, y, rx); g.addColorStop(0, mixc('#262b3a', '#3a3f52', lit)); g.addColorStop(1, '#14171f'); c.beginPath(); c.ellipse(540, y, rx, ry, 0, 0, TAU); c.fillStyle = g; c.fill();   // верх
    c.beginPath(); c.ellipse(540, y, rx, ry, 0, Math.PI * 1.05, Math.PI * 1.95); lnB(c, 2.5, `rgba(232,239,255,${.25 + .25 * lit})`);   // кромка в свете
  }
  function studio(c, t, o = {}) {
    const lit = o.lit ?? 1;
    c.fillStyle = '#0A0D13'; c.fillRect(-3000, -3000, 7080, 7920);
    glow(c, 540, 820, 980, '#2a3350', .45 * lit);   // стена чуть светлее в середине
    const sw = .02 * Math.sin(TAU * t / 7.3) + .007 * Math.sin(TAU * t / 3.1);
    c.save(); c.translate(540, -170); c.rotate(sw); c.translate(-540, 170);
    beam(c, 540, -170, 540, 1600, 50, 520, '#eef3ff', (.07 + .02 * (o.boost || 0)) * lit); beam(c, 540, -170, 540, 1300, 22, 240, '#eef3ff', .06 * lit);
    c.restore();
    podium(c, o.rx || 360, lit);
    glow(c, 540, PY + 6, (o.rx || 360) * 1.05, '#f4efe2', .12 * lit);   // пятно света на подиуме
    fog(c, t, lit);
    for (const d of DUST) {
      const yy = (((d.y - d.v * t) % 1500) + 1500) % 1500 + 40, xx = d.x + Math.sin(t * .6 + d.ph) * 12, half = 50 + (yy + 170) * .3, k = 1 - Math.abs(xx - 540) / half;
      if (k > 0) circ(c, xx, yy, d.s * 1.7, `rgba(236,242,255,${.3 * k * lit * (.55 + .45 * Math.sin(t * 2.1 + d.ph))})`);
    }
  }
  function slotSpot(c, x, a) { if (a <= 0) return; beam(c, x, -120, x, PY + 20, 14, 120, '#fff4de', .16 * a); glow(c, x, PY + 8, 150, '#fff4de', .22 * a) }
  // ---------- капля никотина: стекло, янтарь внутри, бьётся как сердце ----------
  const CORE_R = 30, BEAT = .95;
  function beatAt(t) {
    if (t < K.beat0 - .02) return 0;
    const u = (t - K.beat0) / BEAT, ph = (u - Math.floor(u)) * BEAT, q = ph - .19;
    const b1 = ph < .045 ? ph / .045 : Math.exp(-(ph - .045) / .11), b2 = q < 0 ? 0 : q < .045 ? .55 * q / .045 : .55 * Math.exp(-(q - .045) / .12);
    return Math.max(b1, b2);
  }
  function beats() { const o = []; for (let tb = K.beat0; tb < K.suck0; tb += BEAT) o.push(tb); return o }
  function dropPath(c, x, y, R) { c.beginPath(); c.moveTo(x, y - R * 1.95); c.bezierCurveTo(x + R * .35, y - R * 1.3, x + R, y - R * .75, x + R, y); c.arc(x, y, R, 0, Math.PI); c.bezierCurveTo(x - R, y - R * .75, x - R * .35, y - R * 1.3, x, y - R * 1.95); c.closePath() }
  function drop(c, x, y, r, hb, fl, gl = 1) {   // y — центр круглой части; gl — насколько видно стекло (блики, кромка)
    if (r <= .4) return; const R = r * (1 + .1 * hb + .25 * fl);
    glow(c, x, y - R * .4, R * (4.6 + 1.4 * hb + 5 * fl), '#f2a33a', Math.min(.9, .22 + .16 * hb + .5 * fl));
    glow(c, x, y - R * .3, R * 2, '#ffc46a', Math.min(1, .42 + .25 * hb + .3 * fl));
    dropPath(c, x, y, R); fill(c, '#f2a33a');
    c.save(); dropPath(c, x, y, R); c.clip(); circ(c, x + R * .7, y + R * .1, R * 1.1, '#d97a06'); c.beginPath(); c.ellipse(x, y + R * .55, R * .9, R * .35, 0, 0, TAU); fill(c, 'rgba(255,214,140,.35)');
    if (gl > 0) { c.globalAlpha *= gl; c.beginPath(); c.ellipse(x - R * .42, y - R * .55, R * .16, R * .5, -.35, 0, TAU); fill(c, 'rgba(255,248,230,.85)'); circ(c, x + R * .38, y + R * .38, R * .1, 'rgba(255,248,230,.6)') }
    c.restore();
    dropPath(c, x, y, R); lnB(c, Math.max(1.5, R * .05), `rgba(255,232,190,${.55 + .35 * gl})`);
  }
  // ---------- титул: Manrope 800, 82 px (как в финале), строки — y 440 / 544 (ТЗ: 400–580) ----------
  function title(c, t, tIn, tOut) {
    const L = TITLE_L[LANG] || TITLE_L.ru, out = at(t, tOut - .12, tOut + .3); if (out >= 1) return;
    const o = { f: 'M', w: 800, s: 82, ls: 2 }; let wi = 0;
    L.forEach((ws, li) => {
      const line = ws.join(' '), W0 = tw(c, line, o), oo = { ...o, s: W0 > 980 ? o.s * 980 / W0 : o.s }, x0 = 540 - tw(c, line, oo) / 2, y = 440 + li * 104 - 30 * eio(out);
      ws.forEach((w, j) => {
        const ta = tIn[Math.min(wi++, tIn.length - 1)], k = ta <= 0 ? 1 : eo(at(t, ta - .06, ta + .2)); if (k <= 0) return;
        const x = x0 + (j ? tw(c, ws.slice(0, j).join(' ') + ' ', oo) + oo.ls : 0);
        tx(c, w, x, y + 14 * (1 - k), { ...oo, al: 'left', c: '#F4F1EA', a: k * (1 - out) });
      });
    });
  }
  function dots(c, t, n, a) {   // шкала из пяти точек (ТЗ: y ≈ 1340) — без цифр и лет
    if (a <= 0) return;
    for (let i = 0; i < 5; i++) {
      const t5 = K.five ?? K.form[0] - .2, x = 540 + (i - 2) * 58, y = 1378, ap = spr(at(t, t5 + i * .05, t5 + .45 + i * .05)) * a; if (ap <= 0) continue;
      const on = at(t, K.form[i] + .15, K.form[i] + .3), pg = t - (K.form[i] + .15);
      c.save(); c.globalAlpha *= a; ring(c, x, y, 10 * ap, 'rgba(238,241,248,.45)', 2.5);
      if (on > 0) { glow(c, x, y, 36, '#f2a33a', .5 * on); circ(c, x, y, 10 * spr(on), '#f2a33a') }
      if (pg > 0 && pg < .5) ring(c, x, y, 10 + 32 * eo(pg / .5), `rgba(242,163,58,${.6 * (1 - pg / .5)})`, 2);
      c.restore();
    }
  }
  function label(c, t) {   // плашка врезки; v23.3: в кадре экрана (не едет с наездом), строго по центру на одной высоте — под предметом, над субтитрами;
    // тёмная полупрозрачная с тонкой золотой обводкой и белым текстом — не сливается ни с пачкой, ни с листом; ширина одна на все три слова
    const M = K.mac; if (t < M[0] || t >= K.dark) return;
    const i = t < M[1] ? 0 : t < M[2] ? 1 : 2, k = spr(at(t, M[0] + .04, M[0] + .3)), out = 1 - at(t, K.dark - .12, K.dark); if (k <= 0 || out <= 0) return;
    const L = LAB_L[LANG] || LAB_L.ru, o = { s: 44, ls: 6, w: 800, f: 'M' }, w = Math.max(...L.map(s => tw(c, s, o))) + o.s * 1.6, h = o.s * 1.85, sw = i ? eo(at(t, M[i], M[i] + .18)) : 1;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = out; c.translate(CX, LABY); c.scale(k, k);
    rr(c, -w / 2, -h / 2, w, h, h * .28); fill(c, 'rgba(8,10,18,.66)'); rr(c, -w / 2 + 1, -h / 2 + 1, w - 2, h - 2, h * .28); lnB(c, 2, 'rgba(234,194,122,.9)');
    if (i && sw < 1) tx(c, L[i - 1], 0, o.s * .04 - 14 * sw, { ...o, c: '#fff', a: 1 - sw });
    tx(c, L[i], 0, o.s * .04 + 14 * (1 - sw), { ...o, c: '#fff', a: sw });
    c.restore();
  }
  const LABY = 1560;   // центр плашки: низ предметов врезок — до ~1420, плашка субтитров — 1678–1762
  // ================= A: по ТЗ Gemini + список (v23.2) =================
  const SLOT = i => 152 + 194 * i, LW = 178, LH = 380, LWT = 214;   // ряд из пяти (B — весь ролик)
  const AW = 184, AH = 440, AWT = 220;                               // A: рамка предмета в ряду
  // v23.3: ряд в A собирается слева направо и всегда стоит по центру: новый предмет выходит крупно справа от уже стоящих, они уступают ему место
  // (крупный никого не накрывает); в конце — все пять в ряд, на 10 % мельче и плотнее (с полями ≥ 100 px)
  const RS = .9, RG = 44, RM = 80;
  function lay(k, big) {   // k предметов (0…k−1), big — какой из них крупно (−1 — никакой) → [{x, mw, mh, yb}]
    const fr = [], ws = [];
    for (let j = 0; j < k; j++) { fr.push(j === big ? null : [(ORDA[j] === 'tin' ? AWT : AW) * RS, AH * RS]); ws.push(fr[j] ? fitWH(ORDA[j], fr[j][0], fr[j][1])[0] : 0) }
    if (big >= 0) { const used = ws.reduce((a, b) => a + b, 0) + RG * (k - 1), mw = Math.min(600, WW - 2 * RM - used); fr[big] = [mw, 560]; ws[big] = fitWH(ORDA[big], mw, 560)[0] }
    const tot = ws.reduce((a, b) => a + b, 0) + RG * (k - 1); let x = CX - tot / 2;
    return ws.map((w, j) => { const o = { x: x + w / 2, mw: fr[j][0], mh: fr[j][1], yb: j === big ? PY + 26 : PY }; x += w + RG; return o });
  }
  const LAY = {}; const layC = (k, big) => LAY[k + ':' + big] || (LAY[k + ':' + big] = lay(k, big));
  const L5 = (a, b, v) => ({ x: lp(a.x, b.x, v), mw: lp(a.mw, b.mw, v), mh: lp(a.mh, b.mh, v), yb: lp(a.yb, b.yb, v) });
  // предмет i в момент t: на своё слово въезжает справа крупно; на слово следующего уменьшается и сдвигается влево; после «Снюс» — весь ряд мелко
  function itemA(t, i) {
    const n = ORDA[i], tf = K.form[i], u = at(t, tf - .14, tf + .42);
    const seg = j => eio(at(t, (j < 5 ? K.form[j] : K.row) - .2, (j < 5 ? K.form[j] : K.row) + .22));   // переход к раскладке j-го шага (5 — весь ряд): прежний уступает место чуть раньше
    let P = layC(i + 1, i)[i];
    for (let j = i + 1; j <= 5; j++) { const v = seg(j); if (v <= 0) break; P = L5(P, j < 5 ? layC(j + 1, j)[i] : layC(5, -1)[i], v) }
    const e = 1 - Math.pow(1 - u, 4), th = 1.35 * (1 - eo(at(t, tf - .14, tf + .3))), x = P.x + 1250 * (1 - e);   // без перелёта за место — не заезжает на соседа
    return { i, n, tf, x, th, mw: P.mw, mh: P.mh, yb: P.yb, v: i < 4 ? seg(i + 1) : seg(5) };
  }
  function dropInA(t) {   // капля падает в луч с первого кадра и садится с отскоком
    if (t < .42) { const k = at(t, 0, .42); return lp(760, 1000, k * k) - 1000 }
    return 30 * Math.exp(-(t - .42) / .1) * Math.sin((t - .42) * 26);
  }
  function sceneA(c, t, hb, fl) {
    const pre = t < K.mac[0];
    if (pre) {
      const W5 = eio(at(t, K.form[0] - .3, K.form[0] + .2));
      studio(c, t, { rx: lp(360, 480, W5), boost: hb * .5 });
      // капля: в луче с первого кадра; на «Сигареты» уходит — дальше её свет только в контровом у предметов (за предметами не торчит)
      const dy = dropInA(t) + 6 * Math.sin(TAU * t / 3.3), dA = 1 - eio(at(t, K.form[0] - .25, K.form[0] + .05));
      if (dA > 0) drop(c, 540, 1000 + dy, 72 * dA * (1 + .25 * Math.exp(-Math.max(0, t - .42) / .12) * at(t, .4, .43)), hb, 0, 1);
      const lu = (t - .42) / .5; if (lu > 0 && lu < 1) ring(c, 540, 1000, 60 + 260 * eo(lu), `rgba(255,214,150,${.5 * (1 - lu)})`, 5 - 3 * lu);   // волна, когда капля села
      const IT = []; for (let i = 0; i < 5; i++) if (t > K.form[i] - .14) IT.push(itemA(t, i));
      const all = Math.sin(Math.PI * at(t, K.row + .1, K.row + .9));
      for (const o of IT) {   // слева направо — новый (крупный, справа) поверх соседей
        slotSpot(c, o.x, o.i === IT.length - 1 && t < K.row ? Math.sin(Math.PI * at(t, o.tf, o.tf + .9)) : all);
        const f1 = at(t, o.tf + .12, o.tf + .55), f2 = at(t, K.row + .15 + o.i * .08, K.row + .55 + o.i * .08);
        obj(c, o.n, o.x, o.yb, { mw: o.mw, mh: o.mh, th: o.th, fl: f2 > 0 ? f2 : f1, rim: lp(1, .6, o.v) });
      }
      dots(c, t, 5, 1 - at(t, K.mac[0] - .2, K.mac[0]));
      return;
    }
    if (t < K.dark) { macro(c, t); return }
    // «— но не суть»: резко темнота, одна капля, формула; на «суть» — вспышка и волна
    c.fillStyle = '#05060A'; c.fillRect(-3000, -3000, 7080, 7920);
    glow(c, 540, 900, 900, '#3a2410', .25 + .3 * fl);
    formula(c, t);
    shockA(c, t);
    if (t < K.grow - .06) drop(c, 540, 980 + 4 * Math.sin(TAU * t / 3.3), lp(46, CORE_R, eio(at(t, K.flare + .1, K.grow - .1))), hb, fl, 1 - at(t, K.flare, K.grow));
  }
  function shockA(c, t) { const u = (t - K.flare) / .62; if (u <= 0 || u >= 1) return; ring(c, 540, 960, 40 + 620 * eo(u), `rgba(255,214,150,${.55 * (1 - u)})`, 7 - 5 * u) }
  // никотин: пиридин (шестиугольник) + пирролидин (пятиугольник) с N и метилом — тонкими янтарными линиями вокруг капли
  function formula(c, t) {
    const k = at(t, K.dark + .05, K.dark + .45), out = at(t, K.grow - .3, K.grow + .1); if (k <= 0 || out >= 1) return;
    const fl = Math.exp(-Math.max(0, t - K.flare) / .25) * at(t, K.flare - .02, K.flare + .04);
    c.save(); c.translate(540, 760); c.globalAlpha *= (1 - out) * (.75 + .25 * fl); c.strokeStyle = mixc('#f2a33a', '#fff3da', fl); c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round';
    const R = 92, hx = -96, hy = 0, P6 = [...Array(6)].map((_, i) => [hx + R * Math.cos(Math.PI / 6 + i * Math.PI / 3), hy + R * Math.sin(Math.PI / 6 + i * Math.PI / 3)]);
    const a0 = P6[0], R5 = 66, cx5 = a0[0] + R5 * 1.1, cy5 = a0[1] - 20, P5 = [...Array(5)].map((_, i) => [cx5 + R5 * Math.cos(Math.PI + .3 + i * TAU / 5), cy5 + R5 * Math.sin(Math.PI + .3 + i * TAU / 5)]);
    const seg = (pts, closed) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (closed) c.closePath() };
    c.setLineDash([1400 * k, 3000]); seg(P6, true); c.stroke(); seg([a0, P5[0]]); c.stroke(); seg(P5, true); c.stroke();
    c.setLineDash([]);
    if (k > .6) { const a = at(k, .6, 1); c.globalAlpha *= a;   // двойные связи пиридина, азоты, метил
      [[1, 2], [3, 4], [5, 0]].forEach(([i, j]) => { const m = [(P6[i][0] + P6[j][0]) / 2, (P6[i][1] + P6[j][1]) / 2], q = [hx + (m[0] - hx) * .72, hy + (m[1] - hy) * .72], d = [(P6[j][0] - P6[i][0]) * .3, (P6[j][1] - P6[i][1]) * .3]; c.beginPath(); c.moveTo(q[0] - d[0], q[1] - d[1]); c.lineTo(q[0] + d[0], q[1] + d[1]); c.stroke() });
      const n6 = P6[3], n5 = P5[1]; tx(c, 'N', n6[0], n6[1], { f: 'M', w: 800, s: 38, c: '#ffd9a0' }); tx(c, 'N', n5[0], n5[1], { f: 'M', w: 800, s: 38, c: '#ffd9a0' });
      c.beginPath(); c.moveTo(n5[0] + 18, n5[1] - 22); c.lineTo(n5[0] + 54, n5[1] - 70); c.stroke() }
    c.restore();
  }
  // три врезки крупным планом: упаковка (крышка пачки щёлкает, золотой блик), вкус (манго, мята, лёд), обещания (бланк, зелёная галочка, печать с бликом)
  function macro(c, t) {
    const M = K.mac, i = t < M[1] ? 0 : t < M[2] ? 1 : 2, t0 = M[i], u = t - t0, z = 1 + .06 * u + .07 * (1 - eo(at(t, t0, t0 + .28)));   // v23.2: вход — короткий наезд вместо белой вспышки
    c.save(); c.translate(540, 900); c.scale(z, z); c.translate(-540, -900);
    if (i === 0) {
      c.fillStyle = '#150709'; c.fillRect(-500, -500, 2080, 2920); glow(c, 540, 700, 900, '#7a1222', .55);
      const sn = 1 - spr(at(t, t0, t0 + .35)); c.save(); c.translate(540, 960); c.rotate(-.06 * sn); c.scale(1 + .05 * sn, 1 + .05 * sn); c.translate(-540, -960);
      obj(c, 'pack', 540, 1320, { mw: 600, mh: 740, fl: lp(.2, 1, at(t, t0 + .15, t0 + .85)), fa: .13, sh: false }); c.restore();   // v23.3: пачка без сигареты, по центру, блик слабый (не засвечивает «PM» и надпись)
    } else if (i === 1) {
      c.fillStyle = '#0f1408'; c.fillRect(-500, -500, 2080, 2920); glow(c, 540, 900, 900, '#4a5a18', .5); glow(c, 380, 800, 520, '#a2560e', .45);
      flavors(c, t, t0);
    } else {
      c.fillStyle = '#0b1016'; c.fillRect(-500, -500, 2080, 2920); glow(c, 540, 860, 900, '#2b3e52', .55);
      promise(c, t, t0);
    }
    c.restore();
  }
  function popK(t, t0) { return spr(at(t, t0, t0 + .32)) }
  function flavors(c, t, t0) {
    // манго «ёжиком», два листа мяты, кубик льда — 3 тона, как предметы глав
    const k1 = popK(t, t0), k2 = popK(t, t0 + .07), k3 = popK(t, t0 + .14);
    if (k1 > 0) { c.save(); c.translate(390, 960); c.scale(k1, k1); c.rotate(-.28);   // v23.2: манго — целый плод (Gemini: «ёжик» читался как вафля), 3 тона, черенок и лист
      const body = () => { c.beginPath(); c.moveTo(-40, -190); c.bezierCurveTo(120, -210, 220, -60, 200, 60); c.bezierCurveTo(180, 180, 40, 230, -60, 190); c.bezierCurveTo(-170, 150, -200, 20, -160, -80); c.bezierCurveTo(-140, -150, -100, -185, -40, -190); c.closePath() };
      body(); const gm = c.createLinearGradient(-180, -180, 200, 200); gm.addColorStop(0, '#86c34a'); gm.addColorStop(.42, '#f6c33a'); gm.addColorStop(1, '#ee6a2a'); c.fillStyle = gm; c.fill();
      c.save(); body(); c.clip(); c.beginPath(); c.ellipse(130, 120, 210, 170, -.5, 0, TAU); fill(c, 'rgba(160,45,8,.3)'); c.beginPath(); c.ellipse(-92, -78, 46, 104, -.6, 0, TAU); fill(c, 'rgba(255,255,235,.4)'); c.restore();
      c.beginPath(); c.moveTo(-46, -186); c.lineTo(-56, -228); lnB(c, 10, '#5a3a1c');
      c.beginPath(); c.moveTo(-56, -224); c.quadraticCurveTo(14, -306, 118, -262); c.quadraticCurveTo(24, -226, -56, -224); c.closePath(); fill(c, '#3f9a4a'); c.beginPath(); c.moveTo(-50, -226); c.quadraticCurveTo(30, -262, 110, -262); lnB(c, 3, 'rgba(220,255,220,.6)');
      c.restore() }
    if (k2 > 0) for (const [x, y, r, s] of [[690, 820, -.6, 1], [770, 960, .35, .8]]) { c.save(); c.translate(x, y); c.scale(k2 * s, k2 * s); c.rotate(r);   // мята
      c.beginPath(); c.moveTo(-150, 0); c.quadraticCurveTo(-40, -110, 150, 0); c.quadraticCurveTo(-40, 110, -150, 0); c.closePath(); fill(c, '#5ed39b');
      c.save(); c.clip(); c.fillStyle = '#3ba873'; c.fillRect(-160, 8, 320, 120); c.restore(); c.beginPath(); c.moveTo(-150, 0); c.lineTo(140, 0); for (let j = -3; j <= 3; j++) { c.moveTo(j * 36, 0); c.lineTo(j * 36 + 34, j % 2 ? 40 : -40) } lnB(c, 3, 'rgba(230,255,240,.7)'); c.restore() }
    if (k3 > 0) { c.save(); c.translate(560, 1150); c.scale(k3, k3); c.rotate(.12);   // лёд
      PL(c, [-110, -60, 40, -110, 140, -50, -10, 0], 'rgba(220,245,255,.85)'); PL(c, [-110, -60, -10, 0, -10, 150, -110, 90], 'rgba(150,205,235,.85)'); PL(c, [-10, 0, 140, -50, 140, 100, -10, 150], 'rgba(110,175,215,.85)');
      poly(c, [-110, -60, 40, -110, 140, -50, 140, 100, -10, 150, -110, 90]); lnB(c, 3, 'rgba(255,255,255,.8)'); c.beginPath(); c.ellipse(-60, 30, 12, 34, -.3, 0, TAU); fill(c, 'rgba(255,255,255,.55)'); c.restore() }
    for (let i = 0; i < 10; i++) { const u = at(t, t0 + .05 + i * .02, t0 + .5 + i * .02); if (u <= 0 || u >= 1) continue; const an = i * 2.4, rr2 = 180 + 380 * eo(u); circ(c, 540 + Math.cos(an) * rr2, 960 + Math.sin(an) * rr2 * .8, 7 * (1 - u), 'rgba(220,245,255,.8)') }   // брызги
  }
  function promise(c, t, t0) {
    const k = popK(t, t0); if (k <= 0) return;
    c.save(); c.translate(540, 930); c.rotate(-.07); c.scale(k, k);
    rr(c, -300 + 14, -400 + 18, 600, 800, 10); fill(c, 'rgba(0,0,0,.4)'); rr(c, -300, -400, 600, 800, 10); fill(c, '#f2efe6');
    c.fillStyle = '#1c2230'; c.fillRect(-250, -340, 500, 44); for (let i = 0; i < 9; i++) { c.fillStyle = 'rgba(40,46,60,.28)'; c.fillRect(-250, -250 + i * 46, i % 3 === 2 ? 300 : 500, 16) }   // заголовок и строки — без слов
    const ck = at(t, t0 + .12, t0 + .42); if (ck > 0) { c.beginPath(); c.moveTo(-150, 130); c.lineTo(-40, 250); c.lineTo(200, -10); c.setLineDash([700 * ck, 1400]); lnB(c, 34, '#17b26a'); c.setLineDash([]) }   // зелёная галочка рисуется сама
    const sk = spr(at(t, t0 + .32, t0 + .6)); if (sk > 0) { c.save(); c.translate(150, 250); c.rotate(-.25); c.scale(1.6 - .6 * sk, 1.6 - .6 * sk); c.globalAlpha *= sk; ring(c, 0, 0, 96, '#17b26a', 10); ring(c, 0, 0, 74, '#17b26a', 4); tx(c, '✓', 0, 4, { f: 'M', w: 800, s: 80, c: '#17b26a' }); c.restore() }   // печать
    const gl = at(t, t0 + .55, t0 + .95); if (gl > 0 && gl < 1) { c.save(); rr(c, -300, -400, 600, 800, 10); c.clip(); const x = lp(-500, 500, gl), g = c.createLinearGradient(x - 120, -400, x + 120, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.7)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(-300, -400, 600, 800); c.restore() }
    c.restore();
  }
  // ================= B: моя =================
  function stampT() { return VAR === 'B' ? [0, 1, 2, 3, 4].map(i => K.stamp + i * .26) : [] }
  function sceneB(c, t, hb, fl) {
    const back = eo(at(t, K.back - .1, K.back + .35)), off = at(t, K.flare - .05, K.flare + .35);
    if (t < K.flare + .4) {
      A(c, 1 - off, () => {
        studio(c, t, { rx: 480, lit: 1 - .8 * back });
        backlight(c, t, back);
        silhouette(c, t);
        const pull = eio(at(t, K.pull - .05, K.flare)), ST = stampT();
        for (let i = 0; i < 5; i++) {
          const tf = K.form[i]; if (t < tf - .28) continue;
          const u = at(t, tf - .28, tf + .02), land = t > tf + .02, sq = land ? Math.exp(-(t - tf - .02) / .08) * Math.cos((t - tf - .02) * 40) : 0;
          let x = SLOT(i), yb = PY - (1 - ei(u)) * 1000;
          const mw = lp(i === 4 ? LWT : LW, 40, pull), mh = lp(LH, 40, pull); x = lp(x, 540, pull); yb = lp(yb, 1080, pull);
          slotSpot(c, SLOT(i), at(t, tf, tf + .12) * (1 - back));
          if (land && t < tf + .45) dust(c, SLOT(i), PY, (t - tf - .02) / .43);
          obj(c, SPRN[i], x, yb, { mw, mh, sq: Math.max(0, sq), dk: .55 * back, rim: back, fl: at(t, tf + .05, tf + .5), a: 1 - at(pull, .85, 1) });
          stampOn(c, t, ST[i], x, yb - mh * (i % 2 ? .62 : .3), 1 - at(t, K.back, K.back + .3));   // через один выше-ниже — штампы не налезают
        }
      });
    }
    if (t >= K.flare - .1) {   // пятёрка стянулась в каплю: вспышка, волна; дальше — темнота и одна капля
      glow(c, 540, 900, 900, '#3a2410', .2 * off + .3 * fl); shockA(c, t);
      const r = lp(0, 50, spr(at(t, K.flare - .08, K.flare + .25))), r2 = lp(r, CORE_R, eio(at(t, K.flare + .35, K.grow - .1)));
      if (t < K.grow - .06) drop(c, 540, 1000 + 4 * Math.sin(TAU * t / 3.3), r2, hb, fl, 1 - at(t, K.flare + .3, K.grow));
    }
  }
  function dust(c, x, y, u) { if (u <= 0 || u >= 1) return; for (let i = 0; i < 9; i++) { const s = i % 2 ? 1 : -1, d = (40 + 90 * H1(i * 3.1)) * eo(u); glow(c, x + s * d, y - 10 - 26 * eo(u) * H1(i), 26 + 30 * u, '#c9cfdd', .35 * (1 - u)) } }
  function stampOn(c, t, ts, x, y, a) {   // красный штамп «СПОСОБ БРОСИТЬ» поверх предмета
    const k = at(t, ts - .06, ts + .04); if (k <= 0 || a <= 0) return;
    const s = lp(1.7, 1, eo(k)), W = 184, H = 92, S = STAMP_L[LANG] || STAMP_L.ru, sp = S.indexOf(' ');
    c.save(); c.translate(x, y); c.rotate(-.21); c.scale(s, s); c.globalAlpha *= a * Math.min(1, k * 1.5);
    rr(c, -W / 2, -H / 2, W, H, 10); fill(c, 'rgba(10,10,20,.35)'); rr(c, -W / 2, -H / 2, W, H, 10); lnB(c, 6, '#e23a4a'); rr(c, -W / 2 + 9, -H / 2 + 9, W - 18, H - 18, 6); lnB(c, 2, '#e23a4a');
    const l1 = sp > 0 ? S.slice(0, sp) : S, l2 = sp > 0 ? S.slice(sp + 1) : '';
    tx(c, l1, 0, l2 ? -17 : 0, { f: 'M', w: 800, s: 28, ls: 2, c: '#ff5a66', mw: W - 26 }); if (l2) tx(c, l2, 0, 18, { f: 'M', w: 800, s: 28, ls: 2, c: '#ff5a66', mw: W - 26 });
    c.restore();
  }
  function backlight(c, t, k) {   // контровой свет на задней стене: тёплый круг
    if (k <= 0) return; glow(c, 540, 720, 760, '#c2461f', .55 * k); glow(c, 540, 700, 430, '#ffb36b', .45 * k);
  }
  function silhouette(c, t) {   // «кто стоит за…» — фигура в костюме против света, без лица; поднимается из-за подиума
    const k = eio(at(t, K.who - .1, K.stand + .35)), out = at(t, K.flare - .05, K.flare + .3); if (k <= 0 || out >= 1) return;
    const y0 = lp(1400, 0, k), sw = Math.sin(t * 1.3) * 5, br = 1 + .006 * Math.sin(t * 2.2);
    const body = () => { c.beginPath(); c.moveTo(-58, 520); c.lineTo(58, 520); c.lineTo(66, 585); c.bezierCurveTo(200, 600, 300, 640, 330, 760); c.lineTo(380, 2300); c.lineTo(-380, 2300); c.lineTo(-330, 760); c.bezierCurveTo(-300, 640, -200, 600, -66, 585); c.closePath() };
    c.save(); c.globalAlpha *= 1 - out; c.translate(540 + sw, y0); c.scale(br, br);
    c.fillStyle = '#040507'; c.beginPath(); c.ellipse(0, 420, 92, 112, 0, 0, TAU); c.fill(); body(); c.fill();   // голова, плечи, пиджак
    c.beginPath(); c.moveTo(-70, 590); c.lineTo(0, 760); c.lineTo(70, 590); c.strokeStyle = 'rgba(255,170,110,.18)'; c.lineWidth = 3; c.stroke();   // лацканы
    c.strokeStyle = 'rgba(255,175,115,.55)'; c.lineWidth = 3.5; c.beginPath(); c.ellipse(0, 420, 92, 112, 0, Math.PI * 1.08, Math.PI * 1.92); c.stroke();   // кромка контрового света
    c.beginPath(); c.moveTo(-330, 760); c.bezierCurveTo(-300, 640, -200, 600, -66, 585); c.moveTo(330, 760); c.bezierCurveTo(300, 640, 200, 600, 66, 585); c.stroke();
    c.restore();
  }
  // ---------- конец обоих: вокруг капли вырастает корпус одноразки = кадр 0 главы 1 в миниатюре (как v23.0) ----------
  // v23.3: корпус одноразки выпрыгивает вокруг капли сразу целиком — с мундштуком нужной высоты (без «роста» мундштука); окно капсулы уже закрыто
  // кольцом, как в кадре 0 главы 1 (видна только тёмная щель с кольцом); капля сама поднимается к щели и втягивается в неё — диод вспыхивает (затяжка);
  // окно не открывается и не схлопывается: открывает его уже глава 1
  const SLIT = () => DEV0.y + S0 * (V1RY0 - DEVC.y);
  function deviceShot(c, t, t1, hb) {
    const pop = lp(.12, 1, spr(at(t, K.grow - .06, K.grow + .32)));
    const rs = 1 + .3 * Math.sin(Math.PI * at(t, K.suck1 - .05, K.suck1 + .22)), fl = Math.sin(Math.PI * at(t, K.suck1 - .04, K.suck1 + .5));
    c.save(); c.translate(DEV0.x, DEV0.y); c.scale(S0, S0); c.translate(-DEVC.x, -DEVC.y);
    if (pop < 1) { c.translate(DEVC.x, DEVC.y); c.scale(pop, pop); c.translate(-DEVC.x, -DEVC.y) }
    device1(c, t1, { g: 1, m: 1, lv: .15, rev: V1RY0 + 4, ry: V1RY0, rs, ra: 1, fl });
    c.restore();
    const u = eio(at(t, K.suck0, K.suck1)), y = lp(DEV0.y, SLIT(), u), sp = Math.sin(Math.PI * at(t, K.suck0, K.suck1));
    const r = CORE_R * (1 - .3 * eo(at(t, K.grow - .05, K.grow + .2))) * (1 - eio(at(t, K.suck1 - .24, K.suck1)));
    if (r > .4) { c.save(); c.translate(DEV0.x, y); c.scale(1 - .16 * sp, 1 + .34 * sp); drop(c, 0, 0, r, hb, 0, 0); c.restore() }   // тянется вверх кончиком
  }
  // ---------- камера (как v23.0): медленный наезд, в конце — нырок в корпус = кадр главы 1 ----------
  const ZS1 = 1 / S0, P1 = { x: DEV0.x + S0 * (CX - DEVC.x), y: DEV0.y + S0 * (CY - DEVC.y) };
  const FZ = { x: (CX - ZS1 * P1.x) / (1 - ZS1), y: (CY - ZS1 * P1.y) / (1 - ZS1) }, VS = .004;
  function camZ(t) { return VS * t + (Math.log(ZS1) - VS * K.TE1) * eio(at(t, K.dive0, K.TE1)) }
  function shutters() {   // окна размытия движения: въезды и падения предметов, ряд, стягивание в каплю
    const o = [];
    if (VAR === 'A') { o.push([0, .45]); K.form.forEach(tf => o.push([tf - .16, tf + .32])); o.push([K.row - .1, K.row + .35]) }
    else { K.form.forEach(tf => o.push([tf - .2, tf + .06])); o.push([K.pull - .05, K.flare + .05]) }
    return o;
  }
  function scene(c, t) {
    const t1 = t - K.TE, hb = beatAt(t), fl = t > K.flare - .02 ? Math.exp(-Math.max(0, t - K.flare) / .3) * at(t, K.flare - .02, K.flare + .05) : 0;
    const s = Math.exp(camZ(t)), px = FZ.x - (FZ.x - CX) / s, py = FZ.y - (FZ.y - CY) / s;
    c.save(); liveCam1(c, t1);
    c.save(); cam(c, s, px, py);
    if (VAR === 'A') sceneA(c, t, hb, fl); else sceneB(c, t, hb, fl);
    if (t >= K.grow - .06) deviceShot(c, t, t1, hb);
    c.restore();
    title(c, t, [-1], VAR === 'A' ? K.s2 : K.back);   // титул чёткий с первого кадра (ТЗ: «без чёрного экрана с точкой» — сразу крючок)
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
    const t1 = Math.round((t - K.TE) * 3e5) / 3e5;   // v23.3: без хвоста округления — иначе зерно главы 1 (floor(t·30)) на последнем кадре берёт соседний кадр
    if (t >= K.TE1 - 1e-6) { ch1Frame(c, t1); return }   // последний кадр пролога — кадр главы 1 за 1/30 с до её кадра 0 (её рисовка и обработка, без субтитров)
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (!window.NOMB && SHUT.some(([a, b]) => t > a && t < b)) sceneMB(c, t); else scene(c, t);
    c.setTransform(1, 0, 0, 1, 0, 0); liveCam1(c, t1); post1(c, t1);   // обработка главы 1 на весь пролог: в конце она та же, что у её кадра
    c.setTransform(1, 0, 0, 1, 0, 0); if (VAR === 'A') label(c, t); subs(c, t);   // v23.3: плашка врезки — в кадре экрана, как субтитры
  }
  function cues() {   // hb, drop, land, sub, steam — синтез в v231_sound.py (как в v230_sound.py), остальное — файлы sfx*; tick и swish под запретом
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    beats().forEach((tb, i) => Q(tb, 'hb', i ? .9 : 1.1));
    if (VAR === 'A') {   // v23.2: капля падает в луч, оболочки вокруг неё, предметы на свои слова, ряд, врезки (без «бульканья»)
      Q(.02, 'whoosh', .5); Q(.42, 'land', 1); Q(.45, 'shimmer', .25);   // v23.3: капля садится мягким ударом (синтез), без «плюх»
      K.form.forEach((tf, i) => { Q(tf - .1, 'whoosh', .75, .4); Q(tf + .2, 'glass', .55, (i - 2) * .3); if (i) Q(tf + .06, 'thud', .4, (i - 3) * .3) });   // v23.3: все въезжают справа
      Q(K.row + .06, 'thud', .45, .6); Q(K.row + .15, 'shimmer', .4);
      Q(K.mac[0], 'seal', 1); Q(K.mac[0] + .03, 'thud', .6); Q(K.mac[1], 'splash', .55); Q(K.mac[2], 'stamp', .9); Q(K.mac[2] + .25, 'shimmer', .35);
      Q(K.dark, 'deep', .8);
    } else {
      K.form.forEach((tf, i) => { Q(tf - .14, 'whoosh', .5, (i - 2) * .35); Q(tf + .02, 'thud', 1.1, (i - 2) * .35); Q(tf + .03, 'impact', .55, (i - 2) * .35) });
      stampT().forEach((ts, i) => Q(ts, 'stamp', .8, (i - 2) * .35));
      Q(K.back - .05, 'deep', .9); Q(K.pull - .05, 'whoosh', 1.2);
    }
    Q(K.flare - .03, 'drop', 1); Q(K.flare - .02, 'boom', .7);
    Q(K.grow - .06, 'sub', 1); Q(K.suck1 - .04, 'steam', 1);   // v23.3: без «бульканья» и шипения молнии — мягкий саб-подъём (синтез, до втягивания капли) и лёгкий выдох пара
    Q(K.dive0 + .05, 'whoosh', 1.4); Q(K.dive0 + .18, 'dive', 1.1);
  }
  window.EP = {
    P: { bg: '#0A0D13', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f2a33a', a2: '#ef5668' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); TLS = tl.sent; LANG = tl.lang || 'ru'; MODE = 'y'; VAR = /^v232/.test(tl.ep || '') ? 'B' : 'A';
      TLX = { endT: tl.endT || tl.dur }; K = keys(); window.__K = K; CHUNKS = buildChunks();
      SHUT.length = 0; shutters().forEach(w => SHUT.push(w)); SHUT.push([K.grow - .08, K.grow + .4], [K.dive0 + .05, K.TE1 - .2]);
      for (const k in CUES) delete CUES[k]; cues(); window.CUES_READY = 1;
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      return Promise.all([...['600 20px M', '800 20px M'].map(f => document.fonts.load(f, 'АЯaz09ÜÄ?')), sprLoad()]).then(() => 0);
    },
  };
  window.__dbg = { get K() { return K }, frameTo, ch1Frame };
})();
