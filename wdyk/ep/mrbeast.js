// What do you know about MrBeast? — «он не раздаёт деньги, он считает»
(() => {
const C = { blue: '#2F6BFF', deep: '#1A2A6C', navy: '#121A45', y: '#FFD23F', pink: '#FF4FA3', g: '#3CC47C', w: '#fff', red: '#FF3B4E' };
const JIM = { skin: '#F2C29B', hair: '#5A3B25', hs: 'short', top: C.pink, pants: '#24294A' };
const D = {};

D.title = (t, S, T) => {
  const c = T.c;
  let s = bgFlat(C.deep, t, { dots: .4 }) + rays(540, 860, 1200, t, '#fff', 16, .07);
  for (let i = 0; i < 12; i++) { const a = R(i, 11) * 6.28, d = 380 + R(i, 12) * 420 + t * 160; s += bill(540 + Math.cos(a) * d, 900 + Math.sin(a) * d * 1.2, t * 120 * (i % 2 ? 1 : -1) + i * 30, .9, '#2E9E62') }
  s += rise(t, .05, txt(540, 470, 'WHAT DO YOU KNOW', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += rise(t, .25, txt(540, 560, 'ABOUT', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += dropText(t, c('mrbeast') - .15, 540, 760, 'MRBEAST?', { fs: 150, fill: C.y, st: '#0B1033', sw: 22 });
  // монета крутится
  const k = pr(t, .35, .6), sx = Math.cos(t * 5);
  s += k > 0 ? `<g transform="translate(540 1060) scale(${f3(sp(k) * 2.4)})">${`<g transform="scale(${f3(sx)} 1)">${coin(0, 0, 1, C.y)}</g>`}</g>` : '';
  s += sparkles(t, 540, 1060, 10, 220, C.y, 3);
  s += pop(t, .6, pill(0, 0, 'PART 1', { bg: C.pink, fg: '#fff', fs: 34 }), 540, 330);
  return s
};

D.money = (t, S, T) => {
  const c = T.c, lt = T.lt;
  let s = bgFlat(C.blue, t);
  // дождь купюр
  for (let i = 0; i < 26; i++) {
    const sp_ = 260 + R(i, 1) * 260, x = R(i, 2) * 1180 - 50, y = ((lt * sp_ + R(i, 3) * 2200) % 2200) - 200;
    s += bill(x, y, (lt * 90 + i * 40) * (i % 2 ? 1 : -1), .8 + R(i, 4) * .5)
  }
  s += shadowE(540, 1215, 260, 30, .22);
  s += person({ ...JIM, x: 540, y: 1240, s: .9, pose: 'cheer', mouth: 'grin', look: [0, -.5], wave: 0,
    item: (x, y) => cashStack(x, y - 10, 5, .55), itemL: (x, y) => cashStack(x, y - 10, 5, .55) });
  s += pop(t, c('millions') - .1, counter(0, 0, '$1,000,000', { bg: C.navy, fg: C.y, cw: 64, ch: 96, fs: 76 }), 540, 370);
  return s
};

D.claim = (t, S, T) => {
  const c = T.c, lt = T.lt, kc = pr(t, c('counting') - .2, .5);
  let s = bgFlat(C.navy, t, { dots: .3 });
  // купюры зависли и превращаются в цифры
  for (let i = 0; i < 14; i++) {
    const x = 90 + R(i, 7) * 900, y = 180 + R(i, 8) * 1050, k = pr(t, c('not') + i * .05, .5);
    s += k < 1 ? `<g opacity="${f3(1 - k)}">${bill(x, y, i * 23, .8)}</g>` : '';
    s += k > 0 ? `<g opacity="${f3(k * .55)}">${txt(x, y + 30, String(Math.floor((lt * 7 + i * 13) % 10)), { fs: 90, fill: C.y })}</g>` : ''
  }
  const n = Math.floor(Math.max(0, t - c('counting') + .3) * 48);
  s += kc > 0 ? `<g transform="translate(540 560) scale(${f3(sp(kc) * 1.15)})">${counter(0, 0, String(n).padStart(6, '0'), { bg: '#0A0F2C', fg: '#fff', cw: 120, ch: 170, fs: 140 })}</g>` : '';
  s += person({ ...JIM, x: 540, y: 1270, s: .6, pose: 'think', mouth: 'flat', brow: 1, look: [.8, -.3], blink: (t % 3) < .1 });
  s += stamp(t, c('counting') + .1, 540, 745, 'COUNTING', { c: C.pink, fs: 84, rot: -8 });
  return s
};

D.count = (t, S, T) => {
  const c = T.c, lt = T.lt;
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#5B4BD8"/>` + `<rect x="-300" y="-300" width="1680" height="2520" fill="url(#dots)" opacity=".35"/>`;
  // окно и календарь
  s += `<rect x="70" y="700" width="210" height="250" rx="16" fill="#2A2470"/><rect x="84" y="714" width="182" height="222" rx="10" fill="#8FD3FF"/><circle cx="220" cy="780" r="30" fill="#FFE27A"/>`;
  s += pop(t, c('2017') - .1, `<rect x="-110" y="-120" width="220" height="240" rx="20" fill="#fff"/><rect x="-110" y="-120" width="220" height="64" rx="20" fill="${C.red}"/><rect x="-110" y="-76" width="220" height="20" fill="${C.red}"/>${txt(0, 58, '2017', { fs: 84, fill: '#141022' })}`, 870, 760);
  // человек за столом
  s += person({ ...JIM, x: 540, y: 1330, s: .95, pose: 'hold', mouth: 'talk', talk: T.talk, look: [0, 0], blink: (t % 2.7) < .1 });
  s += `<rect x="-300" y="1100" width="1680" height="900" fill="#3C2F9E"/><rect x="60" y="1060" width="960" height="70" rx="20" fill="#8A5A34"/><rect x="60" y="1110" width="960" height="20" fill="#6E4527"/>`;
  // камера на столе
  s += `<g transform="translate(820 1000)"><rect x="-70" y="-50" width="140" height="100" rx="24" fill="#1E1E2A"/><circle cx="0" cy="0" r="32" fill="#3A3A55"/><circle cx="0" cy="0" r="18" fill="#141022"/>` +
    `<circle cx="48" cy="-30" r="9" fill="${(t % 1) < .6 ? C.red : '#5a1e24'}"/><rect x="-12" y="50" width="24" height="16" fill="#1E1E2A"/></g>`;
  // пузырь с числом
  const a = c('counted'), b = c('100,000') + .3, k = clamp((t - a) / Math.max(.1, b - a)), n = t < a ? Math.floor(lt * 3) + 1 : Math.floor(lerp(1, 100000, Math.pow(k, 3)));
  s += bubble(540, 420, 640, 170, fmt(Math.max(1, n)), { fs: 110, tail: 'bl' });
  s += pop(t, c('jimmy') - .1, pill(0, 0, 'JIMMY, 18', { bg: C.y, fs: 40 }), 300, 1000);
  return s
};

D.hours = (t, S, T) => {
  const c = T.c, lt = T.lt, st = c('stopped');
  // день-ночь
  const ph = (lt * .9) % 1, day = .5 + .5 * Math.cos(ph * 6.283);
  const mix = (a, b, k) => '#' + [0, 2, 4].map(i => Math.round(lerp(parseInt(a.slice(1 + i, 3 + i), 16), parseInt(b.slice(1 + i, 3 + i), 16), k)).toString(16).padStart(2, '0')).join('');
  const sky = mix('#1A1F4A', '#3E7BFF', day);
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="${sky}"/>`;
  s += `<g transform="translate(540 980) rotate(${f1(ph * 360)})"><circle cx="0" cy="-760" r="70" fill="#FFE27A"/><circle cx="0" cy="760" r="56" fill="#F3F0FF"/></g>`;
  // поток цифр после «never stopped»
  if (t > st - .2) {
    const k = clamp((t - st + .2) / .5);
    for (let col = 0; col < 9; col++) for (let r = 0; r < 12; r++) {
      const y = ((r * 170 + lt * (260 + col * 30)) % 2040) - 120, x = 60 + col * 120;
      s += txt(x, y, String(Math.floor(R(col * 31 + r, Math.floor(lt * 6)) * 10)), { fs: 70, fill: C.y, op: .32 * k })
    }
  }
  s += clock(540, 700, 250, lt * 2.2, lt * 26, { rim: C.pink });
  s += pop(t, c('40') - .1, pill(0, 0, '40 HOURS', { bg: C.y, fs: 70 }), 540, 1070);
  // «видео взлетело»: стрелка просмотров
  const kb = pr(t, c('blew') - .1, .6);
  if (kb > 0 && t < st - .3) s += `<g transform="translate(860 360) scale(${f3(sp(kb))})">${`<path d="M-150,90 L-40,-10 L20,40 L140,-110" stroke="${C.g}" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M90,-120 L150,-118 L148,-58" stroke="${C.g}" stroke-width="26" fill="none" stroke-linecap="round"/>`}${txt(-10, 170, 'VIEWS', { fs: 52, fill: '#fff' })}</g>` + sparkles(t, 860, 340, 8, 200, '#fff', 9);
  s += pop(t, st, stamp(t, st, 0, 0, 'NEVER STOPPED', { c: C.y, fs: 70, rot: -6 }), 540, 380);
  return s
};

D.nums = (t, S, T) => {
  const c = T.c;
  let s = bgFlat(C.blue, t);
  const card = (x, y, col, big, small, icon) => `<g transform="translate(${x} ${y})">${shadowE(0, 190, 200, 20, .2)}<rect x="-215" y="-175" width="430" height="350" rx="34" fill="${col}"/>` +
    `<rect x="-215" y="-175" width="430" height="350" rx="34" fill="url(#dots)" opacity=".4"/>${icon}${txt(0, 95, big, { fs: big.length > 8 ? 62 : 78, fill: '#fff', st: '#141022', sw: 10 })}${txt(0, 150, small, { fs: 34, fill: '#141022', ls: 2, w: 800 })}</g>`;
  let crowdI = ''; for (let i = 0; i < 12; i++) crowdI += mini(-150 + (i % 6) * 60, -60 + Math.floor(i / 6) * 70, .9, '#fff', { head: '#fff' });
  const treesI = tree(-110, 20, .6) + tree(0, 0, .75) + tree(110, 20, .6);
  s += pop(t, c('456') - .1, card(0, 0, C.pink, '456', 'PLAYERS', crowdI), 290, 470);
  s += pop(t, c('$456,000') - .1, card(0, 0, C.g, '$456,000', 'PRIZE', cashStack(0, -10, 5, .9)), 790, 560);
  s += pop(t, c('one', 0) - .1, card(0, 0, '#7B5CFF', '$1 VS $1M', 'ONE VIDEO', coin(-90, -50, 1.3, C.y) + coin(90, -50, 2, C.y)), 290, 920);
  s += pop(t, c('20') - .1, card(0, 0, '#21B5A0', '20,000,000', 'TREES', treesI), 790, 1010);
  s += sparkles(t, 540, 760, 14, 520, C.y, 5);
  return s
};

D.titles = (t, S, T) => {
  const c = T.c, lt = T.lt, kn = pr(t, c('numbers') - .1, .3);
  let s = bgFlat(C.navy, t, { dots: .3 });
  const N = ['$1', '100 DAYS', '$1,000,000', '50 HOURS', '1,000 PEOPLE', '$100,000,000', '24 HOURS', '7 DAYS', '$500,000', '10,000', '100 KIDS', '$1 VS $1B'];
  const cols = ['#FF4FA3', '#2F6BFF', '#3CC47C', '#FF9F2E', '#7B5CFF', '#21B5A0'];
  for (let col = 0; col < 3; col++) for (let r = 0; r < 7; r++) {
    const dir = col % 2 ? 1 : -1, y = ((r * 300 + dir * lt * 140) % 2100 + 2100) % 2100 - 220, x = 190 + col * 350, i = col * 7 + r;
    const hot = kn > 0 && R(i, 4) > .3;
    s += thumb(x, y, 320, 180, N[i % N.length], hot ? C.y : cols[i % cols.length], { fs: 46 })
  }
  s += `<rect x="-300" y="-300" width="1680" height="2520" fill="#000" opacity="${f3(.25 * (1 - kn))}"/>`;
  return s
};

D.subs = (t, S, T) => {
  const c = T.c, lt = T.lt, s2 = S.sents[1].a - .1;
  let s = bgFlat(C.deep, t, { dots: .35 }) + rays(540, 640, 1300, t, C.y, 16, .08);
  if (t < s2) {
    const a = c('500'), k = clamp((t - (a - 1.2)) / 1.6), n = lerp(400e6, 500e6, eio(k)) + (t > a + .4 ? (t - a - .4) * 4e6 : 0);
    s += pop(t, S.a + .1, `<path d="M-90,-40 L-130,-150 L-50,-90 L0,-170 L50,-90 L130,-150 L90,-40Z" fill="${C.y}"/><rect x="-92" y="-44" width="184" height="30" rx="8" fill="${shade(C.y, -.2)}"/>`, 540, 420);
    s += counter(540, 640, Math.min(522e6, n), { bg: '#0A0F2C', fg: '#fff', cw: 82, ch: 128, fs: 104 });
    s += pop(t, c('2026') - .1, pill(0, 0, '2026', { bg: C.pink, fg: '#fff', fs: 46 }), 540, 860);
    s += pop(t, c('first') - .1, pill(0, 0, 'FIRST EVER', { bg: C.y, fs: 52 }), 540, 990);
    s += sparkles(t, 540, 640, 12, 480, C.y, 2);
  } else {
    // столбики: США + Россия против подписчиков
    const k1 = pr(t, s2 + .2, .6), k2 = pr(t, c('united') - .1, .6), k3 = pr(t, c('russia') - .1, .6), base = 1150, sc = 1.25;
    const bar = (x, h, col, lab, num, k, y0 = base) => `<rect x="${x - 120}" y="${f1(y0 - h * sc * eo(k))}" width="240" height="${f1(h * sc * eo(k))}" rx="20" fill="${col}"/>` +
      (k > .5 ? txt(x, y0 - h * sc * eo(k) + 70, num, { fs: 54, fill: '#fff' }) + txt(x, base + 70, lab, { fs: 40, fill: '#fff', w: 800 }) : '');
    s += bar(310, 522, C.pink, 'SUBSCRIBERS', '522M', k1);
    s += bar(770, 342, '#3E7BFF', 'USA', '342M', k2);
    s += k3 > 0 ? `<rect x="650" y="${f1(base - 342 * sc - 146 * sc * eo(k3))}" width="240" height="${f1(146 * sc * eo(k3))}" rx="20" fill="#FF9F2E"/>` + (k3 > .5 ? txt(770, base - 342 * sc - 146 * sc * eo(k3) + 64, '+146M', { fs: 50, fill: '#fff' }) + txt(770, base + 120, '+ RUSSIA', { fs: 40, fill: '#fff', w: 800 }) : '') : '';
    s += `<rect x="120" y="${base}" width="840" height="8" rx="4" fill="#fff" opacity=".6"/>`;
  }
  return s
};

D.earth = (t, S, T) => {
  const c = T.c, lt = T.lt, s2 = S.sents[1].a;
  let s = bgFlat('#0E1440', t, { dots: .25 });
  for (let i = 0; i < 40; i++) s += `<circle cx="${f1(R(i, 1) * 1080)}" cy="${f1(R(i, 2) * 1300)}" r="${f1(1 + R(i, 3) * 3)}" fill="#fff" opacity="${f3(.3 + .5 * R(i, 4))}"/>`;
  s += globe(540, 680, 330, t, { rot: lt * 70 });
  // крошечные люди-точки на глобусе
  for (let i = 0; i < 60; i++) { const a = R(i, 5) * 6.28, d = R(i, 6) * 300; s += `<circle cx="${f1(540 + Math.cos(a) * d)}" cy="${f1(680 + Math.sin(a) * d * .9)}" r="5" fill="#fff" opacity=".85"/>` }
  s += pop(t, c('8') - .1, counter(0, 0, '8,000,000,000', { bg: '#0A0F2C', fg: '#fff', cw: 62, ch: 96, fs: 76 }), 540, 1110);
  if (t > s2 - .2) {
    const k = pr(t, c('6%') - .3, 1.0), w = 760;
    s += `<g transform="translate(540 1110)" opacity="${f3(pr(t, s2 - .2, .3))}"><rect x="${-w / 2 - 8}" y="-58" width="${w + 16}" height="116" rx="58" fill="#0A0F2C"/>` +
      `<rect x="${-w / 2}" y="-50" width="${f1(Math.max(100, w * .063 * eo(k) + 100))}" height="100" rx="50" fill="${C.pink}"/>${txt(0, 22, `${Math.round(6 * eo(k))}% DONE`, { fs: 62, fill: '#fff' })}</g>`;
    s += stamp(t, c('done'), 540, 330, 'DO THE MATH', { c: C.y, fs: 62, rot: -4 });
  }
  return s
};

D.button = (t, S, T) => {
  const c = T.c, lt = T.lt, s2 = S.sents[1].a;
  let s = bgFlat('#F2F3FF', t, { dots: .2, c2: '#DCE0FF', c3: '#fff' });
  // нажатия: каждые 0,55 с после второй фразы
  const clicks = t > s2 ? Math.floor((t - s2) / .55) + 1 : 0, ph = t > s2 ? ((t - s2) % .55) / .55 : 1;
  const press = t > s2 ? Math.max(0, 1 - ph * 4) : 0;
  s += btn(540, 760, 620, 170, 'SUBSCRIBE', { c: C.red, fs: 76, press });
  s += cursor(640 + (1 - press) * 30, 790 + (1 - press) * 30, 1.3);
  s += counter(540, 470, 522000000 + clicks, { bg: C.navy, fg: '#fff', cw: 70, ch: 110, fs: 90 });
  for (let i = 0; i < clicks && i < 12; i++) { const k = clamp((t - s2 - i * .55) / .9); if (k > 0 && k < 1) s += txt(600 + (i % 3 - 1) * 120, 380 - k * 220, '+1', { fs: 80, fill: C.g, st: '#fff', sw: 10, op: 1 - k }) }
  s += stamp(t, c('asking'), 540, 1060, 'NOT ASKING', { c: C.red, fs: 76, rot: -7 });
  return s
};

D.you = (t, S, T) => {
  const c = T.c, lt = T.lt, kc = pr(t, c('counted') - .1, .4);
  let s = bgFlat('#1A2A6C', t, { dots: .3 });
  const cols = ['#FF4FA3', '#3CC47C', '#FFD23F', '#7B5CFF', '#21B5A0', '#FF9F2E', '#8FD3FF'];
  for (let r = 0; r < 9; r++) for (let q = 0; q < 8; q++) {
    const x = 95 + q * 128 + (r % 2) * 40, y = 280 + r * 112, i = r * 8 + q;
    if (i === 35) continue;
    s += mini(x, y, 1.05, cols[i % cols.length], { tag: kc > 0 ? `<g opacity="${f3(kc)}">${txt(0, -95, '#' + (521999900 + i * 7).toString().slice(-3), { fs: 22, fill: '#fff', w: 800 })}</g>` : '' })
  }
  // «ты» — в центре, крупнее
  const yx = 95 + 3 * 128 + 40, yy = 280 + 4 * 112;
  s += `<circle cx="${yx}" cy="${yy - 50}" r="${f1(120 + Math.sin(t * 5) * 8)}" fill="url(#glowY)"/>` + mini(yx, yy, 1.5, '#fff', { head: '#fff' });
  s += pop(t, S.a + .2, pill(0, 0, 'YOU', { bg: C.y, fs: 44 }), yx, yy - 190);
  s += kc > 0 ? `<g transform="translate(${yx} ${yy + 70})">${stamp(t, c('counted'), 0, 0, '#522,000,001', { c: C.red, fs: 58, rot: -8 })}</g>` : '';
  return s
};

D.next = (t, S, T) => {
  const c = T.c;
  let s = bgFlat('#111', t, { dots: .25, c3: '#2a2a2a', c2: '#000' }) + rays(540, 760, 1300, t, C.red, 14, .1);
  s += rise(t, S.a + .1, txt(540, 340, 'PART 2', { fs: 60, fill: C.red, ls: 6 }), 20);
  s += rise(t, c('know') - .1, txt(540, 440, 'WHAT DO YOU KNOW ABOUT', { fs: 52, fill: '#fff', ls: 2 }), 20);
  s += pop(t, c('ishowspeed') - .1, txt(0, 0, 'ISHOWSPEED?', { fs: 112, fill: C.red, st: '#fff', sw: 8 }), 540, 570);
  s += pop(t, S.a + .2, person({ x: 0, y: 0, s: .72, skin: '#2B2B33', hair: '#1a1a1f', hs: 'buzz', top: '#2B2B33', pants: '#202027', shoe: '#2B2B33', pose: 'cheer', mouth: 'flat' }) + txt(0, -330, '?', { fs: 150, fill: '#fff' }), 540, 1110);
  s += pop(t, c('follow') + .2, btn(0, 0, 420, 116, 'FOLLOW', { c: C.pink, fs: 56, press: Math.max(0, Math.sin(t * 6)) * .6 }), 540, 1180);
  return s
};

window.EP = {
  D, cap: { y: C.y, r: C.red, ink: '#0B1033' }, trColor: C.y,
  tr: { money: 'iris', claim: 'flash', count: 'zoom', hours: 'slide', nums: 'iris', titles: 'up', subs: 'zoom', earth: 'iris', button: 'slide', you: 'zoom', next: 'wipe' },
  trAt: { money: [540, 1060], nums: [540, 700], earth: [540, 680] },
  trCol: { claim: '#fff', next: C.red },
  noCap: t => false,
};
})();
