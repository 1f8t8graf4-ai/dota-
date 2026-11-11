// v16 — пробные кадры «по-новому» (11.11, без звука и голоса).
// По выводам 11.11: цвет как у Боба — у каждой главы свой фон из 4 цветов (тёмно-синий — одноразка сегодня, табачный
// янтарь — 1973, белая бумага — архив и суд, красный «Мальборо» — финал) + мятный акцент. Без рук: предметы двигаются
// сами, камера идёт за ними. Переходы как у Боба, без склеек: полоса превращается в вейп, наезд в окошко с жидкостью
// (год крутится назад), меморандум улетает в архив за косой шторкой, красный лист летит в камеру, «крыша» пачки
// становится долей 35 %. Без размытия, свечения, вспышек, зерна и виньетки; в кадре что-то меняется примерно раз в секунду.
// Факты: меморандум R.J. Reynolds 02.02.1973 (К. Тиг): «we must get our share of the youth market»; документы табачных
// компаний открыты по суду 1998 (Миннесота), в архиве UCSF их 14+ млн; Altria (производитель «Мальборо» в США) купила
// 35 % Juul за $12,8 млрд (20.12.2018). Логотипов нет: у пачки только «крыша», без надписей.
(function () {
  'use strict';
  const WW = 1920, HH = 1080, TAU = Math.PI * 2;
  const C = {
    n0: '#141935', n1: '#1f2858', n2: '#2e3c7e', n3: '#4558a8',
    red: '#e8475a', red2: '#c63449', red3: '#ff7f8e', mk: '#ffa6b0',
    wh: '#f8f4ec', white: '#ffffff', pa: '#ece4d4', pa2: '#d8cdb8',
    am: '#f2a33a', am2: '#d9812a', am3: '#ffc46a', am4: '#ffe3ae',
    mint: '#43d9b9', mint2: '#22a58b',
  };
  // ---- виды: цвета по ролям. «cola» — первая проба (палитра «Кока-Колы»); остальные — по другим оригиналам Боба (11.11) ----
  const R0 = {
    bg1: C.n0, disc1: C.n1, ring1: C.n2, band: C.red, bandGrad: null, title: C.wh,
    heroBody: C.red, heroShade: C.red2, heroMp: C.wh, heroMps: C.pa, heroCollar: C.n0, heroLabel: C.wh,
    rim: C.n1, glass: C.n0, liq: C.am, liq2: C.am3, led: C.mint,
    bgv: [{ body: C.mint, shade: C.mint2, mp: C.wh, mps: C.pa, lc: C.wh }, { body: C.wh, shade: C.pa2, mp: C.n3, mps: C.n2, lc: C.n0 }],
    cloud: C.wh, pill: C.wh, pillT: C.n0, sparks: [C.wh, C.am3, C.mint, C.wh],
    bg2: C.am, sun2: C.am3, gnd2: C.am2, bld: C.n1, bldD: C.n0, bldT: C.n2, winOff: C.n2, winOn: C.am4, ink2: C.n0,
    paper: C.white, ink: C.n0, ink1: C.n1, ink3: C.n2, typed: C.pa2, marker: C.mk, stampC: C.red, wipe: C.red,
    bg3: C.wh, disc3: C.pa, boxes: [[C.n1, C.n0, C.n2, C.n3], [C.n2, C.n1, C.n3, C.n2]], mainBox: C.n1, mainBoxD: C.n0,
    lidT: C.n3, lidF: C.n2, lidD: C.n1, lidIn: C.n2, lidIn2: C.n3, open: C.n0, label: C.white, labelInk: C.n0, labelInk2: C.n2,
    acc3: C.red, ink3c: C.n0, sheet: C.white, sheetO: C.n1, sheetL: C.n3, sheetH: C.red,
    gavH: C.n0, gavS: C.n2, gavS2: C.n1, gavB: C.red, gavHi: C.n2, hitLine: C.n0,
    bg4: C.red, band4: C.red2, ink4: C.n0, txt4: C.white, pie: C.white, wedge: C.n0, wedgeT: C.white, juul: C.n0, juulHi: C.n1, pod: C.mint, pod2: C.mint2,
    // приёмы из других роликов: звёзды и луна, город-силуэт, облака, прожектор, сетка-чертёж
    stars: 0, moon: 0, moonDot: '#d8d1ca', sky: null, clouds: null, spot: null, grid: null,
  };
  const LOOKS = {
    // «Инстаграм» (+ «Гугл», «Старбакс»): ночь в синих тонах, луна, окна-огоньки, свет прожектора; красный — только табак
    insta: {
      bg1: '#0b1650', disc1: '#e7e1dc', ring1: '#2a4f9a', band: '#cc234a', title: '#f2ede6',
      heroBody: '#cc234a', heroShade: '#9e1a3a', heroMp: '#f2ede6', heroMps: '#c9c1b6', heroCollar: '#060e38', heroLabel: '#f2ede6',
      rim: '#060e38', glass: '#040a2a', liq: C.am, liq2: C.am3, led: '#66c7f0',
      bgv: [{ body: '#1d8fd1', shade: '#0b5f9a', mp: '#f2ede6', mps: '#c9c1b6', lc: '#f2ede6' }, { body: '#f2ede6', shade: '#c9c1b6', mp: '#14356f', mps: '#0b2858', lc: '#0f2460' }],
      cloud: '#f2ede6', pill: '#f2ede6', pillT: '#0f2460', sparks: ['#f2ede6', '#ffd36e', '#66c7f0', '#f2ede6'],
      bg2: '#0d3f86', sun2: '#e7e1dc', gnd2: '#082a63', bld: '#06153f', bldD: '#030b2a', bldT: '#14356f', winOff: '#14356f', winOn: '#ffd36e', ink2: '#f2ede6',
      paper: '#f2ede6', ink: '#0f2460', ink1: '#14356f', ink3: '#0b5088', typed: '#cfc6ba', marker: '#ffb3c0', stampC: '#cc234a', wipe: '#cc234a',
      bg3: '#0b1f5c', disc3: '#112a6e', boxes: [['#1d4a94', '#123172', '#2a63b0', '#3a7cc9'], ['#24589f', '#173a80', '#3270bd', '#2a63b0']], mainBox: '#1d4a94', mainBoxD: '#123172',
      lidT: '#3a7cc9', lidF: '#2a63b0', lidD: '#1d4a94', lidIn: '#2a63b0', lidIn2: '#3a7cc9', open: '#040a2a', label: '#f2ede6', labelInk: '#0f2460', labelInk2: '#0b5088',
      acc3: '#ff5a6e', ink3c: '#f2ede6', sheet: '#f2ede6', sheetO: '#0b1f5c', sheetL: '#3a7cc9', sheetH: '#cc234a',
      gavH: '#f2ede6', gavS: '#c9c1b6', gavS2: '#a69e96', gavB: '#cc234a', gavHi: '#ffffff', hitLine: '#f2ede6',
      bg4: '#cc234a', band4: '#a51c3d', ink4: '#0b1650', txt4: '#f2ede6', pie: '#f2ede6', wedge: '#0b1650', wedgeT: '#f2ede6', juul: '#060e38', juulHi: '#14356f',
      stars: 1, moon: 1, sky: ['#060e38', '#08144a'], spot: '#cfe0ff',
    },
    // «Да Винчи» (+ «Соболев»): тёмно-синий, синий и жёлтый, белая бумага-чертёж
    davinci: {
      bg1: '#131d3c', disc1: '#2e65a0', ring1: '#4a8ec9', band: '#e9bf3c', title: '#131d3c',
      heroBody: '#e9bf3c', heroShade: '#c99a1e', heroMp: '#fcfcfc', heroMps: '#bcd1e2', heroCollar: '#131d3c', heroLabel: '#131d3c',
      rim: '#0b1229', glass: '#070c1c', liq: '#f0943a', liq2: '#ffc27a', led: '#4a8ec9',
      bgv: [{ body: '#4a8ec9', shade: '#2e65a0', mp: '#fcfcfc', mps: '#bcd1e2', lc: '#fcfcfc' }, { body: '#fcfcfc', shade: '#bcd1e2', mp: '#e9bf3c', mps: '#c99a1e', lc: '#131d3c' }],
      cloud: '#fcfcfc', pill: '#fcfcfc', pillT: '#131d3c', sparks: ['#fcfcfc', '#e9bf3c', '#4a8ec9', '#fcfcfc'],
      bg2: '#2e65a0', sun2: '#e9bf3c', gnd2: '#21508a', bld: '#131d3c', bldD: '#0b1229', bldT: '#3d506e', winOff: '#3d506e', winOn: '#e9bf3c', ink2: '#fcfcfc',
      paper: '#fcfcfc', ink: '#131d3c', ink1: '#2e4566', ink3: '#2e65a0', typed: '#bcd1e2', marker: '#f6d66b', stampC: '#d9465a', wipe: '#e9bf3c',
      bg3: '#f3f5f7', disc3: '#dde7f1', boxes: [['#2e65a0', '#21508a', '#4a8ec9', '#6aa5d8'], ['#4a8ec9', '#2e65a0', '#6aa5d8', '#4a8ec9']], mainBox: '#131d3c', mainBoxD: '#0b1229',
      lidT: '#4a6690', lidF: '#2e4566', lidD: '#1f3150', lidIn: '#2e4566', lidIn2: '#4a6690', open: '#0b1229', label: '#fcfcfc', labelInk: '#131d3c', labelInk2: '#2e65a0',
      acc3: '#2e65a0', ink3c: '#131d3c', sheet: '#fcfcfc', sheetO: '#131d3c', sheetL: '#4a8ec9', sheetH: '#e9bf3c',
      gavH: '#131d3c', gavS: '#2e65a0', gavS2: '#21508a', gavB: '#e9bf3c', gavHi: '#3d506e', hitLine: '#131d3c',
      bg4: '#131d3c', band4: '#1c2a50', ink4: '#e9bf3c', txt4: '#fcfcfc', pie: '#fcfcfc', wedge: '#e9bf3c', wedgeT: '#131d3c', juul: '#4a5f86', juulHi: '#6a7fa6',
      grid: '#e1e8f0',
    },
    // «Тиндер» (+ «Мадонна», «Танки»): светлый крем, белые облака, коралл, бирюза, жёлтый
    tinder: {
      bg1: '#ece5c5', disc1: '#e2d8b2', ring1: '#cbbd92', band: '#f26d5b', bandGrad: ['#f7873e', '#e6457b'], title: '#ffffff',
      heroBody: '#f26d5b', heroShade: '#d6503f', heroMp: '#ffffff', heroMps: '#d3c9ac', heroCollar: '#413e4d', heroLabel: '#ffffff',
      rim: '#413e4d', glass: '#2c2a36', liq: '#f4bd5d', liq2: '#fbe3a6', led: '#608f9e',
      bgv: [{ body: '#608f9e', shade: '#4b7380', mp: '#ffffff', mps: '#d3c9ac', lc: '#ffffff' }, { body: '#ffffff', shade: '#d3c9ac', mp: '#413e4d', mps: '#2c2a36', lc: '#413e4d' }],
      cloud: '#ffffff', pill: '#ffffff', pillT: '#413e4d', sparks: ['#f26d5b', '#608f9e', '#f4bd5d', '#413e4d'],
      bg2: '#f4bd5d', sun2: '#fbe3a6', gnd2: '#e4a23f', bld: '#413e4d', bldD: '#2c2a36', bldT: '#515573', winOff: '#515573', winOn: '#fbe3a6', ink2: '#413e4d',
      paper: '#ffffff', ink: '#413e4d', ink1: '#515573', ink3: '#657083', typed: '#e6dcc0', marker: '#ffc2b0', stampC: '#e6457b', wipe: '#f26d5b',
      bg3: '#f6f2e7', disc3: '#ebe2c8', boxes: [['#608f9e', '#4b7380', '#7aa8b6', '#93bccb'], ['#515573', '#413e4d', '#657083', '#7a85a0']], mainBox: '#413e4d', mainBoxD: '#2c2a36',
      lidT: '#7a85a0', lidF: '#657083', lidD: '#515573', lidIn: '#657083', lidIn2: '#7a85a0', open: '#2c2a36', label: '#ffffff', labelInk: '#413e4d', labelInk2: '#657083',
      acc3: '#e6457b', ink3c: '#413e4d', sheet: '#ffffff', sheetO: '#413e4d', sheetL: '#608f9e', sheetH: '#f26d5b',
      gavH: '#413e4d', gavS: '#657083', gavS2: '#515573', gavB: '#f26d5b', gavHi: '#7a85a0', hitLine: '#413e4d',
      bg4: '#515573', band4: '#474a66', ink4: '#f4bd5d', txt4: '#ffffff', pie: '#ffffff', wedge: '#f4bd5d', wedgeT: '#413e4d', juul: '#2c2a36', juulHi: '#413e4d', pod: '#8fd3c4', pod2: '#5fb0a0',
      clouds: '#ffffff',
    },
  };
  const LOOK = { v16i: 'insta', v16d: 'davinci', v16t: 'tinder' }[window.V16NAME] || 'cola';
  const R = Object.assign({}, R0, LOOKS[LOOK] || {});
  const T = {
    morph: 1.45, morphE: 2.1, zoom: 3.75, zoomE: 4.55, cnt: 4.2, cntE: 4.95,
    s2: 4.55, memo: 5.75, typ: 6.1, quote: 6.75, mark: 6.95, sig: 7.25, stamp: 7.55,
    w2: 8.25, w2E: 8.85, drop: 8.95, inn: 9.2, yr: 9.55, hit: 10.95, n14: 11.85, fly: 12.75, s4: 12.75, end: 16.6,
  };
  const SH4 = .6;   // красная глава идёт на SH4 позже, чем записано в её таймингах
  const D = {};
  let cv = null, X = null, MEMO = null, MA = null, MB = null;

  // ================= утилиты =================
  const cl = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, lp = (a, b, k) => a + (b - a) * k;
  const at = (t, a, b) => cl((t - a) / (b - a));
  const ss = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k) };
  const eo = k => 1 - Math.pow(1 - cl(k), 3), ei = k => Math.pow(cl(k), 3);
  const eio = k => { k = cl(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 };
  const bo = k => { k = cl(k); const s = 2.2; return 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2) };
  const spr = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-6.2 * k) * Math.cos(10.5 * k);
  const H1 = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) };
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mixc = (a, b, k) => { const A = hex(a), B = hex(b); return 'rgb(' + A.map((v, i) => Math.round(lp(v, B[i], cl(k)))).join(',') + ')' };
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r) };
  const poly = (c, p) => { c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath() };
  const fill = (c, col) => { c.fillStyle = col; c.fill() };
  const circ = (c, x, y, r, col) => { if (r <= 0) return; c.beginPath(); c.arc(x, y, r, 0, TAU); fill(c, col) };
  // камера: точка мира (x, y) — в центре кадра, масштаб s, поворот r
  const cam = (c, s, x, y, r = 0) => { c.translate(WW / 2, HH / 2); if (r) c.rotate(r); c.scale(s, s); c.translate(-x, -y) };
  const pulse = (t, a) => at(t, a - .08, a) * (1 - at(t, a + .45, a + .7));

  // ================= текст =================
  const FNT = o => `${o.w || 800} ${o.s || 40}px ${o.f || 'M'}`;
  function tw(c, s, o = {}) { c.save(); c.font = FNT(o); c.letterSpacing = (o.ls || 0) + 'px'; const w = c.measureText(s).width - (o.ls || 0); c.restore(); return w }
  function tx(c, s, x, y, o = {}) {
    if (!s || (o.a ?? 1) <= 0) return;
    c.save(); c.font = FNT(o); c.letterSpacing = (o.ls || 0) + 'px'; const al = o.al || 'center';
    c.textAlign = al; c.textBaseline = 'middle'; c.globalAlpha *= o.a ?? 1; c.fillStyle = o.c || C.wh;
    c.fillText(s, x + (al === 'center' ? (o.ls || 0) / 2 : al === 'right' ? (o.ls || 0) : 0), y); c.restore();
  }
  // число в ровных клетках — цифры не прыгают, пока считают
  function num(c, s, x, y, o) {
    c.save(); c.font = FNT(o); c.letterSpacing = '0px'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = o.c; c.globalAlpha *= o.a ?? 1;
    const dw = c.measureText('0').width * 1.02, cw = ch => /[0-9]/.test(ch) ? dw : ch === ' ' ? dw * .38 : c.measureText(ch).width + dw * .05;
    let px = x - [...s].reduce((n, ch) => n + cw(ch), 0) / 2;
    for (const ch of s) { const w = cw(ch); if (ch !== ' ') c.fillText(ch, px + w / 2, y); px += w }
    c.restore();
  }
  // счётчик-барабан: v — дробное число, цифры прокручиваются
  function odo(c, v, x, y, o) {
    const n = o.n || 4;
    c.save(); c.font = FNT(o); c.letterSpacing = '0px'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = o.c; c.globalAlpha *= o.a ?? 1;
    const dw = c.measureText('0').width * 1.02, Hh = (o.s || 40) * 1.12, x0 = x - dw * n / 2;
    for (let i = 0; i < n; i++) {
      const p = 10 ** (n - 1 - i), whole = Math.floor(v / p), rem = v - whole * p, d = ((whole % 10) + 10) % 10, fr = cl(rem - (p - 1));
      const cx = x0 + dw * (i + .5);
      c.save(); c.beginPath(); c.rect(cx - dw / 2 - 4, y - Hh * .55, dw + 8, Hh * 1.1); c.clip();
      c.fillText(String(d), cx, y - fr * Hh); if (fr > 0) c.fillText(String((d + 1) % 10), cx, y - fr * Hh + Hh);
      c.restore();
    }
    c.restore();
  }
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  function pill(c, s, x, y, k, o = {}) {
    if (k <= 0) return;
    const fs = o.s || 26, w = tw(c, s, { s: fs, ls: 4 }) + 46, h = fs + 26;
    c.save(); c.translate(x, y); c.scale(k, k);
    rr(c, -w / 2, -h / 2, w, h, h / 2); fill(c, o.bg || R.pill);
    tx(c, s, 0, 1, { s: fs, ls: 4, c: o.c || R.pillT }); c.restore();
  }

  // ================= одноразка =================
  function leafPath(c, x, y, L, W) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + L * .5, y - W, x + L, y); c.quadraticCurveTo(x + L * .5, y + W, x, y); c.closePath() }
  // окошко с жидкостью: центр (0,0), 124×270
  function win(c, o) {
    rr(c, -62, -135, 124, 270, 46); fill(c, R.rim);
    rr(c, -50, -123, 100, 246, 36); fill(c, R.glass);
    c.save(); rr(c, -50, -123, 100, 246, 36); c.clip();
    const lv = o.level ?? -52, t = o.t || 0;
    c.beginPath(); c.moveTo(-60, lv);
    for (let x = -60; x <= 60; x += 6) c.lineTo(x, lv + Math.sin(x * .07 + t * 3.2) * 4);
    c.lineTo(60, 140); c.lineTo(-60, 140); c.closePath(); fill(c, o.liq || C.am);
    const ba = o.bub ?? 1;
    if (ba > 0) {
      c.globalAlpha *= ba; c.fillStyle = o.liq2 || C.am3;
      for (let i = 0; i < 6; i++) { const ph = (t * (.35 + .2 * H1(i)) + H1(i * 3.1)) % 1, y = lp(118, lv + 14, ph), x = -32 + 64 * H1(i * 7.7) + Math.sin(t * 2 + i) * 4; c.beginPath(); c.arc(x, y, 3 + 4 * H1(i * 1.3), 0, TAU); c.fill() }
    }
    c.restore();
    rr(c, -36, -108, 10, 120, 5); fill(c, 'rgba(255,255,255,.35)');
  }
  // корпус 230×640, центр (0,0); мундштук сверху (до y = −462)
  function vapeBody(c, o) {
    const w = 230, h = 640, mk = o.mk ?? 1, wk = o.wk ?? 1, lk = o.lk ?? 1;
    if (mk > 0) {
      c.save(); c.translate(0, -h / 2 + 8); c.scale(1, mk);
      c.beginPath(); c.moveTo(-84, 0); c.lineTo(-58, -132); c.quadraticCurveTo(-54, -150, -36, -150); c.lineTo(36, -150); c.quadraticCurveTo(54, -150, 58, -132); c.lineTo(84, 0); c.closePath();
      fill(c, o.mp); c.save(); c.clip(); c.fillStyle = o.mps; c.fillRect(26, -160, 80, 170); c.restore();
      rr(c, -30, -140, 60, 12, 6); fill(c, R.glass);
      c.restore();
    }
    rr(c, -w / 2, -h / 2, w, h, 58); fill(c, o.body);
    c.save(); rr(c, -w / 2, -h / 2, w, h, 58); c.clip(); c.fillStyle = o.shade; c.fillRect(w / 2 - 70, -h / 2, 80, h); c.restore();
    rr(c, -w / 2 + 24, -h / 2 + 80, 12, h - 240, 6); fill(c, 'rgba(255,255,255,.3)');
    if (mk > 0) { const cw = (w + 10) * Math.min(1, mk); rr(c, -cw / 2, -h / 2 - 6, cw, 36, 16); fill(c, o.collar || R.rim) }
    if (wk > 0) { c.save(); c.translate(0, -40); c.scale(wk, wk); win(c, o); c.restore() }
    if (lk > 0 && o.label) tx(c, o.label, 0, 150, { s: 34, ls: 6, c: o.lc || C.wh, a: lk });
    circ(c, 0, 250, 13, R.rim);
    const led = o.led || 0;
    if (led > 0) { c.save(); c.globalAlpha *= led; circ(c, 0, 250, 13, R.led); c.beginPath(); c.arc(0, 250, 24, 0, TAU); c.strokeStyle = R.led; c.lineWidth = 4; c.globalAlpha *= .55; c.stroke(); c.restore() }
  }
  // пар — плоские облачка без размытия
  function cloud(c, x, y, s, a, seed, col) {
    if (a <= 0 || s <= 0) return;
    c.save(); c.globalAlpha *= a; c.beginPath();
    for (const [bx, by, br] of [[0, 0, 46], [-44, 12, 34], [42, 10, 36], [-18, -30, 32], [22, -26, 30], [0, 22, 30]]) {
      const r = br * s * (.9 + .2 * H1(seed + bx * .37)), px = x + bx * s, py = y + by * s; c.moveTo(px + r, py); c.arc(px, py, r, 0, TAU);
    }
    fill(c, col || R.cloud); c.restore();
  }
  function puff(c, t, t0, x, y, dir = 1, sc = 1) {
    for (const [d, dx, dy, s0, s1, a0] of [[0, 60, 260, .3, 1.45, 1], [.16, -40, 200, .25, 1.1, .9]]) {
      const k = at(t, t0 + d, t0 + d + 1.45); if (k <= 0 || k >= 1) continue;
      const e = eo(k), z = ss(0, .12, k) * (1 - ss(.55, 1, k));
      cloud(c, x + dx * dir * e * sc, y - dy * e * sc, lp(s0, s1, e) * sc * z, 1, t0 * 7 + d * 13);
    }
  }
  function mango(c, x, y, s, r) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.save(); c.translate(-6, -70); c.rotate(-.55); leafPath(c, 0, 0, 96, 34); fill(c, C.mint2);
    c.beginPath(); c.moveTo(6, 0); c.lineTo(82, 0); c.strokeStyle = C.mint; c.lineWidth = 4; c.lineCap = 'round'; c.stroke(); c.restore();
    c.beginPath(); c.ellipse(0, 0, 100, 80, -.35, 0, TAU); fill(c, C.am2);
    c.save(); c.clip(); c.beginPath(); c.ellipse(-22, -18, 100, 80, -.35, 0, TAU); fill(c, C.am); c.restore();
    c.beginPath(); c.ellipse(-44, -30, 26, 12, -.6, 0, TAU); fill(c, C.am4);
    c.restore();
  }
  function mintLeaf(c, x, y, s, r) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    leafPath(c, -120, 0, 240, 100); fill(c, C.mint);
    c.save(); c.clip(); c.fillStyle = C.mint2; c.fillRect(-130, 0, 260, 120); c.restore();
    c.strokeStyle = C.mint2; c.lineWidth = 6; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-160, 0); c.lineTo(96, 0); c.stroke();
    for (let i = 0; i < 4; i++) { const x0 = -74 + i * 46; c.beginPath(); c.moveTo(x0, 0); c.lineTo(x0 + 34, -38 + i * 6); c.stroke() }
    c.restore();
  }
  function spark(c, x, y, r, col) {
    if (r <= 0) return;
    c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); fill(c, col);
  }

  // ================= приёмы из других роликов Боба =================
  // звёзды мерцают («Инстаграм», «Старбакс»)
  function stars(c, t, n, seed, col) {
    c.save(); c.fillStyle = col;
    for (let i = 0; i < n; i++) {
      const x = H1(seed + i * 3.1) * 2300 - 190, y = H1(seed + i * 7.3) * 700 - 60, r = 1.6 + 2.6 * H1(seed + i * 1.7);
      c.globalAlpha = .35 + .65 * (.5 + .5 * Math.sin(t * (1.2 + 2 * H1(i + seed)) + i * 1.9));
      c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    }
    c.restore();
  }
  // кратеры луны
  function moonDots(c, x, y, r) {
    if (r <= 0) return; c.save(); c.beginPath(); c.arc(x, y, r, 0, TAU); c.clip();
    for (const [dx, dy, q] of [[-.42, -.28, .16], [.3, -.5, .09], [.46, .16, .13], [-.3, .42, .1], [-.05, -.62, .06], [.62, -.18, .07]]) circ(c, x + dx * r, y + dy * r, q * r, R.moonDot);
    c.restore();
  }
  // город-силуэт в два ряда, в окнах редкие огоньки («Инстаграм»)
  function skyline(c, cols, seed) {
    for (let row = 0; row < 2; row++) {
      let x = -280 + row * 70; const base = 1130, col = cols[1 - row];
      while (x < 2250) {
        const w = 90 + 110 * H1(seed + x * .013 + row * 7), h = (row ? 120 : 230) + (row ? 150 : 230) * H1(seed + x * .021 + row * 3);
        c.fillStyle = col; c.fillRect(x, base - h, w, h + 60);
        if (H1(x * .7 + row) > .6) poly(c, [x, base - h, x + w / 2, base - h - 40 - 30 * H1(x), x + w, base - h]), fill(c, col);
        if (row) for (let j = 0; j < 8; j++) if (H1(x * .31 + j * 1.7) > .7) { c.fillStyle = R.winOn; c.fillRect(x + 16 + (j % 4) * 22, base - h + 26 + Math.floor(j / 4) * 40, 10, 16) }
        x += w + 10 + 30 * H1(x * .05 + row);
      }
    }
  }
  // облака с плоским дном («Тиндер»)
  function bank(c, x, y, w, col) {
    c.beginPath(); c.roundRect(x - w / 2, y - 28, w, 56, 28);
    for (const [dx, dy, r] of [[-.18, -30, .19], [.12, -40, .23], [.3, -18, .14]]) { const cx = x + dx * w, cy = y + dy, rr2 = r * w; c.moveTo(cx + rr2, cy); c.arc(cx, cy, rr2, 0, TAU) }
    fill(c, col);
  }
  function banks(c, t, col, seed) {
    for (let i = 0; i < 4; i++) { const w = 260 + 200 * H1(seed + i * 5.3), x = (H1(seed + i * 2.3) * 2500 + t * (16 + 12 * H1(i + seed))) % 2600 - 330, y = 120 + H1(seed + i * 4.1) * 330; bank(c, x, y, w, col) }
  }
  // луч прожектора сверху на главную коробку («Гугл» — паноптикум)
  function spotlight(c, t, col) {
    const a = .08 + .015 * Math.sin(t * 2.2);
    c.save(); c.globalAlpha = a; poly(c, [880, -80, 1040, -80, 1270, 905, 650, 905]); fill(c, col);
    c.globalAlpha = a * 1.4; c.beginPath(); c.ellipse(960, 905, 330, 44, 0, 0, TAU); fill(c, col); c.restore();
  }
  // сетка-чертёж («Да Винчи»)
  function blueprint(c, col) {
    c.save(); c.strokeStyle = col; c.lineWidth = 2; c.beginPath();
    for (let x = -64; x <= WW + 64; x += 64) { c.moveTo(x, -80); c.lineTo(x, HH + 80) }
    for (let y = -64; y <= HH + 64; y += 64) { c.moveTo(-80, y); c.lineTo(WW + 80, y) }
    c.stroke(); c.restore();
  }

  // ================= 1. одноразка сегодня (тёмно-синий) =================
  const V1 = { x: 960, y: 648, r: -.1, s: .86 };
  const rot = (x, y, r) => [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
  const v1p = (lx, ly) => { const [x, y] = rot(lx * V1.s, ly * V1.s, V1.r); return [V1.x + x, V1.y + y] };
  const BGV = [
    { x: 320, y: 770, r: .16, s: .58, t0: 2.7, ...R.bgv[0], label: 'MINT', puff: 3.05 },
    { x: 1610, y: 750, r: -.2, s: .56, t0: 2.85, ...R.bgv[1], label: 'BERRY', puff: 3.45 },
  ];
  const PUFF1 = [2.5, 3.3];
  function cam1(t) {
    const [fx, fy] = v1p(0, 30);   // точка внутри жидкости
    const kp = eio(at(t, T.morphE, T.zoom));
    const s0 = lp(1, 1.07, kp), x0 = lp(960, 960 + (fx - 960) * .3, kp), y0 = lp(540, 540 + (fy - 540) * .3, kp);
    const kz = at(t, T.zoom, T.zoomE);
    if (kz <= 0) return { s: s0, x: x0, y: y0, r: 0 };
    // наезд в точку: точка плавно уходит в центр кадра, масштаб растёт по экспоненте, вейп встаёт ровно
    const e = eio(kz), s = s0 * Math.pow(48 / s0, e), r = lp(0, -V1.r, e);
    const P0x = 960 + s0 * (fx - x0), P0y = 540 + s0 * (fy - y0), m = ss(0, .8, kz);
    const [qx, qy] = rot((lp(P0x, 960, m) - 960) / s, (lp(P0y, 540, m) - 540) / s, -r);
    return { s, x: fx - qx, y: fy - qy, r };
  }
  function titleBand(c, t) {
    const hb = 300 * eo(at(t, 0, .38));
    c.fillStyle = R.bandGrad ? (() => { const g = c.createLinearGradient(0, 0, WW, 0); g.addColorStop(0, R.bandGrad[0]); g.addColorStop(1, R.bandGrad[1]); return g })() : R.band; c.fillRect(-60, 540 - hb / 2, WW + 120, hb);
    c.save(); c.beginPath(); c.rect(0, 540 - hb / 2, WW, hb); c.clip();
    const out = eio(at(t, 1.2, 1.42)) * 300;
    const line = (W, y, o, t0, st) => {
      const sp = tw(c, ' ', o) + (o.ls || 0), ws = W.map(w => tw(c, w, o)), tot = ws.reduce((a, b) => a + b, 0) + sp * (W.length - 1);
      let x = 960 - tot / 2;
      W.forEach((w, j) => { const k = eo(at(t, t0 + j * st, t0 + j * st + .32)); if (k > 0) tx(c, w, x, y + (1 - k) * 110 - out, { ...o, al: 'left', a: 1 }); x += ws[j] + sp });
    };
    line(['ЧТО', 'ВЫ', 'ЗНАЕТЕ'], 478, { s: 46, w: 600, ls: 12, c: R.title }, .22, .07);
    line(['ОБ', 'ОДНОРАЗКАХ?'], 590, { s: 124, w: 800, c: R.title }, .5, .13);
    c.restore();
  }
  function heroVape(c, t) {
    const k = eio(at(t, T.morph, T.morphE));
    if (k < 1) {
      const cx = lp(960, V1.x, k), cy = lp(540, V1.y, k), w = lp(2000, 230 * V1.s, k), h = lp(300, 640 * V1.s, k), r = Math.min(lp(0, 58 * V1.s, k), w / 2, h / 2), ro = lp(0, V1.r, k);
      c.save(); c.translate(cx, cy); c.rotate(ro); rr(c, -w / 2, -h / 2, w, h, r); fill(c, R.heroBody);
      const sw = 70 * V1.s * ss(.55, 1, k); if (sw > 0) { c.clip(); c.fillStyle = R.heroShade; c.fillRect(w / 2 - sw, -h / 2, sw, h) }
      c.restore();
      if (t < T.morphE - .06) return;
    }
    const led = Math.max(...PUFF1.map(a => pulse(t, a)));
    c.save(); c.translate(V1.x, V1.y); c.rotate(V1.r); c.scale(V1.s, V1.s);
    vapeBody(c, { body: R.heroBody, shade: R.heroShade, mp: R.heroMp, mps: R.heroMps, liq: R.liq, liq2: R.liq2, label: 'MANGO', lc: R.heroLabel, collar: R.heroCollar, t, led,
      mk: bo(at(t, T.morphE - .06, T.morphE + .26)), wk: spr(at(t, T.morphE - .02, T.morphE + .42)), lk: at(t, T.morphE + .1, T.morphE + .35),
      bub: 1 - at(t, T.zoom, T.zoom + .25) });
    c.restore();
  }
  function bgVape(c, t, b) {
    const k = eo(at(t, b.t0, b.t0 + .5)); if (k <= 0) return;
    c.save(); c.translate(b.x, b.y + (1 - k) * 760); c.rotate(b.r); c.scale(b.s, b.s);
    vapeBody(c, { body: b.body, shade: b.shade, mp: b.mp, mps: b.mps, liq: R.liq, liq2: R.liq2, label: b.label, lc: b.lc, led: pulse(t, b.puff), t: t + b.x, level: -40 });
    c.restore();
  }
  function shot1(c, t) {
    c.fillStyle = R.bg1; c.fillRect(0, 0, WW, HH);
    const K = cam1(t);
    c.save(); cam(c, K.s, K.x, K.y, K.r);
    if (R.stars) stars(c, t, 70, 3, R.title);
    if (R.clouds) banks(c, t, R.clouds, 5);
    if (t < T.morph) titleBand(c, t);
    else {
      const kd1 = eo(at(t, T.morph + .15, T.morph + .75)); circ(c, 960, 612, 480 * kd1, R.disc1); if (R.moon) moonDots(c, 960, 612, 480 * kd1);
      const kr = eio(at(t, T.morph + .4, T.morph + 1.1));
      if (kr > 0) { c.save(); c.beginPath(); const a0 = -Math.PI / 2 + t * .15; c.arc(960, 612, 548, a0, a0 + TAU * kr); c.setLineDash([42, 26]); c.strokeStyle = R.ring1; c.lineWidth = 6; c.stroke(); c.restore() }
      for (const [x, y, t0, r, col] of [[760, 232, 3.05, 24, R.sparks[0]], [1205, 178, 3.2, 18, R.sparks[1]], [1236, 905, 3.38, 22, R.sparks[2]], [690, 940, 3.5, 16, R.sparks[3]]]) spark(c, x, y, r * spr(at(t, t0, t0 + .4)) * (1 + .15 * Math.sin(t * 6 + x)), col);
      if (R.sky) skyline(c, R.sky, 11);
      for (const b of BGV) bgVape(c, t, b);
      const km = spr(at(t, 2.25, 2.7)); mango(c, 540, 390 + Math.sin(t * 2.2) * 8, km, -.15 + .05 * Math.sin(t * 1.7));
      const kn = spr(at(t, 2.42, 2.87)); mintLeaf(c, 1390, 360 + Math.sin(t * 2 + 1) * 8, kn * .95, -.55 + .06 * Math.sin(t * 1.9 + 1));
      pill(c, 'МАНГО', 540, 528, spr(at(t, 2.4, 2.8)));
      pill(c, 'МЯТА', 1390, 492, spr(at(t, 2.57, 2.97)));
      heroVape(c, t);
      const [px, py] = v1p(0, -470); for (const a of PUFF1) puff(c, t, a, px, py, 1, 1);
      for (const b of BGV) { const [qx, qy] = rot(0, -470 * b.s, b.r); puff(c, t, b.puff, b.x + qx, b.y + qy, b.r > 0 ? 1 : -1, .62) }
    }
    c.restore();
    // жидкость не того цвета, что 1973, — из центра раскрывается круг цвета 1973
    if (R.liq !== R.bg2) { const k = eio(at(t, 4.12, 4.5)); if (k > 0) circ(c, 960, 540, k * 1150, R.bg2) }
    yearTag(c, t);
  }
  // год: 2026 крутится назад до 1973 и уезжает в угол
  function yearTag(c, t) {
    if (t < T.cnt) return;
    const a = spr(at(t, T.cnt, T.cnt + .3)), v = lp(2026, 1973, eio(at(t, T.cnt + .05, T.cntE)));
    const e = eio(at(t, T.cntE + .05, T.cntE + .5));
    c.save(); c.translate(lp(960, 174, e), lp(540, 112, e)); const s = lp(1, 84 / 250, e) * a; c.scale(s, s);
    odo(c, v, 0, 0, { s: 250, c: R.ink2 }); c.restore();
  }

  // ================= 2. 1973 (табачный янтарь) =================
  const BT = [[500, 0, -250], [380, -250, -470], [270, -470, -620], [180, -620, -720]];
  function building(c, t, x0, y0) {
    c.save(); c.translate(x0, y0); c.scale(.9, .9);
    for (const [w, a, b] of BT) { c.fillStyle = R.bld; c.fillRect(-w / 2, b, w, a - b) }
    poly(c, [-64, -720, 64, -720, 30, -800, -30, -800]); fill(c, R.bld);
    c.fillStyle = R.bld; c.fillRect(-7, -872, 14, 80);
    for (const [w, a, b] of BT) { c.fillStyle = R.bldD; c.fillRect(w / 2 - w * .14, b, w * .14, a - b); c.fillStyle = R.bldT; c.fillRect(-w / 2, b, w, 9) }
    let idx = 0;
    for (const [w, a, b] of BT) {
      const cols = Math.floor((w - 40) / 40), x1 = -((cols - 1) * 40) / 2;
      for (let y = b + 34; y < a - 30; y += 38) for (let j = 0; j < cols; j++) {
        const t0 = 5.15 + H1(idx * 1.7 + 3) * 1.05, lit = at(t, t0, t0 + .08); idx++;
        c.fillStyle = lit >= 1 ? R.winOn : lit > 0 ? mixc(R.winOff, R.winOn, lit) : R.winOff;
        c.fillRect(x1 + j * 40 - 8, y, 16, 22);
      }
    }
    c.restore();
  }
  const MW = 640, MH = 800;
  function stamp(c, t, x, y) {
    const k = at(t, T.stamp, T.stamp + .26); if (k <= 0) return;
    const s = lp(1.9, 1, bo(k));
    c.save(); c.translate(x, y); c.rotate(-.2); c.scale(s, s); c.globalAlpha *= cl(k * 5) * .94;
    const w = tw(c, 'СЕКРЕТНО', { s: 50, ls: 6 }) + 56, h = 96;
    c.strokeStyle = R.stampC; rr(c, -w / 2, -h / 2, w, h, 14); c.lineWidth = 7; c.stroke();
    rr(c, -w / 2 + 11, -h / 2 + 11, w - 22, h - 22, 8); c.lineWidth = 2.5; c.stroke();
    tx(c, 'СЕКРЕТНО', 0, 3, { s: 50, ls: 6, c: R.stampC });
    c.restore();
  }
  function signature(c, t, x, y) {
    const k = eio(at(t, T.sig, T.sig + .4)); if (k <= 0) return;
    c.save(); c.strokeStyle = R.ink1; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
    const N = 70;
    for (let i = 0; i <= N * k; i++) { const u = i / N, px = x + u * 220, py = y + Math.sin(u * 17) * 15 * (1 - u * .5) - u * 10 + Math.sin(u * 5) * 6; i ? c.lineTo(px, py) : c.moveTo(px, py) }
    c.stroke(); c.restore();
    tx(c, 'К. ТИГ · ОТДЕЛ ИССЛЕДОВАНИЙ', x, y + 48, { f: 'J', w: 500, s: 17, ls: 1, c: R.ink3, al: 'left', a: at(t, T.sig + .1, T.sig + .35) });
  }
  function memo(c, t, sh = true) {
    if (sh) { c.fillStyle = R.gnd2; c.fillRect(18, 22, MW, MH) }
    c.fillStyle = R.paper; c.fillRect(0, 0, MW, MH);
    tx(c, 'R.J. REYNOLDS TOBACCO COMPANY', 56, 72, { f: 'J', w: 700, s: 22, ls: 2, c: R.ink1, al: 'left' });
    c.fillStyle = R.ink1; c.fillRect(56, 96, MW - 112, 4);
    tx(c, 'МЕМОРАНДУМ', 56, 150, { s: 50, c: R.ink, al: 'left' });
    tx(c, '2 ФЕВРАЛЯ 1973', 56, 200, { f: 'J', w: 500, s: 24, ls: 1, c: R.ink3, al: 'left' });
    [520, 470, 505, 330, 480].forEach((L, i) => { const k = eo(at(t, T.typ + i * .13, T.typ + i * .13 + .17)); if (k > 0) { rr(c, 56, 250 + i * 32, L * k, 13, 6.5); fill(c, R.typed) } });
    const Q = ['МЫ ДОЛЖНЫ ПОЛУЧИТЬ', 'СВОЮ ДОЛЮ', 'МОЛОДЁЖНОГО РЫНКА'];
    const fs = Math.min(48, 48 * 528 / Math.max(...Q.map(q => tw(c, q, { s: 48 }))));
    Q.forEach((q, i) => {
      const y = 470 + i * fs * 1.25, k = eo(at(t, T.quote + i * .1, T.quote + i * .1 + .26));
      if (i >= 1) { const m = eio(at(t, T.mark + (i - 1) * .22, T.mark + (i - 1) * .22 + .3)); if (m > 0) { const w = (tw(c, q, { s: fs }) + 28) * m; poly(c, [44, y - fs * .52, 44 + w, y - fs * .56, 44 + w - 6, y + fs * .52, 40, y + fs * .5]); fill(c, R.marker) } }
      if (k > 0) tx(c, q, 56, y + (1 - k) * 22, { s: fs, c: R.ink, al: 'left', a: k });
    });
    signature(c, t, 60, 700);
    stamp(c, t, 450, 318);
  }
  function memoImg() { if (!MEMO) { MEMO = mk(MW + 40, MH + 44); memo(MEMO.getContext('2d'), T.w2 - .01, false) } return MEMO }
  function memoPose(t) {
    const k = at(t, T.memo, T.memo + .7), e = spr(k), u = at(t, T.stamp + .1, T.stamp + .34);
    return { x: lp(1640, 1360, e), y: lp(1580, 548, e) + Math.sin(Math.PI * u) * 9, r: lp(.34, .035, eo(k)) };
  }
  function cam2(t) { const k = eio(at(t, 4.9, T.w2 + .2)); return { s: lp(1, 1.055, k), x: lp(960, 1000, k), y: lp(540, 548, k) } }
  function shot2(c, t) {
    c.fillStyle = R.bg2; c.fillRect(0, 0, WW, HH);
    const K = cam2(t); c.save(); cam(c, K.s, K.x, K.y);
    if (R.stars) stars(c, t, 60, 9, R.sun2);
    if (R.clouds) banks(c, t, R.clouds, 13);
    const ks = spr(at(t, 4.85, 5.35));
    if (ks > 0) {
      c.save(); c.beginPath(); c.arc(560, 600, 400 * ks, 0, TAU); fill(c, R.sun2); c.clip();
      c.fillStyle = R.bg2; for (const [y, h] of [[660, 14], [712, 18], [760, 22], [804, 26], [846, 30]]) c.fillRect(0, y, WW, h);
      c.restore();
    }
    building(c, t, 560, 905 + (1 - eo(at(t, 4.8, 5.4))) * 980);
    c.fillStyle = R.gnd2; c.fillRect(-300, 905 + (1 - eo(at(t, 4.7, 5.2))) * 260, WW + 600, 600);
    const kl = eo(at(t, 5.45, 5.75)); tx(c, 'R.J. REYNOLDS TOBACCO', 560, 985 + (1 - kl) * 30, { s: 30, ls: 6, c: R.ink2, a: kl });
    if (t >= T.memo && t < T.w2) { const p = memoPose(t); c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.translate(-MW / 2, -MH / 2); memo(c, t); c.restore() }
    c.restore();
    yearTag(c, t);
  }
  // косая шторка: новая сцена приходит справа, впереди красная полоса
  function wipe(c, t, draw) {
    const X0 = lp(2200, -330, eio(at(t, T.w2, T.w2E))), xb = y => X0 + (540 - y) * .42;
    c.save(); c.beginPath(); c.moveTo(xb(-60), -60); c.lineTo(WW + 700, -60); c.lineTo(WW + 700, HH + 60); c.lineTo(xb(HH + 60), HH + 60); c.closePath(); c.clip();
    draw(); c.restore();
    poly(c, [xb(-60), -60, xb(-60) + 80, -60, xb(HH + 60) + 80, HH + 60, xb(HH + 60), HH + 60]); fill(c, R.wipe);
  }
  // меморандум перелетает из кабинета в архивную коробку (над обеими сценами)
  function memoFly(c, t) {
    const K = cam2(T.w2), p = memoPose(T.w2), k = eio(at(t, T.w2, T.drop));
    const x0 = 960 + (p.x - K.x) * K.s, y0 = 540 + (p.y - K.y) * K.s;
    const x = lp(x0, 960, k), y = lp(y0, 400, k) - Math.sin(Math.PI * k) * 110, s = lp(K.s, .42, k), r = lp(p.r, 0, k) + Math.sin(Math.PI * k) * .12;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s); c.fillStyle = 'rgba(20,25,53,.16)'; c.fillRect(-MW / 2 + 18, -MH / 2 + 22, MW, MH); c.drawImage(memoImg(), -MW / 2, -MH / 2); c.restore();
  }

  // ================= 3. архив и суд (белая бумага) =================
  const BX = 960, BY = 900, BW = 400, BH = 290;
  const SIDE = [
    { x: 520, y: 900, w: 300, h: 220, t0: 9.58, ty: 0 },
    { x: 250, y: 900, w: 230, h: 160, t0: 9.68, ty: 1 },
    { x: 1660, y: 900, w: 320, h: 210, t0: 9.78, ty: 0 },
    { x: 538, y: 660, w: 260, h: 180, t0: 9.9, ty: 1 },
    { x: 1640, y: 670, w: 240, h: 150, t0: 10.02, ty: 1 },
  ];
  function boxShape(c, x, y, w, h, o) {
    c.fillStyle = o.front; c.fillRect(x - w / 2, y - h, w, h);
    c.fillStyle = o.side; c.fillRect(x + w / 2 - w * .15, y - h, w * .15, h);
    if (o.lid) {
      const lh = Math.max(34, h * .2), d = 26;
      poly(c, [x - w / 2 - 8, y - h - 10, x + w / 2 + 8, y - h - 10, x + w / 2 + 8 - d, y - h - 10 - d, x - w / 2 - 8 + d, y - h - 10 - d]); fill(c, o.top);
      c.fillStyle = o.lid; c.fillRect(x - w / 2 - 8, y - h - 10, w + 16, lh);
    }
    if (o.handle !== false) { rr(c, x - w * .14, y - h + h * .34, w * .28, Math.max(12, h * .07), 8); fill(c, R.open) }
    if (o.label) {
      const lw = w * .36, lh = h * .24, ly = y - h * .45;
      c.fillStyle = R.label; c.fillRect(x - lw / 2, ly, lw, lh);
      c.fillStyle = R.sheetL; c.fillRect(x - lw / 2 + 10, ly + lh * .28, lw - 20, 5); c.fillRect(x - lw / 2 + 10, ly + lh * .6, (lw - 20) * .6, 5);
    }
  }
  function sideBox(c, t, b) {
    const k = at(t, b.t0, b.t0 + .3); if (k <= 0) return;
    const u = at(t, b.t0 + .3, b.t0 + .5), sq = Math.sin(Math.PI * u) * (1 - u * .3);
    c.save(); c.translate(b.x, b.y - 640 * (1 - k * k)); c.scale(1 + .07 * sq, 1 - .09 * sq);
    const [front, side, lid, top] = R.boxes[b.ty]; boxShape(c, 0, 0, b.w, b.h, { front, side, lid, top, label: 1 });
    c.restore();
  }
  function lidClosed(c) {
    poly(c, [BX - 210, 598, BX + 210, 598, BX + 182, 568, BX - 182, 568]); fill(c, R.lidT);
    c.fillStyle = R.lidF; c.fillRect(BX - 210, 598, 420, 60);
    c.fillStyle = R.lidD; c.fillRect(BX + 210 - 63, 598, 63, 60);
  }
  function gavel(c, px, py, th) {
    c.save(); c.translate(px, py); c.rotate(th);
    rr(c, -300, -15, 300, 30, 15); fill(c, R.gavS);
    rr(c, -300, 1, 300, 14, [0, 0, 14, 14]); fill(c, R.gavS2);
    circ(c, 0, 0, 22, R.gavH);
    rr(c, -352, -82, 64, 164, 18); fill(c, R.gavH);
    c.fillStyle = R.gavB; c.fillRect(-352, -60, 64, 13); c.fillRect(-352, 47, 64, 13);
    c.fillStyle = R.gavHi; c.fillRect(-342, -78, 9, 156);
    c.restore();
  }
  function gavelPose(t) {
    const ke = eo(at(t, T.hit - .6, T.hit - .3)), ks = ei(at(t, T.hit - .3, T.hit)), u = at(t, T.hit, T.hit + .4), kx = ei(at(t, T.hit + .42, T.hit + .78));
    let x = lp(2000, 1400, ke), y = lp(80, 492, ke), th = lp(1.25, 0, ks);
    if (u > 0) th += Math.sin(Math.PI * Math.min(1, u * 1.6)) * .3;
    if (kx > 0) { x = lp(x, 2160, kx); th = lp(th, 0, kx) }
    return { x, y, th, on: t > T.hit - .6 && kx < 1 };
  }
  function sheetShape(c, x, y, r, s, o = {}) {
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const sh = o.sh ?? 1; if (sh > 0) { c.fillStyle = `rgba(20,25,53,${.14 * sh})`; c.fillRect(-52, -68, 120, 156) }
    c.fillStyle = o.col || R.sheet; c.fillRect(-60, -78, 120, 156);
    const la = o.la ?? 1;
    if (la > 0) {
      c.globalAlpha *= la;
      if (o.red) { c.fillStyle = R.sheetH; c.fillRect(-44, -62, 88, 12) }
      c.fillStyle = o.lines || R.sheetL;
      for (let i = 0; i < 4; i++) c.fillRect(-44, -30 + i * 22, i === 3 ? 50 : 88, 6);
      c.globalAlpha /= la;
    }
    const ol = o.ol ?? 1; if (ol > 0) { c.globalAlpha *= ol; c.strokeStyle = R.sheetO; c.lineWidth = 3; c.strokeRect(-60, -78, 120, 156) }
    c.restore();
  }
  const PAPERS = [...Array(24)].map((_, i) => {
    const a = lp(-2.85, -.3, H1(i * 3.3 + 1)), d = 380 + 520 * H1(i * 5.1 + 2), g = 300 + 120 * H1(i * 2.2), x0 = BX + (H1(i * 1.9) - .5) * 240;
    let dx = Math.cos(a) * d, dy = Math.sin(a) * d, gg = g; const ex = x0 + dx, ey = 585 + dy + g;
    if (ex > 340 && ex < 1580 && ey < 560) dx = (ex < 960 ? 340 - 150 * H1(i * 9.1) : 1580 + 150 * H1(i * 9.1)) - x0;   // над коробкой — место для счётчика
    else if (ex > 340 && ex < 1580) { dy = Math.max(dy, -70); gg = 90 + 60 * H1(i * 3.7) }                               // падают в середину — летят низко
    return { t0: T.hit + .02 + i * .008, dur: .8 + .25 * H1(i * 7.3), x0, y0: 585, dx, dy, g: gg, r0: (H1(i * 4.4) - .5) * .6, sp: (H1(i * 6.6) - .5) * 5, s: .85 + .4 * H1(i * 8.8), red: i % 5 === 2, seed: i };
  });
  const RED = { t0: T.hit + .05, dur: 1.0, x0: BX + 30, y0: 585, dx: 300, dy: -240, g: 360, r0: -.1, sp: .32, s: 1.2, seed: 99 };
  function paperPose(p, t) {
    const k = at(t, p.t0, p.t0 + p.dur), e = eo(k), w = at(t, p.t0 + p.dur, p.t0 + p.dur + .5);
    return { x: p.x0 + p.dx * e, y: p.y0 + p.dy * e + p.g * k * k + Math.sin(t * 1.7 + p.seed) * 3 * w, r: p.r0 + p.sp * e + Math.sin(t * 1.3 + p.seed) * .02 * w, s: p.s * (k < .15 ? lp(.4, 1, k / .15) : 1) };
  }
  function cam3(t) { const k = eio(at(t, 8.9, T.fly + .4)); return { s: lp(1, 1.05, k), x: 960, y: lp(540, 552, k) } }
  function shot3(c, t) {
    c.fillStyle = R.bg3; c.fillRect(0, 0, WW, HH);
    const K = cam3(t); c.save(); cam(c, K.s, K.x, K.y);
    if (R.grid) blueprint(c, R.grid);
    circ(c, 960, 650, 470, R.disc3);
    if (R.spot) spotlight(c, t, R.spot);
    for (const b of SIDE) sideBox(c, t, b);
    // крышка стоит сзади → захлопывается
    const kz = ei(at(t, T.inn, T.inn + .12));
    if (kz < 1) { c.save(); c.translate(0, 580); c.scale(1, 1 - kz); rr(c, BX - 196, -232, 392, 232, [16, 16, 0, 0]); fill(c, R.lidIn); rr(c, BX - 176, -212, 352, 196, 10); fill(c, R.lidIn2); c.restore() }
    poly(c, [BX - 200, 610, BX + 200, 610, BX + 174, 580, BX - 174, 580]); fill(c, R.open);
    if (t >= T.drop && t < T.inn + .1) { const k = ei(at(t, T.drop, T.inn)); c.save(); c.translate(BX, lp(400, 800, k)); c.scale(.42, .42); c.drawImage(memoImg(), -MW / 2, -MH / 2); c.restore() }
    boxShape(c, BX, BY, BW, BH, { front: R.mainBox, side: R.mainBoxD, handle: false });
    c.fillStyle = R.label; c.fillRect(BX - 115, 712, 230, 86);
    tx(c, 'АРХИВ', BX, 745, { f: 'J', w: 700, s: 40, ls: 4, c: R.labelInk });
    tx(c, 'R.J.R. · 1973', BX, 778, { f: 'J', w: 500, s: 18, ls: 2, c: R.labelInk2 });
    c.fillStyle = R.acc3; c.fillRect(BX - 115, 806, 230, 10);
    // закрытая крышка: падает, после удара молотка улетает
    const kc = at(t, T.inn + .12, T.inn + .26);
    if (kc > 0) {
      const u = at(t, T.inn + .26, T.inn + .42), kf = eo(at(t, T.hit, T.hit + .6));
      c.save(); c.translate(BX - 1380 * kf, 600 - 50 * (1 - kc * kc) - Math.sin(Math.PI * u) * 8 - 300 * kf - Math.sin(Math.PI * kf) * 110); c.rotate(-1.2 * kf); c.translate(-BX, -600); lidClosed(c); c.restore();
    }
    // листы
    for (const p of PAPERS) if (t >= p.t0) { const q = paperPose(p, t); sheetShape(c, q.x, q.y, q.r, q.s, { red: p.red }) }
    if (t >= RED.t0 && t < T.fly) { const q = paperPose(RED, t); sheetShape(c, q.x, q.y, q.r, q.s, { col: R.bg4, lines: R.band4, ol: 0 }) }
    // молоток и удар
    const g = gavelPose(t); if (g.on) gavel(c, g.x, g.y, g.th);
    const ku = at(t, T.hit, T.hit + .3);
    if (ku > 0 && ku < 1) {
      c.save(); c.strokeStyle = R.hitLine; c.lineWidth = 7; c.lineCap = 'round'; c.globalAlpha = 1 - ku;
      for (let i = 0; i < 9; i++) { const a = lp(-3.0, -.15, i / 8), r0 = 40 + 130 * eo(ku), r1 = 80 + 170 * eo(ku); c.beginPath(); c.moveTo(1080 + Math.cos(a) * r0, 572 + Math.sin(a) * r0); c.lineTo(1080 + Math.cos(a) * r1, 572 + Math.sin(a) * r1); c.stroke() }
      c.restore();
    }
    // годы: 1973 → 1998, потом 14 000 000 документов
    const ka = eo(at(t, T.yr - .1, T.yr + .2)), out = eio(at(t, T.hit + .12, T.hit + .36));
    if (ka > 0 && out < 1) {
      const v = lp(1973, 1998, eio(at(t, T.yr + .05, T.yr + .9))), hk = at(t, T.hit, T.hit + .3), sc = 1 + .14 * Math.sin(Math.PI * hk);
      c.save(); c.translate(960, 250 - (1 - ka) * 60 - out * 90); c.scale(sc, sc);
      odo(c, v, 0, 0, { s: 150, c: mixc(R.ink3c, R.acc3, at(t, T.hit, T.hit + .08)), a: ka * (1 - out) }); c.restore();
      const kl = spr(at(t, T.yr + .9, T.yr + 1.25));
      if (kl > 0) { c.save(); c.translate(960, 365 - out * 90); c.scale(kl, kl); tx(c, '25 ЛЕТ В АРХИВЕ', 0, 0, { s: 36, ls: 6, c: R.acc3, a: 1 - out }); c.restore() }
    }
    const kn = eo(at(t, T.n14, T.n14 + .25));
    if (kn > 0) {
      num(c, fmt(Math.round(14e6 * eo(at(t, T.n14 + .05, T.n14 + .75)))), 960, 250 + (1 - kn) * 70, { s: 150, c: R.ink3c, a: kn });
      const kd = eo(at(t, T.n14 + .1, T.n14 + .35)); tx(c, 'ДОКУМЕНТОВ', 960, 368 + (1 - kd) * 40, { s: 40, ls: 10, c: R.acc3, a: kd });
    }
    c.restore();
  }
  // красный лист летит в камеру и закрывает кадр — дальше красная глава
  function redFly(c, t) {
    const k = at(t, T.fly, T.s4 + SH4), K = cam3(t), p = paperPose(RED, T.fly);
    const sx = 960 + (p.x - K.x) * K.s, sy = 540 + (p.y - K.y) * K.s, s0 = p.s * K.s, e = eio(k), s = s0 * Math.pow(23 / s0, Math.pow(k, 1.7));
    sheetShape(c, lp(sx, 960, e), lp(sy, 540, e), lp(p.r, -.04, e), s, { col: R.bg4, lines: R.band4, la: 1 - ss(.15, .6, k), ol: 0, sh: 1 - ss(0, .3, k) });
  }

  // ================= 4. «Мальборо» (красный) =================
  const PK = { x: 690, y: 615 }, PIE = { x: 1300, y: 470, r: 185 };
  // «крыша»: красный верх, белый клин снизу поднимается к середине (как у «Мальборо», без надписей)
  const CHEV = [-150, -220, 150, -220, 150, 62, 0, -42, -150, 62];
  const CIGS = [[-92, 66], [-50, 96], [-8, 80], [34, 58]];   // сигареты в открытой пачке: x, сколько торчит
  function packT(c, t) {
    const kp = spr(at(t, T.s4 + .1, T.s4 + .6)), gu = at(t, 14.0, 14.45), sq = gu > 0 ? Math.sin(TAU * gu) * (1 - gu) : 0;
    c.translate(PK.x, PK.y + 220); c.scale(kp * (1 + .07 * sq), kp * (1 - .09 * sq)); c.translate(0, -220);
    return kp;
  }
  function cig(c, x, y0, h) {   // x — середина, y0 — край пачки, h — сколько торчит
    rr(c, x - 17, y0 - h, 34, h + 70, 6); fill(c, C.white);
    rr(c, x - 17, y0 - h, 34, 46, [6, 6, 0, 0]); fill(c, C.am);
    c.fillStyle = C.am2; for (let i = 0; i < 4; i++) c.fillRect(x - 11 + i * 7, y0 - h + 16 + (i % 2) * 13, 3, 3);
    c.beginPath(); c.ellipse(x, y0 - h + 3, 15, 5, 0, 0, TAU); fill(c, C.am3);
  }
  // открытая пачка: откинутая крышка, сигареты, вейп садится между ними
  function packDraw(c, t) {
    c.save(); if (packT(c, t) <= 0) { c.restore(); return }
    rr(c, -172, 208, 420, 26, 13); fill(c, 'rgba(20,25,53,.22)');
    const d = 56, dy = d * .55, top = -220 - dy;
    poly(c, [-150 + d, top, 150 + d, top, 150 + d + 20, top - 170, -150 + d + 20, top - 170]); fill(c, C.pa2);
    poly(c, [-150 + d + 17, top - 146, 150 + d + 17, top - 146, 150 + d + 20, top - 170, -150 + d + 20, top - 170]); fill(c, C.red2);
    poly(c, [150, -220, 150 + d, top, 150 + d, 220 - dy, 150, 220]); fill(c, C.pa2);
    poly(c, [150, -220, 150 + d, top, 150 + d, 62 - dy, 150, 62]); fill(c, C.red2);
    poly(c, [-150, -220, 150, -220, 150 + d, top, -150 + d, top]); fill(c, C.n0);
    for (const [x, h] of CIGS) cig(c, x + 20, -220 - dy * .5, h);
    const j = juulPose(t); if (j.on) juul(c, j.x - PK.x, j.y - PK.y, j.r);
    c.fillStyle = C.white; c.fillRect(-150, -220, 300, 440);
    poly(c, CHEV); fill(c, C.red);
    c.fillStyle = 'rgba(20,25,53,.14)'; c.fillRect(-150, -112, 300, 4);
    rr(c, -78, 104, 156, 16, 8); fill(c, C.pa2); rr(c, -52, 136, 104, 9, 4.5); fill(c, C.pa2);
    c.restore();
  }
  function juul(c, x, y, r) {
    c.save(); c.translate(x, y); c.rotate(r);
    rr(c, -36, -150, 72, 300, 22); fill(c, R.juul);
    c.save(); rr(c, -36, -150, 72, 300, 22); c.clip(); c.fillStyle = R.juulHi; c.fillRect(-36, -150, 18, 300); c.restore();
    rr(c, -36, -240, 72, 100, [20, 20, 4, 4]); fill(c, R.pod);
    c.save(); rr(c, -36, -240, 72, 100, [20, 20, 4, 4]); c.clip(); c.fillStyle = R.pod2; c.fillRect(14, -240, 22, 100); c.restore();
    c.fillStyle = R.juul; c.fillRect(-36, -146, 72, 8);
    circ(c, 0, -60, 8, R.pod);
    c.fillStyle = C.pa2; c.fillRect(-16, 136, 32, 9);
    c.restore();
  }
  // вейп прилетает сверху справа, зависает над пачкой и садится в неё — торчит, как ещё одна сигарета
  function juulPose(t) {
    const k = at(t, 13.2, 13.72), e = eo(k), kd = ei(at(t, 13.72, 14.0)), w = at(t, 14.0, 14.45);
    return { x: lp(1180, 800, e), y: lp(-300, 200, e) + 250 * kd, r: lp(.75, 0, e) + Math.sin(TAU * w) * (1 - w) * .05, on: t >= 13.2 };
  }
  // «крыша» пачки → клин 35 %: обе фигуры — по 120 точек вдоль контура
  function resample(P, N) {
    const n = P.length / 2, L = [0];
    for (let i = 1; i <= n; i++) { const a = (i - 1) % n, b = i % n; L.push(L[i - 1] + Math.hypot(P[2 * b] - P[2 * a], P[2 * b + 1] - P[2 * a + 1])) }
    const out = []; let seg = 0;
    for (let j = 0; j < N; j++) {
      const d = L[n] * j / N; while (seg < n - 1 && L[seg + 1] < d) seg++;
      const a = seg % n, b = (seg + 1) % n, k = (d - L[seg]) / ((L[seg + 1] - L[seg]) || 1);
      out.push([lp(P[2 * a], P[2 * b], k), lp(P[2 * a + 1], P[2 * b + 1], k)]);
    }
    return out;
  }
  const cen = A => A.reduce((s, p) => [s[0] + p[0] / A.length, s[1] + p[1] / A.length], [0, 0]);
  function morphPts() {
    if (MA) return;
    MA = resample(CHEV.map((v, i) => v + (i % 2 ? PK.y : PK.x)), 120);
    const W = [PIE.x, PIE.y]; for (let i = 0; i <= 40; i++) { const a = -Math.PI / 2 + .35 * TAU * i / 40; W.push(PIE.x + Math.cos(a) * PIE.r, PIE.y + Math.sin(a) * PIE.r) }
    const B = resample(W, 120), ca = cen(MA), cb = cen(B);
    let best = 0, bd = Infinity;
    for (let s = 0; s < 120; s++) { let d = 0; for (let i = 0; i < 120; i++) { const b = B[(i + s) % 120]; d += (MA[i][0] - ca[0] - b[0] + cb[0]) ** 2 + (MA[i][1] - ca[1] - b[1] + cb[1]) ** 2 } if (d < bd) { bd = d; best = s } }
    MB = B.map((_, i) => B[(i + best) % 120]);
  }
  function cam4(t) { const k = eio(at(t, T.s4, T.end)); return { s: lp(1, 1.04, k), x: lp(960, 985, k), y: 540 } }
  function shot4(c, t) {
    c.fillStyle = R.bg4; c.fillRect(0, 0, WW, HH);
    const K = cam4(t); c.save(); cam(c, K.s, K.x, K.y);
    // диагональ
    const off = (1 - eo(at(t, T.s4 + .05, T.s4 + .55))) * 1000, ux = .856, uy = -.517, nx = .517, ny = .856, bw = 200, L = 1900;
    const ox = 960 + nx * off, oy = 540 + ny * off;
    poly(c, [ox - ux * L - nx * bw, oy - uy * L - ny * bw, ox + ux * L - nx * bw, oy + uy * L - ny * bw, ox + ux * L + nx * bw, oy + uy * L + ny * bw, ox - ux * L + nx * bw, oy - uy * L + ny * bw]); fill(c, R.band4);
    // пачка проглатывает вейп
    packDraw(c, t);
    // круг и кольцо
    circ(c, PIE.x, PIE.y, PIE.r * spr(at(t, 14.35, 14.75)), R.pie);
    const kr = eio(at(t, 14.5, 15.05)); if (kr > 0) { c.beginPath(); c.arc(PIE.x, PIE.y, PIE.r + 30, -Math.PI / 2, -Math.PI / 2 + TAU * kr); c.strokeStyle = R.txt4; c.lineWidth = 5; c.stroke() }
    // «крыша» отрывается и превращается в клин
    const kl = eo(at(t, 14.5, 14.62)), m = eio(at(t, 14.62, 15.15));
    if (kl > 0) {
      morphPts();
      const ca = cen(MA), cb = cen(MB), hop = Math.sin(Math.PI * m) * 170;
      if (m > 0 && m < 1) {   // пунктир за «крышей»
        c.save(); c.setLineDash([16, 14]); c.strokeStyle = R.txt4; c.lineWidth = 5; c.globalAlpha = .85; c.beginPath();
        for (let i = 0; i <= 40 * m; i++) { const u = i / 40, x = lp(ca[0], cb[0], u), y = lp(ca[1] - 40, cb[1], u) - Math.sin(Math.PI * u) * 170; i ? c.lineTo(x, y) : c.moveTo(x, y) }
        c.stroke(); c.restore();
      }
      c.beginPath();
      MA.forEach((p, i) => { const q = MB[i], x = lp(p[0], q[0], m), y = lp(p[1] - 40 * kl, q[1], m) - hop; i ? c.lineTo(x, y) : c.moveTo(x, y) });
      c.closePath(); fill(c, mixc(C.red, R.wedge, at(t, 14.5, 14.6)));
    }
    // надписи
    const k35 = spr(at(t, 15.1, 15.45));
    if (k35 > 0) { c.save(); c.translate(PIE.x + 95, PIE.y - 49); c.scale(k35, k35); tx(c, '35 %', 0, 0, { s: 60, c: R.wedgeT }); c.restore() }
    const kd = eo(at(t, 15.15, 15.45)); tx(c, 'ДОЛЯ В JUUL', PIE.x, 712 + (1 - kd) * 30, { s: 34, ls: 6, c: R.txt4, a: kd });
    const kb = eo(at(t, 15.2, 15.45)); if (kb > 0) num(c, '$' + (12.8 * eo(at(t, 15.2, 15.95))).toFixed(1).replace('.', ',') + ' МЛРД', PIE.x, 806 + (1 - kb) * 40, { s: 100, c: R.txt4, a: kb });
    const kc = eo(at(t, 15.4, 15.7)); tx(c, 'ПРОИЗВОДИТЕЛЬ «МАЛЬБОРО» · 2018', PIE.x, 890 + (1 - kc) * 24, { s: 26, ls: 3, c: R.ink4, a: kc });
    c.restore();
    const kt = eo(at(t, T.s4 + .15, T.s4 + .55)); if (kt > 0) { c.save(); c.translate(174 - (1 - kt) * 200, 112); c.scale(84 / 250, 84 / 250); odo(c, 2018, 0, 0, { s: 250, c: R.ink4, a: kt }); c.restore() }
  }

  // ================= кадр =================
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    if (t < T.s2) shot1(c, t);
    else if (t < T.w2) shot2(c, t);
    else if (t < T.w2E) { shot2(c, t); wipe(c, t, () => shot3(c, t)) }
    else if (t < T.fly) shot3(c, t);
    else if (t < T.s4 + SH4) { shot3(c, t); redFly(c, t) }
    else shot4(c, t - SH4);
    if (t >= T.w2 && t < T.drop) memoFly(c, t);
  }

  window.EP = {
    P: { bg: R.bg1, paper: C.wh, ink: C.n0, line: C.wh, a1: C.am, a2: C.red }, D, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      SC.forEach(S => { D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v16f')) { const st = document.createElement('style'); st.id = 'v16f'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); MEMO = null; MA = MB = null;
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M'].map(f => document.fonts.load(f, 'АЯaz09'))).then(() => 0);
    },
  };
})();
