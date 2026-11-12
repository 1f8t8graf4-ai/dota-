// v16.2 (11.11, ночь): правки по посекундному разбору v16.1 (Андрей + Gemini), пульт https://claude.ai/artifact/WahEWZQxPt6MhUAzj4NBWL.
// Без вопросов: пар у всех трёх вейпов, дым заводов — от табло, пачки уезжают на наезде на меморандум, огонёк и дым из него,
// надписи колб ровные, лаборатория без часов, снимок «мягкий пар» на стене, фон под «ПРОЕКТ» в ноль, замок с крышкой,
// флаг 13/50, одни весы, молоток правее, без «СУД» на трибуне, зал суда дальше, карта без обрезков, «ПО СОСЕДСТВУ» у пунктира,
// плашки над субтитрами, коридор без часов, «Мальборо» целая, 35 % сразу, без рамки «?», меморандум уходит до вейпа.
// Ответы Андрея (пульт + комментарии, 11.11): никаких пустых плоских фонов — второй план как у Боба: вечерний город в интро, детальные заводы
// 1973 (солнце в углу, верблюд с короной крупнее), пачки закрытые на тёмных подложках, рентген-кабинет за снимком горла, рентген грудной
// клетки «ПАЦИЕНТ · 16 ЛЕТ» (и во втором снимке), дым обжигает трахею (краснеет, сжимается) — без молний, карточка «вейпа ещё нет» —
// только пунктирный вейп с «?» и штамп «ОТЛОЖЕН · 1979», окно сайта сворачивается в точку архива, строка проявляет чертёж,
// чертёжный стол под «20 сигарет», 8 подростков со спины (капюшоны, лямки рюкзаков), вывеска школы и плашка на языке ролика,
// MARLBORO над сделкой и биржевой график за ней, финал — тёмная комната с ночным городом в окне, свечение вейпа, наезд, облако в камеру.
// Влёт кадра справа в начале — продолжение «вжуха» хвоста B (петля в TikTok). Концовки: v162a — доска (карточка приподнимается),
// v162b — хвост: темнота, «Так… о чём это я?» → «А, точно!» → вжух → начало ролика.
// v16.1 (11.11, вечер): правки Андрея и Gemini по v16. Голос — та же запись (v161_voice.py: вырезки, новых генераций нет), ролик кончается после «затянуться?».
// Концовка с доской — отдельным файлом: v161e1 — лупа вместо указки, v161e2 — Мистер Мозг (очки без глаз, луч из очков, без рук).
// Надписи на вейпах — на языке ролика; голов с глазами нет, во рту ничего; горло — снимок; соль — 1979 (Т. Перфетти, R.J. Reynolds);
// архив под замком → суд Миннесоты (отдельный зал) → коробки вскрываются; карта района (архив и Стэнфорд рядом — условность);
// шкафчики вместо школьников; «Мальборо» на тёмно-синем, буквы слетают с пачки; «ПЛАН ВЫПОЛНЕН» без терминала; субтитры по 2–3 слова;
// звуки — только мягкие (до новых); фоны детальнее (город 1973, лаборатория, склад архива, зал суда, коридор).
// v16 полный (11.11): весь ролик «Что вы знаете об одноразках?» под голос v14.5 (out/v16f-ru: v16_voice.py, v16_music.py).
// Яркий плоский стиль пробы v16 (без размытия, свечения, вспышек, зерна; без рук), цвет — свой у каждой сцены.
// Правки по ТЗ 11.11 (Андрей + Gemini): интро — синий градиент с вращающимися лучами, облака пара, манго и мята, зачёркнутые сигареты;
// заголовок одной строкой до самого превращения полосы в вейп; барабан лет 2026 → 1973 по десятилетиям, без обрывков цифр;
// 1973 — табачная империя: заводы с трубами, водяной знак «верблюд + корона», пачки CAMEL и WINSTON, меморандум поверх;
// меморандум влетает в коробку архива без косой шторки; «25 ЛЕТ В АРХИВЕ» крупно на плашке; молоток тёмного дерева с золотом
// бьёт сверху по круглой подставке, волна, весы правосудия, «СУД США · 1998»; пачка «Мальборо» сразу крупно, без пустого красного.
// Сцены по словам голоса (время слов — из timeline.json, init → K). Звуки — window.CUES → cues.json → audio.py (sfx13/sfx8).
// Факты: меморандум R.J. Reynolds 02.02.1973 (К. Тиг): «we must get our share of the youth market»; документы открыты по суду 1998
// (Миннесота + соглашение штатов), архив UCSF (Сан-Франциско) — 14+ млн документов; основатели Juul — студенты Стэнфорда;
// Juul — 2015; 1 картридж ≈ пачка сигарет (по данным самой Juul); 2019 — 27,5 % старшеклассников США (NYTS); Altria (производитель
// «Мальборо» в США) — 35 % Juul за $12,8 млрд (20.12.2018); «Мальборо» в 1924 — дамские сигареты, ковбой — с 1954.
(function () {
  'use strict';
  const WW = 1920, HH = 1080, TAU = Math.PI * 2;
  const C = {
    n0: '#141935', n1: '#1f2858', n2: '#2e3c7e', n3: '#4558a8', ink: '#141935',
    deep: '#0b1650', deep2: '#1b3a92', ray: '#14307f',
    red: '#e8475a', red2: '#c63449', red3: '#ff7f8e', mk: '#ffb3c0',
    wh: '#f8f4ec', white: '#ffffff', pa: '#ece4d4', pa2: '#d8cdb8', grey: '#c9c1b6',
    am: '#f2a33a', am2: '#d9812a', am3: '#ffc46a', am4: '#ffe3ae',
    mint: '#43d9b9', mint2: '#22a58b', sky: '#66c7f0', sky2: '#cfe8ff',
    blue: '#0b1f5c', blue2: '#112a6e', blue3: '#1d4a94', spot: '#cfe0ff',
    bp: '#2e65a0', bp2: '#3d74b0',
    yel: '#ffd36e', yel2: '#f2b84a',
    wood: '#5c2e0e', wood2: '#7a3f15', wood3: '#8a4a1c', gold: '#e1a754',
    mred: '#cc234a', mred2: '#a51c3d',
    rim: '#060e38', glass: '#040a2a',
    nav: '#121829', nav2: '#1b2340', nav3: '#26305a',
  };
  const D = {};
  let cv = null, X = null, K = null, TLW = [];
  // v16.1: язык надписей на предметах (timeline.lang), режим (основной ролик / концовка), вариант концовки, субтитры
  let LANG = 'ru', MODE = 'main', VAR = 'lens', SUBS = true, CHUNKS = [];
  const TXT = {
    ru: { mango: 'МАНГО', mint: 'МЯТА', berry: 'ЯГОДЫ', cigs: 'СИГАРЕТЫ', school: 'СТАРШАЯ ШКОЛА · США', every4: 'КАЖДЫЙ 4-Й СТАРШЕКЛАССНИК США' },
    en: { mango: 'MANGO', mint: 'MINT', berry: 'BERRY', cigs: 'CIGARETTES', school: 'HIGH SCHOOL · USA', every4: '1 IN 4 US HIGH SCHOOLERS' },
    de: { mango: 'MANGO', mint: 'MINZE', berry: 'BEERE', cigs: 'ZIGARETTEN', school: 'HIGH SCHOOL · USA', every4: 'JEDER 4. US-SCHÜLER' },
  };
  const tt = k => (TXT[LANG] || TXT.ru)[k] || k;
  // слой с размытием (кэш): рисуем фигуры на холсте и один раз размываем — «приборы в расфокусе», ночной город в окне
  const BLUR = {};
  function blurLayer(key, w, h, px, draw) {
    if (BLUR[key]) return BLUR[key];
    const a = mk(w, h), b = mk(w, h); draw(a.getContext('2d')); const g = b.getContext('2d'); g.filter = `blur(${px}px)`; g.drawImage(a, 0, 0); return (BLUR[key] = b);
  }
  // виньетка поверх кадра (в координатах кадра)
  function vignette(c, a, col = '0,0,0') {
    if (a <= 0) return; const g = c.createRadialGradient(960, 540, 380, 960, 540, 1180); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`);
    c.save(); c.fillStyle = g; c.fillRect(-400, -400, WW + 800, HH + 800); c.restore();
  }

  // ================= звуки по событиям =================
  window.CUES = window.CUES || {};
  const cue = (t0, name, gain = 1, pan = 0) => { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, Math.round(gain * 100) / 100, pan] };

  // ================= время слов =================
  const nw = s => String(s).toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
  function Wd(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.a } throw new Error('v162: нет слова «' + q + '» #' + n) }

  // ================= утилиты =================
  const cl = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, lp = (a, b, k) => a + (b - a) * k;
  const at = (t, a, b) => cl((t - a) / (b - a));
  const ss = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k) };
  const eo = k => 1 - Math.pow(1 - cl(k), 3), ei = k => Math.pow(cl(k), 3);
  const eio = k => { k = cl(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 };
  const bo = k => { k = cl(k); const s = 2.2; return 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2) };
  const spr = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-6.2 * k) * Math.cos(10.5 * k);
  const H1 = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) };
  const hex = h => h[0] === '#' ? [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)) : h.match(/[\d.]+/g).slice(0, 3).map(Number);   // и «#rrggbb», и «rgb(…)»
  const mixc = (a, b, k) => { const A = hex(a), B = hex(b); return 'rgb(' + A.map((v, i) => Math.round(lp(v, B[i], cl(k)))).join(',') + ')' };
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r) };
  const poly = (c, p) => { c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath() };
  const fill = (c, col) => { c.fillStyle = col; c.fill() };
  const stroke = (c, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.stroke() };
  const circ = (c, x, y, r, col) => { if (r <= 0) return; c.beginPath(); c.arc(x, y, r, 0, TAU); fill(c, col) };
  const rot = (x, y, r) => [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
  const pulse = (t, a) => at(t, a - .08, a) * (1 - at(t, a + .45, a + .7));
  // камера: точка мира (x, y) — в центре кадра, масштаб s, поворот r
  const cam = (c, s, x, y, r = 0) => { c.translate(WW / 2, HH / 2); if (r) c.rotate(r); c.scale(s, s); c.translate(-x, -y) };
  // наезд в точку: (fx, fy) приходит в центр, масштаб растёт по экспоненте от s0 до s1; (x0, y0) — где камера смотрела до наезда
  function zoomCam(k, fx, fy, s0, s1, x0 = 960, y0 = 540) {
    const e = eio(k), s = s0 * Math.pow(s1 / s0, e), m = ss(0, .85, k);
    const px = lp(960 + s0 * (fx - x0), 960, m), py = lp(540 + s0 * (fy - y0), 540, m);
    return { s, x: fx - (px - 960) / s, y: fy - (py - 540) / s };
  }
  // плавный силуэт через точки (Катмулл — Ром → кривые Безье)
  function spline(c, P, closed = true) {
    const n = P.length / 2, g = i => { const j = closed ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i)); return [P[2 * j], P[2 * j + 1]] };
    c.beginPath(); c.moveTo(P[0], P[1]);
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const [x0, y0] = g(i - 1), [x1, y1] = g(i), [x2, y2] = g(i + 1), [x3, y3] = g(i + 2);
      c.bezierCurveTo(x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6, x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6, x2, y2);
    }
    if (closed) c.closePath();
  }
  // линия «рисуется»: ломаная до доли k длины
  function drawOn(c, P, k, closed = false) {
    if (k <= 0) return; const Q = closed ? P.concat(P.slice(0, 2)) : P;
    let L = 0; for (let i = 2; i < Q.length; i += 2) L += Math.hypot(Q[i] - Q[i - 2], Q[i + 1] - Q[i - 1]);
    let left = L * cl(k); c.beginPath(); c.moveTo(Q[0], Q[1]);
    for (let i = 2; i < Q.length && left > 0; i += 2) {
      const d = Math.hypot(Q[i] - Q[i - 2], Q[i + 1] - Q[i - 1]), u = Math.min(1, left / (d || 1));
      c.lineTo(lp(Q[i - 2], Q[i], u), lp(Q[i - 1], Q[i + 1], u)); left -= d;
    }
    c.stroke();
  }
  const rrPts = (x, y, w, h, r, n = 6) => {
    const P = [], cs = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]];
    for (const [cx, cy, a0] of cs) for (let i = 0; i <= n; i++) { const a = a0 + Math.PI / 2 * i / n; P.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r) }
    return P;
  };

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
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  // плашка: ширина по тексту + поля, текст никогда не режется
  function plate(c, s, x, y, k, o = {}) {
    if (k <= 0) return;
    const fs = o.s || 34, to = { s: fs, ls: o.ls ?? 4, w: o.w || 800, f: o.f || 'M' }, w = tw(c, s, to) + fs * 1.3, h = fs * 1.9;
    c.save(); c.translate(x, y); if (o.r) c.rotate(o.r); c.scale(k, k);
    if (o.sh !== false) { rr(c, -w / 2 + 8, -h / 2 + 10, w, h, o.rad ?? h * .22); fill(c, o.shc || 'rgba(20,25,53,.28)') }
    rr(c, -w / 2, -h / 2, w, h, o.rad ?? h * .22); fill(c, o.bg || C.white);
    tx(c, s, 0, fs * .04, { ...to, c: o.c || C.ink });
    c.restore();
  }
  // год-барабан: Y — годы по порядку, TT — когда каждый встал на место; меняются только разные цифры, каждая в своём окне
  function yearDrum(c, t, Y, TT, x, y, o) {
    let i = 0; while (i < Y.length - 1 && t >= TT[i + 1]) i++;
    const d = o.d || .2, nx = i < Y.length - 1 ? i + 1 : i, k = nx > i ? eio(at(t, TT[nx] - d, TT[nx])) : 0;
    const A = String(Y[i]), B = String(Y[nx]), s = o.s || 200;
    c.save(); c.font = FNT({ s, w: 800 }); c.letterSpacing = '0px'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = o.c || C.white; c.globalAlpha *= o.a ?? 1;
    const dw = c.measureText('0').width * 1.04, x0 = x - dw * A.length / 2;
    for (let p = 0; p < A.length; p++) {
      const cx = x0 + dw * (p + .5), a = A[p], b = B[p], dir = o.dir ?? 1;
      if (a === b || k <= 0) { c.fillText(a, cx, y + s * .03); continue }
      const ph = k < .5 ? 1 - k * 2 : k * 2 - 1, g = k < .5 ? a : b, dy = (k < .5 ? -k : 1 - k) * s * .18 * dir;
      c.save(); c.translate(cx, y + s * .03 + dy); c.scale(1, Math.max(.001, eo(ph))); c.fillText(g, 0, 0); c.restore();
    }
    c.restore();
  }

  // ================= одноразка =================
  function leafPath(c, x, y, L, W) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + L * .5, y - W, x + L, y); c.quadraticCurveTo(x + L * .5, y + W, x, y); c.closePath() }
  // окошко с жидкостью: центр (0,0), 124×270
  function win(c, o) {
    rr(c, -62, -135, 124, 270, 46); fill(c, C.rim);
    rr(c, -50, -123, 100, 246, 36); fill(c, C.glass);
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
      fill(c, o.mp || C.wh); c.save(); c.clip(); c.fillStyle = o.mps || C.pa2; c.fillRect(26, -160, 80, 170); c.restore();
      rr(c, -30, -140, 60, 12, 6); fill(c, C.glass);
      c.restore();
    }
    rr(c, -w / 2, -h / 2, w, h, 58); fill(c, o.body);
    c.save(); rr(c, -w / 2, -h / 2, w, h, 58); c.clip(); c.fillStyle = o.shade; c.fillRect(w / 2 - 70, -h / 2, 80, h); c.restore();
    rr(c, -w / 2 + 24, -h / 2 + 80, 12, h - 240, 6); fill(c, 'rgba(255,255,255,.3)');
    if (mk > 0) { const cw = (w + 10) * Math.min(1, mk); rr(c, -cw / 2, -h / 2 - 6, cw, 36, 16); fill(c, o.collar || C.rim) }
    if (wk > 0) { c.save(); c.translate(0, -40); c.scale(wk, wk); win(c, o); c.restore() }
    if (lk > 0 && o.label) tx(c, o.label, 0, 150, { s: 34, ls: 6, c: o.lc || C.wh, a: lk });
    circ(c, 0, 250, 18, C.rim);
    const led = o.led || 0;
    if (led > 0) { c.save(); c.globalAlpha *= led; circ(c, 0, 250, 12, o.ledC || C.mint); circ(c, -3, 247, 4.5, 'rgba(255,255,255,.75)'); c.beginPath(); c.arc(0, 250, 27, 0, TAU); c.strokeStyle = o.ledC || C.mint; c.lineWidth = 5; c.globalAlpha *= .6; c.stroke(); c.restore() }
  }
  const HERO = { body: C.red, shade: C.red2, mp: C.wh, mps: C.pa2, collar: C.rim, label: 'MANGO', lc: C.wh, liq: C.am, liq2: C.am3 };
  // пар — плоские облачка без размытия
  function cloud(c, x, y, s, a, seed, col) {
    if (a <= 0 || s <= 0) return;
    c.save(); c.globalAlpha *= a; c.beginPath();
    for (const [bx, by, br] of [[0, 0, 46], [-44, 12, 34], [42, 10, 36], [-18, -30, 32], [22, -26, 30], [0, 22, 30]]) {
      const r = br * s * (.9 + .2 * H1(seed + bx * .37)), px = x + bx * s, py = y + by * s; c.moveTo(px + r, py); c.arc(px, py, r, 0, TAU);
    }
    fill(c, col || C.wh); c.restore();
  }
  // облачка, которые выходят и тают
  function puff(c, t, t0, x, y, dir = 1, sc = 1, col) {
    for (const [d, dx, dy, s0, s1] of [[0, 60, 260, .3, 1.45], [.16, -40, 200, .25, 1.1]]) {
      const k = at(t, t0 + d, t0 + d + 1.45); if (k <= 0 || k >= 1) continue;
      const e = eo(k), z = ss(0, .12, k) * (1 - ss(.55, 1, k));
      cloud(c, x + dx * dir * e * sc, y - dy * e * sc, lp(s0, s1, e) * sc * z, 1, t0 * 7 + d * 13, col);
    }
  }
  // манго целиком и «ёжиком» (плоско, как эмодзи)
  function mango(c, x, y, s, r) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.save(); c.translate(-6, -70); c.rotate(-.55); leafPath(c, 0, 0, 96, 34); fill(c, C.mint2);
    c.beginPath(); c.moveTo(6, 0); c.lineTo(82, 0); c.strokeStyle = C.mint; c.lineWidth = 4; c.lineCap = 'round'; c.stroke(); c.restore();
    c.beginPath(); c.ellipse(0, 0, 100, 80, -.35, 0, TAU); fill(c, '#86c34f');
    c.save(); c.clip(); c.beginPath(); c.ellipse(-16, -14, 100, 80, -.35, 0, TAU); fill(c, C.am); c.beginPath(); c.ellipse(46, 30, 70, 50, -.35, 0, TAU); fill(c, C.red); c.restore();
    c.beginPath(); c.ellipse(-44, -30, 26, 12, -.6, 0, TAU); fill(c, C.am4);
    c.restore();
  }
  function mangoSlice(c, x, y, s, r) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.beginPath(); c.ellipse(0, 0, 150, 72, 0, 0, Math.PI); c.closePath(); fill(c, '#86c34f');
    c.save(); c.clip(); c.beginPath(); c.ellipse(70, 30, 120, 70, 0, 0, TAU); fill(c, C.red); c.restore();
    c.beginPath(); c.ellipse(0, -2, 134, 58, 0, 0, Math.PI); c.closePath(); fill(c, '#ef9426');
    c.beginPath(); c.ellipse(0, -2, 98, 36, 0, 0, Math.PI); c.closePath(); fill(c, C.am3);
    c.strokeStyle = 'rgba(255,227,174,.85)'; c.lineWidth = 4; c.lineCap = 'round';
    for (let i = 1; i < 6; i++) { const a = Math.PI * i / 6; c.beginPath(); c.moveTo(Math.cos(a) * 30, Math.sin(a) * 10); c.lineTo(Math.cos(a) * 118, Math.sin(a) * 48); c.stroke() }
    c.restore();
  }
  // мята: овальный лист с зубчиками по краю, жилками и «морщинками»
  function mintLeaf(c, x, y, s, r) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.strokeStyle = C.mint2; c.lineCap = 'round'; c.lineWidth = 12; c.beginPath(); c.moveTo(-205, 10); c.quadraticCurveTo(-170, 6, -128, 0); c.stroke();
    const L = 250, W = 96, N = 16, top = [], bot = [];
    for (let i = 0; i <= N; i++) { const u = i / N, w = W * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.04)), .75) * (1 - .3 * u), x0 = -128 + L * u; top.push([x0, -w]); bot.push([x0, w]) }
    c.beginPath(); c.moveTo(-128, 0);
    for (let i = 1; i <= N; i++) { const [xa, ya] = top[i - 1], [xb, yb] = top[i]; c.lineTo(lp(xa, xb, .65), lp(ya, yb, .65) - 13 * (1 - i / N * .6)); c.lineTo(xb, yb) }
    for (let i = N; i >= 1; i--) { const [xa, ya] = bot[i], [xb, yb] = bot[i - 1]; c.lineTo(lp(xa, xb, .35), lp(ya, yb, .35) + 13 * (1 - i / N * .6)); c.lineTo(xb, yb) }
    c.closePath(); fill(c, C.mint);
    c.save(); c.clip(); c.fillStyle = C.mint2; c.fillRect(-140, 4, 290, 130);
    c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 4;
    for (let i = 0; i < 6; i++) { const x0 = -96 + i * 40; c.beginPath(); c.moveTo(x0 + 6, -40 + 6 * i); c.quadraticCurveTo(x0 + 18, -26, x0 + 30, -36 + 5 * i); c.stroke(); c.beginPath(); c.moveTo(x0 + 6, 34 - 4 * i); c.quadraticCurveTo(x0 + 18, 22, x0 + 30, 32 - 4 * i); c.stroke() }
    c.restore();
    c.strokeStyle = '#d6fff2'; c.lineWidth = 6; c.beginPath(); c.moveTo(-128, 0); c.quadraticCurveTo(0, -4, 118, 0); c.stroke();
    c.lineWidth = 4;
    for (let i = 0; i < 5; i++) { const x0 = -100 + i * 44, d = 1 - i * .12; c.beginPath(); c.moveTo(x0, -1); c.quadraticCurveTo(x0 + 22, -26 * d, x0 + 52, -54 * d); c.moveTo(x0, 1); c.quadraticCurveTo(x0 + 22, 26 * d, x0 + 52, 54 * d); c.stroke() }
    c.restore();
  }
  function spark(c, x, y, r, col) {
    if (r <= 0) return;
    c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); fill(c, col);
  }
  // сигарета: центр (x, y), длина L, толщина th, поворот r; фильтр слева, кончик справа
  function cig(c, x, y, L, th, r, o = {}) {
    c.save(); c.translate(x, y); c.rotate(r); if (o.a != null) c.globalAlpha *= o.a;
    const f = L * .3;
    rr(c, -L / 2, -th / 2, L, th, th * .22); fill(c, o.paper || C.wh);
    rr(c, -L / 2, -th / 2, f, th, [th * .22, 0, 0, th * .22]); fill(c, o.filter || C.am);
    c.fillStyle = o.dots || C.am2; for (let i = 0; i < 6; i++) c.fillRect(-L / 2 + f * (.12 + .14 * i), -th / 2 + th * (.22 + .42 * (i % 2)), th * .12, th * .12);
    c.fillStyle = 'rgba(20,25,53,.14)'; c.fillRect(-L / 2 + f, -th / 2, Math.max(2, th * .06), th);
    if (o.lit) {
      rr(c, L / 2 - th * .62, -th / 2, th * .62, th, [0, th * .22, th * .22, 0]); fill(c, '#8e889b');
      const g = o.glow || 0; c.save(); c.globalAlpha *= .35 + .25 * g; circ(c, L / 2 - th * .1, 0, th * (.78 + .22 * g), C.am3); c.restore();   // ореол огонька
      rr(c, L / 2 - th * .36, -th / 2, th * .36, th, [0, th * .26, th * .26, 0]); fill(c, mixc(C.red, C.am3, g));
      circ(c, L / 2 - th * .14, 0, th * .2, mixc(C.am3, C.am4, g));
    }
    c.restore();
  }
  function slash(c, x1, y1, x2, y2, k, w, col) { if (k <= 0) return; c.save(); c.lineCap = 'round'; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, k), lp(y1, y2, k)); c.stroke(); c.restore() }
  function sunburst(c, cx, cy, ang, n, col, R = 2600) {
    c.save(); c.fillStyle = col; c.beginPath();
    for (let i = 0; i < n; i++) { const a = ang + i * TAU / n, b = a + TAU / n / 2; c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); c.lineTo(cx + Math.cos(b) * R, cy + Math.sin(b) * R); c.closePath() }
    c.fill(); c.restore();
  }
  function deepBg(c, cx, cy, a = C.deep2, b = C.deep) { const g = c.createRadialGradient(cx, cy, 60, cx, cy, 1400); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(-4000, -4000, 12000, 12000) }

  // ================= 1973: молекула, заводы, башня, верблюд, пачки, меморандум =================
  // никотин (скелетная формула): пиридин + пирролидин, атомы азота — кружками
  const MOL = (() => {
    const hx = [], pn = [];
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * TAU / 6; hx.push([-100 + Math.cos(a) * 90, Math.sin(a) * 90]) }
    for (let j = 0; j < 5; j++) { const a = Math.PI + j * TAU / 5; pn.push([115 + Math.cos(a) * 70, -40 + Math.sin(a) * 70]) }
    const B = [];
    for (let i = 0; i < 6; i++) B.push([hx[i], hx[(i + 1) % 6], i % 2 === 0]);
    B.push([hx[1], pn[0], false]);
    for (let j = 0; j < 5; j++) B.push([pn[j], pn[(j + 1) % 5], false]);
    B.push([pn[4], [pn[4][0] + 6, pn[4][1] + 78], false]);
    return { B, N: [hx[3], pn[4]], hc: [-100, 0] };
  })();
  function molecule(c, x, y, s, k, col, ncol) {
    if (k <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s); c.lineCap = 'round'; c.strokeStyle = col; c.lineWidth = 14;
    const n = MOL.B.length;
    MOL.B.forEach(([a, b, dbl], i) => {
      const u = cl((k * 1.25 - i / n) * n / 2.2); if (u <= 0) return;
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(lp(a[0], b[0], u), lp(a[1], b[1], u)); c.stroke();
      if (dbl && u >= 1) {   // вторая черта внутри кольца
        const mx = (a[0] + b[0]) / 2 - MOL.hc[0], my = (a[1] + b[1]) / 2 - MOL.hc[1], L = Math.hypot(mx, my), ox = -mx / L * 20, oy = -my / L * 20;
        c.beginPath(); c.moveTo(lp(a[0], b[0], .2) + ox, lp(a[1], b[1], .2) + oy); c.lineTo(lp(a[0], b[0], .8) + ox, lp(a[1], b[1], .8) + oy); c.lineWidth = 10; c.stroke(); c.lineWidth = 14;
      }
    });
    const kn = spr(at(k, .75, 1));
    for (const [nx, ny] of MOL.N) if (kn > 0) { c.save(); c.translate(nx, ny); c.scale(kn, kn); circ(c, 0, 0, 34, col); tx(c, 'N', 0, 2, { s: 38, c: ncol }); c.restore() }
    c.restore();
  }
  // завод (v16.2 — детальнее): водонапорная башня, кирпичные трубы с поясами, оголовком и скобами, карниз, пилообразная крыша со светящимися
  // фонарями, металлическая ферма-галерея, вывеска, ворота, окна с тёплым светом (ореол). Дым из труб (с t0). x, y — середина низа
  function factory(c, t, x, y, s, o = {}) {
    const hk = o.h ?? 1, col = o.col || C.n1, dk = o.dk || C.n0, lt = o.lt || C.n2, T0 = o.t0 ?? 0, fl = o.flip ? -1 : 1;
    c.save(); c.translate(x, y); c.scale(s * fl, s);
    const ch = [[110, 46, 330], [196, 38, 250]];
    c.save(); c.translate(-176, -238);   // водонапорная башня
    c.strokeStyle = dk; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(-34, 4); c.lineTo(-24, -96); c.moveTo(34, 4); c.lineTo(24, -96); c.moveTo(-31, -8); c.lineTo(27, -84); c.moveTo(31, -8); c.lineTo(-27, -84); c.stroke();
    rr(c, -48, -178, 96, 86, 10); fill(c, col); c.fillStyle = lt; c.fillRect(-48, -152, 96, 6); c.fillRect(-48, -122, 96, 6);
    poly(c, [-56, -178, 56, -178, 0, -218]); fill(c, dk);
    c.restore();
    for (const [cx, w, h0] of ch) {
      const h = h0 * hk, top = -150 - h;
      poly(c, [cx - w / 2 - 7, -140, cx + w / 2 + 7, -140, cx + w / 2, top, cx - w / 2, top]); fill(c, col);
      c.fillStyle = dk; for (let q = top + 52; q < -152; q += 30) c.fillRect(cx - w / 2 - 3, q, w + 6, 3);
      c.fillStyle = C.red; c.fillRect(cx - w / 2, top + 24, w, 16);
      c.fillStyle = dk; c.fillRect(cx - w / 2 - 8, top - 4, w + 16, 16);
      c.strokeStyle = lt; c.lineWidth = 3; for (let q = top + 60; q < -164; q += 20) { c.beginPath(); c.moveTo(cx + w / 2 - 12, q); c.lineTo(cx + w / 2 - 2, q); c.stroke() }
    }
    c.fillStyle = col; c.fillRect(-240, -150, 480, 152);
    const P = [-240, -158]; for (let i = 0; i < 4; i++) P.push(-240 + i * 120, -240, -240 + (i + 1) * 120, -158); P.push(240, -158); poly(c, P); fill(c, col);
    for (let i = 0; i < 4; i++) { poly(c, [-240 + i * 120, -240, -240 + i * 120 + 16, -240, -240 + i * 120 + 16, -160, -240 + i * 120, -160]); fill(c, mixc(C.am4, col, .3)) }
    c.fillStyle = dk; c.fillRect(-252, -162, 504, 12);
    c.strokeStyle = dk; c.lineWidth = 4; c.beginPath(); c.moveTo(12, -268); c.lineTo(236, -268); c.moveTo(12, -244); c.lineTo(236, -244);
    for (let q = 12; q < 236; q += 22) { c.moveTo(q, -244); c.lineTo(q + 22, -268) } for (const q of [12, 236]) { c.moveTo(q, -268); c.lineTo(q, -160) } c.stroke();
    rr(c, -118, -146, 236, 32, 6); fill(c, dk); c.save(); c.scale(fl, 1); tx(c, 'TOBACCO', 0, -129, { f: 'O', w: 700, s: 21, ls: 7, c: C.am3 }); c.restore();
    for (let i = 0; i < 7; i++) for (let j = 0; j < 2; j++) {
      if (j === 1 && i === 3) continue;
      const lit = H1(i * 3 + j + (o.seed || 0)) > .4, wx = -212 + i * 64, wy = -100 + j * 50;
      if (lit) { c.fillStyle = 'rgba(255,196,106,.32)'; c.fillRect(wx - 7, wy - 7, 44, 42) }
      c.fillStyle = lit ? C.am4 : lt; c.fillRect(wx, wy, 30, 28); c.fillStyle = col; c.fillRect(wx + 13, wy, 4, 28);
    }
    rr(c, -34, -62, 68, 64, [6, 6, 0, 0]); fill(c, dk); c.fillStyle = lt; for (let q = -54; q < 0; q += 10) c.fillRect(-28, q, 56, 3);
    c.restore();
    if (t < T0) return;
    // дым: облачка из труб поднимаются и растут
    for (const [cx, , h0] of ch) {
      const tx0 = x + cx * s * fl, ty0 = y - (150 + h0 * hk) * s;
      for (let m = 0; m < 5; m++) {
        const per = 2.6, ph = ((t - T0) / per + m / 5 + H1(cx) * .3) % 1, age = (t - T0) - ph * per; if (age < 0) continue;
        const e = eo(ph), z = ss(0, .1, ph) * (1 - ss(.75, 1, ph));
        cloud(c, tx0 + (40 + 60 * H1(m + cx)) * e * s * fl * (o.drift ?? 1), ty0 - 300 * e * s, lp(.35, 1.25, e) * s * z, 1, m * 9 + cx, o.smoke || C.wh);
      }
    }
  }
  // башня R.J. Reynolds (ар-деко, ступенями), окна зажигаются с t0
  const BT = [[500, 0, -250], [380, -250, -470], [270, -470, -620], [180, -620, -720]];
  function building(c, t, x0, y0, s, t0) {
    c.save(); c.translate(x0, y0); c.scale(s, s);
    for (const [w, a, b] of BT) { c.fillStyle = C.n1; c.fillRect(-w / 2, b, w, a - b) }
    poly(c, [-64, -720, 64, -720, 30, -800, -30, -800]); fill(c, C.n1);
    c.fillStyle = C.n1; c.fillRect(-7, -872, 14, 80);
    for (const [w, a, b] of BT) { c.fillStyle = C.n0; c.fillRect(w / 2 - w * .14, b, w * .14, a - b); c.fillStyle = C.n2; c.fillRect(-w / 2, b, w, 9) }
    let idx = 0;
    for (const [w, a, b] of BT) {
      const cols = Math.floor((w - 40) / 40), x1 = -((cols - 1) * 40) / 2;
      for (let y = b + 34; y < a - 30; y += 38) for (let j = 0; j < cols; j++) {
        const tt = t0 + H1(idx * 1.7 + 3) * 1.0, lit = at(t, tt, tt + .08); idx++;
        c.fillStyle = lit >= 1 ? C.am4 : lit > 0 ? mixc(C.n2, C.am4, lit) : C.n2;
        c.fillRect(x1 + j * 40 - 8, y, 16, 22);
      }
    }
    c.restore();
  }
  // верблюд-дромадер (силуэт), ноги — отдельно, чтобы колени были острыми
  const CAMB = [40, -150, 70, -196, 130, -214, 176, -286, 226, -290, 270, -226, 300, -208, 322, -262, 342, -304, 372, -322, 400, -314, 418, -296, 410, -284, 384, -280, 362, -262, 348, -218, 334, -168, 312, -128, 250, -108, 180, -100, 110, -110, 58, -118];
  function camelSil(c, x, y, s, col, step = 0) {
    c.save(); c.translate(x, y); c.scale(s, s); c.translate(-230, 0);
    spline(c, CAMB); fill(c, col);
    c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = 9; c.beginPath(); c.moveTo(44, -164); c.quadraticCurveTo(22, -140, 26, -104); c.stroke();
    const sw = Math.sin(step) * 8;
    for (const [lx, d] of [[62, sw], [94, -sw], [262, -sw], [294, sw]]) { poly(c, [lx - 11, -124, lx + 11, -124, lx + 8 + d * .5, -58, lx + 7 + d, 0, lx - 7 + d, 0, lx - 9 + d * .5, -58]); fill(c, col) }
    c.restore();
  }
  function crown(c, x, y, s, col) {
    c.save(); c.translate(x, y); c.scale(s, s);
    poly(c, [-120, 60, -150, -60, -70, 6, 0, -96, 70, 6, 150, -60, 120, 60]); fill(c, col);
    c.fillStyle = col; c.fillRect(-124, 70, 248, 30);
    for (const [px, py] of [[-150, -60], [0, -96], [150, -60]]) circ(c, px, py - 18, 20, col);
    c.restore();
  }
  // пачка «как настоящая»: передняя грань, торец справа, верх; линия откидной крышки, акцизная марка, блик; open — фольга и фильтры
  function packBox(c, w, h, o, art) {
    const d = w * (o.dz || .16), dy = d * .42;
    rr(c, -w / 2 + 18, -h / 2 + 22, w + d * .6, h, 14); fill(c, 'rgba(20,25,53,.26)');
    if (o.open) {
      poly(c, [-w / 2 + 14, -h / 2 + 4, w / 2 - 6, -h / 2 + 4, w / 2 + d - 10, -h / 2 - dy, -w / 2 + d + 4, -h / 2 - dy]); fill(c, '#cfd6e2');
      for (let i = 0; i < 3; i++) {
        const fx = -w * .26 + i * w * .26, fy = -h / 2 - dy - h * .07 - (i === 1 ? h * .03 : 0);
        rr(c, fx - w * .1, fy, w * .2, h * .16, w * .06); fill(c, o.filt || '#e8a35a');
        c.fillStyle = 'rgba(122,63,21,.35)'; for (let q = 0; q < 4; q++) c.fillRect(fx - w * .06 + q * w * .035, fy + h * .03 + (q % 2) * h * .03, w * .018, w * .018);
      }
      poly(c, [-w / 2 + 6, -h / 2 + 2, -w / 2 + 6, -h / 2 - h * .07, -w / 2 + w * .3, -h / 2 - h * .04, -w / 2 + w * .32, -h / 2 + 2]); fill(c, '#e9edf3');
    }
    poly(c, [w / 2, -h / 2 + 8, w / 2 + d, -h / 2 + 8 - dy, w / 2 + d, h / 2 - 8 - dy, w / 2, h / 2 - 8]); fill(c, o.side);
    if (!o.open) { poly(c, [-w / 2 + 8, -h / 2, w / 2, -h / 2, w / 2 + d, -h / 2 - dy, -w / 2 + d + 8, -h / 2 - dy]); fill(c, o.top || o.side) }
    rr(c, -w / 2, -h / 2, w, h, 12); fill(c, o.body);
    c.save(); rr(c, -w / 2, -h / 2, w, h, 12); c.clip(); art(c);
    const ly = -h / 2 + h * .27;
    c.strokeStyle = 'rgba(20,25,53,.4)'; c.lineWidth = 3; c.beginPath(); c.moveTo(-w / 2, ly); c.lineTo(w / 2, ly); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(-w / 2 + w * .06, -h / 2, w * .07, h);
    c.restore();
    c.strokeStyle = 'rgba(20,25,53,.45)'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(w / 2, ly); c.lineTo(w / 2 + d, ly - dy + h * .07); c.stroke();   // косой срез откидной крышки на торце
    if (o.stamp !== false && !o.open) {
      const sc = o.stampC || '#e9e3cf';
      poly(c, [-w * .12, -h / 2 + 1, w * .12, -h / 2 + 1, w * .12 + d * .5, -h / 2 - dy * .5, -w * .12 + d * .5, -h / 2 - dy * .5]); fill(c, sc);
      c.fillStyle = sc; c.fillRect(-w * .12, -h / 2, w * .24, h * .05);
      c.fillStyle = 'rgba(20,25,53,.25)'; for (let q = 0; q < 5; q++) c.fillRect(-w * .1 + q * w * .045, -h / 2 + h * .012, w * .02, h * .026);
    }
    rr(c, -w / 2, -h / 2, w, h, 12); stroke(c, C.n0, 5);
  }
  // орёл-герб (Winston): раскрытые крылья
  function eagle(c, x, y, s, col) {
    c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col;
    for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(0, -6); c.lineTo(sx * 30, -30); c.lineTo(sx * 70, -48); c.lineTo(sx * 64, -30); c.lineTo(sx * 76, -26); c.lineTo(sx * 62, -12); c.lineTo(sx * 70, -6); c.lineTo(sx * 48, 4); c.lineTo(sx * 18, 10); c.closePath(); c.fill() }
    c.beginPath(); c.ellipse(0, 4, 16, 28, 0, 0, TAU); c.fill();
    circ(c, 0, -30, 12, col); poly(c, [8, -32, 20, -27, 8, -24]); fill(c, col);
    poly(c, [-14, 28, 14, 28, 22, 46, 0, 40, -22, 46]); fill(c, col);
    c.restore();
  }
  // старая серая пачка (интро): k 0 — пачка, дальше мнётся в комок
  function oldPack(c, x, y, s, r, k) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    if (k < .4) {
      const q = k / .4; c.scale(1 - .22 * q, 1 - .3 * q); c.rotate(Math.sin(q * 9) * .06 * q);
      packBox(c, 240, 350, { body: '#a3a9b6', side: '#7e8494', top: '#8d93a2', stampC: '#c9ccd4' }, c => {
        c.fillStyle = '#7e8494'; c.fillRect(-120, -175, 240, 70);
        circ(c, 0, -10, 46, '#8d93a2'); circ(c, 0, -10, 30, '#a3a9b6');
        const w = tt('cigs'); tx(c, w, 0, 80, { f: 'O', w: 700, s: w.length > 9 ? 30 : 36, ls: 3, c: '#3b4050' });
        if (q > 0) { c.save(); c.globalAlpha = q; c.strokeStyle = 'rgba(40,44,60,.5)'; c.lineWidth = 4; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-100 + i * 50, -170); c.lineTo(-60 + i * 40, 170 * (H1(i) - .5)); c.lineTo(-90 + i * 45, 170); c.stroke() } c.restore() }
      });
    } else {
      const q = at(k, .4, 1), n = 15, P = [];
      for (let i = 0; i < n; i++) { const a = i / n * TAU, R = lp(150, 92, q) * (.8 + .36 * H1(i * 5.3 + 1)); P.push(Math.cos(a) * R, Math.sin(a) * R * lp(1.2, .95, q)) }
      poly(c, P); fill(c, '#a3a9b6');
      c.save(); poly(c, P); c.clip(); c.fillStyle = '#7e8494'; c.fillRect(10, -200, 200, 400); c.restore();
      c.strokeStyle = '#6b7182'; c.lineWidth = 6; c.lineJoin = 'round'; c.lineCap = 'round';
      for (let i = 0; i < 6; i++) { const a = H1(i * 2.1 + 3) * TAU, L = 80; c.beginPath(); c.moveTo(Math.cos(a) * 14, Math.sin(a) * 14); c.lineTo(Math.cos(a + .45) * L * .6, Math.sin(a + .45) * L * .6); c.lineTo(Math.cos(a + .15) * L, Math.sin(a + .15) * L); c.stroke() }
    }
    c.restore();
  }
  // урна: корпус с рёбрами, ободок, крышка-«качелька» (lid 0 — закрыта, 1 — открыта); (x, y) — середина низа
  function trashBin(c, x, y, s, lid) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.beginPath(); c.ellipse(0, 6, 150, 26, 0, 0, TAU); fill(c, 'rgba(10,16,48,.35)');
    poly(c, [-130, -300, 130, -300, 108, 0, -108, 0]); fill(c, '#5f6b80');
    c.save(); poly(c, [-130, -300, 130, -300, 108, 0, -108, 0]); c.clip(); c.fillStyle = '#4c566a'; c.fillRect(40, -310, 120, 320);
    c.strokeStyle = '#46506a'; c.lineWidth = 10; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 46, -270); c.lineTo(i * 39, -30); c.stroke() } c.restore();
    rr(c, -142, -322, 284, 30, 12); fill(c, '#7a869b');
    c.save(); c.translate(-142, -322); c.rotate(-lid * 1.15); rr(c, 0, -26, 284, 26, 10); fill(c, '#8b97ab'); rr(c, 112, -46, 60, 22, 8); fill(c, '#5f6b80'); c.restore();
    c.restore();
  }
  // пачки 1973: CAMEL (жёлтая: верблюд, пирамиды, пальма; открыта — фольга и фильтры) и WINSTON (бело-синяя, орёл)
  function camelPack(c, x, y, s, r) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    packBox(c, 260, 380, { body: '#ecc062', side: '#b8862f', top: '#d9ac52', stampC: '#f3dfa2', dz: .22 }, c => {
      c.fillStyle = '#f4d27e'; c.fillRect(-130, -190, 260, 60);
      c.fillStyle = '#d9a03f'; c.fillRect(-130, 92, 260, 110);
      circ(c, 80, -20, 26, '#f7e2a8');
      poly(c, [-118, 92, -52, 8, 14, 92]); fill(c, '#c98f32'); poly(c, [-52, 8, 14, 92, -20, 92]); fill(c, '#b47c27');
      poly(c, [-20, 92, 26, 40, 72, 92]); fill(c, '#d9a03f'); poly(c, [26, 40, 72, 92, 52, 92]); fill(c, '#c98f32');
      c.strokeStyle = '#5a3a16'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(92, 92); c.quadraticCurveTo(84, 40, 96, 0); c.stroke();
      for (const a of [-2.6, -1.9, -1.2, -.5, .2]) { c.save(); c.translate(96, 0); c.rotate(a); leafPath(c, 0, 0, 52, 13); fill(c, '#5a3a16'); c.restore() }
      camelSil(c, -10, 120, .34, '#4a2f12');
      tx(c, 'CAMEL', 0, -120, { f: 'O', w: 700, s: 84, ls: 6, c: '#3d2a12' });
      c.fillStyle = '#3d2a12'; c.fillRect(-96, -70, 192, 5);
      tx(c, 'TURKISH & DOMESTIC BLEND', 0, 166, { f: 'O', w: 500, s: 16, ls: 2, c: '#5a3a16' });
    });
    c.restore();
  }
  function winstonPack(c, x, y, s, r) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    packBox(c, 260, 380, { body: C.white, side: '#aab6cc', top: '#e3e8f1', stampC: '#f3d9a0', dz: .22 }, c => {
      c.fillStyle = '#1d4fa0'; c.fillRect(-130, -190, 260, 210);
      c.fillStyle = '#163d80'; c.fillRect(-130, 4, 260, 16);
      c.fillStyle = '#2a63b8'; c.fillRect(-130, -190, 260, 26);
      eagle(c, 0, -118, .62, C.white);
      tx(c, 'WINSTON', 0, -36, { f: '"Liberation Serif"', w: 700, s: 54, ls: 2, c: C.white });
      tx(c, 'FILTER CIGARETTES', 0, 62, { f: 'O', w: 500, s: 22, ls: 3, c: '#1d4fa0' });
      c.fillStyle = C.red; c.fillRect(-90, 94, 180, 6);
      tx(c, '20 CLASS A CIGARETTES', 0, 150, { f: 'O', w: 500, s: 15, ls: 2, c: '#5a6584' });
    });
    c.restore();
  }
  // меморандум 640×800: печатные строки, цитата по словам голоса, маркер, подпись, штамп
  const MW = 640, MH = 800, QL = [['МЫ', 'ДОЛЖНЫ', 'ПОЛУЧИТЬ'], ['СВОЮ', 'ДОЛЮ'], ['МОЛОДЁЖНОГО', 'РЫНКА']];
  let QFS = 48;
  function qLayout(c) { QFS = Math.min(48, 48 * 528 / Math.max(...QL.map(q => tw(c, q.join(' '), { s: 48 })))); return QFS }
  function stampBox(c, s, x, y, k, col, r = -.2, fs = 50, bg) {
    if (k <= 0) return;
    const sc = lp(1.9, 1, bo(k));
    c.save(); c.translate(x, y); c.rotate(r); c.scale(sc, sc); c.globalAlpha *= cl(k * 5) * .94;
    const w = tw(c, s, { s: fs, ls: 6 }) + fs * 1.1, h = fs * 1.9;
    if (bg) { rr(c, -w / 2, -h / 2, w, h, 14); fill(c, bg) }
    c.strokeStyle = col; rr(c, -w / 2, -h / 2, w, h, 14); c.lineWidth = 7; c.stroke();
    rr(c, -w / 2 + 11, -h / 2 + 11, w - 22, h - 22, 8); c.lineWidth = 2.5; c.stroke();
    tx(c, s, 0, 3, { s: fs, ls: 6, c: col });
    c.restore();
  }
  function memo(c, t, o = {}) {
    const F = o.full;
    if (o.sh !== false) { c.fillStyle = o.shc || 'rgba(20,25,53,.22)'; c.fillRect(18, 22, MW, MH) }
    c.fillStyle = C.white; c.fillRect(0, 0, MW, MH);
    tx(c, 'R.J. REYNOLDS TOBACCO COMPANY', 56, 72, { f: 'J', w: 700, s: 22, ls: 2, c: C.n1, al: 'left' });
    c.fillStyle = C.n1; c.fillRect(56, 96, MW - 112, 4);
    tx(c, 'МЕМОРАНДУМ', 56, 150, { s: 50, c: C.ink, al: 'left' });
    tx(c, '2 ФЕВРАЛЯ 1973', 56, 200, { f: 'J', w: 500, s: 24, ls: 1, c: C.n2, al: 'left' });
    [520, 470, 505, 330, 480].forEach((L, i) => { const t0 = K.typ + i * .16, k = F ? 1 : eo(at(t, t0, t0 + .2)); if (k > 0) { rr(c, 56, 250 + i * 32, L * k, 13, 6.5); fill(c, C.pa2) } });
    const fs = qLayout(c), sp = tw(c, ' ', { s: fs });
    let wi = 0;
    QL.forEach((L, i) => {
      const y = 470 + i * fs * 1.25;
      if (i === 2) { const m = F ? 1 : eio(at(t, K.q4 - .05, K.q5 + .15)); if (m > 0) { const w = (tw(c, L.join(' '), { s: fs }) + 28) * m; poly(c, [44, y - fs * .52, 44 + w, y - fs * .56, 44 + w - 6, y + fs * .52, 40, y + fs * .5]); fill(c, C.mk) } }
      let x = 56;
      for (const w of L) { const t0 = K.qt[wi++] - .06, k = F ? 1 : eo(at(t, t0, t0 + .22)); if (k > 0) tx(c, w, x, y + (1 - k) * 20, { s: fs, c: C.ink, al: 'left', a: k }); x += tw(c, w, { s: fs }) + sp }
    });
    const ks = F ? 1 : eio(at(t, K.sig, K.sig + .45));
    if (ks > 0) {
      c.save(); c.strokeStyle = C.n1; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
      for (let i = 0; i <= 70 * ks; i++) { const u = i / 70, px = 60 + u * 220, py = 700 + Math.sin(u * 17) * 15 * (1 - u * .5) - u * 10 + Math.sin(u * 5) * 6; i ? c.lineTo(px, py) : c.moveTo(px, py) }
      c.stroke(); c.restore();
      tx(c, 'К. ТИГ · ОТДЕЛ ИССЛЕДОВАНИЙ', 60, 748, { f: 'J', w: 500, s: 17, ls: 1, c: C.n2, al: 'left', a: F ? 1 : at(t, K.sig + .1, K.sig + .35) });
    }
    stampBox(c, 'СЕКРЕТНО', 450, 318, F ? 1 : at(t, K.secret, K.secret + .26), C.red);
    if (o.done) stampBox(c, 'ПЛАН ВЫПОЛНЕН', 330, 696, o.done, '#1f9b7c', -.1, 50, 'rgba(255,255,255,.95)');   // ниже цитаты — она читается
  }
  const MEMO = { x: 960, y: 560, s: .62, r: .03 };
  const memoW = (lx, ly, P = MEMO) => { const [x, y] = rot((lx - MW / 2) * P.s, (ly - MH / 2) * P.s, P.r); return [P.x + x, P.y + y] };
  function memoAt(c, t, p, o) { c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.scale(p.s, p.s); c.translate(-MW / 2, -MH / 2); memo(c, t, o); c.restore() }
  // корнер-метка года (экран): плашка + цифры, как барабан в углу
  function yearPlate(c, x, y, s, a) {
    if (a <= 0 || s <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= a;
    rr(c, -300 + 14, -125 + 16, 600, 250, 40); fill(c, 'rgba(20,25,53,.3)');
    rr(c, -300, -125, 600, 250, 40); fill(c, C.n0);
    c.restore();
  }

  // ================= 1. сегодня: заголовок → вейп; лучи, пар, манго, мята, зачёркнутые сигареты =================
  const V1 = { x: 960, y: 640, r: -.1, s: .84 };
  const v1p = (lx, ly) => { const [x, y] = rot(lx * V1.s, ly * V1.s, V1.r); return [V1.x + x, V1.y + y] };
  const BGV = [
    { x: 300, y: 860, r: .16, s: .54, body: C.mint, shade: C.mint2, mp: C.wh, mps: C.pa2, lc: C.wh, label: 'MINT', d: 0 },
    { x: 1640, y: 850, r: -.2, s: .52, body: C.white, shade: C.pa2, mp: C.n3, mps: C.n2, lc: C.ink, label: 'BERRY', d: .12 },
  ];
  const BIN = { x: 300, y: 1072, s: .86 };   // урна, откуда выпрыгивает мятный вейп
  function cam1(t) {
    const [fx, fy] = v1p(0, 30);
    const kp = eio(at(t, K.push, K.liq));
    const s0 = lp(1, 1.1, kp), x0 = lp(960, 960 + (fx - 960) * .35, kp), y0 = lp(540, 540 + (fy - 540) * .35, kp);
    const kz = at(t, K.liq, K.zoomE);
    if (kz <= 0) return { s: s0, x: x0, y: y0, r: 0 };
    const e = eio(kz), s = s0 * Math.pow(48 / s0, e), r = lp(0, -V1.r, e);
    const P0x = 960 + s0 * (fx - x0), P0y = 540 + s0 * (fy - y0), m = ss(0, .8, kz);
    const [qx, qy] = rot((lp(P0x, 960, m) - 960) / s, (lp(P0y, 540, m) - 540) / s, -r);
    return { s, x: fx - qx, y: fy - qy, r };
  }
  const TITLE = ['ЧТО', 'ВЫ', 'ЗНАЕТЕ', 'ОБ', 'ОДНОРАЗКАХ?'];
  // слова заголовка — на одной линии с первого кадра: появляются на месте (масштаб), без «ступенек»; «ЧТО» — уже в кадре 0
  function titleText(c, t, a) {
    const fs0 = 104, o = { s: fs0, w: 800, ls: 2 }, full = tw(c, TITLE.join(' '), o), fs = Math.min(fs0, fs0 * 1600 / full), oo = { s: fs, w: 800, ls: 2, c: C.white };
    const sp = tw(c, ' ', oo) + 2, ws = TITLE.map(w => tw(c, w, oo)), tot = ws.reduce((p, q) => p + q, 0) + sp * (TITLE.length - 1);
    let x = 960 - tot / 2;
    TITLE.forEach((w, j) => {
      const t0 = j === 0 ? -1 : Math.max(.06, K.tw[j] - .12), k = eo(at(t, t0, t0 + .22));
      tx(c, w, x, 540, { ...oo, al: 'left', a, c: mixc('#f2949f', C.white, k) });   // v16.2: вся фраза стоит с кадра 0, слово загорается белым в такт голосу
      x += ws[j] + sp;
    });
  }
  function heroVape(c, t) {
    const k = eio(at(t, K.morph, K.morphE));
    if (k < 1) {
      const cx = lp(960, V1.x, k), cy = lp(540, V1.y, k), w = lp(2040, 230 * V1.s, k), h = lp(250, 640 * V1.s, k), r = Math.min(lp(0, 58 * V1.s, k), w / 2, h / 2), ro = lp(0, V1.r, k);
      c.save(); c.translate(cx, cy); c.rotate(ro); rr(c, -w / 2, -h / 2, w, h, r); fill(c, C.red);
      c.save(); c.clip();
      const sw = 70 * V1.s * ss(.55, 1, k); if (sw > 0) { c.fillStyle = C.red2; c.fillRect(w / 2 - sw, -h / 2, sw, h) }
      const ta = 1 - ss(0, .32, k); if (ta > 0) { c.rotate(-ro); c.translate(-cx, -cy); titleText(c, t, ta) }
      c.restore(); c.restore();
      if (t < K.morphE - .06) return;
    }
    const led = Math.max(pulse(t, K.puff1), pulse(t, K.puff2), pulse(t, K.want), ss(K.drag - .1, K.drag, t));
    c.save(); c.translate(V1.x, V1.y); c.rotate(V1.r); c.scale(V1.s, V1.s);
    vapeBody(c, { ...HERO, t, led, mk: bo(at(t, K.morphE - .06, K.morphE + .26)), wk: spr(at(t, K.morphE - .02, K.morphE + .42)), lk: at(t, K.morphE + .1, K.morphE + .35), bub: 1 - at(t, K.liq, K.liq + .25) });
    c.restore();
  }
  // фон интро: кольца плывут вверх — v16.2: «еле видны»
  function introDecor(c, t) {
    c.save(); c.strokeStyle = C.sky2; c.lineWidth = 4;
    for (let i = 0; i < 26; i++) { const x = H1(i * 7.3) * 2100 - 90, y = ((H1(i * 3.1) * 1300 - t * (14 + 22 * H1(i))) % 1300 + 1300) % 1300 - 110, r = 6 + 16 * H1(i * 1.7); c.globalAlpha = (.14 + .1 * H1(i)) * .4; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke() }
    c.restore();
  }
  // v16.2: вечерний город вторым планом (как у Боба) — небо, дальние и ближние дома с тёплыми окнами, дымка, фонари по краям;
  // слои едут с разной скоростью (параллакс); K1 — камера интро
  const CITY1 = [...Array(30)].map((_, i) => ({ x: -260 + i * 86 + 30 * H1(i * 1.3), w: 64 + 44 * H1(i * 2.1), h: 150 + 230 * H1(i * 3.7), s: i, top: H1(i * 9.3) }));
  const CITY2 = [...Array(17)].map((_, i) => ({ x: -330 + i * 152 + 40 * H1(i * 5.3 + 9), w: 104 + 66 * H1(i * 4.3), h: 230 + 290 * H1(i * 6.1 + 2), s: 50 + i, top: H1(i * 7.7) }));
  function skyline(c, t, L, base, col, wc, ww, wh, wa, lit) {
    for (const b of L) {
      const x = b.x, y = base - b.h; c.fillStyle = col; c.fillRect(x, y, b.w, b.h + 600);
      if (b.top > .78) c.fillRect(x + b.w * .32, y - 54, 6, 56);
      else if (b.top > .58) { c.fillRect(x + b.w * .55, y - 30, 30, 26); c.fillRect(x + b.w * .55 + 4, y - 4, 4, 6); c.fillRect(x + b.w * .55 + 22, y - 4, 4, 6) }
      else if (b.top < .18) { poly(c, [x, y, x + b.w, y, x + b.w * .5, y - b.w * .35]); fill(c, col) }
      const nx = Math.floor((b.w - 10) / (ww * 2)), ny = Math.floor((b.h - 24) / (wh * 1.9));
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
        const q = H1(b.s * 31 + i * 7.1 + j * 13.3); if (q > lit) continue;
        c.globalAlpha = wa * (q < .03 ? .45 + .55 * Math.sin(t * 2.2 + b.s + i) : 1); c.fillStyle = q < lit * .25 ? '#ffe3ae' : wc;
        c.fillRect(x + 9 + i * ww * 2, y + 16 + j * wh * 1.9, ww, wh);
      }
      c.globalAlpha = 1;
    }
  }
  function streetLamp(c, x, dir) {
    c.fillStyle = '#0b1135'; c.fillRect(x - 8, 380, 16, 900);
    c.strokeStyle = '#0b1135'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, 392); c.quadraticCurveTo(x, 352, x + dir * 70, 356); c.stroke();
    const lx = x + dir * 86;
    c.save(); c.globalAlpha = .07; poly(c, [lx - 22, 380, lx + 22, 380, lx + 120, 880, lx - 120, 880]); fill(c, '#ffd27a'); c.restore();
    for (const [r, a] of [[170, .04], [110, .07], [62, .12], [34, .22]]) { c.save(); c.globalAlpha = a; circ(c, lx, 384, r, '#ffd27a'); c.restore() }
    poly(c, [lx - 30, 384, lx + 30, 384, lx + 16, 360, lx - 16, 360]); fill(c, '#0b1135'); circ(c, lx, 388, 11, '#fff2c8');
  }
  function introBg(c, t, K1) {
    const g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#0a1240'); g.addColorStop(.5, '#1b2a74'); g.addColorStop(.78, '#3a3a86'); g.addColorStop(1, '#4b3a7c');
    c.fillStyle = g; c.fillRect(-200, -200, WW + 400, HH + 400);
    const L = (f, fn) => { c.save(); cam(c, lp(1, K1.s, f), lp(960, K1.x, f), lp(540, K1.y, f), (K1.r || 0) * f); fn(); c.restore() };
    L(.2, () => {
      const hg = c.createRadialGradient(960, 860, 40, 960, 860, 980); hg.addColorStop(0, 'rgba(255,176,104,.32)'); hg.addColorStop(1, 'rgba(255,176,104,0)'); c.fillStyle = hg; c.fillRect(-600, -400, 3200, 1900);
      introDecor(c, t);
    });
    L(.35, () => skyline(c, t, CITY1, 820, '#28327a', '#ffc46a', 6, 8, .55, .34));
    L(.5, () => {   // дымка над крышами, медленно плывёт
      const hz = c.createLinearGradient(0, 660, 0, 900); hz.addColorStop(0, 'rgba(160,170,255,0)'); hz.addColorStop(.55, 'rgba(160,170,255,.16)'); hz.addColorStop(1, 'rgba(160,170,255,0)');
      c.fillStyle = hz; c.fillRect(-600, 660, 3200, 240);
      for (let i = 0; i < 7; i++) { const x = ((i * 380 + t * 18) % 2600) - 340; c.save(); c.globalAlpha = .06; c.beginPath(); c.ellipse(x, 760 + 30 * Math.sin(i * 2.1), 260, 46, 0, 0, TAU); fill(c, '#c9d0ff'); c.restore() }
    });
    L(.65, () => skyline(c, t, CITY2, 880, '#151d58', '#ffcf7a', 9, 12, .9, .44));
    L(1, () => { c.fillStyle = '#0a0f33'; c.fillRect(-600, 880, 3200, 900); c.fillStyle = '#212a6c'; c.fillRect(-600, 880, 3200, 6); streetLamp(c, 66, 1); streetLamp(c, 1854, -1) });
  }
  function shot1(c, t) {
    c.fillStyle = C.deep; c.fillRect(-200, -200, WW + 400, HH + 400);
    const K1 = cam1(t);
    introBg(c, t, K1);
    c.save(); cam(c, K1.s, K1.x, K1.y, K1.r);
    if (t < K.morph) { const hb = 250; c.fillStyle = C.red; c.fillRect(-60, 540 - hb / 2, WW + 120, hb); c.save(); c.beginPath(); c.rect(0, 540 - hb / 2, WW, hb); c.clip(); titleText(c, t, 1); c.restore() }
    else {
      // правый вейп (ягоды) поднимается на «модная»
      { const b = BGV[1], k = eo(at(t, K.bgv + b.d, K.bgv + b.d + .5)); if (k > 0) { c.save(); c.translate(b.x, b.y + (1 - k) * 760); c.rotate(b.r); c.scale(b.s, b.s); vapeBody(c, { ...b, liq: C.am, liq2: C.am3, led: pulse(t, K.par + .1 + b.d), t: t + b.x, level: -40 }); c.restore() } }
      // старая серая пачка: появляется, мнётся, летит в урну; из урны выпрыгивает мятный вейп
      // v16.2: пачка падает в урну → урна уезжает влево за край → на пустом месте снизу поднимается «МЯТА»
      const kbin = eo(at(t, K.cig - .05, K.cig + .4)), kgo = ei(at(t, K.cross + .95, K.cross + 1.3));
      const lid = Math.min(eo(at(t, K.cross + .15, K.cross + .3)), 1 - ei(at(t, K.cross + .78, K.cross + .88)));
      const by = BIN.y + (1 - kbin) * 560;
      { const b = BGV[0], ks = at(t, K.mintIn, K.mintIn + .5); if (ks > 0) { c.save(); c.translate(b.x, lp(b.y + 760, b.y, bo(ks))); c.rotate(lp(.3, b.r, eo(ks))); c.scale(b.s, b.s); vapeBody(c, { ...b, liq: C.am, liq2: C.am3, led: pulse(t, K.par + .1), t: t + b.x, level: -40 }); c.restore() } }
      if (kbin > 0 && kgo < 1) { c.save(); c.translate(BIN.x - kgo * 820, by); c.rotate(-.25 * kgo); trashBin(c, 0, 0, BIN.s, lid); c.restore() }
      const kp = spr(at(t, K.cig - .1, K.cig + .32)), kcr = at(t, K.cross - .05, K.cross + .35), kfl = at(t, K.cross + .32, K.cross + .8);
      if (kp > 0 && kfl < 1) { const e = eio(kfl), mx = BIN.x + 20, my = by - BIN.s * 330; oldPack(c, lp(400, mx, e), lp(330, my, e) - Math.sin(Math.PI * kfl) * 200, kp * lp(.92, .5, e), lp(-.14, 2.6, e) + Math.sin(t * 2) * .03 * (1 - kcr), kcr) }
      const km = spr(at(t, K.mango, K.mango + .45)); mango(c, 560, 640 + Math.sin(t * 2.2) * 8, km * 1.05, -.15 + .05 * Math.sin(t * 1.7)); mangoSlice(c, 640, 300 + Math.sin(t * 1.9 + 2) * 8, spr(at(t, K.mango + .12, K.mango + .57)) * .95, .3 + .04 * Math.sin(t * 1.6)); mangoSlice(c, 420, 470 + Math.sin(t * 1.7) * 8, spr(at(t, K.mango + .22, K.mango + .67)) * .7, -.5 + .05 * Math.sin(t * 1.4));
      const kn = spr(at(t, K.mint, K.mint + .45)); mintLeaf(c, 1360, 330 + Math.sin(t * 2 + 1) * 8, kn * .82, -.55 + .06 * Math.sin(t * 1.9 + 1)); mintLeaf(c, 1390, 660 + Math.sin(t * 2.3) * 8, spr(at(t, K.mint + .12, K.mint + .57)) * .7, .45 + .05 * Math.sin(t * 1.5));
      heroVape(c, t);
      // густой пар: облака держатся вокруг вейпа
      const [px, py] = v1p(0, -470);
      for (let i = 0; i < 7; i++) {
        const t0 = K.par - .35 + i * .09, k = eo(at(t, t0, t0 + .8)); if (k <= 0) continue;
        const a = -Math.PI / 2 + (i - 3) * .42, d = 120 + 70 * (i % 3);
        cloud(c, px + Math.cos(a) * d * k + Math.sin(t * .9 + i) * 10, py + 40 + Math.sin(a) * d * k * .55 + Math.cos(t * .8 + i) * 8, (1.05 + .25 * H1(i)) * k, 1, i * 5, C.white);
      }
      for (const a of [K.puff1, K.puff2]) puff(c, t, a, px, py, 1, 1);
      { const b = BGV[1], [qx, qy] = rot(0, -470 * b.s, b.r); puff(c, t, K.par + .1 + b.d, b.x + qx, b.y + qy, -1, .62) }
      for (const [i, t0] of K.puffs) {   // v16.2: по очереди, у каждого вейпа — свои облачка
        if (i === 2) { puff(c, t, t0, px, py, 1, 1); continue }
        if (i === 0 && t0 < K.mintOn) continue;   // мята — только когда уже на месте
        const b = BGV[i], [qx, qy] = rot(0, -470 * b.s, b.r); puff(c, t, t0, b.x + qx, b.y + qy, i ? -1 : 1, .62);
      }
    }
    c.restore();
  }

  // ================= 2. 1973: в жидкости — молекула; заводы, барабан лет, империя, пачки, меморандум =================
  const DRUMY = [2026, 2020, 2010, 2000, 1990, 1980, 1973];
  function cam2(t) {
    let s = lp(1, 1.04, eio(at(t, K.emp, K.prep))), x = 960, y = 540, r = 0;
    const k1 = eio(at(t, K.goal - .15, K.goal + .55)); s = lp(s, 1.95, k1); x = lp(x, MEMO.x, k1); y = lp(y, MEMO.y, k1); r = lp(0, -MEMO.r, k1);
    const k2 = eio(at(t, K.comp - .25, K.comp + .45)), QY = memoW(320, 470 + QFS * 1.25)[1]; s = lp(s, 2.5, k2); y = lp(y, QY, k2);
    const kz = at(t, K.prob - .3, K.prob + .25);
    if (kz > 0) { const [mx, my] = memoW(56 + tw(X, QL[2].join(' '), { s: QFS }) / 2, 470 + 2 * QFS * 1.25 + QFS * .46), Z = zoomCam(kz, mx, my, s, 14, x, y); return { s: Z.s, x: Z.x, y: Z.y, r } }
    return { s, x, y, r };
  }
  function memoPose(t) {
    const k = at(t, K.prep, K.prep + .7), e = spr(k), u = at(t, K.secret + .05, K.secret + .3);
    return { x: lp(1760, MEMO.x, e), y: lp(1520, MEMO.y, e) + Math.sin(Math.PI * u) * 8, r: lp(.42, MEMO.r, eo(k)), s: MEMO.s };
  }
  function drumAt(c, t) {
    if (t < K.drum0 || t > K.y73go + .5) return;
    const a = spr(at(t, K.drum0, K.drum0 + .35)), e = eio(at(t, K.y73go, K.y73go + .5)), hk = at(t, K.y73, K.y73 + .3), sc = (1 + .1 * Math.sin(Math.PI * hk)) * a;
    const x = lp(960, 174, e), y = lp(330, 112, e), s = lp(1, .36, e) * sc;
    yearPlate(c, x, y, s, 1);
    c.save(); c.translate(x, y); c.scale(s, s); yearDrum(c, t, DRUMY, K.drumT, 0, 0, { s: 200, c: C.white, dir: -1 }); c.restore();
    if (hk > 0 && hk < 1 && e <= 0) {
      c.save(); c.strokeStyle = C.n0; c.lineWidth = 8; c.lineCap = 'round'; c.globalAlpha = 1 - hk;
      for (let i = 0; i < 10; i++) { const an = i / 10 * TAU, r0 = 330 + 60 * eo(hk), r1 = r0 + 50; c.beginPath(); c.moveTo(x + Math.cos(an) * r0, y + Math.sin(an) * r0 * .55); c.lineTo(x + Math.cos(an) * r1, y + Math.sin(an) * r1 * .55); c.stroke() }
      c.restore();
    }
  }
  function shot2(c, t) {
    c.fillStyle = C.am; c.fillRect(-200, -200, WW + 400, HH + 400);
    const K2 = cam2(t); c.save(); cam(c, K2.s, K2.x, K2.y, K2.r);
    if (t < K.giants2 + .6) for (let i = 0; i < 26; i++) {
      const ph = ((t - K.zoomE) * (.18 + .12 * H1(i)) + H1(i * 3.3)) % 1, a = 1 - ss(K.giants, K.giants2 + .6, t);
      circ(c, H1(i * 7.1) * 2000 - 40 + Math.sin(t * 1.5 + i) * 20, lp(1200, -120, ph), (8 + 34 * H1(i * 2.9)) * a, C.am3);
    }
    const kg = eo(at(t, K.giants, K.giants + .55)), gy = (1 - kg) * 700;
    // солнце и дальний город — фон 1973
    if (kg > 0) {
      circ(c, 1730, 150 + gy * .4, 150 * kg, C.am3); circ(c, 1730, 150 + gy * .4, 104 * kg, C.am4);   // v16.2: солнце — выше, в правом углу
      c.save(); c.globalAlpha = .5 * kg;   // дальний город — светлее (воздух)
      for (let i = 0; i < 22; i++) {
        const bx = -160 + i * 96, bh = 160 + 210 * H1(i * 5.9 + 3), yb = 880 + gy;
        c.fillStyle = '#f2b45e'; c.fillRect(bx, yb - bh, 84, bh); if (H1(i * 2.7) > .7) c.fillRect(bx + 40, yb - bh - 70, 10, 70);
        c.fillStyle = '#ffe3ae'; for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) if (H1(i * 13 + r * 3 + q) > .62) c.fillRect(bx + 10 + q * 24, yb - bh + 14 + r * 30, 12, 14);
      }
      c.restore();
      c.save(); c.globalAlpha = .78 * kg;
      for (let i = 0; i < 16; i++) {
        const bx = -140 + i * 135, bh = 110 + 170 * H1(i * 3.7), yb = 905 + gy;
        c.fillStyle = '#e48c35'; c.fillRect(bx, yb - bh - 40, 104, bh + 40); if (H1(i * 1.3) > .55) c.fillRect(bx + 64, yb - bh - 150, 20, 120);
        c.fillStyle = '#d27a2c'; c.fillRect(bx - 4, yb - bh - 46, 112, 10); c.fillRect(bx + 78, yb - bh - 40, 26, bh + 40);   // карниз, тень сбоку
        for (let r = 0; r < 3; r++) for (let q = 0; q < 2; q++) if (H1(i * 9 + r * 3 + q) > .5) { const wx = bx + 18 + q * 44, wy = yb - bh + 10 + r * 40; c.fillStyle = 'rgba(255,227,174,.45)'; c.fillRect(wx - 5, wy - 5, 32, 28); c.fillStyle = '#fff1cc'; c.fillRect(wx, wy, 22, 18) }
      }
      c.restore();
    }
    const kw = eo(at(t, K.emp, K.emp + .8)); if (kw > 0) { c.save(); c.globalAlpha = .62 * kw; const sc = lp(.92, 1, kw); camelSil(c, 860, 790, 2.3 * sc, C.am2, t * 1.5); crown(c, 1460, 168, .8 * sc, C.am2); c.restore() }   // v16.2: крупнее и выше
    if (kg > 0) {
      const hk = lp(.45, 1, spr(at(t, K.giants2, K.giants2 + .6))), fd = eio(at(t, K.camel - .35, K.camel + .2)) * 230;   // пачки вылетают — заводы опускаются
      const far = '#57434a', farD = '#453332', farL = '#615165';   // дальние заводы — в дымке
      factory(c, t, 60, 905 + gy + fd, .72, { flip: true, h: hk, t0: K.giants2, seed: 1, col: far, dk: farD, lt: farL });
      factory(c, t, 1860, 905 + gy + fd, .72, { h: hk, t0: K.giants2 + .3, seed: 2, col: far, dk: farD, lt: farL });
      factory(c, t, 360, 905 + gy + fd, .95, { h: hk, t0: K.giants2 + .15, seed: 3, drift: -1 });
      factory(c, t, 1560, 905 + gy + fd, .95, { flip: true, h: hk, t0: K.giants2 + .45, seed: 4, drift: -1 });
      c.fillStyle = C.am2; c.fillRect(-400, 905 + gy, WW + 800, 700);
      c.fillStyle = '#c9732a'; c.fillRect(-400, 905 + gy, WW + 800, 8);
    }
    const kb = eo(at(t, K.emp, K.emp + .7)), kgo = eio(at(t, K.goal - .3, K.goal + .4)) * 1100;
    if (kb > 0 && kgo < 1100) building(c, t, 960, 905 + (1 - kb) * 1000 + kgo, .86, K.emp2);
    // молекула никотина собирается из пузырьков, уплывает вверх и тает — краем кадра не режется
    const km = at(t, K.inv - .25, K.inv + .35), mo = eio(at(t, K.fifty - .75, K.fifty - .1));   // v16.2: молекула собралась, повисела и ушла — табло только на «пятьдесят»
    if (km > 0 && mo < 1) { c.save(); c.translate(960, 380 - mo * 220); c.rotate(mo * .4); c.globalAlpha = 1 - mo; molecule(c, 0, 0, 1.35 * (1 - mo * .3), km, C.n0, C.white); c.restore() }
    const kl = spr(at(t, K.rey, K.rey + .4)); if (kl > 0 && kgo < 1100) plate(c, 'R.J. REYNOLDS TOBACCO', 960, 868 + kgo, kl, { s: 30, bg: C.n0, c: C.white, ls: 5 });
    const kout = eio(at(t, K.goal - .3, K.goal + .35));
    if (kout < 1) {   // v16.2: пачки — на тёмных подложках, чтобы не сливались с небом и заводами
      const kc = spr(at(t, K.camel - .08, K.camel + .45)) * .92, kn = spr(at(t, K.winston - .08, K.winston + .45)) * .92, py = 680 + kout * 120;
      if (kc > 0) { circ(c, 560 - kout * 1100 + 16, py + 22, 262 * kc, 'rgba(20,25,53,.35)'); circ(c, 560 - kout * 1100, py + 6, 262 * kc, '#1b2046') }
      if (kn > 0) { circ(c, 1360 + kout * 1100 + 16, py + 22, 262 * kn, 'rgba(20,25,53,.35)'); circ(c, 1360 + kout * 1100, py + 6, 262 * kn, '#1b2046') }
      camelPack(c, 560 - kout * 1100, py, kc, lp(-.3, -.08, eo(at(t, K.camel - .08, K.camel + .5))) - kout * .35);
      winstonPack(c, 1360 + kout * 1100, py, kn, lp(.3, .08, eo(at(t, K.winston - .08, K.winston + .5))) + kout * .35);
    }
    if (t >= K.prep) memoAt(c, t, memoPose(t));
    c.restore();
    drumAt(c, t);
    const ki = eio(at(t, K.prob - .05, K.prob + .3)); if (ki > 0) circ(c, 960, 540, ki * 1150, XR.wine.bg);
  }

  // ================= голова в профиль с горлом в разрезе (горло, лаборатория, «мягкий пар», школьники) =================
  const HEADP = [-130, 480, -140, 300, -175, 150, -245, 20, -265, -110, -220, -240, -110, -315, 30, -320, 150, -265, 205, -170, 220, -95, 214, -60, 240, -10, 286, 52, 272, 72, 238, 80, 246, 112, 236, 126, 246, 142, 226, 170, 236, 208, 205, 245, 140, 262, 100, 285, 95, 360, 100, 480, 0, 480, -70, 480];
  const AIR = [232, 126, 175, 128, 90, 134, 10, 150, -48, 196, -56, 270, -48, 360, -44, 520];
  const AIRL = (() => { const L = [0]; for (let i = 2; i < AIR.length; i += 2) L.push(L[L.length - 1] + Math.hypot(AIR[i] - AIR[i - 2], AIR[i + 1] - AIR[i - 1])); return L })();
  function airPt(u) {
    const d = cl(u) * AIRL[AIRL.length - 1]; let i = 1; while (i < AIRL.length - 1 && AIRL[i] < d) i++;
    const k = (d - AIRL[i - 1]) / ((AIRL[i] - AIRL[i - 1]) || 1); return [lp(AIR[2 * i - 2], AIR[2 * i], k), lp(AIR[2 * i - 1], AIR[2 * i + 1], k)];
  }
  function spikes(c, x, y, r, k, col) {
    if (k <= 0) return; c.beginPath();
    for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, rr2 = i % 2 ? r * (1 + .55 * k) : r * .8; i ? c.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2) : c.moveTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2) }
    c.closePath(); fill(c, col);
  }
  // o: s, flip, calm — цвет горла, irr 0..1 — раздражение, scr — царапины, cap 0..1, blobs — [[u, r, spikes]], body — цвет головы
  function head(c, t, x, y, o = {}) {
    const s = o.s || 1, body = o.body || C.n1;
    c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
    spline(c, HEADP); fill(c, body);
    c.beginPath(); c.ellipse(-60, 14, 30, 50, .1, 0, TAU); fill(c, mixc(body, C.white, .14));
    c.beginPath(); c.ellipse(-60, 14, 14, 26, .1, 0, TAU); fill(c, mixc(body, C.n0, .5));
    c.beginPath(); c.ellipse(176, -46, 17, 10, -.1, 0, TAU); fill(c, C.white); circ(c, 184, -46, 7, C.n0);
    c.strokeStyle = mixc(body, C.n0, .6); c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(150, -82); c.quadraticCurveTo(180, -96, 206, -84); c.stroke();
    if (o.cut !== false && (o.cutA ?? 1) > 0) {
      c.save(); c.globalAlpha *= o.cutA ?? 1;
      const ac = mixc(o.calm || C.wh, C.red, o.irr || 0);
      c.lineCap = 'round'; c.lineJoin = 'round';
      spline(c, AIR, false); stroke(c, mixc(body, C.n0, .55), 62);
      spline(c, AIR, false); stroke(c, ac, 42);
      const sk = o.scr || 0;
      if (sk > 0) {
        c.save(); c.globalAlpha = sk; c.strokeStyle = C.white; c.lineWidth = 6;
        for (const u of [.42, .55, .68, .8, .9]) { const [px, py] = airPt(u), [qx, qy] = airPt(u + .02); const nx = -(qy - py), ny = qx - px, L = Math.hypot(nx, ny) || 1; c.beginPath(); c.moveTo(px - nx / L * 14, py - ny / L * 14); c.lineTo(px + nx / L * 6, py + ny / L * 6 - 6); c.lineTo(px - nx / L * 4, py - ny / L * 4 + 6); c.lineTo(px + nx / L * 14, py + ny / L * 14); c.stroke() }
        c.restore();
      }
      for (const [u, r, sp, col] of (o.blobs || [])) { const [px, py] = airPt(u); spikes(c, px, py, r, sp, C.red2); cloud(c, px, py, r / 46, 1, u * 50, col || C.grey) }
      c.restore();
    }
    if ((o.cap || 0) > 0) {
      const k = o.cap; c.save(); c.translate(0, -(1 - k) * 260); c.globalAlpha *= cl(k * 3);
      spline(c, [-238, -196, -214, -280, -110, -346, 40, -342, 160, -278, 196, -228, 60, -236, -100, -214]); fill(c, C.mint);
      c.save(); c.clip(); c.fillStyle = C.mint2; c.fillRect(60, -360, 200, 160); c.restore();
      poly(c, [-212, -206, -380, -186, -372, -160, -214, -176]); fill(c, C.mint2);
      circ(c, -30, -346, 14, C.mint2);
      c.restore();
    }
    c.restore();
  }
  // ================= снимок горла (вместо головы в профиль): горло, трахея, бронхи — без лица, ничего во рту =================
  const SCN = { w: 620, h: 860 };
  function scanPt(u) {   // точка по оси дыхательных путей: 0 — вход сверху, .62 — развилка, дальше — левый бронх
    if (u < .62) return [0, lp(-380, 190, u / .62)];
    const k = (u - .62) / .38; return [lp(0, -150, k) + Math.sin(k * 3) * 6, lp(190, 330, k)];
  }
  // красные «иголки» вокруг клуба едкого дыма
  function needles(c, x, y, r, k, t) {
    c.save(); c.strokeStyle = C.red; c.lineCap = 'round'; c.lineWidth = 9;
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .8, r0 = r * .85, r1 = r * (1.15 + .8 * k * (.7 + .3 * Math.sin(t * 9 + i))); c.beginPath(); c.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); c.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); c.stroke() }
    c.restore();
  }
  // o: calm — цвет стенок, irr 0..1 — раздражение, scr — царапины, blobs — [[u, r, иголки, цвет]], glow, flash, label
  function scan(c, t, x, y, s, o = {}) {
    if (s <= 0) return;
    const W = SCN.w, Hh = SCN.h, irr = o.irr || 0, wall = mixc(o.calm || C.sky2, C.red, irr);
    c.save(); c.translate(x, y); c.scale(s, s);
    rr(c, -W / 2 + 18, -Hh / 2 + 22, W, Hh, 40); fill(c, 'rgba(20,25,53,.3)');
    rr(c, -W / 2, -Hh / 2, W, Hh, 40); fill(c, '#0b1238');
    c.save(); rr(c, -W / 2, -Hh / 2, W, Hh, 40); c.clip();
    c.strokeStyle = '#17225a'; c.lineWidth = 2; c.beginPath(); for (let gx = -W / 2; gx <= W / 2; gx += 40) { c.moveTo(gx, -Hh / 2); c.lineTo(gx, Hh / 2) } for (let gy = -Hh / 2; gy <= Hh / 2; gy += 40) { c.moveTo(-W / 2, gy); c.lineTo(W / 2, gy) } c.stroke();
    const g = c.createRadialGradient(0, 0, 40, 0, 0, 460); g.addColorStop(0, mixc('#1b3a6e', '#5c1a2a', irr)); g.addColorStop(1, 'rgba(11,18,56,0)'); c.fillStyle = g; c.globalAlpha = .7 + .3 * Math.max(irr, o.glow || 0); c.fillRect(-W / 2, -Hh / 2, W, Hh); c.globalAlpha = 1;
    // v16.2: рентген грудной клетки снизу от шеи — шея, плечи, позвоночник, лёгкие, рёбра и ключицы полупрозрачные (главное — трахея); головы и лица нет
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-118, -450); c.lineTo(-112, -236); c.quadraticCurveTo(-112, -184, -210, -164); c.quadraticCurveTo(-306, -146, -340, -50); c.lineTo(-340, 460); c.lineTo(340, 460); c.lineTo(340, -50); c.quadraticCurveTo(306, -146, 210, -164); c.quadraticCurveTo(112, -184, 112, -236); c.lineTo(118, -450); c.closePath();
    c.fillStyle = 'rgba(159,192,255,.07)'; c.fill(); c.strokeStyle = 'rgba(207,224,255,.34)'; c.lineWidth = 5; c.stroke();
    c.fillStyle = 'rgba(207,224,255,.09)'; for (let yy = -430; yy < 440; yy += 38) { rr(c, -26, yy, 52, 28, 9); c.fill() }
    for (const sx of [-1, 1]) {
      c.beginPath(); c.moveTo(sx * 62, -64); c.bezierCurveTo(sx * 150, -112, sx * 272, -44, sx * 282, 160); c.bezierCurveTo(sx * 292, 330, sx * 252, 402, sx * 172, 404); c.bezierCurveTo(sx * 100, 408, sx * 66, 380, sx * 60, 300); c.closePath();
      c.fillStyle = 'rgba(159,192,255,.1)'; c.fill(); c.strokeStyle = 'rgba(207,224,255,.3)'; c.lineWidth = 5; c.stroke();
    }
    c.strokeStyle = 'rgba(225,235,255,.17)'; c.lineWidth = 11;
    for (let i = 0; i < 6; i++) { const yy = -36 + i * 66; for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * 30, yy); c.bezierCurveTo(sx * 170, yy - 46, sx * 290, yy - 10, sx * 298, yy + 72); c.stroke() } }
    c.strokeStyle = 'rgba(232,240,255,.3)'; c.lineWidth = 15;
    for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * 40, -150); c.bezierCurveTo(sx * 110, -172, sx * 172, -118, sx * 268, -152); c.stroke() }
    c.lineCap = 'round'; c.lineJoin = 'round';
    const sq = 1 - .14 * (o.spasm || 0);   // спазм: трахея сжимается
    const tube = (w0, col) => { const w = w0 * sq;
      c.strokeStyle = col;
      c.lineWidth = w * 1.25; c.beginPath(); c.moveTo(0, -Hh / 2 - 20); c.lineTo(0, -150); c.stroke();
      c.lineWidth = w; c.beginPath(); c.moveTo(0, -150); c.lineTo(0, 190); c.stroke();
      c.lineWidth = w * .72; for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(0, 185); c.quadraticCurveTo(sx * 40, 240, sx * 150, 330); c.stroke() }
    };
    tube(104, wall); tube(76, '#141d4a');
    c.save(); c.globalAlpha *= .55; c.strokeStyle = mixc('#cfe0ff', '#ff7f8e', irr); c.lineWidth = 6;   // кольца трахеи
    for (let yy = -110; yy <= 170; yy += 32) { c.beginPath(); c.moveTo(-36, yy); c.quadraticCurveTo(0, yy + 12, 36, yy); c.stroke() }
    c.restore();
    const sk = o.scr || 0;   // царапины от едкого дыма
    if (sk > 0) { c.save(); c.globalAlpha *= sk; c.strokeStyle = C.white; c.lineWidth = 5; for (const yy of [-330, -270, -210, -120, -40, 60]) for (const sx of [-1, 1]) { const ex = sx * 52; c.beginPath(); c.moveTo(ex - sx * 4, yy - 14); c.lineTo(ex + sx * 10, yy - 4); c.lineTo(ex - sx * 6, yy + 6); c.lineTo(ex + sx * 8, yy + 16); c.stroke() } c.restore() }
    for (const [u, r, sp, col] of (o.blobs || [])) { const [px, py] = scanPt(u); if (sp > 0) needles(c, px, py, r, sp, t); cloud(c, px, py, r / 46, 1, u * 50, col || C.grey) }
    const sk2 = o.streams || 0, sq2 = 1 - .14 * (o.spasm || 0);
    if (sk2 > 0) {   // v16.2: дым — серые струи вниз по трахее
      for (let j = 0; j < 3; j++) {
        const sx = j - 1, len = sk2 * (j === 1 ? .8 : 1), qx = sx || -1;
        c.save(); c.strokeStyle = j === 1 ? '#aaa39b' : C.grey; c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = (j === 1 ? 20 : 14) * sq2; c.globalAlpha *= .92; c.beginPath();
        for (let i = 0; i <= 64; i++) {
          const u = i / 64 * len; let px, py;
          if (u < .72) { py = lp(-470, 186, u / .72); px = sx * 13 * sq2 }
          else { const k = (u - .72) / .28; px = (1 - k) * (1 - k) * sx * 10 + 2 * (1 - k) * k * qx * 40 + k * k * qx * 150; py = (1 - k) * (1 - k) * 186 + 2 * (1 - k) * k * 240 + k * k * 330 }
          px += Math.sin(u * 26 - t * 7 + j * 2.1) * (u < .72 ? 12 : 6) * sq2;
          i ? c.lineTo(px, py) : c.moveTo(px, py);
        }
        c.stroke(); c.restore();
      }
    }
    const bk = o.burn || 0, reach = lp(-470, 186, Math.min(1, sk2 / .72));
    if (bk > 0) [[-1, -330], [1, -262], [-1, -188], [1, -104], [-1, -20], [1, 66], [-1, 150]].forEach(([sx, yy], i) => {   // ожоги: стенка краснеет и воспаляется там, где касается дым
      if (yy > reach) return; const x0 = sx * (yy < -150 ? 62 : 50) * sq2, a = bk * (.75 + .25 * Math.sin(t * 8 + i * 1.7)), sw = 1 + .25 * (o.spasm || 0);
      c.save(); c.globalAlpha *= a; c.beginPath(); c.ellipse(x0, yy, 22 * sw, 44, 0, 0, TAU); fill(c, C.red); c.beginPath(); c.ellipse(x0 - sx * 3, yy, 10 * sw, 22, 0, 0, TAU); fill(c, C.red3); c.restore();
    });
    const kf = o.flash || 0; if (kf > 0 && kf < 1) { c.save(); c.globalAlpha *= (1 - kf) * .8; c.beginPath(); c.ellipse(0, -140, 70 + 120 * kf, 40 + 60 * kf, 0, 0, TAU); stroke(c, C.red, 10); c.restore() }
    c.restore();
    rr(c, -W / 2, -Hh / 2, W, Hh, 40); stroke(c, '#2a3a8a', 6);
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 6; for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { c.beginPath(); c.moveTo(sx * (W / 2 - 30), sy * (Hh / 2 - 70)); c.lineTo(sx * (W / 2 - 30), sy * (Hh / 2 - 30)); c.lineTo(sx * (W / 2 - 70), sy * (Hh / 2 - 30)); c.stroke() }
    tx(c, o.label || 'СНИМОК · ГОРЛО', -W / 2 + 80, Hh / 2 - 52, { f: 'J', w: 700, s: 22, ls: 3, c: '#9fb4ff', al: 'left' });
    if (o.patient) { const pw = tw(c, o.patient, { f: 'J', w: 700, s: 30, ls: 3 }); rr(c, -W / 2 + 40, -Hh / 2 + 28, pw + 44, 54, 12); fill(c, 'rgba(11,18,56,.85)'); tx(c, o.patient, -W / 2 + 62, -Hh / 2 + 56, { f: 'J', w: 700, s: 30, ls: 3, c: C.white, al: 'left' }) }
    if ((t * 1.6) % 1 < .6) circ(c, W / 2 - 54, -Hh / 2 + 52, 10, C.red);
    c.restore();
  }
  // v16.2: рентген-кабинет за снимком — приглушённая сетка, негатоскоп (светящийся стенд), приборы по краям в расфокусе
  const XR = {
    wine: { bg: '#4a1626', grid: 'rgba(255,190,205,.05)', box: '#5e2033', boxIn: '#6e2a3e', glow: 'rgba(255,214,224,.2)', d1: '#2a0b15', d2: '#3a1220', d3: '#5a2232', hl: '#9a5566', warm: '#ffcf9a' },
    navy: { bg: '#101c52', grid: 'rgba(190,210,255,.05)', box: '#1b2a6a', boxIn: '#22357c', glow: 'rgba(214,230,255,.2)', d1: '#0a1238', d2: '#121c4c', d3: '#22306a', hl: '#5d74b8', warm: '#cfe6ff' },
  };
  function xrProps(g, p) {   // приборы (потом размываются): лампа, капельница, тележка, монитор, шкаф
    g.lineCap = 'round'; g.lineJoin = 'round';
    g.strokeStyle = p.d2; g.lineWidth = 30; g.beginPath(); g.moveTo(0, 40); g.lineTo(300, 110); g.lineTo(420, 250); g.stroke();
    g.fillStyle = p.d3; g.beginPath(); g.ellipse(430, 290, 120, 64, -.2, 0, TAU); g.fill(); g.fillStyle = p.warm; g.globalAlpha = .45; g.beginPath(); g.ellipse(436, 318, 92, 30, -.2, 0, TAU); g.fill(); g.globalAlpha = 1;
    g.fillStyle = p.d3; g.fillRect(250, 300, 18, 1000); g.fillRect(170, 300, 180, 14); g.fillStyle = p.hl; g.globalAlpha = .55; g.beginPath(); g.roundRect(200, 330, 80, 120, 18); g.fill(); g.globalAlpha = 1;
    g.strokeStyle = p.hl; g.lineWidth = 5; g.beginPath(); g.moveTo(240, 450); g.quadraticCurveTo(250, 700, 330, 820); g.stroke();
    g.fillStyle = p.d1; g.beginPath(); g.roundRect(60, 960, 400, 400, 16); g.fill(); g.fillStyle = p.d2; for (let i = 0; i < 3; i++) g.fillRect(84, 1000 + i * 76, 352, 54);
    for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? p.hl : p.d3; g.beginPath(); g.roundRect(100 + i * 80, 880, 46, 80, 10); g.fill() }
    g.strokeStyle = p.d2; g.lineWidth = 26; g.beginPath(); g.moveTo(2200, 220); g.lineTo(2010, 300); g.stroke();
    g.fillStyle = p.d1; g.beginPath(); g.roundRect(1800, 190, 330, 220, 18); g.fill(); g.fillStyle = '#0d2a24'; g.beginPath(); g.roundRect(1822, 212, 286, 176, 10); g.fill();
    { let ex = 1830; g.strokeStyle = '#43d9b9'; g.lineWidth = 7; g.beginPath(); g.moveTo(ex, 310); for (const [dx, dy] of [[60, 0], [16, -60], [18, 110], [16, -50], [70, 0], [16, -60], [18, 110], [16, -50], [40, 0]]) { ex += dx; g.lineTo(ex, 310 + dy) } g.stroke() }
    g.fillStyle = p.d1; g.beginPath(); g.roundRect(1860, 860, 420, 500, 16); g.fill(); g.fillStyle = p.d2; g.fillRect(1884, 890, 170, 300); g.fillRect(2070, 890, 170, 300);
    for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? p.hl : p.d3; g.fillRect(1900 + (i % 3) * 50, 930 + Math.floor(i / 3) * 120, 30, 70) }
  }
  function xrRoom(c, t, sx, sy, ss, pal) {
    const p = XR[pal]; c.fillStyle = p.bg; c.fillRect(-300, -300, 2600, 1700);
    c.save(); c.strokeStyle = p.grid; c.lineWidth = 2; c.beginPath(); for (let x = -256; x <= 2200; x += 64) { c.moveTo(x, -300); c.lineTo(x, 1400) } for (let y = -256; y <= 1400; y += 64) { c.moveTo(-300, y); c.lineTo(2200, y) } c.stroke(); c.restore();
    c.drawImage(blurLayer('xr-' + pal, 2400, 1500, 9, g => { g.translate(140, 110); xrProps(g, p) }), -140, -110);
    const bw = SCN.w * ss + 150, bh = SCN.h * ss + 130;   // негатоскоп: на нём висит снимок
    rr(c, sx - bw / 2 + 16, sy - bh / 2 + 22, bw, bh, 26); fill(c, 'rgba(0,0,0,.28)');
    rr(c, sx - bw / 2, sy - bh / 2, bw, bh, 26); fill(c, p.box); rr(c, sx - bw / 2 + 18, sy - bh / 2 + 18, bw - 36, bh - 36, 16); fill(c, p.boxIn);
    const gl = c.createRadialGradient(sx, sy, 60, sx, sy, Math.max(bw, bh) * .75); gl.addColorStop(0, p.glow); gl.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gl; c.fillRect(sx - bw, sy - bh, bw * 2, bh * 2);
    for (const dx of [-1, 1]) { rr(c, sx + dx * bw * .28 - 26, sy - bh / 2 + 4, 52, 34, 6); fill(c, p.d1) }
  }
  function check(c, x, y, r, k, col = C.mint) {
    if (k <= 0) return; const s = spr(k);
    c.save(); c.translate(x, y); c.scale(s, s); circ(c, 0, 0, r, col);
    c.strokeStyle = C.white; c.lineWidth = r * .22; c.lineCap = 'round'; c.lineJoin = 'round';
    drawOn(c, [-r * .45, 0, -r * .12, r * .32, r * .5, -r * .34], at(k, .2, .8)); c.restore();
  }

  // ================= лаборатория =================
  // колба Эрленмейера: (x, y) — середина дна; level 0..1, label
  function flask(c, x, y, s, r, o) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const P = [-120, 0, -120, -14, -26, -190, -26, -270, 26, -270, 26, -190, 120, -14, 120, 0];
    poly(c, P); fill(c, 'rgba(207,224,255,.22)');
    c.save(); poly(c, P); c.clip(); const lv = o.level ?? .55; c.fillStyle = o.liq; c.rotate(-r); c.fillRect(-400, -lv * 190, 800, 700); c.restore();   // поверхность жидкости — всегда горизонтально
    poly(c, P); c.lineJoin = 'round'; stroke(c, C.white, 7);
    rr(c, -36, -284, 72, 22, 8); fill(c, C.white);
    if (o.label) { c.save(); c.translate(0, -64); c.rotate(-r); plate(c, o.label, 0, 0, 1, { s: 24, ls: 2, bg: C.white, c: C.ink, sh: false }); c.restore() }
    c.restore();
  }
  // стакан: (x, y) — середина дна, ширина 230, высота 270
  function beaker(c, t, x, y, s, o) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s);
    const P = [-115, 0, -115, -250, -128, -270, 128, -270, 115, -250, 115, 0];
    poly(c, P); fill(c, 'rgba(207,224,255,.2)');
    const lv = o.level || 0;
    if (lv > 0) {
      c.save(); poly(c, P); c.clip();
      const top = -lv * 240; c.beginPath(); c.moveTo(-140, top); for (let x2 = -140; x2 <= 140; x2 += 8) c.lineTo(x2, top + Math.sin(x2 * .05 + t * 6) * 5 * (o.wave ?? 1)); c.lineTo(140, 10); c.lineTo(-140, 10); c.closePath(); fill(c, o.liq);
      const bk = o.bub || 0;
      if (bk > 0) { c.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 14; i++) { const ph = (t * (.7 + .5 * H1(i)) + H1(i * 2.2)) % 1; c.globalAlpha = bk; c.beginPath(); c.arc(-90 + 180 * H1(i * 5.5), lp(-8, top + 10, ph), 5 + 8 * H1(i * 3.3), 0, TAU); c.fill() } c.globalAlpha = 1 }
      if (o.swirl) { c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.ellipse(0, top + 60, 70, 18, 0, t * 5, t * 5 + 4.2); c.stroke() }
      c.restore();
    }
    poly(c, P); c.lineJoin = 'round'; stroke(c, C.white, 7);
    for (let i = 1; i <= 4; i++) { c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(-100, -i * 50, 26, 5) }
    c.restore();
  }
  // кристалл соли: грани в три тона
  function crystal(c, x, y, s, r, o = {}) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const O = [0, -160, 96, -70, 96, 60, 0, 160, -96, 60, -96, -70], M = [0, -40];
    if (o.sh !== false) { c.save(); c.translate(14, 16); poly(c, O); fill(c, 'rgba(10,16,48,.3)'); c.restore() }
    const F = [[0, 1, '#ffffff'], [1, 2, '#cfe0ff'], [2, 3, '#8fb4ff'], [3, 4, '#a8c6ff'], [4, 5, '#e6efff'], [5, 0, '#ffffff']];
    for (const [a, b, col] of F) { poly(c, [O[2 * a], O[2 * a + 1], O[2 * b], O[2 * b + 1], M[0], M[1]]); fill(c, col) }
    poly(c, O); c.lineJoin = 'round'; stroke(c, o.edge || '#4558a8', 6);
    c.strokeStyle = 'rgba(69,88,168,.55)'; c.lineWidth = 3; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(M[0], M[1]); c.lineTo(O[2 * i], O[2 * i + 1]); c.stroke() }
    rr(c, -50, -110, 16, 70, 8); fill(c, 'rgba(255,255,255,.8)');
    c.restore();
    if (o.shine) for (const [dx, dy, t0] of [[-110, -150, 0], [130, -60, .12], [90, 150, .24]]) spark(c, x + dx * s, y + dy * s, 26 * s * Math.sin(Math.PI * cl(o.shine - t0)), C.white);
  }
  // шкала-прибор: v 0..1
  function gauge(c, x, y, s, v, a) {
    if (a <= 0) return;
    c.save(); c.translate(x, y); c.scale(s * a, s * a);
    c.beginPath(); c.arc(0, 0, 170, Math.PI, TAU); c.lineTo(170, 26); c.lineTo(-170, 26); c.closePath(); fill(c, C.white);
    for (const [a0, a1, col] of [[0, .45, C.mint], [.45, .72, C.am], [.72, 1, C.red]]) { c.beginPath(); c.arc(0, 0, 140, Math.PI + a0 * Math.PI, Math.PI + a1 * Math.PI); c.lineWidth = 34; c.strokeStyle = col; c.stroke() }
    const an = Math.PI + v * Math.PI; c.save(); c.rotate(an); rr(c, -10, -8, 130, 16, 8); fill(c, C.n0); c.restore(); circ(c, 0, 0, 20, C.n0);
    c.restore();
  }
  // чертёж-набросок: «проект» — трубка с кристаллом в окошке
  function sketchSheet(c, t, x, y, s, r, o) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.fillStyle = 'rgba(10,16,48,.3)'; c.fillRect(-380 + 16, -240 + 18, 760, 480);
    c.fillStyle = '#eef4ff'; c.fillRect(-380, -240, 760, 480);
    c.strokeStyle = '#c9dbf5'; c.lineWidth = 2; c.beginPath(); for (let gx = -380; gx <= 380; gx += 40) { c.moveTo(gx, -240); c.lineTo(gx, 240) } for (let gy = -240; gy <= 240; gy += 40) { c.moveTo(-380, gy); c.lineTo(380, gy) } c.stroke();
    c.strokeStyle = C.bp; c.lineWidth = 6; c.lineJoin = 'round'; c.lineCap = 'round';
    const k = o.draw ?? 1;
    drawOn(c, rrPts(-300, -40, 600, 80, 30), k, true);
    drawOn(c, [-120, -40, -120, 40], at(k, .4, .6)); drawOn(c, [40, -40, 40, 40], at(k, .5, .7));
    drawOn(c, [-300, 90, 300, 90], at(k, .6, .9)); drawOn(c, [-300, 78, -300, 102], at(k, .6, .7)); drawOn(c, [300, 78, 300, 102], at(k, .8, .9));
    if (k > .55) crystal(c, -40, 0, .2 * spr(at(k, .55, 1)), 0, { sh: false });
    tx(c, 'ПРОЕКТ', -360, -200, { f: 'J', w: 700, s: 30, ls: 3, c: C.bp, al: 'left', a: at(k, .2, .5) });
    tx(c, 'R.J.R.', 360, 200, { f: 'J', w: 700, s: 26, ls: 2, c: C.bp, al: 'right', a: at(k, .3, .6) });
    const kx = o.x || 0;
    if (kx > 0) { slash(c, -230, -170, 230, 170, eio(at(kx, 0, .5)), 46, C.red); slash(c, 230, -170, -230, 170, eio(at(kx, .45, 1)), 46, C.red) }
    if (o.st) stampBox(c, 'СЕКРЕТНО', 150, -130, o.st, C.red, -.18, 52);
    c.restore();
  }

  // карточка проекта 1979: кристалл соли, подпись, год; штамп «ОТЛОЖЕН» (отменили не сигареты, а новый продукт)
  function projectCard(c, t, x, y, s, r, o = {}) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    c.fillStyle = 'rgba(10,16,48,.3)'; c.fillRect(-380 + 16, -260 + 18, 760, 520);
    c.fillStyle = '#eef4ff'; c.fillRect(-380, -260, 760, 520);
    c.strokeStyle = '#c9dbf5'; c.lineWidth = 2; c.beginPath(); for (let gx = -380; gx <= 380; gx += 40) { c.moveTo(gx, -260); c.lineTo(gx, 260) } for (let gy = -260; gy <= 260; gy += 40) { c.moveTo(-380, gy); c.lineTo(380, gy) } c.stroke();
    if (o.min) {   // v16.2 (Андрей): крупно и минималистично — пунктирный вейп с «?» и штамп «ОТЛОЖЕН · 1979», без мелкого текста
      c.save(); c.translate(0, -12); c.setLineDash([24, 15]); c.lineDashOffset = -t * 40; c.strokeStyle = C.bp; c.lineWidth = 9; c.lineJoin = 'round'; c.globalAlpha *= o.kv ?? 1;
      rr(c, -92, -168, 184, 352, 52); c.stroke(); rr(c, -48, -232, 96, 58, 20); c.stroke(); c.restore();
      const kq = o.kq ?? 1; if (kq > 0) { c.save(); c.translate(0, -10); c.scale(kq, kq); tx(c, '?', 0, 0, { s: 220, c: C.red }); c.restore() }
      if (o.st) stampBox(c, 'ОТЛОЖЕН · 1979', 0, 178, o.st, C.red, -.1, 50, 'rgba(255,255,255,.93)');
      c.restore(); return;
    }
    c.fillStyle = C.bp; c.fillRect(-380, -260, 760, 70);
    tx(c, 'ПРОЕКТ · R.J. REYNOLDS', -350, -225, { f: 'J', w: 700, s: 28, ls: 2, c: C.white, al: 'left' });
    tx(c, '1979', 350, -225, { f: 'J', w: 700, s: 28, ls: 2, c: '#9fc0ff', al: 'right' });
    crystal(c, -210, 40, .78, -.05, { sh: false });
    tx(c, 'НИКОТИНОВАЯ', 120, -16, { s: 46, ls: 2, c: C.ink }); tx(c, 'СОЛЬ', 120, 44, { s: 46, ls: 2, c: C.ink });
    c.fillStyle = C.bp; c.fillRect(-60, 100, 360, 6); c.fillRect(-60, 130, 260, 6); c.fillRect(-60, 160, 300, 6);
    if (o.st) stampBox(c, 'ОТЛОЖЕН', 120, 132, o.st, C.red, -.16, 62, 'rgba(255,255,255,.9)');
    c.restore();
  }
  // ================= архив и суд (как в пробе, свои цвета; в местных координатах кадра 1920×1080) =================
  const A = { bg: C.blue, disc: C.blue2, boxes: [['#1d4a94', '#123172', '#2a63b0', '#3a7cc9'], ['#24589f', '#173a80', '#3270bd', '#2a63b0']], main: '#1d4a94', mainD: '#123172',
    lidT: '#3a7cc9', lidF: '#2a63b0', lidD: '#1d4a94', lidIn: '#2a63b0', lidIn2: '#3a7cc9', open: C.glass, label: '#f2ede6', ink: '#0f2460', ink2: '#0b5088', sheet: '#f2ede6', sheetO: C.blue, sheetL: '#3a7cc9' };
  const BX = 960, BY = 900, BW = 400, BH = 290;
  function boxShape(c, x, y, w, h, o) {
    c.fillStyle = o.front; c.fillRect(x - w / 2, y - h, w, h);
    c.fillStyle = o.side; c.fillRect(x + w / 2 - w * .15, y - h, w * .15, h);
    if (o.lid) {
      const lh = Math.max(34, h * .2), d = 26;
      poly(c, [x - w / 2 - 8, y - h - 10, x + w / 2 + 8, y - h - 10, x + w / 2 + 8 - d, y - h - 10 - d, x - w / 2 - 8 + d, y - h - 10 - d]); fill(c, o.top);
      c.fillStyle = o.lid; c.fillRect(x - w / 2 - 8, y - h - 10, w + 16, lh);
    }
    if (o.handle !== false) { rr(c, x - w * .14, y - h + h * .34, w * .28, Math.max(12, h * .07), 8); fill(c, A.open) }
    if (o.label) { const lw = w * .36, lh = h * .24, ly = y - h * .45; c.fillStyle = A.label; c.fillRect(x - lw / 2, ly, lw, lh); c.fillStyle = A.sheetL; c.fillRect(x - lw / 2 + 10, ly + lh * .28, lw - 20, 5); c.fillRect(x - lw / 2 + 10, ly + lh * .6, (lw - 20) * .6, 5) }
  }
  const SIDE = [
    { x: 520, y: 900, w: 300, h: 220, d: 0, ty: 0 }, { x: 250, y: 900, w: 230, h: 160, d: .1, ty: 1 }, { x: 1660, y: 900, w: 320, h: 210, d: .2, ty: 0 },
    { x: 538, y: 660, w: 260, h: 180, d: .32, ty: 1 }, { x: 1640, y: 670, w: 240, h: 150, d: .44, ty: 1 },
  ];
  function sideBox(c, t, b, t0) {
    const k = at(t, t0 + b.d, t0 + b.d + .3); if (k <= 0) return;
    const u = at(t, t0 + b.d + .3, t0 + b.d + .5), sq = Math.sin(Math.PI * u) * (1 - u * .3);
    c.save(); c.translate(b.x, b.y - 640 * (1 - k * k)); c.scale(1 + .07 * sq, 1 - .09 * sq);
    const [front, side, lid, top] = A.boxes[b.ty]; boxShape(c, 0, 0, b.w, b.h, { front, side, lid, top, label: 1 });
    c.restore();
  }
  function lidClosed(c) {
    poly(c, [BX - 210, 598, BX + 210, 598, BX + 182, 568, BX - 182, 568]); fill(c, A.lidT);
    c.fillStyle = A.lidF; c.fillRect(BX - 210, 598, 420, 60);
    c.fillStyle = A.lidD; c.fillRect(BX + 210 - 63, 598, 63, 60);
  }
  // молоток тёмного дерева с золотыми кольцами; шарнир (px, py), голова — слева, th > 0 — поднят
  function gavel(c, px, py, th) {
    c.save(); c.translate(px, py); c.rotate(th);
    rr(c, -300, -15, 300, 30, 15); fill(c, C.wood2);
    rr(c, -300, -15, 300, 11, [15, 15, 0, 0]); fill(c, C.wood3);
    c.fillStyle = C.gold; c.fillRect(-26, -17, 14, 34); circ(c, 0, 0, 22, C.wood);
    rr(c, -356, -86, 72, 172, 20); fill(c, C.wood);
    c.fillStyle = C.gold; c.fillRect(-356, -62, 72, 16); c.fillRect(-356, 46, 72, 16);
    c.fillStyle = C.wood3; c.fillRect(-346, -80, 10, 160);
    c.restore();
  }
  const SB = { x: 1450, y: 850 };   // круглая подставка
  function soundBlock(c) {
    c.beginPath(); c.ellipse(SB.x, SB.y + 40, 120, 30, 0, 0, TAU); fill(c, C.wood);
    c.fillStyle = C.wood; c.fillRect(SB.x - 120, SB.y, 240, 40);
    c.fillStyle = C.gold; c.fillRect(SB.x - 120, SB.y + 14, 240, 10);
    c.beginPath(); c.ellipse(SB.x, SB.y, 120, 30, 0, 0, TAU); fill(c, C.wood3);
    c.beginPath(); c.ellipse(SB.x, SB.y, 84, 20, 0, 0, TAU); stroke(c, C.wood2, 4);
  }
  function scales(c, x, y, s, col, a) {
    if (a <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= a; c.fillStyle = col; c.strokeStyle = col; c.lineCap = 'round';
    c.fillRect(-12, -300, 24, 520); poly(c, [-150, 250, 150, 250, 90, 200, -90, 200]); fill(c, col); c.fillRect(-60, 220, 120, 30);
    circ(c, 0, -316, 30, col); rr(c, -300, -296, 600, 22, 11); fill(c, col);
    for (const sx of [-1, 1]) {
      c.lineWidth = 6; c.beginPath(); c.moveTo(sx * 290, -285); c.lineTo(sx * 290 - 90, -20); c.moveTo(sx * 290, -285); c.lineTo(sx * 290 + 90, -20); c.stroke();
      c.beginPath(); c.moveTo(sx * 290 - 120, -20); c.quadraticCurveTo(sx * 290, 90, sx * 290 + 120, -20); c.closePath(); fill(c, col);
    }
    c.restore();
  }
  function sheetShape(c, x, y, r, s, o = {}) {
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    const sh = o.sh ?? 1; if (sh > 0) { c.fillStyle = `rgba(4,10,42,${.25 * sh})`; c.fillRect(-52, -68, 120, 156) }
    c.fillStyle = o.col || A.sheet; c.fillRect(-60, -78, 120, 156);
    if (o.red) { c.fillStyle = C.red; c.fillRect(-44, -62, 88, 12) }
    c.fillStyle = o.lines || A.sheetL; for (let i = 0; i < 4; i++) c.fillRect(-44, -30 + i * 22, i === 3 ? 50 : 88, 6);
    c.strokeStyle = A.sheetO; c.lineWidth = 3; c.strokeRect(-60, -78, 120, 156);
    c.restore();
  }
  const PAPERS = [...Array(26)].map((_, i) => {
    const a = lp(-2.85, -.3, H1(i * 3.3 + 1)), d = 380 + 520 * H1(i * 5.1 + 2), g = 300 + 120 * H1(i * 2.2), x0 = BX + (H1(i * 1.9) - .5) * 240;
    let dx = Math.cos(a) * d, dy = Math.sin(a) * d, gg = g; const ex = x0 + dx, ey = 585 + dy + g;
    if (ex > 300 && ex < 1620 && ey < 470) dx = (ex < 960 ? 300 - 150 * H1(i * 9.1) : 1620 + 150 * H1(i * 9.1)) - x0;
    else if (ex > 340 && ex < 1580) { dy = Math.max(dy, -70); gg = 90 + 60 * H1(i * 3.7) }
    return { d0: .02 + i * .008, dur: .8 + .25 * H1(i * 7.3), x0, y0: 585, dx, dy, g: gg, r0: (H1(i * 4.4) - .5) * .6, sp: (H1(i * 6.6) - .5) * 5, s: .85 + .4 * H1(i * 8.8), red: i % 5 === 2, seed: i };
  });
  function paperPose(p, t, t0) {
    const k = at(t, t0 + p.d0, t0 + p.d0 + p.dur), e = eo(k), w = at(t, t0 + p.d0 + p.dur, t0 + p.d0 + p.dur + .5);
    return { x: p.x0 + p.dx * e, y: p.y0 + p.dy * e + p.g * k * k + Math.sin(t * 1.7 + p.seed) * 3 * w, r: p.r0 + p.sp * e + Math.sin(t * 1.3 + p.seed) * .02 * w, s: p.s * (k < .15 ? lp(.4, 1, k / .15) : 1) };
  }
  // окно браузера 900×506 (дальше то же окно — карточка на карте): адрес, шапка архива, строки документов
  function browser(c, t, x, y, s, o = {}) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s);
    if (o.sh !== false) { rr(c, -450 + 16, -253 + 20, 900, 506, 22); fill(c, 'rgba(4,10,42,.35)') }
    rr(c, -450, -253, 900, 506, 22); fill(c, C.white);
    c.save(); rr(c, -450, -253, 900, 506, 22); c.clip();
    c.fillStyle = '#e9edf5'; c.fillRect(-450, -253, 900, 64);
    for (const [i, col] of [[0, C.red], [1, C.am], [2, C.mint]]) circ(c, -414 + i * 30, -221, 10, col);
    rr(c, -320, -240, 620, 38, 19); fill(c, C.white);
    tx(c, 'industrydocuments.ucsf.edu', -300, -221, { f: 'J', w: 500, s: 22, c: C.n2, al: 'left' });
    c.fillStyle = C.blue; c.fillRect(-450, -189, 900, 96);
    tx(c, 'АРХИВ ДОКУМЕНТОВ', -410, -156, { s: 32, ls: 3, c: C.white, al: 'left' });
    tx(c, 'ТАБАЧНЫХ КОМПАНИЙ · UCSF', -410, -118, { s: 22, ls: 3, c: '#9fc0ff', al: 'left' });
    const rk = o.rows ?? 1;
    for (let i = 0; i < 6; i++) {
      const k = eo(at(rk, i * .12, i * .12 + .4)); if (k <= 0) continue; const ry = -60 + i * 52;
      c.globalAlpha = k; c.fillStyle = '#eef2f9'; c.fillRect(-420, ry, 840 * k, 40);
      c.fillStyle = i === 2 ? C.red : '#3a7cc9'; c.fillRect(-404, ry + 10, 20, 20);
      rr(c, -370, ry + 13, (300 + 160 * H1(i * 3.1)) * k, 13, 6.5); fill(c, '#b8c4dc'); c.globalAlpha = 1;
    }
    if (o.count) tx(c, o.count, 410, -156, { s: 30, c: C.white, al: 'right' });
    c.restore(); c.restore();
  }

  // ================= 3. горло → лаборатория → проект → архив → суд (один мир, камера едет) =================
  const LAB = 2960, LAB2 = 3520, ARCH = { x: 3520, y: 1740 }, AOFF = [ARCH.x - 960, ARCH.y - 540];
  const SLANT = y => 1960 + (540 - y) * .18;
  const HP = { x: 780, y: 510, s: 1.0 }, LH = { x: 4010, y: 560, s: .78 };
  const hpW = (lx, ly, P = HP, fl = 1) => [P.x + lx * P.s * fl, P.y + ly * P.s];
  const CRT = 2400;   // зал суда — справа от архива (v16.2: дальше — край зала не виден из архива)
  function cam3(t) {
    let x = 960, y = 540, s = lp(1, 1.05, eio(at(t, K.mapI, K.chemPan)));
    const kp = eio(at(t, K.chemPan, K.chemPan + .65)); x = lp(x, LAB, kp); s = lp(s, 1, kp);
    x = lp(x, LAB2, eio(at(t, K.softPan, K.softPan + .7)));
    y = lp(y, ARCH.y, eio(at(t, K.tilt, K.tilt + .6)));
    s *= lp(1, 1.035, eio(at(t, K.arch, K.pub)));
    // «суд»: камера уезжает в зал суда; на «тайны» — рывком назад к архиву
    x = lp(x, ARCH.x + CRT, eio(at(t, K.court - .25, K.court + .25)));
    x = lp(x, ARCH.x, eio(at(t, K.secrets - .06, K.secrets + .2)));
    const sh = (t2, a) => { const u = at(t, t2, t2 + .35); return u > 0 && u < 1 ? Math.sin(u * 40) * a * (1 - u) : 0 };
    y += sh(K.tob, 10) + sh(K.secrets - .08, 14); x += sh(K.tear + .05, 9);
    const kz = at(t, K.bzoom, K.mapT);
    if (kz > 0) { const Z = zoomCam(kz, ARCH.x, ARCH.y + 60, s, 1920 / 900, x, y); return Z }
    return { s, x, y };
  }
  function pourStream(c, x1, y1, x2, y2, k, col) { if (k <= 0) return; c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = 18 * Math.min(1, k * 4); c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(x1 + (x2 - x1) * .2, y1 + 40, x2, lp(y1, y2, Math.min(1, k * 3))); c.stroke(); c.restore() }
  function flaskPose(t, t0, side) {   // side −1 — слева (никотин), +1 — справа (кислота)
    const kin = spr(at(t, t0 - .12, t0 + .38)), kt = eio(at(t, t0 + .12, t0 + .45)), kout = ei(at(t, t0 + 1.0, t0 + 1.45));
    const x = LAB + side * (lp(900, 330, kin) + kout * 700), y = lp(1300, 262, kin) - kout * 200;
    return { x, y, r: -side * 2.0 * kt * (1 - kout * .6), on: kin > 0 && kout < 1, pour: at(t, t0 + .4, t0 + .9) - at(t, t0 + .95, t0 + 1.05) };
  }
  // стена лаборатории: плитка, плакат-таблица
  function labWall(c, t) {
    c.save(); c.globalAlpha = .22; c.strokeStyle = C.n3; c.lineWidth = 2; c.beginPath();
    for (let x = 2040; x <= 4840; x += 80) { c.moveTo(x, -300); c.lineTo(x, 790) } for (let y = -300; y <= 790; y += 80) { c.moveTo(2040, y); c.lineTo(4840, y) } c.stroke(); c.restore();
    c.save(); c.translate(2380, 338); c.globalAlpha = .42; rr(c, -150, -120, 300, 240, 10); fill(c, '#c9d3ea');   // v16.2: выше и тусклее — микроскоп не сливается
    for (let i = 0; i < 6; i++) for (let j = 0; j < 9; j++) { if ((i === 0 && j > 0 && j < 8) || (i > 0 && i < 3 && j > 1 && j < 7)) continue; c.fillStyle = ['#ffb3c0', '#9fc0ff', '#ffe3ae', '#a7ecd9'][(i * 3 + j) % 4]; c.fillRect(-138 + j * 30, -108 + i * 36, 26, 30) }
    c.restore();
  }
  // приборы на столе лаборатории: микроскоп и штатив с пробирками (пузырьки бегут)
  function labProps(c, t) {
    c.save(); c.translate(LAB - 700, 790);
    rr(c, -90, -26, 180, 26, 8); fill(c, C.n3); rr(c, -60, -60, 30, 40, 6); fill(c, C.n3);
    c.save(); c.translate(-30, -60); c.rotate(-.35); rr(c, -16, -170, 32, 170, 12); fill(c, C.n3); c.restore();
    rr(c, -40, -130, 120, 16, 6); fill(c, C.wh);
    c.save(); c.translate(36, -250); c.rotate(.42); rr(c, -24, -40, 48, 150, 12); fill(c, C.wh); rr(c, -30, -64, 60, 34, 10); fill(c, C.n2); rr(c, -14, 104, 28, 30, 6); fill(c, C.n2); c.restore();
    c.restore();
    c.save(); c.translate(LAB - 420, 790);
    const cols = [C.mint, C.am, C.mk, C.sky, C.am3];
    for (let i = 0; i < 5; i++) {
      const x = -120 + i * 60; rr(c, x - 16, -190, 32, 170, [4, 4, 16, 16]); fill(c, 'rgba(207,224,255,.25)');
      const lv = 60 + 40 * H1(i * 3.7); rr(c, x - 12, -24 - lv, 24, lv, [2, 2, 12, 12]); fill(c, cols[i]);
      for (let j = 0; j < 2; j++) { const ph = (t * (.5 + .3 * H1(i + j * 5)) + H1(i * 7 + j)) % 1; circ(c, x - 4 + 8 * j, lp(-30, -20 - lv, ph), 3.5, 'rgba(255,255,255,.7)') }
      rr(c, x - 16, -190, 32, 170, [4, 4, 16, 16]); stroke(c, C.wh, 4);
    }
    rr(c, -160, -120, 320, 18, 6); fill(c, C.wood3); rr(c, -160, -18, 320, 18, 6); fill(c, C.wood3); c.fillStyle = C.wood2; c.fillRect(-160, -120, 14, 120); c.fillRect(146, -120, 14, 120);
    c.restore();
  }
  function shot3(c, t) {
    const Q = cam3(t);
    c.fillStyle = XR.wine.bg; c.fillRect(-200, -200, WW + 400, HH + 400);
    c.save(); cam(c, Q.s, Q.x, Q.y);
    if (t < K.chemPan + .8) xrRoom(c, t, 700, 600, .86, 'wine');
    c.beginPath(); c.moveTo(SLANT(-3000), -3000); c.lineTo(9000, -3000); c.lineTo(9000, 1140); c.lineTo(SLANT(1140), 1140); c.closePath(); fill(c, C.n1);
    c.fillStyle = A.bg; c.fillRect(SLANT(1140) - 200, 1140, 9000, 3000);
    // ---- горло: снимок, сигарета сбоку, дым идёт во вход горла ----
    if (t < K.chemPan + .8) {
      for (let i = 0; i < 6; i++) { const ph = (t * .06 + H1(i * 2.7)) % 1; cloud(c, -300 + ph * 2400, 120 + 160 * i + 30 * Math.sin(t + i), 1.6 + .8 * H1(i), .22, i * 11, C.white) }
      const ent = (1 - eo(at(t, K.mapI - .05, K.mapI + .5))) * 900, cough = (at(t, K.tear, K.tear + .08) - at(t, K.tear + .5, K.tear + .7)) * Math.sin(t * 55) * 10;
      const SX = 700 + cough, SY = 600 + ent, SS = .86;
      const blobs = [];
      for (let i = 0; i < 6; i++) { const t0 = K.smoke - .15 + i * .13, u = eio(at(t, t0, t0 + 1.3)) * (.12 + .085 * i); if (t >= t0) blobs.push([u + Math.sin(t * 2 + i) * .012, 32 + 8 * H1(i), eo(at(t, K.acrid, K.acrid + .3)), C.grey]) }
      const irr = eo(at(t, K.acrid + .25, K.tear)) * .45 + .55 * eo(at(t, K.tear, K.tear + .25));
      // v16.2: дым — струи, стенки краснеют и воспаляются, на «дерёт» трахея сжимается и вздрагивает (спазм, кашель)
      const spasm = pulse(t, K.tear + .08) * .9 + pulse(t, K.throat + .1) * .6;
      scan(c, t, SX + Math.sin(t * 47) * 6 * spasm, SY, SS, { calm: C.sky2, irr: irr * (.82 + .18 * Math.sin(t * 9)), streams: eio(at(t, K.smoke - .2, K.smoke + 1.6)), burn: eo(at(t, K.acrid - .1, K.tear)), spasm,
        flash: at(t, K.tear, K.tear + .5), patient: 'ПАЦИЕНТ · 16 ЛЕТ' });
      const ck = eo(at(t, K.usual - .1, K.usual + .35));
      if (ck > 0) {
        const tipx = SX + 250 + (1 - ck) * 900, tipy = SY - SCN.h / 2 * SS - 70, [qx, qy] = rot(150, 0, Math.PI - .32);
        cig(c, tipx - qx, tipy - qy, 300, 40, Math.PI - .32, { lit: 1, glow: pulse(t, K.smoke - .2) });
        if (t > K.usual) {
          // v16.2: струя выходит из самого огонька — у кончика тонкая, к горлу шире
          c.save(); c.globalAlpha = .8 * at(t, K.usual, K.usual + .4); c.strokeStyle = C.grey; c.lineCap = 'round';
          const SP = []; for (let i = 0; i <= 24; i++) { const u = i / 24; SP.push([lp(tipx - 8, SX, u) + Math.sin(u * 7 + t * 3) * 14 * u * (1 - u) * 4, lp(tipy, SY - SCN.h / 2 * SS + 10, u) - Math.sin(Math.PI * u) * 60]) }
          for (let i = 1; i < SP.length; i++) { c.lineWidth = lp(7, 30, i / SP.length); c.beginPath(); c.moveTo(SP[i - 1][0], SP[i - 1][1]); c.lineTo(SP[i][0], SP[i][1]); c.stroke() }
          c.restore();
          for (let m = 0; m < 3; m++) { const ph = ((t - K.usual) / 2 + m / 3) % 1; cloud(c, tipx - 10 - 30 * eo(ph), tipy - 14 - 160 * eo(ph), lp(.12, .55, eo(ph)) * (1 - ss(.7, 1, ph)), .8, m * 3, C.grey) }
        }
      }
      plate(c, 'ЕДКИЙ ДЫМ', 1440, 430, spr(at(t, K.acrid - .05, K.acrid + .35)), { s: 44, bg: C.white, c: C.ink, r: .03 });
      plate(c, 'ДЕРЁТ ГОРЛО', 1470, 620, spr(at(t, K.throat - .05, K.throat + .35)), { s: 56, bg: C.red, c: C.white, r: -.04 });
      plate(c, 'ПОДРОСТКАМ', 1440, 800, spr(at(t, K.teens - .05, K.teens + .35)), { s: 44, bg: C.n0, c: C.white, r: .03 });
    }
    // ---- лаборатория ----
    if (t > K.chemPan - .3 && t < K.tilt + .8) {
      labWall(c, t);
      c.fillStyle = C.n2; c.fillRect(2120, 196, 2600, 14);
      for (let i = 0; i < 16; i++) { const bx = 2180 + i * 150 + 40 * H1(i), bh = 50 + 50 * H1(i * 2.3); if (Math.abs(bx - LAB) < 140) continue; rr(c, bx - 20, 196 - bh, 40, bh, [10, 10, 2, 2]); fill(c, C.n2); c.fillStyle = C.n2; c.fillRect(bx - 8, 196 - bh - 18, 16, 20) }
      c.fillStyle = '#283573'; c.fillRect(2040, 812, 2800, 340); c.fillStyle = C.wh; c.fillRect(2040, 790, 2800, 24);
      for (let i = 0; i < 9; i++) { c.fillStyle = '#222d63'; c.fillRect(2080 + i * 300, 850, 270, 250); rr(c, 2080 + i * 300 + 120, 960, 30, 10, 5); fill(c, C.n2) }
      labProps(c, t);
      const kb = spr(at(t, K.mixw - .05, K.mixw + .35)), lvN = .24 * eio(at(t, K.nic + .4, K.nic + .95)), lvA = .24 * eio(at(t, K.acid + .4, K.acid + .95));
      const sk = eio(at(t, K.salt - .25, K.salt + .2));
      beaker(c, t, LAB, 790 + (1 - kb) * 600, Math.max(kb, .001) * 1.35, { level: (lvN + lvA) * (1 - sk * .6), liq: mixc(C.am, C.yel, at(t, K.acid + .5, K.got + .3)), bub: at(t, K.got - .1, K.got + .3) - at(t, K.salt + .3, K.salt + .7), swirl: t > K.got && t < K.salt + .3 });
      for (const [t0, side, col, lab] of [[K.nic, -1, C.am, 'НИКОТИН'], [K.acid, 1, C.mint, 'КИСЛОТА']]) {
        const F = flaskPose(t, t0, side); if (!F.on) continue;
        const [tx2, ty2] = rot(0, -284 * 1.1, F.r);
        pourStream(c, F.x + tx2, F.y + ty2, LAB + side * 30, 690, F.pour, col);
        flask(c, F.x, F.y, 1.1, F.r, { liq: col, level: lp(.62, .3, at(t, t0 + .4, t0 + 1)), label: lab });
      }
      // кристалл соли поднимается, становится мягким облаком и уходит во вход горла на снимке
      const kc = spr(at(t, K.salt - .15, K.salt + .45)), soft = eio(at(t, K.softPan + .25, K.softPan + .9));
      if (kc > 0 && soft < 1) crystal(c, LAB, lp(640, 300, kc) + Math.sin(t * 2) * 6, lp(.2, 1, kc) * (1 - soft), Math.sin(t * 1.4) * .05, { shine: at(t, K.salt, K.salt + .9) });
      plate(c, 'НИКОТИНОВАЯ СОЛЬ', LAB, 106, spr(at(t, K.salt + .1, K.salt + .5)) * (1 - eio(at(t, K.softPan, K.softPan + .3))), { s: 40, bg: C.white, c: C.ink });
      const kh = eo(at(t, K.softPan - .1, K.softPan + .6)), SSX = LH.x + (1 - kh) * 900, SSY = LH.y - 150, SSS = .7;
      if (kh > 0) {
        const blobs = []; for (let i = 0; i < 4; i++) { const t0 = K.soft - .15 + i * .14, u = eio(at(t, t0, t0 + 1.2)) * (.7 + .05 * i); if (t >= t0) blobs.push([u, 28, 0, C.white]) }
        scan(c, t, SSX, SSY, SSS, { calm: C.mint, blobs, glow: at(t, K.soft, K.soft + .6) });
        for (const sx of [-1, 1]) { circ(c, SSX + sx * 168, SSY - SCN.h / 2 * SSS + 24, 13, C.red); circ(c, SSX + sx * 168 - 4, SSY - SCN.h / 2 * SSS + 20, 4, C.red3) }   // висит на стене
      }
      if (soft > 0) { const k2 = eio(at(t, K.softPan + .55, K.soft + .05)); cloud(c, lp(LAB, SSX, k2), lp(300, SSY - SCN.h / 2 * SSS + 20, k2), lp(1.6, .5, k2) * soft * (1 - at(t, K.soft, K.soft + .15)), 1, 7, C.white) }
      check(c, LH.x + 290, LH.y + 20, 62, at(t, K.soft, K.soft + .5));
      plate(c, 'МЯГКИЙ ПАР · БЕЗ КАШЛЯ', 3540, 880, spr(at(t, K.soft + .05, K.soft + .45)), { s: 40, bg: C.mint2, c: C.white, r: -.03 });
      gauge(c, 3330, 330, .82, eo(at(t, K.dose, K.dose2 + .15)) * (1 + .03 * Math.sin(t * 30) * at(t, K.dose2, K.dose2 + .1)), spr(at(t, K.dose - .1, K.dose + .3)));
      plate(c, 'ДОЗА НИКОТИНА', 3330, 400, spr(at(t, K.dose, K.dose + .35)), { s: 28, bg: C.white, c: C.ink });
      // проект: фон очищается, карточка «НИКОТИНОВАЯ СОЛЬ · 1979» → штамп «ОТЛОЖЕН» → уменьшается и падает в архив
      if (t > K.vop - .2 && t < K.arch + .02) {
        const kclr = eo(at(t, K.vop - .2, K.vop + .25)) * (1 - eo(at(t, K.hid, K.arch)));
        if (kclr > 0) {   // v16.2: под карточкой — не плоская заливка: тёмный фон, сетка, мягкий свет за карточкой
          c.save(); c.globalAlpha = kclr; c.fillStyle = '#18204c'; c.fillRect(2040, -400, 2900, 1530);
          c.strokeStyle = 'rgba(160,190,255,.06)'; c.lineWidth = 2; c.beginPath(); for (let x = 2048; x < 4940; x += 64) { c.moveTo(x, -400); c.lineTo(x, 1130) } for (let y = -384; y < 1130; y += 64) { c.moveTo(2040, y); c.lineTo(4940, y) } c.stroke();
          const sg = c.createRadialGradient(LAB2, 500, 40, LAB2, 500, 760); sg.addColorStop(0, 'rgba(120,150,255,.22)'); sg.addColorStop(1, 'rgba(120,150,255,0)'); c.fillStyle = sg; c.fillRect(2040, -400, 2900, 1530);
          c.restore();
        }
        const kin = spr(at(t, K.vop - .1, K.vop + .4)), ks = eio(at(t, K.formula - .1, K.formula + .25)), kf = ei(at(t, K.hid - .05, K.arch));
        const x = LAB2, y = lp(1500, 500, kin) + lp(0, 1790 - 500, kf), s2 = lp(.95, .42, ks) * lp(1, .75, kf), r = lp(.2, -.03, eo(at(t, K.vop - .1, K.vop + .5))) + Math.sin(kf * 3) * .1;
        if (kf < .85) projectCard(c, t, x, y, s2, r, { min: 1, st: at(t, K.fail - .05, K.fail + .25), kv: at(t, K.vop + .1, K.vop + .45), kq: spr(at(t, K.vop + .3, K.vop + .65)) });
      }
    }
    // ---- архив; справа — зал суда ----
    if (t > K.tilt - .1) { c.save(); c.translate(AOFF[0], AOFF[1]); archive(c, t); c.restore() }
    if (t > K.court - .6 && t < K.secrets + .5) { c.save(); c.translate(AOFF[0] + CRT, AOFF[1]); court(c, t); c.restore() }
    c.restore();
    if (t < K.chemPan + .8) vignette(c, .62 * (1 - eio(at(t, K.chemPan, K.chemPan + .6))), '18,2,8');   // v16.2: виньетка рентген-кабинета
  }
  // стеллажи склада по краям архива
  function racks(c) {
    for (const x0 of [30, 1470]) {
      c.fillStyle = '#0d2560'; c.fillRect(x0, 150, 14, 760); c.fillRect(x0 + 406, 150, 14, 760);
      for (let row = 0; row < 3; row++) {
        const y0 = 360 + row * 230; c.fillStyle = '#0d2560'; c.fillRect(x0, y0, 420, 14);
        for (let j = 0; j < 3; j++) { const bw = 100 + 24 * H1(row * 7 + j + x0), bh = 100 + 60 * H1(row * 3 + j * 2 + x0); c.fillStyle = H1(j + row * 2 + x0) > .5 ? '#163e86' : '#12357a'; c.fillRect(x0 + 24 + j * 128, y0 - bh, bw, bh); c.fillStyle = '#2a5aa6'; c.fillRect(x0 + 24 + j * 128 + bw * .28, y0 - bh * .62, bw * .44, bh * .2) }
      }
    }
  }
  // навесной замок на коробке: защёлкивается вместе с крышкой, на «тайны» слетает
  function lockDraw(c, t) {
    const k = at(t, K.arch + .14, K.arch + .3), kf = eo(at(t, K.secrets + .05, K.secrets + .5));
    if (k <= 0 || kf >= 1) return;
    const x = BX + 150 - kf * 600, y = 676 - Math.sin(Math.PI * kf) * 260 + kf * 120, sc = spr(k);
    c.save(); c.translate(x, y); c.rotate(kf * 3); c.scale(sc, sc);
    const dy = (1 - eo(at(t, K.arch + .26, K.arch + .36))) * -18;
    c.strokeStyle = '#c9cfdb'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(-26, -12); c.lineTo(-26, -30 + dy); c.arc(0, -30 + dy, 26, Math.PI, 0); c.lineTo(26, -12 + dy); c.stroke();
    rr(c, -40, -18, 80, 66, 12); fill(c, C.gold); rr(c, -40, -18, 80, 14, [12, 12, 0, 0]); fill(c, '#f2c46a');
    circ(c, 0, 10, 9, C.wood); c.fillStyle = C.wood; c.fillRect(-4, 12, 8, 18);
    c.restore();
  }
  function archive(c, t) {
    racks(c);
    circ(c, 960, 650, 470, A.disc);
    const sa = .08 + .015 * Math.sin(t * 2.2); c.save(); c.globalAlpha = sa; poly(c, [880, -80, 1040, -80, 1270, 905, 650, 905]); fill(c, C.spot); c.globalAlpha = sa * 1.4; c.beginPath(); c.ellipse(960, 905, 330, 44, 0, 0, TAU); fill(c, C.spot); c.restore();
    for (const b of SIDE) sideBox(c, t, b, K.arch + .15);
    const kz = ei(at(t, K.arch, K.arch + .12));
    if (kz < 1) { c.save(); c.translate(0, 580); c.scale(1, 1 - kz); rr(c, BX - 196, -232, 392, 232, [16, 16, 0, 0]); fill(c, A.lidIn); rr(c, BX - 176, -212, 352, 196, 10); fill(c, A.lidIn2); c.restore() }
    poly(c, [BX - 200, 610, BX + 200, 610, BX + 174, 580, BX - 174, 580]); fill(c, A.open);
    if (t > K.arch - .3 && t < K.arch + .1) { const k = ei(at(t, K.arch - .3, K.arch)); projectCard(c, t, BX, lp(470, 760, k), .32, -.03, { st: 1 }) }
    boxShape(c, BX, BY, BW, BH, { front: A.main, side: A.mainD, handle: false });
    c.fillStyle = A.label; c.fillRect(BX - 115, 712, 230, 86);
    tx(c, 'АРХИВ', BX, 745, { f: 'J', w: 700, s: 40, ls: 4, c: A.ink });
    tx(c, 'R.J.R. · 1979', BX, 778, { f: 'J', w: 500, s: 18, ls: 2, c: A.ink2 });
    c.fillStyle = C.red; c.fillRect(BX - 115, 806, 230, 10);
    // паутина в углу коробки — прошли годы
    const kw = at(t, K.arch + .3, K.arch + .8);
    if (kw > 0 && t < K.secrets) { c.save(); c.strokeStyle = 'rgba(242,237,230,.85)'; c.lineWidth = 3; const ox = BX - 200, oy = 610; for (let i = 0; i < 5; i++) { const an = Math.PI / 2 * i / 4; drawOn(c, [ox, oy, ox + Math.cos(an) * 150, oy + Math.sin(an) * 150], kw) } for (let j = 1; j <= 3; j++) drawOn(c, [...Array(5)].flatMap((_, i) => { const an = Math.PI / 2 * i / 4, rr2 = j * 42 + (i % 2) * 6; return [ox + Math.cos(an) * rr2, oy + Math.sin(an) * rr2] }), at(kw, .3 + j * .15, .7 + j * .1)); c.restore() }
    // закрытая крышка: падает, на «тайны» слетает
    const kc = at(t, K.arch + .12, K.arch + .26);
    if (kc > 0) {
      const u = at(t, K.arch + .26, K.arch + .42), kf = eo(at(t, K.secrets, K.secrets + .6));
      c.save(); c.translate(BX - 1380 * kf, 600 - 50 * (1 - kc * kc) - Math.sin(Math.PI * u) * 8 - 300 * kf - Math.sin(Math.PI * kf) * 110); c.rotate(-1.2 * kf); c.translate(-BX, -600); lidClosed(c); c.restore();
    }
    lockDraw(c, t);
    // листы: вылетают на «тайны», на «опубликовали» улетают в окно браузера
    const ku = K.pub;
    for (const p of PAPERS) if (t >= K.secrets + p.d0) {
      const q = paperPose(p, t, K.secrets), kb = eio(at(t, ku + p.seed * .015, ku + .45 + p.seed * .015));
      if (kb >= 1) continue;
      sheetShape(c, lp(q.x, 960, kb), lp(q.y, 600, kb), q.r * (1 - kb), q.s * (1 - kb * .85), { red: p.red });
    }
    const ks = spr(at(t, K.arch + .45, K.arch + .85)) * (1 - eio(at(t, K.y98go - .25, K.y98go + .05)));
    plate(c, 'СЕКРЕТНО', 960, 230, ks, { s: 80, bg: C.red, c: C.white, ls: 8 });
    const kn = eo(at(t, K.n14, K.n14 + .25)) * (1 - eio(at(t, K.pub + .2, K.pub + .5)));
    if (kn > 0) {
      c.save(); c.globalAlpha = kn; rr(c, 960 - 430 + 12, 225 - 95 + 14, 860, 190, 36); fill(c, 'rgba(4,10,42,.35)'); rr(c, 960 - 430, 225 - 95, 860, 190, 36); fill(c, C.n0);
      num(c, fmt(Math.round(14e6 * eo(at(t, K.n14 + .05, K.n14 + .85)))), 960, 232, { s: 132, c: C.white }); c.restore();
      plate(c, 'ДОКУМЕНТОВ', 960, 372, spr(at(t, K.docs - .1, K.docs + .3)) * kn, { s: 42, bg: C.white, c: C.red, ls: 10 });
    }
    const kbw = spr(at(t, K.pub - .05, K.pub + .4)); if (kbw > 0) browser(c, t, 960, 600, kbw, { rows: at(t, K.pub + .15, K.pub + 1.0), count: '14 000 000+' });
  }
  function star5(c, x, y, r, col) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .42 : r; i ? c.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q) : c.moveTo(x + Math.cos(a) * q, y + Math.sin(a) * q) } c.closePath(); fill(c, col) }
  // флаг США на древке: 13 полос, 50 звёзд (полосы колышутся)
  function usFlag(c, x, y, s, t) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = '#c9a25a'; c.fillRect(-8, -40, 16, 1400); circ(c, 0, -46, 18, C.gold);
    const W = 360, Hf = 230, sh = Hf / 13; c.translate(10, 0);
    const wv = (x2, y0) => y0 + Math.sin(x2 * .02 + t * 3) * 8 * x2 / W;
    for (let i = 0; i < 13; i++) { c.fillStyle = i % 2 ? C.white : '#c8323f'; c.beginPath(); c.moveTo(0, i * sh); for (let x2 = 0; x2 <= W; x2 += 20) c.lineTo(x2, wv(x2, i * sh)); for (let x2 = W; x2 >= 0; x2 -= 20) c.lineTo(x2, wv(x2, (i + 1) * sh) + .6); c.closePath(); c.fill() }
    const cw = W * .4, ch = sh * 7;
    c.fillStyle = '#1d3a7a'; c.beginPath(); c.moveTo(0, 0); for (let x2 = 0; x2 <= cw; x2 += 12) c.lineTo(x2, wv(x2, 0)); for (let x2 = cw; x2 >= 0; x2 -= 12) c.lineTo(x2, wv(x2, ch)); c.closePath(); c.fill();
    for (let r = 0; r < 9; r++) for (let j = 0; j < (r % 2 ? 5 : 6); j++) { const sx = cw * (2 * j + 1 + r % 2) / 12; star5(c, sx, wv(sx, ch * (r + 1) / 10), 4.6, C.white) }
    c.restore();
  }
  // зал суда Миннесоты: панели тёмного дерева, печать, флаг, кресло судьи, трибуна, весы, подставка и молоток — два удара
  const SBc = { x: 1340, y: 548 };
  function court(c, t) {
    c.fillStyle = '#4a2410'; c.fillRect(-300, -300, 2520, 1680);
    for (let i = 0; i < 13; i++) { const x0 = -110 + i * 170; c.fillStyle = i % 2 ? '#5c2e0e' : '#55290c'; c.fillRect(x0, 0, 166, 780); rr(c, x0 + 20, 70, 126, 290, 8); stroke(c, '#3b1c07', 6); rr(c, x0 + 20, 410, 126, 300, 8); stroke(c, '#3b1c07', 6) }
    c.fillStyle = '#7a3f15'; c.fillRect(-300, 0, 2520, 26); c.fillRect(-300, 760, 2520, 30);
    c.fillStyle = '#3b1c07'; c.fillRect(-300, 790, 2520, 600);
    circ(c, 960, 190, 140, C.gold); circ(c, 960, 190, 118, '#1b2a5c'); c.beginPath(); c.arc(960, 190, 104, 0, TAU); stroke(c, C.gold, 4);
    scales(c, 960, 200, .24, C.gold, 1);
    usFlag(c, 330, 236, 1, t);
    rr(c, 850, 300, 220, 330, 46); fill(c, '#7a1f2b'); rr(c, 872, 322, 176, 290, 36); fill(c, '#8f2a37');
    c.fillStyle = '#6b3a1a'; c.fillRect(400, 560, 1120, 560); c.fillStyle = '#8a4a1c'; c.fillRect(380, 540, 1160, 36);
    for (let i = 0; i < 4; i++) { rr(c, 450 + i * 262, 610, 222, 380, 10); stroke(c, '#4a2410', 8) }
    c.beginPath(); c.ellipse(SBc.x, SBc.y - 4, 110, 26, 0, 0, TAU); fill(c, C.wood); c.fillStyle = C.wood; c.fillRect(SBc.x - 110, SBc.y - 30, 220, 26); c.fillStyle = C.gold; c.fillRect(SBc.x - 110, SBc.y - 20, 220, 8); c.beginPath(); c.ellipse(SBc.x, SBc.y - 30, 110, 26, 0, 0, TAU); fill(c, C.wood3);
    const ke = eo(at(t, K.court - .1, K.court + .35)), s1 = ei(at(t, K.tob - .2, K.tob)), r1 = eo(at(t, K.tob + .15, K.secrets - .35)), s2 = ei(at(t, K.secrets - .26, K.secrets - .08));
    let th = 1.1 * (1 - s1) + 1.0 * r1 * (1 - s2); const ub = at(t, K.tob, K.tob + .3), ub2 = at(t, K.secrets - .08, K.secrets + .22);
    th += Math.sin(Math.PI * Math.min(1, ub * 1.6)) * .22 * (t < K.secrets - .35 ? 1 : 0) + Math.sin(Math.PI * Math.min(1, ub2 * 1.6)) * .22;
    if (ke > 0) gavel(c, lp(1900, SBc.x + 320, ke), lp(200, SBc.y - 30 - 86, ke), th);
    for (const th2 of [K.tob, K.secrets - .08]) { const ku2 = at(t, th2, th2 + .45); if (ku2 <= 0 || ku2 >= 1) continue; c.save(); c.globalAlpha = 1 - ku2; c.beginPath(); c.ellipse(SBc.x, SBc.y - 24, lp(110, 460, eo(ku2)), lp(26, 110, eo(ku2)), 0, 0, TAU); stroke(c, C.gold, 10); c.restore() }
    plate(c, 'СУД · МИННЕСОТА · 1998', 960, 820, spr(at(t, K.court + .05, K.court + .45)), { s: 52, bg: C.white, c: C.ink, ls: 5 });
  }

  // ================= 4. карта района (условность: архив UCSF и Стэнфорд рядом); ноутбук, поиск, студенты =================
  const MPA = { x: 760, y: 470 }, MPS = { x: 1180, y: 660 }, CARDW = 380;
  function pin(c, x, y, k, col) {
    if (k <= 0) return; const s = spr(k);
    c.save(); c.translate(x, y); c.scale(s, s);
    c.beginPath(); c.ellipse(0, 4, 26, 9, 0, 0, TAU); fill(c, 'rgba(20,25,53,.25)');
    c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-18, -26, -40, -46, -40, -74); c.arc(0, -74, 40, Math.PI, 0); c.bezierCurveTo(40, -46, 18, -26, 0, 0); fill(c, col);
    circ(c, 0, -74, 16, C.white); c.restore();
  }
  function campus(c, x, y, k) {   // башня с куполом и аркада — университет
    if (k <= 0) return; const s = eo(k);
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = '#e9b26a'; c.fillRect(-150, -90, 300, 90); c.fillStyle = '#c98a3e'; for (let i = 0; i < 5; i++) { rr(c, -132 + i * 56, -70, 36, 70, [18, 18, 0, 0]); fill(c, '#7a4f22') }
    poly(c, [-170, -90, 170, -90, 150, -118, -150, -118]); fill(c, '#b5482f');
    c.fillStyle = '#e9b26a'; c.fillRect(-34, -330, 68, 240); c.fillStyle = '#c98a3e'; c.fillRect(14, -330, 20, 240);
    for (let j = 0; j < 4; j++) { c.fillStyle = '#7a4f22'; c.fillRect(-14, -300 + j * 50, 28, 30) }
    c.beginPath(); c.arc(0, -330, 40, Math.PI, 0); fill(c, '#b5482f'); c.fillStyle = '#b5482f'; c.fillRect(-4, -400, 8, 40);
    c.restore();
  }
  function archIcon(c, x, y, k) {   // здание архива с колоннами
    if (k <= 0) return; const s = eo(k);
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = '#e9edf5'; c.fillRect(-110, -120, 220, 120); poly(c, [-130, -120, 130, -120, 0, -186]); fill(c, '#9fb0d0');
    c.fillStyle = '#7d8fb5'; for (let i = 0; i < 5; i++) c.fillRect(-95 + i * 42, -110, 18, 104); c.fillStyle = '#5a6b94'; c.fillRect(-122, -8, 244, 14);
    c.restore();
  }
  function districtMap(c, t) {
    c.fillStyle = '#f3ead6'; c.fillRect(-1600, -1200, 5200, 3600);
    c.fillStyle = '#4aa3df';
    c.beginPath(); c.moveTo(-1600, -1200); c.lineTo(180, -1200); for (let y = -1200; y <= 2400; y += 60) c.lineTo(180 + 40 * Math.sin(y * .01) + 20 * Math.sin(y * .037), y); c.lineTo(-1600, 2400); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(3600, -1200); c.lineTo(1520, -1200); for (let y = -1200; y <= 2400; y += 60) c.lineTo(1520 + 120 * Math.sin(y * .006 + 1) + 40 * Math.sin(y * .03), y); c.lineTo(3600, 2400); c.closePath(); c.fill();
    for (const [x, y, rx, ry] of [[520, 780, 120, 70], [1000, 250, 90, 60], [1320, 900, 110, 60], [420, 300, 80, 50], [1240, 420, 70, 46]]) { c.beginPath(); c.ellipse(x, y, rx, ry, .2, 0, TAU); fill(c, '#cfe8b4') }
    c.fillStyle = '#e6dcc4';
    for (let i = 0; i < 48; i++) { const bx = 250 + (i % 8) * 150 + 20 * H1(i), by = -260 + Math.floor(i / 8) * 150 + 16 * H1(i * 3); if (Math.hypot(bx + 50 - MPA.x, by + 45 - MPA.y) < 170 || Math.hypot(bx + 50 - MPS.x, by + 45 - MPS.y) < 190) continue; c.fillRect(bx, by, 104, 92) }
    c.lineCap = 'round';
    for (const [P, w] of [[[200, 120, 700, 300, 1000, 520, 1400, 900], 26], [[250, 900, 700, 620, 1100, 480, 1450, 300], 20], [[900, -300, 960, 300, 1020, 1200], 18]]) { c.strokeStyle = '#d5c7a6'; c.lineWidth = w + 8; spline(c, P, false); c.stroke(); c.strokeStyle = '#ffffff'; c.lineWidth = w; spline(c, P, false); c.stroke() }
  }
  function cam6(t) {
    // окно архива на весь экран → отъезд: это карточка над точкой архива на карте района
    const k = at(t, K.mapT, K.mapT + 1.0), Z = zoomCam(1 - k, MPA.x, MPA.y - 170, 1, 1920 / CARDW, 960, 540);
    const kd = eio(at(t, K.mapT + 1.0, K.lap + .3));
    return { s: Z.s * lp(1, 1.06, kd), x: lp(Z.x, 970, kd), y: lp(Z.y, 560, kd) };
  }
  function searchUI(c, t) {
    rr(c, -450, -253, 900, 506, 10); fill(c, C.white);
    c.save(); rr(c, -450, -253, 900, 506, 10); c.clip();
    c.fillStyle = '#e9edf5'; c.fillRect(-450, -253, 900, 52);
    for (const [i, col] of [[0, C.red], [1, C.am], [2, C.mint]]) circ(c, -420 + i * 26, -227, 8, col);
    rr(c, -330, -242, 600, 30, 15); fill(c, C.white); tx(c, 'industrydocuments.ucsf.edu', -312, -227, { f: 'J', w: 500, s: 17, c: C.n2, al: 'left' });
    c.fillStyle = C.blue; c.fillRect(-450, -201, 900, 64); tx(c, 'АРХИВ ДОКУМЕНТОВ ТАБАЧНЫХ КОМПАНИЙ', -420, -169, { s: 22, ls: 2, c: C.white, al: 'left' });
    rr(c, -420, -116, 640, 56, 12); fill(c, '#f2f5fa'); rr(c, -420, -116, 640, 56, 12); stroke(c, '#b8c4dc', 3);
    const q = 'nicotine salt 1979', n = Math.floor(q.length * at(t, K.lap + .45, K.find - .15)), on = t > K.lap + .4;
    if (on) tx(c, q.slice(0, n) + ((t * 2.5) % 1 < .5 && t < K.find ? '|' : ''), -396, -88, { f: 'J', w: 700, s: 26, c: C.ink, al: 'left' });
    rr(c, 236, -116, 184, 56, 12); fill(c, C.red); tx(c, 'НАЙТИ', 328, -87, { s: 22, ls: 3, c: C.white });
    for (let i = 0; i < 4; i++) {
      const k = eo(at(t, K.find + i * .08, K.find + i * .08 + .3)); if (k <= 0) continue; const ry = -36 + i * 64;
      c.globalAlpha = k; rr(c, -420, ry, 840, 52, 10); fill(c, i === 0 ? '#fff1c2' : '#eef2f9');
      if (i === 0) tx(c, 'R.J. REYNOLDS · 1979 · НИКОТИНОВАЯ СОЛЬ', -400, ry + 27, { f: 'J', w: 700, s: 20, c: C.ink, al: 'left' });
      else { rr(c, -400, ry + 20, 360 + 120 * H1(i), 12, 6); fill(c, '#b8c4dc') }
      c.globalAlpha = 1;
    }
    c.restore();
    if (t > K.find) stampBox(c, 'НАЙДЕНО', 300, -6, at(t, K.find + .05, K.find + .32), '#1f9b7c', -.12, 34);
  }
  function laptopAt(c, t, k, z) {
    if (k <= 0) return; const s0 = .8, s = s0 * Math.pow((1920 / 900) / s0, eio(z)), cy = lp(lp(1560, 520, spr(k)), 540, eio(z));
    c.save(); c.translate(960, cy); c.scale(s, s);
    poly(c, [-560, 268, 560, 268, 640, 330, -640, 330]); fill(c, '#c9d2e3'); c.fillStyle = '#aeb9cf'; c.fillRect(-640, 330, 1280, 16); rr(c, -90, 286, 180, 18, 9); fill(c, '#aeb9cf');
    rr(c, -482, -287, 964, 560, 28); fill(c, C.n0);
    searchUI(c, t); c.restore();
  }
  function shot6(c, t) {
    c.fillStyle = '#f3ead6'; c.fillRect(-200, -200, WW + 400, HH + 400);
    const Q = cam6(t); c.save(); cam(c, Q.s, Q.x, Q.y);
    districtMap(c, t);
    pin(c, MPA.x, MPA.y, 1, C.red);
    const ks = at(t, K.near - .15, K.near + .3);
    if (ks > 0) { campus(c, MPS.x + 170, MPS.y + 40, at(t, K.stan - .1, K.stan + .45)); pin(c, MPS.x, MPS.y, ks, C.red) }
    const kl = at(t, K.near + .25, K.near + .8);
    if (kl > 0) { c.save(); c.setLineDash([22, 16]); c.lineCap = 'round'; c.strokeStyle = C.red; c.lineWidth = 9; drawOn(c, [MPA.x, MPA.y - 40, MPS.x, MPS.y - 40], eio(kl)); c.restore() }
    { const kf = eio(at(t, K.mapT + 1.1, K.mapT + 1.9)); if (kf < 1) browser(c, t, MPA.x, lp(MPA.y - 170, MPA.y - 74, kf), CARDW / 900 * (1 - kf), { sh: false, rows: 1, count: '14 000 000+' }) }
    c.restore();
    const S = (x, y) => [960 + Q.s * (x - Q.x), 540 + Q.s * (y - Q.y)], kv = cl(1 - (Q.s - 1.06) / .5);
    if (kv > 0) {
      const [ax, ay] = S(MPA.x, MPA.y), [sx, sy] = S(MPS.x, MPS.y);
      plate(c, 'АРХИВ UCSF', ax - 40, ay + 56, kv, { s: 30, bg: C.n0, c: C.white });
      plate(c, 'СТЭНФОРД', sx - 30, sy + 58, spr(at(t, K.stan + .05, K.stan + .45)), { s: 34, bg: C.white, c: C.ink, ls: 4 });
      const [l1x, l1y] = S(MPA.x, MPA.y - 40), [l2x, l2y] = S(MPS.x, MPS.y - 40), LL = Math.hypot(l2x - l1x, l2y - l1y) || 1;
      plate(c, 'ПО СОСЕДСТВУ', (l1x + l2x) / 2 + (l2y - l1y) / LL * 150, (l1y + l2y) / 2 - (l2x - l1x) / LL * 150, spr(at(t, K.near + .35, K.near + .75)), { s: 40, bg: C.red, c: C.white, ls: 4, r: -.05 });
      plate(c, 'КАЛИФОРНИЯ', 330, 110, kv * (1 - at(t, K.near - .2, K.near + .1)), { s: 40, bg: C.white, c: C.ink, ls: 6 });
    }
    laptopAt(c, t, at(t, K.lap, K.lap + .45), at(t, K.lap + .5, K.lapZ));
  }
  // студенты со спины (силуэты), подсвечены экраном
  function student(c, x, y, s, o = {}) {
    c.save(); c.translate(x, y); c.scale(s, s);
    spline(c, [-250, 400, -230, 150, -120, 70, 120, 70, 230, 150, 250, 400]); fill(c, C.n0);
    c.fillStyle = C.n0; c.fillRect(-55, -10, 110, 100);
    circ(c, 0, -80, 105, C.n0);
    if (o.hair === 1) { spline(c, [-108, -86, -90, -170, 0, -200, 90, -170, 108, -86, 60, -130, -40, -130]); fill(c, '#0b0f24') }
    else { spline(c, [-114, -60, -110, -150, -50, -198, 30, -200, 98, -160, 116, -70, 80, -120, 10, -150, -60, -128]); fill(c, '#0b0f24') }   // без шапки
    c.strokeStyle = '#7fb0ff'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.arc(0, -80, 105, -2.7, -.45); c.stroke();
    c.beginPath(); c.moveTo(-220, 140); c.quadraticCurveTo(-130, 66, -60, 74); c.moveTo(220, 140); c.quadraticCurveTo(130, 66, 60, 74); c.stroke();
    c.restore();
  }
  function shot7(c, t) {
    c.fillStyle = C.n0; c.fillRect(-200, -200, WW + 400, HH + 400);
    // переход в чертёж: наезд в найденную строку (а не круг из головы)
    const kz = eio(at(t, K.create - .8, K.create + .1)), m = Math.pow(3.4, kz);
    c.save(); c.translate(960, 540); const s = (1920 / 900) * lp(1, 1.04, eio(at(t, K.lapZ, K.create))) * m; c.scale(s, s); c.translate(0, 10 * kz); searchUI(c, t); c.restore();
    const ks = eo(at(t, K.two - .1, K.two + .45)), fa = 1 - ss(0, .35, kz);
    if (ks > 0 && fa > 0) { c.save(); c.globalAlpha = fa; student(c, 690, 820 + (1 - ks) * 600, 1.0, { hair: 1 }); student(c, 1230, 840 + (1 - ks) * 650, 1.05, { hair: 2 }); c.restore() }
    plate(c, 'ДВА СТУДЕНТА СТЭНФОРДА', 960, 880, spr(at(t, K.two + .15, K.two + .55)) * fa, { s: 34, bg: C.white, c: C.ink });
    // v16.2: найденная строка растёт — сквозь неё проступает уже готовый чертёж (пустого синего кадра нет)
    const kr = ss(.08, .42, kz), kb = ss(.5, 1, kz);
    if (kr > 0 || kb > 0) {
      const o = offC(); shot8(o, t);
      if (kr > 0 && kb < 1) { c.save(); c.translate(960, 540); c.scale(s, s); c.translate(0, 10 * kz); rr(c, -420, -36, 840, 52, 10); c.restore(); c.save(); c.clip(); c.globalAlpha = kr; c.drawImage(OFF, -OFFP, -OFFP); c.restore() }
      if (kb > 0) { c.save(); c.globalAlpha = kb; c.drawImage(OFF, -OFFP, -OFFP); c.restore() }
    }
  }
  // кадр другой сцены — на отдельном холсте (с запасом по краям под живую камеру), чтобы проявить его поверх
  let OFF = null; const OFFP = 140;
  function offC() {
    if (!OFF) OFF = mk(WW + 2 * OFFP, HH + 2 * OFFP);
    const o = OFF.getContext('2d'); o.setTransform(1, 0, 0, 1, 0, 0); o.globalAlpha = 1; o.globalCompositeOperation = 'source-over'; o.clearRect(0, 0, OFF.width, OFF.height); o.translate(OFFP, OFFP); return o;
  }

  // ================= 5. чертёж JUUL: «похожа на флешку», внутри — та самая соль =================
  const JX = 960, JY = 420;
  function grid(c, col, step = 64) { c.save(); c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); for (let x = -step * 2; x <= WW + step * 3; x += step) { c.moveTo(x, -200); c.lineTo(x, HH + 200) } for (let y = -step * 2; y <= HH + step * 3; y += step) { c.moveTo(-200, y); c.lineTo(WW + 200, y) } c.stroke(); c.restore() }
  function label(c, s, x1, y1, x2, y2, k, al = 'center') {
    if (k <= 0) return; c.save(); c.strokeStyle = C.white; c.lineWidth = 3; drawOn(c, [x1, y1, x2, y2], eio(k)); circ(c, x1, y1, 7 * cl(k * 3), C.white); c.restore();
    tx(c, s, x2, y2 + (y2 > y1 ? 24 : -24), { s: 26, ls: 3, c: C.white, a: at(k, .5, 1), al });
  }
  function juulBP(c, t) {
    const k0 = at(t, K.bp0, K.bp0 + .7), x0 = JX - 550, y0 = JY - 75;
    c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
    if (k0 > .2) { c.globalAlpha = at(k0, .2, .6); rr(c, x0, y0, 1100, 150, 30); fill(c, C.bp2); c.globalAlpha = 1 }
    c.strokeStyle = C.white; c.lineWidth = 6;
    drawOn(c, rrPts(x0, y0, 1100, 150, 30), k0, true);
    drawOn(c, [JX - 250, y0, JX - 250, y0 + 150], at(t, K.bp0 + .3, K.bp0 + .6));
    drawOn(c, [JX - 500, y0 + 8, JX - 500, y0 + 142], at(t, K.bp0 + .3, K.bp0 + .6));
    // камера с жидкостью, нагреватель, аккумулятор, диод, контакты
    const lv = eio(at(t, K.alive - .1, K.alive + .7));
    if (lv > 0) { c.save(); rr(c, JX - 470, JY - 45, 190, 90, 16); c.clip(); c.fillStyle = C.am; c.fillRect(JX - 470, JY + 45 - 90 * lv, 190, 90); c.fillStyle = C.am3; for (let i = 0; i < 5; i++) { const ph = (t * .8 + H1(i)) % 1; circ(c, JX - 450 + 150 * H1(i * 4.1), JY + 40 - 80 * ph, 5, C.am3) } c.restore() }
    drawOn(c, rrPts(JX - 470, JY - 45, 190, 90, 16), at(t, K.bp0 + .45, K.bp0 + .85), true);
    const zz = []; for (let i = 0; i <= 10; i++) zz.push(JX - 268 + (i % 2 ? 12 : -12), JY - 40 + i * 8);
    drawOn(c, zz, at(t, K.bp0 + .6, K.bp0 + .95));
    drawOn(c, rrPts(JX - 200, JY - 50, 540, 100, 20), at(t, K.bp0 + .55, K.bp0 + 1.0), true);
    const kb2 = at(t, K.bp0 + .9, K.bp0 + 1.2); tx(c, '+', JX + 300, JY, { s: 44, c: C.white, a: kb2 }); tx(c, '–', JX - 160, JY, { s: 44, c: C.white, a: kb2 });
    const led = at(t, K.alive, K.alive + .3); circ(c, JX + 420, JY - 34, 13, led > 0 ? mixc(C.bp2, C.mint, led) : C.bp2); c.beginPath(); c.arc(JX + 420, JY - 34, 13, 0, TAU); stroke(c, C.white, 4);
    if (led > 0) { c.save(); c.globalAlpha = .5 * led; c.beginPath(); c.arc(JX + 420, JY - 34, 26 + 4 * Math.sin(t * 8), 0, TAU); stroke(c, C.mint, 4); c.restore() }
    drawOn(c, [JX + 520, JY - 30, JX + 540, JY - 30], at(t, K.bp0 + 1.0, K.bp0 + 1.2)); drawOn(c, [JX + 520, JY + 30, JX + 540, JY + 30], at(t, K.bp0 + 1.0, K.bp0 + 1.2));
    // размер
    const kd = at(t, K.ecig, K.ecig + .5); c.lineWidth = 3;
    drawOn(c, [x0, y0 - 50, x0 + 1100, y0 - 50], kd); drawOn(c, [x0, y0 - 66, x0, y0 - 34], kd); drawOn(c, [x0 + 1100, y0 - 66, x0 + 1100, y0 - 34], kd);
    if (kd > .5) { rr(c, JX - 70, y0 - 72, 140, 44, 10); fill(c, C.bp); tx(c, '9,5 СМ', JX, y0 - 50, { f: 'J', w: 700, s: 26, c: C.white, a: at(kd, .5, 1) }) }
    c.restore();
    label(c, 'КАРТРИДЖ', JX - 375, JY + 45, JX - 420, JY + 165, at(t, K.bp0 + .9, K.bp0 + 1.3));
    label(c, 'НАГРЕВАТЕЛЬ', JX - 268, JY + 40, JX - 150, JY + 225, at(t, K.bp0 + 1.0, K.bp0 + 1.4));
    label(c, 'АККУМУЛЯТОР', JX + 70, JY + 50, JX + 120, JY + 165, at(t, K.bp0 + 1.1, K.bp0 + 1.5));
    label(c, 'ИНДИКАТОР', JX + 420, JY - 34, JX + 430, JY + 225, at(t, K.bp0 + 1.2, K.bp0 + 1.6));
  }
  function flashDrive(c, t, x, y, k) {
    if (k <= 0) return; c.save(); c.translate(x, y); c.lineJoin = 'round'; c.lineCap = 'round';
    c.globalAlpha = at(k, .3, .7); rr(c, -400, -62, 640, 124, 30); fill(c, C.bp2); c.globalAlpha = 1;
    c.strokeStyle = C.white; c.lineWidth = 6; drawOn(c, rrPts(-400, -62, 640, 124, 30), k, true);
    drawOn(c, rrPts(240, -44, 160, 88, 6), at(k, .4, .9), true);
    if (k > .7) { rr(c, 290, -24, 30, 18, 3); fill(c, C.white); rr(c, 290, 6, 30, 18, 3); fill(c, C.white) }
    drawOn(c, rrPts(-360, -22, 60, 44, 22), at(k, .5, 1), true);
    c.restore();
  }
  function shot8(c, t) {
    c.fillStyle = C.bp; c.fillRect(-200, -200, WW + 400, HH + 400);
    const gs = (t * 38) % 64; c.save(); c.translate(gs - 64, gs * .6 - 64); grid(c, C.bp2); c.restore();
    const zb = lp(1, 1.1, eio(at(t, K.create, K.podGo))) * lp(1.22, 1, eo(at(t, K.create + .05, K.create + .5)));
    c.save(); c.translate(960, 540); c.scale(zb, zb); c.rotate(.012 * Math.sin(t * 1.3)); c.translate(-960, -540 + 8 * Math.sin(t * 1.7));
    c.save(); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 4; c.strokeRect(40, 40, WW - 80, HH - 80); c.restore();
    juulBP(c, t);
    const kf = at(t, K.flash - .1, K.flash + .6); flashDrive(c, t, JX + 80, 760, kf);
    if (kf > 0) { tx(c, '≈', JX - 430, 760, { s: 120, c: C.white, a: at(kf, .2, .6) }); plate(c, 'ФЛЕШКА', JX + 80, 868, spr(at(t, K.flash + .2, K.flash + .6)), { s: 30, bg: C.white, c: C.bp }) }
    // та самая соль (1979) влетает в картридж
    const kc = at(t, K.salt2 - .3, K.salt2 + .35);
    if (kc > 0 && kc < 1) crystal(c, lp(1500, JX - 375, eio(kc)), lp(130, JY, eio(kc)) - Math.sin(Math.PI * kc) * 120, lp(.5, .12, eio(kc)), kc * 3, { shine: kc });
    const kp = at(t, K.salt2 + .15, K.salt2 + .5);
    if (kp > 0) { spark(c, JX - 375, JY, 60 * Math.sin(Math.PI * at(t, K.salt2 + .3, K.salt2 + .8)), C.white); plate(c, 'СОЛЬ 1979', JX - 375, JY - 175, spr(kp), { s: 34, bg: C.red, c: C.white }) }
    // штамп чертежа в углу
    const ktb = at(t, K.ecig, K.ecig + .4);
    if (ktb > 0) { c.save(); c.globalAlpha = ktb; c.strokeStyle = C.white; c.lineWidth = 3; c.strokeRect(1350, 116, 350, 140); c.beginPath(); c.moveTo(1350, 182); c.lineTo(1700, 182); c.moveTo(1530, 182); c.lineTo(1530, 256); c.stroke(); tx(c, 'JUUL', 1525, 150, { f: 'U', w: 800, s: 44, ls: 6, c: C.white }); tx(c, '2015', 1440, 220, { f: 'J', w: 700, s: 24, c: C.white }); tx(c, 'ЛИСТ 1', 1615, 220, { f: 'J', w: 700, s: 22, c: C.white }); c.restore() }   // v16.2: в кадре при любом наезде
    c.restore();
  }

  // ================= 6. картридж = пачка; мягкий пар; школьники; каждый четвёртый =================
  // картридж 150×300 стоя, мундштук сверху (цвет вкуса — манго)
  function podDraw(c, x, y, s, r, o = {}) {
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    if (o.sh !== false) { rr(c, -75 + 12, -158 + 16, 150, 308, 24); fill(c, 'rgba(20,25,53,.25)') }
    c.beginPath(); c.moveTo(-75, -80); c.lineTo(-62, -150); c.quadraticCurveTo(-60, -158, -50, -158); c.lineTo(50, -158); c.quadraticCurveTo(60, -158, 62, -150); c.lineTo(75, -80); c.closePath(); fill(c, C.am);
    c.save(); c.clip(); c.fillStyle = C.am2; c.fillRect(30, -170, 60, 100); c.restore();
    rr(c, -24, -152, 48, 10, 5); fill(c, C.n0);
    rr(c, -75, -82, 150, 232, [6, 6, 22, 22]); fill(c, '#dce9ff');
    c.save(); rr(c, -75, -82, 150, 232, [6, 6, 22, 22]); c.clip(); c.fillStyle = C.am; c.fillRect(-80, 150 - 232 * (o.level ?? .78), 160, 240); c.restore();
    rr(c, -75, -82, 150, 232, [6, 6, 22, 22]); stroke(c, C.n0, 6);
    rr(c, -75, 112, 150, 38, [0, 0, 22, 22]); fill(c, '#2c2f45');
    c.fillStyle = C.gold; c.fillRect(-40, 126, 22, 10); c.fillRect(18, 126, 22, 10);
    rr(c, -52, -60, 12, 140, 6); fill(c, 'rgba(255,255,255,.55)');
    c.restore();
  }
  const POD0 = { x: JX - 400, y: JY, s: 1, r: -Math.PI / 2 }, POD1 = { x: 430, y: 500, s: 1.5, r: 0 };
  function podPose(t) { const k = at(t, K.podGo, K.podGo + .7), e = eio(k); return { x: lp(POD0.x, POD1.x, e), y: lp(POD0.y, POD1.y, e) - Math.sin(Math.PI * k) * 140, s: lp(POD0.s, POD1.s, e), r: lp(POD0.r, POD1.r, eo(k)) } }
  const CG = [...Array(20)].map((_, i) => ({ x: 1060 + (i % 10) * 80, y: i < 10 ? 320 : 690, d: (i % 10) * .045 + (i < 10 ? 0 : .02) }));
  // v16.2: чертёжный стол — зелёный коврик для резки с сеткой и диагоналями, стальная линейка, кружка, карандаш, транспортир, свет лампы
  function draftTable(c, t) {
    c.fillStyle = '#1c5a4e'; c.fillRect(-200, -200, WW + 400, HH + 400);
    c.save(); c.strokeStyle = 'rgba(170,240,214,.13)'; c.lineWidth = 2; c.beginPath(); for (let x = 0; x <= WW; x += 40) { c.moveTo(x, -200); c.lineTo(x, HH + 200) } for (let y = 0; y <= HH; y += 40) { c.moveTo(-200, y); c.lineTo(WW + 200, y) } c.stroke();
    c.strokeStyle = 'rgba(190,250,226,.26)'; c.lineWidth = 3; c.beginPath(); for (let x = 0; x <= WW; x += 200) { c.moveTo(x, -200); c.lineTo(x, HH + 200) } for (let y = 0; y <= HH; y += 200) { c.moveTo(-200, y); c.lineTo(WW + 200, y) } c.stroke();
    c.strokeStyle = 'rgba(190,250,226,.1)'; c.lineWidth = 2; c.beginPath(); for (let k = -6; k < 12; k++) { c.moveTo(k * 240, 1200); c.lineTo(k * 240 + 1300, -100) } c.stroke(); c.restore();
    for (let i = 0; i < 9; i++) tx(c, String(i * 5), 200 * i + 12, 1060, { f: 'J', w: 500, s: 16, c: 'rgba(200,250,230,.45)', al: 'left' });
    c.save(); c.translate(960, 66); c.rotate(-.012); rr(c, -880, -30, 1760, 60, 8); fill(c, '#cfd6e0'); rr(c, -880, -30, 1760, 14, [8, 8, 0, 0]); fill(c, '#e8edf3');
    c.fillStyle = '#56607a'; for (let i = 0; i <= 176; i++) c.fillRect(-870 + i * 10, -30, 2, i % 10 ? (i % 5 ? 10 : 16) : 22);
    for (let i = 0; i <= 17; i++) tx(c, String(i), -870 + i * 100, 14, { f: 'J', w: 700, s: 15, c: '#56607a' });
    c.restore();
    circ(c, 150, 196, 104, 'rgba(0,0,0,.22)'); circ(c, 140, 184, 104, '#e9e4dc'); circ(c, 140, 184, 80, '#3a2416'); c.beginPath(); c.arc(140, 184, 64, 0, TAU); stroke(c, 'rgba(255,230,190,.35)', 6);
    rr(c, 232, 168, 60, 30, 14); fill(c, '#e9e4dc');
    c.save(); c.translate(1700, 1012); c.rotate(-.14); rr(c, -200, -15, 360, 30, 6); fill(c, '#f2b84a'); poly(c, [160, -15, 214, 0, 160, 15]); fill(c, '#e9cfa2'); poly(c, [198, -5, 214, 0, 198, 5]); fill(c, '#3b3f55'); rr(c, -232, -15, 36, 30, [8, 0, 0, 8]); fill(c, '#e8475a'); c.restore();
    c.save(); c.translate(150, 1080); c.beginPath(); c.arc(0, 0, 150, Math.PI, 0); c.closePath(); c.fillStyle = 'rgba(220,240,255,.25)'; c.fill(); c.strokeStyle = 'rgba(220,240,255,.6)'; c.lineWidth = 3; c.stroke();
    for (let i = 0; i <= 18; i++) { const a = Math.PI + i / 18 * Math.PI; c.beginPath(); c.moveTo(Math.cos(a) * 150, Math.sin(a) * 150); c.lineTo(Math.cos(a) * (i % 3 ? 136 : 124), Math.sin(a) * (i % 3 ? 136 : 124)); c.stroke() } c.restore();
    const lg = c.createRadialGradient(980, 470, 60, 980, 470, 1050); lg.addColorStop(0, 'rgba(255,244,214,.16)'); lg.addColorStop(1, 'rgba(255,244,214,0)'); c.fillStyle = lg; c.fillRect(-200, -200, WW + 400, HH + 400);
    vignette(c, .5, '4,22,18');
  }
  function shot9(c, t) {
    draftTable(c, t);
    const ke = spr(at(t, K.pack1 - .15, K.pack1 + .25)); if (ke > 0) { c.save(); c.translate(845, 500); c.scale(ke, ke); tx(c, '=', 0, 0, { s: 230, c: C.white }); c.restore() }
    for (const g of CG) { const k = at(t, K.pack1 + .05 + g.d, K.pack1 + .3 + g.d); if (k <= 0) continue; cig(c, g.x, g.y - (1 - bo(k)) * 800, 290, 56, -Math.PI / 2) }
    plate(c, '1 КАРТРИДЖ', 430, 860, spr(at(t, K.pod1, K.pod1 + .4)), { s: 44, bg: C.white, c: C.ink });
    plate(c, '20 СИГАРЕТ = ПАЧКА', 1420, 870, spr(at(t, K.cigs + .1, K.cigs + .5)), { s: 44, bg: C.n0, c: C.white });
  }
  // облака закрывают кадр слева направо (k 0..1); out — уходят вправо, открывая новое
  function cloudWipe(c, k, out) {
    if (k <= 0 || (out && k >= 1)) return;
    const X0 = lp(-420, 2350, eio(k));
    c.save(); c.fillStyle = C.white; c.beginPath();
    if (!out) { c.rect(-250, -250, X0 + 250, HH + 500); for (let i = 0; i < 9; i++) { const y = -60 + i * 150, r = 130 + 50 * H1(i); c.moveTo(X0 + r, y); c.arc(X0, y, r, 0, TAU) } }
    else { c.rect(X0, -250, WW + 600, HH + 500); for (let i = 0; i < 9; i++) { const y = -60 + i * 150, r = 130 + 50 * H1(i + 3); c.moveTo(X0 + r, y); c.arc(X0, y, r, 0, TAU) } }
    c.fill(); c.restore();
  }
  // ================= 6б. мягкий пар — снимок; школьный коридор: шкафчики, пар «без остановки», каждый 4-й — красный =================
  const LKW = 150, LKH = 520, LKY = 890, LKX = [...Array(12)].map((_, i) => 135 + i * 150), RED4 = [3, 7, 11];
  function locker(c, x, y, o) {
    const w = LKW - 12, h = LKH;
    c.fillStyle = o.col; c.fillRect(x - w / 2, y - h, w, h);
    c.fillStyle = o.dk; c.fillRect(x + w / 2 - 12, y - h, 12, h);
    c.strokeStyle = o.dk; c.lineWidth = 4; c.strokeRect(x - w / 2 + 9, y - h + 9, w - 30, h - 18);
    for (let i = 0; i < 4; i++) { rr(c, x - w * .3, y - h + 42 + i * 22, w * .52, 9, 4); fill(c, o.dk) }
    rr(c, x + w * .18, y - h * .52, 12, 54, 6); fill(c, '#d5dbe6');
    rr(c, x - 30, y - h + 150, 52, 26, 4); fill(c, '#eef2f8'); tx(c, String(o.n), x - 4, y - h + 163, { f: 'J', w: 700, s: 18, c: C.ink });
  }
  // подросток со спины: капюшон на голове (шов посередине), худи, рукава, рюкзак с лямками через плечи, джинсы, кеды — лица нет. (x, y) — между ступнями
  function teen(c, x, y, s, o) {
    c.save(); c.translate(x, y); c.scale(s, s);
    const hd = o.hood, dk = mixc(o.hood, '#000000', .28), lt = mixc(o.hood, '#ffffff', .12);
    c.fillStyle = o.legs; rr(c, -46, -200, 40, 186, 12); c.fill(); rr(c, 6, -200, 40, 186, 12); c.fill();
    rr(c, -56, -22, 54, 26, 12); fill(c, C.white); rr(c, 2, -22, 54, 26, 12); fill(c, C.white); c.fillStyle = '#c9ced8'; c.fillRect(-56, -2, 54, 6); c.fillRect(2, -2, 54, 6);
    for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * 98, -360); c.quadraticCurveTo(sx * 136, -330, sx * 132, -214); c.lineTo(sx * 104, -206); c.quadraticCurveTo(sx * 100, -300, sx * 86, -330); c.closePath(); fill(c, dk) }
    c.beginPath(); c.moveTo(-94, -196); c.lineTo(-104, -330); c.quadraticCurveTo(-100, -380, -48, -392); c.lineTo(48, -392); c.quadraticCurveTo(100, -380, 104, -330); c.lineTo(94, -196); c.closePath(); fill(c, hd);
    rr(c, -96, -216, 192, 26, 10); fill(c, dk);
    c.beginPath(); c.moveTo(-72, -384); c.bezierCurveTo(-92, -446, -70, -520, 0, -530); c.bezierCurveTo(70, -520, 92, -446, 72, -384); c.quadraticCurveTo(0, -362, -72, -384); c.closePath(); fill(c, hd);
    c.save(); c.clip(); c.fillStyle = dk; c.globalAlpha = .45; c.fillRect(8, -540, 90, 170); c.restore();
    c.strokeStyle = dk; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, -526); c.quadraticCurveTo(-4, -450, 0, -376); c.stroke();
    c.beginPath(); c.moveTo(-70, -386); c.quadraticCurveTo(0, -366, 70, -386); c.strokeStyle = lt; c.lineWidth = 4; c.stroke();
    const bg = o.bag, bd = mixc(o.bag, '#000000', .25);
    c.strokeStyle = bd; c.lineWidth = 15; c.lineCap = 'round';   // лямки: через плечи и под руки
    for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * 44, -360); c.quadraticCurveTo(sx * 64, -398, sx * 92, -392); c.stroke(); c.beginPath(); c.moveTo(sx * 56, -232); c.lineTo(sx * 92, -270); c.stroke() }
    rr(c, -64, -372, 128, 160, 26); fill(c, bg); rr(c, -64, -372, 128, 22, [26, 26, 0, 0]); fill(c, bd);
    rr(c, -46, -300, 92, 64, 16); fill(c, bd); c.strokeStyle = mixc(o.bag, '#ffffff', .5); c.lineWidth = 3; c.beginPath(); c.moveTo(-34, -292); c.lineTo(34, -292); c.stroke();
    c.restore();
  }
  const TEEN = [...Array(8)].map((_, i) => ({ x: 150 + i * 231 + (H1(i * 4.1) - .5) * 36, s: .8 + .12 * H1(i * 2.7), hood: ['#5b6b8c', '#8a8f9e', '#3d4fa0', '#7a5a86', '#4f6b5a', '#b8763a', '#55607a', '#3d5a80'][i],
    bag: ['#f2a33a', '#43d9b9', '#1b2340', '#cfe8ff', '#ffd36e', '#26305a', '#66c7f0', '#ece4d4'][i], legs: i % 3 ? '#2b3350' : '#3a4566', per: 2.1 + .7 * H1(i * 5.3), ph: H1(i * 8.1) }));
  const RED8 = [3, 7], TFY = 996;
  function kids(c, t) {
    TEEN.forEach((p, i) => {
      const ri = RED8.indexOf(i), kr = ri >= 0 ? eo(at(t, K.every4 + ri * .15, K.every4 + ri * .15 + .3)) : 0, jolt = kr > 0 && kr < 1 ? Math.sin(t * 60) * 5 : 0;
      teen(c, p.x + Math.sin(t * 1.3 + i * 1.7) * 3 + jolt, TFY, p.s, { hood: kr > 0 ? mixc(p.hood, C.red, kr) : p.hood, bag: p.bag, legs: kr > 0 ? mixc(p.legs, C.mred2, kr) : p.legs });
    });
    if (t < K.pull - .1 || t > K.third + .2) return;
    TEEN.forEach((p, i) => {   // пар идёт от каждого (выдох у головы, вверх); красные — часто и густо
      const ri = RED8.indexOf(i), t4 = K.every4 + ri * .15, red = ri >= 0 && t > t4, hx = p.x, hy = TFY - 500 * p.s, per = red ? .75 : p.per, n = red ? 3 : 1;
      for (let m = 0; m < n; m++) {
        const ph = (((t - K.pull) / per + p.ph + m / n) % 1 + 1) % 1, e = eo(ph); if (!red && ph > .72) continue;
        cloud(c, hx + (i % 2 ? 1 : -1) * 30 * e, hy - 10 - 200 * e, lp(.3, red ? 1.5 : 1.0, e) * (1 - ss(red ? .7 : .5, red ? 1 : .72, ph)), 1, i * 7 + m, C.white);
      }
      if (red) { const kd = eo(at(t, t4, t4 + .4)); for (let j = 0; j < 5; j++) cloud(c, hx + Math.cos(j * 1.3 + t * .7) * 90, hy + 30 + Math.sin(j * 1.9 + t * .6) * 50, 1.05 * kd, .9, 30 + i * 5 + j, C.white) }
    });
  }
  // маленький флаг США: 13 полос, 50 звёзд
  function miniFlag(c, x, y, w) {
    const h = w * .58, sh = h / 13;
    for (let i = 0; i < 13; i++) { c.fillStyle = i % 2 ? C.white : '#c8323f'; c.fillRect(x, y + i * sh, w, sh + .6) }
    const cw = w * .4, ch = sh * 7; c.fillStyle = '#1d3a7a'; c.fillRect(x, y, cw, ch);
    for (let r = 0; r < 9; r++) for (let j = 0; j < (r % 2 ? 5 : 6); j++) circ(c, x + cw * (2 * j + 1 + r % 2) / 12, y + ch * (r + 1) / 10, Math.max(1.2, w * .012), C.white);
  }
  // вывеска школы с флажком; текст — на языке ролика
  function schoolSign(c, x, y) {
    const s = tt('school'), o = { f: 'O', w: 700, s: 40, ls: 6, c: C.white }, w0 = tw(c, s, o), fw = 84, gap = 26, W = 60 + fw + gap + w0, H = 92;
    rr(c, x - W / 2 + 10, y - H / 2 + 12, W, H, 16); fill(c, 'rgba(20,25,53,.25)');
    rr(c, x - W / 2, y - H / 2, W, H, 16); fill(c, C.n1); rr(c, x - W / 2 + 8, y - H / 2 + 8, W - 16, H - 16, 11); stroke(c, C.gold, 3);
    miniFlag(c, x - W / 2 + 30, y - fw * .29, fw);
    tx(c, s, x - W / 2 + 30 + fw + gap + w0 / 2, y + 3, o);
  }
  function corridor(c, t) {
    c.fillStyle = '#ffe9b0'; c.fillRect(-300, -60, WW + 600, 1060);
    c.fillStyle = '#f2b84a'; c.fillRect(-300, 300, WW + 600, 16);
    for (let i = 0; i < 5; i++) { rr(c, 120 + i * 400, 28, 220, 24, 12); fill(c, C.white); c.save(); c.globalAlpha = .18; poly(c, [130 + i * 400, 52, 330 + i * 400, 52, 380 + i * 400, 300, 80 + i * 400, 300]); fill(c, C.white); c.restore() }
    schoolSign(c, 700, 196);   // v16.2: пробковой доски нет — вывеска школы с флажком США
    c.fillStyle = '#d9e2ef'; c.fillRect(-300, LKY, WW + 600, 700);
    for (let i = -3; i < 23; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) { c.fillStyle = '#c3cfe0'; c.fillRect(i * 100, LKY + 10 + j * 60, 100, 60) }
    c.fillStyle = '#9fb0c8'; c.fillRect(-300, LKY - 6, WW + 600, 14);
  }
  function shot11(c, t) {
    const ky = eio(at(t, K.kids - .3, K.kids + .25));
    c.fillStyle = mixc('#0b1650', '#ffe9b0', ky); c.fillRect(-200, -200, WW + 400, HH + 400);
    c.save(); c.translate(0, lp(1180, 0, ky));
    if (ky < 1) {   // мягкий пар: тот же снимок горла, спокойный
      c.save(); c.translate(0, -1180);
      xrRoom(c, t, 760, 540, .98, 'navy');
      const blobs = []; for (let i = 0; i < 4; i++) { const t0 = K.softv + .15 + i * .14, u = eio(at(t, t0, t0 + 1.1)) * (.7 + .05 * i); if (t >= t0) blobs.push([u, 30, 0, C.white]) }
      scan(c, t, 760, 540, .98, { calm: C.mint, blobs, glow: at(t, K.softv, K.softv + .5), patient: 'ПАЦИЕНТ · 16 ЛЕТ' });
      vignette(c, .55, '4,8,30');
      const kc = at(t, K.softv - .2, K.softv + .45); if (kc > 0 && kc < 1) cloud(c, lp(1500, 760, eio(kc)), lp(60, 120, eio(kc)), lp(1.4, .5, eio(kc)), 1, 4, C.white);
      check(c, 1230, 640, 70, at(t, K.burn, K.burn + .5));
      plate(c, 'НЕ ДЕРЁТ ГОРЛО', 1430, 800, spr(at(t, K.burn + .05, K.burn + .45)), { s: 48, bg: C.mint2, c: C.white, r: -.04 });
      c.restore();
    }
    corridor(c, t);
    LKX.forEach((x, i) => locker(c, x, LKY, { col: '#3d74b0', dk: '#2a5690', n: 201 + i }));   // v16.2: шкафчики синие, пар — от подростков
    kids(c, t);
    c.restore();
    // график «зависимость» над шкафчиками
    const kg = spr(at(t, K.hooked - .1, K.hooked + .3)) * (1 - eio(at(t, K.usa - .25, K.usa + .1)));
    if (kg > 0) {
      c.save(); c.translate(1420, 210); c.scale(kg, kg);   // v16.2: правее — слева вывеска школы
      rr(c, -330 + 12, -140 + 14, 660, 280, 26); fill(c, 'rgba(20,25,53,.22)'); rr(c, -330, -140, 660, 280, 26); fill(c, C.white);
      tx(c, 'ЗАВИСИМОСТЬ', -296, -100, { s: 30, ls: 3, c: C.ink, al: 'left' });
      c.strokeStyle = C.n2; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-290, -56); c.lineTo(-290, 110); c.lineTo(300, 110); c.stroke();
      const P = []; for (let i = 0; i <= 40; i++) { const u = i / 40; P.push(-270 + 520 * u, 100 - 180 * (Math.exp(3 * u) - 1) / (Math.exp(3) - 1)) }
      c.strokeStyle = C.red; c.lineWidth = 11; drawOn(c, P, at(t, K.hooked + .05, K.faster));
      const ka = spr(at(t, K.faster - .05, K.faster + .3)); if (ka > 0) { c.save(); c.translate(250, -80); c.rotate(-.9); c.scale(ka, ka); poly(c, [0, -34, 30, 18, -30, 18]); fill(c, C.red); c.restore() }
      c.restore();
    }
    plate(c, tt('every4'), 960, 84, spr(at(t, K.every4 + .1, K.every4 + .5)), { s: 44, bg: C.white, c: C.ink });
    const ki = eio(at(t, K.third - .1, K.third + .25)); if (ki > 0) circ(c, TEEN[7].x, 700, ki * 2300, C.nav);
  }

  // ================= 7. «Мальборо»: треть Juul за 12,8 млрд — круг с долей 35 % сразу, на «выкупил» — пачка и красная доля =================
  const PIE = { x: 1330, y: 430, r: 190 }, PIE1 = 1330, MP = { x: 620, y: 590 };
  const CHEV = [-150, -220, 150, -220, 150, 62, 0, -42, -150, 62];
  function marlboroPack(c, x, y, s, r, o = {}) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    packBox(c, 300, 440, { body: C.white, side: '#d5dbe6', top: '#eef1f6', stampC: '#e9d7a6' }, c => {
      if (o.roof !== false) { poly(c, CHEV); fill(c, '#e0233c') }
      c.beginPath(); c.moveTo(-26, 0); c.lineTo(26, 0); c.lineTo(22, 30); c.quadraticCurveTo(0, 54, -22, 30); c.closePath(); fill(c, '#e0233c');
      tx(c, 'Marlboro', 0, 112, { f: '"Liberation Serif"', w: 700, s: 68, c: C.ink, a: o.nm ?? 1 });
      tx(c, 'FILTER CIGARETTES', 0, 168, { f: 'O', w: 500, s: 19, ls: 3, c: C.ink });
    });
    c.restore();
  }
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
  let MA = null, MB = null;
  function morphPts() {
    if (MA) return;
    MA = resample(CHEV.map((v, i) => v + (i % 2 ? MP.y : MP.x)), 120);
    const W = [PIE1, PIE.y]; for (let i = 0; i <= 40; i++) { const a = -Math.PI / 2 + .35 * TAU * i / 40; W.push(PIE1 + Math.cos(a) * PIE.r, PIE.y + Math.sin(a) * PIE.r) }
    const B = resample(W, 120), ca = cen(MA), cb = cen(B);
    let best = 0, bd = Infinity;
    for (let s = 0; s < 120; s++) { let d = 0; for (let i = 0; i < 120; i++) { const b = B[(i + s) % 120]; d += (MA[i][0] - ca[0] - b[0] + cb[0]) ** 2 + (MA[i][1] - ca[1] - b[1] + cb[1]) ** 2 } if (d < bd) { bd = d; best = s } }
    MB = B.map((_, i) => B[(i + best) % 120]);
  }
  // v16.2: приглушённый биржевой фон — свечи, линия цены с заливкой, пунктирные уровни, бегущая лента котировок
  const CND = [...Array(30)].map((_, i) => { const base = 820 - i * 15 - 70 * Math.sin(i * .7), o = base + (H1(i * 3.1) - .5) * 60, cl2 = base + (H1(i * 5.7) - .6) * 70; return { x: 40 + i * 64, o, c: cl2, hi: Math.min(o, cl2) - 20 - 30 * H1(i * 2.2), lo: Math.max(o, cl2) + 20 + 30 * H1(i * 4.4) } });
  function finChart(c, t) {
    c.save(); c.globalAlpha = .78;
    for (const y of [300, 520, 740]) { c.save(); c.setLineDash([10, 12]); c.strokeStyle = '#34407a'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, y); c.lineTo(WW, y); c.stroke(); c.restore(); tx(c, (12.8 + (540 - y) / 120).toFixed(1).replace('.', ','), WW - 20, y - 16, { f: 'J', w: 500, s: 18, c: '#4a5894', al: 'right' }) }
    const P = []; CND.forEach(k => P.push(k.x, (k.o + k.c) / 2));
    c.beginPath(); c.moveTo(P[0], HH + 100); for (let i = 0; i < P.length; i += 2) c.lineTo(P[i], P[i + 1]); c.lineTo(P[P.length - 2], HH + 100); c.closePath(); c.fillStyle = 'rgba(46,58,112,.6)'; c.fill();
    c.strokeStyle = '#46559a'; c.lineWidth = 6; c.lineJoin = 'round'; c.beginPath(); for (let i = 0; i < P.length; i += 2) i ? c.lineTo(P[i], P[i + 1]) : c.moveTo(P[i], P[i + 1]); c.stroke();
    for (const k of CND) { const up = k.c < k.o; c.strokeStyle = up ? '#3a8580' : '#9a3550'; c.lineWidth = 3; c.beginPath(); c.moveTo(k.x, k.hi); c.lineTo(k.x, k.lo); c.stroke(); c.fillStyle = up ? '#3a8580' : '#9a3550'; c.fillRect(k.x - 14, Math.min(k.o, k.c), 28, Math.max(6, Math.abs(k.o - k.c))) }
    c.restore();
    const tk = 'MO ▲ 2,4 %   JUUL ▲ 12,8   PM ▼ 0,7 %   BTI ▲ 1,1 %   ';
    c.save(); c.globalAlpha = .6; c.fillStyle = '#0d1222'; c.fillRect(-200, 1000, WW + 400, 44); const w0 = tw(c, tk, { f: 'J', w: 700, s: 20 }), off = -((t * 60) % w0);
    for (let x = off; x < WW; x += w0) tx(c, tk, x, 1022, { f: 'J', w: 700, s: 20, c: '#5a6aa8', al: 'left' }); c.restore();
  }
  function wedgePath(c, k = 1) { c.beginPath(); c.moveTo(PIE.x, PIE.y); c.arc(PIE.x, PIE.y, PIE.r, -Math.PI / 2, -Math.PI / 2 + .35 * TAU * k); c.closePath() }
  function scene12(c, t) {   // в координатах кадра (камера — снаружи)
    PIE.x = lp(960, 1330, eio(at(t, K.bought - .3, K.bought + .15)));
    c.save(); c.globalAlpha = .55; c.strokeStyle = C.nav2; c.lineWidth = 2; c.beginPath(); for (let x = 0; x <= WW; x += 80) { c.moveTo(x, -200); c.lineTo(x, HH + 200) } for (let y = 0; y <= HH; y += 80) { c.moveTo(-200, y); c.lineTo(WW + 200, y) } c.stroke(); c.restore();
    finChart(c, t);
    const off = (1 - eo(at(t, K.third + .1, K.third + .6))) * 1000, ux = .856, uy = -.517, nx = .517, ny = .856, bw = 200, L = 1900, ox = 960 + nx * off, oy = 540 + ny * off;
    poly(c, [ox - ux * L - nx * bw, oy - uy * L - ny * bw, ox + ux * L - nx * bw, oy + uy * L - ny * bw, ox + ux * L + nx * bw, oy + uy * L + ny * bw, ox - ux * L + nx * bw, oy - uy * L + ny * bw]); fill(c, C.nav2);
    const kp = spr(at(t, K.third + .05, K.third + .45)); circ(c, PIE.x, PIE.y, PIE.r * kp, C.white);
    const kr = eio(at(t, K.third + .2, K.third + .8)); if (kr > 0) { c.beginPath(); c.arc(PIE.x, PIE.y, PIE.r + 30, -Math.PI / 2, -Math.PI / 2 + TAU * kr); stroke(c, C.white, 5) }
    const kw = at(t, K.third + .35, K.third + .7), kfill = eio(at(t, K.bought - .05, K.bought + .45));
    if (kw > 0) { c.save(); wedgePath(c, eio(kw)); c.globalAlpha = .55; fill(c, C.mk); c.globalAlpha = 1; c.setLineDash([16, 12]); stroke(c, C.ink, 5); c.restore() }
    if (kfill > 0) { wedgePath(c, kfill); fill(c, '#e0233c') }
    tx(c, 'JUUL', PIE.x - 60, PIE.y + 70, { f: 'U', w: 800, s: 56, ls: 3, c: C.ink, a: at(t, K.company - .05, K.company + .3) * kp });
    const kd = eo(at(t, K.company, K.company + .3)); tx(c, 'ДОЛЯ В JUUL', PIE.x, 692 + (1 - kd) * 30, { s: 38, ls: 6, c: C.white, a: kd });
    const kb = eo(at(t, K.b13 - .05, K.b13 + .25)); if (kb > 0) num(c, '$' + (12.8 * eo(at(t, K.b13, K.dollars + .1))).toFixed(1).replace('.', ',') + ' МЛРД', PIE.x, 792 + (1 - kb) * 40, { s: 96, c: C.white, a: kb });
    const kk = at(t, K.bought - .12, K.bought + .45), ps = kk > 0 ? lp(1.9, 1.05, spr(kk)) : 0;
    marlboroPack(c, MP.x, MP.y, ps, lp(-.2, -.04, eo(kk)));
    plate(c, 'ПРОИЗВОДИТЕЛЬ «МАЛЬБОРО» · 2018', 960, 885, spr(at(t, K.bought + .35, K.bought + .75)), { s: 32, bg: C.white, c: C.ink });
    const k35 = spr(at(t, K.third + .5, K.third + .85)); if (k35 > 0) { c.save(); c.translate(PIE.x + 96, PIE.y - 50); c.scale(k35, k35); tx(c, '35 %', 0, 0, { s: 76, c: mixc(C.ink, C.white, kfill) }); c.restore() }
    const km2 = spr(at(t, K.bought + .2, K.bought + .6)); if (km2 > 0) { c.save(); c.translate(960, 128 - 40 * (1 - Math.min(1, km2))); c.scale(km2, km2); tx(c, 'MARLBORO', 0, 0, { f: '"Liberation Serif"', w: 700, s: 112, ls: 10, c: C.white }); c.restore() }   // v16.2: заголовок над сделкой
  }
  // буквы «Marlboro» слетают с пачки и встают заголовком наверху
  function marlTitle(c, t) {
    const kt = at(t, K.marl - .05, K.marl + .75); if (kt <= 0) return;
    const word = 'Marlboro', fs0 = 68 * 1.05, fs1 = 120, f = '"Liberation Serif"';
    const w0 = tw(c, word, { f, w: 700, s: fs0 }), w1 = tw(c, word, { f, w: 700, s: fs1 });
    let a0 = MP.x - w0 / 2, a1 = 960 - w1 / 2; const y0 = MP.y + 112 * 1.05, y1 = 150;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i], c0 = tw(c, ch, { f, w: 700, s: fs0 }), c1 = tw(c, ch, { f, w: 700, s: fs1 });
      const k = eio(at(kt, i * .05, i * .05 + .6)), x = lp(a0 + c0 / 2, a1 + c1 / 2, k), y = lp(y0, y1, k) - Math.sin(Math.PI * k) * 120;
      tx(c, ch, x, y, { f, w: 700, s: lp(fs0, fs1, k), c: k > .45 ? C.white : C.ink });
      a0 += c0; a1 += c1;
    }
  }
  function shot12(c, t) { c.fillStyle = C.nav; c.fillRect(-200, -200, WW + 400, HH + 400); scene12(c, t) }

  // ================= 8. «план сработал»: меморандум со штампом → «Признайтесь… затянуться?» → затемнение к красному диоду =================
  const NV = 2960;
  function cam13(t) {
    let x = lp(960, NV, eio(at(t, K.planPan, K.planPan + .6))), y = 540, s = 1;
    const kv = eio(at(t, K.adm + .3, K.dragE)); s = lp(1, 1.6, kv); y = lp(540, 590, kv);   // v16.2: медленный наезд (сильнее — индикатор уходит под субтитры)
    const kp = eo(at(t, K.drag - .02, K.drag + .15)); s += .06 * kp;
    const u = at(t, K.drag, K.drag + .5); if (u > 0 && u < 1) { x += Math.sin(u * 50) * 8 * (1 - u); y += Math.cos(u * 43) * 6 * (1 - u) }
    return { s, x, y };
  }
  const SL2 = y => 1960 + (540 - y) * .18;
  // v16.2: тёмная комната — стена, окно с ночным городом в расфокусе (рама, переплёт, подоконник, штора)
  const WIN = { x: NV - 760, y: 110, w: 860, h: 640 };
  function nightCity(g, w, h) {
    const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, '#060a1e'); sk.addColorStop(1, '#1d2458'); g.fillStyle = sk; g.fillRect(0, 0, w, h);
    for (const [n, base, hmin, hmax, col, wa] of [[18, h * .9, 140, 300, '#141a44', .5], [11, h * 1.02, 220, 420, '#0b0f2c', .9]]) for (let i = 0; i < n; i++) {
      const bw = w / n * (1.1 + .5 * H1(i * 3.3 + n)), bx = i * w / n - 20 + 20 * H1(i * 7 + n), bh = lp(hmin, hmax, H1(i * 5.1 + n)); g.fillStyle = col; g.fillRect(bx, base - bh, bw, bh + 200);
      for (let p = 0; p < bw / 22 - 1; p++) for (let q = 0; q < bh / 26 - 1; q++) { const r = H1(i * 41 + p * 7.3 + q * 13.1 + n); if (r > .42) continue; g.globalAlpha = wa; g.fillStyle = r < .06 ? '#ff6fa3' : r < .12 ? '#7fd3ff' : '#ffc46a'; g.fillRect(bx + 8 + p * 22, base - bh + 12 + q * 26, 10, 13) }
      g.globalAlpha = 1;
    }
  }
  function nightRoom(c, t) {
    c.fillStyle = '#0c0e1f'; c.fillRect(NV - 2400, -600, 4800, 2400);
    c.fillStyle = 'rgba(255,255,255,.025)'; for (let x = NV - 2400; x < NV + 2400; x += 90) c.fillRect(x, -600, 44, 2400);
    const W = WIN; c.save(); rr(c, W.x, W.y, W.w, W.h, 6); c.clip(); c.drawImage(blurLayer('night', W.w, W.h, 7, g => nightCity(g, W.w, W.h)), W.x, W.y); c.restore();
    c.fillStyle = '#05060f'; c.fillRect(W.x - 26, W.y - 26, W.w + 52, 26); c.fillRect(W.x - 26, W.y + W.h, W.w + 52, 34); c.fillRect(W.x - 26, W.y, 26, W.h); c.fillRect(W.x + W.w, W.y, 26, W.h);
    c.fillRect(W.x + W.w / 2 - 11, W.y, 22, W.h); c.fillRect(W.x, W.y + W.h * .45 - 11, W.w, 22);
    c.fillStyle = '#16192f'; c.fillRect(W.x - 60, W.y + W.h + 24, W.w + 120, 22);
    c.fillStyle = '#1a0a14'; c.beginPath(); c.moveTo(W.x - 120, W.y - 60); c.lineTo(W.x + 70, W.y - 60); c.bezierCurveTo(W.x + 40, W.y + 260, W.x + 110, W.y + 520, W.x + 40, W.y + W.h + 140); c.lineTo(W.x - 120, W.y + W.h + 140); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.04)'; c.lineWidth = 6; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(W.x - 90 + i * 40, W.y - 50); c.quadraticCurveTo(W.x - 60 + i * 40, W.y + 300, W.x - 80 + i * 40, W.y + W.h + 130); c.stroke() }
  }
  function vapePose(t) {
    const ki = spr(at(t, K.adm - .1, K.adm + .55));
    return { x: lp(NV + 1300, NV, ki), y: 640, r: lp(.25, -.06, eo(at(t, K.adm - .1, K.adm + .65))), s: .76, on: ki > 0 };
  }
  function shot13(c, t) {
    const Q = cam13(t);
    c.fillStyle = C.nav; c.fillRect(-200, -200, WW + 400, HH + 400);
    c.save(); cam(c, Q.s, Q.x, Q.y);
    if (t < K.planPan + .7) { c.save(); scene12(c, t); c.restore() }
    c.save(); c.beginPath(); c.moveTo(SL2(-2000), -2000); c.lineTo(9000, -2000); c.lineTo(9000, 3000); c.lineTo(SL2(3000), 3000); c.closePath(); c.clip(); nightRoom(c, t); c.restore();
    // свет гаснет к «Признайтесь», на «затянуться?» комната — в красном
    const kd = eo(at(t, K.adm, K.adm + 1.2)), kr = eo(at(t, K.drag, K.drag + .25));
    if (kd > 0) { c.save(); c.globalAlpha = .5 * kd; c.fillStyle = '#000'; c.fillRect(-9000, -9000, 30000, 30000); c.globalAlpha = .38 * kr; c.fillStyle = '#5a0a18'; c.fillRect(-9000, -9000, 30000, 30000); c.restore() }
    // меморандум 1973 — «план выполнен» (штамп ниже цитаты)
    const km = spr(at(t, K.plan - .1, K.plan + .4)), ko = eio(at(t, K.adm - .5, K.adm - .05));
    if (km > 0 && ko < 1) memoAt(c, t, { x: lp(NV, NV - 1200, ko), y: lp(1600, 540, km) - ko * 120, r: lp(.3, -.04, eo(at(t, K.plan - .1, K.plan + .45))) - ko * .5, s: .95 }, { full: 1, done: at(t, K.worked, K.worked + .26) });
    const V = vapePose(t); let lx = V.x, ly = V.y, mpx = V.x, mpy = V.y;
    if (V.on) {
      const led = Math.max(pulse(t, K.want), pulse(t, K.want + .8), ss(K.drag - .1, K.drag, t));
      const fl = eo(at(t, K.adm, K.adm + 1)) * Math.sin(t * 2.4) * 14 * (1 - .7 * eio(at(t, K.adm + .3, K.dragE)));
      // v16.2: мягкое неоновое свечение вейпа и индикатора в темноте
      const ledC = mixc(C.mint, '#ff1f3a', at(t, K.drag - .06, K.drag + .12)), [ga, gb] = rot(0, 250 * V.s, V.r);
      const gw = c.createRadialGradient(V.x, V.y + fl, 40, V.x, V.y + fl, 420); gw.addColorStop(0, 'rgba(232,71,90,.3)'); gw.addColorStop(1, 'rgba(232,71,90,0)'); c.fillStyle = gw; c.fillRect(V.x - 460, V.y + fl - 460, 920, 920);
      c.save(); c.translate(V.x, V.y + fl); c.rotate(V.r + fl * .002); c.scale(V.s, V.s);
      vapeBody(c, { ...HERO, t, led: ss(K.want - .12, K.want + .08, t), ledC });   // индикатор горит с «захотелось», краснеет на «затянуться?»
      c.restore();
      const lg = ss(K.want - .12, K.want + .08, t); if (lg > 0) { const lx2 = V.x + ga, ly2 = V.y + fl + gb, gl = c.createRadialGradient(lx2, ly2, 4, lx2, ly2, 130); gl.addColorStop(0, ledC.replace('rgb', 'rgba').replace(')', `,${.6 * lg})`)); gl.addColorStop(1, ledC.replace('rgb', 'rgba').replace(')', ',0)')); c.fillStyle = gl; c.fillRect(lx2 - 140, ly2 - 140, 280, 280) }
      const [px, py] = (() => { const [a, b] = rot(0, -470 * V.s, V.r); return [V.x + a, V.y + b] })(); mpx = px; mpy = py + fl;
      puff(c, t, K.want + .1, px, py, 1, .9);
      const [a2, b2] = rot(0, 250 * V.s, V.r); lx = V.x + a2; ly = V.y + fl + b2;
    }
    c.restore();
    vignette(c, .78);
    {   // v16.2: облако пара катится в камеру и закрывает экран → чёрное (удар музыки)
      const kc = at(t, K.dragE - .3, K.dragE + .75), sx = 960 + Q.s * (mpx - Q.x), sy = 540 + Q.s * (mpy - Q.y);
      if (kc > 0) {
        const e = ei(kc), d = eo(kc);
        for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + .4; cloud(c, sx + Math.cos(a) * lp(20, 520, d) * (i ? 1 : 0), sy + 260 * d + Math.sin(a) * lp(14, 360, d) * (i ? 1 : 0), lp(.9, 11, eio(kc)) * (.8 + .4 * H1(i * 3.1)), 1, i * 9, i % 3 ? '#f4eef0' : '#e3d9dd') }
        const kw = ss(.62, .95, kc); if (kw > 0) { c.save(); c.globalAlpha = kw; c.fillStyle = '#f4eef0'; c.fillRect(-400, -400, WW + 800, HH + 800); c.restore() }
      }
      const kb = at(t, K.dragE + .85, K.dragE + 1.25); if (kb > 0) { c.save(); c.globalAlpha = kb; c.fillStyle = '#000'; c.fillRect(-400, -400, WW + 800, HH + 800); c.restore() }
      return;
    }
    // затемнение: чёрное кольцо сжимается к красному диоду
    const ki = eio(at(t, K.dragE + .45, K.dragE + 1.3));
    if (ki > 0) {
      const sx = 960 + Q.s * (lx - Q.x), sy = 540 + Q.s * (ly - Q.y), R = lp(2300, 0, ki);
      c.save(); c.fillStyle = '#000'; c.beginPath(); c.rect(-400, -400, WW + 800, HH + 800); if (R > .5) c.arc(sx, sy, R, 0, TAU); c.fill('evenodd'); c.restore();
      if (R > .5 && R < 90) circ(c, sx, sy, Math.min(R, 18), C.red);
    }
  }

  // ================= 9. доска: «Мальборо» дальше — на YouTube =================
  let CORK = null;
  function corkImg() {
    if (CORK) return CORK; CORK = mk(WW, HH); const c = CORK.getContext('2d');
    c.fillStyle = '#c98b52'; c.fillRect(0, 0, WW, HH);
    for (let i = 0; i < 1600; i++) { c.fillStyle = H1(i * 1.7) > .5 ? '#b5773f' : '#d99a62'; c.beginPath(); c.arc(H1(i * 3.7) * WW, H1(i * 9.1) * HH, 2 + 4 * H1(i * 1.3), 0, TAU); c.fill() }
    c.fillStyle = '#2b170b'; c.fillRect(0, 0, WW, 92); c.fillRect(0, HH - 92, WW, 92); c.fillRect(0, 0, 92, HH); c.fillRect(WW - 92, 0, 92, HH);   // v16.2: тёмная деревянная рамка
    c.strokeStyle = '#3d2412'; c.lineWidth = 4; for (let i = 0; i < 14; i++) { const y = 10 + i * 6; c.beginPath(); c.moveTo(0, y); c.lineTo(WW, y + 2 * Math.sin(i)); c.stroke(); c.beginPath(); c.moveTo(0, HH - y); c.lineTo(WW, HH - y - 2 * Math.sin(i)); c.stroke() }
    c.strokeStyle = '#140a04'; c.lineWidth = 8; c.strokeRect(88, 88, WW - 176, HH - 176); c.strokeStyle = '#5a3a1e'; c.lineWidth = 3; c.strokeRect(80, 80, WW - 160, HH - 160);
    return CORK;
  }
  function card(c, x, y, w, h, r, k, draw, lf = 0, dm = 0) {
    if (k <= 0) return; const s = spr(k) * (1 + .07 * lf);
    c.save(); c.translate(x, y - h / 2 + 24 - 22 * lf); c.rotate(r * (1 - .6 * lf) + .035 * Math.sin(X.__t * 1.6 + x * .01)); c.translate(0, h / 2 - 24); c.scale(s, s);
    c.fillStyle = `rgba(60,30,8,${.3 + .14 * lf})`; c.fillRect(-w / 2 + 12 + 14 * lf, -h / 2 + 16 + 20 * lf, w, h);
    c.fillStyle = C.white; c.fillRect(-w / 2, -h / 2, w, h);
    draw(c);
    if (dm > 0) { c.fillStyle = `rgba(52,28,10,${.42 * dm})`; c.fillRect(-w / 2, -h / 2, w, h) }
    circ(c, 0, -h / 2 + 24, 17, C.red); circ(c, -5, -h / 2 + 19, 6, C.red3);
    c.restore();
  }
  const CARDS = [{ x: 400, y: 400, r: -.05 }, { x: 960, y: 380, r: .03 }, { x: 1520, y: 400, r: -.03 }];
  // ковбойская шляпа: поля загнуты вверх по бокам, тулья с вмятинами, лента
  function hat(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.beginPath(); c.moveTo(-200, -30); c.quadraticCurveTo(-170, 40, 0, 46); c.quadraticCurveTo(170, 40, 200, -30); c.quadraticCurveTo(150, 4, 110, 8); c.lineTo(-110, 8); c.quadraticCurveTo(-150, 4, -200, -30); c.closePath(); fill(c, '#7a4f22');
    c.beginPath(); c.moveTo(-104, 10); c.bezierCurveTo(-112, -70, -96, -120, -58, -118); c.quadraticCurveTo(-26, -96, 0, -116); c.quadraticCurveTo(26, -96, 58, -118); c.bezierCurveTo(96, -120, 112, -70, 104, 10); c.closePath(); fill(c, '#8a5a2a');
    c.save(); c.clip(); c.fillStyle = '#6b4520'; c.fillRect(30, -130, 100, 150); c.restore();
    c.strokeStyle = '#5e3c18'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, -112); c.quadraticCurveTo(4, -70, 0, -40); c.stroke();
    c.fillStyle = '#3b240e'; c.beginPath(); c.moveTo(-106, -12); c.lineTo(106, -12); c.lineTo(104, 10); c.lineTo(-104, 10); c.closePath(); c.fill();
    c.restore();
  }
  function leaf(c, x, y, s, r) {
    c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
    leafPath(c, -170, 0, 340, 130); fill(c, '#6aa84f'); c.save(); c.clip(); c.fillStyle = '#4f8a3a'; c.fillRect(-180, 0, 360, 140); c.restore();
    c.strokeStyle = '#d9e8b0'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(-200, 0); c.lineTo(150, 0); c.stroke();
    for (let i = 0; i < 5; i++) { const x0 = -110 + i * 52; c.beginPath(); c.moveTo(x0, 0); c.lineTo(x0 + 40, -54 + i * 8); c.moveTo(x0, 0); c.lineTo(x0 + 40, 54 - i * 8); c.stroke() }
    c.restore();
  }
  // ================= концовка (отдельный файл): доска с темами → «Так… о чём это я? А, точно!» → вжух к первому кадру ролика =================
  // VAR 'lens' — вместо указки лупа (в стекле — доска крупнее); VAR 'brain' — Мистер Мозг: тёмные очки без глаз, луч-указка из очков, без рук
  function board(c, t, nc) {
    if (!nc) { c.fillStyle = '#1c0f07'; c.fillRect(-400, -400, WW + 800, HH + 800); c.drawImage(corkImg(), 0, 0, WW, HH) }
    const [c1, c2, c3] = CARDS, AA = VAR === 'A';
    // v16.2 (концовка A): карточка, про которую говорят, приподнимается — остальные тускнеют
    const LW = [[K.c1 + .3, K.drug - .2], [K.drug - .15, K.soak - .2], [K.soak - .15, K.watch - .1]];
    const LF = i => AA ? eio(at(t, LW[i][0], LW[i][0] + .3)) * (1 - eio(at(t, LW[i][1], LW[i][1] + .3))) : 0, L0 = Math.max(LF(0), LF(1), LF(2)), DM = i => cl(L0 - LF(i));
    c.save(); c.strokeStyle = C.red; c.lineWidth = 6; c.lineCap = 'round';
    drawOn(c, [c1.x, c1.y - 226, (c1.x + c2.x) / 2, c1.y - 150, c2.x, c2.y - 216], at(t, K.lady + .3, K.drug));
    drawOn(c, [c2.x, c2.y - 216, (c2.x + c3.x) / 2, c2.y - 140, c3.x, c3.y - 226], at(t, K.drug + .5, K.soak + .1)); c.restore();
    card(c, c1.x, c1.y, 440, 520, c1.r, at(t, K.c1, K.c1 + .45), c => {
      marlboroPack(c, -70, -30, .55, -.06);
      cig(c, 90, 30, 250, 46, -1.2, { filter: '#e0233c', dots: '#b01a2e' });
      const kl = at(t, K.lady, K.lady + .3); if (kl > 0) { c.save(); c.globalAlpha = kl; c.translate(120, 110); c.rotate(-.3); c.beginPath(); c.ellipse(-12, 0, 16, 8, .3, 0, TAU); c.ellipse(12, 0, 16, 8, -.3, 0, TAU); fill(c, '#e0233c'); c.restore() }
      tx(c, '1924 · ДАМСКИЕ', 0, 200, { s: 36, ls: 2, c: C.ink, a: AA ? 1 : at(t, K.lady - .1, K.lady + .3) });
    }, LF(0), DM(0));
    card(c, c2.x, c2.y, 440, 500, c2.r, at(t, K.drug - .15, K.drug + .3), c => { hat(c, 0, -10, 1); tx(c, '1954 · КОВБОЙ', 0, 180, { s: 36, ls: 2, c: C.ink }) }, LF(1), DM(1));
    card(c, c3.x, c3.y, 440, 520, c3.r, at(t, K.soak - .15, K.soak + .3), c => {
      leaf(c, 0, 50, .95, -.25);
      c.save(); c.translate(70, -110); c.rotate(.5); rr(c, -14, -40, 28, 120, 10); fill(c, '#dce9ff'); rr(c, -14, -40, 28, 120, 10); stroke(c, C.n2, 4); rr(c, -22, -100, 44, 64, 20); fill(c, C.n0); c.restore();
      for (let i = 0; i < 3; i++) { const ph = ((t - K.soak) * 1.4 + i / 3) % 1; if (t > K.soak) circ(c, 20, -40 + ph * 120, 9 * (1 - ph * .4), C.am) }
      tx(c, '?', -110, -120, { s: 150, c: C.red, a: at(t, K.tabak, K.tabak + .3) });
      tx(c, 'ЧЕМ ПРОПИТЫВАЮТ?', 0, 200, { s: 32, ls: 2, c: C.ink });
    }, LF(2), DM(2));
    plate(c, 'ПОЛНОЕ РАССЛЕДОВАНИЕ', 840, 790, spr(at(t, K.watch, K.watch + .4)), { s: 54, bg: C.white, c: C.ink, ls: 4 });
    const ky = spr(at(t, K.yt - .1, K.yt + .3));
    if (ky > 0) { c.save(); c.translate(1420, 790); const pu = ky * (1 + .07 * Math.max(0, Math.sin(t * 7))); c.scale(pu, pu); rr(c, -96 + 8, -66 + 10, 192, 132, 36); fill(c, 'rgba(60,30,8,.3)'); rr(c, -96, -66, 192, 132, 36); fill(c, '#ff1f2d'); poly(c, [-26, -36, 42, 0, -26, 36]); fill(c, C.white); c.restore() }
    const kl2 = spr(at(t, K.link - .05, K.link + .35));
    plate(c, 'ССЫЛКА В ПРОФИЛЕ', 900, 930, kl2, { s: 44, bg: C.red, c: C.white, ls: 4 });
    if (kl2 > 0) { const b = Math.sin(t * 9) * 10; c.save(); c.translate(1260, 920 + b); c.scale(kl2, kl2); poly(c, [0, -60, 40, -10, 14, -10, 14, 50, -14, 50, -14, -10, -40, -10]); fill(c, C.white); c.restore() }
  }
  // куда «смотрит» указка: середина → карточка 1 → 2 → 3 → YouTube → середина («о чём это я?»)
  function pointAt(t) {
    const P = [[960, 560, -9], [CARDS[0].x, CARDS[0].y - 20, K.lady - .1], [CARDS[1].x, CARDS[1].y - 20, K.drug - .1], [CARDS[2].x, CARDS[2].y - 20, K.soak - .1], [1420, 790, K.yt - .1], [960, 520, K.q1 - .1]];
    let x = P[0][0], y = P[0][1];
    for (let i = 1; i < P.length; i++) { const k = eio(at(t, P[i][2] - .45, P[i][2])); x = lp(x, P[i][0], k); y = lp(y, P[i][1], k) }
    return [x + Math.sin(t * 2.1) * 10, y + Math.cos(t * 1.7) * 8];
  }
  function qMark(c, t, x, y, s) {   // «?» на «о чём это я», «!» на «А, точно»
    const k1 = spr(at(t, K.q1, K.q1 + .35)) * (1 - at(t, K.q2 - .1, K.q2)), k2 = spr(at(t, K.q2, K.q2 + .3));
    if (k1 > 0) { c.save(); c.translate(x, y); c.rotate(Math.sin(t * 6) * .18); c.scale(k1 * s, k1 * s); tx(c, '?', 0, 8, { s: 200, c: C.red }); c.restore() }
    if (k2 > 0) { c.save(); c.translate(x, y); c.scale(k2 * s, k2 * s); tx(c, '!', 0, 8, { s: 220, c: C.red }); c.restore() }
  }
  function lens(c, t, x, y, R) {
    c.save(); c.beginPath(); c.arc(x, y, R, 0, TAU); c.clip();
    c.translate(x, y); c.scale(1.7, 1.7); c.translate(-x, -y); board(c, t);
    c.restore();
    c.save(); c.globalAlpha = .22; c.beginPath(); c.arc(x - R * .3, y - R * .35, R * .45, Math.PI * 1.1, Math.PI * 1.65); c.lineWidth = 16; c.strokeStyle = C.white; c.stroke(); c.restore();
    c.beginPath(); c.arc(x, y, R, 0, TAU); stroke(c, '#2b2f3a', 26); c.beginPath(); c.arc(x, y, R + 13, 0, TAU); stroke(c, '#5b6276', 6);
    c.save(); c.translate(x, y); c.rotate(.8); rr(c, R + 4, -22, 230, 44, 18); fill(c, '#3a2a1c'); rr(c, R + 4, -22, 50, 44, 10); fill(c, '#2b2f3a'); c.restore();
  }
  // Мистер Мозг: розовый мозг, шляпа сыщика, тёмные очки без глаз, бабочка; без рук
  const BRP = [-160, 20, -168, -40, -146, -92, -100, -126, -40, -144, 24, -146, 84, -132, 130, -102, 160, -58, 170, -10, 160, 30, 134, 56, 150, 76, 138, 104, 104, 112, 74, 98, 52, 84, 18, 98, -20, 100, -64, 92, -108, 72, -144, 52];
  const BRS = [[-120, -40, -90, -70, -60, -50, -30, -30, 0, -60], [-40, 40, 0, 10, 40, 30, 80, 50, 110, 20], [20, -110, 40, -80, 70, -100, 100, -70, 130, -40], [-130, 10, -100, 30, -70, 10], [60, -20, 90, -10, 120, 0]];
  const GLS = [-104, -22];   // левое стекло — отсюда луч
  function mrBrain(c, t, x, y, s, tilt) {
    c.save(); c.translate(x, y); c.rotate(tilt); c.scale(s, s);
    rr(c, 30, 70, 46, 80, 18); fill(c, '#e88fb0');
    poly(c, [20, 150, 60, 170, 20, 190]); fill(c, C.red); poly(c, [100, 150, 60, 170, 100, 190]); fill(c, C.red); circ(c, 60, 170, 10, C.red2);
    spline(c, BRP); fill(c, '#f4a6c0');
    c.save(); spline(c, BRP); c.clip(); c.fillStyle = '#e88fb0'; c.beginPath(); c.ellipse(60, 80, 200, 90, -.2, 0, TAU); c.fill(); c.restore();
    c.strokeStyle = '#c95e86'; c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round';
    for (const P of BRS) { c.beginPath(); c.moveTo(P[0], P[1]); for (let i = 2; i < P.length; i += 4) c.quadraticCurveTo(P[i], P[i + 1], P[i + 2], P[i + 3]); c.stroke() }
    spline(c, BRP); stroke(c, '#b9527a', 6);
    c.save(); c.translate(-10, -128); c.rotate(-.12);
    c.beginPath(); c.ellipse(0, 6, 120, 18, 0, 0, TAU); fill(c, '#3b3f55');
    poly(c, [-74, 4, -62, -70, 0, -86, 62, -70, 74, 4]); fill(c, '#4a4f6a'); c.fillStyle = C.red; c.fillRect(-72, -18, 144, 16);
    c.restore();
    for (const [gx, gy] of [GLS, [-42, -30]]) { circ(c, gx, gy, 32, '#141a35'); c.beginPath(); c.arc(gx, gy, 32, 0, TAU); stroke(c, '#0b0f24', 6); c.save(); c.globalAlpha = .7; c.beginPath(); c.arc(gx - 8, gy - 8, 16, Math.PI * 1.1, Math.PI * 1.6); c.strokeStyle = C.white; c.lineWidth = 5; c.stroke(); c.restore() }
    c.strokeStyle = '#0b0f24'; c.lineWidth = 6; c.beginPath(); c.moveTo(-74, -27); c.lineTo(-72, -27); c.moveTo(-10, -32); c.lineTo(60, -44); c.stroke();
    c.restore();
  }
  const BTS = .85, BTX = -190, BRT = (x, y) => [(x - 960) * BTS + 960 + BTX, (y - 540) * BTS + 540];   // доска в варианте с мозгом
  function brainScene(c, t) {
    const kin = spr(at(t, K.s0 + .3, K.s0 + .9)), x = 1660, y = 760 + (1 - kin) * 600 - Math.abs(Math.sin(t * 2.6)) * 10 - 40 * spr(at(t, K.q2, K.q2 + .3)) * (1 - at(t, K.q2 + .3, K.q2 + .6));
    const tilt = at(t, K.q1, K.q2) > 0 && t < K.q2 ? Math.sin((t - K.q1) * 7) * .18 : -.06, s = .95 * kin;
    if (s <= 0) return;
    // луч-указка из очков
    const on = t > K.lady - .5 && t < K.q1 - .1;
    if (on) {
      const [gx, gy] = rot(GLS[0] * s, GLS[1] * s, tilt), sx = x + gx, sy = y + gy, [px, py] = BRT(...pointAt(t));
      c.save(); c.lineCap = 'round'; c.strokeStyle = 'rgba(232,71,90,.28)'; c.lineWidth = 16; c.beginPath(); c.moveTo(sx, sy); c.lineTo(px, py); c.stroke();
      c.strokeStyle = '#ff5a6e'; c.lineWidth = 4; c.stroke(); c.restore();
      const pr = 14 + 3 * Math.sin(t * 12); circ(c, px, py, pr + 10, 'rgba(232,71,90,.3)'); circ(c, px, py, pr, C.red); circ(c, px, py, 5, C.white);
    }
    mrBrain(c, t, x, y, s, tilt);
    qMark(c, t, x - 30, y - 330, .95);
  }
  // кадр 0 ролика: синий фон, красная полоса, «ЧТО» — чтобы концовка закольцовывалась
  function firstFrame(c) {
    c.fillStyle = C.deep; c.fillRect(-200, -200, WW + 400, HH + 400); introBg(c, 0, { s: 1, x: 960, y: 540, r: 0 });
    c.fillStyle = C.red; c.fillRect(-60, 415, WW + 120, 250); c.save(); c.beginPath(); c.rect(0, 415, WW, 250); c.clip(); titleText(c, 0, 1); c.restore();
  }
  function shotEnd(c, t) {
    const kw = eio(at(t, K.whip, K.whip + .42));
    if (kw < 1) {
      c.save(); c.translate(-2200 * kw, 0);
      const kb = eio(at(t, K.s0, K.s0 + 1)), AA = VAR === 'A', z0 = AA ? 1.05 : 1.12; c.translate(960, 540); c.scale(lp(z0, 1, kb), lp(z0, 1, kb)); c.translate(-960 + (AA ? 0 : lp(260, 0, kb)), -540 + (AA ? 0 : lp(80, 0, kb)));
      if (AA) { board(c, t); vignette(c, .5, '20,8,2'); const kf = at(t, K.endA - .45, K.endA); if (kf > 0) { c.save(); c.globalAlpha = kf; c.fillStyle = '#000'; c.fillRect(-400, -400, WW + 800, HH + 800); c.restore() } }
      else if (VAR === 'lens') {
        board(c, t);
        const [lx, ly] = pointAt(t), R = 150 * spr(at(t, K.s0 + .2, K.s0 + .7)) * lp(1, 1.4, eio(at(t, K.q2, K.whip)));
        if (R > 1) {
          lens(c, t, lx, ly, R);
          const kf = eo(at(t, K.q1 - .1, K.q1 + .25));   // «о чём это я?» — стекло мутнеет
          if (kf > 0) { c.save(); c.globalAlpha = .9 * kf; circ(c, lx, ly, R * .94, C.white); c.restore() }
          qMark(c, t, lx, ly, R / 150);
        }
      } else {
        c.drawImage(corkImg(), -200, -200, WW + 400, HH + 400);
        c.save(); c.translate(BTX, 0); c.translate(960, 540); c.scale(BTS, BTS); c.translate(-960, -540); board(c, t, true); c.restore();
        brainScene(c, t);
      }
      c.restore();
    }
    if (kw > 0) { const x0 = 2200 * (1 - kw); c.save(); c.beginPath(); c.rect(x0 - 140, -300, WW + 600, HH + 600); c.clip(); c.translate(x0, 0); firstFrame(c); c.restore() }
  }
  // ================= метка года в углу: 1973 → 1979 (лаборатория) → (большой барабан) 1998 → 2015 → 2019 =================
  function tagDraw(c, t, Y, TT, x, y, s) { if (s <= 0) return; yearPlate(c, x, y, s, 1); c.save(); c.translate(x, y); c.scale(s, s); yearDrum(c, t, Y, TT, 0, 0, { s: 200, c: C.white, dir: -1, d: .3 }); c.restore() }
  function tagAt(c, t) {
    if (t >= K.y73go + .5 && t < K.chemPan) tagDraw(c, t, [1973], [0], 174, 112, .36);
    else if (t >= K.chemPan && t < K.y98go) tagDraw(c, t, [1973, 1979], [0, K.chem + .05], 174, 112, .36);
    else if (t >= K.y98go && t < K.court - .05) {
      const a = spr(at(t, K.y98go, K.y98go + .35)), e = eio(at(t, K.court - .55, K.court - .05));
      tagDraw(c, t, [1979, 1998], [0, K.y98 + .05], lp(960, 174, e), lp(240, 112, e), lp(1, .36, e) * a);
    } else if (t >= K.court - .05 && t < K.mapT) tagDraw(c, t, [1998], [0], 174, 112, .36);
    else if (t >= K.create && t < K.third) tagDraw(c, t, [2015, 2019], [0, K.y19 + .35], 174, 112, .36 * spr(at(t, K.create, K.create + .4)));
  }
  function keysMain() {
    const w = Wd, k = {};
    k.tw = ['что', 'вы', 'знаете', 'об', 'одноразках'].map(q => w(q));
    k.morph = Math.max(1.95, w('одноразках') + .62); k.morphE = k.morph + .6;
    k.bgv = w('модная'); k.cig = w('замена'); k.cross = w('сигаретам'); k.par = w('паром'); k.puff1 = k.par - .45; k.puff2 = k.par + .55; k.bin2 = k.cross + 1.45;
    k.mango = w('манго'); k.mint = w('мяты'); k.push = w('знаете', 1); k.liq = w('жидкость'); k.zoomE = k.liq + .8;
    k.mintIn = k.cross + 1.3; k.mintOn = k.mintIn + .45;   // мятный вейп встал на место
    k.puffs = []; for (let i = 0, t0 = k.cross + 1.5; t0 < k.liq - .3; i++, t0 += .55) k.puffs.push([i % 3, t0]);
    k.inv = w('изобрели'); k.giants = w('табачные'); k.giants2 = w('гиганты'); k.fifty = w('пятьдесят'); k.y73 = w('1973'); k.y73go = w('год');
    k.drum0 = k.fifty - .05;
    k.drumT = [k.drum0, k.fifty + .33, k.fifty + .59, k.fifty + .85, k.fifty + 1.11, k.fifty + 1.37, k.y73];
    k.emp = w('табачная'); k.emp2 = w('империя'); k.rey = w('рейнольдс'); k.camel = w('camel'); k.winston = w('winston');
    k.prep = w('готовит'); k.secret = w('секретный'); k.goal = w('главная'); k.typ = w('документа') + .05; k.sig = w('звучала') + .1; k.comp = w('компания');
    k.qt = ['компания', 'должна', 'получить', 'свою', 'долю', 'молодёжного', 'рынка'].map(q => w(q)); k.q4 = w('молодёжного'); k.q5 = w('рынка');
    k.prob = w('но'); k.mapI = k.prob + .3;
    k.usual = w('обычный'); k.smoke = w('дым'); k.acrid = w('едкий'); k.tear = w('дерёт'); k.throat = w('горло'); k.teens = w('подросткам');
    k.chemPan = w('тогда') - .1; k.chem = w('химики'); k.mixw = w('смешали'); k.nic = w('никотин'); k.acid = w('кислотой'); k.got = w('получили'); k.salt = w('соль');
    k.softPan = w('абсолютно') - .35; k.soft = w('мягко'); k.dose = w('убойной'); k.dose2 = w('дозе');
    k.vop = w('воплотить'); k.fail = w('смогли'); k.secr = w('секретную'); k.formula = w('формулу'); k.hid = w('спрятали'); k.arch = w('архив'); k.tilt = k.hid - .05;
    k.y98 = w('1998'); k.y98go = k.y98 - .45;
    k.court = w('суд'); k.tob = w('табачников'); k.secrets = w('тайны'); k.n14 = w('четырнадцать'); k.docs = w('документов'); k.pub = w('опубликовали'); k.cal = w('калифорнии');
    k.bzoom = k.cal - .35; k.mapT = k.cal + .05;
    k.odd = w('стечению'); k.near = w('прямо', 1); k.stan = w('стэнфордским'); k.univ = w('университетом'); k.papers = w('бумаги'); k.find = w('находят'); k.two = w('два');
    k.lap = k.papers - .35; k.lapZ = k.find - .5;
    k.create = w('создают'); k.ecig = w('электронную'); k.flash = w('флешку'); k.alive = w('оживает'); k.salt2 = w('соль', 1); k.bp0 = k.create - 1.2;
    k.podGo = w('один'); k.pod1 = w('картридж'); k.pack1 = w('пачку'); k.cigs = w('сигарет', 1);
    k.softv = w('пар'); k.burn = w('горло', 1); k.kids = w('школьники'); k.pull = w('тянули'); k.hooked = w('подсаживались'); k.faster = w('быстрее');
    k.y19 = w('четыре'); k.usa = w('сша'); k.every4 = w('четвёртый'); k.third = w('треть'); k.company = w('компании'); k.b13 = w('тринадцать'); k.dollars = w('долларов'); k.bought = w('выкупил'); k.marl = w('мальборо');
    k.planPan = w('старый'); k.plan = w('план'); k.worked = w('идеально'); k.adm = w('признайтесь'); k.want = w('захотелось'); k.drag = w('затянуться');
    k.dragE = TLW[TLW.length - 1].b;
    return k;
  }
  function keysEnd() {
    const w = Wd, k = {};
    k.s0 = TLW[0].a - .4; k.marl = w('мальборо'); k.c1 = Math.min(k.marl - .1, k.s0 + .75); k.lady = w('дамские'); k.drug = w('наркотик'); k.soak = w('пропитывают'); k.tabak = w('табак'); k.watch = w('смотрите'); k.yt = w('youtube'); k.link = w('ссылка');
    const e = TLW[TLW.length - 1].b;   // голос кончился; дальше — строка без голоса (запишем вместе со всем голосом)
    if (VAR === 'A') { k.c1 = -1; k.endA = e + 2.0; k.q1 = k.q2 = k.whip = 1e9; k.tw = [0, 99, 99, 99, 99]; return k }   // v16.2, концовка A: первая карточка — с кадра 0, конец — на «Ссылка в профиле» (v162_tail.py: AFTER = 2,0)
    k.q1 = e + .45; k.q2 = k.q1 + 1.45; k.whip = k.q2 + .75; k.tw = [0, 99, 99, 99, 99];
    return k;
  }
  // петля: хвост B кончается на начале ролика, сдвинутом на 600 px вправо и летящем влево со скоростью 4500 px/с; ролик в первые 0,4 с
  // продолжает это движение и тормозит (влёт кадра) — склейка «хвост → начало» без шва
  const SLD = 600, SLV = 4500, WHIP = (2200 - SLD) / SLV;
  function keysTail() { const k = { tw: [0, 99, 99, 99, 99] }; k.q1 = .3; k.q2 = k.q1 + 1.45; k.end = Math.round((k.q2 + .75 + WHIP) * 30) / 30; k.whip = k.end - WHIP; return k }   // конец — ровно на кадре (30 к/с): последний кадр хвоста — за кадр до начала ролика
  function tailFrame(c, t) {
    const x0 = lp(2200, SLD, at(t, K.whip, K.whip + WHIP));
    c.save(); c.translate(x0 - 2200, 0); c.fillStyle = '#000'; c.fillRect(-400, -400, WW + 800, HH + 800); qMark(c, t, 960, 470, 1); c.restore();
    if (x0 < 2200) { c.save(); c.beginPath(); c.rect(x0 - 140, -300, WW + 600, HH + 600); c.clip(); c.translate(x0, 0); firstFrame(c); c.restore() }
  }
  // звуки — только мягкие (whoosh, thud, stamp, impact, flutter, dive, heart, ding): резкие шипения, скрежет и бульканье убраны до новых звуков
  function cues() {
    const Q = (t0, n, g = 1, p = 0) => cue(t0, n, g, p);
    if (MODE === 'tail') { Q(K.q1, 'thud', .4); Q(K.q2, 'stamp', .7); Q(K.whip - .08, 'whoosh', .9); return }
    if (MODE === 'end') {
      Q(K.s0, 'whoosh', VAR === 'A' ? .3 : .6); Q(K.marl - .1, 'thud', .5, -.4); Q(K.drug - .15, 'thud', .5); Q(K.soak - .15, 'thud', .5, .4);
      Q(K.watch, 'whoosh', .5); Q(K.yt - .1, 'ding', .45); Q(K.link - .05, 'stamp', .6);
      if (VAR !== 'A') { Q(K.q1, 'thud', .4); Q(K.q2, 'stamp', .7); Q(K.whip, 'whoosh', .9) }
      return;
    }
    Q(K.morph, 'whoosh', .6); Q(K.bgv, 'whoosh', .35, .3); Q(K.cig, 'whoosh', .35, -.3); Q(K.cross + .32, 'whoosh', .45, -.3); Q(K.cross + .8, 'thud', .8, -.4); Q(K.cross + .95, 'whoosh', .5, -.4);
    Q(K.liq, 'dive', .8); Q(K.giants, 'thud', .7); Q(K.y73, 'stamp', .9); Q(K.y73go, 'whoosh', .4);
    Q(K.emp, 'whoosh', .5); Q(K.camel, 'thud', .5, -.4); Q(K.winston, 'thud', .5, .4); Q(K.prep, 'whoosh', .5); Q(K.secret, 'stamp', .9);
    Q(K.goal, 'whoosh', .4); Q(K.prob, 'whoosh', .6);
    Q(K.tear, 'impact', .35); Q(K.throat, 'stamp', .5);
    Q(K.chemPan, 'whoosh', .6); Q(K.got, 'thud', .35); Q(K.salt, 'ding', .3);
    Q(K.softPan, 'whoosh', .4); Q(K.dose, 'thud', .4);
    Q(K.vop, 'whoosh', .5); Q(K.fail, 'stamp', .9); Q(K.hid, 'whoosh', .5); Q(K.arch, 'thud', 1); Q(K.arch + .32, 'thud', .45); Q(K.y98, 'stamp', .6);
    Q(K.court - .25, 'whoosh', .7); Q(K.tob, 'impact', .55); Q(K.secrets - .08, 'impact', .6); Q(K.secrets, 'whoosh', .7); Q(K.secrets + .12, 'flutter', 1); Q(K.pub + .2, 'flutter', .6); Q(K.bzoom, 'whoosh', .6);
    Q(K.mapT + .1, 'whoosh', .5); Q(K.mapT + 1.1, 'whoosh', .3); Q(K.near - .15, 'thud', .4); Q(K.near + .35, 'stamp', .45); Q(K.lap, 'whoosh', .5); Q(K.find, 'ding', .45);
    Q(K.create - .45, 'whoosh', .6); Q(K.flash, 'thud', .4); Q(K.salt2 + .15, 'ding', .3);
    Q(K.podGo, 'whoosh', .6); Q(K.cigs + .1, 'stamp', .5);
    Q(K.softv - .45, 'whoosh', .6); Q(K.kids - .3, 'whoosh', .5); Q(K.hooked, 'thud', .4); Q(K.every4, 'impact', .5);
    Q(K.third - .1, 'whoosh', .6); Q(K.bought - .05, 'impact', .55); Q(K.marl, 'whoosh', .5);
    Q(K.planPan, 'whoosh', .6); Q(K.worked, 'stamp', 1);
    Q(K.adm, 'whoosh', .4); Q(K.dragE - .3, 'whoosh', .45); Q(K.want, 'heart', .6); Q(K.drag, 'impact', .5); Q(K.dragE + .5, 'heart', .5); Q(K.dragE + 1.25, 'thud', .6);
  }
  // субтитры: по 2–3 слова, небольшие, но читаемые — поверх кадра (без живой камеры), внизу по центру
  function buildChunks() {
    const out = []; let cur = [];
    const FW = new Set(['с', 'со', 'в', 'во', 'и', 'а', 'на', 'по', 'за', 'но', 'к', 'ко', 'о', 'об', 'от', 'до', 'из', 'у', 'для', 'при', 'без', 'под', 'над', 'что', 'как', 'чем', 'не', 'ни', 'где', 'the', 'a', 'an', 'of', 'to', 'in', 'and', 'der', 'die', 'das', 'und', 'mit', 'zu']);
    const bare = w => w.d.toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
    const flush = () => { if (cur.length) { out.push({ a: cur[0].a, b: cur[cur.length - 1].b, s: cur.map(w => w.d).join(' ') }); cur = [] } };
    TLW.forEach((w, i) => {
      const nx = TLW[i + 1];
      if (cur.length && ((FW.has(bare(w)) && cur.length >= 2) || cur.length >= 4 || (cur.map(x => x.d).join(' ') + ' ' + w.d).length > 20)) flush();
      cur.push(w);
      if (/[.,!?…:;—]$/.test(w.d) || !nx || nx.a - w.b > .35) flush();
    });
    out.forEach((ch, i) => { const nx = out[i + 1]; ch.e = nx ? Math.min(nx.a - .02, ch.b + .6) : ch.b + .8; ch.s = ch.s.replace(/\.\.\./g, '…').replace(/[.,;:—]+$/, '').replace(/^—\s*/, '') });
    return out.filter(ch => ch.s);
  }
  function subs(c, t) {
    if (MODE === 'main' && t < K.morph + .1) return;   // пока на экране заголовок — без субтитров
    if (MODE !== 'main' && t > K.whip + .1) return;
    if (MODE === 'end' && VAR === 'A' && t > K.watch - .05) return;   // v16.2: дальше всё сказано плашками — субтитр их не повторяет
    const ch = CHUNKS.find(x => t >= x.a - .05 && t < x.e); if (!ch) return;
    const o = { f: 'M', w: 800, s: 42, ls: 0 }, w = tw(c, ch.s, o) + 44, h = 64, y = 1032;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    rr(c, 960 - w / 2, y - h / 2, w, h, 16); fill(c, 'rgba(11,16,48,.8)');
    tx(c, ch.s, 960, y + 2, { ...o, c: C.white });
    c.restore();
  }
  // ================= кадр =================
  const SW = { a: () => K.podGo, b: () => K.podGo + .6 };
  // живая камера (как у Боба: кадр всё время чуть плывёт) — на весь кадр, с запасом по краям
  function liveCam(c, t) {
    const dx = 16 * Math.sin(TAU * t / 6.1) + 8 * Math.sin(TAU * t / 2.9 + 1), dy = 10 * Math.sin(TAU * t / 7.7 + 2) + 5 * Math.sin(TAU * t / 3.3);
    const z = 1.045 + .015 * Math.sin(TAU * t / 9.5), r = .004 * Math.sin(TAU * t / 8.3);
    c.translate(960, 540); c.rotate(r); c.scale(z, z); c.translate(-960 + dx, -540 + dy);
  }
  function frameMain(c, t) {
    if (t < .4) { const x0 = SLD * (1 - eo(t / .4)); c.fillStyle = '#000'; c.fillRect(-400, -400, WW + 800, HH + 800); c.save(); c.beginPath(); c.rect(x0 - 140, -300, WW + 600, HH + 600); c.clip(); c.translate(x0, 0); shot1(c, t); c.restore() }   // v16.2: влёт кадра справа (стык с хвостом B)
    else if (t < K.zoomE) shot1(c, t);
    else if (t < K.mapI) shot2(c, t);
    else if (t < K.mapT) shot3(c, t);
    else if (t < K.lapZ) shot6(c, t);
    else if (t < K.create + .1) shot7(c, t);
    else if (t < SW.a()) shot8(c, t);
    else if (t < K.softv - .45) {
      const X0 = lp(1980, -80, eio(at(t, SW.a(), SW.b())));
      if (X0 > -100) { c.save(); c.beginPath(); c.rect(-200, -200, X0 + 200, HH + 400); c.clip(); shot8(c, t); c.restore() }
      c.save(); c.beginPath(); c.rect(X0, -200, WW - X0 + 400, HH + 400); c.clip(); shot9(c, t); c.restore();
      const P = podPose(t); podDraw(c, P.x, P.y, P.s, P.r, { sh: t > SW.a() + .2 });
    } else if (t < K.softv + .05) {
      // сдвиг (без белой вспышки): сцена картриджа уходит влево, снимок горла въезжает справа
      const X0 = lp(WW, 0, eio(at(t, K.softv - .45, K.softv + .05)));
      c.save(); c.translate(X0 - WW, 0); shot9(c, t); const P = podPose(t); podDraw(c, P.x, P.y, P.s, P.r, { sh: true }); c.restore();
      c.save(); c.beginPath(); c.rect(X0, -300, WW + 600, HH + 600); c.clip(); c.translate(X0, 0); shot11(c, t); c.restore();
    } else if (t < K.third + .25) shot11(c, t);
    else if (t < K.planPan) shot12(c, t);
    else shot13(c, t);
  }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    X.__t = t; c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    liveCam(c, MODE !== 'main' && t > K.whip + .2 ? 0 : t);
    if (MODE === 'end') shotEnd(c, t); else if (MODE === 'tail') tailFrame(c, t); else { frameMain(c, t); tagAt(c, t) }
    if (SUBS) subs(c, t);
  }
  window.EP = {
    P: { bg: C.deep, paper: C.wh, ink: C.n0, line: C.wh, a1: C.am, a2: C.red }, D, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); LANG = tl.lang || 'ru';
      const ep = String(tl.ep || '').replace(/-(ru|en|de)$/, '');   // v162 — ролик, v162a — концовка A, v162b — хвост B; v161e1/e2 — старые концовки
      MODE = /e[12]$/.test(ep) || /\da$/.test(ep) ? 'end' : /\db$/.test(ep) ? 'tail' : 'main'; VAR = /e2$/.test(ep) ? 'brain' : /\da$/.test(ep) ? 'A' : 'lens';
      HERO.label = tt('mango'); BGV[0].label = tt('mint'); BGV[1].label = tt('berry');
      K = MODE === 'end' ? keysEnd() : MODE === 'tail' ? keysTail() : keysMain(); cues();
      CHUNKS = buildChunks();
      if (MODE === 'tail' || (MODE === 'end' && VAR !== 'A')) CHUNKS.push({ a: K.q1, e: K.q2 - .05, s: 'Так… о чём это я?' }, { a: K.q2, e: K.whip + .1, s: 'А, точно!' });
      SC.forEach(S => { D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v162')) { const st = document.createElement('style'); st.id = 'v162'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d'); MA = MB = null; CORK = null; OFF = null; for (const k in BLUR) delete BLUR[k];
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O', '700 20px U', '800 20px U', '700 20px "Liberation Serif"'].map(f => document.fonts.load(f, 'АЯaz09'))).then(() => { qLayout(X); return 0 });
    },
  };
})();
