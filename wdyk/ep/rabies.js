// What do you know about rabies? — «вирус, который водит хозяина как машину» + что делать при укусе
(() => {
const C = { k: '#10131E', k2: '#1A1F2E', red: '#E5383B', w: '#fff', water: '#3AA8FF', vir: '#8E5CFF', g: '#3CC47C', y: '#FFC83D', skin: '#F2C29B', fur: '#B07A4A' };
const D = {};

function dog(x, y, s, t, o = {}) {
  const ang = o.angry, bob = Math.sin(t * (ang ? 9 : 3)) * (ang ? 4 : 2), fur = o.fur || C.fur, furD = shade(fur, -.2);
  let g = shadowE(0, 6, 220, 20, .2);
  g += `<path d="M-180,-150 Q-260,-200 -250,-260" stroke="${fur}" stroke-width="26" fill="none" stroke-linecap="round" transform="rotate(${f1(Math.sin(t * (ang ? 2 : 8)) * 10)} -180 -150)"/>`;
  for (const lx of [-150, -90, 90, 150]) g += `<rect x="${lx - 22}" y="-130" width="44" height="130" rx="20" fill="${lx < 0 ? furD : fur}"/>`;
  g += `<ellipse cx="0" cy="-170" rx="220" ry="100" fill="${fur}"/><ellipse cx="20" cy="-130" rx="140" ry="50" fill="${shade(fur, .15)}"/>`;
  g += `<g transform="translate(200 ${-250 + bob})"><path d="M-40,-80 L-70,-160 L0,-100Z M30,-90 L40,-170 L80,-100Z" fill="${furD}"/><circle cx="0" cy="0" r="100" fill="${fur}"/>` +
    `<ellipse cx="110" cy="40" rx="90" ry="54" fill="${shade(fur, .1)}"/><ellipse cx="190" cy="20" rx="24" ry="18" fill="#2A1A12"/>`;
  if (ang) g += `<path d="M40,96 L190,70" stroke="#5E2121" stroke-width="30" stroke-linecap="round"/>` + [60, 90, 120, 150, 175].map((xx, i) => `<path d="M${xx},${84 - i * 3} l10,-22 l10,22Z" fill="#fff"/>`).join('') +
    `<path d="M-30,-40 L50,-10" stroke="#2A1A12" stroke-width="14" stroke-linecap="round"/>`;
  else g += `<path d="M60,90 Q120,110 180,70" stroke="#5E2121" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  g += `<circle cx="40" cy="-16" r="${ang ? 14 : 16}" fill="${ang ? C.red : '#2A1A12'}"/><circle cx="46" cy="-22" r="5" fill="#fff"/>`;
  if (o.foam) for (let i = 0; i < 9; i++) { const ph = (t * 1.4 + i / 9) % 1; g += `<circle cx="${f1(70 + i * 16 + Math.sin(i * 3) * 8)}" cy="${f1(100 + ph * 70)}" r="${f1(14 - ph * 6)}" fill="#fff" opacity="${f3(1 - ph * .6)}"/>` }
  g += `</g>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s * (o.flip ? -1 : 1))} ${f3(s)})">${g}</g>`
}
function virus(x, y, s, t, o = {}) {   // вирус бешенства — в форме пули
  const w = Math.sin(t * 6 + (o.ph || 0)) * 3;
  let spikes = ''; for (let i = 0; i < 9; i++) { const yy = -70 + i * 18; spikes += `<path d="M-46,${yy} L-62,${yy - 4} M46,${yy} L62,${yy - 4}" stroke="${shade(o.c || C.vir, -.25)}" stroke-width="6" stroke-linecap="round"/>` }
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)}) rotate(${f1((o.rot || 0) + w)})">${spikes}<path d="M-46,90 L-46,-30 Q-46,-110 0,-110 Q46,-110 46,-30 L46,90Z" fill="${o.c || C.vir}"/>` +
    `<path d="M10,-100 Q40,-80 40,-30 L40,80 L22,80 L22,-30 Q22,-70 10,-100Z" fill="#fff" opacity=".2"/>${o.face ? `<circle cx="-14" cy="-30" r="8" fill="#fff"/><circle cx="14" cy="-30" r="8" fill="#fff"/><path d="M-14,0 Q0,12 14,0" stroke="#fff" stroke-width="5" fill="none"/>` : ''}</g>`
}
function glass(x, y, s, t, lvl = .7) {
  const wv = Math.sin(t * 3) * 6;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><path d="M-90,-160 L90,-160 L70,140 L-70,140Z" fill="#fff" opacity=".35"/>` +
    `<path d="M${-90 + 20 * (1 - lvl)},${f1(-160 + 300 * (1 - lvl) + wv)} Q0,${f1(-170 + 300 * (1 - lvl) - wv)} ${90 - 20 * (1 - lvl)},${f1(-160 + 300 * (1 - lvl) + wv)} L70,140 L-70,140Z" fill="${C.water}" opacity=".85"/>` +
    `<path d="M-90,-160 L90,-160 L70,140 L-70,140Z" fill="none" stroke="#fff" stroke-width="8"/></g>`
}
function bat(x, y, s, t) {
  const f = Math.sin(t * 14) * 20;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><path d="M0,0 C-40,${-30 - f} -110,${-50 - f} -170,${-10 - f} C-140,0 -120,10 -110,30 C-90,10 -70,14 -60,30 C-40,14 -20,16 0,26Z" fill="#2B2236"/>` +
    `<path d="M0,0 C40,${-30 - f} 110,${-50 - f} 170,${-10 - f} C140,0 120,10 110,30 C90,10 70,14 60,30 C40,14 20,16 0,26Z" fill="#2B2236"/><ellipse cx="0" cy="10" rx="30" ry="40" fill="#3A2F48"/><path d="M-16,-26 L-10,-50 L-2,-28 M16,-26 L10,-50 L2,-28" fill="#3A2F48"/><circle cx="-10" cy="-6" r="5" fill="${C.red}"/><circle cx="10" cy="-6" r="5" fill="${C.red}"/></g>`
}
function syringe(x, y, s, rot = 0, press = 0) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)})"><rect x="-200" y="-40" width="300" height="80" rx="14" fill="#fff" opacity=".9"/><rect x="${f1(-190 + press * 120)}" y="-30" width="${f1(180 - press * 120)}" height="60" fill="${C.g}" opacity=".85"/>` +
    `<rect x="${f1(-280 + press * 120)}" y="-12" width="100" height="24" fill="#CFD6E2"/><rect x="${f1(-300 + press * 120)}" y="-50" width="24" height="100" rx="8" fill="#CFD6E2"/><rect x="100" y="-6" width="160" height="12" fill="#CFD6E2"/>` +
    [-140, -90, -40, 10, 60].map(xx => `<rect x="${xx}" y="-40" width="4" height="22" fill="#8A93A6"/>`).join('') + `</g>`
}

D.title = (t, S, T) => {
  const c = T.c;
  let s = bgFlat(C.k, t, { dots: .3, c3: '#1E2333', c2: '#07080D' }) + rays(540, 900, 1200, t, C.red, 14, .1);
  s += rise(t, .05, txt(540, 470, 'WHAT DO YOU KNOW', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += rise(t, .25, txt(540, 560, 'ABOUT', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += dropText(t, c('rabies') - .15, 540, 760, 'RABIES?', { fs: 160, fill: C.red, st: '#fff', sw: 10 });
  s += pop(t, .4, dog(0, 0, .85, t, { angry: true, foam: true, fur: '#5A4A3E' }), 440, 1220);
  s += pop(t, .6, pill(0, 0, 'DISEASES · PART 1', { bg: C.red, fg: '#fff', fs: 34 }), 540, 330);
  return s
};

D.dog = (t, S, T) => {
  const c = T.c, kf = pr(t, c('foam') - .2, .4);
  let s = bgFlat('#3A4157', t, { dots: .2 });
  s += floor(1160, '#2A2F40');
  s += dog(380, 1160, 1.15, t, { angry: kf > 0, foam: kf > 0 });
  s += pop(t, c('foam') - .1, pill(0, 0, 'FOAMING', { bg: '#fff', fs: 50 }), 760, 470);
  return s
};

D.claim = (t, S, T) => {
  const c = T.c, kw = pr(t, c('water') - .2, .4);
  let s = bgFlat(kw > 0 ? '#0E2240' : C.k2, t, { dots: .2 });
  s += person({ x: 330, y: 1260, s: .95, skin: C.skin, hair: '#3A2A20', hs: 'short', top: '#4A6FA5', pants: '#2B2F45', pose: kw > 0 ? 'shrug' : 'down', mouth: kw > 0 ? 'scream' : 'flat', talk: .7, look: [1, 0], brow: kw > 0 ? -1 : 0, sweat: kw > 0 });
  s += glass(800, 900, 1.3, t);
  if (kw > 0) for (let i = 0; i < 3; i++) { const k = ((t * 1.2 + i / 3) % 1); s += `<ellipse cx="800" cy="1110" rx="${f1(80 + k * 220)}" ry="${f1(20 + k * 50)}" fill="none" stroke="${C.water}" stroke-width="6" opacity="${f3(1 - k)}"/>` }
  s += stamp(t, c('water'), 540, 420, 'AFRAID OF WATER', { c: C.water, fs: 70, rot: -6 });
  return s
};

D.hydro = (t, S, T) => {
  const c = T.c, s2 = S.sents[1].a, ksp = pr(t, c('spasms') - .2, .3), kh = pr(t, c('hydrophobia') - .2, .4);
  let s = bgFlat('#0E2240', t, { dots: .2 });
  if (t < s2) {
    s += person({ x: 540, y: 1300, s: 1.05, skin: C.skin, hair: '#3A2A20', hs: 'short', top: '#4A6FA5', pants: '#2B2F45', pose: 'hold', mouth: ksp > 0 ? 'scream' : 'o', talk: .8, look: [0, -.6], brow: ksp > 0 ? 1 : 0,
      item: (x, y) => glass(x - 105, y - 40, .45, t) });
    if (ksp > 0) { const p = .5 + .5 * Math.sin(t * 16); s += `<circle cx="540" cy="${1300 - 560}" r="${f1(60 + p * 20)}" fill="url(#glowR)"/>` + [0, 1, 2, 3].map(i => `<path transform="translate(${540 + (i - 1.5) * 70} ${1300 - 560 + (i % 2 ? -20 : 20)}) scale(.6)" d="M0,-40 L-18,4 L6,4 L-10,44 L28,-10 L4,-10 L18,-40Z" fill="${C.y}"/>`).join('') }
    s += pop(t, c('spasms') - .1, pill(0, 0, 'THROAT SPASMS', { bg: C.red, fg: '#fff', fs: 48 }), 540, 400);
  } else {
    // даже вид воды
    s += glass(540, 700, 2.2, t);
    s += `<g opacity="${f3(.5 + .5 * Math.sin(t * 10))}"><path d="M200,700 L320,700 M760,700 L880,700" stroke="${C.red}" stroke-width="14" stroke-linecap="round"/></g>`;
    s += kh > 0 ? `<g transform="translate(540 1180) scale(${f3(sp(kh))})"><rect x="-340" y="-64" width="680" height="128" rx="64" fill="#fff"/>${txt(0, 24, 'HYDROPHOBIA', { fs: 72, fill: C.red })}</g>` : '';
    s += pop(t, c('sight') - .1, pill(0, 0, 'EVEN THE SIGHT OF IT', { bg: C.y, fs: 46 }), 540, 330);
  }
  return s
};

D.nerves = (t, S, T) => {
  const c = T.c, lt = T.lt, s2 = S.sents[1].a;
  let s = bgFlat(C.k2, t, { dots: .2 });
  // силуэт тела и нерв от руки к мозгу
  s += `<g transform="translate(540 1240)" opacity=".9"><circle cx="0" cy="-860" r="110" fill="#2C3550"/><path d="M-150,-740 L150,-740 L170,-300 L-170,-300Z" fill="#2C3550"/><path d="M-150,-720 L-330,-420 M150,-720 L330,-420" stroke="#2C3550" stroke-width="70" stroke-linecap="round"/><path d="M-80,-300 L-90,0 M80,-300 L90,0" stroke="#2C3550" stroke-width="80" stroke-linecap="round"/></g>`;
  const path = 'M870,820 L700,580 L560,520 L540,420 L540,330';
  s += `<path d="${path}" stroke="${C.y}" stroke-width="10" fill="none" stroke-dasharray="20 14" opacity=".8"/>`;
  s += `<circle cx="540" cy="380" r="70" fill="#FF9EC4" opacity=".9"/>`;
  // вирус ползёт
  const k = clamp(lt / 6.5), P = [[870, 820], [700, 580], [560, 520], [540, 420], [540, 360]];
  const seg = Math.min(3, Math.floor(k * 4)), kk = k * 4 - seg, vx = lerp(P[seg][0], P[seg + 1][0], kk), vy = lerp(P[seg][1], P[seg + 1][1], kk);
  s += virus(vx, vy, .45, t, { face: true });
  s += pop(t, S.a + .2, pill(0, 0, 'BITE', { bg: C.red, fg: '#fff', fs: 40 }), 900, 900);
  s += pop(t, c('nerves') - .1, pill(0, 0, 'ALONG THE NERVES', { bg: C.y, fs: 46 }), 540, 1180 - 10);
  if (t > s2) s += pop(t, s2, `<rect x="-170" y="-90" width="340" height="180" rx="24" fill="#fff"/>${txt(0, -10, c('months') < t ? 'MONTHS' : 'WEEKS', { fs: 66, fill: C.k })}${txt(0, 54, 'FEEL FINE :)', { fs: 40, fill: C.g })}`, 280, 560);
  return s
};

D.bite = (t, S, T) => {
  const c = T.c, s2 = S.sents[1].a, kb = pr(t, c('bite') - .2, .3);
  let s = bgFlat(t > s2 ? '#2A1420' : C.k2, t, { dots: .2 });
  if (t < s2) {
    s += dog(380, 1180, 1.1, t, { angry: c('aggressive') < t + .2, foam: true });
    // капля слюны с вирусами
    s += pop(t, c('saliva') - .1, `<path d="M0,-130 C60,-60 100,-10 100,40 A100,100 0 1 1 -100,40 C-100,-10 -60,-60 0,-130Z" fill="#E9F2FF" opacity=".95"/>${virus(-30, 40, .3, t, { ph: 1 })}${virus(30, 30, .3, t, { ph: 2, rot: 30 })}${virus(0, 80, .26, t, { ph: 3, rot: -20 })}`, 820, 520);
    s += kb > 0 ? stamp(t, c('bite'), 540, 330, 'BITE', { c: C.red, fs: 120, rot: -8 }) : '';
  } else {
    // вирус за рулём внутри головы
    s += `<g transform="translate(540 760)"><circle r="360" fill="${C.fur}"/><circle r="300" fill="#FFD7E4"/>` +
      `<g transform="translate(0 40)"><circle r="150" fill="none" stroke="#333" stroke-width="30"/><path d="M-150,0 L150,0 M0,0 L0,150" stroke="#333" stroke-width="22"/><circle r="40" fill="#333"/></g>` +
      `${virus(0, -120, .9, t, { face: true })}</g>`;
    s += stamp(t, c('car') - .1, 540, 1220 - 60, 'IN THE DRIVER SEAT', { c: C.red, fs: 62, rot: -5 });
  }
  return s
};

D.fatal = (t, S, T) => {
  const c = T.c, lt = T.lt, s2 = S.sents[1].a;
  let s = bgFlat('#120B10', t, { dots: .2 });
  if (t < s2) {
    // монитор: пульс → прямая
    const flat = t > c('fatal') - .2;
    let d = 'M80,760'; for (let x = 80; x <= 1000; x += 10) { const ph = (x / 120 - lt * 3) % 1, y = flat ? 760 : 760 - (Math.abs(ph - .5) < .05 ? 160 * Math.sign(.5 - ph + .02) : 0); d += ` L${x},${f1(y)}` }
    s += `<rect x="60" y="560" width="960" height="400" rx="30" fill="#061410"/><path d="${d}" stroke="${flat ? C.red : C.g}" stroke-width="8" fill="none"/>`;
    s += pop(t, c('100%') - .1, txt(0, 0, '≈100%', { fs: 190, fill: C.red, st: '#fff', sw: 8 }), 540, 430);
    s += pop(t, c('fatal') - .05, pill(0, 0, 'AFTER SYMPTOMS', { bg: '#fff', fs: 46 }), 540, 1100);
  } else {
    for (let i = 0; i < 48; i++) { const q = i % 8, r = Math.floor(i / 8); s += mini(140 + q * 115, 560 + r * 100, 1.05, '#3A3D48', { head: '#3A3D48' }) }
    s += pop(t, s2 + .1, txt(0, 0, 'TENS OF THOUSANDS', { fs: 74, fill: '#fff' }), 540, 360);
    s += pop(t, c('every') - .1, pill(0, 0, 'EVERY YEAR', { bg: C.red, fg: '#fff', fs: 50 }), 540, 470);
  }
  return s
};

D.cure = (t, S, T) => {
  const c = T.c, lt = T.lt, s2 = S.sents[1].a, kv = pr(t, c('vaccine') - .2, .5);
  let s = bgFlat(t > s2 ? '#E7F7EE' : '#F3EEE3', t, { dots: .2, c2: t > s2 ? '#CDEEDB' : '#E3DCCB', c3: '#fff' });
  if (t < s2) {
    s += pop(t, c('1885') - .1, pill(0, 0, '1885', { bg: C.k, fg: '#fff', fs: 60 }), 540, 330);
    s += person({ x: 330, y: 1240, s: .95, skin: C.skin, hair: '#5A5A5A', hs: 'short', top: '#2B2F45', pants: '#2B2F45', pose: kv > 0 ? 'point' : 'down', mouth: 'smile', beard: true });
    s += pop(t, c('pasteur') - .1, pill(0, 0, 'LOUIS PASTEUR', { bg: '#fff', fs: 40 }), 330, 450);
    s += person({ x: 800, y: 1240, s: .62, skin: C.skin, hair: '#C9A26B', hs: 'short', top: C.y, pants: '#4A6FA5', pose: 'down', mouth: kv > 0 ? 'grin' : 'flat', look: [-1, 0] });
    s += pop(t, c('boy') - .1, pill(0, 0, 'BOY, 9', { bg: C.y, fs: 40 }), 800, 680);
    s += kv > 0 ? syringe(560, 640, .9 * sp(kv), -10, clamp((t - c('vaccine')) / 1)) : '';
  } else {
    // укус → уколы → ✓
    const step = (x, lab, at, icon) => pop(t, at, `<circle r="120" fill="#fff"/>${icon}${txt(0, 190, lab, { fs: 40, fill: C.k })}`, x, 720);
    s += step(200, 'BITE', s2 + .1, `<path d="M-50,-20 L-30,10 L-10,-20 L10,10 L30,-20 L50,10" stroke="${C.red}" stroke-width="14" fill="none" stroke-linecap="round"/>`);
    s += step(540, 'SHOTS', c('shots') - .1, syringe(0, 0, .35, -30, .5));
    s += step(880, 'SAVED', c('works') - .1, `<path d="M-50,0 L-14,36 L54,-40" stroke="${C.g}" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
    s += `<g opacity=".5">${arrowR(300, 720, 120, C.k, 10)}${arrowR(640, 720, 120, C.k, 10)}</g>`;
    s += pop(t, c('right') - .1, pill(0, 0, 'RIGHT AFTER THE BITE', { bg: C.g, fg: '#fff', fs: 46 }), 540, 400);
  }
  return s
};

D.you = (t, S, T) => {
  const c = T.c;
  let s = bgFlat('#E7F7EE', t, { dots: .2, c2: '#CDEEDB', c3: '#fff' });
  const kc = pr(t, c('wash') - .4, .4);
  if (kc < 1) {
    // до чек-листа: рука, след укуса, собака и летучая мышь
    s += `<g opacity="${f3(1 - kc)}">` + `<path d="M200,1100 L520,800 Q560,760 600,790 L640,830 Q660,870 620,900 L330,1180Z" fill="${C.skin}"/>` +
      `<path d="M520,860 l14,-14 l14,14 l14,-14 l14,14" stroke="${C.red}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      dog(260, 640, .45, t, { angry: true }) + `</g>`;
    s += pop(t, c('bites') - .1, pill(0, 0, 'ANY ANIMAL', { bg: '#fff', fs: 46 }), 300, 360);
  }
  s += pop(t, c('bat') - .3, bat(0, 0, 1.1, t), 800, 420);
  s += pop(t, c('wait') - .1, pill(0, 0, "DON'T WAIT", { bg: C.red, fg: '#fff', fs: 56 }), 380, 470);
  const item = (y, n, lab, at) => pop(t, at, `<rect x="-400" y="-70" width="800" height="140" rx="30" fill="#fff"/><circle cx="-320" cy="0" r="46" fill="${C.g}"/>${txt(-320, 18, n, { fs: 50, fill: '#fff' })}${txt(-240, 20, lab, { fs: 52, fill: C.k, a: 'start' })}`, 540, y);
  s += item(620, '1', 'WASH THE WOUND', c('wash') - .1);
  s += item(800, '2', 'SEE A DOCTOR', c('doctor') - .1);
  s += item(980, '3', 'TODAY', c('today') - .1);
  return s
};

D.next = (t, S, T) => {
  const c = T.c;
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#1E140C"/>` + rays(540, 760, 1300, t, '#C9A26B', 14, .1);
  s += rise(t, S.a + .1, txt(540, 340, 'PART 2', { fs: 60, fill: '#C9A26B', ls: 6 }), 20);
  s += rise(t, c('know') - .1, txt(540, 440, 'WHAT DO YOU KNOW ABOUT', { fs: 52, fill: '#fff', ls: 2 }), 20);
  s += pop(t, c('plague') - .1, txt(0, 0, 'THE PLAGUE?', { fs: 120, fill: '#C9A26B', st: '#fff', sw: 8 }), 540, 580);
  // силуэт клювастой маски
  s += pop(t, S.a + .3, `<path d="M-120,-60 Q-120,-180 0,-180 Q120,-180 120,-60 L120,40 Q60,60 0,40 L-20,40 Q-140,60 -120,-60Z" fill="#6B5238"/><path d="M60,-20 Q300,40 380,180 Q220,120 60,80Z" fill="#7E6243"/><circle cx="-30" cy="-60" r="34" fill="#F2E3C6"/><circle cx="50" cy="-60" r="34" fill="#F2E3C6"/><circle cx="-30" cy="-60" r="16" fill="#1E140C"/><circle cx="50" cy="-60" r="16" fill="#1E140C"/><path d="M-170,-150 L170,-150 L130,-210 L-130,-210Z" fill="#4A3826"/>`, 470, 900);
  s += pop(t, c('follow') + .2, btn(0, 0, 420, 116, 'FOLLOW', { c: C.red, fs: 56, press: Math.max(0, Math.sin(t * 6)) * .6 }), 540, 1180);
  return s
};

window.EP = {
  D, cap: { y: C.y, r: C.red, ink: '#07080D' }, trColor: C.red,
  tr: { dog: 'iris', claim: 'flash', hydro: 'zoom', nerves: 'slide', bite: 'slideR', fatal: 'flash', cure: 'iris', you: 'slide', next: 'wipe' },
  trAt: { dog: [540, 900], cure: [540, 700] }, trCol: { claim: '#fff', fatal: '#000', next: '#C9A26B' },
};
})();
