// What do you know about coffee? — «кофе — наркотик, и он нас выращивает»
(() => {
const C = { cream: '#F3E6D3', br: '#6B3E26', dk: '#2A1A12', or: '#E8833A', leaf: '#3E8E5A', cherry: '#C8323C', w: '#fff', y: '#FFC83D', red: '#E63946', blue: '#2F6BFF' };
const D = {};

function cup(x, y, s, o = {}) {
  const c = o.c || '#fff', eyes = o.eyes;
  let g = shadowE(0, 6, 150, 16, .2) + `<path d="M150,-170 Q260,-170 250,-80 Q240,0 140,-10" stroke="${shade(c, -.1)}" stroke-width="34" fill="none"/>` +
    `<path d="M-170,-250 L170,-250 L140,-30 Q130,0 90,0 L-90,0 Q-130,0 -140,-30Z" fill="${c}"/><path d="M60,-250 L170,-250 L140,-30 Q130,0 90,0 L50,0Z" fill="${shade(c, -.08)}"/>` +
    `<ellipse cx="0" cy="-250" rx="170" ry="34" fill="${shade(c, -.12)}"/><ellipse cx="0" cy="-246" rx="150" ry="24" fill="${C.br}"/>`;
  if (o.band) g += `<rect x="-160" y="-170" width="316" height="60" fill="${o.band}"/>`;
  if (eyes) {
    const [lx, ly] = o.look || [0, 0];
    g += `<ellipse cx="-50" cy="-130" rx="28" ry="${o.blink ? 4 : 32}" fill="#fff"/><ellipse cx="50" cy="-130" rx="28" ry="${o.blink ? 4 : 32}" fill="#fff"/>` +
      (o.blink ? '' : `<circle cx="${-50 + lx * 10}" cy="${-126 + ly * 10}" r="14" fill="${C.dk}"/><circle cx="${50 + lx * 10}" cy="${-126 + ly * 10}" r="14" fill="${C.dk}"/>`) +
      (o.evil ? `<path d="M-84,-176 L-20,-156 M84,-176 L20,-156" stroke="${C.dk}" stroke-width="12" stroke-linecap="round"/><path d="M-40,-66 Q0,-40 40,-66" stroke="${C.dk}" stroke-width="10" fill="none" stroke-linecap="round"/>` : `<path d="M-30,-66 Q0,-48 30,-66" stroke="${C.dk}" stroke-width="9" fill="none" stroke-linecap="round"/>`);
  }
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${g}</g>`
}
function steam(t, x, y, s = 1, op = .6) {
  let g = ''; for (let i = 0; i < 3; i++) { const ph = (t * .9 + i * .33) % 1; g += `<path d="M${(i - 1) * 70},${-ph * 120} q-30,-45 0,-90 q30,-45 0,-90" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" opacity="${f3(op * Math.sin(ph * Math.PI))}"/>` }
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${g}</g>`
}
function leaf(x, y, a, s = 1, c = C.leaf) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${f3(s)})"><path d="M0,0 Q60,-50 140,0 Q60,50 0,0Z" fill="${c}"/><path d="M8,0 L130,0" stroke="${shade(c, -.25)}" stroke-width="5"/></g>` }
function cherry(x, y, s = 1) { return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><circle r="26" fill="${C.cherry}"/><circle cx="-8" cy="-8" r="8" fill="#fff" opacity=".35"/></g>` }
function branch(x, y, s, t, o = {}) {
  let g = `<path d="M-420,40 Q-100,-20 420,-10" stroke="#6E4527" stroke-width="22" fill="none" stroke-linecap="round"/>`;
  const L = [[-300, 20, -60], [-300, 30, 70], [-120, 0, -70], [-120, 6, 60], [60, -6, -60], [60, -2, 66], [240, -10, -55], [240, -8, 62]];
  for (const [lx, ly, a] of L) g += leaf(lx, ly, a + Math.sin(t * 1.5 + lx) * 3, 1.15);
  if (!o.noCherry) for (const [cx, cy] of [[-220, 40], [-190, 60], [-30, 26], [0, 44], [150, 18], [180, 36]]) g += cherry(cx, cy, 1);
  if (o.flowers) for (const [fx, fy] of [[-220, -10], [-20, -20], [170, -30]]) g += flower(fx, fy, .55, t);
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${g}</g>`
}
function flower(x, y, s, t) {
  let g = ''; for (let i = 0; i < 5; i++) g += `<ellipse cx="0" cy="-70" rx="34" ry="70" fill="#fff" transform="rotate(${i * 72 + Math.sin(t * 2) * 2})"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${g}<circle r="30" fill="${C.y}"/><circle r="14" fill="${C.or}"/></g>`
}
function bee(x, y, s, t, o = {}) {
  const w = Math.sin(t * 60) * .5 + .5;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s * (o.flip ? -1 : 1))} ${f3(s)}) rotate(${f1(o.rot || 0)})">` +
    `<ellipse cx="-10" cy="-50" rx="40" ry="${f1(22 + w * 14)}" fill="#DDF3FF" opacity=".85"/><ellipse cx="20" cy="-48" rx="34" ry="${f1(18 + w * 12)}" fill="#DDF3FF" opacity=".85"/>` +
    `<ellipse cx="0" cy="0" rx="62" ry="44" fill="${C.y}"/><rect x="-22" y="-44" width="18" height="88" fill="${C.dk}"/><rect x="14" y="-44" width="18" height="88" fill="${C.dk}"/>` +
    `<circle cx="58" cy="-6" r="28" fill="${C.dk}"/><circle cx="66" cy="-12" r="8" fill="#fff"/><path d="M-62,0 L-84,0" stroke="${C.dk}" stroke-width="8" stroke-linecap="round"/>` +
    (o.dead ? `<path d="M56,-20 L72,-4 M72,-20 L56,-4" stroke="#fff" stroke-width="6"/>` : '') + `</g>`
}
function bug(x, y, s, t, dead) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)}) rotate(${dead ? 180 : 0})"><ellipse rx="44" ry="30" fill="#4A3B6B"/><circle cx="44" cy="-6" r="20" fill="#2E2445"/>` +
    [-24, 0, 24].map(d => `<path d="M${d},20 L${d - 10 + (dead ? 0 : Math.sin(t * 20 + d) * 6)},44 M${d},-20 L${d - 10},-44" stroke="#2E2445" stroke-width="6" stroke-linecap="round"/>`).join('') +
    (dead ? `<path d="M36,-14 L50,0 M50,-14 L36,0" stroke="#fff" stroke-width="5"/>` : `<circle cx="50" cy="-10" r="5" fill="#fff"/>`) + `</g>`
}
function goat(x, y, s, t, ph = 0) {
  const j = Math.abs(Math.sin(t * 5 + ph)) * 60, l = Math.sin(t * 10 + ph) * 18;
  return `<g transform="translate(${f1(x)} ${f1(y - j)}) scale(${f3(s)})">${shadowE(0, j / s + 4, 110, 14, .15)}` +
    `<path d="M-70,0 L${-80 + l},90 M-40,0 L${-30 - l},90 M50,0 L${40 + l},90 M80,0 L${90 - l},90" stroke="#8A7A6A" stroke-width="16" stroke-linecap="round"/>` +
    `<ellipse cx="0" cy="-20" rx="120" ry="66" fill="#F1EDE6"/><ellipse cx="30" cy="-6" rx="70" ry="40" fill="#E2DCD1"/>` +
    `<g transform="translate(118 -70) rotate(${f1(Math.sin(t * 5 + ph) * 12)})"><ellipse cx="20" cy="0" rx="46" ry="34" fill="#F1EDE6"/><path d="M0,-30 Q-20,-80 -50,-90" stroke="#8A7A6A" stroke-width="12" fill="none" stroke-linecap="round"/>` +
    `<circle cx="30" cy="-6" r="7" fill="${C.dk}"/><path d="M50,28 L56,52" stroke="#D9D2C5" stroke-width="10" stroke-linecap="round"/><ellipse cx="-14" cy="-10" rx="18" ry="9" fill="#E2DCD1"/></g>` +
    `<path d="M-118,-40 Q-150,-70 -140,-90" stroke="#F1EDE6" stroke-width="16" fill="none" stroke-linecap="round"/></g>`
}
function molecule(x, y, s, t) {
  // кофеин: шестиугольник + пятиугольник, атомы N
  const H = [[0, -80], [69, -40], [69, 40], [0, 80], [-69, 40], [-69, -40]];
  const P = [[69, -40], [140, -66], [182, 0], [140, 66], [69, 40]];
  const line = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`;
  let g = ''; for (let i = 0; i < 6; i++) g += line(H[i], H[(i + 1) % 6]); for (let i = 0; i < 4; i++) g += line(P[i], P[i + 1]);
  g += line(H[0], [0, -150]) + line(H[4], [-130, 80]) + line(H[3], [0, 150]) + line(P[3], [170, 130]);
  const atoms = [[H[1], C.blue, 'N'], [H[5], C.blue, 'N'], [P[2], C.blue, 'N'], [P[4], C.blue, 'N'], [[0, -150], C.red, 'O'], [[0, 150], C.red, 'O']];
  for (const [p, c, l] of atoms) g += `<circle cx="${p[0]}" cy="${p[1]}" r="30" fill="${c}"/>` + txt(p[0], p[1] + 12, l, { fs: 34, fill: '#fff' });
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)}) rotate(${f1(Math.sin(t) * 6)})">${g}</g>`
}

D.title = (t, S, T) => {
  const c = T.c;
  let s = bgFlat(C.dk, t, { dots: .3, c3: '#3B2618', c2: '#1A0F09' }) + rays(540, 900, 1200, t, C.or, 14, .1);
  s += rise(t, .05, txt(540, 470, 'WHAT DO YOU KNOW', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += rise(t, .25, txt(540, 560, 'ABOUT', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += dropText(t, c('coffee') - .15, 540, 760, 'COFFEE?', { fs: 160, fill: C.or, st: '#fff', sw: 10 });
  s += pop(t, .4, cup(0, 0, .8, { band: C.or }) + steam(t, 0, -260, .9), 540, 1200);
  s += pop(t, .6, pill(0, 0, 'PART 3', { bg: C.or, fg: '#fff', fs: 34 }), 540, 330);
  return s
};

D.morning = (t, S, T) => {
  const c = T.c, tw = c('wakes'), aw = t > tw;
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#FFD9A8"/>` + `<rect x="-300" y="-300" width="1680" height="2520" fill="url(#dots)" opacity=".25"/>`;
  // окно с восходом
  const k = clamp(T.lt / 2.5);
  s += `<rect x="140" y="260" width="800" height="560" rx="30" fill="#7EC8FF"/><circle cx="540" cy="${f1(820 - k * 300)}" r="120" fill="#FFE27A"/><rect x="140" y="660" width="800" height="160" fill="#5BAA6E"/>` +
    `<rect x="140" y="260" width="800" height="560" rx="30" fill="none" stroke="#fff" stroke-width="26"/><line x1="540" y1="260" x2="540" y2="820" stroke="#fff" stroke-width="20"/>`;
  s += person({ x: 540, y: 1330, s: .9, skin: '#F2C29B', hair: '#3A2A20', hs: 'curly', top: '#7B5CFF', pants: '#2B2F45', pose: 'hold', mouth: aw ? 'grin' : 'flat', blink: !aw, brow: aw ? -1 : 0,
    item: (x, y) => cup(x - 98, y + 30, .32, { c: '#fff', band: C.or }) });
  if (aw) s += sparkles(t, 540, 640, 10, 200, '#fff', 7) + pop(t, tw, pill(0, 0, 'AWAKE!', { bg: C.y, fs: 50 }), 790, 900);
  else s += `<g opacity=".8">${txt(700, 600, 'z', { fs: 60, fill: '#fff' })}${txt(750, 540, 'z', { fs: 80, fill: '#fff' })}</g>`;
  return s
};

D.claim = (t, S, T) => {
  const c = T.c, kd = pr(t, c('drug') - .1, .4), kf = pr(t, c('farming') - .2, .6);
  let s = bgFlat(C.dk, t, { dots: .25, c3: '#3B2618', c2: '#120A06' });
  s += `<circle cx="540" cy="620" r="${f1(330 + Math.sin(t * 3) * 10)}" fill="url(#glowR)" opacity="${f3(.5 * kd)}"/>`;
  s += cup(540, 820, 1.05, { c: '#fff', band: C.red, eyes: true, evil: kd > 0, look: [0, .3] }) + steam(t, 540, 540, 1, .5);
  // нити марионетки к людям
  if (kf > 0) {
    for (let i = 0; i < 3; i++) {
      const x = 220 + i * 320, y = 1240, sw = Math.sin(t * 3 + i) * 10;
      s += `<path d="M${540 + (i - 1) * 90},700 Q${(540 + x) / 2},${900 + sw} ${x},${y - 640}" stroke="#fff" stroke-width="4" fill="none" opacity="${f3(kf * .8)}"/>`;
      s += `<g opacity="${f3(kf)}">${person({ x, y: y + Math.sin(t * 3 + i) * 10, s: .55, skin: ['#F2C29B', '#C68B59', '#8D5524'][i], hair: '#2A1A12', hs: ['short', 'long', 'buzz'][i], top: ['#2F6BFF', '#7B5CFF', '#21B5A0'][i], pose: [120 + sw, 30, 120 - sw, 30], mouth: 'flat', blink: true })}</g>`
    }
  }
  s += stamp(t, c('drug'), 540, 400, 'DRUG', { c: C.red, fs: 110, rot: -10 });
  return s
};

D.drug = (t, S, T) => {
  const c = T.c;
  let s = bgFlat('#3B2618', t, { dots: .25 });
  s += pop(t, S.a + .15, molecule(0, 0, 1.6, t), 470, 720);
  s += pop(t, c('caffeine') - .05, pill(0, 0, 'CAFFEINE', { bg: '#fff', fs: 54 }), 540, 400);
  s += pop(t, c('most') - .1, `<circle r="110" fill="${C.y}"/><circle r="92" fill="none" stroke="${C.dk}" stroke-width="6" stroke-dasharray="10 8"/>${txt(0, 30, '#1', { fs: 96, fill: C.dk })}`, 860, 1020);
  s += rise(t, c('mind-altering') - .1, txt(540, 1200, 'MIND-ALTERING DRUG', { fs: 50, fill: '#fff', ls: 3 }), 20);
  return s
};

D.poison = (t, S, T) => {
  const c = T.c, ki = c('insects') - .2, kp = pr(t, c('poison') - .1, .4);
  let s = bgFlat('#E9F4E6', t, { dots: .2, c2: '#CFE6C9', c3: '#fff' });
  s += branch(540, 760, 1.15, t);
  // жуки ползут к ветке и падают
  for (let i = 0; i < 5; i++) {
    const dead = t > ki + i * .12, x0 = i % 2 ? 1180 : -100, x1 = 200 + i * 170, k = clamp((t - S.a - .3 - i * .2) / 1.6);
    const x = lerp(x0, x1, eo(k)), y = dead ? 820 + eio(clamp((t - ki - i * .12) / .7)) * 420 : 600 + (i % 3) * 60;
    s += bug(x, y, .9, t, dead)
  }
  s += kp > 0 ? `<g transform="translate(540 330) scale(${f3(sp(kp))})"><rect x="-210" y="-70" width="420" height="140" rx="30" fill="${C.dk}"/>` +
    `<circle cx="-130" cy="0" r="40" fill="#fff"/><circle cx="-144" cy="-6" r="9" fill="${C.dk}"/><circle cx="-116" cy="-6" r="9" fill="${C.dk}"/><rect x="-146" y="18" width="32" height="14" fill="#fff"/>` +
    txt(50, 26, 'POISON', { fs: 70, fill: '#7DFF9A' }) + `</g>` : '';
  s += pop(t, c('insects') - .05, pill(0, 0, 'NATURAL PESTICIDE', { bg: C.red, fg: '#fff', fs: 44 }), 540, 1180);
  return s
};

D.nectar = (t, S, T) => {
  const c = T.c, kf = pr(t, c('flowers') - .3, .6);
  let s = bgFlat('#BFE3B5', t, { dots: .2, c2: '#9FD08F', c3: '#E2F4DC' });
  s += `<g transform="translate(540 720) scale(${f3(.9 + .5 * eo(kf))})">${flower(0, 0, 2.2, t)}</g>`;
  // капли нектара с искрами кофеина
  for (let i = 0; i < 6; i++) { const k = pr(t, c('tiny') + i * .18, .5); if (k > 0) { const a = i * 1.05, r = 120 + 40 * Math.sin(t * 2 + i); s += `<g transform="translate(${f1(540 + Math.cos(a) * r)} ${f1(720 + Math.sin(a) * r)}) scale(${f3(sp(k))})"><path d="M0,-34 C14,-12 24,0 24,12 A24,24 0 1 1 -24,12 C-24,0 -14,-12 0,-34Z" fill="${C.or}"/></g>` + sparkle(540 + Math.cos(a) * (r + 60), 720 + Math.sin(a) * (r + 60), .5, '#fff', .8) } }
  s += pop(t, c('smarter') - .1, pill(0, 0, 'SMARTER', { bg: '#fff', fs: 50 }), 540, 330);
  s += pop(t, c('tiny') - .05, pill(0, 0, 'TINY DOSE OF CAFFEINE', { bg: C.or, fg: '#fff', fs: 44 }), 540, 1180);
  return s
};

D.bees = (t, S, T) => {
  const c = T.c, lt = T.lt, s2 = S.sents[1].a, k3 = pr(t, c('three') - .15, .5);
  let s = bgFlat('#BFE3B5', t, { dots: .2, c2: '#9FD08F', c3: '#E2F4DC' });
  s += flower(540, 980, 1.3, t);
  if (t < s2) {
    s += pop(t, c('2013') - .1, pill(0, 0, '2013 · SCIENCE', { bg: '#fff', fs: 46 }), 540, 330);
    // пчела + облачко «памяти» с цветком
    s += bee(lerp(200, 420, eo(clamp(T.lt / 2))), 640 + Math.sin(t * 4) * 20, 1.4, t);
    s += pop(t, c('remember') - .2, `<g><circle cx="-40" cy="40" r="22" fill="#fff"/><circle cx="-10" cy="10" r="30" fill="#fff"/><ellipse cx="80" cy="-60" rx="150" ry="110" fill="#fff"/>${flower(80, -60, .55, t)}</g>`, 520, 520);
    s += k3 > 0 ? `<g transform="translate(830 560) scale(${f3(sp(k3))})"><circle r="110" fill="${C.or}"/>${txt(0, 40, '3×', { fs: 120, fill: '#fff' })}</g>` : '';
  } else {
    // пчёлы возвращаются по кругу
    for (let i = 0; i < 6; i++) { const a = t * 1.4 + i * 1.05, r = 330 + Math.sin(t + i) * 30; s += bee(540 + Math.cos(a) * r, 900 + Math.sin(a) * r * .6, .8, t + i, { flip: Math.sin(a) > 0 }) }
    s += stamp(t, c('back'), 540, 420, 'AGAIN & AGAIN', { c: C.or, fs: 70, rot: -5 });
  }
  return s
};

D.plant = (t, S, T) => {
  const c = T.c, ko = pr(t, c('others') - .2, .5);
  let s = bgFlat('#E9F4E6', t, { dots: .2, c2: '#CFE6C9', c3: '#fff' });
  s += floor(1120, '#8A5A34') + `<rect x="-300" y="1120" width="1680" height="30" fill="#6E4527"/>`;
  // куст
  s += `<path d="M540,1120 L540,700" stroke="#6E4527" stroke-width="30" stroke-linecap="round"/>`;
  for (let i = 0; i < 8; i++) s += leaf(540, 1080 - i * 50, (i % 2 ? -40 : 220) + Math.sin(t * 2 + i) * 4, 1.3);
  for (const [cx, cy] of [[480, 900], [600, 860], [520, 780], [610, 980]]) s += cherry(cx, cy, 1.1);
  // корни, «ног нет»
  s += `<path d="M540,1120 q-60,80 -140,100 M540,1120 q60,70 150,90 M540,1120 l0,120" stroke="#5A3820" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  s += pop(t, c('walk') - .1, `<g><circle r="70" fill="none" stroke="${C.red}" stroke-width="14"/><path d="M-50,50 L50,-50" stroke="${C.red}" stroke-width="14"/>${txt(0, 18, '🚶', { fs: 60, fill: '#000' })}</g>`, 820, 520);
  if (ko > 0) for (let i = 0; i < 5; i++) { const a = i * 1.26 + t * .4, r = 420 - eo(ko) * 120; s += `<g opacity="${f3(ko)}">${arrowR(540 + Math.cos(a) * r, 860 + Math.sin(a) * r * .7, 120, C.or, 14).replace('<g transform="translate', `<g transform="rotate(${f1(a * 180 / Math.PI + 180)} ${f1(540 + Math.cos(a) * r)} ${f1(860 + Math.sin(a) * r * .7)}) translate`)}</g>` }
  s += pop(t, c('walk') - .1, pill(0, 0, "CAN'T WALK", { bg: C.dk, fg: '#fff', fs: 46 }), 300, 400);
  return s
};

D.goats = (t, S, T) => {
  const c = T.c, kg = pr(t, c('goats') - .2, .5);
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#F7C873"/>` + `<circle cx="820" cy="420" r="110" fill="#FFF1B0"/>`;
  s += `<path d="M-300,980 Q200,860 540,940 T1380,900 L1380,2200 L-300,2200Z" fill="#C98E3E"/><path d="M-300,1080 Q300,1000 700,1060 T1380,1040 L1380,2200 L-300,2200Z" fill="#A9742E"/>`;
  // пчёлы улетают — козы прыгают
  if (kg <= 0) for (let i = 0; i < 3; i++) s += bee(300 + i * 220, 700 + Math.sin(t * 4 + i) * 30, .7, t + i);
  if (kg > 0) { s += `<g opacity="${f3(kg)}">${goat(330, 1080, 1.1, t, 0)}${goat(760, 1120, .9, t, 1.7)}</g>`; s += sparkles(t, 540, 760, 10, 380, '#fff', 8) }
  s += pop(t, c('legend') - .1, pill(0, 0, 'LEGEND · ETHIOPIA', { bg: '#fff', fs: 46 }), 540, 330);
  return s
};

D.humans = (t, S, T) => {
  const c = T.c, lt = T.lt;
  let s = bgFlat('#FFD9A8', t, { dots: .2 });
  // толпа идёт к огромной чашке
  s += cup(540, 760, 1.1, { band: C.or, eyes: true, look: [0, .6] }) + steam(t, 540, 460, 1.1, .5);
  for (let i = 0; i < 18; i++) {
    const row = Math.floor(i / 6), x0 = (i % 6) * 180 + 90, k = clamp(lt / 1.2);
    s += mini(lerp(x0, 540 + (x0 - 540) * .5, eo(k)), 1220 - row * 70 + (1 - eo(k)) * 300, 1.5 - row * .2, ['#2F6BFF', '#7B5CFF', '#21B5A0', '#E63946', '#E8833A', '#3E8E5A'][i % 6])
  }
  s += pop(t, c('us') - .1, txt(0, 0, 'US.', { fs: 160, fill: C.dk, st: '#fff', sw: 12 }), 540, 330 + 40);
  return s
};

D.mecca = (t, S, T) => {
  const c = T.c, kb = pr(t, c('banned') - .1, .3), kl = pr(t, c('last') - .2, .6);
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#F4C48A"/><circle cx="540" cy="560" r="300" fill="#FFE2A8" opacity=".6"/>`;
  // город 16 века — силуэт с куполами (без конкретных святынь)
  let city = ''; const B = [[60, 160, 120], [190, 110, 200], [330, 140, 150], [480, 120, 260], [640, 160, 170], [790, 110, 230], [930, 150, 140]];
  for (const [x, w, h] of B) city += `<rect x="${x}" y="${1000 - h}" width="${w}" height="${h + 200}" fill="#C98E5A"/>` + (h > 180 ? `<ellipse cx="${x + w / 2}" cy="${1000 - h}" rx="${w * .38}" ry="${w * .36}" fill="#B87A48"/>` : '');
  s += city + `<rect x="-300" y="1000" width="1680" height="1000" fill="#B07B4A"/>`;
  s += pop(t, c('1511') - .1, pill(0, 0, '1511', { bg: C.dk, fg: '#fff', fs: 70 }), 540, 330);
  // чашки: перечёркнуты → «не продлилось» — их всё больше
  s += cup(540, 920, .6, { band: C.or });
  if (kb > 0 && kl <= 0) s += stamp(t, c('banned'), 540, 760, 'BANNED', { c: C.red, fs: 100, rot: -12 });
  if (kl > 0) { for (let i = 0; i < 6; i++) { const a = i * 1.05; s += pop(t, c('last') + i * .07, cup(0, 0, .3, { band: C.or }), 540 + Math.cos(a) * 330 * eo(kl), 780 + Math.sin(a) * 200 * eo(kl)) } s += pop(t, c('last'), pill(0, 0, "DIDN'T LAST", { bg: '#fff', fs: 50 }), 540, 1170) }
  return s
};

D.cups = (t, S, T) => {
  const c = T.c, lt = T.lt, kb = clamp((t - c('two') + .3) / 1.3);
  let s = bgFlat(C.dk, t, { dots: .25, c3: '#3B2618', c2: '#120A06' });
  // сетка чашек заполняется
  const n = Math.floor(eio(kb) * 48);
  for (let i = 0; i < n; i++) { const q = i % 8, r = Math.floor(i / 8); s += cup(110 + q * 123, 600 + r * 110, .24, { band: [C.or, C.red, C.y, '#7B5CFF'][i % 4] }) }
  s += counter(540, 380, Math.round(2e9 * eio(kb)), { bg: '#120A06', fg: C.y, cw: 70, ch: 108, fs: 88 });
  s += pop(t, c('every') - .1, pill(0, 0, 'CUPS · EVERY DAY', { bg: '#fff', fs: 50 }), 540, 1250 - 40);
  return s
};

D.withdraw = (t, S, T) => {
  const c = T.c, kh = pr(t, c('headache') - .2, .4), s2 = c('caffeine') - .1, kd = pr(t, c('diagnosis') - .2, .5);
  let s = bgFlat(kh > 0 ? '#3A1F2A' : '#FFD9A8', t, { dots: .2 });
  if (kh > 0) s += `<circle cx="540" cy="620" r="${f1(260 + 40 * Math.abs(Math.sin(t * 6)))}" fill="url(#glowR)" opacity=".7"/>`;
  s += person({ x: t > s2 ? 380 : 540, y: 1300, s: .9, skin: '#F2C29B', hair: '#3A2A20', hs: 'curly', top: '#7B5CFF', pants: '#2B2F45', pose: kh > 0 ? 'shrug' : 'down', mouth: kh > 0 ? 'sad' : 'flat', brow: kh > 0 ? 1 : 0, sweat: kh > 0 });
  if (t < c('headache') - .2) s += `<g>${cup(0, 0, .4, { band: C.or })}<path d="M-90,-220 L90,0" stroke="${C.red}" stroke-width="16" stroke-linecap="round"/></g>`.replace('<g>', `<g transform="translate(820 760)">`);
  if (kh > 0) for (let i = 0; i < 4; i++) { const a = -2.6 + i * .7, x = (t > s2 ? 380 : 540) + Math.cos(a) * 200, y = 600 + Math.sin(a) * 160; s += `<path transform="translate(${f1(x)} ${f1(y)}) scale(${f3(.8 + .3 * Math.abs(Math.sin(t * 8 + i)))})" d="M0,-40 L-18,4 L6,4 L-10,44 L28,-10 L4,-10 L18,-40Z" fill="${C.y}"/>` }
  if (t > s2 - .1) {
    s += pop(t, s2, `<rect x="-180" y="-230" width="360" height="460" rx="24" fill="#fff"/><rect x="-80" y="-250" width="160" height="50" rx="14" fill="#8A93A6"/>` +
      txt(0, -150, 'DIAGNOSIS', { fs: 40, fill: C.dk, ls: 2 }) + `<rect x="-140" y="-110" width="280" height="14" rx="7" fill="#DDE"/><rect x="-140" y="-80" width="220" height="14" rx="7" fill="#DDE"/>` +
      txt(0, 10, 'CAFFEINE', { fs: 46, fill: C.red }) + txt(0, 64, 'WITHDRAWAL', { fs: 46, fill: C.red }) +
      (kd > 0 ? `<path d="M-60,140 L-10,190 L80,90" stroke="${C.leaf}" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${f3(kd)}"/>` : ''), 790, 760);
    s += pop(t, c('official') - .1, pill(0, 0, 'OFFICIAL', { bg: C.y, fs: 46 }), 790, 440);
  }
  return s
};

D.trained = (t, S, T) => {
  const c = T.c, kt = pr(t, c('trained') - .15, .4);
  let s = bgFlat('#FFD9A8', t, { dots: .25 });
  // чашка ведёт человека на поводке
  const bob = Math.sin(t * 6) * 8;
  s += cup(330, 1120 + bob, .95, { band: C.or, eyes: true, evil: true, look: [1, 0] });
  s += person({ x: 790, y: 1240, s: .78, skin: '#F2C29B', hair: '#3A2A20', hs: 'curly', top: '#7B5CFF', pants: '#2B2F45', pose: [12, 8, 60, -40], mouth: 'smile', blink: (t % 2.4) < .1, look: [-1, 0] });
  s += `<path d="M560,${f1(1000 + bob)} Q680,${f1(1080 + bob)} 790,800" stroke="${C.red}" stroke-width="10" fill="none"/><rect x="750" y="786" width="80" height="24" rx="10" fill="${C.red}"/>`;
  s += kt > 0 ? stamp(t, c('trained'), 540, 420, 'TRAINED', { c: C.red, fs: 110, rot: -8 }) : pop(t, S.a + .2, pill(0, 0, "WE DIDN'T DISCOVER IT", { bg: '#fff', fs: 46 }), 540, 400);
  return s
};

D.you = (t, S, T) => {
  const c = T.c, kf = pr(t, c('or') - .15, .5);
  let s = bgFlat(kf > 0 ? C.dk : '#FFE7C2', t, { dots: .25 });
  if (kf <= 0) {
    s += person({ x: 540, y: 1300, s: 1, skin: '#F2C29B', hair: '#3A2A20', hs: 'curly', top: '#7B5CFF', pants: '#2B2F45', pose: 'hold', mouth: 'smile', item: (x, y) => cup(x - 98, y + 30, .34, { band: C.or }) });
    s += pop(t, c('ask') - .1, bubble(0, 0, 640, 150, 'ARE YOU DRINKING IT?', { fs: 50 }), 540, 380);
  } else {
    // наоборот: огромная чашка пьёт человека через трубочку
    s += cup(540, 1180, 1.25, { band: C.red, eyes: true, evil: true, look: [0, -.8] });
    s += `<path d="M640,850 L640,560 L760,470" stroke="${C.red}" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const shrink = 1 - .25 * eo(clamp((t - c('or')) / 2));
    s += person({ x: 790, y: 520, s: .38 * shrink, skin: '#F2C29B', hair: '#3A2A20', hs: 'curly', top: '#7B5CFF', pants: '#2B2F45', pose: 'up', mouth: 'scream', talk: .8, rot: -20 });
    s += pop(t, c('or'), bubble(0, 0, 680, 150, '...OR IS IT DRINKING YOU?', { fs: 46, bg: C.y }), 440, 340);
  }
  return s
};

D.next = (t, S, T) => {
  const c = T.c;
  let s = bgFlat('#3E9B2E', t, { dots: .25, c3: '#58B947', c2: '#2D7A20' }) + rays(540, 760, 1300, t, '#fff', 14, .08);
  s += rise(t, S.a + .1, txt(540, 340, 'PART 4', { fs: 60, fill: '#fff', ls: 6 }), 20);
  s += rise(t, c('know') - .1, txt(540, 440, 'WHAT DO YOU KNOW ABOUT', { fs: 52, fill: '#fff', ls: 2 }), 20);
  s += pop(t, c('duolingo') - .1, txt(0, 0, 'DUOLINGO?', { fs: 124, fill: '#fff', st: '#1E5E14', sw: 12 }), 540, 580);
  // глаза совы в темноте
  const bl = (t % 2.2) < .12;
  s += pop(t, S.a + .3, `<ellipse cx="-110" cy="0" rx="90" ry="${bl ? 8 : 90}" fill="#fff"/><ellipse cx="110" cy="0" rx="90" ry="${bl ? 8 : 90}" fill="#fff"/>` +
    (bl ? '' : `<circle cx="-100" cy="10" r="40" fill="#141022"/><circle cx="120" cy="10" r="40" fill="#141022"/>`) + `<path d="M-30,80 L30,80 L0,130Z" fill="${C.or}"/>`, 540, 880);
  s += pop(t, c('follow') + .2, btn(0, 0, 420, 116, 'FOLLOW', { c: C.or, fs: 56, press: Math.max(0, Math.sin(t * 6)) * .6 }), 540, 1180);
  return s
};

window.EP = {
  D, cap: { y: C.y, r: C.red, ink: '#1A0F09' }, trColor: C.or,
  tr: { morning: 'iris', claim: 'flash', drug: 'zoom', poison: 'slide', nectar: 'iris', bees: 'slide', plant: 'slideR', goats: 'wipe', humans: 'zoom', mecca: 'slide', cups: 'iris', withdraw: 'flash', trained: 'slide', you: 'zoom', next: 'wipe' },
  trAt: { morning: [540, 1000], nectar: [540, 720], cups: [540, 600] }, trCol: { claim: '#fff', withdraw: C.red, next: '#58B947' },
};
})();
