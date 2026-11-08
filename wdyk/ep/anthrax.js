// What do you know about anthrax? — настоящий заговор: Свердловск-1979 и «плохое мясо»; Ямал-2016
(() => {
const C = { gray: '#3A3F47', conc: '#8A8F99', red: '#C62828', y: '#F2C230', k: '#121417', snow: '#F2F4F7', ice: '#BFE6F2', w: '#fff', g: '#3CC47C' };
const D = {};

function bio(x, y, s, t, c = C.y) {   // знак биологической опасности (упрощённый)
  let g = ''; for (let i = 0; i < 3; i++) g += `<g transform="rotate(${i * 120})"><circle cx="0" cy="-70" r="70" fill="${c}"/><circle cx="0" cy="-92" r="46" fill="${C.k}"/></g>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)}) rotate(${f1(t * 10)})">${g}<circle r="40" fill="${C.k}"/><circle r="22" fill="${c}"/><circle r="120" fill="none" stroke="${c}" stroke-width="14" stroke-dasharray="30 40"/></g>`
}
function blocks(t, y0 = 1160, op = 1) {   // советские панельки
  let g = ''; [[40, 170, 420], [230, 210, 520], [460, 180, 380], [660, 200, 560], [880, 170, 440]].forEach(([x, w, h], i) => {
    g += `<rect x="${x}" y="${y0 - h}" width="${w}" height="${h}" fill="${shade(C.conc, -.1 * (i % 2))}"/>`;
    for (let r = 0; r < Math.floor(h / 70); r++) for (let q = 0; q < Math.floor(w / 50); q++) g += `<rect x="${x + 14 + q * 50}" y="${y0 - h + 20 + r * 70}" width="28" height="34" fill="${R(i * 50 + r * 7 + q, 3) > .7 ? '#FFE9A6' : '#5C626D'}"/>`
  });
  return `<g opacity="${op}">${g}</g>`
}
function spores(t, x, y, n, r, c = '#E8E2C8', seed = 1) {
  let g = ''; for (let i = 0; i < n; i++) { const a = R(i, seed) * 6.28, d = r * Math.sqrt(R(i, seed + 1)), ph = R(i, seed + 2) * 6.28; g += `<ellipse cx="${f1(x + Math.cos(a) * d + Math.sin(t + ph) * 8)}" cy="${f1(y + Math.sin(a) * d + Math.cos(t * 1.3 + ph) * 8)}" rx="7" ry="4" fill="${c}" transform="rotate(${f1(ph * 57)} ${f1(x + Math.cos(a) * d)} ${f1(y + Math.sin(a) * d)})"/>` }
  return g
}
function envelope(x, y, s, t, open = 0) {
  let g = `<rect x="-240" y="-150" width="480" height="300" rx="16" fill="#F4F1EA"/><path d="M-240,-150 L0,${f1(20 - open * 160)} L240,-150" stroke="#C9C3B5" stroke-width="10" fill="${open > 0 ? '#E6E0D2' : 'none'}"/>`;
  if (open > 0) for (let i = 0; i < 18; i++) { const ph = ((t * .5 + i / 18) % 1); g += `<circle cx="${f1((R(i, 2) - .5) * 200 + Math.sin(t + i) * 10)}" cy="${f1(-150 - ph * 260)}" r="${f1(4 + R(i, 3) * 6)}" fill="#fff" opacity="${f3(open * (1 - ph))}"/>` }
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${g}</g>`
}
function lab(x, y, s, t, smoke = 0) {
  let g = `<rect x="-260" y="-260" width="520" height="260" fill="#59606B"/><rect x="-260" y="-290" width="520" height="40" fill="#474D57"/><rect x="140" y="-480" width="70" height="230" fill="#474D57"/>`;
  for (let q = 0; q < 6; q++) g += `<rect x="${-230 + q * 78}" y="-200" width="44" height="60" fill="#2E333A"/>`;
  g += `<rect x="-340" y="-60" width="680" height="60" fill="none" stroke="#9AA0A9" stroke-width="6"/>` + [...Array(12)].map((_, i) => `<line x1="${-340 + i * 62}" y1="-60" x2="${-340 + i * 62}" y2="0" stroke="#9AA0A9" stroke-width="6"/>`).join('');
  g += `<g transform="translate(-180 -110)"><rect x="-70" y="-50" width="140" height="100" fill="${C.y}"/>${bio(0, 0, .28, 0, C.k)}</g>`;
  if (smoke > 0) for (let i = 0; i < 6; i++) { const ph = (t * .3 + i / 6) % 1; g += `<circle cx="${f1(175 + ph * 500)}" cy="${f1(-500 - ph * 120)}" r="${f1(50 + ph * 90)}" fill="#C9C3B5" opacity="${f3(smoke * .55 * (1 - ph))}"/>` }
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${g}</g>`
}
function reindeer(x, y, s, t, dead) {
  const g = `<path d="M-70,0 L-70,-90 M-40,0 L-40,-90 M50,0 L50,-90 M80,0 L80,-90" stroke="#7A5A3E" stroke-width="18" stroke-linecap="round"/><ellipse cx="0" cy="-120" rx="120" ry="60" fill="#9C7650"/>` +
    `<g transform="translate(120 -170)"><ellipse cx="20" cy="0" rx="44" ry="32" fill="#9C7650"/><path d="M0,-24 L-10,-90 M-10,-60 L-40,-80 M-6,-80 L20,-110 M30,-24 L40,-90 M40,-60 L70,-80" stroke="#E8D9BF" stroke-width="9" stroke-linecap="round"/><circle cx="34" cy="-6" r="6" fill="#1B1612"/></g><path d="M-120,-140 L-140,-120" stroke="#E8D9BF" stroke-width="12" stroke-linecap="round"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})${dead ? ' rotate(90) translate(-60 40)' : ''}" opacity="${dead ? .75 : 1}">${g}</g>`
}

D.title = (t, S, T) => {
  const c = T.c;
  let s = bgFlat(C.k, t, { dots: .3, c3: '#1F2228', c2: '#08090B' }) + rays(540, 900, 1300, t, C.y, 14, .08);
  s += rise(t, .05, txt(540, 470, 'WHAT DO YOU KNOW', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += rise(t, .25, txt(540, 560, 'ABOUT', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += dropText(t, c('anthrax') - .15, 540, 760, 'ANTHRAX?', { fs: 140, fill: C.y, st: '#fff', sw: 8 });
  s += pop(t, .4, bio(0, 0, 1.3, t), 540, 1080);
  s += pop(t, .6, pill(0, 0, 'DISEASES · PART 3', { bg: C.y, fs: 34 }), 540, 330);
  return s
};

D.letters = (t, S, T) => {
  const c = T.c, ko = pr(t, c('powder') - .3, .6);
  let s = bgFlat('#2B2F36', t, { dots: .2 });
  s += envelope(540, 820, 1.3, t, ko);
  s += pop(t, c('2001') - .1, pill(0, 0, '2001 · USA', { bg: '#fff', fs: 54 }), 540, 400);
  s += pop(t, c('powder') - .1, pill(0, 0, 'WHITE POWDER', { bg: C.y, fs: 46 }), 540, 1130);
  return s
};

D.claim = (t, S, T) => {
  const c = T.c, km = pr(t, c('meat') - .2, .4), kb = pr(t, c('breathed') - .2, 1.2);
  let s = bgFlat('#4A505A', t, { dots: .2 });
  s += blocks(t);
  s += floor(1160, '#2E333A');
  s += `<rect x="-300" y="-300" width="1680" height="2520" fill="#C9C3B5" opacity="${f3(.35 * kb)}"/>` + spores(t, 540, 700, Math.floor(60 * kb), 520);
  s += km > 0 ? `<g transform="translate(540 470) scale(${f3(sp(km))})"><rect x="-300" y="-120" width="600" height="240" rx="10" fill="#F4F1EA"/>${txt(0, -40, 'OFFICIAL:', { fs: 44, fill: '#555' })}${txt(0, 50, '"BAD MEAT"', { fs: 90, fill: C.red })}</g>` : '';
  s += pop(t, c('soviet') - .1, pill(0, 0, 'A WHOLE SOVIET CITY', { bg: C.red, fg: '#fff', fs: 46 }), 540, 1240 - 70);
  return s
};

D.city = (t, S, T) => {
  const c = T.c, s2 = S.sents[S.sents.length - 1].a - .1, kn = pr(t, c('yekaterinburg') - .2, .5);
  let s = bgFlat('#5A606B', t, { dots: .15 });
  s += blocks(t) + floor(1160, '#2E333A');
  if (t < s2) {
    s += pop(t, c('1979') - .1, `<rect x="-160" y="-150" width="320" height="300" rx="20" fill="#fff"/><rect x="-160" y="-150" width="320" height="90" rx="20" fill="${C.red}"/><rect x="-160" y="-90" width="320" height="30" fill="${C.red}"/>${txt(0, -82, 'APRIL', { fs: 50, fill: '#fff' })}${txt(0, 80, '1979', { fs: 100, fill: C.k })}`, 270, 470);
    s += pop(t, c('sverdlovsk') - .1, `<rect x="-280" y="-60" width="560" height="120" rx="12" fill="#1F4E8C"/>${txt(0, 24, kn > 0 ? 'YEKATERINBURG' : 'SVERDLOVSK', { fs: 62, fill: '#fff' })}`, 680, 470 + 120);
    s += kn > 0 ? `<path d="M410,${590 - 4} L950,${590 + 4}" stroke="${C.red}" stroke-width="0"/>` : '';
  } else {
    // кашель, больница
    for (let i = 0; i < 6; i++) { const x = 140 + i * 160, y = 1140; s += mini(x, y, 1.8, '#E9ECF2') + `<path d="M${x + 30},${y - 130} q30,-10 50,10 M${x + 34},${y - 110} q30,0 46,20" stroke="#fff" stroke-width="5" fill="none" opacity="${f3(.5 + .5 * Math.sin(t * 8 + i))}"/>` }
    s += pop(t, c('pneumonia') - .1, pill(0, 0, 'STRANGE "PNEUMONIA"', { bg: C.red, fg: '#fff', fs: 50 }), 540, 470);
    s += pop(t, s2 + .1, `<rect x="-90" y="-90" width="180" height="180" rx="20" fill="#fff"/><rect x="-24" y="-64" width="48" height="128" fill="${C.red}"/><rect x="-64" y="-24" width="128" height="48" fill="${C.red}"/>`, 540, 760);
  }
  return s
};

D.meat = (t, S, T) => {
  const c = T.c, kb = pr(t, c('believed') - .2, .5);
  let s = bgFlat('#E9E4D8', t, { dots: .2 });
  // официальная бумага со штампом
  s += `<g transform="translate(540 650) rotate(-3)"><rect x="-320" y="-300" width="640" height="600" rx="10" fill="#fff"/><rect x="-260" y="-230" width="520" height="16" rx="8" fill="#DDD"/><rect x="-260" y="-190" width="420" height="16" rx="8" fill="#DDD"/>` +
    `${txt(0, -60, 'CAUSE OF DEATH:', { fs: 44, fill: '#555' })}${txt(0, 40, 'CONTAMINATED', { fs: 66, fill: C.k })}${txt(0, 120, 'MEAT', { fs: 90, fill: C.red })}</g>`;
  s += stamp(t, c('official') + .1, 760, 900, 'OFFICIAL', { c: C.red, fs: 64, rot: -14 });
  if (kb > 0) for (let i = 0; i < 4; i++) s += `<g opacity="${f3(kb)}">${mini(220 + i * 210, 1200, 1.4, '#3E7BFF')}<path d="M${200 + i * 210},1050 l14,14 l26,-30" stroke="${C.g}" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;
  s += pop(t, c('western') - .1, pill(0, 0, 'WESTERN SCIENTISTS: "OK"', { bg: '#3E7BFF', fg: '#fff', fs: 40 }), 540, 330);
  return s
};

D.lab = (t, S, T) => {
  const c = T.c, ks = pr(t, c('secret') - .2, .4);
  let s = bgFlat('#3A3F47', t, { dots: .15 });
  s += pop(t, c('1992') - .1, pill(0, 0, '1992', { bg: '#fff', fs: 60 }), 540, 330);
  // трибуна и человек (без портрета)
  s += person({ x: 300, y: 1180, s: .8, skin: '#F2C29B', hair: '#E6E6E6', hs: 'short', top: '#2B2F45', pants: '#2B2F45', pose: 'point', mouth: 'talk', talk: T.talk, look: [1, 0] });
  s += `<rect x="190" y="980" width="220" height="200" rx="10" fill="#7A2E2E"/>`;
  s += pop(t, c('yeltsin') - .2, pill(0, 0, 'BORIS YELTSIN', { bg: '#fff', fs: 40 }), 300, 460);
  s += pop(t, c('accident') - .2, lab(0, 0, .7, t, 0), 790, 1180);
  s += ks > 0 ? stamp(t, c('secret'), 790, 640, 'MILITARY LAB', { c: C.red, fs: 56, rot: -8 }) : '';
  return s
};

D.cloud = (t, S, T) => {
  const c = T.c, kw = clamp((t - c('wind') + .8) / 2.2), kd = clamp((t - c('64') + .5) / 1);
  let s = bgFlat('#5A606B', t, { dots: .15 });
  s += lab(260, 1160, .75, t, 1) + blocks(t, 1160, .6).replace(/<g opacity="0.6">/, '<g opacity="0.6" transform="translate(300 0) scale(.75)">');
  s += floor(1160, '#2E333A');
  // облако спор ползёт по ветру
  s += `<g opacity=".9">${spores(t, 420 + kw * 500, 640 + kw * 80, 70, 160 + kw * 120, '#E8E2C8', 4)}</g>`;
  s += arrowR(160, 360, 300, '#fff', 14) + txt(330, 330, 'WIND', { fs: 40, fill: '#fff', a: 'middle' });
  s += kd > 0 ? `<g transform="translate(540 470)">${counter(0, 0, Math.round(64 * eio(kd)), { bg: '#121417', fg: '#fff', cw: 110, ch: 160, fs: 130 })}${txt(0, 150, 'AT LEAST · DEAD', { fs: 44, fill: '#fff', ls: 3 })}</g>` : '';
  return s
};

D.map = (t, S, T) => {
  const c = T.c, k = clamp((t - c('mapped') + .3) / 2.4), kl = pr(t, c('narrow') - .3, .6);
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#E8EDE2"/>`;
  // карта сверху: улицы-сетка
  for (let i = 0; i < 14; i++) s += `<line x1="${i * 90 - 40}" y1="0" x2="${i * 90 + 60}" y2="1920" stroke="#C9D2BE" stroke-width="10"/><line x1="0" y1="${200 + i * 90}" x2="1080" y2="${180 + i * 90}" stroke="#C9D2BE" stroke-width="10"/>`;
  // лаборатория и узкий конус по ветру
  const LX = 200, LY = 560;
  s += kl > 0 ? `<path d="M${LX},${LY} L1080,${LY + 300} L1080,${LY + 470} Z" fill="${C.red}" opacity="${f3(.16 * kl)}"/>` : '';
  s += `<g transform="translate(${LX} ${LY})"><rect x="-50" y="-50" width="100" height="100" fill="#474D57"/>${bio(0, 0, .25, 0, C.y)}</g>`;
  for (let i = 0; i < 40; i++) {
    const u = R(i, 5), v = R(i, 6) - .5, x = LX + 60 + u * 820, y = LY + u * 380 + 40 + v * (40 + u * 140), kk = pr(t, c('mapped') + i * .05, .3);
    if (kk > 0) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(11 * sp(kk))}" fill="${C.red}"/>`
  }
  s += arrowR(600, 330, 260, C.k, 12) + txt(730, 300, 'WIND', { fs: 40, fill: C.k });
  s += pop(t, c('narrow') - .1, pill(0, 0, 'A NARROW LINE DOWNWIND', { bg: C.k, fg: '#fff', fs: 44 }), 540, 1170);
  return s
};

D.yamal = (t, S, T) => {
  const c = T.c, s2 = S.sents[1].a, kh = pr(t, c('heat') - .2, .8), kd = clamp((t - c('2,000') + .6) / 1.3);
  let s = '';
  if (t < s2) {
    s += `<rect x="-300" y="-300" width="1680" height="2520" fill="#9FD3E6"/>` + floor(700, C.ice) + `<rect x="-300" y="700" width="1680" height="40" fill="#fff"/>`;
    // споры спят во льду
    s += spores(t * .2, 540, 1000, 40, 260, '#5E7C8A', 8);
    for (let i = 0; i < 3; i++) s += txt(640 + i * 50, 860 - i * 50, 'z', { fs: 60 + i * 16, fill: '#3E5A68', op: .5 + .5 * Math.sin(t * 2 + i) });
    s += pop(t, c('decades') - .1, pill(0, 0, 'ASLEEP FOR DECADES', { bg: '#fff', fs: 48 }), 540, 400);
  } else {
    s += `<rect x="-300" y="-300" width="1680" height="2520" fill="${kh > 0 ? '#F2C38A' : '#9FD3E6'}"/>`;
    s += `<circle cx="820" cy="330" r="${f1(110 + 30 * kh)}" fill="#FFE27A"/><circle cx="820" cy="330" r="${f1(200 * kh)}" fill="url(#glowY)"/>`;
    s += floor(820, '#8FA67A') + `<rect x="-300" y="900" width="1680" height="1000" fill="${shade(C.ice, -.15 * kh)}"/>`;
    // оттаявшая туша и олени
    s += `<g transform="translate(300 1000)" opacity="${f3(.4 + .6 * kh)}"><ellipse cx="0" cy="0" rx="150" ry="50" fill="#6B5B4A"/><path d="M-80,-10 L-100,-60 M-40,-10 L-50,-70 M0,-10 L0,-70 M40,-10 L50,-66" stroke="#E8D9BF" stroke-width="10" stroke-linecap="round"/></g>` + spores(t, 300, 940, Math.floor(30 * kh), 140, '#E8E2C8', 3);
    for (let i = 0; i < 5; i++) s += reindeer(560 + i * 110, 820 + (i % 2) * 30, .55, t, kd > (i + 1) / 6);
    s += pop(t, c('2016') - .1, pill(0, 0, 'SIBERIA · 2016', { bg: '#fff', fs: 48 }), 360, 400);
    s += kd > 0 ? `<g transform="translate(540 1160)"><rect x="-320" y="-60" width="640" height="120" rx="30" fill="#000" opacity=".55"/>${txt(0, 22, `${fmt(2000 * eio(kd))}+ REINDEER`, { fs: 60, fill: '#fff' })}</g>` : '';
    s += pop(t, c('boy') - .1, `<rect x="-200" y="-50" width="400" height="100" rx="50" fill="${C.k}"/><rect x="-150" y="-20" width="20" height="44" rx="4" fill="#fff"/><path d="M-140,-22 q8,-16 0,-28 q-8,12 0,28z" fill="${C.y}"/>${txt(20, 18, '1 CHILD DIED', { fs: 40, fill: '#fff' })}`, 760, 560);
  }
  return s
};

D.you = (t, S, T) => {
  const c = T.c, kf = pr(t, c('frozen') - .2, .5), melt = clamp((t - S.a) / 4);
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#0E1A22"/>`;
  // тающая глыба льда, внутри — споры
  const h = 520 * (1 - .25 * melt);
  s += `<path d="M260,${f1(1160 - h)} L820,${f1(1160 - h + 40)} L860,1160 L220,1160Z" fill="${C.ice}" opacity=".9"/><path d="M300,${f1(1160 - h + 30)} L520,${f1(1160 - h + 50)} L480,1160 L280,1160Z" fill="#fff" opacity=".25"/>`;
  for (let i = 0; i < 8; i++) { const x = 300 + i * 70, ph = (t * 1.5 + i * .3) % 1; s += `<path d="M${x},1160 q-6,${f1(30 * ph)} 0,${f1(60 * ph)}" stroke="${C.ice}" stroke-width="10" stroke-linecap="round" opacity="${f3(1 - ph)}"/>` }
  s += `<rect x="-300" y="1160" width="1680" height="800" fill="#16303B"/>`;
  s += kf > 0 ? `<g opacity="${f3(kf)}">${spores(t, 540, 1160 - h / 2, 50, 200, '#F2C230', 9)}</g>` + bio(540, 1160 - h / 2, .7 * sp(kf), t, C.red) : '';
  s += pop(t, c('melting') - .1, pill(0, 0, 'THE ICE IS MELTING', { bg: '#fff', fs: 48 }), 540, 380);
  s += kf > 0 ? stamp(t, c('frozen'), 540, 520, "WHAT'S INSIDE?", { c: C.y, fs: 70, rot: -6 }) : '';
  return s
};

D.next = (t, S, T) => {
  const c = T.c;
  let s = bgFlat('#1F2228', t, { dots: .2 });
  const B = [['RABIES', 120, 470, -6], ['PLAGUE', 700, 560, 5], ['MALARIA?', 220, 760, 4], ['LEPROSY?', 760, 860, -5], ['???', 540, 1020, 0]];
  B.forEach(([w, x, y, r], i) => { s += pop(t, S.a + .2 + i * .25, `<g transform="rotate(${r})">${bubble(0, 0, w.length * 40 + 120, 120, w, { fs: 50, bg: i === 4 ? C.y : '#fff', tail: i % 2 ? 'br' : 'bl' })}</g>`, x + (x < 540 ? 120 : -60), y) });
  s += pop(t, c('comments') - .1, pill(0, 0, 'TELL ME IN THE COMMENTS', { bg: C.red, fg: '#fff', fs: 46 }), 540, 330);
  s += pop(t, c('comments') + .3, btn(0, 0, 420, 116, 'FOLLOW', { c: C.y, fg: C.k, fs: 56, press: Math.max(0, Math.sin(t * 6)) * .6 }), 540, 1200);
  return s
};

window.EP = {
  D, cap: { y: C.y, r: '#FF5A5A', ink: '#08090B' }, trColor: C.y,
  tr: { letters: 'iris', claim: 'flash', city: 'zoom', meat: 'slide', lab: 'slideR', cloud: 'zoom', map: 'iris', yamal: 'up', you: 'flash', next: 'wipe' },
  trAt: { letters: [540, 1080], map: [200, 560] }, trCol: { claim: '#fff', you: '#000' },
};
})();
