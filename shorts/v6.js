// shorts/v6.js — поверх v5.js (09.11, «никотин ×3»: nicw1 шизо, nicw2 лучше, nicw3 одна камера + петля).
//   Переходы: thru — камера влетает внутрь предмета (следующая сцена уже лежит в нём, как матрёшка), whip — хлыст.
//   Фоны: лучи, полосы, пробковая доска. Проявление обводкой (drawOn), вспышка-удар (flashF), линии скорости.
//   Звук по событиям: cue(время, звук) — capture.mjs <ep> cues → out/<ep>/cues.json → audio.py (sfxlib.py).
//   Предметы: баклажан, помидор, картошка, перец, куст табака с корнями, муравей, кнопка, нитка, полароид, стикер,
//   чертёж, весы, пачка сигарет, тля в очках / каске / с крыльями / прищуром, сок с трубочкой, профиль с лицом.
'use strict';
window.V6 = true;
const PI = Math.PI, rad = a => a * PI / 180;
// фон с запасом за кадр (переход thru показывает сцену издалека — края кадра не видны)
const BG = c => `<rect x="-4000" y="-4000" width="9080" height="9920" fill="${c || P.bg}"/>`;

// ---------- звуки по событиям ----------
window.CUES = window.CUES || {};
function cue(t0, name, gain = 1, pan = 0) {
  if (!(t0 >= 0) || !name) return;
  const k = name + '@' + Math.round(t0 * 40);
  if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, Math.round(clamp(pan, -1, 1) * 100) / 100];
}
const _pop5 = pop;
pop = function (inner, x, y, t, t0, o = {}) { if (o.snd !== false) cue(t0 + .02, o.snd || 'pop', o.sg ?? .7, (x - 540) / 700); return _pop5(inner, x, y, t, t0, o) };
const _stamp5 = stamp;
stamp = function (s, x, y, t, t0, o = {}) { cue(t0 + .2, 'stamp', 1, (x - 540) / 900); return _stamp5(s, x, y, t, t0, o) };

// ---------- переходы ----------
const _tr5 = transition;
transition = function (kind, k, A, B, SA, SB) {
  cue(SB.a, 'tr_' + kind);
  const fx = (EP.trAt && EP.trAt[SA.key]) || [540, CY];
  if (kind === 'thru') {
    // портал — круг радиуса pr вокруг fx на сцене A; внутри него сцена B, уменьшенная в Z раз. Камера летит в портал.
    const pr = (EP.trR && EP.trR[SA.key]) || 70, Z = 1260 / pr, e = EZ.io(k), z = Math.pow(Z, e);
    const em = EZ.io5(clamp(k * 1.15)), cx = lerp(fx[0], 540, em), cy = lerp(fx[1], CY, em), rr = pr * z, id = uid();
    const trA = `translate(${R(cx)} ${R(cy)}) scale(${Math.round(z * 1000) / 1000}) translate(${R(-fx[0])} ${R(-fx[1])})`;
    const trB = `translate(${R(cx)} ${R(cy)}) scale(${Math.round(z / Z * 10000) / 10000}) translate(-540 ${-CY})`;
    const bgc = (EP.trBg && EP.trBg[SA.key]) || P.bg;
    let s = g(A, trA) + `<clipPath id="${id}"><circle cx="${R(cx)}" cy="${R(cy)}" r="${R(rr)}"/></clipPath><g clip-path="url(#${id})">${BG(bgc)}${g(B, trB)}</g>`;
    const ring = EP.trRing && EP.trRing[SA.key];
    if (ring !== 0 && rr < 2400) s += `<circle cx="${R(cx)}" cy="${R(cy)}" r="${R(rr)}" fill="none" stroke="${(EP.trCol && EP.trCol[SA.key]) || P.ink}" stroke-width="${R((ring || 7) * Math.min(z, 3))}"/>`;
    return s
  }
  if (/^whip/.test(kind)) {
    const e = EZ.io5(k), d = kind === 'whipL' ? [1, 0] : kind === 'whipU' ? [0, -1] : kind === 'whipD' ? [0, 1] : [-1, 0];
    let s = g(A, `translate(${R(d[0] * W * e)} ${R(d[1] * H * e)})`) + g(B, `translate(${R(-d[0] * W * (1 - e))} ${R(-d[1] * H * (1 - e))})`);
    const sp = Math.sin(clamp(k) * PI);
    if (sp > .15) for (let i = 0; i < 16; i++) {
      const u = rnd(i * 7 + 3), v = rnd(i * 13 + 1), len = (260 + 700 * rnd(i + 5)) * sp, col = i % 3 ? P.paper : (P.a1 || P.paper);
      const x = d[0] ? (u * 1400 - 160) : u * 1080, y = d[1] ? (u * 2200 - 140) : v * 1920;
      s += `<path d="M${R(x)} ${R(y)}l${R(d[0] * len)} ${R(d[1] * len)}" stroke="${col}" stroke-width="${R(4 + 8 * rnd(i + 9))}" stroke-linecap="round"/>`;
    }
    return s
  }
  return _tr5(kind, k, A, B, SA, SB)
};
Object.assign(TRD, { thru: .95, whip: .36, whipL: .36, whipU: .36, whipD: .36 });

// ---------- фоны ----------
// лучи от (cx,cy): n клиньев цвета c (доля w от сектора), поворот rot
function rays(cx, cy, n, c, rot = 0, r = 2600, w = .5) {
  let d = '';
  for (let i = 0; i < n; i++) { const a0 = rad(rot + i * 360 / n), a1 = a0 + rad(360 / n * w); d += `M${R(cx)} ${R(cy)}L${R(cx + Math.cos(a0) * r)} ${R(cy + Math.sin(a0) * r)}L${R(cx + Math.cos(a1) * r)} ${R(cy + Math.sin(a1) * r)}Z` }
  return `<path d="${d}" fill="${c}"/>`
}
// косые полосы через весь кадр: ширина w, шаг gap, угол ang (от вертикали), сдвиг off
function stripes(c, w = 60, gap = 160, ang = 30, off = 0) {
  const tn = Math.tan(rad(ang)) * 2400; let d = '';
  for (let x = -2600 + (off % gap + gap) % gap; x < 3600; x += gap) d += `M${R(x)} -200L${R(x + w)} -200L${R(x + w - tn)} 2200L${R(x - tn)} 2200Z`;
  return `<path d="${d}" fill="${c}"/>`
}
// пробковая доска: крапинки двух тонов + «завал» на заднем плане (вырезки, стикеры с «?», фотки, нитки — как стена заговора);
// ox, oy — сдвиг (камера едет по доске)
function cork(ox = 0, oy = 0, o = {}) {
  const c1 = o.c1 || '#B97E4E', c2 = o.c2 || '#D49B67'; let a = '', b = '', junk = '', thr = '';
  const x0 = Math.floor((ox - 200) / 600), y0 = Math.floor((oy - 200) / 600);
  for (let gx = x0; gx < x0 + 4; gx++) for (let gy = y0; gy < y0 + 5; gy++) {
    for (let i = 0; i < 26; i++) {
      const sd = gx * 131 + gy * 977 + i * 7, x = gx * 600 + rnd(sd) * 600 - ox, y = gy * 600 + rnd(sd + 3) * 600 - oy, r = 4 + rnd(sd + 5) * 9;
      if (x < -40 || x > 1120 || y < -40 || y > 1960) continue;
      (i % 2 ? (a += D_.ell(x, y, r * 1.3, r)) : (b += D_.ell(x, y, r, r * .8)));
    }
    if (o.clutter === false) continue;
    // одна вещь на клетку 600×600 — бледнее переднего плана
    const sd = gx * 53 + gy * 211, x = gx * 600 + 80 + rnd(sd) * 440 - ox, y = gy * 600 + 80 + rnd(sd + 1) * 440 - oy, kind = Math.floor(rnd(sd + 2) * 4), r = (rnd(sd + 3) - .5) * 16;
    if (x < -260 || x > 1340 || y < -300 || y > 2220) continue;
    let it = '';
    if (kind === 0) { it = sh(D_.rr(-110, -140, 220, 280, 4), '#E8DCC2', { c: '#9C7350', w: 3 }); for (let l = 0; l < 7; l++) it += line(`M-86 ${-104 + l * 32}H${l === 0 ? 40 : 86}`, 1, { c: l ? '#B9A88A' : '#7A6A55', w: l ? 6 : 12 }) }
    else if (kind === 1) it = sh(D_.rr(-90, -90, 180, 180, 4), '#E8C64A', { c: '#9C7350', w: 3 }) + tx('?', 0, 40, { f: 'U', w: 800, s: 110, c: '#A8852A' });
    else if (kind === 2) it = sh(D_.rr(-100, -120, 200, 240, 4), '#EFE8DA', { c: '#9C7350', w: 3 }) + sh(D_.rr(-80, -100, 160, 150, 2), '#7E8A9C') + sh(D_.circ(-20, -40, 26), '#A9B4C4') + sh('M-80 50L-30 0L10 30L50 -20L80 10V50Z', '#5F6B7D');
    else { it = sh(D_.rr(-140, -60, 280, 120, 4), '#E8DCC2', { c: '#9C7350', w: 3 }) + tx('?!', -70, 26, { f: 'U', w: 800, s: 64, c: '#B4524A' }) + line('M0 -20H110M0 10H90M0 36H100', 1, { c: '#B9A88A', w: 6 }) }
    it += sh(D_.circ(0, kind === 3 ? -54 : kind === 1 ? -76 : -112, 12), '#B4524A', { c: '#6B4A33', w: 3 });
    junk += g(it, at(x, y, .9, r));
    if (rnd(sd + 9) < .55) thr += `M${R(x)} ${R(y - 100)}Q${R(x + 300)} ${R(y + 60)} ${R(x + 600)} ${R(y - 40 + (rnd(sd + 11) - .5) * 300)}`;
  }
  return BG(o.f || '#C68B59') + `<path d="${a}" fill="${c1}"/><path d="${b}" fill="${c2}"/>` + junk + (thr ? `<path d="${thr}" fill="none" stroke="#B4524A" stroke-width="5" stroke-linecap="round"/>` : '')
}

// ---------- проявление, удар, скорость ----------
// обводка рисуется, следом снизу вверх заливается цвет
function drawOn(d, t, t0, o = {}) {
  const dur = o.d ?? .6, k = P01(t, t0, dur); if (k <= 0) return '';
  const kl = EZ.o(clamp(k / .7)), kf = EZ.o5(clamp((k - .35) / .65));
  let s = '';
  if (o.f && kf > 0) {
    if (kf >= 1) s += sh(d, o.f);
    else { const bb = bbox(d); s += clip(D_.rr(bb[0] - 20, bb[1] + bb[3] * (1 - kf) - 20, bb[2] + 40, bb[3] * kf + 40, 0), sh(d, o.f)) }
  }
  if (o.c !== null) s += line(d, kl, { c: o.c || P.ink, w: o.w ?? 6 });
  return s
}
// вспышка цветом на 2 кадра (удар на бит)
const flashF = (t, t0, c, d = .07) => { cue(t0, 'hit', .8); return t >= t0 && t < t0 + d ? BG(c) : '' };
// линии скорости за предметом, летящим в направлении ang
function speed(x, y, t, t0, d = .4, ang = 0, o = {}) {
  const k = P01(t, t0, d); if (k <= 0 || k >= 1) return '';
  const a = rad(ang + 180), sp = Math.sin(k * PI); let s = '';
  for (let i = 0; i < (o.n || 5); i++) {
    const off = (i - ((o.n || 5) - 1) / 2) * (o.gap || 46), l = (o.len || 260) * sp * (.6 + .4 * rnd(i + 3)), px = x - Math.sin(a) * off, py = y + Math.cos(a) * off;
    const s0 = (o.r0 || 90) + 40 * rnd(i);
    s += `<path d="M${R(px + Math.cos(a) * s0)} ${R(py + Math.sin(a) * s0)}l${R(Math.cos(a) * l)} ${R(Math.sin(a) * l)}" stroke="${o.c || P.paper}" stroke-width="${o.w || 7}" stroke-linecap="round"/>`;
  }
  return s
}
// «мультяшный» пыльный хлопок при приземлении — плотные кружки, без прозрачности
function puffs(x, y, t, t0, o = {}) {
  const k = P01(t, t0, o.d ?? .45); if (k <= 0 || k >= 1) return '';
  let s = ''; for (let i = 0; i < (o.n || 6); i++) { const sd = i - ((o.n || 6) - 1) / 2, px = x + sd * (o.sp || 40) * (1 + EZ.o(k) * 1.4), py = y - Math.abs(sd) * 6 - EZ.o(k) * 30, r = (o.r || 26) * (1 - k) * (1 - Math.abs(sd) * .08); if (r > 1) s += `<circle cx="${R(px)}" cy="${R(py)}" r="${R(r)}" fill="${o.c || P.paper}"/>` }
  return s
}
// буквы падают сверху по одной (как в nicw), со звуком
function dropWord(str, x, y, t, t0, o = {}) {
  const sz = o.s || 110, f = o.f || 'U', w0 = o.w || 800, ws = [...str].map(ch => tw(ch, { f, w: w0, s: sz })), tot = ws.reduce((a, b) => a + b, 0);
  let cx = x - tot / 2, s = '';
  [...str].forEach((ch, i) => { const t1 = t0 + i * (o.stag ?? .045), k = P01(t, t1, o.d ?? .42); if (i % 2 === 0) cue(t1 + .3, 'tick', .5); if (k > 0) s += g(tx(ch, 0, 0, { f, w: w0, s: sz, c: o.c || P.ink, a: 'start' }), `translate(${R(cx)} ${R(y - (1 - EZ.back(k)) * 140)}) rotate(${R((1 - EZ.o(k)) * (i % 2 ? 14 : -14))})`, clamp(k * 3)); cx += ws[i] });
  return s
}
// строка капсом печатается по буквам (стук машинки)
function typeCap(str, x, y, t, t0, o = {}) {
  const d = o.d ?? .5; if (str) cue(t0, 'type', o.sg ?? .6, (x - 540) / 900);
  const n = Math.floor(clamp((t - t0) / d) * str.length); return n > 0 ? cap(str.slice(0, n), x, y, o) : ''
}

// ---------- предметы ----------
// БАКЛАЖАН: центр тела (0,0), высота ~520; face — {mood, look}; bite — откушено
const EGG = 'M8 -212C70 -214 96 -126 104 -46C112 34 160 112 152 196C146 270 70 308 -8 300C-92 292 -140 226 -136 144C-132 66 -84 12 -72 -70C-62 -150 -52 -210 8 -212Z';
function eggplant(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#6B3FA0', f2 = o.f2 || '#532F80', gr = o.g || '#5E9E5A', gr2 = o.g2 || '#3F7A45';
  let s = sh(EGG, f) + clip(EGG, sh('M60 -220C110 -100 120 40 190 140C200 260 120 330 40 320C110 260 120 120 60 -220Z', f2)) + line(EGG, 1, { c, w: o.w ?? 7 });
  s += `<path d="M-84 40C-92 -10 -70 -80 -56 -140" stroke="#fff" stroke-width="12" stroke-linecap="round" fill="none" opacity=".35"/>`;
  // чашечка и хвостик
  s += sh('M-28 -300C-24 -260 -20 -236 -14 -214L22 -214C24 -240 30 -266 40 -296C26 -306 -14 -308 -28 -300Z', gr, { c, w: 6 });
  s += sh('M-82 -170C-60 -176 -40 -196 -28 -226C-6 -196 4 -180 14 -150C26 -184 44 -204 58 -222C70 -196 86 -176 102 -168C82 -186 70 -214 52 -238C30 -252 -10 -252 -36 -240C-56 -224 -70 -196 -82 -170Z', gr, { c, w: 6 });
  s += sh('M14 -150C26 -184 44 -204 58 -222C70 -196 86 -176 102 -168C82 -186 70 -214 52 -238C40 -230 26 -206 14 -150Z', gr2);
  if (o.face) {
    const m = o.face.mood || 'calm', lk = (o.face.look || 0) * 8, bl = o.face.blink ?? blink(t, o.seed || 4);
    for (const ex of [-46, 26]) s += bl > .6 || m === 'happy' ? line(`M${ex - 14 + lk} 40Q${ex + lk} ${m === 'happy' ? 24 : 50} ${ex + 14 + lk} 40`, 1, { c, w: 6 }) : `<ellipse cx="${ex + lk}" cy="40" rx="13" ry="${R(16 * (1 - bl))}" fill="${c}"/><circle cx="${ex + 5 + lk}" cy="34" r="5" fill="#fff"/>`;
    if (m === 'smile' || m === 'happy') s += sh(`M${-26 + lk} 84Q${-6 + lk} 112 ${16 + lk} 84Z`, c);
    else if (m === 'o') s += sh(D_.ell(-6 + lk, 96, 12, 16), c);
    else if (m === 'sly') s += line(`M${-30 + lk} 90Q${-6 + lk} 100 ${20 + lk} 80`, 1, { c, w: 6 }) + line(`M-64 4L-30 14M10 10L42 2`, 1, { c, w: 6 });
    else s += line(`M${-22 + lk} 90L${10 + lk} 90`, 1, { c, w: 6 });
  }
  if (o.label) s += g(sh(D_.rr(-110, -30, 220, 70, 14), '#FFFFFF', { c, w: 5 }) + tx(o.label, 0, 16, { f: 'O', w: 700, s: 36, c, ls: 2 }), at(0, o.ly ?? 150, 1, -6));
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ПОМИДОР
function tomato(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#E2574C', f2 = o.f2 || '#C2433A';
  const d = 'M0 -96C70 -100 124 -60 124 6C124 74 66 112 0 112C-66 112 -124 74 -124 6C-124 -60 -70 -100 0 -96Z';
  let s = sh(d, f) + clip(d, sh(D_.ell(70, 30, 90, 110), f2)) + line(d, 1, { c, w: 7 }) + line('M-40 -90C-60 -30 -60 40 -30 104M40 -90C60 -30 60 40 30 104', 1, { c, w: 4, op: .45 });
  s += `<path d="M-84 -30Q-74 -60 -46 -72" stroke="#fff" stroke-width="12" stroke-linecap="round" fill="none" opacity=".45"/>`;
  s += sh(D_.star(0, -96, 64, 18, 5, -90), '#5E9E5A', { c, w: 5 }) + sh(D_.rr(-8, -136, 16, 40, 6), '#3F7A45', { c, w: 5 });
  return g(s + faceOn(t, o, 0, 0), at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// КАРТОШКА
function potato(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#C9A46A', f2 = o.f2 || '#AE8850';
  const d = 'M-130 -10C-140 -80 -60 -110 10 -100C90 -94 140 -60 134 10C128 80 70 104 -10 102C-90 100 -124 60 -130 -10Z';
  let s = sh(d, f) + clip(d, sh(D_.ell(60, 70, 140, 70), f2)) + line(d, 1, { c, w: 7 });
  for (const [x, y] of [[-70, -40], [50, -60], [80, 40], [-40, 50]]) s += line(`M${x - 10} ${y}Q${x} ${y - 8} ${x + 10} ${y}`, 1, { c, w: 4, op: .6 });
  return g(s + faceOn(t, o, 0, 0), at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ПЕРЕЦ (болгарский)
function pepper(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#FFB238', f2 = o.f2 || '#E8901F';
  const d = 'M-100 -60C-110 -110 -40 -120 0 -100C40 -120 110 -110 100 -60C120 0 114 90 80 120C60 140 30 130 20 112C10 132 -10 132 -20 112C-30 130 -60 140 -80 120C-114 90 -120 0 -100 -60Z';
  let s = sh(d, f) + clip(d, sh(D_.ell(70, 40, 60, 140), f2)) + line(d, 1, { c, w: 7 }) + line('M0 -96C-10 -20 -6 60 0 112', 1, { c, w: 4, op: .45 });
  s += sh('M-36 -100C-20 -120 20 -120 36 -100C20 -94 -20 -94 -36 -100Z', '#3F7A45', { c, w: 5 }) + sh('M-6 -110C-8 -140 4 -160 20 -170L30 -160C18 -150 10 -134 10 -110Z', '#5E9E5A', { c, w: 5 });
  s += `<path d="M-70 -30Q-66 -60 -44 -76" stroke="#fff" stroke-width="12" stroke-linecap="round" fill="none" opacity=".45"/>`;
  return g(s + faceOn(t, o, 0, 10), at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// простое лицо (для овощей): o.face = {mood, look}
function faceOn(t, o, x, y) {
  if (!o.face) return '';
  const c = o.c ?? P.ink, m = o.face.mood || 'calm', lk = (o.face.look || 0) * 6, bl = o.face.blink ?? blink(t, o.seed || 6);
  let s = '';
  for (const ex of [-26, 26]) s += bl > .6 || m === 'happy' ? line(`M${x + ex - 11 + lk} ${y + 2}Q${x + ex + lk} ${y + (m === 'happy' ? -10 : 9)} ${x + ex + 11 + lk} ${y + 2}`, 1, { c, w: 5 }) : `<ellipse cx="${x + ex + lk}" cy="${y}" rx="9" ry="${R(12 * (1 - bl))}" fill="${c}"/><circle cx="${x + ex + 3 + lk}" cy="${y - 4}" r="3.5" fill="#fff"/>`;
  if (m === 'smile' || m === 'happy') s += sh(`M${x - 14 + lk} ${y + 26}Q${x + lk} ${y + 46} ${x + 14 + lk} ${y + 26}Z`, c);
  else if (m === 'o') s += sh(D_.ell(x + lk, y + 36, 9, 12), c);
  else s += line(`M${x - 10 + lk} ${y + 32}L${x + 10 + lk} ${y + 32}`, 1, { c, w: 5 });
  return s
}
// КУСТ ТАБАКА: основание стебля (0,0) на уровне земли, высота h; roots — корни (0..1), flow — бег молекул по стеблю (время)
function tobaccoPlant(t, o = {}) {
  const c = o.c ?? P.ink, h = o.h || 900, sway = Math.sin(t * 1.3) * (o.sway ?? 2);
  let s = '';
  if (o.roots) {
    const k = clamp(o.roots), rd = 'M0 0C-10 80 -40 140 -90 200M0 0C10 90 0 170 20 260M0 0C20 60 70 110 120 150M-40 120C-80 130 -120 120 -160 140M10 150C50 170 80 200 90 250M-70 180C-60 220 -70 250 -90 280';
    s += line(rd, k, { c: o.rc || '#E8C9A0', w: 12 });
  }
  s += line(`M0 0C${R(sway * 4)} ${-h * .4} ${R(sway * 8)} ${-h * .7} ${R(sway * 10)} ${-h}`, 1, { c, w: 22 }) + line(`M0 0C${R(sway * 4)} ${-h * .4} ${R(sway * 8)} ${-h * .7} ${R(sway * 10)} ${-h}`, 1, { c: o.sc || '#7FB84A', w: 12 });
  const lv = o.leaves || [[.18, -62, 1], [.32, 58, .95], [.48, -58, .85], [.62, 56, .75], [.76, -54, .6], [.88, 50, .45]];
  lv.forEach(([u, a, sc], i) => { const y = -h * u, x = sway * 10 * u; s += g(leafT({ len: 420 * sc, w: 160 * sc, c, ow: 5, vw: 3, dots: false, k: o.vk ?? 1 }), at(x, y, 1, a + Math.sin(t * 1.6 + i) * 3)) });
  if (o.flowers !== false) for (let i = 0; i < 4; i++) { const a = rad(-90 + (i - 1.5) * 28), x = sway * 10 + Math.cos(a) * 70, y = -h + Math.sin(a) * 70 - 10; s += line(`M${R(sway * 10)} ${-h}L${R(x)} ${R(y)}`, 1, { c, w: 6 }) + g(sh(D_.star(0, 0, 34, 16, 5), o.fc || '#F28DB2', { c, w: 4 }) + sh(D_.circ(0, 0, 8), '#FFE08A'), at(x, y, 1, i * 20)) }
  if (o.flow != null) for (let i = 0; i < 7; i++) { const u = ((o.flow * .6 + i / 7) % 1), y = -h * .72 * u + (o.roots ? 120 * (1 - u) * 0 : 0); s += molIcon(sway * 8 * u, y, .2, o.mf || '#E9A23B', c) }
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// МУРАВЕЙ сбоку (смотрит вправо), ноги в y=0; hat — соломенная шляпа; pail — ведёрко в передней лапе
function ant(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#8E3B2E', f2 = o.f2 || '#6E2A21', st = o.walk ? Math.sin(t * 15) : 0;
  let s = '';
  const legs = side => { let q = ''; for (let i = 0; i < 3; i++) { const bx = -12 + i * 26, ph = (i % 2 ? 1 : -1) * side * st, kx = bx + (i - 1) * 30 + ph * 14, fx0 = bx + (i - 1) * 62 + ph * 22, lift = Math.max(0, -ph) * 10 * side; q += line(`M${bx} -64L${R(kx)} ${R(-82 - lift)}L${R(fx0)} ${R(-lift)}`, 1, { c, w: 6 }) } return q };
  s += legs(-1);
  s += sh(D_.ell(-120, -80, 78, 56), f, { c, w: 6 }) + sh('M-120 -136C-60 -130 -50 -40 -110 -26C-80 -60 -84 -110 -120 -136Z', f2);
  s += sh(D_.ell(-34, -72, 16, 14), f, { c, w: 5 }) + sh(D_.ell(22, -76, 46, 26), f, { c, w: 6 });
  s += sh(D_.ell(100, -96, 46, 40), f, { c, w: 6 }) + `<circle cx="116" cy="-106" r="9" fill="${c}"/><circle cx="119" cy="-109" r="3" fill="#fff"/>`;
  s += line('M140 -76L162 -70L150 -60', 1, { c, w: 5 });
  const an = Math.sin(t * 5) * 5;
  s += line(`M108 -132L120 ${R(-186 + an)}L170 ${R(-206 + an)}`, 1, { c, w: 5 }) + line(`M94 -134L96 ${R(-190 - an)}L140 ${R(-226 - an)}`, 1, { c, w: 5, op: .7 });
  s += legs(1);
  if (o.hat) s += sh('M50 -128C60 -150 150 -150 158 -128Z', '#E8C46A', { c, w: 5 }) + sh('M70 -134C76 -176 132 -176 138 -134Z', '#E8C46A', { c, w: 5 }) + line('M72 -142H136', 1, { c: '#E2574C', w: 7 });
  if (o.pail) s += g(line('M-30 -70C-30 -110 30 -110 30 -70', 1, { c, w: 5 }) + sh('M-34 -70L-26 0H26L34 -70Z', '#9AA6B8', { c, w: 5 }) + (o.pailFill ? sh(D_.ell(0, -70, 34, 8), '#FFD23F', { c, w: 4 }) : ''), at(180, -20, .7));
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0) + (o.flipX ? ' scale(-1 1)' : ''), o.op ?? 1)
}
// ТЛЯ+: поверх aphid() — glasses, helmet, wings (взмах), lid (прищур 0..1), brow (злая бровь), smirk, sign (табличка)
function aphidX(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#A6D86B';
  let s = '';
  const wingT = o.wings ? Math.sin(t * 34) * 18 : 0;
  const wing = (rot, col) => g(sh('M0 0C40 -60 150 -110 210 -90C240 -60 170 -10 0 0Z', col, { c, w: 5 }) + line('M10 -6C70 -40 130 -70 190 -84', 1, { c, w: 3, op: .5 }), `translate(-20 -70) rotate(${R(rot)})`);
  if (o.wings) s += wing(-150 - wingT, '#C9DFF2');
  s += aphid(t, { ...o, x: 0, y: 0, s: 1, r: 0, flipX: false, op: 1, mood: o.lid ? 'calm' : o.mood, blink: o.lid ? 0 : o.blink });
  if (o.wings) s += wing(-130 + wingT, '#E8F4FF');
  if (o.lid) { const ly = -50 + 15 * clamp(o.lid); s += sh(`M94 -52L124 -52L124 ${R(ly)}L94 ${R(ly)}Z`, f) + line(`M93 ${R(ly)}L125 ${R(ly - 2)}`, 1, { c, w: 5 }) }
  if (o.brow) s += line(`M90 ${-62 - o.brow * 4}L126 ${-54 + o.brow * 2}`, 1, { c, w: 6 });
  if (o.smirk) s += line('M108 -8Q122 0 134 -18', 1, { c, w: 5 });
  if (o.glasses) s += `<circle cx="108" cy="-36" r="21" fill="none" stroke="${c}" stroke-width="5"/>` + line('M87 -38L64 -44M129 -36L140 -32', 1, { c, w: 5 });
  if (o.helmet) s += sh('M58 -46C60 -100 140 -104 150 -50Z', '#5B6B3A', { c, w: 5 }) + sh('M52 -50H156V-40H52Z', '#4A5830', { c, w: 4 });
  if (o.hat) s += sh('M74 -70C80 -110 130 -110 136 -70Z', '#2B2F3A', { c, w: 5 }) + sh('M60 -70H150V-60H60Z', '#2B2F3A', { c, w: 5 });
  if (o.flag) { const fw = Math.sin(t * 9) * 6; s += line('M150 -10L180 -170', 1, { c, w: 6 }) + sh(`M178 -170L${R(250 + fw)} -150L174 -126Z`, o.flag, { c, w: 4 }) }
  if (o.juice) s += g(sh(D_.rr(-34, -50, 68, 100, 8), '#7FC48A', { c, w: 5 }) + sh(D_.rr(-34, -10, 68, 34, 0), '#FFD23F') + line(D_.rr(-34, -50, 68, 100, 8), 1, { c, w: 5 }) + line('M10 -50L24 -96L52 -110', 1, { c: '#E2574C', w: 7 }), at(168, -6, .9, -8));
  if (o.marker) s += g(sh(D_.rr(-14, -80, 28, 120, 8), '#E23B3B', { c, w: 5 }) + sh(D_.rr(-14, -80, 28, 26, 6), '#2B2F3A', { c, w: 5 }), at(146, -10, 1, o.marker));
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0) + (o.flipX ? ' scale(-1 1)' : ''), o.op ?? 1)
}
// КНОПКА-гвоздик (вид сверху, чуть сбоку)
const pushpin = (x, y, col = '#E23B3B', s = 1) => g(sh(D_.ell(8, 10, 22, 14), 'rgba(0,0,0,.22)') + sh(D_.circ(0, 0, 22), col, { c: '#15121F', w: 4 }) + sh(D_.circ(-6, -6, 7), '#fff', { op: .7 }), at(x, y, s));
// КРАСНАЯ НИТЬ между точками, провисает на sag; k — сколько протянуто
function thread(x0, y0, x1, y1, k = 1, o = {}) {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + (o.sag ?? 60) + Math.sin((o.t || 0) * 2 + x0) * (o.wob ?? 0);
  return line(`M${R(x0)} ${R(y0)}Q${R(mx)} ${R(my)} ${R(x1)} ${R(y1)}`, k, { c: o.c || '#E23B3B', w: o.w ?? 7 })
}
// ПОЛАРОИД: фото 320×300 (inner рисуется в центре фото в своих координатах), подпись, кнопка сверху
function polaroid(inner, x, y, o = {}) {
  const w = o.w || 380, ph = o.ph || 320, pw = w - 40, h = ph + (o.cap ? 110 : 60);
  let s = sh(D_.rr(-w / 2 + 12, -h / 2 + 14, w, h, 6), o.sh || 'rgba(0,0,0,.25)') + sh(D_.rr(-w / 2, -h / 2, w, h, 6), '#FBF8F0', { c: '#15121F', w: 4 });
  const py = -h / 2 + 20 + ph / 2;
  s += clip(D_.rr(-pw / 2, py - ph / 2, pw, ph, 2), sh(D_.rr(-pw / 2, py - ph / 2, pw, ph, 0), o.bg || '#2B2742') + g(inner, `translate(0 ${R(py)})`)) + line(D_.rr(-pw / 2, py - ph / 2, pw, ph, 2), 1, { c: '#15121F', w: 3 });
  if (o.cap) s += tx(o.cap, 0, h / 2 - 34, { f: 'M', w: 800, s: o.cs || 38, c: '#15121F' });
  if (o.pin !== false) s += pushpin(0, -h / 2 + 4, o.pinC || '#E23B3B', 1.1);
  return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
}
// СТИКЕР (жёлтый листок) с 1–3 строками
function sticky(lines, x, y, o = {}) {
  const w = o.w || 300, f = o.f || '#FFD23F', sz = o.sz || 40;
  let s = sh(D_.rr(-w / 2 + 10, -w / 2 + 12, w, w, 4), 'rgba(0,0,0,.22)') + sh(`M${-w / 2} ${-w / 2}H${w / 2}V${w / 2 - 40}L${w / 2 - 40} ${w / 2}H${-w / 2}Z`, f, { c: '#15121F', w: 4 }) + sh(`M${w / 2} ${w / 2 - 40}L${w / 2 - 40} ${w / 2 - 40}L${w / 2 - 40} ${w / 2}Z`, '#E8B92A', { c: '#15121F', w: 4 });
  lines.forEach((l, i) => { s += tx(l, 0, -((lines.length - 1) * sz * .62) + i * sz * 1.24 + sz * .36, { f: 'M', w: 800, s: sz, c: o.tc || '#15121F' }) });
  if (o.pin !== false) s += pushpin(0, -w / 2 + 22, o.pinC || '#2F56A6');
  return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
}
// ЧЕРТЁЖ-СЕТКА (синий лист)
function blueprint(x, y, w, h, o = {}) {
  let s = sh(D_.rr(x, y, w, h, 8), o.f || '#1E4E8C', { c: '#0E2B52', w: 6 }), gd = '';
  for (let gx = x + 40; gx < x + w; gx += 40) gd += `M${gx} ${y}V${y + h}`;
  for (let gy = y + 40; gy < y + h; gy += 40) gd += `M${x} ${gy}H${x + w}`;
  return s + `<path d="${gd}" stroke="#3A6DB0" stroke-width="2" fill="none"/>`
}
// размерная линия со стрелками и числом
function dimLine(x0, y0, x1, y1, label, k = 1, o = {}) {
  const c = o.c || '#EAF2FF', a = Math.atan2(y1 - y0, x1 - x0), ah = (px, py, s) => `M${R(px)} ${R(py)}l${R(Math.cos(a + s * 2.6) * 22)} ${R(Math.sin(a + s * 2.6) * 22)}M${R(px)} ${R(py)}l${R(Math.cos(a - s * 2.6) * 22)} ${R(Math.sin(a - s * 2.6) * 22)}`;
  let s = line(`M${x0} ${y0}L${x1} ${y1}`, k, { c, w: 4 });
  if (k >= 1) s += line(ah(x0, y0, -1) + ah(x1, y1, 1), 1, { c, w: 4 }) + tx(label, (x0 + x1) / 2 + (o.lx || 0), (y0 + y1) / 2 + (o.ly ?? -16), { f: 'O', w: 500, s: o.s || 30, c });
  return s
}
// ВЕСЫ с чашами: ang — наклон коромысла (+ — правая вниз); left/right — что на чашах (рисуется над чашей, низ в y=0)
function scales(t, o = {}) {
  const c = o.c ?? P.ink, ang = o.ang || 0, L0 = o.arm || 330, f = o.f || '#E9A23B', f2 = o.f2 || '#C9832C';
  const pa = rad(ang), lx = -Math.cos(pa) * L0, ly = -Math.sin(pa) * L0, rx = Math.cos(pa) * L0, ry = Math.sin(pa) * L0, ch = o.chain || 260;
  let s = sh('M-160 520H160L120 470H-120Z', f2, { c, w: 6 }) + sh(D_.rr(-18, 0, 36, 480, 10), f, { c, w: 6 });
  const pan = (x, y, inner) => line(`M${R(x - 120)} ${R(y + ch)}L${R(x)} ${R(y)}L${R(x + 120)} ${R(y + ch)}`, 1, { c, w: 5 }) + g(inner || '', at(x, y + ch)) + sh(`M${R(x - 150)} ${R(y + ch)}Q${R(x)} ${R(y + ch + 90)} ${R(x + 150)} ${R(y + ch)}Z`, f, { c, w: 6 });
  s += pan(lx, ly, o.left) + pan(rx, ry, o.right);
  s += g(sh(D_.rr(-L0 - 20, -14, L0 * 2 + 40, 28, 14), f, { c, w: 6 }), `rotate(${R(ang)})`) + sh(D_.circ(0, 0, 26), f2, { c, w: 6 });
  s += sh('M-14 -40L0 -90L14 -40Z', o.nc || '#E2574C', { c, w: 5, tr: `rotate(${R(ang)})` });
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ПАЧКА СИГАРЕТ (открытая): центр (0,0)
function cigPack(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#F2ECDD', f2 = o.f2 || '#E2574C';
  let s = '';
  for (let i = 0; i < 4; i++) s += g(sh(D_.rr(-16, -140, 32, 150, 8), '#FFFFFF', { c, w: 4 }) + sh(D_.rr(-16, -140, 32, 44, 8), '#E9A23B', { c, w: 4 }), at(-66 + i * 44, -120 + (i % 2) * 22));
  s += sh(D_.rr(-120, -150, 240, 300, 16), f, { c, w: 7 }) + sh(D_.rr(-120, -150, 240, 90, 16), f2, { c, w: 7 }) + sh(D_.rr(-120, 40, 240, 20, 0), f2);
  s += tx(o.label || '20', 0, 10, { f: 'O', w: 700, s: 74, c });
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ПРОФИЛЬ с лицом (вправо): лоб, нос, губы; puff 0..1 — губы трубочкой; eye закрыт при relax
const HEAD2 = 'M-130 200C-160 120 -176 40 -168 -60C-158 -180 -60 -250 50 -240C150 -230 204 -160 204 -60C204 -30 212 -6 236 34C244 48 232 60 216 62C214 86 218 104 206 116C214 128 210 146 196 150C198 176 186 196 156 200L110 204L110 280L-130 280Z';
function face2(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#E9B48F', f2 = o.f2 || '#D49A72', hc = o.hc || '#3B2A20', pf = clamp(o.puff || 0);
  let s = sh(HEAD2, f, { c, w: 7 }) + clip(HEAD2, sh(D_.ell(-140, 40, 120, 260), f2));
  s += sh('M-170 -40C-180 -180 -60 -270 60 -250C150 -240 200 -190 210 -120C170 -150 120 -170 60 -170C10 -150 -40 -120 -60 -60C-80 -80 -120 -80 -140 -40C-150 -20 -162 -30 -170 -40Z', hc, { c, w: 6 });
  s += sh(D_.ell(-40, 20, 34, 46), f2, { c, w: 5 });
  const bl = o.relax ? 1 : blink(t, o.seed || 9);
  s += bl > .6 ? line('M120 -26Q140 -16 160 -26', 1, { c, w: 6 }) : `<ellipse cx="140" cy="-24" rx="12" ry="${R(15 * (1 - bl))}" fill="${c}"/><circle cx="145" cy="-29" r="4" fill="#fff"/>`;
  s += line('M112 -66Q140 -80 170 -70', 1, { c, w: 7 });
  s += pf > 0 ? sh(D_.ell(214, 132, 12 + pf * 4, 10 + pf * 6), c) : line('M196 128Q210 136 218 126', 1, { c, w: 6 });
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0) + (o.flipX ? ' scale(-1 1)' : ''), o.op ?? 1)
}
// РАСТУЩЕЕ ЧИСЛО с подписью (счётчик)
const counter = (v, x, y, o = {}) => odo(v, x, y, { s: o.s || 130, c: o.c || P.paper, sep: o.sep ?? ' ', post: o.post || '' });

// ---------- окружение: фоны со слоями (Андрей, 09.11: «улучши фон анимации») ----------
// Плоско, без дымки: дальний слой едет медленнее камеры (px — сдвиг камеры по x), всё чуть шевелится.
// небо полосами + солнце + облака
function envSky(t, o = {}) {
  const b = o.bands || ['#FBE3B8', '#F7D09A', '#F2BD80'], px = o.px || 0, h = o.h ?? 1150, c = o.c;
  let s = BG(b[0]);
  b.slice(1).forEach((col, i) => { s += sh(D_.rr(-300, h * (i + 1) / b.length, 1680, 2600, 0), col) });
  if (o.sun !== false) s += sh(D_.circ((o.sx ?? 810) - px * .04, o.sy ?? 400, o.sr ?? 120), o.sunC || '#FFE08A', { c, w: 6 }) + (o.sunRing !== false ? `<circle cx="${R((o.sx ?? 810) - px * .04)}" cy="${o.sy ?? 400}" r="${R((o.sr ?? 120) + 34 + Math.sin(t * 2) * 6)}" fill="none" stroke="${o.sunC || '#FFE08A'}" stroke-width="10" stroke-dasharray="18 26"/>` : '');
  for (let i = 0; i < (o.clouds ?? 3); i++) { const x = ((i * 520 + t * (12 + i * 5) - px * .12) % 1700 + 1700) % 1700 - 300; s += cloud(x, (o.cy ?? 250) + i * 95, .4 + i * .12, { f: o.cf || '#FFFFFF', c, w: 9 }) }
  return s
}
// холмы слоями (ближний — темнее, едет быстрее); на дальнем — ряды кустиков-силуэтов
function envHills(t, o = {}) {
  const px = o.px || 0, H0 = o.y ?? 980, cols = o.cols || ['#8CC66A', '#6FAF55', '#4C8A50'], c = o.c;
  let s = '';
  cols.forEach((col, i) => {
    const k = .15 + i * .22, y = H0 + i * 120, len = 1000 - i * 160;
    s += sh(D_.wave(-300, 1400, y, 34 + i * 6, len, (-px * k) / len * 2 * PI + i * 1.7, 20) + 'L1400 2600L-300 2600Z', col, { c, w: 6 });
    if (i === 0 && o.rows !== false) for (let j = 0; j < 18; j++) { const x = ((j * 84 - px * k) % 1512 + 1512) % 1512 - 216; s += g(sh('M0 0C-8 -24 -6 -52 0 -70C6 -52 8 -24 0 0Z', cols[cols.length - 1]) + sh('M0 -26C-30 -34 -42 -54 -40 -64C-16 -60 -4 -46 0 -26ZM0 -38C30 -46 42 -66 40 -76C16 -72 4 -58 0 -38Z', cols[cols.length - 1]), at(x, y - 34 + Math.sin(x / 160) * 20 + Math.sin(t * 1.4 + j) * 2, .9 + rnd(j) * .4)) }
  });
  return s
}
// комната: обои, окно со шторами и небом, рамка на стене, лампа, плинтус, пол
function envRoom(t, o = {}) {
  const wall = o.wall || '#F2E3C6', wall2 = o.wall2 || '#E9D5B0', fl = o.floor || '#C99B5F', fy = o.fy ?? 1180, c = o.c ?? P.ink, px = o.px || 0;
  let s = BG(wall) + stripes(wall2, 56, 150, 0, -px * .3);
  if (o.win !== false) {
    const wx = (o.wx ?? 820) - px * .3, wy = o.wy ?? 430, sw = Math.sin(t * .9) * 8;
    s += sh(D_.rr(wx - 150, wy - 190, 300, 380, 10), o.sky || '#9FC4E8', { c, w: 8 }) + clip(D_.rr(wx - 150, wy - 190, 300, 380, 10), cloud(wx - 60 + ((t * 16) % 300), wy - 70, .3, { c, w: 12 }) + sh(D_.circ(wx + 70, wy + 100, 50), o.sun || '#FFE08A', { c, w: 6 })) + line(`M${wx} ${wy - 190}V${wy + 190}M${wx - 150} ${wy}H${wx + 150}`, 1, { c, w: 8 });
    s += sh(`M${wx - 196} ${wy - 222}H${wx - 112}Q${wx - 100 + sw} ${wy} ${wx - 132 + sw} ${wy + 232}H${wx - 200}Z`, o.cur || '#E2574C', { c, w: 6 }) + sh(`M${wx + 196} ${wy - 222}H${wx + 112}Q${wx + 100 - sw} ${wy} ${wx + 132 - sw} ${wy + 232}H${wx + 200}Z`, o.cur || '#E2574C', { c, w: 6 }) + line(`M${wx - 230} ${wy - 222}H${wx + 230}`, 1, { c, w: 10 });
  }
  if (o.frame !== false) { const fx = (o.fx ?? 210) - px * .3; s += sh(D_.rr(fx - 90, 300, 180, 220, 8), '#FFFFFF', { c, w: 7 }) + sh(D_.rr(fx - 70, 320, 140, 180, 4), o.art || '#7FC48A') + sh(D_.circ(fx, 400, 40), o.art2 || '#FFB238') + sh(`M${fx - 70} 500L${fx - 20} 440L${fx + 20} 480L${fx + 70} 430V500Z`, o.art3 || '#3F7A45') }
  if (o.lamp !== false) { const lx = (o.lx ?? 540) - px * .2, sw = Math.sin(t * 1.3) * 5; s += line(`M${lx} -40L${R(lx + sw)} 160`, 1, { c, w: 5 }) + g(sh('M-100 0Q0 -100 100 0Z', o.lampC || '#2B2F3A', { c, w: 6 }) + sh(D_.ell(0, 6, 28, 14), '#FFE08A', { c, w: 4 }), at(lx + sw, 210, 1, sw * .6)) }
  s += sh(D_.rr(-300, fy - 40, 1680, 40, 0), o.skirt || '#FFFFFF', { c, w: 6 }) + sh(D_.rr(-300, fy, 1680, 1400, 0), fl, { c, w: 6 });
  for (let i = 1; i < 6; i++) s += line(`M-300 ${fy + i * 70}H1380`, 1, { c, w: 4, op: .2 });
  return s
}
// плитка (кухня): шахматка, полка с банками, столешница
function envTiles(t, o = {}) {
  const c1 = o.c1 || '#3A2552', c2 = o.c2 || '#45305F', st = o.st || 120, fy = o.fy ?? 1240, px = o.px || 0, c = o.c ?? P.ink;
  let s = BG(c1), d = '';
  const ox = ((-px * .3) % (st * 2) + st * 2) % (st * 2);
  for (let x = -st * 2 + ox; x < 1300; x += st) for (let y = -st; y < fy; y += st) if (((Math.round((x - ox) / st) + Math.round(y / st)) % 2 + 2) % 2) d += D_.rr(x + 5, y + 5, st - 10, st - 10, 12);
  s += `<path d="${d}" fill="${c2}"/>`;
  if (o.shelf !== false) { const sy = o.sy ?? 330, sx = (o.shx ?? 160) - px * .3; s += sh(D_.rr(sx - 120, sy, 380, 26, 6), o.wood || '#B57A45', { c, w: 6 }); [[0, '#E2574C', 90], [110, '#FFB238', 70], [210, '#7FC48A', 100]].forEach(([dx, col, h]) => { s += sh(D_.rr(sx - 90 + dx, sy - h, 80, h, 14), col, { c, w: 6 }) + sh(D_.rr(sx - 96 + dx, sy - h - 18, 92, 24, 8), '#F2ECDD', { c, w: 5 }) }) }
  s += sh(D_.rr(-300, fy, 1680, 44, 0), o.edge || '#C99B5F', { c, w: 6 }) + sh(D_.rr(-300, fy + 44, 1680, 1400, 0), o.counter || '#8A5A33', { c, w: 6 });
  return s
}
// сеть нейронов: узлы, связи, по связям бегут сигналы
const NEU = [], NEL = [];
(function () {
  for (let i = 0; i < 24; i++) NEU.push([-80 + rnd(i * 3 + 1) * 1240, -60 + rnd(i * 5 + 2) * 2040]);
  NEU.forEach((a, i) => { const d = NEU.map((b, j) => [Math.hypot(a[0] - b[0], a[1] - b[1]), j]).sort((p, q) => p[0] - q[0]); for (const [, j] of d.slice(1, 3)) if (!NEL.some(([p, q]) => (p === i && q === j) || (p === j && q === i))) NEL.push([i, j]) });
})();
function envNeurons(t, o = {}) {
  const c = o.c || '#4A3066', c2 = o.c2 || '#5A3D7A', sig = o.sig || '#FFB238', ink = o.ink ?? P.ink;
  const P0 = NEU.map(([x, y], i) => [x + Math.sin(t * .6 + i) * 14, y + Math.cos(t * .5 + i * 2) * 14]);
  let s = BG(o.bg || '#2B1B3D'), d = '';
  NEL.forEach(([a, b]) => { d += `M${R(P0[a][0])} ${R(P0[a][1])}Q${R((P0[a][0] + P0[b][0]) / 2 + 40)} ${R((P0[a][1] + P0[b][1]) / 2 - 30)} ${R(P0[b][0])} ${R(P0[b][1])}` });
  s += `<path d="${d}" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  NEL.forEach(([a, b], i) => { if (rnd(i + 7) < .55) { const k = (t * (.35 + rnd(i) * .3) + rnd(i + 3)) % 1, x = lerp(P0[a][0], P0[b][0], k) + Math.sin(k * PI) * 20, y = lerp(P0[a][1], P0[b][1], k) - Math.sin(k * PI) * 15; s += sh(D_.circ(x, y, 9), sig, { c: ink, w: 3 }) } });
  P0.forEach(([x, y], i) => { s += sh(D_.circ(x, y, 18 + rnd(i) * 16), c2, { c, w: 7 }) });
  return s
}
// большие листья по краям кадра (сад), покачиваются
function envLeaves(t, o = {}) {
  const f1 = o.f1 || '#3F7A45', f2 = o.f2 || '#356B3C', c = o.c ?? null;
  const LL = o.at || [[-70, 1950, 32, 1.15], [1150, 1750, -28, 1.05], [-110, 640, 66, .85], [1190, 260, -118, .95], [260, -160, 168, .75]];
  let s = '';
  LL.forEach(([x, y, a, sc], i) => { s += g(leafT({ len: 900 * sc, w: 330 * sc, c, f: i % 2 ? f1 : f2, f2: i % 2 ? f2 : f1, ow: 6, vw: 4, dots: false, k: c ? 1 : 0 }), at(x + Math.sin(t * .7 + i) * 12, y, 1, a + Math.sin(t * .9 + i * 2) * 3)) });
  return s
}
// узор значков: плывёт по диагонали (как фоны «Что вы знаете о»); icon(x, y, seed) → строка
function envPattern(t, icon, o = {}) {
  const st = o.step || 230, sp = o.sp ?? 20, off = ((t * sp) % st + st) % st;
  let s = o.bg ? BG(o.bg) : '';
  for (let r = -2; r < 1920 / (st * .87) + 2; r++) for (let c0 = -2; c0 < 1080 / st + 2; c0++) s += icon(c0 * st + (r % 2 ? st / 2 : 0) + off, r * st * .87 - off * .6, r * 7 + c0 * 13);
  return s
}
// город ночью: силуэты домов, окна горят и гаснут
function envCity(t, o = {}) {
  const c1 = o.c1 || '#2A2540', c2 = o.c2 || '#36304F', win = o.win || '#FFD23F', y0 = o.y ?? 1180, px = o.px || 0;
  let s = '';
  [[c1, .2, 0], [c2, .4, 1]].forEach(([col, k, L]) => {
    for (let i = 0; i < 9; i++) {
      const w = 110 + rnd(i * 5 + L) * 90, h = 260 + rnd(i * 7 + L) * 420, x = ((i * 150 + L * 70 - px * k) % 1350 + 1350) % 1350 - 140, y = y0 - h + L * 120;
      s += sh(D_.rr(x, y, w, h + 1000, 4), col);
      if (L) for (let r = 0; r < 6; r++) for (let q = 0; q < 3; q++) { const on = rnd(i * 31 + r * 7 + q + Math.floor(t * .5 + rnd(i + r))) < .45; if (on) s += sh(D_.rr(x + 16 + q * (w - 32) / 3, y + 30 + r * 60, (w - 32) / 3 - 14, 34, 4), win) }
    }
  });
  return s
}
