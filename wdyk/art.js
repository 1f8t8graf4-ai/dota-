// Общая графика «What do you know about…»: утилиты, анимация появления, человечек, предметы.
// Всё — функции, которые возвращают кусок SVG. Без id внутри (кроме DEFS), чтобы две сцены жили в кадре рядом.

// ---------- математика и анимация ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = k => 1 - Math.pow(1 - clamp(k), 3);
const eio = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 };
const sp = k => { if (k <= 0) return 0; if (k >= 1) return 1; return 1 - Math.exp(-6.5 * k) * Math.cos(10.5 * k) };  // пружина
const pr = (t, a, d) => clamp((t - a) / d);
const R = (n, s = 0) => { const x = Math.sin(n * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x) };
const f1 = x => (+x).toFixed(1), f3 = x => (+x).toFixed(3);
const fmt = n => Math.round(n).toLocaleString('en-US');

function shade(hex, a) {   // a>0 светлее, a<0 темнее
  const h = hex.replace('#', ''); let r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const f = v => Math.round(a >= 0 ? v + (255 - v) * a : v * (1 + a));
  return '#' + [f(r), f(g), f(b)].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')
}

// появление: пружина масштаба из точки
function pop(t, at, c, x = 0, y = 0, d = .5) {
  const k = pr(t, at, d); if (k <= 0) return ''; const s = sp(k);
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})" opacity="${f3(clamp(k * 4))}">${c}</g>`
}
// выезд снизу с затуханием
function rise(t, at, c, dy = 40, d = .4) {
  const k = pr(t, at, d); if (k <= 0) return ''; const e = eo(k);
  return `<g transform="translate(0 ${f1((1 - e) * dy)})" opacity="${f3(e)}">${c}</g>`
}
// исчезновение к моменту
function out(t, at, c, d = .3) { const k = pr(t, at, d); if (k >= 1) return ''; return `<g opacity="${f3(1 - k)}">${c}</g>` }
const G = (tr, c, op = 1) => `<g transform="${tr}"${op < 1 ? ` opacity="${f3(op)}"` : ''}>${c}</g>`;

// ---------- текст ----------
function txt(x, y, s, o = {}) {
  const fs = o.fs || 60, fill = o.fill || '#fff', st = o.st || '', sw = o.sw || 0;
  return `<text x="${f1(x)}" y="${f1(y)}" font-size="${fs}" text-anchor="${o.a || 'middle'}" fill="${fill}"` +
    (st ? ` stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke"` : '') +
    ` font-family="${o.font || 'P'}" font-weight="${o.w || 900}" letter-spacing="${o.ls || 0}"${o.op != null ? ` opacity="${f3(o.op)}"` : ''}>${s}</text>`
}
// заголовок по буквам: каждая буква падает пружиной (ширины букв Poppins Black — примерно)
const CW = { I: .34, J: .58, '1': .52, '?': .62, '!': .36, ' ': .3, M: .98, W: 1.06, '.': .3, ',': .3, "'": .28, '%': .9, '$': .7, O: .84, Q: .84, D: .8, G: .8, C: .76, N: .8, H: .8, U: .78,
  F: .62, E: .66, R: .72, S: .68, P: .7, T: .66, A: .8, K: .74, L: .6, B: .74, Y: .74, V: .78, X: .76, Z: .68 };
function dropText(t, at, x, y, s, o = {}) {
  const fs = o.fs || 120, gap = o.gap || .045; let r = '';
  const ws = [...s].map(ch => (CW[ch] ?? .72) * fs * (o.cw || 1)), W = ws.reduce((a, b) => a + b, 0);
  let cx = x - W / 2;
  [...s].forEach((ch, i) => {
    const mid = cx + ws[i] / 2; cx += ws[i];
    const k = pr(t, at + i * gap, .55); if (k <= 0 || ch === ' ') return;
    const e = sp(k);
    r += `<g transform="translate(${f1(mid)} ${f1(y - (1 - e) * 120)}) rotate(${f1((1 - e) * (i % 2 ? 14 : -14))})" opacity="${f3(clamp(k * 5))}">` +
      txt(0, 0, ch, { ...o, fs }) + `</g>`
  });
  return r
}
// плашка-«пилюля»
function pill(x, y, s, o = {}) {
  const fs = o.fs || 40, w = o.w || (s.length * fs * .66 + 60), h = fs * 1.75;
  return `<g transform="translate(${f1(x)} ${f1(y)})${o.rot ? ` rotate(${o.rot})` : ''}"><rect x="${f1(-w / 2)}" y="${f1(-h / 2 + 7)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h / 2)}" fill="rgba(0,0,0,.25)"/>` +
    `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h / 2)}" fill="${o.bg || '#fff'}"/>` +
    txt(0, fs * .36, s, { fs, fill: o.fg || '#141022', ls: o.ls || 1 }) + `</g>`
}
// печать-штамп
function stamp(t, at, x, y, s, o = {}) {
  const k = pr(t, at, .28); if (k <= 0) return '';
  const sc = 1 + (1 - eo(k)) * 1.4, c = o.c || '#FF3B4E', fs = o.fs || 92, w = s.length * fs * .68 + 70;
  return `<g transform="translate(${x} ${y}) rotate(${o.rot ?? -12}) scale(${f3(sc)})" opacity="${f3(clamp(k * 2.5) * .95)}">
   <rect x="${-w / 2}" y="${-fs * .82}" width="${w}" height="${fs * 1.5}" rx="18" fill="none" stroke="${c}" stroke-width="12"/>
   ${txt(0, fs * .33, s, { fs, fill: c, ls: 4 })}</g>`
}

// ---------- общие defs ----------
const DEFS = `<defs>
 <radialGradient id="glowW"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
 <radialGradient id="glowY"><stop offset="0" stop-color="#FFE27A" stop-opacity=".75"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/></radialGradient>
 <radialGradient id="glowR"><stop offset="0" stop-color="#FF6B6B" stop-opacity=".7"/><stop offset="1" stop-color="#FF3B4E" stop-opacity="0"/></radialGradient>
 <radialGradient id="glowG"><stop offset="0" stop-color="#7DFFB0" stop-opacity=".6"/><stop offset="1" stop-color="#3CC47C" stop-opacity="0"/></radialGradient>
 <linearGradient id="fadeDown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
 <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="3" fill="#000" opacity=".12"/></pattern>
</defs>`;

// фон: заливка + крупные мягкие круги (глубина) + точки-растр, как у «Что вы знаете о»
function bgFlat(c, t, o = {}) {
  const c2 = o.c2 || shade(c, -.18), c3 = o.c3 || shade(c, .12);
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="${c}"/>`;
  s += `<circle cx="${f1(160 + Math.sin(t * .3) * 20)}" cy="420" r="420" fill="${c3}" opacity=".35"/>`;
  s += `<circle cx="${f1(960 + Math.cos(t * .25) * 20)}" cy="1340" r="520" fill="${c2}" opacity=".45"/>`;
  if (!o.nodots) s += `<rect x="-300" y="-300" width="1680" height="2520" fill="url(#dots)" opacity="${o.dots ?? .55}"/>`;
  return s
}
// пол / горизонт
const floor = (y, c) => `<rect x="-300" y="${y}" width="1680" height="${2400 - y}" fill="${c}"/>`;
const shadowE = (x, y, rx, ry = 18, op = .18) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#000" opacity="${op}"/>`;

// ---------- человечек (плоский, взрослые пропорции) ----------
// ноги в (x,y), рост ~740 при s=1. o: skin hair hs top pants shoe pose mouth talk look blink brow hat hp item flip
const POSES = { down: [12, 8, 12, 8], hips: [42, -95, 42, -95], up: [158, 12, 158, 12], wave: [12, 8, 150, 25], point: [12, 8, 88, 4],
  hold: [18, -112, 18, -112], shrug: [62, -128, 62, -128], cheer: [140, 40, 140, 40], phone: [14, 6, 22, -125], think: [12, 8, 26, -150] };
function person(o) {
  const s = o.s || 1, sk = o.skin || '#F2C29B', skD = shade(sk, -.16), top = o.top || '#3B7BFF', topD = shade(top, -.2),
    pants = o.pants || '#2B2F45', shoe = o.shoe || '#F5F5F7', hair = o.hair || '#3A2A20';
  const P = (Array.isArray(o.pose) ? o.pose : POSES[o.pose || 'down']).slice();
  if (o.wave) P[2] += Math.sin(o.wave * 9) * 14, P[3] += Math.sin(o.wave * 9 + 1) * 18;
  const [lx, ly] = o.look || [0, 0];
  let g = shadowE(0, 0, 120, 20, .2);
  // ноги (на коленях — короче, тело ниже)
  if (o.kneel) g += `<rect x="-64" y="-150" width="56" height="140" rx="27" fill="${pants}"/><rect x="8" y="-150" width="56" height="140" rx="27" fill="${shade(pants, -.15)}"/>`;
  else g += `<rect x="-64" y="-280" width="56" height="268" rx="27" fill="${pants}"/><rect x="8" y="-280" width="56" height="268" rx="27" fill="${shade(pants, -.15)}"/>` +
    `<ellipse cx="-40" cy="-10" rx="48" ry="21" fill="${shoe}"/><ellipse cx="40" cy="-10" rx="48" ry="21" fill="${shade(shoe, -.1)}"/>`;
  const g0 = g; g = '';
  // руки (за телом — задняя)
  const arm = (side, a1, a2) => {
    const sx = side * 98, sy = -520, L1 = 128, L2 = 118, r1 = a1 * Math.PI / 180, r2 = (a1 + a2) * Math.PI / 180;
    const ex = sx + side * Math.sin(r1) * L1, ey = sy + Math.cos(r1) * L1, hx = ex + side * Math.sin(r2) * L2, hy = ey + Math.cos(r2) * L2;
    return { d: `<path d="M${f1(sx)},${sy} L${f1(ex)},${f1(ey)} L${f1(hx)},${f1(hy)}" stroke="${side > 0 ? topD : top}" stroke-width="50" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="${f1(hx)}" cy="${f1(hy)}" r="25" fill="${side > 0 ? skD : sk}"/>`, hx, hy }
  };
  const AL = arm(-1, P[0], P[1]), AR = arm(1, P[2], P[3]);
  // тело — худи
  g += `<path d="M-116,-286 L-116,-478 Q-116,-552 -48,-562 L48,-562 Q116,-552 116,-478 L116,-286 Q116,-262 92,-262 L-92,-262 Q-116,-262 -116,-286Z" fill="${top}"/>`;
  g += `<path d="M36,-562 L48,-562 Q116,-552 116,-478 L116,-286 Q116,-262 92,-262 L36,-262Z" fill="${topD}" opacity=".55"/>`;
  g += `<path d="M-66,-352 L66,-352 L56,-300 L-56,-300Z" fill="${topD}" opacity=".6"/>`;   // карман
  g += `<path d="M-52,-560 Q0,-505 52,-560" stroke="${topD}" stroke-width="12" fill="none" stroke-linecap="round"/>`;  // ворот
  if (o.logo) g += o.logo;
  g += AL.d + AR.d;
  // шея и голова
  g += `<rect x="-22" y="-600" width="44" height="48" fill="${skD}"/>`;
  const hy = -668;
  g += `<circle cx="-70" cy="${hy + 6}" r="15" fill="${skD}"/><circle cx="70" cy="${hy + 6}" r="15" fill="${skD}"/>`;
  g += `<ellipse cx="0" cy="${hy}" rx="72" ry="78" fill="${sk}"/>`;
  g += `<path d="M30,${hy - 70} Q78,${hy - 40} 72,${hy + 10} Q66,${hy + 64} 18,${hy + 78} Q60,${hy + 20} 30,${hy - 70}Z" fill="${skD}" opacity=".45"/>`;
  // волосы
  const hs = o.hs || 'short';
  if (hs === 'short') g += `<path d="M-74,${hy - 6} Q-84,${hy - 92} -6,${hy - 96} Q78,${hy - 98} 76,${hy - 10} Q66,${hy - 52} 22,${hy - 58} Q-34,${hy - 66} -74,${hy - 6}Z" fill="${hair}"/>`;
  if (hs === 'buzz') g += `<path d="M-72,${hy - 14} Q-74,${hy - 86} 0,${hy - 88} Q74,${hy - 86} 72,${hy - 14} Q60,${hy - 60} 0,${hy - 64} Q-60,${hy - 60} -72,${hy - 14}Z" fill="${hair}"/>`;
  if (hs === 'curly') { for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + i * .11); g += `<circle cx="${f1(Math.cos(a) * 64)}" cy="${f1(hy - 18 + Math.sin(a) * 64)}" r="30" fill="${hair}"/>` } }
  if (hs === 'long') g += `<path d="M-78,${hy + 60} Q-92,${hy - 96} 0,${hy - 98} Q92,${hy - 96} 78,${hy + 60} L60,${hy + 64} Q66,${hy - 40} 10,${hy - 54} Q-50,${hy - 50} -60,${hy + 64}Z" fill="${hair}"/>`;
  if (o.beard) g += `<path d="M-60,${hy + 12} Q-50,${hy + 84} 0,${hy + 88} Q50,${hy + 84} 60,${hy + 12} Q40,${hy + 50} 0,${hy + 52} Q-40,${hy + 50} -60,${hy + 12}Z" fill="${hair}" opacity=".9"/>`;
  // глаза
  const bl = o.blink ? 1.5 : 10;
  const eye = ex => `<ellipse cx="${ex + lx * 6}" cy="${hy - 6 + ly * 5}" rx="8" ry="${bl}" fill="#1B1726"/>` + (o.blink ? '' : `<circle cx="${ex + lx * 6 + 3}" cy="${hy - 10 + ly * 5}" r="2.6" fill="#fff"/>`);
  g += eye(-26) + eye(26);
  const bw = o.brow || 0; // >0 злой, <0 удивлён/грустный
  g += `<path d="M-40,${hy - 30 - (bw < 0 ? 8 : 0)} L-12,${hy - 26 + bw * 6}" stroke="${shade(hair, -.1)}" stroke-width="7" stroke-linecap="round"/>`;
  g += `<path d="M40,${hy - 30 - (bw < 0 ? 8 : 0)} L12,${hy - 26 + bw * 6}" stroke="${shade(hair, -.1)}" stroke-width="7" stroke-linecap="round"/>`;
  g += `<path d="M-4,${hy + 6} Q4,${hy + 18} -6,${hy + 22}" stroke="${skD}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  // рот
  const m = o.mouth || 'smile', my = hy + 40, tk = clamp(o.talk || 0);
  if (m === 'smile') g += `<path d="M-20,${my - 4} Q0,${my + 14} 20,${my - 4}" stroke="#7A2E2E" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if (m === 'talk') g += `<ellipse cx="0" cy="${my}" rx="${f1(15 + tk * 3)}" ry="${f1(3 + tk * 13)}" fill="#7A2E2E"/>`;
  if (m === 'o') g += `<ellipse cx="0" cy="${my + 2}" rx="11" ry="14" fill="#7A2E2E"/>`;
  if (m === 'shock') g += `<ellipse cx="0" cy="${my + 4}" rx="17" ry="22" fill="#5E2121"/>`;
  if (m === 'grin') g += `<path d="M-26,${my - 6} Q0,${my + 26} 26,${my - 6}Z" fill="#7A2E2E"/><path d="M-22,${my - 4} L22,${my - 4} L18,${my + 4} L-18,${my + 4}Z" fill="#fff"/>`;
  if (m === 'flat') g += `<path d="M-16,${my} L16,${my}" stroke="#7A2E2E" stroke-width="6" stroke-linecap="round"/>`;
  if (m === 'sad') g += `<path d="M-18,${my + 6} Q0,${my - 8} 18,${my + 6}" stroke="#7A2E2E" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if (m === 'scream') g += `<ellipse cx="0" cy="${my + 6}" rx="${f1(22 + tk * 4)}" ry="${f1(18 + tk * 12)}" fill="#5E2121"/><ellipse cx="0" cy="${my + 16 + tk * 6}" rx="12" ry="7" fill="#E8607A"/>`;
  // головной убор / наушники
  if (o.hp) g += `<path d="M-80,${hy} Q-84,${hy - 110} 0,${hy - 112} Q84,${hy - 110} 80,${hy}" stroke="${o.hp}" stroke-width="16" fill="none"/><rect x="-96" y="${hy - 22}" width="30" height="56" rx="12" fill="${o.hp}"/><rect x="66" y="${hy - 22}" width="30" height="56" rx="12" fill="${shade(o.hp, -.2)}"/>`;
  if (o.hat === 'beanie') g += `<path d="M-78,${hy - 24} Q-80,${hy - 120} 0,${hy - 122} Q80,${hy - 120} 78,${hy - 24}Z" fill="${o.hatC || '#FF4FA3'}"/><rect x="-82" y="${hy - 40}" width="164" height="30" rx="12" fill="${shade(o.hatC || '#FF4FA3', -.18)}"/>`;
  if (o.sweat) g += `<path d="M66,${hy - 40} q10,18 0,28 q-10,-10 0,-28z" fill="#8FD8FF"/>`;
  if (o.itemL) g += o.itemL(AL.hx, AL.hy);
  if (o.item) g += o.item(AR.hx, AR.hy);
  g = g0 + (o.kneel ? `<g transform="translate(0 130)">${g}</g>` : g);
  return `<g transform="translate(${f1(o.x || 0)} ${f1(o.y || 0)}) scale(${f3((o.flip ? -1 : 1) * s)} ${f3(s)})${o.rot ? ` rotate(${o.rot})` : ''}">${g}</g>`
}

// маленький человечек-иконка для толпы
function mini(x, y, s, c, o = {}) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><circle cx="0" cy="-58" r="20" fill="${o.head || c}"/>` +
    `<path d="M-26,0 L-26,-22 Q-26,-38 0,-38 Q26,-38 26,-22 L26,0Z" fill="${c}"/>${o.tag || ''}</g>`
}

// ---------- предметы ----------
function bill(x, y, rot = 0, s = 1, c = '#3CC47C') {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)})"><rect x="-80" y="-40" width="160" height="80" rx="8" fill="${c}"/>` +
    `<rect x="-70" y="-30" width="140" height="60" rx="5" fill="none" stroke="${shade(c, -.25)}" stroke-width="5"/>` +
    `<circle cx="0" cy="0" r="22" fill="${shade(c, .25)}"/>${txt(0, 11, '$', { fs: 32, fill: shade(c, -.35) })}</g>`
}
function cashStack(x, y, n = 6, s = 1) {
  let g = shadowE(0, 6, 110, 16, .2);
  for (let i = 0; i < n; i++) g += `<rect x="-95" y="${-i * 16 - 30}" width="190" height="30" rx="6" fill="${i % 2 ? '#35B272' : '#3CC47C'}"/><rect x="-28" y="${-i * 16 - 30}" width="56" height="30" fill="#E9F7EE" opacity=".9"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${g}</g>`
}
function coin(x, y, s = 1, c = '#FFC83D') {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><circle r="34" fill="${shade(c, -.2)}"/><circle r="28" fill="${c}"/>${txt(0, 12, '$', { fs: 34, fill: shade(c, -.35) })}</g>`
}
// табло-счётчик из плиток
function counter(x, y, value, o = {}) {
  const s = typeof value === 'string' ? value : fmt(value), cw = o.cw || 70, ch = o.ch || 104, fs = o.fs || 84;
  const W = s.length * cw; let g = '';
  [...s].forEach((c, i) => {
    const px = -W / 2 + i * cw;
    if (c === ',' || c === '.') { g += txt(px + cw / 2, ch * .3, c, { fs, fill: o.fg || '#fff' }); return }
    g += `<rect x="${f1(px + 3)}" y="${f1(-ch / 2)}" width="${cw - 6}" height="${ch}" rx="12" fill="${o.bg || '#141B3D'}"/>` +
      `<rect x="${f1(px + 3)}" y="-2" width="${cw - 6}" height="4" fill="#000" opacity=".25"/>` +
      txt(px + cw / 2, fs * .35, c, { fs, fill: o.fg || '#fff' })
  });
  return `<g transform="translate(${f1(x)} ${f1(y)})${o.s ? ` scale(${o.s})` : ''}">${g}</g>`
}
function globe(x, y, r, t, o = {}) {
  const sea = o.sea || '#2E8BFF', land = o.land || '#46C67B', rot = (o.rot ?? t * 40) % 720;
  // материки — пятна, едут по кругу (иллюзия вращения), обрезаны окружностью через маску-дугу: рисуем только внутри
  const B = [[-120, -60, 90, 70], [40, -100, 70, 50], [160, 20, 110, 80], [-30, 70, 80, 60], [300, -50, 90, 60], [430, 60, 70, 90], [560, -40, 100, 60], [-250, 40, 70, 60]];
  let blobs = '';
  for (const [bx, by, bw, bh] of B) {
    let px = ((bx + rot) % 720 + 720) % 720 - 360;
    for (const off of [0]) {
      const X = px + off; if (Math.abs(X) > r + bw) continue;
      const squash = Math.sqrt(Math.max(0, 1 - (X / (r * 1.05)) ** 2));
      blobs += `<ellipse cx="${f1(X * .98)}" cy="${f1(by * r / 300)}" rx="${f1(bw * r / 300 * (.35 + .65 * squash))}" ry="${f1(bh * r / 300)}" fill="${land}"/>`
    }
  }
  return `<g transform="translate(${f1(x)} ${f1(y)})"><circle r="${r * 1.18}" fill="url(#glowW)" opacity=".5"/><circle r="${r}" fill="${sea}"/>
   <g>${blobs}</g><circle r="${r}" fill="none" stroke="${shade(sea, -.25)}" stroke-width="${r * .04}"/>
   <path d="M${r * .15},${-r} A${r},${r} 0 0 1 ${r * .15},${r} A${r * .8},${r} 0 0 0 ${r * .15},${-r}Z" fill="#000" opacity=".22"/>
   <circle cx="${-r * .38}" cy="${-r * .4}" r="${r * .22}" fill="#fff" opacity=".13"/></g>`
}
function phone(x, y, s, screen = '', o = {}) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})${o.rot ? ` rotate(${o.rot})` : ''}"><rect x="-130" y="-250" width="260" height="500" rx="40" fill="${o.c || '#1E1E2A'}"/>` +
    `<rect x="-114" y="-226" width="228" height="452" rx="28" fill="${o.scr || '#F7F7FB'}"/>${screen}<rect x="-36" y="-238" width="72" height="12" rx="6" fill="#333"/></g>`
}
function clock(x, y, r, a1, a2, o = {}) {
  let ticks = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * 2 * Math.PI; ticks += `<line x1="${f1(Math.sin(a) * r * .78)}" y1="${f1(-Math.cos(a) * r * .78)}" x2="${f1(Math.sin(a) * r * .9)}" y2="${f1(-Math.cos(a) * r * .9)}" stroke="#2B2F45" stroke-width="${i % 3 ? 5 : 10}" stroke-linecap="round"/>` }
  return `<g transform="translate(${f1(x)} ${f1(y)})">${shadowE(0, r + 10, r * .8, 14, .15)}<circle r="${r + 16}" fill="${o.rim || '#FF4FA3'}"/><circle r="${r}" fill="#fff"/>${ticks}
   <line x1="0" y1="0" x2="${f1(Math.sin(a1) * r * .5)}" y2="${f1(-Math.cos(a1) * r * .5)}" stroke="#2B2F45" stroke-width="14" stroke-linecap="round"/>
   <line x1="0" y1="0" x2="${f1(Math.sin(a2) * r * .74)}" y2="${f1(-Math.cos(a2) * r * .74)}" stroke="#FF3B4E" stroke-width="8" stroke-linecap="round"/><circle r="12" fill="#2B2F45"/></g>`
}
function tree(x, y, s = 1, c = '#3CC47C') {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><rect x="-10" y="-60" width="20" height="60" fill="#8A5A34"/><circle cx="0" cy="-100" r="60" fill="${c}"/><circle cx="-30" cy="-70" r="40" fill="${shade(c, -.12)}"/><circle cx="32" cy="-74" r="38" fill="${shade(c, .1)}"/></g>`
}
function bubble(x, y, w, h, s, o = {}) {
  const tail = o.tail || 'bl';
  const tx = tail === 'br' ? w * .3 : -w * .3;
  return `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M${tx - 26},${h / 2 - 4} L${tx + (tail === 'br' ? 40 : -40)},${h / 2 + 46} L${tx + 26},${h / 2 - 4}Z" fill="${o.bg || '#fff'}"/>` +
    `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${Math.min(40, h / 2)}" fill="${o.bg || '#fff'}"/>` + txt(0, (o.fs || 56) * .36, s, { fs: o.fs || 56, fill: o.fg || '#141022' }) + `</g>`
}
function arrowR(x, y, len, c = '#fff', w = 16) {
  return `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M0,0 L${len - 30},0" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/><path d="M${len - 46},-30 L${len},0 L${len - 46},30" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`
}
function sparkle(x, y, s, c = '#fff', op = 1) {
  return `<path transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})" d="M0,-30 Q4,-4 30,0 Q4,4 0,30 Q-4,4 -30,0 Q-4,-4 0,-30Z" fill="${c}" opacity="${f3(op)}"/>`
}
function sparkles(t, x, y, n, rad, c = '#FFE27A', seed = 1) {
  let g = ''; for (let i = 0; i < n; i++) {
    const a = R(i, seed) * 6.28, d = rad * (.4 + .6 * R(i, seed + 1)), ph = R(i, seed + 2) * 6.28, k = .5 + .5 * Math.sin(t * 4 + ph);
    g += sparkle(x + Math.cos(a) * d, y + Math.sin(a) * d, .4 + .6 * k, c, k)
  }
  return g
}
// «лучи» за главным предметом
function rays(x, y, r, t, c = '#fff', n = 14, op = .12) {
  let g = ''; const a0 = t * 12;
  for (let i = 0; i < n; i++) { const a = (a0 + i * 360 / n) * Math.PI / 180, b = a + Math.PI / n * .55; g += `<path d="M0,0 L${f1(Math.cos(a) * r)},${f1(Math.sin(a) * r)} L${f1(Math.cos(b) * r)},${f1(Math.sin(b) * r)}Z" fill="${c}"/>` }
  return `<g transform="translate(${f1(x)} ${f1(y)})" opacity="${op}">${g}</g>`
}
// кнопка
function btn(x, y, w, h, s, o = {}) {
  const c = o.c || '#FF3B4E', press = o.press || 0;
  return `<g transform="translate(${f1(x)} ${f1(y + press * 10)})"><rect x="${-w / 2}" y="${-h / 2 + 14 - press * 10}" width="${w}" height="${h}" rx="${h / 2}" fill="${shade(c, -.3)}"/>` +
    `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${c}"/>${txt(0, (o.fs || 60) * .36, s, { fs: o.fs || 60, fill: o.fg || '#fff', ls: 2 })}</g>`
}
function cursor(x, y, s = 1) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><path d="M0,0 L0,86 L22,66 L38,102 L54,94 L38,60 L66,58Z" fill="#fff" stroke="#141022" stroke-width="7" stroke-linejoin="round"/></g>`
}
function thumb(x, y, w, h, big, c, o = {}) {
  return `<g transform="translate(${f1(x)} ${f1(y)})${o.rot ? ` rotate(${o.rot})` : ''}">${shadowE(0, h / 2 + 12, w * .45, 10, .18)}<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="18" fill="${c}"/>` +
    `<rect x="${-w / 2}" y="${h * .18}" width="${w}" height="${h * .32}" fill="#000" opacity=".18"/>` + txt(0, h * .14, big, { fs: o.fs || h * .42, fill: '#fff', st: '#141022', sw: 10 }) + `</g>`
}
// голова «сигнал-волна» (лай, крик)
function waves(x, y, t, c = '#fff', n = 3, dir = 1) {
  let g = ''; for (let i = 0; i < n; i++) {
    const k = ((t * 1.6 + i / n) % 1), r = 40 + k * 140;
    g += `<path d="M${f1(x + dir * r * .5)},${f1(y - r * .7)} Q${f1(x + dir * r)},${f1(y)} ${f1(x + dir * r * .5)},${f1(y + r * .7)}" stroke="${c}" stroke-width="14" fill="none" stroke-linecap="round" opacity="${f3(1 - k)}"/>`
  }
  return g
}
