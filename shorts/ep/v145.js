// v14.5 — точечная полировка v14 по ТЗ Андрея и Gemini (11.11): предметы крупнее (45–60 % высоты), обводка и свечение акцентов,
// лучи на фоне, доезды камеры каждые 3–3,5 с, 6 правок сцен, сцена 9 — доска расследования с плашкой YouTube. Основа — ep/v14.js (не трогать).
// v14 — «Что вы знаете об одноразках?» по мастер-ТЗ (11.11). Один код → 16:9 (1920×1080) и 9:16 (1080×1920): FMT=9x16 node capture.mjs …
// Движок из теста ep/mot.js: фон из слоёв, двухтоновая заливка, пружина, линии рисуют сами себя, пролёт камерой насквозь, удар штампа со встряской.
// Сцены рисуются в «квадрате» ±450 вокруг центра — он помещается в оба формата; фон и водяные знаки заполняют остальное.
// Готовые векторы — ep/v14-icons.js (Fluent Emoji Flat, Game Icons). Рук, лиц и самодельных людей нет.
(function () {
  'use strict';
  // ===== ВСЕ НАДПИСИ В КАДРЕ — здесь (для перевода на en / de / es / fr меняется только этот словарь и звуковая дорожка) =====
  const LANG_STRINGS = {
    ru: {
      title1: 'ЧТО ВЫ ЗНАЕТЕ ОБ', title2: 'ОДНОРАЗКАХ?', y50: '50 ЛЕТ НАЗАД', y1973: '1973 ГОД', brands: ['CAMEL', 'WINSTON'],
      memoHead: 'R.J. REYNOLDS TOBACCO CO.', memoDate: '2 ФЕВРАЛЯ 1973', memoLines: ['КОМПАНИЯ ДОЛЖНА', 'ПОЛУЧИТЬ СВОЮ ДОЛЮ'], youth: 'МОЛОДЁЖНОГО РЫНКА', secret: 'СЕКРЕТНО',
      smoke: 'ТАБАЧНЫЙ ДЫМ', cough: 'КАШЕЛЬ', nic: 'НИКОТИН', acid: 'КИСЛОТА', salt: 'НИКОТИНОВАЯ СОЛЬ', dose: 'ДОЗА',
      toArchive: 'В АРХИВ · 25 ЛЕТ', court: 'СУД · 1998', docs: 'ДОКУМЕНТОВ', archive: 'АРХИВ', stanford: 'STANFORD', near: 'ПО СОСЕДСТВУ', bay: 'КАЛИФОРНИЯ',
      stanfordU: 'STANFORD UNIVERSITY', project: 'ПРОЕКТ 1973', juul: 'JUUL · 2015', usb: 'КАК ФЛЕШКА',
      eq: '1 КАРТРИДЖ = 20 СИГАРЕТ', nonstop: 'БЕЗ ОСТАНОВКИ', usa: 'США · 2019', every4: 'КАЖДЫЙ 4-Й ШКОЛЬНИК', deal: '$13 000 000 000', done: 'ПЛАН ВЫПОЛНЕН',
      s9: ['1. МИФ О МАЛЬБОРО', '2. СЕКРЕТНАЯ ПРОПИТКА', '3. ЛОВУШКА ПОД ГУБУ'], s9cta: 'ПОЛНОЕ РАССЛЕДОВАНИЕ НА YOUTUBE', s9who: 'ДОКТОР МОЗГ', badge: 'DR. BRAIN',
      pct35: '35 % КОМПАНИИ', ucsf: 'АРХИВ UCSF', yt9: 'ПОЛНЫЙ ФИЛЬМ НА YOUTUBE — ССЫЛКА В ПРОФИЛЕ', yt9a: 'ПОЛНЫЙ ФИЛЬМ НА YOUTUBE', yt9b: 'ССЫЛКА В ПРОФИЛЕ',
      s9pin: ['МЕМОРАНДУМ', '1973', 'АРХИВ', '14 000 000'], s9pack: 'ГЛАВНЫЙ ПОДОЗРЕВАЕМЫЙ',
    },
  };
  const L = LANG_STRINGS[window.V14LANG || 'ru'], ICO = window.ICO;
  const VERT = window.FMT === '9x16', WW = VERT ? 1080 : 1920, HH = VERT ? 1920 : 1080, QX = WW / 2, QY = VERT ? 720 : 458, U = VERT ? 1 : .94;
  const C = { b0: '#0d1226', b1: '#162144', b2: '#27367a', gold: '#e1a754', gold2: '#b57f33', red: '#fc5052', red2: '#c0303a', teal: '#3ec6c0', teal2: '#23908c', ivory: '#e8d9b0', paper: '#F3EAD3', paper2: '#D2C5A0', ink: '#0B0F26', white: '#ffffff' };
  P = { bg: C.b0, paper: C.paper, ink: C.ink, line: C.paper, a1: C.gold, a2: C.red };
  const MONO = "FreeMono,'Liberation Mono',monospace", D = {};
  let Q = null, BE = [];
  window.CUES = window.CUES || {};
  function cue(t0, name, gain = 1, pan = 0) { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, pan] }
  // ---------- движение ----------
  const spring = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-6.5 * k) * Math.cos(11 * k);
  const expoIn = k => k <= 0 ? 0 : Math.pow(2, 10 * (clamp(k) - 1)), eoc = k => 1 - Math.pow(1 - clamp(k), 3);
  const sp = (t, a, d = .7) => spring((t - a) / d);
  const draw = (d, k, c, w = 5, glowOn = false, extra = '') => k <= 0 ? '' : `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${R(1000 * (1 - clamp(k))) / 1000}"${glowOn ? ' filter="url(#gl)"' : ''} ${extra}/>`;
  const SHK = new Set(); const hitAt = t0 => { SHK.add(Math.round(t0 * 1000) / 1000) };
  // ---------- готовые векторы ----------
  // set: 'f' — Fluent (цветной, 32×32; приглушается фильтром tone и получает общую тень), 'g' — Game Icons (силуэт, 512×512, цвет o.c)
  function ico(set, name, x, y, size, o = {}) {
    const vb = set === 'f' ? 32 : 512, s = size / vb * (o.s ?? 1); if (s <= 0) return '';
    return `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(o.r || 0)}) scale(${R(s * 1000) / 1000}) translate(${-vb / 2} ${-vb / 2})" style="color:${o.c || C.ivory}"${o.op != null ? ` opacity="${R(o.op * 100) / 100}"` : ''}${set === 'f' ? ` filter="url(#${o.fl || 'duoG'})"` : (o.sh ? ' filter="url(#ds)"' : '')}>${ICO[set][name]}</g>`
  }
  const wmark = (name, x, y, size, t, i = 0) => ico('g', name, x + Math.sin(t * .25 + i) * 24, y + Math.cos(t * .2 + i) * 14, size, { op: .06, c: C.ivory, r: Math.sin(t * .15 + i) * 3 });
  const defs = () => `<filter id="duoG" x="-30%" y="-30%" width="160%" height="170%"><feColorMatrix type="matrix" values=".3 .55 .15 0 0 .3 .55 .15 0 0 .3 .55 .15 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues=".07 .7 .99"/><feFuncG type="table" tableValues=".08 .36 .74"/><feFuncB type="table" tableValues=".18 .1 .3"/></feComponentTransfer><feDropShadow dx="0" dy=".5" stdDeviation=".5" flood-color="#000" flood-opacity=".5"/></filter>` + `<filter id="duoT" x="-30%" y="-30%" width="160%" height="170%"><feColorMatrix type="matrix" values=".3 .55 .15 0 0 .3 .55 .15 0 0 .3 .55 .15 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues=".05 .14 .55"/><feFuncG type="table" tableValues=".08 .56 .92"/><feFuncB type="table" tableValues=".16 .55 .86"/></feComponentTransfer><feDropShadow dx="0" dy=".5" stdDeviation=".5" flood-color="#000" flood-opacity=".5"/></filter>` + `<filter id="chR"><feColorMatrix type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/></filter><filter id="chC"><feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"/></filter>` + `<filter id="gl2" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="12" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` + `<filter id="ds" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>` +
    `<filter id="gl" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
    `<filter id="bl" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="16"/></filter>` +
    `<filter id="tone" x="-30%" y="-30%" width="160%" height="170%"><feColorMatrix type="saturate" values=".7"/><feComponentTransfer><feFuncR type="linear" slope=".93"/><feFuncG type="linear" slope=".9"/><feFuncB type="linear" slope=".92"/></feComponentTransfer><feDropShadow dx="0" dy=".5" stdDeviation=".5" flood-color="#000" flood-opacity=".5"/></filter>` +
    `<filter id="dark" x="-30%" y="-30%" width="160%" height="170%"><feColorMatrix type="matrix" values=".16 .2 .06 0 .03  .14 .2 .08 0 .05  .2 .3 .2 0 .12  0 0 0 1 0"/><feDropShadow dx="0" dy=".5" stdDeviation=".5" flood-color="#000" flood-opacity=".5"/></filter>` +
    `<radialGradient id="vg" cx=".5" cy=".46" r=".75"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient>` +
    `<linearGradient id="plate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".4" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></linearGradient>`;
  // ---------- фон из слоёв ----------
  function back(t, yr, o = {}) {
    const c0 = o.c0 || C.b0, c1 = o.c1 || C.b1, [id, gd] = rgrad([[0, c1, 1], [1, c0, 1]]), cx = Math.sin(t * .5) * 14;
    let s = `<rect x="-600" y="-600" width="${WW + 1200}" height="${HH + 1200}" fill="${c0}"/>` + gd + `<ellipse cx="${QX}" cy="${QY}" rx="${VERT ? 900 : 1250}" ry="${VERT ? 1100 : 820}" fill="url(#${id})"/>` + `<path d="${RAYS}" fill="#2e65a4" opacity=".06" transform="translate(${QX} ${QY}) rotate(${R(t * 2.2)})"/>`;
    let gr = ''; const ox = (cx * .35 + t * 7) % 90, oy = (t * 4) % 90;
    for (let x = -90; x <= WW + 90; x += 90) gr += `M${R(x + ox)} -100V${HH + 100}`; for (let y = -90; y <= HH + 90; y += 90) gr += `M-100 ${R(y + oy)}H${WW + 100}`;
    s += `<path d="${gr}" stroke="${C.ivory}" stroke-width="2" opacity=".06" fill="none"/>`;
    s += g([260, 400, 560, 760].map((r, i) => `<circle cx="${QX}" cy="${QY}" r="${r}" fill="none" stroke="${C.ivory}" stroke-width="2" stroke-dasharray="${6 + i * 6} ${18 + i * 10}" opacity=".1" transform="rotate(${R(t * (i % 2 ? -5 : 4) + i * 30)} ${QX} ${QY})"/>`).join(''), `translate(${R(cx * .5)} 0)`);
    if (yr) s += tx(yr, QX + cx * .6, QY + (VERT ? -330 : 170), { f: 'U', w: 800, s: o.ys || (VERT ? 300 : 460), c: C.ivory, op: o.yo ?? .07 });
    for (let i = 0; i < 22; i++) { const u = (rnd(i + 2) + t * (.02 + rnd(i) * .03)) % 1; s += `<circle cx="${R(rnd(i + 40) * WW + Math.sin(t * .7 + i) * 26)}" cy="${R(HH - u * HH)}" r="${R(2.5 + rnd(i + 9) * 4)}" fill="${C.ivory}" opacity="${R((.15 + rnd(i + 5) * .15) * Math.sin(Math.PI * u))}"/>` }
    return s
  }
  const top = t => `<rect x="0" y="${VERT ? 1150 : HH - 250}" width="${WW}" height="${VERT ? 380 : 250}" fill="url(#plate)"/><rect width="${WW}" height="${HH}" fill="url(#vg)"/><filter id="gn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${Math.floor(t * 12) % 9 + 1}"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .33 .33 .33 0 -.28"/></filter><rect width="${WW}" height="${HH}" filter="url(#gn)" opacity=".16"/>`;
  const sq = (inner, t, k) => { k = k || { s: 1, x: 0, y: 0 }; return g(inner, `translate(${R(QX + Math.sin(t * .5) * 10)} ${QY}) scale(${R(U * k.s * 1000) / 1000}) translate(${R(-k.x)} ${R(-k.y)})`) };
  // доезд камеры: ключи [время, масштаб, x, y] — каждый следующий плавно за 0,8 с (под-планы внутри длинной сцены)
  function cam(t, keys) { let k = { s: keys[0][1], x: keys[0][2], y: keys[0][3] }; for (let i = 1; i < keys.length; i++) { const [t0, s0, x0, y0] = keys[i], e = EZ.io(clamp((t - t0) / .8)); if (e <= 0) break; k = { s: lerp(k.s, s0, e), x: lerp(k.x, x0, e), y: lerp(k.y, y0, e) } } return k }
  const RAYS = (() => { let d = ''; for (let i = 0; i < 18; i++) { const a0 = i * Math.PI / 9, a1 = a0 + Math.PI / 20; d += `M0 0L${R(Math.cos(a0) * 2600)} ${R(Math.sin(a0) * 2600)}L${R(Math.cos(a1) * 2600)} ${R(Math.sin(a1) * 2600)}Z` } return d })();   // сцена в «квадрате»
  const SX = x => QX + x * U, SY = y => QY + y * U;
  // ---------- приёмы ----------
  // плашка-хайлайтер: раскрывается слева направо за 0,2 с
  function hl(s0, x, y, t, t0, col = C.red, o = {}) {
    const k = eoc((t - t0) / .2); if (k <= 0) return '';
    const sz = o.s || 54, w = tw(s0, { f: 'U', w: 800, s: sz }) + 52, h = sz * 1.5, id = uid(), x0 = x - w / 2;
    return `<clipPath id="${id}"><rect x="${R(x0)}" y="${R(y - h / 2)}" width="${R(w * k)}" height="${R(h)}"/></clipPath><rect x="${R(x0)}" y="${R(y - h / 2)}" width="${R(w * k)}" height="${R(h)}" fill="${col}" opacity=".5" filter="url(#bl)"/><g clip-path="url(#${id})"><rect x="${R(x0)}" y="${R(y - h / 2)}" width="${R(w)}" height="${R(h)}" fill="${col}" stroke="${C.ink}" stroke-width="8"/><rect x="${R(x0)}" y="${R(y)}" width="${R(w)}" height="${R(h / 2)}" fill="#000" opacity=".12"/>` + tx(s0, x, y + sz * .36, { f: 'U', w: 800, s: sz, c: col === C.gold ? C.ink : C.white }) + '</g>'
  }
  // штамп: 2,2 → 1 за 0,18 с, встряска кадра, кольцо
  function stampHit(s0, x, y, t, t0, rot = -9, col = C.red, sz = 66) {
    const k = clamp((t - t0 + .18) / .18); if (k <= 0) return '';
    if (t >= t0) hitAt(t0);
    const w = tw(s0, { f: 'O', w: 700, s: sz, ls: 6 }) + 70, h = sz * 1.7, pk = (t - t0) / .5;
    return g(`<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="12" fill="none" stroke="${col}" stroke-width="10"/><rect x="${-w / 2 + 14}" y="${-h / 2 + 14}" width="${w - 28}" height="${h - 28}" rx="6" fill="none" stroke="${col}" stroke-width="3"/>` + tx(s0, 0, sz * .35, { f: 'O', w: 700, s: sz, c: col, ls: 6 }), `translate(${x} ${y}) rotate(${rot}) scale(${R(lerp(2.2, 1, k * k) * 100) / 100})`, clamp(k * 3)) +
      (pk > 0 && pk < 1 ? `<circle cx="${x}" cy="${y}" r="${R(120 + pk * 420)}" fill="none" stroke="${col}" stroke-width="${R(12 * (1 - pk))}" opacity="${R(1 - pk)}"/>` : '')
  }
  const puffs = (x, y, t, a = 1, n = 5, c = C.ivory) => { let s = ''; for (let i = 0; i < n; i++) { const u = (t * .32 + i / n) % 1; s += `<circle cx="${R(x + Math.sin(t * .9 + i * 2.1) * 46 * u)}" cy="${R(y - u * 260)}" r="${R(34 + u * 70)}" fill="${c}" opacity="${R(.26 * a * Math.sin(Math.PI * u))}"/>` } return a > 0 ? `<g filter="url(#bl)">${s}</g>` : '' };
  function crystal(x, y, s, r = 0) { return s <= 0 ? '' : g(`<g filter="url(#ds)"><path d="M0 -120L104 -60L0 0L-104 -60Z" fill="#fff"/><path d="M-104 -60L0 0V120L-104 60Z" fill="${C.paper}"/><path d="M104 -60L0 0V120L104 60Z" fill="${C.paper2}"/><path d="M0 -120L104 -60V60L0 120L-104 60V-60ZM0 0V120M0 0L104 -60M0 0L-104 -60" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/><path d="M0 -44L38 -22L0 0L-38 -22Z" fill="${C.gold}" filter="url(#gl)"/></g>`, `translate(${R(x)} ${R(y)}) scale(${R(s * 100) / 100}) rotate(${R(r)})`) }
  // одноразка: угловатый корпус, двухтоновая заливка, неоновый контур, светодиод; xr — рентген 0…1; led — яркость
  const VB = 'M-84 -196H84L100 -180V214L84 230H-84L-100 214V-180Z', VMO = 'M-56 -196L-46 -270L48 -250L56 -196Z', VWIN = 'M0 -152L64 -58L0 36L-64 -58Z';
  function vape(t, xr = 0, led = .6, dim = 1, lc = C.teal) {
    const bl = led * (.75 + .25 * Math.sin(t * 7)), o1 = R(1 - xr), lv = -58 + 50 * Math.sin(t * 1.3) * .2;
    let s = `<g filter="url(#ds)" opacity="${R(dim)}"><path d="${VMO}" fill="#1b1f27"/><path d="M4 -196L4 -261L48 -250L56 -196Z" fill="#101318"/>` +
      `<path d="${VB}" fill="#2d333e" opacity="${o1}"/><path d="M0 -196H84L100 -180V214L84 230H0Z" fill="#1c2029" opacity="${o1}"/><path d="M-84 -196H84L100 -180H-100Z" fill="#3c4452" opacity="${o1}"/></g>`;
    const id = uid();
    s += `<clipPath id="${id}"><path d="${VWIN}"/></clipPath><g opacity="${R((1 - xr) * .97)}"><path d="${VWIN}" fill="#7a4a1c"/><g clip-path="url(#${id})"><rect x="-70" y="${R(lv)}" width="140" height="120" fill="${C.gold}"/><rect x="0" y="${R(lv)}" width="70" height="120" fill="${C.gold2}"/><path d="M-70 ${R(lv)}q18 -8 35 0t35 0t35 0t35 0" fill="none" stroke="#fff" stroke-width="4" opacity=".55"/></g></g>`;
    s += draw(VB, 1, xr > .5 ? C.ivory : C.ink, 5, false, xr > .5 ? 'stroke-dasharray=".012 .014"' : '') + draw(VMO, 1, xr > .5 ? C.ivory : C.ink, 5) + `<path d="${VWIN}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round" opacity="${o1}"/><path d="${VWIN}" fill="none" stroke="${C.gold}" stroke-width="3" filter="url(#gl2)" opacity="${R((1 - xr) * .8)}"/>`;
    s += (xr < 1 ? draw('M-84 -170V200', 1, '#fff', 5, false, `opacity="${R(.35 * (1 - xr))}"`) : '');
    s += `<circle cx="0" cy="194" r="${R(40 + 46 * bl)}" fill="${lc}" opacity="${R(.3 * bl)}" filter="url(#bl)"/><rect x="-46" y="186" width="92" height="16" rx="8" fill="${lc}" opacity="${R(.35 + .65 * bl)}" filter="url(#gl2)"/><rect x="-46" y="186" width="92" height="16" rx="8" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
    if (xr > 0) s += crystal(0, -50, .5 * spring(xr)) + `<circle cx="0" cy="-50" r="${R(70 + ((t * .9) % 1) * 150)}" fill="none" stroke="${C.gold}" stroke-width="4" opacity="${R(xr * (1 - (t * .9) % 1) * .8)}"/>`;
    return s
  }
  // лист записки 1973: слова появляются целиком; o.n — сколько строк видно, o.hl — время плашки, o.mark — время маркера
  const DOC = 'M-270 -360H170L270 -260V360H-270Z';
  function memo(t, o = {}) {
    let d = `<g filter="url(#ds)"><path d="${DOC}" fill="${C.paper}"/></g>` + fill('M60 -360H170L270 -260V360H-40Z', C.paper2, .55) + fill('M170 -360V-260H270Z', C.paper2) + `<path d="${DOC}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>` + draw('M170 -360V-260H270', 1, C.ink, 5) + draw('M-254 -344V344', 1, '#fff', 5, false, 'opacity=".7"');
    const a = o.a ?? -9;
    d += tx(L.memoHead, -232, -276, { f: MONO, w: 700, s: 23, c: C.ink, a: 'start', op: clamp((t - a - .3) * 4) }) + tx(L.memoDate, -232, -242, { f: MONO, w: 700, s: 23, c: C.red2, a: 'start', op: clamp((t - a - .45) * 4) });
    [[-190, 420], [-148, 330]].forEach(([y, w], i) => { d += draw(`M-232 ${y}h${w}`, (t - a - .5 - i * .1) / .3, C.ink, 7, false, 'opacity=".3"') });
    L.memoLines.forEach((s0, i) => { d += tx(s0, -232, -70 + i * 56, { f: MONO, w: 700, s: 36, c: C.ink, a: 'start', op: clamp((t - (o.tl ?? a) - i * .35) * 6) }) });
    if (o.hl != null) d += hl(L.youth, -232 + (tw(L.youth, { f: 'U', w: 800, s: 27 }) + 52) / 2, 58, t, o.hl, C.red, { s: 27 }) + draw('M-250 44C-150 -6 190 -8 262 40C296 78 150 112 -30 110C-190 108 -288 86 -252 34', (t - o.hl - .25) / .45, C.red, 7, true);
    [[150, 380], [198, 300], [246, 350]].forEach(([y, w], i) => { d += draw(`M-232 ${y}h${w}`, (t - a - .7 - i * .1) / .3, C.ink, 7, false, 'opacity=".3"') });
    return d
  }
  const PROF = 'M-70 320V170C-150 130 -200 40 -190 -60C-178 -180 -80 -250 30 -240C130 -230 190 -160 190 -70C190 -50 188 -34 184 -20C200 10 222 44 232 64C238 76 230 84 216 84L196 86C198 98 200 110 196 120C206 128 204 140 194 146C198 168 190 190 166 196C140 202 110 200 86 196V320', AIR = 'M196 133C150 136 96 140 62 172C34 200 20 250 14 320';
  const FL = 'M-52 -330H52V-120L196 190C222 246 184 296 126 296H-126C-184 296 -222 246 -196 190L-52 -120Z';

  // ---------- v14.5: завод-силуэт, мозг, монеты, пачка, колба, глитч ----------
  function factory(t, fy, a) {
    if (a <= 0) return '';
    const b = fy + 250, CH = [[-300, 520], [-150, 600], [250, 560]], BL = [[-470, 300, 330], [-160, 260, 420], [130, 340, 300]];
    let s = '', sh = '', ol = '', win = '';
    for (const [x, h] of CH) s += puffs(x, b - h - 10, t + x * .01, a, 7, '#6b7499') + puffs(x + 22, b - h - 40, t + 1.7 + x * .01, a * .8, 6, '#59617f');
    for (const [x, h] of CH) sh += `<path d="M${x - 30} ${b}L${x - 22} ${b - h}H${x + 22}L${x + 30} ${b}Z" fill="#1c2440"/><path d="M${x} ${b}V${b - h}H${x + 22}L${x + 30} ${b}Z" fill="#141a30"/><rect x="${x - 26}" y="${b - h - 4}" width="52" height="18" fill="#232c4c"/><rect x="${x - 23}" y="${b - h + 60}" width="46" height="10" fill="${C.red}"/>`;
    for (const [x, w, h] of BL) { const n = Math.round(w / 60); let saw = `M${x} ${b - h}`; for (let k = 0; k < n; k++) saw += `L${R(x + (k + 1) * w / n)} ${b - h - 46}V${b - h}`; sh += `<path d="${saw}Z" fill="#2a3456"/><rect x="${x}" y="${b - h}" width="${w}" height="${h}" fill="#1c2440"/><rect x="${R(x + w / 2)}" y="${b - h}" width="${R(w / 2)}" height="${h}" fill="#141a30"/>`; ol += `M${x} ${b}V${b - h}H${x + w}V${b}${saw}` }
    for (const [x, w, h] of BL) for (let r = 0; r < Math.floor((h - 50) / 38); r++) for (let k = 0; k < Math.floor((w - 24) / 30); k++) { const i = x * 7 + r * 31 + k * 13; if (rnd(i) > .3 && rnd(i + Math.floor(t * .8 + rnd(i) * 5)) > .12) win += `M${x + 18 + k * 30} ${b - h + 28 + r * 38}h15v22h-15Z` }
    for (const [x, h] of CH) ol += `M${x - 30} ${b}L${x - 22} ${b - h}H${x + 22}L${x + 30} ${b}`;
    s += `<g filter="url(#ds)">${sh}</g><path d="${win}" fill="${C.gold}" filter="url(#gl2)"/><path d="${ol}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/><rect x="-520" y="${b}" width="1040" height="14" fill="${C.ink}"/>`;
    return g(s, '', a)
  }
  function brainArt(t, s, hot) {
    if (s <= 0) return ''; const id = uid();
    let d = `<g filter="url(#ds)"><path d="${BRAIN}" fill="${C.b2}"/></g><clipPath id="${id}"><rect x="8" y="-260" width="300" height="420"/></clipPath><path d="${BRAIN}" fill="${C.b1}" clip-path="url(#${id})" opacity=".75"/>`;
    d += `<path d="${BRAIN_IN}" fill="none" stroke="${C.gold}" stroke-width="8" stroke-linecap="round" filter="url(#gl2)"/>`;
    d += `<path d="${BRAIN_IN}" fill="none" stroke="${C.red}" stroke-width="11" stroke-linecap="round" pathLength="1" stroke-dasharray=".05 .17" stroke-dashoffset="${R(((-t * .45) % 1) * 1000) / 1000}" filter="url(#gl2)" opacity="${R(.35 + .65 * hot)}"/>`;
    d += `<path d="${BRAIN}" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round"/>`;
    return g(d, `scale(${R(s * 100) / 100})`)
  }
  function coins(x, y, k) {
    if (k <= 0) return ''; let s = '';
    for (let i = 0; i < 5; i++) s += `<ellipse cx="0" cy="${-i * 26}" rx="90" ry="30" fill="${C.gold2}" stroke="${C.ink}" stroke-width="4"/><ellipse cx="0" cy="${-i * 26 - 8}" rx="90" ry="30" fill="${C.gold}" stroke="${C.ink}" stroke-width="4"/>`;
    return g(`<g filter="url(#ds)">${s}</g>` + tx('$', 0, -4 * 26 - 8 + 15, { f: 'U', w: 800, s: 40, c: C.ink }), `translate(${x} ${y}) scale(${R(k * 100) / 100})`)
  }
  const packSvg = () => `<g filter="url(#ds)"><rect x="-95" y="-140" width="190" height="290" rx="10" fill="${C.white}"/><path d="M-95 -140H95V-10L0 -84L-95 -10Z" fill="#D8232A"/><rect x="0" y="-140" width="95" height="290" fill="#000" opacity=".1"/></g><rect x="-95" y="-140" width="190" height="290" rx="10" fill="none" stroke="${C.ink}" stroke-width="5"/>`;
  function flaskSvg(t, a = 1) {
    const id = uid(), lv = 40 + Math.sin(t * 3) * 6;
    let f = `<clipPath id="${id}"><path d="${FL}"/></clipPath><path d="${FL}" fill="${C.paper}" opacity=".12"/><g clip-path="url(#${id})"><rect x="-240" y="${R(lv)}" width="480" height="400" fill="${C.teal}"/><rect x="0" y="${R(lv)}" width="240" height="400" fill="${C.teal2}"/>`;
    for (let i = 0; i < 9; i++) { const b = (rnd(i) + t * (.4 + rnd(i + 3) * .3)) % 1; f += `<circle cx="${R(-140 + rnd(i + 11) * 280)}" cy="${R(290 - b * (290 - lv))}" r="${R(6 + rnd(i + 5) * 10)}" fill="none" stroke="#fff" stroke-width="4" opacity="${R(.6 * (1 - b))}"/>` }
    f += `</g><path d="${FL}" fill="none" stroke="${C.ink}" stroke-width="9" stroke-linejoin="round"/><ellipse cx="0" cy="-330" rx="62" ry="12" fill="none" stroke="${C.ink}" stroke-width="8"/>` + draw('M-32 -310V-130L-168 180', 1, '#fff', 7, false, 'opacity=".45"');
    return g(`<g filter="url(#ds)">${f}</g>` + puffs(0, -380, t, a * .7, 4, C.teal), '', a)
  }
  function glitch(s, k, t) {
    const a = 1 - clamp(k / .45), f = Math.floor(t * 30); if (a <= 0) return s;
    let o = s + `<g transform="translate(${R(22 * a)} 0)" opacity="${R(.5 * a)}" filter="url(#chR)">${s}</g><g transform="translate(${R(-22 * a)} 0)" opacity="${R(.5 * a)}" filter="url(#chC)">${s}</g>`;
    for (let i = 0; i < 6; i++) { const y = rnd(f * 7 + i) * HH, h = 12 + rnd(f * 3 + i) * 70, dx = (rnd(f + i * 9) - .5) * 260 * a, id = uid(); o += `<clipPath id="${id}"><rect x="-600" y="${R(y)}" width="${WW + 1200}" height="${R(h)}"/></clipPath><g clip-path="url(#${id})" transform="translate(${R(dx)} 0)">${s}</g>` }
    for (let i = 0; i < 5; i++) o += `<rect x="0" y="${R(rnd(f + i * 5) * HH)}" width="${WW}" height="${R(2 + rnd(f * 2 + i) * 9)}" fill="${i % 2 ? C.red : C.teal}" opacity="${R(.55 * a)}"/>`;
    return o
  }

  // ================= СЦЕНЫ =================
  // 1. Интро: одноразка парит, манго и мята → рентген: внутри кристалл, [50 ЛЕТ НАЗАД], год отматывается 2026 → 1973
  function s1(t) {
    const q = Q, xr = E(t, q.vnutri - .1, .6), yk = P01(t, q.p50 - .1, 1.3), yr = Math.round(lerp(2026, 1973, EZ.io(yk)));
    let c = puffs(-10, -380, t, 1 - xr, 6) + g(vape(t, xr, .7), `translate(0 ${R(30 + Math.sin(t * 1.6) * 10)}) rotate(${R(-8 + Math.sin(t * .8) * 1.5 + 8 * xr)}) scale(1.6)`);
    c += ico('f', 'mango', -390, -100 + Math.sin(t * 1.3) * 10, 330, { s: sp(t, q.mango - .15, .6) * (1 - xr), r: -12, fl: 'duoG' }) + ico('f', 'herb', 390, -30 + Math.sin(t * 1.1 + 1) * 10, 320, { s: sp(t, q.myata - .15, .6) * (1 - xr), r: 10, fl: 'duoT' });
    c += g(tx(L.title1, 0, -412, { f: 'O', w: 500, s: 36, c: C.ivory, ls: 12 }) + tx(L.title2, 0, -350, { f: 'U', w: 800, s: 60, c: C.ivory }), '', clamp(t / .3) * (1 - E(t, q.manT - .3, .4)));
    const ov = hl(L.y50, 0, VERT ? 400 : 395, t, q.p50 - .05, C.gold);
    cue(.1, 'shimmer', .5); cue(q.mango - .15, 'drip', .5, -.4); cue(q.myata - .15, 'drip', .5, .4); cue(q.vnutri - .1, 'whoosh', .5); cue(q.p50 - .05, 'swish', .7); if (yk > 0 && yk < 1) cue(Math.floor(t * 8) / 8, 'tick', .3);
    return back(t, yk > 0 ? String(yr) : '', { yo: .1 }) + sq(c, t, cam(t, [[0, .94, 0, 0], [q.manT + .3, 1.1, 0, 10], [q.vnutri - .35, .94, 0, 0], [q.p50 + .15, 1.15, 0, -40]])) + sq(ov, t)
  }
  // 2. Завод Camel / Winston → секретный отчёт 1973, плашка «молодёжного рынка», штамп
  function s2(t) {
    const q = Q, up = sp(t, q.tab - .2, .9), out = E(t, q.cel - .35, .6), me = sp(t, q.cel - .2, .9), st = q.rynok + .45;
    let s = back(t, '1973') + sq(wmark('crown', -330, -250, 300, t) + wmark('camel', 330, 250, 330, t, 2), t), c = '', ov = '';
    if (out < 1) {
      const fy = lerp(1000, 10, up) + 900 * out;
      c += factory(t, fy, up * (1 - out));
      L.brands.forEach((b, i) => { const k = sp(t, q.camel - .1 + i * .35, .5); if (k > 0) c += g(`<rect x="-175" y="-50" width="350" height="100" rx="10" fill="${C.gold}" opacity=".45" filter="url(#bl)"/><rect x="-175" y="-50" width="350" height="100" rx="10" fill="${C.ivory}" stroke="${C.ink}" stroke-width="5" filter="url(#ds)"/><rect x="0" y="-47" width="172" height="94" fill="#000" opacity=".08"/>` + tx(b, 0, 22, { f: 'O', w: 700, s: 62, c: C.ink, ls: 6 }), `translate(${i ? 205 : -205} ${R(fy + 330)}) scale(${R(k * 100) / 100})`) });
      ov += hl(L.y1973, 0, -400, t, q.y73, C.gold);
      cue(q.tab - .2, 'thud', .5); cue(q.camel - .1, 'swish', .4); cue(q.y73, 'swish', .6);
    }
    if (me > 0) c += g(memo(t, { a: q.cel - .2, tl: q.poluch - .1, hl: q.mol - .05 }) + stampHit(L.secret, 70, -160, t, st), `translate(0 ${R(lerp(1400, 10, me))}) rotate(${R(lerp(-14, -3, me) + Math.sin(t * .9) * .6)}) scale(1.16)`);
    cue(q.cel - .2, 'swish', .6); cue(q.mol - .05, 'swish', .7); cue(st, 'stamp', 1); cue(st, 'impact', .45);
    return s + sq(c, t, cam(t, [[0, 1, 0, 0], [q.camel - .25, 1.22, 0, 170], [q.cel - .35, 1, 0, 0], [q.poluch - .1, 1.45, -50, 70], [q.rynok + .3, 1.15, 40, -60]])) + sq(ov, t)
  }
  // 3. Рентген-контур: дым обжигает горло, [КАШЕЛЬ] → лаборатория: никотин + кислота = соль, шкала дозы
  function s3(t) {
    const q = Q, B = t >= q.togda - .15;
    let s = back(t, B ? 'C10H14N2' : '', { ys: VERT ? 150 : 250, yo: .06 }) + sq(wmark('lungs', -340, 230, 320, t) + wmark('nested-hexagons', 340, -250, 300, t, 3), t), c = '', ov = '';
    if (!B) {
      const k1 = E(t, q.dym - .3, 1.0), k2 = P01(t, q.deret - .1, .5), sh = Math.sin(t * 46) * 6 * P01(t, q.deret, .12) * (1 - P01(t, q.deret + .6, .4));
      let h = draw(PROF, E(t, Q.s3 - .1, 1.0), C.teal, 5, true) + draw(AIR, E(t, Q.s3 + .3, .8), C.ivory, 4, false, 'opacity=".5"') + draw('M560 30C470 -30 400 190 330 150C280 124 240 132 196 133', k1, '#9aa3c4', 7) + draw(AIR, (t - q.dym - .5) / .5, '#9aa3c4', 7);
      if (k2 > 0) for (let i = 0; i < 3; i++) { const u = (t * 1.4 + i / 3) % 1; h += `<circle cx="52" cy="190" r="${R(24 + u * 110)}" fill="none" stroke="${C.red}" stroke-width="7" opacity="${R((1 - u) * k2)}" filter="url(#gl)"/>` }
      if (k2 > 0) h += draw('M30 150l22 30l-26 22l30 26l-24 28', k2, C.red, 8, true);
      c += g(h, `translate(${R(-140 + sh)} -60) scale(1.45)`) + ico('f', 'cigarette', 420, -40, 300, { s: sp(t, Q.s3 + .2, .6), r: -20 }); ov += hl(L.cough, 60, 350, t, q.deret, C.red);
      cue(Q.s3 - .1, 'whoosh', .4); cue(q.dym - .3, 'puff', .6); cue(q.deret, 'zap', .6); cue(q.deret, 'swish', .6);
    } else {
      const u = t - q.togda, en = sp(t, q.togda - .1, .8), fx = -30, fy = lerp(1300, 130, en), FS = .98, bob = Math.sin(t * 2) * 8, pour = P01(t, q.kis - .5, 1.2), lv = lerp(120, 10, P01(t, q.kis - .4, 1.5)), mixk = P01(t, q.kis + .2, .9), cr = sp(t, q.sol - .2, .8), go = E(t, q.kis + .8, .7), id = uid();
      const liq = mixk > .5 ? C.paper : C.gold, liq2 = mixk > .5 ? C.paper2 : C.gold2;
      let f = `<ellipse cx="0" cy="322" rx="230" ry="26" fill="#000" opacity=".35"/><clipPath id="${id}"><path d="${FL}"/></clipPath><path d="${FL}" fill="${C.paper}" opacity=".1"/><g clip-path="url(#${id})"><rect x="-240" y="${R(lv)}" width="480" height="400" fill="${liq}"/><rect x="0" y="${R(lv)}" width="240" height="400" fill="${liq2}"/><path d="M-240 ${R(lv)}q60 ${R(-14 - Math.sin(t * 4) * 8)} 120 0t120 0t120 0t120 0" fill="none" stroke="#fff" stroke-width="6" opacity=".5"/>`;
      for (let i = 0; i < 10; i++) { const b = (rnd(i) + t * (.35 + rnd(i + 3) * .3) * (1 + mixk)) % 1; f += `<circle cx="${R(-150 + rnd(i + 11) * 300)}" cy="${R(290 - b * (290 - lv))}" r="${R(5 + rnd(i + 5) * 9)}" fill="none" stroke="#fff" stroke-width="3" opacity="${R(.55 * (1 - b))}"/>` }
      f += `</g><path d="${FL}" fill="none" stroke="${C.ivory}" stroke-width="7" stroke-linejoin="round"/>` + draw('M-32 -310V-130L-168 180', 1, '#fff', 6, false, 'opacity=".4"') + `<ellipse cx="0" cy="-330" rx="62" ry="12" fill="none" stroke="${C.ivory}" stroke-width="7"/>`;
      c += g(`<g filter="url(#ds)">${f}</g>`, `translate(${fx} ${R(fy + bob)}) scale(${FS})`);
      const TX = fx + 320 + 700 * go, TY = fy - 330 + bob, ang = lerp(0, -62, P01(t, q.kis - .8, .4)) * (1 - go);   // пробирка после струи уходит за правый край
      c += g(ico('f', 'test-tube', 0, 0, 230, { r: 0 }), `translate(${R(TX)} ${R(lerp(-700, TY, sp(t, q.togda + .3, .7)))}) rotate(${R(ang + 40)})`, 1 - go);
      if (pour > 0 && pour < 1) c += draw(`M${R(fx + 210)} ${R(TY + 40)}C${R(fx + 120)} ${R(TY + 20)} ${fx + 6} ${R(TY + 60)} ${fx} ${R(fy - 330 * FS + bob)}V${R(fy + lv * FS + bob)}`, pour * 3, C.teal, 12, true);
      c += draw(`M${fx - 150} ${R(fy + 150)}H${fx - 330}V${R(fy + 40)}`, (u - .5) / .5, C.gold, 4, true) + tx(L.nic, fx - 330, fy + 10, { f: 'O', w: 700, s: 36, c: C.gold, ls: 5, op: clamp((t - q.nik + .1) * 3) }) + tx(L.acid, fx + 330, fy - 150, { f: 'O', w: 700, s: 36, c: C.teal, ls: 5, op: clamp((t - q.kis + .5) * 3) * (1 - go) });
      if (cr > 0) { c += crystal(fx, fy - 420 + bob * .5 - 10 * Math.sin(t * 2.2), cr * .82, (1 - cr) * 40); ov += hl(L.salt, 0, VERT ? -420 : -410, t, q.sol, C.gold, { s: 46 }) }
      const dz = E(t, q.myagko - .2, Math.max(.8, q.doze - q.myagko + .3)), pk = t > q.doze && Math.sin(t * 16) > 0, bx = 380, by = fy + 230, bh = 520;
      c += g(`<rect x="${bx - 26}" y="${R(by - bh)}" width="52" height="${bh}" rx="26" fill="${C.b0}" opacity=".7"/><rect x="${bx - 26}" y="${R(by - bh * (.08 + .92 * dz))}" width="52" height="${R(bh * (.08 + .92 * dz))}" rx="26" fill="${pk ? C.red : C.teal}" filter="url(#gl)"/><rect x="${bx - 26}" y="${R(by - bh)}" width="52" height="${bh}" rx="26" fill="none" stroke="${C.ivory}" stroke-width="5"/>` + tx(L.dose, bx, by + 50, { f: 'O', w: 700, s: 34, c: C.ivory, ls: 5 }), '', E(t, q.myagko - .4, .4));
      cue(q.togda - .1, 'whoosh', .4); cue(q.kis - .5, 'bubble', .8); cue(q.sol - .2, 'ding', .9); cue(q.sol, 'swish', .6); cue(q.myagko - .2, 'whirr', .4);
    }
    return s + sq(c, t, cam(t, [[0, 1, 0, 0], [q.deret - .3, 1.4, -60, 190], [q.togda - .3, 1, 0, 0], [q.kis - .15, 1.3, -30, 140], [q.sol - .3, 1.05, 0, -60], [q.myagko - .25, 1.3, 260, 100]])) + sq(ov, t)
  }
  // 4. Формула в папку, замок, штамп [В АРХИВ · 25 ЛЕТ] → 1998: молоток, ячейки открываются, [14 000 000 ДОКУМЕНТОВ]
  function s4(t) {
    const q = Q, B = t >= q.v98 - .15;
    let s = back(t, B ? '1998' : '1973'), c = '', ov = '';
    if (!B) {
      const en = sp(t, Q.s4 - .1, .8), dr = E(t, q.form - .3, .8, 'io'), lk = sp(t, q.arhiv - .15, .6), st = q.dvad + .3;
      c += g(ico('f', 'open-file-folder', 0, 50, 640), `translate(0 ${R(lerp(1300, 0, en) + Math.sin(t * 1.5) * 6)})`) + crystal(0, lerp(-420, 40, dr), lerp(.9, .3, dr) * (dr < 1 ? 1 : 0)) + ico('f', 'locked', 180, 200, 220, { s: lk, r: 8 }) + stampHit(L.toArchive, 0, -60, t, st, -8, C.red, 62);
      cue(Q.s4 - .1, 'swish', .5); cue(q.form + .3, 'thud', .4); cue(q.arhiv - .1, 'tick', .8); cue(st, 'stamp', 1); cue(st, 'impact', .4);
    } else {
      const op = P01(t, q.raskr - .2, 1.6), gk = P01(t, q.sud - .12, .16), mk = P01(t, q.chet - .1, 1.6), n = Math.round(14e6 * eoc(mk) / 1e5) * 1e5;
      for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) {
        const x = -360 + k * 180, y = -60 + r * 150, our = r === 1 && k === 2, o = eoc(clamp(op * 2.4 - (r * .22 + k * .12)));
        c += `<rect x="${x - 78}" y="${y - 60}" width="156" height="120" rx="8" fill="${C.ink}" opacity=".6"/>`;
        if (o > 0) c += `<rect x="${x - 58}" y="${R(y - 40 - 70 * o)}" width="116" height="110" rx="4" fill="${our ? C.red : C.paper}"${our ? ' filter="url(#gl)"' : ''}/><rect x="${x}" y="${R(y - 40 - 70 * o)}" width="58" height="110" fill="#000" opacity=".12"/>` + draw(`M${x - 40} ${R(y - 14 - 70 * o)}h80M${x - 40} ${R(y + 8 - 70 * o)}h56`, 1, our ? C.white : C.ink, 5, false, 'opacity=".5"');
        c += `<g filter="url(#ds)"><rect x="${x - 78}" y="${R(y - 60 + 52 * o)}" width="156" height="120" rx="8" fill="${C.b2}"/><rect x="${x}" y="${R(y - 60 + 52 * o)}" width="78" height="120" fill="#000" opacity=".18"/><rect x="${x - 78}" y="${R(y - 60 + 52 * o)}" width="156" height="120" rx="8" fill="none" stroke="${C.ivory}" stroke-width="4"/><rect x="${x - 34}" y="${R(y - 30 + 52 * o)}" width="68" height="26" rx="4" fill="${our ? C.red : C.ivory}"/><path d="M${x - 22} ${R(y + 24 + 52 * o)}h44" stroke="${C.ivory}" stroke-width="7" stroke-linecap="round"/></g>`;
      }
      if (t >= q.sud + .04) hitAt(q.sud + .04);
      c += ico('g', 'gavel', 310, -330, 250, { c: C.ivory, sh: 1, r: lerp(-50, 8, gk * gk), s: sp(t, q.v98, .5) }) + (t > q.sud + .04 && t < q.sud + .6 ? `<circle cx="250" cy="-270" r="${R(40 + (t - q.sud) * 600)}" fill="none" stroke="${C.ivory}" stroke-width="${R(10 * (1 - (t - q.sud) / .6))}"/>` : '');
      c += tx(L.court, -230, -330, { f: 'O', w: 700, s: 46, c: C.ivory, ls: 8, op: clamp((t - q.sud + .2) * 3) });
      if (mk > 0) ov += hl(`${n.toLocaleString('en-US').replace(/,/g, ' ')} ${L.docs}`, 0, VERT ? 420 : 400, t, q.chet - .1, C.gold, { s: 46 });
      cue(q.sud + .04, 'thud', 1); cue(q.raskr - .2, 'scuttle', .7); cue(q.chet - .1, 'swish', .6); if (mk > 0 && mk < 1) cue(Math.floor(t * 9) / 9, 'tick', .3);
    }
    return s + sq(c, t, cam(t, [[0, 1, 0, 0], [q.arhiv - .25, 1.35, 150, 160], [q.v98 - .2, 1.08, 0, -20], [q.chet - .25, 1.25, 0, 50]])) + sq(ov, t)
  }
  // 5. Карта в белой рамке: архив → Стэнфорд, [ПО СОСЕДСТВУ] → чертёжный стол: папка 1973, линия чертит флешку, она входит в ноутбук
  function s5(t) {
    const q = Q, B = t >= q.pozzhe - .15;
    let s, c = '', ov = '';
    if (!B) {
      s = back(t, '');
      const en = sp(t, Q.s5 - .05, .8), arc = E(t, q.sosed - .2, .9), d2 = sp(t, q.stan - .2, .5), d1 = sp(t, Q.s5 + .5, .5), id = uid();
      const MP = window.V145MAP, [ux, uy] = MP.at.ucsf, [sx2, sy2] = MP.at.stanford, mx = (ux + sx2) / 2 + 170, my = (uy + sy2) / 2 - 80;
      let gr = ''; for (let x = -300; x <= 300; x += 60) gr += `M${x} -360V300`; for (let y = -360; y <= 300; y += 60) gr += `M-300 ${y}H300`;
      let m = `<g filter="url(#ds)"><rect x="-330" y="-390" width="660" height="780" rx="10" fill="${C.paper}"/></g><clipPath id="${id}"><rect x="-300" y="-360" width="600" height="660"/></clipPath><g clip-path="url(#${id})"><rect x="-300" y="-360" width="600" height="660" fill="${C.b1}"/>` +
        `<path d="${gr}" stroke="${C.ivory}" stroke-width="1.5" opacity=".16"/><path d="${MP.land}" fill="${C.teal2}"/><path d="${MP.land}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/></g>` +
        `<rect x="-300" y="-360" width="600" height="660" fill="none" stroke="${C.ink}" stroke-width="5"/>` + tx(L.bay, 0, 356, { f: 'O', w: 700, s: 34, c: C.ink, ls: 10 }) +
        tx('37.8° N', -288, -334, { f: MONO, w: 700, s: 18, c: C.ivory, a: 'start', op: .7 }) + tx('122.2° W', 288, 290, { f: MONO, w: 700, s: 18, c: C.ivory, a: 'end', op: .7 });
      m += draw(`M${ux} ${uy}Q${R(mx)} ${R(my)} ${sx2} ${sy2}`, arc, C.red, 7, true, 'stroke-dasharray=".03 .03"');
      m += g(`<circle r="${R(24 + 18 * Math.sin(t * 6))}" fill="${C.red}" opacity=".35"/><circle r="15" fill="${C.red}"/><circle r="15" fill="none" stroke="${C.white}" stroke-width="4"/>`, `translate(${ux} ${uy}) scale(${R(d1 * 100) / 100})`) + tx(L.ucsf, ux + 24, uy - 30, { f: 'O', w: 700, s: 32, c: C.white, a: 'start', ls: 3, op: d1, st: C.ink, sw: 8 });
      m += g(`<circle r="${R(24 + 18 * Math.sin(t * 6 + 2))}" fill="${C.gold}" opacity=".4"/><circle r="15" fill="${C.gold}"/><circle r="15" fill="none" stroke="${C.ink}" stroke-width="4"/>`, `translate(${sx2} ${sy2}) scale(${R(d2 * 100) / 100})`) + tx(L.stanford, sx2 + 24, sy2 + 50, { f: 'O', w: 700, s: 32, c: C.white, a: 'start', ls: 3, op: d2, st: C.ink, sw: 8 });
      c += g(m, `translate(0 ${R(lerp(1400, -20, en))}) rotate(${R(lerp(10, -3, en))}) scale(.98)`); ov += hl(L.near, 0, VERT ? 430 : 405, t, q.sosed + .5, C.red);
      cue(Q.s5 - .05, 'swish', .7); cue(q.sosed - .2, 'whip', .5); cue(q.stan - .2, 'ding', .6); cue(q.sosed + .5, 'swish', .6);
    } else {
      s = back(t, '', { c0: '#0a1f1c', c1: '#14423a' });
      const u = t - q.pozzhe, dk = E(t, q.elek - .3, 1.1), plug = E(t, q.flesh - .1, .7, 'io'), al = E(t, q.ozh - .2, .6);
      const ST = 'M-170 -40H150V40H-170ZM150 -24H206V24H150ZM-120 -40V40';
      ov += tx(L.stanfordU, 0, -390, { f: 'O', w: 700, s: 44, c: C.ivory, ls: 10, op: clamp(u * 3) }) + draw('M-330 -360H330', clamp(u * 2), C.ivory, 3, false, 'opacity=".4"');
      let m = ico('f', 'open-file-folder', -330, 90, VERT ? 420 : 540, { s: sp(t, q.pozzhe - .05, .7), r: -6 }) + tx(L.project, -330, VERT ? 300 : 360, { f: 'O', w: 700, s: 32, c: C.ivory, ls: 5, op: clamp(u * 2 - .6) }) + crystal(-330, 50, .42 * sp(t, q.pozzhe + .3, .6));
      m += draw('M-230 20C-150 -120 -60 -180 10 -150', dk * 2, C.gold, 4, true, 'stroke-dasharray=".02 .02"');
      const sx = lerp(40, VERT ? 120 : 150, plug), sy = lerp(-170, VERT ? 96 : 120, plug);
      m += ico('f', 'laptop', VERT ? 340 : 400, 110, VERT ? 400 : 540, { s: sp(t, q.flesh - .7, .6) });
      m += g(`<path d="M-170 -40H150V40H-170Z" fill="${C.b0}" opacity="${R(.85 * clamp(dk * 2 - 1))}"/>` + draw(ST, dk, C.teal, 5, true) + `<circle cx="-146" cy="0" r="9" fill="${plug > .95 && Math.sin(t * 12) > 0 ? '#7CFF8A' : C.teal}" opacity="${R(clamp(dk * 2 - 1))}"/>` + crystal(20, 0, .2 * al) + (al > 0 ? `<circle cx="20" cy="0" r="${R(30 + ((t * 1.1) % 1) * 70)}" fill="none" stroke="${C.gold}" stroke-width="3" opacity="${R(al * (1 - (t * 1.1) % 1))}"/>` : ''), `translate(${R(sx)} ${R(sy)}) scale(.9)`);
      m += tx(L.juul, lerp(40, 60, plug), lerp(-220, -30, plug), { f: 'O', w: 700, s: 34, c: C.teal, ls: 5, op: clamp(dk * 3 - 2) });
      c += g(m, VERT ? 'translate(-20 0) scale(.92)' : 'translate(0 -10) scale(1.02)'); ov += hl(L.usb, 0, VERT ? 420 : 400, t, q.flesh, C.gold, { s: 46 });
      cue(q.pozzhe - .05, 'swish', .5); cue(q.elek - .3, 'quill', .6); cue(q.flesh + .55, 'tick', .9); cue(q.flesh, 'swish', .5); cue(q.ozh - .2, 'ding', .7);
    }
    return s + sq(c, t, cam(t, [[0, 1, 0, 0], [q.stan - .3, 1.3, 0, -40], [q.pozzhe - .25, 1, 0, 0], [q.flesh - .35, 1.3, 160, 70]])) + sq(ov, t)
  }
  // 6. Шеренга: 1 картридж против 20 сигарет → мозг, кольцо затяжек раскручивается, [БЕЗ ОСТАНОВКИ]
  function s6(t) {
    const q = Q, B = E(t, q.shkol - .3, .7, 'io'), lit = 20 * P01(t, q.pachku - .5, 1.3);
    let s = back(t, ''), c = '', ov = '';
    const POD = 'M-70 -130H70L84 -116V150L70 164H-70L-84 150V-116Z', px = lerp(-300, -620, B);
    c += g(`<g filter="url(#ds)"><path d="M-46 -130L-36 -196H36L46 -130Z" fill="${C.ink}"/><path d="${POD}" fill="${C.ivory}"/><path d="M0 -130H70L84 -116V150L70 164H0Z" fill="#000" opacity=".14"/><rect x="-50" y="-70" width="100" height="170" rx="12" fill="${C.gold}"/><rect x="0" y="-70" width="50" height="170" fill="${C.gold2}"/></g><path d="${POD}" fill="none" stroke="${C.ink}" stroke-width="5"/>` + draw('M-66 -110V140', 1, '#fff', 5, false, 'opacity=".6"') + crystal(0, 20, .22), `translate(${R(px)} ${R(20 + Math.sin(t * 1.7) * 8)}) scale(${R(sp(t, Q.s6 - .1, .7) * 1.6 * 100) / 100})`, 1 - B);
    c += tx('=', -150, 50, { f: 'U', w: 800, s: 120, c: C.ivory, op: clamp((t - q.zam + .1) * 4) * (1 - B) });
    for (let i = 0; i < 20; i++) {
      const r = Math.floor(i / 10), k = i % 10, x = -20 + k * (VERT ? 50 : 58), y = -190 + r * 330, on = lit > i, pp = sp(t, q.zam - .2 + i * .03, .4); if (pp <= 0) continue;
      c += g(`<g${on ? ' filter="url(#ds)"' : ''} opacity="${on ? 1 : .35}"><rect x="-13" y="-90" width="26" height="130" rx="4" fill="${C.paper}"/><rect x="0" y="-90" width="13" height="130" fill="#000" opacity=".12"/><rect x="-13" y="40" width="26" height="50" rx="4" fill="${C.gold}"/><rect x="0" y="40" width="13" height="50" fill="${C.gold2}"/></g>` + (on ? `<circle cx="0" cy="-92" r="${R(9 + 3 * Math.sin(t * 9 + i))}" fill="${C.red}" filter="url(#gl)"/>` : ''), `translate(${R(x + 620 * B)} ${R(y + 40 * (1 - pp))}) scale(${VERT ? 1.15 : 1.35})`, pp * (1 - B));
      if (on) cue(q.pachku - .5 + i * 1.3 / 20, 'tick', .35, (k - 5) / 8);
    }
    ov += B < .5 ? hl(L.eq, 0, -400, t, q.pachku + .2, C.red, { s: 46 }) : '';
    if (B > 0) {
      const u = P01(t, q.shkol - .2, Math.max(1.5, q.bystr - q.shkol + .6)), ang = u * u * 1500, hot = t > q.bystr - .2, col = hot ? C.red : C.teal;
      const RR = 340, tk = Math.floor(ang / 22.5) % 16;
      c += g(g(brainArt(t, spring(B) * 1.45, hot ? 1 : u), 'translate(-12 82)') + `<circle cx="0" cy="20" r="${RR}" fill="none" stroke="${C.ink}" stroke-width="24" opacity=".6"/><circle cx="0" cy="20" r="${RR}" fill="none" stroke="${C.ivory}" stroke-width="4" opacity=".3"/>` +
        `<circle cx="0" cy="20" r="${RR}" fill="none" stroke="${col}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${R(160 + 1300 * u)} 2400" transform="rotate(${R(ang)} 0 20)" filter="url(#gl2)"/>` +
        [...Array(16)].map((_, i) => `<circle cx="${R(Math.cos(i * Math.PI / 8) * RR)}" cy="${R(20 + Math.sin(i * Math.PI / 8) * RR)}" r="${tk === i ? 18 : 9}" fill="${tk === i ? col : C.ivory}" stroke="${C.ink}" stroke-width="3"/>`).join(''), '', B);
      ov += hl(L.nonstop, 0, VERT ? 420 : 400, t, q.bez - .05, C.red);
      cue(q.shkol - .3, 'whoosh', .5); cue(q.bez - .05, 'swish', .7); cue(q.bystr - .2, 'impact', .4);
    }
    cue(Q.s6 - .1, 'swish', .5); cue(q.pachku + .2, 'swish', .7);
    return s + sq(c, t, cam(t, [[0, 1, 0, 0], [q.pachku - .2, 1.3, 200, 0], [q.shkol - .35, 1, 0, 0], [q.bez, 1.18, 0, 20]])) + sq(ov, t)
  }
  // 7. Четыре силуэта: каждый четвёртый загорается → сделка: сектор 35 %, пачка с шевроном, [$13 000 000 000]
  const PIC = 'M-78 170V-10C-78 -60 -44 -84 0 -84C44 -84 78 -60 78 -10V170Z';
  function s7(t) {
    const q = Q, B = E(t, q.tret - .3, .7, 'io');
    let s = back(t, B > .5 ? '' : '2019', { yo: .06 }) + (B > 0 ? sq(g(wmark('western-hat', -330, -230, 320, t) + wmark('cash', 340, 250, 300, t, 2), '', B), t) : ''), c = '', ov = '';
    if (B < 1) {
      const hot = P01(t, q.chetv - .1, .5);
      for (let i = 0; i < 4; i++) {
        const x = -345 + i * 230, pp = sp(t, Q.s7 + i * .12, .6), h = i === 3 ? hot : 0, col = h > .5 ? C.gold : C.b2;
        c += g((h > 0 ? puffs(40, -170, t, h, 4) : '') + `<g filter="url(#${h > .5 ? 'gl' : 'ds'})"><circle cx="0" cy="-150" r="54" fill="${col}"/><path d="${PIC}" fill="${col}"/></g><path d="M0 -84C44 -84 78 -60 78 -10V170H0Z" fill="#000" opacity=".2"/><path d="M0 -204A54 54 0 0 1 0 -96Z" fill="#000" opacity=".2"/>` + `<circle cx="0" cy="-150" r="54" fill="none" stroke="${C.ivory}" stroke-width="4" opacity=".7"/><path d="${PIC}" fill="none" stroke="${C.ivory}" stroke-width="4" opacity=".7"/>` + (h > .5 ? `<circle cx="30" cy="10" r="${R(8 + 4 * Math.sin(t * 8))}" fill="${C.red}" filter="url(#gl)"/>` : ''), `translate(${R(x - 900 * B)} ${R(40 + 300 * (1 - pp))}) scale(${R(1.25 + .14 * h)})`, pp);
      }
      ov += tx(L.usa, 0, -380, { f: 'O', w: 700, s: 44, c: C.ivory, ls: 10, op: clamp((t - Q.s7) * 3) * (1 - B) }) + (B < .5 ? hl(L.every4, 0, VERT ? 410 : 390, t, q.chetv + .1, C.red, { s: 46 }) : '');
      cue(Q.s7, 'swish', .5); cue(q.chetv - .1, 'puff', .8); cue(q.chetv + .1, 'swish', .7);
    }
    if (B > 0) {
      const R0 = 240, a0 = -90, a1 = 36, rad = d => d * Math.PI / 180, mid = rad((a0 + a1) / 2), sl = E(t, q.tret + .1, .6), pk = sp(t, q.malb - 1.2, .8), mn = P01(t, q.trin - .15, 1.4), cx = VERT ? 0 : -170, cy = VERT ? -40 : -10;
      const sec = `M0 0L${R(R0 * Math.cos(rad(a0)))} ${R(R0 * Math.sin(rad(a0)))}A${R0} ${R0} 0 0 1 ${R(R0 * Math.cos(rad(a1)))} ${R(R0 * Math.sin(rad(a1)))}Z`;
      c += g(`<g filter="url(#ds)"><circle r="${R0}" fill="${C.ivory}"/></g><path d="M0 -${R0}A${R0} ${R0} 0 0 1 0 ${R0}Z" fill="#000" opacity=".12"/><circle r="${R0}" fill="none" stroke="${C.ink}" stroke-width="5"/>` + g(`<path d="M-90 -20H70V20H-90ZM70 -12H100V12H70Z" fill="${C.b1}"/>`, 'translate(-70 70) rotate(-20)') +
        g(`<g filter="url(#ds)"><path d="${sec}" fill="${C.red}"/></g><path d="${sec}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>` + tx('35 %', 120 * Math.cos(mid), 120 * Math.sin(mid) + 20, { f: 'U', w: 800, s: 50, c: C.white }), `translate(${R(70 * sl * Math.cos(mid))} ${R(70 * sl * Math.sin(mid))})`), `translate(${R(cx + 900 * (1 - B))} ${cy})`);
      // пачка с красным шевроном падает на сектор
      c += g(`<g filter="url(#ds)"><rect x="-95" y="-140" width="190" height="290" rx="10" fill="${C.white}"/><path d="M-95 -140H95V-10L0 -84L-95 -10Z" fill="#D8232A"/><rect x="0" y="-140" width="95" height="290" fill="#000" opacity=".1"/></g><rect x="-95" y="-140" width="190" height="290" rx="10" fill="none" stroke="${C.ink}" stroke-width="5"/>`, `translate(${R(VERT ? cx - 300 : cx - 430)} ${R(lerp(-900, VERT ? cy - 330 : cy + 20, pk))}) rotate(${R(lerp(-20, -7, pk))})`);
      c += coins(VERT ? 330 : 560, VERT ? 330 : 230, sp(t, q.trin - .1, .6)); ov += hl(L.pct35, VERT ? 0 : 470, VERT ? 300 : -70, t, q.tret + .2, C.red, { s: 44 }) + hl(L.deal, VERT ? 0 : 470, VERT ? 390 : 50, t, q.trin - .1, C.gold, { s: 44 });
      cue(q.tret - .3, 'whoosh', .5); cue(q.tret + .1, 'thud', .5); cue(q.trin - .1, 'coins', .9); cue(q.malb - 1.2, 'swish', .5); cue(q.malb - .75, 'thud', .7);
    }
    return s + sq(c, t, cam(t, [[0, 1, 0, 0], [q.chetv - .2, 1.35, 345, 0], [q.tret - .35, 1, 0, 0]])) + sq(ov, t)
  }
  // 8. [ПЛАН ВЫПОЛНЕН] поверх отчёта → темнота: только светодиод одноразки и струйка пара
  function s8(t) {
    const q = Q, st = q.ideal + .1, dk = E(t, q.prizn - .35, 1.1), led = E(t, q.zat - .3, 1.2);
    let c = g(memo(t, { a: -9, tl: -9, hl: -9 }) + stampHit(L.done, 0, 215, t, st, -8, C.red, 70), `translate(0 ${R(lerp(1400, 0, sp(t, Q.s8 - .1, .8)))}) rotate(-3) scale(1.05)`);
    let s = back(t, '1973') + sq(c, t, cam(t, [[0, 1, 0, 0], [q.ideal - .15, 1.3, 0, 200]]));
    if (dk > 0) s += `<rect x="-600" y="-600" width="${WW + 1200}" height="${HH + 1200}" fill="#03040c" opacity="${R(dk * .97)}"/>` + sq(g(puffs(0, -330, t, led * .8, 4) + g(vape(t, 0, .15 + 1.6 * led, .5 + .5 * led, C.red), 'scale(1.3)') + (led > 0 ? `<circle cx="0" cy="240" r="${R(60 + 240 * led)}" fill="${C.red}" opacity="${R(.25 * led)}" filter="url(#bl)"/>` : ''), '', dk), t, cam(t, [[0, 1, 0, 0], [q.zat - .6, 1.5, 0, 190]]));
    cue(Q.s8 - .1, 'swish', .5); cue(st, 'stamp', 1); cue(st, 'impact', .5); cue(q.prizn - .3, 'dive', .5); cue(q.zatE + .05, 'vape', 1); cue(q.zatE + .05, 'impact', .5);
    return s
  }
  // 9 (v14.5): доска расследования — пачка с красной полосой, колба с химикатами, красные нити; внизу плашка [ПОЛНЫЙ ФИЛЬМ НА YOUTUBE — ССЫЛКА В ПРОФИЛЕ]
  function s9(t) {
    const q = Q, a0 = q.s9 - .1;
    let s = back(t, ''), c = '', ov = '', sp2 = '';
    c += `<g filter="url(#ds)"><rect x="-490" y="-350" width="980" height="640" rx="16" fill="#3d2c1f"/></g>`;
    for (let i = 0; i < 180; i++) sp2 += `M${R(-480 + rnd(i * 3.1) * 960)} ${R(-340 + rnd(i * 7.7) * 620)}h4v4h-4Z`;
    c += `<path d="${sp2}" fill="#2a1e15" opacity=".9"/><rect x="-490" y="-350" width="980" height="640" rx="16" fill="none" stroke="${C.ink}" stroke-width="7"/>`;
    const card = (x, y, r, k, a, b) => k <= 0 ? '' : g(`<g filter="url(#ds)"><rect x="-130" y="-82" width="260" height="164" fill="${C.paper}"/></g><rect x="0" y="-82" width="130" height="164" fill="#000" opacity=".06"/><rect x="-130" y="-82" width="260" height="164" fill="none" stroke="${C.ink}" stroke-width="4"/>` +
      tx(a, 0, -16, { f: MONO, w: 700, s: 26, c: C.ink }) + tx(b, 0, 40, { f: 'U', w: 800, s: 34, c: C.red2 }), `translate(${x} ${y}) rotate(${r}) scale(${R(k * 100) / 100})`);
    const P1 = [-330, -230], P2 = [330, -235], PK = [-170, 50], PF = [200, 40];
    c += card(P1[0], P1[1] + 50, -6, sp(t, a0 + .25, .5), L.s9pin[0], L.s9pin[1]) + card(P2[0], P2[1] + 52, 5, sp(t, a0 + .45, .5), L.s9pin[2], L.s9pin[3]);
    const pk = sp(t, Math.min(q.malb9 - .25, a0 + .7), .6), fk = sp(t, Math.min(q.prop - .3, a0 + 1.1), .6);
    if (pk > 0) c += g(packSvg(), `translate(${PK[0]} ${PK[1]}) rotate(-7) scale(${R(1.05 * pk * 100) / 100})`) + tx(L.s9pack, PK[0], PK[1] + 200, { f: MONO, w: 700, s: 22, c: C.ivory, op: pk });
    if (fk > 0) c += g(flaskSvg(t, fk), `translate(${PF[0]} ${PF[1] + 60}) rotate(6) scale(${R(.62 * fk * 100) / 100})`);
    const thr = (A, B2, k) => { if (k <= 0) return ''; const mx = (A[0] + B2[0]) / 2, my = Math.max(A[1], B2[1]) + 60; return draw(`M${A[0]} ${A[1]}Q${R(mx)} ${R(my)} ${B2[0]} ${B2[1]}`, k, C.red, 6, true) };
    const tk = E(t, a0 + .8, 1.2), PKp = [PK[0], PK[1] - 150], PFp = [PF[0], PF[1] - 150], Q1 = [P1[0] + 96, P1[1] + 160], Q2 = [P2[0] - 96, P2[1] + 160];
    c += thr(Q1, PKp, tk) + thr(Q2, PFp, tk - .2) + thr(PKp, PFp, tk - .4);
    for (const [x, y] of [Q1, Q2, PKp, PFp]) c += `<circle cx="${x}" cy="${y}" r="13" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/><circle cx="${x - 4}" cy="${y - 4}" r="4" fill="#fff" opacity=".6"/>`;
    if (VERT) ov += hl(L.yt9a, 0, 380, t, q.smotr - .1, C.gold, { s: 44 }) + hl(L.yt9b, 0, 466, t, q.smotr + .15, C.red, { s: 40 });
    else ov += hl(L.yt9, 0, 410, t, q.smotr - .1, C.gold, { s: 42 });
    cue(a0 + .25, 'pin', .5); cue(a0 + .45, 'pin', .5); cue(Math.min(q.malb9 - .25, a0 + .7), 'swish', .5); cue(Math.min(q.prop - .3, a0 + 1.1), 'bubble', .6); cue(q.smotr - .1, 'swish', .7);
    return s + sq(c, t, cam(t, [[0, 1.15, 0, -20], [q.prop - .2, 1.34, 150, 20], [q.smotr - .3, 1.08, 0, -40]])) + sq(ov, t)
  }

  // ---------- лента сцен: пролёт камерой насквозь между сценами ----------
  function frame(t) {
    let i = 0; while (i < BE.length - 1 && t >= BE[i + 1].a) i++;
    const b = BE[i], nx = BE[i + 1]; let s;
    if (nx && nx.f !== s9 && t > nx.a - .3) { const z = expoIn((t - (nx.a - .3)) / .3); s = g(b.f(t), about(SX(b.fx), SY(b.fy), 1 + 30 * z)) + `<rect width="${WW}" height="${HH}" fill="${b.col}" opacity="${R(clamp(z * 2.2))}"/>`; cue(nx.a - .3, 'whoosh', .6) }
    else if (i && b.f !== s9 && t < b.a + .5) { const k = (t - b.a) / .5; s = `<rect width="${WW}" height="${HH}" fill="${BE[i - 1].col}"/><clipPath id="zc"><circle cx="${QX}" cy="${QY}" r="${R(1600 * expoIn(k * .6 + .4))}"/></clipPath><g clip-path="url(#zc)">${g(b.f(t), about(QX, QY, lerp(1.45, 1, spring(k))))}</g>` }
    else s = b.f(t);
    if (b.f === s9 && i && t < b.a + .45) { s = glitch(s, t - b.a, t); cue(b.a, 'zap', .9) }
    let dx = 0, dy = 0; for (const h of SHK) if (t >= h && t < h + .2) { dx = (rnd(Math.floor(t * 60)) - .5) * 26; dy = (rnd(Math.floor(t * 60) + 7) - .5) * 26 }
    return g(s, `translate(${R(dx)} ${R(dy)})`) + top(t)
  }
  window.EP = {
    P, D, clean: true, lead: .1, tr: {}, trDef: 'cut', defs, size: [WW, HH],
    cap: VERT ? { size: 52, top: 1250, font: 'U', hi: C.gold, st: C.ink } : { size: 44, top: 890, font: 'U', hi: C.gold, st: C.ink },
    init(tl, SC) {
      const T = {}; SC.forEach(S => { T[S.key] = S.T; D[S.key] = frame });
      document.getElementById('cap').style.textTransform = 'uppercase';
      if (T.s9 && !T.s1) { EP.noCap = true; BE = [{ a: 0, f: s9, fx: 0, fy: 0, col: C.b0 }]; return }
      const c = (k, w, n = 0) => T[k].c(w, n);
      Q = { s1: 0, manT: T.s1.s(0) + 1.6, mango: c('s1', 'манго'), myata: c('s1', 'мяты'), vnutri: c('s1', 'внутри'), p50: c('s1', 'пятьдесят'),
        s2: T.s2.s(0), y73: T.s2.s(0) + .5, tab: c('s2', 'Табачная'), camel: c('s2', 'Camel'), cel: T.s2.s(1), poluch: c('s2', 'получить'), mol: c('s2', 'молодёжного'), rynok: c('s2', 'рынка'),
        s3: T.s3.s(0), dym: c('s3', 'дым'), deret: c('s3', 'дерёт'), togda: T.s3.s(1), nik: c('s3', 'никотин'), kis: c('s3', 'кислотой'), sol: c('s3', 'соль'), myagko: c('s3', 'мягко'), doze: c('s3', 'дозе'),
        s4: T.s4.s(0), form: c('s4', 'формулу'), arhiv: c('s4', 'архив'), dvad: c('s4', 'двадцать'), v98: T.s4.s(1), sud: c('s4', 'суд'), raskr: c('s4', 'раскрыть'), chet: c('s4', 'четырнадцать'),
        s5: T.s5.s(0), sosed: c('s5', 'соседству'), stan: c('s5', 'Стэнфордским'), pozzhe: T.s5.s(1), elek: c('s5', 'электронную'), flesh: c('s5', 'флешку'), ozh: c('s5', 'оживает'),
        s6: T.s6.s(0), zam: c('s6', 'заменял'), pachku: c('s6', 'пачку'), shkol: c('s6', 'школьники'), bez: c('s6', 'без'), bystr: c('s6', 'быстрее'),
        s7: T.s7.s(0), chetv: c('s7', 'четвёртый'), tret: c('s7', 'треть'), trin: c('s7', 'тринадцать'), malb: T.s7.se(0),
        s8: T.s8.s(0), ideal: c('s8', 'идеально'), prizn: T.s8.s(1), zat: c('s8', 'затянуться'), zatE: T.s8.se(1) };
      BE = [ { a: 0, f: s1, fx: 0, fy: 0, col: C.gold }, { a: Q.s2 - .1, f: s2, fx: 70, fy: -170, col: C.red }, { a: Q.s3 - .1, f: s3, fx: -30, fy: -200, col: C.paper },
        { a: Q.s4 - .1, f: s4, fx: 0, fy: 60, col: C.red }, { a: Q.s5 - .1, f: s5, fx: 110, fy: 90, col: C.teal }, { a: Q.s6 - .1, f: s6, fx: 0, fy: 20, col: C.red },
        { a: Q.s7 - .1, f: s7, fx: 80, fy: -140, col: '#D8232A' }, { a: Q.s8 - .1, f: s8, fx: 0, fy: 0, col: C.b0 } ];
      if (T.s9) { Object.assign(Q, { s9: T.s9.s(0), malb9: c('s9', 'мальборо'), prop: c('s9', 'пропитывают'), smotr: c('s9', 'смотрите') }); BE.push({ a: Q.s9 - .1, f: s9, fx: 0, fy: 0, col: C.b0 }) }
    }
  };
})();
