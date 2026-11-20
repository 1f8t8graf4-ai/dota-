  // ================= мир 1: переговорная → салон самолёта (строки 1–2) =================
  // Стык с океаном: подушечка долетает до середины кадра, фоны уезжают вверх (океан) и приходят снизу (офис), подушечка без белого кадра
  // расплющивается в светлую столешницу (flubber). Над главной фигуркой гаснут глаз / ухо / нос; на «пакетик» — фигурка в профиль, на «губу» —
  // полоса рентгена: под верхней губой белый прямоугольник. Строка 2: линза сканера — десна, жёлтые точки никотина уходят в сосуд; отъезд, призраки
  // сигареты с дымом и одноразки с паром перечёркнуты; окно скругляется в иллюминатор (flubber), офис уходит вниз, кресло становится креслом самолёта,
  // загорается табло ремней. Нырок в иллюминатор — мир 2 (облака → Швеция), вложен в иллюминатор (N2).
  let T1 = null, K1 = null;
  const WIN1 = { x: 760, y: 600 }, WIN1B = { x: 840, y: 960 }, N2 = { x: 840, y: 960, m: .188 }, HEAD1 = { x: 1012, y: 1028, R: 54 }, PEL1 = [1010, 1300];
  const TABLE1 = [[70, 1110], [830, 1110], [900, 1270], [-20, 1270]];   // главная фигурка сидит в торце стола справа, колени — под столом
  function officeInit() {
    const w1 = q => Ws('s1', q), w2 = q => Ws('s2', q);
    T1 = { s1: SA('s1'), vid: w1('видно'), sly: w1('слышно'), pah: w1('пахнут'), pak: w1('пакетик'), gub: w1('губу'), vse: w1('всё'),
      s2: SA('s2'), shch: w2('щиплет'), nik: w2('никотин'), krov: w2('кровь'), nee: w2('неё'), stor: w2('стороны'), zam: w2('заметно'),
      dym: w2('дыма'), par: w2('пара'), sov: w2('совещании'), sam: w2('самолёте'), s3: SA('s3') };
    const a = T1; a.sw = T0.sw; a.mEnd = a.s1 + .3; a.cab0 = a.sov + .45; a.cab1 = a.cab0 + .75; a.dive = a.s3 + .55;
    K1 = [KY(a.sw, 540, 960, 1.0), KY(a.s1 + 1.0, 590, 980, 1.04), KY(a.pah, 680, 980, 1.1), KY(a.pak + .1, 950, 1000, 1.75), KY(a.gub, 975, 1028, 2.3),
      KY(a.shch, 952, 1050, 3.3), KY(a.krov + .3, 950, 1034, 3.4), KY(a.stor, 930, 1010, 3.0), KY(a.zam + .2, 560, 1000, 1.05), KY(a.par + .2, 590, 990, 1.08),
      KY(a.cab0, 760, 1010, 1.18), KY(a.cab1 + .2, 850, 1000, 1.5), KY(a.s3 + .15, 846, 985, 2.0), KY(a.dive, N2.x, N2.y, 1 / N2.m)];
  }
  const kCab = t => eio(at(t, T1.cab0, T1.cab1));
  const tableShape = () => { const o = []; const P = TABLE1; for (let s = 0; s < 4; s++) { const A0 = P[s], B0 = P[(s + 1) % 4]; for (let i = 0; i < 30; i++) o.push([lp(A0[0], B0[0], i / 30), lp(A0[1], B0[1], i / 30)]) } return o };
  let TBL = null;
  function officeWall(c, t, kc) {
    c.fillStyle = mixc(C5.office, C5.cabin, kc); c.fillRect(-900, -1200, 2900, 2500);
    c.fillStyle = mixc(C5.officeD, '#8E8A9C', kc); c.fillRect(-900, 1300, 2900, 1400);   // пол
    c.fillStyle = 'rgba(0,0,0,.05)'; for (let x = -900; x < 2000; x += 240) c.fillRect(x, -1200, 6, 2500);
    if (kc > 0) {   // салон: потолочные панели и полоса багажных полок
      c.save(); c.globalAlpha *= kc; c.fillStyle = '#C9C4BA'; c.fillRect(-900, 260, 2900, 120); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-900, 372, 2900, 6);
      for (let x = -900; x < 2000; x += 300) { c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(x, 260, 4, 120) } c.restore() }
  }
  function cityView(c, t, dy) {   // вид из окна переговорной: дневной город (уезжает вниз, когда «самолёт» взлетает)
    c.save(); c.translate(0, dy); vgrad(c, 300, 200, 900, 800, ['#BFD9EE', '#E4EFF7']);
    for (let i = 0; i < 9; i++) { const x = 440 + i * 70 + (H1(i) - .5) * 20, h = 160 + H1(i * 3.3) * 260, w = 54 + H1(i * 1.7) * 30; c.fillStyle = i % 2 ? C5.city : C5.cityD; c.fillRect(x, 940 - h, w, h + 400);
      c.fillStyle = 'rgba(255,255,255,.35)'; for (let yy = 940 - h + 14; yy < 930; yy += 26) for (let xx = x + 8; xx < x + w - 8; xx += 16) c.fillRect(xx, yy, 7, 10) }
    c.restore();
  }
  function winShape(t) { const k = kCab(t), P = morph('w2p', shRR(560, 560, 16), shRR(300, 440, 150))(k), cx = lp(WIN1.x, WIN1B.x, k), cy = lp(WIN1.y, WIN1B.y, k); return P.map(([x, y]) => [x + cx, y + cy]) }
  function officeWindow(c, t) {
    const k = kCab(t), P = winShape(t), cx = lp(WIN1.x, WIN1B.x, k), cy = lp(WIN1.y, WIN1B.y, k), F = P.map(([x, y]) => [cx + (x - cx) * 1.12, cy + (y - cy) * 1.12]);
    castDots(c, cx - 200, cy - 230, 400, 470, 90, { k: .6 * (1 - k) }); pathOf(c, F); fill(c, mixc('#F7F5F0', '#E9E6DE', k)); pathOf(c, F); lnB(c, 3, 'rgba(20,23,51,.25)');
    c.save(); pathOf(c, P); c.clip();
    inNest(c, N2, cc => swedenWorld(cc, t, true));   // облака мира 2 — за иллюминатором
    if (k < 1) cityView(c, t, 900 * eio(k));
    if (k < .6) { c.save(); c.globalAlpha *= 1 - at(k, 0, .6); c.fillStyle = '#F7F5F0'; c.fillRect(cx - 6, cy - 300, 12, 600); c.fillRect(cx - 300, cy - 6, 600, 12); c.restore() }   // переплёт уходит
    c.fillStyle = 'rgba(255,255,255,.12)'; poly(c, [cx - 200, cy + 300, cx - 120, cy + 300, cx + 60, cy - 300, cx - 20, cy - 300]); c.fill();
    c.restore(); pathOf(c, P); lnB(c, 3, 'rgba(20,23,51,.3)');
  }
  function seatedFront(c, x, y, s, col) { fig(c, x, y, s, { m: 1, col }) }
  function mainPose(t) {   // главная фигурка сидит в профиль, лицом влево (поза в своей системе: «вперёд» = +x, потом зеркало вокруг x = 960)
    const kc = kCab(t), br = Math.sin(t * 1.4) * .012, [px, py] = PEL1;
    return { s: 1.5, pel: [px, py], lean: -.03 + br - .08 * kc, neck: -.06, shL: lp(1.05, .55, kc), elL: lp(.85, 1.25, kc), shR: lp(1.15, .5, kc), elR: lp(.8, 1.3, kc),
      ankL: [px + 160, py + 236], ankR: [px + 140, py + 236], ftL: 0, ftR: 0 };
  }
  function chair1(c, t) {   // кресло: офисное → кресло самолёта (спинка выше, с подголовником, синяя обивка)
    const k = kCab(t), [px, py] = PEL1, back = morph('chair', shRR(70, 230, 14), shRR(170, 460, 40))(k).map(([x, y]) => [x + px + 62 + 30 * k, y + lp(py - 115, py - 200, k)]);
    pathOf(c, back); fill(c, mixc('#3A3F55', C5.seat, k)); c.save(); pathOf(c, back); c.clip(); c.fillStyle = mixc('#2C3045', C5.seatD, k); c.fillRect(px + 92 + 30 * k, py - 700, 200, 900); c.restore(); pathOf(c, back); lnB(c, 3, B2.ln);
    rr(c, px - 100, py - 10, 230, lp(30, 60, k), 14); fill(c, mixc('#3A3F55', C5.seat, k)); rr(c, px - 100, py - 10, 230, lp(30, 60, k), 14); lnB(c, 3, B2.ln);
    if (k < 1) { c.save(); c.globalAlpha *= 1 - k; rr(c, px + 5, py + 20, 18, 190, 6); fill(c, '#2C3045'); rr(c, px - 80, py + 206, 190, 14, 6); fill(c, '#2C3045'); c.restore() }
  }
  function officeTable(c, t, drop, part) {   // стол и три фигурки за ним; drop — уезжает вниз (салон); part: 'back' — фигурки, 'top' — столешница
    if (drop >= 1) return; c.save(); c.translate(0, 900 * ei(drop));
    if (part === 'back') { [[200, '#EDE7DA'], [400, '#F4F1EA'], [600, '#E8E2D4']].forEach(([x, col], i) => { const by = Math.sin(t * 1.2 + i) * 3; seatedFront(c, x, 1222 + by, 2.0, col) }); c.restore(); return }
    const kf = eo(at(t, T1.mEnd - .05, T1.mEnd + .3));   // кромка и ножки вырастают, когда подушечка стала столешницей
    if (kf > 0) { poly(c, [-20, 1270, 900, 1270, 900, 1270 + 42 * kf, -20, 1270 + 42 * kf]); fill(c, C5.tableE); for (const x of [30, 846]) { rr(c, x, 1300, 26, 272 * kf, 6); fill(c, C5.tableE) } }
    if (t >= T1.mEnd) { if (!TBL) TBL = tableShape(); celPts(c, TBL, C5.table, { sw: .12, ha: .3 }) }
    c.restore();
  }
  function icon5(c, kind, x, y, k, kx, sc = 1) {   // значок в белом круге; kx — красная черта; sc — размер
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(bo(k) * sc, bo(k) * sc); circ(c, 4, 6, 52, 'rgba(0,0,0,.25)'); circ(c, 0, 0, 52, '#F7F5F0'); ring(c, 0, 0, 52, B2.navy, 3);
    c.strokeStyle = B2.navy; c.lineWidth = 6; c.lineCap = 'round'; c.lineJoin = 'round';
    if (kind === 'eye') { c.beginPath(); c.moveTo(-30, 0); c.quadraticCurveTo(0, -26, 30, 0); c.quadraticCurveTo(0, 26, -30, 0); c.stroke(); circ(c, 0, 0, 9, B2.navy) }
    else if (kind === 'ear') { c.beginPath(); c.moveTo(-10, 26); c.bezierCurveTo(-30, 10, -22, -30, 4, -28); c.bezierCurveTo(28, -26, 26, 4, 8, 12); c.bezierCurveTo(0, 18, 4, 26, -4, 30); c.stroke(); c.beginPath(); c.moveTo(-2, -8); c.quadraticCurveTo(10, -14, 12, -2); c.stroke() }
    else if (kind === 'nose') { c.beginPath(); c.moveTo(-4, -30); c.quadraticCurveTo(-8, 4, -22, 16); c.quadraticCurveTo(-6, 26, 10, 18); c.stroke(); c.beginPath(); c.moveTo(14, -10); c.quadraticCurveTo(24, -6, 22, 2); c.stroke() }
    else if (kind === 'cig') { rr(c, -34, -7, 68, 14, 4); stroke(c, B2.navy, 4); c.fillStyle = '#E8A35A'; c.fillRect(14, -7, 20, 14) }
    else if (kind === 'vape') { rr(c, -10, -32, 20, 64, 8); stroke(c, B2.navy, 4); c.fillStyle = '#7CC4E0'; c.fillRect(-10, 6, 20, 26) }
    if (kx > 0) { c.beginPath(); c.moveTo(-36, 36); c.lineTo(lp(-36, 36, eo(kx)), lp(36, -36, eo(kx))); c.strokeStyle = '#D6334D'; c.lineWidth = 9; c.stroke() }
    c.restore();
  }
  function xrayBand(c, t) {   // полоса рентгена по голове: на «губу» встаёт над ртом, на «всё» уходит; под губой — белый прямоугольник
    const a = T1, h = HEAD1, k1 = eio(at(t, a.gub - .45, a.gub + .05)), k2 = eio(at(t, a.vse - .05, a.vse + .45)); if (k1 <= 0 || k2 >= 1) return;
    const bx = lp(h.x + 170, h.x - 10, k1) + lp(0, -280, k2), bw = 150;
    c.save(); c.beginPath(); c.rect(bx - bw / 2, h.y - 150, bw, 300); c.clip();
    c.fillStyle = 'rgba(16,40,72,.88)'; c.fillRect(bx - bw / 2, h.y - 150, bw, 300);
    c.beginPath(); c.arc(h.x, h.y, h.R, 0, TAU); lnB(c, 2.5, 'rgba(190,230,255,.75)');   // череп в профиль, лицом влево: челюсть, зубы, подушечка над передними зубами
    c.beginPath(); c.moveTo(h.x + h.R * .6, h.y + h.R * .3); c.quadraticCurveTo(h.x + h.R * .1, h.y + h.R * 1.05, h.x - h.R * .85, h.y + h.R * .72); lnB(c, 3, 'rgba(190,230,255,.6)');
    for (let i = 0; i < 5; i++) { rr(c, h.x - h.R * .92 + i * 11, h.y + h.R * .44, 9, 15, 2); fill(c, 'rgba(220,240,255,.85)') }   // зубы
    rr(c, h.x - h.R * 1.0, h.y + h.R * .14, 36, 18, 6); fill(c, '#FFFFFF'); glow(c, h.x - h.R * .7, h.y + h.R * .22, 40, '#FFFFFF', .4);
    c.restore(); c.save(); c.fillStyle = 'rgba(126,214,207,.9)'; c.fillRect(bx - bw / 2 - 4, h.y - 150, 4, 300); c.fillRect(bx + bw / 2, h.y - 150, 4, 300); c.restore();
  }
  function gumLens(c, t) {   // строка 2: линза сканера у рта — десна, подушечка, точки никотина уходят в сосуд и бегут вверх
    const a = T1, h = HEAD1, k = eo(at(t, a.shch - .35, a.shch + .1)) * (1 - eio(at(t, a.stor - .1, a.stor + .35))); if (k <= 0) return;
    const cx = h.x - h.R * .55, cy = h.y + h.R * .3, R = 92 * bo(Math.min(1, k * 1.2));
    c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip(); c.fillStyle = '#12223F'; c.fillRect(cx - R, cy - R, R * 2, R * 2);
    c.beginPath(); c.moveTo(cx - R, cy + 8); c.bezierCurveTo(cx - 40, cy - 14, cx + 30, cy + 26, cx + R, cy + 4); c.lineTo(cx + R, cy + R); c.lineTo(cx - R, cy + R); c.closePath(); fill(c, C5.gum);
    c.fillStyle = C5.gumD; c.fillRect(cx - R, cy + 52, R * 2, R);
    for (let i = 0; i < 4; i++) { rr(c, cx - 70 + i * 34, cy + 18, 26, 44, 8); fill(c, '#F4F1EA') }   // зубы
    rr(c, cx - 64, cy - 30, 76, 34, 12); fill(c, C5.pouch); rr(c, cx - 64, cy - 30, 76, 34, 12); lnB(c, 2, 'rgba(20,23,51,.3)');   // подушечка у десны
    const vx = cx + 44; c.beginPath(); c.moveTo(vx - 30, cy + R); c.bezierCurveTo(vx - 30, cy + 20, vx + 10, cy - 10, vx + 6, cy - R); lnB(c, 12, C5.vessel); c.beginPath(); c.moveTo(vx - 30, cy + R); c.bezierCurveTo(vx - 30, cy + 20, vx + 10, cy - 10, vx + 6, cy - R); lnB(c, 4, '#F08A9B');
    for (let i = 0; i < 14; i++) {   // никотин: из подушечки — сквозь десну — в сосуд и вверх
      const u = cl((t - a.nik - i * .1) / 1.6); if (u <= 0) continue; const ph = (t * .6 + i * .37) % 1;
      let px, py; if (u < .5) { const e = u / .5; px = lp(cx - 50 + (i % 5) * 12, vx - 24, e); py = lp(cy - 14, cy + 30, e) } else { const e = (u - .5) / .5 + ph * .3; px = vx - 22 + 26 * e + Math.sin(i) * 3; py = lp(cy + 30, cy - R - 10, Math.min(1, e)) }
      circ(c, px, py, 5, C5.nic); circ(c, px, py, 9, 'rgba(255,210,63,.25)') }
    c.restore(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); lnB(c, 5, '#7ED6CF'); c.beginPath(); c.arc(cx, cy, R + 8, 0, TAU); lnB(c, 2, 'rgba(126,214,207,.45)');
  }
  function ghosts(c, t) {   // над столом: сигарета с дымом и одноразка с паром — призраки, перечёркнуты
    const a = T1, out = at(t, a.sov - .1, a.sov + .3);
    [[a.dym, 'cig', 330, 720], [a.par, 'vape', 760, 720]].forEach(([w, kind, x, y]) => { const k = at(t, w - .2, w + .15); if (k <= 0 || out >= 1) return;
      c.save(); c.globalAlpha *= .9 * (1 - out); const yy = y - 10 * Math.sin(t * 2);
      const puff = (px, py, r, col) => { for (let i = 0; i < 4; i++) { const u = ((t * .5 + i * .25) % 1); circ(c, px + Math.sin(i * 2 + t) * 14 * u, py - u * 90, r * (.6 + u), `rgba(${col},${.35 * (1 - u)})`) } };
      if (kind === 'cig') { puff(x + 70, yy - 20, 26, '200,200,210'); icon5(c, 'cig', x, yy, k, at(t, w + .1, w + .35), 1.6) } else { puff(x, yy - 70, 28, '220,240,255'); icon5(c, 'vape', x, yy, k, at(t, w + .1, w + .35), 1.6) }
      c.restore() });
  }
  function beltSign(c, t) {   // табло «пристегнуть ремни» на потолочной панели
    const k = kCab(t); if (k <= 0) return; const on = at(t, T1.sam - .1, T1.sam + .05);
    c.save(); c.globalAlpha *= k; c.translate(720, 470); c.scale(1.5, 1.5); c.translate(-675, -322); rr(c, 600, 290, 150, 64, 12); fill(c, '#2A2E3A'); rr(c, 610, 298, 130, 48, 9); fill(c, mixc('#3A3F4C', '#FFE8A3', on));
    c.strokeStyle = on > .5 ? '#2A2E3A' : '#6B7080'; c.lineWidth = 5; c.lineCap = 'round'; circ(c, 650, 310, 7, c.strokeStyle); c.beginPath(); c.moveTo(650, 318); c.lineTo(650, 336); c.stroke();
    c.beginPath(); c.moveTo(672, 316); c.lineTo(712, 316); c.moveTo(672, 330); c.lineTo(712, 330); c.stroke(); rr(c, 684, 310, 16, 26, 4); c.stroke();
    if (on > 0) glow(c, 675, 322, 120, '#FFE8A3', .3 * on); c.restore();
  }
  function officeWorld(c, t, q) {
    const a = T1, kc = kCab(t);
    officeWall(c, t, kc); officeWindow(c, t); beltSign(c, t);
    const drop = eio(at(t, a.cab0 - .1, a.cab1 - .1)); officeTable(c, t, drop, 'back');
    chair1(c, t);
    const P = mainPose(t); mirrorX(c, PEL1[0], () => { castDots(c, PEL1[0] - 60, PEL1[1] + 222, 140, 14, 120, {}); drawRig(c, P) });
    officeTable(c, t, drop, 'top');
    xrayBand(c, t); gumLens(c, t); ghosts(c, t);
    [[a.vid, 'eye', 330], [a.sly, 'ear', 540], [a.pah, 'nose', 750]].forEach(([w, kind, x]) => icon5(c, kind, x, 700, at(t, w - .25, w + .1) * (1 - at(t, a.pak - .2, a.pak + .2)), at(t, w + .05, w + .35), 1.35));
  }
  function officeShot(c, t) {
    const a = T1, q = camObj(camAt(K1, t)), e = eio(at(t, a.sw, a.sw + .5));
    if (e < 1) {   // стык: океан уезжает вверх, офис приходит снизу; подушечка в середине кадра расплющивается в столешницу
      c.save(); c.translate(0, -HH * e); oceanWorld(c, t, camObj(camAt(K0, t))); c.restore();
      c.save(); c.translate(0, HH * (1 - e)); layer(c, q, 1, cc => officeWorld(cc, t, q)); c.restore();
    } else layer(c, q, 1, cc => officeWorld(cc, t, q));
    const km = eio(at(t, a.sw, a.mEnd));
    if (km < 1) {   // подушечка → столешница: в экранных координатах (камера офиса на стыке стоит в (540, 960), z = 1)
      if (!TBL) TBL = tableShape(); const f = flyPouch(a.sw, camObj(camAt(K0, a.sw)));
      const src = shRR(f.w, f.h, f.h * .38).map(([x, y]) => [x + f.x, y + f.y]), P = morph('p2t', src, TBL)(km);
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); const qq = q, sx = x => (x - qq.x) * qq.z + 540, sy = y => (y - qq.y) * qq.z + 960;
      const PS = P.map(([x, y]) => [lp(x, sx(x), km), lp(y, sy(y), km)]); celPts(c, PS, mixc(C5.pouch, C5.table, km), { sw: lp(.22, .2, km), ha: .3 }); c.restore();
    }
  }
