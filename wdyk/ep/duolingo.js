// What do you know about Duolingo? — «сова не учит тебя, она тебя проверяет»
(() => {
const C = { g: '#58B947', gd: '#3E8E2E', gl: '#8BD873', navy: '#18233A', w: '#fff', red: '#FF4B4B', y: '#FFC83D', or: '#F7931E', blue: '#1CB0F6', gray: '#E9EDF3' };
const D = {};

// сова (своя, не логотип): o.mood: '' | 'angry' | 'dead' | 'ghost' | 'sly'
function owl(x, y, s, t, o = {}) {
  const body = o.mood === 'ghost' ? '#E9FFF0' : (o.c || C.g), belly = o.mood === 'ghost' ? '#fff' : C.gl, bl = !o.mood && (t % 2.6) < .12;
  const [lx, ly] = o.look || [0, 0], bob = Math.sin(t * 3) * 6;
  let eye = ex => {
    if (o.mood === 'dead') return `<circle cx="${ex}" cy="-70" r="58" fill="#fff"/><path d="M${ex - 28},-98 L${ex + 28},-42 M${ex + 28},-98 L${ex - 28},-42" stroke="${C.navy}" stroke-width="14" stroke-linecap="round"/>`;
    return `<circle cx="${ex}" cy="-70" r="58" fill="#fff"/>` + (bl ? `<path d="M${ex - 30},-70 L${ex + 30},-70" stroke="${C.navy}" stroke-width="10" stroke-linecap="round"/>` :
      `<circle cx="${ex + lx * 16}" cy="${-66 + ly * 14}" r="26" fill="${C.navy}"/><circle cx="${ex + lx * 16 + 9}" cy="${-76 + ly * 14}" r="8" fill="#fff"/>`)
  };
  let g = shadowE(0, 190, 150, 20, .2) +
    `<path d="M-60,190 l-16,26 M-60,190 l0,30 M-60,190 l16,26 M60,190 l-16,26 M60,190 l0,30 M60,190 l16,26" stroke="${C.or}" stroke-width="12" stroke-linecap="round"/>` +
    `<path d="M-150,-150 L-170,-230 L-90,-180Z M150,-150 L170,-230 L90,-180Z" fill="${shade(body, -.12)}"/>` +
    `<ellipse cx="0" cy="0" rx="170" ry="200" fill="${body}"/><ellipse cx="0" cy="70" rx="110" ry="120" fill="${belly}"/>` +
    `<path d="M-168,-20 Q-230,60 -170,140 Q-150,40 -150,-10Z M168,-20 Q230,60 170,140 Q150,40 150,-10Z" fill="${shade(body, -.15)}"/>` +
    eye(-62) + eye(62);
  if (o.mood === 'angry' || o.mood === 'sly') g += `<path d="M-120,-140 L-10,-112 M120,-140 L10,-112" stroke="${shade(body, -.4)}" stroke-width="18" stroke-linecap="round"/>`;
  g += `<path d="M-22,-20 L22,-20 L0,16Z" fill="${C.or}"/>`;
  if (o.belly) g += o.belly;
  if (o.mood === 'ghost') g += `<ellipse cx="0" cy="-250" rx="110" ry="24" fill="none" stroke="${C.y}" stroke-width="12"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y + (o.still ? 0 : bob))}) scale(${f3(s)})${o.rot ? ` rotate(${o.rot})` : ''}"${o.op != null ? ` opacity="${f3(o.op)}"` : ''}>${g}</g>`
}
function checkbox(x, y, s, on, o = {}) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${shadowE(0, 110, 300, 14, .15)}<rect x="-330" y="-100" width="660" height="200" rx="16" fill="#F9F9F9" stroke="#D3D3D3" stroke-width="4"/>` +
    `<rect x="-290" y="-36" width="72" height="72" rx="8" fill="#fff" stroke="#C1C1C1" stroke-width="5"/>` +
    (on ? `<path d="M-280,0 L-260,24 L-222,-30" stroke="#0F9D58" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 0)"/>` : '') +
    txt(-190, 16, o.label || "I'm not a robot", { fs: 46, fill: '#333', a: 'start', w: 800, font: 'N' }) + `</g>`
}
function robot(x, y, s, t) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">${shadowE(0, 150, 120, 14, .15)}<rect x="-90" y="-60" width="180" height="200" rx="30" fill="#AEB8C8"/><rect x="-110" y="-230" width="220" height="160" rx="40" fill="#C9D2E0"/>` +
    `<circle cx="-46" cy="-150" r="26" fill="${C.blue}" opacity="${f3(.6 + .4 * Math.sin(t * 6))}"/><circle cx="46" cy="-150" r="26" fill="${C.blue}" opacity="${f3(.6 + .4 * Math.sin(t * 6))}"/><rect x="-50" y="-110" width="100" height="14" rx="7" fill="#7A8699"/>` +
    `<line x1="0" y1="-230" x2="0" y2="-280" stroke="#7A8699" stroke-width="10"/><circle cx="0" cy="-290" r="16" fill="${C.red}"/></g>`
}
function book(x, y, s, rot = 0) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)})"><path d="M0,-80 Q-80,-100 -170,-80 L-170,90 Q-80,70 0,90Z" fill="#F7F1E3"/><path d="M0,-80 Q80,-100 170,-80 L170,90 Q80,70 0,90Z" fill="#EFE6D0"/>` +
    [-50, -20, 10, 40].map(yy => `<path d="M-150,${yy} Q-80,${yy - 10} -20,${yy}" stroke="#B9AE96" stroke-width="6" fill="none"/><path d="M20,${yy} Q80,${yy - 10} 150,${yy}" stroke="#B9AE96" stroke-width="6" fill="none"/>`).join('') + `</g>`
}
function newspaper(x, y, s, rot = 0, title = 'NEWS') {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)})"><rect x="-150" y="-190" width="300" height="380" rx="8" fill="#F7F7F7"/>` + txt(0, -130, title, { fs: 54, fill: '#222', font: 'P', w: 900 }) +
    `<rect x="-120" y="-100" width="240" height="8" fill="#222"/>` + [-70, -40, -10, 20, 50, 80, 110, 140].map(yy => `<rect x="-120" y="${yy}" width="${yy % 60 ? 240 : 150}" height="12" rx="6" fill="#C8C8C8"/>`).join('') + `</g>`
}
function wavyWord(x, y, word, t, s = 1) {
  // «размытое» слово капчи: буквы скачут и наклонены
  let g = ''; [...word].forEach((ch, i) => { g += `<g transform="translate(${-((word.length - 1) * 30) + i * 60} ${f1(Math.sin(i * 1.7 + t * 2) * 14)}) rotate(${f1(Math.sin(i * 2.3) * 18)}) skewX(${f1(Math.sin(i * 3.1) * 14)})">${txt(0, 0, ch, { fs: 96, fill: '#3A3A3A', font: 'N', w: 900 })}</g>` });
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><rect x="-300" y="-110" width="600" height="170" rx="16" fill="#E6E6E6"/><g opacity=".85">${g}</g><path d="M-280,-20 Q-80,-80 120,0 T300,-30" stroke="#777" stroke-width="5" fill="none"/></g>`
}
function truck(x, y, s) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><rect x="-260" y="-200" width="340" height="200" rx="20" fill="#B9C2D0"/><path d="M80,-150 L190,-150 L250,-70 L250,0 L80,0Z" fill="#8E9AAE"/><path d="M100,-130 L180,-130 L225,-70 L100,-70Z" fill="#CFE8FF"/>` +
    `<circle cx="-160" cy="0" r="52" fill="#2B2F45"/><circle cx="-160" cy="0" r="22" fill="#8E9AAE"/><circle cx="160" cy="0" r="52" fill="#2B2F45"/><circle cx="160" cy="0" r="22" fill="#8E9AAE"/></g>`
}
function flame(x, y, s, t, n) {
  const f = Math.sin(t * 10) * 6;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><path d="M0,${-170 - f} C60,-110 110,-60 110,10 A110,110 0 0 1 -110,10 C-110,-50 -60,-80 -40,-140 C-20,-90 0,-100 0,${-170 - f}Z" fill="${C.or}"/>` +
    `<path d="M0,-80 C30,-50 60,-20 60,20 A60,60 0 0 1 -60,20 C-60,-10 -30,-40 0,-80Z" fill="${C.y}"/>` + (n != null ? txt(0, 200, String(n), { fs: 110, fill: '#fff', st: C.navy, sw: 10 }) : '') + `</g>`
}

D.title = (t, S, T) => {
  const c = T.c;
  let s = bgFlat(C.g, t, { dots: .3, c3: C.gl, c2: C.gd }) + rays(540, 900, 1200, t, '#fff', 14, .1);
  s += rise(t, .05, txt(540, 470, 'WHAT DO YOU KNOW', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += rise(t, .25, txt(540, 560, 'ABOUT', { fs: 74, fill: '#fff', ls: 3 }), 30);
  s += dropText(t, c('duolingo') - .15, 540, 760, 'DUOLINGO?', { fs: 140, fill: '#fff', st: '#1E5E14', sw: 14 });
  // сова выглядывает снизу
  const k = eo(pr(t, .3, .7));
  s += owl(540, 1500 - k * 330, 1.25, t, { look: [0, -.6] });
  s += pop(t, .6, pill(0, 0, 'PART 4', { bg: C.navy, fg: '#fff', fs: 34 }), 540, 330);
  return s
};

D.owl = (t, S, T) => {
  const c = T.c, lt = T.lt;
  let s = bgFlat('#E8F7E1', t, { dots: .2, c2: '#CFEFC2', c3: '#fff' });
  // телефон с уведомлениями
  const N = ['Your lesson is waiting 🙂', 'Just 5 minutes. Please.', 'I am not mad.', 'I am a little mad.', 'Spanish will not learn itself.'];
  let scr = `<rect x="-114" y="-226" width="228" height="452" rx="28" fill="#1B2440"/>` + txt(0, -150, '9:41', { fs: 60, fill: '#fff' });
  N.forEach((m, i) => { const k = pr(t, S.a + .3 + i * .55, .35); if (k > 0) scr += `<g transform="translate(0 ${f1(-80 + i * 66 + (1 - eo(k)) * -30)})" opacity="${f3(k)}"><rect x="-104" y="-26" width="208" height="56" rx="14" fill="#fff"/><circle cx="-80" cy="2" r="14" fill="${C.g}"/>${txt(-58, 9, m, { fs: 15, fill: '#222', a: 'start', w: 800 })}</g>` });
  s += phone(560, 760, 1.55, scr, { rot: -4 });
  s += owl(260 + Math.sin(t * 2) * 10, 1180, .8, t, { mood: t > c('guilt-trips') ? 'angry' : '', look: [1, -.3] });
  s += pop(t, c('guilt-trips') - .1, pill(0, 0, 'GUILT TRIP', { bg: C.red, fg: '#fff', fs: 46 }), 790, 1180);
  return s
};

D.claim = (t, S, T) => {
  const c = T.c, kt = pr(t, c('testing') - .2, .4);
  let s = bgFlat(C.navy, t, { dots: .2, c3: '#22304F', c2: '#0F1626' });
  // прожектор и человек под проверкой
  s += `<path d="M540,180 L250,1250 L830,1250Z" fill="#fff" opacity=".07"/>`;
  s += person({ x: 540, y: 1250, s: .8, skin: '#F2C29B', hair: '#3A2A20', hs: 'short', top: C.blue, pants: '#2B2F45', pose: 'down', mouth: kt > 0 ? 'o' : 'flat', look: [0, -1], sweat: kt > 0 });
  s += owl(820, 520, .62, t, { mood: 'sly', look: [-1, .6] });
  // лупа совы
  s += kt > 0 ? `<g transform="translate(560 700) rotate(-20)" opacity="${f3(kt)}"><circle r="110" fill="#fff" opacity=".18"/><circle r="110" fill="none" stroke="${C.y}" stroke-width="20"/><rect x="-16" y="110" width="32" height="140" rx="12" fill="${C.y}"/></g>` : '';
  s += stamp(t, c('testing'), 440, 400, 'TESTING YOU', { c: C.y, fs: 76, rot: -8 });
  return s
};

D.luis = (t, S, T) => {
  const c = T.c;
  let s = bgFlat('#E8F7E1', t, { dots: .2, c2: '#CFEFC2', c3: '#fff' });
  s += pop(t, S.a + .1, `<rect x="-290" y="-360" width="580" height="720" rx="40" fill="#fff"/><rect x="-290" y="-360" width="580" height="160" rx="40" fill="${C.g}"/><rect x="-290" y="-240" width="580" height="40" fill="${C.g}"/>` +
    txt(0, -260, 'CREATOR', { fs: 50, fill: '#fff', ls: 6 }), 540, 760);
  s += person({ x: 540, y: 1000, s: .5, skin: '#E0B48A', hair: '#2A1A12', hs: 'short', top: '#2B2F45', pants: '#2B2F45', pose: 'down', mouth: 'smile', beard: true });
  s += pop(t, c('luis') - .1, txt(0, 0, 'LUIS VON AHN', { fs: 64, fill: C.navy }), 540, 1060);
  return s
};

D.captcha = (t, S, T) => {
  const c = T.c, kr = pr(t, c('robot') - .1, .3);
  let s = bgFlat('#F2F4F8', t, { dots: .15, c2: '#E1E6EF', c3: '#fff' });
  // до слова «captcha» — загадка: размытая рамка с вопросами
  if (t < c('captcha') - .1) s += `<g opacity="${f3(pr(t, S.a + .1, .4) * .5)}">${checkbox(540, 780, 1.25, false, { label: '? ? ? ? ? ?' })}</g>` + pop(t, S.a + .2, txt(0, 0, '???', { fs: 160, fill: C.navy, ls: 10 }), 540, 400);
  s += pop(t, c('captcha') - .1, txt(0, 0, 'CAPTCHA', { fs: 140, fill: C.navy, ls: 6 }), 540, 400);
  s += pop(t, c('thousand') - .1, pill(0, 0, 'SEEN 1,000 TIMES', { bg: C.y, fs: 44 }), 540, 520);
  s += pop(t, c('captcha') + .2, checkbox(0, 0, 1.25, kr > 0), 540, 780);
  s += cursor(lerp(900, 230, eio(clamp((t - c('captcha') - .4) / 1.2))), lerp(1150, 790, eio(clamp((t - c('captcha') - .4) / 1.2))), 1.3);
  s += pop(t, c('robot') - .2, robot(0, 0, .9, t) + txt(160, -250, '?', { fs: 140, fill: C.red }), 800, 1100);
  return s
};

D.books = (t, S, T) => {
  const c = T.c, lt = T.lt, kf = pr(t, c('free') - .15, .4);
  let s = bgFlat('#F7EDD8', t, { dots: .2, c2: '#EBDDBF', c3: '#fff' });
  s += pop(t, S.a + .1, txt(0, 0, 'reCAPTCHA', { fs: 110, fill: C.navy }), 540, 380);
  s += wavyWord(540, 640, 'wiht', t, 1.1);
  // поле ввода: печатается слово
  const typed = 'with'.slice(0, Math.max(0, Math.floor((t - c('typed') + .2) * 6)));
  s += `<g transform="translate(540 860)"><rect x="-300" y="-56" width="600" height="112" rx="14" fill="#fff" stroke="#C1C1C1" stroke-width="5"/>${txt(-270, 22, typed + ((t * 2) % 1 < .5 ? '|' : ''), { fs: 60, fill: '#222', a: 'start', font: 'N' })}</g>`;
  // книги и газеты разлетаются вверх → «оцифрованы»
  if (t > c('books') - .2) for (let i = 0; i < 6; i++) { const k = clamp((t - c('books') - i * .2) / 2.2); if (k > 0) s += (i % 2 ? newspaper(160 + i * 150, 1150 - k * 900, .5, Math.sin(i) * 20, 'TIMES') : book(160 + i * 150, 1150 - k * 900, .55, Math.sin(i) * 25)) }
  s += kf > 0 ? stamp(t, c('free'), 540, 1180, 'FOR FREE', { c: C.red, fs: 92, rot: -8 }) : '';
  return s
};

D.google = (t, S, T) => {
  const c = T.c, kb = pr(t, c('bought') - .15, .4);
  let s = bgFlat('#E3F2FD', t, { dots: .2, c2: '#C9E4FA', c3: '#fff' });
  s += pop(t, c('2009') - .1, pill(0, 0, '2009', { bg: C.navy, fg: '#fff', fs: 60 }), 540, 380);
  s += checkbox(540, 760, 1.1, true);
  // мешок денег и бирка SOLD
  s += kb > 0 ? `<g transform="translate(540 1050) scale(${f3(sp(kb))})"><path d="M-110,-60 Q-150,90 -60,120 L60,120 Q150,90 110,-60 Q60,-110 0,-110 Q-60,-110 -110,-60Z" fill="#C9A26B"/><path d="M-40,-110 L40,-110 L30,-150 L-30,-150Z" fill="#B88F57"/>${txt(0, 50, '$', { fs: 110, fill: '#7A5A2E' })}</g>` : '';
  s += stamp(t, c('bought') + .1, 540, 560, 'SOLD TO GOOGLE', { c: C.red, fs: 64, rot: -6 });
  return s
};

D.translate = (t, S, T) => {
  const c = T.c, lt = T.lt, s2 = S.sents[1].a;
  let s = bgFlat('#E8F7E1', t, { dots: .2, c2: '#CFEFC2', c3: '#fff' });
  if (t < s2) {
    // статьи → много учеников → переводы → клиентам
    s += newspaper(220, 520, .6, -6, 'ARTICLE');
    for (let i = 0; i < 9; i++) { const k = pr(t, c('learners') - .3 + i * .08, .4); s += k > 0 ? `<g opacity="${f3(k)}">${mini(420 + (i % 3) * 110, 460 + Math.floor(i / 3) * 140, 1.3, [C.g, C.blue, C.or][i % 3])}${(t * 2 + i) % 2 < 1 ? `<g transform="translate(${470 + (i % 3) * 110} ${380 + Math.floor(i / 3) * 140})"><rect x="-34" y="-22" width="68" height="40" rx="10" fill="#fff"/>${txt(0, 8, 'ES', { fs: 20, fill: '#333' })}</g>` : ''}</g>` : '' }
    s += pop(t, c('real') - .1, pill(0, 0, 'REAL ARTICLES', { bg: '#fff', fs: 40 }), 300, 330);
    const ks = pr(t, c('sold') - .2, .5);
    if (ks > 0) {
      s += `<g opacity="${f3(ks)}">${arrowR(320, 1000, 200, C.navy, 14)}</g>`;
      s += pop(t, c('cnn') - .2, `<rect x="-150" y="-70" width="300" height="140" rx="20" fill="${C.navy}"/>` + txt(0, 22, 'CNN', { fs: 64, fill: '#fff' }), 700, 940);
      s += pop(t, c('buzzfeed') - .2, `<rect x="-170" y="-70" width="340" height="140" rx="20" fill="${C.red}"/>` + txt(0, 20, 'BUZZFEED', { fs: 52, fill: '#fff' }), 700, 1120);
      s += pop(t, c('sold') - .1, `<path d="M-60,-30 Q-80,40 -30,60 L30,60 Q80,40 60,-30 Q30,-60 0,-60 Q-30,-60 -60,-30Z" fill="#C9A26B"/>${txt(0, 34, '$', { fs: 60, fill: '#7A5A2E' })}`, 230, 1060);
    }
  } else {
    s += stamp(t, s2 + .05, 540, 600, 'FREE WORK', { c: C.red, fs: 100, rot: -8 });
    s += stamp(t, c('again') - .05, 540, 820, 'AGAIN.', { c: C.navy, fs: 100, rot: 6 });
  }
  return s
};

D.daily = (t, S, T) => {
  const c = T.c, k = clamp((t - c('65') + .4) / 1.3);
  let s = bgFlat(C.g, t, { dots: .3, c3: C.gl, c2: C.gd });
  // сетка телефонов
  for (let i = 0; i < 15; i++) { const q = i % 5, r = Math.floor(i / 5), kk = pr(t, S.a + .2 + i * .06, .4); s += kk > 0 ? phone(140 + q * 200, 760 + r * 210, .34 * sp(kk), `<rect x="-114" y="-226" width="228" height="452" rx="28" fill="${C.gl}"/>` + owl(0, 20, .5, t + i, {})) : '' }
  s += counter(540, 420, Math.round(65e6 * eio(k)), { bg: C.navy, fg: '#fff', cw: 72, ch: 110, fs: 90 });
  s += pop(t, c('every') - .1, pill(0, 0, 'EVERY. SINGLE. DAY.', { bg: C.y, fs: 50 }), 540, 570);
  return s
};

D.death = (t, S, T) => {
  const c = T.c, kd = pr(t, c('died') - .1, .2), kt = clamp((t - c('hit') + .2) / .8), km = pr(t, c('mourned') - .2, .5);
  let s = bgFlat(kd > 0 ? '#2B2F45' : C.g, t, { dots: .2 });
  s += pop(t, c('2025') - .1, pill(0, 0, 'FEB 2025', { bg: '#fff', fs: 50 }), 540, 340);
  if (km <= 0) {
    s += owl(540, 840, 1.1, t, { mood: kd > 0 ? 'dead' : '', rot: kd > 0 ? -12 : 0, still: kd > 0 });
    if (kt > 0) s += truck(lerp(1500, 540, eio(kt)), 1160, 1.1);
  } else {
    // надгробие и слёзы
    s += `<g transform="translate(540 1120)"><path d="M-220,0 L-220,-360 Q-220,-520 0,-520 Q220,-520 220,-360 L220,0Z" fill="#9AA3B5"/><path d="M60,-520 Q220,-520 220,-360 L220,0 L60,0Z" fill="#7F889B"/>${txt(0, -330, 'R.I.P.', { fs: 90, fill: '#4A5266' })}${txt(0, -230, 'OWL', { fs: 60, fill: '#4A5266' })}</g>`;
    s += `<rect x="-300" y="1120" width="1680" height="800" fill="#3E8E2E"/>`;
    for (let i = 0; i < 10; i++) { const x = 120 + i * 95, y = ((t * 380 + i * 170) % 900) + 300; s += `<path transform="translate(${x} ${y})" d="M0,-30 C12,-10 20,0 20,10 A20,20 0 1 1 -20,10 C-20,0 -12,-10 0,-30Z" fill="${C.blue}" opacity=".85"/>` }
    s += pop(t, c('mourned') - .1, pill(0, 0, 'THE INTERNET MOURNED', { bg: '#fff', fs: 44 }), 540, 470);
  }
  return s
};

D.back = (t, S, T) => {
  const c = T.c, lt = T.lt, s2 = S.sents[1].a, kb = pr(t, c('back') - .3, .8);
  let s = bgFlat(t > s2 ? C.navy : '#2B2F45', t, { dots: .2 });
  if (t < s2) {
    s += rise(t, S.a + .1, txt(540, 400, 'TWO WEEKS LATER...', { fs: 70, fill: '#fff', ls: 3 }), 20);
    s += `<g transform="translate(540 1180)"><path d="M-220,0 L-220,-300 Q-220,-440 0,-440 Q220,-440 220,-300 L220,0Z" fill="#9AA3B5" transform="rotate(${f1(-8 * kb)})"/></g><rect x="-300" y="1180" width="1680" height="800" fill="#3E8E2E"/>`;
    if (kb > 0) s += `<circle cx="540" cy="760" r="${f1(260 * eo(kb))}" fill="url(#glowY)"/>` + owl(540, 1100 - eo(kb) * 330, 1, t, { mood: 'ghost', op: eo(kb) }) + sparkles(t, 540, 760, 10, 300, C.y, 6);
  } else {
    // «программы — возвращаются»: код вокруг совы
    for (let r = 0; r < 14; r++) { const y = 220 + r * 80, w = 200 + R(r, 3) * 500; s += `<rect x="${80 + R(r, 2) * 100}" y="${y}" width="${f1(w)}" height="22" rx="11" fill="${[C.g, C.blue, C.y, '#fff'][r % 4]}" opacity=".25"/>` }
    s += owl(540, 820, 1, t, { look: [0, 0] });
    s += stamp(t, c('programs') - .05, 540, 1170, 'PROGRAMS DO', { c: C.g, fs: 86, rot: -6 });
    s += rise(t, s2, txt(540, 360, "LIVING THINGS DON'T COME BACK", { fs: 44, fill: '#fff', ls: 1 }), 20);
  }
  return s
};

D.reveal = (t, S, T) => {
  const c = T.c, kr = pr(t, c('biggest') - .3, .7);
  let s = bgFlat(C.navy, t, { dots: .2 }) + rays(540, 800, 1300, t, C.g, 14, .08 * kr);
  // сова «раскрывается»: на животе — капча
  const belly = kr > 0 ? `<g transform="translate(0 70) scale(${f3(.32 * sp(kr))})">${checkbox(0, 0, 1, (t % 1.2) < .9)}</g>` : '';
  s += owl(540, 820, 1.3, t, { mood: kr > 0 ? 'sly' : '', belly });
  s += stamp(t, c('owl') - .05, 540, 420, 'NOT AN OWL', { c: C.red, fs: 80, rot: -6 });
  s += kr > 0 ? pop(t, c('captcha') - .1, pill(0, 0, 'THE BIGGEST CAPTCHA EVER', { bg: C.y, fs: 44 }), 540, 1200) : '';
  return s
};

D.you = (t, S, T) => {
  const c = T.c, lt = T.lt, s2 = S.sents[1].a, ky = pr(t, s2 - .1, .2);
  let s = bgFlat(ky > 0 ? '#0B0F1A' : C.g, t, { dots: .25, c3: ky > 0 ? '#151B2C' : C.gl, c2: ky > 0 ? '#05070D' : C.gd });
  const n = Math.min(365, Math.floor(lt * 120));
  s += flame(540, 620, 1.3, t, n);
  s += pop(t, c('not') - .2, checkbox(0, 0, 1, true, { label: 'Not a robot' }), 540, 1100);
  if (ky > 0) {
    // «...пока» — глитч
    const gl = Math.floor(t * 20) % 3;
    s += `<g transform="translate(${gl * 6 - 6} 0)">${txt(540, 420, 'YET.', { fs: 200, fill: C.red, st: '#fff', sw: 6 })}</g>` + `<g opacity=".5" transform="translate(${-gl * 8} 4)">${txt(540, 420, 'YET.', { fs: 200, fill: C.blue })}</g>`;
    for (let i = 0; i < 6; i++) s += `<rect x="0" y="${f1(R(i, Math.floor(t * 12)) * 1400 + 200)}" width="1080" height="${f1(4 + R(i, 7) * 18)}" fill="#fff" opacity=".12"/>`;
  }
  return s
};

D.next = (t, S, T) => {
  const c = T.c;
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#05070D"/>`;
  // глаза в темноте следят
  const bl = (t % 2.4) < .12, lx = Math.sin(t * 1.3) * .8;
  s += `<g transform="translate(540 640)"><circle r="380" fill="url(#glowG)" opacity=".25"/><ellipse cx="-120" cy="0" rx="100" ry="${bl ? 8 : 100}" fill="#fff"/><ellipse cx="120" cy="0" rx="100" ry="${bl ? 8 : 100}" fill="#fff"/>` +
    (bl ? '' : `<circle cx="${-110 + lx * 30}" cy="10" r="44" fill="#141022"/><circle cx="${130 + lx * 30}" cy="10" r="44" fill="#141022"/>`) + `<path d="M-34,90 L34,90 L0,140Z" fill="${C.or}"/></g>`;
  s += pop(t, c('lesson') - .1, bubble(0, 0, 720, 150, 'DID YOU DO YOUR LESSON?', { fs: 48, bg: C.g, fg: '#fff' }), 540, 330);
  s += stamp(t, c('knows') - .05, 540, 960, 'HE KNOWS', { c: C.g, fs: 100, rot: -6 });
  s += pop(t, c('follow') + .1, btn(0, 0, 420, 116, 'FOLLOW', { c: C.g, fs: 56, press: Math.max(0, Math.sin(t * 6)) * .6 }), 540, 1180);
  return s
};

window.EP = {
  D, cap: { y: C.y, r: C.red, ink: '#0F1626' }, trColor: '#fff',
  tr: { owl: 'iris', claim: 'flash', luis: 'slide', captcha: 'zoom', books: 'slide', google: 'iris', translate: 'slideR', daily: 'zoom', death: 'flash', back: 'up', reveal: 'zoom', you: 'iris', next: 'flash' },
  trAt: { owl: [540, 1170], google: [540, 760], you: [540, 620] }, trCol: { claim: '#fff', death: '#000', next: '#000' },
};
})();
