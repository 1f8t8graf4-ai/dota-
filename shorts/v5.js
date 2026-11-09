// shorts/v5.js — рисовка v5 (09.11): чисто и плоско, как «Знакомьтесь, Боб» (2016).
//   Андрей: «зачем там дымка?» — поэтому без зерна, виньетки, свечений и полупрозрачного дыма.
//   Камера едет всё время, предметы появляются с отскоком, один предмет превращается в другой,
//   переходы — через цвет (наезд в круг, косые полосы, сдвиг). Грузится до ep/nic*.js (stage.html → loadEp).
'use strict';
window.V5 = true;
const CY = 860; // центр внимания по высоте (ниже — субтитры)

// ---------- движение ----------
// появиться с отскоком: масштаб from→s, поворот r0→r, сдвиг dy↓; out — время исчезновения
function pop(inner, x, y, t, t0, o = {}) {
  const k = P01(t, t0, o.d ?? .5);
  if (k <= 0) return '';
  const e = EZ[o.f || 'back'](k), s0 = o.s ?? 1, sc = s0 * (o.from != null ? lerp(o.from, 1, e) : e);
  const r = (o.r ?? 0) + (o.r0 ?? -10) * (1 - EZ.o(k));
  let out = 1, os = 1;
  if (o.out != null) { const q = P01(t, o.out, o.od ?? .3); out = 1 - EZ.i(q); os = lerp(1, o.os ?? .4, EZ.i(q)); if (out <= 0) return '' }
  return g(inner, at(x + (o.dx ?? 0) * (1 - EZ.o(k)), y + (o.dy ?? 0) * (1 - EZ.o(k)), sc * os, r), Math.min(clamp(k * 3), out))
}
// въезд со сдвигом (dx,dy → 0)
function slide(inner, t, t0, dx, dy, o = {}) {
  const k = E(t, t0, o.d ?? .6, o.f || 'o5'); if (k <= 0 && o.hide !== false) return '';
  return g(inner, `translate(${R(dx * (1 - k))} ${R(dy * (1 - k))})`, o.fade ? k : 1)
}
const bob = (t, am = 6, sp = .6, ph = 0) => Math.sin((t * sp + ph) * 2 * Math.PI) * am;
// моргание: 0 — открыт, 1 — закрыт
const blink = (t, seed = 0, per = 3.1) => { const p = (t + rnd(seed) * per) % per; return p < .14 ? Math.sin(p / .14 * Math.PI) : 0 };
// камера по ключам [[t, cx, cy, z, rot]]: точка (cx,cy) мира — в центр кадра (540, CY)
function cam(t, K, f = 'io5') {
  let i = 0; while (i < K.length - 1 && t >= K[i + 1][0]) i++;
  const a = K[i], b = K[Math.min(i + 1, K.length - 1)];
  const k = b[0] > a[0] ? EZ[f](clamp((t - a[0]) / (b[0] - a[0]))) : 1;
  const cx = lerp(a[1], b[1], k), cy = lerp(a[2], b[2], k), z = lerp(a[3] ?? 1, b[3] ?? 1, k), r = lerp(a[4] || 0, b[4] || 0, k);
  return `translate(540 ${CY}) rotate(${R(r)}) scale(${Math.round(z * 1000) / 1000}) translate(${R(-cx)} ${R(-cy)})`
}
// медленный наезд на всю сцену (камера не стоит)
const drift = (t, T, a = .05, cx = 540, cy = CY) => about(cx, cy, 1 + a * EZ.io(P01(t, T.a, T.b - T.a + .4)));
// удар: сжатие по вертикали при приземлении
const squash = (t, t0, am = .18, d = .35) => { const k = P01(t, t0, d); return k <= 0 || k >= 1 ? 1 : 1 - am * Math.sin(k * Math.PI) * (1 - k) };
// тряска (затухающая)
const shake = (t, t0, am = 14, d = .45, sp = 38) => { const k = P01(t, t0, d); return k <= 0 || k >= 1 ? 0 : Math.sin((t - t0) * sp) * am * (1 - k) };

// ---------- плоская форма ----------
function sh(d, f, o = {}) {
  const op = (o.op ?? 1) * (o.fk ?? 1);
  let s = f && op > 0 ? `<path d="${d}" fill="${f}"${op < 1 ? ` opacity="${R(op * 100) / 100}"` : ''}${o.tr ? ` transform="${o.tr}"` : ''}/>` : '';
  if (o.c && (o.k ?? 1) > 0) s += o.tr ? g(line(d, o.k ?? 1, { c: o.c, w: o.w ?? 6, op: o.op ?? 1 }), o.tr) : line(d, o.k ?? 1, { c: o.c, w: o.w ?? 6, op: o.op ?? 1 });
  return s
}
const clip = (d, inner, tr = '') => { const id = uid(); return `<clipPath id="${id}"><path d="${d}"${tr ? ` transform="${tr}"` : ''}/></clipPath><g clip-path="url(#${id})">${inner}</g>` };
// вырезать из формы круги (укус и т.п.): holes = [[x,y,r]]
const cut = (inner, holes, bb = [-3000, -3000, 6000, 6000]) => { const id = uid(); return `<mask id="${id}" maskUnits="userSpaceOnUse" x="${bb[0]}" y="${bb[1]}" width="${bb[2]}" height="${bb[3]}"><rect x="${bb[0]}" y="${bb[1]}" width="${bb[2]}" height="${bb[3]}" fill="#fff"/>${holes.map(([x, y, r]) => `<circle cx="${R(x)}" cy="${R(y)}" r="${R(r)}" fill="#000"/>`).join('')}</mask><g mask="url(#${id})">${inner}</g>` };
// растровая подложка-текстура (точки по всему кадру в углу) — как у «Боба»
const corner = (c, op = .25, x0 = 0, y0 = 0, x1 = 1080, y1 = 760) => dots(D_.poly([[x0, y0], [x1, y0], [x0, y1]]), { c, step: 22, r: 7, x0, y0, x1: (x0 + x1) / 2, y1: (y0 + y1) / 2, op });
// парящие точки (редкие)
const motes = (t, cols, n = 14, y0 = 220, y1 = 1260) => { let s = ''; for (let i = 0; i < n; i++) { const ph = (t * (.05 + rnd(i) * .06) + rnd(i + 3)) % 1, x = 60 + rnd(i + 7) * 960 + Math.sin(t * .8 + i) * 18, y = y1 - ph * (y1 - y0); s += `<circle cx="${R(x)}" cy="${R(y)}" r="${R(4 + rnd(i + 11) * 6)}" fill="${cols[i % cols.length]}" opacity="${R(Math.sin(ph * Math.PI) * 90) / 100}"/>` } return s };

// ---------- переходы v5 ----------
// zc — наезд в круг цвета (как у «Боба»: камера влетает в красное солнце, и оно становится фоном);
// into — сцена A сжимается в точку сцены B; slide/slideL/slideU/slideD — камера едет; band — две косые полосы;
// flip — карточка переворачивается; drop — новая сцена падает сверху
const _tr0 = transition;
transition = function (kind, k, A, B, SA, SB) {
  const fx = (EP.trAt && EP.trAt[SA.key]) || [540, CY], col = (EP.trCol && EP.trCol[SA.key]) || P.a1;
  if (kind === 'zc') {
    if (k < .55) { const e = EZ.i(k / .55); return g(A, about(fx[0], fx[1], 1 + e * 2.2)) + `<circle cx="${fx[0]}" cy="${fx[1]}" r="${R(lerp(6, 2300, e))}" fill="${col}"/>` }
    const e = EZ.o5((k - .55) / .45); return g(B, about(540, CY, lerp(1.18, 1, e)))
  }
  if (kind === 'into') { // A сжимается кругом-«линзой» в точку to на B, камера на B отъезжает
    const e = EZ.io5(k), to = (EP.trTo && EP.trTo[SA.key]) || [540, CY], cx = lerp(fx[0], to[0], e), cy = lerp(fx[1], to[1], e), r = lerp(1600, 0, EZ.i(e) * .3 + e * .7);
    const id = uid();
    return g(B, about(to[0], to[1], lerp(1.35, 1, e))) + `<clipPath id="${id}"><circle cx="${R(cx)}" cy="${R(cy)}" r="${R(r)}"/></clipPath><g clip-path="url(#${id})"><rect width="${W}" height="${H}" fill="${(EP.trBg && EP.trBg[SA.key]) || P.bg}"/>${g(A, `translate(${R(cx - fx[0])} ${R(cy - fx[1])}) ` + about(fx[0], fx[1], lerp(1, .35, e)))}</g>` + `<circle cx="${R(cx)}" cy="${R(cy)}" r="${R(r)}" fill="none" stroke="${(EP.trCol && EP.trCol[SA.key]) || P.paper}" stroke-width="${R(4 + 8 * e)}"/>`
  }
  if (kind === 'out') { // из точки fx на A вырастает круг, в нём — B
    const e = EZ.io5(k), r = lerp(0, 2300, EZ.i(e) * .4 + e * .6), id = uid();
    return g(A, about(fx[0], fx[1], lerp(1, 1.35, e))) + `<clipPath id="${id}"><circle cx="${fx[0]}" cy="${fx[1]}" r="${R(r)}"/></clipPath><g clip-path="url(#${id})">${g(B, about(fx[0], fx[1], lerp(1.25, 1, e)))}</g>` + `<circle cx="${fx[0]}" cy="${fx[1]}" r="${R(r)}" fill="none" stroke="${(EP.trCol && EP.trCol[SA.key]) || P.paper}" stroke-width="${R(10 * (1 - e) + 2)}"/>`
  }
  if (/^slide/.test(kind)) {
    const e = EZ.io5(k), d = kind === 'slideL' ? [1, 0] : kind === 'slideU' ? [0, -1] : kind === 'slideD' ? [0, 1] : [-1, 0];
    const dx = d[0] * W * e, dy = d[1] * H * e, ox = -d[0] * W * (1 - e), oy = -d[1] * H * (1 - e);
    return g(A, `translate(${R(dx)} ${R(dy)})`) + g(B, `translate(${R(ox)} ${R(oy)})`)
  }
  if (kind === 'band') {
    const e = EZ.io5(k), col2 = (EP.trCol2 && EP.trCol2[SA.key]) || P.a2, x = lerp(-1700, 2900, e);
    const strip = (x0, w0) => D_.poly([[x0, -200], [x0 + w0, -200], [x0 + w0 - 1100, 2120], [x0 - 1100, 2120]]);
    const id = uid();
    return A + `<clipPath id="${id}"><path d="${D_.poly([[-3000, -200], [x - 420, -200], [x - 1520, 2120], [-3000, 2120]])}"/></clipPath><g clip-path="url(#${id})">${B}</g>` + fill(strip(x - 420, 260), col) + fill(strip(x - 160, 160), col2)
  }
  if (kind === 'flip') { const e = EZ.io(k); return k < .5 ? g(A, `translate(540 ${CY}) scale(${R((1 - e * 2) * 1000) / 1000} 1) translate(-540 ${-CY})`) : g(B, `translate(540 ${CY}) scale(${R((e * 2 - 1) * 1000) / 1000} 1) translate(-540 ${-CY})`) }
  if (kind === 'drop') { const e = EZ.back(clamp(k)); return g(A, `translate(0 ${R(EZ.i(k) * 500)})`, 1 - k) + g(B, `translate(0 ${R((1 - e) * -H)})`) }
  return _tr0(kind, k, A, B, SA, SB)
};
Object.assign(TRD, { zc: .7, into: .75, out: .75, slide: .6, slideL: .6, slideU: .6, slideD: .6, band: .8, flip: .5, drop: .6 });

// ---------- предметы ----------
// ЛИСТ ТАБАКА: основание (0,0), кончик вверх (0,-len); k — жилки, two — правая половина темнее
function leafPath(len = 700, w = 260) { return `M0 0C${R(w * .95)} ${R(-len * .12)} ${R(w * .9)} ${R(-len * .7)} 0 ${-len}C${R(-w * .9)} ${R(-len * .7)} ${R(-w * .95)} ${R(-len * .12)} 0 0Z` }
function leafT(o = {}) {
  const len = o.len || 700, w = o.w || 260, d = leafPath(len, w), c = o.c ?? P.line;
  const half = `M0 0C${R(w * .95)} ${R(-len * .12)} ${R(w * .9)} ${R(-len * .7)} 0 ${-len}Z`;
  let s = sh(d, o.f || P.leaf) + sh(half, o.f2 || P.leaf2);
  if (o.dots !== false) s += dots(half, { c: o.dc || P.ink, step: 15, r: 5, x0: 0, y0: -len * .9, x1: w * .7, y1: -len * .2, op: .22 });
  const k = o.k ?? 1;
  if (k > 0) {
    let v = `M0 -6Q${R(w * .06)} ${R(-len * .5)} 0 ${R(-len * .96)}`;
    for (let i = 1; i <= 6; i++) { const u = i / 7.2, y = -len * u, l = w * .78 * Math.sin(Math.min(1, u * 1.15) * Math.PI) + 20; v += `M0 ${R(y)}Q${R(l * .55)} ${R(y - 30)} ${R(l)} ${R(y - 90)}M0 ${R(y)}Q${R(-l * .55)} ${R(y - 30)} ${R(-l)} ${R(y - 90)}` }
    s += line(v, k, { c: o.vc || c, w: o.vw || 5, op: .8 });
  }
  if (c) s += line(d, o.ok ?? 1, { c, w: o.ow || 6 });
  if (o.holes) s = cut(s, o.holes);
  return s
}
// ЖУК сбоку (смотрит вправо): x,y — середина брюшка на земле; walk — шаги; chomp 0..1 — челюсти; stiff — замер; back — на спине (0..1)
function beetle(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#2E7D5B', f2 = o.f2 || '#1F5A41', step = o.walk ? Math.sin(t * 16) : 0, st = o.stiff || 0;
  const legs = (side) => { let q = ''; for (let i = 0; i < 3; i++) { const bx = -50 + i * 50, ph = (i % 2 ? 1 : -1) * side * step * (1 - st), kx = bx + 14 + ph * 16, fx2 = bx + (i - 1) * 34 + ph * 24, lift = Math.max(0, -ph) * 14 * side; q += line(`M${bx} -18L${R(kx)} ${R(-4 - lift)}L${R(fx2)} ${R(26 - lift * 1.3)}`, 1, { c, w: 7 }) } return q };
  let s = legs(-1);
  // тело: надкрылья (купол) + переднеспинка + голова
  const body = 'M-96 -10C-100 -96 -30 -130 34 -112C78 -100 92 -60 92 -14Z';
  s += sh(body, f, { c, w: 6 }) + sh('M-96 -10C-100 -96 -30 -130 34 -112C10 -96 -20 -60 -40 -10Z', f2) + line('M-96 -10C-100 -96 -30 -130 34 -112', 1, { c, w: 6 });
  s += line('M30 -110C14 -80 0 -40 -4 -12', 1, { c, w: 5, op: .7 }) + `<path d="M-62 -92Q-40 -112 -10 -116" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".55"/>`;
  s += sh('M86 -18C88 -56 104 -80 128 -78C150 -76 158 -50 152 -24Z', f2, { c, w: 6 });
  const ch = clamp(o.chomp || 0), mo = Math.sin(ch * Math.PI) * 14;
  s += sh(`M150 -40C176 ${R(-52 - mo)} 186 ${R(-30 - mo)} 172 ${R(-20 - mo * .4)}Z`, c) + sh(`M150 -24C176 ${R(-18 + mo)} 184 ${R(-2 + mo)} 168 ${R(-4 + mo * .4)}Z`, c);
  if (o.dead) s += line('M120 -64L136 -48M136 -64L120 -48', 1, { c: '#fff', w: 6 });
  else s += `<circle cx="128" cy="-56" r="10" fill="#fff"/><circle cx="${o.look ? 132 : 130}" cy="-56" r="5.5" fill="${c}"/>`;
  const an = st ? 0 : Math.sin(t * 6) * 6;
  s += line(`M136 -76C150 ${R(-118 + an)} 176 ${R(-128 + an)} 196 ${R(-120 + an)}`, 1, { c, w: 5 }) + line(`M128 -78C134 ${R(-122 - an)} 150 ${R(-140 - an)} 168 ${R(-146 - an)}`, 1, { c, w: 5, op: .6 });
  s += legs(1);
  if (o.zap) { // молнии по нервам: zap 0..1
    let z = ''; for (let i = 0; i < 4; i++) { const ph = Math.floor(t * 14 + i * 3), x0 = -70 + i * 40, sy = rnd(ph + i) * 20; z += `M${x0} ${R(-30 - sy)}l12 -18l-8 -4l14 -20` }
    s += line(z, 1, { c: o.zc || '#FFD23F', w: 6, op: clamp(o.zap) });
  }
  const sx = o.flipX ? -1 : 1, bk = clamp(o.back || 0);
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0) + ` scale(${sx} 1)` + (bk ? ` translate(0 ${R(-60 * Math.sin(bk * Math.PI))}) rotate(${R(bk * 180)} 0 -60)` : ''), o.op ?? 1)
}
// ТЛЯ сбоку (смотрит вправо), округлая, милая; mood: calm|smile|relief|o; puff 0..1 — выдох; sweat
function aphid(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#A6D86B', f2 = o.f2 || '#7FB84A', mood = o.mood || 'calm', bl = o.blink ?? blink(t, o.seed || 2);
  let s = '';
  for (let i = 0; i < 3; i++) { const bx = -40 + i * 36, ph = o.walk ? Math.sin(t * 14 + i * 2) * 8 : 0; s += line(`M${bx} 30L${R(bx + 10 + ph)} 56L${R(bx + 22 + ph)} 60`, 1, { c, w: 6 }) }
  s += sh('M-92 20C-110 -40 -60 -92 6 -90C60 -88 96 -50 90 6C84 44 40 56 -10 56C-56 56 -84 46 -92 20Z', f, { c, w: 6 });
  s += sh('M-92 20C-110 -40 -60 -92 6 -90C-30 -70 -60 -20 -50 52C-74 48 -86 38 -92 20Z', f2);
  s += line('M-78 -50L-104 -84M-54 -70L-70 -104', 1, { c, w: 6 }) + sh(D_.circ(-104, -86, 8), f2, { c, w: 4 }) + sh(D_.circ(-70, -106, 8), f2, { c, w: 4 });
  s += sh('M66 -40C78 -70 118 -74 132 -46C146 -18 128 10 100 12C80 12 62 -10 66 -40Z', f, { c, w: 6 });
  const ex = 108, ey = -36;
  if (mood === 'relief' || bl > .6) s += line(`M${ex - 12} ${ey + 2}Q${ex} ${ey - 10} ${ex + 12} ${ey + 2}`, 1, { c, w: 5 });
  else s += `<ellipse cx="${ex}" cy="${ey}" rx="11" ry="${R(13 * (1 - bl))}" fill="${c}"/><circle cx="${ex + 4}" cy="${ey - 5}" r="4" fill="#fff"/>`;
  if (mood === 'smile') s += line('M112 -8Q122 0 130 -10', 1, { c, w: 5 });
  if (mood === 'o' || o.puff) s += `<ellipse cx="128" cy="-4" rx="6" ry="${R(4 + clamp(o.puff || 0) * 4)}" fill="${c}"/>`;
  s += line('M120 -64C130 -96 160 -108 180 -100M110 -68C110 -104 130 -128 148 -132', 1, { c, w: 5 });
  if (o.puff) { const k = clamp(o.puff); s += g(cloud(0, 0, 1, { f: '#FFFFFF', c, w: 5 }), at(150 + k * 70, -4 - k * 26, .18 + k * .3), Math.min(1, (1 - k) * 3)) }
  if (o.sweat) s += g(sh(D_.drop(0, 0, 14), '#9AD3F5', { c, w: 4 }), at(70, -96 + o.sweat * 20), 1 - clamp(o.sweat));
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0) + (o.flipX ? ' scale(-1 1)' : ''), o.op ?? 1)
}
// ОБЛАКО (плоское, непрозрачное): центр 0,0, ширина ~ 360*s
function cloud(x, y, s = 1, o = {}) {
  const d = 'M-170 40C-210 40 -220 -20 -176 -34C-184 -94 -110 -118 -70 -84C-50 -140 40 -140 62 -84C110 -110 176 -70 160 -20C210 -10 206 40 160 40Z';
  return g(sh(d, o.f || '#FFFFFF', { c: o.c, w: o.w ?? 6 }) + (o.f2 ? sh('M-170 40C-150 20 -100 10 -40 26C20 40 120 10 160 40Z', o.f2) : ''), at(x, y, s, o.r || 0), o.op ?? 1)
}
// ОДНОРАЗКА: центр 0,0, высота ~480; f — корпус, label — надпись, led 0..1
function vape(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || P.mango || '#FFB238', f2 = o.f2 || '#E8901F', h = o.h || 440, w = o.w || 170, r = w * .34;
  const body = D_.rr(-w / 2, -h / 2, w, h, r);
  let s = sh(`M${-w * .36} ${-h / 2 + 4}L${-w * .26} ${-h / 2 - 76}L${w * .26} ${-h / 2 - 76}L${w * .36} ${-h / 2 + 4}Z`, o.mf || '#2B2F3A', { c, w: 6 });
  s += sh(body, f) + sh(D_.rr(w * .12, -h / 2, w * .38, h, r), f2) + line(body, 1, { c, w: 6 });
  s += sh(D_.rr(-w * .3, -h * .3, w * .6, h * .42, 18), o.lf || '#FFF6E5', { c, w: 5 });
  if (o.label !== false) s += tx(o.label || L('MANGO', 'МАНГО'), 0, -h * .08, { f: 'O', w: 700, s: w * .2, c: o.lc || c, ls: 2 });
  if (o.fruit !== false) s += g(mango(0, 0, .28, { c }), at(0, -h * .19));
  const led = o.led ?? (.5 + .5 * Math.sin(t * 5));
  s += sh(D_.circ(0, h * .34, 13), o.ledc || '#7CF29A', { op: .35 + .65 * led }) + line(D_.circ(0, h * .34, 13), 1, { c, w: 4 });
  s += `<path d="M${-w * .32} ${-h * .36}V${h * .3}" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".45"/>`;
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// МАНГО (иконка)
function mango(x, y, s = 1, o = {}) {
  const c = o.c ?? P.ink;
  return g(sh('M-90 10C-100 -60 -20 -96 40 -80C100 -64 120 0 90 40C60 84 -10 90 -50 70C-76 58 -86 38 -90 10Z', o.f || '#FFB238', { c, w: 6 }) + sh('M-40 70C10 84 70 70 90 40C80 70 40 92 -10 90Z', '#F07E2B') + sh('M20 -84C30 -130 80 -140 110 -126C90 -100 60 -86 20 -84Z', '#5E9E5A', { c, w: 5 }) + `<path d="M-50 -30Q-30 -56 0 -60" stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none" opacity=".6"/>`, at(x, y, s, o.r || 0), o.op ?? 1)
}
// СИГАРЕТА горизонтально: центр 0,0, длина len; ember 0..1
function cigarette(t, o = {}) {
  const c = o.c ?? P.ink, len = o.len || 760, h = o.h || 86, x0 = -len / 2;
  let s = sh(D_.rr(x0, -h / 2, len, h, 18), o.f || '#FFFFFF') + sh(D_.rr(x0, -h / 2, len * .3, h, 18), o.fil || '#E9A23B') + dots(D_.rr(x0, -h / 2, len * .3, h, 18), { c: '#B26F1F', step: 12, r: 4, op: .6 });
  s += sh(D_.rr(len / 2 - 50, -h / 2, 50, h, 16), '#9AA0A6') + line(`M${x0 + len * .3} ${-h / 2}V${h / 2}`, 1, { c, w: 5 }) + line(D_.rr(x0, -h / 2, len, h, 18), 1, { c, w: 6 });
  const em = o.ember ?? (.6 + .4 * Math.sin(t * 9));
  s += sh(D_.rr(len / 2 - 14, -h / 2 + 8, 18, h - 16, 8), '#FF5A3C', { op: .5 + .5 * em });
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// тонкая линия дыма (не облако — линия, без полупрозрачности)
const curl = (x, y, t, h = 220, c = '#FFFFFF', w = 6) => { let d = `M${x} ${y}`; for (let i = 1; i <= 12; i++) { const u = i / 12; d += `L${R(x + Math.sin(u * 7 - t * 4) * 26 * u)} ${R(y - u * h)}` } return line(d, 1, { c, w, op: .85 }) };
// МОЗГ с лицом (вид сбоку): face — {mood, look, blink}
function brainF(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#F4A6B8', f2 = o.f2 || '#E27F98';
  let s = sh(BRAIN, f) + sh('M-150 30C-130 80 -80 70 -60 90C-20 105 40 100 60 70C110 95 170 60 175 -50C150 20 100 30 60 20C0 40 -80 50 -150 30Z', f2) + line(BRAIN, 1, { c, w: 6 }) + line(BRAIN_IN, o.k ?? 1, { c, w: 5, op: .75 });
  if (o.face) {
    const m = o.face.mood || 'calm', bl = o.face.blink ?? blink(t, 5), lk = (o.face.look || 0) * 8;
    for (const ex of [-30, 40]) s += bl > .6 || m === 'happy' ? line(`M${ex - 14 + lk} -2Q${ex + lk} ${m === 'happy' ? -16 : 6} ${ex + 14 + lk} -2`, 1, { c, w: 6 }) : `<ellipse cx="${ex + lk}" cy="-4" rx="11" ry="${R(14 * (1 - bl))}" fill="${c}"/><circle cx="${ex + 4 + lk}" cy="-9" r="4" fill="#fff"/>`;
    if (m === 'happy' || m === 'smile') s += sh(`M${-10 + lk} 26Q${5 + lk} 50 ${22 + lk} 26Z`, c);
    else if (m === 'want') s += sh(D_.ell(6 + lk, 34, 12, 14), c) + line(`M-50 -40L-14 -30M60 -40L26 -30`, 1, { c, w: 6 });
    else if (m === 'sad') s += line(`M${-8 + lk} 40Q${6 + lk} 28 ${20 + lk} 40`, 1, { c, w: 6 });
    else s += line(`M${-6 + lk} 32L${18 + lk} 32`, 1, { c, w: 6 });
  }
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// ГОЛОВА в профиль (вправо), с вырезом под мозг (brain — что внутри)
function head(o = {}) {
  const c = o.c ?? P.ink;
  let s = sh(HEAD, o.f || '#2B3F5C', { c, w: o.w ?? 6 });
  if (o.brain) s += g(o.brain, at(10, -60, .9));
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
}
// МОЛЕКУЛА НИКОТИНА (шестиугольник + пятиугольник), можно с лицом
function molecule(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#FF4F8B', f2 = o.f2 || '#D93370', r = o.r0 || 70;
  const hex = D_.poly([...Array(6)].map((_, i) => { const a = (i * 60 - 90) * Math.PI / 180; return [Math.cos(a) * r, Math.sin(a) * r] }));
  const pc = [r * 1.62, r * .35], pr = r * .8;
  const pent = D_.poly([...Array(5)].map((_, i) => { const a = (i * 72 + 162) * Math.PI / 180; return [pc[0] + Math.cos(a) * pr, pc[1] + Math.sin(a) * pr] }));
  let s = line(`M${R(pc[0] + pr * .4)} ${R(pc[1] + pr * .9)}L${R(pc[0] + pr * .6)} ${R(pc[1] + pr * 1.7)}`, 1, { c, w: 10 }) + sh(D_.circ(pc[0] + pr * .62, pc[1] + pr * 1.75, 16), f2, { c, w: 5 });
  s += sh(pent, f2, { c, w: 7 }) + sh(hex, f, { c, w: 7 });
  s += sh(D_.circ(0, r, 15), '#7FD3F5', { c, w: 4 }) + sh(D_.circ(pc[0] + pr * .3, pc[1] - pr * .95, 13), '#7FD3F5', { c, w: 4 });
  if (o.face !== false) {
    const bl = o.blink ?? blink(t, o.seed || 7), lk = (o.look || 0) * 8, m = o.mood || 'sly';
    for (const ex of [-22, 22]) {
      if (bl > .6 || m === 'happy') s += line(`M${ex - 12 + lk} -6Q${ex + lk} -20 ${ex + 12 + lk} -6`, 1, { c, w: 6 });
      else s += `<ellipse cx="${ex + lk}" cy="-8" rx="10" ry="${R(13 * (1 - bl))}" fill="#fff"/><circle cx="${ex + 2 + lk * 1.4}" cy="-6" r="6" fill="${c}"/>`;
    }
    if (m === 'sly') s += line(`M-34 -30L-10 -24M34 -30L10 -24`, 1, { c, w: 6 }) + line(`M${-16 + lk} 22Q${2 + lk} 34 ${22 + lk} 16`, 1, { c, w: 6 });
    else if (m === 'shout') s += sh(D_.ell(lk, 28, 18, 22), c) + line(`M-34 -34L-8 -24M34 -34L8 -24`, 1, { c, w: 6 });
    else if (m === 'happy') s += sh(`M${-16 + lk} 16Q${lk} 40 ${18 + lk} 16Z`, c);
    else if (m === 'tiny') s += line(`M${-6 + lk} 22L${8 + lk} 22`, 1, { c, w: 5 });
    else s += line(`M${-12 + lk} 22L${12 + lk} 22`, 1, { c, w: 6 });
  }
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.rot || 0), o.op ?? 1)
}
// маленькая молекула-значок без лица
const molIcon = (x, y, s = 1, f, c) => molecule(0, { x, y, s, f, c, face: false });
// СЕКУНДОМЕР: val — секунды (с десятыми)
function stopwatch(x, y, val, o = {}) {
  const c = o.c ?? P.ink, r = o.r || 230;
  let s = sh(D_.rr(-40, -r - 70, 80, 50, 12), o.f2 || '#2B2F3A', { c, w: 6 }) + sh(D_.rr(-16, -r - 30, 32, 40, 6), o.f2 || '#2B2F3A', { c, w: 5 });
  s += sh(D_.circ(0, 0, r), o.f || '#FFFFFF', { c, w: 8 }) + sh(D_.circ(0, 0, r - 30), o.face || '#F2ECDD');
  const lim = o.lim || 10, a = (val / lim) * 360;
  if (val > 0) s += sh(`M0 0L0 ${-(r - 30)}A${r - 30} ${r - 30} 0 ${a > 180 ? 1 : 0} 1 ${R(Math.sin(a * Math.PI / 180) * (r - 30))} ${R(-Math.cos(a * Math.PI / 180) * (r - 30))}Z`, o.fill || '#E9A23B', { op: .55 });
  for (let i = 0; i < 20; i++) { const q = i * 18 * Math.PI / 180, r1 = r - 40, r2 = r - (i % 5 ? 56 : 72); s += `<path d="M${R(Math.sin(q) * r1)} ${R(-Math.cos(q) * r1)}L${R(Math.sin(q) * r2)} ${R(-Math.cos(q) * r2)}" stroke="${c}" stroke-width="${i % 5 ? 4 : 7}" stroke-linecap="round"/>` }
  s += `<path d="M0 0L${R(Math.sin(a * Math.PI / 180) * (r - 46))} ${R(-Math.cos(a * Math.PI / 180) * (r - 46))}" stroke="${o.hand || '#E2574C'}" stroke-width="10" stroke-linecap="round"/><circle r="16" fill="${c}"/>`;
  if (o.digits !== false) s += tx(val.toFixed(1).replace('.', ',') + (o.unit ?? ''), 0, r * .52, { f: 'O', w: 700, s: r * .34, c });
  return g(s, at(x, y, o.s || 1, o.rot || 0), o.op ?? 1)
}
// ЧАСЫ плоские: h, m — время (стрелки)
function clockF(x, y, r, hh, mm, o = {}) {
  const c = o.c ?? P.ink; let s = sh(D_.circ(0, 0, r), o.f || '#FFFFFF', { c, w: 8 });
  for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180, r1 = r * .82, r2 = r * (i % 3 ? .9 : .72); s += `<path d="M${R(Math.sin(a) * r1)} ${R(-Math.cos(a) * r1)}L${R(Math.sin(a) * r2)} ${R(-Math.cos(a) * r2)}" stroke="${c}" stroke-width="${i % 3 ? 5 : 9}" stroke-linecap="round"/>` }
  if (o.arc) s += sh(`M0 0L0 ${-r * .7}A${r * .7} ${r * .7} 0 ${o.arc > 180 ? 1 : 0} 1 ${R(Math.sin(o.arc * Math.PI / 180) * r * .7)} ${R(-Math.cos(o.arc * Math.PI / 180) * r * .7)}Z`, o.ac || '#E9A23B', { op: .6 });
  const ha = ((hh % 12) + mm / 60) * 30, ma = mm * 6;
  s += `<path d="M0 0L${R(Math.sin(ha * Math.PI / 180) * r * .48)} ${R(-Math.cos(ha * Math.PI / 180) * r * .48)}" stroke="${c}" stroke-width="14" stroke-linecap="round"/><path d="M0 0L${R(Math.sin(ma * Math.PI / 180) * r * .72)} ${R(-Math.cos(ma * Math.PI / 180) * r * .72)}" stroke="${o.hand || '#E2574C'}" stroke-width="9" stroke-linecap="round"/><circle r="14" fill="${c}"/>`;
  return g(s, at(x, y, o.s || 1, o.rot || 0), o.op ?? 1)
}
// ЗНАК ЗАПРЕТА
const banSign = (x, y, r, o = {}) => g(`<circle r="${r}" fill="none" stroke="${o.c || '#E2574C'}" stroke-width="${R(r * .17)}"/><path d="M${R(-r * .7)} ${R(-r * .7)}L${R(r * .7)} ${R(r * .7)}" stroke="${o.c || '#E2574C'}" stroke-width="${R(r * .17)}" stroke-linecap="round"/>`, at(x, y, o.s || 1, o.rot || 0), o.op ?? 1);
// ЗВЁЗДЫ ЕС: k — сколько звёзд появилось (0..1)
function euDisc(x, y, r, k = 1, o = {}) {
  let s = sh(D_.circ(0, 0, r), o.f || '#2F56A6', { c: o.c, w: 7 });
  for (let i = 0; i < 12; i++) { const kk = clamp(k * 12 - i), a = (i * 30 - 90) * Math.PI / 180; if (kk > 0) s += g(sh(D_.star(0, 0, r * .12, r * .05), o.sc || '#FFD23F'), at(Math.cos(a) * r * .66, Math.sin(a) * r * .66, EZ.back(kk), (1 - kk) * 90)) }
  return g(s, at(x, y, o.s || 1, o.rot || 0), o.op ?? 1)
}
// ПУЗЫРЬ речи: текст, хвостик вниз-влево
function bubble(str, x, y, o = {}) {
  const s0 = o.s || 64, w0 = tw(str, { f: o.ff || 'U', w: 800, s: s0 }) + 80, h0 = s0 * 1.7, c = o.c ?? P.ink;
  const d = D_.rr(-w0 / 2, -h0 / 2, w0, h0, h0 / 2) + `M${-w0 * .2} ${h0 / 2 - 4}L${-w0 * .3} ${h0 / 2 + 40}L${-w0 * .02} ${h0 / 2 - 4}Z`;
  return g(sh(d, o.f || '#FFFFFF', { c, w: 6 }) + tx(str, 0, s0 * .36, { f: o.ff || 'U', w: 800, s: s0, c: o.tc || c }), at(x, y, o.sc || 1, o.rot || 0), o.op ?? 1)
}
// ПРОБИРКА: lvl 0..1
function tube(x, y, lvl, o = {}) {
  const c = o.c ?? P.ink, h = o.h || 520, w = o.w || 130, d = `M${-w / 2} ${-h / 2}V${h / 2 - w / 2}A${w / 2} ${w / 2} 0 0 0 ${w / 2} ${h / 2 - w / 2}V${-h / 2}`;
  const lv = -h / 2 + 40 + (h - 40) * (1 - lvl);
  let s = clip(d + 'Z', sh(D_.rr(-w, lv, w * 2, h, 0), o.f || '#E2574C') + (o.wave !== false ? sh(D_.wave(-w, w, lv, 8, 90, (o.t || 0) * 4, 6) + `L${w} ${lv + 30}L${-w} ${lv + 30}Z`, o.f || '#E2574C') : ''));
  s += line(d, 1, { c, w: 7 }) + line(`M${-w / 2 - 18} ${-h / 2}H${w / 2 + 18}`, 1, { c, w: 9 }) + `<path d="M${-w * .24} ${-h * .36}V${h * .3}" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".5"/>`;
  return g(s, at(x, y, o.s || 1, o.rot || 0), o.op ?? 1)
}
// ИКОНКА ЧЕЛОВЕКА (голова + плечи)
const person1 = (x, y, s, f) => g(sh(D_.circ(0, -40, 22), f) + sh('M-40 30C-40 -6 -22 -14 0 -14C22 -14 40 -6 40 30Z', f), at(x, y, s));
// ЛИСТОК КАЛЕНДАРЯ
function calPage(x, y, top, big, o = {}) {
  const c = o.c ?? P.ink, w = o.w || 300, h = o.h || 340;
  let s = sh(D_.rr(-w / 2, -h / 2, w, h, 24), o.f || '#FFFFFF', { c, w: 7 }) + sh(`M${-w / 2} ${-h / 2 + 24}A24 24 0 0 1 ${-w / 2 + 24} ${-h / 2}H${w / 2 - 24}A24 24 0 0 1 ${w / 2} ${-h / 2 + 24}V${-h / 2 + 90}H${-w / 2}Z`, o.hf || '#E2574C') + line(D_.rr(-w / 2, -h / 2, w, h, 24), 1, { c, w: 7 });
  s += tx(top, 0, -h / 2 + 64, { f: 'O', w: 700, s: 44, c: '#fff', ls: 2 }) + tx(big, 0, h * .22, { f: 'O', w: 700, s: o.bs || 150, c });
  return g(s, at(x, y, o.s || 1, o.rot || 0), o.op ?? 1)
}
// ПЛАШКА с текстом (пилюля)
function pill(str, x, y, o = {}) {
  const s0 = o.s || 44, w0 = tw(str, { f: o.ff || 'O', w: 700, s: s0, ls: o.ls || 2 }) + s0 * 1.4, h0 = s0 * 1.6;
  return g(sh(D_.rr(-w0 / 2, -h0 / 2, w0, h0, h0 / 2), o.f || P.ink, { c: o.c, w: o.w ?? 0 }) + tx(str, 0, s0 * .36, { f: o.ff || 'O', w: 700, s: s0, c: o.tc || '#fff', ls: o.ls || 2 }), at(x, y, o.sc || 1, o.rot || 0), o.op ?? 1)
}

// ---------- ПОДРОСТОК (Макс): стопы в (0,0), рост ~1000 при s=1 ----------
// o.pose: {L:[[локоть],[кисть]], R:[[локоть],[кисть]]} в координатах тела; готовые — TP.*
// o: f (худи), f2 (тень худи), pants, skin, hair, hairC, mood (calm|smile|laugh|sad|angry|tired|cough|sleep|o|smirk), blink, look,
//    brows, sweat, bags (мешки под глазами), headR (наклон головы), headY, item (что в правой руке: 'vape'), legs ('stand'|'sit'|'none'), op
const TP = {
  stand: { L: [[-132, -600], [-138, -462]], R: [[132, -600], [138, -462]] },
  mouth: { L: [[-132, -600], [-138, -462]], R: [[178, -676], [44, -800]] },
  reach: { L: [[-132, -600], [-138, -462]], R: [[214, -690], [318, -672]] },
  give: { L: [[-210, -690], [-318, -672]], R: [[132, -600], [138, -462]] },
  cough: { L: [[-150, -610], [-40, -560]], R: [[160, -680], [36, -790]] },
  cross: { L: [[-162, -640], [70, -628]], R: [[162, -650], [-70, -640]] },
  throw: { L: [[-132, -600], [-138, -462]], R: [[200, -860], [250, -990]] },
  pocket: { L: [[-140, -600], [-70, -520]], R: [[140, -600], [70, -520]] },
  wave: { L: [[-132, -600], [-138, -462]], R: [[214, -770], [236, -930]] },
  shrug: { L: [[-190, -640], [-250, -720]], R: [[190, -640], [250, -720]] },
  hips: { L: [[-200, -610], [-112, -520]], R: [[200, -610], [112, -520]] },
};
function teen(t, o = {}) {
  const c = o.c ?? P.ink, f = o.f || '#F2994A', f2 = o.f2 || '#D97A2B', sk = o.skin || '#F2C29B', sk2 = o.skin2 || '#DFA37A', pants = o.pants || '#2E3B5E', hc = o.hairC || '#3B2A20';
  const pose = typeof o.pose === 'string' ? TP[o.pose] : (o.pose || TP.stand), m = o.mood || 'calm';
  const tube = (p, w0, col) => { const d = D_.poly(p, false); return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w0 + 12}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w0}" stroke-linecap="round" stroke-linejoin="round"/>` };
  let s = '';
  // ноги
  const lg = o.legs || 'stand';
  if (lg === 'stand') {
    const sp = o.walk ? Math.sin(t * 8) * 26 : 0;
    s += tube([[-48, -450], [-56 - sp * .3, -230], [-60 - sp, -30]], 70, pants) + tube([[48, -450], [56 + sp * .3, -230], [60 + sp, -30]], 70, pants);
    s += sh(D_.ell(-74 - sp, -14, 62, 30), '#F4F4F4', { c, w: 6 }) + sh(D_.ell(74 + sp, -14, 62, 30), '#F4F4F4', { c, w: 6 }) + sh(D_.rr(-136 - sp, -6, 124, 14, 7), '#C9CED8') + sh(D_.rr(12 + sp, -6, 124, 14, 7), '#C9CED8');
  } else if (lg === 'sit') {
    s += tube([[-48, -450], [-150, -440], [-160, -230]], 70, pants) + tube([[48, -450], [150, -440], [160, -230]], 70, pants);
    s += sh(D_.ell(-176, -214, 62, 30), '#F4F4F4', { c, w: 6 }) + sh(D_.ell(176, -214, 62, 30), '#F4F4F4', { c, w: 6 });
  }
  // руки сзади тела не рисуем отдельно: левая (экранная) рука — до туловища, если кисть за телом
  const arm = (side, P0) => { const sx = side === 'L' ? -1 : 1, sh0 = [sx * 108, -748]; return tube([sh0, P0[0], P0[1]], 54, f) };
  const hand = (P0, side) => sh(D_.circ(P0[1][0], P0[1][1], 27), sk, { c, w: 6 });
  const behind = side => { const P0 = pose[side]; return Math.abs(P0[1][0]) < 100 && P0[1][1] > -720 && P0[1][1] < -470 };
  // туловище (худи)
  const torso = 'M-118 -760C-140 -700 -132 -560 -116 -452Q0 -432 116 -452C132 -560 140 -700 118 -760C80 -790 -80 -790 -118 -760Z';
  s += sh(torso, f, { c, w: 6 }) + sh('M40 -786C90 -780 118 -770 118 -760C140 -700 132 -560 116 -452Q70 -444 40 -440Z', f2);
  s += sh('M-74 -560Q0 -574 74 -560L84 -480Q0 -470 -84 -480Z', f2, { c, w: 5 }) + line('M-46 -520H46', 1, { c, w: 4, op: .5 });
  // капюшон-воротник и шнурки
  s += sh('M-86 -786C-70 -720 70 -720 86 -786C60 -800 -60 -800 -86 -786Z', f2, { c, w: 5 });
  s += line('M-22 -742L-28 -660M22 -742L28 -660', 1, { c, w: 4 }) + sh(D_.circ(-28, -652, 7), '#F4F4F4', { c, w: 3 }) + sh(D_.circ(28, -652, 7), '#F4F4F4', { c, w: 3 });
  for (const sd of ['L', 'R']) { s += arm(sd, pose[sd]); if (!o.hideHands) s += hand(pose[sd], sd) }
  if (o.item === 'vape') { const h0 = pose.R[1]; s += g(vape(t, { c, s: 1, label: false, fruit: false, f: o.vf || '#FFB238', f2: o.vf2 || '#E8901F' }), at(h0[0] + 6, h0[1] - 40, .27, o.itemR ?? 10)) + sh(D_.circ(h0[0], h0[1], 27), sk, { c, w: 6 }) }
  if (o.item === 'phone') { const h0 = pose.R[1]; s += g(sh(D_.rr(-40, -78, 80, 156, 14), '#22283A', { c, w: 5 }) + sh(D_.rr(-30, -66, 60, 120, 8), '#5B8DEF'), at(h0[0], h0[1] - 50, 1, 8)) + sh(D_.circ(h0[0], h0[1], 27), sk, { c, w: 6 }) }
  // шея и голова
  const hr = o.headR || 0, hy = o.headY || 0;
  let hd = sh(D_.rr(-26, -820, 52, 70, 18), sk2, { c, w: 5 });
  hd += sh(D_.ell(-74, -872, 18, 26), sk, { c, w: 5 }) + sh(D_.ell(74, -872, 18, 26), sk, { c, w: 5 });
  hd += sh(D_.ell(0, -878, 76, 88), sk, { c, w: 6 });
  hd += sh('M-76 -878C-80 -800 -20 -786 0 -790C-30 -800 -58 -830 -60 -880Z', sk2, { op: .55 });
  // волосы: шапка с чёлкой
  const hs = o.hair || 'fringe';
  if (hs === 'fringe') hd += sh('M-82 -880C-96 -990 96 -1000 82 -884C74 -904 64 -912 52 -912L44 -896L30 -916L14 -898L0 -920L-16 -900L-34 -918L-46 -898L-60 -912C-70 -906 -76 -896 -82 -880Z', hc, { c, w: 5 });
  else if (hs === 'buzz') hd += sh('M-78 -896C-82 -982 82 -982 78 -896C60 -930 -60 -930 -78 -896Z', hc, { c, w: 5 });
  else if (hs === 'curly') { let q = ''; for (let i = 0; i < 8; i++) { const a = (195 + i * 21) * Math.PI / 180; q += D_.circ(Math.cos(a) * 70, -900 + Math.sin(a) * 74, 30) } hd += sh(q, hc, { c, w: 4 }) }
  else if (hs === 'cap') hd += sh('M-84 -900C-84 -990 84 -990 84 -900Z', o.capC || '#E2574C', { c, w: 5 }) + sh('M-10 -906H150Q150 -884 120 -880H-10Z', o.capC || '#E2574C', { c, w: 5 });
  // лицо
  const lk = (o.look || 0) * 10, bl = m === 'sleep' ? 1 : (o.blink ?? blink(t, o.seed || 3)), ey = -884;
  const br = o.brows ?? ({ angry: -1, tired: .5, sad: .7, o: 1, cough: .8 }[m] || 0);
  for (const sx of [-1, 1]) {
    const ex = sx * 30 + lk;
    if (m === 'laugh' || m === 'smileC') hd += line(`M${ex - 12} ${ey + 4}Q${ex} ${ey - 10} ${ex + 12} ${ey + 4}`, 1, { c, w: 5 });
    else if (bl > .6 || m === 'cough') hd += line(`M${ex - 12} ${ey}Q${ex} ${ey + 8} ${ex + 12} ${ey}`, 1, { c, w: 5 });
    else hd += `<ellipse cx="${R(ex)}" cy="${ey}" rx="${m === 'o' ? 11 : 9}" ry="${R((m === 'o' ? 14 : 11) * (1 - bl))}" fill="${c}"/><circle cx="${R(ex + 3)}" cy="${ey - 4}" r="3" fill="#fff"/>`;
    const by = ey - 30 - br * 6, tl = br < 0 ? sx * 9 : br > 0 ? -sx * 8 : 0;
    hd += line(`M${R(ex - 16)} ${R(by - tl)}L${R(ex + 16)} ${R(by + tl)}`, 1, { c, w: 6 });
    if (o.bags) hd += line(`M${ex - 12} ${ey + 16}Q${ex} ${ey + 24} ${ex + 12} ${ey + 16}`, 1, { c: '#8E5B9E', w: 4, op: o.bags });
  }
  hd += line(`M${3 + lk * .5} -868Q${10 + lk * .5} -850 ${0 + lk * .5} -846`, 1, { c: sk2, w: 5 });
  const mx = lk * .4, tk = clamp(o.talk || 0);
  if (m === 'laugh') hd += sh(`M${mx - 24} -830Q${mx} -790 ${mx + 24} -830Z`, c) + sh(`M${mx - 14} -812Q${mx} -800 ${mx + 14} -812Z`, '#E2574C');
  else if (m === 'smile' || m === 'smileC') hd += line(`M${mx - 18} -828Q${mx} -812 ${mx + 18} -828`, 1, { c, w: 5 });
  else if (m === 'smirk') hd += line(`M${mx - 16} -824Q${mx + 4} -816 ${mx + 20} -834`, 1, { c, w: 5 });
  else if (m === 'sad' || m === 'tired') hd += line(`M${mx - 16} -818Q${mx} -830 ${mx + 16} -818`, 1, { c, w: 5 });
  else if (m === 'angry') hd += line(`M${mx - 18} -822L${mx + 18} -822`, 1, { c, w: 6 }) + line(`M${mx - 18} -822Q${mx - 9} -828 ${mx} -822T${mx + 18} -822`, 1, { c, w: 5 });
  else if (m === 'o' || m === 'cough' || tk > .05) hd += sh(D_.ell(mx, -824, m === 'cough' ? 15 : 11, m === 'cough' ? 13 : 4 + tk * 10), c);
  else if (m !== 'sleep') hd += line(`M${mx - 12} -824L${mx + 12} -824`, 1, { c, w: 5 });
  else hd += line(`M${mx - 10} -824Q${mx} -818 ${mx + 10} -824`, 1, { c, w: 4 });
  if (o.sweat) hd += g(sh(D_.drop(0, 0, 16), '#9AD3F5', { c, w: 4 }), at(70, -960 + (o.sweat * 50) % 50), 1);
  if (o.headExtra) hd += o.headExtra;
  s += g(hd, `translate(0 ${R(hy)}) rotate(${R(hr)} 0 -800)`);
  if (o.front) s += o.front;
  return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0) + (o.flip ? ' scale(-1 1)' : ''), o.op ?? 1)
}
// табличка-таймер: label сверху мелко, value крупно
function timerPlate(x, y, label, value, o = {}) {
  const c = o.c ?? P.ink, col = o.col || '#FFD23F', s0 = o.vs || 96, w0 = Math.max(o.minW || 0, tw(value, { f: 'O', w: 700, s: s0 }) + 120, tw(label, { f: 'M', w: 800, s: 26, ls: 4 }) + 80), h0 = s0 * 1.75;
  let s = sh(D_.rr(-w0 / 2, -h0 / 2, w0, h0, 30), o.f || '#0A1224', { c: col, w: 6 }) + sh('M-18 ' + (h0 / 2 - 2) + 'L0 ' + (h0 / 2 + 26) + 'L18 ' + (h0 / 2 - 2) + 'Z', o.f || '#0A1224');
  s += line('M-18 ' + (h0 / 2) + 'L0 ' + (h0 / 2 + 26) + 'L18 ' + (h0 / 2), 1, { c: col, w: 6 }) + cap(label, 0, -h0 / 2 + 46, { c: o.lc || '#A9B6D6', s: 24, ls: 4 });
  if (value === '∞') { const q = s0 * .5, yy = h0 / 2 - s0 * .66; s += `<path d="M0 ${R(yy)}C${R(-q * .5)} ${R(yy - q * .7)} ${R(-q * 1.4)} ${R(yy - q * .7)} ${R(-q * 1.4)} ${R(yy)}S${R(-q * .5)} ${R(yy + q * .7)} 0 ${R(yy)}S${R(q * 1.4)} ${R(yy - q * .7)} ${R(q * 1.4)} ${R(yy)}S${R(q * .5)} ${R(yy + q * .7)} 0 ${R(yy)}Z" fill="none" stroke="${col}" stroke-width="${R(s0 * .13)}" stroke-linejoin="round"/>` }
  else s += tx(value, 0, h0 / 2 - s0 * .38, { f: 'O', w: 700, s: s0, c: col });
  return g(s, at(x, y, o.s || 1, o.rot || 0), o.op ?? 1)
}
