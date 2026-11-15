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
  function yearPill(c, y0, y1, k, a = 1) {   // y0 → y1: цифры меняются листанием, k — 0…1
    if (a <= 0) return;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = a;
    rr(c, 70, 80, 180, 68, 18); fill(c, 'rgba(15,23,42,0.88)');
    c.save(); rr(c, 70, 80, 180, 68, 18); c.clip();
    if (k <= 0 || y0 === y1) tx(c, String(y1 === undefined ? y0 : (k >= 1 ? y1 : y0)), 160, 116, { s: 38, w: 800, c: '#fff' });
    else { const e = eio(k); tx(c, String(y0), 160, 116 - 68 * e, { s: 38, w: 800, c: '#fff', a: 1 - e }); tx(c, String(y1), 160, 116 + 68 * (1 - e), { s: 38, w: 800, c: '#fff', a: e }) }
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
  // ================= СЦЕНА 1: колпачок во льду → крыша ночного вейп-шопа =================
  const VP = { x: 540, y: 860, w: 180, h: 460 };   // одноразка кадра 0
  function iceBg(c, t) {   // ледяная студия: гало, кольца, лучи сверху, иней по углам, ледяной пол
    c.fillStyle = '#0f172a'; c.fillRect(-200, -200, WW + 400, HH + 400);
    const g = c.createRadialGradient(540, 860, 0, 540, 860, 980); g.addColorStop(0, '#0ea5e9'); g.addColorStop(.36, '#1e293b'); g.addColorStop(1, '#0f172a');
    c.fillStyle = g; c.fillRect(-200, -200, WW + 400, HH + 400);
    for (let i = 0; i < 4; i++) { const x0 = 120 + i * 300 + Math.sin(t * .4 + i) * 8; beam(c, x0, -60, 540 + (x0 - 540) * .25, 980, 40, 150, '#bae6fd', .07) }   // контровые лучи
    [300, 430, 580].forEach((r, i) => ring(c, 540, 860, r + Math.sin(t * .9 + i) * 3, rgba('#7dd3fc', .16 - i * .035), 3));
    // ледяной пол: эллипс-платформа и отражение
    c.save(); c.translate(540, 1150); c.scale(1, .22); const fg = c.createRadialGradient(0, 0, 0, 0, 0, 520); fg.addColorStop(0, 'rgba(186,230,253,.30)'); fg.addColorStop(1, 'rgba(186,230,253,0)');
    c.fillStyle = fg; c.beginPath(); c.arc(0, 0, 520, 0, TAU); c.fill(); c.restore();
    vgrad(c, 0, 1150, WW, 770, ['rgba(15,23,42,0)', 'rgba(8,14,30,.75)']);
    // иней по углам — грани кристаллов
    const corner = (sx, sy) => { c.save(); c.translate(sx ? WW : 0, sy ? HH : 0); c.scale(sx ? -1 : 1, sy ? -1 : 1);
      for (let i = 0; i < 7; i++) { const a = .12 + H1(i * 3 + sx * 7 + sy * 11) * 1.2, L = 140 + H1(i + sx + sy * 5) * 240, w = 22 + H1(i * 9) * 30;
        c.save(); c.rotate(a); poly(c, [0, -w * .3, L, 0, 0, w]); fill(c, rgba('#e0f2fe', .10 + H1(i * 5) * .07)); poly(c, [0, -w * .3, L, 0, L * .5, -w * .1]); fill(c, rgba('#ffffff', .06)); c.restore() }
      c.restore() };
    corner(0, 0); corner(1, 0); corner(0, 1); corner(1, 1);
  }
  function crystal6(c, x, y, r, a = 1, rot = 0) {   // маленький кристалл инея
    c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha *= a; c.strokeStyle = '#fff'; c.lineWidth = Math.max(1.5, r * .16); c.lineCap = 'round';
    for (let i = 0; i < 3; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-r, 0); c.lineTo(r, 0); c.stroke() }
    c.restore();
  }
  function disposable(c, x, y, o = {}) {   // корпус одноразки «МАНГО-ЛЁД» (без колпачка), центр (x, y)
    const w = o.w || VP.w, h = o.h || VP.h, s = o.s || 1;
    c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= o.a ?? 1;
    if (o.sh !== false) { c.save(); c.translate(0, h / 2 + 14); c.scale(1, .16); circ(c, 0, 0, w * .75, 'rgba(0,0,0,.35)'); c.restore() }
    const g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#f59e0b'); g.addColorStop(.45, '#fbbf24'); g.addColorStop(.62, '#22d3ee'); g.addColorStop(1, '#06b6d4');
    rr(c, -w / 2, -h / 2, w, h, 36); c.fillStyle = g; c.fill();
    c.save(); c.clip(); c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(-w / 2 + 16, -h / 2, 22, h); c.fillStyle = 'rgba(15,23,42,.18)'; c.fillRect(w / 2 - 34, -h / 2, 34, h); c.restore();
    rr(c, -w / 2, -h / 2, w, h, 36); stroke(c, 'rgba(255,255,255,.55)', 3);
    rr(c, -w / 2 + 14, -38, w - 28, 76, 14); fill(c, '#ffffff');
    tx(c, 'MANGO', 0, -14, { f: 'U', w: 800, s: 26, c: '#f59e0b', mw: w - 44 }); tx(c, 'ICE', 0, 18, { f: 'U', w: 800, s: 26, c: '#0891b2' });
    circ(c, 0, h / 2 - 34, 9, '#e0f2fe'); glow(c, 0, h / 2 - 34, 26, '#7dd3fc', .8);
    if (o.frost !== false) [[-w / 2, -h * .32, 18], [w / 2, -h * .18, 14], [-w / 2, h * .05, 15], [w / 2, h * .2, 20], [-w / 2, h * .34, 13], [w / 2, -h * .4, 12]]
      .forEach(([fx, fy, r], i) => crystal6(c, fx + (fx < 0 ? 6 : -6), fy, r, .9, i));
    c.restore();
  }
  function capShape(c, x, y, w, h, o = {}) {   // белый силиконовый колпачок / заснеженная крыша (k — сколько снега и сосулек)
    const k = o.k || 0;
    c.save(); c.translate(x, y);
    c.beginPath(); c.moveTo(-w / 2, h / 2); c.lineTo(-w / 2 * .82, -h / 2 + 18); c.quadraticCurveTo(-w / 2 * .8, -h / 2, -w / 2 * .7, -h / 2); c.lineTo(w / 2 * .7, -h / 2);
    c.quadraticCurveTo(w / 2 * .8, -h / 2, w / 2 * .82, -h / 2 + 18); c.lineTo(w / 2, h / 2); c.closePath();
    c.save(); c.translate(0, 8); fill(c, rgba('#bae6fd', .55)); c.restore();
    c.fillStyle = mixc('#f8fafc', '#e2e8f0', k * .3); c.fill(); stroke(c, '#bae6fd', 3);
    if (k > 0) {   // снег шапками и сосульки
      for (let i = 0; i < 9; i++) { const sx = -w * .38 + i * w * .095; circ(c, sx, -h / 2 + 4, (16 + H1(i) * 14) * k, '#ffffff') }
      for (let i = 0; i < 16; i++) { const sx = -w / 2 + 22 + i * (w - 44) / 15, L = (18 + H1(i * 7) * 44) * ss(.4, 1, k);
        if (L > 2) { poly(c, [sx - 7, h / 2 - 2, sx + 7, h / 2 - 2, sx, h / 2 + L]); fill(c, 'rgba(224,242,254,.92)') } }
    } else { c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(-w * .22, -h / 2 + 10, w * .1, h * .7) }
    c.restore();
  }
  function confetti(c, t, t0, x, y) {   // 18 снежинок-конфетти: ромбы, шестигранники, крестики
    const k = t - t0; if (k < 0 || k > 2.6) return;
    for (let i = 0; i < 18; i++) {
      const ang = -Math.PI / 2 + (H1(i * 3) - .5) * 2.6, v = 520 + H1(i * 5) * 520, px = x + Math.cos(ang) * v * k, py = y + Math.sin(ang) * v * k + 480 * k * k, a = 1 - at(k, 1.6, 2.6), sz = 14 + H1(i) * 8, r = k * (2 + H1(i * 7) * 5);
      c.save(); c.translate(px, py); c.rotate(r); c.globalAlpha *= a; const col = i % 3 ? '#e0f2fe' : '#38bdf8';
      if (i % 3 === 0) { poly(c, [0, -sz, sz * .6, 0, 0, sz, -sz * .6, 0]); fill(c, col) }
      else if (i % 3 === 1) { c.beginPath(); for (let j = 0; j < 6; j++) { const aa = j * TAU / 6; c[j ? 'lineTo' : 'moveTo'](Math.cos(aa) * sz * .7, Math.sin(aa) * sz * .7) } c.closePath(); fill(c, col) }
      else crystal6(c, 0, 0, sz * .7, 1);
      c.restore();
    }
  }
  function qIce(c, x, y, s, a, r = 0) { if (a <= 0) return; c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s); tx(c, '?', 0, 0, { f: 'U', w: 800, s: 180, c: '#38bdf8', sw: 10, sc: '#ffffff', a }); c.restore() }
  // ---------- ночной город (сцены 1 и 8) ----------
  function skylineLayer(c, seed, base, hmin, hmax, col, winA, wcol, t) {
    let x = -60, i = 0;
    while (x < WW + 60) {
      const w = 70 + H1(seed + i) * 110, h = hmin + H1(seed + i * 3) * (hmax - hmin); c.fillStyle = col; c.fillRect(x, base - h, w + 2, h + 2);
      if (H1(seed + i * 13) > .6) { c.fillRect(x + w * .4, base - h - 40, 6, 40) }
      if (winA > 0) for (let yy = base - h + 18; yy < base - 18; yy += 26) for (let xx = x + 10; xx < x + w - 12; xx += 20) {
        const r = H1(seed * 7 + xx * .13 + yy * .71); if (r > .58) { c.fillStyle = rgba(r > .86 ? '#7dd3fc' : wcol, winA * (.45 + .5 * H1(r * 99 + Math.floor(t * .5)))); c.fillRect(xx, yy, 9, 13) }
      }
      x += w + 6; i++;
    }
  }
  function nightSky(c, t, o = {}) {
    vgrad(c, -200, -200, WW + 400, HH + 400, ['#070b1a', '#0f1d3d', '#1e2b4f']);
    for (let i = 0; i < 70; i++) { const sx = H1(i * 3.3) * WW, sy = H1(i * 7.7) * 900, tw2 = .4 + .6 * Math.abs(Math.sin(t * (1 + H1(i)) + i)); circ(c, sx, sy, 1.2 + H1(i * 2) * 1.8, rgba('#ffffff', .55 * tw2)) }
    if (o.moon) { const { x, y, r } = o.moon; glow(c, x, y, r * 3.2, '#e0f2fe', .35); circ(c, x, y, r, '#f8fafc'); circ(c, x - r * .3, y - r * .2, r * .18, 'rgba(148,163,184,.25)'); circ(c, x + r * .25, y + r * .3, r * .12, 'rgba(148,163,184,.2)') }
    if (o.clouds) for (let i = 0; i < 4; i++) { const cx = ((H1(i * 5) * 1400 + t * 14 * (1 + i * .3)) % 1500) - 200, cy = 220 + i * 150; c.save(); c.globalAlpha = .22; [0, 70, 140].forEach((dx, j) => circ(c, cx + dx, cy + (j === 1 ? -22 : 0), 60 + j * 4, '#334155')); c.restore() }
  }
  function lamp(c, x, base, h, a = 1) {
    c.save(); c.globalAlpha *= a; c.fillStyle = '#1f2937'; c.fillRect(x - 7, base - h, 14, h); c.fillRect(x - 7, base - h, 70 * Math.sign(540 - x) || 70, 10);
    const lx = x + 62 * Math.sign(540 - x); rr(c, lx - 26, base - h + 6, 52, 22, 8); fill(c, '#111827'); circ(c, lx, base - h + 30, 12, '#fde68a');
    beam(c, lx, base - h + 30, lx, base, 14, 150, '#fde68a', .22); c.save(); c.translate(lx, base + 4); c.scale(1, .2); glow(c, 0, 0, 170, '#fde68a', .35); c.restore();
    c.restore();
  }
  function stele24(c, x, base, t, a = 1) {   // неоновая стела заправки «24H»
    c.save(); c.globalAlpha *= a; c.fillStyle = '#0b1324'; c.fillRect(x - 12, base - 520, 24, 520); rr(c, x - 70, base - 680, 140, 190, 14); fill(c, '#111c34');
    rr(c, x - 70, base - 680, 140, 190, 14); stroke(c, '#22d3ee', 4); glow(c, x, base - 585, 140, '#22d3ee', .22 + .05 * Math.sin(t * 6));
    tx(c, '24H', x, base - 600, { f: 'U', w: 800, s: 44, c: '#a5f3fc' }); tx(c, 'FUEL · SHOP', x, base - 540, { f: 'O', w: 500, s: 18, c: '#67e8f9', ls: 2 }); c.restore();
  }
  function street(c, t, a = 1) {   // бордюр, тротуар, асфальт с пунктиром и неоновыми бликами
    c.save(); c.globalAlpha *= a;
    vgrad(c, 0, 1310, WW, 40, ['#475569', '#334155']); c.fillStyle = '#64748b'; c.fillRect(0, 1310, WW, 6);
    vgrad(c, 0, 1350, WW, 600, ['#1e293b', '#0f172a', '#0b1120']);
    c.save(); c.setLineDash([60, 46]); c.lineDashOffset = -t * 30; c.strokeStyle = 'rgba(248,250,252,.7)'; c.lineWidth = 8; c.beginPath(); c.moveTo(-40, 1500); c.lineTo(WW + 40, 1500); c.stroke(); c.restore();
    [['#22d3ee', 260], ['#f472b6', 720], ['#fde68a', 120], ['#fde68a', 980]].forEach(([col, x], i) => { c.save(); c.translate(x, 1420 + i * 18); c.scale(1, .12); glow(c, 0, 0, 160, col, .22); c.restore() });
    c.restore();
  }
  function bush(c, x, y, s, a = 1) {
    if (a <= 0) return; c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= Math.min(1, a);
    [[-50, 0, 52], [0, -26, 62], [52, 0, 50], [0, 10, 58]].forEach(([dx, dy, r], i) => circ(c, dx, dy, r, i % 2 ? '#0f766e' : '#115e59'));
    [[-40, -30, 22], [10, -64, 24], [52, -26, 20]].forEach(([dx, dy, r]) => circ(c, dx, dy, r, 'rgba(224,242,254,.85)'));
    for (let i = 0; i < 5; i++) crystal6(c, -60 + i * 30, -10 + H1(i) * 30, 8, .8, i);
    c.restore();
  }
  const BOXC = ['#ec4899', '#f97316', '#34d399', '#a78bfa', '#f59e0b', '#22d3ee', '#fb7185', '#84cc16'];
  function vapeBox(c, x, y, w, h, col, o = {}) {   // коробка одноразки: цветная, с окошком-силуэтом вейпа
    c.save(); c.translate(x, y); if (o.r) c.rotate(o.r);
    rr(c, -w / 2, -h / 2, w, h, Math.min(10, w * .14)); fill(c, col); c.save(); c.clip(); c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(-w / 2, -h / 2, w * .3, h); c.fillStyle = 'rgba(0,0,0,.16)'; c.fillRect(w * .28, -h / 2, w * .22, h); c.restore();
    rr(c, -w * .22, -h * .32, w * .44, h * .56, w * .12); fill(c, 'rgba(255,255,255,.85)'); rr(c, -w * .12, -h * .26, w * .24, h * .44, w * .08); fill(c, col);
    if (o.label) tx(c, o.label, 0, h * .38, { f: 'O', w: 700, s: Math.max(10, w * .16), c: '#fff', mw: w * .86 });
    c.restore();
  }
  function shop(c, t, k, roofW, roofH, roofY) {   // фасад «VAPE 24/7» растёт из-под крыши (k — 0…1, с пружиной)
    if (k <= 0) return;
    const top = roofY + roofH / 2 - 4, H = 1310 - top, h = H * k;
    c.save(); c.beginPath(); c.rect(150, top, 780, h); c.clip();
    c.translate(0, -(1 - k) * H * .25);
    vgrad(c, 170, top, 740, H, ['#1e293b', '#172033']);
    for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(255,255,255,.035)'; c.fillRect(170, top + 30 + i * 40, 740, 2) }
    // неоновая вывеска
    const on = t > K.shopSign ? (t < K.shopSign + .35 ? (Math.sin(t * 90) > 0 ? 1 : .25) : 1) : 0;
    rr(c, 300, top + 18, 480, 92, 18); fill(c, '#0b1220'); rr(c, 300, top + 18, 480, 92, 18); stroke(c, rgba('#2dd4bf', .35 + .65 * on), 5);
    glow(c, 540, top + 64, 300, '#2dd4bf', .25 * on); tx(c, 'VAPE 24/7', 540, top + 66, { f: 'U', w: 800, s: 52, c: mixc('#134e4a', '#99f6e4', on) });
    // витрина 640×340
    const wy = top + 150; rr(c, 220, wy, 640, 340, 10); fill(c, '#0c1426');
    c.save(); rr(c, 220, wy, 640, 340, 10); c.clip(); glow(c, 540, wy + 170, 420, '#38bdf8', .18);
    for (let r = 0; r < 3; r++) { c.fillStyle = '#334155'; c.fillRect(220, wy + 105 + r * 110, 640, 8);
      for (let i = 0; i < 8; i++) { const kk = spr(at(t, K.shopBox + (r * 8 + i) * .028, K.shopBox + .45 + (r * 8 + i) * .028)); if (kk <= 0) continue;
        c.save(); c.translate(262 + i * 79, wy + 102 + r * 110); c.scale(kk, kk); vapeBox(c, 0, -48, 55, 95, BOXC[(i + r * 3) % 8]); c.restore() } }
    c.globalAlpha = .16; c.fillStyle = '#fff'; [[-60, 120], [180, 70], [420, 150]].forEach(([dx, w]) => poly(c, [220 + dx, wy + 340, 220 + dx + w, wy + 340, 220 + dx + w + 200, wy, 220 + dx + 200, wy])); c.fill();
    c.restore();
    rr(c, 220, wy, 640, 340, 10); stroke(c, '#94a3b8', 6);
    rr(c, 180, 1290, 720, 20, 4); fill(c, '#475569');
    c.restore();
  }
  function shot1(c, t) {
    const kA = ss(K.morph0 + .1, K.morph0 + .7, t);   // ледяная студия → ночной город
    if (kA < 1) iceBg(c, t);
    if (kA > 0) A(c, kA, () => {
      const rise = 260 * (1 - eo(at(t, K.morph0 + .15, K.morph0 + .95)));
      const mx = lp(540, 860, eio(at(t, K.morph0 + .05, K.morph0 + .85))), my = lp(860, 300, eio(at(t, K.morph0 + .05, K.morph0 + .85))), mr = lp(240, 74, eio(at(t, K.morph0 + .05, K.morph0 + .85)));
      nightSky(c, t, { moon: { x: mx, y: my, r: mr }, clouds: true });
      c.save(); c.translate(0, rise); skylineLayer(c, 3, 1320, 380, 900, '#16213d', .45, '#fde68a', t); c.restore();
      c.save(); c.translate(0, rise * 1.4); skylineLayer(c, 11, 1320, 220, 560, '#1d2a4a', .7, '#fde68a', t); c.restore();
      street(c, t); lamp(c, 100, 1316, 560); stele24(c, 975, 1316, t);
    });
    // одноразка и «?» гаснут прямо на месте
    const kv = 1 - ss(K.morph0 + .05, K.morph0 + .5, t);
    if (kv > 0) {
      disposable(c, VP.x, VP.y, { a: kv });
      const kq = bo(at(t, .7, 1.25)); qIce(c, 540, lp(640, 470, kq), lp(.2, 1, kq), Math.min(kq, 1) * kv, Math.sin(t * 2.2) * .06);
    }
    confetti(c, t, .72, 540, 600);
    // колпачок: подлёт (бо) → падение и рост в крышу
    const kp = bo(at(t, .5, 1.3)), kf = eio(at(t, K.morph0 + .1, K.morph0 + .75));
    const cy = lp(lp(585, 340, kp), 680, kf), cw = lp(140, 780, kf), ch = lp(95, 110, kf);
    const kr = spr(at(t, K.morph0 + .65, K.morph0 + 1.3));
    if (kA > .2) { bush(c, 140, 1250, .9, bo(at(t, K.shopBox + .2, K.shopBox + .6))); bush(c, 940, 1250, .9, bo(at(t, K.shopBox + .3, K.shopBox + .7))) }
    shop(c, t, kr, cw, ch, cy);
    capShape(c, 540, cy, cw, ch, { k: ss(.3, 1, kf) });
    if (kA > 0) vignette(c, .45 * kA);
  }
  // ================= СЦЕНА 2: фура-шторка → зал FDA и гильотина =================
  const TRK = { w: 1250, y0: 180, y1: 1530 };
  const truckX = t => lp(1400, -1400, at(t, K.truck0, K.truck1));   // левый край (кабина) едет справа налево
  function truck(c, x, t) {
    const { w, y0, y1 } = TRK, H = y1 - y0;
    // фары: длинные жёлтые конусы вперёд (влево)
    beam(c, x + 40, y1 - 260, x - 900, y1 - 160, 30, 260, '#fde047', .32); beam(c, x + 40, y1 - 420, x - 900, y1 - 420, 26, 220, '#fde047', .22);
    // кабина
    c.fillStyle = '#090d16'; poly(c, [x + 40, y1 - 120, x + 40, y0 + 420, x + 120, y0 + 260, x + 330, y0 + 240, x + 330, y1 - 120]); c.fill();
    poly(c, [x + 90, y0 + 470, x + 140, y0 + 300, x + 300, y0 + 290, x + 300, y0 + 470]); fill(c, '#1e2a44');
    poly(c, [x + 120, y0 + 450, x + 150, y0 + 330, x + 210, y0 + 320, x + 170, y0 + 450]); fill(c, 'rgba(148,163,184,.25)');
    circ(c, x + 48, y1 - 260, 22, '#fde047'); circ(c, x + 48, y1 - 420, 18, '#fde68a');
    for (let i = 0; i < 6; i++) { c.fillStyle = '#2a3550'; c.fillRect(x + 60, y1 - 330 + i * 22, 70, 10) }   // решётка радиатора
    // прицеп с металлической расшивкой
    vgrad(c, x + 340, y0, w - 340, H - 120, ['#111827', '#090d16']);
    for (let i = 0; i < 22; i++) { c.fillStyle = 'rgba(148,163,184,.08)'; c.fillRect(x + 360 + i * 41, y0 + 10, 6, H - 140) }
    c.fillStyle = 'rgba(148,163,184,.15)'; c.fillRect(x + 340, y0, w - 340, 8); c.fillRect(x + 340, y1 - 128, w - 340, 10);
    c.fillStyle = '#0b0f19'; c.fillRect(x, y1 - 130, w, 40);
    [x + 200, x + 520, x + 640, x + 1010, x + 1130].forEach(wx => { circ(c, wx, y1 - 70, 84, '#05070d'); circ(c, wx, y1 - 70, 40, '#1f2937'); circ(c, wx, y1 - 70, 14, '#4b5563') });
    c.fillStyle = 'rgba(248,113,113,.9)'; c.fillRect(x + w - 14, y1 - 300, 12, 60); glow(c, x + w - 8, y1 - 270, 60, '#ef4444', .5);
  }
  function hallBg(c, t) {   // правительственный зал: стены, панели, пилястры, печать, софиты, помост
    vgrad(c, -100, -100, WW + 200, 1460, ['#1a1625', '#231d30', '#1a1625']);
    c.save(); c.globalAlpha = .08; ring(c, 540, 640, 380, '#e2e8f0', 10); ring(c, 540, 640, 320, '#e2e8f0', 4);
    c.translate(540, 640); for (let i = 0; i < 26; i++) { const a = -Math.PI * .95 + i * .075; c.save(); c.rotate(a + Math.PI / 2); tx(c, 'FDA · DEPARTMENT OF HEALTH ·'[i] || '', 0, -350, { f: 'O', w: 700, s: 30, c: '#e2e8f0' }); c.restore() }
    c.restore(); glow(c, 540, 640, 520, '#7c2d4a', .18);
    vgrad(c, 0, 900, WW, 460, ['#2a1d22', '#22171c']);
    for (let i = 0; i < 9; i++) { c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 3; c.strokeRect(150 + i * 88, 940, 74, 380) }
    c.fillStyle = 'rgba(255,255,255,.05)'; c.fillRect(0, 900, WW, 6);
    [85, 995].forEach(px => {   // мраморные пилястры
      vgrad(c, px - 55, 0, 110, 1360, ['#cbd5e1', '#94a3b8']); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(px - 40, 0, 16, 1360);
      c.strokeStyle = 'rgba(71,85,105,.35)'; c.lineWidth = 2; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(px - 50, 200 + i * 230); c.bezierCurveTo(px - 10, 260 + i * 230, px + 10, 150 + i * 230, px + 50, 230 + i * 230); c.stroke() }
      c.fillStyle = '#e2e8f0'; c.fillRect(px - 70, 1300, 140, 60); c.fillRect(px - 70, 0, 140, 40);
    });
    beam(c, 160, -40, 470, 1300, 30, 230, '#fde68a', .12); beam(c, 920, -40, 610, 1300, 30, 230, '#fde68a', .12);
    // помост со ступенями
    vgrad(c, -100, 1360, WW + 200, 600, ['#3a2416', '#2a1a10', '#1a100a']);
    c.fillStyle = '#4a2f1d'; c.fillRect(-100, 1360, WW + 200, 18); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(-100, 1450, WW + 200, 12);
    for (let i = 0; i < 12; i++) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-60 + i * 100, 1378, 3, 560) }
    c.save(); c.translate(540, 1372); c.scale(1, .1); glow(c, 0, 0, 520, '#fde68a', .25); c.restore();
  }
  const CART = [{ x: 300, col: '#f97316', n: 'МАНГО' }, { x: 460, col: '#ec4899', n: 'ФРУКТЫ' }, { x: 620, col: '#eab308', n: 'ДЕСЕРТ' }, { x: 780, col: '#10b981', n: 'МЯТА' }];
  const CUT = 1162;   // линия среза картриджей
  function cartridge(c, x, y, w, h, col, o = {}) {   // картридж: чёрный мундштук сверху, жидкость, светлое дно; y0, y1 — какой кусок рисовать
    const y0 = o.y0 ?? y - h / 2, y1 = o.y1 ?? y + h / 2;
    c.save(); c.beginPath(); c.rect(x - w, y0, w * 2, y1 - y0); c.clip();
    rr(c, x - w / 2, y - h / 2 + h * .24, w, h * .76, w * .2); fill(c, 'rgba(226,232,240,.92)');
    rr(c, x - w / 2 + 8, y - h / 2 + h * .3, w - 16, h * .62, w * .14); fill(c, col);
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x - w / 2 + 14, y - h / 2 + h * .32, 10, h * .55);
    poly(c, [x - w * .36, y - h / 2 + h * .26, x - w * .3, y - h / 2, x + w * .3, y - h / 2, x + w * .36, y - h / 2 + h * .26]); fill(c, '#111827');
    c.restore();
    if (o.cut === 'top' || o.cut === 'bot') { c.save(); c.beginPath(); const cy = o.cut === 'bot' ? y0 : y1; for (let i = 0; i <= 8; i++) c[i ? 'lineTo' : 'moveTo'](x - w / 2 + 4 + i * (w - 8) / 8, cy + (i % 2 ? 6 : -4)); c.strokeStyle = o.jc || col; c.lineWidth = 6; c.stroke(); c.restore() }
  }
  function smallCart(c, x, y, lab, a = 1) {   // серый «разрешённый» картридж с зелёной галочкой
    if (a <= 0) return; c.save(); c.globalAlpha *= a;
    rr(c, x - 60, y + 80, 120, 78, 10); fill(c, '#3f2a1c'); tx(c, lab, x, y + 118, { f: 'O', w: 700, s: 22, c: '#e2e8f0', ls: 2 });
    cartridge(c, x, y, 80, 160, '#64748b');
    circ(c, x, y - 118, 28, '#16a34a'); c.strokeStyle = '#fff'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 12, y - 118); c.lineTo(x - 2, y - 107); c.lineTo(x + 14, y - 130); c.stroke();
    c.restore();
  }
  const bladeY = t => {   // верх лезвия: висит 460, падает за 5 кадров до низа 1290, потом поднимается
    const f = at(t, K.chop, K.chop + 5 / 30), up = eio(at(t, K.chop + .9, K.chop + 1.5));
    return lp(lp(460, 1010, f * f), 460, up);
  };
  function blade(c, y0) {   // лезвие 620 шириной: низ скошен (слева выше), белая заточка, надпись
    const L = 230, R = 850, hl = 160, hr = 280;
    c.save(); poly(c, [L, y0, R, y0, R, y0 + hr, L, y0 + hl]); const g = c.createLinearGradient(L, 0, R, 0); g.addColorStop(0, '#94a3b8'); g.addColorStop(.5, '#e2e8f0'); g.addColorStop(1, '#64748b'); c.fillStyle = g; c.fill();
    poly(c, [L, y0 + hl - 34, R, y0 + hr - 34, R, y0 + hr, L, y0 + hl]); fill(c, '#f8fafc');
    c.strokeStyle = 'rgba(15,23,42,.5)'; c.lineWidth = 3; poly(c, [L, y0, R, y0, R, y0 + hr, L, y0 + hl]); c.stroke();
    c.fillStyle = '#475569'; c.fillRect(L, y0, R - L, 26);
    c.save(); c.translate(540, y0 + 92); c.rotate(.19 * .5); tx(c, 'ЗАПРЕТ ВКУСОВ', 0, 0, { f: 'O', w: 700, s: 44, c: '#b91c1c', ls: 3 }); c.restore();
    c.restore();
  }
  function guillotine(c, t, o = {}) {   // рама, бланк с заголовком, лезвие, колодка с картриджами
    const ka = o.a ?? 1; if (ka <= 0) return; c.save(); c.globalAlpha *= ka;
    // стойки и перекладина
    [200, 880].forEach(px => { vgrad(c, px - 26, 300, 52, 1060, ['#5b3a24', '#3d2616']); c.fillStyle = '#94a3b8'; c.fillRect(px + (px < 540 ? 22 : -30), 340, 8, 960) });
    rr(c, 150, 270, 780, 70, 12); fill(c, '#4a2f1d');
    // бланк: светлое поле с заголовком
    rr(c, 232, 345, 616, 100, 8); fill(c, '#f1ead8'); tx(c, 'FDA · 2 ЯНВАРЯ 2020', 540, 397, { f: 'O', w: 700, s: 46, c: '#1e293b', ls: 2 });
    circ(c, 540, 280, 58, '#d4a017'); circ(c, 540, 280, 46, '#f5d061'); tx(c, 'FDA', 540, 282, { f: 'U', w: 800, s: 26, c: '#7c5a07' });
    const by = bladeY(t), cutDone = t > K.chop + 4 / 30;
    // верёвка к лезвию
    c.strokeStyle = '#a8a29e'; c.lineWidth = 6; c.beginPath(); c.moveTo(540, 445); c.lineTo(540, Math.max(445, by)); c.stroke();
    // картриджи: целые до удара, после — донышки в колодке
    CART.forEach((p, i) => {
      if (!cutDone) cartridge(c, p.x, 1165, 110, 210, p.col);
      else { cartridge(c, p.x, 1165, 110, 210, p.col, { y0: CUT, cut: 'bot' }); A(c, 1 - at(t, K.chop + .3, K.chop + 1.6), () => { for (let j = 0; j < 3; j++) circ(c, p.x - 30 + j * 30, CUT + 10 + ((t - K.chop) * 140 + j * 40) % 90, 6, p.col) }) }
    });
    // колодка с полукруглыми вырезами и подписями
    c.fillStyle = '#5b3a24'; c.beginPath(); c.moveTo(225, 1270); c.lineTo(225, 1192); CART.forEach(p => { c.lineTo(p.x - 64, 1192); c.arc(p.x, 1192, 64, Math.PI, 0, true) }); c.lineTo(855, 1192); c.lineTo(855, 1270); c.closePath(); c.fill();
    c.fillStyle = '#3d2616'; c.fillRect(225, 1270, 630, 72);
    CART.forEach((p, i) => { const hl = pulse2(t, [K.mango, K.fru, K.des, K.mint][i]); tx(c, p.n, p.x, 1307, { f: 'O', w: 700, s: 26 + 6 * hl, c: mixc('#f8fafc', p.col, hl), ls: 2 }) });
    blade(c, by);
    c.restore();
  }
  const pulse2 = (t, a) => at(t, a - .1, a + .05) * (1 - at(t, a + .5, a + .8));
  function cutFX(c, t) {   // разлёт верхних половинок и сок (после удара)
    const k = t - K.chop - 4 / 30; if (k < 0 || k > 2.2) return;
    CART.forEach((p, i) => {   // верхняя половинка с мундштуком — вращается и падает в сторону
      const dir = p.x < 540 ? -1 : 1, vx = dir * (260 + i % 2 * 140), vy = -520 - (i === 1 || i === 2 ? 160 : 0);
      const x = p.x + vx * k, y = 1110 + vy * k + 1300 * k * k, r = dir * k * (5 + i);
      if (y > 1440) return;
      c.save(); c.translate(x, y); c.rotate(r); cartridge(c, 0, 55, 110, 210, p.col, { y0: -50, y1: CUT - 1165 + 55, cut: 'top' }); c.restore();
    });
    for (let i = 0; i < 25; i++) {   // капли и струи сока — вверх веером
      const p = CART[i % 4], ang = -Math.PI / 2 + (H1(i * 3.1) - .5) * 2.2, v = 700 + H1(i * 7) * 600, x = p.x + Math.cos(ang) * v * k, y = CUT + Math.sin(ang) * v * k + 1500 * k * k;
      if (y > 1440 || k > 1.4) continue; const r = 9 + H1(i) * 12, vyNow = Math.sin(ang) * v + 3000 * k, ln = Math.min(60, Math.hypot(Math.cos(ang) * v, vyNow) * .04);
      c.save(); c.translate(x, y); c.rotate(Math.atan2(vyNow, Math.cos(ang) * v) - Math.PI / 2); c.globalAlpha *= 1 - at(k, .9, 1.4);
      c.beginPath(); c.ellipse(0, -ln / 2, r, r + ln / 2, 0, 0, TAU); fill(c, p.col); circ(c, -r * .3, -ln / 2 - r * .3, r * .3, 'rgba(255,255,255,.55)'); c.restore();
    }
  }
  function hallShot(c, t) {
    const sh = t > K.chop && t < K.chop + .3 ? (1 - at(t, K.chop, K.chop + .3)) * 14 : 0;
    c.save(); if (sh) c.translate(Math.sin(t * 97) * sh, Math.cos(t * 71) * sh);
    hallBg(c, t); smallCart(c, 115, 1200, 'ТАБАК'); smallCart(c, 965, 1200, 'МЕНТОЛ'); guillotine(c, t); cutFX(c, t); vignette(c, .5);
    c.restore();
  }
  function shot2(c, t) {   // фура-шторка: слева от кабины — магазин, справа от борта — зал FDA
    const x = truckX(t);
    if (t < K.truck1) {
      const div = x + TRK.w * .5;
      c.save(); c.beginPath(); c.rect(-200, -200, div + 200, HH + 400); c.clip(); shot1(c, t); c.restore();
      c.save(); c.beginPath(); c.rect(div, -200, WW + 400, HH + 400); c.clip(); hallShot(c, t); c.restore();
      truck(c, x, t);
    } else hallShot(c, t);
  }
  // ================= СЦЕНА 3: валики раскатывают закон → дыра → крест → конвейер Шэньчжэня =================
  function oakTable(c, t) {
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#3b2414', '#4a2d18', '#2e1b0e']);
    c.save(); c.strokeStyle = 'rgba(20,10,4,.28)'; c.lineWidth = 3;
    for (let i = 0; i < 26; i++) { const y0 = -60 + i * 80; c.beginPath(); for (let x = -40; x <= WW + 40; x += 40) c.lineTo(x, y0 + Math.sin(x * .006 + i * 1.7) * 18 + Math.sin(x * .021 + i) * 5); c.stroke() }
    c.strokeStyle = 'rgba(255,220,180,.06)'; for (let i = 0; i < 26; i++) { const y0 = -30 + i * 80; c.beginPath(); for (let x = -40; x <= WW + 40; x += 40) c.lineTo(x, y0 + Math.sin(x * .007 + i * 2.3) * 14); c.stroke() }
    c.restore();
    // линейка сбоку
    c.save(); c.translate(985, 260); c.rotate(.04); rr(c, -34, 0, 68, 1180, 6); fill(c, '#d6c29a'); for (let i = 0; i < 59; i++) { c.fillStyle = '#5b4630'; c.fillRect(-34, i * 20, i % 5 ? 14 : 26, 2) } c.restore();
    c.save(); c.translate(70, 1390); c.rotate(-.5); rr(c, -10, -150, 20, 300, 6); fill(c, '#f59e0b'); poly(c, [-10, 150, 10, 150, 0, 186]); fill(c, '#fde68a'); c.restore();   // карандаш
    glow(c, 540, 820, 900, '#fde68a', .12);
    vignette(c, .55, '12,6,2');
  }
  function roller(c, x, y, w, r) {   // серый валик с жёлтыми ручками
    c.save(); c.translate(x, y); c.rotate(r);
    const g = c.createLinearGradient(0, -38, 0, 38); g.addColorStop(0, '#cbd5e1'); g.addColorStop(.35, '#94a3b8'); g.addColorStop(1, '#475569');
    rr(c, -w / 2 + 50, -37, w - 100, 75, 30); c.fillStyle = g; c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-w / 2 + 70, -26, w - 140, 8);
    [-1, 1].forEach(s => { rr(c, s > 0 ? w / 2 - 56 : -w / 2, -24, 56, 48, 16); fill(c, '#facc15'); rr(c, s > 0 ? w / 2 - 56 : -w / 2, -24, 56, 14, 8); fill(c, '#fde68a') });
    c.restore();
  }
  const SCR = { x: 540, w: 820, top: 280, bot: 1380 };
  const HOLE = { x: 540, y: 960, w: 160, h: 380 };
  function holePath(c, nb) { if (!nb) c.beginPath(); c.roundRect(HOLE.x - HOLE.w / 2, HOLE.y - HOLE.h / 2, HOLE.w, HOLE.h, 40) }
  function lawPaper(c, t) {   // бумага закона в координатах листа (видна между валиками)
    const L = SCR.x - SCR.w / 2;
    c.fillStyle = '#f5efe0'; c.beginPath(); c.rect(L, SCR.top, SCR.w, SCR.bot - SCR.top); holePath(c, 1); c.fill('evenodd');
    c.save(); c.beginPath(); c.rect(L, SCR.top, SCR.w, SCR.bot - SCR.top); holePath(c, 1); c.clip('evenodd');
    for (let i = 0; i < 40; i++) { c.fillStyle = 'rgba(120,90,40,.04)'; c.fillRect(L, SCR.top + i * 28, SCR.w, 1) }
    c.restore();
    circ(c, 540, 350, 30, '#1e3a8a'); tx(c, 'FDA', 540, 352, { f: 'U', w: 800, s: 16, c: '#fff' });
    tx(c, 'FDA GUIDANCE · JAN 2020', 540, 410, { f: 'O', w: 700, s: 40, c: '#1e293b', ls: 3 });
    c.fillStyle = '#1e293b'; c.fillRect(L + 60, 440, SCR.w - 120, 4);
    tx(c, 'ПОД ЗАПРЕТ ПОПАДАЮТ ТОЛЬКО:', 540, 500, { f: 'M', w: 800, s: 34, c: '#334155' });
    const km = eio(at(t, K.only, K.cart + .45));   // маркер по строке про картриджи
    if (km > 0) { c.save(); c.globalAlpha = .9; rr(c, L + 50, 540, (SCR.w - 100) * km, 56, 8); fill(c, '#fef08a'); c.restore() }
    tx(c, '• ВЕЙПЫ СО СМЕННЫМИ КАРТРИДЖАМИ', 540, 570, { f: 'M', w: 800, s: 36, c: '#0f172a', mw: SCR.w - 110 });
    for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(71,85,105,.28)'; c.fillRect(L + 70, 630 + i * 30, SCR.w - 140 - (i % 2) * 120, 12) }
    for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(71,85,105,.28)'; c.fillRect(L + 70, 1260 + i * 30, SCR.w - 140 - (i % 2) * 160, 12) }
    // дыра: красный пунктир по контуру, подпись
    const kd = at(t, K.whole - .1, K.whole + .6);
    if (kd > 0) { c.save(); c.setLineDash([16, 12]); c.lineDashOffset = -t * 20; c.globalAlpha = kd; holePath(c); stroke(c, '#dc2626', 7); c.restore() }
    const kl = spr(at(t, K.notm - .2, K.notm + .3));
    if (kl > 0) { c.save(); c.translate(540, 1196); c.scale(kl, kl); tx(c, '[ ЦЕЛЬНЫЕ ОДНОРАЗОВЫЕ — ПУСТО ]', 0, 0, { f: 'M', w: 800, s: 32, c: '#dc2626', mw: SCR.w - 80 }); c.restore() }
  }
  function factoryBg(c, t) {   // цех в Шэньчжэне: фермы, вентиляция, окна, прожекторы, пол
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#0b1220', '#111c30', '#0b1220']);
    // окна задней стены
    for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const x = 40 + i * 175, y = 470 + r * 120; rr(c, x, y, 150, 96, 6); fill(c, rgba('#38bdf8', .10 + .05 * H1(i + r * 7))); c.fillStyle = 'rgba(11,18,32,.8)'; c.fillRect(x + 73, y, 4, 96); c.fillRect(x, y + 46, 150, 4) }
    // фермы под потолком
    c.save(); c.strokeStyle = '#334155'; c.lineWidth = 8; c.beginPath(); c.moveTo(-40, 120); c.lineTo(WW + 40, 120); c.moveTo(-40, 260); c.lineTo(WW + 40, 260); c.stroke();
    c.lineWidth = 5; c.beginPath(); for (let i = -1; i < 12; i++) { c.moveTo(i * 100, 260); c.lineTo(i * 100 + 50, 120); c.lineTo(i * 100 + 100, 260) } c.stroke(); c.restore();
    // вентиляционная труба
    vgrad(c, -40, 300, WW + 80, 70, ['#475569', '#64748b', '#334155']); for (let i = 0; i < 9; i++) { c.fillStyle = '#1e293b'; c.fillRect(i * 130, 300, 8, 70) }
    // прожекторы
    [200, 540, 880].forEach((x, i) => { rr(c, x - 40, 372, 80, 30, 8); fill(c, '#1e293b'); beam(c, x, 400, x + (540 - x) * .2, 1260, 26, i === 1 ? 240 : 190, '#e0f2fe', i === 1 ? .22 : .12) });
    // пол цеха
    vgrad(c, -100, 1340, WW + 200, 700, ['#1f2937', '#111827', '#0b0f19']);
    c.save(); c.translate(540, 1345); c.scale(1, .12); glow(c, 0, 0, 480, '#e0f2fe', .3); c.restore();
    vignette(c, .5);
  }
  function cross3d(c, x, y, s, r) {   // объёмный сине-красный крест
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const bar = (rot, col, dk) => { c.save(); c.rotate(rot); c.save(); c.translate(14, 14); rr(c, -120, -32, 240, 64, 18); fill(c, dk); c.restore(); rr(c, -120, -32, 240, 64, 18); fill(c, col); rr(c, -112, -26, 224, 14, 8); fill(c, 'rgba(255,255,255,.3)'); c.restore() };
    bar(Math.PI / 4, '#2563eb', '#1e3a8a'); bar(-Math.PI / 4, '#dc2626', '#7f1d1d'); c.restore();
  }
  function sparks(c, t, t0, x, y, n = 14, col = '#fde047') {
    const k = t - t0; if (k < 0 || k > .8) return;
    for (let i = 0; i < n; i++) { const a = H1(i * 4.7) * TAU, v = 300 + H1(i * 9) * 600, px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k + 600 * k * k;
      c.save(); c.globalAlpha = 1 - k / .8; c.strokeStyle = col; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(px, py); c.lineTo(px - Math.cos(a) * 24, py - Math.sin(a) * 24); c.stroke(); c.restore() }
  }
  function conveyor(c, t, a = 1, sway = 0) {   // лента Y 1220–1340, ролики через 140 px
    if (a <= 0) return; c.save(); c.globalAlpha *= a;
    vgrad(c, -40, 1220, WW + 80, 120, ['#334155', '#1e293b', '#0f172a']);
    c.fillStyle = '#475569'; c.fillRect(-40, 1220, WW + 80, 10);
    for (let i = -1; i < 9; i++) { const x = i * 140 + ((t * 180) % 140), y = 1290; circ(c, x, y, 28, '#94a3b8'); circ(c, x, y, 20, '#cbd5e1'); c.save(); c.translate(x, y); c.rotate(t * 6.4); c.fillStyle = '#475569'; c.fillRect(-18, -3, 36, 6); c.restore() }
    c.fillStyle = '#0b1220'; for (let i = 0; i < 3; i++) c.fillRect(120 + i * 380, 1340, 26, 140);
    c.restore();
  }
  function convBoxes(c, t, a = 1) {   // 5 коробок на ленте, едут вправо 180 px/с
    if (a <= 0) return; const t0 = K.shen;
    for (let i = -3; i < 3; i++) {
      const x0 = 540 + i * 210 + (t - t0) * 180 * eo(at(t, t0 + .2, t0 + .9)) + Math.max(0, t - t0 - .9) * 0;
      const x = x0; if (x < -100 || x > WW + 100) continue;
      if (i === 0) continue;   // первую рисует морф шлейфа
      const kin = eo(at(t, t0 + .1 + Math.abs(i) * .12, t0 + .55 + Math.abs(i) * .12)); if (kin <= 0) continue;
      vapeBox(c, x - (1 - kin) * (i < 0 ? 700 : -700), 1040, 150, 360, BOXC[(i + 9) % 8], { label: ['PEACH', 'COLA', 'MINT', 'GRAPE', 'MANGO', 'BERRY'][(i + 6) % 6] });
    }
  }
  function factoryShot(c, t) {
    factoryBg(c, t);
    // табличка «JUUL КАРТРИДЖИ» на цепях; крест сбивает её
    const hit = K.juul2 + .32, kf = at(t, hit, hit + 1.1);
    const sx = 540 - 260 * kf * kf, sy = 470 + 620 * kf * kf, sr = -1.2 * kf;
    if (kf < 1) A(c, 1 - at(kf, .7, 1), () => {
      c.strokeStyle = '#94a3b8'; c.lineWidth = 5; if (kf <= 0) { c.beginPath(); c.moveTo(390, 262); c.lineTo(390, 425); c.moveTo(690, 262); c.lineTo(690, 425); c.stroke() }
      c.save(); c.translate(sx, sy); c.rotate(sr); rr(c, -210, -45, 420, 90, 12); fill(c, '#0f172a'); rr(c, -210, -45, 420, 90, 12); stroke(c, '#f8fafc', 4); tx(c, 'JUUL КАРТРИДЖИ', 0, 2, { f: 'O', w: 700, s: 40, c: '#f8fafc', ls: 2 }); c.restore();
    });
    // крест падает со шлейфом
    const cy = t < hit ? lp(-200, 470, ei(at(t, hit - .32, hit))) : lp(470, 1040, eo(at(t, hit, K.shen)));
    const kt = at(t, hit - .3, hit), kmorph = eio(at(t, K.shen, K.shen + .6));
    if (t > hit - .32 && kmorph < 1) {
      const top = 350, bot = cy;
      if (bot > top) A(c, 1 - kmorph, () => { const g = c.createLinearGradient(0, top, 0, bot); g.addColorStop(0, 'rgba(244,114,182,0)'); g.addColorStop(.4, 'rgba(244,114,182,.75)'); g.addColorStop(1, 'rgba(56,189,248,.9)'); rr(c, 465, top, 150, bot - top, 40); c.fillStyle = g; c.fill() });
      if (kmorph <= 0) cross3d(c, 540, cy, 1, t * 3);
    }
    sparks(c, t, hit, 540, 470, 18);
    // шлейф застывает и превращается в первую одноразку на ленте
    if (kmorph > 0) {
      const top = lp(350, 860, kmorph), x = 540 + Math.max(0, t - K.shen - .2) * 180 * eo(at(t, K.shen + .2, K.shen + .9));
      if (kmorph < 1) { rr(c, x - 75, top, 150, 1220 - top, lp(40, 10, kmorph)); fill(c, mixc('#38bdf8', BOXC[0], kmorph)) }
      A(c, kmorph, () => vapeBox(c, x, 1040, 150, 360, BOXC[0], { label: 'ICE' }));
    }
    conveyor(c, t, eo(at(t, K.shen - .2, K.shen + .4)));
    convBoxes(c, t, 1);
    const kp = spr(at(t, K.shen + .5, K.shen + 1.1));
    if (kp > 0) { c.strokeStyle = '#94a3b8'; c.lineWidth = 4; c.beginPath(); c.moveTo(380, 262); c.lineTo(380, 560 - 40 * kp); c.moveTo(700, 262); c.lineTo(700, 560 - 40 * kp); c.stroke(); plate(c, 'ШЭНЬЧЖЭНЬ · КОНВЕЙЕР', 540, 560, kp, { s: 34, bg: '#facc15', c: '#0f172a' }) }
  }
  function shot3(c, t) {
    // 0) зал FDA → стол: перекладина и колодка гильотины становятся валиками
    const kz = eio(at(t, K.zoom0, K.zoom1));   // наезд в дыру
    if (kz >= 1) { factoryShot(c, t); return }
    const k0 = eio(at(t, K.s3 - .15, K.s3 + .45)), k1 = eio(at(t, K.s3 + .45, K.s3 + 1.6));
    if (kz > 0 || k1 > 0) factoryShot(c, t);   // цех — сквозь дыру
    c.save();
    if (kz > 0) { const s = Math.exp(lp(0, Math.log(7.5), kz)); c.translate(540, 960); c.scale(s, s); c.translate(-540, -960) }
    if (k0 < 1) A(c, 1 - k0, () => hallShot(c, t));
    if (k0 > 0) {
      A(c, k0, () => { c.save(); c.beginPath(); c.rect(-2000, -2000, 5000, 6000); holePath(c, 1); c.clip('evenodd'); oakTable(c, t); c.restore() });
      const y1 = lp(lp(305, 820, k0), SCR.top, k1), y2 = lp(lp(1306, 820, k0), SCR.bot, k1), r = lp(-.32, 0, eio(at(t, K.s3 + .1, K.s3 + .5)));
      if (k1 > 0) { c.save(); c.beginPath(); c.rect(0, y1, WW, y2 - y1); c.clip(); lawPaper(c, t); c.restore() }
      roller(c, 540, y1, lp(780, 860, k0), r * (1 - k1)); roller(c, 540, y2, lp(630, 860, k0), -r * .6 * (1 - k1));
    }
    c.restore();
  }
  // ================= СЦЕНА 4: конвейер → океанская волна → лист отчёта со столбиками =================
  function stormBg(c, t) {   // грозовое небо, горизонт, берег США
    vgrad(c, -100, -100, WW + 200, 1200, ['#0b1530', '#1e3a5f', '#2b4c73']);
    for (let i = 0; i < 6; i++) { const cx = ((H1(i * 3) * 1300 + t * 22 * (1 + i * .2)) % 1500) - 200, cy = 140 + i * 110; c.save(); c.globalAlpha = .35; [0, 90, 180, 270].forEach((dx, j) => circ(c, cx + dx, cy + (j % 2 ? -26 : 0), 80 + j * 6, i % 2 ? '#1e293b' : '#334155')); c.restore() }
    // берег: город на горизонте и статуя с факелом
    c.fillStyle = '#0f1a30'; let x = 560; for (let i = 0; i < 9; i++) { const w = 40 + H1(i * 5) * 40, h = 40 + H1(i * 9) * 130; c.fillRect(x, 960 - h, w, h + 2); x += w + 4 }
    c.fillRect(170, 870, 18, 90); poly(c, [160, 960, 200, 960, 190, 890, 170, 890]); c.fill(); circ(c, 179, 868, 12, '#0f1a30'); c.fillRect(186, 820, 6, 46); glow(c, 189, 818, 30, '#fde68a', .6);
    vgrad(c, -100, 960, WW + 200, 1000, ['#16305a', '#0b1a36']);
  }
  const WV = { x0: 0, x1: WW };
  function waveY(t, x, A, base, cx) {   // поверхность: горб-гребень + рябь
    const d = (x - cx) / 330; return base - A * Math.exp(-d * d) * (1 + .12 * Math.sin(t * 2)) - A * .16 * Math.sin(x * .012 + t * 3) - 14 * Math.sin(x * .03 - t * 4);
  }
  function wave(c, t, A, base, cx, o = {}) {   // красно-синяя волна: гребень красный, толща синяя, пунктир течений
    const pts = []; for (let x = -60; x <= WW + 60; x += 20) pts.push([x, waveY(t, x, A, base, cx)]);
    c.save(); c.beginPath(); c.moveTo(-60, HH + 100); pts.forEach(p => c.lineTo(p[0], p[1])); c.lineTo(WW + 60, HH + 100); c.closePath();
    const g = c.createLinearGradient(0, base - A, 0, HH); g.addColorStop(0, '#1d4ed8'); g.addColorStop(1, '#1e3a8a'); c.fillStyle = g; c.fill(); c.clip();
    c.setLineDash([18, 14]); c.lineDashOffset = -t * 60; c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 5;
    [110, 230, 360, 500].forEach(off => { c.beginPath(); pts.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0], p[1] + off)); c.stroke() });
    c.restore();
    c.save(); c.beginPath(); pts.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0], p[1])); c.strokeStyle = '#ef4444'; c.lineWidth = o.cw || 48; c.lineJoin = 'round'; c.stroke();
    c.beginPath(); pts.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0], p[1] - (o.cw || 48) * .3)); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 6; c.stroke(); c.restore();
  }
  function ship(c, x, y, r, t) {   // контейнеровоз 340×160 с контейнерами PUFF / HQD / ELF
    c.save(); c.translate(x, y); c.rotate(r);
    poly(c, [-170, -40, 170, -40, 140, 30, -150, 30]); fill(c, '#1f2937'); c.fillStyle = '#b91c1c'; c.fillRect(-160, 8, 315, 20);
    rr(c, 92, -110, 52, 72, 6); fill(c, '#f8fafc'); c.fillStyle = '#0ea5e9'; c.fillRect(98, -98, 40, 12); c.fillStyle = '#334155'; c.fillRect(110, -136, 12, 28);
    [['PUFF', '#ec4899', K.puff], ['HQD', '#2563eb', K.hqd], ['ELF', '#a855f7', K.elf]].forEach(([s, col, tt0], i) => {
      const k = spr(at(t, tt0 - .05, tt0 + .35)); if (k <= 0) return;
      c.save(); c.translate(-118 + i * 98, -40 - 33); c.translate(0, -(1 - k) * 120); rr(c, -47, -32, 95, 65, 5); fill(c, col);
      for (let j = 0; j < 6; j++) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-40 + j * 15, -28, 4, 56) } tx(c, s, 0, 2, { f: 'U', w: 800, s: 22, c: '#fff' }); c.restore();
    });
    c.restore();
  }
  function deskBg(c, t) {   // тёмный деревянный стол с канцелярией
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#2b1a0f', '#3a2414', '#24150b']);
    c.save(); c.strokeStyle = 'rgba(0,0,0,.22)'; c.lineWidth = 3; for (let i = 0; i < 24; i++) { const y0 = i * 84; c.beginPath(); for (let x = -40; x <= WW + 40; x += 40) c.lineTo(x, y0 + Math.sin(x * .005 + i * 2.1) * 20); c.stroke() } c.restore();
    c.save(); c.translate(980, 300); c.rotate(.6); rr(c, -12, -190, 24, 380, 6); fill(c, '#1d4ed8'); poly(c, [-12, 190, 12, 190, 0, 226]); fill(c, '#e2e8f0'); c.restore();   // ручка
    for (let i = 0; i < 3; i++) { c.save(); c.translate(90 + i * 34, 1420 - i * 20); c.rotate(.3 + i * .4); rr(c, -24, -8, 48, 16, 8); stroke(c, '#cbd5e1', 4); c.restore() }   // скрепки
    c.save(); c.translate(80, 360); c.rotate(-.12); rr(c, -60, -60, 120, 120, 6); fill(c, '#fde047'); c.restore();   // стикер
    glow(c, 540, 820, 900, '#fde68a', .10); vignette(c, .55, '10,5,2');
  }
  const RP = { x: 540, y: 830, w: 840, h: 1020, r: -.0524 };   // лист отчёта: -3°
  function report(c, t, ku) {   // ku — лист разворачивается вниз из шапки
    c.save(); c.translate(RP.x, RP.y); c.rotate(RP.r);
    const top = -RP.h / 2, hh = RP.h * ku;
    c.save(); c.translate(10, 14); rr(c, -RP.w / 2, top, RP.w, hh, 8); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, -RP.w / 2, top, RP.w, hh, 8); fill(c, '#f8fafc');
    c.save(); rr(c, -RP.w / 2, top, RP.w, hh, 8); c.clip();
    tx(c, 'ДОЛЯ ОДНОРАЗОК У ПАРЯЩИХ СТАРШЕКЛАССНИКОВ', 0, top + RP.h - 92, { f: 'M', w: 800, s: 26, c: '#475569', mw: RP.w - 80 });
    const BY = 1180 - RP.y, x19 = 360 - RP.x, x20 = 720 - RP.x;
    c.fillStyle = '#cbd5e1'; for (let i = 1; i < 5; i++) c.fillRect(-RP.w / 2 + 60, BY - i * 160, RP.w - 120, 2);
    c.fillStyle = '#0f172a'; c.fillRect(-RP.w / 2 + 50, BY, RP.w - 100, 6);
    const k19 = bo(at(t, K.par - .1, K.par + .45)), k20 = bo(at(t, K.vyr - .15, K.vyr + .55));
    const bar = (x, hgt, col, k, yr, lab, labA) => {
      const h = hgt * k, R = 48; if (h > 1) { rr(c, x - 80, BY - h, 160, h, 10); fill(c, col) }
      circ(c, x, BY - h, R, col); circ(c, x, BY - h, R - 8, '#fff'); tx(c, yr, x, BY - h + 2, { f: 'O', w: 700, s: 30, c: col === '#ef4444' ? '#b91c1c' : '#334155' });
      if (labA > 0) tx(c, lab, x, BY - h - 80, { f: 'U', w: 800, s: 40, c: col === '#ef4444' ? '#dc2626' : '#475569', a: labA });
      return BY - h;
    };
    if (ku > .9) {
      bar(x19, 75, '#64748b', Math.max(.02, k19), '2019', '2,4%', at(t, K.par + .2, K.par + .5));
      const ty = bar(x20, 720, '#ef4444', Math.max(.02, k20), '2020', '', 0);
      const kl = spr(at(t, K.x11 - .1, K.x11 + .4));
      if (kl > 0) { c.save(); c.translate(x20 - 250, ty + 40); c.scale(kl, kl); rr(c, -150, -70, 300, 140, 16); fill(c, '#ef4444'); tx(c, '26,5%', 0, -20, { f: 'U', w: 800, s: 50, c: '#fff' }); tx(c, 'РОСТ ×11', 0, 34, { f: 'O', w: 700, s: 34, c: '#fee2e2', ls: 2 }); c.restore() }
    }
    tx(c, 'NYTS · CDC / FDA', 0, top + RP.h - 50, { f: 'O', w: 500, s: 24, c: '#94a3b8', ls: 2, a: ku > .95 ? 1 : 0 });
    c.restore();
    // шапка — бывшая волна: красно-синяя полоса 840×90
    rr(c, -RP.w / 2, top - 90, RP.w, 90, 10); fill(c, '#1d4ed8'); c.fillStyle = '#ef4444'; c.fillRect(-RP.w / 2, top - 90, RP.w, 34);
    tx(c, 'ОПРОС ШКОЛЬНИКОВ США · CDC', 0, top - 32, { f: 'O', w: 700, s: 30, c: '#fff', ls: 2 });
    c.restore();
  }
  function shot4(c, t) {
    const kf = eio(at(t, K.vsego - .05, K.vsego + .6));   // волна выпрямляется в шапку листа
    const ks = ss(K.s4 - .1, K.s4 + .5, t);
    if (kf < 1) {
      if (ks < 1) factoryShot(c, t);
      A(c, ks, () => stormBg(c, t));
      const amp = 380 * eo(at(t, K.s4, K.s4 + 1.2)) * (1 - kf), base = lp(lp(1220, 1060, eo(at(t, K.s4, K.s4 + 1.2))), 280, kf), cx = lp(300, 640, at(t, K.s4, K.vsego));
      if (ks < 1) A(c, 1 - ks, () => conveyor(c, t, 1));
      A(c, 1 - kf * kf, () => wave(c, t, amp, base, cx));
      const sx = lp(130, 950, at(t, K.s4 + .3, K.vsego)), sy = waveY(t, sx, amp, base, cx) - 46, d = waveY(t, sx + 10, amp, base, cx) - waveY(t, sx - 10, amp, base, cx);
      if (kf < .5) A(c, ks * (1 - kf * 2), () => ship(c, sx, sy, Math.atan2(d, 20), t));
    }
    if (kf > 0) {
      A(c, kf, () => deskBg(c, t));
      report(c, t, eo(at(t, K.vsego + .45, K.vsego + 1.05)));
    }
  }
  // ================= СЦЕНА 5: капля → бак с двухслойной волной → пакеты и анализатор WS-23 → медальон «мята → лёд» =================
  function labBg(c, t, py = 0) {   // кафельная лаборатория: плитка, полки с реактивами в расфокусе, лампы сверху
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#0c1830', '#12203d', '#0a1426']);
    c.save(); c.translate(0, (py * .35) % 90); c.strokeStyle = 'rgba(56,189,248,.10)'; c.lineWidth = 3;
    for (let y = -180; y < HH + 180; y += 90) { c.beginPath(); c.moveTo(0, y); c.lineTo(WW, y); c.stroke() }
    for (let x = 0; x < WW; x += 90) { c.beginPath(); c.moveTo(x, -180); c.lineTo(x, HH + 180); c.stroke() } c.restore();
    const sh = blurLayer('labshelf', 300, 1300, 7, g => {
      for (let r = 0; r < 5; r++) { g.fillStyle = '#334155'; g.fillRect(0, 230 + r * 250, 300, 12);
        for (let i = 0; i < 6; i++) { const col = ['#38bdf8', '#f59e0b', '#a78bfa', '#34d399', '#f472b6'][(i + r) % 5], h = 70 + H1(i + r * 9) * 80; g.fillStyle = col; g.globalAlpha = .55; g.fillRect(12 + i * 46, 230 + r * 250 - h, 32, h); g.globalAlpha = .9; g.fillStyle = '#e2e8f0'; g.fillRect(16 + i * 46, 230 + r * 250 - h - 14, 24, 14); g.globalAlpha = 1 } }
    });
    c.save(); c.globalAlpha = .5; c.drawImage(sh, -60, 120 + (py * .5) % 250 - 250); c.drawImage(sh, -60, 120 + (py * .5) % 250 + 1050); c.drawImage(sh, WW - 240, 80 + (py * .5) % 250 - 250); c.drawImage(sh, WW - 240, 80 + (py * .5) % 250 + 1050); c.restore();
    [300, 780].forEach(x => { rr(c, x - 90, -10, 180, 34, 10); fill(c, '#e2e8f0'); beam(c, x, 24, x, 1500, 80, 260, '#e0f2fe', .10) });
    vignette(c, .5);
  }
  const TK = { x: 540, y: 860, w: 420, h: 680 };
  function tank(c, t, o = {}) {   // бак одноразки в разрезе: сверху манго, снизу лёд, волны в противофазе
    const { x, y, w, h } = TK, k = o.k ?? 1, L = x - w / 2, T = y - h / 2;
    c.save(); if (o.a !== undefined) c.globalAlpha *= o.a;
    rr(c, L, T, w, h, 60); fill(c, 'rgba(186,230,253,.08)');
    if (k > 0) {
      c.save(); rr(c, L + 10, T + 10, w - 20, h - 20, 52); c.clip();
      const lv = T + h * lp(.95, .22, k), mid = T + h * .56, wv = (ph, amp) => x0 => Math.sin(x0 * .018 + t * 3.2 + ph) * amp;
      const top = wv(0, 16 * k), md = wv(Math.PI, 14 * k);
      c.beginPath(); c.moveTo(L, HH); for (let xx = L; xx <= L + w; xx += 10) c.lineTo(xx, Math.max(lv, mid) + md(xx) * (lv < mid ? 1 : 0)); c.lineTo(L + w, HH); c.closePath();
      const gb = c.createLinearGradient(0, mid, 0, T + h); gb.addColorStop(0, '#22d3ee'); gb.addColorStop(1, '#0891b2'); c.fillStyle = gb; c.fill();
      if (lv < mid) { c.beginPath(); for (let xx = L; xx <= L + w; xx += 10) c.lineTo(xx, lv + top(xx)); for (let xx = L + w; xx >= L; xx -= 10) c.lineTo(xx, mid + md(xx)); c.closePath(); const go = c.createLinearGradient(0, lv, 0, mid); go.addColorStop(0, '#fbbf24'); go.addColorStop(1, '#f59e0b'); c.fillStyle = go; c.fill() }
      for (let i = 0; i < 5; i++) { const ix = L + 70 + i * 66, iy = T + h * .75 + Math.sin(t * 2 + i) * 14 + (i % 2) * 40; c.save(); c.translate(ix, iy); c.rotate(.3 + i); rr(c, -22, -22, 44, 44, 8); fill(c, 'rgba(240,249,255,.75)'); rr(c, -22, -22, 44, 44, 8); stroke(c, '#fff', 2); c.restore() }
      for (let i = 0; i < 10; i++) circ(c, L + 40 + H1(i) * (w - 80), T + h - ((t * 120 + i * 70) % (h * .5)), 5 + H1(i * 3) * 5, 'rgba(255,255,255,.45)');
      c.restore();
    }
    rr(c, L, T, w, h, 60); stroke(c, 'rgba(224,242,254,.85)', 8); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(L + 30, T + 60, 18, h - 120);
    rr(c, x - 60, T - 70, 120, 74, 14); fill(c, '#111827');
    c.restore();
  }
  function mintLeaf(c, x, y, s, r) { c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(50, -46, 110, 0); c.quadraticCurveTo(50, 46, 0, 0); fill(c, '#10b981'); c.strokeStyle = '#d1fae5'; c.lineWidth = 3; c.beginPath(); c.moveTo(4, 0); c.lineTo(104, 0); c.stroke(); for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(i * 22, 0); c.lineTo(i * 22 + 14, -16); c.moveTo(i * 22, 0); c.lineTo(i * 22 + 14, 16); c.stroke() } c.restore() }
  const BAGS = [['МАНГО', '#f59e0b'], ['АРБУЗ', '#f43f5e'], ['ХЛАДАГЕНТ WS-23', '#22d3ee'], ['КОЛА', '#7c2d12'], ['СОЛЬ 50 МГ', '#e2e8f0']];
  function ivBag(c, x, y, lab, col, sw, glowA) {   // медицинский пакет 155×230 на крючке
    c.save(); c.translate(x, y); c.rotate(sw);
    c.strokeStyle = '#94a3b8'; c.lineWidth = 5; c.beginPath(); c.arc(0, -16, 14, Math.PI, 0); c.lineTo(14, 0); c.stroke();
    if (glowA > 0) glow(c, 0, 120, 200, '#22d3ee', .5 * glowA);
    rr(c, -77, 0, 155, 230, 26); fill(c, 'rgba(241,245,249,.30)'); c.save(); rr(c, -77, 0, 155, 230, 26); c.clip(); c.fillStyle = rgba(col, .75); c.fillRect(-77, 70 + Math.sin(sw * 9) * 6, 155, 160); c.restore();
    rr(c, -77, 0, 155, 230, 26); stroke(c, 'rgba(241,245,249,.8)', 4);
    rr(c, -16, 228, 32, 30, 6); fill(c, '#cbd5e1');
    rr(c, -66, 22, 132, 40, 8); fill(c, '#fff'); tx(c, lab, 0, 43, { f: 'O', w: 700, s: 20, c: '#0f172a', mw: 122 });
    c.restore();
  }
  const MOLA = [[0, 0], [-70, -40], [-70, 40], [70, -40], [140, 0], [70, 40], [-140, -80], [-140, 80], [140, -80], [210, 40], [0, -90]];
  const MOLB = [[0, 1], [0, 2], [0, 3], [3, 4], [3, 5], [1, 6], [2, 7], [4, 8], [4, 9], [0, 10]];
  function molecule(c, t, x, y, s, k, conv = 0) {   // WS-23: шарики-атомы и связи (сборка k, сжатие в медальон conv)
    c.save(); c.translate(x, y); c.scale(s, s);
    const P = MOLA.map(([px, py], i) => [lp(px, Math.cos(i / MOLA.length * TAU) * 150, conv), lp(py, Math.sin(i / MOLA.length * TAU) * 150, conv)]);
    c.strokeStyle = '#e0f2fe'; c.lineWidth = 8; MOLB.forEach(([a, b], i) => { const kk = at(k, .3 + i * .05, .5 + i * .05); if (kk <= 0) return; c.beginPath(); c.moveTo(P[a][0], P[a][1]); c.lineTo(lp(P[a][0], P[b][0], kk), lp(P[a][1], P[b][1], kk)); c.globalAlpha = 1 - conv; c.stroke() });
    P.forEach(([px, py], i) => { const kk = spr(at(k, i * .045, i * .045 + .35)); if (kk <= 0) return; c.globalAlpha = 1 - conv * .5; circ(c, px, py, (i === 3 ? 30 : i === 10 ? 24 : 22) * kk, i === 3 ? '#38bdf8' : i === 10 ? '#f43f5e' : '#f8fafc'); circ(c, px - 6, py - 6, 6 * kk, 'rgba(255,255,255,.8)') });
    c.restore();
  }
  function analyzer(c, t, x, y, inner) {   // прибор 680×420, экран внутри
    c.save(); c.translate(x, y);
    rr(c, -340, -210, 680, 420, 30); fill(c, '#cbd5e1'); rr(c, -340, -210, 680, 60, 30); fill(c, '#e2e8f0');
    rr(c, -300, -150, 600, 300, 18); fill(c, '#062a33');
    c.save(); rr(c, -300, -150, 600, 300, 18); c.clip(); c.strokeStyle = 'rgba(45,212,191,.15)'; c.lineWidth = 2; for (let i = -300; i < 300; i += 30) { c.beginPath(); c.moveTo(i, -150); c.lineTo(i, 150); c.stroke() } for (let i = -150; i < 150; i += 30) { c.beginPath(); c.moveTo(-300, i); c.lineTo(300, i); c.stroke() } if (inner) inner(); c.restore();
    [-250, -200, 200, 250].forEach((bx, i) => circ(c, bx, 180, 12, i < 2 ? '#22c55e' : '#f59e0b'));
    tx(c, 'АНАЛИЗАТОР', 0, -182, { f: 'O', w: 700, s: 24, c: '#334155', ls: 4 });
    c.restore();
  }
  function medallion(c, t, x, y, R, kf) {   // круг: зелёная «природная мята» → (переворот 180°) синий «синтетический лёд»
    c.save(); c.translate(x, y); c.rotate(Math.PI * eio(kf));
    const col = mixc('#10b981', '#0284c7', ss(.35, .65, kf)); circ(c, 0, 0, R, col); ring(c, 0, 0, R - 14, 'rgba(255,255,255,.55)', 6);
    const leafA = 1 - ss(.35, .6, kf), ice = ss(.4, .75, kf);
    if (leafA > 0) A(c, leafA, () => { c.save(); c.rotate(-.75); const L = R * .78, Wd2 = R * .42; c.beginPath(); c.moveTo(0, L); c.bezierCurveTo(Wd2 * 1.3, L * .4, Wd2 * 1.1, -L * .7, 0, -L); c.bezierCurveTo(-Wd2 * 1.1, -L * .7, -Wd2 * 1.3, L * .4, 0, L); fill(c, '#f0fdf4');
      c.strokeStyle = '#10b981'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, L * .95); c.lineTo(0, -L * .8); c.stroke(); for (let i = 0; i < 4; i++) { const y0 = L * .5 - i * L * .38; c.beginPath(); c.moveTo(0, y0); c.lineTo(Wd2 * .7, y0 - L * .22); c.moveTo(0, y0); c.lineTo(-Wd2 * .7, y0 - L * .22); c.stroke() } c.restore() });
    if (ice > 0) { c.save(); c.globalAlpha = ice; c.strokeStyle = '#f0f9ff'; c.lineCap = 'round'; c.lineWidth = 14;
      for (let i = 0; i < 6; i++) { c.save(); c.rotate(i * TAU / 6); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -R * .78); c.moveTo(0, -R * .45); c.lineTo(-R * .16, -R * .6); c.moveTo(0, -R * .45); c.lineTo(R * .16, -R * .6); c.stroke(); c.restore() } circ(c, 0, 0, 22, '#f0f9ff'); c.restore() }
    c.restore();
  }
  function meter(c, x, y, lab, val, col, k, arrow) {
    rr(c, x - 380, y - 32, 760, 64, 16); fill(c, 'rgba(15,23,42,.85)');
    const v = lp(1 - val, val, k); rr(c, x - 370, y - 22, 740 * v + 1, 44, 12); fill(c, col);
    tx(c, lab + ': ' + Math.round(100 * v) + '% ' + arrow, x, y + 2, { f: 'M', w: 800, s: 30, c: '#fff' });
  }
  function shot5(c, t) {
    const pan = eio(at(t, K.liq - .1, K.liq + 1.0)) * 1400;   // камера поднимается от бака к пакетам
    const kz = eio(at(t, K.fool - .3, K.fool + .5));            // наезд в экран анализатора
    const kin = ss(K.s5 - .15, K.s5 + .45, t);
    if (kin < 1) { deskBg(c, t); report(c, t, 1) }
    if (kin > 0) A(c, kin, () => labBg(c, t, pan));
    // капля: верх красного столбика → бак
    const kd = at(t, K.s5 - .1, K.s5 + .65);
    c.save(); c.translate(0, pan);
    if (pan < 1300) {
      const tl = at(t, K.s5 + .1, K.s5 + .55);
      if (tl > 0 && pan < 1200) { c.save(); c.globalAlpha = tl; tank(c, t, { k: eo(at(t, K.s5 + .6, K.s5 + 1.6)) }); c.restore() }
      if (kd > 0 && kd < 1) { const dx = lp(700, 540, kd), dy = lp(470, 560, kd * kd); c.beginPath(); c.ellipse(dx, dy, 26, 34, 0, 0, TAU); fill(c, '#ef4444'); circ(c, dx - 8, dy - 10, 8, 'rgba(255,255,255,.6)') }
      const km = eo(at(t, K.s5 + .9, K.s5 + 1.5));
      if (km > 0) { mintLeaf(c, lp(80, 240, km), lp(1300, 760, km), .9, -1.1 + km * .5); c.save(); c.translate(WW, 0); c.scale(-1, 1); mintLeaf(c, lp(80, 240, km), lp(1300, 820, km), .9, -1.1 + km * .5); c.restore() }
    }
    // штанга с пакетами (мир: выше бака на 1100) и трубка в анализатор
    const RY = -1400 + 200;
    c.strokeStyle = '#64748b'; c.lineWidth = 16; c.beginPath(); c.moveTo(-40, RY); c.lineTo(WW + 40, RY); c.stroke();
    BAGS.forEach(([lab, col], i) => { const x = 540 + (i - 2) * 195, sw = Math.sin((t - K.liq) * 3.4 + i * .9) * .16 * Math.exp(-Math.max(0, t - K.liq - .4) * .9) * (t > K.liq ? 1 : 0); ivBag(c, x, RY + 16, lab, col, sw, i === 2 ? pulse2(t, K.ws) + ss(K.ws, K.ws + .3, t) * .6 : 0) });
    const kt = at(t, K.ws + .1, K.ws + .9), TY0 = RY + 290, TY1 = -1400 + 920;
    c.strokeStyle = 'rgba(226,232,240,.6)'; c.lineWidth = 18; c.beginPath(); c.moveTo(540, TY0); c.lineTo(540, TY1); c.stroke();
    if (kt > 0) { c.strokeStyle = '#22d3ee'; c.lineWidth = 9; c.beginPath(); c.moveTo(540, TY0); c.lineTo(540, lp(TY0, TY1, kt)); c.stroke() }
    c.restore();
    // анализатор (экран): молекула собирается, потом стягивается в медальон
    const ay = -1400 + 1130 + pan, km2 = at(t, K.ws + .7, K.fool), conv = eio(at(t, K.fool + .2, K.fool + .8));
    const flip = at(t, K.ice - .35, K.ice + .45);
    c.save(); if (kz > 0) { const s = lp(1, 1.6, kz); c.translate(540, lp(ay, 820, kz)); c.scale(s, s); c.translate(-540, -ay) }
    analyzer(c, t, 540, ay, () => {
      if (conv < 1) molecule(c, t, -30, 0, .9, km2, conv);
      if (conv > 0) { c.save(); c.globalAlpha = conv; medallion(c, t, 0, 0, lp(60, 140, conv), flip); c.restore() }
    });
    c.restore();
    if (kz > 0) {   // подписи и шкалы — поверх, ровно
      const kl = ss(K.fool + .5, K.fool + .9, t);
      tx(c, 'ПРИРОДНАЯ МЯТА', 540, 1215, { f: 'O', w: 700, s: 40, c: '#a7f3d0', ls: 3, a: kl * (1 - ss(.35, .6, flip)) });
      tx(c, 'СИНТЕТИЧЕСКИЙ ЛЁД WS-23', 540, 1215, { f: 'O', w: 700, s: 40, c: '#bae6fd', ls: 3, a: ss(.45, .8, flip) });
      const km3 = eo(at(t, K.ice + .3, K.ice + 1.1));
      if (km3 > 0) { A(c, km3, () => { meter(c, 540, 1305, 'ОЩУЩЕНИЕ ХОЛОДА', 1, '#0ea5e9', km3, '▲'); meter(c, 540, 1390, 'СПАЗМ ГОРЛА', 0, '#10b981', km3, '▼') }) }
    }
  }
  // ================= СЦЕНА 6: синие чертежи и кран → корпус торцом = 16 картриджей =================
  function blueprintBg(c, t, dark = 0) {
    c.fillStyle = mixc('#1e3a8a', '#0f1d44', dark); c.fillRect(-200, -200, WW + 400, HH + 400);
    c.lineWidth = 1.5; c.strokeStyle = rgba('#93c5fd', .14); c.beginPath(); for (let x = 0; x <= WW; x += 30) { c.moveTo(x, 0); c.lineTo(x, HH) } for (let y = 0; y <= HH; y += 30) { c.moveTo(0, y); c.lineTo(WW, y) } c.stroke();
    c.lineWidth = 3; c.strokeStyle = rgba('#bfdbfe', .2); c.beginPath(); for (let x = 0; x <= WW; x += 150) { c.moveTo(x, 0); c.lineTo(x, HH) } for (let y = 0; y <= HH; y += 150) { c.moveTo(0, y); c.lineTo(WW, y) } c.stroke();
    c.fillStyle = rgba('#dbeafe', .5); for (let x = 0; x <= WW; x += 30) c.fillRect(x, 0, 2, x % 150 ? 10 : 22);   // засечки
    vignette(c, .45, '5,10,30');
  }
  function crane(c, t, a = 1) {   // жёлто-чёрная балка под потолком, 3 лебёдки на цепях с паллетами
    if (a <= 0) return; c.save(); c.globalAlpha *= a;
    c.save(); rr(c, -40, 240, WW + 80, 50, 6); c.clip(); c.fillStyle = '#facc15'; c.fillRect(-40, 240, WW + 80, 50); c.fillStyle = '#111827';
    for (let i = -2; i < 30; i++) { poly(c, [i * 60, 240, i * 60 + 30, 240, i * 60 + 10, 290, i * 60 - 20, 290]); c.fill() } c.restore();
    for (let i = 0; i < 3; i++) {
      const x = ((t - K.grew) * 110 + i * 400 + 1200) % 1400 - 160, sw = Math.sin(t * 2.2 + i) * .04;
      rr(c, x - 40, 286, 80, 34, 6); fill(c, '#475569'); circ(c, x - 22, 290, 9, '#1f2937'); circ(c, x + 22, 290, 9, '#1f2937');
      c.save(); c.translate(x, 320); c.rotate(sw); c.strokeStyle = '#94a3b8'; c.lineWidth = 5; c.setLineDash([10, 6]); c.beginPath(); c.moveTo(-30, 0); c.lineTo(-70, 150); c.moveTo(30, 0); c.lineTo(70, 150); c.stroke(); c.setLineDash([]);
      rr(c, -100, 150, 200, 96, 8); fill(c, '#2563eb'); for (let j = 0; j < 5; j++) { rr(c, -86 + j * 36, 162, 26, 56, 6); fill(c, BOXC[(j + i) % 8]) }
      tx(c, 'ЭКСПОРТ', 0, 232, { f: 'O', w: 700, s: 16, c: '#fff', ls: 2 }); c.restore();
    }
    c.restore();
  }
  function sheetDraw(c, i, t) {   // белый лист 760×680 с синей схемой (координаты листа: центр 0,0)
    rr(c, -380, -340, 760, 680, 10); fill(c, '#f8fafc'); c.strokeStyle = rgba('#1e40af', .12); c.lineWidth = 1;
    c.beginPath(); for (let x = -380; x <= 380; x += 40) { c.moveTo(x, -340); c.lineTo(x, 340) } for (let y = -340; y <= 340; y += 40) { c.moveTo(-380, y); c.lineTo(380, y) } c.stroke();
    c.strokeStyle = '#1e40af'; c.lineWidth = 5; c.fillStyle = 'rgba(37,99,235,.12)';
    if (i === 0) {   // бак 13 мл против картриджа 0,7 мл
      rr(c, -230, -230, 200, 420, 40); c.fill(); c.stroke(); c.fillStyle = 'rgba(14,165,233,.45)'; rr(c, -214, -120, 168, 294, 30); c.fill();
      rr(c, 90, 70, 60, 120, 14); c.fillStyle = 'rgba(249,115,22,.4)'; c.fill(); c.stroke();
      tx(c, 'БАК: 13 МЛ', 170, -150, { f: 'U', w: 800, s: 40, c: '#1e3a8a', mw: 330 }); tx(c, 'JUUL: 0,7 МЛ', 120, 230, { f: 'O', w: 700, s: 30, c: '#ea580c' });
      tx(c, 'В 18 РАЗ БОЛЬШЕ', 170, -86, { f: 'O', w: 700, s: 30, c: '#2563eb' });
    } else if (i === 1) {   // двойная сетка
      [-140, 140].forEach(cx => { rr(c, cx - 90, -170, 180, 300, 30); c.stroke(); c.save(); rr(c, cx - 90, -170, 180, 300, 30); c.clip(); c.lineWidth = 2; c.beginPath(); for (let k = -400; k < 400; k += 22) { c.moveTo(cx + k, -170); c.lineTo(cx + k + 300, 130); c.moveTo(cx + k, 130); c.lineTo(cx + k + 300, -170) } c.stroke(); c.restore() });
      tx(c, 'ДВОЙНАЯ СЕТКА', 0, 210, { f: 'U', w: 800, s: 44, c: '#1e3a8a' }); tx(c, 'MESH COIL × 2', 0, 266, { f: 'O', w: 700, s: 30, c: '#2563eb', ls: 3 });
    } else {   // затяжки и аккумулятор
      rr(c, -250, -200, 170, 330, 20); c.stroke(); rr(c, -200, -230, 70, 32, 8); c.stroke(); for (let k = 0; k < 4; k++) { rr(c, -230, 70 - k * 70, 130, 54, 8); c.fillStyle = k < 3 ? 'rgba(34,197,94,.55)' : 'rgba(34,197,94,.2)'; c.fill() }
      tx(c, '650 mAh', -165, 190, { f: 'O', w: 700, s: 32, c: '#1e3a8a' });
      tx(c, '5000', 140, -60, { f: 'U', w: 800, s: 110, c: '#1e3a8a' }); tx(c, 'ЗАТЯЖЕК', 140, 50, { f: 'O', w: 700, s: 40, c: '#2563eb', ls: 3 });
    }
    rr(c, -380, -340, 760, 680, 10); stroke(c, '#93c5fd', 3);
  }
  const SH = { x: 540, y: 1000 };
  function sheets(c, t) {   // три листа веером; верхний перелистывается справа налево вокруг левого края
    const flips = [K.mesh - .25, K.puffs - .25];
    const kin = eo(at(t, K.grew - .1, K.grew + .6));
    for (let i = 2; i >= 0; i--) {
      const kfl = i < 2 ? eio(at(t, flips[i], flips[i] + .55)) : 0; if (kfl >= 1) continue;
      c.save(); c.translate(SH.x + (1 - kin) * 900 + (i - 0) * 18 * (1 - (i === 0 ? 0 : 0)), SH.y + i * 14); c.rotate(-.02 + i * .03 * (1 - kfl));
      const sx = Math.cos(kfl * Math.PI); c.translate(-380, 0); c.scale(sx, 1); c.translate(380, 0);
      if (sx > 0) sheetDraw(c, i, t); else { rr(c, -380, -340, 760, 680, 10); fill(c, '#dbeafe'); rr(c, -380, -340, 760, 680, 10); stroke(c, '#93c5fd', 3) }
      c.restore();
    }
  }
  function pod(c, x, y, r, k) { c.save(); c.translate(x, y); c.rotate(r); c.scale(k, k); rr(c, -18, -36, 36, 72, 9); fill(c, '#f97316'); rr(c, -18, -36, 36, 22, 8); fill(c, '#111827'); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-12, -10, 6, 40); c.restore() }
  function cylEnd(c, t, kr, kd) {   // корпус 220×520 поворачивается торцом (R 230), растровая тень, 16 картриджей по орбите
    const x = 540, y = 860, R = lp(110, 230, kr), hgt = 520 * (1 - kr);
    if (kr > .2) {   // растровая тень вправо-вниз под 35°
      const L = 520 * ss(.2, 1, kr), ux = Math.cos(.61), uy = Math.sin(.61);
      c.save(); c.fillStyle = 'rgba(2,6,23,.55)'; for (let d = 0; d < L; d += 20) for (let w = -R; w <= R; w += 20) { const px = x + ux * (d + R * .2) - uy * w, py = y + uy * (d + R * .2) + ux * w, rr0 = 7 * (1 - d / L); if (rr0 > .5) circ(c, px, py, rr0, 'rgba(147,197,253,.30)') } c.restore();
    }
    if (hgt > 2) { const g = c.createLinearGradient(x - 110, 0, x + 110, 0); g.addColorStop(0, '#d97706'); g.addColorStop(.4, '#fbbf24'); g.addColorStop(1, '#0891b2'); c.fillStyle = g; c.fillRect(x - 110 * lp(1, R / 110, kr), y - hgt / 2, 220 * lp(1, R / 110, kr), hgt) }
    c.save(); c.translate(x, y - hgt / 2); c.scale(1, lp(.18, 1, kr)); circ(c, 0, 0, R, '#fbbf24'); ring(c, 0, 0, R - 12, '#fde68a', 6); circ(c, 0, 0, R * .32, '#111827'); c.restore();
    if (kd > 0) {   // надпись в круге
      A(c, kd, () => { circ(c, x, y, R - 22, 'rgba(15,23,42,.92)');
        tx(c, '1 ОДНОРАЗКА', x, y - 80, { f: 'U', w: 800, s: 38, c: '#fbbf24' }); tx(c, '=', x, y - 22, { f: 'U', w: 800, s: 44, c: '#fff' }); tx(c, '16 КАРТРИДЖЕЙ', x, y + 34, { f: 'U', w: 800, s: 34, c: '#fff' }); tx(c, 'JUUL · ПО НИКОТИНУ', x, y + 90, { f: 'O', w: 700, s: 24, c: '#fdba74', ls: 2 }) });
    }
  }
  function shot6(c, t) {
    // медальон-снежинка раскрывается в синюю миллиметровку
    const kx = eio(at(t, K.s6 - .1, K.s6 + .6));
    if (kx < 1) shot5(c, t);
    if (kx > 0) { c.save(); c.beginPath(); c.arc(540, 820, lp(230, 1400, kx), 0, TAU); c.clip(); blueprintBg(c, t, eio(at(t, K.nicot - .2, K.nicot + .4)));
      crane(c, t, at(t, K.grew - .4, K.grew + .2) * (1 - at(t, K.nicot - .2, K.nicot + .3)));
      // «один картридж = пачка»: эскиз белыми линиями
      const kp = at(t, K.s6 + .4, K.s6 + .9) * (1 - at(t, K.grew - .3, K.grew + .1));
      if (kp > 0) A(c, kp, () => { c.strokeStyle = '#e0f2fe'; c.lineWidth = 6; rr(c, 300, 760, 90, 220, 20); c.stroke(); rr(c, 300, 760, 90, 60, 16); c.stroke(); tx(c, '≈', 540, 870, { f: 'U', w: 800, s: 90, c: '#e0f2fe' });
        rr(c, 640, 740, 170, 250, 12); c.stroke(); c.beginPath(); c.moveTo(640, 820); c.lineTo(810, 820); c.stroke(); for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(668 + i * 29, 790, 11, 0, TAU); c.stroke() }
        tx(c, '1 КАРТРИДЖ ≈ 1 ПАЧКА', 540, 1100, { f: 'U', w: 800, s: 40, c: '#e0f2fe' }) });
      const kroll = eio(at(t, K.nicot - .2, K.nicot + .35));
      if (kroll < 1) A(c, 1 - kroll, () => { c.save(); c.translate(540, 1000); c.scale(lp(1, .3, kroll), lp(1, .7, kroll)); c.translate(-540, -1000); sheets(c, t); c.restore() });
      if (kroll > 0) A(c, kroll, () => cylEnd(c, t, eio(at(t, K.nicot + .2, K.n16 - .05)), at(t, K.n16 + .5, K.n16 + .9)));
      // 16 картриджей зажигаются по часовой
      for (let i = 0; i < 16; i++) { const a0 = -Math.PI / 2 + i * TAU / 16, k = spr(at(t, K.n16 - .05 + i * .05, K.n16 + .3 + i * .05)); if (k > 0) pod(c, 540 + Math.cos(a0) * 310, 860 + Math.sin(a0) * 310, a0 + Math.PI / 2, k) }
      c.restore();
      if (kx < 1) { c.save(); c.beginPath(); c.arc(540, 820, lp(230, 1400, kx), 0, TAU); stroke(c, '#e0f2fe', 10 * (1 - kx)); c.restore() }
    }
  }
  // ================= СЦЕНА 7: холм с табаком → колба-лампочка → змеевик → касса =================
  function labBlue(c, t) {   // тёмно-синяя лаборатория с бензольными шестигранниками и штативами
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#0b1430', '#13214a', '#0a1228']);
    for (let i = 0; i < 9; i++) { const x = (H1(i * 3) * WW + t * 12 * (i % 2 ? 1 : -1) + 2000) % (WW + 200) - 100, y = 160 + H1(i * 7) * 1100 + Math.sin(t * .6 + i) * 20, r = 40 + H1(i) * 50;
      c.save(); c.translate(x, y); c.rotate(t * .1 + i); c.globalAlpha = .14; c.beginPath(); for (let j = 0; j < 6; j++) { const a = j * TAU / 6; c[j ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r) } c.closePath(); stroke(c, '#93c5fd', 4); c.beginPath(); c.arc(0, 0, r * .55, 0, TAU); c.stroke(); c.restore() }
    c.save(); c.globalAlpha = .35; [[110, 1350], [970, 1350]].forEach(([x, b]) => { c.fillStyle = '#334155'; c.fillRect(x - 6, b - 760, 12, 760); c.fillRect(x - 70, b - 10, 140, 14); c.fillRect(x, b - 600, 70, 8); c.fillRect(x, b - 420, 70, 8) }); c.restore();
    glow(c, 540, 700, 700, '#3b82f6', .12); vignette(c, .5);
  }
  const PL = [{ x: 540, by: 1095, ty: 420, s: 1 }, { x: 330, by: 1120, ty: 650, s: .8 }, { x: 750, by: 1120, ty: 650, s: .8 }];
  function tobacco(c, t, p, i, kg, kw) {   // растение: стебель, большие листья, розово-красные бутоны; kw — увядание
    const top = lp(p.by, p.ty, kg); if (kg <= 0) return;
    c.strokeStyle = mixc('#15803d', '#78716c', kw); c.lineWidth = 9 * p.s; c.lineCap = 'round'; c.beginPath(); c.moveTo(p.x, p.by); c.quadraticCurveTo(p.x + 18 * Math.sin(i + 1), (p.by + top) / 2, p.x, top); c.stroke();
    for (let j = 0; j < 4; j++) { const ly = lp(p.by, top, .2 + j * .2), kl = spr(at(kg, .2 + j * .15, .5 + j * .15)), dir = j % 2 ? 1 : -1; if (kl <= 0 || ly < top + 20) continue;
      const fall = kw * (40 + j * 20);
      c.save(); c.translate(p.x, ly + fall); c.rotate(dir * (.5 + kw * .9)); c.scale(kl * p.s * dir, kl * p.s); c.globalAlpha *= 1 - kw * .85;
      c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(60, -70, 170, -40, 200, 0); c.bezierCurveTo(170, 40, 60, 50, 0, 0); fill(c, mixc('#059669', '#a8a29e', kw));
      c.strokeStyle = 'rgba(209,250,229,.5)'; c.lineWidth = 3; c.beginPath(); c.moveTo(4, 0); c.lineTo(190, 0); c.stroke(); c.restore() }
  }
  function bud(c, x, y, k, kw) { if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k); c.globalAlpha *= 1 - kw; for (let j = 0; j < 5; j++) { c.save(); c.rotate(-Math.PI / 2 + (j - 2) * .28); c.beginPath(); c.ellipse(0, -36, 13, 34, 0, 0, TAU); fill(c, j % 2 ? '#f472b6' : '#e11d48'); c.restore() } circ(c, 0, 0, 16, '#be123c'); c.restore() }
  function bulb(c, x, y, k, t) {   // стеклянная колба-лампочка R 85 с золотым свечением
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k);
    glow(c, 0, 0, 260, '#fbbf24', .55); circ(c, 0, 0, 85, 'rgba(254,243,199,.30)'); circ(c, 0, 10, 60, rgba('#f59e0b', .75)); glow(c, 0, 10, 90, '#fde68a', .8);
    ring(c, 0, 0, 85, 'rgba(255,255,255,.85)', 6); rr(c, -26, 78, 52, 40, 8); fill(c, 'rgba(226,232,240,.8)'); c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(-36, -34, 12, 26, -.6, 0, TAU); c.fill();
    c.restore();
  }
  // змеевик: 5 витков, X 380…700, Y 520…1170
  const COIL = (() => { const P = []; for (let i = 0; i <= 400; i++) { const u = i / 400, a = u * 5 * TAU; P.push([540 + Math.sin(a) * 160, 520 + u * 650 + Math.cos(a) * 26]) } return P })();
  function coil(c, t, ka, kd) {
    if (ka <= 0) return; c.save(); c.globalAlpha *= ka;
    c.fillStyle = '#475569'; c.fillRect(780, 420, 14, 900); c.fillRect(700, 1310, 180, 16); rr(c, 700, 500, 100, 26, 6); fill(c, '#64748b'); rr(c, 700, 1100, 100, 26, 6); fill(c, '#64748b');
    rr(c, 480, 1230, 120, 80, 18); fill(c, 'rgba(186,230,253,.35)'); rr(c, 480, 1230, 120, 80, 18); stroke(c, '#e0f2fe', 3);   // спиртовка
    const fl = 1 + .12 * Math.sin(t * 17); c.save(); c.translate(540, 1228); c.scale(1, fl); c.beginPath(); c.moveTo(0, -70); c.quadraticCurveTo(26, -22, 0, 0); c.quadraticCurveTo(-26, -22, 0, -70); fill(c, '#3b82f6'); c.beginPath(); c.moveTo(0, -46); c.quadraticCurveTo(13, -16, 0, 0); c.quadraticCurveTo(-13, -16, 0, -46); fill(c, '#93c5fd'); c.restore();
    const path = () => { c.beginPath(); COIL.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0], p[1])) };
    c.lineCap = 'round'; c.lineJoin = 'round';
    path(); stroke(c, 'rgba(255,255,255,.75)', 28); path(); stroke(c, 'rgba(15,23,42,.85)', 20); path(); stroke(c, 'rgba(186,230,253,.18)', 20);
    if (kd > 0) { const n = Math.floor(kd * 400), a = Math.max(0, n - 60); c.beginPath(); for (let i = a; i <= n; i++) c[i > a ? 'lineTo' : 'moveTo'](COIL[i][0], COIL[i][1]); stroke(c, '#fbbf24', 12); if (kd < 1) { const p = COIL[n]; glow(c, p[0], p[1], 60, '#fde68a', .9); circ(c, p[0], p[1], 14, '#fde047') } }
    c.restore();
  }
  function billFan(c, k) {   // веер стодолларовых купюр за кассой
    if (k <= 0) return; c.save(); c.translate(540, 1100);
    for (let i = 0; i < 11; i++) { const a = lp(0, -1.25 + i * .25, eo(k)); c.save(); c.rotate(a); c.translate(0, -330); rr(c, -78, -170, 156, 340, 10); fill(c, i % 2 ? '#86b48a' : '#9ec29f'); rr(c, -66, -158, 132, 316, 6); stroke(c, '#3f6d48', 3); circ(c, 0, -20, 38, '#d9e8d5'); ring(c, 0, -20, 38, '#3f6d48', 3); tx(c, '100', 0, 120, { f: 'O', w: 700, s: 34, c: '#2f5537' }); c.restore() }
    c.restore();
  }
  function storeBg(c, t) {   // витрина магазина за кассой: полки с коробками одноразок, тёплый свет
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#1c1426', '#2a1a2e', '#140f1c']);
    for (let r = 0; r < 4; r++) { c.fillStyle = '#3b2a3f'; c.fillRect(0, 300 + r * 230, WW, 14); for (let i = 0; i < 13; i++) { if (H1(i + r * 13) > .82) continue; c.save(); c.globalAlpha = .55; vapeBox(c, 40 + i * 80, 300 + r * 230 - 58, 56, 112, BOXC[(i + r) % 8]); c.restore() } }
    glow(c, 540, 700, 800, '#f59e0b', .12);
    vgrad(c, -100, 1360, WW + 200, 700, ['#2b1d14', '#1a110b']); c.fillStyle = '#5b3a24'; c.fillRect(-100, 1356, WW + 200, 12);
    vignette(c, .55);
  }
  const REG = { x: 540, y: 980 };
  function register(c, t, o = {}) {   // ретро-касса 580×480: табло сверху (Y 740), клавиши, ящик
    const { x, y } = REG; c.save(); c.translate(x, y);
    c.save(); c.translate(0, 250); c.scale(1, .12); circ(c, 0, 0, 340, 'rgba(0,0,0,.45)'); c.restore();
    poly(c, [-290, 240, 290, 240, 250, -120, -250, -120]); const g = c.createLinearGradient(0, -120, 0, 240); g.addColorStop(0, '#b45309'); g.addColorStop(1, '#78350f'); c.fillStyle = g; c.fill();
    poly(c, [-250, -120, 250, -120, 240, -150, -240, -150]); fill(c, '#d97706');
    for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { rr(c, -210 + i * 72, -90 + r * 64, 58, 48, 10); fill(c, '#fef3c7'); rr(c, -210 + i * 72, -90 + r * 64, 58, 14, 6); fill(c, '#fff') }
    rr(c, -260, 120, 520, 100, 10); fill(c, '#92400e'); rr(c, -60, 160, 120, 20, 8); fill(c, '#fbbf24');
    // табло
    rr(c, -280, -330, 560, 180, 22); fill(c, '#451a03'); rr(c, -260, -312, 520, 144, 14); fill(c, '#0c0a09');
    if (o.disp) o.disp(-240, -240); else tx(c, '$0', 0, -240, { f: 'J', w: 700, s: 60, c: '#fb923c' });
    if (o.coin > 0) { c.save(); c.translate(0, -132 + 10 * (1 - o.coin)); circ(c, 0, 0, 34 * o.coin, '#fbbf24'); ring(c, 0, 0, 26 * o.coin, '#b45309', 4); c.restore() }
    c.restore();
  }
  const REGNUM = '$3 200 000 000';
  function regDisplay(c, t) {   // цифры набегают от $0 до 3 200 000 000
    const k = eio(at(t, K.bill - .1, K.bill + 1.0)), v = Math.round(3.2e9 * k / 1e6) * 1e6;
    const s = '$' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (x, y) => { glow(c, 0, y, 260, '#fb923c', .22); num(c, k >= 1 ? REGNUM : s, 0, y - 6, { f: 'J', w: 700, s: 52, c: '#fb923c' }); tx(c, 'ОДНОРАЗКИ · США · ГОД', 0, y + 50, { f: 'O', w: 500, s: 22, c: '#fdba74', ls: 3 }) };
  }
  function receipt(c, t) {   // лента чека S-дугой вверх из щели, строки — по словам
    const k = eio(at(t, K.market - .3, K.corp + .6)); if (k <= 0) return;
    const L = 560 * k, x0 = 760, y0 = 760, W = 300;
    const pt = u => [x0 - 40 * Math.sin(u * Math.PI * 1.2) - u * 20, y0 - u * 560];
    c.save(); c.globalAlpha *= 1;
    const N = 30, top = []; for (let i = 0; i <= N; i++) { const u = i / N * (L / 560); top.push(pt(u)) }
    c.beginPath(); top.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0] - W / 2, p[1])); for (let i = N; i >= 0; i--) c.lineTo(top[i][0] + W / 2, top[i][1]); c.closePath(); fill(c, '#fafaf9'); c.strokeStyle = '#d6d3d1'; c.lineWidth = 2; c.stroke();
    const lines = [['ЧЕК · РЫНОК ОДНОРАЗОК', K.market], ['VUSE GO — BAT', K.old - .1], ['NJOY — ALTRIA', K.corp - .2], ['(«МАЛЬБОРО»)', K.corp]];
    lines.forEach(([s, tt0], i) => { const u = .9 - i * .2; if (u * 560 > L) return; const p = pt(u); tx(c, s, p[0], p[1] + 18, { f: 'J', w: 700, s: 27, c: '#1c1917', a: at(t, tt0, tt0 + .25), mw: W - 24 }) });
    c.restore();
  }
  function shot7(c, t) {
    const kh = eio(at(t, K.s7 - .1, K.s7 + .7));   // торец опускается и становится холмом
    const kp = at(t, K.s7 + .2, K.s7 + 1.6);       // табак растёт
    const kb = spr(at(t, K.tube - .1, K.tube + .4)), kw = eio(at(t, K.noleaf, K.leaf + .5));
    const kc = at(t, K.when - .3, K.when + .4), kd = at(t, K.when + .1, K.bill - .25);
    const pan = eio(at(t, K.bill - .55, K.bill - .05)) * 1250;
    if (kh < 1) shot6(c, t);
    if (kh <= 0) return;
    c.save(); if (kh < 1) { c.globalAlpha = kh }
    // фон: лаборатория → (панорама вниз) витрина за кассой
    if (pan < 1250) { c.save(); c.translate(0, -pan * .6); labBlue(c, t); c.restore() }
    if (pan > 0) { c.save(); c.translate(0, (1250 - pan) * .6); storeBg(c, t); c.restore() }
    c.save(); c.translate(0, -pan);
    if (kd < 1 || pan < 1200) {
      const hr = lp(230, 760, kh), hy = lp(860, 1300, kh);
      c.save(); c.beginPath(); c.ellipse(540, hy, hr, lp(230, 300, kh), 0, Math.PI, TAU); c.closePath(); const g = c.createLinearGradient(0, hy - 300, 0, hy); g.addColorStop(0, '#e2e8f0'); g.addColorStop(1, '#94a3b8'); c.fillStyle = g; c.globalAlpha *= 1 - kc; c.fill(); c.fillRect(540 - hr, hy - 2, hr * 2, 300); c.restore();
      A(c, 1 - kc, () => { PL.forEach((p, i) => tobacco(c, t, p, i, eo(at(kp, i * .12, .7 + i * .12)), i === 0 ? kw : Math.max(kw, ss(.5, 1, kw)))); bud(c, PL[1].x, PL[1].ty, spr(at(kp, .7, 1)), kw); bud(c, PL[2].x, PL[2].ty, spr(at(kp, .75, 1)), kw); });
      bud(c, 540, 420, spr(at(kp, .65, .95)) * (1 - kb), 0);
      coil(c, t, kc, kd);
      bulb(c, 540, 420, kb, t);
      const kl = spr(at(t, K.tube + .2, K.tube + .7)); if (kl > 0) plate(c, 'СИНТЕТИЧЕСКИЙ НИКОТИН · БЕЗ ТАБАКА', 540, 270, kl, { s: 30, bg: '#fbbf24', c: '#1c1917' });
    }
    // капля падает с конца змеевика на кассу
    const kfall = at(t, K.bill - .55, K.bill - .02); if (kfall > 0 && kfall < 1) { const y = lp(1180, 1250 + 848, kfall * kfall); glow(c, 540, y, 50, '#fde68a', .9); circ(c, 540, y, 16, '#fde047') }
    c.restore();
    if (pan > 0) {   // касса (экранные координаты после панорамы)
      c.save(); c.translate(0, 1250 - pan);
      const kt = eio(at(t, K.bill - .05, K.bill + .7)) * (1 - eio(at(t, K.market - .4, K.market + .4)));
      if (kt > 0) { c.translate(540, 740); c.rotate(-.10 * kt); c.scale(lp(1, 1.4, kt), lp(1, 1.4, kt)); c.translate(-540, -740) }
      billFan(c, at(t, K.bill + .1, K.bill + .9));
      register(c, t, { disp: regDisplay(c, t), coin: spr(at(t, K.bill - .05, K.bill + .3)) });
      receipt(c, t);
      c.restore();
    }
    c.restore();
  }
  // ================= СЦЕНА 8: ноль с табло → Луна, общежитие в диагональном разрезе =================
  const DM = { w: 640, top: 360, bot: 1400 };   // здание: 4 этажа по 260
  function dorm(c, t, cx, roomsA = 1) {
    const L = cx - DM.w / 2, R = cx + DM.w / 2, T = DM.top, B = DM.bot, FH = (B - T) / 4;
    c.save(); c.translate(14, 18); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(L, T, DM.w, B - T); c.restore();
    // интерьер (виден в разрезе): 4 этажа, комнаты, лестница справа
    vgrad(c, L, T, DM.w, B - T, ['#2a1f3a', '#231a30']);
    for (let f = 0; f < 4; f++) {
      const fy = T + f * FH, lit = f > 0;
      c.fillStyle = lit ? '#3b2f4f' : '#261d33'; c.fillRect(L + 10, fy + 10, DM.w - 20, FH - 26);
      c.fillStyle = '#5b4a6e'; c.fillRect(L, fy + FH - 16, DM.w, 16);   // перекрытие
      // лестница
      c.strokeStyle = '#6b5a7e'; c.lineWidth = 6; c.beginPath(); c.moveTo(R - 150, fy + FH - 16); c.lineTo(R - 30, fy + 20); c.stroke(); for (let s2 = 0; s2 < 8; s2++) { c.fillStyle = '#6b5a7e'; c.fillRect(R - 150 + s2 * 15, fy + FH - 30 - s2 * 28, 16, 6) }
      if (!lit) continue;
      // окно на задней стене с инеем по углам
      const wx = L + 60, wy = fy + 34; rr(c, wx, wy, 130, 110, 6); fill(c, '#0f1d3d'); circ(c, wx + 100, wy + 30, 6, '#f8fafc');
      [[wx, wy], [wx + 130, wy], [wx, wy + 110], [wx + 130, wy + 110]].forEach(([qx, qy], j) => { c.save(); c.translate(qx, qy); c.rotate(j * Math.PI / 2); poly(c, [0, 0, 34, 0, 0, 34]); fill(c, 'rgba(224,242,254,.7)'); c.restore() });
      rr(c, wx, wy, 130, 110, 6); stroke(c, '#8b7aa0', 5);
      // стол, лампа, силуэт в профиль (без лица)
      const dx = L + 250 + (f % 2) * 60, dy = fy + FH - 16;
      c.fillStyle = '#4a3a5e'; c.fillRect(dx, dy - 90, 170, 12); c.fillRect(dx + 10, dy - 80, 10, 80); c.fillRect(dx + 150, dy - 80, 10, 80);
      glow(c, dx + 140, dy - 120, 90, '#fde68a', .25); c.fillStyle = '#a78bfa'; c.fillRect(dx + 134, dy - 150, 8, 60);
      const sx = dx - 40; c.fillStyle = '#0b0714'; rr(c, sx - 34, dy - 150, 68, 110, 26); c.fill(); circ(c, sx, dy - 182, 32, '#0b0714'); rr(c, sx - 34, dy - 214, 60, 40, 18); c.fill();   // капюшон и плечи
      c.fillRect(sx - 30, dy - 50, 22, 50); c.fillRect(sx + 6, dy - 50, 22, 50);
      // огонёк одноразки на столе и облачко пара
      const ph = (t * .55 + f * .37) % 1, on = .5 + .5 * Math.sin(t * 5 + f * 2);
      const vx = dx + 60, vy = dy - 104; rr(c, vx - 7, vy - 26, 14, 30, 5); fill(c, '#0ea5e9'); glow(c, vx, vy - 20, 34, '#38bdf8', .5 + .4 * on); circ(c, vx, vy - 20, 4, '#e0f2fe');
      A(c, Math.sin(ph * Math.PI) * .6, () => [0, 1, 2].forEach(j => circ(c, vx + 6 + j * 14 + ph * 40, vy - 50 - ph * 70 - j * 12, 14 + ph * 22, 'rgba(224,242,254,.55)')));
    }
    // фасад: кирпичная стена, срезанная по диагонали (остаётся верхний левый угол)
    c.save(); poly(c, [L, T, R, T, L, B]); c.clip();
    vgrad(c, L, T, DM.w, B - T, ['#7c2d12', '#5b2210']);
    c.strokeStyle = 'rgba(0,0,0,.2)'; c.lineWidth = 2; for (let y = T; y < B; y += 26) { c.beginPath(); c.moveTo(L, y); c.lineTo(R, y); c.stroke(); for (let x = L + ((y - T) / 26 % 2) * 30; x < R; x += 60) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 26); c.stroke() } }
    for (let f = 0; f < 4; f++) for (let i = 0; i < 4; i++) { const wx = L + 40 + i * 150, wy = T + f * (B - T) / 4 + 60; rr(c, wx, wy, 90, 120, 6); fill(c, H1(i + f * 4) > .5 ? '#fde68a' : '#1e293b'); rr(c, wx, wy, 90, 120, 6); stroke(c, '#e7e5e4', 5) }
    c.restore();
    c.save(); c.beginPath(); c.moveTo(R, T); c.lineTo(L, B); c.strokeStyle = '#9a3412'; c.lineWidth = 22; c.stroke(); c.strokeStyle = '#c2410c'; c.lineWidth = 8; c.stroke(); c.restore();   // срез стены
    c.fillStyle = '#44403c'; c.fillRect(L - 20, T - 30, DM.w + 40, 34);   // крыша
  }
  function shot8(c, t) {
    const kin = ss(K.s8 - .25, K.s8 + .4, t);
    if (kin < 1) shot7(c, t);
    if (kin <= 0) return;
    A(c, kin, () => { nightSky(c, t, { clouds: true }); c.save(); skylineLayer(c, 21, 1420, 260, 700, '#141c35', .45, '#fde68a', t); c.restore(); vgrad(c, -100, 1400, WW + 200, 600, ['#1e293b', '#0f172a']); c.fillStyle = '#334155'; c.fillRect(-100, 1400, WW + 200, 12); lamp(c, 980, 1406, 520) });
    // Луна — последний ноль табло поднимается в небо
    const km = eio(at(t, K.s8 - .25, K.s8 + .55));
    const mx = lp(780, 230, km), my = lp(830, 340, km), mr = lp(30, 95, km);
    glow(c, mx, my, mr * 3, '#e0f2fe', .35 * km); circ(c, mx, my, mr, mixc('#fb923c', '#f8fafc', km)); if (km > .6) { circ(c, mx - mr * .3, my - mr * .2, mr * .2, 'rgba(148,163,184,.3)'); circ(c, mx + mr * .3, my + mr * .25, mr * .14, 'rgba(148,163,184,.25)') }
    const kd = bo(at(t, K.s8 + .2, K.s8 + 1.2)); if (kd > 0) dorm(c, t, lp(1460, 620, kd));
    vignette(c, .45);
  }
  // ================= СЦЕНА 9: пробковая доска и две концовки =================
  const CARDS = [
    { id: '1979', x: 340, y: 440, a: '1979', b: 'СОЛЬ', open: true },
    { id: '2020', x: 740, y: 440, a: '2020', b: 'ЛАЗЕЙКА ОДНОРАЗОК', open: true },
    { id: '2014', x: 230, y: 880, a: '2014', b: 'НАГРЕВАТЕЛИ' },
    { id: '1924', x: 540, y: 900, a: '1924', b: '«МАЛЬБОРО»' },
    { id: '2022', x: 850, y: 880, a: '2022', b: 'ШАЙБЫ' },
  ];
  const CW = 270, CH = 330, PH = 240;
  const photoC = cd => [cd.x, cd.y - CH / 2 + 15 + PH / 2];
  const pinP = cd => [cd.x, cd.y - CH / 2 + 4];
  let CORK = null;
  function corkImg() {
    if (CORK) return CORK; CORK = mk(WW, 1400); const g = CORK.getContext('2d');
    g.fillStyle = '#a0703f'; g.fillRect(0, 0, WW, 1400);
    for (let i = 0; i < 9000; i++) { const x = H1(i * 1.3) * WW, y = H1(i * 2.7) * 1400, r = .8 + H1(i * 5.1) * 2.6; g.fillStyle = H1(i * 7.7) > .5 ? 'rgba(70,40,15,.35)' : 'rgba(225,180,120,.30)'; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill() }
    for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(40,20,5,.35)'; g.beginPath(); g.arc(H1(i * 3.3) * WW, H1(i * 9.1) * 1400, 3, 0, TAU); g.fill() }
    return CORK;
  }
  function boardWall(c, t) {   // стена, рама доски, пробка, софит; ниже — стол с лампой и ноутбуком
    vgrad(c, -1200, -1200, WW + 2400, 5200, ['#1c1917', '#292524', '#1c1917']);
    c.save(); rr(c, 30, 150, WW - 60, 1050, 14); fill(c, '#5b3a1e'); rr(c, 52, 172, WW - 104, 1006, 8); c.clip(); c.drawImage(corkImg(), 0, 0); c.restore();
    rr(c, 30, 150, WW - 60, 1050, 14); stroke(c, '#3b2414', 8);
    beam(c, 540, -200, 540, 1200, 60, 620, '#fde68a', .16);
    c.save(); c.globalCompositeOperation = 'source-over'; const g = c.createRadialGradient(540, 620, 100, 540, 700, 900); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)'); c.fillStyle = g; c.fillRect(30, 150, WW - 60, 1050); c.restore();
  }
  function photo1979(c, t, x, y, s) {   // колба и голубой кристалл соли
    vgrad(c, x - s / 2, y - s / 2, s, s, ['#1e293b', '#0f172a']); glow(c, x, y, s * .6, '#38bdf8', .25);
    c.save(); c.translate(x - s * .12, y + s * .08); c.scale(s / 240, s / 240);
    poly(c, [-14, -80, 14, -80, 14, -30, 60, 60, -60, 60, -14, -30]); fill(c, 'rgba(186,230,253,.25)'); c.strokeStyle = '#e0f2fe'; c.lineWidth = 4; c.stroke();
    poly(c, [-38, 20, 38, 20, 56, 56, -56, 56]); fill(c, 'rgba(56,189,248,.7)');
    c.restore();
    c.save(); c.translate(x + s * .24, y + s * .2); c.scale(s / 240, s / 240); poly(c, [0, -34, 26, -10, 18, 26, -18, 26, -26, -10]); fill(c, '#7dd3fc'); poly(c, [0, -34, 26, -10, 0, 0]); fill(c, '#e0f2fe'); c.restore();
  }
  function sil(c, id, x, y, s) {   // тёмные силуэты закрытых карточек
    c.save(); c.translate(x, y); c.scale(s / 240, s / 240); c.fillStyle = '#334155';
    if (id === '2014') { rr(c, -22, -90, 44, 180, 14); c.fill(); rr(c, -12, -120, 24, 40, 8); c.fill() }
    else if (id === '1924') { rr(c, -14, -100, 28, 200, 6); c.fill(); c.fillRect(-14, -100, 28, 34) }
    else { c.beginPath(); c.ellipse(0, 10, 80, 30, 0, 0, TAU); c.fill(); c.fillRect(-80, -20, 160, 30); c.beginPath(); c.ellipse(0, -20, 80, 30, 0, 0, TAU); fill(c, '#475569') }
    c.restore();
  }
  function marker(c, x, y, s, seed) {   // фактурные полосы чёрного маркера крест-накрест
    c.save(); c.translate(x, y); c.lineCap = 'round';
    [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(seed + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke();
      c.strokeStyle = 'rgba(60,60,70,.35)'; c.lineWidth = 3; for (let j = 0; j < 4; j++) { c.beginPath(); c.moveTo(-s * .6, off * s * .25 - s * .08 + j * s * .05); c.lineTo(s * .6, off * s * .25 - s * .08 + j * s * .05); c.stroke() } c.restore() });
    c.restore();
  }
  // 3-я глава, кадр 0: белая сигарета с красным ободком на тёмно-синем фоне ар-деко
  function ep3Frame(c, t) {
    c.fillStyle = '#0f172a'; c.fillRect(-200, -200, WW + 400, HH + 400);
    const g = c.createRadialGradient(540, 860, 0, 540, 860, 1000); g.addColorStop(0, '#1e3a8a'); g.addColorStop(.5, '#172554'); g.addColorStop(1, '#0f172a'); c.fillStyle = g; c.fillRect(-200, -200, WW + 400, HH + 400);
    c.save(); c.translate(540, 860); for (let i = 0; i < 24; i++) { c.save(); c.rotate(i * TAU / 24); poly(c, [0, 0, -40, -1400, 40, -1400]); fill(c, i % 2 ? 'rgba(212,160,23,.07)' : 'rgba(212,160,23,.03)'); c.restore() }
    [260, 360, 470].forEach((r, i) => { c.beginPath(); c.arc(0, 0, r, Math.PI * 1.1, Math.PI * 1.9); stroke(c, rgba('#d4a017', .35 - i * .08), 4) }); c.restore();
    c.save(); c.strokeStyle = 'rgba(212,160,23,.35)'; c.lineWidth = 4; [[0, 0], [WW, 0], [0, HH], [WW, HH]].forEach(([qx, qy]) => { c.save(); c.translate(qx, qy); c.scale(qx ? -1 : 1, qy ? -1 : 1); for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(40 + i * 26, 230); c.lineTo(40 + i * 26, 40 + i * 26); c.lineTo(230, 40 + i * 26); c.stroke() } c.restore() }); c.restore();
    glow(c, 540, 860, 420, '#fde68a', .14);
    c.save(); c.translate(540, 860); c.save(); c.translate(30, 40); rr(c, -38, -330, 76, 660, 20); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, -38, -330, 76, 660, 20); fill(c, '#f8fafc'); c.fillStyle = 'rgba(203,213,225,.6)'; c.fillRect(14, -330, 16, 660);
    rr(c, -38, -330, 76, 70, 20); fill(c, '#e11d48'); c.fillStyle = '#be123c'; c.fillRect(-38, -270, 76, 10);
    c.restore();
  }
  function cardDraw(c, t, cd, o = {}) {
    const [px, py] = photoC(cd);
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW / 2, -CH / 2, CW, CH, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW / 2, cd.y - CH / 2, CW, CH, 6); fill(c, '#f5f0e6');
    c.save(); c.beginPath(); c.rect(px - PH / 2, py - PH / 2, PH, PH); c.clip();
    if (cd.id === '1979') photo1979(c, t, px, py, PH);
    else if (cd.id === '2020') { c.save(); c.translate(px, py); c.scale(PH / 1040, PH / 1040); c.translate(-620, -880); shot8(c, t); c.restore() }
    else if (cd.id === '1924' && o.ep3) { c.save(); c.translate(px, py); c.scale(PH / 1080, PH / 1080); c.translate(-540, -860); ep3Frame(c, t); c.restore() }
    else { c.fillStyle = '#1e293b'; c.fillRect(px - PH / 2, py - PH / 2, PH, PH) }
    if (!cd.open) {   // закрыто: тёмный силуэт и маркер (у 1924 — стирается помадой по диагонали)
      c.save(); if (o.wipe !== undefined) { const d = o.wipe; c.beginPath(); c.moveTo(px - PH, py - PH + d * 4 * PH); c.lineTo(px + PH * 2, py - PH * 4 + d * 4 * PH); c.lineTo(px + PH * 2, py + PH * 2); c.lineTo(px - PH, py + PH * 2); c.closePath(); c.clip() }
      c.fillStyle = '#1e293b'; c.fillRect(px - PH / 2, py - PH / 2, PH, PH); sil(c, cd.id, px, py, PH); marker(c, px, py, PH, cd.x); c.restore();
    }
    c.restore();
    tx(c, cd.a, cd.x, cd.y + CH / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' }); tx(c, cd.b, cd.x, cd.y + CH / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW - 24, a: 1 - (o.sub ? o.subA : 0) });
    if (o.sub) tx(c, o.sub, cd.x, cd.y + CH / 2 - 18, { f: 'M', w: 800, s: 18, c: '#b91c1c', a: o.subA, mw: CW - 24 });
    if (!o.noPin) pin(c, ...pinP(cd));
  }
  function pin(c, x, y) { circ(c, x + 3, y + 5, 14, 'rgba(0,0,0,.35)'); circ(c, x, y, 14, '#dc2626'); circ(c, x - 4, y - 4, 5, '#fca5a5') }
  function thread(c, a, b, k = 1) { if (k <= 0) return; const [x1, y1] = pinP(a), [x2, y2] = pinP(b); c.save(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(lp(x1, x2, k) + 3, lp(y1, y2, k) + 6); c.stroke(); c.strokeStyle = '#dc2626'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, k), lp(y1, y2, k)); c.stroke(); c.restore() }
  function board(c, t, o = {}) {
    boardWall(c, t);
    const C0 = CARDS;
    thread(c, C0[0], C0[1]);
    const kr = o.threads ?? 0; thread(c, C0[1], C0[3], at(kr, 0, .5)); thread(c, C0[3], C0[2], at(kr, .4, .8)); thread(c, C0[3], C0[4], at(kr, .5, .9));
    C0.forEach(cd => { if (o.skip !== cd.id) cardDraw(c, t, cd, o.card && o.card[cd.id] || {}) });
    [C0[0], C0[1], C0[3], C0[2], C0[4]].forEach(cd => { if (!(o.card && o.card[cd.id] && o.card[cd.id].noPin)) pin(c, ...pinP(cd)) });
  }
  // ---------- переход от общежития к карточке 2020 (отъезд камеры) ----------
  function zoomOutTo2020(c, t, drawBoard) {
    const k = eio(at(t, K.b0, K.b0 + 1.35)), p = PH / 1040, [pcx, pcy] = photoC(CARDS[1]);
    const z = Math.exp(lp(Math.log(1 / p), 0, k)), F0 = [pcx - p * 80, pcy + p * 80], F = [lp(F0[0], 540, k), lp(F0[1], 960, k)];
    // если z меняется по экспоненте, а F — линейно, точка фото «плывёт»; поправка: держим фото там, где оно было бы при чистом отъезде
    c.save(); c.translate(540, 960); c.scale(z, z); c.translate(-F[0], -F[1]);
    drawBoard(c);
    const kc = at(k, 0, .45);   // фото: от всего кадра 8-й сцены до квадрата
    if (kc < 1) {
      const fx0 = pcx - 620 * p, fy0 = pcy - 880 * p, w0 = WW * p, h0 = HH * p, R = [lp(fx0, pcx - PH / 2, kc), lp(fy0, pcy - PH / 2, kc), lp(w0, PH, kc), lp(h0, PH, kc)];
      c.save(); c.beginPath(); c.rect(...R); c.clip(); c.translate(pcx, pcy); c.scale(p, p); c.translate(-620, -880); shot8(c, t); c.restore();
    }
    c.restore();
  }
  // ---------- концовка А (шортс): штамп, спуск к ноутбуку, зум в кадр 0 ----------
  const LAP = { x: 540, y: 2360, vw: 180, vh: 320 };   // прямоугольник видео на экране ноутбука (мир)
  let F0C = null;
  function firstFrameCanvas() { if (F0C) return F0C; F0C = mk(WW, HH); const g = F0C.getContext('2d'); firstFrame(g); return F0C }
  function deskWorld(c, t) {   // под доской: стол, лампа, силуэт со спины, ноутбук с роликом
    vgrad(c, -400, 1700, WW + 800, 1600, ['#3a2414', '#2a1a0f', '#1a100a']); c.fillStyle = '#4a2f1d'; c.fillRect(-400, 1700, WW + 800, 16);
    c.save(); c.translate(150, 1700); c.fillStyle = '#1f2937'; c.fillRect(-10, -420, 20, 420); c.save(); c.translate(0, -420); c.rotate(.5); rr(c, -14, -10, 240, 22, 10); c.fill(); c.translate(230, 0); c.rotate(.6); poly(c, [-50, -20, 50, -20, 80, 60, -80, 60]); fill(c, '#334155'); c.restore(); c.restore();
    beam(c, 330, 1440, 540, 2600, 50, 520, '#fde68a', .14); glow(c, 540, 2300, 700, '#fde68a', .10);
    // ноутбук
    const { x, y, vw, vh } = LAP, SW = 640, SH = 400;
    rr(c, x - SW / 2 - 18, y - SH / 2 - 18, SW + 36, SH + 36, 18); fill(c, '#111827');
    c.fillStyle = '#000'; c.fillRect(x - SW / 2, y - SH / 2, SW, SH);
    c.fillStyle = '#18181b'; c.fillRect(x - SW / 2, y - SH / 2, SW, 30); circ(c, x - SW / 2 + 20, y - SH / 2 + 15, 6, '#ef4444');
    c.drawImage(firstFrameCanvas(), x - vw / 2, y - vh / 2, vw, vh);
    c.fillStyle = '#3f3f46'; c.fillRect(x - SW / 2 + 20, y + SH / 2 - 22, SW - 40, 6); c.fillStyle = '#ef4444'; c.fillRect(x - SW / 2 + 20, y + SH / 2 - 22, (SW - 40) * .96, 6);
    poly(c, [x - SW / 2 - 60, y + SH / 2 + 18, x + SW / 2 + 60, y + SH / 2 + 18, x + SW / 2 + 140, y + SH / 2 + 110, x - SW / 2 - 140, y + SH / 2 + 110]); fill(c, '#374151');
    // силуэт со спины (капюшон, плечи) — слева, не заслоняет экран
    c.fillStyle = '#05060a'; c.beginPath(); c.ellipse(x - 420, y + 210, 230, 300, 0, Math.PI, TAU); c.fill(); c.fillRect(x - 650, y + 210, 460, 600); c.beginPath(); c.ellipse(x - 420, y - 40, 120, 140, 0, 0, TAU); c.fill();
    vignette(c, 0);
  }
  function endA(c, t) {
    const kd = eio(at(t, K.down0, K.down1)), kz = eio(at(t, K.zA0, K.endT));
    if (kz >= 1) { firstFrame(c); return }
    const drawAll = cc => { board(cc, t, { threads: at(t, K.rest - .1, K.rest + .9) }); stampYT(cc, t); deskWorld(cc, t) };
    if (t < K.b0 + 1.35) { zoomOutTo2020(c, t, drawAll); return }
    const Fy = lp(960, LAP.y, kd), z = Math.exp(lp(0, Math.log(HH / LAP.vh), kz));
    c.save(); c.translate(540, 960); c.scale(z, z); c.translate(-540, -Fy); drawAll(c); c.restore();
    vignette(c, .35 * (1 - kz));
  }
  function stampYT(c, t) {
    const k = at(t, K.yt - .05, K.yt + .3); if (k <= 0) return;
    const s = lp(2.4, 1, eo(k)), a = Math.min(1, k * 3);
    c.save(); c.translate(540, 1140); c.rotate(-.06); c.scale(s, s); c.globalAlpha = a;
    rr(c, -330, -48, 660, 96, 14); fill(c, 'rgba(220,38,38,.12)'); rr(c, -330, -48, 660, 96, 14); stroke(c, '#dc2626', 7);
    tx(c, '▶ ТОЛЬКО НА YOUTUBE', 0, 3, { f: 'U', w: 800, s: 44, c: '#dc2626' }); c.restore();
  }
  // ---------- концовка Б (мостик в 3-ю главу): криптекс 1·9·2·4 → помада → фото 1924 → зум ----------
  const C24 = CARDS[3];
  function cryptex(c, x, y, len, r, rings, o = {}) {   // золотой цилиндр: rings — значения 0…9.99 (дробное — прокрутка)
    c.save(); c.translate(x, y); c.rotate(r);
    const H = 95, g = c.createLinearGradient(0, -H / 2, 0, H / 2); g.addColorStop(0, '#fde68a'); g.addColorStop(.35, '#d4a017'); g.addColorStop(1, '#78530a');
    rr(c, -len / 2, -H / 2, len, H, 18); c.fillStyle = g; c.fill();
    if (rings) rings.forEach((v, i) => { const rx = -len / 2 + 60 + i * (len - 120) / 3; rr(c, rx - 30, -H / 2 - 6, 60, H + 12, 10); fill(c, '#b8860b'); c.save(); rr(c, rx - 26, -H / 2, 52, H, 8); c.clip(); const fl = Math.floor(v), fr = v - fl;
      [0, 1].forEach(j => tx(c, String((fl + j) % 10), rx, (j - fr) * 62, { f: 'U', w: 800, s: 40, c: '#3b2a05' })); c.restore() });
    [-1, 1].forEach(sd => { rr(c, sd > 0 ? len / 2 - 18 : -len / 2 - 22, -H / 2 - 10, 40, H + 20, 12); fill(c, '#a16207') });
    c.restore();
  }
  function lipstick(c, x, y, r, kcap, kout) {   // золотой футляр 1920-х (вертикальный), колпачок снимается, помада выкручивается
    c.save(); c.translate(x, y); c.rotate(r);
    const g = c.createLinearGradient(-48, 0, 48, 0); g.addColorStop(0, '#78530a'); g.addColorStop(.4, '#fde68a'); g.addColorStop(1, '#a16207');
    const bh = 110 * kout;
    if (bh > 0) { c.save(); c.beginPath(); c.moveTo(-30, -40); c.lineTo(-30, -40 - bh); c.lineTo(30, -40 - bh - 34); c.lineTo(30, -40); c.closePath(); fill(c, '#e11d48'); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(-24, -40 - bh, 8, bh); c.restore() }
    rr(c, -48, -50, 96, 230, 14); c.fillStyle = g; c.fill(); c.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 6; i++) c.fillRect(-48, -10 + i * 28, 96, 3);
    if (kcap < 1) { c.save(); c.translate(0, -kcap * 260); c.globalAlpha = 1 - kcap; rr(c, -50, -180, 100, 140, 16); c.fillStyle = g; c.fill(); c.restore() }
    c.restore();
  }
  function endB(c, t) {
    const kz1 = eio(at(t, K.b0 + 1.45, K.b0 + 2.6));   // доска → карточка 1924
    const kZ = eio(at(t, K.nezh - .2, K.ledi + 1.6));    // карточка → фото 3-й главы
    if (kZ >= 1) { ep3Frame(c, t); ep3Pill(c, 1); return }
    const p = PH / 1080, [pcx, pcy] = photoC(C24);
    const zc = 2.6, Fc = [540, C24.y + 5];
    const zE = 1 / p, FE = [pcx - p * 0, pcy + p * 100];
    let z = Math.exp(lp(0, Math.log(zc), kz1)), F = [lp(540, Fc[0], kz1), lp(960, Fc[1], kz1)];
    if (kZ > 0) { z = Math.exp(lp(Math.log(zc), Math.log(zE), kZ)); const u = (1 / z - 1 / zc) / (1 / zE - 1 / zc); F = [lp(Fc[0], FE[0], u), lp(Fc[1], FE[1], u)] }
    const wipe = at(t, K.vyv - .2, K.vyv + .7);
    const ops = { threads: 1, card: { '1924': { ep3: true, wipe: wipe > 0 ? wipe : undefined, noPin: t > K.vperv - .9, sub: 'MILD AS MAY · 1924', subA: at(t, K.vyv + .5, K.vyv + .9) } } };
    if (t < K.b0 + 1.35) { zoomOutTo2020(c, t, cc => board(cc, t, { threads: 1 })); return }
    c.save(); c.translate(540, 960); c.scale(z, z); c.translate(-F[0], -F[1]);
    board(c, t, ops);
    if (kZ > 0) {   // фото раскрывается из квадрата во весь кадр 3-й главы
      const kc = at(kZ, .55, 1), R = [lp(pcx - PH / 2, pcx - 540 * p, kc), lp(pcy - PH / 2, pcy - 860 * p, kc), lp(PH, WW * p, kc), lp(PH, HH * p, kc)];
      c.save(); c.beginPath(); c.rect(...R); c.clip(); c.translate(pcx, pcy); c.scale(p, p); c.translate(-540, -860); ep3Frame(c, t); c.restore();
    }
    // красный росчерк помады по карточке
    if (wipe > 0) A(c, 1 - at(kZ, 0, .4), () => { c.save(); c.strokeStyle = '#e11d48'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); const n = 20; for (let i = 0; i <= n * wipe; i++) { const u = i / n; c.lineTo(lp(pcx - 120, pcx + 120, u) + Math.sin(u * 9) * 6, lp(pcy - 150, pcy + 110, u)) } c.stroke(); c.restore() });
    c.restore();
    // криптекс и помада — в экранных координатах (над карточкой)
    const [sx, sy] = [(pinP(C24)[0] - F[0]) * z + 540, (pinP(C24)[1] - F[1]) * z + 960];
    const kp = eio(at(t, K.vperv - .9, K.vperv - .3)), kg = eo(at(t, K.vperv - .5, K.vperv + .1));
    const rl = i => { const k = eio(at(t, K.vperv + .15 + i * .32, K.vperv + .5 + i * .32)); return lp([2, 0, 2, 0][i] + 10, [1, 9, 2, 4][i] + 10 + (i === 1 ? 0 : 10), k) % 10 };
    const kv = eio(at(t, K.brut - .35, K.brut + .2)), kcap = eio(at(t, K.vek - .25, K.vek + .2)), kout = eo(at(t, K.vek + .1, K.vek + .5));
    const kexit = eio(at(t, K.vyv + .7, K.vyv + 1.15));
    if (kz1 > 0 && t >= K.vperv - .9 && kexit < 1) {
      if (kv <= 0) {
        if (kp < 1 && kg <= 0) { c.save(); c.translate(sx, sy); c.scale(lp(1, .3, kp), 1); circ(c, 0, 0, 14 * z * .7, '#dc2626'); c.restore() }
        cryptex(c, sx, sy, lp(80, 360, kg), 0, kg > .6 ? [0, 1, 2, 3].map(rl) : null);
      } else {
        // поворот вертикально → футляр помады, проходит по карточке наискось, уходит вправо
        const sw = eio(at(t, K.vyv - .2, K.vyv + .7)), [pcxS, pcyS] = [(pcx - F[0]) * z + 540, (pcy - F[1]) * z + 960];
        const lx = lp(lp(sx, pcxS - 330, kv), lp(pcxS - 330, pcxS + 330, sw), at(sw, 0, 1)) + kexit * 700, ly = lp(lp(sy, pcyS - 420, kv), pcyS + 300, sw) - kexit * 200;
        if (kv < 1) cryptex(c, lp(sx, lx, kv), lp(sy, ly, kv), 360, kv * Math.PI / 2, null);
        if (kv > .5) A(c, ss(.5, .8, kv), () => lipstick(c, lx, ly, lp(0, -.7, sw), kcap, kout));
      }
    }
  }
  function ep3Pill(c, a) { yearPill(c, 1924, 1924, 1, a) }
  // ================= время сцен по словам голоса =================
  function keys() {
    const w = Wd, k = {};
    k.morph0 = w('и'); k.shopSign = k.morph0 + 1.15; k.shopBox = k.morph0 + 1.25;
    k.truck0 = w('всё') - .15; k.truck1 = k.truck0 + 2.4;
    k.law = w('закон'); k.jan = w('январь'); k.chop = w('рубят'); k.mango = w('манго'); k.fru = w('фрукты'); k.des = w('десерты'); k.mint = w('мята'); k.knife = w('нож');
    k.s3 = w('но'); k.only = w('только'); k.cart = w('картриджами'); k.whole = w('цельные'); k.notm = w('упомянуты'); k.zoom0 = WdB('упомянуты') + .02; k.zoom1 = k.zoom0 + .75;
    k.juul2 = w('джул'); k.shen = w('шэньчжэне'); k.conv = w('конвейеры');
    k.s4 = w('puff bar'); k.puff = k.s4; k.hqd = w('hqd'); k.elf = w('elf bar'); k.vsego = w('всего'); k.par = w('парящих'); k.vyr = w('выросла'); k.x11 = w('одиннадцать');
    k.s5 = w('это') - .1; k.liq = w('жидкость'); k.ws = w('ws-23'); k.fool = w('обманывает'); k.ice = w('лёд');
    k.s6 = w('помните'); k.grew = w('разрослись'); k.mesh = w('двойная'); k.puffs = w('тысячи'); k.nicot = w('никотину'); k.n16 = w('шестнадцать');
    k.s7 = w('чтобы'); k.tube = w('пробирке'); k.noleaf = w('без'); k.leaf = w('листа'); k.when = w('когда'); k.bill = w('миллиарды'); k.market = w('рынок'); k.old = w('старые'); k.corp = w('корпорации');
    k.s8 = w('запретом');
    k.b0 = TLX.b0; k.endT = TLX.endT;
    if (MODE === 's') { k.rest = w('остальных'); k.yt = w('youtube'); k.down0 = WdB('youtube') + .2; k.down1 = k.down0 + 1.9; k.zA0 = k.endT - 2.3 }
    else { k.rules = w('правила'); k.vperv = w('впервой'); k.brut = w('брутальности'); k.vek = w('век'); k.vyv = w('выводили'); k.nezh = w('нежные'); k.ledi = w('леди') }
    return k;
  }
  function scene(c, t) {
    if (t < K.truck0) shot1(c, t);
    else if (t < K.s3 - .15) shot2(c, t);
    else if (t < K.s4 - .1) shot3(c, t);
    else if (t < K.s5 - .15) shot4(c, t);
    else if (t < K.s6 - .1) shot5(c, t);
    else if (t < K.s7 - .1) shot6(c, t);
    else if (t < K.s8 - .25) shot7(c, t);
    else shot8(c, t);
  }
  function hud(c, t) {   // плашка года
    if (t < K.grew - .3) yearPill(c, 2020, 2020, 1);
    else if (t < K.s7 - .2) yearPill(c, 2020, 2022, at(t, K.grew - .3, K.grew + .1));
    else if (t < K.market - .3) yearPill(c, 2022, 2021, at(t, K.s7 - .2, K.s7 + .2));
    else if (t < K.s8 - .25) yearPill(c, 2021, 2023, at(t, K.market - .3, K.market + .1));
    else if (t < K.s8 + .2) yearPill(c, 2023, 2023, 1, 1 - at(t, K.s8 - .25, K.s8 + .2));
  }
  function firstFrame(c) { shot1(c, 0); hud(c, 0) }   // кадр 0 — без субтитров
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (t >= K.b0) { if (MODE === 's') endA(c, t); else { endB(c, t); const kZ = at(t, K.nezh - .2, K.ledi + 1.6); if (kZ > .7 && kZ < 1) ep3Pill(c, at(kZ, .7, 1)) } }
    else { scene(c, t); hud(c, t) }
    subs(c, t);
  }
  // ================= звуки (только мягкие: без ding / tick / pin / swish) =================
  function cues() {
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    Q(.5, 'whoosh', .7); Q(.72, 'icecrack', .8); Q(K.morph0 + .1, 'whoosh', .8); Q(K.morph0 + .72, 'thud', .7); Q(K.morph0 + .7, 'snowroof', .5); Q(K.shopSign, 'neon', .5); Q(K.shopBox, 'papers', .25);
    Q(K.truck0, 'truck', 1); Q(K.jan - .2, 'deep', .6);
    Q(K.chop, 'blade', 1); Q(K.chop + .12, 'impact', .7); Q(K.chop + .15, 'splash', .9); Q(K.chop + .9, 'chain', .4);
    Q(K.s3 - .1, 'whoosh', .6); Q(K.s3 + .45, 'scroll', .9); Q(K.only, 'marker', .6); Q(K.whole - .05, 'papers', .4); Q(K.zoom0, 'whoosh', .8);
    Q(K.juul2 + .32, 'impact', .8); Q(K.juul2 + .35, 'thud', .6); Q(K.shen - .1, 'conveyor', .7);
    Q(K.s4, 'wave', 1); Q(K.puff, 'thud', .35, -.3); Q(K.hqd, 'thud', .35); Q(K.elf, 'thud', .35, .3); Q(K.vsego, 'whoosh', .7); Q(K.vsego + .45, 'papers', .5); Q(K.par, 'thud', .4, -.3); Q(K.vyr - .1, 'boom', .7);
    Q(K.s5 + .5, 'plop', .9); Q(K.s5 + .6, 'bubble', .5); Q(K.liq, 'whoosh', .6); Q(K.liq + .4, 'chain', .35); Q(K.ws, 'deep', .6); Q(K.ws + .1, 'pour', .4); Q(K.fool + .2, 'whoosh', .5); Q(K.ice - .3, 'icecrack', .9); Q(K.ice + .3, 'deep', .5);
    Q(K.s6 - .1, 'whoosh', .7); Q(K.grew - .1, 'chain', .5); Q(K.mesh - .25, 'pageflip', .8); Q(K.puffs - .25, 'pageflip', .8); Q(K.nicot - .2, 'whoosh', .6); Q(K.nicot + .3, 'thud', .5); Q(K.n16, 'coins', .35);
    Q(K.s7 - .1, 'whoosh', .6); Q(K.tube - .05, 'deep', .7); Q(K.tube, 'glassbulb', .6); Q(K.noleaf, 'leaves', .5); Q(K.when - .2, 'pour', .5); Q(K.bill - .5, 'whoosh', .7); Q(K.bill - .05, 'register', 1); Q(K.bill + .05, 'counter', .8); Q(K.market - .3, 'receipt', .6);
    Q(K.s8 - .2, 'whoosh', .6); Q(K.s8 + .25, 'thud', .5); Q(K.s8 + .4, 'city', .6);
    Q(K.b0, 'whoosh', .8); Q(K.b0 + 1.2, 'thud', .4);
    if (MODE === 's') { Q(K.rest - .1, 'marker', .4); Q(K.yt, 'stamp', 1); Q(K.down0, 'whoosh', .6); Q(K.zA0 + .3, 'dive', .7) }
    else { Q(K.b0 + 1.45, 'whoosh', .6); Q(K.vperv - .5, 'cryptex', .9); Q(K.vperv + .6, 'cryptex', .6); Q(K.brut - .4, 'lipstick', .9); Q(K.vyv - .2, 'marker', .7); Q(K.nezh - .2, 'dive', .8) }
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); const ep = String(tl.ep || '').replace(/-(ru|en|de)$/, '');
      MODE = /y$/.test(ep) ? 'y' : 's';
      TLX = { b0: tl.b0, endT: (Math.ceil(tl.dur * 30) - 1) / 30 };   // последний кадр ролика = endT (у шортса он равен кадру 0)
      K = keys(); window.__K = K; cues(); CHUNKS = buildChunks();
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v180f')) { const st = document.createElement('style'); st.id = 'v180f'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); CORK = null; F0C = null; for (const k in BLUR) delete BLUR[k];
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U'].map(f => document.fonts.load(f, 'АЯaz09$'))).then(() => 0);
    },
  };
})();
