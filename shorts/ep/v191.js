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
  function num(c, s, x, y, o) { s = window.L10N ? window.L10N.tr(String(s)) : s;   // цифры в ровных клетках — не прыгают, пока считают
    c.save(); c.font = FNT(o); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = o.c; c.globalAlpha *= o.a ?? 1;
    const dw = c.measureText('0').width * 1.02, cw = ch => /[0-9]/.test(ch) ? dw : ch === ' ' ? dw * .38 : c.measureText(ch).width + dw * .05;
    let px = x - [...s].reduce((n, ch) => n + cw(ch), 0) / 2; const pos = [];
    for (const ch of s) { const w = cw(ch); if (ch !== ' ') c.fillText(ch, px + w / 2, y); pos.push(px + w / 2); px += w }
    c.restore(); return pos;
  }
  // 22.11: перевод длиннее русского — плашка не вылезает за край кадра (у края держится так же, как русская; русский ролик не меняется)
  function l10nNudge(c, s, to, fs, x, y, w, h, r, k) {
    const L = window.L10N; if (!L || L.lang === 'ru' || c.canvas.width !== WW || c.canvas.height !== HH) return 0;
    L.off = 1; const w0 = tw(c, s, to) + fs * 1.3; L.off = 0; if (w <= w0 + .5) return 0;
    const m = c.getTransform(), sc = Math.hypot(m.a, m.b) || 1, sx = m.a * x + m.c * y + m.e, cr = Math.abs(Math.cos(r)), sr = Math.abs(Math.sin(r));
    const hw = (w / 2 * cr + h / 2 * sr) * sc * k, hw0 = (w0 / 2 * cr + h / 2 * sr) * sc * k, M = 40, R = Math.max(WW - M, sx + hw0), Lf = Math.min(M, sx - hw0);
    let d = 0; if (sx + hw > R) d = R - (sx + hw); else if (sx - hw < Lf) d = Lf - (sx - hw);
    return d / sc;
  }
  function plate(c, s, x, y, k, o = {}) {   // плашка по тексту
    if (k <= 0) return;
    const fs = o.s || 34, to = { s: fs, ls: o.ls ?? 2, w: o.w || 800, f: o.f || 'M' }, w = tw(c, s, to) + fs * 1.3, h = fs * 1.9;
    c.save(); c.translate(x + l10nNudge(c, s, to, fs, x, y, w, h, o.r || 0, k), y); if (o.r) c.rotate(o.r); c.scale(k, k); c.globalAlpha *= o.a ?? 1;
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
  function buildChunks(subs) {   // 21.11: subs — субтитры перевода из таймлайна (EN/DE, tools/l10n_subs.py), иначе — русские слова голоса
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
    const sy = ch.a > K.b0 - .1 && ch.a < K.zo1 - .4 ? 330 : SUBY;   // v19.0: на отъезде в карточку 2020 субтитр сверху — не на подписи карточки
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
  // ================= блок 1 (0–7,5 с): глыба льда → лёд разлетается → мундштук становится крышей (Starbucks #011) → ночной город → неоновая снежинка → эмблема на 180° в купол Капитолия (#019) =================
  const VB = { x0: 425, x1: 655, y0: 520, y1: 1240 }, VM = { x0: 470, x1: 610, y0: 430, y1: 520 }, ICE = { x: 280, y: 380, w: 520, h: 920 }, GR1 = 1300;
  const SIGN = { x: 540, y: 432, r: 95 }, EM = { x: 540, y: 960, r: 360 };   // неоновая вывеска (мир) и эмблема (экран)
  let T1 = null, K1 = null, SH1 = null, CR1 = null, CF1 = null;
  function b1Init() {
    T1 = { cr: .5, sh: 1.8, up: 1.86, hang: 2.27, back: 2.64, land: 3.0, sq: 3.4, grow: 3.95, sign: Wd('продают') - .05, neon: Wd('вейпы') - .15, dive: 5.25,
      sw0: 6.05, peak: 6.42, rot0: 6.3, rot1: 7.05, sw1: 7.45, end: 7.5 };
    K1 = [KY(0, 540, 900, 1), KY(1.7, 540, 880, 1.06), KY(2.25, 540, 790, 1.02), KY(3.05, 540, 880, 1), KY(3.6, 545, 900, .94), KY(4.5, 565, 860, .82),
      KY(5.15, 548, 700, 1.0), KY(5.6, 541, 470, 2.3), KY(6.15, 540, 436, 3.7), KY(7.5, 540, 432, 3.84)];
    // осколки: сетка 4×6 с неровными узлами
    const nx = 4, ny = 6, P = [];
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) { const e = i === 0 || i === nx, f = j === 0 || j === ny; P.push([ICE.x + ICE.w * i / nx + (e ? 0 : (H1(i * 7 + j) - .5) * 70), ICE.y + ICE.h * j / ny + (f ? 0 : (H1(i + j * 9) - .5) * 80)]) }
    SH1 = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const p = [P[j * (nx + 1) + i], P[j * (nx + 1) + i + 1], P[(j + 1) * (nx + 1) + i + 1], P[(j + 1) * (nx + 1) + i]], cx = p.reduce((s, q) => s + q[0], 0) / 4, cy = p.reduce((s, q) => s + q[1], 0) / 4;
      const dx = cx - 540, dy = cy - 860, d = Math.hypot(dx, dy) || 1, sp = 900 + H1(i * 3 + j) * 700;
      SH1.push({ cx, cy, pts: p.flatMap(q => [q[0] - cx, q[1] - cy]), vx: dx / d * sp, vy: dy / d * sp - 500 - H1(j + i * 5) * 400, w: (H1(i + j * 2) - .5) * 9 });
    }
    // трещины: 7 веток от точки удара
    CR1 = []; for (let b = 0; b < 7; b++) { let x = 660, y = 610, a = b * TAU / 7 + .3; const seg = [[x, y]]; for (let s = 0; s < 6; s++) { a += (H1(b * 11 + s) - .5) * .9; x += Math.cos(a) * (60 + H1(b + s * 3) * 50); y += Math.sin(a) * (60 + H1(b * 5 + s) * 50); seg.push([cl(x, ICE.x + 8, ICE.x + ICE.w - 8), cl(y, ICE.y + 8, ICE.y + ICE.h - 8)]) } CR1.push(seg) }
    CF1 = []; for (let i = 0; i < 22; i++) { const a = -Math.PI / 2 + (H1(i * 4.1) - .5) * 2.6, v = 600 + H1(i * 2.3) * 700; CF1.push({ vx: Math.cos(a) * v, vy: Math.sin(a) * v, col: [B2.ice, B2.mango, B2.teal, B2.ln, B2.coral][i % 5], s: 10 + H1(i) * 12, w: (H1(i * 9) - .5) * 14 }) }
  }
  // корпус одноразки (x0..x1, y0..y1): манго с косой голубой заливкой (как фиолетовая заливка стакана у Боба), полоса МАНГО-ЛЁД
  function vapeBody(c, x0, x1, y0, y1, k = 0) {   // k — сплющивание в коробку (надпись уходит)
    const w = x1 - x0, h = y1 - y0, r = lp(46, 10, k);
    rr(c, x0, y0, w, h, r); c.save(); c.fillStyle = B2.mango; c.fill(); c.clip();
    poly(c, [x0 - 10, y0 + h * .48, x1 + 10, y0 + h * .26, x1 + 10, y1 + 10, x0 - 10, y1 + 10]); fill(c, B2.ice2);
    c.fillStyle = 'rgba(20,23,51,.28)'; c.fillRect(x0 + w * .75, y0 - 4, w * .25 + 8, h + 8);
    rr(c, x0 + w * .08, y0 + h * .08, Math.max(6, w * .1), h * .8, 20); fill(c, 'rgba(255,255,255,.35)');
    if (k < .6) A(c, 1 - k / .6, () => { c.fillStyle = B2.navy; c.fillRect(x0, y0 + h * .4, w, h * .14); tx(c, 'МАНГО-ЛЁД', (x0 + x1) / 2, y0 + h * .47, { f: 'U', w: 800, s: 34, c: B2.cream, mw: w - 24 }) });
    c.restore(); rr(c, x0, y0, w, h, r); lnB(c, 4);
  }
  function mouth(c, b) {   // мундштук-трапеция → плоская крыша (b — рамка)
    const w = b.x1 - b.x0, nar = Math.max(0, (b.nar ?? .18)) * w;
    poly(c, [b.x0, b.y1, b.x1, b.y1, b.x1 - nar, b.y0, b.x0 + nar, b.y0]); cel(c, b.x0, b.y0, w, b.y1 - b.y0, '#2a2f55', { hw: .08 });
    poly(c, [b.x0, b.y1, b.x1, b.y1, b.x1 - nar, b.y0, b.x0 + nar, b.y0]); lnB(c, 4);
    if (b.snow > 0) { c.beginPath(); c.moveTo(b.x0 - 6, b.y0 + 4); for (let i = 0; i <= 14; i++) { const x = lp(b.x0 - 6, b.x1 + 6, i / 14); c.lineTo(x, b.y0 - 6 - b.snow * (16 + 12 * Math.sin(i * 1.9))) } c.lineTo(b.x1 + 6, b.y0 + 4); c.closePath(); fill(c, B2.cream); lnB(c, 3) }
  }
  function iceBlock(c, t) {
    const { x, y, w, h } = ICE; rr(c, x, y, w, h, 18); c.save(); c.fillStyle = 'rgba(189,231,246,.42)'; c.fill(); c.clip();
    c.fillStyle = 'rgba(124,196,224,.42)'; c.fillRect(x + w * .75, y, w * .25, h);
    rr(c, x + w * .06, y + 40, 46, h - 80, 23); fill(c, 'rgba(255,255,255,.28)');
    glint(c, x, y, w, h, .14);
    for (let i = 0; i < 26; i++) ring(c, x + 40 + H1(i * 3.3) * (w - 80), y + 60 + H1(i * 7.7) * (h - 120) - (t * 14 * (1 + H1(i))) % 80, 3 + H1(i) * 6, 'rgba(255,255,255,.55)', 2);
    c.beginPath(); c.moveTo(x, y + 140); c.lineTo(x + 140, y); c.moveTo(x + w, y + h - 160); c.lineTo(x + w - 160, y + h); lnB(c, 3, 'rgba(255,255,255,.6)');
    const kc = at(t, T1.cr, T1.sh - .05);   // трещины растут
    if (kc > 0) CR1.forEach((seg, b) => { const n = (seg.length - 1) * eo(cl(kc * 1.25 - b * .05)); if (n <= 0) return; c.beginPath(); c.moveTo(seg[0][0], seg[0][1]); for (let s = 1; s <= Math.ceil(n); s++) { const u = Math.min(1, n - s + 1); c.lineTo(lp(seg[s - 1][0], seg[s][0], u), lp(seg[s - 1][1], seg[s][1], u)) } lnB(c, 4, '#ffffff') });
    c.restore(); rr(c, x, y, w, h, 18); lnB(c, 5, '#e8f7fd');
    c.beginPath(); for (let i = 0; i < 9; i++) { const xx = x + 20 + i * (w - 40) / 8; c.moveTo(xx, y); c.lineTo(xx + 6, y + 18 + H1(i) * 26) } lnB(c, 3, '#ffffff');   // сосульки инея сверху
  }
  // ночной город: 3 слоя (дальние силуэты, средние дома, передние фонари) — поднимаются снизу
  function city1(c, q, t) {
    const k0 = eo(at(t, T1.sq + .1, T1.grow + .45)), k1 = eo(at(t, T1.sq + .25, T1.grow + .6)), k2 = eo(at(t, T1.sq, T1.grow + .2));
    if (k0 > 0) layer(c, q, .45, cc => { cc.translate(540 * .45 - 540, 960 * .45 - 960); cc.translate(0, 700 * (1 - k0));
      let x = -700, i = 0; while (x < 1800) { const w = 90 + H1(i * 3.1) * 120, h = 380 + H1(i * 5.3) * 520; cc.fillStyle = B2.bg2; cc.fillRect(x, 1300 - h, w + 2, h + 400); if (H1(i * 2.7) > .55) cc.fillRect(x + w * .42, 1300 - h - 70, 8, 72); x += w; i++ } });
    if (k1 > 0) layer(c, q, .72, cc => { cc.translate(540 * .72 - 540, 960 * .72 - 960); cc.translate(0, 700 * (1 - k1));
      let x = -500, i = 0; while (x < 1600) { const w = 120 + H1(i * 4.7) * 110, h = 250 + H1(i * 6.1) * 330; if (x > 150 && x < 820) { x += w; i++; continue }
        rr(cc, x, 1300 - h, w, h + 300, 4); cel(cc, x, 1300 - h, w, h, B2.bg3, { hi: false, sw: .3 });
        for (let r = 0; r < Math.floor(h / 60); r++) for (let s = 0; s < Math.floor((w - 24) / 34); s++) if (H1(i * 13 + r * 5 + s) < .3) { cc.fillStyle = H1(i + r + s * 7) > .4 ? '#f4a261' : '#fde68a'; cc.fillRect(x + 16 + s * 34, 1300 - h + 30 + r * 60, 16, 22) }
        x += w + 10; i++ } });
    // дорога и машины (основной план)
    if (k2 > 0) { c.save(); c.translate(0, 300 * (1 - k2)); c.fillStyle = '#191c33'; c.fillRect(-900, GR1, 2900, 900); c.fillStyle = '#2a2e4f'; c.fillRect(-900, GR1, 2900, 26);
      c.beginPath(); c.moveTo(-900, GR1); c.lineTo(2000, GR1); lnB(c, 4);
      for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(238,241,248,.5)'; c.fillRect(-900 + i * 220 - (t * 60) % 220, 1420, 110, 8) }
      [[0, 1, B2.red], [.45, -1, B2.teal], [.8, 1, B2.ind]].forEach(([ph, dir, col], i) => { const u = ((t - T1.grow) * .16 + ph) % 1, x = dir > 0 ? lp(-500, 1600, u) : lp(1600, -500, u), y = dir > 0 ? 1460 : 1380; car1(c, x, y, dir, col) });
      c.restore() }
  }
  function car1(c, x, y, dir, col) {
    c.save(); c.translate(x, y); c.scale(dir, 1);
    beam(c, 120, -14, 420, 0, 8, 60, '#fde68a', .22);
    rr(c, -120, -50, 240, 52, 16); cel(c, -120, -50, 240, 52, col, { hw: .06 }); rr(c, -70, -88, 130, 44, 14); cel(c, -70, -88, 130, 44, shd(col, .1), { hi: false });
    c.fillStyle = '#9fd7ef'; c.fillRect(-56, -80, 50, 28); c.fillRect(4, -80, 46, 28);
    circ(c, -70, 4, 22, B2.ink); circ(c, 70, 4, 22, B2.ink); circ(c, -70, 4, 9, B2.steel); circ(c, 70, 4, 9, B2.steel); circ(c, 116, -30, 8, '#fde68a');
    c.restore();
  }
  function drifts(c, t) {   // сугробы выпрыгивают пружиной, как кусты у Боба
    [[200, 1, 0], [880, -1, .12]].forEach(([x, s, d]) => { const k = spr(at(t, T1.grow - .1 + d, T1.grow + .65 + d)); if (k <= 0) return;
      c.save(); c.translate(x, GR1); c.scale(k * s, k); [[-70, -20, 46], [-20, -38, 58], [42, -24, 44], [90, -12, 30]].forEach(([dx, dy, r]) => { c.beginPath(); c.arc(dx, dy, r, Math.PI, 0); c.closePath(); cel(c, dx - r, dy - r, r * 2, r, B2.cream, { sw: .3, hi: false }) });
      c.beginPath(); c.moveTo(-130, 0); c.lineTo(130, 0); lnB(c, 4); c.restore() });
  }
  function store1(c, t, b, kg) {   // магазин растёт из коробки b; kg — 0…1
    const w = b.x1 - b.x0, h = b.y1 - b.y0;
    rr(c, b.x0, b.y0, w, h, 6); cel(c, b.x0, b.y0, w, h, '#33386a', { hw: .05, gr: .08 }); rr(c, b.x0, b.y0, w, h, 6); lnB(c, 4);
    if (kg <= 0) return; c.save(); c.beginPath(); c.rect(b.x0, b.y0, w, h); c.clip();
    const top = b.y0, ws = [[b.x0 + 40, 250], [b.x0 + 330, 250]];
    ws.forEach(([wx, ww], i) => { const wy = GR1 - 330; rr(c, wx, wy, ww, 230, 6); fill(c, '#1b1f3d');
      for (let s = 0; s < 4; s++) for (let r = 0; r < 2; r++) { rr(c, wx + 22 + s * 56, wy + 50 + r * 86, 30, 62, 9); fill(c, [B2.mango, B2.ice2, B2.teal, B2.coral][(s + r + i) % 4]) }
      c.save(); rr(c, wx, wy, ww, 230, 6); c.clip(); glint(c, wx, wy, ww, 230, .16); c.restore(); rr(c, wx, wy, ww, 230, 6); lnB(c, 4);
      for (let s = 0; s < 5; s++) { c.beginPath(); c.moveTo(wx - 6 + s * (ww + 12) / 5, wy - 50); c.lineTo(wx - 6 + (s + 1) * (ww + 12) / 5, wy - 50); c.arc(wx - 6 + (s + .5) * (ww + 12) / 5, wy - 50, (ww + 12) / 10, 0, Math.PI); c.closePath(); fill(c, s % 2 ? B2.cream : B2.red); lnB(c, 3) } });
    rr(c, b.x0 + 590 - 4, GR1 - 300, 4, 300, 2); fill(c, B2.ln);
    c.restore();
    const ks = spr(at(t, T1.sign - .1, T1.sign + .55)); if (ks > 0) { c.save(); c.translate(540, top + 70); c.scale(ks, ks); rr(c, -230, -46, 460, 92, 10); fill(c, B2.ink); rr(c, -230, -46, 460, 92, 10); lnB(c, 4);
      tx(c, 'ВЕЙПЫ 24/7', 0, 3, { f: 'U', w: 800, s: 54, c: B2.teal, ls: 2 }); c.restore() }
  }
  const neonOn = t => at(t, T1.neon, T1.neon + .08) * (t < T1.neon + .35 ? (Math.sin(t * 90) > -.2 ? 1 : .35) : 1);
  function neonSign(c, t, x, y, r, roof) {   // круглая неоновая вывеска на крыше (рисунок — тот же, что у эмблемы при k = 0)
    c.fillStyle = '#2a2f55'; c.fillRect(x - 6, y + r - 4, 12, roof - y - r + 8); c.fillRect(x - 50, roof - 10, 100, 10);
    emblem(c, t, 0, x, y, r);
  }
  function b1World(c, q, t) {
    c.fillStyle = B2.bg; c.fillRect(-2000, -2000, 5000, 5000);
    const kStore = at(t, T1.land, T1.land + .05);
    if (kStore <= 0) { [[150, 300], [800, 420], [120, 1080], [860, 960], [770, 1160], [210, 640]].forEach(([x, y]) => bricks(c, x, y, 1)); c.beginPath(); c.moveTo(250, GR1 + 4); c.lineTo(830, GR1 + 4); lnB(c, 4) }
    city1(c, q, t);
    const hop = t < T1.sh ? 0 : t < T1.sh + .22 ? -70 * Math.sin(Math.PI * at(t, T1.sh, T1.sh + .22)) : 60 * eo(at(t, T1.sh + .22, T1.sh + .42)) - (t > T1.sh + .42 && t < T1.sh + .6 ? 14 * Math.sin(Math.PI * at(t, T1.sh + .42, T1.sh + .6)) : 0);
    const ksq = bo(at(t, T1.land, T1.sq)), kg = eo(at(t, T1.sq, T1.grow));
    // корпус → коробка → магазин
    const bx0 = lp(VB.x0, 230, ksq), bx1 = lp(VB.x1, 850, ksq), by0 = lp(lp(VB.y0 + 60, 1010, ksq), 640, kg);
    const yb = t < T1.sh ? 0 : hop;
    // мундштук: подлетает, висит, падает назад, сплющивается в крышу
    let mo = 0, mr = 0; if (t >= T1.up && t < T1.land) { const u = at(t, T1.up, T1.hang), d = at(t, T1.back, T1.land); mo = -330 * eo(u) + 330 * ei(d) + (t > T1.hang && t < T1.back ? 10 * Math.sin((t - T1.hang) * 14) : 0); mr = .32 * Math.sin(Math.PI * cl(u * .9 + d * .1)) * (1 - d) }
    if (t < T1.land) {
      if (t >= T1.up) { const kq = bo(at(t, T1.up + .1, T1.hang + .05)) * (1 - ei(at(t, T1.back, T1.back + .25))); if (kq > 0) { c.save(); c.translate(540, VB.y0 + 60 + yb - 40 - 200 * kq); c.scale(kq, kq); tx(c, '?', 0, 0, { f: 'M', w: 800, s: 300, c: B2.bg, sw: 9, sc: B2.ln }); c.restore() } }
      vapeBody(c, VB.x0, VB.x1, VB.y0 + yb, VB.y1 + yb, 0);
      c.save(); c.translate(540, VM.y1 + yb + mo); c.rotate(mr); mouth(c, { x0: VM.x0 - 540, x1: VM.x1 - 540, y0: VM.y0 - VM.y1, y1: 0 }); c.restore();
    } else {
      if (kg <= 0) vapeBody(c, bx0, bx1, by0, GR1, ksq); else store1(c, t, { x0: bx0, x1: bx1, y0: by0, y1: GR1 }, kg);
      const rb = { x0: lp(VM.x0, 190, ksq), x1: lp(VM.x1, 890, ksq), y0: by0 - lp(VM.y1 - VM.y0, 44, ksq), y1: by0, nar: lp(.18, .02, ksq), snow: ksq };
      mouth(c, rb);
      const kn = spr(at(t, T1.grow - .05, T1.grow + .5)); if (kn > 0) { c.save(); c.translate(SIGN.x, rb.y0); c.scale(kn, kn); c.translate(-SIGN.x, -rb.y0); neonSign(c, t, SIGN.x, SIGN.y, SIGN.r, rb.y0); c.restore() }
    }
    drifts(c, t);
    if (t < T1.sh + .9) iceOrShards(c, t);
    // конфетти из горлышка (тормозят в воздухе)
    if (t > T1.up + .05 && t < T1.land + .6) CF1.forEach((p, i) => { const u = t - T1.up - .05, d = 4, f = (1 - Math.exp(-d * u)) / d, x = 540 + p.vx * f, y = VB.y0 + p.vy * f + 90 * u * u, a = 1 - at(t, T1.land, T1.land + .6);
      c.save(); c.translate(x, y); c.rotate(p.w * u); c.globalAlpha *= a; c.fillStyle = p.col; c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore() });
  }
  function iceOrShards(c, t) {
    if (t < T1.sh) { iceBlock(c, t); return }
    const u = t - T1.sh; SH1.forEach(s => { const x = s.cx + s.vx * u, y = s.cy + s.vy * u + 1500 * u * u; if (y > 2600) return;
      c.save(); c.translate(x, y); c.rotate(s.w * u); c.scale(1 - .3 * cl(u), 1 - .3 * cl(u)); shard(c, s.pts, 'rgba(189,231,246,.75)', '#ffffff'); c.restore() });
    if (u < .12) { c.save(); c.globalAlpha = 1 - u / .12; flake(c, 660, 610, 160 * (1 + u * 6), '#ffffff', 5); c.restore() }
  }
  // вихрь колец (#019): три толстых дуги вокруг эмблемы; на пике закрывают весь экран
  function swirl(c, t) {   // вихрь колец (#019): три толстых кольца вокруг эмблемы; на пике закрывают весь экран, потом улетают наружу
    const kin = eio(at(t, T1.sw0, T1.peak)), kout = eio(at(t, T1.peak + .55, T1.sw1)); if (kin <= 0 || kout >= 1) return;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    [[B2.teal, 0, 1], [B2.red, 2.1, -1], [B2.navy, 4.2, 1]].forEach(([col, ph, dir], i) => {
      const ri = EM.r + 6 + i * 365 + 1300 * kout, ro = ri + 372, span = TAU * Math.min(1, kin * 1.15 + .02), a0 = ph + dir * t * 3.2;
      c.beginPath(); if (span >= TAU) { c.arc(EM.x, EM.y, ro, 0, TAU); c.arc(EM.x, EM.y, ri, TAU, 0, true) } else { c.arc(EM.x, EM.y, ro, a0, a0 + span); c.arc(EM.x, EM.y, ri, a0 + span, a0, true) } c.closePath(); fill(c, col);
    });
    c.restore();
  }
  function emblem(c, t, k, x, y, R) {   // k: 0 — неоновая снежинка, 1 — купол со звездой; поворот в плоскости на 180° (#019)
    const on = neonOn(t), kf = 1 - ss(.3, .55, k), kd = ss(.45, .7, k), col = mixc(mixc('#3b5b7a', '#bfefff', on), B2.red, ss(.35, .65, k));
    c.save(); c.translate(x, y); c.rotate(Math.PI * k); c.scale(R / 95, R / 95);
    circ(c, 0, 0, 95, B2.ink); if (on > 0 && k < .5) glow(c, 0, 0, 190, '#7dd3fc', .35 * on * (1 - 2 * k));
    ring(c, 0, 0, 87, col, 7); if (k > 0) ring(c, 0, 0, 78, col, 2.5 * ss(.4, .7, k));
    if (kf > 0) flake(c, 0, 0, 95 * .62 * kf, mixc('#3b5b7a', '#e0f7ff', on), 6 * kf + .5);
    if (kd > 0) { c.save(); c.rotate(Math.PI); c.scale(kd, kd); domePath(c, 0, 34, .16); lnB(c, 3.2, B2.red); star(c, 0, -36, 9, B2.gold); c.restore() }
    ring(c, 0, 0, 95, B2.ln, 3); c.restore();
  }
  function b1Shot(c, t) {
    if (!T1) b1Init(); const q = camObj(camAt(K1, t));
    if (t > T1.sh && t < T1.sh + .5) { const s = 18 * (1 - at(t, T1.sh, T1.sh + .5)); q.x += Math.sin(t * 97) * s; q.y += Math.cos(t * 83) * s }
    if (t < T1.peak + .05) { c.save(); c.translate(540, 960); c.rotate(q.r); c.scale(q.z, q.z); c.translate(-q.x, -q.y); b1World(c, q, t); c.restore(); snow3(c, q, t, 1 - at(t, T1.dive, T1.dive + .6)) }
    else bgSplit(c, B2.bg, B2.bg2, 540, 960, -1.05);
    if (t > T1.sw0 - .02) { const ex = 540 + (SIGN.x - q.x) * q.z, ey = 960 + (SIGN.y - q.y) * q.z, er = SIGN.r * q.z; EM.x = ex; EM.y = ey; EM.r = er; swirl(c, t); emblem(c, t, eio(at(t, T1.rot0, T1.rot1)), ex, ey, er) }
  }
  // ================= v18.5 (16.11): «один мир + камера» — камера без старт-стопа и слои с параллаксом =================
  // Камера по ключам [t, x, y, ln z, r]: монотонная кривая (Фрич–Карлсон). Старт и финиш — с места, внутри — без остановок.
  function camAt(KEYS, t) {
    const n = KEYS.length, D = KEYS[0].length;
    if (!KEYS._chk) { KEYS._chk = 1; for (let j = 0; j + 1 < n; j++) if (!(KEYS[j + 1][0] > KEYS[j][0])) console.error(`camAt: ключи камеры не по порядку №${j}: ${KEYS[j][0].toFixed(3)} → ${KEYS[j + 1][0].toFixed(3)}`) }   // 21.11: озвучка перевода сжимает время между словами
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
  // ================= блок 2 (7,5–20,9 с): эмблема раскрывается в Капитолий → влёт в окно → кабинет, лист закона с пустой клеткой «ОДНОРАЗОВЫЕ ?» →
  // календарь «январь 2020» → газета СКАНДАЛ, стик «Джула» взлетает и становится косым лезвием на цепях (Соболев #127) → рубит вкусы, ТАБАК и МЕНТОЛ остаются =================
  // Мир C — Капитолий (координаты экрана в 7,5 с), мир O — кабинет за окном: точка O (x, y) = C (OX + x·OS, OY + y·OS).
  const WIN2 = { x: 504, y: 1226, w: 72, h: 128 }, OS2 = 72 / 1080, OX2 = 504, OY2 = 1226;
  const CRT2 = [['ТАБАК', '#9a6a44'], ['МАНГО', '#f6a03a'], ['ФРУКТЫ', '#e2504f'], ['ДЕСЕРТЫ', '#f19ac2'], ['МЯТА', '#5ed39b'], ['МЕНТОЛ', '#9fdcf2']];
  const CX2 = [190, 330, 470, 610, 750, 890], STK2 = { y: 1400, top: 1140, cut: 1290 }, BLD2 = { x0: 262, x1: 818, top: 620, bl: 870, br: 795 };   // v19.1: гильотина собирается на месте листа — без рывка камеры вверх
  const POST2 = { l: 70, r: 1010, top: 300, w: 44 };
  let T2 = null, K2 = null, TIN2 = 99, DR2 = null;
  const KO2 = (t, x, y, z) => KY(t, OX2 + x * OS2, OY2 + y * OS2, z / OS2);
  function b2Init() {
    const w = Wd; T2 = { a: T1.end, rev: T1.end + .38, fly: 7.95, open: 8.55, one: w('одного'), word: w('слова'), zab: w('забыли'), zak: w('закон'), jan: w('январь'), y20: w('2020', 1),
      posle: w('после'), sk: w('скандала'), juul: w('джулом'), lift: 15.2, vl: w('власти'), usa: w('сша'), rub: w('рубят'), vk: w('вкусами'),
      fl: [w('манго'), w('фрукты'), w('десерты'), w('мята')], pod: w('под'), end: 20.95 };
    T2.chop = T2.pod; T2.drop = T2.chop - .17;
    K2 = [KY(T2.a, 540, 960, 1), KY(T2.fly, 540, 1010, 1.04), KY(8.55, 540, 1210, 4.2), KO2(9.0, 540, 960, 1.0), KO2(9.6, 560, 1020, 1.5), KO2(10.9, 556, 1005, 1.62),
      KO2(T2.zak - .15, 540, 960, 1.06), KO2(T2.zak + .25, 540, 960, 1.06), KO2(12.7, 520, 1040, 1.0), KO2(14.6, 548, 1080, 1.0), KO2(15.15, 552, 1090, 1.0),
      KO2(16.0, 540, 1000, .96), KO2(T2.chop, 540, 1010, 1.0), KO2(T2.chop + .22, 540, 1010, 1.0), KO2(T2.end, 540, 1030, 1.0)]; if (typeof b3Keys === 'function') { K2.pop(); K2.push(...b3Keys()) }
    TIN2 = 99; for (let f = Math.floor(8 * 30); f < 10 * 30; f++) { const v = viewRect(camObj(camAt(K2, f / 30))); if (v.x0 > WIN2.x && v.x1 < WIN2.x + WIN2.w && v.y0 > WIN2.y && v.y1 < WIN2.y + WIN2.h) { TIN2 = f / 30; break } }
    THIN3 = 99; if (T3) { const HC = { x: OX2 + HOLE3.x * OS2, y: OY2 + HOLE3.y * OS2, w: HOLE3.w * OS2, h: HOLE3.h * OS2 };   // v19.1: с какого кадра камера целиком в дыре — дальше рисуем мир H напрямую
      for (let f = Math.floor((T3.poka - .6) * 30); f < (T3.poka + 1.5) * 30; f++) { const v = viewRect(camObj(camAt(K2, f / 30))); if (v.x0 > HC.x && v.x1 < HC.x + HC.w && v.y0 > HC.y && v.y1 < HC.y + HC.h) { THIN3 = f / 30; break } } }
    DR2 = []; for (let i = 0; i < 44; i++) DR2.push({ ci: 1 + (i % 4), vx: (H1(i * 3.1) - .5) * 700, vy: -120 - H1(i * 7.3) * 380, r: 9 + H1(i) * 12 });
  }
  const camO2 = cm => ({ x: (cm.x - OX2) / OS2, y: (cm.y - OY2) / OS2, z: cm.z * OS2, r: cm.r });
  // ---------- Капитолий ночью ----------
  function domeFillPath(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(-212, 0); c.lineTo(-212, -70); c.lineTo(-172, -70); c.lineTo(-172, -110); c.lineTo(-160, -110);
    c.bezierCurveTo(-160, -250, -60, -300, 0, -305); c.bezierCurveTo(60, -300, 160, -250, 160, -110); c.lineTo(172, -110); c.lineTo(172, -70); c.lineTo(212, -70); c.lineTo(212, 0); c.closePath();
    c.rect(-28, -360, 56, 56); c.restore();
  }
  function capitol(c, t) {
    const kd = eo(at(t, T2.a + .05, T2.a + .45)), kw = eo(at(t, T2.a + .1, T2.a + .55)), ds = .6147, dy = 1090.6;
    c.fillStyle = B2.ink; c.fillRect(-1500, -1500, 4000, 4500);
    for (let i = 0; i < 40; i++) circ(c, -200 + H1(i * 4.4) * 1500, 120 + H1(i * 6.6) * 760, 2 + H1(i) * 2.5, rgba('#e2e8f0', .35 + .25 * Math.sin(t * 1.7 + i)));
    beam(c, 250, 1520, 470, 860, 30, 120, '#bfe9ff', .1 * kw); beam(c, 830, 1520, 610, 860, 30, 120, '#bfe9ff', .1 * kw);
    // крылья и главный корпус выезжают из-за краёв
    c.save(); c.translate(-700 * (1 - kw), 0); rr(c, -420, 1180, 640, 330, 4); cel(c, -420, 1180, 640, 330, '#d9d2c1', { hw: .04 }); rr(c, -420, 1180, 640, 330, 4); lnB(c, 3);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const lt = H1(i * 3 + r * 7) > .62; rr(c, -390 + i * 66, 1210 + r * 96, 34, 60, 14); fill(c, lt ? '#fbd38d' : '#3d4470') } c.restore();
    c.save(); c.translate(700 * (1 - kw), 0); rr(c, 860, 1180, 640, 330, 4); cel(c, 860, 1180, 640, 330, '#d9d2c1', { hw: .04 }); rr(c, 860, 1180, 640, 330, 4); lnB(c, 3);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const lt = H1(i * 5 + r * 3) > .62; rr(c, 890 + i * 66, 1210 + r * 96, 34, 60, 14); fill(c, lt ? '#fbd38d' : '#3d4470') } c.restore();
    c.save(); c.translate(0, 600 * (1 - kw)); rr(c, 200, dy, 680, 420, 4); cel(c, 200, dy, 680, 420, '#e6e0d1', { hw: .05, gr: .06 }); rr(c, 200, dy, 680, 420, 4); lnB(c, 3);
    poly(c, [370, 1150, 710, 1150, 540, 1100]); fill(c, '#cfc7b4'); poly(c, [370, 1150, 710, 1150, 540, 1100]); lnB(c, 3);
    win2(c, t);
    [400, 446, 634, 680].forEach(x => { rr(c, x - 14, 1158, 28, 330, 6); cel(c, x - 14, 1158, 28, 330, '#f5f1e8', { hw: .2, sw: .35 }); rr(c, x - 14, 1158, 28, 330, 6); lnB(c, 2.5) });
    for (let i = 0; i < 5; i++) { c.fillStyle = i % 2 ? '#bdb5a2' : '#d6cfbd'; c.fillRect(150 - i * 30, 1510 + i * 26, 780 + i * 60, 26) }
    c.restore();
    c.fillStyle = '#152018'; c.fillRect(-1500, 1640, 4000, 2000);
    // купол: сначала красный контур из эмблемы, заливка встаёт снизу шторкой
    c.save(); domeFillPath(c, 540, dy, ds); c.clip(); c.fillStyle = '#efe9db'; c.fillRect(300, dy - (370 * ds + 20) * kd, 480, 400); c.fillStyle = 'rgba(20,23,51,.24)'; c.fillRect(540 + 70, dy - 400, 200, 420);
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(540 - 112, dy - 260, 18, 200); c.restore();
    domePath(c, 540, dy, ds); lnB(c, lp(12.3, 3, kd), mixc(B2.red, '#4b4f73', kd)); star(c, 540, 821.7, 34.6, B2.gold);
  }
  function win2(c, t) {   // окно под куполом: тёплый свет, внутри — кабинет; створки распахиваются перед влётом
    const { x, y, w, h } = WIN2, ko = eio(at(t, T2.fly + .2, T2.open));
    c.save(); rr(c, x, y, w, h, 2); c.clip(); c.translate(OX2, OY2); c.scale(OS2, OS2); office(c, t); c.restore();
    [[x, 1], [x + w, -1]].forEach(([hx, s]) => { const sc = Math.cos(ko * 1.35); c.save(); c.translate(hx, 0); c.scale(s * sc, 1); rr(c, 0, y, w / 2, h, 1); fill(c, 'rgba(251,211,141,.25)'); c.beginPath(); c.rect(0, y, w / 2, h); c.moveTo(0, y + h / 2); c.lineTo(w / 2, y + h / 2); c.moveTo(w / 4, y); c.lineTo(w / 4, y + h); lnB(c, 2, '#5b4a3a'); c.restore() });
    rr(c, x - 4, y - 4, w + 8, h + 8, 3); lnB(c, 3, '#8c7d64');
  }
  // ---------- кабинет (мир O) ----------
  function sheet2(c, t) {
    const kS = eio(at(t, T2.lift, T2.lift + .8)); if (kS >= 1) return; c.save(); c.beginPath(); c.rect(-2000, -3000, 6000, 4640); c.clip(); c.translate(0, 1800 * kS);
    const x0 = 210, y0 = 450, w = 660, h = 1190;   // v19.3: лист стоит на столе (низ — 1640), календарь и газета перед ним не висят в воздухе
    castDots(c, x0, y0, w, h, 140, { st: 16 });
    rr(c, x0, y0, w, h, 8); cel(c, x0, y0, w, h, B2.cream, { hw: .03, sw: .12, gr: .12 }); rr(c, x0, y0, w, h, 8); lnB(c, 4, '#c9c1ae');
    tx(c, 'ЗАПРЕТ ВКУСОВ', 540, 560, { f: 'U', w: 800, s: 62, c: B2.ink, mw: 580 }); tx(c, 'FDA · США · 2020', 540, 625, { f: 'M', w: 800, s: 26, c: '#5b6075', ls: 3 });
    c.fillStyle = B2.ink; c.fillRect(260, 665, 560, 5);
    const rows = [['КАРТРИДЖНЫЕ', 'ЗАПРЕЩЕНЫ', B2.red], ['ТАБАК · МЕНТОЛ', 'МОЖНО', '#16a34a']];
    rows.forEach(([a, b, col], i) => { const yy = 760 + i * 130; rr(c, 260, yy - 50, 560, 100, 6); lnB(c, 3, '#b8ae98'); tx(c, a, 400, yy, { f: 'M', w: 800, s: 30, c: B2.ink, mw: 260 }); tx(c, b, 680, yy, { f: 'M', w: 800, s: 30, c: col, mw: 230 }) });
    const yy = 1150, blink = t > T2.one - .2 && t < T2.zak + .6 ? .5 + .5 * Math.sin((t - T2.one) * 9) : 0;
    rr(c, 260, yy - 60, 560, 120, 6); fill(c, rgba('#fde68a', .35 * blink)); c.setLineDash([16, 12]); rr(c, 260, yy - 60, 560, 120, 6); lnB(c, 4, mixc('#b8ae98', B2.red, blink)); c.setLineDash([]);
    tx(c, 'ОДНОРАЗОВЫЕ ?', 540, yy + 2, { f: 'M', w: 800, s: 40, c: mixc('#c9c3b6', '#9a937f', blink) });
    for (let i = 0; i < 3; i++) { c.fillStyle = '#d9d2c1'; c.fillRect(260, 1240 + i * 28, 560 - i * 120, 9) }
    for (let i = 0; i < 5; i++) { c.fillStyle = '#e1dacb'; c.fillRect(260, 1370 + i * 30, 560 - (i % 2) * 140 - (i === 4 ? 260 : 0), 8) }
    c.fillStyle = '#d9d2c1'; c.fillRect(520, 1585, 300, 4); tx(c, 'FDA', 670, 1560, { f: 'M', w: 800, s: 22, c: '#c9c1ae', ls: 6 });
    const ks = at(t, T2.zak - .12, T2.zak); if (ks > 0) { const s = lp(2.6, 1, eo(ks)); c.save(); c.translate(650, 1290); c.rotate(-.12); c.scale(s, s); c.globalAlpha *= cl(ks * 3);
      rr(c, -120, -48, 240, 96, 10); lnB(c, 9, B2.red); tx(c, 'ЗАКОН', 0, 3, { f: 'U', w: 800, s: 58, c: B2.red, ls: 4, mw: 210 }); c.restore() }
    c.restore();
  }
  function calendar2(c, t) {
    const k = bo(at(t, T2.jan - .3, T2.jan + .15)); if (k <= 0) return;
    const fl = eio(at(t, T2.jan - .05, T2.jan + .35));
    const kx = ei(at(t, T2.lift + .05, T2.lift + .5)); if (kx >= 1) return;
    c.save(); c.translate(340 - 900 * kx, 1640 - 500 * (1 - k)); c.rotate(-.04 - .4 * kx); c.scale(.82, .82);   // v19.1: под листом, в его ширину; год — внутри листка
    castDots(c, -130, -330, 260, 330, 90, { st: 14 });
    rr(c, -130, -330, 260, 330, 12); cel(c, -130, -330, 260, 330, B2.cream, { hw: .05, gr: .1 }); rr(c, -130, -330, 260, 330, 12); lnB(c, 4, '#c9c1ae');
    c.fillStyle = B2.red; c.fillRect(-130, -330, 260, 80); tx(c, 'ЯНВАРЬ', 0, -290, { f: 'U', w: 800, s: 40, c: '#fff', mw: 220 }); tx(c, '2020', 0, -150, { f: 'U', w: 800, s: 86, c: B2.ink, mw: 210 });
    if (fl < 1) { c.save(); c.translate(0, -330); c.scale(1, Math.cos(Math.PI * fl * .5) * 1); rr(c, -130, 0, 260, 330, 12); fill(c, '#ece6d6'); c.fillStyle = '#4b5563'; c.fillRect(-130, 0, 260, 80);
      tx(c, 'ДЕКАБРЬ', 0, 40, { f: 'U', w: 800, s: 38, c: '#fff', mw: 220 }); tx(c, '2019', 0, 180, { f: 'U', w: 800, s: 86, c: '#6b7280', mw: 210 }); rr(c, -130, 0, 260, 330, 12); lnB(c, 4, '#c9c1ae'); c.restore() }
    for (let i = 0; i < 6; i++) circ(c, -100 + i * 40, -330, 8, '#9aa3b5');
    c.restore();
  }
  function paper2(c, t) {
    const k = eo(at(t, T2.posle - .25, T2.sk + .2)); if (k <= 0) return;
    const kx = ei(at(t, T2.lift + .1, T2.lift + .55)); if (kx >= 1) return;
    c.save(); c.translate(lp(1500, 668, k) + 1000 * kx, 1504); c.rotate(-.04 * k + .3 * kx); c.scale(.8, .8);   // v19.1: под листом, в его ширину; СКАНДАЛ — внутри шапки
    castDots(c, -230, -170, 460, 340, 110, { st: 14 });
    rr(c, -230, -170, 460, 340, 6); cel(c, -230, -170, 460, 340, '#ece6d6', { hw: .03, sw: .15, gr: .14 }); rr(c, -230, -170, 460, 340, 6); lnB(c, 4, '#c9c1ae');
    tx(c, 'СКАНДАЛ', 0, -112, { f: 'U', w: 800, s: 70, c: B2.ink, ls: 2, mw: 400 }); c.fillStyle = B2.ink; c.fillRect(-200, -68, 400, 5);
    for (let i = 0; i < 5; i++) { c.fillStyle = '#b8ae98'; c.fillRect(30, -40 + i * 36, 170, 10); c.fillRect(-200, 90 + (i % 2) * 30, 200, 10) }
    rr(c, -200, -40, 200, 112, 4); fill(c, '#d1c9b6');
    c.restore();
  }
  // стик «Джула» (горизонтальный) → косое лезвие: 4 угла морфятся
  function stickBlade(c, t) {
    if (t < T2.posle) return;
    const kf = eio(at(t, T2.lift, T2.lift + .7)), on = bo(at(t, T2.juul - .25, T2.juul + .1));
    const S0 = [[580, 1560], [756, 1560], [756, 1588], [580, 1588]], B0 = [[BLD2.x0, BLD2.top], [BLD2.x1, BLD2.top], [BLD2.x1, BLD2.br], [BLD2.x0, BLD2.bl]];
    const kx = lp(1500, 668, eo(at(t, T2.posle - .25, T2.sk + .2))) - 668;
    let P = S0.map((p, i) => [lp(p[0] + kx, B0[i][0], kf), lp(p[1] - 30 * on * (1 - kf), B0[i][1], kf) - Math.sin(Math.PI * kf) * 140]);
    if (kf < .5) { c.save(); const cx = (P[0][0] + P[1][0]) / 2, cy = (P[0][1] + P[2][1]) / 2; c.translate(cx, cy); c.rotate(-.07 * (1 - kf * 2) + kf * .9 * Math.sin(Math.PI * kf * 2)); c.translate(-cx, -cy); }
    poly(c, P.flat()); const x0 = Math.min(...P.map(p => p[0])), x1 = Math.max(...P.map(p => p[0])), y0 = Math.min(...P.map(p => p[1])), y1 = Math.max(...P.map(p => p[1]));
    cel(c, x0, y0, x1 - x0, y1 - y0, mixc('#e7e9ef', B2.steel, kf), { hw: .05, sw: .22 }); poly(c, P.flat()); lnB(c, 4, '#ffffff');
    if (kf < .3) A(c, 1 - kf / .3, () => { c.fillStyle = '#2d3142'; c.fillRect(P[1][0] - 46, P[1][1], 46, P[2][1] - P[1][1]); circ(c, P[0][0] + 30, (P[0][1] + P[3][1]) / 2, 5, '#5eead4') });
    if (kf < .5) c.restore();
    if (kf > .6) { const ka = at(kf, .6, 1); c.save(); c.globalAlpha *= ka;
      poly(c, [P[3][0], P[3][1], P[2][0], P[2][1], P[2][0], P[2][1] - 26, P[3][0], P[3][1] - 26]); fill(c, '#ffffff');   // заточенная кромка
      c.fillStyle = '#2c3048'; c.fillRect(P[0][0] - 20, P[0][1] - 54, P[1][0] - P[0][0] + 40, 56); for (let i = 0; i < 4; i++) circ(c, P[0][0] + 50 + i * 150, P[0][1] + 30, 9, '#6b7593');
      const kfda = bo(at(t, T2.vl - .1, T2.vl + .3)); if (kfda > 0) { c.save(); c.translate((P[0][0] + P[1][0]) / 2, P[0][1] + 100); c.scale(kfda, kfda); rr(c, -92, -32, 184, 64, 8); lnB(c, 5, B2.red); tx(c, 'FDA · США', 0, 2, { f: 'M', w: 800, s: 30, c: B2.red }); c.restore() }
      c.restore() }
  }
  const gFall = t => { const u = t - T2.chop - .3; return u > 0 ? 2600 * u * u : 0 };   // v19.1: после удара рама и колодка падают вниз, лезвие остаётся
  function frame2(c, t) {   // деревянная рама гильотины (Хованский #127): две стойки и перекладина
    const k = eo(at(t, T2.lift + .2, T2.lift + .8)); if (k <= 0) return; const dy = 900 * (1 - k) + gFall(t); if (dy > 2000) return;
    c.save(); c.translate(0, dy); const { l, r, top, w } = POST2;
    [l, r].forEach(x => { rr(c, x - w / 2, top, w, 1640 - top, 6); cel(c, x - w / 2, top, w, 1640 - top, B2.wood, { hw: .12, sw: .3 }); rr(c, x - w / 2, top, w, 1640 - top, 6); lnB(c, 4); c.fillStyle = 'rgba(20,23,51,.35)'; c.fillRect(x - 6, top + 60, 12, 1640 - top - 120) });
    rr(c, l - 50, top - 20, r - l + 100, 56, 8); cel(c, l - 50, top - 20, r - l + 100, 56, B2.wood, { hw: .06, sw: .3 }); rr(c, l - 50, top - 20, r - l + 100, 56, 8); lnB(c, 4);
    c.restore();
  }
  function chains2(c, t, dy) {
    const k = eo(at(t, T2.lift + .55, T2.lift + 1.0)); if (k <= 0) return; const gf = gFall(t); if (gf > 2000) return;
    c.save(); c.translate(0, gf);
    [BLD2.x0 + 60, BLD2.x1 - 60].forEach((x, j) => { for (let i = 0; i < 26; i++) { const y = BLD2.top + dy - 30 - i * 44; if (y < Math.max(POST2.top + 30, BLD2.top - 1300 * k)) break;
      c.beginPath(); if (i % 2) c.ellipse(x, y, 7, 24, 0, 0, TAU); else c.ellipse(x, y, 16, 24, 0, 0, TAU); lnB(c, 7, i % 2 ? '#8590ad' : B2.steel) } });
    c.restore();
  }
  function stock2(c, t) {
    const k = eo(at(t, T2.lift + .2, T2.lift + .8)); if (k <= 0) return;
    const gf = gFall(t); if (gf > 2000) return; c.save(); c.translate(0, 900 * (1 - k) + gf);
    const cutT = i => T2.chop + (CX2[i] - BLD2.x0) / (BLD2.x1 - BLD2.x0) * .05;
    CRT2.forEach(([lab, col], i) => {
      const x = CX2[i], cut = i > 0 && i < 5 && t >= cutT(i), hop = T2.fl[i - 1] && t > T2.fl[i - 1] - .05 ? 34 * Math.sin(Math.PI * cl((t - T2.fl[i - 1] + .05) / .32)) : 0;
      const sh = i > 0 && i < 5 && t > T2.vk - .2 && t < T2.fl[0] - .1 ? Math.sin(t * 40 + i) * 3 : 0;
      c.save(); c.translate(x + sh, -hop);
      const top = cut ? STK2.cut : STK2.top;
      rr(c, -55, top, 110, STK2.y - top, cut ? 4 : 22); cel(c, -55, top, 110, STK2.y - top, col, { hw: .12 }); rr(c, -55, top, 110, STK2.y - top, cut ? 4 : 22); lnB(c, 4);
      if (!cut) { rr(c, -55, top, 110, 56, 22); fill(c, '#2d3142'); rr(c, -55, top, 110, 56, 22); lnB(c, 4) }
      else { c.beginPath(); c.ellipse(0, STK2.cut, 55, 12, 0, 0, TAU); fill(c, lit(col, .2)) }
      c.restore();
      if (cut) {   // верхушка отлетает
        const u = t - cutT(i), dir = i < 3 ? -1 : 1; c.save(); c.translate(x + dir * 70 * u, STK2.cut + 40 * u + 1500 * u * u); c.rotate(dir * 2.2 * u);   // v19.1: верхушки падают вниз
        rr(c, -55, STK2.top - STK2.cut, 110, STK2.cut - STK2.top, 22); cel(c, -55, STK2.top - STK2.cut, 110, STK2.cut - STK2.top, col, { hw: .12 }); rr(c, -55, STK2.top - STK2.cut, 110, 56, 22); fill(c, '#2d3142'); rr(c, -55, STK2.top - STK2.cut, 110, STK2.cut - STK2.top, 22); lnB(c, 4); c.restore();
      }
    });
    rr(c, 100, STK2.y, 880, 90, 8); cel(c, 100, STK2.y, 880, 90, B2.wood, { hw: .04, gr: .12 }); rr(c, 100, STK2.y, 880, 90, 8); lnB(c, 4);
    CRT2.forEach(([lab], i) => { const on = i > 0 && i < 5 && T2.fl[i - 1] && t > T2.fl[i - 1] - .05; tx(c, lab, CX2[i], STK2.y + 46, { f: 'M', w: 800, s: 25, c: on ? '#fde68a' : B2.cream, mw: 128 }) });
    if (t > T2.chop) DR2.forEach((d, j) => { const u = t - T2.chop - (j % 4) * .015; if (u <= 0) return; const x = CX2[d.ci] + d.vx * u * .6, y = STK2.cut + d.vy * u + 2400 * u * u; if (y > STK2.y + 400) return; drop(c, x, y, d.r, CRT2[d.ci][1], Math.atan2(d.vy + 4800 * u, d.vx * .6) + Math.PI / 2) });
    c.restore();
  }
  function bladeY(t) {   // лезвие висит, на «рубят» дёргается вверх, на «под нож» падает
    let y = 0; if (t > T2.rub - .1) y -= 70 * eo(at(t, T2.rub - .1, T2.rub + .35)); y += Math.sin(t * 2.2) * 6 * at(t, T2.lift + .7, T2.lift + 1.2);
    if (t > T2.drop) y = lp(y, STK2.y - BLD2.bl, ei(at(t, T2.drop, T2.chop))); return y;   // v19.3: удар до самой колодки — нижний угол лезвия в дерево (0:20)
  }
  function office(c, t) {
    c.fillStyle = B2.bg2; c.fillRect(-1600, -3000, 9000, 6000);
    c.save(); c.globalAlpha *= .9; for (let i = 0; i < 7; i++) { c.fillStyle = i % 2 ? '#2b2f50' : '#272b49'; c.fillRect(-1600, -2400 + i * 520, 4300, 520) } c.restore();
    beam(c, 540, -40, 540, 1500, 60, 520, '#fde68a', .1);
    c.fillStyle = '#3a2a22'; c.fillRect(-1600, 1640, 3100, 1400); c.beginPath(); c.moveTo(-1600, 1640); c.lineTo(1500, 1640); lnB(c, 4, '#c9a27e');
    sheet2(c, t); calendar2(c, t); paper2(c, t);
    // гильотина собирается на месте листа
    frame2(c, t); stock2(c, t);
    const by = bladeY(t); chains2(c, t, by); if (t < T2.chop + .33) { c.save(); c.translate(0, t > T2.lift + .7 ? by : 0); stickBlade(c, t); c.restore() }
    if (t > T2.end - .3 && typeof b3Draw === 'function') b3Draw(c, t);
  }
  function b2Shot(c, t) {
    if (!T2) b2Init(); const q = camObj(camAt(K2, t));
    if (t > T2.chop && t < T2.chop + .45) { const s = 22 * (1 - at(t, T2.chop, T2.chop + .45)); q.x += Math.sin(t * 97) * s / q.z * .05; q.y += Math.cos(t * 83) * s / q.z * .05 }
    if (t < TIN2) {
      const kr = eio(at(t, T2.a, T2.rev));
      if (kr < 1) { b1Shot(c, T1.end - .001) }
      const R = lp(EM.r, 1400, kr);
      c.save(); c.beginPath(); c.arc(EM.x, EM.y, R, 0, TAU); c.clip(); c.translate(540, 960); c.scale(q.z, q.z); c.translate(-q.x, -q.y); capitol(c, t); c.restore();
      if (kr < 1) { const k = R / 95; ring(c, EM.x, EM.y, 87 * k, B2.red, 7 * k * (1 - kr)); ring(c, EM.x, EM.y, 78 * k, B2.red, 2.5 * k * (1 - kr)); ring(c, EM.x, EM.y, R, B2.ln, 3 * k * (1 - kr) + 1) }
    } else if (t >= THIN3) { const h = camH(camO2(q)); c.save(); c.translate(540, 960); c.rotate(h.r); c.scale(h.z, h.z); c.translate(-h.x, -h.y); innerW(c, t); c.restore();
      speedLines(c, h, camH(camO2(camObj(camAt(K2, t + 1 / 30)))), t)
    } else { const o = camO2(q); c.save(); c.translate(540, 960); c.rotate(o.r); c.scale(o.z, o.z); c.translate(-o.x, -o.y); office(c, t); c.restore();
      speedLines(c, o, camO2(camObj(camAt(K2, t + 1 / 30))), t) }
  }
  // ================= блок 3 (20,9–38,8 с): лист разворачивается → «только для сменных картриджей» → «цельные одноразовые — НЕ УПОМЯНУТЫ» →
  // рывок вправо к полке «Джула»: вкусы уходят, в нижней дыре ТАБАК и МЕНТОЛ → полка проворачивается барабаном (валики, Соболев #112) →
  // цех в Шэньчжэне, коробки PUFF BAR / HQD / ELF BAR → лента изгибается в волну (Instagram #007) и накрывает магазин в США =================
  let T3 = null;
  // v19.1: лист ниже (на месте гильотины), лезвие сворачивается в валики (Соболев #112) и раскатывает указ;
  // на «Пока «Джул»…» камера ныряет сквозь дыру в бумаге «ЦЕЛЬНЫЕ ОДНОРАЗОВЫЕ» — мир H (полка, цех, волна, график, бак) лежит в дыре:
  // точка H (x, y) = O (HX3 + x·HS3, HY3 + y·HS3). Полка не переворачивается барабаном: её средняя доска вытягивается в ленту конвейера.
  const DY3 = -790, HOLE3 = { x: 440, y: 1840 + DY3, w: 400, h: 120 }, HS3 = .068, HX3 = 640 - 2700 * HS3, HY3 = 1110 - 1100 * HS3;
  const KH = (t, x, y, z) => KO2(t, HX3 + x * HS3, HY3 + y * HS3, z / HS3);
  const camH = o => ({ x: (o.x - HX3) / HS3, y: (o.y - HY3) / HS3, z: o.z * HS3, r: o.r });
  let THIN3 = 99;
  const PG3 = { x0: 210, x1: 870, y0: 1350, y1: 2260 }, SHF = { x0: 2190, x1: 3210, y0: 240, y1: 1960, cy: 1100 }, BELT = 1300, USS = { x0: 4020, x1: 4520, g: 1480 };
  const BOX3 = [['PUFF BAR', '#b65bd6', 2440], ['HQD', '#2f80ed', 2700], ['ELF BAR', '#16c09a', 2960]];
  function b3Words() {
    const w = Wd; T3 = { unf: w('разверните'), zap: w('запрет'), only: w('только'), smen: w('сменными'), cart: w('картриджами'), cel: w('цельные'), odn: w('одноразовые'),
      upom: w('упомянуты'), poka: w('пока'), ubir: w('убирал'), flip: 31.5, shen: w('шэньчжэне'), conv: w('конвейеры'), box: [w('puff bar'), w('hqd'), w('elf bar')],
      wave: 36.0, nakr: w('накрыли'), am: w('америку'), voln: w('волной'), end: w('всего') + .02 };
    T3.rl = T2.chop + .33; T3.rp0 = T3.unf - .2; T3.rp1 = T3.unf + .5; T3.rx = T3.rp1 + .05;
    T2.fin = T3.end;
  }
  function b3Keys() {
    if (!T3) b3Words();
    return [KO2(21.4, 540, 1015, .98), KO2(22.45, 540, 980, 1.04), KO2(25.9, 545, 1000, 1.07), KO2(T3.upom - .05, 540, 1010, 1.08), KO2(T3.upom + .2, 540, 1010, 1.08),
      KO2(T3.poka - .4, 610, 1060, 1.12), KH(T3.poka + .45, 2700, 1100, 1.17), KH(T3.flip - .2, 2700, 1100, 1.2), KH(T3.flip + .85, 2640, 1030, 1.0), KH(T3.wave - .05, 2730, 1070, 1.04),
      KH(T3.wave + .5, 2950, 1080, 1.06), KH(T3.am + .05, 4180, 1060, 1.05), KH(T3.voln + .25, 4260, 1080, 1.0), KH(T3.end, 4270, 1090, .99), ...(typeof b4Keys === 'function' ? b4Keys() : [])];
  }
  // ---------- развёрнутый лист ----------
  function podIcon(c, x, y, t, pale) {   // вейп со сменным картриджем: картридж выскакивает и встаёт обратно
    if (pale) { c.setLineDash([12, 10]); rr(c, x - 38, y - 110, 76, 220, 26); lnB(c, 4, '#b9b2a2'); c.setLineDash([]); return }
    const u = ((t - T3.smen) % 1.1 + 1.1) % 1.1, up = t > T3.smen ? 40 * Math.sin(Math.PI * cl(u / .5)) : 0;
    rr(c, x - 36, y - 60, 72, 170, 18); cel(c, x - 36, y - 60, 72, 170, B2.ind, { hw: .14 }); rr(c, x - 36, y - 60, 72, 170, 18); lnB(c, 4, B2.ink);
    rr(c, x - 30, y - 112 - up, 60, 60, 14); cel(c, x - 30, y - 112 - up, 60, 60, B2.mango, { hw: .14 }); rr(c, x - 30, y - 112 - up, 60, 60, 14); lnB(c, 4, B2.ink);
  }
  function pageBody(c, t) {   // содержимое указа в координатах листа (как в v19.0), сдвиг DY3 снаружи
    const { x0, x1, y0, y1 } = PG3, w = x1 - x0, h = y1 - y0;
    castDots(c, x0, y0, w, h, 140, { st: 16 });
    rr(c, x0, y0, w, h, 8); cel(c, x0, y0, w, h, B2.cream, { hw: .03, sw: .12, gr: .12 }); rr(c, x0, y0, w, h, 8); lnB(c, 4, '#c9c1ae');
    const ga = c.globalAlpha, fa = 1 - at(t, T3.poka - .35, T3.poka - .1); c.globalAlpha = ga * fa;   // v19.3: на нырке в дыру надписи гаснут — не пролетают огромными мимо камеры
    const kt = eo(at(t, T3.zap - .1, T3.zap + .7)); c.save(); c.beginPath(); c.rect(x0, y0, w * kt + 1, 200); c.clip(); tx(c, 'ЗАПРЕТ — ТОЛЬКО ДЛЯ:', 540, 1440, { f: 'U', w: 800, s: 44, c: B2.ink, mw: 590 }); c.restore();
    c.fillStyle = B2.ink; c.fillRect(260, 1490, 560 * kt, 5);
    const ka = bo(at(t, T3.only - .15, T3.only + .3)); if (ka > 0) { c.save(); c.translate(330, 1640); c.scale(ka, ka); podIcon(c, 0, 0, t, false); c.restore();
      const km = eo(at(t, T3.only, T3.cart + .3)); c.fillStyle = 'rgba(253,224,71,.85)'; c.fillRect(440, 1585, 400 * km, 46); c.fillRect(440, 1645, 290 * cl(km * 1.3 - .3), 46);
      tx(c, 'ВЕЙПОВ СО СМЕННЫМИ', 640, 1610, { f: 'M', w: 800, s: 34, c: B2.ink, mw: 390 }); tx(c, 'КАРТРИДЖАМИ', 585, 1670, { f: 'M', w: 800, s: 34, c: B2.ink });
      const kc = bo(at(t, T3.cart + .2, T3.cart + .5)); if (kc > 0) { c.save(); c.translate(800, 1680); c.scale(kc, kc); circ(c, 0, 0, 30, '#16a34a'); c.beginPath(); c.moveTo(-13, 0); c.lineTo(-3, 11); c.lineTo(14, -10); lnB(c, 7, '#fff'); c.restore() } }
    const kb = bo(at(t, T3.cel - .15, T3.cel + .3)); if (kb > 0) { c.save(); c.translate(330, 1900); c.scale(kb, kb); podIcon(c, 0, 0, t, true); tx(c, '?', 0, 0, { f: 'M', w: 800, s: 80, c: '#b9b2a2' }); c.restore();
      c.save(); c.globalAlpha = ga; hole3(c, t, kb); c.restore() }
    const ks = at(t, T3.upom - .1, T3.upom + .02); if (ks > 0) { const s = lp(2.4, 1, eo(ks)); c.save(); c.translate(545, 2110); c.rotate(-.08); c.scale(s, s); c.globalAlpha *= cl(ks * 3);
      rr(c, -260, -54, 520, 108, 12); fill(c, 'rgba(214,51,77,.08)'); rr(c, -260, -54, 520, 108, 12); lnB(c, 9, B2.red); tx(c, 'НЕ УПОМЯНУТЫ', 0, 4, { f: 'U', w: 800, s: 56, c: B2.red, ls: 2, mw: 470 }); c.restore() }
    c.globalAlpha = ga;
  }
  function hole3(c, t, kb) {   // пустая клетка «ЦЕЛЬНЫЕ ОДНОРАЗОВЫЕ»: на «Пока…» бумага в ней проваливается люком, в дыре — полка «Джула»
    const x = 440, y = 1840, w = 400, h = 120, kh = eio(at(t, T3.poka - .5, T3.poka - .1));
    if (kh > 0) { c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.translate(HX3, HY3 - DY3); c.scale(HS3, HS3); innerW(c, t); c.restore() }
    if (kh < 1) { const ch = Math.cos(kh * Math.PI / 2); c.save(); c.translate(0, y); c.scale(1, Math.max(.001, ch)); c.translate(0, -y);
      rr(c, x, y, w, h, 10); fill(c, mixc(B2.cream, '#8d8572', kh));
      const pl = .6 + .4 * Math.sin((t - T3.cel) * 7); c.setLineDash([14, 10]); rr(c, x, y, w, h, 10); lnB(c, 4, mixc('#cfc8b8', '#9a937f', pl)); c.setLineDash([]);
      tx(c, 'ЦЕЛЬНЫЕ', 640, 1872, { f: 'M', w: 800, s: 34, c: '#a8a190' }); tx(c, 'ОДНОРАЗОВЫЕ', 640, 1926, { f: 'M', w: 800, s: 34, c: '#a8a190' }); c.restore() }
    if (kh > 0) { rr(c, x, y, w, h, 10); lnB(c, 5, B2.ink); c.fillStyle = 'rgba(20,23,51,.5)'; c.fillRect(x, y, w, 10 * kh) }   // край дыры
  }
  function roller3(c, y, x0, x1, kh = 1) {   // серый валик с жёлтыми ручками (Соболев #112)
    const r = 42; rr(c, x0, y - r, x1 - x0, r * 2, r); cel(c, x0, y - r, x1 - x0, r * 2, '#a3a9bd', { hw: .1, sw: .3 }); c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(x0 + 20, y - r + 14, x1 - x0 - 40, 8); rr(c, x0, y - r, x1 - x0, r * 2, r); lnB(c, 4);
    if (kh > 0) [[x0, -1], [x1, 1]].forEach(([xe, sd]) => { c.fillStyle = '#4b5068'; c.fillRect(sd > 0 ? xe : xe - 22 * kh, y - 8, 22 * kh, 16); rr(c, sd > 0 ? xe + 18 * kh : xe - 18 * kh - 30, y - 34, 30, 68, 12); cel(c, sd > 0 ? xe + 18 * kh : xe - 18 * kh - 30, y - 34, 30, 68, '#f2b84b', { hw: .14 }); rr(c, sd > 0 ? xe + 18 * kh : xe - 18 * kh - 30, y - 34, 30, 68, 12); lnB(c, 3) });
  }
  function page3(c, t) {   // мир O: лезвие → валик → два валика расходятся вверх и вниз, между ними — указ
    if (t < T3.rl) return;
    const ym = (PG3.y0 + PG3.y1) / 2 + DY3, H2 = (PG3.y1 - PG3.y0) / 2, ku = eio(at(t, T3.rp0, T3.rp1)), hh = H2 * ku, kx = ei(at(t, T3.rx, T3.rx + .45));
    if (ku > 0) { c.save(); c.beginPath(); c.rect(PG3.x0 - 30, ym - hh, PG3.x1 - PG3.x0 + 60, hh * 2); c.clip(); c.translate(0, DY3); pageBody(c, t); c.restore() }
    if (kx >= 1) return;
    const km = eio(at(t, T3.rl, T3.rl + .42)), by = bladeY(T3.rl);
    if (km < 1) {   // косое лезвие сворачивается в цилиндр и поднимается к середине листа
      const B = [[BLD2.x0, BLD2.top + by], [BLD2.x1, BLD2.top + by], [BLD2.x1, BLD2.br + by], [BLD2.x0, BLD2.bl + by]], Rc = [[180, ym - 42], [900, ym - 42], [900, ym + 42], [180, ym + 42]];
      const P = B.map((p, i) => [lp(p[0], Rc[i][0], km), lp(p[1], Rc[i][1], km)]); poly(c, P.flat());
      cel(c, Math.min(...P.map(p => p[0])), Math.min(...P.map(p => p[1])), 720, Math.max(...P.map(p => p[1])) - Math.min(...P.map(p => p[1])), mixc(B2.steel, '#a3a9bd', km), { hw: .08, sw: .25 }); poly(c, P.flat()); lnB(c, 4, mixc('#ffffff', B2.ln, km));
      return }
    const yT = ym - hh - 1300 * kx * kx, yB = ym + hh + 1300 * kx * kx;
    roller3(c, yB, 180, 900, 1); roller3(c, yT, 180, 900, 1);
  }
  function innerW(c, t) {   // мир H: тёмная глубина, полка «Джула» → её доска вытягивается в ленту → цех, волна, график, бак
    c.fillStyle = '#14172e'; c.fillRect(-3000, -2000, 12000, 7000);
    const kc = eio(at(t, T3.flip - .1, T3.flip + .8));
    if (kc > 0) factory(c, t, kc);
    if (kc < 1) shelfCollapse(c, t, kc);
  }
  function shelfCollapse(c, t, kc) {   // полка сжимается к средней доске, доска вытягивается в стальную ленту конвейера (#182)
    const yP = 1320;
    c.save(); c.translate(0, yP + 17); c.scale(1, Math.max(.001, 1 - kc)); c.translate(0, -yP - 17); shelfFront(c, t, kc > 0); c.restore();
    if (kc <= 0) return;
    const L = lp(2330, 1700, kc), Rr = lp(3070, 3500, kc), h = lp(34, 10, kc), y = lp(yP, BELT - 5, kc);
    for (let x = 1760; x < 3500; x += 120) if (x > L && x < Rr) { const r = 26 * ss(.4, 1, kc); if (r > 1) { circ(c, x, BELT + 40, r, '#3a3f66'); ring(c, x, BELT + 40, r, B2.ln, 3) } }
    rr(c, L, y, Rr - L, h, 6); cel(c, L, y, Rr - L, h, mixc(B2.wood, B2.ln, kc), { hw: .03 }); rr(c, L, y, Rr - L, h, 6); lnB(c, 3);
  }
  // ---------- полка «Джула» (лицевая сторона барабана) ----------
  const PODC = [B2.mango, B2.coral, '#f19ac2', B2.mint, '#b65bd6', '#f2d24b', B2.ice2, '#9a6a44'];
  function pod3(c, x, y, col, lab) {
    rr(c, x - 30, y - 100, 60, 100, 12); cel(c, x - 30, y - 100, 60, 100, col, { hw: .14 }); rr(c, x - 30, y - 100, 60, 34, 12); fill(c, '#2d3142'); rr(c, x - 30, y - 100, 60, 100, 12); lnB(c, 3);
    if (lab) { rr(c, x - 50, y + 10, 100, 34, 6); fill(c, B2.cream); tx(c, lab, x, y + 28, { f: 'M', w: 800, s: 20, c: B2.ink, mw: 92 }) }
  }
  function shelfFront(c, t, skip) {
    const { x0, x1, y0, y1 } = SHF; c.fillStyle = '#2d3156'; c.fillRect(x0, y0, x1 - x0, y1 - y0);
    for (let i = 0; i < 9; i++) { c.fillStyle = i % 2 ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.05)'; c.fillRect(x0 + i * 115, y0, 115, y1 - y0) }
    rr(c, 2380, 450, 640, 110, 12); fill(c, B2.ink); rr(c, 2380, 450, 640, 110, 12); lnB(c, 4); tx(c, '«ДЖУЛ» · ВКУСЫ', 2700, 508, { f: 'U', w: 800, s: 52, c: B2.cream, ls: 2 });
    const rows = [700, 1010, 1320], L = 2330, R = 3070;
    rows.forEach((y, r) => { for (let i = 0; i < 9; i++) { const x = L + 50 + i * 80, d = T3.ubir + (r * 9 + i) * .045, k = ei(at(t, d, d + .35)); if (k < 1) { c.save(); c.translate(0, -1400 * k); pod3(c, x, y, PODC[(i + r * 3) % 8]); c.restore() } }
      if (!(skip && r === 2)) { rr(c, L, y, R - L, 34, 6); cel(c, L, y, R - L, 34, B2.wood, { hw: .03 }); rr(c, L, y, R - L, 34, 6); lnB(c, 3) }
      if (t > T3.ubir + .3 + r * .4) for (let i = 0; i < 3; i++) { rr(c, L + 80 + i * 230, y + 44, 110, 34, 6); fill(c, '#e2504f'); tx(c, 'НЕТ', L + 135 + i * 230, y + 62, { f: 'M', w: 800, s: 22, c: '#fff' }) } });
    rr(c, 2370, 1450, 660, 230, 14); fill(c, '#14172e'); rr(c, 2370, 1450, 660, 230, 14); lnB(c, 4, '#5a5f8a');   // дыра на нижней полке
    pod3(c, 2520, 1640, '#9a6a44', 'ТАБАК'); pod3(c, 2880, 1640, B2.ice2, 'МЕНТОЛ');
    rr(c, L, 1680, R - L, 34, 6); cel(c, L, 1680, R - L, 34, B2.wood, { hw: .03 }); rr(c, L, 1680, R - L, 34, 6); lnB(c, 3);
    c.beginPath(); c.rect(2300, 260, 800, 1680); lnB(c, 6, '#4a4f7d');
  }
  // ---------- цех в Шэньчжэне ----------
  function box3(c, x, y, s, col, lab, rot = 0) {   // коробка в 3D: лицо, верх, бок
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    poly(c, [-90, -180, 90, -180, 130, -220, -50, -220]); fill(c, lit(col, .3)); poly(c, [-90, -180, 90, -180, 130, -220, -50, -220]); lnB(c, 3);
    poly(c, [90, -180, 130, -220, 130, -40, 90, 0]); fill(c, shd(col, .35)); poly(c, [90, -180, 130, -220, 130, -40, 90, 0]); lnB(c, 3);
    rr(c, -90, -180, 180, 180, 4); cel(c, -90, -180, 180, 180, col, { hw: .08, sw: .0001 }); rr(c, -90, -180, 180, 180, 4); lnB(c, 3);
    tx(c, lab, 0, -96, { f: 'U', w: 800, s: 36, c: '#fff', mw: 160 }); c.restore();
  }
  function beltY(x, t) { const A = 70 * eo(at(t, T3.wave, T3.wave + .45)); return BELT + A * Math.sin((x - 2000) / 150 - (t - T3.wave) * 7) }
  function factory(c, t, kc = 1) {
    c.fillStyle = '#1b1f3a'; c.fillRect(1500, -600, 4200, 3200);
    poly(c, [1500, 1700, 2600, -600, 3300, -600, 2200, 1700]); fill(c, '#21264a');
    // США справа: ночное небо через косой разрез
    poly(c, [3500, 2600, 3900, -600, 5800, -600, 5800, 2600]); fill(c, '#151a36');
    for (let i = 0; i < 26; i++) circ(c, 3950 + H1(i * 4.4) * 1500, -300 + H1(i * 6.6) * 900, 2 + H1(i) * 2, rgba('#e2e8f0', .35 + .25 * Math.sin(t * 1.7 + i)));
    usStore(c, t);
    // балка с лебёдками (Кола #067)
    c.fillStyle = '#f2b84b'; c.fillRect(1700, 470, 1900, 50); c.save(); c.beginPath(); c.rect(1700, 470, 1900, 50); c.clip(); for (let i = 0; i < 40; i++) { poly(c, [1700 + i * 60, 520, 1730 + i * 60, 520, 1760 + i * 60, 470, 1730 + i * 60, 470]); fill(c, B2.ink) } c.restore();
    c.beginPath(); c.rect(1700, 470, 1900, 50); lnB(c, 3);
    for (let j = 0; j < 3; j++) { const x = 1900 + ((t * 120 + j * 520) % 1560), cy = 760 + 60 * Math.sin(t * 1.3 + j);
      c.fillStyle = '#2c3048'; c.fillRect(x - 40, 515, 80, 40); c.beginPath(); c.moveTo(x - 20, 555); c.lineTo(x - 50, cy); c.moveTo(x + 20, 555); c.lineTo(x + 50, cy); lnB(c, 4, B2.steel);
      box3(c, x, cy + 130, .55, ['#b65bd6', '#2f80ed', '#16c09a'][j], ['PUFF', 'HQD', 'ELF'][j]) }
    A(c, 1 - at(t, T3.wave + .05, T3.wave + .4), () => neonTxt(c, 'ШЭНЬЧЖЭНЬ', 2620, 650, t, T3.shen));   // v19.3: вывеска гаснет до того, как камера срежет её краем кадра (0:36)
    // конвейер: лента — линия, которая на «волной» изгибается
    const x0 = 1700, x1 = T3 && t > T3.wave ? 6000 : 3500;
    if (kc >= 1) for (let x = 1760; x < 3500; x += 120) { const y = beltY(x, t); circ(c, x, y + 40, 26, '#3a3f66'); ring(c, x, y + 40, 26, B2.ln, 3); c.save(); c.translate(x, y + 40); c.rotate(t * 6); c.beginPath(); c.moveTo(-20, 0); c.lineTo(20, 0); lnB(c, 3); c.restore() }
    if (kc >= 1) { c.beginPath(); for (let x = x0; x <= Math.min(x1, 3500); x += 20) c.lineTo(x, beltY(x, t)); lnB(c, 10, B2.ln) }
    if (kc >= 1) for (let i = 0; i < 9; i++) { const x = 1760 + ((t - 30) * 140 + i * 200) % 1700; if (x > 3450) continue; c.save(); c.translate(x, beltY(x, t)); c.rotate(Math.atan(Math.cos((x - 2000) / 150 - (t - T3.wave) * 7) * 70 * eo(at(t, T3.wave, T3.wave + .45)) / 150)); rr(c, -30, -50, 60, 50, 6); cel(c, -30, -50, 60, 50, '#8d94b8', { hw: .1 }); rr(c, -30, -50, 60, 50, 6); lnB(c, 2.5); c.restore() }
    BOX3.forEach(([lab, col, x], i) => { const tb = T3.box[i]; if (t < tb - .32) return; const kk = cl((t - tb + .32) / .32), sq = t > tb ? .14 * Math.sin(Math.PI * cl((t - tb) / .28)) : 0, by = beltY(x, t);   // v19.1: коробки падают сверху на ленту
      c.save(); c.translate(x, by - 1100 + 1100 * kk * kk); c.scale(1 + sq, 1 - sq);
      castDots(c, -90, -180, 180, 180, 90, { st: 13 }); box3(c, 0, 0, 1, col, lab, .06 * Math.sin(t * 3 + i)); c.restore() });
    if (t > T3.end - .5 && typeof chart4 === 'function') { if (!T4) b4Words(); chart4(c, t) }
    if (t > T3.wave) wave3(c, t);
    if (T4 && t > T4.dive - .3) { c.save(); c.translate(4300, 500 - 1000 * TS4); c.scale(TS4, TS4); tank4(c, t); c.restore() }
  }
  function neonTxt(c, s, x, y, t, t0) { const on = at(t, t0 - .2, t0) * (t < t0 + .3 ? (Math.sin(t * 80) > -.3 ? 1 : .4) : 1);
    rr(c, x - 220, y - 60, 440, 120, 14); fill(c, B2.ink); rr(c, x - 220, y - 60, 440, 120, 14); lnB(c, 4); if (on > 0) glow(c, x, y, 260, '#ff5d6c', .3 * on);
    tx(c, s, x, y + 4, { f: 'U', w: 800, s: 56, c: mixc('#5a2f3a', '#ff6b78', on), ls: 3 }) }
  function usStore(c, t) {
    const { x0, x1, g } = USS; c.save(); c.translate(0, 1200 * ei(at(t, T3.voln + .25, T3.end + .5))); c.fillStyle = '#10142a'; c.fillRect(3700, g, 2200, 900); c.beginPath(); c.moveTo(3700, g); c.lineTo(5900, g); lnB(c, 4);
    rr(c, x0, g - 560, x1 - x0, 560, 6); cel(c, x0, g - 560, x1 - x0, 560, '#33386a', { hw: .05, gr: .08 }); rr(c, x0, g - 560, x1 - x0, 560, 6); lnB(c, 4);
    for (let s = 0; s < 6; s++) { c.beginPath(); const sx = x0 + 10 + s * 80; c.moveTo(sx, g - 380); c.lineTo(sx + 80, g - 380); c.arc(sx + 40, g - 380, 40, 0, Math.PI); c.closePath(); fill(c, s % 2 ? B2.cream : B2.red); lnB(c, 3) }
    rr(c, x0 + 30, g - 330, 300, 250, 6); fill(c, '#1b1f3d'); for (let s = 0; s < 4; s++) { rr(c, x0 + 55 + s * 66, g - 280, 36, 70, 10); fill(c, PODC[s]) } rr(c, x0 + 30, g - 330, 300, 250, 6); lnB(c, 4);
    rr(c, x0 + 370, g - 330, 100, 330, 6); fill(c, '#1b1f3d'); rr(c, x0 + 370, g - 330, 100, 330, 6); lnB(c, 4);
    rr(c, x0 + 20, g - 520, 460, 100, 10); fill(c, B2.ink); rr(c, x0 + 20, g - 520, 460, 100, 10); lnB(c, 4); tx(c, 'ВЕЙПЫ · США', (x0 + x1) / 2, g - 467, { f: 'U', w: 800, s: 52, c: B2.cream, ls: 2 });
    c.fillStyle = '#2f4a9a'; c.fillRect(x1 + 60, g - 700, 8, 700); c.fillStyle = B2.cream; for (let i = 0; i < 5; i++) { c.fillStyle = i % 2 ? B2.cream : B2.red; c.fillRect(x1 + 68, g - 700 + i * 24, 170, 24) } c.fillStyle = '#2f4a9a'; c.fillRect(x1 + 68, g - 700, 70, 72); c.restore();
  }
  // волна (Instagram #007): лента поднимается, сверху красная полоса, белый гребень, тело синее; фронт бежит вправо и накрывает магазин
  function wave3(c, t) {
    const kz = eio(at(t, T3.end - .3, T3.end + .7)), kh = eio(at(t, T3.wave + .3, T3.wave + 1.0)) * (1 - .8 * kz), front = lp(3400, 5300, eio(at(t, T3.wave + .35, T3.voln + .2))) + 900 * kz, lvl = lp(lp(BELT, 760, eio(at(t, T3.wave + .3, T3.wave + 1.0))), LVL4 - 20, kz);
    const top = x => lp(lvl - 110 * Math.exp(-Math.pow((front - 520 - x) / 260, 2)) * kh, 2700, ss(front - 480, front, x)) + 34 * Math.sin(x / 120 - t * 4) * kh;
    const P = []; for (let x = 1600; x <= front + 20; x += 20) P.push(x, x > 3500 ? top(x) : Math.min(beltY(x, t), top(x)));
    const body = (dy, col) => { c.beginPath(); c.moveTo(1600, 2600); for (let i = 0; i < P.length; i += 2) c.lineTo(P[i], P[i + 1] + dy); c.lineTo(front + 40, 2600); c.closePath(); fill(c, col) };
    body(0, B2.red); body(46, B2.cream); body(80, B2.blue); body(240, '#1f4fa8'); body(520, B2.navy);
    c.save(); c.beginPath(); c.moveTo(1600, 2600); for (let i = 0; i < P.length; i += 2) c.lineTo(P[i], P[i + 1] + 240); c.lineTo(front + 40, 2600); c.closePath(); c.clip(); dotsField(c, 1600, lvl + 200, front - 1500, 900, 22, 'rgba(255,255,255,.12)', 2); c.restore();
    const fx = front - 520, fy = top(fx); for (let i = 0; i < 12; i++) { const u = ((t * 1.3 + i / 12) % 1); circ(c, fx - 160 + H1(i) * 360, fy - 30 - u * 150, (8 + H1(i * 3) * 10) * (1 - u), B2.cream) }   // брызги над гребнем
    BOX3.forEach(([lab, col], i) => { const x = lp(2440 + i * 260, front - 300 - i * 260, eio(at(t, T3.wave + .4, T3.voln))); c.save(); c.translate(x, top(x) - 10); c.rotate(.12 * Math.sin(t * 3 + i)); box3(c, 0, 0, .9, col, lab); c.restore() });
  }
  function b3Draw(c, t) { if (!T3) b3Words(); page3(c, t) }
  // ================= блок 4 (38,8–53,4 с): волна успокаивается → из воды столбики 2,4 % → 26,5 % (×11, выноска от края) → нырок в верх столбика:
  // в баке двухслойная волна (манго + лёд, Кола #002) → по рельсу едут 5 пакетов (Instagram #054), из ХЛАДАГЕНТ WS-23 падает кристалл →
  // пар по каналу к панели РЕЦЕПТОРЫ ГОРЛА: лист мяты поворачивается на 180° (#019) в ледяную фрезу, лёд ложится на шкалу, ЖЖЕНИЕ видно подо льдом =================
  // Кадр T (бак) лежит в столбике: точка T (x, y) = O (4300 + x·TS, 500 + (y − 1000)·TS); верх жидкости в T — y 1000.
  let T4 = null; const TS4 = 200 / 1080, BARB = { x0: 4300, x1: 4500, top: 500 }, BARA = { x0: 4060, x1: 4220 }, LVL4 = 1220;
  const KT4 = (t, x, y, z) => KH(t, 4300 + x * TS4, 500 + (y - 1000) * TS4, z / TS4);   // v19.1: бак лежит в мире H
  const BAG4 = [['АРОМАТ', B2.blue], ['ГЛИЦЕРИН', '#b3263d'], ['ХЛАДАГЕНТ WS-23', B2.ice2], ['ПГ', '#b3263d'], ['НИКОТИН', B2.blue]];
  function b4Words() {
    const w = Wd; T4 = { vsego: w('всего'), par: w('парящих'), vyr: w('выросла'), x11: w('одиннадцать'), eto: w('это'), vk: w('вкусы'), zh: w('жидкость'), sint: w('синтетический'), hol: w('холодок'), ws: w('ws-23'),
      on: w('он'), obm: w('обманывает'), rec: w('рецепторы'), gor: w('горло'), led: w('лёд'), der: w('дерёт'), nik: w('никотин', 1), end: w('помните') + .22 };
    T4.dive = T4.eto - .1; T2.fin = T4.end;
  }
  function b4Keys() {
    if (!T4) b4Words();
    return [KH(39.6, 4285, 900, 1.0), KH(T4.x11 - .05, 4300, 845, 1.02), KH(T4.x11 + .2, 4300, 845, 1.02), KH(T4.dive - .05, 4330, 800, 1.06),
      KH(T4.dive + .45, 4396, 520, 2.4), KT4(T4.dive + .95, 540, 960, 1), KT4(T4.ws - .4, 540, 930, 1.04), KT4(T4.ws + .2, 540, 920, 1.05), KT4(T4.obm - .55, 540, 880, 1.05),
      KT4(T4.rec + .55, 540, -720, 1.0), KT4(T4.led - .1, 540, -740, 1.02), KT4(T4.led + .15, 540, -740, 1.02), KT4(T4.end - .6, 540, -800, 1.06), KT4(T4.end, 540, -1080 + 60 / 13.44, 13.44)];   // v19.1: камера плавно ведёт за ледяным пузырьком вверх по трубке, без смаза
  }
  // поверхность жидкости — две волны со сдвигом фазы (задняя — манго, передняя — лёд)
  function liquid2(c, x0, x1, y, A, t, yb, tilt = 0) {
    const sf = (x, ph, a) => y + a * Math.sin((x - x0) / (x1 - x0) * TAU * 1.2 + t * 2.4 + ph) + tilt * (x - (x0 + x1) / 2);
    c.beginPath(); c.moveTo(x0, yb); for (let i = 0; i <= 40; i++) { const x = lp(x0, x1, i / 40); c.lineTo(x, sf(x, 0, A) - A * .6) } c.lineTo(x1, yb); c.closePath(); fill(c, B2.mango);
    c.beginPath(); c.moveTo(x0, yb); for (let i = 0; i <= 40; i++) { const x = lp(x0, x1, i / 40); c.lineTo(x, sf(x, 2.2, A) + A * .5) } c.lineTo(x1, yb); c.closePath(); fill(c, B2.ice2);
    c.beginPath(); for (let i = 0; i <= 40; i++) { const x = lp(x0, x1, i / 40); c.lineTo(x, sf(x, 2.2, A) + A * .5) } lnB(c, Math.max(2, A * .12), '#ffffff');
  }
  function chart4(c, t) {
    const ka = bo(at(t, T4.vsego + .3, T4.vsego + .7)), kb = at(t, T4.par, T4.x11 + .2), vb = lp(2.4, 26.5, eio(at(Math.round(t * 30) / 30, T4.vyr - .1, T4.x11 + .4)));   // цифры — по кадру, без двоения от затвора
    const kt = eo(at(t, T4.vsego - .2, T4.vsego + .4)), out = ei(at(t, T4.dive - .3, T4.dive + .1));
    if (out < 1) A(c, kt, () => { tx(c, 'ДОЛЯ ОДНОРАЗОК У ПАРЯЩИХ', 4290, 240 - 700 * out, { f: 'U', w: 800, s: 44, c: B2.cream, mw: 900 }); tx(c, 'ШКОЛЬНИКОВ США', 4290, 300 - 700 * out, { f: 'U', w: 800, s: 44, c: B2.cream }) });   // v19.1: заголовок выше плашки 26,5 %
    const ha = 70 * ka; if (ka > 0) { rr(c, BARA.x0, LVL4 - ha, 160, ha + 120, 8); cel(c, BARA.x0, LVL4 - ha, 160, ha + 120, B2.mango, { hw: .1 }); rr(c, BARA.x0, LVL4 - ha, 160, ha + 120, 8); lnB(c, 4);
      plate(c, '2019 · 2,4 %', 4140, LVL4 - ha - 60 - 400 * out, ka * (1 - out), { s: 30, bg: B2.cream, c: B2.ink }) }
    if (kb > 0) {
      const top = lp(LVL4 - 70, BARB.top, eio(at(t, T4.vyr - .1, T4.x11 + .4))) - 30 * (1 - eo(at(t, T4.par, T4.par + .5)));
      c.save(); rr(c, BARB.x0, top - 20, 200, LVL4 + 120 - top + 20, 8); c.clip(); c.fillStyle = B2.ice2; c.fillRect(BARB.x0, top - 40, 200, 2000);
      liquid2(c, BARB.x0, BARB.x1, top, 9, t, LVL4 + 200); c.fillStyle = 'rgba(20,23,51,.25)'; c.fillRect(BARB.x1 - 50, top - 40, 50, 2000); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(BARB.x0 + 16, top + 20, 18, 2000); c.restore();
      c.beginPath(); c.moveTo(BARB.x0, top - 20); c.lineTo(BARB.x0, LVL4 + 120); c.moveTo(BARB.x1, top - 20); c.lineTo(BARB.x1, LVL4 + 120); lnB(c, 4);
      plate(c, '2020 · ' + vb.toFixed(1).replace('.', ',') + ' %', 4400, top - 70 - 400 * out, (1 - out) * eo(at(t, T4.par, T4.par + .3)), { s: 34, bg: B2.red, c: '#fff' });
      const kx = at(t, T4.x11 - .1, T4.x11 + .02); if (kx > 0 && out < 1) { const s = lp(2.2, 1, eo(kx)); c.save(); c.translate(4160 + 600 * out, 760); c.rotate(-.1); c.scale(s, s); c.globalAlpha *= cl(kx * 3) * (1 - out);
        rr(c, -110, -70, 220, 140, 16); fill(c, B2.red); rr(c, -110, -70, 220, 140, 16); lnB(c, 5); tx(c, '×11', 0, 6, { f: 'U', w: 800, s: 92, c: '#fff' }); c.restore();
        c.save(); c.globalAlpha *= 1 - out; c.setLineDash([16, 12]); c.beginPath(); c.moveTo(4150, LVL4 - 120); c.quadraticCurveTo(4170, 620, BARB.x0 - 20, top + 30); lnB(c, 5, B2.red); c.restore() }
    }
  }
  // ---------- бак (кадр T) ----------
  function bag4(c, x, y, lab, col, t, i) {
    const sw = .09 * Math.sin(t * 2.6 + i * 1.3) * (1 - .6 * at(t, T4.ws, T4.ws + 1));
    c.save(); c.translate(x, y); c.rotate(sw); c.beginPath(); c.moveTo(0, -40); c.lineTo(0, 0); lnB(c, 6, B2.steel);
    rr(c, -80, 0, 160, 240, 34); cel(c, -80, 0, 160, 240, col, { hw: .1 }); rr(c, -80, 0, 160, 240, 34); lnB(c, 6, lit(col, .4));
    rr(c, -70, 30, 140, 120, 8); fill(c, B2.cream); rr(c, -70, 30, 140, 120, 8); lnB(c, 3, B2.ink);   // v19.1: бирка и шрифт крупнее (×1,8)
    const L2 = lab.split(' '); if (L2.length > 1) { tx(c, L2[0], 0, 70, { f: 'U', w: 800, s: 30, c: B2.ink, mw: 124 }); tx(c, L2[1], 0, 110, { f: 'U', w: 800, s: 34, c: B2.ink, mw: 124 }) }
    else tx(c, lab, 0, 90, { f: 'U', w: 800, s: 36, c: B2.ink, mw: 124 });
    rr(c, -12, 240, 24, 34, 6); fill(c, '#2d3142'); c.restore();
  }
  function tank4(c, t) {
    if (t < T4.dive - .2) return;
    // рельс и пакеты (Instagram #054): въезжают слева, качаются
    const kr = eio(at(t, T4.zh - .35, T4.zh + .6));
    if (kr > 0) { c.fillStyle = '#2c3048'; c.fillRect(-600, 120, 2300, 26); c.beginPath(); c.moveTo(-600, 120); c.lineTo(1700, 120); c.moveTo(-600, 146); c.lineTo(1700, 146); lnB(c, 3);
      BAG4.forEach(([lab, col], i) => bag4(c, 160 + i * 190 + (kr - 1) * 1400 + 1500 * ei(at(t, T4.obm + .3, T4.obm + 1.1)), 186, lab, col, t, i)) }
    // кристалл WS-23 падает из центрального пакета
    const kc = at(t, T4.ws - .25, T4.ws + .25); if (kc > 0 && t < T4.ws + .9) { const x = 540, y = 470 + 560 * ei(kc), r = t > T4.ws + .25 ? 0 : 1;
      if (r) { c.save(); c.translate(x, y); c.rotate(t * 4); poly(c, [0, -46, 40, 0, 0, 46, -40, 0]); cel(c, -40, -46, 80, 92, '#dff6ff', { hw: .2 }); poly(c, [0, -46, 40, 0, 0, 46, -40, 0]); lnB(c, 4); c.restore() }
      else { const u = t - T4.ws - .25; for (let j = 0; j < 9; j++) { const a = -Math.PI / 2 + (j - 4) * .3; drop(c, x + Math.cos(a) * 300 * u, 1000 + Math.sin(a) * 420 * u + 900 * u * u, 14, B2.ice, a + Math.PI / 2) } } }
    const kp = bo(at(t, T4.ws - .05, T4.ws + .3)), kpa = 1 - at(t, T4.obm - .5, T4.obm - .05); if (kp > 0 && kpa > 0) { c.save(); c.globalAlpha *= kpa; c.translate(540, 830); c.scale(kp, kp);   // v19.3: плашка гаснет, когда камера уходит вверх (0:49) rr(c, -200, -50, 400, 100, 16); fill(c, B2.ink); rr(c, -200, -50, 400, 100, 16); lnB(c, 4, B2.ice);
      tx(c, 'WS-23', -10, -8, { f: 'U', w: 800, s: 50, c: B2.ice }); tx(c, 'синтетический холодок', 0, 30, { f: 'M', w: 600, s: 22, c: B2.cream }); c.restore() }
    // иней на стенках бака после кристалла
    const kf = eo(at(t, T4.ws + .3, T4.ws + 1.3)); if (kf > 0) [[0, 1], [1080, -1]].forEach(([x, s]) => { c.beginPath(); c.moveTo(x, 1000); for (let i = 0; i <= 10; i++) c.lineTo(x + s * (30 + 26 * H1(i * 3)) * kf, 1000 + i * 80); c.lineTo(x, 1800); c.closePath(); fill(c, 'rgba(223,246,255,.85)') });
    // канал пара к панели
    const kv = at(t, T4.obm - .4, T4.obm + .2); if (kv > 0) { c.beginPath(); c.moveTo(500, 1000); c.lineTo(500, -60); c.moveTo(580, 1000); c.lineTo(580, -60); lnB(c, 5, rgba('#eef1f8', kv));
      for (let i = 0; i < 8; i++) { const u = ((t * .9 + i / 8) % 1); ring(c, 540 + Math.sin(u * 9 + i) * 10, lp(980, -40, u), 18 + 10 * Math.sin(i), rgba('#e0f2fe', .8 * kv * (1 - u)), 4) }
      const kb = eio(at(t, T4.obm - .5, T4.rec + .5)); if (kb > 0 && kb < 1) { const by = lp(980, -700, kb) + 150 * Math.sin(Math.PI * kb), bx = 540 + 8 * Math.sin(t * 7);   // ведущий пузырёк — за ним идёт камера
        circ(c, bx, by, 34, 'rgba(224,242,254,.35)'); ring(c, bx, by, 34, '#ffffff', 5); poly(c, [bx - 10, by - 14, bx + 4, by - 20, bx + 12, by - 6]); fill(c, '#ffffff') } }
    panel4(c, t);
  }
  function panel4(c, t) {
    const k = eo(at(t, T4.obm - .3, T4.obm + .3)); if (k <= 0) return;
    c.save(); c.translate(0, 300 * (1 - k));
    castDots(c, 100, -1560, 880, 1500, 120, { st: 18 });
    rr(c, 100, -1560, 880, 1500, 26); cel(c, 100, -1560, 880, 1500, '#2a2f55', { hw: .03, sw: .1 }); rr(c, 100, -1560, 880, 1500, 26); lnB(c, 5);
    const fz = 1 - at(t, T4.end - .75, T4.end - .45); c.save(); c.globalAlpha *= fz;   // v19.3: перед наездом в снежинку надписи и шкала гаснут — «СПАЗМ» не размазывается (0:53)
    tx(c, 'РЕЦЕПТОРЫ ГОРЛА', 540, -1430, { f: 'U', w: 800, s: 54, c: B2.cream, mw: 780 });
    // шкала спазма: холод → жжение; стрелка уходит в холод, когда ложится лёд
    const sx0 = 190, sx1 = 890, sy = -820; rr(c, sx0, sy - 40, sx1 - sx0, 80, 40); c.save(); c.clip();
    const g = c.createLinearGradient(sx0, 0, sx1, 0); g.addColorStop(0, B2.ice2); g.addColorStop(.5, '#f2d24b'); g.addColorStop(1, B2.red); c.fillStyle = g; c.fillRect(sx0, sy - 40, sx1 - sx0, 80);
    const ki = eo(at(t, T4.gor + .2, T4.led + .5)); if (ki > 0) { c.fillStyle = 'rgba(223,246,255,.62)'; c.fillRect(sx0, sy - 40, (sx1 - sx0) * ki, 80); for (let i = 0; i < 9; i++) if (i / 9 < ki) { c.beginPath(); c.moveTo(sx0 + i * 78, sy - 40); c.lineTo(sx0 + i * 78 + 40, sy + 40); lnB(c, 3, '#ffffff') } }
    c.restore(); rr(c, sx0, sy - 40, sx1 - sx0, 80, 40); lnB(c, 5);
    tx(c, 'СПАЗМ', 540, sy - 90, { f: 'M', w: 800, s: 30, c: '#c9cde0', ls: 4 });
    tx(c, 'ХОЛОД', sx0 + 70, sy + 84, { f: 'M', w: 800, s: 30, c: B2.ice }); tx(c, 'ЖЖЕНИЕ', sx1 - 100, sy + 84, { f: 'U', w: 800, s: 38, c: mixc('#ff8a8a', '#c9cde0', ki * .4) });
    const nv = lp(.9, .12, eio(at(t, T4.led - .2, T4.led + .5))) + .03 * Math.sin(t * 9) * (1 - ki), nx = lp(sx0 + 30, sx1 - 30, nv);
    poly(c, [nx, sy - 52, nx - 22, sy - 92, nx + 22, sy - 92]); fill(c, '#ffffff'); c.restore();
    // лист мяты → поворот на 180° в плоскости → ледяная фреза
    const kr = eio(at(t, T4.rec, T4.gor)), kd = eo(at(t, T4.gor - .1, T4.led - .2));
    c.save(); c.translate(lp(300, sx0 + (sx1 - sx0) * .5, kd), lp(-1150, sy - 260, kd)); c.rotate(Math.PI * kr + t * 6 * at(t, T4.gor, T4.gor + .3) * (1 - at(t, T4.end - .9, T4.end - .6)) + Math.PI * eio(at(t, T4.end - .55, T4.end - .05)));   // v19.1: снежинка поворачивается на 180° (Starbucks #019) и становится диском весов
    if (kr < .5) { c.save(); c.scale(1 - kr * 2 * .6, 1 - kr * 2 * .6); c.beginPath(); c.moveTo(0, -120); c.bezierCurveTo(90, -60, 90, 60, 0, 120); c.bezierCurveTo(-90, 60, -90, -60, 0, -120); c.closePath();
      cel(c, -90, -120, 180, 240, B2.mint, { hw: .12 }); c.beginPath(); c.moveTo(0, -110); c.lineTo(0, 110); for (let i = 1; i < 4; i++) { c.moveTo(0, -80 + i * 45); c.lineTo(50, -110 + i * 45); c.moveTo(0, -80 + i * 45); c.lineTo(-50, -110 + i * 45) } lnB(c, 4, '#2f7d5a'); c.restore() }
    else { const s = (.4 + (kr - .5) * 1.2) * .8; c.scale(s, s); const kt = eio(at(t, T4.end - 1.0, T4.end - .6)); c.beginPath(); for (let i = 0; i < 24; i++) { const a = i * TAU / 24, r = i % 2 ? lp(130, 102, kt) : lp(96, 102, kt); c.lineTo(Math.cos(a) * r, Math.sin(a) * r) } c.closePath(); cel(c, -130, -130, 260, 260, mixc('#dff6ff', B2.ice2, at(t, T4.end - .5, T4.end - .1)), { hw: .12 }); c.beginPath(); for (let i = 0; i < 24; i++) { const a = i * TAU / 24, r = i % 2 ? lp(130, 102, kt) : lp(96, 102, kt); c.lineTo(Math.cos(a) * r, Math.sin(a) * r) } c.closePath(); lnB(c, 4); circ(c, 0, 0, 40, mixc(B2.ice2, '#f5f1e8', at(t, T4.end - .5, T4.end - .1))); const kfl = 1 - at(t, T4.end - .15, T4.end - .02); if (kfl > 0) flake(c, 0, 0, 34 * kfl, '#ffffff', 4) }   // v19.1: зубья фрезы убираются — дальше ровный диск, без «голубой горы»
    c.restore();
    c.restore();
  }
  // ================= блок 5 (53,65–63,9 с): нырок в ледяной круг → весы: 1 картридж = пачка → картридж летит в центр и «разрастается» в одноразку на синем чертеже (Кола #067):
  // лебёдки на цепях, разрез — БАК 13 МЛ, 2 СЕТКИ НАГРЕВА, барабан 5 000 ЗАТЯЖЕК → корпус поворачивается круглым торцом (Кола #003) с точечной тенью,
  // по орбите R 330 загораются все 16 картриджей, плашка «= 16 КАРТРИДЖЕЙ» =================
  let T5 = null, K5 = null; const DEV = { x: 540, y: 1000, w: 300, h: 820 }, ORB = { x: 540, y: 820, r: 330, R: 210 };
  function b5Init() {
    const w = Wd; T5 = { a: T4.end, kart: w('картридж'), zam: w('заменял'), pach: w('пачку'), potom: w('потом', 1), razr: w('разрослись'), t13: w('тринадцать'), dv: w('двойная'), tys: w('тысячи'),
      rot: 61.3, nik: w('никотину'), n16: w('шестнадцать'), k16: w('картриджей'), end: w('чтобы') - .15 };
    T5.wipe = T5.potom - .12;
    K5 = [KY(T5.a, 540, 960, 1), KY(T5.pach + .1, 540, 935, 1.05), KY(T5.pach + .4, 540, 935, 1.05), KY(T5.razr + .3, 540, 980, .9), KY(T5.rot - .1, 540, 960, .94),
      KY(T5.rot + .7, 540, 900, 1.0), KY(T5.k16 + .05, 540, 880, 1.03), KY(T5.k16 + .28, 540, 880, 1.03), KY(T5.end, 540, 875, 1.04)];
  }
  function pack5(c, x, y) {   // пачка 20 сигарет
    rr(c, x - 80, y - 200, 160, 200, 10); cel(c, x - 80, y - 200, 160, 200, '#f5f1e8', { hw: .08 }); c.fillStyle = B2.red; c.fillRect(x - 80, y - 200, 160, 70);
    rr(c, x - 80, y - 200, 160, 200, 10); lnB(c, 4, B2.ink); for (let i = 0; i < 5; i++) { rr(c, x - 64 + i * 26, y - 240, 22, 50, 6); fill(c, i % 2 ? '#f5f1e8' : '#e9a65d'); lnB(c, 3, B2.ink) }
    tx(c, '20', x, y - 80, { f: 'U', w: 800, s: 56, c: B2.ink });
  }
  function cart5(c, x, y, s = 1) {   // картридж «Джула»
    c.save(); c.translate(x, y); c.scale(s, s); rr(c, -34, -150, 68, 150, 14); cel(c, -34, -150, 68, 150, B2.mango, { hw: .14 }); rr(c, -34, -150, 68, 50, 14); fill(c, '#2d3142'); rr(c, -34, -150, 68, 150, 14); lnB(c, 4, B2.ink); c.restore();
  }
  function scale5(c, t) {   // весы: перевес у пачки → ровно, «=»
    const kin = spr(at(t, T5.a + .05, T5.a + .55));   // v19.1: диск весов — это круг снежинки из блока 4, он уже на месте; весы вырастают на нём
    const th = lp(.24, 0, spr(at(t, T5.zam - .1, T5.pach + .2))), L = 300;
    circ(c, 540, 900, 430, '#f5f1e8'); grain(c, 110, 470, 860, 860, .1); ring(c, 540, 900, 430, B2.ln, 4); if (kin <= 0) return;
    c.save(); c.translate(540, 1330); c.scale(kin, kin); c.translate(-540, -1330);
    c.beginPath(); c.moveTo(540, 1330); c.lineTo(540, 660); c.moveTo(420, 1330); c.lineTo(660, 1330); lnB(c, 8, B2.ink);
    const ex = L * Math.cos(th), ey = L * Math.sin(th);
    c.beginPath(); c.moveTo(540 - ex, 660 - ey); c.lineTo(540 + ex, 660 + ey); lnB(c, 10, B2.ink); circ(c, 540, 660, 16, B2.red);
    [[-1, 'cart'], [1, 'pack']].forEach(([s, what]) => { const px = 540 + s * ex, py = 660 + s * ey; c.beginPath(); c.moveTo(px, py); c.lineTo(px - 90, py + 230); c.moveTo(px, py); c.lineTo(px + 90, py + 230); lnB(c, 4, B2.ink);
      c.beginPath(); c.ellipse(px, py + 236, 120, 22, 0, 0, TAU); fill(c, B2.steel); lnB(c, 4, B2.ink);
      if (what === 'pack') pack5(c, px, py + 226); else if (t < T5.wipe - .12) cart5(c, px, py + 226) });   // v19.2: на перевороте диска картридж уже снят с чаши (его рисует device5)
    const ke = bo(at(t, T5.pach - .05, T5.pach + .25)); if (ke > 0) { c.save(); c.translate(540, 760); c.scale(ke, ke); tx(c, '=', 0, 0, { f: 'U', w: 800, s: 130, c: B2.red }); c.restore() }
    tx(c, '1 КАРТРИДЖ', 540 - ex, 660 - ey + 330, { f: 'M', w: 800, s: 30, c: B2.ink }); tx(c, '20 СИГАРЕТ', 540 + ex, 660 + ey + 330, { f: 'M', w: 800, s: 30, c: B2.ink });
    c.restore();
  }
  function cranes5(c, t) {   // балка с лебёдками и паллетами одноразок (#067)
    c.fillStyle = '#f2b84b'; c.fillRect(-400, 230, 1900, 48); c.save(); c.beginPath(); c.rect(-400, 230, 1900, 48); c.clip(); for (let i = 0; i < 50; i++) { poly(c, [-400 + i * 60, 278, -370 + i * 60, 278, -340 + i * 60, 230, -370 + i * 60, 230]); fill(c, B2.ink) } c.restore();
    for (let j = 0; j < 3; j++) { const x = -250 + ((t - T5.wipe) * 150 + j * 560) % 1680, sw = Math.sin(t * 2 + j) * 8;
      c.fillStyle = '#2c3048'; c.fillRect(x - 40, 274, 80, 34); for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(x - 30 + sw * i / 4, 330 + i * 30, 6, 13, 0, 0, TAU); c.ellipse(x + 30 + sw * i / 4, 330 + i * 30, 6, 13, 0, 0, TAU); lnB(c, 4, B2.steel) }
      c.save(); c.translate(x + sw, 450); rr(c, -90, 0, 180, 20, 4); fill(c, '#8a6a4a'); for (let i = 0; i < 5; i++) { rr(c, -80 + i * 34, -60, 26, 60, 8); fill(c, [B2.mango, B2.ice2, B2.teal, B2.coral, '#b65bd6'][(i + j) % 5]); lnB(c, 2) } c.restore() }
  }
  function blueprint5(c, t, q) {
    const v = viewRect(q); c.fillStyle = B2.bp; c.fillRect(v.x0 - 10, v.y0 - 10, v.x1 - v.x0 + 20, v.y1 - v.y0 + 20);
    c.beginPath(); for (let x = Math.floor(v.x0 / 60) * 60; x < v.x1; x += 60) { c.moveTo(x, v.y0); c.lineTo(x, v.y1) } for (let y = Math.floor(v.y0 / 60) * 60; y < v.y1; y += 60) { c.moveTo(v.x0, y); c.lineTo(v.x1, y) } lnB(c, 1.5, 'rgba(255,255,255,.12)');
  }
  function device5(c, t) {   // одноразка в разрезе; k — поворот торцом (0 — сбоку, 1 — торец круг R 210)
    const kg = t < T5.wipe ? 0 : spr(at(t, T5.razr - .45, T5.razr + .4)), km = eio(at(t, T5.wipe - .12, T5.wipe + .38)), kr = eio(at(t, T5.rot, T5.rot + .7));   // v19.2: картридж слетает с чаши вместе с переворотом диска
    const s = lp(km < .5 ? .2 : lp(.2, .35, (km - .5) * 2), 1, kg), cx = lp(lp(540 - 300, 540, km), ORB.x, kr), cy0 = lp(lp(805, DEV.y, km), ORB.y, kr) - 90 * Math.sin(Math.PI * km);   // v19.2: в момент смены картридж → корпус одного размера; подскок дугой
    const w = lp(DEV.w * s, ORB.R * 2, kr), hl = DEV.h * s / 2 * Math.cos(kr * Math.PI / 2), ry = ORB.R * Math.sin(kr * Math.PI / 2) + w * .12 * (1 - kr), top = cy0 - hl;
    if (km < .5) { cart5(c, cx, cy0 + 75, 1); return { cx, top: cy0 - 75, s } }   // пока шторка не прошла — это ещё картридж с весов
    if (kr > .3) castCirc(c, cx, cy0, ORB.R * Math.min(1, kr * 1.2), 520 * at(kr, .3, 1), { st: 17 });
    // корпус
    c.beginPath(); c.moveTo(cx - w / 2, top); c.lineTo(cx - w / 2, cy0 + hl); c.ellipse(cx, cy0 + hl, w / 2, ry, 0, Math.PI, 0, true); c.lineTo(cx + w / 2, top); c.closePath();
    cel(c, cx - w / 2, top - 10, w, hl * 2 + ry + 20, kr > .02 ? B2.ind : 'rgba(255,255,255,.07)', { hw: .08 }); c.beginPath(); c.moveTo(cx - w / 2, top); c.lineTo(cx - w / 2, cy0 + hl); c.ellipse(cx, cy0 + hl, w / 2, ry, 0, Math.PI, 0, true); c.lineTo(cx + w / 2, top); lnB(c, 5);
    if (kr < .5 && s > .5) {   // разрез: бак, спирали, батарея
      const a = 1 - kr * 2, x0 = cx - w / 2 + 26, ww = w - 52, yT = top + 70 * s, hT = DEV.h * s * .5;
      c.save(); c.globalAlpha *= a;
      rr(c, x0, yT, ww, hT, 18); lnB(c, 4, '#bfe0ff'); const kl = eo(at(t, T5.t13 - .1, T5.t13 + .7)); if (kl > 0) { c.save(); rr(c, x0, yT, ww, hT, 18); c.clip(); liquid2(c, x0, x0 + ww, yT + hT * (1 - .9 * kl), 10, t, yT + hT + 10); c.restore() }
      const kh = at(t, T5.dv - .1, T5.dv + .3), heat = kh * (.8 + .2 * Math.sin(t * 14)); [cx - ww * .22, cx + ww * .22].forEach(xx => { c.beginPath(); for (let i = 0; i <= 24; i++) { const y = yT + hT + 30 + i * 8; c.lineTo(xx + (i % 2 ? 22 : -22), y) } lnB(c, 6, mixc('#bfe0ff', '#ff7a3d', heat)); if (heat > 0) glow(c, xx, yT + hT + 130, 90, '#ff7a3d', .45 * heat) });
      rr(c, x0, yT + hT + 250 * s, ww, DEV.h * s * .22, 12); lnB(c, 4, '#bfe0ff'); tx(c, '+', cx, yT + hT + 250 * s + DEV.h * s * .11, { f: 'U', w: 800, s: 44, c: '#bfe0ff' });
      c.restore();
    }
    // торец: кольца мундштука
    if (kr > 0) { c.beginPath(); c.ellipse(cx, top, w / 2, Math.max(1, ry), 0, 0, TAU); cel(c, cx - w / 2, top - ry, w, ry * 2, lit(B2.ind, .25), { hw: .1 }); c.beginPath(); c.ellipse(cx, top, w / 2, Math.max(1, ry), 0, 0, TAU); lnB(c, 5);
      c.beginPath(); c.ellipse(cx, top, w / 2 * .55, ry * .55, 0, 0, TAU); fill(c, '#2d3142'); lnB(c, 4); c.beginPath(); c.ellipse(cx, top, w / 2 * .2, ry * .2, 0, 0, TAU); fill(c, B2.mango) }
    else { rr(c, cx - w * .3, top - 60 * s, w * .6, 70 * s, 14 * s); cel(c, cx - w * .3, top - 60 * s, w * .6, 70 * s, '#2d3142', { hw: .1 }); rr(c, cx - w * .3, top - 60 * s, w * .6, 70 * s, 14 * s); lnB(c, 4) }
    return { cx, top, s };
  }
  function callouts5(c, t) {   // выноски: бак, спирали, барабан
    const out = ei(at(t, T5.rot - .15, T5.rot + .2)); if (out >= 1) return;   // v19.3: выноски уходят позже — «5 000» успевают прочитать
    const L = (k, x0, y0, x1, y1, lab1, lab2, al = 'right') => { if (k <= 0) return; c.save(); c.translate(-500 * out * (al === 'right' ? 1 : -1), 0);
      c.beginPath(); c.moveTo(x0, y0); c.lineTo(lp(x0, x1, eo(k)), lp(y0, y1, eo(k))); lnB(c, 4, '#ffffff'); circ(c, x0, y0, 9, '#ffffff');
      const kb = bo(at(k, .4, 1)); if (kb > 0) { c.save(); c.translate(x1, y1); c.scale(kb, kb); tx(c, lab1, 0, -20, { f: 'U', w: 800, s: 44, c: '#ffffff' }); if (lab2) tx(c, lab2, 0, 26, { f: 'M', w: 800, s: 28, c: '#bfe0ff' }); c.restore() } c.restore() };
    L(at(t, T5.t13 - .2, T5.t13 + .6), 470, 760, 200, 640, '13 МЛ', 'БАК', 'left');
    L(at(t, T5.dv - .2, T5.dv + .6), 470, 1150, 190, 1080, '2 СЕТКИ', 'НАГРЕВА', 'left');
    const kd = at(t, T5.tys - .25, T5.tys + .5); if (kd > 0) { c.save(); c.translate(500 * out, 0); const x = 860, y = 1120, sb = bo(at(kd, 0, .5)); c.translate(x, y); c.scale(sb, sb);
      rr(c, -150, -70, 300, 140, 16); fill(c, B2.ink); rr(c, -150, -70, 300, 140, 16); lnB(c, 4); const v = Math.round(5000 * eo(at(Math.round(t * 30) / 30, T5.tys - .05, T5.tys + .45)) / 10) * 10;   // по кадру — без двоения цифр; v19.3: до 5 000 за полсекунды (было — уходил на «110»)
      c.save(); rr(c, -130, -52, 260, 92, 10); c.clip(); num(c, (v >= 1000 ? Math.floor(v / 1000) + ' ' + String(v % 1000).padStart(3, '0') : String(v)), 0, -6, { f: 'J', w: 700, s: 66, c: '#7ee787' }); c.restore();
      tx(c, 'ЗАТЯЖЕК', 0, 100, { f: 'U', w: 800, s: 34, c: '#ffffff' }); c.restore() }
  }
  function orbit16(c, t) {
    const k0 = at(t, T5.rot + .35, T5.rot + .7); if (k0 <= 0) return;
    for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i * TAU / 16, tl = lp(T5.nik + .1, T5.k16 - .2, i / 15), kl = spr(at(t, tl, tl + .35)), x = ORB.x + Math.cos(a) * ORB.r * lp(.7, 1, eo(k0)), y = ORB.y + Math.sin(a) * ORB.r * lp(.7, 1, eo(k0));
      c.save(); c.translate(x, y); c.rotate(a + Math.PI / 2); c.globalAlpha *= cl(k0 * 2); const s = .62 * (1 + .25 * Math.max(0, kl - 1 + 1) * (t < tl + .35 ? 1 : 0) * 0);
      if (kl > 0) { glow(c, 0, -60, 80, '#f6a03a', .35 * cl(kl)); cart5(c, 0, 20, s * lp(.85, 1, cl(kl))) } else { c.setLineDash([10, 8]); rr(c, -21, -73, 42, 93, 9); lnB(c, 3, 'rgba(255,255,255,.55)'); c.setLineDash([]) }
      c.restore() }
    const kp = bo(at(t, T5.k16 - .05, T5.k16 + .3)); if (kp > 0) plate(c, '= 16 КАРТРИДЖЕЙ', 540, 1330, kp, { s: 46, bg: B2.mango, c: B2.ink });
  }
  function b5World(c, t, q) {   // v19.2 (отзыв 17.11: «переход уебищный» — косая шторка): белый диск весов честно переворачивается (#019, формула Андрея «медальон поворачивается»),
    // на обороте — синий чертёж; диск разрастается до краёв кадра, в нём уже балка с лебёдками; картридж в это время слетает с чаши в центр
    c.fillStyle = B2.ice2; c.fillRect(-2000, -2000, 5000, 6000);
    const kf = eio(at(t, T5.wipe - .12, T5.wipe + .3)), kd = eio(at(t, T5.wipe + .2, T5.wipe + .75)), v = viewRect(q);
    const Rend = Math.max(...[[v.x0, v.y0], [v.x1, v.y0], [v.x0, v.y1], [v.x1, v.y1]].map(([x, y]) => Math.hypot(x - 540, y - 900))) + 60, R = 430 * Math.pow(Rend / 430, kd);
    if (kf < .5) { const sx = Math.max(.002, Math.cos(Math.PI * kf)); c.save(); c.translate(540, 0); c.scale(sx, 1); c.translate(-540, 0); scale5(c, t); c.restore() }   // лицо диска: весы
    else if (kd < 1) { const sx = Math.max(.002, -Math.cos(Math.PI * kf));   // оборот диска: синий чертёж; потом диск растёт до кадра
      c.save(); c.beginPath(); c.ellipse(540, 900, R * sx, R, 0, 0, TAU); c.clip(); blueprint5(c, t, q); cranes5(c, t); c.restore();
      c.beginPath(); c.ellipse(540, 900, R * sx, R, 0, 0, TAU); lnB(c, 5, B2.ln) }
    else { blueprint5(c, t, q); cranes5(c, t) }
    if (t > T5.wipe - .12) { device5(c, t); callouts5(c, t); orbit16(c, t) }
  }
  function b5Shot(c, t) {
    if (!T5) b5Init(); const q = camObj(camAt(K5, t)); c.save(); c.translate(540, 960); c.rotate(q.r); c.scale(q.z, q.z); c.translate(-q.x, -q.y); b5World(c, t, q); c.restore();
  }
  // ================= блок 6 (63,9–75,5 с): торец опускается и становится белым холмом (Кола #009), растут 3 стебля табака →
  // красный круг БЕЗ ТАБАКА, листья осыпаются, центральный бутон вспыхивает колбой-лампочкой с кипящим золотым никотином →
  // 5-витковый змеевик (Кола #010), камера за каплей вниз: розлив одноразок → фиолетовая касса (Starbucks #012) $3 000 000 000 В ГОД → сзади растут башни корпораций =================
  let T6 = null, K6 = null; const HILL = { y: 1560, rx: 760, ry: 300 }, BULB = { x: 540, y: 640, r: 120 }, REG6 = { x: 540, y: 3300 };
  const STEM = [[390, 930, -1], [540, 760, 0], [700, 950, 1]];
  let PATH6 = null;
  function b6Init() {
    const w = Wd; T6 = { a: T5.end, obo: w('обойти'), var: w('варить'), prob: w('пробирке'), bez: w('без'), list: w('листа'), tab: w('табака'),
      kogda: w('когда'), mlrd: w('миллиарды'), doll: w('долларов'), god: w('год', 1), rynok: w('рынок'), star: w('старые'), corp: w('корпорации'), end: K.s8 - .57 };
    K6 = [KY(T6.a, 540, 875, 1.04), KY(T6.a + 1.1, 540, 1080, .92), KY(T6.prob, 540, 1000, .98), KY(T6.tab + .2, 545, 980, 1.0), KY(T6.kogda, 560, 900, 1.0),
      KY(T6.kogda + .9, 720, 1200, 1.08), KY(T6.mlrd - .3, 700, 1950, 1.0), KY(T6.mlrd + .4, 560, 3020, 1.0), KY(T6.rynok - .1, 545, 3020, 1.0), KY(T6.corp + .2, 540, 3000, .82), KY(T6.end, 540, 2995, .8)];
    // путь капли: из горлышка колбы вверх, вправо, 5 витков вниз, к соплу над конвейером
    PATH6 = []; const P = PATH6; P.push([540, 505], [540, 410]); for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; P.push([700 + Math.cos(a) * 160, 410 + Math.sin(a) * 160]) }
    for (let i = 1; i <= 200; i++) { const u = i / 200; P.push([860 + 80 * Math.sin(u * 5 * TAU), 410 + u * 1380]) } P.push([860, 1900]);
    let L = 0; P[0][2] = 0; for (let i = 1; i < P.length; i++) { L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); P[i][2] = L } PATH6.L = L;
  }
  function pathAt(u) { const P = PATH6, d = u * P.L; let i = 1; while (i < P.length - 1 && P[i][2] < d) i++; const a = P[i - 1], b = P[i], k = (d - a[2]) / Math.max(1e-6, b[2] - a[2]); return [lp(a[0], b[0], k), lp(a[1], b[1], k)] }
  function pathStroke(c, u0, u1) { const P = PATH6; c.beginPath(); let st = false; for (const p of P) { const u = p[2] / P.L; if (u < u0 || u > u1) continue; if (!st) { c.moveTo(p[0], p[1]); st = true } else c.lineTo(p[0], p[1]) } }
  function hill6(c, t) {   // торец-круг → белый холм; v19.3 (Gemini, 1:04 — «фиолетовая шляпа»): земля лежит внизу с самого начала,
    // круг за 0,15 с светлеет до цвета земли, тёмная середина и точки исчезают, круг опускается на землю и расплывается холмом
    const k = eio(at(t, T6.a, T6.a + 1.1)), cx = 540, cy = lp(ORB.y, HILL.y, k)
    , rx = lp(ORB.R, HILL.rx, k), ry = lp(ORB.R, HILL.ry, k), col = mixc(lit(B2.ind, .25), B2.cream, ss(0, .15, k)), G0 = HILL.y + 600 * (1 - ss(0, .7, k)), G1 = G0 + 400;   // земля поднимается из-под кадра и встречает круг
    if (k < .1) castCirc(c, cx, cy, rx, 520 * (1 - k / .1), { st: 17 });
    c.fillStyle = B2.cream; c.fillRect(-1900, G0, 4900, G1 - G0);
    c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, TAU); fill(c, col);
    c.save(); c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, TAU); c.rect(-1900, G0, 4900, G1 - G0); c.clip(); grain(c, -1900, cy - ry - 10, 4900, G1 - cy + ry + 10, .12 * Math.max(k, .3)); c.fillStyle = 'rgba(20,23,51,.12)'; c.fillRect(cx + rx * .45, cy - ry, 2400, 1200); c.restore();
    c.beginPath(); c.moveTo(-1900, G1); c.lineTo(3000, G1); lnB(c, 5);
    c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, Math.PI, 0); lnB(c, 5);
    if (k < .1) { c.save(); c.globalAlpha *= 1 - k / .1; c.beginPath(); c.ellipse(cx, cy, rx * .55, ry * .55, 0, 0, TAU); fill(c, '#2d3142'); lnB(c, 4); c.beginPath(); c.ellipse(cx, cy, rx * .2, ry * .2, 0, 0, TAU); fill(c, B2.mango); c.restore() }   // как торец в блоке 5 — стык без скачка
    const kn = at(t, T6.corp - .9, T6.corp - .2); if (kn > 0) { c.fillStyle = rgba(B2.navy, kn); c.fillRect(-1950, cy - ry - 20, 5000, ry + 470) }   // v19.3: к «корпорациям» полоса земли вверху кадра уходит в ночь — на шторке 1:16 нет светлой стены
  }
  const hillTop = x => HILL.y - HILL.ry * Math.sqrt(Math.max(0, 1 - Math.pow((x - 540) / HILL.rx, 2)));
  function leaf(c, x, y, s, a, col = B2.mint) { c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(30, -40, 110, -40, 140, 0); c.bezierCurveTo(110, 30, 30, 30, 0, 0); c.closePath(); cel(c, 0, -40, 140, 70, col, { hw: .1, sw: .35 }); c.beginPath(); c.moveTo(4, 0); c.lineTo(130, 0); lnB(c, 3, '#2f7d5a'); c.restore() }
  function stems6(c, t) {
    STEM.forEach(([x, ty, side], i) => {
      const t0 = Math.max(T6.obo - .2, T6.a + 1.0) + i * .15, kg = eo(at(t, t0, t0 + 1.0)); if (kg <= 0) return;
      const by = hillTop(x), yy = lp(by, ty, kg), bend = side * 40;
      c.beginPath(); c.moveTo(x, by); c.quadraticCurveTo(x + bend, (by + yy) / 2, x, yy); lnB(c, 7, B2.cream);
      // листья: на «листа табака» отрываются и падают
      const kf = at(t, T6.list - .15, T6.tab + .9);
      for (let j = 0; j < 3; j++) { const ly = lp(by, yy, .3 + j * .2), s = .8 * eo(at(kg, .3 + j * .15, .7 + j * .1)), sd = j % 2 ? 1 : -1; if (s <= 0) continue;
        const d = Math.max(0, kf * 1.6 - j * .2), fx = sd * 120 * d, fy = 900 * d * d, ra = sd * 2.5 * d; leaf(c, x + fx, ly + fy, s, (sd > 0 ? -.35 : Math.PI + .35) + ra, d > 0 ? mixc(B2.mint, '#b7a24b', cl(d)) : B2.mint) }
      if (i !== 1) { const kb = spr(at(t, T6.var - .1 + i * .1, T6.var + .4 + i * .1)); if (kb > 0) { circ(c, x, yy - 10, 26 * kb, B2.coral); ring(c, x, yy - 10, 26 * kb, B2.ln, 3) } }
    });
  }
  function bulb6(c, t) {   // центральный бутон → колба-лампочка с кипящим золотым никотином
    const kb = spr(at(t, T6.var - .1, T6.var + .4)), kv = spr(at(t, T6.prob - .1, T6.prob + .5)); if (kb <= 0) return;
    const r = lp(26 * kb, BULB.r, kv), cy = lp(STEM[1][1] - 10, BULB.y, kv), x = BULB.x;
    if (kv > 0) { glow(c, x, cy, r * 2.6, '#ffd45e', .35 * cl(kv)); c.save(); c.translate(x, cy + r * .9); c.scale(kv, kv); rr(c, -38, 0, 76, 70, 8); cel(c, -38, 0, 76, 70, B2.steel, { hw: .14 }); for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-38, 18 + i * 18); c.lineTo(38, 12 + i * 18); lnB(c, 3, B2.ink) } c.restore() }
    c.beginPath(); c.arc(x, cy, r, 0, TAU); c.save(); c.clip(); c.fillStyle = kv > 0 ? 'rgba(220,240,255,.25)' : B2.coral; c.fillRect(x - r, cy - r, r * 2, r * 2);
    if (kv > 0) { const lv = cy - r * .2 + Math.sin(t * 9) * 4; c.fillStyle = '#f2b84b'; c.beginPath(); c.moveTo(x - r, cy + r); for (let i = 0; i <= 20; i++) { const xx = x - r + i * r / 10; c.lineTo(xx, lv + 8 * Math.sin(i * 1.3 + t * 12)) } c.lineTo(x + r, cy + r); c.closePath(); c.fill();
      for (let i = 0; i < 9; i++) { const u = (t * 1.4 + i / 9) % 1; ring(c, x - r * .6 + H1(i) * r * 1.2, lp(cy + r * .8, lv, u), 5 + 6 * H1(i * 3), '#fff4cc', 3) } glint(c, x - r, cy - r, r * 2, r * 2, .25) }
    c.restore(); c.beginPath(); c.arc(x, cy, r, 0, TAU); lnB(c, 5);
    if (kv > .5) { c.beginPath(); c.moveTo(x - 18, cy + r - 6); c.lineTo(x - 8, cy + 10); c.lineTo(x, cy + 30); c.lineTo(x + 8, cy + 10); c.lineTo(x + 18, cy + r - 6); lnB(c, 4, '#ffffff') }
  }
  function noTob6(c, t) {   // красный круг БЕЗ ТАБАКА — целиком в кадре
    const ko = ei(at(t, T6.kogda - .15, T6.kogda + .2)), k = spr(at(t, T6.bez - .1, T6.bez + .45)) * (1 - ko); if (k <= 0) return;   // v19.3: знак сжимается до того, как камера срежет его краем (1:10)
    c.save(); c.translate(230, 610); c.scale(k, k); c.rotate(-.06);
    circ(c, 0, 0, 130, '#f5f1e8'); leaf(c, -70, 10, .95, -.2, '#6b8f4e'); ring(c, 0, 0, 118, B2.red, 22); c.beginPath(); c.moveTo(-82, -82); c.lineTo(82, 82); lnB(c, 22, B2.red);
    plate(c, 'БЕЗ ТАБАКА', 0, 182, 1, { s: 32, bg: B2.red, c: '#fff' }); c.restore();
  }
  function coil6(c, t) {   // змеевик: трубка контуром, золото бежит каплей
    const kc = eo(at(t, T6.kogda - .5, T6.kogda + .3)); if (kc <= 0) return;
    pathStroke(c, 0, kc); lnB(c, 22, B2.ln); pathStroke(c, 0, kc); lnB(c, 14, B2.navy);
    const ud = eio(at(t, T6.kogda, T6.mlrd - .15)); if (ud > 0) { pathStroke(c, 0, ud); lnB(c, 10, '#f2b84b'); const [dx, dy] = pathAt(ud); circ(c, dx, dy, 15, '#f2b84b'); ring(c, dx, dy, 15, '#fff4cc', 3) }
    c.fillStyle = '#2c3048'; c.fillRect(820, 1890, 80, 50); poly(c, [830, 1940, 890, 1940, 872, 1975, 848, 1975]); fill(c, B2.steel);
  }
  function conveyor6(c, t) {
    if (t < T6.kogda) return; const y = 2120;
    c.beginPath(); c.moveTo(80, y); c.lineTo(1100, y); lnB(c, 10, B2.ln); for (let x = 120; x < 1100; x += 110) { circ(c, x, y + 36, 24, '#3a3f66'); ring(c, x, y + 36, 24, B2.ln, 3) }
    for (let i = 0; i < 8; i++) { const x = 60 + ((t - T6.kogda) * 160 + i * 150) % 1200, fil = x > 860 ? 1 : 0;
      rr(c, x - 28, y - 130, 56, 130, 14); cel(c, x - 28, y - 130, 56, 130, B2.ind, { hw: .14 }); if (fil) { rr(c, x - 18, y - 100, 36, 60, 8); fill(c, '#f2b84b') } rr(c, x - 28, y - 130, 56, 130, 14); lnB(c, 3) }
    if (t > T6.mlrd - .3) for (let i = 0; i < 3; i++) { const u = (t * 2 + i / 3) % 1; drop(c, 860, lp(1985, 2000, 0) + u * 80, 9, '#f2b84b') }
  }
  function towers6(c, t) {   // башни табачных корпораций растут сзади
    [[-40, 900, 220, 0], [150, 1050, 200, 'ALTRIA'], [930, 1000, 210, 'BAT'], [1120, 850, 220, 0], [545, 1080, 300, 0]].forEach(([x, h, w, lab], i) => {
      const k = spr(at(t, T6.rynok + i * .14, T6.rynok + .7 + i * .14)); if (k <= 0) return; const g = 3560, top = g - h * k;
      rr(c, x - w / 2, top, w, g - top, 4); cel(c, x - w / 2, top, w, g - top, i % 2 ? '#3d3f6e' : '#34376a', { hw: .06, sw: .3 }); rr(c, x - w / 2, top, w, g - top, 4); lnB(c, 3);
      for (let r = 0; r < Math.floor(h * k / 70); r++) for (let q = 0; q < Math.floor((w - 30) / 40); q++) if (H1(i * 31 + r * 7 + q) < .45) { c.fillStyle = H1(r + q * 3 + i) > .5 ? '#f4a261' : '#fde68a'; c.fillRect(x - w / 2 + 20 + q * 40, top + 40 + r * 70, 18, 28) }
      if (lab) { const kl = bo(at(t, T6.star + i * .1, T6.star + .4 + i * .1)); if (kl > 0) plate(c, lab, x, top - 50, kl, { s: 34, bg: B2.gold, c: B2.ink }) }
    });
  }
  function register6(c, t) {   // касса (Starbucks #012): фиолетовый корпус контуром, табло, чек лентой
    const k = spr(at(t, T6.mlrd - .5, T6.mlrd + .1)); if (k <= 0) return;
    const { x, y } = REG6; c.save(); c.translate(x, y); c.scale(k, k);
    castDots(c, -300, -80, 600, 300, 160, { st: 16 });
    poly(c, [-300, 220, 300, 220, 250, -80, -250, -80]); cel(c, -300, -80, 600, 300, B2.ind, { hw: .06 }); poly(c, [-300, 220, 300, 220, 250, -80, -250, -80]); lnB(c, 5);
    for (let r = 0; r < 2; r++) for (let q = 0; q < 5; q++) { rr(c, -200 + q * 82, -40 + r * 76, 60, 50, 10); fill(c, '#e9e3ff'); lnB(c, 3, B2.ink) }
    c.beginPath(); c.moveTo(-40, -80); c.lineTo(-40, -170); c.moveTo(40, -80); c.lineTo(40, -170); lnB(c, 16, '#3b3166');
    rr(c, -360, -400, 720, 240, 26); fill(c, B2.ink); rr(c, -360, -400, 720, 240, 26); lnB(c, 6);
    const v = 3e9 * eio(at(Math.round(t * 30) / 30, T6.mlrd, T6.doll + .4)); c.save(); rr(c, -340, -380, 680, 150, 16); c.clip(); num(c, '$' + fmt3(Math.round(v / 1e7) * 1e7), 0, -306, { f: 'J', w: 700, s: 60, c: '#7ee787' }); c.restore();   // по кадру — без двоения цифр
    const kg = bo(at(t, T6.god - .1, T6.god + .3)); if (kg > 0) { c.save(); c.translate(0, -200); c.scale(kg, kg); tx(c, 'В ГОД', 0, 0, { f: 'U', w: 800, s: 40, c: B2.gold }); c.restore() }
    const kt = eo(at(t, T6.mlrd, T6.corp)); if (kt > 0) {   // v19.1: чек — бумажная лента из щели кассы (Starbucks #012), а не кривая палка
      const L = 460 * kt; c.save(); c.translate(258, 30); c.rotate(-.42); rr(c, -6, -10, 12, 20, 4); fill(c, '#2d3142');
      c.beginPath(); c.moveTo(0, 0); c.lineTo(78, 0); c.lineTo(78, L); for (let i = 0; i <= 6; i++) c.lineTo(78 - i * 13, L + (i % 2 ? 10 : 0)); c.closePath(); cel(c, 0, 0, 78, L + 10, B2.cream, { hw: .08, sw: .2 }); c.beginPath(); c.moveTo(0, 0); c.lineTo(78, 0); c.lineTo(78, L); for (let i = 0; i <= 6; i++) c.lineTo(78 - i * 13, L + (i % 2 ? 10 : 0)); c.closePath(); lnB(c, 3, B2.ink);
      for (let y = 30; y < L - 20; y += 34) { c.fillStyle = '#9aa3b5'; c.fillRect(12, y, 54 - (y / 34 % 3) * 10, 6) } c.restore() }
    c.restore();
  }
  const fmt3 = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  function b6World(c, t, q) {
    const kw = eio(at(t, T6.a, T6.a + .6)), v = viewRect(q);
    c.fillStyle = B2.navy; c.fillRect(v.x0 - 10, v.y0 - 10, v.x1 - v.x0 + 20, v.y1 - v.y0 + 20);
    if (kw < 1) { c.save(); const X = lp(v.x1 + 1000, v.x0 - 60, kw); poly(c, [v.x0 - 50, v.y0 - 50, X, v.y0 - 50, X - 900, v.y1 + 50, v.x0 - 50, v.y1 + 50]); c.clip(); blueprint5(c, t, q); cranes5(c, t); c.restore() }   // v19.3: балка с лебёдками уходит вместе с чертежом, не пропадает на стыке
    for (let i = 0; i < 30; i++) circ(c, -300 + H1(i * 4.4) * 1700, -200 + H1(i * 6.6) * 1300, 2 + H1(i) * 2, rgba('#e2e8f0', .3 + .2 * Math.sin(t * 1.7 + i)));
    towers6(c, t);
    if (t < T6.a + .5) orbitOut(c, t);
    hill6(c, t); stems6(c, t); coil6(c, t); bulb6(c, t); noTob6(c, t); conveyor6(c, t); register6(c, t);
  }
  function orbitOut(c, t) { const k = ei(at(t, T6.a, T6.a + .5)); for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i * TAU / 16, R = ORB.r + 1200 * k; c.save(); c.translate(ORB.x + Math.cos(a) * R, ORB.y + Math.sin(a) * R); c.rotate(a + Math.PI / 2); cart5(c, 0, 20, .62); c.restore() } plate(c, '= 16 КАРТРИДЖЕЙ', 540, 1330 + 900 * k, 1, { s: 46, bg: B2.mango, c: B2.ink }) }
  let COIN6 = 0;
  function b6Shot(c, t) {
    if (!T6) b6Init(); const q = camObj(camAt(K6, t)); c.save(); c.translate(540, 960); c.rotate(q.r); c.scale(q.z, q.z); c.translate(-q.x, -q.y); b6World(c, t, q); c.restore();
    const kc = bo(at(t, T6.end - .35, T6.end)); if (kc > 0) { const y = lp(1180, 850, eo(at(t, T6.end - .35, T6.end))); circ(c, 540, y, 36 * kc, '#f59e0b'); ring(c, 540, y, 27 * kc, '#b45309', 4) }   // монета выпрыгивает из кассы — дальше её ведёт сцена 8 в Луну
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
  // v19.1: вместо общежития — неоновая витрина «ЛАЗЕЙКА» в инее (3 слоя: задняя стенка с инеем, подставки под софитами, стекло с бликами).
  // «Запретом хотели отнять вкус» — витрина пустая, крест-накрест красная лента ЗАПРЕТ ВКУСОВ; «а подарили» — лента рвётся, софиты зажигаются по одному:
  // ледяной кристалл WS-23 в замёрзшей колбе → прозрачный мега-бак 13 мл с двойной спиралью (Да Винчи #067) → пробирка с золотой каплей (Instagram #055).
  const VIT = { x0: 170, x1: 1030, y0: 470, y1: 1330 }, VC = [315, 600, 885];
  let W8 = null;
  function w8() { if (W8) return W8; const w = Wd; W8 = { vk: w('вкус'), pod: w('подарили'), led: w('ледяной'), gig: w('гигантские'), nik: w('никотин', 2) }; return W8 }
  function frostCorners(c, x, y, w, h, fr) { c.save(); rr(c, x, y, w, h, 8); c.clip(); [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([qx, qy], j) => { c.save(); c.translate(qx, qy); c.rotate(j === 1 ? Math.PI / 2 : j === 2 ? -Math.PI / 2 : j === 3 ? Math.PI : 0); poly(c, [0, 0, fr, 0, fr * .62, fr * .22, fr * .4, fr * .4, fr * .22, fr * .62, 0, fr]); fill(c, 'rgba(217,243,251,.85)'); c.restore() }); c.restore() }
  function item8(c, i, t, k) {   // три улики
    const cx = VC[i], g = 1130;
    c.save(); c.translate(cx, g); c.scale(k, k);
    if (i === 0) {   // замёрзшая колба, внутри ледяной кристалл
      poly(c, [-30, -330, 30, -330, 30, -230, 110, -20, -110, -20, -30, -230]); cel(c, -110, -330, 220, 310, 'rgba(124,196,224,.45)', { hw: .08, ha: .5 }); poly(c, [-30, -330, 30, -330, 30, -230, 110, -20, -110, -20, -30, -230]); lnB(c, 5, '#e0f2fe');
      c.save(); c.translate(0, -110); c.rotate(.12 * Math.sin(t * 1.4)); poly(c, [0, -80, 56, -18, 34, 64, -34, 64, -56, -18]); cel(c, -56, -80, 112, 144, '#dff6ff', { hw: .14 }); poly(c, [0, -80, 56, -18, 34, 64, -34, 64, -56, -18]); lnB(c, 4, '#ffffff'); poly(c, [0, -80, 56, -18, 0, 0]); fill(c, 'rgba(255,255,255,.7)'); c.restore();
      for (let j = 0; j < 7; j++) { const u = (t * .5 + j / 7) % 1; circ(c, -60 + H1(j) * 120, -40 - u * 260, 4 + 4 * H1(j * 3), rgba('#e0f2fe', .8 * (1 - u))) }   // ледяной пар
    } else if (i === 1) {   // мега-бак: прозрачный цилиндр, двухслойная жидкость, две спирали
      const x0 = -90, x1 = 90, yT = -420, yB = -20; rr(c, x0, yT, 180, yB - yT, 30); fill(c, 'rgba(124,196,224,.18)');
      c.save(); rr(c, x0, yT, 180, yB - yT, 30); c.clip(); liquid2(c, x0, x1, yT + 120, 9, t, yB + 10); c.restore();
      [-36, 36].forEach(xx => { c.beginPath(); for (let j = 0; j <= 18; j++) c.lineTo(xx + (j % 2 ? 16 : -16), yB - 200 + j * 9); lnB(c, 5, '#ff8a3d') });
      rr(c, x0, yT, 180, yB - yT, 30); lnB(c, 5, '#e0f2fe'); c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(x0 + 18, yT + 40, 14, yB - yT - 80);
      rr(c, -50, yT - 50, 100, 54, 12); cel(c, -50, yT - 50, 100, 54, '#2d3142', { hw: .14 }); rr(c, -50, yT - 50, 100, 54, 12); lnB(c, 4);
    } else {   // пробирка с золотой каплей
      c.save(); c.rotate(-.1); rr(c, -34, -380, 68, 360, 34); fill(c, 'rgba(124,196,224,.22)'); c.save(); rr(c, -34, -380, 68, 360, 34); c.clip(); c.fillStyle = '#f2b84b'; c.fillRect(-34, -150 + 6 * Math.sin(t * 5), 68, 200); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-24, -150, 10, 120); c.restore();
      rr(c, -34, -380, 68, 360, 34); lnB(c, 5, '#e0f2fe'); rr(c, -42, -396, 84, 26, 8); fill(c, '#9aa3b5'); lnB(c, 3); c.restore();
      const u = (t * .9) % 1; drop(c, 26, -560 + u * 380, 16 + 6 * (1 - u), '#f2b84b'); glow(c, 0, -170, 160, '#fde68a', .25);
    }
    c.restore();
  }
  function vitrine(c, t, kd) {
    const W = w8(), { x0, x1, y0, y1 } = VIT, w = x1 - x0, h = y1 - y0;
    c.save(); c.translate(0, 1400 * (1 - kd));
    castDots(c, x0, y0, w, h, 150, { st: 18 });
    rr(c, x0 - 24, y0 - 24, w + 48, h + 48, 26); cel(c, x0 - 24, y0 - 24, w + 48, h + 48, '#2c2742', { hw: .02, sw: .12 }); rr(c, x0 - 24, y0 - 24, w + 48, h + 48, 26); lnS(c, 5, S8.slab);
    // вывеска: неон загорается на «подарили»
    const on = at(t, W.pod - .1, W.pod + .15) * (t < W.pod + .5 ? (Math.sin(t * 70) > -.4 ? 1 : .35) : 1);
    rr(c, x0 + 150, y0 - 4, w - 300, 110, 16); fill(c, '#120f1f'); rr(c, x0 + 150, y0 - 4, w - 300, 110, 16); lnS(c, 4, S8.slab);
    if (on > 0) glow(c, 600, y0 + 52, 360, '#ff5d8a', .32 * on); tx(c, 'ЛАЗЕЙКА', 600, y0 + 56, { f: 'U', w: 800, s: 66, c: mixc('#4a2f3f', '#ff7aa0', on), ls: 8, mw: w - 360 });
    VC.forEach((cx, i) => {
      const L = cx - 125, T = y0 + 140, CWd = 250, CHt = h - 170, tl = [W.led, W.gig, W.nik][i], kl = at(t, tl - .3, tl - .05), ki = spr(at(t, tl - .15, tl + .45));
      // 1 слой: задняя стенка, рейки, иней
      rr(c, L, T, CWd, CHt, 10); fill(c, '#211d35'); for (let j = 1; j < 5; j++) { c.fillStyle = 'rgba(255,255,255,.04)'; c.fillRect(L + j * 52, T, 3, CHt) }
      frostCorners(c, L, T, CWd, CHt, 70 + 50 * at(t, K.s8, K.b0));
      // 2 слой: софит, подставка
      if (kl > 0) { beam(c, cx, T + 12, cx, 1140, 26, 150, '#fde68a', .22 * kl); circ(c, cx, T + 16, 14, mixc('#4b4560', '#fde68a', kl)) } else circ(c, cx, T + 16, 14, '#4b4560');
      c.beginPath(); c.ellipse(cx, 1150, 104, 22, 0, 0, TAU); fill(c, '#3d3757'); rr(c, cx - 104, 1150, 208, 70, 6); cel(c, cx - 104, 1150, 208, 70, '#3d3757', { hw: .05 }); c.beginPath(); c.ellipse(cx, 1150, 104, 22, 0, 0, TAU); fill(c, '#57507a'); lnS(c, 3, S8.slab);
      if (ki > 0) item8(c, i, t, ki);
      // 3 слой: стекло с бликами
      c.save(); rr(c, L, T, CWd, CHt, 10); c.clip(); c.fillStyle = 'rgba(255,255,255,.07)'; poly(c, [L + 20, T + CHt, L + 120, T, L + 160, T, L + 60, T + CHt]); c.fill(); poly(c, [L + 150, T + CHt, L + 250, T, L + 262, T, L + 162, T + CHt]); c.fill(); c.restore();
      rr(c, L, T, CWd, CHt, 10); lnS(c, 4, '#8f88a3');
    });
    // подписи улик
    const lab = [['WS-23', 'СИНТЕТИЧЕСКИЙ ЛЁД', W.led], ['13 МЛ', '5 000 ЗАТЯЖЕК', W.gig], ['НИКОТИН', 'БЕЗ ТАБАКА', W.nik]];   // подписи в две строки — внутри своей ячейки
    lab.forEach(([a1, a2, tl], i) => { const k = bo(at(t, tl + .1, tl + .45)); if (k <= 0) return; c.save(); c.translate(VC[i], 1262); c.scale(k, k);
      rr(c, -112, -34, 224, 68, 10); fill(c, i === 2 ? B2.gold : B2.ice); rr(c, -112, -34, 224, 68, 10); lnS(c, 3, B2.ink);
      tx(c, a1, 0, -12, { f: 'U', w: 800, s: 26, c: B2.ink, mw: 200 }); tx(c, a2, 0, 16, { f: 'M', w: 800, s: 17, c: B2.ink, mw: 200 }); c.restore() });
    // красная лента «ЗАПРЕТ ВКУСОВ» крест-накрест: на «подарили» рвётся и падает
    const kt = eo(at(t, K.s8 + .9, K.s8 + 1.3)), kf = at(t, W.pod - .2, W.pod + .7);
    if (kt > 0 && kf < 1) [[-.5, 1], [.5, -1]].forEach(([a, sd], j) => { c.save(); c.translate(600 + sd * 260 * kf * kf, 900 + 1300 * kf * kf); c.rotate(a + sd * 1.2 * kf); c.scale(kt, 1);
      rr(c, -560, -42, 1120, 84, 4); cel(c, -560, -42, 1120, 84, B2.red, { hw: .02, hi: false, sw: .0001 }); rr(c, -560, -42, 1120, 84, 4); lnS(c, 3, '#ffd5dc');
      for (let q = -1; q <= 1; q++) tx(c, 'ЗАПРЕТ ВКУСОВ', q * 370, 3, { f: 'U', w: 800, s: 30, c: '#fff', ls: 2, mw: 280 }); [-185, 185].forEach(x => circ(c, x, 0, 7, '#ffd5dc')); c.restore() });   // v19.3: надписи на ленте не слипаются (1:17)
    c.restore();
  }
  const MOON = { x: 210, y: 290, r: 86 };
  function moon8(c, x, y, r, col = '#f8fafc') { circ(c, x, y, r, col); circ(c, x - r * .3, y - r * .2, r * .18, '#e2e8f0'); circ(c, x + r * .3, y + r * .25, r * .13, '#e2e8f0') }
  function shot8(c, t) {
    // 75.5–76.5: касса уезжает вниз, монета летит по дуге и становится Луной; город поднимается снизу; общежитие въезжает справа
    const p = eio(at(t, K.s8 - .57, K.s8 + .43));
    const kp = 1 + .05 * eo(at(t, K.s8 + .5, K.b0 + 2));   // v18.5: наезд не встаёт к доске
    const kc = eo(at(t, K.s8 - .2, K.s8 + .8)), kc2 = eo(at(t, K.s8 + .05, K.s8 + 1));
    c.save(); c.translate(600, 900); c.scale(kp, kp); c.translate(-600, -900);
    c.fillStyle = S8.bg; c.fillRect(-500, -500, WW + 1000, HH + 1000);
    for (let i = 0; i < 26; i++) circ(c, H1(i * 4.4) * WW, H1(i * 6.6) * 900, 2 + H1(i) * 2, rgba('#e2e8f0', .35 + .25 * Math.sin(t * 1.7 + i)));
    if (p >= 1) moon8(c, MOON.x, MOON.y, MOON.r);
    c.save(); c.translate(0, 900 * (1 - kc)); cityRow(c, 21, 1420, 260, 640, S8.b1, .25, t); spire(c, 250, 1420); c.restore();
    c.save(); c.translate(0, 900 * (1 - kc2)); cityRow(c, 7, 1420, 160, 420, S8.b2, .35, t); c.restore();
    c.fillStyle = '#1d1a2b'; c.fillRect(-500, 1400, WW + 1000, 900); c.beginPath(); c.moveTo(-500, 1400); c.lineTo(WW + 500, 1400); lnS(c, 4, S8.slab);
    const kd = bo(at(t, K.s8 + .3, K.s8 + 1.1)); if (kd > 0) vitrine(c, t, kd);
    c.restore();
    if (p < 1) {   // касса уезжает вниз целиком (без растворения), монета летит в Луну
      c.save(); c.translate(0, 1950 * p); c.beginPath(); c.rect(0, 0, WW, HH); c.clip(); b6Shot(c, t); c.restore();   // v19.3: уезжает ровно кадр — без полосы сверху (1:16)
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
  const sp4 = (c, x, y, r, col) => { c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, q = i % 2 ? r * .26 : r; c.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q) } c.closePath(); fill(c, col) };
  function ep3Frame(c, t, tip = 1) {   // v19.3: tip 0…1 — красный кончик загорается (мостик, «нежные»), 1 — кадр 0 3-й главы
    const u = MODE === 'y' && K.ledi ? 1 - at(t, K.ledi - .5, K.endT) : 0, w2 = u * u;   // мостик: лучи и сигарета плавно «садятся» в кадр 0 3-й главы
    c.fillStyle = '#0f172a'; c.fillRect(-200, -200, WW + 400, HH + 400);
    const g = c.createRadialGradient(540, 860, 0, 540, 860, 1000); g.addColorStop(0, '#1e3a8a'); g.addColorStop(.5, '#172554'); g.addColorStop(1, '#0f172a'); c.fillStyle = g; c.fillRect(-200, -200, WW + 400, HH + 400);
    c.save(); c.translate(540, 860); c.rotate(.22 * w2); for (let i = 0; i < 24; i++) { c.save(); c.rotate(i * TAU / 24); poly(c, [0, 0, -40, -1400, 40, -1400]); fill(c, i % 2 ? 'rgba(212,160,23,.07)' : 'rgba(212,160,23,.03)'); c.restore() }
    [260, 360, 470].forEach((r, i) => { c.beginPath(); c.arc(0, 0, r, Math.PI * 1.1, Math.PI * 1.9); stroke(c, rgba('#d4a017', .35 - i * .08), 4) }); c.restore();
    c.save(); c.strokeStyle = 'rgba(212,160,23,.35)'; c.lineWidth = 4; [[0, 0], [WW, 0], [0, HH], [WW, HH]].forEach(([qx, qy]) => { c.save(); c.translate(qx, qy); c.scale(qx ? -1 : 1, qy ? -1 : 1); for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(40 + i * 26, 230); c.lineTo(40 + i * 26, 40 + i * 26); c.lineTo(230, 40 + i * 26); c.stroke() } c.restore() }); c.restore();
    glow(c, 540, 860, 420, '#fde68a', .14);
    c.save(); c.translate(540, 860); c.scale(1 + .1 * w2, 1 + .1 * w2);
    const pk = tip < 1 ? Math.sin(Math.PI * at(tip, .2, 1)) : 0;   // вспышка, пока кончик загорается
    if (pk > 0) { glow(c, 0, -295, 260, '#f43f5e', .6 * pk); glow(c, 0, -295, 120, '#fecdd3', .5 * pk) }
    c.save(); c.translate(30, 40); rr(c, -38, -330, 76, 660, 20); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, -38, -330, 76, 660, 20); fill(c, '#f8fafc'); c.fillStyle = 'rgba(203,213,225,.6)'; c.fillRect(14, -330, 16, 660);
    if (tip >= 1) { rr(c, -38, -330, 76, 70, 20); fill(c, '#e11d48'); c.fillStyle = '#be123c'; c.fillRect(-38, -270, 76, 10) }
    else if (tip > 0) { const f = ss(0, .75, tip); c.save(); rr(c, -38, -330, 76, 70, 20); c.clip(); c.fillStyle = '#e11d48'; c.fillRect(-38, -260 - 70 * f, 76, 70 * f + 1); c.fillStyle = '#be123c'; c.fillRect(-38, -270, 76, 10 * ss(.1, .4, tip)); c.restore();
      if (pk > 0) { rr(c, -38, -330, 76, 70, 20); stroke(c, rgba('#fff1f2', .8 * pk), 6) } }
    if (tip > 0 && tip < 1) for (let i = 0; i < 6; i++) { const k0 = .3 + i * .08, k = at(tip, k0, k0 + .4); if (k <= 0 || k >= 1) continue; const a = -Math.PI / 2 + (i - 2.5) * .62, r = 70 + 70 * eo(k);
      c.save(); c.globalAlpha *= 1 - ss(.55, 1, k); sp4(c, Math.cos(a) * r, -295 + Math.sin(a) * r * .9, (i % 2 ? 22 : 30) * bo(at(k, 0, .45)), i % 2 ? '#fecdd3' : '#fde68a'); c.restore() }
    c.restore();
  }
  function cardDraw(c, t, cd, o = {}) {
    const [px, py] = photoC(cd);
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW / 2, -CH / 2, CW, CH, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW / 2, cd.y - CH / 2, CW, CH, 6); fill(c, '#f5f0e6'); rr(c, cd.x - CW / 2, cd.y - CH / 2, CW, CH, 6); lnS(c, 3, '#2b2638');
    c.save(); c.beginPath(); c.rect(px - PH / 2, py - PH / 2, PH, PH); c.clip();
    if (cd.id === '1979') photo1979(c, t, px, py, PH);
    else if (cd.id === '2020') { c.save(); c.translate(px, py); c.scale(PH / 1040, PH / 1040); c.translate(-620, -880); shot8(c, t); c.restore() }
    else if (cd.id === '1924' && o.ch3 && !cd.open && !(o.ds > 0)) { c.fillStyle = '#1e293b'; c.fillRect(px - PH / 2, py - PH / 2, PH, PH) }   // v19.4: маркер ещё целый — под ним ничего не рисуем
    else if (cd.id === '1924' && (o.ep3 || o.ch3)) { c.save(); c.translate(px, py); c.scale(PH / 1080, PH / 1080); c.translate(-540, -860); if (o.ch3 && CH3OK) ch3(c, t); else ep3Frame(c, t, o.tip ?? 1); c.restore() }
    else { c.fillStyle = '#1e293b'; c.fillRect(px - PH / 2, py - PH / 2, PH, PH) }
    if (!cd.open) {   // закрыто — глухой чёрный маркер; v19.3: на 1924 маркер режется по диагонали (o.dl) и две половины расходятся (o.ds)
      const ds = o.ds || 0, L = px - PH / 2, R = px + PH / 2, T = py - PH / 2, B = py + PH / 2;
      if (ds < 1) { const d = PH * .8 * eio(ds), n = Math.SQRT1_2;
        [[1, [L - 4, T - 4, R + 4, T - 4, R + 4, B + 4]], [-1, [L - 4, T - 4, R + 4, B + 4, L - 4, B + 4]]].forEach(([sg, P]) => {
          c.save(); c.translate(sg * d * n, -sg * d * n); poly(c, P); c.clip();
          rr(c, L, T, PH, PH, 2); fill(c, '#17171c'); marker(c, px, py, PH, cd.x);
          if (ds > 0) { c.beginPath(); c.moveTo(L, T); c.lineTo(R, B); lnS(c, 7, rgba('#fde68a', .9 * (1 - ss(.4, 1, ds)))) }
          c.restore() });
        const dl = o.dl || 0; if (dl > 0 && ds <= 0) { const ex = lp(L, R, eio(dl)), ey = lp(T, B, eio(dl)); c.beginPath(); c.moveTo(L, T); c.lineTo(ex, ey); lnS(c, 5, '#fde68a');
          if (dl < 1) { glow(c, ex, ey, 46, '#fde68a', .95); circ(c, ex, ey, 6, '#fffbe6') } } }
    }
    c.restore();
    const la = o.labA ?? 1;
    if (la > 0) A(c, la, () => tx(c, cd.a, cd.x, cd.y + CH / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' }));   // на закрытой карточке — только год
    if (cd.open) tx(c, cd.b, cd.x, cd.y + CH / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW - 24 });
    else if (o.sub && o.subA > 0 && la > 0) { c.save(); c.globalAlpha *= la; c.translate(cd.x, cd.y + CH / 2 - 18); c.scale(1, bo(o.subA)); tx(c, o.sub, 0, 0, { f: 'M', w: 800, s: 18, c: '#b91c1c', mw: CW - 20 }); c.restore() }
    if (o.q > 0) { const [qx, qy] = photoC(cd); c.save(); c.translate(qx, qy); c.scale(o.q, o.q); tx(c, '?', 0, 4, { f: 'U', w: 800, s: 150, c: '#fbbf24', sw: 10, sc: '#78350f' }); c.restore() }
    if (!o.noPin) pin(c, ...pinP(cd));
  }
  function pin(c, x, y) { circ(c, x + 3, y + 5, 14, 'rgba(0,0,0,.35)'); circ(c, x, y, 14, '#dc2626'); circ(c, x - 4, y - 4, 5, '#fca5a5') }
  function thread(c, a, b, k = 1) { if (k <= 0) return; const [x1, y1] = pinP(a), [x2, y2] = pinP(b); c.save(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(lp(x1, x2, k) + 3, lp(y1, y2, k) + 6); c.stroke(); c.strokeStyle = '#dc2626'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, k), lp(y1, y2, k)); c.stroke(); c.restore() }
  function board(c, t, o = {}) {
    boardWall(c, t);
    const C0 = CARDS, th = o.th || [1, 1, 1];   // нити от 2020 к 2014, 1924, 2022
    thread(c, C0[0], C0[1]);
    if (o.pulse > 0 && o.pulse < 1) { const [x1, y1] = pinP(C0[1]), [x2, y2] = pinP(C0[3]), u = eio(o.pulse); glow(c, lp(x1, x2, u), lp(y1, y2, u), 60, '#fde68a', .9); circ(c, lp(x1, x2, u), lp(y1, y2, u), 9, '#fff7cc') }
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
    c.save(); c.beginPath(); c.rect(sx, sy, sw2, sh2); c.clip(); c.translate(x, y); c.scale(w / WW, h / HH); b1Shot(c, 0); c.restore();   // v19.0: точный кадр 0 — глыба, без второй плашки
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
  // v19.4 (19.11): мостик ныряет в кадр 0 главы 3 «1924 · Мальборо» (щит Marlboro Country у трассы) — рисовку главы даёт сама глава (window.EP3, ep/v200.js).
  // Общий масштаб растёт плавно и к стыку набирает скорость, с которой глава стартует (W1V = 0,4 в секунду): сначала едет только камера доски —
  // фото растёт до экрана, к концу её сменяет камера самой главы (параллакс включается постепенно). Последний кадр мостика — кадр главы за 1/30 с до кадра 0.
  let CH3OK = false;
  const DVR = .4, DVL = .1, DVB = Math.log(4.5 / 2.6), DVH = .93;   // скорость на стыке; насколько камера главы отъехала до нырка; нырок камеры доски (2,6 → 1/p); где он кончается
  function DV(t) {   // f — камера доски (0…1), g — камера главы (0…1): вместе — один плавный наезд без остановки
    const S = K.ts - K.d0, dL = DVB + DVL, k = DVR * S / dL, c1 = dL / DVB, a = 2 / c1 - DVH, P = Math.pow(at(t, K.d0, K.ts), k);
    const f = P <= a ? c1 * P : P >= DVH ? 1 : c1 * a + c1 * (P - a) - c1 * (P - a) ** 2 / (2 * (DVH - a));
    return { f, g: (dL * P - DVB * f) / DVL };
  }
  const GUST = t => 120 * eo(at(t, K.nezh - .1, K.ledi + .25)) * (1 - eio(at(t, K.ledi + .7, K.ledi + 2.3)));   // «нежные сигареты для леди»: ветер приподнимает угол плаката, под ним — розовая дамская реклама
  const ch3 = (c, t) => window.EP3.sub.scene(c, t - K.ts);
  function endB(c, t) {
    const kz1 = eio(at(t, K.zo1 + .1, K.zo1 + 1.25));   // доска → карточка 1924
    const p = PH / 1080, [pcx, pcy] = photoC(C24);
    const zc = 2.6, Fc = [540, C24.y + 5], FE = [pcx, pcy + p * 100];   // в конце фото = кадр 0 главы ровно во весь экран (масштаб 1/p, центр — его середина)
    let z = Math.exp(lp(0, Math.log(zc), kz1)), F = [lp(540, Fc[0], kz1), lp(960, Fc[1], kz1)];
    if (t >= K.d0) { const f = DV(t).f; z = zc * Math.exp(DVB * f); F = [lp(Fc[0], FE[0], f), lp(Fc[1], FE[1], f)] }
    else { const u = at(t, K.zo1 + 1.25, K.d0); z *= 1 + .06 * Math.sin(Math.PI * u) ** 2; F = [F[0] + 50 * Math.sin(2 * Math.PI * u) * Math.sin(Math.PI * u), F[1]] }   // v18.5: доска не стоит
    // v19.3: «мужской брутальности» — косой золотой разрез по маркеру; «век назад выводили» — половины расходятся по диагонали, под ними — живой щит главы 3
    const kc = eio(at(t, K.ledi + .3, K.ledi + 2.3)), labA = 1 - at(kc, .1, .35);   // после «леди» фото раскрывается из квадрата в кадр 9:16
    const ops = { pulse: at(t, K.rules - .4, K.vperv - .2), card: { '1924': { ch3: true, dl: at(t, K.brut - .1, K.brut + .45), ds: at(t, K.vek - .05, K.vyv + .3), labA, sub: '«МАЛЬБОРО»: МЯГКИЕ, КАК МАЙ', subA: at(t, K.vyv + .4, K.vyv + .8) } } };
    if (t < K.zo1) { zoomOutTo2020(c, t, cc => board(cc, t, {})); return }
    const shk = t > K.vek - .05 && t < K.vek + .3 ? 4 * (1 - at(t, K.vek - .05, K.vek + .3)) : 0;
    c.save(); c.translate(540 + Math.sin(t * 91) * shk, 960 + Math.cos(t * 77) * shk); c.scale(z, z); c.translate(-F[0], -F[1]);
    board(c, t, ops);
    if (kc > 0) {   // фото раскрывается из квадрата во весь кадр главы; окно шире кадра — поля и подпись карточки не торчат по краям
      const m = 26, R = [lp(pcx - PH / 2, pcx - 540 * p - m, kc), lp(pcy - PH / 2, pcy - 860 * p - m, kc), lp(PH, WW * p + 2 * m, kc), lp(PH, HH * p + 2 * m, kc)];
      c.save(); c.beginPath(); c.rect(...R); c.clip(); c.translate(pcx, pcy); c.scale(p, p); c.translate(-540, -860); if (CH3OK) ch3(c, t); else ep3Frame(c, t); c.restore();
    }
    c.restore();
  }
  function ep3Pill(c, a) { c.save(); c.setTransform(1, 0, 0, 1, 0, -220 * (1 - eo(a))); yearPill(c, 1924, 1924, 1, 1, true); c.restore() }
  // ================= время сцен по словам голоса =================
  function keys() {
    const w = Wd, k = {};
    k.s8 = w('запретом');
    k.b0 = TLX.b0 - .4; k.endT = TLX.endT;   // v19.0: отъезд в карточку 2020 на 0,4 с раньше
    if (MODE === 's') { k.rest = w('остальных'); k.yt = w('youtube'); k.zo1 = k.b0 + 3.9; k.hl0 = w('открыла'); k.th0 = k.zo1 + .2; k.stamp = k.yt - 1; k.down0 = k.yt + .5; k.down1 = k.down0 + 1.6; k.zA0 = k.down1 + .08 }
    else { k.zo1 = k.b0 + 1.75; k.rules = w('правила'); k.vperv = w('впервой'); k.brut = w('брутальности'); k.vek = w('век'); k.vyv = w('выводили'); k.nezh = w('нежные'); k.ledi = w('леди'); k.d0 = k.ledi - .15; k.ts = k.endT + 1 / 30 }   // v19.4: d0 — начало нырка в кадр 0 главы 3, ts — её кадр 0 (следующий после последнего кадра мостика)
    return k;
  }
  function allInit() { if (!T1) b1Init(); if (!T2) b2Init(); if (!T5) b5Init(); if (!T6) b6Init() }
  function scene(c, t) {   // v19.0: 6 блоков «Боб 2.0», дальше — сцена 8 (Луна, общежитие) из v18.5
    allInit();
    if (t < T1.end) b1Shot(c, t);
    else if (t < T2.fin) b2Shot(c, t);
    else if (t < T5.end) b5Shot(c, t);
    else if (t < K.s8 - .57) b6Shot(c, t);
    else shot8(c, t);
  }
  function hud(c, t) {   // плашка года — годы только вперёд; в кадре 0 плашки нет (петля шортса)
    const pill = (y0, y1, k, dy = 0, a = 1) => { c.save(); c.setTransform(1, 0, 0, 1, 0, dy); yearPill(c, y0, y1, k, a, true); c.restore() };
    if (t < 1) pill(2020, 2020, 1, 0, at(t, .3, .6));
    else if (t < 43.4) pill(2020, 2020, 1, -240 * ei(at(t, 43.0, 43.4)));
    else if (t < T6.a - .2) return;
    else if (t < K.s8 - .25) pill(2021, 2022, at(t, T6.kogda - .2, T6.kogda + .2), -240 * (1 - eo(at(t, T6.a - .2, T6.a + .2))));
    else if (t < K.s8 + .3) pill(2022, 2022, 1, -240 * ei(at(t, K.s8 - .25, K.s8 + .3)));
  }
  function firstFrame(c) { b1Shot(c, 0) }   // кадр 0 — без субтитров и без плашки
  let MBC = null; const SHUT = [[15.1, 16.1], [29.3, 29.9], [42.95, 43.5], [48.4, 50.6], [53.05, 53.6], [69.8, 71.9], [75.75, 76.25]];   // v19.2: + 0:29, 0:43, 0:53, 1:16 — надписи двоились в размытии   // v19.1: на быстрых проездах камеры затвор короче — без смаза и двоения цифр
  function sceneMB(c, t) {   // v19.0: затвор 180° — среднее 4 моментов за полкадра
    const n = 4, sh = SHUT.some(([a, b]) => t > a && t < b) ? 1 / 240 : 1 / 60; if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { scene(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); scene(g, tj);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function mbDo(c, t, fn) {   // v19.4: затвор 180° для любой функции кадра (как sceneMB)
    const n = 4, sh = 1 / 60; if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { fn(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); fn(g, tj);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    if (t >= K.b0) { if (MODE === 's') endA(c, t); else if (t >= K.d0 && !window.NOMB) mbDo(c, t, endB); else endB(c, t) }   // v19.4: нырок — с затвором, как у главы 3 (стык без смены резкости); плашки 1924 нет — в кадре 0 главы её нет
    else { sceneMB(c, t); hud(c, t) }
    subs(c, t);
  }
  // ================= звуки (мягкие) по событиям блоков =================
  function cues() {
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p); allInit();
    const a = T1; Q(.1, 'icecrack', .4); Q(a.cr, 'icecrack', .6); Q(a.sh - .02, 'icecrack', 1); Q(a.sh, 'impact', .5); Q(a.sh + .05, 'shimmer', .4); Q(a.up, 'whoosh', .5); Q(a.up + .1, 'flutter', .4);
    Q(a.back + .2, 'whoosh', .4); Q(a.land, 'thud', .6); Q(a.sq - .2, 'plop', .5); Q(a.sign - .05, 'plop', .6); Q(a.grow, 'city', .35); Q(3.9, 'truck', .2, -.5); Q(a.neon, 'neon', .6); Q(a.dive, 'whoosh', .6);
    Q(a.sw0, 'deep', .5); Q(a.sw0 + .05, 'flutter', .45); Q(a.rot0, 'whoosh', .5); Q(a.sw1 - .3, 'whoosh', .45);
    const b = T2; Q(b.rev, 'city', .3); Q(b.fly + .2, 'whoosh', .55); Q(b.open - .2, 'dive', .6); Q(b.one, 'papers', .35); Q(b.zab, 'marker', .5); Q(b.zak - .02, 'stamp', 1); Q(b.zak, 'impact', .4);
    Q(b.jan - .1, 'pageflip', .7); Q(b.posle - .1, 'whoosh', .45); Q(b.sk, 'papers', .4); Q(b.juul, 'plop', .5); Q(b.lift, 'whoosh', .7); Q(b.lift + .55, 'blade', .6); Q(b.lift + .7, 'chain', .6); Q(b.vl, 'thud', .5); Q(b.usa, 'deep', .35);
    Q(b.rub - .05, 'chain', .7); b.fl.forEach((tf, i) => { Q(tf - .03, 'plop', .55, -.45 + i * .3); Q(tf + .02, 'bubble', .25, -.45 + i * .3) }); Q(b.drop, 'blade', 1); Q(b.chop, 'impact', .9); Q(b.chop + .03, 'splash', .9);
    const d = T3; Q(21.05, 'whoosh', .6); Q(d.unf, 'scroll', .9); Q(d.zap, 'typing', .3); Q(d.only, 'marker', .6); Q(d.cart + .2, 'plop', .5); Q(d.cel, 'marker', .35); Q(d.upom - .03, 'stamp', 1); Q(d.upom, 'impact', .45);
    Q(d.poka - .25, 'whoosh', .7); for (let i = 0; i < 9; i++) Q(d.ubir + i * .12, 'plop', .25, -.5 + i * .12); Q(d.flip, 'thud', .5); Q(d.flip + .1, 'whoosh', .7); Q(d.flip + .75, 'thud', .6);
    Q(d.shen - .2, 'neon', .6); Q(d.conv - .2, 'conveyor', .8); d.box.forEach((tb, i) => Q(tb - .05, 'thud', .55, -.4 + i * .4)); Q(d.wave - .1, 'wave', 1); Q(d.am, 'splash', .9); Q(d.voln, 'impact', .4);
    const e = T4; Q(e.vsego + .3, 'plop', .5); Q(e.vyr - .1, 'pour', .6); Q(e.x11 - .03, 'stamp', .9); Q(e.dive, 'dive', .7); Q(e.zh - .3, 'chain', .5); Q(e.sint, 'shimmer', .4); Q(e.ws - .25, 'icecrack', .9); Q(e.ws + .25, 'splash', .5);
    Q(e.obm - .3, 'whoosh', .5); Q(e.rec, 'flutter', .4); Q(e.gor, 'icecrack', .6); Q(e.led, 'shimmer', .5); Q(e.end - .6, 'dive', .7);
    const f = T5; Q(f.a + .05, 'plop', .5); Q(f.zam, 'thud', .4); Q(f.pach - .03, 'stamp', .6); Q(f.wipe, 'whoosh', .6); Q(f.razr - .2, 'pour', .4); Q(f.wipe + .3, 'chain', .4); Q(f.t13 - .1, 'pour', .5); Q(f.dv - .1, 'thud', .4); Q(f.tys, 'counter', .6);
    Q(f.rot, 'whoosh', .5); for (let i = 0; i < 16; i++) Q(lp(f.nik + .1, f.k16 - .2, i / 15), 'plop', .22, -.6 + i * .08); Q(f.k16 - .03, 'stamp', .6);
    const g = T6; Q(g.a, 'whoosh', .5); Q(g.obo, 'leaves', .4); Q(g.prob - .05, 'glassbulb', .6); Q(g.bez - .05, 'stamp', .7); Q(g.list, 'leaves', .5); Q(g.kogda - .3, 'pour', .5); Q(g.kogda + .4, 'bubble', .4);
    Q(g.mlrd - .4, 'conveyor', .5); Q(g.mlrd - .05, 'register', 1); Q(g.mlrd + .05, 'counter', .8); Q(g.doll, 'coins', .5); Q(g.rynok - .05, 'boom', .35); Q(g.corp - .2, 'boom', .35); Q(g.end - .3, 'plop', .5);
    Q(K.s8 - .57, 'whoosh', .7); Q(K.s8 + .4, 'city', .6); Q(K.s8 + .9, 'thud', .5); Q(K.s8 + .95, 'marker', .5); { const W = w8(); Q(W.pod - .2, 'scroll', .7); Q(W.pod, 'neon', .7); Q(W.led - .3, 'icecrack', .7); Q(W.gig - .3, 'pour', .6); Q(W.nik - .3, 'glassbulb', .6); Q(W.nik + .1, 'plop', .5) } Q(K.b0, 'whoosh', .6);
    if (MODE === 's') { for (let i = 0; i < 3; i++) Q(K.th0 + i * 1.2, 'papers', .3, -.3 + i * .3); Q(K.stamp, 'stamp', 1); Q(K.stamp + .02, 'impact', .5); Q(K.down0, 'whoosh', .6); Q(K.zA0 + .3, 'dive', .7) }
    else { Q(K.zo1 + .1, 'whoosh', .6); Q(K.rules - .4, 'whoosh', .35); Q(K.vperv - .25, 'plop', .5); Q(K.brut - .12, 'blade', .45); Q(K.vek - .07, 'whoosh', .6); Q(K.vek + .05, 'pageflip', .45); Q(K.nezh - .1, 'leaves', .45); Q(K.ledi - .1, 'pageflip', .35); Q(K.ledi + .3, 'whoosh', .35); Q(K.ts - 1.2, 'dive', .55) }   // v19.4: ветер треплет угол плаката, нырок в кадр 0 главы 3
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); const ep = String(tl.ep || '').replace(/-(ru|en|de)$/, '');
      MODE = /y$/.test(ep) ? 'y' : 's';
      TLX = { b0: tl.b0, endT: (Math.ceil(tl.dur * 30) - 1) / 30 };   // последний кадр ролика = endT (у шортса он равен кадру 0)
      K = keys(); window.__K = K; cues(); CHUNKS = buildChunks(tl.subs);
      SC.forEach(S => { this.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v180f')) { const st = document.createElement('style'); st.id = 'v180f'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); CORK = null; T1 = T2 = T3 = T4 = T5 = T6 = null; for (const k in BLUR) delete BLUR[k];
      // v19.4: мостик фильма ныряет в кадр 0 главы 3 — её рисовку грузит stage.html (window.EP3 = ep/v200.js, window.TL200 — таймлайн главы)
      const E3 = MODE === 'y' && window.EP3 && window.EP3.sub && window.TL200 ? window.EP3 : null; CH3OK = false;
      const p3 = E3 ? Promise.resolve(E3.sub.init(window.TL200)).then(() => { E3.sub.pre(tau => -DVL * (1 - DV(tau + K.ts).g), tau => GUST(tau + K.ts)); CH3OK = true }) : 0;
      return Promise.all([p3].concat(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U'].map(f => document.fonts.load(f, 'АЯaz09$')))).then(() => 0);
    },
  };
})();
