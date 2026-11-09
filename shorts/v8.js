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
const ring8 = (x, y, r, k, o = {}) => g(Ln(D_.circ(0, 0, r), 1, { c: K8.line, w: 6, op: .3 }) + (k > 0 ? Ln(D_.arc(0, 0, r, -90, -90 + 359.9 * clamp(k)), 1, { c: o.c || K8.amber, w: 10 }) : '') + (o.val != null ? tx(o.val, 0, R((o.vs || 84) * .36), { f: 'M', w: 800, s: o.vs || 84, c: o.tc || K8.paper }) : ''), at(x, y, o.s || 1), o.op ?? 1);
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

// ======================= v8.1 (09.11, «три рисовки»): палитра на ролик, новые предметы, концовка с соседними роликами =======================
// своя палитра у каждого ролика (как у оригиналов: Coca-Cola — синий/коралл, Google — сталь/красный, WoT — лаванда/оранжевый)
const pal8 = p => Object.assign(K8, p);
const PAL8 = {
  navy: { night: '#0B1028', navy: '#16214B', navy2: '#22316A', navy3: '#32478B', line: '#8DA1D6', paper: '#F4EFE6', paper2: '#D9D2C6', amber: '#F4A63C', amber2: '#C97B22', amber3: '#FFD08A', red: '#E9474F' },
  wine: { night: '#170A11', navy: '#2C111C', navy2: '#401A29', navy3: '#5C283C', line: '#C9A27F', paper: '#F2E6CF', paper2: '#D9C6A4', amber: '#E3B04B', amber2: '#B0812A', amber3: '#F6D68E', red: '#E43B3B' },
  leaf: { night: '#173327', navy: '#24503B', navy2: '#2F6649', navy3: '#43855E', line: '#93B79C', paper: '#FFFDF4', paper2: '#E4E0CF', amber: '#9A6ADE', amber2: '#7247B6', amber3: '#CBB0F6', red: '#E5534B' },
};
// светлый фон (история / день): бумага и косая полоса чуть темнее
const bgPaper = (c0, c1, dc = 'l', a = .35) => { const band = D_.poly([[620, -400], [1380, -400], [-120, 2400], [-880, 2400]]); return BG(c0) + F(band, c1) + ht(band, dc, 'r', a) };
// подпись мелко (капс, разрядка) — цвет и размер
const lab8 = (s, x, y, o = {}) => cap8(s, x, y, { s: o.s || 30, c: o.c || K8.line, ls: o.ls ?? 8, op: o.op, a: o.a });

// КОРОНА
const crown8 = (x, y, s = 1, o = {}) => { const d = 'M-110 40L-130 -60L-60 0L0 -90L60 0L130 -60L110 40Z'; return g(SH(d, { op: .4 }) + F(d, o.c || K8.amber) + F(D_.rr(-118, 34, 236, 34, 8), o.c2 || K8.amber2) + F(D_.circ(0, -96, 14), o.c2 || K8.amber2) + F(D_.circ(-134, -66, 11), o.c2 || K8.amber2) + F(D_.circ(134, -66, 11), o.c2 || K8.amber2) + F(D_.circ(0, 52, 9), K8.red) + F(D_.circ(-60, 52, 7), K8.paper) + F(D_.circ(60, 52, 7), K8.paper), at(x, y, s, o.r || 0), o.op ?? 1) };
// МЕХА с трубкой: pump 0..1 — сжаты; tube — длина трубки вправо
function bellows8(t, o = {}) {
  const p = o.pump || 0, a = lerp(18, 4, p), L0 = o.tube ?? 360;
  let s = Ln(`M150 0C${150 + L0 * .4} 0 ${150 + L0 * .5} ${o.tdy ?? 60} ${150 + L0} ${o.tdy ?? 60}`, 1, { c: K8.paper2, w: 14 }) + F(D_.rr(150 + L0 - 6, (o.tdy ?? 60) - 12, 50, 24, 8), K8.amber2);
  s += g(F('M-150 -14L120 -8L120 8L-150 14Z', K8.amber2) + F(`M-150 -14L120 -8L-150 ${R(-14 - a * 5)}Z`, K8.navy3) + F(`M-150 14L120 8L-150 ${R(14 + a * 5)}Z`, K8.navy3), '');
  s += F(D_.rr(-230, -24, 90, 48, 20), K8.amber2) + F(`M-150 ${R(-20 - a * 5)}L120 -10L118 -16L-150 ${R(-28 - a * 5)}Z`, K8.amber) + F(`M-150 ${R(20 + a * 5)}L120 10L118 16L-150 ${R(28 + a * 5)}Z`, K8.amber);
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ЛЕЖАЩИЙ ЧЕЛОВЕК (силуэт без лица): ноги вправо
const lying8 = (x, y, s = 1, o = {}) => { const d = 'M-260 -30C-260 -70 -200 -80 -180 -50L160 -44C220 -44 260 -30 260 -10C260 10 220 22 160 22L-180 30C-200 60 -260 50 -260 10Z'; return g(SH(d, { op: .4 }) + F(d, o.f || K8.navy3) + F(D_.circ(-300, -6, 46), o.f || K8.navy3) + ht(d, 'n', 'v', .4), at(x, y, s, o.r || 0), o.op ?? 1) };
// ГОРОД XVIII века (силуэт: купол собора Святого Павла, шпили, дома) на линии y
function london8(y, o = {}) {
  const c = o.c || K8.navy2;
  let d = `M-200 ${y}V${y - 120}H40V${y - 180}H120V${y - 140}H200V${y - 230}H230L245 ${y - 330}L260 ${y - 230}H300V${y - 150}H380V${y - 170}`;
  d += `C400 ${y - 330} 560 ${y - 330} 580 ${y - 170}`; // купол
  d += `V${y - 150}H660V${y - 260}H680L692 ${y - 380}L704 ${y - 260}H730V${y - 130}H860V${y - 200}H940V${y - 120}H1280V${y}Z`;
  return F(d, c) + F(D_.rr(474, y - 372, 12, 44, 4), c) + F(D_.circ(480, y - 378, 10), c) + (o.win ? [[60, y - 100], [150, y - 110], [420, y - 120], [520, y - 110], [780, y - 90], [900, y - 80]].map(([wx, wy], i) => F(D_.rr(wx, wy, 18, 26, 3), K8.amber, { op: .6 + .4 * Math.sin(i * 7 + (o.t || 0)) })).join('') : '')
}
// ПРОФИЛЬ (бюст, смотрит вправо): кто — 'nicot' (шляпа, воротник-жабо), 'james' (корона), 'peter' (усы, мундир), 'lord' (парик), 'plain'
function bust8(o = {}) {
  const f = o.f || K8.navy3, k = o.who || 'plain';
  let s = F(HEAD8, f) + ht(HEAD8, 'n', 'l', .4);
  if (k === 'nicot') s += F('M-190 -170C-150 -300 150 -310 230 -190L250 -150H-200Z', K8.night) + F('M-120 250C-60 200 80 200 140 250C150 300 -130 300 -120 250Z', K8.paper) + Ln('M-110 262C-60 236 80 236 130 262', 1, { c: K8.paper2, w: 4 });
  if (k === 'james') s += g(crown8(0, 0, .7), at(40, -280));
  if (k === 'peter') s += Ln('M170 92C190 84 214 88 226 98', 1, { c: K8.night, w: 9 }) + F('M-150 -60C-160 -200 -40 -260 60 -250C140 -244 190 -200 200 -150C120 -190 0 -200 -100 -120Z', K8.night) + F('M-130 230H140L160 300H-150Z', K8.amber2);
  if (k === 'lord') { let q = ''; for (let i = 0; i < 7; i++) q += D_.circ(-160 + i * 18, -180 + i * 70, 56); s += F(q, K8.paper2) + F('M-170 -170C-120 -280 120 -300 200 -190C120 -230 0 -230 -120 -160Z', K8.paper2) }
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// КНИГА (обложка): title — строки на обложке
function book8(o = {}) {
  const w = o.w || 360, h = o.h || 480, d = D_.rr(-w / 2, -h / 2, w, h, 14);
  let s = SH(d, { op: .45 }) + F(D_.rr(-w / 2 + 14, -h / 2 + 14, w, h, 14), K8.paper2) + F(d, o.f || K8.navy3) + ht(d, 'n', 'r', .35) + F(D_.rr(-w / 2, -h / 2, 26, h, 8), K8.night, { op: .35 });
  s += Ln(D_.rr(-w / 2 + 40, -h / 2 + 30, w - 70, h - 60, 8), 1, { c: K8.amber, w: 3, op: .7 });
  (o.title || []).forEach((ln, i) => s += tx(ln, 14, -h / 2 + 110 + i * 46, { f: 'M', w: 800, s: o.ts || 30, c: K8.amber, ls: 2 }));
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// МОНЕТА (сбоку — эллипс) / столбик монет n
const coins8 = (x, y, n, o = {}) => { let s = ''; for (let i = 0; i < n; i++) { const yy = y - i * 16; s += F(D_.ell(x, yy + 8, 70, 22), K8.amber2) + F(D_.ell(x, yy, 70, 22), K8.amber) + Ln(D_.ell(x, yy, 50, 14), 1, { c: K8.amber2, w: 3, op: .6 }) } return s };
// КОЛБА: liquid — цвет жидкости
function flask8(o = {}) {
  const d = 'M-40 -260H40V-90C140 -50 180 30 160 110C140 200 60 240 0 240C-60 240 -140 200 -160 110C-180 30 -140 -50 -40 -90Z';
  let s = SH(d, { op: .35 }) + F(d, K8.navy2, { op: .7 });
  const id = uid(); s += `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${F(D_.wave(-200, 200, o.ly ?? 40, 10, 180, (o.t || 0) * 3) + 'L200 400L-200 400Z', o.liquid || K8.amber)}${ht(D_.rr(-200, 40, 400, 220, 0), 'n', 'v', .4)}</g>`;
  s += Ln(d, 1, { c: K8.paper, w: 5 }) + Ln('M-90 -40C-120 0 -130 60 -110 120', 1, { c: '#fff', w: 8, op: .3 });
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ЧЕРЕП-значок (символ «яд»)
const skull8 = (x, y, s = 1, o = {}) => g(F('M0 -70C60 -70 90 -30 86 14C84 40 70 52 56 58V84H-56V58C-70 52 -84 40 -86 14C-90 -30 -60 -70 0 -70Z', o.c || K8.paper) + F(D_.circ(-32, 6, 18), o.bg || K8.night) + F(D_.circ(32, 6, 18), o.bg || K8.night) + F('M0 30L10 50H-10Z', o.bg || K8.night) + Ln('M-30 84V64M0 84V64M30 84V64', 1, { c: o.bg || K8.night, w: 5 }), at(x, y, s), o.op ?? 1);
// МАСКА ЧУМНОГО ДОКТОРА (клюв)
const plague8 = (x, y, s = 1, o = {}) => { const d = 'M-120 -60C-120 -150 40 -170 80 -90C150 -60 260 -10 300 40C220 40 120 40 60 60C10 110 -120 90 -120 -60Z'; return g(SH(d, { op: .4 }) + F(d, o.f || K8.navy3) + ht(d, 'n', 'v', .4) + F(D_.circ(-20, -60, 34), K8.paper2) + F(D_.circ(-20, -60, 18), K8.night) + F('M-140 -110C-80 -230 120 -220 160 -110H-160Z', K8.night) + F(D_.rr(-200, -126, 380, 24, 10), K8.night), at(x, y, s, o.r || 0), o.op ?? 1) };
// АПТЕЧНАЯ БАНКА с надписью
const apo8 = (x, y, label, o = {}) => { const d = 'M-70 -110H70V100C70 120 56 130 40 130H-40C-56 130 -70 120 -70 100Z'; return g(SH(d, { op: .35 }) + F(d, o.f || K8.navy3) + F(D_.rr(-84, -140, 168, 40, 10), K8.night) + F(D_.rr(-58, -40, 116, 70, 6), K8.paper) + tx(label, 0, 6, { f: 'M', w: 800, s: 20, c: K8.night, ls: 2 }) + leaf8({ len: 70, w: 30, x: 0, y: 80, r: 0, f: K8.amber, f2: K8.amber2, vo: .5, vw: 2, dots: false }), at(x, y, o.s || 1, o.r || 0), o.op ?? 1) };
// ШАПКА МОНОМАХА (значок)
const monomakh8 = (x, y, s = 1, o = {}) => g(F('M-110 20C-110 -90 110 -90 110 20Z', K8.amber) + ht('M-110 20C-110 -90 110 -90 110 20Z', 'n', 'r', .35) + F(D_.rr(-124, 10, 248, 54, 26), K8.paper2) + ht(D_.rr(-124, 10, 248, 54, 26), 'n', 'v', .35) + F(D_.rr(-6, -150, 12, 70, 4), K8.amber) + F(D_.rr(-26, -130, 52, 12, 4), K8.amber) + F(D_.circ(0, -40, 14), K8.red) + F(D_.circ(-56, -20, 9), K8.paper) + F(D_.circ(56, -20, 9), K8.paper), at(x, y, s), o.op ?? 1);
// СВИТОК с печатью
const scroll8 = (x, y, s = 1, o = {}) => g(SH(D_.rr(-170, -110, 340, 220, 10), { op: .35 }) + F(D_.rr(-170, -110, 340, 220, 10), K8.paper) + F(D_.rr(-186, -124, 32, 248, 14), K8.paper2) + F(D_.rr(154, -124, 32, 248, 14), K8.paper2) + Ln('M-120 -60H120M-120 -20H120M-120 20H60', 1, { c: K8.navy3, w: 6, op: .5 }) + F(D_.circ(90, 70, 34), K8.red) + Ln(D_.circ(90, 70, 22), 1, { c: '#fff', w: 3, op: .4 }), at(x, y, s, o.r || 0), o.op ?? 1);
// КОРАБЛЬ (силуэт)
const ship8 = (x, y, s = 1, o = {}) => g(F('M-200 0H200L160 60H-160Z', o.c || K8.navy2) + F('M-6 -260H6V0H-6Z', o.c || K8.navy2) + F('M10 -240C90 -200 110 -100 100 -20H10Z', o.s1 || K8.paper2) + F('M-10 -220C-80 -180 -100 -100 -96 -30H-10Z', o.s1 || K8.paper2) + F('M8 -262L60 -248L8 -236Z', K8.red), at(x, y, s), o.op ?? 1);
// КРАСНЫЕ ГЛАЗА в темноте (как у оригиналов): open 0..1, sq — прищур 0..1
function eyes8(x, y, s, open, sq = 0) {
  const h = 40 * open * (1 - sq * .65); if (h < 1) return '';
  const e = cx => `M${cx - 90} 0C${cx - 40} ${-h} ${cx + 40} ${-h} ${cx + 90} 0C${cx + 40} ${h} ${cx - 40} ${h} ${cx - 90} 0Z`;
  return g(F(e(-150), K8.red) + F(e(150), K8.red) + F(D_.circ(-150, 0, Math.min(h * .7, 22)), K8.night) + F(D_.circ(150, 0, Math.min(h * .7, 22)), K8.night) + F(D_.circ(-140, -8, 6), '#fff', { op: .8 }) + F(D_.circ(160, -8, 6), '#fff', { op: .8 }), at(x, y, s))
}
// НИТКА заговора: от (x0,y0) к (x1,y1), провисает, рисуется по k
const thread8 = (x0, y0, x1, y1, k = 1, o = {}) => Ln(`M${x0} ${y0}Q${(x0 + x1) / 2} ${Math.max(y0, y1) + 90} ${x1} ${y1}`, k, { c: o.c || K8.red, w: o.w || 5 }) + (k >= 1 ? F(D_.circ(x0, y0, 10), K8.red) + F(D_.circ(x1, y1, 10), K8.red) : '');
// РУКА с вытянутым пальцем (палец вправо, запястье — (0,0))
const finger8 = (x, y, s = 1, o = {}) => g(F(D_.rr(-260, -46, 200, 92, 30), o.sl || K8.navy2) + F(D_.rr(-80, -44, 130, 88, 36), o.f || K8.paper2) + F(D_.rr(20, -40, 150, 34, 17), o.f || K8.paper2) + F('M-10 0C10 30 50 44 70 30L60 10Z', o.f || K8.paper2) + ht(D_.rr(-80, -44, 250, 88, 36), 'n', 'v', .3), at(x, y, s, o.r || 0), o.op ?? 1);
// ГАЛОЧКА
const check8 = (x, y, s, k, c) => g(Ln('M-60 0L-15 45L70 -50', E(k, 0, 1), { c: c || K8.amber, w: 18 }), at(x, y, s));

// ---- природа (nicg) ----
// ГУСЕНИЦА ТАБАЧНОГО БРАЖНИКА (бок, голова вправо): зелёная, белые косые полоски, чёрные дыхальца, красный рог на хвосте.
//   crawl — фаза ползания, chew — жуёт (0..1), puff — облачка никотина из дыхалец (фаза или null), xray — тело полупрозрачное, kD — точки никотина
const CAT_C = { body: '#A6D64B', body2: '#7DB035', head: '#6E9E2F', stripe: '#F7F8EE', spir: '#16251B', horn: '#E5534B' };
function caterpillar8(t, o = {}) {
  const n = 10, cr = o.crawl ?? 0, xr = o.xray || 0, segs = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1), r = i === n - 1 ? 40 : lerp(30, 50, Math.sin(Math.min(1, u * 1.25) * PI * .5)) * (i > n - 3 ? .92 : 1);
    const hump = Math.max(0, Math.sin((cr * 2 * PI) - i * .7)) * 22;
    segs.push([-320 + i * 66 + (o.stretch || 0) * i, -hump, r]);
  }
  let s = '';
  // ножки
  segs.forEach(([x, y, r], i) => { if (i > 1 && i < n - 1) s += F(D_.rr(x - 12, y + r - 14, 24, 26, 10), i > n - 4 ? CAT_C.spir : CAT_C.body2, { op: 1 - xr * .5 }) });
  // рог на хвосте
  const [hx, hy, hr] = segs[0]; s += F(`M${hx - 6} ${hy - hr + 6}C${hx - 20} ${hy - hr - 40} ${hx - 50} ${hy - hr - 60} ${hx - 70} ${hy - hr - 64}C${hx - 40} ${hy - hr - 40} ${hx - 12} ${hy - hr - 20} ${hx + 10} ${hy - hr + 4}Z`, CAT_C.horn, { op: 1 - xr * .4 });
  // тело
  segs.forEach(([x, y, r], i) => { const c = i === n - 1 ? CAT_C.head : CAT_C.body; s += F(D_.circ(x, y, r), c, { op: 1 - xr * .62 }) + F(`M${x - r} ${y}A${r} ${r} 0 0 0 ${x + r} ${y}Z`, CAT_C.body2, { op: (1 - xr * .62) * .55 }) });
  if (xr > 0) s += Ln(segs.map(([x, y], i) => (i ? 'L' : 'M') + R(x) + ' ' + R(y + 4)).join(''), 1, { c: K8.night, w: 22, op: .18 * xr }) + segs.map(([x, y, r]) => Ln(D_.circ(x, y, r), 1, { c: K8.night, w: 3, op: .35 * xr })).join('');
  // полоски и дыхальца
  segs.forEach(([x, y, r], i) => {
    if (i > 0 && i < n - 2) s += Ln(`M${R(x - r * .55)} ${R(y + r * .45)}L${R(x + r * .45)} ${R(y - r * .6)}`, 1, { c: CAT_C.stripe, w: 7, op: 1 - xr * .5 });
    if (i > 0 && i < n - 1) s += F(D_.ell(x - r * .1, y + r * .05, 6, 9), CAT_C.spir, { op: 1 - xr * .3 });
  });
  // голова: жвалы
  const [qx, qy, qr] = segs[n - 1], ch = (o.chew || 0) * Math.max(0, Math.sin(t * 14));
  s += F(D_.circ(qx + qr * .7, qy + qr * .4 + ch * 6, 11), CAT_C.spir);
  // никотин внутри (рентген): точки по кишке; kD 0..1 — сколько прошло
  if (o.dots) s += o.dots(segs);
  if (o.puff != null) segs.forEach(([x, y, r], i) => { if (i < 1 || i > n - 2) return; for (let j = 0; j < 2; j++) { const p = (o.puff * .8 + i * .13 + j * .5) % 1; s += F(D_.circ(x - r * .1 + p * 30, y - p * 150 - r * .2, 6 + p * 22), K8.amber, { op: (1 - p) * .55 * (o.puffOp ?? 1) }) } });
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ПАУК-ВОЛК (сверху/сбоку): walk — фаза, legsUp — испуг (лапы вверх)
function spider8(t, o = {}) {
  const f = o.f || K8.night, w = o.walk ?? 0, up = o.up || 0;
  let s = '';
  for (const sd of [-1, 1]) for (let i = 0; i < 4; i++) {
    const a = (-60 + i * 40) * PI / 180, ph = Math.sin(w * 2 * PI + i * 1.6 + (sd > 0 ? PI : 0)) * 14;
    const kx = Math.cos(a) * 120 + ph, ky = sd * (60 + i * 6) - up * 50 * sd * 0, fx = Math.cos(a) * 220 + ph * 1.4, fy = sd * (120 - up * 70);
    s += Ln(`M${R(Math.cos(a) * 30)} ${sd * 10}L${R(kx)} ${R(sd * (ky * .6) - 40 - up * 40)}L${R(fx)} ${R(fy)}`, 1, { c: f, w: 9, op: sd < 0 ? .7 : 1 });
  }
  s += F(D_.ell(-90, 0, 100, 70), f) + F(D_.ell(50, -6, 70, 56), f) + ht(D_.ell(-90, 0, 100, 70), 'l', 'u', .35);
  [[100, -24, 9], [100, 8, 9], [88, -40, 5], [88, 24, 5], [110, -8, 5], [80, -8, 4]].forEach(([x, y, r]) => s += F(D_.circ(x, y, r), K8.paper, { op: .9 }));
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ХИЩНЫЙ КЛОП (большеглазка): wing — летит
function bug8(t, o = {}) {
  const f = o.f || K8.night;
  let s = '';
  if (o.wing) { const k = Math.abs(Math.sin(t * 40)); s += F(D_.ell(-10, -40 - k * 10, 60, 20 + k * 10), K8.paper, { op: .45 }) }
  for (let i = 0; i < 3; i++) s += Ln(`M${-30 + i * 30} 10L${-44 + i * 30} 46`, 1, { c: f, w: 6 });
  s += F(D_.ell(-10, 0, 70, 34), f) + F(D_.ell(56, -4, 26, 24), f) + F(D_.circ(66, -22, 14), K8.paper) + F(D_.circ(66, 14, 14), K8.paper) + F(D_.circ(70, -22, 6), f) + F(D_.circ(70, 14, 6), f) + Ln('M76 -20C100 -50 120 -60 140 -64M76 12C100 40 120 50 140 54', 1, { c: f, w: 4 });
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ЦВЕТОК ТАБАКА: длинная трубка и звёздочка из 5 лепестков; open 0..1
function flower8(o = {}) {
  const op = clamp(o.open ?? 1), c = o.c || K8.paper;
  let s = F('M-10 0C-8 -120 -14 -200 -20 -260H20C14 -200 8 -120 10 0Z', c) + ht('M-10 0C-8 -120 -14 -200 -20 -260H20C14 -200 8 -120 10 0Z', 'n', 'r', .25);
  for (let i = 0; i < 5; i++) { const a = -90 + (i - 2) * lerp(8, 40, op); s += F(leafPath(lerp(40, 90, op), lerp(14, 46, op)), c, { tr: `translate(0 -258) rotate(${R(a + 90)})` }) }
  s += F(D_.circ(0, -262, lerp(8, 14, op)), K8.paper2);
  return g(F('M-6 40C-4 20 -4 10 -8 0H8C4 10 4 20 6 40Z', K8.navy3) + s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.o ?? 1)
}
// БРАЖНИК (бабочка, висит в воздухе): крылья размыты дугами
function moth8(t, o = {}) {
  const f = o.f || '#7A6B5A', k = Math.sin(t * 50);
  let s = '';
  for (const a of [-1, 1]) s += F(`M0 0L${R(-150)} ${R(a * (60 + k * 30))}L${R(-60)} ${R(a * 10)}Z`, f, { op: .35 }) + F(`M0 0L${R(-140)} ${R(a * (40 - k * 30))}L${R(-50)} ${R(a * 8)}Z`, f, { op: .6 });
  s += F('M-120 0C-100 -26 40 -30 80 -10C96 0 96 10 80 16C40 30 -100 26 -120 0Z', f) + Ln('M-90 -12V12M-60 -16V16M-30 -18V18', 1, { c: K8.paper, w: 4, op: .5 }) + F(D_.circ(90, 2, 18), f);
  if (o.tongue) s += Ln(`M104 8C140 ${R(30 + k * 2)} 180 40 ${R(200 + o.tongue * 40)} 60`, 1, { c: f, w: 3 });
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// КОЛИБРИ (сбоку, клюв вправо)
function bird8(t, o = {}) {
  const f = o.f || '#2E9E7A', k = Math.sin(t * 60);
  let s = F(`M-20 -20L${R(-120)} ${R(-120 - k * 40)}L${R(-40)} -10Z`, f, { op: .3 }) + F(`M-20 -20L${R(-100)} ${R(-80 + k * 50)}L${R(-30)} -6Z`, f, { op: .55 });
  s += F('M-110 30L-160 70L-150 20Z', f) + F('M-110 20C-100 -30 10 -40 50 -20C70 -10 70 20 40 30C0 50 -90 50 -110 20Z', f) + F(D_.circ(50, -26, 26), f) + F('M70 -30L190 -20L70 -18Z', K8.night) + F('M30 -6C40 10 56 14 64 6C60 20 40 26 30 20Z', o.throat || K8.red) + F(D_.circ(58, -32, 5), K8.night);
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// МОЛЕКУЛА НИКОТИНА (скелетная формула): шестиугольник пиридина + пятиугольник пирролидина, N-метил
function nicMol8(x, y, s = 1, o = {}) {
  const c = o.c || K8.amber, hx = (cx, cy, r, n, rot) => [...Array(n)].map((_, i) => { const a = (rot + i * 360 / n) * PI / 180; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] });
  const A = hx(-80, 0, 80, 6, 30), B = hx(98, -12, 66, 5, 198);
  let d = 'M' + A.map(p => R(p[0]) + ' ' + R(p[1])).join('L') + 'Z' + 'M' + B.map(p => R(p[0]) + ' ' + R(p[1])).join('L') + 'Z' + `M${R(A[0][0])} ${R(A[0][1])}L${R(B[3][0])} ${R(B[3][1])}`;
  d += `M${R(B[1][0])} ${R(B[1][1])}L${R(B[1][0] + 40)} ${R(B[1][1] + 60)}`;
  let q = Ln(d, o.k ?? 1, { c, w: o.w || 9 }) + Ln(`M${R(lerp(A[1][0], A[2][0], .2))} ${R(lerp(A[1][1], A[2][1], .2) - 14)}L${R(lerp(A[1][0], A[2][0], .8))} ${R(lerp(A[1][1], A[2][1], .8) - 14)}`, o.k ?? 1, { c, w: 6 });
  if ((o.k ?? 1) >= 1) q += tx('N', A[4][0], A[4][1] + 14, { f: 'M', w: 800, s: 40, c: o.nc || K8.paper, st: o.bg || K8.night, sw: 14 }) + tx('N', B[1][0], B[1][1] + 14, { f: 'M', w: 800, s: 40, c: o.nc || K8.paper, st: o.bg || K8.night, sw: 14 });
  return g(q, at(x, y, s, o.r || 0), o.op ?? 1)
}

// ---- концовка: «В профиле — …» две карточки соседних роликов (формула оригиналов: в конце — два ролика) ----
function card8(x, y, w, h, inner, title, o = {}) {
  const d = D_.rr(-w / 2, -h / 2, w, h, 28), id = uid();
  let s = SH(d, { op: .5, dx: 14, dy: 18 }) + F(d, o.bg || K8.navy2) + `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})"><g transform="translate(${-w / 2} ${-h / 2})">${inner}</g></g>` + Ln(d, 1, { c: o.edge || K8.paper, w: 4, op: .5 });
  s += F(D_.rr(-w / 2, h / 2 - 110, w, 110, 0), K8.night, { op: .78, tr: '' }).replace('<path', `<path clip-path="url(#${id})"`) + tx(title[0], 0, h / 2 - 64, { f: 'M', w: 800, s: 34, c: K8.paper }) + (title[1] ? tx(title[1], 0, h / 2 - 24, { f: 'M', w: 800, s: 34, c: K8.paper }) : '');
  return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
}
// мини-сцены для карточек (рисуются в палитре текущего ролика)
const CARD8 = {
  bugs: t => BG(K8.navy) + leaf8({ len: 420, w: 160, x: 170, y: 420, r: 70, veins: 1, vo: .5 }) + beetle8(t, { x: 190, y: 190, s: .7, walk: true }),
  thames: t => BG(K8.night) + F(D_.circ(300, 90, 46), K8.paper, { op: .9 }) + london8(250, { c: K8.navy2 }) + F(D_.rr(-20, 250, 440, 300, 0), K8.navy) + bellows8(t, { x: 150, y: 330, s: .55, pump: .5 + .5 * Math.sin(t * 6), tube: 260 }),
  cat: t => BG('#2C5A43') + leaf8({ len: 520, w: 200, x: 200, y: 520, r: -60, f: '#43855E', f2: '#2F6649', veins: 1, vo: .5 }) + caterpillar8(t, { x: 200, y: 230, s: .42, crawl: t * .6, puff: t * .8 }).replace(/#9A6ADE|#F4A63C|#E3B04B/g, '#B48CF0'),
  aphid: t => BG(K8.navy2) + F('M-20 300Q200 260 420 300L420 600L-20 600Z', K8.navy3) + aphid8(t, { x: 200, y: 250, s: .9, puff: (t * .5) % 1 }),
};
function cta8(t, T, cards, o = {}) {
  const k1 = E(t, T.a + .1, .6, 'o5'), k2 = E(t, T.a + .3, .6, 'o5'), tl = T.c(o.word || 'профиле');
  let s = bgDiag({ off: -t * 10 });
  s += lab8('в профиле', 540, 300, { s: 34, c: K8.amber, ls: 14, op: E(t, T.a, .5) }) + Ln('M420 330H660', E(t, T.a + .1, .5, 'o5'), { c: K8.amber, w: 4 });
  s += card8(lerp(-400, 290, k1), 760 + fl(t, 6, .3), 440, 640, CARD8[cards[0].k](t), cards[0].t, { r: -3 });
  s += card8(lerp(1480, 790, k2), 790 + fl(t, 6, .3, .5), 440, 640, CARD8[cards[1].k](t), cards[1].t, { r: 3 });
  const fo = E(t, T.e + .5, .8);
  return s + (fo > 0 ? BG(K8.night).replace('<rect', `<rect opacity="${R(fo * 100) / 100}"`) : '')
}
