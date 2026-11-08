// What do you know about IShowSpeed? — «он не стримит, он спидранит планету»
(() => {
const C = { k: '#111114', k2: '#1D1D24', red: '#E63946', w: '#fff', g: '#39FF88', gold: '#FFC83D', blue: '#2F6BFF', sea: '#1E7FD8' };
const SPD = { skin: '#6B4226', hair: '#141414', hs: 'buzz', top: C.red, pants: '#1B1B22', shoe: '#fff', hp: '#222' };
const D = {};
const jersey = `<text x="0" y="-360" text-anchor="middle" font-size="120" font-family="P" font-weight="900" fill="#fff" opacity=".95">7</text>`;

// полосы скорости
function speedLines(t, c = '#fff', op = .25, n = 22, sp_ = 2600) {
  let g = ''; for (let i = 0; i < n; i++) {
    const y = R(i, 1) * 1920, L = 200 + R(i, 2) * 500, x = 1300 - ((t * sp_ * (.6 + R(i, 3)) + R(i, 4) * 2600) % 2600);
    g += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(L)}" height="${f1(4 + R(i, 5) * 8)}" rx="4" fill="${c}" opacity="${f3(op * (.4 + .6 * R(i, 6)))}"/>`
  }
  return g
}
// игровой интерфейс: таймер спидрана
function hud(t, at, label = 'ANY%') {
  const tt = Math.max(0, t - at), m = Math.floor(tt / 60), s = Math.floor(tt % 60), ms = Math.floor((tt % 1) * 1000);
  const time = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  return `<g transform="translate(540 300)"><rect x="-330" y="-70" width="660" height="140" rx="24" fill="#000" opacity=".55"/>` +
    txt(-300, -18, 'SPEEDRUN ' + label, { fs: 30, fill: C.g, a: 'start', ls: 3 }) + txt(0, 48, time, { fs: 74, fill: '#fff', font: 'N' }) + `</g>`
}
function flag(x, y, s, on, t) {
  const w = Math.sin(t * 6) * 6;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><rect x="-6" y="-200" width="12" height="200" rx="6" fill="#ddd"/>` +
    `<path d="M6,-196 Q60,${-206 + w} 116,-186 L116,-116 Q60,${-126 + w} 6,-120Z" fill="${on ? C.g : C.red}"/>` +
    (on ? `<path d="M36,-160 L56,-140 L90,-176" stroke="#0B3D22" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : '') + `</g>`
}
// Африка — упрощённый контур
const AF = [[.30, .02], [.48, 0], [.60, .06], [.70, .05], [.80, .12], [.86, .22], [.98, .30], [.95, .36], [.86, .45], [.83, .56], [.78, .66], [.72, .78], [.64, .90], [.56, .99], [.48, .97], [.43, .86], [.40, .72], [.36, .60], [.30, .50], [.18, .47], [.08, .42], [.02, .32], [.05, .20], [.15, .10]];
const AFP = [[.30, .12], [.45, .10], [.62, .14], [.75, .20], [.80, .30], [.66, .30], [.50, .28], [.34, .26], [.18, .30], [.10, .36], [.28, .40], [.44, .42], [.60, .44], [.74, .44], [.66, .56], [.52, .58], [.58, .70], [.68, .74], [.54, .84], [.88, .76]];

D.title = (t, S, T) => {
  const c = T.c;
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="${C.k}"/>` + rays(540, 900, 1300, t, C.red, 14, .14) + speedLines(t, '#fff', .18);
  s += rise(t, .05, txt(540, 470, 'WHAT DO YOU KNOW', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += rise(t, .25, txt(540, 560, 'ABOUT', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += dropText(t, c('ishowspeed') - .2, 540, 760, 'ISHOWSPEED?', { fs: 108, fill: C.red, st: '#fff', sw: 12, gap: .035 });
  s += pop(t, .5, person({ ...SPD, x: 0, y: 0, s: .48, pose: 'cheer', mouth: 'scream', talk: .6 + .4 * Math.sin(t * 9), logo: jersey }), 540, 1265);
  s += pop(t, .6, pill(0, 0, 'PART 2', { bg: C.red, fg: '#fff', fs: 34 }), 540, 330);
  return s
};

D.bark = (t, S, T) => {
  const c = T.c, tb = c('barks'), tf = c('backflips'), ts = c('siuuu');
  let s = bgFlat(C.k2, t, { dots: .2, c3: '#2a2a33', c2: '#0c0c10' });
  let pose = 'down', mouth = 'talk', rot = 0, yy = 1230;
  if (t >= tb - .1 && t < tf - .1) { pose = 'hold'; mouth = 'scream' }
  if (t >= tf - .1 && t < ts - .2) { const k = pr(t, tf, .7); rot = eio(k) * 360; yy = 1230 - Math.sin(k * Math.PI) * 260; pose = 'up'; mouth = 'o' }
  if (t >= ts - .2) { pose = 'cheer'; mouth = 'scream' }
  s += shadowE(540, 1232, 200, 26, .25);
  s += `<g transform="rotate(${f1(rot)} 540 ${yy - 380})">${person({ ...SPD, x: 540, y: yy, s: .95, pose, mouth, talk: T.talk + .3, look: [0, 0], logo: jersey })}</g>`;
  if (t >= tb - .1 && t < tf) s += waves(700, 640, t, '#fff', 3, 1) + waves(380, 640, t, '#fff', 3, -1) + pop(t, tb, bubble(0, 0, 340, 130, 'WOOF!', { fs: 72, bg: C.gold, tail: 'br' }), 300, 360);
  s += out(t, ts - .25, pop(t, tf - .05, pill(0, 0, 'BACKFLIP', { bg: '#fff', fs: 42 }), 800, 420));
  s += t >= ts - .2 ? dropText(t, ts - .2, 540, 420, 'SIUUU!', { fs: 160, fill: C.gold, st: '#141022', sw: 18, gap: .04 }) : '';
  return s
};

D.claim = (t, S, T) => {
  const c = T.c, lt = T.lt;
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#08080C"/>`;
  for (let i = 0; i < 60; i++) s += `<circle cx="${f1(R(i, 1) * 1080)}" cy="${f1(R(i, 2) * 1400)}" r="${f1(1 + R(i, 3) * 2.5)}" fill="#fff" opacity="${f3(.25 + .6 * R(i, 4))}"/>`;
  const kE = pr(t, c('speedrunning') - .3, .7);
  s += globe(540, 780, 300 + 30 * eo(kE), t, { rot: lt * 160 });
  // экран игры вокруг
  s += `<rect x="40" y="200" width="1000" height="1080" rx="40" fill="none" stroke="${C.g}" stroke-width="8" opacity=".55"/>`;
  s += hud(t, c('speedrunning') - .3, 'PLANET EARTH');
  s += pop(t, c('earth') - .1, `<g><rect x="-330" y="-34" width="660" height="68" rx="34" fill="#000" opacity=".6"/><rect x="-322" y="-26" width="${f1(644 * .49)}" height="52" rx="26" fill="${C.g}"/>${txt(0, 18, 'WORLD 96 / 195', { fs: 38, fill: '#fff' })}</g>`, 540, 1180);
  s += stamp(t, c('streaming') - .1, 540, 520, 'NOT STREAMING', { c: C.red, fs: 70, rot: -8 });
  return s
};

D.name = (t, S, T) => {
  const c = T.c, k = pr(t, c('speed') - .25, .45);
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="${C.red}"/>` + speedLines(t, '#fff', .35, 30, 3600);
  const x = 540 + (1 - eo(k)) * 1300;
  s += k > 0 ? `<g transform="translate(${f1(x)} 760) skewX(${f1(-14 + (1 - eo(k)) * -20)})">${txt(0, 0, 'SPEED', { fs: 250, fill: '#fff', st: '#141022', sw: 16, ls: 8 })}` +
    `<rect x="-640" y="-110" width="${f1(300 * (1 - eo(k)) + 60)}" height="16" fill="#fff" opacity=".7"/><rect x="-700" y="-30" width="${f1(380 * (1 - eo(k)) + 80)}" height="16" fill="#fff" opacity=".7"/></g>` : '';
  s += rise(t, S.a + .1, txt(540, 420, 'THINK ABOUT THE NAME', { fs: 56, fill: '#141022', ls: 3 }), 20);
  // секундомер
  const a = T.lt * 9;
  s += pop(t, c('speed') + .2, `<circle r="120" fill="#141022"/><circle r="100" fill="#fff"/><rect x="-22" y="-160" width="44" height="40" rx="8" fill="#141022"/><line x1="0" y1="0" x2="${f1(Math.sin(a) * 80)}" y2="${f1(-Math.cos(a) * 80)}" stroke="${C.red}" stroke-width="12" stroke-linecap="round"/>`, 540, 1080);
  return s
};

D.rules = (t, S, T) => {
  const c = T.c, lt = T.lt;
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#5BC0FF"/>`;
  // облака
  for (let i = 0; i < 6; i++) { const x = ((i * 320 - lt * 120) % 1600 + 1600) % 1600 - 260, y = 300 + (i % 3) * 140; s += `<g transform="translate(${f1(x)} ${y})"><circle r="50" fill="#fff"/><circle cx="50" cy="10" r="40" fill="#fff"/><circle cx="-50" cy="12" r="38" fill="#fff"/></g>` }
  // уровни-платформы бегут влево
  const sc = lt * 700;
  for (let i = 0; i < 9; i++) {
    const x = i * 520 - sc, h = 160 + (i % 3) * 90;
    s += `<rect x="${f1(x)}" y="${1240 - h}" width="400" height="${h + 400}" fill="#3DBB5F"/><rect x="${f1(x)}" y="${1240 - h}" width="400" height="40" fill="#2E9A4B"/>` +
      `<rect x="${f1(x)}" y="${1280 - h}" width="400" height="${h + 400}" fill="url(#dots)" opacity=".5"/>` + txt(x + 200, 1240 - h - 40, `LEVEL ${i + 1}`, { fs: 44, fill: '#141022' }) + flag(x + 360, 1240 - h, .5, x + 360 < 540, t)
  }
  // бегун прыгает по платформам
  const i0 = Math.floor((sc + 540) / 520), h0 = 160 + (i0 % 3) * 90, fx = ((sc + 540) % 520) / 520, jump = fx > .78 ? Math.sin((fx - .78) / .22 * Math.PI) * 120 : 0;
  s += person({ ...SPD, x: 540, y: 1240 - h0 - jump, s: .42, pose: [40, -60, 140, 30], mouth: 'grin', logo: jersey, rot: 8 });
  s += hud(t, S.a);
  s += stamp(t, c('breaks'), 540, 560, 'NO BREAKS', { c: C.red, fs: 80, rot: -6 });
  return s
};

D.save = (t, S, T) => {
  const c = T.c, tb = c('barks'), tB = c('button'), tS = c('save');
  let s = bgFlat('#22222C', t, { dots: .2 });
  if (t < tS - .1) {
    // геймпад: кнопка нажимается на «button»
    const pr_ = t > tB ? Math.max(0, 1 - ((t - tB) % .5) * 5) : 0;
    s += pop(t, S.a + .1, `<g><path d="M-300,-120 Q-360,-120 -380,-40 L-430,170 Q-440,240 -370,250 Q-320,255 -280,190 L-230,110 L230,110 L280,190 Q320,255 370,250 Q440,240 430,170 L380,-40 Q360,-120 300,-120Z" fill="#2E2E3A"/>` +
      `<rect x="-250" y="-40" width="40" height="120" rx="10" fill="#555"/><rect x="-290" y="0" width="120" height="40" rx="10" fill="#555"/>` +
      `<circle cx="220" cy="-20" r="34" fill="${C.g}"/><circle cx="290" cy="40" r="34" fill="${C.red}" transform="translate(0 ${f1(pr_ * 8)})"/><circle cx="150" cy="40" r="34" fill="${C.blue}"/><circle cx="220" cy="100" r="34" fill="${C.gold}"/></g>`, 540, 720);
    s += t > tB ? pop(t, tB, pill(0, 0, 'PRESS ● TO SAVE', { bg: '#fff', fs: 46 }), 540, 470) : '';
  } else {
    const kS = pr(t, tS - .1, .5);
    s += `<g transform="translate(540 470) scale(${f3(sp(kS))})"><rect x="-110" y="-110" width="220" height="220" rx="20" fill="${C.blue}"/><rect x="-60" y="-110" width="120" height="80" fill="#cfd8ff"/><rect x="30" y="-100" width="20" height="56" fill="${C.blue}"/><rect x="-70" y="10" width="140" height="90" rx="8" fill="#fff"/></g>`;
    const kP = clamp((t - tS) / 1.0);
    if (t < tb - .15) s += `<g transform="translate(540 680)"><rect x="-260" y="-24" width="520" height="48" rx="24" fill="#000" opacity=".5"/><rect x="-252" y="-16" width="${f1(504 * kP)}" height="32" rx="16" fill="${C.g}"/>${txt(0, 90, 'SAVING...', { fs: 48, fill: '#fff', ls: 4 })}</g>`;
  }
  if (t >= tb - .15) {
    s += person({ ...SPD, x: 540, y: 1260, s: .8, pose: 'hold', mouth: 'scream', talk: .5 + .5 * Math.sin(t * 14), logo: jersey });
    s += waves(690, 760, t, C.gold, 3, 1) + waves(390, 760, t, C.gold, 3, -1);
    s += pop(t, tb, `<rect x="-300" y="-56" width="600" height="112" rx="56" fill="${C.g}"/>${txt(0, 22, 'GAME SAVED ✓', { fs: 56, fill: '#0B3D22' })}`, 540, 680);
    s += pop(t, tb + .2, bubble(0, 0, 300, 120, 'WOOF!', { fs: 66, bg: C.gold, tail: 'br' }), 300, 470);
  }
  return s
};

D.africa = (t, S, T) => {
  const c = T.c, kd = clamp((t - c('countries')) / 1.6);
  let s = bgFlat('#0F4C81', t, { dots: .25 });
  const W = 640, H = 760, X0 = 540 - W / 2, Y0 = 300;
  const pts = AF.map(([x, y]) => `${f1(X0 + x * W)},${f1(Y0 + y * H)}`).join(' ');
  s += `<polygon points="${pts}" fill="#000" opacity=".2" transform="translate(14 18)"/><polygon points="${pts}" fill="#F2B13D"/><ellipse cx="${X0 + .9 * W}" cy="${Y0 + .8 * H}" rx="22" ry="60" fill="#F2B13D"/>`;
  s += `<polygon points="${pts}" fill="url(#dots)" opacity=".5"/>`;
  // маршрут и пины
  const n = Math.floor(kd * 20 + (t > c('20') ? 1 : 0));
  let route = ''; for (let i = 0; i < Math.min(n, 20); i++) { const [x, y] = AFP[i]; route += (i ? 'L' : 'M') + f1(X0 + x * W) + ',' + f1(Y0 + y * H) }
  if (route) s += `<path d="${route}" stroke="#fff" stroke-width="6" stroke-dasharray="14 12" fill="none" opacity=".8"/>`;
  for (let i = 0; i < Math.min(n, 20); i++) {
    const [x, y] = AFP[i], k = pr(t, c('countries') + i * .08, .35);
    s += `<g transform="translate(${f1(X0 + x * W)} ${f1(Y0 + y * H)}) scale(${f3(sp(k))})"><path d="M0,0 C-20,-26 -26,-38 -26,-50 A26,26 0 1 1 26,-50 C26,-38 20,-26 0,0Z" fill="${C.red}"/><circle cx="0" cy="-50" r="10" fill="#fff"/></g>`
  }
  s += pop(t, c('20') - .1, pill(0, 0, `${Math.min(20, n)} COUNTRIES`, { bg: '#fff', fs: 50 }), 330, 1180);
  s += pop(t, c('28') - .1, pill(0, 0, '28 DAYS', { bg: C.red, fg: '#fff', fs: 50 }), 790, 1180);
  return s
};

D.carib = (t, S, T) => {
  const c = T.c, lt = T.lt;
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="${C.sea}"/>`;
  for (let i = 0; i < 18; i++) { const x = (R(i, 1) * 1300 + lt * 30) % 1300 - 100, y = 260 + R(i, 2) * 1000; s += `<path d="M${f1(x)},${f1(y)} q20,-12 40,0 q20,12 40,0" stroke="#fff" stroke-width="5" fill="none" opacity=".35"/>` }
  const IS = [[260, 470, 120, 70], [700, 560, 90, 60], [330, 860, 100, 64], [760, 1000, 130, 80]];
  IS.forEach(([x, y, rx, ry], i) => { s += `<ellipse cx="${x + 10}" cy="${y + 14}" rx="${rx}" ry="${ry}" fill="#000" opacity=".15"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#F6D58E"/><ellipse cx="${x - 10}" cy="${y - 8}" rx="${rx * .7}" ry="${ry * .6}" fill="#4CC36B"/>` });
  // путь за один стрим
  const k = clamp((t - c('four') + .3) / 2.2);
  let d = ''; IS.forEach(([x, y], i) => d += (i ? 'L' : 'M') + x + ',' + y);
  s += `<path d="${d}" stroke="#fff" stroke-width="10" stroke-dasharray="${f1(1400 * k)} 2000" fill="none" stroke-linecap="round"/>`;
  IS.forEach(([x, y], i) => { const kk = pr(t, c('four') - .3 + i * .55, .3); s += kk > 0 ? `<g transform="translate(${x} ${y - 40}) scale(${f3(sp(kk))})">${flag(0, 0, .45, true, t)}</g>` : '' });
  s += pop(t, S.a + .2, `<rect x="-120" y="-44" width="240" height="88" rx="18" fill="${C.red}"/><circle cx="-70" cy="0" r="14" fill="#fff" opacity="${(t % 1) < .6 ? 1 : .3}"/>${txt(20, 22, 'LIVE', { fs: 56, fill: '#fff' })}`, 540, 300);
  s += pop(t, c('single') - .1, pill(0, 0, '4 COUNTRIES · 1 STREAM', { bg: '#fff', fs: 48 }), 540, 1200);
  return s
};

D.count = (t, S, T) => {
  const c = T.c, s2 = S.sents[1].a;
  let s = bgFlat(C.k2, t, { dots: .2, c3: '#2a2a33', c2: '#0c0c10' });
  const k = clamp((t - (c('96') - 1)) / 1.2), n = Math.round(96 * eio(k));
  // флажки-плитки (условные цвета)
  const P = ['#E63946', '#2F6BFF', '#FFC83D', '#39FF88', '#fff', '#FF7A00', '#7B5CFF', '#21B5A0'];
  for (let i = 0; i < 96; i++) {
    if (i >= n) break; const q = i % 12, r = Math.floor(i / 12), x = 120 + q * 76, y = 520 + r * 56;
    s += `<rect x="${x - 30}" y="${y - 20}" width="60" height="40" rx="6" fill="${P[i % 8]}"/><rect x="${x - 30}" y="${y - 20}" width="20" height="40" rx="4" fill="${P[(i * 3 + 1) % 8]}"/>`
  }
  s += txt(540, 420, String(n), { fs: 190, fill: '#fff', st: '#000', sw: 10 });
  s += txt(540, 470 - 470 + 1010, 'COUNTRIES', { fs: 56, fill: C.gold, ls: 6 });
  if (t > s2 - .1) {
    const kk = pr(t, s2, .9), w = 760;
    s += `<g transform="translate(540 1150)"><rect x="${-w / 2 - 8}" y="-46" width="${w + 16}" height="92" rx="46" fill="#000"/><rect x="${-w / 2}" y="-38" width="${f1(w * (96 + 99 * eio(kk) * clamp((t - s2) / 4)) / 195)}" height="76" rx="38" fill="${C.g}"/>${txt(0, 20, 'THE REST: 2–3 YEARS', { fs: 44, fill: '#141022' })}</g>`
  }
  return s
};

D.boss = (t, S, T) => {
  const c = T.c, kn = pr(t, c('cristiano') - .2, .5);
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#140A0C"/>` + rays(540, 820, 1300, t, C.gold, 12, .08);
  s += `<ellipse cx="540" cy="1260" rx="520" ry="80" fill="${C.red}" opacity=".25"/>`;
  // босс — золотой силуэт с короной
  const glow = .6 + .4 * Math.sin(t * 4);
  s += `<circle cx="540" cy="760" r="${f1(400 + glow * 20)}" fill="url(#glowY)" opacity=".55"/>`;
  s += person({ x: 540, y: 1250, s: 1.12, skin: '#E0A82E', hair: '#B37F12', hs: 'short', top: '#F2C230', pants: '#C99417', shoe: '#E0A82E', pose: 'hips', mouth: 'flat', brow: 1, logo: `<text x="0" y="-360" text-anchor="middle" font-size="120" font-family="P" font-weight="900" fill="#B37F12">7</text>` });
  s += `<path transform="translate(540 380)" d="M-80,0 L-110,-90 L-40,-40 L0,-110 L40,-40 L110,-90 L80,0Z" fill="${C.gold}"/>`;
  // полоса здоровья
  s += `<g transform="translate(540 250)"><rect x="-420" y="-40" width="840" height="80" rx="16" fill="#000" opacity=".7"/><rect x="-410" y="-30" width="820" height="60" rx="12" fill="${C.red}"/>` +
    txt(0, -60, kn > 0 ? 'FINAL BOSS: CRISTIANO RONALDO' : 'FINAL BOSS', { fs: 40, fill: '#fff', ls: 2 }) + `</g>`;
  return s
};

D.ronaldo = (t, S, T) => {
  const c = T.c, s2 = S.sents[1].a, kk = pr(t, c('knees') - .2, .4), kd = clamp((t - s2) / 1.0);
  let s = bgFlat('#1B1030', t, { dots: .2 }) + rays(540, 760, 1300, t, C.gold, 12, .07);
  s += pop(t, c('2023') - .1, pill(0, 0, 'LISBON · 2023', { bg: '#fff', fs: 42 }), 540, 380);
  s += person({ x: 760, y: 1240, s: .85, skin: '#E0A82E', hair: '#B37F12', hs: 'short', top: '#F2C230', pants: '#C99417', shoe: '#E0A82E', pose: 'hips', mouth: 'smile', look: [-.8, .3], flip: true });
  s += person({ ...SPD, x: 330, y: 1240, s: .9, pose: kk > 0 ? 'up' : 'down', kneel: kk > 0, mouth: kk > 0 ? 'scream' : 'o', talk: .7, look: [.8, -.4], logo: jersey });
  if (kk > 0) s += sparkles(t, 330, 700, 8, 180, C.gold, 4);
  // полоса босса тает → «побеждён»
  const hp = 1 - eio(kd);
  s += `<g transform="translate(540 250)"><rect x="-420" y="-40" width="840" height="80" rx="16" fill="#000" opacity=".7"/><rect x="-410" y="-30" width="${f1(820 * Math.max(0, t < s2 ? 1 : hp))}" height="60" rx="12" fill="${C.red}"/></g>`;
  s += t > s2 ? stamp(t, s2 + .2, 540, 515, 'BOSS DEFEATED', { c: C.g, fs: 70, rot: -6 }) : '';
  s += pop(t, c('next') - .1, pill(0, 0, 'NEXT LEVEL ▶', { bg: C.g, fs: 52 }), 540, 1180);
  return s
};

D.space = (t, S, T) => {
  const c = T.c, lt = T.lt, s2 = S.sents[1].a, kr = clamp((t - c('space') + .6) / 1.8);
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#05050C"/>`;
  for (let i = 0; i < 90; i++) { const y = (R(i, 2) * 2000 + kr * 900 * (.5 + R(i, 5))) % 2000 - 40; s += `<circle cx="${f1(R(i, 1) * 1080)}" cy="${f1(y)}" r="${f1(1 + R(i, 3) * 2.5)}" fill="#fff" opacity="${f3(.3 + .6 * R(i, 4))}"/>` }
  // Земля уходит вниз, ракета вверх
  s += globe(540, 1500 + kr * 700, 620, t, { rot: lt * 30 });
  const ry = 1100 - eio(kr) * 600;
  s += `<g transform="translate(540 ${f1(ry)})"><path d="M0,-170 Q60,-110 60,0 L60,90 L-60,90 L-60,0 Q-60,-110 0,-170Z" fill="#fff"/><circle cx="0" cy="-40" r="34" fill="${C.blue}"/><circle cx="0" cy="-40" r="22" fill="#9FD0FF"/>` +
    `<path d="M-60,30 L-110,110 L-60,90Z M60,30 L110,110 L60,90Z" fill="${C.red}"/><path d="M-40,90 Q0,${f1(200 + Math.sin(t * 30) * 30)} 40,90Z" fill="${C.gold}"/><path d="M-22,90 Q0,${f1(160 + Math.sin(t * 40) * 20)} 22,90Z" fill="#fff"/></g>`;
  s += pop(t, c('space') - .1, `<rect x="-230" y="-48" width="460" height="96" rx="20" fill="${C.red}"/><circle cx="-170" cy="0" r="14" fill="#fff" opacity="${(t % 1) < .6 ? 1 : .3}"/>${txt(20, 22, 'LIVE FROM SPACE', { fs: 44, fill: '#fff' })}`, 540, 330);
  s += t > s2 - .1 ? stamp(t, c('last'), 540, 1180, 'LAST LEVEL', { c: C.gold, fs: 80, rot: -5 }) : '';
  return s
};

D.you = (t, S, T) => {
  const c = T.c, lt = T.lt, kc = pr(t, c('checkpoint') - .2, .5);
  let s = bgFlat('#5BC0FF', t, { dots: .25, c3: '#8FD3FF', c2: '#3E9BE0' });
  // «твоя страна» — остров, флаг-чекпоинт, бегун проносится
  s += `<ellipse cx="540" cy="1150" rx="520" ry="120" fill="#3DBB5F"/><ellipse cx="540" cy="1140" rx="480" ry="90" fill="#4CC36B"/>`;
  s += `<g transform="translate(540 700)"><path d="M0,0 C-40,-52 -52,-76 -52,-100 A52,52 0 1 1 52,-100 C52,-76 40,-52 0,0Z" fill="${C.red}"/><circle cx="0" cy="-100" r="22" fill="#fff"/></g>`;
  s += pop(t, S.a + .2, pill(0, 0, 'YOUR COUNTRY', { bg: '#fff', fs: 46 }), 540, 470);
  s += flag(600, 1130, 1.1, kc > 0, t);
  const rx = -300 + clamp((t - c('checkpoint') + .9) / 1.2) * 1800;
  s += person({ ...SPD, x: rx, y: 1140, s: .5, pose: [40, -60, 140, 30], mouth: 'grin', logo: jersey, rot: 10 }) + (rx > -200 && rx < 1300 ? speedLines(t, '#fff', .5, 8, 4000) : '');
  s += kc > 0 ? `<g transform="translate(540 870) scale(${f3(sp(kc))})"><rect x="-300" y="-58" width="600" height="116" rx="58" fill="${C.g}"/>${txt(0, 22, 'CHECKPOINT ✓', { fs: 60, fill: '#0B3D22' })}</g>` : '';
  s += stamp(t, c('panic'), 540, 330, "DON'T PANIC", { c: C.red, fs: 64, rot: -4 });
  return s
};

D.next = (t, S, T) => {
  const c = T.c;
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#2A1A12"/>` + rays(540, 760, 1300, t, '#E8A36A', 14, .1);
  s += rise(t, S.a + .1, txt(540, 340, 'PART 3', { fs: 60, fill: '#E8A36A', ls: 6 }), 20);
  s += rise(t, c('know') - .1, txt(540, 440, 'WHAT DO YOU KNOW ABOUT', { fs: 52, fill: '#fff', ls: 2 }), 20);
  s += pop(t, c('coffee') - .1, txt(0, 0, 'COFFEE?', { fs: 130, fill: '#E8A36A', st: '#fff', sw: 8 }), 540, 580);
  // чашка-силуэт с паром
  let steam = ''; for (let i = 0; i < 3; i++) { const ph = t * 1.5 + i; steam += `<path d="M${470 + i * 70},${780 - (ph % 1) * 60} q-25,-40 0,-80 q25,-40 0,-80" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity="${f3(.5 * (1 - (ph % 1)))}"/>` }
  s += pop(t, S.a + .25, `<g transform="translate(-540 -950)">${steam}<path d="M380,820 L700,820 L670,1080 Q660,1120 620,1120 L460,1120 Q420,1120 410,1080Z" fill="#fff"/><path d="M700,880 Q790,880 780,960 Q770,1030 690,1030" stroke="#fff" stroke-width="28" fill="none"/>${txt(540, 1010, '?', { fs: 150, fill: '#2A1A12' })}</g>`, 540, 950);
  s += pop(t, c('follow') + .2, btn(0, 0, 420, 116, 'FOLLOW', { c: C.red, fs: 56, press: Math.max(0, Math.sin(t * 6)) * .6 }), 540, 1200);
  return s
};

window.EP = {
  D, cap: { y: C.gold, r: C.red, ink: '#0B0B10' }, trColor: C.red,
  tr: { bark: 'flash', claim: 'zoom', name: 'wipe', rules: 'slide', save: 'slide', africa: 'iris', carib: 'slide', count: 'zoom', boss: 'flash', ronaldo: 'iris', space: 'up', you: 'zoom', next: 'wipe' },
  trCol: { bark: '#fff', boss: '#fff', name: '#fff', next: '#E8A36A' }, trAt: { africa: [540, 700], ronaldo: [540, 700] },
};
})();
