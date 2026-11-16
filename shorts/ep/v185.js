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
  // ================= СЦЕНА 1: колпачок во льду → крыша ночного магазина «ВЕЙПЫ 24/7» =================
  // v18.1 (отзыв Андрея): надписи по-русски; вейп уходит вниз под ледяной пол (без прозрачности); город открывается
  // «диафрагмой» — ледяная студия сжимается в круг, который становится Луной; витрина загорается волной, снег, неон мигает,
  // две машины с фарами, камера медленно наезжает.
  const VP = { x: 540, y: 860, w: 180, h: 460 };
  function iceBg(c, t, base) {   // ледяная студия (рисуется с запасом — её видно и на экране ноутбука во всю ширину)
    if (base !== false) { c.fillStyle = '#0f172a'; c.fillRect(-2500, -2500, WW + 5000, HH + 5000) }   // общий фон с ночным городом
    const g = c.createRadialGradient(540, 860, 0, 540, 860, 980); g.addColorStop(0, '#0ea5e9'); g.addColorStop(.36, '#1e293b'); g.addColorStop(1, 'rgba(15,23,42,0)');
    c.fillStyle = g; c.beginPath(); c.arc(540, 860, 980, 0, TAU); c.fill();
    for (let i = 0; i < 4; i++) { const x0 = 120 + i * 300 + Math.sin(t * .4 + i) * 8; beam(c, x0, -60, 540 + (x0 - 540) * .25, 980, 40, 150, '#bae6fd', .07) }
    [300, 430, 580].forEach((r, i) => ring(c, 540, 860, r + Math.sin(t * .9 + i) * 3, rgba('#7dd3fc', .16 - i * .035), 3));
    c.save(); c.translate(540, 1150); c.scale(1, .22); const fg = c.createRadialGradient(0, 0, 0, 0, 0, 520); fg.addColorStop(0, 'rgba(186,230,253,.30)'); fg.addColorStop(1, 'rgba(186,230,253,0)');
    c.fillStyle = fg; c.beginPath(); c.arc(0, 0, 520, 0, TAU); c.fill(); c.restore();
    const vg = c.createLinearGradient(0, 1150, 0, 1920); vg.addColorStop(0, 'rgba(15,23,42,0)'); vg.addColorStop(1, 'rgba(8,14,30,.75)'); c.fillStyle = vg; c.fillRect(-2500, 1150, WW + 5000, 3000);
    const corner = (sx, sy) => { c.save(); c.translate(sx ? WW : 0, sy ? HH : 0); c.scale(sx ? -1 : 1, sy ? -1 : 1);
      for (let i = 0; i < 7; i++) { const a = .12 + H1(i * 3 + sx * 7 + sy * 11) * 1.2, L = 140 + H1(i + sx + sy * 5) * 240, w = 22 + H1(i * 9) * 30;
        c.save(); c.rotate(a); poly(c, [0, -w * .3, L, 0, 0, w]); fill(c, rgba('#e0f2fe', .10 + H1(i * 5) * .07)); poly(c, [0, -w * .3, L, 0, L * .5, -w * .1]); fill(c, rgba('#ffffff', .06)); c.restore() }
      c.restore() };
    corner(0, 0); corner(1, 0); corner(0, 1); corner(1, 1);
  }
  function crystal6(c, x, y, r, a = 1, rot = 0) {
    c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha *= a; c.strokeStyle = '#fff'; c.lineWidth = Math.max(1.5, r * .16); c.lineCap = 'round';
    for (let i = 0; i < 3; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-r, 0); c.lineTo(r, 0); c.stroke() }
    c.restore();
  }
  function disposable(c, x, y, o = {}) {   // корпус одноразки «МАНГО-ЛЁД»
    const w = o.w || VP.w, h = o.h || VP.h, s = o.s || 1;
    c.save(); c.translate(x, y); c.scale(s, s);
    if (o.sh !== false) { c.save(); c.translate(0, h / 2 + 14); c.scale(1, .16); circ(c, 0, 0, w * .75, 'rgba(0,0,0,.35)'); c.restore() }
    const g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#f59e0b'); g.addColorStop(.45, '#fbbf24'); g.addColorStop(.62, '#22d3ee'); g.addColorStop(1, '#06b6d4');
    rr(c, -w / 2, -h / 2, w, h, 36); c.fillStyle = g; c.fill();
    c.save(); c.clip(); c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(-w / 2 + 16, -h / 2, 22, h); c.fillStyle = 'rgba(15,23,42,.18)'; c.fillRect(w / 2 - 34, -h / 2, 34, h); c.restore();
    rr(c, -w / 2, -h / 2, w, h, 36); stroke(c, 'rgba(255,255,255,.55)', 3);
    rr(c, -w / 2 + 12, -44, w - 24, 88, 14); fill(c, '#ffffff');
    tx(c, 'МАНГО-', 0, -16, { f: 'U', w: 800, s: 25, c: '#ea580c', mw: w - 36 }); tx(c, 'ЛЁД', 0, 18, { f: 'U', w: 800, s: 30, c: '#0891b2' });
    circ(c, 0, h / 2 - 34, 9, '#e0f2fe'); glow(c, 0, h / 2 - 34, 26, '#7dd3fc', .8);
    if (o.frost !== false) [[-w / 2, -h * .32, 18], [w / 2, -h * .18, 14], [-w / 2, h * .05, 15], [w / 2, h * .2, 20], [-w / 2, h * .34, 13], [w / 2, -h * .4, 12]]
      .forEach(([fx, fy, r], i) => crystal6(c, fx + (fx < 0 ? 6 : -6), fy, r, .9, i));
    c.restore();
  }
  function capShape(c, x, y, w, h, o = {}) {   // белый колпачок / заснеженная крыша (k — сколько снега и сосулек)
    const k = o.k || 0;
    c.save(); c.translate(x, y);
    c.beginPath(); c.moveTo(-w / 2, h / 2); c.lineTo(-w / 2 * .82, -h / 2 + 18); c.quadraticCurveTo(-w / 2 * .8, -h / 2, -w / 2 * .7, -h / 2); c.lineTo(w / 2 * .7, -h / 2);
    c.quadraticCurveTo(w / 2 * .8, -h / 2, w / 2 * .82, -h / 2 + 18); c.lineTo(w / 2, h / 2); c.closePath();
    c.save(); c.translate(0, 8); fill(c, rgba('#bae6fd', .55)); c.restore();
    c.fillStyle = mixc('#f8fafc', '#e2e8f0', k * .3); c.fill(); stroke(c, '#bae6fd', 3);
    if (k > 0) {
      for (let i = 0; i < 9; i++) { const sx = -w * .38 + i * w * .095; circ(c, sx, -h / 2 + 4, (16 + H1(i) * 14) * (w / 780) * k + 4 * k, '#ffffff') }
      for (let i = 0; i < 16; i++) { const sx = -w / 2 + 22 + i * (w - 44) / 15, L = (18 + H1(i * 7) * 44) * ss(.4, 1, k) * (.6 + .4 * w / 780);
        if (L > 2) { poly(c, [sx - 7, h / 2 - 2, sx + 7, h / 2 - 2, sx, h / 2 + L]); fill(c, 'rgba(224,242,254,.92)') } }
    } else { c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(-w * .22, -h / 2 + 10, w * .1, h * .7) }
    c.restore();
  }
  function confetti(c, t, t0, x, y) {
    const k = t - t0; if (k < 0 || k > 2.6) return;
    for (let i = 0; i < 18; i++) {
      const ang = -Math.PI / 2 + (H1(i * 3) - .5) * 2.6, v = 520 + H1(i * 5) * 520, px = x + Math.cos(ang) * v * k, py = y + Math.sin(ang) * v * k + 480 * k * k, sz = 14 + H1(i) * 8, r = k * (2 + H1(i * 7) * 5);
      if (py > 1460) continue;
      c.save(); c.translate(px, py); c.rotate(r); const col = i % 3 ? '#e0f2fe' : '#38bdf8';
      if (i % 3 === 0) { poly(c, [0, -sz, sz * .6, 0, 0, sz, -sz * .6, 0]); fill(c, col) }
      else if (i % 3 === 1) { c.beginPath(); for (let j = 0; j < 6; j++) { const aa = j * TAU / 6; c[j ? 'lineTo' : 'moveTo'](Math.cos(aa) * sz * .7, Math.sin(aa) * sz * .7) } c.closePath(); fill(c, col) }
      else crystal6(c, 0, 0, sz * .7, 1);
      c.restore();
    }
  }
  function qIce(c, x, y, s, r = 0) { if (s <= 0) return; c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s); tx(c, '?', 0, 0, { f: 'U', w: 800, s: 180, c: '#38bdf8', sw: 10, sc: '#ffffff' }); c.restore() }
  // ---------- ночной город (сцены 1 и 8) ----------
  function skylineLayer(c, seed, base, hmin, hmax, col, winA, wcol, t) {
    let x = -160, i = 0;
    while (x < WW + 160) {
      const w = 70 + H1(seed + i) * 110, h = hmin + H1(seed + i * 3) * (hmax - hmin); c.fillStyle = col; c.fillRect(x, base - h, w + 2, h + 2);
      if (H1(seed + i * 13) > .6) { c.fillRect(x + w * .4, base - h - 40, 6, 40) }
      if (winA > 0) for (let yy = base - h + 18; yy < base - 18; yy += 26) for (let xx = x + 10; xx < x + w - 12; xx += 20) {
        const r = H1(seed * 7 + xx * .13 + yy * .71); if (r > .58) { c.fillStyle = rgba(r > .86 ? '#7dd3fc' : wcol, winA * (.45 + .5 * H1(r * 99 + Math.floor(t * .7 + r * 5)))); c.fillRect(xx, yy, 9, 13) }
      }
      x += w + 6; i++;
    }
  }
  function nightSky(c, t, o = {}) {
    vgrad(c, -400, -400, WW + 800, HH + 800, o.base ? ['#0f172a', '#0f1d3d', '#1e2b4f'] : ['#070b1a', '#0f1d3d', '#1e2b4f']);
    for (let i = 0; i < 70; i++) { const sx = H1(i * 3.3) * WW, sy = H1(i * 7.7) * 900, tw2 = .4 + .6 * Math.abs(Math.sin(t * (1 + H1(i)) + i)); circ(c, sx, sy, 1.2 + H1(i * 2) * 1.8, rgba('#ffffff', .55 * tw2)) }
    if (o.moon) { const { x, y, r } = o.moon; glow(c, x, y, r * 3.2, '#e0f2fe', .35); circ(c, x, y, r, '#f8fafc'); circ(c, x - r * .3, y - r * .2, r * .18, 'rgba(148,163,184,.25)'); circ(c, x + r * .25, y + r * .3, r * .12, 'rgba(148,163,184,.2)') }
    if (o.clouds) for (let i = 0; i < 4; i++) { const cx = ((H1(i * 5) * 1400 + t * 26 * (1 + i * .3)) % 1500) - 200, cy = 220 + i * 150; c.save(); c.globalAlpha = .22; [0, 70, 140].forEach((dx, j) => circ(c, cx + dx, cy + (j === 1 ? -22 : 0), 60 + j * 4, '#334155')); c.restore() }
  }
  function lamp(c, x, base, h) {
    c.fillStyle = '#1f2937'; c.fillRect(x - 7, base - h, 14, h); c.fillRect(x - 7, base - h, 70 * (Math.sign(540 - x) || 1), 10);
    const lx = x + 62 * Math.sign(540 - x); rr(c, lx - 26, base - h + 6, 52, 22, 8); fill(c, '#111827'); circ(c, lx, base - h + 30, 12, '#fde68a');
    beam(c, lx, base - h + 30, lx, base, 14, 150, '#fde68a', .22); c.save(); c.translate(lx, base + 4); c.scale(1, .2); glow(c, 0, 0, 170, '#fde68a', .35); c.restore();
  }
  function stele24(c, x, base, t) {   // неоновая стела заправки «АЗС · 24 ЧАСА»
    c.fillStyle = '#0b1324'; c.fillRect(x - 12, base - 520, 24, 520); rr(c, x - 74, base - 690, 148, 200, 14); fill(c, '#111c34');
    rr(c, x - 74, base - 690, 148, 200, 14); stroke(c, '#22d3ee', 4); glow(c, x, base - 590, 140, '#22d3ee', .22 + .05 * Math.sin(t * 6));
    tx(c, 'АЗС', x, base - 615, { f: 'U', w: 800, s: 46, c: '#a5f3fc' }); tx(c, '24 ЧАСА', x, base - 548, { f: 'O', w: 700, s: 24, c: '#67e8f9', ls: 2 });
  }
  function street(c, t) {
    vgrad(c, -400, 1310, WW + 800, 40, ['#475569', '#334155']); c.fillStyle = '#64748b'; c.fillRect(-400, 1310, WW + 800, 6);
    vgrad(c, -400, 1350, WW + 800, 900, ['#1e293b', '#0f172a', '#0b1120']);
    c.save(); c.setLineDash([60, 46]); c.lineDashOffset = -t * 30; c.strokeStyle = 'rgba(248,250,252,.7)'; c.lineWidth = 8; c.beginPath(); c.moveTo(-400, 1500); c.lineTo(WW + 400, 1500); c.stroke(); c.restore();
    [['#22d3ee', 260], ['#f472b6', 720], ['#fde68a', 120], ['#fde68a', 980]].forEach(([col, x], i) => { c.save(); c.translate(x, 1420 + i * 18); c.scale(1, .12); glow(c, 0, 0, 160, col, .22); c.restore() });
  }
  function car(c, x, y, dir, col) {   // легковая машина: кузов, окна, фары вперёд, стопы назад
    c.save(); c.translate(x, y); c.scale(dir, 1);
    beam(c, 140, -30, 560, -10, 12, 90, '#fde68a', .35);
    c.beginPath(); c.moveTo(-150, 0); c.lineTo(-150, -46); c.quadraticCurveTo(-140, -60, -96, -64); c.lineTo(-60, -104); c.lineTo(56, -104); c.lineTo(100, -64); c.quadraticCurveTo(146, -60, 150, -40); c.lineTo(150, 0); c.closePath(); fill(c, col);
    poly(c, [-50, -96, -6, -96, -6, -66, -80, -66]); fill(c, 'rgba(186,230,253,.55)'); poly(c, [4, -96, 50, -96, 86, -66, 4, -66]); fill(c, 'rgba(186,230,253,.55)');
    circ(c, -88, 0, 26, '#0b0f19'); circ(c, 92, 0, 26, '#0b0f19'); circ(c, -88, 0, 10, '#64748b'); circ(c, 92, 0, 10, '#64748b');
    circ(c, 146, -36, 8, '#fef9c3'); glow(c, 146, -36, 40, '#fde68a', .8); c.fillStyle = '#ef4444'; c.fillRect(-152, -44, 8, 12); glow(c, -150, -38, 30, '#ef4444', .5);
    c.restore();
  }
  function snow(c, t) {
    for (let i = 0; i < 80; i++) {
      const sp = 70 + H1(i * 4.1) * 90, x = (H1(i * 1.7) * 1300 + Math.sin(t * .8 + i) * 30) - 110, y = ((H1(i * 2.9) * 2000 + t * sp) % 2000) - 80, r = 2 + H1(i * 6.3) * 3.5;
      circ(c, x, y, r, rgba('#f8fafc', .45 + .4 * H1(i * 9)));
    }
  }
  function bush(c, x, y, s) {
    if (s <= 0) return; c.save(); c.translate(x, y); c.scale(s, s);
    [[-50, 0, 52], [0, -26, 62], [52, 0, 50], [0, 10, 58]].forEach(([dx, dy, r], i) => circ(c, dx, dy, r, i % 2 ? '#0f766e' : '#115e59'));
    [[-40, -30, 22], [10, -64, 24], [52, -26, 20]].forEach(([dx, dy, r]) => circ(c, dx, dy, r, 'rgba(224,242,254,.85)'));
    for (let i = 0; i < 5; i++) crystal6(c, -60 + i * 30, -10 + H1(i) * 30, 8, .8, i);
    c.restore();
  }
  const BOXC = ['#ec4899', '#f97316', '#34d399', '#a78bfa', '#f59e0b', '#22d3ee', '#fb7185', '#84cc16'];
  function vapeBox(c, x, y, w, h, col, o = {}) {
    c.save(); c.translate(x, y); if (o.r) c.rotate(o.r);
    rr(c, -w / 2, -h / 2, w, h, Math.min(10, w * .14)); fill(c, col); c.save(); c.clip(); c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(-w / 2, -h / 2, w * .3, h); c.fillStyle = 'rgba(0,0,0,.16)'; c.fillRect(w * .28, -h / 2, w * .22, h); c.restore();
    const ki = o.inner ?? 1; if (ki <= 0) { c.restore(); return }
    if (ki < 1) { c.translate(0, h * .1); c.scale(ki, ki); c.translate(0, -h * .1) }
    rr(c, -w * .22, -h * .32, w * .44, h * .56, w * .12); fill(c, 'rgba(255,255,255,.85)'); rr(c, -w * .12, -h * .26, w * .24, h * .44, w * .08); fill(c, col);
    if (o.label) { rr(c, -w * .46, h * .3, w * .92, h * .15, 6); fill(c, 'rgba(15,23,42,.55)'); tx(c, o.label, 0, h * .375, { f: 'O', w: 700, s: Math.max(10, w * .17), c: '#fff', mw: w * .84 }) }
    c.restore();
  }
  function shop(c, t, kc, roofH, roofY) {   // фасад разворачивается вниз из-под кромки крыши; витрина загорается волной
    if (kc <= 0) return;
    const top = roofY + roofH / 2 - 4, H = 1310 - top;
    c.save(); c.beginPath(); c.rect(150, top, 780, lp(0, 700, kc)); c.clip();
    vgrad(c, 170, top, 740, H, ['#1e293b', '#172033']);
    for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(255,255,255,.035)'; c.fillRect(170, top + 30 + i * 40, 740, 2) }
    const t0 = K.shopSign, fl = t < t0 ? 0 : t < t0 + .35 ? (Math.sin(t * 90) > 0 ? 1 : .25) : ((t - t0) % 2.3 < .18 ? (Math.sin(t * 70) > 0 ? 1 : .35) : 1);
    rr(c, 280, top + 18, 520, 92, 18); fill(c, '#0b1220'); rr(c, 280, top + 18, 520, 92, 18); stroke(c, rgba('#2dd4bf', .35 + .65 * fl), 5);
    glow(c, 540, top + 64, 320, '#2dd4bf', .25 * fl); tx(c, 'ВЕЙПЫ 24/7', 540, top + 66, { f: 'U', w: 800, s: 50, c: mixc('#134e4a', '#99f6e4', fl), mw: 470 });
    const wy = top + 150; rr(c, 220, wy, 640, 340, 10); fill(c, '#0c1426');
    c.save(); rr(c, 220, wy, 640, 340, 10); c.clip();
    const lit = at(t, K.shopBox, K.shopBox + 3.4); glow(c, 220 + 640 * lit, wy + 170, 380, '#38bdf8', .22 * Math.min(1, lit * 4));
    for (let r = 0; r < 3; r++) { c.fillStyle = '#334155'; c.fillRect(220, wy + 105 + r * 110, 640, 8);
      for (let i = 0; i < 8; i++) { const ti = K.shopBox + i * .42 + r * .09, kk = bo(at(t, ti, ti + .38)); if (kk <= 0) continue;
        const fla = 1 - at(t, ti, ti + .5); c.save(); c.translate(262 + i * 79, wy + 102 + r * 110); c.scale(kk, kk); if (fla > 0) glow(c, 0, -48, 70, '#fde68a', .6 * fla); vapeBox(c, 0, -48, 55, 95, BOXC[(i + r * 3) % 8]); c.restore() } }
    c.globalAlpha = .16; c.fillStyle = '#fff'; [[-60, 120], [180, 70], [420, 150]].forEach(([dx, w]) => { poly(c, [220 + dx, wy + 340, 220 + dx + w, wy + 340, 220 + dx + w + 200, wy, 220 + dx + 200, wy]); c.fill() });
    c.restore();
    rr(c, 220, wy, 640, 340, 10); stroke(c, '#94a3b8', 6);
    rr(c, 180, 1290, 720, 20, 4); fill(c, '#475569');
    c.restore();
  }
  const ROOF = { y: 560, w: 760, h: 110 };
  function cityScene(c, t, off) {   // ночной город: небо того же цвета, что фон студии, дома, улица, фонарь, стела, машины, кусты, магазин
    c.save(); c.translate(0, off);
    nightSky(c, t, { moon: { x: 880, y: 300, r: 74 }, clouds: true, base: true });
    skylineLayer(c, 3, 1320, 380, 900, '#16213d', .45, '#fde68a', t);
    skylineLayer(c, 11, 1320, 220, 560, '#1d2a4a', .7, '#fde68a', t);
    street(c, t); lamp(c, 100, 1316, 560); stele24(c, 975, 1316, t);
    [[K.morph0 + 2.45, -1, '#be123c'], [K.morph0 + 4.45, 1, '#1d4ed8']].forEach(([t0, dir, col]) => { const k = at(t, t0, t0 + 1.7); if (k > 0 && k < 1) car(c, dir < 0 ? lp(1350, -350, k) : lp(-350, 1350, k), dir < 0 ? 1455 : 1470, dir, col) });
    bush(c, 140, 1250, .9 * bo(at(t, K.shopBox + .2, K.shopBox + .6))); bush(c, 940, 1250, .9 * bo(at(t, K.shopBox + .3, K.shopBox + .7)));
    shop(c, t, eoB(at(t, K.tr1b, K.tr1b + .5)), ROOF.h, ROOF.y);
    snow(c, t);
    c.restore();
  }
  const eoB = k => k <= 0 ? 0 : bo(k);
  function shot1Old(c, t) {
    // 2.4–3.2: фон тот же (#0f172a); город с дорогой выезжает снизу вверх, вейп со свечением студии уезжает вниз,
    // колпачок растёт в крышу; 3.2–3.7 — из-под кромки крыши вниз разворачивается фасад «ВЕЙПЫ 24/7»
    const pu = (t - K.tr1a) / .8, p = cl(pu), s = 1 + .12 * eio(at(t, K.morph0 + 1.0, K.train1));
    c.fillStyle = '#0f172a'; c.fillRect(-2500, -2500, WW + 5000, HH + 5000);
    c.save(); c.translate(540, 1000); c.scale(s, s); c.translate(-540, -1000);
    if (p > 0) cityScene(c, t, 1600 * (1 - eo(p)));
    const dy = 1090 * Math.max(0, pu);   // vapeY = lerp(860, 1950, p) — и дальше вниз за кадр
    if (dy < 2100) {
      c.save(); c.translate(0, dy); iceBg(c, t, false);
      disposable(c, VP.x, VP.y);
      const kq = bo(at(t, .7, 1.25)); qIce(c, 540, lp(640, 470, kq), lp(.2, 1, Math.min(1, kq)) * (t > .7 ? 1 : 0), Math.sin(t * 2.2) * .06);
      c.restore();
      confetti(c, t, .72, 540, 600);
    }
    const kp = bo(at(t, .5, 1.3)), cy = lp(lp(585, 340, kp), ROOF.y, p), cw = lp(140, ROOF.w, p), ch = lp(95, ROOF.h, p);
    capShape(c, 540, cy, cw, ch, { k: ss(0, .25, p) });
    c.restore();
    if (p > 0) vignette(c, .45 * p);
  }

  // ================= v18.3 (16.11, проба): сцена 1 по Starbucks 0:00–0:05 (#011 + #136 + #137) =================
  // Как у Боба: ровный тёмный фон, всё — белыми контурами, один цвет заливки. Вейп подпрыгивает, колпачок слетает,
  // из горлышка встаёт «?» с конфетти (тормозят в воздухе); колпачок садится назад, корпус сплющивается в коробку,
  // колпачок — в плоскую крышу; коробка растёт в магазин (вывеска, маркизы, витрины), сугробы выпрыгивают пружиной.
  const S1 = { bg: '#262a40', ln: '#f1f5f9', ac: '#3b5d9a', gr: 1200, dim: '#3d4262', z: 1.38 };
  let LWK = 1, LOD = 0;   // v18.4: LWK — толщина линий при наезде камеры (не толстеют), LOD — детали коробок в витрине при наезде
  function lnS(c, w = 6, col = S1.ln) { c.strokeStyle = col; c.lineWidth = w * LWK; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke() }
  function dashDraw(c, k, L) { if (k < 1) c.setLineDash([L * cl(k), L + 10]) }   // линия рисуется по длине L
  function bricksS1(c, k) {
    if (k <= 0) return;
    [[300, 760], [790, 700], [250, 1010], [820, 960], [720, 1120]].forEach(([x, y], i) => {
      c.save(); c.translate(x, y); c.scale(k, k); c.beginPath();
      c.moveTo(-46, 0); c.lineTo(46, 0); c.moveTo(-30, 26); c.lineTo(54, 26); c.moveTo(-8, 0); c.lineTo(-8, 26); c.moveTo(24, 26); c.lineTo(24, 52); c.moveTo(-14, 52); c.lineTo(52, 52);
      if (i % 2) { c.moveTo(-46, -26); c.lineTo(10, -26); c.moveTo(-20, -26); c.lineTo(-20, 0) }
      lnS(c, 4, S1.dim); c.restore();
    });
  }
  function snowS1(c, t) {
    for (let i = 0; i < 46; i++) {
      const sp = 40 + H1(i * 4.1) * 50, x = H1(i * 1.7) * 1180 - 50 + Math.sin(t * .7 + i) * 18, y = ((H1(i * 2.9) * 2000 + t * sp) % 2000) - 60, r = 2 + H1(i * 6.3) * 2.6;
      if (i % 5) circ(c, x, y, r, rgba('#e2e8f0', .55)); else crystal6(c, x, y, 7, .6, t * .5 + i);
    }
  }
  function moonS1(c, t, k) {
    if (k <= 0) return; c.save(); c.translate(860, 430); c.scale(k, k);
    circ(c, 0, 0, 62, '#f1f5f9'); circ(c, -18, -10, 11, rgba(S1.dim, .5)); circ(c, 20, 18, 8, rgba(S1.dim, .45));
    c.restore();
  }
  function cloudS1(c, x, y, s, k) {   // облако контуром, рисуется по линии
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(s, s); c.beginPath();
    c.moveTo(-150, 0); c.lineTo(-90, 0); c.arc(-62, -6, 30, Math.PI, 0); c.arc(0, -22, 42, Math.PI, -.15); c.arc(56, -4, 26, -Math.PI * .9, 0); c.lineTo(150, 0);
    c.moveTo(-200, 18); c.lineTo(-120, 18);
    dashDraw(c, k, 620); lnS(c, 4, '#5b6185'); c.restore();
  }
  function questionS1(c, x, y, s, r) {   // «?» контуром
    if (s <= 0) return; c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.font = '800 300px U'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.strokeStyle = S1.ln; c.lineWidth = 7; c.strokeText('?', 0, 0);
    c.restore();
  }
  function confettiS1(c, t, t0, x, y, k) {   // #136: треугольники, крестики, точки, дуги — разлетаются и тормозят в воздухе
    const u = t - t0; if (u < 0 || k <= 0) return;
    const cols = ['#fb923c', '#5eead4', '#f1f5f9', '#f472b6', '#38bdf8'];
    for (let i = 0; i < 24; i++) {
      const ang = -Math.PI / 2 + (H1(i * 3.1) - .5) * 3.2, D = 170 + H1(i * 5.3) * 300, e = 1 - Math.exp(-5.5 * u);
      const px = x + Math.cos(ang) * D * e + Math.sin(u * 1.6 + i) * 10, py = y + Math.sin(ang) * D * e + 14 * u, sz = (9 + H1(i) * 9) * k, col = cols[i % 5];
      c.save(); c.translate(px, py); c.rotate(u * (1 + H1(i * 7) * 3) * (i % 2 ? 1 : -1)); c.beginPath();
      const ty = i % 4;
      if (ty === 0) { poly(c, [0, -sz, sz * .9, sz * .6, -sz * .9, sz * .6]); lnS(c, 4, col) }
      else if (ty === 1) { c.moveTo(-sz, -sz); c.lineTo(sz, sz); c.moveTo(sz, -sz); c.lineTo(-sz, sz); lnS(c, 4, col) }
      else if (ty === 2) circ(c, 0, 0, sz * .55, col);
      else { c.arc(0, 0, sz, Math.PI * .1, Math.PI * .9); lnS(c, 4, col) }
      c.restore();
    }
  }
  function vapeS1(c, t, x, yb, w, h, o) {   // корпус: контур, косая заливка снизу, значок-снежинка; o.dr — заливка «стекает», o.em — значок
    const top = yb - h, r = o.r;
    rr(c, x - w / 2, top, w, h, r); fill(c, S1.bg);
    c.save(); rr(c, x - w / 2, top, w, h, r); c.clip();
    const dy = h * (o.dr || 0);
    c.beginPath(); c.moveTo(x - w / 2 - 4, top + h * .05 + dy); c.lineTo(x - w * .18, top + dy);
    c.bezierCurveTo(x - w * .05, top + h * .55 + dy, x + w * .35, top + h * .75 + dy, x + w / 2 + 4, top + h * .93 + dy);
    c.lineTo(x + w / 2 + 4, yb + 4); c.lineTo(x - w / 2 - 4, yb + 4); c.closePath(); fill(c, S1.ac);
    c.restore();
    rr(c, x - w / 2, top, w, h, r); lnS(c, 6);
    const em = o.em ?? 1;
    if (em > 0) {
      c.save(); c.translate(x, top + h * .4); c.scale(em, em);
      circ(c, 0, 0, 46, S1.bg); ring(c, 0, 0, 46, S1.ln, 5); crystal6(c, 0, 0, 26, 1, 0);
      c.restore();
      tx(c, 'МАНГО · ЛЁД', x, top + h * .62, { f: 'U', w: 800, s: 22 * em, c: '#fb923c', a: em });
      circ(c, x, yb - 34, 7 * em, '#5eead4');
    }
  }
  function capS1(c, x, cy, w, h, rot) {   // колпачок / крыша: трапеция с ободком, левая половина залита
    c.save(); c.translate(x, cy); c.rotate(rot);
    const tw2 = w * .84;
    poly(c, [-w / 2, h / 2, -tw2 / 2, -h / 2, tw2 / 2, -h / 2, w / 2, h / 2]); fill(c, S1.bg);
    c.save(); poly(c, [-w / 2, h / 2, -tw2 / 2, -h / 2, tw2 / 2, -h / 2, w / 2, h / 2]); c.clip(); c.fillStyle = S1.ac; c.fillRect(-w / 2, -h / 2, w * .42, h); c.restore();
    poly(c, [-w / 2, h / 2, -tw2 / 2, -h / 2, tw2 / 2, -h / 2, w / 2, h / 2]); lnS(c, 6);
    c.beginPath(); c.moveTo(-w / 2 - 8, h / 2); c.lineTo(w / 2 + 8, h / 2); lnS(c, 6);
    c.restore();
  }
  function shopS1(c, t, x, top, w, yb, kd) {   // магазин: вывеска, маркизы, витрины (линии рисуются по kd), товар волной
    if (kd <= 0) return;
    const L = x - w / 2, kS = bo(at(kd, 0, .45)), kW = at(kd, .2, .8);
    // вывеска
    if (kS > 0) { c.save(); c.translate(x, top + 72); c.scale(kS, kS); rr(c, -220, -40, 440, 80, 6); fill(c, S1.bg); rr(c, -220, -40, 440, 80, 6); lnS(c, 5);
      const t0 = K.shopSign + .5, fl = t < t0 ? 1 : ((t - t0) % 2.6 < .16 ? (Math.sin(t * 70) > 0 ? 1 : .35) : 1);
      tx(c, 'ВЕЙПЫ 24/7', 0, 3, { f: 'U', w: 800, s: 48, c: mixc('#1f6f5c', '#34e0b3', fl) }); c.restore() }
    // маркизы и витрины
    const ww = (w - 120) / 3, wy = top + 175, wh = yb - wy - 50;
    for (let i = 0; i < 3; i++) {
      const wx = L + 30 + i * (ww + 30), kk = at(kW, i * .15, .55 + i * .15);
      if (kk <= 0) continue;
      c.save(); c.beginPath(); c.moveTo(wx, wy - 40);
      for (let j = 0; j < 4; j++) { const a = wx + j * ww / 4; c.arc(a + ww / 8, wy - 40, ww / 8, Math.PI, 0, true) }
      c.lineTo(wx + ww, wy - 66); c.lineTo(wx, wy - 66); c.closePath(); dashDraw(c, kk, 900); lnS(c, 5); c.restore();
      const H2 = i === 2 ? yb - wy : wh;   // правая — дверь до земли
      c.save(); c.beginPath(); c.rect(wx, wy, ww, H2); dashDraw(c, kk, 2 * (ww + H2)); lnS(c, 5); c.restore();
      if (kk >= 1) {
        c.save(); c.beginPath(); c.rect(wx + 3, wy + 3, ww - 6, H2 - 6); c.clip();
        poly(c, [wx + ww * .55, wy, wx + ww, wy, wx + ww, wy + H2 * .35, wx + ww * .2, wy + H2]); fill(c, rgba(S1.ac, .45));
        if (i < 2) for (let r = 0; r < 2; r++) {
          c.beginPath(); c.moveTo(wx, wy + 84 + r * 78); c.lineTo(wx + ww, wy + 84 + r * 78); lnS(c, 4, '#5b6185');
          for (let j = 0; j < 4; j++) { const ti = K.shopBox + (i * 8 + r * 4 + j) * .14, kb = bo(at(t, ti, ti + .32)); if (kb <= 0) continue;
            c.save(); c.translate(wx + 22 + j * (ww - 44) / 3, wy + 82 + r * 78); c.scale(kb, kb); rr(c, -11, -50, 22, 50, 7); fill(c, BOXC[(i * 4 + r * 2 + j) % 8]); if (LOD > 0) boxLOD(c, LOD, i * 8 + r * 4 + j); rr(c, -11, -50, 22, 50, 7); lnS(c, 3); c.restore() }
        }
        else { circ(c, wx + ww - 22, wy + H2 * .55, 6, S1.ln) }
        c.restore();
      }
    }
  }
  function moundS1(c, x, y, s, flip) {   // сугроб вместо куста — выпрыгивает пружиной
    if (s <= 0) return; c.save(); c.translate(x, y); c.scale(s * (flip ? -1 : 1), s); c.beginPath();
    c.moveTo(-96, 0); c.arc(-56, 0, 40, Math.PI, Math.PI * 1.75); c.arc(-4, -10, 48, Math.PI * 1.15, Math.PI * 1.85); c.arc(48, 0, 38, Math.PI * 1.3, 0); c.closePath();
    fill(c, '#dbeafe'); c.beginPath(); c.moveTo(-96, 0); c.arc(-56, 0, 40, Math.PI, Math.PI * 1.75); c.arc(-4, -10, 48, Math.PI * 1.15, Math.PI * 1.85); c.arc(48, 0, 38, Math.PI * 1.3, 0); lnS(c, 5);
    c.restore();
  }
  function shot1Old184(c, t) {   // v18.4 — заменён миром 1 (15-w1.js)
    const m0 = K.morph0, gr = S1.gr;
    c.fillStyle = S1.bg; c.fillRect(-2500, -2500, WW + 5000, HH + 5000);
    snowS1(c, t);
    const s = 1 + .06 * eio(at(t, m0 + 1.2, K.train1));
    c.save(); c.translate(540, 980); c.scale(s, s); c.translate(-540, -980);
    c.translate(540, 990); c.scale(S1.z, S1.z); c.translate(-540, -990);
    moonS1(c, t, bo(at(t, m0 + 1.0, m0 + 1.4)));
    const dc = t * 6; cloudS1(c, 250 + Math.sin(t * .2) * 12, 560, 1, at(t, m0 + .95, m0 + 1.6)); cloudS1(c, 760 + Math.sin(t * .25 + 1) * 12, 640, .8, at(t, m0 + 1.1, m0 + 1.75));
    bricksS1(c, 1 - eio(at(t, m0, m0 + .3)));
    const u1 = eio(at(t, m0, m0 + .4)), u2 = eio(at(t, m0 + .4, m0 + .85));
    // земля
    const gw = lp(lp(220, 340, u1), 440, u2); c.beginPath(); c.moveTo(540 - gw, gr); c.lineTo(540 + gw, gr); lnS(c, 5);
    // корпус → коробка → магазин
    let w = lp(lp(170, 520, u1), 600, u2), h = lp(lp(440, 230, u1), 460, u2), r = lp(46, 6, u1);
    let ox = 0, oy = 0, sx = 1, sy = 1;
    if (t > .12 && t < .62) oy = -140 * Math.sin(Math.PI * (t - .12) / .5);
    const ul = t - .62; if (ul > 0 && ul < 1.2) { sy = 1 - .1 * Math.exp(-7 * ul) * Math.cos(15 * ul) * Math.min(1, ul * 30); sx = 1 / sy }
    c.save(); c.translate(540 + ox, gr + oy); c.scale(sx, sy); c.translate(-540, -gr);
    const top = gr - h, mouth = top;
    // «?» встаёт из горлышка (за колпачком), потом уходит обратно
    const kq = bo(at(t, .95, 1.45)) * (1 - eio(at(t, m0 - .5, m0 - .12)));
    if (kq > 0.01) { c.save(); c.beginPath(); c.rect(-200, -400, 1480, mouth + 400); c.clip(); questionS1(c, 540, lp(mouth + 60, mouth - 190, kq) + Math.sin(t * 2.4) * 8, lp(.5, 1, kq), Math.sin(t * 1.7) * .07); c.restore() }
    vapeS1(c, t, 540, gr, w, h, { r, dr: eio(at(t, m0, m0 + .55)), em: 1 - eio(at(t, m0, m0 + .3)) });
    shopS1(c, t, 540, top, w, gr, at(t, m0 + .8, m0 + 1.6));
    // колпачок: слетает, висит, садится назад, растягивается в крышу
    const cw = lp(lp(150, 560, u1), 660, u2), ch = lp(70, 44, u1);
    const kup = bo(at(t, .85, 1.25)) * (1 - eio(at(t, m0 - .45, m0 - .08))), land = at(t, m0 - .08, m0 + .1);
    const cy = top - ch / 2 + 4 - 290 * kup + Math.sin(t * 2.1) * 10 * kup - 8 * Math.sin(Math.PI * land);
    capS1(c, 540, cy, cw, ch, (-.09 + Math.sin(t * 1.9) * .04) * kup);
    c.restore();
    confettiS1(c, t, .95, 540, mouth - 40, 1 - eio(at(t, m0 - .55, m0 - .2)));
    // сугробы — пружиной (#137)
    moundS1(c, 540 - 300 - 20, gr, spr(at(t, m0 + 1.0, m0 + 1.7)), false); moundS1(c, 540 + 300 + 30, gr, spr(at(t, m0 + 1.1, m0 + 1.8)), true);
    c.restore();
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
  // ================= v18.5 (16.11): МИР 1 — 0…21 с выпуска 2 одной камерой =================
  // Ледяная одноразка на подиуме в витрине → отъезд: ночной магазин «ВЕЙПЫ 24/7» → камера едет по улице к Капитолию
  // (вкусы на полке гаснут на «запретили») → нырок в окно Капитолия → лист закона: пустая клетка на «одного слова»,
  // печать FDA на «закон» → календарь «январь 2020» → вырезка «Джул» → рама с лезвием FDA: «рубят», вкусы вспыхивают
  // каждый на своём слове, на «нож» лезвие падает. Камера — одна кривая (camAt), слои с параллаксом, всё внахлёст.
  const W1 = { bg: '#262a40', ln: '#eef2f7', dim: '#3a3f5e', fac: '#2f3454', fac2: '#3a4066', ac: '#3b5d9a', ac2: '#26406c', ice: '#9fdcf7',
    red: '#e8445a', mint: '#5eead4', paper: '#f4efe4', ink: '#1e2340', inBg: '#2a2c47', warm: '#ffd479', road: '#20243a', walk: '#343a5c' };
  const CWIN = { x: 2700, y: -575, w: 140, h: 210 }, SHS = 0.14;   // окно Капитолия = центр листа закона; лист 1000×1500 в масштабе 0.1
  const LU = (u, v) => [CWIN.x + (u - 500) * SHS, CWIN.y + (v - 750) * SHS];
  let WK = null, KEYS1 = null, KA = null, KB = null, TIN = 99, TF0 = 99, TF1 = 99, SA = 0, SB = 0;
  const THE = .38, EMBW = { x: -32 * Math.sin(.38), y: -740 }, MEDW = { x: 2700, y: -895 }, ZA = 24, ZB = 12.5;   // эмблема вейпа ↔ медальон Капитолия
  function camW(t) {   // мир 1: до TF0 камера A (магазин → нырок в снежинку), после TF1 — камера B (медальон → Капитолий → окно → лист)
    if (t < TF0) return camObj(camAt(KA, t)); if (t > TF1) return camObj(camAt(KB, t));
    return { x: 0, y: 0, z: 30, r: 0, flip: (t - TF0) / (TF1 - TF0) };
  }
  function w1Init() {
    const w = Wd; WK = {
      ice: w('ледяная'), i: w('и'), prod: w('продают'), vk: w('вкусами'), am: w('америке'), zap: w('запретили'), y20: w('2020'), vse: w('всё'),
      odn: w('одного'), zab: w('забыли'), zak: w('закон'), jan: w('январь'), y20b: w('2020', 1), sk: w('скандала'), juul: w('джулом'), vl: w('власти'),
      usa: w('сша'), rub: w('рубят'), vk2: w('вкусами', 1), fl: [w('манго'), w('фрукты'), w('десерты'), w('мята')], pod: w('под'), nozh: w('нож'),
    };
    const k = WK, ln = Math.log, L = (t, u, v, z, r) => { const p = LU(u, v); return [t, p[0], p[1], ln(z), r] };
    TF0 = k.zap - .02; TF1 = TF0 + .75;
    const ex = EMBW.x, ey = EMBW.y;
    KA = [   // последний ключ — «за кадром» (после TF0 рисуется переворот): камера входит в него на ходу, а не с места
      [0, 0, -730, ln(2.05), -0.016], [k.ice, 4, -760, ln(2.26), -0.004], [k.i + .25, 16, -805, ln(1.22), 0.008], [k.prod + .2, 70, -860, ln(0.64), 0.012],
      [4.55, 40, -830, ln(0.58), 0.004], [5.3, lp(40, ex, .75), lp(-830, ey, .75), ln(3.6), 0.001], [TF0, ex, ey, ln(ZA), 0], [TF0 + .4, ex, ey, ln(ZA * 2.2), 0],
    ];
    KB = [   // первый ключ — тоже «за кадром»: из переворота камера выходит уже на ходу
      [TF1 - .4, MEDW.x, MEDW.y, ln(ZB * 2.2), 0], [TF1, MEDW.x, MEDW.y, ln(ZB), 0], [7.35, 2697, -840, ln(2.1), -0.006], [k.vse - .62, 2696, -760, ln(0.8), -0.008],
      [8.65, 2699, -640, ln(2.8), -0.004],
      L(k.odn + .5, 480, 720, 10.2, 0), L(k.zab + .45, 520, 620, 9.6, -0.004), L(k.zak + .45, 420, 660, 9.0, 0.004), L(k.jan + .55, 300, 880, 8.6, 0.01),
      L(k.y20b + 1.3, 340, 900, 8.3, 0.006), L(k.juul - .02, 700, 915, 7.9, 0.0), L(k.vl + .4, 520, 1100, 6.8, 0.006), L(k.rub + .12, 500, 1220, 7.7, 0.002),
      L(k.fl[0] - .05, 470, 1258, 8.15, -0.004), L(k.fl[3] + .1, 530, 1272, 8.4, 0.003), L(k.pod, 505, 1284, 8.6, 0.0), L(k.nozh + .8, 500, 1300, 9.15, 0.004),
    ];
    SA = (camAt(KA, TF0)[2] - camAt(KA, TF0 - .01)[2]) / .01; SB = (camAt(KB, TF1 + .01)[2] - camAt(KB, TF1)[2]) / .01;   // скорость зума на входе и выходе
    w2Words(); KB = KB.concat(w2Keys());
    KEYS1 = KB;
    TIN = 99;   // с этого кадра камера внутри окна: рисуем только интерьер (окно уже закрыло весь экран — шва нет)
    for (let f = Math.floor(k.vse * 30); f < (k.odn + 1) * 30; f++) {
      const cm = camW(f / 30), v = viewRect(cm);
      if (v.x0 > CWIN.x - CWIN.w / 2 + 2 && v.x1 < CWIN.x + CWIN.w / 2 - 2 && v.y0 > CWIN.y - CWIN.h / 2 + 2 && v.y1 < CWIN.y + CWIN.h / 2 - 2) { TIN = f / 30; break }
    }
    if (TIN > 98) throw new Error('v185: камера не заходит в окно целиком');
  }
  const W1END = () => K.scr0 + .45;
  // ---------- мелочи ----------
  function lnW(c, w, col = W1.ln) { c.strokeStyle = col; c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke() }
  function star4(c, x, y, r, a) { if (a <= 0 || r <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.beginPath(); c.moveTo(0, -r); c.quadraticCurveTo(r * .12, -r * .12, r, 0); c.quadraticCurveTo(r * .12, r * .12, 0, r); c.quadraticCurveTo(-r * .12, r * .12, -r, 0); c.quadraticCurveTo(-r * .12, -r * .12, 0, -r); fill(c, '#fff'); c.restore() }
  function snowCap(c, x0, x1, y, h, seed) {   // шапка снега кривыми по верху предмета
    c.beginPath(); c.moveTo(x0 - 6, y + 4); const n = Math.max(2, Math.round((x1 - x0) / 60));
    for (let i = 0; i < n; i++) { const xa = lp(x0, x1, i / n), xb = lp(x0, x1, (i + 1) / n), hh = h * (.6 + H1(seed + i) * .6); c.bezierCurveTo(xa + (xb - xa) * .2, y - hh, xb - (xb - xa) * .2, y - hh, xb, y) }
    c.lineTo(x1 + 6, y + 4); c.closePath(); fill(c, '#f8fbff');
  }
  function mound(c, x, y, w, h) { c.beginPath(); c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w * .32, y - h, x + w * .3, y - h * 1.1, x + w / 2, y); c.closePath(); fill(c, '#f1f6fc') }
  // ---------- одноразка-героиня: поворот в объёме, иней ползёт снизу ----------
  function vapeHero(c, t, x, y, th, frost) {
    const w = 180, h = 460, d = 64, cw = Math.cos(th), sw = d * Math.abs(Math.sin(th)), sd = th >= 0 ? 1 : -1, fw = w * cw, tot = fw + sw;
    const fx0 = sd > 0 ? -tot / 2 : -tot / 2 + sw, sx0 = sd > 0 ? fx0 + fw : -tot / 2;
    c.save(); c.translate(x, y);
    c.save(); c.translate(0, h / 2 + 6); c.scale(1, .2); circ(c, 0, 0, tot * .78, 'rgba(10,12,30,.45)'); c.restore();
    const body = () => { c.beginPath(); c.roundRect(-tot / 2, -h / 2, tot, h, 34) };
    body(); fill(c, W1.ac);
    c.save(); body(); c.clip();
    c.fillStyle = W1.ac2; c.fillRect(sx0, -h / 2, sw, h); dotsRect(c, sx0, -h / 2, sw, h, 12, 2.6, 'rgba(120,160,220,.45)');
    poly(c, [fx0, h / 2, fx0, h * .18, fx0 + fw, -h * .02, fx0 + fw, h / 2]); fill(c, '#4a6fb0');   // косая заливка
    poly(c, [fx0 + fw * .12, -h / 2, fx0 + fw * .26, -h / 2, fx0 + fw * .26, h / 2, fx0 + fw * .12, h / 2]); fill(c, 'rgba(255,255,255,.13)');   // блик
    if (frost > 0) {   // иней: светлая шапка снизу с зубчатым краем + кристаллы
      const fy = h / 2 - h * 1.05 * frost; c.beginPath(); c.moveTo(-tot, h / 2 + 4); c.lineTo(-tot, fy);
      for (let i = 0; i <= 14; i++) { const xx = lp(-tot / 2, tot / 2, i / 14), yy = fy + (i % 2 ? -18 : 10) * (.6 + H1(i * 3) * .6) + Math.sin(t * 2 + i) * 3; c.lineTo(xx, yy) }
      c.lineTo(tot, fy); c.lineTo(tot, h / 2 + 4); c.closePath(); c.fillStyle = 'rgba(205,236,255,.42)'; c.fill(); lnW(c, 3, 'rgba(255,255,255,.9)');
      for (let i = 0; i < 16; i++) { const yy = h / 2 - H1(i * 7.7) * h * .98; if (yy < fy) continue; const k = spr(cl((h / 2 - yy) / (h * 1.05) < frost ? (frost - (h / 2 - yy) / (h * 1.05)) * 6 : 0));
        crystal6(c, lp(-tot / 2 + 18, tot / 2 - 18, H1(i * 3.1)), yy, (9 + H1(i) * 9) * k, .95, i + t * .3) }
    }
    c.restore();
    body(); lnW(c, 5); c.beginPath(); c.moveTo(sx0 + (sd > 0 ? 0 : sw), -h / 2 + 30); c.lineTo(sx0 + (sd > 0 ? 0 : sw), h / 2 - 30); lnW(c, 3, 'rgba(238,242,247,.55)');
    // эмблема-снежинка и надпись — на лицевой грани (сжаты по cos)
    c.save(); c.translate(fx0 + fw / 2, -40); c.scale(cw, 1); circ(c, 0, 0, 50, W1.ink); ring(c, 0, 0, 50, W1.ln, 4); crystal6(c, 0, 0, 30, 1, t * .5);
    tx(c, 'МАНГО-ЛЁД', 0, 92, { f: 'U', w: 800, s: 27, c: '#f59e0b' }); c.restore();
    circ(c, fx0 + fw / 2, h / 2 - 34, 8, '#e0f2fe'); glow(c, fx0 + fw / 2, h / 2 - 34, 26, W1.ice, .8);
    // мундштук-колпачок: трапеция кривыми, видна верхняя грань эллипсом (объём)
    const mw = 112 * cw + sw * .6, mt = -h / 2 - 76, mx = (fx0 + fw / 2) * .7;
    c.beginPath(); c.moveTo(-mw / 2 + mx, -h / 2 + 6); c.lineTo(-mw * .36 + mx, mt + 10); c.quadraticCurveTo(mx, mt - 4, mw * .36 + mx, mt + 10); c.lineTo(mw / 2 + mx, -h / 2 + 6); c.closePath(); fill(c, W1.ln);
    c.save(); c.clip(); c.fillStyle = 'rgba(30,35,64,.16)'; c.fillRect(mx + (sd > 0 ? mw * .18 : -mw / 2), mt - 10, mw * .32, 100); c.restore();
    c.beginPath(); c.ellipse(mx, mt + 10, mw * .36, 9 * Math.abs(Math.sin(th)) + 3, 0, 0, TAU); fill(c, '#cfd8e6');
    c.restore();
  }
  function vapeSmall(c, x, yb, col, kf, g) {   // одноразка на полке
    const w = 56, h = 150; c.save(); c.translate(x, yb);
    c.beginPath(); c.roundRect(-w / 2, -h, w, h, 14); fill(c, kf > 0 ? mixc(mixc('#2b3050', col, kf), '#555a73', g) : '#2b3050');
    c.save(); c.clip(); poly(c, [-w / 2, 0, -w / 2, -h * .35, w / 2, -h * .55, w / 2, 0]); fill(c, 'rgba(255,255,255,' + (.18 * kf * (1 - g)) + ')'); c.restore();
    c.beginPath(); c.roundRect(-w / 2, -h, w, h, 14); lnW(c, 3);
    poly(c, [-18, -h, -11, -h - 24, 11, -h - 24, 18, -h]); fill(c, W1.ln);
    c.restore();
  }
  // ---------- дальние слои ----------
  function farLayer(c, t) {
    for (let i = 0; i < 60; i++) { const x = -1600 + H1(i * 5.1) * 4200, y = -1650 + H1(i * 2.7) * 900; circ(c, x, y, 2 + H1(i) * 2.5, rgba('#ffffff', .25 + .25 * Math.sin(t * 2 + i))) }
    circ(c, 260, -1120, 92, '#e9edf5'); ring(c, 260, -1120, 92, W1.ln, 4); circ(c, 230, -1140, 16, '#cdd5e3'); circ(c, 290, -1095, 11, '#cdd5e3'); glow(c, 260, -1120, 260, '#cfe3ff', .12);
    c.fillStyle = '#2d3250'; let x = -1700;
    for (let i = 0; x < 2700; i++) { const w = 120 + H1(i * 9.1) * 160, h = 380 + H1(i * 4.3) * 520; c.fillRect(x, -h, w + 2, h + 400);
      for (let j = 0; j < 6; j++) if (H1(i * 13 + j) > .55) { c.fillStyle = H1(i + j * 3) > .5 ? 'rgba(255,212,121,.35)' : 'rgba(120,140,200,.35)'; c.fillRect(x + 20 + (j % 2) * (w / 2 - 10), -h + 40 + Math.floor(j / 2) * 80, 18, 26); c.fillStyle = '#2d3250' }
      x += w + 26 + H1(i * 2.2) * 50 }
  }
  function midLayer(c, t) {
    let x = -1400;
    for (let i = 0; x < 4800; i++) {
      const w = 220 + H1(i * 3.3 + 1) * 260, h = 560 + H1(i * 6.1) * 640;
      c.beginPath(); c.rect(x, -h, w, h + 600); fill(c, '#31375a'); c.beginPath(); c.moveTo(x, 0); c.lineTo(x, -h); c.lineTo(x + w, -h); c.lineTo(x + w, 0); lnW(c, 3, 'rgba(238,242,247,.32)');
      snowCap(c, x, x + w, -h, 16, i * 11);
      for (let r = 0; r < 6; r++) for (let q = 0; q < 3; q++) if (H1(i * 31 + r * 7 + q) > .58) { c.beginPath(); c.roundRect(x + 30 + q * (w - 60) / 2.6, -h + 60 + r * 90, 30, 44, 4); fill(c, H1(i + r + q) > .6 ? 'rgba(255,212,121,.55)' : 'rgba(110,130,190,.4)') }
      x += w + 70 + H1(i * 8.8) * 120;
    }
  }
  // ---------- улица, магазин, фонари, машина ----------
  function streetW(c, t, v) {
    const x0 = v.x0 - 50, x1 = v.x1 + 50;
    c.fillStyle = W1.walk; c.fillRect(x0, 0, x1 - x0, 90); c.fillStyle = W1.road; c.fillRect(x0, 90, x1 - x0, 900);
    c.beginPath(); c.moveTo(x0, 0); c.lineTo(x1, 0); c.moveTo(x0, 90); c.lineTo(x1, 90); lnW(c, 4, 'rgba(238,242,247,.6)');
    for (let x = Math.floor(x0 / 260) * 260; x < x1; x += 260) { c.beginPath(); c.roundRect(x, 318, 130, 12, 6); fill(c, 'rgba(238,242,247,.5)') }
    for (let x = Math.floor(x0 / 420) * 420; x < x1; x += 420) mound(c, x + 140 + H1(x) * 80, 4, 150 + H1(x * 3) * 90, 34);
  }
  function lampW(c, x, t) {
    c.beginPath(); c.moveTo(x, 0); c.lineTo(x, -760); c.quadraticCurveTo(x, -820, x + 60, -820); c.lineTo(x + 110, -820); lnW(c, 9, W1.ln);
    beam(c, x + 110, -800, x + 110, 0, 18, 170, W1.warm, .1); poly(c, [x + 80, -830, x + 140, -830, x + 128, -800, x + 92, -800]); fill(c, W1.ln); glow(c, x + 110, -795, 90, W1.warm, .55);
    snowCap(c, x + 76, x + 144, -830, 12, x);
  }
  function carW(c, t) {
    const k = at(t, 3.4, 8.9); if (k <= 0 || k >= 1) return; const x = lp(-1500, 5200, k), y = 300, bob = Math.sin(t * 22) * 1.5;
    beam(c, x + 250, y - 40, x + 900, y - 30, 14, 120, W1.warm, .16);
    c.save(); c.translate(x, y + bob);
    c.beginPath(); c.moveTo(-240, 0); c.lineTo(-240, -70); c.quadraticCurveTo(-232, -96, -190, -100); c.lineTo(-120, -104); c.bezierCurveTo(-90, -170, 70, -172, 110, -104); c.lineTo(214, -96); c.quadraticCurveTo(250, -90, 252, -58); c.lineTo(252, 0); c.closePath();
    fill(c, W1.red); c.save(); c.clip(); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-260, -40, 520, 60); c.restore(); lnW(c, 5);
    c.beginPath(); c.moveTo(-96, -108); c.bezierCurveTo(-70, -156, 60, -158, 90, -108); c.closePath(); fill(c, '#9fb7e0'); lnW(c, 4);
    c.beginPath(); c.moveTo(0, -152); c.lineTo(0, -106); lnW(c, 4);
    [-140, 150].forEach(wx => { circ(c, wx, 0, 40, W1.ink); ring(c, wx, 0, 40, W1.ln, 5); circ(c, wx, 0, 14, W1.ln) });
    circ(c, 240, -60, 10, '#fff7d6'); glow(c, 240, -60, 40, W1.warm, .9); c.beginPath(); c.roundRect(-246, -66, 14, 16, 3); fill(c, '#ff6b6b');
    c.restore();
  }
  function shopW(c, t, v) {
    const k = WK, neonOn = t < k.prod - .4 ? 0 : t < k.prod ? (Math.sin((t - k.prod) * 70) > -.2 ? 1 : .2) : 1;
    c.beginPath(); c.rect(-950, -1700, 1900, 1700); fill(c, W1.fac); lnW(c, 5);
    c.beginPath(); c.rect(-980, -1760, 1960, 70); fill(c, W1.fac2); lnW(c, 5); snowCap(c, -985, 985, -1760, 26, 3);
    for (let i = 0; i < 26; i++) { const bx = -920 + H1(i * 4.4) * 1820, by = -1660 + H1(i * 2.9) * 1500; if (Math.abs(bx) < 540 && by > -1350) continue; if (bx > 560 && by > -1080) continue; if (bx < -560 && by > -1180 && by < -420) continue;
      c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + 60, by); c.moveTo(bx + 24, by + 22); c.lineTo(bx + 84, by + 22); lnW(c, 3, 'rgba(238,242,247,.22)') }
    // вывеска «ВЕЙПЫ 24/7»
    c.beginPath(); c.roundRect(-640, -1610, 1280, 190, 28); fill(c, '#1e2238'); lnW(c, 5);
    if (neonOn > .5) glow(c, 0, -1515, 640, W1.mint, .16 * neonOn);
    tx(c, 'ВЕЙПЫ 24/7', 0, -1512, { f: 'U', w: 800, s: 104, c: neonOn > .5 ? W1.mint : '#33485a', sw: neonOn > .5 ? 10 : 0, sc: rgba(W1.mint, .25) });
    // витрина: подиум под лучом, полки по бокам
    c.save(); c.beginPath(); c.rect(-500, -1330, 1000, 1110); c.fillStyle = '#22263d'; c.fill(); c.clip();
    for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(-500, -1330 + i * 128); c.lineTo(500, -1330 + i * 128); lnW(c, 2, 'rgba(238,242,247,.07)') }
    beam(c, 0, -1340, 0, -470, 40, 230, '#cfe8ff', .16); glow(c, 0, -720, 420, W1.ice, .22);
    const ord = (x, yy) => Math.abs(x) / 480 + (yy + 1100) / 2400;
    [-1, 1].forEach(sd => [-1040, -800, -560].forEach((yb, r) => {
      c.beginPath(); c.moveTo(sd * 270, yb); c.lineTo(sd * 495, yb); lnW(c, 6);
      [330, 430].forEach((ax, q) => { const xx = sd * ax, col = BOXC[(r * 4 + q * 2 + (sd > 0 ? 1 : 0)) % BOXC.length];
        const kf = eo(at(t, k.prod - .25 + ord(xx, yb) * .5, k.prod + .1 + ord(xx, yb) * .5)), g = eo(at(t, k.zap - .1 + (1 - (xx + 500) / 1000) * .45, k.zap + .25 + (1 - (xx + 500) / 1000) * .45));
        const pop = 1 + .14 * Math.sin(Math.PI * cl(at(t, k.vk - .3 + ord(xx, yb) * .4, k.vk + ord(xx, yb) * .4)));
        c.save(); c.translate(xx, yb); c.scale(pop, pop); vapeSmall(c, 0, 0, col, kf, g); c.restore() }) }));
    // подиум
    c.beginPath(); c.moveTo(-170, -470); c.lineTo(-170, -230); c.lineTo(170, -230); c.lineTo(170, -470); fill(c, W1.fac2); lnW(c, 5);
    c.save(); c.beginPath(); c.rect(-170, -470, 340, 240); c.clip(); for (let i = 0; i < 6; i++) { poly(c, [-170 + i * 80, -230, -140 + i * 80, -230, -10 + i * 80, -470, -40 + i * 80, -470]); fill(c, 'rgba(255,255,255,.06)') } c.restore();
    c.beginPath(); c.ellipse(0, -470, 170, 32, 0, 0, TAU); fill(c, '#4a5180'); lnW(c, 5);
    const calm = 1 - at(t, 4.3, 4.9), th = -.42 + .8 * ss(0, 3.2, t) + .05 * Math.sin(t * 1.3) * calm, fr = eo(at(t, .15, k.ice + .35));
    vapeHero(c, t, 0, -700 + Math.sin(t * 1.6) * 4 * calm, th, fr);
    // холод: короткие черты летят мимо, как у банки Колы
    const kc = at(t, .9, k.i + .6) * (1 - at(t, k.i + .6, k.prod)); if (kc > 0) for (let i = 0; i < 14; i++) {
      const yy = -1000 + H1(i * 3.3) * 620, sp = 260 + H1(i) * 280, ph = (t * sp + H1(i * 5) * 900) % 900, xx = (i % 2 ? 1 : -1) * (130 + ph * .4);
      A(c, kc * (1 - ph / 900), () => { c.beginPath(); c.moveTo(xx, yy); c.lineTo(xx + (i % 2 ? 1 : -1) * (40 + H1(i * 7) * 50), yy); lnW(c, 4, W1.ice) }) }
    [[-96, -900, .2], [100, -780, .45], [-70, -560, .7], [90, -980, 1.0]].forEach(([sx, sy, d0], i) => { const kk = at(t, k.ice - .25 + d0 * .4, k.ice + .25 + d0 * .4); star4(c, sx, sy, 34 * Math.sin(Math.PI * kk), 1) });
    // стекло витрины: блики едут быстрее камеры
    const gx = (v.x0 + v.x1) * .5 * .18, ga = 1 - at(1080 / (v.x1 - v.x0), 1.4, 3.5);
    [[-560, 150], [-160, 70], [260, 120]].forEach(([bx, bw]) => { poly(c, [bx - gx, -1330, bx + bw - gx, -1330, bx + bw - 520 - gx, -220, bx - 520 - gx, -220]); fill(c, 'rgba(255,255,255,' + (.05 * ga) + ')') });
    c.restore();
    c.beginPath(); c.rect(-500, -1330, 1000, 1110); lnW(c, 12); c.beginPath(); c.moveTo(-510, -220); c.lineTo(510, -220); lnW(c, 14, W1.fac2);
    // боковая витрина с коробками и дверь
    c.beginPath(); c.rect(-900, -1180, 330, 760); fill(c, '#262a42'); lnW(c, 8);
    for (let r = 0; r < 4; r++) for (let q = 0; q < 3; q++) { const bx = -870 + q * 104, by = -1140 + r * 180, col = BOXC[(r * 3 + q) % BOXC.length];
      const kf = eo(at(t, k.prod - .1 + (r + q) * .07, k.prod + .25 + (r + q) * .07)), g = eo(at(t, k.zap + .3 + (2 - q) * .06, k.zap + .6 + (2 - q) * .06));
      c.beginPath(); c.roundRect(bx, by, 84, 130, 10); fill(c, kf > 0 ? mixc(mixc('#2b3050', col, kf), '#555a73', g) : '#2b3050'); lnW(c, 3) }
    c.beginPath(); c.rect(590, -1080, 280, 1080); fill(c, '#3a3550'); lnW(c, 8); circ(c, 620, -520, 12, W1.ln);
    c.beginPath(); c.roundRect(640, -980, 180, 70, 12); fill(c, '#1e2238'); tx(c, 'ОТКРЫТО', 730, -944, { f: 'U', w: 800, s: 30, c: neonOn > .5 ? '#ff6b81' : '#4a3a4a' });
    snowCap(c, -910, -560, -1180, 14, 7); mound(c, -760, 0, 380, 60); mound(c, 300, 0, 300, 44); mound(c, 900, 0, 260, 40);
  }
  // ---------- Капитолий, флаг, окно в интерьер ----------
  function flagW(c, x, y, t) {
    const W = 230, H = 150, n = 26; c.beginPath(); c.moveTo(x, y + 360); c.lineTo(x, y - 20); lnW(c, 7); circ(c, x, y - 26, 9, W1.warm);
    for (let i = 0; i < n; i++) {
      const u0 = i / n, u1 = (i + 1) / n, o0 = Math.sin(t * 5 - u0 * 6) * 14 * u0, o1 = Math.sin(t * 5 - u1 * 6) * 14 * u1, xa = x + u0 * W, xb = x + u1 * W + .6;
      for (let s = 0; s < 7; s++) { poly(c, [xa, y + o0 + s * H / 7, xb, y + o1 + s * H / 7, xb, y + o1 + (s + 1) * H / 7, xa, y + o0 + (s + 1) * H / 7]); fill(c, s % 2 ? '#f4f1ea' : W1.red) }
      if (u0 < .42) { poly(c, [xa, y + o0, xb, y + o1, xb, y + o1 + H * .57, xa, y + o0 + H * .57]); fill(c, '#2d3e7a') }
    }
    for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) { const u = (q + .7) / 4.6 * .42, o = Math.sin(t * 5 - u * 6) * 14 * u; circ(c, x + u * W, y + o + (r + .7) / 4.6 * H * .57, 3.4, '#fff') }
  }
  function capitolW(c, t) {
    const X = CWIN.x;
    c.beginPath(); c.ellipse(X, -1150, 330, 370, 0, Math.PI, TAU); c.closePath(); fill(c, '#3a4066');
    c.save(); c.clip(); c.beginPath(); c.rect(X + 60, -1530, 300, 400); c.clip(); dotsRect(c, X + 60, -1530, 300, 400, 16, 3.2, 'rgba(20,24,44,.55)'); c.restore();
    for (let i = 1; i < 6; i++) { const a = Math.PI + i * Math.PI / 6; c.beginPath(); c.moveTo(X + Math.cos(a) * 330, -1150); c.quadraticCurveTo(X + Math.cos(a) * 200, -1150 - 300, X, -1520); lnW(c, 3, 'rgba(238,242,247,.4)') }
    c.beginPath(); c.ellipse(X, -1150, 330, 370, 0, Math.PI, TAU); lnW(c, 6); snowCap(c, X - 120, X + 120, -1500, 20, 41);
    c.beginPath(); c.rect(X - 46, -1600, 92, 80); fill(c, W1.fac2); lnW(c, 5); c.beginPath(); c.ellipse(X, -1600, 46, 30, 0, Math.PI, TAU); fill(c, W1.ln);
    flagW(c, X, -1960, t);
    c.beginPath(); c.rect(X - 330, -1150, 660, 200); fill(c, '#343a5e'); lnW(c, 5);
    for (let i = 0; i < 8; i++) { c.beginPath(); c.roundRect(X - 290 + i * 76, -1120, 36, 120, 18); fill(c, 'rgba(255,212,121,.45)'); lnW(c, 3) }
    poly(c, [X - 660, -800, X, -1040, X + 660, -800]); fill(c, '#3a4066'); lnW(c, 6); snowCap(c, X - 600, X + 600, -800, 0, 5);
    circ(c, MEDW.x, MEDW.y, 100, W1.ink); ring(c, MEDW.x, MEDW.y, 100, W1.ln, 6); starW(c, MEDW.x, MEDW.y, 60, 0);
    c.beginPath(); c.rect(X - 660, -800, 1320, 80); fill(c, W1.fac2); lnW(c, 6); snowCap(c, X - 670, X + 670, -800, 18, 9);
    c.beginPath(); c.rect(X - 620, -720, 1240, 560); fill(c, '#30365a'); lnW(c, 5);
    glow(c, CWIN.x, CWIN.y, 330, W1.warm, .2);
    [-570, -420, -270, -120, 120, 270, 420, 570].forEach(o => { c.beginPath(); c.rect(X + o - 26, -712, 52, 548); fill(c, '#e3e7f0'); c.save(); c.clip(); c.fillStyle = 'rgba(30,35,64,.22)'; c.fillRect(X + o + 6, -712, 20, 548); c.restore(); lnW(c, 4, W1.ink);
      c.beginPath(); c.rect(X + o - 36, -730, 72, 22); fill(c, W1.ln); lnW(c, 3, W1.ink); c.beginPath(); c.rect(X + o - 36, -176, 72, 18); fill(c, W1.ln); lnW(c, 3, W1.ink) });
    for (let s = 0; s < 4; s++) { c.beginPath(); c.rect(X - 640 - s * 40, -160 + s * 40, 1280 + s * 80, 40); fill(c, s % 2 ? '#3a4066' : '#434a74'); lnW(c, 3); snowCap(c, X - 640 - s * 40, X + 640 + s * 40, -160 + s * 40, 8, s * 3) }
    // окно — в нём уже виден лист закона на столе
    c.save(); c.beginPath(); c.rect(CWIN.x - CWIN.w / 2, CWIN.y - CWIN.h / 2, CWIN.w, CWIN.h); c.clip(); interiorW(c, t, null); c.restore();
    c.beginPath(); c.rect(CWIN.x - CWIN.w / 2, CWIN.y - CWIN.h / 2, CWIN.w, CWIN.h); lnW(c, 10);
    mound(c, X - 820, 0, 300, 70); mound(c, X + 820, 0, 320, 64);
  }
  // ---------- интерьер: стол и лист закона (координаты листа 1000×1500) ----------
  function interiorW(c, t, v) {
    const r = v || { x0: CWIN.x - 200, x1: CWIN.x + 200, y0: CWIN.y - 260, y1: CWIN.y + 260 };
    c.fillStyle = W1.inBg; c.fillRect(r.x0 - 10, r.y0 - 10, r.x1 - r.x0 + 20, r.y1 - r.y0 + 20);
    glow(c, CWIN.x, CWIN.y - 40, 220, W1.warm, .16);
    c.save(); c.translate(CWIN.x, CWIN.y); c.scale(SHS, SHS); c.translate(-500, -750); sheetW(c, t); scrollW(c, t); c.restore();
  }
  const CAL = { x: 60, y: 680, w: 400, h: 370 }, JU = { x: 745, y: 850, w: 360, h: 300 }, RIG = { l: 230, r: 770, top: 990, base: 1405 };
  const CARTS = [{ u: 105, n: 'ТАБАК', c: '#a8835a', side: 1 }, { u: 290, n: 'МАНГО', c: '#f97316' }, { u: 430, n: 'ФРУКТЫ', c: '#ec4899' }, { u: 570, n: 'ДЕСЕРТЫ', c: '#eab308' }, { u: 710, n: 'МЯТА', c: '#22c55e' }, { u: 895, n: 'МЕНТОЛ', c: '#67c7d9', side: 1 }];
  function sheetW(c, t) {
    const k = WK, I = W1.ink;
    c.beginPath(); c.rect(22, 30, 1000, 1500); fill(c, 'rgba(8,10,24,.35)');
    c.beginPath(); c.rect(0, 0, 1000, 1500); fill(c, W1.paper); lnW(c, 5, I);
    c.save(); c.beginPath(); c.rect(0, 0, 1000, 1500); c.clip(); dotsRect(c, 930, 0, 70, 1500, 14, 2.4, 'rgba(30,35,64,.10)'); c.restore();
    // шапка и строки — пишутся на подлёте
    const kH = eo(at(t, k.vse + .1, k.odn + .1));
    tx(c, 'FDA · США', 120, 60, { f: 'M', w: 800, s: 30, c: '#7b8098', al: 'left', a: kH });
    c.save(); c.beginPath(); c.rect(110, 70, 880 * kH, 120); c.clip(); tx(c, 'ЗАКОН О ВКУСАХ', 120, 125, { f: 'U', w: 800, s: 66, c: I, al: 'left' }); c.restore();
    c.beginPath(); c.moveTo(120, 182); c.lineTo(120 + 540 * kH, 182); lnW(c, 7, W1.red);
    for (let i = 0; i < 8; i++) {
      const v = 250 + i * 50, kl = eo(at(t, k.vse + .25 + i * .06, k.vse + .6 + i * .06)); if (kl <= 0) continue;
      if (i === 3) { c.beginPath(); c.roundRect(80, v - 9, 360 * kl, 18, 9); fill(c, '#c9ccd8'); c.beginPath(); c.roundRect(780, v - 9, 140 * kl, 18, 9); fill(c, '#c9ccd8'); continue }
      const L = 840 * (.55 + .45 * H1(i * 4.1)); c.beginPath(); c.roundRect(80, v - 9, L * kl, 18, 9); fill(c, '#c9ccd8');
    }
    calendarW(c, t);
    // пустая клетка: «одного слова» — мигает, «забыли вписать» — знак вопроса
    const kb = eo(at(t, k.odn - .3, k.odn + .1)); if (kb > 0) {
      const pul = 1 + .08 * Math.sin(Math.PI * cl(at(t, k.odn, k.odn + .35))) + .03 * Math.sin(t * 6) * at(t, k.odn, k.odn + .5) * (1 - at(t, k.zak, k.zak + .3));
      c.save(); c.translate(610, 400); c.scale(pul * kb, pul * kb); c.beginPath(); c.roundRect(-150, -34, 300, 68, 12); fill(c, 'rgba(232,68,90,.08)'); c.setLineDash([16, 12]); c.lineDashOffset = -t * 40; lnW(c, 5, W1.red); c.setLineDash([]);
      const kq = spr(at(t, k.zab - .05, k.zab + .45));
      if (kq <= .02) { const bl = .5 + .5 * Math.sin(t * 9); A(c, bl, () => { c.beginPath(); c.moveTo(-110, -22); c.lineTo(-110, 22); lnW(c, 6, I) }) }
      else { c.save(); c.scale(kq, kq); tx(c, '?', 0, 4, { f: 'U', w: 800, s: 64, c: W1.red }); c.restore() }
      c.restore();
    }
    // печать FDA на «закон» → на «январь» летит в календарь и становится красным кружком вокруг «2» (как печать-планета у Колы #010)
    const kS = at(t, k.zak - .2, k.zak); if (kS > 0) {
      const tA = k.jan - .05, tB = k.y20b + .02, kf = eio(at(t, tA, tB)), P0 = [330, 530], P1 = [470, 560], P2 = [CAL.x + 34 + 3 * 54, CAL.y + 140];
      const bx = (1 - kf) * (1 - kf) * P0[0] + 2 * kf * (1 - kf) * P1[0] + kf * kf * P2[0], by = (1 - kf) * (1 - kf) * P0[1] + 2 * kf * (1 - kf) * P1[1] + kf * kf * P2[1];
      let sc = kS < 1 ? lp(2.3, 1, ei(kS)) : 1 + .06 * Math.exp(-(t - k.zak) * 9) * Math.sin((t - k.zak) * 40);
      sc = lp(sc, .26, kf); if (t > tB) sc *= 1 + .18 * Math.exp(-(t - tB) * 8) * Math.sin((t - tB) * 30);
      const col = mixc(W1.ac, W1.red, kf), inn = 1 - kf;
      c.save(); c.translate(bx, by); c.rotate(-.18 + (1 - eo(kS)) * .5 + kf * TAU); c.scale(sc, sc); c.globalAlpha *= cl(kS * 3);
      ring(c, 0, 0, 92, col, lp(7, 19, kf));
      if (inn > .02) { c.save(); c.scale(inn, inn); ring(c, 0, 0, 74, col, 3); tx(c, 'FDA', 0, 4, { f: 'U', w: 800, s: 46, c: col }); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; circ(c, Math.cos(a) * 83, Math.sin(a) * 83, 4, col) } c.restore() }
      c.restore();
      const kr = at(t, k.zak, k.zak + .45); if (kr > 0 && kr < 1) ring(c, 330, 530, 92 + 110 * eo(kr), rgba(W1.ac, 1 - kr), 6 * (1 - kr));
    }
    juulW(c, t); rigW(c, t);
  }
  function calendarW(c, t) {
    const k = WK, I = W1.ink, { x, y, w, h } = CAL;
    c.beginPath(); c.rect(x + 10, y + 14, w, h); fill(c, 'rgba(30,35,64,.18)');
    const page = (mon, yr, off, nd) => {
      c.beginPath(); c.rect(x, y, w, h); fill(c, '#ffffff'); lnW(c, 4, I);
      c.beginPath(); c.rect(x, y, w, 76); fill(c, W1.red); lnW(c, 4, I); tx(c, mon + ' ' + yr, x + w / 2, y + 40, { f: 'U', w: 800, s: 34, c: '#fff' });
      ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'].forEach((d, i) => tx(c, d, x + 34 + i * 54, y + 102, { f: 'M', w: 800, s: 20, c: '#8a8fa6' }));
      for (let d = 1; d <= nd; d++) { const p = d - 1 + off, cx = x + 34 + (p % 7) * 54, cy = y + 140 + Math.floor(p / 7) * 46; if (cy > y + h - 14) continue; tx(c, String(d), cx, cy, { f: 'M', w: 700, s: 22, c: I }) }
    };
    page('ЯНВАРЬ', '2020', 2, 31);
    const kf = at(t, k.jan - .2, k.jan + .2);   // декабрьский лист улетает вверх — под ним январь
    if (kf < 1) { c.save(); c.beginPath(); c.rect(x - 40, y - 400, w + 80, h + 400); c.clip(); c.translate(0, y); c.scale(1, 1 - ei(kf) * 1.05); c.translate(0, -y); page('ДЕКАБРЬ', '2019', 6, 31); c.restore() }
    for (let i = 0; i < 4; i++) { c.beginPath(); c.roundRect(x + 52 + i * 98, y - 20, 16, 40, 8); fill(c, '#9aa1b8'); lnW(c, 3, I) }
  }
  function juulW(c, t) {
    const k = WK, I = W1.ink, ki = at(t, k.sk - .55, k.sk - .1); if (ki <= 0) return;
    const e = bo(ki), j = 1 + .22 * Math.sin(Math.PI * cl(at(t, k.juul - .05, k.juul + .3)));
    c.save(); c.translate(JU.x + (1 - e) * 520, JU.y); c.rotate(.06 + (1 - e) * .5);
    c.beginPath(); c.rect(-JU.w / 2 + 10, -JU.h / 2 + 14, JU.w, JU.h); fill(c, 'rgba(30,35,64,.18)');
    c.beginPath(); c.rect(-JU.w / 2, -JU.h / 2, JU.w, JU.h); fill(c, '#fffaf0'); lnW(c, 4, I);
    [[-150, -110, 300], [-150, -80, 220], [-150, 100, 260], [-150, 124, 190]].forEach(([bx, by, bw]) => { c.beginPath(); c.roundRect(bx, by - 7, bw, 14, 7); fill(c, '#cfd2dc') });
    c.save(); c.translate(0, 10); c.scale(j, j); c.rotate(-.08);
    if (t < k.vl - .15) { c.beginPath(); c.roundRect(-130, -22, 210, 44, 12); fill(c, '#a9b0c4'); lnW(c, 4, I);
      c.beginPath(); c.roundRect(76, -22, 58, 44, 10); fill(c, I); lnW(c, 4, I); circ(c, -100, 0, 6, '#7dd3fc') }
    else { c.beginPath(); c.roundRect(-130, -22, 264, 44, 12); c.setLineDash([14, 10]); lnW(c, 4, '#9aa0b5'); c.setLineDash([]) }
    c.restore();
    const ks = spr(at(t, k.sk - .05, k.sk + .45)); if (ks > 0) { c.save(); c.translate(36, -40); c.rotate(-.16); c.scale(ks, ks); c.beginPath(); c.roundRect(-118, -30, 236, 60, 10); lnW(c, 6, W1.red); tx(c, 'СКАНДАЛ', 0, 3, { f: 'U', w: 800, s: 36, c: W1.red }); c.restore() }
    c.restore();
  }
  function bladeV(t) {   // нижний край лезвия (координаты листа)
    const k = WK; let v = 1060;
    v = lp(v, 1160, ei(at(t, k.rub - .14, k.rub + .02))); if (t > k.rub + .02) v += 12 * Math.exp(-(t - k.rub) * 7) * Math.sin((t - k.rub) * 26);
    v = lp(v, 1335, ei(at(t, k.pod + .0, k.pod + .11))); if (t > k.pod + .11) v += 10 * Math.exp(-(t - k.pod) * 8) * Math.sin((t - k.pod) * 30);
    return v;
  }
  function rigW(c, t) {
    const k = WK, I = W1.ink, tc = k.pod + .07, vb = bladeV(t);
    c.beginPath(); c.rect(60, RIG.base, 880, 26); fill(c, '#3a4066'); lnW(c, 4, I);
    // картриджи: стоят на базе, вкус вспыхивает на своём слове
    CARTS.forEach((ct, i) => {
      const fi = ct.side ? -1 : i - 1, tw = fi >= 0 ? k.fl[fi] : k.vk2, kf = ct.side ? 1 : eo(at(t, tw - .08, tw + .25)), cutV = 1300 - (ct.u - RIG.l) / (RIG.r - RIG.l) * 30;
      const draw = (part) => cartW(c, t, ct, kf, part, cutV);
      if (ct.side || t < tc) draw(0);
      else {
        draw(1); const dt = t - tc, dir = ct.u < 500 ? -1 : 1;
        c.save(); c.translate(dir * (140 + fi * 30) * dt * 3, -560 * dt + 1500 * dt * dt); c.translate(ct.u, cutV); c.rotate(dir * (2.4 + fi * .4) * dt); c.translate(-ct.u, -cutV); draw(2); c.restore();
        for (let d = 0; d < 9; d++) { const a = -Math.PI / 2 + (H1(i * 9 + d) - .5) * 2.4, sp = 300 + H1(d * 3 + i) * 520, dx = Math.cos(a) * sp * dt, dy = Math.sin(a) * sp * dt + 1300 * dt * dt;
          if (dt < 1.2) circ(c, ct.u + dx, cutV + dy, (6 + H1(d + i * 4) * 8) * (1 - dt / 1.2), ct.c) }
        const kr = at(t, tc, tc + .35); if (kr < 1) { c.save(); c.translate(ct.u, cutV); c.scale(1, .35); ring(c, 0, 0, 30 + 90 * eo(kr), rgba(ct.c, 1 - kr), 8 * (1 - kr)); c.restore() }
      }
      const kl = ct.side ? 1 : spr(at(t, tw - .08, tw + .4)), lc = ct.side ? '#7b8098' : (kf > .5 ? ct.c : '#9aa0b5');
      c.save(); c.translate(ct.u, 1470); c.scale(.85 + .15 * kl, .85 + .15 * kl); tx(c, ct.n, 0, 0, { f: 'U', w: 800, s: 19, c: lc }); c.restore();
      if (!ct.side && kf > 0) { const kr = at(t, tw - .05, tw + .45); if (kr < 1) ring(c, ct.u, 1300, 50 + 90 * eo(kr), rgba(ct.c, (1 - kr) * .9), 7 * (1 - kr)) }
      if (ct.side) { const kc = spr(at(t, k.vk2 + .2 + (i ? .15 : 0), k.vk2 + .7 + (i ? .15 : 0))); if (kc > 0) { c.save(); c.translate(ct.u, 1150); c.scale(kc, kc); circ(c, 0, 0, 26, '#22c55e'); c.beginPath(); c.moveTo(-11, 1); c.lineTo(-3, 9); c.lineTo(12, -8); lnW(c, 6, '#fff'); c.restore() } }
    });
    // рама и лезвие
    [RIG.l, RIG.r].forEach(u => { c.beginPath(); c.rect(u - 14, RIG.top, 28, RIG.base - RIG.top); fill(c, '#8f98b3'); lnW(c, 4, I) });
    const tM0 = k.vl - .15, tM1 = k.vl + .5;
    if (t > tM0 && t < tM1) {   // «Джул» летит из вырезки и вытягивается в лезвие, уходит под перекладину
      const km = eio(at(t, tM0, tM1)), P0 = [746, 860], P1 = [690, 740], P2 = [500, 985];
      const mx = (1 - km) * (1 - km) * P0[0] + 2 * km * (1 - km) * P1[0] + km * km * P2[0], my = (1 - km) * (1 - km) * P0[1] + 2 * km * (1 - km) * P1[1] + km * km * P2[1];
      const Wm = lp(264, RIG.r - RIG.l - 28, km), Hm = lp(44, 150, km), pw = lp(58, 0, km), ct = lp(-1e4, RIG.top + 40, ss(.65, 1, km));
      c.save(); c.beginPath(); c.rect(-1e4, ct, 3e4, 3e4); c.clip(); c.translate(mx, my); c.rotate(lp(-.02, 0, km) + Math.sin(km * Math.PI) * .12);
      poly(c, [-Wm / 2, -Hm / 2, Wm / 2 - pw, -Hm / 2, Wm / 2 - pw, Hm / 2 - 30 * km, -Wm / 2, Hm / 2]); fill(c, mixc('#a9b0c4', '#d5dbe8', km)); lnW(c, 4, I);
      if (pw > 1) { c.beginPath(); c.rect(Wm / 2 - pw, -Hm / 2, pw, Hm); fill(c, I); lnW(c, 4, I) }
      c.restore();
    }
    c.save(); c.beginPath(); c.rect(RIG.l + 14, RIG.top + 40, RIG.r - RIG.l - 28, t < tM1 ? 0 : 600); c.clip();
    c.save(); c.translate(0, vb); poly(c, [RIG.l + 14, -150, RIG.r - 14, -150, RIG.r - 14, -30, RIG.l + 14, 0]); fill(c, '#d5dbe8');
    c.save(); c.clip(); poly(c, [RIG.l, -42, RIG.r, -72, RIG.r, -30, RIG.l, 0]); fill(c, '#f6f8fc'); dotsRect(c, RIG.l, -150, 540, 70, 14, 2.4, 'rgba(30,35,64,.14)'); c.restore();
    poly(c, [RIG.l + 14, -150, RIG.r - 14, -150, RIG.r - 14, -30, RIG.l + 14, 0]); lnW(c, 4, I);
    [RIG.l + 60, RIG.r - 60].forEach(u => circ(c, u, -112, 8, '#8f98b3'));
    c.restore(); c.restore();
    const ku = 1 + .1 * Math.sin(Math.PI * cl(at(t, k.usa - .05, k.usa + .35)));
    c.beginPath(); c.rect(RIG.l - 40, RIG.top - 20, RIG.r - RIG.l + 80, 64); fill(c, W1.ac); lnW(c, 4, I);
    c.save(); c.translate(500, RIG.top + 12); c.scale(ku, ku); tx(c, 'FDA · США', 0, 0, { f: 'U', w: 800, s: 32, c: '#fff' }); c.restore();
  }
  function cartW(c, t, ct, kf, part, cutV) {   // part: 0 — целиком, 1 — низ после среза, 2 — отрубленный верх
    const I = W1.ink, u = ct.u, w = 86, top = 1190, bot = RIG.base;
    c.save();
    if (part) { c.beginPath(); if (part === 1) c.rect(u - 80, cutV, 160, 400); else c.rect(u - 80, top - 80, 160, cutV - top + 80); c.clip() }
    poly(c, [u - 30, top + 40, u - 22, top, u + 22, top, u + 30, top + 40]); fill(c, I);
    c.beginPath(); c.roundRect(u - w / 2, top + 40, w, bot - top - 40, 14); fill(c, '#fbfaf6');
    c.save(); c.clip(); const lh = (bot - top - 70) * kf; c.fillStyle = ct.side ? mixc('#d9dde8', ct.c, .55) : ct.c; c.fillRect(u - w / 2, bot - 14 - lh, w, lh + 14);
    poly(c, [u - w / 2, bot, u - w / 2, bot - 70, u + w / 2, bot - 110, u + w / 2, bot]); fill(c, 'rgba(255,255,255,.22)'); c.fillStyle = 'rgba(30,35,64,.12)'; c.fillRect(u + w / 2 - 18, top + 40, 18, bot - top); c.restore();
    c.beginPath(); c.roundRect(u - w / 2, top + 40, w, bot - top - 40, 14); lnW(c, 4, I);
    c.restore();
    if (part === 1) { c.beginPath(); c.moveTo(u - w / 2, cutV); c.lineTo(u + w / 2, cutV); lnW(c, 5, ct.c) }
  }
  function starW(c, x, y, r, rot) {
    c.save(); c.translate(x, y); c.rotate(rot); c.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * .42 : r; c.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2) }
    c.closePath(); fill(c, '#ffffff'); c.restore();
  }
  // переворот монеты (Starbucks #019 / Кола #003): эмблема-снежинка на весь экран переворачивается и становится звездой медальона Капитолия
  function flipW(c, t, k) {
    c.fillStyle = W1.ink; c.fillRect(0, 0, WW, HH);
    const e = ss(0, 1, k), sx = Math.cos(Math.PI * e);
    c.save(); c.translate(540, 960);
    if (e < .5) { c.scale(Math.abs(sx) * Math.cos(THE), 1); crystal6(c, 0, 0, 30 * ZA * Math.exp(SA * ((t - TF0) - (t - TF0) ** 2 / (2 * ((TF1 - TF0) / 2)))), 1, t * .5) }
    else { c.scale(Math.abs(sx), 1); starW(c, 0, 0, 60 * ZB * Math.exp(SB * ((t - TF1) + (t - TF1) ** 2 / (2 * ((TF1 - TF0) / 2)))), 0) }
    c.restore();
  }
  // ---------- передний план ----------
  function snowFg(c, cam, t, a) {
    if (a <= 0) return;
    [[1.55, 20, 11, 1400, 7], [1.2, 26, 23, 1200, 4.5]].forEach(([p, n, seed, T, r0]) => fieldLayer(c, cam, p, n, seed, T, (c, X, Y, s, i) => {
      const r = Math.min(26, r0 * Math.pow(s, .35)); A(c, a * (.55 + .45 * H1(i)) * (r > 18 ? 1 - (r - 18) / 8 : 1), () => circ(c, X, Y, r, '#f8fbff')) }, t));
  }
  function dustFg(c, cam, t, a) {
    if (a <= 0) return;
    fieldLayer(c, cam, 1.3, 30, 77, 1300, (c, X, Y, s, i) => A(c, a * .28, () => circ(c, X, Y + Math.sin(t + i) * 10, 2 + H1(i) * 3.5, '#ffeec2')), t * .15);
  }
  function speedLines(c, cam, t) {   // черты скорости: сколько и какие — по настоящей скорости камеры
    const c2 = camW(t + 1 / 30), vx = (c2.x - cam.x) * cam.z, dz = Math.log(c2.z / cam.z);
    const kp = cl((Math.abs(vx) - 18) / 50), kz = cl((Math.abs(dz) - .05) / .1) * (cam.z < 6 ? 1 : 0);
    c.save();
    if (kp > 0) for (let i = 0; i < 16; i++) { const y = 140 + H1(i * 3.7) * 1500, L = 80 + H1(i) * 160, x = ((H1(i * 5.5) * 1300 - t * 2400 * Math.sign(vx)) % 1300 + 1300) % 1300 - 110;
      A(c, kp * .55, () => { c.beginPath(); c.moveTo(x, y); c.lineTo(x + L, y); lnW(c, 4, i % 3 ? '#1a1e33' : 'rgba(238,242,247,.6)') }) }
    if (kz > 0) for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + H1(i) * .2, r0 = 380 + ((t * 1600 + H1(i * 7) * 700) % 700);
      A(c, kz * .5, () => { c.beginPath(); c.moveTo(540 + Math.cos(a) * r0, 960 + Math.sin(a) * r0 * 1.4); c.lineTo(540 + Math.cos(a) * (r0 + 140), 960 + Math.sin(a) * (r0 + 140) * 1.4); lnW(c, 4, 'rgba(238,242,247,.55)') }) }
    c.restore();
  }
  // ---------- кадр мира ----------
  function shot1(c, t) {
    if (!KEYS1) w1Init();
    const cam = camW(t);
    c.save(); c.fillStyle = W1.bg; c.fillRect(0, 0, WW, HH);
    if (cam.flip !== undefined) flipW(c, t, cam.flip);
    else if (t < TIN) {
      const v = viewRect(cam);
      layer(c, cam, .3, c => farLayer(c, t));
      layer(c, cam, .62, c => midLayer(c, t));
      layer(c, cam, 1, c => {
        streetW(c, t, v);
        [1250, 1720].forEach(x => { if (x > v.x0 - 400 && x < v.x1 + 200) lampW(c, x, t) });
        if (v.x0 < 1000) shopW(c, t, v);
        if (v.x1 > 1900) capitolW(c, t);
        carW(c, t);
      });
      snowFg(c, cam, t, 1 - at(cam.z, 2.5, 6));
      speedLines(c, cam, t);
    } else {
      layer(c, cam, 1, c => interiorW(c, t, viewRect(cam)));
      dustFg(c, cam, t, at(t, TIN, TIN + .6));
      speedLines(c, cam, t);
    }
    c.restore();
  }
  // ================= v18.5: вложенные миры — одна камера на весь выпуск =================
  // Камера одна: ключи в координатах мира 1 (KB). Мир-ребёнок лежит в «окне» родителя (дыра в бумаге, колба, бак):
  // точка ребёнка (x, y) = родитель (ox + x·s, oy + y·s), зум ребёнка = зум родителя · s. Рисуем самый глубокий мир, в окне
  // которого целиком стоит камера (кадр tin — как TIN у окна Капитолия): шва нет, родитель рисует ребёнка через окно до этого.
  const NEST = {
    S: { par: null, ox: CWIN.x - 500 * SHS, oy: CWIN.y - 750 * SHS, s: SHS },   // лист закона (координаты листа)
    B: { par: 'S', ox: 720, oy: 2720, s: 150 / 700 },                           // карта: полка «Джула» → океан → Шэньчжэнь
    C: { par: 'B', ox: 150, oy: 575, s: 260 / 700 },                            // жидкость в столбике → горло → бак
    D: { par: 'C', ox: 1900, oy: -3500, s: .5 },                                 // пузырь в баке одноразки → колба → касса → корпорации
  };
  const TINW = { B: 99, C: 99, D: 99 };
  function nestUp(id, x, y, lz) {   // точка и ln-зум мира id → мир 1
    for (let n = NEST[id]; n; n = NEST[n.par]) { x = n.ox + x * n.s; y = n.oy + y * n.s; lz -= Math.log(n.s); if (!n.par) break }
    return [x, y, lz];
  }
  function camIn(id, cm) {   // камера мира 1 → камера мира id
    const ch = []; for (let n = id; n; n = NEST[n].par) ch.unshift(n);
    let { x, y, z, r } = cm; for (const n of ch) { const q = NEST[n]; x = (x - q.ox) / q.s; y = (y - q.oy) / q.s; z *= q.s }
    return { x, y, z, r };
  }
  const KW = (id, t, x, y, z, r = 0) => { const p = nestUp(id, x, y, Math.log(z)); return [t, p[0], p[1], p[2], r] };
  function scanTin(id, par, rect, t0, t1) {   // первый кадр, когда камера (в координатах родителя) целиком в окне
    for (let f = Math.floor(t0 * 30); f < t1 * 30; f++) {
      const cm = par === 'W' ? camW(f / 30) : camIn(par, camW(f / 30)), v = viewRect(cm);
      if (v.x0 > rect.x0 && v.x1 < rect.x1 && v.y0 > rect.y0 && v.y1 < rect.y1) return f / 30;
    }
    throw new Error('v185: камера не заходит в окно мира ' + id);
  }
  // общий передний план любого мира: черты скорости по настоящей скорости камеры (в своих координатах)
  function speedLoc(c, cm, cm2, t, col = 'rgba(238,242,247,.55)') {
    const vx = (cm2.x - cm.x) * cm.z, vy = (cm2.y - cm.y) * cm.z, dz = Math.log(cm2.z / cm.z);
    const kp = cl((Math.hypot(vx, vy) - 22) / 50), kz = cl((Math.abs(dz) - .05) / .1);
    c.save();
    if (kp > 0) { const a = Math.atan2(vy, vx); for (let i = 0; i < 14; i++) {
      const L = 90 + H1(i) * 170, off = ((H1(i * 5.5) * 2400 - t * 2600) % 2400 + 2400) % 2400 - 1200, side = (H1(i * 3.7) - .5) * 1900;
      const cx = 540 + Math.cos(a) * off - Math.sin(a) * side, cy = 960 + Math.sin(a) * off + Math.cos(a) * side;
      A(c, kp * .5, () => { c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx - Math.cos(a) * L, cy - Math.sin(a) * L); lnW(c, 4, col) }) } }
    if (kz > 0) for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + H1(i) * .2, r0 = 380 + ((t * 1600 * Math.sign(dz) + H1(i * 7) * 700) % 700 + 700) % 700;
      A(c, kz * .45, () => { c.beginPath(); c.moveTo(540 + Math.cos(a) * r0, 960 + Math.sin(a) * r0 * 1.4); c.lineTo(540 + Math.cos(a) * (r0 + 140), 960 + Math.sin(a) * (r0 + 140) * 1.4); lnW(c, 4, col) }) }
    c.restore();
  }
  // ---------- мир S: лист закона «разворачивается» вниз — указ, картридж, пустой контур одноразки → дыра ----------
  let W2 = null;   // время слов мира 2
  function w2Words() {
    const w = Wd; W2 = {
      s3: w('но'), razv: w('разверните'), doc: w('документ'), zap: w('запрет'), prop: w('прописали'), only: w('только'), veip: w('вейпов'),
      smen: w('сменными'), cart: w('картриджами'), cel: w('цельные'), odr: w('одноразовые'), tam: w('там'), prosto: w('просто'), upom: w('упомянуты'),
      poka: w('пока'), juul: w('джул'), ubir: w('убирал'), vkus: w('вкусы'), polok: w('полок'), shen: w('шэньчжэне'), uzhe: w('уже'), zapusk: w('запускали'),
      conv: w('конвейеры'), puff: w('puff bar'), hqd: w('hqd'), elf: w('elf bar'), odn: w('одноразки'), nakr: w('накрыли'), amer: w('америку'), voln: w('волной'),
      vsego: w('всего'), god: w('год'), dolya: w('доля'), par: w('парящих'), star: w('старшеклассников'), vyr: w('выросла'), x11: w('одиннадцать'), raz: w('раз'),
    };
  }
  const RB = t => 1500 + 1720 * eio(at(t, W2.razv - .05, W2.doc + .8));   // где сейчас валик (низ развёрнутого листа)
  const SHOLE = { u: 720, v: 2720, w: 150, h: 360, r: 34 };
  function holePathS(c) { c.beginPath(); c.roundRect(SHOLE.u - SHOLE.w / 2, SHOLE.v - SHOLE.h / 2, SHOLE.w, SHOLE.h, SHOLE.r) }
  function scrollW(c, t) {   // продолжение листа ниже 1500 (координаты листа)
    if (!W2) w2Words();
    const k = W2, I = W1.ink, rb = RB(t);
    if (rb > 1502) {
      c.beginPath(); c.rect(22, 1500, 1000, rb - 1500 + 20); fill(c, 'rgba(8,10,24,.35)');
      c.beginPath(); c.rect(0, 1490, 1000, rb - 1490); fill(c, W1.paper);
      c.beginPath(); c.moveTo(0, 1500); c.lineTo(0, rb); c.moveTo(1000, 1500); c.lineTo(1000, rb); lnW(c, 5, I);
      c.save(); c.beginPath(); c.rect(0, 1500, 1000, rb - 1530); c.clip(); dotsRect(c, 930, 1500, 70, 1800, 14, 2.4, 'rgba(30,35,64,.10)'); decreeW(c, t); c.restore();
    }
    // валик: бумага намотана, торцы — тёмное дерево, полоски крутятся по мере размотки
    c.save(); c.translate(0, rb);
    c.beginPath(); c.roundRect(-34, -30, 1068, 60, 30); fill(c, '#e9e1cf'); lnW(c, 5, I);
    c.save(); c.beginPath(); c.roundRect(-34, -30, 1068, 60, 30); c.clip();
    for (let i = 0; i < 6; i++) { const ph = ((rb * .9 / 60 + i / 6) % 1); const yy = -30 + 60 * ph; c.beginPath(); c.moveTo(-40, yy); c.lineTo(1040, yy); lnW(c, 2, rgba('#9a8f78', Math.sin(Math.PI * ph) * .6)) }
    c.restore();
    [-34, 1034].forEach(x => { c.beginPath(); c.ellipse(x, 0, 16, 38, 0, 0, TAU); fill(c, '#7a4e33'); lnW(c, 4, I) });
    c.restore();
  }
  function decreeW(c, t) {
    const k = W2, I = W1.ink;
    const kh = eo(at(t, k.razv + .3, k.doc + .3));
    tx(c, 'FDA · США', 80, 1575, { f: 'M', w: 800, s: 28, c: '#7b8098', al: 'left', a: kh });
    c.save(); c.beginPath(); c.rect(70, 1590, 880 * kh, 90); c.clip(); tx(c, 'УКАЗ · ЯНВАРЬ 2020', 80, 1636, { f: 'U', w: 800, s: 54, c: I, al: 'left' }); c.restore();
    c.beginPath(); c.moveTo(80, 1688); c.lineTo(80 + 520 * kh, 1688); lnW(c, 7, W1.red);
    [[1745, 760], [1785, 620]].forEach(([v, L], i) => { const kl = eo(at(t, k.doc + i * .08, k.doc + .4 + i * .08)); if (kl > 0) { c.beginPath(); c.roundRect(80, v - 9, L * kl, 18, 9); fill(c, '#c9ccd8') } });
    // «запрет прописали только…»: строка пишется, «ТОЛЬКО» — маркером
    const kz = eo(at(t, k.zap - .15, k.prop + .3)), o1 = { f: 'M', w: 800, s: 44, c: I, al: 'left' }, w1 = tw(c, 'ПОД ЗАПРЕТ ПОПАДАЮТ ', o1), w2 = tw(c, 'ТОЛЬКО:', o1);
    const km = eio(at(t, k.only - .12, k.only + .3)); if (km > 0) { c.beginPath(); c.roundRect(80 + w1 - 8, 1868 - 30, (w2 + 16) * km, 62, 10); fill(c, '#fde047') }
    c.save(); c.beginPath(); c.rect(70, 1820, (w1 + w2 + 30) * kz, 100); c.clip(); tx(c, 'ПОД ЗАПРЕТ ПОПАДАЮТ ТОЛЬКО:', 80, 1870, o1); c.restore();
    const kv = eo(at(t, k.only + .1, k.veip + .2)), o2 = { f: 'M', w: 800, s: 40, c: I, al: 'left' };
    c.save(); c.beginPath(); c.rect(70, 1925, 900 * kv, 130); c.clip(); tx(c, '• ВЕЙПЫ СО СМЕННЫМИ', 80, 1965, o2); tx(c, 'КАРТРИДЖАМИ', 116, 2020, o2); c.restore();
    const ku = eio(at(t, k.veip, k.cart + .35)); if (ku > 0) { c.beginPath(); c.moveTo(80, 1992); c.lineTo(80 + 470 * cl(ku * 2), 1992); if (ku > .5) { c.moveTo(116, 2047); c.lineTo(116 + 320 * cl(ku * 2 - 1), 2047) } lnW(c, 6, W1.red) }
    // вейп с картриджем: на «сменными» картридж выскакивает, на «картриджами» щёлкает обратно
    const ka = bo(at(t, k.veip - .2, k.veip + .3)); if (ka > 0) {
      const pop = 95 * (eo(at(t, k.smen - .05, k.smen + .25)) - eio(at(t, k.cart, k.cart + .22))) + (t > k.cart + .22 ? 10 * Math.exp(-(t - k.cart - .22) * 9) * Math.sin((t - k.cart - .22) * 40) : 0);
      c.save(); c.translate(470, 2210); c.scale(ka, ka); c.rotate(-.04);
      c.beginPath(); c.roundRect(-250 + 12, -36 + 14, 380, 72, 30); fill(c, 'rgba(30,35,64,.18)');
      c.beginPath(); c.roundRect(-250, -36, 380, 72, 30); fill(c, '#a9b0c4'); lnW(c, 5, I);
      c.save(); c.beginPath(); c.roundRect(-250, -36, 380, 72, 30); c.clip(); c.fillStyle = '#c7ccda'; c.fillRect(-250, -36, 380, 20); dotsRect(c, -250, 10, 380, 26, 12, 2.2, 'rgba(30,35,64,.16)'); c.restore();
      circ(c, -200, 0, 8, '#7dd3fc');
      c.save(); c.translate(130 + pop, 0); c.beginPath(); c.roundRect(-10, -34, 130, 68, 24); fill(c, '#f97316'); lnW(c, 5, I);
      c.beginPath(); c.roundRect(70, -34, 50, 68, 20); fill(c, I); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(6, -24, 52, 10); c.restore();
      const kt = cl(pop / 60); if (kt > .05) plate(c, 'СМЕННЫЙ', 190 + pop, -86, kt, { s: 24, bg: W1.red, c: '#fff', sh: false });
      c.restore();
    }
    [[2340, 820], [2380, 700], [2420, 760]].forEach(([v, L], i) => { const kl = eo(at(t, k.cart + i * .06, k.cart + .4 + i * .06)); if (kl > 0) { c.beginPath(); c.roundRect(80, v - 9, L * kl, 18, 9); fill(c, '#c9ccd8') } });
    // «А цельные одноразовые там…»: строки текста слева, справа — пустой пунктирный контур; «не упомянуты» — штамп
    [2560, 2610, 2660, 2760, 2810, 2860].forEach((v, i) => { const kl = eo(at(t, k.cel - .3 + i * .05, k.cel + .1 + i * .05)); if (kl > 0) { c.beginPath(); c.roundRect(80, v - 9, (330 + 120 * H1(i * 3.3)) * kl, 18, 9); fill(c, '#c9ccd8') } });
    const ko = eio(at(t, k.cel, k.odr + .55)); if (ko > 0) {
      A(c, eo(at(t, k.odr - .1, k.odr + .3)), () => tx(c, 'ОДНОРАЗКИ?', SHOLE.u, SHOLE.v - SHOLE.h / 2 - 50, { f: 'U', w: 800, s: 36, c: W1.red }));
      const kd = at(t, k.poka - .4, k.poka + .3);   // кусок бумаги внутри контура проваливается — открывается дыра
      if (kd > 0) holeInW(c, t);
      if (kd < 1) {
        c.save(); c.translate(SHOLE.u, SHOLE.v + 260 * ei(kd)); c.rotate(.5 * ei(kd)); c.scale(1 - .45 * ei(kd), 1 - .45 * ei(kd)); c.translate(-SHOLE.u, -SHOLE.v);
        holePathS(c); fill(c, mixc(W1.paper, '#cfc6b2', kd));
        const pq = .5 + .5 * Math.sin(t * 5); A(c, (1 - kd) * at(t, k.odr, k.odr + .3) * (1 - at(t, k.upom - .2, k.upom + .2)), () => tx(c, '?', SHOLE.u, SHOLE.v, { f: 'U', w: 800, s: 120, c: rgba(W1.red, .25 + .2 * pq) }));
        c.restore();
      }
      c.save(); c.beginPath(); c.rect(SHOLE.u - 200, SHOLE.v - SHOLE.h / 2 - 30, 400, (SHOLE.h + 60) * ko); c.clip(); holePathS(c); c.setLineDash([22, 14]); c.lineDashOffset = -t * 30; lnW(c, 6, W1.red); c.setLineDash([]); c.restore();
    }
    const ks = spr(at(t, k.upom - .08, k.upom + .4)); if (ks > 0) { c.save(); c.translate(300, 2712); c.rotate(-.13); c.scale(ks * lp(1.6, 1, cl(ks)), ks * lp(1.6, 1, cl(ks))); c.beginPath(); c.roundRect(-200, -42, 400, 84, 12); lnW(c, 7, W1.red); tx(c, 'НЕ УПОМЯНУТЫ', 0, 4, { f: 'U', w: 800, s: 38, c: W1.red }); c.restore() }
  }
  function w2Keys() {   // ключи камеры мира 2 (лист → дыра → карта), в координатах мира 1
    const S = (t, u, v, z, r = 0) => KW('S', t, u, v, z, r), B = (t, x, y, z, r = 0) => KW('B', t, x, y, z, r), C = (t, x, y, z, r = 0) => KW('C', t, x, y, z, r), D = (t, x, y, z, r = 0) => KW('D', t, x, y, z, r);
    return [
      S(22.35, 500, 1640, 1.05), S(23.45, 505, 1830, 1.12, .004), S(24.55, 500, 1960, 1.2, -.004), S(25.7, 495, 2130, 1.3), S(26.95, 540, 2440, 1.2, .006),
      S(28.35, 545, 2650, 1.32, -.004), S(29.3, 650, 2716, 2.4), S(29.95, 719, 2745, 5.0),
      B(30.5, 0, 60, 1.76), B(31.0, 0, -40, 1.9), B(31.55, 0, -200, 1.2), B(32.3, 0, -900, .33), B(33.2, 0, -3000, .62, .01), B(34.1, 60, -2700, .8),
      B(35.95, 170, -2560, .78, -.006), B(36.6, 60, -2250, .6), B(37.4, 0, -700, .47), B(38.15, 0, 650, .5), B(38.9, 0, 500, .68, .006), B(40.6, 60, 520, .74),
      B(42.6, 150, 420, .95, -.004), B(43.3, 150, 560, 2.4), B(43.85, 150, 575, 4.6),
      C(44.6, 0, -60, 1.85), C(45.9, 0, -300, 1.6, .004), C(47.1, 0, -260, 1.3, -.004), C(48.3, 0, -520, 1.15), C(49.6, 0, -1500, 1.0), C(50.5, 350, -2380, .8, .006),
      C(51.45, 900, -2330, .85), C(52.6, 1080, -2300, .92, -.004), C(53.6, 450, -900, .33), C(54.9, -650, -250, .29, .004), C(56.4, 300, -350, .21), C(57.9, 900, -2300, .19, -.004),
      C(59.3, 1900, 500, .42), C(60.6, 1900, -1450, .5, .004), C(61.9, 2950, -1250, .21), C(62.9, 2500, -2500, .3), C(63.7, 1900, -3440, 1.25),
      D(64.35, 0, 30, 2.1), D(65.2, 0, -40, 1.25), D(66.2, 150, 150, .6, .004), D(67.1, 750, -150, .52), D(68.3, -420, -250, .42, -.004), D(68.95, -260, -180, .43), D(69.9, 1500, 350, .42),
      D(70.8, 2700, 450, .45), D(71.9, 4300, 250, .55, .004), D(73.3, 4600, -900, .36), D(75.2, 4800, -1500, .3), D(76.6, 4820, -1700, .28),
    ];
  }
  function holeInW(c, t) {   // дыра в листе: внутри — мир B
    c.save(); holePathS(c); c.clip();
    const n = NEST.B; c.save(); c.translate(n.ox, n.oy); c.scale(n.s, n.s); drawB(c, t, null); c.restore();
    c.save(); holePathS(c); c.lineWidth = 26; c.strokeStyle = 'rgba(8,10,24,.45)'; c.stroke(); c.restore();
    c.restore();
  }
  function tinInit() {   // кадры входа в окна миров
    TINW.B = scanTin('B', 'S', { x0: SHOLE.u - SHOLE.w / 2 + 1, x1: SHOLE.u + SHOLE.w / 2 - 1, y0: SHOLE.v - SHOLE.h / 2 + SHOLE.r, y1: SHOLE.v + SHOLE.h / 2 - SHOLE.r }, 29.5, 31.5);
    TINW.C = scanTin('C', 'B', { x0: COL.x0 + 1, x1: COL.x1 - 1, y0: COL.base - COL.h + 1, y1: COL.base - 1 }, 42.8, 44.6);
    for (let f = Math.floor(63.2 * 30); f < 65 * 30 && TINW.D > 98; f++) {   // пузырь — круг: все четыре угла кадра внутри
      const v = viewRect(camIn('C', camW(f / 30))), r2 = (BUB.r - 2) ** 2;
      if ([[v.x0, v.y0], [v.x1, v.y0], [v.x0, v.y1], [v.x1, v.y1]].every(([x, y]) => (x - BUB.x) ** 2 + (y - BUB.y) ** 2 < r2)) TINW.D = f / 30;
    }
    if (TINW.D > 98) throw new Error('v185: камера не заходит в пузырь');
  }
  // ================= v18.5: МИР B (≈30…43 с) — «Пока «Джул» убирал вкусы с полок…» → океан → Шэньчжэнь → волна → ×11 =================
  // Карта-игрушка вертикально: внизу берег США с магазином (в его окне — полка «Джула»), посередине океан, вверху — Китай и завод.
  // Камера выходит из дыры в листе прямо к полке, отъезжает до всей карты, наезжает на завод, едет вниз вместе с волной одноразок,
  // на берегу США из воды встают два столбика-колбы (2019 · 2,4 % и 2020 · 26,5 %), камера ныряет в жидкость большого.
  const WB = { sea: '#1f3563', sea2: '#2c4f8a', land: '#3a4066', land2: '#2f3454', ln: '#eef2f7', ink: '#1e2340', red: '#e8445a', warm: '#ffd479',
    wood: '#c9a27a', wood2: '#9a7350', crate: '#b98a5e', liq: '#3fb7e3', liq2: '#1f8fc4' };
  const POD_TOP = [['МАНГО', '#f97316'], ['ФРУКТЫ', '#ec4899'], ['КРЕМ', '#eab308'], ['ОГУРЕЦ', '#84cc16'], ['МЯТА', '#22c55e']];
  const POD_BOT = [['ТАБАК', '#a8835a', 1], ['МЕНТОЛ', '#67c7d9', 1], ['МАНГО', '#f97316'], ['МЯТА', '#22c55e']];
  const COAST_US = 1000, COAST_CN = -2250, FAC = { y: -2480 }, COL = { x0: 20, x1: 280, base: 1150, h: 1150, sx0: -330, sx1: -170, sh: 105 };
  const coastY = (x, y0, a, ph) => y0 + a * Math.sin(x / 260 + ph) + a * .5 * Math.sin(x / 97 + ph * 2);
  function seaB(c, t, v) {
    const r = v || { x0: -3000, x1: 3000, y0: -6000, y1: 3000 };
    c.fillStyle = WB.sea; c.fillRect(r.x0 - 50, r.y0 - 50, r.x1 - r.x0 + 100, r.y1 - r.y0 + 100);
    // волнышки на воде: короткие дуги, качаются на месте
    for (let i = 0; i < 90; i++) {
      const x = -1400 + H1(i * 3.1) * 2800, y = COAST_CN + 80 + H1(i * 7.7) * (COAST_US - COAST_CN - 160); if (v && (x < r.x0 - 80 || x > r.x1 + 80 || y < r.y0 - 80 || y > r.y1 + 80)) continue;
      const b = Math.sin(t * 1.6 + i) * 8; c.beginPath(); c.arc(x, y + b, 26, Math.PI * 1.15, Math.PI * 1.85); lnW(c, 5, rgba(WB.ln, .28));
    }
  }
  function landB(c, t, y0, dir, label, lx, ly) {   // берег: волнистая линия, земля в сторону dir (+1 вниз, −1 вверх)
    c.beginPath(); c.moveTo(-3200, y0); for (let x = -3200; x <= 3200; x += 40) c.lineTo(x, coastY(x, y0, 26, y0)); c.lineTo(3200, y0 + dir * 4000); c.lineTo(-3200, y0 + dir * 4000); c.closePath(); fill(c, WB.land);
    c.save(); c.clip(); dotsRect(c, -3200, y0 + (dir > 0 ? 60 : -1460), 6400, 1400, 22, 3, 'rgba(10,12,30,.18)'); c.restore();
    c.beginPath(); for (let x = -3200; x <= 3200; x += 40) { const y = coastY(x, y0, 26, y0); if (x === -3200) c.moveTo(x, y); else c.lineTo(x, y) } lnW(c, 7, WB.ln);
    c.beginPath(); for (let x = -3200; x <= 3200; x += 40) { const y = coastY(x, y0, 26, y0) - dir * (34 + 6 * Math.sin(t * 2 + x / 80)); if (x === -3200) c.moveTo(x, y); else c.lineTo(x, y) } lnW(c, 4, rgba(WB.ln, .45));
    tx(c, label, lx, ly, { f: 'U', w: 800, s: 92, c: rgba(WB.ln, .5), ls: 8 });
  }
  function podB(c, x, yb, col, s = 1) {   // картридж «Джула» стоя: корпус и цветной верх
    c.save(); c.translate(x, yb); c.scale(s, s);
    c.beginPath(); c.roundRect(-24 + 6, -150 + 8, 48, 150, 12); fill(c, 'rgba(8,10,24,.3)');
    c.beginPath(); c.roundRect(-24, -150, 48, 150, 12); fill(c, '#a9b0c4'); lnW(c, 4, WB.ink);
    c.beginPath(); c.roundRect(-24, -150, 48, 48, [12, 12, 4, 4]); fill(c, col); lnW(c, 4, WB.ink);
    c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-16, -142, 8, 32); circ(c, 0, -30, 5, '#7dd3fc'); c.restore();
  }
  function shelfB(c, t) {   // окно магазина изнутри: стена, вывеска JUUL, две полки
    const k = W2;
    c.fillStyle = '#3a4066'; c.fillRect(-420, -900, 840, 1800);
    c.save(); c.beginPath(); c.rect(-420, -900, 840, 1800); c.clip(); dotsRect(c, 230, -900, 190, 1800, 18, 2.6, 'rgba(10,12,30,.18)'); c.restore();
    c.beginPath(); c.roundRect(-190, -720, 380, 120, 16); fill(c, '#f4efe4'); lnW(c, 5, WB.ink); tx(c, 'JUUL', 0, -656, { f: 'U', w: 800, s: 84, c: WB.ink, ls: 10 });
    glow(c, 0, -660, 330, WB.warm, .1);
    let n = 0;
    [[-250, POD_TOP, [-260, -130, 0, 130, 260]], [220, POD_BOT, [-210, -70, 70, 210]]].forEach(([yb, L, xs]) => {
      L.forEach(([nm, col, keep], i) => {
        let x = xs[i], y = yb, r = 0;
        if (!keep) { const tr = k.ubir - .15 + n * .12, e = at(t, tr, tr + .55); n++;
          if (e > 0) { x += 60 * ei(e) + 380 * Math.pow(e, 3); y += -26 * Math.sin(Math.PI * cl(e * 2)) + 900 * Math.pow(cl(e * 1.4 - .4), 2); r = 1.6 * ei(e) } }
        if (y < 900) { c.save(); c.translate(x, y); c.rotate(r); podB(c, 0, 0, col); c.restore() }
        tx(c, nm, xs[i], yb + 52, { f: 'M', w: 800, s: 20, c: keep ? '#e5e7eb' : rgba('#e5e7eb', 1 - at(t, k.ubir, k.polok)), ls: 1 });
      });
      c.beginPath(); c.rect(-370, yb, 740, 26); fill(c, WB.wood); lnW(c, 4, WB.ink); c.fillStyle = WB.red; c.fillRect(-370, yb + 18, 740, 8);
    });
    // блики стекла
    c.save(); c.globalAlpha = .07; poly(c, [-420, -200, -200, -900, -110, -900, -330, -200]); fill(c, '#fff'); poly(c, [80, 900, 330, 200, 380, 200, 130, 900]); fill(c, '#fff'); c.restore();
  }
  function storeB(c, t) {   // магазин на берегу США (стоящая «фишка» на карте)
    c.beginPath(); c.rect(-620 + 24, -1250 + 30, 1240, 2300); fill(c, 'rgba(8,10,24,.35)');
    c.beginPath(); c.rect(-620, -1250, 1240, 2300); fill(c, '#2f3454'); lnW(c, 6, WB.ln);
    c.save(); c.beginPath(); c.rect(-420, -900, 840, 1800); c.clip(); shelfB(c, t); c.restore();
    c.beginPath(); c.rect(-420, -900, 840, 1800); lnW(c, 8, WB.ln);
    c.beginPath(); c.roundRect(-330, -1180, 660, 150, 18); fill(c, '#f4efe4'); lnW(c, 5, WB.ink); tx(c, 'ВЕЙПЫ · США', 0, -1104, { f: 'U', w: 800, s: 64, c: WB.ink });
    // флаг на крыше
    c.beginPath(); c.moveTo(500, -1250); c.lineTo(500, -1560); lnW(c, 8, WB.ln);
    const wv = x => 10 * Math.sin(t * 4 + x / 40);
    for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(500, -1560 + i * 22); for (let x = 0; x <= 260; x += 20) c.lineTo(500 + x, -1560 + i * 22 + wv(x)); c.lineTo(500 + 260, -1560 + (i + 1) * 22 + wv(260)); for (let x = 260; x >= 0; x -= 20) c.lineTo(500 + x, -1560 + (i + 1) * 22 + wv(x)); c.closePath(); fill(c, i % 2 ? '#f4efe4' : WB.red) }
    c.beginPath(); c.moveTo(500, -1560); for (let x = 0; x <= 110; x += 20) c.lineTo(500 + x, -1560 + wv(x)); c.lineTo(610, -1560 + 88 + wv(110)); for (let x = 110; x >= 0; x -= 20) c.lineTo(500 + x, -1560 + 88 + wv(x)); c.closePath(); fill(c, WB.ink);
  }
  function factoryB(c, t) {   // завод в Шэньчжэне: пилообразная крыша, трубы, окна загораются, конвейер
    const k = W2, Y = FAC.y, on = at(t, k.zapusk - .3, k.zapusk + .4);
    c.beginPath(); c.rect(-650 + 24, Y - 820 + 30, 1300, 820); fill(c, 'rgba(8,10,24,.35)');
    [-420, -250].forEach((x, i) => { c.beginPath(); c.rect(x - 34, Y - 1420, 68, 700); fill(c, '#3f4570'); lnW(c, 5, WB.ln); for (let j = 0; j < 3; j++) { c.fillStyle = WB.red; c.fillRect(x - 34, Y - 1300 + j * 160, 68, 26) }
      const bl = .5 + .5 * Math.sin(t * 5 + i * 2); circ(c, x, Y - 1440, 12, rgba('#ff6b6b', .4 + .6 * bl * (.3 + .7 * on))) });
    c.beginPath(); c.moveTo(-650, Y); c.lineTo(-650, Y - 820); for (let i = 0; i < 5; i++) { const x = -650 + i * 260; c.lineTo(x + 180, Y - 1060); c.lineTo(x + 260, Y - 820) } c.lineTo(650, Y); c.closePath(); fill(c, '#2f3454'); lnW(c, 6, WB.ln);
    for (let i = 0; i < 5; i++) { const x = -650 + i * 260; poly(c, [x + 186, Y - 1046, x + 252, Y - 830, x + 186, Y - 830]); fill(c, mixc('#1b1f36', '#ffe7a3', on * at(t, k.zapusk + i * .07, k.zapusk + .3 + i * .07))) }
    for (let r = 0; r < 3; r++) for (let q = 0; q < 8; q++) { const x = -560 + q * 145, y = Y - 740 + r * 170, tl = k.zapusk - .2 + (q + r * 3) * .035;
      c.beginPath(); c.roundRect(x, y, 96, 110, 8); fill(c, mixc('#1b1f36', H1(q + r * 8) > .3 ? '#ffd479' : '#f4a261', at(t, tl, tl + .25))); lnW(c, 4, WB.ln) }
    c.beginPath(); c.roundRect(-330, Y - 945, 660, 110, 16); fill(c, '#f4efe4'); lnW(c, 5, WB.ink); tx(c, 'ЗАВОД · ШЭНЬЧЖЭНЬ', 0, Y - 888, { f: 'U', w: 800, s: 46, c: WB.ink });
    // конвейер перед заводом: ролики крутятся, одноразки едут вправо
    const run = Math.max(0, t - (k.zapusk - .1)), sp = 420 * cl(run / .8), dist = run < .8 ? 420 * run * run / 1.6 : 420 * .4 + (run - .8) * 420;
    c.beginPath(); c.roundRect(-640, Y + 30, 1280, 56, 28); fill(c, '#1b1f36'); lnW(c, 5, WB.ln);
    for (let i = 0; i < 21; i++) { const x = -610 + i * 61; c.save(); c.translate(x, Y + 58); c.rotate(dist / 22); circ(c, 0, 0, 18, '#565d8a'); c.beginPath(); c.moveTo(-14, 0); c.lineTo(14, 0); lnW(c, 4, WB.ln); c.restore() }
    if (run > 0) { const N = 26; for (let i = 0; i < N; i++) { let x = -620 + ((dist + i * 50) % 1300); if (x > 640) continue; const col = POD_TOP[i % 5][1];
      c.beginPath(); c.roundRect(x - 15, Y - 58, 30, 88, 9); fill(c, col); lnW(c, 4, WB.ink); c.fillStyle = WB.ink; c.fillRect(x - 15, Y - 58, 30, 18) } }
  }
  const CRATES = [{ x: -400, n: 'PUFF BAR', c: '#a78bfa', w: 'puff' }, { x: 0, n: 'HQD', c: '#f472b6', w: 'hqd' }, { x: 400, n: 'ELF BAR', c: '#34d399', w: 'elf' }];
  function cratesB(c, t) {
    const k = W2, tip = eio(at(t, k.odn - .35, k.odn + .2));
    CRATES.forEach((cr, i) => {
      const ka = bo(at(t, k[cr.w] - .25, k[cr.w] + .2)); if (ka <= 0) return;
      const yb = COAST_CN - 30;
      c.save(); c.translate(cr.x + 150, yb); c.rotate(tip * 1.25); c.translate(-150, 0); c.scale(1, ka); c.translate(0, -1);
      for (let j = 0; j < 7; j++) { if (tip > .5 && H1(j + i * 7) < tip) continue; c.save(); c.translate(-110 + j * 36, -175 - 14 * H1(j * 3 + i)); c.rotate((H1(j + i) - .5) * .5); c.beginPath(); c.roundRect(-15, -40, 30, 86, 9); fill(c, POD_TOP[(i + j) % 5][1]); lnW(c, 4, WB.ink); c.restore() }
      c.beginPath(); c.rect(-150, -170, 300, 170); fill(c, WB.crate); lnW(c, 5, WB.ink); for (let j = 1; j < 3; j++) { c.beginPath(); c.moveTo(-150, -170 + j * 57); c.lineTo(150, -170 + j * 57); lnW(c, 3, '#7a5536') }
      c.beginPath(); c.roundRect(-118, -128, 236, 72, 10); fill(c, '#f4efe4'); lnW(c, 4, WB.ink); tx(c, cr.n, 0, -91, { f: 'U', w: 800, s: 38, c: WB.ink, mw: 212 }); c.fillStyle = cr.c; c.fillRect(-118, -64, 236, 8);
      c.restore();
    });
  }
  const waveYB = t => lp(COAST_CN + 40, COAST_US + 70, eio(at(t, W2.odn - .05, W2.voln + .05)));
  function waveB(c, t) {   // волна одноразок: гребень с пеной, за ним — светлая вода, внутри кувыркаются одноразки
    const k = W2, Y = waveYB(t); if (t < k.odn - .1) return;
    const crest = x => Y + 34 * Math.sin(x / 150 + t * 6) + 18 * Math.sin(x / 61 - t * 9);
    c.beginPath(); c.moveTo(-3200, COAST_CN); for (let x = -3200; x <= 3200; x += 30) c.lineTo(x, crest(x)); c.lineTo(3200, COAST_CN); c.closePath(); fill(c, '#3466ad');
    c.beginPath(); for (let x = -3200; x <= 3200; x += 30) c.lineTo(x, crest(x) - 260); for (let x = 3200; x >= -3200; x -= 30) c.lineTo(x, crest(x)); c.closePath(); fill(c, '#4a86cf');
    c.beginPath(); for (let x = -3200; x <= 3200; x += 30) c.lineTo(x, crest(x) - 300); lnW(c, 6, rgba('#f4f8ff', .5));
    c.save(); c.clip(); for (let i = 0; i < 46; i++) { const x = -1300 + H1(i * 2.3) * 2600, dy = H1(i * 5.1) * 520 + 40, y = Y - dy, col = POD_TOP[i % 5][1];
      if (y < COAST_CN) continue; c.save(); c.translate(x + Math.sin(t * 3 + i) * 20, y); c.rotate(t * (2 + H1(i) * 3) * (i % 2 ? 1 : -1)); c.beginPath(); c.roundRect(-15, -40, 30, 84, 9); fill(c, col); lnW(c, 4, WB.ink); c.restore() } c.restore();
    c.beginPath(); for (let x = -3200; x <= 3200; x += 30) { const y = crest(x); if (x === -3200) c.moveTo(x, y); else c.lineTo(x, y) } lnW(c, 26, '#f4f8ff');
    for (let i = 0; i < 16; i++) { const x = -1650 + i * 220 + ((t * 120) % 220), y = crest(x); c.beginPath(); c.arc(x + 40, y - 36, 62, Math.PI * .1, Math.PI * 1.15); lnW(c, 14, '#f4f8ff'); circ(c, x - 18, y - 20, 14, '#f4f8ff') }
    for (let i = 0; i < 40; i++) { const x = -1300 + H1(i * 9.1) * 2600, ph = (t * 1.8 + H1(i)) % 1; circ(c, x + ph * 30, crest(x) + 10 - ph * 70, 12 * (1 - ph), rgba('#f4f8ff', .9 * (1 - ph))) }
    // удар о берег США: брызги
    const ks = at(t, k.voln - .12, k.voln + .7); if (ks > 0 && ks < 1) for (let i = 0; i < 28; i++) { const x = -900 + i * 66, a = -Math.PI / 2 + (H1(i * 3) - .5) * 1.2, sp = 500 + H1(i) * 600, dt = ks * .8;
      circ(c, x + Math.cos(a) * sp * dt, COAST_US + 20 + Math.sin(a) * sp * dt + 1600 * dt * dt, 22 * (1 - ks), '#f4f8ff') }
  }
  function columnLiquid(c, t, x0, x1, base, h, kf) {   // жидкость в большом столбике = мир C, видимый снаружи
    const top = base - h * kf; if (kf <= 0) return;
    c.save(); c.beginPath(); c.rect(x0, top, x1 - x0, base - top); c.clip();
    const n = NEST.C; c.save(); c.translate(n.ox, n.oy); c.scale(n.s, n.s); drawC(c, t, null, (top - n.oy) / n.s); c.restore();
    c.restore();
  }
  function chartB(c, t) {
    const k = W2; if (t < k.vsego - .3) return;
    const ka = bo(at(t, k.vsego - .2, k.vsego + .35)), kb = bo(at(t, k.vsego - .05, k.vsego + .5));
    const fs = eo(at(t, k.god, k.dolya + .3)), fb = lp(.09 * eo(at(t, k.dolya, k.par)), 1, eo(at(t, k.vyr - .05, k.x11 + .4)));
    // маленький столбик 2019
    if (ka > 0) { c.save(); c.translate(0, COL.base); c.scale(1, ka); c.translate(0, -COL.base);
      c.beginPath(); c.roundRect(COL.sx0, COL.base - COL.sh - 30, COL.sx1 - COL.sx0, COL.sh + 30, [10, 10, 18, 18]); fill(c, 'rgba(238,242,247,.12)');
      c.save(); c.beginPath(); c.rect(COL.sx0, COL.base - COL.sh * fs, COL.sx1 - COL.sx0, COL.sh * fs); c.clip(); c.fillStyle = WB.liq; c.fillRect(COL.sx0, COL.base - 200, 200, 200); c.restore();
      c.beginPath(); c.roundRect(COL.sx0, COL.base - COL.sh - 30, COL.sx1 - COL.sx0, COL.sh + 30, [10, 10, 18, 18]); lnW(c, 6, WB.ln); c.restore();
      A(c, at(t, k.dolya - .2, k.dolya + .2), () => tx(c, '2,4 %', (COL.sx0 + COL.sx1) / 2, COL.base - COL.sh - 80, { f: 'U', w: 800, s: 46, c: '#fff' })); }
    // большой столбик 2020: колба, в ней — мир C
    if (kb > 0) { c.save(); c.translate(0, COL.base); c.scale(1, kb); c.translate(0, -COL.base);
      c.beginPath(); c.roundRect(COL.x0 - 10, COL.base - COL.h - 40, COL.x1 - COL.x0 + 20, COL.h + 40, [12, 12, 22, 22]); fill(c, 'rgba(238,242,247,.12)');
      columnLiquid(c, t, COL.x0, COL.x1, COL.base, COL.h, fb);
      c.beginPath(); c.roundRect(COL.x0 - 10, COL.base - COL.h - 40, COL.x1 - COL.x0 + 20, COL.h + 40, [12, 12, 22, 22]); lnW(c, 7, WB.ln);
      c.save(); c.globalAlpha = .2; c.fillStyle = '#fff'; c.fillRect(COL.x0 + 18, COL.base - COL.h - 20, 18, COL.h); c.restore(); c.restore();
      const kv = at(t, k.x11 - .1, k.x11 + .3); A(c, kv, () => tx(c, '26,5 %', (COL.x0 + COL.x1) / 2, COL.base - COL.h - 110, { f: 'U', w: 800, s: 60, c: '#fff' })); }
    A(c, at(t, k.vsego - .1, k.vsego + .3), () => { tx(c, '2019', (COL.sx0 + COL.sx1) / 2, COL.base + 70, { f: 'U', w: 800, s: 44, c: WB.ln }); tx(c, '2020', (COL.x0 + COL.x1) / 2, COL.base + 70, { f: 'U', w: 800, s: 44, c: WB.ln }) });
    const kp = eo(at(t, k.dolya - .2, k.par + .3)); if (kp > 0) { c.save(); c.translate(-250, 740); c.scale(kp, kp);
      c.beginPath(); c.roundRect(-255, -100, 510, 200, 22); fill(c, 'rgba(15,23,42,.88)'); lnW(c, 4, WB.ln);
      tx(c, 'ДОЛЯ ОДНОРАЗОК', 0, -46, { f: 'U', w: 800, s: 36, c: '#fff' }); tx(c, 'У ПАРЯЩИХ', 0, 8, { f: 'M', w: 800, s: 30, c: '#cbd5e1' }); tx(c, 'СТАРШЕКЛАССНИКОВ США', 0, 50, { f: 'M', w: 800, s: 30, c: '#cbd5e1' }); c.restore() }
    const kx = spr(at(t, k.x11 + .1, k.x11 + .6)); if (kx > 0) { c.save(); c.translate(430, -230); c.rotate(-.18); c.scale(kx * lp(1.8, 1, cl(kx)), kx * lp(1.8, 1, cl(kx))); circ(c, 0, 0, 104, WB.red); ring(c, 0, 0, 86, '#fff', 4); tx(c, '×11', 0, 6, { f: 'U', w: 800, s: 76, c: '#fff' }); c.restore() }
  }
  function drawB(c, t, v) {   // мир B в своих координатах (v — видимый прямоугольник, null — всё)
    seaB(c, t, v);
    landB(c, t, COAST_CN, -1, 'КИТАЙ', -760, COAST_CN - 160);
    waveB(c, t);
    landB(c, t, COAST_US, 1, 'США', -820, COAST_US + 200);
    if (!v || v.y0 < FAC.y + 200) { factoryB(c, t); cratesB(c, t) }
    const sk = 2600 * ei(at(t, W2.voln - .2, W2.voln + .7));
    if ((!v || v.y1 > -1700) && sk < 2500) { c.save(); c.beginPath(); c.rect(-3000, -4000, 6000, 4000 + COAST_US + 50); c.clip(); c.translate(0, sk); storeB(c, t); c.restore() }
    chartB(c, t);
  }
  function shotB(c, t) {
    const cm = camIn('B', camW(t)), cm2 = camIn('B', camW(t + 1 / 30)), v = viewRect(cm);
    c.fillStyle = WB.sea; c.fillRect(0, 0, WW, HH);
    layer(c, cm, 1, c => drawB(c, t, v));
    speedLoc(c, cm, cm2, t);
  }
  // ================= v18.5: МИР C (≈43…64 с) — «не просто вкусы» → WS-23 → рецепторы → картридж = пачка → одноразка 13 мл → 16 картриджей =================
  // Камера ныряет в жидкость большого столбика — это бак картриджа в разрезе. Капли вкусов плавают, сверху падает кристалл WS-23,
  // жидкость леденеет, холодный пар поднимается по каналу мундштука и летит к панели «рецепторы горла» (холод — на максимум,
  // жжение — замерзает). Отъезд: картридж стоит рядом с пачкой сигарет («=»), справа вырастает одноразка (13 мл, двойная сетка,
  // 5000 затяжек), рядом сыплются 16 маленьких картриджей. В пузырь в баке одноразки камера ныряет в мир D.
  const WC = { liq: '#3fb7e3', liqI: '#b9ecfb', ink: '#1e2340', ln: '#eef2f7', plast: '#c7ccda', bg: '#262a40', red: '#e8445a', ice: '#e6f7ff', mint: '#22c55e' };
  const CD = { x: 1900, base: 1800 };   // одноразка: центр и низ
  const BUB = { x: 1900, y: -3500, r: 300 };   // пузырь в баке одноразки — окно в мир D
  let W3 = null;
  function w3Words() {
    const w = Wd; W3 = {
      eto: w('это'), prosto: w('просто', 1), vkusy: w('вкусы', 1), zhid: w('жидкость'), dob: w('добавили'), sint: w('синтетический'), hol: w('холодок'), ws: w('ws-23'),
      obm: w('обманывает'), rec: w('рецепторы'), gorlo: w('горло'), chuv: w('чувствует'), led: w('лёд'), deret: w('дерёт'), nik: w('никотин'),
      pomn: w('помните'), odin: w('один'), kart: w('картридж'), zam: w('заменял'), pach: w('пачку'), potom: w('потом', 1), odn: w('одноразки', 1), razr: w('разрослись'),
      t13: w('тринадцать'), ml: w('миллилитров'), dv: w('двойная'), set: w('сетка'), tys: w('тысячи'), zat: w('затяжек'), ponik: w('никотину'), x16: w('шестнадцать'), kart16: w('картриджей'),
    };
  }
  const frostK = t => eo(at(t, W3.sint - .05, W3.hol + .5));
  function liquidC(c, t, x0, x1, y0, y1) {   // жидкость: цвет, капли вкусов, пузырьки; после WS-23 — ледяная
    const fk = frostK(t);
    c.fillStyle = mixc(WC.liq, '#7fd3f2', fk); c.fillRect(x0, y0, x1 - x0, y1 - y0);
    c.save(); c.globalAlpha = .18; dotsRect(c, x0, y0, x1 - x0, y1 - y0, 28, 3, '#0b4f75'); c.restore();
    const drops = [['#f97316', -170, -900], ['#ec4899', 160, -420], ['#eab308', -120, 120], ['#22c55e', 190, 620], ['#a855f7', -200, 1040], ['#f97316', 150, 1300], ['#ec4899', -60, -1250], ['#eab308', 230, -1100]];
    drops.forEach(([col, x, y], i) => { const dx = x + Math.sin(t * .7 + i * 2) * 60, dy = y + Math.cos(t * .5 + i) * 50, r = 70 + 30 * H1(i * 3);
      if (dy < y0 - r || dy > y1 + r) return;
      c.beginPath(); c.ellipse(dx, dy, r * 1.1, r, Math.sin(t + i) * .3, 0, TAU); fill(c, col); c.beginPath(); c.ellipse(dx, dy, r * 1.1, r, Math.sin(t + i) * .3, 0, TAU); lnW(c, 6 + 6 * fk, mixc(WC.ink, '#ffffff', fk));
      circ(c, dx - r * .35, dy - r * .35, r * .22, 'rgba(255,255,255,.55)') });
    for (let i = 0; i < 26; i++) { const x = -320 + H1(i * 1.7) * 640, ph = (t * (.12 + H1(i) * .1) + H1(i * 9)) % 1, y = lp(1500, -1500, ph); if (y < y0 || y > y1) continue; ring(c, x + Math.sin(t * 2 + i) * 14, y, 10 + H1(i * 4) * 16, 'rgba(255,255,255,.6)', 4) }
  }
  function ws23C(c, t) {   // кристалл WS-23: падает сверху, на «холодок» — взрыв инея
    const k = W3, kd = at(t, k.zhid - .1, k.sint + .05); if (kd <= 0) return;
    const y = lp(-1750, -260, eio(kd)), rot = t * .8, kb = at(t, k.sint, k.hol + .6);
    if (kb > 0 && kb < 1) { ring(c, 0, y, 140 + 1500 * eo(kb), rgba('#ffffff', .9 * (1 - kb)), 30 * (1 - kb)); ring(c, 0, y, 80 + 1000 * eo(kb), rgba('#e0f7ff', .7 * (1 - kb)), 16 * (1 - kb)) }
    glow(c, 0, y, 380, '#e0f7ff', .35 + .25 * kb);
    c.save(); c.translate(0, y); c.rotate(rot);
    poly(c, [0, -130, 113, -65, 113, 65, 0, 130, -113, 65, -113, -65]); fill(c, '#f4fbff'); poly(c, [0, -130, 113, -65, 113, 65, 0, 130, -113, 65, -113, -65]); lnW(c, 8, '#2b6cb0');
    for (let i = 0; i < 3; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-80, 0); c.lineTo(80, 0); lnW(c, 7, '#60a5fa') }
    circ(c, 0, 0, 22, '#2b6cb0'); c.restore();
    const kl = spr(at(t, k.ws - .1, k.ws + .4)); if (kl > 0) plate(c, 'WS-23', 0, y + 240, kl, { s: 54, bg: '#2b6cb0', c: '#fff' });
    const ks = eo(at(t, k.sint, k.hol + .2)); if (ks > 0) plate(c, 'СИНТЕТИЧЕСКИЙ ХОЛОДОК', 0, y - 250, ks, { s: 40, bg: '#f4fbff', c: '#1e3a8a' });
  }
  function frostWalls(c, t, x0, x1, y0, y1) {   // иней растёт по стенкам бака
    const fk = frostK(t); if (fk <= 0) return;
    for (let i = 0; i < 18; i++) { const y = y0 + (i + .5) * (y1 - y0) / 18, L = (60 + 80 * H1(i * 5)) * fk;
      [x0, x1].forEach((x, s) => { const d = s ? -1 : 1; poly(c, [x, y - 40, x + d * L, y, x, y + 40]); fill(c, rgba('#f4fbff', .9)) }) }
  }
  function podC(c, t, cut) {   // большой картридж «Джула» в разрезе (бак — жидкость, канал мундштука)
    const I = WC.ink;
    c.beginPath(); c.roundRect(-450 + 40, -1700 + 50, 900, 3560, 60); fill(c, 'rgba(8,10,24,.35)');
    c.beginPath(); c.roundRect(-330, -2520, 660, 900, [140, 140, 20, 20]); fill(c, '#f97316'); lnW(c, 10, I);   // мундштук
    c.beginPath(); c.rect(-110, -2525, 220, 980); fill(c, '#33395c'); c.beginPath(); c.moveTo(-110, -2525); c.lineTo(-110, -1550); c.moveTo(110, -2525); c.lineTo(110, -1550); lnW(c, 8, I);
    c.beginPath(); c.roundRect(-450, -1700, 900, 3560, 60); c.moveTo(-350, -1550); c.roundRect(-350, -1550, 700, 3100, 20); fill(c, WC.plast);   // стенки с окном бака
    c.beginPath(); c.roundRect(-450, -1700, 900, 3560, 60); lnW(c, 10, I); c.beginPath(); c.roundRect(-350, -1550, 700, 3100, 20); lnW(c, 8, I);
    [-180, 0, 180].forEach(x => circ(c, x, 1800, 26, '#eab308'));
  }
  function panelC(c, t) {   // панель «рецепторы горла»: холод — на максимум, жжение — замерзает
    const k = W3, ka = bo(at(t, k.rec - .3, k.rec + .25)), kg = ei(at(t, k.razr - 1.2, k.razr - .5)); if (ka <= 0 || kg >= 1) return;
    c.save(); c.translate(1160 + 2600 * kg, -2300 - 1400 * kg); c.scale(ka, ka); c.rotate(-.03);
    c.beginPath(); c.roundRect(-420 + 24, -330 + 30, 840, 660, 40); fill(c, 'rgba(8,10,24,.4)');
    c.beginPath(); c.roundRect(-420, -330, 840, 660, 40); fill(c, '#1b2138'); lnW(c, 8, WC.ln);
    tx(c, 'РЕЦЕПТОРЫ ГОРЛА', 0, -250, { f: 'U', w: 800, s: 44, c: '#fff' });
    const cold = eio(at(t, k.chuv - .2, k.led + .2)), burn = .55 - .5 * eio(at(t, k.deret - .2, k.nik + .2)) + .04 * Math.sin(t * 9) * (1 - at(t, k.deret, k.nik));
    const dial = (x, lab, col, v, frozen) => {
      c.beginPath(); c.arc(x, 40, 160, Math.PI, 0); lnW(c, 26, '#33395c'); c.beginPath(); c.arc(x, 40, 160, Math.PI, Math.PI + Math.PI * v); lnW(c, 26, col);
      const a = Math.PI + Math.PI * v; c.beginPath(); c.moveTo(x, 40); c.lineTo(x + Math.cos(a) * 130, 40 + Math.sin(a) * 130); lnW(c, 10, '#fff'); circ(c, x, 40, 20, '#fff');
      tx(c, lab, x, 130, { f: 'U', w: 800, s: 38, c: col });
      if (frozen > 0) { A(c, frozen, () => { c.save(); c.beginPath(); c.arc(x, 40, 200, Math.PI, 0); c.lineTo(x + 200, 170); c.lineTo(x - 200, 170); c.closePath(); c.clip();
        c.fillStyle = 'rgba(224,247,255,.55)'; c.fillRect(x - 210, -170, 420, 350); for (let i = 0; i < 9; i++) { const fx = x - 180 + i * 45; poly(c, [fx, 170, fx + 22, 170 - 60 - 50 * H1(i), fx + 44, 170]); fill(c, '#f4fbff') } c.restore() }) }
    };
    dial(-200, 'ХОЛОД', '#60a5fa', .12 + .86 * cold, 0);
    dial(200, 'ЖЖЕНИЕ', WC.red, cl(burn), at(t, k.deret, k.nik + .3));
    const kl = spr(at(t, k.led - .1, k.led + .4)); if (kl > 0) plate(c, 'ЛЁД', -200, -110, kl, { s: 46, bg: '#60a5fa', c: '#fff' });
    const kn = spr(at(t, k.nik - .05, k.nik + .45)); if (kn > 0) plate(c, 'НЕ ЧУВСТВУЕТ', 200, -110, kn, { s: 30, bg: WC.red, c: '#fff' });
    c.restore();
  }
  function vaporC(c, t) {   // холодный пар: из бака по каналу вверх, из мундштука — к панели; красные «колючки» никотина
    const k = W3, t0 = k.obm - .4; if (t < t0) return;
    for (let i = 0; i < 34; i++) {
      const age = (t - t0) * .42 - i / 34; if (age < 0) continue; const ph = age % 1, red = i % 4 === 0;
      let x, y; if (ph < .45) { const q = ph / .45; x = Math.sin(i * 3 + q * 9) * 60; y = lp(-1500, -2560, q) } else { const q = (ph - .45) / .55; x = lp(0, 1000, eo(q)) + Math.sin(i + q * 7) * 50; y = lp(-2560, -2330, q) - Math.sin(Math.PI * q) * 260 + (H1(i) - .5) * 120 }
      const r = 30 + 26 * H1(i * 2), a = ph > .92 ? (1 - ph) / .08 : 1;
      if (red) A(c, a, () => { c.save(); c.translate(x, y); c.rotate(t * 2 + i); poly(c, [0, -r, r * .3, -r * .3, r, 0, r * .3, r * .3, 0, r, -r * .3, r * .3, -r, 0, -r * .3, -r * .3]); fill(c, WC.red); c.restore() });
      else { ring(c, x, y, r, rgba('#e0f7ff', .85 * a), 7); circ(c, x, y, r * .6, rgba('#e0f7ff', .25 * a)) }
    }
  }
  function packC(c, t) {   // пачка сигарет слева и «=»
    const k = W3, ka = bo(at(t, k.zam - .35, k.zam + .2)); if (ka <= 0) return;
    c.save(); c.translate(-1650, CD.base); c.scale(ka, ka);
    c.beginPath(); c.rect(-650 + 40, -2000 + 50, 1300, 2000); fill(c, 'rgba(8,10,24,.35)');
    c.beginPath(); c.rect(-650, -2000, 1300, 2000); fill(c, '#f4efe4'); lnW(c, 10, WC.ink);
    c.beginPath(); c.rect(-650, -2000, 1300, 620); fill(c, WC.red); lnW(c, 10, WC.ink); c.beginPath(); c.moveTo(-650, -1600); c.lineTo(650, -1600); lnW(c, 6, '#9b1c2e');
    for (let i = 0; i < 6; i++) { c.beginPath(); c.roundRect(-560 + i * 190, -2200, 150, 240, [60, 60, 0, 0]); fill(c, '#f4efe4'); lnW(c, 8, WC.ink); c.fillStyle = '#d6a06a'; c.fillRect(-560 + i * 190, -2200 + 160, 150, 80) }
    c.beginPath(); c.rect(-650, -2000, 1300, 2000); lnW(c, 10, WC.ink);
    tx(c, 'СИГАРЕТЫ', 0, -980, { f: 'U', w: 800, s: 120, c: WC.ink }); tx(c, '20 ШТ.', 0, -800, { f: 'M', w: 800, s: 90, c: '#7b8098' });
    c.restore();
    const ke = spr(at(t, k.zam, k.pach + .1)); if (ke > 0) { c.save(); c.translate(-830, 400); c.scale(ke, ke); c.fillStyle = '#fff'; c.fillRect(-160, -90, 320, 60); c.fillRect(-160, 30, 320, 60); c.restore() }
    const kl = eo(at(t, k.pach - .2, k.pach + .3)); if (kl > 0) { tx(c, '1 ПАЧКА', -1650, CD.base + 220, { f: 'U', w: 800, s: 110, c: '#fff', a: kl }); tx(c, '1 КАРТРИДЖ', 0, CD.base + 220, { f: 'U', w: 800, s: 110, c: '#fff', a: kl }) }
  }
  function dispC(c, t) {   // одноразка: вырастает, окно бака 13 мл, разрез с двойной сеткой, счётчик затяжек, пузырь-окно в мир D
    const k = W3, kg = bo(at(t, k.odn - .2, k.razr + .45)); if (kg <= 0) return;
    const gw = lp(900, 1700, eo(at(t, k.razr - .1, k.razr + .7))), gh = lp(3400, 8000, eo(at(t, k.razr - .1, k.razr + .7))), x = CD.x, b = CD.base, top = b - gh * kg, w = gw * kg;
    const I = WC.ink;
    c.beginPath(); c.roundRect(x - w / 2 + 50, top + 60, w, gh * kg, 160 * kg); fill(c, 'rgba(8,10,24,.35)');
    c.beginPath(); c.roundRect(x - w / 2, top, w, gh * kg, 160 * kg); fill(c, '#3b5d9a'); lnW(c, 12, I);
    c.save(); c.beginPath(); c.roundRect(x - w / 2, top, w, gh * kg, 160 * kg); c.clip(); c.fillStyle = '#2c4a80'; c.fillRect(x + w * .22, top, w * .3, gh * kg); dotsRect(c, x + w * .22, top, w * .3, gh * kg, 40, 5, 'rgba(8,10,24,.25)'); c.restore();
    c.beginPath(); c.roundRect(x - w * .3, top - 700 * kg, w * .6, 760 * kg, [200 * kg, 200 * kg, 10, 10]); fill(c, '#1e2340'); lnW(c, 12, I);
    // окно бака
    const wx0 = x - w * .32, wx1 = x + w * .32, wy0 = top + gh * kg * .12, wy1 = top + gh * kg * .55, lv = lp(.2, .86, eio(at(t, k.t13 - .2, k.ml + .2)));
    c.beginPath(); c.roundRect(wx0, wy0, wx1 - wx0, wy1 - wy0, 40); fill(c, '#1b2138');
    c.save(); c.beginPath(); c.roundRect(wx0, wy0, wx1 - wx0, wy1 - wy0, 40); c.clip(); const ly = wy1 - (wy1 - wy0) * lv;
    c.fillStyle = mixc(WC.liq, '#7fd3f2', frostK(t)); c.fillRect(wx0, ly, wx1 - wx0, wy1 - ly);
    c.beginPath(); for (let xx = wx0; xx <= wx1; xx += 20) c.lineTo(xx, ly + 14 * Math.sin(xx / 60 + t * 4)); lnW(c, 10, '#e0f7ff');
    for (let i = 0; i < 12; i++) { const ph = (t * .2 + H1(i * 5)) % 1; ring(c, lp(wx0 + 60, wx1 - 60, H1(i * 2)), lp(wy1 - 40, ly + 40, ph), 16 + 10 * H1(i), 'rgba(255,255,255,.5)', 5) }
    bubbleC(c, t); c.restore();
    c.beginPath(); c.roundRect(wx0, wy0, wx1 - wx0, wy1 - wy0, 40); lnW(c, 12, WC.ln);
    const km = spr(at(t, k.t13 - .1, k.ml + .3)); if (km > 0) plate(c, '13 МЛ', x, wy0 - 200 * kg, km * kg, { s: 260, bg: '#fff', c: I });
    // разрез: двойная сетка
    const kx = eio(at(t, k.dv - .3, k.dv + .25)); if (kx > 0) {
      const cy0 = top + gh * kg * .67, cy1 = b - 300 * kg, cw = w * .78 * kx;
      c.beginPath(); c.roundRect(x - cw / 2, cy0, cw, cy1 - cy0, 40); fill(c, '#14182c'); c.beginPath(); c.roundRect(x - cw / 2, cy0, cw, cy1 - cy0, 40); lnW(c, 10, WC.ln);
      c.save(); c.beginPath(); c.roundRect(x - cw / 2, cy0, cw, cy1 - cy0, 40); c.clip();
      const hot = .5 + .5 * Math.sin(t * 6);
      [-.22, .22].forEach((dx, i) => { const mx = x + dx * w, my = cy0 + (cy1 - cy0) * .42, mr = w * .2, ks = spr(at(t, k.set - .25 + i * .12, k.set + .2 + i * .12)); if (ks <= 0) return;
        c.save(); c.translate(mx, my); c.scale(ks, ks); glow(c, 0, 0, mr * 2.2, '#fb923c', .45 + .25 * hot); c.beginPath(); c.roundRect(-mr, -mr * 1.5, mr * 2, mr * 3, 30); fill(c, '#3f3f46');
        c.save(); c.beginPath(); c.roundRect(-mr, -mr * 1.5, mr * 2, mr * 3, 30); c.clip(); for (let j = -8; j <= 8; j++) { c.beginPath(); c.moveTo(-mr * 2, j * 40 - mr); c.lineTo(mr * 2, j * 40 + mr); c.moveTo(-mr * 2, j * 40 + mr); c.lineTo(mr * 2, j * 40 - mr); lnW(c, 12, mixc('#fdba74', '#f97316', hot)) } c.restore();
        c.beginPath(); c.roundRect(-mr, -mr * 1.5, mr * 2, mr * 3, 30); lnW(c, 10, WC.ln); c.restore() });
      c.restore();
      const kl = spr(at(t, k.set - .1, k.set + .4)); if (kl > 0) plate(c, 'ДВОЙНАЯ СЕТКА', x, cy0 - 110, kl, { s: 100, bg: '#fb923c', c: '#fff' });
    }
    // счётчик затяжек
    const kc = eo(at(t, k.tys - .3, k.zat + .2)); if (kc > 0) {
      const dy = top + gh * kg * .58, n = Math.round(5000 * eo(at(t, k.tys - .1, k.zat + .5)) / 10) * 10;
      c.save(); c.translate(x, dy); c.scale(kc, kc); c.beginPath(); c.roundRect(-520, -150, 1040, 300, 40); fill(c, '#0b1020'); lnW(c, 10, WC.ln);
      num(c, String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '), -60, 0, { f: 'J', w: 700, s: 190, c: '#7ee787' }); tx(c, 'ЗАТЯЖЕК', 380, 0, { f: 'U', w: 800, s: 54, c: '#7ee787', mw: 220 }); c.restore();
    }
  }
  function bubbleC(c, t) {   // большой пузырь в баке одноразки: в нём уже видна колба мира D
    const k = W3, kb = eo(at(t, k.x16 - .3, k.kart16 + .3)); if (kb <= 0) return;
    const r = BUB.r * kb, by = BUB.y;
    c.save(); c.beginPath(); c.arc(BUB.x, by, r, 0, TAU); c.clip();
    const n = NEST.D; c.save(); c.translate(n.ox, n.oy); c.scale(n.s, n.s); drawD(c, t, { x0: -650, x1: 650, y0: -650, y1: 650 }); c.restore(); c.restore();
    ring(c, BUB.x, by, r, '#e0f7ff', 12); c.beginPath(); c.arc(BUB.x, by, r * .82, Math.PI * 1.15, Math.PI * 1.45); lnW(c, 14, 'rgba(255,255,255,.7)');
  }
  function pods16C(c, t) {   // 16 маленьких картриджей вылетают из большого и встают сеткой 4×4 справа от одноразки
    const k = W3; if (t < k.ponik - .3) return;
    for (let i = 0; i < 16; i++) { const r = Math.floor(i / 4), q = i % 4, tx0 = k.ponik - .2 + i * .07, e = at(t, tx0, tx0 + .55); if (e <= 0) continue;
      const gx = 3200 + q * 360, gy = -1700 + r * 1080, sx = 0, sy = -400, ee = eio(e);
      const x = lp(sx, gx, ee), y = lp(sy, gy, ee) - Math.sin(Math.PI * ee) * 900, s = lp(1, .34, ee);
      c.save(); c.translate(x, y); c.scale(s, s); c.rotate((1 - ee) * (q - 1.5) * .4);
      c.beginPath(); c.roundRect(-330, -1100, 660, 900, [140, 140, 20, 20]); fill(c, '#f97316'); lnW(c, 18, WC.ink);
      c.beginPath(); c.roundRect(-450, -300, 900, 2100, 60); fill(c, WC.plast); lnW(c, 18, WC.ink); c.beginPath(); c.roundRect(-330, -150, 660, 1500, 20); fill(c, WC.liq); lnW(c, 14, WC.ink);
      c.restore(); }
    const kl = spr(at(t, k.kart16 - .2, k.kart16 + .3)); if (kl > 0) plate(c, '= 16 КАРТРИДЖЕЙ', 3740, -2500, kl, { s: 130, bg: WC.red, c: '#fff' });
  }
  function drawC(c, t, v, top) {   // мир C в своих координатах; top — уровень жидкости, если смотрим снаружи (из столбика мира B)
    if (!W3) w3Words();
    const r = v || { x0: -360, x1: 360, y0: top ?? -1560, y1: 1560 };
    if (v) { c.fillStyle = WC.bg; c.fillRect(r.x0 - 20, r.y0 - 20, r.x1 - r.x0 + 40, r.y1 - r.y0 + 40); for (let i = 0; i < 60; i++) circ(c, -4000 + H1(i * 2.2) * 9000, -7000 + H1(i * 3.9) * 9500, 8 + H1(i) * 8, 'rgba(238,242,247,.18)') }
    if (v) { packC(c, t); podC(c, t) }
    c.save(); c.beginPath(); c.rect(-350, -1550, 700, 3100); c.clip(); liquidC(c, t, -350, 350, Math.max(-1550, r.y0), Math.min(1550, r.y1)); frostWalls(c, t, -350, 350, -1550, 1550); ws23C(c, t); c.restore();
    if (v) { vaporC(c, t); panelC(c, t); dispC(c, t); pods16C(c, t) }
  }
  function shotC(c, t) {
    const cm = camIn('C', camW(t)), cm2 = camIn('C', camW(t + 1 / 30)), v = viewRect(cm);
    c.fillStyle = WC.bg; c.fillRect(0, 0, WW, HH);
    layer(c, cm, 1, c => drawC(c, t, v));
    speedLoc(c, cm, cm2, t);
  }
  // ================= v18.5: МИР D (≈64…76 с) — «никотин начали варить прямо в пробирке» → розлив → касса → корпорации =================
  // Изнутри пузыря — колба на горелке (кипит синтетический никотин), по змеевику капает в пробирку; слева лист табака перечёркнут.
  // Камера едет вправо по столу: одноразки наполняются и едут к кассе, табло — до 3 млрд $ в год, сзади вырастают три башни
  // старых табачных корпораций, монеты летят к ним. Дальше — сцена 8 (монета → Луна, город, общежитие).
  const WDc = { bg: '#24283f', wall2: '#2b3050', ink: '#1e2340', ln: '#eef2f7', glass: 'rgba(238,242,247,.12)', nic: '#f5b041', nic2: '#d98a1c', red: '#e8445a', gold: '#f2c14e', leaf: '#5b8f2a' };
  const BENCH = 980;
  let W4 = null;
  function w4Words() {
    const w = Wd; W4 = {
      chtob: w('чтобы'), obo: w('обойти'), prov: w('проверки'), nik: w('никотин', 1), nach: w('начали'), var: w('варить'), pryam: w('прямо'), prob: w('пробирке'),
      bez: w('без'), ed: w('единого'), list: w('листа'), tab: w('табака'), kogda: w('когда'), odn: w('одноразки', 2), stali: w('стали'), prin: w('приносить'),
      mlrd: w('миллиарды'), doll: w('долларов'), god: w('год', 1), rynok: w('рынок'), zashli: w('зашли'), sami: w('сами'), star: w('старые'), tabn: w('табачные'), corp: w('корпорации'),
    };
  }
  function labBgD(c, t, v) {
    const r = v || { x0: -700, x1: 700, y0: -700, y1: 700 };
    c.fillStyle = WDc.bg; c.fillRect(r.x0 - 20, r.y0 - 20, r.x1 - r.x0 + 40, r.y1 - r.y0 + 40);
    c.save(); c.globalAlpha = .5; for (let x = Math.floor(r.x0 / 240) * 240; x < r.x1 + 240; x += 240) { c.beginPath(); c.moveTo(x, Math.max(r.y0, -6000)); c.lineTo(x, Math.min(r.y1, BENCH)); lnW(c, 3, WDc.wall2) }
    for (let y = Math.floor(r.y0 / 240) * 240; y < Math.min(r.y1, BENCH); y += 240) { c.beginPath(); c.moveTo(r.x0, y); c.lineTo(r.x1, y); lnW(c, 3, WDc.wall2) } c.restore();
    if (r.y1 > BENCH - 40) { c.fillStyle = '#4a3f6b'; c.fillRect(r.x0 - 20, BENCH, r.x1 - r.x0 + 40, 90); c.fillStyle = '#1b1830'; c.fillRect(r.x0 - 20, BENCH + 90, r.x1 - r.x0 + 40, Math.max(0, r.y1 - BENCH)); c.beginPath(); c.moveTo(r.x0 - 20, BENCH); c.lineTo(r.x1 + 20, BENCH); lnW(c, 8, WDc.ln) }
  }
  function flaskD(c, t) {   // круглая колба на горелке: кипит
    const k = W4, boil = .35 + .65 * at(t, k.nach - .3, k.var + .3);
    c.beginPath(); c.moveTo(-760, BENCH); c.lineTo(-760, -1700); lnW(c, 26, "#7b8098"); c.beginPath(); c.moveTo(-760, -1150); c.lineTo(-150, -1150); lnW(c, 18, '#7b8098'); c.beginPath(); c.roundRect(-190, -1190, 80, 80, 16); fill(c, '#565d8a');
    // горелка и пламя
    c.beginPath(); c.roundRect(-200, 720, 400, 260, 30); fill(c, '#565d8a'); lnW(c, 8, WDc.ln);
    for (let i = 0; i < 5; i++) { const x = -120 + i * 60, h = 90 + 40 * Math.sin(t * 13 + i * 2) + 40 * boil; c.beginPath(); c.moveTo(x - 26, 720); c.quadraticCurveTo(x - 10, 720 - h * .6, x, 720 - h); c.quadraticCurveTo(x + 10, 720 - h * .6, x + 26, 720); c.closePath(); fill(c, i % 2 ? '#60a5fa' : '#93c5fd') }
    // колба
    c.save(); c.beginPath(); c.arc(0, 0, 600, 0, TAU); c.rect(-130, -1350, 260, 900); c.clip();
    c.fillStyle = 'rgba(238,242,247,.08)'; c.fillRect(-620, -1360, 1240, 1980);
    const sy = 110 + 12 * Math.sin(t * 5); c.beginPath(); c.moveTo(-620, sy); for (let x = -620; x <= 620; x += 30) c.lineTo(x, sy + 16 * Math.sin(x / 70 + t * 7) * boil); c.lineTo(620, 640); c.lineTo(-620, 640); c.closePath(); fill(c, WDc.nic);
    c.save(); c.clip(); c.globalAlpha = .25; dotsRect(c, -620, sy, 1240, 600, 34, 4, WDc.nic2); c.restore();
    for (let i = 0; i < 30; i++) { const ph = (t * (.5 + H1(i) * .6) * boil + H1(i * 3)) % 1, x = -440 + H1(i * 7) * 880, y = lp(560, sy + 20, ph); ring(c, x + Math.sin(t * 4 + i) * 16, y, 12 + 16 * H1(i * 5) * (1 - ph * .5), 'rgba(255,255,255,.7)', 5) }
    for (let i = 0; i < 8; i++) { const ph = (t * .35 + H1(i * 4)) % 1; circ(c, -60 + H1(i) * 120, lp(sy - 20, -1300, ph), 30 * (1 - ph), rgba('#fff7e0', .35 * (1 - ph))) }
    c.restore();
    c.beginPath(); c.arc(0, 0, 600, -Math.PI / 2 + .22, Math.PI * 1.5 - .22); c.lineTo(-130, -1350); c.moveTo(130, -1350); c.lineTo(130, -594); lnW(c, 16, WDc.ln);
    c.beginPath(); c.arc(0, 0, 600, -Math.PI / 2 + .22, Math.PI * 1.5 - .22); lnW(c, 16, WDc.ln); c.beginPath(); c.moveTo(-130, -594); c.lineTo(-130, -1350); c.moveTo(130, -594); c.lineTo(130, -1350); lnW(c, 16, WDc.ln);
    c.beginPath(); c.arc(0, 0, 520, Math.PI * 1.1, Math.PI * 1.35); lnW(c, 18, 'rgba(255,255,255,.5)');
    c.beginPath(); c.roundRect(-170, -1400, 340, 60, 16); fill(c, '#7b8098'); lnW(c, 8, WDc.ln);
  }
  const COILD = { x: 1050, y0: -1350, y1: -250 };
  function coilD(c, t) {   // трубка и змеевик к пробирке, капли
    const k = W4;
    c.beginPath(); c.moveTo(0, -1400); c.lineTo(0, -1640); c.quadraticCurveTo(0, -1720, 90, -1720); c.lineTo(COILD.x - 90, -1720); c.quadraticCurveTo(COILD.x, -1720, COILD.x, -1620); c.lineTo(COILD.x, COILD.y0); lnW(c, 34, WDc.ln);
    c.beginPath(); c.moveTo(0, -1400); c.lineTo(0, -1640); c.quadraticCurveTo(0, -1720, 90, -1720); c.lineTo(COILD.x - 90, -1720); c.quadraticCurveTo(COILD.x, -1720, COILD.x, -1620); c.lineTo(COILD.x, COILD.y0); lnW(c, 18, '#3a4066');
    c.beginPath(); c.roundRect(COILD.x - 230, COILD.y0 - 40, 460, COILD.y1 - COILD.y0 + 80, 60); fill(c, 'rgba(147,197,253,.12)'); c.beginPath(); c.roundRect(COILD.x - 230, COILD.y0 - 40, 460, COILD.y1 - COILD.y0 + 80, 60); lnW(c, 10, WDc.ln);
    c.beginPath(); for (let i = 0; i <= 140; i++) { const q = i / 140, y = lp(COILD.y0, COILD.y1, q), x = COILD.x + Math.sin(q * Math.PI * 12) * 150; if (!i) c.moveTo(x, y); else c.lineTo(x, y) } lnW(c, 22, WDc.ln);
    c.beginPath(); c.moveTo(COILD.x, COILD.y1); c.lineTo(COILD.x, COILD.y1 + 260); lnW(c, 22, WDc.ln);
    // поток по змеевику — бегущая точка
    const fl = at(t, k.nik - .5, k.var); for (let j = 0; j < 4; j++) { const q = ((t * .5 + j / 4) % 1) * fl; if (q <= 0) continue; const y = lp(COILD.y0, COILD.y1, q), x = COILD.x + Math.sin(q * Math.PI * 12) * 150; circ(c, x, y, 14, WDc.nic) }
    // пробирка в штативе
    const tx0 = COILD.x, ty0 = 120, ty1 = 860, lv = at(t, k.nik, k.prob + .6);
    c.beginPath(); c.rect(tx0 - 260, 700, 520, 40); fill(c, '#7a4e33'); lnW(c, 6, WDc.ln); c.beginPath(); c.rect(tx0 - 240, 740, 40, 240); c.rect(tx0 + 200, 740, 40, 240); fill(c, '#7a4e33');
    c.save(); c.beginPath(); c.roundRect(tx0 - 80, ty0, 160, ty1 - ty0, [10, 10, 80, 80]); c.clip(); c.fillStyle = 'rgba(238,242,247,.1)'; c.fillRect(tx0 - 80, ty0, 160, ty1 - ty0); c.fillStyle = WDc.nic; c.fillRect(tx0 - 80, ty1 - (ty1 - ty0 - 40) * lv, 160, ty1); c.restore();
    c.beginPath(); c.roundRect(tx0 - 80, ty0, 160, ty1 - ty0, [10, 10, 80, 80]); lnW(c, 12, WDc.ln);
    if (t > k.nik - .2) { const ph = (t * 2.2) % 1; circ(c, tx0, lp(COILD.y1 + 280, ty1 - (ty1 - ty0 - 40) * lv, ph * ph), 16, WDc.nic) }
    const kp = spr(at(t, k.prob - .1, k.prob + .4)); if (kp > 0) plate(c, 'ПРОБИРКА', tx0 + 330, 300, kp, { s: 60, bg: WDc.nic, c: WDc.ink });
    const kn = spr(at(t, k.var - .1, k.var + .4)); if (kn > 0) plate(c, 'СИНТЕТИЧЕСКИЙ НИКОТИН', 400, -2000, kn, { s: 72, bg: '#fff', c: WDc.ink });
  }
  function leafD(c, t) {   // лист табака — и красный круг с чертой
    const k = W4, ka = bo(at(t, k.bez - .3, k.bez + .2)); if (ka <= 0) return;
    c.save(); c.translate(-1000, -350); c.scale(ka, ka); c.rotate(-.35 + .05 * Math.sin(t * 2));
    c.beginPath(); c.moveTo(0, -560); c.bezierCurveTo(330, -420, 380, 220, 0, 520); c.bezierCurveTo(-380, 220, -330, -420, 0, -560); fill(c, WDc.leaf); lnW(c, 10, WDc.ink);
    c.beginPath(); c.moveTo(0, -520); c.lineTo(0, 600); lnW(c, 10, '#a3c76a'); for (let i = 0; i < 5; i++) { const y = -340 + i * 170; c.beginPath(); c.moveTo(0, y + 60); c.quadraticCurveTo(110, y, 210 - i * 20, y - 60); c.moveTo(0, y + 60); c.quadraticCurveTo(-110, y, -210 + i * 20, y - 60); lnW(c, 7, '#a3c76a') }
    c.restore();
    const kx = eo(at(t, k.list - .15, k.list + .25)); if (kx > 0) { c.save(); c.translate(-1000, -350); c.beginPath(); c.arc(0, 0, 640, -Math.PI / 2, -Math.PI / 2 + TAU * kx); lnW(c, 40, WDc.red); if (kx > .6) { const e = cl((kx - .6) / .4); c.beginPath(); c.moveTo(-450, -450); c.lineTo(-450 + 900 * e, -450 + 900 * e); lnW(c, 40, WDc.red) } c.restore() }
    const kt = spr(at(t, k.tab - .1, k.tab + .4)); if (kt > 0) plate(c, 'БЕЗ ТАБАКА', -1000, 450, kt, { s: 70, bg: WDc.red, c: '#fff' });
  }
  const LINE = { x0: 1900, n: 6, dx: 320, w: 170, h: 560 };
  function lineD(c, t) {   // наполнение одноразок и лента к кассе
    const k = W4; if (t < k.kogda - .6) return;
    const run = Math.max(0, t - (k.prin - .1)), shift = run < .6 ? 700 * run * run / 1.2 : 700 * .3 + (run - .6) * 700;
    c.beginPath(); c.moveTo(COILD.x + 80, 840); c.lineTo(LINE.x0 - 200, 840); c.lineTo(LINE.x0 - 200, 300); c.lineTo(LINE.x0 + LINE.dx * (LINE.n - 1) + 60, 300); lnW(c, 26, WDc.ln); c.stroke(); lnW(c, 12, WDc.nic);
    for (let i = 0; i < LINE.n; i++) { const nx = LINE.x0 + i * LINE.dx; c.beginPath(); c.moveTo(nx, 300); c.lineTo(nx, 360); lnW(c, 22, WDc.ln) }
    c.beginPath(); c.roundRect(LINE.x0 - 120, BENCH - 60, 4200, 60, 30); fill(c, '#1b1f36'); lnW(c, 6, WDc.ln);
    for (let i = 0; i < LINE.n; i++) {
      const x = LINE.x0 + i * LINE.dx + shift; if (x > REGD.x + 100) continue;
      const ii = i, tf = k.kogda - .2 + ii * .16, kf = eio(at(t, tf, tf + .4)), yb = BENCH - 60, ka = bo(at(t, k.kogda - .5 + ii * .05, k.kogda - .1 + ii * .05)); if (ka <= 0) continue;
      c.save(); c.translate(x, yb); c.scale(ka, ka);
      c.beginPath(); c.roundRect(-LINE.w / 2, -LINE.h, LINE.w, LINE.h, 40); fill(c, POD_TOP[ii % 5][1]); lnW(c, 8, WDc.ink);
      c.beginPath(); c.roundRect(-LINE.w * .32, -LINE.h - 90, LINE.w * .64, 100, [40, 40, 6, 6]); fill(c, WDc.ink);
      c.beginPath(); c.roundRect(-46, -LINE.h + 70, 92, 300, 20); fill(c, '#1b2138'); c.save(); c.beginPath(); c.roundRect(-46, -LINE.h + 70, 92, 300, 20); c.clip(); c.fillStyle = WDc.nic; c.fillRect(-46, -LINE.h + 370 - 300 * kf, 92, 300); c.restore(); c.beginPath(); c.roundRect(-46, -LINE.h + 70, 92, 300, 20); lnW(c, 6, WDc.ln);
      c.restore();
    }
  }
  const REGD = { x: 4700 };
  function towersD(c, t) {   // три башни старых табачных корпораций вырастают за кассой
    const k = W4; if (t < k.zashli - .4) return;
    [[3900, 3300], [4800, 4300], [5700, 3700]].forEach(([x, h], i) => {
      const tr = [k.star, k.tabn, k.corp][i] - .45, kr = bo(at(t, tr, tr + .6)); if (kr <= 0) return;
      const top = 700 - h * kr;
      c.save(); c.beginPath(); c.rect(x - 420, -6000, 840, 6700); c.clip();
      c.beginPath(); c.rect(x - 380, top, 760, h + 200); fill(c, '#33395c'); lnW(c, 10, WDc.ln);
      c.fillStyle = '#2a2f4d'; c.fillRect(x + 140, top, 240, h + 200);
      for (let r = 0; r < Math.floor(h / 230); r++) for (let q = 0; q < 4; q++) { const lit = H1(i * 50 + r * 4 + q) > .35 ? at(t, tr + .3 + r * .02, tr + .6 + r * .02) : 0; c.fillStyle = mixc('#1b1f36', '#ffd479', lit); c.fillRect(x - 320 + q * 170, top + 420 + r * 230, 110, 140) }
      circ(c, x, top + 210, 170, WDc.gold); ring(c, x, top + 210, 170, WDc.ink, 10);
      c.save(); c.translate(x, top + 210); c.beginPath(); c.moveTo(0, -120); c.bezierCurveTo(80, -90, 90, 50, 0, 120); c.bezierCurveTo(-90, 50, -80, -90, 0, -120); fill(c, WDc.leaf); c.beginPath(); c.moveTo(0, -110); c.lineTo(0, 120); lnW(c, 7, '#a3c76a'); c.restore();
      c.restore();
    });
    const kh = spr(at(t, k.star - .2, k.star + .3)); if (kh > 0) plate(c, 'СТАРЫЕ ТАБАЧНЫЕ КОРПОРАЦИИ', 4800, -4100, kh, { s: 110, bg: WDc.red, c: '#fff' });
    if (t > k.tabn) for (let i = 0; i < 14; i++) { const ph = ((t - k.tabn) * .9 + i / 14) % 1, tx0 = [3900, 4800, 5700][i % 3], ty = 700 - [3300, 4300, 3700][i % 3] + 210;
      const x = lp(REGD.x, tx0, ph), y = lp(300, ty, ph) - Math.sin(Math.PI * ph) * 500; circ(c, x, y, 60, WDc.gold); ring(c, x, y, 46, '#b07d12', 8) }
  }
  function registerD(c, t) {   // касса с табло: 0 → 3 000 000 000 $ в год
    const k = W4, ka = bo(at(t, k.prin - .4, k.prin + .1)); if (ka <= 0) return;
    c.save(); c.translate(REGD.x, BENCH); c.scale(ka, ka);
    c.beginPath(); c.roundRect(-560 + 30, -620 + 40, 1120, 620, 50); fill(c, 'rgba(8,10,24,.35)');
    c.beginPath(); c.roundRect(-560, -620, 1120, 620, 50); fill(c, '#5b4b9a'); lnW(c, 12, WDc.ln);
    for (let r = 0; r < 3; r++) for (let q = 0; q < 5; q++) { c.beginPath(); c.roundRect(-430 + q * 130, -520 + r * 120, 100, 80, 14); fill(c, '#e9e3ff'); lnW(c, 6, WDc.ink) }
    const kd = bo(at(t, k.doll - .1, k.doll + .4)); c.beginPath(); c.rect(-520, -60 + 140 * kd, 1040, 120); fill(c, '#463a7a'); lnW(c, 10, WDc.ln);
    for (let i = 0; i < 9; i++) circ(c, -380 + i * 95, -60 + 140 * kd + 20, 34 * kd, WDc.gold);
    c.beginPath(); c.moveTo(-60, -620); c.lineTo(-60, -880); c.moveTo(60, -620); c.lineTo(60, -880); lnW(c, 24, '#3b3166');
    c.beginPath(); c.roundRect(-760, -1320, 1520, 460, 40); fill(c, '#0b1020'); lnW(c, 12, WDc.ln);
    const v = Math.round(3e9 * eo(at(t, k.mlrd - .2, k.god - .05)) / 1e6) * 1e6, s = '$' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    num(c, s, 0, -1130, { f: 'J', w: 700, s: 150, c: '#7ee787' });
    A(c, at(t, k.god - .2, k.god + .2), () => tx(c, 'В ГОД', 0, -960, { f: 'U', w: 800, s: 70, c: '#7ee787' }));
    c.restore();
  }
  function drawD(c, t, v) {
    if (!W4) w4Words();
    labBgD(c, t, v);
    if (!v || v.x1 > 3000) towersD(c, t);
    flaskD(c, t); coilD(c, t); leafD(c, t);
    if (!v || v.x1 > LINE.x0 - 600) { lineD(c, t); registerD(c, t) }
  }
  function shotD(c, t) {
    const cm = camIn('D', camW(t)), cm2 = camIn('D', camW(t + 1 / 30)), v = viewRect(cm);
    c.fillStyle = WDc.bg; c.fillRect(0, 0, WW, HH);
    layer(c, cm, 1, c => drawD(c, t, v));
    speedLoc(c, cm, cm2, t);
  }
  // ================= СЦЕНА 2 (v18.4): витрина как у Apple #042 → колодка и косое лезвие как у Хованского #127 =================
  // 9.0–9.8: камера ныряет в левую витрину магазина (линии не толстеют, у коробок проявляются детали);
  // 9.9–11.0: едет вдоль полок вправо, мимо простенка, стекло бликует полосами; снизу въезжает красная плашка «ЗАКОН О ВКУСАХ» и пустая клетка с курсором;
  // 11.9–12.7: наезд в значок-снежинку на одноразке — внутри него уже круги зала FDA (как мишень);
  // зал: сливовый фон, круги с печатью, колодка с дырами, 4 картриджа впрыгивают, сбоку серые «разрешённые»;
  // «рубят» — лезвие падает, верхушки улетают, сок брызгает короной и каплями; камера отъезжает — видна рама с лампой.
  const S2 = { bg: '#2b2430', d1: '#312a36', d2: '#383040', d3: '#2f2834', d4: '#3b3343', ln: '#f3e6dc', dim: '#5a4d5f', red: '#e8445a', hole: '#211b25', plate: '#433a49' };
  const pulse2 = (t, a) => at(t, a - .1, a + .05) * (1 - at(t, a + .5, a + .8));
  // ---------- витрина: где окна магазина сцены 1 на экране ----------
  function s1Scr(t, x, y) { const s = 1 + .06 * eio(at(t, K.morph0 + 1.2, K.train1)); const X = 540 + (x - 540) * S1.z, Y = 990 + (y - 990) * S1.z; return [540 + (X - 540) * s, 980 + (Y - 980) * s, S1.z * s] }
  const WIN = { y: 1032.5, h: 235, x0: 350, x1: 540 };   // центры левой и средней витрины (мир сцены 1)
  const EMB = { x: 460 + 22 + 38.667, y: 997 - 27, r: 6.5 };   // значок на 2-й одноразке верхней полки средней витрины
  const ZF = 5.9;
  function boxLOD(c, k, idx) {   // детали одноразки в витрине: мундштук, косая полоса, значок-снежинка
    const e = bo(k); if (e <= 0) return;
    c.save(); c.translate(0, -50); c.scale(e, e); poly(c, [-6.5, 0, -4.5, -8, 4.5, -8, 6.5, 0]); fill(c, '#1f1a24'); poly(c, [-6.5, 0, -4.5, -8, 4.5, -8, 6.5, 0]); lnS(c, 2); c.restore();
    c.save(); rr(c, -11, -50, 22, 50, 7); c.clip(); c.translate(0, -25); c.scale(e, e);
    c.beginPath(); c.moveTo(-12, 13); c.bezierCurveTo(-4, 6, 4, -8, 12, -14); c.lineTo(12, -6); c.bezierCurveTo(4, 0, -4, 14, -12, 22); c.closePath(); fill(c, 'rgba(255,255,255,.22)'); c.restore();
    c.save(); c.translate(0, -27); c.scale(e, e); circ(c, 0, 0, EMB.r, S2.bg); c.beginPath(); c.arc(0, 0, EMB.r, 0, TAU); lnS(c, 1.6);
    c.beginPath(); for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3; c.moveTo(Math.cos(a) * 3.6, Math.sin(a) * 3.6); c.lineTo(-Math.cos(a) * 3.6, -Math.sin(a) * 3.6) } lnS(c, 1.1, '#5eead4'); c.restore();
  }
  function camA(t) {   // камера витрины: экран = P + Z·(p − F) в координатах кадра сцены 1
    const k1 = at(t, K.train0, K.train0 + .8), k2 = eio(at(t, K.train0 + .85, K.train0 + 1.95));
    const W0 = s1Scr(t, WIN.x0, WIN.y), W1 = s1Scr(t, WIN.x1, WIN.y);
    const Z = Math.exp(lp(0, Math.log(ZF), eio(k1))), F = [lp(W0[0], W1[0], k2), lp(W0[1], W1[1], k2)];
    const P = [lp(F[0], 540, eio(k1)), lp(F[1], 980, eio(k1))];
    return { Z, F, P, k1, k2 };
  }
  function glassS2(c, t, k2) {   // блики стекла как у Apple: косые полосы едут быстрее камеры
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = 0; i < 4; i++) { const x0 = 300 + i * 620 - k2 * 2600, w = 70 + (i % 2) * 110; poly(c, [x0, -50, x0 + w, -50, x0 + w - 700, HH + 50, x0 - 700, HH + 50]); fill(c, 'rgba(255,255,255,.055)') }
    c.restore();
  }
  function lawPlateS2(c, t, k2) {   // красная плашка закона и пустая клетка с курсором — въезжает справа вместе с полкой
    const dx = (1 - k2) * 1600, y = 1425; if (dx > 1500) return;
    c.save(); c.translate(dx, 0);
    rr(c, 40, y - 54, 580, 108, 16); fill(c, S2.red); tx(c, 'ЗАКОН О ВКУСАХ', 330, y + 3, { f: 'U', w: 800, s: 44, c: '#fff', mw: 530 });
    c.beginPath(); c.roundRect(650, y - 54, 390, 108, 16); c.setLineDash([16, 12]); c.lineDashOffset = -t * 20; lnS(c, 5, '#f1f5f9'); c.setLineDash([]);
    const kc = at(t, K.law - .85, K.law - .7); if (kc > 0 && Math.floor((t - K.law) * 2.6) % 2 === 0) { c.fillStyle = '#5eead4'; c.fillRect(684, y - 34, 9, 68) }
    const kq = spr(at(t, K.law + .05, K.law + .45)); if (kq > 0) { c.save(); c.translate(845, y + 4); c.scale(kq, kq); tx(c, '?', 0, 0, { f: 'U', w: 800, s: 66, c: '#5eead4' }); c.restore() }
    c.restore();
  }
  // ---------- зал FDA (мир со своей камерой; круги — в точке 540, 1000) ----------
  const HOL = [{ x: 285, col: '#f97316', n: 'МАНГО' }, { x: 455, col: '#ec4899', n: 'ФРУКТЫ' }, { x: 625, col: '#eab308', n: 'ДЕСЕРТ' }, { x: 795, col: '#10b981', n: 'МЯТА' }];
  const SIDE = [{ x: 115, n: 'ТАБАК' }, { x: 965, n: 'МЕНТОЛ' }];
  const PLK = 1000, BL = { YE: 900, SL: .16, x0: 190, x1: 890 };
  const yEdge = x => BL.YE + (x - 540) * BL.SL;
  const TC = () => K.chop;   // удар
  const holeT = i => K.jan + .75 + i * .12, cartT2 = i => Wd('после') + .05 + i * .25, sideT = i => Wd('власти') + .05 + i * .2;
  function sealS2(c, t) {   // печать FDA по кругу: буквы проступают по очереди, круг медленно вращается
    const S = 'FDA · 2 ЯНВАРЯ 2020 · ЗАПРЕТ ВКУСОВ · МИНЗДРАВ США · ', n = S.length * 2, k = at(t, K.jan + .1, K.jan + 1.5);
    c.save(); c.translate(540, PLK); c.rotate(-1.15 + t * .035);
    for (let i = 0; i < n * k; i++) { c.save(); c.rotate(i * TAU / n); tx(c, S[i % S.length], 0, -735, { f: 'O', w: 700, s: 34, c: S2.dim }); c.restore() }
    c.restore();
  }
  function ringsS2(c, t) {
    c.fillStyle = S2.bg; c.fillRect(-1500, -1500, WW + 3000, HH + 3000);
    circ(c, 540, PLK, 860, S2.d1); circ(c, 540, PLK, 640, S2.bg); circ(c, 540, PLK, 600, S2.d2); circ(c, 540, PLK, 420, S2.d3); circ(c, 540, PLK, 230, S2.d4); circ(c, 540, PLK, 9, '#1d1820');
    sealS2(c, t);
  }
  function holeS2(c, x, r, k) {   // круглая пластина колодки с болтами
    if (k <= 0) return; c.save(); c.translate(x, PLK); c.scale(k, k);
    circ(c, 0, 0, r, S2.plate); c.beginPath(); c.arc(0, 0, r, 0, TAU); lnS(c, 4, S2.ln); circ(c, 0, 0, r * .7, S2.hole);
    for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + .5; circ(c, Math.cos(a) * r * .86, Math.sin(a) * r * .86, 3.5, S2.ln) }
    c.restore();
  }
  function cartS2(c, x, col, w, h, o = {}) {   // картридж контуром: мундштук, тёмный корпус, косая заливка вкуса; o.part: 1 — низ под лезвием, 2 — верх
    const top = PLK + 50 - h, mh = h * .22, bt = top + mh;
    c.save();
    if (o.part) { c.beginPath(); if (o.part === 1) { c.moveTo(x - 80, yEdge(x - 80)); c.lineTo(x + 80, yEdge(x + 80)); c.lineTo(x + 80, PLK + 200); c.lineTo(x - 80, PLK + 200) } else { c.moveTo(x - 80, yEdge(x - 80)); c.lineTo(x + 80, yEdge(x + 80)); c.lineTo(x + 80, top - 100); c.lineTo(x - 80, top - 100) } c.closePath(); c.clip() }
    poly(c, [x - w * .36, bt, x - w * .28, top, x + w * .28, top, x + w * .36, bt]); fill(c, '#1f1a24'); poly(c, [x - w * .36, bt, x - w * .28, top, x + w * .28, top, x + w * .36, bt]); lnS(c, 4, S2.ln);
    rr(c, x - w / 2, bt, w, PLK + 50 - bt, w * .16); fill(c, '#241e28');
    c.save(); rr(c, x - w / 2, bt, w, PLK + 50 - bt, w * .16); c.clip(); const B = PLK + 50, H2 = B - bt;
    c.beginPath(); c.moveTo(x - w / 2 - 4, bt + H2 * .5); c.bezierCurveTo(x - w * .1, bt + H2 * .42, x + w * .2, bt + H2 * .2, x + w / 2 + 4, bt + H2 * .08); c.lineTo(x + w / 2 + 4, B + 4); c.lineTo(x - w / 2 - 4, B + 4); c.closePath(); fill(c, col);
    c.fillStyle = 'rgba(255,255,255,.28)'; c.fillRect(x - w / 2 + 12, bt + 14, 8, H2 * .4); c.restore();
    rr(c, x - w / 2, bt, w, PLK + 50 - bt, w * .16); lnS(c, 4, S2.ln);
    c.restore();
    if (o.part === 1 && o.cutCol) { c.beginPath(); c.moveTo(x - w / 2 + 3, yEdge(x - w / 2 + 3)); c.lineTo(x + w / 2 - 3, yEdge(x + w / 2 - 3)); lnS(c, 7, o.cutCol) }
  }
  function checkS2(c, x, y, k) { if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k); circ(c, 0, 0, 24, '#22c55e'); c.beginPath(); c.moveTo(-10, 1); c.lineTo(-3, 9); c.lineTo(11, -8); lnS(c, 5, '#fff'); c.restore() }
  function bladeS2(c, t, dy) {   // широкое лезвие между рельсами: низ косой, надпись по скосу
    const L = BL.x0 + 6, R = BL.x1 - 6, e = x => yEdge(x) + dy, b = x => e(x) - 250;
    poly(c, [L, b(L), R, b(R), R, e(R), L, e(L)]); fill(c, S2.plate);
    poly(c, [L, e(L) - 30, R, e(R) - 30, R, e(R), L, e(L)]); fill(c, '#5a4f62');
    c.beginPath(); c.moveTo(L, e(L) - 30); c.lineTo(R, e(R) - 30); lnS(c, 2.5, S2.ln);
    poly(c, [L, b(L), R, b(R), R, e(R), L, e(L)]); lnS(c, 4, S2.ln);
    c.save(); c.translate(540, e(540) - 130); c.rotate(Math.atan(BL.SL)); tx(c, 'ЗАПРЕТ ВКУСОВ', 0, 0, { f: 'U', w: 800, s: 50, c: S2.red, ls: 2 }); c.restore();
    circ(c, 540, b(540) + 26, 12, S2.hole); c.beginPath(); c.arc(540, b(540) + 26, 12, 0, TAU); lnS(c, 3, S2.ln);
  }
  function frameS2(c, t, k) {   // рама: рельсы, перекладина с печатью FDA, лампа на шнуре; рисуется линиями при отъезде
    if (k <= 0) return;
    c.save(); c.fillStyle = S2.plate; [BL.x0, BL.x1].forEach(x => c.fillRect(x - 12, 432, 24, 898 * eo(k))); c.restore();
    c.save(); dashDraw(c, k, 1100);
    [BL.x0, BL.x1].forEach(x => { c.beginPath(); c.moveTo(x - 14, 1330); c.lineTo(x - 14, 430); c.moveTo(x + 14, 1330); c.lineTo(x + 14, 430); lnS(c, 4, S2.ln) });
    c.beginPath(); c.moveTo(130, 380); c.lineTo(950, 380); c.lineTo(950, 432); c.lineTo(130, 432); c.closePath(); lnS(c, 4, S2.ln);
    c.beginPath(); c.moveTo(-300, 1330); c.lineTo(1380, 1330); lnS(c, 4, S2.ln);
    c.beginPath(); c.moveTo(540, -400); c.lineTo(540, 250); lnS(c, 3, S2.ln);
    c.restore();
    const kp = bo(at(k, .4, 1)); if (kp > 0) {
      c.save(); c.translate(540, 250); c.scale(kp, kp); c.beginPath(); c.arc(0, 36, 40, Math.PI, 0); c.closePath(); fill(c, S2.plate); c.beginPath(); c.arc(0, 36, 40, Math.PI, 0); c.closePath(); lnS(c, 4, S2.ln); circ(c, 0, 40, 9, '#fde68a'); c.restore();
      poly(c, [540 - 26, 290, 540 + 26, 290, 540 + 170, 382, 540 - 170, 382]); fill(c, rgba('#fde68a', .1 * kp));
      c.save(); c.translate(540, 406); c.scale(kp, kp); circ(c, 0, 0, 40, '#d4a017'); c.beginPath(); c.arc(0, 0, 40, 0, TAU); lnS(c, 4, S2.ln); tx(c, 'FDA', 0, 2, { f: 'U', w: 800, s: 24, c: '#3b2a05' }); c.restore();
    }
  }
  function splashS2(c, t, x, col, i) {   // сок из среза: корона с каплями, потом шапочка и подтёки
    const u = t - TC() - i * .03; if (u <= 0) return;
    const yc = yEdge(x), Hj = 165 * (1 - Math.exp(-13 * u)) * Math.exp(-1.25 * u) + 16 + 4 * Math.sin(t * 5 + i);
    c.beginPath(); c.moveTo(x - 38, yc + 8);
    for (let k = 0; k <= 6; k++) { const px = x - 34 + k * 11.3, top = yc - Hj * (.55 + .45 * H1(i * 7 + k)) - 7 * Math.sin(t * 9 + k * 1.7); c.lineTo(px, top + (k % 2 ? 10 : 0)) }
    c.lineTo(x + 38, yc + 8); c.closePath(); fill(c, col);
    for (let j = 0; j < 7; j++) {   // капли
      const vy = -(520 + 340 * H1(i * 11 + j)), vx = (H1(i * 13 + j) - .5) * 300, ua = u - j * .02, px = x + vx * ua, py = yc - 30 + vy * ua + 1100 * ua * ua;
      if (ua > 0 && py < yc + 20 && ua < 1.5) circ(c, px, py, 7 + 6 * H1(i * 3 + j), col);
    }
    [-24, 6, 28].forEach((dx, j) => { const L = Math.min(70 + 40 * H1(i * 5 + j), 30 + 160 * u); rr(c, x + dx - 5, yc, 10, L, 5); fill(c, col); const ph = ((t * .8 + H1(i * 9 + j)) % 1); if (L > 60) circ(c, x + dx, yc + L + ph * ph * 120, 6, col) });
  }
  function flyTops(c, t) {   // отрубленные верхушки улетают в стороны и падают за кадр
    const u = t - TC(); if (u <= 0 || u > 1.6) return;
    HOL.forEach((p, i) => {
      const dir = i < 2 ? -1 : 1, vx = dir * (260 + 110 * (i % 2 ? 0 : 1)), dx = vx * u, dy = -380 * u + 1500 * u * u, cx = p.x, cy = yEdge(p.x) - 70;
      if (cy + dy > 2200) return;
      c.save(); c.translate(cx + dx, cy + dy); c.rotate(dir * u * (4 + i)); c.translate(-cx, -cy); cartS2(c, p.x, p.col, 92, 250, { part: 2 }); c.restore();
    });
  }
  function hallCam(t) {   // камера зала: крупно 1,45 → на «власти США» 1,0 (видны серые сбоку) → после удара 0,95 и вверх к раме
    const k1 = eio(at(t, Wd('власти') - .1, Wd('власти') + .6)), k = eio(at(t, TC() + .55, TC() + 1.35));
    return { z: lp(lp(1.45, 1, k1), .95, k), wy: lp(PLK, 905, k), sy: lp(PLK, 960, k), k };
  }
  function hallShot(c, t) {   // зал FDA целиком (его же рисует сцена 3 под свитком)
    const cm = hallCam(t), sh = t > TC() && t < TC() + .5 ? Math.sin((t - TC()) * 70) * 9 * (1 - at(t, TC(), TC() + .5)) : 0;
    c.save(); c.translate(540 + sh, cm.sy); c.scale(cm.z, cm.z); c.translate(-540, -cm.wy);
    ringsS2(c, t);
    c.save(); dashDraw(c, at(t, K.jan + .55, K.jan + 1.1), 700); c.beginPath(); c.moveTo(540, PLK - 8); c.lineTo(-300, PLK - 8); c.moveTo(540, PLK + 8); c.lineTo(-300, PLK + 8); c.moveTo(540, PLK - 8); c.lineTo(1380, PLK - 8); c.moveTo(540, PLK + 8); c.lineTo(1380, PLK + 8); lnS(c, 4, S2.ln); c.restore();
    frameS2(c, t, at(t, TC() + .6, TC() + 1.4));
    HOL.forEach((p, i) => holeS2(c, p.x, 76, spr(at(t, holeT(i), holeT(i) + .45))));
    SIDE.forEach((p, i) => holeS2(c, p.x, 52, spr(at(t, sideT(i) - .1, sideT(i) + .35))));
    SIDE.forEach((p, i) => { const k = spr(at(t, sideT(i), sideT(i) + .45)); if (k <= 0) return; c.save(); c.translate(p.x, PLK); c.scale(k, k); c.translate(-p.x, -PLK); cartS2(c, p.x, '#94a3b8', 64, 170); c.restore();
      checkS2(c, p.x, PLK - 170, spr(at(t, sideT(i) + .3, sideT(i) + .7))); tx(c, p.n, p.x, PLK + 86, { f: 'O', w: 700, s: 26, c: S2.ln, ls: 2, a: k }) });
    const cut = t >= TC(), dropY = cut ? 0 : -950 * (1 - ei(at(t, TC() - .17, TC())));
    HOL.forEach((p, i) => {
      const k = spr(at(t, cartT2(i), cartT2(i) + .5)); if (k <= 0) return;
      c.save(); c.translate(p.x, PLK); c.scale(k, k); c.translate(-p.x, -PLK); cartS2(c, p.x, p.col, 92, 250, cut ? { part: 1, cutCol: p.col } : {}); c.restore();
      const hl = pulse2(t, [K.mango, K.fru, K.des, K.mint][i]), on = Math.max(hl, t > [K.mango, K.fru, K.des, K.mint][i] + .5 ? 1 : 0);
      c.save(); c.translate(p.x, PLK + 112); c.scale(k * (1 + .25 * hl), k * (1 + .25 * hl));
      if (on > 0) { const w = tw(c, p.n, { f: 'O', w: 700, s: 28, ls: 2 }) + 30; rr(c, -w / 2, -24, w, 48, 12); fill(c, p.col) }
      tx(c, p.n, 0, 2, { f: 'O', w: 700, s: 28, c: on > 0 ? '#1d1820' : S2.ln, ls: 2 }); c.restore();
    });
    if (t > TC() - .2) { if (cm.k > 0) { c.save(); dashDraw(c, cm.k, 700); c.beginPath(); c.moveTo(540, yEdge(540) - 250 + dropY); c.lineTo(540, 432); lnS(c, 3, S2.ln); c.restore() } bladeS2(c, t, dropY) }
    if (cut) HOL.forEach((p, i) => splashS2(c, t, p.x, p.col, i));
    flyTops(c, t);
    c.restore();
  }
  // ---------- кадр сцены 2 ----------
  function shot2(c, t) {
    const k3 = at(t, K.jan - .25, K.jan + .55);
    if (k3 >= 1) { hallShot(c, t); return }
    const A = camA(t);
    let Z = A.Z, F = A.F, P = A.P;
    const E = s1Scr(t, EMB.x, EMB.y), Re = EMB.r * E[2];
    if (k3 > 0) {   // наезд в значок: значок едет в точку 540, 1000 и растёт до 1150 px
      const E0 = [P[0] + Z * (E[0] - F[0]), P[1] + Z * (E[1] - F[1])], Ze = 1150 / Re, Z0 = Z;
      Z = Math.exp(lp(Math.log(Z0), Math.log(Ze), ei(k3) * .55 + eio(k3) * .45)); F = E; P = [lp(E0[0], 540, eio(k3)), lp(E0[1], PLK, eio(k3))];
    }
    LWK = 1 / Math.pow(Z, .8); LOD = at(Z, 1.8, 4.2);
    c.save(); c.translate(P[0], P[1]); c.scale(Z, Z); c.translate(-F[0], -F[1]); shot1(c, t); c.restore();
    LWK = 1; LOD = 0;
    if (k3 <= 0) { glassS2(c, t, A.k2); lawPlateS2(c, t, A.k2) }
    else {   // портал: внутри значка — зал FDA целиком, масштаб — по радиусу значка
      const R = Re * Z, cx = P[0], cy = P[1], m = R / 1150;
      c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip(); c.translate(cx, cy); c.scale(m, m); c.translate(-540, -PLK); hallShot(c, t); c.restore();
      c.beginPath(); c.arc(cx, cy, R, 0, TAU); lnS(c, 5, S2.ln);
      const kp = 1 - at(t, K.jan - .25, K.jan + .15); if (kp > 0) lawPlateS2(c, t, 1 + (1 - kp) * .6);
    }
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
  function roller(c, x, y, w, r, ph = 0) {   // серый валик с жёлтыми ручками; ph — поворот (полоски бегут)
    c.save(); c.translate(x, y); c.rotate(r);
    c.save(); c.translate(0, 18); rr(c, -w / 2 + 50, -30, w - 100, 60, 26); fill(c, 'rgba(0,0,0,.3)'); c.restore();
    const g = c.createLinearGradient(0, -38, 0, 38); g.addColorStop(0, '#cbd5e1'); g.addColorStop(.35, '#94a3b8'); g.addColorStop(1, '#475569');
    rr(c, -w / 2 + 50, -37, w - 100, 75, 30); c.fillStyle = g; c.fill();
    c.save(); rr(c, -w / 2 + 50, -37, w - 100, 75, 30); c.clip(); for (let i = 0; i < 4; i++) { const yy = -37 + (((ph * 220 + i * 19) % 75) + 75) % 75; c.fillStyle = 'rgba(30,41,59,.22)'; c.fillRect(-w / 2 + 50, yy, w - 100, 3) } c.restore();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-w / 2 + 70, -26, w - 140, 8);
    [-1, 1].forEach(s => { rr(c, s > 0 ? w / 2 - 56 : -w / 2, -24, 56, 48, 16); fill(c, '#facc15'); rr(c, s > 0 ? w / 2 - 56 : -w / 2, -24, 56, 14, 8); fill(c, '#fde68a') });
    c.restore();
  }
  const SCR = { x: 540, w: 820, top: 260, bot: 1420 };
  const HOLE = { x: 540, y: 960, w: 160, h: 380 };
  function holePath(c, nb) { if (!nb) c.beginPath(); c.roundRect(HOLE.x - HOLE.w / 2, HOLE.y - HOLE.h / 2, HOLE.w, HOLE.h, 40) }
  function blueStamp(c, x, y, k) {   // круглая синяя печать FDA — бьёт сверху
    if (k <= 0) return; const s = lp(2.4, 1, eo(k));
    c.save(); c.translate(x, y); c.rotate(-.22); c.scale(s, s);
    circ(c, 0, 0, 82, 'rgba(239,246,255,.55)'); ring(c, 0, 0, 80, '#1d4ed8', 7); ring(c, 0, 0, 60, '#1d4ed8', 3);
    const R = 'МИНЗДРАВ США · МИНЗДРАВ США · '; for (let i = 0; i < R.length; i++) { c.save(); c.rotate(i * TAU / R.length); tx(c, R[i], 0, -70, { f: 'O', w: 700, s: 13, c: '#1d4ed8' }); c.restore() }
    tx(c, 'FDA', 0, 4, { f: 'U', w: 800, s: 46, c: '#1d4ed8' }); c.restore();
  }
  const kHole = t => eio(at(t, K.whole - .15, K.whole + .4));   // кусок листа внутри пунктира проваливается
  function lawPaper(c, t) {   // бумага закона (видна между валиками), с дырой, когда её «пусто»
    const L = SCR.x - SCR.w / 2, kh = kHole(t);
    c.fillStyle = '#f5efe0'; c.beginPath(); c.rect(L, SCR.top, SCR.w, SCR.bot - SCR.top); if (kh > 0) holePath(c, 1); c.fill('evenodd');
    for (let i = 0; i < 40; i++) { c.fillStyle = 'rgba(120,90,40,.04)'; c.fillRect(L, SCR.top + i * 28, SCR.w, 1) }
    const ta = 1 - at(t, K.zoom0, K.zoom0 + 1);   // при наезде текст свитка тает — буквы не лезут под плашку года
    c.save(); c.globalAlpha *= ta; if (ta > 0) {
    circ(c, 540, 350, 30, '#1e3a8a'); tx(c, 'FDA', 540, 352, { f: 'U', w: 800, s: 16, c: '#fff' });
    tx(c, 'УКАЗ МИНЗДРАВА США · 2020', 540, 410, { f: 'O', w: 700, s: 40, c: '#1e293b', ls: 2, mw: SCR.w - 80 });
    c.fillStyle = '#1e293b'; c.fillRect(L + 60, 440, SCR.w - 120, 4);
    tx(c, 'ПОД ЗАПРЕТ ПОПАДАЮТ ТОЛЬКО:', 540, 500, { f: 'M', w: 800, s: 34, c: '#334155' });
    const km = eio(at(t, K.s3 + 1.9, K.cart - .1));   // маркер по строке про картриджи
    if (km > 0) { rr(c, L + 50, 540, (SCR.w - 100) * km, 56, 8); fill(c, '#fde047'); poly(c, [L + 50 + (SCR.w - 100) * km - 6, 536, L + 50 + (SCR.w - 100) * km + 18, 536, L + 50 + (SCR.w - 100) * km + 6, 600, L + 50 + (SCR.w - 100) * km - 18, 600]); fill(c, km < 1 ? '#facc15' : 'rgba(0,0,0,0)') }
    tx(c, '• ВЕЙПЫ СО СМЕННЫМИ КАРТРИДЖАМИ', 540, 570, { f: 'M', w: 800, s: 36, c: '#0f172a', mw: SCR.w - 110 });
    for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(71,85,105,.28)'; c.fillRect(L + 70, 630 + i * 30, SCR.w - 140 - (i % 2) * 120, 12) }
    for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(71,85,105,.28)'; c.fillRect(L + 70, 1260 + i * 30, SCR.w - 140 - (i % 2) * 160, 12) }
    blueStamp(c, 790, 690, at(t, K.cart - .12, K.cart + .12));
    } c.restore();
    if (kh > 0 && kh < 1) {   // кусок бумаги внутри пунктира уходит вглубь, поворачиваясь
      c.save(); c.translate(HOLE.x, HOLE.y); c.rotate(kh * .9); c.scale(1 - kh, 1 - kh); rr(c, -HOLE.w / 2, -HOLE.h / 2, HOLE.w, HOLE.h, 40); fill(c, mixc('#f5efe0', '#64748b', kh)); c.restore();
    }
    // пунктир дыры: рисуется по кругу, потом бежит
    const kd = at(t, K.cart + .15, K.cart + .75);
    if (kd > 0) { const per = 2 * (HOLE.w + HOLE.h) - 70; c.save(); holePath(c); c.setLineDash(kd < 1 ? [per * kd, per] : [16, 12]); c.lineDashOffset = kd < 1 ? 0 : -t * 60; stroke(c, '#dc2626', 7); c.restore() }
    const kl = spr(at(t, K.whole + .1, K.whole + .6)), zs = t > ZP() ? zoomS(t) : 1, la = 1 - at(960 + 236 * zs, 1380, 1520);   // уходит вниз — тает, не лезет в субтитры
    if (kl > 0 && la > 0) { c.save(); c.globalAlpha *= la; c.translate(540, 1196); c.scale(kl, kl); tx(c, '[ ЦЕЛЬНЫЕ ОДНОРАЗОВЫЕ — ПУСТО ]', 0, 0, { f: 'M', w: 800, s: 32, c: '#dc2626', mw: SCR.w - 80 }); c.restore() }
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
  function conveyor(c, t, k = 1) {   // лента Y 1220–1340, ролики через 140 px; k — выезжает снизу
    if (k <= 0) return; c.save(); c.translate(0, 520 * (1 - k));
    vgrad(c, -40, 1220, WW + 80, 120, ['#334155', '#1e293b', '#0f172a']);
    c.fillStyle = '#475569'; c.fillRect(-40, 1220, WW + 80, 10);
    for (let i = -1; i < 9; i++) { const x = i * 140 + ((t * 180) % 140), y = 1290; circ(c, x, y, 28, '#94a3b8'); circ(c, x, y, 20, '#cbd5e1'); c.save(); c.translate(x, y); c.rotate(t * 6.4); c.fillStyle = '#475569'; c.fillRect(-18, -3, 36, 6); c.restore() }
    c.fillStyle = '#0b1220'; for (let i = 0; i < 3; i++) c.fillRect(120 + i * 380, 1340, 26, 140);
    c.restore();
  }
  function convBoxes(c, t) {   // коробки на ленте, едут вправо 180 px/с
    const t0 = K.shen;
    for (let i = -3; i < 3; i++) {
      if (i === 0) continue;   // центральную рисует морф шлейфа
      const x = 540 + i * 210 + Math.max(0, t - t0 - .2) * 180 * eo(at(t, t0 + .2, t0 + .9)); if (x < -100 || x > WW + 100) continue;
      const kin = eo(at(t, t0 - .07 + (Math.abs(i) - 1) * .06, t0 + .43)); if (kin <= 0) continue;
      vapeBox(c, x - (1 - kin) * (i < 0 ? 700 : -700), 1055, 150, 360, BOXC[(i + 9) % 8], { label: { '-3': 'МАНГО', '-2': 'КОЛА', '-1': 'ВИНОГРАД', '1': 'ЛЁД', '2': 'ЯГОДЫ' }[i] });
    }
  }
  const darkF = t => t < K.lights ? .9 : t < K.lights + .15 ? .6 : t < K.lights + .3 ? .3 : 0;   // свет в цехе включается тремя прожекторами
  function factoryShotOld(c, t) {
    factoryBg(c, t);
    // табличка «JUUL КАРТРИДЖИ» на цепях; крест сбивает её — она улетает вниз за кадр
    const hit = K.juul2 + .32, kf = at(t, hit, hit + 1.1);
    const sx = 540 - 300 * kf * kf, sy = 470 + 1800 * kf * kf, sr = -1.2 * kf;
    if (kf < 1) {
      c.strokeStyle = '#94a3b8'; c.lineWidth = 5; if (kf <= 0) { c.beginPath(); c.moveTo(390, 262); c.lineTo(390, 425); c.moveTo(690, 262); c.lineTo(690, 425); c.stroke() }
      c.save(); c.translate(sx, sy); c.rotate(sr); rr(c, -210, -45, 420, 90, 12); fill(c, '#0f172a'); rr(c, -210, -45, 420, 90, 12); stroke(c, '#f8fafc', 4); tx(c, 'JUUL КАРТРИДЖИ', 0, 2, { f: 'O', w: 700, s: 40, c: '#f8fafc', ls: 2 }); c.restore();
    }
    // крест падает со шлейфом
    const cy = t < hit ? lp(-200, 470, ei(at(t, hit - .32, hit))) : lp(470, 1040, eo(at(t, hit, K.shen - .47)));
    const km = eio(at(t, K.shen - .47, K.shen - .07)), x = 540 + Math.max(0, t - K.shen - .2) * 180 * eo(at(t, K.shen + .2, K.shen + .9));
    if (t > hit - .32 && km < 1 || km >= 1 && t < K.shen - .07) {   // шлейф: верх опускается к крышке коробки, цвет густеет в цвет коробки
      const top = lp(350, 875, km), bot = Math.max(cy, lp(cy, 1235, km));
      if (bot > top) { const B0 = BOXC[0], g = c.createLinearGradient(0, top, 0, bot); g.addColorStop(0, rgba(B0, lp(0, 1, km))); g.addColorStop(.4, rgba(mixc('#f472b6', B0, km), lp(.75, 1, km))); g.addColorStop(1, rgba(mixc('#38bdf8', B0, km), lp(.9, 1, km))); rr(c, x - 75, top, 150, bot - top, lp(40, 10, km)); c.fillStyle = g; c.fill() }
      if (km <= 0) cross3d(c, 540, cy, 1, t * 3);
    }
    sparks(c, t, hit, 540, 470, 18);
    if (km >= 1) vapeBox(c, x, 1055, 150, 360, BOXC[0], { label: 'МАНГО', inner: bo(at(t, K.shen - .07, K.shen + .2)) });   // прямоугольник шлейфа остаётся — на нём проявляются окошко и надпись
    conveyor(c, t, eo(at(t, K.shen - .6, K.shen - .1)));
    convBoxes(c, t);
    const kp = spr(at(t, K.shen + .5, K.shen + 1.1));
    if (kp > 0) { c.strokeStyle = '#94a3b8'; c.lineWidth = 4; c.beginPath(); c.moveTo(380, 262); c.lineTo(380, 560 - 40 * kp); c.moveTo(700, 262); c.lineTo(700, 560 - 40 * kp); c.stroke(); plate(c, 'ШЭНЬЧЖЭНЬ · КОНВЕЙЕР', 540, 560, kp, { s: 34, bg: '#facc15', c: '#0f172a' }) }
    const d = darkF(t); if (d > 0) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(2,6,15,${d})`; c.fillRect(0, 0, WW, HH); c.restore() }
    if (t < K.lights + .35) { const kk = at(t, K.lights, K.lights + .35); [200, 540, 880].forEach((lx, i) => { if (t >= K.lights + i * .15) glow(c, lx, 390, 160, '#e0f2fe', .9 * (1 - kk)) }) }
  }
  const ZP = () => K.scr0 + 1.2;   // свиток раскатан — камера сразу тихо подъезжает (без статики до наезда)
  const zoomS = t => (1 + .06 * eio(at(t, ZP(), K.zoom0 + .8))) * lp(1, 7.5, ei(at(t, K.zoom0, K.zoom1)));   // наезд в дыру: 1 → 7,5, easeInCubic
  function radar(c, t) {   // красные волны радара из центра дыры (в координатах экрана)
    for (let i = 0; i < 4; i++) { const ph = ((t - K.whole) * .8 + i / 4) % 1; if (t < K.whole) break; ring(c, 540, 960, 30 + ph * 900, rgba('#ef4444', .55 * (1 - ph)), 6) }
  }
  function shot3Old(c, t) {
    if (t >= K.zoom1) { factoryShot(c, t); return }
    const s = t > ZP() ? zoomS(t) : 1, zt = () => { c.translate(540, 960); c.scale(s, s); c.translate(-540, -960) };
    // 20.8–22.2: нижний валик едет вниз, всё выше него — дубовый стол поверх зала FDA; верхний встаёт на 260
    const kr = bo(at(t, K.scr0, K.scr0 + .3)), k1 = eio(at(t, K.scr0, K.scr0 + 1.4));
    const y2 = lp(-80, SCR.bot, k1), y1 = Math.min(SCR.top, y2);
    c.save(); zt();
    if (k1 < 1) hallShot(c, t);
    c.save(); if (k1 < 1) { c.beginPath(); c.rect(-200, -200, WW + 400, y2 + 237); c.clip() } oakTable(c, t); c.restore();
    if (kHole(t) > 0) {   // сквозь дыру — тёмный цех и волны радара
      c.save(); holePath(c); c.clip(); c.setTransform(1, 0, 0, 1, 0, 0); factoryShot(c, t); radar(c, t); c.restore();
    }
    if (y2 > y1) {
      c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(SCR.x - SCR.w / 2 + 16, y1 + 20, SCR.w, y2 - y1);
      c.save(); c.beginPath(); c.rect(-200, y1, WW + 400, y2 - y1); c.clip(); lawPaper(c, t); c.restore();
    }
    const ph = k1 * 6, sc = Math.min(1, kr);
    c.save(); c.translate(540, y1); c.scale(sc, sc); roller(c, 0, 0, 860, 0, 0); c.restore();
    c.save(); c.translate(540, y2); c.scale(sc, sc); roller(c, 0, 0, 860, 0, -ph); c.restore();
    c.restore();
  }

  // ================= v18.3 (проба): сцена 3 по Соболеву 0:05.5–0:10 (#112) и Cola 0:11.8–0:15.5 (#005) =================
  // Свиток падает кувырком на зал, встаёт стоймя, валики разъезжаются влево-вправо — между ними указ, камера подъезжает,
  // пока свиток не займёт экран. Пунктир → дыра → наезд в неё. За ней: тёмно-синий фон, JUUL, сверху падает объёмный крест,
  // JUUL падает вниз, оставляя красный след; след — полоса на корпусе большой одноразки, камера отъезжает к ряду на конвейере.
  const S3 = { lr: 1300, hole: { y: 60, w: 120, h: 290 }, paper: '#f3ead6', nav: '#0b1233' };
  function rollerV(c, x, L) {   // вертикальный валик: серый цилиндр, жёлтые наконечники
    c.save(); c.translate(x, 0);
    c.fillStyle = '#7f949c'; c.fillRect(-30, -L / 2, 60, L); c.fillStyle = '#a9bcc2'; c.fillRect(-30, -L / 2, 22, L); c.fillStyle = '#62767e'; c.fillRect(20, -L / 2, 10, L);
    [-1, 1].forEach(sg => { const y = sg * (L / 2 + 12); rr(c, -38, y - 14, 76, 28, 6); fill(c, '#f2c230'); rr(c, -16, y + sg * 14 - (sg < 0 ? 22 : 0), 32, 22, 6); fill(c, '#f2c230'); poly(c, [-6, y + sg * 36, 6, y + sg * 36, 0, y + sg * 54]); fill(c, '#f2c230') });
    c.restore();
  }
  function decreeS3(c, t, gap, ta) {   // бумага указа между валиками (локальные координаты свитка)
    const H = S3.hole, L = S3.lr / 2, kh = kHole(t);
    c.fillStyle = S3.paper; c.beginPath(); c.rect(-gap / 2, -L, gap, 2 * L); if (kh > 0) c.roundRect(-H.w / 2, H.y - H.h / 2, H.w, H.h, 30); c.fill('evenodd');
    for (let i = 0; i < 46; i++) { c.fillStyle = 'rgba(120,90,40,.05)'; c.fillRect(-gap / 2, -L + i * 28, gap, 1) }
    c.save(); c.globalAlpha *= ta; if (ta > 0) {
      circ(c, 0, -470, 24, '#1e3a8a'); tx(c, 'FDA', 0, -469, { f: 'U', w: 800, s: 13, c: '#fff' });
      tx(c, 'УКАЗ МИНЗДРАВА США · 2020', 0, -420, { f: 'O', w: 700, s: 30, c: '#1e293b', ls: 2, mw: 600 });
      c.fillStyle = '#1e293b'; c.fillRect(-300, -396, 600, 3);
      tx(c, 'ПОД ЗАПРЕТ ПОПАДАЮТ ТОЛЬКО:', 0, -356, { f: 'M', w: 800, s: 22, c: '#334155' });
      const km = eio(at(t, K.s3 + 1.9, K.cart - .1));
      if (km > 0) { rr(c, -310, -330, 620 * km, 40, 6); fill(c, '#fde047') }
      tx(c, '• ВЕЙПЫ СО СМЕННЫМИ КАРТРИДЖАМИ', 0, -309, { f: 'M', w: 800, s: 23, c: '#0f172a', mw: 600 });
      for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(71,85,105,.28)'; c.fillRect(-290, -262 + i * 24, 580 - (i % 2) * 110, 9) }
      for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(71,85,105,.28)'; c.fillRect(-290, 300 + i * 24, 580 - (i % 2) * 140, 9) }
      c.save(); c.translate(-30, -50); c.scale(.62, .62); blueStamp(c, 360, -200, at(t, K.cart - .12, K.cart + .12)); c.restore();
    } c.restore();
    if (kh > 0 && kh < 1) { c.save(); c.translate(0, H.y); c.rotate(kh * .9); c.scale(1 - kh, 1 - kh); rr(c, -H.w / 2, -H.h / 2, H.w, H.h, 30); fill(c, mixc(S3.paper, '#334155', kh)); c.restore() }
    const kd = at(t, K.cart + .15, K.cart + .75);
    if (kd > 0) { const per = 2 * (H.w + H.h) - 50; c.save(); c.beginPath(); c.roundRect(-H.w / 2, H.y - H.h / 2, H.w, H.h, 30); c.setLineDash(kd < 1 ? [per * kd, per] : [12, 9]); c.lineDashOffset = kd < 1 ? 0 : -t * 45; stroke(c, '#dc2626', 5); c.restore() }
    const kl = spr(at(t, K.whole + .1, K.whole + .6));
    if (kl > 0) { c.save(); c.globalAlpha *= ta; c.translate(0, 235); c.scale(kl, kl); tx(c, '[ ЦЕЛЬНЫЕ ОДНОРАЗОВЫЕ — ПУСТО ]', 0, 0, { f: 'M', w: 800, s: 22, c: '#dc2626', mw: 560 }); c.restore() }
  }
  function shot3(c, t) {
    if (t >= K.zoom1) { factoryShot(c, t); return }
    const T = K.scr0, kf = at(t, T, T + .75), land = T + .75;
    const gx = lp(1060, 540, eo(kf)), gy = lp(-760, 960, kf * kf);
    const ul = t - land, r = t < land ? lp(-2.3, .22, kf) : .22 * Math.exp(-6 * ul) * Math.cos(11 * ul);
    const gap = lp(0, 700, eio(at(t, T + .95, T + 1.85)));
    const z0 = lp(1, 1.6, eio(at(t, T + 1.2, T + 2.1))) * (1 + .04 * eio(at(t, T + 2.1, K.zoom0 + .8)));
    const d = lp(1, 7.5, ei(at(t, K.zoom0, K.zoom1))), hx = 540, hy = 960 + S3.hole.y * z0;
    hallShot(c, t);
    c.save(); c.translate(hx, hy); c.scale(d, d); c.translate(-hx, -hy);
    c.translate(540, 960); c.scale(z0, z0); c.translate(gx - 540, gy - 960); c.rotate(r);
    if (kHole(t) > 0) { c.save(); c.beginPath(); c.roundRect(-S3.hole.w / 2, S3.hole.y - S3.hole.h / 2, S3.hole.w, S3.hole.h, 30); c.clip(); c.setTransform(1, 0, 0, 1, 0, 0); factoryShot(c, t); c.restore() }
    if (gap > 0) decreeS3(c, t, gap, 1 - at(t, K.zoom0, K.zoom0 + 1));
    rollerV(c, -gap / 2 - 30, S3.lr); rollerV(c, gap / 2 + 30, S3.lr);
    c.restore();
  }
  // ---------- за дырой: #005 ----------
  function cross3dS(c, x, y, s, r) {   // небольшой объёмный крест: синий, светлая грань
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const arm = (a) => { c.save(); c.rotate(a); c.save(); c.translate(10, 10); rr(c, -26, -80, 52, 160, 8); fill(c, '#16245c'); c.restore(); rr(c, -26, -80, 52, 160, 8); fill(c, '#2f4fae'); rr(c, -26, -80, 18, 160, 8); fill(c, '#5d7fe0'); c.restore() };
    arm(Math.PI / 4); arm(-Math.PI / 4); c.restore();
  }
  function vapeRow(c, x, yb, w, h, col, o = {}) {   // одноразка контуром, полоса слева цветом
    const top = yb - h, mw = w * .56, mh = 62;
    c.save(); c.translate(x, 0);
    rr(c, -w / 2, top, w, h, 30); fill(c, S3.nav);
    const k = o.k ?? 1, sf = o.full ? 1 : k;
    c.save(); rr(c, -w / 2, top, w, h, 30); c.clip(); c.fillStyle = col; c.fillRect(-w / 2, yb - h * sf - 20, w * .3, h * sf + 40); c.restore();
    c.save(); rr(c, -w / 2, top, w, h, 30); if (k < 1) c.setLineDash([2 * (w + h) * k, 3000]); lnS(c, 5, '#e2e8f0'); c.restore();
    if (k > .5) { const k2 = (k - .5) * 2; rr(c, -mw / 2, top - mh + 6, mw, mh, 16); fill(c, S3.nav); c.save(); rr(c, -mw / 2, top - mh + 6, mw, mh, 16); if (k2 < 1) c.setLineDash([2 * (mw + mh) * k2, 3000]); lnS(c, 5, '#e2e8f0'); c.restore() }
    if (o.label && k >= 1) tx(c, o.label, w * .1, yb - 40, { f: 'O', w: 700, s: 20, c: '#e2e8f0', mw: w * .62 });
    if (o.tag > 0) { c.save(); c.translate(w * .14, top + h * .62); c.rotate(-.12); c.scale(o.tag, o.tag); rr(c, -70, -24, 140, 48, 8); fill(c, '#e8445a'); tx(c, 'ШЭНЬЧЖЭНЬ', 0, 2, { f: 'O', w: 700, s: 22, c: '#fff' }); c.restore() }
    c.restore();
  }
  function beltS3(c, t, run) {   // лента: верх Y 1220 серый, ниже тёмная (в это же переходит волна сцены 4)
    vgrad(c, -60, 1220, WW + 120, 760, ['#1f2937', '#0b0f19']); c.fillStyle = '#475569'; c.fillRect(-60, 1220, WW + 120, 12);
    for (let i = -1; i < 9; i++) { const x = i * 140 + ((run * 140) % 140), y = 1290; ring(c, x, y, 26, '#64748b', 5); c.save(); c.translate(x, y); c.rotate(run * 5.5); c.beginPath(); c.moveTo(-18, 0); c.lineTo(18, 0); lnS(c, 4, '#64748b'); c.restore() }
  }
  function factoryShot(c, t) {
    const hit = K.juul2 + .32, sh = K.shen;
    c.fillStyle = S3.nav; c.fillRect(-200, -200, WW + 400, HH + 400);
    // JUUL и крест
    const uj = Math.max(0, t - hit), jy = 900 + 2000 * uj * uj, jr = .5 * uj;
    if (jy < 2200) { c.save(); c.translate(540, jy); c.rotate(jr); tx(c, 'JUUL', 0, 0, { f: 'U', w: 800, s: 170, c: '#e8445a', ls: 6 }); tx(c, 'КАРТРИДЖИ · ВКУСЫ', 0, 120, { f: 'O', w: 700, s: 30, c: '#94a3b8', ls: 4 }); c.restore() }
    const kc = at(t, hit - .62, hit), cy = t < hit ? lp(-200, 790, kc * kc) : 790 + 2300 * uj * uj, cr = t * 4.2;
    if (cy < 2200) { for (let i = 0; i < 12; i++) { const ph = H1(i * 3.3), dx = (ph - .5) * 90, dy = -40 - H1(i * 7.1) * 160 - ((t * 120 + i * 13) % 60); circ(c, 540 + dx + Math.sin(t * 6 + i) * 6, cy + dy, 3 + H1(i) * 3, i % 3 ? 'rgba(232,68,90,.8)' : 'rgba(241,245,249,.8)') }
      cross3dS(c, 540, cy, .8, cr) }
    sparks(c, t, hit, 540, 800, 14, '#f1f5f9');
    // след → полоса большой одноразки → отъезд к ряду на ленте
    const VW = 170, VH = 470, VB = 1220, sx = 540 - VW / 2 + VW * .15, sy = VB - VH / 2;
    const zb = lp(3.2, 1, eio(at(t, sh - .1, sh + .6))), u = (zb - 1) / 2.2;
    const run = Math.max(0, t - (sh + .6)) * eo(at(t, sh + .6, sh + 1.2)) * 140 / 140;
    const kb = at(t, hit + .05, sh - .47);   // ширина следа
    c.save();
    const px = lp(sx, 540, u), py = lp(sy, 960, u); c.translate(px, py); c.scale(zb, zb); c.translate(-sx, -sy);
    if (t >= sh - .47) {
      const ko = eo(at(t, sh - .47, sh - .05)), off = 140 * Math.max(0, t - (sh + .6)) * eo(at(t, sh + .6, sh + 1.2));
      c.save(); poly(c, [-400, 1500, 500, -200, 980, -200, 80, 1500]); c.clip(); c.fillStyle = '#14215a'; c.fillRect(-400, lp(1500, -200, ko), 1500, 1800); c.restore();
      c.save(); c.beginPath(); c.rect(-400, 1200, 1900, 1000); c.clip(); c.translate(0, 700 * (1 - ko)); beltS3(c, t, off / 140); c.restore();
      for (let i = -4; i <= 4; i++) {
        if (i === 0) continue;
        const x = ((540 + i * 240 + off + 540) % 2160 + 2160) % 2160 - 540;
        vapeRow(c, x, VB, VW, VH, BOXC[(i + 8) % 8], { k: ko, label: ['МАНГО', 'КОЛА', 'ВИНОГРАД', 'ЛЁД', 'ЯГОДЫ', 'ДЫНЯ', 'ЛИЧИ', 'МЯТА'][(i + 8) % 8] });
      }
      vapeRow(c, 540 + off, VB, VW, VH, '#e8445a', { k: ko, label: 'МАНГО', tag: bo(at(t, sh + .4, sh + .75)), full: 1 });
    } else if (kb > 0) {
      const w = lp(14, VW * .3, kb), top = lp(900, -400, eo(at(t, hit + .25, hit + .8)));
      c.fillStyle = '#e8445a'; c.fillRect(sx - w / 2, Math.min(top, 900), w, Math.max(jy, 1900) - Math.min(top, 900));
    }
    c.restore();
  }
  // ================= СЦЕНА 4 (v18.4): конвейер → волна как у Coca-Cola #007 → лист отчёта как у Мадонны #109 =================
  // Волна плоская, как у Боба: красный гребень, белая пена, тёмно-синяя толща с пунктиром течений, ниже — второй вал светлее.
  // Небо — ровный тёмно-синий с точками звёзд. Кораблик контуром, контейнеры PUFF / HQD / ELF впрыгивают на названия.
  // Волна сжимается в шапку листа (те же три полосы), лист — светло-серый, второй белый лист лежит под ним, фон ровный, как у Мадонны.
  const S4 = { sky: '#151d3b', red: '#e8445a', foam: '#f1f5f9', sea: '#1d2b5c', sea2: '#26387a', ln: '#f1f5f9', desk: '#363a5e', brick: '#3f4469', sheet: '#e7e7ee' };
  function stormBg(c, t) {   // небо: ровный цвет, точки звёзд, контурные облака (как в сцене 1)
    c.fillStyle = S4.sky; c.fillRect(-300, -300, WW + 600, HH + 600);
    for (let i = 0; i < 40; i++) { const x = H1(i * 3.7) * WW, y = H1(i * 7.3) * 1100, r = 2 + H1(i * 1.9) * 2.5; circ(c, x, y, r, rgba('#e2e8f0', .35 + .3 * Math.sin(t * 2 + i))) }
    cloudS1(c, 230 + Math.sin(t * .2) * 14, 330, 1, 1); cloudS1(c, 820 + Math.sin(t * .25 + 1) * 14, 470, .8, 1);
  }
  const WV = { x0: 0, x1: WW };
  function waveY(t, x, A, base, cx) {   // поверхность: горб-гребень + рябь
    const d = (x - cx) / 330; return base - A * Math.exp(-d * d) * (1 + .12 * Math.sin(t * 2)) - A * .16 * Math.sin(x * .012 + t * 3) - 14 * Math.sin(x * .03 - t * 4);
  }
  function wave(c, t, A, base, cx, o = {}) {   // красный гребень, белая пена, синяя толща с пунктиром; второй вал ниже
    const pts = []; for (let x = -80; x <= WW + 80; x += 20) pts.push([x, waveY(t, x, A, base, cx)]);
    const rb = o.rb ?? 84, wb = o.wb ?? 26, da = o.da ?? 1;
    const band = (off, col) => { c.beginPath(); c.moveTo(-80, HH + 400); pts.forEach(p => c.lineTo(p[0], p[1] + off)); c.lineTo(WW + 80, HH + 400); c.closePath(); fill(c, col) };
    band(0, o.cc || S4.red); band(rb, o.cw || S4.foam); band(rb + wb, o.b0 || S4.sea);
    if (da > 0) {   // пунктир течений — вертикальные струйки, бегут вниз
      c.save(); c.beginPath(); c.moveTo(-80, HH + 400); pts.forEach(p => c.lineTo(p[0], p[1] + rb + wb + 24)); c.lineTo(WW + 80, HH + 400); c.closePath(); c.clip();
      c.setLineDash([16, 18]); c.lineDashOffset = -t * 40; c.strokeStyle = rgba('#e2e8f0', .3 * da); c.lineWidth = 4;
      for (let i = 0; i < 14; i++) { const x = 40 + i * 78; c.beginPath(); c.moveTo(x, 0); c.bezierCurveTo(x + 20, 700, x - 20, 1300, x + 10, HH + 300); c.stroke() }
      c.restore();
    }
    if (o.front !== false) {   // второй вал — светлее, качается в противофазе
      const fy = x => Math.max(waveY(t, x, A, base, cx) + rb + wb + 160, base + 280 + 60 * Math.sin(x * .006 - t * 1.6) + 30 * Math.sin(x * .017 + t * 2.2));
      c.beginPath(); c.moveTo(-80, HH + 400); for (let x = -80; x <= WW + 80; x += 20) c.lineTo(x, fy(x)); c.lineTo(WW + 80, HH + 400); c.closePath(); fill(c, o.b1 || S4.sea2);
    }
    c.save(); c.beginPath(); pts.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0], p[1])); c.globalAlpha *= o.hl ?? 1; lnS(c, 5, '#ffd6dc'); c.restore();
  }
  function ship(c, x, y, r, t) {   // контейнеровоз контуром: тёмный корпус, красная полоса, рубка, контейнеры впрыгивают
    c.save(); c.translate(x, y); c.rotate(r);
    poly(c, [-175, -40, 175, -40, 145, 34, -155, 34]); fill(c, '#1b2142'); c.fillStyle = S4.red; c.fillRect(-160, 10, 312, 14); poly(c, [-175, -40, 175, -40, 145, 34, -155, 34]); lnS(c, 5);
    rr(c, 94, -112, 54, 72, 6); fill(c, '#1b2142'); rr(c, 94, -112, 54, 72, 6); lnS(c, 5); c.fillStyle = '#5eead4'; c.fillRect(102, -98, 38, 10); c.beginPath(); c.moveTo(121, -112); c.lineTo(121, -140); lnS(c, 5);
    [['PUFF', '#ec4899', Math.max(K.puff, K.s4 + .75)], ['HQD', '#2563eb', Math.max(K.hqd, K.s4 + 1)], ['ELF', '#a855f7', K.elf]].forEach(([s, col, tt0], i) => {
      const k = spr(at(t, tt0 - .05, tt0 + .35)); if (k <= 0) return;
      c.save(); c.translate(-118 + i * 98, -73); c.translate(0, -(1 - k) * 120); rr(c, -47, -32, 95, 65, 5); fill(c, col);
      c.beginPath(); for (let j = 0; j < 5; j++) { c.moveTo(-34 + j * 17, -24); c.lineTo(-34 + j * 17, 24) } lnS(c, 3, 'rgba(0,0,0,.22)');
      rr(c, -47, -32, 95, 65, 5); lnS(c, 4); tx(c, s, 0, 2, { f: 'U', w: 800, s: 22, c: '#fff' }); c.restore();
    });
    c.restore();
  }
  function deskBg(c, t) {   // ровный фон, как у Мадонны: бледные кирпичи, контурные скрепки и ручка
    c.fillStyle = S4.desk; c.fillRect(-300, -300, WW + 600, HH + 600);
    [[120, 210], [190, 250], [860, 160], [930, 200], [80, 1500], [150, 1540], [900, 1430], [980, 1470], [960, 760], [70, 900]].forEach(([x, y], i) => { rr(c, x - 60, y - 16, 120, 32, 6); fill(c, S4.brick) });
    c.save(); c.translate(985, 520); c.rotate(.55); rr(c, -11, -170, 22, 340, 8); lnS(c, 4, rgba('#e2e8f0', .45)); c.beginPath(); c.moveTo(-11, 170); c.lineTo(0, 205); c.lineTo(11, 170); lnS(c, 4, rgba('#e2e8f0', .45)); c.restore();
    for (let i = 0; i < 2; i++) { c.save(); c.translate(95 + i * 40, 1290 - i * 24); c.rotate(.3 + i * .5); rr(c, -26, -9, 52, 18, 9); lnS(c, 4, rgba('#e2e8f0', .45)); c.restore() }
  }
  const RP = { x: 540, y: 830, w: 840, h: 980, r: -.0524 };   // шапка 260–340, лист 340–1320; лист отчёта: −3°
  function report(c, t, ku, o = {}) {   // ku — лист разворачивается вниз из шапки
    c.save(); c.translate(RP.x, RP.y); c.rotate(RP.r);
    const top = -RP.h / 2, hh = RP.h * ku;
    const k2 = eo(at(t, FL0() + .5, FL0() + 1.1));   // второй лист под низом — выезжает справа, как у Мадонны
    if (k2 > 0) { c.save(); c.translate(40 + 900 * (1 - k2), 26); c.rotate(.085); c.translate(10, 14); rr(c, -RP.w / 2, top - 60, RP.w, RP.h + 40, 8); fill(c, 'rgba(0,0,0,.25)'); c.translate(-10, -14); rr(c, -RP.w / 2, top - 60, RP.w, RP.h + 40, 8); fill(c, '#fbfbfd'); c.restore() }
    c.save(); c.translate(12, 16); rr(c, -RP.w / 2, top, RP.w, hh, 8); fill(c, 'rgba(0,0,0,.28)'); c.restore();
    rr(c, -RP.w / 2, top, RP.w, hh, 8); fill(c, S4.sheet);
    c.save(); rr(c, -RP.w / 2, top, RP.w, hh, 8); c.clip();
    tx(c, 'ДОЛЯ ОДНОРАЗОК У ПАРЯЩИХ СТАРШЕКЛАССНИКОВ', 0, top + RP.h - 92, { f: 'M', w: 800, s: 26, c: '#4b4f72', mw: RP.w - 80 });
    const BY = 1180 - RP.y, x19 = 360 - RP.x, x20 = 720 - RP.x;
    c.fillStyle = '#d4d4de'; for (let i = 1; i < 5; i++) c.fillRect(-RP.w / 2 + 60, BY - i * 160, RP.w - 120, 3);
    c.fillStyle = '#363a5e'; c.fillRect(-RP.w / 2 + 50, BY, RP.w - 100, 6);
    const k19 = bo(at(t, K.par - .1, K.par + .45)), k20 = bo(at(t, K.vyr - .15, K.vyr + .55));
    const bar = (x, hgt, col, k, yr, lab, labA) => {
      const h = hgt * k, R = 48; if (h > 1) { rr(c, x - 80, BY - h, 160, h, 10); fill(c, col) }
      circ(c, x, BY - h, R, col); circ(c, x, BY - h, R - 8, '#fff'); tx(c, yr, x, BY - h + 2, { f: 'O', w: 700, s: 30, c: col === '#ef4444' ? '#b91c1c' : '#363a5e' });
      if (labA > 0) tx(c, lab, x, BY - h - 80, { f: 'U', w: 800, s: 40, c: col === '#ef4444' ? '#dc2626' : '#4b4f72', a: labA });
      return BY - h;
    };
    if (ku > .9) {
      bar(x19, 75, '#7c80a3', Math.max(.02, k19), '2019', '2,4%', at(t, K.par + .2, K.par + .5));
      const ty = o.hideBar ? BY - 720 : bar(x20, 720, '#ef4444', Math.max(.02, k20), '2020', '', 0);
      const kl = spr(at(t, K.x11 - .1, K.x11 + .4));
      if (kl > 0) { c.save(); c.translate(x20 - 250, ty + 40); c.scale(kl, kl); rr(c, -150, -70, 300, 140, 16); fill(c, '#ef4444'); tx(c, '26,5%', 0, -20, { f: 'U', w: 800, s: 50, c: '#fff' }); tx(c, 'РОСТ ×11', 0, 34, { f: 'O', w: 700, s: 34, c: '#fee2e2', ls: 2 }); c.restore() }
    }
    tx(c, 'ОФИЦИАЛЬНЫЙ ОТЧЁТ США · CDC', 0, top + RP.h - 50, { f: 'O', w: 500, s: 24, c: '#8a8eb0', ls: 2, a: ku > .95 ? 1 : 0 });
    c.restore();
    // шапка — бывшая волна: красная полоса, белая нитка пены, синяя полоса
    if (!o.noHead) { rr(c, -RP.w / 2, top - 80, RP.w, 80, 10); fill(c, S4.sea); c.save(); rr(c, -RP.w / 2, top - 80, RP.w, 80, 10); c.clip(); c.fillStyle = S4.red; c.fillRect(-RP.w / 2, top - 80, RP.w, 34); c.fillStyle = S4.foam; c.fillRect(-RP.w / 2, top - 46, RP.w, 6); c.restore() }
    const kt = spr(at(t, K.vsego + .2, K.vsego + .6)); if (kt > 0) { c.save(); c.translate(0, top - 20); c.scale(kt, kt); tx(c, 'ОПРОС ШКОЛЬНИКОВ США', 0, 2, { f: 'O', w: 700, s: 28, c: '#fff', ls: 3 }); c.restore() }
    c.restore();
  }
  const FL0 = () => K.vsego - .39;   // 38.4: волна начинает сжиматься в шапку
  const kSheet = t => eo(at(t, FL0() + .15, FL0() + 1));
  const deskS = t => 1 + .05 * at(t, FL0() + 1, K.s5);
  function deskShot(c, t, o = {}) { const s = deskS(t); c.save(); c.translate(540, 830); c.scale(s, s); c.translate(-540, -830); deskBg(c, t); report(c, t, kSheet(t), o); c.restore() }
  function shot4(c, t) {
    const T0 = K.s4 - .49, pc = at(t, T0, T0 + 1);   // 33.5–34.5: лента конвейера поднимается и становится гребнем волны
    const kf = eio(at(t, FL0(), FL0() + 1));        // 38.4–39.4: волна сжимается в шапку листа
    const kd = eo(at(t, T0 + 1, T0 + 1.7)), cx = lp(300, 640, at(t, K.s4, K.vsego));
    const amp = (pc < 1 ? lp(0, 260, pc) : lp(260, 380, kd)) * (1 - kf), base = pc < 1 ? lp(1220, 650, pc) : lp(650, 1060, kd);
    if (kf >= 1) { deskShot(c, t); return }
    if (kf <= 0) {
      stormBg(c, t);
      if (pc < 1) { c.save(); c.translate(0, -1200 * pc); c.beginPath(); c.rect(-200, -400, WW + 400, 1620); c.clip(); factoryShot(c, t); c.restore() }   // цех и ряд одноразок уезжают вверх
      wave(c, t, amp, base, cx, pc < 1 ? { cc: mixc('#475569', S4.red, pc), cw: mixc('#1f2937', S4.foam, pc), b0: mixc('#1f2937', S4.sea, pc), b1: mixc('#0b0f19', S4.sea2, pc), rb: lp(12, 84, pc), wb: lp(0, 26, pc), da: pc, hl: pc } : {});
      const u = at(t, T0 + 1, K.vsego - .35), sx = -220 + 1570 * (1 - Math.pow(1 - u, 2.5));
      if (pc >= 1 && u < 1) { const sy = waveY(t, sx, amp, base, cx) - 46, d = waveY(t, sx + 10, amp, base, cx) - waveY(t, sx - 10, amp, base, cx); ship(c, sx, sy, Math.atan2(d, 20), t) }
      return;
    }
    // волна не исчезает: амплитуда в 0, ширина 1080 → 840, верх → 260, низ → 340 — это шапка «ОПРОС ШКОЛЬНИКОВ США» (те же полосы);
    // одновременно из-под неё разворачивается лист
    deskShot(c, t, { noHead: true });
    const yS = lp(base, 260, kf), yTop = lp(-300, 260, kf), yBot = lp(HH + 300, 340, kf), xL = lp(-200, 120, kf), xR = lp(WW + 200, 960, kf), s = deskS(t);
    c.save(); c.translate(540, 830); c.scale(s, s); c.translate(-540, -830); c.translate(540, 830); c.rotate(RP.r * kf); c.translate(-540, -830);
    c.beginPath(); c.roundRect(xL, yTop, xR - xL, yBot - yTop, 10 * kf); c.clip();
    stormBg(c, t);
    wave(c, t, amp, yS, cx, { rb: lp(84, 34, kf), wb: lp(26, 6, kf), hl: 1 - kf, da: 1 - kf, front: kf < .5 });
    c.restore();
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
    const { x, y, w, h } = TK, k = o.k ?? 1, L = x - w / 2, T = y - h / 2, dr = o.draw ?? 1;
    c.save();
    if (dr >= 1) { rr(c, L, T, w, h, 60); fill(c, 'rgba(186,230,253,.08)') }
    if (k > 0) {
      c.save(); rr(c, L + 10, T + 10, w - 20, h - 20, 52); c.clip();
      const lv = T + h - 10 - 420 * k, mid = T + h * .56, wv = (ph, amp) => x0 => Math.sin(x0 * .018 + t * 3.2 + ph) * amp;
      const top = wv(0, 16 * k), md = wv(Math.PI, 14 * k);
      c.beginPath(); c.moveTo(L, HH); for (let xx = L; xx <= L + w; xx += 10) c.lineTo(xx, Math.max(lv, mid) + md(xx) * (lv < mid ? 1 : 0)); c.lineTo(L + w, HH); c.closePath();
      const gb = c.createLinearGradient(0, mid, 0, T + h); gb.addColorStop(0, '#22d3ee'); gb.addColorStop(1, '#0891b2'); c.fillStyle = gb; c.fill();
      if (lv < mid) { c.beginPath(); for (let xx = L; xx <= L + w; xx += 10) c.lineTo(xx, lv + top(xx)); for (let xx = L + w; xx >= L; xx -= 10) c.lineTo(xx, mid + md(xx)); c.closePath(); const go = c.createLinearGradient(0, lv, 0, mid); go.addColorStop(0, '#fbbf24'); go.addColorStop(1, '#f59e0b'); c.fillStyle = go; c.fill() }
      for (let i = 0; i < 5; i++) { const ix = L + 70 + i * 66, iy = Math.max(T + h * .75 + Math.sin(t * 2 + i) * 14 + (i % 2) * 40, Math.max(lv, mid) + 34 + i % 2 * 20); if (iy > T + h - 40) continue; c.save(); c.translate(ix, iy); c.rotate(.3 + i); rr(c, -22, -22, 44, 44, 8); fill(c, 'rgba(240,249,255,.75)'); rr(c, -22, -22, 44, 44, 8); stroke(c, '#fff', 2); c.restore() }
      for (let i = 0; i < 10; i++) { const by = T + h - ((t * 120 + i * 70) % (h * .5)); if (by > lv + 12) circ(c, L + 40 + H1(i) * (w - 80), by, 5 + H1(i * 3) * 5, 'rgba(255,255,255,.45)') }
      c.restore();
    }
    c.save(); if (dr < 1) { const per = 2 * (w + h) - 100; c.setLineDash([per * dr, per]) } rr(c, L, T, w, h, 60); stroke(c, 'rgba(224,242,254,.85)', 8); c.restore();
    if (dr >= 1) { c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(L + 30, T + 60, 18, h - 120) }
    c.save(); c.translate(x, T - 33); c.scale(dr, dr); rr(c, -60, -37, 120, 74, 14); fill(c, '#111827'); c.restore();
    c.restore();
  }
  function mintLeaf(c, x, y, s, r) { c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(50, -46, 110, 0); c.quadraticCurveTo(50, 46, 0, 0); fill(c, '#10b981'); c.strokeStyle = '#d1fae5'; c.lineWidth = 3; c.beginPath(); c.moveTo(4, 0); c.lineTo(104, 0); c.stroke(); for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(i * 22, 0); c.lineTo(i * 22 + 14, -16); c.moveTo(i * 22, 0); c.lineTo(i * 22 + 14, 16); c.stroke() } c.restore() }
  const BAGS = [['МАНГО', '#f59e0b'], ['АРБУЗ', '#f43f5e'], ['ХЛАДАГЕНТ WS-23', '#22d3ee'], ['КОЛА', '#7c2d12'], ['СОЛЬ 50 МГ', '#e2e8f0']];
  function ivBag(c, x, y, lab, col, sw, glowA) {   // медицинский пакет 155×230 на крючке
    c.save(); c.translate(x, y); c.rotate(sw);
    c.strokeStyle = '#94a3b8'; c.lineWidth = 5; c.beginPath(); c.arc(0, -16, 14, Math.PI, 0); c.lineTo(14, 0); c.stroke();
    if (glowA > 0) glow(c, 0, 120, 200, '#22d3ee', .5 * glowA);
    rr(c, -77, 0, 155, 230, 26); fill(c, 'rgba(241,245,249,.30)'); c.save(); rr(c, -77, 0, 155, 230, 26); c.clip(); c.rotate(-sw * 1.6);
    const tt = (window.__T || 0); c.beginPath(); c.moveTo(-120, 300); for (let xx = -120; xx <= 120; xx += 10) c.lineTo(xx, 80 + Math.sin(xx * .05 + tt * 4 + x * .01) * 7 + xx * sw * .4); c.lineTo(120, 300); c.closePath(); fill(c, rgba(col, .78));
    for (let j = 0; j < 4; j++) { const ph = (tt * .6 + H1(j + x) ) % 1; circ(c, -50 + j * 32, 220 - ph * 130, 5 + j % 2 * 3, 'rgba(255,255,255,.5)') } c.restore();
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
    c.strokeStyle = '#e0f2fe'; c.lineWidth = 8 * (1 - conv); MOLB.forEach(([a, b], i) => { const kk = at(k, .3 + i * .05, .5 + i * .05); if (kk <= 0) return; c.beginPath(); c.moveTo(P[a][0], P[a][1]); c.lineTo(lp(P[a][0], P[b][0], kk), lp(P[a][1], P[b][1], kk)); if (conv < .95) c.stroke() });
    P.forEach(([px, py], i) => { let kk = spr(at(k, i * .045, i * .045 + .35)); if (kk <= 0) return; kk *= 1 - conv * .85; circ(c, px, py, (i === 3 ? 30 : i === 10 ? 24 : 22) * kk, i === 3 ? '#38bdf8' : i === 10 ? '#f43f5e' : '#f8fafc'); circ(c, px - 6, py - 6, 6 * kk, 'rgba(255,255,255,.8)') });
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
  function medallion(c, t, x, y, R, kf) {   // круг честно поворачивается в 3D (scale по X = cos): мята → ребро → лёд
    if (R <= 0) return; const ang = eio(kf) * Math.PI, cs = Math.cos(ang), off = R * .2 * Math.sin(ang), ice = eio(kf) >= .5;
    if (Math.abs(off) > .5) {   // ребро монеты: в момент поворота видно толщину, а не пустоту
      const rim = ice ? '#075985' : '#047857', ax = Math.abs(cs) * R;
      c.save(); c.translate(x, y); c.fillStyle = rim; c.beginPath(); c.ellipse(-off / 2, 0, Math.max(ax, .5), R, 0, 0, TAU); c.fill(); c.fillRect(-off / 2, -R, off, 2 * R);
      c.strokeStyle = 'rgba(255,255,255,.22)'; c.lineWidth = 3; for (let i = -6; i <= 6; i++) { const yy = i * R / 7; c.beginPath(); c.moveTo(-off / 2, yy); c.lineTo(off / 2, yy); c.stroke() } c.restore() }
    c.save(); c.translate(x + off / 2, y); c.scale(cs, 1); circ(c, 0, 0, R, ice ? '#0284c7' : '#10b981'); ring(c, 0, 0, R - 14, 'rgba(255,255,255,.55)', 6);
    c.lineCap = 'round';
    if (!ice) { c.save(); c.rotate(-.75); const L = R * .78, Wd2 = R * .42; c.beginPath(); c.moveTo(0, L); c.bezierCurveTo(Wd2 * 1.3, L * .4, Wd2 * 1.1, -L * .7, 0, -L); c.bezierCurveTo(-Wd2 * 1.1, -L * .7, -Wd2 * 1.3, L * .4, 0, L); fill(c, '#f0fdf4');
      c.strokeStyle = '#10b981'; c.lineWidth = 9; c.beginPath(); c.moveTo(0, L * .95); c.lineTo(0, -L * .8); c.stroke(); for (let i = 0; i < 4; i++) { const y0 = L * .5 - i * L * .38; c.beginPath(); c.moveTo(0, y0); c.lineTo(Wd2 * .7, y0 - L * .22); c.moveTo(0, y0); c.lineTo(-Wd2 * .7, y0 - L * .22); c.stroke() } c.restore() }
    else { c.strokeStyle = '#f0f9ff'; c.lineWidth = 14;
      for (let i = 0; i < 6; i++) { c.save(); c.rotate(i * TAU / 6); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -R * .78); c.moveTo(0, -R * .45); c.lineTo(-R * .16, -R * .6); c.moveTo(0, -R * .45); c.lineTo(R * .16, -R * .6); c.stroke(); c.restore() } circ(c, 0, 0, 22, '#f0f9ff') }
    c.restore();
  }
  function meter(c, x, y, lab, val, col, k, arrow) {
    rr(c, x - 380, y - 32, 760, 64, 16); fill(c, 'rgba(15,23,42,.85)');
    const v = lp(1 - val, val, k); rr(c, x - 370, y - 22, 740 * v + 1, 44, 12); fill(c, col);
    tx(c, lab + ': ' + Math.round(100 * v) + '% ' + arrow, x, y + 2, { f: 'M', w: 800, s: 30, c: '#fff' });
  }
  function flipLabel(c, s0, s1, x, y, k, o0, o1, ka) {   // подпись переворачивается по горизонтальной оси (без растворения)
    if (ka <= 0) return; const a = Math.cos(Math.PI * eio(k)), sy = Math.abs(a) * ka;
    c.save(); c.translate(x, y); c.scale(ka, Math.max(.001, sy)); tx(c, a >= 0 ? s0 : s1, 0, 0, a >= 0 ? o0 : o1); c.restore();
  }
  const LABY = 1920;   // лаборатория — этажом ниже стола
  function shot5Old(c, t) {
    // 43.0–43.6: лист и стол уезжают вниз, красный столбик 2020 сжимается в каплю (540, 560), проступает контур пустого бака;
    // 43.6–44.0: капля падает на дно; 43.9–44.8: жидкость поднимается со дна
    const T0 = K.s5 - .25, p = at(t, T0, T0 + .6), pe = eio(p), hit = T0 + 1;
    const pan = eio(at(t, K.liq - .1, K.liq + 1.0)) * 1400;   // потом камера поднимается от бака к пакетам
    const kz = eio(at(t, K.fool - .3, K.fool + .5));           // наезд в экран анализатора
    window.__T = t;
    labBg(c, t, pan);
    c.save(); c.translate(0, pan);
    if (pan < 1300) {
      const km = bo(at(t, hit + .2, hit + .8)), sw = Math.sin(t * 1.6) * .06;
      if (km > 0) { mintLeaf(c, 330, 760, 1.45 * km, Math.PI + .35 + sw); mintLeaf(c, 750, 820, 1.45 * km, -.35 - sw); mintLeaf(c, 335, 1010, 1.1 * km, Math.PI - .25 - sw) }
      tank(c, t, { k: eo(at(t, T0 + .9, T0 + 1.8)), draw: eo(p) });
      const ks = at(t, hit, hit + .6); if (ks > 0 && ks < 1) { c.save(); c.translate(540, 1185); c.scale(1, .3); ring(c, 0, 0, 30 + ks * 150, rgba('#e0f2fe', 1 - ks), 6); c.restore() }
    }
    c.restore();
    if (pe < 1) { c.save(); c.translate(0, 1600 * pe); deskShot(c, t, { hideBar: true }); c.restore() }   // стол уезжает вниз и открывает бак
    if (t < hit) {
      if (p < 1) {   // столбик → капля
        const sd = deskS(t), r = RP.r, x0 = 540 + sd * (Math.cos(r) * 180 + Math.sin(r) * 10), y0 = 830 + sd * (Math.sin(r) * 180 - Math.cos(r) * 10);
        const w = lp(160 * sd, 44, pe), h = lp(720 * sd, 56, pe), cx2 = lp(x0, 540, pe), cy2 = lp(y0, 560, pe);
        c.save(); c.translate(cx2, cy2); c.rotate(r * (1 - pe)); rr(c, -w / 2, -h / 2, w, h, lp(10, 22, pe)); fill(c, '#ef4444');
        const R0 = 48 * sd * (1 - pe); if (R0 > 1) { circ(c, 0, -h / 2, R0, '#ef4444'); circ(c, 0, -h / 2, R0 * .83, '#fff'); c.save(); c.translate(0, -h / 2); c.scale(1 - pe, 1 - pe); tx(c, '2020', 0, 2, { f: 'O', w: 700, s: 30, c: '#b91c1c' }); c.restore() }
        circ(c, -w * .18, -h * .2, 8 * pe, 'rgba(255,255,255,.6)'); c.restore();
      } else { const dy = lp(560, 1160, ei(at(t, T0 + .6, hit))); c.beginPath(); c.ellipse(540, dy, 22, 28, 0, 0, TAU); fill(c, '#ef4444'); circ(c, 532, dy - 8, 7, 'rgba(255,255,255,.6)') }
    }
    if (t < K.liq - .2) return;
    // штанга с пакетами въезжает слева, качается маятником; трубка в анализатор с пульсирующими каплями
    c.save(); c.translate(0, pan);
    const RY = -1400 + 200, ks = eo(at(t, K.liq + .4, K.ws - .2)), xs = lp(-1150, 0, ks), tS = K.ws - .2;
    c.save(); c.translate(xs, 0); c.strokeStyle = '#64748b'; c.lineWidth = 16; c.beginPath(); c.moveTo(-1200, RY); c.lineTo(WW + 40, RY); c.stroke();
    rr(c, WW + 20, RY - 30, 40, 60, 8); fill(c, '#475569');
    BAGS.forEach(([lab, col], i) => { const x = 540 + (i - 2) * 195, v = ks < 1 ? (1 - ks) : 0, sw = t < tS ? -.22 * v : Math.sin((t - tS) * 3.4 + i * .5) * -.2 * Math.exp(-(t - tS) * .8) + Math.sin(t * 1.3 + i) * .02;
      ivBag(c, x, RY + 16, lab, col, sw, i === 2 ? pulse2(t, K.ws) + ss(K.ws, K.ws + .3, t) * .6 : 0) });
    c.restore();
    const kt = at(t, K.ws + .1, K.ws + .9), TY0 = RY + 290, TY1 = -1400 + 920;
    c.strokeStyle = 'rgba(226,232,240,.6)'; c.lineWidth = 18; c.beginPath(); c.moveTo(540, TY0); c.lineTo(540, lp(TY0, TY1, ss(0, .4, kt))); c.stroke();
    if (kt > 0) { c.strokeStyle = '#22d3ee'; c.lineWidth = 9; c.beginPath(); c.moveTo(540, TY0); c.lineTo(540, lp(TY0, TY1, kt)); c.stroke();
      if (kt >= 1) for (let j = 0; j < 4; j++) { const ph = ((t - K.ws) * 1.4 + j / 4) % 1, yy = lp(TY0, TY1, ph); glow(c, 540, yy, 40, '#22d3ee', .9); circ(c, 540, yy, 11, '#e0f2fe') } }
    c.restore();
    // анализатор: молекула собирается, атомы сходятся в кольцо — из них вырастает медальон
    const ay = -1400 + 1130 + pan, km2 = at(t, K.ws + .7, K.fool), ms = 1 - eio(at(t, K.fool - .1, K.fool + .1)), mr = bo(at(t, K.fool + .11, K.fool + .51)), flip = at(t, K.ice - .51, K.ice + .29);
    c.save(); if (kz > 0) { const s = lp(1, 1.6, kz); c.translate(540, lp(ay, 820, kz)); c.scale(s, s); c.translate(-540, -ay) }
    analyzer(c, t, 540, ay, () => {
      if (ms > 0) molecule(c, t, -30, 0, .9 * ms, km2, 0);   // молекула гаснет (сжимается в точку) до появления круга
      if (mr > 0) medallion(c, t, 0, 0, 140 * mr, flip);
    });
    c.restore();
    if (kz > 0) {   // подписи и шкалы — поверх, ровно
      const kl = spr(at(t, K.fool + .5, K.fool + .9));
      flipLabel(c, 'ПРИРОДНАЯ МЯТА', 'СИНТЕТИЧЕСКИЙ ЛЁД WS-23', 540, 1215, flip, { f: 'O', w: 700, s: 40, c: '#a7f3d0', ls: 3 }, { f: 'O', w: 700, s: 40, c: '#bae6fd', ls: 3, mw: 900 }, kl);
      const km3 = eo(at(t, K.ice + .3, K.ice + 1.1));
      if (km3 > 0) { c.save(); c.translate(-1100 * (1 - km3), 0); meter(c, 540, 1305, 'ОЩУЩЕНИЕ ХОЛОДА', 1, '#0ea5e9', km3, '▲'); c.restore(); c.save(); c.translate(1100 * (1 - km3), 0); meter(c, 540, 1390, 'СПАЗМ ГОРЛА', 0, '#10b981', km3, '▼'); c.restore() }
    }
  }

  // ================= v18.3 (проба): сцена 5 по Cola 0:03–0:05.5 (#002), Instagram 0:21.5–0:31.5 (#054/#055), Starbucks 0:39.5–0:43.5 (#019) =================
  // Белый круг заливает экран — высокий стакан с двухслойной жидкостью, красная капля висит и падает, за стаканом встаёт круг-солнце,
  // растут листья мяты. Камера вверх — пакеты на штанге, трубка из пакета WS-23 идёт в стакан; камера бежит вниз за голубым потоком
  // по трубке до анализатора (бирюзовый корпус, красный экран), на экране собирается молекула; наезд в экран — кольца разлетаются,
  // за ними эмблема «природная мята»; эмблема поворачивается на 180° в плоскости, перевёрнутый лист становится снежинкой.
  const S5 = { wc: { x: 560, y: 950, R: 1150 }, nav: '#1b2440', wall: '#1c2b74', slate: '#232741', an: 2350, PU: 1350, PD: -1450 };
  const TUB1 = [[540, -830], [540, -560], [720, -560], [720, -190], [540, -190], [540, 712]];
  const TUB2 = [[540, 1150], [540, 1380], [330, 1380], [330, 1740], [740, 1740], [740, 1960], [540, 1960], [540, 2140]];
  function polyUpTo(c, P, yMax) {   // ломаная до глубины yMax (путь идёт только вниз и вбок)
    c.beginPath(); c.moveTo(P[0][0], P[0][1]);
    for (let i = 1; i < P.length; i++) { const [x0, y0] = P[i - 1], [x1, y1] = P[i];
      if (y1 <= yMax) { c.lineTo(x1, y1); continue }
      if (y0 < yMax) c.lineTo(x0 + (x1 - x0) * (yMax - y0) / (y1 - y0), yMax); break }
  }
  function tubeS5(c, P, front, col) {
    c.lineJoin = 'round'; c.lineCap = 'round';
    c.beginPath(); P.forEach(([x, y], i) => c[i ? 'lineTo' : 'moveTo'](x, y)); c.strokeStyle = '#0f3b44'; c.lineWidth = 22; c.stroke(); c.strokeStyle = '#e2e8f0'; c.lineWidth = 12; c.stroke();
    if (front > P[0][1]) { polyUpTo(c, P, front); c.strokeStyle = col; c.lineWidth = 12; c.stroke() }
  }
  function pintPath(c) { c.beginPath(); c.moveTo(390, 700); c.bezierCurveTo(392, 830, 452, 960, 445, 1105); c.lineTo(635, 1105); c.bezierCurveTo(628, 960, 688, 830, 690, 700); c.closePath() }
  function pintS5(c, t, amp, bandCol) {
    c.save(); pintPath(c); c.clip();
    const lv = 790, wv = (x, ph) => Math.sin(x * .03 + t * 3.4 + ph) * amp;
    c.beginPath(); c.moveTo(380, 1200); for (let x = 380; x <= 700; x += 8) c.lineTo(x, lv + wv(x, 0)); c.lineTo(700, 1200); c.closePath(); fill(c, bandCol);
    c.beginPath(); c.moveTo(380, 1200); for (let x = 380; x <= 700; x += 8) c.lineTo(x, lv + 42 + wv(x, 2.1) * .8); c.lineTo(700, 1200); c.closePath(); fill(c, S5.nav);
    for (let i = 0; i < 9; i++) { const y = 1090 - ((t * 60 + i * 37) % 260); circ(c, 470 + H1(i) * 140, y, 3 + H1(i * 3) * 3, 'rgba(241,245,249,.55)') }
    for (let yy = 712; yy < 770; yy += 11) for (let xx = 400; xx < 452; xx += 11) circ(c, xx + (yy % 22 ? 5 : 0), yy, 2.4, S5.nav);
    c.restore();
    pintPath(c); lnS(c, 6, S5.nav);
    rr(c, 430, 1105, 220, 34, 6); fill(c, '#fff'); c.save(); rr(c, 430, 1105, 220, 34, 6); c.clip(); for (let xx = 436; xx < 650; xx += 11) for (let yy = 1112; yy < 1140; yy += 11) circ(c, xx, yy, 2.2, S5.nav); c.restore(); rr(c, 430, 1105, 220, 34, 6); lnS(c, 6, S5.nav);
  }
  function leafS5(c, x, y, s, r, col, vein) { if (s <= 0) return; c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(70, -120, 240, -120, 300, 0); c.bezierCurveTo(240, 110, 70, 110, 0, 0); fill(c, col);
    c.beginPath(); c.moveTo(10, 0); c.lineTo(290, 0); for (let i = 1; i < 6; i++) { c.moveTo(i * 48, 0); c.lineTo(i * 48 + 40, -50 + (i % 2) * 2); c.moveTo(i * 48, 0); c.lineTo(i * 48 + 40, 50) } lnS(c, 5, vein); c.restore() }
  function analyzerS5(c, t, y, km) {   // #055: бирюзовый корпус, красный экран, ручки справа
    c.save(); c.translate(540, y);
    rr(c, -360, -230, 720, 460, 26); fill(c, '#1f8a9a'); rr(c, -360, -230, 720, 70, 26); fill(c, '#176b78'); rr(c, -360, -230, 720, 460, 26); lnS(c, 6, '#0f3b44');
    [-300, -250, -200].forEach(x => circ(c, x, -195, 12, '#0f3b44'));
    rr(c, -320, -130, 420, 290, 16); fill(c, '#0f3b44'); rr(c, -305, -115, 390, 260, 10); fill(c, '#d0384f');
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { circ(c, 170 + i * 56, -40 + j * 70, 22, '#f1f5f9'); circ(c, 170 + i * 56 + 6 * Math.sin(t * 2 + i + j), -40 + j * 70 - 6, 5, '#0f3b44') }
    rr(c, 150, -120, 150, 40, 6); fill(c, '#f1f5f9'); rr(c, 160, 80, 130, 26, 6); fill(c, '#0f3b44'); rr(c, 160, 116, 90, 26, 6); fill(c, '#0f3b44');
    rr(c, -390, -60, 30, 160, 6); fill(c, '#d0384f');
    // молекула WS-23 белыми точками на экране
    if (km > 0) { c.save(); c.translate(-110, 15); c.scale(.62, .62);
      MOLB.forEach(([a, b], i) => { const kk = at(km, .3 + i * .05, .5 + i * .05); if (kk <= 0) return; c.beginPath(); c.moveTo(MOLA[a][0], MOLA[a][1]); c.lineTo(lp(MOLA[a][0], MOLA[b][0], kk), lp(MOLA[a][1], MOLA[b][1], kk)); lnS(c, 7, '#f1f5f9') });
      MOLA.forEach(([px, py], i) => { const kk = spr(at(km, i * .045, i * .045 + .35)); if (kk > 0) circ(c, px, py, (i === 3 ? 30 : 20) * kk, i === 3 ? '#38bdf8' : '#f1f5f9') });
      c.restore() }
    c.restore();
  }
  function ringsS5(c, t, k) {   // #019: толстые дуги разлетаются из центра, крутятся
    const cols = ['#22d3ee', '#0f172a', '#34d399', '#0f172a', '#22d3ee', '#34d399'];
    for (let i = 0; i < 6; i++) { const r = (k * 1.5 - i * .1) * 1250; if (r <= 0) continue; const a0 = t * (i % 2 ? -3 : 2.4) + i;
      c.beginPath(); c.arc(540, 820, r, a0, a0 + Math.PI * (1.25 + .1 * i)); c.strokeStyle = cols[i]; c.lineWidth = 70 + i * 6; c.lineCap = 'round'; c.stroke() }
  }
  function emblemS5(c, t, kr, km) {   // эмблема «природная мята»: контур, буквы по кругу, лист; поворот kr (0…1 = 180°), лист → снежинка km
    const R = 224; c.save(); c.translate(540, 820); c.rotate(Math.PI * eio(kr));
    circ(c, 0, 0, R, S5.slate); ring(c, 0, 0, R, '#34d399', 9); ring(c, 0, 0, R - 46, '#34d399', 4);
    const S = 'ПРИРОДНАЯ МЯТА · ПРИРОДНАЯ МЯТА · '; for (let i = 0; i < S.length; i++) { c.save(); c.rotate(i * TAU / S.length); tx(c, S[i], 0, -R + 23, { f: 'O', w: 700, s: 26, c: '#34d399' }); c.restore() }
    if (km < 1) { c.save(); c.rotate(-.75); const L = R * .6, Wd2 = R * .34; c.beginPath(); c.moveTo(0, L); c.bezierCurveTo(Wd2 * 1.3, L * .4, Wd2 * 1.1, -L * .7, 0, -L); c.bezierCurveTo(-Wd2 * 1.1, -L * .7, -Wd2 * 1.3, L * .4, 0, L);
      c.moveTo(0, L * .95); c.lineTo(0, -L * .8); for (let i = 0; i < 4; i++) { const y0 = L * .5 - i * L * .38; c.moveTo(0, y0); c.lineTo(Wd2 * .7, y0 - L * .22); c.moveTo(0, y0); c.lineTo(-Wd2 * .7, y0 - L * .22) }
      if (km > 0) c.setLineDash([1400 * (1 - km), 1500]); lnS(c, 8, '#34d399'); c.restore() }
    c.restore();
    if (km > 0) { c.save(); c.translate(540, 820); c.strokeStyle = '#f0f9ff'; c.lineWidth = 14; c.lineCap = 'round';
      for (let i = 0; i < 6; i++) { c.save(); c.rotate(i * TAU / 6); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -R * .78 * km); if (km > .5) { const b = (km - .5) * 2; c.moveTo(0, -R * .45); c.lineTo(-R * .16 * b, -R * (.45 + .15 * b)); c.moveTo(0, -R * .45); c.lineTo(R * .16 * b, -R * (.45 + .15 * b)) } c.stroke(); c.restore() }
      circ(c, 0, 0, 22 * km, '#f0f9ff'); c.restore() }
  }
  function shot5(c, t) {
    const T0 = K.s5 - .25, hit = T0 + 1.45, W = S5.wc;
    const kw = eio(at(t, T0, T0 + .45)), Rw = lp(0, W.R, kw), wcx = lp(1250, W.x, kw), wcy = lp(560, W.y, kw);
    const pan = S5.PU * eio(at(t, K.liq - .2, K.liq + .7)) + (S5.PD - S5.PU) * eio(at(t, K.ws + .15, K.fool - .05));
    const zp = 1 + .2 * eio(at(t, hit + .05, hit + .9)) * (1 - eio(at(t, K.liq - .25, K.liq + .35)));
    const kz = eio(at(t, K.fool + .55, K.fool + 1.2)), za = lp(1, 2.6, kz), kR = at(t, K.fool + 1.2, K.fool + 1.75);
    const kr = at(t, K.ice - .55, K.ice - .05), km = eio(at(t, K.ice - .05, K.ice + .35)), kfl = eio(at(t, K.ice + .25, K.ice + .65));
    window.__T = t;
    if (kR >= 1) {   // эмблема на тёмно-синем
      c.fillStyle = S5.slate; c.fillRect(0, 0, WW, HH);
      if (kfl >= 1) medallion(c, t, 540, 820, 224, 1);
      else { emblemS5(c, t, kr, km); if (kfl > 0) { c.save(); c.beginPath(); c.arc(540, 820, 224 * kfl, 0, TAU); c.clip(); medallion(c, t, 540, 820, 224, 1); c.restore() } }
      const kl = spr(at(t, K.ice - .9, K.ice - .5));
      flipLabel(c, 'ПРИРОДНАЯ МЯТА', 'СИНТЕТИЧЕСКИЙ ЛЁД WS-23', 540, 1125, at(t, K.ice - .2, K.ice + .3), { f: 'O', w: 700, s: 42, c: '#6ee7b7', ls: 3 }, { f: 'O', w: 700, s: 42, c: '#bae6fd', ls: 3, mw: 900 }, kl);
      const km3 = eo(at(t, K.ice + .3, K.ice + 1.1));
      if (km3 > 0) { c.save(); c.translate(-1100 * (1 - km3), 0); meter(c, 540, 1235, 'ОЩУЩЕНИЕ ХОЛОДА', 1, '#0ea5e9', km3, '▲'); c.restore(); c.save(); c.translate(1100 * (1 - km3), 0); meter(c, 540, 1325, 'СПАЗМ ГОРЛА', 0, '#10b981', km3, '▼'); c.restore() }
      return;
    }
    // мир: тёмно-синяя стена, белый круг со стаканом, трубки, анализатор
    c.save();
    if (kz > 0) { const scx = 540 - 110, scy = S5.an + 15 + pan; c.translate(lp(scx, 540, kz), lp(scy, 820, kz)); c.scale(za, za); c.translate(-scx, -scy) }
    c.translate(560, 900); c.scale(zp, zp); c.translate(-560, -900); c.translate(0, pan);
    if (Rw > 0) {
      c.fillStyle = S5.wall; c.fillRect(-600, -2400, WW + 1200, 6000);
      c.save(); c.beginPath(); c.arc(wcx, wcy, Rw, 0, TAU); c.clip(); c.fillStyle = '#fbfaf7'; c.fillRect(-600, -2400, WW + 1200, 6000);
      // солнце-круг, листья, холмик
      const kS = bo(at(t, hit + .1, hit + .5)); if (kS > 0) { circ(c, 735, 610, 165 * kS, '#7dd3fc'); ring(c, 765, 600, 205 * kS, '#38bdf8', 5) }
      leafS5(c, 950, 1180, 1.25 * bo(at(t, hit + .2, hit + .65)), Math.PI + .55 + Math.sin(t * 1.4) * .04, '#2a9d8f', '#1f7a70');
      leafS5(c, 990, 940, .9 * bo(at(t, hit + .3, hit + .75)), Math.PI + .1 + Math.sin(t * 1.2 + 1) * .05, '#6ee7b7', '#2a9d8f');
      const kg = eo(at(t, hit + .05, hit + .5)); if (kg > 0) { c.beginPath(); c.ellipse(220, 1150 + 120 * (1 - kg), 330, 70, 0, 0, TAU); fill(c, '#6ee7b7') }
      c.restore();
      if (Rw < W.R) { c.save(); c.translate(0, 0); if (pan < 1) { c.save(); c.beginPath(); c.rect(-600, -2400, WW + 1200, 6000); c.arc(wcx, wcy, Rw, 0, TAU, true); c.clip(); c.setTransform(1, 0, 0, 1, 0, 0); deskShot(c, t, { hideBar: true }); c.restore() } c.restore() }
    } else deskShot(c, t, { hideBar: true });
    // штанга с пакетами (#054)
    if (pan > 50) { const RY = -1170; c.strokeStyle = '#64748b'; c.lineWidth = 16; c.beginPath(); c.moveTo(-60, RY); c.lineTo(WW + 60, RY); c.stroke();
      BAGS.forEach(([lab, col], i) => { const x = 540 + (i - 2) * 200, sw = Math.sin(t * 1.5 + i * .7) * .05; c.save(); c.translate(x, RY + 16); c.scale(1.18, 1.18); c.translate(-x, -RY - 16); ivBag(c, x, RY + 16, lab, col, sw, i === 2 ? pulse2(t, K.ws) + ss(K.ws, K.ws + .3, t) * .6 : 0); c.restore() }) }
    // трубки: голубой поток бежит за камерой
    const front = t < K.ws - .1 ? -1e4 : lp(TUB1[0][1], 960 - S5.PU, at(t, K.ws - .1, K.ws + .15)) + Math.max(0, (S5.PU - pan));
    const kd1 = eo(at(t, K.liq - .45, K.liq + .05)); if (kd1 > 0) { c.save(); c.translate(0, -1100 * (1 - kd1)); tubeS5(c, TUB1, front, '#22d3ee'); c.restore() }
    if (t > K.ws && pan < 600) tubeS5(c, TUB2, front, '#22d3ee');
    // стакан и капля (#002)
    if (Rw > 0) {
      const kb = at(front, 700, 1105), bandCol = mixc('#f59e0b', '#22d3ee', kb), amp = 8 + 26 * Math.exp(-5 * Math.max(0, t - hit)) * (t > hit ? 1 : 0);
      c.save(); if (Rw < W.R) { c.beginPath(); c.arc(wcx, wcy, Rw, 0, TAU); c.clip() } pintS5(c, t, amp, bandCol); c.restore();
      const ks = at(t, hit, hit + .55); if (ks > 0 && ks < 1) { c.save(); c.translate(540, 790); c.scale(1, .35); ring(c, 0, 0, 20 + ks * 140, rgba('#ef4444', 1 - ks), 5); c.restore() }
    }
    analyzerS5(c, t, S5.an, at(t, K.fool - .05, K.fool + .85));
    c.restore();
    if (kR > 0) { c.save(); c.beginPath(); c.arc(540, 820, Math.max(0, (kR * 1.5 - .5) * 1250), 0, TAU); c.clip(); c.fillStyle = S5.slate; c.fillRect(0, 0, WW, HH); emblemS5(c, t, 0, 0); c.restore(); ringsS5(c, t, kR) }
    // столбик 2020 → капля (поверх всего), висит, падает в стакан
    if (t < hit) {
      const p = at(t, T0, T0 + .6), pe = eio(p);
      if (p < 1) {
        const sd = deskS(t), r = RP.r, x0 = 540 + sd * (Math.cos(r) * 180 + Math.sin(r) * 10), y0 = 830 + sd * (Math.sin(r) * 180 - Math.cos(r) * 10);
        const w = lp(160 * sd, 44, pe), h = lp(720 * sd, 56, pe), cx2 = lp(x0, 540, pe), cy2 = lp(y0, 560, pe);
        c.save(); c.translate(cx2, cy2); c.rotate(r * (1 - pe)); rr(c, -w / 2, -h / 2, w, h, lp(10, 22, pe)); fill(c, '#ef4444');
        const R0 = 48 * sd * (1 - pe); if (R0 > 1) { circ(c, 0, -h / 2, R0, '#ef4444'); circ(c, 0, -h / 2, R0 * .83, '#fff'); c.save(); c.translate(0, -h / 2); c.scale(1 - pe, 1 - pe); tx(c, '2020', 0, 2, { f: 'O', w: 700, s: 30, c: '#b91c1c' }); c.restore() }
        c.restore();
      } else { const kf = at(t, hit - .3, hit), dy = lp(560 + Math.sin((t - T0) * 5) * 10, 790, kf * kf); c.beginPath(); c.ellipse(540, dy, 22, 28, 0, 0, TAU); fill(c, '#ef4444') }
    }
  }
  // ================= СЦЕНА 6 (v18.4): чертежи и кран как у Да Винчи #067 → корпус торцом как банка Coca-Cola #003 =================
  // Фон — ровный тёмно-синий с тонкими светлыми штрихами (как у Да Винчи). Медальон растёт в фон, золотая линия раскрывается в лист чертежа;
  // листы висят на цепях под фермой с жёлто-чёрной полосой и едут влево, между ними на крюках — синие одноразки «5000 ЗАТЯЖЕК».
  // Третий лист сворачивается в корпус: янтарный, синяя полоса, белый торец с голубой дугой и щелью мундштука; растровая тень точками; 16 картриджей по орбите.
  const S6 = { bg: '#161c3d', bg2: '#121735', ln: '#f1f5f9', ink: '#2348b8', paper: '#f4f6fb', amber: '#f59e0b', navy: '#1b2a6b', cap: '#f1f5f9' };
  function blueprintBg(c, t, dark = 0, o = {}) {   // ровный фон и штрихи света (имя прежнее: им же пользуется сцена 7)
    const ga = o.ga ?? 1;
    c.fillStyle = o.col || mixc(S6.bg, S6.bg2, dark); c.fillRect(-300, -300, WW + 600, HH + 600);
    c.save(); c.globalAlpha *= ga; c.lineCap = 'round';
    for (let i = 0; i < 26; i++) { const x = H1(i * 2.9) * WW, L = 120 + H1(i * 6.1) * 420, y = ((H1(i * 4.3) * (HH + 600) - t * (14 + 26 * H1(i))) % (HH + 600) + HH + 600) % (HH + 600) - 300;
      c.strokeStyle = rgba('#93a4e8', .07 + .07 * H1(i * 8.8)); c.lineWidth = 4 + 6 * H1(i * 3.3); c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + L); c.stroke() }
    c.restore();
  }
  function craneBeam(c, t) {   // ферма: жёлто-чёрная полоса сверху, серая решётка
    c.save(); c.beginPath(); c.rect(-60, 186, WW + 120, 26); c.clip(); c.fillStyle = '#facc15'; c.fillRect(-60, 186, WW + 120, 26); c.fillStyle = '#1f2937';
    for (let i = -2; i < 34; i++) { poly(c, [i * 44, 186, i * 44 + 22, 186, i * 44 + 4, 212, i * 44 - 18, 212]); c.fill() } c.restore();
    c.fillStyle = '#2a3156'; c.fillRect(-60, 212, WW + 120, 78);
    c.beginPath(); c.moveTo(-60, 216); c.lineTo(WW + 60, 216); c.moveTo(-60, 286); c.lineTo(WW + 60, 286);
    for (let x = -60; x < WW + 60; x += 70) { c.moveTo(x, 216); c.lineTo(x + 70, 286); c.moveTo(x + 70, 216); c.lineTo(x, 286) } lnS(c, 4, '#94a3b8');
  }
  function trolley(c, x) { rr(c, x - 40, 280, 80, 36, 6); fill(c, '#facc15'); rr(c, x - 40, 280, 80, 36, 6); lnS(c, 4, '#1f2937'); circ(c, x - 22, 284, 9, '#1f2937'); circ(c, x + 22, 284, 9, '#1f2937') }
  function sheetDraw(c, i, t) {   // белый лист 760×680 с синей схемой (координаты листа: центр 0,0), всё на листе движется
    rr(c, -380, -340, 760, 680, 10); fill(c, S6.paper); c.strokeStyle = rgba('#2348b8', .1); c.lineWidth = 1.5;
    c.beginPath(); for (let x = -380; x <= 380; x += 40) { c.moveTo(x, -340); c.lineTo(x, 340) } for (let y = -340; y <= 340; y += 40) { c.moveTo(-380, y); c.lineTo(380, y) } c.stroke();
    c.save(); c.setLineDash([14, 10]); rr(c, -352, -312, 704, 624, 6); stroke(c, rgba('#2348b8', .55), 3); c.restore();
    c.strokeStyle = '#1e40af'; c.lineWidth = 5; c.fillStyle = 'rgba(37,99,235,.12)';
    if (i === 0) {   // картридж 0,7 мл → бак растёт до 13 мл
      const kg = eio(at(t, K.grew - .1, K.grew + .8)), H = lp(120, 420, kg), Y0 = 190 - H;
      rr(c, -230, Y0, 200, H, lp(14, 40, kg)); c.fill(); c.stroke();
      const lv = lp(.2, .72, kg) * (H - 30); c.save(); rr(c, -222, Y0 + 8, 184, H - 16, lp(10, 32, kg)); c.clip(); c.fillStyle = 'rgba(14,165,233,.45)';
      c.beginPath(); c.moveTo(-240, 200); for (let x = -240; x <= -20; x += 10) c.lineTo(x, 182 - lv + Math.sin(x * .05 + t * 4) * 6); c.lineTo(-20, 200); c.closePath(); c.fill(); c.restore();
      const kj = lp(1.9, 1, eio(at(t, K.grew - .2, K.grew + .5))) * (1 + .12 * pulse2(t, w0('картридж'))), pxj = lp(60, 120, eio(at(t, K.grew - .2, K.grew + .5)));
      c.save(); c.translate(pxj, 130); c.scale(kj, kj); rr(c, -30, -60, 60, 120, 14); c.fillStyle = 'rgba(249,115,22,.4)'; c.fill(); c.stroke(); rr(c, -30, -60, 60, 26, 10); fill(c, '#1e40af');
      c.save(); rr(c, -24, -30, 48, 84, 10); c.clip(); c.fillStyle = 'rgba(249,115,22,.55)'; c.beginPath(); c.moveTo(-30, 60); for (let x = -30; x <= 30; x += 6) c.lineTo(x, -4 + Math.sin(x * .2 + t * 5) * 4); c.lineTo(30, 60); c.closePath(); c.fill(); c.restore(); c.restore();
      tx(c, 'JUUL: 0,7 МЛ', pxj, 130 + 60 * kj + 35, { f: 'O', w: 700, s: 30, c: '#ea580c' });
      const kh = spr(at(t, K.s6 + .5, K.s6 + 1)); if (kh > 0) { c.save(); c.translate(0, -255); c.scale(kh, kh); tx(c, 'КАРТРИДЖ → БАК', 0, 0, { f: 'U', w: 800, s: 44, c: '#1e3a8a' }); c.restore() }
      const kn = at(t, K.grew, w0('тринадцать')), v = lp(.7, 13, eio(kn)), vs = kn >= 1 ? '13' : (v < 10 ? v.toFixed(1).replace('.', ',') : String(Math.round(v)));
      if (kn > 0) tx(c, 'БАК: ' + vs + ' МЛ', 170, -170, { f: 'U', w: 800, s: 40, c: '#1e3a8a', mw: 330 });
      const kx = spr(at(t, w0('тринадцать') + .05, w0('тринадцать') + .45)); if (kx > 0) { c.save(); c.translate(170, -110); c.scale(kx, kx); tx(c, 'В 18 РАЗ БОЛЬШЕ', 0, 0, { f: 'O', w: 700, s: 30, c: '#2563eb' }); c.restore() }
    } else if (i === 1) {   // двойная сетка: накаляется волной
      [-140, 140].forEach((cx, j) => { rr(c, cx - 90, -170, 180, 300, 30); c.stroke(); c.save(); rr(c, cx - 90, -170, 180, 300, 30); c.clip(); c.lineWidth = 3;
        for (let k = -400; k < 400; k += 22) { const hot = .5 + .5 * Math.sin(t * 5 - k * .02 - j); c.strokeStyle = mixc('#1e40af', '#f97316', hot * at(t, K.mesh - .1, K.mesh + .4)); c.beginPath(); c.moveTo(cx + k, -170); c.lineTo(cx + k + 300, 130); c.moveTo(cx + k, 130); c.lineTo(cx + k + 300, -170); c.stroke() } c.restore() });
      tx(c, 'ДВОЙНАЯ СЕТКА', 0, 210, { f: 'U', w: 800, s: 44, c: '#1e3a8a' }); tx(c, '2 СЕТКИ НАГРЕВА', 0, 262, { f: 'O', w: 700, s: 30, c: '#2563eb', ls: 3 });
    } else {   // затяжки и аккумулятор
      rr(c, -250, -200, 170, 330, 20); c.stroke(); rr(c, -200, -230, 70, 32, 8); c.stroke();
      const ch = (t * 1.5) % 5; for (let k = 0; k < 4; k++) { rr(c, -230, 70 - k * 70, 130, 54, 8); c.fillStyle = k < ch ? 'rgba(34,197,94,.6)' : 'rgba(34,197,94,.15)'; c.fill() }
      tx(c, '650 мА·ч', -165, 190, { f: 'O', w: 700, s: 32, c: '#1e3a8a' });
      const n = Math.round(5000 * eio(at(t, K.puffs - .2, K.puffs + .7)) / 50) * 50;
      num(c, String(n), 140, -60, { f: 'U', w: 800, s: 110, c: '#1e3a8a' }); tx(c, 'ЗАТЯЖЕК', 140, 50, { f: 'O', w: 700, s: 40, c: '#2563eb', ls: 3 });
    }
    rr(c, -380, -340, 760, 680, 10); lnS(c, 4, '#c7d2fe');
  }
  const w0 = q => Wd(q);
  const SH = { x: 540, y: 1000 };
  function shiftX(t) {   // листы едут справа налево на «двойная» и «тысячи», всё время чуть плывут
    return 1100 * eio(at(t, K.mesh - .45, K.mesh + .25)) + 1100 * eio(at(t, K.puffs - .45, K.puffs + .25)) + 90 * at(t, K.s6, K.nicot);
  }
  function hookVape(c, t, x, sw, i) {   // на крюке — синяя одноразка с биркой «5000 ЗАТЯЖЕК» (вместо танков Да Винчи)
    c.save(); c.translate(x, 316); c.rotate(sw);
    c.save(); c.setLineDash([12, 7]); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 130); lnS(c, 5, '#94a3b8'); c.restore();
    c.beginPath(); c.arc(0, 146, 16, -Math.PI / 2, Math.PI * .8); lnS(c, 6, '#facc15');
    const top = 180, w = 150, h = 420;
    poly(c, [-38, top + 50, -30, top, 30, top, 38, top + 50]); fill(c, '#111827'); poly(c, [-38, top + 50, -30, top, 30, top, 38, top + 50]); lnS(c, 5);
    rr(c, -w / 2, top + 50, w, h, 36); fill(c, S6.bg);
    c.save(); rr(c, -w / 2, top + 50, w, h, 36); c.clip(); c.beginPath(); c.moveTo(-w / 2 - 4, top + 50 + h * .4); c.bezierCurveTo(-20, top + 50 + h * .32, 20, top + 50 + h * .2, w / 2 + 4, top + 50 + h * .08); c.lineTo(w / 2 + 4, top + h + 60); c.lineTo(-w / 2 - 4, top + h + 60); c.closePath(); fill(c, '#3b6fd8'); c.restore();
    rr(c, -w / 2, top + 50, w, h, 36); lnS(c, 5);
    c.save(); c.translate(0, top + 160); circ(c, 0, 0, 30, S6.bg); c.beginPath(); c.arc(0, 0, 30, 0, TAU); lnS(c, 4); c.beginPath(); for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; c.moveTo(Math.cos(a) * 16, Math.sin(a) * 16); c.lineTo(-Math.cos(a) * 16, -Math.sin(a) * 16) } lnS(c, 3, '#5eead4'); c.restore();
    c.save(); c.translate(52, top + 330); c.rotate(-.12); rr(c, -78, -24, 156, 48, 8); fill(c, '#facc15'); tx(c, '5000 ЗАТЯЖЕК', 0, 2, { f: 'O', w: 700, s: 22, c: '#1f2937' }); c.restore();
    c.restore();
  }
  function sheets(c, t, kRoll, kUp, ku) {   // листы на цепях кранов; третий лист сворачивается в корпус одноразки
    const X = shiftX(t), v = (shiftX(t + .03) - shiftX(t - .03)) / .06;
    const kb = eo(at(t, K.s6 + .5, K.s6 + 1.1));
    c.save(); c.translate(0, -1150 * kUp - 1000 * (1 - kb)); for (let i = -1; i < 3; i++) { const px = SH.x + i * 1100 + 550 - X; if (px < -300 || px > WW + 300) continue; trolley(c, px); hookVape(c, t, px, -v * 1.2e-4 + Math.sin(t * 1.9 + i) * .02, i) } c.restore();
    for (let i = 0; i < 3; i++) {
      const roll = i === 2 ? kRoll : 0, sx = lp(SH.x + i * 1100 - X, 540, roll); if (sx < -600 || sx > WW + 600) continue;
      const sw = -v * 1.1e-4 + Math.sin(t * 1.7 + i * 2) * .012, ty = -420 * kUp;
      c.save(); c.translate(0, ty - 360 * (1 - kb)); trolley(c, sx); c.restore();
      if (roll < 1) {
        c.save(); c.translate(sx, 316); c.rotate(sw * (1 - roll));
        const cy = lp(SH.y - 316, 860 - 316, roll), W = lp(760, 220, roll), H = lp(680, 520, roll), ch = i > 0 ? 1 : at(t, K.s6 + .95, K.s6 + 1.35);
        if (roll < .5 && ch > 0) { c.save(); c.setLineDash([12, 7]); dashDraw(c, ch, 400); c.beginPath(); c.moveTo(-30, 0); c.lineTo(-W / 2 + 40, cy - H / 2 + 10); c.moveTo(30, 0); c.lineTo(W / 2 - 40, cy - H / 2 + 10); lnS(c, 5, '#94a3b8'); c.restore() }
        c.translate(0, cy);
        if (roll <= 0) {
          if (i === 0 && ku < 1) { const kh = eo(at(ku, .35, 1)); if (kh > 0) { c.save(); c.scale(1, kh); sheetDraw(c, i, t); c.restore() } const lw = 760 * eo(at(ku, 0, .4)); c.fillStyle = '#fbbf24'; c.fillRect(-lw / 2, -340 * kh - 3, lw, 6); c.fillRect(-lw / 2, 340 * kh - 3, lw, 6) }
          else { c.save(); c.translate(14, 18); c.rotate(.035); rr(c, -380, -340, 760, 680, 10); fill(c, '#dfe5f5'); c.restore(); sheetDraw(c, i, t) }
        } else {   // лист скатывается справа налево в рулон: под рулоном — янтарь с синей полосой, углы скругляются
          const rad = lp(10, 110, roll);
          c.save(); rr(c, -W / 2, -H / 2, W, H, rad); c.clip();
          c.save(); c.scale(W / 760, H / 680); sheetDraw(c, i, t); c.restore();
          const xr = lp(W / 2, -W / 2, ss(0, .85, roll)); c.fillStyle = S6.amber; c.fillRect(xr, -H / 2, W, H);
          c.fillStyle = S6.navy; c.fillRect(Math.max(xr, W / 2 - W * .3), -H / 2, Math.max(0, W / 2 - W * .1 - Math.max(xr, W / 2 - W * .3)), H);
          c.beginPath(); c.moveTo(xr, -H / 2); c.lineTo(xr, H / 2); lnS(c, 5); c.restore();
          rr(c, -W / 2, -H / 2, W, H, rad); lnS(c, 5, mixc('#c7d2fe', S6.ln, roll));
        }
        c.restore();
      }
    }
  }
  function pod(c, x, y, r, k) { c.save(); c.translate(x, y); c.rotate(r); c.scale(k, k); rr(c, -18, -36, 36, 72, 9); fill(c, '#f97316'); rr(c, -18, -36, 36, 22, 8); fill(c, '#111827'); rr(c, -18, -36, 36, 72, 9); lnS(c, 3.5); c.restore() }
  function capFace(c, R) {   // торец как крышка банки: белый круг, тёмное кольцо, голубая дуга, щель мундштука, снежинка
    circ(c, 0, 0, R, S6.cap); c.beginPath(); c.arc(0, 0, R, 0, TAU); lnS(c, 6, '#0e1432');
    c.beginPath(); c.arc(0, 0, R * .8, 0, TAU); lnS(c, 5, '#0e1432');
    c.beginPath(); c.arc(0, 0, R * .8, -1.35, .25); lnS(c, 14, '#22d3ee');
    rr(c, -R * .26, -R * .12, R * .52, R * .24, R * .12); fill(c, '#0e1432');
    c.beginPath(); for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; c.moveTo(Math.cos(a) * R * .09, R * .42 + Math.sin(a) * R * .09); c.lineTo(-Math.cos(a) * R * .09, R * .42 - Math.sin(a) * R * .09) } lnS(c, 4, '#22d3ee');
  }
  function cyl3d(c, t, th, R) {   // корпус честно поворачивается в 3D: ось наклоняется к нам, торец раскрывается в круг; растровая тень точками
    const x = 540, y = 860, h = 260 * Math.cos(th), e = Math.max(.001, Math.sin(th));
    if (th > .5) {
      const L = 560 * ss(.5, 1.57, th), ux = Math.cos(.61), uy = Math.sin(.61);
      for (let d = 0; d < L; d += 22) for (let w = -R; w <= R; w += 22) { const px = x + ux * (d + R * .25) - uy * w, py = y + uy * (d + R * .25) + ux * w, rr0 = 6.5 * (1 - d / L); if (rr0 > .5) circ(c, px, py, rr0, 'rgba(241,245,249,.28)') }
    }
    if (h > 1) {
      c.beginPath(); c.moveTo(x - R, y - h); c.lineTo(x - R, y + h); c.ellipse(x, y + h, R, R * e, 0, Math.PI, 0, true); c.lineTo(x + R, y - h); c.closePath(); fill(c, S6.amber);
      c.save(); c.clip(); c.fillStyle = S6.navy; c.fillRect(x + R * .25, y - h - R, R * .4, 2 * h + 2 * R); c.restore();
      c.beginPath(); c.moveTo(x - R, y - h); c.lineTo(x - R, y + h); c.ellipse(x, y + h, R, R * e, 0, Math.PI, 0, true); c.lineTo(x + R, y - h); lnS(c, 5);
    }
    c.save(); c.translate(x, y - h); c.scale(1, e); capFace(c, R); c.restore();
  }
  function endFace(c, t, kd, kq = 0, cy = 860, noCap = false) {   // торец R 230: тёмный круг с надписью, 16 картриджей по орбите
    if (!noCap) { c.save(); c.translate(540, cy); capFace(c, 230); c.restore() }
    const kk = kd * (1 - kq); if (kk > 0) { c.save(); c.translate(540, cy); c.scale(kk, kk); circ(c, 0, 0, 208, '#0e1432'); c.beginPath(); c.arc(0, 0, 208, 0, TAU); lnS(c, 5);
      tx(c, '1 ОДНОРАЗКА', 0, -80, { f: 'U', w: 800, s: 38, c: '#fbbf24' }); tx(c, '=', 0, -22, { f: 'U', w: 800, s: 44, c: '#fff' }); tx(c, '16 КАРТРИДЖЕЙ', 0, 34, { f: 'U', w: 800, s: 34, c: '#fff' }); tx(c, 'JUUL · ПО НИКОТИНУ', 0, 90, { f: 'O', w: 700, s: 24, c: '#fdba74', ls: 2 }); c.restore() }
    for (let i = 0; i < 16; i++) { const a0 = -Math.PI / 2 + i * TAU / 16 + kq * 1.2, k = spr(at(t, K.n16 - .05 + i * .05, K.n16 + .3 + i * .05)) * (1 - kq), r = 310 * (1 - kq * .3); if (k > 0) pod(c, 540 + Math.cos(a0) * r, cy + Math.sin(a0) * r, a0 + Math.PI / 2, k) }
  }
  function shot6(c, t) {
    // 53.2–54.0: сам синий круг медальона растёт на весь экран; в нём — ровный фон со штрихами, снежинка уменьшается в центре
    const kx = at(t, K.s6 - .23, K.s6 + .57), R = lp(224, 1260, ei(kx));
    if (kx < 1) shot5(c, t);
    if (kx <= 0) return;
    c.save(); if (kx < 1) { c.beginPath(); c.arc(540, 820, R, 0, TAU); c.clip() }
    const dark = eio(at(t, K.nicot - .2, K.nicot + .4));
    blueprintBg(c, t, dark);
    if (kx < 1) medallion(c, t, 540, 820, 224 * (1 - ss(0, .6, kx)), 1);
    const ku = at(t, K.s6 + .05, K.s6 + .75);   // золотая линия → лист раскрывается сверху вниз (Да Винчи 0:29.8)
    const kRoll = eio(at(t, K.nicot - .25, K.nicot + .25)), kUp = eio(at(t, K.nicot - .1, K.nicot + .5));
    const kb = eo(at(t, K.s6 + .5, K.s6 + 1.1));   // ферма въезжает сверху
    c.save(); c.translate(0, -420 * kUp - 360 * (1 - kb)); craneBeam(c, t); c.restore();
    if (ku > 0) sheets(c, t, kRoll, kUp, ku);
    if (kRoll >= 1) {
      const kr = eio(at(t, K.nicot + .25, K.n16 - .05));
      if (kr < 1) cyl3d(c, t, lp(.18, Math.PI / 2, kr), lp(110, 230, kr));
      else endFace(c, t, spr(at(t, K.n16 + .45, K.n16 + .85)));
    }
    c.restore();
  }
  // ================= СЦЕНА 7: холм с табаком → колба-лампочка → змеевик → касса =================
  function labBlue(c, t) {   // тёмно-синяя лаборатория с бензольными шестигранниками и штативами
    vgrad(c, -100, -100, WW + 200, HH + 200, ['#0b1430', '#13214a', '#0a1228']);
    for (let i = 0; i < 9; i++) { const x = (H1(i * 3) * WW + t * 12 * (i % 2 ? 1 : -1) + 2000) % (WW + 200) - 100, y = 160 + H1(i * 7) * 1100 + Math.sin(t * .6 + i) * 20, r = 40 + H1(i) * 50;
      c.save(); c.translate(x, y); c.rotate(t * .1 + i); c.globalAlpha = .14; c.beginPath(); for (let j = 0; j < 6; j++) { const a = j * TAU / 6; c[j ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r) } c.closePath(); stroke(c, '#93c5fd', 4); c.beginPath(); c.arc(0, 0, r * .55, 0, TAU); c.stroke(); c.restore() }
    c.save(); c.globalAlpha = .35; [[110, 1350], [970, 1350]].forEach(([x, b]) => { c.fillStyle = '#334155'; c.fillRect(x - 6, b - 760, 12, 760); c.fillRect(x - 70, b - 10, 140, 14); c.fillRect(x, b - 600, 70, 8); c.fillRect(x, b - 420, 70, 8) }); c.restore();
    glow(c, 540, 700, 700, '#3b82f6', .12); vignette(c, .5);
  }
  const PL = [{ x: 540, by: 805, ty: 380, s: 1 }, { x: 330, by: 840, ty: 600, s: .8 }, { x: 750, by: 840, ty: 600, s: .8 }];   // стебли растут из купола холма
  function tobacco(c, t, p, i, kg, kw) {   // растение: стебель, большие листья, розово-красные бутоны; kw — увядание
    const top = lp(p.by, p.ty, kg); if (kg <= 0) return;
    c.strokeStyle = mixc('#15803d', '#78716c', kw); c.lineWidth = 9 * p.s; c.lineCap = 'round'; c.beginPath(); c.moveTo(p.x, p.by); c.quadraticCurveTo(p.x + 18 * Math.sin(i + 1), (p.by + top) / 2, p.x, top); c.stroke();
    for (let j = 0; j < 4; j++) { const ly = lp(p.by, top, .2 + j * .2), kl = spr(at(kg, .2 + j * .15, .5 + j * .15)), dir = j % 2 ? 1 : -1; if (kl <= 0 || ly < top + 20) continue;
      const kf = ss((j + i) * .08, (j + i) * .08 + .45, kw), fall = kw * (40 + j * 20) + 1400 * kf * kf;
      c.save(); c.translate(p.x + dir * 160 * kf, ly + fall); c.rotate(dir * (.5 + kw * .9 + kf * 3)); c.scale(kl * p.s * dir, kl * p.s);
      c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(60, -70, 170, -40, 200, 0); c.bezierCurveTo(170, 40, 60, 50, 0, 0); fill(c, mixc('#059669', '#a8a29e', kw));
      c.strokeStyle = 'rgba(209,250,229,.5)'; c.lineWidth = 3; c.beginPath(); c.moveTo(4, 0); c.lineTo(190, 0); c.stroke(); c.restore() }
  }
  function bud(c, x, y, k, kw) { k *= 1 - ss(0, .7, kw); if (k <= 0) return; c.save(); c.translate(x, y + 60 * kw); c.rotate(kw * 1.4); c.scale(k, k); for (let j = 0; j < 5; j++) { c.save(); c.rotate(-Math.PI / 2 + (j - 2) * .28); c.beginPath(); c.ellipse(0, -36, 13, 34, 0, 0, TAU); fill(c, j % 2 ? '#f472b6' : '#e11d48'); c.restore() } circ(c, 0, 0, 16, '#be123c'); c.restore() }
  function bulb(c, x, y, k, t) {   // стеклянная колба-лампочка R 85 с золотым свечением
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k);
    glow(c, 0, 0, 260, '#fbbf24', .55); circ(c, 0, 0, 85, 'rgba(254,243,199,.30)'); circ(c, 0, 10, 60, rgba('#f59e0b', .75)); glow(c, 0, 10, 90, '#fde68a', .8);
    ring(c, 0, 0, 85, 'rgba(255,255,255,.85)', 6); rr(c, -26, 78, 52, 40, 8); fill(c, 'rgba(226,232,240,.8)'); c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(-36, -34, 12, 26, -.6, 0, TAU); c.fill();
    c.restore();
  }
  // змеевик: 5 витков, X 380…700, Y 520…1170
  const COIL = (() => { const P = []; for (let i = 0; i <= 400; i++) { const u = i / 400, a = u * 5 * TAU; P.push([540 + Math.sin(a) * 160, 520 + u * 650 + Math.cos(a) * 26]) } return P })();
  function coil(c, t, ka, kd) {
    if (ka <= 0) return; c.save();
    const kst = eo(at(ka, 0, .5)); c.save(); c.translate(0, 900 * (1 - kst));
    c.fillStyle = '#475569'; c.fillRect(780, 420, 14, 900); c.fillRect(700, 1310, 180, 16); rr(c, 700, 500, 100, 26, 6); fill(c, '#64748b'); rr(c, 700, 1100, 100, 26, 6); fill(c, '#64748b');
    rr(c, 480, 1230, 120, 80, 18); fill(c, 'rgba(186,230,253,.35)'); rr(c, 480, 1230, 120, 80, 18); stroke(c, '#e0f2fe', 3);   // спиртовка
    const fl = 1 + .12 * Math.sin(t * 17); c.save(); c.translate(540, 1228); c.scale(1, fl); c.beginPath(); c.moveTo(0, -70); c.quadraticCurveTo(26, -22, 0, 0); c.quadraticCurveTo(-26, -22, 0, -70); fill(c, '#3b82f6'); c.beginPath(); c.moveTo(0, -46); c.quadraticCurveTo(13, -16, 0, 0); c.quadraticCurveTo(-13, -16, 0, -46); fill(c, '#93c5fd'); c.restore(); c.restore();
    const nP = Math.floor(400 * at(ka, .2, 1)); if (nP < 2) { c.restore(); return }
    const path = () => { c.beginPath(); c.moveTo(540, 465); for (let i = 0; i <= nP; i++) c.lineTo(COIL[i][0], COIL[i][1]) };   // трубка растёт из низа колбы
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
    if (o.after) o.after();
    if (o.coin > 0) { c.save(); c.translate(0, -132 + 10 * (1 - o.coin)); circ(c, 0, 0, 34 * o.coin, '#fbbf24'); ring(c, 0, 0, 26 * o.coin, '#b45309', 4); c.restore() }
    c.restore();
  }
  const REGNUM = '$3 200 000 000';
  function regDisplay(c, t) {   // цифры набегают от $0 до 3 200 000 000
    const k = eio(at(t, K.bill - .1, K.bill + 1.0)), v = Math.round(3.2e9 * k / 1e6) * 1e6;
    const s = '$' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (x, y) => { glow(c, 0, y, 260, '#fb923c', .22); num(c, k >= 1 ? REGNUM : s, 0, y - 6, { f: 'J', w: 700, s: 52, c: '#fb923c' }); tx(c, 'ОДНОРАЗКИ · США · ГОД', 0, y + 50, { f: 'O', w: 500, s: 22, c: '#fdba74', ls: 3 }) };
  }
  const recL = t => 560 * eio(at(t, K.market - .3, K.corp + .6));
  function receipt(c, t) {   // чек выползает вверх из щели на крышке кассы (над табло); строки печатаются и едут вместе с бумагой
    const L = recL(t); if (L <= 0) return;
    const y0 = -338, W = 300, pt = d => [-30 * Math.sin(d / 560 * Math.PI * 1.2), y0 - d];
    const N = 30, top = []; for (let i = 0; i <= N; i++) top.push(pt(i / N * L));
    c.beginPath(); top.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0] - W / 2, p[1])); for (let i = N; i >= 0; i--) c.lineTo(top[i][0] + W / 2, top[i][1]); c.closePath(); fill(c, '#fafaf9'); c.strokeStyle = '#d6d3d1'; c.lineWidth = 2; c.stroke();
    const lines = [['ЧЕК · РЫНОК ОДНОРАЗОК', K.market - .2], ['VUSE GO — BAT', K.old - .1], ['NJOY — ALTRIA', K.corp - .2], ['(«МАЛЬБОРО»)', K.corp + .1]];
    lines.forEach(([s, tt0], i) => { if (t < tt0) return; const d = i ? L - recL(tt0) + 34 : L - 26; if (d > L - 14 || d < 20) return; const p = pt(d); tx(c, s, p[0], p[1], { f: 'J', w: 700, s: 27, c: '#1c1917', mw: W - 24 }) });
    rr(c, -170, y0 - 8, 340, 16, 6); fill(c, '#1c1917');   // щель
  }
  function hillShape(c, kh) {   // круг торца опускается и растёт в купол белого холма: y 860 → 1520, R 230 → 720
    const hy = lp(860, 1520, kh), R = lp(230, 720, kh);
    const g = c.createLinearGradient(0, hy - R, 0, hy); g.addColorStop(0, mixc('#fbbf24', '#f1f5f9', kh)); g.addColorStop(1, mixc('#f59e0b', '#94a3b8', kh));
    c.beginPath(); c.arc(540, hy, R, 0, TAU); c.fillStyle = g; c.fill();
    return hy;
  }
  function shot7Old(c, t) {
    const kq = eio(at(t, K.s7 - .1, K.s7 + .2));      // надпись и картриджи втягиваются
    const kh = eio(at(t, K.s7 - .07, K.s7 + .73));    // 64.0–64.8: торец → купол холма
    const kp = at(t, K.s7 + .73, K.s7 + 1.9);         // табак растёт из купола
    const kb = spr(at(t, K.tube - .1, K.tube + .4)), kw = eio(at(t, K.noleaf, K.leaf + .5));
    const kl = eio(at(t, K.when - .75, K.when + .05)); // 68.8–69.6: холм со стеблями уходит вниз, колба и плашка стоят
    const kc = at(t, K.when - .55, K.when + .05), kd = at(t, K.when + .1, K.bill - .25);
    const pR = 900 * eio(at(t, K.bill - .55, K.bill - .05)), pan = 350 * ss(0, 1, kd) + pR;
    // фон: тёмный чертёж плавно уходит в такую же тёмную лабораторию, потом панорама вниз к витрине
    if (pR < 900) { c.save(); c.translate(0, -pan * .6); labBlue(c, t); c.restore(); if (kh < 1) { c.save(); c.globalAlpha = 1 - kh; blueprintBg(c, t, 1); c.restore() } }
    if (pR > 0) { c.save(); c.translate(0, 2100 * (1 - pR / 900)); storeBg(c, t); vgrad(c, -200, -120, WW + 400, 120, ['#0b0712', '#1c1426']); c.restore() }
    c.save(); c.translate(0, -pan);
    if (kl < 1 && pan < 1200) {
      c.save(); c.translate(0, 1380 * kl);
      const hy = hillShape(c, kh);
      if (kh < 1) { c.save(); c.translate(540, hy); c.scale(1 - kh, 1 - kh); capFace(c, 230); c.restore() }
      if (kq < 1) endFace(c, t, 1, kq, hy, true);
      PL.forEach((p, i) => tobacco(c, t, p, i, eo(at(kp, i * .12, .7 + i * .12)), i === 0 ? kw : Math.max(kw, ss(.5, 1, kw))));
      bud(c, PL[1].x, PL[1].ty, spr(at(kp, .7, 1)), kw); bud(c, PL[2].x, PL[2].ty, spr(at(kp, .75, 1)), kw);
      bud(c, 540, PL[0].ty, spr(at(kp, .65, .95)) * (1 - kb), 0);
      c.restore();
    }
    if (pan < 1200) {
      coil(c, t, kc, kd);
      bulb(c, 540, 380, kb, t);
      const kpl = spr(at(t, K.tube + .2, K.tube + .7)); if (kpl > 0) plate(c, 'СИНТЕТИЧЕСКИЙ НИКОТИН · БЕЗ ТАБАКА', 540, 232, kpl, { s: 30, bg: '#fbbf24', c: '#1c1917' });
    }
    // капля падает с конца змеевика на кассу
    const kfall = at(t, K.bill - .55, K.bill - .02); if (kfall > 0 && kfall < 1) { const y = lp(1180, 1250 + 848, kfall * kfall); glow(c, 540, y, 50, '#fde68a', .9); circ(c, 540, y, 16, '#fde047') }
    c.restore();
    if (pR > 0) {   // касса (мир: на 1250 ниже лаборатории)
      c.save(); c.translate(0, 1250 - pan);
      const kt = eio(at(t, K.bill - .05, K.bill + .7)) * (1 - eio(at(t, K.market - .7, K.market - .1)));
      if (kt > 0) { c.translate(540, 740); c.rotate(-.10 * kt); c.scale(lp(1, 1.4, kt), lp(1, 1.4, kt)); c.translate(-540, -740) }
      billFan(c, at(t, K.bill + .1, K.bill + .9));
      register(c, t, { disp: regDisplay(c, t), coin: spr(at(t, K.bill - .05, K.bill + .3)) * (t < K.s8 - .57 ? 1 : 0), after: () => receipt(c, t) });
      c.restore();
    }
  }

  // ================= v18.3 (проба): сцена 7 по Cola 0:41.5–1:00 (#009, #010) и Starbucks 0:05.5–0:11 (#012) =================
  // Торец опускается и становится белым холмом; из холма растут тонкие стебли с красными цветами и белыми бутонами, средний бутон —
  // лампочка; лепестки облетают; холм уходит вниз, лампочка — колба на горелке; по трубке и змеевику бегут золотые капли,
  // камера идёт вниз за ними, капля падает в одноразку, ряд наполняется; красная диагональ — и касса контуром: табло считает,
  // наезд с наклоном на табло, чек лентой ползёт вверх с названиями корпораций, фон темнеет в бордовый.
  const S7 = { nav: '#0e1432', ln: '#f1f5f9', red: '#e5484d', gold: '#fbbf24' };
  const STEM = [{ x: 290, h: 470, f: 'r' }, { x: 415, h: 330, f: 'w' }, { x: 540, h: 600, f: 'b' }, { x: 665, h: 380, f: 'w' }, { x: 795, h: 500, f: 'r' }];
  const domeY = x => 1820 - Math.sqrt(Math.max(0, 720 * 720 - (x - 540) * (x - 540)));
  function poppyS7(c, x, y, s, kw, t, i) {   // красный цветок: три лепестка (облетают при kw)
    if (s <= 0) return;
    for (let j = 0; j < 3; j++) { const fk = ss(j * .15, .5 + j * .15, kw), dx = (j - 1) * 16 + Math.sin(t * 2 + j + i) * 30 * fk, dy = 700 * fk * fk;
      c.save(); c.translate(x + dx * (1 + fk * 4), y + dy); c.rotate((j - 1) * .6 + fk * (j - 1 || 1) * 4); c.scale(s, s); c.beginPath(); c.ellipse(0, -18, 15, 24, 0, 0, TAU); fill(c, S7.red); c.restore() }
    circ(c, x, y + 4, 6 * s * (1 - kw), '#1f0a10');
  }
  function bulbS7(c, x, y, k, lit, t) {   // лампочка контуром: круг, цоколь, нить
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k);
    c.beginPath(); c.arc(0, 0, 70, Math.PI * .72, Math.PI * 2.28); c.lineTo(22, 92); c.lineTo(-22, 92); c.closePath(); fill(c, S7.nav); c.beginPath(); c.arc(0, 0, 70, Math.PI * .72, Math.PI * 2.28); c.lineTo(22, 92); c.lineTo(-22, 92); c.closePath(); lnS(c, 6, S7.ln);
    for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-20, 100 + i * 12); c.lineTo(20, 100 + i * 12); lnS(c, 5, S7.ln) }
    c.beginPath(); c.moveTo(-14, 90); c.lineTo(-14, 20); c.quadraticCurveTo(0, -16, 14, 20); c.lineTo(14, 90); lnS(c, 5, lit > 0 ? mixc('#64748b', S7.red, lit) : '#64748b');
    if (lit > 0) for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .42, r0 = 92, r1 = 92 + 34 * lit + 6 * Math.sin(t * 8 + i); c.beginPath(); c.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); c.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); lnS(c, 5, S7.ln) }
    c.restore();
  }
  function flaskS7(c, x, y, k, lv, t) {   // круглая колба с золотой жидкостью и горелкой
    c.save(); c.translate(x, y);
    const R = lp(70, 108, k), nh = lp(92, 120, k), nw = lp(22, 26, k);
    c.save(); c.beginPath(); c.arc(0, 0, R, 0, TAU); c.clip(); const ly = lp(R, -R * .2, lv); c.beginPath(); c.moveTo(-R, R); for (let xx = -R; xx <= R; xx += 8) c.lineTo(xx, ly + Math.sin(xx * .06 + t * 4) * 6); c.lineTo(R, R); c.closePath(); fill(c, S7.gold); c.restore();
    c.beginPath(); c.arc(0, 0, R, Math.PI * .58 + .1 * (1 - k), Math.PI * 2.42 - .1 * (1 - k)); c.lineTo(nw, -R - nh + R * (1 - k) * 0 - 0); c.lineTo(-nw, -R - nh); c.closePath(); lnS(c, 6, S7.ln);
    // штатив и горелка
    if (k > .3) { const kk = at(k, .3, 1); c.beginPath(); c.moveTo(-R * .9, R + 10); c.lineTo(R * .9, R + 10); lnS(c, 5, S7.ln);
      c.save(); c.translate(0, R + 110); c.scale(kk, kk); rr(c, -46, 0, 92, 70, 10); fill(c, S7.nav); rr(c, -46, 0, 92, 70, 10); lnS(c, 5, S7.ln); c.fillStyle = S7.ln; c.fillRect(-46, 46, 92, 24);
        const fl = 1 + .14 * Math.sin(t * 19); c.save(); c.scale(1, fl); c.beginPath(); c.moveTo(0, -72); c.quadraticCurveTo(28, -24, 0, 0); c.quadraticCurveTo(-28, -24, 0, -72); fill(c, S7.red); c.beginPath(); c.moveTo(0, -42); c.quadraticCurveTo(13, -14, 0, 0); c.quadraticCurveTo(-13, -14, 0, -42); fill(c, '#fde68a'); c.restore(); c.restore() }
    c.restore();
  }
  const TUB7 = (() => { const P = [[360, 286], [360, 230], [720, 230], [720, 380]]; for (let i = 0; i <= 80; i++) { const u = i / 80; P.push([720 + Math.sin(u * 8 * Math.PI) * 70, 380 + u * 1070]) } P.push([720, 1500]); return P })();
  const TL7 = (() => { let L = 0; const D = [0]; for (let i = 1; i < TUB7.length; i++) { L += Math.hypot(TUB7[i][0] - TUB7[i - 1][0], TUB7[i][1] - TUB7[i - 1][1]); D.push(L) } return D })();
  function tubeS7(c, t, kd, kf) {
    const L = TL7[TL7.length - 1]; c.lineJoin = 'round'; c.lineCap = 'round';
    const path = () => { c.beginPath(); TUB7.forEach(([x, y], i) => c[i ? 'lineTo' : 'moveTo'](x, y)) };
    c.save(); path(); if (kd < 1) c.setLineDash([L * kd, L + 10]); lnS(c, 16, S7.ln); path(); if (kd < 1) c.setLineDash([L * kd, L + 10]); lnS(c, 8, S7.nav); c.restore();
    if (kf > 0) { c.save(); path(); c.setLineDash([60, 90]); c.lineDashOffset = -t * 420; const g = Math.min(L * kd, L * kf); c.restore(); c.save(); path(); c.setLineDash([60, 90]); c.lineDashOffset = -t * 420; c.beginPath(); TUB7.forEach(([x, y], i) => { if (TL7[i] <= g) c[i ? 'lineTo' : 'moveTo'](x, y) }); lnS(c, 8, S7.gold); c.restore() }
    rr(c, 696, 1490, 48, 40, 8); fill(c, S7.nav); rr(c, 696, 1490, 48, 40, 8); lnS(c, 5, S7.ln);
  }
  function vapeFillS7(c, x, yb, w, h, kf) {
    const top = yb - h; rr(c, x - w / 2, top, w, h, 28); fill(c, S7.nav);
    if (kf > 0) { c.save(); rr(c, x - w / 2, top, w, h, 28); c.clip(); c.fillStyle = S7.gold; c.fillRect(x - w / 2, yb - h * kf, w, h * kf); c.restore() }
    rr(c, x - w / 2, top, w, h, 28); lnS(c, 5, S7.ln); rr(c, x - w * .28, top - 54, w * .56, 60, 14); fill(c, S7.nav); rr(c, x - w * .28, top - 54, w * .56, 60, 14); lnS(c, 5, S7.ln);
  }
  function shopIntS7(c, t, kr) {   // интерьер магазина контуром (как у Starbucks) — темнеет в бордовый на «корпорации»
    c.fillStyle = mixc('#232741', '#2a0f1f', kr); c.fillRect(-300, -300, WW + 600, HH + 600);
    const lc = mixc('#3a3f62', '#4a1d30', kr);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) { const x = -40 + i * 300, y = 300 + r * 230; c.beginPath(); c.rect(x, y, 250, 170); lnS(c, 4, lc);
      for (let j = 0; j < 4; j++) { c.beginPath(); c.roundRect(x + 30 + j * 52, y + 70, 30, 76, 8); lnS(c, 3, lc) } }
    c.beginPath(); c.moveTo(-300, 1250); c.lineTo(WW + 300, 1250); lnS(c, 5, S7.ln);
  }
  function registerS7(c, t, disp) {   // касса контуром: корпус с косой заливкой, ступенька со щелью, табло на стойке
    const body = () => { c.beginPath(); c.moveTo(300, 1250); c.lineTo(780, 1250); c.lineTo(780, 1100); c.lineTo(740, 1020); c.lineTo(430, 1020); c.lineTo(430, 960); c.lineTo(300, 960); c.closePath() };
    body(); fill(c, '#2b2f4a'); c.save(); body(); c.clip(); c.beginPath(); c.moveTo(280, 960); c.lineTo(520, 960); c.bezierCurveTo(560, 1120, 700, 1180, 800, 1260); c.lineTo(280, 1260); c.closePath(); fill(c, '#4b3f8e'); c.restore(); body(); lnS(c, 6, S7.ln);
    for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++) { c.beginPath(); c.roundRect(470 + i * 56, 1040 + r * 44, 40, 30, 6); lnS(c, 4, S7.ln) }
    c.beginPath(); c.moveTo(310, 1180); c.lineTo(770, 1180); lnS(c, 4, S7.ln);
    c.beginPath(); c.moveTo(325, 960); c.lineTo(405, 960); lnS(c, 9, '#0b0f19');   // щель для чека
    c.beginPath(); c.moveTo(620, 1020); c.lineTo(620, 792); lnS(c, 8, S7.ln);
    rr(c, 430, 640, 380, 150, 8); fill(c, '#1b1f36'); c.save(); rr(c, 430, 640, 380, 150, 8); c.clip(); poly(c, [600, 640, 810, 640, 810, 710, 520, 790, 430, 790]); fill(c, 'rgba(255,255,255,.07)'); c.restore(); rr(c, 430, 640, 380, 150, 8); lnS(c, 6, S7.ln);
    disp(620, 715);
    vapeFillS7(c, 920, 1250, 96, 230, 1);
  }
  const recL7 = t => 600 * eio(at(t, K.market - .3, K.corp + .6));
  function receiptS7(c, t) {   // чек: лента ползёт вверх из щели, наверху загибается и волнами спускается слева
    const L = recL7(t); if (L <= 0) return; const x = 365, y0 = 960, Wd = 236, up = Math.min(L, 600);
    rr(c, x - Wd / 2, y0 - up, Wd, up, 4); fill(c, '#fafaf9'); c.beginPath(); c.moveTo(x - Wd / 2, y0); c.lineTo(x - Wd / 2, y0 - up); c.lineTo(x + Wd / 2, y0 - up); c.lineTo(x + Wd / 2, y0); lnS(c, 4, '#cbd5e1');
    const lines = [['ЧЕК · РЫНОК ОДНОРАЗОК', K.market - .2], ['VUSE GO — BAT', K.old - .1], ['NJOY — ALTRIA', K.corp - .2], ['(«МАЛЬБОРО»)', K.corp + .1]];
    lines.forEach(([s2, t0], i) => { if (t < t0) return; const d = i ? Math.min(up - 80, Math.min(L, 600) - Math.min(recL7(t0), 600) + 30) : up - 30; if (d < 16) return; tx(c, s2, x, y0 - d, { f: 'J', w: 700, s: i ? 24 : 21, c: '#1c1917', mw: Wd - 20 }) });
  }
  function shot7(c, t) {
    const kh = eio(at(t, K.s7 - .07, K.s7 + .73)), kq = eio(at(t, K.s7 - .1, K.s7 + .2));
    const kg = at(t, K.s7 + .7, K.tube - .1), lit = eo(at(t, K.tube - .05, K.tube + .25)), kw = eio(at(t, K.noleaf, K.leaf + .5));
    const kl = eio(at(t, K.when - .75, K.when + .05)), kfm = eio(at(t, K.when - .75, K.when - .2));
    const kd = at(t, K.when - .4, K.when + .3), kfl = at(t, K.when - .05, K.bill - .6);
    const P = 1100 * eio(at(t, K.when + .05, K.bill - .75));
    const wipe = at(t, K.bill - .36, K.bill - .04);
    // ---- лаборатория (до конца шторки) ----
    if (wipe < 1) {
      c.fillStyle = S7.nav; c.fillRect(0, 0, WW, HH);
      if (kh < 1) { c.save(); c.translate(0, -1920 * kh); blueprintBg(c, t, 1); c.restore() }
      c.save(); c.translate(0, -P);
      if (kl < 1) {
        c.save(); c.translate(0, 1380 * kl);
        const hy = lp(860, 1820, kh), R = lp(230, 720, kh);
        c.beginPath(); c.arc(540, hy, R, 0, TAU); fill(c, '#f1f5f9');   // v18.4: торец уже белый, как крышка банки
        if (kh > .5) { c.save(); c.beginPath(); c.arc(540, hy, R, 0, TAU); c.clip(); for (let a = -2.4; a < -.7; a += .045) for (let j = 0; j < 3; j++) { const rr2 = R - 14 - j * 18; circ(c, 540 + Math.cos(a) * rr2, hy + Math.sin(a) * rr2, 3.2 - j * .8, rgba(S7.nav, .35 * (1 - j / 3))) } c.restore() }
        if (kh < 1) { c.save(); c.translate(540, hy); c.scale(1 - kh, 1 - kh); capFace(c, 230); c.restore() }
        if (kq < 1) endFace(c, t, 1, kq, hy, true);
        if (kh >= 1) STEM.forEach((st, i) => {
          const kk = eo(at(kg, i * .08, .55 + i * .08)); if (kk <= 0) return;
          const by = domeY(st.x), top = by - st.h * kk, sway = Math.sin(t * 1.3 + i) * 8 * kk, droop = st.f === 'b' ? 0 : kw * 60 * (i < 2 ? -1 : 1);
          c.beginPath(); c.moveTo(st.x, by); c.quadraticCurveTo(st.x + (i % 2 ? 26 : -26), (by + top) / 2, st.x + sway + droop, top + kw * 30 * (st.f === 'b' ? 0 : 1)); lnS(c, 5, S7.ln);
          const fx = st.x + sway + droop, fy = top + kw * 30 * (st.f === 'b' ? 0 : 1), fk = spr(at(kg, .45 + i * .08, .8 + i * .08));
          if (st.f === 'r') poppyS7(c, fx, fy, fk, kw, t, i);
          else if (st.f === 'w') { c.save(); c.translate(fx, fy); c.scale(fk * (1 - kw * .6), fk * (1 - kw * .6)); c.beginPath(); c.ellipse(0, -8, 11, 15, 0, 0, TAU); fill(c, S7.ln); c.restore() }
        });
        c.restore();
      }
      // лампочка → колба на горелке; трубка, змеевик
      const bx = lp(540, 360, kfm), byy = lp(domeY(540) - STEM[2].h - 70, 470, kfm);
      if (kfm <= 0) { const kb = spr(at(kg, .5, .95)); if (kb > 0) bulbS7(c, 540, domeY(540) - STEM[2].h * eo(at(kg, .16, .71)) - 70 + 1380 * kl, kb, lit, t) }
      else { if (kd > 0) tubeS7(c, t, eo(kd), kfl); flaskS7(c, bx, byy, kfm, lp(.6, .25, kfl), t); if (kfm < .5) bulbS7(c, bx, byy, 1 - kfm * 2, lit, t) }
      const kpl = spr(at(t, K.tube + .2, K.tube + .7)) * (1 - eio(at(t, K.when - .5, K.when - .1))); if (kpl > 0) plate(c, 'СИНТЕТИЧЕСКИЙ НИКОТИН · БЕЗ ТАБАКА', 540, 232, kpl, { s: 30, bg: S7.gold, c: '#1c1917' });
      // капля из змеевика в одноразку, ряд наполняется
      const vf = at(t, K.bill - .75, K.bill - .55); if (vf > 0 && vf < 1) circ(c, 720, lp(1530, 1990, vf * vf), 14, S7.gold);
      if (P > 200) for (let k = -3; k <= 1; k++) { const x = 720 + k * 230, t0 = K.bill - .55 + (k === 0 ? 0 : (Math.abs(k) * .07 + .05)); vapeFillS7(c, x, 2440, 160, 400, eo(at(t, t0, t0 + .3))) }
      c.restore();
    }
    // ---- касса (#012): за красной диагональю ----
    if (wipe > 0) {
      const x0 = lp(-2300, 1300, wipe);
      c.save(); if (wipe < 1) { c.beginPath(); c.moveTo(-200, -200); c.lineTo(x0 + 700 + 110, -200); c.lineTo(x0 - 110, HH + 200); c.lineTo(-200, HH + 200); c.closePath(); c.clip() }
      const zk = eio(at(t, K.bill - .05, K.bill + .6)) * (1 - eio(at(t, K.market - .75, K.market - .15))), z = 1 + .75 * zk, kr = eio(at(t, K.corp - .3, K.corp + .4));
      c.translate(620, 715); c.rotate(-.07 * zk); c.scale(z, z); c.translate(-620, -715);
      shopIntS7(c, t, kr);
      receiptS7(c, t);
      registerS7(c, t, (x, y) => { const k = eio(at(t, K.bill - .1, K.bill + 1.0)), v = Math.round(3.2e9 * k / 1e6) * 1e6, s2 = '$' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        num(c, k >= 1 ? REGNUM : s2, x, y - 10, { f: 'J', w: 700, s: 50, c: '#f59e0b' }); tx(c, 'ОДНОРАЗКИ · США · ГОД', x, y + 44, { f: 'O', w: 500, s: 20, c: '#fdba74', ls: 3 }) });
      const kc = spr(at(t, K.corp + .1, K.corp + .5)); if (kc > 0 && t < K.s8 - .57) { const cy = lp(1020, 850, kc); circ(c, 540, cy, 36, '#f59e0b'); ring(c, 540, cy, 27, '#b45309', 4) }
      c.restore();
      if (wipe < 1) { c.beginPath(); c.moveTo(x0 - 110, HH + 200); c.lineTo(x0 + 700 + 110, -200); c.lineTo(x0 + 700 + 110 + 900, -200); c.lineTo(x0 - 110 + 900, HH + 200); c.closePath(); fill(c, S7.red) }
    }
  }
  // ================= СЦЕНА 8 (v18.4): монета → Луна, город поднимается снизу, общежитие в разрезе — как у World of Tanks #076 =================
  // Всё плоско: ровный тёмный фон, белая Луна без свечения, дома тремя оттенками с оранжевыми окнами, шпиль перечёркивает Луну.
  // Общежитие въезжает справа: верхний левый угол — фасад с сеткой окон, нижний правый — разрез с этажами; белые плиты и косая белая балка, как у WoT.
  // В комнатах — силуэты без лиц, голубые огоньки одноразок вспыхивают на затяжке, пар — контурными кружками; на окнах иней.
  const S8 = { bg: '#26223a', b1: '#332e4a', b2: '#3f3958', b3: '#4c4667', win: '#f4a261', ln: '#f1f5f9', slab: '#d6d1e0', inside: '#2b2638', room: '#38314c', sil: '#15121c' };
  const DM = { w: 640, top: 360, bot: 1400 };   // здание: 4 этажа по 260
  function cityRow(c, seed, base, hMin, hMax, col, winA, t) {   // ряд домов: прямоугольники, ступени крыш, окна полосками
    let x = -60, i = 0;
    while (x < WW + 60) {
      const w = 70 + H1(seed + i * 3.1) * 90, h = hMin + H1(seed + i * 5.7) * (hMax - hMin), top = base - h;
      c.fillStyle = col; c.fillRect(x, top, w + 1, h + 400);
      if (H1(seed + i * 8.3) > .6) { c.fillRect(x + w * .3, top - 40, w * .4, 42); if (H1(seed + i * 2.2) > .5) c.fillRect(x + w * .48, top - 90, 6, 52) }
      for (let r = 0; r < Math.floor(h / 46) - 1; r++) for (let q = 0; q < Math.floor((w - 20) / 26); q++) {
        const on = H1(seed * 7 + i * 13 + r * 5 + q) < winA; if (!on) continue;
        c.fillStyle = H1(seed + i + r * 3 + q * 7) > .3 ? S8.win : '#fde68a'; c.fillRect(x + 14 + q * 26, top + 28 + r * 46, 12, 18);
      }
      x += w + 6; i++;
    }
  }
  function spire(c, x, base) {   // шпиль, перечёркивает Луну
    c.fillStyle = S8.b2; c.fillRect(x - 46, base - 520, 92, 600); poly(c, [x - 46, base - 520, x, base - 700, x + 46, base - 520]); c.fill(); c.fillRect(x - 3, base - 860, 6, 170);
    for (let r = 0; r < 9; r++) { c.fillStyle = r % 3 ? S8.win : '#fde68a'; c.fillRect(x - 26, base - 480 + r * 52, 14, 22); c.fillRect(x + 12, base - 480 + r * 52, 14, 22) }
  }
  function dorm(c, t, cx) {
    const L = cx - DM.w / 2, R = cx + DM.w / 2, T = DM.top, B = DM.bot, FH = (B - T) / 4;
    c.save(); c.translate(16, 18); c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(L, T, DM.w, B - T); c.restore();
    c.fillStyle = S8.inside; c.fillRect(L, T, DM.w, B - T);
    for (let f = 0; f < 4; f++) {
      const fy = T + f * FH, lit = f > 0;
      c.fillStyle = lit ? S8.room : S8.inside; c.fillRect(L + 10, fy + 10, DM.w - 20, FH - 30);
      c.fillStyle = S8.slab; c.fillRect(L, fy + FH - 20, DM.w, 20);   // белая плита перекрытия
      c.beginPath(); c.moveTo(R - 170, fy + FH - 20); c.lineTo(R - 30, fy + 18); lnS(c, 5, '#8f88a3');   // лестница
      for (let s2 = 0; s2 < 8; s2++) { c.fillStyle = '#8f88a3'; c.fillRect(R - 170 + s2 * 17, fy + FH - 34 - s2 * 28, 18, 6) }
      if (!lit) continue;
      const wx = L + 60, wy = fy + 34;   // окно с инеем по углам
      rr(c, wx, wy, 130, 110, 6); fill(c, '#1b2142'); circ(c, wx + 100, wy + 30, 6, '#f8fafc');
      const fr = 22 + 46 * at(t, K.s8, K.b0); c.save(); rr(c, wx, wy, 130, 110, 6); c.clip();
      [[wx, wy], [wx + 130, wy], [wx, wy + 110], [wx + 130, wy + 110]].forEach(([qx, qy], j) => { c.save(); c.translate(qx, qy); c.rotate(j * Math.PI / 2); poly(c, [0, 0, fr, 0, fr * .55, fr * .3, fr * .3, fr * .55, 0, fr]); fill(c, '#d9f3fb'); c.restore() }); c.restore();
      rr(c, wx, wy, 130, 110, 6); lnS(c, 5, S8.slab);
      const dx = L + 250 + (f % 2) * 60, dy = fy + FH - 20;   // стол, лампа, силуэт в профиль
      c.fillStyle = '#5a5272'; c.fillRect(dx, dy - 90, 170, 12); c.fillRect(dx + 10, dy - 80, 10, 80); c.fillRect(dx + 150, dy - 80, 10, 80);
      poly(c, [dx + 128, dy - 150, dx + 150, dy - 150, dx + 200, dy - 92, dx + 80, dy - 92]); fill(c, 'rgba(253,230,138,.14)'); c.fillStyle = '#a78bfa'; c.fillRect(dx + 134, dy - 160, 8, 70);
      const sx = dx - 40; c.fillStyle = S8.sil; rr(c, sx - 34, dy - 150, 68, 110, 26); c.fill(); circ(c, sx, dy - 182, 32, S8.sil); rr(c, sx - 34, dy - 214, 60, 40, 18); c.fill();
      c.fillRect(sx - 30, dy - 50, 22, 50); c.fillRect(sx + 6, dy - 50, 22, 50);
      const cyc = (t * .42 + f * .31) % 1, inh = Math.pow(Math.max(0, Math.sin(cyc * Math.PI * 2)), 3);   // затяжка: огонёк вспыхивает, комнату красит голубым
      if (inh > .02) { c.save(); c.beginPath(); c.rect(L + 10, fy + 10, DM.w - 20, FH - 30); c.clip(); circ(c, dx + 60, dy - 100, 150 + 60 * inh, rgba('#38bdf8', .12 * inh)); c.restore() }
      const vx = dx + 60, vy = dy - 104; rr(c, vx - 7, vy - 26, 14, 30, 5); fill(c, '#0ea5e9'); circ(c, vx, vy - 20, 16 + 12 * inh, rgba('#38bdf8', .35 + .3 * inh)); circ(c, vx, vy - 20, 4 + 3 * inh, '#e0f2fe');
      c.save(); c.beginPath(); c.rect(L + 10, fy + 10, DM.w - 20, FH - 30); c.clip();   // пар — контурные кружки
      for (let j = 0; j < 5; j++) { const ph = (t * .35 + j / 5 + f * .13) % 1, r0 = 10 + ph * 30; if (ph < .9) { c.beginPath(); c.arc(vx + 4 + Math.sin(ph * 6 + j) * 16 + ph * 50, vy - 40 - ph * 150, r0, 0, TAU); lnS(c, 4, rgba('#e0f2fe', .8 * (1 - ph))) } }
      c.restore();
    }
    c.save(); poly(c, [L, T, R, T, L, B]); c.clip();   // фасад: верхний левый угол, сетка окон
    c.fillStyle = '#5f5876'; c.fillRect(L, T, DM.w, B - T);
    for (let f = 0; f < 4; f++) for (let i = 0; i < 4; i++) { const wx = L + 40 + i * 150, wy = T + f * FH + 60; rr(c, wx, wy, 90, 120, 6); fill(c, H1(i + f * 4) > .5 ? S8.win : '#2b2638'); rr(c, wx, wy, 90, 120, 6); lnS(c, 5, S8.slab) }
    c.restore();
    c.beginPath(); c.moveTo(R, T); c.lineTo(L, B); lnS(c, 18, S8.slab);   // косая белая балка по срезу
    c.fillStyle = '#1d1a2b'; c.fillRect(L - 20, T - 34, DM.w + 40, 36); c.beginPath(); c.rect(L - 20, T - 34, DM.w + 40, 36); lnS(c, 4, S8.slab);
    c.beginPath(); c.rect(L, T, DM.w, B - T); lnS(c, 5, S8.slab);
  }
  const MOON = { x: 220, y: 340, r: 95 };
  function moon8(c, x, y, r, col = '#f8fafc') { circ(c, x, y, r, col); circ(c, x - r * .3, y - r * .2, r * .18, '#e2e8f0'); circ(c, x + r * .3, y + r * .25, r * .13, '#e2e8f0') }
  function shot8(c, t) {
    // 75.5–76.5: касса уезжает вниз, монета летит по дуге и становится Луной; город поднимается снизу; общежитие въезжает справа
    const p = eio(at(t, K.s8 - .57, K.s8 + .43));
    const kp = 1 + .2 * eo(at(t, K.s8 + .5, K.b0 + 2));   // v18.5: наезд не встаёт к доске
    const kc = eo(at(t, K.s8 - .2, K.s8 + .8)), kc2 = eo(at(t, K.s8 + .05, K.s8 + 1));
    c.save(); c.translate(620, 1010); c.scale(kp, kp); c.translate(-620, -1010);
    c.fillStyle = S8.bg; c.fillRect(-500, -500, WW + 1000, HH + 1000);
    for (let i = 0; i < 26; i++) circ(c, H1(i * 4.4) * WW, H1(i * 6.6) * 900, 2 + H1(i) * 2, rgba('#e2e8f0', .35 + .25 * Math.sin(t * 1.7 + i)));
    if (p >= 1) moon8(c, MOON.x, MOON.y, MOON.r);
    c.save(); c.translate(0, 900 * (1 - kc)); cityRow(c, 21, 1420, 260, 640, S8.b1, .25, t); spire(c, 250, 1420); c.restore();
    c.save(); c.translate(0, 900 * (1 - kc2)); cityRow(c, 7, 1420, 160, 420, S8.b2, .35, t); c.restore();
    c.fillStyle = '#1d1a2b'; c.fillRect(-500, 1400, WW + 1000, 900); c.beginPath(); c.moveTo(-500, 1400); c.lineTo(WW + 500, 1400); lnS(c, 4, S8.slab);
    const kd = bo(at(t, K.s8 + .43, K.s8 + 1.3)); if (kd > 0) dorm(c, t, lp(1460, 600, kd));
    c.restore();
    if (p < 1) {   // касса уезжает вниз целиком (без растворения), монета летит в Луну
      c.save(); c.translate(0, 1950 * p); c.beginPath(); c.rect(-200, -200, WW + 400, HH + 400); c.clip(); shotD(c, t); c.restore();
      const x = lp(540, MOON.x, p), y = lp(850, MOON.y, p) - Math.sin(Math.PI * p) * 140, r = lp(36, MOON.r, p);
      if (p > .6) moon8(c, x, y, r, mixc('#f59e0b', '#f8fafc', ss(.6, 1, p))); else { circ(c, x, y, r, mixc('#f59e0b', '#f8fafc', p)); ring(c, x, y, r * .76, rgba('#b45309', 1 - p), 4) }
    }
  }
  // ================= СЦЕНА 9: пробковая доска и две концовки =================
  const CARDS = [
    { id: '1979', x: 340, y: 400, a: '1979', b: 'СОЛЬ', open: true },
    { id: '2020', x: 740, y: 400, a: '2020', b: 'ЛАЗЕЙКА ОДНОРАЗОК', open: true },
    { id: '2014', x: 230, y: 790, a: '2014', b: 'НАГРЕВАТЕЛИ' },
    { id: '1924', x: 540, y: 805, a: '1924', b: '«МАЛЬБОРО»' },
    { id: '2022', x: 850, y: 790, a: '2022', b: 'ШАЙБЫ' },
  ];
  const CW = 270, CH = 330, PH = 240;
  const photoC = cd => [cd.x, cd.y - CH / 2 + 15 + PH / 2];
  const pinP = cd => [cd.x, cd.y - CH / 2 + 4];
  let CORK = null;
  function corkImg() {   // v18.4: пробка ровным цветом, редкие точки — как растр у Боба
    if (CORK) return CORK; CORK = mk(WW, 1400); const g = CORK.getContext('2d');
    g.fillStyle = '#b07a4a'; g.fillRect(0, 0, WW, 1400);
    for (let y = 10, r = 0; y < 1400; y += 22, r++) for (let x = (r % 2) * 11; x < WW; x += 22) { if (H1(x * .37 + y * 1.13) > .55) continue; g.fillStyle = 'rgba(120,72,35,.35)'; g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill() }
    return CORK;
  }
  function boardWall(c, t) {   // v18.4: ровная стена, рама контуром, плоский конус света от качающейся лампы
    c.fillStyle = '#1f1b2b'; c.fillRect(-1200, -1200, WW + 2400, 5200);
    c.save(); rr(c, 30, 150, WW - 60, 1050, 14); fill(c, '#5b3d26'); rr(c, 52, 172, WW - 104, 1006, 8); c.clip(); c.drawImage(corkImg(), 0, 0); c.restore();
    rr(c, 30, 150, WW - 60, 1050, 14); lnS(c, 5, '#f1e6d6'); rr(c, 52, 172, WW - 104, 1006, 8); lnS(c, 3, 'rgba(241,230,214,.5)');
    const sw = Math.sin(t * 1.25) * .2, bx = 540 + Math.sin(sw) * 1300;
    c.beginPath(); c.moveTo(540, -400); c.lineTo(540, 40); lnS(c, 3, '#f1e6d6');
    c.save(); c.translate(540, 40); c.rotate(-sw * .25); c.beginPath(); c.arc(0, 30, 44, Math.PI, 0); c.closePath(); fill(c, '#2b2638'); c.beginPath(); c.arc(0, 30, 44, Math.PI, 0); c.closePath(); lnS(c, 4, '#f1e6d6'); circ(c, 0, 34, 10, '#fde68a'); c.restore();
    poly(c, [540 - 30, 74, 540 + 30, 74, bx + 420, 1200, bx - 420, 1200]); fill(c, 'rgba(253,230,138,.09)');
  }
  function photo1979(c, t, x, y, s) {   // v18.4: колба контуром и голубой кристалл соли — плоско
    c.fillStyle = '#1b2142'; c.fillRect(x - s / 2, y - s / 2, s, s);
    c.save(); c.translate(x - s * .12, y + s * .08); c.scale(s / 240, s / 240);
    poly(c, [-38, 20, 38, 20, 56, 56, -56, 56]); fill(c, '#38bdf8');
    poly(c, [-14, -80, 14, -80, 14, -30, 60, 60, -60, 60, -14, -30]); c.strokeStyle = '#e0f2fe'; c.lineWidth = 5; c.lineJoin = 'round'; c.stroke();
    c.restore();
    c.save(); c.translate(x + s * .24, y + s * .2); c.scale(s / 240, s / 240); poly(c, [0, -34, 26, -10, 18, 26, -18, 26, -26, -10]); fill(c, '#7dd3fc'); poly(c, [0, -34, 26, -10, 0, 0]); fill(c, '#e0f2fe'); poly(c, [0, -34, 26, -10, 18, 26, -18, 26, -26, -10]); c.strokeStyle = '#e0f2fe'; c.lineWidth = 3; c.stroke(); c.restore();
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
    const u = MODE === 'y' && K.ledi ? 1 - at(t, K.ledi - .5, K.endT) : 0, w2 = u * u;   // мостик: лучи и сигарета плавно «садятся» в кадр 0 3-й главы
    c.fillStyle = '#0f172a'; c.fillRect(-200, -200, WW + 400, HH + 400);
    const g = c.createRadialGradient(540, 860, 0, 540, 860, 1000); g.addColorStop(0, '#1e3a8a'); g.addColorStop(.5, '#172554'); g.addColorStop(1, '#0f172a'); c.fillStyle = g; c.fillRect(-200, -200, WW + 400, HH + 400);
    c.save(); c.translate(540, 860); c.rotate(.22 * w2); for (let i = 0; i < 24; i++) { c.save(); c.rotate(i * TAU / 24); poly(c, [0, 0, -40, -1400, 40, -1400]); fill(c, i % 2 ? 'rgba(212,160,23,.07)' : 'rgba(212,160,23,.03)'); c.restore() }
    [260, 360, 470].forEach((r, i) => { c.beginPath(); c.arc(0, 0, r, Math.PI * 1.1, Math.PI * 1.9); stroke(c, rgba('#d4a017', .35 - i * .08), 4) }); c.restore();
    c.save(); c.strokeStyle = 'rgba(212,160,23,.35)'; c.lineWidth = 4; [[0, 0], [WW, 0], [0, HH], [WW, HH]].forEach(([qx, qy]) => { c.save(); c.translate(qx, qy); c.scale(qx ? -1 : 1, qy ? -1 : 1); for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(40 + i * 26, 230); c.lineTo(40 + i * 26, 40 + i * 26); c.lineTo(230, 40 + i * 26); c.stroke() } c.restore() }); c.restore();
    glow(c, 540, 860, 420, '#fde68a', .14);
    c.save(); c.translate(540, 860); c.scale(1 + .1 * w2, 1 + .1 * w2); c.save(); c.translate(30, 40); rr(c, -38, -330, 76, 660, 20); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, -38, -330, 76, 660, 20); fill(c, '#f8fafc'); c.fillStyle = 'rgba(203,213,225,.6)'; c.fillRect(14, -330, 16, 660);
    rr(c, -38, -330, 76, 70, 20); fill(c, '#e11d48'); c.fillStyle = '#be123c'; c.fillRect(-38, -270, 76, 10);
    c.restore();
  }
  function cardDraw(c, t, cd, o = {}) {
    const [px, py] = photoC(cd);
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW / 2, -CH / 2, CW, CH, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW / 2, cd.y - CH / 2, CW, CH, 6); fill(c, '#f5f0e6'); rr(c, cd.x - CW / 2, cd.y - CH / 2, CW, CH, 6); lnS(c, 3, '#2b2638');
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
    tx(c, cd.a, cd.x, cd.y + CH / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' });
    if (o.sub) flipLabel(c, cd.b, o.sub, cd.x, cd.y + CH / 2 - 18, o.subA, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW - 24 }, { f: 'M', w: 800, s: 18, c: '#b91c1c', mw: CW - 24 }, 1);
    else tx(c, cd.b, cd.x, cd.y + CH / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW - 24 });
    if (o.q > 0) { const [qx, qy] = photoC(cd); c.save(); c.translate(qx, qy); c.scale(o.q, o.q); tx(c, '?', 0, 4, { f: 'U', w: 800, s: 150, c: '#fbbf24', sw: 10, sc: '#78350f' }); c.restore() }
    if (!o.noPin) pin(c, ...pinP(cd));
  }
  function pin(c, x, y) { circ(c, x + 3, y + 5, 14, 'rgba(0,0,0,.35)'); circ(c, x, y, 14, '#dc2626'); circ(c, x - 4, y - 4, 5, '#fca5a5') }
  function thread(c, a, b, k = 1) { if (k <= 0) return; const [x1, y1] = pinP(a), [x2, y2] = pinP(b); c.save(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(lp(x1, x2, k) + 3, lp(y1, y2, k) + 6); c.stroke(); c.strokeStyle = '#dc2626'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, k), lp(y1, y2, k)); c.stroke(); c.restore() }
  function board(c, t, o = {}) {
    boardWall(c, t);
    const C0 = CARDS, th = o.th || [1, 1, 1];   // нити от 2020 к 2014, 1924, 2022
    thread(c, C0[0], C0[1]);
    [[C0[2], 0], [C0[3], 1], [C0[4], 2]].forEach(([cd, i]) => thread(c, C0[1], cd, eo(th[i])));
    const wob = { '2014': o.wob?.[0], '1924': o.wob?.[1], '2022': o.wob?.[2] };
    if (o.hl > 0) { const cd = C0[1]; glow(c, cd.x, cd.y, 300, '#fde68a', .45 * o.hl) }
    C0.forEach(cd => { if (o.skip === cd.id) return; const w = wob[cd.id] || 0, [px, py] = pinP(cd);
      c.save(); if (w) { c.translate(px, py); c.rotate(w); c.translate(-px, -py) } cardDraw(c, t, cd, { ...(o.card && o.card[cd.id] || {}), noPin: true, q: o.q?.[cd.id] || 0 }); c.restore() });
    [C0[0], C0[1], C0[3], C0[2], C0[4]].forEach(cd => { if (!(o.card && o.card[cd.id] && o.card[cd.id].noPin)) pin(c, ...pinP(cd)) });
  }
  function boardS(t) {   // шортс: нити рисуются по очереди, карточка качается на кнопке, вспыхивает золотой «?»
    const th = [], wob = [], q = {};
    ['2014', '1924', '2022'].forEach((id, i) => { const t0 = K.th0 + i * 1.2; th.push(at(t, t0, t0 + .9)); const d = t - t0 - .9; wob.push(d > 0 ? .1 * Math.sin(d * 9) * Math.exp(-d * 2.2) : 0); q[id] = bo(at(t, t0 + .85, t0 + 1.25)) });
    return { th, wob, q, hl: at(t, K.hl0, K.hl0 + .3) * (1 - at(t, K.th0 + 2.2, K.th0 + 2.6)) * (.75 + .25 * Math.sin(t * 6)) };
  }
  // ---------- переход от общежития к карточке 2020 (отъезд камеры) ----------
  function zoomOutTo2020(c, t, drawBoard) {
    // отъезд: окно фото карточки 2020 сначала больше экрана, потом сжимается в свою рамку; дом виден ТОЛЬКО внутри окна фото
    const k = eio(at(t, K.b0, K.zo1)), [pcx, pcy] = photoC(CARDS[1]);
    const z = Math.exp(lp(Math.log(HH / PH), 0, k)), Px = lp(540, pcx, k), Py = lp(960, pcy, k), side = PH * z;
    c.save(); c.translate(Px, Py); c.scale(z, z); c.translate(-pcx, -pcy); drawBoard(c); c.restore();
    const span = Math.exp(lp(Math.log(HH), Math.log(1040), k)), sc = side / span, Cx = lp(540, 620, k), Cy = lp(960, 880, k);
    c.save(); c.beginPath(); c.rect(Px - side / 2, Py - side / 2, side, side); c.clip();
    c.translate(Px, Py); c.scale(sc, sc); c.translate(-Cx, -Cy); shot8(c, t); c.restore();
  }
  // ---------- концовка А (шортс): штамп, спуск к ноутбуку, зум в кадр 0 ----------
  const LAP = { x: 540, y: 2360, vw: 180, vh: 320 };   // прямоугольник видео на экране ноутбука (мир)
  let F0C = null;
  function frame0In(c, x, y, w, h, sx, sy, sw2, sh2) {   // кадр 0 векторно: экран ноутбука целиком в его фоне, без чёрных полос
    c.save(); c.beginPath(); c.rect(sx, sy, sw2, sh2); c.clip(); c.translate(x, y); c.scale(w / WW, h / HH); shot1(c, 0); yearPill(c, 2020, 2020, 1, 1, true); c.restore();
  }
  function deskWorld(c, t) {   // v18.4: под доской плоско — стол, лампа контуром, силуэт со спины, ноутбук с роликом
    c.fillStyle = '#4a3424'; c.fillRect(-400, 1700, WW + 800, 1600); c.beginPath(); c.moveTo(-400, 1700); c.lineTo(WW + 400, 1700); lnS(c, 5, '#f1e6d6');
    c.save(); c.translate(150, 1700); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -420); c.lineTo(200, -310); lnS(c, 10, '#2b2638'); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -420); c.lineTo(200, -310); lnS(c, 3, '#f1e6d6');
    c.translate(200, -310); c.rotate(.6); poly(c, [-50, -20, 50, -20, 80, 60, -80, 60]); fill(c, '#2b2638'); poly(c, [-50, -20, 50, -20, 80, 60, -80, 60]); lnS(c, 4, '#f1e6d6'); c.restore();
    poly(c, [330, 1440, 420, 1430, 1020, 2600, 120, 2600]); fill(c, 'rgba(253,230,138,.08)');
    const { x, y, vw, vh } = LAP, SW = 640, SH = 400;
    rr(c, x - SW / 2 - 18, y - SH / 2 - 18, SW + 36, SH + 36, 18); fill(c, '#111827'); rr(c, x - SW / 2 - 18, y - SH / 2 - 18, SW + 36, SH + 36, 18); lnS(c, 4, '#f1e6d6');
    frame0In(c, x - vw / 2, y - vh / 2, vw, vh, x - SW / 2, y - SH / 2, SW, SH);
    c.fillStyle = '#18181b'; c.fillRect(x - SW / 2, y - SH / 2, SW, 30); circ(c, x - SW / 2 + 20, y - SH / 2 + 15, 6, '#ef4444');
    const ba = MODE === 's' ? cl(1 - (t - (K.zA0 + .9)) / .5) : 1;
    if (ba > 0) { c.save(); c.globalAlpha = ba; c.fillStyle = '#3f3f46'; c.fillRect(x - SW / 2 + 20, y + SH / 2 - 22, SW - 40, 6); c.fillStyle = '#ef4444'; c.fillRect(x - SW / 2 + 20, y + SH / 2 - 22, (SW - 40) * .96, 6); c.restore() }
    poly(c, [x - SW / 2 - 60, y + SH / 2 + 18, x + SW / 2 + 60, y + SH / 2 + 18, x + SW / 2 + 140, y + SH / 2 + 110, x - SW / 2 - 140, y + SH / 2 + 110]); fill(c, '#374151'); poly(c, [x - SW / 2 - 60, y + SH / 2 + 18, x + SW / 2 + 60, y + SH / 2 + 18, x + SW / 2 + 140, y + SH / 2 + 110, x - SW / 2 - 140, y + SH / 2 + 110]); lnS(c, 4, '#f1e6d6');
    c.fillStyle = '#0b0912'; c.beginPath(); c.ellipse(x - 420, y + 210, 230, 300, 0, Math.PI, TAU); c.fill(); c.fillRect(x - 650, y + 210, 460, 600); c.beginPath(); c.ellipse(x - 420, y - 40, 120, 140, 0, 0, TAU); c.fill();
  }
  function endA(c, t) {
    const kd = eio(at(t, K.down0, K.down1)), kz = eio(at(t, K.zA0, K.endT));
    if (kz >= 1) { firstFrame(c); return }
    const sk = t > K.stamp ? 16 * (1 - at(t, K.stamp, K.stamp + .45)) : 0, shx = Math.sin(t * 93) * sk, shy = Math.cos(t * 71) * sk;
    const drawAll = cc => { board(cc, t, boardS(t)); stampYT(cc, t); deskWorld(cc, t) };
    if (t < K.zo1) { zoomOutTo2020(c, t, drawAll); return }
    const Fy = lp(960, LAP.y, kd), z = Math.exp(lp(0, Math.log(HH / LAP.vh), kz));
    const u = at(t, K.zo1, K.zA0), dz = 1 + .07 * Math.sin(Math.PI * u) ** 2, dx = 60 * Math.sin(2 * Math.PI * u) * Math.sin(Math.PI * u);   // v18.5: доска не стоит — медленный дрейф
    c.save(); c.translate(540 + shx, 960 + shy); c.scale(z * dz, z * dz); c.translate(-540 - dx, -Fy); drawAll(c); c.restore();
    vignette(c, .35 * (1 - kz));
  }
  function stampYT(c, t) {
    const k = at(t, K.stamp - .25, K.stamp); if (k <= 0) return;
    const s = lp(2.6, 1, ei(k));
    c.save(); c.translate(540, 1075); c.rotate(-.05); c.scale(s, s);
    rr(c, -330, -48, 660, 96, 14); fill(c, 'rgba(153,27,27,0.92)'); rr(c, -330, -48, 660, 96, 14); stroke(c, '#ef4444', 5);
    tx(c, '▶ ТОЛЬКО НА YOUTUBE', 0, 3, { f: 'U', w: 800, s: 44, c: '#ffffff' }); c.restore();
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
    if (kcap < 1) { c.save(); c.translate(kcap * 520, -kcap * 1300); c.rotate(kcap * 2.4); rr(c, -50, -180, 100, 140, 16); c.fillStyle = g; c.fill(); c.restore() }
    c.restore();
  }
  function endB(c, t) {
    const kz1 = eio(at(t, K.b0 + 1.45, K.b0 + 2.6));   // доска → карточка 1924
    const kZ = eio(at(t, K.nezh - .2, K.ledi + 1.6));    // карточка → фото 3-й главы
    if (kZ >= 1) { const m = 1 + .12 * (1 - at(t, K.ledi + 1.6, K.endT)); c.save(); c.translate(540, 960); c.scale(m, m); c.translate(-540, -960); ep3Frame(c, t); c.restore(); ep3Pill(c, 1); return }   // v18.5: последний кадр — мостик, но не стоит
    const p = PH / 1080, [pcx, pcy] = photoC(C24);
    const zc = 2.6, Fc = [540, C24.y + 5];
    const zE = 1 / p, FE = [pcx - p * 0, pcy + p * 100];
    let z = Math.exp(lp(0, Math.log(zc), kz1)), F = [lp(540, Fc[0], kz1), lp(960, Fc[1], kz1)];
    if (kZ > 0) { z = Math.exp(lp(Math.log(zc), Math.log(zE), kZ)); const u = (1 / z - 1 / zc) / (1 / zE - 1 / zc); F = [lp(Fc[0], FE[0], u), lp(Fc[1], FE[1], u)] }
    else { const u = at(t, K.b0 + 2.6, K.nezh - .2); z *= 1 + .06 * Math.sin(Math.PI * u) ** 2; F = [F[0] + 50 * Math.sin(2 * Math.PI * u) * Math.sin(Math.PI * u), F[1]] }   // v18.5: доска не стоит
    const wipe = at(t, K.vyv - .2, K.vyv + .7);
    const ops = { card: { '1924': { ep3: true, wipe: wipe > 0 ? wipe : undefined, noPin: t > K.vperv - .9, sub: 'МЯГКИЕ, КАК МАЙ · 1924', subA: at(t, K.vyv + .5, K.vyv + .9) } } };
    if (t < K.zo1) { zoomOutTo2020(c, t, cc => board(cc, t, {})); return }
    c.save(); c.translate(540, 960); c.scale(z, z); c.translate(-F[0], -F[1]);
    board(c, t, ops);
    if (kZ > 0) {   // фото раскрывается из квадрата во весь кадр 3-й главы
      const kc = at(kZ, .55, 1), R = [lp(pcx - PH / 2, pcx - 540 * p, kc), lp(pcy - PH / 2, pcy - 860 * p, kc), lp(PH, WW * p, kc), lp(PH, HH * p, kc)];
      c.save(); c.beginPath(); c.rect(...R); c.clip(); c.translate(pcx, pcy); c.scale(p, p); c.translate(-540, -860); ep3Frame(c, t); c.restore();
    }
    // красный росчерк помады по карточке
    const tail = at(kZ, 0, .5);   // росчерк втягивается за помадой, а не растворяется
    if (wipe > 0 && tail < wipe) { c.save(); c.strokeStyle = '#e11d48'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); const n = 40; for (let i = Math.ceil(n * tail); i <= n * wipe; i++) { const u = i / n; c.lineTo(lp(pcx - 120, pcx + 120, u) + Math.sin(u * 9) * 6, lp(pcy - 150, pcy + 110, u)) } c.stroke(); c.restore() }
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
        if (kv < 1) cryptex(c, lp(sx, lx, kv), lp(sy, ly, kv), 360, kv * Math.PI / 2, null);   // криптекс встаёт вертикально — он того же размера, что футляр помады
        else lipstick(c, lx, ly, lp(0, -.7, sw), kcap, kout);
      }
    }
  }
  function ep3Pill(c, a) { c.save(); c.setTransform(1, 0, 0, 1, 0, -220 * (1 - eo(a))); yearPill(c, 1924, 1924, 1, 1, true); c.restore() }
  // ================= время сцен по словам голоса =================
  function keys() {
    const w = Wd, k = {};
    k.morph0 = w('и'); k.shopSign = k.morph0 + 1.15; k.shopBox = k.morph0 + 1.25; k.tr1a = k.morph0 - .15; k.tr1b = k.tr1a + .8;
    k.train0 = w('одного') - .1; k.train1 = k.train0 + 1.2;
    k.law = w('закон'); k.jan = w('январь'); k.chop = w('рубят'); k.mango = w('манго'); k.fru = w('фрукты'); k.des = w('десерты'); k.mint = w('мята'); k.knife = w('нож');
    k.s3 = w('но'); k.scr0 = k.s3 - .37; k.only = w('только'); k.cart = w('картриджами'); k.whole = w('цельные'); k.notm = w('упомянуты'); k.zoom0 = w('цельные') - .71; k.zoom1 = k.zoom0 + 3.5; k.lights = k.zoom1 + .03;
    k.juul2 = w('джул'); k.shen = w('шэньчжэне'); k.conv = w('конвейеры');
    k.s4 = w('puff bar'); k.puff = k.s4; k.hqd = w('hqd'); k.elf = w('elf bar'); k.vsego = w('всего'); k.par = w('парящих'); k.vyr = w('выросла'); k.x11 = w('одиннадцать');
    k.s5 = w('это') - .1; k.liq = w('жидкость'); k.ws = w('ws-23'); k.fool = w('обманывает'); k.ice = w('лёд');
    k.s6 = w('помните'); k.grew = w('разрослись'); k.mesh = w('двойная'); k.puffs = w('тысячи'); k.nicot = w('никотину'); k.n16 = w('шестнадцать');
    k.s7 = w('чтобы'); k.tube = w('пробирке'); k.noleaf = w('без'); k.leaf = w('листа'); k.when = w('когда'); k.bill = w('миллиарды'); k.market = w('рынок'); k.old = w('старые'); k.corp = w('корпорации');
    k.s8 = w('запретом');
    k.b0 = TLX.b0; k.endT = TLX.endT;
    if (MODE === 's') { k.rest = w('остальных'); k.yt = w('youtube'); k.zo1 = k.b0 + 3.5; k.hl0 = w('открыла'); k.th0 = k.zo1 + .2; k.stamp = k.yt - 1; k.down0 = k.yt + .5; k.down1 = k.down0 + 1.6; k.zA0 = k.down1 + .08 }
    else { k.zo1 = k.b0 + 1.35; k.rules = w('правила'); k.vperv = w('впервой'); k.brut = w('брутальности'); k.vek = w('век'); k.vyv = w('выводили'); k.nezh = w('нежные'); k.ledi = w('леди') }
    return k;
  }
  function scene(c, t) {
    if (!KEYS1) w1Init(); if (TINW.B > 98) tinInit();
    if (t < TINW.B) shot1(c, t);   // v18.5: мир 1 и лист закона с указом — одной камерой
    else if (t < TINW.C) shotB(c, t);   // мир B: полка → океан → Шэньчжэнь → волна → ×11
    else if (t < TINW.D) shotC(c, t);   // мир C: WS-23 → рецепторы → картридж = пачка → одноразка → 16 картриджей
    else if (t < K.s8 - .57) shotD(c, t);   // мир D: колба → пробирка → касса → корпорации
    else shot8(c, t);
  }
  function hud(c, t) {   // плашка года
    if (t < K.grew - .3) yearPill(c, 2020, 2020, 1);
    else if (t < K.s7 - .2) yearPill(c, 2020, 2022, at(t, K.grew - .3, K.grew + .1));
    else if (t < K.market - .3) yearPill(c, 2022, 2021, at(t, K.s7 - .2, K.s7 + .2));
    else if (t < K.s8 - .25) yearPill(c, 2021, 2023, at(t, K.market - .3, K.market + .1));
    else if (t < K.s8 + .3) { c.save(); c.setTransform(1, 0, 0, 1, 0, -240 * ei(at(t, K.s8 - .25, K.s8 + .3))); yearPill(c, 2023, 2023, 1, 1, true); c.restore() }
  }
  function firstFrame(c) { shot1(c, 0); hud(c, 0) }   // кадр 0 — без субтитров
  // v18.5: размытие движения: затвор 270° (на перевороте монеты — 360°), кадр = среднее 8–12 моментов (мир 1)
  let MBC = null;
  function sceneMB(c, t) {
    const fl = t > TF0 - .05 && t < TF1 + .05, n = fl ? 12 : 8, sh = fl ? 1 / 30 : 1 / 40; if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { scene(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); scene(g, tj);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (t >= K.b0) { if (MODE === 's') endA(c, t); else { endB(c, t); const kZ = at(t, K.nezh - .2, K.ledi + 1.6); if (kZ > .7 && kZ < 1) ep3Pill(c, at(kZ, .7, 1)) } }
    else { sceneMB(c, t); hud(c, t) }
    subs(c, t);
  }
  // ================= звуки (только мягкие: без ding / tick / pin / swish) =================
  function cues() {
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    if (!WK) w1Init(); const k = WK;   // v18.5: звуки мира 1 (0…21 с)
    Q(.1, 'icecrack', .45); Q(k.ice - .05, 'icecrack', .8); Q(k.ice + .25, 'shimmer', .35); Q(k.i + .05, 'whoosh', .55); Q(k.prod - .38, 'neon', .6);
    for (let i = 0; i < 4; i++) Q(k.prod - .15 + i * .14, 'plop', .38, -.4 + i * .27);
    Q(k.vk - .1, 'bubble', .3); Q(4.4, 'truck', .22, -.5); Q(k.vk - .02, 'whoosh', .6); Q(TF0, 'deep', .5); Q(TF0 + .12, 'flutter', .5); Q(TF1 - .05, 'whoosh', .6); Q(k.y20, 'city', .35); Q(k.y20 + .3, 'flutter', .4, .3);
    Q(k.vse - .05, 'dive', .7); Q(k.vse + .55, 'papers', .4); Q(k.odn, 'typing', .25); Q(k.zab, 'marker', .5); Q(k.zak - .03, 'stamp', 1); Q(k.zak, 'impact', .45);
    Q(k.jan - .2, 'pageflip', .7); Q(k.jan, 'whoosh', .35); Q(k.y20b, 'stamp', .45); Q(k.sk - .55, 'whoosh', .5); Q(k.sk, 'stamp', .6); Q(k.juul, 'plop', .5); Q(k.vl - .2, 'whoosh', .5); Q(k.vl + .45, 'thud', .5); Q(k.usa, 'deep', .4);
    Q(k.rub - .16, 'blade', .8); Q(k.rub, 'thud', .6); k.fl.forEach((tf, i) => { Q(tf - .05, 'plop', .6, -.45 + i * .3); Q(tf, 'bubble', .3, -.45 + i * .3) }); Q(k.vk2 + .2, 'plop', .3, -.6); Q(k.vk2 + .35, 'plop', .3, .6);
    Q(k.pod - .12, 'blade', 1); Q(k.pod + .1, 'impact', .9); Q(k.pod + .12, 'splash', .9); Q(k.pod + .4, 'whoosh', .4);
    // v18.5: звуки миров 2–4 (лист с указом → карта → жидкость → колба)
    w3Words(); w4Words(); const m = W2, n = W3, o = W4;
    Q(m.razv - .05, 'scroll', .9); Q(m.doc, 'papers', .4); Q(m.zap, 'typing', .3); Q(m.only - .1, 'marker', .6); Q(m.veip, 'marker', .4); Q(m.smen, 'plop', .6); Q(m.cart + .2, 'thud', .45);
    Q(m.cel, 'marker', .4); Q(m.upom - .05, 'stamp', .9); Q(m.upom, 'impact', .4); Q(m.poka - .4, 'whoosh', .5); Q(m.poka, 'dive', .7);
    for (let i = 0; i < 7; i++) Q(m.ubir + .15 + i * .12, 'plop', .3, -.5 + i * .17);
    Q(m.shen - .1, 'whoosh', .7); Q(m.zapusk - .2, 'conveyor', .8); Q(m.uzhe, 'city', .3); Q(m.puff, 'thud', .5, -.4); Q(m.hqd, 'thud', .5); Q(m.elf, 'thud', .5, .4);
    Q(m.odn - .3, 'wave', 1); Q(m.voln, 'splash', .9); Q(m.voln + .1, 'impact', .5); Q(m.vsego, 'whoosh', .5); Q(m.vsego + .1, 'bubble', .4); Q(m.vyr - .1, 'pour', .6); Q(m.x11 + .1, 'stamp', .8); Q(43.4, 'dive', .7);
    Q(n.eto, 'bubble', .5); Q(n.zhid - .1, 'whoosh', .5); Q(n.sint, 'icecrack', 1); Q(n.hol, 'shimmer', .5); Q(n.ws, 'plop', .4); Q(n.obm, 'whoosh', .5); Q(n.rec - .2, 'thud', .4); Q(n.led, 'icecrack', .6); Q(n.nik, 'deep', .5);
    Q(n.pomn - .2, 'whoosh', .7); Q(n.zam, 'thud', .5); Q(n.pach, 'plop', .4); Q(n.odn, 'whoosh', .6); Q(n.razr, 'chain', .5); Q(n.t13, 'pour', .5); Q(n.dv - .2, 'thud', .4); Q(n.set, 'chain', .4); Q(n.tys, 'counter', .6);
    Q(n.ponik - .1, 'whoosh', .5); for (let i = 0; i < 8; i++) Q(n.ponik + .4 + i * .14, 'plop', .28, -.5 + i * .14); Q(n.kart16, 'stamp', .6); Q(63.55, 'dive', .7);
    Q(o.nach, 'bubble', .6); Q(o.var, 'pour', .4); Q(o.prob, 'glassbulb', .6); Q(o.bez, 'leaves', .5); Q(o.list - .1, 'marker', .6); Q(o.tab, 'stamp', .7);
    Q(o.kogda - .3, 'whoosh', .5); Q(o.kogda, 'pour', .5); Q(o.prin, 'conveyor', .5); Q(o.mlrd - .05, 'register', 1); Q(o.mlrd + .05, 'counter', .8); Q(o.doll, 'coins', .5); Q(o.god, 'thud', .3);
    Q(o.rynok - .3, 'whoosh', .6); Q(o.star - .2, 'boom', .4); Q(o.tabn - .2, 'thud', .4); Q(o.corp - .2, 'boom', .4); Q(o.corp + .1, 'coins', .35);
    Q(K.s8 - .57, 'whoosh', .7); Q(K.s8 + .4, 'city', .6); Q(K.s8 + .5, 'thud', .4);
    Q(K.b0, 'whoosh', .6);
    if (MODE === 's') { for (let i = 0; i < 3; i++) Q(K.th0 + i * 1.2, 'papers', .3, -.3 + i * .3); Q(K.stamp, 'stamp', 1); Q(K.stamp + .02, 'impact', .5); Q(K.down0, 'whoosh', .6); Q(K.zA0 + .3, 'dive', .7) }
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
      X = cv.getContext('2d'); CORK = null; for (const k in BLUR) delete BLUR[k];
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U'].map(f => document.fonts.load(f, 'АЯaz09$'))).then(() => 0);
    },
  };
})();
