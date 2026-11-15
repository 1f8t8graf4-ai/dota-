  // ================= СЦЕНА 9: пробковая доска и две концовки =================
  const CARDS = [
    { id: '1979', x: 340, y: 400, a: '1979', b: 'СОЛЬ', open: true },
    { id: '2020', x: 740, y: 400, a: '2020', b: 'ЛАЗЕЙКА ОДНОРАЗОК', open: true },
    { id: '2014', x: 230, y: 790, a: '2014', b: 'НАГРЕВАТЕЛИ' },
    { id: '1924', x: 540, y: 805, a: '1924', b: '«МАЛЬБОРО»' },
    { id: '2022', x: 850, y: 790, a: '2022', b: 'ШАЙБЫ' },
  ];
  const CW = 270, CH = 330, PH = 240;
  const photoC = cd => [cd.x, cd.y - CH / 2 + 15 + PH / 2];
  const pinP = cd => [cd.x, cd.y - CH / 2 + 4];
  let CORK = null;
  function corkImg() {
    if (CORK) return CORK; CORK = mk(WW, 1400); const g = CORK.getContext('2d');
    g.fillStyle = '#a0703f'; g.fillRect(0, 0, WW, 1400);
    for (let i = 0; i < 9000; i++) { const x = H1(i * 1.3) * WW, y = H1(i * 2.7) * 1400, r = .8 + H1(i * 5.1) * 2.6; g.fillStyle = H1(i * 7.7) > .5 ? 'rgba(70,40,15,.35)' : 'rgba(225,180,120,.30)'; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill() }
    for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(40,20,5,.35)'; g.beginPath(); g.arc(H1(i * 3.3) * WW, H1(i * 9.1) * 1400, 3, 0, TAU); g.fill() }
    return CORK;
  }
  function boardWall(c, t) {   // стена, рама доски, пробка, софит; ниже — стол с лампой и ноутбуком
    vgrad(c, -1200, -1200, WW + 2400, 5200, ['#1c1917', '#292524', '#1c1917']);
    c.save(); rr(c, 30, 150, WW - 60, 1050, 14); fill(c, '#5b3a1e'); rr(c, 52, 172, WW - 104, 1006, 8); c.clip(); c.drawImage(corkImg(), 0, 0); c.restore();
    rr(c, 30, 150, WW - 60, 1050, 14); stroke(c, '#3b2414', 8);
    const sw = Math.sin(t * 1.25) * .2, bx = 540 + Math.sin(sw) * 1300;   // софит качается маятником
    c.fillStyle = '#111827'; c.fillRect(530, -200, 20, 60); beam(c, 540, -150, bx, 1200, 60, 620, '#fde68a', .18); glow(c, lp(540, bx, .55), 640, 520, '#fde68a', .12);
    c.save(); c.globalCompositeOperation = 'source-over'; const g = c.createRadialGradient(lp(540, bx, .5), 620, 100, lp(540, bx, .5), 700, 900); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)'); c.fillStyle = g; c.fillRect(30, 150, WW - 60, 1050); c.restore();
  }
  function photo1979(c, t, x, y, s) {   // колба и голубой кристалл соли
    vgrad(c, x - s / 2, y - s / 2, s, s, ['#1e293b', '#0f172a']); glow(c, x, y, s * .6, '#38bdf8', .25);
    c.save(); c.translate(x - s * .12, y + s * .08); c.scale(s / 240, s / 240);
    poly(c, [-14, -80, 14, -80, 14, -30, 60, 60, -60, 60, -14, -30]); fill(c, 'rgba(186,230,253,.25)'); c.strokeStyle = '#e0f2fe'; c.lineWidth = 4; c.stroke();
    poly(c, [-38, 20, 38, 20, 56, 56, -56, 56]); fill(c, 'rgba(56,189,248,.7)');
    c.restore();
    c.save(); c.translate(x + s * .24, y + s * .2); c.scale(s / 240, s / 240); poly(c, [0, -34, 26, -10, 18, 26, -18, 26, -26, -10]); fill(c, '#7dd3fc'); poly(c, [0, -34, 26, -10, 0, 0]); fill(c, '#e0f2fe'); c.restore();
  }
  function sil(c, id, x, y, s) {   // тёмные силуэты закрытых карточек
    c.save(); c.translate(x, y); c.scale(s / 240, s / 240); c.fillStyle = '#334155';
    if (id === '2014') { rr(c, -22, -90, 44, 180, 14); c.fill(); rr(c, -12, -120, 24, 40, 8); c.fill() }
    else if (id === '1924') { rr(c, -14, -100, 28, 200, 6); c.fill(); c.fillRect(-14, -100, 28, 34) }
    else { c.beginPath(); c.ellipse(0, 10, 80, 30, 0, 0, TAU); c.fill(); c.fillRect(-80, -20, 160, 30); c.beginPath(); c.ellipse(0, -20, 80, 30, 0, 0, TAU); fill(c, '#475569') }
    c.restore();
  }
  function marker(c, x, y, s, seed) {   // фактурные полосы чёрного маркера крест-накрест
    c.save(); c.translate(x, y); c.lineCap = 'round';
    [[-1, -.62], [1, .55], [-1, .1]].forEach(([d, off], i) => { c.save(); c.rotate(d * .62 + (H1(seed + i) - .5) * .1); c.strokeStyle = 'rgba(10,10,12,.94)'; c.lineWidth = s * .2; c.beginPath(); c.moveTo(-s * .62, off * s * .25); c.lineTo(s * .62, off * s * .25); c.stroke();
      c.strokeStyle = 'rgba(60,60,70,.35)'; c.lineWidth = 3; for (let j = 0; j < 4; j++) { c.beginPath(); c.moveTo(-s * .6, off * s * .25 - s * .08 + j * s * .05); c.lineTo(s * .6, off * s * .25 - s * .08 + j * s * .05); c.stroke() } c.restore() });
    c.restore();
  }
  // 3-я глава, кадр 0: белая сигарета с красным ободком на тёмно-синем фоне ар-деко
  function ep3Frame(c, t) {
    c.fillStyle = '#0f172a'; c.fillRect(-200, -200, WW + 400, HH + 400);
    const g = c.createRadialGradient(540, 860, 0, 540, 860, 1000); g.addColorStop(0, '#1e3a8a'); g.addColorStop(.5, '#172554'); g.addColorStop(1, '#0f172a'); c.fillStyle = g; c.fillRect(-200, -200, WW + 400, HH + 400);
    c.save(); c.translate(540, 860); for (let i = 0; i < 24; i++) { c.save(); c.rotate(i * TAU / 24); poly(c, [0, 0, -40, -1400, 40, -1400]); fill(c, i % 2 ? 'rgba(212,160,23,.07)' : 'rgba(212,160,23,.03)'); c.restore() }
    [260, 360, 470].forEach((r, i) => { c.beginPath(); c.arc(0, 0, r, Math.PI * 1.1, Math.PI * 1.9); stroke(c, rgba('#d4a017', .35 - i * .08), 4) }); c.restore();
    c.save(); c.strokeStyle = 'rgba(212,160,23,.35)'; c.lineWidth = 4; [[0, 0], [WW, 0], [0, HH], [WW, HH]].forEach(([qx, qy]) => { c.save(); c.translate(qx, qy); c.scale(qx ? -1 : 1, qy ? -1 : 1); for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(40 + i * 26, 230); c.lineTo(40 + i * 26, 40 + i * 26); c.lineTo(230, 40 + i * 26); c.stroke() } c.restore() }); c.restore();
    glow(c, 540, 860, 420, '#fde68a', .14);
    c.save(); c.translate(540, 860); c.save(); c.translate(30, 40); rr(c, -38, -330, 76, 660, 20); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, -38, -330, 76, 660, 20); fill(c, '#f8fafc'); c.fillStyle = 'rgba(203,213,225,.6)'; c.fillRect(14, -330, 16, 660);
    rr(c, -38, -330, 76, 70, 20); fill(c, '#e11d48'); c.fillStyle = '#be123c'; c.fillRect(-38, -270, 76, 10);
    c.restore();
  }
  function cardDraw(c, t, cd, o = {}) {
    const [px, py] = photoC(cd);
    c.save(); c.translate(cd.x + 8, cd.y + 12); rr(c, -CW / 2, -CH / 2, CW, CH, 6); fill(c, 'rgba(0,0,0,.35)'); c.restore();
    rr(c, cd.x - CW / 2, cd.y - CH / 2, CW, CH, 6); fill(c, '#f5f0e6');
    c.save(); c.beginPath(); c.rect(px - PH / 2, py - PH / 2, PH, PH); c.clip();
    if (cd.id === '1979') photo1979(c, t, px, py, PH);
    else if (cd.id === '2020') { c.save(); c.translate(px, py); c.scale(PH / 1040, PH / 1040); c.translate(-620, -880); shot8(c, t); c.restore() }
    else if (cd.id === '1924' && o.ep3) { c.save(); c.translate(px, py); c.scale(PH / 1080, PH / 1080); c.translate(-540, -860); ep3Frame(c, t); c.restore() }
    else { c.fillStyle = '#1e293b'; c.fillRect(px - PH / 2, py - PH / 2, PH, PH) }
    if (!cd.open) {   // закрыто: тёмный силуэт и маркер (у 1924 — стирается помадой по диагонали)
      c.save(); if (o.wipe !== undefined) { const d = o.wipe; c.beginPath(); c.moveTo(px - PH, py - PH + d * 4 * PH); c.lineTo(px + PH * 2, py - PH * 4 + d * 4 * PH); c.lineTo(px + PH * 2, py + PH * 2); c.lineTo(px - PH, py + PH * 2); c.closePath(); c.clip() }
      c.fillStyle = '#1e293b'; c.fillRect(px - PH / 2, py - PH / 2, PH, PH); sil(c, cd.id, px, py, PH); marker(c, px, py, PH, cd.x); c.restore();
    }
    c.restore();
    tx(c, cd.a, cd.x, cd.y + CH / 2 - 46, { f: 'O', w: 700, s: 30, c: '#1e293b' });
    if (o.sub) flipLabel(c, cd.b, o.sub, cd.x, cd.y + CH / 2 - 18, o.subA, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW - 24 }, { f: 'M', w: 800, s: 18, c: '#b91c1c', mw: CW - 24 }, 1);
    else tx(c, cd.b, cd.x, cd.y + CH / 2 - 18, { f: 'M', w: 800, s: 18, c: '#475569', mw: CW - 24 });
    if (o.q > 0) { const [qx, qy] = photoC(cd); c.save(); c.translate(qx, qy); c.scale(o.q, o.q); tx(c, '?', 0, 4, { f: 'U', w: 800, s: 150, c: '#fbbf24', sw: 10, sc: '#78350f' }); c.restore() }
    if (!o.noPin) pin(c, ...pinP(cd));
  }
  function pin(c, x, y) { circ(c, x + 3, y + 5, 14, 'rgba(0,0,0,.35)'); circ(c, x, y, 14, '#dc2626'); circ(c, x - 4, y - 4, 5, '#fca5a5') }
  function thread(c, a, b, k = 1) { if (k <= 0) return; const [x1, y1] = pinP(a), [x2, y2] = pinP(b); c.save(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1 + 3, y1 + 6); c.lineTo(lp(x1, x2, k) + 3, lp(y1, y2, k) + 6); c.stroke(); c.strokeStyle = '#dc2626'; c.lineWidth = 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, k), lp(y1, y2, k)); c.stroke(); c.restore() }
  function board(c, t, o = {}) {
    boardWall(c, t);
    const C0 = CARDS, th = o.th || [1, 1, 1];   // нити от 2020 к 2014, 1924, 2022
    thread(c, C0[0], C0[1]);
    [[C0[2], 0], [C0[3], 1], [C0[4], 2]].forEach(([cd, i]) => thread(c, C0[1], cd, eo(th[i])));
    const wob = { '2014': o.wob?.[0], '1924': o.wob?.[1], '2022': o.wob?.[2] };
    if (o.hl > 0) { const cd = C0[1]; glow(c, cd.x, cd.y, 300, '#fde68a', .45 * o.hl) }
    C0.forEach(cd => { if (o.skip === cd.id) return; const w = wob[cd.id] || 0, [px, py] = pinP(cd);
      c.save(); if (w) { c.translate(px, py); c.rotate(w); c.translate(-px, -py) } cardDraw(c, t, cd, { ...(o.card && o.card[cd.id] || {}), noPin: true, q: o.q?.[cd.id] || 0 }); c.restore() });
    [C0[0], C0[1], C0[3], C0[2], C0[4]].forEach(cd => { if (!(o.card && o.card[cd.id] && o.card[cd.id].noPin)) pin(c, ...pinP(cd)) });
  }
  function boardS(t) {   // шортс: нити рисуются по очереди, карточка качается на кнопке, вспыхивает золотой «?»
    const th = [], wob = [], q = {};
    ['2014', '1924', '2022'].forEach((id, i) => { const t0 = K.th0 + i * 1.2; th.push(at(t, t0, t0 + .9)); const d = t - t0 - .9; wob.push(d > 0 ? .1 * Math.sin(d * 9) * Math.exp(-d * 2.2) : 0); q[id] = bo(at(t, t0 + .85, t0 + 1.25)) });
    return { th, wob, q, hl: at(t, K.hl0, K.hl0 + .3) * (1 - at(t, K.th0 + 2.2, K.th0 + 2.6)) * (.75 + .25 * Math.sin(t * 6)) };
  }
  // ---------- переход от общежития к карточке 2020 (отъезд камеры) ----------
  function zoomOutTo2020(c, t, drawBoard) {
    const k = eio(at(t, K.b0, K.zo1)), p = PH / 1040, [pcx, pcy] = photoC(CARDS[1]);
    const z = Math.exp(lp(Math.log(1 / p), 0, k)), F0 = [pcx - p * 80, pcy + p * 80], F = [lp(F0[0], 540, k), lp(F0[1], 960, k)];
    // если z меняется по экспоненте, а F — линейно, точка фото «плывёт»; поправка: держим фото там, где оно было бы при чистом отъезде
    c.save(); c.translate(540, 960); c.scale(z, z); c.translate(-F[0], -F[1]);
    drawBoard(c);
    const kc = at(k, 0, .45);   // фото: от всего кадра 8-й сцены до квадрата
    if (kc < 1) {
      const fx0 = pcx - 620 * p, fy0 = pcy - 880 * p, w0 = WW * p, h0 = HH * p, R = [lp(fx0, pcx - PH / 2, kc), lp(fy0, pcy - PH / 2, kc), lp(w0, PH, kc), lp(h0, PH, kc)];
      c.save(); c.beginPath(); c.rect(...R); c.clip(); c.translate(pcx, pcy); c.scale(p, p); c.translate(-620, -880); shot8(c, t); c.restore();
    }
    c.restore();
  }
  // ---------- концовка А (шортс): штамп, спуск к ноутбуку, зум в кадр 0 ----------
  const LAP = { x: 540, y: 2360, vw: 180, vh: 320 };   // прямоугольник видео на экране ноутбука (мир)
  let F0C = null;
  function frame0In(c, x, y, w, h, sx, sy, sw2, sh2) {   // кадр 0 векторно: экран ноутбука целиком в его фоне, без чёрных полос
    c.save(); c.beginPath(); c.rect(sx, sy, sw2, sh2); c.clip(); c.translate(x, y); c.scale(w / WW, h / HH); shot1(c, 0); yearPill(c, 2020, 2020, 1, 1, true); c.restore();
  }
  function deskWorld(c, t) {   // под доской: стол, лампа, силуэт со спины, ноутбук с роликом
    vgrad(c, -400, 1700, WW + 800, 1600, ['#3a2414', '#2a1a0f', '#1a100a']); c.fillStyle = '#4a2f1d'; c.fillRect(-400, 1700, WW + 800, 16);
    c.save(); c.translate(150, 1700); c.fillStyle = '#1f2937'; c.fillRect(-10, -420, 20, 420); c.save(); c.translate(0, -420); c.rotate(.5); rr(c, -14, -10, 240, 22, 10); c.fill(); c.translate(230, 0); c.rotate(.6); poly(c, [-50, -20, 50, -20, 80, 60, -80, 60]); fill(c, '#334155'); c.restore(); c.restore();
    beam(c, 330, 1440, 540, 2600, 50, 520, '#fde68a', .14); glow(c, 540, 2300, 700, '#fde68a', .10);
    // ноутбук
    const { x, y, vw, vh } = LAP, SW = 640, SH = 400;
    rr(c, x - SW / 2 - 18, y - SH / 2 - 18, SW + 36, SH + 36, 18); fill(c, '#111827');
    frame0In(c, x - vw / 2, y - vh / 2, vw, vh, x - SW / 2, y - SH / 2, SW, SH);
    c.fillStyle = '#18181b'; c.fillRect(x - SW / 2, y - SH / 2, SW, 30); circ(c, x - SW / 2 + 20, y - SH / 2 + 15, 6, '#ef4444');
    c.fillStyle = '#3f3f46'; c.fillRect(x - SW / 2 + 20, y + SH / 2 - 22, SW - 40, 6); c.fillStyle = '#ef4444'; c.fillRect(x - SW / 2 + 20, y + SH / 2 - 22, (SW - 40) * .96, 6);
    poly(c, [x - SW / 2 - 60, y + SH / 2 + 18, x + SW / 2 + 60, y + SH / 2 + 18, x + SW / 2 + 140, y + SH / 2 + 110, x - SW / 2 - 140, y + SH / 2 + 110]); fill(c, '#374151');
    // силуэт со спины (капюшон, плечи) — слева, не заслоняет экран
    c.fillStyle = '#05060a'; c.beginPath(); c.ellipse(x - 420, y + 210, 230, 300, 0, Math.PI, TAU); c.fill(); c.fillRect(x - 650, y + 210, 460, 600); c.beginPath(); c.ellipse(x - 420, y - 40, 120, 140, 0, 0, TAU); c.fill();
    vignette(c, 0);
  }
  function endA(c, t) {
    const kd = eio(at(t, K.down0, K.down1)), kz = eio(at(t, K.zA0, K.endT));
    if (kz >= 1) { firstFrame(c); return }
    const sk = t > K.stamp ? 16 * (1 - at(t, K.stamp, K.stamp + .45)) : 0, shx = Math.sin(t * 93) * sk, shy = Math.cos(t * 71) * sk;
    const drawAll = cc => { board(cc, t, boardS(t)); stampYT(cc, t); deskWorld(cc, t) };
    if (t < K.zo1) { zoomOutTo2020(c, t, drawAll); return }
    const Fy = lp(960, LAP.y, kd), z = Math.exp(lp(0, Math.log(HH / LAP.vh), kz));
    c.save(); c.translate(540 + shx, 960 + shy); c.scale(z, z); c.translate(-540, -Fy); drawAll(c); c.restore();
    vignette(c, .35 * (1 - kz));
  }
  function stampYT(c, t) {
    const k = at(t, K.stamp - .25, K.stamp); if (k <= 0) return;
    const s = lp(2.6, 1, ei(k));
    c.save(); c.translate(540, 1075); c.rotate(-.05); c.scale(s, s);
    rr(c, -330, -48, 660, 96, 14); fill(c, 'rgba(220,38,38,.12)'); rr(c, -330, -48, 660, 96, 14); stroke(c, '#dc2626', 7);
    tx(c, '▶ ТОЛЬКО НА YOUTUBE', 0, 3, { f: 'U', w: 800, s: 44, c: '#dc2626' }); c.restore();
  }
  // ---------- концовка Б (мостик в 3-ю главу): криптекс 1·9·2·4 → помада → фото 1924 → зум ----------
  const C24 = CARDS[3];
  function cryptex(c, x, y, len, r, rings, o = {}) {   // золотой цилиндр: rings — значения 0…9.99 (дробное — прокрутка)
    c.save(); c.translate(x, y); c.rotate(r);
    const H = 95, g = c.createLinearGradient(0, -H / 2, 0, H / 2); g.addColorStop(0, '#fde68a'); g.addColorStop(.35, '#d4a017'); g.addColorStop(1, '#78530a');
    rr(c, -len / 2, -H / 2, len, H, 18); c.fillStyle = g; c.fill();
    if (rings) rings.forEach((v, i) => { const rx = -len / 2 + 60 + i * (len - 120) / 3; rr(c, rx - 30, -H / 2 - 6, 60, H + 12, 10); fill(c, '#b8860b'); c.save(); rr(c, rx - 26, -H / 2, 52, H, 8); c.clip(); const fl = Math.floor(v), fr = v - fl;
      [0, 1].forEach(j => tx(c, String((fl + j) % 10), rx, (j - fr) * 62, { f: 'U', w: 800, s: 40, c: '#3b2a05' })); c.restore() });
    [-1, 1].forEach(sd => { rr(c, sd > 0 ? len / 2 - 18 : -len / 2 - 22, -H / 2 - 10, 40, H + 20, 12); fill(c, '#a16207') });
    c.restore();
  }
  function lipstick(c, x, y, r, kcap, kout) {   // золотой футляр 1920-х (вертикальный), колпачок снимается, помада выкручивается
    c.save(); c.translate(x, y); c.rotate(r);
    const g = c.createLinearGradient(-48, 0, 48, 0); g.addColorStop(0, '#78530a'); g.addColorStop(.4, '#fde68a'); g.addColorStop(1, '#a16207');
    const bh = 110 * kout;
    if (bh > 0) { c.save(); c.beginPath(); c.moveTo(-30, -40); c.lineTo(-30, -40 - bh); c.lineTo(30, -40 - bh - 34); c.lineTo(30, -40); c.closePath(); fill(c, '#e11d48'); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(-24, -40 - bh, 8, bh); c.restore() }
    rr(c, -48, -50, 96, 230, 14); c.fillStyle = g; c.fill(); c.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 6; i++) c.fillRect(-48, -10 + i * 28, 96, 3);
    if (kcap < 1) { c.save(); c.translate(kcap * 520, -kcap * 1300); c.rotate(kcap * 2.4); rr(c, -50, -180, 100, 140, 16); c.fillStyle = g; c.fill(); c.restore() }
    c.restore();
  }
  function endB(c, t) {
    const kz1 = eio(at(t, K.b0 + 1.45, K.b0 + 2.6));   // доска → карточка 1924
    const kZ = eio(at(t, K.nezh - .2, K.ledi + 1.6));    // карточка → фото 3-й главы
    if (kZ >= 1) { ep3Frame(c, t); ep3Pill(c, 1); return }
    const p = PH / 1080, [pcx, pcy] = photoC(C24);
    const zc = 2.6, Fc = [540, C24.y + 5];
    const zE = 1 / p, FE = [pcx - p * 0, pcy + p * 100];
    let z = Math.exp(lp(0, Math.log(zc), kz1)), F = [lp(540, Fc[0], kz1), lp(960, Fc[1], kz1)];
    if (kZ > 0) { z = Math.exp(lp(Math.log(zc), Math.log(zE), kZ)); const u = (1 / z - 1 / zc) / (1 / zE - 1 / zc); F = [lp(Fc[0], FE[0], u), lp(Fc[1], FE[1], u)] }
    const wipe = at(t, K.vyv - .2, K.vyv + .7);
    const ops = { card: { '1924': { ep3: true, wipe: wipe > 0 ? wipe : undefined, noPin: t > K.vperv - .9, sub: 'МЯГКИЕ, КАК МАЙ · 1924', subA: at(t, K.vyv + .5, K.vyv + .9) } } };
    if (t < K.zo1) { zoomOutTo2020(c, t, cc => board(cc, t, {})); return }
    c.save(); c.translate(540, 960); c.scale(z, z); c.translate(-F[0], -F[1]);
    board(c, t, ops);
    if (kZ > 0) {   // фото раскрывается из квадрата во весь кадр 3-й главы
      const kc = at(kZ, .55, 1), R = [lp(pcx - PH / 2, pcx - 540 * p, kc), lp(pcy - PH / 2, pcy - 860 * p, kc), lp(PH, WW * p, kc), lp(PH, HH * p, kc)];
      c.save(); c.beginPath(); c.rect(...R); c.clip(); c.translate(pcx, pcy); c.scale(p, p); c.translate(-540, -860); ep3Frame(c, t); c.restore();
    }
    // красный росчерк помады по карточке
    const tail = at(kZ, 0, .5);   // росчерк втягивается за помадой, а не растворяется
    if (wipe > 0 && tail < wipe) { c.save(); c.strokeStyle = '#e11d48'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); const n = 40; for (let i = Math.ceil(n * tail); i <= n * wipe; i++) { const u = i / n; c.lineTo(lp(pcx - 120, pcx + 120, u) + Math.sin(u * 9) * 6, lp(pcy - 150, pcy + 110, u)) } c.stroke(); c.restore() }
    c.restore();
    // криптекс и помада — в экранных координатах (над карточкой)
    const [sx, sy] = [(pinP(C24)[0] - F[0]) * z + 540, (pinP(C24)[1] - F[1]) * z + 960];
    const kp = eio(at(t, K.vperv - .9, K.vperv - .3)), kg = eo(at(t, K.vperv - .5, K.vperv + .1));
    const rl = i => { const k = eio(at(t, K.vperv + .15 + i * .32, K.vperv + .5 + i * .32)); return lp([2, 0, 2, 0][i] + 10, [1, 9, 2, 4][i] + 10 + (i === 1 ? 0 : 10), k) % 10 };
    const kv = eio(at(t, K.brut - .35, K.brut + .2)), kcap = eio(at(t, K.vek - .25, K.vek + .2)), kout = eo(at(t, K.vek + .1, K.vek + .5));
    const kexit = eio(at(t, K.vyv + .7, K.vyv + 1.15));
    if (kz1 > 0 && t >= K.vperv - .9 && kexit < 1) {
      if (kv <= 0) {
        if (kp < 1 && kg <= 0) { c.save(); c.translate(sx, sy); c.scale(lp(1, .3, kp), 1); circ(c, 0, 0, 14 * z * .7, '#dc2626'); c.restore() }
        cryptex(c, sx, sy, lp(80, 360, kg), 0, kg > .6 ? [0, 1, 2, 3].map(rl) : null);
      } else {
        // поворот вертикально → футляр помады, проходит по карточке наискось, уходит вправо
        const sw = eio(at(t, K.vyv - .2, K.vyv + .7)), [pcxS, pcyS] = [(pcx - F[0]) * z + 540, (pcy - F[1]) * z + 960];
        const lx = lp(lp(sx, pcxS - 330, kv), lp(pcxS - 330, pcxS + 330, sw), at(sw, 0, 1)) + kexit * 700, ly = lp(lp(sy, pcyS - 420, kv), pcyS + 300, sw) - kexit * 200;
        if (kv < 1) cryptex(c, lp(sx, lx, kv), lp(sy, ly, kv), 360, kv * Math.PI / 2, null);   // криптекс встаёт вертикально — он того же размера, что футляр помады
        else lipstick(c, lx, ly, lp(0, -.7, sw), kcap, kout);
      }
    }
  }
  function ep3Pill(c, a) { c.save(); c.setTransform(1, 0, 0, 1, 0, -220 * (1 - eo(a))); yearPill(c, 1924, 1924, 1, 1, true); c.restore() }
