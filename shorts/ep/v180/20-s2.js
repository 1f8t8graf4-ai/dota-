  // ================= СЦЕНА 2: фура-шторка → зал FDA и гильотина =================
  const TRK = { w: 1250, y0: 180, y1: 1530 };
  const truckX = t => lp(1400, -1400, at(t, K.truck0, K.truck1));   // левый край (кабина) едет справа налево
  function truck(c, x, t) {
    const { w, y0, y1 } = TRK, H = y1 - y0;
    // фары: длинные жёлтые конусы вперёд (влево)
    beam(c, x + 40, y1 - 260, x - 900, y1 - 160, 30, 260, '#fde047', .32); beam(c, x + 40, y1 - 420, x - 900, y1 - 420, 26, 220, '#fde047', .22);
    // кабина
    c.fillStyle = '#090d16'; poly(c, [x + 40, y1 - 120, x + 40, y0 + 420, x + 120, y0 + 260, x + 330, y0 + 240, x + 330, y1 - 120]); c.fill();
    poly(c, [x + 90, y0 + 470, x + 140, y0 + 300, x + 300, y0 + 290, x + 300, y0 + 470]); fill(c, '#1e2a44');
    poly(c, [x + 120, y0 + 450, x + 150, y0 + 330, x + 210, y0 + 320, x + 170, y0 + 450]); fill(c, 'rgba(148,163,184,.25)');
    circ(c, x + 48, y1 - 260, 22, '#fde047'); circ(c, x + 48, y1 - 420, 18, '#fde68a');
    for (let i = 0; i < 6; i++) { c.fillStyle = '#2a3550'; c.fillRect(x + 60, y1 - 330 + i * 22, 70, 10) }   // решётка радиатора
    // прицеп с металлической расшивкой
    vgrad(c, x + 340, y0, w - 340, H - 120, ['#111827', '#090d16']);
    for (let i = 0; i < 22; i++) { c.fillStyle = 'rgba(148,163,184,.08)'; c.fillRect(x + 360 + i * 41, y0 + 10, 6, H - 140) }
    c.fillStyle = 'rgba(148,163,184,.15)'; c.fillRect(x + 340, y0, w - 340, 8); c.fillRect(x + 340, y1 - 128, w - 340, 10);
    c.fillStyle = '#0b0f19'; c.fillRect(x, y1 - 130, w, 40);
    [x + 200, x + 520, x + 640, x + 1010, x + 1130].forEach(wx => { circ(c, wx, y1 - 70, 84, '#05070d'); circ(c, wx, y1 - 70, 40, '#1f2937'); circ(c, wx, y1 - 70, 14, '#4b5563') });
    c.fillStyle = 'rgba(248,113,113,.9)'; c.fillRect(x + w - 14, y1 - 300, 12, 60); glow(c, x + w - 8, y1 - 270, 60, '#ef4444', .5);
  }
  function hallBg(c, t) {   // правительственный зал: стены, панели, пилястры, печать, софиты, помост
    vgrad(c, -100, -100, WW + 200, 1460, ['#1a1625', '#231d30', '#1a1625']);
    c.save(); c.globalAlpha = .08; ring(c, 540, 640, 380, '#e2e8f0', 10); ring(c, 540, 640, 320, '#e2e8f0', 4);
    c.translate(540, 640); for (let i = 0; i < 26; i++) { const a = -Math.PI * .95 + i * .075; c.save(); c.rotate(a + Math.PI / 2); tx(c, 'FDA · DEPARTMENT OF HEALTH ·'[i] || '', 0, -350, { f: 'O', w: 700, s: 30, c: '#e2e8f0' }); c.restore() }
    c.restore(); glow(c, 540, 640, 520, '#7c2d4a', .18);
    vgrad(c, 0, 900, WW, 460, ['#2a1d22', '#22171c']);
    for (let i = 0; i < 9; i++) { c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 3; c.strokeRect(150 + i * 88, 940, 74, 380) }
    c.fillStyle = 'rgba(255,255,255,.05)'; c.fillRect(0, 900, WW, 6);
    [85, 995].forEach(px => {   // мраморные пилястры
      vgrad(c, px - 55, 0, 110, 1360, ['#cbd5e1', '#94a3b8']); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(px - 40, 0, 16, 1360);
      c.strokeStyle = 'rgba(71,85,105,.35)'; c.lineWidth = 2; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(px - 50, 200 + i * 230); c.bezierCurveTo(px - 10, 260 + i * 230, px + 10, 150 + i * 230, px + 50, 230 + i * 230); c.stroke() }
      c.fillStyle = '#e2e8f0'; c.fillRect(px - 70, 1300, 140, 60); c.fillRect(px - 70, 0, 140, 40);
    });
    beam(c, 160, -40, 470, 1300, 30, 230, '#fde68a', .12); beam(c, 920, -40, 610, 1300, 30, 230, '#fde68a', .12);
    // помост со ступенями
    vgrad(c, -100, 1360, WW + 200, 600, ['#3a2416', '#2a1a10', '#1a100a']);
    c.fillStyle = '#4a2f1d'; c.fillRect(-100, 1360, WW + 200, 18); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(-100, 1450, WW + 200, 12);
    for (let i = 0; i < 12; i++) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-60 + i * 100, 1378, 3, 560) }
    c.save(); c.translate(540, 1372); c.scale(1, .1); glow(c, 0, 0, 520, '#fde68a', .25); c.restore();
  }
  const CART = [{ x: 300, col: '#f97316', n: 'МАНГО' }, { x: 460, col: '#ec4899', n: 'ФРУКТЫ' }, { x: 620, col: '#eab308', n: 'ДЕСЕРТ' }, { x: 780, col: '#10b981', n: 'МЯТА' }];
  const CUT = 1162;   // линия среза картриджей
  function cartridge(c, x, y, w, h, col, o = {}) {   // картридж: чёрный мундштук сверху, жидкость, светлое дно; y0, y1 — какой кусок рисовать
    const y0 = o.y0 ?? y - h / 2, y1 = o.y1 ?? y + h / 2;
    c.save(); c.beginPath(); c.rect(x - w, y0, w * 2, y1 - y0); c.clip();
    rr(c, x - w / 2, y - h / 2 + h * .24, w, h * .76, w * .2); fill(c, 'rgba(226,232,240,.92)');
    rr(c, x - w / 2 + 8, y - h / 2 + h * .3, w - 16, h * .62, w * .14); fill(c, col);
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x - w / 2 + 14, y - h / 2 + h * .32, 10, h * .55);
    poly(c, [x - w * .36, y - h / 2 + h * .26, x - w * .3, y - h / 2, x + w * .3, y - h / 2, x + w * .36, y - h / 2 + h * .26]); fill(c, '#111827');
    c.restore();
    if (o.cut === 'top' || o.cut === 'bot') { c.save(); c.beginPath(); const cy = o.cut === 'bot' ? y0 : y1; for (let i = 0; i <= 8; i++) c[i ? 'lineTo' : 'moveTo'](x - w / 2 + 4 + i * (w - 8) / 8, cy + (i % 2 ? 6 : -4)); c.strokeStyle = o.jc || col; c.lineWidth = 6; c.stroke(); c.restore() }
  }
  function smallCart(c, x, y, lab, a = 1) {   // серый «разрешённый» картридж с зелёной галочкой
    if (a <= 0) return; c.save(); c.globalAlpha *= a;
    rr(c, x - 60, y + 80, 120, 78, 10); fill(c, '#3f2a1c'); tx(c, lab, x, y + 118, { f: 'O', w: 700, s: 22, c: '#e2e8f0', ls: 2 });
    cartridge(c, x, y, 80, 160, '#64748b');
    circ(c, x, y - 118, 28, '#16a34a'); c.strokeStyle = '#fff'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 12, y - 118); c.lineTo(x - 2, y - 107); c.lineTo(x + 14, y - 130); c.stroke();
    c.restore();
  }
  const bladeY = t => {   // верх лезвия: висит 460, падает за 5 кадров до низа 1290, потом поднимается
    const f = at(t, K.chop, K.chop + 5 / 30), up = eio(at(t, K.chop + .9, K.chop + 1.5));
    return lp(lp(460, 1010, f * f), 460, up);
  };
  function blade(c, y0) {   // лезвие 620 шириной: низ скошен (слева выше), белая заточка, надпись
    const L = 230, R = 850, hl = 160, hr = 280;
    c.save(); poly(c, [L, y0, R, y0, R, y0 + hr, L, y0 + hl]); const g = c.createLinearGradient(L, 0, R, 0); g.addColorStop(0, '#94a3b8'); g.addColorStop(.5, '#e2e8f0'); g.addColorStop(1, '#64748b'); c.fillStyle = g; c.fill();
    poly(c, [L, y0 + hl - 34, R, y0 + hr - 34, R, y0 + hr, L, y0 + hl]); fill(c, '#f8fafc');
    c.strokeStyle = 'rgba(15,23,42,.5)'; c.lineWidth = 3; poly(c, [L, y0, R, y0, R, y0 + hr, L, y0 + hl]); c.stroke();
    c.fillStyle = '#475569'; c.fillRect(L, y0, R - L, 26);
    c.save(); c.translate(540, y0 + 92); c.rotate(.19 * .5); tx(c, 'ЗАПРЕТ ВКУСОВ', 0, 0, { f: 'O', w: 700, s: 44, c: '#b91c1c', ls: 3 }); c.restore();
    c.restore();
  }
  function guillotine(c, t, o = {}) {   // рама, бланк с заголовком, лезвие, колодка с картриджами
    const ka = o.a ?? 1; if (ka <= 0) return; c.save(); c.globalAlpha *= ka;
    // стойки и перекладина
    [200, 880].forEach(px => { vgrad(c, px - 26, 300, 52, 1060, ['#5b3a24', '#3d2616']); c.fillStyle = '#94a3b8'; c.fillRect(px + (px < 540 ? 22 : -30), 340, 8, 960) });
    rr(c, 150, 270, 780, 70, 12); fill(c, '#4a2f1d');
    // бланк: светлое поле с заголовком
    rr(c, 232, 345, 616, 100, 8); fill(c, '#f1ead8'); tx(c, 'FDA · 2 ЯНВАРЯ 2020', 540, 397, { f: 'O', w: 700, s: 46, c: '#1e293b', ls: 2 });
    circ(c, 540, 280, 58, '#d4a017'); circ(c, 540, 280, 46, '#f5d061'); tx(c, 'FDA', 540, 282, { f: 'U', w: 800, s: 26, c: '#7c5a07' });
    const by = bladeY(t), cutDone = t > K.chop + 4 / 30;
    // верёвка к лезвию
    c.strokeStyle = '#a8a29e'; c.lineWidth = 6; c.beginPath(); c.moveTo(540, 445); c.lineTo(540, Math.max(445, by)); c.stroke();
    // картриджи: целые до удара, после — донышки в колодке
    CART.forEach((p, i) => {
      if (!cutDone) cartridge(c, p.x, 1165, 110, 210, p.col);
      else { cartridge(c, p.x, 1165, 110, 210, p.col, { y0: CUT, cut: 'bot' }); A(c, 1 - at(t, K.chop + .3, K.chop + 1.6), () => { for (let j = 0; j < 3; j++) circ(c, p.x - 30 + j * 30, CUT + 10 + ((t - K.chop) * 140 + j * 40) % 90, 6, p.col) }) }
    });
    // колодка с полукруглыми вырезами и подписями
    c.fillStyle = '#5b3a24'; c.beginPath(); c.moveTo(225, 1270); c.lineTo(225, 1192); CART.forEach(p => { c.lineTo(p.x - 64, 1192); c.arc(p.x, 1192, 64, Math.PI, 0, true) }); c.lineTo(855, 1192); c.lineTo(855, 1270); c.closePath(); c.fill();
    c.fillStyle = '#3d2616'; c.fillRect(225, 1270, 630, 72);
    CART.forEach((p, i) => { const hl = pulse2(t, [K.mango, K.fru, K.des, K.mint][i]); tx(c, p.n, p.x, 1307, { f: 'O', w: 700, s: 26 + 6 * hl, c: mixc('#f8fafc', p.col, hl), ls: 2 }) });
    blade(c, by);
    c.restore();
  }
  const pulse2 = (t, a) => at(t, a - .1, a + .05) * (1 - at(t, a + .5, a + .8));
  function cutFX(c, t) {   // разлёт верхних половинок и сок (после удара)
    const k = t - K.chop - 4 / 30; if (k < 0 || k > 2.2) return;
    CART.forEach((p, i) => {   // верхняя половинка с мундштуком — вращается и падает в сторону
      const dir = p.x < 540 ? -1 : 1, vx = dir * (260 + i % 2 * 140), vy = -520 - (i === 1 || i === 2 ? 160 : 0);
      const x = p.x + vx * k, y = 1110 + vy * k + 1300 * k * k, r = dir * k * (5 + i);
      if (y > 1440) return;
      c.save(); c.translate(x, y); c.rotate(r); cartridge(c, 0, 55, 110, 210, p.col, { y0: -50, y1: CUT - 1165 + 55, cut: 'top' }); c.restore();
    });
    for (let i = 0; i < 25; i++) {   // капли и струи сока — вверх веером
      const p = CART[i % 4], ang = -Math.PI / 2 + (H1(i * 3.1) - .5) * 2.2, v = 700 + H1(i * 7) * 600, x = p.x + Math.cos(ang) * v * k, y = CUT + Math.sin(ang) * v * k + 1500 * k * k;
      if (y > 1440 || k > 1.4) continue; const r = 9 + H1(i) * 12, vyNow = Math.sin(ang) * v + 3000 * k, ln = Math.min(60, Math.hypot(Math.cos(ang) * v, vyNow) * .04);
      c.save(); c.translate(x, y); c.rotate(Math.atan2(vyNow, Math.cos(ang) * v) - Math.PI / 2); c.globalAlpha *= 1 - at(k, .9, 1.4);
      c.beginPath(); c.ellipse(0, -ln / 2, r, r + ln / 2, 0, 0, TAU); fill(c, p.col); circ(c, -r * .3, -ln / 2 - r * .3, r * .3, 'rgba(255,255,255,.55)'); c.restore();
    }
  }
  function hallShot(c, t) {
    const sh = t > K.chop && t < K.chop + .3 ? (1 - at(t, K.chop, K.chop + .3)) * 14 : 0;
    c.save(); if (sh) c.translate(Math.sin(t * 97) * sh, Math.cos(t * 71) * sh);
    hallBg(c, t); smallCart(c, 115, 1200, 'ТАБАК'); smallCart(c, 965, 1200, 'МЕНТОЛ'); guillotine(c, t); cutFX(c, t); vignette(c, .5);
    c.restore();
  }
  function shot2(c, t) {   // фура-шторка: слева от кабины — магазин, справа от борта — зал FDA
    const x = truckX(t);
    if (t < K.truck1) {
      const div = x + TRK.w * .5;
      c.save(); c.beginPath(); c.rect(-200, -200, div + 200, HH + 400); c.clip(); shot1(c, t); c.restore();
      c.save(); c.beginPath(); c.rect(div, -200, WW + 400, HH + 400); c.clip(); hallShot(c, t); c.restore();
      truck(c, x, t);
    } else hallShot(c, t);
  }
