  // ================= мир A — столик лондонской кофейни (кадр 0, строки 1–3; строки 14–15; петля шортса) =================
  // Кадр 0 (идея Gemini): окно — рассвет и силуэт Биг-Бена, тёмный стол, сложенная газета, пачка Marlboro, чашка чая с паром, косой луч.
  // «пообещал» — газета раскрывается (#088), «британских» — ещё две газеты веером (#119), реклама печатается по словам голоса;
  // «Слово… не сдержал» — разворот сминается в комок, комок катится к краю и падает в темноту под столом — там он станет глобусом (мир B).
  // Строка 14: из карты на столе (мир I) — отъезд, комок-обещание катится обратно; из пачки растёт башня сигарет, из белых фигурок — столбик.
  // Строка 15: комок падает в урну, полную таких же комков; на столе — IQOS и пачка Marlboro. Шортс: на стол ложится свежая газета — кадр 0.
  let TA = null, KA1 = null, KA2 = null, KAL = null;
  const RA = { x: 540, y: 1000, z: 1, r: 0 };   // опорная камера параллакса
  const WIN = { x0: 150, x1: 930, y0: 170, y1: 880 }, TOPY4 = 1060, EDGEY = 1590, FLOORY = 1650, TEND = 1130;
  const PG = { w: 300, h: 420, sx: 540, y: 1140 };   // страницы разворота: левая [240..540], правая [540..840]
  const PACK0 = { x: 120, y: 1290, w: 110, h: 163 }, CUP = { x: 930, y: 1215 }, BIN = { x: 1265, y: 1905, w: 190, h: 255 };
  const MAPA = { x: 690, y: 1350, w: 290, h: 330 };   // карта США (мир I) лежит на столе — в строке 14 и дальше
  const BALL_R = 44, FLOORC = '#3A2B2E';   // v21.2: пол светлее — урна стоит на полу, а не в темноте
  function cafeInit() {
    const w = (s, q, n) => Ws(s, q, n);
    TA = { marl: w('s1', 'мальборо'), poob: w('s1', 'пообещал'), bros: w('s1', 'бросить'), vyk: w('s2', 'выкупил'), brit: w('s2', 'британских'), nashe: w('s2', 'наше'), ob2: w('s2', 'обещание'), my2: w('s2', 'мы'),
      pyt: w('s2', 'пытаемся'), sig2: w('s2', 'сигареты'), slovo: w('s3', 'слово'), sderzh: w('s3', 'сдержал'), brosat: w('s4', 'бросать'),
      obesch: SA('s14') !== null ? w('s14', 'обещание') : null };
    const a = TA;
    a.ball0 = a.sderzh + .05; a.roll1 = a.ball0 + .8; a.fall1 = a.roll1 + .55; a.jAB = a.fall1 + .1;   // комок готов → у края → в темноте
    KA1 = [KY(0, 540, 1000, 1.0), KY(a.poob + .1, 560, 1110, 1.1), KY(a.vyk - .2, 560, 1230, 1.2), KY(a.vyk + .75, 640, 1330, 1.55), KY(a.brit + .6, 540, 1330, .95),
      KY(a.nashe + .55, 690, 1275, 1.98), KY(a.pyt + .5, 690, 1330, 1.88), KY(a.slovo - .3, 680, 1340, 1.72), KY(a.sderzh - .2, 560, 1345, 1.3),
      KY(a.ball0 + .35, 565, 1420, 1.42), KY(a.roll1 + .05, 620, 1650, 1.8), KY(a.jAB, 660, 2050, 2.6)];
    KA1[0].v = [6, 40, .035, 0];   // кадр 0 — уже на ходу (как в главе 3): петля шортса въезжает в него с той же скоростью
  }
  const ballPos = t => {   // комок строк 3–4: (x, y, поворот)
    const a = TA;
    if (t < a.ball0) return [540, 1350, 3];   // v21.2: поворот — с того, на котором кончилось сминание (crumple: e * 3), без скачка граней
    if (t < a.roll1) { const k = eio(at(t, a.ball0, a.roll1)); return [lp(540, 630, k), lp(1350, 1585, k), lp(3, 10.5, k)] }
    const k = eo(at(t, a.roll1, a.fall1)); return [lp(630, 660, k), lp(1585, 1990, k), 10.5 + 2.2 * k];
  };
  // ---------- газета ----------
  function textLines(c, x, y, w, h, n, col, seed) { c.fillStyle = col; for (let i = 0; i < n; i++) { const yy = y + i * h / n; c.fillRect(x, yy, w * (.72 + .28 * H1(seed + i)), Math.max(2, h / n * .42)) } }
  function frontPage(c, x, y, w, h, head, o = {}) {   // первая полоса: шапка, заголовок, колонки, фото
    c.fillStyle = o.paper || C4.paper; c.fillRect(x, y, w, h);
    if (o.red) { c.fillStyle = C4.red; c.fillRect(x + w * .06, y + h * .03, w * .88, h * .1); tx(c, head, x + w / 2, y + h * .082, { f: 'M', w: 800, s: h * .062, c: '#fff', mw: w * .8 }) }
    else tx(c, head, x + w / 2, y + h * .08, { f: 'P', w: 700, s: h * .075, c: C4.inkN, mw: w * .86 });
    c.fillStyle = C4.inkN; c.fillRect(x + w * .06, y + h * .15, w * .88, 2);
    c.fillStyle = 'rgba(27,26,24,.85)'; c.fillRect(x + w * .06, y + h * .18, w * .88, h * .05);
    textLines(c, x + w * .06, y + h * .27, w * .4, h * .66, 16, 'rgba(27,26,24,.38)', 3);
    c.fillStyle = '#9A958C'; c.fillRect(x + w * .52, y + h * .27, w * .42, h * .3); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x + w * .52, y + h * .27, w * .42 * .4, h * .3);
    textLines(c, x + w * .52, y + h * .61, w * .42, h * .32, 8, 'rgba(27,26,24,.38)', 9);
  }
  function adPage(c, x, y, w, h, m1, m2) {   // v21.1: полоса рекламы напечатана целиком (не печатается по буквам); m1, m2 — жёлтый маркер под строками по голосу (0..1)
    c.fillStyle = C4.paperL; c.fillRect(x, y, w, h); c.strokeStyle = 'rgba(27,26,24,.75)'; c.lineWidth = Math.max(1.5, w * .006); c.strokeRect(x + w * .05, y + h * .035, w * .9, h * .93);
    const f1 = { f: 'P', w: 700, s: w * .088, c: C4.inkN, al: 'left', mw: w * .8 }, f2 = { f: 'P', w: 700, st: 'italic', s: w * .057, c: C4.inkN, al: 'left', mw: w * .8 };
    const L = [[OBJ.ad1L[0], .2, f1, m1, 0], [OBJ.ad1L[1], .31, f1, m1, 1], [OBJ.ad2L[0], .44, f2, m2, 0], [OBJ.ad2L[1], .515, f2, m2, 1]];
    for (const [ln, yy, f, m, i] of L) { const k = cl(m * 2 - i); if (k <= 0) continue;   // маркер — под буквами, строка за строкой
      const ww = Math.min(tw(c, ln, f), f.mw) * eio(k) + w * .03, hh = f.s * .78, x0 = x + w * .11 - w * .015, y0 = y + h * yy;
      poly(c, [x0, y0 - hh * .42, x0 + ww, y0 - hh * .5, x0 + ww - 3, y0 + hh * .5, x0 - 2, y0 + hh * .46]); fill(c, 'rgba(255,226,122,.85)') }
    for (const [ln, yy, f] of L) tx(c, ln, x + w * .11, y + h * yy, f);
    textLines(c, x + w * .11, y + h * .6, w * .37, h * .2, 9, 'rgba(27,26,24,.3)', 21); textLines(c, x + w * .52, y + h * .6, w * .37, h * .2, 9, 'rgba(27,26,24,.3)', 27);   // текст объявления — две колонки
    c.fillStyle = 'rgba(27,26,24,.6)'; c.fillRect(x + w * .3, y + h * .835, w * .4, 1.5);
    tx(c, OBJ.ad3, x + w * .5, y + h * .87, { f: 'M', w: 800, s: w * .045, c: C4.inkN, ls: 1, mw: w * .8 });
  }
  function innerLeft(c, x, y, w, h) { c.fillStyle = C4.paper; c.fillRect(x, y, w, h); tx(c, OBJ.news, x + w * .1, y + h * .06, { f: 'M', w: 800, s: h * .035, c: C4.inkN, al: 'left', ls: 2, mw: w * .5 });
    c.fillStyle = 'rgba(27,26,24,.8)'; c.fillRect(x + w * .08, y + h * .1, w * .84, h * .045); c.fillStyle = '#A8A296'; c.fillRect(x + w * .08, y + h * .19, w * .84, h * .24);
    textLines(c, x + w * .08, y + h * .47, w * .4, h * .46, 12, 'rgba(27,26,24,.35)', 31); textLines(c, x + w * .52, y + h * .47, w * .4, h * .46, 12, 'rgba(27,26,24,.35)', 41) }
  // газета целиком: сложена → раскрывается (#088) → разворот; k — раскрытие 0..1
  function newspaper(c, t, k, adK1, adK2) {
    const { w, h, sx, y } = PG;
    rasterPoly(c, [sx - w * k + 20, y + h, sx + w, y + h, sx + w + 90, y + h + 60, sx - w * k + 110, y + h + 60], 'rgba(6,8,24,.4)', 9, 2.3);
    adPage(c, sx, y, w, h, adK1, adK2);
    // обложка поворачивается вокруг корешка: cos > 0 — видна первая полоса над правой страницей, < 0 — оборот обложки (левая страница)
    const a = Math.PI * eio(k), cs = Math.cos(a), lift = Math.sin(a) * 26;
    c.save(); c.translate(sx, y + h / 2 - lift * .4);
    if (cs > 0) { c.scale(cs, 1); c.transform(1, -.06 * Math.sin(a), 0, 1, 0, 0); frontPage(c, 0, -h / 2, w, h, OBJ.heads[0]); c.fillStyle = `rgba(20,16,30,${.35 * (1 - cs)})`; c.fillRect(0, -h / 2, w, h) }
    else { c.scale(cs, 1); c.transform(1, -.06 * Math.sin(a), 0, 1, 0, 0); c.scale(-1, 1); innerLeft(c, -w, -h / 2, w, h); c.fillStyle = `rgba(20,16,30,${.3 * (1 + cs)})`; c.fillRect(-w, -h / 2, w, h) }
    c.restore();
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(sx - 2, y, 4, h);   // корешок
  }
  function fanPapers(c, t, k, out) {   // «британских»: ещё две газеты выезжают веером из-под разворота; в строке 3 уезжают
    if (k <= 0) return; const { w, h, y } = PG, e = eo(k), o = eio(out);
    [[-1, OBJ.heads[1], -.13], [1, OBJ.heads[2], .1]].forEach(([d, head, rot], i) => {
      const cx = 540 + d * lp(150, 390 + 700 * o, e), cy = y + h / 2 + 25 - i * 10;
      c.save(); c.translate(cx, cy); c.rotate(rot * e); rasterPoly(c, [-w / 2 + 20, h / 2, w / 2, h / 2, w / 2 + 70, h / 2 + 45, -w / 2 + 90, h / 2 + 45], 'rgba(6,8,24,.35)', 9, 2.2);
      frontPage(c, -w / 2, -h / 2, w, h, head, { red: true }); adPage(c, -w / 2 + w * .06, -h / 2 + h * .26, w * .88, h * .7, 0, 0); c.restore() });
  }
  function creases(c, R) {   // v21.1: складки смятой бумаги — тонкие ломаные линии (раньше тёмные чёрточки читались как значок «пауза»)
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (let i = 0; i < 6; i++) { const a = H1(i * 7.3 + .4) * TAU, d = R * (.15 + H1(i * 2.1) * .55), L = R * (.35 + H1(i * 4.7) * .3), b = a * 2 + H1(i) * 1.5;
      const x0 = Math.cos(a) * d, y0 = Math.sin(a) * d; c.beginPath(); c.moveTo(x0 - Math.cos(b) * L / 2, y0 - Math.sin(b) * L / 2); c.lineTo(x0 + Math.sin(b) * L * .08, y0 - Math.cos(b) * L * .08); c.lineTo(x0 + Math.cos(b) * L / 2, y0 + Math.sin(b) * L / 2);
      c.strokeStyle = i % 2 ? 'rgba(120,108,92,.42)' : 'rgba(255,255,255,.6)'; c.lineWidth = Math.max(1, R * .025); c.stroke() }
  }
  // комок бумаги (v21.2, ТЗ v212 — без гладкого «мячика»): неровный контур из 13 бугров, грани в 3 тона по свету (свет слева сверху — грани
  // перекрашиваются, пока комок катится), складки, обрывки газетных строк. Тот же комок — в начале глобуса (30-globe.js): контур скругляется
  // (k → 0), грани гаснут, проступает суша — комок одним вращением становится глобусом.
  const CRN = 13, crumpR = (i, k) => 1 + k * (.84 + .22 * H1(i * 5.3 + 1) - 1);
  function crumpPath(c, R, k, rot) { const M = 78; c.beginPath();
    for (let j = 0; j <= M; j++) { const u = j / M * CRN, i = Math.floor(u) % CRN, f = u - Math.floor(u), r = lp(crumpR(i, k), crumpR((i + 1) % CRN, k), f) * R, a = j / M * TAU + rot;
      j ? c.lineTo(Math.cos(a) * r, Math.sin(a) * r) : c.moveTo(Math.cos(a) * r, Math.sin(a) * r) } c.closePath() }
  function crumpFacets(c, R, rot, al) {
    if (al <= 0) return; c.save(); c.globalAlpha *= al; const P = [], Q = [];
    for (let i = 0; i < CRN; i++) { const a = i / CRN * TAU + rot, r = crumpR(i, 1) * R * 1.03; P.push([Math.cos(a) * r, Math.sin(a) * r]);
      const b = (i + .5 + (H1(i * 2.7) - .5) * .5) / CRN * TAU + rot, r0 = R * (.24 + .24 * H1(i * 3.9 + 4)); Q.push([Math.cos(b) * r0, Math.sin(b) * r0]) }
    const tone = (x, y, s) => { const d = (-.72 * x - .69 * y) / R + (H1(s) - .5) * .55; return d > .28 ? '#FCFAF4' : d < -.3 ? '#B8AE9B' : '#E4DDCE' };
    for (let i = 0; i < CRN; i++) { const p1 = P[i], p2 = P[(i + 1) % CRN], q = Q[i], q0 = Q[(i + CRN - 1) % CRN];
      poly(c, [q[0], q[1], p1[0], p1[1], p2[0], p2[1]]); fill(c, tone((q[0] + p1[0] + p2[0]) / 3, (q[1] + p1[1] + p2[1]) / 3, i));
      poly(c, [q0[0], q0[1], p1[0], p1[1], q[0], q[1]]); fill(c, tone((q0[0] + p1[0] + q[0]) / 3, (q0[1] + p1[1] + q[1]) / 3, i + 40));
      if (i % 4 === 1) { c.save(); poly(c, [q[0], q[1], p1[0], p1[1], p2[0], p2[1]]); c.clip(); c.fillStyle = 'rgba(38,40,58,.36)';   // обрывки газетных строк вдоль грани
        [.5, .64, .78].forEach((f, n) => { const x1 = lp(q[0], p1[0], f), y1 = lp(q[1], p1[1], f), x2 = lp(q[0], p2[0], f), y2 = lp(q[1], p2[1], f), w = R * (n ? .032 : .05);
          c.save(); c.translate(lp(x1, x2, .5), lp(y1, y2, .5)); c.rotate(Math.atan2(y2 - y1, x2 - x1)); c.fillRect(-Math.hypot(x2 - x1, y2 - y1) * .38, -w / 2, Math.hypot(x2 - x1, y2 - y1) * (.76 - n * .12), w); c.restore() });
        c.restore() } }
    poly(c, Q.flat()); fill(c, tone(Q.reduce((m, v) => m + v[0], 0) / CRN, Q.reduce((m, v) => m + v[1], 0) / CRN, 99));
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (let i = 0; i < CRN; i++) { const p1 = P[i], q = Q[i], q2 = Q[(i + 1) % CRN];   // складки: тёмная линия сгиба и светлый край
      c.strokeStyle = 'rgba(92,80,62,.5)'; c.lineWidth = Math.max(1, R * .022); c.beginPath(); c.moveTo(q[0], q[1]); c.lineTo(p1[0], p1[1]); c.stroke();
      c.strokeStyle = i % 2 ? 'rgba(255,255,255,.65)' : 'rgba(92,80,62,.35)'; c.lineWidth = Math.max(1, R * .018); c.beginPath(); c.moveTo(q[0], q[1]); c.lineTo(q2[0], q2[1]); c.stroke() }
    c.restore();
  }
  function crumpShade(c, R) { c.fillStyle = 'rgba(14,16,40,.28)'; c.beginPath(); c.arc(0, 0, R * 1.25, -Math.PI * .35, Math.PI * .65); c.arc(R * .18, 0, R * .9, Math.PI * .65, -Math.PI * .35, true); c.fill() }
  function paperBall(c, x, y, R, rot = 0, o = {}) {
    c.save(); c.translate(x, y);
    if (o.shadow !== false) { c.save(); c.scale(1, .3); circ(c, R * .35, R * 3.3, R * 1.05, 'rgba(6,8,24,.35)'); c.restore() }
    crumpPath(c, R, 1, rot); c.fillStyle = C4.paper; c.fill(); c.save(); crumpPath(c, R, 1, rot); c.clip(); crumpFacets(c, R, rot, 1); crumpShade(c, R); c.restore();
    crumpPath(c, R, 1, rot); lnB(c, Math.max(1.5, R * .045), 'rgba(238,241,248,.55)'); c.restore();
  }
  // разворот сминается в комок: k 0..1
  function crumple(c, t, k) {
    const cx = 540, cy = PG.y + PG.h / 2, n = 28, e = eio(k), R1 = BALL_R;
    const pts = []; for (let i = 0; i < n; i++) { const u = i / n, a = u * TAU, rx = PG.w, ry = PG.h / 2, sq = Math.max(Math.abs(Math.cos(a)) / rx, Math.abs(Math.sin(a)) / ry), r0 = 1 / sq;
      const r = lp(r0, R1 * (1 + (H1(i * 3.1) - .5) * .25), e) * (1 + (H1(i * 7.7 + 2) - .5) * .35 * Math.sin(Math.PI * e)); pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r) }
    if (e < .97) { c.save(); poly(c, pts); c.clip(); c.translate(cx, cy); c.rotate(e * .5); c.scale(1 - e * .82, 1 - e * .82); c.translate(-cx, -cy);
      innerLeft(c, 240, PG.y, PG.w, PG.h); adPage(c, 540, PG.y, PG.w, PG.h, 1, 1); c.restore();
      c.save(); poly(c, pts); c.clip(); for (let i = 0; i < 14; i++) { const a = H1(i * 4.3) * TAU, L = PG.w * (1 - e) + 60; c.save(); c.translate(cx + (H1(i * 1.7) - .5) * PG.w * (1 - e), cy + (H1(i * 2.9) - .5) * PG.h * (1 - e)); c.rotate(a);
        poly(c, [0, 0, L, -18, L, 18]); fill(c, i % 2 ? `rgba(30,24,40,${.16 * e})` : `rgba(255,255,255,${.3 * e})`); c.restore() } c.restore();
      poly(c, pts); lnB(c, 2.5, `rgba(238,241,248,${.35 * e})`) }
    if (e > .85) A(c, (e - .85) / .15, () => paperBall(c, cx, cy, R1, e * 3, { shadow: false }));
  }
  // ---------- стол, окно, чашка, урна ----------
  function cafeFar(c, t) {   // за окном: рассвет полосами, солнце, крыши, Биг-Бен (дальний план)
    const B = C4.dawn, y0 = WIN.y0 - 260, y1 = WIN.y1 + 140, bh = (y1 - y0) / B.length;
    B.forEach((col, i) => { c.fillStyle = col; c.fillRect(-1400, y0 + i * bh, 3900, bh + 1) });
    circ(c, 330, 812, 70, '#F7CB78'); circ(c, 330, 812, 52, '#FBE2A8');
    c.fillStyle = 'rgba(255,214,150,.25)'; for (let i = 0; i < 3; i++) c.fillRect(-1400, WIN.y1 - 130 + i * 26 + Math.sin(t * .4 + i) * 4, 3900, 6);
    const bx = 735, by = 870; c.fillStyle = C4.ben;   // Биг-Бен: башня, часы, шпиль
    c.fillRect(bx - 34, by - 440, 68, 440); c.fillRect(bx - 44, by - 470, 88, 60); poly(c, [bx - 44, by - 470, bx + 44, by - 470, bx + 26, by - 540, bx - 26, by - 540]); fill(c, C4.ben);
    poly(c, [bx - 12, by - 540, bx + 12, by - 540, bx, by - 640]); fill(c, C4.ben); circ(c, bx, by - 405, 26, '#E9C88A'); circ(c, bx, by - 405, 21, '#F6E2B4');
    c.strokeStyle = C4.ben; c.lineWidth = 3; c.beginPath(); c.moveTo(bx, by - 405); c.lineTo(bx, by - 421); c.moveTo(bx, by - 405); c.lineTo(bx + 11, by - 401); c.stroke();
    poly(c, [-400, by, -400, by - 90, 90, by - 90, 110, by - 130, 160, by - 130, 180, by - 100, 470, by - 100, 490, by - 150, 520, by - 150, 540, by - 110, 690, by - 110, 690, by - 150, 790, by - 150, 790, by - 120, 1000, by - 120, 1020, by - 160, 1060, by - 160, 1080, by - 95, 1500, by - 95, 1500, by]); fill(c, C4.roofs);
    c.fillStyle = 'rgba(247,203,120,.55)'; for (let i = 0; i < 16; i++) { const wx = -200 + i * 105 + (i % 3) * 14, wy = by - 70 + (i % 2) * 22; if (H1(i * 3.3) > .45) c.fillRect(wx, wy, 10, 14) }
  }
  function cafeWall(c, t) {
    c.save(); c.beginPath(); c.rect(-3000, -2000, 7000, TOPY4 + 2000); c.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); c.fillStyle = C4.wall; c.fill('evenodd'); c.restore();
    c.fillStyle = C4.wallD; c.fillRect(-3000, 930, 7000, TOPY4 - 930); c.fillStyle = 'rgba(255,255,255,.04)'; for (let x = -2900; x < 4000; x += 120) c.fillRect(x, 940, 4, TOPY4 - 950);   // панели под окном
    const f = 22; c.fillStyle = C4.woodE; c.fillRect(WIN.x0 - f, WIN.y0 - f, WIN.x1 - WIN.x0 + f * 2, f); c.fillRect(WIN.x0 - f, WIN.y0, f, WIN.y1 - WIN.y0); c.fillRect(WIN.x1, WIN.y0, f, WIN.y1 - WIN.y0);
    c.fillStyle = C4.woodE; c.fillRect(538 - 6, WIN.y0, 12, WIN.y1 - WIN.y0); c.fillRect(WIN.x0, 520, WIN.x1 - WIN.x0, 10);
    c.fillStyle = C4.woodD; c.fillRect(WIN.x0 - 40, WIN.y1, WIN.x1 - WIN.x0 + 80, 34); c.fillStyle = C4.woodL; c.fillRect(WIN.x0 - 40, WIN.y1, WIN.x1 - WIN.x0 + 80, 6);
    c.save(); c.beginPath(); c.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); c.clip(); glint(c, WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0, .06); c.restore();
  }
  function cafeTable(c, t) {
    c.fillStyle = C4.wallD; c.fillRect(TEND, TOPY4 - 2, 3000, FLOORY - TOPY4 + 2); c.fillStyle = 'rgba(255,255,255,.04)'; for (let x = TEND + 40; x < 4000; x += 120) c.fillRect(x, TOPY4, 4, FLOORY - TOPY4 - 30);
    c.fillStyle = C4.woodE; c.fillRect(TEND, FLOORY - 30, 3000, 30);   // плинтус
    c.fillStyle = FLOORC; c.fillRect(-3000, FLOORY, 7000, 3000); c.fillStyle = 'rgba(255,255,255,.07)'; for (let i = 0; i < 14; i++) c.fillRect(-3000, FLOORY + 40 + i * 70 + i * i * 4, 7000, 4);   // доски пола
    c.fillStyle = 'rgba(0,0,0,.18)'; for (let x = -3000; x < 4000; x += 230) c.fillRect(x, FLOORY, 3, 3000); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(-3000, FLOORY, 7000, 26);   // стыки досок, тень под столом
    c.fillStyle = C4.wood; c.fillRect(-3000, TOPY4, 3000 + TEND, EDGEY - TOPY4); c.fillStyle = C4.woodL; c.fillRect(-3000, TOPY4, 3000 + TEND, 10);
    c.strokeStyle = 'rgba(40,24,14,.35)'; c.lineWidth = 3; c.beginPath(); for (let i = 0; i < 9; i++) { const yy = TOPY4 + 40 + i * 58; c.moveTo(-3000, yy); for (let x = -3000; x < TEND; x += 160) c.lineTo(x + 80, yy + Math.sin(x * .013 + i) * 5) } c.stroke();
    c.fillStyle = C4.woodD; c.fillRect(-3000, EDGEY, 3000 + TEND, FLOORY - EDGEY); c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(-3000, EDGEY, 3000 + TEND, 4);
    PL(c, [TEND, TOPY4, TEND + 26, TOPY4 + 14, TEND + 26, FLOORY + 10, TEND, FLOORY], C4.woodE);   // торец стола справа
    c.fillStyle = C4.woodE; c.fillRect(TEND - 60, FLOORY, 34, 900);   // ножка
  }
  function cup(c, t, tau, sk = 1) {   // sk — сколько видно пара (v21.1: пока чашку закрывает газета, пар не идёт сквозь бумагу)
    const { x, y } = CUP; c.save(); c.translate(x, y);
    c.beginPath(); c.ellipse(10, 58, 120, 26, 0, 0, TAU); fill(c, 'rgba(6,8,24,.35)'); c.beginPath(); c.ellipse(0, 50, 112, 24, 0, 0, TAU); fill(c, '#E9E5DD'); c.beginPath(); c.ellipse(0, 46, 84, 15, 0, 0, TAU); fill(c, '#D5D0C6');
    c.beginPath(); c.moveTo(-62, -50); c.lineTo(62, -50); c.quadraticCurveTo(60, 40, 0, 44); c.quadraticCurveTo(-60, 40, -62, -50); c.closePath(); cel(c, -62, -50, 124, 94, '#F4F1EA', { sw: .28, hx: .12 });
    c.beginPath(); c.ellipse(0, -50, 62, 13, 0, 0, TAU); fill(c, '#EDE8DF'); c.beginPath(); c.ellipse(0, -48, 54, 9, 0, 0, TAU); fill(c, '#8A4E24'); c.beginPath(); c.ellipse(-12, -50, 20, 3, 0, 0, TAU); fill(c, 'rgba(255,220,170,.35)');
    c.beginPath(); c.arc(70, -12, 24, -1.3, 1.3); lnB(c, 11, '#E3DED4'); c.restore();
    for (let i = 0; i < 2; i++) { const u = (tau * .22 + i * .5) % 1, sx = x - 18 + i * 34; if (sk > 0) smokeLine(c, [sx, y - 66, sx + 16 + Math.sin(tau * 1.3 + i) * 14, y - 150, sx - 6, y - 240, sx + 20 + Math.sin(tau + i) * 10, y - 330], 6, '#F4F1EA', .38 * sk * Math.sin(Math.PI * (.25 + .75 * u))) }
  }
  function bin(c, t, n = 7) {   // урна на полу справа от стола: металл в 3 тона, в ней — такие же комки
    const { x, y, w, h } = BIN, top = y - h; c.beginPath(); c.ellipse(x + 26, y + 6, w * .62, 22, 0, 0, TAU); fill(c, 'rgba(8,6,12,.5)');   // тень на полу
    for (let i = 0; i < n; i++) paperBall(c, x - w * .32 + (i % 4) * w * .21 + (i > 3 ? w * .1 : 0), top + 8 - (i > 3 ? 46 : 14) - H1(i) * 12, 40 + H1(i * 3) * 8, i * 1.3, { shadow: false });
    poly(c, [x - w / 2, top, x + w / 2, top, x + w * .42, y, x - w * .42, y]); cel(c, x - w / 2, top, w, h, '#5A5F72', { sw: .3, hx: .1 });
    c.strokeStyle = 'rgba(20,23,51,.45)'; c.lineWidth = 4; c.beginPath(); for (let i = 1; i < 6; i++) { const u = i / 6; c.moveTo(x - w / 2 + w * u, top); c.lineTo(x - w * .42 + w * .84 * u, y) } c.stroke();
    rr(c, x - w / 2 - 8, top - 10, w + 16, 22, 10); fill(c, '#7A8096'); rr(c, x - w / 2 - 8, top - 10, w + 16, 22, 10); lnB(c, 2.5, 'rgba(238,241,248,.4)');
  }
  function beamA(c, t, tau) {   // косой луч из окна и пылинки в нём (передний план)
    c.save(); poly(c, [WIN.x0 + 40, WIN.y1 - 120, 520, WIN.y1 - 120, 1150, FLOORY, 300, FLOORY]); c.fillStyle = 'rgba(255,214,150,.06)'; c.fill(); c.clip();
    for (let i = 0; i < 26; i++) { const px = 200 + H1(i * 3.7) * 900 + Math.sin(tau * .3 + i) * 30, py = 700 + ((H1(i * 5.1) * 1000 + tau * (12 + H1(i) * 14)) % 1000); circ(c, px, py, 1.5 + H1(i * 2) * 1.8, `rgba(255,236,200,${.2 + .16 * Math.sin(tau + i)})`) }
    c.restore();
  }
  // ---------- строка 14: башня пачек и толпа пользователей ----------
  // v21.2 (ТЗ v212): красная башня — стопка объёмных пачек Marlboro (не «блины»), не выше 5 пачек — верх не доходит до плашки года;
  // 32 млн — плотная толпа бюстов рядами (не колонны «акробатов»), сверху — IQOS. В фильме башня и толпа остаются на столе до конца.
  function bust4(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(-23, 0); c.quadraticCurveTo(-22, -24, 0, -26); c.quadraticCurveTo(22, -24, 23, 0); c.closePath(); fill(c, col);
    circ(c, 0, -38, 13, col); c.fillStyle = 'rgba(0,0,0,.1)'; c.fillRect(8, -24, 15, 24); c.restore() }
  function towers(c, t) {
    const a = TB4; if (!a || t < a.tri - .1) return;
    const out = MODE === 'y' ? 0 : eio(at(t, a.brosaj - .25, a.brosaj + .25)), kr = eio(at(t, a.sig - .05, a.shest + .8)) * (1 - out), kw = eio(at(t, a.tri - .05, a.tri + 1.4)) * (1 - out);
    const px = PACK0.x - packOff(t), NP = 5, ph = PACK0.h * .98;
    if (kr > 0) { const nf = kr * NP; for (let i = 1; i <= Math.ceil(nf - 1e-6); i++) { const f = cl(nf - (i - 1)), drop = (1 - eo(f)) * 260, wob = (H1(i * 3.3) - .5) * 14;
      c.save(); c.globalAlpha *= Math.min(1, f * 3); pack3(c, px + wob, PACK0.y - i * ph - drop, PACK0.w, PACK0.h, { d: 46, shadow: false }); c.restore() } }
    if (kw > 0) { const cx = 330, rows = Math.round(kw * 8);
      for (let r = rows - 1; r >= 0; r--) { const col = mixc(r % 2 ? '#E9E5DD' : '#F4F1EA', '#9A97A8', r * .07); for (let j = 0; j < 4; j++) bust4(c, cx - 75 + j * 50 + (r % 2) * 22 - 11, 1452 - r * 40, 1, col) }
      if (kw > .95) iqos4(c, cx, 1452 - rows * 40 - 70, 150, { shadow: false }) }
  }
  const packOff = t => 160 * eio(at(t, TA.bros - .05, TA.bros + .55)) - (TB4 ? 90 * eio(at(t, TB4.chet - .7, TB4.chet - .1)) + 70 * eio(at(t, TB4.vy - .3, TB4.vy + .35)) : 0);   // пачка уехала влево на «бросить» (целиком из кадра), в строке 14 вернулась к краю, на «вы» — на место
  function cafeWorld(c, t, tau, st = {}) {   // tau — «своё» время мира: пар, пыль (для петли шортса — t − TL0)
    cafeTable(c, t); bin(c, t, st.binN ?? 7);
    if (st.map) st.map(c);   // карта США лежит на столе (строки 14–17) — под пачкой и чашкой
    const a = TA;
    pack3(c, PACK0.x - packOff(t), PACK0.y, PACK0.w, PACK0.h, { d: 46, glow: eo(at(t, a.marl - .05, a.marl + .3)) * (1 - at(t, a.bros, a.bros + .4)) });   // v21.2: пачка в объёме
    cup(c, t, tau, 1 - at(t, a.brit - .15, a.brit + .25) * (1 - at(t, a.slovo + .25, a.slovo + .7)));
    if (st.paper !== false) {
      if (t < a.slovo) { const k = eio(at(t, a.poob - .05, a.poob + .55)); fanPapers(c, t, at(t, a.brit - .1, a.brit + .55), 0);
        newspaper(c, t, k, at(t, a.nashe - .08, a.ob2 + .5), at(t, a.my2 - .08, a.sig2 + .45)) }
      else if (t < a.ball0) { fanPapers(c, t, 1, at(t, a.slovo - .1, a.slovo + .5)); crumple(c, t, at(t, a.slovo, a.ball0)) }
      else if (t < a.jAB + .5) { const [bx, by, br] = ballPos(t); paperBall(c, bx, by, BALL_R, br, { shadow: by < EDGEY }) }
    }
    if (st.after) st.after(c);
  }
  function cafePlates1(c, t) { const a = TA; capS(c, TEXT.promise, 540, 300, at(t, a.nashe + .15, a.nashe + .45) * (1 - at(t, a.slovo - .35, a.slovo - .05)), { s: 50 }) }
  function cafeShot(c, t, K, tau, st) {   // K — ключи камеры или готовая камера {x, y, z, r} (фото на доске)
    const q = Array.isArray(K) ? camObj(camAt(K, t)) : K;
    layerRel(c, q, RA, .38, cc => cafeFar(cc, tau));
    layer(c, q, 1, cc => { cafeWall(cc, t); cafeWorld(cc, t, tau, st) });
    layerRel(c, q, RA, 1.22, cc => A(cc, 1 - at(Math.log(q.z), .62, 1.05), () => beamA(cc, t, tau)));   // луч с пылью — только на общих планах: при наезде на карту его нет
    return q;
  }
