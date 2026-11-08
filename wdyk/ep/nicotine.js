// What do you know about nicotine? — «табак сделал его как оружие против насекомых»
(() => {
const C = { k: '#15171F', k2: '#1F2230', leaf: '#5D8A3A', leaf2: '#88B04B', ember: '#FF7A2F', red: '#FF3B4E', mango: '#FFB627', w: '#fff', smoke: '#C9CED8', blue: '#3E7BFF', g: '#3CC47C' };
const D = {};

function tleaf(x, y, a, s = 1, c = C.leaf) {   // широкий лист табака
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${f3(s)})"><path d="M0,0 C40,-70 160,-90 250,-20 C160,40 50,50 0,0Z" fill="${c}"/><path d="M6,0 L238,-18" stroke="${shade(c, -.25)}" stroke-width="6"/>` +
    [60, 110, 160].map(x => `<path d="M${x},-6 L${x + 30},-40 M${x},-4 L${x + 26},22" stroke="${shade(c, -.2)}" stroke-width="4"/>`).join('') + `</g>`
}
function tobacco(x, y, s, t) {
  let g = `<path d="M0,0 L0,-560" stroke="${shade(C.leaf, -.3)}" stroke-width="18" stroke-linecap="round"/>`;
  for (let i = 0; i < 6; i++) { const yy = -80 - i * 85, sw = Math.sin(t * 1.6 + i) * 4; g += tleaf(0, yy, -20 - i * 4 + sw, 1 - i * .1) + tleaf(0, yy - 30, 200 + i * 4 - sw, 1 - i * .1, C.leaf2) }
  g += `<g transform="translate(0 -580)">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-26" rx="12" ry="26" fill="#F7A8C4" transform="rotate(${a})"/>`).join('')}<circle r="10" fill="#fff"/></g>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${g}</g>`
}
function cig(x, y, s, rot, t) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)})"><rect x="-200" y="-22" width="300" height="44" rx="6" fill="#F4F4F4"/><rect x="100" y="-22" width="100" height="44" rx="6" fill="#E59A4B"/>` +
    `<rect x="-208" y="-22" width="14" height="44" rx="4" fill="${C.ember}" opacity="${f3(.7 + .3 * Math.sin(t * 8))}"/><circle cx="-214" cy="0" r="18" fill="${C.ember}" opacity=".35"/></g>`
}
function vape(x, y, s, rot, o = {}) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)})"><rect x="-60" y="-200" width="120" height="400" rx="50" fill="${o.c || '#3A3F55'}"/><rect x="-44" y="-190" width="88" height="110" rx="34" fill="${o.pod || '#7B5CFF'}" opacity=".9"/>` +
    `<rect x="-26" y="-240" width="52" height="60" rx="20" fill="#222"/>${o.label ? `<rect x="-52" y="0" width="104" height="120" rx="16" fill="${C.mango}"/>${txt(0, 76, o.label, { fs: 30, fill: '#5A2E00' })}` : `<circle cx="0" cy="120" r="14" fill="${C.g}" opacity=".8"/>`}</g>`
}
function brainS(x, y, s, glow = 0) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${glow ? `<circle r="${f1(240 + glow * 40)}" fill="url(#glowY)" opacity="${f3(glow)}"/>` : ''}<path d="M-150,10 C-160,-70 -95,-120 -30,-110 C0,-140 75,-130 95,-86 C150,-86 170,-20 150,20 C170,76 118,118 64,108 C32,134 -42,128 -64,102 C-128,112 -170,64 -150,10Z" fill="#FF9EC4"/>` +
    `<path d="M-96,-40 C-64,-64 -42,-18 -10,-44 M14,-80 C36,-44 66,-66 90,-32 M-110,44 C-76,22 -52,66 -20,42 M24,32 C54,8 76,56 110,30" stroke="#E0679A" stroke-width="8" fill="none" stroke-linecap="round"/></g>`
}
function insect(x, y, s, t, dead) {   // гусеница-вредитель
  let g = ''; for (let i = 0; i < 5; i++) g += `<circle cx="${i * 34}" cy="${f1(dead ? 0 : Math.sin(t * 8 + i) * 6)}" r="${i === 4 ? 26 : 22}" fill="${i % 2 ? '#6DBE45' : '#58A838'}"/>`;
  g += dead ? `<path d="M128,-14 L146,4 M146,-14 L128,4" stroke="#1d2b12" stroke-width="5"/>` : `<circle cx="144" cy="-6" r="6" fill="#1d2b12"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)}) rotate(${dead ? 160 : 0})">${g}</g>`
}
function smokeWisps(t, x, y, s = 1, op = .35) {
  let g = ''; for (let i = 0; i < 4; i++) { const ph = (t * .4 + i * .25) % 1; g += `<path d="M${(i - 1.5) * 60},${-ph * 300} q-40,-60 0,-120 q40,-60 0,-120" stroke="${C.smoke}" stroke-width="22" fill="none" stroke-linecap="round" opacity="${f3(op * Math.sin(ph * Math.PI))}"/>` }
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${g}</g>`
}

D.title = (t, S, T) => {
  const c = T.c;
  let s = bgFlat(C.k, t, { dots: .3, c3: '#262A3A', c2: '#0C0D12' }) + rays(540, 900, 1200, t, C.leaf2, 14, .08) + smokeWisps(t, 540, 1500, 1.4, .25);
  s += rise(t, .05, txt(540, 470, 'WHAT DO YOU KNOW', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += rise(t, .25, txt(540, 560, 'ABOUT', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += dropText(t, c('nicotine') - .15, 540, 760, 'NICOTINE?', { fs: 136, fill: C.leaf2, st: '#fff', sw: 10 });
  s += pop(t, .4, tleaf(-180, 40, -12, 1.4) + tleaf(-120, 70, 20, 1.1, C.leaf2), 540, 1100);
  s += pop(t, .6, pill(0, 0, 'DRUGS · PART 1', { bg: C.leaf2, fg: '#fff', fs: 34 }), 540, 330);
  return s
};

D.vape = (t, S, T) => {
  const c = T.c;
  let s = bgFlat(C.k2, t, { dots: .2 }) + smokeWisps(t, 300, 900, 1, .3) + smokeWisps(t + 1, 780, 900, 1, .3);
  s += pop(t, c('cigarettes') - .2, cig(0, 0, 1.3, -14, t), 330, 700);
  s += pop(t, c('vapes') - .2, vape(0, 0, 1.1, 12), 780, 760);
  s += rise(t, S.a + .2, txt(540, 400, 'INSIDE BOTH', { fs: 64, fill: '#fff', ls: 4 }), 20);
  s += pop(t, c('stuff') - .1, pill(0, 0, 'NICOTINE', { bg: C.leaf2, fg: '#fff', fs: 52 }), 540, 1100);
  return s
};

D.claim = (t, S, T) => {
  const c = T.c, kw = pr(t, c('weapon') - .2, .4);
  let s = bgFlat('#101218', t, { dots: .2 });
  s += `<circle cx="540" cy="760" r="${f1(360 + Math.sin(t * 3) * 10)}" fill="url(#glowR)" opacity="${f3(.5 * kw)}"/>`;
  s += tobacco(540, 1220, 1.15, t);
  // прицел
  s += kw > 0 ? `<g transform="translate(540 700) scale(${f3(1.6 - .6 * eo(kw))})" opacity="${f3(kw)}"><circle r="200" fill="none" stroke="${C.red}" stroke-width="12"/><circle r="120" fill="none" stroke="${C.red}" stroke-width="6"/><path d="M-260,0 L-140,0 M140,0 L260,0 M0,-260 L0,-140 M0,140 L0,260" stroke="${C.red}" stroke-width="12"/></g>` : '';
  s += stamp(t, c('weapon'), 540, 400, 'WEAPON', { c: C.red, fs: 110, rot: -8 });
  return s
};

D.plant = (t, S, T) => {
  const c = T.c, kp = pr(t, c('poison') - .1, .4), kn = pr(t, c('nervous') - .2, .4);
  let s = bgFlat('#E8F2DC', t, { dots: .2, c2: '#D2E6BE', c3: '#fff' });
  s += tobacco(420, 1250, 1.2, t);
  for (let i = 0; i < 4; i++) {
    const dead = t > c('poison') + i * .3, y0 = 520 + i * 160, x0 = 600 + (i % 2) * 120;
    const fall = dead ? eio(clamp((t - c('poison') - i * .3) / .8)) * 500 : 0;
    s += insect(x0 + (dead ? 0 : Math.sin(t * 2 + i) * 20), y0 + fall, 1, t, dead);
    if (dead && kn > 0) s += `<path transform="translate(${x0 + 60} ${f1(y0 + fall - 60)}) scale(${f3(.6 + .3 * Math.abs(Math.sin(t * 9 + i)))})" d="M0,-40 L-18,4 L6,4 L-10,44 L28,-10 L4,-10 L18,-40Z" fill="${C.mango}"/>`
  }
  s += kp > 0 ? `<g transform="translate(540 330) scale(${f3(sp(kp))})"><rect x="-290" y="-60" width="580" height="120" rx="30" fill="${C.k}"/>${txt(0, 22, 'NATURAL POISON', { fs: 54, fill: '#7DFF9A' })}</g>` : '';
  s += pop(t, c('nervous') - .1, pill(0, 0, 'ATTACKS THE NERVES', { bg: C.red, fg: '#fff', fs: 44 }), 540, 1180);
  return s
};

D.nicot = (t, S, T) => {
  const c = T.c, ks = clamp((t - c('sent') + .2) / 2.2);
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#EADBC0"/>` + `<rect x="-300" y="-300" width="1680" height="2520" fill="url(#dots)" opacity=".25"/>`;
  // карточка-портрет (условный человек XVI века)
  s += pop(t, S.a + .1, `<rect x="-200" y="-260" width="400" height="520" rx="20" fill="#F7EFDD" stroke="#8A6A45" stroke-width="10"/>`, 300, 640);
  s += person({ x: 300, y: 830, s: .42, skin: '#F2C29B', hair: '#3A2A20', hs: 'short', top: '#3B2A55', pants: '#2B2F45', pose: 'down', mouth: 'flat', beard: true }) +
    `<path d="M240,605 Q300,640 360,605 Q340,630 300,640 Q260,630 240,605Z" fill="#fff"/>`;
  s += pop(t, c('jean') - .1, txt(0, 0, 'JEAN NICOT', { fs: 54, fill: '#5A3E2B' }), 300, 960);
  // корабль везёт табак в Париж
  s += `<path d="M560,900 Q760,${f1(820 + Math.sin(t) * 10)} 980,900" stroke="#8A6A45" stroke-width="6" stroke-dasharray="14 12" fill="none"/>`;
  const sx = lerp(600, 940, eio(ks));
  s += `<g transform="translate(${f1(sx)} ${f1(870 + Math.sin(t * 3) * 8)})"><path d="M-70,0 L70,0 L50,36 L-50,36Z" fill="#7A4F2B"/><path d="M0,-90 L0,0" stroke="#5A3E2B" stroke-width="8"/><path d="M4,-86 Q50,-50 4,-14Z" fill="#fff"/><rect x="-36" y="-26" width="34" height="26" fill="${C.leaf}"/></g>`;
  s += pop(t, c('paris') - .1, pill(0, 0, 'PARIS', { bg: '#5A3E2B', fg: '#fff', fs: 46 }), 900, 760);
  s += pop(t, c('1560s') - .1, pill(0, 0, '1560s', { bg: C.ember, fg: '#fff', fs: 52 }), 760, 1080);
  return s
};

D.spray = (t, S, T) => {
  const c = T.c, lt = T.lt, t1992 = c('1992'), kn = pr(t, c('neonicotinoids') - .3, .5);
  let s = bgFlat('#BFE3B5', t, { dots: .2, c2: '#9FD08F', c3: '#E2F4DC' });
  s += floor(1160, '#8A5A34');
  for (let i = 0; i < 7; i++) s += tleaf(80 + i * 150, 1160, -70 + Math.sin(t + i) * 4, .6) + tleaf(80 + i * 150, 1160, -110 + Math.sin(t + i) * 4, .5, C.leaf2);
  if (kn <= 0) {
    // старый распылитель
    s += `<g transform="translate(560 640) rotate(-12)"><rect x="-110" y="-150" width="220" height="300" rx="20" fill="#2B2F45"/><rect x="-110" y="-60" width="220" height="110" fill="#F2E2C0"/>${txt(0, 0, 'NICOTINE', { fs: 44, fill: '#2B2F45' })}${txt(0, 40, 'BUG SPRAY', { fs: 30, fill: '#2B2F45' })}` +
      `<rect x="-20" y="-210" width="40" height="60" fill="#555"/><path d="M20,-200 L120,-220" stroke="#555" stroke-width="16" stroke-linecap="round"/></g>`;
    for (let i = 0; i < 16; i++) { const k = ((lt * 1.2 + i / 16) % 1); s += `<circle cx="${f1(700 + k * 260)}" cy="${f1(560 + k * 300 + Math.sin(i * 7) * k * 140)}" r="${f1(6 + k * 10)}" fill="#fff" opacity="${f3(.7 * (1 - k))}"/>` }
    s += pop(t, c('centuries') - .1, pill(0, 0, 'SINCE THE 1600s', { bg: '#fff', fs: 46 }), 540, 330);
    s += t > t1992 - .3 ? pop(t, t1992 - .2, pill(0, 0, 'SOLD UNTIL 1992', { bg: C.red, fg: '#fff', fs: 50 }), 540, 460) : '';
  } else {
    s += `<g transform="translate(540 680) scale(${f3(sp(kn))})"><rect x="-130" y="-200" width="260" height="400" rx="40" fill="#fff"/><rect x="-60" y="-260" width="120" height="70" rx="16" fill="${C.blue}"/><rect x="-130" y="-60" width="260" height="130" fill="${C.blue}"/>${txt(0, 20, 'NEO-', { fs: 60, fill: '#fff' })}</g>`;
    s += pop(t, c('neonicotinoids') - .1, txt(0, 0, 'NEONICOTINOIDS', { fs: 82, fill: '#1F3B12', st: '#fff', sw: 10 }), 540, 360);
    s += pop(t, c('neonicotinoids') + .3, pill(0, 0, '= "NEW NICOTINE"', { bg: C.mango, fs: 46 }), 540, 1000);
  }
  return s
};

D.brain = (t, S, T) => {
  const c = T.c, s2 = S.sents[1].a, kd = pr(t, c('dopamine') - .2, .5), kf = pr(t, c('fades') - .1, 1.2), ka = pr(t, c('another') - .2, .4);
  let s = bgFlat('#241B3A', t, { dots: .2 });
  if (t < s2) {
    // лёгкие → мозг за 10 секунд
    const n = Math.min(10, Math.max(0, Math.floor((t - c('inhale') + .2) * 4)));
    s += `<g transform="translate(540 980)"><ellipse cx="-110" cy="0" rx="90" ry="150" fill="#FF8FA3"/><ellipse cx="110" cy="0" rx="90" ry="150" fill="#FF8FA3"/><rect x="-18" y="-220" width="36" height="120" fill="#FF8FA3"/></g>`;
    s += brainS(540, 470, 1.1, 0);
    const kk = clamp((t - c('hits') + .3) / 1.2);
    s += `<path d="M540,760 L540,${f1(760 - 180 * eo(kk))}" stroke="${C.mango}" stroke-width="16" stroke-linecap="round"/>`;
    s += pop(t, c('10') - .1, `<circle r="90" fill="${C.mango}"/>${txt(0, 30, n ? n + 's' : '10s', { fs: 76, fill: '#241B3A' })}`, 830, 700);
  } else {
    s += brainS(540, 640, 1.4, kd * (1 - kf * .9));
    if (kd > 0) for (let i = 0; i < 12; i++) { const a = i * .52 + t, r = 300 + Math.sin(t * 2 + i) * 20; s += `<circle cx="${f1(540 + Math.cos(a) * r)}" cy="${f1(640 + Math.sin(a) * r * .8)}" r="12" fill="${C.mango}" opacity="${f3((1 - kf) * .9)}"/>` }
    s += pop(t, c('dopamine') - .1, pill(0, 0, 'DOPAMINE', { bg: C.mango, fs: 56 }), 540, 330);
    if (ka > 0) s += `<g transform="translate(540 1110) scale(${f3(sp(ka))})"><path d="M-120,0 A120,60 0 1 1 120,0" stroke="#fff" stroke-width="16" fill="none"/><path d="M100,-30 L124,6 L150,-26" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round"/>${txt(0, 30, 'AGAIN', { fs: 60, fill: C.red })}</g>`;
  }
  return s
};

D.pod = (t, S, T) => {
  const c = T.c, kp = clamp((t - c('pack') + .4) / 1.0);
  let s = bgFlat(C.k2, t, { dots: .2 });
  s += pop(t, S.a + .2, vape(0, 0, 1.15, 0, { pod: C.red }), 260, 760);
  s += pop(t, c('much') - .1, txt(0, 0, '=', { fs: 200, fill: '#fff' }), 520, 800);
  // пачка: 20 сигарет высыпаются
  s += pop(t, c('pack') - .3, `<rect x="-160" y="-220" width="320" height="440" rx="20" fill="#fff"/><rect x="-160" y="-220" width="320" height="140" rx="20" fill="${C.red}"/>${txt(0, 60, '20', { fs: 150, fill: '#222' })}${txt(0, 140, 'CIGARETTES', { fs: 34, fill: '#222' })}`, 800, 760);
  for (let i = 0; i < 20; i++) { const k = clamp(kp * 1.5 - i * .04); if (k > 0) s += cig(560 + (i % 10) * 50, 1130 + Math.floor(i / 10) * 60, .32, 90, t).replace('rotate(90.0)', 'rotate(0)') }
  s += pop(t, S.a + .3, pill(0, 0, 'ONE POD', { bg: '#fff', fs: 46 }), 260, 450);
  return s
};

D.deaths = (t, S, T) => {
  const c = T.c, s2 = c("that's") - .1, lt = T.lt;
  let s = bgFlat('#121318', t, { dots: .2 });
  const k = clamp((t - c('7') + .4) / 1.2);
  s += counter(540, 420, Math.round(7e6 * eio(k)), { bg: '#000', fg: '#fff', cw: 78, ch: 120, fs: 96 });
  s += pop(t, c('year') - .1, pill(0, 0, 'PEOPLE · EVERY YEAR', { bg: C.red, fg: '#fff', fs: 44 }), 540, 570);
  // сетка людей: после «that's» гаснет по одному в ритме
  const off = t > s2 ? Math.floor((t - s2) * 3) : 0;
  for (let i = 0; i < 40; i++) { const q = i % 8, r = Math.floor(i / 8), x = 140 + q * 115, y = 760 + r * 105, dead = i < off; s += mini(x, y, 1.15, dead ? '#3A3D48' : '#E9ECF2', { head: dead ? '#3A3D48' : '#E9ECF2' }) }
  if (t > s2) { const ph = ((t - s2) % (1 / 3)) * 3; s += `<circle cx="900" cy="330" r="${f1(40 + ph * 20)}" fill="none" stroke="${C.red}" stroke-width="8" opacity="${f3(1 - ph)}"/>` + txt(900, 345, '5s', { fs: 44, fill: C.red }) }
  return s
};

D.bug = (t, S, T) => {
  const c = T.c, s2 = S.sents[1].a, km = pr(t, c('mango') - .2, .5);
  let s = bgFlat(t > s2 ? '#FFE3A3' : '#E8F2DC', t, { dots: .2 });
  if (t < s2) {
    s += tobacco(540, 1250, 1.1, t) + insect(700, 1180, 1, t, true) + insect(330, 1200, .9, t, true);
    s += pop(t, c('poison') - .1, pill(0, 0, 'POISON FOR BUGS', { bg: C.k, fg: '#7DFF9A', fs: 46 }), 540, 330);
  } else {
    s += `<g transform="translate(540 700) scale(${f3(.9 + .3 * eo(km))})">${vape(0, 0, 1.3, 8, { pod: C.mango, label: 'MANGO' })}</g>`;
    // манго
    s += pop(t, c('mango') - .1, `<ellipse cx="0" cy="0" rx="110" ry="140" fill="${C.mango}" transform="rotate(30)"/><ellipse cx="-30" cy="-30" rx="40" ry="60" fill="#FFD27A" transform="rotate(30)"/><path d="M40,-130 Q80,-170 120,-150 Q90,-120 40,-130Z" fill="${C.leaf}"/>`, 830, 1020);
    s += sparkles(t, 540, 700, 10, 320, '#fff', 5);
    s += stamp(t, c('mango') + .2, 540, 330, 'MANGO FLAVOR', { c: C.red, fs: 74, rot: -6 });
  }
  return s
};

D.you = (t, S, T) => {
  const c = T.c, kb = pr(t, c('bug') - .2, .5);
  let s = bgFlat(kb > 0 ? '#1B1220' : C.k2, t, { dots: .2 });
  s += person({ x: 540, y: 1260, s: 1, skin: '#F2C29B', hair: '#3A2A20', hs: 'curly', top: '#7B5CFF', pants: '#2B2F45', pose: 'shrug', mouth: kb > 0 ? 'o' : 'flat', look: [0, -.4] });
  // усики насекомого вырастают
  if (kb > 0) { const e = eo(kb); s += `<path d="M500,${f1(540)} Q470,${f1(540 - 120 * e)} 420,${f1(540 - 170 * e)}" stroke="#2B2F45" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M580,540 Q610,${f1(540 - 120 * e)} 660,${f1(540 - 170 * e)}" stroke="#2B2F45" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="${f1(420)}" cy="${f1(540 - 170 * e)}" r="20" fill="${C.red}"/><circle cx="660" cy="${f1(540 - 170 * e)}" r="20" fill="${C.red}"/>` }
  s += pop(t, c('ask') - .1, bubble(0, 0, 560, 140, 'IN THIS STORY...', { fs: 54 }), 540, 330);
  s += kb > 0 ? stamp(t, c('bug'), 540, 1120, "WHO'S THE BUG?", { c: C.red, fs: 74, rot: -6 }) : '';
  return s
};

D.next = (t, S, T) => {
  const c = T.c;
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#120A0E"/>` + rays(540, 760, 1300, t, '#E5383B', 14, .1);
  s += rise(t, S.a + .1, txt(540, 340, 'NEXT', { fs: 60, fill: '#E5383B', ls: 6 }), 20);
  s += rise(t, c('know') - .1, txt(540, 440, 'WHAT DO YOU KNOW ABOUT', { fs: 52, fill: '#fff', ls: 2 }), 20);
  s += pop(t, c('rabies') - .1, txt(0, 0, 'RABIES?', { fs: 140, fill: '#E5383B', st: '#fff', sw: 8 }), 540, 580);
  // глаза собаки в темноте
  s += pop(t, S.a + .3, `<ellipse cx="-110" cy="0" rx="70" ry="44" fill="#E5383B"/><ellipse cx="110" cy="0" rx="70" ry="44" fill="#E5383B"/><circle cx="-110" cy="0" r="16" fill="#120A0E"/><circle cx="110" cy="0" r="16" fill="#120A0E"/><path d="M-140,-70 L-60,-40 M140,-70 L60,-40" stroke="#E5383B" stroke-width="14" stroke-linecap="round"/>`, 540, 880);
  s += pop(t, c('follow') + .2, btn(0, 0, 420, 116, 'FOLLOW', { c: '#E5383B', fs: 56, press: Math.max(0, Math.sin(t * 6)) * .6 }), 540, 1180);
  return s
};

window.EP = {
  D, cap: { y: C.mango, r: C.red, ink: '#0C0D12' }, trColor: C.leaf2,
  tr: { vape: 'iris', claim: 'flash', plant: 'zoom', nicot: 'slide', spray: 'slide', brain: 'iris', pod: 'slideR', deaths: 'flash', bug: 'zoom', you: 'iris', next: 'wipe' },
  trAt: { vape: [540, 760], brain: [540, 640], you: [540, 700] }, trCol: { claim: '#fff', deaths: '#000', next: C.red },
};
})();
