// shorts/v8.js — рисовка как у оригиналов «Что вы знаете о…» («Знакомьтесь, Боб»), 09.11. Грузится после v5.js.
//   Замер оригиналов (../ролики-оригиналы-09.11.md) и отзыв Андрея на v6/v7: «рисовка детская, переходы ебанутые, анимация сомнительная».
//   Что меняем:
//   • палитра на весь ролик — 3 цвета + 1 акцент (K8): ночь/синий/бумага + янтарь = никотин; красный — только «опасно»;
//   • без чёрных обводок и без лиц у предметов: плоские формы, тонкие светлые линии, полутон-точки вместо теней, плоская
//     длинная тень, косая полоса света на фоне (как Coca-Cola 0:46);
//   • переходы — камера: влёт внутрь предмета (dive), предмет превращается в следующий (сцены сами), волна (wave), сдвиг;
//   • движение — плавное (io/o5), отскок только на главном; текста на экране почти нет — цифра или слово-улика;
//   • звуков мало (cue → audio.py, набор sfx8 из ElevenLabs Sound Effects).
'use strict';
window.V8 = true;
const PI = Math.PI;
const K8 = {
  night: '#0B1028', navy: '#16214B', navy2: '#22316A', navy3: '#32478B', line: '#8DA1D6',
  paper: '#F4EFE6', paper2: '#D9D2C6', amber: '#F4A63C', amber2: '#C97B22', amber3: '#FFD08A', red: '#E9474F'
};
const BG = c => `<rect x="-4000" y="-4000" width="9080" height="9920" fill="${c}"/>`;

// ---------- звук по событиям (мало: оригиналы — 1–4 заметных звука на ролик) ----------
window.CUES = window.CUES || {};
function cue(t0, name, gain = 1, pan = 0) {
  if (!(t0 >= 0) || !name) return;
  const k = name + '@' + Math.round(t0 * 40);
  if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, Math.round(clamp(pan, -1, 1) * 100) / 100];
}

// ---------- основа ----------
const F = (d, c, o = {}) => `<path d="${d}" fill="${c}"${(o.op ?? 1) < 1 ? ` opacity="${R(Math.max(0, o.op) * 100) / 100}"` : ''}${o.tr ? ` transform="${o.tr}"` : ''}/>`;
// тонкая линия (рисуется по k)
const Ln = (d, k = 1, o = {}) => line(d, k, { c: o.c || K8.paper, w: o.w ?? 4, op: o.op ?? 1, da: o.da });
// плоская тень: та же форма, сдвиг вниз-вправо, цвет ночи
const SH = (d, o = {}) => F(d, o.c || K8.night, { op: o.op ?? .55, tr: `translate(${o.dx ?? 16} ${o.dy ?? 18})` });
// полутон: точки цвета col внутри формы d, гуще к стороне dir (v — низ, u — верх, r, l, d — вниз-вправо)
const ht = (d, col = 'p', dir = 'v', op = .55, tr = '') => `<path d="${d}" fill="url(#h8${col})" mask="url(#m8${dir})"${op < 1 ? ` opacity="${op}"` : ''}${tr ? ` transform="${tr}"` : ''}/>`;
function V8DEFS() {
  const pat = (id, c, s = 13, r = 2.1) => `<pattern id="h8${id}" width="${s}" height="${s}" patternUnits="userSpaceOnUse"><circle cx="${s / 4}" cy="${s / 4}" r="${r}" fill="${c}"/><circle cx="${s * .75}" cy="${s * .75}" r="${r}" fill="${c}"/></pattern>`;
  const mk = (id, x1, y1, x2, y2) => `<linearGradient id="g8${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient><mask id="m8${id}" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#g8${id})"/></mask>`;
  return pat('p', K8.paper) + pat('n', K8.night, 12, 2.2) + pat('a', K8.amber) + pat('l', K8.line, 14, 2) + pat('r', K8.red, 12, 2) + pat('b', K8.navy3, 16, 3)
    + mk('v', 0, 0, 0, 1) + mk('u', 0, 1, 0, 0) + mk('r', 0, 0, 1, 0) + mk('l', 1, 0, 0, 0) + mk('d', 0, 0, 1, 1) + mk('x', 1, 1, 0, 0)
    + `<mask id="m8f" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="#fff"/></mask>`
}

// фон: ночь + широкая косая полоса света (как у оригиналов) + тонкая вторая; off — сдвиг полосы (параллакс камеры)
function bgDiag(o = {}) {
  const c0 = o.c0 || K8.night, c1 = o.c1 || K8.navy, off = o.off || 0, a = o.a ?? 1;
  const band = (x, w) => D_.poly([[x + off, -400], [x + off + w, -400], [x + off + w - 1500, 2400], [x + off - 1500, 2400]]);
  let s = BG(c0) + F(band(700, 760), c1, { op: a });
  if (o.thin !== false) s += F(band(1640, 90), c1, { op: a * .7 });
  if (o.dots !== false) s += ht(band(700, 760), o.dc || 'b', 'l', .5 * a);
  return s
}
// круглый «прожектор» за предметом (мягко, без свечения — плоский круг)
const disc = (x, y, r, c = K8.navy2, op = 1) => F(D_.circ(x, y, r), c, { op });
// поплавок: медленное покачивание
const fl = (t, am = 8, sp = .35, ph = 0) => Math.sin((t * sp + ph) * 2 * PI) * am;
// плавная камера сцены: лёгкий наезд от начала до конца сцены
const push8 = (t, T, a = .06, cx = 540, cy = CY) => about(cx, cy, 1 + a * EZ.io(P01(t, T.a, T.b - T.a + .3)));
// появление: подъём + прозрачность (без отскока); back:true — с небольшим отскоком (только главное)
function rise8(inner, x, y, t, t0, o = {}) {
  const k = P01(t, t0, o.d ?? .55); if (k <= 0) return '';
  const e = (o.back ? EZ.back : EZ.o)(k), dy = (o.dy ?? 60) * (1 - EZ.o(k)), s = (o.s ?? 1) * lerp(o.from ?? .92, 1, e);
  let out = 1; if (o.out != null) { out = 1 - E(t, o.out, o.od ?? .35, 'i'); if (out <= 0) return '' }
  return g(inner, at(x, y + dy, s, o.r || 0), Math.min(clamp(k * 2.2), out))
}
// линия-«чертёж» появляется по пути
const draw8 = (d, t, t0, dur = .7, o = {}) => Ln(d, E(t, t0, dur, 'io'), o);

// ---------- переходы ----------
// dive — камера влетает в круг-портал на сцене A (trAt — центр, trR — радиус), внутри которого уже лежит сцена B
// wave — снизу вверх проходят три слоя волны (янтарь, бумага, синий), за ними — B (как «волна» Coca-Cola 0:26)
const _tr5v8 = transition;
const TRS8 = { dive: 'dive', into: 'whoosh', out: 'whoosh', zc: 'dive', wave: 'wave', pan: 'whoosh', panL: 'whoosh', panU: 'whoosh', panD: 'whoosh' };
transition = function (kind, k, A, B, SA, SB) {
  const fx = (EP.trAt && EP.trAt[SA.key]) || [540, CY];
  if (TRS8[kind]) cue(SB.a - .05, TRS8[kind], .55);
  if (kind === 'dive') {
    const pr = (EP.trR && EP.trR[SA.key]) || 80, Z = 1300 / pr, e = EZ.io(k), z = Math.pow(Z, e);
    const em = EZ.io5(clamp(k * 1.1)), cx = lerp(fx[0], 540, em), cy = lerp(fx[1], CY, em), rr = pr * z, id = uid();
    const trA = `translate(${R(cx)} ${R(cy)}) scale(${Math.round(z * 1000) / 1000}) translate(${R(-fx[0])} ${R(-fx[1])})`;
    const trB = `translate(${R(cx)} ${R(cy)}) scale(${Math.round(z / Z * 10000) / 10000}) translate(-540 ${-CY})`;
    return g(A, trA) + `<clipPath id="${id}"><circle cx="${R(cx)}" cy="${R(cy)}" r="${R(rr)}"/></clipPath><g clip-path="url(#${id})">${BG((EP.trBg && EP.trBg[SA.key]) || K8.night)}${g(B, trB)}</g>`
  }
  if (kind === 'wave') {
    const e = EZ.io(k), cols = (EP.trCols && EP.trCols[SA.key]) || [K8.amber, K8.paper, K8.navy3];
    const yb = y => D_.wave(-200, 1280, y, 70, 1300, k * 5) + `L1280 3000L-200 3000Z`;
    const y0 = lerp(2300, -900, e), id = uid();
    let s = A + `<clipPath id="${id}"><path d="${yb(y0 + 520)}"/></clipPath><g clip-path="url(#${id})">${g(B, `translate(0 ${R((1 - e) * 160)})`)}</g>`;
    // слои поверх, B проявляется под последним
    s = A + F(yb(y0), cols[0]) + F(yb(y0 + 200), cols[1]) + F(yb(y0 + 360), cols[2]) + `<clipPath id="${id}b"><path d="${yb(y0 + 520)}"/></clipPath><g clip-path="url(#${id}b)">${g(B, `translate(0 ${R((1 - e) * 160)})`)}</g>`;
    return s
  }
  if (kind === 'pan' || kind === 'panL' || kind === 'panU' || kind === 'panD') {
    // сдвиг камеры по миру: A и B — соседние куски одной полосы, фон один (рисуется из B без сдвига)
    const e = EZ.io(k), d = kind === 'panL' ? [1, 0] : kind === 'panU' ? [0, -1] : kind === 'panD' ? [0, 1] : [-1, 0];
    return g(A, `translate(${R(d[0] * W * e)} ${R(d[1] * H * e)})`) + g(B, `translate(${R(-d[0] * W * (1 - e))} ${R(-d[1] * H * (1 - e))})`)
  }
  return _tr5v8(kind, k, A, B, SA, SB)
};
Object.assign(TRD, { dive: .9, wave: .95, pan: .7, panL: .7, panU: .75, panD: .75 });

// ======================= предметы (без обводок, без лиц) =======================
// СИГАРЕТА: центр (0,0), горизонтально; ember — тлеет
function cig8(t, o = {}) {
  const L0 = o.len || 760, h = o.h || 96, x0 = -L0 / 2, body = D_.rr(x0, -h / 2, L0, h, 10), fil = D_.rr(x0, -h / 2, L0 * .3, h, 10);
  let s = SH(body, { op: o.shOp ?? .5, c: o.shc }) + F(body, K8.paper) + F(fil, o.fc || K8.amber) + ht(fil, 'n', 'r', .35) + ht(D_.rr(x0 + L0 * .3, -h / 2, L0 * .7, h, 0), 'n', 'v', .18);
  s += Ln(`M${R(x0 + L0 * .3)} ${-h / 2}V${h / 2}`, 1, { c: K8.amber2, w: 3 }) + Ln(`M${R(x0 + L0 * .31 + 30)} ${-h / 2 + 14}H${R(x0 + L0 - 40)}`, 1, { c: '#fff', w: 4, op: .5 });
  const em = D_.rr(x0 + L0 - 40, -h / 2, 40, h, 10);
  s += F(em, K8.red) + F(D_.rr(x0 + L0 - 40, -h / 2, 14, h, 4), K8.amber) + ht(em, 'n', 'r', .5);
  if (o.ember !== false) for (let i = 0; i < 3; i++) { const p = (t * .55 + i / 3) % 1; s += F(D_.circ(x0 + L0 + 10 + p * 40, -10 - p * 120 + Math.sin(p * 9 + i) * 10, 5 * (1 - p)), K8.amber, { op: 1 - p }) }
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
const VAPE_P = (w = 200, h = 520) => D_.rr(-w / 2, -h / 2, w, h, w * .38);
// ОДНОРАЗКА: центр (0,0), вертикально. f — корпус, led — горит (0..1)
function vape8(t, o = {}) {
  const w = o.w || 200, h = o.h || 520, f = o.f || K8.navy3, body = VAPE_P(w, h);
  let s = (o.shadow !== false ? SH(body, { op: .5 }) : '') + F(body, f);
  s += F(D_.rr(-w / 2, -h / 2, w * .32, h, w * .38), '#fff', { op: .07 }) + ht(body, 'n', 'r', .35);
  s += F(D_.rr(-w * .22, -h / 2 - 64, w * .44, 80, 22), o.mc || K8.paper2) + F(D_.rr(-w * .22, -h / 2 - 64, w * .14, 80, 10), '#fff', { op: .35 });
  s += Ln(`M${R(-w * .16)} ${R(-h * .18)}V${R(h * .26)}`, 1, { c: K8.paper, w: 5, op: .55 }); // окошко с жидкостью
  const lv = o.liquid ?? .7; s += F(D_.rr(-w * .16 - 6, R(h * .26 - h * .44 * lv), 12, R(h * .44 * lv), 6), K8.amber);
  const led = o.led ?? 1, ly = h / 2 - 54;
  s += F(D_.circ(0, ly, 22), K8.night) + F(D_.circ(0, ly, 15), K8.amber, { op: .25 + .75 * led });
  if (o.label) s += tx(o.label, w * .12, 20, { f: 'M', w: 800, s: 26, c: K8.paper, ls: 4, tr: `rotate(-90 ${R(w * .12)} 20)`, op: .8 });
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ЗВЁЗДЫ ЕС: кольцо из 12, появляются по k (0..1)
function euRing8(x, y, r, k = 1, o = {}) {
  let s = Ln(D_.circ(0, 0, r), E(k, .0, .6), { c: K8.line, w: 3, op: .5 });
  for (let i = 0; i < 12; i++) { const q = clamp(k * 14 - i * .9); if (q <= 0) continue; const a = -PI / 2 + i * PI / 6; s += F(D_.star(Math.cos(a) * r, Math.sin(a) * r, 30 * EZ.back(q), 13 * EZ.back(q)), o.c || K8.amber) }
  return g(s, at(x, y, o.s || 1, o.rot || 0), o.op ?? 1)
}
// ЗАПРЕТ: красный круг с чертой рисуется по k
const ban8 = (x, y, r, k, o = {}) => g(Ln(D_.circ(0, 0, r), E(k, 0, .65), { c: K8.red, w: o.w || 16 }) + Ln(`M${R(-r * .7)} ${R(-r * .7)}L${R(r * .7)} ${R(r * .7)}`, E(clamp(k * 1.6 - .6), 0, 1), { c: K8.red, w: o.w || 16 }), at(x, y, o.s || 1, o.rot || 0), o.op ?? 1);
// РАСПЫЛИТЕЛЬ: бумажный силуэт, янтарная жидкость, туман по mist
function spray8(t, o = {}) {
  const b = 'M-80 -110H80V190C80 214 62 230 38 230H-38C-62 230 -80 214 -80 190Z';
  let s = SH(b) + F(b, K8.paper) + F('M-80 60H80V190C80 214 62 230 38 230H-38C-62 230 -80 214 -80 190Z', K8.amber) + ht(b, 'n', 'r', .35);
  s += F(D_.rr(-40, -160, 80, 56, 10), K8.navy3) + F('M-46 -228H38L58 -160H-56Z', K8.navy3) + F('M38 -222H118V-196H38Z', K8.navy3) + Ln('M-70 30H70', 1, { c: K8.navy, w: 3, op: .4 });
  if (o.mist) { const k = clamp(o.mist); for (let i = 0; i < 9; i++) { const a = (i - 4) * .09, d = 40 + k * (140 + i * 26); s += F(D_.circ(130 + Math.cos(a) * d, -210 + Math.sin(a) * d * 1.4, 7 - i * .4), K8.amber, { op: (1 - k) * .9 }) } }
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ТЛЯ: бумажный силуэт без лица; walk — ножки, puff — выдох (0..1)
function aphid8(t, o = {}) {
  const f = o.f || K8.paper, body = 'M-70 10C-74 -40 -36 -66 6 -64C52 -62 84 -30 80 12C76 52 40 66 0 64C-40 62 -66 46 -70 10Z';
  let s = '', st = o.walk ? Math.sin(t * 14) : 0;
  for (let i = 0; i < 3; i++) { const bx = -34 + i * 34, ph = (i % 2 ? 1 : -1) * st * 10; s += Ln(`M${bx} 40L${R(bx - 14 + ph)} 74L${R(bx - 24 + ph)} 82`, 1, { c: f, w: 6 }) }
  s += F(body, f) + F(D_.circ(96, -12, 30), f) + ht(body, 'n', 'v', .4);
  s += Ln('M108 -36C126 -84 150 -106 186 -112M98 -38C102 -90 112 -120 136 -144', 1, { c: f, w: 5 }) + Ln('M-56 -6C-20 6 30 6 64 -8', 1, { c: K8.navy, w: 3, op: .35 });
  s += F(D_.circ(-58, -42, 9), f) + F(D_.circ(-66, -18, 8), f); // трубочки-«сифункули»
  if (o.puff) { const k = clamp(o.puff); for (let i = 0; i < 3; i++) { const q = clamp(k * 1.6 - i * .25); if (q <= 0 || q >= 1) continue; s += Ln(D_.circ(150 + q * 120 + i * 14, -20 - q * 40 - i * 10, 10 + q * 26), 1, { c: f, w: 3, op: 1 - q }) } }
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ЛИСТ: основание (0,0), вверх. charge — янтарь поднимается от основания (0..1), veins — жилки рисуются
function leaf8(o = {}) {
  const len = o.len || 700, w = o.w || 260, d = leafPath(len, w), f = o.f || K8.navy3, f2 = o.f2 || K8.navy2;
  const half = `M0 0C${R(w * .95)} ${R(-len * .12)} ${R(w * .9)} ${R(-len * .7)} 0 ${-len}Z`;
  let s = (o.shadow ? SH(d, { op: .4 }) : '') + F(d, f) + F(half, f2);
  if (o.charge) { const id = uid(), y = lerp(40, -len - 20, clamp(o.charge)); s += `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${F(D_.rr(-w, y, w * 2, len + 60, 0), K8.amber, { op: .9 })}${F(D_.rr(-w, y, w * 2, 18, 0), K8.amber3, { op: .8 })}</g>` }
  if (o.dots !== false) s += ht(d, 'n', 'v', .4);
  let v = `M0 0L0 ${-len * .97}`;
  for (let i = 1; i <= 6; i++) { const u = i / 7.2, y = -len * u, l = w * .78 * Math.sin(Math.min(1, u * 1.15) * PI) + 20; v += `M0 ${R(y)}Q${R(l * .55)} ${R(y - 30)} ${R(l)} ${R(y - 90)}M0 ${R(y)}Q${R(-l * .55)} ${R(y - 30)} ${R(-l)} ${R(y - 90)}` }
  s += Ln(v, o.veins ?? 1, { c: o.vc || K8.paper, w: o.vw || 4, op: o.vo ?? .75 });
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// РАСТЕНИЕ ТАБАКА с корнями. charge — янтарь в листьях, roots — корни рисуются, flow — бегущие точки по стеблю (фаза)
const PLANT_L = [[.24, -62, 1.05], [.4, 58, 1], [.56, -58, .86], [.72, 56, .7], [.86, -50, .52]];
function plant8(t, o = {}) {
  const h = o.h || 1000, sw = o.sway ?? 1.5;
  let s = '';
  const R1 = 'M0 0C-20 70 -90 120 -150 210M0 0C10 90 0 170 20 290M0 0C30 60 100 110 170 190M-60 110C-110 130 -150 120 -200 140M80 100C120 140 120 190 150 240M10 170C-30 200 -40 250 -70 300';
  if (o.roots) s += Ln(R1, o.roots, { c: o.rc || K8.paper2, w: 5 });
  if (o.flow != null) {
    const RT = ['M-150 210C-90 120 -20 70 0 0', 'M20 290C0 170 10 90 0 0', 'M170 190C100 110 30 60 0 0'];
    for (let i = 0; i < 9; i++) { const p = (o.flow * (o.speed || 1) + i / 9) % 1, P0 = pts(RT[i % 3], 60)[Math.min(59, Math.floor(p * 59))]; s += F(D_.circ(P0[0], P0[1], 9 * Math.sin(p * PI) + 2), K8.amber) }
  }
  s += F(`M-14 0C-12 ${-h * .4} -8 ${-h * .8} -3 ${-h}H3C8 ${-h * .8} 12 ${-h * .4} 14 0Z`, K8.navy3);
  if (o.charge) s += F(`M-6 0C-5 ${-h * .4} -4 ${-h * .8 * clamp(o.charge * 1.4)} -2 ${-h * clamp(o.charge * 1.4)}H2C4 ${-h * .8 * clamp(o.charge * 1.4)} 5 ${-h * .4} 6 0Z`, K8.amber);
  PLANT_L.forEach(([u, a, sc], i) => { s += leaf8({ len: 520 * sc, w: 200 * sc, x: 0, y: -h * u, r: a + fl(t, sw, .25, i * .3), charge: o.charge ? clamp(o.charge * 1.5 - i * .12) : 0, veins: 1, vo: .6 }) });
  s += F(D_.circ(0, -h - 10, 24), K8.paper) + F(D_.circ(-30, -h + 14, 18), K8.paper2) + F(D_.circ(28, -h + 18, 16), K8.paper2);
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// почва в разрезе: полоса со слоями и полутоном (верх — y)
const soil8 = (y, o = {}) => F(D_.rr(-1600, y, 4300, 1700, 0), o.c || K8.navy) + ht(D_.rr(-1600, y, 4300, 900, 0), 'b', 'u', .6) + Ln(`M-1600 ${y}H2700`, 1, { c: K8.line, w: 4, op: .6 }) + Ln(`M-1600 ${y + 240}H2700`, 1, { c: K8.line, w: 2, op: .25, da: '4 18' });
// ЖУК: бумажный силуэт; nerve — янтарные «нервы» по телу (0..1), stiff — замер (ножки прямые), ghost — остался контур, flip — на спину
function beetle8(t, o = {}) {
  const st = o.stiff || 0, step = o.walk ? Math.sin(t * 15) : 0, f = o.f || K8.paper;
  const body = 'M-110 -6C-112 -92 -40 -126 30 -112C82 -100 104 -62 104 -10C104 22 70 36 0 36C-70 36 -108 26 -110 -6Z';
  let s = '';
  for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) {
    const bx = -56 + i * 52, ph = (i % 2 ? 1 : -1) * sd * step * (1 - st) * 18, k2 = st ? 0 : 1;
    s += Ln(`M${bx} 20L${R(bx + 10 + ph * .5)} ${R(52 - (1 - k2) * 6)}L${R(bx + (i - 1) * 36 + ph)} ${R(86 - st * 30)}`, 1, { c: o.ghost ? K8.paper : f, w: 7, op: sd < 0 ? .55 : 1 });
  }
  s += Ln(`M100 -40C140 -80 170 -96 ${R(214 + st * 10)} ${R(-104 + st * 30)}M96 -54C120 -110 140 -132 ${R(176 + st * 10)} ${R(-150 + st * 30)}`, 1, { c: o.ghost ? K8.paper : f, w: 5 });
  const gk = clamp(o.ghost || 0);
  s += F(body, f, { op: 1 - gk }) + F(D_.ell(102, -20, 34, 30), f, { op: 1 - gk });
  if (gk > 0) s += Ln(body, 1, { c: K8.paper, w: 4, op: gk }) + Ln(D_.ell(102, -20, 34, 30), 1, { c: K8.paper, w: 4, op: gk });
  s += ht(body, 'n', 'v', .4 * (1 - gk)) + Ln('M-6 -116C-10 -60 -6 -10 0 34', 1, { c: K8.navy, w: 4, op: .5 * (1 - gk) }) + Ln('M-90 -40C-50 -70 40 -76 90 -50', 1, { c: K8.navy, w: 3, op: .3 * (1 - gk) });
  if (o.nerve) {
    const NV = 'M110 -18C60 -24 30 -44 0 -60M0 -60C-30 -50 -60 -40 -90 -20M0 -60C10 -20 20 0 30 24M0 -60C-20 -20 -40 0 -60 22M30 24L40 60M-60 22L-70 60M-90 -20L-100 30';
    s += Ln(NV, clamp(o.nerve), { c: K8.amber, w: 5 });
    if (o.nerve >= 1 && o.zap) s += Ln(NV, 1, { c: K8.amber3, w: 9, op: .35 + .35 * Math.sin(t * 40) });
  }
  const fp = o.flip || 0;
  return g(s, `translate(${R(o.x || 0)} ${R(o.y || 0)}) rotate(${R((o.r || 0) + fp * 180)}) scale(${R((o.s || 1) * 1000) / 1000} ${R((o.s || 1) * (1 - 2 * fp) * 1000) / 1000})`, o.op ?? 1)
}
// ГОЛОВА в профиль (смотрит вправо): силуэт без лица, контровой свет по краю
const HEAD8 = 'M-130 200C-160 120 -176 40 -168 -60C-158 -180 -60 -250 50 -240C150 -230 204 -160 204 -60C204 -30 212 -6 236 34C244 48 232 60 216 62C214 86 218 104 206 116C214 128 210 146 196 150C198 176 186 196 156 200L110 204L110 300L-130 300Z';
function head8(o = {}) {
  let s = F(HEAD8, o.f || K8.navy3) + ht(HEAD8, 'n', 'l', .45) + Ln('M50 -240C150 -230 204 -160 204 -60C204 -30 212 -6 236 34C244 48 232 60 216 62C214 86 218 104 206 116C214 128 210 146 196 150C198 176 186 196 156 200', 1, { c: K8.paper, w: 4, op: .8 });
  if (o.inner) s += o.inner;
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ОБЛАКО-выдох: круги, бумага с полутоном снизу
const C8c = [[0, 0, 150], [150, 30, 120], [-150, 30, 120], [70, -80, 120], [-80, -70, 110], [260, 70, 80], [-260, 70, 80]];
function cloud8(x, y, s, o = {}) {
  const parts = C8c.map(([cx, cy, r]) => D_.circ(cx, cy, r)).concat([D_.rr(-300, 30, 600, 120, 60)]), id = uid();
  let q = parts.map(d => F(d, o.f || K8.paper)).join('');
  q += `<clipPath id="${id}">${parts.map(d => `<path d="${d}"/>`).join('')}</clipPath><g clip-path="url(#${id})">${F(D_.rr(-420, 70, 840, 200, 0), K8.paper2)}${F(D_.rr(-420, 120, 840, 200, 0), '#C9C1B3')}</g>`;
  return g(q + (o.inner || ''), at(x, y, s), o.op ?? 1)
}
// МАНГО: контур янтарём
const mango8 = (x, y, s = 1, o = {}) => { const d = 'M-10 -150C80 -160 150 -80 140 20C130 120 40 170 -40 150C-120 130 -150 40 -120 -40C-100 -100 -70 -140 -10 -150Z'; return g(F(d, K8.amber, { op: o.fillOp ?? 1 }) + F('M30 -140C90 -120 130 -70 136 0C110 -40 70 -90 30 -140Z', K8.amber3, { op: .6 }) + ht(d, 'n', 'x', .3) + F('M-10 -150C-20 -190 0 -210 30 -220C30 -190 20 -170 -10 -150Z', K8.navy3), at(x, y, s, o.r || 0), o.op ?? 1) };
// МОЗГ: силуэт + извилины (линии), рецепторы — янтарные «чашечки» по списку точек
const BR8 = 'M-150 30C-190 10 -190 -70 -140 -95C-140 -150 -70 -175 -30 -150C0 -185 80 -180 100 -140C150 -150 195 -95 175 -50C205 -10 180 60 130 60C110 95 50 100 20 80C-20 105 -90 100 -100 60C-130 70 -150 50 -150 30Z';
const BR8_IN = 'M-120 -40C-90 -60 -60 -30 -80 -5M-40 -120C-30 -90 -60 -70 -40 -40C-20 -15 10 -40 0 -70M40 -130C60 -100 30 -80 50 -50M100 -100C80 -70 120 -50 110 -20M-110 20C-70 30 -40 0 -10 25C20 50 60 20 80 40M130 -60C100 -40 140 0 120 20M-60 70C-50 50 -20 50 -10 70M60 -20C40 -10 30 10 50 20';
function brain8(t, o = {}) {
  let s = (o.shadow !== false ? SH(BR8, { op: .45, dx: 8, dy: 10 }) : '') + F(BR8, o.f || K8.navy3) + ht(BR8, 'n', 'v', .45) + Ln(BR8_IN, o.lines ?? 1, { c: K8.paper, w: 2.6, op: .75 }) + Ln(BR8, o.edge ?? 1, { c: K8.paper, w: 2.6, op: .9 });
  s += F('M10 80C14 110 20 130 34 150H6C0 130 -2 110 -4 84Z', o.f || K8.navy3);
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// РЕЦЕПТОР: чашечка (U), full — внутри молекула-точка
const rec8 = (x, y, s = 1, o = {}) => g(F(D_.rr(-15, -14, 11, 30, 5.5), o.c || K8.amber) + F(D_.rr(4, -14, 11, 30, 5.5), o.c || K8.amber) + F(D_.rr(-20, 12, 40, 6, 3), o.c || K8.amber, { op: .45 }) + (o.full ? F(D_.circ(0, -12, 6), K8.paper) : ''), at(x, y, s, o.r || 0), o.op ?? 1);
// КАРМАН ДЖИНСОВ: верх кармана y
function pocket8(y, o = {}) {
  const pk = `M220 ${y}C220 ${y + 400} 290 ${y + 540} 540 ${y + 620}C790 ${y + 540} 860 ${y + 400} 860 ${y}`;
  let s = F(D_.rr(-200, y - 500, 1480, 2400, 0), K8.navy2) + ht(D_.rr(-200, y - 500, 1480, 2400, 0), 'b', 'r', .6);
  s += F(pk + 'Z', K8.navy) + Ln(`M196 ${y - 24}H884`, 1, { c: K8.amber, w: 4, da: '16 12' }) + Ln(pk.replace('M220', 'M244').replace(/C220/, 'C244'), 1, { c: K8.amber, w: 4, da: '16 12', op: .9 });
  s += F(D_.circ(222, y + 6, 13), K8.paper2) + F(D_.circ(858, y + 6, 13), K8.paper2);
  return s
}
// ЧЕЛОВЕЧЕК-иконка (для толпы)
const man8 = (x, y, s, c, op = 1) => F(D_.circ(x, y - 30 * s, 17 * s) + `M${R(x - 30 * s)} ${R(y + 34 * s)}C${R(x - 30 * s)} ${R(y - 4 * s)} ${R(x - 16 * s)} ${R(y - 8 * s)} ${R(x)} ${R(y - 8 * s)}C${R(x + 16 * s)} ${R(y - 8 * s)} ${R(x + 30 * s)} ${R(y - 4 * s)} ${R(x + 30 * s)} ${R(y + 34 * s)}Z`, c, { op });
// БАНКА с табачной водой (1690): стекло линиями, жидкость янтарём, листья внутри
function jar8(t, o = {}) {
  const b = 'M-150 -170H150V180C150 220 120 250 80 250H-80C-120 250 -150 220 -150 180Z', lv = o.level ?? 1, wy = lerp(250, -110, lv);
  let s = SH(b, { op: .4, c: o.shc }) + F(b, o.bf || K8.navy2, { op: .6 });
  const id = uid();
  s += `<clipPath id="${id}"><path d="${b}"/></clipPath><g clip-path="url(#${id})">${F(D_.wave(-200, 200, wy, 8, 160, t * 3) + 'L200 400L-200 400Z', K8.amber, { op: .9 })}${ht(D_.rr(-160, wy, 320, 300, 0), 'n', 'v', .45)}`;
  for (let i = 0; i < 3; i++) s += leaf8({ len: 240, w: 90, x: -60 + i * 60, y: 230, r: -22 + i * 22 + fl(t, 3, .3, i), f: K8.navy3, f2: K8.navy2, vo: .4, vw: 3 });
  s += '</g>' + Ln(b, 1, { c: o.lc || K8.paper, w: 5 }) + F(D_.rr(-170, -200, 340, 44, 14), o.lid || K8.paper2) + Ln('M-110 -120V150', 1, { c: '#fff', w: 8, op: .3 });
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ЛЕЙКА (носик вправо): силуэт с бумажными линиями
function can8(o = {}) {
  const c1 = o.f2 || K8.paper2, c0 = o.f || K8.paper;
  let s = Ln('M-110 -110C-120 -220 60 -230 70 -110', 1, { c: c1, w: 12 }) + F('M70 -30L250 -150L264 -132L96 10Z', c1) + F(D_.rr(236, -176, 70, 56, 14), c1, { tr: 'rotate(-30 270 -148)' });
  const b = 'M-130 -110H100L110 120H-140Z';
  s = SH(b, { c: o.shc, op: o.shOp }) + s + F(b, c0) + ht(b, 'n', 'r', .4) + Ln('M-136 -40H104M-138 50H108', 1, { c: o.lc || K8.navy, w: 3, op: .35 });
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// КОЧАН: розетка бумажными линиями на тёмном
const cab8 = (x, y, s = 1, o = {}) => g(F(D_.ell(0, 0, 120, 84), o.f || K8.navy3) + ht(D_.ell(0, 0, 120, 84), 'n', 'v', .45) + Ln('M-90 10C-60 -60 60 -60 90 10M-60 20C-40 -30 40 -30 60 20M-110 30C-100 70 100 70 110 30', 1, { c: K8.paper, w: 3.5, op: .7 }), at(x, y, s));
// таймер-кольцо: k — заполнение, val — число
const ring8 = (x, y, r, k, o = {}) => g(Ln(D_.circ(0, 0, r), 1, { c: K8.line, w: 6, op: .3 }) + (k > 0 ? Ln(D_.arc(0, 0, r, -90, -90 + 359.9 * clamp(k)), 1, { c: o.c || K8.amber, w: 10 }) : '') + (o.val != null ? tx(o.val, 0, 26, { f: 'M', w: 800, s: o.vs || 84, c: K8.paper }) : ''), at(x, y, o.s || 1), o.op ?? 1);
// метка на карте
const pin8 = (x, y, s = 1, o = {}) => g(F('M0 0C-14 -30 -46 -50 -46 -84A46 46 0 1 1 46 -84C46 -50 14 -30 0 0Z', o.c || K8.red) + F(D_.circ(0, -86, 18), K8.paper), at(x, y, s), o.op ?? 1);
// подпись-улика: разреженные заглавные
const cap8 = (s, x, y, o = {}) => tx(s.toUpperCase(), x, y, { f: 'M', w: 800, s: o.s || 34, c: o.c || K8.paper, ls: o.ls ?? 10, op: o.op, a: o.a });
// год/число крупно, цифры выезжают снизу по очереди
function num8(str, x, y, t, t0, o = {}) {
  const s0 = o.s || 220, ch = String(str).split(''), wch = ch.map(c => tw(c, { f: 'M', w: 800, s: s0 }) * .96);
  const tot = wch.reduce((a, b) => a + b, 0); let cx = x - tot / 2, s = '';
  const id = uid(); s += `<clipPath id="${id}"><rect x="${R(cx - 40)}" y="${R(y - s0 * .9)}" width="${R(tot + 80)}" height="${R(s0 * 1.1)}"/></clipPath><g clip-path="url(#${id})">`;
  ch.forEach((c, i) => { const k = E(t, t0 + i * .06, .5, 'o5'); s += tx(c, cx + wch[i] / 2, y + (1 - k) * s0, { f: 'M', w: 800, s: s0, c: o.c || K8.paper }); cx += wch[i] });
  return s + '</g>'
}
// год-счётчик: значение плавно от a к b (цифры прокручиваются)
function yearRoll(v, x, y, o = {}) {
  const s0 = o.s || 200, str = String(Math.floor(v)).padStart(4, '0'), fr = v - Math.floor(v), id = uid();
  const wch = tw('0', { f: 'M', w: 800, s: s0 }) * 1.02, x0 = x - wch * 2;
  let s = `<clipPath id="${id}"><rect x="${R(x0 - 20)}" y="${R(y - s0 * .82)}" width="${R(wch * 4 + 40)}" height="${R(s0 * .98)}"/></clipPath><g clip-path="url(#${id})">`;
  for (let i = 0; i < 4; i++) {
    const d = +str[i], last = i === 3, roll = last ? fr : (str.slice(i + 1).split('').every(c => c === '9') ? fr : 0);
    s += tx(String(d), x0 + wch * (i + .5), y - roll * s0, { f: 'M', w: 800, s: s0, c: o.c || K8.paper }) + tx(String((d + 1) % 10), x0 + wch * (i + .5), y + (1 - roll) * s0, { f: 'M', w: 800, s: s0, c: o.c || K8.paper });
  }
  return s + '</g>'
}
