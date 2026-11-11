// v15 — «Что вы знаете об одноразках?» на canvas (ТЗ Андрея и Gemini 10.11 «кинематографичный апгрейд»).
// Полноэкранные сцены вместо значков в пустоте: конусы света (screen), глубина — размытые слои и боке, дым и пыль в луче,
// 40+ планов по 2–2,5 с с переходами (расфокус, наезд, вспышка, глитч), HUD расследования сверху.
// Всё время — от слов диктора (сейчас черновой тайминг tl_draft.py, голоса нет). Готовых значков нет — всё рисуется кодом.
// Карта — точки суши Natural Earth (ep/v15-map.js, собирает v15_map.py). Все надписи — в словаре LS (перевод = новый словарь + звук).
(function () {
  'use strict';
  const LS = {
    ru: {
      ep: 'ЭПИЗОД',
      type: ['ТИП', 'ОДНОРАЗОВЫЙ ВЕЙП'], flavor: ['АРОМАТИЗАТОР', 'MANGO / MINT'], mix: ['СМЕСЬ', 'NICOTINE SALT'],
      xr: ['КАТУШКА', 'ЖИДКОСТЬ', 'ПЛАТА', 'АККУМУЛЯТОР'], liquid: ['ЖИДКОСТЬ', 'НИКОТИНОВАЯ СОЛЬ'], origin: ['ПРОИСХОЖДЕНИЕ', 'ТАБАЧНАЯ ПРОМЫШЛЕННОСТЬ'],
      rewind: 'ОТМАТЫВАЕМ НАЗАД', camel: 'CAMEL', winston: 'WINSTON', rjr: ['ШТАБ-КВАРТИРА', 'R.J. REYNOLDS'], brand: 'МАРКА',
      memo: { co: 'R.J. REYNOLDS TOBACCO COMPANY', title: 'RESEARCH PLANNING MEMORANDUM', date: 'DATE: FEBRUARY 2, 1973',
        subj: ['SUBJECT: SOME THOUGHTS ABOUT NEW BRANDS', 'OF CIGARETTES FOR THE YOUTH MARKET'], l1: 'КОМПАНИЯ ДОЛЖНА', l2: 'ПОЛУЧИТЬ СВОЮ ДОЛЮ МОЛОДЁЖНОГО РЫНКА', stamp: 'СЕКРЕТНО' },
      smoke: ['ТАБАЧНЫЙ ДЫМ', '7000+ ВЕЩЕСТВ'], cough: 'КАШЕЛЬ', warn: 'ВНИМАНИЕ', irr: 'РАЗДРАЖЕНИЕ ГОРЛА',
      mixA: ['РЕАКЦИЯ', 'НИКОТИН + КИСЛОТА'], salt: ['РЕЗУЛЬТАТ', 'НИКОТИНОВАЯ СОЛЬ'], ph: ['КИСЛОТНОСТЬ · pH', 'КИСЛАЯ СРЕДА', 'ЩЕЛОЧНАЯ СРЕДА', 'РЕЗКО', 'МЯГКО'],
      dose: ['ДОЗА НИКОТИНА', 'УБОЙНАЯ'], breath: ['ВДОХ', 'МЯГКИЙ ✓'], project: 'ПРОЕКТ · 1973', archive: 'В АРХИВ · 25 ЛЕТ', docs: 'СЕКРЕТНЫХ ДОКУМЕНТОВ',
      calm: ['ВДОХ', 'РАЗДРАЖЕНИЯ НЕТ'], map: ['КАЛИФОРНИЯ', 'ТИХИЙ ОКЕАН'], ucsf: ['UCSF ARCHIVE', 'SAN FRANCISCO', '37.76° N · 122.46° W'], stan: ['STANFORD UNIVERSITY', 'PALO ALTO', '37.43° N · 122.17° W'], near: 'ПО СОСЕДСТВУ',
      lib: 'TOBACCO DOCUMENTS LIBRARY · UCSF', query: 'nicotine salt 1973', search: 'ПОИСК', hit: 'RESEARCH PLANNING MEMORANDUM · RJR · 1973', found: 'НАЙДЕНО',
      cad: ['ПРОЕКТ', 'JUUL · 2015'], usbc: ['ФОРМА', 'КАК ФЛЕШКА'], inside: ['ВНУТРИ', 'СОЛЬ ОБРАЗЦА 1973'], eq: '1 КАРТРИДЖ = 20 СИГАРЕТ',
      puffs: ['ЗАТЯЖКИ', 'РЕЖИМ', 'БЕЗ ОСТАНОВКИ'], addict: ['ЗАВИСИМОСТЬ', 'КРИТИЧЕСКАЯ'], teen: ['27,5 %', 'СТАРШЕКЛАССНИКОВ США', 'ПАРЯТ · 2019'],
      deal: 'СДЕЛКА · 20.12.2018', share: ['ДОЛЯ В JUUL', 'ПОКУПАТЕЛЬ — ПРОИЗВОДИТЕЛЬ «МАЛЬБОРО»'],
      done: 'ПЛАН ВЫПОЛНЕН', paid: 'ОПЛАТА ПРИНЯТА', dan: 'ДАНЬ ПРИНЯТА', s9pack: 'ГЛАВНЫЙ ПОДОЗРЕВАЕМЫЙ',
      s9: ['1. МИФ О МАЛЬБОРО', '2. СЕКРЕТНАЯ ПРОПИТКА', '3. ЛОВУШКА ПОД ГУБУ'], yt: ['ПОЛНЫЙ ФИЛЬМ НА YOUTUBE', 'ССЫЛКА В ПРОФИЛЕ'],
      dossier: ['ДОСЬЕ № 1', 'АВТОР: К. Э. ТИГ', 'R.J. REYNOLDS · ИССЛЕДОВАНИЯ', '02.02.1973'],
    },
  };
  const L = LS[window.V15LANG || 'ru'];
  const WW = 1920, HH = 1080, TAU = Math.PI * 2;
  const C = { ink: '#03050a', night: '#060a13', navy: '#0b1324', steel: '#18202d', cold: '#cfe9ff', ice: '#8fd6ff', teal: '#3fd3c6', amber: '#ffb54a',
    gold: '#e7b15c', red: '#ff3d3d', red2: '#a8121b', crimson: '#3a070c', paper: '#ece2c6', paper2: '#cdbf9b', inkT: '#23201b', green: '#47e38a', white: '#ffffff' };
  P = { bg: C.ink, paper: C.paper, ink: C.ink, line: C.paper, a1: C.gold, a2: C.red };
  const D = {};
  let cv = null, X = null, A = null, B = null, SH = [], CHS = [], HITS = [], Q = {};

  // ================= утилиты =================
  const cl = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, lp = (a, b, k) => a + (b - a) * k;
  const ss = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k) };
  const eo = k => 1 - Math.pow(1 - cl(k), 3), ei = k => Math.pow(cl(k), 3), eio = k => { k = cl(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 };
  const spr = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-6.5 * k) * Math.cos(11 * k);
  const H1 = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) };
  const H2 = (i, j) => H1(i * 57.31 + j * 131.71);
  const n1 = x => { const i = Math.floor(x), f = x - i; return lp(H1(i), H1(i + 1), f * f * (3 - 2 * f)) * 2 - 1 };
  function vn(x, y) { const xi = Math.floor(x), yi = Math.floor(y), u = x - xi, v = y - yi, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v); return lp(lp(H2(xi, yi), H2(xi + 1, yi), su), lp(H2(xi, yi + 1), H2(xi + 1, yi + 1), su), sv) }
  function fbm(x, y, o = 4) { let s = 0, a = .5, f = 1; for (let i = 0; i < o; i++) { s += a * vn(x * f, y * f); a *= .5; f *= 2.03 } return s }
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c };
  const CA = new Map();
  const cache = (k, w, h, fn) => { let c = CA.get(k); if (!c) { c = mk(w, h); fn(c.getContext('2d'), c.width, c.height); CA.set(k, c) } return c };
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})` };
  const lg = (c, x0, y0, x1, y1, st) => { const g = c.createLinearGradient(x0, y0, x1, y1); for (const [o, col] of st) g.addColorStop(o, col); return g };
  const rg = (c, x, y, r0, r1, st) => { const g = c.createRadialGradient(x, y, r0, x, y, r1); for (const [o, col] of st) g.addColorStop(o, col); return g };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r) };
  const poly = (c, p) => { c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath() };
  // вид: точка мира (x, y) — в центре кадра, масштаб s, поворот r
  const view = (c, s, x, y, r = 0) => { c.translate(WW / 2, HH / 2); if (r) c.rotate(r); c.scale(s, s); c.translate(-x, -y) };
  const at = (u, k0, k1) => cl((u - k0) / (k1 - k0));

  // ================= текст =================
  function font(c, o) { c.font = `${o.w || 700} ${o.s || 32}px ${o.f || 'U'}`; c.letterSpacing = (o.ls || 0) + 'px' }
  function tx(c, s, x, y, o = {}) {
    if (!s) return; c.save(); font(c, o); c.textAlign = o.al || 'center'; c.textBaseline = o.bl || 'alphabetic'; c.globalAlpha *= o.a ?? 1;
    if (o.glow) { c.shadowColor = o.glow; c.shadowBlur = o.gb || 20 } c.fillStyle = o.c || '#fff'; c.fillText(s, x, y); c.restore()
  }
  function tw(c, s, o = {}) { c.save(); font(c, o); const w = c.measureText(s).width; c.restore(); return w }

  // ================= свет, воздух, глубина =================
  function noiseTex(k, w, h, sc, oct) {
    return cache('nz' + k, w, h, (x, W, H) => { const im = x.createImageData(W, H), d = im.data; for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = fbm(i / sc + 3.3, j / sc + 7.7, oct), p = (j * W + i) * 4; d[p] = d[p + 1] = d[p + 2] = v * 255; d[p + 3] = 255 } x.putImageData(im, 0, 0) })
  }
  function coneSprite(len, spread, col) {
    const half = Math.tan(spread / 2) * len, pad = 70, w = half * 2 + pad * 2, h = len + pad;
    return cache(`cone${len | 0}|${spread.toFixed(3)}|${col}`, w, h, (x) => {
      const t = mk(w, h), y = t.getContext('2d');
      for (let i = 0; i < 7; i++) {
        const k = 1 - i / 7, hh = half * (.3 + .7 * k);
        y.beginPath(); y.moveTo(w / 2 - 5 * k, 0); y.lineTo(w / 2 + 5 * k, 0); y.lineTo(w / 2 + hh, len); y.lineTo(w / 2 - hh, len); y.closePath();
        y.fillStyle = lg(y, 0, 0, 0, len, [[0, rgba(col, .17)], [.3, rgba(col, .08)], [1, rgba(col, 0)]]); y.fill();
      }
      x.filter = 'blur(16px)'; x.drawImage(t, 0, 0);
    });
  }
  // конус света: вершина (x, y), ang — направление (0 — вниз), spread — раствор, len — длина
  function beam(c, x, y, ang, spread, len, col, a = 1) {
    if (a <= 0) return; const s = coneSprite(len, spread, col);
    c.save(); c.translate(x, y); c.rotate(ang); c.globalCompositeOperation = 'screen'; c.globalAlpha *= a; c.drawImage(s, -s.width / 2, 0); c.restore();
  }
  // пылинки в конусе
  function dust(c, t, x, y, ang, spread, len, n, seed = 1, a = 1) {
    c.save(); c.translate(x, y); c.rotate(ang); c.globalCompositeOperation = 'screen'; c.fillStyle = '#fff';
    const tn = Math.tan(spread / 2);
    for (let i = 0; i < n; i++) {
      const d = ((H1(seed + i * 3.17) + t * (.006 + .012 * H1(i * 1.9 + seed))) % 1), al = d * len, w = tn * al;
      const ac = (H1(seed + i * 7.73) * 2 - 1) * w * .85 + Math.sin(t * .6 + i) * 8, r = .9 + H1(i * 1.31 + seed) * 2.4;
      const k = a * (.25 + .75 * H1(i * 9.1 + seed)) * Math.sin(Math.PI * d) * (1 - Math.abs(ac) / (w + 1)) * (.6 + .4 * Math.sin(t * 2 + i));
      if (k <= .01) continue; c.globalAlpha = k; c.fillRect(ac - r / 2, al - r / 2, r, r);
    }
    c.restore();
  }
  function glowDot(c, x, y, r, col, a = 1) {
    if (a <= 0) return; c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha *= cl(a, 0, 4);
    c.fillStyle = rg(c, x, y, 0, r, [[0, rgba(col, 1)], [.22, rgba(col, .45)], [1, rgba(col, 0)]]); c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore();
  }
  function pool(c, x, y, rx, ry, col, a) { c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha *= a; c.translate(x, y); c.scale(1, ry / rx); c.fillStyle = rg(c, 0, 0, 0, rx, [[0, rgba(col, .55)], [.45, rgba(col, .2)], [1, rgba(col, 0)]]); c.fillRect(-rx, -rx, 2 * rx, 2 * rx); c.restore() }
  // пластина боке (кэш): мягкие диски со светлым краем
  function bokeh(key, w, h, n, cols, r0, r1, seed = 1) {
    return cache('bk' + key, w, h, (x) => {
      x.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        const px = H1(seed + i * 3.1) * w, py = H1(seed + i * 7.7) * h, r = lp(r0, r1, H1(seed + i * 1.9) ** 2), col = cols[i % cols.length], a = .05 + .13 * H1(seed + i * 5.3);
        x.fillStyle = rg(x, px, py, 0, r, [[0, rgba(col, a * .65)], [.8, rgba(col, a)], [.92, rgba(col, a * 1.3)], [1, rgba(col, 0)]]);
        x.beginPath(); x.arc(px, py, r, 0, TAU); x.fill();
      }
    });
  }
  let SMK = null;
  function smokeSprites() {
    if (SMK) return SMK; SMK = []; const S = 160;
    for (let v = 0; v < 4; v++) {
      const c = mk(S, S), x = c.getContext('2d'), im = x.createImageData(S, S), d = im.data;
      for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
        const dx = (i - S / 2) / (S / 2), dy = (j - S / 2) / (S / 2), r = Math.sqrt(dx * dx + dy * dy), m = Math.max(0, 1 - r);
        const n = fbm(i / 34 + v * 11.3, j / 34 + v * 7.1, 4), a = cl(Math.pow(m, 1.5) * (n * 2 - .5)) * 255, p = (j * S + i) * 4;
        d[p] = d[p + 1] = d[p + 2] = 255; d[p + 3] = a;
      }
      x.putImageData(im, 0, 0); SMK.push(c);
    }
    return SMK;
  }
  // дым / пар: источник (x, y); o: n, life, rise, sway, drift, spread, r0, r1, a, seed
  function smoke(c, t, x, y, o = {}) {
    const S = smokeSprites(), n = o.n || 24, life = o.life || 4, seed = o.seed || 1;
    c.save(); c.globalCompositeOperation = o.op || 'screen';
    for (let i = 0; i < n; i++) {
      const age = (((t + (o.t0 || 0)) / life + H1(seed + i * 1.37)) % 1 + 1) % 1;
      if (o.from != null && t - o.from < age * life) continue;    // дым появляется с момента from
      const rise = (o.rise || 420) * Math.pow(age, .85);
      const sway = n1(i * 3.7 + t * .35 + seed) * (o.sway || 40) * age + (o.drift || 0) * age * age;
      const px = x + sway + (H1(seed + i * 9.1) - .5) * (o.spread || 20) * (1 + age * 2), py = y - rise;
      const r = lp(o.r0 || 30, o.r1 || 180, Math.pow(age, .8)), a = (o.a ?? .5) * Math.pow(Math.sin(Math.PI * Math.min(1, age * 1.12)), 1.3);
      if (a <= .003) continue;
      c.globalAlpha = a; c.save(); c.translate(px, py); c.rotate(H1(seed + i) * TAU + t * .15 * (H1(i * 2.3) - .5)); c.drawImage(S[i % 4], -r, -r, 2 * r, 2 * r); c.restore();
    }
    c.restore();
  }
  // тех-карточка с выноской: (x, y) — левый верх, k — появление, o.tx/o.ty — куда тянется линия
  function card(c, x, y, title, value, k, o = {}) {
    if (k <= 0) return;
    const tw1 = tw(c, title, { f: 'J', w: 500, s: 20, ls: 4 }), tw2 = tw(c, value, { f: 'U', w: 700, s: o.vs || 34 }), w = Math.max(tw1, tw2) + 56, h = 98, e = eo(k);
    c.save(); c.globalAlpha *= cl(k * 2);
    if (o.tx != null) {
      const sx = o.side === 'r' ? x : x + w, sy = y + h / 2, ex = lp(sx, o.tx, e), ey = lp(sy, o.ty, e);
      c.strokeStyle = rgba(o.col || C.ice, .7); c.lineWidth = 2; c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex, ey); c.stroke();
      c.fillStyle = o.col || C.ice; c.beginPath(); c.arc(ex, ey, 6, 0, TAU); c.fill(); glowDot(c, ex, ey, 30, o.col || C.ice, .7 * e);
    }
    c.beginPath(); c.rect(x, y, w * e, h); c.clip();
    c.fillStyle = 'rgba(6,10,20,.78)'; c.fillRect(x, y, w, h); c.strokeStyle = 'rgba(190,225,255,.35)'; c.lineWidth = 1.5; c.strokeRect(x + .75, y + .75, w - 1.5, h - 1.5);
    c.fillStyle = o.col || C.ice; c.fillRect(x, y, 5, h);
    tx(c, title, x + 26, y + 34, { f: 'J', w: 500, s: 20, ls: 4, al: 'left', c: 'rgba(190,210,235,.8)' });
    tx(c, value, x + 26, y + 78, { f: 'U', w: 700, s: o.vs || 34, al: 'left', c: '#fff' });
    c.restore();
  }
  // штамп: 2,2 → 1 за 0,18 с (встряска кадра — HITS)
  function stamp(c, s, x, y, rot, t, t0, col = C.red, sz = 70) {
    const k = cl((t - t0 + .18) / .18); if (k <= 0) return;
    const w = tw(c, s, { f: 'O', w: 700, s: sz, ls: 8 }) + 80, h = sz * 1.75, sc = lp(2.2, 1, k * k);
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc); c.globalAlpha *= cl(k * 3) * .92;
    c.strokeStyle = col; c.lineWidth = 9; rr(c, -w / 2, -h / 2, w, h, 12); c.stroke(); c.lineWidth = 3; rr(c, -w / 2 + 13, -h / 2 + 13, w - 26, h - 26, 6); c.stroke();
    tx(c, s, 0, sz * .36, { f: 'O', w: 700, s: sz, ls: 8, c: col });
    c.restore();
    const pk = (t - t0) / .45; if (pk > 0 && pk < 1) { c.save(); c.strokeStyle = col; c.globalAlpha = 1 - pk; c.lineWidth = 10 * (1 - pk); c.beginPath(); c.arc(x, y, 100 + pk * 420, 0, TAU); c.stroke(); c.restore() }
  }
  function shake(t) { for (const h of HITS) if (t >= h && t < h + .22) { const k = 1 - (t - h) / .22, f = Math.floor(t * 60); return [(H1(f) - .5) * 30 * k, (H1(f + 7) - .5) * 30 * k] } return [0, 0] }

  // ================= предметы =================
  // одноразка-стик: центр (0, 0), высота h; o.led — яркость индикатора, o.ledCol
  function vape(c, h, o = {}) {
    const w = h * .23, top = -h / 2, mp = h * .2, led = o.led ?? .6, lc = o.ledCol || C.ice;
    c.save();
    rr(c, -w / 2, top + mp * .92, w, h - mp * .92, w * .36);
    c.fillStyle = lg(c, -w / 2, 0, w / 2, 0, [[0, '#121419'], [.1, '#454b55'], [.2, '#7a828f'], [.3, '#3f454f'], [.62, '#1d2026'], [.88, '#0c0d10'], [1, '#4a6a92']]); c.fill();
    c.save(); c.clip(); c.globalAlpha = .1; c.fillStyle = c.createPattern(brushed(), 'repeat'); c.fillRect(-w / 2, top, w, h); c.restore();
    rr(c, -w * .33, top, w * .66, mp * 1.05, [w * .3, w * .3, 4, 4]);
    c.fillStyle = lg(c, -w * .33, 0, w * .33, 0, [[0, '#050506'], [.3, '#24272d'], [.62, '#0f1013'], [1, '#22324a']]); c.fill();
    c.fillStyle = '#000'; rr(c, -w * .15, top + 5, w * .3, 6, 3); c.fill();
    c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(-w / 2 + 2, top + mp * .98, w - 4, 3);
    c.globalCompositeOperation = 'screen';
    c.fillStyle = lg(c, 0, top, 0, h / 2, [[0, 'rgba(255,255,255,0)'], [.3, 'rgba(255,255,255,.22)'], [.75, 'rgba(255,255,255,.07)'], [1, 'rgba(255,255,255,0)']]); c.fillRect(-w * .3, top + mp, w * .07, h - mp);
    c.fillStyle = lg(c, 0, top, 0, h / 2, [[0, 'rgba(140,200,255,0)'], [.5, 'rgba(140,200,255,.38)'], [1, 'rgba(140,200,255,.05)']]); c.fillRect(w * .43, top + mp, w * .045, h - mp);
    if (o.sweep != null) { const sy = lp(top, h / 2, o.sweep); c.fillStyle = lg(c, 0, sy - h * .12, 0, sy + h * .12, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,255,255,.16)'], [1, 'rgba(255,255,255,0)']]); c.fillRect(-w / 2, sy - h * .12, w, h * .24) }
    c.globalCompositeOperation = 'source-over';
    const ly = h / 2 - h * .13; rr(c, -w * .26, ly, w * .52, Math.max(4, h * .018), 3.5); c.fillStyle = rgba(lc, .22 + .78 * led); c.fill();
    glowDot(c, 0, ly + 3, w * 1.25, lc, .6 * led);
    c.restore();
  }
  function brushed() { return cache('brushed', 64, 512, (x, W, H) => { const im = x.createImageData(W, H), d = im.data; for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const v = fbm(i / 2.5, j / 90, 3), p = (j * W + i) * 4; d[p] = d[p + 1] = d[p + 2] = v * 255; d[p + 3] = 255 } x.putImageData(im, 0, 0) }) }
  function coil(c, x, y, w, hg, t, heat = 1) {
    const n = 7; c.save(); c.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const yy = y - hg / 2 + i * hg / (n - 1);
      c.lineWidth = 3; c.strokeStyle = `rgba(255,${110 + 50 * heat | 0},40,.35)`; c.beginPath(); c.ellipse(x, yy, w / 2, w * .09, 0, Math.PI, TAU); c.stroke();
      c.lineWidth = 4; c.strokeStyle = `rgba(255,${150 + 80 * heat | 0},80,.95)`; c.shadowColor = '#ff8a2a'; c.shadowBlur = 18 * heat; c.beginPath(); c.ellipse(x, yy, w / 2, w * .09, 0, 0, Math.PI); c.stroke(); c.shadowBlur = 0;
    }
    glowDot(c, x, y, w * 1.5, '#ff7a1a', .55 * heat * (.85 + .15 * Math.sin(t * 9)));
    c.restore();
  }
  // одноразка «на рентгене»: внутренности светятся
  function vapeX(c, h, t, o = {}) {
    const w = h * .23, top = -h / 2, mp = h * .2, t0 = top + mp + 10, t1 = top + h * .46;
    c.save();
    rr(c, -w / 2, top + mp * .92, w, h - mp * .92, w * .36); c.fillStyle = 'rgba(8,26,48,.9)'; c.fill();
    rr(c, -w * .33, top, w * .66, mp * 1.05, [w * .3, w * .3, 4, 4]); c.fill();
    c.strokeStyle = C.ice; c.lineWidth = 3; c.shadowColor = C.ice; c.shadowBlur = 16;
    rr(c, -w / 2, top + mp * .92, w, h - mp * .92, w * .36); c.stroke(); rr(c, -w * .33, top, w * .66, mp * 1.05, [w * .3, w * .3, 4, 4]); c.stroke();
    c.lineWidth = 2; c.beginPath(); c.moveTo(-w * .05, top + 10); c.lineTo(-w * .05, t0 + 10); c.moveTo(w * .05, top + 10); c.lineTo(w * .05, t0 + 10); c.stroke(); c.shadowBlur = 0;
    // бак
    rr(c, -w * .38, t0, w * .76, t1 - t0, 12); c.fillStyle = 'rgba(255,170,60,.14)'; c.fill(); c.strokeStyle = 'rgba(255,190,100,.85)'; c.lineWidth = 2; c.stroke();
    const lv = t0 + (t1 - t0) * .22; c.save(); rr(c, -w * .38, t0, w * .76, t1 - t0, 12); c.clip();
    c.fillStyle = lg(c, 0, lv, 0, t1, [[0, 'rgba(255,180,70,.55)'], [1, 'rgba(255,120,40,.35)']]); c.beginPath(); c.moveTo(-w, lv);
    for (let i = 0; i <= 20; i++) c.lineTo(-w * .38 + i * w * .76 / 20, lv + Math.sin(t * 3 + i * .9) * 3); c.lineTo(w, t1 + 20); c.lineTo(-w, t1 + 20); c.fill();
    for (let i = 0; i < 14; i++) { const u = (H1(i * 3.3) + t * (.15 + .2 * H1(i))) % 1, bx = -w * .3 + H1(i * 7.1) * w * .6, by = lp(t1 - 8, lv + 6, u); c.strokeStyle = `rgba(255,230,180,${.6 * Math.sin(Math.PI * u)})`; c.lineWidth = 1.5; c.beginPath(); c.arc(bx, by, 2 + 3 * H1(i), 0, TAU); c.stroke() }
    c.restore();
    coil(c, 0, t0 + (t1 - t0) * .62, w * .46, (t1 - t0) * .32, t, o.heat ?? 1);
    // плата
    const b0 = top + h * .5, b1 = top + h * .6; rr(c, -w * .38, b0, w * .76, b1 - b0, 6); c.fillStyle = 'rgba(40,210,150,.14)'; c.fill(); c.strokeStyle = 'rgba(70,235,175,.8)'; c.lineWidth = 2; c.stroke();
    c.fillStyle = 'rgba(70,235,175,.7)'; c.fillRect(-w * .14, b0 + (b1 - b0) * .25, w * .28, (b1 - b0) * .5);
    c.strokeStyle = 'rgba(70,235,175,.45)'; c.lineWidth = 1.5; c.beginPath();
    for (let i = 0; i < 6; i++) { const yy = b0 + (b1 - b0) * (.2 + i * .12); c.moveTo(-w * .34, yy); c.lineTo(-w * .16, yy); c.moveTo(w * .16, yy); c.lineTo(w * .34, yy) } c.stroke();
    // аккумулятор
    const a0 = top + h * .63, a1 = h / 2 - h * .07; rr(c, -w * .38, a0, w * .76, a1 - a0, 16); c.fillStyle = 'rgba(120,180,255,.10)'; c.fill(); c.strokeStyle = 'rgba(150,210,255,.8)'; c.stroke();
    c.strokeStyle = 'rgba(150,210,255,.35)'; c.beginPath(); for (let i = 1; i < 5; i++) { const yy = lp(a0, a1, i / 5); c.moveTo(-w * .3, yy); c.lineTo(w * .3, yy) } c.stroke();
    tx(c, '+', 0, a0 + 36, { f: 'J', w: 700, s: 26, c: 'rgba(150,210,255,.8)' });
    const ly = h / 2 - h * .13 + 2; glowDot(c, 0, ly, w, C.ice, .5);
    c.restore();
  }
  function laptop(c, x, y, s, t) {
    c.save(); c.translate(x, y); c.scale(s, s);
    poly(c, [-264, 4, 264, 4, 250, -344, -250, -344]); c.fillStyle = '#0c0f15'; c.fill();
    const scr = [-250, -6, 250, -6, 237, -332, -237, -332];
    poly(c, scr); c.fillStyle = lg(c, 0, -332, 0, 0, [[0, '#17345f'], [1, '#0a1a33']]); c.fill();
    c.save(); poly(c, scr); c.clip();
    for (let i = 0; i < 10; i++) { c.fillStyle = `rgba(150,200,255,${.1 + .1 * H1(i)})`; c.fillRect(-212, -306 + i * 25, 110 + 180 * H1(i * 3.1), 8) }
    c.strokeStyle = 'rgba(120,220,255,.6)'; c.lineWidth = 3; c.beginPath();
    for (let i = 0; i <= 40; i++) { const px = 0 + i * 5.2, py = -90 - 140 * (i / 40) * (.6 + .4 * H1(i * 1.7 + Math.floor(t * 3))); i ? c.lineTo(px, py) : c.moveTo(px, py) } c.stroke();
    c.fillStyle = 'rgba(255,255,255,.05)'; c.beginPath(); c.moveTo(-237, -332); c.lineTo(-40, -332); c.lineTo(-180, -6); c.lineTo(-250, -6); c.fill();
    c.restore();
    poly(c, [-264, 4, 264, 4, 334, 124, -334, 124]); c.fillStyle = lg(c, 0, 0, 0, 124, [[0, '#1a1f29'], [1, '#0b0e13']]); c.fill();
    c.fillStyle = 'rgba(0,0,0,.5)';
    for (let r = 0; r < 4; r++) { const v = (r + .6) / 5, w0 = lp(258, 326, v); for (let k = 0; k < 13; k++) c.fillRect(-w0 * .9 + k * (w0 * 1.8 / 13), 8 + v * 88, w0 * 1.8 / 13 - 6, 13) }
    c.globalCompositeOperation = 'screen'; c.fillStyle = rg(c, 0, 80, 0, 480, [[0, 'rgba(70,130,255,.24)'], [1, 'rgba(70,130,255,0)']]); c.fillRect(-520, -120, 1040, 560);
    c.restore();
  }

  // ================= СЦЕНА 1: тёмная комната, одноразка в луче =================
  function roomBack() {
    return cache('roomBack', WW, HH, (x) => {
      x.fillStyle = lg(x, 0, 0, 0, HH, [[0, '#060a12'], [.58, '#0b1221'], [.6, '#05070c'], [1, '#020306']]); x.fillRect(0, 0, WW, HH);
      x.globalAlpha = .08; x.fillStyle = x.createPattern(noiseTex('wall', 512, 512, 60, 4), 'repeat'); x.fillRect(0, 0, WW, HH * .6); x.globalAlpha = 1;
      poly(x, [-300, HH * .6, WW + 300, HH * .6, WW + 900, HH, -900, HH]); x.fillStyle = lg(x, 0, HH * .6, 0, HH, [[0, '#121722'], [1, '#05070a']]); x.fill();
      x.globalAlpha = .06; x.fillStyle = x.createPattern(noiseTex('desk', 512, 512, 22, 3), 'repeat'); x.fillRect(0, HH * .6, WW, HH * .4); x.globalAlpha = 1;
      x.fillStyle = 'rgba(160,200,255,.12)'; x.fillRect(0, HH * .6 - 1, WW, 2);
    });
  }
  function mugFG() { // размытый предмет переднего плана
    return cache('mugFG', 700, 760, (x) => { const t = mk(700, 760), y = t.getContext('2d'); y.fillStyle = '#020304'; rr(y, 150, 150, 380, 520, 40); y.fill(); y.fillStyle = 'rgba(120,170,255,.25)'; y.fillRect(505, 190, 16, 440); x.filter = 'blur(26px)'; x.drawImage(t, 0, 0) });
  }
  function room(c, t, o = {}) {
    const vx = 1090, vy = 610, vh = 330, led = o.led ?? (.55 + .45 * Math.sin(t * 2.6));
    c.drawImage(roomBack(), 0, 0);
    beam(c, vx + 10, -140, .02, .62, 1300, '#bfdcff', o.beam ?? .95);
    laptop(c, 590, HH * .6 + 46, .92, t);
    pool(c, vx, vy + vh - 10, 560, 120, '#a9cfff', .55);
    c.save(); c.translate(vx, vy + vh + 2); c.scale(1, -.55); c.globalAlpha = .16; c.translate(0, -vh / 2); vape(c, vh, { led, ledCol: o.ledCol }); c.restore();
    c.save(); c.translate(vx, vy + vh / 2); vape(c, vh, { led, ledCol: o.ledCol }); c.restore();
    glowDot(c, vx, vy + vh + 6, 160, o.ledCol || C.ice, .18 * led);
    smoke(c, t, vx, vy - 4, { n: 30, life: 5, rise: 620, sway: 70, drift: 40, r0: 26, r1: 230, a: o.smoke ?? .32, seed: 3 });
    smoke(c, t, vx, vy - 4, { n: 22, life: 2.2, rise: 260, sway: 26, drift: 20, r0: 8, r1: 60, a: .45, seed: 7 });
    dust(c, t, vx + 10, -140, .02, .62, 1300, 160, 5, .9);
    c.drawImage(mugFG(), -180, HH - 560);
  }

  // ================= СЦЕНА 1: макро одноразки =================
  function vapeMacro(c, t, u, o) {
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, '#060b16'], [1, '#020306']]); c.fillRect(0, 0, WW, HH);
    const bk = bokeh('vm', WW * 1.3, HH * 1.3, 70, ['#6fb4ff', '#9fd0ff', '#ffb36b', '#3fd3c6'], 30, 120, 11);
    c.save(); c.filter = 'blur(6px)'; c.drawImage(bk, -WW * .15 - u * 18, -HH * .15); c.restore();
    beam(c, 1300, -200, -.18, .5, 1400, '#cfe6ff', .55);
    c.save(); c.translate(o.x + Math.sin(u * .7) * 8 - u * 14, o.y + u * 6); c.rotate(o.r + u * .01); vape(c, o.h, { led: .55 + .45 * Math.sin(t * 2.6), sweep: (u * .35 + .1) % 1.3 - .15 }); c.restore();
    if (o.smoke) smoke(c, t, o.sx, o.sy, { n: 26, life: 4, rise: 520, sway: 90, drift: -60, r0: 40, r1: 260, a: .3, seed: 9 });
    dust(c, t, 1300, -200, -.18, .5, 1400, 120, 13, .8);
  }

  // ================= СЦЕНА 1: рентген, код, счётчик годов =================
  function codeRain(c, t, o = {}) {
    const cols = o.cols || 56, cw = WW / cols, fs = o.fs || 22, rows = Math.ceil(HH / fs) + 1, chs = '0123456789ABCDEFNICOTINE№%$';
    c.save(); c.font = `500 ${fs}px J`; c.textAlign = 'center';
    for (let i = 0; i < cols; i++) {
      const sp = 70 + 140 * H1(i * 3.3), head = ((t * sp + H1(i * 7.1) * 2400) % (HH + 700)) - 300, tl = 380 + 300 * H1(i * 5.5);
      for (let j = 0; j < rows; j++) {
        const y = j * fs, d = head - y; if (d < 0 || d > tl) continue;
        const a = (1 - d / tl) * (o.a || .3), ch = chs[Math.floor(H1(i * 31 + j * 7 + Math.floor(t * 9 + H1(j + i) * 5)) * chs.length)];
        c.fillStyle = d < fs ? `rgba(220,255,250,${Math.min(1, a * 2.4)})` : `rgba(60,210,190,${a})`; c.fillText(ch, i * cw + cw / 2, y);
      }
    }
    c.restore();
  }
  function grid(c, step, a, col = '#9fd0ff') { c.save(); c.strokeStyle = rgba(col, a); c.lineWidth = 1; c.beginPath(); for (let x = 0; x <= WW; x += step) { c.moveTo(x + .5, 0); c.lineTo(x + .5, HH) } for (let y = 0; y <= HH; y += step) { c.moveTo(0, y + .5); c.lineTo(WW, y + .5) } c.stroke(); c.restore() }
  function xray(c, t, u, o) {
    c.fillStyle = '#030812'; c.fillRect(0, 0, WW, HH); codeRain(c, t, { a: .16 }); grid(c, 60, .05);
    c.fillStyle = rg(c, WW / 2, HH / 2, 0, 900, [[0, 'rgba(30,90,160,.25)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, WW, HH);
    const h = o.h, scan = o.scan(u);  // доля сверху вниз, уже «просвеченная»
    c.save(); c.translate(o.x, o.y); c.rotate(o.r); c.scale(o.s0 + u * .012, o.s0 + u * .012);
    if (scan < 1) { c.save(); c.beginPath(); c.rect(-400, -h / 2 + h * scan, 800, h + 100); c.clip(); vape(c, h, { led: .8 }); c.restore() }
    if (scan > 0) {
      c.save(); c.beginPath(); c.rect(-400, -h / 2 - 100, 800, h * scan + 100); c.clip(); vapeX(c, h, t, { heat: o.heat ? o.heat(u) : 1 }); c.restore();
      if (scan < 1) { const sy = -h / 2 + h * scan; c.fillStyle = lg(c, 0, sy - 40, 0, sy + 4, [[0, 'rgba(120,220,255,0)'], [1, 'rgba(160,235,255,.9)']]); c.fillRect(-360, sy - 40, 720, 44); glowDot(c, 0, sy, 420, '#7fd8ff', .35) }
    }
    c.restore();
    if (o.labels) o.labels(c, t, u);
  }
  // сплит-флап: цифры меняются целиком, «створка» падает
  function flapDigit(c, x, y, w, h, d0, d1, k) {
    const r = 16, fs = h * .84;
    const face = (d, half) => {
      c.save(); c.beginPath(); c.rect(x, half ? y + h / 2 : y, w, h / 2); c.clip();
      rr(c, x, y, w, h, r); c.fillStyle = lg(c, 0, y, 0, y + h, [[0, '#1b2029'], [.5, '#0f1218'], [.501, '#090b0f'], [1, '#151a22']]); c.fill();
      tx(c, String(d), x + w / 2, y + h / 2 + fs * .36, { f: 'O', w: 700, s: fs, c: '#f2efe6' }); c.restore();
    };
    face(d1, 0); face(d0, 1);
    if (k > 0 && k < 1) {
      c.save();
      if (k < .5) { const s = 1 - k * 2; c.translate(0, y + h / 2); c.scale(1, s); c.translate(0, -(y + h / 2)); face(d0, 0); c.fillStyle = `rgba(0,0,0,${.5 * k * 2})`; c.fillRect(x, y, w, h / 2) }
      else { const s = (k - .5) * 2; c.translate(0, y + h / 2); c.scale(1, s); c.translate(0, -(y + h / 2)); face(d1, 1); c.fillStyle = `rgba(0,0,0,${.5 * (1 - s)})`; c.fillRect(x, y + h / 2, w, h / 2) }
      c.restore();
    } else if (k <= 0) face(d0, 0);
    c.fillStyle = 'rgba(0,0,0,.85)'; c.fillRect(x, y + h / 2 - 2, w, 4);
    c.fillStyle = '#05070a'; c.fillRect(x - 3, y + h / 2 - 7, 7, 14); c.fillRect(x + w - 4, y + h / 2 - 7, 7, 14);
  }
  function yearAt(t) { const k = eo(at(t, Q.p50, Q.y73 + .25)); return 2026 - (2026 - 1973) * k }
  function counter(c, t, u) {
    c.fillStyle = '#020509'; c.fillRect(0, 0, WW, HH);
    c.save(); c.globalAlpha = .7; codeRain(c, t, { a: .22, cols: 64, fs: 20 }); c.restore();
    c.fillStyle = rg(c, WW / 2, HH / 2, 100, 1000, [[0, 'rgba(0,0,0,.2)'], [1, 'rgba(0,0,0,.85)']]); c.fillRect(0, 0, WW, HH);
    const yv = yearAt(t), Y = Math.ceil(yv - 1e-6), p = Y - yv, nxt = Y - 1, ds = String(Y).split('').map(Number), dn = String(nxt).split('').map(Number);
    const w = 250, h = 380, gap = 30, x0 = WW / 2 - (4 * w + 3 * gap) / 2, y0 = HH / 2 - h / 2 - 20, s = 1 + u * .02, landed = t >= Q.y73 + .25;
    c.save(); c.translate(WW / 2, HH / 2); c.scale(s, s); c.translate(-WW / 2, -HH / 2);
    glowDot(c, WW / 2, HH / 2, 900, landed ? '#ff4a3a' : '#2a7fff', landed ? .35 : .18);
    for (let i = 0; i < 4; i++) { const ch = !landed && ds[i] !== dn[i]; flapDigit(c, x0 + i * (w + gap), y0, w, h, ds[i], ch ? dn[i] : ds[i], ch ? p : 0) }
    tx(c, L.rewind, WW / 2, y0 + h + 92, { f: 'J', w: 500, s: 28, ls: 12, c: landed ? 'rgba(255,120,110,.95)' : 'rgba(180,215,255,.75)' });
    c.restore();
  }

  // ================= СЦЕНА 2: ночной завод и башня «Рейнольдс» =================
  function skyLayers() {
    return cache('sky', WW * 1.4, HH, (x, W, H) => {
      x.fillStyle = lg(x, 0, 0, 0, H, [[0, '#040205'], [.42, '#170408'], [.7, '#4d0c10'], [.8, '#7a1a14'], [1, '#2a0607']]); x.fillRect(0, 0, W, H);
      const far = mk(W, H), f = far.getContext('2d'); f.fillStyle = '#2b090c';
      for (let i = 0; i < 90; i++) { const bx = H1(i * 3.7) * W, bw = 30 + H1(i * 1.3) * 90, bh = 40 + H1(i * 9.1) ** 2 * 220; f.fillRect(bx, H * .79 - bh, bw, bh + 40) }
      x.filter = 'blur(4px)'; x.drawImage(far, 0, 0); x.filter = 'none';
    });
  }
  function factorySil() {
    return cache('factory', WW * 1.4, HH, (x, W, H) => {
      const base = H * .82; x.fillStyle = '#070203';
      // корпуса с «пилой» крыш
      for (let b = 0; b < 4; b++) { const bx = 80 + b * 520, bw = 420, bh = 150 + b % 2 * 40; x.fillRect(bx, base - bh, bw, bh + 60); for (let k = 0; k < 6; k++) { const sx = bx + k * bw / 6; poly(x, [sx, base - bh, sx + bw / 6, base - bh - 50, sx + bw / 6, base - bh]); x.fill() } }
      // трубы
      for (const [cx, ch] of [[300, 430], [520, 520], [1180, 470], [1950, 400]]) { poly(x, [cx - 26, base, cx + 26, base, cx + 18, base - ch, cx - 18, base - ch]); x.fill(); x.fillRect(cx - 24, base - ch, 48, 12) }
      // резервуары
      for (const [cx, r] of [[1620, 90], [1760, 70]]) { x.beginPath(); x.ellipse(cx, base - r, r, r, 0, Math.PI, 0); x.lineTo(cx + r, base + 40); x.lineTo(cx - r, base + 40); x.fill() }
      // башня в стиле ар-деко
      const tx0 = 900, tb = base + 40; const st = [[260, 300], [210, 520], [160, 660], [110, 760], [60, 830], [14, 900]];
      x.fillStyle = lg(x, 0, tb - 900, 0, tb, [[0, '#0b0406'], [.55, '#1d0b0b'], [1, '#3a1612']]);
      for (const [w, h] of st) x.fillRect(tx0 - w / 2, tb - h, w, h);
      x.fillRect(tx0 - 3, tb - 980, 6, 90);
      x.fillStyle = 'rgba(0,0,0,.35)'; for (const [w, h] of st.slice(0, 4)) for (let k = -w / 2 + 16; k < w / 2 - 8; k += 26) x.fillRect(tx0 + k, tb - h + 6, 3, h - 6);
      x.fillStyle = '#070203';
      // контур неба: красный ободок по верху силуэтов
      x.globalCompositeOperation = 'source-atop'; x.fillStyle = lg(x, 0, 0, 0, H, [[0, 'rgba(120,20,20,.0)'], [.55, 'rgba(120,20,20,.0)'], [.6, 'rgba(160,30,25,.25)'], [1, 'rgba(0,0,0,0)']]); x.fillRect(0, 0, W, H);
    });
  }
  function windows(c, t, x0, base) {
    c.save(); c.globalCompositeOperation = 'screen';
    const tx0 = 900 + x0, tb = base + 40, st = [[260, 300], [210, 520], [160, 660], [110, 760]];
    st.forEach(([w, h], s) => { const y1 = tb - (st[s + 1] ? st[s + 1][1] : h) + 10, y0 = tb - h + 14; for (let yy = y0; yy < tb - 20; yy += 26) for (let xx = tx0 - w / 2 + 6; xx < tx0 + w / 2 - 12; xx += 26) { const i = xx * 7 + yy * 13, on = H1(i) > .7 && (H1(i + Math.floor(t * .7 + H1(i) * 9)) > .08); if (on && (yy > y1 || s === st.length - 1)) { c.fillStyle = `rgba(255,${190 + 40 * H1(i * 2) | 0},130,${.22 + .38 * H1(i * 3)})`; c.fillRect(xx, yy, 7, 10) } } });
    for (let b = 0; b < 4; b++) { const bx = 80 + b * 520 + x0, bh = 150 + b % 2 * 40; for (let r = 0; r < 4; r++) for (let k = 0; k < 16; k++) { const i = b * 991 + r * 37 + k; if (H1(i) > .55) { c.fillStyle = `rgba(255,170,90,${.25 + .35 * H1(i * 5)})`; c.fillRect(bx + 18 + k * 25, base - bh + 28 + r * 34, 14, 16) } } }
    c.restore();
  }
  function skyline(c, t, u, o) {
    const x0 = -(o.pan0 + u * o.pan);
    c.save(); view(c, o.s + u * o.zs, WW / 2 + (o.cx || 0), HH / 2 + (o.cy || 0));
    c.drawImage(skyLayers(), x0 * .5 - 80, 0);
    for (const [bx, sp, ph] of [[260, .5, 0], [1500, .4, 2], [1800, .45, 4.2]]) beam(c, bx + x0 * .7, HH * .8, Math.PI + Math.sin(t * sp + ph) * .45, .1, 1300, '#ffd0c0', .42);
    for (const [cx, ch] of [[300, 430], [520, 520], [1180, 470], [1950, 400]]) smoke(c, t, cx + x0, HH * .82 - ch, { n: 22, life: 7, rise: 520, sway: 50, drift: 380, r0: 30, r1: 220, a: .16, seed: cx });
    c.drawImage(factorySil(), x0, 0);
    windows(c, t, x0, HH * .82);
    glowDot(c, 900 + x0, HH * .82 + 40 - 980, 22, '#ff2a2a', .5 + .5 * Math.sin(t * 3)); glowDot(c, 900 + x0, HH * .82 + 40, 520, '#ff9a5a', .16);
    c.fillStyle = lg(c, 0, HH * .7, 0, HH, [[0, 'rgba(120,30,30,0)'], [.5, 'rgba(110,30,30,.22)'], [1, 'rgba(10,2,3,.9)']]); c.fillRect(-WW, HH * .7, WW * 3, HH * .4);
    c.restore();
    if (o.tags) o.tags(c, t, u, x0);
  }

  // ================= СЦЕНА 2: стол, лампа, меморандум 1973 =================
  const MW = 2600, MH = 1700, PX = 1350, PY = 820, PW = 900, PH = 1160, PR = -.035;   // мир стола и лист
  function deskTex() {
    return cache('desk73', MW, MH, (x) => {
      x.fillStyle = '#1a110b'; x.fillRect(0, 0, MW, MH);
      const n = mk(520, 340), y = n.getContext('2d'), im = y.createImageData(520, 340), d = im.data;
      for (let j = 0; j < 340; j++) for (let i = 0; i < 520; i++) { const v = fbm(i / 90, j / 7, 4), p = (j * 520 + i) * 4; d[p] = 120 + v * 90; d[p + 1] = 70 + v * 50; d[p + 2] = 35 + v * 25; d[p + 3] = 255 * (.25 + .5 * v) }
      y.putImageData(im, 0, 0); x.globalAlpha = .55; x.drawImage(n, 0, 0, MW, MH); x.globalAlpha = 1;
    });
  }
  function paperTex() {
    return cache('paper73', PW, PH, (x) => {
      x.fillStyle = C.paper; x.fillRect(0, 0, PW, PH);
      x.globalAlpha = .18; x.fillStyle = x.createPattern(noiseTex('pap', 256, 256, 9, 3), 'repeat'); x.fillRect(0, 0, PW, PH); x.globalAlpha = 1;
      x.fillStyle = rg(x, PW / 2, PH / 2, PW * .3, PW * .9, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(90,60,20,.22)']]); x.fillRect(0, 0, PW, PH);
      const M = L.memo, ink = '#25221d';
      tx(x, M.co, 70, 100, { f: 'J', w: 700, s: 24, ls: 3, al: 'left', c: ink }); tx(x, M.title, 70, 148, { f: 'J', w: 700, s: 30, ls: 2, al: 'left', c: ink });
      x.fillStyle = ink; x.fillRect(70, 170, PW - 140, 3);
      tx(x, M.date, 70, 222, { f: 'J', w: 500, s: 20, ls: 1, al: 'left', c: ink }); tx(x, M.subj[0], 70, 260, { f: 'J', w: 500, s: 20, al: 'left', c: ink }); tx(x, M.subj[1], 70, 290, { f: 'J', w: 500, s: 20, al: 'left', c: ink });
      for (let i = 0; i < 18; i++) { if (i === 8 || i === 9) continue; const y = 360 + i * 42, w = (i % 6 === 5 ? .45 : .82 + .14 * H1(i)) * (PW - 140); x.fillStyle = 'rgba(40,36,30,.55)'; for (let k = 0; k < w; k += 18 + 30 * H1(i * 50 + k)) { const ww = Math.min(w - k, 10 + 34 * H1(i * 77 + k)); x.fillRect(70 + k, y - 12, ww, 13) } }
      tx(x, M.l1, 70, 360 + 8 * 42, { f: 'J', w: 700, s: 26, al: 'left', c: ink }); tx(x, M.l2, 70, 360 + 9 * 42, { f: 'J', w: 700, s: 26, al: 'left', c: ink });
    });
  }
  function paperXY(px, py) { const c0 = Math.cos(PR), s0 = Math.sin(PR), dx = px - PW / 2, dy = py - PH / 2; return [PX + dx * c0 - dy * s0, PY + dx * s0 + dy * c0] }
  function memoWorld(c, t, o = {}) {
    c.drawImage(deskTex(), 0, 0);
    // папка под листом, ручка, пепельница
    c.save(); c.translate(PX + 60, PY + 30); c.rotate(.05); c.fillStyle = '#5a4021'; c.fillRect(-PW / 2 - 40, -PH / 2 - 30, PW + 80, PH + 60); c.restore();
    const sl = o.slide ?? 1, ox = (1 - eo(sl)) * -900;
    c.save(); c.translate(PX + ox, PY); c.rotate(PR + (1 - eo(sl)) * -.12);
    c.fillStyle = 'rgba(0,0,0,.45)'; c.filter = 'blur(14px)'; c.fillRect(-PW / 2 + 14, -PH / 2 + 22, PW, PH); c.filter = 'none';
    c.drawImage(paperTex(), -PW / 2, -PH / 2);
    if (o.hl > 0) { // маркер
      const M = L.memo, x0 = 64, y0 = 360 + 9 * 42 - 30, w = tw(c, M.l2, { f: 'J', w: 700, s: 26 }) + 14;
      c.save(); c.translate(-PW / 2, -PH / 2); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(255,214,40,.85)';
      c.beginPath(); c.moveTo(x0, y0 + 3); for (let i = 0; i <= 24; i++) c.lineTo(x0 + w * o.hl * i / 24, y0 + 2 + Math.sin(i * 1.7) * 2); c.lineTo(x0 + w * o.hl, y0 + 38); for (let i = 24; i >= 0; i--) c.lineTo(x0 + w * o.hl * i / 24, y0 + 38 + Math.sin(i * 2.3) * 2); c.fill(); c.restore();
    }
    if (o.stampT != null) stamp(c, L.memo.stamp, PW / 2 - 230, -PH / 2 + 300, -.12, t, o.stampT, '#c4161c', 54);
    if (o.doneT != null) stamp(c, L.done, 0, 140, -.16, t, o.doneT, '#d0151c', 84);
    c.restore();
    // пепельница с сигаретой
    const ax = 2220, ay = 1300; c.save(); c.translate(ax, ay); c.fillStyle = 'rgba(0,0,0,.5)'; c.beginPath(); c.ellipse(10, 24, 190, 70, 0, 0, TAU); c.fill();
    c.fillStyle = lg(c, -180, 0, 180, 0, [[0, 'rgba(160,190,200,.18)'], [.5, 'rgba(220,240,255,.32)'], [1, 'rgba(160,190,200,.12)']]); c.beginPath(); c.ellipse(0, 0, 180, 64, 0, 0, TAU); c.fill();
    c.fillStyle = '#100b08'; c.beginPath(); c.ellipse(0, 4, 120, 40, 0, 0, TAU); c.fill();
    c.rotate(-.5); c.fillStyle = '#e9e3d6'; c.fillRect(-20, -9, 210, 18); c.fillStyle = '#c98a3a'; c.fillRect(150, -9, 60, 18); c.restore();
    const ex = ax - 20, ey = ay + 12; glowDot(c, ex, ey, 26, '#ff7a2a', .9 + .3 * Math.sin(t * 5)); c.fillStyle = '#ff9a3a'; c.beginPath(); c.arc(ex, ey, 7, 0, TAU); c.fill();
    smoke(c, t, ex, ey - 6, { n: 18, life: 6, rise: 760, sway: 60, drift: 120, r0: 10, r1: 130, a: .2, seed: 41 });
    // перьевая ручка
    c.save(); c.translate(1980, 520); c.rotate(.9); c.fillStyle = 'rgba(0,0,0,.4)'; c.fillRect(-10, 16, 340, 22); c.fillStyle = lg(c, 0, -14, 0, 14, [[0, '#2a2a30'], [.4, '#5a5a66'], [1, '#101014']]); rr(c, 0, -13, 300, 26, 13); c.fill(); c.fillStyle = '#c9a24a'; c.fillRect(200, -13, 10, 26); c.fillStyle = '#b8902f'; poly(c, [300, -8, 360, 0, 300, 8]); c.fill(); c.restore();
    // карточка досье на булавке и красная нить к строке
    const [hx, hy] = paperXY(36, 360 + 9 * 42 - 10), cp = dossierCard(c, t, 520, 560, -.08);
    thread(c, cp[0], cp[1], hx + ox, hy, t); pin(c, cp[0], cp[1], '#d0242a'); pin(c, hx + ox, hy, '#d0242a');
    // лампа: тёплый конус слева сверху
    beam(c, 260, -420, -.62, .95, 2200, '#ffd59a', .7);
    pool(c, PX - 80, PY - 40, 900, 620, '#ffcf8a', .38);
    dust(c, t, 260, -420, -.62, .95, 2200, 140, 21, .7);
  }
  function pin(c, x, y, col) { c.save(); c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.ellipse(x + 6, y + 8, 16, 10, 0, 0, TAU); c.fill(); c.fillStyle = rg(c, x - 4, y - 5, 2, 18, [[0, '#ff8a8a'], [.4, col], [1, '#5a0a0e']]); c.beginPath(); c.arc(x, y, 15, 0, TAU); c.fill(); c.restore() }
  function thread(c, x0, y0, x1, y1, t) { c.save(); c.strokeStyle = '#d0242a'; c.lineWidth = 4; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 8; c.shadowOffsetY = 6; c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2, Math.max(y0, y1) + 80 + Math.sin(t) * 4, x1, y1); c.stroke(); c.restore() }
  function dossierCard(c, t, x, y, r) {
    c.save(); c.translate(x, y); c.rotate(r);
    c.fillStyle = 'rgba(0,0,0,.45)'; c.filter = 'blur(10px)'; c.fillRect(-160, -90, 340, 220); c.filter = 'none';
    c.fillStyle = '#efe8d4'; c.fillRect(-170, -110, 340, 220); c.fillStyle = 'rgba(200,40,40,.7)'; c.fillRect(-170, -70, 340, 2);
    for (let i = 0; i < 4; i++) c.fillStyle = 'rgba(80,120,170,.35)', c.fillRect(-170, -30 + i * 34, 340, 1.5);
    const D0 = L.dossier, ink = '#26221c';
    tx(c, D0[0], -148, -80, { f: 'J', w: 700, s: 22, ls: 3, al: 'left', c: '#a01c20' });
    tx(c, D0[1], -148, -36, { f: 'J', w: 700, s: 22, al: 'left', c: ink }); tx(c, D0[2], -148, -2, { f: 'J', w: 500, s: 17, al: 'left', c: ink }); tx(c, D0[3], -148, 32, { f: 'J', w: 700, s: 22, al: 'left', c: ink });
    c.restore(); return [x + 60 * Math.cos(r) + 82 * Math.sin(r), y + 60 * Math.sin(r) - 82 * Math.cos(r)];
  }

  // ================= СЦЕНА 3: сигарета, горло, лаборатория =================
  function cigarette(c, t, u) {
    c.fillStyle = lg(c, 0, 0, WW, HH, [[0, '#0d0907'], [1, '#030202']]); c.fillRect(0, 0, WW, HH);
    c.save(); c.filter = 'blur(5px)'; c.globalAlpha = .75; c.drawImage(bokeh('cig', WW * 1.2, HH * 1.2, 50, ['#ffb36b', '#ff8a4a', '#ffd2a0'], 30, 110, 23), -WW * .1 - u * 12, -HH * .1); c.restore();
    beam(c, 1500, -220, .5, .55, 1500, '#ffe0c0', .55);
    const k = eio(u / 2.4); c.save(); view(c, lp(1, 1.3, k), lp(WW / 2, 1180, k), lp(HH / 2, 520, k));
    const Lc = 1250, R0 = 46, ang = -.32, cx = 820, cy = 640, fl = .75 + .25 * n1(t * 6);
    c.save(); c.translate(cx, cy); c.rotate(ang);
    c.fillStyle = 'rgba(0,0,0,.55)'; c.filter = 'blur(18px)'; c.fillRect(-Lc / 2, R0 + 10, Lc, 40); c.filter = 'none';
    rr(c, -Lc / 2, -R0, 360, R0 * 2, [R0, 6, 6, R0]); c.fillStyle = lg(c, 0, -R0, 0, R0, [[0, '#b97a3e'], [.35, '#e2a964'], [.7, '#a5682e'], [1, '#5a3412']]); c.fill();
    c.save(); c.clip(); c.globalAlpha = .35; c.fillStyle = c.createPattern(noiseTex('cork', 128, 128, 3, 2), 'repeat'); c.fillRect(-Lc / 2, -R0, 360, R0 * 2); c.restore();
    c.fillStyle = lg(c, 0, -R0, 0, R0, [[0, '#cfcac0'], [.3, '#f6f2ea'], [.7, '#d9d3c7'], [1, '#8a857b']]); c.fillRect(-Lc / 2 + 360, -R0, Lc - 400, R0 * 2);
    c.fillStyle = 'rgba(160,140,110,.35)'; c.fillRect(-Lc / 2 + 352, -R0, 10, R0 * 2);
    const ex = Lc / 2 - 40;
    c.fillStyle = lg(c, ex, 0, ex + 60, 0, [[0, '#6a625a'], [.5, '#3e3833'], [1, '#2a2522']]); rr(c, ex, -R0 + 2, 58, R0 * 2 - 4, [4, R0 * .6, R0 * .6, 4]); c.fill();
    c.globalCompositeOperation = 'screen';
    c.fillStyle = rg(c, ex + 6, 0, 0, R0 * 1.5, [[0, `rgba(255,200,90,${fl})`], [.3, `rgba(255,90,30,${.8 * fl})`], [1, 'rgba(255,40,0,0)']]); c.fillRect(ex - 70, -R0 * 2, 150, R0 * 4);
    for (let i = 0; i < 18; i++) { const yy = -R0 + 6 + i * (R0 * 2 - 12) / 17; c.fillStyle = `rgba(255,${120 + 100 * H1(i) | 0},40,${.4 + .6 * H1(i + Math.floor(t * 12))})`; c.fillRect(ex - 2 + H1(i * 3) * 10, yy, 6, 4) }
    c.globalCompositeOperation = 'source-over'; c.restore();
    const sx = cx + Math.cos(ang) * (Lc / 2 - 10), sy = cy + Math.sin(ang) * (Lc / 2 - 10);
    smoke(c, t, sx, sy - 10, { n: 34, life: 4.2, rise: 660, sway: 120, drift: -170, r0: 30, r1: 270, a: .45, seed: 61 });
    smoke(c, t, sx, sy - 10, { n: 20, life: 1.8, rise: 220, sway: 30, drift: -30, r0: 10, r1: 70, a: .55, seed: 67 });
    glowDot(c, sx, sy, 220, '#ff6a20', .55 * fl);
    c.restore();
    dust(c, t, 1500, -220, .5, .55, 1500, 100, 63, .7);
  }
  const HEADP = 'M-120 160C-150 90 -170 20 -160 -60C-150 -170 -60 -230 40 -220C140 -210 190 -140 190 -50C190 -20 200 0 225 40C232 52 222 62 205 62C200 90 205 110 190 120C180 130 170 140 172 160C175 185 150 200 110 195L70 190L70 260L-120 260Z';
  const AIRP = 'M196 92C160 96 122 102 98 122C78 140 68 170 66 200L64 262';
  function wave(c, x, y, w, h, t, f, col, lw = 3) { c.save(); c.strokeStyle = col; c.lineWidth = lw; c.shadowColor = col; c.shadowBlur = 10; c.beginPath(); for (let i = 0; i <= 160; i++) { const xx = x + i * w / 160, v = f(i / 160); i ? c.lineTo(xx, y + h / 2 - v * h / 2) : c.moveTo(xx, y + h / 2 - v * h / 2) } c.stroke(); c.restore() }
  function panel(c, x, y, w, h, title, col = C.ice) { c.save(); c.fillStyle = 'rgba(4,10,20,.72)'; c.fillRect(x, y, w, h); c.strokeStyle = rgba(col, .45); c.lineWidth = 1.5; c.strokeRect(x + .75, y + .75, w - 1.5, h - 1.5); c.fillStyle = col; c.fillRect(x, y, w, 3); tx(c, title, x + 18, y + 32, { f: 'J', w: 500, s: 19, ls: 4, al: 'left', c: rgba(col, .9) }); c.restore() }
  function throat(c, t, u, o) {
    c.fillStyle = '#020611'; c.fillRect(0, 0, WW, HH); grid(c, 48, .05, '#7fd8ff');
    c.fillStyle = rg(c, 900, 520, 50, 900, [[0, 'rgba(20,70,130,.35)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, WW, HH);
    const irr = o.calm ? 0 : cl((t - o.irr0) / .8) * (.75 + .25 * Math.sin(t * 8)), zk = o.zoom != null ? eio(cl((t - o.zoom) / .6)) : 0;
    c.save(); view(c, lp(1, 2.3, zk), lp(WW / 2, 905, zk), lp(HH / 2, 645, zk));
    c.save(); c.translate(820, 560); c.scale(1.7, 1.7);
    const hp = new Path2D(HEADP), air = new Path2D(AIRP);
    c.fillStyle = rg(c, 20, -40, 20, 320, [[0, 'rgba(50,120,180,.4)'], [1, 'rgba(10,30,60,.7)']]); c.fill(hp);
    c.strokeStyle = 'rgba(160,225,255,.9)'; c.lineWidth = 2.2; c.shadowColor = '#6fd0ff'; c.shadowBlur = 16; c.stroke(hp); c.shadowBlur = 0;
    c.strokeStyle = 'rgba(210,240,255,.3)'; c.lineWidth = 5; c.beginPath(); c.ellipse(10, -80, 150, 122, -.15, Math.PI * .92, Math.PI * 2.12); c.stroke();
    c.beginPath(); c.moveTo(120, 140); c.quadraticCurveTo(150, 175, 105, 185); c.stroke();
    for (let i = 0; i < 6; i++) { c.fillStyle = 'rgba(210,240,255,.22)'; rr(c, -96, 36 + i * 37, 52, 28, 8); c.fill() }
    c.globalCompositeOperation = 'screen'; c.lineCap = 'round';
    c.strokeStyle = `rgba(255,${210 - 160 * irr | 0},${210 - 180 * irr | 0},.8)`; c.lineWidth = 22 * (1 + .08 * Math.sin(t * 11) * irr); c.stroke(air);
    c.lineWidth = 8; c.strokeStyle = 'rgba(255,255,255,.45)'; c.stroke(air);
    glowDot(c, 66, 180, 130 * (1 + .2 * Math.sin(t * 7)), '#ff2a2a', irr * .95);
    for (let i = 0; i < 26; i++) { const ph = (t * .9 + H1(i * 3.1)) % 1, px = lp(250, 70, ph) + Math.sin(i + t * 3) * 6, py = ph < .55 ? lp(92 + (H1(i) - .5) * 30, 120, ph / .55) : lp(125, 250, (ph - .55) / .45); c.globalAlpha = (o.calm ? .3 : .55) * Math.sin(Math.PI * ph); c.fillStyle = o.calm ? '#ffffff' : '#c9c2b8'; c.beginPath(); c.arc(px, py, (o.calm ? 6 : 2.5) + 3 * H1(i * 7), 0, TAU); c.fill() }
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.restore();
    if (irr > .05) { const bl = .5 + .5 * Math.sin(t * 10); c.save(); c.strokeStyle = `rgba(255,50,50,${.5 + .5 * bl})`; c.lineWidth = 4; c.setLineDash([22, 12]); c.strokeRect(900, 750, 190, 190); c.setLineDash([]); c.restore() }
    c.restore();
    // медицинский HUD
    panel(c, 120, 170, 470, 190, 'ЧСС'); wave(c, 140, 220, 430, 110, t, x => { const ph = (x * 3 + t * 1.6) % 1; return ph < .06 ? Math.sin(ph / .06 * Math.PI) * (ph < .03 ? 1 : -.4) : Math.sin(ph * 30) * .03 }, C.green);
    tx(c, `${Math.round(78 + 26 * irr)}`, 560, 210, { f: 'J', w: 700, s: 28, al: 'right', c: C.green });
    if (o.calm) { panel(c, 1330, 170, 470, 190, L.cough, C.green); wave(c, 1350, 220, 430, 110, t, x => Math.sin(x * 9 + t * 2) * .06, C.green); panel(c, 1330, 390, 470, 92, L.calm[0], C.green); tx(c, L.calm[1], 1350, 462, { f: 'U', w: 700, s: 26, al: 'left', c: '#7dffa0' }); return }
    panel(c, 1330, 170, 470, 190, L.cough, C.red); wave(c, 1350, 220, 430, 110, t, x => { const sp = H1(Math.floor(x * 40 + t * 22)); return (sp > .7 ? (sp - .7) * 3.3 : 0) * (.25 + irr) * (H1(Math.floor(x * 40 + t * 22) * 3) > .5 ? 1 : -1) }, '#ff5a5a');
    if (irr > .05) { const bl = .5 + .5 * Math.sin(t * 10); c.save(); c.globalAlpha = .6 + .4 * bl; panel(c, 1330, 390, 470, 92, L.warn, C.red); tx(c, L.irr, 1350, 462, { f: 'U', w: 700, s: 26, al: 'left', c: '#fff' }); c.restore() }
  }
  function labShelves() {
    return cache('labSh', WW * 1.3, 860, (x, W, H) => {
      const t0 = mk(W, H), y = t0.getContext('2d'); y.fillStyle = '#05080d'; y.fillRect(0, 0, W, H);
      for (let r = 0; r < 4; r++) {
        const sy = 150 + r * 200; y.fillStyle = '#1b2331'; y.fillRect(0, sy, W, 10);
        for (let i = 0; i < 44; i++) { const bx = 10 + i * 58 + H1(r * 40 + i) * 18, bh = 60 + H1(r * 9 + i * 3) * 95, bw = 24 + H1(i * 7 + r) * 30, col = ['#3fd3c6', '#ffb54a', '#8fd6ff', '#ff6a5a', '#b4ff8a'][(i + r) % 5];
          y.fillStyle = rgba(col, .16 + .28 * H1(i * 3 + r)); rr(y, bx, sy - bh, bw, bh, 6); y.fill(); y.fillStyle = 'rgba(255,255,255,.2)'; y.fillRect(bx + 4, sy - bh + 6, 3, bh - 12) }
      }
      x.filter = 'blur(11px)'; x.drawImage(t0, 0, 0);
    });
  }
  const FLASK = 'M-60 -420L-60 -300L-200 -22Q-210 0 -184 0L184 0Q210 0 200 -22L60 -300L60 -420Z';
  function flask(c, x, y, s, t, o) {
    c.save(); c.translate(x, y); c.scale(s, s);
    const body = new Path2D(FLASK), lv = -(o.level ?? .45) * 300;
    c.save(); c.clip(body);
    c.fillStyle = lg(c, 0, lv, 0, 0, [[0, rgba(o.col, .8)], [1, rgba(o.col2 || o.col, .95)]]); c.beginPath(); c.moveTo(-260, lv);
    for (let i = 0; i <= 30; i++) c.lineTo(-260 + i * 520 / 30, lv + Math.sin(t * 4 + i * .8) * (o.wave || 3)); c.lineTo(260, 10); c.lineTo(-260, 10); c.fill();
    if (o.swirl) { c.strokeStyle = rgba(o.col2 || '#fff', .5 * o.swirl); c.lineWidth = 4; for (let i = 0; i < 5; i++) { c.beginPath(); for (let j = 0; j <= 40; j++) { const a = j / 40 * TAU * 1.4 + t * 2.4 + i * 1.3, rr0 = 40 + j * 3.2; const px = Math.cos(a) * rr0, py = lv + 40 + j * 4 + Math.sin(a) * 18; j ? c.lineTo(px, py) : c.moveTo(px, py) } c.stroke() } }
    for (let i = 0; i < 16; i++) { const ph = (H1(i * 2.7) + t * (.25 + .3 * H1(i))) % 1, bx = (H1(i * 5.1) - .5) * 260, by = lp(-10, lv + 8, ph); c.strokeStyle = `rgba(255,255,255,${.5 * Math.sin(Math.PI * ph)})`; c.lineWidth = 2; c.beginPath(); c.arc(bx, by, 3 + 5 * H1(i), 0, TAU); c.stroke() }
    if (o.ripple != null) { const k = o.ripple; if (k > 0 && k < 1) { c.strokeStyle = `rgba(255,255,255,${.7 * (1 - k)})`; c.lineWidth = 3; c.beginPath(); c.ellipse(0, lv, 20 + 160 * k, 6 + 30 * k, 0, 0, TAU); c.stroke() } }
    c.restore();
    c.fillStyle = 'rgba(180,220,255,.06)'; c.fill(body); c.strokeStyle = 'rgba(205,235,255,.6)'; c.lineWidth = 3; c.stroke(body);
    c.globalCompositeOperation = 'screen'; c.fillStyle = 'rgba(255,255,255,.32)'; poly(c, [-44, -410, -36, -410, -36, -300, -150, -40, -168, -40, -44, -300]); c.fill();
    c.fillStyle = 'rgba(255,255,255,.12)'; poly(c, [150, -60, 170, -60, 60, -290, 50, -290]); c.fill();
    c.restore();
  }
  function burette(c, x, y0, y1, t) { // трубка сверху до y1, кран
    c.save(); c.fillStyle = 'rgba(180,220,255,.08)'; c.fillRect(x - 16, y0, 32, y1 - y0); c.strokeStyle = 'rgba(205,235,255,.55)'; c.lineWidth = 2.5; c.strokeRect(x - 16, y0, 32, y1 - y0);
    c.fillStyle = 'rgba(255,240,180,.35)'; c.fillRect(x - 13, y0, 26, (y1 - y0) * .7);
    for (let i = 0; i < 10; i++) { c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(x - 16, y0 + 30 + i * 30, 10, 2) }
    c.fillStyle = '#20262f'; c.fillRect(x - 40, y1 - 6, 80, 16); c.fillStyle = '#8a95a6'; c.fillRect(x - 6, y1, 12, 40); c.restore();
  }
  function labWorld(c, t, o = {}) {
    c.fillStyle = '#04070c'; c.fillRect(-400, -400, WW + 800, HH + 800);
    c.drawImage(labShelves(), -260, -120);
    beam(c, 960, -200, 0, .5, 1300, '#d6ecff', .9);
    poly(c, [-400, 760, WW + 400, 760, WW + 900, HH + 400, -900, HH + 400]); c.fillStyle = lg(c, 0, 760, 0, HH, [[0, '#121a24'], [1, '#05080c']]); c.fill();
    c.fillStyle = 'rgba(170,210,255,.14)'; c.fillRect(-400, 758, WW + 800, 2);
    pool(c, 960, 860, 520, 110, '#cfe6ff', .55);
    // штатив с колбой слева, пробирки справа
    c.save(); c.fillStyle = '#1d2430'; c.fillRect(470, 300, 10, 520); c.fillRect(380, 815, 200, 14); c.restore();
    c.save(); c.translate(520, 560); c.strokeStyle = 'rgba(205,235,255,.45)'; c.lineWidth = 2.5; c.fillStyle = 'rgba(120,255,200,.18)'; c.beginPath(); c.arc(0, 60, 110, 0, TAU); c.fill(); c.stroke(); c.fillRect(-22, -120, 44, 80); c.strokeRect(-22, -120, 44, 80); c.restore();
    for (let i = 0; i < 6; i++) { const tx0 = 1330 + i * 52, col = ['#ff6a5a', '#ffb54a', '#3fd3c6', '#8fd6ff', '#b4ff8a', '#ffb54a'][i]; c.fillStyle = rgba(col, .45); rr(c, tx0, 600, 30, 170, [0, 0, 15, 15]); c.fill(); c.strokeStyle = 'rgba(205,235,255,.5)'; c.lineWidth = 2; rr(c, tx0, 560, 30, 210, [0, 0, 15, 15]); c.stroke() }
    c.fillStyle = '#1d2430'; c.fillRect(1310, 690, 330, 14);
    // бюретка и капли
    burette(c, 960, -40, 320, t);
    const mix = o.mix ?? 0, lvY = 820 - (o.level ?? .45) * 300 * 1.15;
    for (let i = 0; i < 4; i++) { const ph = ((t * 1.6 + i / 4) % 1); if (ph > .7) continue; const dy = lp(372, lvY, (ph / .7) ** 2); c.fillStyle = 'rgba(255,250,230,.9)'; c.beginPath(); c.ellipse(960, dy, 7, 10, 0, 0, TAU); c.fill(); glowDot(c, 960, dy, 30, '#fff4d0', .4) }
    const rip = ((t * 1.6) % 1 - .7) / .3;
    flask(c, 960, 820, 1.15, t, { col: mix > .5 ? '#ffd27a' : '#ff9a3a', col2: '#c85a10', level: o.level ?? .45, swirl: o.swirl || 0, ripple: rip, wave: 2 });
    c.save(); c.translate(960, 820); c.scale(1, -.4); c.globalAlpha = .12; c.translate(-960, -820); flask(c, 960, 820, 1.15, t, { col: '#ff9a3a', level: .45 }); c.restore();
    dust(c, t, 960, -200, 0, .5, 1300, 120, 71, .7);
  }
  let LABB = null;
  function labBlur() { if (!LABB) { const s = mk(WW, HH), x = s.getContext('2d'); labWorld(x, 3); LABB = mk(WW, HH); const y = LABB.getContext('2d'); y.filter = 'blur(22px)'; y.drawImage(s, 0, 0) } return LABB }
  function crystals(c, t, u, o) {
    c.fillStyle = '#05060a'; c.fillRect(0, 0, WW, HH);
    c.save(); c.filter = 'blur(4px)'; c.drawImage(bokeh('cry', WW * 1.2, HH * 1.2, 60, ['#ffcf7a', '#8fd6ff', '#ffffff'], 24, 90, 31), -WW * .1 + u * 10, -HH * .1); c.restore();
    beam(c, 960, -260, 0, .6, 1500, '#fff0cf', .7);
    const L0 = [[960, 640, 150, 0], [780, 700, 95, .12], [1150, 690, 105, .2], [880, 560, 70, .28], [1060, 545, 78, .34], [680, 770, 60, .4], [1260, 780, 64, .46], [960, 470, 52, .52], [820, 470, 40, .58], [1110, 430, 44, .64], [600, 690, 38, .7], [1330, 650, 42, .76]];
    c.save(); view(c, 1 + u * .06, 960, 600);
    pool(c, 960, 800, 600, 120, '#ffd99a', .5);
    for (const [x, y, s, d] of L0.slice().sort((a, b) => a[1] - b[1])) {
      const k = spr(cl((u - d) / .7)); if (k <= 0) continue; const z = s * k, h = .87;
      glowDot(c, x, y, z * 2.6, '#ffc35a', .35 * k);
      poly(c, [x, y - z, x + z * h, y - z * .5, x, y, x - z * h, y - z * .5]); c.fillStyle = 'rgba(255,244,214,.92)'; c.fill();
      poly(c, [x - z * h, y - z * .5, x, y, x, y + z, x - z * h, y + z * .5]); c.fillStyle = 'rgba(232,186,112,.85)'; c.fill();
      poly(c, [x, y, x + z * h, y - z * .5, x + z * h, y + z * .5, x, y + z]); c.fillStyle = 'rgba(170,108,52,.85)'; c.fill();
      c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1.5; poly(c, [x, y - z, x + z * h, y - z * .5, x + z * h, y + z * .5, x, y + z, x - z * h, y + z * .5, x - z * h, y - z * .5]); c.stroke();
      const g0 = ((t * .5 + H1(x)) % 1.6) - .3; if (g0 > 0 && g0 < 1) { c.save(); poly(c, [x, y - z, x + z * h, y - z * .5, x + z * h, y + z * .5, x, y + z, x - z * h, y + z * .5, x - z * h, y - z * .5]); c.clip(); c.globalCompositeOperation = 'screen'; c.fillStyle = 'rgba(255,255,255,.55)'; c.translate(x - z + g0 * 2 * z, y); c.rotate(.5); c.fillRect(-6, -z * 2, 12, z * 4); c.restore() }
    }
    c.restore();
    dust(c, t, 960, -260, 0, .6, 1500, 140, 33, .9);
  }
  function phPanel(c, t, u, o) {
    c.drawImage(labBlur(), 0, 0); c.fillStyle = 'rgba(2,5,10,.5)'; c.fillRect(0, 0, WW, HH);
    const x0 = 330, y0 = 330, w = 1260, k = eio(cl((t - o.soft0) / .9));
    panel(c, x0 - 40, y0 - 120, w + 80, 300, L.ph[0]);
    const g = c.createLinearGradient(x0, 0, x0 + w, 0); [['#e53935', 0], ['#ff7a1a', .2], ['#ffd23a', .35], ['#4cd06a', .5], ['#26c6da', .65], ['#3f51b5', .82], ['#7b1fa2', 1]].forEach(([col, p]) => g.addColorStop(p, col));
    c.fillStyle = g; rr(c, x0, y0, w, 30, 15); c.fill();
    for (let i = 0; i <= 14; i++) { c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(x0 + i * w / 14 - 1, y0 + 38, 2, i % 7 ? 10 : 18) }
    tx(c, L.ph[1], x0, y0 + 88, { f: 'J', w: 500, s: 20, ls: 3, al: 'left', c: 'rgba(255,190,150,.9)' }); tx(c, L.ph[2], x0 + w, y0 + 88, { f: 'J', w: 500, s: 20, ls: 3, al: 'right', c: 'rgba(200,170,255,.9)' });
    const mx = x0 + w * lp(.78, .36, k); c.fillStyle = '#fff'; poly(c, [mx, y0 - 8, mx - 16, y0 - 34, mx + 16, y0 - 34]); c.fill(); c.fillRect(mx - 1.5, y0 - 8, 3, 46);
    const lab = k < .5 ? L.ph[3] : L.ph[4], lc = k < .5 ? '#c08cff' : '#7dffa0'; tx(c, lab, mx, y0 - 50, { f: 'U', w: 700, s: 30, c: lc, glow: lc, gb: 14 });
    // доза
    const dk = eo(cl((t - o.dose0) / .7)), gx = 640, gy = 800, R = 160;
    panel(c, gx - 230, gy - 230, 460, 300, L.dose[0], C.amber);
    c.save(); c.lineWidth = 18; c.lineCap = 'round'; c.strokeStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.arc(gx, gy, R, Math.PI, TAU); c.stroke();
    c.strokeStyle = lg(c, gx - R, 0, gx + R, 0, [[0, '#4cd06a'], [.6, '#ffd23a'], [1, '#ff3d3d']]); c.beginPath(); c.arc(gx, gy, R, Math.PI, Math.PI + Math.PI * lp(.15, .97, dk)); c.stroke();
    const na = Math.PI + Math.PI * lp(.15, .97, dk) + (dk > .9 ? Math.sin(t * 40) * .02 : 0); c.strokeStyle = '#fff'; c.lineWidth = 6; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + Math.cos(na) * (R - 30), gy + Math.sin(na) * (R - 30)); c.stroke(); c.restore();
    tx(c, dk > .9 ? L.dose[1] : '', gx, gy - 40, { f: 'U', w: 800, s: 34, c: '#ff5a4a', glow: '#ff3d3d' });
    panel(c, 1180, 600, 520, 160, L.breath[0], C.green); tx(c, L.breath[1], 1200, 710, { f: 'U', w: 700, s: 40, al: 'left', c: k > .5 ? '#7dffa0' : 'rgba(255,255,255,.35)', glow: k > .5 ? '#47e38a' : null, gb: 16 });
  }

  // ================= СЦЕНА 4: архив — 3D-коридор, ящик, сейф, стена ячеек =================
  const CW2 = 470, CH2 = 330, CZ = 7200, CF = 860, CROWS = 8, CDZ = 125;
  const cprj = (x, y, z, cz) => { const d = z - cz; if (d < 1) return null; const k = CF / d; return [WW / 2 + x * k, HH / 2 + y * k, k] };
  const lampsZ = [700, 1500, 2300, 3100, 3900, 4700, 5500, 6300];
  function lampI(z, on) { let s = 0; lampsZ.forEach((lz, i) => { s += on(i) * Math.exp(-Math.pow((z - lz) / 330, 2)) }); return s }
  function quad(c, P) { if (P.some(p => !p)) return false; c.beginPath(); c.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) c.lineTo(P[i][0], P[i][1]); c.closePath(); return true }
  function vaultDoor(c, cz, t, open, spin) {
    const p = cprj(0, 0, CZ, cz); if (!p) return; const [x, y, k] = p, R = 300 * k;
    if (open > 0) { glowDot(c, x, y, R * 3.2, '#fff1d2', open * 1.4); c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = `rgba(255,245,225,${open})`; c.beginPath(); c.arc(x, y, R, 0, TAU); c.fill(); c.restore() }
    c.save(); c.translate(x - R * (1 - Math.cos(open * 1.25)), y); c.scale(Math.cos(open * 1.25), 1);
    c.fillStyle = rg(c, -R * .3, -R * .3, R * .1, R * 1.1, [[0, '#6b7686'], [.6, '#3a4250'], [1, '#1a1f27']]); c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.6)'; c.lineWidth = Math.max(1, 6 * k); for (const r of [.92, .7, .38]) { c.beginPath(); c.arc(0, 0, R * r, 0, TAU); c.stroke() }
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; c.fillStyle = '#8f9aab'; c.beginPath(); c.arc(Math.cos(a) * R * .82, Math.sin(a) * R * .82, Math.max(1.5, 9 * k), 0, TAU); c.fill() }
    c.rotate(spin); c.strokeStyle = '#a7b2c2'; c.lineWidth = Math.max(2, 16 * k); c.lineCap = 'round'; for (let i = 0; i < 3; i++) { const a = i / 3 * TAU; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * R * .34, Math.sin(a) * R * .34); c.stroke() }
    c.fillStyle = '#c3ccd8'; c.beginPath(); c.arc(0, 0, R * .08, 0, TAU); c.fill();
    c.restore();
  }
  function corridor(c, t, o) {
    const cz = o.cz, lon = o.lamps || (() => 1), op = o.open || (() => 0);
    c.fillStyle = '#020204'; c.fillRect(0, 0, WW, HH);
    const e = cprj(CW2, CH2, CZ, cz); if (e) { const ex = e[0] - WW / 2, ey = e[1] - HH / 2; c.fillStyle = '#0b0c10'; c.fillRect(WW / 2 - ex, HH / 2 - ey, ex * 2, ey * 2) }
    vaultDoor(c, cz, t, o.door ? o.door(t) : 0, o.spin ? o.spin(t) : 0);
    const nz = Math.ceil(CZ / CDZ);
    for (let zi = nz - 1; zi >= 0; zi--) {
      const z0 = zi * CDZ, z1 = z0 + CDZ; if (z1 <= cz + 30) continue; const za = Math.max(z0, cz + 30), zm = (z0 + z1) / 2;
      const fog = Math.exp(-(zm - cz) / 2600), li = lampI(zm, lon), base = 16 + 30 * li;
      // пол и потолок
      for (const yy of [CH2, -CH2]) { if (quad(c, [cprj(-CW2, yy, za, cz), cprj(CW2, yy, za, cz), cprj(CW2, yy, z1, cz), cprj(-CW2, yy, z1, cz)])) { const v = (yy > 0 ? 14 + 40 * li : 8 + 10 * li) * fog; c.fillStyle = `rgb(${v * 1.5 | 0},${v * .7 | 0},${v * .7 | 0})`; c.fill() } }
      for (const sd of [-1, 1]) for (let r = 0; r < CROWS; r++) {
        const y0 = -CH2 + r * 2 * CH2 / CROWS, y1 = y0 + 2 * CH2 / CROWS, ok = op(zi, r, sd), xw = sd * (CW2 - 46 * ok);
        if (ok > 0 && quad(c, [cprj(sd * CW2, y0, za, cz), cprj(xw, y0, za, cz), cprj(xw, y0, z1, cz), cprj(sd * CW2, y0, z1, cz)])) { c.fillStyle = `rgba(230,220,200,${.6 * fog})`; c.fill() }
        if (!quad(c, [cprj(xw, y0, za, cz), cprj(xw, y1, za, cz), cprj(xw, y1, z1, cz), cprj(xw, y0, z1, cz)])) continue;
        const sh = .75 + .25 * H1(zi * 13 + r * 7 + sd), v = base * sh * fog;
        c.fillStyle = `rgb(${v * 1.25 + 30 * li * fog | 0},${v * .95 | 0},${v * 1.05 | 0})`; c.fill();
        c.strokeStyle = `rgba(0,0,0,${.7 * fog + .2})`; c.lineWidth = 1.2; c.stroke();
        const pm = cprj(xw, (y0 + y1) / 2, zm, cz); if (pm && pm[2] > .35) { const s0 = pm[2]; c.fillStyle = `rgba(225,215,190,${.55 * fog})`; c.fillRect(pm[0] - 9 * s0, pm[1] - 14 * s0, 18 * s0, 10 * s0); c.fillStyle = `rgba(0,0,0,${.6 * fog})`; c.fillRect(pm[0] - 12 * s0, pm[1] + 6 * s0, 24 * s0, 5 * s0) }
      }
    }
    for (let i = lampsZ.length - 1; i >= 0; i--) {
      const lz = lampsZ[i], on = lon(i); if (lz <= cz + 60 || on <= 0) continue; const p = cprj(0, -CH2 + 6, lz, cz); if (!p) continue;
      const len = Math.round(2 * CH2 * p[2] / 60) * 60 + 60; beam(c, p[0], p[1], 0, .9, len, '#ff4a3a', .55 * on * Math.exp(-(lz - cz) / 3600));
      c.fillStyle = `rgba(255,120,100,${on})`; c.fillRect(p[0] - 60 * p[2], p[1] - 4 * p[2], 120 * p[2], 8 * p[2]); glowDot(c, p[0], p[1], 90 * p[2], '#ff3a2a', on * .8);
    }
    for (let i = 0; i < 14; i++) { const pz = 500 + H1(i * 3.3) * 5200, px = (H1(i * 7.7) - .5) * 700, a = H1(i) * 3, w0 = 70, h0 = 95; const P = [[-w0, -h0], [w0, -h0], [w0, h0], [-w0, h0]].map(([dx, dz]) => cprj(px + dx * Math.cos(a) - dz * Math.sin(a), CH2 - 1, pz + dx * Math.sin(a) + dz * Math.cos(a), cz)); if (quad(c, P)) { c.fillStyle = `rgba(215,205,185,${.5 * Math.exp(-(pz - cz) / 2600)})`; c.fill() } }
    if (o.dust) dust(c, t, WW / 2, -100, 0, 1.2, 1300, 160, 81, .8);
  }
  function drawer(c, t, u, o) {
    c.fillStyle = '#030305'; c.fillRect(0, 0, WW, HH);
    const close = eio(cl((t - o.close) / .7)), fold = eio(cl(u / .9));
    c.save(); view(c, 1 + u * .03, 960, 560);
    for (let r = -2; r <= 2; r++) for (let k = -3; k <= 3; k++) { const x = 960 + k * 470, y = 560 + r * 300; c.fillStyle = (r || k) ? '#1d2129' : '#262b35'; rr(c, x - 225, y - 140, 450, 280, 10); c.fill(); c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(x - 70, y + 70, 140, 18); c.fillStyle = 'rgba(225,215,190,.5)'; c.fillRect(x - 60, y - 100, 120, 44) }
    const dep = 240 * (1 - close), fx = 960, fy = 560 + dep * .25;
    if (dep > 2) { poly(c, [fx - 225, fy - 140 - dep * .6, fx + 225, fy - 140 - dep * .6, fx + 225, fy - 140, fx - 225, fy - 140]); c.fillStyle = '#0a0b0e'; c.fill();
      c.save(); poly(c, [fx - 225, fy - 140 - dep * .6, fx + 225, fy - 140 - dep * .6, fx + 225, fy - 140, fx - 225, fy - 140]); c.clip(); const py = lp(fy - 520, fy - 150, fold); c.fillStyle = '#c99a4e'; c.fillRect(fx - 190, py - 300, 380, 320); c.fillStyle = '#e8d9b0'; c.fillRect(fx - 170, py - 330, 300, 40); c.restore() }
    if (fold < 1) { const py = lp(fy - 520, fy - 150, fold); c.save(); c.beginPath(); c.rect(0, 0, WW, fy - 140 - dep * .6); c.clip(); c.fillStyle = '#c99a4e'; c.fillRect(fx - 190, py - 300, 380, 320); tx(c, L.project, fx, py - 180, { f: 'J', w: 700, s: 30, ls: 4, c: '#3a2410' }); c.restore() }
    c.fillStyle = lg(c, 0, fy - 140, 0, fy + 140, [[0, '#4a5262'], [1, '#262b35']]); rr(c, fx - 225, fy - 140, 450, 280, 10); c.fill();
    c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(fx - 70, fy + 70, 140, 18); c.fillStyle = '#e8e0c8'; c.fillRect(fx - 90, fy - 100, 180, 56); tx(c, L.project, fx, fy - 62, { f: 'J', w: 700, s: 22, ls: 2, c: '#2a2218' });
    beam(c, 960, -300, 0, .7, 1400, '#ff5a46', .55); pool(c, 960, 600, 600, 300, '#ff5a46', .25);
    if (o.stampT != null) stamp(c, L.archive, fx, fy + 10, -.1, t, o.stampT, '#ff3b3b', 50);
    c.restore();
  }
  function cellsWall(c, t, u, o) {
    const base = cache('cells', WW + 200, HH + 200, (x, W, H) => { x.fillStyle = '#05060a'; x.fillRect(0, 0, W, H); for (let r = 0; r < 22; r++) for (let k = 0; k < 40; k++) { const cx = 10 + k * 53, cy = 10 + r * 56, s = .75 + .25 * H1(r * 40 + k); x.fillStyle = `rgb(${30 * s | 0},${34 * s | 0},${42 * s | 0})`; rr(x, cx, cy, 47, 50, 4); x.fill(); x.fillStyle = 'rgba(220,210,185,.4)'; x.fillRect(cx + 12, cy + 9, 23, 9); x.fillStyle = 'rgba(0,0,0,.6)'; x.fillRect(cx + 14, cy + 34, 19, 5) } });
    const s = lp(1.12, 1, eo(u / 2.4)); c.save(); c.translate(WW / 2, HH / 2); c.scale(s, s); c.translate(-WW / 2 - 100, -HH / 2 - 100); c.drawImage(base, 0, 0);
    const R = (t - o.wave0) * 1500, ox = WW / 2 + 100, oy = HH / 2 + 100;
    c.globalCompositeOperation = 'screen';
    for (let r = 0; r < 22; r++) for (let k = 0; k < 40; k++) { const cx = 10 + k * 53 + 23, cy = 10 + r * 56 + 25, d = Math.hypot(cx - ox, cy - oy), f = R - d; if (f < 0) continue; const a = f < 140 ? 1 - f / 140 * .6 : .4 * (.6 + .4 * Math.sin(t * 3 + r * k)); c.fillStyle = `rgba(255,${170 + 60 * H1(r * 40 + k) | 0},90,${a * .55})`; rr(c, cx - 23, cy - 25, 47, 50, 4); c.fill() }
    c.restore(); c.globalCompositeOperation = 'source-over';
    c.fillStyle = rg(c, WW / 2, HH / 2, 120, 900, [[0, 'rgba(0,0,0,.65)'], [.5, 'rgba(0,0,0,.25)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, WW, HH);
    const n = Math.round(14e6 * eo(cl((t - o.count0) / 1.6)) / 1000) * 1000, ns = n.toLocaleString('en-US').replace(/,/g, ' ');
    tx(c, ns, WW / 2, HH / 2 + 40, { f: 'U', w: 800, s: 150, c: '#fff', glow: '#ffb54a', gb: 40 });
    tx(c, L.docs, WW / 2, HH / 2 + 120, { f: 'J', w: 700, s: 34, ls: 14, c: C.amber });
  }

  // ================= СЦЕНА 5: карта, архив в сети, чертёж, флешка =================
  function mapDots(name, step) {
    const M = window.V15MAP[name];
    return cache('map' + name, M.nx * step, M.ny * step, (x) => {
      for (let j = 0; j < M.ny; j++) { const row = M.rows[j]; for (let i = 0; i < M.nx; i++) if (row[i] === '1') {
        const h = H2(i + 3, j + 5), r = step * (.2 + .1 * h);
        x.fillStyle = h > .965 ? 'rgba(255,80,70,.95)' : `rgba(${60 + 70 * h | 0},${120 + 80 * h | 0},${185 + 60 * h | 0},${.5 + .4 * h})`;
        x.beginPath(); x.arc((i + .5) * step, (j + .5) * step, r, 0, TAU); x.fill();
      } }
    });
  }
  function mapScene(c, t, u, o) {
    const M = window.V15MAP, z = cl(o.z(t)), ST = 7, ratio = M.CA.deg / M.BAY.deg, ze = eio(z);
    c.fillStyle = '#02060e'; c.fillRect(0, 0, WW, HH);
    const ca = mapDots('CA', ST), bay = mapDots('BAY', ST);
    const bu = M.BAY.at.ucsf.map(v => (v + .5) * ST), bs = M.BAY.at.stanford.map(v => (v + .5) * ST), cu = M.CA.at.ucsf.map(v => (v + .5) * ST);
    const caX = bu[0] - cu[0] * ratio, caY = bu[1] - cu[1] * ratio, sc0 = 930 / (ca.height * ratio), sc = Math.exp(lp(Math.log(sc0), Math.log(1.02), ze));
    const f0 = [caX + ca.width * ratio * .46, caY + ca.height * ratio * .52], f1 = [(bu[0] + bs[0]) / 2 + 60, (bu[1] + bs[1]) / 2 - 10], fk = Math.pow(ze, .55);
    const fx = lp(f0[0], f1[0], fk), fy = lp(f0[1], f1[1], fk), S2 = (x, y) => [WW / 2 + (x - fx) * sc, HH / 2 + (y - fy) * sc];
    grid(c, 96, .07, '#7fb8ff');
    c.save(); c.translate(WW / 2, HH / 2); c.scale(sc, sc); c.translate(-fx, -fy);
    let a = 1 - ss(.3, .62, z); if (a > 0) { c.globalAlpha = a; c.drawImage(ca, caX, caY, ca.width * ratio, ca.height * ratio) }
    a = ss(.25, .58, z); if (a > 0) { c.globalAlpha = a; c.drawImage(bay, 0, 0) }
    c.restore(); c.globalAlpha = 1;
    if (z < .5) { const [lx, ly] = S2(caX + ca.width * ratio * .62, caY + ca.height * ratio * .48); tx(c, L.map[0], lx, ly, { f: 'J', w: 700, s: 40, ls: 18, c: 'rgba(200,225,255,.75)', a: 1 - ss(.2, .5, z) }); const [ox, oy] = S2(caX + ca.width * ratio * .12, caY + ca.height * ratio * .66); tx(c, L.map[1], ox, oy, { f: 'J', w: 500, s: 26, ls: 12, c: 'rgba(140,180,230,.45)', a: 1 - ss(.2, .5, z) }) }
    const [ux, uy] = S2(...bu), [sx, sy] = S2(...bs), pu = (t * 1.2) % 1;
    const node = (x, y, col, k) => { if (k <= 0) return; c.save(); c.strokeStyle = col; c.globalAlpha = k * (1 - pu); c.lineWidth = 3; c.beginPath(); c.arc(x, y, 12 + pu * 60, 0, TAU); c.stroke(); c.globalAlpha = k; c.fillStyle = col; c.beginPath(); c.arc(x, y, 9, 0, TAU); c.fill(); c.restore(); glowDot(c, x, y, 70, col, .8 * k) };
    node(ux, uy, '#ff4a3a', cl((t - o.n1) / .3));
    const ak = o.arc ? eio(cl((t - o.arc) / .9)) : 0, mx = (ux + sx) / 2 + 160, my = (uy + sy) / 2 - 60;
    if (ak > 0) {
      c.save(); c.strokeStyle = '#ffb54a'; c.lineWidth = 4; c.shadowColor = '#ffb54a'; c.shadowBlur = 18; c.setLineDash([]); c.beginPath(); c.moveTo(ux, uy);
      for (let i = 1; i <= 40; i++) { const k = i / 40 * ak, x = (1 - k) * (1 - k) * ux + 2 * k * (1 - k) * mx + k * k * sx, y = (1 - k) * (1 - k) * uy + 2 * k * (1 - k) * my + k * k * sy; c.lineTo(x, y) } c.stroke(); c.restore();
      if (o.docs) for (let i = 0; i < 6; i++) { const k = ((t - o.docs) * .55 + i / 6) % 1; if (t < o.docs) break; const x = (1 - k) * (1 - k) * ux + 2 * k * (1 - k) * mx + k * k * sx, y = (1 - k) * (1 - k) * uy + 2 * k * (1 - k) * my + k * k * sy; c.save(); c.translate(x, y); c.rotate(k * 3); c.fillStyle = 'rgba(240,230,205,.95)'; c.fillRect(-11, -14, 22, 28); c.fillStyle = 'rgba(60,50,40,.6)'; for (let r = 0; r < 4; r++) c.fillRect(-7, -9 + r * 6, 14, 2); c.restore() }
      node(sx, sy, '#ffd27a', cl((t - o.arc - .7) / .3));
    }
    const lab = (x, y, t1, t2, t3, k, side) => { if (k <= 0) return; const w = Math.max(tw(c, t1, { f: 'J', w: 700, s: 24, ls: 2 }), tw(c, t3, { f: 'J', w: 500, s: 18 })) + 40, X0 = side > 0 ? x + 40 : x - 40 - w; c.save(); c.globalAlpha = eo(k); c.fillStyle = 'rgba(4,8,18,.8)'; c.fillRect(X0, y - 54, w, 100); c.strokeStyle = 'rgba(190,225,255,.4)'; c.strokeRect(X0 + .5, y - 53.5, w - 1, 99); tx(c, t1, X0 + 20, y - 20, { f: 'J', w: 700, s: 24, ls: 2, al: 'left' }); tx(c, t2, X0 + 20, y + 8, { f: 'J', w: 500, s: 18, al: 'left', c: 'rgba(200,215,235,.8)' }); tx(c, t3, X0 + 20, y + 34, { f: 'J', w: 500, s: 18, al: 'left', c: '#ffb54a' }); c.restore() };
    lab(ux, uy, L.ucsf[0], L.ucsf[1], L.ucsf[2], cl((t - o.n1 - .15) / .35), -1);
    if (ak > 0) lab(sx, sy, L.stan[0], L.stan[1], L.stan[2], cl((t - o.arc - .8) / .35), 1);
    if (o.near && t > o.near) { const k = eo(cl((t - o.near) / .35)); tx(c, L.near, mx + 40, my - 30, { f: 'U', w: 700, s: 34, c: '#ffd27a', a: k, glow: '#ffb54a', gb: 14 }) }
  }
  function monitor(c, t, u, o) {
    c.fillStyle = '#03050a'; c.fillRect(0, 0, WW, HH);
    c.save(); c.filter = 'blur(9px)'; c.drawImage(bokeh('mon', WW * 1.2, HH * 1.2, 70, ['#ffcf8a', '#8fd6ff', '#ff8a6a'], 14, 60, 41), -WW * .1 - u * 10, -HH * .1); c.restore();
    c.save(); view(c, (o.s || 1) + u * .025, o.fx || 960, o.fy || 520);
    const X0 = 330, Y0 = 120, W0 = 1260, H0 = 740;
    c.fillStyle = 'rgba(0,0,0,.6)'; c.filter = 'blur(30px)'; c.fillRect(X0 - 30, Y0 + 40, W0 + 60, H0); c.filter = 'none';
    rr(c, X0, Y0, W0, H0, 18); c.fillStyle = lg(c, 0, Y0, 0, Y0 + H0, [[0, '#1b1f27'], [1, '#0b0d11']]); c.fill();
    const sx = X0 + 34, sy = Y0 + 34, sw = W0 - 68, sh = H0 - 68;
    c.save(); c.beginPath(); c.rect(sx, sy, sw, sh); c.clip(); c.fillStyle = '#071019'; c.fillRect(sx, sy, sw, sh); o.screen(c, sx, sy, sw, sh, t, u);
    c.globalCompositeOperation = 'screen'; c.fillStyle = 'rgba(255,255,255,.035)'; poly(c, [sx, sy, sx + sw * .45, sy, sx + sw * .2, sy + sh, sx, sy + sh]); c.fill();
    c.globalCompositeOperation = 'source-over'; c.fillStyle = 'rgba(0,0,0,.12)'; for (let y = sy; y < sy + sh; y += 4) c.fillRect(sx, y, sw, 1);
    c.restore();
    c.fillStyle = '#0d1015'; c.fillRect(920, Y0 + H0, 80, 120); c.fillRect(760, Y0 + H0 + 110, 400, 22);
    glowDot(c, 960, 520, 900, '#4a8cff', .12);
    c.restore();
    c.save(); c.filter = 'blur(14px)'; c.fillStyle = '#05070a'; rr(c, 120, 900, 1680, 300, 30); c.fill(); c.fillStyle = 'rgba(80,130,220,.25)'; c.fillRect(160, 915, 1600, 6); c.restore();
  }
  function scrSearch(c, x, y, w, h, t, u, o) {
    c.fillStyle = '#0c1a2a'; c.fillRect(x, y, w, 64); tx(c, L.lib, x + 30, y + 42, { f: 'J', w: 700, s: 24, ls: 3, al: 'left', c: '#cfe6ff' });
    c.fillStyle = '#e8eef6'; c.fillRect(x + 30, y + 100, w - 260, 64); tx(c, L.query, x + 54, y + 144, { f: 'J', w: 500, s: 28, al: 'left', c: '#13202e' });
    if (Math.floor(t * 2.4) % 2) c.fillStyle = '#13202e', c.fillRect(x + 54 + tw(c, L.query, { f: 'J', w: 500, s: 28 }) + 6, y + 116, 3, 34);
    c.fillStyle = '#ffb54a'; c.fillRect(x + w - 210, y + 100, 180, 64); tx(c, L.search, x + w - 120, y + 143, { f: 'J', w: 700, s: 24, ls: 2, c: '#1a1208' });
    const fk = eo(cl((t - o.found) / .4));
    for (let i = 0; i < 6; i++) { const ry = y + 210 + i * 70, hit = i === 2; c.fillStyle = hit && fk > 0 ? `rgba(255,181,74,${.18 * fk})` : 'rgba(255,255,255,.03)'; c.fillRect(x + 30, ry, w - 60, 58);
      if (hit) { tx(c, L.hit, x + 56, ry + 38, { f: 'J', w: 700, s: 23, al: 'left', c: fk > 0 ? '#ffd27a' : '#9fb4cc' }); if (fk > 0) { c.save(); c.globalAlpha = fk; c.fillStyle = '#ff4a3a'; rr(c, x + w - 230, ry + 12, 180, 34, 6); c.fill(); tx(c, L.found, x + w - 140, ry + 37, { f: 'J', w: 700, s: 20, ls: 2 }); c.restore() } }
      else { c.fillStyle = 'rgba(160,190,220,.35)'; c.fillRect(x + 56, ry + 20, 300 + 260 * H1(i * 3.3), 14); c.fillStyle = 'rgba(160,190,220,.18)'; c.fillRect(x + w - 240, ry + 20, 160, 14) } }
  }
  function devicePath(c, x, y, L0, H0) { rr(c, x, y, L0 * .74, H0, H0 * .18); rr(c, x + L0 * .74 - 6, y + H0 * .08, L0 * .26 + 6, H0 * .84, [H0 * .1, H0 * .38, H0 * .38, H0 * .1]) }
  function scrCAD(c, x, y, w, h, t, u, o) {
    c.fillStyle = '#0a1420'; c.fillRect(x, y, w, h); c.fillStyle = '#101d2d'; c.fillRect(x, y, w, 46); c.fillRect(x, y, 70, h);
    for (let i = 0; i < 7; i++) { c.strokeStyle = 'rgba(160,200,240,.45)'; c.strokeRect(x + 18, y + 70 + i * 56, 34, 34) }
    ['FILE', 'EDIT', 'VIEW', 'SKETCH', 'EXTRUDE'].forEach((s0, i) => tx(c, s0, x + 100 + i * 120, y + 30, { f: 'J', w: 500, s: 18, al: 'left', c: 'rgba(190,215,240,.7)' }));
    c.save(); c.beginPath(); c.rect(x + 70, y + 46, w - 70, h - 46); c.clip(); c.strokeStyle = 'rgba(80,140,200,.12)'; c.lineWidth = 1; c.beginPath(); for (let gx = x + 70; gx < x + w; gx += 32) { c.moveTo(gx, y); c.lineTo(gx, y + h) } for (let gy = y + 46; gy < y + h; gy += 32) { c.moveTo(x, gy); c.lineTo(x + w, gy) } c.stroke();
    const k = eio(cl(u / 1.6)), L0 = 760, H0 = 150, dx = x + 210, dy = y + 190;
    c.strokeStyle = '#7fd8ff'; c.lineWidth = 3; c.shadowColor = '#7fd8ff'; c.shadowBlur = 12; c.setLineDash([2400 * k, 2400]);
    devicePath(c, dx, dy, L0, H0); c.stroke(); rr(c, dx, dy + 270, L0 * .74, H0 * .46, 14); c.stroke(); rr(c, dx + L0 * .74 - 6, dy + 276, L0 * .26 + 6, H0 * .38, 18); c.stroke();
    c.setLineDash([]); c.shadowBlur = 0;
    if (k > .6) { const a = (k - .6) / .4; c.globalAlpha = a; c.strokeStyle = '#ffb54a'; c.lineWidth = 2; c.beginPath(); c.moveTo(dx, dy - 40); c.lineTo(dx + L0, dy - 40); c.moveTo(dx, dy - 52); c.lineTo(dx, dy - 28); c.moveTo(dx + L0, dy - 52); c.lineTo(dx + L0, dy - 28); c.moveTo(dx - 40, dy); c.lineTo(dx - 40, dy + H0); c.stroke(); tx(c, 'A', dx + L0 / 2, dy - 52, { f: 'J', w: 700, s: 22, c: '#ffb54a' }); tx(c, 'B', dx - 56, dy + H0 / 2 + 8, { f: 'J', w: 700, s: 22, c: '#ffb54a' }); c.globalAlpha = 1 }
    c.restore();
    const tk = eo(cl((u - .9) / .4)); if (tk > 0) { c.save(); c.globalAlpha = tk; c.strokeStyle = 'rgba(190,215,240,.6)'; c.strokeRect(x + w - 430, y + h - 150, 400, 120); tx(c, L.cad[0], x + w - 410, y + h - 108, { f: 'J', w: 500, s: 18, al: 'left', c: 'rgba(190,215,240,.75)' }); tx(c, L.cad[1], x + w - 410, y + h - 58, { f: 'U', w: 800, s: 40, al: 'left', c: '#fff' }); c.restore() }
  }
  function usb(c, t, u, o) {
    c.fillStyle = '#04060a'; c.fillRect(0, 0, WW, HH);
    c.save(); c.filter = 'blur(10px)'; c.drawImage(bokeh('usb', WW * 1.2, HH * 1.2, 60, ['#8fd6ff', '#3fd3c6', '#ffcf8a'], 20, 90, 51), -WW * .1 + u * 12, -HH * .1); c.restore();
    c.save(); view(c, 1.0 + u * .05, 900, 560);
    c.fillStyle = lg(c, 0, 220, 0, 900, [[0, '#2c323c'], [.5, '#4a525f'], [1, '#1a1e24']]); rr(c, -200, 240, 900, 640, 30); c.fill();
    c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(-200, 300, 900, 6);
    c.fillStyle = '#05070a'; rr(c, 520, 470, 180, 92, 6); c.fill(); c.fillStyle = '#1e5bd6'; c.fillRect(540, 498, 160, 22);
    const k = eo(cl((t - o.ins + .45) / .45)), dx = lp(1500, 700, k), on = t > o.ins;
    c.save(); c.translate(dx, 516);
    c.fillStyle = lg(c, 0, -40, 0, 40, [[0, '#cfd6df'], [1, '#7d8794']]); c.fillRect(-170, -38, 180, 76);
    rr(c, 0, -66, 720, 132, 30); c.fillStyle = lg(c, 0, -66, 0, 66, [[0, '#3a3f48'], [.3, '#6a717c'], [.6, '#22262c'], [1, '#0d0f12']]); c.fill();
    rr(c, 520, -60, 200, 120, [10, 30, 30, 10]); c.fillStyle = 'rgba(30,40,55,.9)'; c.fill(); c.fillStyle = 'rgba(255,190,90,.35)'; c.fillRect(540, -38, 150, 76);
    c.fillStyle = on ? '#5ef0ff' : '#203038'; rr(c, 300, -8, 120, 16, 8); c.fill(); if (on) glowDot(c, 360, 0, 160, '#5ef0ff', .8 + .2 * Math.sin(t * 6));
    c.restore();
    if (on) { glowDot(c, 600, 516, 300, '#5ef0ff', .5 * eo(cl((t - o.ins) / .3)) * (1 - cl((t - o.ins - .3) / 1.2) * .5)); glowDot(c, 470, 800, 26, '#7dffa0', .9) }
    c.restore();
    card(c, 1200, 760, L.usbc[0], L.usbc[1], (t - o.lab) / .35, { col: C.teal });
  }
  function cube(c, x, y, z, t, a = 1) {
    const h = .87; c.save(); c.globalAlpha *= a; glowDot(c, x, y, z * 2.6, '#ffc35a', .35);
    poly(c, [x, y - z, x + z * h, y - z * .5, x, y, x - z * h, y - z * .5]); c.fillStyle = 'rgba(255,244,214,.92)'; c.fill();
    poly(c, [x - z * h, y - z * .5, x, y, x, y + z, x - z * h, y + z * .5]); c.fillStyle = 'rgba(232,186,112,.85)'; c.fill();
    poly(c, [x, y, x + z * h, y - z * .5, x + z * h, y + z * .5, x, y + z]); c.fillStyle = 'rgba(170,108,52,.85)'; c.fill();
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1.5; poly(c, [x, y - z, x + z * h, y - z * .5, x + z * h, y + z * .5, x, y + z, x - z * h, y + z * .5, x - z * h, y - z * .5]); c.stroke();
    c.restore();
  }
  function podX(c, t, u, o) {
    c.fillStyle = '#030812'; c.fillRect(0, 0, WW, HH); codeRain(c, t, { a: .14 }); grid(c, 60, .05);
    c.save(); view(c, (o.s || 1) + u * .03, o.fx || 960, o.fy || 540);
    const x0 = 560, y0 = 300, w = 800, h = 460;
    rr(c, x0, y0, w, h, 70); c.fillStyle = 'rgba(8,26,48,.9)'; c.fill(); c.strokeStyle = C.ice; c.lineWidth = 3; c.shadowColor = C.ice; c.shadowBlur = 16; c.stroke(); c.shadowBlur = 0;
    rr(c, x0 + 40, y0 + 60, w - 300, h - 120, 30); c.fillStyle = 'rgba(255,170,60,.22)'; c.fill(); c.strokeStyle = 'rgba(255,190,100,.8)'; c.lineWidth = 2; c.stroke();
    rr(c, x0 + w - 230, y0 + 120, 170, h - 240, 20); c.strokeStyle = 'rgba(150,210,255,.7)'; c.stroke(); coil(c, x0 + w - 145, y0 + h / 2, 90, 120, t, .8);
    const L1 = [[760, 520, 46, 0], [850, 560, 36, .1], [680, 575, 30, .18], [920, 500, 28, .26], [800, 440, 24, .34], [1000, 560, 26, .42], [640, 480, 22, .5]];
    for (const [x, y, z, d] of L1) { const k = spr(cl((u - d) / .6)); if (k > 0) cube(c, x, y, z * k, t, 1) }
    if (o.stampT != null) stamp(c, '1973', 800, 520, -.12, t, o.stampT, '#ff3b3b', 76);
    c.restore();
    card(c, 160, 220, L.inside[0], L.inside[1], (u - .3) / .35, { tx: 700, ty: 520, col: C.amber });
  }

  // ================= СЦЕНА 6–7: картридж = пачка, пар, затяжки, нейросеть, 10×10, сделка =================
  function podVsCigs(c, t, u, o) {
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, '#06080d'], [.62, '#0c111b'], [.63, '#05070a'], [1, '#020305']]); c.fillRect(0, 0, WW, HH);
    beam(c, 520, -200, 0, .5, 1200, '#cfe6ff', .65); beam(c, 1330, -200, 0, .75, 1200, '#ffd2a8', .45);
    c.save(); view(c, 1 + u * .03, 960, 560);
    pool(c, 520, 760, 260, 50, '#cfe6ff', .5); pool(c, 1330, 760, 520, 70, '#ffb070', .35);
    c.save(); c.translate(520, 520); vape(c, 480, { led: .7 + .3 * Math.sin(t * 3) }); c.restore();
    tx(c, '=', 830, 600, { f: 'U', w: 800, s: 150, c: '#fff', glow: '#9fd0ff', gb: 20, a: eo(cl((t - o.eq) / .3)) });
    for (let i = 0; i < 20; i++) {
      const r = Math.floor(i / 10), k = i % 10, x = 1040 + k * 62 + r * 31, y = 760 - r * 26, d = o.c0 + i * .06, kk = eo(cl((t - d) / .25)); if (kk <= 0) continue;
      c.save(); c.globalAlpha = kk; c.translate(x, y + (1 - kk) * 40);
      c.fillStyle = lg(c, -16, 0, 16, 0, [[0, '#bdb7ad'], [.4, '#f7f3ea'], [1, '#9a958c']]); c.fillRect(-16, -300, 32, 230);
      c.fillStyle = lg(c, -16, 0, 16, 0, [[0, '#a8692c'], [.4, '#e2a964'], [1, '#7a4618']]); c.fillRect(-16, -70, 32, 70);
      c.fillStyle = '#4a4440'; c.fillRect(-16, -312, 32, 14); c.restore();
      glowDot(c, x, y - 306, 34, '#ff6a20', kk * (.8 + .2 * Math.sin(t * 7 + i)));
      if (i % 3 === 0) smoke(c, t, x, y - 316, { n: 6, life: 3, rise: 260, sway: 30, drift: 30, r0: 8, r1: 60, a: .22 * kk, seed: 90 + i });
    }
    c.restore();
    tx(c, L.eq, WW / 2, 200, { f: 'U', w: 800, s: 64, c: '#fff', a: eo(cl((t - o.eq) / .35)), glow: '#000', gb: 20 });
  }
  function puffs(c, t, u, o) {
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, '#070b16'], [1, '#020306']]); c.fillRect(0, 0, WW, HH);
    c.save(); c.filter = 'blur(6px)'; c.drawImage(bokeh('vm', WW * 1.3, HH * 1.3, 70, ['#6fb4ff', '#9fd0ff', '#ffb36b', '#3fd3c6'], 30, 120, 11), -WW * .15 + u * 20, -HH * .15); c.restore();
    const rate = 2.2 + u * 1.4, ph = (u * rate) % 1, led = ph < .35 ? Math.sin(ph / .35 * Math.PI) : 0;
    c.save(); c.translate(760, 560); c.rotate(-1.25); vape(c, 1050, { led, ledCol: '#5ef0ff', sweep: (u * .5) % 1.2 - .1 }); c.restore();
    const mx = 760 + Math.cos(-1.25 - Math.PI / 2) * 525, my = 560 + Math.sin(-1.25 - Math.PI / 2) * 525;
    smoke(c, t, mx - 30, my, { n: 30, life: 1.6, rise: 260, sway: 60, drift: -260, r0: 20, r1: 200, a: .28, seed: 111 });
    const n = Math.floor(u * (2.2 + u * .7) * 9);
    panel(c, 1240, 300, 470, 250, L.puffs[0], C.teal); tx(c, String(n), 1690, 500, { f: 'U', w: 800, s: 120, al: 'right', c: '#fff', glow: '#3fd3c6', gb: 18 });
    card(c, 1240, 600, L.puffs[1], L.puffs[2], (u - .5) / .35, { col: C.red });
  }
  let NET = null;
  function netBuild() {
    const N = []; for (let i = 0; i < 170; i++) { const a = H1(i * 3.3) * TAU, r = Math.sqrt(H1(i * 7.1)), z = H1(i * 9.7); N.push({ x: WW / 2 + Math.cos(a) * r * 1000, y: HH / 2 + Math.sin(a) * r * 560, z, e: [] }) }
    N.forEach((n, i) => { const d = N.map((m, j) => [Math.hypot(m.x - n.x, m.y - n.y), j]).sort((a, b) => a[0] - b[0]); for (let k = 1; k <= 3; k++) { const j = d[k][1]; if (!n.e.includes(j)) { n.e.push(j); N[j].e.push(i) } } });
    let c0 = 0, best = 1e9; N.forEach((n, i) => { const d = Math.hypot(n.x - WW / 2, n.y - HH / 2); if (d < best) { best = d; c0 = i } });
    const D0 = N.map(() => 1e9); D0[c0] = 0; const qq = [c0]; while (qq.length) { const i = qq.shift(); for (const j of N[i].e) if (D0[j] > D0[i] + 1) { D0[j] = D0[i] + 1; qq.push(j) } }
    N.forEach((n, i) => n.d = D0[i]); return N;
  }
  function neural(c, t, u, o) {
    NET = NET || netBuild();
    c.fillStyle = rg(c, WW / 2, HH / 2, 50, 1100, [[0, '#1a0508'], [1, '#030103']]); c.fillRect(0, 0, WW, HH);
    c.save(); view(c, 1.05 + u * .05, WW / 2, HH / 2);
    const hop = .16, wv = (t - o.t0) / hop, per = 9;
    c.lineWidth = 1.5;
    NET.forEach((n, i) => n.e.forEach(j => { if (j < i) return; const m = NET[j]; c.strokeStyle = `rgba(255,${200 - 120 * Math.max(n.z, m.z) | 0},${200 - 140 * Math.max(n.z, m.z) | 0},${.14 + .2 * (1 - Math.max(n.z, m.z))})`; c.beginPath(); c.moveTo(n.x, n.y); c.lineTo(m.x, m.y); c.stroke() }));
    NET.forEach((n, i) => n.e.forEach(j => { const m = NET[j]; if (m.d !== n.d + 1) return; for (let w0 = 0; w0 < 3; w0++) { const f = wv - w0 * per - n.d; if (f < 0 || f > 1) continue; const x = lp(n.x, m.x, f), y = lp(n.y, m.y, f); glowDot(c, x, y, 22, '#ff3a2a', .9); c.fillStyle = '#ffd0c8'; c.beginPath(); c.arc(x, y, 3, 0, TAU); c.fill() } }));
    NET.forEach(n => { let fl = 0; for (let w0 = 0; w0 < 3; w0++) { const f = wv - w0 * per - n.d; if (f >= 0 && f < 3) fl = Math.max(fl, 1 - f / 3) } const r = 4 + 6 * (1 - n.z); if (n.z > .7) glowDot(c, n.x, n.y, 30 + 30 * n.z, fl > 0 ? '#ff3a2a' : '#a07080', .25 + .5 * fl); else { c.fillStyle = fl > 0 ? `rgba(255,${120 - 80 * fl | 0},${100 - 80 * fl | 0},1)` : 'rgba(230,200,205,.8)'; c.beginPath(); c.arc(n.x, n.y, r, 0, TAU); c.fill(); if (fl > 0) glowDot(c, n.x, n.y, 60, '#ff2a1a', fl) } });
    c.restore();
    const bl = .55 + .45 * Math.sin(t * 9); c.save(); c.globalAlpha = .75 + .25 * bl; panel(c, 1240, 760, 560, 120, L.addict[0], C.red); tx(c, L.addict[1], 1262, 852, { f: 'U', w: 800, s: 40, al: 'left', c: '#ff5a4a', glow: '#ff2a1a', gb: 12 }); c.restore();
  }
  const LIT = (() => { const a = [...Array(100).keys()].sort((x, y) => H1(x * 5.3 + 1) - H1(y * 5.3 + 1)); return new Set(a.slice(0, 28)) })();
  function kid(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.beginPath(); c.arc(0, -31, 10, 0, TAU); c.fill(); rr(c, -14, -18, 28, 28, [10, 10, 3, 3]); c.fill(); rr(c, -21, -16, 6, 25, 3); c.fill(); rr(c, 15, -16, 6, 25, 3); c.fill(); rr(c, -12, 9, 10, 20, 3); c.fill(); rr(c, 2, 9, 10, 20, 3); c.fill(); c.restore() }
  function people(c, t, u, o) {
    c.fillStyle = lg(c, 0, 0, 0, HH, [[0, '#060a14'], [1, '#020306']]); c.fillRect(0, 0, WW, HH); grid(c, 70, .04);
    c.save(); view(c, o.s(u), o.fx || 960, o.fy || 520);
    const X0 = 960 - 4.5 * 76, Y0 = 220;
    for (let i = 0; i < 100; i++) {
      const r = Math.floor(i / 10), k = i % 10, x = X0 + k * 76, y = Y0 + r * 64, ap = eo(cl((t - o.app - r * .05 - k * .01) / .3)); if (ap <= 0) continue;
      const lit = LIT.has(i), lk = lit ? eo(cl((t - o.lit - H1(i) * .5) / .25)) : 0;
      c.save(); c.globalAlpha = ap; kid(c, x, y + (1 - ap) * 20, 1, lk > 0 ? `rgb(255,${lp(110, 70, lk) | 0},${lp(120, 60, lk) | 0})` : '#3a4458'); c.restore();
      if (lk > 0) { glowDot(c, x, y - 10, 60, '#ff3a2a', .6 * lk); smoke(c, t, x + 6, y - 46, { n: 4, life: 2.4, rise: 80, sway: 14, drift: 10, r0: 5, r1: 26, a: .3 * lk, seed: i * 7 }) }
    }
    c.restore();
    const k = eo(cl((t - o.lit - .2) / .4)); if (k > 0) { tx(c, L.teen[0], 1640, 470, { f: 'U', w: 800, s: 110, c: '#ff5a4a', a: k, glow: '#ff2a1a', gb: 20 }); tx(c, L.teen[1], 1640, 530, { f: 'J', w: 700, s: 24, ls: 4, c: '#fff', a: k }); tx(c, L.teen[2], 1640, 568, { f: 'J', w: 500, s: 22, ls: 4, c: 'rgba(220,230,245,.75)', a: k }) }
  }
  let CND = null;
  function candles() { if (CND) return CND; CND = []; let v = 100; for (let i = 0; i < 70; i++) { const o0 = v, ch = (H1(i * 3.7) - .4) * 16 + i * .1, c0 = o0 + ch, hi = Math.max(o0, c0) + H1(i * 5.1) * 7, lo = Math.min(o0, c0) - H1(i * 7.9) * 7; CND.push([o0, hi, lo, c0, 20 + H1(i * 2.2) * 60]); v = c0 } return CND }
  function chart(c, t, u, o) {
    const D0 = candles(); c.fillStyle = '#040203'; c.fillRect(0, 0, WW, HH);
    c.fillStyle = rg(c, WW * .7, HH * .4, 50, 1100, [[0, 'rgba(120,10,15,.35)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(0, 0, WW, HH); grid(c, 90, .05, '#ffd0d0');
    const n = Math.floor(lp(30, 70, eo(cl(u / 2.6)))), vis = D0.slice(Math.max(0, n - 40), n), lo = Math.min(...vis.map(d => d[2])), hi = Math.max(...vis.map(d => d[1]));
    const X1 = 1760, cw = 40, Y0 = 860, Y1 = 260, Y = v => lp(Y0, Y1, (v - lo) / (hi - lo + 1e-6));
    for (let i = Math.max(0, n - 41); i < n; i++) { const [o0, h0, l0, c0, vol] = D0[i], x = X1 - (n - 1 - i) * cw; if (x < 60) continue; const up = c0 >= o0, col = up ? '#f4efe8' : '#e3232c'; c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(x, Y(h0)); c.lineTo(x, Y(l0)); c.stroke(); c.fillStyle = col; c.fillRect(x - 13, Math.min(Y(o0), Y(c0)), 26, Math.max(3, Math.abs(Y(o0) - Y(c0)))); c.fillStyle = up ? 'rgba(244,239,232,.18)' : 'rgba(227,35,44,.25)'; c.fillRect(x - 13, 1000 - vol * 1.2, 26, vol * 1.2) }
    const last = D0[n - 1], ly = Y(last[3]); c.save(); c.setLineDash([8, 8]); c.strokeStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.moveTo(60, ly); c.lineTo(X1 + 40, ly); c.stroke(); c.restore(); glowDot(c, X1, ly, 80, '#ff4a3a', .6);
    const vk = eo(cl((t - o.n0) / 1.5)), val = Math.round(12.8e9 * vk / 1e6) * 1e6;
    c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(70, 150, 1000, 190);
    tx(c, '$' + val.toLocaleString('en-US').replace(/,/g, ' '), 100, 270, { f: 'U', w: 800, s: 86, al: 'left', c: '#fff', glow: '#e3232c', gb: 18 });
    tx(c, L.deal, 104, 318, { f: 'J', w: 700, s: 24, ls: 5, al: 'left', c: '#ff8a80' });
  }
  function pack(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(0,0,0,.55)'; c.filter = 'blur(20px)'; c.fillRect(-150, 230, 330, 50); c.filter = 'none';
    poly(c, [150, -250, 210, -280, 210, 220, 150, 250]); c.fillStyle = '#b9b3aa'; c.fill();
    poly(c, [-150, -250, -90, -280, 210, -280, 150, -250]); c.fillStyle = '#d9d3c9'; c.fill();
    c.fillStyle = lg(c, -150, 0, 150, 0, [[0, '#e8e3da'], [.5, '#fbf8f2'], [1, '#d6d0c5']]); c.fillRect(-150, -250, 300, 500);
    c.fillStyle = '#d2101c'; poly(c, [-150, -250, 150, -250, 150, -40, 0, -150, -150, -40]); c.fill();
    poly(c, [150, -250, 210, -280, 210, -70, 150, -40]); c.fillStyle = '#a00c16'; c.fill();
    c.globalCompositeOperation = 'screen'; c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(-120, -250, 16, 500); c.restore();
  }
  function pack35(c, t, u, o) {
    c.fillStyle = '#050304'; c.fillRect(0, 0, WW, HH);
    beam(c, 640, -260, 0, .55, 1400, '#ffe6d0', .7); pool(c, 640, 860, 380, 70, '#ffd8c0', .45);
    c.save(); view(c, 1 + u * .04, 960, 540); pack(c, 640, 560, 1.15); smoke(c, t, 700, 230, { n: 10, life: 4, rise: 300, sway: 40, drift: 40, r0: 20, r1: 120, a: .14, seed: 131 }); c.restore();
    dust(c, t, 640, -260, 0, .55, 1400, 100, 133, .8);
    const k = eio(cl((t - o.r0) / 1.1)), gx = 1350, gy = 470, R = 200;
    c.save(); c.lineWidth = 34; c.strokeStyle = 'rgba(255,255,255,.1)'; c.beginPath(); c.arc(gx, gy, R, 0, TAU); c.stroke();
    c.strokeStyle = '#e3232c'; c.shadowColor = '#ff2a2a'; c.shadowBlur = 20; c.beginPath(); c.arc(gx, gy, R, -Math.PI / 2, -Math.PI / 2 + TAU * .35 * k); c.stroke(); c.restore();
    tx(c, `${Math.round(35 * k)} %`, gx, gy + 34, { f: 'U', w: 800, s: 96, c: '#fff' });
    tx(c, L.share[0], gx, gy + R + 80, { f: 'J', w: 700, s: 26, ls: 5, c: '#ff8a80', a: k }); tx(c, L.share[1], gx, gy + R + 120, { f: 'J', w: 500, s: 22, ls: 3, c: 'rgba(240,235,230,.8)', a: k });
  }

  // ================= СЦЕНА 8: план выполнен, табличка, оплата, комната =================
  function neonSign(c, t, u, o) {
    c.drawImage(cache('brick', WW, HH, (x, W, H) => { x.fillStyle = '#0d0a0b'; x.fillRect(0, 0, W, H); for (let r = 0; r < 30; r++) for (let k = 0; k < 22; k++) { const bx = k * 96 + (r % 2) * 48 - 48, by = r * 40, v = 14 + 10 * H1(r * 31 + k); x.fillStyle = `rgb(${v + 6 | 0},${v | 0},${v | 0})`; x.fillRect(bx + 3, by + 3, 90, 34) } x.globalAlpha = .12; x.fillStyle = x.createPattern(noiseTex('wall', 512, 512, 60, 4), 'repeat'); x.fillRect(0, 0, W, H) }), 0, 0);
    const off = o.off != null && t > o.off ? (H1(Math.floor(t * 20)) > .35 ? .15 : .9) : 1, fl = (H1(Math.floor(t * 14)) > .93 ? .55 : 1) * off;
    c.save(); view(c, 1 + u * .05, 960, 520);
    glowDot(c, 960, 520, 700, '#ff2030', .35 * fl);
    const neon = (fn, w, col) => { c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; c.globalAlpha = fl; c.shadowColor = col; c.shadowBlur = 40; c.lineWidth = w * 2.2; fn(); c.stroke(); c.shadowBlur = 14; c.lineWidth = w; c.strokeStyle = '#ffd9dc'; fn(); c.stroke(); c.restore() };
    neon(() => { c.beginPath(); c.arc(960, 520, 300, 0, TAU) }, 16, '#ff2a3a');
    neon(() => { c.beginPath(); c.rect(760, 490, 330, 60); c.moveTo(1000, 490); c.lineTo(1000, 550) }, 10, '#ffffff');
    neon(() => { c.beginPath(); c.moveTo(1050, 470); c.bezierCurveTo(1030, 430, 1080, 410, 1060, 360); c.moveTo(1080, 470); c.bezierCurveTo(1060, 420, 1110, 400, 1090, 350) }, 7, '#ffffff');
    neon(() => { c.beginPath(); c.moveTo(960 - 212, 520 - 212); c.lineTo(960 + 212, 520 + 212) }, 16, '#ff2a3a');
    c.restore();
    c.fillStyle = lg(c, 0, HH * .75, 0, HH, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.7)']]); c.fillRect(0, HH * .75, WW, HH * .25);
  }
  function pos(c, t, u, o) {
    c.fillStyle = '#05060a'; c.fillRect(0, 0, WW, HH);
    c.save(); c.filter = 'blur(10px)'; c.drawImage(bokeh('pos', WW * 1.2, HH * 1.2, 60, ['#ffcf8a', '#ff8a6a', '#8fd6ff'], 20, 80, 61), -WW * .1, -HH * .1); c.restore();
    beam(c, 1000, -260, 0, .6, 1400, '#ffe2c8', .55);
    c.save(); view(c, 1 + u * .04, 960, 560);
    poly(c, [-200, 700, WW + 200, 700, WW + 700, HH + 200, -700, HH + 200]); c.fillStyle = lg(c, 0, 700, 0, HH, [[0, '#17130f'], [1, '#070605']]); c.fill();
    pool(c, 960, 780, 620, 130, '#ffd2a8', .45);
    // терминал
    c.save(); c.translate(980, 650); c.rotate(-.05); c.scale(.82, .82);
    c.fillStyle = 'rgba(0,0,0,.5)'; c.filter = 'blur(18px)'; c.fillRect(-170, 230, 380, 60); c.filter = 'none';
    rr(c, -180, -300, 360, 560, 40); c.fillStyle = lg(c, -180, 0, 180, 0, [[0, '#1b1e24'], [.4, '#2c3038'], [1, '#121418']]); c.fill();
    rr(c, -150, -270, 300, 230, 16); c.fillStyle = '#071019'; c.fill();
    const ok = eo(cl((t - o.paid) / .35));
    if (ok > 0) { c.save(); c.globalAlpha = ok; c.fillStyle = 'rgba(40,220,120,.18)'; rr(c, -150, -270, 300, 230, 16); c.fill(); c.strokeStyle = '#47e38a'; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(-40, -170); c.lineTo(-8, -138); c.lineTo(50, -205); c.stroke(); tx(c, L.paid, 0, -78, { f: 'J', w: 700, s: 22, ls: 2, c: '#7dffa0' }); c.restore(); glowDot(c, 0, -160, 260, '#47e38a', .35 * ok) }
    else { c.strokeStyle = 'rgba(160,200,240,.7)'; c.lineWidth = 6; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-20, -150, 30 + i * 26, -.7, .7); c.stroke() } }
    for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) { rr(c, -120 + k * 84, 10 + r * 56, 72, 44, 8); c.fillStyle = '#3a3f48'; c.fill() }
    // чек
    const rk = eo(cl((t - o.paid - .2) / .8)), rh = 220 * rk;
    if (rk > 0) { c.save(); c.beginPath(); c.rect(-120, -560, 240, 268); c.clip(); c.fillStyle = '#f3efe6'; c.fillRect(-110, -300 - rh, 220, rh); for (let i = 0; i < 7; i++) { c.fillStyle = 'rgba(40,36,30,.5)'; c.fillRect(-90, -300 - rh + 24 + i * 30, 90 + 70 * H1(i), 9) } c.restore();
      if (o.daniT != null) stamp(c, L.dan, 0, -440, -.2, t, o.daniT, '#d0151c', 46) }
    c.restore();
    c.save(); c.translate(560, 690); c.rotate(-1.35); vape(c, 300, { led: .6 + .4 * Math.sin(t * 3) }); c.restore();
    c.restore();
    dust(c, t, 1000, -260, 0, .6, 1400, 90, 141, .8);
  }
  // ================= СЦЕНА 9: доска расследования, YouTube =================
  let THUMB = null;
  function thumbs() {
    if (THUMB) return THUMB; THUMB = {}; const big = mk(WW, HH), bx = big.getContext('2d');
    for (const s0 of SH) if (s0.tag) { drawShot(bx, s0, s0.a + (s0.tt ?? 1.2)); const c0 = mk(480, 270), x = c0.getContext('2d'); x.drawImage(big, 0, 0, 480, 270); THUMB[s0.tag] = c0 }
    return THUMB;
  }
  function polaroid(c, x, y, r, img, cap, k = 1) {
    if (k <= 0) return; c.save(); c.translate(x, y); c.rotate(r); c.globalAlpha *= cl(k * 2); const s = lp(1.3, 1, eo(k)); c.scale(s, s);
    c.fillStyle = 'rgba(0,0,0,.5)'; c.filter = 'blur(12px)'; c.fillRect(-190, -120, 400, 300); c.filter = 'none';
    c.fillStyle = '#efeadf'; c.fillRect(-200, -140, 400, 300); if (img) c.drawImage(img, -184, -124, 368, 207);
    if (cap) tx(c, cap, 0, 128, { f: 'J', w: 700, s: 20, ls: 2, c: '#2a241c' });
    c.restore();
  }
  const PH9 = [['memo', 360, 280, -.07, 'МЕМОРАНДУМ · 1973'], ['vault', 800, 240, .05, 'АРХИВ · 1998'], ['map', 1240, 270, -.04, 'СТЭНФОРД'], ['chart', 1620, 330, .08, '$12,8 МЛРД'], ['pod', 420, 720, .04, 'СОЛЬ 1973'], ['kids', 1500, 740, -.05, '27,5 %']];
  let BRD = null;
  function board(c, t, u, o) {
    const pk = o.plate != null ? eo(cl((t - o.plate) / .45)) : 0;
    if (pk > 0) { BRD = BRD || mk(WW, HH); const b = BRD.getContext('2d'); b.setTransform(1, 0, 0, 1, 0, 0); boardBase(b, t, u, o); c.filter = `blur(${(7 * pk).toFixed(1)}px)`; c.drawImage(BRD, 0, 0); c.filter = 'none'; c.fillStyle = `rgba(0,0,0,${.3 * pk})`; c.fillRect(0, 0, WW, HH) } else boardBase(c, t, u, o);
    if (pk > 0) { const k = pk;
      c.save(); c.globalAlpha = k; c.fillStyle = 'rgba(4,6,10,.86)'; rr(c, 300, 600 + (1 - k) * 40, 1320, 230, 24); c.fill(); c.strokeStyle = 'rgba(255,255,255,.25)'; c.lineWidth = 2; c.stroke();
      rr(c, 360, 650 + (1 - k) * 40, 170, 120, 34); c.fillStyle = '#ff1f3a'; c.fill(); c.fillStyle = '#fff'; poly(c, [425, 680 + (1 - k) * 40, 425, 740 + (1 - k) * 40, 475, 710 + (1 - k) * 40]); c.fill();
      tx(c, L.yt[0], 580, 712 + (1 - k) * 40, { f: 'U', w: 800, s: 58, al: 'left', c: '#fff' }); tx(c, L.yt[1], 584, 774 + (1 - k) * 40, { f: 'J', w: 700, s: 30, ls: 6, al: 'left', c: '#ffb54a' });
      c.restore() }
  }
  function boardBase(c, t, u, o) {
    c.drawImage(cache('cork', WW, HH, (x, W, H) => { x.fillStyle = '#4a3420'; x.fillRect(0, 0, W, H); x.globalAlpha = .5; x.fillStyle = x.createPattern(noiseTex('cork2', 256, 256, 4, 3), 'repeat'); x.fillRect(0, 0, W, H); x.globalAlpha = 1 }), 0, 0);
    const T0 = thumbs();
    c.save(); view(c, o.s(u), o.fx || 960, o.fy || 520);
    const P0 = [960, 560], pins = [];
    PH9.forEach(([k, x, y, r, cap], i) => { polaroid(c, x, y, r, T0[k], cap, cl((t - o.t0 - i * .12) / .35)); pins.push([x, y - 128]) });
    c.save(); c.translate(P0[0], P0[1]); c.rotate(-.03); c.fillStyle = 'rgba(0,0,0,.5)'; c.filter = 'blur(14px)'; c.fillRect(-170, -200, 360, 430); c.filter = 'none'; c.fillStyle = '#efeadf'; c.fillRect(-180, -220, 360, 440); c.fillStyle = '#120c0a'; c.fillRect(-160, -200, 320, 340); c.restore();
    c.save(); c.beginPath(); c.rect(P0[0] - 160, P0[1] - 200, 320, 340); c.clip(); pack(c, P0[0], P0[1] - 30, .55); c.restore();
    tx(c, L.s9pack, P0[0], P0[1] + 196, { f: 'J', w: 700, s: 22, ls: 2, c: '#2a241c' });
    const tk = cl((t - o.t0 - .5) / .9);
    pins.forEach(([x, y], i) => { const k = cl(tk * 1.6 - i * .12); if (k > 0) thread(c, x, y, lp(x, P0[0], k), lp(y, P0[1] - 210, k), t) });
    pins.forEach(([x, y]) => pin(c, x, y, '#d0242a')); pin(c, P0[0], P0[1] - 210, '#d0242a');
    L.s9.forEach((s0, i) => { const k = cl((t - o.cards[i]) / .3); if (k <= 0) return; const x = [330, 960, 1590][i], y = 990; c.save(); c.translate(x, y + (1 - eo(k)) * 60); c.rotate([-.03, .02, -.02][i]); c.globalAlpha = eo(k); c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(-224, -54, 460, 120); c.fillStyle = '#f2ecdc'; c.fillRect(-230, -62, 460, 116); c.fillStyle = 'rgba(200,40,40,.7)'; c.fillRect(-230, -30, 460, 2); tx(c, s0, 0, 18, { f: 'U', w: 700, s: 30, c: '#1f1a14' }); c.restore(); pin(c, x, y - 50 + (1 - eo(k)) * 60, '#2a6ad0') });
    c.restore();
    beam(c, 960, -320, 0, .9, 1700, '#fff1d8', .55); dust(c, t, 960, -320, 0, .9, 1700, 120, 151, .7);
    c.fillStyle = rg(c, WW / 2, HH / 2, 300, 1100, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.6)']]); c.fillRect(0, 0, WW, HH);
  }

  // ================= кадр: планы и переходы =================
  const TRD = { cut: 0, blur: .5, punch: .34, flash: .42, whip: .4, glitch: .55, fade: .6 };
  function shotAt(t) { let i = 0; while (i < SH.length - 1 && t >= SH[i + 1].a) i++; return i }
  function drawShot(c, sh, t) { c.save(); c.fillStyle = C.ink; c.fillRect(0, 0, WW, HH); sh.f(c, t, t - sh.a, sh); c.restore() }
  function composite(c, p, n, k, kind, t) {
    const a = A.getContext('2d'), b = B.getContext('2d');
    if (kind === 'blur' || kind === 'fade') {
      drawShot(a, p, t); drawShot(b, n, t);
      const bl = kind === 'blur' ? 24 : 0, b1 = bl * ss(0, .6, k), b2 = bl * (1 - ss(.4, 1, k));
      c.filter = b1 > .3 ? `blur(${b1.toFixed(1)}px)` : 'none'; c.drawImage(A, 0, 0);
      c.globalAlpha = ss(.2, .8, k); c.filter = b2 > .3 ? `blur(${b2.toFixed(1)}px)` : 'none'; c.drawImage(B, 0, 0); c.globalAlpha = 1; c.filter = 'none';
    } else if (kind === 'punch') {
      if (k < .5) { const e = ei(k * 2); drawShot(a, p, t); c.save(); c.translate(WW / 2, HH / 2); c.scale(1 + .32 * e, 1 + .32 * e); c.translate(-WW / 2, -HH / 2); c.filter = `blur(${(10 * e).toFixed(1)}px)`; c.drawImage(A, 0, 0); c.restore() }
      else { const e = eo((k - .5) * 2); drawShot(b, n, t); c.save(); c.translate(WW / 2, HH / 2); c.scale(1.16 - .16 * e, 1.16 - .16 * e); c.translate(-WW / 2, -HH / 2); c.filter = `blur(${(8 * (1 - e)).toFixed(1)}px)`; c.drawImage(B, 0, 0); c.restore() }
      c.filter = 'none'; c.fillStyle = `rgba(255,255,255,${(.22 * Math.max(0, 1 - Math.abs(k - .5) * 5)).toFixed(3)})`; c.fillRect(0, 0, WW, HH);
    } else if (kind === 'flash') {
      drawShot(c, k < .5 ? p : n, t); c.fillStyle = `rgba(255,248,240,${Math.pow(Math.max(0, 1 - Math.abs(k - .5) * 2), 1.6).toFixed(3)})`; c.fillRect(0, 0, WW, HH);
    } else if (kind === 'whip') {
      const e = eio(k); drawShot(a, p, t); drawShot(b, n, t); c.filter = `blur(${(18 * Math.sin(Math.PI * k)).toFixed(1)}px)`;
      c.drawImage(A, -WW * e, 0); c.drawImage(B, WW * (1 - e), 0); c.filter = 'none';
    } else if (kind === 'glitch') {
      const sh = k < .5 ? p : n; drawShot(a, sh, t); c.drawImage(A, 0, 0);
      const f = Math.floor(t * 30), amt = Math.sin(Math.PI * k);
      for (let i = 0; i < 14; i++) { const y = H1(f * 13 + i) * HH, h = 8 + H1(f * 7 + i) * 70, dx = (H1(f * 3 + i) - .5) * 260 * amt; c.drawImage(A, 0, y, WW, h, dx, y, WW, h) }
      c.globalCompositeOperation = 'screen'; c.globalAlpha = .5 * amt; c.drawImage(A, 14 * amt, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
      for (let i = 0; i < 5; i++) { c.fillStyle = i % 2 ? `rgba(255,40,60,${.35 * amt})` : `rgba(40,240,255,${.3 * amt})`; c.fillRect(0, H1(f + i * 9) * HH, WW, 2 + H1(f + i) * 10) }
    }
  }
  function topPlate(c) { c.drawImage(cache('topP', WW, 190, (x) => { x.fillStyle = lg(x, 0, 0, 0, 190, [[0, 'rgba(0,0,0,.62)'], [1, 'rgba(0,0,0,0)']]); x.fillRect(0, 0, WW, 190) }), 0, 0) }
  function capPlate(c) { c.drawImage(cache('capP', WW, 340, (x) => { x.fillStyle = lg(x, 0, 0, 0, 340, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.66)']]); x.fillRect(0, 0, WW, 340) }), 0, HH - 340) }
  function vignette(c) { c.drawImage(cache('vig', WW, HH, (x) => { x.fillStyle = rg(x, WW / 2, HH * .47, HH * .3, HH * 1.08, [[0, 'rgba(0,0,0,0)'], [.55, 'rgba(0,0,0,.18)'], [1, 'rgba(0,0,0,.8)']]); x.fillRect(0, 0, WW, HH) }), 0, 0) }
  const tcode = t => { const f = Math.floor((t % 1) * 30), s = Math.floor(t); return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, f].map(v => String(v).padStart(2, '0')).join(':') };
  function hud(c, t) {
    let ch = CHS[0]; for (const h of CHS) if (t >= h.a) ch = h;
    const k = eo((t - ch.a) / .4), newName = !ch.prev || ch.prev.name !== ch.name || ch.prev.n !== ch.n, y = 84;
    c.save();
    c.strokeStyle = 'rgba(225,238,255,.3)'; c.lineWidth = 2; const m = 36, L0 = 46;
    for (const [x, yy, sx, sy] of [[m, m, 1, 1], [WW - m, m, -1, 1], [m, HH - m, 1, -1], [WW - m, HH - m, -1, -1]]) { c.beginPath(); c.moveTo(x, yy + sy * L0); c.lineTo(x, yy); c.lineTo(x + sx * L0, yy); c.stroke() }
    const bl = .5 + .5 * Math.sin(t * 5.4); c.fillStyle = `rgba(255,50,50,${.45 + .55 * bl})`; c.beginPath(); c.arc(86, y - 8, 8, 0, TAU); c.fill(); glowDot(c, 86, y - 8, 30, '#ff3030', .5 * bl);
    const left = `${L.ep} ${ch.n} · ${ch.name}`, date = typeof ch.date === 'function' ? ch.date(t) : ch.date, right = `${date}   ${tcode(t)}   /   ${ch.loc}`;
    c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 8; const o = { f: 'J', w: 500, s: 23, ls: 3, c: 'rgba(236,243,255,.95)' };
    if (newName && k < 1 && ch.prev) { tx(c, `${L.ep} ${ch.prev.n} · ${ch.prev.name}`, 110, y - 14 * k, { ...o, al: 'left', a: 1 - k }); tx(c, left, 110, y + 14 * (1 - k), { ...o, al: 'left', a: k }) }
    else tx(c, left, 110, y, { ...o, al: 'left' });
    tx(c, right, WW - 86, y, { ...o, al: 'right', a: ch.prev && ch.prev.loc !== ch.loc ? .35 + .65 * k : 1 });
    c.fillStyle = 'rgba(225,238,255,.16)'; c.fillRect(86, y + 22, WW - 172, 1.5);
    c.restore();
  }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none';
    const i = shotAt(t), sh = SH[i], nx = SH[i + 1]; let tr = null;
    if (nx && nx.tr !== 'cut' && t >= nx.a - TRD[nx.tr] / 2) tr = [sh, nx, (t - (nx.a - TRD[nx.tr] / 2)) / TRD[nx.tr], nx.tr];
    else if (i > 0 && sh.tr !== 'cut' && t < sh.a + TRD[sh.tr] / 2) tr = [SH[i - 1], sh, (t - (sh.a - TRD[sh.tr] / 2)) / TRD[sh.tr], sh.tr];
    const [dx, dy] = shake(t);
    c.save(); c.translate(dx, dy);
    if (tr) composite(c, tr[0], tr[1], cl(tr[2]), tr[3], t); else drawShot(c, sh, t);
    c.restore();
    capPlate(c); vignette(c); topPlate(c); hud(c, t);
  }

  // ================= план ролика: каждый план — от слов диктора =================
  function build(tl) {
    const S = tl.sent, nrm = s => cueNorm(s);
    const w = (i, cue, n = 0) => { const q = nrm(cue); let k = 0; for (const x of S[i].words) { const d = nrm(x.d); if (d === q || (q.length > 3 && d.startsWith(q))) { if (k++ === n) return x.a } } console.warn('нет слова', i, cue); return S[i].a };
    const s = i => S[i].a, se = i => S[i].b;
    Q = { chto2: w(0, 'что', 1), zam: w(0, 'замена'), mango: w(0, 'манго'), myaty: w(0, 'мяты'), s1: s(1), zhid: w(1, 'жидкость'), izobr: w(1, 'изобрели'), tab1: w(1, 'табачные'), p50: w(1, 'пятьдесят'),
      s2: s(2), y73: w(2, '1973'), tab: w(2, 'табачная'), rey: w(2, 'рейнольдс'), sozd: w(2, 'создатель'), camel: w(2, 'camel'), winston: w(2, 'winston'), gotov: w(2, 'готовит'), sekr: w(2, 'секретный'),
      s3: s(3), zvuch: w(3, 'звучала'), poluch: w(3, 'получить'), rynka: w(3, 'рынка'), e3: se(3) };
    const q = Q;
    const ch = (a, n, name, date, loc) => CHS.push({ a, n, name, date, loc, prev: CHS[CHS.length - 1] });
    ch(0, '01', 'ОДНОРАЗКА', '2026', 'УЛИКА № 1');
    ch(q.p50 - .15, '01', 'ОДНОРАЗКА', t => String(Math.round(yearAt(t))), 'ОТМАТЫВАЕМ ВРЕМЯ');
    ch(q.tab - .2, '02', 'МЕМОРАНДУМ', '1973', 'УИНСТОН-СЕЙЛЕМ');
    ch(q.gotov - .15, '02', 'МЕМОРАНДУМ', '02.02.1973', 'СЕКРЕТНЫЙ ОТЧЁТ');
    const sh = (a, tr, f, tag, tt) => SH.push({ a, tr, f, tag, tt });
    // 1. Комната в луче: общий план, медленный наезд на одноразку
    sh(0, 'cut', (c, t, u) => { c.save(); const k = eio(u / 3); view(c, lp(1.0, 1.1, k), lp(WW / 2, 1060, k), lp(HH / 2, 600, k)); room(c, t); c.restore() });
    // 2. Макро: одноразка крупно, боке, карточки состава
    sh(q.chto2 - .1, 'punch', (c, t, u) => {
      vapeMacro(c, t, u, { x: 1180, y: 430, h: 1150, r: -.2 });
      card(c, 210, 300, L.type[0], L.type[1], (t - q.zam) / .35, { tx: 1020, ty: 360, col: C.ice });
      card(c, 210, 470, L.flavor[0], L.flavor[1], (t - q.mango + .1) / .35, { tx: 1080, ty: 700, col: C.amber });
    });
    // 3. Макро сверху: мундштук и пар, «никотиновая соль»
    sh(q.mango - .15, 'blur', (c, t, u) => {
      vapeMacro(c, t, u, { x: 980, y: 900, h: 1500, r: -.9, smoke: 1, sx: 400, sy: 440 });
      card(c, 1240, 230, L.flavor[0], L.flavor[1], 1, { tx: 668, ty: 652, side: 'r', col: C.amber });
      card(c, 1240, 400, L.mix[0], L.mix[1], (t - q.myaty - .2) / .35, { tx: 560, ty: 560, side: 'r', col: C.teal });
    });
    // 4. Рентген: срез сверху вниз, внутренности светятся
    sh(q.s1 - .05, 'blur', (c, t, u) => xray(c, t, u, { x: WW / 2 + 260, y: HH / 2 + 10, h: 860, r: -.12, s0: 1, scan: u => eio(u / 1.5),
      labels: (c, t, u) => { const k = (t - q.zhid) / .35; card(c, 230, 330, L.liquid[0], L.liquid[1], k, { tx: 1080, ty: 330, col: C.amber }); } }));
    // 5. Макро на испарителе: жидкость кипит у катушки
    sh(q.izobr - .1, 'punch', (c, t, u) => {
      xray(c, t, u, { x: WW / 2 + 120, y: HH / 2 + 650, h: 2700, r: -.05, s0: 1, scan: () => 1, heat: u => .6 + .4 * Math.sin(u * 4) });
      card(c, 180, 640, L.origin[0], L.origin[1], (t - q.tab1) / .35, { col: C.red, vs: 30 });
    });
    // 6. Механический счётчик: 2026 → 1973
    sh(q.p50 - .15, 'blur', (c, t, u) => counter(c, t, u));
    // 7. Ночной завод и башня «Рейнольдс» — общий план
    sh(q.tab - .2, 'flash', (c, t, u) => skyline(c, t, u, { pan0: 120, pan: 40, s: 1, zs: .012 }));
    // 8. Ближе: башня, ярлыки марок
    sh(q.sozd - .12, 'blur', (c, t, u) => skyline(c, t, u, { pan0: 0, pan: 30, s: 1.55, zs: .02, cy: -40, cx: 130,
      tags: (c, t, u) => {
        card(c, 880, 230, L.rjr[0], L.rjr[1], (t - q.sozd) / .35, { tx: 700, ty: 380, side: 'r', col: C.red, vs: 32 });
        card(c, 1300, 470, L.brand, L.camel, (t - q.camel) / .3, { tx: 1290, ty: 870, side: 'r', col: C.amber });
        card(c, 1300, 610, L.brand, L.winston, (t - q.winston) / .3, { tx: 1440, ty: 900, side: 'r', col: C.amber });
      } }));
    // 9. Стол под лампой: лист въезжает в свет, штамп «секретно»
    HITS.push(q.sekr);
    sh(q.gotov - .15, 'blur', (c, t, u) => { c.save(); view(c, .76 + u * .02, PX - 120, PY + 40, .02); memoWorld(c, t, { slide: u / .9, stampT: q.sekr, hl: 0 }); c.restore() });
    // 10. Шапка и строки документа: камера скользит вниз
    sh(q.s3 - .05, 'blur', (c, t, u) => { const [hx, hy] = paperXY(PW * .45, lp(200, 520, eio(u / 2))); c.save(); view(c, 1.45, hx, hy, -PR + .05); memoWorld(c, t, { stampT: -9 }); c.restore() });
    // 11. Макро: карточка досье на булавке, красная нить
    sh(q.zvuch - .05, 'punch', (c, t, u) => { c.save(); view(c, 2.1 + u * .05, 560, 600, .1); memoWorld(c, t, { stampT: -9 }); c.restore() });
    // 12. Маркер: «получить свою долю молодёжного рынка»
    sh(q.poluch - .25, 'blur', (c, t, u) => { const [hx, hy] = paperXY(330, 360 + 9 * 42 - 14); c.save(); view(c, 1.9 + u * .04, hx + 40, hy, -PR - .02); memoWorld(c, t, { stampT: -9, hl: eio((t - q.poluch + .05) / Math.max(.6, q.rynka + .35 - q.poluch)) }); c.restore() }, 'memo', 2.2);
    // ---------- сцены 3–4: дым, горло, лаборатория, архив, суд ----------
    Object.assign(Q, { s4: s(4), dym: w(4, 'дым'), slishkom: w(4, 'слишком'), edkiy: w(4, 'едкий'), deret: w(4, 'дерёт'), gorlo: w(4, 'горло'),
      s5: s(5), kisl: w(5, 'кислотой'), nikot: w(5, 'никотиновую'), sol: w(5, 'соль'), zahod: w(5, 'заходит'), myagko: w(5, 'мягко'), uboy: w(5, 'убойной'),
      s6: s(6), sekr6: w(6, 'секретную'), spryat: w(6, 'спрятали'), arhiv: w(6, 'архив'), dvad: w(6, 'двадцать'), e6: se(6),
      s7: s(7), sud: w(7, 'суд'), raskr: w(7, 'раскрыть'), chet: w(7, 'четырнадцать'), opubl: w(7, 'опубликовали'), kalif: w(7, 'калифорнии') });
    ch(q.s4 - .1, '03', 'ЛАБОРАТОРИЯ', '1973', 'ОТДЕЛ ИССЛЕДОВАНИЙ');
    ch(q.s6 - .1, '04', 'АРХИВ', t => String(Math.round(lp(1973, 1998, eio(at(t, q.arhiv, q.e6 + .3))))), 'СЕКРЕТНЫЙ АРХИВ');
    ch(q.s7 - .1, '05', 'СУД', '1998', 'ДОКУМЕНТЫ ОТКРЫТЫ');
    HITS.push(q.sud + .05, q.arhiv);
    // 13. Сигарета: тлеющий кончик, едкий дым
    sh(q.s4 - .1, 'blur', (c, t, u) => { cigarette(c, t, u); card(c, 180, 760, L.smoke[0], L.smoke[1], (t - q.dym + .05) / .35, { col: C.amber }) });
    // 14. Рентген горла: дым втягивается, гортань краснеет, наезд на гортань
    sh(q.edkiy - .2, 'punch', (c, t, u) => throat(c, t, u, { irr0: q.edkiy + .1, zoom: q.gorlo - .25 }));
    // 15. Лаборатория: общий план, бюретка капает в колбу
    sh(q.s5 - .1, 'blur', (c, t, u) => { c.save(); view(c, 1 + u * .03, 960, 560); labWorld(c, t, { level: .45 }); c.restore() });
    // 16. Макро колбы: никотин + кислота, раствор светлеет и закручивается
    sh(q.kisl - .25, 'punch', (c, t, u) => { c.save(); view(c, 2.25 + u * .06, 960, 640); labWorld(c, t, { level: .45, mix: u > .6 ? 1 : 0, swirl: cl(u / .8) }); c.restore(); card(c, 1250, 260, L.mixA[0], L.mixA[1], (u - .15) / .35, { tx: 1010, ty: 620, side: 'r', col: C.amber }) });
    // 17. Кристаллы соли растут в луче
    sh(q.nikot - .1, 'blur', (c, t, u) => { crystals(c, t, u); card(c, 180, 200, L.salt[0], L.salt[1], (t - q.sol + .05) / .35, { tx: 820, ty: 520, col: C.gold }) });
    // 18. Приборы: шкала «резко → мягко», доза — на максимум
    sh(q.zahod - .15, 'blur', (c, t, u) => phPanel(c, t, u, { soft0: q.myagko - .35, dose0: q.uboy - .1 }));
    // 19. Коридор секретного архива: камера едет к двери сейфа
    sh(q.s6 - .1, 'blur', (c, t, u) => corridor(c, t, { cz: -200 + u * 260, dust: 1 }));
    // 20. Ящик: папка «Проект 1973» уходит внутрь, ящик закрывается, штамп
    sh(q.sekr6 - .1, 'punch', (c, t, u) => drawer(c, t, u, { close: q.spryat + .05, stampT: q.arhiv }));
    // 21. 25 лет: лампы гаснут одна за другой
    sh(q.dvad - .2, 'blur', (c, t, u) => corridor(c, t, { cz: 300 + u * 120, lamps: i => 1 - cl((t - (q.dvad + i * .1)) / .15) * .9, dust: 1 }));
    // 22. 1998: суд — дверь сейфа открывается, свет
    sh(q.s7 - .1, 'flash', (c, t, u) => corridor(c, t, { cz: 4300 + u * 380, door: t => eio(cl((t - q.sud) / .9)), spin: t => eio(cl((t - q.s7) / (q.sud - q.s7 + .01))) * 4, dust: 1 }), 'vault', 2.4);
    // 23. «Раскрыть свои тайны»: ящики выдвигаются волной
    sh(q.raskr - .15, 'punch', (c, t, u) => corridor(c, t, { cz: 900 + u * 300, door: () => 1, open: (zi, r, sd) => eo(cl((t - q.raskr - .1 - (CZ - zi * CDZ) / 9000 - H1(zi * 9 + r * 3 + sd) * .25) / .3)), dust: 1 }));
    // 24. Стена из сотен ячеек: световая волна и счётчик 14 000 000
    sh(q.chet - .15, 'blur', (c, t, u) => cellsWall(c, t, u, { wave0: q.chet - .1, count0: q.chet }));
    // ---------- сцены 5–7: Калифорния, Стэнфорд, устройство, зависимость, сделка ----------
    Object.assign(Q, { s8: s(8), sosed: w(8, 'соседству'), stan: w(8, 'стэнфордским'), nahod: w(8, 'находят'),
      s9: s(9), pohozh: w(9, 'похожую'), flesh: w(9, 'флешку'), vnutri9: w(9, 'внутри'), sol9: w(9, 'соль'), y73b: w(9, '1973'),
      s10: s(10), kart: w(10, 'картридж'), pachku: w(10, 'пачку'), myag: w(10, 'мягкий'), shkol: w(10, 'школьники'), podsazh: w(10, 'подсаживались'),
      s11: s(11), kazhd: w(11, 'каждый'), tret: w(11, 'треть'), trin: w(11, 'тринадцать'), vykup: w(11, 'выкупил'), e11: se(11) });
    ch(q.opubl - .1, '06', 'КАЛИФОРНИЯ', '1998', 'АРХИВ UCSF');
    ch(q.stan - .2, '06', 'СТЭНФОРД', '37.43° N · 122.17° W', 'STANFORD');
    ch(q.s9 - .1, '06', 'СТЭНФОРД', '2015', 'ЗАПУСК УСТРОЙСТВА');
    ch(q.s10 - .1, '07', 'ЗАВИСИМОСТЬ', '2015–2019', 'США');
    ch(q.s11 - .1, '07', 'ЗАВИСИМОСТЬ', '2019', 'США · ШКОЛЫ');
    ch(q.tret - .15, '08', 'СДЕЛКА', '20.12.2018', '$12,8 МЛРД');
    HITS.push(q.y73b + .02);
    // 25. Карта точками: Калифорния, вспыхивает архив UCSF
    sh(q.opubl - .1, 'blur', (c, t, u) => mapScene(c, t, u, { z: t => .07 * cl(t - q.opubl, 0, 3), n1: q.kalif - .1 }));
    // 26. Зум в залив Сан-Франциско
    sh(q.s8 - .1, 'blur', (c, t, u) => mapScene(c, t, u, { z: t => .2 + .8 * eio(cl((t - q.s8) / 2.4)), n1: -9 }));
    // 27. Дуга к Стэнфорду: «по соседству», бумаги летят по дуге
    sh(q.stan - .2, 'punch', (c, t, u) => mapScene(c, t, u, { z: () => 1, n1: -9, arc: q.stan - .1, near: q.stan + .5, docs: q.nahod - .5 }), 'map', 2);
    // 28. Терминал: поиск по архиву, документ 1973 найден
    sh(q.nahod - .3, 'blur', (c, t, u) => monitor(c, t, u, { s: 1.12, fy: 470, screen: (c, x, y, w, h, t, u) => scrSearch(c, x, y, w, h, t, u, { found: q.nahod + .15 }) }));
    // 29. Чертёж устройства
    sh(q.s9 - .1, 'blur', (c, t, u) => monitor(c, t, u, { s: 1.06, screen: scrCAD }));
    // 30. «Похожую на флешку»: входит в порт ноутбука и светится
    sh(q.pohozh - .15, 'punch', (c, t, u) => usb(c, t, u, { ins: q.flesh + .1, lab: q.pohozh + .1 }));
    // 31. Рентген картриджа: внутри та самая соль
    sh(q.vnutri9 - .15, 'blur', (c, t, u) => podX(c, t, u, {}));
    // 32. Макро: кристаллы и штамп «1973»
    sh(q.sol9 - .2, 'punch', (c, t, u) => podX(c, t, u + 1, { s: 2, fx: 800, fy: 520, stampT: q.y73b + .02 }), 'pod', 1.6);
    // 33. Картридж = 20 сигарет
    sh(q.s10 - .1, 'blur', (c, t, u) => podVsCigs(c, t, u, { eq: q.kart + .2, c0: q.pachku - .25 }));
    // 34. Мягкий пар — горло «спокойно»
    sh(q.myag - .2, 'blur', (c, t, u) => throat(c, t, u, { calm: 1 }));
    // 35. Затяжки без остановки
    sh(q.shkol - .15, 'punch', (c, t, u) => puffs(c, t, u, {}));
    // 36. Нейросеть: красные импульсы
    sh(q.podsazh - .15, 'blur', (c, t, u) => neural(c, t, u, { t0: q.podsazh }));
    // 37. Сетка 10×10 школьников
    sh(q.s11 - .1, 'blur', (c, t, u) => people(c, t, u, { s: u => 1 + u * .03, app: q.s11, lit: q.kazhd + 9 }));
    // 38. Ближе: каждый четвёртый горит
    sh(q.kazhd - .2, 'punch', (c, t, u) => people(c, t, u, { s: u => 1.2 + u * .04, fx: 1010, fy: 520, app: -9, lit: q.kazhd - .1 }), 'kids', 1.4);
    // 39. Свечной график: 12,8 млрд
    sh(q.tret - .15, 'blur', (c, t, u) => chart(c, t, u, { n0: q.trin - .3 }), 'chart', 2.6);
    // 40. Пачка с красной крышей и 35 %
    sh(q.vykup - .15, 'punch', (c, t, u) => pack35(c, t, u, { r0: q.vykup }));
    // ---------- сцена 8 и тизер ----------
    Object.assign(Q, { s12: s(12), ideal: w(12, 'идеально'), prezir: w(12, 'презирали'), no: w(12, 'но'), plat: w(12, 'платите'), dan: w(12, 'дань'),
      s13: s(13), zat: w(13, 'затянуться'), e13: se(13), s14: s(14), malb14: w(14, 'мальборо'), prop: w(14, 'пропитывают'), smotr: w(14, 'смотрите'), yt: w(14, 'youtube') });
    ch(q.s12 - .1, '09', 'ПЛАН ВЫПОЛНЕН', '2026', 'СЕЙЧАС');
    ch(q.s14 - .3, '10', 'ПОЛНОЕ РАССЛЕДОВАНИЕ', 'YOUTUBE', 'ССЫЛКА В ПРОФИЛЕ');
    HITS.push(q.ideal, q.dan, q.zat + .1);
    // 41. Тот же меморандум: штамп «план выполнен»
    sh(q.s12 - .1, 'blur', (c, t, u) => { c.save(); view(c, 1.05 + u * .03, PX - 40, PY + 60, -PR); memoWorld(c, t, { stampT: -9, hl: 1, doneT: q.ideal }); c.restore() });
    // 42. «Вы презирали сигареты»: неон «не курить»
    sh(q.prezir - .15, 'punch', (c, t, u) => neonSign(c, t, u, {}));
    // 43. «Но всё равно платите им дань»: оплата принята, чек, штамп
    sh(q.no - .15, 'blur', (c, t, u) => pos(c, t, u, { paid: q.plat, daniT: q.dan }));
    // 44. Комната: красный огонёк, дым — «затянуться?»
    sh(q.s13 - .1, 'blur', (c, t, u) => { const k = eio(u / 3.4); c.save(); view(c, lp(1.15, 1.7, k), lp(1080, 1092, k), lp(600, 740, k)); room(c, t, { ledCol: '#ff3a2a', led: .5 + .5 * Math.sin(t * 2.2) + (t > q.zat ? 1.4 * Math.exp(-(t - q.zat) * 2) : 0), beam: .75, smoke: .42 }); c.restore();
      if (t > q.zat) { const k2 = cl((t - q.zat) / 1.2); smoke(c, t, WW / 2, HH * .8, { n: 26, life: 1.4, rise: 500, sway: 120, drift: 0, r0: 120, r1: 700, a: .3 * (1 - k2 * .4), seed: 171, from: q.zat }) } });
    // 45. Глитч → доска расследования
    const BO = { t0: q.s14 + .1, cards: [q.malb14 + .1, q.prop + .1, q.smotr - .2] };
    sh(q.s14 - .25, 'glitch', (c, t, u) => board(c, t, u, { ...BO, s: u => 1 + u * .02 }));
    // 46. Ближе: улики и карточки
    sh(q.prop - .25, 'blur', (c, t, u) => board(c, t, u, { ...BO, s: u => 1.35 + u * .03, fx: 960, fy: 760 }));
    // 47. Плашка YouTube
    sh(q.smotr - .25, 'blur', (c, t, u) => board(c, t, u, { ...BO, s: u => 1.08 + u * .01, plate: q.smotr - .1 }));
  }

  window.EP = {
    P, D, clean: false, lead: .1, tr: {}, trDef: 'cut', size: [WW, HH],
    cap: { size: 44, top: 905, font: 'U', hi: C.gold, st: '#05070c' },
    init(tl, SC) {
      SC.forEach(S => { D[S.key] = (t) => { frame(t); return '' } });
      document.getElementById('cap').style.textTransform = 'uppercase';
      document.getElementById('vig').style.display = 'none'; document.getElementById('grain').style.opacity = .3;
      if (!document.getElementById('v15f')) { const st = document.createElement('style'); st.id = 'v15f'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); A = mk(WW, HH); B = mk(WW, HH);
      SH = []; CHS = []; HITS = [];
      return Promise.all(['500 20px J', '700 20px J', '700 20px U', '700 20px O', '800 20px M'].map(f => document.fonts.load(f, 'АЯaz09'))).then(() => { smokeSprites(); build(tl) });
    },
  };
})();
