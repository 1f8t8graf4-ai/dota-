// v16 полный (11.11): весь ролик «Что вы знаете об одноразках?» под голос v14.5 (out/v16f-ru: v16_voice.py, v16_music.py).
// Яркий плоский стиль пробы v16 (без размытия, свечения, вспышек, зерна; без рук), цвет — свой у каждой сцены.
// Правки по ТЗ 11.11 (Андрей + Gemini): интро — синий градиент с вращающимися лучами, облака пара, манго и мята, зачёркнутые сигареты;
// заголовок одной строкой до самого превращения полосы в вейп; барабан лет 2026 → 1973 по десятилетиям, без обрывков цифр;
// 1973 — табачная империя: заводы с трубами, водяной знак «верблюд + корона», пачки CAMEL и WINSTON, меморандум поверх;
// меморандум влетает в коробку архива без косой шторки; «25 ЛЕТ В АРХИВЕ» крупно на плашке; молоток тёмного дерева с золотом
// бьёт сверху по круглой подставке, волна, весы правосудия, «СУД США · 1998»; пачка «Мальборо» сразу крупно, без пустого красного.
// Сцены по словам голоса (время слов — из timeline.json, init → K). Звуки — window.CUES → cues.json → audio.py (sfx13/sfx8).
// Факты: меморандум R.J. Reynolds 02.02.1973 (К. Тиг): «we must get our share of the youth market»; документы открыты по суду 1998
// (Миннесота + соглашение штатов), архив UCSF (Сан-Франциско) — 14+ млн документов; основатели Juul — студенты Стэнфорда;
// Juul — 2015; 1 картридж ≈ пачка сигарет (по данным самой Juul); 2019 — 27,5 % старшеклассников США (NYTS); Altria (производитель
// «Мальборо» в США) — 35 % Juul за $12,8 млрд (20.12.2018); «Мальборо» в 1924 — дамские сигареты, ковбой — с 1954.
(function () {
  'use strict';
  const WW = 1920, HH = 1080, TAU = Math.PI * 2;
  const C = {
    n0: '#141935', n1: '#1f2858', n2: '#2e3c7e', n3: '#4558a8', ink: '#141935',
    deep: '#0b1650', deep2: '#1b3a92', ray: '#14307f',
    red: '#e8475a', red2: '#c63449', red3: '#ff7f8e', mk: '#ffb3c0',
    wh: '#f8f4ec', white: '#ffffff', pa: '#ece4d4', pa2: '#d8cdb8', grey: '#c9c1b6',
    am: '#f2a33a', am2: '#d9812a', am3: '#ffc46a', am4: '#ffe3ae',
    mint: '#43d9b9', mint2: '#22a58b', sky: '#66c7f0', sky2: '#cfe8ff',
    blue: '#0b1f5c', blue2: '#112a6e', blue3: '#1d4a94', spot: '#cfe0ff',
    bp: '#2e65a0', bp2: '#3d74b0',
    yel: '#ffd36e', yel2: '#f2b84a',
    wood: '#5c2e0e', wood2: '#7a3f15', wood3: '#8a4a1c', gold: '#e1a754',
    mred: '#cc234a', mred2: '#a51c3d',
    rim: '#060e38', glass: '#040a2a',
  };
  const D = {};
  let cv = null, X = null, K = null, TLW = [];

  // ================= звуки по событиям =================
  window.CUES = window.CUES || {};
  const cue = (t0, name, gain = 1, pan = 0) => { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, pan] };

  // ================= время слов =================
  const nw = s => String(s).toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
  function Wd(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.a } throw new Error('v16f: нет слова «' + q + '» #' + n) }

  // ================= утилиты =================
  const cl = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, lp = (a, b, k) => a + (b - a) * k;
  const at = (t, a, b) => cl((t - a) / (b - a));
  const ss = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k) };
  const eo = k => 1 - Math.pow(1 - cl(k), 3), ei = k => Math.pow(cl(k), 3);
  const eio = k => { k = cl(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 };
  const bo = k => { k = cl(k); const s = 2.2; return 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2) };
  const spr = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-6.2 * k) * Math.cos(10.5 * k);
  const H1 = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) };
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mixc = (a, b, k) => { const A = hex(a), B = hex(b); return 'rgb(' + A.map((v, i) => Math.round(lp(v, B[i], cl(k)))).join(',') + ')' };
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r) };
  const poly = (c, p) => { c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath() };
  const fill = (c, col) => { c.fillStyle = col; c.fill() };
  const stroke = (c, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.stroke() };
  const circ = (c, x, y, r, col) => { if (r <= 0) return; c.beginPath(); c.arc(x, y, r, 0, TAU); fill(c, col) };
  const rot = (x, y, r) => [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
  const pulse = (t, a) => at(t, a - .08, a) * (1 - at(t, a + .45, a + .7));
  // камера: точка мира (x, y) — в центре кадра, масштаб s, поворот r
  const cam = (c, s, x, y, r = 0) => { c.translate(WW / 2, HH / 2); if (r) c.rotate(r); c.scale(s, s); c.translate(-x, -y) };
  // наезд в точку: (fx, fy) приходит в центр, масштаб растёт по экспоненте от s0 до s1; (x0, y0) — где камера смотрела до наезда
  function zoomCam(k, fx, fy, s0, s1, x0 = 960, y0 = 540) {
    const e = eio(k), s = s0 * Math.pow(s1 / s0, e), m = ss(0, .85, k);
    const px = lp(960 + s0 * (fx - x0), 960, m), py = lp(540 + s0 * (fy - y0), 540, m);
    return { s, x: fx - (px - 960) / s, y: fy - (py - 540) / s };
  }
  // плавный силуэт через точки (Катмулл — Ром → кривые Безье)
  function spline(c, P, closed = true) {
    const n = P.length / 2, g = i => { const j = closed ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i)); return [P[2 * j], P[2 * j + 1]] };
    c.beginPath(); c.moveTo(P[0], P[1]);
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const [x0, y0] = g(i - 1), [x1, y1] = g(i), [x2, y2] = g(i + 1), [x3, y3] = g(i + 2);
      c.bezierCurveTo(x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6, x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6, x2, y2);
    }
    if (closed) c.closePath();
  }
  // линия «рисуется»: ломаная до доли k длины
  function drawOn(c, P, k, closed = false) {
    if (k <= 0) return; const Q = closed ? P.concat(P.slice(0, 2)) : P;
    let L = 0; for (let i = 2; i < Q.length; i += 2) L += Math.hypot(Q[i] - Q[i - 2], Q[i + 1] - Q[i - 1]);
    let left = L * cl(k); c.beginPath(); c.moveTo(Q[0], Q[1]);
    for (let i = 2; i < Q.length && left > 0; i += 2) {
      const d = Math.hypot(Q[i] - Q[i - 2], Q[i + 1] - Q[i - 1]), u = Math.min(1, left / (d || 1));
      c.lineTo(lp(Q[i - 2], Q[i], u), lp(Q[i - 1], Q[i + 1], u)); left -= d;
    }
    c.stroke();
  }
  const rrPts = (x, y, w, h, r, n = 6) => {
    const P = [], cs = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]];
    for (const [cx, cy, a0] of cs) for (let i = 0; i <= n; i++) { const a = a0 + Math.PI / 2 * i / n; P.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r) }
    return P;
  };

  // ================= текст =================
  const FNT = o => `${o.w || 800} ${o.s || 40}px ${o.f || 'M'}`;
  function tw(c, s, o = {}) { c.save(); c.font = FNT(o); c.letterSpacing = (o.ls || 0) + 'px'; const w = c.measureText(s).width - (o.ls || 0); c.restore(); return w }
  function tx(c, s, x, y, o = {}) {
    if (!s || (o.a ?? 1) <= 0) return;
    c.save(); c.font = FNT(o); c.letterSpacing = (o.ls || 0) + 'px'; const al = o.al || 'center';
    c.textAlign = al; c.textBaseline = 'middle'; c.globalAlpha *= o.a ?? 1; c.fillStyle = o.c || C.wh;
    c.fillText(s, x + (al === 'center' ? (o.ls || 0) / 2 : al === 'right' ? (o.ls || 0) : 0), y); c.restore();
  }
  // число в ровных клетках — цифры не прыгают, пока считают
  function num(c, s, x, y, o) {
    c.save(); c.font = FNT(o); c.letterSpacing = '0px'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = o.c; c.globalAlpha *= o.a ?? 1;
    const dw = c.measureText('0').width * 1.02, cw = ch => /[0-9]/.test(ch) ? dw : ch === ' ' ? dw * .38 : c.measureText(ch).width + dw * .05;
    let px = x - [...s].reduce((n, ch) => n + cw(ch), 0) / 2;
    for (const ch of s) { const w = cw(ch); if (ch !== ' ') c.fillText(ch, px + w / 2, y); px += w }
    c.restore();
  }
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  // плашка: ширина по тексту + поля, текст никогда не режется
  function plate(c, s, x, y, k, o = {}) {
    if (k <= 0) return;
    const fs = o.s || 34, to = { s: fs, ls: o.ls ?? 4, w: o.w || 800, f: o.f || 'M' }, w = tw(c, s, to) + fs * 1.3, h = fs * 1.9;
    c.save(); c.translate(x, y); if (o.r) c.rotate(o.r); c.scale(k, k);
    if (o.sh !== false) { rr(c, -w / 2 + 8, -h / 2 + 10, w, h, o.rad ?? h * .22); fill(c, o.shc || 'rgba(20,25,53,.28)') }
    rr(c, -w / 2, -h / 2, w, h, o.rad ?? h * .22); fill(c, o.bg || C.white);
    tx(c, s, 0, fs * .04, { ...to, c: o.c || C.ink });
    c.restore();
  }
  // год-барабан: Y — годы по порядку, TT — когда каждый встал на место; меняются только разные цифры, каждая в своём окне
  function yearDrum(c, t, Y, TT, x, y, o) {
    let i = 0; while (i < Y.length - 1 && t >= TT[i + 1]) i++;
    const d = o.d || .2, nx = i < Y.length - 1 ? i + 1 : i, k = nx > i ? eio(at(t, TT[nx] - d, TT[nx])) : 0;
    const A = String(Y[i]), B = String(Y[nx]), s = o.s || 200;
    c.save(); c.font = FNT({ s, w: 800 }); c.letterSpacing = '0px'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = o.c || C.white; c.globalAlpha *= o.a ?? 1;
    const dw = c.measureText('0').width * 1.04, x0 = x - dw * A.length / 2;
    for (let p = 0; p < A.length; p++) {
      const cx = x0 + dw * (p + .5), a = A[p], b = B[p], dir = o.dir ?? 1;
      if (a === b || k <= 0) { c.fillText(a, cx, y + s * .03); continue }
      const ph = k < .5 ? 1 - k * 2 : k * 2 - 1, g = k < .5 ? a : b, dy = (k < .5 ? -k : 1 - k) * s * .18 * dir;
      c.save(); c.translate(cx, y + s * .03 + dy); c.scale(1, Math.max(.001, eo(ph))); c.fillText(g, 0, 0); c.restore();
    }
    c.restore();
  }

  // ================= одноразка =================
  function leafPath(c, x, y, L, W) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + L * .5, y - W, x + L, y); c.quadraticCurveTo(x + L * .5, y + W, x, y); c.closePath() }
  // окошко с жидкостью: центр (0,0), 124×270
  function win(c, o) {
    rr(c, -62, -135, 124, 270, 46); fill(c, C.rim);
    rr(c, -50, -123, 100, 246, 36); fill(c, C.glass);
    c.save(); rr(c, -50, -123, 100, 246, 36); c.clip();
    const lv = o.level ?? -52, t = o.t || 0;
    c.beginPath(); c.moveTo(-60, lv);
    for (let x = -60; x <= 60; x += 6) c.lineTo(x, lv + Math.sin(x * .07 + t * 3.2) * 4);
    c.lineTo(60, 140); c.lineTo(-60, 140); c.closePath(); fill(c, o.liq || C.am);
    const ba = o.bub ?? 1;
    if (ba > 0) {
      c.globalAlpha *= ba; c.fillStyle = o.liq2 || C.am3;
      for (let i = 0; i < 6; i++) { const ph = (t * (.35 + .2 * H1(i)) + H1(i * 3.1)) % 1, y = lp(118, lv + 14, ph), x = -32 + 64 * H1(i * 7.7) + Math.sin(t * 2 + i) * 4; c.beginPath(); c.arc(x, y, 3 + 4 * H1(i * 1.3), 0, TAU); c.fill() }
    }
    c.restore();
    rr(c, -36, -108, 10, 120, 5); fill(c, 'rgba(255,255,255,.35)');
  }
  // корпус 230×640, центр (0,0); мундштук сверху (до y = −462)
  function vapeBody(c, o) {
    const w = 230, h = 640, mk = o.mk ?? 1, wk = o.wk ?? 1, lk = o.lk ?? 1;
    if (mk > 0) {
      c.save(); c.translate(0, -h / 2 + 8); c.scale(1, mk);
      c.beginPath(); c.moveTo(-84, 0); c.lineTo(-58, -132); c.quadraticCurveTo(-54, -150, -36, -150); c.lineTo(36, -150); c.quadraticCurveTo(54, -150, 58, -132); c.lineTo(84, 0); c.closePath();
      fill(c, o.mp || C.wh); c.save(); c.clip(); c.fillStyle = o.mps || C.pa2; c.fillRect(26, -160, 80, 170); c.restore();
      rr(c, -30, -140, 60, 12, 6); fill(c, C.glass);
      c.restore();
    }
    rr(c, -w / 2, -h / 2, w, h, 58); fill(c, o.body);
    c.save(); rr(c, -w / 2, -h / 2, w, h, 58); c.clip(); c.fillStyle = o.shade; c.fillRect(w / 2 - 70, -h / 2, 80, h); c.restore();
    rr(c, -w / 2 + 24, -h / 2 + 80, 12, h - 240, 6); fill(c, 'rgba(255,255,255,.3)');
    if (mk > 0) { const cw = (w + 10) * Math.min(1, mk); rr(c, -cw / 2, -h / 2 - 6, cw, 36, 16); fill(c, o.collar || C.rim) }
    if (wk > 0) { c.save(); c.translate(0, -40); c.scale(wk, wk); win(c, o); c.restore() }
    if (lk > 0 && o.label) tx(c, o.label, 0, 150, { s: 34, ls: 6, c: o.lc || C.wh, a: lk });
    circ(c, 0, 250, 13, C.rim);
    const led = o.led || 0;
    if (led > 0) { c.save(); c.globalAlpha *= led; circ(c, 0, 250, 13, o.ledC || C.mint); c.beginPath(); c.arc(0, 250, 24, 0, TAU); c.strokeStyle = o.ledC || C.mint; c.lineWidth = 4; c.globalAlpha *= .55; c.stroke(); c.restore() }
  }
  const HERO = { body: C.red, shade: C.red2, mp: C.wh, mps: C.pa2, collar: C.rim, label: 'MANGO', lc: C.wh, liq: C.am, liq2: C.am3 };
  // пар — плоские облачка без размытия
  function cloud(c, x, y, s, a, seed, col) {
    if (a <= 0 || s <= 0) return;
    c.save(); c.globalAlpha *= a; c.beginPath();
    for (const [bx, by, br] of [[0, 0, 46], [-44, 12, 34], [42, 10, 36], [-18, -30, 32], [22, -26, 30], [0, 22, 30]]) {
      const r = br * s * (.9 + .2 * H1(seed + bx * .37)), px = x + bx * s, py = y + by * s; c.moveTo(px + r, py); c.arc(px, py, r, 0, TAU);
    }
    fill(c, col || C.wh); c.restore();
  }
  // облачка, которые выходят и тают
  function puff(c, t, t0, x, y, dir = 1, sc = 1, col) {
    for (const [d, dx, dy, s0, s1] of [[0, 60, 260, .3, 1.45], [.16, -40, 200, .25, 1.1]]) {
      const k = at(t, t0 + d, t0 + d + 1.45); if (k <= 0 || k >= 1) continue;
      const e = eo(k), z = ss(0, .12, k) * (1 - ss(.55, 1, k));
      cloud(c, x + dx * dir * e * sc, y - dy * e * sc, lp(s0, s1, e) * sc * z, 1, t0 * 7 + d * 13, col);
    }
  }
  // манго целиком и «ёжиком» (плоско, как эмодзи)
  function mango(c, x, y, s, r) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.save(); c.translate(-6, -70); c.rotate(-.55); leafPath(c, 0, 0, 96, 34); fill(c, C.mint2);
    c.beginPath(); c.moveTo(6, 0); c.lineTo(82, 0); c.strokeStyle = C.mint; c.lineWidth = 4; c.lineCap = 'round'; c.stroke(); c.restore();
    c.beginPath(); c.ellipse(0, 0, 100, 80, -.35, 0, TAU); fill(c, '#86c34f');
    c.save(); c.clip(); c.beginPath(); c.ellipse(-16, -14, 100, 80, -.35, 0, TAU); fill(c, C.am); c.beginPath(); c.ellipse(46, 30, 70, 50, -.35, 0, TAU); fill(c, C.red); c.restore();
    c.beginPath(); c.ellipse(-44, -30, 26, 12, -.6, 0, TAU); fill(c, C.am4);
    c.restore();
  }
  function mangoSlice(c, x, y, s, r) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.beginPath(); c.ellipse(0, 0, 150, 72, 0, 0, Math.PI); c.closePath(); fill(c, '#86c34f');
    c.save(); c.clip(); c.beginPath(); c.ellipse(70, 30, 120, 70, 0, 0, TAU); fill(c, C.red); c.restore();
    c.beginPath(); c.ellipse(0, -2, 134, 58, 0, 0, Math.PI); c.closePath(); fill(c, '#ef9426');
    c.beginPath(); c.ellipse(0, -2, 98, 36, 0, 0, Math.PI); c.closePath(); fill(c, C.am3);
    c.strokeStyle = 'rgba(255,227,174,.85)'; c.lineWidth = 4; c.lineCap = 'round';
    for (let i = 1; i < 6; i++) { const a = Math.PI * i / 6; c.beginPath(); c.moveTo(Math.cos(a) * 30, Math.sin(a) * 10); c.lineTo(Math.cos(a) * 118, Math.sin(a) * 48); c.stroke() }
    c.restore();
  }
  function mintLeaf(c, x, y, s, r) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    leafPath(c, -120, 0, 240, 100); fill(c, C.mint);
    c.save(); c.clip(); c.fillStyle = C.mint2; c.fillRect(-130, 0, 260, 120); c.restore();
    c.strokeStyle = C.mint2; c.lineWidth = 6; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-160, 0); c.lineTo(96, 0); c.stroke();
    for (let i = 0; i < 4; i++) { const x0 = -74 + i * 46; c.beginPath(); c.moveTo(x0, 0); c.lineTo(x0 + 34, -38 + i * 6); c.stroke() }
    c.restore();
  }
  function spark(c, x, y, r, col) {
    if (r <= 0) return;
    c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); fill(c, col);
  }
  // сигарета: центр (x, y), длина L, толщина th, поворот r; фильтр слева, кончик справа
  function cig(c, x, y, L, th, r, o = {}) {
    c.save(); c.translate(x, y); c.rotate(r); if (o.a != null) c.globalAlpha *= o.a;
    const f = L * .3;
    rr(c, -L / 2, -th / 2, L, th, th * .22); fill(c, o.paper || C.wh);
    rr(c, -L / 2, -th / 2, f, th, [th * .22, 0, 0, th * .22]); fill(c, o.filter || C.am);
    c.fillStyle = o.dots || C.am2; for (let i = 0; i < 6; i++) c.fillRect(-L / 2 + f * (.12 + .14 * i), -th / 2 + th * (.22 + .42 * (i % 2)), th * .12, th * .12);
    c.fillStyle = 'rgba(20,25,53,.14)'; c.fillRect(-L / 2 + f, -th / 2, Math.max(2, th * .06), th);
    if (o.lit) { rr(c, L / 2 - th * .55, -th / 2, th * .55, th, [0, th * .22, th * .22, 0]); fill(c, '#8e889b'); rr(c, L / 2 - th * .24, -th / 2, th * .24, th, [0, th * .22, th * .22, 0]); fill(c, mixc(C.red, C.am3, o.glow || 0)) }
    c.restore();
  }
  function slash(c, x1, y1, x2, y2, k, w, col) { if (k <= 0) return; c.save(); c.lineCap = 'round'; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, k), lp(y1, y2, k)); c.stroke(); c.restore() }
  function sunburst(c, cx, cy, ang, n, col, R = 2600) {
    c.save(); c.fillStyle = col; c.beginPath();
    for (let i = 0; i < n; i++) { const a = ang + i * TAU / n, b = a + TAU / n / 2; c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); c.lineTo(cx + Math.cos(b) * R, cy + Math.sin(b) * R); c.closePath() }
    c.fill(); c.restore();
  }
  function deepBg(c, cx, cy, a = C.deep2, b = C.deep) { const g = c.createRadialGradient(cx, cy, 60, cx, cy, 1400); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(-4000, -4000, 12000, 12000) }

  // ================= 1973: молекула, заводы, башня, верблюд, пачки, меморандум =================
  // никотин (скелетная формула): пиридин + пирролидин, атомы азота — кружками
  const MOL = (() => {
    const hx = [], pn = [];
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * TAU / 6; hx.push([-100 + Math.cos(a) * 90, Math.sin(a) * 90]) }
    for (let j = 0; j < 5; j++) { const a = Math.PI + j * TAU / 5; pn.push([115 + Math.cos(a) * 70, -40 + Math.sin(a) * 70]) }
    const B = [];
    for (let i = 0; i < 6; i++) B.push([hx[i], hx[(i + 1) % 6], i % 2 === 0]);
    B.push([hx[1], pn[0], false]);
    for (let j = 0; j < 5; j++) B.push([pn[j], pn[(j + 1) % 5], false]);
    B.push([pn[4], [pn[4][0] + 6, pn[4][1] + 78], false]);
    return { B, N: [hx[3], pn[4]], hc: [-100, 0] };
  })();
  function molecule(c, x, y, s, k, col, ncol) {
    if (k <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s); c.lineCap = 'round'; c.strokeStyle = col; c.lineWidth = 14;
    const n = MOL.B.length;
    MOL.B.forEach(([a, b, dbl], i) => {
      const u = cl((k * 1.25 - i / n) * n / 2.2); if (u <= 0) return;
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(lp(a[0], b[0], u), lp(a[1], b[1], u)); c.stroke();
      if (dbl && u >= 1) {   // вторая черта внутри кольца
        const mx = (a[0] + b[0]) / 2 - MOL.hc[0], my = (a[1] + b[1]) / 2 - MOL.hc[1], L = Math.hypot(mx, my), ox = -mx / L * 20, oy = -my / L * 20;
        c.beginPath(); c.moveTo(lp(a[0], b[0], .2) + ox, lp(a[1], b[1], .2) + oy); c.lineTo(lp(a[0], b[0], .8) + ox, lp(a[1], b[1], .8) + oy); c.lineWidth = 10; c.stroke(); c.lineWidth = 14;
      }
    });
    const kn = spr(at(k, .75, 1));
    for (const [nx, ny] of MOL.N) if (kn > 0) { c.save(); c.translate(nx, ny); c.scale(kn, kn); circ(c, 0, 0, 34, col); tx(c, 'N', 0, 2, { s: 38, c: ncol }); c.restore() }
    c.restore();
  }
  // завод: «пила» крыши, окна, две трубы с полосой; дым кольцами по кругу (с t0). x, y — середина низа
  function factory(c, t, x, y, s, o = {}) {
    const hk = o.h ?? 1, col = o.col || C.n1, dk = o.dk || C.n0, T0 = o.t0 ?? 0, fl = o.flip ? -1 : 1;
    c.save(); c.translate(x, y); c.scale(s * fl, s);
    const ch = [[110, 46, 330], [196, 38, 250]];
    for (const [cx, w, h0] of ch) { const h = h0 * hk; c.fillStyle = col; c.fillRect(cx - w / 2, -150 - h, w, h + 10); c.fillStyle = C.red; c.fillRect(cx - w / 2, -150 - h + 26, w, 16); c.fillStyle = dk; c.fillRect(cx - w / 2 - 7, -150 - h, w + 14, 15) }
    c.fillStyle = col; c.fillRect(-240, -150, 480, 152);
    const P = [-240, -150]; for (let i = 0; i < 4; i++) P.push(-240 + i * 120, -232, -240 + (i + 1) * 120, -150); P.push(240, -150); poly(c, P); fill(c, col);
    for (let i = 0; i < 4; i++) { poly(c, [-240 + i * 120, -232, -240 + i * 120 + 12, -232, -240 + i * 120 + 12, -152, -240 + i * 120, -152]); fill(c, dk) }
    for (let i = 0; i < 7; i++) for (let j = 0; j < 2; j++) { const lit = H1(i * 3 + j + (o.seed || 0)) > .45; c.fillStyle = lit ? C.am4 : C.n2; c.fillRect(-212 + i * 64, -122 + j * 56, 30, 34) }
    c.restore();
    if (t < T0) return;
    // дым: облачка из труб поднимаются и растут
    for (const [cx, , h0] of ch) {
      const tx0 = x + cx * s * fl, ty0 = y - (150 + h0 * hk) * s;
      for (let m = 0; m < 5; m++) {
        const per = 2.6, ph = ((t - T0) / per + m / 5 + H1(cx) * .3) % 1, age = (t - T0) - ph * per; if (age < 0) continue;
        const e = eo(ph), z = ss(0, .1, ph) * (1 - ss(.75, 1, ph));
        cloud(c, tx0 + (40 + 60 * H1(m + cx)) * e * s * fl, ty0 - 300 * e * s, lp(.35, 1.25, e) * s * z, 1, m * 9 + cx, o.smoke || C.wh);
      }
    }
  }
  // башня R.J. Reynolds (ар-деко, ступенями), окна зажигаются с t0
  const BT = [[500, 0, -250], [380, -250, -470], [270, -470, -620], [180, -620, -720]];
  function building(c, t, x0, y0, s, t0) {
    c.save(); c.translate(x0, y0); c.scale(s, s);
    for (const [w, a, b] of BT) { c.fillStyle = C.n1; c.fillRect(-w / 2, b, w, a - b) }
    poly(c, [-64, -720, 64, -720, 30, -800, -30, -800]); fill(c, C.n1);
    c.fillStyle = C.n1; c.fillRect(-7, -872, 14, 80);
    for (const [w, a, b] of BT) { c.fillStyle = C.n0; c.fillRect(w / 2 - w * .14, b, w * .14, a - b); c.fillStyle = C.n2; c.fillRect(-w / 2, b, w, 9) }
    let idx = 0;
    for (const [w, a, b] of BT) {
      const cols = Math.floor((w - 40) / 40), x1 = -((cols - 1) * 40) / 2;
      for (let y = b + 34; y < a - 30; y += 38) for (let j = 0; j < cols; j++) {
        const tt = t0 + H1(idx * 1.7 + 3) * 1.0, lit = at(t, tt, tt + .08); idx++;
        c.fillStyle = lit >= 1 ? C.am4 : lit > 0 ? mixc(C.n2, C.am4, lit) : C.n2;
        c.fillRect(x1 + j * 40 - 8, y, 16, 22);
      }
    }
    c.restore();
  }
  // верблюд-дромадер (силуэт), ноги — отдельно, чтобы колени были острыми
  const CAMB = [40, -150, 70, -196, 130, -214, 176, -286, 226, -290, 270, -226, 300, -208, 322, -262, 342, -304, 372, -322, 400, -314, 418, -296, 410, -284, 384, -280, 362, -262, 348, -218, 334, -168, 312, -128, 250, -108, 180, -100, 110, -110, 58, -118];
  function camelSil(c, x, y, s, col, step = 0) {
    c.save(); c.translate(x, y); c.scale(s, s); c.translate(-230, 0);
    spline(c, CAMB); fill(c, col);
    c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = 9; c.beginPath(); c.moveTo(44, -164); c.quadraticCurveTo(22, -140, 26, -104); c.stroke();
    const sw = Math.sin(step) * 8;
    for (const [lx, d] of [[62, sw], [94, -sw], [262, -sw], [294, sw]]) { poly(c, [lx - 11, -124, lx + 11, -124, lx + 8 + d * .5, -58, lx + 7 + d, 0, lx - 7 + d, 0, lx - 9 + d * .5, -58]); fill(c, col) }
    c.restore();
  }
  function crown(c, x, y, s, col) {
    c.save(); c.translate(x, y); c.scale(s, s);
    poly(c, [-120, 60, -150, -60, -70, 6, 0, -96, 70, 6, 150, -60, 120, 60]); fill(c, col);
    c.fillStyle = col; c.fillRect(-124, 70, 248, 30);
    for (const [px, py] of [[-150, -60], [0, -96], [150, -60]]) circ(c, px, py - 18, 20, col);
    c.restore();
  }
  // пачки 1973: CAMEL (жёлтая: верблюд, пирамиды, пальма) и WINSTON (бело-синяя)
  function camelPack(c, x, y, s, r) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    rr(c, -130 + 14, -190 + 18, 260, 380, 16); fill(c, 'rgba(20,25,53,.28)');
    rr(c, -130, -190, 260, 380, 16); fill(c, '#ecc062');
    c.save(); rr(c, -130, -190, 260, 380, 16); c.clip();
    c.fillStyle = '#d9a03f'; c.fillRect(-130, 92, 260, 110);
    poly(c, [-118, 92, -52, 8, 14, 92]); fill(c, '#c98f32'); poly(c, [-52, 8, 14, 92, -20, 92]); fill(c, '#b47c27');
    poly(c, [-20, 92, 26, 40, 72, 92]); fill(c, '#d9a03f');
    c.strokeStyle = '#5a3a16'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(92, 92); c.quadraticCurveTo(84, 40, 96, 0); c.stroke();
    for (const a of [-2.6, -1.9, -1.2, -.5, .2]) { c.save(); c.translate(96, 0); c.rotate(a); leafPath(c, 0, 0, 52, 13); fill(c, '#5a3a16'); c.restore() }
    camelSil(c, -10, 120, .34, '#4a2f12');
    c.restore();
    tx(c, 'CAMEL', 0, -128, { f: 'O', w: 700, s: 84, ls: 6, c: '#3d2a12' });
    c.fillStyle = '#3d2a12'; c.fillRect(-96, -78, 192, 5);
    rr(c, -130, -190, 260, 380, 16); stroke(c, C.n0, 6);
    c.restore();
  }
  function winstonPack(c, x, y, s, r) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    rr(c, -130 + 14, -190 + 18, 260, 380, 16); fill(c, 'rgba(20,25,53,.28)');
    rr(c, -130, -190, 260, 380, 16); fill(c, C.white);
    c.save(); rr(c, -130, -190, 260, 380, 16); c.clip();
    c.fillStyle = '#1d4fa0'; c.fillRect(-130, -190, 260, 210);
    c.fillStyle = '#163d80'; c.fillRect(-130, 4, 260, 16);
    c.restore();
    circ(c, 0, -122, 36, C.white); circ(c, 0, -122, 28, '#1d4fa0'); poly(c, [-14, -136, 14, -136, 18, -112, 0, -102, -18, -112]); fill(c, C.white);
    tx(c, 'WINSTON', 0, -40, { f: '"Liberation Serif"', w: 700, s: 54, ls: 2, c: C.white });
    tx(c, 'FILTER CIGARETTES', 0, 60, { f: 'O', w: 500, s: 22, ls: 3, c: '#1d4fa0' });
    c.fillStyle = C.red; c.fillRect(-90, 92, 180, 6);
    rr(c, -130, -190, 260, 380, 16); stroke(c, C.n0, 6);
    c.restore();
  }
  // меморандум 640×800: печатные строки, цитата по словам голоса, маркер, подпись, штамп
  const MW = 640, MH = 800, QL = [['МЫ', 'ДОЛЖНЫ', 'ПОЛУЧИТЬ'], ['СВОЮ', 'ДОЛЮ'], ['МОЛОДЁЖНОГО', 'РЫНКА']];
  let QFS = 48;
  function qLayout(c) { QFS = Math.min(48, 48 * 528 / Math.max(...QL.map(q => tw(c, q.join(' '), { s: 48 })))); return QFS }
  function stampBox(c, s, x, y, k, col, r = -.2, fs = 50, bg) {
    if (k <= 0) return;
    const sc = lp(1.9, 1, bo(k));
    c.save(); c.translate(x, y); c.rotate(r); c.scale(sc, sc); c.globalAlpha *= cl(k * 5) * .94;
    const w = tw(c, s, { s: fs, ls: 6 }) + fs * 1.1, h = fs * 1.9;
    if (bg) { rr(c, -w / 2, -h / 2, w, h, 14); fill(c, bg) }
    c.strokeStyle = col; rr(c, -w / 2, -h / 2, w, h, 14); c.lineWidth = 7; c.stroke();
    rr(c, -w / 2 + 11, -h / 2 + 11, w - 22, h - 22, 8); c.lineWidth = 2.5; c.stroke();
    tx(c, s, 0, 3, { s: fs, ls: 6, c: col });
    c.restore();
  }
  function memo(c, t, o = {}) {
    const F = o.full;
    if (o.sh !== false) { c.fillStyle = o.shc || 'rgba(20,25,53,.22)'; c.fillRect(18, 22, MW, MH) }
    c.fillStyle = C.white; c.fillRect(0, 0, MW, MH);
    tx(c, 'R.J. REYNOLDS TOBACCO COMPANY', 56, 72, { f: 'J', w: 700, s: 22, ls: 2, c: C.n1, al: 'left' });
    c.fillStyle = C.n1; c.fillRect(56, 96, MW - 112, 4);
    tx(c, 'МЕМОРАНДУМ', 56, 150, { s: 50, c: C.ink, al: 'left' });
    tx(c, '2 ФЕВРАЛЯ 1973', 56, 200, { f: 'J', w: 500, s: 24, ls: 1, c: C.n2, al: 'left' });
    [520, 470, 505, 330, 480].forEach((L, i) => { const t0 = K.typ + i * .16, k = F ? 1 : eo(at(t, t0, t0 + .2)); if (k > 0) { rr(c, 56, 250 + i * 32, L * k, 13, 6.5); fill(c, C.pa2) } });
    const fs = qLayout(c), sp = tw(c, ' ', { s: fs });
    let wi = 0;
    QL.forEach((L, i) => {
      const y = 470 + i * fs * 1.25;
      if (i === 2) { const m = F ? 1 : eio(at(t, K.q4 - .05, K.q5 + .15)); if (m > 0) { const w = (tw(c, L.join(' '), { s: fs }) + 28) * m; poly(c, [44, y - fs * .52, 44 + w, y - fs * .56, 44 + w - 6, y + fs * .52, 40, y + fs * .5]); fill(c, C.mk) } }
      let x = 56;
      for (const w of L) { const t0 = K.qt[wi++] - .06, k = F ? 1 : eo(at(t, t0, t0 + .22)); if (k > 0) tx(c, w, x, y + (1 - k) * 20, { s: fs, c: C.ink, al: 'left', a: k }); x += tw(c, w, { s: fs }) + sp }
    });
    const ks = F ? 1 : eio(at(t, K.sig, K.sig + .45));
    if (ks > 0) {
      c.save(); c.strokeStyle = C.n1; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
      for (let i = 0; i <= 70 * ks; i++) { const u = i / 70, px = 60 + u * 220, py = 700 + Math.sin(u * 17) * 15 * (1 - u * .5) - u * 10 + Math.sin(u * 5) * 6; i ? c.lineTo(px, py) : c.moveTo(px, py) }
      c.stroke(); c.restore();
      tx(c, 'К. ТИГ · ОТДЕЛ ИССЛЕДОВАНИЙ', 60, 748, { f: 'J', w: 500, s: 17, ls: 1, c: C.n2, al: 'left', a: F ? 1 : at(t, K.sig + .1, K.sig + .35) });
    }
    stampBox(c, 'СЕКРЕТНО', 450, 318, F ? 1 : at(t, K.secret, K.secret + .26), C.red);
    if (o.done) { stampBox(c, 'ПЛАН', 320, 470, o.done, '#1f9b7c', -.12, 92, 'rgba(255,255,255,.94)'); stampBox(c, 'ВЫПОЛНЕН', 320, 610, at(o.done, .25, 1), '#1f9b7c', -.12, 70, 'rgba(255,255,255,.94)') }
  }
  const MEMO = { x: 960, y: 560, s: .62, r: .03 };
  const memoW = (lx, ly, P = MEMO) => { const [x, y] = rot((lx - MW / 2) * P.s, (ly - MH / 2) * P.s, P.r); return [P.x + x, P.y + y] };
  function memoAt(c, t, p, o) { c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.scale(p.s, p.s); c.translate(-MW / 2, -MH / 2); memo(c, t, o); c.restore() }
  // корнер-метка года (экран): плашка + цифры, как барабан в углу
  function yearPlate(c, x, y, s, a) {
    if (a <= 0 || s <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= a;
    rr(c, -300 + 14, -125 + 16, 600, 250, 40); fill(c, 'rgba(20,25,53,.3)');
    rr(c, -300, -125, 600, 250, 40); fill(c, C.n0);
    c.restore();
  }

  // ================= 1. сегодня: заголовок → вейп; лучи, пар, манго, мята, зачёркнутые сигареты =================
  const V1 = { x: 960, y: 640, r: -.1, s: .84 };
  const v1p = (lx, ly) => { const [x, y] = rot(lx * V1.s, ly * V1.s, V1.r); return [V1.x + x, V1.y + y] };
  const BGV = [
    { x: 300, y: 860, r: .16, s: .54, body: C.mint, shade: C.mint2, mp: C.wh, mps: C.pa2, lc: C.wh, label: 'MINT', d: 0 },
    { x: 1640, y: 850, r: -.2, s: .52, body: C.white, shade: C.pa2, mp: C.n3, mps: C.n2, lc: C.ink, label: 'BERRY', d: .12 },
  ];
  const BIGCIG = [{ x: 400, y: 250, r: -.3, d: 0 }, { x: 1520, y: 250, r: .3, d: .1 }];
  function cam1(t) {
    const [fx, fy] = v1p(0, 30);
    const kp = eio(at(t, K.push, K.liq));
    const s0 = lp(1, 1.1, kp), x0 = lp(960, 960 + (fx - 960) * .35, kp), y0 = lp(540, 540 + (fy - 540) * .35, kp);
    const kz = at(t, K.liq, K.zoomE);
    if (kz <= 0) return { s: s0, x: x0, y: y0, r: 0 };
    const e = eio(kz), s = s0 * Math.pow(48 / s0, e), r = lp(0, -V1.r, e);
    const P0x = 960 + s0 * (fx - x0), P0y = 540 + s0 * (fy - y0), m = ss(0, .8, kz);
    const [qx, qy] = rot((lp(P0x, 960, m) - 960) / s, (lp(P0y, 540, m) - 540) / s, -r);
    return { s, x: fx - qx, y: fy - qy, r };
  }
  const TITLE = ['ЧТО', 'ВЫ', 'ЗНАЕТЕ', 'ОБ', 'ОДНОРАЗКАХ?'];
  function titleText(c, t, a) {
    const fs0 = 104, o = { s: fs0, w: 800, ls: 2 }, full = tw(c, TITLE.join(' '), o), fs = Math.min(fs0, fs0 * 1760 / full), oo = { s: fs, w: 800, ls: 2, c: C.white };
    const sp = tw(c, ' ', oo) + 2, ws = TITLE.map(w => tw(c, w, oo)), tot = ws.reduce((p, q) => p + q, 0) + sp * (TITLE.length - 1);
    let x = 960 - tot / 2;
    TITLE.forEach((w, j) => { const t0 = Math.max(.06, K.tw[j] - .12), k = eo(at(t, t0, t0 + .26)); if (k > 0) tx(c, w, x, 540 + (1 - k) * 90, { ...oo, al: 'left', a: a * cl(k * 2) }); x += ws[j] + sp });
  }
  function heroVape(c, t) {
    const k = eio(at(t, K.morph, K.morphE));
    if (k < 1) {
      const cx = lp(960, V1.x, k), cy = lp(540, V1.y, k), w = lp(2040, 230 * V1.s, k), h = lp(250, 640 * V1.s, k), r = Math.min(lp(0, 58 * V1.s, k), w / 2, h / 2), ro = lp(0, V1.r, k);
      c.save(); c.translate(cx, cy); c.rotate(ro); rr(c, -w / 2, -h / 2, w, h, r); fill(c, C.red);
      c.save(); c.clip();
      const sw = 70 * V1.s * ss(.55, 1, k); if (sw > 0) { c.fillStyle = C.red2; c.fillRect(w / 2 - sw, -h / 2, sw, h) }
      const ta = 1 - ss(0, .32, k); if (ta > 0) { c.rotate(-ro); c.translate(-cx, -cy); titleText(c, t, ta) }
      c.restore(); c.restore();
      if (t < K.morphE - .06) return;
    }
    const led = Math.max(pulse(t, K.puff1), pulse(t, K.puff2), pulse(t, K.want), ss(K.drag - .1, K.drag, t));
    c.save(); c.translate(V1.x, V1.y); c.rotate(V1.r); c.scale(V1.s, V1.s);
    vapeBody(c, { ...HERO, t, led, mk: bo(at(t, K.morphE - .06, K.morphE + .26)), wk: spr(at(t, K.morphE - .02, K.morphE + .42)), lk: at(t, K.morphE + .1, K.morphE + .35), bub: 1 - at(t, K.liq, K.liq + .25) });
    c.restore();
  }
  function shot1(c, t) {
    c.fillStyle = C.deep; c.fillRect(-200, -200, WW + 400, HH + 400);
    const K1 = cam1(t);
    c.save(); cam(c, K1.s, K1.x, K1.y, K1.r);
    deepBg(c, 960, 600);
    const kr = eo(at(t, K.morph, K.morph + .7)); if (kr > 0) { c.save(); c.globalAlpha = .55 * kr; sunburst(c, 960, 600, t * .16 + .2, 18, C.ray); c.restore() }
    if (t < K.morph) { const hb = 250 * eo(at(t, 0, .3)); c.fillStyle = C.red; c.fillRect(-60, 540 - hb / 2, WW + 120, hb); c.save(); c.beginPath(); c.rect(0, 540 - hb / 2, WW, hb); c.clip(); titleText(c, t, 1); c.restore() }
    else {
      // большие зачёркнутые сигареты — фон
      for (const b of BIGCIG) {
        const k = eo(at(t, K.cig + b.d, K.cig + b.d + .45)); if (k <= 0) continue;
        c.save(); c.translate(b.x, b.y + (1 - k) * -360); cig(c, 0, 0, 820, 98, b.r, { a: .3 * k });
        const ks = eio(at(t, K.cross + b.d, K.cross + b.d + .22)), ax = Math.cos(b.r + 1.2) * 230, ay = Math.sin(b.r + 1.2) * 230;
        c.globalAlpha = .75; slash(c, -ax, -ay, ax, ay, ks, 34, C.red); c.restore();
      }
      for (const [x, y, t0, r, col] of [[760, 232, K.bgv + .2, 24, C.white], [1205, 178, K.bgv + .35, 18, C.am3], [1236, 905, K.bgv + .5, 22, C.mint], [690, 940, K.bgv + .6, 16, C.white]]) spark(c, x, y, r * spr(at(t, t0, t0 + .4)) * (1 + .15 * Math.sin(t * 6 + x)), col);
      for (const b of BGV) {
        const k = eo(at(t, K.bgv + b.d, K.bgv + b.d + .5)); if (k <= 0) continue;
        c.save(); c.translate(b.x, b.y + (1 - k) * 760); c.rotate(b.r); c.scale(b.s, b.s);
        vapeBody(c, { ...b, liq: C.am, liq2: C.am3, led: pulse(t, K.par + .1 + b.d), t: t + b.x, level: -40 }); c.restore();
      }
      const km = spr(at(t, K.mango, K.mango + .45)); mango(c, 560, 640 + Math.sin(t * 2.2) * 8, km * 1.05, -.15 + .05 * Math.sin(t * 1.7)); mangoSlice(c, 640, 300 + Math.sin(t * 1.9 + 2) * 8, spr(at(t, K.mango + .12, K.mango + .57)) * .95, .3 + .04 * Math.sin(t * 1.6)); mangoSlice(c, 420, 470 + Math.sin(t * 1.7) * 8, spr(at(t, K.mango + .22, K.mango + .67)) * .7, -.5 + .05 * Math.sin(t * 1.4));
      const kn = spr(at(t, K.mint, K.mint + .45)); mintLeaf(c, 1360, 330 + Math.sin(t * 2 + 1) * 8, kn * .95, -.55 + .06 * Math.sin(t * 1.9 + 1)); mintLeaf(c, 1390, 660 + Math.sin(t * 2.3) * 8, spr(at(t, K.mint + .12, K.mint + .57)) * .8, .45 + .05 * Math.sin(t * 1.5));
      heroVape(c, t);
      // густой пар: облака держатся вокруг вейпа
      const [px, py] = v1p(0, -470);
      for (let i = 0; i < 7; i++) {
        const t0 = K.par - .35 + i * .09, k = eo(at(t, t0, t0 + .8)); if (k <= 0) continue;
        const a = -Math.PI / 2 + (i - 3) * .42, d = 120 + 70 * (i % 3);
        cloud(c, px + Math.cos(a) * d * k + Math.sin(t * .9 + i) * 10, py + 40 + Math.sin(a) * d * k * .55 + Math.cos(t * .8 + i) * 8, (1.05 + .25 * H1(i)) * k, 1, i * 5, C.white);
      }
      for (const a of [K.puff1, K.puff2]) puff(c, t, a, px, py, 1, 1);
      for (const b of BGV) { const [qx, qy] = rot(0, -470 * b.s, b.r); puff(c, t, K.par + .1 + b.d, b.x + qx, b.y + qy, b.r > 0 ? 1 : -1, .62) }
    }
    c.restore();
  }

  // ================= 2. 1973: в жидкости — молекула; заводы, барабан лет, империя, пачки, меморандум =================
  const DRUMY = [2026, 2020, 2010, 2000, 1990, 1980, 1973];
  function cam2(t) {
    let s = lp(1, 1.04, eio(at(t, K.emp, K.prep))), x = 960, y = 540, r = 0;
    const k1 = eio(at(t, K.goal - .15, K.goal + .55)); s = lp(s, 1.95, k1); x = lp(x, MEMO.x, k1); y = lp(y, MEMO.y, k1); r = lp(0, -MEMO.r, k1);
    const k2 = eio(at(t, K.comp - .25, K.comp + .45)), QY = memoW(320, 470 + QFS * 1.25)[1]; s = lp(s, 2.5, k2); y = lp(y, QY, k2);
    const kz = at(t, K.prob - .3, K.prob + .25);
    if (kz > 0) { const [mx, my] = memoW(56 + tw(X, QL[2].join(' '), { s: QFS }) / 2, 470 + 2 * QFS * 1.25 + QFS * .46), Z = zoomCam(kz, mx, my, s, 14, x, y); return { s: Z.s, x: Z.x, y: Z.y, r } }
    return { s, x, y, r };
  }
  function memoPose(t) {
    const k = at(t, K.prep, K.prep + .7), e = spr(k), u = at(t, K.secret + .05, K.secret + .3);
    return { x: lp(1760, MEMO.x, e), y: lp(1520, MEMO.y, e) + Math.sin(Math.PI * u) * 8, r: lp(.42, MEMO.r, eo(k)), s: MEMO.s };
  }
  function drumAt(c, t) {
    if (t < K.fifty || t > K.y73go + .5) return;
    const a = spr(at(t, K.fifty, K.fifty + .35)), e = eio(at(t, K.y73go, K.y73go + .5)), hk = at(t, K.y73, K.y73 + .3), sc = (1 + .1 * Math.sin(Math.PI * hk)) * a;
    const x = lp(960, 174, e), y = lp(330, 112, e), s = lp(1, .36, e) * sc;
    yearPlate(c, x, y, s, 1);
    c.save(); c.translate(x, y); c.scale(s, s); yearDrum(c, t, DRUMY, K.drumT, 0, 0, { s: 200, c: C.white, dir: -1 }); c.restore();
    if (hk > 0 && hk < 1 && e <= 0) {   // удар: короткие черты вокруг плашки
      c.save(); c.strokeStyle = C.n0; c.lineWidth = 8; c.lineCap = 'round'; c.globalAlpha = 1 - hk;
      for (let i = 0; i < 10; i++) { const an = i / 10 * TAU, r0 = 330 + 60 * eo(hk), r1 = r0 + 50; c.beginPath(); c.moveTo(x + Math.cos(an) * r0, y + Math.sin(an) * r0 * .55); c.lineTo(x + Math.cos(an) * r1, y + Math.sin(an) * r1 * .55); c.stroke() }
      c.restore();
    }
  }
  function shot2(c, t) {
    c.fillStyle = C.am; c.fillRect(-200, -200, WW + 400, HH + 400);
    const K2 = cam2(t); c.save(); cam(c, K2.s, K2.x, K2.y, K2.r);
    // пузырьки — мы внутри жидкости
    if (t < K.giants2 + .6) for (let i = 0; i < 26; i++) {
      const ph = ((t - K.zoomE) * (.18 + .12 * H1(i)) + H1(i * 3.3)) % 1, a = 1 - ss(K.giants, K.giants2 + .6, t);
      circ(c, H1(i * 7.1) * 2000 - 40 + Math.sin(t * 1.5 + i) * 20, lp(1200, -120, ph), (8 + 34 * H1(i * 2.9)) * a, C.am3);
    }
    // водяной знак империи
    const kw = eo(at(t, K.emp, K.emp + .8)); if (kw > 0) { c.save(); c.globalAlpha = .62 * kw; const sc = lp(.92, 1, kw); camelSil(c, 960, 860, 2.0 * sc, C.am2, t * 1.5); crown(c, 960, 170, .95 * sc, C.am2); c.restore() }
    // земля и заводы поднимаются
    const kg = eo(at(t, K.giants, K.giants + .55)), gy = (1 - kg) * 700;
    if (kg > 0) {
      const hk = lp(.45, 1, spr(at(t, K.giants2, K.giants2 + .6)));
      c.fillStyle = C.am2; c.fillRect(-400, 905 + gy, WW + 800, 700);
      factory(c, t, 60, 905 + gy, .72, { flip: true, h: hk, t0: K.giants2, seed: 1 });
      factory(c, t, 1860, 905 + gy, .72, { h: hk, t0: K.giants2 + .3, seed: 2 });
      factory(c, t, 360, 905 + gy, .95, { h: hk, t0: K.giants2 + .15, seed: 3 });
      factory(c, t, 1560, 905 + gy, .95, { flip: true, h: hk, t0: K.giants2 + .45, seed: 4 });
    }
    const kb = eo(at(t, K.emp, K.emp + .7)); if (kb > 0) building(c, t, 960, 905 + (1 - kb) * 1000, .86, K.emp2);
    // молекула никотина собирается из пузырьков и уплывает
    const km = at(t, K.inv - .1, K.inv + .7), mo = eio(at(t, K.giants2 + .1, K.fifty - .05));
    if (km > 0 && mo < 1) { c.save(); c.translate(960, 380 - mo * 520); c.rotate(mo * .6); c.globalAlpha = 1 - mo * .3; molecule(c, 0, 0, 1.35 * (1 - mo * .5), km, C.n0, C.white); c.restore() }
    const kl = spr(at(t, K.rey, K.rey + .4)); if (kl > 0) plate(c, 'R.J. REYNOLDS TOBACCO', 960, 975, kl, { s: 30, bg: C.n0, c: C.white, ls: 5 });
    camelPack(c, 560, 700, spr(at(t, K.camel - .08, K.camel + .45)) * .92, lp(-.3, -.08, eo(at(t, K.camel - .08, K.camel + .5))));
    winstonPack(c, 1360, 700, spr(at(t, K.winston - .08, K.winston + .45)) * .92, lp(.3, .08, eo(at(t, K.winston - .08, K.winston + .5))));
    if (t >= K.prep) memoAt(c, t, memoPose(t));
    c.restore();
    drumAt(c, t);
    const ki = eio(at(t, K.prob - .05, K.prob + .3)); if (ki > 0) circ(c, 960, 540, ki * 1150, C.mk);
  }

  // ================= голова в профиль с горлом в разрезе (горло, лаборатория, «мягкий пар», школьники) =================
  const HEADP = [-130, 480, -140, 300, -175, 150, -245, 20, -265, -110, -220, -240, -110, -315, 30, -320, 150, -265, 205, -170, 220, -95, 214, -60, 240, -10, 286, 52, 272, 72, 238, 80, 246, 112, 236, 126, 246, 142, 226, 170, 236, 208, 205, 245, 140, 262, 100, 285, 95, 360, 100, 480, 0, 480, -70, 480];
  const AIR = [232, 126, 175, 128, 90, 134, 10, 150, -48, 196, -56, 270, -48, 360, -44, 520];
  const AIRL = (() => { const L = [0]; for (let i = 2; i < AIR.length; i += 2) L.push(L[L.length - 1] + Math.hypot(AIR[i] - AIR[i - 2], AIR[i + 1] - AIR[i - 1])); return L })();
  function airPt(u) {
    const d = cl(u) * AIRL[AIRL.length - 1]; let i = 1; while (i < AIRL.length - 1 && AIRL[i] < d) i++;
    const k = (d - AIRL[i - 1]) / ((AIRL[i] - AIRL[i - 1]) || 1); return [lp(AIR[2 * i - 2], AIR[2 * i], k), lp(AIR[2 * i - 1], AIR[2 * i + 1], k)];
  }
  function spikes(c, x, y, r, k, col) {
    if (k <= 0) return; c.beginPath();
    for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, rr2 = i % 2 ? r * (1 + .55 * k) : r * .8; i ? c.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2) : c.moveTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2) }
    c.closePath(); fill(c, col);
  }
  // o: s, flip, calm — цвет горла, irr 0..1 — раздражение, scr — царапины, cap 0..1, blobs — [[u, r, spikes]], body — цвет головы
  function head(c, t, x, y, o = {}) {
    const s = o.s || 1, body = o.body || C.n1;
    c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
    spline(c, HEADP); fill(c, body);
    c.beginPath(); c.ellipse(-60, 14, 30, 50, .1, 0, TAU); fill(c, mixc(body, C.white, .14));
    c.beginPath(); c.ellipse(-60, 14, 14, 26, .1, 0, TAU); fill(c, mixc(body, C.n0, .5));
    c.beginPath(); c.ellipse(176, -46, 17, 10, -.1, 0, TAU); fill(c, C.white); circ(c, 184, -46, 7, C.n0);
    c.strokeStyle = mixc(body, C.n0, .6); c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(150, -82); c.quadraticCurveTo(180, -96, 206, -84); c.stroke();
    if (o.cut !== false && (o.cutA ?? 1) > 0) {
      c.save(); c.globalAlpha *= o.cutA ?? 1;
      const ac = mixc(o.calm || C.wh, C.red, o.irr || 0);
      c.lineCap = 'round'; c.lineJoin = 'round';
      spline(c, AIR, false); stroke(c, mixc(body, C.n0, .55), 62);
      spline(c, AIR, false); stroke(c, ac, 42);
      const sk = o.scr || 0;
      if (sk > 0) {
        c.save(); c.globalAlpha = sk; c.strokeStyle = C.white; c.lineWidth = 6;
        for (const u of [.42, .55, .68, .8, .9]) { const [px, py] = airPt(u), [qx, qy] = airPt(u + .02); const nx = -(qy - py), ny = qx - px, L = Math.hypot(nx, ny) || 1; c.beginPath(); c.moveTo(px - nx / L * 14, py - ny / L * 14); c.lineTo(px + nx / L * 6, py + ny / L * 6 - 6); c.lineTo(px - nx / L * 4, py - ny / L * 4 + 6); c.lineTo(px + nx / L * 14, py + ny / L * 14); c.stroke() }
        c.restore();
      }
      for (const [u, r, sp, col] of (o.blobs || [])) { const [px, py] = airPt(u); spikes(c, px, py, r, sp, C.red2); cloud(c, px, py, r / 46, 1, u * 50, col || C.grey) }
      c.restore();
    }
    if ((o.cap || 0) > 0) {
      const k = o.cap; c.save(); c.translate(0, -(1 - k) * 260); c.globalAlpha *= cl(k * 3);
      spline(c, [-238, -196, -214, -280, -110, -346, 40, -342, 160, -278, 196, -228, 60, -236, -100, -214]); fill(c, C.mint);
      c.save(); c.clip(); c.fillStyle = C.mint2; c.fillRect(60, -360, 200, 160); c.restore();
      poly(c, [-212, -206, -380, -186, -372, -160, -214, -176]); fill(c, C.mint2);
      circ(c, -30, -346, 14, C.mint2);
      c.restore();
    }
    c.restore();
  }
  function check(c, x, y, r, k, col = C.mint) {
    if (k <= 0) return; const s = spr(k);
    c.save(); c.translate(x, y); c.scale(s, s); circ(c, 0, 0, r, col);
    c.strokeStyle = C.white; c.lineWidth = r * .22; c.lineCap = 'round'; c.lineJoin = 'round';
    drawOn(c, [-r * .45, 0, -r * .12, r * .32, r * .5, -r * .34], at(k, .2, .8)); c.restore();
  }

  // ================= лаборатория =================
  // колба Эрленмейера: (x, y) — середина дна; level 0..1, label
  function flask(c, x, y, s, r, o) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const P = [-120, 0, -120, -14, -26, -190, -26, -270, 26, -270, 26, -190, 120, -14, 120, 0];
    poly(c, P); fill(c, 'rgba(207,224,255,.22)');
    c.save(); poly(c, P); c.clip(); const lv = o.level ?? .55; c.fillStyle = o.liq; c.rotate(-r); c.fillRect(-400, -lv * 190, 800, 700); c.restore();   // поверхность жидкости — всегда горизонтально
    poly(c, P); c.lineJoin = 'round'; stroke(c, C.white, 7);
    rr(c, -36, -284, 72, 22, 8); fill(c, C.white);
    if (o.label) plate(c, o.label, 0, -64, 1, { s: 24, ls: 2, bg: C.white, c: C.ink, sh: false });
    c.restore();
  }
  // стакан: (x, y) — середина дна, ширина 230, высота 270
  function beaker(c, t, x, y, s, o) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s);
    const P = [-115, 0, -115, -250, -128, -270, 128, -270, 115, -250, 115, 0];
    poly(c, P); fill(c, 'rgba(207,224,255,.2)');
    const lv = o.level || 0;
    if (lv > 0) {
      c.save(); poly(c, P); c.clip();
      const top = -lv * 240; c.beginPath(); c.moveTo(-140, top); for (let x2 = -140; x2 <= 140; x2 += 8) c.lineTo(x2, top + Math.sin(x2 * .05 + t * 6) * 5 * (o.wave ?? 1)); c.lineTo(140, 10); c.lineTo(-140, 10); c.closePath(); fill(c, o.liq);
      const bk = o.bub || 0;
      if (bk > 0) { c.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 14; i++) { const ph = (t * (.7 + .5 * H1(i)) + H1(i * 2.2)) % 1; c.globalAlpha = bk; c.beginPath(); c.arc(-90 + 180 * H1(i * 5.5), lp(-8, top + 10, ph), 5 + 8 * H1(i * 3.3), 0, TAU); c.fill() } c.globalAlpha = 1 }
      if (o.swirl) { c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.ellipse(0, top + 60, 70, 18, 0, t * 5, t * 5 + 4.2); c.stroke() }
      c.restore();
    }
    poly(c, P); c.lineJoin = 'round'; stroke(c, C.white, 7);
    for (let i = 1; i <= 4; i++) { c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(-100, -i * 50, 26, 5) }
    c.restore();
  }
  // кристалл соли: грани в три тона
  function crystal(c, x, y, s, r, o = {}) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const O = [0, -160, 96, -70, 96, 60, 0, 160, -96, 60, -96, -70], M = [0, -40];
    if (o.sh !== false) { c.save(); c.translate(14, 16); poly(c, O); fill(c, 'rgba(10,16,48,.3)'); c.restore() }
    const F = [[0, 1, '#ffffff'], [1, 2, '#cfe0ff'], [2, 3, '#8fb4ff'], [3, 4, '#a8c6ff'], [4, 5, '#e6efff'], [5, 0, '#ffffff']];
    for (const [a, b, col] of F) { poly(c, [O[2 * a], O[2 * a + 1], O[2 * b], O[2 * b + 1], M[0], M[1]]); fill(c, col) }
    poly(c, O); c.lineJoin = 'round'; stroke(c, o.edge || '#4558a8', 6);
    c.strokeStyle = 'rgba(69,88,168,.55)'; c.lineWidth = 3; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(M[0], M[1]); c.lineTo(O[2 * i], O[2 * i + 1]); c.stroke() }
    rr(c, -50, -110, 16, 70, 8); fill(c, 'rgba(255,255,255,.8)');
    c.restore();
    if (o.shine) for (const [dx, dy, t0] of [[-110, -150, 0], [130, -60, .12], [90, 150, .24]]) spark(c, x + dx * s, y + dy * s, 26 * s * Math.sin(Math.PI * cl(o.shine - t0)), C.white);
  }
  // шкала-прибор: v 0..1
  function gauge(c, x, y, s, v, a) {
    if (a <= 0) return;
    c.save(); c.translate(x, y); c.scale(s * a, s * a);
    c.beginPath(); c.arc(0, 0, 170, Math.PI, TAU); c.lineTo(170, 26); c.lineTo(-170, 26); c.closePath(); fill(c, C.white);
    for (const [a0, a1, col] of [[0, .45, C.mint], [.45, .72, C.am], [.72, 1, C.red]]) { c.beginPath(); c.arc(0, 0, 140, Math.PI + a0 * Math.PI, Math.PI + a1 * Math.PI); c.lineWidth = 34; c.strokeStyle = col; c.stroke() }
    const an = Math.PI + v * Math.PI; c.save(); c.rotate(an); rr(c, -10, -8, 130, 16, 8); fill(c, C.n0); c.restore(); circ(c, 0, 0, 20, C.n0);
    c.restore();
  }
  // чертёж-набросок: «проект» — трубка с кристаллом в окошке
  function sketchSheet(c, t, x, y, s, r, o) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.fillStyle = 'rgba(10,16,48,.3)'; c.fillRect(-380 + 16, -240 + 18, 760, 480);
    c.fillStyle = '#eef4ff'; c.fillRect(-380, -240, 760, 480);
    c.strokeStyle = '#c9dbf5'; c.lineWidth = 2; c.beginPath(); for (let gx = -380; gx <= 380; gx += 40) { c.moveTo(gx, -240); c.lineTo(gx, 240) } for (let gy = -240; gy <= 240; gy += 40) { c.moveTo(-380, gy); c.lineTo(380, gy) } c.stroke();
    c.strokeStyle = C.bp; c.lineWidth = 6; c.lineJoin = 'round'; c.lineCap = 'round';
    const k = o.draw ?? 1;
    drawOn(c, rrPts(-300, -40, 600, 80, 30), k, true);
    drawOn(c, [-120, -40, -120, 40], at(k, .4, .6)); drawOn(c, [40, -40, 40, 40], at(k, .5, .7));
    drawOn(c, [-300, 90, 300, 90], at(k, .6, .9)); drawOn(c, [-300, 78, -300, 102], at(k, .6, .7)); drawOn(c, [300, 78, 300, 102], at(k, .8, .9));
    if (k > .55) crystal(c, -40, 0, .2 * spr(at(k, .55, 1)), 0, { sh: false });
    tx(c, 'ПРОЕКТ', -360, -200, { f: 'J', w: 700, s: 30, ls: 3, c: C.bp, al: 'left', a: at(k, .2, .5) });
    tx(c, 'R.J.R.', 360, 200, { f: 'J', w: 700, s: 26, ls: 2, c: C.bp, al: 'right', a: at(k, .3, .6) });
    const kx = o.x || 0;
    if (kx > 0) { slash(c, -230, -170, 230, 170, eio(at(kx, 0, .5)), 46, C.red); slash(c, 230, -170, -230, 170, eio(at(kx, .45, 1)), 46, C.red) }
    if (o.st) stampBox(c, 'СЕКРЕТНО', 150, -130, o.st, C.red, -.18, 52);
    c.restore();
  }

  // ================= архив и суд (как в пробе, свои цвета; в местных координатах кадра 1920×1080) =================
  const A = { bg: C.blue, disc: C.blue2, boxes: [['#1d4a94', '#123172', '#2a63b0', '#3a7cc9'], ['#24589f', '#173a80', '#3270bd', '#2a63b0']], main: '#1d4a94', mainD: '#123172',
    lidT: '#3a7cc9', lidF: '#2a63b0', lidD: '#1d4a94', lidIn: '#2a63b0', lidIn2: '#3a7cc9', open: C.glass, label: '#f2ede6', ink: '#0f2460', ink2: '#0b5088', sheet: '#f2ede6', sheetO: C.blue, sheetL: '#3a7cc9' };
  const BX = 960, BY = 900, BW = 400, BH = 290;
  function boxShape(c, x, y, w, h, o) {
    c.fillStyle = o.front; c.fillRect(x - w / 2, y - h, w, h);
    c.fillStyle = o.side; c.fillRect(x + w / 2 - w * .15, y - h, w * .15, h);
    if (o.lid) {
      const lh = Math.max(34, h * .2), d = 26;
      poly(c, [x - w / 2 - 8, y - h - 10, x + w / 2 + 8, y - h - 10, x + w / 2 + 8 - d, y - h - 10 - d, x - w / 2 - 8 + d, y - h - 10 - d]); fill(c, o.top);
      c.fillStyle = o.lid; c.fillRect(x - w / 2 - 8, y - h - 10, w + 16, lh);
    }
    if (o.handle !== false) { rr(c, x - w * .14, y - h + h * .34, w * .28, Math.max(12, h * .07), 8); fill(c, A.open) }
    if (o.label) { const lw = w * .36, lh = h * .24, ly = y - h * .45; c.fillStyle = A.label; c.fillRect(x - lw / 2, ly, lw, lh); c.fillStyle = A.sheetL; c.fillRect(x - lw / 2 + 10, ly + lh * .28, lw - 20, 5); c.fillRect(x - lw / 2 + 10, ly + lh * .6, (lw - 20) * .6, 5) }
  }
  const SIDE = [
    { x: 520, y: 900, w: 300, h: 220, d: 0, ty: 0 }, { x: 250, y: 900, w: 230, h: 160, d: .1, ty: 1 }, { x: 1660, y: 900, w: 320, h: 210, d: .2, ty: 0 },
    { x: 538, y: 660, w: 260, h: 180, d: .32, ty: 1 }, { x: 1640, y: 670, w: 240, h: 150, d: .44, ty: 1 },
  ];
  function sideBox(c, t, b, t0) {
    const k = at(t, t0 + b.d, t0 + b.d + .3); if (k <= 0) return;
    const u = at(t, t0 + b.d + .3, t0 + b.d + .5), sq = Math.sin(Math.PI * u) * (1 - u * .3);
    c.save(); c.translate(b.x, b.y - 640 * (1 - k * k)); c.scale(1 + .07 * sq, 1 - .09 * sq);
    const [front, side, lid, top] = A.boxes[b.ty]; boxShape(c, 0, 0, b.w, b.h, { front, side, lid, top, label: 1 });
    c.restore();
  }
  function lidClosed(c) {
    poly(c, [BX - 210, 598, BX + 210, 598, BX + 182, 568, BX - 182, 568]); fill(c, A.lidT);
    c.fillStyle = A.lidF; c.fillRect(BX - 210, 598, 420, 60);
    c.fillStyle = A.lidD; c.fillRect(BX + 210 - 63, 598, 63, 60);
  }
  // молоток тёмного дерева с золотыми кольцами; шарнир (px, py), голова — слева, th > 0 — поднят
  function gavel(c, px, py, th) {
    c.save(); c.translate(px, py); c.rotate(th);
    rr(c, -300, -15, 300, 30, 15); fill(c, C.wood2);
    rr(c, -300, -15, 300, 11, [15, 15, 0, 0]); fill(c, C.wood3);
    c.fillStyle = C.gold; c.fillRect(-26, -17, 14, 34); circ(c, 0, 0, 22, C.wood);
    rr(c, -356, -86, 72, 172, 20); fill(c, C.wood);
    c.fillStyle = C.gold; c.fillRect(-356, -62, 72, 16); c.fillRect(-356, 46, 72, 16);
    c.fillStyle = C.wood3; c.fillRect(-346, -80, 10, 160);
    c.restore();
  }
  const SB = { x: 1450, y: 850 };   // круглая подставка
  function soundBlock(c) {
    c.beginPath(); c.ellipse(SB.x, SB.y + 40, 120, 30, 0, 0, TAU); fill(c, C.wood);
    c.fillStyle = C.wood; c.fillRect(SB.x - 120, SB.y, 240, 40);
    c.fillStyle = C.gold; c.fillRect(SB.x - 120, SB.y + 14, 240, 10);
    c.beginPath(); c.ellipse(SB.x, SB.y, 120, 30, 0, 0, TAU); fill(c, C.wood3);
    c.beginPath(); c.ellipse(SB.x, SB.y, 84, 20, 0, 0, TAU); stroke(c, C.wood2, 4);
  }
  function scales(c, x, y, s, col, a) {
    if (a <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= a; c.fillStyle = col; c.strokeStyle = col; c.lineCap = 'round';
    c.fillRect(-12, -300, 24, 520); poly(c, [-150, 250, 150, 250, 90, 200, -90, 200]); fill(c, col); c.fillRect(-60, 220, 120, 30);
    circ(c, 0, -316, 30, col); rr(c, -300, -296, 600, 22, 11); fill(c, col);
    for (const sx of [-1, 1]) {
      c.lineWidth = 6; c.beginPath(); c.moveTo(sx * 290, -285); c.lineTo(sx * 290 - 90, -20); c.moveTo(sx * 290, -285); c.lineTo(sx * 290 + 90, -20); c.stroke();
      c.beginPath(); c.moveTo(sx * 290 - 120, -20); c.quadraticCurveTo(sx * 290, 90, sx * 290 + 120, -20); c.closePath(); fill(c, col);
    }
    c.restore();
  }
  function sheetShape(c, x, y, r, s, o = {}) {
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const sh = o.sh ?? 1; if (sh > 0) { c.fillStyle = `rgba(4,10,42,${.25 * sh})`; c.fillRect(-52, -68, 120, 156) }
    c.fillStyle = o.col || A.sheet; c.fillRect(-60, -78, 120, 156);
    if (o.red) { c.fillStyle = C.red; c.fillRect(-44, -62, 88, 12) }
    c.fillStyle = o.lines || A.sheetL; for (let i = 0; i < 4; i++) c.fillRect(-44, -30 + i * 22, i === 3 ? 50 : 88, 6);
    c.strokeStyle = A.sheetO; c.lineWidth = 3; c.strokeRect(-60, -78, 120, 156);
    c.restore();
  }
  const PAPERS = [...Array(26)].map((_, i) => {
    const a = lp(-2.85, -.3, H1(i * 3.3 + 1)), d = 380 + 520 * H1(i * 5.1 + 2), g = 300 + 120 * H1(i * 2.2), x0 = BX + (H1(i * 1.9) - .5) * 240;
    let dx = Math.cos(a) * d, dy = Math.sin(a) * d, gg = g; const ex = x0 + dx, ey = 585 + dy + g;
    if (ex > 300 && ex < 1620 && ey < 470) dx = (ex < 960 ? 300 - 150 * H1(i * 9.1) : 1620 + 150 * H1(i * 9.1)) - x0;
    else if (ex > 340 && ex < 1580) { dy = Math.max(dy, -70); gg = 90 + 60 * H1(i * 3.7) }
    return { d0: .02 + i * .008, dur: .8 + .25 * H1(i * 7.3), x0, y0: 585, dx, dy, g: gg, r0: (H1(i * 4.4) - .5) * .6, sp: (H1(i * 6.6) - .5) * 5, s: .85 + .4 * H1(i * 8.8), red: i % 5 === 2, seed: i };
  });
  function paperPose(p, t, t0) {
    const k = at(t, t0 + p.d0, t0 + p.d0 + p.dur), e = eo(k), w = at(t, t0 + p.d0 + p.dur, t0 + p.d0 + p.dur + .5);
    return { x: p.x0 + p.dx * e, y: p.y0 + p.dy * e + p.g * k * k + Math.sin(t * 1.7 + p.seed) * 3 * w, r: p.r0 + p.sp * e + Math.sin(t * 1.3 + p.seed) * .02 * w, s: p.s * (k < .15 ? lp(.4, 1, k / .15) : 1) };
  }
  // окно браузера 900×506 (дальше то же окно — карточка на карте): адрес, шапка архива, строки документов
  function browser(c, t, x, y, s, o = {}) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s);
    if (o.sh !== false) { rr(c, -450 + 16, -253 + 20, 900, 506, 22); fill(c, 'rgba(4,10,42,.35)') }
    rr(c, -450, -253, 900, 506, 22); fill(c, C.white);
    c.save(); rr(c, -450, -253, 900, 506, 22); c.clip();
    c.fillStyle = '#e9edf5'; c.fillRect(-450, -253, 900, 64);
    for (const [i, col] of [[0, C.red], [1, C.am], [2, C.mint]]) circ(c, -414 + i * 30, -221, 10, col);
    rr(c, -320, -240, 620, 38, 19); fill(c, C.white);
    tx(c, 'industrydocuments.ucsf.edu', -300, -221, { f: 'J', w: 500, s: 22, c: C.n2, al: 'left' });
    c.fillStyle = C.blue; c.fillRect(-450, -189, 900, 96);
    tx(c, 'АРХИВ ДОКУМЕНТОВ', -410, -156, { s: 32, ls: 3, c: C.white, al: 'left' });
    tx(c, 'ТАБАЧНЫХ КОМПАНИЙ · UCSF', -410, -118, { s: 22, ls: 3, c: '#9fc0ff', al: 'left' });
    const rk = o.rows ?? 1;
    for (let i = 0; i < 6; i++) {
      const k = eo(at(rk, i * .12, i * .12 + .4)); if (k <= 0) continue; const ry = -60 + i * 52;
      c.globalAlpha = k; c.fillStyle = '#eef2f9'; c.fillRect(-420, ry, 840 * k, 40);
      c.fillStyle = i === 2 ? C.red : '#3a7cc9'; c.fillRect(-404, ry + 10, 20, 20);
      rr(c, -370, ry + 13, (300 + 160 * H1(i * 3.1)) * k, 13, 6.5); fill(c, '#b8c4dc'); c.globalAlpha = 1;
    }
    if (o.count) tx(c, o.count, 410, -156, { s: 30, c: C.white, al: 'right' });
    c.restore(); c.restore();
  }

  // ================= 3. горло → лаборатория → проект → архив → суд (один мир, камера едет) =================
  const LAB = 2960, LAB2 = 3520, ARCH = { x: 3520, y: 1740 }, AOFF = [ARCH.x - 960, ARCH.y - 540];
  const SLANT = y => 1960 + (540 - y) * .18;
  const HP = { x: 780, y: 510, s: 1.0 }, LH = { x: 4010, y: 560, s: .78 };
  const hpW = (lx, ly, P = HP, fl = 1) => [P.x + lx * P.s * fl, P.y + ly * P.s];
  function cam3(t) {
    let x = 960, y = 540, s = lp(1, 1.05, eio(at(t, K.mapI, K.chemPan)));
    const kp = eio(at(t, K.chemPan, K.chemPan + .65)); x = lp(x, LAB, kp); s = lp(s, 1, kp);
    x = lp(x, LAB2, eio(at(t, K.softPan, K.softPan + .7)));
    y = lp(y, ARCH.y, eio(at(t, K.tilt, K.tilt + .6)));
    s *= lp(1, 1.035, eio(at(t, K.arch, K.pub)));
    const sh = (t2, a) => { const u = at(t, t2, t2 + .35); return u > 0 && u < 1 ? Math.sin(u * 40) * a * (1 - u) : 0 };
    y += sh(K.tob, 10) + sh(K.secrets, 14); x += sh(K.tear + .05, 9);
    const kz = at(t, K.bzoom, K.mapT);
    if (kz > 0) { const Z = zoomCam(kz, ARCH.x, ARCH.y + 60, s, 1920 / 900, x, y); return Z }
    return { s, x, y };
  }
  function pourStream(c, x1, y1, x2, y2, k, col) { if (k <= 0) return; c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = 18 * Math.min(1, k * 4); c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(x1 + (x2 - x1) * .2, y1 + 40, x2, lp(y1, y2, Math.min(1, k * 3))); c.stroke(); c.restore() }
  function flaskPose(t, t0, side) {   // side −1 — слева (никотин), +1 — справа (кислота)
    const kin = spr(at(t, t0 - .12, t0 + .38)), kt = eio(at(t, t0 + .12, t0 + .45)), kout = ei(at(t, t0 + 1.0, t0 + 1.45));
    const x = LAB + side * (lp(900, 330, kin) + kout * 700), y = lp(1300, 262, kin) - kout * 200;
    return { x, y, r: -side * 2.0 * kt * (1 - kout * .6), on: kin > 0 && kout < 1, pour: at(t, t0 + .4, t0 + .9) - at(t, t0 + .95, t0 + 1.05) };
  }
  function shot3(c, t) {
    const Q = cam3(t);
    c.fillStyle = C.mk; c.fillRect(-200, -200, WW + 400, HH + 400);
    c.save(); cam(c, Q.s, Q.x, Q.y);
    // фон: лаборатория (тёмно-синяя) справа за косой границей, архив ниже
    c.beginPath(); c.moveTo(SLANT(-3000), -3000); c.lineTo(9000, -3000); c.lineTo(9000, 1140); c.lineTo(SLANT(1140), 1140); c.closePath(); fill(c, C.n1);
    c.fillStyle = A.bg; c.fillRect(SLANT(1140) - 200, 1140, 9000, 3000);
    // ---- горло ----
    if (t < K.chemPan + .8) {
      for (let i = 0; i < 6; i++) { const ph = (t * .06 + H1(i * 2.7)) % 1; cloud(c, -300 + ph * 2400, 120 + 160 * i + 30 * Math.sin(t + i), 1.6 + .8 * H1(i), .22, i * 11, C.white) }
      const ent = (1 - eo(at(t, K.mapI - .05, K.mapI + .5))) * 760, ck = eo(at(t, K.usual - .1, K.usual + .35)), [mx, my0] = hpW(236, 126), my = my0 + ent;
      const cough = (at(t, K.tear, K.tear + .08) - at(t, K.tear + .5, K.tear + .7)) * Math.sin(t * 55) * 10;
      const blobs = [];
      for (let i = 0; i < 6; i++) { const t0 = K.smoke - .15 + i * .13, u = eio(at(t, t0, t0 + 1.3)) * (.62 + .06 * i); if (t >= t0) blobs.push([u + Math.sin(t * 2 + i) * .01, 30 + 8 * H1(i), eo(at(t, K.acrid, K.acrid + .3)), C.grey]) }
      head(c, t, HP.x + cough, HP.y + ent, { s: HP.s, calm: C.wh, irr: eo(at(t, K.acrid + .25, K.tear)) * .45 + .55 * eo(at(t, K.tear, K.tear + .25)), scr: at(t, K.tear, K.tear + .3), cap: spr(at(t, K.teens - .05, K.teens + .4)), blobs });
      if (ck > 0) {
        const L = 300, a = .08, cx = mx + cough + Math.cos(a) * L / 2 + (1 - ck) * 900, cy = my + Math.sin(a) * L / 2;
        cig(c, cx, cy, L, 38, a, { lit: 1, glow: pulse(t, K.smoke - .2) });
        const tipx = cx + Math.cos(a) * L / 2, tipy = cy + Math.sin(a) * L / 2;
        for (let m = 0; m < 4; m++) { const ph = ((t - K.usual) / 2 + m / 4) % 1; if (t > K.usual) cloud(c, tipx + 30 * eo(ph) + Math.sin(t * 2 + m) * 12, tipy - 30 - 240 * eo(ph), lp(.2, .8, eo(ph)) * (1 - ss(.7, 1, ph)), .9, m * 3, C.grey) }
      }
      const kl = at(t, K.tear, K.tear + .4);
      if (kl > 0 && kl < 1) { c.save(); c.strokeStyle = C.red2; c.lineWidth = 9; c.lineCap = 'round'; c.globalAlpha = 1 - kl; for (let i = 0; i < 5; i++) { const an = -1.1 + i * .45, [nx, ny] = hpW(96, 330); c.beginPath(); c.moveTo(nx + 40 + Math.cos(an) * (40 + 60 * kl), ny + Math.sin(an) * (40 + 60 * kl)); c.lineTo(nx + 40 + Math.cos(an) * (90 + 60 * kl), ny + Math.sin(an) * (90 + 60 * kl)); c.stroke() } c.restore() }
      plate(c, 'ДЕРЁТ ГОРЛО', 1470, 800, spr(at(t, K.throat - .05, K.throat + .35)), { s: 50, bg: C.red, c: C.white, r: -.04 });
    }
    // ---- лаборатория ----
    if (t > K.chemPan - .3 && t < K.tilt + .8) {
      c.fillStyle = C.n2; c.fillRect(2120, 196, 2600, 14);
      for (let i = 0; i < 16; i++) { const bx = 2180 + i * 150 + 40 * H1(i), bh = 50 + 50 * H1(i * 2.3); if (Math.abs(bx - LAB) < 140) continue; rr(c, bx - 20, 196 - bh, 40, bh, [10, 10, 2, 2]); fill(c, C.n2); c.fillStyle = C.n2; c.fillRect(bx - 8, 196 - bh - 18, 16, 20) }
      c.fillStyle = '#283573'; c.fillRect(2040, 812, 2800, 340); c.fillStyle = C.wh; c.fillRect(2040, 790, 2800, 24);
      for (let i = 0; i < 9; i++) { c.fillStyle = '#222d63'; c.fillRect(2080 + i * 300, 850, 270, 250); rr(c, 2080 + i * 300 + 120, 960, 30, 10, 5); fill(c, C.n2) }
      const kb = spr(at(t, K.mixw - .05, K.mixw + .35)), lvN = .24 * eio(at(t, K.nic + .4, K.nic + .95)), lvA = .24 * eio(at(t, K.acid + .4, K.acid + .95));
      const sk = eio(at(t, K.salt - .25, K.salt + .2));
      beaker(c, t, LAB, 790 + (1 - kb) * 600, Math.max(kb, .001) * 1.35, { level: (lvN + lvA) * (1 - sk * .6), liq: mixc(C.am, C.yel, at(t, K.acid + .5, K.got + .3)), bub: at(t, K.got - .1, K.got + .3) - at(t, K.salt + .3, K.salt + .7), swirl: t > K.got && t < K.salt + .3 });
      for (const [t0, side, col, lab] of [[K.nic, -1, C.am, 'НИКОТИН'], [K.acid, 1, C.mint, 'КИСЛОТА']]) {
        const F = flaskPose(t, t0, side); if (!F.on) continue;
        const [tx2, ty2] = rot(0, -284 * 1.1, F.r);
        pourStream(c, F.x + tx2, F.y + ty2, LAB + side * 30, 690, F.pour, col);
        flask(c, F.x, F.y, 1.1, F.r, { liq: col, level: lp(.62, .3, at(t, t0 + .4, t0 + 1)), label: lab });
      }
      // кристалл соли поднимается из стакана, потом становится мягким облаком и уходит в рот
      const kc = spr(at(t, K.salt - .15, K.salt + .45)), soft = eio(at(t, K.softPan + .25, K.softPan + .9));
      if (kc > 0 && soft < 1) crystal(c, LAB, lp(640, 300, kc) + Math.sin(t * 2) * 6, lp(.2, 1, kc) * (1 - soft), Math.sin(t * 1.4) * .05, { shine: at(t, K.salt, K.salt + .9) });
      plate(c, 'НИКОТИНОВАЯ СОЛЬ', LAB, 106, spr(at(t, K.salt + .1, K.salt + .5)) * (1 - eio(at(t, K.softPan, K.softPan + .3))), { s: 40, bg: C.white, c: C.ink });
      const [lmx, lmy] = hpW(236, 126, LH, -1), kh = eo(at(t, K.softPan - .1, K.softPan + .6));
      if (kh > 0) {
        const blobs = []; for (let i = 0; i < 4; i++) { const t0 = K.soft - .15 + i * .14, u = eio(at(t, t0, t0 + 1.2)) * (.7 + .05 * i); if (t >= t0) blobs.push([u, 28, 0, C.white]) }
        head(c, t, LH.x + (1 - kh) * 900, LH.y, { s: LH.s, flip: true, calm: C.mint, blobs, body: C.n0 });
      }
      if (soft > 0) { const k2 = eio(at(t, K.softPan + .55, K.soft + .05)); cloud(c, lp(LAB, lmx, k2), lp(300, lmy, k2), lp(1.6, .5, k2) * soft * (1 - at(t, K.soft, K.soft + .15)), 1, 7, C.white) }
      check(c, 3740, 770, 68, at(t, K.soft, K.soft + .5));
      gauge(c, 3330, 330, .82, eo(at(t, K.dose, K.dose2 + .15)) * (1 + .03 * Math.sin(t * 30) * at(t, K.dose2, K.dose2 + .1)), spr(at(t, K.dose - .1, K.dose + .3)));
      plate(c, 'ДОЗА НИКОТИНА', 3330, 400, spr(at(t, K.dose, K.dose + .35)), { s: 28, bg: C.white, c: C.ink });
      // проект: набросок → крест → «секретно» → уменьшается и падает в архив
      if (t > K.vop - .1 && t < K.arch + .02) {
        const kin = spr(at(t, K.vop - .1, K.vop + .4)), ks = eio(at(t, K.formula - .1, K.formula + .25)), kf = ei(at(t, K.hid - .05, K.arch));
        const x = LAB2, y = lp(1500, 500, kin) + lp(0, 1790 - 500, kf), s2 = lp(.95, .42, ks) * lp(1, .75, kf), r = lp(.2, -.03, eo(at(t, K.vop - .1, K.vop + .5))) + Math.sin(kf * 3) * .1;
        if (kf < .85) sketchSheet(c, t, x, y, s2, r, { draw: at(t, K.vop, K.vop + .8), x: at(t, K.fail - .05, K.fail + .45), st: at(t, K.secr, K.secr + .26) });
      }
    }
    // ---- архив и суд ----
    if (t > K.tilt - .1) { c.save(); c.translate(AOFF[0], AOFF[1]); archive(c, t); c.restore() }
    c.restore();
  }
  function archive(c, t) {
    circ(c, 960, 650, 470, A.disc);
    const sa = .08 + .015 * Math.sin(t * 2.2); c.save(); c.globalAlpha = sa; poly(c, [880, -80, 1040, -80, 1270, 905, 650, 905]); fill(c, C.spot); c.globalAlpha = sa * 1.4; c.beginPath(); c.ellipse(960, 905, 330, 44, 0, 0, TAU); fill(c, C.spot); c.restore();
    scales(c, 960, 470, .78, C.spot, .3 * eo(at(t, K.court - .1, K.court + .6)));
    for (const b of SIDE) sideBox(c, t, b, K.arch + .15);
    const kz = ei(at(t, K.arch, K.arch + .12));
    if (kz < 1) { c.save(); c.translate(0, 580); c.scale(1, 1 - kz); rr(c, BX - 196, -232, 392, 232, [16, 16, 0, 0]); fill(c, A.lidIn); rr(c, BX - 176, -212, 352, 196, 10); fill(c, A.lidIn2); c.restore() }
    poly(c, [BX - 200, 610, BX + 200, 610, BX + 174, 580, BX - 174, 580]); fill(c, A.open);
    if (t > K.arch - .3 && t < K.arch + .1) { const k = ei(at(t, K.arch - .3, K.arch)); sketchSheet(c, t, BX, lp(470, 760, k), .32, -.03, { draw: 1, x: 1, st: 1 }) }
    boxShape(c, BX, BY, BW, BH, { front: A.main, side: A.mainD, handle: false });
    c.fillStyle = A.label; c.fillRect(BX - 115, 712, 230, 86);
    tx(c, 'АРХИВ', BX, 745, { f: 'J', w: 700, s: 40, ls: 4, c: A.ink });
    tx(c, 'R.J.R. · 1973', BX, 778, { f: 'J', w: 500, s: 18, ls: 2, c: A.ink2 });
    c.fillStyle = C.red; c.fillRect(BX - 115, 806, 230, 10);
    // паутина в углу коробки — прошли годы
    const kw = at(t, K.y25b - .1, K.y25b + .5);
    if (kw > 0 && t < K.secrets) { c.save(); c.strokeStyle = 'rgba(242,237,230,.85)'; c.lineWidth = 3; const ox = BX - 200, oy = 610; for (let i = 0; i < 5; i++) { const an = Math.PI / 2 * i / 4; drawOn(c, [ox, oy, ox + Math.cos(an) * 150, oy + Math.sin(an) * 150], kw) } for (let j = 1; j <= 3; j++) drawOn(c, [...Array(5)].flatMap((_, i) => { const an = Math.PI / 2 * i / 4, rr2 = j * 42 + (i % 2) * 6; return [ox + Math.cos(an) * rr2, oy + Math.sin(an) * rr2] }), at(kw, .3 + j * .15, .7 + j * .1)); c.restore() }
    // закрытая крышка: падает, на «тайны» слетает
    const kc = at(t, K.arch + .12, K.arch + .26);
    if (kc > 0) {
      const u = at(t, K.arch + .26, K.arch + .42), kf = eo(at(t, K.secrets, K.secrets + .6));
      c.save(); c.translate(BX - 1380 * kf, 600 - 50 * (1 - kc * kc) - Math.sin(Math.PI * u) * 8 - 300 * kf - Math.sin(Math.PI * kf) * 110); c.rotate(-1.2 * kf); c.translate(-BX, -600); lidClosed(c); c.restore();
    }
    // листы: вылетают на «тайны», на «опубликовали» улетают в окно браузера
    const ku = K.pub;
    for (const p of PAPERS) if (t >= K.secrets + p.d0) {
      const q = paperPose(p, t, K.secrets), kb = eio(at(t, ku + p.seed * .015, ku + .45 + p.seed * .015));
      if (kb >= 1) continue;
      sheetShape(c, lp(q.x, 960, kb), lp(q.y, 600, kb), q.r * (1 - kb), q.s * (1 - kb * .85), { red: p.red });
    }
    // молоток: два удара сверху по подставке
    soundBlock(c);
    const ke = eo(at(t, K.court - .1, K.court + .35)), s1 = ei(at(t, K.tob - .2, K.tob)), r1 = eo(at(t, K.tob + .15, K.secrets - .3)), s2 = ei(at(t, K.secrets - .18, K.secrets)), kx = ei(at(t, K.n14 + .2, K.n14 + .6));
    if (ke > 0 && kx < 1) {
      let th = 1.1 * (1 - s1) + 1.0 * r1 * (1 - s2); const ub = at(t, K.tob, K.tob + .3), ub2 = at(t, K.secrets, K.secrets + .3);
      th += Math.sin(Math.PI * Math.min(1, ub * 1.6)) * .22 * (t < K.secrets - .3 ? 1 : 0) + Math.sin(Math.PI * Math.min(1, ub2 * 1.6)) * .22;
      gavel(c, lp(2200, SB.x + 320, ke) + kx * 700, lp(300, SB.y - 86, ke), th);
    }
    for (const th of [K.tob, K.secrets]) {
      const ku2 = at(t, th, th + .45); if (ku2 <= 0 || ku2 >= 1) continue;
      c.save(); c.globalAlpha = 1 - ku2; c.beginPath(); c.ellipse(SB.x, SB.y + 6, lp(120, 470, eo(ku2)), lp(30, 118, eo(ku2)), 0, 0, TAU); stroke(c, C.gold, 10);
      c.strokeStyle = C.white; c.lineWidth = 7; c.lineCap = 'round';
      for (let i = 0; i < 7; i++) { const an = lp(-2.9, -.25, i / 6), r0 = 120 + 110 * eo(ku2), r3 = r0 + 70; c.beginPath(); c.moveTo(SB.x + Math.cos(an) * r0, SB.y + Math.sin(an) * r0 * .6); c.lineTo(SB.x + Math.cos(an) * r3, SB.y + Math.sin(an) * r3 * .6); c.stroke() }
      c.restore();
    }
    // надписи
    const k25 = spr(at(t, K.y25 - .05, K.y25 + .4)) * (1 - eio(at(t, K.y98go - .2, K.y98go + .1)));
    plate(c, '25 ЛЕТ В АРХИВЕ', 960, 230, k25, { s: 80, bg: C.red, c: C.white, ls: 6 });
    const kcrt = spr(at(t, K.court + .05, K.court + .45)) * (1 - eio(at(t, K.n14 - .3, K.n14 - .05)));
    plate(c, 'СУД США · 1998', 960, 205, kcrt, { s: 58, bg: C.white, c: C.ink, ls: 6 });
    const kn = eo(at(t, K.n14, K.n14 + .25)) * (1 - eio(at(t, K.pub + .2, K.pub + .5)));
    if (kn > 0) {
      c.save(); c.globalAlpha = kn; rr(c, 960 - 430 + 12, 225 - 95 + 14, 860, 190, 36); fill(c, 'rgba(4,10,42,.35)'); rr(c, 960 - 430, 225 - 95, 860, 190, 36); fill(c, C.n0);
      num(c, fmt(Math.round(14e6 * eo(at(t, K.n14 + .05, K.n14 + .85)))), 960, 232, { s: 132, c: C.white }); c.restore();
      plate(c, 'ДОКУМЕНТОВ', 960, 372, spr(at(t, K.docs - .1, K.docs + .3)) * kn, { s: 42, bg: C.white, c: C.red, ls: 10 });
    }
    // окно браузера: архив опубликован
    const kbw = spr(at(t, K.pub - .05, K.pub + .4)); if (kbw > 0) browser(c, t, 960, 600, kbw, { rows: at(t, K.pub + .15, K.pub + 1.0), count: '14 000 000+' });
  }

  // ================= 4. Калифорния: окно архива → штат → залив → Стэнфорд; ноутбук, поиск, студенты =================
  const MX = lon => 960 + (lon + 122.27) * 1430, MY = lat => 540 + (37.62 - lat) * 1800;
  const LL = a => { const P = []; for (let i = 0; i < a.length; i += 2) P.push(MX(a[i]), MY(a[i + 1])); return P };
  const CA = LL([-124.21, 42.0, -120.0, 42.0, -120.0, 39.0, -114.63, 35.0, -114.57, 34.3, -114.43, 34.08, -114.72, 33.41, -114.72, 32.72, -117.12, 32.53, -117.28, 33.05, -118.1, 33.75, -118.5, 34.03, -119.2, 34.15, -120.6, 34.56, -120.64, 35.14, -121.29, 35.66, -121.9, 36.31, -121.95, 36.6, -121.8, 36.85, -122.02, 36.96, -122.33, 37.11, -122.41, 37.2, -122.44, 37.37, -122.43, 37.46, -122.51, 37.58, -122.5, 37.7, -122.513, 37.77, -122.485, 37.81, -122.53, 37.83, -122.66, 37.9, -122.8, 37.99, -123.02, 38.0, -123.1, 38.2, -123.7, 38.9, -123.8, 39.7, -124.36, 40.4, -124.1, 41.0, -124.21, 42.0]);
  const BAY = LL([-122.56, 37.808, -122.42, 37.808, -122.39, 37.8, -122.385, 37.76, -122.38, 37.73, -122.36, 37.72, -122.39, 37.7, -122.38, 37.66, -122.37, 37.62, -122.31, 37.585, -122.25, 37.55, -122.2, 37.51, -122.15, 37.48, -122.11, 37.465, -122.03, 37.45, -121.97, 37.465, -122.02, 37.52, -122.1, 37.58, -122.15, 37.63, -122.2, 37.7, -122.26, 37.74, -122.3, 37.78, -122.31, 37.82, -122.32, 37.87, -122.35, 37.91, -122.4, 37.94, -122.43, 37.96, -122.45, 37.99, -122.5, 37.98, -122.48, 37.92, -122.45, 37.86, -122.48, 37.855, -122.475, 37.83, -122.56, 37.832]);
  const CARD = { x: MX(-122.458), y: MY(37.763) }, STAN = { x: MX(-122.17), y: MY(37.4275) }, CAV = { x: 5279, y: 1206, s: .052 }, BAYV = { x: 930, y: 590 };
  // плавная ломаная через точки (Катмулл — Ром), чтобы пунктир «рисовался» по кривой
  function sampleSpline(P, per = 12) {
    const n = P.length / 2, g = i => { const j = Math.max(0, Math.min(n - 1, i)); return [P[2 * j], P[2 * j + 1]] }, out = [P[0], P[1]];
    for (let i = 0; i < n - 1; i++) { const [x0, y0] = g(i - 1), [x1, y1] = g(i), [x2, y2] = g(i + 1), [x3, y3] = g(i + 2);
      for (let k = 1; k <= per; k++) { const u = k / per, u2 = u * u, u3 = u2 * u;
        out.push(.5 * (2 * x1 + (-x0 + x2) * u + (2 * x0 - 5 * x1 + 4 * x2 - x3) * u2 + (-x0 + 3 * x1 - 3 * x2 + x3) * u3), .5 * (2 * y1 + (-y0 + y2) * u + (2 * y0 - 5 * y1 + 4 * y2 - y3) * u2 + (-y0 + 3 * y1 - 3 * y2 + y3) * u3)) } }
    return out;
  }
  const ROUTEP = sampleSpline([CARD.x, CARD.y + 60, 770, 430, 880, 600, 1010, 760, STAN.x, STAN.y - 20]);
  function cam6(t) {
    const k2 = at(t, K.odd - .15, K.odd + .95);
    if (k2 <= 0) return zoomCam(1 - at(t, K.mapT, K.mapT + 1.0), CARD.x, CARD.y, CAV.s, 10, CAV.x, CAV.y);
    const Z = zoomCam(k2, BAYV.x, BAYV.y, CAV.s, 1, CAV.x, CAV.y), kd = eio(at(t, K.odd + .95, K.lap + .3));
    return { s: Z.s * lp(1, 1.15, kd), x: lp(Z.x, 1030, kd), y: lp(Z.y, 630, kd) };
  }
  function pin(c, x, y, k, col) {
    if (k <= 0) return; const s = spr(k);
    c.save(); c.translate(x, y); c.scale(s, s);
    c.beginPath(); c.ellipse(0, 4, 26, 9, 0, 0, TAU); fill(c, 'rgba(20,25,53,.25)');
    c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-18, -26, -40, -46, -40, -74); c.arc(0, -74, 40, Math.PI, 0); c.bezierCurveTo(40, -46, 18, -26, 0, 0); fill(c, col);
    circ(c, 0, -74, 16, C.white); c.restore();
  }
  function campus(c, x, y, k) {   // башня с куполом и аркада — университет
    if (k <= 0) return; const s = eo(k);
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = '#e9b26a'; c.fillRect(-150, -90, 300, 90); c.fillStyle = '#c98a3e'; for (let i = 0; i < 5; i++) { rr(c, -132 + i * 56, -70, 36, 70, [18, 18, 0, 0]); fill(c, '#7a4f22') }
    poly(c, [-170, -90, 170, -90, 150, -118, -150, -118]); fill(c, '#b5482f');
    c.fillStyle = '#e9b26a'; c.fillRect(-34, -330, 68, 240); c.fillStyle = '#c98a3e'; c.fillRect(14, -330, 20, 240);
    for (let j = 0; j < 4; j++) { c.fillStyle = '#7a4f22'; c.fillRect(-14, -300 + j * 50, 28, 30) }
    c.beginPath(); c.arc(0, -330, 40, Math.PI, 0); fill(c, '#b5482f'); c.fillStyle = '#b5482f'; c.fillRect(-4, -400, 8, 40);
    c.restore();
  }
  function searchUI(c, t) {
    rr(c, -450, -253, 900, 506, 10); fill(c, C.white);
    c.save(); rr(c, -450, -253, 900, 506, 10); c.clip();
    c.fillStyle = '#e9edf5'; c.fillRect(-450, -253, 900, 52);
    for (const [i, col] of [[0, C.red], [1, C.am], [2, C.mint]]) circ(c, -420 + i * 26, -227, 8, col);
    rr(c, -330, -242, 600, 30, 15); fill(c, C.white); tx(c, 'industrydocuments.ucsf.edu', -312, -227, { f: 'J', w: 500, s: 17, c: C.n2, al: 'left' });
    c.fillStyle = C.blue; c.fillRect(-450, -201, 900, 64); tx(c, 'АРХИВ ДОКУМЕНТОВ ТАБАЧНЫХ КОМПАНИЙ', -420, -169, { s: 22, ls: 2, c: C.white, al: 'left' });
    rr(c, -420, -116, 640, 56, 12); fill(c, '#f2f5fa'); rr(c, -420, -116, 640, 56, 12); stroke(c, '#b8c4dc', 3);
    const q = 'nicotine salt 1973', n = Math.floor(q.length * at(t, K.lap + .45, K.find - .15)), on = t > K.lap + .4;
    if (on) tx(c, q.slice(0, n) + ((t * 2.5) % 1 < .5 && t < K.find ? '|' : ''), -396, -88, { f: 'J', w: 700, s: 26, c: C.ink, al: 'left' });
    rr(c, 236, -116, 184, 56, 12); fill(c, C.red); tx(c, 'НАЙТИ', 328, -87, { s: 22, ls: 3, c: C.white });
    for (let i = 0; i < 4; i++) {
      const k = eo(at(t, K.find + i * .08, K.find + i * .08 + .3)); if (k <= 0) continue; const ry = -36 + i * 64;
      c.globalAlpha = k; rr(c, -420, ry, 840, 52, 10); fill(c, i === 0 ? '#fff1c2' : '#eef2f9');
      if (i === 0) tx(c, 'R.J. REYNOLDS · 1973 · НИКОТИНОВАЯ СОЛЬ', -400, ry + 27, { f: 'J', w: 700, s: 20, c: C.ink, al: 'left' });
      else { rr(c, -400, ry + 20, 360 + 120 * H1(i), 12, 6); fill(c, '#b8c4dc') }
      c.globalAlpha = 1;
    }
    c.restore();
    if (t > K.find) stampBox(c, 'НАЙДЕНО', 300, -6, at(t, K.find + .05, K.find + .32), '#1f9b7c', -.12, 34);
  }
  function laptopAt(c, t, k, z) {
    if (k <= 0) return; const s0 = .8, s = s0 * Math.pow((1920 / 900) / s0, eio(z)), cy = lp(lp(1560, 520, spr(k)), 540, eio(z));
    c.save(); c.translate(960, cy); c.scale(s, s);
    poly(c, [-560, 268, 560, 268, 640, 330, -640, 330]); fill(c, '#c9d2e3'); c.fillStyle = '#aeb9cf'; c.fillRect(-640, 330, 1280, 16); rr(c, -90, 286, 180, 18, 9); fill(c, '#aeb9cf');
    rr(c, -482, -287, 964, 560, 28); fill(c, C.n0);
    searchUI(c, t); c.restore();
  }
  function shot6(c, t) {
    c.fillStyle = '#4aa3df'; c.fillRect(-200, -200, WW + 400, HH + 400);
    const Q = cam6(t), sc = Q.s; c.save(); cam(c, Q.s, Q.x, Q.y);
    poly(c, CA); fill(c, '#f8f1e3'); c.lineJoin = 'round'; stroke(c, C.n1, 4 / sc);
    poly(c, BAY); fill(c, '#4aa3df');
    const kr = at(t, K.near - .25, K.stan);
    if (kr > 0) { c.save(); c.setLineDash([22, 16]); c.lineCap = 'round'; c.strokeStyle = C.red; c.lineWidth = 9; drawOn(c, ROUTEP, kr); c.restore() }
    browser(c, t, CARD.x, CARD.y, 192 / 900, { sh: false, rows: 1, count: '14 000 000+' });
    c.restore();
    const S = (x, y) => [960 + sc * (x - Q.x), 540 + sc * (y - Q.y)];
    plate(c, 'КАЛИФОРНИЯ', 1340, 520, (1 - ss(.08, .2, sc)) * spr(at(t, K.mapT + .6, K.mapT + 1.0)), { s: 64, bg: C.white, c: C.ink, ls: 8 });
    const [cx, cy] = S(CARD.x, CARD.y);
    if (sc < .2) { circ(c, cx, cy, 16, C.red); circ(c, cx, cy, 7, C.white) }
    const kb = ss(.5, .9, sc);
    if (kb > 0) {
      plate(c, 'САН-ФРАНЦИСКО', cx, cy + 54 * sc + 34, kb, { s: 26, bg: C.n0, c: C.white });
      tx(c, 'ТИХИЙ ОКЕАН', ...S(MX(-122.6), MY(37.52)), { s: 30, ls: 6, c: 'rgba(255,255,255,.75)', a: kb });
      const [sx, sy] = S(STAN.x, STAN.y);
      campus(c, sx + 150, sy + 40, at(t, K.univ - .1, K.univ + .45));
      pin(c, sx, sy, at(t, K.stan - .05, K.stan + .4), C.red);
      plate(c, 'СТЭНФОРД', sx - 30, sy + 58, spr(at(t, K.stan + .1, K.stan + .5)), { s: 34, bg: C.white, c: C.ink, ls: 4 });
    }
    laptopAt(c, t, at(t, K.lap, K.lap + .45), at(t, K.lap + .5, K.lapZ));
  }
  // студенты со спины (силуэты), подсвечены экраном
  function student(c, x, y, s, o = {}) {
    c.save(); c.translate(x, y); c.scale(s, s);
    spline(c, [-250, 400, -230, 150, -120, 70, 120, 70, 230, 150, 250, 400]); fill(c, C.n0);
    c.fillStyle = C.n0; c.fillRect(-55, -10, 110, 100);
    circ(c, 0, -80, 105, C.n0);
    if (o.hair === 1) { spline(c, [-108, -86, -90, -170, 0, -200, 90, -170, 108, -86, 60, -130, -40, -130]); fill(c, '#0b0f24') }
    else { rr(c, -112, -150, 224, 56, 26); fill(c, C.mint2); rr(c, -60, -200, 120, 70, [40, 40, 0, 0]); fill(c, C.mint2) }
    c.strokeStyle = '#7fb0ff'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.arc(0, -80, 105, -2.7, -.45); c.stroke();
    c.beginPath(); c.moveTo(-220, 140); c.quadraticCurveTo(-130, 66, -60, 74); c.moveTo(220, 140); c.quadraticCurveTo(130, 66, 60, 74); c.stroke();
    c.restore();
  }
  function shot7(c, t) {
    c.fillStyle = C.n0; c.fillRect(-200, -200, WW + 400, HH + 400);
    c.save(); c.translate(960, 540); const s = (1920 / 900) * lp(1, 1.04, eio(at(t, K.lapZ, K.create))); c.scale(s, s); searchUI(c, t); c.restore();
    const ks = eo(at(t, K.two - .1, K.two + .45));
    if (ks > 0) { student(c, 690, 820 + (1 - ks) * 600, 1.0, { hair: 1 }); student(c, 1230, 840 + (1 - ks) * 650, 1.05, { hair: 2 }) }
    plate(c, 'ДВА СТУДЕНТА СТЭНФОРДА', 960, 1010, spr(at(t, K.two + .15, K.two + .55)), { s: 34, bg: C.white, c: C.ink });
    const ki = eio(at(t, K.create - .25, K.create + .1)); if (ki > 0) circ(c, 700, 300, ki * 2300, C.bp);
  }

  // ================= 5. чертёж JUUL: «похожа на флешку», внутри — та самая соль =================
  const JX = 960, JY = 420;
  function grid(c, col, step = 64) { c.save(); c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); for (let x = -step * 2; x <= WW + step * 3; x += step) { c.moveTo(x, -200); c.lineTo(x, HH + 200) } for (let y = -step * 2; y <= HH + step * 3; y += step) { c.moveTo(-200, y); c.lineTo(WW + 200, y) } c.stroke(); c.restore() }
  function label(c, s, x1, y1, x2, y2, k, al = 'center') {
    if (k <= 0) return; c.save(); c.strokeStyle = C.white; c.lineWidth = 3; drawOn(c, [x1, y1, x2, y2], eio(k)); circ(c, x1, y1, 7 * cl(k * 3), C.white); c.restore();
    tx(c, s, x2, y2 + (y2 > y1 ? 24 : -24), { s: 26, ls: 3, c: C.white, a: at(k, .5, 1), al });
  }
  function juulBP(c, t) {
    const k0 = at(t, K.create, K.create + .7), x0 = JX - 550, y0 = JY - 75;
    c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
    if (k0 > .2) { c.globalAlpha = at(k0, .2, .6); rr(c, x0, y0, 1100, 150, 30); fill(c, C.bp2); c.globalAlpha = 1 }
    c.strokeStyle = C.white; c.lineWidth = 6;
    drawOn(c, rrPts(x0, y0, 1100, 150, 30), k0, true);
    drawOn(c, [JX - 250, y0, JX - 250, y0 + 150], at(t, K.create + .3, K.create + .6));
    drawOn(c, [JX - 500, y0 + 8, JX - 500, y0 + 142], at(t, K.create + .3, K.create + .6));
    // камера с жидкостью, нагреватель, аккумулятор, диод, контакты
    const lv = eio(at(t, K.alive - .1, K.alive + .7));
    if (lv > 0) { c.save(); rr(c, JX - 470, JY - 45, 190, 90, 16); c.clip(); c.fillStyle = C.am; c.fillRect(JX - 470, JY + 45 - 90 * lv, 190, 90); c.fillStyle = C.am3; for (let i = 0; i < 5; i++) { const ph = (t * .8 + H1(i)) % 1; circ(c, JX - 450 + 150 * H1(i * 4.1), JY + 40 - 80 * ph, 5, C.am3) } c.restore() }
    drawOn(c, rrPts(JX - 470, JY - 45, 190, 90, 16), at(t, K.create + .45, K.create + .85), true);
    const zz = []; for (let i = 0; i <= 10; i++) zz.push(JX - 268 + (i % 2 ? 12 : -12), JY - 40 + i * 8);
    drawOn(c, zz, at(t, K.create + .6, K.create + .95));
    drawOn(c, rrPts(JX - 200, JY - 50, 540, 100, 20), at(t, K.create + .55, K.create + 1.0), true);
    const kb2 = at(t, K.create + .9, K.create + 1.2); tx(c, '+', JX + 300, JY, { s: 44, c: C.white, a: kb2 }); tx(c, '–', JX - 160, JY, { s: 44, c: C.white, a: kb2 });
    const led = at(t, K.alive, K.alive + .3); circ(c, JX + 420, JY - 34, 13, led > 0 ? mixc(C.bp2, C.mint, led) : C.bp2); c.beginPath(); c.arc(JX + 420, JY - 34, 13, 0, TAU); stroke(c, C.white, 4);
    if (led > 0) { c.save(); c.globalAlpha = .5 * led; c.beginPath(); c.arc(JX + 420, JY - 34, 26 + 4 * Math.sin(t * 8), 0, TAU); stroke(c, C.mint, 4); c.restore() }
    drawOn(c, [JX + 520, JY - 30, JX + 540, JY - 30], at(t, K.create + 1.0, K.create + 1.2)); drawOn(c, [JX + 520, JY + 30, JX + 540, JY + 30], at(t, K.create + 1.0, K.create + 1.2));
    // размер
    const kd = at(t, K.ecig, K.ecig + .5); c.lineWidth = 3;
    drawOn(c, [x0, y0 - 50, x0 + 1100, y0 - 50], kd); drawOn(c, [x0, y0 - 66, x0, y0 - 34], kd); drawOn(c, [x0 + 1100, y0 - 66, x0 + 1100, y0 - 34], kd);
    if (kd > .5) { rr(c, JX - 70, y0 - 72, 140, 44, 10); fill(c, C.bp); tx(c, '9,5 СМ', JX, y0 - 50, { f: 'J', w: 700, s: 26, c: C.white, a: at(kd, .5, 1) }) }
    c.restore();
    label(c, 'КАРТРИДЖ', JX - 375, JY + 45, JX - 420, JY + 165, at(t, K.create + .9, K.create + 1.3));
    label(c, 'НАГРЕВАТЕЛЬ', JX - 268, JY + 40, JX - 150, JY + 225, at(t, K.create + 1.0, K.create + 1.4));
    label(c, 'АККУМУЛЯТОР', JX + 70, JY + 50, JX + 120, JY + 165, at(t, K.create + 1.1, K.create + 1.5));
    label(c, 'ИНДИКАТОР', JX + 420, JY - 34, JX + 430, JY + 225, at(t, K.create + 1.2, K.create + 1.6));
  }
  function flashDrive(c, t, x, y, k) {
    if (k <= 0) return; c.save(); c.translate(x, y); c.lineJoin = 'round'; c.lineCap = 'round';
    c.globalAlpha = at(k, .3, .7); rr(c, -400, -62, 640, 124, 30); fill(c, C.bp2); c.globalAlpha = 1;
    c.strokeStyle = C.white; c.lineWidth = 6; drawOn(c, rrPts(-400, -62, 640, 124, 30), k, true);
    drawOn(c, rrPts(240, -44, 160, 88, 6), at(k, .4, .9), true);
    if (k > .7) { rr(c, 290, -24, 30, 18, 3); fill(c, C.white); rr(c, 290, 6, 30, 18, 3); fill(c, C.white) }
    drawOn(c, rrPts(-360, -22, 60, 44, 22), at(k, .5, 1), true);
    c.restore();
  }
  function shot8(c, t) {
    c.fillStyle = C.bp; c.fillRect(-200, -200, WW + 400, HH + 400);
    const gs = (t * 38) % 64; c.save(); c.translate(gs - 64, gs * .6 - 64); grid(c, C.bp2); c.restore();
    const zb = lp(1, 1.1, eio(at(t, K.create, K.podGo))); c.save(); c.translate(960, 540); c.scale(zb, zb); c.rotate(.012 * Math.sin(t * 1.3)); c.translate(-960, -540 + 8 * Math.sin(t * 1.7));
    c.save(); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 4; c.strokeRect(40, 40, WW - 80, HH - 80); c.restore();
    juulBP(c, t);
    const kf = at(t, K.flash - .1, K.flash + .6); flashDrive(c, t, JX + 80, 790, kf);
    if (kf > 0) { tx(c, '≈', JX - 430, 790, { s: 120, c: C.white, a: at(kf, .2, .6) }); plate(c, 'ФЛЕШКА', JX + 80, 910, spr(at(t, K.flash + .2, K.flash + .6)), { s: 30, bg: C.white, c: C.bp }) }
    // та самая соль 1973 влетает в картридж
    const kc = at(t, K.salt2 - .3, K.salt2 + .35);
    if (kc > 0 && kc < 1) crystal(c, lp(1500, JX - 375, eio(kc)), lp(130, JY, eio(kc)) - Math.sin(Math.PI * kc) * 120, lp(.5, .12, eio(kc)), kc * 3, { shine: kc });
    const kp = at(t, K.y73b - .05, K.y73b + .35);
    if (kp > 0) { spark(c, JX - 375, JY, 60 * Math.sin(Math.PI * at(t, K.salt2 + .3, K.salt2 + .8)), C.white); plate(c, 'СОЛЬ 1973', JX - 375, JY - 175, spr(kp), { s: 34, bg: C.red, c: C.white }) }
    tx(c, 'JUUL', 1620, 960, { f: 'U', w: 800, s: 64, ls: 6, c: C.white, a: at(t, K.ecig, K.ecig + .4) });
    c.restore();
  }

  // ================= 6. картридж = пачка; мягкий пар; школьники; каждый четвёртый =================
  // картридж 150×300 стоя, мундштук сверху (цвет вкуса — манго)
  function podDraw(c, x, y, s, r, o = {}) {
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    if (o.sh !== false) { rr(c, -75 + 12, -158 + 16, 150, 308, 24); fill(c, 'rgba(20,25,53,.25)') }
    c.beginPath(); c.moveTo(-75, -80); c.lineTo(-62, -150); c.quadraticCurveTo(-60, -158, -50, -158); c.lineTo(50, -158); c.quadraticCurveTo(60, -158, 62, -150); c.lineTo(75, -80); c.closePath(); fill(c, C.am);
    c.save(); c.clip(); c.fillStyle = C.am2; c.fillRect(30, -170, 60, 100); c.restore();
    rr(c, -24, -152, 48, 10, 5); fill(c, C.n0);
    rr(c, -75, -82, 150, 232, [6, 6, 22, 22]); fill(c, '#dce9ff');
    c.save(); rr(c, -75, -82, 150, 232, [6, 6, 22, 22]); c.clip(); c.fillStyle = C.am; c.fillRect(-80, 150 - 232 * (o.level ?? .78), 160, 240); c.restore();
    rr(c, -75, -82, 150, 232, [6, 6, 22, 22]); stroke(c, C.n0, 6);
    rr(c, -75, 112, 150, 38, [0, 0, 22, 22]); fill(c, '#2c2f45');
    c.fillStyle = C.gold; c.fillRect(-40, 126, 22, 10); c.fillRect(18, 126, 22, 10);
    rr(c, -52, -60, 12, 140, 6); fill(c, 'rgba(255,255,255,.55)');
    c.restore();
  }
  const POD0 = { x: JX - 400, y: JY, s: 1, r: -Math.PI / 2 }, POD1 = { x: 430, y: 500, s: 1.5, r: 0 };
  function podPose(t) { const k = at(t, K.podGo, K.podGo + .7), e = eio(k); return { x: lp(POD0.x, POD1.x, e), y: lp(POD0.y, POD1.y, e) - Math.sin(Math.PI * k) * 140, s: lp(POD0.s, POD1.s, e), r: lp(POD0.r, POD1.r, eo(k)) } }
  const CG = [...Array(20)].map((_, i) => ({ x: 1060 + (i % 10) * 80, y: i < 10 ? 320 : 690, d: (i % 10) * .045 + (i < 10 ? 0 : .02) }));
  function shot9(c, t) {
    c.fillStyle = C.mint; c.fillRect(-200, -200, WW + 400, HH + 400);
    const ke = spr(at(t, K.pack1 - .15, K.pack1 + .25)); if (ke > 0) { c.save(); c.translate(845, 500); c.scale(ke, ke); tx(c, '=', 0, 0, { s: 230, c: C.white }); c.restore() }
    for (const g of CG) { const k = at(t, K.pack1 + .05 + g.d, K.pack1 + .3 + g.d); if (k <= 0) continue; cig(c, g.x, g.y - (1 - bo(k)) * 800, 290, 56, -Math.PI / 2) }
    plate(c, '1 КАРТРИДЖ', 430, 880, spr(at(t, K.pod1, K.pod1 + .4)), { s: 44, bg: C.white, c: C.ink });
    plate(c, '20 СИГАРЕТ = ПАЧКА', 1420, 960, spr(at(t, K.cigs + .1, K.cigs + .5)), { s: 44, bg: C.n0, c: C.white });
  }
  // облака закрывают кадр слева направо (k 0..1); out — уходят вправо, открывая новое
  function cloudWipe(c, k, out) {
    if (k <= 0 || (out && k >= 1)) return;
    const X0 = lp(-420, 2350, eio(k));
    c.save(); c.fillStyle = C.white; c.beginPath();
    if (!out) { c.rect(-250, -250, X0 + 250, HH + 500); for (let i = 0; i < 9; i++) { const y = -60 + i * 150, r = 130 + 50 * H1(i); c.moveTo(X0 + r, y); c.arc(X0, y, r, 0, TAU) } }
    else { c.rect(X0, -250, WW + 600, HH + 500); for (let i = 0; i < 9; i++) { const y = -60 + i * 150, r = 130 + 50 * H1(i + 3); c.moveTo(X0 + r, y); c.arc(X0, y, r, 0, TAU) } }
    c.fill(); c.restore();
  }
  // школьник в профиль: голова как в сцене горла, худи, рюкзак, вейп во рту
  const KS = .3, KG = 980, KIDS = [260, 520, 780, 1040, 1300, 1560];
  const GRID = [...Array(12)].map((_, i) => ({ x: 570 + (i % 4) * 260, y: 230 + Math.floor(i / 4) * 250 }));
  const SLOT = [8, 9, 5, 6, 10, 11], NEWS = [0, 1, 2, 3, 4, 7], RED4 = [3, 5, 10];
  function kid(c, t, x, y, s, o = {}) {
    const col = o.col || C.n1;
    c.save(); c.translate(x, y); c.scale(s, s);
    rr(c, -96, 1040, 84, 460, 34); fill(c, mixc(col, C.n0, .35)); rr(c, 4, 1040, 84, 460, 34); fill(c, col);
    rr(c, -340, 560, 176, 360, 54); fill(c, o.bag || C.mint);
    spline(c, [-170, 470, 110, 470, 170, 700, 150, 1100, -190, 1100, -230, 700]); fill(c, col);
    c.restore();
    head(c, t, x, y, { s, body: col, calm: C.mint, cut: o.cutA > 0, cutA: o.cutA, cap: o.cap ?? 1, blobs: o.blobs });
    if (o.vape !== false) { c.save(); c.translate(x, y); c.scale(s, s); rr(c, 226, 112, 160, 30, 12); fill(c, '#2c2f45'); rr(c, 226, 112, 40, 30, [12, 0, 0, 12]); fill(c, C.am); circ(c, 352, 127, 6, o.col === C.red ? C.red3 : C.mint); c.restore() }
    const pp = o.puff ?? -1;
    if (pp >= 0 && pp < 1) cloud(c, x + 400 * s + 30 * eo(pp), y + 110 * s - 200 * eo(pp) * s / .3, lp(.25, .85, eo(pp)) * s / .3 * (1 - ss(.7, 1, pp)), 1, x, C.white);
  }
  const US = [-124.7, 48.4, -123, 49, -95.2, 49, -94.8, 49.4, -89.6, 48, -84.6, 46.5, -82.4, 43, -79, 43.3, -76.9, 43.6, -75, 45, -71.5, 45, -69.2, 47.4, -67, 44.8, -70.6, 43.1, -70, 41.7, -71.9, 41.3, -74, 40.6, -74.9, 38.9, -75.9, 37.2, -75.5, 35.2, -77.9, 33.9, -80.9, 32, -81.4, 30.4, -80.1, 25.4, -81.1, 25.2, -82.8, 27.9, -84.3, 30, -86.4, 30.4, -89.6, 30.2, -89.4, 29, -91.5, 29.5, -94, 29.6, -97.1, 27.6, -97.2, 25.9, -99.5, 27.5, -101.4, 29.8, -103.1, 28.9, -104.5, 29.6, -106.5, 31.8, -108.2, 31.3, -111.1, 31.3, -114.8, 32.5, -117.1, 32.5, -118.5, 34, -120.6, 34.6, -121.9, 36.6, -122.5, 37.8, -123.8, 39.7, -124.2, 41.9, -124, 43.7, -124.1, 46.3];
  const USP = []; for (let i = 0; i < US.length; i += 2) USP.push(960 + (US[i] + 96) * 24, 575 + (38 - US[i + 1]) * 30);
  function cam10(t) { const e = eio(at(t, K.kids - .25, K.kids + .5)); return { s: Math.pow(1 / KS, 1 - e), x: lp(828, 960, e), y: lp(524, 540, e), e } }
  function kidPose(j, t) {   // j — номер в сетке
    const e = eio(at(t, K.usa - .1, K.usa + .55)), from = SLOT.indexOf(j);
    if (from >= 0) return { x: lp(KIDS[from], GRID[j].x, e), y: lp(KG - 1500 * KS, GRID[j].y, e), s: lp(KS, .16, e), a: 1 };
    const k = spr(at(t, K.usa + .2 + NEWS.indexOf(j) * .05, K.usa + .6 + NEWS.indexOf(j) * .05)); return { x: GRID[j].x, y: GRID[j].y, s: .16 * k, a: k };
  }
  function shot11(c, t) {
    const Q = cam10(t);
    c.fillStyle = mixc(C.sky2, C.yel, Q.e); c.fillRect(-200, -200, WW + 400, HH + 400);
    const ku = eo(at(t, K.usa, K.usa + .6)); if (ku > 0) { c.save(); c.globalAlpha = ku; poly(c, USP); fill(c, '#ffe9a8'); c.lineJoin = 'round'; stroke(c, C.yel2, 6); c.restore() }
    c.save(); cam(c, Q.s, Q.x, Q.y);
    if (Q.e < 1) { c.fillStyle = mixc(C.sky2, C.yel2, Q.e); c.fillRect(-200, KG, 2400, 400) }
    for (let j = 0; j < 12; j++) {
      const P = kidPose(j, t); if (P.s <= 0) continue;
      const red = RED4.indexOf(j), kr = red >= 0 ? at(t, K.every4 + red * .12, K.every4 + red * .12 + .15) : 0;
      const from = SLOT.indexOf(j), isMain = from === 2;
      const ph = t > K.pull - .1 ? ((t - K.pull + .1) / 1.35 + (from >= 0 ? from : j) * .19) % 1 : -1;
      const blobs = []; if (isMain) for (let i = 0; i < 4; i++) { const t0 = K.softv + .25 + i * .14, u = eio(at(t, t0, t0 + 1.1)) * (.7 + .05 * i); if (t >= t0) blobs.push([u, 30, 0, C.white]) }
      const bob = (1 - (isMain ? 1 - Q.e : 0)) * Math.abs(Math.sin(t * 3.2 + j * 1.3)) * -26 * P.s / .3;
      kid(c, t, P.x, P.y + bob, P.s, { col: kr > 0 ? mixc(C.n1, C.red, kr) : C.n1, bag: j % 3 ? C.mint : C.red, cutA: isMain ? 1 - Q.e : 0, blobs, puff: (t > K.kids + .3 && t < K.third) ? ph : -1, vape: !isMain || t > K.kids });
    }
    c.restore();
    // мягкий пар входит в рот (крупный план)
    const kc = at(t, K.softv - .25, K.softv + .45); if (kc > 0 && kc < 1) cloud(c, lp(1500, 1030, eio(kc)), lp(420, 650, eio(kc)), lp(1.6, .5, eio(kc)), 1, 4, C.white);
    const kz = 1 - Q.e;
    if (kz > 0) { check(c, 1220, 760, 70 * kz, at(t, K.burn, K.burn + .5)); plate(c, 'НЕ ДЕРЁТ ГОРЛО', 1500, 900, spr(at(t, K.burn + .05, K.burn + .45)) * kz, { s: 48, bg: C.mint2, c: C.white, r: -.04 }) }
    // график «зависимость»
    const kg = spr(at(t, K.hooked - .1, K.hooked + .3)) * (1 - eio(at(t, K.usa - .25, K.usa + .1)));
    if (kg > 0) {
      c.save(); c.translate(960, 200); c.scale(kg, kg);
      rr(c, -330 + 12, -140 + 14, 660, 280, 26); fill(c, 'rgba(20,25,53,.22)'); rr(c, -330, -140, 660, 280, 26); fill(c, C.white);
      tx(c, 'ЗАВИСИМОСТЬ', -296, -100, { s: 30, ls: 3, c: C.ink, al: 'left' });
      c.strokeStyle = C.n2; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-290, -56); c.lineTo(-290, 110); c.lineTo(300, 110); c.stroke();
      const P = []; for (let i = 0; i <= 40; i++) { const u = i / 40; P.push(-270 + 520 * u, 100 - 180 * (Math.exp(3 * u) - 1) / (Math.exp(3) - 1)) }
      c.strokeStyle = C.red; c.lineWidth = 11; drawOn(c, P, at(t, K.hooked + .05, K.faster));
      const ka = spr(at(t, K.faster - .05, K.faster + .3)); if (ka > 0) { c.save(); c.translate(250, -80); c.rotate(-.9); c.scale(ka, ka); poly(c, [0, -34, 30, 18, -30, 18]); fill(c, C.red); c.restore() }
      c.restore();
    }
    plate(c, 'КАЖДЫЙ 4-Й СТАРШЕКЛАССНИК США', 960, 78, spr(at(t, K.every4 + .1, K.every4 + .5)), { s: 44, bg: C.white, c: C.ink });
    const ki = eio(at(t, K.third - .1, K.third + .25)); if (ki > 0) circ(c, GRID[5].x, GRID[5].y + 120, ki * 2300, C.mred);
  }

  // ================= 7. «Мальборо»: треть Juul за 12,8 млрд — пачка сразу крупно, «крыша» становится долей =================
  const PIE = { x: 1330, y: 430, r: 190 }, PIE1 = 1330, MP = { x: 620, y: 590 };
  const CHEV = [-150, -220, 150, -220, 150, 62, 0, -42, -150, 62];
  function marlboroPack(c, x, y, s, r, o = {}) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    rr(c, -150 + 18, -220 + 22, 300, 440, 12); fill(c, 'rgba(20,25,53,.3)');
    rr(c, -150, -220, 300, 440, 12); fill(c, C.white);
    if (o.roof !== false) { c.save(); rr(c, -150, -220, 300, 440, 12); c.clip(); poly(c, CHEV); fill(c, '#e0233c'); c.restore() }
    c.beginPath(); c.moveTo(-26, 0); c.lineTo(26, 0); c.lineTo(22, 30); c.quadraticCurveTo(0, 54, -22, 30); c.closePath(); fill(c, '#e0233c');
    tx(c, 'Marlboro', 0, 112, { f: '"Liberation Serif"', w: 700, s: 68, c: C.ink });
    tx(c, 'FILTER CIGARETTES', 0, 168, { f: 'O', w: 500, s: 19, ls: 3, c: C.ink });
    rr(c, -150, -220, 300, 440, 12); stroke(c, C.n0, 5);
    c.restore();
  }
  function resample(P, N) {
    const n = P.length / 2, L = [0];
    for (let i = 1; i <= n; i++) { const a = (i - 1) % n, b = i % n; L.push(L[i - 1] + Math.hypot(P[2 * b] - P[2 * a], P[2 * b + 1] - P[2 * a + 1])) }
    const out = []; let seg = 0;
    for (let j = 0; j < N; j++) {
      const d = L[n] * j / N; while (seg < n - 1 && L[seg + 1] < d) seg++;
      const a = seg % n, b = (seg + 1) % n, k = (d - L[seg]) / ((L[seg + 1] - L[seg]) || 1);
      out.push([lp(P[2 * a], P[2 * b], k), lp(P[2 * a + 1], P[2 * b + 1], k)]);
    }
    return out;
  }
  const cen = A => A.reduce((s, p) => [s[0] + p[0] / A.length, s[1] + p[1] / A.length], [0, 0]);
  let MA = null, MB = null;
  function morphPts() {
    if (MA) return;
    MA = resample(CHEV.map((v, i) => v + (i % 2 ? MP.y : MP.x)), 120);
    const W = [PIE1, PIE.y]; for (let i = 0; i <= 40; i++) { const a = -Math.PI / 2 + .35 * TAU * i / 40; W.push(PIE1 + Math.cos(a) * PIE.r, PIE.y + Math.sin(a) * PIE.r) }
    const B = resample(W, 120), ca = cen(MA), cb = cen(B);
    let best = 0, bd = Infinity;
    for (let s = 0; s < 120; s++) { let d = 0; for (let i = 0; i < 120; i++) { const b = B[(i + s) % 120]; d += (MA[i][0] - ca[0] - b[0] + cb[0]) ** 2 + (MA[i][1] - ca[1] - b[1] + cb[1]) ** 2 } if (d < bd) { bd = d; best = s } }
    MB = B.map((_, i) => B[(i + best) % 120]);
  }
  function wedgePath(c, k = 1) { c.beginPath(); c.moveTo(PIE.x, PIE.y); c.arc(PIE.x, PIE.y, PIE.r, -Math.PI / 2, -Math.PI / 2 + .35 * TAU * k); c.closePath() }
  function scene12(c, t) {   // в координатах кадра (камера — снаружи)
    PIE.x = lp(960, 1330, eio(at(t, K.bought - .3, K.bought + .15)));
    const off = (1 - eo(at(t, K.third + .1, K.third + .6))) * 1000, ux = .856, uy = -.517, nx = .517, ny = .856, bw = 200, L = 1900, ox = 960 + nx * off, oy = 540 + ny * off;
    poly(c, [ox - ux * L - nx * bw, oy - uy * L - ny * bw, ox + ux * L - nx * bw, oy + uy * L - ny * bw, ox + ux * L + nx * bw, oy + uy * L + ny * bw, ox - ux * L + nx * bw, oy - uy * L + ny * bw]); fill(c, C.mred2);
    const kp = spr(at(t, K.third + .05, K.third + .45)); circ(c, PIE.x, PIE.y, PIE.r * kp, C.white);
    const kr = eio(at(t, K.third + .2, K.third + .8)); if (kr > 0) { c.beginPath(); c.arc(PIE.x, PIE.y, PIE.r + 30, -Math.PI / 2, -Math.PI / 2 + TAU * kr); stroke(c, C.white, 5) }
    const m = eio(at(t, K.marl - .02, K.marl + .5)), kl = eo(at(t, K.marl - .14, K.marl - .02));
    const kw = at(t, K.third + .35, K.third + .7);
    if (kw > 0 && m < 1) { c.save(); wedgePath(c, eio(kw)); c.globalAlpha = .55; fill(c, C.mk); c.globalAlpha = 1; c.setLineDash([16, 12]); stroke(c, C.ink, 5); c.restore() }
    tx(c, 'JUUL', PIE.x - 60, PIE.y + 70, { f: 'U', w: 800, s: 56, ls: 3, c: C.ink, a: at(t, K.company - .05, K.company + .3) * kp });
    const kd = eo(at(t, K.company, K.company + .3)); tx(c, 'ДОЛЯ В JUUL', PIE.x, 692 + (1 - kd) * 30, { s: 38, ls: 6, c: C.white, a: kd });
    const kb = eo(at(t, K.b13 - .05, K.b13 + .25)); if (kb > 0) num(c, '$' + (12.8 * eo(at(t, K.b13, K.dollars + .1))).toFixed(1).replace('.', ',') + ' МЛРД', PIE.x, 792 + (1 - kb) * 40, { s: 104, c: C.white, a: kb });
    // пачка — сразу крупно, с размаху
    const kk = at(t, K.bought - .12, K.bought + .45), ps = kk > 0 ? lp(1.9, 1.05, spr(kk)) : 0;
    marlboroPack(c, MP.x, MP.y, ps, lp(-.2, -.04, eo(kk)), { roof: kl <= 0 });
    plate(c, 'ПРОИЗВОДИТЕЛЬ «МАЛЬБОРО» · 2018', 960, 1000, spr(at(t, K.bought + .35, K.bought + .75)), { s: 32, bg: C.white, c: C.ink });
    if (kl > 0) {
      morphPts(); const ca = cen(MA), cb = cen(MB), hop = Math.sin(Math.PI * m) * 170;
      if (m > 0 && m < 1) { c.save(); c.setLineDash([16, 14]); c.strokeStyle = C.white; c.lineWidth = 5; c.globalAlpha = .85; c.beginPath(); for (let i = 0; i <= 40 * m; i++) { const u = i / 40, x = lp(ca[0], cb[0], u), y = lp(ca[1] - 40, cb[1], u) - Math.sin(Math.PI * u) * 170; i ? c.lineTo(x, y) : c.moveTo(x, y) } c.stroke(); c.restore() }
      c.beginPath(); MA.forEach((p, i) => { const q = MB[i], x = lp(p[0], q[0], m), y = lp(p[1] - 40 * kl, q[1], m) - hop; i ? c.lineTo(x, y) : c.moveTo(x, y) }); c.closePath(); fill(c, mixc('#e0233c', C.n0, at(t, K.marl + .3, K.marl + .5)));
    }
    const k35 = spr(at(t, K.marl + .45, K.marl + .8)); if (k35 > 0) { c.save(); c.translate(PIE.x + 100, PIE.y - 52); c.scale(k35, k35); tx(c, '35 %', 0, 0, { s: 62, c: C.white }); c.restore() }
  }
  function shot12(c, t) { c.fillStyle = C.mred; c.fillRect(-200, -200, WW + 400, HH + 400); scene12(c, t) }

  // ================= 8. «план сработал»: меморандум со штампом, запрет сигарет, терминал, «затянуться?» =================
  const NV = 2960;
  function noSmoke(c, x, y, s, k) {
    if (k <= 0) return; const e = spr(k);
    c.save(); c.translate(x, y); c.scale(s * e, s * e);
    circ(c, 0, 0, 230, C.white); cig(c, 0, 0, 300, 58, 0, { lit: 1 });
    c.beginPath(); c.arc(0, 0, 205, 0, TAU); stroke(c, C.red, 44);
    c.save(); c.rotate(-.78); c.fillStyle = C.red; c.fillRect(-205, -22, 410, 44); c.restore();
    c.restore();
  }
  function terminal(c, t, x, y, s, ok) {
    c.save(); c.translate(x, y); c.scale(s, s);
    rr(c, -150 + 14, -270 + 18, 300, 540, 46); fill(c, 'rgba(4,8,30,.4)');
    rr(c, -150, -270, 300, 540, 46); fill(c, '#2b2f3a');
    rr(c, -120, -235, 240, 190, 18); fill(c, mixc('#13201a', '#1f9b7c', ok));
    if (ok > 0) { check(c, 0, -170, 44, ok, C.white); tx(c, 'ОПЛАТА', 0, -96, { s: 30, ls: 3, c: C.white, a: at(ok, .2, .6) }); tx(c, 'ПРИНЯТА', 0, -64, { s: 30, ls: 3, c: C.white, a: at(ok, .3, .7) }) }
    else { tx(c, 'ПРИЛОЖИТЕ', 0, -160, { s: 24, ls: 2, c: C.mint }); tx(c, '₽ · $ · €', 0, -116, { f: 'J', w: 700, s: 24, c: C.mint }) }
    for (let i = 0; i < 12; i++) { rr(c, -100 + (i % 3) * 72, -10 + Math.floor(i / 3) * 56, 56, 40, 10); fill(c, i === 11 ? '#1f9b7c' : i === 9 ? C.red : '#41475a') }
    c.strokeStyle = C.white; c.lineWidth = 7; c.lineCap = 'round';
    for (let i = 1; i <= 3; i++) { c.globalAlpha = .9; c.beginPath(); c.arc(0, -300, 16 + i * 18, -2.3, -.84); c.stroke() }
    c.restore();
  }
  function cam13(t) {
    let x = lp(960, NV, eio(at(t, K.planPan, K.planPan + .6))), y = 540, s = 1;
    const kv = eio(at(t, K.adm, K.drag)); s = lp(1, 1.08, kv); y = lp(540, 600, kv);
    const kp = eo(at(t, K.drag - .02, K.drag + .15)); s += .06 * kp;
    const u = at(t, K.drag, K.drag + .5); if (u > 0 && u < 1) { x += Math.sin(u * 50) * 8 * (1 - u); y += Math.cos(u * 43) * 6 * (1 - u) }
    return { s, x, y };
  }
  const SL2 = y => 1960 + (540 - y) * .18;
  function vapePose(t) {
    const ki = spr(at(t, K.desp + .2, K.desp + .65)), km = eio(at(t, K.pay - .55, K.pay - .05)), kc = eio(at(t, K.adm - .05, K.adm + .8));
    let x = lp(NV + 1300, NV + 380, ki), y = 620, r = .12, s = .62;
    x = lp(x, NV - 60, km); y = lp(y, 430, km); r = lp(r, -.5, km);
    const tap = at(t, K.pay - .05, K.pay + .3); y += Math.sin(Math.PI * tap) * 26;
    x = lp(x, NV, kc); y = lp(y, 640, kc); r = lp(r, -.06, kc); s = lp(s, .76, kc);
    return { x, y, r, s, on: ki > 0 };
  }
  function shot13(c, t) {
    const Q = cam13(t);
    c.fillStyle = C.mred; c.fillRect(-200, -200, WW + 400, HH + 400);
    c.save(); cam(c, Q.s, Q.x, Q.y);
    if (t < K.planPan + .7) { c.save(); scene12(c, t); c.restore() }
    c.beginPath(); c.moveTo(SL2(-2000), -2000); c.lineTo(9000, -2000); c.lineTo(9000, 3000); c.lineTo(SL2(3000), 3000); c.closePath(); fill(c, C.n1);
    // темнеет к «Признайтесь», краснеет на «затянуться?»; лучи — как в начале
    const kd = eo(at(t, K.adm, K.adm + 1.2)), kr = eo(at(t, K.drag, K.drag + .25));
    if (kd > 0) { c.save(); c.globalAlpha = kd; c.fillStyle = mixc('#0b1030', '#3a0a12', kr); c.fillRect(-9000, -9000, 30000, 30000); c.globalAlpha = .45 * kd; sunburst(c, NV, 600, t * .22, 18, mixc(C.ray, '#5c1020', kr)); c.restore() }
    // меморандум из 1973 — «план выполнен»
    const km = spr(at(t, K.plan - .1, K.plan + .4)), ko = eio(at(t, K.desp - .35, K.desp + .05));
    if (km > 0 && ko < 1) memoAt(c, t, { x: lp(NV, NV - 1200, ko), y: lp(1600, 540, km) - ko * 120, r: lp(.3, -.04, eo(at(t, K.plan - .1, K.plan + .45))) - ko * .5, s: .95 }, { full: 1, done: at(t, K.worked, K.worked + .26) });
    // «вы презирали сигареты»
    const kn = at(t, K.desp - .05, K.desp + .4), kno = eio(at(t, K.pay - .8, K.pay - .4));
    if (kno < 1) noSmoke(c, NV - 420 - kno * 900, 540, .95, kn);
    // терминал: вейп прикладывается — «ОПЛАТА ПРИНЯТА», монеты улетают влево (к «Мальборо»)
    const kt = spr(at(t, K.pay - .7, K.pay - .25)), ktd = ei(at(t, K.adm - .1, K.adm + .4));
    if (kt > 0 && ktd < 1) {
      terminal(c, t, NV - 330, lp(1500, 640, kt) + ktd * 900, .95, at(t, K.tribute - .05, K.tribute + .25));
      const kw = at(t, K.pay, K.pay + .6); if (kw > 0 && kw < 1) for (let i = 0; i < 3; i++) { const u = cl(kw * 1.6 - i * .25); if (u <= 0 || u >= 1) continue; c.save(); c.globalAlpha = 1 - u; c.beginPath(); c.arc(NV - 330, 330, 40 + u * 160, -2.5, -.64); stroke(c, C.mint, 8); c.restore() }
      for (let i = 0; i < 9; i++) { const k = at(t, K.tribute + .1 + i * .06, K.tribute + .75 + i * .06); if (k <= 0 || k >= 1) continue; const e = eo(k); circ(c, NV - 330 - e * (900 + 120 * H1(i)), 420 - Math.sin(Math.PI * e) * (180 + 60 * H1(i * 2)) + e * 60, 26, C.gold); circ(c, NV - 330 - e * (900 + 120 * H1(i)), 420 - Math.sin(Math.PI * e) * (180 + 60 * H1(i * 2)) + e * 60, 16, '#f6cf7f') }
    }
    const V = vapePose(t);
    if (V.on) {
      const led = Math.max(pulse(t, K.want), pulse(t, K.want + .8), ss(K.drag - .1, K.drag, t));
      const fl = eo(at(t, K.adm, K.adm + 1)) * Math.sin(t * 2.4) * 14;
      c.save(); c.translate(V.x, V.y + fl); c.rotate(V.r + fl * .002); c.scale(V.s, V.s);
      vapeBody(c, { ...HERO, t, led, ledC: t > K.drag - .05 ? C.red : C.mint });
      c.restore();
      const [px, py] = (() => { const [a, b] = rot(0, -470 * V.s, V.r); return [V.x + a, V.y + b] })();
      puff(c, t, K.want + .1, px, py, 1, .9);
      // большая затяжка — облако закрывает кадр
      const kb = at(t, K.drag + .75, K.s9 - .05);
      if (kb > 0) for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * .5, e = eo(kb); cloud(c, px + Math.cos(a) * 520 * e, py + Math.sin(a) * 300 * e + 200 * e, (.6 + 9 * e * e) * (1 + .2 * H1(i)), 1, i * 7, C.white) }
    }
    c.restore();
  }

  // ================= 9. доска: «Мальборо» дальше — на YouTube =================
  let CORK = null;
  function corkImg() {
    if (CORK) return CORK; CORK = mk(WW, HH); const c = CORK.getContext('2d');
    c.fillStyle = '#c98b52'; c.fillRect(0, 0, WW, HH);
    for (let i = 0; i < 1600; i++) { c.fillStyle = H1(i * 1.7) > .5 ? '#b5773f' : '#d99a62'; c.beginPath(); c.arc(H1(i * 3.7) * WW, H1(i * 9.1) * HH, 2 + 4 * H1(i * 1.3), 0, TAU); c.fill() }
    c.strokeStyle = '#7a4f22'; c.lineWidth = 26; c.strokeRect(13, 13, WW - 26, HH - 26);
    return CORK;
  }
  function card(c, x, y, w, h, r, k, draw) {
    if (k <= 0) return; const s = spr(k);
    c.save(); c.translate(x, y - h / 2 + 24); c.rotate(r + .035 * Math.sin(X.__t * 1.6 + x * .01)); c.translate(0, h / 2 - 24); c.scale(s, s);
    c.fillStyle = 'rgba(60,30,8,.3)'; c.fillRect(-w / 2 + 12, -h / 2 + 16, w, h);
    c.fillStyle = C.white; c.fillRect(-w / 2, -h / 2, w, h);
    draw(c);
    circ(c, 0, -h / 2 + 24, 17, C.red); circ(c, -5, -h / 2 + 19, 6, C.red3);
    c.restore();
  }
  const CARDS = [{ x: 400, y: 400, r: -.05 }, { x: 960, y: 380, r: .03 }, { x: 1520, y: 400, r: -.03 }];
  function hat(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.beginPath(); c.ellipse(0, 40, 190, 46, 0, 0, TAU); fill(c, '#7a4f22');
    spline(c, [-110, 30, -100, -60, -50, -110, 0, -84, 50, -110, 100, -60, 110, 30]); fill(c, '#8a5a2a');
    c.fillStyle = '#4a2f12'; c.fillRect(-106, 4, 212, 22);
    c.beginPath(); c.ellipse(0, 40, 190, 46, 0, 0, Math.PI); c.closePath(); c.save(); c.clip(); c.fillStyle = '#5e3c18'; c.fillRect(-200, 40, 400, 60); c.restore();
    c.restore();
  }
  function leaf(c, x, y, s, r) {
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    leafPath(c, -170, 0, 340, 130); fill(c, '#6aa84f'); c.save(); c.clip(); c.fillStyle = '#4f8a3a'; c.fillRect(-180, 0, 360, 140); c.restore();
    c.strokeStyle = '#d9e8b0'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(-200, 0); c.lineTo(150, 0); c.stroke();
    for (let i = 0; i < 5; i++) { const x0 = -110 + i * 52; c.beginPath(); c.moveTo(x0, 0); c.lineTo(x0 + 40, -54 + i * 8); c.moveTo(x0, 0); c.lineTo(x0 + 40, 54 - i * 8); c.stroke() }
    c.restore();
  }
  function shot14(c, t) {
    const kb = eio(at(t, K.s9, K.link + 1)); c.save(); c.translate(960, 540); c.scale(lp(1.12, 1.0, kb), lp(1.12, 1.0, kb)); c.translate(-960 + lp(260, 0, kb), -540 + lp(80, 0, kb));
    c.drawImage(corkImg(), -200, -200, WW + 400, HH + 400);
    const [c1, c2, c3] = CARDS;
    // красные нити между карточками
    c.save(); c.strokeStyle = C.red; c.lineWidth = 6; c.lineCap = 'round';
    drawOn(c, [c1.x, c1.y - 226, (c1.x + c2.x) / 2, c1.y - 150, c2.x, c2.y - 216], at(t, K.lady + .3, K.drug));
    drawOn(c, [c2.x, c2.y - 216, (c2.x + c3.x) / 2, c2.y - 140, c3.x, c3.y - 226], at(t, K.drug + .5, K.soak + .1)); c.restore();
    card(c, c1.x, c1.y, 440, 520, c1.r, at(t, K.s9 + .25, K.s9 + .7), c => {
      marlboroPack(c, -70, -30, .55, -.06);
      cig(c, 90, 30, 250, 46, -1.2, { filter: '#e0233c', dots: '#b01a2e' });
      const kl = at(t, K.lady, K.lady + .3); if (kl > 0) { c.save(); c.globalAlpha = kl; c.translate(120, 110); c.rotate(-.3); c.beginPath(); c.ellipse(-12, 0, 16, 8, .3, 0, TAU); c.ellipse(12, 0, 16, 8, -.3, 0, TAU); fill(c, '#e0233c'); c.restore() }
      tx(c, '1924 · ДАМСКИЕ', 0, 200, { s: 36, ls: 2, c: C.ink, a: at(t, K.lady - .1, K.lady + .3) });
    });
    card(c, c2.x, c2.y, 440, 500, c2.r, at(t, K.drug - .15, K.drug + .3), c => { hat(c, 0, -10, 1); tx(c, '1954 · КОВБОЙ', 0, 180, { s: 36, ls: 2, c: C.ink }) });
    card(c, c3.x, c3.y, 440, 520, c3.r, at(t, K.soak - .15, K.soak + .3), c => {
      leaf(c, 0, 50, .95, -.25);
      c.save(); c.translate(70, -110); c.rotate(.5); rr(c, -14, -40, 28, 120, 10); fill(c, '#dce9ff'); rr(c, -14, -40, 28, 120, 10); stroke(c, C.n2, 4); rr(c, -22, -100, 44, 64, 20); fill(c, C.n0); c.restore();
      for (let i = 0; i < 3; i++) { const ph = ((t - K.soak) * 1.4 + i / 3) % 1; if (t > K.soak) circ(c, 20, -40 + ph * 120, 9 * (1 - ph * .4), C.am) }
      tx(c, '?', -110, -120, { s: 150, c: C.red, a: at(t, K.tabak, K.tabak + .3) });
      tx(c, 'ЧЕМ ПРОПИТЫВАЮТ?', 0, 200, { s: 32, ls: 2, c: C.ink });
    });
    plate(c, 'ПОЛНОЕ РАССЛЕДОВАНИЕ', 840, 800, spr(at(t, K.watch, K.watch + .4)), { s: 54, bg: C.white, c: C.ink, ls: 4 });
    const ky = spr(at(t, K.yt - .1, K.yt + .3));
    if (ky > 0) { c.save(); c.translate(1420, 800); const pu = ky * (1 + .07 * Math.max(0, Math.sin(t * 7))); c.scale(pu, pu); rr(c, -96 + 8, -66 + 10, 192, 132, 36); fill(c, 'rgba(60,30,8,.3)'); rr(c, -96, -66, 192, 132, 36); fill(c, '#ff1f2d'); poly(c, [-26, -36, 42, 0, -26, 36]); fill(c, C.white); c.restore() }
    const kl2 = spr(at(t, K.link - .05, K.link + .35));
    plate(c, 'ССЫЛКА В ПРОФИЛЕ', 900, 960, kl2, { s: 44, bg: C.red, c: C.white, ls: 4 });
    if (kl2 > 0) { const b = Math.sin(t * 9) * 10; c.save(); c.translate(1260, 950 + b); c.scale(kl2, kl2); poly(c, [0, -60, 40, -10, 14, -10, 14, 50, -14, 50, -14, -10, -40, -10]); fill(c, C.white); c.restore() }
    c.restore();
  }

  // ================= метка года в углу: 1973 → (большой барабан) 1998 → 2015 → 2019 =================
  function tagDraw(c, t, Y, TT, x, y, s) { if (s <= 0) return; yearPlate(c, x, y, s, 1); c.save(); c.translate(x, y); c.scale(s, s); yearDrum(c, t, Y, TT, 0, 0, { s: 200, c: C.white, dir: -1, d: .3 }); c.restore() }
  function tagAt(c, t) {
    if (t >= K.y73go + .5 && t < K.y98go) tagDraw(c, t, [1973], [0], 174, 112, .36);
    else if (t >= K.y98go && t < K.court - .05) {
      const a = spr(at(t, K.y98go, K.y98go + .35)), e = eio(at(t, K.court - .55, K.court - .05));
      tagDraw(c, t, [1973, 1998], [0, K.y98 + .05], lp(960, 174, e), lp(240, 112, e), lp(1, .36, e) * a);
    } else if (t >= K.court - .05 && t < K.mapT) tagDraw(c, t, [1998], [0], 174, 112, .36);
    else if (t >= K.create && t < K.third) tagDraw(c, t, [2015, 2019], [0, K.y19 + .35], 174, 112, .36 * spr(at(t, K.create, K.create + .4)));
  }
  function keys() {
    const w = Wd, k = {};
    k.tw = ['что', 'вы', 'знаете', 'об', 'одноразках'].map(q => w(q));
    k.morph = Math.max(1.95, w('одноразках') + .62); k.morphE = k.morph + .6;
    k.bgv = w('модная'); k.cig = w('замена'); k.cross = w('сигаретам'); k.par = w('паром'); k.puff1 = k.par - .45; k.puff2 = k.par + .55;
    k.mango = w('манго'); k.mint = w('мяты'); k.push = w('знаете', 1); k.liq = w('жидкость'); k.zoomE = k.liq + .8;
    k.inv = w('изобрели'); k.giants = w('табачные'); k.giants2 = w('гиганты'); k.fifty = w('пятьдесят'); k.y73 = w('1973'); k.y73go = w('год');
    k.drumT = [k.fifty, k.fifty + .33, k.fifty + .59, k.fifty + .85, k.fifty + 1.11, k.fifty + 1.37, k.y73];
    k.emp = w('табачная'); k.emp2 = w('империя'); k.rey = w('рейнольдс'); k.camel = w('camel'); k.winston = w('winston');
    k.prep = w('готовит'); k.secret = w('секретный'); k.goal = w('главная'); k.typ = w('документа') + .05; k.sig = w('звучала') + .1; k.comp = w('компания');
    k.qt = ['компания', 'должна', 'получить', 'свою', 'долю', 'молодёжного', 'рынка'].map(q => w(q)); k.q4 = w('молодёжного'); k.q5 = w('рынка');
    k.prob = w('но'); k.mapI = k.prob + .3;
    k.usual = w('обычный'); k.smoke = w('дым'); k.acrid = w('едкий'); k.tear = w('дерёт'); k.throat = w('горло'); k.teens = w('подросткам');
    k.chemPan = w('тогда') - .1; k.chem = w('химики'); k.mixw = w('смешали'); k.nic = w('никотин'); k.acid = w('кислотой'); k.got = w('получили'); k.salt = w('соль');
    k.softPan = w('абсолютно') - .35; k.soft = w('мягко'); k.dose = w('убойной'); k.dose2 = w('дозе');
    k.vop = w('воплотить'); k.fail = w('смогли'); k.secr = w('секретную'); k.formula = w('формулу'); k.hid = w('спрятали'); k.arch = w('архив'); k.tilt = k.hid - .05;
    k.y25 = w('двадцать'); k.y25b = w('пять'); k.y98 = w('1998'); k.y98go = k.y98 - .45;
    k.court = w('суд'); k.tob = w('табачников'); k.secrets = w('тайны'); k.n14 = w('четырнадцать'); k.docs = w('документов'); k.pub = w('опубликовали'); k.cal = w('калифорнии');
    k.bzoom = k.cal - .35; k.mapT = k.cal + .05;
    k.odd = w('стечению'); k.near = w('прямо', 1); k.stan = w('стэнфордским'); k.univ = w('университетом'); k.papers = w('бумаги'); k.find = w('находят'); k.two = w('два');
    k.lap = k.papers - .35; k.lapZ = k.find - .5;
    k.create = w('создают'); k.ecig = w('электронную'); k.flash = w('флешку'); k.alive = w('оживает'); k.salt2 = w('соль', 1); k.y73b = w('1973', 1);
    k.podGo = w('один'); k.pod1 = w('картридж'); k.pack1 = w('пачку'); k.cigs = w('сигарет', 1);
    k.softv = w('пар'); k.burn = w('горло', 1); k.kids = w('школьники'); k.pull = w('тянули'); k.hooked = w('подсаживались'); k.faster = w('быстрее');
    k.y19 = w('четыре'); k.usa = w('сша'); k.every4 = w('четвёртый'); k.third = w('треть'); k.company = w('компании'); k.b13 = w('тринадцать'); k.dollars = w('долларов'); k.bought = w('выкупил'); k.marl = w('мальборо');
    k.planPan = w('старый'); k.plan = w('план'); k.worked = w('идеально'); k.desp = w('презирали'); k.pay = w('платите'); k.tribute = w('дань'); k.adm = w('признайтесь'); k.want = w('захотелось'); k.drag = w('затянуться');
    const iz = TLW.findIndex(x => nw(x.d) === 'затянуться'); k.s9 = TLW[iz + 1].a - .03;
    k.marl2 = w('мальборо', 1); k.lady = w('дамские'); k.drug = w('наркотик'); k.soak = w('пропитывают'); k.tabak = w('табак'); k.watch = w('смотрите'); k.yt = w('youtube'); k.link = w('ссылка');
    return k;
  }
  // звуки по событиям (sfx13 / sfx8 — уже готовые файлы, новых генераций нет)
  function cues() {
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    Q(.05, 'swish', .7); Q(K.morph, 'whoosh', .9); Q(K.bgv, 'swish', .6); Q(K.cig, 'whoosh', .5); Q(K.cross, 'zap', .7, -.4); Q(K.cross + .1, 'zap', .6, .4);
    Q(K.puff1, 'puff', .8); Q(K.puff2, 'puff', .7); Q(K.mango, 'pin', .8, -.3); Q(K.mint, 'pin', .8, .3);
    Q(K.liq, 'dive', .9); Q(K.zoomE, 'bubble', .8); Q(K.inv, 'shimmer', .7); Q(K.giants, 'thud', .8); Q(K.giants2, 'whirr', .5);
    K.drumT.slice(1, -1).forEach(x => Q(x - .1, 'tick', .7)); Q(K.y73, 'stamp', 1); Q(K.y73go, 'swish', .5);
    Q(K.emp, 'whoosh', .7); Q(K.rey, 'pin', .5); Q(K.camel, 'pin', 1, -.4); Q(K.winston, 'pin', 1, .4); Q(K.prep, 'swish', .8); Q(K.secret, 'stamp', 1);
    Q(K.goal, 'whoosh', .5); for (let i = 0; i < 5; i++) Q(K.typ + i * .16, 'tick', .45); Q(K.sig, 'quill', .7); K.qt.forEach(x => Q(x - .06, 'tick', .5)); Q(K.q4, 'swish', .5);
    Q(K.prob, 'whoosh', .8); Q(K.usual, 'swish', .5); Q(K.smoke - .25, 'sniff', .8); Q(K.smoke, 'puff', .6); Q(K.acrid, 'zap', .6); Q(K.tear, 'buzz', .6); Q(K.tear + .05, 'impact', .35); Q(K.throat, 'stamp', .6); Q(K.teens, 'pin', .8);
    Q(K.chemPan, 'whoosh', .7); Q(K.mixw, 'thud', .5); Q(K.nic, 'swish', .5, -.4); Q(K.nic + .4, 'drip', .8); Q(K.acid, 'swish', .5, .4); Q(K.acid + .4, 'drip', .8); Q(K.got, 'bubble', 1); Q(K.salt, 'shimmer', 1); Q(K.salt + .15, 'ding', .6);
    Q(K.softPan, 'whoosh', .5); Q(K.soft, 'ding', .5); Q(K.dose, 'whirr', .7);
    Q(K.vop, 'swish', .7); Q(K.vop + .1, 'quill', .5); Q(K.fail, 'zap', .9); Q(K.fail + .25, 'zap', .7); Q(K.secr, 'stamp', 1); Q(K.formula, 'swish', .6); Q(K.hid, 'whoosh', .7); Q(K.arch, 'thud', 1);
    for (let i = 0; i < 3; i++) Q(K.arch + .45 + i * .26, 'thud', .45, i - 1); Q(K.y25, 'stamp', .8); Q(K.y98 - .3, 'tick', .7); Q(K.y98, 'stamp', .6);
    Q(K.court - .1, 'whoosh', .6); Q(K.court + .05, 'pin', .5); Q(K.tob, 'impact', .5); Q(K.secrets, 'impact', .55); Q(K.secrets + .05, 'flutter', 1); Q(K.n14, 'whirr', .7); Q(K.docs, 'pin', .5);
    Q(K.pub, 'swish', .7); Q(K.pub + .2, 'flutter', .6); Q(K.bzoom, 'whoosh', .8);
    Q(K.mapT + .1, 'whoosh', .6); Q(K.odd - .1, 'whoosh', .6); Q(K.near - .2, 'quill', .6); Q(K.stan, 'pin', 1); Q(K.univ, 'thud', .5);
    Q(K.lap, 'swish', .7); for (let i = 0; i < 8; i++) Q(K.lap + .5 + i * .09, 'tick', .4); Q(K.find, 'ding', 1); Q(K.two, 'swish', .6);
    Q(K.create - .2, 'whoosh', .7); Q(K.create + .1, 'quill', .6); Q(K.ecig, 'whirr', .5); Q(K.flash, 'pin', .8); Q(K.alive, 'bubble', .8); Q(K.salt2, 'shimmer', .9); Q(K.y73b, 'ding', .6);
    Q(K.podGo, 'whoosh', .8); Q(K.pod1, 'pin', .6); Q(K.pack1, 'pin', .6); for (let i = 0; i < 10; i++) Q(K.pack1 + .15 + i * .09, 'tick', .5, (i - 5) / 6); Q(K.cigs + .1, 'stamp', .5);
    Q(K.softv - .45, 'whoosh', .6); Q(K.softv, 'puff', .7); Q(K.burn, 'ding', .7);
    Q(K.kids - .2, 'whoosh', .6); for (let i = 0; i < 6; i++) Q(K.pull + i * .45, 'puff', .45, (i % 3 - 1) * .5); Q(K.hooked, 'whirr', .6); Q(K.faster, 'whip', .8);
    Q(K.y19 + .2, 'tick', .6); Q(K.usa, 'swish', .6); for (let i = 0; i < 3; i++) Q(K.every4 + i * .12, 'zap', .7, i - 1);
    Q(K.third - .1, 'whoosh', .8); Q(K.company, 'pin', .6); Q(K.b13, 'coins', 1); Q(K.dollars, 'coins', .6); Q(K.bought - .05, 'impact', .5); Q(K.marl, 'whoosh', .7); Q(K.marl + .5, 'ding', .7);
    Q(K.planPan, 'whoosh', .7); Q(K.plan, 'swish', .7); Q(K.worked, 'stamp', 1); Q(K.desp, 'zap', .8); Q(K.pay - .65, 'swish', .6); Q(K.pay, 'pin', .7); Q(K.tribute, 'ding', 1); Q(K.tribute + .1, 'coins', .8);
    Q(K.adm, 'whoosh', .5); Q(K.want, 'heart', .6); Q(K.drag, 'zap', .7); Q(K.drag + .62, 'vape', 1);
    Q(K.s9, 'impact', .5); Q(K.s9 + .3, 'pin', .8); Q(K.lady, 'pin', .7); Q(K.drug - .1, 'pin', .8); Q(K.soak - .1, 'pin', .8); Q(K.lady + .3, 'quill', .5); Q(K.drug + .5, 'quill', .5);
    Q(K.watch, 'swish', .7); Q(K.yt - .05, 'ding', .8); Q(K.link, 'swish', .6);
  }
  // ================= кадр =================
  const SW = { a: () => K.podGo, b: () => K.podGo + .6 };
  // живая камера (как у Боба: кадр всё время чуть плывёт) — на весь кадр, с запасом по краям
  function liveCam(c, t) {
    const dx = 16 * Math.sin(TAU * t / 6.1) + 8 * Math.sin(TAU * t / 2.9 + 1), dy = 10 * Math.sin(TAU * t / 7.7 + 2) + 5 * Math.sin(TAU * t / 3.3);
    const z = 1.045 + .015 * Math.sin(TAU * t / 9.5), r = .004 * Math.sin(TAU * t / 8.3);
    c.translate(960, 540); c.rotate(r); c.scale(z, z); c.translate(-960 + dx, -540 + dy);
  }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    X.__t = t; c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH); liveCam(c, t);
    if (t < K.zoomE) shot1(c, t);
    else if (t < K.mapI) shot2(c, t);
    else if (t < K.mapT) shot3(c, t);
    else if (t < K.lapZ) shot6(c, t);
    else if (t < K.create + .1) shot7(c, t);
    else if (t < SW.a()) shot8(c, t);
    else if (t < K.softv - .05) {
      const X0 = lp(1980, -80, eio(at(t, SW.a(), SW.b())));
      if (X0 > -100) { c.save(); c.beginPath(); c.rect(-200, -200, X0 + 200, HH + 400); c.clip(); shot8(c, t); c.restore() }
      c.save(); c.beginPath(); c.rect(X0, -200, WW - X0 + 400, HH + 400); c.clip(); shot9(c, t); c.restore();
      const P = podPose(t); podDraw(c, P.x, P.y, P.s, P.r, { sh: t > SW.a() + .2 });
      cloudWipe(c, at(t, K.softv - .5, K.softv - .05), false);
    } else if (t < K.third + .25) { shot11(c, t); cloudWipe(c, at(t, K.softv - .05, K.softv + .45), true) }
    else if (t < K.planPan) shot12(c, t);
    else if (t < K.s9) shot13(c, t);
    else shot14(c, t);
    tagAt(c, t);
  }
  window.EP = {
    P: { bg: C.deep, paper: C.wh, ink: C.n0, line: C.wh, a1: C.am, a2: C.red }, D, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); K = keys(); cues();
      SC.forEach(S => { D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v16f')) { const st = document.createElement('style'); st.id = 'v16f'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); MA = MB = null; CORK = null;
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U', '700 20px "Liberation Serif"'].map(f => document.fonts.load(f, 'АЯaz09'))).then(() => { qLayout(X); return 0 });
    },
  };
})();
