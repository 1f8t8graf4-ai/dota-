// shorts/lib.js — движок и рисовка v2 (как «Что вы знаете о Coca-Cola / Google / Apple»):
//   палитра из 3–5 цветов, линия поверх сдвинутой заливки (печать «мимо»), растр точками вместо теней,
//   линии рисуются, один предмет перетекает в другой (morph), камера не стоит, текста на экране мало.
'use strict';
const NS = 'http://www.w3.org/2000/svg', W = 1080, H = 1920;
let P = {}, LANG = 'en', UID = 0;
const L = (en, ru) => LANG === 'ru' && ru != null ? ru : en;
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, k) => a + (b - a) * k;
const R = n => Math.round(n * 10) / 10;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const uid = () => 'u' + (++UID);
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) };
const EZ = {
  l: k => k, i: k => k * k * k, o: k => 1 - Math.pow(1 - k, 3),
  io: k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2,
  o5: k => 1 - Math.pow(1 - k, 5), io5: k => k < .5 ? 16 * k ** 5 : 1 - Math.pow(-2 * k + 2, 5) / 2,
  back: k => { const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2) },
  el: k => k <= 0 ? 0 : k >= 1 ? 1 : Math.pow(2, -10 * k) * Math.sin((k * 10 - .75) * 2 * Math.PI / 3) + 1,
};
const P01 = (t, a, d) => clamp((t - a) / (d || 1e-6));
const E = (t, a, d, f = 'io') => EZ[f](P01(t, a, d));
// «живое» покачивание
const wob = (t, sp = 1, am = 1, ph = 0) => Math.sin(t * sp * 2 * Math.PI + ph) * am;

// ---------- пути: длина, точки, перетекание ----------
let _sv, _pp; const _L = new Map(), _Pt = new Map(), _M = new Map(), _BB = new Map();
function _path(d) {
  if (!_sv) { _sv = document.createElementNS(NS, 'svg'); _sv.style.cssText = 'position:absolute;left:-9999px;width:10px;height:10px'; document.body.appendChild(_sv); _pp = document.createElementNS(NS, 'path'); _sv.appendChild(_pp) }
  _pp.setAttribute('d', d); return _pp
}
function plen(d) { let v = _L.get(d); if (v == null) { v = _path(d).getTotalLength(); _L.set(d, v) } return v }
function bbox(d) { let v = _BB.get(d); if (!v) { const b = _path(d).getBBox(); v = [b.x, b.y, b.width, b.height]; _BB.set(d, v) } return v }
function pts(d, n = 180) {
  const key = n + '|' + d; let v = _Pt.get(key);
  if (!v) { const p = _path(d), L0 = p.getTotalLength(); v = []; for (let i = 0; i < n; i++) { const q = p.getPointAtLength(L0 * i / n); v.push([q.x, q.y]) } _Pt.set(key, v) }
  return v
}
function morph(a, b, k, n = 180) {
  if (k <= 0) return a; if (k >= 1) return b;
  const key = n + a + '>' + b; let m = _M.get(key);
  if (!m) {
    const A = pts(a, n), B0 = pts(b, n); let best = 1e18, bo = 0, br = false;
    for (const rev of [false, true]) {
      const B = rev ? [...B0].reverse() : B0;
      for (let o = 0; o < n; o += 2) { let s = 0; for (let i = 0; i < n; i += 3) { const q = B[(i + o) % n], dx = A[i][0] - q[0], dy = A[i][1] - q[1]; s += dx * dx + dy * dy } if (s < best) { best = s; bo = o; br = rev } }
    }
    const B = br ? [...B0].reverse() : B0; m = { A, B: A.map((_, i) => B[(i + bo) % n]) }; _M.set(key, m)
  }
  let s = 'M';
  for (let i = 0; i < n; i++) s += R(lerp(m.A[i][0], m.B[i][0], k)) + ' ' + R(lerp(m.A[i][1], m.B[i][1], k)) + (i < n - 1 ? 'L' : 'Z');
  return s
}

// ---------- формы (возвращают d) ----------
const D_ = {
  circ: (cx, cy, r) => `M${R(cx - r)} ${R(cy)}A${R(r)} ${R(r)} 0 1 0 ${R(cx + r)} ${R(cy)}A${R(r)} ${R(r)} 0 1 0 ${R(cx - r)} ${R(cy)}Z`,
  ell: (cx, cy, rx, ry) => `M${R(cx - rx)} ${R(cy)}A${R(rx)} ${R(ry)} 0 1 0 ${R(cx + rx)} ${R(cy)}A${R(rx)} ${R(ry)} 0 1 0 ${R(cx - rx)} ${R(cy)}Z`,
  rr: (x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); return `M${R(x + r)} ${R(y)}H${R(x + w - r)}A${R(r)} ${R(r)} 0 0 1 ${R(x + w)} ${R(y + r)}V${R(y + h - r)}A${R(r)} ${R(r)} 0 0 1 ${R(x + w - r)} ${R(y + h)}H${R(x + r)}A${R(r)} ${R(r)} 0 0 1 ${R(x)} ${R(y + h - r)}V${R(y + r)}A${R(r)} ${R(r)} 0 0 1 ${R(x + r)} ${R(y)}Z` },
  poly: (p, close = true) => 'M' + p.map(q => R(q[0]) + ' ' + R(q[1])).join('L') + (close ? 'Z' : ''),
  star: (cx, cy, r1, r2, n = 5, rot = -90) => D_.poly([...Array(n * 2)].map((_, i) => { const a = (rot + i * 180 / n) * Math.PI / 180, r = i % 2 ? r2 : r1; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] })),
  heart: (cx, cy, s) => `M${R(cx)} ${R(cy + s * .95)}C${R(cx - s * .2)} ${R(cy + s * .72)} ${R(cx - s * 1.05)} ${R(cy + s * .28)} ${R(cx - s * 1.0)} ${R(cy - s * .3)}C${R(cx - s * .95)} ${R(cy - s * .85)} ${R(cx - s * .25)} ${R(cy - s * .95)} ${R(cx)} ${R(cy - s * .48)}C${R(cx + s * .25)} ${R(cy - s * .95)} ${R(cx + s * .95)} ${R(cy - s * .85)} ${R(cx + s * 1.0)} ${R(cy - s * .3)}C${R(cx + s * 1.05)} ${R(cy + s * .28)} ${R(cx + s * .2)} ${R(cy + s * .72)} ${R(cx)} ${R(cy + s * .95)}Z`,
  drop: (cx, cy, s) => `M${R(cx)} ${R(cy - s)}C${R(cx + s * .35)} ${R(cy - s * .45)} ${R(cx + s * .62)} ${R(cy - s * .05)} ${R(cx + s * .62)} ${R(cy + s * .3)}A${R(s * .62)} ${R(s * .62)} 0 1 1 ${R(cx - s * .62)} ${R(cy + s * .3)}C${R(cx - s * .62)} ${R(cy - s * .05)} ${R(cx - s * .35)} ${R(cy - s * .45)} ${R(cx)} ${R(cy - s)}Z`,
  // лист: от основания (x,y) по углу a, длина len, ширина w
  leaf: (x, y, len, w, a = -90, bend = .15) => {
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180), px = -s, py = c;
    const tx = x + c * len, ty = y + s * len, m1 = [x + c * len * .35 + px * w, y + s * len * .35 + py * w], m2 = [x + c * len * .45 - px * w * (1 - bend), y + s * len * .45 - py * w * (1 - bend)];
    return `M${R(x)} ${R(y)}C${R(m1[0])} ${R(m1[1])} ${R(tx + px * w * .25)} ${R(ty + py * w * .25)} ${R(tx)} ${R(ty)}C${R(tx - px * w * .25)} ${R(ty - py * w * .25)} ${R(m2[0])} ${R(m2[1])} ${R(x)} ${R(y)}Z`
  },
  arc: (cx, cy, r, a0, a1) => { const p = a => [cx + Math.cos(a * Math.PI / 180) * r, cy + Math.sin(a * Math.PI / 180) * r], s = p(a0), e = p(a1); return `M${R(s[0])} ${R(s[1])}A${R(r)} ${R(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${R(e[0])} ${R(e[1])}` },
  wave: (x0, x1, y, amp, len, ph = 0, step = 8) => { let s = ''; for (let x = x0; x <= x1 + .1; x += step) s += (s ? 'L' : 'M') + R(x) + ' ' + R(y + Math.sin((x / len) * 2 * Math.PI + ph) * amp); return s },
};

// ---------- стиль ----------
// ink: заливка сдвинута (как печать мимо приводки), поверх — линия. k — сколько линии нарисовано, fk — проявление заливки
function ink(d, o = {}) {
  const dx = o.dx ?? 10, dy = o.dy ?? 8, k = o.k ?? 1, fk = o.fk ?? 1, op = o.op ?? 1;
  let s = '';
  if (o.sh) s += `<path d="${d}" fill="${o.sh}" transform="translate(${dx * 2.4} ${dy * 2.4})" opacity="${R(fk * op * (o.sho ?? .5) * 100) / 100}"/>`;
  if (o.f && fk > 0) s += `<path d="${d}" fill="${o.f}" transform="translate(${dx} ${dy})"${fk * op < 1 ? ` opacity="${R(fk * op * 100) / 100}"` : ''}/>`;
  if (o.c !== null && k > 0) s += line(d, k, { c: o.c || P.line, w: o.w ?? 7, op });
  return s
}
// заливка без сдвига (плашка/тень)
const fill = (d, c, op = 1, extra = '') => `<path d="${d}" fill="${c}"${op < 1 ? ` opacity="${R(op * 100) / 100}"` : ''} ${extra}/>`;
function line(d, k = 1, o = {}) {
  if (k <= 0) return '';
  const st = `fill="none" stroke="${o.c || P.line}" stroke-width="${o.w ?? 7}" stroke-linecap="round" stroke-linejoin="round"${(o.op ?? 1) < 1 ? ` opacity="${R((o.op ?? 1) * 100) / 100}"` : ''}${o.da ? ` stroke-dasharray="${o.da}"` : ''}`;
  if (k >= 1) return `<path d="${d}" ${st}/>`;
  const L0 = plen(d) + 2;
  return `<path d="${d}" ${st} stroke-dasharray="${R(L0)} ${R(L0)}" stroke-dashoffset="${R(L0 * (1 - k))}"/>`
}
// растр: точки уменьшаются от (x0,y0) к (x1,y1); только внутри формы d
function dots(d, o = {}) {
  const id = uid(), st = o.step || 15, rm = o.r ?? st * .42, bb = o.bb || bbox(d);
  const x0 = o.x0 ?? bb[0], y0 = o.y0 ?? bb[1] + bb[3], x1 = o.x1 ?? bb[0] + bb[2], y1 = o.y1 ?? bb[1];
  const vx = x1 - x0, vy = y1 - y0, vl = vx * vx + vy * vy || 1;
  let s = `<clipPath id="${id}"><path d="${d}"${o.tr ? ` transform="${o.tr}"` : ''}/></clipPath><g clip-path="url(#${id})" fill="${o.c || P.ink}"${o.op != null ? ` opacity="${o.op}"` : ''}>`;
  let row = 0;
  for (let y = bb[1] - st; y < bb[1] + bb[3] + st; y += st * .866, row++) for (let x = bb[0] - st + (row % 2 ? st / 2 : 0); x < bb[0] + bb[2] + st; x += st) {
    const k = clamp(((x - x0) * vx + (y - y0) * vy) / vl), r = rm * (1 - k) * (o.k ?? 1);
    if (r > .7) s += `<circle cx="${R(x)}" cy="${R(y)}" r="${R(r)}"/>`
  }
  return s + '</g>'
}
// блики-чёрточки
const shine = (x, y, len, a = -70, w = 7, c = P.paper, op = .9) => { const c0 = Math.cos(a * Math.PI / 180), s0 = Math.sin(a * Math.PI / 180); return `<path d="M${R(x)} ${R(y)}L${R(x + c0 * len)} ${R(y + s0 * len)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>` };
const bg = (c) => `<rect width="${W}" height="${H}" fill="${c || P.bg}"/>`;
const g = (inner, tr = '', op = 1, extra = '') => `<g${tr ? ` transform="${tr}"` : ''}${op < 1 ? ` opacity="${R(Math.max(0, op) * 100) / 100}"` : ''} ${extra}>${inner}</g>`;
const at = (x, y, s = 1, r = 0) => `translate(${R(x)} ${R(y)})${r ? ` rotate(${R(r)})` : ''}${s !== 1 ? ` scale(${Math.round(s * 1000) / 1000})` : ''}`;
// масштаб вокруг точки
const about = (x, y, s, r = 0) => `translate(${R(x)} ${R(y)})${r ? ` rotate(${R(r)})` : ''} scale(${Math.round(s * 1000) / 1000}) translate(${R(-x)} ${R(-y)})`;

// ---------- текст ----------
let _cx;
function tw(s, o = {}) {
  if (!_cx) _cx = document.createElement('canvas').getContext('2d');
  _cx.font = `${o.w || 800} ${o.s || 60}px ${o.f || 'M'}`;
  return _cx.measureText(s).width + (o.ls || 0) * (s.length - 1)
}
function tx(s, x, y, o = {}) {
  return `<text x="${R(x)}" y="${R(y)}" font-family="${o.f || 'M'}" font-weight="${o.w || 800}" font-size="${o.s || 60}" fill="${o.c || P.paper}" text-anchor="${o.a || 'middle'}"${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.op != null && o.op < 1 ? ` opacity="${R(Math.max(0, o.op) * 100) / 100}"` : ''}${o.tr ? ` transform="${o.tr}"` : ''}${o.st ? ` stroke="${o.st}" stroke-width="${o.sw || 8}" paint-order="stroke" stroke-linejoin="round"` : ''}>${esc(s)}</text>`
}
// маленькая разреженная подпись капсом (как «ЧТО ВЫ ЗНАЕТЕ О»)
const cap = (s, x, y, o = {}) => tx(s.toUpperCase(), x, y, { f: 'M', w: 600, s: 30, ls: 7, ...o });
// слова выезжают снизу из-под маски
function rise(s, x, y, t, t0, o = {}) {
  const words = String(s).split(' '), sz = o.s || 60, sp = tw(' ', o) * .9, ws = words.map(w => tw(w, o));
  const total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  let cx = o.a === 'start' ? x : o.a === 'end' ? x - total : x - total / 2;
  const id = uid();
  let s2 = `<clipPath id="${id}"><rect x="${R(cx - 30)}" y="${R(y - sz * 1.1)}" width="${R(total + 60)}" height="${R(sz * 1.5)}"/></clipPath><g clip-path="url(#${id})">`;
  words.forEach((w, i) => { const k = E(t, t0 + i * (o.stag ?? .07), o.dur ?? .55, 'o5'); if (k > 0) s2 += tx(w, cx, y + (1 - k) * sz * 1.25, { ...o, a: 'start' }); cx += ws[i] + sp });
  return s2 + '</g>'
}
// табло: цифры прокручиваются (val — число, можно дробное)
function odo(val, x, y, o = {}) {
  const sz = o.s || 120, f = o.f || 'O', wgt = o.w || 700, c = o.c || P.paper;
  const v = Math.max(0, val), str = Math.floor(v).toLocaleString('en-US').replace(/,/g, o.sep ?? ',');
  const dw = tw('0', { f, w: wgt, s: sz }) * 1.02, cw = tw(o.sep ?? ',', { f, w: wgt, s: sz });
  const ndig = str.replace(/\D/g, '').length; let tot = 0; for (const ch of str) tot += /\d/.test(ch) ? dw : cw;
  const pre = o.pre || '', post = o.post || '', pw = pre ? tw(pre, { f, w: wgt, s: sz }) : 0, qw = post ? tw(post, { f, w: wgt, s: sz * (o.ps || 1) }) : 0;
  let cx = (o.a === 'start' ? x : o.a === 'end' ? x - tot - pw - qw : x - (tot + pw + qw) / 2);
  const id = uid(); let s = '';
  if (pre) { s += tx(pre, cx, y, { f, w: wgt, s: sz, c, a: 'start' }); cx += pw }
  s += `<clipPath id="${id}"><rect x="${R(cx - 10)}" y="${R(y - sz * .98)}" width="${R(tot + 20)}" height="${R(sz * 1.18)}"/></clipPath><g clip-path="url(#${id})">`;
  let di = 0;
  for (const ch of str) {
    if (!/\d/.test(ch)) { s += tx(ch, cx, y, { f, w: wgt, s: sz, c, a: 'start' }); cx += cw; continue }
    const p = ndig - 1 - di++, pow = Math.pow(10, p), base = Math.floor(v / pow) % 10;
    const rem = v % pow, roll = p === 0 ? v % 1 : clamp((rem - (pow - 1))); const fr = EZ.io(roll);
    const lh = sz * 1.08;
    s += tx(String(base), cx + dw / 2, y - fr * lh, { f, w: wgt, s: sz, c }) + (fr > 0 ? tx(String((base + 1) % 10), cx + dw / 2, y + (1 - fr) * lh, { f, w: wgt, s: sz, c }) : '');
    cx += dw
  }
  s += '</g>';
  if (post) s += tx(post, cx + 6, y, { f, w: wgt, s: sz * (o.ps || 1), c, a: 'start' });
  return s
}

// ---------- эффекты ----------
// лучики-вспышка вокруг точки
function burst(cx, cy, t, t0, o = {}) {
  const k = P01(t, t0, o.d ?? .55); if (k <= 0 || k >= 1) return '';
  const n = o.n || 10, r0 = o.r0 || 60, r1 = o.r1 || 150; let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n * 360 + (o.rot || 0)) * Math.PI / 180, a0 = r0 + (r1 - r0) * EZ.o(k), a1 = a0 + (o.len || 46) * (1 - k);
    s += `<path d="M${R(cx + Math.cos(a) * a0)} ${R(cy + Math.sin(a) * a0)}L${R(cx + Math.cos(a) * a1)} ${R(cy + Math.sin(a) * a1)}" stroke="${o.c || P.a1}" stroke-width="${o.w || 8}" stroke-linecap="round"/>`
  }
  return s
}
// кольцо-волна
const ringWave = (cx, cy, t, t0, o = {}) => { const k = P01(t, t0, o.d ?? .8); if (k <= 0 || k >= 1) return ''; return `<circle cx="${cx}" cy="${cy}" r="${R(lerp(o.r0 || 40, o.r1 || 400, EZ.o(k)))}" fill="none" stroke="${o.c || P.paper}" stroke-width="${R((o.w || 8) * (1 - k))}" opacity="${R((1 - k) * 100) / 100}"/>` };
// штамп
function stamp(s, x, y, t, t0, o = {}) {
  const k = P01(t, t0, .38); if (k <= 0) return '';
  const sc = lerp(1.9, 1, EZ.back(k)), op = clamp(k * 3), sz = o.s || 86, w0 = tw(s, { f: o.f || 'O', w: 700, s: sz, ls: o.ls ?? 4 }) + 70, h0 = sz * 1.32, c = o.c || P.a2;
  const box = D_.rr(-w0 / 2, -h0 / 2, w0, h0, 14);
  return g(`<path d="${box}" fill="none" stroke="${c}" stroke-width="9"/><path d="${D_.rr(-w0 / 2 + 13, -h0 / 2 + 13, w0 - 26, h0 - 26, 8)}" fill="none" stroke="${c}" stroke-width="3"/>` + tx(s, 0, sz * .36, { f: o.f || 'O', w: 700, s: sz, c, ls: o.ls ?? 4 }), at(x, y, sc, o.r ?? -8), op)
}
// точки-пунктир по пути (орбиты, маршруты)
function dotted(d, k = 1, c = P.paper, w = 6, gap = 18) { if (k <= 0) return ''; const L0 = plen(d), n = Math.max(1, Math.floor(L0 * k / gap)); const da = k >= 1 ? `0 ${gap}` : Array(n).fill(`0 ${gap}`).join(' ') + ` 0 ${R(L0 * 2)}`; return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${da}"/>` }

// ---------- переходы между сценами ----------
const TRD = { push: .6, up: .6, down: .6, right: .6, zoom: .55, iris: .65, wipe: .6, fade: .45, cut: 0, flash: .35 };
function transition(kind, k, A, B, SA, SB) {
  const e = EZ.io5(k);
  const dip = 1 - Math.sin(k * Math.PI) * .06; // камера чуть отъезжает в середине
  const fx = (EP.trAt && EP.trAt[SA.key]) || [540, 800];
  if (kind === 'push' || kind === 'right' || kind === 'up' || kind === 'down') {
    const dir = kind === 'push' ? [-1, 0] : kind === 'right' ? [1, 0] : kind === 'up' ? [0, -1] : [0, 1];
    const dx = dir[0] * W * e, dy = dir[1] * H * .62 * e, ox = -dir[0] * W * (1 - e), oy = -dir[1] * H * .62 * (1 - e);
    const z = about(540, 960, dip);
    return g(g(A, `translate(${R(dx)} ${R(dy)})`) + g(B, `translate(${R(ox)} ${R(oy)})`), z)
  }
  if (kind === 'zoom') return g(A, about(fx[0], fx[1], 1 + e * 2.6), 1 - clamp(k * 1.6)) + g(B, about(540, 900, lerp(.82, 1, e)), clamp((k - .25) * 2));
  if (kind === 'iris') {
    const id = uid(), r = lerp(0, 1500, EZ.i(k) * .4 + e * .6);
    return A + `<clipPath id="${id}"><circle cx="${fx[0]}" cy="${fx[1]}" r="${R(r)}"/></clipPath><g clip-path="url(#${id})">${B}</g><circle cx="${fx[0]}" cy="${fx[1]}" r="${R(r)}" fill="none" stroke="${(EP.trCol && EP.trCol[SA.key]) || P.a1}" stroke-width="${R(26 * (1 - k))}"/>`
  }
  if (kind === 'wipe') {
    const id = uid(), x = lerp(-700, 1780, e), band = (x0) => D_.poly([[x0 - 600, -200], [x0 + 400, -200], [x0 - 200, 2120], [x0 - 1200, 2120]]);
    return A + `<clipPath id="${id}"><path d="${D_.poly([[-1400, -200], [x - 200, -200], [x - 800, 2120], [-1400, 2120]])}"/></clipPath><g clip-path="url(#${id})">${B}</g>` + fill(D_.poly([[x - 200, -200], [x - 60, -200], [x - 660, 2120], [x - 800, 2120]]), (EP.trCol && EP.trCol[SA.key]) || P.a1)
  }
  if (kind === 'flash') return (k < .5 ? A : B) + `<rect width="${W}" height="${H}" fill="${P.paper}" opacity="${R((1 - Math.abs(k - .5) * 2) * 90) / 100}"/>`;
  return g(A, '', 1 - k) + g(B, '', k)
}
function DEFS() { return (EP && EP.defs ? EP.defs() : '') }

// ---------- общие предметы ----------
// рука-«варежка» (Apple-стиль): x,y — запястье, a — угол (0 — пальцами вправо)
function hand(x, y, a = 0, o = {}) {
  const sk = o.f || P.skin || '#E8B48C', c = o.c || P.line, s = o.s || 1;
  const palm = D_.rr(0, -46, 120, 92, 40), thumb = 'M30 -40C40 -92 92 -98 96 -64C98 -48 78 -40 62 -36Z';
  const fing = o.point ? 'M100 -30C150 -36 196 -30 200 -16C204 -2 150 0 104 -2Z' : '';
  let s2 = '';
  if (o.sleeve) s2 += ink(D_.rr(-150, -56, 162, 112, 26), { f: o.sleeve, c, w: 7 });
  s2 += ink(palm, { f: sk, c, w: 7 }) + (fing ? ink(fing, { f: sk, c, w: 7 }) : '') + ink(thumb, { f: sk, c, w: 7 });
  if (!o.point) s2 += line('M118 -18L84 -18M118 6L86 6M114 28L84 28', 1, { c, w: 5, op: .7 });
  return g(s2, at(x, y, s, a))
}
// фигура человека: тела-«трубки», взрослые пропорции. o: x,y (стопы), s, pose {la,ra (руки), ll,rl}, hood, hair, f (цвет одежды)
function person(x, y, o = {}) {
  const s = o.s || 1, cl = o.f || P.a1, sk = o.skin || P.skin || '#E8B48C', c = o.c || P.line, pants = o.pants || P.ink, hair = o.hairC || '#3B2A20';
  const p = Object.assign({ la: 12, lf: 8, ra: -12, rf: -8, ll: 4, rl: -4 }, o.pose || {});
  const tube = (pts0, w0, col) => { const d = D_.poly(pts0, false); return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w0 + 14}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w0}" stroke-linecap="round" stroke-linejoin="round" transform="translate(5 4)"/>` };
  const limb = (x0, y0, a1, a2, l1, l2) => { const r = Math.PI / 180, x1 = x0 + Math.sin(a1 * r) * l1, y1 = y0 + Math.cos(a1 * r) * l1, x2 = x1 + Math.sin(a2 * r) * l2, y2 = y1 + Math.cos(a2 * r) * l2; return [[x0, y0], [x1, y1], [x2, y2]] };
  let s2 = '';
  // ноги
  const L1 = limb(-30, -400, p.ll, p.ll * .6, 200, 190), R1 = limb(30, -400, p.rl, p.rl * .6, 200, 190);
  s2 += tube(L1, 62, pants) + tube(R1, 62, pants);
  s2 += ink(D_.ell(L1[2][0] - 14, L1[2][1] + 8, 52, 24), { f: o.shoe || P.paper, c, w: 6 }) + ink(D_.ell(R1[2][0] + 14, R1[2][1] + 8, 52, 24), { f: o.shoe || P.paper, c, w: 6 });
  // руки (сзади тела — правая)
  const LA = limb(-92, -690, p.la, p.lf, 150, 140), RA = limb(92, -690, p.ra, p.rf, 150, 140);
  // тело (худи)
  const torso = 'M-104 -700C-118 -560 -114 -470 -100 -390L100 -390C114 -470 118 -560 104 -700C70 -730 -70 -730 -104 -700Z';
  s2 += tube(RA, 58, cl);
  s2 += ink(torso, { f: cl, c, w: 7 });
  if (o.hood !== false) s2 += line('M-46 -712C-40 -660 40 -660 46 -712', 1, { c, w: 6 }) + line('M-14 -668L-18 -610M14 -668L18 -610', 1, { c, w: 5, op: .8 });
  s2 += line('M-60 -480C-40 -500 40 -500 60 -480', 1, { c, w: 5, op: .7 });
  s2 += tube(LA, 58, cl);
  s2 += ink(D_.circ(LA[2][0], LA[2][1], 26), { f: sk, c, w: 6 }) + ink(D_.circ(RA[2][0], RA[2][1], 26), { f: sk, c, w: 6 });
  // шея и голова
  const hx = o.look || 0;
  s2 += ink(D_.rr(-22, -760, 44, 60, 14), { f: sk, c, w: 6, dx: 0, dy: 0 });
  s2 += ink(D_.ell(hx, -832, 60, 74), { f: sk, c, w: 7 });
  if (o.hair !== false) s2 += ink(`M${-62 + hx} -836C${-70 + hx} -930 ${70 + hx} -940 ${62 + hx} -842C${46 + hx} -876 ${-10 + hx} -892 ${-40 + hx} -868C${-50 + hx} -858 ${-58 + hx} -846 ${-62 + hx} -836Z`, { f: hair, c, w: 6 });
  if (o.face !== false) {
    const ex = hx * 1.3, mood = o.mood || 'calm';
    s2 += `<circle cx="${-20 + ex}" cy="-828" r="6" fill="${c}"/><circle cx="${20 + ex}" cy="-828" r="6" fill="${c}"/>`;
    if (mood === 'smile') s2 += line(`M${-16 + ex} -796Q${ex} -782 ${16 + ex} -796`, 1, { c, w: 5 });
    else if (mood === 'sad') s2 += line(`M${-14 + ex} -788Q${ex} -798 ${14 + ex} -788`, 1, { c, w: 5 });
    else if (mood === 'o') s2 += `<ellipse cx="${ex}" cy="-792" rx="9" ry="11" fill="${c}"/>`;
    else if (mood === 'tense') s2 += line(`M${-16 + ex} -792L${16 + ex} -792`, 1, { c, w: 5 }) + line(`M${-34 + ex} -850L${-8 + ex} -842M${34 + ex} -850L${8 + ex} -842`, 1, { c, w: 5 });
    else s2 += line(`M${-12 + ex} -792L${12 + ex} -792`, 1, { c, w: 5 });
  }
  if (o.extra) s2 += o.extra;
  return g(s2, at(x, y, s, o.r || 0) + (o.flip ? ' scale(-1 1)' : ''), o.op ?? 1)
}
// телефон
function phone(x, y, o = {}) {
  const w0 = o.w || 300, h0 = w0 * 2.05, c = o.c || P.line;
  let s = ink(D_.rr(-w0 / 2, -h0 / 2, w0, h0, w0 * .14), { f: o.f || P.ink, c, w: 7 });
  const id = uid(), scr = D_.rr(-w0 / 2 + 18, -h0 / 2 + 18, w0 - 36, h0 - 36, w0 * .1);
  s += fill(scr, o.scr || P.bg2 || '#222') + `<clipPath id="${id}"><path d="${scr}"/></clipPath><g clip-path="url(#${id})">${o.content ? o.content(w0 - 36, h0 - 36) : ''}</g>`;
  s += fill(D_.rr(-w0 * .16, -h0 / 2 + 26, w0 * .32, 18, 9), c, .9);
  return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
}
// часы-циферблат
function clock(x, y, r, h, m, o = {}) {
  const c = o.c || P.line; let s = ink(D_.circ(0, 0, r), { f: o.f || P.paper, c, w: 8 });
  for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180, r1 = r * .82, r2 = r * (i % 3 ? .9 : .74); s += `<path d="M${R(Math.sin(a) * r1)} ${R(-Math.cos(a) * r1)}L${R(Math.sin(a) * r2)} ${R(-Math.cos(a) * r2)}" stroke="${o.tick || P.ink}" stroke-width="${i % 3 ? 5 : 9}" stroke-linecap="round"/>` }
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  s += `<path d="M0 0L${R(Math.sin(ha * Math.PI / 180) * r * .5)} ${R(-Math.cos(ha * Math.PI / 180) * r * .5)}" stroke="${o.hand || P.ink}" stroke-width="14" stroke-linecap="round"/>`;
  s += `<path d="M0 0L${R(Math.sin(ma * Math.PI / 180) * r * .74)} ${R(-Math.cos(ma * Math.PI / 180) * r * .74)}" stroke="${o.hand2 || P.a2}" stroke-width="9" stroke-linecap="round"/><circle r="14" fill="${o.hand || P.ink}"/>`;
  return g(s, at(x, y, o.s || 1, o.r || 0))
}
// деньги: купюра
function bill(x, y, o = {}) {
  const w0 = o.w || 300, h0 = w0 * .46, c = o.c || P.line, f0 = o.f || '#5DBB7E';
  let s = ink(D_.rr(-w0 / 2, -h0 / 2, w0, h0, 10), { f: f0, c, w: 6, dx: 7, dy: 6 });
  s += line(D_.rr(-w0 / 2 + 16, -h0 / 2 + 14, w0 - 32, h0 - 28, 6), 1, { c, w: 3, op: .8 }) + ink(D_.ell(0, 0, h0 * .26, h0 * .3), { f: o.f2 || '#3E9A62', c, w: 4, dx: 3, dy: 3 });
  s += tx('$', -w0 / 2 + 34, 12, { f: 'O', s: h0 * .42, c, w: 700 }) + tx('$', w0 / 2 - 34, 12, { f: 'O', s: h0 * .42, c, w: 700 });
  return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
}
// дерево (круглая крона)
function tree(x, y, s = 1, o = {}) {
  const c = o.c || P.line; let q = ink('M-14 0L-10 -120L10 -120L14 0Z', { f: o.trunk || '#8A5A3C', c, w: 6, dx: 5, dy: 4 });
  q += ink(D_.circ(0, -190, 92), { f: o.f || '#4FA36B', c, w: 7 }) + dots(D_.circ(0, -190, 92), { c: o.dc || '#2E6B45', step: 13, x0: 60, y0: -120, x1: -40, y1: -260, op: .9 });
  q += shine(-46, -230, 34, -60, 7, P.paper, .8);
  return g(q, at(x, y, s, o.r || 0), o.op ?? 1)
}
// флаг на древке (полотно колышется)
function flag(x, y, t, o = {}) {
  const c = o.c || P.line, w0 = o.w || 260, h0 = o.h || 170, ph = t * 4;
  const top = [...Array(9)].map((_, i) => [i * w0 / 8, -330 + Math.sin(ph + i * .7) * 10 * i / 8]);
  const bot = [...Array(9)].map((_, i) => [i * w0 / 8, -330 + h0 + Math.sin(ph + i * .7 + .4) * 10 * i / 8]).reverse();
  const d = D_.poly([...top, ...bot]);
  let s = line('M0 0L0 -350', 1, { c, w: 10 }) + ink(d, { f: o.f || P.a2, c, w: 6 }) + (o.emb ? g(o.emb, at(w0 / 2, -330 + h0 / 2 + Math.sin(ph + 2.5) * 5)) : '');
  return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
}
// глобус-сетка
function globe(x, y, r, t, o = {}) {
  const c = o.c || P.line, id = uid(); let s = ink(D_.circ(0, 0, r), { f: o.f || P.a3 || P.bg2, c, w: 8 });
  s += `<clipPath id="${id}"><circle r="${r}"/></clipPath><g clip-path="url(#${id})">`;
  const rot = (t * (o.sp ?? 18)) % 30;
  for (let i = -3; i <= 3; i++) { const a = (i * 30 + rot) * Math.PI / 180; if (Math.abs(Math.sin(a)) > .999) continue; s += `<ellipse rx="${R(Math.abs(Math.sin(a)) * r)}" ry="${r}" fill="none" stroke="${c}" stroke-width="4" opacity=".55"/>` }
  for (let j = -2; j <= 2; j++) s += `<path d="M${-r} ${R(j * r * .36)}L${r} ${R(j * r * .36)}" stroke="${c}" stroke-width="4" opacity=".55"/>`;
  if (o.land) s += o.land;
  s += dots(D_.circ(0, 0, r), { c: o.dc || P.ink, step: 16, x0: -r * .2, y0: -r * .2, x1: r, y1: r, op: .5 });
  s += '</g>' + shine(-r * .55, -r * .45, r * .3, -50, 9, P.paper, .7);
  return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
}
// мозг сбоку (линия)
const BRAIN = 'M-150 30C-190 10 -190 -70 -140 -95C-140 -150 -70 -175 -30 -150C0 -185 80 -180 100 -140C150 -150 195 -95 175 -50C205 -10 180 60 130 60C110 95 50 100 20 80C-20 105 -90 100 -100 60C-130 70 -150 50 -150 30Z';
const BRAIN_IN = 'M-120 -40C-90 -60 -60 -30 -80 -5M-40 -120C-30 -90 -60 -70 -40 -40C-20 -15 10 -40 0 -70M40 -130C60 -100 30 -80 50 -50M100 -100C80 -70 120 -50 110 -20M-110 20C-70 30 -40 0 -10 25C20 50 60 20 80 40M130 -60C100 -40 140 0 120 20';
function brain(x, y, o = {}) {
  const c = o.c || P.line;
  let s = ink(BRAIN, { f: o.f || '#F2A7B5', c, w: 8, k: o.k ?? 1, fk: o.fk ?? 1 }) + line(BRAIN_IN, o.k ?? 1, { c, w: 6, op: .8 });
  if (o.glow) s = `<circle r="${R(240 * o.glow)}" fill="${o.gc || P.a1}" opacity="${R(.25 * o.glow * 100) / 100}"/>` + s;
  return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
}
// голова в профиль (смотрит вправо) — силуэт
const HEAD = 'M-120 160C-150 90 -170 20 -160 -60C-150 -170 -60 -230 40 -220C140 -210 190 -140 190 -50C190 -20 200 0 225 40C232 52 222 62 205 62C200 90 205 110 190 120C180 130 170 140 172 160C175 185 150 200 110 195L70 190L70 260L-120 260Z';
// сердце (орган, упрощённо)
const HEART2 = 'M0 150C-90 100 -170 40 -160 -40C-152 -110 -70 -130 -20 -80C-10 -120 10 -160 40 -150C90 -140 170 -100 160 -20C150 60 80 110 0 150Z';
// капсула
function capsule(x, y, o = {}) {
  const l = o.l || 220, w0 = o.w || 90, c = o.c || P.line;
  let s = ink(D_.rr(-l / 2, -w0 / 2, l, w0, w0 / 2), { f: o.f || P.paper, c, w: 7 }) + ink(`M0 ${-w0 / 2}H${l / 2 - w0 / 2}A${w0 / 2} ${w0 / 2} 0 0 1 ${l / 2 - w0 / 2} ${w0 / 2}H0Z`, { f: o.f2 || P.a1, c: null }) + line(`M0 ${-w0 / 2}V${w0 / 2}`, 1, { c, w: 6 }) + line(D_.rr(-l / 2, -w0 / 2, l, w0, w0 / 2), 1, { c, w: 7 }) + shine(-l / 2 + 34, -w0 / 2 + 22, 50, 0, 7, P.paper, .8);
  return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
}
// документ с строками
function doc(x, y, o = {}) {
  const w0 = o.w || 420, h0 = o.h || 540, c = o.c || P.line;
  let s = ink(D_.rr(-w0 / 2, -h0 / 2, w0, h0, 12), { f: o.f || P.paper, c, w: 7 });
  const n = o.lines ?? 7; for (let i = 0; i < n; i++) { const yy = -h0 / 2 + (o.top || 120) + i * 46, ww = (w0 - 90) * (i === n - 1 ? .55 : .85 + rnd(i + (o.seed || 0)) * .15); s += line(`M${-w0 / 2 + 45} ${yy}H${R(-w0 / 2 + 45 + ww)}`, clamp((o.k ?? 1) * n - i), { c: o.lc || P.ink, w: 8, op: .35 }) }
  if (o.title) s += tx(o.title, 0, -h0 / 2 + 80, { f: 'O', w: 700, s: o.ts || 46, c: o.tc || P.ink, ls: 2 });
  if (o.extra) s += o.extra;
  return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
}
// окно с небом (sky — цвет, inner — что за окном)
function windowF(x, y, o = {}) {
  const w0 = o.w || 380, h0 = o.h || 480, c = o.c || P.line, id = uid(), fr = D_.rr(-w0 / 2, -h0 / 2, w0, h0, 10);
  let s = fill(fr, o.sky || P.bg2) + `<clipPath id="${id}"><path d="${fr}"/></clipPath><g clip-path="url(#${id})">${o.inner || ''}</g>` + line(fr, 1, { c, w: 10 }) + line(`M0 ${-h0 / 2}V${h0 / 2}M${-w0 / 2} 0H${w0 / 2}`, 1, { c, w: 8 });
  return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
}
// кардиограмма
function ecg(x0, x1, y, t, o = {}) {
  const sp = o.sp || 1.2, amp = o.amp || 90, per = o.per || 220; let s = '';
  for (let x = x0; x <= x1; x += 6) {
    const u = ((x - x0) / per - t * sp) % 1, v = u < 0 ? u + 1 : u;
    const yy = v > .42 && v < .46 ? -amp * .25 : v > .46 && v < .5 ? amp : v > .5 && v < .54 ? -amp * .5 : v > .7 && v < .8 ? -amp * .15 * Math.sin((v - .7) * Math.PI / .1) : 0;
    s += (s ? 'L' : 'M') + R(x) + ' ' + R(y - yy)
  }
  return line(s, o.k ?? 1, { c: o.c || P.a2, w: o.w || 8 })
}
// кнопка «Follow / Подписаться»
function follow(x, y, t, t0, o = {}) {
  const k = E(t, t0, .5, 'back'), pr = P01(t, t0 + .9, .25), done = pr > .5, s0 = done ? .94 + .06 * pr : 1;
  const lab = done ? L('Following ✓', 'Вы подписаны ✓') : L('Follow', 'Подписаться'), w0 = tw(lab, { s: 54, w: 800 }) + 110;
  let s = ink(D_.rr(-w0 / 2, -56, w0, 112, 56), { f: done ? P.ink : (o.f || '#FE2C55'), c: P.line, w: 7 }) + tx(lab, 0, 19, { s: 54, w: 800, c: P.paper });
  return g(s, at(x, y, k * s0), clamp(k * 2))
}

// персонаж по плечи (крупно): y — низ плеч. o: s, f (худи), skin, hairC, hair: short|curly|long|buzz, mood: calm|smile|o|sad|tense|sick|grin, look (-1..1),
//   blink (0..1 закрыты), talk (0..1 рот), brows (-1 злые … 1 удивлённые), sweat, extra
function bust(x, y, o = {}) {
  const c = o.c || P.line, f0 = o.f || P.a1, sk = o.skin || P.skin || '#E9B48F', hc = o.hairC || '#3B2A20', lk = (o.look || 0) * 18, mood = o.mood || 'calm';
  let s = '';
  s += ink('M-270 0C-262 -168 -178 -236 -66 -256L66 -256C178 -236 262 -168 270 0Z', { f: f0, c, w: 8 });
  s += dots('M-270 0C-262 -168 -178 -236 -66 -256L66 -256C178 -236 262 -168 270 0Z', { c: P.ink, step: 15, x0: -270, y0: -40, x1: 0, y1: -200, op: .35, bb: [-280, -260, 560, 270] });
  s += line('M-128 -246C-118 -320 118 -320 128 -246', 1, { c, w: 7 }) + line('M-34 -236L-40 -120M34 -236L40 -120', 1, { c, w: 6 }) + `<circle cx="-40" cy="-112" r="9" fill="${c}"/><circle cx="40" cy="-112" r="9" fill="${c}"/>`;
  s += ink(D_.rr(-46, -320, 92, 90, 20), { f: sk, c, w: 7, dx: 0, dy: 0 }) + fill('M-46 -270C-20 -250 20 -250 46 -270V-240H-46Z', P.ink, .25);
  s += ink(D_.ell(-122, -440, 26, 36), { f: sk, c, w: 7, dx: 5, dy: 4 }) + ink(D_.ell(122, -440, 26, 36), { f: sk, c, w: 7, dx: 5, dy: 4 });
  const head = D_.ell(0, -450, 122, 148);
  s += ink(head, { f: sk, c, w: 8 }) + dots(head, { c: '#B9765A', step: 13, x0: 122, y0: -380, x1: 30, y1: -520, op: .45, r: 4.4 });
  const hs = o.hair || 'short';
  if (hs === 'short') s += ink('M-128 -452C-146 -626 146 -640 128 -460C112 -532 52 -566 -6 -548C-58 -536 -104 -506 -128 -452Z', { f: hc, c, w: 7 });
  if (hs === 'curly') { let q = ''; for (let i = 0; i < 9; i++) { const a = (200 + i * 17.5) * Math.PI / 180; q += D_.circ(Math.cos(a) * 118, -470 + Math.sin(a) * 140, 46) } s += fill(q, hc) + line(q, 1, { c, w: 6 }) }
  if (hs === 'buzz') s += ink('M-124 -470C-132 -606 132 -606 124 -470C96 -540 -96 -540 -124 -470Z', { f: hc, c, w: 7 });
  if (hs === 'long') s += ink('M-136 -300C-170 -520 -120 -620 0 -616C120 -620 170 -520 136 -300L104 -300C120 -420 96 -520 0 -540C-96 -520 -120 -420 -104 -300Z', { f: hc, c, w: 7 });
  // лицо
  const bl = clamp(o.blink || 0), ey = -446, br = o.brows ?? (mood === 'tense' ? -1 : mood === 'o' ? 1 : mood === 'sad' || mood === 'sick' ? .6 : 0);
  for (const sx of [-1, 1]) {
    const ex = sx * 46 + lk;
    if (bl > .6 || mood === 'sleep') s += line(`M${ex - 16} ${ey + 2}Q${ex} ${ey + 12} ${ex + 16} ${ey + 2}`, 1, { c: P.ink, w: 6 });
    else s += `<ellipse cx="${R(ex)}" cy="${ey}" rx="${mood === 'o' ? 13 : 11}" ry="${R((mood === 'o' ? 17 : 14) * (1 - bl))}" fill="${P.ink}"/><circle cx="${R(ex + 4)}" cy="${ey - 5}" r="3.5" fill="#fff" opacity=".9"/>`;
    const by = ey - 44 - br * 8, tilt = br < 0 ? sx * 10 : br > 0 && (mood === 'sad' || mood === 'sick') ? -sx * 9 : 0;
    s += line(`M${R(ex - 24)} ${R(by - tilt)}L${R(ex + 24)} ${R(by + tilt)}`, 1, { c: P.ink, w: 8 });
  }
  s += line(`M${4 + lk * .6} -430Q${18 + lk * .6} -392 ${2 + lk * .6} -386`, 1, { c: '#B9765A', w: 6 });
  const mx = lk * .5, tk = clamp(o.talk || 0);
  if (tk > .05 || mood === 'o') s += `<ellipse cx="${R(mx)}" cy="-344" rx="${R(mood === 'o' ? 20 : 22)}" ry="${R(mood === 'o' ? 24 : 6 + tk * 18)}" fill="${P.ink}"/>`;
  else if (mood === 'smile' || mood === 'grin') s += ink(`M${mx - 38} -356Q${mx} ${mood === 'grin' ? -300 : -318} ${mx + 38} -356Z`, { f: mood === 'grin' ? '#fff' : P.ink, c: P.ink, w: 6, dx: 0, dy: 0 });
  else if (mood === 'sad' || mood === 'sick') s += line(`M${mx - 26} -334Q${mx} -352 ${mx + 26} -334`, 1, { c: P.ink, w: 7 });
  else if (mood === 'tense') s += line(`M${mx - 30} -344Q${mx - 15} -350 ${mx} -344T${mx + 30} -344`, 1, { c: P.ink, w: 7 });
  else s += line(`M${mx - 22} -342L${mx + 22} -342`, 1, { c: P.ink, w: 7 });
  if (mood === 'sick') s += fill(head, '#7FB069', .18);
  if (o.sweat) s += g(ink(D_.drop(0, 0, 26), { f: '#9AD3F5', c, w: 5, dx: 3, dy: 3 }), at(108, -520 + (o.sweat * 60) % 60), 1);
  if (o.extra) s += o.extra;
  return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
}

// точки скруглённого прямоугольника (центр 0,0) и перенос/поворот набора точек → d
D_.rrp = (w, h, r, n = 6) => { const p = [], c = [[w / 2 - r, -h / 2 + r, -90], [w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, 90], [-w / 2 + r, -h / 2 + r, 180]]; for (const [x, y, a0] of c) for (let i = 0; i <= n; i++) { const a = (a0 + i * 90 / n) * Math.PI / 180; p.push([x + Math.cos(a) * r, y + Math.sin(a) * r]) } return p };
D_.tf = (p, x, y, a = 0, s = 1) => { const c = Math.cos(a * Math.PI / 180), si = Math.sin(a * Math.PI / 180); return D_.poly(p.map(([u, v]) => [x + (u * c - v * si) * s, y + (u * si + v * c) * s])) };

// картинка-кадр во весь экран (иллюстрация нейросетью 9:16) с медленной камерой: наезд z0→z1 вокруг (fx,fy), сдвиг (x0,y0)→(x1,y1)
function pic(src, t, T, o = {}) {
  const k = EZ.io(P01(t, T.a, T.b - T.a + .6)), z = lerp(o.z0 ?? 1.03, o.z1 ?? 1.13, k);
  const dx = lerp(o.x0 || 0, o.x1 || 0, k), dy = lerp(o.y0 || 0, o.y1 || 0, k);
  return `<rect width="${W}" height="${H}" fill="${o.bg || P.bg}"/><image href="${src}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" transform="translate(${R(dx)} ${R(dy)}) ${about(o.fx ?? 540, o.fy ?? 860, z)}"/>`
}
// затемнение снизу/сверху для читаемости
const shade = (y0, y1, c = '#000', a = .55) => { const id = uid(); return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="1" stop-color="${c}" stop-opacity="${a}"/></linearGradient><rect x="0" y="${y0}" width="${W}" height="${y1 - y0}" fill="url(#${id})"/>` };

// ---------- ролик из картинок по описанию (window.SPEC) ----------
// SPEC = { dir: 'nicotine', pal: {bg, ink, paper, a1, a2, a3}, tr: {...}, trAt: {...},
//   scenes: { key: { img: ['a', 'b'] | 'a', sw: 'слово' (когда сменить картинку), cam: [z0, z1, fx, fy, dx0, dx1, dy0, dy1],
//                    motes: 'цвет', ov: [ {t:'label'|'title'|'big'|'count'|'chip'|'stamp'|'ring'|'flash', …} ] } } }
// у оверлея: cue — слово (когда появиться), n — какое по счёту вхождение, y/x — место, text — строка или {en, ru}
function genEP(SPEC) {
  const C = Object.assign({ bg: '#101820', ink: '#0B1020', paper: '#F3EDE2', line: '#F3EDE2', a1: '#3D8BFF', a2: '#FF4E6A', a3: '#FFC53D' }, SPEC.pal || {});
  const T_ = v => v == null ? '' : typeof v === 'string' || typeof v === 'number' ? String(v) : (LANG === 'ru' && v.ru != null ? v.ru : v.en);
  const src = id => 'img/' + SPEC.dir + '/' + id + '.jpg';
  const motes = (t, col) => { let s = ''; for (let i = 0; i < 16; i++) { const ph = (t * (.04 + rnd(i) * .05) + rnd(i + 3)) % 1, x = 80 + rnd(i + 7) * 920 + Math.sin(t * .7 + i) * 20, y = 1300 - ph * 1100; s += `<circle cx="${R(x)}" cy="${R(y)}" r="${R(2 + rnd(i + 11) * 4)}" fill="${col}" opacity="${R(Math.sin(ph * Math.PI) * 55) / 100}"/>` } return s };
  const D = {};
  for (const [key, sc] of Object.entries(SPEC.scenes)) {
    D[key] = (t, S, T) => {
      const imgs = Array.isArray(sc.img) ? sc.img : [sc.img || key], c = sc.cam || [], cam = { z0: c[0] ?? 1.02, z1: c[1] ?? 1.16, fx: c[2] ?? 540, fy: c[3] ?? 860, x0: c[4] || 0, x1: c[5] || 0, y0: c[6] || 0, y1: c[7] || 0, bg: C.bg };
      let s = pic(src(imgs[0]), t, T, cam);
      for (let i = 1; i < imgs.length; i++) { const sw0 = Array.isArray(sc.sw) ? sc.sw[i - 1] : sc.sw, sw = sw0 && typeof sw0 === 'object' ? T_(sw0) : sw0, ts = sw ? T.c(sw, 0, (T.e - T.v) * i / imgs.length) : T.v + (T.e - T.v) * i / imgs.length; const k = E(t, ts - .35, .7, 'io'); if (k > 0) s += g(pic(src(imgs[i]), t, T, cam), '', k) }
      if (sc.motes) s += motes(t, sc.motes);
      for (const o of sc.ov || []) {
        const t0 = o.at != null ? T.v + o.at : o.cue ? T.c(T_(o.cue), o.n || 0, o.def ?? 0) - .12 : T.v + (o.d ?? 0), y = o.y ?? 330, x = o.x ?? 540, col = C[o.c] || o.c || C.paper;
        if (o.until && t > T.c(T_(o.until), 0, 99) - .1) continue;
        if (o.t === 'label') s += cap(T_(o.text), x, y, { c: col, st: C.ink, s: o.s || 30, op: E(t, t0, .4) });
        else if (o.t === 'title') s += rise(T_(o.text), x, y, t, t0, { f: 'U', w: 800, s: o.s || (LANG === 'ru' ? 84 : 96), c: col, st: C.ink, sw: 16 });
        else if (o.t === 'big') { const k = E(t, t0, .45, 'back'); if (k > 0) s += g(tx(T_(o.text), 0, 0, { f: 'O', s: o.s || 100, w: 700, c: col, st: C.ink, sw: 16 }), at(x, y, k, o.r || 0)) }
        else if (o.t === 'count') { const t1 = o.cue1 ? T.c(T_(o.cue1), 0, 3) : t0 + (o.dur || 1.4), k = E(t, t0, Math.max(.6, t1 - t0), 'o5'), v = lerp(o.from || 0, o.to, k), s0 = o.s || 100, w0 = o.w || 760; if (t > t0 - .2) s += g(fill(D_.rr(x - w0 / 2, y - s0 * .9, w0, s0 * 1.5, s0 * .75), C.ink, .86) + odo(v, x, y + s0 * .32, { s: s0, c: col, pre: o.pre || '', post: o.post || '', sep: o.sep ?? ',' }) + (o.sub ? cap(T_(o.sub), x, y + s0 * .62, { c: C[o.subc] || C.a3, s: 22 }) : ''), '', E(t, t0 - .2, .3)) }
        else if (o.t === 'chip') { const k = E(t, t0, .45, 'back'); if (k > 0) { const str = T_(o.text), s0 = o.s || 58, w0 = tw(str, { f: 'O', w: 700, s: s0 }) + 80; s += g(fill(D_.rr(-w0 / 2, -s0 * .95, w0, s0 * 1.9, s0 * .95), C[o.bgc] || C.a2) + tx(str, 0, s0 * .36, { f: 'O', s: s0, w: 700, c: col }), at(x, y, k, o.r ?? -3)) } }
        else if (o.t === 'stamp') s += stamp(T_(o.text), x, y, t, t0, { c: col === C.paper ? C.a2 : col, s: o.s || 80, r: o.r ?? -10 });
        else if (o.t === 'ring') s += ringWave(x, y, t, t0, { c: col, r1: o.r1 || 600 }) + burst(x, y, t, t0, { c: C.a3, r0: 120, r1: 260 });
        else if (o.t === 'flash') { const k = P01(t, t0, .35); if (k > 0 && k < 1) s += `<rect width="${W}" height="${H}" fill="${col}" opacity="${R((1 - k) * 60) / 100}"/>` }
      }
      return s
    }
  }
  window.EP = { P: C, D, tr: SPEC.tr || {}, trAt: SPEC.trAt || {}, trCol: SPEC.trCol || {}, trDef: SPEC.trDef || 'push', cap: { hi: C.a3, st: C.ink } };
  P = C;
}
