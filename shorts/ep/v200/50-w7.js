  // ================= мир 7 (фраза 7): кабинет Бёрнетта — в координатах мира 1: лист на чертёжной доске = плакат щита (BB). Толстый чёрный карандаш сам рисует ковбоя (#091),
  // набросок заливается цветом, лист становится плакатом — и мир 7 незаметно меняется на щит у трассы (видно только лист), камера отъезжает (#041).
  let T7 = null, K7 = null, RIDS = null, RIDC = null, PEN7 = null;
  const NC7 = () => ({ x: BW.x + BW.wx, y: BW.y + BW.wy + (960 - 765) * (200 / 1500), m: 200 / 1500 });   // окно дома Бёрнетта (200×140) показывает кабинет 1500×1050 с центром (540, 765)
  const RB = { x0: 96, x1: 610, y0: 540, y1: 960 };   // рамка всадника на листе (мир 1)
  function w7Init() {
    const s = 's7';
    T7 = { a: SA(s), stav: Ws(s, 'ставит'), rekl: Ws(s, 'рекламу'), kov: Ws(s, 'ковбоя'), slov: Ws(s, 'словам'), sam: Ws(s, 'самый'), am: Ws(s, 'америке'), sim: Ws(s, 'символ'), muzh: Ws(s, 'мужчины'), end: SA('s8') - .02 };
    const a = T7; a.sw = a.sim - .55;   // смена мира: кадр — только лист
    K7 = [KY(a.stav + .1, 360, 770, 1.96), KY(a.kov + .2, 352, 772, 2.0), KY(a.slov + .1, 360, 740, 2.2), KY(a.sw, 380, 690, 3.3)];
    // всадник: цветной и карандашный (маска + обводка) — заранее, в 2× разрешении
    const S = 2, W = (RB.x1 - RB.x0) * S, H = (RB.y1 - RB.y0) * S; RIDC = mk(W, H); const g = RIDC.getContext('2d'); g.scale(S, S); g.translate(-RB.x0, -RB.y0); horseRider(g, BB.x + 290, BB.y + BB.h * .94, 1.5, { t: 0 });
    RIDS = mk(W, H); const h = RIDS.getContext('2d');
    for (const [dx, dy] of [[-3, 0], [3, 0], [0, -3], [0, 3], [-2, -2], [2, 2], [-2, 2], [2, -2]]) h.drawImage(RIDC, dx, dy);
    h.globalCompositeOperation = 'source-in'; h.fillStyle = '#4A4A52'; h.fillRect(0, 0, W, H); h.globalCompositeOperation = 'source-over';
    const m2 = mk(W, H), q2 = m2.getContext('2d'); q2.drawImage(RIDC, 0, 0); q2.globalCompositeOperation = 'source-in'; q2.fillStyle = '#E4DCC8'; q2.fillRect(0, 0, W, H); h.drawImage(m2, 0, 0);
    h.strokeStyle = 'rgba(74,74,82,.35)'; h.lineWidth = 2; h.globalCompositeOperation = 'source-atop'; for (let k = -H; k < W; k += 14) { h.beginPath(); h.moveTo(k, H); h.lineTo(k + H * .7, 0); h.stroke() }   // штриховка
    // путь карандаша: три прохода рядами (верх, середина, низ силуэта) — как штрихуют набросок; карандаш едет не быстрее ~1000 px/с
    const d = g.getImageData(0, 0, W, H).data, top = [], bot = [];
    for (let x = 0; x < W; x += 16) { let y0 = -1, y1 = -1; for (let y = 0; y < H; y += 3) if (d[(y * W + x) * 4 + 3] > 40) { if (y0 < 0) y0 = y; y1 = y } if (y0 >= 0) { top.push([RB.x0 + x / S, RB.y0 + y0 / S]); bot.push([RB.x0 + x / S, RB.y0 + y1 / S]) } }
    const row = f => top.map((p, i) => [p[0], lp(p[1], bot[i][1], f)]), P = [...row(.12), ...row(.5).reverse(), ...row(.86)];
    let L = 0; P.forEach((p, i) => { if (i) L += Math.hypot(p[0] - P[i - 1][0], p[1] - P[i - 1][1]); p[2] = L }); PEN7 = { P, L };
  }
  function penAt(u) { const { P, L } = PEN7, dd = u * L; let i = 1; while (i < P.length - 1 && P[i][2] < dd) i++; const a = P[i - 1], b = P[i], k = (dd - a[2]) / Math.max(1e-6, b[2] - a[2]); return [lp(a[0], b[0], k), lp(a[1], b[1], k), i] }
  function pencil(c, x, y, s = 1, ang = -.62) {   // толстый чёрный карандаш Бёрнетта: шестигранный корпус, дерево, грифель
    c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
    c.fillStyle = '#1A1A1E'; c.fillRect(-300, -16, 254, 32); c.fillStyle = '#34343C'; c.fillRect(-300, -16, 254, 9); c.fillStyle = '#0C0C0E'; c.fillRect(-300, 8, 254, 8);
    PL(c, [-46, -16, -46, 16, -6, 4, -6, -4], '#D9B38C'); PL(c, [-6, -4, -6, 4, 6, 0], '#1A1A1E'); c.fillStyle = '#B8B8C0'; c.fillRect(-312, -16, 14, 32);
    c.restore();
  }
  // лист на доске: бумага, набросок карандашом, цвет, потом весь плакат (k — сколько готово)
  function sheet7(c, t) {
    const a = T7, { x, y, w, h } = BB, T = C3;
    const ksk = at(t, a.stav - .05, a.slov - .05), kco = eio(at(t, a.slov - .1, a.slov + .45)), kbg = eio(at(t, a.slov + .25, a.sam + .45)), ktx = at(t, a.sam + .1, a.am + .1), kpk = spr(at(t, a.sam + .2, a.am + .6));
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    c.fillStyle = T.paper; c.fillRect(x, y, w, h);
    if (kbg > 0) { c.save(); c.beginPath(); c.rect(x, y + h * (1 - kbg), w, h * kbg + 1); c.clip(); c.fillStyle = T.dune; c.fillRect(x, y + h * .58, w, h * .42);
      PL(c, [x, y + h * .58, x, y + h * .42, x + 120, y + h * .42, x + 150, y + h * .5, x + 330, y + h * .5, x + 370, y + h * .58], T.rock);
      PL(c, [x + 500, y + h * .58, x + 540, y + h * .47, x + 620, y + h * .47, x + 648, y + h * .4, x + 760, y + h * .4, x + 820, y + h * .58], T.rock); c.fillStyle = T.dune2; c.fillRect(x, y + h * .8, w, h * .2); c.restore() }
    if (ktx > 0) { c.save(); c.beginPath(); c.rect(x, y, 40 + 600 * eo(ktx), 160); c.clip(); tx(c, 'Marlboro Country', x + 40, y + 84, { f: 'P', w: 700, st: 'italic', s: 66, c: T.inkB, al: 'left' }); c.restore() }
    if (kco >= 1) horseRider(c, x + 290, y + h * .94, 1.5, { t });
    else {
      if (ksk > 0) { const [px, py] = penAt(Math.min(1, ksk)); c.save(); c.beginPath(); const { P } = PEN7, n = penAt(Math.min(1, ksk))[2];
        for (let i = 0; i < n; i++) { c.moveTo(P[i][0] + 92, P[i][1]); c.arc(P[i][0], P[i][1], 92, 0, TAU) } c.moveTo(px + 92, py); c.arc(px, py, 92, 0, TAU); if (ksk >= 1) c.rect(RB.x0, RB.y0, RB.x1 - RB.x0, RB.y1 - RB.y0);
        c.clip(); c.drawImage(RIDS, RB.x0, RB.y0, RB.x1 - RB.x0, RB.y1 - RB.y0); c.restore() }
      if (kco > 0) { c.save(); c.beginPath(); c.rect(RB.x0, RB.y0, (RB.x1 - RB.x0) * kco, RB.y1 - RB.y0); c.clip(); horseRider(c, x + 290, y + h * .94, 1.5, { t }); c.restore() }
    }
    if (kpk > 0) { c.save(); c.translate(x + 771, y + 458); c.scale(kpk, kpk); c.translate(-(x + 771), -(y + 458)); mPack(c, x + 676, y + 176, 190, 282, 34, {}); c.restore() }
    c.restore();
    if (ksk > 0 && ksk < 1.05 && kco < .2) { const [px, py] = penAt(Math.min(1, ksk)); pencil(c, px + Math.sin(t * 31) * 3, py + Math.cos(t * 23) * 4, .7, -2.3) }
    else if (kco < .2 && t > a.stav - .6) { const k = eo(at(t, a.stav - .6, a.stav)), [px, py] = penAt(0); pencil(c, lp(px + 300, px, k), lp(py + 260, py, k), .7, -2.3) }
    else if (kco >= .2) { const k = eio(at(t, a.slov - .1, a.slov + .5)); pencil(c, lp(RB.x0 + 420, 760, k), lp(RB.y0 + 300, 1260, k), .7, -2.3) }
  }
  function officeW7(c, t) {   // кабинет: стена, доска с листом, стол, ваза яблок, стакан карандашей, лампа
    c.fillStyle = '#3B2A22'; c.fillRect(-600, -200, 2300, 1800); c.fillStyle = '#433027'; for (let sx = -600; sx < 1700; sx += 120) c.fillRect(sx, -200, 50, 1800);
    rr(c, BB.x - 34, BB.y - 34, BB.w + 68, BB.h + 68, 10); fill(c, '#6B4A30'); rr(c, BB.x - 34, BB.y - 34, BB.w + 68, BB.h + 68, 10); lnB(c, 3, 'rgba(255,230,190,.35)');
    sheet7(c, t);
    c.fillStyle = '#5A3A26'; c.fillRect(-600, 1110, 2300, 40); c.fillStyle = '#7A5135'; c.fillRect(-600, 1110, 2300, 10); c.fillStyle = '#3E2718'; c.fillRect(-600, 1150, 2300, 500);
    c.beginPath(); c.ellipse(150, 1100, 150, 30, 0, 0, Math.PI); c.lineTo(0, 1060); c.lineTo(300, 1060); c.closePath(); fill(c, '#C9D2DC');   // ваза
    [[70, 1040], [130, 1020], [195, 1034], [250, 1046], [105, 990], [175, 985], [230, 1000]].forEach(([ax, ay], i) => { circ(c, ax, ay, 36, i % 2 ? '#B3162C' : C3.red); c.beginPath(); c.ellipse(ax - 12, ay - 12, 9, 13, -.5, 0, TAU); fill(c, 'rgba(255,255,255,.35)'); c.fillStyle = '#3E2718'; c.fillRect(ax - 2, ay - 46, 4, 14) });
    rr(c, 860, 960, 110, 150, 10); fill(c, '#2B2F3A'); for (let i = 0; i < 6; i++) { c.save(); c.translate(880 + i * 15, 960); c.rotate(-.25 + i * .1); c.fillStyle = '#1A1A1E'; c.fillRect(-9, -190, 18, 200); PL(c, [-9, -190, 9, -190, 0, -218], '#D9B38C'); c.restore() }
    c.fillStyle = '#1A1A1E'; c.fillRect(1150, 300, 14, 820); c.save(); c.translate(1157, 300); c.rotate(-.5); rr(c, -60, -40, 120, 70, 14); fill(c, '#2B2F3A'); c.restore(); beam(c, 1120, 330, 600, 700, 30, 520, '#FFF1C8', .12);
  }
  function w7Shot(c, t) { const q = camObj(camAt(K7, t)); layer(c, q, 1, cc => officeW7(cc, t)) }
