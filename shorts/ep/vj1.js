// Промо «Представь, ты…» про «Джул» (vj1, 16.11): ядро — копия ep/v185/00-core.js (утилиты, плашка года), голоса пока нет — черновой таймлайн tl/vj1s-ru.json (vj1_tl.py).
// v18.0 (15.11) — выпуск 2 «2020 · Лазейка одноразок» (мастер-ТЗ Gemini, «го» Андрея). 1080×1920 @ 30, 2.5D-перекладка на canvas.
// Ролики: v180s-ru — шортс (концовка: штамп «ТОЛЬКО НА YOUTUBE», ноутбук, петля в кадр 0), v180y-ru — мостик в 3-ю главу (криптекс → помада → 1924).
// Голос — ElevenLabs, Макс (как в 1-й части): voice/v180, склейка — v173_voice.py; время сцен — по словам голоса (timeline.json → K).
// Правила ТЗ: 2.5D-фон в каждой сцене (задник, свет, пол), важное — выше Y = 1480, субтитры — Y = 1720, плашка года — слева сверху,
// переходы — морфингом предметов (без шторок экраном, без чёрного и белого). Без лиц, рук, крови и предметов во рту.
// Факты: FDA, 02.01.2020 — запрет вкусов только для картриджных систем (кроме табака и ментола), одноразовые не упомянуты;
// NYTS (CDC/FDA): одноразки у парящих старшеклассников 2,4 % (2019) → 26,5 % (2020); WS-23 — синтетический холодок (Jabba, Jordt, JAMA 2022);
// Elf Bar BC5000: 13 мл, 5 %, двойная сетка, 650 мА·ч, до 5000 затяжек ≈ 650 мг никотина = 16 картриджей Juul по ~40 мг;
// синтетический никотин (Puff Bar, 2021) — чтобы уйти из-под надзора FDA; продажи одноразок в США — около 3 млрд $ в год (Circana/IRI, 2022–2023),
// а не 10 млрд, как в ТЗ; Vuse Go (BAT, 2022), NJOY куплен Altria (владелец «Мальборо» в США) в 2023.
(function () {
  'use strict';
  const WW = 1080, HH = 1920, CX = WW / 2, CY = HH / 2, TAU = Math.PI * 2, SUBY = 1720;
  let cv = null, X = null, K = null, TLW = [], TLX = {}, MODE = 's', CHUNKS = [];
  window.CUES = window.CUES || {};
  const cue = (t0, name, gain = 1, pan = 0) => { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, pan] };
  const nw = s => String(s).toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
  function Wd(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.a } throw new Error('v180: нет слова «' + q + '» #' + n) }
  function WdB(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.b } throw new Error('v180: нет слова «' + q + '» #' + n) }
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
  const FNT = o => `${o.w || 800} ${o.s || 40}px ${o.f || 'M'}`;
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
  function yearPill(c, y0, y1, k, a = 1, local = false) {   // y0 → y1: старое число уходит вверх, потом новое въезжает снизу (не поверх)
    if (a <= 0) return;
    c.save(); if (!local) c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha *= a;
    rr(c, 70, 80, 180, 68, 18); fill(c, 'rgba(15,23,42,0.88)');
    c.save(); rr(c, 70, 80, 180, 68, 18); c.clip();
    if (k <= 0 || y0 === y1) tx(c, String(k >= 1 ? y1 : y0), 160, 116, { s: 38, w: 800, c: '#fff' });
    else if (k < .5) tx(c, String(y0), 160, 116 - 70 * eio(k / .5), { s: 38, w: 800, c: '#fff' });
    else tx(c, String(y1), 160, 116 + 70 * (1 - eio((k - .5) / .5)), { s: 38, w: 800, c: '#fff' });
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
    rr(c, CX - w / 2, SUBY - h / 2, w, h, 20); fill(c, 'rgba(11,16,48,.86)');
    tx(c, ch.s, CX, SUBY + 2, { ...o, c: '#fff' }); c.restore();
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
  // ================= vj1: общие предметы и помощники =================
  const PJ = { bg: '#262a40', bg2: '#2f3454', dim: '#3a3f5e', ln: '#eef2f7', ink: '#1e2340', red: '#e8445a', warm: '#ffd479', gold: '#f2c14e', ice: '#9fdcf7',
    grn: '#7ee787', blue: '#3b5d9a', blue2: '#26406c', paper: '#f1ede4', paper2: '#e2dac9', inkP: '#2a2f4a', hole: '#141a33', orange: '#f97316' };
  let PH = [];   // фразы: {a, b, text}
  const KY = (t, x, y, z, r = 0) => [t, x, y, Math.log(z), r];
  const camOf = (KS, t) => camObj(camAt(KS, t));
  function applyCam(c, q) { c.translate(540, 960); if (q.r) c.rotate(q.r); c.scale(q.z, q.z); c.translate(-q.x, -q.y) }
  const toScr = (q, x, y) => [540 + (x - q.x) * q.z, 960 + (y - q.y) * q.z];   // без поворота
  // слой с параллаксом: p = 1 — основной план; (ox, oy) — где слои совпадают с основным
  function lay(c, q, p, ox, oy, draw) { c.save(); c.translate(540, 960); if (q.r) c.rotate(q.r * p); const s = Math.pow(q.z, p); c.scale(s, s); c.translate(-(ox + (q.x - ox) * p), -(oy + (q.y - oy) * p)); draw(c, s); c.restore() }
  function lnW(c, w, col = PJ.ln) { c.strokeStyle = col; c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke() }
  const fmt = v => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const bump = (t, a, d = .35) => { const k = at(t, a, a + d); return Math.sin(Math.PI * k) };
  function along(P, u) {   // точка на ломаной P = [[x,y],…] по доле длины u
    let L = 0; const s = [0]; for (let i = 1; i < P.length; i++) { L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); s.push(L) }
    const d = cl(u) * L; let i = 1; while (i < P.length - 1 && s[i] < d) i++;
    const k = (d - s[i - 1]) / ((s[i] - s[i - 1]) || 1); return [lp(P[i - 1][0], P[i][0], k), lp(P[i - 1][1], P[i][1], k)];
  }
  function pathL(c, P, k = 1) {   // ломаная, нарисованная на долю k
    c.beginPath(); if (k <= 0) return; c.moveTo(P[0][0], P[0][1]);
    if (k >= 1) { for (let i = 1; i < P.length; i++) c.lineTo(P[i][0], P[i][1]); return }
    let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
    let d = k * L; for (let i = 1; i < P.length && d > 0; i++) { const s = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); const u = Math.min(1, d / s); c.lineTo(lp(P[i - 1][0], P[i][0], u), lp(P[i - 1][1], P[i][1], u)); d -= s }
  }
  // огонёк сигареты: круг с горячим центром (на большом зуме — оранжевое поле, в нём табло)
  function ember(c, x, y, r, t, k = 1) {
    if (k <= 0) return; const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, mixc('#7c6f6a', '#fff1c2', k)); g.addColorStop(.38, mixc('#5b524f', '#ffb347', k)); g.addColorStop(.78, mixc('#4a4240', '#f97316', k)); g.addColorStop(1, mixc('#3a3330', '#c2410c', k));
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = g; c.fill();
  }
  // «Джул»: плоский брусок, справа картридж с окошком, слева огонёк; k — сколько «настоящего» цвета (слева направо), bp — пунктир чертежа
  function juulDev(c, x, y, L, o = {}) {
    const H = L * .155, k = o.k ?? 1, lw = Math.max(2, L * .009);
    c.save(); c.translate(x, y); if (o.ang) c.rotate(o.ang);
    if (o.sh) { c.save(); c.translate(o.sh * .5, o.sh); rr(c, -L / 2, -H / 2, L, H, H * .3); fill(c, 'rgba(10,12,30,.35)'); c.restore() }
    if (k > 0) {
      c.save(); c.beginPath(); c.rect(-L / 2 - 6, -H, (L + 12) * cl(k), H * 2); c.clip();
      rr(c, -L / 2, -H / 2, L, H, H * .3); fill(c, '#5d6479');
      c.save(); rr(c, -L / 2, -H / 2, L, H, H * .3); c.clip();
      c.fillStyle = '#4b5165'; c.fillRect(-L / 2, H * .12, L, H * .5);
      poly(c, [-L / 2 + L * .05, -H / 2, -L / 2 + L * .13, -H / 2, -L / 2 + L * .25, H / 2, -L / 2 + L * .17, H / 2]); fill(c, 'rgba(255,255,255,.13)');
      c.fillStyle = '#1e2340'; c.fillRect(L / 2 - L * .25, -H / 2, L * .25, H);
      c.fillStyle = o.liq || '#f59e0b'; c.globalAlpha = .9; c.fillRect(L / 2 - L * .21, -H * .2, L * .13, H * .4); c.globalAlpha = 1;
      c.restore();
      rr(c, -L / 2, -H / 2, L, H, H * .3); lnW(c, lw, o.lc || PJ.ln);
      c.beginPath(); c.moveTo(L / 2 - L * .25, -H / 2); c.lineTo(L / 2 - L * .25, H / 2); lnW(c, lw * .7, o.lc || PJ.ln);
      const led = o.led ?? 0; circ(c, -L / 2 + L * .09, 0, H * .08, mixc('#7dd3fc', '#4ade80', led)); if (led > 0) glow(c, -L / 2 + L * .09, 0, H * .6, '#4ade80', .7 * led);
      tx(c, 'ДЖУЛ', -L * .06, H * .03, { f: 'U', w: 800, s: H * .32, c: 'rgba(238,242,247,.8)', ls: H * .05 });
      c.restore();
    }
    if (k < 1 && o.bp) { c.save(); c.beginPath(); c.rect(-L / 2 - 6 + (L + 12) * cl(k), -H, L + 12, H * 2); c.clip(); c.setLineDash([L * .03, L * .02]); rr(c, -L / 2, -H / 2, L, H, H * .3); lnW(c, lw, o.bpc || PJ.inkP);
      c.beginPath(); c.moveTo(L / 2 - L * .25, -H / 2); c.lineTo(L / 2 - L * .25, H / 2); lnW(c, lw * .7, o.bpc || PJ.inkP); c.restore() }
    c.restore();
  }
  // картридж (под): прозрачный корпус, цветная жидкость, чёрный мундштук
  function podJ(c, x, y, s, col, o = {}) {
    if (s <= 0) return; c.save(); c.translate(x, y); if (o.r) c.rotate(o.r); c.scale(s, s); if (o.a !== undefined) c.globalAlpha *= o.a;
    rr(c, -34, -64, 68, 134, 14); fill(c, '#e6ecf5');
    c.save(); rr(c, -34, -64, 68, 134, 14); c.clip(); c.fillStyle = col; c.fillRect(-34, -8, 68, 80); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-22, -56, 9, 118); c.restore();
    rr(c, -38, -92, 76, 34, 10); fill(c, PJ.ink);
    rr(c, -34, -64, 68, 134, 14); lnW(c, 5, PJ.ink); rr(c, -38, -92, 76, 34, 10); lnW(c, 5, PJ.ink);
    if (o.lab) tx(c, o.lab, 0, 104, { f: 'U', w: 800, s: 22, c: o.lc || PJ.ink, mw: 230 });
    if (o.x > 0) { c.save(); c.globalAlpha *= cl(o.x * 2); const e = eo(o.x); c.beginPath(); c.moveTo(-60 * e, -70 * e); c.lineTo(60 * e, 70 * e); c.moveTo(60 * e, -70 * e); c.lineTo(-60 * e, 70 * e); lnW(c, 18, PJ.red); c.restore() }
    c.restore();
  }
  function packJ(c, x, y, s, o = {}) {   // пачка сигарет без марки
    if (s <= 0) return; c.save(); c.translate(x, y); if (o.r) c.rotate(o.r); c.scale(s, s);
    rr(c, -78, -106, 156, 212, 10); fill(c, '#f4f1ea'); c.save(); rr(c, -78, -106, 156, 212, 10); c.clip(); c.fillStyle = '#d33a3a'; c.fillRect(-78, -106, 156, 70);
    poly(c, [-78, -36, 0, -76, 78, -36, 78, -24, 0, -64, -78, -24]); fill(c, '#f4f1ea'); c.restore();
    rr(c, -78, -106, 156, 212, 10); lnW(c, 5, PJ.ink);
    tx(c, 'СИГАРЕТЫ', 0, 18, { f: 'U', w: 800, s: 21, c: PJ.ink }); tx(c, '20 ШТ.', 0, 56, { f: 'M', w: 800, s: 22, c: '#64748b' });
    c.restore();
  }
  // табло денег: тёмная панель, зелёные цифры (у краха — красные)
  function moneyPanel(c, x, y, w, val, o = {}) {
    const h = w * .34; c.save(); c.translate(x, y); if (o.sy !== undefined) c.scale(1, o.sy);
    rr(c, -w / 2 + w * .02, -h / 2 + w * .03, w, h, w * .05); fill(c, 'rgba(5,8,20,.45)');
    rr(c, -w / 2, -h / 2, w, h, w * .05); fill(c, '#0b1020'); rr(c, -w / 2, -h / 2, w, h, w * .05); lnW(c, w * .011, o.bd || PJ.ln);
    const col = o.col || '#7ee787'; glow(c, 0, h * .06, w * .45, col, .12);
    num(c, '$' + fmt(val), 0, o.lab ? h * .1 : 0, { f: 'J', w: 700, s: w * .092, c: col });
    if (o.lab) tx(c, o.lab, 0, -h * .27, { f: 'U', w: 800, s: w * .036, c: rgba(col, .85), ls: w * .003 });
    c.restore();
  }
  // круглый прибор (тушью на бумаге): v — 0…1, стрелка
  function dialJ(c, x, y, r, v, lab, o = {}) {
    const a0 = Math.PI * 1.1, a1 = Math.PI * 1.9;
    c.beginPath(); c.arc(x, y, r, Math.PI, 0); c.closePath(); fill(c, o.bg || '#fbf8f1'); c.beginPath(); c.arc(x, y, r, Math.PI, 0); c.closePath(); lnW(c, 6, PJ.inkP);
    const segs = [['#4ade80', 0, .45], ['#facc15', .45, .7], ['#ef4444', .7, 1]];
    segs.forEach(([col, s0, s1]) => { c.beginPath(); c.arc(x, y, r * .78, lp(a0, a1, s0), lp(a0, a1, s1)); lnW(c, r * .12, col) });
    for (let i = 0; i <= 8; i++) { const a = lp(a0, a1, i / 8); c.beginPath(); c.moveTo(x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9); c.lineTo(x + Math.cos(a) * r * .98, y + Math.sin(a) * r * .98); lnW(c, 4, PJ.inkP) }
    const a = lp(a0, a1, cl(v)); c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72); lnW(c, 9, PJ.inkP); circ(c, x, y, 13, PJ.inkP);
    tx(c, lab, x, y + 48, { f: 'U', w: 800, s: 30, c: PJ.inkP, mw: r * 2.2 });
  }
  // красный штамп по кругу
  function stampC(c, x, y, r, k, top, mid, o = {}) {
    if (k <= 0) return; const s = lp(2.4, 1, ei(cl(k * 1.4)));
    c.save(); c.translate(x, y); c.rotate(o.r ?? -.18); c.scale(s, s); c.globalAlpha *= cl(k * 3) * .92;
    ring(c, 0, 0, r, o.col || '#d61f3c', 8); ring(c, 0, 0, r * .8, o.col || '#d61f3c', 4);
    tx(c, mid, 0, 4, { f: 'U', w: 800, s: r * .5, c: o.col || '#d61f3c' }); if (top) tx(c, top, 0, -r * .55, { f: 'M', w: 800, s: r * .17, c: o.col || '#d61f3c', ls: 2 });
    c.restore();
  }
  // молекула никотина (скелетная): пиридин + пирролидин
  function nicMol(c, x, y, s, col, w = 5) {
    c.save(); c.translate(x, y); c.scale(s, s);
    const hx = (cx, cy, r) => { const p = []; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * TAU / 6; p.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r) } return p };
    const P = hx(-50, 0, 52); poly(c, P); lnW(c, w, col);
    c.beginPath(); c.moveTo(P[2] - 9, P[3] + 5); c.lineTo(P[4] - 9, P[5] - 5); lnW(c, w * .8, col);
    tx(c, 'N', P[8], P[9] + 2, { f: 'M', w: 800, s: 26, c: col });
    const q = []; for (let i = 0; i < 5; i++) { const a = Math.PI + i * TAU / 5; q.push(70 + Math.cos(a) * 40, 18 + Math.sin(a) * 40) }
    c.beginPath(); c.moveTo(P[2], P[3]); c.lineTo(q[0], q[1]); lnW(c, w, col); poly(c, q); lnW(c, w, col);
    tx(c, 'N', q[6], q[7] + 2, { f: 'M', w: 800, s: 26, c: col }); c.beginPath(); c.moveTo(q[6] + 8, q[7] + 14); c.lineTo(q[6] + 26, q[7] + 44); lnW(c, w, col);
    c.restore();
  }
  function speedTrail(c, q0, q1, a) {   // черты скорости по движению камеры (экранные)
    if (a <= 0) return; const dx = (q1.x - q0.x) * q1.z, dy = (q1.y - q0.y) * q1.z, v = Math.hypot(dx, dy); if (v < 60) return;
    const ux = dx / v, uy = dy / v, n = 18, L = Math.min(900, v * 4);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = a * cl((v - 60) / 300) * .5; c.strokeStyle = '#eef2f7'; c.lineCap = 'round';
    for (let i = 0; i < n; i++) { const x = H1(i * 3.3) * 1180 - 50, y = H1(i * 7.1 + 2) * 2020 - 50; c.lineWidth = 3 + H1(i) * 5; c.beginPath(); c.moveTo(x, y); c.lineTo(x - ux * L * (.4 + H1(i * 1.7)), y - uy * L * (.4 + H1(i * 1.7))); c.stroke() }
    c.restore();
  }
  // ================= мир 1: ночной кампус Стэнфорда → огонёк сигареты → в нём табло из будущего =================
  const E1 = { x: 776, y: 1267 }; let W1K = null, TAB = 0, T1 = {};
  function w1Init() {
    const p = PH; TAB = p[1].b + .06;
    T1 = { pan0: Wd('знаешь') - .25, on: Wd('станешь') - .2, off: TAB - .22 };
    W1K = [KY(0, 520, 900, .78), KY(1.6, 575, 1020, 1.04), KY(p[0].b, 625, 1090, 1.32), KY(T1.pan0 + .25, 700, 1180, 2.6), KY(T1.pan0 + .8, 772, 1262, 24), KY(T1.pan0 + 1.25, 775.6, 1266.6, 70), KY(TAB - .32, 776, 1267, 92), KY(TAB, 776, 1267, 200)];
  }
  function palm(c, x, y, h, lean, t) {
    c.beginPath(); c.moveTo(x - 9, y); c.quadraticCurveTo(x + lean * .5, y - h * .5, x + lean, y - h); c.lineTo(x + lean + 8, y - h); c.quadraticCurveTo(x + lean * .5 + 12, y - h * .5, x + 9, y); c.closePath(); fill(c, '#141830');
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .48 + Math.sin(t * 1.3 + i) * .03, L = 130 + (i % 2) * 30;
      c.beginPath(); c.moveTo(x + lean + 4, y - h); c.quadraticCurveTo(x + lean + Math.cos(a) * L * .6, y - h + Math.sin(a) * L * .6 - 40, x + lean + Math.cos(a) * L, y - h + Math.sin(a) * L + 20); lnW(c, 18, '#141830') }
  }
  function tower(c, x, t) {   // башня с куполом (силуэт), окна наверху светятся
    c.fillStyle = '#171b34'; c.fillRect(x - 60, 560, 120, 640); c.fillRect(x - 72, 540, 144, 34);
    c.beginPath(); c.moveTo(x - 54, 540); c.quadraticCurveTo(x, 400, x + 54, 540); c.closePath(); fill(c, '#171b34');
    c.fillRect(x - 6, 380, 12, 50); circ(c, x, 376, 10, '#171b34');
    for (let i = 0; i < 3; i++) { rr(c, x - 44 + i * 32, 590, 24, 70, 10); fill(c, rgba('#ffd479', .55 + .2 * Math.sin(t * 2 + i))) }
    for (let r = 0; r < 6; r++) { c.fillStyle = 'rgba(255,212,121,.16)'; c.fillRect(x - 40, 720 + r * 74, 14, 30); c.fillRect(x + 26, 720 + r * 74, 14, 30) }
  }
  function quad(c) {   // корпус с арками и черепичной крышей
    c.fillStyle = '#1b2040'; c.fillRect(-700, 1010, 2500, 220);
    c.fillStyle = '#4a2430'; poly(c, [-720, 1012, 1820, 1012, 1790, 965, -690, 965]); c.fill();
    for (let i = 0; i < 26; i++) { const x = -640 + i * 96; c.beginPath(); c.moveTo(x, 1230); c.lineTo(x, 1100); c.arc(x + 34, 1100, 34, Math.PI, 0); c.lineTo(x + 68, 1230); c.closePath(); fill(c, '#0f1228');
      if (i % 4 === 1) { c.beginPath(); c.arc(x + 34, 1100, 26, Math.PI, 0); c.closePath(); fill(c, 'rgba(255,212,121,.18)') } }
  }
  function hero(c, t) {   // силуэт со спины: голова, плечи; лунный контровой свет справа
    const sway = Math.sin(t * 1.1) * 3;
    c.save(); c.translate(sway, 0);
    c.beginPath(); c.moveTo(330, 1960); c.bezierCurveTo(340, 1600, 420, 1470, 540, 1420); c.lineTo(560, 1360); c.lineTo(650, 1360); c.lineTo(668, 1420);
    c.bezierCurveTo(800, 1470, 880, 1600, 900, 1960); c.closePath(); fill(c, '#070912');
    c.beginPath(); c.ellipse(606, 1262, 92, 106, 0, 0, TAU); fill(c, '#070912');
    c.beginPath(); c.ellipse(606, 1262, 92, 106, 0, -1.25, .55); lnW(c, 5, 'rgba(159,220,247,.55)');
    c.beginPath(); c.moveTo(668, 1420); c.bezierCurveTo(800, 1470, 880, 1600, 900, 1960); lnW(c, 5, 'rgba(159,220,247,.4)');
    // сигарета из-за головы, огонёк — отдельно (ember)
    c.save(); c.translate(690, 1286); c.rotate(-.24); rr(c, 0, -6, 80, 12, 4); fill(c, '#f4f1ea'); c.restore();
    c.restore();
  }
  function drawW1(c, t, q) {
    const g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#0b1124'); g.addColorStop(.62, '#1c2547'); g.addColorStop(1, '#2a2f55'); c.fillStyle = g; c.fillRect(0, 0, WW, HH);
    lay(c, q, .3, 540, 990, c => { for (let i = 0; i < 70; i++) { const x = -300 + H1(i * 3.1) * 1700, y = -200 + H1(i * 5.7) * 1100; circ(c, x, y, 1.5 + H1(i) * 2.5, rgba('#eef2f7', .35 + .4 * Math.abs(Math.sin(t * (1 + H1(i * 2)) + i)))) }
      glow(c, 860, 330, 260, '#cfe8ff', .18); circ(c, 860, 330, 64, '#eef2f7'); circ(c, 880, 318, 12, 'rgba(160,170,190,.35)'); circ(c, 842, 346, 8, 'rgba(160,170,190,.3)') });
    lay(c, q, .6, 540, 990, c => { tower(c, 250, t); palm(c, 90, 1200, 430, 40, t); palm(c, 980, 1200, 380, -30, t); quad(c) });
    applyCam(c, q);
    c.fillStyle = '#121633'; c.fillRect(-600, 1225, 2300, 900);
    hero(c, t);
    const fl = .82 + .18 * Math.sin(t * 9) * Math.sin(t * 3.7);
    glow(c, E1.x, E1.y, 46, '#fb923c', .55 * fl); ember(c, E1.x, E1.y, 7, t, fl);
  }
  function shotW1(c, t) {
    if (!W1K) w1Init(); const q = camOf(W1K, t); c.save(); drawW1(c, t, q); c.restore();
    // табло из будущего — в огоньке (экранные координаты)
    const kon = at(t, T1.on, T1.on + .16), koff = at(t, T1.off, T1.off + .16);
    if (kon > 0 && koff < 1) { const [sx, sy] = toScr(q, E1.x, E1.y), w = 9.6 * q.z;
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); const sy2 = kon < 1 ? lp(.03, 1, eo(kon)) : lp(1, .02, ei(koff)); c.globalAlpha = koff < 1 ? 1 - at(koff, .7, 1) : 1;
      moneyPanel(c, sx, sy, w, 38e9, { lab: 'ТВОЁ БУДУЩЕЕ', sy: sy2 }); c.restore() }
  }
  // ================= мир 2: стол с сигаретой → архив табачников → патент 1979 → химия на листе → чертёж «Джула» → ноутбук =================
  let W2K = null, T2 = {}, TW = 0, FOLD = null;
  const SH = { x0: 190, x1: 890 }, LAP = { cx: 1300, cy: 3560, w: 760, h: 500, iw: 680, ih: 425 };
  const DIA = { L: [350, 2830], R: [730, 2830], dish: [540, 3045] };
  const PA = [[350, 2768], [350, 2740], [420, 2740], [470, 2905], [610, 2905], [470, 2945], [610, 2945], [470, 2985], [540, 2985], [540, 3018]];
  const PB = [[730, 2768], [730, 2740], [660, 2740], [610, 2905], [470, 2905], [610, 2945], [470, 2945], [610, 2985], [540, 2985], [540, 3018]];
  function w2Init() {
    const p = PH; TW = p[10].b + .18;
    T2 = { ubit: Wd('убить'), ro: Wd('роешься'), pull: Wd('архивах'), xr0: Wd('табачных') + .05, xr1: Wd('компаний') + .45, find: Wd('находишь'), st: Wd('семьдесят'), ffall: p[4].b - .1,
      nic: Wd('никотину'), kis: Wd('кислоту'), sol: Wd('солью'), der: Wd('дерёт'), sil: Wd('сильнее'), y15: Wd('пятнадцатом'), vyp: Wd('выпускаешь'),
      fl: Wd('флешку'), zar: Wd('заряжается'), plug: Wd('ноутбука') - .05, mango: Wd('манго'), krem: Wd('крем-брюле'), myata: Wd('мята'), odn: Wd('одном'), cel: Wd('целой'), pach: Wd('пачки') };
    W2K = [KY(TAB, 920, 900, 51), KY(TAB + .5, 720, 900, 2.4), KY(TAB + 1.0, 560, 900, 1.06), KY(T2.ubit + .55, 545, 1000, 1.0), KY(p[3].a - .1, 540, 2350, .9), KY(p[3].a + .3, 470, 2640, .92),
      KY(T2.pull - .05, 600, 2660, .95), KY(T2.pull + .45, 540, 2700, 1.0), KY(p[4].a, 540, 2690, 1.02), KY(p[4].a + .7, 540, 2470, 1.06), KY(p[5].a - .2, 540, 2440, 1.1), KY(p[5].a + .45, 540, 2885, 1.7),
      KY(p[6].a, 540, 2900, 1.74), KY(p[6].a + .5, 540, 3300, 1.75), KY(p[7].a, 540, 3310, 1.78), KY(p[7].a + .5, 560, 3665, 1.55), KY(p[8].a, 560, 3680, 1.6), KY(p[8].a + .7, 820, 3670, 1.15),
      KY(T2.plug + .05, 1120, 3660, .95), KY(p[9].a, 1300, 3580, 1.3), KY(p[9].a + .45, 1300, 3560, 1.62), KY(TW - .25, 1300, 3560, 1.66), KY(TW, 2300, 3560, 1.66)];
    FOLD = []; const YRS = ['1963', '1966', '1971', '1973', '1976', '1981', '1984', '1987', '1990', '1994', '1958', '1969'], COLS = ['#1e3a8a', '#1d4ed8', '#2b4a9a', '#22336b', '#2f5bb7'];
    [2200, 2650, 3100].forEach((ry, r) => { const go = (dir) => { let x = r === 1 ? 540 + dir * 55 : 540 + dir * (H1(r) * 40); for (let i = 0; i < 16; i++) { const w = 70 + H1(r * 31 + i * 7 + dir) * 34;
      const cx = x + dir * w / 2; FOLD.push({ x: cx, y: ry, w: w - 6, h: 300 + H1(i * 3 + r) * 34, col: COLS[Math.floor(H1(i * 5 + r * 2 + dir) * 5)], yr: YRS[Math.floor(H1(i * 11 + r * 7 + dir * 3) * 12)], r, i: i * dir }); x += dir * w } };
      go(-1); go(1); if (r !== 1) FOLD.push({ x: 540, y: ry, w: 84, h: 316, col: COLS[r], yr: YRS[r + 4], r, i: 0 }) });
  }
  function cigW2(c, t) {
    const sp = at(t, T2.ubit + .12, T2.ubit + .3), tf = t - (T2.ubit + .35), burn = 1 - at(t, T2.ubit, T2.ubit + .8);
    const half = (x0, x1, side) => {   // половинка: фильтр слева, бумага, огонёк справа
      c.save(); rr(c, x0, 874, x1 - x0, 52, side ? 4 : 26); fill(c, '#f4f1ea');
      c.save(); rr(c, x0, 874, x1 - x0, 52, 26); c.clip(); if (x0 < 330) { c.fillStyle = '#d99a4e'; c.fillRect(160, 874, 170, 52); for (let i = 0; i < 14; i++) circ(c, 175 + H1(i) * 150, 880 + H1(i * 3) * 40, 3, 'rgba(120,70,20,.35)') }
      c.fillStyle = 'rgba(30,35,64,.1)'; c.fillRect(x0, 906, x1 - x0, 20); c.restore();
      rr(c, x0, 874, x1 - x0, 52, 26); lnW(c, 4, PJ.ink);
      if (side && x1 >= 900) { glow(c, 920, 900, 90, '#fb923c', .5 * burn); ember(c, 920, 900, 26, t, burn) }
      c.restore();
    };
    if (sp <= 0) { half(160, 920, 1); }
    else {
      const g = 2600, dt = Math.max(0, tf), fall = .5 * g * dt * dt, sh = 1 / (1 + dt * 1.4), al = 1 - at(dt, .7, 1.05);
      [[160, 560, -1], [560, 920, 1]].forEach(([x0, x1, d]) => { const cx = (x0 + x1) / 2; c.save(); c.globalAlpha *= al; c.translate(cx + d * 30 * eo(sp) + d * dt * 140, 900 + fall); c.rotate(d * (.18 * eo(sp) + dt * 1.6)); c.scale(sh, sh); c.translate(-cx, -900); half(x0, x1, d > 0 ? 1 : 0); c.restore() });
    }
    // красная черта «убить»
    const ks = at(t, T2.ubit - .05, T2.ubit + .15), kf = 1 - at(t, T2.ubit + .5, T2.ubit + .9);
    if (ks > 0 && kf > 0) { c.save(); c.globalAlpha *= kf; c.beginPath(); c.moveTo(500, 690); c.lineTo(lp(500, 620, eo(ks)), lp(690, 1110, eo(ks))); lnW(c, 22, PJ.red); c.restore() }
  }
  function tableW2(c, t) {
    c.fillStyle = '#3a2920'; c.fillRect(-900, -600, 2900, 2100);
    for (let i = 0; i < 22; i++) { const y = -560 + i * 95 + H1(i) * 30; c.beginPath(); c.moveTo(-900, y); c.bezierCurveTo(0, y + 30 * Math.sin(i), 900, y - 20, 2000, y + 10); lnW(c, 3, 'rgba(20,12,8,.35)') }
    glow(c, 560, 900, 760, '#ffd479', .16);
    c.fillStyle = '#24170f'; c.fillRect(-900, 1500, 2900, 70); c.fillStyle = '#191c30'; c.fillRect(-900, 1570, 2900, 2900);
  }
  function folderSpine(c, f, t) {
    let lift = 0; for (let j = 0; j < 7; j++) { const tj = T2.ro - .1 + j * .3; if (Math.floor(H1(j * 13 + 1) * 9) === ((f.i + 9) % 9) && f.r === j % 3) lift += 46 * bump(t, tj, .4) }
    const y0 = f.y + 150 - f.h - lift;
    rr(c, f.x - f.w / 2, y0, f.w, f.h, 6); fill(c, f.col); rr(c, f.x - f.w / 2, y0, f.w, f.h, 6); lnW(c, 4, PJ.ink);
    rr(c, f.x - f.w / 2 + 10, y0 + 30, f.w - 20, 70, 4); fill(c, '#e8e3d6'); tx(c, f.yr, f.x, y0 + 66, { f: 'O', w: 700, s: 22, c: PJ.ink });
    c.beginPath(); c.arc(f.x, y0 + f.h - 50, 11, 0, TAU); lnW(c, 4, 'rgba(238,242,247,.5)');
  }
  function shelvesW2(c, t, v) {
    [2200, 2650, 3100].forEach(ry => { c.fillStyle = '#1b1f36'; c.fillRect(-900, ry - 220, 2900, 380); });
    FOLD.forEach(f => { if (f.x + f.w < v.x0 - 50 || f.x - f.w > v.x1 + 50) return; folderSpine(c, f, t) });
    [2200, 2650, 3100].forEach(ry => { c.fillStyle = '#4a3526'; c.fillRect(-900, ry + 150, 2900, 30); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(-900, ry + 180, 2900, 16) });
  }
  function folder79(c, t, front) {   // папка 1979: корешок → разворачивается лицом, рентген, листа край сверху; потом падает
    const kp = eio(at(t, T2.pull, T2.pull + .45)), ff = Math.max(0, t - T2.ffall);
    const w = lp(104, 760, kp), h = lp(330, 980, kp), cx = 540, cy = lp(2650 - 15, 2700, kp) + 700 * eio(at(t, T2.find, T2.find + .7)) + 2400 * ff * ff, rot = ff * .9;
    if (front && cy - h / 2 > 4200) return;
    c.save(); c.translate(cx, cy); c.rotate(rot);
    if (kp > 0) glow(c, 0, 0, w * .9, '#fbbf24', .18 * (1 - kp) + .3 * bump(t, T2.pull - .25, .5));
    rr(c, -w / 2 + 14, -h / 2 + 20, w, h, 14); fill(c, 'rgba(5,8,20,.4)');
    rr(c, -w / 2, -h / 2, w, h, 14); fill(c, '#1d4ed8'); c.save(); rr(c, -w / 2, -h / 2, w, h, 14); c.clip();
    poly(c, [-w / 2, h * .1, w / 2, -h * .2, w / 2, h / 2, -w / 2, h / 2]); fill(c, '#1e40af');
    // рентген
    const kx = at(t, T2.xr0, T2.xr1), sy = -h / 2 + h * kx;
    if (kx > 0) { c.save(); c.beginPath(); c.rect(-w / 2, -h / 2, w, sy + h / 2); c.clip(); c.fillStyle = '#052e1a'; c.fillRect(-w / 2, -h / 2, w, h);
      for (let i = 0; i < 9; i++) { c.fillStyle = 'rgba(74,222,128,.08)'; c.fillRect(-w / 2, -h / 2 + i * h / 9, w, 2) }
      rr(c, -w * .38, -h * .4, w * .76, h * .82, 8); lnW(c, 5, '#4ade80'); tx(c, 'ПАТЕНТ', 0, -h * .32, { f: 'U', w: 800, s: w * .07, c: '#4ade80' });
      for (let i = 0; i < 5; i++) { c.fillStyle = 'rgba(74,222,128,.55)'; c.fillRect(-w * .3, -h * .24 + i * 26, w * (.6 - (i % 2) * .15), 9) }
      nicMol(c, 0, h * .05, w / 760 * 1.3, '#4ade80', 6); c.restore();
      if (kx < 1) { c.fillStyle = '#86efac'; c.fillRect(-w / 2, sy - 5, w, 10); glow(c, 0, sy, w * .6, '#4ade80', .5) } }
    c.restore();
    rr(c, -w / 2, -h / 2, w, h, 14); lnW(c, 6, PJ.ink);
    A(c, at(kp, .6, 1) * (1 - at(kx, 0, .25)), () => { rr(c, -w * .3, -h * .3, w * .6, h * .2, 10); fill(c, '#e8e3d6'); tx(c, '1979', 0, -h * .2, { f: 'O', w: 700, s: w * .13, c: PJ.ink }); tx(c, 'АРХИВ · ТАБАЧНЫЕ КОМПАНИИ', 0, h * .02, { f: 'M', w: 800, s: w * .035, c: '#dbe4ff', mw: w * .8 }) });
    if (kp <= 0) { rr(c, -w / 2 + 10, -h / 2 + 30, w - 20, 70, 4); fill(c, '#e8e3d6'); tx(c, '1979', 0, -h / 2 + 66, { f: 'O', w: 700, s: 22, c: PJ.ink }) }
    c.restore();
  }
  function sheetTop(t) { return lp(2700, 2150, eio(at(t, T2.find - .05, T2.find + .7))) }
  function sheetW2(c, t) {
    const y0 = sheetTop(t), dy = y0 - 2150; if (t < T2.find - .05) return;
    c.save(); c.translate(0, dy);
    c.save(); c.translate(18, 24); rr(c, SH.x0, 2150, 700, 1800, 8); fill(c, 'rgba(5,8,20,.4)'); c.restore();
    rr(c, SH.x0, 2150, 700, 1800, 8); fill(c, PJ.paper); rr(c, SH.x0, 2150, 700, 1800, 8); lnW(c, 4, PJ.paper2);
    tx(c, 'ПАТЕНТ', 540, 2232, { f: 'U', w: 800, s: 58, c: PJ.inkP, ls: 4 }); tx(c, 'ТАБАЧНАЯ КОМПАНИЯ · США', 540, 2292, { f: 'M', w: 800, s: 22, c: '#6b6a7a', ls: 2 });
    tx(c, 'НИКОТИНОВЫЕ СОЛИ', 540, 2338, { f: 'O', w: 700, s: 34, c: PJ.inkP });
    for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(42,47,74,.25)'; c.fillRect(240, 2385 + i * 24, 600 - (i === 2 ? 180 : 0), 9) }
    nicMol(c, 540, 2560, 1.2, PJ.inkP, 6);
    c.beginPath(); c.moveTo(230, 2660); c.lineTo(850, 2660); lnW(c, 3, 'rgba(42,47,74,.25)');
    diagram(c, t); gauges(c, t);
    c.beginPath(); c.moveTo(230, 3505); c.lineTo(850, 3505); lnW(c, 3, 'rgba(42,47,74,.25)');
    tx(c, 'ЧЕРТЁЖ УСТРОЙСТВА', 540, 3540, { f: 'M', w: 800, s: 22, c: '#6b6a7a', ls: 3 });
    for (let i = 0; i < 2; i++) { c.fillStyle = 'rgba(42,47,74,.2)'; c.fillRect(240, 3880 + i * 24, 600 - i * 220, 9) }
    stampC(c, 760, 2300, 74, at(t, T2.st - .12, T2.st + .25), 'ПАТЕНТ', '1979');
    c.restore();
  }
  function flask(c, x, y, col, lev, lab) {
    poly(c, [x - 16, y - 70, x + 16, y - 70, x + 16, y - 26, x + 64, y + 50, x - 64, y + 50, x - 16, y - 26]);
    c.save(); c.clip(); c.fillStyle = col; c.fillRect(x - 70, y + 50 - 76 * lev, 140, 80); c.restore();
    poly(c, [x - 16, y - 70, x + 16, y - 70, x + 16, y - 26, x + 64, y + 50, x - 64, y + 50, x - 16, y - 26]); lnW(c, 6, PJ.inkP);
    tx(c, lab, x, y + 84, { f: 'U', w: 800, s: 26, c: PJ.inkP });
  }
  function diagram(c, t) {
    const kA = at(t, T2.nic - .1, T2.nic + 1.3), kB = at(t, T2.kis - .1, T2.kis + 1.2);
    flask(c, DIA.L[0], DIA.L[1], '#f5b041', .8 - .3 * kA, 'НИКОТИН'); flask(c, DIA.R[0], DIA.R[1], '#7dd3fc', .8 - .3 * kB, 'КИСЛОТА');
    pathL(c, PA); lnW(c, 7, PJ.inkP); pathL(c, PB); lnW(c, 7, PJ.inkP);
    pathL(c, PA, kA); lnW(c, 4, '#f5b041'); pathL(c, PB, kB); lnW(c, 4, '#7dd3fc');
    for (let i = 0; i < 4; i++) { const ua = kA * 1.25 - i * .09, ub = kB * 1.25 - i * .09;
      if (ua > 0 && ua < 1) { const [x, y] = along(PA, ua); circ(c, x, y, 10, '#f5b041'); ring(c, x, y, 10, PJ.inkP, 3) }
      if (ub > 0 && ub < 1) { const [x, y] = along(PB, ub); circ(c, x, y, 10, '#7dd3fc'); ring(c, x, y, 10, PJ.inkP, 3) } }
    // чашка и кристалл соли
    const [dx, dy] = DIA.dish; c.beginPath(); c.ellipse(dx, dy + 12, 92, 22, 0, 0, Math.PI); lnW(c, 6, PJ.inkP); c.beginPath(); c.moveTo(dx - 92, dy + 12); c.lineTo(dx + 92, dy + 12); lnW(c, 6, PJ.inkP);
    const kc = spr(at(t, T2.sol - .35, T2.sol + .35));
    if (kc > 0) { c.save(); c.translate(dx, dy + 6); c.scale(kc, kc); glow(c, 0, -40, 120, '#9fdcf7', .5);
      poly(c, [-40, 0, -46, -54, 0, -88, 46, -54, 40, 0]); fill(c, '#9fdcf7'); poly(c, [-46, -54, 0, -88, 46, -54, 0, -40]); fill(c, '#e0f2fe');
      poly(c, [-40, 0, -46, -54, 0, -88, 46, -54, 40, 0]); lnW(c, 5, PJ.inkP); c.restore();
      A(c, at(t, T2.sol, T2.sol + .2), () => { tx(c, 'СОЛЬ', dx + 170, dy - 30, { f: 'U', w: 800, s: 44, c: PJ.red }); c.beginPath(); c.moveTo(dx + 110, dy - 4); c.lineTo(dx + 110 + 120 * eo(at(t, T2.sol + .1, T2.sol + .4)), dy - 4); lnW(c, 8, PJ.red) }) }
  }
  function gauges(c, t) {
    const v1 = lp(.88, .07, eio(at(t, T2.der - .25, T2.der + .35))) + .02 * Math.sin(t * 23), v2 = lp(.3, .96, bo(at(t, T2.sil - .3, T2.sil + .3))) + .015 * Math.sin(t * 19);
    dialJ(c, 372, 3330, 140, v1, 'ЖЖЕНИЕ В ГОРЛЕ'); dialJ(c, 708, 3330, 140, v2, 'НИКОТИН');
  }
  // ноутбук: экран (свой мир 680×425), основание, порт слева
  function laptop(c, t, dx) {
    const lit = at(t, T2.plug, T2.plug + .3); c.save(); c.translate(dx, 0);
    const X0 = LAP.cx - LAP.w / 2, Y0 = LAP.cy - LAP.h / 2;
    c.save(); c.translate(20, 26); rr(c, X0, Y0, LAP.w, LAP.h + 70, 22); fill(c, 'rgba(5,8,20,.35)'); c.restore();
    rr(c, X0, Y0, LAP.w, LAP.h, 22); fill(c, '#11131f'); rr(c, X0, Y0, LAP.w, LAP.h, 22); lnW(c, 5, PJ.ln);
    c.save(); c.translate(LAP.cx - LAP.iw / 2, LAP.cy - LAP.ih / 2); c.beginPath(); c.rect(0, 0, LAP.iw, LAP.ih); c.clip();
    c.fillStyle = '#0b1020'; c.fillRect(0, 0, LAP.iw, LAP.ih); if (lit > 0) { c.globalAlpha = lit; screenJ(c, t); c.globalAlpha = 1 }
    poly(c, [LAP.iw * .55, 0, LAP.iw * .7, 0, LAP.iw * .35, LAP.ih, LAP.iw * .2, LAP.ih]); fill(c, 'rgba(255,255,255,.04)');
    c.restore();
    poly(c, [920, 3812, 1680, 3812, 1720, 3870, 880, 3870]); fill(c, '#4b5165'); poly(c, [920, 3812, 1680, 3812, 1720, 3870, 880, 3870]); lnW(c, 5, PJ.ln);
    rr(c, 1240, 3826, 120, 14, 6); fill(c, '#3a3f52'); rr(c, 895, 3834, 18, 16, 3); fill(c, '#0b1020');
    c.restore();
  }
  function screenJ(c, t) {   // содержимое экрана: вкусы и весы (у мира 3 то же самое — не нужно)
    const W = LAP.iw, H = LAP.ih; c.fillStyle = '#f6f3ea'; c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(42,47,74,.06)'; for (let x = 0; x < W; x += 34) c.fillRect(x, 0, 2, H); for (let y = 0; y < H; y += 34) c.fillRect(0, y, W, 2);
    const PODS = [['МАНГО', '#f97316', T2.mango], ['КРЕМ-БРЮЛЕ', '#d4a373', T2.krem], ['МЯТА', '#22c55e', T2.myata]];
    const ks = at(t, T2.odn - .3, T2.odn + .3);   // переход к весам: манго едет на чашу, остальные уходят
    const piv = [340, 112], ang = lp(.22, 0, spr(at(t, T2.pach - .25, T2.pach + .45))) * at(t, T2.odn, T2.odn + .3), bl = 210;
    const pan = d => [piv[0] + d * Math.cos(ang) * bl, piv[1] + d * Math.sin(ang) * bl + 120];
    if (ks > 0) {
      c.fillStyle = PJ.inkP; c.fillRect(334, 112, 12, 270); rr(c, 270, 372, 140, 22, 8); fill(c, PJ.inkP);
      c.save(); c.translate(piv[0], piv[1]); c.rotate(ang); c.globalAlpha *= ks; rr(c, -bl - 10, -7, bl * 2 + 20, 14, 7); fill(c, PJ.inkP); c.restore(); circ(c, piv[0], piv[1], 13, PJ.inkP);
      [-1, 1].forEach(d => { const [px, py] = pan(d), ex = piv[0] + d * Math.cos(ang) * bl, ey = piv[1] + d * Math.sin(ang) * bl;
        c.beginPath(); c.moveTo(ex, ey); c.lineTo(px - 60, py); c.moveTo(ex, ey); c.lineTo(px + 60, py); lnW(c, 3, PJ.inkP); c.beginPath(); c.ellipse(px, py + 4, 76, 14, 0, 0, Math.PI); lnW(c, 6, PJ.inkP); c.beginPath(); c.moveTo(px - 76, py + 4); c.lineTo(px + 76, py + 4); lnW(c, 6, PJ.inkP) });
      const kp = eo(at(t, T2.cel - .35, T2.cel + .1)), [rx, ry] = pan(1); packJ(c, rx, lp(-140, ry - 54, kp), .5);
      A(c, at(t, T2.pach, T2.pach + .25), () => tx(c, '1 КАРТРИДЖ = 1 ПАЧКА', 340, 38, { f: 'U', w: 800, s: 30, c: PJ.red }));
    }
    PODS.forEach(([lab, col, tw0], i) => { const k = bo(at(t, tw0 - .3, tw0 + .1)); if (k <= 0) return;
      let x = lp(340, 170 + i * 170, k), y = lp(470, 200, k), s = .85, a = 1;
      if (ks > 0) { if (i === 0) { const [lx, ly] = pan(-1); x = lp(x, lx, eio(ks)); y = lp(y, ly - 66, eio(ks)); s = lp(.85, .6, ks) } else { a = 1 - ks; s *= 1 - .5 * ks } }
      podJ(c, x, y, s, col, { lab: ks > 0 ? '' : lab, a, r: (1 - k) * .4 * (i - 1) }) });
  }
  function devW2(c, t) {   // чертёж «Джула» на листе → настоящий → флешка → летит в порт
    const kb = at(t, PH[7].a - .1, PH[7].a + .6), kf = at(t, T2.vyp - .2, T2.vyp + .45), kl = eo(at(t, T2.vyp + .2, T2.vyp + .6)), km = eio(at(t, T2.zar - .25, T2.plug));
    if (kb <= 0) return;
    const x = lp(540, 900 - 150, km), y = lp(3665 - 14 * kl, 3842, km) - Math.sin(Math.PI * km) * 120, L = lp(560 * (1 + .05 * kl), 300, km);
    if (kb < 1) { c.save(); c.beginPath(); c.rect(240, 3550, 620 * kb, 260); c.clip() }
    juulDev(c, x, y, L, { k: kf, bp: 1, sh: 26 * kl * (1 - km), led: at(t, T2.plug, T2.plug + .2) });
    if (kb < 1) c.restore();
    A(c, kb * (1 - kf), () => { c.save(); c.setLineDash([10, 8]); c.beginPath(); c.moveTo(260, 3745); c.lineTo(820, 3745); lnW(c, 3, PJ.inkP); c.restore();
      tx(c, '≈ 9,5 СМ', 540, 3775, { f: 'M', w: 800, s: 24, c: PJ.inkP }) });
    const kd = at(t, T2.fl - .25, T2.fl + .1) * (1 - at(t, T2.zar - .3, T2.zar));   // как флешка: пунктир флешки рядом
    if (kd > 0) { c.save(); c.globalAlpha *= kd; c.setLineDash([12, 9]); rr(c, 330, 3410, 330, 76, 18); lnW(c, 5, PJ.red); rr(c, 660, 3426, 56, 44, 4); lnW(c, 5, PJ.red); c.restore();
      tx(c, '≈ ФЛЕШКА', 495, 3450, { f: 'U', w: 800, s: 26, c: PJ.red, a: kd }) }
  }
  function drawW2(c, t, q) {
    const v = viewRect(q);
    c.save(); applyCam(c, q);
    tableW2(c, t);
    if (v.y1 > 1800) shelvesW2(c, t, v);
    const dim = .62 * at(t, T2.pull, T2.pull + .5) + .34 * at(t, PH[5].a, PH[5].a + 1.2); if (dim > 0) { c.fillStyle = 'rgba(12,14,30,' + dim + ')'; c.fillRect(-900, 1570, 2900, 2900) }
    if (v.y1 > 1800 && t < T2.pull + .01) folder79(c, t, 0);
    sheetW2(c, t);
    if (t >= T2.pull + .01) folder79(c, t, 1);
    devW2(c, t);
    const dxl = 1100 * (1 - eo(at(t, T2.zar - .45, T2.zar + .15))); if (dxl < 1099) laptop(c, t, dxl);
    if (v.y0 < 1500 || t < T2.ubit + 1.6) cigW2(c, t);
    c.restore();
  }
  function shotW2(c, t) { if (!W2K) w2Init(); const q = camOf(W2K, t); drawW2(c, t, q); speedTrail(c, camOf(W2K, t - 1 / 30), q, at(t, TW - .3, TW - .1)) }
  // ================= мир 3: Таймс-сквер ночью — реклама «Джула» и три четверти рынка =================
  let W3K = null, T3 = {}, TH = 0;
  const BA = { cx: 540, cy: 940, w: 720, h: 1060 }, BB = { cx: 1520, cy: 760, w: 700, h: 760 }, DON = { ro: 250, ri: 150 };
  function w3Init() {
    const p = PH; T3 = { mol: Wd('молодыми'), mod: Wd('моделями'), ts: Wd('таймс-сквер'), goda: Wd('года', 1), tri: Wd('три', 1), chet: Wd('четверти'), am: Wd('америки') };
    TH = p[13].a + .45;
    W3K = [KY(TW, 540 - 900, 950, 1.0), KY(TW + .32, 540, 950, 1.0), KY(TW + .6, 545, 960, .98), KY(p[11].b, 600, 1060, .74), KY(p[12].a + .3, 1300, 900, .9), KY(p[12].a + .9, 1520, 765, 1.18),
      KY(p[12].b, 1520, 760, 1.3), KY(p[13].a, 1520, 760, 1.5), KY(TH, 1520, 760, 9.6)];
  }
  function bldg(c, x0, x1, top, col, win, seed, t) {
    c.fillStyle = col; c.fillRect(x0, top, x1 - x0, 2600 - top);
    for (let y = top + 40; y < 1650; y += 56) for (let x = x0 + 24; x < x1 - 30; x += 46) { const h = H1(x * .13 + y * .07 + seed); if (h < .45) continue; c.fillStyle = rgba(win, .25 + .35 * h); c.fillRect(x, y, 22, 30) }
  }
  function frameB(c, cx, cy, w, h) { rr(c, cx - w / 2 - 26, cy - h / 2 - 26, w + 52, h + 52, 10); fill(c, '#07080f'); }
  function adA(c, t, w, h) {   // реклама: градиент, «ДЖУЛ», устройство, силуэты моделей (без лиц)
    const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#ec4899'); g.addColorStop(1, '#f97316'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(w * .5, h * .42, 120 + i * 90 + (t * 60) % 90, 0, TAU); lnW(c, 6, 'rgba(255,255,255,.08)') }
    tx(c, 'ДЖУЛ', w / 2, 120, { f: 'U', w: 800, s: 128, c: '#fff', ls: 10 });
    juulDev(c, w / 2, 330, 470, { ang: -.12, lc: '#fff', liq: '#22c55e' });
    [[150, 0, -.05], [w / 2, 1, .04], [w - 150, 2, -.03]].forEach(([x, i, r]) => { const k = bo(at(t, (i < 2 ? T3.mol : T3.mod) - .2 + (i === 1 ? .28 : 0), (i < 2 ? T3.mol : T3.mod) + .15 + (i === 1 ? .28 : 0))); if (k <= 0) return;
      c.save(); c.translate(x, h + 10); c.rotate(r); c.scale(k, k); c.fillStyle = 'rgba(46,16,101,.88)';
      c.beginPath(); c.ellipse(0, -430, 52, 62, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-60, -366); c.quadraticCurveTo(-110, -200, -92, 0); c.lineTo(92, 0); c.quadraticCurveTo(110, -200, 60, -366); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(-80, -320); c.quadraticCurveTo(-140, -230, i === 1 ? -150 : -120, i === 1 ? -330 : -150); lnW(c, 34, 'rgba(46,16,101,.88)'); c.restore() });
  }
  function adB(c, t, w, h) {   // три четверти рынка: бублик
    c.fillStyle = PJ.hole; c.fillRect(0, 0, w, h);
    tx(c, 'РЫНОК США', w / 2, 110, { f: 'U', w: 800, s: 46, c: '#fff' }); tx(c, 'ЭЛЕКТРОННЫЕ СИГАРЕТЫ', w / 2, h - 90, { f: 'M', w: 800, s: 28, c: 'rgba(238,242,247,.7)', ls: 2 });
    const cx = w / 2, cy = h / 2, k = eio(at(t, T3.tri - .15, T3.chet + .35)) * .75;
    c.beginPath(); c.arc(cx, cy, (DON.ro + DON.ri) / 2, 0, TAU); lnW(c, DON.ro - DON.ri, '#3a3f5e');
    if (k > 0) { c.beginPath(); c.arc(cx, cy, (DON.ro + DON.ri) / 2, -Math.PI / 2, -Math.PI / 2 + TAU * k); c.lineCap = 'butt'; c.strokeStyle = PJ.orange; c.lineWidth = DON.ro - DON.ri; c.stroke() }
    circ(c, cx, cy, DON.ri, PJ.hole);
    const a = at(t, T3.chet, T3.chet + .2) * (1 - at(t, PH[13].a - .1, PH[13].a + .12)); A(c, a, () => tx(c, Math.round(k / .75 * 75) + ' %', cx, cy + 4, { f: 'U', w: 800, s: 92, c: '#fff' }));
  }
  function streetW3(c, t) {
    c.fillStyle = '#10121f'; c.fillRect(-1200, 1720, 4200, 1200);
    for (let i = 0; i < 14; i++) { const x = ((t * (520 + i * 30) + i * 300) % 3600) - 1000, y = 1790 + (i % 3) * 52; c.fillStyle = i % 2 ? '#facc15' : '#fde68a'; rr(c, x, y, 110, 26, 10); c.fill(); glow(c, x + 110, y + 13, 60, '#fff7cc', .35) }
    // бегущая строка
    c.fillStyle = '#0b0d18'; c.fillRect(-1200, 1560, 4200, 92); c.save(); c.beginPath(); c.rect(-1200, 1560, 4200, 92); c.clip();
    const s = 'ТАЙМС-СКВЕР · НЬЮ-ЙОРК · 2015 · ', w = tw(c, s, { f: 'U', w: 800, s: 50, ls: 4 }), x0 = -1200 - ((t * 220) % w);
    for (let x = x0; x < 3000; x += w) tx(c, s, x, 1607, { f: 'U', w: 800, s: 50, c: '#fbbf24', al: 'left', ls: 4 }); c.restore();
  }
  function drawW3(c, t, q) {
    const g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#120b2a'); g.addColorStop(1, '#2a1640'); c.fillStyle = g; c.fillRect(0, 0, WW, HH);
    lay(c, q, .55, 540, 950, c => { bldg(c, -900, -320, 120, '#1a1838', '#fde68a', 1, t); bldg(c, 1960, 2700, 60, '#1a1838', '#a5f3fc', 2, t); bldg(c, 900, 1150, 260, '#201c40', '#fde68a', 3, t) });
    applyCam(c, q);
    bldg(c, 120, 960, 240, '#252244', '#fde68a', 4, t); bldg(c, 1120, 1920, 200, '#2a2550', '#c4b5fd', 5, t);
    // декоративные экраны
    [[-200, 760, 420, 640, ['#22d3ee', '#6366f1']], [2230, 900, 460, 760, ['#f43f5e', '#facc15']], [1520, 1400, 640, 200, ['#10b981', '#0ea5e9']]].forEach(([x, y, w, h, cs], i) => {
      frameB(c, x, y, w, h); const gg = c.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2); gg.addColorStop(0, cs[0]); gg.addColorStop(1, cs[1]); c.fillStyle = gg; c.fillRect(x - w / 2, y - h / 2, w, h);
      for (let j = 0; j < 4; j++) { circ(c, x - w / 2 + (H1(i * 7 + j) * w), y - h / 2 + ((H1(i * 3 + j) * h + t * 90 * (j + 1)) % h), 22 + j * 10, 'rgba(255,255,255,.18)') } });
    frameB(c, BA.cx, BA.cy, BA.w, BA.h); c.save(); c.translate(BA.cx - BA.w / 2, BA.cy - BA.h / 2); c.beginPath(); c.rect(0, 0, BA.w, BA.h); c.clip(); adA(c, t, BA.w, BA.h); c.restore();
    glow(c, BA.cx, BA.cy, 700, '#f472b6', .12);
    frameB(c, BB.cx, BB.cy, BB.w, BB.h); c.save(); c.translate(BB.cx - BB.w / 2, BB.cy - BB.h / 2); c.beginPath(); c.rect(0, 0, BB.w, BB.h); c.clip(); adB(c, t, BB.w, BB.h); c.restore();
    streetW3(c, t);
    const ks = bo(at(t, T3.ts - .15, T3.ts + .25)); if (ks > 0) { c.save(); c.translate(540, 1500); c.scale(ks, ks); rr(c, -250, -50, 500, 100, 12); fill(c, '#15803d'); rr(c, -238, -38, 476, 76, 8); lnW(c, 4, '#fff'); tx(c, 'ТАЙМС-СКВЕР', 0, 3, { f: 'U', w: 800, s: 44, c: '#fff' }); c.restore() }
  }
  function shotW3(c, t) { if (!W3K) w3Init(); const q = camOf(W3K, t); c.save(); drawW3(c, t, q); c.restore(); speedTrail(c, camOf(W3K, t - 1 / 30), q, 1 - at(t, TW + .15, TW + .35)) }
  // ================= мир 4: звонок хозяев «Мальборо» → касса 12,8 млрд → табло 38 млрд → трещина =================
  let W4K = null, T4 = {}, TC1 = 0;
  const REG = { x: 1560, y: 1180 }, PIE = { x: 1560, y: 1640, r: 190 }, BIG = { x: 1560, y: -600, w: 900 };
  function w4Init() {
    const p = PH; T4 = { dek: Wd('декабрь'), zv: Wd('звонят'), mal: Wd('мальборо'), d12: Wd('двенадцать'), mlrd: Wd('миллиарда'), tret: Wd('треть'), stoit: Wd('стоит'), mlrds: Wd('миллиардов'), vl: Wd('власти'), epi: Wd('эпидемией') };
    TC1 = p[16].b + .12;
    W4K = [KY(TH, 540, 960, 3.6), KY(TH + .6, 540, 985, 1.15), KY(p[13].b, 560, 960, 1.04), KY(p[14].a + .25, 1200, 1250, .85), KY(p[14].a + .7, 1560, 1330, .84), KY(p[14].b, 1560, 1370, .8),
      KY(p[15].a + .25, 1560, -200, .95), KY(p[15].a + .9, 1560, -575, 1.05), KY(p[15].b, 1560, -590, 1.1), KY(p[16].b - .3, 1560, -590, 1.2), KY(TC1, 1560, -590, 1.24)];
  }
  function phoneW4(c, t) {
    const lit = at(t, TH + .15, TH + .45), ring = t > TH + .3 && t < PH[14].a + .2, sh = ring ? Math.sin(t * 110) * 5 * (Math.sin(t * 7) > 0 ? 1 : .2) : 0;
    c.save(); c.translate(540 + sh, 960);
    if (ring) for (let i = 0; i < 3; i++) { const u = ((t * .9 + i / 3) % 1); rr(c, -190 - u * 150, -390 - u * 150, 380 + u * 300, 780 + u * 300, 60 + u * 60); lnW(c, 8, rgba('#eef2f7', .35 * (1 - u))) }
    rr(c, -190 + 18, -390 + 24, 380, 780, 56); fill(c, 'rgba(5,8,20,.4)');
    rr(c, -190, -390, 380, 780, 56); fill(c, '#0d0f19'); rr(c, -190, -390, 380, 780, 56); lnW(c, 6, PJ.ln);
    c.save(); rr(c, -170, -360, 340, 720, 40); c.clip(); c.fillStyle = PJ.hole; c.fillRect(-170, -360, 340, 720);
    if (lit > 0) { c.globalAlpha = lit; const g = c.createLinearGradient(0, -360, 0, 360); g.addColorStop(0, '#2b0f17'); g.addColorStop(1, '#5c1220'); c.fillStyle = g; c.fillRect(-170, -360, 340, 720);
      tx(c, 'ВХОДЯЩИЙ ВЫЗОВ', 0, -300, { f: 'M', w: 800, s: 22, c: 'rgba(255,255,255,.75)', ls: 3 });
      const kl = bo(at(t, TH + .3, TH + .7)); c.save(); c.translate(0, -140); c.scale(kl, kl); rr(c, -95, -95, 190, 190, 30); fill(c, '#fff');
      c.save(); rr(c, -95, -95, 190, 190, 30); c.clip(); poly(c, [-95, -95, 95, -95, 95, 10, 0, -50, -95, 10]); fill(c, '#d61f3c'); c.restore(); rr(c, -95, -95, 190, 190, 30); lnW(c, 5, PJ.ink); c.restore();
      tx(c, '«МАЛЬБОРО»', 0, 40, { f: 'U', w: 800, s: 44, c: '#fff', mw: 310 }); tx(c, 'ALTRIA · США', 0, 92, { f: 'M', w: 800, s: 24, c: 'rgba(255,255,255,.7)', ls: 2 });
      const pu = 1 + .08 * Math.sin(t * 9); circ(c, -80, 250, 44, '#ef4444'); circ(c, 80, 250, 44 * (ring ? pu : 1), '#22c55e');
      c.save(); c.translate(80, 250); c.rotate(-.5); rr(c, -22, -8, 44, 16, 8); fill(c, '#fff'); c.restore(); c.save(); c.translate(-80, 250); c.rotate(.6); rr(c, -22, -8, 44, 16, 8); fill(c, '#fff'); c.restore();
      c.globalAlpha = 1 }
    c.restore(); c.restore();
    const kc = bo(at(t, T4.dek - .2, T4.dek + .2)); if (kc > 0) { c.save(); c.translate(150, 520); c.rotate(-.08); c.scale(kc, kc); rr(c, -120, -140, 240, 280, 14); fill(c, '#f4f1ea'); c.fillStyle = '#d61f3c'; c.fillRect(-120, -140, 240, 70);
      rr(c, -120, -140, 240, 280, 14); lnW(c, 5, PJ.ink); tx(c, 'ДЕКАБРЬ', 0, -104, { f: 'U', w: 800, s: 30, c: '#fff' }); tx(c, '2018', 0, 30, { f: 'U', w: 800, s: 78, c: PJ.ink }); c.restore() }
  }
  function registerW4(c, t) {
    c.save(); c.translate(REG.x, REG.y);
    rr(c, -330 + 22, -170 + 28, 660, 380, 40); fill(c, 'rgba(5,8,20,.4)');
    poly(c, [-330, 210, 330, 210, 290, -170, -290, -170]); fill(c, '#5b4b9a'); poly(c, [-330, 210, 330, 210, 290, -170, -290, -170]); lnW(c, 8, PJ.ln);
    for (let r = 0; r < 3; r++) for (let q = 0; q < 5; q++) { rr(c, -230 + q * 94, -120 + r * 92, 70, 60, 12); fill(c, '#e9e3ff'); lnW(c, 5, PJ.ink) }
    c.beginPath(); c.moveTo(-40, -170); c.lineTo(-40, -280); c.moveTo(40, -170); c.lineTo(40, -280); lnW(c, 18, '#3b3166');
    rr(c, -340, -480, 680, 210, 30); fill(c, '#0b1020'); rr(c, -340, -480, 680, 210, 30); lnW(c, 8, PJ.ln);
    const v = 12.8e9 * eo(at(t, T4.d12 - .1, T4.mlrd + .1)); num(c, '$' + fmt(Math.round(v / 1e8) * 1e8), 0, -375, { f: 'J', w: 700, s: 62, c: '#7ee787' });
    // чек: выезжает сверху слева
    const kc = eo(at(t, T4.d12, T4.tret)); if (kc > 0) { c.save(); c.beginPath(); c.rect(-700, -1200, 440, 1030); c.clip(); c.translate(-480, -190 - 560 * kc);
      c.beginPath(); c.moveTo(-110, 0); for (let i = 0; i <= 11; i++) c.lineTo(-110 + i * 20, i % 2 ? -14 : 0); c.lineTo(110, 600); c.lineTo(-110, 600); c.closePath(); fill(c, '#f8f6f0'); lnW(c, 4, PJ.ink);
      ['СДЕЛКА', '$12 800 000 000', 'ЗА 35 % «ДЖУЛА»', 'ДЕКАБРЬ 2018'].forEach((s, i) => tx(c, s, 0, 60 + i * 56, { f: i === 1 ? 'J' : 'M', w: 800, s: i === 1 ? 26 : 22, c: i === 1 ? PJ.ink : '#4b5563', mw: 196 }));
      c.restore() }
    c.restore();
  }
  function pieW4(c, t) {
    const k = bo(at(t, PH[14].a, PH[14].a + .4)); if (k <= 0) return; const kt = eio(at(t, T4.tret - .15, T4.tret + .35)), a0 = Math.PI * .55, a1 = a0 + TAU * .35, mid = (a0 + a1) / 2;
    c.save(); c.translate(PIE.x, PIE.y); c.scale(k, k);
    c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, PIE.r, a1, a0 + TAU); c.closePath(); fill(c, PJ.orange); lnW(c, 7, PJ.ink);
    tx(c, '«ДЖУЛ»', 40, -30, { f: 'U', w: 800, s: 40, c: '#fff' });
    const ox = Math.cos(mid) * 90 * kt - 60 * kt, oy = Math.sin(mid) * 90 * kt;
    c.beginPath(); c.moveTo(ox, oy); c.arc(ox, oy, PIE.r, a0, a1); c.closePath(); fill(c, mixc(PJ.orange, '#d61f3c', kt)); lnW(c, 7, PJ.ink);
    A(c, kt, () => tx(c, '35 %', ox + Math.cos(mid) * 110, oy + Math.sin(mid) * 110, { f: 'U', w: 800, s: 46, c: '#fff' }));
    c.restore();
  }
  function bigW4(c, t, o = {}) {
    const k = bo(at(t, PH[15].a - .2, PH[15].a + .25)); if (k <= 0) return;
    const v = 38e9 * eo(at(t, T4.stoit - .05, T4.mlrds + .2)), red = at(t, T4.epi - .05, T4.epi + .15);
    c.save(); c.translate(BIG.x, BIG.y); c.scale(k, k); moneyPanel(c, 0, 0, BIG.w, Math.round(v / 1e8) * 1e8, { lab: 'ОЦЕНКА «ДЖУЛА» · 2018', col: mixc('#7ee787', '#ef4444', red), bd: mixc(PJ.ln, '#ef4444', red) });
    if (red > 0) { const cr = [[60, -40], [0, 0]]; c.save(); c.translate(180, -40); for (let i = 0; i < 9; i++) { const a = i * TAU / 9 + .3, L = (120 + H1(i * 3) * 300) * eo(red); c.beginPath(); c.moveTo(0, 0);
      c.lineTo(Math.cos(a) * L * .45 + (H1(i) - .5) * 30, Math.sin(a) * L * .45 + (H1(i * 2) - .5) * 30); c.lineTo(Math.cos(a) * L, Math.sin(a) * L); lnW(c, 6, '#fff') } c.restore() }
    c.restore();
  }
  function drawW4(c, t, q) {
    c.fillStyle = PJ.bg; c.fillRect(0, 0, WW, HH); c.save(); applyCam(c, q);
    const v = viewRect(q); c.fillStyle = 'rgba(238,242,247,.05)'; for (let x = Math.floor(v.x0 / 60) * 60; x < v.x1; x += 60) for (let y = Math.floor(v.y0 / 60) * 60; y < v.y1; y += 60) if (((x + y) / 60) % 2 === 0) { c.beginPath(); c.arc(x, y, 3, 0, TAU); c.fill() }
    const al = at(t, T4.vl - .1, T4.vl + .2); if (al > 0) { glow(c, BIG.x - 700, BIG.y, 600, '#ef4444', .35 * al * (.6 + .4 * Math.sin(t * 12))); glow(c, BIG.x + 700, BIG.y, 600, '#3b82f6', .3 * al * (.6 + .4 * Math.sin(t * 12 + 3))) }
    phoneW4(c, t); registerW4(c, t); pieW4(c, t); bigW4(c, t);
    c.restore();
  }
  function shotW4(c, t) { if (!W4K) w4Init(); const q = camOf(W4K, t); drawW4(c, t, q) }
  // ================= мир 5: школа в разрезе → стол с уликами → клешня → бак → счётчик доли → волна одноразок =================
  let W5K = null, T5 = {}, TSW = 0, SHARD = null, SHC = null;
  const BIN = { x: 1500, y: 2760 }, CNT = { x: 1500, y: 2140 }, BAG = { x: 760, y: 2520 };
  function w5Init() {
    const p = PH; T5 = { par: Wd('парят'), pyat: Wd('пять'), shk: Wd('школьников'), zap: Wd('запрещают'), dir: Wd('директор'), uh: Wd('уходит'), isk: Wd('исков'), tys: Wd('тысячи', 1),
      prik: Wd('приказывают'), ubr: Wd('убрать'), ryn: Wd('рынка', 1), dz: Wd('двенадцать', 1), tep: Wd('теперь'), pol: Wd('полумиллиарда'), mesto: Wd('место'), zan: Wd('занимают'), odn: Wd('одноразки') };
    TSW = T5.odn + .55;
    W5K = [KY(TC1, 540, 920, .86), KY(p[17].b, 540, 900, 1.0), KY(p[18].a - .05, 545, 1150, .98), KY(p[18].a + .55, 560, 2250, 1.0), KY(p[18].b, 600, 2350, 1.02), KY(p[19].a + .3, 740, 2330, 1.0),
      KY(p[19].a + 1.3, 1050, 2300, .92), KY(p[19].b, 1480, 2450, .9), KY(p[20].a + .3, 1500, 2190, 1.15), KY(p[20].b, 1500, 2170, 1.25), KY(p[21].a + .35, 1500, 2520, .9), KY(TSW, 1500, 2560, .86)];
  }
  function schoolW5(c, t) {
    const g = c.createLinearGradient(0, -900, 0, 1500); g.addColorStop(0, '#0b1124'); g.addColorStop(1, '#1e2650'); c.fillStyle = g; c.fillRect(-1200, -900, 4000, 2400);
    glow(c, 880, 170, 220, '#cfe8ff', .18); circ(c, 880, 170, 62, '#eef2f7');
    for (let i = 0; i < 9; i++) { const x = -700 + i * 330, h = 300 + H1(i * 4) * 380; c.fillStyle = '#161b38'; c.fillRect(x, 1450 - h, 260, h + 10); for (let j = 0; j < 8; j++) { if (H1(i * 9 + j) < .5) continue; c.fillStyle = 'rgba(255,212,121,.25)'; c.fillRect(x + 30 + (j % 3) * 70, 1450 - h + 40 + Math.floor(j / 3) * 80, 30, 40) } }
    // здание школы, разрез по диагонали (#076)
    const X0 = 170, X1 = 910, Y0 = 560, FL = 222, cut = y => lp(380, 910, (1450 - y) / (1450 - Y0));
    c.fillStyle = '#2a2f55'; c.fillRect(X0, Y0, X1 - X0, 1450 - Y0); tx(c, 'ШКОЛА', 540, Y0 - 44, { f: 'U', w: 800, s: 54, c: PJ.ln, ls: 8 }); c.fillStyle = '#3a4066'; c.fillRect(X0 - 20, Y0 - 12, X1 - X0 + 40, 24);
    const red = at(t, T5.par - .2, T5.par + .9);
    for (let f = 0; f < 4; f++) { const yb = 1450 - f * FL, yt = yb - FL;
      c.fillStyle = '#ece4d2'; c.fillRect(X0 + 10, yt + 14, X1 - X0 - 20, FL - 28);
      for (let d = 0; d < 3; d++) { const dx = X0 + 70 + d * 200; rr(c, dx, yb - 70, 120, 16, 4); fill(c, '#8a6b4a'); c.fillStyle = '#1b1f36'; circ(c, dx + 60, yb - 128, 22, '#1b1f36'); rr(c, dx + 36, yb - 108, 48, 46, 14); c.fill();
        const on = H1(f * 7 + d) < .8 ? cl(red * 3 - H1(f * 3 + d * 5) * 2) : 0; if (on > 0) { glow(c, dx + 92, yb - 118, 40, '#ef4444', .7 * on); circ(c, dx + 92, yb - 118, 7, '#ef4444') } }
      c.fillStyle = '#2a2f55'; c.fillRect(X0, yb - 14, X1 - X0, 14) }
    // фасад справа от разреза
    c.beginPath(); c.moveTo(cut(1450), 1450); c.lineTo(X1, 1450); c.lineTo(X1, Y0); c.lineTo(cut(Y0), Y0); c.closePath(); fill(c, '#323864');
    c.save(); c.clip(); for (let f = 0; f < 4; f++) for (let j = 0; j < 7; j++) { const x = X0 + 30 + j * 100, y = 1450 - f * FL - 170; c.fillStyle = H1(f * 5 + j) > .5 ? 'rgba(255,212,121,.55)' : '#1b1f36'; rr(c, x, y, 64, 100, 6); c.fill() } c.restore();
    c.beginPath(); c.moveTo(cut(1450), 1450); c.lineTo(cut(Y0), Y0); lnW(c, 8, PJ.ln);
    c.fillStyle = '#10121f'; c.fillRect(-1200, 1450, 4000, 260);
    // счётчик над школой
    const kc = at(t, T5.pyat - .15, T5.shk + .2); if (kc > 0) { const ka = bo(at(t, T5.pyat - .3, T5.pyat)); c.save(); c.translate(540, 300); c.scale(ka, ka);
      rr(c, -330, -80, 660, 160, 24); fill(c, '#0b1020'); rr(c, -330, -80, 660, 160, 24); lnW(c, 6, '#ef4444'); num(c, fmt(5e6 * eo(kc)), 0, -6, { f: 'J', w: 700, s: 84, c: '#ef4444' }); tx(c, 'ШКОЛЬНИКОВ · 2019', 0, 58, { f: 'M', w: 800, s: 22, c: 'rgba(239,68,68,.85)', ls: 3 }); c.restore() }
  }
  function tableW5(c, t) {
    c.fillStyle = '#2a1c15'; c.fillRect(-1200, 1710, 4000, 2400);
    for (let i = 0; i < 18; i++) { const y = 1760 + i * 120 + H1(i) * 40; c.beginPath(); c.moveTo(-1200, y); c.bezierCurveTo(0, y + 25, 1400, y - 20, 2800, y + 10); lnW(c, 3, 'rgba(12,8,5,.35)') }
    glow(c, 640, 2300, 700, '#ffd479', .1);
    // рельс клешни
    c.fillStyle = '#4b5165'; c.fillRect(300, 1790, 1500, 22); c.fillRect(300, 1790, 22, 60); c.fillRect(1778, 1790, 22, 60);
    // вкусы — под запретом
    [['МАНГО', '#f97316'], ['КРЕМ-БРЮЛЕ', '#d4a373'], ['МЯТА', '#22c55e']].forEach(([lab, col], i) => podJ(c, 230 + i * 170, 2150, .95, col, { lab, lc: PJ.ln, x: at(t, T5.zap - .15 + i * .12, T5.zap + .2 + i * .12) }));
    // табличка «ДИРЕКТОР» падает и уезжает
    const kd = eio(at(t, T5.dir + .1, T5.dir + .45)), ku = ei(at(t, T5.uh - .05, T5.uh + .55));
    c.save(); c.translate(820 + 900 * ku, 2170 + 60 * ku); c.rotate(-Math.PI / 2 * kd * .9 + ku * 1.5); poly(c, [-130, 40, 130, 40, 110, -40, -110, -40]); fill(c, '#3b2a22'); rr(c, -100, -32, 200, 56, 8); fill(c, '#d4b26a'); tx(c, 'ДИРЕКТОР', 0, -2, { f: 'U', w: 800, s: 26, c: PJ.ink }); c.restore();
    // иски — стопка растёт
    const n = Math.floor(28 * eo(at(t, T5.isk - .1, T5.tys + .5)));
    for (let i = 0; i < n; i++) { const y = 2700 - i * 13, dx = (H1(i * 3) - .5) * 30; c.save(); c.translate(380 + dx, y); c.rotate((H1(i) - .5) * .12); rr(c, -150, -10, 300, 20, 3); fill(c, i % 2 ? '#f4f1ea' : '#e8e3d6'); lnW(c, 2, PJ.ink); c.restore() }
    if (n > 0) { const y = 2700 - n * 13 - 40; c.save(); c.translate(380, y); c.rotate(-.04); rr(c, -150, -46, 300, 92, 6); fill(c, '#f4f1ea'); lnW(c, 4, PJ.ink); tx(c, 'ИСК', -60, 0, { f: 'U', w: 800, s: 40, c: PJ.red }); tx(c, '×' + fmt(Math.min(n, 28) * 180), 66, 0, { f: 'J', w: 700, s: 28, c: PJ.ink }); c.restore() }
  }
  function clawPos(t) {   // где клешня и пакет
    const d0 = T5.prik - .1, g0 = d0 + .55, u0 = g0 + .35, m0 = u0 + .45, m1 = T5.ryn + .15, dr = m1 + .05;
    const yl = 1812, yd = BAG.y - 150, kx = eio(at(t, m0, m1)), x = lp(BAG.x, BIN.x, kx);
    let y = yl + (yd - yl) * eo(at(t, d0, g0)) * (1 - eio(at(t, u0, m0)));
    const grip = at(t, g0 - .05, g0 + .15), drop = t > dr; return { x, y, grip, drop, dr, kx };
  }
  function bagW5(c, t, P) {   // «Джул» падает в пакет-улику, пакет едет в клешне
    const kin = eo(at(t, T5.tys + .2, T5.tys + .55)), zip = at(t, T5.tys + .55, T5.tys + .8);
    let x = BAG.x, y = BAG.y; if (P.grip >= 1 && !P.drop) { x = P.x; y = P.y + 150 } else if (P.drop) { const dt = t - P.dr; x = BIN.x; y = Math.min(BIN.y - 40, P.y + 150 + .5 * 3000 * dt * dt) }
    if (P.drop && y >= BIN.y - 40) return;
    c.save(); c.translate(x, y); c.rotate(P.grip >= 1 ? Math.sin(t * 8) * .06 : 0);
    juulDev(c, 0, lp(-420, 10, kin), 230, { ang: lp(-.6, -.12, kin) });
    rr(c, -150, -110, 300, 230, 18); fill(c, 'rgba(220,235,255,.22)'); rr(c, -150, -110, 300, 230, 18); lnW(c, 5, 'rgba(238,242,247,.8)');
    c.fillStyle = mixc('#94a3b8', '#ef4444', zip); c.fillRect(-150, -110, 300 * Math.max(.05, zip), 14);
    rr(c, -120, 54, 150, 40, 6); fill(c, '#fde047'); tx(c, 'УЛИКА', -45, 75, { f: 'U', w: 800, s: 22, c: PJ.ink });
    c.restore();
  }
  function clawW5(c, t, P) {
    c.save(); c.translate(P.x, 1800); rr(c, -60, -20, 120, 50, 10); fill(c, '#5d6479'); lnW(c, 4, PJ.ln);
    c.beginPath(); c.moveTo(0, 30); c.lineTo(0, P.y - 1800 + 40); lnW(c, 8, '#94a3b8'); c.translate(0, P.y - 1800 + 40);
    rr(c, -46, 0, 92, 40, 10); fill(c, '#5d6479'); lnW(c, 4, PJ.ln);
    const op = P.drop ? 1 : 1 - P.grip; [-1, 1].forEach(d => { c.beginPath(); c.moveTo(d * 36, 36); c.lineTo(d * (60 + 40 * op), 100); c.lineTo(d * (30 + 30 * op), 150); lnW(c, 14, '#cbd5e1') });
    c.restore();
  }
  function binW5(c, t) {
    const shk = bump(t, T5.mesto - .1, .9) * Math.sin(t * 60) * 8, burst = at(t, T5.zan - .1, T5.zan + .2);
    c.save(); c.translate(BIN.x + shk, BIN.y);
    poly(c, [-210, -260, 210, -260, 170, 260, -170, 260]); fill(c, '#4b5563'); for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(i * 52, -230); c.lineTo(i * 42, 230); lnW(c, 6, 'rgba(15,23,42,.4)') }
    poly(c, [-210, -260, 210, -260, 170, 260, -170, 260]); lnW(c, 6, PJ.ln);
    c.save(); c.translate(-230, -270); c.rotate(-burst * 1.9); rr(c, 0, -26, 460, 34, 12); fill(c, '#6b7280'); lnW(c, 6, PJ.ln); rr(c, 190, -52, 80, 30, 10); fill(c, '#6b7280'); lnW(c, 5, PJ.ln); c.restore();
    c.restore();
  }
  function counterW5(c, t) {   // барабанный счётчик (#089): 12 800 000 000 → 450 000 000
    const k = bo(at(t, PH[20].a - .2, PH[20].a + .25)); if (k <= 0) return; const u = eio(at(t, T5.tep - .1, T5.pol + .3));
    c.save(); c.translate(CNT.x, CNT.y); c.scale(k, k);
    tx(c, 'ДОЛЯ «МАЛЬБОРО» В «ДЖУЛЕ»', 0, -150, { f: 'U', w: 800, s: 34, c: PJ.ln });
    rr(c, -440, -90, 880, 180, 24); fill(c, '#0b1020'); rr(c, -440, -90, 880, 180, 24); lnW(c, 7, mixc(PJ.ln, '#ef4444', u));
    const v0 = 12.8e9, v1 = .45e9, s0 = '$' + fmt(v0), s1 = ('$' + fmt(v1)).padStart(s0.length, ' ');
    c.save(); rr(c, -430, -80, 860, 160, 20); c.clip(); const fs = 76, dw = 48;
    for (let i = 0; i < s0.length; i++) { const a = s0[i], b = s1[i], x = -((s0.length - 1) * dw) / 2 + i * dw, kk = cl(u * 1.6 - i * .04);
      if (a === b || a === ' ' && b === ' ') { tx(c, a, x, 4, { f: 'J', w: 700, s: fs, c: mixc('#7ee787', '#ef4444', u) }); continue }
      const y = -170 * eio(kk); tx(c, a, x, 4 + y, { f: 'J', w: 700, s: fs, c: '#7ee787' }); tx(c, b, x, 4 + y + 170, { f: 'J', w: 700, s: fs, c: '#ef4444' }) }
    c.restore(); c.restore();
  }
  function waveScr(c, t, yC, seed) {   // волна одноразок в экранных координатах: гребень на yC, ниже — вода с одноразками
    if (yC > 2050) return; const crest = x => yC + 34 * Math.sin(x / 150 + t * 6) + 18 * Math.sin(x / 61 - t * 9);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    c.beginPath(); c.moveTo(-20, 2100); for (let x = -20; x <= 1100; x += 20) c.lineTo(x, crest(x)); c.lineTo(1100, 2100); c.closePath(); fill(c, '#3466ad'); c.save(); c.clip();
    c.fillStyle = '#4a86cf'; c.beginPath(); for (let x = -20; x <= 1100; x += 20) c.lineTo(x, crest(x) + 260); c.lineTo(1100, 2100); c.lineTo(-20, 2100); c.closePath(); c.fill();
    const cols = ['#f97316', '#ec4899', '#eab308', '#84cc16', '#22c55e', '#a855f7', '#38bdf8'];
    for (let i = 0; i < 60; i++) { const x = H1(i * 2.3 + seed) * 1100, y = crest(x) + 60 + H1(i * 5.1) * 1900; if (y > 2050) continue;
      c.save(); c.translate(x + Math.sin(t * 3 + i) * 20, y); c.rotate(t * (2 + H1(i) * 3) * (i % 2 ? 1 : -1)); rr(c, -22, -60, 44, 120, 14); fill(c, cols[i % 7]); lnW(c, 5, PJ.ink); rr(c, -14, -82, 28, 26, 8); fill(c, PJ.ln); c.restore() }
    c.restore();
    c.beginPath(); for (let x = -20; x <= 1100; x += 20) { const y = crest(x); if (x === -20) c.moveTo(x, y); else c.lineTo(x, y) } lnW(c, 26, '#f4f8ff');
    for (let i = 0; i < 7; i++) { const x = -60 + i * 190 + ((t * 120) % 190), y = crest(x); c.beginPath(); c.arc(x + 40, y - 36, 62, Math.PI * .1, Math.PI * 1.15); lnW(c, 14, '#f4f8ff'); circ(c, x - 18, y - 20, 14, '#f4f8ff') }
    c.restore();
  }
  function drawW5(c, t, q) {
    c.fillStyle = '#0b1124'; c.fillRect(0, 0, WW, HH); c.save(); applyCam(c, q); const v = viewRect(q);
    if (v.y0 < 1710) schoolW5(c, t); if (v.y1 > 1710) { tableW5(c, t); const P = clawPos(t); binW5(c, t); bagW5(c, t, P); clawW5(c, t, P); counterW5(c, t) }
    c.restore();
  }
  function shotW5(c, t) {
    if (!W5K) w5Init(); const q = camOf(W5K, t); drawW5(c, t, q);
    if (t >= T5.zan - .3) waveScr(c, t, lp(2150, -260, eio(at(t, T5.zan - .2, TSW))), 0);
  }
  // осколки табло: кадр мира 4 на TC1 бьётся на куски и падает, под ним — мир 5
  function shards(c, t) {
    if (!SHC) { SHC = mk(WW, HH); const g = SHC.getContext('2d'); const q = camOf(W4K, TC1); drawW4(g, TC1, q); hud(g, TC1 - .01) }
    if (!SHARD) { const q = camOf(W4K, TC1), [cx, cy] = toScr(q, BIG.x + 180, BIG.y - 40); SHARD = []; const n = 9;
      for (let i = 0; i < n; i++) { const a0 = i * TAU / n + .3 + (H1(i) - .5) * .3, a1 = (i + 1) * TAU / n + .3 + (H1(i + 1) - .5) * .3, r1 = 260 + H1(i * 3) * 160, R = 3000;
        const p1 = [cx, cy, cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1, cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1];
        const p2 = [cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1, cx + Math.cos(a0) * R, cy + Math.sin(a0) * R, cx + Math.cos(a1) * R, cy + Math.sin(a1) * R, cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1];
        [p1, p2].forEach((P, j) => { let mx = 0, my = 0; const m = P.length / 2; for (let k = 0; k < P.length; k += 2) { mx += P[k] / m; my += P[k + 1] / m }
          SHARD.push({ P, mx, my, d: Math.hypot(mx - cx, my - cy) * .00025 + j * .05, vx: (mx - cx) * .6, rot: (H1(i * 5 + j) - .5) * 4 }) }) } }
    const dt = t - TC1; c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    SHARD.forEach(s => { const u = Math.max(0, dt - s.d); if (u > 1.4) return; const dy = .5 * 5200 * u * u, dx = s.vx * u;
      c.save(); c.translate(s.mx + dx, s.my + dy); c.rotate(s.rot * u); c.translate(-s.mx, -s.my); poly(c, s.P); c.save(); c.clip(); c.drawImage(SHC, 0, 0); c.restore(); poly(c, s.P); lnW(c, 3, 'rgba(255,255,255,.7)'); c.restore() });
    c.restore();
  }
  // ================= мир 6: волна уходит → патент плывёт к доске → карточка «1979 · СОЛЬ» → нити → фильм =================
  let W6K = null, T6 = {};
  const CARD6 = [
    { id: '1979', x: 340, y: 420, a: '1979', b: 'СОЛЬ', open: 1 },
    { id: '2020', x: 740, y: 420, a: '2020', b: 'ЛАЗЕЙКА ОДНОРАЗОК', open: 1 },
    { id: '2014', x: 230, y: 810, a: '2014', b: 'НАГРЕВАТЕЛИ' },
    { id: '1924', x: 540, y: 825, a: '1924', b: '«МАЛЬБОРО»' },
    { id: '2022', x: 850, y: 810, a: '2022', b: 'ШАЙБЫ' }];
  const CW6 = 270, CH6 = 330, PH6 = 240;
  let CORK6 = null;
  function w6Init() {
    const p = PH; T6 = { sol: Wd('соль'), pat: Wd('патент', 1), perv: Wd('первая'), ul: Wd('улика'), film: Wd('фильме'), end: TLX.endT };
    W6K = [KY(TSW, 540, 760, 1.0), KY(p[22].a + .6, 470, 640, 1.06), KY(T6.pat + .25, 380, 500, 1.28), KY(p[23].b - .25, 540, 660, .98), KY(p[24].a + .45, 540, 820, .9), KY(T6.end, 540, 845, .86)];
  }
  function cork6() { if (CORK6) return CORK6; CORK6 = mk(WW, 1100); const g = CORK6.getContext('2d'); g.fillStyle = '#b07a4a'; g.fillRect(0, 0, WW, 1100);
    for (let y = 10, r = 0; y < 1100; y += 22, r++) for (let x = (r % 2) * 11; x < WW; x += 22) { if (H1(x * .37 + y * 1.13) > .55) continue; g.fillStyle = 'rgba(120,72,35,.35)'; g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill() } return CORK6 }
  function photo79(c, x, y, s) {
    c.fillStyle = '#1b2142'; c.fillRect(x - s / 2, y - s / 2, s, s); c.save(); c.translate(x - s * .12, y + s * .08); c.scale(s / 240, s / 240);
    poly(c, [-38, 20, 38, 20, 56, 56, -56, 56]); fill(c, '#38bdf8'); poly(c, [-14, -80, 14, -80, 14, -30, 60, 60, -60, 60, -14, -30]); lnW(c, 5, '#e0f2fe'); c.restore();
    c.save(); c.translate(x + s * .24, y + s * .2); c.scale(s / 240, s / 240); poly(c, [0, -34, 26, -10, 18, 26, -18, 26, -26, -10]); fill(c, '#7dd3fc'); poly(c, [0, -34, 26, -10, 0, 0]); fill(c, '#e0f2fe'); c.restore();
  }
  function photo20(c, x, y, s, t) {
    c.fillStyle = '#1f3563'; c.fillRect(x - s / 2, y - s / 2, s, s); c.save(); c.beginPath(); c.rect(x - s / 2, y - s / 2, s, s); c.clip();
    c.fillStyle = '#4a86cf'; c.beginPath(); c.moveTo(x - s / 2, y + s / 2); for (let i = 0; i <= 12; i++) c.lineTo(x - s / 2 + i * s / 12, y + s * .12 + 12 * Math.sin(i + t * 3)); c.lineTo(x + s / 2, y + s / 2); c.closePath(); c.fill();
    ['#f97316', '#ec4899', '#22c55e'].forEach((col, i) => { c.save(); c.translate(x - 60 + i * 60, y + 10 + (i % 2) * 18); c.rotate((i - 1) * .4); rr(c, -14, -36, 28, 72, 9); fill(c, col); lnW(c, 4, PJ.ink); c.restore() }); c.restore();
  }
  function closed6(c, x, y, s, id) {
    c.fillStyle = '#1e293b'; c.fillRect(x - s / 2, y - s / 2, s, s); c.save(); c.translate(x, y); c.fillStyle = '#334155';
    if (id === '2014') { rr(c, -22, -90, 44, 180, 14); c.fill() } else if (id === '1924') { rr(c, -14, -100, 28, 200, 6); c.fill() } else { c.beginPath(); c.ellipse(0, 0, 80, 34, 0, 0, TAU); c.fill() }
    c.lineCap = 'round'; [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(x + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke(); c.restore() });
    c.restore();
  }
  const pin6 = cd => [cd.x, cd.y - CH6 / 2 + 4];
  function card6(c, t, cd, a = 1) {
    if (a <= 0) return; c.save(); c.globalAlpha *= a; const px = cd.x, py = cd.y - CH6 / 2 + 15 + PH6 / 2;
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW6 / 2, -CH6 / 2, CW6, CH6, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW6 / 2, cd.y - CH6 / 2, CW6, CH6, 6); fill(c, '#f5f0e6'); rr(c, cd.x - CW6 / 2, cd.y - CH6 / 2, CW6, CH6, 6); lnW(c, 3, '#2b2638');
    c.save(); c.beginPath(); c.rect(px - PH6 / 2, py - PH6 / 2, PH6, PH6); c.clip();
    if (cd.id === '1979') photo79(c, px, py, PH6); else if (cd.id === '2020') photo20(c, px, py, PH6, t); else closed6(c, px, py, PH6, cd.id);
    c.restore();
    tx(c, cd.a, cd.x, cd.y + CH6 / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' }); tx(c, cd.b, cd.x, cd.y + CH6 / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW6 - 24 });
    const [qx, qy] = pin6(cd); circ(c, qx + 3, qy + 5, 14, 'rgba(0,0,0,.35)'); circ(c, qx, qy, 14, '#dc2626'); circ(c, qx - 4, qy - 4, 5, '#fca5a5');
    c.restore();
  }
  function thread6(c, A0, B0, k) { if (k <= 0) return; const [x1, y1] = pin6(A0), [x2, y2] = pin6(B0); c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(lp(x1, x2, k) + 3, lp(y1, y2, k) + 6); lnW(c, 4, 'rgba(0,0,0,.25)'); c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, k), lp(y1, y2, k)); lnW(c, 4, '#dc2626') }
  function sheetSmall(c, t, x, y, s, r) {   // тот же патент, что в мире 2 — маленький
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.save(); c.translate(10, 14); rr(c, -130, -170, 260, 340, 6); fill(c, 'rgba(0,0,0,.3)'); c.restore();
    rr(c, -130, -170, 260, 340, 6); fill(c, PJ.paper); tx(c, 'ПАТЕНТ', 0, -128, { f: 'U', w: 800, s: 30, c: PJ.inkP }); tx(c, 'НИКОТИНОВЫЕ СОЛИ', 0, -90, { f: 'O', w: 700, s: 18, c: PJ.inkP });
    nicMol(c, 0, 10, .62, PJ.inkP, 5); for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(42,47,74,.25)'; c.fillRect(-100, 90 + i * 18, 200 - i * 40, 7) }
    stampC(c, 72, -48, 34, 1, '', '1979'); c.restore();
  }
  function drawW6(c, t, q) {
    c.fillStyle = '#1f1b2b'; c.fillRect(0, 0, WW, HH); c.save(); applyCam(c, q);
    c.fillStyle = '#1f1b2b'; c.fillRect(-1200, -1200, 3480, 4400);
    c.save(); rr(c, 30, 170, WW - 60, 1050, 14); fill(c, '#5b3d26'); rr(c, 52, 192, WW - 104, 1006, 8); c.clip(); c.drawImage(cork6(), 0, 150); c.restore();
    rr(c, 30, 170, WW - 60, 1050, 14); lnW(c, 5, '#f1e6d6');
    tx(c, 'ДЕЛО: НИКОТИН', 540, 110, { f: 'U', w: 800, s: 46, c: '#f1e6d6', ls: 6 });
    const ka = at(t, T6.pat - .1, T6.pat + .3), C = CARD6;
    thread6(c, C[0], C[1], eo(at(t, T6.perv - .2, T6.perv + .3)));
    [[C[0], C[3], 0], [C[1], C[2], 1], [C[1], C[4], 2]].forEach(([a0, b0, i]) => thread6(c, a0, b0, eo(at(t, T6.ul - .1 + i * .22, T6.ul + .35 + i * .22))));
    C.forEach((cd, i) => { if (i === 0) card6(c, t, cd, ka); else card6(c, t, cd, 1) });
    // название фильма и плашка YouTube
    const kt = bo(at(t, T6.film - .5, T6.film - .1)); if (kt > 0) { c.save(); c.translate(540, 1300); c.scale(kt, kt); c.rotate(-.02);
      rr(c, -470, -100, 940, 200, 22); fill(c, '#0f172a'); rr(c, -470, -100, 940, 200, 22); lnW(c, 6, '#fbbf24');
      tx(c, 'ЧТО ВЫ ЗНАЕТЕ', 0, -36, { f: 'U', w: 800, s: 56, c: '#fff' }); tx(c, 'О НИКОТИНЕ?', 0, 40, { f: 'U', w: 800, s: 64, c: '#fbbf24' }); c.restore() }
    const ky = at(t, T6.film + .45, T6.film + .75); if (ky > 0) { const s = lp(2.4, 1, ei(ky)); c.save(); c.translate(540, 1500); c.rotate(-.05); c.scale(s, s); c.globalAlpha *= cl(ky * 3);
      rr(c, -330, -50, 660, 100, 14); fill(c, 'rgba(153,27,27,.95)'); rr(c, -330, -50, 660, 100, 14); lnW(c, 5, '#ef4444'); tx(c, '▶ ФИЛЬМ НА YOUTUBE', 0, 3, { f: 'U', w: 800, s: 44, c: '#fff' }); c.restore() }
    c.restore();
  }
  function shotW6(c, t) {
    if (!W6K) w6Init(); const q = camOf(W6K, t); drawW6(c, t, q);
    const kr = eio(at(t, TSW + .25, TSW + 1.25)); if (kr < 1) waveScr(c, t, lp(-260, 2160, kr), 3);
    // патент всплывает на волне и летит на место карточки 1979
    const ka = at(t, T6.pat - .1, T6.pat + .3), kf = eio(at(t, TSW + .5, T6.pat)), C0 = CARD6[0]; if (ka < 1) {
      const x = lp(540, C0.x, kf), y = lp(1350, C0.y, kf) - Math.sin(Math.PI * kf) * 160, s = lp(1.35, 1.0, kf);
      c.save(); applyCam(c, q); c.globalAlpha *= 1 - ka; sheetSmall(c, t, x, y, s, Math.sin(t * 2.4) * .12 * (1 - kf) - .05); c.restore() }
  }
  // ================= субтитры как у dynastixxx: крупно по центру, по 1–3 слова, звучащее слово — жёлтым =================
  let BIGS = null;
  function bigChunks() {
    const out = []; let cur = [];
    const flush = () => { if (cur.length) { out.push(cur); cur = [] } };
    TLW.forEach((w, i) => {
      const s = (cur.map(x => x.d).join(' ') + ' ' + w.d).trim();
      if (cur.length && (cur.length >= 3 || s.length > 19)) flush();
      cur.push(w);
      const nx = TLW[i + 1]; if (/[.,!?…:;»]$/.test(w.d) || !nx || nx.a - w.b > .3) flush();
    });
    return out.map((ws, i) => ({ ws, a: ws[0].a - .04, e: out[i + 1] ? out[i + 1][0].a - .04 : ws[ws.length - 1].b + .5 }));
  }
  const clean = s => s.replace(/[«»]/g, '').replace(/[.,;:]+$/, '');
  function subsBig(c, t) {
    if (!BIGS) BIGS = bigChunks(); if (t > T6.film - .1) return; const ch = BIGS.find(x => t >= x.a && t < x.e); if (!ch) return;
    const pop = bo(at(t, ch.a, ch.a + .12)), o = { f: 'M', w: 800, s: 84, ls: 0 };
    const words = ch.ws.map(w => clean(w.d)).filter(Boolean), sp = 36;
    let ws = words.map(s => tw(c, s, o)), W = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1), k = W > 960 ? 960 / W : 1;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.translate(540, 1470); c.scale(k * lp(.82, 1, pop), k * lp(.82, 1, pop)); c.globalAlpha = cl(pop * 2);
    let x = -W / 2; ch.ws.forEach((w, i) => { const s = clean(w.d); if (!s) return; const ww = tw(c, s, o), on = t >= w.a - .03 && (i === ch.ws.length - 1 || t < ch.ws[i + 1].a - .03);
      const sc = on ? 1.06 : 1; c.save(); c.translate(x + ww / 2, 0); c.scale(sc, sc);
      tx(c, s, 0, 6, { ...o, c: 'rgba(0,0,0,.45)', sw: 22, sc: 'rgba(0,0,0,.45)' });
      tx(c, s, 0, 0, { ...o, c: on ? '#ffd23f' : '#fff', sw: 14, sc: '#0b0e1a' }); c.restore(); x += ww + sp });
    c.restore();
  }
  // ================= сборка: миры по очереди, размытие движения, плашка года, звуки =================
  function scene(c, t) {
    if (t < TAB) shotW1(c, t);
    else if (t < TW) shotW2(c, t);
    else if (t < TH) shotW3(c, t);
    else if (t < TC1) shotW4(c, t);
    else if (t < TSW) { shotW5(c, t); if (t < TC1 + 1.5) shards(c, t) }
    else shotW6(c, t);
  }
  let YS = null;
  function hud(c, t) {   // плашка года: 1979 → 2015 → 2018 → 2019 → 2022
    if (!YS) YS = [[T2.find, 1979], [T2.y15, 2015], [T3.goda, 2018], [TC1, 2019], [T5.prik, 2022]];
    let i = -1; for (let j = 0; j < YS.length; j++) if (t >= YS[j][0] - .2) i = j; if (i < 0 || t > TSW + .3) return;
    const a = (i === 0 ? at(t, YS[0][0] - .2, YS[0][0] + .2) : 1) * (1 - at(t, TSW - .1, TSW + .3));
    if (i === 0) yearPill(c, 1979, 1979, 1, a); else yearPill(c, YS[i - 1][1], YS[i][1], at(t, YS[i][0] - .2, YS[i][0] + .2), a);
  }
  let MBC = null;
  function sceneMB(c, t) {
    const fast = Math.abs(t - TW) < .4 || Math.abs(t - TAB) < .3 || Math.abs(t - TH) < .3 || Math.abs(t - TC1 - .4) < .5, n = fast ? 10 : 7, sh = fast ? 1 / 30 : 1 / 40;
    if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { c.save(); scene(c, tj); c.restore(); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); g.save(); scene(g, tj); g.restore();
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    sceneMB(c, t); c.setTransform(1, 0, 0, 1, 0, 0); hud(c, t); subsBig(c, t);
  }
  function cues() {
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    // мир 1
    Q(.2, 'city', .35); Q(T1.pan0 + .1, 'whoosh', .6); Q(T1.pan0 + .7, 'dive', .7); Q(T1.on, 'neon', .7); Q(T1.on + .05, 'counter', .5); Q(T1.off, 'thud', .3);
    // мир 2
    Q(TAB, 'whoosh', .5); Q(T2.ubit - .05, 'blade', .9); Q(T2.ubit + .12, 'impact', .5); Q(T2.ubit + .4, 'whoosh', .5); Q(PH[3].a - .2, 'thud', .4);
    for (let j = 0; j < 5; j++) Q(T2.ro + j * .3, 'papers', .3, -.4 + j * .2);
    Q(T2.pull - .05, 'whoosh', .5); Q(T2.xr0, 'neon', .5); Q(T2.find, 'scroll', .7); Q(T2.st - .05, 'stamp', 1); Q(T2.st, 'impact', .4); Q(T2.ffall, 'whoosh', .4);
    Q(T2.nic - .1, 'pour', .5); Q(T2.kis - .1, 'pour', .5, .3); Q(T2.sol - .3, 'icecrack', .8); Q(T2.sol, 'shimmer', .4); Q(T2.der - .2, 'chain', .4); Q(T2.sil - .2, 'thud', .5);
    Q(T2.vyp - .2, 'marker', .5); Q(T2.vyp + .25, 'plop', .5); Q(T2.fl - .2, 'marker', .4); Q(T2.zar - .45, 'whoosh', .5); Q(T2.plug, 'plop', .7); Q(T2.plug + .05, 'glassbulb', .4);
    [T2.mango, T2.krem, T2.myata].forEach((tt, i) => Q(tt - .25, 'plop', .5, -.4 + i * .4)); Q(T2.cel - .3, 'whoosh', .4); Q(T2.pach - .2, 'thud', .6);
    // мир 3
    Q(TW - .25, 'whoosh', 1); Q(TW + .1, 'city', .5); Q(T3.mol - .1, 'plop', .4); Q(T3.mod, 'plop', .4, .3); Q(T3.ts - .1, 'stamp', .6); Q(T3.goda, 'whoosh', .5); Q(T3.tri, 'counter', .5); Q(T3.chet + .3, 'stamp', .5); Q(TH - .4, 'dive', .8);
    // мир 4
    for (let j = 0; j < 4; j++) Q(TH + .35 + j * .7, 'chain', .35, -.2); Q(T4.dek - .15, 'pageflip', .6); Q(T4.d12 - .05, 'register', 1); Q(T4.d12, 'counter', .7); Q(T4.d12 + .3, 'receipt', .6); Q(T4.tret - .1, 'whoosh', .5); Q(T4.tret + .2, 'thud', .5);
    Q(PH[15].a - .2, 'whoosh', .5); Q(T4.stoit, 'counter', .8); Q(T4.mlrds + .2, 'coins', .6); Q(T4.vl - .1, 'neon', .6); Q(T4.epi - .05, 'icecrack', 1); Q(TC1, 'impact', .9); Q(TC1 + .05, 'icecrack', .7);
    // мир 5
    Q(T5.par - .1, 'neon', .5); Q(T5.pyat, 'counter', .7); Q(PH[18].a - .05, 'whoosh', .6); [0, 1, 2].forEach(i => Q(T5.zap - .1 + i * .12, 'stamp', .7, -.4 + i * .4)); Q(T5.dir + .2, 'thud', .5); Q(T5.uh, 'whoosh', .4);
    Q(T5.isk - .1, 'papers', .8); Q(T5.tys, 'papers', .6, .3); Q(T5.tys + .25, 'whoosh', .4); Q(T5.tys + .55, 'plop', .5); Q(T5.prik - .1, 'chain', .6); Q(T5.prik + .45, 'thud', .5); Q(T5.prik + 1.0, 'chain', .5); Q(T5.ryn + .25, 'thud', .7);
    Q(PH[20].a - .2, 'whoosh', .4); Q(T5.tep - .1, 'counter', .9); Q(T5.pol + .2, 'thud', .6); Q(T5.mesto - .1, 'chain', .5); Q(T5.zan - .1, 'impact', .8); Q(T5.zan, 'wave', 1); Q(T5.zan + .3, 'splash', .9);
    // мир 6
    Q(TSW + .3, 'splash', .6); Q(TSW + .5, 'wave', .5); Q(T6.pat - .1, 'whoosh', .5); Q(T6.pat + .2, 'stamp', .5); Q(T6.perv - .1, 'chain', .4); Q(T6.ul, 'chain', .4, .3); Q(T6.film - .4, 'thud', .6); Q(T6.film + .45, 'stamp', 1); Q(T6.film + .48, 'impact', .5);
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); PH = tl.sent.map(s => ({ a: s.a, b: s.b, text: s.text }));
      TLX = { b0: tl.b0, endT: (Math.ceil(tl.dur * 30) - 1) / 30 }; K = { endT: TLX.endT }; MODE = 's';
      w1Init(); w2Init(); w3Init(); w4Init(); w5Init(); w6Init(); window.__K = { TAB, TW, TH, TC1, TSW };
      cues();
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v180f')) { const st = document.createElement('style'); st.id = 'v180f'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); for (const k in BLUR) delete BLUR[k];
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U'].map(f => document.fonts.load(f, 'АЯaz09$'))).then(() => 0);
    },
  };
})();
