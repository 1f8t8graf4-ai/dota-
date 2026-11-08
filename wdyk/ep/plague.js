// What do you know about the plague? — «всё, что ты знаешь, — неправда, и она до сих пор здесь»
(() => {
const C = { par: '#EADBC0', par2: '#D9C4A0', sep: '#5A3E2B', k: '#1B1612', red: '#B3261E', teal: '#1FA2A8', teal2: '#0F5F63', w: '#fff', y: '#FFC83D', g: '#3CC47C' };
const D = {};
const AF = [[.30, .02], [.48, 0], [.60, .06], [.70, .05], [.80, .12], [.86, .22], [.98, .30], [.95, .36], [.86, .45], [.83, .56], [.78, .66], [.72, .78], [.64, .90], [.56, .99], [.48, .97], [.43, .86], [.40, .72], [.36, .60], [.30, .50], [.18, .47], [.08, .42], [.02, .32], [.05, .20], [.15, .10]];
const EU = [[.05, .62], [.12, .5], [.2, .52], [.25, .4], [.35, .38], [.38, .2], [.5, .08], [.62, .05], [.7, .15], [.66, .3], [.8, .3], [.95, .35], [1, .55], [.9, .7], [.75, .72], [.66, .9], [.6, .8], [.5, .78], [.45, .95], [.38, .78], [.3, .74], [.22, .8], [.1, .82], [.04, .75]];
const US = [[0, .2], [.12, .05], [.5, .08], [.7, .1], [.82, .02], [.92, .15], [1, .12], [.95, .35], [.88, .55], [.8, .62], [.78, .95], [.7, .75], [.55, .78], [.45, .95], [.35, .78], [.18, .72], [.05, .55]];
const poly = (P, x0, y0, w, h) => P.map(([x, y]) => `${f1(x0 + x * w)},${f1(y0 + y * h)}`).join(' ');

function mask(x, y, s, o = {}) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s * (o.flip ? -1 : 1))} ${f3(s)})">` +
    `<path d="M-90,-40 Q-90,-130 0,-130 Q90,-130 90,-40 L90,40 Q50,58 0,44 L-30,44 Q-100,58 -90,-40Z" fill="${o.c || '#3A2E22'}"/>` +
    `<path d="M50,-14 Q240,30 300,150 Q170,104 50,70Z" fill="${shade(o.c || '#3A2E22', .15)}"/>` +
    `<circle cx="-20" cy="-42" r="28" fill="#F2E3C6"/><circle cx="44" cy="-42" r="28" fill="#F2E3C6"/><circle cx="-20" cy="-42" r="13" fill="#1B1612"/><circle cx="44" cy="-42" r="13" fill="#1B1612"/>` +
    `<path d="M-150,-110 L150,-110 L110,-180 L-110,-180Z" fill="${shade(o.c || '#3A2E22', -.2)}"/><rect x="-160" y="-118" width="320" height="18" rx="8" fill="${shade(o.c || '#3A2E22', -.3)}"/>` +
    (o.herbs ? `<g opacity="${f3(o.herbs)}">${[0, 1, 2, 3, 4].map(i => `<ellipse cx="${100 + i * 34}" cy="${30 + i * 16}" rx="16" ry="8" fill="${C.g}" transform="rotate(${20 + i * 10} ${100 + i * 34} ${30 + i * 16})"/>`).join('')}</g>` : '') + `</g>`
}
function doctor(x, y, s, t) {
  // тело — плащ; голова целиком закрыта маской (лицо человечка не рисуем)
  return person({ x, y, s, skin: '#2A221B', hair: '#2A221B', hs: 'buzz', top: '#2A221B', pants: '#2A221B', shoe: '#1B1612', pose: [14, 6, 60, -40], mouth: 'none', blink: true }) +
    `<ellipse cx="${f1(x)}" cy="${f1(y - 668 * s)}" rx="${f1(80 * s)}" ry="${f1(86 * s)}" fill="#2A221B"/>` + mask(x + 6 * s, y - 690 * s, .95 * s)
}
function rat(x, y, s, t, o = {}) {
  const w = Math.sin(t * 8) * 6;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s * (o.flip ? -1 : 1))} ${f3(s)})">${shadowE(0, 4, 120, 12, .15)}<path d="M-110,-30 Q-220,${-20 + w} -260,${-70 - w}" stroke="#C9A6A0" stroke-width="10" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="0" cy="-50" rx="120" ry="58" fill="#7A6B66"/><ellipse cx="120" cy="-62" rx="56" ry="40" fill="#7A6B66"/><circle cx="96" cy="-104" r="22" fill="#C9A6A0"/><circle cx="150" cy="-70" r="8" fill="#1B1612"/><circle cx="178" cy="-56" r="9" fill="#E8A0A0"/>` +
    `<path d="M-50,-4 L-60,0 M40,-4 L50,0" stroke="#C9A6A0" stroke-width="10" stroke-linecap="round"/></g>`
}
function flea(x, y, s, t, c = '#6B3A20') {
  const j = Math.abs(Math.sin(t * 5)) * 20;
  return `<g transform="translate(${f1(x)} ${f1(y - j)}) scale(${f3(s)})"><ellipse cx="0" cy="0" rx="60" ry="40" fill="${c}"/><circle cx="56" cy="-10" r="20" fill="${shade(c, -.2)}"/>` +
    `<path d="M-30,30 L-60,70 M0,36 L-10,80 M30,30 L50,76" stroke="${shade(c, -.3)}" stroke-width="8" stroke-linecap="round"/><path d="M-20,-20 Q-80,-120 -40,-90" stroke="${shade(c, -.3)}" stroke-width="8" fill="none"/><circle cx="62" cy="-14" r="5" fill="#fff"/></g>`
}
function critter(x, y, s, t, o = {}) {   // луговая собачка / суслик
  const sick = o.sick, c = o.c || '#C69C6D';
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${shadowE(0, 6, 80, 12, .15)}<ellipse cx="0" cy="-90" rx="70" ry="100" fill="${c}"/><ellipse cx="0" cy="-60" rx="44" ry="60" fill="${shade(c, .3)}"/>` +
    `<circle cx="0" cy="-200" r="56" fill="${c}"/><circle cx="-36" cy="-246" r="14" fill="${shade(c, -.2)}"/><circle cx="36" cy="-246" r="14" fill="${shade(c, -.2)}"/>` +
    (sick ? `<path d="M-30,-212 L-10,-200 M30,-212 L10,-200" stroke="#1B1612" stroke-width="8" stroke-linecap="round"/><path d="M-14,-170 Q0,-180 14,-170" stroke="#1B1612" stroke-width="6" fill="none"/><rect x="30" y="-200" width="70" height="14" rx="7" fill="#fff" transform="rotate(-20 30 -200)"/><circle cx="100" cy="-226" r="9" fill="${C.red}"/>`
      : `<circle cx="-20" cy="-206" r="9" fill="#1B1612"/><circle cx="20" cy="-206" r="9" fill="#1B1612"/><path d="M-10,-180 Q0,-170 10,-180" stroke="#1B1612" stroke-width="6" fill="none"/>`) +
    `<path d="M-40,-120 Q-60,${-100 + Math.sin(t * 3) * 6} -30,-90 M40,-120 Q60,${-100 + Math.cos(t * 3) * 6} 30,-90" stroke="${shade(c, -.2)}" stroke-width="16" fill="none" stroke-linecap="round"/></g>`
}
function pills(x, y, s, t) {
  let g = ''; for (let i = 0; i < 5; i++) { const a = -40 + i * 20 + Math.sin(t * 2 + i) * 4; g += `<g transform="translate(${(i - 2) * 90} ${Math.sin(t * 3 + i) * 10}) rotate(${a})"><rect x="-70" y="-30" width="140" height="60" rx="30" fill="#fff"/><path d="M0,-30 L40,-30 A30,30 0 0 1 40,30 L0,30Z" fill="${C.teal}"/></g>` }
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${g}</g>`
}
function parch(t) { return `<rect x="-300" y="-300" width="1680" height="2520" fill="${C.par}"/><rect x="-300" y="-300" width="1680" height="2520" fill="url(#dots)" opacity=".25"/><circle cx="160" cy="300" r="380" fill="${C.par2}" opacity=".35"/>` }

D.title = (t, S, T) => {
  const c = T.c;
  let s = parch(t) + rays(540, 900, 1300, t, C.sep, 14, .06);
  s += rise(t, .05, txt(540, 470, 'WHAT DO YOU KNOW', { fs: 74, fill: C.sep, ls: 3 }), 30);
  s += rise(t, .25, txt(540, 560, 'ABOUT', { fs: 74, fill: C.sep, ls: 3 }), 30);
  s += dropText(t, c('plague') - .2, 540, 760, 'THE PLAGUE?', { fs: 124, fill: C.red, st: C.par, sw: 10 });
  s += pop(t, .4, mask(0, 0, 1.3), 470, 1110);
  s += pop(t, .6, pill(0, 0, 'DISEASES · PART 2', { bg: C.sep, fg: '#fff', fs: 34 }), 540, 330);
  return s
};

D.old = (t, S, T) => {
  const c = T.c;
  let s = parch(t);
  // средневековый город
  let city = ''; [[60, 140, 320], [200, 120, 420], [330, 160, 360], [500, 120, 460], [630, 150, 340], [780, 130, 400], [910, 140, 300]].forEach(([x, w, h]) => {
    city += `<rect x="${x}" y="${1160 - h}" width="${w}" height="${h}" fill="#BFA27A"/><path d="M${x - 10},${1160 - h} L${x + w / 2},${1160 - h - 90} L${x + w + 10},${1160 - h}Z" fill="#8A5A34"/><rect x="${x + w / 2 - 18}" y="${1160 - h + 60}" width="36" height="50" fill="#5A3E2B"/>`
  });
  s += city + floor(1160, '#A88B66');
  s += pop(t, c('medieval') - .1, pill(0, 0, 'MEDIEVAL', { bg: C.sep, fg: '#fff', fs: 50 }), 540, 330);
  s += pop(t, c('rats') - .2, rat(0, 0, 1, t), 280, 1240);
  s += pop(t, c('masks') - .4, doctor(0, 0, .95, t), 760, 1250);
  return s
};

D.claim = (t, S, T) => {
  const c = T.c, kw = pr(t, c('wrong') - .2, .3), kh = pr(t, c('here') - .3, .5);
  let s = kh > 0 ? bgFlat(C.teal2, t, { dots: .2 }) : parch(t);
  if (kh <= 0) {
    s += mask(400, 700, 1.1) + rat(700, 1150, .8, t);
    s += kw > 0 ? stamp(t, c('wrong'), 540, 420, 'WRONG', { c: C.red, fs: 140, rot: -10 }) : '';
  } else {
    s += globe(540, 760, 300, t, { rot: T.lt * 60, sea: '#2A8C91', land: '#BFE3D0' });
    s += `<g transform="translate(540 600)"><path d="M0,0 C-30,-40 -40,-60 -40,-78 A40,40 0 1 1 40,-78 C40,-60 30,-40 0,0Z" fill="${C.red}"/><circle cx="0" cy="-78" r="16" fill="#fff"/></g>`;
    s += stamp(t, c('here') - .1, 540, 1150, 'STILL HERE', { c: C.y, fs: 90, rot: -6 });
  }
  return s
};

D.death = (t, S, T) => {
  const c = T.c, k = clamp((t - S.a - .2) / 2.4);
  let s = parch(t);
  const X0 = 140, Y0 = 380, W = 800, H = 700;
  s += `<polygon points="${poly(EU, X0, Y0, W, H)}" fill="#CBB590"/>`;
  // тьма расползается
  s += `<g><clipPath id="euC"><polygon points="${poly(EU, X0, Y0, W, H)}"/></clipPath><g clip-path="url(#euC)"><circle cx="${X0 + .55 * W}" cy="${Y0 + .85 * H}" r="${f1(900 * eo(k))}" fill="#2A1E14" opacity=".85"/></g></g>`;
  s += `<polygon points="${poly(EU, X0, Y0, W, H)}" fill="none" stroke="${C.sep}" stroke-width="6"/>`;
  s += pill(540, 330, `${Math.round(lerp(1347, 1351, eo(k)))}`, { bg: C.sep, fg: '#fff', fs: 56 });
  s += pop(t, c('half') - .1, `<circle r="120" fill="${C.red}"/>${txt(0, 30, '½', { fs: 120, fill: '#fff' })}`, 860, 1080);
  return s
};

D.mask = (t, S, T) => {
  const c = T.c, s2 = c('beak', 1) - .1, kl = clamp((t - S.a - .3) / 1.6);
  let s = parch(t);
  if (t < s2) {
    // таймлайн 1347 → 1600-е
    s += `<rect x="120" y="760" width="840" height="14" rx="7" fill="${C.sep}"/><rect x="120" y="760" width="${f1(840 * eo(kl))}" height="14" rx="7" fill="${C.red}"/>`;
    s += txt(140, 860, '1347', { fs: 60, fill: C.sep, a: 'start' }) + (kl > .9 ? txt(940, 860, '1600s', { fs: 60, fill: C.red, a: 'end' }) : '');
    s += pop(t, S.a + .2, `<g>${rat(0, 0, .5, t)}</g>`, 220, 700);
    s += pop(t, c('300') - .1, mask(0, 0, .9), 860, 600);
    s += pop(t, c('later') - .1, pill(0, 0, '~300 YEARS LATER', { bg: C.red, fg: '#fff', fs: 48 }), 540, 400);
  } else {
    // разрез клюва: травы против «дурного воздуха»
    s += mask(400, 760, 1.6, { herbs: pr(t, c('herbs') - .2, .5) });
    s += pop(t, c('herbs') - .1, pill(0, 0, 'HERBS INSIDE', { bg: C.g, fg: '#fff', fs: 48 }), 760, 980);
    const ka = pr(t, c('air') - .3, .6);
    if (ka > 0) for (let i = 0; i < 5; i++) { const ph = (t * .5 + i * .2) % 1; s += `<circle cx="${f1(860 + Math.sin(i * 2 + t) * 60)}" cy="${f1(560 - ph * 200)}" r="${f1(40 + ph * 30)}" fill="#7B8B5A" opacity="${f3(ka * .5 * (1 - ph))}"/>` }
    s += pop(t, c('air') - .1, pill(0, 0, '"BAD AIR"', { bg: '#7B8B5A', fg: '#fff', fs: 48 }), 800, 400);
  }
  return s
};

D.rats = (t, S, T) => {
  const c = T.c, kf = pr(t, c('fleas') - .2, .5);
  let s = parch(t);
  s += pop(t, c('2018') - .1, pill(0, 0, '2018 STUDY', { bg: C.sep, fg: '#fff', fs: 50 }), 540, 330);
  s += `<g opacity="${f3(1 - .6 * kf)}">${rat(300, 1150, .9, t)}</g>` + (kf > 0 ? `<path d="M120,1080 L480,1180 M480,1080 L120,1180" stroke="${C.red}" stroke-width="16" stroke-linecap="round" opacity="${f3(kf)}"/>` : '');
  // лупа с блохой и вошью
  s += kf > 0 ? `<g transform="translate(660 640) scale(${f3(sp(kf))})"><circle r="230" fill="#fff" opacity=".7"/><circle r="230" fill="none" stroke="${C.sep}" stroke-width="22"/><rect x="150" y="150" width="40" height="160" rx="16" fill="${C.sep}" transform="rotate(-45 170 230)"/>${flea(-60, -20, .9, t)}${flea(80, 70, .7, t + 1, '#8A7A5A')}</g>` : '';
  s += pop(t, c('lice') - .1, pill(0, 0, 'HUMAN FLEAS & LICE', { bg: C.red, fg: '#fff', fs: 44 }), 660, 960);
  return s
};

D.rhyme = (t, S, T) => {
  const c = T.c, km = pr(t, c('myth') - .2, .3);
  let s = bgFlat('#F5E9D2', t, { dots: .2 });
  // хоровод
  for (let i = 0; i < 8; i++) { const a = t * .8 + i * .785, x = 540 + Math.cos(a) * 300, y = 800 + Math.sin(a) * 120; s += mini(x, y, 1.6, ['#E5383B', '#3E7BFF', '#3CC47C', '#FFB627'][i % 4]) }
  s += pop(t, S.a + .3, bubble(0, 0, 720, 140, '♪ RING A RING O\' ROSES ♪', { fs: 46 }), 540, 400);
  s += km > 0 ? stamp(t, c('myth'), 540, 1130, 'MYTH', { c: C.red, fs: 140, rot: -8 }) : '';
  return s
};

D.here = (t, S, T) => {
  const c = T.c, k = eio(clamp((t - S.a) / 1.2));
  let s = bgFlat(C.teal2, t, { dots: .2 }) + `<rect x="-300" y="-300" width="1680" height="2520" fill="${C.par}" opacity="${f3(1 - k)}"/>`;
  s += globe(540, 760, 320, t, { rot: T.lt * 80, sea: '#2A8C91', land: '#BFE3D0' });
  s += stamp(t, c('left') - .1, 540, 1150, 'NEVER LEFT', { c: C.y, fs: 96, rot: -6 });
  s += pop(t, S.a + .3, pill(0, 0, 'NOW', { bg: C.y, fs: 60 }), 540, 340);
  return s
};

D.usa = (t, S, T) => {
  const c = T.c, s2 = S.sents[1].a;
  let s = bgFlat('#E3F4F4', t, { dots: .2, c2: '#C9E8E8', c3: '#fff' });
  if (t < s2) {
    const X0 = 100, Y0 = 520, W = 880, H = 500;
    s += `<polygon points="${poly(US, X0, Y0, W, H)}" fill="#BFE3D0" stroke="${C.teal}" stroke-width="8"/>`;
    const P = [[.18, .45], [.24, .6], [.3, .5], [.33, .68], [.12, .3], [.2, .78], [.27, .38]];
    P.forEach(([x, y], i) => { const k = pr(t, c('seven') - .2 + i * .15, .35); if (k > 0) s += `<g transform="translate(${f1(X0 + x * W)} ${f1(Y0 + y * H)}) scale(${f3(sp(k))})"><path d="M0,0 C-20,-26 -26,-38 -26,-50 A26,26 0 1 1 26,-50 C26,-38 20,-26 0,0Z" fill="${C.red}"/><circle cx="0" cy="-50" r="10" fill="#fff"/></g>` });
    s += pop(t, c('seven') - .1, pill(0, 0, '~7 CASES A YEAR', { bg: C.red, fg: '#fff', fs: 50 }), 540, 380);
  } else {
    s += floor(1170, '#C8B08A');
    s += critter(330, 1170, 1.2, t) + critter(760, 1170, 1, t + 1, { c: '#9C7E5E' });
    s += pop(t, c('prairie') - .1, pill(0, 0, 'PRAIRIE DOGS', { bg: '#fff', fs: 44 }), 330, 640);
    s += pop(t, c('squirrels') - .1, pill(0, 0, 'SQUIRRELS', { bg: '#fff', fs: 44 }), 760, 700);
    s += pop(t, c('rodents') - .1, pill(0, 0, 'WILD RODENTS', { bg: C.teal, fg: '#fff', fs: 50 }), 540, 380);
  }
  return s
};

D.world = (t, S, T) => {
  const c = T.c, k2 = clamp((t - c('2,000') + .5) / 1.0);
  let s = bgFlat(C.teal2, t, { dots: .2 });
  const W = 560, H = 660, X0 = 540 - W / 2, Y0 = 340;
  s += `<polygon points="${poly(AF, X0, Y0, W, H)}" fill="#2A8C91"/><ellipse cx="${X0 + .9 * W}" cy="${Y0 + .8 * H}" rx="22" ry="62" fill="${pr(t, c('madagascar') - .2, .3) > 0 ? C.red : '#2A8C91'}"/>`;
  const kc = pr(t, c('congo') - .2, .3);
  s += `<circle cx="${X0 + .55 * W}" cy="${Y0 + .55 * H}" r="${f1(46 * sp(kc))}" fill="${C.red}" opacity=".9"/>`;
  s += pop(t, c('madagascar') - .1, pill(0, 0, 'MADAGASCAR', { bg: '#fff', fs: 40 }), 860, 960);
  s += pop(t, c('congo') - .1, pill(0, 0, 'CONGO', { bg: '#fff', fs: 40 }), 300, 760);
  if (k2 > 0) s += `<g transform="translate(540 1150)"><rect x="-330" y="-70" width="660" height="140" rx="30" fill="#000" opacity=".5"/>${txt(0, 30, `2017: ${fmt(2000 * eio(k2))}+ CASES`, { fs: 64, fill: C.y })}</g>`;
  return s
};

D.cure = (t, S, T) => {
  const c = T.c;
  let s = bgFlat('#E3F4F4', t, { dots: .2, c2: '#C9E8E8', c3: '#fff' });
  s += pop(t, c('antibiotics') - .2, pills(0, 0, 1.4, t), 540, 720);
  s += pop(t, c('antibiotics') - .1, pill(0, 0, 'ANTIBIOTICS', { bg: C.teal, fg: '#fff', fs: 60 }), 540, 400);
  s += pop(t, c('early') - .1, clock(0, 0, 110, t * .5, t * 6, { rim: C.red }) + txt(0, 200, 'EARLY', { fs: 60, fill: C.red }), 540, 1040);
  return s
};

D.you = (t, S, T) => {
  const c = T.c, kl = pr(t, c('let') - .2, .4);
  let s = bgFlat('#BFE3B5', t, { dots: .2, c2: '#9FD08F', c3: '#E2F4DC' });
  s += `<path d="M-300,1120 Q300,1060 540,1100 T1380,1080 L1380,2200 L-300,2200Z" fill="#8FBF6A"/>`;
  s += `<path d="M420,2200 Q500,1500 540,1100 Q580,1500 660,2200Z" fill="#D9C49A"/>`;
  s += critter(780, 1120, 1, t, { sick: t > c('sick') - .2, c: '#A4805A' });
  s += pop(t, c('sick') - .1, pill(0, 0, 'LOOKS SICK', { bg: C.red, fg: '#fff', fs: 46 }), 780, 640);
  s += kl > 0 ? `<g transform="translate(330 760) scale(${f3(sp(kl))})"><path d="M-80,60 L-80,-80 Q-80,-110 -50,-110 Q-20,-110 -20,-80 L-20,-150 Q-20,-180 10,-180 Q40,-180 40,-150 L40,-120 Q40,-150 70,-150 Q100,-150 100,-120 L100,40 Q100,140 0,140 Q-80,140 -80,60Z" fill="#fff"/></g>` : '';
  s += kl > 0 ? stamp(t, c('let'), 540, 380, 'LET IT BE', { c: C.teal2, fs: 96, rot: -6 }) : pop(t, S.a + .2, pill(0, 0, 'HIKING?', { bg: '#fff', fs: 50 }), 540, 380);
  return s
};

D.next = (t, S, T) => {
  const c = T.c;
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#14161A"/>` + rays(540, 760, 1300, t, '#F2C230', 14, .1);
  s += rise(t, S.a + .1, txt(540, 340, 'PART 3', { fs: 60, fill: '#F2C230', ls: 6 }), 20);
  s += rise(t, c('know') - .1, txt(540, 440, 'WHAT DO YOU KNOW ABOUT', { fs: 52, fill: '#fff', ls: 2 }), 20);
  s += pop(t, c('anthrax') - .1, txt(0, 0, 'ANTHRAX?', { fs: 130, fill: '#F2C230', st: '#fff', sw: 8 }), 540, 580);
  // конверт с порошком
  s += pop(t, S.a + .3, `<rect x="-220" y="-140" width="440" height="280" rx="16" fill="#F4F1EA"/><path d="M-220,-140 L0,20 L220,-140" stroke="#C9C3B5" stroke-width="10" fill="none"/>` +
    [0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${f1(-60 + i * 22 + Math.sin(t * 3 + i) * 6)}" cy="${f1(150 + ((t * .6 + i * .14) % 1) * 120)}" r="${6 + (i % 3) * 3}" fill="#fff" opacity=".8"/>`).join(''), 540, 900);
  s += pop(t, c('follow') + .2, btn(0, 0, 420, 116, 'FOLLOW', { c: C.red, fs: 56, press: Math.max(0, Math.sin(t * 6)) * .6 }), 540, 1220);
  return s
};

window.EP = {
  D, cap: { y: C.y, r: '#FF4D5E', ink: '#1B1612' }, trColor: C.sep,
  tr: { old: 'iris', claim: 'flash', death: 'zoom', mask: 'slide', rats: 'slide', rhyme: 'iris', here: 'flash', usa: 'zoom', world: 'slide', cure: 'iris', you: 'slide', next: 'wipe' },
  trAt: { old: [470, 1000], rhyme: [540, 800], cure: [540, 720] }, trCol: { claim: '#fff', here: C.teal, next: '#F2C230' },
};
})();
